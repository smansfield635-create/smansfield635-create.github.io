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
const SCHEMA='AUDRALIA_TABLET_CLOUD_RESTORATION_QUALIFICATION_RECEIPT_v1';
const INDEX='showroom/globe/audralia/index.html';
const PHONE_FAP='showroom/globe/audralia/fap1-weather-presentation-v1.mjs';
const TABLET_PASS='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs';
const TABLET_RUNTIME='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs';
const PHONE_FAP_MAIN_BLOB='d4c7d230ea8ffa265cfd347629ec2e46d653726c';
const TABLET_RUNTIME_SCHEMA='AUDRALIA_TABLET_SINGLE_CONTEXT_CLOUDS_RUNTIME_v2_WORLD_FIRST';
const TABLET_IMPORT_ID='AUDRALIA_TABLET_CLOUD_RESTORATION_GEN2182_20260912';

const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const readBytes=p=>fs.readFileSync(path.join(ROOT,p));
function gitBlob(bytes){return crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');}

function count(source,re){return [...source.matchAll(re)].length;}

function staticCandidate(){
  const index=read(INDEX),phone=readBytes(PHONE_FAP),tablet=read(TABLET_PASS),runtime=read(TABLET_RUNTIME);
  assert.equal(gitBlob(phone),PHONE_FAP_MAIN_BLOB,'PHONE_FAP_PRODUCT_BYTE_DRIFT');

  assert.match(index,new RegExp(`audralia-tablet-single-context-clouds-runtime\\.mjs\\?cb=${TABLET_IMPORT_ID}`),'TABLET_LOCAL_RUNTIME_BINDING_MISSING');
  assert.match(index,/await import\('\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/weather-presentation-reconciliation\/app\.mjs\?cb=EXACT_24057'\)/,'PHONE_NONCONSTRAINED_RUNTIME_PATH_DRIFT');
  assert.match(index,/await import\('\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-weather-presentation-v1\.mjs\?cb=EXACT_24057'\)/,'PHONE_SNAPSHOT_FAP_STARTUP_DRIFT');
  assert.doesNotMatch(index,/\.\/fap1-weather-presentation-v1\.mjs\?cb=AUDRALIA_ADVANCED_CLOUD_GLOBALIZATION/,'GEN2181_PHONE_BINDING_LEAK');
  assert.match(index,/const tabletPixelBudget = 921600;/,'TABLET_PIXEL_BUDGET_DRIFT');

  assert.match(tablet,/const REST_STEPS=8;/,'TABLET_REST_STEP_DRIFT');
  assert.match(tablet,/const INTERACTION_STEPS=6;/,'TABLET_INTERACTION_STEP_DRIFT');
  assert.equal(count(tablet,/weather\+=frontSystem\(/g),5,'TABLET_FRONT_COUNT');
  assert.equal(count(tablet,/weather\+=jetSystem\(/g),4,'TABLET_JET_COUNT');
  assert.equal(count(tablet,/weather\+=cycloneSystem\(/g),2,'TABLET_CYCLONE_COUNT');
  assert.match(tablet,/vec3 advancedCloudField\(vec3 p\)/,'TABLET_ADVANCED_FIELD_MISSING');
  assert.doesNotMatch(tablet,/float globalCloudSupport\(/,'TABLET_CHEAP_GLOBAL_FIELD_REMAINS');
  assert.match(tablet,/primaryContextOnly:true,createsCanvas:false,requestsWebGLContext:false/,'TABLET_RESOURCE_CONTRACT_DRIFT');
  assert.match(tablet,/frontalSystemCount:5,jetBandSystemCount:4,cycloneSystemCount:2,totalAdvancedSystemInstances:11/,'TABLET_ADVANCED_EVIDENCE_DRIFT');
  assert.match(tablet,/rayMarchCeilingsChanged:false/,'TABLET_RAYMARCH_CEILING_DRIFT');
  assert.doesNotMatch(tablet,/createElement\(\s*['"]canvas['"]\s*\)/,'TABLET_PASS_NEW_CANVAS');
  assert.doesNotMatch(tablet,/getContext\(\s*['"]webgl2['"]\s*\)/,'TABLET_PASS_NEW_CONTEXT_REQUEST');

  assert.match(runtime,new RegExp(TABLET_RUNTIME_SCHEMA),'TABLET_WORLD_FIRST_SCHEMA_MISSING');
  assert.match(runtime,/startupSequence\.push\('PRIMARY_WORLD_RENDERED'\)/,'TABLET_WORLD_RENDER_MARKER_MISSING');
  assert.match(runtime,/startupSequence\.push\('PRIMARY_WORLD_FRAME_PRESENTED'\)/,'TABLET_WORLD_PRESENT_MARKER_MISSING');
  assert.match(runtime,/startupSequence\.push\('CLOUD_PASS_CONSTRUCTED'\)/,'TABLET_CLOUD_CONSTRUCT_MARKER_MISSING');
  assert.match(runtime,/worldRenderedBeforeCloudPass:worldBeforeCloud/,'TABLET_WORLD_FIRST_INVARIANT_MISSING');
  const init=runtime.slice(runtime.indexOf('export async function initializeAudraliaTabletSingleContextClouds'));
  const worldDraw=init.indexOf('renderer.render();');
  const paint=init.indexOf('await nextPaint();');
  const cloudConstruct=init.indexOf('createAudraliaTabletCloudPass({gl:constructed.primaryGl,worldCanvas:canvas})');
  assert.ok(worldDraw>=0&&paint>worldDraw&&cloudConstruct>paint,'TABLET_SOURCE_WORLD_FIRST_ORDER_FAILURE');
  assert.doesNotMatch(runtime,/createElement\(\s*['"]canvas['"]\s*\)/,'TABLET_RUNTIME_NEW_CANVAS');

  return Object.freeze({
    phoneProductBlob:PHONE_FAP_MAIN_BLOB,
    phoneDisposition:'KNOWN_GOOD_REFERENCE_REGRESSION_ONLY',
    tabletDisposition:'CONSTRAINED_REPAIR_TARGET',
    tabletAdvancedSystems:Object.freeze({fronts:5,jets:4,cyclones:2,total:11}),
    tabletBudgets:Object.freeze({restSteps:8,interactionSteps:6,maximumPrimaryRenderPixels:921600}),
    tabletRuntimeSchema:TABLET_RUNTIME_SCHEMA,
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
    if(gl&&/^webgl/.test(type)){
      audit.contextRequests++;
      if(!seenContexts.has(gl)){seenContexts.add(gl);audit.uniqueContexts++;}
      globalThis.__AUDRALIA_QUALIFICATION_GL__=gl;
    }
    return gl;
  };

  const P=WebGL2RenderingContext.prototype;
  const nativeShaderSource=P.shaderSource,nativeAttachShader=P.attachShader,nativeDrawArrays=P.drawArrays;
  const cloudShaders=new WeakSet(),cloudPrograms=new WeakSet();
  const summarize=(gl)=>{
    const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,total=width*height;
    const pixels=new Uint8Array(total*4);gl.finish();gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let checksum=2166136261>>>0,alpha=0,rgb=0,nonzero=0;
    for(let i=0;i<pixels.length;i+=4){
      const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
      checksum=Math.imul(checksum^r,16777619)>>>0;checksum=Math.imul(checksum^g,16777619)>>>0;checksum=Math.imul(checksum^b,16777619)>>>0;checksum=Math.imul(checksum^a,16777619)>>>0;
      alpha+=a/255;rgb+=(r+g+b)/(3*255);if(r||g||b||a)nonzero++;
    }
    return {width,height,checksum,meanAlpha:alpha/Math.max(1,total),meanRgb:rgb/Math.max(1,total),nonzeroFraction:nonzero/Math.max(1,total)};
  };
  const changedPixels=(gl,before)=>{
    const total=gl.drawingBufferWidth*gl.drawingBufferHeight,pixels=new Uint8Array(total*4);gl.finish();gl.readPixels(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let changed=0;for(let i=0,p=0;i<pixels.length;i+=4,p++)if(pixels[i]!==before[i]||pixels[i+1]!==before[i+1]||pixels[i+2]!==before[i+2]||pixels[i+3]!==before[i+3])changed++;
    return changed;
  };

  P.shaderSource=function(shader,source){
    let submitted=source;
    if(typeof source==='string'&&source.includes('vec3 advancedCloudField(vec3 p)')){
      cloudShaders.add(shader);audit.advancedShaderSubmissions++;
      const needle='vec3 cloud=advancedCloudField(p);';
      if(ablateAdvancedCloud){
        const occurrences=source.split(needle).length-1;
        if(occurrences!==1){audit.failures.push(`ABLATION_CALL_COUNT_${occurrences}`);}else{submitted=source.replace(needle,'vec3 cloud=vec3(0.0);');audit.ablationApplied=true;}
      }
    }
    return nativeShaderSource.call(this,shader,submitted);
  };
  P.attachShader=function(program,shader){if(cloudShaders.has(shader))cloudPrograms.add(program);return nativeAttachShader.call(this,program,shader);};
  P.drawArrays=function(...args){
    const program=this.getParameter(this.CURRENT_PROGRAM),relevant=cloudPrograms.has(program);
    let beforeBytes=null,beforeSummary=null;
    if(relevant){
      const width=this.drawingBufferWidth,height=this.drawingBufferHeight,total=width*height;
      beforeBytes=new Uint8Array(total*4);this.finish();this.readPixels(0,0,width,height,this.RGBA,this.UNSIGNED_BYTE,beforeBytes);beforeSummary=summarize(this);
    }
    const result=nativeDrawArrays.apply(this,args);
    if(relevant){audit.cloudDraws++;const afterSummary=summarize(this);audit.captures.push({before:beforeSummary,after:afterSummary,changedPixels:changedPixels(this,beforeBytes)});}
    return result;
  };
  globalThis.__AUDRALIA_GEN2182_AUDIT__=audit;
}

async function openVariant(browser,{profile,ablateAdvancedCloud=false}){
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
  const isTablet=profile==='TABLET';
  await page.setViewport(isTablet?{width:1280,height:800,deviceScaleFactor:2,isMobile:true,hasTouch:true}:{width:720,height:1280,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await page.evaluateOnNewDocument(installRuntimeAudit,{fixedTime:FIXED_TIME,ablateAdvancedCloud,forceTouch:true});
  try{
    await page.goto(BASE+'/showroom/globe/audralia/',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>{
      const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__;
      if(startup?.status==='FAILED')throw new Error(`STARTUP_FAILED:${startup.error}`);
      return startup?.status==='COMPLETE';
    },{timeout:120000});
    const result=await page.evaluate(profile=>{
      const startup=window.__AUDRALIA_TABLET_STARTUP_STABILITY__;
      const budget=window.__AUDRALIA_RENDER_PIXEL_BUDGET__;
      const integration=window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__;
      const audit=window.__AUDRALIA_GEN2182_AUDIT__;
      const tablet=window.__AUDRALIA_TABLET_SINGLE_CONTEXT__||null;
      const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__||null;
      return {
        profile,startup,budget,integration,audit,
        canvasCount:document.querySelectorAll('canvas').length,
        worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,
        status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
        tablet:tablet?{
          schema:tablet.schema,
          renderingMode:tablet.renderingMode,
          worldRenderedBeforeCloudPass:tablet.worldRenderedBeforeCloudPass,
          startupSequence:tablet.startupSequence,
          invariants:tablet.invariants,
          cloudEvidence:tablet.getCloudEvidence?.(),
          cloudRuntime:tablet.clouds?.getRuntime?.()
        }:null,
        phone:profile==='PHONE'?{
          schema:proof?.schema||null,
          runtimePass:proof?.getRuntime?.()?.invariants?.pass===true,
          runtimeFailures:proof?.getRuntime?.()?.invariants?.failures||[],
          hasCameraFrame:typeof proof?.getCameraFrame==='function'
        }:null
      };
    },profile);
    result.errors=errors;
    return result;
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
    assert.equal(v.audit?.uniqueContexts,1,`TABLET_${label.toUpperCase()}_AUDIT_UNIQUE_CONTEXTS`);
    assert.ok(v.audit?.advancedShaderSubmissions>=1,`TABLET_${label.toUpperCase()}_ADVANCED_SHADER_NOT_SUBMITTED`);
    assert.ok(v.audit?.cloudDraws>=1,`TABLET_${label.toUpperCase()}_ADVANCED_DRAW_MISSING`);
    assert.equal(v.audit?.failures?.length,0,`TABLET_${label.toUpperCase()}_AUDIT_FAILURE`);
  }
  assert.equal(enabled.audit.ablationApplied,false,'TABLET_ENABLED_UNEXPECTED_ABLATION');
  assert.equal(ablated.audit.ablationApplied,true,'TABLET_ABLATION_NOT_APPLIED');
  const on=enabled.audit.captures[0],off=ablated.audit.captures[0];
  assert.ok(on&&off,'TABLET_FRAMEBUFFER_CAPTURE_MISSING');
  assert.ok(on.changedPixels>0,'TABLET_ADVANCED_CLOUD_VISIBLE_CONTRIBUTION_FAILURE');
  assert.equal(off.changedPixels,0,'TABLET_ABLATION_CHANGED_FRAMEBUFFER');
  assert.notEqual(on.before.checksum,on.after.checksum,'TABLET_ENABLED_PIXEL_HASH_UNCHANGED');
  assert.equal(off.before.checksum,off.after.checksum,'TABLET_ABLATED_PIXEL_HASH_CHANGED');
  return Object.freeze({pass:true,enabledChangedPixels:on.changedPixels,ablatedChangedPixels:off.changedPixels,enabledBeforeChecksum:on.before.checksum,enabledAfterChecksum:on.after.checksum,physicalTabletStabilityClaimed:false});
}

const receipt={schema:SCHEMA,result:'FAIL_CLOSED',mechanicalOnly:true,physicalTabletStabilityClaimed:false,ownerPhysicalDeviceAcceptanceRequiredBeforePublication:true};
let browser=null;
try{
  receipt.staticEvidence=staticCandidate();
  const chrome=process.env.CHROME_PATH;assert.ok(chrome,'CHROME_PATH_MISSING');
  browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  receipt.browserVersion=await browser.version();
  const phone=await openVariant(browser,{profile:'PHONE'});
  receipt.phone=verifyPhone(phone);
  const tabletEnabled=await openVariant(browser,{profile:'TABLET',ablateAdvancedCloud:false});
  const tabletAblated=await openVariant(browser,{profile:'TABLET',ablateAdvancedCloud:true});
  receipt.tablet=verifyTablet(tabletEnabled,tabletAblated);
  receipt.tabletRuntimeEvidence={enabled:tabletEnabled.tablet,ablated:tabletAblated.tablet};
  receipt.result='PASS';
}catch(error){receipt.failure=String(error?.stack||error);process.exitCode=1;
}finally{
  if(browser)try{await browser.close();}catch(error){receipt.closeFailure=String(error);receipt.result='FAIL_CLOSED';process.exitCode=1;}
  console.log(JSON.stringify(receipt,null,2));
}
