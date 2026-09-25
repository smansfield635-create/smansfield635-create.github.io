/* GOVERNANCE PANEL — portable substrate catalog + host adapter */
(()=>{'use strict';
const CATALOG_URL='https://raw.githubusercontent.com/smansfield635-create/geodiametrics1/3fbbe363777398cc29040ae258ebab5eec9ced48/control-plane/governance-panel/GOVERNANCE_PANEL_CATALOG_v1.json';
let CATALOG=null;
async function loadCatalog(){
 const source=await fetch(CATALOG_URL,{cache:'no-store'});
 if(!source.ok)throw new Error('Governance catalog fetch failed: HTTP '+source.status);
 const raw=await source.json();
 if(raw?.catalogId!=='GOVERNANCE_PANEL_CATALOG_V1'||raw?.generatedFor!=='GOVERNANCE_PANEL_V2')throw new Error('Governance catalog identity mismatch');
 if(!Array.isArray(raw.nodes)||raw.nodes.length!==14||!Array.isArray(raw.edges)||raw.edges.length!==21)throw new Error('Governance catalog topology mismatch');
 if(!raw.operations||Object.keys(raw.operations).length!==8)throw new Error('Governance catalog operation model mismatch');
 CATALOG=Object.freeze({
  version:raw.catalogId,
  substrate:raw.substrate,
  nodes:Object.freeze(raw.nodes.map((n,i)=>Object.freeze({...n,x:[50,18,50,82,18,40,60,82,24,50,76,24,50,76][i],y:[9,25,25,25,44,44,44,44,65,65,65,84,84,84][i],className:n.className||n.layer,desc:n.desc||'Governed substrate node.',source:n.canonicalSource?.path||'UNRESOLVED',status:n.status}))),
  edges:Object.freeze(raw.edges.map(e=>Object.freeze(e))),
  operations:Object.freeze(Object.fromEntries(Object.entries(raw.operations).map(([k,v])=>[k,Object.freeze(v)]))),
  labels:Object.freeze(raw.labels)
 });
 return CATALOG;
}
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const q=(s,r=document)=>r.querySelector(s);
let instance=null;
function build(host,options={}){\n if(!CATALOG)throw new Error('Governance catalog is not loaded');
 if(instance){return instance.api;}
 const trigger=document.createElement('button');trigger.type='button';trigger.className='governance-panel-trigger';trigger.textContent=options.label||'Governance Panel';trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','governance-panel');
 const panel=document.createElement('section');panel.className='governance-panel';panel.id='governance-panel';panel.setAttribute('aria-hidden','true');panel.setAttribute('aria-label','Governance Panel');
 panel.innerHTML='<div class="governance-panel__sheet" role="dialog" aria-modal="true" aria-labelledby="governance-panel-title"><header class="governance-panel__top"><div><p class="governance-panel__eyebrow">Governance substrate</p><h2 class="governance-panel__title" id="governance-panel-title">See the substrate. Trace the operation.</h2><p class="governance-panel__subtitle">Inspect the reusable control substrate and the standard operational tracks that traverse it.</p></div><button class="governance-panel__close" type="button" aria-label="Close Governance Panel">×</button></header><div class="governance-panel__body"><div class="governance-ops" role="tablist" aria-label="Standard governance operations">'+Object.entries(CATALOG.labels).map(([id,label])=>'<button class="governance-op" type="button" role="tab" aria-selected="false" data-governance-op="'+id+'">'+label+'</button>').join('')+'</div><div class="governance-track" data-governance-track aria-live="polite"></div><div class="governance-map"><div class="governance-canvas" data-governance-canvas role="group" aria-label="Interactive governance substrate map"></div><aside class="governance-detail" data-governance-detail aria-live="polite"><p class="governance-detail__kicker" data-detail-kicker></p><h3 data-detail-title></h3><p class="governance-detail__description" data-detail-description></p><span class="governance-detail__status" data-detail-status></span><div class="governance-detail__section"><strong>Operational role</strong><p data-detail-role></p></div><div class="governance-detail__section"><strong>Canonical implementation</strong><code data-detail-source></code></div><div class="governance-legend"><span><i class="authority"></i> authority</span><span><i></i> control / execution</span><span><i class="evidence"></i> evidence</span><span><i class="boundary"></i> boundary</span></div></aside></div></div></div>';
 host.append(trigger);document.body.append(panel);
 const canvas=q('[data-governance-canvas]',panel),detail=q('[data-governance-detail]',panel),track=q('[data-governance-track]',panel);
 const nodes=CATALOG.nodes,nodeMap=new Map(nodes.map(n=>[n.id,n]));
 canvas.innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+CATALOG.edges.map(([a,b])=>{const A=nodeMap.get(a),B=nodeMap.get(b);return '<path class="governance-edge" data-edge="'+a+' '+b+'" d="M '+A.x+' '+A.y+' L '+B.x+' '+B.y+'"></path>';}).join('')+'</svg>'+nodes.map(n=>'<button type="button" class="governance-node" data-node="'+n.id+'" data-layer="'+n.layer+'" style="left:'+n.x+'%;top:'+n.y+'%" aria-pressed="false"><span class="governance-node__name">'+esc(n.name)+'</span><span class="governance-node__class">'+esc(n.className)+'</span></button>').join('');
 const nodeEls=[...canvas.querySelectorAll('[data-node]')],edgeEls=[...canvas.querySelectorAll('[data-edge]')];
 const neighbors=id=>new Set(CATALOG.edges.flatMap(([a,b])=>a===id?[b]:b===id?[a]:[]));
 let op='execute',selected='execution',previousFocus=null,closingTimer=0;
 const renderDetail=()=>{const n=nodeMap.get(selected);detail.querySelector('[data-detail-kicker]').textContent=n.className;detail.querySelector('[data-detail-title]').textContent=n.name;detail.querySelector('[data-detail-description]').textContent=n.desc;detail.querySelector('[data-detail-source]').textContent=n.source;detail.querySelector('[data-detail-status]').textContent=n.status;detail.querySelector('[data-detail-role]').textContent='Participates in '+CATALOG.labels[op]+' operations.';};
 const render=()=>{const active=new Set(CATALOG.operations[op]),near=neighbors(selected);nodeEls.forEach(el=>{const id=el.dataset.node;el.classList.toggle('is-active',id===selected);el.classList.toggle('is-connected',id!==selected&&(active.has(id)||near.has(id)));el.classList.toggle('is-dimmed',!active.has(id)&&id!==selected);el.setAttribute('aria-pressed',id===selected?'true':'false');});edgeEls.forEach(el=>{const [a,b]=el.dataset.edge.split(' ');const live=active.has(a)&&active.has(b),connected=a===selected||b===selected;el.classList.toggle('is-active',live);el.classList.toggle('is-connected',connected&&!live);});track.innerHTML='<strong>'+CATALOG.labels[op]+'</strong>'+CATALOG.operations[op].map(id=>'<span class="governance-track__sep">→</span><span>'+esc(nodeMap.get(id).name)+'</span>').join('');renderDetail();};
 const setOp=id=>{if(!CATALOG.operations[id])return;op=id;if(!CATALOG.operations[op].includes(selected))selected=CATALOG.operations[op][Math.min(1,CATALOG.operations[op].length-1)];panel.querySelectorAll('[data-governance-op]').forEach(b=>b.setAttribute('aria-selected',b.dataset.governanceOp===op?'true':'false'));render();};
 const open=()=>{if(panel.classList.contains('is-open'))return;previousFocus=document.activeElement;clearTimeout(closingTimer);panel.classList.remove('is-closing');panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');trigger.setAttribute('aria-expanded','true');document.documentElement.style.overflow='hidden';requestAnimationFrame(()=>panel.querySelector('.governance-op[aria-selected=true]')?.focus());};
 const close=()=>{if(!panel.classList.contains('is-open'))return;panel.classList.add('is-closing');panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');trigger.setAttribute('aria-expanded','false');document.documentElement.style.overflow='';clearTimeout(closingTimer);closingTimer=setTimeout(()=>panel.classList.remove('is-closing'),500);previousFocus?.focus?.({preventScroll:true});};
 const toggle=()=>panel.classList.contains('is-open')?close():open();
 trigger.addEventListener('click',toggle);q('.governance-panel__close',panel).addEventListener('click',close);panel.addEventListener('click',e=>{if(e.target===panel)close();});
 panel.querySelectorAll('[data-governance-op]').forEach(b=>b.addEventListener('click',()=>setOp(b.dataset.governanceOp)));
 nodeEls.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.node;render();}));
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();return;}if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key))return;const i=nodeEls.findIndex(n=>n.dataset.node===selected);if(i<0)return;e.preventDefault();const next=Math.max(0,Math.min(nodeEls.length-1,i+(e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:e.key==='ArrowDown'?4:-4)));selected=nodeEls[next].dataset.node;nodeEls[next].focus();render();});
 setOp(op);instance={api:Object.freeze({version:'GOVERNANCE_PANEL_V2',catalog:CATALOG,mount:()=>instance.api,open,close,toggle}),trigger,panel};
 return instance.api;
}
async function autoMount(){try{await loadCatalog();const host=q('[data-governance-panel-host]')||document.body;build(host);}catch(error){console.error('[Governance Panel] catalog load failed',error);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',autoMount,{once:true});else autoMount();
globalThis.DGBGovernancePanel=Object.freeze({version:'GOVERNANCE_PANEL_V2',get catalog(){return CATALOG;},mount:(options={})=>{if(!instance)throw new Error('Governance catalog is still loading');return instance.api;},open:()=>instance?.api.open(),close:()=>instance?.api.close(),toggle:()=>instance?.api.toggle()});
})();