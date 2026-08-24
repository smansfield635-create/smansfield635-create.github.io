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
  const evidenceColdRefresh=manifest.surfaceId==='evidence';
  if(evidenceColdRefresh)await page.setCacheEnabled(false);
  const pageErrors=[];
  const consoleErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
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

  const waitForReadiness=async()=>{
    if(spec.readySelector)await page.waitForSelector(spec.readySelector,{timeout:spec.timeoutMs||45000});
    if(spec.readyAttribute){
      await page.waitForFunction(({selector,name,contains})=>{
        const element=document.querySelector(selector);
        if(!element)return false;
        return String(element.getAttribute(name)||'').includes(contains);
      },{timeout:spec.timeoutMs||45000},spec.readyAttribute);
    }
  };

  let reloadsPerformed=0;
  try{
    await waitForReadiness();
    if(evidenceColdRefresh){
      await page.reload({waitUntil:'domcontentloaded',timeout:60000});
      reloadsPerformed=1;
      await waitForReadiness();
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
      diagnostics:{pageErrors,consoleErrors,failures:['RUNTIME_READINESS_FAILED'],evidenceColdRefresh,reloadsPerformed},
      diagnostic
    },null,2));
    throw error;
  }

  const binding=spec.binding||{mode:'direct-document'};
  const result=await page.evaluate(({spec,binding})=>{
    const currentUrl=new URL(location.href);
    const normalized=value=>{
      const path=String(value||'/').replace(/\/+$/,'')||'/';
      return path.startsWith('/')?path:`/${path}`;
    };
    const expectedPath=normalized(binding.path||spec.path);
    let bindingResult={mode:binding.mode||'direct-document',expectedPath,ok:false};
    if(bindingResult.mode==='direct-document'){
      bindingResult={...bindingResult,observedPath:normalized(currentUrl.pathname),ok:normalized(currentUrl.pathname)===expectedPath};
    }else if(bindingResult.mode==='iframe'){
      const selector=binding.selector||'iframe';
      const frame=document.querySelector(selector);
      const rawSrc=frame?.getAttribute('src')||'';
      let observedPath='';
      try{observedPath=rawSrc?normalized(new URL(rawSrc,currentUrl.href).pathname):'';}catch{}
      bindingResult={...bindingResult,selector,rawSrc,observedPath,ok:Boolean(frame&&rawSrc&&observedPath===expectedPath)};
    }else{
      bindingResult={...bindingResult,error:'UNSUPPORTED_BINDING_MODE'};
    }
    return {
      title:document.title,
      finalUrl:currentUrl.href,
      readySelector:spec.readySelector?Boolean(document.querySelector(spec.readySelector)):null,
      attributeValue:spec.readyAttribute?document.querySelector(spec.readyAttribute.selector)?.getAttribute(spec.readyAttribute.name)||null:null,
      binding:bindingResult
    };
  },{spec,binding});

  const ignoreTokens=spec.ignoreConsoleErrorIncludes||[];
  const ignoredConsoleErrors=consoleErrors.filter(error=>ignoreTokens.some(token=>error.includes(token)));
  const actionableConsoleErrors=consoleErrors.filter(error=>!ignoreTokens.some(token=>error.includes(token)));
  const failures=[];
  if(!result.binding.ok)failures.push('RUNTIME_PUBLICATION_BINDING_FAILED');
  if(spec.failOnPageErrors!==false&&pageErrors.length)failures.push('PAGE_ERROR');
  if(spec.failOnConsoleErrors!==false&&actionableConsoleErrors.length)failures.push('CONSOLE_ERROR');

  const receipt={
    schema:'PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1',
    surfaceId:manifest.surfaceId,
    url,
    result:failures.length?'FAIL':'PASS',
    runtime:{...result,evidenceColdRefresh,reloadsPerformed},
    diagnostics:{pageErrors,consoleErrors,ignoredConsoleErrors,actionableConsoleErrors,failures}
  };
  console.log(JSON.stringify(receipt,null,2));
  if(failures.length)process.exitCode=1;
}finally{
  await browser.close();
}
