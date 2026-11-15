/* Minds Adrift v3 · Act III · S08 four steps from student to resident (Indians in the US) */
(() => {
  const fmtIN = window.MA.fmtIN, REDUCE = window.MA.REDUCE;
  const OPT = [97556, 143740], TOT = [331602, 363019], study = i => TOT[i] - OPT[i];
  const NOTE = ['<b>2023/24.</b> More Indians were still arriving to study.', '<b>2024/25.</b> Fewer are studying, but those working after their degree jumped <b>47%</b>.'];
  const host = document.getElementById('steps');
  const fig = '<svg viewBox="-7 -24 14 24" width="11" height="18"><circle cy="-18" r="4.2"/><path d="M-5,-12 h10 q2 0 2 2 v9 h-14 v-9 q0 -2 2 -2z"/></svg>';
  const STEPS = [
    { t: 'Studying', s: 'Indian students in US universities', v: study },
    { t: 'Working after the degree', s: 'on OPT: 1 year of work, 3 for STEM', v: i => OPT[i] },
    { t: 'Work visa (H-1B)', big: '72.3%', s: 'of all H-1B approvals went to Indians, FY2023' },
    { t: 'Green card', big: '7%', s: 'the most any one country can get each year. India has the longest queue.' }];
  const GATES = ['Graduate, then find a job within 90 days', 'Win the H-1B lottery. New hires from abroad: $100,000 fee since Sep 2025', 'Wait in the per-country queue'];
  host.innerHTML = STEPS.map((st, i) => `<div class="stp${st.v ? '' : ' est'}" style="--i:${i}"><div class="sn">Step ${i + 1}</div><h4>${st.t}</h4>${st.v ? `<b class="num" data-i="${i}">0</b><div class="figs" data-i="${i}"></div>` : `<b class="num">${st.big}</b>`}<p>${st.s}</p></div>` +
    (i < 3 ? `<div class="gate"><span class="ga">→</span><span class="gt">${GATES[i]}</span></div>` : '')).join('') + '<div class="home">← Going home · nobody counts it</div>';
  const nums = [...host.querySelectorAll('.num[data-i]')], figs = [...host.querySelectorAll('.figs')];
  let yi = -1; const cur = [0, 0];
  function setYear(i, anim = true) {
    if (i === yi) return; yi = i;
    document.querySelectorAll('#fyr button').forEach(b => b.classList.toggle('on', +b.dataset.y === i));
    document.getElementById('fnote').innerHTML = NOTE[i];
    [0, 1].forEach(k => { const to = STEPS[k].v(i), o = { v: cur[k] };
      gsap.to(o, { v: to, duration: anim ? 1 : 0, ease: 'power2.out', onUpdate: () => nums[k].textContent = fmtIN(Math.round(o.v)) }); cur[k] = to;
      const n = Math.round(to / 10000), el = figs[k], have = el.children.length;
      for (let j = have; j < n; j++) { el.insertAdjacentHTML('beforeend', fig); const f = el.lastChild; if (anim) gsap.from(f, { opacity: 0, y: -8, duration: .35, delay: (j - have) * .04 }); }
      for (let j = have; j > n; j--) { const f = el.lastChild; f.remove(); }
    });
  }
  document.querySelectorAll('#fyr button').forEach(b => b.addEventListener('click', () => setYear(+b.dataset.y)));
  setYear(0, false);
  const stepsEl = [...host.querySelectorAll('.stp,.gate')]; document.getElementById('s08').classList.add('in');
  const reveal = n => stepsEl.forEach((e, i) => e.classList.toggle('vis', i < n));
  if (REDUCE) { reveal(99); setYear(1, false); }
  else { reveal(1); ScrollTrigger.create({ trigger: '#s08', start: 'top top', end: '+=220%', pin: true, onUpdate: st => { const n = 1 + Math.floor(st.progress * 8); reveal(n); setYear(st.progress > .85 ? 1 : 0); } }); }
})();

