const onScroll = () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 20);
};

const initReveal = () => {
  const elements = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach((el) => io.observe(el));
};

const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.count, 10);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));

    const tick = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
      } else {
        counter.textContent = current.toLocaleString();
        requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tick();
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    io.observe(counter);
  });
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[data-scroll]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });
};

const initCursorSpotlight = () => {
  const spotlight = document.querySelector('.cursor-spotlight');
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!spotlight || !dot || !ring) return;
  let active = false;
  let ringX = 0;
  let ringY = 0;

  const move = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    spotlight.style.left = `${x}px`;
    spotlight.style.top = `${y}px`;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    ringX += (x - ringX) * 0.2;
    ringY += (y - ringY) * 0.2;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    if (!active) {
      document.body.classList.add('cursor-active');
      active = true;
    }
  };

  const hide = () => {
    document.body.classList.remove('cursor-active');
    active = false;
  };

  window.addEventListener('mousemove', move);
  window.addEventListener('mouseout', hide);
  window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

  window.addEventListener('touchstart', () => {
    hide();
    window.removeEventListener('mousemove', move);
  }, { once: true });
};

window.addEventListener('scroll', onScroll);
window.addEventListener('load', () => {
  onScroll();
  initReveal();
  initCounters();
  initSmoothScroll();
  initCursorSpotlight();
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const storedTheme = localStorage.getItem('kpiTheme');
  if (storedTheme === 'light') {
    document.body.classList.add('theme-light');
  }
  if (themeToggle) {
    const setLabel = () => {
      const isLight = document.body.classList.contains('theme-light');
      themeToggle.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    };
    setLabel();
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      const isLight = document.body.classList.contains('theme-light');
      localStorage.setItem('kpiTheme', isLight ? 'light' : 'dark');
      setLabel();
    });
  }
});
