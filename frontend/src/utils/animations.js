import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ── Basic Animations ──────────────────────────────────────────

export const fadeInUp = (el, delay = 0) => {
  gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' });
};

export const staggerCards = (els, stagger = 0.1) => {
  gsap.fromTo(els, { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger, ease: 'power2.out' });
};

// ── Hero Cinematic Animation ──────────────────────────────────

export const heroAnimation = (container) => {
  const tl = gsap.timeline();

  // Badge slides in
  const badge = container.querySelector('.hero-badge');
  if (badge) {
    tl.fromTo(badge, { opacity: 0, x: -30, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
  }

  // Title words split reveal
  const title = container.querySelector('.hero-title');
  if (title) {
    tl.fromTo(title, { opacity: 0, y: 60, rotationX: -15 },
      { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: 'power4.out' }, '-=0.2');
  }

  // Subtitle
  const sub = container.querySelector('.hero-subtitle');
  if (sub) {
    tl.fromTo(sub, { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
  }

  // Form slides up from below
  const form = container.querySelector('.hero-input');
  if (form) {
    tl.fromTo(form, { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4');
  }

  // Bottle entrance with elastic bounce
  const bottle = container.querySelector('.hero-bottle');
  if (bottle) {
    tl.fromTo(bottle, { opacity: 0, scale: 0.6, rotation: -15, y: 60 },
      { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)' }, '-=0.8');
  }

  return tl;
};

// ── Floating Bottle Animation ─────────────────────────────────

export const bottleFloat = (el) => {
  gsap.to(el, { y: -18, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
};

// ── Pulse Button ──────────────────────────────────────────────

export const pulseButton = (el) => {
  gsap.to(el, {
    scale: 1.04, boxShadow: '0 0 40px rgba(0,184,148,0.45)',
    duration: 1, ease: 'sine.inOut', yoyo: true, repeat: -1
  });
};

// ── Page Transition ───────────────────────────────────────────

export const pageTransition = (el, direction = 'in') => {
  if (direction === 'in') {
    gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  } else {
    gsap.to(el, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' });
  }
};

// ── Scroll Reveal ─────────────────────────────────────────────

export const scrollReveal = (els) => {
  els.forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });
};

// ── Text Reveal (Word-by-Word) ────────────────────────────────

export const textReveal = (el) => {
  const text = el.textContent;
  const words = text.split(' ');
  el.innerHTML = words.map(w => `<span class="reveal-word" style="display:inline-block;opacity:0">${w}</span>`).join(' ');
  gsap.to(el.querySelectorAll('.reveal-word'), {
    opacity: 1, y: 0, rotationX: 0, duration: 0.5,
    stagger: 0.06, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
};

// ── Counter Animation (for stats) ─────────────────────────────

export const counterAnimate = (el, target, suffix = '') => {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target, duration: 2, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toLocaleString() + suffix;
    }
  });
};

// ── Magnetic Hover ────────────────────────────────────────────

export const magneticHover = (el, strength = 0.3) => {
  const handleMove = (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
  };
  const handleLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };
  el.addEventListener('mousemove', handleMove);
  el.addEventListener('mouseleave', handleLeave);
  return () => {
    el.removeEventListener('mousemove', handleMove);
    el.removeEventListener('mouseleave', handleLeave);
  };
};

// ── 3D Card Tilt ──────────────────────────────────────────────

export const cardTilt3D = (el, maxTilt = 8) => {
  const handleMove = (e) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * maxTilt;
    gsap.to(el, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
  };
  const handleLeave = () => {
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };
  el.addEventListener('mousemove', handleMove);
  el.addEventListener('mouseleave', handleLeave);
  return () => {
    el.removeEventListener('mousemove', handleMove);
    el.removeEventListener('mouseleave', handleLeave);
  };
};

// ── Elastic Scale (click feedback) ────────────────────────────

export const elasticScale = (el) => {
  el.addEventListener('click', () => {
    gsap.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
  });
};

// ── Wave Stagger Animation ────────────────────────────────────

export const waveAnimation = (els, options = {}) => {
  const { delay = 0, scrollTriggerEl = null } = options;
  gsap.fromTo(els,
    { opacity: 0, y: 50, scale: 0.9, rotationY: -5 },
    {
      opacity: 1, y: 0, scale: 1, rotationY: 0,
      duration: 0.7, stagger: { amount: 0.6, from: 'center' },
      ease: 'back.out(1.4)', delay,
      scrollTrigger: scrollTriggerEl ? { trigger: scrollTriggerEl, start: 'top 80%' } : undefined,
    }
  );
};

// ── Shimmer Effect ────────────────────────────────────────────

export const shimmerEffect = (el) => {
  const shimmer = document.createElement('div');
  shimmer.className = 'shimmer-sweep';
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(shimmer);
  gsap.fromTo(shimmer,
    { x: '-100%' },
    { x: '200%', duration: 1.5, ease: 'power2.inOut', repeat: -1, repeatDelay: 3 }
  );
};

// ── Bottle Size Transition ────────────────────────────────────

export const bottleSizeTransition = (bottleEl, size) => {
  const sizes = {
    '250ml': { height: 200, bodyHeight: 160, width: 70, neckHeight: 22, capWidth: 22 },
    '500ml': { height: 280, bodyHeight: 220, width: 90, neckHeight: 28, capWidth: 26 },
    '1000ml': { height: 360, bodyHeight: 280, width: 110, neckHeight: 34, capWidth: 30 },
  };
  const s = sizes[size] || sizes['500ml'];
  const body = bottleEl.querySelector('.bottle-body-3d');
  const neck = bottleEl.querySelector('.bottle-neck-3d');
  const cap = bottleEl.querySelector('.bottle-cap-3d');
  if (body) gsap.to(body, { height: s.bodyHeight, width: s.width, duration: 0.6, ease: 'power3.inOut' });
  if (neck) gsap.to(neck, { height: s.neckHeight, duration: 0.6, ease: 'power3.inOut' });
  if (cap) gsap.to(cap, { width: s.capWidth, duration: 0.6, ease: 'power3.inOut' });
};

// ── Label Wrap Animation ──────────────────────────────────────

export const labelWrapAnimation = (labelEl) => {
  gsap.fromTo(labelEl,
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'left center' }
  );
};

// ── Navbar Scroll Shrink ──────────────────────────────────────

export const navbarScrollEffect = (navEl) => {
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.direction === 1 && self.scroll() > 80) {
        navEl.classList.add('navbar-scrolled');
      } else if (self.scroll() <= 80) {
        navEl.classList.remove('navbar-scrolled');
      }
    }
  });
};

// ── Cart Bounce ───────────────────────────────────────────────

export const cartBounce = (el) => {
  const tl = gsap.timeline();
  tl.to(el, { scale: 1.3, rotation: 15, duration: 0.15, ease: 'power2.out' })
    .to(el, { scale: 0.85, rotation: -10, duration: 0.1, ease: 'power2.inOut' })
    .to(el, { scale: 1.1, rotation: 5, duration: 0.1, ease: 'power2.inOut' })
    .to(el, { scale: 1, rotation: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
  return tl;
};

// ── Connecting Timeline (for steps) ───────────────────────────

export const drawTimeline = (lineEl, cards) => {
  gsap.fromTo(lineEl, { scaleX: 0 }, {
    scaleX: 1, duration: 1.2, ease: 'power3.inOut', transformOrigin: 'left center',
    scrollTrigger: { trigger: lineEl, start: 'top 80%' }
  });
  cards.forEach((card, i) => {
    gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.9 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)',
      delay: 0.2 + i * 0.15,
      scrollTrigger: { trigger: lineEl, start: 'top 80%' }
    });
  });
};

