/* ═══════════════ void://rsh — script.js ═══════════════ */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.documentElement.classList.add('js');

  /* ── GALAXY ENGINE (canvas 2d, single rAF) ── */
  const canvas = $('#space');
  const ctx = canvas && canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  let stars = [], nebulas = [], shooters = [];
  let mx = 0, my = 0;            // normalized parallax [-1, 1]
  let t = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  const seed = () => {
    if (!ctx) return;
    DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const layers = [
      { n: 140, z: 0.18, o: 0.55 },
      { n: 90,  z: 0.4,  o: 0.75 },
      { n: 42,  z: 0.9,  o: 1 }
    ];
    stars = [];
    layers.forEach((l) => {
      for (let i = 0; i < l.n; i++) {
        stars.push({
          x: rand(0, W), y: rand(0, H),
          z: l.z, r: rand(0.4, 1.6) * (0.5 + l.z),
          o: l.o, tw: rand(0, Math.PI * 2), tws: rand(0.3, 1.4)
        });
      }
    });

    nebulas = [
      { x: W * 0.22, y: H * 0.28, r: 320, c: [198, 255, 61], a: 0.05 },
      { x: W * 0.82, y: H * 0.2, r: 300, c: [61, 220, 255], a: 0.05 },
      { x: W * 0.35, y: H * 0.8, r: 340, c: [167, 139, 250], a: 0.05 },
      { x: W * 0.78, y: H * 0.72, r: 280, c: [255, 110, 199], a: 0.035 }
    ];
    shooters = [];
  };

  const drawFrame = () => {
    ctx.clearRect(0, 0, W, H);
    t += 0.016;

    // nebulas
    ctx.globalCompositeOperation = 'lighter';
    nebulas.forEach((n, i) => {
      const pulse = 1 + Math.sin(t * 0.25 + i * 2) * 0.1;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * pulse);
      g.addColorStop(0, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a})`);
      g.addColorStop(1, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
    });

    // stars (parallax + twinkle + slow drift)
    for (const s of stars) {
      s.y += 0.015 + s.z * 0.03;
      if (s.y > H + 2) { s.y = -2; s.x = rand(0, W); }
      const px = s.x - mx * 18 * s.z;
      const py = s.y - my * 12 * s.z;
      const tw = 0.55 + 0.45 * Math.sin(t * s.tws + s.tw);
      ctx.globalAlpha = s.o * tw;
      ctx.fillStyle = s.z > 0.6 ? '#cfe6ff' : (s.z > 0.35 ? '#7f9fd6' : '#3a4a6e');
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // shooting stars
    if (Math.random() < 0.012 && shooters.length < 2) {
      shooters.push({
        x: rand(0.25, 0.85) * W, y: rand(0.05, 0.3) * H,
        vx: rand(-7, -4), vy: rand(2.4, 3.4), life: 1
      });
    }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.018;
      if (sh.life <= 0) { shooters.splice(i, 1); continue; }
      const tail = 9;
      const gr = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * tail, sh.y - sh.vy * tail);
      gr.addColorStop(0, `rgba(220,255,255,${0.9 * sh.life})`);
      gr.addColorStop(1, 'rgba(220,255,255,0)');
      ctx.strokeStyle = gr;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * tail, sh.y - sh.vy * tail);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const renderStatic = () => {
    drawFrame();
  };

  /* single rAF loop: galaxy + cursor lerp */
  let raf = null;
  const tickCursor = () => {
    if (!cursor) return;
    rx += (cursor.x - rx) * 0.22;
    ry += (cursor.y - ry) * 0.22;
    ring.style.setProperty('--rx', (rx - 17) + 'px');
    ring.style.setProperty('--ry', (ry - 17) + 'px');
  };
  const loop = () => {
    drawFrame();
    tickCursor();
    raf = requestAnimationFrame(loop);
  };

  /* ── CURSOR ────────────────────────────────── */
  const cur = $('#cur');
  const ring = $('#cur-ring');
  let cursor = null;
  let rx = -100, ry = -100;

  if (fine) {
    cursor = { x: -100, y: -100 };
    document.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cur.style.setProperty('--cx', (cursor.x - 4) + 'px');
      cur.style.setProperty('--cy', (cursor.y - 4) + 'px');
    });
    const hotSel = 'a, button, input, textarea, .mission-card, .chan-card, .trait-chip, .s-chip';
    const setHot = (on) => {
      if (ring) ring.classList.toggle('grow', !!on);
    };
    document.addEventListener('mouseover', (e) => {
      setHot(e.target.closest && e.target.closest(hotSel));
    });
    document.addEventListener('mouseout', (e) => {
      const to = e.relatedTarget;
      setHot(to && to.closest && to.closest(hotSel));
    });
  } else {
    cur && cur.remove();
    ring && ring.remove();
  }

  /* ── START RENDER ──────────────────────────── */
  if (ctx) {
    seed();
    if (reduced) {
      renderStatic();
    } else {
      loop();
    }
    window.addEventListener('resize', () => { seed(); if (reduced) drawFrame(); });
    document.addEventListener('visibilitychange', () => {
      if (reduced) return;
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    });
  }

  /* ── SCENE CONTROLLER ──────────────────────── */
  const scenes = $$('.scene');
  const railBtns = $$('#rail button');
  const counter = $('#counter');
  let active = 0;

  const activate = (i) => {
    if (i < 0 || i >= scenes.length) return;
    active = i;
    scenes.forEach((s, idx) => s.classList.toggle('in', idx <= i));
    railBtns.forEach((b, idx) => b.classList.toggle('active', idx === i));
    if (counter && !reduced) counter.textContent = String(i + 1).padStart(2, '0') + '/' + String(scenes.length).padStart(2, '0');
  };

  const goto = (i) => {
    const n = ((i % scenes.length) + scenes.length) % scenes.length;
    scenes[n].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activate(scenes.indexOf(e.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    scenes.forEach((s) => io.observe(s));
  }

  if (reduced) {
    scenes.forEach((s) => s.classList.add('in'));
    activate(0);
  } else {
    activate(0);
  }

  /* ── RAIL ──────────────────────────────────── */
  railBtns.forEach((b, i) => {
    b.addEventListener('click', () => goto(i));
  });

  $$('.jump-chip[data-goto]').forEach((b) => {
    b.addEventListener('click', () => goto(Number(b.dataset.goto)));
  });

  /* ── MAP ───────────────────────────────────── */
  const map = $('#map');
  const mapBtn = $('#map-btn');
  const mapClose = $('#map-close');
  const openMap = () => map && (map.classList.add('open'), mapBtn && mapBtn.setAttribute('aria-expanded', 'true'));
  const closeMap = () => map && (map.classList.remove('open'), mapBtn && mapBtn.setAttribute('aria-expanded', 'false'));
  mapBtn && mapBtn.addEventListener('click', openMap);
  mapClose && mapClose.addEventListener('click', closeMap);
  map && map.addEventListener('click', (e) => { if (e.target === map) closeMap(); });
  map && $$('a', map).forEach((a) => a.addEventListener('click', closeMap));

  /* ── KEYBOARD ──────────────────────────────── */
  window.addEventListener('keydown', (e) => {
    if (map && map.classList.contains('open')) {
      if (e.key === 'Escape') closeMap();
      return;
    }
    const t = e.target;
    const near = (sel) => t && typeof t.closest === 'function' && t.closest(sel);
    if (near('input, textarea, [contenteditable=""], [contenteditable="true"]')) return;
    if (e.key === ' ' && near('button, a, [role="button"]')) return;
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      goto(active + 1);
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      goto(active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goto(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goto(scenes.length - 1);
    }
  });

  /* ── CONTACT FORM ──────────────────────────── */
  const form = $('#contact-form');
  const sendBtn = $('#send-btn');
  if (form && sendBtn) {
    const reset = () => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = `send_message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      sendBtn.style.background = '';
      sendBtn.style.color = '';
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      sendBtn.disabled = true;
      sendBtn.textContent = 'sending...';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          sendBtn.textContent = '✓ message sent!';
          sendBtn.style.background = 'linear-gradient(100deg,#c6ff3d,#3ddcff)';
          form.reset();
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
      setTimeout(reset, 3000);
    });
  }
})();