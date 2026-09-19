/* ═══════════════ rsh://v0id — script.js ═══════════════ */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── PRELOADER ────────────────────────────── */
  const preloader = $('#preloader');
  const preBar = $('.pre-bar-fill');
  let pre = 0;
  const preTick = () => {
    pre += Math.random() * 22;
    if (pre >= 100) pre = 100;
    if (preBar) preBar.style.width = pre + '%';
    if (pre < 100) requestAnimationFrame(preTick);
    else setTimeout(() => hidePreloader(), 150);
  };
  const hidePreloader = () => {
    if (preloader) preloader.classList.add('hidden');
  };
  requestAnimationFrame(preTick);
  window.addEventListener('load', () => setTimeout(hidePreloader, 300));
  setTimeout(hidePreloader, 2600); // safety

  /* ── THEME ────────────────────────────────── */
  const root = document.documentElement;
  const themeToggle = $('#theme-toggle');
  const metaTheme = $('meta[name="theme-color"]');

  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#0b0e17' : '#f4f6fc');
  };

  const saved = localStorage.getItem('theme');
  if (saved === 'light') applyTheme('light');

  themeToggle && themeToggle.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ── CUSTOM CURSOR ────────────────────────── */
  if (finePointer && !prefersReduced) {
    const cur = $('#cur');
    const ring = $('#cur-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cur) { cur.style.left = mx - 3.5 + 'px'; cur.style.top = my - 3.5 + 'px'; }
    });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring) { ring.style.left = rx - 18 + 'px'; ring.style.top = ry - 18 + 'px'; }
      requestAnimationFrame(loop);
    };
    loop();

    const growSel = 'a, button, input, textarea, .proj-card, .skill-card, .tl-card, .ci-card, .chip, .f-btn, .term, .monogram';
    $$(growSel).forEach((el) => {
      el.addEventListener('mouseenter', () => ring && ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring && ring.classList.remove('grow'));
    });
  } else {
    $('#cur') && $('#cur').remove();
    $('#cur-ring') && $('#cur-ring').remove();
  }

  /* ── NAV: scroll state, scrollspy, top btn ── */
  const nav = $('#nav');
  const toTop = $('#to-top');
  const sections = $$('main section[id]');
  const navAnchors = $$('.nav-links a');

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 12);
      if (toTop) toTop.classList.toggle('show', y > 700);

      // scroll progress
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? (y / max) * 100 : 0;
      const prog = $('#progress');
      if (prog) prog.style.width = p + '%';

      // scrollspy
      let current = '';
      sections.forEach((s) => { if (y >= s.offsetTop - 140) current = s.id; });
      navAnchors.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });

      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

  /* ── HAMBURGER ────────────────────────────── */
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    $$('a', navLinks).forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── SCROLL REVEAL ────────────────────────── */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── STAT COUNT-UP ─────────────────────────── */
  const stats = $$('.stat');
  const animNum = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const numEl = $('.stat-num', el);
    if (!numEl) return;
    if (prefersReduced) { numEl.textContent = target + suffix; return; }
    const dur = 1200;
    const start = performance.now();
    const tick = (t) => {
      const k = Math.min((t - start) / dur, 1);
      const ease = 1 - Math.pow(1 - k, 3);
      numEl.textContent = Math.round(target * ease) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const statObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (!e.target.dataset.infinite) animNum(e.target);
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach((s) => statObs.observe(s));
  } else {
    stats.forEach((s) => !s.dataset.infinite && animNum(s));
  }

  /* ── TYPING EFFECT ────────────────────────── */
  const typedEl = $('.typed-text');
  if (typedEl) {
    const phrases = [
      'full-stack developer',
      'backend engineer',
      'ai integrator',
      'productive builder',
      'deadline slayer'
    ];
    if (prefersReduced) {
      typedEl.textContent = phrases[0];
    } else {
      let pi = 0, ci = 0, deleting = false;
      const type = () => {
        const current = phrases[pi];
        if (!deleting) {
          typedEl.textContent = current.slice(0, ci + 1);
          ci++;
          if (ci === current.length) {
            deleting = true;
            setTimeout(type, 1700);
            return;
          }
        } else {
          typedEl.textContent = current.slice(0, ci - 1);
          ci--;
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(type, deleting ? 50 : 95);
      };
      setTimeout(type, 800);
    }
  }

  /* ── SKILL BARS ───────────────────────────── */
  const bars = $$('.bar-fill');
  if ('IntersectionObserver' in window) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width;
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    bars.forEach((b) => barObs.observe(b));
  } else {
    bars.forEach((b) => (b.style.width = b.dataset.width));
  }

  /* ── PROJECT FILTER ───────────────────────── */
  const fBtns = $$('.f-btn');
  const projCards = $$('.proj-card');
  if (fBtns.length && projCards.length) {
    fBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        fBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        projCards.forEach((card) => {
          const cats = (card.dataset.category || '').split(' ');
          const show = f === 'all' || cats.includes(f);
          if (show) {
            card.classList.remove('hidden');
            requestAnimationFrame(() => card.classList.add('visible'));
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── CARD TILT ────────────────────────────── */
  if (finePointer && !prefersReduced) {
    $$('[data-tilt]').forEach((card) => {
      let raf = null;
      const onMove = (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rx = (0.5 - py) * 7;
          const ry = (px - 0.5) * 7;
          card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
          raf = null;
        });
      };
      const onLeave = () => {
        card.style.transform = '';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* ── MAGNETIC BUTTONS ─────────────────────── */
  if (finePointer && !prefersReduced) {
    $$('[data-mag]').forEach((btn) => {
      let raf = null;
      btn.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
          raf = null;
        });
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── CONTACT FORM ─────────────────────────── */
  const contactForm = $('#contact-form');
  const sendBtn = $('#send-btn');
  if (contactForm && sendBtn) {
    const resetBtn = () => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = `send_message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      sendBtn.style.background = '';
      sendBtn.style.color = '';
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      sendBtn.disabled = true;
      sendBtn.textContent = 'sending...';
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          sendBtn.textContent = '✓ message sent!';
          sendBtn.style.background = 'linear-gradient(100deg,#82e65a,#3ec3f0)';
          sendBtn.style.color = '#06100a';
          contactForm.reset();
        } else {
          sendBtn.textContent = '✗ failed — try again';
          sendBtn.style.background = '#ff5f57';
          sendBtn.style.color = '#fff';
        }
      } catch {
        sendBtn.textContent = '✗ network error';
        sendBtn.style.background = '#ff5f57';
        sendBtn.style.color = '#fff';
      }
      setTimeout(resetBtn, 3000);
    });
  }
})();