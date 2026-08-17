// Praveenraja P Portfolio Interactivity, Typewriter, 3D Card Tilt, & Command Palette Engine

const RESUME_DATA = {
  name: "Praveenraja P",
  title: "AI & Data Science Engineer",
  education: "B.Tech in Artificial Intelligence And Data Science, JKKM College of Technology (CGPA: 8.80)",
  contact: {
    phone: "7603835392",
    email: "Praveenrajapaids23@jkkmct.edu.in",
    location: "Coimbatore, Tamil Nadu"
  },
  skills: [
    "Python", "Java", "DSA", "Machine Learning", "Deep Learning", 
    "Generative AI", "Prompt Engineering", "Code Generation & Debugging", 
    "Rapid Prototyping", "GitHub", "VS Code", "Windsurf", "Figma", "Windows OS"
  ],
  internships: [
    "Cloud Computing Intern @ Coriza (Jun 2026)",
    "Generative AI Intern @ CISPRO, Coimbatore (Jun 2025 – Jul 2025)",
    "Machine Learning Intern @ Tech World, Coimbatore (Jan 2025 – Feb 2025)",
    "Python Developer Intern @ CISPRO, Coimbatore (Jun 2024 – Jul 2024)"
  ],
  projects: [
    {
      title: "Zamin X",
      subtitle: "Tamper-Proof Land Ownership & Dispute Resolution System",
      tech: ["Python", "Streamlit", "Blockchain", "Folium", "JSON"],
      details: "Developed a secure digital land registration and ownership management system using blockchain technology. Includes land registration, ownership transfer, GST payment tracking, and map-based land visualization to eliminate land disputes and data tampering."
    },
    {
      title: "CopBot",
      subtitle: "AI-Based FIR & Legal Query System",
      tech: ["Python", "HTML", "CSS", "JavaScript", "Generative AI"],
      details: "Built an AI-powered chatbot for legal assistance, public grievance handling, and automated FIR registration using Generative AI and prompt engineering techniques to deliver ultra-fast public support."
    },
    {
      title: "Marine Domain Awareness System",
      subtitle: "Ship Detection & Movement Tracking System",
      tech: ["Python", "Deep Learning", "Computer Vision"],
      details: "Implemented ship detection and movement tracking using Deep Learning and computer vision techniques for maritime surveillance and real-time security."
    }
  ],
  achievements: [
    "Class Topper (2025)",
    "Project Expo Winner (2025)",
    "Student Head – Institution Innovation Council (IIC)",
    "Participated in 15+ symposium presentations, 5 project expos, and 3 hackathons",
    "Niral Thiruvizha 3.0 Top 500 Teams"
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCustomCursor();
  initTypewriter();
  init3DProfileTilt();
  initCommandPalette();
  initSkillsFilter();
  initProjectModals();
  initAIChat();
  initContactActions();
});

// 1. Custom Pointer Cursor
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
  });

  const hoverTargets = document.querySelectorAll('a, button, .glass-card, .filter-btn, .cmd-item');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => ring.classList.add('active'));
    target.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

// 2. Typewriter Effect for Hero Roles
function initTypewriter() {
  const element = document.getElementById('typewriterText');
  if (!element) return;

  const phrases = [
    "AI & DATA SCIENCE ENGINEER",
    "GENERATIVE AI DEVELOPER",
    "BLOCKCHAIN ARCHITECT",
    "COMPUTER VISION INNOVATOR"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      element.textContent = currentPhrase.substring(0, charIdx);
    } else {
      charIdx++;
      element.textContent = currentPhrase.substring(0, charIdx);
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(typeStep, delay);
  }

  typeStep();
}

// 3. 3D Tilt Effect on Hero Profile Card
function init3DProfileTilt() {
  const card = document.getElementById('profileCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (-y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// 4. Command Palette (Ctrl + K)
function initCommandPalette() {
  const triggerBtn = document.getElementById('cmdTriggerBtn');
  const modal = document.getElementById('cmdPaletteModal');
  const input = document.getElementById('cmdInput');
  const items = document.querySelectorAll('.cmd-item');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    input.value = '';
    input.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  triggerBtn?.addEventListener('click', openModal);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('active') ? closeModal() : openModal();
    } else if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  input?.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'flex' : 'none';
    });
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      const target = item.getAttribute('data-target');

      closeModal();

      if (action === 'goto' && target) {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'copy-email') {
        navigator.clipboard.writeText(RESUME_DATA.contact.email);
        alert('Email address copied to clipboard!');
      } else if (action === 'launch-ai') {
        document.getElementById('ai-chat-box')?.classList.add('open');
      }
    });
  });
}

