(()=>{
'use strict';

const mod=(n,m)=>((n%m)+m)%m;
const bindSwipe=(node,onDelta,threshold=42)=>{
  if(!node)return;
  let startX=null,startY=null;
  node.addEventListener('pointerdown',e=>{if(e.target.closest('a'))return;startX=e.clientX;startY=e.clientY},{passive:true});
  node.addEventListener('pointerup',e=>{
    if(startX===null)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;startX=null;startY=null;
    if(Math.abs(dx)>threshold&&Math.abs(dx)>Math.abs(dy))onDelta(dx<0?1:-1);
  },{passive:true});
  node.addEventListener('pointercancel',()=>{startX=null;startY=null},{passive:true});
};

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

const capabilities={
  brain:{verb:'Understand',k:'ASSESSMENT',t:'Coherence Diagnostic',c:'Compare what matters to you with how you are actually living and deciding. See alignment, tension, and repeated mismatch.',h:'/coherence-diagnostic/',a:'Run the diagnostic →'},
  trophy:{verb:'Explore',k:'AWARDS & RECOGNITION',t:'One body of work. Five reasons to look closer.',c:'Explore the estate as experience, native craft, governed construction, continuity and recovery, and an integrated platform.',h:'/showroom/globe/h-earth/awards/',a:'Explore the Awards Layer →'},
  house:{verb:'Ask',k:'ASK FOR DIRECTIONS',t:'Talk to the House',c:'Tell the House what you are trying to understand or do. It points toward the room, tool, or experience most likely to help.',h:'/showroom/globe/hearth/jeeves/',a:'Ask the House →'}
};
const capabilityButtons=[...document.querySelectorAll('[data-capability]')];
const capabilityHost=document.querySelector('[data-capability-carousel]');
const capabilityDetail=document.querySelector('[data-capability-detail]');
const capabilityHeading=document.querySelector('[data-capability-region-heading]');
let capabilityIndex=0;
const selectCapability=(index,{focus=false}={})=>{
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
  if(focus)btn.focus({preventScroll:true});
};
capabilityButtons.forEach((btn,n)=>{
  btn.addEventListener('click',()=>selectCapability(n));
  btn.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();selectCapability(capabilityIndex+1,{focus:true})}
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();selectCapability(capabilityIndex-1,{focus:true})}
    if(e.key==='Home'){e.preventDefault();selectCapability(0,{focus:true})}
    if(e.key==='End'){e.preventDefault();selectCapability(capabilityButtons.length-1,{focus:true})}
  });
});
bindSwipe(capabilityHost,d=>selectCapability(capabilityIndex+d));
selectCapability(0);

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

if(root){
  const panel=root.querySelector('[data-compass-panel]');
  const declarations=[...root.querySelectorAll('[data-compass-room-declarations] [data-compass-room]')];
  const fallback=document.createElement('section');
  fallback.className='compass-semantic-room-fallback';
  fallback.dataset.compassRoomKey='true';
  fallback.hidden=true;
  fallback.setAttribute('aria-label','Semantic room controls');
  fallback.innerHTML='<p class="compass-semantic-room-fallback__note">Visual star field unavailable. Room controls remain active.</p><div class="compass-semantic-room-fallback__grid" data-compass-room-fallback-grid></div>';
  panel?.appendChild(fallback);
  const grid=fallback.querySelector('[data-compass-room-fallback-grid]');
  const copyData=(from,to,names)=>names.forEach(name=>{if(from.dataset[name]!=null)to.dataset[name]=from.dataset[name]});
  const syncFallback=()=>{
    if(!panel||!grid)return;
    const status=(root.dataset.compassCrystalsStatus||'').toLowerCase();
    const mode=root.dataset.compassMode||'';
    const wing=root.dataset.selectedCardinal||root.dataset.selectedWing||'';
    const rendererHeld=!status||status==='held'||status==='failed'||status==='unavailable'||status.includes('fail');
    const active=rendererHeld&&(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')&&Boolean(wing);
    fallback.hidden=!active;
    if(!active){grid.replaceChildren();return}
    const selected=root.dataset.selectedRoom||'';
    const wanted=declarations.filter(el=>el.dataset.wing===wing);
    if(grid.dataset.wing!==wing||grid.children.length!==wanted.length){
      grid.replaceChildren();grid.dataset.wing=wing;
      wanted.forEach(declaration=>{
        const button=document.createElement('button');button.type='button';button.className='compass-semantic-room-fallback__button';button.textContent=declaration.dataset.label||declaration.textContent.trim();
        button.setAttribute('data-compass-room','');button.setAttribute('data-compass-destination','');
        copyData(declaration,button,['destinationType','wing','roomId','label','route','localCoordinate','localFunction','preview','whyEnter']);
        grid.appendChild(button);
      });
    }
    [...grid.querySelectorAll('[data-compass-room]')].forEach(button=>{
      const current=button.dataset.roomId===selected;button.classList.toggle('is-current',current);if(current)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
    });
  };
  const style=document.createElement('style');
  style.textContent='.compass-semantic-room-fallback{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(216,184,106,.22)}.compass-semantic-room-fallback__note{margin:0 0 .7rem;color:var(--compass-text-supporting,rgba(225,218,198,.68));font-size:.82rem;line-height:1.45}.compass-semantic-room-fallback__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}.compass-semantic-room-fallback__button{min-width:0;border:1px solid rgba(216,184,106,.28);border-radius:12px;padding:.7rem .8rem;background:rgba(7,12,20,.72);color:var(--compass-text-primary,#f4f0e2);font:inherit;text-align:left;cursor:pointer}.compass-semantic-room-fallback__button:is(:hover,:focus-visible),.compass-semantic-room-fallback__button.is-current{border-color:rgba(243,217,139,.72);background:rgba(216,184,106,.12);outline:none}@media(max-width:520px){.compass-semantic-room-fallback__grid{grid-template-columns:1fr}}';
  document.head.appendChild(style);
  const observer=new MutationObserver(syncFallback);
  observer.observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-selected-cardinal','data-selected-wing','data-selected-room','data-compass-crystals-status']});
  globalThis.addEventListener('COMPASS_CRYSTALS_RENDER_FAILURE',()=>queueMicrotask(syncFallback));
  syncFallback();
}

const roomCount=root?.querySelectorAll('[data-compass-room-declarations] [data-compass-room]').length||0;
globalThis.CompassIsolatedClone=Object.freeze({version:'gen337-architecture-3',productionMutationAuthorized:false,admission:'ADMITTED_LOCKED',architectureRepair:'CANONICAL_EXISTING_CONSTRUCT_ADOPTION',roomDeclarationCount:roomCount,mirrorlandRouteCount:root?.querySelectorAll('[data-compass-mirrorland-routes] a').length||0,semanticRendererFallback:true});
})();