(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_GEN1537_LIVE_RECOVERY';
function retire(){
  document.querySelectorAll('[data-gen1537-compass-instrument],.compass-gen1537-instrument,[data-upstream-compass-mount]').forEach(node=>node.remove());
  const root=document.querySelector('[data-compass-root]');
  if(root){
    root.dataset.gen1537Recovery='retired-emergency';
    root.dataset.gen1537CompassContract='NO_FIXED_CENTER_INSTRUMENT';
    root.dataset.gen1537LowerCarousel='preserved-unmodified';
  }
  globalThis[GLOBAL]=Object.freeze({mounted:true,retired:true,version:'gen1537-retired-emergency-v1',receipt:()=>Object.freeze({instrumentMounted:false,lowerCarouselPreserved:true,retired:true})});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',retire,{once:true}):retire();
})();
