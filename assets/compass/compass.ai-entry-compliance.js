(()=>{
'use strict';
const ROOT='[data-compass-root]';
let reconciling=false;
function style(){if(document.getElementById('compass-ai-entry-compliance-v3'))return;document.getElementById('compass-ai-entry-compliance-v2')?.remove();const s=document.createElement('style');s.id='compass-ai-entry-compliance-v3';s.textContent=`
.compass-bilateral-rotor-card{backface-visibility:visible!important;-webkit-backface-visibility:visible!important}
.compass-bilateral-rotor-card[data-active="false"]{opacity:.18!important}
.compass-bilateral-rail,.compass-readiness-dots,[data-orbit-next],[data-orbit-previous]{display:none!important;pointer-events:none!important}
@media(prefers-reduced-motion:reduce){.compass-bilateral-rotor-ring{transition:none!important}.compass-bilateral-rotor-card{transition:none!important}}
`;document.head.append(s)}
function enforce(){
 if(reconciling)return;reconciling=true;
 const root=document.querySelector(ROOT);if(!root){reconciling=false;return}style();
 root.querySelectorAll('.compass-bilateral-rail,[data-orbit-next],[data-orbit-previous],.compass-readiness-dots').forEach(node=>node.remove());
 root.querySelectorAll('.compass-bilateral-rotor').forEach(rotor=>{rotor.dataset.primaryInteraction='DIRECT_DRAG_SWIPE';rotor.dataset.navigationSurrogates='ABSENT';rotor.dataset.spatialAxes='XYZ';rotor.dataset.orbitalContinuity='CONTINUOUS';rotor.dataset.inactiveStateInertness='REQUIRED';rotor.dataset.reducedMotionSemanticAccess='PRESERVED';rotor.dataset.exactReturnState='PRESERVED'});
 root.dataset.aiEntrySpatialLaw='DIRECT_MANIPULATION_NO_SURROGATES';root.dataset.prohibitedSurrogateControlCount=String(root.querySelectorAll('.compass-bilateral-rail,[data-orbit-next],[data-orbit-previous],.compass-readiness-dots').length);root.dataset.rearSpatialStateVisible='true';
 reconciling=false;
}
function boot(){enforce();const root=document.querySelector(ROOT);if(root)new MutationObserver(()=>queueMicrotask(enforce)).observe(root,{childList:true,subtree:true});}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
