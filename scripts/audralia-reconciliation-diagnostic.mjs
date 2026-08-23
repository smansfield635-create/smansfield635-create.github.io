import puppeteer from 'puppeteer-core';

const chromePath=process.env.CHROME_PATH;
const baseUrl=process.env.AUDRALIA_DIAGNOSTIC_BASE_URL||'http://127.0.0.1:4173';
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
  page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  await page.goto(`${baseUrl}/showroom/globe/audralia/weather-presentation-reconciliation/`,{waitUntil:'domcontentloaded',timeout:60000});

  let ready=false;
  let waitError=null;
  try{
    await page.waitForFunction(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime()?.invariants?.pass===true,{timeout:30000});
    ready=true;
  }catch(error){
    waitError=String(error?.stack||error);
  }

  const diagnostic=await page.evaluate(()=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    const runtime=proof?.getRuntime?.()||window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_RUNTIME__||null;
    return {
      location:location.href,
      statusText:document.querySelector('[data-h-earth-status]')?.textContent?.trim()||null,
      status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
      loaderStage:document.querySelector('[data-audralia-loader-stage]')?.textContent?.trim()||null,
      loaderProgress:document.querySelector('[data-audralia-loader]')?.dataset?.progress||null,
      reconciliationPresent:Boolean(proof),
      runtimePresent:Boolean(runtime),
      reconciliationError:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__||null,
      runtimeInvariants:runtime?.invariants||null,
      spatial:runtime?.spatial?{activeLocalCount:runtime.spatial.activeLocalCount,maxLocalCount:runtime.spatial.maxLocalCount}:null,
      rayDiagnostics:runtime?.rayDiagnostics||null,
      previewPresent:Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__),
      celestialPresent:Boolean(window.__AUDRALIA_CELESTIAL_STATE__),
      celestialError:window.__AUDRALIA_CELESTIAL_CONTEXT_ERROR__||null
    };
  });

  console.log('AUDRALIA_RECONCILIATION_DIAGNOSTIC',JSON.stringify({ready,waitError,diagnostic,pageErrors,consoleErrors},null,2));
  if(!ready)process.exitCode=1;
}finally{
  await browser.close();
}
