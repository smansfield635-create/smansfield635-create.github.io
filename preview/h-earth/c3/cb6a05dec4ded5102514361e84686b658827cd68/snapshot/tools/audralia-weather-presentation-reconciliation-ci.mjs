#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BASE='http://127.0.0.1:4173';
const FIXED_TIME=Date.parse('2026-08-24T22:00:00.000Z');
const SCHEMA='AUDRALIA_TABLET_RECOVERY_V2_QUALIFICATION_RECEIPT_v1';
const INDEX='showroom/globe/audralia/index.html';
const PHONE_FAP='showroom/globe/audralia/fap1-weather-presentation-v1.mjs';
const TABLET_PASS='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs';
const TABLET_RUNTIME='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs';
const TABLET_ATLAS='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-weather-morphology-atlas-v1.mjs';
const TABLET_LOADER='showroom/globe/audralia/tablet-loader-controller-v1.mjs';
const LOCAL_MESH='showroom/globe/h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs';
const PHONE_FAP_MAIN_BLOB='d4c7d230ea8ffa265cfd347629ec2e46d653726c';
const TABLET_RUNTIME_SCHEMA='AUDRALIA_TABLET_SINGLE_CONTEXT_CLOUDS_RUNTIME_v2_WORLD_FIRST';
const TABLET_IMPORT_ID='AUDRALIA_TABLET_RECOVERY_3268_v1';

