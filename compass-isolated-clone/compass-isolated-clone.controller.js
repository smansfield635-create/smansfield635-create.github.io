(()=>{
'use strict';

const BUILD='gen343-production-convergence-1';
const root=document.querySelector('[data-compass-root]');
const mod=(n,m)=>((n%m)+m)%m;

/*
  Clone-local behavior is intentionally limited to editorial presentation.
  The shared Compass controller remains the sole owner of Compass mode,
  selection, navigation, room state, orbit settlement and Mirrorland lifecycle.
*/
document.documentElement.dataset.compassCloneController=BUILD;

const bindSwipe=(node,onDelta,threshold=42)=>{
  if(!node)return;
  let sx=null,sy=null;
  node.addEventListener('pointerdown',e=>{
    if(e.target.closest('a,button,[data-no-swipe]'))return;
    sx=e.clientX;sy=e.clientY;
  },{passive:true});
  node.addEventListener('pointerup',e=>{
    if(sx===null)return;
    const dx=e.clientX-sx,dy=e.clientY-sy;
    sx=sy=null;
    if(Math.abs(dx)>threshold&&Math.abs(dx)>Math.abs(dy))onDelta(dx<0?1:-1);
  },{passive:true});
  node.addEventListener('pointercancel',()=>{sx=sy=null},{passive:true});
};

/* Clone-only presentation rules. No Compass star/room geometry is owned here. */
const style=document.createElement('style');
style.dataset.cloneProductionConvergence=BUILD;
style.textContent=`
.clone-disclosure-toggle{grid-column:1/-1;width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.45rem 1rem;align-items:center;padding:0 0 1rem;margin:0 0 .35rem;border:0;border-bottom:1px solid var(--clone-line);background:transparent;color:inherit;text-align:left;cursor:pointer}.clone-disclosure-toggle .clone-kicker{grid-column:1}.clone-disclosure-toggle strong{grid-column:1;font-family:Georgia,serif;font-size:clamp(1.45rem,3vw,2.4rem);line-height:1}.clone-disclosure-toggle span:last-child{grid-column:2;grid-row:1/3;align-self:center;padding:.5rem .7rem;border:1px solid var(--clone-line);border-radius:999px;color:var(--clone-muted);font-size:.72rem;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.clone-section.is-collapsed{padding-top:22px;padding-bottom:22px}.clone-section.is-collapsed>*:not(.clone-disclosure-toggle){display:none!important}.clone-section.is-collapsed .clone-disclosure-toggle{margin:0;padding-bottom:0;border-bottom-color:transparent}
.clone-capabilities{position:relative;min-height:clamp(570px,72vh,760px);overflow:hidden}.clone-capabilities .clone-section-heading{position:relative;z-index:3}.clone-capabilities .clone-carousel{position:relative;height:clamp(310px,40vw,430px);display:block!important;perspective:1800px;touch-action:pan-y;overflow:visible}.clone-capabilities .clone-card{position:absolute!important;left:50%!important;top:50%!important;width:min(72vw,360px)!important;height:clamp(240px,29vw,320px)!important;min-height:0!important;margin:0 0 0 min(-36vw,-180px)!important;padding:24px!important;border-radius:28px!important;transform-style:preserve-3d;transform-origin:center;transition:transform .34s cubic-bezier(.2,.75,.2,1),opacity .25s ease,filter .25s ease,border-color .25s ease,box-shadow .25s ease;background:linear-gradient(145deg,rgba(13,26,39,.96),rgba(5,12,20,.96))!important;box-shadow:0 26px 70px rgba(0,0,0,.42)!important;overflow:hidden}.clone-capabilities .clone-card::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 20% 12%,rgba(242,213,138,.14),transparent 34%),linear-gradient(125deg,transparent 55%,rgba(137,227,255,.07))}.clone-capabilities .clone-card>*{position:relative;z-index:1}.clone-capabilities .clone-card-icon{display:grid!important;place-items:center;width:76px;height:76px;margin:0 0 18px;border:1px solid rgba(242,213,138,.34);border-radius:50%;background:rgba(242,213,138,.07);font-size:2.25rem;line-height:1}.clone-capabilities .clone-card strong{margin-top:0!important;font-size:clamp(1.65rem,3.5vw,2.35rem)!important}.clone-capabilities .clone-card small{font-size:.86rem}.clone-capabilities .clone-card.is-active{border-color:rgba(242,213,138,.82)!important;box-shadow:0 34px 90px rgba(0,0,0,.52),0 0 42px rgba(242,213,138,.10)!important}.clone-capabilities .clone-card:not(.is-active){filter:saturate(.72) brightness(.72)}.clone-capability-detail{display:none!important}.clone-capabilities.is-inspecting .clone-carousel{opacity:.10;pointer-events:none}.clone-capabilities.is-inspecting .clone-section-heading{opacity:.14}.clone-capabilities.is-inspecting .clone-capability-detail{display:grid!important;position:fixed!important;z-index:80;left:50%;top:50%;width:min(92vw,720px);height:min(72dvh,640px);max-height:72dvh;transform:translate(-50%,-50%);margin:0!important;padding:clamp(28px,5vw,48px)!important;overflow:auto;border-color:rgba(242,213,138,.44)!important;background:linear-gradient(145deg,rgba(12,24,36,.99),rgba(3,8,14,.995))!important;box-shadow:0 45px 130px rgba(0,0,0,.75),0 0 0 9999px rgba(1,3,7,.80)!important;backdrop-filter:blur(18px)}.clone-capability-return{position:absolute;right:18px;top:18px;padding:.62rem .8rem;border:1px solid var(--clone-line);border-radius:999px;background:rgba(255,255,255,.04);color:inherit;font:850 .72rem/1 Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}.clone-capability-detail h3{max-width:15ch;font-size:clamp(2.2rem,6vw,4.7rem)!important}.clone-capability-detail p{max-width:58ch;font-size:clamp(1rem,2vw,1.12rem)}.clone-capability-orbit-note{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);width:max-content;max-width:90%;margin:0;color:rgba(232,231,222,.50);font-size:.75rem;letter-spacing:.06em;text-align:center}
.compass-clone-mirrorland-portal{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:clamp(18px,4vw,48px);pointer-events:none}.compass-clone-mirrorland-portal::before{content:"";position:absolute;inset:0;background:rgba(1,4,8,.70);backdrop-filter:blur(7px) saturate(.72)}.compass-clone-mirrorland-portal>[data-compass-mirrorland-routes]{position:relative!important;inset:auto!important;z-index:1!important;display:block!important;width:min(92vw,760px)!important;max-height:min(82dvh,720px)!important;overflow:auto!important;margin:0!important;padding:clamp(28px,5vw,52px)!important;border:1px solid rgba(244,214,128,.44)!important;border-radius:28px!important;background:linear-gradient(145deg,rgba(10,22,32,.99),rgba(3,8,14,.995))!important;box-shadow:0 42px 120px rgba(0,0,0,.72),0 0 52px rgba(244,214,128,.10)!important;filter:none!important;backdrop-filter:none!important;pointer-events:auto!important}.compass-clone-mirrorland-portal>[data-compass-mirrorland-routes] nav{display:grid!important;gap:.8rem!important}.compass-clone-mirrorland-portal>[data-compass-mirrorland-routes] a{display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:58px!important;padding:.9rem 1rem!important;border:1px solid rgba(244,214,128,.24)!important;border-radius:16px!important;background:rgba(244,214,128,.045)!important;color:inherit!important;text-decoration:none!important}.compass-clone-mirrorland-portal>[data-compass-mirrorland-routes] a:focus-visible{outline:2px solid rgba(244,214,128,.9)!important;outline-offset:3px!important}
@media(max-width:760px){.clone-capabilities{min-height:620px}.clone-capabilities .clone-carousel{height:380px}.clone-capabilities .clone-card{width:min(78vw,330px)!important;margin-left:min(-39vw,-165px)!important}.clone-capabilities .clone-card-icon{width:64px;height:64px;font-size:1.9rem}.clone-capabilities.is-inspecting .clone-capability-detail{width:min(94vw,34rem);height:min(76dvh,650px);max-height:76dvh;padding:28px 22px!important}}
@media(prefers-reduced-motion:reduce){.clone-capabilities .clone-card{transition:none!important}}
`;
document.head.appendChild(style);

/* 1. Editorial statement carousel. */
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

/* 2. Progressive disclosure remains clone editorial state only. */
const disclosureSections=[
  {node:document.querySelector('.clone-video'),label:'Introduction'},
  {node:document.querySelector('.clone-readiness'),label:'Readiness'},
  {node:document.querySelector('.clone-destinations'),label:'Destinations'}
].filter(x=>x.node);
const setDisclosure=(entry,open)=>{
  entry.node.classList.toggle('is-collapsed',!open);
  const b=entry.node.querySelector(':scope > .clone-disclosure-toggle');
  if(b){
    b.setAttribute('aria-expanded',String(open));
    const state=b.querySelector('[data-disclosure-state]');
    if(state)state.textContent=open?'Close':'Open';
  }
};
disclosureSections.forEach(entry=>{
  const heading=entry.node.querySelector('h2')?.textContent?.trim()||entry.label;
  const b=document.createElement('button');
  b.type='button';
  b.className='clone-disclosure-toggle';
  b.innerHTML=`<span class="clone-kicker">${entry.label}</span><strong>${heading}</strong><span data-disclosure-state>Open</span>`;
  b.addEventListener('click',()=>{
    const opening=entry.node.classList.contains('is-collapsed');
    if(opening)disclosureSections.forEach(other=>{if(other!==entry)setDisclosure(other,false)});
    setDisclosure(entry,opening);
  });
  entry.node.prepend(b);
  setDisclosure(entry,false);
});

/* 3. Capability surface follows the estate one-stage/one-active-card grammar.
      It does not read or write any Compass controller state. */
const capabilityData={
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
capabilityButtons.forEach(btn=>{
  const d=capabilityData[btn.dataset.capability];
  if(d&&!btn.querySelector('.clone-card-icon')){
    const icon=document.createElement('span');
    icon.className='clone-card-icon';icon.setAttribute('aria-hidden','true');icon.textContent=d.icon;btn.prepend(icon);
  }
});
if(capabilitySection&&!capabilitySection.querySelector('.clone-capability-orbit-note')){
  const n=document.createElement('p');n.className='clone-capability-orbit-note';n.textContent='Swipe one position at a time. Open the front card to inspect it.';capabilitySection.appendChild(n);
}
let capabilityReturn=null;
if(capabilityDetail){
  capabilityReturn=document.createElement('button');capabilityReturn.type='button';capabilityReturn.className='clone-capability-return';capabilityReturn.dataset.noSwipe='true';capabilityReturn.textContent='Return to Orbit';capabilityDetail.prepend(capabilityReturn);
}
const orbitDelta=(n,current,total)=>{let d=n-current;if(d>total/2)d-=total;if(d<-total/2)d+=total;return d};
const layoutCapabilityOrbit=()=>{
  const narrow=matchMedia('(max-width:760px)').matches;
  capabilityButtons.forEach((btn,n)=>{
    const d=orbitDelta(n,capabilityIndex,capabilityButtons.length),active=d===0;
    const x=(narrow?58:68)*d,z=active?120:-100,yRot=active?0:-d*30,scale=active?1:.80;
    btn.style.transform=`translate3d(${x}%, -50%, ${z}px) rotateY(${yRot}deg) scale(${scale})`;
    btn.style.zIndex=String(active?5:3-Math.abs(d));btn.style.opacity=String(active?1:.55);
  });
};
const setCapabilityInspecting=open=>{
  capabilityInspecting=!!open;
  capabilitySection?.classList.toggle('is-inspecting',capabilityInspecting);
  capabilitySection?.setAttribute('data-inspecting',String(capabilityInspecting));
  capabilityDetail?.setAttribute('aria-hidden',String(!capabilityInspecting));
  if(open)capabilityReturn?.focus({preventScroll:true});
};
capabilityReturn?.addEventListener('click',()=>{setCapabilityInspecting(false);capabilityButtons[capabilityIndex]?.focus({preventScroll:true})});
const selectCapability=(index,{focus=false,inspect=false}={})=>{
  if(!capabilityButtons.length||!capabilityDetail)return;
  capabilityIndex=mod(index,capabilityButtons.length);
  capabilityButtons.forEach((btn,n)=>{const active=n===capabilityIndex;btn.classList.toggle('is-active',active);btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1});
  const btn=capabilityButtons[capabilityIndex],d=capabilityData[btn.dataset.capability];
  if(!d)return;
  capabilityDetail.querySelector('[data-capability-kicker]')?.replaceChildren(d.k);
  capabilityDetail.querySelector('[data-capability-title]')?.replaceChildren(d.t);
  capabilityDetail.querySelector('[data-capability-copy]')?.replaceChildren(d.c);
  const link=capabilityDetail.querySelector('[data-capability-link]');if(link){link.href=d.h;link.textContent=d.a}
  if(capabilityHeading)capabilityHeading.textContent=`${d.verb} · ${d.t}`;
  layoutCapabilityOrbit();if(inspect)setCapabilityInspecting(true);if(focus&&!inspect)btn.focus({preventScroll:true});
};
capabilityButtons.forEach((btn,n)=>{
  btn.addEventListener('click',()=>{if(capabilityInspecting)return;if(n===capabilityIndex)selectCapability(n,{inspect:true});else selectCapability(n,{focus:true})});
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
addEventListener('keydown',e=>{if(e.key==='Escape'&&capabilityInspecting){e.preventDefault();setCapabilityInspecting(false);capabilityButtons[capabilityIndex]?.focus({preventScroll:true})}});
selectCapability(0);

/* 4. Readiness follows one family + one active stage. No Compass state ownership. */
const readiness={
  trl:['Basic principles observed','Technology concept formulated','Experimental proof of concept','Technology validated in laboratory','Technology validated in relevant environment','Technology demonstrated in relevant environment','System prototype demonstrated','System complete and qualified','Actual system proven in operation'],
  tra:['Need and context framed','Stakeholders and constraints mapped','Adoption hypothesis formed','Operational fit tested','Evidence package assembled','Integration pathway demonstrated','Governance and ownership aligned','Deployment readiness qualified','Sustained adoption demonstrated']
};
const readinessDescriptions={trl:'A technology-readiness view of how far the capability has moved from principle toward demonstrated operation.',tra:'An adoption-readiness view of whether the capability can be understood, integrated, governed, and sustained in practice.'};
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
    b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();level=mod(level+1,readiness[family].length);renderReadiness({focus:true})}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();level=mod(level-1,readiness[family].length);renderReadiness({focus:true})}});
    readinessTrack.appendChild(b);
  });
  familyButtons.forEach(btn=>{const active=btn.dataset.readinessFamily===family;btn.classList.toggle('is-active',active);btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1});
  const title=readiness[family][level];
  const labelNode=document.querySelector('[data-readiness-label]'),titleNode=document.querySelector('[data-readiness-title]'),copyNode=document.querySelector('[data-readiness-copy]');
  if(labelNode)labelNode.textContent=`${family.toUpperCase()} · ${level+1}`;if(titleNode)titleNode.textContent=title;if(copyNode)copyNode.textContent=readinessDescriptions[family];if(readinessHeading)readinessHeading.textContent=`${family.toUpperCase()} ${level+1} · ${title}`;
  if(focus)readinessTrack.querySelector('.is-active')?.focus({preventScroll:true});
};
familyButtons.forEach(btn=>btn.addEventListener('click',()=>{family=btn.dataset.readinessFamily;level=0;renderReadiness()}));
bindSwipe(readinessRegion,d=>{level=mod(level+d,readiness[family].length);renderReadiness()});
renderReadiness();

