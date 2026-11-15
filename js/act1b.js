/* Minds Adrift · Act I · S03 sieve · S04 offer map · S04b diaspora */
(() => {
  const { fmtIN } = window.MA;
  function stepper(sel, ids, len, onStep) {
    let cur = -1;
    const set = i => { if (i === cur) return; const prev = cur; cur = i;
      ids.forEach((id, k) => gsap.to('#' + id, { opacity: k === i ? 1 : 0, y: k === i ? 0 : (k < i ? -16 : 16), duration: .55, ease: 'power2.out', overwrite: true }));
      onStep(i, prev); };
    ScrollTrigger.create({ trigger: sel, start: 'top top', end: '+=' + len + '%', pin: true, onUpdate: s => set(Math.min(ids.length - 1, Math.floor(s.progress * ids.length * .999))), onEnter: () => set(Math.max(cur, 0)) });
  }
  const person = (g, s = 1) => { g.append('circle').attr('cx', 0).attr('cy', -9 * s).attr('r', 5 * s); g.append('rect').attr('x', -6.5 * s).attr('y', -2 * s).attr('width', 13 * s).attr('height', 15 * s).attr('rx', 5 * s); };

  /* ================= S03 · SIEVE ================= */
  const sv = d3.select('#sieve');
  const N = 241, COLS = 22, CW = 36, RH = 46, X0 = 66, Y0 = 52;
  const grid = sv.append('g').attr('class', 'grid');
  const ppl = grid.selectAll('g').data(d3.range(N)).join('g').attr('transform', i => `translate(${X0 + (i % COLS) * CW},${Y0 + Math.floor(i / COLS) * RH})`);
  ppl.each(function () { person(d3.select(this)); });
  ppl.attr('fill', '#0F1115').attr('fill-opacity', .72).attr('stroke', 'none');
  // map (Eurasia)
  const mapG = sv.append('g').attr('opacity', 0).attr('clip-path', 'url(#mclip)');
  const countries = topojson.feature(window.WORLD, window.WORLD.objects.countries).features;
  const mproj = d3.geoMercator().fitExtent([[300, 70], [800, 590]], { type: 'MultiPoint', coordinates: [[25, 60], [126, 60], [25, 4], [126, 4]] });
  sv.append('clipPath').attr('id', 'mclip').append('rect').attr('x', 280).attr('y', 20).attr('width', 610).attr('height', 590).attr('rx', 12);
  const mpath = d3.geoPath(mproj);
  const C5 = [{ k: 'Russia', v: 24940, ll: [45, 55] }, { k: 'Kyrgyzstan', v: 16500, ll: [74.7, 41.2] }, { k: 'Georgia', v: 16093, ll: [43.4, 42.3] }, { k: 'Kazakhstan', v: 9785, ll: [67, 48] }, { k: 'Philippines', v: 9665, ll: [122, 12] }];
  const five = new Set(C5.map(c => c.k));
  mapG.append('g').selectAll('path').data(countries).join('path').attr('d', mpath)
    .attr('fill', d => d.properties.name === 'India' ? 'rgba(36,69,255,.16)' : five.has(d.properties.name) ? 'rgba(15,17,21,.22)' : 'rgba(15,17,21,.07)')
    .attr('stroke', d => d.properties.name === 'India' ? '#2445FF' : '#EEF0F3').attr('stroke-width', .7);
  const IN = mproj([79, 22]);
  const arcsG = mapG.append('g');
  C5.forEach(c => {
    const p = mproj(c.ll), mx = (IN[0] + p[0]) / 2, my = Math.min(IN[1], p[1]) - 60;
    const pth = arcsG.append('path').attr('d', `M${IN[0]},${IN[1]} Q${mx},${my} ${p[0]},${p[1]}`).attr('fill', 'none').attr('stroke', '#2445FF').attr('stroke-width', 1 + c.v / 4000).attr('stroke-linecap', 'round');
    const L = pth.node().getTotalLength(); pth.attr('stroke-dasharray', L).attr('stroke-dashoffset', L).attr('class', 'mbbsarc');
    const g = arcsG.append('g').attr('transform', `translate(${p[0]},${p[1]})`).attr('class', 'mbbsdot').attr('opacity', 0);
    g.append('circle').attr('r', 4 + Math.sqrt(c.v) / 8).attr('fill', '#2445FF').attr('fill-opacity', .22).attr('stroke', '#2445FF').attr('stroke-width', 1.5);
    const left = c.k === 'Georgia' || c.k === 'Philippines', tx = left ? -(10 + Math.sqrt(c.v) / 8) : 10 + Math.sqrt(c.v) / 8, an = left ? 'end' : 'start';
    g.append('text').attr('x', tx).attr('text-anchor', an).attr('y', -2).attr('paint-order', 'stroke').attr('stroke', '#EEF0F3').attr('stroke-width', 4).attr('font-family', 'Plex').attr('font-weight', 600).attr('font-size', 12).attr('fill', '#2445FF').text(c.k.toUpperCase());
    g.append('text').attr('x', tx).attr('text-anchor', an).attr('y', 13).attr('paint-order', 'stroke').attr('stroke', '#EEF0F3').attr('stroke-width', 4).attr('font-family', 'Plex').attr('font-size', 11).attr('fill', 'rgba(15,17,21,.55)').text(fmtIN(c.v));
  });
  mapG.append('circle').attr('cx', IN[0]).attr('cy', IN[1]).attr('r', 6).attr('fill', '#2445FF');
  // waffle (FMGE)
  const wG = sv.append('g').attr('opacity', 0).attr('transform', 'translate(220,80)');
  const pass = Math.round(13149 / 45552 * 100);
  wG.selectAll('rect').data(d3.range(100)).join('rect').attr('x', i => (i % 10) * 44).attr('y', i => Math.floor(i / 10) * 44).attr('width', 38).attr('height', 38).attr('rx', 4)
    .attr('fill', i => i < pass ? '#2445FF' : 'rgba(15,17,21,.12)').attr('class', 'wf');
  wG.append('text').attr('x', 460).attr('y', 30).attr('font-family', 'Fraunces').attr('font-weight', 800).attr('font-size', 56).attr('fill', '#2445FF').text('28.9%');
  wG.append('text').attr('x', 462).attr('y', 58).attr('font-family', 'Plex').attr('font-size', 12).attr('fill', 'rgba(15,17,21,.6)').text('PASSED FMGE · DEC 2024');
  wG.append('text').attr('x', 462).attr('y', 420).attr('font-family', 'Plex').attr('font-size', 12).attr('fill', 'rgba(15,17,21,.6)').text('1 SQUARE = 1% OF 45,552');
  const QUAL = 132, SEATS = 12, GOV = 6;
  function sieve(i) {
    const T = d3.transition('t_s03').duration(900).ease(d3.easeCubicInOut);
    grid.transition(T).attr('transform', 'translate(0,0) scale(1)').attr('opacity', i >= 3 ? 0 : 1);
    ppl.transition(T).delay((d, k) => i === 1 ? (N - k) * 3 : 0)
      .attr('fill-opacity', k => i === 0 ? .72 : (k >= QUAL ? .07 : (i >= 2 && k >= SEATS ? .28 : .9)))
      .attr('fill', k => i >= 2 && k < SEATS ? (k < GOV ? '#2445FF' : '#EEF0F3') : '#0F1115')
      .attr('stroke', k => i >= 2 && k < SEATS && k >= GOV ? '#2445FF' : 'none').attr('stroke-width', 2.2);
    mapG.transition(T).attr('opacity', i === 3 ? 1 : 0);
    sv.selectAll('.mbbsarc').transition().duration(i === 3 ? 1300 : 300).delay((d, k) => i === 3 ? 400 + k * 150 : 0).attr('stroke-dashoffset', function () { return i === 3 ? 0 : this.getTotalLength(); });
    sv.selectAll('.mbbsdot').transition().duration(500).delay((d, k) => i === 3 ? 1100 + k * 150 : 0).attr('opacity', i === 3 ? 1 : 0);
    wG.transition(T).attr('opacity', i === 4 ? 1 : 0);
    sv.selectAll('.wf').transition().duration(400).delay((d, k) => i === 4 ? k * 8 : 0).attr('opacity', i === 4 ? 1 : 0);
  }
  stepper('#s03', ['c1', 'c2', 'c3', 'c4', 'c5'], 420, i => sieve(i));

  /* ================= S04 · OFFER MAP (positioning map, rules by year) ================= */
  const OF = [
    { k: 'Canada', v: 427000, why: ['Work opportunity', 'Education quality', 'Affordability', 'Safety'],
      y: { 2023: [44, 36, 'No weekly cap (temporary policy)', 'Up to 3 years (PGWP)'], 2025: [24, 36, '24 h / week off-campus', 'Up to 3 years (PGWP)'], 2027: [24, 36, '24 h / week off-campus', 'Up to 3 years (PGWP)'] },
      chg: { 2025: 'Study permit cap from Jan 2024. Unlimited work hours ended April 2024; 24 h cap from Nov 2024.' } },
    { k: 'USA', v: 337630, why: ['Education quality', 'Career prospects', 'Research', 'Global networks'], stem: 36,
      y: { 2023: [20, 12, '20 h / week, on campus', '12 months OPT (+24 STEM)'], 2025: [20, 12, '20 h / week, on campus', '12 months OPT (+24 STEM)'], 2027: [20, 12, '20 h / week, on campus', '12 months OPT (+24 STEM)'] },
      chg: { 2025: 'New H-1B petitions for workers abroad carry a $100,000 fee from 21 Sep 2025. The ladder after OPT got steeper.' } },
    { k: 'UK', v: 185000, why: ['World-class universities', 'Shorter courses', 'Global recognition'],
      y: { 2023: [20, 24, '20 h / week in term', '2 years (Graduate Route)'], 2025: [20, 24, '20 h / week in term', '2 years (Graduate Route)'], 2027: [20, 18, '20 h / week in term', '18 months (from 1 Jan 2027)'] },
      chg: { 2025: 'Most master\'s students lost dependant visas in Jan 2024.', 2027: 'Graduate Route cut to 18 months for applications from 1 Jan 2027.' } },
    { k: 'Australia', v: 122202, why: ['Quality of life', 'Demand in key sectors', 'Inclusive society'],
      y: { 2023: [24, 48, '48 h / fortnight', 'Up to 4 years (select degrees)'], 2025: [24, 24, '48 h / fortnight', '2 years (bachelor\'s / coursework master\'s)'], 2027: [24, 24, '48 h / fortnight', '2 years'] },
      chg: { 2025: 'The extra two years for select degrees ended on 1 July 2024; stay periods shortened.' } },
    { k: 'Germany', v: 42997, why: ['Low or no tuition', 'Engineering & tech', 'Strong public universities'],
      y: { 2023: [18.5, 18, '120 full days / year', '18 months to find a job'], 2025: [21.5, 18, '140 full days / year', '18 months to find a job'], 2027: [21.5, 18, '140 full days / year', '18 months to find a job'] },
      chg: { 2025: 'Work allowance rose from 120 to 140 full days a year in March 2024.' } }
  ];
  const STAMP = { 2025: { Canada: 'Study permits capped', USA: '$100K H-1B fee', Australia: 'Stay cut', Germany: 'More work days', UK: 'No dependants' }, 2027: { UK: 'Stay cut to 18 months', USA: '$100K H-1B fee', Canada: 'Study permits capped' } };
  const HMAX = 44, MMAX = 48, AT = { Canada: [-104, 57], USA: [-99, 39], UK: [-2.5, 53.5], Australia: [134, -25], Germany: [10.4, 51.2] };
  const BOX = { Canada: [-160, -64], USA: [-160, 40], UK: [-250, -150], Australia: [-80, 40], Germany: [40, -20] };
  const hTxt = (d, y) => { const h = d.y[y][0]; return h >= 44 ? 'no limit' : (d.k === 'Germany' ? '≈ ' : '') + Math.round(h) + ' h/week'; };
  const mTxt = (d, y) => { const m = d.y[y][1]; return (m % 12 ? m + ' months' : m === 12 ? '1 year' : m / 12 + ' years') + (d.stem ? ' (+2 STEM)' : ''); };
  const osv = d3.select('#offer').append('svg').attr('viewBox', '0 0 1000 520');
  const proj = d3.geoNaturalEarth1().fitExtent([[0, 10], [1000, 510]], { type: 'MultiPoint', coordinates: [[-150, 62], [175, 62], [-150, -45], [175, -45]] }), gp = d3.geoPath(proj);
  const feats = topojson.feature(WORLD, WORLD.objects.countries).features, FOC = { '124': 'Canada', '840': 'USA', '826': 'UK', '036': 'Australia', '276': 'Germany' };
  osv.append('g').selectAll('path').data(feats.filter(f => f.id !== '010')).join('path').attr('d', gp)
    .attr('fill', f => f.id === '356' ? '#2445FF' : FOC[f.id] ? '#c9d1ff' : '#dde1e8').attr('stroke', '#EEF0F3').attr('stroke-width', .5)
    .style('cursor', f => FOC[f.id] ? 'pointer' : null).on('click', (e, f) => FOC[f.id] && pick(FOC[f.id]));
  const OIN = proj([78, 22]);
  OF.forEach(d => { const p = proj(AT[d.k]); d.p = p;
    osv.append('path').attr('class', 'oarc').attr('d', `M${OIN[0]},${OIN[1]} Q${(OIN[0] + p[0]) / 2},${Math.min(OIN[1], p[1]) - 90} ${p[0]},${p[1]}`); });
  osv.append('circle').attr('cx', OIN[0]).attr('cy', OIN[1]).attr('r', 6).attr('fill', '#0F1115');
  const BW = 168, BH = 74;
  const bg = osv.append('g').selectAll('g').data(OF).join('g').attr('class', 'obadge').attr('transform', d => `translate(${d.p[0] + BOX[d.k][0]},${d.p[1] + BOX[d.k][1]})`).on('click', (e, d) => pick(d.k));
  bg.append('line').attr('x1', d => -BOX[d.k][0]).attr('y1', d => -BOX[d.k][1]).attr('x2', BW / 2).attr('y2', BH / 2).attr('class', 'olead');
  bg.append('rect').attr('width', BW).attr('height', BH).attr('rx', 10);
  bg.append('text').attr('class', 'on').attr('x', 10).attr('y', 18).text(d => d.k);
  [0, 1].forEach(c => { const y0 = 32 + c * 22;
    bg.append('text').attr('class', 'ol').attr('x', 10).attr('y', y0 + 4).text(c ? 'STAY' : 'WORK');
    bg.append('rect').attr('class', 'otr').attr('x', 46).attr('y', y0 - 3).attr('width', 112).attr('height', 5).attr('rx', 2.5);
    bg.append('rect').attr('class', 'ob ob' + c).attr('x', 46).attr('y', y0 - 3).attr('height', 5).attr('rx', 2.5);
    bg.append('text').attr('class', 'ov ov' + c).attr('x', 46).attr('y', y0 + 13); });
  let year = 2025, prevYear = 2025, cur = OF[0];
  function drawOffer(y, anim = true) {
    bg.each(function (d) { const g = d3.select(this);
      [[0, d.y[y][0] / HMAX, hTxt], [1, d.y[y][1] / MMAX, mTxt]].forEach(([c, f, tx]) => {
        const ch = anim && tx(d, y) !== tx(d, prevYear);
        g.select('.ob' + c).transition().duration(anim ? 900 : 0).attr('width', 112 * Math.min(1, f));
        g.select('.ov' + c).text(tx(d, y) + (ch ? '  (was ' + tx(d, prevYear) + ')' : '')).classed('chg', ch); }); });
    document.getElementById('ofnote').textContent = y === 2023 ? 'Before the 2024 changes' : y === 2025 ? 'Rules today' : 'Announced for 2027';
  }
  const card = document.getElementById('ocard');
  function fillCard(d) {
    const r = d.y[year], ch = (d.chg[year] || d.chg[2025] || '');
    card.innerHTML = `<h4>${d.k}</h4><div class="n">${fmtIN(d.v)} INDIAN STUDENTS · ${(d.v / 1335878 * 100).toFixed(1)}% OF ALL</div><div class="kv"><span>Work</span><span>${r[2]}</span><span>Stay</span><span>${r[3]}</span></div>${ch ? `<div class="chg">${ch}</div>` : ''}`;
    card.classList.add('open');
  }
  function pick(k) { cur = OF.find(d => d.k === k); bg.classed('sel', d => d === cur); fillCard(cur); }
  const setY = (y, anim = true) => { prevYear = year; year = y; d3.selectAll('#ofyrs button').classed('on', function () { return +this.dataset.y === y; }); drawOffer(y, anim); fillCard(cur); };
  d3.selectAll('#ofyrs button').on('click', function () { setY(+this.dataset.y); });
  drawOffer(2025, false); pick('Canada');
  const arcs = osv.selectAll('.oarc').nodes(), plane = osv.append('circle').attr('r', 4.5).attr('fill', '#2445FF').attr('opacity', 0);
  arcs.forEach(a => { const L = a.getTotalLength(); a.style.strokeDasharray = L; a.style.strokeDashoffset = L; }); bg.attr('opacity', 0);
  function fly(n) { if (n >= arcs.length) { plane.attr('opacity', 0); return; } const a = arcs[n], L = a.getTotalLength();
    plane.attr('opacity', 1); plane.transition('fly').duration(window.MA.REDUCE ? 0 : 700).ease(d3.easeCubicInOut).tween('f', () => t => { const p = a.getPointAtLength(L * t); plane.attr('cx', p.x).attr('cy', p.y); a.style.strokeDashoffset = L * (1 - t); })
      .on('end', () => { d3.select(bg.nodes()[n]).transition().duration(350).attr('opacity', 1); fly(n + 1); }); }
  const landAll = () => { arcs.forEach(a => a.style.strokeDashoffset = 0); bg.interrupt().attr('opacity', 1); plane.attr('opacity', 0); };
  ScrollTrigger.create({ trigger: '#s04', start: 'top 45%', once: true, onEnter: () => { fly(0); setTimeout(landAll, 5200); year = 2023; setY(2023, false); setTimeout(() => setY(2025), 4200); } });

  /* ================= S04b · DIASPORA ================= */
  if (document.getElementById('s04b')) {
  const ps = d3.select('#people'), share = 72.3;
  const defs = ps.append('defs');
  const figs = ps.append('g');
  for (let i = 0; i < 10; i++) {
    const g = figs.append('g').attr('transform', `translate(${35 + i * 66},170)`);
    const cp = defs.append('clipPath').attr('id', 'pc' + i); cp.append('rect').attr('class', 'clipr').attr('x', -30).attr('y', -80).attr('height', 160).attr('width', 0).attr('data-f', Math.max(0, Math.min(1, share / 10 - i)));
    const base = g.append('g').attr('fill', 'rgba(15,17,21,.14)'); person(base, 3.6);
    const fill = g.append('g').attr('fill', '#2445FF').attr('clip-path', `url(#pc${i})`); person(fill, 3.6);
  }
  const net = ps.insert('g', ':first-child').attr('stroke', 'rgba(15,17,21,.15)').attr('fill', 'none');
  for (let i = 0; i < 10; i++) for (let j = i + 1; j < 10; j += 3) net.append('path').attr('d', `M${35 + i * 66},120 Q${35 + (i + j) * 33},${40 + ((i * j) % 5) * 8} ${35 + j * 66},120`);
  net.attr('opacity', 0).remove();
  ps.append('text').attr('x', 35).attr('y', 270).attr('font-family', 'Plex').attr('font-size', 12).attr('fill', 'rgba(15,17,21,.55)').text('10 FIGURES = ALL H-1B APPROVALS, FY2023 · COBALT = INDIAN');
  stepper('#s04b', ['p2'], 110, i => { i = 1;
    ps.selectAll('.clipr').transition().duration(1200).delay((d, k) => i === 1 ? k * 120 : 0).ease(d3.easeCubicOut).attr('width', function () { return i === 1 ? 60 * this.dataset.f : 0; });
  });
  }
})();
ScrollTrigger.refresh();

