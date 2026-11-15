/* Minds Adrift v3 · Act IV · L2 the campus travels */
(() => {
  const svg = d3.select('#campus').attr('viewBox', '10 60 610 400'); if (svg.empty()) return;
  const M = window.INDIA_MAP, SY = .56, X = l => 20.53 * l - 1399.75, Y = l => (-21.81 * l + 826.57);
  const CITY = { gift: ['GIFT City', 72.68, 23.16, -1], ncr: ['Delhi NCR', 77.2, 28.5, 1], mum: ['Navi Mumbai', 73.02, 19.03, 1], blr: ['Bengaluru', 77.59, 12.97, 1] };
  /* [name, city, step it appears, step it starts teaching (or -1)] */
  const U = [['Deakin', 'gift', 1, 1], ['Wollongong', 'gift', 2, 2],
    ['Liverpool', 'blr', 3, -1], ['York', 'mum', 3, -1], ['Aberdeen', 'mum', 3, -1], ['Western Australia', 'mum', 3, -1], ['Illinois Tech', 'mum', 3, -1], ['IED', 'mum', 3, -1],
    ['Southampton', 'ncr', 4, 4], ['Bristol', 'mum', 4, -1], ['La Trobe', 'blr', 4, -1], ['Western Sydney', 'ncr', 4, -1], ["Queen's Belfast", 'gift', 4, -1], ['Coventry', 'gift', 4, -1]];
  const STEPS = [['Nov 2023', 'India lets foreign universities open full campuses.'],
    ['Jul 2024', 'Deakin starts teaching in GIFT City.'],
    ['Nov 2024', 'Wollongong follows, next door.'],
    ['Jun 2025', 'Six letters of intent in a month.'],
    ['Aug 2025', 'Southampton opens in Gurugram. More approvals.']];
  const g = svg.append('g').attr('transform', 'translate(10,40)');
  const slab = (dy, fill, stroke) => g.append('g').attr('transform', `matrix(.98,0,0,${SY},6,${dy})`).selectAll('path').data(M.states).join('path').attr('d', s => s.d).attr('fill', fill).attr('stroke', stroke).attr('stroke-width', 1.6);
  slab(14, 'rgba(15,17,21,.06)', 'none'); slab(7, '#b9c0cc', '#b9c0cc'); slab(0, '#dde1e8', '#EEF0F3');
  const cities = Object.entries(CITY).map(([k, [n, lo, la, side]]) => ({ k, n, side, x: X(lo) * .98 + 6, y: Y(la) * SY, us: U.filter(u => u[1] === k) }));
  const DH = 9, RX = 11, RY = 5;
  const cg = g.append('g').selectAll('g').data(cities).join('g').attr('transform', c => `translate(${c.x},${c.y})`);
  cg.append('ellipse').attr('class', 'base').attr('rx', RX + 4).attr('ry', RY + 2).attr('fill', 'rgba(15,17,21,.12)');
  const discs = cg.selectAll('g.d').data(c => c.us.map((u, i) => ({ u, i }))).join('g').attr('class', 'd').attr('opacity', 0)
    .attr('transform', d => `translate(0,${-d.i * DH})`);
  discs.append('path').attr('class', 'side').attr('d', `M${-RX},0 v${-DH + 2} a${RX},${RY} 0 0 0 ${2 * RX},0 v${DH - 2} a${RX},${RY} 0 0 1 ${-2 * RX},0z`);
  discs.append('ellipse').attr('class', 'top').attr('cy', -DH + 2).attr('rx', RX).attr('ry', RY);
  const tip = document.getElementById('tip'), showTip = (e, h) => { tip.innerHTML = h; tip.style.opacity = 1; tip.style.left = (e.clientX + 16) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; }, hideTip = () => tip.style.opacity = 0;
  discs.on('mousemove', (e, d) => showTip(e, `<b style="font-size:15px">${d.u[0]}</b>${CITY[d.u[1]][0]} · ${d.u[3] >= 0 ? 'teaching' : 'approved'}`)).on('mouseleave', hideTip);
  const lab = cg.append('g').attr('class', 'lab');
  lab.append('line').attr('x2', c => c.side * 16).attr('stroke', '#2445FF').attr('stroke-width', 1);
  lab.append('text').attr('class', 'cn').attr('x', c => c.side * 20).attr('dy', 4).attr('text-anchor', c => c.side > 0 ? 'start' : 'end');
  const date = document.getElementById('cdate'), ev = document.getElementById('cev'), ctl = d3.select('#ctl');
  ctl.selectAll('button').data(STEPS).join('button').html(d => `<i></i>${d[0]}`).on('click', (e, d) => go(STEPS.indexOf(d)));
  let cur = -1;
  function go(k) {
    if (k === cur) return; const up = k > cur; cur = k;
    date.textContent = STEPS[k][0]; ev.textContent = STEPS[k][1];
    ctl.selectAll('button').classed('on', (d, i) => i <= k).classed('now', (d, i) => i === k);
    discs.each(function (d) {
      const show = d.u[2] <= k, teach = d.u[3] >= 0 && d.u[3] <= k, el = d3.select(this);
      el.classed('teach', teach);
      const was = +el.attr('opacity') > .5;
      if (show && !was) el.attr('opacity', 1).attr('transform', `translate(0,${-d.i * DH - 60})`).transition('pop').delay(d.i * 70).duration(700).ease(d3.easeBounceOut).attr('transform', `translate(0,${-d.i * DH})`);
      else if (!show && was) el.interrupt('pop').transition('pop').duration(250).attr('opacity', 0);
    });
    cg.select('.base').transition().duration(400).attr('opacity', c => c.us.some(u => u[2] <= k) ? 1 : 0);
    lab.each(function (c) { const n = c.us.filter(u => u[2] <= k).length, l = d3.select(this);
      l.transition().duration(500).attr('transform', `translate(${c.side * RX},${-n * DH - 4})`).attr('opacity', n ? 1 : 0);
      l.select('.cn').html(`${c.n}<tspan class="cc" dx="6">${n}</tspan>`); });
  }
  go(0);
  if (window.MA && MA.REDUCE) { go(STEPS.length - 1); return; }
  ScrollTrigger.create({ trigger: '#s14', start: 'top top', end: '+=180%', pin: true,
    onUpdate: s => go(Math.min(STEPS.length - 1, Math.floor(s.progress * STEPS.length * .999 + .15))) });
})();
