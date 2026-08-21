(()=>{
'use strict';
function load(src,attr,next){const existing=document.querySelector(`script[${attr}]`);if(existing){if(existing.dataset.loaded==='true')next?.();else existing.addEventListener('load',()=>next?.(),{once:true});return}const script=document.createElement('script');script.src=src;script.defer=true;script.setAttribute(attr,'true');script.addEventListener('load',()=>{script.dataset.loaded='true';next?.()},{once:true});document.head.append(script)}
function loadStyle(href,attr){if(document.querySelector(`link[${attr}]`))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.setAttribute(attr,'true');document.head.append(link)}
loadStyle('/assets/compass/compass.identity-3d.css?v=compass-bounded-identity-v1','data-compass-identity-style');
load('/assets/compass/compass.statement-orbit.js?v=statement-orbit-restoration-v2&cb=980dbbe68b46','data-compass-statement-orbit-runtime',()=>load('/assets/compass/compass.presentation-convergence.js?v=bounded-presentation-convergence-v1','data-compass-presentation-convergence-runtime',()=>load('/assets/compass/compass.capability-carousel.core.js?v=capability-continuity-v3-preserved&cb=adaf5c7fd6c4','data-compass-capability-carousel-core')));
})();