// ── Particle System (for hero background) ─────────────────────

export class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.opts = {
      count: options.count || 40,
      color: options.color || 'rgba(0, 184, 148, 0.4)',
      maxSize: options.maxSize || 3,
      speed: options.speed || 0.5,
      connectDistance: options.connectDistance || 120,
      ...options,
    };
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.canvas.parentElement?.offsetWidth || window.innerWidth;
    this.canvas.height = this.canvas.parentElement?.offsetHeight || window.innerHeight;
    this.init();
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.opts.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.opts.speed,
        vy: (Math.random() - 0.5) * this.opts.speed,
        size: Math.random() * this.opts.maxSize + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.opts.color.replace(/[\d.]+\)$/, `${p.opacity})`);
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.opts.connectDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / this.opts.connectDistance) * 0.15;
          this.ctx.strokeStyle = this.opts.color.replace(/[\d.]+\)$/, `${alpha})`);
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });
  }

  start() {
    const animate = () => {
      this.draw();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

// ── Marquee Animation ─────────────────────────────────────────

export const marqueeScroll = (el) => {
  const inner = el.querySelector('.marquee-inner');
  if (!inner) return;
  const w = inner.scrollWidth / 2;
  gsap.to(inner, { x: -w, duration: 20, ease: 'none', repeat: -1 });
};
