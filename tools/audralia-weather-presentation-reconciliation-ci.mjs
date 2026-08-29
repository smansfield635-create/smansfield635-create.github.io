#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const base='http://127.0.0.1:4173';
const chrome=process.env.CHROME_PATH;
if(!chrome)throw new Error('CHROME_PATH_MISSING');

const INDEX='showroom/globe/audralia/index.html';
const COMPOSITOR='showroom/globe/audralia/final-cloud-shader-composition-v1.mjs';
const DIRECT_FAP1=['showroom','globe','audralia','fap1-weather-presentation-v1.mjs'].join('/');
const SNAPSHOT_FAP1=['inspection','audralia-24057-exact','snapshot','showroom','globe','audralia','fap1-weather-presentation-v1.mjs'].join('/');
const SNAPSHOT_RENDERER=['inspection','audralia-24057-exact','snapshot','showroom','globe','audralia','weather-presentation-reconciliation','exterior-weather.mjs'].join('/');
const POLICY_ID='AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION_v1';
const LIVE_SCHEMA='AUDRALIA_LIVE_PLANETARY_INTEGRATION_v8_FINAL_CLOUD_COMPOSITION';
const FIXED_TIME_MS=Date.parse('2026-08-24T22:00:00.000Z');
const MATRIX_OVERALL_MS=9*60*1000;
const MATRIX_NO_PROGRESS_MS=45*1000;
const PAGE_READY_DEADLINE_MS=120*1000;
const GESTURE_STEP_DEADLINE_MS=15*1000;
const CAMERA_STEP_DEADLINE_MS=8*1000;

function createSemanticRuntimeGuard({overallMs=9*60*1000,noProgressMs=45*1000,pollMs=250,logger=entry=>console.log(JSON.stringify(entry))}={}){
  const started=Date.now();let lastProgressAt=started,lastCheckpoint=Object.freeze({profile:null,station:null,phase:'MATRIX_START',detail:null,elapsedMs:0}),sequence=0;
  function checkpoint({profile=null,station=null,phase,detail=null}={}){const now=Date.now();lastProgressAt=now;lastCheckpoint=Object.freeze({profile,station,phase:String(phase||'UNKNOWN'),detail,elapsedMs:now-started,sequence:++sequence});logger(Object.freeze({schema:'AUDRALIA_GESTURE_MATRIX_PROGRESS_v1',...lastCheckpoint}));return lastCheckpoint;}
  function snapshot(){const now=Date.now();return Object.freeze({startedAtMs:started,elapsedMs:now-started,lastProgressAgeMs:now-lastProgressAt,lastCheckpoint,overallMs,noProgressMs});}
  function failure(code,active,state=null){const receipt=Object.freeze({schema:'AUDRALIA_GESTURE_MATRIX_RUNTIME_TERMINATION_RECEIPT_v1',result:'FAIL',errorCode:code,active:Object.freeze({...active}),guard:snapshot(),browserState:state});const error=new Error(`${code} ${JSON.stringify(receipt)}`);error.code=code;error.receipt=receipt;return error;}
  async function runStep({profile=null,station=null,phase,deadlineMs=15000,task,stateProbe=null}){const active=Object.freeze({profile,station,phase}),stepStarted=Date.now();checkpoint({profile,station,phase:`${phase}:START`});let monitor,rejectMonitor;const monitorPromise=new Promise((_,reject)=>{rejectMonitor=reject;});const inspect=async code=>{let state=null;if(stateProbe){try{state=await stateProbe();}catch(error){state={probeError:String(error?.message||error)};}}rejectMonitor(failure(code,active,state));};monitor=setInterval(()=>{const now=Date.now();if(now-started>=overallMs){clearInterval(monitor);void inspect('MATRIX_OVERALL_RUNTIME_CEILING');return;}if(now-stepStarted>=deadlineMs){clearInterval(monitor);void inspect('STEP_DEADLINE_EXCEEDED');return;}if(now-lastProgressAt>=noProgressMs){clearInterval(monitor);void inspect('SEMANTIC_NO_PROGRESS_WATCHDOG');}},Math.max(5,pollMs));try{const value=await Promise.race([Promise.resolve().then(task),monitorPromise]);checkpoint({profile,station,phase:`${phase}:PASS`});return value;}finally{clearInterval(monitor);}}
  checkpoint({phase:'MATRIX_START'});return Object.freeze({checkpoint,runStep,snapshot});
}

