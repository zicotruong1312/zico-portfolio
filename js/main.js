/* ══════════════════════════════════════════════════
   main.js — Interactions, Animations, All Misc Logic
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     NAVBAR — scroll state & active section
  ══════════════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    updateBackTop();
  }, { passive: true });

  const sections = Array.from(document.querySelectorAll('section[id]'));

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) link.classList.add('active');
    });
  }
  updateActiveNav();

  /* ── Smooth scroll nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════════════════ */
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose  = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobileMenu);
  menuClose?.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', closeMobileMenu);
  });

  /* ══════════════════════════════════════════════
     NAV CV DROPDOWN
  ══════════════════════════════════════════════ */
  const navCvBtn  = document.getElementById('nav-cv-btn');
  const navCvMenu = document.getElementById('nav-cv-menu');
  if (navCvBtn && navCvMenu) {
    navCvBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navCvMenu.classList.toggle('open');
      navCvBtn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', () => {
      navCvMenu.classList.remove('open');
      navCvBtn.setAttribute('aria-expanded', 'false');
    });
    navCvMenu.addEventListener('click', e => e.stopPropagation());
  }

  /* ══════════════════════════════════════════════
     BACKGROUND PARTICLES (hero)
  ══════════════════════════════════════════════ */
  const bgCanvas = document.getElementById('bg-particles');
  if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let bgW, bgH;
    const bgParticles = [];
    const BP_COUNT = window.innerWidth > 1024 ? 70 : 40;

    function resizeBg() {
      bgW = bgCanvas.width  = bgCanvas.offsetWidth;
      bgH = bgCanvas.height = bgCanvas.offsetHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    for (let i = 0; i < BP_COUNT; i++) {
      bgParticles.push({
        x:  Math.random() * (bgW || window.innerWidth),
        y:  Math.random() * (bgH || window.innerHeight),
        r:  Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        o:  Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function animateBg(ts) {
      requestAnimationFrame(animateBg);
      bgCtx.clearRect(0, 0, bgW, bgH);
      bgParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.012;
        const osc = p.o + Math.sin(p.pulse) * 0.05;
        if (p.x < -4) p.x = bgW + 4;
        if (p.x > bgW + 4) p.x = -4;
        if (p.y < -4) p.y = bgH + 4;
        if (p.y > bgH + 4) p.y = -4;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(98,168,255,${osc})`;
        bgCtx.fill();
      });
    }
    animateBg(0);
  }

  /* ══════════════════════════════════════════════
     HERO AMBIENT LIGHT CANVAS (mouse-responsive)
  ══════════════════════════════════════════════ */
  const ambCanvas = document.getElementById('hero-ambient');
  if (ambCanvas) {
    const ambCtx = ambCanvas.getContext('2d');
    let ambW, ambH;
    let mouseAmbX = 0, mouseAmbY = 0;
    let targetAmbX = 0, targetAmbY = 0;

    function resizeAmb() {
      ambW = ambCanvas.width  = ambCanvas.offsetWidth;
      ambH = ambCanvas.height = ambCanvas.offsetHeight;
    }
    resizeAmb();
    window.addEventListener('resize', resizeAmb);

    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        targetAmbX = e.clientX - rect.left;
        targetAmbY = e.clientY - rect.top;
      });
    }

    function animateAmb() {
      requestAnimationFrame(animateAmb);
      mouseAmbX += (targetAmbX - mouseAmbX) * 0.08;
      mouseAmbY += (targetAmbY - mouseAmbY) * 0.08;

      ambCtx.clearRect(0, 0, ambW, ambH);
      if (targetAmbX === 0 && targetAmbY === 0) return;

      const grad = ambCtx.createRadialGradient(mouseAmbX, mouseAmbY, 0, mouseAmbX, mouseAmbY, 320);
      grad.addColorStop(0, 'rgba(98,168,255,0.06)');
      grad.addColorStop(0.5, 'rgba(82,224,224,0.02)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ambCtx.fillStyle = grad;
      ambCtx.fillRect(0, 0, ambW, ambH);
    }
    animateAmb();
  }

  /* ══════════════════════════════════════════════
     MAGNETIC BUTTONS
  ══════════════════════════════════════════════ */
  if (window.innerWidth >= 1024) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      const MAX = 15;

      btn.addEventListener('mousemove', (e) => {
        const rect   = btn.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = e.clientX - cx;
        const dy     = e.clientY - cy;
        const dist   = Math.hypot(dx, dy);
        const power  = Math.max(0, 1 - dist / 100);
        const mx     = dx * power * 0.5;
        const my     = dy * power * 0.5;
        const clampX = Math.max(-MAX, Math.min(MAX, mx));
        const clampY = Math.max(-MAX, Math.min(MAX, my));
        btn.style.transform = `translate(${clampX}px, ${clampY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════════════
     3D TILT CARDS (expertise, game cards)
  ══════════════════════════════════════════════ */
  if (window.innerWidth >= 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const MAX_TILT = 7;

      card.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const nx    = (e.clientX - cx) / (rect.width  / 2);
        const ny    = (e.clientY - cy) / (rect.height / 2);
        const rotX  = -ny * MAX_TILT;
        const rotY  =  nx * MAX_TILT;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;

        /* Spotlight effect */
        const spotlight = card.querySelector('.spotlight-layer');
        if (spotlight) {
          const pctX = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
          const pctY = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
          spotlight.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(98,168,255,0.12) 0%, transparent 65%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    /* ══════════════════════════════════════════════
       3D FLIP CARDS (Expertise Section)
    ══════════════════════════════════════════════ */
    document.querySelectorAll('.btn-flip-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-target');
        const card = document.getElementById(targetId);
        if (card) card.classList.add('flipped');
      });
    });

    document.querySelectorAll('.btn-flip-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-target');
        const card = document.getElementById(targetId);
        if (card) card.classList.remove('flipped');
      });
    });

    document.querySelectorAll('.expertise-flip-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        card.classList.toggle('flipped');
      });
    });

    /* Portrait tilt */
    const portrait = document.getElementById('portrait-tilt');
    if (portrait) {
      portrait.addEventListener('mousemove', (e) => {
        const rect = portrait.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const nx   = (e.clientX - cx) / (rect.width  / 2);
        const ny   = (e.clientY - cy) / (rect.height / 2);
        portrait.style.transform = `perspective(700px) rotateX(${-ny * 8}deg) rotateY(${nx * 8}deg)`;
      });
      portrait.addEventListener('mouseleave', () => {
        portrait.style.transform = '';
      });
    }
  }

  /* ══════════════════════════════════════════════
     GAMING GALLERY — drag scroll
  ══════════════════════════════════════════════ */
  const gallery = document.getElementById('gaming-gallery');
  if (gallery) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    gallery.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX     = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
      gallery.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      gallery.style.cursor = 'grab';
    });
    gallery.addEventListener('mouseleave', () => {
      isDragging = false;
    });
    gallery.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x    = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      gallery.scrollLeft = scrollLeft - walk;
    });

    /* Nav Prev/Next Buttons */
    const prevBtn = document.getElementById('gaming-prev');
    const nextBtn = document.getElementById('gaming-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        gallery.scrollBy({ left: -340, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        gallery.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }

    /* Mouse wheel horizontal scroll */
    gallery.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        gallery.scrollLeft += e.deltaY * 0.9;
      }
    }, { passive: false });

    /* Touch swipe */
    let touchStartX = 0;
    let touchScrollLeft = 0;
    gallery.addEventListener('touchstart', (e) => {
      touchStartX     = e.touches[0].clientX;
      touchScrollLeft = gallery.scrollLeft;
    }, { passive: true });
    gallery.addEventListener('touchmove', (e) => {
      const diff = touchStartX - e.touches[0].clientX;
      gallery.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     EXPERIENCE — toggle responsibilities
  ══════════════════════════════════════════════ */
  const expToggle = document.getElementById('exp-toggle');
  const expList   = document.getElementById('exp-list');
  if (expToggle && expList) {
    expToggle.addEventListener('click', () => {
      const isOpen = expList.classList.toggle('open');
      expToggle.textContent = isOpen
        ? 'HIDE RESPONSIBILITIES ↑'
        : 'SHOW RESPONSIBILITIES ↓';
    });
  }

  /* ══════════════════════════════════════════════
     FLOW DIAGRAM — tooltip
  ══════════════════════════════════════════════ */
  const tooltip = document.getElementById('flow-tooltip');
  if (tooltip) {
    document.querySelectorAll('.flow-step-card, .flow-node').forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        const tip = node.dataset.tooltip;
        if (!tip) return;
        tooltip.textContent = tip;
        tooltip.classList.add('visible');
      });
      node.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 16) + 'px';
        tooltip.style.top  = (e.clientY - 10) + 'px';
      });
      node.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  /* ══════════════════════════════════════════════
     EMAIL COPY — click-to-copy with toast
  ══════════════════════════════════════════════ */
  const copyEmail = document.getElementById('copy-email');
  const toastEl   = document.getElementById('toast');
  const EMAIL     = 'vithao.contact@gmail.com';

  if (copyEmail && toastEl) {
    copyEmail.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(EMAIL).then(() => showToast()).catch(() => {
          fallbackCopy(EMAIL);
          showToast();
        });
      } else {
        fallbackCopy(EMAIL);
        showToast();
      }
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  let toastTimer = null;
  function showToast() {
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  /* ══════════════════════════════════════════════
     CONTACT FORM — submission
  ══════════════════════════════════════════════ */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = form.querySelector('#f-name').value;
      const email   = form.querySelector('#f-email').value;
      const subject = form.querySelector('#f-subject').value;
      const message = form.querySelector('#f-msg').value;

      /* Open mailto with pre-filled fields */
      const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const mailSub  = encodeURIComponent(subject || 'Portfolio Contact');
      window.location.href = `mailto:vithao.contact@gmail.com?subject=${mailSub}&body=${mailBody}`;

      toastEl.textContent = '✓ Opening email client...';
      showToast();
      form.reset();
    });
  }

  /* ══════════════════════════════════════════════
     BACK TO TOP
  ══════════════════════════════════════════════ */
  const backTop = document.getElementById('back-top');

  function updateBackTop() {
    if (!backTop) return;
    if (window.scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════════════════
     CONTACT BG CANVAS
  ══════════════════════════════════════════════ */
  const contactCanvas = document.getElementById('contact-bg-canvas');
  if (contactCanvas) {
    const cCtx = contactCanvas.getContext('2d');
    let cW, cH;

    function resizeCBg() {
      const rect = contactCanvas.parentElement.getBoundingClientRect();
      cW = contactCanvas.width  = rect.width;
      cH = contactCanvas.height = contactCanvas.parentElement.offsetHeight;
    }
    resizeCBg();
    window.addEventListener('resize', resizeCBg);

    const cParticles = [];
    const C_COUNT = 50;
    for (let i = 0; i < C_COUNT; i++) {
      cParticles.push({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * 800,
        r:  Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        o:  Math.random() * 0.2 + 0.03,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function animateCBg() {
      requestAnimationFrame(animateCBg);
      if (!cW || !cH) return;
      cCtx.clearRect(0, 0, cW, cH);
      cParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.01;
        const o = p.o + Math.sin(p.pulse) * 0.03;
        if (p.x < -4) p.x = cW + 4;
        if (p.x > cW + 4) p.x = -4;
        if (p.y < -4) p.y = cH + 4;
        if (p.y > cH + 4) p.y = -4;
        cCtx.beginPath();
        cCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cCtx.fillStyle = `rgba(82,224,224,${o})`;
        cCtx.fill();
      });

      /* Connecting lines */
      for (let i = 0; i < cParticles.length; i++) {
        for (let j = i + 1; j < cParticles.length; j++) {
          const dx   = cParticles[i].x - cParticles[j].x;
          const dy   = cParticles[i].y - cParticles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            cCtx.beginPath();
            cCtx.moveTo(cParticles[i].x, cParticles[i].y);
            cCtx.lineTo(cParticles[j].x, cParticles[j].y);
            cCtx.strokeStyle = `rgba(98,168,255,${0.06 * (1 - dist / 100)})`;
            cCtx.lineWidth = 0.5;
            cCtx.stroke();
          }
        }
      }
    }
    animateCBg();
  }

  /* ══════════════════════════════════════════════
     COSMIC STREAM & CELESTIAL ENGINE (Handled in js/cosmic-space.js)
  ══════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════
     SECTION NUM PARALLAX (subtle)
  ══════════════════════════════════════════════ */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.section-num').forEach(el => {
      gsap.to(el, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    });
  }

  /* ══════════════════════════════════════════════
     INIT after loader completes
  ══════════════════════════════════════════════ */
  document.addEventListener('loaderComplete', () => {
    // Hero animation entrance
    if (typeof gsap !== 'undefined') {
      gsap.from('.hero-label', { opacity: 0, y: 20, duration: 0.7, delay: 0.1 });
      gsap.from('.hero-headline', { opacity: 0, y: 30, duration: 0.9, delay: 0.3, ease: 'power3.out' });
      gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.7, delay: 0.6 });
      gsap.from('.hero-ctas', { opacity: 0, y: 20, duration: 0.7, delay: 0.8 });
      gsap.from('.hero-right', { opacity: 0, x: 20, duration: 0.8, delay: 0.5 });
    } else {
      /* Fallback */
      document.querySelectorAll('.hero-left, .hero-right').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  });

  /* If loader already done (or very fast), reveal hero */
  if (document.getElementById('loading-screen')?.classList.contains('hidden')) {
    document.querySelectorAll('.hero-left, .hero-right').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

})();
