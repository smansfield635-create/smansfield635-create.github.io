#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BASE='http://127.0.0.1:4173';
const SCHEMA='AUDRALIA_DEVICE_RENDER_PATH_SHARED_RUNTIME_QUALIFICATION_RECEIPT_v1';
const INDEX='showroom/globe/audralia/index.html';
const TABLET_LOADER='showroom/globe/audralia/tablet-loader-controller-v1.mjs';
const LOCAL_MESH='showroom/globe/h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs';
const EXPECTED_INDEX_BLOB='fed56a385a84b7c230f32bd4fa62c21672d76556';
const EXPECTED_PIXEL_BUDGET=921600;
const SHARED_ATMOSPHERE_IMPORT='./atmospheric-parity-v1.mjs?cb=AUDRALIA_FULL_ATMOSPHERIC_PARITY_3265_v1';
const SHARED_WEATHER_IMPORT='/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs?cb=EXACT_24057';
const SHARED_CELESTIAL_IMPORT='/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/celestial-checkpoint-1.mjs?cb=EXACT_24057';
const TABLET_LOADER_IMPORT='./tablet-loader-controller-v1.mjs?cb=AUDRALIA_TABLET_RECOVERY_3268_v1';
const LOCAL_MESH_IMPORT='../h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs?cb=AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_v1';

