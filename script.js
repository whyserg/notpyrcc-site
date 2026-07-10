// ========================================================
// 1. ДИНАМИЧЕСКИЙ ФОНОВЫЙ ГРАДИЕНТ ОТ МЫШИ
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
// 2. ОСНОВНЫЕ ФУНКЦИИ
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  const skeleton = document.getElementById('skeleton');
  const container = document.getElementById('mainContainer');
  setTimeout(() => {
    skeleton.style.display = 'none';
    container.style.display = 'block';
    initStagger();
    initTilt();
    initParticles();
    initScrollTop();
    initCursor();
    initYear();
    initSearch();
    initEmployeeModal();
  }, 1200);
});

// ===== Stagger-анимация =====
function initStagger() {
  const items = document.querySelectorAll('.fade-in');
  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
}

// ===== 3D-наклон карточек =====
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

// ===== Частицы =====
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

// ===== Год в футере =====
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
if (burger) {
  burger.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) toggleMenu();
    });
  });
}

// ===== Счётчик просмотров (используется в модалке) =====
function updateViews() {
  const viewsSpan = document.getElementById('viewsCount');
  if (!viewsSpan) return;
  try {
    let views = localStorage.getItem('siteViews');
    if (views) { views = Number(views) + 1; } else { views = 1; }
    localStorage.setItem('siteViews', views);
    viewsSpan.textContent = views;
  } catch (e) { viewsSpan.textContent = '1234'; }
}
if (document.getElementById('viewsCount')) updateViews();

// ===== Плавная прокрутка для якорей =====
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

// ===== ПОИСК =====
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

// ===== ДАННЫЕ СОТРУДНИКОВ (обновлены ссылки) =====
const employeesData = {
  1: {
    name: 'Izzi pussi',
    role: 'БОСС НАХ',
    roleColor: '#b388ff',
    avatar: 'avatar.jpg',
    description: `Инженер-разработчик с 3+ годами опыта, прошедший путь от прототипов в стартапах до масштабирования в крупных проектах. Владею стеком Python, JavaScript, HTML — создаю не просто код, а архитектуру, которая живёт и дышит. Особое место в моей практике занимает Pawno: здесь я оттачивал навыки работы с низкоуровневой логикой и производительностью.<br><br>Я не просто пишу функции — я строю продукты. Умею быстро вникать в доменную область, адаптироваться под требования бизнеса и превращать сырые идеи в работающие решения. Работал как в динамичных стартапах (где каждый день — вызов), так и в крупных экосистемах (где важна стабильность и масштаб). Мой код — это баланс между красотой, читаемостью и прагматизмом.`,
    audioSrc: 'song_izzi.mp3',
    socials: [
      { icon: 'fab fa-telegram-plane', url: 'https://t.me/iipussi', label: 'Telegram' },
      { icon: 'fab fa-discord', url: 'https://discord.com/users/1524753965793939466', label: 'Discord' }
    ]
  },
  2: {
    name: 'Mishka',
    role: 'ПРАВАЯ РУКА НАХ',
    roleColor: '#ff5252',
    avatar: 'mishka.jpg',
    description: `Руководящее лицо компании, занимающее пост с самого основания проекта. Mishka — это стратег и организатор, который превращает хаос в порядок, а идеи — в чёткие планы. Благодаря её управленческому таланту и умению находить общий язык с каждым, команда работает как единый механизм. Она отвечает за координацию разработки, взаимодействие с партнёрами и контроль качества — и делает это с неподражаемой энергией и вниманием к деталям. Mishka — душа компании, её надёжный тыл и мотор, который не даёт проекту останавливаться.`,
    audioSrc: 'mishka_song.mp3',
    socials: [
      { icon: 'fab fa-telegram-plane', url: 'https://t.me/lost_dies', label: 'Telegram' },
      { icon: 'fab fa-discord', url: 'https://discord.com/users/1257048208891449346', label: 'Discord' }
    ]
  }
};

