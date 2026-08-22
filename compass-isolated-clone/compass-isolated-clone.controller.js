(()=>{
'use strict';

const mod=(n,m)=>((n%m)+m)%m;
const bindSwipe=(node,onDelta,threshold=42)=>{
  if(!node)return;
  let startX=null,startY=null;
  node.addEventListener('pointerdown',e=>{if(e.target.closest('a,[data-no-swipe]'))return;startX=e.clientX;startY=e.clientY},{passive:true});
  node.addEventListener('pointerup',e=>{
    if(startX===null)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;startX=null;startY=null;
    if(Math.abs(dx)>threshold&&Math.abs(dx)>Math.abs(dy))onDelta(dx<0?1:-1);
  },{passive:true});
  node.addEventListener('pointercancel',()=>{startX=null;startY=null},{passive:true});
};

/* Development-only visual layer. Keep the isolated page self-contained rather than
   changing the shared Compass production assets. */
const style=document.createElement('style');
style.dataset.cloneCarouselDisclosure='gen341';
style.textContent=`
.clone-disclosure-toggle{grid-column:1/-1;width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.45rem 1rem;align-items:center;padding:0 0 1rem;margin:0 0 .35rem;border:0;border-bottom:1px solid var(--clone-line);background:transparent;color:inherit;text-align:left;cursor:pointer}
.clone-disclosure-toggle .clone-kicker{grid-column:1}.clone-disclosure-toggle strong{grid-column:1;font-family:Georgia,serif;font-size:clamp(1.45rem,3vw,2.4rem);line-height:1}.clone-disclosure-toggle span:last-child{grid-column:2;grid-row:1/3;align-self:center;padding:.5rem .7rem;border:1px solid var(--clone-line);border-radius:999px;color:var(--clone-muted);font-size:.72rem;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
.clone-section.is-collapsed{padding-top:22px;padding-bottom:22px}.clone-section.is-collapsed>*:not(.clone-disclosure-toggle){display:none!important}.clone-section.is-collapsed .clone-disclosure-toggle{margin:0;padding-bottom:0;border-bottom-color:transparent}
.clone-capabilities{position:relative;min-height:clamp(570px,72vh,760px);overflow:hidden}.clone-capabilities .clone-section-heading{position:relative;z-index:3}.clone-capabilities .clone-carousel{position:relative;height:clamp(300px,38vw,410px);display:block!important;perspective:1800px;touch-action:pan-y;overflow:visible}.clone-capabilities .clone-card{position:absolute;left:50%;top:50%;width:min(72vw,360px);height:clamp(230px,28vw,310px);min-height:0!important;margin:0 0 0 min(-36vw,-180px);padding:24px;border-radius:28px;transform-style:preserve-3d;transform-origin:center;transition:transform .42s cubic-bezier(.2,.75,.2,1),opacity .3s ease,filter .3s ease,border-color .3s ease,box-shadow .3s ease;background:linear-gradient(145deg,rgba(13,26,39,.94),rgba(5,12,20,.94));box-shadow:0 26px 70px rgba(0,0,0,.42);overflow:hidden}.clone-capabilities .clone-card::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 20% 12%,rgba(242,213,138,.13),transparent 34%),linear-gradient(125deg,transparent 55%,rgba(137,227,255,.06))}.clone-capabilities .clone-card>*{position:relative;z-index:1}.clone-capabilities .clone-card-icon{display:grid!important;place-items:center;width:74px;height:74px;margin:0 0 18px;border:1px solid rgba(242,213,138,.32);border-radius:50%;background:rgba(242,213,138,.06);font-size:2.2rem;line-height:1}.clone-capabilities .clone-card strong{margin-top:0!important;font-size:clamp(1.65rem,3.5vw,2.35rem)}.clone-capabilities .clone-card small{font-size:.86rem}.clone-capabilities .clone-card.is-active{border-color:rgba(242,213,138,.76);box-shadow:0 34px 90px rgba(0,0,0,.52),0 0 42px rgba(242,213,138,.08)}.clone-capabilities .clone-card:not(.is-active){filter:saturate(.78) brightness(.82)}
.clone-capability-detail{display:none!important}.clone-capabilities.is-inspecting{overflow:visible}.clone-capabilities.is-inspecting .clone-carousel{opacity:.12;pointer-events:none}.clone-capabilities.is-inspecting .clone-section-heading{opacity:.16}.clone-capabilities.is-inspecting .clone-capability-detail{display:grid!important;position:fixed;z-index:80;left:50%;top:50%;width:min(92vw,720px);height:min(72dvh,640px);max-height:72dvh;transform:translate(-50%,-50%);margin:0;padding:clamp(28px,5vw,48px);overflow:auto;border-color:rgba(242,213,138,.44);background:linear-gradient(145deg,rgba(12,24,36,.985),rgba(3,8,14,.99));box-shadow:0 45px 130px rgba(0,0,0,.75),0 0 0 9999px rgba(1,3,7,.78);backdrop-filter:blur(20px)}.clone-capability-return{position:absolute;right:18px;top:18px;padding:.62rem .8rem;border:1px solid var(--clone-line);border-radius:999px;background:rgba(255,255,255,.04);color:inherit;font:850 .72rem/1 Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}.clone-capability-detail h3{max-width:15ch;font-size:clamp(2.2rem,6vw,4.7rem)}.clone-capability-detail p{max-width:58ch;font-size:clamp(1rem,2vw,1.12rem)}
.clone-capability-orbit-note{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:max-content;max-width:90%;margin:0;color:rgba(232,231,222,.48);font-size:.75rem;letter-spacing:.06em;text-align:center}
@media(max-width:760px){.clone-capabilities{min-height:610px}.clone-capabilities .clone-carousel{height:360px}.clone-capabilities .clone-card{width:min(78vw,330px);margin-left:min(-39vw,-165px)}.clone-capabilities .clone-card-icon{width:62px;height:62px;font-size:1.9rem}.clone-capabilities.is-inspecting .clone-capability-detail{width:min(94vw,34rem);height:min(76dvh,650px);max-height:76dvh;padding:28px 22px}}
@media(prefers-reduced-motion:reduce){.clone-capabilities .clone-card{transition:none!important}}
`;
document.head.appendChild(style);

const statements=[...document.querySelectorAll('[data-statement]')];
const statementHost=document.querySelector('[data-statement-carousel]');
let statementIndex=0;
const showStatement=i=>{
  if(!statements.length)return;
  statementIndex=mod(i,statements.length);
  statements.forEach((el,n)=>{
    const active=n===statementIndex;
    el.classList.toggle('is-active',active);
    el.setAttribute('aria-hidden',String(!active));
  });
};
bindSwipe(statementHost,d=>showStatement(statementIndex+d));
statementHost?.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){e.preventDefault();showStatement(statementIndex+1)}
  if(e.key==='ArrowLeft'){e.preventDefault();showStatement(statementIndex-1)}
  if(e.key==='Home'){e.preventDefault();showStatement(0)}
  if(e.key==='End'){e.preventDefault();showStatement(statements.length-1)}
});
showStatement(0);

