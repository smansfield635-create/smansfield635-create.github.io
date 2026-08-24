#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const base='http://127.0.0.1:4173';
const chrome=process.env.CHROME_PATH;
if(!chrome)throw new Error('CHROME_PATH_MISSING');

const DIRECT_FAP1='showroom/globe/audralia/fap1-weather-presentation-v1.mjs';
const SNAPSHOT_FAP1='inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/fap1-weather-presentation-v1.mjs';
const LIVE_INDEX='showroom/globe/audralia/index.html';
const BASE_RENDERER='showroom/globe/audralia/weather-presentation-reconciliation/app.mjs';
const POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v5';
const REQUEST_IDENTITY='FAP1_WSD5_20260824_001';
const SYSTEM_IDS=Object.freeze([
  'MARINE_STRATUS_STRATOCUMULUS_BANK',
  'TRADE_CUMULUS_STREETS',
  'MIDLATITUDE_COMMA_FRONT',
  'MESOSCALE_CONVECTIVE_COMPLEX',
  'HIGH_CIRRUS_CIRROCUMULUS_JET_PLUME'
]);

function requireStaticCandidate(){
  const direct=fs.readFileSync(DIRECT_FAP1,'utf8');
  const snapshot=fs.readFileSync(SNAPSHOT_FAP1,'utf8');
  const index=fs.readFileSync(LIVE_INDEX,'utf8');
  const renderer=fs.readFileSync(BASE_RENDERER,'utf8');

  assert.equal(snapshot,direct,'FAP1_SOURCE_SNAPSHOT_BYTE_PARITY_FAILURE');
  assert.match(direct,new RegExp(POLICY_ID),'FAP1_V5_POLICY_ID_MISSING');
  for(const id of SYSTEM_IDS)assert.match(direct,new RegExp(id),'FAP1_DIVERSIFICATION_SYSTEM_ID_MISSING_'+id);
  assert.match(index,new RegExp(`fap1-weather-presentation-v1\\.mjs\\?cb=${REQUEST_IDENTITY}`),'FAP1_FRESH_REQUEST_IDENTITY_MISSING');
  assert.match(renderer,/const REST_STEPS=32,INTERACTION_STEPS=15,REST_MAX_PIXELS=230000,INTERACTION_MAX_PIXELS=90000;/,'FAP1_PERFORMANCE_CEILINGS_CHANGED');
  assert.match(renderer,/uSysA\[8\]/,'FAP1_EXISTING_SYSTEM_ARRAY_CONTRACT_CHANGED');
  return {
    policyId:POLICY_ID,
    systemIds:SYSTEM_IDS,
    byteParity:true,
    requestIdentity:REQUEST_IDENTITY,
    performanceCeilingsFrozen:true
  };
}

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForAuthoritativeRuntime(page,{timeout=105000,label='runtime'}={}){
  const started=Date.now();
  let last=null;
  while(Date.now()-started<timeout){
    last=await page.evaluate(()=>({
      reconciliationPresent:Boolean(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__),
      runtimePresent:Boolean(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()),
      pass:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.pass===true,
      failures:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.failures||[],
      reconciliationError:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__||null,
      loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),
      loaderStage:document.querySelector('[data-audralia-loader-stage]')?.textContent?.trim()||null,
      status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null
    }));
    if(last.reconciliationError)throw new Error(`${label.toUpperCase()}_RECONCILIATION_ERROR ${JSON.stringify(last)}`);
    if(last.pass)return last;
    await sleep(250);
  }
  throw new Error(`${label.toUpperCase()}_AUTHORITATIVE_RUNTIME_TIMEOUT ${JSON.stringify(last)}`);
}

async function waitForFap1(page,{timeout=15000,label='fap1'}={}){
  const started=Date.now();
  let last=null;
  while(Date.now()-started<timeout){
    last=await page.evaluate(()=>({
      present:Boolean(window.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__),
      policyId:window.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__?.policyId||null,
      evidence:window.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__?.getRuntimeEvidence?.()||null
    }));
    if(last.present)return last;
    await sleep(100);
  }
  throw new Error(`${label.toUpperCase()}_TIMEOUT ${JSON.stringify(last)}`);
}

function installErrorCapture(page){
  const pageErrors=[],consoleErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  return {pageErrors,consoleErrors};
}

const staticCandidate=requireStaticCandidate();
console.log(JSON.stringify({staticCandidate},null,2));

const browser=await puppeteer.launch({
  executablePath:chrome,
  headless:'new',
  args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});

