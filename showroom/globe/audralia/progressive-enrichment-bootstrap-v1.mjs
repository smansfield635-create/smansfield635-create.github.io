const started=performance.now();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const rendererReady=()=>Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer);

const publish=(phase,extra={})=>{
  window.__AUDRALIA_PROGRESSIVE_ENRICHMENT_STATE__=Object.freeze({
    schema:'AUDRALIA_PROGRESSIVE_ENRICHMENT_BOOTSTRAP_v1',
    phase,
    elapsedMs:Math.round(performance.now()-started),
    rendererReady:rendererReady(),
    ...extra
  });
};

async function waitForRenderer(){
  publish('WAITING_FOR_RENDERER');
  while(!rendererReady()){
    const source=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__;
    if(source){
      publish('CORE_FAILED',{message:source.message||'AUDRALIA_CORE_RECONCILIATION_FAILED'});
      return false;
    }
    await sleep(50);
  }
  return true;
}

async function importLayer(label,path){
  try{
    publish('ENRICHING',{activeLayer:label});
    await import(path);
    return Object.freeze({label,status:'READY'});
  }catch(error){
    console.error('AUDRALIA_PROGRESSIVE_ENRICHMENT_LAYER_FAILED',label,error);
    return Object.freeze({label,status:'FAILED',message:error instanceof Error?error.message:String(error)});
  }
}

async function initialize(){
  if(!await waitForRenderer())return;

  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  publish('WORLD_VISIBLE_ENRICHMENT_BEGIN');

  const results=[];
  results.push(await importLayer('ACF1_CLOUD_PRESENTATION','./acf1-cloud-presentation-v1.mjs?cb=ACF1_v3'));
  results.push(await importLayer('FAP1_XYZ_VOLUMETRIC_DEPTH','./fap1-xyz-volumetric-depth-v1.mjs?cb=FAP1_XYZ_DEPTH_v2'));
  results.push(await importLayer('FAP1_ORBITAL_SUPPORT','./fap1-orbital-support-tuning-v1.mjs?cb=DIRECT_DENSITY_v4'));
  results.push(await importLayer('FAP1_ORGANIZED_WEATHER','./fap1-weather-presentation-v1.mjs?cb=FAP1_INTEGRATED_COVERAGE_v5'));
  results.push(await importLayer('CELESTIAL_CONTEXT','./celestial-bootstrap-v2.mjs?cb=AUDRALIA_CELESTIAL_BOOTSTRAP_v3'));
  results.push(await importLayer('COMPOSITION_AUTHORITY','./composition-authority-repair-v1.mjs?cb=COMPOSITION_AUTHORITY_v1'));

  const failed=results.filter(result=>result.status!=='READY');
  publish(failed.length?'READY_WITH_OPTIONAL_LAYER_FAILURES':'READY',{results,failedCount:failed.length});
}

publish('BOOT');
initialize();
