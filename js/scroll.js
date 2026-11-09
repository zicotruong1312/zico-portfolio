/* ══════════════════════════════════════════════════
   scroll.js — Scroll Animations (GSAP ScrollTrigger)
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Wait for GSAP and ScrollTrigger */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: use IntersectionObserver only
    setupIntersectionObserver();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── IntersectionObserver reveal for .reveal-up elements ── */
  function setupIntersectionObserver() {
    const els = document.querySelectorAll('.reveal-up');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.style.animationDelay || '0') * 1000;
          setTimeout(() => {
            el.classList.add('in-view');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    els.forEach(el => observer.observe(el));
  }

  setupIntersectionObserver();

  /* ── Scroll Progress Bar ── */
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Skill bars animate on scroll ── */
  const skillFills = document.querySelectorAll('.skill-fill');
  if (skillFills.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const w  = el.dataset.width || '70';
          setTimeout(() => {
            el.style.width = w + '%';
          }, 200);
          skillObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    skillFills.forEach(el => skillObserver.observe(el));
  }

  /* ── GPA counter ── */
  const gpaEl = document.getElementById('gpa-counter');
  if (gpaEl) {
    const gpaObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter(gpaEl, 0, 3.34, 1600, 2);
        gpaObserver.disconnect();
      }
    }, { threshold: 0.5 });
    gpaObserver.observe(gpaEl);
  }

  function animateCounter(el, from, to, duration, decimals) {
    const start = performance.now();
    function step(now) {
      const elapsed = Math.min(now - start, duration);
      const p = elapsed / duration;
      const eased = 1 - Math.pow(1 - p, 3);
      const val = from + (to - from) * eased;
      el.textContent = val.toFixed(decimals);
      if (elapsed < duration) requestAnimationFrame(step);
      else el.textContent = to.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }

  /* ── Timeline line animate ── */
  const timelineLine = document.getElementById('timeline-line');
  if (timelineLine) {
    const tlObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        timelineLine.classList.add('animated');
        tlObserver.disconnect();
      }
    }, { threshold: 0.2 });
    tlObserver.observe(timelineLine.parentElement || timelineLine);
  }

  /* ── Flow diagram node reveal ── */
  const flowNodes = document.querySelectorAll('.flow-node');
  if (flowNodes.length) {
    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nodes = entry.target.querySelectorAll('.flow-node');
          nodes.forEach((node, i) => {
            setTimeout(() => {
              node.classList.add('revealed');
            }, i * 120);
          });
          flowObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const flowDiagram = document.getElementById('flow-diagram');
    if (flowDiagram) flowObserver.observe(flowDiagram);
  }

  /* ── GSAP ScrollTrigger section parallax ── */
  /* Hero parallax layers */
  const heroBg = document.querySelector('.hero-grid-overlay');
  if (heroBg) {
    gsap.to(heroBg, {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }

  /* Section headings reveal */
  gsap.utils.toArray('.section-heading').forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  /* About cards stagger */
  const aboutCards = gsap.utils.toArray('.about-card');
  if (aboutCards.length) {
    gsap.from(aboutCards, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-cards',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* Skills categories stagger */
  const skillCats = gsap.utils.toArray('.skills-category');
  if (skillCats.length) {
    gsap.from(skillCats, {
      y: 24,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-dashboard',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* Mindset cards stagger */
  const mindsetCards = gsap.utils.toArray('.mindset-card');
  if (mindsetCards.length) {
    gsap.from(mindsetCards, {
      x: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.mindset-split',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* Project showcases alternate reveal */
  gsap.utils.toArray('.project-showcase').forEach((el, i) => {
    const dir = i % 2 === 0 ? -40 : 40;
    gsap.from(el.querySelector('.project-visual'), {
      x: dir,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  });

})();
