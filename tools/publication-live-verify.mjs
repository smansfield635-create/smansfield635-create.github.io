import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

const ALLOWED_KEYS=new Set(['ArrowLeft','ArrowRight','Home','End','Enter','Space']);
const MAX_INTERACTIONS=32;
const MAX_ASSERTIONS=8;
const MAX_SELECTOR_LENGTH=240;
const MAX_NAME_LENGTH=80;
const MAX_VALUE_LENGTH=240;

const assertPlainObject=(value,label)=>{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error(`INTERACTION_CONTRACT_INVALID ${label} object required`);
};
const assertExactKeys=(value,allowed,required,label)=>{
  assertPlainObject(value,label);
  const keys=Object.keys(value);
  for(const key of keys)if(!allowed.includes(key))throw new Error(`INTERACTION_CONTRACT_INVALID ${label} unsupported field ${key}`);
  for(const key of required)if(!(key in value))throw new Error(`INTERACTION_CONTRACT_INVALID ${label} missing field ${key}`);
};
const assertBoundedString=(value,label,{min=1,max=MAX_VALUE_LENGTH}={})=>{
  if(typeof value!=='string'||value.length<min||value.length>max)throw new Error(`INTERACTION_CONTRACT_INVALID ${label} string length`);
  return value;
};
const validateSelector=(value,label)=>assertBoundedString(value,label,{max:MAX_SELECTOR_LENGTH});

export const validateDeclaredInteractions=interactions=>{
  if(interactions===undefined)return [];
  if(!Array.isArray(interactions))throw new Error('INTERACTION_CONTRACT_INVALID interactions array required');
  if(interactions.length>MAX_INTERACTIONS)throw new Error(`INTERACTION_CONTRACT_INVALID interactions max ${MAX_INTERACTIONS}`);
  return interactions.map((interaction,index)=>{
    const label=`interactions[${index}]`;
    assertExactKeys(interaction,['name','action','assertions','timeoutMs'],['name','action','assertions'],label);
    assertBoundedString(interaction.name,`${label}.name`,{max:MAX_NAME_LENGTH});
    if(interaction.timeoutMs!==undefined&&(!Number.isInteger(interaction.timeoutMs)||interaction.timeoutMs<250||interaction.timeoutMs>15000))throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.timeoutMs`);
    const action=interaction.action;
    assertPlainObject(action,`${label}.action`);
    if(action.type==='click'){
      assertExactKeys(action,['type','selector'],['type','selector'],`${label}.action`);
      validateSelector(action.selector,`${label}.action.selector`);
    }else if(action.type==='key'){
      assertExactKeys(action,['type','selector','key'],['type','selector','key'],`${label}.action`);
      validateSelector(action.selector,`${label}.action.selector`);
      if(!ALLOWED_KEYS.has(action.key))throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.action.key`);
    }else{
      throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.action unsupported type ${String(action.type)}`);
    }
    if(!Array.isArray(interaction.assertions)||interaction.assertions.length<1||interaction.assertions.length>MAX_ASSERTIONS)throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.assertions`);
    interaction.assertions.forEach((assertion,assertionIndex)=>{
      const assertionLabel=`${label}.assertions[${assertionIndex}]`;
      assertPlainObject(assertion,assertionLabel);
      if(assertion.type==='exists'){
        assertExactKeys(assertion,['type','selector'],['type','selector'],assertionLabel);
        validateSelector(assertion.selector,`${assertionLabel}.selector`);
      }else if(assertion.type==='attributeEquals'||assertion.type==='attributeContains'){
        assertExactKeys(assertion,['type','selector','name','value'],['type','selector','name','value'],assertionLabel);
        validateSelector(assertion.selector,`${assertionLabel}.selector`);
        assertBoundedString(assertion.name,`${assertionLabel}.name`,{max:MAX_NAME_LENGTH});
        assertBoundedString(assertion.value,`${assertionLabel}.value`,{min:0,max:MAX_VALUE_LENGTH});
      }else if(assertion.type==='textContains'){
        assertExactKeys(assertion,['type','selector','value'],['type','selector','value'],assertionLabel);
        validateSelector(assertion.selector,`${assertionLabel}.selector`);
        assertBoundedString(assertion.value,`${assertionLabel}.value`,{max:MAX_VALUE_LENGTH});
      }else{
        throw new Error(`INTERACTION_CONTRACT_INVALID ${assertionLabel} unsupported type ${String(assertion.type)}`);
      }
    });
    return interaction;
  });
};