/* A2 · what you keep: a full bar, then tax and contributions take their bite */
(() => {
  const R = [['UK', 15.5, 5.9], ['USA', 16.7, 7.7], ['Australia', 25.3, 0], ['Canada', 18.9, 6.6], ['Germany', 16.7, 20.7]];
  const sv = d3.select('#keep'), X0 = 150, W = 640, RH = 56;
  const tip = document.getElementById('tip');
  const row = sv.selectAll('g.r').data(R).join('g').attr('class', 'r').attr('transform', (d, i) => `translate(0,${i * RH})`);
  row.append('text').attr('x', X0 - 16).attr('y', 26).attr('text-anchor', 'end').attr('font-family', 'Inter').attr('font-weight', 600).attr('font-size', 15).text(d => d[0]);
  row.append('rect').attr('class', 'kept').attr('x', X0).attr('y', 8).attr('height', 26).attr('rx', 5).attr('width', W).attr('fill', '#2445FF');
  const tax = row.append('rect').attr('x', X0).attr('y', 8).attr('height', 26).attr('rx', 5).attr('width', 0).attr('fill', '#0F1115');
  const ssc = row.append('rect').attr('x', X0).attr('y', 8).attr('height', 26).attr('width', 0).attr('fill', '#94A3FF');
  const big = row.append('text').attr('x', X0 + W + 22).attr('y', 32).attr('font-family', 'Fraunces').attr('font-weight', 800).attr('font-size', 30).attr('fill', '#2445FF').text('100');
  row.append('text').attr('class', 'kl').attr('x', X0 + W + 118).attr('y', 30).attr('font-family', 'Plex').attr('font-size', 11).attr('fill', 'rgba(15,17,21,.5)').attr('opacity', 0).text(d => `tax ${d[1]} · contributions ${d[2]}`);
  const lg = sv.append('g').attr('transform', `translate(${X0},${R.length * RH + 16})`);
  [['Income tax', '#0F1115'], ['Social security (employee)', '#94A3FF'], ['What you keep', '#2445FF']].reduce((x, [n, c]) => { const g = lg.append('g').attr('transform', `translate(${x},0)`); g.append('rect').attr('width', 12).attr('height', 12).attr('rx', 3).attr('fill', c); g.append('text').attr('x', 18).attr('y', 10).attr('font-family', 'Inter').attr('font-size', 12).attr('fill', 'rgba(15,17,21,.7)').text(n); return x + n.length * 7 + 46; }, 0);
  row.on('mousemove', (e, d) => { tip.innerHTML = `<b>${(100 - d[1] - d[2]).toFixed(1)} kept</b>${d[0]} · tax ${d[1]}% · social security ${d[2]}%`; tip.style.opacity = 1; tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 12) + 'px'; }).on('mouseleave', () => tip.style.opacity = 0);
  ScrollTrigger.create({ trigger: '#s09', start: 'top 60%', once: true, onEnter: () => {
    const T = window.MA.REDUCE ? 0 : 1;
    tax.transition().delay((d, i) => 300 * T + i * 120 * T).duration(800 * T).ease(d3.easeCubicOut).attr('width', d => d[1] / 100 * W);
    ssc.attr('x', X0).transition().delay((d, i) => 300 * T + i * 120 * T).duration(800 * T).ease(d3.easeCubicOut).attr('x', d => X0 + d[1] / 100 * W).attr('width', d => d[2] / 100 * W);
    big.transition().delay((d, i) => 300 * T + i * 120 * T).duration(800 * T).tween('text', function (d) { const f = d3.interpolateNumber(100, 100 - d[1] - d[2]), el = this; return t => { el.textContent = f(t).toFixed(1); }; });
    sv.selectAll('.kl').transition().delay(1400 * T).duration(400).attr('opacity', 1);
  } });
})();

