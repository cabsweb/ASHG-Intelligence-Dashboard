const state={manifest:null,year:null,signals:[],theme:'All',priority:'all',query:''};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z]+/g,'-').replace(/(^-|-$)/g,'');

function grouped(){return state.signals.reduce((a,s)=>(a[s.theme]=(a[s.theme]||0)+1,a),{})}
function filtered(){const q=state.query.toLowerCase();return state.signals.filter(s=>(state.theme==='All'||s.theme===state.theme)&&(state.priority==='all'||s.priority===state.priority)&&(!q||[s.title,s.theme,s.evidence,s.implication,s.action,s.session].join(' ').toLowerCase().includes(q)))}
function annual(year){return state.manifest.years.find(item=>item.year===Number(year))}

function renderYearOptions(){
  $('#yearSelect').innerHTML=state.manifest.years.map(item=>`<option value="${item.year}">${item.year}</option>`).join('');
  $('#yearSelect').value=String(state.year.year);
}

function titleMarkup(item){
  if(!item.titleAccent)return esc(item.title);
  const start=item.title.lastIndexOf(item.titleAccent);
  return `${esc(item.title.slice(0,start))}<span>${esc(item.titleAccent)}</span>`;
}

function updateHero(item){
  document.title=`ASHG ${item.year} Intelligence | CABS`;
  $('#heroEyebrow').innerHTML=`<span class="live-dot"></span>${esc(item.eyebrow)}`;
  $('#heroTitle').innerHTML=titleMarkup(item);
  $('#heroLede').textContent=item.lede;
  $('#heroMeta').innerHTML=`<span>${esc(item.eventDate)}</span> · <span>${esc(item.location)}</span> · <span>${item.status==='published'?'Updated ':''}${esc(item.updated)}</span>`;
  $('#officialLink').href=item.officialUrl;
  const published=item.status==='published';
  $('#exploreLink').href=published?'#signals':'#yearNotice';
  $('#exploreLink').innerHTML=published?'Explore signals <span>→</span>':'View coverage plan <span>→</span>';
  $('.topbar nav').hidden=!published;
  if(published){
    $('#heroPanel').setAttribute('aria-label','Meeting scale');
    $('#heroPanel').innerHTML=`<div class="panel-head"><span>Meeting scale</span><span class="status">Official</span></div><div class="kpi-grid">${item.scale.map(k=>`<div><strong>${esc(k.value)}</strong><span>${esc(k.label)}</span></div>`).join('')}</div><div class="signal-strip"><span>Signal density</span><div class="mini-bars" id="miniBars" aria-label="Signal count by theme"></div></div><p class="panel-note">Scale figures reported by ASHG. Signal counts reflect this dashboard’s curated dataset—not the full program.</p>`;
  }else{
    $('#heroPanel').setAttribute('aria-label',`${item.year} coverage status`);
    $('#heroPanel').innerHTML=`<div class="panel-head"><span>Coverage status</span><span class="status">${esc(item.statusLabel)}</span></div><div class="coverage-panel"><span>${esc(item.phase)}</span><strong>${item.year}</strong><p>${esc(item.nextMilestone)}</p></div>`;
  }
}

function renderNotice(item){
  const notice=$('#yearNotice');
  const published=item.status==='published';
  notice.hidden=published;
  $$('.annual-content').forEach(section=>section.hidden=!published);
  if(published)return;
  notice.innerHTML=`<div class="year-notice-inner"><p class="section-kicker">Annual coverage roadmap</p><h2>${esc(item.statusLabel)}</h2><p class="notice-lede">${esc(item.lede)}</p><div class="coverage-grid"><div><span>Meeting</span><strong>${esc(item.eventDate)}<br>${esc(item.location)}</strong></div><div><span>Current phase</span><strong>${esc(item.phase)}</strong></div><div><span>Next milestone</span><strong>${esc(item.nextMilestone)}</strong></div></div><p class="archive-process"><strong>Continuous-update model:</strong> every year receives its own source ledger and signal dataset. Published years remain accessible while new evidence is added through the annual manifest—without redesigning the dashboard.</p></div>`;
}

function renderReadout(item){
  $('#briefGrid').innerHTML=item.readout.map((row,index)=>`<article><span class="ordinal">${String(index+1).padStart(2,'0')}</span><h3>${esc(row.title)}</h3><p>${esc(row.body)}</p></article>`).join('');
}

