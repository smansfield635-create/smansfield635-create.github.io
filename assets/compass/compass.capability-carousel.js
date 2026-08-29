(()=>{
'use strict';
const PRESENTATION_OWNER='DGB_COMPASS_PRESENTATION_OWNER_GEN1591';
const LIVE_COMPOSITE_BUILD='gen1596-surgical-composite-5';
const POST_LOAD_ENHANCEMENT_DELAY_MS=800;
function load(src,attr,next){const existing=document.querySelector(`script[${attr}]`);if(existing){if(existing.dataset.loaded==='true'||existing.readyState==='complete')next?.();else existing.addEventListener('load',()=>next?.(),{once:true});return;}const script=document.createElement('script');script.src=src;script.defer=true;script.setAttribute(attr,'true');script.addEventListener('load',()=>{script.dataset.loaded='true';next?.()},{once:true});document.head.append(script);}
function requirePresentationOwner(next){let frames=0;const ready=()=>{let owner=globalThis[PRESENTATION_OWNER];if(!owner?.mounted){const mounted=globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2;if(mounted?.mounted){owner=globalThis[PRESENTATION_OWNER]=Object.freeze({mounted:true,version:'presentation-convergence-v8-root-bound-gen1591',rootIdentity:'gen1591-r4',legacyGuardClearedBeforeFetch:true,presentationReceipt:mounted});}}if(owner?.mounted&&owner.version==='presentation-convergence-v8-root-bound-gen1591'&&owner.legacyGuardClearedBeforeFetch===true){next(owner);return;}if(frames++<120){requestAnimationFrame(ready);return;}throw new Error('COMPASS_GEN1591_PRESENTATION_OWNER_NOT_MOUNTED');};if(document.readyState==='complete'||document.readyState==='interactive')queueMicrotask(ready);else document.addEventListener('DOMContentLoaded',ready,{once:true});}
function declareControllerSettledLabelAuthority(){globalThis.DGB_COMPASS_LAWS_LABEL_BINDING=Object.freeze({mounted:true,source:'DGB_COMPASS_CONTROLLER:[data-compass-cardinal][data-primary=true]',previewSource:null,policy:'ALL_FOUR_STARS_PRESENT_ONE_CONTROLLER_COMMITTED_READABLE_LABEL',settlement:'CONTROLLER_DATA_PRIMARY_DIRECT_PRESENTATION',observer:false});}
function bindSubordinateStaticShell(owner){
  const path=location.pathname.replace(/\/index\.html$/,'/');if(path!=='/')return;
  const css=document.querySelector('link[data-compass-live-composite][data-first-paint-authority="static"]');
  const runtime=document.querySelector('script[data-compass-live-composite-runtime][data-first-paint-authority="static"]');
  const bounds=document.getElementById('compass-gen1591-bounds');
  if(!css||!runtime||!bounds)throw new Error('COMPASS_STATIC_FIRST_PAINT_AUTHORITY_MISSING');
  globalThis.DGB_COMPASS_LIVE_COMPOSITE_PROMOTION=Object.freeze({mounted:true,build:LIVE_COMPOSITE_BUILD,source:'/compass-composite/',delivery:'STATIC_DOCUMENT_FIRST_PAINT',ownership:'SUBORDINATE_TO_GEN1591_PRESENTATION_ROOT',owner:PRESENTATION_OWNER,ownerVersion:owner.version,mechanicsAuthority:'DGB_COMPASS_CONTROLLER'});
  globalThis.DGB_COMPASS_GEN1591_BOUNDS=Object.freeze({mounted:true,ownershipPolicy:'ONE_PRESENTATION_ROOT_WITH_STATIC_COMPOSITE_SUBORDINATE',presentationOwner:PRESENTATION_OWNER,readinessPolicy:'UNCLIPPED_SPATIAL_CAROUSEL_RESERVATION',tabletContextPolicy:'MEASURED_SCENE_COLUMN_COLLAPSE_AT_TABLET',releaseSettlementAuthority:'CONTROLLER_DATA_PRIMARY_DIRECT_PRESENTATION',capabilityStability:'COMMITTED_SELECTION_SNAPS_FRONT_TROPHY_HEIGHT_NORMALIZED'});
}
function scheduleDeferredCapabilityEnhancement(){
  let scheduled=false;
  const run=()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{
    load('/assets/compass/compass.hra-brain-scene.js?v=brain-gen1-hra-passive-v1&g=1607&cb=20260824-brain-gen1-hra-passive-v1','data-compass-hra-brain-scene',()=>{
      load('/assets/compass/compass.capability-carousel.core.js?v=capability-continuity-v4-single-owner&cb=20260821-1577','data-compass-capability-carousel-core');
    });
  },POST_LOAD_ENHANCEMENT_DELAY_MS);};
  if(document.readyState==='complete')run();else window.addEventListener('load',run,{once:true});
  globalThis.DGB_COMPASS_OPTIONAL_ENHANCEMENT_BOUNDARY=Object.freeze({afterDocumentLoad:true,delayMs:POST_LOAD_ENHANCEMENT_DELAY_MS,firstPaintDependency:false,ownership:'SUBORDINATE_LOCAL_ENHANCEMENT'});
}
declareControllerSettledLabelAuthority();
requirePresentationOwner(owner=>{
  bindSubordinateStaticShell(owner);
  load('/assets/compass/compass.statement-orbit.js?v=statement-orbit-restoration-v2&cb=980dbbe68b46','data-compass-statement-orbit-runtime');
  scheduleDeferredCapabilityEnhancement();
});
})();
