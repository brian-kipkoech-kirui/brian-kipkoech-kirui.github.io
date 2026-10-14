(() => {
  const launcher = document.getElementById('assistant-launcher');
  const panel = document.getElementById('portfolio-assistant');
  const close = document.getElementById('assistant-close');
  const form = document.getElementById('assistant-form');
  const input = document.getElementById('assistant-input');
  const messages = document.getElementById('assistant-messages');

  // Accessible project filters
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project-card[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(card => {
      const categories = card.dataset.category.split(/\s+/);
      card.hidden = selected !== 'all' && !categories.includes(selected);
    });
  }));

  if (!launcher || !panel || !form || !input || !messages) return;

  const facts = [
    [['what does brian do', 'who is brian', 'about brian', 'speciali', 'work'], 'Brian is a multidisciplinary technology professional focused on software and systems development, Android and web applications, data science and applied AI, with financial engineering as a complementary area.'],
    [['android', 'mobile app', 'bizpilot', 'biz pilot'], 'Brian has public Kotlin Android projects including BizPilot, a business and social platform concept with dashboards, POS, inventory, finance and an AI assistant; Kifaru Pay, a digital finance prototype exploring wallets, payments, currency exchange, yield and credit; and Verdict, a product-trust concept with barcode scanning, receipt OCR, proof-backed reviews and anti-fraud tools. These are presented as prototypes, not released production services.'],
    [['synthia', 'world simulation', 'world intelligence'], 'SYNTHIA is Brian’s C++ project exploring how real-world information can be organised, connected and replayed as a consistent model of the world. Its financial data work includes source provenance, deterministic processing and replay. Explore it at github.com/brian-kipkoech-kirui/Synthia.'],
    [['kifaru', 'payments', 'fintech'], 'Kifaru Pay is a Kotlin Android fintech concept. Its current app structure explores wallet and transaction views, peer-to-peer and merchant payment flows, currency exchange, yield tools, credit scoring and AI-assisted credit insights. It is a prototype, not a live payment service.'],
    [['verdict', 'product review', 'receipt ocr', 'fraud'], 'Verdict is a Kotlin Android product-trust concept. Its app structure includes barcode scanning, receipt OCR, proof-backed review submission, product detail, brand protection and anti-fraud screens.'],
    [['ku myapps', 'myapps', 'university portal'], 'KU MyApps is a React and TypeScript portal hub concept for Kenyatta University digital services, bringing service links and portal-style navigation into one responsive interface.'],
    [['experience', 'career', 'employment', 'crossover', 'kenyatta'], 'Brian works in ICT support within Kenyatta University’s ICT Directorate. Previously, he supported e-learning at the university’s DSVOL. Through Crossover, he has worked on React and Node.js applications, dashboards, e-learning tools, AI integrations, MongoDB-backed APIs and AWS serverless deployment.'],
    [['education', 'degree', 'university', 'qualification', 'msc', 'master'], 'Brian holds a BSc in Computer Technology from Multimedia University of Kenya and is completing an MSc in Financial Engineering at WorldQuant University.'],
    [['finance', 'financial engineering', 'quant', 'derivative', 'risk', 'stochastic'], 'His financial engineering work includes derivatives pricing, stochastic modelling, Monte Carlo simulation and risk analysis. He is also exploring how financial data and text sentiment can add context to market research.'],
    [['data science', 'sentiment', 'nlp', 'machine learning', 'lasso'], 'Brian explores data science and applied AI, including financial text sentiment analysis, exploratory data analysis and regression modelling, with a focus on making data useful and understandable.'],
    [['technology', 'tech stack', 'programming', 'tools', 'language'], 'His work spans C++, Kotlin, Java, React, TypeScript, Node.js, Python, MongoDB, AWS, Android development and quantitative finance methods. The exact tools depend on the project.'],
    [['contact', 'email', 'hire', 'available', 'collaborat'], 'You can reach Brian at kirui.kipkoech@proton.me. He is open to conversations about technology, collaboration and professional opportunities.'],
    [['cv', 'resume', 'résumé'], 'Use the “View CV” link in the page header or the Download CV link in the contact section.']
  ];

  function addMessage(value, who) {
    const element = document.createElement('div');
    element.className = 'assistant-message ' + (who === 'user' ? 'assistant-user' : 'assistant-answer');
    element.textContent = value;
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
  }

  function ask(question) {
    const clean = question.trim();
    if (!clean) return;
    addMessage(clean, 'user');
    const lower = clean.toLowerCase();
    const match = facts.find(([keywords]) => keywords.some(keyword => lower.includes(keyword)));
    addMessage(match ? match[1] : 'I don’t have a verified answer to that in this portfolio. Explore the project cards or contact Brian at kirui.kipkoech@proton.me.', 'answer');
  }

  function openPanel() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    input.focus();
  }
  function closePanel() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  launcher.addEventListener('click', () => panel.classList.contains('is-open') ? closePanel() : openPanel());
  close.addEventListener('click', closePanel);
  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
    input.value = '';
    input.focus();
  });
  panel.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => ask(button.dataset.question)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });
})();