try{
  const page=await browser.newPage();
  await page.setViewport({width:720,height:1280,deviceScaleFactor:1});
  const reconciliationCapture=installErrorCapture(page);
  await page.goto(`${base}/showroom/globe/audralia/weather-presentation-reconciliation/`,{waitUntil:'domcontentloaded',timeout:60000});
  const authoritative=await waitForAuthoritativeRuntime(page,{label:'reconciliation'});
  const result=await page.evaluate(()=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    const ids0=proof.canonicalObjects.map(x=>x.ID_i);
    const local=proof.setCameraStateForTest({distance:720});
    const localCutoff=Number(proof.exterior.overlay.dataset.nearCutoff||0);
    const ids1=proof.canonicalObjects.map(x=>x.ID_i);
    const planetary=proof.setCameraStateForTest({distance:5000});
    const planetaryCutoff=Number(proof.exterior.overlay.dataset.nearCutoff||-1);
    const ids2=proof.canonicalObjects.map(x=>x.ID_i);
    proof.setCameraStateForTest({distance:720});
    return {
      schema:proof.schema,
      cameraSemanticsMutated:proof.cameraSemanticsMutated,
      zoomSemanticsMutated:proof.zoomSemanticsMutated,
      travelSemanticsMutated:proof.travelSemanticsMutated,
      localPass:local.invariants.pass,
      planetaryPass:planetary.invariants.pass,
      localCutoff,
      planetaryCutoff,
      idsStable:JSON.stringify(ids0)===JSON.stringify(ids1)&&JSON.stringify(ids1)===JSON.stringify(ids2),
      localActive:local.spatial.activeLocalCount,
      localCap:local.spatial.maxLocalCount,
      loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),
      skyEvidence:proof.sky.getEvidence(),
      exteriorEvidence:proof.exterior.getEvidence(),
      status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null
    };
  });
  console.log(JSON.stringify({authoritative,reconciliation:result,...reconciliationCapture},null,2));
  const reconciliationFailed=
    reconciliationCapture.pageErrors.length||
    !result.localPass||
    !result.planetaryPass||
    !result.idsStable||
    result.localActive>result.localCap||
    result.loaderProgress<4||
    result.cameraSemanticsMutated||
    result.zoomSemanticsMutated||
    result.travelSemanticsMutated||
    result.localCutoff<500||
    result.planetaryCutoff!==0||
    result.skyEvidence.nearTerrainVeil!==false||
    result.exteriorEvidence.nearFieldExtinctionAuthority!==false||
    !String(result.status).includes('USER_REVIEW_REQUIRED');
  if(reconciliationFailed)throw new Error('RECONCILIATION_ASSERTION_FAILURE');
  await page.close();

  const live=await browser.newPage();
  await live.setViewport({width:720,height:1280,deviceScaleFactor:1});
  const liveCapture=installErrorCapture(live);
  await live.goto(`${base}/showroom/globe/audralia/`,{waitUntil:'domcontentloaded',timeout:60000});
  const liveFap1=await waitForFap1(live,{label:'live_fap1'});
  const liveAuthoritative=await waitForAuthoritativeRuntime(live,{label:'live'});
  const liveResult=await live.evaluate(()=>({
    integration:window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__,
    fap1:window.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__,
    fap1Evidence:window.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__?.getRuntimeEvidence?.(),
    loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),
    loaderBuild:document.querySelector('.audralia-loading-version')?.textContent?.trim()||null,
    status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
    nav:[...document.querySelectorAll('.audralia-live-nav a')].map(a=>a.textContent.trim()),
    canvasCount:document.querySelectorAll('canvas').length
  }));
  console.log(JSON.stringify({liveFap1,liveAuthoritative,live:liveResult,...liveCapture},null,2));

  assert.equal(liveResult.integration?.schema,'AUDRALIA_LIVE_PLANETARY_INTEGRATION_v7_24057_DENSE_CLOUD_SUCCESSOR','LIVE_INTEGRATION_SCHEMA_DRIFT');
  assert.equal(liveResult.integration?.startupArchitecture,'APPROVED_PRESENTATION_PRE_RENDER_v1','LIVE_STARTUP_ARCHITECTURE_DRIFT');
  assert.equal(liveResult.integration?.weatherPresentationReconciliation,true,'LIVE_RECONCILIATION_BINDING_MISSING');
  assert.equal(liveResult.integration?.cameraSemanticsFrozen,true,'LIVE_CAMERA_SEMANTICS_NOT_FROZEN');
  assert.equal(liveResult.integration?.fap1OrganizedWeatherCandidate,true,'LIVE_FAP1_BINDING_MISSING');
  assert.ok(liveResult.loaderProgress>=4,'LIVE_LOADER_NOT_READY');
  assert.ok(String(liveResult.loaderBuild||'').includes('STARTUP TRACE v1'),'LIVE_BUILD_IDENTITY_DRIFT');
  assert.ok(String(liveResult.status).includes('USER_REVIEW_REQUIRED'),'LIVE_RUNTIME_NOT_READY');
  assert.deepEqual(liveResult.nav.includes('H-Earth · Play'),true,'LIVE_NAV_H_EARTH_MISSING');
  assert.deepEqual(liveResult.nav.includes('Compass'),true,'LIVE_NAV_COMPASS_MISSING');
  assert.deepEqual(liveResult.nav.includes('Mirrorland'),true,'LIVE_NAV_MIRRORLAND_MISSING');
  assert.equal(liveResult.canvasCount,1,'LIVE_ADDITIONAL_RENDER_CANVAS_DETECTED');
  assert.equal(liveCapture.pageErrors.length,0,'LIVE_PAGE_ERROR');

  const fap1=liveResult.fap1;
  assert.equal(fap1?.policyId,POLICY_ID,'FAP1_V5_RUNTIME_POLICY_MISSING');
  assert.equal(fap1?.acceptedWorldPreserved,true,'FAP1_WORLD_PRESERVATION_FAILURE');
  assert.equal(fap1?.geographyMutation,false,'FAP1_GEOGRAPHY_MUTATION');
  assert.equal(fap1?.oceanMutation,false,'FAP1_OCEAN_MUTATION');
  assert.equal(fap1?.cameraMutation,false,'FAP1_CAMERA_MUTATION');
  assert.equal(fap1?.navigationMutation,false,'FAP1_NAVIGATION_MUTATION');
  assert.equal(fap1?.visibleUpgrade?.marineStratusStratocumulusBank,true,'FAP1_MARINE_BANK_MISSING');
  assert.equal(fap1?.visibleUpgrade?.tradeCumulusStreets,true,'FAP1_TRADE_STREETS_MISSING');
  assert.equal(fap1?.visibleUpgrade?.midlatitudeCommaFront,true,'FAP1_COMMA_FRONT_MISSING');
  assert.equal(fap1?.visibleUpgrade?.mesoscaleConvectiveComplex,true,'FAP1_MCC_MISSING');
  assert.equal(fap1?.visibleUpgrade?.highCirrusCirrocumulusJetPlume,true,'FAP1_CIRRUS_PLUME_MISSING');
  assert.equal(fap1?.visibleUpgrade?.sparseHemisphereDiversified,true,'FAP1_SPARSE_HEMISPHERE_NOT_DIVERSIFIED');
  assert.equal(fap1?.visibleUpgrade?.existingCloudSystemsExpanded,false,'FAP1_EXISTING_SYSTEM_EXPANSION_DETECTED');
  assert.equal(fap1?.visibleUpgrade?.singlePassRaymarchPreserved,true,'FAP1_SINGLE_PASS_NOT_PRESERVED');
  assert.equal(fap1?.visibleUpgrade?.performanceCeilingsFrozen,true,'FAP1_PERFORMANCE_CEILINGS_NOT_FROZEN');
  assert.equal(fap1?.diversification?.targetSector,'82E_TO_126W_ACROSS_DATELINE','FAP1_TARGET_SECTOR_DRIFT');
  assert.equal(fap1?.diversification?.systemCount,5,'FAP1_SYSTEM_COUNT_MISMATCH');
  assert.deepEqual([...fap1.diversification.systemIds],SYSTEM_IDS,'FAP1_SYSTEM_IDS_MISMATCH');
  assert.equal(fap1?.diversification?.existingSystemsExpanded,false,'FAP1_EXISTING_SYSTEMS_EXPANDED');
  assert.equal(fap1?.diversification?.additionalRenderPasses,0,'FAP1_RENDER_PASS_ADDED');
  assert.equal(fap1?.diversification?.rayMarchCeilingsChanged,false,'FAP1_RAYMARCH_CEILING_CHANGED');
  assert.ok(Number(liveResult.fap1Evidence?.patchedCloudShaders||0)>=1,'FAP1_SHADER_PATCH_NOT_APPLIED');

  console.log(JSON.stringify({
    schema:'AUDRALIA_WEATHER_SYSTEM_DIVERSIFICATION_QUALIFICATION_v1',
    result:'PASS',
    policyId:POLICY_ID,
    systemIds:SYSTEM_IDS,
    targetSector:fap1.diversification.targetSector,
    patchedCloudShaders:liveResult.fap1Evidence.patchedCloudShaders,
    existingSystemsExpanded:false,
    additionalRenderPasses:0,
    performanceCeilingsFrozen:true,
    productionDeploymentPerformed:false
  },null,2));
}finally{
  await browser.close();
}
