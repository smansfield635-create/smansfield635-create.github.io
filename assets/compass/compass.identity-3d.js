(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_IDENTITY_3D_GEN1536';
if(globalThis[GLOBAL]?.mounted)return;
const state={root:null,identity:null};
function layers(text,count=10,step=2){let html='';for(let i=count-1;i>=0;i--)html+=`<span class="compass-wordmark-layer" aria-hidden="true" style="transform:translateZ(${-i*step}px)"${i===0?' data-front="true"':''}>${text}</span>`;return html}
function mountIdentity(){
  const root=state.root=document.querySelector('[data-compass-root]');if(!root)return;
  const header=root.querySelector('.compass-estate__header')||root.querySelector('header');if(!header)return;
  let identity=header.querySelector('[data-compass-identity-3d]');
  if(!identity){
    const current=[...header.querySelectorAll('h1,h2')].find(n=>/^\s*the compass\s*$/i.test(n.textContent||''));
    identity=document.createElement('section');identity.className='compass-identity-3d';identity.setAttribute('data-compass-identity-3d','true');identity.dataset.geometry='css-preserve-3d-extrusion-v2';identity.dataset.identityContract='ONE_AUTHORITATIVE_COMPASS_GEN1536';identity.setAttribute('aria-label','Diamond Gate Bridge. The Compass. Independent Studio for Interactive Worlds, Creative Technology and Original Systems.');
    identity.innerHTML=`<div class="compass-wordmark-stage compass-wordmark-stage--maker" data-wordmark-object="diamond-gate-bridge"><div class="compass-wordmark-geometry">${layers('DIAMOND GATE BRIDGE',9,2)}<span class="compass-wordmark-back">DIAMOND GATE BRIDGE</span><span class="compass-wordmark-face">DIAMOND GATE BRIDGE</span></div></div><div class="compass-wordmark-stage compass-wordmark-stage--compass" data-wordmark-object="the-compass"><div class="compass-wordmark-geometry">${layers('THE COMPASS',12,2.4)}<span class="compass-wordmark-back">THE COMPASS</span><span class="compass-wordmark-face">THE COMPASS</span></div></div><p class="compass-studio-descriptor">Independent Studio for Interactive Worlds, Creative Technology &amp; Original Systems</p>`;
    if(current){current.hidden=true;current.setAttribute('aria-hidden','true');current.insertAdjacentElement('afterend',identity)}else header.prepend(identity);
  }
  state.identity=identity;root.dataset.studioIdentity='Independent Studio for Interactive Worlds, Creative Technology & Original Systems';root.dataset.wordmarkGeometry='css-preserve-3d-extrusion-v2';root.dataset.compassIdentityPolicy='one-authoritative-compass-no-ornamental-rotation';
}
function brandCoheriscope(){for(const card of document.querySelectorAll('[data-capability="diagnostic"]')){const h=card.querySelector('h2');if(h&&h.textContent!=='Coheriscope')h.textContent='Coheriscope';card.dataset.productIdentity='Coheriscope';card.dataset.diagnosticSemantics='preserved'}if(state.root)state.root.dataset.coheriscopeIdentity='working-product-name'}
function diagnosticMutation(mutation){const target=mutation.target;const targetInDiagnostic=target?.nodeType===1&&target.closest?.('[data-capability="diagnostic"]');if(targetInDiagnostic)return true;for(const node of mutation.addedNodes){if(node.nodeType!==1)continue;if(node.matches?.('[data-capability="diagnostic"]')||node.querySelector?.('[data-capability="diagnostic"]'))return true}return false}
function removeSecondaryCompass(){document.querySelectorAll('[data-compass-spatial-instrument],.compass-spatial-instrument').forEach(node=>node.remove());if(state.root)state.root.dataset.secondaryCompass='absent-gen1536'}
function removeLegacySpacecraft(){document.querySelectorAll('[data-compass-spacecraft-layer],.compass-spacecraft-layer').forEach(node=>node.remove());if(state.root)state.root.dataset.identitySpacecraft='removed-v4-laws-owner-only'}
function reconcileGen1561Runtime(){
  const identity=state.identity||document.querySelector('[data-compass-identity-3d]');
  const maker=identity?.querySelector('[data-wordmark-object="diamond-gate-bridge"]');
  if(maker){maker.hidden=true;maker.setAttribute('aria-hidden','true');maker.style.setProperty('display','none','important')}
  const stage=document.querySelector('.compass-capability-orbit[data-reconciliation-stage="gen1561"]');
  if(stage){
    const compact=matchMedia('(max-width:620px)').matches?'340px':'390px';
    stage.style.setProperty('box-sizing','border-box','important');stage.style.setProperty('min-height','0','important');stage.style.setProperty('height',compact,'important');stage.style.setProperty('max-height',compact,'important');stage.style.setProperty('padding','0','important');stage.style.setProperty('border','0','important');
    const objectStage=stage.querySelector('.compass-object-stage'),dock=stage.querySelector('.compass-action-dock');
    if(objectStage&&dock&&!stage.dataset.gen1561DocumentDragGuard){
      stage.dataset.gen1561DocumentDragGuard='true';let fallback=false,startX=0;
      const within=e=>{const r=objectStage.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom};
      document.addEventListener('mousedown',e=>{if(e.button!==0||!within(e))return;fallback=true;startX=e.clientX;dock.replaceChildren();dock.setAttribute('aria-busy','true');dock.toggleAttribute('inert',true);dock.dataset.navigationAuthority='blocked'},true);
      document.addEventListener('mouseup',e=>{if(!fallback)return;fallback=false;const dx=e.clientX-startX;if(Math.abs(dx)>24){const control=stage.querySelector(dx<0?'[data-orbit-next]':'[data-orbit-previous]');control?.click()}else{dock.removeAttribute('inert');dock.setAttribute('aria-busy','false')}},true);
    }
  }
  const door=document.querySelector('[data-compass-object="mirrorland"]');
  const ownedScene=state.root?.querySelector('[data-compass-scene]');
  if(door){if(ownedScene&&door.parentElement!==ownedScene)ownedScene.append(door);door.setAttribute('data-compass-destination','true');door.dataset.destinationType='mirrorland';door.dataset.destinationId='mirrorland';door.dataset.gen1561MirrorlandSemantic='true';door.dataset.gen1561ControllerSceneBound=String(Boolean(ownedScene&&ownedScene.contains(door)));door.style.setProperty('z-index','2147483000','important');door.style.setProperty('pointer-events','auto','important');door.style.setProperty('visibility','visible','important');door.style.setProperty('touch-action','manipulation','important');if(!door.dataset.gen1561PointerRevealBound){door.dataset.gen1561PointerRevealBound='true';door.addEventListener('pointerup',e=>{if(e.button!=null&&e.button!==0)return;const c=globalThis.DGB_COMPASS_CONTROLLER;if(!c?.requestMirrorlandReveal)return;const frame=c.getFrameState?.();if(frame?.state==='CONSTELLATION'||frame?.state==='CLUSTER_OPEN'||frame?.state==='ROOM_SELECTED'){e.preventDefault();c.requestMirrorlandReveal()}},true)}}
}
function mount(){
  mountIdentity();brandCoheriscope();removeSecondaryCompass();removeLegacySpacecraft();reconcileGen1561Runtime();
  const observer=new MutationObserver(mutations=>{if(mutations.some(diagnosticMutation))brandCoheriscope();removeSecondaryCompass();removeLegacySpacecraft();reconcileGen1561Runtime()});
  if(state.root)observer.observe(state.root,{childList:true,subtree:true});
  globalThis[GLOBAL]=Object.freeze({mounted:true,version:'coherence-gen1536-identity-only-v4-gen1561-reconciliation',wordmarkGeometry:'css-preserve-3d-extrusion-v2',coheriscope:true,secondarySpatialCompass:false,spacecraftMounted:false,spacecraftAuthority:'DELEGATED_TO_DGB_LAWS_SPACECRAFT',receipt:()=>({identityMounted:Boolean(state.identity),coheriscopeIdentity:state.root?.dataset.coheriscopeIdentity||'',secondaryCompass:state.root?.dataset.secondaryCompass||'',identitySpacecraft:state.root?.dataset.identitySpacecraft||'',spacecraftMounted:false})});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();