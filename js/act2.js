/* Minds Adrift · Act II · S05 the gates (metro map) */
(() => {
  const TRUNK = [
    { n: 'Pick a course', d: 'Shortlist countries, courses and colleges. This choice decides every gate after it.' },
    { n: 'English test', d: 'IELTS, TOEFL or PTE for most English-taught courses. Scores expire after two years.' },
    { n: 'Get admitted', d: 'Apply, then wait for an offer. The offer letter unlocks the country\'s own paperwork.' },
    { n: 'Fund it', d: 'Savings, family money or an education loan. Every country asks to see the money before the visa.' }];
  const LINES = {
    Canada: { gates: [
      { n: 'PAL', d: 'Provincial Attestation Letter: most new students need one since 2024, issued against each province\'s share of the national cap.' },
      { n: 'Proof of funds', d: 'Living costs for the first year, on top of tuition and travel.', f: 'CAD 23,448 (from 1 Sep 2026)', s: 'CAD 23,448' },
      { n: 'Study permit', d: 'Online application with biometrics.', f: 'CAD 150 + CAD 85 biometrics', s: 'CAD 235' }],
      t: [['Study permit + biometrics', 'CAD 235'], ['Living costs to show', 'CAD 23,448'], ['Plus', '1st-year tuition + travel']], note: 'Spaces are capped: no PAL, no permit.' },
    USA: { gates: [
      { n: 'I-20', d: 'Issued by the university once it accepts your funding proof for the first year.' },
      { n: 'SEVIS fee', d: 'Pays for the system that tracks international students.', f: 'US$350', s: 'US$350' },
      { n: 'F-1 interview', d: 'In person at a US consulate. The officer can refuse on the spot.', f: 'US$185 visa fee', s: 'US$185' }],
      t: [['SEVIS I-901', 'US$350'], ['Visa (MRV)', 'US$185'], ['Visa Integrity Fee', 'US$250*']], note: '*In law since July 2025; not yet collected at every post.' },
    UK: { gates: [
      { n: 'CAS', d: 'Confirmation of Acceptance for Studies: a reference number from the university.' },
      { n: 'Visa + health', d: 'The Immigration Health Surcharge is paid upfront for the whole visa.', f: '£558 + £776 / year', s: '£558 + IHS' },
      { n: 'Show funds', d: 'Course fees plus up to 9 months of living costs; the amount depends on the city.', s: 'fees + 9 months living' }],
      t: [['Student visa', '£558'], ['Health surcharge', '£776 / yr'], ['Plus', 'fees + 9 months living']], note: 'Most master\'s students can no longer bring dependants (since Jan 2024).' },
    Australia: { gates: [
      { n: 'CoE', d: 'Confirmation of Enrolment from the university.' },
      { n: 'Genuine student', d: 'You must show you really mean to study. Plus funds for living costs, tuition and travel.', f: 'AUD 29,710 / year living', s: 'AUD 29,710' },
      { n: 'Student visa', d: 'Subclass 500. Health cover (OSHC) required for the whole stay.', f: 'AUD 2,500 (from 1 Jul 2026)', s: 'AUD 2,500' }],
      t: [['Visa (subclass 500)', 'AUD 2,500'], ['Living costs to show', 'AUD 29,710'], ['Plus', 'OSHC + tuition + travel']], note: 'The visa fee rose from AUD 710 to 2,500 in three years.' },
    Germany: { gates: [
      { n: 'APS', d: 'Academic Evaluation Centre in New Delhi checks your Indian marks. Needed before the visa.', f: '₹18,000', s: '₹18,000' },
      { n: 'Blocked account', d: 'One year of living money locked in a German account, released monthly.', f: '€11,904 (€992 / month)', s: '€11,904' },
      { n: 'Visa', d: 'National (D) visa for study, applied through the consular portal.', f: '€75', s: '€75' }],
      t: [['APS certificate', '₹18,000'], ['Blocked account', '€11,904'], ['Visa', '€75']], note: 'Tuition at public universities is mostly free; the blocked account is the real gate.' }
  };
  const KEYS = Object.keys(LINES), ticket = document.getElementById('mticket'), tip = document.getElementById('tip');
  const wrap = document.querySelector('#s05 .gwrap'); wrap.innerHTML = '';
  const sv = d3.select(wrap).append('svg').attr('id', 'road').attr('viewBox', '0 0 1000 470');
  const TY = 235, TX = [70, 165, 260, 355], FX = 440, GX = [560, 690, 820], BY = KEYS.map((k, i) => 70 + i * 92);
  sv.append('path').attr('class', 'rd').attr('d', `M20,${TY} H${FX}`);
  const br = sv.append('g').selectAll('g').data(KEYS).join('g').attr('class', 'br');
  br.append('path').attr('class', 'rd').attr('d', (k, i) => `M${FX},${TY} C${FX + 50},${TY} ${FX + 40},${BY[i]} ${GX[0] - 40},${BY[i]} H${GX[2] + 40}`);
  br.append('text').attr('class', 'bk').attr('x', GX[2] + 52).attr('y', (k, i) => BY[i] + 5).text(k => k);
  br.each(function (k, i) { const g = d3.select(this);
    LINES[k].gates.forEach((ga, j) => { const q = g.append('g').attr('class', 'gt').attr('transform', `translate(${GX[j]},${BY[i]})`);
      q.append('rect').attr('x', -12).attr('y', -12).attr('width', 24).attr('height', 24).attr('rx', 6);
      q.append('text').attr('class', 'gi').attr('y', 4).text(j + 5);
      q.append('text').attr('class', 'gn').attr('y', -20).text(ga.n);
      q.append('text').attr('class', 'gf').attr('y', 30).text(ga.s || '');
      q.on('mousemove', e => { tip.innerHTML = `<b style="font-size:14px">${ga.n}</b>${ga.d}`; tip.style.opacity = 1; tip.style.left = (e.clientX + 16) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; }).on('mouseleave', () => tip.style.opacity = 0); }); });
  const tr = sv.append('g').selectAll('g').data(TRUNK).join('g').attr('class', 'ms').attr('transform', (t, i) => `translate(${TX[i]},${TY})`);
  tr.append('circle').attr('r', 15); tr.append('text').attr('class', 'mi').attr('y', 5).text((t, i) => i + 1);
  tr.append('text').attr('class', 'mn').attr('y', (t, i) => i % 2 ? 36 : -24).text(t => t.n);
  sv.append('text').attr('class', 'lbl').attr('x', 20).attr('y', TY + 70).text('EVERYONE');
  sv.append('text').attr('class', 'lbl').attr('x', GX[0] - 40).attr('y', 14).text('THEN EACH COUNTRY’S OWN GATES');
  function pick(k) { br.classed('on', d => d === k).classed('off', d => d !== k);
    const L = LINES[k]; ticket.innerHTML = `<div class="tl">${k} · what you pay before you fly</div>${L.t.map(([a, b]) => `<div class="row"><span>${a}</span><b>${b}</b></div>`).join('')}<div class="note">${L.note}</div>`; }
  br.on('mouseenter', (e, k) => pick(k)).on('click', (e, k) => pick(k));
  pick('Canada');
  let auto = null, ai = 0; const stud = sv.append('circle').attr('r', 7).attr('fill', '#2445FF').attr('stroke', '#fff').attr('stroke-width', 2).attr('opacity', 0);
  function walk(k) { const p = br.filter(d => d === k).select('.rd').node(), L = p.getTotalLength(); stud.attr('opacity', 1);
    stud.attr('cx', 20).attr('cy', TY).transition().duration(900).ease(d3.easeLinear).attr('cx', FX).transition().duration(1300).ease(d3.easeLinear).tween('w', () => t => { const q = p.getPointAtLength(L * t); stud.attr('cx', q.x).attr('cy', q.y); }); }
  const cycle = () => { const k = KEYS[ai++ % KEYS.length]; pick(k); walk(k); };
  sv.on('mouseenter', () => { clearInterval(auto); auto = null; });
  ScrollTrigger.create({ trigger: '#s05', start: 'top 50%', end: 'bottom top', onEnter: () => { if (!auto) { cycle(); auto = setInterval(cycle, 3000); } }, onLeave: () => { clearInterval(auto); auto = null; } });
  ScrollTrigger.create({ trigger: '#s05', start: 'top 65%', once: true, onEnter: () => { sv.selectAll('.rd').each(function () { const L = this.getTotalLength(); d3.select(this).attr('stroke-dasharray', L).attr('stroke-dashoffset', L).transition().duration(1400).attr('stroke-dashoffset', 0).on('end', function () { d3.select(this).attr('stroke-dasharray', null); }); }); } });
})();


