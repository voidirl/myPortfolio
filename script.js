const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx - 4 + 'px';
  cur.style.top  = my - 4 + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx - 18 + 'px';
  ring.style.top  = ry - 18 + 'px';
  requestAnimationFrame(animateRing);
})();

// Cursor scale on hover
document.querySelectorAll('a, button, .proj-card, .trait-card, .ci-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform  = 'scale(2)';
    ring.style.transform = 'scale(1.6)';
    ring.style.borderColor = 'rgba(201,168,76,0.9)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform  = 'scale(1)';
    ring.style.transform = 'scale(1)';
    ring.style.borderColor = 'rgba(201,168,76,0.6)';
  });
});


//    SKILL BARS — animate on scroll

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

//    NAV — active link highlight on scroll

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--gold2)'
      : '';
  });
});

//    CONTACT FORM — send button feedback

const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    sendBtn.textContent = '✓ Message Sent!';
    sendBtn.style.background = 'linear-gradient(135deg, #4caf50, #81c784)';
    setTimeout(() => {
      sendBtn.innerHTML = `Send Message
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>`;
      sendBtn.style.background = '';
    }, 3000);
  });
}

//    SCROLL REVEAL — fade in sections

const revealEls = document.querySelectorAll('.skill-card, .proj-card, .trait-card, .ci-card, .stat');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transition = `opacity 0.5s ${i * 0.07}s, transform 0.5s ${i * 0.07}s`;
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  revealObserver.observe(el);
});