/* Progressive disclosure follows the Laws-page precedent: the primary experience stays
   visible while supporting sections stop reading as one uninterrupted long page. */
const disclosureSections=[
  {node:document.querySelector('.clone-video'),label:'Introduction',collapsed:true},
  {node:document.querySelector('.clone-readiness'),label:'Readiness',collapsed:true},
  {node:document.querySelector('.clone-destinations'),label:'Destinations',collapsed:true}
].filter(x=>x.node);
const setDisclosure=(entry,open)=>{
  entry.node.classList.toggle('is-collapsed',!open);
  const button=entry.node.querySelector(':scope > .clone-disclosure-toggle');
  if(button){button.setAttribute('aria-expanded',String(open));button.querySelector('[data-disclosure-state]').textContent=open?'Close':'Open'}
};
disclosureSections.forEach(entry=>{
  const heading=entry.node.querySelector('h2')?.textContent?.trim()||entry.label;
  const button=document.createElement('button');
  button.type='button';button.className='clone-disclosure-toggle';button.setAttribute('aria-expanded',String(!entry.collapsed));
  button.innerHTML=`<span class="clone-kicker">${entry.label}</span><strong>${heading}</strong><span data-disclosure-state>${entry.collapsed?'Open':'Close'}</span>`;
  button.addEventListener('click',()=>{
    const opening=entry.node.classList.contains('is-collapsed');
    if(opening)disclosureSections.forEach(other=>{if(other!==entry)setDisclosure(other,false)});
    setDisclosure(entry,opening);
  });
  entry.node.prepend(button);setDisclosure(entry,!entry.collapsed);
});

