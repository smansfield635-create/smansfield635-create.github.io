import {localFetch,watchWorkspace} from './local-data.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const when=v=>new Date(v).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
let busy=false,last=null;
const roots=[];
function render(d){
 const s=d.rollingStudy,totals=s.cohorts.reduce((a,c)=>({total:a.total+c.total,material:a.material+c.materialUnits,support:a.support+c.SUPPORT,unresolved:a.unresolved+c.UNRESOLVED}),{total:0,material:0,support:0,unresolved:0});
 const stale=Date.now()-Date.parse(s.through)>75*60000;
 return '<div class="eyebrow">Continuing study · saved source evidence</div><h3>'+totals.total.toLocaleString()+' merged PRs saved</h3><p><strong>Source cutoff '+esc(when(s.through))+'</strong></p><details><summary>Timing and retrieval details</summary><p>Capture read '+esc(when(d.capturedAt))+'<br>Original storage timestamp '+esc(when(d.hostedStoredAt))+'<br>Browser rendered '+esc(when(new Date().toISOString()))+'</p></details><div class="statrow"><div class="stat"><strong>'+totals.material+'</strong> automated material classifications</div><div class="stat"><strong>'+totals.support+'</strong> support classifications</div></div><p>'+s.reviewedCount+' preserved source reviews · '+s.correctionCount+' corrections · '+s.auditFlagCount+' open audit flags</p><p class="note">'+(stale?'Saved study is over 75 minutes old. ':'')+'While connected, this page rereads the private service every minute. Refresh does not run the source collector. The control-plane capture has its own timestamp.</p><details><summary>Audit flags and source evidence</summary><ul>'+d.auditFlags.map(f=>'<li><a target="_blank" rel="noopener noreferrer" href="https://github.com/'+esc(f.repository)+'/pull/'+f.number+'">PR #'+f.number+'</a> — '+(f.reason==='GITHUB_3000_FILE_CAP_AUDIT_REQUIRED'?'GitHub 3,000-file response cap requires audit':'GitHub reported file count contradicts the retrieved file list')+'</li>').join('')+'</ul><p>Source checkpoint <code>'+esc(s.checkpoint.commit)+'</code></p></details><button class="quiet-link" data-project="PRIVATE_PUBLIC_BRIDGE">Read collector status &amp; next step →</button><p class="note">Automated classifications preserve reviewed corrections. They do not establish current productivity, endpoint survival, or causation.</p>';
}
async function refresh(){
 if(busy)return;busy=true;
 const show=html=>roots.forEach(root=>{root.innerHTML=html;});
 try{
  const r=await localFetch('/api/study',{cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error('SOURCE_UNAVAILABLE');
  const d=await r.json(),s=d.rollingStudy;
  if(d.schema!=='DGB_HOSTED_STUDY_CAPTURE_v1'||!s||!Array.isArray(s.cohorts)||s.through!==s.checkpoint?.savedThrough||!/^[a-f0-9]{40}$/.test(s.checkpoint.commit))throw Error('INVALID_STUDY');
  last=d;const stamp=document.getElementById('study-freshness');if(stamp){stamp.textContent='Study evidence through '+when(s.through)+(Date.now()-Date.parse(s.through)>75*60000?' · STALE SOURCE':'')+' · stored '+when(d.hostedStoredAt);stamp.classList.toggle('warning',Date.now()-Date.parse(s.through)>75*60000);}show(render(d));
 }catch{show(last?render(last)+'<p role="status" class="warning">Update unavailable; showing the last loaded study.</p>':'<h3>Continuing study</h3><p role="status">Connect to load the saved study.</p>');}finally{busy=false;}
}
for(const view of ['home-view','evidence-view']){
 const section=document.createElement('section');section.id=view==='home-view'?'continuing-study':'evidence-continuing-study';section.className='panel';section.style.marginTop='24px';section.setAttribute('aria-label','Continuing study checkpoint');document.getElementById(view).append(section);roots.push(section);
}
roots.push(document.getElementById('dialog-continuing-study'));
document.getElementById('refresh')?.addEventListener('click',refresh);
watchWorkspace(window,refresh);refresh();setInterval(refresh,60000);