/* S06 · money trail: LRS outward remittances as a 3-column sankey.
   Old labels (FY 2024-25): student money in 'Travel' is invisible. New labels (Mar 2026): Travel splits, education shows up. */
(() => {
  const V = {
    fy25: { total: 29563.12, unit: 'FY 2024-25', cats: [
      ['travel', 'Travel', 16964.57], ['maint', 'Maintenance of relatives · partly students', 3722.03], ['gift', 'Gifts', 2938.69], ['study', 'Studies abroad', 2918.91],
      ['inv', 'Shares & bonds', 1698.94], ['dep', 'Deposits', 705.26], ['oth', 'Property & other', 614.72]],
      sub: [['hidden', 'Not split by purpose', 16964.57]] },
    m26: { total: 2594.87, unit: 'March 2026', cats: [
      ['travel', 'Travel', 1094.60], ['maint', 'Maintenance of relatives · partly students', 389.78], ['gift', 'Gifts', 290.00], ['study', 'Studies abroad (remote)', 151.71],
      ['inv', 'Shares & bonds', 440.22], ['dep', 'Deposits', 176.35], ['oth', 'Property & other', 52.21]],
      sub: [['edu', 'Travel for education', 450.16], ['hol', 'Holidays & card bills', 623.05], ['bus', 'Business, pilgrimage, medical', 21.39]] }
  };
  const SAY = {
    fy25: 'In 2024-25 Indians sent <b>$29.6 bn</b> abroad under the LRS. Only one line was tagged for students: <b>$2.9 bn</b> "Studies abroad". Fees and hostel rent paid by students who travelled sat inside <b>Travel</b>, untagged.',
    m26: 'From 2026 the RBI splits Travel. In <b>March 2026</b> alone, <b>$450 mn</b> went on travel for education: fees, hostel. That is three times the $152 mn now tagged "Studies abroad", which counts only remote courses.'
  };
  const COL = { study: '#2445FF', edu: '#2445FF', maint: '#94A3FF', hidden: 'url(#hatch)' };
  const sv = d3.select('#mtrail'), H = 560, T = 20, X = [40, 430, 800], NW = 16, GAP = 15;
  const defs = sv.append('defs'), pat = defs.append('pattern').attr('id', 'hatch').attr('width', 8).attr('height', 8).attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', 'rotate(45)');
  pat.append('rect').attr('width', 8).attr('height', 8).attr('fill', 'rgba(15,17,21,.08)'); pat.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 8).attr('stroke', 'rgba(36,69,255,.45)').attr('stroke-width', 3);
  const gL = sv.append('g'), gN = sv.append('g'), gT = sv.append('g');
  const band = (x0, y0a, y0b, x1, y1a, y1b) => { const m = (x0 + x1) / 2; return `M${x0},${y0a} C${m},${y0a} ${m},${y1a} ${x1},${y1a} L${x1},${y1b} C${m},${y1b} ${m},${y0b} ${x0},${y0b} Z`; };
  const fmt = v => v >= 1000 ? '$' + (v / 1000).toFixed(1) + ' bn' : '$' + Math.round(v) + ' mn';
  let cur;
  function layout(v) {
    const d = V[v], k = (H - GAP * (d.cats.length - 1)) / d.total;
    let y = T; const cats = d.cats.map(([id, n, val]) => { const h = Math.max(2, val * k), o = { id, n, val, y0: y, y1: y + h }; y += h + GAP; return o; });
    const tr = cats[0], subs = []; let sy = T, kk = (tr.y1 - tr.y0) / d.sub.reduce((a, s) => a + s[2], 0), sgap = d.sub.length > 1 ? 14 : 0;
    // spread sub nodes vertically a little for legibility
    const totalSubH = tr.y1 - tr.y0 + sgap * (d.sub.length - 1);
    d.sub.forEach(([id, n, val]) => { const h = Math.max(3, val * kk); subs.push({ id, n, val, y0: sy, y1: sy + h }); sy += h + sgap; });
    return { d, cats, subs, tr };
  }
  function draw(v) {
    if (v === cur) return; cur = v;
    d3.selectAll('#mview button').classed('on', function () { return this.dataset.v === v; });
    document.getElementById('msay').innerHTML = SAY[v];
    const L = layout(v), t = d3.transition('t_s06').duration(1000).ease(d3.easeCubicInOut);
    // links col0 -> col1
    let ty = T; const links = L.cats.map(c => { const h = c.y1 - c.y0, o = { id: 'a' + c.id, c, p: band(X[0] + NW, ty, ty + h, X[1], c.y0, c.y1), fill: COL[c.id] || 'rgba(15,17,21,.10)' }; ty += h; return o; });
    let ry = L.tr.y0; L.subs.forEach(s => { const h = s.y1 - s.y0 - 0, hh = (s.val / L.d.sub.reduce((a, x) => a + x[2], 0)) * (L.tr.y1 - L.tr.y0); links.push({ id: 'b' + s.id, c: s, p: band(X[1] + NW, ry, ry + hh, X[2], s.y0, s.y1), fill: COL[s.id] || 'rgba(15,17,21,.10)' }); ry += hh; });
    gL.selectAll('path').data(links, d => d.id).join(en => en.append('path').attr('opacity', 0).attr('d', d => d.p), up => up, ex => ex.transition(t).attr('opacity', 0).remove())
      .attr('fill', d => d.fill).transition(t).attr('d', d => d.p).attr('opacity', d => d.id === 'bhidden' ? 1 : .85);
    const nodes = [{ id: 'tot', x: X[0], y0: T, y1: H + T - 0, n: '', fill: '#0F1115' }].concat(L.cats.map(c => ({ ...c, x: X[1], fill: COL[c.id] && c.id !== 'maint' ? '#2445FF' : '#0F1115' })), L.subs.map(s => ({ ...s, x: X[2], fill: s.id === 'edu' ? '#2445FF' : s.id === 'hidden' ? 'rgba(15,17,21,.35)' : '#0F1115' })));
    const lastCat = L.cats[L.cats.length - 1]; nodes[0].y1 = lastCat.y1;
    gN.selectAll('rect').data(nodes, d => d.id).join(en => en.append('rect').attr('opacity', 0).attr('x', d => d.x).attr('y', d => d.y0).attr('height', d => d.y1 - d.y0), up => up, ex => ex.transition(t).attr('opacity', 0).remove())
      .attr('width', NW).attr('rx', 2).transition(t).attr('opacity', 1).attr('x', d => d.x).attr('y', d => d.y0).attr('height', d => d.y1 - d.y0).attr('fill', d => d.fill);
    // labels
    const labs = L.cats.map(c => ({ id: 'l' + c.id, x: X[1] + NW + 8, y: (c.y0 + c.y1) / 2, n: c.n, v: c.val, hi: c.id === 'study' })).filter(l => l.id !== 'ltravel')
      .concat([{ id: 'ltravel', x: X[1] - 8, y: L.tr.y0 + 14, n: 'Travel', v: L.tr.val, anchor: 'end' }])
      .concat(L.subs.map(s => ({ id: 'l' + s.id, x: X[2] + NW + 8, y: (s.y0 + s.y1) / 2, n: s.n, v: s.val, hi: s.id === 'edu', q: s.id === 'hidden' })))
      .concat([{ id: 'ltot', x: X[0], y: T - 8, n: 'All money sent abroad · ' + L.d.unit, v: L.d.total, top: true }]);
    // keep category labels at least 30px apart
    { const cl = labs.filter(l => l.x === X[1] + NW + 8).sort((a, b) => a.y - b.y); for (let i = 1; i < cl.length; i++) if (cl[i].y - cl[i - 1].y < 30) cl[i].y = cl[i - 1].y + 30; }
    const sel = gT.selectAll('g').data(labs, d => d.id).join(en => { const g = en.append('g').attr('opacity', 0); g.append('text').attr('class', 'a'); g.append('text').attr('class', 'b'); return g; }, up => up, ex => ex.transition(t).attr('opacity', 0).remove());
    sel.transition(t).attr('opacity', 1).attr('transform', d => `translate(${d.x},${d.y})`);
    sel.each(function (d) { const t = d3.select(this).selectAll('.c').data(d.q ? [0] : []); t.join('text').attr('class', 'c').attr('dy', 34).attr('font-family', 'Inter').attr('font-weight', 600).attr('font-size', 13).attr('fill', '#2445FF').text('Student fees are in here, untagged'); });
    sel.select('.a').attr('text-anchor', d => d.anchor || 'start').attr('dy', d => d.top ? 0 : -2).attr('font-family', d => d.top ? 'Plex' : 'Inter').attr('font-weight', 600).attr('font-size', d => d.top ? 12 : 15).attr('letter-spacing', d => d.top ? '.06em' : 0).attr('fill', d => d.hi ? '#2445FF' : '#0F1115').text(d => d.top ? d.n.toUpperCase() : d.n);
    sel.select('.b').attr('text-anchor', d => d.anchor || 'start').attr('dy', d => d.top ? 0 : 15).attr('x', d => d.top ? 0 : 0).attr('font-family', 'Plex').attr('font-size', 12.5).attr('fill', d => d.hi ? '#2445FF' : 'rgba(15,17,21,.55)')
      .text(d => d.top ? '' : fmt(d.v) + ' · ' + (d.v / L.d.total * 100).toFixed(1) + '%' + '');
  }
  draw('fy25');
  d3.selectAll('#mview button').on('click', function () { draw(this.dataset.v); });
  let vcur = 'fy25';
  if (!window.MA.REDUCE) ScrollTrigger.create({ trigger: '#s06', start: 'top top', end: '+=120%', pin: true, onUpdate: st => { const v = st.progress < .5 ? 'fy25' : 'm26'; if (v !== vcur) { vcur = v; draw(v); } } });
  gsap.from('#s06 .mhead > *', { scrollTrigger: { trigger: '#s06', start: 'top 70%' }, y: 24, opacity: 0, stagger: .08, duration: .7 });
})();

