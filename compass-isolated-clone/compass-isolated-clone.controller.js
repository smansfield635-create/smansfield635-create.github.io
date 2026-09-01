(()=>{
'use strict';

const BUILD='gen345-cutting-edge-progressive-clone-1';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const mod=(n,m)=>((n%m)+m)%m;
const root=q('[data-compass-root]');
const scene=q('[data-compass-scene]',root||document);
const controller=()=>window.DGB_COMPASS_CONTROLLER||null;
document.documentElement.dataset.compassCloneController=BUILD;
if(root)root.dataset.cloneProgressiveBuild=BUILD;

const bindSwipe=(node,onDelta,threshold=38)=>{
  if(!node)return;
  let sx=null,sy=null;
  node.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input,select,textarea'))return;sx=e.clientX;sy=e.clientY},{passive:true});
  node.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=sy=null;if(Math.abs(dx)>threshold&&Math.abs(dx)>Math.abs(dy))onDelta(dx<0?1:-1)},{passive:true});
  node.addEventListener('pointercancel',()=>{sx=sy=null},{passive:true});
};

/* Persistent progress rail: the page reads as one interactive instrument instead of stacked cards. */
const sectionTargets=[
  ['Orientation','.clone-hero'],['Start','#new-here'],['Compass','#compass'],['Capabilities','.clone-capabilities'],['Readiness','.clone-readiness'],['Destinations','.clone-destinations']
].map(([label,sel])=>[label,q(sel)]).filter(([,node])=>node);
if(sectionTargets.length){
  const rail=document.createElement('nav');rail.className='clone-progress-rail';rail.setAttribute('aria-label','Compass Studio progression');
  rail.innerHTML='<div class="clone-progress-brand"><span>DIAMOND GATE</span><strong>COMPASS</strong></div><div class="clone-progress-links"></div><div class="clone-progress-meter"><i></i></div>';
  const links=q('.clone-progress-links',rail);
  sectionTargets.forEach(([label,node],i)=>{if(!node.id)node.id=`clone-stage-${i}`;const a=document.createElement('a');a.href=`#${node.id}`;a.textContent=label;a.dataset.stage=String(i);links.appendChild(a)});
  document.body.prepend(rail);
  const updateRail=()=>{
    let best=0,bestDist=Infinity;sectionTargets.forEach(([,node],i)=>{const d=Math.abs(node.getBoundingClientRect().top-innerHeight*.28);if(d<bestDist){bestDist=d;best=i}});
    qa('a',links).forEach((a,i)=>a.classList.toggle('is-active',i===best));
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const pct=Math.min(1,Math.max(0,scrollY/max));q('i',rail).style.transform=`scaleX(${pct})`;
  };
  addEventListener('scroll',updateRail,{passive:true});addEventListener('resize',updateRail,{passive:true});updateRail();
}

/* Hero is a real two-state perspective carousel with explicit controls. */
const statements=qa('[data-statement]');const statementHost=q('[data-statement-carousel]');let statementIndex=0;
if(statementHost&&statements.length){
  const controls=document.createElement('div');controls.className='clone-statement-controls';controls.innerHTML='<button type="button" data-prev aria-label="Previous perspective">←</button><span data-count></span><button type="button" data-next aria-label="Next perspective">→</button>';
  statementHost.after(controls);
  const show=i=>{statementIndex=mod(i,statements.length);statements.forEach((el,n)=>{const active=n===statementIndex;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active))});q('[data-count]',controls).textContent=`0${statementIndex+1} / 0${statements.length}`};
  q('[data-prev]',controls).onclick=()=>show(statementIndex-1);q('[data-next]',controls).onclick=()=>show(statementIndex+1);
  bindSwipe(statementHost,d=>show(statementIndex+d));statementHost.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(statementIndex+1);if(e.key==='ArrowLeft')show(statementIndex-1)});show(0);
}

