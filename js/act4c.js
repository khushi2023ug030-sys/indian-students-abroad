/* Minds Adrift v3 · Act IV · L3 the whole system */
(() => {
  const svg = d3.select('#net'); if (svg.empty()) return;
  const N = {
    family: ['Family', 150, 90, '#s01'], lender: ['Lender', 150, 215, '#s06'], agent: ['Agent', 150, 340, '#s04'], india: ['Indian state', 150, 465, '#s03'],
    student: ['Student', 500, 278, '#chat'],
    uni: ['University', 850, 90, '#s05'], host: ['Host government', 850, 215, '#s07'], employer: ['Employer', 850, 340, '#s08'], diaspora: ['Diaspora', 850, 465, '#s13']
  };
  const T = { people: 'People', money: 'Money', rules: 'Rules', info: 'Information' };
  const E = [
    ['family', 'student', 'money'], ['lender', 'student', 'money'], ['student', 'uni', 'money'], ['student', 'agent', 'money'], ['uni', 'agent', 'money'],
    ['student', 'host', 'money'], ['employer', 'student', 'money'], ['diaspora', 'family', 'money'],
    ['student', 'uni', 'people'], ['uni', 'employer', 'people'], ['employer', 'diaspora', 'people'], ['student', 'india', 'people'],
    ['host', 'student', 'rules'], ['host', 'uni', 'rules'], ['host', 'employer', 'rules'], ['india', 'student', 'rules'], ['india', 'uni', 'rules'],
    ['agent', 'student', 'info'], ['uni', 'agent', 'info'], ['diaspora', 'family', 'info'], ['family', 'student', 'info'], ['student', 'family', 'info'], ['employer', 'host', 'info']
  ].map(([a, b, t], i) => ({ a, b, t, id: i }));
  /* the team's four loops: edge chains + mechanism */
  const L = [
    ['Aspiration', 'What happens to one cohort resets what the next believes is possible.', [['student', 'uni', 'people'], ['uni', 'employer', 'people'], ['employer', 'student', 'money'], ['student', 'family', 'info'], ['family', 'student', 'info']]],
    ['Proof', 'Those who stay become the diaspora the next student reads as proof.', [['student', 'uni', 'people'], ['uni', 'employer', 'people'], ['employer', 'diaspora', 'people'], ['diaspora', 'family', 'info'], ['family', 'student', 'info']]],
    ['Policy', 'Outcomes feed back into politics, which rewrites the rules for the next choice.', [['student', 'uni', 'people'], ['uni', 'employer', 'people'], ['employer', 'host', 'info'], ['host', 'student', 'rules'], ['host', 'uni', 'rules']]],
    ['Return', 'Returnees are the most trusted answer to "was it worth it?"', [['student', 'india', 'people'], ['student', 'family', 'info'], ['family', 'student', 'info']]]
  ].map(([n, m, ch]) => ({ n, m, ids: ch.map(([a, b, t]) => E.find(e => e.a === a && e.b === b && e.t === t).id) }));
  const W = { student: 112, def: 128 }, H = 40;
  const side = (k, toward) => { const [, x, y] = N[k]; const w = (k === 'student' ? W.student : W.def) / 2; return [x + (toward > x ? w : toward < x ? -w : 0), y]; };
  const off = { people: -10, money: -3, rules: 4, info: 11 };
  function path(e) {
    const A = N[e.a], B = N[e.b];
    let p0 = side(e.a, B[1]), p1 = side(e.b, A[1]);
    const o = off[e.t]; p0 = [p0[0], p0[1] + o * .6]; p1 = [p1[0], p1[1] + o * .6];
    if (A[1] === B[1]) { /* same column: bow outward */
      const dir = A[1] < 500 ? -1 : 1, x0 = A[1] + dir * 64, x1 = B[1] + dir * 64, bx = A[1] + dir * (120 + Math.abs(A[2] - B[2]) * .25);
      return `M${x0},${A[2] + o * .6} C${bx},${A[2] + o} ${bx},${B[2] + o} ${x1},${B[2] + o * .6}`;
    }
    if (Math.abs(A[1] - B[1]) > 600) { /* India <-> abroad: arc over the top or under */
      const up = A[2] + B[2] < 560, cy = up ? -40 : 600;
      return `M${p0[0]},${p0[1]} C${p0[0] + (B[1] - A[1]) * .3},${cy + o * 2} ${p1[0] - (B[1] - A[1]) * .3},${cy + o * 2} ${p1[0]},${p1[1]}`;
    }
    const mx = (p0[0] + p1[0]) / 2;
    return `M${p0[0]},${p0[1]} C${mx},${p0[1]} ${mx},${p1[1]} ${p1[0]},${p1[1]}`;
  }
  svg.append('text').attr('class', 'side').attr('x', 150).attr('y', 30).text('IN INDIA');
  svg.append('text').attr('class', 'side').attr('x', 850).attr('y', 30).text('ABROAD');
  const eg = svg.append('g'), pg = svg.append('g').attr('class', 'parts');
  const edges = eg.selectAll('path').data(E).join('path').attr('d', path).attr('class', e => 'e ' + e.t);
  E.forEach((e, i) => { e.el = edges.nodes()[i]; e.len = e.el.getTotalLength(); });
  const parts = [];
  E.forEach(e => { for (let k = 0; k < 2; k++) parts.push({ e, s: k / 2 + Math.random() * .2 }); });
  const pe = pg.selectAll('g').data(parts).join('g').attr('class', d => 'p ' + d.e.t);
  pe.filter(d => d.e.t === 'money').append('rect').attr('x', -3.5).attr('y', -3.5).attr('width', 7).attr('height', 7).attr('transform', 'rotate(45)');
  pe.filter(d => d.e.t === 'people').append('circle').attr('r', 4);
  pe.filter(d => d.e.t === 'rules').append('rect').attr('x', -5).attr('y', -1.5).attr('width', 10).attr('height', 3);
  pe.filter(d => d.e.t === 'info').append('circle').attr('r', 2.2);
  const ng = svg.append('g').selectAll('g').data(Object.entries(N)).join('g').attr('class', ([k]) => 'n' + (k === 'student' ? ' st' : ''))
    .attr('transform', ([, n]) => `translate(${n[1]},${n[2]})`);
  ng.append('rect').attr('x', ([k]) => -(k === 'student' ? W.student : W.def) / 2).attr('y', -H / 2).attr('width', ([k]) => k === 'student' ? W.student : W.def).attr('height', H).attr('rx', H / 2);
  ng.append('text').attr('dy', 4.5).attr('text-anchor', 'middle').text(([, n]) => n[0]);
  ng.append('text').attr('class', 'go').attr('dy', 4.5).attr('x', ([k]) => (k === 'student' ? W.student : W.def) / 2 - 16).text('↑');
  /* state */
  const on = new Set(Object.keys(T)); let loop = -1, hov = null;
  function paint() {
    const lit = loop >= 0 ? new Set(L[loop].ids) : null;
    const vis = e => on.has(e.t) && (!lit || lit.has(e.id)) && (!hov || e.a === hov || e.b === hov);
    edges.classed('off', e => !vis(e)).classed('lit', e => !!lit && lit.has(e.id));
    pe.style('display', d => vis(d.e) ? null : 'none');
    const act = new Set(); E.forEach(e => { if (vis(e)) { act.add(e.a); act.add(e.b); } });
    ng.classed('dim', ([k]) => !act.has(k) && k !== hov);
    d3.select('#nmech').text(loop >= 0 ? L[loop].m : '').classed('on', loop >= 0);
  }
  d3.select('#nflt').selectAll('button').data(Object.keys(T)).join('button').attr('class', t => 'f ' + t).html(t => `<i></i>${T[t]}`)
    .on('click', function (ev, t) { on.has(t) && on.size > 1 ? on.delete(t) : on.add(t); d3.select(this).classed('x', !on.has(t)); paint(); });
  d3.select('#nloops').html('<span>Loops</span>').selectAll('button').data(L).join('button').text(l => l.n)
    .on('click', function (ev, l) { const i = L.indexOf(l); loop = loop === i ? -1 : i; d3.selectAll('#nloops button').classed('on', (d, j) => j === loop); paint(); });
  ng.on('mouseenter', (ev, [k]) => { hov = k; paint(); }).on('mouseleave', () => { hov = null; paint(); })
    .on('click', (ev, [, n]) => { const t = document.querySelector(n[3]); if (t && window.__lenis) window.__lenis.scrollTo(t, { duration: 1.6 }); });
  paint();
  let run = false; const speed = { people: .00009, money: .00014, rules: .00007, info: .00018 };
  d3.timer(t => {
    if (!run) return;
    pe.attr('transform', d => { const u = (d.s + t * speed[d.e.t]) % 1, p = d.e.el.getPointAtLength(u * d.e.len); return `translate(${p.x},${p.y})`; });
  });
  ScrollTrigger.create({ trigger: '#s15', start: 'top bottom', end: 'bottom top', onToggle: s => run = s.isActive });
  /* entrance: actors drop in, then edges draw */
  ScrollTrigger.create({ trigger: '#s15', start: 'top 60%', once: true, onEnter: () => {
    ng.attr('opacity', 0).transition().delay((d, i) => i * 60).duration(500).attr('opacity', 1);
    edges.attr('stroke-dasharray', e => `${e.len} ${e.len}`).attr('stroke-dashoffset', e => e.len).transition('draw').delay((e, i) => 500 + i * 30).duration(900).attr('stroke-dashoffset', 0)
      .on('end', function () { d3.select(this).attr('stroke-dasharray', null); });
  } });
})();