const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const readBytes=p=>fs.readFileSync(path.join(ROOT,p));
function gitBlob(bytes){return crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');}

function staticCandidate(){
  const indexBytes=readBytes(INDEX);
  const index=indexBytes.toString('utf8');
  const loader=read(TABLET_LOADER);
  const mesh=read(LOCAL_MESH);

  assert.equal(gitBlob(indexBytes),EXPECTED_INDEX_BLOB,'PRODUCT_CANDIDATE_INDEX_DRIFT');
  assert.doesNotMatch(index,/audralia-tablet-single-context-clouds-runtime\.mjs/,'STALE_TABLET_RUNTIME_BINDING_RETAINED');
  assert.doesNotMatch(index,/celestial-primary-context-v1\.mjs/,'STALE_TABLET_CELESTIAL_BINDING_RETAINED');
  assert.ok(index.includes(SHARED_ATMOSPHERE_IMPORT),'SHARED_ATMOSPHERE_BINDING_MISSING');
  assert.ok(index.includes(SHARED_WEATHER_IMPORT),'SHARED_WEATHER_RECONCILIATION_BINDING_MISSING');
  assert.ok(index.includes(SHARED_CELESTIAL_IMPORT),'CANONICAL_CELESTIAL_BINDING_MISSING');
  assert.ok(index.includes(TABLET_LOADER_IMPORT),'TABLET_LOADER_BINDING_MISSING');
  assert.ok(index.includes(LOCAL_MESH_IMPORT),'LOCAL_MESH_BINDING_MISSING');
  assert.match(index,/const tabletPixelBudget = 921600;/,'TABLET_PIXEL_BUDGET_DRIFT');
  assert.doesNotMatch(index,/if \(!constrainedTablet\) \{\s*await import\('\.\/atmospheric-parity-v1\.mjs\?cb=AUDRALIA_FULL_ATMOSPHERIC_PARITY_3265_v1'\)/s,'PHONE_ONLY_ATMOSPHERE_FORK_RETAINED');
  assert.match(index,/atmosphericParity:\s*'SHARED_PHONE_AUDRALIA_PRODUCT_PATH_v1'/,'SHARED_ATMOSPHERE_IDENTITY_MISSING');
  assert.match(index,/tabletMorphologyAuthority:\s*null/,'TABLET_MORPHOLOGY_AUTHORITY_NOT_REMOVED');
  assert.match(index,/tabletCelestialParity:\s*'SHARED_CANONICAL_CELESTIAL_CHECKPOINT_24057'/,'SHARED_CELESTIAL_IDENTITY_MISSING');
  assert.match(index,/deviceAuthorityDivergence:\s*false/,'DEVICE_AUTHORITY_DIVERGENCE_RETAINED');

  assert.match(loader,/meshChunk\(index,total\)/,'TABLET_LOADER_MESH_PROGRESS_MISSING');
  assert.match(loader,/cloudsStart\(\)/,'TABLET_LOADER_CLOUD_STAGE_MISSING');
  assert.match(loader,/celestialStart\(\)/,'TABLET_LOADER_CELESTIAL_STAGE_MISSING');
  assert.match(loader,/function fail\(label,error\)/,'TABLET_LOADER_FAILURE_SURFACE_MISSING');
  assert.match(mesh,/sameOriginCriticalPath:\s*MESH_URLS\.every\(url\s*=>\s*url\.origin\s*===\s*location\.origin\)/,'TABLET_LOCAL_MESH_EVIDENCE_MISSING');
  assert.match(mesh,/yieldBetweenChunks/,'TABLET_MESH_PAINT_YIELD_MISSING');

  return Object.freeze({
    productCandidateIndexBlob:EXPECTED_INDEX_BLOB,
    sharedAtmosphereImport:SHARED_ATMOSPHERE_IMPORT,
    sharedWeatherImport:SHARED_WEATHER_IMPORT,
    sharedCelestialImport:SHARED_CELESTIAL_IMPORT,
    tabletPixelBudget:EXPECTED_PIXEL_BUDGET,
    staleTabletRuntimeRequired:false,
    staleTabletCelestialRequired:false,
    physicalTabletStabilityClaimed:false
  });
}

function forceTouch(maxTouchPoints){
  try{Object.defineProperty(navigator,'maxTouchPoints',{configurable:true,get:()=>maxTouchPoints});}catch{}
}

function finiteVector(value,minLength=3){
  return Array.isArray(value)&&value.length>=minLength&&value.every(Number.isFinite);
}

async function openProfile(browser,profile){
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error?.stack||error)));
  const tablet=profile==='TABLET';
  await page.setViewport(tablet
    ? {width:1280,height:800,deviceScaleFactor:2,isMobile:true,hasTouch:true}
    : {width:720,height:1280,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await page.evaluateOnNewDocument(forceTouch,5);

  try{
    await page.goto(`${BASE}/showroom/globe/audralia/`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>{
      if(window.__AUDRALIA_STARTUP_FAILURE__)throw new Error(`STARTUP_FAILURE:${window.__AUDRALIA_STARTUP_FAILURE__.message||'unknown'}`);
      if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__)throw new Error(`RECONCILIATION_FAILURE:${window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__.message||'unknown'}`);
      const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__;
      if(startup?.status==='FAILED')throw new Error(`STARTUP_FAILED:${startup.error||'unknown'}`);
      const shared=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
      const runtime=shared?.getRuntime?.();
      return startup?.status==='COMPLETE'&&runtime?.invariants?.pass===true;
    },{timeout:120000});

    await page.waitForFunction(()=>document.querySelector('[data-audralia-loader]')?.hidden===true,{timeout:5000}).catch(()=>{});

    const result=await page.evaluate(profile=>{
      const shared=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
      const runtime=shared?.getRuntime?.();
      const before=shared?.getCameraFrame?.();
      let controlRuntime=null,after=null,controlError=null;
      try{
        if(before?.snapshot&&typeof shared?.setCameraStateForTest==='function'){
          const yaw=Number(before.snapshot.yaw)||0;
          controlRuntime=shared.setCameraStateForTest({yaw:yaw+0.0025});
          after=shared.getCameraFrame();
        }
      }catch(error){controlError=String(error?.stack||error);}
      const budget=window.__AUDRALIA_RENDER_PIXEL_BUDGET__;
      const integration=window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__;
      const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__;
      const loader=document.querySelector('[data-audralia-loader]');
      return {
        profile,
        reconciliationSchema:shared?.schema??null,
        sharedRuntimePresent:Boolean(shared),
        runtimePresent:Boolean(runtime),
        runtimeInvariants:runtime?.invariants??null,
        controlRuntimeInvariants:controlRuntime?.invariants??null,
        controlError,
        cameraHealthy:Boolean(before&&Array.isArray(before.eye)&&Array.isArray(before.target)&&Array.isArray(before.forward)&&before.snapshot),
        cameraBefore:before?.snapshot??null,
        cameraAfter:after?.snapshot??null,
        hasCameraControl:typeof shared?.setCameraStateForTest==='function',
        budget:budget?{active:budget.active,nativeDpr:budget.nativeDpr,effectiveDpr:budget.effectiveDpr,maximumPrimaryRenderPixels:budget.maximumPrimaryRenderPixels,viewportPixels:budget.viewportPixels}:null,
        integration:integration?{atmosphericParity:integration.atmosphericParity,tabletMorphologyAuthority:integration.tabletMorphologyAuthority,tabletCelestialParity:integration.tabletCelestialParity,deviceAuthorityDivergence:integration.deviceAuthorityDivergence,tabletFramebufferBudget:integration.tabletFramebufferBudget}:null,
        startup:startup?{status:startup.status,sameEnvironment:startup.sameEnvironment,fallbackEnvironment:startup.fallbackEnvironment,primaryWorldBeforeCelestialWebGL:startup.primaryWorldBeforeCelestialWebGL}:null,
        tabletLoaderControllerPresent:Boolean(window.__AUDRALIA_TABLET_LOADER_CONTROLLER__),
        legacyTabletRuntimePresent:Boolean(window.__AUDRALIA_TABLET_SINGLE_CONTEXT__),
        reconciliationError:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__??null,
        startupFailure:window.__AUDRALIA_STARTUP_FAILURE__??null,
        worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,
        canvasCount:document.querySelectorAll('canvas').length,
        loaderPresent:Boolean(loader),
        loaderHidden:Boolean(loader?.hidden)
      };
    },profile);
    result.errors=errors;
    return result;
  }finally{
    await page.close();
  }
}

