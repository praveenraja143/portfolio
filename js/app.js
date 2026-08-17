// Praveenraja P Cinematic Experiential Portfolio Engine

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initAudioEngine();
  initCustomCursor();
  initTypewriter();
  initHologram3DTilt();
  initProjectModals();
  initScrollNav();
});

/* 1. Preloader Animation */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  const progressText = document.getElementById('preloader-text');

  if (!preloader || !progressBar || !progressText) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `INITIALIZING NEURAL MATRIX... ${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 400);
    }
  }, 60);
}

/* 2. Web Audio API Sound Synthesizer */
let audioEnabled = true;
let audioCtx = null;

function initAudioEngine() {
  const toggleBtn = document.getElementById('audio-toggle');
  const toggleLabel = document.getElementById('audio-label');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      toggleLabel.textContent = audioEnabled ? 'SOUND: ON' : 'SOUND: OFF';
      if (audioEnabled) playAudioEffect(580, 0.08, 'sine');
    });
  }

  // Add sound triggers to buttons & links
  const interactiveElems = document.querySelectorAll('a, button, .glass-panel');
  interactiveElems.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (audioEnabled) playAudioEffect(440, 0.03, 'triangle');
    });
    el.addEventListener('click', () => {
      if (audioEnabled) playAudioEffect(880, 0.06, 'sine');
    });
  });
}

function playAudioEffect(freq, duration, type = 'sine') {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Web Audio blocked or unsupported
  }
}

/* 3. Custom Cursor */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let rx = 0, ry = 0;
  let mx = 0, my = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  });

  function renderRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(renderRing);
  }
  renderRing();
}

/* 4. Typewriter Effect */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    "AI & Data Science Architect",
    "Generative AI & LLM Specialist",
    "Machine Learning & Computer Vision",
    "Blockchain Land Registry Builder"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

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

/* 5. 3D Profile Hologram Tilt */
function initHologram3DTilt() {
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

/* 6. Project Modal Popup */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const titleElem = document.getElementById('modal-title');
  const descElem = document.getElementById('modal-desc');
  const closeBtn = document.getElementById('modal-close');

  if (!modal || !titleElem || !descElem) return;

  const demoBtns = document.querySelectorAll('.btn-demo-modal');
  demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');

      titleElem.textContent = title;
      descElem.textContent = desc;

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* 7. Scroll Nav Active Observer */
function initScrollNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.scrollY;

    sections.forEach(sec => {
      const top = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}
