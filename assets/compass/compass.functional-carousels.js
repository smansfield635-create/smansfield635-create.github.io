(()=>{
'use strict';
const SOURCE='744961bd34be67a58037f685f2eda618dff58b10';
const BASE=`https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/${SOURCE}/assets/compass`;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const mod=(v,n)=>((v%n)+n)%n;
function load(src,key){return new Promise(resolve=>{if(globalThis[key])return resolve(globalThis[key]);const s=document.createElement('script');s.src=src;s.defer=true;s.onload=()=>resolve(globalThis[key]);s.onerror=()=>resolve(null);document.head.append(s)})}
function purgeLegacy(){
  const selectors=['[data-capability-orbit]','.compass-capability-orbit','.compass-capability-cue','.compass-monuments','.compass-built'];
  selectors.forEach(sel=>document.querySelectorAll(sel).forEach(node=>node.remove()));
  document.querySelectorAll('[data-functional-lower-carousels]').forEach(node=>node.remove());
}
function shell({id,kicker,title,question,items}){
  const section=document.createElement('section');section.className='dgb-orbit';section.dataset.dgbOrbit=id;section.dataset.inspecting='false';
  section.innerHTML=`<header class="dgb-orbit__head"><div><p class="dgb-orbit__kicker">${kicker}</p><h2 data-orbit-title>${title}</h2><p data-orbit-question>${question}</p></div><div class="dgb-orbit__live" data-orbit-live></div></header><div class="dgb-orbit__tabs" role="tablist" data-orbit-tabs></div><div class="dgb-orbit__viewport" data-orbit-viewport tabindex="0"><div class="dgb-orbit__ring" data-orbit-ring></div></div><p class="dgb-orbit__note">Swipe horizontally or use the tabs. One object comes forward at a time.</p>`;
  const ring=section.querySelector('[data-orbit-ring]'),tabs=section.querySelector('[data-orbit-tabs]'),viewport=section.querySelector('[data-orbit-viewport]'),live=section.querySelector('[data-orbit-live]'),heading=section.querySelector('[data-orbit-title]'),prompt=section.querySelector('[data-orbit-question]');
  const count=items.length,step=360/count,cards=[];let index=0,angle=0,drag=false,pointer=null,startX=0,startAngle=0,startIndex=0,travel=0,suppress=false;
  function radius(){const w=Math.max(320,viewport.clientWidth||section.clientWidth||900);if(w<520)return Math.max(235,Math.min(300,w*.72));if(w<820)return Math.max(310,Math.min(420,w*.58));return Math.max(430,Math.min(620,w*.46))}
  function sync(reason='sync'){
    const r=radius();angle=-index*step;ring.style.setProperty('--orbit-rotation',`${angle}deg`);
    cards.forEach((card,i)=>{card.style.transform=`rotateY(${i*step}deg) translateZ(${r}px)`;const active=i===index;card.dataset.active=String(active);card.setAttribute('aria-hidden',String(!active));card.tabIndex=active?0:-1});
    [...tabs.children].forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
    const item=items[index];heading.textContent=item.title;prompt.textContent=item.question;live.textContent=`${item.label} · ${index+1} of ${count}`;
    section.dispatchEvent(new CustomEvent('dgb:orbit-change',{detail:{id,reason,index,item:item.id}}));
  }
  function select(next,reason='select'){if(drag)return;index=mod(next,count);sync(reason)}
  items.forEach((item,i)=>{
    const tab=document.createElement('button');tab.type='button';tab.className='dgb-orbit__tab';tab.role='tab';tab.dataset.index=i;tab.dataset.indexLabel=String(i+1).padStart(2,'0');tab.textContent=item.label;tabs.append(tab);
    const card=document.createElement('article');card.className='dgb-orbit__card';card.dataset.id=item.id;card.innerHTML=item.markup;ring.append(card);cards.push(card);
    tab.addEventListener('click',()=>select(i,'tab'));
  });
  tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home')select(0,'keyboard');else if(e.key==='End')select(count-1,'keyboard');else select(index+(e.key==='ArrowRight'?1:-1),'keyboard')});
  viewport.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||e.target.closest('a,button'))return;drag=true;pointer=e.pointerId;startX=e.clientX;startAngle=angle;startIndex=index;travel=0;viewport.dataset.dragging='true';viewport.setPointerCapture?.(pointer)});
  viewport.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==pointer)return;const dx=e.clientX-startX;travel=Math.max(travel,Math.abs(dx));const w=Math.max(320,viewport.clientWidth);ring.style.setProperty('--orbit-rotation',`${startAngle+(dx/w)*190}deg`)});
  function finish(e){if(!drag||e.pointerId!==pointer)return;const dx=e.clientX-startX;drag=false;viewport.dataset.dragging='false';viewport.releasePointerCapture?.(pointer);pointer=null;if(travel<8){sync('tap');return}if(Math.abs(dx)>Math.max(24,viewport.clientWidth*.055))index=mod(startIndex+(dx<0?1:-1),count);else index=startIndex;suppress=true;sync('drag')}
  viewport.addEventListener('pointerup',finish);viewport.addEventListener('pointercancel',finish);
  section.addEventListener('click',e=>{if(!suppress)return;suppress=false;if(!e.target.closest('a,button')){e.preventDefault();e.stopImmediatePropagation()}},true);
  section.addEventListener('keydown',e=>{if(e.target.closest('[role=tablist]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1),'stage-keyboard')}});
  addEventListener('resize',()=>sync('resize'),{passive:true});
  sync('init');
  return {section,cards,get index(){return index},select};
}
function objectMarkup(kind,kicker,title,body,action,href){return `<div class="dgb-orbit__surface dgb-object-card"><div class="dgb-object-card__visual" data-object-visual="${kind}"><canvas role="img" aria-label="${title}"></canvas></div><div class="dgb-object-card__copy"><p class="dgb-orbit__kicker">${kicker}</p><h3>${title}</h3><p>${body}</p><a class="dgb-orbit__action" href="${href}">${action}</a></div></div>`}
function readinessMarkup(kicker,title,signal,body,action,href){return `<div class="dgb-orbit__surface dgb-readiness-card"><div class="dgb-readiness-card__signal">${signal}</div><div><p class="dgb-orbit__kicker">${kicker}</p><h3>${title}</h3><p>${body}</p><a class="dgb-orbit__action" href="${href}">${action}</a></div></div>`}
async function mount(){
  const root=document.querySelector('[data-compass-root]');if(!root)return;
  purgeLegacy();
  const build=document.querySelector('.compass-build-cta');
  const host=document.createElement('section');host.className='dgb-lower-stack';host.dataset.functionalLowerCarousels='canonical-v2';
  const objectItems=[
    {id:'trophy',label:'Trophy',title:'Awards & Recognition',question:'Bring the trophy forward to enter the Awards layer.',markup:objectMarkup('trophy','Awards & Recognition','The Trophy','One body of work. Five reasons to look closer.','Explore the Awards Layer','/showroom/globe/h-earth/awards/')},
    {id:'house',label:'House',title:'Talk to the House',question:'Bring the House forward when you want a guide through the estate.',markup:objectMarkup('house','Ask for directions','The House','Use the House as the practical guide into the estate and its rooms.','Talk to Jeeves','/showroom/globe/hearth/jeeves/')},
    {id:'brain',label:'Brain',title:'Coheriscope',question:'Bring the brain forward to inspect personal alignment and coherence.',markup:objectMarkup('brain','Assessment','Coheriscope','Compare how you live and decide with what matters to you.','Enter Coheriscope','/coherence-diagnostic/')}
  ];
  const objectOrbit=shell({id:'objects',kicker:'Three ways to engage · one shared orbit',title:objectItems[0].title,question:objectItems[0].question,items:objectItems});
  const readinessItems=[
    {id:'trl',label:'TRL',title:'Software TRL 7',question:'Inspect the bounded maturity claim against published criteria.',markup:readinessMarkup('Technology Readiness Level','Software TRL 7','7','Self-assessed against published NASA software TRL criteria, with TRL 8 explicitly unclaimed.','Inspect TRL 7','/evidence/readiness/')},
    {id:'tra',label:'TRA',title:'Technology Readiness Assessment',question:'Inspect whether the evidence assigned to the readiness claim actually supports that claim.',markup:readinessMarkup('Technology Readiness Assessment','TRL Evidence Validation','TRA','Criterion, capability, evidence class, identity, and boundary remain tied together instead of being inferred from presentation.','Inspect the assessment','/evidence/readiness/validation/')}
  ];
  const readinessOrbit=shell({id:'readiness',kicker:'Readiness · one shared orbit',title:readinessItems[0].title,question:readinessItems[0].question,items:readinessItems});
  host.append(objectOrbit.section,readinessOrbit.section);
  if(build)build.before(host);else root.append(host);
  const [Brain,Trophy,House]=await Promise.all([load(`${BASE}/compass.brain-scene.js`,'CompassBrainScene'),load(`${BASE}/compass.trophy-scene.js`,'CompassTrophyScene'),load(`${BASE}/compass.house-scene.js`,'CompassHouseScene')]);
  const objectCards=objectOrbit.cards;
  Brain?.mount?.(objectCards[2].querySelector('canvas'),{foreground:()=>objectCards[2].dataset.active==='true'});
  Trophy?.mount?.(objectCards[0].querySelector('canvas'),{foreground:()=>objectCards[0].dataset.active==='true'});
  House?.mount?.(objectCards[1].querySelector('canvas'),{foreground:()=>objectCards[1].dataset.active==='true'});
  objectOrbit.section.addEventListener('dgb:orbit-change',()=>{House?.setForeground?.(objectCards[1].dataset.active==='true');Trophy?.activate?.()});
  root.dataset.functionalLowerCarousels='CANONICAL_TWO_ORBITS';
  globalThis.DGB_COMPASS_FUNCTIONAL_CAROUSELS=Object.freeze({version:'canonical-two-orbit-v2',legacyRemoved:true,orbitRoots:2,objects:['trophy','house','brain'],readiness:['trl','tra'],compassStateOwnership:false});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();