function verifyCommon(value,label){
  assert.equal(value.errors.length,0,`${label}_PAGE_ERROR`);
  assert.equal(value.sharedRuntimePresent,true,`${label}_SHARED_RUNTIME_MISSING`);
  assert.equal(value.runtimePresent,true,`${label}_RUNTIME_MISSING`);
  assert.equal(value.runtimeInvariants?.pass,true,`${label}_RUNTIME_INVARIANTS`);
  assert.equal(value.controlRuntimeInvariants?.pass,true,`${label}_CAMERA_CONTROL_RUNTIME_INVARIANTS`);
  assert.equal(value.controlError,null,`${label}_CAMERA_CONTROL_ERROR`);
  assert.equal(value.cameraHealthy,true,`${label}_CAMERA_FRAME_INVALID`);
  assert.equal(value.hasCameraControl,true,`${label}_CAMERA_CONTROL_MISSING`);
  assert.equal(value.legacyTabletRuntimePresent,false,`${label}_LEGACY_TABLET_RUNTIME_PRESENT`);
  assert.equal(value.reconciliationError,null,`${label}_RECONCILIATION_ERROR`);
  assert.equal(value.startupFailure,null,`${label}_STARTUP_FAILURE`);
  assert.equal(value.startup?.status,'COMPLETE',`${label}_STARTUP_INCOMPLETE`);
  assert.equal(value.startup?.sameEnvironment,true,`${label}_ENVIRONMENT_DIVERGENCE`);
  assert.equal(value.startup?.fallbackEnvironment,false,`${label}_FALLBACK_ENVIRONMENT_ACTIVE`);
  assert.equal(value.worldCanvasCount,1,`${label}_WORLD_CANVAS_COUNT`);
  assert.equal(value.integration?.atmosphericParity,'SHARED_PHONE_AUDRALIA_PRODUCT_PATH_v1',`${label}_ATMOSPHERE_IDENTITY`);
  assert.equal(value.integration?.tabletMorphologyAuthority,null,`${label}_TABLET_MORPHOLOGY_AUTHORITY`);
  assert.equal(value.integration?.tabletCelestialParity,'SHARED_CANONICAL_CELESTIAL_CHECKPOINT_24057',`${label}_CELESTIAL_IDENTITY`);
  assert.equal(value.integration?.deviceAuthorityDivergence,false,`${label}_DEVICE_AUTHORITY_DIVERGENCE`);
  assert.ok(Number.isFinite(value.cameraBefore?.targetU)&&Number.isFinite(value.cameraBefore?.targetV),`${label}_CAMERA_TARGET_INVALID`);
  assert.ok(Number.isFinite(value.cameraBefore?.distance),`${label}_CAMERA_DISTANCE_INVALID`);
  assert.ok(Number.isFinite(value.cameraAfter?.yaw),`${label}_CAMERA_CONTROL_RESULT_INVALID`);
}

