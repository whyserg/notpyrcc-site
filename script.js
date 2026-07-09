// ========================================================
// 1. ДИНАМИЧЕСКИЙ ФОНОВЫЙ ГРАДИЕНТ ОТ МЫШИ (новое)
// ========================================================
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.body.style.setProperty('--mouse-x', x + '%');
  document.body.style.setProperty('--mouse-y', y + '%');
});

document.addEventListener('mouseleave', () => {
  document.body.style.setProperty('--mouse-x', '50%');
  document.body.style.setProperty('--mouse-y', '50%');
});

// ========================================================
// 2. ВСЕ ОРИГИНАЛЬНЫЕ ФУНКЦИИ (без изменений)
// ========================================================

// ===== Имитация загрузки (skeleton) =====
document.addEventListener('DOMContentLoaded', () => {
  const skeleton = document.getElementById('skeleton');
  const container = document.getElementById('mainContainer');
  setTimeout(() => {
    skeleton.style.display = 'none';
    container.style.display = 'block';
    initStagger();
    initTilt();
    initParticles();
    // initNavHighlight(); // удалено – больше не нужно
    initScrollTop();
    initCursor();
    initYear();
    initSearch();
  }, 1200);
});

// ===== Stagger-анимация появления =====
function initStagger() {
  const items = document.querySelectorAll('.fade-in');
  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
}

// ===== 3D-наклон карточек (tilt) =====
function initTilt() {
  const cards = document.querySelectorAll('.card-item');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ===== Частицы (canvas) =====
let particles = [];
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const count = 70;
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
    });
  }

  let mouse = { x: w/2, y: h/2 };
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.8;
        p.x -= dx * force * 0.02;
        p.y -= dy * force * 0.02;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random()*0.1})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist/120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== Кнопка "Наверх" =====
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Кастомный курсор =====
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });
  const hoverElements = document.querySelectorAll('a, button, .card-item, .link-btn, .social-links a, .play-btn, .burger');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
    });
  });
}

// ===== Динамический год в футере =====
function initYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ===== Мобильное меню =====
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuLinks = document.querySelectorAll('.menu-link');

function toggleMenu() {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  menuOverlay.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}
burger.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) toggleMenu();
  });
});

// ===== Счётчик просмотров =====
const viewsSpan = document.getElementById('viewsCount');
function updateViews() {
  try {
    let views = localStorage.getItem('siteViews');
    if (views) { views = Number(views) + 1; } else { views = 1; }
    localStorage.setItem('siteViews', views);
    viewsSpan.textContent = views;
  } catch (e) { viewsSpan.textContent = '1234'; }
}
updateViews();

// ===== Кастомный аудио-плеер =====
const audio = document.getElementById('bgAudio');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('durationTime');

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
function updateProgress() {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    currentTimeSpan.textContent = formatTime(audio.currentTime);
    durationSpan.textContent = formatTime(audio.duration);
  }
}
audio.addEventListener('loadedmetadata', () => {
  durationSpan.textContent = formatTime(audio.duration);
});
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add('playing');
  } else {
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.remove('playing');
  }
});
audio.play().then(() => {
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  playBtn.classList.add('playing');
}).catch(() => {
  document.addEventListener('click', function firstClick() {
    if (audio.paused) {
      audio.play().then(() => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('playing');
      }).catch(() => {});
    }
    document.removeEventListener('click', firstClick);
  });
});
audio.addEventListener('ended', () => {
  audio.currentTime = 0;
  audio.play();
});

// ===== Плавная прокрутка (только для якорных ссылок на той же странице) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ПОИСК ПО САЙТУ =====
function initSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  const items = document.querySelectorAll('.searchable-item');

  function filterCards(query) {
    const lowerQuery = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (lowerQuery === '' || text.includes(lowerQuery)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  searchInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      const value = this.value;
      searchInputs.forEach(other => {
        if (other !== this) other.value = value;
      });
      filterCards(value);
    });
  });

  document.querySelectorAll('.search-wrapper').forEach(wrapper => {
    const icon = wrapper.querySelector('i');
    const input = wrapper.querySelector('.search-input');
    if (icon && input) {
      icon.addEventListener('click', () => input.focus());
    }
  });
}

console.log('Сайт загружен со всеми улучшениями!');