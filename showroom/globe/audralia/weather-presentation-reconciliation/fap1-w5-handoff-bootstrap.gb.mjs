import {
  createBoundedW5Handoff,
  verifyBoundedW5Handoff
} from './fap1-w5-handoff.gb.mjs';

const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function handoffDisabled(){
  try{return new URLSearchParams(globalThis.location?.search||'').get('gaProof')==='1';}
  catch(_error){return false;}
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
    globalThis.__AUDRALIA_FAP1_W5_HANDOFF__=Object.freeze({schema:'FAP1_W5_BOUNDED_MACRO_LOCAL_HANDOFF_v1',disabledForGAProof:true,l5LightingActive:false});
    return;
  }
  if(!(canvas instanceof HTMLCanvasElement))throw new Error('FAP1_W5_HANDOFF_CANVAS_MISSING');
  const {parent,ga}=await waitForAuthorities();
  const handoff=createBoundedW5Handoff({worldCanvas:canvas,parentReceipt:parent,gaAuthority:ga});
  let interacting=false,lastSignature='',lastRender=0,raf=0,lastVerification=null;

  function renderNow(){
    const receipt=handoff.render();
    const verification=verifyBoundedW5Handoff(receipt);
    if(!verification.pass)throw new Error(`FAP1_W5_HANDOFF_INVALID:${verification.failures.join(',')}`);
    lastVerification=verification;
    const camera=parent.getCameraFrame();
    lastSignature=cameraSignature(camera);
    lastRender=performance.now();
    return receipt;
  }

  function begin(){if(!interacting){interacting=true;handoff.beginInteraction();}}
  function end(){if(interacting){interacting=false;handoff.endInteraction();lastSignature='';}}
  canvas.addEventListener('pointerdown',begin,{passive:true});
  canvas.addEventListener('pointerup',end,{passive:true});
  canvas.addEventListener('pointercancel',end,{passive:true});
  canvas.addEventListener('lostpointercapture',end,{passive:true});
  canvas.addEventListener('wheel',()=>{begin();clearTimeout(initialize._wheelTimer);initialize._wheelTimer=setTimeout(end,180);},{passive:true});

  function frame(now){
    const camera=parent.getCameraFrame();
    const signature=cameraSignature(camera);
    if(signature!==lastSignature||now-lastRender>420)renderNow();
    raf=requestAnimationFrame(frame);
  }

  renderNow();
  raf=requestAnimationFrame(frame);

  globalThis.__AUDRALIA_FAP1_W5_HANDOFF__=Object.freeze({
    schema:'FAP1_W5_BOUNDED_MACRO_LOCAL_HANDOFF_v1',
    authority:'BOUNDED_GB_HANDOFF_ACTIVE',
    weatherAuthority:'FAP1_ONLY',
    canonicalDensityPreserved:true,
    macroLocalContinuityPreviouslyPassed:true,
    l5LightingActive:false,
    getReceipt:()=>handoff.getReceipt(),
    getVerification:()=>lastVerification,
    renderNow,
    destroy(){cancelAnimationFrame(raf);handoff.destroy();}
  });
}

initialize().catch(error=>{
  globalThis.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__=Object.freeze({message:error instanceof Error?error.message:String(error)});
  console.error('AUDRALIA_FAP1_W5_HANDOFF_FAILED',error);
});
