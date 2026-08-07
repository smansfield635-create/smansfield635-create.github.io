const ROOT='../../../../';
const BASE=ROOT+'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/';
const PRE=BASE+'pre-f8-corrective-construction-v1/';
const F8=BASE+'f8-spatial-xyz-semantic-layer/';
const F9=BASE+'f9-integrated-environment-assembly/';
const F11=BASE+'f11-exact-candidate-certification/';

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=v=>String(v??'').replace(/^UCIC_CLAIM_/,'').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
const compact=v=>String(v??'').replace(/^UCIC_CLAIM_/,'').replaceAll('_',' ');
const admissionClass=a=>String(a||'').startsWith('LEVEL_A')?'LEVEL_A':String(a||'').startsWith('LEVEL_B')?'LEVEL_B':'LEVEL_C';
const directionClass=d=>String(d||'').toLowerCase();

const state={mode:'field',depth:0,filter:'ALL',selected:null,data:null,nodePositions:new Map()};

async function json(url){
  const r=await fetch(url,{cache:'force-cache'});
  if(!r.ok)throw new Error(`${r.status} ${url}`);
  return r.json();
}
async function loadShards(indexUrl,field){
  const index=await json(indexUrl);
  const shards=await Promise.all(index.shards.map(s=>json(PRE+s.path)));
  return {index,items:shards.flatMap(s=>s[field]||[])};
}

function xyzFor(index,lane){
  const col=index%6,row=Math.floor(index/6);
  return {x:Number((-0.75+col*0.30).toFixed(2)),y:lane,z:Number((-0.75+row*0.30).toFixed(2)),col,row};
}
function point(kind,index){
  const lane=kind==='study'?0.70:kind==='claim'?-0.20:-0.70;
  const xyz=xyzFor(index,lane);
  const left=9+((xyz.x+1)/2)*82;
  const base=kind==='study'?12:kind==='claim'?50:82;
  const rowStep=kind==='estate'?5.8:7.2;
  const top=base+xyz.row*rowStep;
  return {...xyz,left,top};
}
function nodeKey(kind,id){return `${kind}:${id}`}

async function load(){
  const [studyShard,relationShard,coherence,projections,crosswalk,geometry,f9,f11]=await Promise.all([
    loadShards(PRE+'versioned-study-registry-index.v1.json','studies'),
    loadShards(PRE+'typed-relation-registry-index.v1.json','relations'),
    json(PRE+'canonical-coherence-object.v1.json'),
    json(PRE+'claim-to-estate-projection-matrix.v1.json'),
    json(PRE+'claim-method-model-crosswalk.v1.json'),
    json(F8+'geometry-contract.v1.json'),
    json(F9+'integrated-environment-manifest.v1.json'),
    json(F11+'certified-candidate-manifest.v1.json')
  ]);
  const studies=[...studyShard.items].sort((a,b)=>a.studyId.localeCompare(b.studyId));
  const claims=[...coherence.claims].sort((a,b)=>a.claimId.localeCompare(b.claimId));
  const relations=[...relationShard.items].sort((a,b)=>a.relationId.localeCompare(b.relationId));
  const destinations=[...projections.destinations].sort();
  const stateful=new Set(f9.statefulEntryIds);
  const claimById=new Map(claims.map(c=>[c.claimId,c]));
  const studyById=new Map(studies.map(s=>[s.studyId,s]));
  const projectionByClaim=new Map(projections.matrix.map(p=>[p.claimId,p]));
  state.data={studies,claims,relations,destinations,coherence,projections,crosswalk,geometry,f9,f11,stateful,claimById,studyById,projectionByClaim};
  validateCertifiedBinding();
  hydrateHeader();
  renderField();
  renderRecords();
  selectDefault();
  bindControls();
  document.querySelector('#app').dataset.reviewStatus='ready';
  window.METHODS_MODELS_REVIEW_SURFACE={
    ready:true,
    certifiedEnvironmentHead:f11.certifiedEnvironmentHead,
    candidateFingerprint:f11.candidatePayloadFingerprintSha256,
    counts:{studies:studies.length,stateful:[...stateful].length,claims:claims.length,relations:relations.length},
    scienceAuthority:'UPSTREAM_ONLY',
    cameraAuthority:geometry.camera
  };
}

