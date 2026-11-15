/* Minds Adrift v3 · Act IV · L1 money comes home (3D) */
(() => {
  const host = document.getElementById('mglobe'); if (!host || !window.Globe3D) return;
  const TOTAL = 118.7, IN = [79, 22];
  const SRC = [['USA', 27.7, [-98, 39]], ['UAE', 19.2, [54, 24]], ['UK', 10.8, [-2, 53.5]], ['Saudi Arabia', 6.7, [45, 24]], ['Singapore', 6.6, [103.8, 1.35]],
    ['Qatar, Oman, Bahrain', 8.2, [51.2, 25.3]], ['Kuwait', 3.9, [47.5, 29.3]], ['Canada', 3.8, [-96, 56]], ['Australia', 2.3, [134, -25]]];
  const G = Globe3D.make(host, { dist: 4.7 }); window.__G = G;
  G.marker(IN[0], IN[1], 0x2445ff, .16); G.marker(IN[0], IN[1], 0xffffff, .06);
  const arcs = SRC.map(([n, s, ll]) => G.addArc(ll, IN, s / 10));
  G.setFocus(30, 32);
  const list = document.getElementById('mlist');
  list.innerHTML = SRC.map(([n, s]) => `<li><span>${n}</span><b>$${(s / 100 * TOTAL).toFixed(1)} bn</b><i><s style="width:${s / 27.7 * 100}%"></s></i></li>`).join('') + `<li><span>Rest of the world</span><b>$${(10.8 / 100 * TOTAL).toFixed(1)} bn</b><i><s style="width:${10.8 / 27.7 * 100}%"></s></i></li>`;
  const items = [...list.children], ctr = document.getElementById('mctr');
  let shown = 0;
  function upTo(k) {
    for (let i = 0; i < SRC.length; i++) {
      const on = i < k; items[i].classList.toggle('on', on);
      arcs[i].pT = on ? 1 : 0;
    }
    items[SRC.length].classList.toggle('on', k >= SRC.length);
    const sum = SRC.slice(0, k).reduce((a, s) => a + s[1], 0) + (k >= SRC.length ? 10.8 : 0);
    gsap.to({ v: +ctr.textContent }, { v: sum / 100 * TOTAL, duration: .9, ease: 'power2.out', onUpdate() { ctr.textContent = this.targets()[0].v.toFixed(1); } });
    const f = SRC[Math.max(0, Math.min(SRC.length - 1, k - 1))][2];
    if (k >= SRC.length) { G.setFocus(55, 28); G.setSpin(.04); } else { G.setFocus(f[0] < 0 ? 25 : Math.max(40, (f[0] + IN[0]) / 2), f[0] < 0 ? 38 : 22); G.setSpin(0); }
    shown = k;
  }
  if (window.MA.REDUCE) { upTo(SRC.length); arcs.forEach(a => { a.p = 1; a.pT = 1; }); return; }
  ScrollTrigger.create({ trigger: '#s13', start: 'top top', end: '+=220%', pin: true,
    onUpdate: s => { const k = Math.min(SRC.length, Math.floor(s.progress * (SRC.length + 1.6))); if (k !== shown) upTo(k); } });
  G.setVisible(false);
  ScrollTrigger.create({ trigger: '#s13', start: 'top bottom', end: 'bottom top', onToggle: s => G.setVisible(s.isActive) });
})();