function renderSources(item){
  $('#sourceGrid').innerHTML=item.sources.map((source,index)=>`<a href="${esc(source.url)}" target="_blank" rel="noreferrer"><span>${String(index+1).padStart(2,'0')} · ${esc(source.type)}</span><strong>${esc(source.title)}</strong><p>${esc(source.description)}</p><b>Open source ↗</b></a>`).join('');
}

function renderFilters(){
  const themes=['All',...Object.keys(grouped())];
  $('#themeFilters').innerHTML=themes.map(t=>`<button type="button" class="${t===state.theme?'active':''}" data-theme="${esc(t)}" aria-pressed="${t===state.theme}">${esc(t)}</button>`).join('');
  $$('#themeFilters button').forEach(b=>b.addEventListener('click',()=>{state.theme=b.dataset.theme;renderFilters();renderSignals()}));
}

function renderSignals(){
  const rows=filtered();
  $('#resultCount').textContent=rows.length;
  $('#emptyState').hidden=rows.length>0;
  $('#signalGrid').innerHTML=rows.map(s=>`<article class="signal-card"><div class="card-top"><span class="tag">${esc(s.theme)}</span><span class="priority ${slug(s.priority)}">${esc(s.priority)}</span></div><h3>${esc(s.title)}</h3><p class="evidence">${esc(s.evidence)}</p><div class="insight"><strong>Why it matters</strong>${esc(s.implication)}</div><div class="insight"><strong>Suggested move</strong>${esc(s.action)}</div><div class="card-footer"><span>${esc(s.day)}<br>${esc(s.session)}</span><a href="${esc(s.source)}" target="_blank" rel="noreferrer" aria-label="Open ${esc(s.sourceLabel)} source for ${esc(s.title)}">Source ↗</a></div></article>`).join('');
}

function renderThemes(){
  const groups=grouped(),max=Math.max(...Object.values(groups));
  $('#themeChart').innerHTML=Object.entries(groups).sort((a,b)=>b[1]-a[1]).map(([name,count])=>`<div class="theme-row"><label>${esc(name)}</label><div class="track"><div class="fill" style="width:${count/max*100}%"></div></div><b>${count}</b></div>`).join('');
  $('#miniBars').innerHTML=Object.values(groups).map((n,i)=>`<i style="height:${12+n*10}px;opacity:${.58+i*.07}"></i>`).join('');
}

function setupTheme(){
  const saved=localStorage.getItem('ashg-theme');
  if(saved)document.documentElement.dataset.theme=saved;
  $('#themeToggle').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem('ashg-theme',next)});
}

async function loadYear(item,{updateUrl=true}={}){
  state.year=item;state.signals=[];state.theme='All';state.priority='all';state.query='';
  $('#searchInput').value='';$('#priorityFilter').value='all';$('#yearSelect').value=String(item.year);
  if(updateUrl){const url=new URL(location.href);url.searchParams.set('year',item.year);history.replaceState({},'',url)}
  updateHero(item);renderNotice(item);
  if(item.status!=='published')return;
  const response=await fetch(item.data);
  if(!response.ok)throw new Error(`Signal data returned HTTP ${response.status}`);
  state.signals=await response.json();
  renderReadout(item);renderSources(item);renderFilters();renderSignals();renderThemes();
}

async function init(){
  setupTheme();
  try{
    const response=await fetch('data/years.json');
    if(!response.ok)throw new Error(`Year manifest returned HTTP ${response.status}`);
    state.manifest=await response.json();
    const requested=Number(new URL(location.href).searchParams.get('year'));
    state.year=annual(requested)||annual(state.manifest.defaultYear);
    renderYearOptions();
    $('#yearSelect').addEventListener('change',()=>loadYear(annual($('#yearSelect').value)));
    $('#searchInput').addEventListener('input',e=>{state.query=e.target.value.trim();renderSignals()});
    $('#priorityFilter').addEventListener('change',e=>{state.priority=e.target.value;renderSignals()});
    await loadYear(state.year,{updateUrl:false});
  }catch(error){
    $('#signalGrid').innerHTML=`<div class="empty-state"><strong>Dashboard data unavailable</strong><span>${esc(error.message)}</span></div>`;
    console.error(error);
  }
}
init();
