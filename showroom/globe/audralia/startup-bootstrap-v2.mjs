const started=performance.now();
const history=[];
const stage=document.querySelector('[data-audralia-loader-stage]');

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

// Guarantee that the HTML/loading surface can paint before the heavy runtime graph is evaluated.
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
publish('FIRST_PAINT_RELEASED');

try{
  publish('APP_MODULE_REQUESTED',{resource:'weather-presentation-reconciliation/app.mjs'});
  await import('./weather-presentation-reconciliation/app.mjs?cb=AUDRALIA_STARTUP_DIAGNOSTIC_v1');
  publish('APP_MODULE_EVALUATED');
}catch(error){
  const message=error instanceof Error?error.message:String(error);
  publish('APP_MODULE_FAILED',{status:'ERROR',code:'AUDRALIA_APP_MODULE_IMPORT_FAILED',message});
  if(stage)stage.textContent=`Audralia startup stopped · AUDRALIA_APP_MODULE_IMPORT_FAILED · ${message}`;
  throw error;
}
