/* Minds Adrift · prologue */
gsap.registerPlugin(ScrollTrigger);
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmtIN = n => Math.round(n).toLocaleString('en-IN');
if (!REDUCE && window.Lenis) {
  const lenis = new Lenis({ lerp: 0.09 }); window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
}
/* helper: pinned section with N statements shown one at a time */
function steps(tl, ids, at0 = 0, span = 1) {
  const n = ids.length, w = span / n;
  ids.forEach((id, i) => {
    const el = document.getElementById(id); if (!el) return;
    const t = at0 + i * w;
    tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: w * .25, ease: 'power2.out' }, t);
    if (i < n - 1) tl.to(el, { opacity: 0, y: -16, duration: w * .2 }, t + w * .8);
  });
}
window.MA = { steps, fmtIN, REDUCE };

/* ---------- HERO ---------- */
(() => {
  const g = document.getElementById('windows'); let html = ''; let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  [[0, 640, 220], [200, 600, 260], [440, 660, 180], [900, 630, 230], [1110, 680, 200], [1290, 620, 240], [1510, 660, 120]].forEach(([x, y, w]) => {
    for (let yy = y + 22; yy < 770; yy += 30) for (let xx = x + 16; xx < x + w - 18; xx += 26) if (r() < .55) html += `<rect class="win" x="${xx}" y="${yy}" width="12" height="16" opacity="0" data-o="${(.08 + r() * .35).toFixed(2)}"/>`;
  });
  g.innerHTML = html;
})();
gsap.to('#beacon', { opacity: 0, repeat: -1, yoyo: true, duration: .5, ease: 'steps(1)' });
gsap.to('#towerlight', { opacity: .15, repeat: -1, yoyo: true, duration: 1.1, ease: 'steps(1)' });
gsap.to('#tubeglow', { opacity: .4, repeat: -1, yoyo: true, duration: .08, repeatDelay: 2.6 });
gsap.to('#phoneglow', { opacity: .45, repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut' });
gsap.from('#hero h1, #hero .lede', { y: 30, opacity: 0, duration: 1.1, stagger: .15, ease: 'power3.out', delay: .2 });
gsap.from('#L-near', { y: 80, duration: 1.6, ease: 'power3.out' });

const fp = document.getElementById('flightpath'), plane = document.getElementById('plane'), trail = document.getElementById('trail');
const FL = fp.getTotalLength(); trail.style.strokeDasharray = FL;
const placePlane = p => { const a = fp.getPointAtLength(p * FL), b = fp.getPointAtLength(Math.min(FL, p * FL + 2)); plane.setAttribute('transform', `translate(${a.x},${a.y}) rotate(${Math.atan2(b.y - a.y, b.x - a.x) * 57.3})`); trail.style.strokeDashoffset = FL * (1 - p); };
placePlane(.08);
const idle = gsap.to({ p: .08 }, { p: .16, duration: 9, ease: 'none', onUpdate() { placePlane(this.targets()[0].p) } });
const ps = { p: .16 };
const heroTL = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=180%', scrub: .6, pin: true, onEnter: () => idle.kill() } });
heroTL.to(ps, { p: 1, ease: 'none', duration: 1, onUpdate: () => placePlane(ps.p) }, 0)
  .to('#L-far', { y: -30, ease: 'none', duration: 1 }, 0).to('#L-mid', { y: -70, ease: 'none', duration: 1 }, 0).to('#L-near', { y: -120, ease: 'none', duration: 1 }, 0)
  .to('.win', { opacity: (i, el) => el.dataset.o, stagger: { each: .002, from: 'random' }, duration: .05 }, .05)
  .to('#hero .cue', { opacity: 0, duration: .1 }, .05)
  .to('#hero .copy', { opacity: 0, y: -40, duration: .25 }, .45)
  .fromTo('#flash', { scale: 0 }, { scale: 150, duration: .18, ease: 'power2.in', onStart: posFlash }, .82);
function posFlash() { const ph = document.getElementById('phone').getBoundingClientRect(), hr = document.getElementById('hero').getBoundingClientRect(), f = document.getElementById('flash'); f.style.left = (ph.left + ph.width / 2 - hr.left) + 'px'; f.style.top = (ph.top + ph.height / 2 - hr.top) + 'px'; }

/* ---------- CHAT: one message, one fact ---------- */
(() => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#chat', start: 'top top', end: '+=200%', scrub: .5, pin: true } });
  tl.from('#chat .phone', { scale: 1.4, opacity: 0, duration: .12 });
  ['m1', 'm2', 'm3'].forEach((m, i) => { const t = .16 + i * .2; tl.to('#' + m, { opacity: 1, y: 0, duration: .05 }, t); if (i < 2) tl.to('#' + m, { opacity: .4, duration: .04 }, t + .18); });
  tl.fromTo('#f3', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .08 }, .62);
  tl.to('#m4', { opacity: 1, y: 0, duration: .05 }, .93);
})();

