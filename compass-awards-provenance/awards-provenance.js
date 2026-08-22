(()=>{
'use strict';
const BUILD='gen347-functional-repair-excellence-3';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)], mod=(n,m)=>((n%m)+m)%m;
const root=q('[data-compass-root]');
const controller=()=>window.DGB_COMPASS_CONTROLLER||null;
document.documentElement.dataset.compassAwardsProvenance=BUILD;
q('[data-clone-root]')?.setAttribute('data-clone-build',BUILD);

const provenance=[
 {n:'01',title:'Experience Design',copy:'The visitor feels the system before the machinery. Compass navigation, narrative progression, worlds, characters and products behave as one explorable estate.',href:'/showroom/globe/h-earth/awards/',label:'Inspect the award case'},
 {n:'02',title:'Native Technical Craft',copy:'Browser-native rendering, geometry, runtime state and reusable world systems are part of the experience itself rather than a separate technical demo.',href:'/showroom/globe/h-earth/',label:'Enter H-Earth'},
 {n:'03',title:'Governed Construction',copy:'Intent remains visible through protection, construction, verification and delivery. The control plane is a product-quality system, not hidden project administration.',href:'/governance/',label:'Inspect Governance'},
 {n:'04',title:'Continuity & Evidence',copy:'The estate distinguishes claims from proof, preserves bounded recovery, and exposes evidence with explicit limits instead of presenting confidence as certification.',href:'/evidence/',label:'Inspect Evidence'},
 {n:'05',title:'Integrated Platform',copy:'Navigation, worlds, diagnostics, products, governance and construction have crossed the threshold from separate experiments into one architectural place.',href:'/developer/',label:'Inspect the machinery'}
];

const hero=q('.clone-hero');
if(hero&&!q('.ap-hero-provenance')){
 const p=document.createElement('aside');p.className='ap-hero-provenance';
 p.innerHTML='<p class="clone-kicker">AWARDS PROVENANCE · 2026 ESTATE</p><strong>Built as an experience. Proven as a system.</strong><p>The Compass inherits the strongest interaction, evidence and construction standards already demonstrated across Diamond Gate Bridge.</p><div class="ap-proofline" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div><p><a class="clone-pill" href="/showroom/globe/h-earth/awards/">Open Awards & Recognition</a></p>';
 hero.appendChild(p);
}

const newHere=q('#new-here');
if(newHere&&!q('.ap-award-field')){
 const field=document.createElement('section');field.className='ap-award-field';field.setAttribute('aria-labelledby','ap-award-title');
 field.innerHTML='<div class="ap-award-head"><div><p class="clone-kicker">WHY THIS ESTATE MATTERS</p><h2 id="ap-award-title">Five achievements. One standard.</h2></div><p>The Compass inherits these achievements as design constraints. Swipe the field. One provenance pillar comes forward at a time.</p></div><div class="ap-award-carousel" tabindex="0" aria-label="Awards provenance carousel"><div class="ap-award-ring"></div><div class="ap-award-controls"><button type="button" data-ap-prev aria-label="Previous achievement">←</button><button type="button" data-ap-next aria-label="Next achievement">→</button></div></div>';
 newHere.before(field);
 const ring=q('.ap-award-ring',field);let idx=0;
 provenance.forEach((d,i)=>{const a=document.createElement('article');a.className='ap-award-card';a.tabIndex=i===0?0:-1;a.innerHTML=`<span class="num">${d.n} · ESTATE PROVENANCE</span><h3>${d.title}</h3><p>${d.copy}</p><a href="${d.href}">${d.label} →</a>`;a.addEventListener('click',e=>{if(e.target.closest('a'))return;idx=i;layout()});ring.appendChild(a)});
 const cards=qa('.ap-award-card',ring);const delta=n=>{let d=n-idx;if(d>cards.length/2)d-=cards.length;if(d<-cards.length/2)d+=cards.length;return d};
 const layout=()=>cards.forEach((c,i)=>{const d=delta(i),active=d===0;c.classList.toggle('is-active',active);c.tabIndex=active?0:-1;c.style.setProperty('--x',`${d*68}%`);c.style.setProperty('--z',`${active?140:-120-Math.abs(d)*25}px`);c.style.setProperty('--ry',`${d*-30}deg`);c.style.setProperty('--s',String(active?1:.78));c.style.setProperty('--o',String(active?1:.42));c.style.zIndex=String(active?5:3-Math.abs(d))});
 const move=d=>{idx=mod(idx+d,cards.length);layout();cards[idx]?.focus({preventScroll:true})};
 q('[data-ap-prev]',field).addEventListener('click',()=>move(-1));q('[data-ap-next]',field).addEventListener('click',()=>move(1));
 q('.ap-award-carousel',field).addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
 let sx=null;q('.ap-award-carousel',field).addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;sx=e.clientX},{passive:true});q('.ap-award-carousel',field).addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>44)move(dx<0?1:-1)},{passive:true});layout();
}

