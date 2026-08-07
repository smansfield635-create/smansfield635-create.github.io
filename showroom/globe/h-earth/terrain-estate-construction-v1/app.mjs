const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const diagnosticNode=document.querySelector('[data-h-earth-diagnostic]');
const focusButton=document.querySelector('[data-fit-world]');
const brandNode=document.querySelector('.preview-brand');

const OPERATION_ID='H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const CHECKPOINT='OW01';
const LOCK_GENERATION=473;

const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};
const setDiagnostic=(text)=>{if(diagnosticNode)diagnosticNode.textContent=text;};
const fail=(stage,error)=>{const message=error instanceof Error?error.message:String(error);console.error(`AUDRALIA_OW01_INSPECTOR_${stage}_FAILED`,error);setStatus('ERROR',`${stage}_FAILED`);setDiagnostic(`${stage}_FAILED: ${message}`);window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW_ERROR__=Object.freeze({operationId:OPERATION_ID,checkpoint:CHECKPOINT,lockGeneration:LOCK_GENERATION,stage,message});};

function updateScaleUI(renderer){
  const scale=renderer.getViewScale();
  if(brandNode)brandNode.textContent=`Audralia · Gratitude · OW01 · ${scale.toLowerCase()}`;
  if(focusButton)focusButton.textContent=scale==='LOCAL'?'reset view':'focus Gratitude';
  const descriptions={
    LOCAL:'LOCAL · 1:1 Gratitude terrain · topology-clipped coast · inspect the aperture/stitch handoff and Harbor.',
    REGION:'REGION · separate Gratitude continental mesh · explicit local aperture · bounded stitch annulus.',
    CONTINENT:'CONTINENT · deliberate closed Gratitude coastline contour · inspect bays, capes, asymmetry, and inland axes.',
    PLANETARY:'PLANETARY · Gratitude is separate from the coarse planetary base; the other eight continents remain noncanonical.'
  };
  setDiagnostic(descriptions[scale]||descriptions.LOCAL);
}

function wire(renderer){
  const pointers=new Map();let gesture=null;
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5});const safe=(v)=>Math.max(-64,Math.min(64,v));
  const refresh=()=>{const a=[...pointers.values()];gesture=a.length===2?{midpoint:midpoint(a[0],a[1]),distance:Math.max(1,distance(a[0],a[1]))}:null;};
  const after=()=>updateScaleUI(renderer);
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});refresh();});
  canvas.addEventListener('pointermove',e=>{const prev=pointers.get(e.pointerId);if(!prev)return;const next={x:e.clientX,y:e.clientY};pointers.set(e.pointerId,next);if(pointers.size===1){renderer.orbit(safe(next.x-prev.x),safe(next.y-prev.y));after();return;}if(pointers.size===2){const a=[...pointers.values()],mid=midpoint(a[0],a[1]),dist=Math.max(1,distance(a[0],a[1]));if(gesture){renderer.zoomByFactor(dist/gesture.distance);renderer.panScreen(safe(mid.x-gesture.midpoint.x),safe(mid.y-gesture.midpoint.y));after();}gesture={midpoint:mid,distance:dist};}});
  const clear=e=>{pointers.delete(e.pointerId);refresh();};canvas.addEventListener('pointerup',clear);canvas.addEventListener('pointercancel',clear);canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',e=>{e.preventDefault();renderer.zoom(e.deltaY);after();},{passive:false});canvas.addEventListener('dblclick',()=>{renderer.focusGratitude();after();});
  window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(key==='g'){renderer.focusGratitude();after();return;}if(key==='p'){renderer.planetaryVantage();after();return;}const d=e.shiftKey?28:11;if(e.key==='ArrowLeft'||key==='a')renderer.pan(-d,0);if(e.key==='ArrowRight'||key==='d')renderer.pan(d,0);if(e.key==='ArrowUp'||key==='w')renderer.pan(0,-d);if(e.key==='ArrowDown'||key==='s')renderer.pan(0,d);after();});
  focusButton?.addEventListener('click',()=>{renderer.focusGratitude();after();});window.addEventListener('resize',()=>renderer.render());
}

async function observerAfterPaint(renderer){
  try{
    await new Promise(r=>setTimeout(r,0));
    const module=await import('./observer.mjs');
    const receipt=module.buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer);
    if(receipt.mechanicalChecksPassed===true){
      setStatus('REVIEW','OW01_MECHANICAL_PASS_USER_REVIEW_REQUIRED');
      updateScaleUI(renderer);
    }else{
      setStatus('FAIL','OW01_MECHANICAL_FAIL');
      const failed=Array.isArray(receipt.failedChecks)?receipt.failedChecks.join(', '):'unknown';
      setDiagnostic(`MECHANICAL_FAIL · ${failed}`);
    }
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:OPERATION_ID,checkpoint:CHECKPOINT,lockGeneration:LOCK_GENERATION,renderer,observerReceipt:receipt});
  }catch(error){
    console.warn('AUDRALIA_OW01_INSPECTOR_OBSERVER_FAILED',error);
    setStatus('REVIEW','VISUAL_READY_OBSERVER_DEFERRED');
    setDiagnostic(`VISUAL_READY · observer deferred: ${error instanceof Error?error.message:String(error)}`);
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:OPERATION_ID,checkpoint:CHECKPOINT,lockGeneration:LOCK_GENERATION,renderer,observerReceipt:null,observerDeferredFailure:true});
  }
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('H_EARTH_OW01_CANVAS_MISSING');
    setStatus('world…','IMPORTING_AUDRALIA_OW01_WORLD');
    setDiagnostic('Building separate Gratitude continental mesh, explicit aperture, and bounded local stitch annulus…');
    await new Promise(r=>requestAnimationFrame(r));
    const module=await import('./renderer.mjs');
    setStatus('building…','BUILDING_OW01_GEOGRAPHIC_MODEL');
    await new Promise(r=>requestAnimationFrame(r));
    const renderer=module.createMapWideEnvironmentRenderer(canvas);
    renderer.render();
    wire(renderer);
    updateScaleUI(renderer);
    setStatus('REVIEW','VISUAL_READY_USER_REVIEW_REQUIRED');
    requestAnimationFrame(()=>observerAfterPaint(renderer));
  }catch(error){fail('INITIALIZATION',error);}
}

setStatus('boot…','BOOTSTRAP_ACTIVE');
setDiagnostic('Starting Audralia OW01 nonpublic inspector…');
initialize();
