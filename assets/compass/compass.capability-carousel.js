(()=>{
'use strict';
function load(src,attr,next){const existing=document.querySelector(`script[${attr}]`);if(existing){if(existing.dataset.loaded==='true')next?.();else existing.addEventListener('load',()=>next?.(),{once:true});return}const script=document.createElement('script');script.src=src;script.defer=true;script.setAttribute(attr,'true');script.addEventListener('load',()=>{script.dataset.loaded='true';next?.()},{once:true});document.head.append(script)}
function installGen1586Bounds(){
  document.getElementById('compass-gen1586-bounds')?.remove();
  const style=document.createElement('style');
  style.id='compass-gen1586-bounds';
  style.textContent=`
/* Preserve the canonical scene hitbox while keeping the interactive Compass optically centered. */
[data-compass-scene]{width:100%!important;max-width:100%!important;box-sizing:border-box!important;margin-left:0!important;margin-right:0!important;inset-inline:0!important}
.compass-instrument__grid{justify-items:stretch!important}
.compass-readiness-dots{display:none!important}
@media(max-width:820px){
  [data-compass-scene]{width:100%!important;max-width:100%!important;left:0!important;right:0!important;inset-inline:0!important;margin-inline:0!important}
  .compass-scene,.compass-stage,.compass-compass-stage,[data-compass-render-host],[data-compass-crystal-stage]{max-width:100%!important;box-sizing:border-box!important}
}
`;
  document.head.append(style);
}
load('/assets/compass/compass.statement-orbit.js?v=statement-orbit-restoration-v2&cb=980dbbe68b46','data-compass-statement-orbit-runtime',()=>load('/assets/compass/compass.presentation-convergence.js?v=presentation-convergence-v5&cb=20260821-1586','data-compass-presentation-convergence-runtime',()=>{installGen1586Bounds();load('/assets/compass/compass.capability-carousel.core.js?v=capability-continuity-v4-single-owner&cb=20260821-1577','data-compass-capability-carousel-core')}));
})();