const REQUIRED_STAGES=Object.freeze(['FAP1_ORGANIZED_WEATHER_V6','XYZ_VOLUMETRIC_DEPTH_V2','ACF1_PRESENTATION_V3','DIRECT_DENSITY_V4']);
const V6_FAMILIES=Object.freeze(['CIRRUS_FIELD','CIRROSTRATUS_VEIL','ALTOCUMULUS_FIELD']);

function staticCandidate(){
  const index=fs.readFileSync(INDEX,'utf8');
  const compositor=fs.readFileSync(COMPOSITOR,'utf8');
  const directFap1=fs.readFileSync(DIRECT_FAP1,'utf8');
  const snapshotFap1=fs.readFileSync(SNAPSHOT_FAP1,'utf8');
  const renderer=fs.readFileSync(SNAPSHOT_RENDERER,'utf8');
  assert.equal(directFap1,snapshotFap1,'FAP1_SOURCE_SNAPSHOT_BYTE_PARITY_FAILURE');
  assert.match(index,new RegExp(LIVE_SCHEMA),'LIVE_FINAL_COMPOSITION_SCHEMA_MISSING');
  assert.match(index,/final-cloud-shader-composition-v1\.mjs\?cb=AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION_v1/,'FINAL_COMPOSITOR_REQUEST_IDENTITY_MISSING');
  assert.doesNotMatch(index,/type="module" src="\.\/fap1-orbital-support-tuning-v1\.mjs/,'LEGACY_DIRECT_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/acf1-cloud-presentation-v1\.mjs/,'LEGACY_ACF1_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-xyz-volumetric-depth-v1\.mjs/,'LEGACY_XYZ_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-weather-presentation-v1\.mjs/,'LEGACY_FAP1_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.match(compositor,new RegExp(POLICY_ID),'FINAL_COMPOSITOR_POLICY_MISSING');
  assert.match(compositor,/AUDRALIA_FINAL_DIRECT_DENSITY_SUPPORT_v1/,'FINAL_DIRECT_DENSITY_REPAIR_MISSING');
  assert.match(compositor,/cloudAblation/,'V6_ABLATION_CONTROL_MISSING');
  assert.match(compositor,/FINAL_CLOUD_SHADER_GLSL_VERSION_NOT_FIRST_LINE/,'FINAL_GLSL_VERSION_ORDER_GUARD_MISSING');
  for(const stage of REQUIRED_STAGES)assert.match(compositor,new RegExp(stage),`FINAL_STAGE_DECLARATION_MISSING:${stage}`);
  for(const family of V6_FAMILIES)assert.match(snapshotFap1,new RegExp(family),`V6_FAMILY_SOURCE_MISSING:${family}`);
  assert.match(renderer,/const REST_STEPS=32,INTERACTION_STEPS=15,REST_MAX_PIXELS=230000,INTERACTION_MAX_PIXELS=90000;/,'FINAL_COMPOSITION_PERFORMANCE_CEILINGS_CHANGED');
  assert.match(renderer,/uSysA\[8\]/,'FINAL_COMPOSITION_NATIVE_SYSTEM_ARRAY_CHANGED');
  assert.doesNotMatch(compositor,/createElement\(\s*['"]canvas['"]\s*\)/,'FINAL_COMPOSITOR_ADDITIONAL_CANVAS_SOURCE_DETECTED');
  assert.doesNotMatch(compositor,/new\s+OffscreenCanvas\s*\(/,'FINAL_COMPOSITOR_OFFSCREEN_CANVAS_SOURCE_DETECTED');
  return Object.freeze({policyId:POLICY_ID,liveSchema:LIVE_SCHEMA,fap1ByteParity:true,requiredStages:REQUIRED_STAGES,v6Families:V6_FAMILIES,glslVersionFirstLineGuard:true,frozenPerformanceCeilings:true,additionalRenderCanvasSource:false});
}

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForAuthoritativeRuntime(page,{timeout=105000,label='runtime',progress=null}={}){
  const started=Date.now();
  let last=null,lastSignature=null;
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
    const signature=JSON.stringify([last.reconciliationPresent,last.runtimePresent,last.pass,last.loaderProgress,last.loaderStage,last.status,last.failures]);
    if(signature!==lastSignature){lastSignature=signature;progress?.(last);}
    if(last.reconciliationError)throw new Error(`${label.toUpperCase()}_RECONCILIATION_ERROR ${JSON.stringify(last)}`);
    if(last.pass)return last;
    await sleep(250);
  }
  throw new Error(`${label.toUpperCase()}_AUTHORITATIVE_RUNTIME_TIMEOUT ${JSON.stringify(last)}`);
}

async function waitForComposition(page,{timeout=20000,label='composition'}={}){
  const started=Date.now();
  let last=null;
  while(Date.now()-started<timeout){
    last=await page.evaluate(()=>{const c=window.__AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION__;return {present:Boolean(c),policyId:c?.policyId||null,evidence:c?.getRuntimeEvidence?.()||null};});
    const ev=last?.evidence;
    if(last.present&&ev?.composedCloudShaders>=1&&typeof ev?.finalShaderSha256==='string'&&ev.finalShaderSha256.length===64&&ev?.finalStageEvidence?.pass===true)return last;
    await sleep(100);
  }
  throw new Error(`${label.toUpperCase()}_FINAL_COMPOSITION_TIMEOUT ${JSON.stringify(last)}`);
}

function installErrorCapture(page){const pageErrors=[],consoleErrors=[];page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});return {pageErrors,consoleErrors};}
function targetFromLatLon(lat,lon){
  const R=6200,north=[0,.5,-.8660254037844386],meridian=[0,.8660254037844386,.5],east=[1,0,0],cl=Math.cos(lat);
  const direction=[0,1,2].map(i=>east[i]*cl*Math.sin(lon)+meridian[i]*cl*Math.cos(lon)+north[i]*Math.sin(lat));
  const length=Math.hypot(...direction)||1;for(let i=0;i<3;i++)direction[i]/=length;
  const angle=Math.acos(Math.max(-1,Math.min(1,direction[1]))),sine=Math.sin(angle);if(Math.abs(sine)<1e-9)return {targetU:0,targetV:0};
  return {targetU:R*angle*direction[0]/sine,targetV:R*angle*direction[2]/sine};
}
const PROBES=Object.freeze([
  Object.freeze({id:'CIRRUS_A',...targetFromLatLon(.610865,-2.827433),distance:5000,pitch:1.08,yaw:0}),
  Object.freeze({id:'CIRROSTRATUS_B',...targetFromLatLon(-.191986,.872665),distance:5000,pitch:1.08,yaw:.34}),
  Object.freeze({id:'ALTOCUMULUS_C',...targetFromLatLon(.733038,1.745329),distance:5000,pitch:1.08,yaw:-.28}),
  Object.freeze({id:'CIRRUS_C_NEAR_GRATITUDE',...targetFromLatLon(.209440,.191986),distance:5000,pitch:1.08,yaw:.18})
]);

async function captureExteriorMetrics(page,probe){
  return page.evaluate(async probe=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;if(!proof?.setCameraStateForTest)throw new Error('FINAL_FRAME_PROOF_CAMERA_CONTROL_MISSING');
    const state={targetU:probe.targetU,targetV:probe.targetV,distance:probe.distance,pitch:probe.pitch,yaw:probe.yaw};proof.setCameraStateForTest(state);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));proof.setCameraStateForTest(state);
    const canvas=proof.exterior?.overlay;if(!(canvas instanceof HTMLCanvasElement))throw new Error('FINAL_FRAME_EXTERIOR_CANVAS_MISSING');const gl=canvas.getContext('webgl2');if(!gl)throw new Error('FINAL_FRAME_EXTERIOR_WEBGL2_MISSING');gl.finish();
    const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,total=width*height;if(total<=0)throw new Error('FINAL_FRAME_EMPTY_DRAWING_BUFFER');const pixels=new Uint8Array(total*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let alphaNonzero=0,alphaStrong=0,alphaSum=0,rgbSum=0,weightedChecksum=0;for(let i=0,p=0;i<pixels.length;i+=4,p++){const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];if(a>8)alphaNonzero++;if(a>32)alphaStrong++;alphaSum+=a/255;rgbSum+=(r+g+b)/(3*255);weightedChecksum=(weightedChecksum+((p%65521)+1)*(r+3*g+7*b+11*a))%2147483647;}
    const camera=proof.renderer?.getSnapshot?.()||null;return {id:probe.id,width,height,nonzeroFraction:alphaNonzero/total,strongFraction:alphaStrong/total,meanAlpha:alphaSum/total,meanRgb:rgbSum/total,weightedChecksum,camera};
  },probe);
}