/* A3 · the quiet cost: tally strokes, grouped in fives; strokes for attacks in cobalt */
(() => {
  if (!document.getElementById('qtally')) return;
  const C = [['Canada', 172, 9], ['USA', 108, 6], ['UK', 58, 1], ['Australia', 57, 1], ['Russia', 37, 0], ['Germany', 24, 0], ['Ukraine', 18, 0], ['Italy', 18, 0], ['Georgia', 12, 0], ['Kyrgyzstan', 12, 1], ['Cyprus', 12, 0], ['China', 8, 1], ['29 others', 97, 0]];
  const sv = d3.select('#qtally'), X0 = 120, SW = 4.2, GAP = 7, PER = 50, RH = 22;
  const rows = sv.selectAll('g.t').data(C).join('g').attr('class', 't').attr('transform', (d, i) => `translate(${i < 7 ? 0 : 520},${(i % 7) * RH * 1.95 + 10})`);
  rows.append('text').attr('x', X0 - 12).attr('y', 14).attr('text-anchor', 'end').attr('font-family', 'Inter').attr('font-size', 12.5).attr('fill', 'rgba(15,17,21,.75)').text(d => d[0]);
  rows.append('text').attr('class', 'n').attr('x', X0 - 12).attr('y', 28).attr('text-anchor', 'end').attr('font-family', 'Plex').attr('font-size', 10.5).attr('fill', 'rgba(15,17,21,.45)').text(d => d[1]);
  const marks = rows.selectAll('line').data(d => d3.range(d[1]).map(k => ({ k, atk: k < d[2] }))).join('line')
    .attr('x1', m => { const g = Math.floor(m.k / 5), r = Math.floor(m.k / PER), kk = m.k % PER, gg = Math.floor(kk / 5); return X0 + gg * (5 * SW + GAP) + (kk % 5) * SW; })
    .attr('x2', m => { const kk = m.k % PER, gg = Math.floor(kk / 5); return X0 + gg * (5 * SW + GAP) + (kk % 5) * SW; })
    .attr('y1', m => Math.floor(m.k / PER) * 13 + 2).attr('y2', m => Math.floor(m.k / PER) * 13 + 2)
    .attr('stroke', m => m.atk ? '#2445FF' : '#0F1115').attr('stroke-width', 1.6).attr('stroke-linecap', 'round');
  const SPLIT = 6, hOf = c => Math.max(2, Math.ceil(c[1] / PER)) * 13 + 20;
  rows.attr('transform', (d, i) => `translate(${i < SPLIT ? 0 : 520},${10 + C.slice(i < SPLIT ? 0 : SPLIT, i).reduce((a, c) => a + hOf(c), 0)})`);
  const colH = Math.max(C.slice(0, SPLIT).reduce((a, c) => a + hOf(c), 0), C.slice(SPLIT).reduce((a, c) => a + hOf(c), 0) + 40);
  sv.attr('viewBox', `0 0 1000 ${colH + 20}`);
  const lg = sv.append('g').attr('transform', `translate(520,${C.slice(SPLIT).reduce((a, c) => a + hOf(c), 0) + 30})`);
  lg.append('line').attr('x1', 0).attr('x2', 0).attr('y1', -6).attr('y2', 6).attr('stroke', '#0F1115').attr('stroke-width', 1.6); lg.append('text').attr('x', 8).attr('y', 4).attr('font-family', 'Inter').attr('font-size', 11.5).attr('fill', 'rgba(15,17,21,.6)').text('one student');
  lg.append('line').attr('x1', 110).attr('x2', 110).attr('y1', -6).attr('y2', 6).attr('stroke', '#2445FF').attr('stroke-width', 1.6); lg.append('text').attr('x', 118).attr('y', 4).attr('font-family', 'Inter').attr('font-size', 11.5).attr('fill', 'rgba(15,17,21,.6)').text('died in an attack');
  ScrollTrigger.create({ trigger: '#s12', start: 'top 60%', once: true, onEnter: () => {
    marks.attr('y2', function () { return +this.getAttribute('y1'); }).transition().delay(m => window.MA.REDUCE ? 0 : m.k * 9).duration(200).attr('y2', function () { return +this.getAttribute('y1') + 11; });
  } });
})();