function validateCertifiedBinding(){
  const {studies,claims,relations,f9,f11,geometry}=state.data;
  const fail=[];
  if(studies.length!==22)fail.push(`studies=${studies.length}`);
  if(f9.statefulEntryIds.length!==16)fail.push(`stateful=${f9.statefulEntryIds.length}`);
  if(claims.length!==19)fail.push(`claims=${claims.length}`);
  if(relations.length!==38)fail.push(`relations=${relations.length}`);
  if(f11.certifiedEnvironmentHead!=='d39d9f110ed7fe16109ddcb5b8043b3752c1a36e')fail.push('certified head');
  if(f11.candidatePayloadFingerprintSha256!=='caf6af4d3eb13420a78efdc1a4c1c89fd113c884312b1d6113eaceca4080ee99')fail.push('fingerprint');
  if(geometry.camera?.mode!=='FIXED_NON_USER_CONTROLLED'||geometry.camera?.orbit||geometry.camera?.pan||geometry.camera?.zoom)fail.push('camera contract');
  if(fail.length)throw new Error(`Certified binding failed: ${fail.join(', ')}`);
}

function hydrateHeader(){
  const {coherence,studies,claims,relations,stateful}=state.data;
  $('#canonical-proposition').textContent=coherence.canonicalProposition;
  $('#scientific-status').textContent=coherence.scientificStatus.replaceAll('_',' ');
  $('#claim-ceiling').textContent=coherence.claimCeiling.replaceAll('_',' ');
  $('#metric-studies').textContent=studies.length;
  $('#metric-stateful').textContent=stateful.size;
  $('#metric-claims').textContent=claims.length;
  $('#metric-relations').textContent=relations.length;
}

function renderField(){
  const {studies,claims,destinations,relations,projections}=state.data;
  const field=$('#field');
  field.innerHTML='<svg class="edge-layer" id="edge-layer" aria-hidden="true"></svg>';
  state.nodePositions.clear();

  studies.forEach((s,i)=>addNode(field,'study',s.studyId,i,{admission:admissionClass(s.admission),label:pretty(s.studyId)}));
  claims.forEach((c,i)=>addNode(field,'claim',c.claimId,i,{label:pretty(c.claimId)}));
  destinations.forEach((d,i)=>addNode(field,'estate',d,i,{label:pretty(d)}));

  requestAnimationFrame(()=>{
    drawEdges(relations,projections.matrix);
    applyMode();
  });
}

function addNode(field,kind,id,index,extra={}){
  const p=point(kind,index);
  state.nodePositions.set(nodeKey(kind,id),p);
  const b=document.createElement('button');
  b.className='node';
  b.dataset.kind=kind;
  b.dataset.id=id;
  if(extra.admission)b.dataset.admission=extra.admission;
  b.style.left=`${p.left}%`;
  b.style.top=`${p.top}%`;
  b.setAttribute('aria-label',`${kind}: ${pretty(id)}. XYZ ${p.x}, ${p.y}, ${p.z}.`);
  b.title=`${pretty(id)} · (${p.x}, ${p.y}, ${p.z})`;
  b.addEventListener('click',()=>select(kind,id));
  b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(kind,id)}});
  field.appendChild(b);
  const label=document.createElement('span');
  label.className=`node-label ${kind}`;
  label.style.left=`${p.left}%`;
  label.style.top=`${p.top}%`;
  label.textContent=extra.label;
  label.dataset.for=nodeKey(kind,id);
  field.appendChild(label);
}

function drawEdges(relations,matrix){
  const svg=$('#edge-layer');
  svg.setAttribute('viewBox','0 0 1000 625');
  const line=(a,b,cls,id)=>{
    if(!a||!b)return;
    const el=document.createElementNS('http://www.w3.org/2000/svg','line');
    el.setAttribute('x1',a.left*10);el.setAttribute('y1',a.top*6.25);
    el.setAttribute('x2',b.left*10);el.setAttribute('y2',b.top*6.25);
    el.setAttribute('class',`edge ${cls}`);el.dataset.edgeId=id;svg.appendChild(el);
  };
  relations.forEach(r=>line(state.nodePositions.get(nodeKey('study',r.studyId)),state.nodePositions.get(nodeKey('claim',r.claimId)),directionClass(r.direction),`R:${r.relationId}`));
  matrix.forEach(row=>row.allowed.forEach(dest=>line(state.nodePositions.get(nodeKey('claim',row.claimId)),state.nodePositions.get(nodeKey('estate',dest)),'projection',`P:${row.claimId}:${dest}`)));
}

function select(kind,id){
  state.selected={kind,id};
  $$('.node').forEach(n=>n.classList.toggle('selected',n.dataset.kind===kind&&n.dataset.id===id));
  renderInspector();
  highlightEdges();
}
function selectDefault(){select('claim','UCIC_CLAIM_EMPIRICAL_UNIVERSALITY')}