const heroKicker=q('.clone-hero .clone-kicker');if(heroKicker)heroKicker.textContent='DIAMOND GATE BRIDGE · INTERACTIVE STUDIO · ESTATE ORIENTATION';
const statements=qa('[data-statement]');if(statements[0])statements[0].textContent='One estate. Many systems. The Compass keeps every path oriented.';if(statements[1])statements[1].textContent='A website can behave like a place when navigation, evidence, worlds and interaction share one geometry.';
const newTitle=q('#new-here-title');if(newTitle)newTitle.textContent='Enter by curiosity, not by sitemap.';
if(newHere){const p=q(':scope > p',newHere);if(p)p.textContent='The estate contains immersive worlds, governed construction, public evidence, diagnostic instruments and original navigation. Start with the question closest to you; the Compass preserves the larger map.'}
const compassTitle=q('#compass-title');if(compassTitle)compassTitle.textContent='The estate becomes navigable when meaning has geometry.';
const compassCopy=q('.clone-compass>.clone-section-heading p:last-child');if(compassCopy)compassCopy.textContent='Four primary directions remain visible. Settlement grants one label semantic ownership. Open that direction to enter its secondary constellation; one room at a time becomes readable and selectable.';

/* Preserve the accepted Gen345 controller while collapsing duplicated responsive room declarations to semantic room identity. */
const scene=q('[data-compass-scene]',root||document);
const declarations=qa('[data-compass-room]');
const semanticRooms=[...new Map(declarations.map(el=>[el.dataset.roomId||`${el.dataset.wing}:${el.dataset.label}`,el])).values()];
const groups=new Map();semanticRooms.forEach(el=>{const w=el.dataset.wing||'';if(!groups.has(w))groups.set(w,[]);groups.get(w).push(el)});
let stateBar,roomLabel,roomNav;const localIndexByWing={};
if(scene){
 stateBar=document.createElement('div');stateBar.className='ap-cluster-state';stateBar.innerHTML='<span class="wing"></span><strong class="room"></strong><span class="count"></span>';scene.appendChild(stateBar);
 roomLabel=document.createElement('button');roomLabel.type='button';roomLabel.className='ap-room-label';scene.appendChild(roomLabel);
 roomNav=document.createElement('div');roomNav.className='ap-room-nav';roomNav.innerHTML='<button type="button" data-ap-room-prev aria-label="Previous room">←</button><button type="button" data-ap-room-open>Open</button><button type="button" data-ap-room-next aria-label="Next room">→</button><button type="button" data-ap-room-back aria-label="Return to constellation">↩</button>';scene.appendChild(roomNav);
}
const wingNames={north:'ORIENTATION',east:'WORLDS',south:'INSTRUMENTS',west:'FRONTIER'};
const activeWing=()=>root?.dataset.activeClusterWing||root?.dataset.selectedWing||root?.dataset.selectedCardinal||'';
const roomList=()=>groups.get(activeWing())||[];
const renderCluster=()=>{
 if(!root||!stateBar||!roomLabel||!roomNav)return;
 qa('.clone-cluster-semantic-layer').forEach(n=>n.setAttribute('hidden',''));
 const mode=root.dataset.compassMode||'CONSTELLATION',wing=activeWing(),rooms=roomList(),on=(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')&&rooms.length>0;
 stateBar.classList.toggle('is-active',on);roomLabel.classList.toggle('is-active',on);roomNav.classList.toggle('is-active',on);if(!on)return;
 const hasLocal=Number.isInteger(localIndexByWing[wing]);
 let idx=hasLocal?localIndexByWing[wing]:-1;
 if(idx<0){const wanted=root.dataset.selectedRoom||root.dataset.clusterPrimaryRoom||root.dataset.clusterPreviewPrimaryRoom||'';idx=rooms.findIndex(r=>r.dataset.roomId===wanted);if(idx<0)idx=0}
 idx=mod(idx,rooms.length);localIndexByWing[wing]=idx;
 const room=rooms[idx];q('.wing',stateBar).textContent=wingNames[wing]||wing;q('.room',stateBar).textContent=mode==='ROOM_SELECTED'?'Selected room':'Secondary constellation';q('.count',stateBar).textContent=`${String(idx+1).padStart(2,'0')} / ${String(rooms.length).padStart(2,'0')}`;
 roomLabel.dataset.roomId=room.dataset.roomId||'';roomLabel.innerHTML=`<small>${room.dataset.localCoordinate||'ESTATE ROOM'}</small><strong>${room.dataset.label||room.textContent.trim()}</strong><span>${room.dataset.localFunction||room.dataset.preview||''}</span>`;
};
const setPreviewIndex=(i,commit=false)=>{const wing=activeWing(),rooms=roomList();if(!wing||!rooms.length)return;localIndexByWing[wing]=mod(i,rooms.length);const room=rooms[localIndexByWing[wing]];if(commit)controller()?.requestRoomSelection?.(room.dataset.roomId);renderCluster()};
q('[data-ap-room-prev]',roomNav||document)?.addEventListener('click',()=>setPreviewIndex((localIndexByWing[activeWing()]??0)-1));q('[data-ap-room-next]',roomNav||document)?.addEventListener('click',()=>setPreviewIndex((localIndexByWing[activeWing()]??0)+1));q('[data-ap-room-open]',roomNav||document)?.addEventListener('click',()=>setPreviewIndex(localIndexByWing[activeWing()]??0,true));q('[data-ap-room-back]',roomNav||document)?.addEventListener('click',()=>controller()?.requestReturnToConstellation?.());roomLabel?.addEventListener('click',()=>setPreviewIndex(localIndexByWing[activeWing()]??0,true));
if(root){new MutationObserver(renderCluster).observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-active-cluster-wing','data-selected-wing','data-selected-cardinal','data-cluster-primary-room','data-cluster-preview-primary-room','data-selected-room']});renderCluster()}

const syncCardinals=()=>{if(!root)return;const readable=root.dataset.renderedForegroundCardinal||root.dataset.readableCardinal||root.dataset.orbitFocus||'north';qa('[data-compass-cardinal]',root).forEach(el=>{const on=(el.dataset.cardinalId||el.dataset.wing)===readable;el.classList.toggle('is-readable-cardinal',on);el.setAttribute('aria-current',on?'true':'false')})};if(root){new MutationObserver(syncCardinals).observe(root,{attributes:true,attributeFilter:['data-rendered-foreground-cardinal','data-readable-cardinal','data-orbit-focus']});syncCardinals()}

const qualify=()=>{
 const cloneController=document.documentElement.dataset.compassCloneController||'';
 const checks={
  sharedController:Boolean(controller()),
  acceptedCloneController:cloneController.includes('gen345'),
  compassRoot:Boolean(root),
  cardinalCount:qa('[data-compass-cardinal]',root||document).length===4,
  roomCount:semanticRooms.length===19,
  mirrorlandRouteCount:qa('[data-compass-mirrorland-routes] a').length>=4,
  capabilityCount:qa('[data-capability]').length===3,
  readinessFamilies:qa('[data-readiness-family]').length===2,
  provenanceCount:qa('.ap-award-card').length===5,
  oneLabelLayer:Boolean(roomLabel&&roomNav&&stateBar)
 };
 const pass=Object.values(checks).every(Boolean);
 const receipt={schema:'COMPASS_GEN347_EXCELLENCE_RUNTIME_RECEIPT_v1',build:BUILD,cloneController,checks,pass,status:pass?'QUALIFICATION_READY':'FUNCTIONAL_REPAIR_INCOMPLETE'};
 window.__COMPASS_AWARDS_PROVENANCE__={getRuntime:()=>receipt};
 document.documentElement.dataset.compassAwardsQualification=receipt.status;
 let mark=q('.ap-build-mark');if(!mark){mark=document.createElement('div');mark.className='ap-build-mark';document.body.appendChild(mark)}mark.textContent=pass?'GEN347 · FUNCTIONAL REPAIR · READY':'GEN347 · REPAIR INCOMPLETE';mark.title=JSON.stringify(checks);
 return receipt;
};
setTimeout(qualify,0);setTimeout(qualify,1200);
})();