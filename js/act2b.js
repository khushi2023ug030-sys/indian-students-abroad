/* Minds Adrift v3 · A0 where they land: scroll USA → Canada → UK, campus towers on a tilted map */
(() => {
  const svg = d3.select('#ustack'); if (svg.empty() || !window.WORLD) return;
  const fmt = d3.format(','), fmtIN = window.MA.fmtIN;
  const C = [
    { k: 'USA', id: '840', n: 337630, share: 25.3, box: [[-125, 24], [-66, 49.5]], proj: () => d3.geoAlbers(),
      label: 'international students, 2024/25',
      src: 'Towers: Open Doors 2025 Fast Facts (IIE), 15 largest hosts of international students, all nationalities, 2024/25 · Indian students: MEA reply to Parliament, 2024',
      U: [['New York University', -73.997, 40.729, 27532], ['Northeastern', -71.089, 42.339, 22465], ['Columbia', -73.962, 40.807, 20733], ['Arizona State', -111.93, 33.42, 20368],
        ['USC', -118.285, 34.022, 17884], ['Illinois Urbana-Champaign', -88.227, 40.102, 16144], ['North Texas', -97.15, 33.21, 12982], ['Purdue', -86.92, 40.42, 12874],
        ['Boston University', -71.105, 42.35, 12845], ['UC Berkeley', -122.26, 37.87, 12020], ['Michigan', -83.74, 42.28, 11929], ['Washington', -122.30, 47.655, 10962],
        ['Johns Hopkins', -76.62, 39.33, 10863], ['UCLA', -118.445, 34.069, 10769], ['UC San Diego', -117.234, 32.88, 10545]] },
    { k: 'Canada', id: '124', n: 427000, share: 32.0, box: [[-128, 41.5], [-60, 54]], proj: () => d3.geoConicConformal().parallels([44, 52]).rotate([96, 0]),
      label: 'study permits issued to the campus, 2023',
      src: 'Towers: IRCC, Inquiry of Ministry tabled in the House of Commons, Feb 2024: study permits issued in 2023 by institution (via Epoch Times) · Indian students: MEA reply to Parliament, 2024',
      U: [['Conestoga College', -80.49, 43.45, 40565], ['University of Toronto', -79.40, 43.66, 31380], ['Seneca College', -79.35, 43.80, 23530], ['University Canada West', -123.12, 49.28, 22375],
        ['UBC', -123.25, 49.26, 20415], ['Centennial College', -79.23, 43.78, 20370], ['Lambton College', -82.40, 42.98, 18195], ['Fanshawe College', -81.23, 43.01, 17015],
        ['Humber College', -79.6, 43.73, 14605], ['York University', -79.50, 43.77, 14295]] },
    { k: 'UK', id: '826', sy: .66,  n: 185000, share: 13.8, box: [[-8.5, 49.9], [2, 58.7]], proj: () => d3.geoAlbers().center([0, 54.5]).rotate([3, 0]).parallels([50, 58]),
      label: 'international students, 2023/24',
      src: 'Towers: HESA 2023/24, five English universities with the most international students (via The PIE News) · Indian students: MEA reply to Parliament, 2024',
      U: [['UCL', -0.134, 51.525, 27695], ['Manchester', -2.234, 53.467, 19475], ['Hertfordshire', -0.24, 51.75, 19235], ["King's College London", -0.116, 51.511, 15850], ['Leeds', -1.553, 53.807, 15605]] }];
  const feats = topojson.feature(WORLD, WORLD.objects.countries).features;
  const W = 640, Hh = 380, MAX = 40565, HMAX = 190, RX = 9, RY = 4.5;
  const root = svg.append('g').attr('transform', 'translate(30,215)');
  C.forEach(c => { const SY = c.sy || .5;
    const f = feats.find(x => x.id === c.id), bb = { type: 'MultiPoint', coordinates: [c.box[0], [c.box[1][0], c.box[0][1]], c.box[1], [c.box[0][0], c.box[1][1]], [(c.box[0][0] + c.box[1][0]) / 2, c.box[1][1]]] };
    c.p = c.proj().fitSize([W, Hh], bb); const path = d3.geoPath(c.p);
    c.g = root.append('g').attr('opacity', 0);
    const clip = 'uc' + c.k; c.g.append('clipPath').attr('id', clip).append('rect').attr('x', -10).attr('y', -40).attr('width', W + 20).attr('height', Hh + 80);
    [[16, 'rgba(15,17,21,.06)'], [8, '#b9c0cc'], [0, '#dde1e8']].forEach(([dy, fill]) => c.g.append('path').datum(f).attr('d', path).attr('fill', fill).attr('clip-path', `url(#${clip})`).attr('transform', `matrix(1,0,0,${SY},0,${dy - (SY - .5) * Hh})`));
    /* towers, with same-city clusters spread into a short row */
    const T = c.U.map(([n, lo, la, v], i) => { const [x, y] = c.p([lo, la]); return { n, v, i, x, y: y * SY - (SY - .5) * Hh, h: v / MAX * HMAX, k: 0 }; });
    const used = new Set();
    T.forEach(t => { if (used.has(t)) return; const cl = T.filter(o => !used.has(o) && Math.hypot(o.x - t.x, o.y - t.y) < 22); cl.forEach(o => used.add(o));
      if (cl.length > 1) { const cx = d3.mean(cl, o => o.x), cy = d3.mean(cl, o => o.y); cl.sort((a, b) => b.v - a.v).forEach((o, j) => { o.x = cx + (j - (cl.length - 1) / 2) * 21; o.y = cy + (j % 2) * 6; }); } });
    c.T = T;
    c.tw = c.g.append('g').selectAll('g').data([...T].sort((a, b) => a.y - b.y)).join('g').attr('class', 't').attr('transform', t => `translate(${t.x},${t.y})`);
    c.tw.append('ellipse').attr('rx', RX + 3).attr('ry', RY + 1.5).attr('fill', 'rgba(15,17,21,.14)');
    ['side', 'front', 'win', 'roof'].forEach(k => c.tw.append('path').attr('class', k));
    c.tw.filter(t => t.i === 0).append('text').attr('class', 'tl').attr('text-anchor', t => t.x > W * .6 ? 'end' : 'start').attr('x', t => t.x > W * .6 ? RX : -RX);
    const tip = document.getElementById('tip');
    c.tw.on('mousemove', (e, t) => { tip.innerHTML = `<b>${fmt(t.v)}</b>${t.n}<br><span style="opacity:.6">${c.label}</span>`; tip.style.opacity = 1; tip.style.left = (e.clientX + 16) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; })
      .on('mouseleave', () => tip.style.opacity = 0);
  });
  function paint(c) { c.tw.each(function (t) { const h = t.h * t.k, el = d3.select(this);
    const D = 6, w = RX;
    el.select('.front').attr('d', `M${-w},0 V${-h} H${w} V0z`);
    el.select('.side').attr('d', `M${w},0 L${w + D},${-D} V${-h - D} L${w},${-h}z`);
    let win = ''; for (let yy = -9; yy > -h + 6; yy -= 8) win += `M${-w + 3},${yy}H${w - 3}`; if (h > 14) win += `M0,${-h + 5}V-3`;
    el.select('.win').attr('d', win);
    el.select('.roof').attr('d', h > 2 ? `M${-w - 2},${-h} L${D / 2},${-h - 9} L${w + D},${-h - D} L${w + 2},${-h}z` : ''); el.select('.tl').attr('y', -h - 16).text(t.k > .98 ? `${t.n} · ${fmt(t.v)}` : '');
    el.attr('opacity', t.k > .01 ? 1 : 0); }); }
  const cnt = document.getElementById('ucnt'), lab = document.getElementById('ulab'), sh = document.getElementById('ush'), src = document.getElementById('usrc'), uq = document.getElementById('uq');
  const tabs = [...document.querySelectorAll('#utabs button')];
  let cur = -1; const num = { v: 0 };
  function show(i) {
    if (i === cur) return; const prev = cur; cur = i; const c = C[i];
    tabs.forEach((b, j) => b.classList.toggle('on', j === i));
    C.forEach((o, j) => { gsap.killTweensOf(o.T); gsap.killTweensOf(o.g.node()); if (j !== i) { o.T.forEach(t => t.k = 0); paint(o); gsap.set(o.g.node(), { opacity: 0 }); } });
    gsap.fromTo(c.g.node(), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45 });
    c.T.forEach(t => t.k = 0); paint(c);
    [...c.T].sort((a, b) => b.v - a.v).forEach((t, j) => gsap.to(t, { k: 1, duration: 1, delay: .25 + j * .06, ease: 'elastic.out(1,.6)', onUpdate: () => paint(c) }));
    gsap.to(num, { v: c.n, duration: 1.1, ease: 'power2.out', onUpdate: () => cnt.textContent = fmtIN(Math.round(num.v)) });
    lab.textContent = `Indian students in ${c.k === 'USA' ? 'the USA' : c.k === 'UK' ? 'the UK' : c.k}, 2024`;
    sh.innerHTML = `That is <b>${c.share}%</b> of all Indian students abroad.`;
    uq.textContent = c.k === 'Canada' ? 'Towers count study permits issued to each campus, all nationalities. Indian numbers per campus are not published.' : 'Towers count all international students. How many are Indian at each campus is not published.';
    src.textContent = c.src;
  }
  tabs.forEach((b, j) => b.addEventListener('click', () => { const st = ScrollTrigger.getById('uland'); if (st && window.__lenis) window.__lenis.scrollTo(st.start + (st.end - st.start) * (j / 3 + .05), { duration: 1 }); else show(j); }));
  if (window.MA.REDUCE) { show(0); C[0].T.forEach(t => t.k = 1); paint(C[0]); return; }
  ScrollTrigger.create({ id: 'uland', trigger: '#s07u', start: 'top top', end: '+=240%', pin: true,
    onEnter: () => cur < 0 && show(0), onUpdate: s => show(Math.min(2, Math.floor(s.progress * 3))) });
})();
