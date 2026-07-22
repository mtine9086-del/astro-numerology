(() => {
  'use strict';

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHU9Xla5ivMMenIkVdn41ZX1BlY3v6ESxttfB4-KxX5FmyJnzPRskDdr21Lxxe3BLP0A/exec';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Header scroll state
  --------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------------------------------------------------
     Floating mobile CTA visibility
  --------------------------------------------------------- */
  const floatingCta = document.getElementById('floatingCta');
  const heroSection = document.getElementById('hero');
  const consultSection = document.getElementById('consult');
  if (floatingCta && heroSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === heroSection) {
          floatingCta.classList.toggle('visible', !entry.isIntersecting);
        }
        if (entry.target === consultSection && entry.isIntersecting) {
          floatingCta.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });
    ctaObserver.observe(heroSection);
    if (consultSection) ctaObserver.observe(consultSection);
  }

  /* ---------------------------------------------------------
     Cosmic cursor glow (desktop only, mouse parallax feel)
  --------------------------------------------------------- */
  const cosmicGlow = document.getElementById('cosmicGlow');
  if (cosmicGlow && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    const animateGlow = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      cosmicGlow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    };
    requestAnimationFrame(animateGlow);
  } else if (cosmicGlow) {
    cosmicGlow.style.display = 'none';
  }

  /* ---------------------------------------------------------
     Hero parallax on sacred geometry / orbit (subtle)
  --------------------------------------------------------- */
  const heroOrbit = document.querySelector('.hero-orbit');
  if (heroOrbit && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const relX = (e.clientX / window.innerWidth - 0.5) * 2;
      const relY = (e.clientY / window.innerHeight - 0.5) * 2;
      heroOrbit.style.transform = `translate(-50%, -50%) translate(${relX * 14}px, ${relY * 14}px)`;
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     Starfield canvas
  --------------------------------------------------------- */
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight;
    }

    function createStars() {
      const count = Math.min(180, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      }));
    }

    let frame = 0;
    function draw() {
      frame++;
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        const alpha = prefersReducedMotion
          ? s.baseAlpha
          : s.baseAlpha + Math.sin(frame * s.twinkleSpeed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createStars();
      }, 200);
    });
  }

  /* ---------------------------------------------------------
     Scroll-reveal via IntersectionObserver
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------
     Scroll indicator click
  --------------------------------------------------------- */
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Animated stat counters
  --------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach(el => statObserver.observe(el));
  }

  /* ---------------------------------------------------------
     Testimonial slider (auto-advance + dots)
  --------------------------------------------------------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('sliderDots');
  if (track && dotsWrap) {
    const cards = Array.from(track.children);
    let current = 0;
    let autoTimer;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index, userTriggered) {
      current = (index + cards.length) % cards.length;
      track.scrollTo({ left: cards[current].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (userTriggered) restartAuto();
    }

    function next() { goTo(current + 1); }

    function restartAuto() {
      clearInterval(autoTimer);
      if (!prefersReducedMotion) {
        autoTimer = setInterval(next, 6000);
      }
    }

    restartAuto();
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', restartAuto);
  }

  /* ---------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------------------------------------------------
     Consultation form: validation + Google Apps Script submit
  --------------------------------------------------------- */
  const form = document.getElementById('consultForm');
  if (form) {
    const submitBtn = document.getElementById('submitBtn');
    const statusEl = document.getElementById('formStatus');

    const validators = {
      fullName: (v) => v.trim().length >= 2,
      mobile: (v) => /^[0-9+\-\s()]{7,16}$/.test(v.trim()),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      dob: (v) => v.trim().length > 0,
      birthPlace: (v) => v.trim().length >= 2
    };

    function setFieldState(field, valid) {
      const wrapper = field.closest('.form-field');
      if (!wrapper) return;
      wrapper.classList.toggle('invalid', !valid);
    }

    function validateForm() {
      let allValid = true;
      Object.keys(validators).forEach(name => {
        const field = form.elements[name];
        if (!field) return;
        const valid = validators[name](field.value);
        setFieldState(field, valid);
        if (!valid) allValid = false;
      });
      return allValid;
    }

    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', () => setFieldState(field, validators[name](field.value)));
      field.addEventListener('input', () => {
        if (field.closest('.form-field')?.classList.contains('invalid')) {
          setFieldState(field, validators[name](field.value));
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        statusEl.textContent = 'Please correct the highlighted fields.';
        statusEl.className = 'form-status error';
        const firstInvalid = form.querySelector('.form-field.invalid input, .form-field.invalid textarea');
        firstInvalid?.focus();
        return;
      }

      const payload = {
        fullName: form.fullName.value.trim(),
        mobile: form.mobile.value.trim(),
        email: form.email.value.trim(),
        dob: form.dob.value,
        birthTime: form.birthTime.value,
        birthPlace: form.birthPlace.value.trim(),
        message: form.message.value.trim(),
        submittedAt: new Date().toISOString()
      };

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      try {
        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        // 'no-cors' mode returns an opaque response we can't read,
        // so a successful fetch (no thrown network error) is treated as success.
        statusEl.textContent = 'Thank you! Your request has been received — we will reach out within 24 hours.';
        statusEl.className = 'form-status success';
        form.reset();
        faqItems.forEach(i => i.classList.remove('open'));
      } catch (err) {
        statusEl.textContent = 'Something went wrong sending your request. Please try again or email us directly.';
        statusEl.className = 'form-status error';
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }

})();