function verifyPhone(value){
  verifyCommon(value,'PHONE');
  assert.equal(value.budget?.active,false,'PHONE_UNEXPECTED_TABLET_BUDGET');
  assert.equal(value.tabletLoaderControllerPresent,false,'PHONE_TABLET_LOADER_UNEXPECTED');
  return Object.freeze({pass:true,reconciliationSchema:value.reconciliationSchema,canvasCount:value.canvasCount});
}

function verifyTablet(value){
  verifyCommon(value,'TABLET');
  assert.equal(value.budget?.active,true,'TABLET_PIXEL_BUDGET_NOT_ACTIVE');
  assert.equal(value.budget?.maximumPrimaryRenderPixels,EXPECTED_PIXEL_BUDGET,'TABLET_PIXEL_BUDGET_DRIFT');
  assert.equal(value.integration?.tabletFramebufferBudget,'AUDRALIA_RENDER_PIXEL_BUDGET_v1','TABLET_FRAMEBUFFER_BUDGET_IDENTITY');
  assert.equal(value.tabletLoaderControllerPresent,true,'TABLET_LOADER_CONTROLLER_MISSING');
  assert.equal(value.loaderPresent,true,'TABLET_LOADER_ELEMENT_MISSING');
  assert.equal(value.loaderHidden,true,'TABLET_LOADER_NOT_DISMISSED');
  return Object.freeze({pass:true,reconciliationSchema:value.reconciliationSchema,canvasCount:value.canvasCount,effectiveDpr:value.budget?.effectiveDpr,maximumPrimaryRenderPixels:value.budget?.maximumPrimaryRenderPixels});
}

const receipt={
  schema:SCHEMA,
  result:'FAIL_CLOSED',
  mechanicalOnly:true,
  physicalTabletStabilityClaimed:false,
  ownerPhysicalDeviceAcceptanceRequiredAfterPublication:true,
  exactProductCandidate:'77705e8ee312980fc7cb6cf77e3e14ac520763bc',
  exactProductIndexBlob:EXPECTED_INDEX_BLOB
};
let browser=null;
try{
  receipt.staticEvidence=staticCandidate();
  const chrome=process.env.CHROME_PATH;
  assert.ok(chrome,'CHROME_PATH_MISSING');
  browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  receipt.browserVersion=await browser.version();
  const phone=await openProfile(browser,'PHONE');
  const tablet=await openProfile(browser,'TABLET');
  receipt.phone=verifyPhone(phone);
  receipt.tablet=verifyTablet(tablet);
  assert.equal(phone.reconciliationSchema,tablet.reconciliationSchema,'PHONE_TABLET_SHARED_RUNTIME_SCHEMA_MISMATCH');
  receipt.sharedRuntimeSchema=phone.reconciliationSchema;
  receipt.result='PASS_CLOSED';
}catch(error){
  receipt.failure=String(error?.stack||error);
  process.exitCode=1;
}finally{
  if(browser)try{await browser.close();}catch(error){receipt.closeFailure=String(error);receipt.result='FAIL_CLOSED';process.exitCode=1;}
  console.log(JSON.stringify(receipt,null,2));
}