/* ---------- PASS ---------- */
gsap.timeline({ scrollTrigger: { trigger: '#pass', start: 'top top', end: '+=160%', scrub: .5, pin: true } })
  .fromTo('#card', { clipPath: 'inset(0 0 100% 0)', y: -40 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: .3 })
  .to('#pnote', { opacity: 1, duration: .1 }, .3)
  .to({}, { duration: .2 })
  .to('#card', { scale: .03, opacity: 0, duration: .25, ease: 'power3.in' }, .65)
  .to('#pnote', { opacity: 0, duration: .08 }, .65)
  .to('#pdot', { scale: 1, duration: .08 }, .86);

/* ---------- FIELD ---------- */
(() => {
  const cv = document.getElementById('fieldc'), ctx = cv.getContext('2d'), D = window.INDIA, N = D.dots.length;
  let W, H, dpr, S, ox, oy, R = 3;
  const dest = [{ v: 427000, fx: .14, fy: .3 }, { v: 337630, fx: .15, fy: .7 }, { v: 185000, fx: .42, fy: .22 }, { v: 122202, fx: .85, fy: .72 }, { v: 264046, fx: .85, fy: .3 }];
  let ai = 0, bd = 1e9; D.dots.forEach((d, i) => { const q = (d[0] - D.gnt[0]) ** 2 + (d[1] - D.gnt[1]) ** 2; if (q < bd) { bd = q; ai = i } });
  const tot = dest.reduce((a, d) => a + d.v, 0), order = D.dots.map((d, i) => i).sort((a, b) => D.dots[a][1] - D.dots[b][1] || D.dots[a][0] - D.dots[b][0]);
  const asg = new Array(N); let c = 0; dest.forEach((d, di) => { const n = Math.round(d.v / tot * N); for (let j = 0; j < n && c < N; j++) asg[order[c++]] = di }); while (c < N) asg[order[c++]] = 4; asg[ai] = 0;
  const slot = new Array(N), cnt = dest.map(() => 0); for (let i = 0; i < N; i++) if (i !== ai) slot[i] = cnt[asg[i]]++; slot[ai] = cnt[0]++;
  const CS = 18, cols = cnt.map(() => CS), RMAX = Math.ceil(Math.max(...cnt) / CS);
  const gap = () => Math.min(R * 2.7, H * .4 / RMAX), colX = di => W * (.14 + di * .18), baseY = () => H * .7;
  let sd = 3; const rnd = () => (sd = (sd * 9301 + 49297) % 233280) / 233280; const jit = D.dots.map(() => rnd());
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, cl = v => Math.max(0, Math.min(1, v));
  const st = { p: 0 };
  function size() { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; S = Math.min(H * .84 / D.h, W * .5 / D.w); ox = W * .58 - D.w * S / 2; oy = H * .52 - D.h * S / 2; R = Math.max(1.4, D.step * S * .3); labels(); draw(); }
  function tgt(i) { const di = asg[i], g = gap(); return [colX(di) + ((slot[i] % CS) - (CS - 1) / 2) * g, baseY() - Math.floor(slot[i] / CS) * g]; }
  function labels() { if (!W) return; dest.forEach((de, di) => { const el = document.getElementById('d' + di); if (!el) return; const g = gap(); el.style.left = (colX(di) - CS / 2 * g) + 'px'; el.style.top = (baseY() + g + 12) + 'px'; }); }
  function draw() {
    const p = st.p; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    if (p > .58) { ctx.fillStyle = `rgba(15,17,21,${cl((p - .58) / .2) * .045})`; for (let i = 0; i < N; i++) { const d = D.dots[i]; ctx.beginPath(); ctx.arc(ox + d[0] * S, oy + d[1] * S, R * .6, 0, 6.283); ctx.fill(); } }
    const pos = i => {
      const d = D.dots[i], ix = ox + d[0] * S, iy = oy + d[1] * S;
      if (p < .4) { const t = ease(cl((p / .4) * 1.4 - jit[i] * .4)); return [cx + (ix - cx) * t, cy + (iy - cy) * t]; }
      if (p < .58) return [ix, iy];
      const [tx, ty] = tgt(i), t = ease(cl(((p - .58) / .34) * 1.5 - jit[i] * .5)), mx = (ix + tx) / 2 + (iy - ty) * .2, my = (iy + ty) / 2 - Math.abs(ix - tx) * .15;
      return [(1 - t) ** 2 * ix + 2 * (1 - t) * t * mx + t * t * tx, (1 - t) ** 2 * iy + 2 * (1 - t) * t * my + t * t * ty];
    };
    for (let i = 0; i < N; i++) { if (i === ai) continue; const [x, y] = pos(i); const di = asg[i]; ctx.fillStyle = (p > .7 && di === 4) ? 'rgba(15,17,21,.3)' : 'rgba(15,17,21,.78)'; ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill(); }
    const [x, y] = pos(ai); ctx.fillStyle = 'rgba(36,69,255,.18)'; ctx.beginPath(); ctx.arc(x, y, R * 4.4, 0, 6.283); ctx.fill(); ctx.fillStyle = '#2445FF'; ctx.beginPath(); ctx.arc(x, y, R * 1.9, 0, 6.283); ctx.fill();
    if (p > .25) { ctx.font = '600 11px Plex, monospace'; ctx.fillStyle = '#2445FF'; if (p > .8) ctx.fillText('ANANYA', x - 4, y - 14); else ctx.fillText('ANANYA · GUNTUR', x + 12, y + 4); }
  }
  addEventListener('resize', size); new ResizeObserver(() => size()).observe(cv); size();
  const cntEl = document.getElementById('cnt');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#field', start: 'top top', end: '+=260%', scrub: .5, pin: true } });
  tl.to(st, { p: .57, ease: 'none', duration: .5, onUpdate: draw }, 0)
    .fromTo('#ff1', { opacity: 0 }, { opacity: 1, duration: .05 }, .05)
    .to({ v: 0 }, { v: 1335878, duration: .4, ease: 'power1.out', onUpdate() { cntEl.textContent = fmtIN(this.targets()[0].v) } }, .05)
    .to('#ff1', { opacity: 0, duration: .06 }, .55)
    .to(st, { p: 1, ease: 'none', duration: .55, onUpdate: draw }, .55)
    .fromTo('.dlab', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .08, stagger: .03 }, .9)
    .fromTo('#rpill', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .08 }, 1.08).to({}, { duration: .25 });
})();

