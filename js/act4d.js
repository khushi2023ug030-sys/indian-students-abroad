/* Minds Adrift v3 · Act IV · L4 data room */
(() => {
  const room = document.getElementById('droom'); if (!room) return;
  /* [label, publisher, status 1 official / 2 via secondary / 0 gap, section] */
  const C = [
    ['Before they leave', [
      ['Indian students abroad, 108 countries', 'MEA, 2024', 1, '#s01'], ['Outbound to inbound ratio', 'NITI Aayog, 2025', 1, '#field'],
      ['Students leaving, by state', 'Bureau of Immigration', 2, '#s02'], ['NEET-UG candidates', 'NTA, 2024', 1, '#s03'], ['MBBS seats', 'NMC', 2, '#s03'], ['FMGE pass rates', 'NBEMS', 2, '#s03'],
      ['Why each student chose to go', 'no national survey', 0, '#s03']]],
    ['Getting there', [
      ['Study and work rules, 5 countries', 'IRCC · USCIS · Home Office · Home Affairs · German law', 1, '#s04'], ['H-1B approvals by country', 'USCIS, FY2023', 1, '#s08'],
      ['Visa and admission fees', 'IRCC · State Dept · Home Office · APS India', 1, '#s05'], ['Money sent abroad for study', 'RBI, LRS', 1, '#s06'], ['Education loans', 'Ministry of Finance', 2, '#s06'],
      ['Agent commissions', 'not disclosed', 0, '#s15'], ['Student share of LRS', 'not separated from other travel', 0, '#s06']]],
    ['Abroad', [
      ['Departures by country, by year', 'MEA · Bureau of Immigration', 2, '#s07'], ['Indians enrolled in the US', 'Open Doors (IIE), 2025', 1, '#s07'], ['Germany, by year', 'only 2020 and 2024', 0, '#s07'],
      ['Field of study, US and Germany', 'Open Doors · DAAD', 1, '#s07f'], ['Field of study, UK, Canada, Australia', 'not by nationality', 0, '#s07f'],
      ['OPT and H-1B steps', 'IIE · USCIS', 1, '#s08'], ['Tax and social security', 'OECD Taxing Wages 2025', 1, '#s09'],
      ['Indians by university abroad', 'not published', 0, '#s07u']]],
    ['Coming back', [
      ['Remittances, by source country', 'RBI survey, 2023-24', 1, '#s13'], ['Foreign campuses in India', 'UGC · IFSCA · MoE', 1, '#s14'], ['System map and loops', 'Minds Adrift v1', 2, '#s15'],
      ['Students who return', 'nobody counts it', 0, '#s08'], ['Remittances sent by students', 'not separated', 0, '#s13']]]
  ];
  room.innerHTML = C.map(([h, xs]) => `<div class="dcol"><h3>${h}</h3><div class="chips">${xs.map(([l, p, s, t]) =>
    `<a class="chip s${s}" href="${t}" data-k="${(l + ' ' + p).toLowerCase()}"><b>${l}</b><span>${p}</span></a>`).join('')}</div></div>`).join('');
  const cols = [...room.querySelectorAll('.dcol')], tabs = document.createElement('div'); tabs.className = 'dtabs';
  tabs.innerHTML = C.map(([h], i) => `<button class="${i ? '' : 'on'}">${h}</button>`).join('') + '<button>All</button>';
  room.before(tabs); cols[0].classList.add('show');
  [...tabs.children].forEach((b, i) => b.addEventListener('click', () => { [...tabs.children].forEach(x => x.classList.toggle('on', x === b)); cols.forEach((c, j) => c.classList.toggle('show', i === C.length || i === j)); }));
  const chips = [...room.querySelectorAll('.chip')], q = document.getElementById('dq'), gap = document.getElementById('dgap');
  let gapsOnly = false;
  function filt() { const v = q.value.trim().toLowerCase();
    chips.forEach(c => c.classList.toggle('off', (gapsOnly && !c.classList.contains('s0')) || (v && !c.dataset.k.includes(v)))); }
  q.addEventListener('input', filt);
  gap.addEventListener('click', () => { gapsOnly = !gapsOnly; if (gapsOnly) tabs.lastChild.click(); gap.classList.toggle('on', gapsOnly); filt(); });
  chips.forEach(c => c.addEventListener('click', e => { e.preventDefault(); const t = document.querySelector(c.getAttribute('href')); if (t && window.__lenis) window.__lenis.scrollTo(t, { duration: 1.8 }); }));
  chips.forEach((c, i) => c.style.setProperty('--i', i % 9));
  ScrollTrigger.create({ trigger: '#s16', start: 'top 75%', once: true, onEnter: () => room.classList.add('in') });
})();
