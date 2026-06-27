/* ═══════════════════════════════════════════
   [Business Name] Painting — script.js
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const header    = document.querySelector('.site-header');
  const yearEl    = document.getElementById('year');

  /* ── Current year in footer ── */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Hamburger / mobile nav ── */
  function toggleMenu(force) {
    const isOpen = typeof force === 'boolean' ? force : !navLinks.classList.contains('is-open');
    navLinks.classList.toggle('is-open', isOpen);
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => toggleMenu());

    /* Close when a nav link is clicked */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('is-open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        toggleMenu(false);
        hamburger.focus();
      }
    });
  }

  /* ── Header scroll shadow ── */
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
          } else {
            header.style.boxShadow = 'none';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = header ? header.offsetHeight : 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ── Active nav link on scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__link');

  function setActiveNav() {
    const scrollPos = window.scrollY + (header ? header.offsetHeight : 72) + 40;

    let current = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });

    navAnchors.forEach(link => {
      link.classList.toggle(
        'nav__link--active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ── CSS for active nav link ── */
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `.nav__link--active { color: var(--orange) !important; }`;
  document.head.appendChild(activeStyle);

  /* ── Fade-in on scroll (Intersection Observer) ── */
  const fadeTargets = document.querySelectorAll(
    '.service-card, .feature, .gallery__item, .contact__info, .quote-form'
  );

  if ('IntersectionObserver' in window) {
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
      .fade-hidden {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.55s ease, transform 0.55s ease;
      }
      .fade-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(fadeStyle);

    fadeTargets.forEach((el, i) => {
      el.classList.add('fade-hidden');
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeTargets.forEach(el => observer.observe(el));
  }

  /* ── Quote form UX ── */
  const form = document.getElementById('quote-form');
  if (form) {
    /* Visual feedback on submit */
    form.addEventListener('submit', function (e) {
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      /* Basic validation check */
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#C8102E';
          valid = false;
        }
      });

      if (!valid) {
        e.preventDefault();
        const first = form.querySelector('[required]:invalid, [required][style*="C8102E"]');
        if (first) first.focus();
        return;
      }

      /* If form is using mailto, give user feedback */
      btn.textContent = 'Opening email client…';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = `
          Quote request sent!
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
        `;
        btn.style.background = 'var(--orange)';
        setTimeout(() => {
          btn.innerHTML = `Send My Quote Request
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 100);
    });

    /* Clear error state on input */
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

})();