const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const readBytes=p=>fs.readFileSync(path.join(ROOT,p));
function gitBlob(bytes){return crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');}
function count(source,re){return [...source.matchAll(re)].length;}
function targetFromLatLon(lat,lon){
  const R=6200,north=[0,.5,-.8660254037844386],meridian=[0,.8660254037844386,.5],east=[1,0,0],cl=Math.cos(lat);
  const direction=[0,1,2].map(i=>east[i]*cl*Math.sin(lon)+meridian[i]*cl*Math.cos(lon)+north[i]*Math.sin(lat));
  const length=Math.hypot(...direction)||1;for(let i=0;i<3;i++)direction[i]/=length;
  const angle=Math.acos(Math.max(-1,Math.min(1,direction[1]))),sine=Math.sin(angle);
  return {targetU:Math.abs(sine)<1e-9?0:R*angle*direction[0]/sine,targetV:Math.abs(sine)<1e-9?0:R*angle*direction[2]/sine,distance:5000,pitch:1.08,yaw:0};
}
const TABLET_CAUSAL_PROBE=Object.freeze(targetFromLatLon(.593412,-1.274090));

function staticCandidate(){
  const index=read(INDEX),phone=readBytes(PHONE_FAP),tablet=read(TABLET_PASS),runtime=read(TABLET_RUNTIME),atlas=read(TABLET_ATLAS),loader=read(TABLET_LOADER),mesh=read(LOCAL_MESH);
  assert.equal(gitBlob(phone),PHONE_FAP_MAIN_BLOB,'PHONE_FAP_PRODUCT_BYTE_DRIFT');
  assert.match(index,new RegExp(`audralia-tablet-single-context-clouds-runtime\\.mjs\\?cb=${TABLET_IMPORT_ID}`),'TABLET_LOCAL_RUNTIME_BINDING_MISSING');
  assert.match(index,new RegExp(`precomputed-gratitude-mesh-v1\\.mjs\\?cb=${TABLET_IMPORT_ID}`),'TABLET_LOCAL_MESH_BINDING_MISSING');
  assert.match(index,new RegExp(`tablet-loader-controller-v1\\.mjs\\?cb=${TABLET_IMPORT_ID}`),'TABLET_LOADER_BINDING_MISSING');
  assert.match(index,/if \(!constrainedTablet\) \{\s*await import\('\.\/atmospheric-parity-v1\.mjs\?cb=AUDRALIA_FULL_ATMOSPHERIC_PARITY_3265_v1'\)/s,'PHONE_ANALYTIC_PARITY_BINDING_DRIFT');
  assert.match(index,/await import\('\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/weather-presentation-reconciliation\/app\.mjs\?cb=EXACT_24057'\)/,'PHONE_NONCONSTRAINED_RUNTIME_PATH_DRIFT');
  assert.match(index,/await import\('\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-weather-presentation-v1\.mjs\?cb=EXACT_24057'\)/,'PHONE_SNAPSHOT_FAP_STARTUP_DRIFT');
  assert.match(index,/const tabletPixelBudget = 921600;/,'TABLET_PIXEL_BUDGET_DRIFT');
  assert.match(index,/tabletAnalyticParityHotLoopDisabled: constrainedTablet/,'TABLET_HOT_LOOP_POLICY_MISSING');

  assert.match(loader,/meshChunk\(index,total\)/,'TABLET_LOADER_MESH_PROGRESS_MISSING');
  assert.match(loader,/cloudsStart\(\)/,'TABLET_LOADER_CLOUD_STAGE_MISSING');
  assert.match(loader,/celestialStart\(\)/,'TABLET_LOADER_CELESTIAL_STAGE_MISSING');
  assert.match(loader,/function fail\(label,error\)/,'TABLET_LOADER_FAILURE_SURFACE_MISSING');
  assert.match(mesh,/sameOriginCriticalPath: MESH_URLS\.every\(url => url\.origin === location\.origin\)/,'TABLET_LOCAL_MESH_EVIDENCE_MISSING');
  assert.match(mesh,/yieldBetweenChunks/,'TABLET_MESH_PAINT_YIELD_MISSING');

  assert.match(tablet,/const REST_STEPS=8;/,'TABLET_REST_STEP_DRIFT');
  assert.match(tablet,/const INTERACTION_STEPS=6;/,'TABLET_INTERACTION_STEP_DRIFT');
  assert.equal(count(tablet,/weather\+=frontSystem\(/g),5,'TABLET_FRONT_COUNT');
  assert.equal(count(tablet,/weather\+=jetSystem\(/g),4,'TABLET_JET_COUNT');
  assert.equal(count(tablet,/weather\+=cycloneSystem\(/g),2,'TABLET_CYCLONE_COUNT');
  assert.match(tablet,/uniform sampler2D uMorphologyAtlas;/,'TABLET_ATLAS_SAMPLER_MISSING');
  assert.match(tablet,/vec4 atlas=texture\(uMorphologyAtlas,uv\);/,'TABLET_ATLAS_LOOKUP_MISSING');
  assert.match(tablet,/morphologyAtlasActive:true/,'TABLET_ATLAS_EVIDENCE_MISSING');
  assert.match(tablet,/perRayAnalyticParityInjection:false/,'TABLET_ANALYTIC_HOT_LOOP_STILL_ACTIVE');
  assert.doesNotMatch(tablet,/audraliaParityCloudField/,'TABLET_ANALYTIC_PARITY_LEAK');
  assert.doesNotMatch(tablet,/float globalCloudSupport\(/,'TABLET_CHEAP_GLOBAL_FIELD_REMAINS');
  assert.match(tablet,/primaryContextOnly:true,createsCanvas:false,requestsWebGLContext:false/,'TABLET_RESOURCE_CONTRACT_DRIFT');
  assert.match(tablet,/frontalSystemCount:5,jetBandSystemCount:4,cycloneSystemCount:2,totalAdvancedSystemInstances:11/,'TABLET_ADVANCED_EVIDENCE_DRIFT');
  assert.match(tablet,/rayMarchCeilingsChanged:false/,'TABLET_RAYMARCH_CEILING_DRIFT');
  assert.doesNotMatch(tablet,/createElement\(\s*['"]canvas['"]\s*\)/,'TABLET_PASS_NEW_CANVAS');
  assert.doesNotMatch(tablet,/getContext\(\s*['"]webgl2['"]\s*\)/,'TABLET_PASS_NEW_CONTEXT_REQUEST');

  assert.match(atlas,/const WIDTH=512;/,'TABLET_ATLAS_WIDTH_DRIFT');
  assert.match(atlas,/const HEIGHT=256;/,'TABLET_ATLAS_HEIGHT_DRIFT');
  assert.match(atlas,/primaryContextOnly:true,newCanvasCreated:false,newWebGLContextRequested:false/,'TABLET_ATLAS_RESOURCE_CONTRACT_DRIFT');
  assert.match(atlas,/clearAirWindowsPreserved:true/,'TABLET_ATLAS_CLEAR_WINDOWS_MISSING');
  assert.doesNotMatch(atlas,/getContext\(/,'TABLET_ATLAS_CONTEXT_REQUEST');
  assert.doesNotMatch(atlas,/createElement\(\s*['"]canvas['"]\s*\)/,'TABLET_ATLAS_NEW_CANVAS');

  assert.match(runtime,new RegExp(TABLET_RUNTIME_SCHEMA),'TABLET_WORLD_FIRST_SCHEMA_MISSING');
  assert.match(runtime,/startupSequence\.push\('PRIMARY_WORLD_RENDERED'\)/,'TABLET_WORLD_RENDER_MARKER_MISSING');
  assert.match(runtime,/startupSequence\.push\('PRIMARY_WORLD_FRAME_PRESENTED'\)/,'TABLET_WORLD_PRESENT_MARKER_MISSING');
  assert.match(runtime,/startupSequence\.push\('CLOUD_PASS_CONSTRUCTED'\)/,'TABLET_CLOUD_CONSTRUCT_MARKER_MISSING');
  assert.match(runtime,/worldRenderedBeforeCloudPass:worldBeforeCloud/,'TABLET_WORLD_FIRST_INVARIANT_MISSING');
  const init=runtime.slice(runtime.indexOf('export async function initializeAudraliaTabletSingleContextClouds'));
  const worldDraw=init.indexOf('renderer.render();'),paint=init.indexOf('await nextPaint();'),cloudConstruct=init.indexOf('createAudraliaTabletCloudPass({gl:constructed.primaryGl,worldCanvas:canvas})');
  assert.ok(worldDraw>=0&&paint>worldDraw&&cloudConstruct>paint,'TABLET_SOURCE_WORLD_FIRST_ORDER_FAILURE');
  assert.doesNotMatch(runtime,/createElement\(\s*['"]canvas['"]\s*\)/,'TABLET_RUNTIME_NEW_CANVAS');

  return Object.freeze({
    phoneProductBlob:PHONE_FAP_MAIN_BLOB,
    phoneDisposition:'KNOWN_GOOD_REFERENCE_REGRESSION_ONLY',
    tabletDisposition:'CONSTRAINED_RECOVERY_TARGET',
    tabletAdvancedSystems:Object.freeze({fronts:5,jets:4,cyclones:2,total:11}),
    tabletMorphologyAtlas:Object.freeze({width:512,height:256,analyticHotLoop:false}),
    tabletBudgets:Object.freeze({restSteps:8,interactionSteps:6,maximumPrimaryRenderPixels:921600}),
    tabletRuntimeSchema:TABLET_RUNTIME_SCHEMA,
    tabletCausalProbe:TABLET_CAUSAL_PROBE,
    physicalTabletStabilityClaimed:false
  });
}

function installRuntimeAudit({fixedTime,ablateAdvancedCloud,forceTouch}){
  const NativeDate=Date;
  class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:[fixedTime]));}static now(){return fixedTime;}}
  Object.setPrototypeOf(FixedDate,NativeDate);globalThis.Date=FixedDate;
  if(forceTouch){try{Object.defineProperty(navigator,'maxTouchPoints',{configurable:true,get:()=>5});}catch{}}

  const audit={contextRequests:0,uniqueContexts:0,advancedShaderSubmissions:0,ablationApplied:false,cloudDraws:0,captures:[],failures:[]};
  const seenContexts=new WeakSet();
  const originalGetContext=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,attributes){
    const gl=originalGetContext.call(this,type,attributes);
    if(gl&&/^webgl/.test(type)){audit.contextRequests++;if(!seenContexts.has(gl)){seenContexts.add(gl);audit.uniqueContexts++;}globalThis.__AUDRALIA_QUALIFICATION_GL__=gl;}
    return gl;
  };

  const P=WebGL2RenderingContext.prototype;
  const nativeShaderSource=P.shaderSource,nativeAttachShader=P.attachShader,nativeDrawArrays=P.drawArrays;
  const cloudShaders=new WeakSet(),cloudPrograms=new WeakSet();
  const summarize=gl=>{
    const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,total=width*height,pixels=new Uint8Array(total*4);gl.finish();gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let checksum=2166136261>>>0,alpha=0,rgb=0,nonzero=0;
    for(let i=0;i<pixels.length;i+=4){const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];checksum=Math.imul(checksum^r,16777619)>>>0;checksum=Math.imul(checksum^g,16777619)>>>0;checksum=Math.imul(checksum^b,16777619)>>>0;checksum=Math.imul(checksum^a,16777619)>>>0;alpha+=a/255;rgb+=(r+g+b)/(3*255);if(r||g||b||a)nonzero++;}
    return {width,height,checksum,meanAlpha:alpha/Math.max(1,total),meanRgb:rgb/Math.max(1,total),nonzeroFraction:nonzero/Math.max(1,total)};
  };
  const readFrame=gl=>{const total=gl.drawingBufferWidth*gl.drawingBufferHeight,pixels=new Uint8Array(total*4);gl.finish();gl.readPixels(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,pixels);return pixels;};
  const changedPixels=(after,before)=>{let changed=0;for(let i=0;i<after.length;i+=4)if(after[i]!==before[i]||after[i+1]!==before[i+1]||after[i+2]!==before[i+2]||after[i+3]!==before[i+3])changed++;return changed;};

  P.shaderSource=function(shader,source){
    let submitted=source;
    if(typeof source==='string'&&source.includes('vec3 advancedCloudField(vec3 p)')){
      cloudShaders.add(shader);audit.advancedShaderSubmissions++;
      const needle='vec3 cloud=advancedCloudField(p);';
      if(ablateAdvancedCloud){const occurrences=source.split(needle).length-1;if(occurrences!==1)audit.failures.push(`ABLATION_CALL_COUNT_${occurrences}`);else{submitted=source.replace(needle,'vec3 cloud=vec3(0.0);');audit.ablationApplied=true;}}
    }
    return nativeShaderSource.call(this,shader,submitted);
  };
  P.attachShader=function(program,shader){if(cloudShaders.has(shader))cloudPrograms.add(program);return nativeAttachShader.call(this,program,shader);};
  P.drawArrays=function(...args){
    const program=this.getParameter(this.CURRENT_PROGRAM),relevant=cloudPrograms.has(program);
    let beforeBytes=null,beforeSummary=null;
    if(relevant){beforeBytes=readFrame(this);beforeSummary=summarize(this);}
    const result=nativeDrawArrays.apply(this,args);
    if(relevant){audit.cloudDraws++;const afterBytes=readFrame(this),afterSummary=summarize(this);audit.captures.push({before:beforeSummary,after:afterSummary,changedPixels:changedPixels(afterBytes,beforeBytes)});}
    return result;
  };
  globalThis.__AUDRALIA_GEN2182_AUDIT__=audit;
}

async function openVariant(browser,{profile,ablateAdvancedCloud=false}){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
  const isTablet=profile==='TABLET';
  await page.setViewport(isTablet?{width:1280,height:800,deviceScaleFactor:2,isMobile:true,hasTouch:true}:{width:720,height:1280,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await page.evaluateOnNewDocument(installRuntimeAudit,{fixedTime:FIXED_TIME,ablateAdvancedCloud,forceTouch:true});
  try{
    await page.goto(BASE+'/showroom/globe/audralia/',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>{const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__;if(startup?.status==='FAILED')throw new Error(`STARTUP_FAILED:${startup.error}`);return startup?.status==='COMPLETE';},{timeout:120000});
    if(isTablet){
      await page.evaluate(probe=>{
        const runtime=window.__AUDRALIA_TABLET_SINGLE_CONTEXT__;
        if(!runtime?.renderer?.state||!runtime?.clouds?.render||typeof runtime.getCameraFrame!=='function')throw new Error('TABLET_CAUSAL_PROBE_CONTROL_MISSING');
        Object.assign(runtime.renderer.state,probe);runtime.renderer.render();runtime.clouds.endInteraction();runtime.clouds.render(runtime.getCameraFrame());
      },TABLET_CAUSAL_PROBE);
    }
    const result=await page.evaluate(profile=>{
      const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__,budget=window.__AUDRALIA_RENDER_PIXEL_BUDGET__,integration=window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__,audit=window.__AUDRALIA_GEN2182_AUDIT__,tablet=window.__AUDRALIA_TABLET_SINGLE_CONTEXT__||null,proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__||null,loader=window.__AUDRALIA_TABLET_LOADER_CONTROLLER__||null;
      return {profile,startup,budget,integration,audit,loaderPresent:!!loader,loaderHidden:document.querySelector('[data-audralia-loader]')?.hidden===true,canvasCount:document.querySelectorAll('canvas').length,worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,tablet:tablet?{schema:tablet.schema,renderingMode:tablet.renderingMode,worldRenderedBeforeCloudPass:tablet.worldRenderedBeforeCloudPass,startupSequence:tablet.startupSequence,invariants:tablet.invariants,cloudEvidence:tablet.getCloudEvidence?.(),cloudRuntime:tablet.clouds?.getRuntime?.()}:null,phone:profile==='PHONE'?{schema:proof?.schema||null,runtimePass:proof?.getRuntime?.()?.invariants?.pass===true,runtimeFailures:proof?.getRuntime?.()?.invariants?.failures||[],hasCameraFrame:typeof proof?.getCameraFrame==='function'}:null};
    },profile);
    result.errors=errors;return result;
  }finally{await page.close();}
}

function verifyPhone(phone){
  assert.equal(phone.errors.length,0,'PHONE_PAGE_ERROR');
  assert.equal(phone.budget?.active,false,'PHONE_WRONGLY_ENTERED_CONSTRAINED_PATH');
  assert.equal(phone.tablet,null,'PHONE_TABLET_RUNTIME_PRESENT');
  assert.equal(phone.phone?.runtimePass,true,'PHONE_RUNTIME_REGRESSION');
  assert.equal(phone.phone?.hasCameraFrame,true,'PHONE_CAMERA_RUNTIME_REGRESSION');
  assert.equal(phone.worldCanvasCount,1,'PHONE_WORLD_CANVAS_COUNT');
  return Object.freeze({pass:true,disposition:'REGRESSION_REFERENCE_ONLY_NO_ORIGINAL_DEFECT_CLAIM'});
}

function verifyTablet(enabled,ablated){
  for(const [label,v] of [['enabled',enabled],['ablated',ablated]]){
    assert.equal(v.errors.length,0,`TABLET_${label.toUpperCase()}_PAGE_ERROR`);
    assert.equal(v.budget?.active,true,`TABLET_${label.toUpperCase()}_NOT_CONSTRAINED`);
    assert.equal(v.budget?.maximumPrimaryRenderPixels,921600,`TABLET_${label.toUpperCase()}_PIXEL_BUDGET`);
    assert.equal(v.loaderPresent,true,`TABLET_${label.toUpperCase()}_LOADER_CONTROLLER_MISSING`);
    assert.equal(v.loaderHidden,true,`TABLET_${label.toUpperCase()}_LOADER_NOT_DISMISSED`);
    assert.equal(v.tablet?.schema,TABLET_RUNTIME_SCHEMA,`TABLET_${label.toUpperCase()}_RUNTIME_SCHEMA`);
    assert.equal(v.tablet?.worldRenderedBeforeCloudPass,true,`TABLET_${label.toUpperCase()}_WORLD_FIRST`);
    assert.deepEqual(v.tablet?.startupSequence,['PRIMARY_CONTEXT_READY','PRIMARY_WORLD_RENDERED','PRIMARY_WORLD_FRAME_PRESENTED','CLOUD_PASS_CONSTRUCTED','CLOUD_FIRST_DRAW'],`TABLET_${label.toUpperCase()}_STARTUP_SEQUENCE`);
    assert.equal(v.tablet?.invariants?.pass,true,`TABLET_${label.toUpperCase()}_INVARIANTS`);
    assert.equal(v.tablet?.invariants?.singleWebGLContext,true,`TABLET_${label.toUpperCase()}_SINGLE_CONTEXT`);
    assert.equal(v.tablet?.invariants?.webgl2ContextRequests,1,`TABLET_${label.toUpperCase()}_CONTEXT_REQUESTS`);
    assert.equal(v.tablet?.invariants?.additionalCanvasCount,0,`TABLET_${label.toUpperCase()}_ADDITIONAL_CANVAS`);
    assert.equal(v.tablet?.cloudEvidence?.primaryContextOnly,true,`TABLET_${label.toUpperCase()}_CLOUD_PRIMARY_CONTEXT`);
    assert.equal(v.tablet?.cloudEvidence?.createsCanvas,false,`TABLET_${label.toUpperCase()}_CLOUD_CREATED_CANVAS`);
    assert.equal(v.tablet?.cloudEvidence?.requestsWebGLContext,false,`TABLET_${label.toUpperCase()}_CLOUD_CONTEXT_REQUEST`);
    assert.equal(v.tablet?.cloudEvidence?.restStepCount,8,`TABLET_${label.toUpperCase()}_REST_STEPS`);
    assert.equal(v.tablet?.cloudEvidence?.interactionStepCount,6,`TABLET_${label.toUpperCase()}_INTERACTION_STEPS`);
    assert.equal(v.tablet?.cloudEvidence?.totalAdvancedSystemInstances,11,`TABLET_${label.toUpperCase()}_ADVANCED_SYSTEM_COUNT`);
    assert.equal(v.tablet?.cloudEvidence?.morphologyAtlasActive,true,`TABLET_${label.toUpperCase()}_MORPHOLOGY_ATLAS_INACTIVE`);
    assert.equal(v.tablet?.cloudEvidence?.perRayAnalyticParityInjection,false,`TABLET_${label.toUpperCase()}_ANALYTIC_HOT_LOOP_ACTIVE`);
    assert.equal(v.tablet?.cloudEvidence?.morphologyAtlas?.width,512,`TABLET_${label.toUpperCase()}_ATLAS_WIDTH`);
    assert.equal(v.tablet?.cloudEvidence?.morphologyAtlas?.height,256,`TABLET_${label.toUpperCase()}_ATLAS_HEIGHT`);
    assert.equal(v.audit?.uniqueContexts,1,`TABLET_${label.toUpperCase()}_AUDIT_UNIQUE_CONTEXTS`);
    assert.ok(v.audit?.advancedShaderSubmissions>=1,`TABLET_${label.toUpperCase()}_ADVANCED_SHADER_NOT_SUBMITTED`);
    assert.ok(v.audit?.cloudDraws>=2,`TABLET_${label.toUpperCase()}_ADVANCED_DRAW_MISSING`);
    assert.equal(v.audit?.failures?.length,0,`TABLET_${label.toUpperCase()}_AUDIT_FAILURE`);
  }
  assert.equal(enabled.audit.ablationApplied,false,'TABLET_ENABLED_UNEXPECTED_ABLATION');
  assert.equal(ablated.audit.ablationApplied,true,'TABLET_ABLATION_NOT_APPLIED');
  const on=[...enabled.audit.captures].sort((a,b)=>b.changedPixels-a.changedPixels)[0],offMax=Math.max(...ablated.audit.captures.map(c=>c.changedPixels));
  assert.ok(on,'TABLET_FRAMEBUFFER_CAPTURE_MISSING');
  assert.ok(on.changedPixels>0,'TABLET_ADVANCED_CLOUD_VISIBLE_CONTRIBUTION_FAILURE');
  assert.equal(offMax,0,'TABLET_ABLATION_CHANGED_FRAMEBUFFER');
  assert.notEqual(on.before.checksum,on.after.checksum,'TABLET_ENABLED_PIXEL_HASH_UNCHANGED');
  return Object.freeze({pass:true,enabledChangedPixels:on.changedPixels,ablatedMaxChangedPixels:offMax,enabledBeforeChecksum:on.before.checksum,enabledAfterChecksum:on.after.checksum,causalProbe:TABLET_CAUSAL_PROBE,physicalTabletStabilityClaimed:false});
}

const receipt={schema:SCHEMA,result:'FAIL_CLOSED',mechanicalOnly:true,physicalTabletStabilityClaimed:false,ownerPhysicalDeviceAcceptanceRequiredAfterPublication:true};
let browser=null;
try{
  receipt.staticEvidence=staticCandidate();
  const chrome=process.env.CHROME_PATH;assert.ok(chrome,'CHROME_PATH_MISSING');
  browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  receipt.browserVersion=await browser.version();
  const phone=await openVariant(browser,{profile:'PHONE'});receipt.phone=verifyPhone(phone);
  const tabletEnabled=await openVariant(browser,{profile:'TABLET',ablateAdvancedCloud:false}),tabletAblated=await openVariant(browser,{profile:'TABLET',ablateAdvancedCloud:true});
  receipt.tablet=verifyTablet(tabletEnabled,tabletAblated);receipt.tabletRuntimeEvidence={enabled:tabletEnabled.tablet,ablated:tabletAblated.tablet};receipt.result='PASS';
}catch(error){receipt.failure=String(error?.stack||error);process.exitCode=1;
}finally{
  if(browser)try{await browser.close();}catch(error){receipt.closeFailure=String(error);receipt.result='FAIL_CLOSED';process.exitCode=1;}
  console.log(JSON.stringify(receipt,null,2));
}
