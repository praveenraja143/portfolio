// Portfolio 2: Scroll-Driven Motion & Button Swap Engine

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initAudioEngine();
  initScrollNavObserver();
  initCategorySwapTabs();
  initSkillFilterSwap();
  initCustomCursor();
  initTypewriter();
  initTiltCard();
  initModalSystem();
});

/* 1. Preloader */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloader-fill');
  const status = document.getElementById('preloader-status');

  if (!preloader || !fill || !status) return;

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;

    fill.style.width = `${progress}%`;
    status.textContent = `INITIALIZING SYSTEM... ${progress}%`;

    if (progress === 100) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 400);
    }
  }, 60);
}

/* 2. Audio Effects Engine */
let audioActive = true;
let audioContext = null;

function initAudioEngine() {
  const btn = document.getElementById('audio-btn');
  const label = document.getElementById('audio-status');

  if (btn) {
    btn.addEventListener('click', () => {
      audioActive = !audioActive;
      if (label) label.textContent = audioActive ? 'SOUND: ON' : 'SOUND: OFF';
      if (audioActive) playSound(580, 0.08, 'sine');
    });
  }

  const interactive = document.querySelectorAll('button, a, .glass-card');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (audioActive) playSound(440, 0.03, 'triangle');
    });
    el.addEventListener('click', () => {
      if (audioActive) playSound(880, 0.06, 'sine');
    });
  });
}

function playSound(freq, duration, type = 'sine') {
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') audioContext.resume();

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioContext.currentTime + duration);

    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {}
}

/* 3. Scroll-Driven Navigation Observer & Active Pill Slider */
function initScrollNavObserver() {
  const stages = document.querySelectorAll('.scene-stage');
  const pills = document.querySelectorAll('.nav-pill');
  const slider = document.getElementById('nav-slider');

  function updateSlider(activePill) {
    if (!slider || !activePill) return;
    const parentRect = activePill.parentElement.getBoundingClientRect();
    const pillRect = activePill.getBoundingClientRect();
    slider.style.left = `${pillRect.left - parentRect.left}px`;
    slider.style.width = `${pillRect.width}px`;
  }

  // Intersection Observer for scroll-driven scene reveal & navbar update
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        const id = entry.target.getAttribute('id');
        pills.forEach(pill => {
          pill.classList.remove('active');
          if (pill.getAttribute('data-target') === id) {
            pill.classList.add('active');
            updateSlider(pill);
          }
        });
      }
    });
  }, { threshold: 0.25 });

  stages.forEach(stage => observer.observe(stage));

  // Navbar Pill Clicks for smooth scrolling
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.getAttribute('data-target');
      const targetElem = document.getElementById(targetId);

      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const firstActive = document.querySelector('.nav-pill.active');
  if (firstActive) updateSlider(firstActive);

  window.addEventListener('resize', () => {
    const current = document.querySelector('.nav-pill.active');
    if (current) updateSlider(current);
  });
}

window.switchScene = function(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

/* 4. Category Tab Panel Swap */
function initCategorySwapTabs() {
  const swapBtns = document.querySelectorAll('.swap-btn');
  const panels = document.querySelectorAll('.swap-panel');

  swapBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swapBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.getAttribute('data-tab');
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === `panel-${tab}`) p.classList.add('active');
      });
    });
  });
}

/* 5. Skill Matrix Filter */
function initSkillFilterSwap() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.matrix-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');
      cards.forEach(c => {
        if (cat === 'all' || c.getAttribute('data-cat') === cat) {
          c.style.display = 'block';
        } else {
          c.style.display = 'none';
        }
      });
    });
  });
}

/* 6. Custom Cursor */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let rx = 0, ry = 0, mx = 0, my = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
  });

  function renderRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    requestAnimationFrame(renderRing);
  }
  renderRing();
}

/* 7. Typewriter Effect */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    "AI & Data Science Architect",
    "Generative AI & LLM Specialist",
    "Machine Learning & Computer Vision",
    "Blockchain Land Registry Builder"
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIdx === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  type();
}

/* 8. 3D Tilt Card */
function initTiltCard() {
  const card = document.getElementById('holo-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -14;
    const rotY = (x / (rect.width / 2)) * 14;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* 9. Modal System */
function initModalSystem() {
  const overlay = document.getElementById('modal-overlay');
  const titleElem = document.getElementById('modal-title');
  const descElem = document.getElementById('modal-desc');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay || !titleElem || !descElem) return;

  const triggers = document.querySelectorAll('.btn-modal-trigger');
  triggers.forEach(t => {
    t.addEventListener('click', () => {
      titleElem.textContent = t.getAttribute('data-title');
      descElem.textContent = t.getAttribute('data-desc');
      overlay.classList.add('active');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}
