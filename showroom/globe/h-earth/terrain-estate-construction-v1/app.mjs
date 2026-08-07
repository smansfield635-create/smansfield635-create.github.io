const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const diagnosticNode=document.querySelector('[data-h-earth-diagnostic]');
const modeButton=document.querySelector('[data-fit-world]');
const brandNode=document.querySelector('.preview-brand');

const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};
const setDiagnostic=(text)=>{if(diagnosticNode)diagnosticNode.textContent=text;};
const fail=(stage,error)=>{const message=error instanceof Error?error.message:String(error);console.error(`AUDRALIA_WORLD_INSPECTOR_${stage}_FAILED`,error);setStatus('ERROR',`${stage}_FAILED`);setDiagnostic(`${stage}_FAILED: ${message}`);window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW_ERROR__=Object.freeze({operationId:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',inspectorRepairRevision:9,stage,message});};

function updateModeUI(renderer){
  const planet=renderer.getMode()==='PLANET';
  if(modeButton)modeButton.textContent=planet?'open Gratitude':'view planet';
  if(brandNode)brandNode.textContent=planet?'Audralia · Planet Inspector':'H-Earth · Gratitude Inspector';
  setDiagnostic(planet?'Audralia: one finger rotates · pinch zooms · open Gratitude enters the resolved continent.':'Gratitude: one finger orbits · two fingers pan + pinch · view planet returns to Audralia.');
}

function wire(renderer){
  const pointers=new Map();let gesture=null;
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5});const safe=(v)=>Math.max(-64,Math.min(64,v));
  const refresh=()=>{const a=[...pointers.values()];gesture=a.length===2?{midpoint:midpoint(a[0],a[1]),distance:Math.max(1,distance(a[0],a[1]))}:null;};
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});refresh();});
  canvas.addEventListener('pointermove',e=>{const prev=pointers.get(e.pointerId);if(!prev)return;const next={x:e.clientX,y:e.clientY};pointers.set(e.pointerId,next);if(pointers.size===1){renderer.orbit(safe(next.x-prev.x),safe(next.y-prev.y));return;}if(pointers.size===2){const a=[...pointers.values()],mid=midpoint(a[0],a[1]),dist=Math.max(1,distance(a[0],a[1]));if(gesture){renderer.zoomByFactor(dist/gesture.distance);renderer.panScreen(safe(mid.x-gesture.midpoint.x),safe(mid.y-gesture.midpoint.y));}gesture={midpoint:mid,distance:dist};}});
  const clear=e=>{pointers.delete(e.pointerId);refresh();};canvas.addEventListener('pointerup',clear);canvas.addEventListener('pointercancel',clear);canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',e=>{e.preventDefault();renderer.zoom(e.deltaY);},{passive:false});canvas.addEventListener('dblclick',()=>renderer.fitWorld());
  window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(key==='p'){renderer.setMode('PLANET');updateModeUI(renderer);return;}if(key==='g'){renderer.setMode('GRATITUDE');updateModeUI(renderer);return;}const d=e.shiftKey?16:7;if(e.key==='ArrowLeft'||key==='a')renderer.pan(-d,0);if(e.key==='ArrowRight'||key==='d')renderer.pan(d,0);if(e.key==='ArrowUp'||key==='w')renderer.pan(0,-d);if(e.key==='ArrowDown'||key==='s')renderer.pan(0,d);});
  modeButton?.addEventListener('click',()=>{renderer.toggleMode();updateModeUI(renderer);});window.addEventListener('resize',()=>renderer.render());
}

async function observerAfterPaint(renderer){
  try{await new Promise(r=>setTimeout(r,0));const module=await import('./observer.mjs');const receipt=module.buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer);const pass=receipt.result==='PASS';setStatus(pass?'PASS':'READY',pass?'PASS':'OBSERVER_PENDING_OR_FAIL');updateModeUI(renderer);window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW__=Object.freeze({operationId:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',lockGeneration:422,inspectorRepairRevision:9,renderer,observerReceipt:receipt});}
  catch(error){console.warn('AUDRALIA_WORLD_INSPECTOR_DEFERRED_OBSERVER_FAILED',error);setStatus('READY','VISUAL_READY_OBSERVER_DEFERRED');setDiagnostic(`VISUAL_READY · observer deferred: ${error instanceof Error?error.message:String(error)}`);window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW__=Object.freeze({operationId:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',lockGeneration:422,inspectorRepairRevision:9,renderer,observerReceipt:null,observerDeferredFailure:true});}
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('H_EARTH_MAP_WIDE_CANVAS_MISSING');
    setStatus('planet…','IMPORTING_AUDRALIA_PLANET');setDiagnostic('Building Audralia planetary authoring model…');await new Promise(r=>requestAnimationFrame(r));
    const module=await import('./renderer.mjs');setStatus('building…','BUILDING_AUDRALIA_AND_GRATITUDE');await new Promise(r=>requestAnimationFrame(r));
    const renderer=module.createMapWideEnvironmentRenderer(canvas);renderer.render();wire(renderer);updateModeUI(renderer);setStatus('READY','VISUAL_READY');requestAnimationFrame(()=>observerAfterPaint(renderer));
  }catch(error){fail('INITIALIZATION',error);}
}

setStatus('boot…','BOOTSTRAP_ACTIVE');setDiagnostic('Starting Audralia inspector…');initialize();