/* ---------- QUESTION: will Ananya come back? ---------- */
(() => {
  if (!document.getElementById('question')) return;
  const w = [...document.querySelectorAll('#question .qa > span')];
  if (REDUCE) { w.forEach(e => e.style.opacity = 1); return; }
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#question', start: 'top top', end: '+=110%', pin: true, scrub: .4 } });
  tl.fromTo(w, { opacity: 0, y: 18, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .22, duration: .3 })
    .fromTo('#question .an i', { scale: 0 }, { scale: 1, duration: .15, ease: 'back.out(3)' }, .25).to({}, { duration: .4 });
})();

/* 'you are here' moved to nav.js */
/* hero video: loops; first run drives the counter, then the page glides to the Rao family chat (once, only if the visitor hasn't scrolled); restarts when the hero is re-entered or "Back to top" is used */
(() => {
  const v = document.getElementById('hvid'), c = document.getElementById('hcount'); if (!v || !c) return;
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.loop = true;
  const full = () => { c.textContent = fmtIN(1335878); };
  if (REDUCE) { v.loop = false; v.addEventListener('loadedmetadata', () => { v.currentTime = Math.max(0, v.duration - .1); }); full(); return; }
  c.textContent = '0';
  let raf, counted = false, guided = false, userScrolled = false, last = 0;
  addEventListener('wheel', () => userScrolled = true, { passive: true }); addEventListener('touchmove', () => userScrolled = true, { passive: true });
  addEventListener('keydown', e => { if (['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) userScrolled = true; });
  const tick = () => {
    if (v.currentTime < last - 1) { /* wrapped: first loop finished */
      if (!counted) { counted = true; full(); }
      if (!guided && !userScrolled && scrollY < 40) { guided = true; const t = document.getElementById('chat'); t && window.__lenis && window.__lenis.scrollTo(t, { duration: 2.6 }); }
    }
    last = v.currentTime;
    if (!counted) { const k = v.duration ? Math.min(1, v.currentTime / (v.duration * .85)) : 0; c.textContent = fmtIN(1335878 * k); }
    if (!away) raf = requestAnimationFrame(tick);
  };
  const restart = () => { try { v.currentTime = 0; } catch (e) {} last = 0; const p = v.play(); if (p && p.catch) p.catch(full); };
  const start = () => { restart(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  const go = () => (v.readyState >= 3 ? start() : v.addEventListener('canplaythrough', start, { once: true }));
  if (document.readyState === 'complete') setTimeout(go, 300); else addEventListener('load', () => setTimeout(go, 300), { once: true });
  let away = false;
  const watch = () => { const y = scrollY; if (y > innerHeight * 1.2) { if (!away) { away = true; v.pause(); } } else if (away && y < innerHeight * .5) { away = false; restart(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } };
  addEventListener('scroll', watch, { passive: true }); window.__lenis && window.__lenis.on && window.__lenis.on('scroll', watch);
  document.addEventListener('click', e => { if (e.target.closest('#totop')) setTimeout(restart, 600); });
  setTimeout(() => { if (v.paused && v.currentTime === 0) full(); }, 9000);
})();
