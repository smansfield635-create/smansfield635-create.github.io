(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_PRESENTATION_CONVERGENCE_V1';
if(globalThis[GLOBAL]?.mounted)return;
const state={root:null,identity:null,door:null,guidance:null,observer:null};
function layers(text,count=10,step=2){let html='';for(let i=count-1;i>=0;i--)html+=`<span class="compass-wordmark-layer" aria-hidden="true" style="transform:translateZ(${-i*step}px)"${i===0?' data-front="true"':''}>${text}</span>`;return html}
function mountIdentity(){
  const root=state.root=document.querySelector('[data-compass-root]');if(!root)return;
  const header=root.querySelector('.compass-estate__header');if(!header)return;
  let identity=header.querySelector('[data-compass-identity-bounded]');
  if(!identity){
    const current=[...header.querySelectorAll('h1,h2')].find(node=>/^\s*the compass\s*$/i.test(node.textContent||''));
    identity=document.createElement('section');
    identity.className='compass-identity-3d';
    identity.setAttribute('data-compass-identity-bounded','true');
    identity.dataset.geometry='css-preserve-3d-extrusion-v2';
    identity.setAttribute('aria-label','The Compass. Independent Studio for Interactive Worlds, Creative Technology and Original Systems.');
    identity.innerHTML=`<div class="compass-wordmark-stage compass-wordmark-stage--compass" data-wordmark-object="the-compass"><div class="compass-wordmark-geometry">${layers('THE COMPASS',12,2.4)}<span class="compass-wordmark-back">THE COMPASS</span><span class="compass-wordmark-face">THE COMPASS</span></div></div><p class="compass-studio-descriptor">Independent Studio for Interactive Worlds, Creative Technology &amp; Original Systems</p>`;
    if(current){current.hidden=true;current.setAttribute('aria-hidden','true');current.insertAdjacentElement('afterend',identity)}else header.prepend(identity);
  }
  state.identity=identity;
  root.dataset.studioIdentity='Independent Studio for Interactive Worlds, Creative Technology & Original Systems';
  root.dataset.compassIdentityPolicy='bounded-presentation-owner-v1';
}
function bindMirrorland(){
  const root=state.root||document.querySelector('[data-compass-root]');if(!root)return;
  const door=root.querySelector('[data-compass-object="mirrorland"]');if(!door)return;
  state.door=door;
  door.style.setProperty('pointer-events','auto','important');
  door.style.setProperty('touch-action','manipulation','important');
  if(door.dataset.boundedMirrorlandRevealBound==='true')return;
  door.dataset.boundedMirrorlandRevealBound='true';
  door.addEventListener('pointerup',event=>{
    if(event.button!=null&&event.button!==0)return;
    const controller=globalThis.DGB_COMPASS_CONTROLLER;
    if(!controller?.requestMirrorlandReveal)return;
    const frame=controller.getFrameState?.();
    if(frame?.state==='CONSTELLATION'||frame?.state==='CLUSTER_OPEN'||frame?.state==='ROOM_SELECTED'){
      event.preventDefault();
      controller.requestMirrorlandReveal();
    }
  },true);
}
function installGuidanceStyle(){
  if(document.getElementById('compass-bounded-guidance-style'))return;
  const style=document.createElement('style');
  style.id='compass-bounded-guidance-style';
  style.textContent='.compass-guidance .compass-guidance__swipe{color:rgba(102,205,224,.98);font-weight:850;text-shadow:0 0 10px rgba(102,205,224,.28)}';
  document.head.append(style);
}
function syncGuidance(){
  const root=state.root||document.querySelector('[data-compass-root]');
  const guidance=state.guidance||document.querySelector('[data-compass-guidance]');
  if(!root||!guidance)return;
  state.guidance=guidance;
  const mode=root.dataset.compassMode||'';
  if(mode!=='CLUSTER_OPEN'&&mode!=='ROOM_SELECTED')return;
  guidance.replaceChildren();
  guidance.append(document.createTextNode('Tap a room to open it · Return to Orbit to reselect · '));
  const swipe=document.createElement('span');
  swipe.className='compass-guidance__swipe';
  swipe.textContent='Swipe to return to the constellation';
  guidance.append(swipe);
  guidance.setAttribute('aria-label','Tap a room to open it. Return to Orbit to reselect. Swipe to return to the constellation.');
}
function mount(){
  state.root=document.querySelector('[data-compass-root]');if(!state.root)return;
  installGuidanceStyle();
  mountIdentity();
  bindMirrorland();
  syncGuidance();
  state.observer=new MutationObserver(()=>{bindMirrorland();syncGuidance()});
  state.observer.observe(state.root,{attributes:true,attributeFilter:['data-compass-mode']});
  globalThis[GLOBAL]=Object.freeze({mounted:true,version:'bounded-presentation-convergence-v1',identityMounted:Boolean(state.identity),mirrorlandBound:Boolean(state.door),guidanceOwned:true});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
