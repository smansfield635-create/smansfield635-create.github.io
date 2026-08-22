(()=>{
'use strict';
const ENTRY='DGB_COMPASS_RUNTIME_ENTRY_GEN1591';
if(globalThis[ENTRY]?.mounted)return;
const runtime={mounted:true,phase:'BOOTSTRAP',presentationRequested:false,presentationReady:false,statementReady:false,capabilityReady:false,failures:[]};
globalThis[ENTRY]=runtime;
function markFailure(reason){runtime.failures.push(String(reason||'UNKNOWN'));runtime.phase='FAILED';}
function loadExact(src,attr,next){
  const existing=[...document.querySelectorAll(`script[${attr}]`)];
  existing.forEach(node=>{if(node.dataset.gen1591Owner!=='true')node.remove();});
  const script=document.createElement('script');
  script.src=src;
  script.defer=true;
  script.setAttribute(attr,'true');
  script.dataset.gen1591Owner='true';
  script.addEventListener('load',()=>{script.dataset.loaded='true';next?.();},{once:true});
  script.addEventListener('error',()=>markFailure(`LOAD_FAILED:${src}`),{once:true});
  document.head.append(script);
}
function installBounds(){
  ['compass-gen1586-bounds','compass-gen1587-bounds','compass-gen1589-final-repair','compass-gen1590-bounds','compass-gen1591-bounds'].forEach(id=>document.getElementById(id)?.remove());
  const style=document.createElement('style');
  style.id='compass-gen1591-bounds';
  style.textContent=`[data-compass-scene]{width:100%!important;max-width:100%!important;box-sizing:border-box!important;margin-left:0!important;margin-right:0!important;inset-inline:0!important}.compass-instrument__grid{justify-items:stretch!important}.compass-readiness-dots{display:none!important}.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:68px!important;position:relative!important;z-index:30!important}.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-object-caption{padding-bottom:8px!important}.compass-built,.compass-readiness-stage,.compass-readiness-family{overflow:visible!important}.compass-readiness-family{padding-bottom:1.25rem!important}.compass-readiness-viewport{min-height:28rem!important}.compass-readiness-slide{min-height:20rem!important}@media(max-width:820px){[data-compass-scene]{width:100%!important;max-width:100%!important;left:0!important;right:0!important;inset-inline:0!important;margin-inline:0!important}.compass-scene,.compass-stage,.compass-compass-stage,[data-compass-render-host],[data-compass-crystal-stage]{max-width:100%!important;box-sizing:border-box!important}.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:72px!important}.compass-readiness-viewport{min-height:29rem!important}.compass-readiness-slide{min-height:21rem!important}}@media(max-width:480px){.compass-capability-orbit[data-continuity-contract="COMPASS_CAPABILITY_CONTINUITY_v1"] .compass-action-dock{margin-top:76px!important}.compass-readiness-viewport{min-height:32rem!important}.compass-readiness-slide{min-height:23rem!important}}`;
  document.head.append(style);
}
function publish(){
  const root=document.querySelector('[data-compass-root]');
  if(root){
    root.dataset.compassRuntimeEntry='GEN1591';
    root.dataset.compassPresentationBootstrap='DIRECT_FIRST';
    root.dataset.compassPresentationOwner=String(globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2?.version||'pending');
  }
  globalThis.DGB_COMPASS_RUNTIME_ENTRY_GEN1591_RECEIPT=Object.freeze({
    mounted:true,
    phase:runtime.phase,
    presentationRequested:runtime.presentationRequested,
    presentationReady:runtime.presentationReady,
    statementReady:runtime.statementReady,
    capabilityReady:runtime.capabilityReady,
    failures:Object.freeze([...runtime.failures]),
    bootstrapOrder:Object.freeze(['presentation','statement-orbit','capability-core']),
    presentationFirst:true,
    duplicatePresentationScriptRemoval:true,
    compensatingConstellationObserver:false,
    compensatingMirrorlandNavigation:false
  });
}
function startDependents(){
  installBounds();
  runtime.phase='DEPENDENCIES';
  loadExact('/assets/compass/compass.statement-orbit.js?v=statement-orbit-restoration-v2&cb=20260822-1591','data-compass-statement-orbit-runtime',()=>{
    runtime.statementReady=true;
    loadExact('/assets/compass/compass.capability-carousel.core.js?v=capability-continuity-v4-single-owner&cb=20260822-1591','data-compass-capability-carousel-core',()=>{
      runtime.capabilityReady=true;
      runtime.phase='READY';
      publish();
    });
    publish();
  });
}
function start(){
  runtime.phase='PRESENTATION';
  runtime.presentationRequested=true;
  publish();
  loadExact('/assets/compass/compass.presentation-convergence.js?v=presentation-convergence-v8&cb=20260822-1591','data-compass-presentation-convergence-runtime',()=>{
    const owner=globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2;
    if(!owner?.mounted){markFailure('PRESENTATION_OWNER_DID_NOT_MOUNT');publish();return;}
    runtime.presentationReady=true;
    startDependents();
    publish();
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();