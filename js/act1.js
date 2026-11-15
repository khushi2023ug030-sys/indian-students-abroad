/* Minds Adrift · Act I · S01 globe + S02 states */
(() => {
  const { fmtIN } = window.MA, D = window.DATA, tip = document.getElementById('tip');
  const showTip = (e, html) => { tip.innerHTML = html; tip.style.opacity = 1; tip.style.left = (e.clientX + 16) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; };
  const hideTip = () => tip.style.opacity = 0;

  /* stepper: pinned section; step index from scroll progress; each change triggers a tween (not scrubbed) */
  function stepper(sel, ids, len, onStep) {
    let cur = -1;
    const set = i => {
      if (i === cur) return; const prev = cur; cur = i;
      ids.forEach((id, k) => gsap.to('#' + id, { opacity: k === i ? 1 : 0, y: k === i ? 0 : (k < i ? -16 : 16), duration: .55, ease: 'power2.out', overwrite: true }));
      onStep(i, prev);
    };
    ScrollTrigger.create({ trigger: sel, start: 'top top', end: '+=' + len + '%', pin: true, onUpdate: s => set(Math.min(ids.length - 1, Math.floor(s.progress * ids.length * .999))), onEnter: () => set(Math.max(cur, 0)), onEnterBack: () => {} });
    return set;
  }

  /* ================= S01 · GLOBE ================= */
  const svg = d3.select('#globe'), SZ = 800, R0 = 350;
  const proj = d3.geoOrthographic().scale(R0).translate([SZ / 2, SZ / 2]).clipAngle(90).precision(.5);
  const path = d3.geoPath(proj);
  const countries = topojson.feature(window.WORLD, window.WORLD.objects.countries).features;
  const total = D.total;
  const destBy = {}; D.dest.forEach(d => { if (d.map) destBy[d.map] = d });
  svg.append('circle').attr('cx', SZ / 2).attr('cy', SZ / 2).attr('r', R0).attr('fill', '#fff').attr('stroke', 'rgba(15,17,21,.12)');
  const grat = svg.append('path').datum(d3.geoGraticule10()).attr('fill', 'none').attr('stroke', 'rgba(15,17,21,.06)');
  const land = svg.append('g').selectAll('path').data(countries).join('path')
    .attr('fill', d => d.properties.name === 'India' ? 'rgba(36,69,255,.16)' : 'rgba(15,17,21,.09)')
    .attr('stroke', d => d.properties.name === 'India' ? '#2445FF' : '#fff').attr('stroke-width', d => d.properties.name === 'India' ? 1.2 : .5)
    .on('mousemove', (e, d) => { const x = destBy[d.properties.name]; if (x) showTip(e, `<b>${fmtIN(x.v)}</b>${x.k} · ${(x.v / total * 100).toFixed(1)}% of all`); else if (d.properties.name !== 'India') showTip(e, `${d.properties.name}<br><span style="opacity:.6">not in top 20</span>`); })
    .on('mouseleave', hideTip);
  const wmax = Math.sqrt(427000);
  const arcs = D.dest.map(d => ({ d, interp: d3.geoInterpolate(D.india, d.ll), w: 1 + 9 * Math.sqrt(d.v) / wmax, prog: 0, op: 0 }));
  const arcG = svg.append('g').attr('fill', 'none').attr('stroke-linecap', 'round');
  const arcEls = arcG.selectAll('path').data(arcs).join('path').attr('stroke', '#2445FF').attr('stroke-width', a => a.w);
  const dotG = svg.append('g');
  const dots = dotG.selectAll('g').data(arcs).join('g').style('cursor', 'pointer')
    .on('mousemove', (e, a) => showTip(e, `<b>${fmtIN(a.d.v)}</b>${a.d.k} · ${(a.d.v / total * 100).toFixed(1)}% of all`)).on('mouseleave', hideTip);
  dots.append('circle').attr('r', a => 3 + 26 * Math.sqrt(a.d.v) / wmax).attr('fill', '#2445FF').attr('fill-opacity', .85);
  dots.append('text').attr('font-family', 'Plex').attr('font-weight', 600).attr('font-size', 12).attr('letter-spacing', '.08em').attr('fill', '#0F1115')
    .attr('x', a => 8 + 26 * Math.sqrt(a.d.v) / wmax).attr('y', 4).text(a => a.d.k.toUpperCase());
  const home = svg.append('g'); home.append('circle').attr('r', 7).attr('fill', '#2445FF'); home.append('circle').attr('r', 16).attr('fill', 'none').attr('stroke', '#2445FF').attr('stroke-opacity', .35);
  const st = { lam: -79, phi: -22, sc: 1 };
  function render() {
    proj.rotate([st.lam, st.phi]).scale(R0 * st.sc);
    land.attr('d', path); grat.attr('d', path);
    arcEls.attr('d', a => { if (a.prog <= 0) return null; const n = 48, pts = d3.range(0, n + 1).map(i => a.interp(i / n * a.prog)); return path({ type: 'LineString', coordinates: pts }); }).attr('stroke-opacity', a => a.op);
    const c = [-st.lam, -st.phi];
    dots.attr('transform', a => { const p = proj(a.d.ll); return `translate(${p[0]},${p[1]})` })
      .attr('opacity', a => (d3.geoDistance(a.d.ll, c) < Math.PI / 2 ? 1 : 0) * Math.min(1, a.prog * 1.4) * (a.op > 0 ? Math.max(.35, a.op) : 0));
    dots.select('text').attr('opacity', a => a.label ? 1 : 0);
    const h = proj(D.india); home.attr('transform', `translate(${h[0]},${h[1]})`).attr('opacity', d3.geoDistance(D.india, c) < Math.PI / 2 ? 1 : 0);
  }
  render();
  /* steps: centre lon/lat, which arcs on (by name), opacity map */
  const S = [
    { c: [79, 22], on: [] },
    { c: [-10, 62], on: ['Canada', 'USA'] },
    { c: [75, 5], on: ['Canada', 'USA', 'UK', 'Australia'] },
    { c: [40, 30], on: D.dest.map(d => d.k), free: true }
  ];
  let spin = null;
  const tN = document.getElementById('t-n'), tP = document.getElementById('t-p'), tal = { v: 0 };
  function goStep(i) {
    const s = S[i]; if (spin) { spin.kill(); spin = null; }
    document.getElementById('tally').style.opacity = i === 0 ? 0 : 1;
    let dl = (-s.c[0]) - st.lam; dl = ((dl + 540) % 360) - 180;
    gsap.to(st, { lam: st.lam + dl, phi: -s.c[1], duration: 1.6, ease: 'power3.inOut', onUpdate: render, onComplete: () => { if (s.free && !window.MA.REDUCE) spin = gsap.to(st, { lam: '+=360', duration: 90, ease: 'none', repeat: -1, onUpdate: render }); } });
    arcs.forEach(a => {
      const on = s.on.includes(a.d.k), op = !on ? 0 : (s.focus ? (s.focus.includes(a.d.k) ? 1 : .18) : (s.free ? .25 + .75 * Math.sqrt(a.d.v) / wmax : 1));
      a.label = on && (s.focus ? s.focus.includes(a.d.k) : (s.free ? a.d.v >= 100000 : true));
      gsap.to(a, { prog: on ? 1 : 0, op, duration: on ? 1.4 : .5, delay: on ? .5 : 0, ease: 'power2.inOut', onUpdate: render });
    });
    const sum = D.dest.filter(d => s.on.includes(d.k)).reduce((x, d) => x + d.v, 0);
    gsap.to(tal, { v: sum, duration: 1.2, ease: 'power2.out', onUpdate: () => { tN.textContent = fmtIN(tal.v); tP.textContent = (tal.v / total * 100).toFixed(1) + '%'; } });
  }
  stepper('#s01', ['g1', 'g2', 'g3', 'g5'], 340, i => goStep(i));
  /* drag to rotate (any time) */
  svg.call(d3.drag().on('start', () => { if (spin) { spin.kill(); spin = null; } }).on('drag', e => { st.lam += e.dx * .35; st.phi = Math.max(-80, Math.min(80, st.phi - e.dy * .35)); render(); }));

  /* ================= S02 · STATES ================= */
  const M = window.INDIA_MAP, isvg = d3.select('#imap').attr('viewBox', `-20 -10 ${M.w + 40} ${M.h + 20}`);
  const years = D.years; let yi = 0;
  const vals = n => D.states[n] || null;
  const nm = n => D.display[n] || n;
  isvg.append('g').selectAll('path').data(M.states).join('path').attr('d', s => s.d).attr('fill', 'rgba(15,17,21,.07)').attr('stroke', '#EEF0F3').attr('stroke-width', 1.2)
    .on('mousemove', (e, s) => { const v = vals(s.n); if (!v) return showTip(e, `${nm(s.n)}<br><span style="opacity:.6">no data</span>`); const mx = Math.max(...v);
      const sp = v.map((x, i) => `${i * 22},${30 - x / mx * 26}`).join(' ');
      showTip(e, `<b>${fmtIN(v[yi])}</b>${nm(s.n)} · ${years[yi]}<svg width="96" height="34" style="display:block;margin-top:6px"><polyline points="${sp}" fill="none" stroke="#94A3FF" stroke-width="2"/>${v.map((x, i) => `<circle cx="${i * 22}" cy="${30 - x / mx * 26}" r="${i === yi ? 3.5 : 2}" fill="${i === yi ? '#fff' : '#94A3FF'}"/>`).join('')}</svg>`); })
    .on('mouseenter', (e, s) => window.__bumpHi && window.__bumpHi(s.n))
    .on('mouseleave', () => { hideTip(); window.__bumpHi && window.__bumpHi(null); });
  const withData = M.states.filter(s => vals(s.n));
  const k = 34 / Math.sqrt(73574);
  const bub = isvg.append('g').selectAll('g').data(withData).join('g').attr('transform', s => `translate(${s.c[0]},${s.c[1]})`).style('pointer-events', 'none');
  bub.append('circle').attr('fill', '#2445FF').attr('r', 0);
  bub.append('text').attr('font-family', 'Plex').attr('font-weight', 600).attr('font-size', 11).attr('fill', '#0F1115').attr('text-anchor', 'middle');
  const ybtn = d3.select('#years'), byear = document.getElementById('byear');
  ybtn.selectAll('button').data(years).join('button').text(y => y).on('click', (e, y) => setYear(years.indexOf(y)));
  function setYear(i) {
    yi = i; const y = years[i]; byear.textContent = y; ybtn.selectAll('button').classed('on', d => d === y);
    const sorted = withData.map(s => [s.n, vals(s.n)[i]]).sort((a, b) => b[1] - a[1]);
    const lead = sorted[0][0], top5 = new Set(sorted.slice(0, 5).map(s => s[0]));
    bub.select('circle').transition().duration(700).ease(d3.easeCubicOut).attr('r', s => k * Math.sqrt(vals(s.n)[i])).attr('fill-opacity', s => s.n === lead ? 1 : .42);
    bub.select('text').attr('y', s => -k * Math.sqrt(vals(s.n)[i]) - 6).text(s => top5.has(s.n) ? nm(s.n).toUpperCase() : '').attr('fill', s => s.n === lead ? '#2445FF' : '#0F1115');
    bumpYear(i);
  }
  /* rank bump: the same data, read as rank over time. Year buttons move the marker. */
  const bs = d3.select('#ibump'), top8 = Object.keys(D.states).sort((a, b) => d3.sum(D.states[b]) - d3.sum(D.states[a])).slice(0, 8);
  const rk = years.map((y, i) => Object.fromEntries(top8.slice().sort((a, b) => D.states[b][i] - D.states[a][i]).map((n, j) => [n, j + 1])));
  const bx = d3.scalePoint().domain(years).range([12, 200]), by = d3.scaleLinear().domain([1, 8]).range([30, 300]);
  const mark = bs.append('rect').attr('y', 14).attr('width', 22).attr('height', 300).attr('rx', 11).attr('fill', 'rgba(36,69,255,.08)');
  years.forEach(y => bs.append('text').attr('x', bx(y)).attr('y', 8).attr('text-anchor', 'middle').attr('font-family', 'Plex').attr('font-size', 9.5).attr('fill', 'rgba(15,17,21,.45)').text("'" + String(y).slice(2)));
  const AP = 'Andhra Pradesh', bl = d3.line().x(d => bx(d.y)).y(d => by(d.r)).curve(d3.curveBumpX);
  const bg = bs.append('g').selectAll('g').data(top8.map(n => ({ n, p: years.map((y, i) => ({ y, i, r: rk[i][n], n })) }))).join('g');
  const bpath = bg.append('path').attr('d', d => bl(d.p)).attr('fill', 'none').attr('stroke', d => d.n === AP ? '#2445FF' : '#0F1115').attr('stroke-width', d => d.n === AP ? 3.5 : 2).attr('stroke-opacity', d => d.n === AP ? 1 : .18);
  const bdot = bg.selectAll('circle').data(d => d.p).join('circle').attr('cx', p => bx(p.y)).attr('cy', p => by(p.r)).attr('r', 3.2).attr('fill', '#EEF0F3').attr('stroke', p => p.n === AP ? '#2445FF' : 'rgba(15,17,21,.3)').attr('stroke-width', 2);
  const blab = bg.append('text').attr('x', 214).attr('font-family', 'Inter').attr('font-size', 11.5).attr('font-weight', d => d.n === AP ? 700 : 500).attr('fill', d => d.n === AP ? '#2445FF' : 'rgba(15,17,21,.6)');
  function bumpYear(i) {
    mark.transition().duration(500).attr('x', bx(years[i]) - 11);
    bdot.transition().duration(400).attr('r', p => p.i === i ? (p.r === 1 ? 6 : 4.5) : 3).attr('fill', p => p.i === i && p.r === 1 ? (p.n === AP ? '#2445FF' : '#0F1115') : '#EEF0F3');
    blab.transition().duration(500).attr('y', d => by(rk[i][d.n]) + 4).text(d => nm(d.n) + '  ' + fmtIN(D.states[d.n][i]));
  }
  window.__bumpHi = n => { const on = top8.includes(n); bpath.attr('stroke-opacity', d => !on ? (d.n === AP ? 1 : .18) : d.n === n ? 1 : .08).attr('stroke', d => on && d.n === n ? '#2445FF' : (d.n === AP && !on ? '#2445FF' : '#0F1115')); blab.attr('fill-opacity', d => !on || d.n === n ? 1 : .3); };
  setYear(0);
  let seq = null;
  stepper('#s02', ['i1', 'i2', 'i3', 'i4'], 380, i => {
    if (seq) { seq.kill(); seq = null; }
    if (i === 0) setYear(0);
    if (i === 1) { seq = gsap.timeline(); [0, 1, 2, 3].forEach((y, j) => seq.call(() => setYear(y), null, j * 1.1)); }
    if (i === 2) { setYear(3); seq = gsap.timeline().call(() => setYear(4), null, .9); }
    if (i === 3) setYear(4);
  });
})();
ScrollTrigger.refresh();