/* S07 v3 · departures 2020-2024: drag the year; bars re-rank live; rule chips sit where lines drop */
(() => {
  const fmtIN = window.MA.fmtIN, REDUCE = window.MA.REDUCE, Y = [2020, 2021, 2022, 2023, 2024];
  const D = [
    { k: 'USA', v: [62415, 125115, 190512, 234473, 204058] },
    { k: 'Canada', v: [43624, 102688, 185955, 233532, 137608], rule: 'STUDY PERMIT CAP' },
    { k: 'UK', v: [44901, 77855, 132709, 136921, 98890], rule: 'NO DEPENDANTS' },
    { k: 'Australia', v: [33629, 8950, 59044, 78093, 68572], rule: 'VISA FEE ×2.3' },
    { k: 'Germany', v: [9865, null, null, null, 34702], gap: true }];
  const YN = { 2020: 'COVID: borders shut almost everywhere.', 2021: 'Australia stays shut: only 8,950 go.', 2022: 'The rebound: every route climbs.', 2023: 'The peak. Canada overtakes the USA.', 2024: 'Caps, fees and family bans land together.' };
  const CN = {
    Canada: 'Capped study permits from January 2024: <b>2,33,532 → 1,37,608</b>.',
    USA: 'Fewer leave, yet Indians enrolled in the US rose 10% in 2024/25: those already there stay on.',
    UK: 'Most master\'s students lost the right to bring family in January 2024.',
    Australia: 'Visa fee went from AUD 710 to 1,600 in July 2024.',
    Germany: 'Only 2020 and 2024 are published, so the line is dashed: <b>9,865 → 34,702</b>.' };
  const sv = d3.select('#depart').attr('viewBox', '0 0 900 540'), M = { l: 64, r: 260, t: 40, b: 56 }, W = 900, H = 540;
  const x = d3.scalePoint().domain(Y).range([M.l, W - M.r]), y = d3.scaleLinear().domain([0, 250000]).range([H - M.b, M.t]);
  const ax = sv.append('g').attr('font-family', 'Plex').attr('font-size', 11.5).attr('fill', 'rgba(15,17,21,.5)');
  [0, 100000, 200000].forEach(t => { ax.append('line').attr('x1', M.l).attr('x2', W - M.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'rgba(15,17,21,.07)'); ax.append('text').attr('x', M.l - 10).attr('y', y(t) + 4).attr('text-anchor', 'end').text(t ? (t / 100000) + ' lakh' : '0'); });
  const yl = ax.selectAll('.yl').data(Y).join('text').attr('class', 'yl').attr('x', d => x(d)).attr('y', H - M.b + 28).attr('text-anchor', 'middle').attr('font-weight', 600).text(d => d).style('cursor', 'pointer').on('click', (e, d) => go(Y.indexOf(d)));
  const line = d3.line().defined(d => d.v != null).x(d => x(d.y)).y(d => y(d.v)).curve(d3.curveMonotoneX);
  const pts = d => d.v.map((v, i) => ({ y: Y[i], i, v, k: d.k })).filter(p => p.v != null);
  const g = sv.append('g');
  const path = g.selectAll('path').data(D).join('path').attr('fill', 'none').attr('stroke-linecap', 'round').attr('d', d => line(pts(d))).attr('stroke-dasharray', d => d.gap ? '5 6' : null);
  // the scrubber: a handle you can grab
  const hand = sv.append('g').style('cursor', 'ew-resize');
  hand.append('rect').attr('x', -18).attr('y', M.t - 10).attr('width', 36).attr('height', H - M.b - M.t + 10).attr('fill', 'rgba(36,69,255,.07)').attr('rx', 18);
  hand.append('line').attr('y1', M.t - 4).attr('y2', H - M.b).attr('stroke', '#2445FF').attr('stroke-width', 1.5);
  const grip = hand.append('g').attr('transform', `translate(0,${H - M.b + 6})`);
  grip.append('rect').attr('x', -32).attr('y', -2).attr('width', 64).attr('height', 34).attr('rx', 17).attr('fill', '#2445FF');
  const gyr = grip.append('text').attr('y', 20).attr('text-anchor', 'middle').attr('font-family', 'Plex').attr('font-weight', 600).attr('font-size', 12.5).attr('fill', '#fff');
  [-24, 24].forEach(dx => grip.append('path').attr('d', dx < 0 ? 'M-3 0 L3 -4 L3 4z' : 'M3 0 L-3 -4 L-3 4z').attr('transform', `translate(${dx},15)`).attr('fill', '#fff'));
  const dots = g.selectAll('circle').data(D.flatMap(pts)).join('circle').attr('cx', p => x(p.y)).attr('cy', p => y(p.v)).attr('r', 4).attr('fill', '#EEF0F3').attr('stroke-width', 2.5);
  const chips = sv.append('g').selectAll('g').data(D.filter(d => d.rule && d.k !== 'Canada')).join('g').attr('opacity', 0).attr('transform', d => `translate(${x(2024) - 12},${y(d.v[4]) + (d.k === 'UK' ? 26 : d.k === 'Australia' ? 26 : -24)})`);
  chips.append('rect').attr('x', d => -(d.rule.length * 7 + 16)).attr('y', -11).attr('width', d => d.rule.length * 7 + 16).attr('height', 22).attr('rx', 11).attr('fill', '#fff').attr('stroke', '#2445FF').attr('stroke-width', 1.4);
  chips.append('text').attr('x', d => -(d.rule.length * 7 + 8)).attr('y', 4).attr('font-family', 'Plex').attr('font-weight', 600).attr('font-size', 10.5).attr('fill', '#2445FF').text(d => d.rule);
  // live ranking on the right
  const RX = W - M.r + 50, bw = d3.scaleLinear().domain([0, 240000]).range([0, 150]);
  const bars = sv.append('g').selectAll('g').data(D).join('g').style('cursor', 'pointer').on('click', (e, d) => focus(d.k === fk ? null : d.k));
  bars.append('text').attr('class', 'n').attr('x', RX).attr('y', -5).attr('font-family', 'Inter').attr('font-weight', 600).attr('font-size', 13.5);
  bars.append('text').attr('class', 'v').attr('x', RX + 200).attr('y', -5).attr('text-anchor', 'end').attr('font-family', 'Plex').attr('font-size', 11.5).attr('fill', 'rgba(15,17,21,.55)');
  bars.append('rect').attr('class', 'track').attr('x', RX).attr('y', 2).attr('height', 8).attr('rx', 4).attr('width', 150).attr('fill', 'rgba(15,17,21,.06)');
  bars.append('rect').attr('class', 'bar').attr('x', RX).attr('y', 2).attr('height', 8).attr('rx', 4);
  sv.append('text').attr('x', M.l).attr('y', 14).attr('font-family', 'Plex').attr('font-size', 11).attr('font-weight', 600).attr('letter-spacing', '.1em').attr('fill', 'rgba(15,17,21,.5)').text('INDIAN STUDENTS LEAVING EACH YEAR');
  const cd = D[1], drop = sv.append('g').attr('opacity', 0).style('pointer-events', 'none');
  drop.append('circle').attr('class', 'pulse').attr('cx', x(2024)).attr('cy', y(cd.v[4])).attr('r', 8).attr('fill', 'none').attr('stroke', '#2445FF').attr('stroke-width', 2);
  drop.append('line').attr('x1', x(2023) + 18).attr('x2', x(2023) + 18).attr('y1', y(cd.v[3]) + 8).attr('y2', y(cd.v[4])).attr('stroke', '#2445FF').attr('stroke-width', 1.5).attr('marker-end', 'url(#darr)');
  drop.append('text').attr('text-anchor', 'end').attr('x', x(2023) + 8).attr('y', (y(cd.v[3]) + y(cd.v[4])) / 2 + 5).attr('font-family', 'Fraunces, serif').attr('font-weight', 800).attr('font-size', 20).attr('fill', '#2445FF').text('−96,000');
  sv.append('defs').append('marker').attr('id', 'darr').attr('viewBox', '0 0 10 10').attr('refX', 5).attr('refY', 9).attr('markerWidth', 7).attr('markerHeight', 7).attr('orient', 'auto').append('path').attr('d', 'M0 0 L10 0 L5 10z').attr('fill', '#2445FF');
  const note = document.getElementById('dnote');
  let yi = 4, fk = 'Canada';
  function render(anim = true) {
    const T = d3.transition('t_s07').duration(anim ? 550 : 0).ease(d3.easeCubicOut);
    hand.transition(T).attr('transform', `translate(${x(Y[yi])},0)`); gyr.text(Y[yi]);
    yl.attr('fill', d => d === Y[yi] ? 'transparent' : 'rgba(15,17,21,.5)');
    const hi = d => d.k === fk;
    path.transition(T).attr('stroke', d => hi(d) ? '#2445FF' : '#0F1115').attr('stroke-width', d => hi(d) ? 4.5 : 2.2).attr('stroke-opacity', d => hi(d) ? 1 : fk ? .2 : .55);
    dots.transition(T).attr('stroke', p => p.k === fk ? '#2445FF' : '#0F1115').attr('r', p => p.i === yi ? 6 : 3.5).attr('opacity', p => !fk || p.k === fk ? 1 : .25).attr('fill', p => p.i === yi && p.k === fk ? '#2445FF' : '#EEF0F3');
    const order = D.map(d => ({ d, v: d.v[yi] })).sort((a, b) => (b.v ?? -1) - (a.v ?? -1));
    bars.transition(T).attr('transform', d => `translate(0,${M.t + 30 + order.findIndex(o => o.d === d) * 58})`).attr('opacity', d => !fk || hi(d) ? 1 : .45);
    bars.select('.n').text(d => d.k).attr('fill', d => hi(d) ? '#2445FF' : '#0F1115');
    bars.select('.v').text(d => d.v[yi] == null ? 'not published' : fmtIN(d.v[yi]));
    bars.select('.bar').transition(T).attr('width', d => d.v[yi] == null ? 0 : bw(d.v[yi])).attr('fill', d => hi(d) ? '#2445FF' : '#0F1115');
    chips.transition(T).attr('opacity', d => yi === 4 && (!fk || d.k === fk) ? 1 : 0);
    drop.transition(T).attr('opacity', yi === 4 && fk === 'Canada' ? 1 : 0);
    note.innerHTML = `<span class="yr">${Y[yi]}</span> ${YN[Y[yi]]}` + (fk && fk !== 'Canada' ? `<br><span class="cn">${fk}: ${CN[fk]}</span>` : '');
  }
  function go(i) { yi = Math.max(0, Math.min(4, i)); render(); }
  function focus(k) { fk = k; render(); }
  hand.call(d3.drag().on('drag', e => { const i = Math.round((e.x - M.l) / ((W - M.r - M.l) / 4)); if (i !== yi) go(i); }));
  sv.on('keydown', e => { if (e.key === 'ArrowLeft') go(yi - 1); if (e.key === 'ArrowRight') go(yi + 1); }).attr('tabindex', 0);
  path.on('click', (e, d) => focus(d.k === fk ? null : d.k)).style('cursor', 'pointer');
  render(false);
  // first view demonstrates the handle: it walks 2020 → 2024 by itself, once
  const L = []; path.filter(d => !d.gap).each(function () { const n = this.getTotalLength(); d3.select(this).attr('stroke-dasharray', n).attr('stroke-dashoffset', n); L.push(this); });
  ScrollTrigger.create({ trigger: '#s07', start: 'top 80%', once: true, onEnter: () => {
    d3.selectAll(L).transition('draw').delay(d => REDUCE ? 0 : d.k === 'Canada' ? 900 : 0).duration(d => REDUCE ? 0 : d.k === 'Canada' ? 2600 : 1600).ease(d3.easeCubicInOut).attr('stroke-dashoffset', 0).on('end', function () { d3.select(this).attr('stroke-dasharray', null); });
    if (REDUCE) return; yi = 0; render(false);
  } });
  if (!REDUCE) ScrollTrigger.create({ trigger: '#s07', start: 'top top', end: '+=200%', pin: true, onUpdate: st => { const i = Math.min(4, Math.floor(st.progress * 5)); if (i !== yi) go(i); } });
  gsap.from('#s07 .dhead > *', { scrollTrigger: { trigger: '#s07', start: 'top 70%' }, y: 24, opacity: 0, stagger: .08, duration: .7 });
})();

