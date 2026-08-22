(()=>{
'use strict';
const ROOT='[data-compass-root]';
function enforce(){
 const root=document.querySelector(ROOT);if(!root)return;
 root.querySelectorAll('.compass-bilateral-rail').forEach(node=>node.remove());
 root.querySelectorAll('.compass-bilateral-rotor').forEach(rotor=>{
  rotor.dataset.primaryInteraction='DIRECT_DRAG_SWIPE';
  rotor.dataset.navigationSurrogates='ABSENT';
  rotor.dataset.spatialAxes='XYZ';
 });
 root.dataset.aiEntrySpatialLaw='DIRECT_MANIPULATION_NO_SURROGATES';
}
function boot(){enforce();const root=document.querySelector(ROOT);if(root)new MutationObserver(enforce).observe(root,{childList:true,subtree:true});}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
