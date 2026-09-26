/* ═══════════════ Rishavdeep Singh — portfolio ═══════════════
   Theme toggle · scroll reveals · contact form.
   No canvas, no animation loop, no dependencies.
   ═══════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  /* ── THEME ─────────────────────────────────────── */
  const toggle = $('#theme-toggle');

  if (toggle) {
    const syncLabel = () => {
      const light = root.dataset.theme === 'light';
      toggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    };

    syncLabel();

    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try {
        localStorage.setItem('rsh-theme', next);
      } catch (e) { /* private mode — theme just won't persist */ }
      syncLabel();
    });
  }

  /* ── SCROLL REVEALS ───────────────────────────── */
  const targets = document.querySelectorAll('[data-reveal]');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!('IntersectionObserver' in window) || still.matches) {
    targets.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    targets.forEach((el) => io.observe(el));
  }

  /* ── CONTACT FORM ─────────────────────────────── */
  const form = $('#contact-form');

  if (form) {
    const btn = $('#send-btn');
    const note = $('#form-note');
    const idle = btn.textContent;
    let timer = null;

    const say = (msg, kind) => {
      note.textContent = msg;
      note.className = 'form-note' + (kind ? ' ' + kind : '');
    };

    const reset = () => {
      btn.disabled = false;
      btn.textContent = idle;
      say('');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearTimeout(timer);

      if (!form.checkValidity()) {
        form.reportValidity();
        say('Please fill in every field.', 'err');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      say('');

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (!res.ok) throw new Error('request failed: ' + res.status);

        form.reset();
        say('Message sent — I will get back to you shortly.', 'ok');
      } catch (err) {
        say('Something went wrong. Email me directly instead.', 'err');
      }

      timer = setTimeout(reset, 5000);
    });
  }
})();