const capabilities={
  brain:{verb:'Understand',k:'ASSESSMENT',t:'Coherence Diagnostic',c:'Compare what matters to you with how you are actually living and deciding. See alignment, tension, and repeated mismatch.',h:'/coherence-diagnostic/',a:'Run the diagnostic →',icon:'🧠'},
  trophy:{verb:'Explore',k:'AWARDS & RECOGNITION',t:'One body of work. Five reasons to look closer.',c:'Explore the estate as experience, native craft, governed construction, continuity and recovery, and an integrated platform.',h:'/showroom/globe/h-earth/awards/',a:'Explore the Awards Layer →',icon:'🏆'},
  house:{verb:'Ask',k:'ASK FOR DIRECTIONS',t:'Talk to the House',c:'Tell the House what you are trying to understand or do. It points toward the room, tool, or experience most likely to help.',h:'/showroom/globe/hearth/jeeves/',a:'Ask the House →',icon:'⌂'}
};
const capabilityButtons=[...document.querySelectorAll('[data-capability]')];
const capabilityHost=document.querySelector('[data-capability-carousel]');
const capabilitySection=document.querySelector('.clone-capabilities');
const capabilityDetail=document.querySelector('[data-capability-detail]');
const capabilityHeading=document.querySelector('[data-capability-region-heading]');
let capabilityIndex=0,capabilityInspecting=false;

capabilityHost?.setAttribute('aria-roledescription','carousel');
capabilitySection?.setAttribute('data-inspecting','false');
capabilityButtons.forEach(btn=>{
  const d=capabilities[btn.dataset.capability];
  if(d&&!btn.querySelector('.clone-card-icon')){
    const icon=document.createElement('span');icon.className='clone-card-icon';icon.setAttribute('aria-hidden','true');icon.textContent=d.icon;btn.prepend(icon);
  }
});
if(capabilitySection&&!capabilitySection.querySelector('.clone-capability-orbit-note')){
  const note=document.createElement('p');note.className='clone-capability-orbit-note';note.textContent='Drag or swipe one position at a time. Tap the front card to inspect it.';capabilitySection.appendChild(note);
}
let returnButton=null;
if(capabilityDetail){
  returnButton=document.createElement('button');returnButton.type='button';returnButton.className='clone-capability-return';returnButton.dataset.noSwipe='true';returnButton.textContent='Return to Orbit';returnButton.addEventListener('click',()=>setCapabilityInspecting(false));capabilityDetail.prepend(returnButton);
}
const orbitDelta=(n,current,total)=>{
  let d=n-current;
  if(d>total/2)d-=total;
  if(d<-total/2)d+=total;
  return d;
};
const layoutCapabilityOrbit=()=>{
  const narrow=matchMedia('(max-width:760px)').matches;
  capabilityButtons.forEach((btn,n)=>{
    const d=orbitDelta(n,capabilityIndex,capabilityButtons.length);
    const active=d===0;
    const x=(narrow?58:68)*d;
    const z=active?120:-100;
    const yRot=active?0:-d*30;
    const scale=active?1:.80;
    btn.style.transform=`translate3d(${x}%, -50%, ${z}px) rotateY(${yRot}deg) scale(${scale})`;
    btn.style.zIndex=String(active?5:3-Math.abs(d));
    btn.style.opacity=String(active?1:.58);
  });
};
const setCapabilityInspecting=open=>{
  capabilityInspecting=Boolean(open);
  capabilitySection?.classList.toggle('is-inspecting',capabilityInspecting);
  capabilitySection?.setAttribute('data-inspecting',String(capabilityInspecting));
  capabilityDetail?.setAttribute('aria-hidden',String(!capabilityInspecting));
  if(capabilityInspecting){document.body.style.overflow='hidden';returnButton?.focus({preventScroll:true})}
  else{document.body.style.removeProperty('overflow');capabilityButtons[capabilityIndex]?.focus({preventScroll:true})}
};
const selectCapability=(index,{focus=false,inspect=false}={})=>{
  if(!capabilityButtons.length||!capabilityDetail)return;
  capabilityIndex=mod(index,capabilityButtons.length);
  capabilityButtons.forEach((btn,n)=>{
    const active=n===capabilityIndex;
    btn.classList.toggle('is-active',active);
    btn.setAttribute('aria-selected',String(active));
    btn.tabIndex=active?0:-1;
  });
  const btn=capabilityButtons[capabilityIndex],d=capabilities[btn.dataset.capability];
  capabilityDetail.querySelector('[data-capability-kicker]').textContent=d.k;
  capabilityDetail.querySelector('[data-capability-title]').textContent=d.t;
  capabilityDetail.querySelector('[data-capability-copy]').textContent=d.c;
  const link=capabilityDetail.querySelector('[data-capability-link]');link.href=d.h;link.textContent=d.a;
  if(capabilityHeading)capabilityHeading.textContent=`${d.verb} · ${d.t}`;
  layoutCapabilityOrbit();
  if(inspect)setCapabilityInspecting(true);
  if(focus&&!inspect)btn.focus({preventScroll:true});
};
capabilityButtons.forEach((btn,n)=>{
  btn.addEventListener('click',()=>{
    if(capabilityInspecting)return;
    if(n===capabilityIndex)selectCapability(n,{inspect:true});
    else selectCapability(n,{focus:true});
  });
  btn.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();selectCapability(capabilityIndex+1,{focus:true})}
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();selectCapability(capabilityIndex-1,{focus:true})}
    if(e.key==='Home'){e.preventDefault();selectCapability(0,{focus:true})}
    if(e.key==='End'){e.preventDefault();selectCapability(capabilityButtons.length-1,{focus:true})}
    if((e.key==='Enter'||e.key===' ')&&n===capabilityIndex){e.preventDefault();selectCapability(n,{inspect:true})}
  });
});
bindSwipe(capabilityHost,d=>{if(!capabilityInspecting)selectCapability(capabilityIndex+d)});
addEventListener('resize',layoutCapabilityOrbit,{passive:true});
addEventListener('keydown',e=>{if(e.key==='Escape'&&capabilityInspecting){e.preventDefault();setCapabilityInspecting(false)}});
selectCapability(0);
setCapabilityInspecting(false);

