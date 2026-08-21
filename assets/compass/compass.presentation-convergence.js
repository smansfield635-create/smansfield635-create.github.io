(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_PRESENTATION_RETIREMENT_V2';
if(globalThis[GLOBAL]?.mounted)return;
const state={root:null};
function retireLegacyPresentation(){
  const root=state.root||document.querySelector('[data-compass-root]');
  if(!root)return;
  document.querySelectorAll('link[data-compass-identity-style]').forEach(node=>node.remove());
  root.querySelectorAll('[data-compass-identity-bounded],.compass-identity-3d').forEach(node=>node.remove());
  const title=root.querySelector('#compass-title');
  if(title){title.hidden=false;title.removeAttribute('aria-hidden');}
  delete root.dataset.studioIdentity;
  root.dataset.compassIdentityPolicy='canonical-static-title';
}
function installNarrowStyle(){
  document.getElementById('compass-bounded-presentation-style-v2')?.remove();
  document.getElementById('compass-runtime-retirement-style-v1')?.remove();
  if(document.getElementById('compass-runtime-retirement-style-v2'))return;
  const style=document.createElement('style');style.id='compass-runtime-retirement-style-v2';
  style.textContent=`
.compass-estate__header{min-height:0!important;height:auto!important;padding-top:clamp(1rem,3vw,2rem)!important;padding-bottom:clamp(.65rem,1.6vw,1.1rem)!important}
.compass-statement-orbit{min-height:6.2rem!important;margin:clamp(.75rem,2vw,1.35rem) auto .35rem!important}
.compass-editorial-intro{margin-top:clamp(.45rem,1.2vw,.8rem)!important;margin-bottom:clamp(.75rem,1.8vw,1.15rem)!important}
.compass-instrument{padding:clamp(.8rem,2.2vw,1.35rem)!important;border:1px solid rgba(124,220,255,.16)!important;border-radius:clamp(1.25rem,2.6vw,2rem)!important;background:linear-gradient(145deg,rgba(4,12,19,.64),rgba(5,11,18,.38))!important;box-shadow:0 22px 64px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.045)!important}
.compass-orbit-intro{width:min(100%,900px)!important;margin:0 auto clamp(.75rem,1.8vw,1.1rem)!important;padding:clamp(.9rem,2vw,1.25rem) clamp(1rem,2.5vw,1.45rem)!important;border:1px solid rgba(216,184,106,.15)!important;border-radius:1rem!important;background:linear-gradient(135deg,rgba(216,184,106,.045),rgba(102,205,224,.035))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important}
.compass-guidance,[data-compass-guidance]{position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:14px!important;z-index:20!important;width:min(calc(100% - 32px),720px)!important;height:auto!important;min-height:42px!important;margin:0!important;padding:10px 14px!important;overflow:visible!important;clip:auto!important;clip-path:none!important;white-space:normal!important;border:1px solid rgba(124,220,255,.22)!important;border-radius:999px!important;background:rgba(3,9,16,.88)!important;box-shadow:0 12px 34px rgba(0,0,0,.30)!important;color:rgba(239,245,241,.94)!important;font:800 clamp(.7rem,1.45vw,.82rem)/1.35 Inter,ui-sans-serif,system-ui,sans-serif!important;text-align:center!important;transform:translateX(-50%)!important;opacity:1!important;visibility:visible!important;pointer-events:none!important}
@media(max-width:820px){.compass-instrument{padding:.65rem!important}.compass-orbit-intro{padding:.85rem .8rem!important}.compass-guidance,[data-compass-guidance]{bottom:10px!important;width:calc(100% - 22px)!important;border-radius:16px!important;font-size:.7rem!important}}
`;
  document.head.append(style);
}
function mount(){
  state.root=document.querySelector('[data-compass-root]');if(!state.root)return;
  retireLegacyPresentation();
  installNarrowStyle();
  globalThis[GLOBAL]=Object.freeze({
    mounted:true,
    version:'presentation-retirement-v2',
    legacyIdentityRetired:true,
    mirrorlandInteractionOwner:'DGB_COMPASS_CONTROLLER',
    guidanceOwner:'DGB_COMPASS_CONTROLLER',
    broadPresentationOwnership:false
  });
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
