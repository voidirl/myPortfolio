// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx - 4 + 'px';
  cur.style.top = my - 4 + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx - 18 + 'px';
  ring.style.top = ry - 18 + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .proj-card, .trait-card, .ci-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'scale(2)';
    ring.style.transform = 'scale(1.6)';
    ring.style.borderColor = 'rgba(212,168,67,0.9)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'scale(1)';
    ring.style.transform = 'scale(1)';
    ring.style.borderColor = 'rgba(212,168,67,0.5)';
  });
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── TYPING EFFECT ──
const typedEl = document.querySelector('.typed-text');
const phrases = [
  'Full-Stack Developer.',
  'Backend Engineer.',
  'AI Integrator.',
  'Open Source Contributor.',
  'Production-Proven Builder.'
];
let pi = 0, ci = 0, deleting = false;

function type() {
  const current = phrases[pi];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ci + 1);
    ci++;
    if (ci === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
setTimeout(type, 1000);

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ── SKILL BARS ──
const bars = document.querySelectorAll('.skill-fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width;
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach(b => barObs.observe(b));

// ── NAV ACTIVE HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--gold2)' : '';
  });
});

// ── CARD TILT / PARALLAX ──
document.querySelectorAll('.proj-card, .skill-card, .trait-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');
if (contactForm && sendBtn) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        sendBtn.textContent = '✓ Message Sent!';
        sendBtn.style.background = 'linear-gradient(135deg, #4caf50, #81c784)';
        contactForm.reset();
      } else {
        sendBtn.textContent = '✗ Failed — try again';
        sendBtn.style.background = 'linear-gradient(135deg, #e53935, #ef5350)';
      }
    } catch {
      sendBtn.textContent = '✗ Network error';
      sendBtn.style.background = 'linear-gradient(135deg, #e53935, #ef5350)';
    }
    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      sendBtn.style.background = '';
    }, 3000);
  });
}

// ── PROJECT FILTER ──
const filterBtns = document.querySelectorAll('.proj-filter-btn');
const projCards = document.querySelectorAll('.proj-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projCards.forEach(card => {
      const cats = card.dataset.category.split(' ');
      const show = filter === 'all' || cats.includes(filter);
      if (show) {
        card.style.display = 'block';
        card.getBoundingClientRect();
        card.style.opacity = '1';
        card.style.transform = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});