const readiness={
  trl:['Basic principles observed','Technology concept formulated','Experimental proof of concept','Technology validated in laboratory','Technology validated in relevant environment','Technology demonstrated in relevant environment','System prototype demonstrated','System complete and qualified','Actual system proven in operation'],
  tra:['Need and context framed','Stakeholders and constraints mapped','Adoption hypothesis formed','Operational fit tested','Evidence package assembled','Integration pathway demonstrated','Governance and ownership aligned','Deployment readiness qualified','Sustained adoption demonstrated']
};
const readinessDescriptions={
  trl:'A technology-readiness view of how far the capability has moved from principle toward demonstrated operation.',
  tra:'An adoption-readiness view of whether the capability can be understood, integrated, governed, and sustained in practice.'
};
const familyButtons=[...document.querySelectorAll('[data-readiness-family]')];
const readinessTrack=document.querySelector('[data-readiness-track]');
const readinessRegion=document.querySelector('[data-readiness-region]');
const readinessHeading=document.querySelector('[data-readiness-region-heading]');
let family='trl',level=0;
const renderReadiness=({focus=false}={})=>{
  if(!readinessTrack)return;
  readinessTrack.innerHTML='';
  readiness[family].forEach((label,i)=>{
    const b=document.createElement('button');b.type='button';b.textContent=String(i+1);b.setAttribute('role','tab');b.setAttribute('aria-label',`${family.toUpperCase()} ${i+1}: ${label}`);b.setAttribute('aria-selected',String(i===level));b.tabIndex=i===level?0:-1;b.classList.toggle('is-active',i===level);
    b.addEventListener('click',()=>{level=i;renderReadiness()});
    b.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();level=mod(level+1,readiness[family].length);renderReadiness({focus:true})}
      if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();level=mod(level-1,readiness[family].length);renderReadiness({focus:true})}
      if(e.key==='Home'){e.preventDefault();level=0;renderReadiness({focus:true})}
      if(e.key==='End'){e.preventDefault();level=readiness[family].length-1;renderReadiness({focus:true})}
    });
    readinessTrack.appendChild(b);
  });
  familyButtons.forEach(btn=>{const active=btn.dataset.readinessFamily===family;btn.classList.toggle('is-active',active);btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1});
  const title=readiness[family][level];
  document.querySelector('[data-readiness-label]').textContent=`${family.toUpperCase()} · ${level+1}`;
  document.querySelector('[data-readiness-title]').textContent=title;
  document.querySelector('[data-readiness-copy]').textContent=readinessDescriptions[family];
  if(readinessHeading)readinessHeading.textContent=`${family.toUpperCase()} ${level+1} · ${title}`;
  if(focus)readinessTrack.querySelector('.is-active')?.focus({preventScroll:true});
};
familyButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{family=btn.dataset.readinessFamily;level=0;renderReadiness()});
  btn.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'||e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();const current=familyButtons.indexOf(btn);const delta=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1;const next=familyButtons[mod(current+delta,familyButtons.length)];family=next.dataset.readinessFamily;level=0;renderReadiness();next.focus({preventScroll:true});
    }
  });
});
bindSwipe(readinessRegion,d=>{level=mod(level+d,readiness[family].length);renderReadiness()});
renderReadiness();