/* Progressive editorial sections become controlled lenses rather than giant static blocks. */
const disclosureSections=[['Introduction',q('.clone-video')],['Readiness',q('.clone-readiness')],['Destinations',q('.clone-destinations')]].filter(([,n])=>n);
disclosureSections.forEach(([label,node],index)=>{
  const h=q('h2',node);const toggle=document.createElement('button');toggle.type='button';toggle.className='clone-disclosure-toggle';toggle.innerHTML=`<span>${label}</span><strong>${h?.textContent||label}</strong><em>${index===0?'OPEN':'EXPLORE'}</em>`;node.prepend(toggle);
  const set=open=>{node.classList.toggle('is-collapsed',!open);toggle.setAttribute('aria-expanded',String(open));q('em',toggle).textContent=open?'CLOSE':'EXPLORE'};
  toggle.onclick=()=>{const open=node.classList.contains('is-collapsed');if(open)disclosureSections.forEach(([,other])=>{if(other!==node)other.classList.add('is-collapsed')});set(open)};set(index===0);
});

/* Secondary constellation semantic layer. Geometry stays owned by the shared renderer/controller.
   This layer projects readable room identity around that geometry and uses the controller's own
   requestRoomSelection transaction for semantic selection. */
const declarations=qa('[data-compass-room]');
const groups=new Map();declarations.forEach(el=>{const wing=el.dataset.wing||'';if(!groups.has(wing))groups.set(wing,[]);groups.get(wing).push(el)});
let clusterLayer=null,clusterTitle=null,clusterReturn=null;
if(scene){
  clusterLayer=document.createElement('div');clusterLayer.className='clone-cluster-semantic-layer';clusterLayer.setAttribute('aria-live','polite');scene.appendChild(clusterLayer);
  clusterTitle=document.createElement('div');clusterTitle.className='clone-cluster-title';clusterLayer.appendChild(clusterTitle);
  clusterReturn=document.createElement('button');clusterReturn.type='button';clusterReturn.className='clone-cluster-return';clusterReturn.textContent='Return to constellation';clusterReturn.onclick=()=>controller()?.requestReturnToConstellation?.();clusterLayer.appendChild(clusterReturn);
}
const CARDINAL_NAMES={north:'ORIENTATION',east:'WORLDS',south:'INSTRUMENTS',west:'FRONTIER'};
const syncClusterSemantic=()=>{
  if(!root||!clusterLayer)return;
  const mode=root.dataset.compassMode||'CONSTELLATION';const wing=root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||'';
  const primary=root.dataset.clusterPrimaryRoom||root.dataset.clusterPreviewPrimaryRoom||root.dataset.selectedRoom||'';
  const active=(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')&&groups.has(wing);
  clusterLayer.classList.toggle('is-active',active);clusterLayer.dataset.wing=wing;
  qa('.clone-room-label',clusterLayer).forEach(n=>n.remove());
  if(!active)return;
  const rooms=groups.get(wing);clusterTitle.innerHTML=`<span>${CARDINAL_NAMES[wing]||wing}</span><strong>${mode==='ROOM_SELECTED'?'Selected room':'Secondary constellation'}</strong>`;
  rooms.forEach((room,i)=>{
    const total=rooms.length;const angle=(-Math.PI/2)+(i/total)*Math.PI*2;const radiusX=innerWidth<600?34:39;const radiusY=innerWidth<600?31:35;
    const b=document.createElement('button');b.type='button';b.className='clone-room-label';b.dataset.roomId=room.dataset.roomId||'';b.style.setProperty('--x',`${50+Math.cos(angle)*radiusX}%`);b.style.setProperty('--y',`${50+Math.sin(angle)*radiusY}%`);
    const isPrimary=b.dataset.roomId===primary;b.classList.toggle('is-primary',isPrimary);b.tabIndex=isPrimary?0:-1;
    b.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><strong>${room.dataset.label||room.textContent.trim()}</strong><small>${room.dataset.localCoordinate||room.dataset.localFunction||''}</small>`;
    b.onclick=e=>{e.preventDefault();e.stopPropagation();controller()?.requestRoomSelection?.(b.dataset.roomId)};
    clusterLayer.appendChild(b);
  });
};
if(root){new MutationObserver(syncClusterSemantic).observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-active-cluster-wing','data-cluster-primary-room','data-cluster-preview-primary-room','data-selected-room','data-selected-wing','data-selected-cardinal']});addEventListener('resize',syncClusterSemantic,{passive:true});syncClusterSemantic()}

/* Cardinal semantic polish remains controller-derived: all four stars survive; one label is readable. */
const syncCardinals=()=>{
  if(!root)return;const readable=root.dataset.renderedForegroundCardinal||root.dataset.readableCardinal||root.dataset.orbitFocus||'north';
  qa('[data-compass-cardinal]',root).forEach(el=>{const on=(el.dataset.cardinalId||el.dataset.wing)===readable;el.classList.toggle('is-readable-cardinal',on);el.setAttribute('aria-current',on?'true':'false')});
};
if(root){new MutationObserver(syncCardinals).observe(root,{attributes:true,attributeFilter:['data-rendered-foreground-cardinal','data-readable-cardinal','data-orbit-focus']});syncCardinals()}

/* Capability orbit: spatial one-stage carousel, front card opens a full inspection layer. */
const capabilityData={
brain:{verb:'Understand',k:'ASSESSMENT',t:'Coherence Diagnostic',c:'Compare what matters to you with how you are actually living and deciding. See alignment, tension, and repeated mismatch.',h:'/coherence-diagnostic/',a:'Run the diagnostic →',icon:'◇'},
trophy:{verb:'Explore',k:'AWARDS & RECOGNITION',t:'One body of work. Five reasons to look closer.',c:'Experience the estate as native craft, governed construction, continuity and recovery, and an integrated platform.',h:'/showroom/globe/h-earth/awards/',a:'Explore the awards layer →',icon:'✦'},
house:{verb:'Ask',k:'ASK FOR DIRECTIONS',t:'Talk to the House',c:'Tell the House what you are trying to understand or do. It points toward the room, tool, or experience most likely to help.',h:'/showroom/globe/hearth/jeeves/',a:'Ask the House →',icon:'⌂'}
};
const cards=qa('[data-capability]');const capHost=q('[data-capability-carousel]');const capSection=q('.clone-capabilities');const capDetail=q('[data-capability-detail]');let capIndex=0;
const orbitDelta=(n,c,t)=>{let d=n-c;if(d>t/2)d-=t;if(d<-t/2)d+=t;return d};
const renderCaps=()=>{cards.forEach((card,n)=>{const d=orbitDelta(n,capIndex,cards.length),active=d===0;card.classList.toggle('is-active',active);card.tabIndex=active?0:-1;card.style.setProperty('--orbit-x',`${d*62}%`);card.style.setProperty('--orbit-z',`${active?130:-110-Math.abs(d)*20}px`);card.style.setProperty('--orbit-ry',`${d*-28}deg`);card.style.setProperty('--orbit-scale',String(active?1:.78));card.style.zIndex=String(active?5:2);card.style.opacity=String(active?1:.48)});const card=cards[capIndex],d=capabilityData[card?.dataset.capability];if(d&&capDetail){q('[data-capability-kicker]',capDetail)?.replaceChildren(d.k);q('[data-capability-title]',capDetail)?.replaceChildren(d.t);q('[data-capability-copy]',capDetail)?.replaceChildren(d.c);const a=q('[data-capability-link]',capDetail);if(a){a.href=d.h;a.textContent=d.a}}};
cards.forEach((card,n)=>{const d=capabilityData[card.dataset.capability];if(d&&!q('.clone-card-icon',card)){const icon=document.createElement('span');icon.className='clone-card-icon';icon.textContent=d.icon;card.prepend(icon)}card.onclick=()=>{if(n!==capIndex){capIndex=n;renderCaps();return}capSection?.classList.add('is-inspecting');capDetail?.setAttribute('aria-hidden','false')}});
if(capDetail){const close=document.createElement('button');close.type='button';close.className='clone-capability-return';close.textContent='Return to orbit';close.onclick=()=>capSection?.classList.remove('is-inspecting');capDetail.prepend(close)}
bindSwipe(capHost,d=>{capIndex=mod(capIndex+d,cards.length);renderCaps()});capHost?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){capIndex=mod(capIndex+1,cards.length);renderCaps()}if(e.key==='ArrowLeft'){capIndex=mod(capIndex-1,cards.length);renderCaps()}});if(cards.length)renderCaps();

/* TRL / TRA: family tabs + inner stage carousel. Existing markup is promoted rather than replaced. */
const readiness=q('.clone-readiness');const readinessTabs=qa('.clone-readiness-tabs button');const readinessSteps=qa('.clone-readiness-track button');const readinessDetail=q('.clone-readiness-detail');let readyIndex=0;
const syncReady=()=>{readinessSteps.forEach((b,i)=>{const active=i===readyIndex;b.classList.toggle('is-active',active);b.tabIndex=active?0:-1;b.setAttribute('aria-current',active?'step':'false')});if(readinessDetail){readinessDetail.dataset.stage=String(readyIndex+1);const badge=q('.clone-readiness-stage-badge',readinessDetail)||(()=>{const n=document.createElement('div');n.className='clone-readiness-stage-badge';readinessDetail.prepend(n);return n})();badge.textContent=`STAGE ${String(readyIndex+1).padStart(2,'0')} / ${String(readinessSteps.length).padStart(2,'0')}`}}
readinessSteps.forEach((b,i)=>b.onclick=()=>{readyIndex=i;syncReady()});bindSwipe(readiness,d=>{if(!readinessSteps.length)return;readyIndex=mod(readyIndex+d,readinessSteps.length);syncReady()});readiness?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){readyIndex=mod(readyIndex+1,readinessSteps.length);syncReady()}if(e.key==='ArrowLeft'){readyIndex=mod(readyIndex-1,readinessSteps.length);syncReady()}});syncReady();

/* Mirrorland portal: chooser becomes the sole luminous decision surface; return uses controller authority. */
const routes=q('[data-compass-mirrorland-routes]',root||document);let portal=null,placeholder=null;
const mountMirrorland=()=>{
  if(!root||!routes)return;const focused=root.dataset.compassMode==='MIRRORLAND_FOCUSED';
  if(focused&&!portal){placeholder=document.createComment('mirrorland-home');routes.before(placeholder);portal=document.createElement('div');portal.className='compass-clone-mirrorland-portal';portal.appendChild(routes);document.body.appendChild(portal);routes.hidden=false;routes.removeAttribute('aria-hidden');document.documentElement.classList.add('clone-mirrorland-active');const back=q('[data-compass-mirrorland-inline-back]',routes);if(back)back.onclick=e=>{e.preventDefault();controller()?.requestMirrorlandBack?.()||controller()?.requestReturnToConstellation?.()};q('a,button',routes)?.focus({preventScroll:true})}
  if(!focused&&portal){placeholder?.replaceWith(routes);routes.hidden=true;portal.remove();portal=null;placeholder=null;document.documentElement.classList.remove('clone-mirrorland-active')}
};
if(root&&routes){new MutationObserver(mountMirrorland).observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-mirrorland-window-state']});mountMirrorland()}

/* Visible build receipt for qualification. */
const receipt=document.createElement('div');receipt.className='clone-build-receipt';receipt.textContent='GEN345 · PROGRESSIVE CLONE';receipt.title=BUILD;document.body.appendChild(receipt);
})();
