(()=>{
'use strict';
const SOURCE='744961bd34be67a58037f685f2eda618dff58b10';
const BASE=`https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/${SOURCE}/assets/compass`;
const mod=(n,b)=>((n%b)+b)%b;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function load(src,key){return new Promise(r=>{if(globalThis[key])return r();const s=document.createElement('script');s.src=src;s.defer=true;s.onload=s.onerror=()=>r();document.head.append(s)})}
function mountCarousel(stage,defs,{objectMode=false}={}){
  const viewport=stage.querySelector('[data-viewport]'),ring=stage.querySelector('[data-ring]'),tabs=stage.querySelector('[data-tabs]'),caption=stage.querySelector('[data-caption]'),actions=stage.querySelector('[data-actions]');
  let index=0,drag=false,startX=0,startIndex=0,angle=0,suppress=0;const count=defs.length,step=360/count,radius=objectMode?255:230;
  const cards=defs.map((d,i)=>{const c=document.createElement('article');c.className='card';c.dataset.index=i;c.style.transform=`rotateY(${i*step}deg) translateZ(${radius}px)`;c.innerHTML=d.html;ring.append(c);const b=document.createElement('button');b.type='button';b.dataset.index=i;b.textContent=d.tab;b.setAttribute('aria-selected',i===0?'true':'false');tabs.append(b);return c});
  function sync(){cards.forEach((c,i)=>{const on=i===index;c.dataset.active=String(on);c.setAttribute('aria-hidden',on?'false':'true')});[...tabs.children].forEach((b,i)=>b.setAttribute('aria-selected',i===index?'true':'false'));caption.innerHTML=`<strong>${defs[index].title}</strong><span>${defs[index].body}</span>`;actions.replaceChildren();for(const [label,href] of (defs[index].actions||[])){const a=document.createElement('a');a.href=href;a.textContent=label;actions.append(a)};ring.style.setProperty('--ring-rotation',`${-index*step}deg`);if(objectMode)globalThis.CompassHouseScene?.setForeground?.(defs[index].id==='house')}
  function go(d){if(drag)return;index=mod(index+d,count);sync()}
  tabs.addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(!b)return;index=Number(b.dataset.index)||0;sync()});
  stage.querySelector('[data-prev]').onclick=()=>go(-1);stage.querySelector('[data-next]').onclick=()=>go(1);
  viewport.addEventListener('pointerdown',e=>{if((e.button!=null&&e.button!==0)||e.target.closest('a,button'))return;drag=true;startX=e.clientX;startIndex=index;angle=-index*step;viewport.dataset.dragging='true';viewport.setPointerCapture?.(e.pointerId);e.preventDefault()});
  viewport.addEventListener('pointermove',e=>{if(!drag)return;const width=Math.max(320,viewport.clientWidth);const delta=e.clientX-startX;ring.style.setProperty('--ring-rotation',`${angle+Math.max(-step*.92,Math.min(step*.92,(delta/width)*190))}deg`);e.preventDefault()});
  const end=e=>{if(!drag)return;drag=false;viewport.dataset.dragging='false';const dx=e.clientX-startX;index=Math.abs(dx)>Math.max(18,viewport.clientWidth*.055)?mod(startIndex+(dx<0?1:-1),count):startIndex;suppress=performance.now()+220;sync();e.preventDefault()};
  viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);stage.addEventListener('click',e=>{if(performance.now()<suppress&&!e.target.closest('a,button')){e.preventDefault();e.stopImmediatePropagation()}},true);stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowRight'?1:-1)}});
  sync();return {cards,get index(){return index}};
}
function mount(){
  const root=document.querySelector('[data-compass-root]');if(!root)return;
  document.querySelectorAll('[data-functional-lower-carousels]').forEach(n=>n.remove());
  const oldMonuments=document.querySelector('.compass-monuments'),oldBuilt=document.querySelector('.compass-built'),build=document.querySelector('.compass-build-cta');
  if(oldMonuments)oldMonuments.hidden=true;if(oldBuilt)oldBuilt.hidden=true;
  const host=document.createElement('section');host.className='dgb-lower';host.dataset.functionalLowerCarousels='v2';
  host.innerHTML=`<section class="dgb-carousel" tabindex="0" aria-label="Signature objects"><header class="carousel-head"><p>Three ways to engage</p><h2>Choose an object.</h2></header><div class="tabs" data-tabs></div><div class="viewport" data-viewport><div class="ring" data-ring></div></div><div class="carousel-copy" data-caption></div><nav class="carousel-actions" data-actions></nav><div class="carousel-controls"><button type="button" data-prev aria-label="Previous object">‹</button><button type="button" data-next aria-label="Next object">›</button></div><p class="orbit-note">Swipe the stage or use the controls.</p></section><section class="dgb-carousel dgb-carousel--proof" tabindex="0" aria-label="TRL and TRA"><header class="carousel-head"><p>Readiness</p><h2>Inspect the evidence.</h2></header><div class="tabs" data-tabs></div><div class="viewport" data-viewport><div class="ring" data-ring></div></div><div class="carousel-copy" data-caption></div><nav class="carousel-actions" data-actions></nav><div class="carousel-controls"><button type="button" data-prev aria-label="Previous readiness item">‹</button><button type="button" data-next aria-label="Next readiness item">›</button></div><p class="orbit-note">One item at a time. Swipe to rotate.</p></section>`;
  (build||oldBuilt||oldMonuments||root).insertAdjacentElement(build?'beforebegin':oldBuilt?'beforebegin':oldMonuments?'beforebegin':'beforeend',host);
  if(build){build.hidden=false;host.insertAdjacentElement('afterend',build)}
  const stages=host.querySelectorAll('.dgb-carousel');
  const objectDefs=[
    {id:'trophy',tab:'Trophy',title:'Awards & Recognition',body:'One body of work. Five reasons to look closer.',actions:[['Enter Awards','/showroom/globe/h-earth/awards/']],html:'<div class="object-frame"><canvas aria-label="Awards trophy"></canvas></div>'},
    {id:'house',tab:'House',title:'The House',body:'Choose who to speak with.',actions:[['Jeeves','/showroom/globe/hearth/jeeves/'],['Elara','/elara/'],['Auren','/products/auren/']],html:'<div class="object-frame"><canvas aria-label="The House"></canvas></div>'},
    {id:'brain',tab:'Brain',title:'Coheriscope',body:'Compare how you live and decide with what matters to you.',actions:[['Enter Coheriscope','/coherence-diagnostic/']],html:'<div class="object-frame"><canvas aria-label="Coheriscope brain"></canvas></div>'}
  ];
  const proofDefs=[
    {id:'trl',tab:'TRL',title:'Software TRL 7',body:'Demonstrated. Bounded. Inspectable. The current software platform is self-assessed at TRL 7; TRL 8 is not claimed.',actions:[['Inspect TRL evidence','/evidence/readiness/']],html:'<div class="proof-object"><span class="proof-kicker">TRL</span><strong>7</strong><span>Technology Readiness</span></div>'},
    {id:'tra',tab:'TRA',title:'TRA',body:'Inspect the readiness assessment and the evidence that supports the current disposition.',actions:[['Inspect readiness evidence','/evidence/']],html:'<div class="proof-object"><span class="proof-kicker">TRA</span><strong>✓</strong><span>Readiness Assessment</span></div>'}
  ];
  const first=mountCarousel(stages[0],objectDefs,{objectMode:true});mountCarousel(stages[1],proofDefs);
  Promise.all([load(`${BASE}/compass.trophy-scene.js`,'CompassTrophyScene'),load(`${BASE}/compass.house-scene.js`,'CompassHouseScene'),load(`${BASE}/compass.brain-scene.js`,'CompassBrainScene')]).then(()=>{globalThis.CompassTrophyScene?.mount?.(first.cards[0].querySelector('canvas'),{foreground:()=>first.index===0});globalThis.CompassHouseScene?.mount?.(first.cards[1].querySelector('canvas'),{foreground:()=>first.index===1});globalThis.CompassBrainScene?.mount?.(first.cards[2].querySelector('canvas'),{foreground:()=>first.index===2})});
  root.dataset.functionalLowerCarousels='MOUNTED_V2';globalThis.DGB_COMPASS_FUNCTIONAL_CAROUSELS=Object.freeze({structure:'methods-models-parity',objects:['trophy','house','brain'],readiness:['TRL','TRA'],duplicateLegacyHidden:true,compassStateOwnership:false});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();