/* G4 · what they study: two donuts, US vs Germany (hover a slice) */
(() => {
  const sv = d3.select('#fields'); if (sv.empty()) return;
  sv.attr('viewBox', '0 0 1000 330');
  const D = [['Indian students in the USA', 'Open Doors 2025', [['Maths & CS', 43.4], ['Engineering', 22.8], ['Business', 11], ['Everything else', 22.8]]],
    ['Indian students in Germany', 'DAAD 2023/24', [['Engineering & CS', 60], ['Business & social sci.', 21], ['Everything else', 19]]]];
  const COL = ['#2445FF', '#94A3FF', '#0F1115', '#d5d9e0'], arc = d3.arc().innerRadius(78).outerRadius(118), pie = d3.pie().sort(null).value(d => d[1]);
  D.forEach(([t, src, sl], k) => {
    const g = sv.append('g').attr('transform', `translate(${250 + k * 500},170)`);
    const mid = g.append('g'); const big = mid.append('text').attr('class', 'fb').attr('y', 4); const sm = mid.append('text').attr('class', 'fs').attr('y', 26);
    const show = d => { big.text(d[1] + '%'); sm.text(d[0]); };
    g.selectAll('path').data(pie(sl)).join('path').attr('fill', (d, i) => COL[i === sl.length - 1 ? 3 : i]).attr('stroke', '#EEF0F3').attr('stroke-width', 2).style('cursor', 'pointer')
      .each(function (d) { this._d = d; }).attr('d', d => arc({ ...d, endAngle: d.startAngle }))
      .on('mouseenter', function (e, d) { d3.select(this).transition().attr('transform', `scale(1.05)`); show(d.data); })
      .on('mouseleave', function () { d3.select(this).transition().attr('transform', null); show(sl[0]); });
    show(sl[0]);
    g.append('text').attr('class', 'ft').attr('y', -140).text(t);
    g.append('text').attr('class', 'fsrc').attr('y', 150).text(src);
    ScrollTrigger.create({ trigger: '#s07f', start: 'top 65%', once: true, onEnter: () => g.selectAll('path').transition().duration(1100).delay((d, i) => i * 120).attrTween('d', function (d) { const f = d3.interpolate(d.startAngle, d.endAngle); return t => arc({ ...d, endAngle: f(t) }); }) });
  });
})();
