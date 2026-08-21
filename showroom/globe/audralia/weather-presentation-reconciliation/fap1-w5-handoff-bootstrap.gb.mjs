import {
  createBoundedW5Handoff,
  verifyBoundedW5Handoff
} from './fap1-w5-handoff.gb.mjs';

const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const W5_SURFACE_SELECTOR='canvas[data-fap1-w5-local-raymarch="true"]';

function handoffDisabled(){
  try{return new URLSearchParams(globalThis.location?.search||'').get('gaProof')==='1';}
  catch(_error){return false;}
}
function sunDirection(){return globalThis.__AUDRALIA_CELESTIAL_STATE__?.getSolarVector?.()||[.42,.78,.46];}
function localSurfaceNodes(){
  const parent=canvas?.parentElement;
  return parent?[...parent.querySelectorAll(W5_SURFACE_SELECTOR)]:[];
}
function retireSupersededRuntime(){
  const prior=globalThis.__AUDRALIA_FAP1_W5_HANDOFF__;
  if(prior&&typeof prior.destroy==='function'){
    try{prior.destroy();}catch(error){console.warn('FAP1_W5_PRIOR_HANDOFF_DESTROY_FAILED',error);}
  }
  for(const node of localSurfaceNodes())node.remove();
}
function assertSingleSurface(){
  const nodes=localSurfaceNodes();
  if(nodes.length!==1)throw new Error(`FAP1_W5_SINGLE_SURFACE_OWNERSHIP_FAILED:${nodes.length}`);
  return nodes[0];
}

async function waitForAuthorities(){
  for(let i=0;i<320;i++){
    const parent=globalThis.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    const ga=globalThis.__AUDRALIA_FAP1_GA_AUTHORITY__;
    if(parent?.renderer&&typeof parent.getCameraFrame==='function'&&ga?.meteorologicalAuthority==='FAP1_ONLY'&&typeof ga.renderNow==='function')return{parent,ga};
    if(globalThis.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__)throw new Error('FAP1_W5_HANDOFF_GA_AUTHORITY_FAILED');
    await sleep(25);
  }
  throw new Error('FAP1_W5_HANDOFF_AUTHORITY_TIMEOUT');
}

function cameraSignature(camera){
  const s=camera?.snapshot||{};
  return [s.yaw,s.pitch,s.distance,s.targetU,s.targetV].map(v=>Number(v??0).toFixed(3)).join('|');
}

async function initialize(){
  if(handoffDisabled()){
    retireSupersededRuntime();
    globalThis.__AUDRALIA_FAP1_W5_HANDOFF__=Object.freeze({schema:'FAP1_W5_BOUNDED_MACRO_LOCAL_HANDOFF_v2_L5_DIRECT',disabledForGAProof:true,l5LightingActive:false,surfaceOwnership:'SINGLE_RUNTIME_OWNER'});
    return;
  }
  if(!(canvas instanceof HTMLCanvasElement))throw new Error('FAP1_W5_HANDOFF_CANVAS_MISSING');
  const {parent,ga}=await waitForAuthorities();

  // A query-string import or repeated bootstrap may execute this module more than
  // once. The previous handoff owns its RAF, listeners, WebGL resources and local
  // canvas, so retire it before constructing the successor. Any orphaned canvas
  // left by an older bootstrap is removed as a fail-closed cleanup.
  retireSupersededRuntime();

  const handoff=createBoundedW5Handoff({worldCanvas:canvas,parentReceipt:parent,gaAuthority:ga,getSunDirection:sunDirection});
  assertSingleSurface();
  let interacting=false,lastSignature='',lastRender=0,raf=0,lastVerification=null,quality='REST',destroyed=false;

  function renderNow(){
    if(destroyed)throw new Error('FAP1_W5_HANDOFF_DESTROYED');
    assertSingleSurface();
    handoff.setQuality(quality);
    const receipt=handoff.render();
    const verification=verifyBoundedW5Handoff(receipt);
    if(!verification.pass)throw new Error(`FAP1_W5_HANDOFF_INVALID:${verification.failures.join(',')}`);
    lastVerification=verification;
    const camera=parent.getCameraFrame();
    lastSignature=cameraSignature(camera);
    lastRender=performance.now();
    return receipt;
  }

  function begin(){if(!interacting){interacting=true;quality='INTERACTIVE';handoff.beginInteraction();}}
  function end(){if(interacting){interacting=false;quality='REST';handoff.endInteraction();lastSignature='';}}
  function onWheel(){begin();clearTimeout(initialize._wheelTimer);initialize._wheelTimer=setTimeout(end,180);}
  canvas.addEventListener('pointerdown',begin,{passive:true});
  canvas.addEventListener('pointerup',end,{passive:true});
  canvas.addEventListener('pointercancel',end,{passive:true});
  canvas.addEventListener('lostpointercapture',end,{passive:true});
  canvas.addEventListener('wheel',onWheel,{passive:true});

  function frame(now){
    if(destroyed)return;
    const camera=parent.getCameraFrame();
    const signature=cameraSignature(camera);
    if(signature!==lastSignature||now-lastRender>420)renderNow();
    raf=requestAnimationFrame(frame);
  }

  renderNow();
  raf=requestAnimationFrame(frame);

  const owner=Object.freeze({
    schema:'FAP1_W5_BOUNDED_MACRO_LOCAL_HANDOFF_v2_L5_DIRECT',
    authority:'BOUNDED_GB_HANDOFF_ACTIVE',
    weatherAuthority:'FAP1_ONLY',
    canonicalDensityPreserved:true,
    macroLocalContinuityPreviouslyPassed:true,
    l5LightingActive:true,
    l5LightingModel:'DIRECT_SUN_TRANSMITTANCE_ONLY',
    surfaceOwnership:'SINGLE_RUNTIME_OWNER',
    getSurfaceCount:()=>localSurfaceNodes().length,
    getActiveSurface:()=>localSurfaceNodes()[0]??null,
    getReceipt:()=>handoff.getReceipt(),
    getVerification:()=>lastVerification,
    renderNow,
    setQuality(value){quality=value==='CAPTURE'?'CAPTURE':value==='INTERACTIVE'?'INTERACTIVE':'REST';handoff.setQuality(quality);return renderNow();},
    destroy(){
      if(destroyed)return;
      destroyed=true;
      cancelAnimationFrame(raf);
      clearTimeout(initialize._wheelTimer);
      canvas.removeEventListener('pointerdown',begin);
      canvas.removeEventListener('pointerup',end);
      canvas.removeEventListener('pointercancel',end);
      canvas.removeEventListener('lostpointercapture',end);
      canvas.removeEventListener('wheel',onWheel);
      handoff.destroy();
      for(const node of localSurfaceNodes())node.remove();
    }
  });
  globalThis.__AUDRALIA_FAP1_W5_HANDOFF__=owner;
}

initialize().catch(error=>{
  globalThis.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__=Object.freeze({message:error instanceof Error?error.message:String(error)});
  console.error('AUDRALIA_FAP1_W5_HANDOFF_FAILED',error);
});
