/* ═══════════════════════════════════════════
   [Business Name] Painting — script.js
═══════════════════════════════════════════ */

(function () {
  'use strict';

  const header     = document.querySelector('.site-header');
  const hamburger  = document.getElementById('hamburger');
  const navList    = document.getElementById('nav-list');
  const yearEl     = document.getElementById('year');

  /* ── Footer year ── */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Header scroll class ── */
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── Mobile hamburger ── */
  function setMenuOpen(open) {
    if (!navList || !hamburger) return;
    navList.classList.toggle('is-open', open);
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = navList.classList.contains('is-open');
      setMenuOpen(!isOpen);
    });
  }

  /* Close mobile nav when a top-level (non-dropdown-trigger) link is clicked */
  if (navList) {
    navList.querySelectorAll('a:not(.nav__item--has-drop > .nav__link)').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) setMenuOpen(false);
      });
    });
  }

  /* Close on outside tap */
  document.addEventListener('click', function (e) {
    if (navList && navList.classList.contains('is-open')) {
      if (!navList.contains(e.target) && !hamburger.contains(e.target)) {
        setMenuOpen(false);
      }
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setMenuOpen(false);
      closeAllDropdowns();
    }
  });

  /* ── Services dropdown ── */
  const dropItems = document.querySelectorAll('.nav__item--has-drop');

  function closeAllDropdowns() {
    dropItems.forEach(function (item) {
      item.classList.remove('is-open');
    });
  }

  dropItems.forEach(function (item) {
    const trigger = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.nav__dropdown');
    if (!trigger || !dropdown) return;

    /* Desktop: hover */
    item.addEventListener('mouseenter', function () {
      if (window.innerWidth > 768) {
        closeAllDropdowns();
        item.classList.add('is-open');
      }
    });
    item.addEventListener('mouseleave', function () {
      if (window.innerWidth > 768) {
        item.classList.remove('is-open');
      }
    });

    /* All sizes: click/tap on the trigger toggles dropdown */
    trigger.addEventListener('click', function (e) {
      const alreadyOpen = item.classList.contains('is-open');
      closeAllDropdowns();
      if (!alreadyOpen) {
        item.classList.add('is-open');
        /* On mobile, if the href is just "#services" (homepage anchor),
           only prevent default navigation when we're toggling open */
        if (window.innerWidth <= 768) {
          e.preventDefault();
        }
      }
    });
  });

  /* Close dropdown when clicking outside */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item--has-drop')) {
      closeAllDropdowns();
    }
  });

  /* ── Smooth scroll for same-page anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = header ? header.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll-in fade for cards ── */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .js-fade {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .js-fade.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const fadeEls = document.querySelectorAll(
      '.service-card, .feature, .step, .gallery__item, .service-intro__aside'
    );

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(function (el, i) {
      el.classList.add('js-fade');
      el.style.transitionDelay = (i % 4) * 0.07 + 's';
      observer.observe(el);
    });
  }

  /* ── Quote form ── */
  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      const btn = form.querySelector('button[type="submit"]');

      /* Clear prior error states */
      form.querySelectorAll('input, select, textarea').forEach(function (f) {
        f.style.borderColor = '';
      });

      /* Validate required fields */
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--red)';
          valid = false;
        }
      });

      if (!valid) {
        e.preventDefault();
        const firstBad = form.querySelector('[required][style*="red"]');
        if (firstBad) firstBad.focus();
        return;
      }

      if (btn) {
        btn.textContent = 'Opening email client…';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = 'Send Quote Request';
          btn.disabled = false;
        }, 4000);
      }
    });

    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

})();