const root=document.querySelector('[data-compass-root]');
const scene=root?.querySelector('[data-compass-scene]');
const inlineMirrorBack=root?.querySelector('[data-compass-mirrorland-inline-back]');
const canonicalMirrorBack=root?.querySelector('[data-compass-mirrorland-back]');
if(inlineMirrorBack&&canonicalMirrorBack)inlineMirrorBack.addEventListener('click',event=>{event.preventDefault();canonicalMirrorBack.click()});

if(root&&scene){
  const room=id=>root.querySelector(`[data-compass-room-declarations] [data-compass-room][data-room-id="${CSS.escape(String(id||''))}"]`);
  const projectedRoomLabel=document.createElement('div');
  projectedRoomLabel.className='compass-projected-room-label';projectedRoomLabel.dataset.compassProjectedRoomLabel='true';projectedRoomLabel.dataset.roomId='';projectedRoomLabel.setAttribute('aria-hidden','true');projectedRoomLabel.hidden=true;scene.appendChild(projectedRoomLabel);
  let raf=0;
  const renderProjectedRoomLabel=()=>{
    const mode=root.dataset.compassMode||'';
    const id=(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')?(root.dataset.selectedRoom||root.dataset.clusterPreviewPrimaryRoom||root.dataset.clusterPrimaryRoom||''):'';
    const declaration=id?room(id):null;
    const escaped=id?CSS.escape(id):'';
    const proxy=id?root.querySelector(`[data-compass-room-proxy][data-room-id="${escaped}"]`):null;
    if(!id||!declaration||!proxy){projectedRoomLabel.hidden=true;projectedRoomLabel.textContent='';projectedRoomLabel.dataset.roomId='';raf=requestAnimationFrame(renderProjectedRoomLabel);return}
    const label=(declaration.dataset.label||'').trim(),sceneRect=scene.getBoundingClientRect(),proxyRect=proxy.getBoundingClientRect();
    if(!label||proxyRect.width<=0||proxyRect.height<=0){projectedRoomLabel.hidden=true;projectedRoomLabel.textContent='';projectedRoomLabel.dataset.roomId=id;raf=requestAnimationFrame(renderProjectedRoomLabel);return}
    projectedRoomLabel.textContent=label;projectedRoomLabel.dataset.roomId=id;projectedRoomLabel.style.left=`${proxyRect.left+proxyRect.width/2-sceneRect.left}px`;projectedRoomLabel.style.top=`${proxyRect.bottom-sceneRect.top+6}px`;projectedRoomLabel.hidden=false;raf=requestAnimationFrame(renderProjectedRoomLabel);
  };
  raf=requestAnimationFrame(renderProjectedRoomLabel);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf)}else{raf=requestAnimationFrame(renderProjectedRoomLabel)}});
}

const roomCount=root?.querySelectorAll('[data-compass-room-declarations] [data-compass-room]').length||0;
globalThis.CompassIsolatedClone=Object.freeze({version:'gen341-carousel-disclosure-1',productionMutationAuthorized:false,developmentInspectionOnly:true,carouselModel:'PUBLIC_LEGITIMACY_ONE_SHARED_ORBIT_INSPECTION_GRAMMAR',progressiveDisclosure:true,roomDeclarationCount:roomCount,mirrorlandRouteCount:root?.querySelectorAll('[data-compass-mirrorland-routes] a').length||0});
})();
