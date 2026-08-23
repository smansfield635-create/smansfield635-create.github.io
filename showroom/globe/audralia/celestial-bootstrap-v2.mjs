const WAIT_LIMIT_MS=90000;
const started=performance.now();

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const rendererReady=()=>Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer);

async function waitForRenderer(){
  while(!rendererReady()&&performance.now()-started<WAIT_LIMIT_MS){
    if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__)return false;
    await sleep(80);
  }
  return rendererReady();
}

if(await waitForRenderer()){
  await import('./celestial-checkpoint-1.mjs?cb=AUDRALIA_CELESTIAL_BOOTSTRAP_v2');
}else{
  const source=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__;
  const message=source?.message||'AUDRALIA_CELESTIAL_RENDERER_AUTHORITY_TIMEOUT';
  window.__AUDRALIA_CELESTIAL_CONTEXT_ERROR__=Object.freeze({
    schema:'AUDRALIA_CELESTIAL_CONTEXT_v2',
    message
  });
  console.error('AUDRALIA_CELESTIAL_BOOTSTRAP_FAILED',message);
}
