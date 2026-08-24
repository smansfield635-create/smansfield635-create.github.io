(()=>{
'use strict';
const CONTRACT='COMPASS_BRAIN_GEN1_HRA_CAROUSEL_ENROLLMENT_v1';
function mount(){
  const card=document.querySelector('[data-capability="diagnostic"]');
  const portal=card?.querySelector('.compass-brain-portal');
  if(!portal||portal.dataset.hraEnrolled==='true')return false;
  portal.dataset.hraEnrolled='true';
  portal.dataset.geometryContract='COMPASS_BRAIN_GEN1_HRA_GEOMETRY_FREEZE_v1';
  const frame=document.createElement('iframe');
  frame.src='/inspection/compass/brain-gen1-hra/?carousel=1';
  frame.title='Coheriscope anatomical brain';
  frame.loading='eager';
  frame.setAttribute('aria-label','Coheriscope anatomical brain');
  frame.setAttribute('tabindex','-1');
  frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#05090d;pointer-events:none;';
  portal.replaceChildren(frame);
  Object.defineProperty(globalThis,'CompassHraBrainEnrollment',{configurable:true,enumerable:true,value:Object.freeze({mounted:true,contract:CONTRACT,geometry:'FROZEN',material:'ROSE_FLESH_PRESENTATION_ONLY',source:'/inspection/compass/brain-gen1-hra/'})});
  document.dispatchEvent(new CustomEvent('compass:hra-brain-enrolled',{detail:globalThis.CompassHraBrainEnrollment}));
  return true;
}
function boot(){if(mount())return;const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),12000)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
