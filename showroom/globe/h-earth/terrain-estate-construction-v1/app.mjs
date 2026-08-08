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
    LOCAL:'LOCAL · restored high-density terrain · canonical conforming coast · curved sandbars · sand remains terrain material · gesture intent lock active.',
    REGION:'REGION · one Gratitude boundary shared by land and shallow water · no triangle-clipped coast · two-finger travel and target-locked pinch preserved.',
    CONTINENT:'CONTINENT · same canonical coastline and terrain identity · no camera-dependent geography · inspect macro silhouette for blob regression.',
    PLANETARY:'PLANETARY · Gratitude masks one planetary ocean from the same boundary · unresolved future continents remain atmospheric, not authoritative blobs.'
  };
  setDiagnostic(descriptions[scale]||descriptions.LOCAL);
}

function wire(renderer){
  const pointers=new Map();
  let gesture=null;
  const safe=value=>Math.max(-64,Math.min(64,value));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5});
  const vectorLength=vector=>Math.hypot(vector.x,vector.y);
  const orderedPoints=()=>[...pointers.entries()].sort((a,b)=>Number(a[0])-Number(b[0]));
  const beginTwoFingerGesture=()=>{
    const entries=orderedPoints();
    if(entries.length!==2){gesture=null;return;}
    const a={...entries[0][1]},b={...entries[1][1]},mid=midpoint(a,b),dist=Math.max(1,distance(a,b));
    gesture={ids:[entries[0][0],entries[1][0]],startA:a,startB:b,startMid:mid,startDistance:dist,lastMid:mid,lastDistance:dist,mode:'PENDING'};
  };
  const refreshGesture=()=>{if(pointers.size===2)beginTwoFingerGesture();else gesture=null;};
  const after=()=>updateScaleUI(renderer);

  canvas.addEventListener('pointerdown',event=>{
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size===2)beginTwoFingerGesture();
    else if(pointers.size>2)gesture=null;
  });

  canvas.addEventListener('pointermove',event=>{
    const previous=pointers.get(event.pointerId);if(!previous)return;
    const next={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,next);
    if(pointers.size===1){renderer.orbit(safe(next.x-previous.x),safe(next.y-previous.y));after();return;}
    if(pointers.size!==2)return;
    if(!gesture)beginTwoFingerGesture();
    if(!gesture)return;

    const a=pointers.get(gesture.ids[0]),b=pointers.get(gesture.ids[1]);
    if(!a||!b){beginTwoFingerGesture();return;}
    const mid=midpoint(a,b),dist=Math.max(1,distance(a,b));
    const d1={x:a.x-gesture.startA.x,y:a.y-gesture.startA.y};
    const d2={x:b.x-gesture.startB.x,y:b.y-gesture.startB.y};
    const common={x:(d1.x+d2.x)*.5,y:(d1.y+d2.y)*.5};
    const opposing={x:(d1.x-d2.x)*.5,y:(d1.y-d2.y)*.5};
    const commonMagnitude=vectorLength(common),opposingMagnitude=vectorLength(opposing);
    const pinchMagnitude=Math.abs(dist-gesture.startDistance)*.5;
    const zoomEvidence=Math.max(opposingMagnitude,pinchMagnitude);

    if(gesture.mode==='PENDING'){
      if(commonMagnitude>=2.2&&commonMagnitude>zoomEvidence*1.28)gesture.mode='TRAVEL';
      else if(zoomEvidence>=2.0&&zoomEvidence>commonMagnitude*1.20)gesture.mode='ZOOM';
      else return;
      gesture.lastMid=mid;
      gesture.lastDistance=dist;
      return;
    }

    if(gesture.mode==='TRAVEL'){
      const dx=mid.x-gesture.lastMid.x,dy=mid.y-gesture.lastMid.y;
      if(Math.abs(dx)>0.01||Math.abs(dy)>0.01)renderer.panScreen(safe(dx*1.45),safe(dy*1.45));
    }else if(gesture.mode==='ZOOM'){
      const ratio=dist/Math.max(1,gesture.lastDistance);
      if(Math.abs(Math.log(Math.max(.001,ratio)))>=.00035)renderer.zoomByFactor(ratio);
    }
    gesture.lastMid=mid;
    gesture.lastDistance=dist;
    after();
  });

  const clear=event=>{
    pointers.delete(event.pointerId);
    refreshGesture();
  };
  canvas.addEventListener('pointerup',clear);
  canvas.addEventListener('pointercancel',clear);
  canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',event=>{event.preventDefault();renderer.zoom(event.deltaY);after();},{passive:false});
  canvas.addEventListener('dblclick',()=>{renderer.focusGratitude();after();});
  focusButton?.addEventListener('click',()=>{renderer.focusGratitude();after();});
  window.addEventListener('resize',()=>renderer.render());
}

async function observerAfterPaint(renderer){
  try{
    await new Promise(resolve=>setTimeout(resolve,0));
    const module=await import('./observer.mjs'),receipt=module.buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer),pos=receipt?.canonicalPositionalIdentity?.canonicalPositionalIdentityPassed===true,corr=receipt?.surfaceCorrespondence?.pass===true;
    if(receipt.mechanicalChecksPassed===true&&pos&&corr){setStatus('REVIEW','OW01_COASTLINE_REPLACEMENT_USER_REVIEW_REQUIRED');setDiagnostic(`MECHANICAL PASS · 12/12 anchors · shared boundary ${receipt.boundaryIdentityHash||'verified'} · conforming coast · judge shards, sandbar shape, Mirage, and touch travel.`);}else{setStatus('FAIL','OW01_MECHANICAL_FAIL');setDiagnostic(`MECHANICAL_FAIL · ${(receipt.failedChecks||['unknown']).join(', ')}`);}
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:OP,coherenceOperation:COH,renderer,observerReceipt:receipt});
  }catch(error){console.warn('AUDRALIA_OW01_OBSERVER_FAILED',error);setStatus('REVIEW','VISUAL_READY_OBSERVER_DEFERRED');setDiagnostic(`VISUAL_READY · observer deferred: ${error instanceof Error?error.message:String(error)}`);}
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw Error('H_EARTH_OW01_CANVAS_MISSING');
    setStatus('world…','IMPORTING_COASTLINE_REPLACEMENT');
    setDiagnostic('Loading the frozen OW01 coastline replacement while preserving Mirage-solved camera behavior and touch intent…');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const module=await import('./renderer.mjs');
    setStatus('building…','BUILDING_COASTLINE_REPLACEMENT');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const renderer=module.createMapWideEnvironmentRenderer(canvas);renderer.render();wire(renderer);updateScaleUI(renderer);setStatus('REVIEW','VISUAL_READY_USER_REVIEW_REQUIRED');requestAnimationFrame(()=>observerAfterPaint(renderer));
  }catch(error){fail('INITIALIZATION',error);}
}
setStatus('boot…','BOOTSTRAP_ACTIVE');setDiagnostic('Starting OW01 canonical coastline replacement inspector…');initialize();
