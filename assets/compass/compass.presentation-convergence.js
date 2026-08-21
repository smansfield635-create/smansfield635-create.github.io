(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_PRESENTATION_CONVERGENCE_V2';
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
  root.dataset.compassIdentityPolicy='bounded-presentation-owner-v2';
}
function requestMirrorland(event){
  if(event?.button!=null&&event.button!==0)return false;
  const controller=globalThis.DGB_COMPASS_CONTROLLER;
  if(!controller?.requestMirrorlandReveal)return false;
  const frame=controller.getFrameState?.();
  if(!frame||!['CONSTELLATION','CLUSTER_OPEN','ROOM_SELECTED'].includes(frame.state))return false;
  event?.preventDefault?.();
  event?.stopPropagation?.();
  controller.requestMirrorlandReveal();
  return true;
}
function bindMirrorland(){
  const root=state.root||document.querySelector('[data-compass-root]');if(!root)return;
  const door=root.querySelector('[data-compass-object="mirrorland"]');if(!door)return;
  state.door=door;
  door.style.setProperty('pointer-events','auto','important');
  door.style.setProperty('touch-action','manipulation','important');
  if(door.dataset.boundedMirrorlandRevealBound==='v2')return;
  door.dataset.boundedMirrorlandRevealBound='v2';
  door.addEventListener('pointerup',requestMirrorland,true);
  door.addEventListener('click',event=>{if(requestMirrorland(event))event.stopImmediatePropagation()},true);
}
function installPresentationStyle(){
  const old=document.getElementById('compass-bounded-guidance-style');if(old)old.remove();
  if(document.getElementById('compass-bounded-presentation-style-v2'))return;
  const style=document.createElement('style');
  style.id='compass-bounded-presentation-style-v2';
  style.textContent=`
.compass-estate__header{min-height:0!important;height:auto!important;padding-bottom:clamp(.65rem,1.6vw,1.1rem)!important}
.compass-statement-orbit{min-height:6.2rem!important;margin:clamp(.75rem,2vw,1.35rem) auto .35rem!important}
.compass-editorial-intro{margin-top:clamp(.45rem,1.2vw,.8rem)!important;margin-bottom:clamp(.75rem,1.8vw,1.15rem)!important}
.compass-instrument{padding:clamp(.8rem,2.2vw,1.35rem)!important;border:1px solid rgba(124,220,255,.16)!important;border-radius:clamp(1.25rem,2.6vw,2rem)!important;background:linear-gradient(145deg,rgba(4,12,19,.64),rgba(5,11,18,.38))!important;box-shadow:0 22px 64px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.045)!important}
.compass-orbit-intro{width:min(100%,900px)!important;margin:0 auto clamp(.75rem,1.8vw,1.1rem)!important;padding:clamp(.9rem,2vw,1.25rem) clamp(1rem,2.5vw,1.45rem)!important;border:1px solid rgba(216,184,106,.15)!important;border-radius:1rem!important;background:linear-gradient(135deg,rgba(216,184,106,.045),rgba(102,205,224,.035))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important}
.compass-guidance,[data-compass-guidance]{position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:14px!important;z-index:20!important;width:min(calc(100% - 32px),720px)!important;height:auto!important;min-height:42px!important;margin:0!important;padding:10px 14px!important;overflow:visible!important;clip:auto!important;clip-path:none!important;white-space:normal!important;border:1px solid rgba(124,220,255,.22)!important;border-radius:999px!important;background:rgba(3,9,16,.88)!important;box-shadow:0 12px 34px rgba(0,0,0,.30)!important;color:rgba(239,245,241,.94)!important;font:800 clamp(.7rem,1.45vw,.82rem)/1.35 Inter,ui-sans-serif,system-ui,sans-serif!important;text-align:center!important;transform:translateX(-50%)!important;opacity:1!important;visibility:visible!important;pointer-events:none!important}
.compass-guidance .compass-guidance__swipe{color:rgba(102,205,224,.98);font-weight:900;text-shadow:0 0 10px rgba(102,205,224,.30)}
.compass-object--mirrorland,[data-compass-object="mirrorland"]{min-width:clamp(150px,18vw,210px)!important;min-height:clamp(82px,10vw,112px)!important;padding:14px 18px!important;display:grid!important;place-content:center!important;pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important}
@media(max-width:820px){.compass-instrument{padding:.65rem!important}.compass-orbit-intro{padding:.85rem .8rem!important}.compass-guidance,[data-compass-guidance]{bottom:10px!important;width:calc(100% - 22px)!important;border-radius:16px!important;font-size:.7rem!important}.compass-object--mirrorland,[data-compass-object="mirrorland"]{min-width:150px!important;min-height:88px!important}}
`;
  document.head.append(style);
}
function syncGuidance(){
  const root=state.root||document.querySelector('[data-compass-root]');
  const guidance=state.guidance||document.querySelector('[data-compass-guidance]');
  if(!root||!guidance)return;
  state.guidance=guidance;
  const mode=root.dataset.compassMode||'';
  if(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED'){
    guidance.replaceChildren();
    guidance.append(document.createTextNode('Tap a room to open it · Return to Orbit to reselect · '));
    const swipe=document.createElement('span');
    swipe.className='compass-guidance__swipe';
    swipe.textContent='Swipe to return to the constellation';
    guidance.append(swipe);
    guidance.setAttribute('aria-label','Tap a room to open it. Return to Orbit to reselect. Swipe to return to the constellation.');
    return;
  }
  if(mode==='CONSTELLATION'){
    guidance.textContent='Drag to rotate the constellation · Tap a primary star to open its cluster';
    guidance.setAttribute('aria-label','Drag to rotate the constellation. Tap a primary star to open its cluster.');
  }
}
function mount(){
  state.root=document.querySelector('[data-compass-root]');if(!state.root)return;
  installPresentationStyle();
  mountIdentity();
  bindMirrorland();
  syncGuidance();
  state.observer=new MutationObserver(()=>{bindMirrorland();syncGuidance()});
  state.observer.observe(state.root,{attributes:true,attributeFilter:['data-compass-mode','data-mirrorland-window-state']});
  globalThis[GLOBAL]=Object.freeze({mounted:true,version:'bounded-presentation-convergence-v2',identityMounted:Boolean(state.identity),mirrorlandBound:Boolean(state.door),guidanceOwned:true,layoutIntegrated:true});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
