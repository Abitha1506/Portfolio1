/**
 * Abitha's Personal Portfolio Scripts
 * - Ambient floating particles canvas (Electric Teal & Sky)
 * - Sticky navigation shadow & active link tracker
 * - Mobile responsive menu toggle
 * - Stats counter animation (Intersection Observer)
 * - Contact transmission form handling
 * - Resume preview & download modal
 */

// 1. Interactive Ambient Particle Background
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
const particleCount = window.innerWidth < 768 ? 20 : 45;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class AmbientParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.8 + 0.6;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    
    // Electric Indigo, Royal Purple, and Soft Iris palette
    const colors = [
      'rgba(99, 102, 241, ',
      'rgba(168, 85, 247, ',
      'rgba(129, 140, 248, '
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.35 + 0.12;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

if (canvas && ctx) {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new AmbientParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 105) {
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 105)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// 2. Continuous Marquee Duplicator
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
  const clone = marqueeContent.innerHTML;
  marqueeContent.innerHTML += clone;
}

// 3. Navbar Sticky Effect & Scroll Spy
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// 4. Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isVisible = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isVisible ? 'none' : 'flex';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
    });
  });
}

// 5. Number Counters with Intersection Observer
const counterElements = document.querySelectorAll('.counter');
let countersDone = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersDone) {
      countersDone = true;
      counterElements.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let current = 0;
        const step = target / 20;

        const updateCount = () => {
          current += step;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            setTimeout(updateCount, 40);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
      });
    }
  });
}, { threshold: 0.3 });

if (counterElements.length > 0) {
  observer.observe(counterElements[0]);
}

// 6. Contact Form Submission (Direct Delivery to abitha.mern@gmail.com via FormSubmit AJAX)
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const btn = document.getElementById('submit-btn');

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

  const formData = new FormData(form);

  try {
    const response = await fetch('https://formsubmit.co/ajax/abitha.mern@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok || data.success === 'true' || data.success === true) {
      feedback.className = 'form-status success';
      feedback.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Message sent successfully! Delivered directly to Abitha\'s inbox.';
      form.reset();
    } else {
      feedback.className = 'form-status';
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(239, 68, 68, 0.15)';
      feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      feedback.style.color = '#f87171';
      feedback.innerHTML = `<i class="fa-solid fa-circle-exclamation mr-2"></i> ${data.message || 'Failed to deliver message.'}`;
    }
  } catch (error) {
    feedback.className = 'form-status';
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(239, 68, 68, 0.15)';
    feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    feedback.style.color = '#f87171';
    feedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i> Direct email fallback: Please send to <a href="mailto:abitha.mern@gmail.com" style="text-decoration:underline;">abitha.mern@gmail.com</a>';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-regular fa-paper-plane mr-2"></i> Send Message to Abitha';
    setTimeout(() => {
      feedback.style.display = 'none';
      feedback.className = 'form-status';
    }, 7000);
  }
}

// 7. Resume Modal Handlers
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}
