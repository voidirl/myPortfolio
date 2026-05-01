// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
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

// Cursor scale on hover
document.querySelectorAll('a, button, .proj-card, .trait-card, .ci-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'scale(2)';
    ring.style.transform = 'scale(1.6)';
    ring.style.borderColor = 'rgba(201,168,76,0.9)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'scale(1)';
    ring.style.transform = 'scale(1)';
    ring.style.borderColor = 'rgba(201,168,76,0.6)';
  });
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── SKILL BARS — animate on scroll ──
const bars = document.querySelectorAll('.skill-fill');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width;
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

bars.forEach(b => barObserver.observe(b));

// ── NAV — active link highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--gold2)'
      : '';
  });
});

// ── CONTACT FORM — Formspree submission with feedback ──
const contactForm = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');

if (contactForm && sendBtn) {
  contactForm.addEventListener('submit', async (e) => {
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
      sendBtn.innerHTML = `Send Message
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>`;
      sendBtn.style.background = '';
    }, 3000);
  });
}

// ── PROJECT FILTER TABS ──
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
        // force reflow so transition fires
        card.getBoundingClientRect();
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          if (!card.classList.contains('hidden')) return;
          card.style.display = 'none';
        }, 300);
        card.classList.add('hidden');
      }
    });
  });
});