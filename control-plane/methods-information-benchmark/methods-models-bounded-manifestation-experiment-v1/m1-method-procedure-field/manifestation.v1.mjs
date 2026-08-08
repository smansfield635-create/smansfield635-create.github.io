import{buildBindingRegistry,createInitialState,dispatchFocus}from'./semantic-runtime.v1.mjs';
const base='../../methods-models-integrated-environment-construction-v1/f4-scientific-content-binding/';
const [method,objects,plan]=await Promise.all([
 fetch(base+'method-content-registry.v1.json').then(r=>r.json()),
 fetch(base+'scientific-object-registry.v1.json').then(r=>r.json()),
 fetch('./binding-plan.v1.json').then(r=>r.json())
]);
const hex=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const stable=v=>Array.isArray(v)?`[${v.map(stable).join(',')}]`:v&&typeof v==='object'?`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`:JSON.stringify(v);
const hash=await hex(stable(method.sequence));
const registry=buildBindingRegistry(method,objects,plan);registry.scientificStateHash=hash;
let state=createInitialState(registry,hash);
const $=s=>document.querySelector(s), nodes=new Map(), pos={
TARGET_REGISTRATION:[7,48],SOURCE_CUTOFF:[15,48],SOURCE_ACQUISITION:[24,31],PRE_OUTCOME_PACKET:[33,31],
CASE_NEUTRALIZATION:[42,31],PRIOR_FAMILIARITY_SCREEN:[51,18],INDEPENDENT_ROLE_ASSIGNMENT:[51,43],ANALYST_QUALIFICATION:[61,31],
ROUTE_AND_COMPARATOR_SUBMISSION:[70,31],PREDICTION_HASH_AND_FREEZE:[79,31],OUTCOME_SEQUESTRATION:[37,72],AUTHORIZED_UNBLINDING:[82,59],
BLINDED_SCORING:[88,59],COMPARATOR_EVALUATION:[94,59],TERMINAL_DISPOSITION:[94,82]};
const pretty=v=>Array.isArray(v)?(v.length?v.join(' · '):'None declared'):String(v??'None').replaceAll('_',' ');
function wire(el,b){let pointerModality='POINTER';el.dataset.bindingId=b.bindingId;el.setAttribute('aria-pressed','false');el.addEventListener('pointerdown',e=>{pointerModality=e.pointerType==='touch'?'TOUCH':'POINTER';el.dataset.preview='true'});
 ['pointerup','pointercancel','pointerleave'].forEach(e=>el.addEventListener(e,()=>delete el.dataset.preview));
 el.addEventListener('click',e=>{const accessible=e.detail===0;commit(b,accessible?'ACCESSIBLE':'DIRECT',accessible?'KEYBOARD':pointerModality);pointerModality='POINTER'})}
function commit(b,route,modality){const r=dispatchFocus({state,registry,bindingId:b.bindingId,target:b.primaryReferent,route,modality});
 if(!r.valid){$('#status').textContent='Rejected '+r.errors.join(', ');return}state=r.state;render();trace(r.auditTrace);$('#status').textContent=b.label+' selected'}
const parent=registry.bindings[0],parentEl=$('#methods');parentEl.textContent='Methods · scientific procedure';wire(parentEl,parent);nodes.set('METHODS',parentEl);
for(const b of registry.bindings.slice(1)){const el=document.createElement('button');el.type='button';el.className='node stage';el.style.setProperty('--x',pos[b.primaryReferent][0]);el.style.setProperty('--y',pos[b.primaryReferent][1]);
 el.innerHTML=`<em>Stage ${b.order}</em><b>${b.label}</b><small>${pretty(b.orientationContext.CUSTODY_DOMAIN)}</small>`;wire(el,b);$('#nodes').append(el);nodes.set(b.primaryReferent,el)}
function render(){for(const[k,n]of nodes)n.setAttribute('aria-pressed',String(k===state.activeReferent));const dl=$('#orientation');dl.replaceChildren();
 for(const[k,v]of Object.entries(state.orientation)){const d=document.createElement('div');d.className='orientation-row';d.innerHTML=`<dt>${pretty(k)}</dt><dd></dd>`;d.querySelector('dd').textContent=pretty(v);dl.append(d)}$('#hash').textContent=state.scientificStateHash}
function trace(t){const li=document.createElement('li');li.innerHTML=`<code>${t.ACTION}</code> → <code>${t.TARGET}</code> → ${t.TRANSFORMATION} → ${t.INFORMATION_DELTA}`;$('#trace').prepend(li);while($('#trace').children.length>6)$('#trace').lastElementChild.remove()}
function edges(){const svg=$('#edges'),field=$('#field'),fr=field.getBoundingClientRect();svg.replaceChildren();for(const r of registry.relations){const a=nodes.get(r.source).getBoundingClientRect(),b=nodes.get(r.target).getBoundingClientRect();
 const x1=a.left+a.width/2-fr.left+field.scrollLeft,y1=a.top+a.height/2-fr.top+field.scrollTop,x2=b.left+b.width/2-fr.left+field.scrollLeft,y2=b.top+b.height/2-fr.top+field.scrollTop;
 const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('class','edge');p.setAttribute('d',`M${x1} ${y1} C${x1+40} ${y1},${x2-40} ${y2},${x2} ${y2}`);p.dataset.bindingId=r.bindingId;svg.append(p)}}
render();requestAnimationFrame(edges);addEventListener('resize',()=>requestAnimationFrame(edges));$('#field').addEventListener('scroll',()=>requestAnimationFrame(edges),{passive:true});
