import {createExteriorWeatherProjectionGA} from './exterior-weather.ga-v2-spatial-handoff.mjs';

const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForReceipt(){
  for(let i=0;i<240;i++){
    const receipt=globalThis.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    if(receipt?.renderer&&typeof receipt.getCameraFrame==='function')return receipt;
    if(globalThis.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__)throw new Error('FAP1_GA_PARENT_RECONCILIATION_FAILED');
    await sleep(25);
  }
  throw new Error('FAP1_GA_PARENT_RECEIPT_TIMEOUT');
}

function sunDirection(){return globalThis.__AUDRALIA_CELESTIAL_STATE__?.getSolarVector?.()||[.42,.78,.46];}
function cameraSignature(camera){const s=camera?.snapshot||{};return[s.yaw,s.pitch,s.distance,s.targetU,s.targetV].map(v=>Number(v??0).toFixed(3)).join('|');}

async function initialize(){
  if(!(canvas instanceof HTMLCanvasElement))throw new Error('FAP1_GA_CANVAS_MISSING');
  const receipt=await waitForReceipt();
  if(receipt.exterior?.overlay){receipt.exterior.overlay.style.visibility='hidden';receipt.exterior.overlay.dataset.fap1GADiagnosticOnly='true';receipt.exterior.overlay.dataset.meteorologicalAuthority='RETIRED_VISIBLE_AUTHORITY';}
  if(receipt.canonicalWeather?.overlay){receipt.canonicalWeather.overlay.style.visibility='hidden';receipt.canonicalWeather.overlay.dataset.fap1GADiagnosticOnly='true';receipt.canonicalWeather.overlay.dataset.meteorologicalAuthority='REFERENCE_ONLY';}

  const ga=createExteriorWeatherProjectionGA({renderer:receipt.renderer,worldCanvas:canvas,getSunDirection:sunDirection});
  ga.overlay.dataset.fap1SoleVisibleDensityAuthority='true';
  let interacting=false,lastSignature='',lastTimeRender=0,raf=0;

  function renderNow(){const camera=receipt.getCameraFrame();ga.render(camera);lastSignature=cameraSignature(camera);lastTimeRender=performance.now();return ga.getPacket();}
  function begin(){if(!interacting){interacting=true;ga.beginInteraction();}}
  function end(){if(interacting){interacting=false;ga.endInteraction();lastSignature='';}}
  canvas.addEventListener('pointerdown',begin,{passive:true});
  canvas.addEventListener('pointerup',end,{passive:true});
  canvas.addEventListener('pointercancel',end,{passive:true});
  canvas.addEventListener('lostpointercapture',end,{passive:true});
  canvas.addEventListener('wheel',()=>{begin();clearTimeout(initialize._wheelTimer);initialize._wheelTimer=setTimeout(end,180);},{passive:true});

  function frame(now){const camera=receipt.getCameraFrame(),signature=cameraSignature(camera);if(signature!==lastSignature||now-lastTimeRender>650){ga.render(camera);lastSignature=signature;lastTimeRender=now;}raf=requestAnimationFrame(frame);}
  renderNow();raf=requestAnimationFrame(frame);

  globalThis.__AUDRALIA_FAP1_GA_AUTHORITY__=Object.freeze({
    schema:'AUDRALIA_FAP1_GA_ONE_WEATHER_AUTHORITY_v2_SPATIAL_W5_CARVEOUT',
    meteorologicalAuthority:'FAP1_ONLY',
    visibleDensityAuthority:'FAP1_GPU_DESCRIPTOR_RENDERER',
    legacyExteriorVisible:false,
    canonicalProofWeatherVisible:false,
    legacyWeatherDefinitionsDisposition:'REFERENCE_ONLY',
    noiseCreatesWeather:false,
    spatialW5Carveout:true,
    descriptorEvidence:()=>ga.getEvidence(),
    descriptorPacket:()=>ga.getPacket(),
    setLocalCarveout:value=>ga.setLocalCarveout(value),
    clearLocalCarveout:()=>ga.clearLocalCarveout(),
    getLocalCarveout:()=>ga.getCarveout(),
    renderNow,
    destroy(){cancelAnimationFrame(raf);ga.destroy();}
  });
}

initialize().catch(error=>{
  globalThis.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__=Object.freeze({message:error instanceof Error?error.message:String(error)});
  console.error('AUDRALIA_FAP1_GA_AUTHORITY_FAILED',error);
});