/* 5. Production settlement binding. Canonical source is data-orbit-focus only.
      Preview state is never promoted to readable-label authority. */
const syncSettledCardinal=()=>{
  if(!root)return;
  const settled=(root.dataset.orbitFocus||'').toLowerCase();
  if(!['north','east','south','west'].includes(settled))return;
  root.dataset.readableCardinal=settled;
  root.dataset.renderedForegroundCardinal=settled;
  root.dataset.cloneLabelBinding='COMMITTED_ORBIT_FOCUS_ONLY';
  root.querySelectorAll('[data-compass-cardinal]').forEach(node=>{
    const active=(node.dataset.cardinalId||node.dataset.wing||'').toLowerCase()===settled;
    node.classList.toggle('is-readable-cardinal',active);
  });
};

/* 6. Mirrorland presentation portal. The existing declarative chooser node is moved,
      not cloned; its controller-owned listeners and hrefs remain authoritative. */
let portal=null,portalPlaceholder=null,portalParent=null,portalNext=null;
const routes=()=>document.querySelector('[data-compass-mirrorland-routes]');
const ensurePortal=()=>{
  if(portal)return portal;
  portal=document.createElement('div');
  portal.className='compass-clone-mirrorland-portal';
  portal.dataset.cloneMirrorlandPortal=BUILD;
  portal.setAttribute('role','presentation');
  return portal;
};
const portalMirrorland=()=>{
  const node=routes();
  if(!node||node.closest('.compass-clone-mirrorland-portal'))return;
  portalParent=node.parentNode;portalNext=node.nextSibling;
  portalPlaceholder=document.createComment('clone-mirrorland-portal-origin');
  portalParent?.insertBefore(portalPlaceholder,node);
  const host=ensurePortal();
  document.body.appendChild(host);host.appendChild(node);
  node.hidden=false;node.removeAttribute('aria-hidden');node.setAttribute('role','dialog');node.setAttribute('aria-modal','true');
  document.documentElement.dataset.cloneMirrorlandFocus='true';
  requestAnimationFrame(()=>node.querySelector('a,button')?.focus({preventScroll:true}));
};
const restoreMirrorland=()=>{
  const host=portal;
  const node=host?.querySelector('[data-compass-mirrorland-routes]');
  if(node&&portalParent){
    node.removeAttribute('role');node.removeAttribute('aria-modal');
    if(portalPlaceholder?.parentNode)portalPlaceholder.parentNode.replaceChild(node,portalPlaceholder);
    else if(portalNext&&portalNext.parentNode===portalParent)portalParent.insertBefore(node,portalNext);
    else portalParent.appendChild(node);
  }
  host?.remove();portal=null;portalPlaceholder=null;portalParent=null;portalNext=null;
  delete document.documentElement.dataset.cloneMirrorlandFocus;
};
const syncCompassPresentation=()=>{
  syncSettledCardinal();
  if(!root)return;
  const mode=(root.dataset.compassMode||'').toUpperCase();
  if(mode==='MIRRORLAND_FOCUSED')portalMirrorland();
  else if(portal)restoreMirrorland();
};
if(root){
  const compassObserver=new MutationObserver(records=>{
    if(records.some(r=>['data-orbit-focus','data-compass-mode','data-mirrorland-window-state'].includes(r.attributeName)))syncCompassPresentation();
  });
  compassObserver.observe(root,{attributes:true,attributeFilter:['data-orbit-focus','data-compass-mode','data-mirrorland-window-state']});
  syncCompassPresentation();
}

/* Receipt makes ownership inspectable without claiming visual acceptance. */
window.__DGB_COMPASS_CLONE_GEN343__={
  build:BUILD,
  compassStateOwner:'SHARED_COMPASS_CONTROLLER',
  labelSource:'data-orbit-focus',
  labelPolicy:'ALL_FOUR_STARS_ONE_SETTLED_READABLE_LABEL',
  mirrorlandPresentation:'BODY_LEVEL_PORTAL_EXISTING_DECLARATIVE_CHOOSER',
  capabilityStateScope:'CLONE_EDITORIAL_ONLY',
  readinessStateScope:'CLONE_EDITORIAL_ONLY',
  visualAcceptanceClaimed:false
};
})();
