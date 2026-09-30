const evidence={
  schema:'AUDRALIA_MOBILE_INTERACTION_SAFETY_v3',
  controllerOwnsInteractionStaging:true,
  pointerMoveCadenceBounded:false,
  pointerMoveRafCoalescing:false,
  contextLossCount:0,
  contextRestoreCount:0,
  lastContextLoss:null
};

const instrument=canvas=>{
  if(!(canvas instanceof HTMLCanvasElement)||canvas.dataset.audraliaContextInstrumented==='true')return;
  canvas.dataset.audraliaContextInstrumented='true';
  canvas.addEventListener('webglcontextlost',event=>{
    evidence.contextLossCount++;
    evidence.lastContextLoss={at:Date.now(),role:canvas.dataset.audraliaExteriorWeather?'exterior':canvas.dataset.audraliaCanonicalWeather?'canonical':canvas.hasAttribute('data-h-earth-map-wide-canvas')?'world':'overlay'};
    event.preventDefault?.();
    window.__AUDRALIA_MOBILE_INTERACTION_SAFETY_ERROR__={...evidence};
    console.error('AUDRALIA_WEBGL_CONTEXT_LOST',evidence.lastContextLoss);
  });
  canvas.addEventListener('webglcontextrestored',()=>{evidence.contextRestoreCount++;console.info('AUDRALIA_WEBGL_CONTEXT_RESTORED');});
};

const scan=()=>document.querySelectorAll('canvas').forEach(instrument);
scan();
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
window.__AUDRALIA_MOBILE_INTERACTION_SAFETY__={getEvidence:()=>Object.freeze({...evidence})};