export const runDeclaredInteractions=async(page,interactions)=>{
  const declared=validateDeclaredInteractions(interactions);
  const results=[];
  for(const interaction of declared){
    const started=Date.now();
    try{
      const timeout=interaction.timeoutMs||5000;
      await page.waitForSelector(interaction.action.selector,{timeout});
      if(interaction.action.type==='click'){
        await page.click(interaction.action.selector);
      }else{
        await page.focus(interaction.action.selector);
        await page.keyboard.press(interaction.action.key);
      }
      await page.waitForFunction(assertions=>assertions.every(assertion=>{
        const element=document.querySelector(assertion.selector);
        if(assertion.type==='exists')return Boolean(element);
        if(!element)return false;
        if(assertion.type==='attributeEquals')return String(element.getAttribute(assertion.name)||'')===assertion.value;
        if(assertion.type==='attributeContains')return String(element.getAttribute(assertion.name)||'').includes(assertion.value);
        if(assertion.type==='textContains')return String(element.textContent||'').includes(assertion.value);
        return false;
      }),{timeout},interaction.assertions);
      results.push({name:interaction.name,action:interaction.action.type,ok:true,elapsedMs:Date.now()-started});
    }catch(error){
      results.push({name:interaction.name,action:interaction.action.type,ok:false,elapsedMs:Date.now()-started,error:String(error?.stack||error)});
    }
  }
  return results;
};