// ===== МОДАЛЬНОЕ ОКНО ДЛЯ СОТРУДНИКОВ (с динамическим плеером) =====
function initEmployeeModal() {
  const modal = document.getElementById('employeeModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.querySelector('.close-modal');
  const detailBtns = document.querySelectorAll('.employee-detail-btn');

  const modalAudio = document.getElementById('modalAudio');
  const modalPlayBtn = document.getElementById('modalPlayBtn');
  const modalProgressBar = document.getElementById('modalProgressBar');
  const modalCurrentTime = document.getElementById('modalCurrentTime');
  const modalDurationTime = document.getElementById('modalDurationTime');

  if (!modal || !modalBody) return;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateModalProgress() {
    if (modalAudio.duration) {
      const percent = (modalAudio.currentTime / modalAudio.duration) * 100;
      modalProgressBar.value = percent;
      modalCurrentTime.textContent = formatTime(modalAudio.currentTime);
      modalDurationTime.textContent = formatTime(modalAudio.duration);
    }
  }

  modalAudio.addEventListener('loadedmetadata', () => {
    modalDurationTime.textContent = formatTime(modalAudio.duration);
  });
  modalAudio.addEventListener('timeupdate', updateModalProgress);
  modalProgressBar.addEventListener('input', () => {
    if (modalAudio.duration) {
      modalAudio.currentTime = (modalProgressBar.value / 100) * modalAudio.duration;
    }
  });
  modalPlayBtn.addEventListener('click', () => {
    if (modalAudio.paused) {
      modalAudio.play();
      modalPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
      modalPlayBtn.classList.add('playing');
    } else {
      modalAudio.pause();
      modalPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
      modalPlayBtn.classList.remove('playing');
    }
  });

  function openModal(employeeId) {
    const data = employeesData[employeeId];
    if (!data) return;

    let socialHtml = '';
    if (data.socials && data.socials.length > 0) {
      socialHtml = `<div class="modal-socials">`;
      data.socials.forEach(social => {
        socialHtml += `<a href="${social.url}" target="_blank" class="modal-social-link"><i class="${social.icon}"></i> ${social.label}</a>`;
      });
      socialHtml += `</div>`;
    }

    modalBody.innerHTML = `
      <img src="${data.avatar}" alt="${data.name}" class="avatar">
      <h2 class="gradient-text">${data.name}</h2>
      <p class="employee-role" style="color: ${data.roleColor}; font-size: 1.2rem;">${data.role}</p>
      <p class="about-desc">${data.description}</p>
      ${socialHtml}
      <div class="views">
        <i class="fas fa-eye"></i> <span id="viewsCount">0</span> просмотров
      </div>
    `;

    const viewsSpan = modalBody.querySelector('#viewsCount');
    if (viewsSpan) {
      try {
        let views = localStorage.getItem('siteViews');
        if (views) { views = Number(views) + 1; } else { views = 1; }
        localStorage.setItem('siteViews', views);
        viewsSpan.textContent = views;
      } catch (e) { viewsSpan.textContent = '1234'; }
    }

    modalAudio.src = data.audioSrc;
    modalAudio.load();
    modalAudio.currentTime = 0;
    modalProgressBar.value = 0;
    modalCurrentTime.textContent = '0:00';
    modalDurationTime.textContent = '0:00';
    modalPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    modalPlayBtn.classList.remove('playing');

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    modalAudio.play().then(() => {
      modalPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
      modalPlayBtn.classList.add('playing');
    }).catch(() => {});
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    modalAudio.pause();
    modalAudio.currentTime = 0;
    modalPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    modalPlayBtn.classList.remove('playing');
  }

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.employee-card');
      if (card) {
        const empId = card.dataset.employee;
        if (empId) openModal(empId);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
  });
}

console.log('Сайт загружен со всеми улучшениями!');