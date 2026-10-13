(function(){
  const username = 'brian-kipkoech-kirui';

  const explorerData = {
    ingestion: {
      title: 'Ingestion Layer',
      status: 'Complete',
      description: 'Normalizes market observations and records provenance for reliable replay.',
      points: ['Provider adapters', 'Normalized records', 'Deterministic replay'],
      links: ['https://github.com/brian-kipkoech-kirui/Synthia', '/projects/synthia.html']
    },
    fabric: {
      title: 'Financial Data Fabric',
      status: 'In progress',
      description: 'Validates and structures raw market inputs into a clean, queryable knowledge layer.',
      points: ['Validation', 'Deduplication', 'Freshness labels'],
      links: ['https://github.com/brian-kipkoech-kirui/Synthia', '/projects/synthia.html']
    },
    worldstate: {
      title: 'WorldState Core',
      status: 'Active',
      description: 'C++ core modelling entities and observations with deterministic playback for testing.',
      points: ['Native C++ model', 'Replayable sessions', 'Knowledge entities'],
      links: ['https://github.com/brian-kipkoech-kirui/Synthia', '/projects/synthia.html']
    },
    observatory: {
      title: 'Observatory',
      status: 'Available',
      description: 'Browser view of state through JSON APIs and simple controls.',
      points: ['HTTP API', 'Inspector panels', 'Control endpoints'],
      links: ['https://github.com/brian-kipkoech-kirui/Synthia', '/projects/synthia.html']
    },
    roadmap: {
      title: 'Roadmap',
      status: 'Planned',
      description: 'Planned: advanced analytics, portfolio tools, and richer model labs.',
      points: ['Valuation models', 'Portfolio logic', 'Model labs'],
      links: ['https://github.com/brian-kipkoech-kirui/Synthia', '/projects/synthia.html']
    }
  };

  const knowledge = {
    defaultResponse: 'I can help with a short summary of projects, how I fit into teams, or give recruiter-friendly actions like downloading the CV or contact info. Try asking about "top projects" or "team fit".',
    keywords: [
      {
        keys: ['project', 'projects', 'portfolio', 'work'],
        response: 'I work across systems engineering, full-stack AI, and data engineering. Highlights include deterministic systems, AI prototypes, and production-facing dashboards. See the Selected Work section for a short list.'
      },
      {
        keys: ['assistant', 'ai professional assistant', 'interactive'],
        response: 'The interactive product demo on this page shows how a grounded assistant can answer recruiter and product questions using the portfolio and CV. It demonstrates clear communication and product thinking.'
      },
      {
        keys: ['team fit', 'fit', 'role', 'position'],
        response: 'I deliver practical systems that align with product goals: reliable backends, clear data pipelines, and product-aware AI features. I like to work with teams that value testable systems and clear measurements of success.'
      },
      {
        keys: ['synthia'],
        response: 'SYNTHIA is a systems project for financial data ingestion and deterministic replay. It is one example of my systems engineering work; the portfolio includes several other projects as well.'
      },
      {
        keys: ['experience', 'work', 'career'],
        response: 'Experience includes student systems support, platform automation, and freelance full-stack work. I focus on measurable improvements and reliable delivery.'
      },
      {
        keys: ['education', 'degree', 'msc', 'university'],
        response: 'I am pursuing MSc Financial Engineering at WorldQuant University and hold a BSc in Computer Technology from Multimedia University.'
      },
      {
        keys: ['contact', 'email', 'phone'],
        response: 'Email: kirui.kipkoech@proton.me | Phone: +254 718032380 — use the Download CV button for a full resume and the Certificates link for credentials.'
      },
      {
        keys: ['cv', 'resume'],
        response: 'Download the CV using the Download CV button or from the docs folder in this repository.'
      }
    ]
  };

  function addAssistantMessage(text, isUser = false) {
    const body = document.getElementById('assistant-body');
    if (!body) return;
    const msg = document.createElement('div');
    msg.className = `message ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function answerQuestion(question) {
    const text = question.toLowerCase();
    const match = knowledge.keywords.find(item => item.keys.some(key => text.includes(key)));
    return match ? match.response : knowledge.defaultResponse;
  }

  function initAssistant() {
    const form = document.getElementById('assistant-form');
    const input = document.getElementById('assistant-input');
    if (!form || !input) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      addAssistantMessage(value, true);
      input.value = '';
      setTimeout(() => addAssistantMessage(answerQuestion(value), false), 220);
    });

    document.querySelectorAll('.chip').forEach(button => {
      button.addEventListener('click', function() {
        const target = button.dataset.target;
        const q = button.dataset.question;
        // If the chip includes a data-target, scroll to that section
        if (target) {
          const el = document.querySelector(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // also show a short assistant message for context
            addAssistantMessage(q, true);
            setTimeout(() => addAssistantMessage(answerQuestion(q), false), 220);
            return;
          }
        }
        // fallback: fill input and submit
        input.value = q;
        form.dispatchEvent(new Event('submit'));
      });
    });
  }

  function appendTerminalLine(text) {
    const screen = document.getElementById('terminal-screen');
    if (!screen) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    screen.appendChild(line);
  }

  function handleTerminalCommand(raw) {
    const command = raw.trim().toLowerCase();
    const screen = document.getElementById('terminal-screen');
    const outputBox = document.getElementById('terminal-output');
    const terminalOverlay = document.getElementById('terminal-overlay');

    if (!command) return;

    const commands = {
      help: 'Available commands: help, projects, skills, experience, education, assistant, contact, cv',
      projects: 'Opening projects...',
      skills: 'Opening skills...',
      experience: 'Opening experience...',
      education: 'Opening education...',
      assistant: 'Focusing the interactive assistant...',
      contact: 'Opening contact section...',
      cv: 'Opening CV in a new tab...'
    };

    if (screen) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.textContent = `brian@portfolio:~$ ${raw}`;
      screen.appendChild(line);
      const result = document.createElement('div');
      result.className = 'terminal-line';
      result.textContent = commands[command] || `Command not found: ${raw}. Try: help, projects, assistant, contact`;
      screen.appendChild(result);
      screen.scrollTop = screen.scrollHeight;
    }

    if (outputBox) {
      const line = document.createElement('div');
      line.textContent = `> ${raw}`;
      outputBox.appendChild(line);
      const result = document.createElement('div');
      result.textContent = commands[command] || `Command not found: ${raw}. Try: help, projects, assistant, contact`;
      outputBox.appendChild(result);
      outputBox.scrollTop = outputBox.scrollHeight;
    }

    const map = {
      projects: '#projects',
      skills: '#skills',
      experience: '#experience',
      education: '#experience',
      assistant: '#workspace',
      contact: '#contact',
      cv: '/docs/KIPKOECH_BRIAN_FlowCV_Resume_2026-10-02%20(2).pdf'
    };

    if (map[command]) {
      if (command === 'cv') {
        window.open(map[command], '_blank', 'noreferrer');
      } else {
        const target = document.querySelector(map[command]);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    if (terminalOverlay) {
      terminalOverlay.classList.add('hidden');
    }
  }

  function initTerminal() {
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const popupForm = document.getElementById('terminal-popup-form');
    const popupInput = document.getElementById('terminal-popup-input');
    const overlay = document.getElementById('terminal-overlay');
    const toggle = document.getElementById('terminal-toggle');

    function openTerminal() {
      if (overlay) overlay.classList.remove('hidden');
      setTimeout(() => (popupInput || input)?.focus(), 50);
    }

    if (toggle) toggle.addEventListener('click', openTerminal);
    if (overlay) {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) overlay.classList.add('hidden');
      });
    }

    if (form && input) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleTerminalCommand(input.value);
        input.value = '';
      });
    }

    if (popupForm && popupInput) {
      popupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleTerminalCommand(popupInput.value);
        popupInput.value = '';
      });
    }

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openTerminal();
      }
      if (e.key === 'Escape' && overlay) {
        overlay.classList.add('hidden');
      }
    });
  }

  function initExplorer() {
    const buttons = document.querySelectorAll('.explorer-node');
    const titleEl = document.getElementById('explorer-title');
    const statusEl = document.getElementById('explorer-status');
    const descEl = document.getElementById('explorer-description');
    const pointsEl = document.getElementById('explorer-points');
    const linksEl = document.querySelector('.explorer-links');

    if (!buttons.length || !titleEl || !statusEl || !descEl || !pointsEl || !linksEl) return;

    function render(nodeKey) {
      const data = explorerData[nodeKey];
      if (!data) return;
      titleEl.textContent = data.title;
      statusEl.textContent = `Status: ${data.status}`;
      descEl.textContent = data.description;
      pointsEl.innerHTML = data.points.map(item => `<li>${item}</li>`).join('');
      linksEl.innerHTML = `
        <a href="${data.links[0]}" target="_blank" rel="noreferrer">View source</a>
        <a href="${data.links[1]}">Technical details</a>
      `;
      buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.node === nodeKey));
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => render(btn.dataset.node));
    });
  }

  function computeBlackScholes(spot, strike, vol, rate, time) {
    const sigma = vol;
    const s = spot;
    const k = strike;
    const r = rate;
    const t = time;
    const sqrtT = Math.sqrt(t);
    const d1 = (Math.log(s / k) + (r + 0.5 * sigma * sigma) * t) / (sigma * sqrtT);
    const d2 = d1 - sigma * sqrtT;
    const nd1 = normalCDF(d1);
    const nd2 = normalCDF(d2);
    const call = s * nd1 - k * Math.exp(-r * t) * nd2;
    const put = k * Math.exp(-r * t) * (1 - nd2) - s * (1 - nd1);
    return { call, put };
  }

  function normalCDF(x) {
    const z = x / Math.sqrt(2);
    return 0.5 * (1 + erf(z));
  }

  function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
    return sign * y;
  }

  function initQuantLab() {
    const bsForm = document.getElementById('bs-form');
    const bsResult = document.getElementById('bs-result');
    const riskForm = document.getElementById('risk-form');
    const riskResult = document.getElementById('risk-result');

    if (bsForm && bsResult) {
      bsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const spot = Number(document.getElementById('bs-spot').value || 100);
        const strike = Number(document.getElementById('bs-strike').value || 100);
        const vol = Number(document.getElementById('bs-vol').value || 0.2);
        const rate = Number(document.getElementById('bs-rate').value || 0.05);
        const time = Number(document.getElementById('bs-time').value || 1);
        const price = computeBlackScholes(spot, strike, vol, rate, time);
        bsResult.textContent = `Call price: ${price.call.toFixed(2)} | Put price: ${price.put.toFixed(2)}`;
      });
    }

    if (riskForm && riskResult) {
      riskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const exposure = Number(document.getElementById('risk-exposure').value || 1000000);
        const pd = Number(document.getElementById('risk-pd').value || 0.03);
        const lgd = Number(document.getElementById('risk-lgd').value || 0.6);
        const expectedLoss = exposure * pd * lgd;
        riskResult.textContent = `Expected Loss: ${expectedLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
      });
    }
  }

  async function renderRepos() {
    const container = document.getElementById('repos-list');
    if (!container) return;

    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      if (!res.ok) throw new Error('GitHub API error');
      const repos = await res.json();
      const ranked = repos.filter(r => !r.fork).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      container.innerHTML = ranked.map(repo => `
        <article class="repo-card">
          <h4><a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a></h4>
          <div class="repo-meta">${repo.language || 'Project'}${repo.stargazers_count ? ' • ★ ' + repo.stargazers_count : ''}</div>
          <p>${repo.description || 'Technical project and repository.'}</p>
        </article>
      `).join('');
    } catch (error) {
      container.innerHTML = '<article class="repo-card"><p>GitHub repositories could not be loaded at this moment.</p></article>';
    }
  }

  // Wire simple recruiter actions from assistant
  function wireAssistantActions() {
    const body = document.getElementById('assistant-body');
    if (!body) return;
    body.addEventListener('click', (e) => {
      const t = e.target;
      if (t.matches('.download-cv')) {
        window.open('/docs/KIPKOECH_BRIAN_FlowCV_Resume_2026-10-02%20(2).pdf', '_blank', 'noreferrer');
      }
      if (t.matches('.contact-me')) {
        window.location.href = 'mailto:kirui.kipkoech@proton.me';
      }
    });
  }

  initAssistant();
  initTerminal();
  initExplorer();
  initQuantLab();
  renderRepos();
  wireAssistantActions();
})();
