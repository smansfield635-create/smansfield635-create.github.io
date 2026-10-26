import {localFetch,watchWorkspace} from './local-data.mjs';
const section=document.createElement('details');section.className='panel agent-updates';section.setAttribute('aria-label','Agent updates');
const title=document.createElement('summary');title.textContent='Agent updates';section.append(title);
const content=document.createElement('div');section.append(content);document.querySelector('#home-view .home-intro').nextElementSibling.after(section);
let signature='';
async function load(){try{
 const r=await localFetch('/api/agent-checkpoints',{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();
 const stamp=document.getElementById('agent-freshness');if(stamp)stamp.textContent='Agent updates: '+data.records.length+' delivered';
 title.textContent='Agent updates · '+data.records.length;
 const next=JSON.stringify(data);if(next===signature)return;signature=next;
 const opened=new Set([...content.querySelectorAll('details[open]')].map(d=>d.dataset.operation));content.replaceChildren();
 if(!data.records.length){const p=document.createElement('p');p.textContent='No agent reports have been published.';content.append(p);}
 for(const row of data.records.slice(0,12)){
  const e=row.event,report=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p'),meta=document.createElement('p'),a=document.createElement('a');
  report.className='agent-report';report.dataset.operation=e.operationId;report.open=opened.has(e.operationId);
  summary.textContent=e.projectId.replaceAll('_',' ')+' · '+e.phase.toLowerCase();p.textContent=e.summary;
  try{const u=new URL(e.githubEvidenceUrl);if(u.protocol==='https:'&&u.hostname==='github.com'&&!u.username&&!u.password)a.href=u.href;}catch{}a.textContent='GitHub evidence';a.target='_blank';a.rel='noopener noreferrer';
  meta.className='agent-meta';meta.append(a,document.createElement('br'),'Reported '+new Date(e.occurredAt).toLocaleString(),document.createElement('br'),'Received '+new Date(row.receivedAt).toLocaleString(),document.createElement('br'),'Agent report · outcome not independently verified');
  report.append(summary,p,meta);content.append(report);
 }
 if(data.truncated){const p=document.createElement('p');p.textContent='Showing a bounded set of delivered reports.';content.append(p);}
}catch{title.textContent='Agent updates · unavailable';}}
watchWorkspace(window,load);load();setInterval(load,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});document.querySelector('#refresh')?.addEventListener('click',load);
