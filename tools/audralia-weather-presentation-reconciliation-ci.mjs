#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BASE='http://127.0.0.1:4173';
const SCHEMA='AUDRALIA_CURRENT_RUNTIME_TOPOLOGY_QUALIFICATION_RECEIPT_v1';
const INDEX='showroom/globe/audralia/index.html';
const EXPECTED_INDEX_BLOB='62d6907e91ea2345a86f13545b05afa2018ca673';
const TABLET_RUNTIME_SCHEMA='AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_v1';
const TABLET_RUNTIME_REF='983cb8cd6ca61d154e9be374298d42e0027db69d';
const SNAPSHOT_PREFIX='/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/';
const EXPECTED_PIXEL_BUDGET=921600;

const readBytes=p=>fs.readFileSync(path.join(ROOT,p));
function gitBlob(bytes){return crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');}
const finite=n=>Number.isFinite(Number(n));

function staticCandidate(){
  const bytes=readBytes(INDEX);
  const index=bytes.toString('utf8');
  assert.equal(gitBlob(bytes),EXPECTED_INDEX_BLOB,'AUDRALIA_PRODUCT_INDEX_DRIFT');
  assert.match(index,/directDenseCloudCoverage:\s*false/,'CURRENT_CLOUD_POLICY_IDENTITY_MISSING');
  assert.match(index,/AUDRALIA_LIVE_PLANETARY_INTEGRATION_v7_EXACT_24057_LOADER_FIRST/,'CURRENT_INTEGRATION_SCHEMA_MISSING');
  assert.ok(index.includes(`${SNAPSHOT_PREFIX}weather-presentation-reconciliation/loader-progress.mjs?cb=EXACT_24057_LOADER_FIRST`),'SNAPSHOT_LOADER_BINDING_MISSING');
  assert.ok(index.includes(`${SNAPSHOT_PREFIX}fap1-weather-presentation-v1.mjs?cb=EXACT_24057`),'SNAPSHOT_FAP_BINDING_MISSING');
  assert.ok(index.includes(`${SNAPSHOT_PREFIX}weather-presentation-reconciliation/app.mjs?cb=EXACT_24057`),'SNAPSHOT_RECONCILIATION_BINDING_MISSING');
  assert.ok(index.includes(`@${TABLET_RUNTIME_REF}/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-runtime.mjs`),'TABLET_EXACT_RUNTIME_BINDING_MISSING');
  assert.match(index,/const tabletPixelBudget = 921600;/,'TABLET_PIXEL_BUDGET_DRIFT');
  assert.match(index,/window\.__AUDRALIA_TABLET_STARTUP_STABILITY__\s*=\s*\{/,'STARTUP_STABILITY_CONTRACT_MISSING');
  return Object.freeze({
    productIndexBlob:EXPECTED_INDEX_BLOB,
    snapshotPrefix:SNAPSHOT_PREFIX,
    tabletRuntimeRef:TABLET_RUNTIME_REF,
    tabletPixelBudget:EXPECTED_PIXEL_BUDGET,
    productBytesChanged:false
  });
}

function forceTouch(maxTouchPoints){
  try{Object.defineProperty(navigator,'maxTouchPoints',{configurable:true,get:()=>maxTouchPoints});}catch{}
}

async function openProfile(browser,profile){
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error?.stack||error)));
  const tablet=profile==='TABLET';
  await page.setViewport(tablet
    ? {width:1280,height:800,deviceScaleFactor:2,isMobile:true,hasTouch:true}
    : {width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true});
  await page.evaluateOnNewDocument(forceTouch,5);

  try{
    await page.goto(`${BASE}/showroom/globe/audralia/`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>{
      const failed=window.__AUDRALIA_STARTUP_FAILURE__;
      if(failed)throw new Error(`STARTUP_FAILURE:${failed.message||'unknown'}`);
      const reconciliationFailure=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__;
      if(reconciliationFailure)throw new Error(`RECONCILIATION_FAILURE:${reconciliationFailure.message||'unknown'}`);
      const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__;
      if(startup?.status==='FAILED')throw new Error(`STARTUP_FAILED:${startup.error||'unknown'}`);
      const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
      return startup?.status==='COMPLETE'&&proof?.renderer&&typeof proof?.getCameraFrame==='function';
    },{timeout:120000});
    await page.waitForSelector('[data-audralia-loader].is-ready',{timeout:120000});

    const result=await page.evaluate(profile=>{
      const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__||null;
      const frame=proof?.getCameraFrame?.()||null;
      const snapshot=frame?.snapshot||null;
      const runtime=typeof proof?.getRuntime==='function'?proof.getRuntime():null;
      const budget=window.__AUDRALIA_RENDER_PIXEL_BUDGET__||null;
      const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__||null;
      const tabletRuntime=window.__AUDRALIA_TABLET_SINGLE_CONTEXT__||null;
      const loader=document.querySelector('[data-audralia-loader]');
      return {
        profile,
        proofPresent:Boolean(proof),
        proofSchema:proof?.schema||null,
        proofInvariantPass:proof?.invariants?.pass??null,
        runtimeInvariantPass:runtime?.invariants?.pass??null,
        cameraSnapshot:snapshot,
        cameraVectors:{
          eye:Array.isArray(frame?.eye)?frame.eye:null,
          target:Array.isArray(frame?.target)?frame.target:null,
          forward:Array.isArray(frame?.forward)?frame.forward:null
        },
        budget:budget?{
          active:budget.active,
          nativeDpr:budget.nativeDpr,
          effectiveDpr:budget.effectiveDpr,
          viewportPixels:budget.viewportPixels,
          maximumPrimaryRenderPixels:budget.maximumPrimaryRenderPixels
        }:null,
        startup:startup?{
          status:startup.status,
          sameEnvironment:startup.sameEnvironment,
          fallbackEnvironment:startup.fallbackEnvironment,
          error:startup.error||null
        }:null,
        tabletRuntime:tabletRuntime?{
          schema:tabletRuntime.schema,
          invariantPass:tabletRuntime.invariants?.pass??null,
          singleWebGLContext:tabletRuntime.invariants?.singleWebGLContext??null,
          failures:tabletRuntime.invariants?.failures||[]
        }:null,
        proofIsTabletRuntime:Boolean(proof&&tabletRuntime&&proof===tabletRuntime),
        worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,
        readyClass:Boolean(loader?.classList.contains('is-ready')),
        startupFailure:window.__AUDRALIA_STARTUP_FAILURE__||null,
        reconciliationFailure:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__||null
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
  assert.equal(value.proofPresent,true,`${label}_RUNTIME_PROOF_MISSING`);
  assert.equal(value.startupFailure,null,`${label}_STARTUP_FAILURE`);
  assert.equal(value.reconciliationFailure,null,`${label}_RECONCILIATION_FAILURE`);
  assert.equal(value.startup?.status,'COMPLETE',`${label}_STARTUP_INCOMPLETE`);
  assert.equal(value.startup?.fallbackEnvironment,false,`${label}_FALLBACK_ENVIRONMENT_ACTIVE`);
  assert.equal(value.worldCanvasCount,1,`${label}_WORLD_CANVAS_COUNT`);
  assert.equal(value.readyClass,true,`${label}_READY_CLASS_MISSING`);
  assert.ok(finite(value.cameraSnapshot?.targetU)&&finite(value.cameraSnapshot?.targetV),`${label}_CAMERA_TARGET_INVALID`);
  assert.ok(finite(value.cameraSnapshot?.distance)&&finite(value.cameraSnapshot?.pitch)&&finite(value.cameraSnapshot?.yaw),`${label}_CAMERA_SNAPSHOT_INVALID`);
}

function verifyPhone(value){
  verifyCommon(value,'PHONE');
  assert.equal(value.budget?.active,false,'PHONE_WRONGLY_ENTERED_CONSTRAINED_PATH');
  assert.equal(value.tabletRuntime,null,'PHONE_TABLET_RUNTIME_PRESENT');
  assert.equal(value.runtimeInvariantPass,true,'PHONE_RUNTIME_INVARIANTS');
  assert.ok(value.cameraVectors.eye?.length>=3&&value.cameraVectors.target?.length>=3&&value.cameraVectors.forward?.length>=3,'PHONE_CAMERA_VECTOR_FRAME_INVALID');
  return Object.freeze({pass:true,profile:'PHONE',proofSchema:value.proofSchema,viewportPixels:value.budget?.viewportPixels});
}

function verifyTablet(value){
  verifyCommon(value,'TABLET');
  assert.equal(value.budget?.active,true,'TABLET_CONSTRAINED_BUDGET_NOT_ACTIVE');
  assert.equal(value.budget?.maximumPrimaryRenderPixels,EXPECTED_PIXEL_BUDGET,'TABLET_PIXEL_BUDGET_DRIFT');
  assert.equal(value.tabletRuntime?.schema,TABLET_RUNTIME_SCHEMA,'TABLET_RUNTIME_SCHEMA');
  assert.equal(value.tabletRuntime?.invariantPass,true,'TABLET_RUNTIME_INVARIANTS');
  assert.equal(value.tabletRuntime?.singleWebGLContext,true,'TABLET_SINGLE_CONTEXT_INVARIANT');
  assert.equal(value.tabletRuntime?.failures?.length,0,'TABLET_RUNTIME_FAILURES');
  assert.equal(value.proofIsTabletRuntime,true,'TABLET_PROOF_RUNTIME_IDENTITY_MISMATCH');
  assert.equal(value.proofInvariantPass,true,'TABLET_PROOF_INVARIANTS');
  return Object.freeze({
    pass:true,
    profile:'TABLET',
    proofSchema:value.proofSchema,
    viewportPixels:value.budget?.viewportPixels,
    effectiveDpr:value.budget?.effectiveDpr,
    maximumPrimaryRenderPixels:value.budget?.maximumPrimaryRenderPixels
  });
}

const receipt={
  schema:SCHEMA,
  result:'FAIL_CLOSED',
  mechanicalOnly:true,
  exactAudraliaIndexBlob:EXPECTED_INDEX_BLOB,
  productMutationPerformed:false,
  physicalTabletStabilityClaimed:false
};
let browser=null;
try{
  receipt.staticEvidence=staticCandidate();
  const chrome=process.env.CHROME_PATH;
  assert.ok(chrome,'CHROME_PATH_MISSING');
  browser=await puppeteer.launch({
    executablePath:chrome,
    headless:'new',
    args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
  });
  receipt.browserVersion=await browser.version();
  const phone=await openProfile(browser,'PHONE');
  receipt.phone=verifyPhone(phone);
  const tablet=await openProfile(browser,'TABLET');
  receipt.tablet=verifyTablet(tablet);
  receipt.result='PASS_CLOSED';
}catch(error){
  receipt.failure=String(error?.stack||error);
  process.exitCode=1;
}finally{
  if(browser)try{await browser.close();}catch(error){
    receipt.closeFailure=String(error);
    receipt.result='FAIL_CLOSED';
    process.exitCode=1;
  }
  console.log(JSON.stringify(receipt,null,2));
}