function highlightEdges(){
  const selected=state.selected;
  $$('.edge').forEach(e=>e.classList.remove('active'));
  if(!selected)return;
  const {relations,projectionByClaim}=state.data;
  if(selected.kind==='study'){
    relations.filter(r=>r.studyId===selected.id).forEach(r=>document.querySelector(`[data-edge-id="R:${CSS.escape(r.relationId)}"]`)?.classList.add('active'));
  }else if(selected.kind==='claim'){
    relations.filter(r=>r.claimId===selected.id).forEach(r=>document.querySelector(`[data-edge-id="R:${CSS.escape(r.relationId)}"]`)?.classList.add('active'));
    const p=projectionByClaim.get(selected.id);(p?.allowed||[]).forEach(d=>document.querySelector(`[data-edge-id="P:${CSS.escape(selected.id)}:${CSS.escape(d)}"]`)?.classList.add('active'));
  }
}

function renderInspector(){
  const {kind,id}=state.selected||{};
  if(kind==='study')return renderStudyInspector(state.data.studyById.get(id));
  if(kind==='claim')return renderClaimInspector(state.data.claimById.get(id));
  if(kind==='estate')return renderEstateInspector(id);
}

function renderStudyInspector(s){
  const {relations,stateful,claimById}=state.data;
  const rs=relations.filter(r=>r.studyId===s.studyId);
  const isStateful=stateful.has(s.studyId);
  const p=state.nodePositions.get(nodeKey('study',s.studyId));
  let html=`<span class="object-type">STUDY OBJECT</span><h3>${esc(pretty(s.studyId))}</h3><p class="standing">${esc(s.standing.replaceAll('_',' '))}</p>`;
  if(state.depth>=1)html+=`<div class="meta-grid"><div class="meta"><span>Domain</span><b>${esc(pretty(s.domain))}</b></div><div class="meta"><span>Admission</span><b>${esc(s.admission)}</b></div><div class="meta"><span>Class</span><b>${esc(s.class)}</b></div><div class="meta"><span>State authority</span><b>${isStateful?'STATEFUL ENTRY':'PORTFOLIO ONLY'}</b></div><div class="meta"><span>F8 XYZ</span><b>${p.x}, ${p.y}, ${p.z}</b></div><div class="meta"><span>Relation count</span><b>${rs.length}</b></div></div>`;
  if(state.depth>=2)html+=relationCards(rs,r=>`${pretty(r.claimId)} · ${claimById.get(r.claimId)?.status?.replaceAll('_',' ')||''}`);
  if(state.depth>=3)html+=`<div class="provenance">SOURCE / PROVENANCE\n${esc(JSON.stringify(s.source,null,2))}</div>`;
  if(state.depth>=4)html+=`<div class="provenance">CANONICAL STUDY RECORD\n${esc(JSON.stringify(s,null,2))}</div>`;
  $('#inspector-body').innerHTML=html;
}

function renderClaimInspector(c){
  const {relations,projectionByClaim,crosswalk}=state.data;
  const rs=relations.filter(r=>r.claimId===c.claimId);
  const p=projectionByClaim.get(c.claimId);
  const xyz=state.nodePositions.get(nodeKey('claim',c.claimId));
  const cross=(crosswalk.crosswalk||crosswalk.claims||[]).find?.(x=>x.claimId===c.claimId);
  let html=`<span class="object-type">CANONICAL CLAIM</span><h3>${esc(pretty(c.claimId))}</h3><p class="standing">${esc(c.status.replaceAll('_',' '))}</p>`;
  if(state.depth>=1)html+=`<div class="meta-grid"><div class="meta"><span>Claim ceiling</span><b>${esc(c.ceiling)}</b></div><div class="meta"><span>Evidence relations</span><b>${rs.length}</b></div><div class="meta"><span>Estate projections</span><b>${p?.allowed?.length||0}</b></div><div class="meta"><span>F8 XYZ</span><b>${xyz.x}, ${xyz.y}, ${xyz.z}</b></div></div>`;
  if(state.depth>=2)html+=relationCards(rs,r=>pretty(r.studyId));
  if(state.depth>=3)html+=`<div class="provenance">GOVERNED ESTATE PROJECTIONS\n${esc((p?.allowed||[]).join('\n'))}\n\nMAXIMUM\n${esc(p?.maximum||c.ceiling)}${cross?`\n\nMETHOD / MODEL CROSSWALK\n${esc(JSON.stringify(cross,null,2))}`:''}</div>`;
  if(state.depth>=4)html+=`<div class="provenance">CANONICAL CLAIM RECORD\n${esc(JSON.stringify(c,null,2))}</div>`;
  $('#inspector-body').innerHTML=html;
}