// 5. Navbar Scroll Effects
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// 6. Skills Matrix Filter
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card-hud');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden-skill');
        } else {
          card.classList.add('hidden-skill');
        }
      });
    });
  });
}

// 7. Project Architecture Modals
function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalBody = document.getElementById('modal-body');
  const modalTech = document.getElementById('modal-tech');
  const closeBtn = document.querySelector('.modal-close');

  if (!modalOverlay) return;

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const project = RESUME_DATA.projects[projId];

      if (project) {
        modalTitle.textContent = project.title;
        modalSubtitle.textContent = project.subtitle;
        modalBody.textContent = project.details;
        modalTech.innerHTML = project.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
        modalOverlay.classList.add('active');
      }
    });
  });

  closeBtn?.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

// 8. AI Chatbot Assistant Engine
function initAIChat() {
  const trigger = document.getElementById('ai-trigger');
  const chatBox = document.getElementById('ai-chat-box');
  const closeChat = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const promptBtns = document.querySelectorAll('.prompt-btn');

  if (!trigger || !chatBox) return;

  trigger.addEventListener('click', () => {
    chatBox.classList.toggle('open');
  });

  closeChat?.addEventListener('click', () => {
    chatBox.classList.remove('open');
  });

  function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function generateAIResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('project') || q.includes('zamin') || q.includes('copbot') || q.includes('marine')) {
      return `Praveenraja has developed 3 key AI & Tech projects:
1. Zamin X: Blockchain Land Ownership & Dispute Resolution (Python, Streamlit, Folium).
2. CopBot: AI-Powered Legal FIR & Query Chatbot (Generative AI, HTML/CSS/JS).
3. Marine Domain Awareness: Deep Learning ship detection & maritime visual surveillance.`;
    }

    if (q.includes('skill') || q.includes('technolog') || q.includes('python') || q.includes('machine learning')) {
      return `Praveenraja's core skills include:
- Programming: Python, Java, Data Structures & Algorithms (DSA).
- AI & ML: Machine Learning, Deep Learning, Generative AI, Prompt Engineering.
- Tools: VS Code, Windsurf, Figma, GitHub, AI Code Generation & Refactoring.`;
    }

    if (q.includes('intern') || q.includes('experience') || q.includes('work') || q.includes('company')) {
      return `Praveenraja has completed 4 specialized technical internships:
- Cloud Computing Intern @ Coriza (Jun 2026)
- Generative AI Intern @ CISPRO (Jun-Jul 2025)
- Machine Learning Intern @ Tech World (Jan-Feb 2025)
- Python Developer Intern @ CISPRO (Jun-Jul 2024)`;
    }

    if (q.includes('education') || q.includes('college') || q.includes('cgpa') || q.includes('marks')) {
      return `Education details:
- B.Tech in AI & Data Science at JKKM College of Technology (CGPA: 8.80, Graduating June 2027).
- SSLC: 76% (2020) | HSC: 79% (2022).
- Academic Honors: Class Topper (2025), Student Head at Institution Innovation Council (IIC).`;
    }

    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
      return `You can contact Praveenraja P directly:
- Email: Praveenrajapaids23@jkkmct.edu.in
- Phone: +91 7603835392
- Location: Coimbatore, Tamil Nadu`;
    }

    if (q.includes('achievement') || q.includes('award') || q.includes('expo') || q.includes('niral')) {
      return `Key Achievements:
- Class Topper (2025) & Project Expo Winner (2025)
- Student Head - Institution Innovation Council (IIC)
- Niral Thiruvizha 3.0 Top 500 Teams
- Participated in 15+ symposium presentations, 5 project expos, and 3 hackathons!`;
    }

    return `I am Praveenraja's AI Assistant! You can ask me about his AI/ML projects (Zamin X, CopBot, Marine Awareness), Technical Skills, Internships, Academic Scores (8.80 CGPA), or Contact info!`;
  }

  function handleUserSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    chatInput.value = '';

    setTimeout(() => {
      const botReply = generateAIResponse(text);
      addMessage('bot', botReply);
    }, 400);
  }

  chatSend?.addEventListener('click', handleUserSend);
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserSend();
  });

  promptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const promptText = btn.getAttribute('data-prompt');
      chatInput.value = promptText;
      handleUserSend();
    });
  });
}

// 9. Contact Copy Actions
function initContactActions() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const origText = btn.textContent;
        btn.textContent = 'COPIED!';
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = '#000';
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    });
  });
}
