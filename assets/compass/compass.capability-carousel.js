(()=>{
'use strict';
function load(src,attr,next){const existing=document.querySelector(`script[${attr}]`);if(existing){if(existing.dataset.loaded==='true')next?.();else existing.addEventListener('load',()=>next?.(),{once:true});return}const script=document.createElement('script');script.src=src;script.defer=true;script.setAttribute(attr,'true');script.addEventListener('load',()=>{script.dataset.loaded='true';next?.()},{once:true});document.head.append(script)}
function installGen1589FinalRepair(){
  document.getElementById('compass-gen1586-bounds')?.remove();
  document.getElementById('compass-gen1587-bounds')?.remove();
  document.getElementById('compass-gen1589-final-repair')?.remove();
  const style=document.createElement('style');
  style.id='compass-gen1589-final-repair';
  style.textContent=`
[data-compass-scene]{width:100%!important;max-width:100%!important;box-sizing:border-box!important;margin-left:0!important;margin-right:0!important;inset-inline:0!important}
.compass-instrument__grid{justify-items:stretch!important}
.compass-readiness-dots{display:none!important}
.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:68px!important;position:relative!important;z-index:30!important}
.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-object-caption{padding-bottom:8px!important}
/* Gen1589: all four constellation stars remain present; only the readable star owns a label. */
[data-compass-root][data-compass-mode="CONSTELLATION"] .compass-object--wing[data-compass-cardinal]{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
[data-compass-root][data-compass-mode="CONSTELLATION"] .compass-object--wing[data-compass-cardinal]>span{opacity:0!important;visibility:hidden!important;display:none!important}
[data-compass-root][data-compass-mode="CONSTELLATION"] .compass-object--wing[data-compass-cardinal].is-readable-cardinal>span{opacity:1!important;visibility:visible!important;display:block!important;min-width:7.5rem!important;max-width:9.5rem!important;padding:.34rem .56rem!important;text-align:center!important;line-height:1.12!important}
/* Gen1589: readiness cards may not clip, and neighboring cards must read unmistakably as a carousel. */
.compass-built,.compass-readiness-stage,.compass-readiness-family{overflow:visible!important}
.compass-readiness-family{padding-bottom:1.25rem!important}
.compass-readiness-viewport{min-height:27rem!important;overflow:visible!important;padding-block:1rem!important}
.compass-readiness-slide{width:min(76%,700px)!important;min-height:19rem!important;overflow:visible!important}
.compass-readiness-slide[data-position="active"]{z-index:5!important;opacity:1!important}
.compass-readiness-slide[data-position="prev"],.compass-readiness-slide[data-position="next"]{opacity:.58!important;visibility:visible!important;filter:saturate(.78) brightness(.78)!important;border-color:rgba(211,225,233,.24)!important;box-shadow:0 18px 46px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.06)!important}
.compass-readiness-slide[data-position="prev"]{transform:translate(-50%,-50%) translateX(-72%) scale(.84) rotateY(8deg)!important}
.compass-readiness-slide[data-position="next"]{transform:translate(-50%,-50%) translateX(72%) scale(.84) rotateY(-8deg)!important}
.compass-readiness-slide[data-position="prev"]::after,.compass-readiness-slide[data-position="next"]::after{content:attr(data-readiness-title);display:grid;place-items:center;position:absolute;inset:0;padding:1rem;color:rgba(244,240,222,.88);font:800 clamp(.72rem,1.4vw,.9rem)/1.25 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-align:center}
.compass-readiness-slide[data-position="active"]::after,.compass-readiness-slide[data-position="far"]::after{content:none!important}
.compass-readiness-head{position:relative!important;z-index:8!important;margin-bottom:.75rem!important}
.compass-readiness-slide-tabs{position:relative!important;z-index:8!important;margin-bottom:.5rem!important}
@media(max-width:820px){
  [data-compass-scene]{width:100%!important;max-width:100%!important;left:0!important;right:0!important;inset-inline:0!important;margin-inline:0!important}
  .compass-scene,.compass-stage,.compass-compass-stage,[data-compass-render-host],[data-compass-crystal-stage]{max-width:100%!important;box-sizing:border-box!important}
  .compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:72px!important}
  .compass-readiness-viewport{min-height:28rem!important;overflow:hidden!important}
  .compass-readiness-slide{width:78%!important;min-height:20rem!important}
  .compass-readiness-slide[data-position="prev"]{transform:translate(-50%,-50%) translateX(-78%) scale(.82)!important}
  .compass-readiness-slide[data-position="next"]{transform:translate(-50%,-50%) translateX(78%) scale(.82)!important}
}
@media(max-width:480px){
  .compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:76px!important}
  .compass-readiness-viewport{min-height:31rem!important}
  .compass-readiness-slide{width:82%!important;min-height:22rem!important}
  .compass-readiness-slide[data-position="prev"]{transform:translate(-50%,-50%) translateX(-82%) scale(.80)!important}
  .compass-readiness-slide[data-position="next"]{transform:translate(-50%,-50%) translateX(82%) scale(.80)!important}
}
`;
  document.head.append(style);
  const root=document.querySelector('[data-compass-root]');
  if(!root)return;
  const repair=()=>{
    const constellation=root.dataset.compassMode==='CONSTELLATION';
    const readable=(root.dataset.renderedForegroundCardinal||root.dataset.readableCardinal||'').toLowerCase();
    root.querySelectorAll('.compass-object--wing[data-compass-cardinal]').forEach(wing=>{
      if(constellation){
        wing.hidden=false;
        wing.removeAttribute('aria-hidden');
        wing.removeAttribute('data-gen1588-cardinal-visible');
        const id=(wing.dataset.cardinalId||wing.dataset.wing||'').toLowerCase();
        wing.classList.toggle('is-readable-cardinal',Boolean(readable&&id===readable));
      }
    });
    const routes=root.querySelector('[data-compass-mirrorland-routes]');
    if(routes&&root.dataset.compassMode==='MIRRORLAND_FOCUSED'){
      let node=routes;
      while(node&&node!==document.body){node.removeAttribute('inert');node.removeAttribute('aria-hidden');node=node.parentElement;}
      routes.style.pointerEvents='auto';
      routes.querySelectorAll('a').forEach(link=>{link.style.pointerEvents='auto';link.removeAttribute('inert');});
    }
  };
  const observer=new MutationObserver(()=>queueMicrotask(repair));
  observer.observe(root,{subtree:true,attributes:true,attributeFilter:['data-compass-mode','data-readable-cardinal','data-rendered-foreground-cardinal','hidden','inert','aria-hidden']});
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('[data-compass-mirrorland-routes] a');
    if(!link||root.dataset.compassMode!=='MIRRORLAND_FOCUSED'||link.hasAttribute('data-threshold-return')||link.hasAttribute('data-compass-mirrorland-inline-back'))return;
    const href=link.getAttribute('href');
    if(!href)return;
    event.preventDefault();event.stopImmediatePropagation();
    window.location.assign(new URL(href,window.location.href).href);
  },true);
  repair();
  globalThis.DGB_COMPASS_GEN1589_FINAL_REPAIR=Object.freeze({mounted:true,labelPolicy:'ALL_STARS_ONE_READABLE_LABEL',readinessPolicy:'UNCLIPPED_VISIBLE_NEIGHBOR_CAROUSEL',mirrorlandPolicy:'FOUR_OPTIONS_INTERACTIVE'});
}
load('/assets/compass/compass.statement-orbit.js?v=statement-orbit-restoration-v2&cb=980dbbe68b46','data-compass-statement-orbit-runtime',()=>load('/assets/compass/compass.presentation-convergence.js?v=presentation-convergence-v7&cb=20260822-1589','data-compass-presentation-convergence-runtime',()=>{installGen1589FinalRepair();load('/assets/compass/compass.capability-carousel.core.js?v=capability-continuity-v4-single-owner&cb=20260821-1577','data-compass-capability-carousel-core')}));
})();
