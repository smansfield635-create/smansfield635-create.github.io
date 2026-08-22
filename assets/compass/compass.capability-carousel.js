(()=>{
'use strict';
function load(src,attr,next){const existing=document.querySelector(`script[${attr}]`);if(existing){if(existing.dataset.loaded==='true')next?.();else existing.addEventListener('load',()=>next?.(),{once:true});return}const script=document.createElement('script');script.src=src;script.defer=true;script.setAttribute(attr,'true');script.addEventListener('load',()=>{script.dataset.loaded='true';next?.()},{once:true});document.head.append(script)}
function installGen1587Bounds(){
  document.getElementById('compass-gen1586-bounds')?.remove();
  document.getElementById('compass-gen1587-bounds')?.remove();
  const style=document.createElement('style');
  style.id='compass-gen1587-bounds';
  style.textContent=`
/* Preserve the canonical scene hitbox while keeping the interactive Compass optically centered. */
[data-compass-scene]{width:100%!important;max-width:100%!important;box-sizing:border-box!important;margin-left:0!important;margin-right:0!important;inset-inline:0!important}
.compass-instrument__grid{justify-items:stretch!important}
.compass-readiness-dots{display:none!important}
/* Gen1587 collision reservation: capability copy and its action dock own separate vertical bands. */
.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:68px!important;position:relative!important;z-index:30!important}
.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-object-caption{padding-bottom:8px!important}
@media(max-width:820px){
  [data-compass-scene]{width:100%!important;max-width:100%!important;left:0!important;right:0!important;inset-inline:0!important;margin-inline:0!important}
  .compass-scene,.compass-stage,.compass-compass-stage,[data-compass-render-host],[data-compass-crystal-stage]{max-width:100%!important;box-sizing:border-box!important}
  .compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:72px!important}
}
@media(max-width:480px){
  .compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:76px!important}
}
`;
  document.head.append(style);
}
load('/assets/compass/compass.statement-orbit.js?v=statement-orbit-restoration-v2&cb=980dbbe68b46','data-compass-statement-orbit-runtime',()=>load('/assets/compass/compass.presentation-convergence.js?v=presentation-convergence-v7&cb=20260822-1588','data-compass-presentation-convergence-runtime',()=>load('/assets/compass/compass.presentation-convergence.v8.js?v=gen1589-final-four-fixes-v1&cb=20260822-1589','data-compass-gen1589-final-fixes',()=>{installGen1587Bounds();load('/assets/compass/compass.capability-carousel.core.js?v=capability-continuity-v4-single-owner&cb=20260821-1577','data-compass-capability-carousel-core')})));
})();