async function captureVariant(browser,{ablateV6=false}={}){
  const page=await browser.newPage();await page.setViewport({width:720,height:1280,deviceScaleFactor:1});
  await page.evaluateOnNewDocument(fixed=>{const NativeDate=Date;class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}}Object.setPrototypeOf(FixedDate,NativeDate);globalThis.Date=FixedDate;},FIXED_TIME_MS);
  const errors=installErrorCapture(page),suffix=ablateV6?'?cloudAblation=v6':'';await page.goto(`${base}/showroom/globe/audralia/${suffix}`,{waitUntil:'domcontentloaded',timeout:60000});
  const authoritative=await waitForAuthoritativeRuntime(page,{label:ablateV6?'ablated':'enabled'}),composition=await waitForComposition(page,{label:ablateV6?'ablated_composition':'enabled_composition'});
  const live=await page.evaluate(()=>({integration:window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__,status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,canvasCount:document.querySelectorAll('canvas').length,composition:window.__AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION__?.getRuntimeEvidence?.()||null}));
  const probes=[];for(const probe of PROBES)probes.push(await captureExteriorMetrics(page,probe));await page.close();return Object.freeze({ablateV6,authoritative,composition,live,probes,errors});
}

function compareCausality(enabled,ablated){
  assert.equal(enabled.probes.length,ablated.probes.length,'FRAMEBUFFER_PROBE_COUNT_MISMATCH');
  const probes=enabled.probes.map((on,index)=>{const off=ablated.probes[index];assert.equal(on.id,off.id,'FRAMEBUFFER_PROBE_ID_MISMATCH');assert.equal(on.width,off.width,'FRAMEBUFFER_WIDTH_MISMATCH');assert.equal(on.height,off.height,'FRAMEBUFFER_HEIGHT_MISMATCH');return Object.freeze({id:on.id,enabled:on,ablated:off,delta:Object.freeze({nonzeroFraction:on.nonzeroFraction-off.nonzeroFraction,strongFraction:on.strongFraction-off.strongFraction,meanAlpha:on.meanAlpha-off.meanAlpha,meanRgb:on.meanRgb-off.meanRgb,checksumDifferent:on.weightedChecksum!==off.weightedChecksum})});});
  const positive=probes.filter(p=>p.delta.meanAlpha>0&&p.delta.checksumDifferent),material=probes.filter(p=>p.delta.meanAlpha>=.0015&&(p.delta.nonzeroFraction>=.002||p.delta.strongFraction>=.002)),maxMeanAlphaDelta=Math.max(...probes.map(p=>p.delta.meanAlpha)),maxCoverageDelta=Math.max(...probes.map(p=>Math.max(p.delta.nonzeroFraction,p.delta.strongFraction)));
  return Object.freeze({probes:Object.freeze(probes),positiveProbeCount:positive.length,materialProbeCount:material.length,maxMeanAlphaDelta,maxCoverageDelta,pass:positive.length>=2&&material.length>=1&&maxMeanAlphaDelta>=.0015&&maxCoverageDelta>=.002});
}

