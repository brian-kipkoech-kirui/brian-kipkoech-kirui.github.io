(function(){
  const username = 'brian-kipkoech-kirui';
  const cvCandidates = [
    '/docs/CV.pdf',
    '/docs/KIPKOECH_BRIAN_FlowCV_Resume_2026-10-02%20(2).pdf',
    '/docs/KIPKOECH_BRIAN_FlowCV_Resume_2026-10-02%20(2).pdf'
  ];

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
    if(!container) return;
    container.innerHTML = '';
    repos.sort((a,b)=> new Date(b.updated_at)-new Date(a.updated_at));
    repos.forEach(r=>{
      const el = document.createElement('article');
      el.className = 'repo-card';
      el.innerHTML = `
        <h4><a href="${r.html_url}" target="_blank" rel="noreferrer">${r.name}</a></h4>
        <div class="repo-meta">${r.language || ''} ${r.stargazers_count ? '• ★'+r.stargazers_count : ''}</div>
        <p class="muted">${r.description || ''}</p>
      `;
      container.appendChild(el);
    });
  }

  async function resolveExistingAsset(urls){
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) return url;
      } catch (e) {
        // keep trying candidate URLs
      }
    }
    return urls[0];
  }

  async function initCVLink(){
    const cvBtn = document.getElementById('download-cv');
    if (!cvBtn) return;
    const resolvedUrl = await resolveExistingAsset(cvCandidates);
    cvBtn.href = resolvedUrl;
    cvBtn.setAttribute('target', '_blank');
    cvBtn.setAttribute('rel', 'noreferrer');
  }

  fetchRepos();
  initCVLink();
})();
