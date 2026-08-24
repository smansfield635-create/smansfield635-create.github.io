const started=performance.now();
const history=[];
const stage=document.querySelector('[data-audralia-loader-stage]');
const APPROVED_PRESENTATION_AUTHORITY='1d45379f81ea4089e9c5f3d7d9688e702be9add3';

function publish(phase,detail={}){
  const now=performance.now();
  const entry=Object.freeze({phase,elapsedMs:Math.round(now-started),at:Math.round(now),...detail});
  history.push(entry);
  if(history.length>32)history.shift();
  window.__AUDRALIA_STARTUP_PHASE__=entry;
  window.__AUDRALIA_STARTUP_TRACE__=Object.freeze({
    schema:'AUDRALIA_STARTUP_TRACE_v1',
    startedAt:started,
    current:entry,
    history:Object.freeze([...history])
  });
  document.documentElement.dataset.audraliaStartupPhase=phase;
  window.dispatchEvent(new CustomEvent('AUDRALIA_STARTUP_PHASE',{detail:entry}));
}

window.__AUDRALIA_STARTUP_MARK__=publish;
publish('PAGE_SHELL_READY');

// Paint the diagnostic arrival surface first, then install the approved visual
// presentation authority before any Audralia WebGL shader is compiled.
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
publish('FIRST_PAINT_RELEASED');

let activeResource='approved-presentation-stack';
try{
  publish('PRESENTATION_STACK_REQUESTED',{authority:APPROVED_PRESENTATION_AUTHORITY});
  await import('./acf1-cloud-presentation-v1.mjs?cb=ACF1_v3_APPROVED');
  await import('./fap1-xyz-volumetric-depth-v1.mjs?cb=FAP1_XYZ_DEPTH_v2_APPROVED');
  await import('./fap1-weather-presentation-v1.mjs?cb=FAP1_APPROVED_1d45379f');
  publish('PRESENTATION_STACK_EVALUATED',{authority:APPROVED_PRESENTATION_AUTHORITY});

  activeResource='weather-presentation-reconciliation/app.mjs';
  publish('APP_MODULE_REQUESTED',{resource:activeResource});
  await import('./weather-presentation-reconciliation/app.mjs?cb=AUDRALIA_APPROVED_MODEL_BOOT_v1');
  publish('APP_MODULE_EVALUATED',{authority:APPROVED_PRESENTATION_AUTHORITY});
}catch(error){
  const message=error instanceof Error?error.message:String(error);
  const presentationFailure=activeResource==='approved-presentation-stack';
  const phase=presentationFailure?'PRESENTATION_STACK_FAILED':'APP_MODULE_FAILED';
  const code=presentationFailure?'AUDRALIA_APPROVED_PRESENTATION_IMPORT_FAILED':'AUDRALIA_APP_MODULE_IMPORT_FAILED';
  publish(phase,{status:'ERROR',code,message,resource:activeResource,authority:APPROVED_PRESENTATION_AUTHORITY});
  if(stage)stage.textContent=`Audralia startup stopped · ${code} · ${message}`;
  throw error;
}