export const main=async()=>{
  const mode=process.argv[2];
  const pageUrl=(process.argv[3]||'').replace(/\/$/,'');
  const manifestPath=process.argv[4];

  if(!['static','runtime'].includes(mode)||!pageUrl||!manifestPath){
    console.error('usage: node tools/publication-live-verify.mjs <static|runtime> <page-url> <manifest-path>');
    process.exitCode=2;
    return;
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
    return;
  }

  if(manifest.runtime?.enabled!==true){
    console.log(JSON.stringify({schema:'PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1',surfaceId:manifest.surfaceId,result:'SKIPPED_NOT_DECLARED'},null,2));
    return;
  }

  validateDeclaredInteractions(manifest.runtime.interactions);

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
    const pageErrors=[];
    const consoleErrors=[];
    const evidenceInteractions=[];
    let declaredInteractions=[];
    page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
    page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
    const url=pageUrl+spec.path;
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});

    const verifyEvidenceCarousel=async phase=>{
      if(manifest.surfaceId!=='evidence'||spec.requireEvidenceCarouselInteraction!==true)return;
      try{
        await page.waitForFunction(()=>Boolean(document.querySelector('[data-carousel]')?.dataset.activeId),{timeout:10000});
        const before=await page.$eval('[data-carousel]',el=>el.dataset.activeId||'');
        const target=before==='orientation'?1:0;
        await page.click(`[data-tabs] [data-index="${target}"]`);
        await page.waitForFunction(previous=>{
          const current=document.querySelector('[data-carousel]')?.dataset.activeId||'';
          return Boolean(current&&current!==previous);
        },{timeout:5000},before);
        const after=await page.$eval('[data-carousel]',el=>el.dataset.activeId||'');
        evidenceInteractions.push({phase,before,after,ok:Boolean(after&&after!==before)});
      }catch(error){
        evidenceInteractions.push({phase,ok:false,error:String(error?.stack||error)});
      }
    };

    await verifyEvidenceCarousel('BEFORE_CONDITION_TERMINAL');

    const captureRuntimeDiagnostic=async failure=>page.evaluate(({spec,surfaceId,failure})=>{
      const serializeError=value=>{
        if(!value)return null;
        if(typeof value==='string')return {message:value};
        return {name:value.name||null,message:value.message||String(value),stack:value.stack||null};
      };
      const loader=document.querySelector('[data-audralia-loader]');
      const base={
        title:document.title,
        href:location.href,
        readyState:document.readyState,
        readySelector:spec.readySelector||null,
        readySelectorPresent:spec.readySelector?Boolean(document.querySelector(spec.readySelector)):null,
        readyAttribute:spec.readyAttribute||null,
        currentPublicCondition:document.querySelector('[data-condition-state]')?.textContent?.trim()||null,
        carouselActiveId:document.querySelector('[data-carousel]')?.dataset.activeId||null,
        failure
      };
      if(surfaceId!=='audralia')return base;
      let reconciliationRuntime=null;
      let reconciliationRuntimeError=null;
      try{reconciliationRuntime=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()||null;}catch(error){reconciliationRuntimeError=serializeError(error);}
      return {
        ...base,
        audralia:{
          loader:loader?{className:loader.className,dataset:{...loader.dataset},stage:document.querySelector('[data-audralia-loader-stage]')?.textContent?.trim()||null,progress:document.querySelector('[data-audralia-loader-progress]')?.textContent?.trim()||null,elapsed:document.querySelector('[data-audralia-loader-elapsed]')?.textContent?.trim()||null}:null,
          startupDiagnostic:window.__AUDRALIA_STARTUP_DIAGNOSTIC__||null,
          startupPhase:window.__AUDRALIA_STARTUP_PHASE__||null,
          reconciliationError:serializeError(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__),
          reconciliationRuntime:reconciliationRuntime?{invariants:reconciliationRuntime.invariants||null,status:reconciliationRuntime.status||null,state:reconciliationRuntime.state||null}:null,
          reconciliationRuntimeError,
          milestones:{renderer:Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer),clearAtmosphere:Boolean(document.querySelector('[data-audralia-clear-atmosphere="true"]')),orbitalCloud:Boolean(globalThis.__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__),regionalWeather:Boolean(document.querySelector('[data-audralia-exterior-weather="true"]')),localContinuity:Boolean(document.querySelector('[data-canonical-weather-projection="true"]'))}
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
      try{diagnostic=await captureRuntimeDiagnostic(error);}catch(diagnosticError){diagnostic={captureError:String(diagnosticError?.stack||diagnosticError)};}
      console.error(JSON.stringify({schema:'PUBLICATION_SURFACE_RUNTIME_DIAGNOSTIC_v1',surfaceId:manifest.surfaceId,url,result:'FAIL',phase:'READINESS_WAIT',failure:String(error?.stack||error),diagnostics:{pageErrors,consoleErrors,evidenceInteractions,declaredInteractions,failures:['RUNTIME_READINESS_FAILED']},diagnostic},null,2));
      throw error;
    }

    await verifyEvidenceCarousel('AFTER_CONDITION_TERMINAL');
    declaredInteractions=await runDeclaredInteractions(page,spec.interactions);

    const binding=spec.binding||{mode:'direct-document'};
    const result=await page.evaluate(({spec,binding})=>{
      const currentUrl=new URL(location.href);
      const normalized=value=>{const path=String(value||'/').replace(/\/+$/,'')||'/';return path.startsWith('/')?path:`/${path}`;};
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
        currentPublicCondition:document.querySelector('[data-condition-state]')?.textContent?.trim()||null,
        carouselActiveId:document.querySelector('[data-carousel]')?.dataset.activeId||null,
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
    if(spec.requireEvidenceCarouselInteraction===true&&evidenceInteractions.some(x=>!x.ok))failures.push('EVIDENCE_CAROUSEL_INTERACTION_FAILED');
    if(declaredInteractions.some(x=>!x.ok))failures.push('DECLARED_INTERACTION_FAILED');
    if(manifest.surfaceId==='evidence'&&result.currentPublicCondition==='CHECKING')failures.push('EVIDENCE_CONDITION_NOT_TERMINAL');

    const receipt={schema:'PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1',surfaceId:manifest.surfaceId,url,result:failures.length?'FAIL':'PASS',runtime:result,diagnostics:{pageErrors,consoleErrors,ignoredConsoleErrors,actionableConsoleErrors,evidenceInteractions,declaredInteractions,failures}};
    console.log(JSON.stringify(receipt,null,2));
    if(failures.length)process.exitCode=1;
  }finally{
    await browser.close();
  }
};

const isMain=Boolean(process.argv[1])&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(isMain)await main();
