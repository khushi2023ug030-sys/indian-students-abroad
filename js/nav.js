/* Minds Adrift v3 · quiet navigation: progress hairline + chapter pill */
(() => {
  const CH = [['#chat', 'Home'], ['#s04', 'Passage'], ['#s07', 'Abroad'], ['#s13', 'Back home'], ['#s16', 'Sources']];
  const ALL = [['#s01', 'Students by country'], ['#s02', 'Students by Indian state'], ['#s03', 'NEET and MBBS abroad'], ['#s04', 'Work and stay rules'], ['#s05', 'Visa steps and fees'], ['#s06', 'Money sent for education'],
    ['#s07', 'Departures by year'], ['#s07u', 'Top universities'], ['#s07f', 'What they study'], ['#s08', 'Student to green card'], ['#s09', 'Take-home pay'], ['#s13', 'Money sent home'], ['#s14', 'Campuses in India'], ['#s15', 'System map'], ['#s16', 'Sources']];
  const el = document.getElementById('here'); if (!el) return;
  const bar = document.createElement('div'); bar.className = 'prog'; document.body.appendChild(bar);
  el.innerHTML = `<button class="hp" aria-expanded="false"><svg viewBox="0 0 34 22" width="34" height="22"><ellipse cx="17" cy="11" rx="14" ry="8" fill="none" stroke="#2445FF" stroke-width="1.3"/>${[[3, 11], [17, 3], [31, 11], [17, 19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6"/>`).join('')}</svg><span id="herel">Home</span></button>
    <ol class="hm">${ALL.map(([s, n], i) => `<li><a href="${s}"><i>${String(i + 1).padStart(2, '0')}</i>${n}</a></li>`).join('')}</ol>`;
  const btn = el.querySelector('.hp'), lab = el.querySelector('#herel'), dots = el.querySelectorAll('circle'), links = [...el.querySelectorAll('.hm a')];
  btn.addEventListener('click', () => { const o = el.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  links.forEach(a => a.addEventListener('click', e => { e.preventDefault(); el.classList.remove('open'); const t = document.querySelector(a.getAttribute('href')); t && window.__lenis && window.__lenis.scrollTo(t, { duration: 2 }); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') el.classList.remove('open'); });
  document.addEventListener('click', e => { if (!el.contains(e.target)) el.classList.remove('open'); });
  let cur = -1;
  const tick = () => {
    const H = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${H > 0 ? scrollY / H : 0})`;
    let k = -1; CH.forEach(([s], i) => { const t = document.querySelector(s); if (t && t.getBoundingClientRect().top < innerHeight * .5) k = i; });
    const ft = document.getElementById('foot'); el.classList.toggle('on', k >= 0 && !(ft && ft.getBoundingClientRect().top < innerHeight - 60));
    if (k >= 0 && k !== cur) { cur = k; lab.textContent = CH[k][1]; dots.forEach((d, i) => d.setAttribute('fill', i === Math.min(k, 3) ? '#2445FF' : 'rgba(15,17,21,.22)'));
      links.forEach(a => a.classList.toggle('cur', a.getAttribute('href') === CH[k][0])); gsap.fromTo(lab, { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: .4 }); }
  };
  addEventListener('scroll', tick, { passive: true }); tick();
})();
document.getElementById('totop') && document.getElementById('totop').addEventListener('click', e => { e.preventDefault(); window.__lenis && window.__lenis.scrollTo(0, { duration: 2 }); });
/* top bar: chapters + all-charts menu; hides while scrolling down, returns on scroll up */
(() => {
  const CH = [['#chat', 'Home'], ['#s04', 'Passage'], ['#s07', 'Abroad'], ['#s13', 'Back home'], ['#s15', 'System'], ['#s16', 'Sources']];
  const bar = document.createElement('header'); bar.id = 'topbar';
  const pillMenu = document.querySelector('.here .hm');
  bar.innerHTML = `<a class="tb-logo" href="#hero">INDIAN STUDENTS<br>GOING ABROAD</a><nav>${CH.map(([s, n]) => `<a href="${s}">${n.toUpperCase()}</a>`).join('')}<button class="tb-all" aria-expanded="false">ALL CHARTS ▾</button></nav><div class="tb-drop">${pillMenu ? pillMenu.outerHTML : ''}</div>`;
  document.body.appendChild(bar);
  const links = [...bar.querySelectorAll('nav a')], drop = bar.querySelector('.tb-drop'), all = bar.querySelector('.tb-all');
  const go = (sel, e) => { e && e.preventDefault(); drop.classList.remove('open'); const t = document.querySelector(sel); if (sel === '#hero') window.__lenis.scrollTo(0, { duration: 2 }); else if (t) { const y = t.getBoundingClientRect().top + scrollY; window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.6, force: true, lock: true }) : scrollTo(0, y); } };
  bar.querySelectorAll('a').forEach(a => a.addEventListener('click', e => go(a.getAttribute('href'), e)));
  all.addEventListener('click', e => { e.stopPropagation(); const o = drop.classList.toggle('open'); all.setAttribute('aria-expanded', o); });
  document.addEventListener('click', e => { if (!bar.contains(e.target)) drop.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') drop.classList.remove('open'); });
  let lastY = 0;
  const upd = () => { const y = scrollY, hero = document.getElementById('hero');
    bar.classList.toggle('dark', y < (hero ? hero.offsetHeight * .8 : 600));
    if (!drop.classList.contains('open')) bar.classList.toggle('hide', y > 200 && y > lastY + 2);
    if (y < lastY - 2) bar.classList.remove('hide'); lastY = y;
    let k = -1; CH.forEach(([s], i) => { const t = document.querySelector(s); if (t && t.getBoundingClientRect().top < innerHeight * .5) k = i; });
    links.forEach((a, i) => a.classList.toggle('cur', i === k)); };
  addEventListener('scroll', upd, { passive: true }); upd();
  const pill = document.getElementById('here'); if (pill) pill.style.display = 'none';
})();
