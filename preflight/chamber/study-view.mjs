import {publicationNotice} from './dashboard.mjs';
import {localFetch,watchWorkspace} from './local-data.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const when=v=>new Date(v).toLocaleString('en-US',{timeZone:'America/Chicago',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'})+' Central';
export function studyStamp(d,now=Date.now()){return 'Study evidence through: '+when(d.rollingStudy.through)+(publicationNotice(d,d.rollingStudy.through,now)?' · Newer evidence confirmed · not yet published in this record':'');}
export function validateStudy(d,now=Date.now()){
 const s=d?.rollingStudy;
 if(d?.schema!=='DGB_HOSTED_STUDY_CAPTURE_v1'||!s||!Array.isArray(s.cohorts)||!Array.isArray(d.auditFlags)||s.through!==s.checkpoint?.savedThrough||!/^[a-f0-9]{40}$/.test(s.checkpoint.commit))throw Error('INVALID_STUDY');
 if(s.cohorts.some(c=>!c||['total','materialUnits','SUPPORT','UNRESOLVED'].some(k=>!Number.isSafeInteger(c[k])||c[k]<0)))throw Error('INVALID_STUDY');
 if(!Number.isFinite(now)||[s.through,d.capturedAt,d.hostedStoredAt].some(v=>!Number.isFinite(Date.parse(v))||Date.parse(v)>now+30000))throw Error('CLOCK_INVALID');
 return d;
}
export function render(d,now=Date.now()){
 const pending=publicationNotice(d,d.rollingStudy.through,now);
 const s=d.rollingStudy,totals=s.cohorts.reduce((a,c)=>({total:a.total+c.total,material:a.material+c.materialUnits,support:a.support+c.SUPPORT,unresolved:a.unresolved+c.UNRESOLVED}),{total:0,material:0,support:0,unresolved:0});
 return '<div class="eyebrow">Continuing study · published evidence</div><h3>'+totals.total.toLocaleString()+' merged PRs saved</h3><p><strong>Study evidence through: '+esc(when(s.through))+'</strong></p>'+(pending?'<p role="status" class="warning">'+esc(pending.message)+' · <a target="_blank" rel="noopener noreferrer" href="'+esc(pending.sourceUrl)+'">Source evidence</a></p>':'')+'<details><summary>Timing and retrieval details</summary><p>Capture read '+esc(when(d.capturedAt))+'<br>Original storage timestamp '+esc(when(d.hostedStoredAt))+'<br>Browser rendered '+esc(when(new Date().toISOString()))+'</p></details><div class="statrow"><div class="stat"><strong>'+totals.material+'</strong> automated material classifications</div><div class="stat"><strong>'+totals.support+'</strong> support classifications</div></div><p>'+s.reviewedCount+' preserved source reviews · '+s.correctionCount+' corrections · '+s.auditFlagCount+' open audit flags</p><p class="note">'+'This page checks published records every minute. New source evidence appears after the website records are updated and published. The control-plane capture has its own timestamp.</p><details><summary>Audit flags and source evidence</summary><ul>'+d.auditFlags.map(f=>'<li><a target="_blank" rel="noopener noreferrer" href="https://github.com/'+esc(f.repository)+'/pull/'+f.number+'">PR #'+f.number+'</a> — '+(f.reason==='GITHUB_3000_FILE_CAP_AUDIT_REQUIRED'?'GitHub 3,000-file response cap requires audit':'GitHub reported file count contradicts the retrieved file list')+'</li>').join('')+'</ul><p>Source checkpoint <code>'+esc(s.checkpoint.commit)+'</code></p></details><button class="quiet-link" data-project="PRIVATE_PUBLIC_BRIDGE">Read collector status &amp; next step →</button><p class="note">Automated classifications preserve reviewed corrections. They do not establish current productivity, endpoint survival, or causation.</p>';
}
export function mountStudy(document,{fetchImpl=localFetch,now=()=>Date.now(),view=document.defaultView}={}){
let busy=false,last=null;
const roots=[];
async function refresh(){
 if(busy)return;busy=true;
 const show=html=>roots.forEach(root=>{root.innerHTML=html;});
 try{
  const r=await fetchImpl('/api/study',{cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error('SOURCE_UNAVAILABLE');
  const d=validateStudy(await r.json(),now());
  const html=render(d,now());last=d;const stamp=document.getElementById('study-freshness');if(stamp){stamp.textContent=studyStamp(d,now());stamp.classList.toggle('warning',!!publicationNotice(d,d.rollingStudy.through,now()));}show(html);
 }catch{const stamp=document.getElementById('study-freshness');if(stamp){stamp.textContent=(last?studyStamp(last,now())+' · ':'')+'Study update unavailable';stamp.classList.toggle('warning',true);}show(last?render(last,now())+'<p role="status" class="warning">Update unavailable; showing the last loaded study.</p>':'<h3>Continuing study</h3><p role="status" class="warning">Published study is unavailable. Try Refresh again.</p>');}finally{busy=false;}
}
for(const view of ['home-view','evidence-view']){
 const section=document.createElement('section');section.id=view==='home-view'?'continuing-study':'evidence-continuing-study';section.className='panel';section.style.marginTop='24px';section.setAttribute('aria-label','Continuing study checkpoint');document.getElementById(view).append(section);roots.push(section);
}
roots.push(document.getElementById('dialog-continuing-study'));
document.getElementById('refresh')?.addEventListener('click',refresh);
const unwatch=watchWorkspace(view,refresh);void refresh();const timer=setInterval(refresh,60000);
return {refresh,destroy(){unwatch();clearInterval(timer);document.getElementById('refresh')?.removeEventListener('click',refresh);}};
}
if(typeof document!=='undefined')mountStudy(document);
