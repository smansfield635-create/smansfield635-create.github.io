import fs from 'node:fs';

const mode=process.argv[2];
const pageUrl=(process.argv[3]||'').replace(/\/$/,'');
const manifestPath=process.argv[4];

if(!['static','runtime'].includes(mode)||!pageUrl||!manifestPath){
  console.error('usage: node tools/publication-live-verify.mjs <static|runtime> <page-url> <manifest-path>');
  process.exit(2);
}

const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

if(mode==='static'){
  for(const check of manifest.checks||[]){
    const url=pageUrl+check.path;
    const response=await fetch(url,{redirect:'follow'});
    if(!response.ok)throw new Error(`FETCH_FAILED ${url} ${response.status}`);
    const body=await response.text();
    for(const token of check.includes||[]){
      if(!body.includes(token))throw new Error(`MISSING_TOKEN ${url} ${token}`);
    }
    for(const token of check.excludes||[]){
      if(body.includes(token))throw new Error(`FORBIDDEN_TOKEN ${url} ${token}`);
    }
  }
  console.log(JSON.stringify({schema:'PUBLICATION_SURFACE_STATIC_RECEIPT_v1',surfaceId:manifest.surfaceId,result:'PASS'},null,2));
  process.exit(0);
}

if(manifest.runtime?.enabled!==true){
  console.log(JSON.stringify({schema:'PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1',surfaceId:manifest.surfaceId,result:'SKIPPED_NOT_DECLARED'},null,2));
  process.exit(0);
}

const {default:puppeteer}=await import('puppeteer-core');
const executablePath=process.env.CHROME_PATH;
if(!executablePath)throw new Error('CHROME_PATH is required for runtime verification');
const spec=manifest.runtime;
const browser=await puppeteer.launch({
  executablePath,
  headless:'new',
  args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});
try{
  const page=await browser.newPage();
  await page.setViewport({width:720,height:1280,deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error?.stack||error)));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  const url=pageUrl+spec.path;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});

  const captureRuntimeDiagnostic=async failure=>page.evaluate(({spec,surfaceId,failure})=>{
    const serializeError=value=>{
      if(!value)return null;
      if(typeof value==='string')return {message:value};
      return {
        name:value.name||null,
        message:value.message||String(value),
        stack:value.stack||null
      };
    };
    const loader=document.querySelector('[data-audralia-loader]');
    const base={
      title:document.title,
      href:location.href,
      readyState:document.readyState,
      readySelector:spec.readySelector||null,
      readySelectorPresent:spec.readySelector?Boolean(document.querySelector(spec.readySelector)):null,
      readyAttribute:spec.readyAttribute||null,
      failure
    };
    if(surfaceId!=='audralia')return base;
    let reconciliationRuntime=null;
    let reconciliationRuntimeError=null;
    try{
      reconciliationRuntime=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()||null;
    }catch(error){
      reconciliationRuntimeError=serializeError(error);
    }
    return {
      ...base,
      audralia:{
        loader:loader?{
          className:loader.className,
          dataset:{...loader.dataset},
          stage:document.querySelector('[data-audralia-loader-stage]')?.textContent?.trim()||null,
          progress:document.querySelector('[data-audralia-loader-progress]')?.textContent?.trim()||null,
          elapsed:document.querySelector('[data-audralia-loader-elapsed]')?.textContent?.trim()||null
        }:null,
        startupDiagnostic:window.__AUDRALIA_STARTUP_DIAGNOSTIC__||null,
        startupPhase:window.__AUDRALIA_STARTUP_PHASE__||null,
        reconciliationError:serializeError(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__),
        reconciliationRuntime:reconciliationRuntime?{
          invariants:reconciliationRuntime.invariants||null,
          status:reconciliationRuntime.status||null,
          state:reconciliationRuntime.state||null
        }:null,
        reconciliationRuntimeError,
        milestones:{
          renderer:Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer),
          clearAtmosphere:Boolean(document.querySelector('[data-audralia-clear-atmosphere="true"]')),
          orbitalCloud:Boolean(globalThis.__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__),
          regionalWeather:Boolean(document.querySelector('[data-audralia-exterior-weather="true"]')),
          localContinuity:Boolean(document.querySelector('[data-canonical-weather-projection="true"]'))
        }
      }
    };
  },{spec,surfaceId:manifest.surfaceId,failure:String(failure?.stack||failure)});

  try{
    if(spec.readySelector)await page.waitForSelector(spec.readySelector,{timeout:spec.timeoutMs||45000});
    if(spec.readyAttribute){
      await page.waitForFunction(({selector,name,contains})=>{
        const element=document.querySelector(selector);
        if(!element)return false;
        return String(element.getAttribute(name)||'').includes(contains);
      },{timeout:spec.timeoutMs||45000},spec.readyAttribute);
    }
  }catch(error){
    let diagnostic=null;
    try{
      diagnostic=await captureRuntimeDiagnostic(error);
    }catch(diagnosticError){
      diagnostic={captureError:String(diagnosticError?.stack||diagnosticError)};
    }
    console.error(JSON.stringify({
      schema:'PUBLICATION_SURFACE_RUNTIME_DIAGNOSTIC_v1',
      surfaceId:manifest.surfaceId,
      url,
      result:'FAIL',
      phase:'READINESS_WAIT',
      failure:String(error?.stack||error),
      errors,
      diagnostic
    },null,2));
    throw error;
  }

  const result=await page.evaluate(spec=>({
    title:document.title,
    readySelector:spec.readySelector?Boolean(document.querySelector(spec.readySelector)):null,
    attributeValue:spec.readyAttribute?document.querySelector(spec.readyAttribute.selector)?.getAttribute(spec.readyAttribute.name)||null:null
  }),spec);
  console.log(JSON.stringify({schema:'PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1',surfaceId:manifest.surfaceId,url,result,errors},null,2));
  if(spec.failOnConsoleErrors!==false&&errors.length)process.exitCode=1;
}finally{
  await browser.close();
}