const GESTURE_PROFILES=Object.freeze([Object.freeze({id:'PHONE',width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true}),Object.freeze({id:'TABLET',width:820,height:1180,deviceScaleFactor:1,isMobile:true,hasTouch:true}),Object.freeze({id:'DESKTOP',width:1440,height:900,deviceScaleFactor:1,isMobile:false,hasTouch:true})]);
const PLANET_RADIUS=6200;
const TRAVEL_STATIONS=Object.freeze([Object.freeze({id:'ILLUMINATED',targetU:0,targetV:1500}),Object.freeze({id:'TERMINATOR',targetU:0,targetV:PLANET_RADIUS*Math.PI*.72}),Object.freeze({id:'NEAR_ANTIPODE',targetU:0,targetV:PLANET_RADIUS*Math.PI-650}),Object.freeze({id:'DARK_SIDE',targetU:0,targetV:PLANET_RADIUS*Math.PI+900}),Object.freeze({id:'BEYOND',targetU:0,targetV:PLANET_RADIUS*Math.PI*1.45})]);

async function dispatchTouch(client,type,points){await client.send('Input.dispatchTouchEvent',{type,touchPoints:points.map((point,index)=>({x:point.x,y:point.y,radiusX:2,radiusY:2,force:1,id:index+1})),modifiers:0});}
async function realTwoFingerSwipe(page,{dy=-110,spreadDelta=0}={}){const client=await page.target().createCDPSession();try{const box=await page.$eval('[data-h-earth-map-wide-canvas]',el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});const cx=box.x+box.width*.5,cy=box.y+box.height*.56,start=[{x:cx-38,y:cy},{x:cx+38,y:cy}];await dispatchTouch(client,'touchStart',start);const m1=[{x:start[0].x-spreadDelta*.25,y:start[0].y+dy*.18},{x:start[1].x+spreadDelta*.25,y:start[1].y+dy*.18}],m2=[{x:start[0].x-spreadDelta*.5,y:start[0].y+dy*.62},{x:start[1].x+spreadDelta*.5,y:start[1].y+dy*.62}],m3=[{x:start[0].x-spreadDelta,y:start[0].y+dy},{x:start[1].x+spreadDelta,y:start[1].y+dy}];await dispatchTouch(client,'touchMove',m1);await sleep(24);await dispatchTouch(client,'touchMove',m2);await sleep(24);await dispatchTouch(client,'touchMove',m3);await sleep(24);await dispatchTouch(client,'touchEnd',[]);await sleep(50);}finally{await client.detach().catch(()=>{});}}
async function realOneFingerLook(page,{dx=65,dy=30}={}){const client=await page.target().createCDPSession();try{const box=await page.$eval('[data-h-earth-map-wide-canvas]',el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}),start={x:box.x+box.width*.5,y:box.y+box.height*.52};await dispatchTouch(client,'touchStart',[start]);await dispatchTouch(client,'touchMove',[{x:start.x+dx*.45,y:start.y+dy*.45}]);await sleep(20);await dispatchTouch(client,'touchMove',[{x:start.x+dx,y:start.y+dy}]);await sleep(20);await dispatchTouch(client,'touchEnd',[]);await sleep(50);}finally{await client.detach().catch(()=>{});}}
async function cameraSnapshot(page){return page.evaluate(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.renderer?.getSnapshot?.()||null);}
function targetDelta(a,b){return Math.hypot((b?.targetU??0)-(a?.targetU??0),(b?.targetV??0)-(a?.targetV??0));}
async function browserState(page){return page.evaluate(()=>({url:location.href,readyState:document.readyState,loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),loaderStage:document.querySelector('[data-audralia-loader-stage]')?.textContent?.trim()||null,status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,camera:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.renderer?.getSnapshot?.()||null,reconciliationError:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__||null}));}

