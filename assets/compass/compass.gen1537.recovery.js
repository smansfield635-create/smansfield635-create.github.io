(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_GEN1537_LIVE_RECOVERY';
const CLUSTER_GUIDANCE={
  CLUSTER_OPEN:'Select a room star to move forward · Return to Orbit · Swipe to return to constellation',
  ROOM_SELECTED:'Enter Room · Return to Orbit · Swipe to return to constellation'
};
const RAIL_STYLE='position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:12px!important;z-index:999!important;width:min(calc(100% - 28px),680px)!important;margin:0!important;padding:10px 14px!important;transform:translateX(-50%)!important;border:1px solid rgba(137,227,255,.34)!important;border-radius:999px!important;background:rgba(3,8,15,.95)!important;box-shadow:0 12px 30px rgba(0,0,0,.48)!important;color:rgba(238,248,250,.98)!important;font-size:.76rem!important;font-weight:850!important;line-height:1.35!important;text-align:center!important;backdrop-filter:blur(12px)!important;pointer-events:none!important;';
function deriveState(root){
  const mode=String(root?.dataset?.compassMode||'');
  if(mode==='ROOM_SELECTED')return 'ROOM_SELECTED';
  if(mode==='CLUSTER_OPEN')return 'CLUSTER_OPEN';
  if(String(root?.dataset?.selectedRoom||'').trim())return 'ROOM_SELECTED';
  if(String(root?.dataset?.selectedWing||root?.dataset?.selectedCardinal||'').trim())return 'CLUSTER_OPEN';
  return '';
}
function reconcileClusterGuidance(){
  document.querySelectorAll('[data-gen1537-compass-instrument],.compass-gen1537-instrument,[data-upstream-compass-mount]').forEach(node=>node.remove());
  const root=document.querySelector('[data-compass-root]');
  const scene=root?.querySelector('[data-compass-scene]');
  if(!root||!scene)return false;
  root.dataset.gen1537Recovery='retired-emergency';
  root.dataset.gen1537CompassContract='NO_FIXED_CENTER_INSTRUMENT';
  root.dataset.gen1537LowerCarousel='preserved-unmodified';
  let rail=scene.querySelector('[data-compass-cluster-guidance]');
  if(!rail){
    rail=document.createElement('p');
    rail.className='compass-cluster-guidance';
    rail.dataset.compassClusterGuidance='true';
    rail.setAttribute('aria-live','polite');
    rail.style.cssText=RAIL_STYLE;
    scene.appendChild(rail);
  }else if(rail.style.cssText!==RAIL_STYLE){
    rail.style.cssText=RAIL_STYLE;
  }
  const state=deriveState(root);
  const message=CLUSTER_GUIDANCE[state]||'';
  if(rail.textContent!==message)rail.textContent=message;
  rail.hidden=!message;
  rail.style.setProperty('display',message?'block':'none','important');
  return !!message;
}
function start(){
  reconcileClusterGuidance();
  const observer=new MutationObserver(()=>reconcileClusterGuidance());
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-compass-mode','data-selected-wing','data-selected-cardinal','data-selected-room']});
  const timer=setInterval(reconcileClusterGuidance,500);
  globalThis[GLOBAL]=Object.freeze({
    mounted:true,
    retired:true,
    version:'gen1537-retired-emergency-v4',
    receipt:()=>Object.freeze({instrumentMounted:false,lowerCarouselPreserved:true,clusterGuidanceMounted:!!document.querySelector('[data-compass-cluster-guidance]'),clusterGuidanceVisible:reconcileClusterGuidance(),retired:true}),
    stop:()=>{observer.disconnect();clearInterval(timer);}
  });
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();
