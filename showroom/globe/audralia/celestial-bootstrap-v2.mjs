const WAIT_LIMIT_MS=210000;
const started=performance.now();

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const rendererReady=()=>Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer);
const publish=(phase,extra={})=>{
  window.__AUDRALIA_CELESTIAL_BOOTSTRAP_STATE__=Object.freeze({
    schema:'AUDRALIA_CELESTIAL_BOOTSTRAP_v2',
    phase,
    elapsedMs:Math.round(performance.now()-started),
    rendererReady:rendererReady(),
    ...extra
  });
};
const fail=(message,stack=null)=>{
  window.__AUDRALIA_CELESTIAL_CONTEXT_ERROR__=Object.freeze({
    schema:'AUDRALIA_CELESTIAL_CONTEXT_v2',
    message,
    stack
  });
  publish('FAILED',{message});
  console.error('AUDRALIA_CELESTIAL_BOOTSTRAP_FAILED',message,stack||'');
};

async function waitForRenderer(){
  publish('WAITING_FOR_RENDERER');
  while(!rendererReady()&&performance.now()-started<WAIT_LIMIT_MS){
    const source=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__;
    if(source){fail(source.message||'AUDRALIA_RECONCILIATION_FAILED_BEFORE_CELESTIAL',source.stack||null);return false;}
    await sleep(80);
  }
  return rendererReady();
}

try{
  if(await waitForRenderer()){
    publish('IMPORTING_CELESTIAL_CONTEXT');
    await import('./celestial-checkpoint-1.mjs?cb=AUDRALIA_CELESTIAL_BOOTSTRAP_v2');
    publish(window.__AUDRALIA_CELESTIAL_STATE__?.getSolarVector?'READY':'CELESTIAL_MODULE_LOADED');
  }else if(!window.__AUDRALIA_CELESTIAL_CONTEXT_ERROR__){
    fail('AUDRALIA_CELESTIAL_RENDERER_AUTHORITY_TIMEOUT');
  }
}catch(error){
  fail(error instanceof Error?error.message:String(error),error instanceof Error?error.stack:null);
}