async function runGestureProfile(browser,profile,guard){
  const page=await guard.runStep({profile:profile.id,phase:'NEW_PAGE',deadlineMs:GESTURE_STEP_DEADLINE_MS,task:()=>browser.newPage()});
  try{
    await guard.runStep({profile:profile.id,phase:'SET_VIEWPORT',deadlineMs:GESTURE_STEP_DEADLINE_MS,task:()=>page.setViewport(profile),stateProbe:()=>browserState(page)});
    const errors=installErrorCapture(page);
    await guard.runStep({profile:profile.id,phase:'PAGE_NAVIGATION',deadlineMs:PAGE_READY_DEADLINE_MS,task:()=>page.goto(`${base}/showroom/globe/audralia/`,{waitUntil:'domcontentloaded',timeout:60000}),stateProbe:()=>browserState(page)});
    await guard.runStep({profile:profile.id,phase:'AUTHORITATIVE_READINESS',deadlineMs:PAGE_READY_DEADLINE_MS,task:()=>waitForAuthoritativeRuntime(page,{label:`gesture_${profile.id.toLowerCase()}`,progress:state=>guard.checkpoint({profile:profile.id,phase:'READINESS_PROGRESS',detail:{loaderProgress:state.loaderProgress,loaderStage:state.loaderStage,status:state.status,runtimePresent:state.runtimePresent}})}),stateProbe:()=>browserState(page)});
    const nav=await guard.runStep({profile:profile.id,phase:'NAV_ASSERTION_SNAPSHOT',deadlineMs:GESTURE_STEP_DEADLINE_MS,task:()=>page.evaluate(()=>({primary:(document.querySelector('[data-fit-world]')?.textContent||'').trim(),compass:(document.querySelector('[data-return-to-compass]')?.textContent||'').trim(),returnCount:document.querySelectorAll('[data-return-to-compass]').length,hEarthPlay:[...document.querySelectorAll('a,button')].some(el=>(el.textContent||'').trim()==='H-Earth · Play'),mirrorland:[...document.querySelectorAll('a,button')].some(el=>(el.textContent||'').trim()==='Mirrorland'),soundtrack:Boolean(document.querySelector('[data-audralia-soundtrack-toggle]'))})),stateProbe:()=>browserState(page)});
    assert.equal(nav.primary,'focus Gratitude',`${profile.id}_FOCUS_GRATITUDE_HIERARCHY_FAILURE`);assert.equal(nav.compass,'Return to Compass',`${profile.id}_RETURN_COMPASS_HIERARCHY_FAILURE`);assert.equal(nav.returnCount,1,`${profile.id}_RETURN_COMPASS_COUNT_FAILURE`);assert.equal(nav.hEarthPlay,false,`${profile.id}_H_EARTH_TOP_NAV_SURVIVED`);assert.equal(nav.mirrorland,false,`${profile.id}_MIRRORLAND_TOP_NAV_SURVIVED`);assert.equal(nav.soundtrack,true,`${profile.id}_SOUNDTRACK_UTILITY_MISSING`);
    const travel=[];
    for(const station of TRAVEL_STATIONS){
      await guard.runStep({profile:profile.id,station:station.id,phase:'TRAVEL_SET_CAMERA',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>page.evaluate(station=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__.setCameraStateForTest({targetU:station.targetU,targetV:station.targetV,distance:4200,pitch:1.08,yaw:0}),station),stateProbe:()=>browserState(page)});
      const before=await guard.runStep({profile:profile.id,station:station.id,phase:'TRAVEL_BEFORE_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});
      await guard.runStep({profile:profile.id,station:station.id,phase:'TRAVEL_GESTURE',deadlineMs:GESTURE_STEP_DEADLINE_MS,task:()=>realTwoFingerSwipe(page,{dy:-125}),stateProbe:()=>browserState(page)});
      const after=await guard.runStep({profile:profile.id,station:station.id,phase:'TRAVEL_AFTER_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});
      const delta=targetDelta(before,after);assert.ok(delta>1e-3,`${profile.id}_TRAVEL_CONTINUITY_FAILURE:${station.id}:${JSON.stringify({before,after,delta})}`);travel.push(Object.freeze({station:station.id,before,after,delta}));guard.checkpoint({profile:profile.id,station:station.id,phase:'TRAVEL_ASSERTION_PASS',detail:{delta}});
    }
    await guard.runStep({profile:profile.id,phase:'LOOK_SET_CAMERA',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>page.evaluate(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__.setCameraStateForTest({targetU:0,targetV:2200,distance:4200,pitch:1.08,yaw:0})),stateProbe:()=>browserState(page)});
    const lookBefore=await guard.runStep({profile:profile.id,phase:'LOOK_BEFORE_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});await guard.runStep({profile:profile.id,phase:'LOOK_GESTURE',deadlineMs:GESTURE_STEP_DEADLINE_MS,task:()=>realOneFingerLook(page),stateProbe:()=>browserState(page)});const lookAfter=await guard.runStep({profile:profile.id,phase:'LOOK_AFTER_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});
    const lookChanged=Math.abs((lookAfter?.yaw??0)-(lookBefore?.yaw??0))+Math.abs((lookAfter?.pitch??0)-(lookBefore?.pitch??0));assert.ok(lookChanged>1e-5,`${profile.id}_LOOK_REGRESSION`);assert.ok(Math.abs((lookAfter?.yaw??0)-(lookBefore?.yaw??0))<Math.PI,`${profile.id}_LOOK_FLIP_REGRESSION`);guard.checkpoint({profile:profile.id,phase:'LOOK_ASSERTION_PASS',detail:{delta:lookChanged}});
    await guard.runStep({profile:profile.id,phase:'PINCH_SET_CAMERA',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>page.evaluate(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__.setCameraStateForTest({targetU:0,targetV:2200,distance:4200,pitch:1.08,yaw:0})),stateProbe:()=>browserState(page)});
    const pinchBefore=await guard.runStep({profile:profile.id,phase:'PINCH_BEFORE_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});await guard.runStep({profile:profile.id,phase:'PINCH_GESTURE',deadlineMs:GESTURE_STEP_DEADLINE_MS,task:()=>realTwoFingerSwipe(page,{dy:0,spreadDelta:-24}),stateProbe:()=>browserState(page)});const pinchAfter=await guard.runStep({profile:profile.id,phase:'PINCH_AFTER_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});
    assert.ok(Math.abs((pinchAfter?.distance??0)-(pinchBefore?.distance??0))>1e-4,`${profile.id}_PINCH_REGRESSION`);
    const spreadBefore=await guard.runStep({profile:profile.id,phase:'SPREAD_BEFORE_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});await guard.runStep({profile:profile.id,phase:'SPREAD_GESTURE',deadlineMs:GESTURE_STEP_DEADLINE_MS,task:()=>realTwoFingerSwipe(page,{dy:0,spreadDelta:30}),stateProbe:()=>browserState(page)});const spreadAfter=await guard.runStep({profile:profile.id,phase:'SPREAD_AFTER_SNAPSHOT',deadlineMs:CAMERA_STEP_DEADLINE_MS,task:()=>cameraSnapshot(page),stateProbe:()=>browserState(page)});
    assert.ok(Math.abs((spreadAfter?.distance??0)-(spreadBefore?.distance??0))>1e-4,`${profile.id}_SPREAD_REGRESSION`);assert.ok((pinchAfter.distance-pinchBefore.distance)*(spreadAfter.distance-spreadBefore.distance)<0,`${profile.id}_PINCH_SPREAD_DIRECTION_FAILURE`);assert.equal(errors.pageErrors.length,0,`${profile.id}_PAGE_ERROR`);guard.checkpoint({profile:profile.id,phase:'PROFILE_PASS'});
    return Object.freeze({profile:profile.id,nav,travel,look:Object.freeze({before:lookBefore,after:lookAfter,delta:lookChanged}),pinch:Object.freeze({before:pinchBefore,after:pinchAfter}),spread:Object.freeze({before:spreadBefore,after:spreadAfter}),pageErrors:Object.freeze([...errors.pageErrors])});
  }finally{await page.close().catch(()=>{});}
}

async function runConnectedGestureMatrix(browser){
  const guard=createSemanticRuntimeGuard({overallMs:MATRIX_OVERALL_MS,noProgressMs:MATRIX_NO_PROGRESS_MS});
  const profiles=[];for(const profile of GESTURE_PROFILES)profiles.push(await runGestureProfile(browser,profile,guard));
  const receipt=Object.freeze({schema:'AUDRALIA_GESTURE_RESPONSE_RECEIPT_v1',operationId:'AUDRALIA_CONTINUOUS_TRAVEL_NAVIGATION_SUCCESSOR_20260828_001',diagnosticOperationId:'AUDRALIA_GESTURE_MATRIX_VERIFIER_RUNTIME_HARDENING_20260828_001',candidateHead:'27f49de7c468b84164f5dfbb0c5f5b9590c130f9',result:'PASS',runtimeMatrix:Object.freeze({required:true,status:'PASS',profiles:Object.freeze(profiles),runtimeGuard:guard.snapshot(),overallRuntimeCeilingMs:MATRIX_OVERALL_MS,noProgressCeilingMs:MATRIX_NO_PROGRESS_MS}),protectedSnapshotMutation:false,hEarthMutation:false,productMutationByDiagnostic:false});
  fs.writeFileSync('/tmp/audralia-gesture-matrix-runtime-receipt.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));return receipt;
}

const staticEvidence=staticCandidate();console.log(JSON.stringify({staticEvidence},null,2));
const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
try{
  const enabled=await captureVariant(browser,{ablateV6:false}),ablated=await captureVariant(browser,{ablateV6:true});
  for(const variant of [enabled,ablated]){assert.equal(variant.errors.pageErrors.length,0,`${variant.ablateV6?'ABLATION':'ENABLED'}_PAGE_ERROR`);assert.equal(variant.live.integration?.schema,LIVE_SCHEMA,'LIVE_INTEGRATION_SCHEMA_DRIFT');assert.equal(variant.live.integration?.startupArchitecture,'APPROVED_PRESENTATION_PRE_RENDER_v1','LIVE_STARTUP_ARCHITECTURE_DRIFT');assert.equal(variant.live.integration?.cameraSemanticsFrozen,true,'LIVE_CAMERA_SEMANTICS_NOT_FROZEN');assert.equal(variant.live.integration?.finalCloudShaderComposition,POLICY_ID,'LIVE_FINAL_COMPOSITION_BINDING_MISSING');assert.ok(variant.live.loaderProgress>=4,'LIVE_LOADER_NOT_READY');assert.ok(String(variant.live.status).includes('USER_REVIEW_REQUIRED'),'LIVE_RUNTIME_NOT_READY');assert.equal(variant.live.worldCanvasCount,1,'LIVE_PRIMARY_WORLD_CANVAS_MULTIPLIED');assert.equal(variant.composition.policyId,POLICY_ID,'FINAL_COMPOSITION_POLICY_DRIFT');assert.equal(variant.composition.evidence?.finalStageEvidence?.pass,true,'FINAL_COMPOSITION_STAGE_FAILURE');assert.equal(variant.composition.evidence?.composedCloudShaders,1,'FINAL_COMPOSITION_EXPECTED_ONE_CLOUD_SHADER');assert.equal(variant.composition.evidence?.rejectedCloudShaders,0,'FINAL_COMPOSITION_REJECTED_SHADER');assert.equal(variant.composition.evidence?.finalShaderSha256?.length,64,'FINAL_SHADER_SHA256_MISSING');for(const stage of REQUIRED_STAGES){const evidence=variant.composition.evidence.finalStageEvidence.stages?.[stage];assert.equal(evidence?.observedMutationCount,evidence?.requiredMutationCount,`FINAL_STAGE_MUTATION_COUNT_FAILURE:${stage}`);}}
  assert.equal(enabled.composition.evidence.finalAblationMode,'NONE','ENABLED_VARIANT_ABLATION_STATE_WRONG');assert.equal(ablated.composition.evidence.finalAblationMode,'V6_FIELDS_ABLATED','ABLATION_VARIANT_ABLATION_STATE_WRONG');assert.notEqual(enabled.composition.evidence.finalShaderSha256,ablated.composition.evidence.finalShaderSha256,'V6_ABLATION_FINAL_SHADER_HASH_IDENTICAL');
  const causality=compareCausality(enabled,ablated);console.log(JSON.stringify({schema:'AUDRALIA_FINAL_CLOUD_SHADER_CAUSALITY_QUALIFICATION_v1',staticEvidence,enabled,ablated,causality},null,2));if(!causality.pass)throw new Error(`FRAMEBUFFER_CAUSALITY_FAILURE ${JSON.stringify({positiveProbeCount:causality.positiveProbeCount,materialProbeCount:causality.materialProbeCount,maxMeanAlphaDelta:causality.maxMeanAlphaDelta,maxCoverageDelta:causality.maxCoverageDelta})}`);
  const gestureReceipt=await runConnectedGestureMatrix(browser);assert.equal(gestureReceipt.result,'PASS','CONNECTED_GESTURE_MATRIX_FAILURE');
  console.log(JSON.stringify({schema:'AUDRALIA_FINAL_CLOUD_SHADER_CAUSALITY_QUALIFICATION_v1',result:'PASS',policyId:POLICY_ID,enabledFinalShaderSha256:enabled.composition.evidence.finalShaderSha256,ablatedFinalShaderSha256:ablated.composition.evidence.finalShaderSha256,finalStageEvidence:enabled.composition.evidence.finalStageEvidence,causality:Object.freeze({positiveProbeCount:causality.positiveProbeCount,materialProbeCount:causality.materialProbeCount,maxMeanAlphaDelta:causality.maxMeanAlphaDelta,maxCoverageDelta:causality.maxCoverageDelta}),connectedGestureMatrix:'PASS',singleVolumetricPassPreserved:true,performanceCeilingsFrozen:true,productionDeploymentPerformed:false},null,2));
}finally{await browser.close();}
