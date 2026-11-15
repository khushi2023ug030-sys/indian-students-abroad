/* Minds Adrift v3 · night globe engine (three.js r159, classic build).
   Dot-matrix land, a cobalt rim glow, great-circle tubes with light particles.
   window.Globe3D.make(el, opts) → { setFocus(lon, lat), addArc(...), group, render } */
(() => {
  if (!window.THREE) return;
  const T = window.THREE, DEG = Math.PI / 180;
  const v3 = (lon, lat, r) => new T.Vector3(r * Math.cos(lat * DEG) * Math.cos(lon * DEG), r * Math.sin(lat * DEG), -r * Math.cos(lat * DEG) * Math.sin(lon * DEG));
  function landMask() {
    // rasterise land once into an equirectangular canvas, then sample it
    const W = 720, H = 360, c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d'), proj = d3.geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
    const land = topojson.merge(WORLD, WORLD.objects.countries.geometries);
    ctx.fillStyle = '#000'; ctx.beginPath(); d3.geoPath(proj, ctx)(land); ctx.fill();
    const px = ctx.getImageData(0, 0, W, H).data;
    return (lon, lat) => { const x = Math.floor((lon + 180) / 360 * W), y = Math.floor((90 - lat) / 180 * H); return px[(Math.min(H - 1, y) * W + Math.min(W - 1, x)) * 4 + 3] > 128; };
  }
  function make(el, o = {}) {
    const R = 1, w = el.clientWidth, h = el.clientHeight;
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(1.5, devicePixelRatio || 1)); renderer.setSize(w, h); el.appendChild(renderer.domElement);
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, w / h, .1, 100); cam.position.set(0, 0, o.dist || 4.2);
    const group = new T.Group(); scene.add(group);
    // dark core
    group.add(new T.Mesh(new T.SphereGeometry(R * .995, 64, 64), new T.MeshBasicMaterial({ color: o.core || 0x0b0f1a })));
    // land as dots
    const isLand = landMask(), pts = [];
    for (let lat = -58; lat <= 80; lat += 1.25) { const step = 1.25 / Math.max(.25, Math.cos(lat * DEG)); for (let lon = -180; lon < 180; lon += step) if (isLand(lon, lat)) pts.push(v3(lon, lat, R)); }
    const dotGeo = new T.BufferGeometry().setFromPoints(pts);
    group.add(new T.Points(dotGeo, new T.PointsMaterial({ color: o.dots || 0x8796c4, size: .0135, sizeAttenuation: true, transparent: true, opacity: .9 })));
    // rim glow (fresnel)
    const glow = new T.Mesh(new T.SphereGeometry(R * 1.1, 64, 64), new T.ShaderMaterial({
      uniforms: { c: { value: new T.Color(o.glow || 0x2445ff) } }, transparent: true, side: T.BackSide, blending: T.AdditiveBlending, depthWrite: false,
      vertexShader: 'varying vec3 n; void main(){ n = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: 'uniform vec3 c; varying vec3 n; void main(){ float i = pow(max(0., .66 - dot(n, vec3(0,0,1.))), 4.0) * .55; gl_FragColor = vec4(c, 1.) * i; }' }));
    scene.add(glow);
    const arcs = [], sparks = [];
    const sparkTex = (() => { const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(160,178,255,.9)'); r.addColorStop(1, 'rgba(36,69,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(s); })();
    function marker(lon, lat, color = 0xffffff, size = .05) {
      const sp = new T.Sprite(new T.SpriteMaterial({ map: sparkTex, color, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
      sp.position.copy(v3(lon, lat, R * 1.005)); sp.scale.setScalar(size); group.add(sp); return sp;
    }
    function addArc(from, to, weight = 1, opts = {}) {
      const a = v3(from[0], from[1], R), b = v3(to[0], to[1], R), d = a.distanceTo(b);
      const mid = a.clone().add(b).multiplyScalar(.5).normalize().multiplyScalar(R + .18 + d * .28);
      const curve = new T.QuadraticBezierCurve3(a, mid, b);
      const tube = new T.Mesh(new T.TubeGeometry(curve, 96, .002 + .0042 * weight, 8, false), new T.MeshBasicMaterial({ color: opts.color || 0x94a3ff, transparent: true, opacity: .75, blending: T.AdditiveBlending, depthWrite: false }));
      tube.geometry.setDrawRange(0, 0); group.add(tube);
      const n = Math.max(1, Math.round(weight * 5)), ps = [];
      for (let k = 0; k < n; k++) { const s = new T.Sprite(new T.SpriteMaterial({ map: sparkTex, color: 0xffffff, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); s.scale.setScalar(.035 + .02 * weight); s.visible = false; group.add(s); ps.push({ s, o: k / n }); }
      const arc = { curve, tube, ps, p: 0, total: tube.geometry.index.count, speed: .12 + Math.random() * .05, from: marker(from[0], from[1], 0xc2cbff, .045 + .02 * weight) };
      arcs.push(arc); return arc;
    }
    let rotY = 0, rotX = 0, tgtY = 0, tgtX = 0, spin = 0, drag = null;
    function setFocus(lon, lat = 15) { tgtY = (-90 - lon) * DEG; tgtX = lat * DEG * .6; }
    el.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ry: tgtY, rx: tgtX }; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', e => { if (!drag) return; tgtY = drag.ry + (e.clientX - drag.x) * .006; tgtX = Math.max(-.8, Math.min(.8, drag.rx + (e.clientY - drag.y) * .004)); });
    el.addEventListener('pointerup', () => drag = null);
    const clock = new T.Clock(); let alive = true, visible = true;
    function resize() { const W = el.clientWidth, H = el.clientHeight; renderer.setSize(W, H); cam.aspect = W / H; cam.updateProjectionMatrix(); }
    addEventListener('resize', resize); new ResizeObserver(resize).observe(el); renderer.domElement.style.display = 'block';
    function frame() {
      if (!alive) return; requestAnimationFrame(frame); if (!visible) return;
      const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime;
      if (!drag) tgtY += spin * dt;
      rotY += (tgtY - rotY) * .06; rotX += (tgtX - rotX) * .06; group.rotation.set(rotX, rotY, 0);
      arcs.forEach(a => {
        if (a.pT != null) a.p = a.pT > a.p ? Math.min(a.pT, a.p + dt * .9) : Math.max(a.pT, a.p - dt * 3);
        a.tube.geometry.setDrawRange(0, Math.floor(a.total * a.p));
        a.ps.forEach(q => { q.s.visible = a.p >= 1; if (!q.s.visible) return; const u = (t * a.speed + q.o) % 1; q.s.position.copy(a.curve.getPoint(u)); q.s.material.opacity = Math.sin(u * Math.PI); });
      });
      renderer.render(scene, cam);
    }
    frame();
    return { group, arcs, addArc, marker, setFocus, setSpin: s => spin = s, setVisible: v => visible = v, v3, cam, renderer, el };
  }
  window.Globe3D = { make };
})();