function renderEstateInspector(id){
  const {projections}=state.data;
  const claims=projections.matrix.filter(r=>r.allowed.includes(id));
  const xyz=state.nodePositions.get(nodeKey('estate',id));
  let html=`<span class="object-type">ESTATE PROJECTION DESTINATION</span><h3>${esc(pretty(id))}</h3><p class="standing">Presentation destination only. It creates no scientific authority.</p>`;
  if(state.depth>=1)html+=`<div class="meta-grid"><div class="meta"><span>Authorized claims</span><b>${claims.length}</b></div><div class="meta"><span>F8 XYZ</span><b>${xyz.x}, ${xyz.y}, ${xyz.z}</b></div></div>`;
  if(state.depth>=2)html+=`<div class="relation-stack">${claims.map(c=>`<div class="relation-card"><header><span class="direction">PROJECTS</span><strong>${esc(pretty(c.claimId))}</strong></header><p>Maximum: ${esc(c.maximum)}</p></div>`).join('')}</div>`;
  if(state.depth>=3)html+=`<div class="provenance">PROJECTION RULE\n${esc(projections.defaultRule)}</div>`;
  $('#inspector-body').innerHTML=html;
}

function relationCards(rs,title){
  if(!rs.length)return '<div class="relation-stack"><p class="empty">No typed result relation is registered for this object.</p></div>';
  return `<div class="relation-stack">${rs.map(r=>`<div class="relation-card"><header><span class="direction ${directionClass(r.direction)}">${esc(r.direction)}</span><strong>${esc(title(r))}</strong></header><p>${esc(r.summary||r.type)}</p>${state.depth>=3?`<p><b>${esc(r.type)}</b> · ${esc(r.standing)}</p>`:''}</div>`).join('')}</div>`;
}

function renderRecords(){
  const {studies,relations}=state.data;
  const list=$('#record-list');
  const filtered=studies.filter(s=>state.filter==='ALL'||admissionClass(s.admission)===state.filter);
  list.innerHTML=filtered.map(s=>{
    const n=relations.filter(r=>r.studyId===s.studyId).length;
    return `<button class="record" data-study="${esc(s.studyId)}"><div class="record-top"><span class="record-domain">${esc(pretty(s.domain))}</span><span class="record-admission">${esc(admissionClass(s.admission))}</span></div><h3>${esc(pretty(s.studyId))}</h3><p>${esc(s.standing.replaceAll('_',' '))}</p><footer><span>${n} typed relation${n===1?'':'s'}</span><span>${state.data.stateful.has(s.studyId)?'stateful entry':'portfolio record'}</span></footer></button>`;
  }).join('');
  $$('.record').forEach(b=>b.addEventListener('click',()=>{select('study',b.dataset.study);$('#stage').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}));
}

function applyMode(){
  const mode=state.mode;
  $('#stage-title').textContent=({field:'Scientific topology',studies:'Study object plane',claims:'Canonical claim plane',relations:'Typed result-to-claim graph',estate:'Governed projection plane'})[mode];
  $$('.node').forEach(n=>{
    const k=n.dataset.kind;
    const show=mode==='field'||(mode==='studies'&&k==='study')||(mode==='claims'&&k==='claim')||(mode==='relations'&&(k==='study'||k==='claim'))||(mode==='estate'&&(k==='claim'||k==='estate'));
    n.style.opacity=show?'1':'.08';n.style.pointerEvents=show?'auto':'none';
  });
  $$('.node-label').forEach(l=>{const k=l.classList.contains('study')?'study':l.classList.contains('claim')?'claim':'estate';const show=mode==='field'||(mode==='studies'&&k==='study')||(mode==='claims'&&k==='claim')||(mode==='relations'&&(k==='study'||k==='claim'))||(mode==='estate'&&(k==='claim'||k==='estate'));l.style.opacity=show?'1':'0'});
  $$('.edge').forEach(e=>{
    const projection=e.dataset.edgeId?.startsWith('P:');
    e.style.opacity=mode==='studies'||mode==='claims'?'0':mode==='relations'?(projection?'0':'.75'):mode==='estate'?(projection?'.75':'0'):'.75';
  });
  highlightEdges();
}

function bindControls(){
  $$('.mode').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;$$('.mode').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});applyMode()}));
  $$('.depth').forEach(b=>b.addEventListener('click',()=>{state.depth=Number(b.dataset.depth);$$('.depth').forEach(x=>x.classList.toggle('active',x===b));renderInspector()}));
  $$('.filter').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;$$('.filter').forEach(x=>x.classList.toggle('active',x===b));renderRecords()}));
}

load().catch(err=>{
  console.error(err);
  $('#app').dataset.reviewStatus='failed';
  $('#field').innerHTML=`<div class="fatal"><strong>Review surface failed closed.</strong><br>${esc(err.message)}</div>`;
  $('#inspector-body').innerHTML='<p class="empty">The certified scientific substrate could not be verified. No fallback or invented content was substituted.</p>';
  window.METHODS_MODELS_REVIEW_SURFACE={ready:false,error:String(err)};
});
