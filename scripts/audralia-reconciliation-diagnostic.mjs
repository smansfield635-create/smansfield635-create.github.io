import puppeteer from 'puppeteer-core';

const chromePath=process.env.CHROME_PATH;
const baseUrl=process.env.AUDRALIA_DIAGNOSTIC_BASE_URL||'http://127.0.0.1:4173';
const route=process.env.AUDRALIA_DIAGNOSTIC_ROUTE||'/showroom/globe/audralia/';
if(!chromePath)throw new Error('CHROME_PATH_REQUIRED');

const browser=await puppeteer.launch({
  executablePath:chromePath,
  headless:'new',
  args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});

try{
  const page=await browser.newPage();
  await page.setViewport({width:720,height:1280,deviceScaleFactor:1});

  const pageErrors=[];
  const consoleErrors=[];
  const failedRequests=[];
  const notFoundResponses=[];

  page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('requestfailed',request=>{
    failedRequests.push({url:request.url(),failure:request.failure()?.errorText||null,resourceType:request.resourceType()});
  });
  page.on('response',response=>{
    if(response.status()===404){
      notFoundResponses.push({url:response.url(),resourceType:response.request().resourceType()});
    }
  });

  await page.goto(`${baseUrl}${route}`,{waitUntil:'domcontentloaded',timeout:60000});

  let waitObservedPass=false;
  let waitError=null;
  try{
    await page.waitForFunction(()=>{
      const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
      const proofRuntime=(()=>{try{return proof?.getRuntime?.()||null;}catch{return null;}})();
      const runtime=proofRuntime||window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_RUNTIME__||null;
      return runtime?.invariants?.pass===true;
    },{timeout:45000,polling:250});
    waitObservedPass=true;
  }catch(error){
    waitError=String(error?.stack||error);
  }

  const diagnostic=await page.evaluate(()=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    let proofRuntime=null;
    try{proofRuntime=proof?.getRuntime?.()||null;}catch{}
    const runtime=proofRuntime||window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_RUNTIME__||null;
    const loader=document.querySelector('[data-audralia-loader]');
    return {
      location:location.href,
      statusText:document.querySelector('[data-h-earth-status]')?.textContent?.trim()||null,
      status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
      loaderStage:document.querySelector('[data-audralia-loader-stage]')?.textContent?.trim()||null,
      loaderProgress:loader?.dataset?.progress||null,
      loaderDelayed:loader?.dataset?.delayed||null,
      loaderErrored:loader?.classList.contains('is-error')||false,
      reconciliationPresent:Boolean(proof),
      runtimePresent:Boolean(runtime),
      reconciliationError:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__||null,
      progressiveEnrichmentState:window.__AUDRALIA_PROGRESSIVE_ENRICHMENT_STATE__||null,
      runtimeInvariants:runtime?.invariants||null,
      spatial:runtime?.spatial?{activeLocalCount:runtime.spatial.activeLocalCount,maxLocalCount:runtime.spatial.maxLocalCount}:null,
      rayDiagnostics:runtime?.rayDiagnostics||null,
      previewPresent:Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__),
      celestialPresent:Boolean(window.__AUDRALIA_CELESTIAL_STATE__),
      celestialError:window.__AUDRALIA_CELESTIAL_CONTEXT_ERROR__||null
    };
  });

  const authoritativePass=(
    diagnostic.reconciliationPresent===true&&
    diagnostic.runtimePresent===true&&
    diagnostic.reconciliationError==null&&
    diagnostic.runtimeInvariants?.pass===true&&
    Array.isArray(diagnostic.runtimeInvariants?.failures)&&
    diagnostic.runtimeInvariants.failures.length===0
  );

  const readinessSource=waitObservedPass?'WAIT_PREDICATE':'POST_WAIT_AUTHORITATIVE_RUNTIME';
  const ready=authoritativePass;

  console.log('AUDRALIA_RECONCILIATION_DIAGNOSTIC',JSON.stringify({
    ready,
    authoritativePass,
    readinessSource,
    waitObservedPass,
    waitError,
    diagnostic,
    failedRequests,
    notFoundResponses,
    pageErrors,
    consoleErrors
  },null,2));

  if(!ready)process.exitCode=1;
}finally{
  await browser.close();
}
