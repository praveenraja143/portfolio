// Portfolio 2: Interactive Cyberpunk Terminal CLI Engine

document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
});

function initTerminal() {
  const input = document.getElementById('term-input');
  const history = document.getElementById('term-history');
  const consoleBody = document.getElementById('console-body');
  const clearBtn = document.getElementById('clear-term-btn');
  const chipBtns = document.querySelectorAll('.chip-btn');

  if (!input || !history) return;

  const COMMANDS = {
    help: `
Available Commands:
  • <span class="neon-cyan">bio</span>          : View Praveenraja's summary & academic profile
  • <span class="neon-cyan">skills</span>       : List AI, ML, Python, Java & Blockchain technical skills
  • <span class="neon-cyan">internships</span>  : Display 4 technical internship details (Coriza, CISPRO, Tech World)
  • <span class="neon-cyan">projects</span>     : Inspect Zamin X, CopBot & Marine Domain Awareness System
  • <span class="neon-cyan">achievements</span> : View awards, 8.80 CGPA rank 1, Niral Thiruvizha Top 500
  • <span class="neon-cyan">contact</span>      : Email, phone, location & GitHub repository links
  • <span class="neon-cyan">clear</span>        : Clear the terminal output buffer
`,
    bio: `
<span class="neon-green">=== PRAVEENRAJA P - AI ENGINEER PROFILE ===</span>
• Degree     : B.Tech in Artificial Intelligence and Data Science
• Institution: JKKM College of Technology (2023 - 2027)
• Performance: <span class="neon-cyan">8.80 CGPA</span> (Class Topper 2025)
• Focus      : Generative AI, LLMs, Computer Vision, Smart Contracts, Rapid Prototyping
`,
    skills: `
<span class="neon-green">=== TECHNICAL SKILL MATRIX ===</span>
[AI & ML]    : Generative AI, LLM Prompt Engineering, Computer Vision, OpenCV, Deep Learning
[CORE CODE]  : Python (Expert), Java (Intermediate+), Data Structures & Algorithms
[BLOCKCHAIN] : Tamper-Proof Land Ownership (Zamin X), Smart Contracts, Folium Maps
[DEV TOOLS]  : Git, GitHub, VS Code, Windsurf, Streamlit, Linux/Windows OS
`,
    internships: `
<span class="neon-green">=== 4 TECHNICAL INTERNSHIPS ===</span>
1. <span class="neon-cyan">Cloud Computing Intern @ Coriza</span> [Jun 2026]
   - Cloud pipeline architecture, serverless deployment, scalable infrastructure.
2. <span class="neon-cyan">Generative AI Intern @ CISPRO, Coimbatore</span> [Jun 2025 – Jul 2025]
   - Prompt engineering workflows, GenAI chatbot integration & AI legal query logic.
3. <span class="neon-cyan">Machine Learning Intern @ Tech World, Coimbatore</span> [Jan 2025 – Feb 2025]
   - Dataset preprocessing, predictive modeling, regression/classification algorithms.
4. <span class="neon-cyan">Python Developer Intern @ CISPRO, Coimbatore</span> [Jun 2024 – Jul 2024]
   - Modular Python backend scripts, automated file system parsers & UI integration.
`,
    projects: `
<span class="neon-green">=== FEATURED PROJECT SHOWCASE ===</span>
1. <span class="neon-cyan">Zamin X</span> - Land Ownership & Dispute Resolution System
   - Tech: Python, Streamlit, Blockchain, Folium Maps, JSON
   - Overview: Blockchain-backed land registry eliminating dispute delays and fraud.

2. <span class="neon-cyan">CopBot</span> - AI FIR & Legal Assistant
   - Tech: Generative AI, Prompt Engineering, JavaScript, Python
   - Overview: Instant AI public legal query resolution and automated FIR registration.

3. <span class="neon-cyan">Marine Domain Awareness System</span>
   - Tech: Deep Learning, Computer Vision, OpenCV, Python
   - Overview: Vessel movement detection and maritime coastline security tracking.
`,
    achievements: `
<span class="neon-green">=== HONORS & MILESTONES ===</span>
🏆 Class Topper 2025 (8.80 CGPA)
🏆 Winner - State Level Project Exposition 2025
🏆 Top 500 Teams - Niral Thiruvizha 3.0 Hackathon
🏆 Student Head - Institution Innovation Council (IIC)
🏆 Participated in 15+ Technical Symposium Presentations & 5 Expos
`,
    contact: `
<span class="neon-green">=== CONTACT INFORMATION ===</span>
📧 Email    : <a href="mailto:Praveenrajapaids23@jkkmct.edu.in" class="neon-cyan">Praveenrajapaids23@jkkmct.edu.in</a>
📱 Phone    : <a href="tel:+917603835392" class="neon-green">+91 7603835392</a>
📍 Location : Coimbatore, Tamil Nadu, India
💻 GitHub   : <a href="https://github.com/praveenraja143" target="_blank" class="neon-violet">https://github.com/praveenraja143</a>
`
  };

  function executeCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();

    // Create prompt line in history
    const promptLine = document.createElement('div');
    promptLine.className = 'term-line';
    promptLine.innerHTML = `<span class="term-prompt">praveenraja@ai-core:~$</span> ${cmd}`;
    history.appendChild(promptLine);

    if (trimmed === 'clear') {
      history.innerHTML = '';
    } else if (COMMANDS[trimmed]) {
      const outputLine = document.createElement('div');
      outputLine.className = 'term-line';
      outputLine.innerHTML = COMMANDS[trimmed];
      history.appendChild(outputLine);
    } else if (trimmed !== '') {
      const errorLine = document.createElement('div');
      errorLine.className = 'term-line';
      errorLine.innerHTML = `<span style="color: #ef4444;">Command not recognized: '${cmd}'. Type <span class="neon-green">'help'</span> for available commands.</span>`;
      history.appendChild(errorLine);
    }

    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      history.innerHTML = '';
    });
  }

  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}
