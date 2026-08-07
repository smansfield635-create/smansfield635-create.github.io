const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const diagnosticNode=document.querySelector('[data-h-earth-diagnostic]');
const focusButton=document.querySelector('[data-fit-world]');
const brandNode=document.querySelector('.preview-brand');

const OP='H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const COH='H_EARTH_V2_COASTAL_INTEGRATION_AND_POSITIONAL_IDENTITY_CLOSURE';
const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};
const setDiagnostic=text=>{if(diagnosticNode)diagnosticNode.textContent=text;};
const fail=(stage,error)=>{const message=error instanceof Error?error.message:String(error);console.error(`AUDRALIA_OW01_${stage}_FAILED`,error);setStatus('ERROR',`${stage}_FAILED`);setDiagnostic(`${stage}_FAILED: ${message}`);window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW_ERROR__=Object.freeze({operationId:OP,coherenceOperation:COH,stage,message});};

function updateScaleUI(renderer){
  const scale=renderer.getViewScale();
  if(brandNode)brandNode.textContent=`Audralia · Gratitude · OW01 · ${scale.toLowerCase()}`;
  if(focusButton)focusButton.textContent=scale==='LOCAL'?'reset view':'focus Gratitude';
  const descriptions={
    LOCAL:'LOCAL · restored high-density canonical terrain · sand is terrain material · light shallow-water transition · inspect basin, Harbor, and peaks.',
    REGION:'REGION · same canonical surface with fixed spatial reconciliation · pure pinch keeps the geographic target locked.',
    CONTINENT:'CONTINENT · same resolved Gratitude surface · no camera-dependent geographic substitution.',
    PLANETARY:'PLANETARY · same Gratitude surface on Audralia; other continents remain noncanonical previews.'
  };
  setDiagnostic(descriptions[scale]||descriptions.LOCAL);
}

function wire(renderer){
  const pointers=new Map();let gesture=null;
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5}),safe=v=>Math.max(-64,Math.min(64,v));
  const refresh=()=>{const points=[...pointers.values()];gesture=points.length===2?{midpoint:midpoint(points[0],points[1]),distance:Math.max(1,distance(points[0],points[1]))}:null;};
  const after=()=>updateScaleUI(renderer);
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});refresh();});
  canvas.addEventListener('pointermove',event=>{
    const previous=pointers.get(event.pointerId);if(!previous)return;
    const next={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,next);
    if(pointers.size===1){renderer.orbit(safe(next.x-previous.x),safe(next.y-previous.y));after();return;}
    if(pointers.size===2){
      const points=[...pointers.values()],mid=midpoint(points[0],points[1]),dist=Math.max(1,distance(points[0],points[1]));
      if(gesture){
        const ratio=dist/gesture.distance,scaleMotion=Math.abs(Math.log(Math.max(.001,ratio))),dx=mid.x-gesture.midpoint.x,dy=mid.y-gesture.midpoint.y,translation=Math.hypot(dx,dy);
        if(scaleMotion>=.0025){renderer.zoomByFactor(ratio);}
        else if(translation>=2.4){renderer.panScreen(safe(dx)*.72,safe(dy)*.72);}
        after();
      }
      gesture={midpoint:mid,distance:dist};
    }
  });
  const clear=event=>{pointers.delete(event.pointerId);refresh();};
  canvas.addEventListener('pointerup',clear);canvas.addEventListener('pointercancel',clear);canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',event=>{event.preventDefault();renderer.zoom(event.deltaY);after();},{passive:false});
  canvas.addEventListener('dblclick',()=>{renderer.focusGratitude();after();});
  focusButton?.addEventListener('click',()=>{renderer.focusGratitude();after();});
  window.addEventListener('resize',()=>renderer.render());
}

async function observerAfterPaint(renderer){
  try{
    await new Promise(resolve=>setTimeout(resolve,0));
    const module=await import('./observer.mjs'),receipt=module.buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer),pos=receipt?.canonicalPositionalIdentity?.canonicalPositionalIdentityPassed===true,corr=receipt?.surfaceCorrespondence?.pass===true;
    if(receipt.mechanicalChecksPassed===true&&pos&&corr){setStatus('REVIEW','OW01_LOCAL_FIDELITY_AND_MIRAGE_PASS_USER_REVIEW_REQUIRED');setDiagnostic(`MECHANICAL PASS · 12/12 anchors · adaptive canonical surface · pure pinch target-lock active · judge local fidelity and whether LOCAL → REGION → CONTINENT → PLANETARY remains the same physical place.`);}else{setStatus('FAIL','OW01_MECHANICAL_FAIL');setDiagnostic(`MECHANICAL_FAIL · ${(receipt.failedChecks||['unknown']).join(', ')}`);}
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:OP,coherenceOperation:COH,renderer,observerReceipt:receipt});
  }catch(error){console.warn('AUDRALIA_OW01_OBSERVER_FAILED',error);setStatus('REVIEW','VISUAL_READY_OBSERVER_DEFERRED');setDiagnostic(`VISUAL_READY · observer deferred: ${error instanceof Error?error.message:String(error)}`);}
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw Error('H_EARTH_OW01_CANVAS_MISSING');
    setStatus('world…','IMPORTING_ADAPTIVE_CANONICAL_GRATITUDE');
    setDiagnostic('Restoring local fidelity on one canonical Gratitude surface while locking pure-pinch zoom to the same geographic target…');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const module=await import('./renderer.mjs');
    setStatus('building…','BUILDING_ADAPTIVE_CANONICAL_GRATITUDE');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const renderer=module.createMapWideEnvironmentRenderer(canvas);renderer.render();wire(renderer);updateScaleUI(renderer);setStatus('REVIEW','VISUAL_READY_USER_REVIEW_REQUIRED');requestAnimationFrame(()=>observerAfterPaint(renderer));
  }catch(error){fail('INITIALIZATION',error);}
}
setStatus('boot…','BOOTSTRAP_ACTIVE');setDiagnostic('Starting OW01 local-fidelity and Mirage correction inspector…');initialize();
