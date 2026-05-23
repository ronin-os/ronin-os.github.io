document.addEventListener('DOMContentLoaded', () => {
  // ── Dependency Tabs ──
  const tabs = document.querySelectorAll('.deps-tab');
  const deps = {
    ubuntu: document.getElementById('deps-ubuntu'),
    arch: document.getElementById('deps-arch'),
    fedora: document.getElementById('deps-fedora'),
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      Object.entries(deps).forEach(([key, el]) => {
        if (el) el.classList.add('hidden');
      });
      tab.classList.add('active');
      const distro = tab.dataset.distro;
      const target = deps[distro];
      if (target) target.classList.remove('hidden');
    });
  });

  // ── Architecture Tabs ──
  const archTabs = document.querySelectorAll('.arch-tab');
  const archPanels = {
    kernel: document.getElementById('arch-kernel'),
    userspace: document.getElementById('arch-userspace'),
    infra: document.getElementById('arch-infra'),
  };

  archTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      archTabs.forEach(t => t.classList.remove('active'));
      Object.values(archPanels).forEach(p => {
        if (p) p.classList.remove('active');
      });
      tab.classList.add('active');
      const key = tab.dataset.arch;
      const panel = archPanels[key];
      if (panel) panel.classList.add('active');
    });
  });

  // ── Timeline Scroll Animation ──
  const tlPhases = document.querySelectorAll('.tl-phase');
  if (tlPhases.length) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    tlPhases.forEach(phase => tlObserver.observe(phase));
  }

  // ── Counter Animation ──
  const statEls = document.querySelectorAll('.stat-num');
  if (statEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + '+';
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + '+';
      }
    }

    requestAnimationFrame(update);
  }

  // ── Interactive Particles ──
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 80;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(97, 175, 239, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(97, 175, 239, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
  }

  // ── Scroll Reveal for Cards ──
  const revealCards = document.querySelectorAll('.feature-card, .fs-card, .vision-card');
  if (revealCards.length) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    revealCards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.5s ease ${i * 0.03}s, transform 0.5s ease ${i * 0.03}s`;
      cardObserver.observe(card);
    });
  }

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        navbar.style.background = 'rgba(30, 30, 30, 0.95)';
        navbar.style.borderBottomColor = 'rgba(60, 60, 60, 0.8)';
      } else {
        navbar.style.background = 'rgba(30, 30, 30, 0.85)';
        navbar.style.borderBottomColor = 'var(--bg-surface)';
      }
      lastScroll = currentScroll;
    });
  }
});
