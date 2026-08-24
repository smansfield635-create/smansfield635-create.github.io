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
function mount(){
  mountIdentity();brandCoheriscope();removeSecondaryCompass();removeLegacySpacecraft();
  const observer=new MutationObserver(mutations=>{if(mutations.some(diagnosticMutation))brandCoheriscope();removeSecondaryCompass();removeLegacySpacecraft()});
  if(state.root)observer.observe(state.root,{childList:true,subtree:true});
  globalThis[GLOBAL]=Object.freeze({mounted:true,version:'coherence-gen1536-identity-only-v4',wordmarkGeometry:'css-preserve-3d-extrusion-v2',coheriscope:true,secondarySpatialCompass:false,spacecraftMounted:false,spacecraftAuthority:'DELEGATED_TO_DGB_LAWS_SPACECRAFT',receipt:()=>({identityMounted:Boolean(state.identity),coheriscopeIdentity:state.root?.dataset.coheriscopeIdentity||'',secondaryCompass:state.root?.dataset.secondaryCompass||'',identitySpacecraft:state.root?.dataset.identitySpacecraft||'',spacecraftMounted:false})});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
