/* ═══════════════════════════════════════════
   [Business Name] Painting — script.js
   Features: mobile nav, dropdown, modal popup,
   lightbox, scroll progress, parallax, counters,
   scroll reveal, sticky quote button
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     INJECT GLOBAL UI: modal + sticky button
     + scroll progress + lightbox
     (runs on every page automatically)
  ───────────────────────────────────────── */
  function injectGlobalUI() {

    /* 1. Scroll progress bar */
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.id = 'scroll-progress';
    document.body.prepend(progress);

    /* 2. Sticky quote button */
    const stickyBtn = document.createElement('button');
    stickyBtn.className = 'sticky-quote';
    stickyBtn.id = 'sticky-quote';
    stickyBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      Get a Free Quote
    `;
    document.body.appendChild(stickyBtn);

    /* 3. Quote modal */
    const modalHTML = `
      <div class="modal-overlay" id="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal" id="modal">
          <button class="modal__close" id="modal-close" aria-label="Close">&#x2715;</button>
          <div class="modal__head">
            <span class="modal__eyebrow">Free Quote</span>
            <h2 class="modal__title" id="modal-title">Let's Talk About Your Project</h2>
            <p class="modal__sub">We'll get back to you within 24 hours — usually much sooner.</p>
          </div>
          <form id="modal-form" action="mailto:hello@example.com" method="post" enctype="text/plain">
            <div class="form-row">
              <div class="form-group">
                <label for="m-name">Full Name *</label>
                <input type="text" id="m-name" name="name" placeholder="John Smith" required />
              </div>
              <div class="form-group">
                <label for="m-phone">Phone *</label>
                <input type="tel" id="m-phone" name="phone" placeholder="04XX XXX XXX" required />
              </div>
            </div>
            <div class="form-group">
              <label for="m-email">Email *</label>
              <input type="email" id="m-email" name="email" placeholder="you@example.com" required />
            </div>
            <div class="form-group">
              <label for="m-service">Type of Job *</label>
              <select id="m-service" name="service" required>
                <option value="" disabled selected>Select a service…</option>
                <option value="interior">Interior Painting</option>
                <option value="exterior">Exterior Painting</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="feature-wall">Feature Wall</option>
                <option value="roof">Roof Painting</option>
                <option value="other">Other / Not Sure</option>
              </select>
            </div>
            <div class="form-group">
              <label for="m-msg">Tell Us About Your Project</label>
              <textarea id="m-msg" name="message" rows="3" placeholder="Property type, size, preferred timeline…"></textarea>
            </div>
            <button type="submit" class="btn btn--red btn--lg btn--full">Send Quote Request</button>
            <p class="form-note">No spam. We'll only contact you about your quote.</p>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    /* 4. Lightbox */
    const lightboxHTML = `
      <div class="lightbox" id="lightbox">
        <button class="lightbox__close" id="lightbox-close" aria-label="Close">&#x2715;</button>
        <img id="lightbox-img" src="" alt="" />
        <p class="lightbox__caption" id="lightbox-caption"></p>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  injectGlobalUI();

  /* ─────────────────────────────────────────
     REFS (after injection)
  ───────────────────────────────────────── */
  const header      = document.querySelector('.site-header');
  const hamburger   = document.getElementById('hamburger');
  const navList     = document.getElementById('nav-list');
  const yearEl      = document.getElementById('year');
  const progressBar = document.getElementById('scroll-progress');
  const stickyBtn   = document.getElementById('sticky-quote');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose   = document.getElementById('modal-close');
  const modalForm    = document.getElementById('modal-form');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const lightboxClose= document.getElementById('lightbox-close');
  const heroPainter  = document.querySelector('.hero__painter');

  /* ─────────────────────────────────────────
     FOOTER YEAR
  ───────────────────────────────────────── */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────
     HEADER SCROLL CLASS
  ───────────────────────────────────────── */
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     STICKY QUOTE BUTTON — show after hero
  ───────────────────────────────────────── */
  if (stickyBtn) {
    const heroEl = document.querySelector('.hero, .page-hero');
    function updateStickyBtn() {
      const threshold = heroEl ? heroEl.offsetHeight * 0.7 : 300;
      stickyBtn.classList.toggle('is-visible', window.scrollY > threshold);
    }
    window.addEventListener('scroll', updateStickyBtn, { passive: true });
    updateStickyBtn();
    stickyBtn.addEventListener('click', openModal);
  }

  /* ─────────────────────────────────────────
     MODAL
  ───────────────────────────────────────── */
  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // focus first input
    setTimeout(function () {
      var first = modalOverlay.querySelector('input, select, textarea');
      if (first) first.focus();
    }, 280);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  /* Wire up ALL "Get a Free Quote" / "js-open-modal" buttons site-wide */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.js-open-modal');
    if (btn) {
      e.preventDefault();
      openModal();
    }
  });

  /* Intercept ALL CTA anchor buttons pointing to contact section → open modal instead */
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a.btn[href*="contact"]');
    if (link) {
      e.preventDefault();
      openModal();
    }
  });

  /* Modal form submit */
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      var fields = modalForm.querySelectorAll('[required]');
      var valid = true;
      fields.forEach(function (f) {
        f.style.borderColor = '';
        if (!f.value.trim()) { f.style.borderColor = 'var(--red)'; valid = false; }
      });
      if (!valid) { e.preventDefault(); return; }

      var btn = modalForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Opening email client…';
        btn.disabled = true;
        setTimeout(function () {
          closeModal();
          btn.textContent = 'Send Quote Request';
          btn.disabled = false;
          modalForm.reset();
        }, 3500);
      }
    });
    modalForm.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('input', function () { this.style.borderColor = ''; });
    });
  }

  /* ─────────────────────────────────────────
     LIGHTBOX
  ───────────────────────────────────────── */
  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || '';
    if (lightboxCap) lightboxCap.textContent = caption || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { if (lightboxImg) lightboxImg.src = ''; }, 250);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxCap) closeLightbox();
    });
  }

  /* Wire gallery items + painter cards to lightbox */
  document.addEventListener('click', function (e) {
    const card = e.target.closest('[data-lightbox]');
    if (card) {
      e.preventDefault();
      openLightbox(card.dataset.lightbox, card.dataset.caption || '');
    }
  });

  /* ─────────────────────────────────────────
     ESCAPE KEY — close modal / lightbox
  ───────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
      setMenuOpen(false);
      closeAllDropdowns();
    }
  });

  /* ─────────────────────────────────────────
     MOBILE HAMBURGER
  ───────────────────────────────────────── */
  function setMenuOpen(open) {
    if (!navList || !hamburger) return;
    navList.classList.toggle('is-open', open);
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
    // don't lock scroll here — modal does it separately
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      setMenuOpen(!navList.classList.contains('is-open'));
    });
  }
  if (navList) {
    navList.querySelectorAll('a:not(.nav__item--has-drop > .nav__link)').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 768) setMenuOpen(false);
      });
    });
  }
  document.addEventListener('click', function (e) {
    if (navList && navList.classList.contains('is-open') &&
        !navList.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  /* ─────────────────────────────────────────
     DROPDOWN MENU
  ───────────────────────────────────────── */
  var dropItems = document.querySelectorAll('.nav__item--has-drop');

  function closeAllDropdowns() {
    dropItems.forEach(function (item) { item.classList.remove('is-open'); });
  }

  dropItems.forEach(function (item) {
    var trigger  = item.querySelector('.nav__link');
    var dropdown = item.querySelector('.nav__dropdown');
    if (!trigger || !dropdown) return;

    item.addEventListener('mouseenter', function () {
      if (window.innerWidth > 768) { closeAllDropdowns(); item.classList.add('is-open'); }
    });
    item.addEventListener('mouseleave', function () {
      if (window.innerWidth > 768) item.classList.remove('is-open');
    });

    trigger.addEventListener('click', function (e) {
      var open = item.classList.contains('is-open');
      closeAllDropdowns();
      if (!open) {
        item.classList.add('is-open');
        if (window.innerWidth <= 768) e.preventDefault();
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item--has-drop')) closeAllDropdowns();
  });

  /* ─────────────────────────────────────────
     SMOOTH SCROLL for same-page anchors
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight : 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────
     PARALLAX — hero painter image
  ───────────────────────────────────────── */
  if (heroPainter && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      heroPainter.style.transform = 'translateY(' + (y * 0.12) + 'px)';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────── */
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    var start = 0;
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease out
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ─────────────────────────────────────────
     INTERSECTION OBSERVER — reveal + counters
  ───────────────────────────────────────── */
  if ('IntersectionObserver' in window) {

    /* Scroll reveal */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });

    /* Counter animation — trigger when stats bar enters view */
    var counters = document.querySelectorAll('.js-counter[data-target]');
    if (counters.length) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }

  } else {
    /* Fallback: show all immediately */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ─────────────────────────────────────────
     IN-PAGE FORM (contact section)
  ───────────────────────────────────────── */
  var pageForm = document.getElementById('quote-form');
  if (pageForm) {
    pageForm.addEventListener('submit', function (e) {
      var fields = pageForm.querySelectorAll('[required]');
      var valid = true;
      fields.forEach(function (f) {
        f.style.borderColor = '';
        if (!f.value.trim()) { f.style.borderColor = 'var(--red)'; valid = false; }
      });
      if (!valid) { e.preventDefault(); return; }

      var btn = pageForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Opening email client…';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = 'Send Quote Request';
          btn.disabled = false;
        }, 4000);
      }
    });
    pageForm.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('input', function () { this.style.borderColor = ''; });
    });
  }

})();
