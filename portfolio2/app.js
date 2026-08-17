// Portfolio 2: Button Swap & Motion Design Logic Engine

document.addEventListener('DOMContentLoaded', () => {
  initNavbarSlider();
  initCategorySwapTabs();
  initSkillFilterSwap();
  initMotionCanvas();
  initCustomCursor();
  initTypewriter();
  initTiltCard();
  initModalSystem();
});

/* 1. Navbar Button Swap & Slider Motion */
function initNavbarSlider() {
  const pillBtns = document.querySelectorAll('.nav-pill-btn');
  const slider = document.getElementById('nav-slider');
  const stages = document.querySelectorAll('.motion-stage');

  if (!pillBtns.length || !slider) return;

  function updateSliderPosition(btn) {
    const parentRect = btn.parentElement.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const left = btnRect.left - parentRect.left;
    const width = btnRect.width;

    slider.style.left = `${left}px`;
    slider.style.width = `${width}px`;
  }

  // Set initial slider position on active button
  const initialActive = document.querySelector('.nav-pill-btn.active');
  if (initialActive) updateSliderPosition(initialActive);

  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateSliderPosition(btn);

      const targetId = btn.getAttribute('data-target');
      switchStage(targetId);
    });
  });

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-pill-btn.active');
    if (currentActive) updateSliderPosition(currentActive);
  });
}

function switchStage(targetId) {
  const stages = document.querySelectorAll('.motion-stage');
  stages.forEach(s => {
    s.classList.remove('active');
  });

  const targetStage = document.getElementById(targetId);
  if (targetStage) {
    targetStage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Also update navbar active state if triggered from hero button
  const matchingPill = document.querySelector(`.nav-pill-btn[data-target="${targetId}"]`);
  if (matchingPill) {
    const pillBtns = document.querySelectorAll('.nav-pill-btn');
    pillBtns.forEach(b => b.classList.remove('active'));
    matchingPill.classList.add('active');

    const slider = document.getElementById('nav-slider');
    if (slider) {
      const parentRect = matchingPill.parentElement.getBoundingClientRect();
      const btnRect = matchingPill.getBoundingClientRect();
      slider.style.left = `${btnRect.left - parentRect.left}px`;
      slider.style.width = `${btnRect.width}px`;
    }
  }
}

/* 2. Category Tab Button Swap (Story Chapter) */
function initCategorySwapTabs() {
  const swapBtns = document.querySelectorAll('.swap-btn');
  const panels = document.querySelectorAll('.swap-panel');

  swapBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swapBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/* 3. Skills Category Filter Swap */
function initSkillFilterSwap() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const cards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 4. Motion Particle Canvas */
function initMotionCanvas() {
  const canvas = document.getElementById('motion-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 15), 65);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(121, 40, 202, ',
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* 5. Custom Follower Cursor */
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

/* 6. Typewriter Effect */
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

/* 7. 3D Tilt Card */
function initTiltCard() {
  const card = document.getElementById('tilt-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -12;
    const rotY = (x / (rect.width / 2)) * 12;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* 8. Project Detail Modal System */
function initModalSystem() {
  const overlay = document.getElementById('modal-overlay');
  const titleElem = document.getElementById('modal-title');
  const descElem = document.getElementById('modal-desc');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay || !titleElem || !descElem) return;

  const triggers = document.querySelectorAll('.btn-modal-trigger');
  triggers.forEach(t => {
    t.addEventListener('click', () => {
      const title = t.getAttribute('data-title');
      const desc = t.getAttribute('data-desc');

      titleElem.textContent = title;
      descElem.textContent = desc;

      overlay.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}
