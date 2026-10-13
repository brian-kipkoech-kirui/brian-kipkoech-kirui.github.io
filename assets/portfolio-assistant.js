(() => {
  const launcher=document.getElementById('assistant-launcher'), panel=document.getElementById('portfolio-assistant');
  const close=document.getElementById('assistant-close'), form=document.getElementById('assistant-form');
  const input=document.getElementById('assistant-input'), messages=document.getElementById('assistant-messages');
  if(!launcher||!panel||!form||!input||!messages)return;
  const facts=[
    [['what does brian do','who is brian','about brian','speciali','work'],'Brian is a multidisciplinary technology professional working across software and systems development, data science and applied AI, financial engineering, and digital learning support.'],
    [['synthia','world simulation','world intelligence'],'SYNTHIA is Brian’s C++ project exploring how real-world information can be organised, connected and replayed as a consistent model of the world. Its financial data work combines market information, source history and deterministic processing. Explore it at github.com/brian-kipkoech-kirui/Synthia.'],
    [['experience','career','employment','crossover','kenyatta','sap'],'Brian works in ICT support within Kenyatta University’s ICT Directorate. Previously, he supported e-learning at the university’s DSVOL. Through Crossover, he has worked on React and Node.js applications, dashboards, e-learning tools, AI integrations, MongoDB-backed APIs and AWS serverless deployment. His experience also includes SAP Student Management and Finance modules.'],
    [['education','degree','university','qualification','msc','master'],'Brian holds a BSc in Computer Technology from Multimedia University of Kenya and is completing an MSc in Financial Engineering at WorldQuant University.'],
    [['finance','financial engineering','quant','derivative','risk','stochastic'],'His financial engineering work includes derivatives pricing, stochastic modelling, Monte Carlo simulation and risk analysis. He is also exploring how financial data and text sentiment can add context to market research.'],
    [['data science','sentiment','nlp','ai','machine learning'],'Brian explores data science and applied AI, including financial text sentiment analysis, with a focus on making data useful and understandable.'],
    [['technology','tech stack','programming','tools','language'],'His work spans C++, React, Node.js, MongoDB, AWS, data science and quantitative finance methods. The exact tools depend on the project.'],
    [['contact','email','hire','available','collaborat'],'You can reach Brian at kirui.kipkoech@proton.me. He is open to conversations about technology, collaboration and professional opportunities.'],
    [['cv','resume','résumé'],'Use the “View my CV” link near the top of this page to view or download Brian’s CV.']
  ];
  function message(value,who){const el=document.createElement('div');el.className='assistant-message '+(who==='user'?'assistant-user':'assistant-answer');el.textContent=value;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;}
  function ask(q){const clean=q.trim();if(!clean)return;message(clean,'user');const lower=clean.toLowerCase();const found=facts.find(row=>row[0].some(k=>lower.includes(k)));message(found?found[1]:'I don’t have a verified answer to that in this portfolio. Explore the page or contact Brian at kirui.kipkoech@proton.me.','answer');}
  function open(){panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');launcher.setAttribute('aria-expanded','true');input.focus();}
  function dismiss(){panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');launcher.setAttribute('aria-expanded','false');launcher.focus();}
  launcher.addEventListener('click',()=>panel.classList.contains('is-open')?dismiss():open());
  close.addEventListener('click',dismiss);
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);input.value='';input.focus();});
  panel.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('is-open'))dismiss();});
})();