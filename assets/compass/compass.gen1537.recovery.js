(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_GEN1537_LIVE_RECOVERY';
const CLUSTER_GUIDANCE={
  CLUSTER_OPEN:'Tap a star to select it · Swipe across open space to return to constellation',
  ROOM_SELECTED:'Enter Room · Return to Orbit · Swipe across open space to return to constellation'
};
function mountClusterGuidance(root){
  const scene=root?.querySelector('[data-compass-scene]');
  if(!scene)return;
  let rail=scene.querySelector('[data-compass-cluster-guidance]');
  if(!rail){
    rail=document.createElement('p');
    rail.className='compass-guidance compass-cluster-guidance';
    rail.dataset.compassClusterGuidance='true';
    rail.setAttribute('aria-live','polite');
    rail.style.cssText='position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:12px!important;z-index:60!important;width:min(calc(100% - 28px),680px)!important;margin:0!important;padding:10px 14px!important;transform:translateX(-50%)!important;border:1px solid rgba(137,227,255,.28)!important;border-radius:999px!important;background:rgba(3,8,15,.92)!important;box-shadow:0 12px 30px rgba(0,0,0,.42)!important;color:rgba(238,248,250,.96)!important;font-size:.76rem!important;font-weight:850!important;line-height:1.35!important;text-align:center!important;backdrop-filter:blur(12px)!important;pointer-events:none!important;';
    scene.appendChild(rail);
  }
  const sync=()=>{
    const message=CLUSTER_GUIDANCE[root.dataset.compassMode]||'';
    rail.textContent=message;
    rail.hidden=!message;
    rail.style.display=message?'block':'none';
  };
  sync();
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-compass-mode']});
}
function retire(){
  document.querySelectorAll('[data-gen1537-compass-instrument],.compass-gen1537-instrument,[data-upstream-compass-mount]').forEach(node=>node.remove());
  const root=document.querySelector('[data-compass-root]');
  if(root){
    root.dataset.gen1537Recovery='retired-emergency';
    root.dataset.gen1537CompassContract='NO_FIXED_CENTER_INSTRUMENT';
    root.dataset.gen1537LowerCarousel='preserved-unmodified';
    mountClusterGuidance(root);
  }
  globalThis[GLOBAL]=Object.freeze({mounted:true,retired:true,version:'gen1537-retired-emergency-v2',receipt:()=>Object.freeze({instrumentMounted:false,lowerCarouselPreserved:true,clusterGuidanceMounted:true,retired:true})});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',retire,{once:true}):retire();
})();
