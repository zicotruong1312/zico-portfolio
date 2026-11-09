/* ══════════════════════════════════════════════════
   loader.js — Loading Screen Logic
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const loaderEl = document.getElementById('loading-screen');
  const barFill  = document.getElementById('loader-bar-fill');
  const pctEl    = document.getElementById('loader-pct');
  const letters  = document.querySelectorAll('.loader-letter');
  const canvas   = document.getElementById('loader-particles');
  const ctx      = canvas.getContext('2d');

  /* ── Particle canvas setup ── */
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const COUNT = 60;

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: randomBetween(-0.2, 0.2),
      vy: randomBetween(-0.4, -0.1),
      r:  randomBetween(0.6, 2),
      o:  randomBetween(0.1, 0.5),
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
      if (p.x < -4) p.x = canvas.width + 4;
      if (p.x > canvas.width + 4) p.x = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(98,168,255,${p.o})`;
      ctx.fill();
    });
    if (!loaderEl.classList.contains('hidden')) {
      requestAnimationFrame(drawParticles);
    }
  }
  drawParticles();

  /* ── Letter reveal ── */
  function revealLetters() {
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.classList.add('revealed');
      }, i * 150 + 100);
    });
  }

  /* ── Progress simulation ── */
  let currentPct = 0;
  const targetPct = 100;
  let done = false;

  function animatePct(newPct) {
    const start = currentPct;
    const diff  = newPct - start;
    const dur   = 400;
    const t0    = performance.now();

    function step(now) {
      const elapsed = Math.min(now - t0, dur);
      const p = elapsed / dur;
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      const val = Math.round(start + diff * eased);
      barFill.style.width = val + '%';
      pctEl.textContent   = val + '%';
      currentPct = val;
      if (elapsed < dur) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Simulate resource loading steps */
  const steps = [
    { pct: 15, delay: 200 },
    { pct: 35, delay: 500 },
    { pct: 60, delay: 900 },
    { pct: 80, delay: 1400 },
    { pct: 95, delay: 1900 },
    { pct: 100, delay: 2500 },
  ];

  steps.forEach(({ pct, delay }) => {
    setTimeout(() => animatePct(pct), delay);
  });

  /* Kick off letter reveal */
  setTimeout(revealLetters, 100);

  /* After 100% — wait a beat then hide */
  setTimeout(() => {
    done = true;
    loaderEl.classList.add('hidden');
    document.body.style.overflow = '';
    // Dispatch event so other scripts know we're ready
    document.dispatchEvent(new Event('loaderComplete'));
  }, 3200);

  /* Prevent scroll during load */
  document.body.style.overflow = 'hidden';

})();
