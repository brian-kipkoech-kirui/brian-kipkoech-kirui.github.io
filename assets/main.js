(function(){
  const username = 'brian-kipkoech-kirui';
  async function fetchRepos(){
    try{
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      if(!res.ok) throw new Error('GitHub API error');
      const repos = await res.json();
      renderRepos(repos);
    }catch(e){
      console.error(e);
      document.getElementById('repos-list').innerHTML = '<p class="muted">Unable to fetch repositories — rate limits or network issue.</p>';
    }
  }

  function renderRepos(repos){
    const container = document.getElementById('repos-list');
    container.innerHTML = '';
    // Filter out the pages repo since this site is hosted there
    repos.sort((a,b)=> new Date(b.updated_at)-new Date(a.updated_at));
    repos.forEach(r=>{
      const el = document.createElement('article');
      el.className = 'repo-card';
      el.innerHTML = `
        <h4><a href="${r.html_url}" target="_blank" rel="noreferrer">${r.name}</a></h4>
        <div class="repo-meta">${r.language || ''} ${r.stargazers_count? '• ★'+r.stargazers_count : ''}</div>
        <p class="muted">${r.description || ''}</p>
      `;
      container.appendChild(el);
    });
  }

  // wire download cv: if docs/CV.pdf missing, point to docs/CV.md
  async function checkCV(){
    try{
      const res = await fetch('/docs/CV.pdf', {method:'HEAD'});
      if(!res.ok){
        document.getElementById('download-cv').href = '/docs/CV.md';
      }
    }catch(e){
      document.getElementById('download-cv').href = '/docs/CV.md';
    }
  }

  fetchRepos();
  checkCV();
})();
