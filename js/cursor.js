/* ══════════════════════════════════════════════════
   cursor.js — Custom Cursor Logic
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Only on non-touch desktops */
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  if (window.innerWidth < 768) return;

  const dot    = document.getElementById('cursor-dot');
  const ring   = document.getElementById('cursor-ring');
  const label  = document.getElementById('cursor-label');

  if (!dot || !ring || !label) return;

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;

  /* Smooth lerp factor */
  const LERP = 0.12;

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* Track raw mouse */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    /* Dot follows exactly */
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    /* Label position */
    label.style.left = (mouseX + 20) + 'px';
    label.style.top  = mouseY + 'px';
  });

  /* Animate ring with lag */
  function animateRing() {
    ringX = lerp(ringX, mouseX, LERP);
    ringY = lerp(ringY, mouseY, LERP);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* ── Cursor states for interactive elements ── */
  const interactiveSelectors = 'a, button, .magnetic, .tilt-card, .game-card, .btn-primary, .btn-ghost, .expertise-cta, .contact-link, [data-cursor-label], .contact-item, .skill-pill, .stack-tag, .flow-node';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      ring.classList.add('expanded');
      const lbl = target.dataset.cursorLabel || target.closest('[data-cursor-label]')?.dataset.cursorLabel;
      if (lbl) {
        label.textContent = lbl;
        label.classList.add('visible');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      ring.classList.remove('expanded');
      label.classList.remove('visible');
    }
  });

  /* Click effect */
  document.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(0.6)';
    ring.style.transform = 'translate(-50%,-50%) scale(0.85)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = '';
    ring.style.transform = '';
  });

  /* Hide when leaving window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    label.classList.remove('visible');
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

})();
