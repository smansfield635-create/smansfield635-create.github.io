#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const BASE='http://127.0.0.1:4173';
const CHROME=process.env.CHROME_PATH;
if(!CHROME)throw new Error('CHROME_PATH_MISSING');

const INDEX='showroom/globe/audralia/index.html';
const FAP='showroom/globe/audralia/fap1-weather-presentation-v1.mjs';
const TABLET='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs';
const TABLET_RUNTIME='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs';
const GA_BOOT='inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/fap1-ga-authority-bootstrap.mjs';
const GA_RENDERER='inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/exterior-weather.ga-v2-spatial-handoff.mjs';
const POLICY='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v8_VISIBLE_AUTHORITY_BINDING';
const LIVE='AUDRALIA_LIVE_PLANETARY_INTEGRATION_v8_ADVANCED_CLOUD_GLOBALIZATION';
const FIXED_TIME=Date.parse('2026-08-24T22:00:00.000Z');
const GUARDS=Object.freeze({meanAlphaDelta:.0015,coverageDelta:.002,positiveMinimum:2,materialMinimum:1,clearFactor:.12,epsilon:1/255});
const PROFILES=Object.freeze({PHONE:{width:720,height:1280,deviceScaleFactor:1,isMobile:true,hasTouch:true},TABLET:{width:1280,height:800,deviceScaleFactor:2,isMobile:true,hasTouch:true}});

const read=p=>fs.readFileSync(p,'utf8');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function targetFromLatLon(lat,lon){
  const R=6200,north=[0,.5,-.8660254037844386],meridian=[0,.8660254037844386,.5],east=[1,0,0];
  const cl=Math.cos(lat),direction=[0,1,2].map(i=>east[i]*cl*Math.sin(lon)+meridian[i]*cl*Math.cos(lon)+north[i]*Math.sin(lat));
  const length=Math.hypot(...direction)||1;for(let i=0;i<3;i++)direction[i]/=length;
  const angle=Math.acos(Math.max(-1,Math.min(1,direction[1]))),sine=Math.sin(angle);
  return {targetU:Math.abs(sine)<1e-9?0:R*angle*direction[0]/sine,targetV:Math.abs(sine)<1e-9?0:R*angle*direction[2]/sine,distance:5000,pitch:1.08,yaw:0};
}

const DONORS=Object.freeze([
  ['FRONT_1',.593412,-1.274090],['FRONT_2',.488692,.436332],['FRONT_3',-.558505,.733038],['FRONT_4',.802851,2.443461],['FRONT_5',-.767945,-.261799],
  ['JET_1',-.820305,-2.495821],['JET_2',1.012291,-2.617994],['JET_3',.907571,1.308997],['JET_4',-.959931,1.832596],
  ['CYCLONE_1',-.628319,-2.199115],['CYCLONE_2',.349066,2.705260]
].map(([id,lat,lon])=>Object.freeze({id,lat,lon,...targetFromLatLon(lat,lon)})));
const CLEAR=Object.freeze([
  Object.freeze({id:'CLEAR_GRATITUDE',lat:.453786,lon:-.314159,...targetFromLatLon(.453786,-.314159)}),
  Object.freeze({id:'CLEAR_CENTRAL_PACIFIC',lat:-.10,lon:-1.88,...targetFromLatLon(-.10,-1.88)}),
  Object.freeze({id:'CLEAR_INDIAN',lat:.18,lon:1.78,...targetFromLatLon(.18,1.78)})
]);

function staticCandidate(){
  const index=read(INDEX),phone=read(FAP),tablet=read(TABLET),tabletRuntime=read(TABLET_RUNTIME),boot=read(GA_BOOT),ga=read(GA_RENDERER);
  assert.match(index,new RegExp(LIVE),'LIVE_SCHEMA_MISSING');
  for(const marker of ['advancedCloudGlobalization: true','cheapGlobalCloudVisualAuthority: false','cloudCoverageUpgradeDeferred: false'])assert.ok(index.includes(marker),`LIVE_AUTHORITY_MISSING:${marker}`);
  assert.ok(index.indexOf("await import('./fap1-weather-presentation-v1.mjs")<index.indexOf("await import('/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs"),'WRAPPER_NOT_INSTALLED_BEFORE_VISIBLE_GA_RUNTIME');
  assert.match(phone,new RegExp(POLICY),'VISIBLE_BINDING_POLICY_MISSING');
  assert.match(phone,/source\.includes\('globalCloudSupport'\)/,'RETIRED_SHADER_EXCLUSION_MISSING');
  assert.match(phone,/uSysA\[8\],uSysB\[8\],uSysC\[8\],uSysD\[8\],uClearA\[4\]/,'VISIBLE_DESCRIPTOR_SHADER_SIGNATURE_MISSING');
  assert.match(phone,/visibleDensityAuthority:'FAP1_GPU_DESCRIPTOR_RENDERER'/,'VISIBLE_AUTHORITY_DECLARATION_MISSING');
  assert.match(phone,/additionalRenderPasses:0/,'ADDITIONAL_RENDER_PASS_DECLARATION_DRIFT');
  assert.match(phone,/additionalCanvasOrContext:false/,'ADDITIONAL_CANVAS_CONTEXT_DECLARATION_DRIFT');
  assert.match(phone,/visibleBackgroundGlobalCloudSupport:false/,'CHEAP_GLOBAL_AUTHORITY_NOT_REMOVED');
  const families={front:(phone.match(/weather\+=fap1FrontSystem\(/g)||[]).length,jet:(phone.match(/weather\+=fap1JetSystem\(/g)||[]).length,cyclone:(phone.match(/weather\+=fap1CycloneSystem\(/g)||[]).length};
  assert.deepEqual(families,{front:5,jet:4,cyclone:2},'PHONE_ADVANCED_FAMILY_COUNT_DRIFT');
  assert.equal((phone.match(/fap1Disk\(lat,lon,/g)||[]).length,3,'PHONE_CLEAR_WINDOW_COUNT_DRIFT');
  assert.match(tablet,/REST_STEPS\s*=\s*8/,'TABLET_REST_CEILING_DRIFT');
  assert.match(tablet,/INTERACTION_STEPS\s*=\s*6/,'TABLET_INTERACTION_CEILING_DRIFT');
  assert.match(tablet,/createsCanvas:false,requestsWebGLContext:false/,'TABLET_SINGLE_CONTEXT_DECLARATION_DRIFT');
  assert.equal((tablet.match(/weather\+=frontSystem\(/g)||[]).length,5,'TABLET_FRONT_COUNT_DRIFT');
  assert.equal((tablet.match(/weather\+=jetSystem\(/g)||[]).length,4,'TABLET_JET_COUNT_DRIFT');
  assert.equal((tablet.match(/weather\+=cycloneSystem\(/g)||[]).length,2,'TABLET_CYCLONE_COUNT_DRIFT');
  assert.match(index,/tabletPixelBudget\s*=\s*921600/,'TABLET_PIXEL_BUDGET_DRIFT');
  assert.match(tabletRuntime,/webgl2ContextRequests!==1/,'TABLET_SINGLE_CONTEXT_GUARD_MISSING');
  assert.match(boot,/receipt\.exterior\.overlay\.style\.visibility='hidden'/,'RETIRED_AUTHORITY_NOT_HIDDEN');
  assert.match(boot,/meteorologicalAuthority='RETIRED_VISIBLE_AUTHORITY'/,'RETIRED_AUTHORITY_MARKER_MISSING');
  assert.match(boot,/fap1SoleVisibleDensityAuthority='true'/,'SOLE_VISIBLE_AUTHORITY_MARKER_MISSING');
  assert.match(boot,/visibleDensityAuthority:'FAP1_GPU_DESCRIPTOR_RENDERER'/,'BOOT_VISIBLE_AUTHORITY_DRIFT');
  assert.match(ga,/const REST_STEPS=32,INTERACTION_STEPS=15,REST_MAX_PIXELS=230000,INTERACTION_MAX_PIXELS=90000;/,'PHONE_BUDGET_DRIFT');
  assert.match(ga,/uniform vec4 uSysA\[8\],uSysB\[8\],uSysC\[8\],uSysD\[8\],uClearA\[4\];/,'GA_DESCRIPTOR_SIGNATURE_DRIFT');
  return Object.freeze({policy:POLICY,live:LIVE,families,phoneBudget:{restSteps:32,interactionSteps:15,restPixels:230000,interactionPixels:90000},tabletBudget:{restSteps:8,interactionSteps:6,maxPixels:921600},guards:GUARDS});
}

function installAudit({fixedTime,ablate,profile}){
  const NativeDate=Date;class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:[fixedTime]));}static now(){return fixedTime;}}Object.setPrototypeOf(FixedDate,NativeDate);globalThis.Date=FixedDate;
  const P=WebGL2RenderingContext.prototype,nativeSource=P.shaderSource,nativeCompile=P.compileShader,nativeLink=P.linkProgram,nativeDraw=P.drawArrays;
  const shaders=new Map(),programs=new Map(),contexts=[];let current=null;
  const originalGetContext=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,attrs){const gl=originalGetContext.call(this,type,attrs);if(gl&&/^webgl/.test(type)&&!contexts.some(x=>x.gl===gl))contexts.push({gl,canvas:this,type});return gl;};
  P.shaderSource=function(shader,source){
    const phone=profile==='PHONE'&&typeof source==='string'&&source.includes('vec3 fap1OrganizedWeather(')&&source.includes('uSysA[8]')&&source.includes('uCarveActive');
    const tablet=profile==='TABLET'&&typeof source==='string'&&source.includes('vec3 advancedCloudField(vec3 p)')&&source.includes('uStepCount');
    const relevant=phone||tablet;let submitted=source;
    if(relevant&&ablate){const call=phone?'vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);':'vec3 cloud=advancedCloudField(p);';const replacement=phone?'vec3 fap1=vec3(0.0);':'vec3 cloud=vec3(0.0);';if(source.split(call).length-1!==1)throw new Error('ABLATION_CALL_SITE_COUNT');submitted=source.replace(call,replacement);}
    shaders.set(shader,{relevant,submitted,original:source,compiled:null});return nativeSource.call(this,shader,submitted);
  };
  P.compileShader=function(shader){const out=nativeCompile.call(this,shader),r=shaders.get(shader);if(r){r.compiled=this.getShaderParameter(shader,this.COMPILE_STATUS);if(r.relevant&&!r.compiled)throw new Error(`CLOUD_COMPILE_FAILURE:${this.getShaderInfoLog(shader)}`);}return out;};
  P.linkProgram=function(program){const out=nativeLink.call(this,program),attached=this.getAttachedShaders(program)||[],relevant=attached.some(s=>shaders.get(s)?.relevant);if(relevant){const linked=this.getProgramParameter(program,this.LINK_STATUS);if(!linked)throw new Error(`CLOUD_LINK_FAILURE:${this.getProgramInfoLog(program)}`);programs.set(program,{draws:0,linked,canvas:this.canvas});}return out;};
  P.drawArrays=function(...args){const program=this.getParameter(this.CURRENT_PROGRAM),r=programs.get(program);const out=nativeDraw.apply(this,args);if(r){r.draws++;current={canvas:this.canvas,program,draws:r.draws};}return out;};
  globalThis.__AUDRALIA_VISIBLE_CLOUD_AUDIT__=Object.freeze({
    get:()=>({contexts:contexts.map(x=>({type:x.type,world:x.canvas.matches?.('[data-h-earth-map-wide-canvas]')||false,soleVisible:x.canvas.dataset?.fap1SoleVisibleDensityAuthority==='true',retired:x.canvas.dataset?.meteorologicalAuthority==='RETIRED_VISIBLE_AUTHORITY'})),programs:[...programs.values()].map(x=>({draws:x.draws,linked:x.linked,soleVisible:x.canvas?.dataset?.fap1SoleVisibleDensityAuthority==='true',world:x.canvas?.matches?.('[data-h-earth-map-wide-canvas]')||false})),lastDraw:current?{draws:current.draws,soleVisible:current.canvas?.dataset?.fap1SoleVisibleDensityAuthority==='true',world:current.canvas?.matches?.('[data-h-earth-map-wide-canvas]')||false}:null})
  });
}

async function waitReady(page,profile){
  const started=Date.now();let last=null;
  while(Date.now()-started<120000){
    last=await page.evaluate(profile=>({
      startup:window.__AUDRALIA_TABLET_STARTUP_STABILITY__||null,
      proof:Boolean(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__),
      invariants:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants||window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.invariants||null,
      ga:window.__AUDRALIA_FAP1_GA_AUTHORITY__?{schema:window.__AUDRALIA_FAP1_GA_AUTHORITY__.schema,visibleDensityAuthority:window.__AUDRALIA_FAP1_GA_AUTHORITY__.visibleDensityAuthority}:null,
      gaError:window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__||null,
      loaderReady:document.querySelector('[data-audralia-loader]')?.classList.contains('is-ready')||false
    }),profile);
    if(last?.startup?.status==='FAILED')throw new Error(`STARTUP_FAILED:${last.startup.error}`);
    if(last?.gaError)throw new Error(`GA_FAILED:${last.gaError.message}`);
    if(last?.startup?.status==='COMPLETE'&&last.proof&&last.loaderReady&&(profile==='TABLET'||last.ga?.visibleDensityAuthority==='FAP1_GPU_DESCRIPTOR_RENDERER'))return last;
    await sleep(200);
  }
  throw new Error(`RUNTIME_READY_TIMEOUT:${JSON.stringify(last)}`);
}

async function readCanvas(page,selector){
  return page.evaluate(selector=>{
    const canvas=document.querySelector(selector);if(!(canvas instanceof HTMLCanvasElement))throw new Error(`CANVAS_MISSING:${selector}`);
    const gl=canvas.getContext('webgl2');if(!gl)throw new Error(`WEBGL2_MISSING:${selector}`);gl.finish();
    const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,total=width*height;if(total<=0)throw new Error('EMPTY_DRAWING_BUFFER');
    const p=new Uint8Array(total*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,p);let alpha=0,nonzero=0,strong=0,checksum=0;
    for(let i=0,n=0;i<p.length;i+=4,n++){const a=p[i+3];alpha+=a/255;if(a>8)nonzero++;if(a>32)strong++;checksum=(checksum+((n%65521)+1)*(p[i]+3*p[i+1]+7*p[i+2]+11*a))%2147483647;}
    return {width,height,meanAlpha:alpha/total,nonzeroFraction:nonzero/total,strongFraction:strong/total,checksum};
  },selector);
}

async function phoneVariant(browser,ablate){
  const page=await browser.newPage();await page.setViewport(PROFILES.PHONE);await page.evaluateOnNewDocument(installAudit,{fixedTime:FIXED_TIME,ablate,profile:'PHONE'});
  const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
  try{
    await page.goto(`${BASE}/showroom/globe/audralia/`,{waitUntil:'domcontentloaded',timeout:60000});await waitReady(page,'PHONE');
    const authority=await page.evaluate(()=>{
      const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__,ga=window.__AUDRALIA_FAP1_GA_AUTHORITY__,a=proof?.exterior?.overlay,b=document.querySelector('canvas[data-fap1-sole-visible-density-authority="true"]');
      return {a:{present:a instanceof HTMLCanvasElement,visibility:a?.style?.visibility||'',diagnostic:a?.dataset?.fap1GADiagnosticOnly||null,authority:a?.dataset?.meteorologicalAuthority||null},b:{present:b instanceof HTMLCanvasElement,visibility:b?getComputedStyle(b).visibility:null,display:b?getComputedStyle(b).display:null,opacity:b?getComputedStyle(b).opacity:null,connected:b?.isConnected||false},ga:{schema:ga?.schema||null,visibleDensityAuthority:ga?.visibleDensityAuthority||null,legacyExteriorVisible:ga?.legacyExteriorVisible??null},canvasCount:document.querySelectorAll('canvas').length};
    });
    assert.deepEqual(authority.a,{present:true,visibility:'hidden',diagnostic:'true',authority:'RETIRED_VISIBLE_AUTHORITY'},'RETIRED_A_AUTHORITY_DRIFT');
    assert.equal(authority.b.present,true,'VISIBLE_B_MISSING');assert.equal(authority.b.visibility,'visible','VISIBLE_B_HIDDEN');assert.notEqual(authority.b.display,'none','VISIBLE_B_DISPLAY_NONE');assert.ok(Number(authority.b.opacity)>0,'VISIBLE_B_OPACITY_ZERO');assert.equal(authority.b.connected,true,'VISIBLE_B_DETACHED');
    assert.equal(authority.ga.visibleDensityAuthority,'FAP1_GPU_DESCRIPTOR_RENDERER','VISIBLE_AUTHORITY_NOT_B');assert.equal(authority.ga.legacyExteriorVisible,false,'LEGACY_A_VISIBLE');
    const probes=[];
    for(const probe of DONORS){await page.evaluate(state=>{const p=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__,g=window.__AUDRALIA_FAP1_GA_AUTHORITY__;p.setCameraStateForTest(state);g.renderNow();},probe);await sleep(40);probes.push({id:probe.id,...await readCanvas(page,'canvas[data-fap1-sole-visible-density-authority="true"]')});}
    const clear=[];
    for(const probe of CLEAR){await page.evaluate(state=>{const p=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__,g=window.__AUDRALIA_FAP1_GA_AUTHORITY__;p.setCameraStateForTest(state);g.renderNow();},probe);await sleep(40);clear.push({id:probe.id,...await readCanvas(page,'canvas[data-fap1-sole-visible-density-authority="true"]')});}
    const interaction=await page.evaluate(async()=>{const canvas=document.querySelector('[data-h-earth-map-wide-canvas]'),ga=window.__AUDRALIA_FAP1_GA_AUTHORITY__;canvas.dispatchEvent(new PointerEvent('pointerdown',{pointerId:991,bubbles:true,clientX:100,clientY:100}));ga.renderNow();await new Promise(r=>requestAnimationFrame(r));const packet=ga.descriptorPacket();canvas.dispatchEvent(new PointerEvent('pointerup',{pointerId:991,bubbles:true,clientX:100,clientY:100}));return packet;});
    const audit=await page.evaluate(()=>window.__AUDRALIA_VISIBLE_CLOUD_AUDIT__.get());
    assert.equal(audit.programs.length,1,'PHONE_RELEVANT_PROGRAM_COUNT');assert.ok(audit.programs[0].draws>0,'PHONE_NATIVE_DRAW_MISSING');assert.equal(audit.programs[0].soleVisible,true,'PHONE_DRAW_NOT_ON_B');
    assert.deepEqual(errors,[],'PHONE_PAGE_ERROR');
    return {ablate,authority,probes,clear,interaction,audit};
  }finally{await page.close();}
}

function comparePhone(on,off){
  assert.equal(on.probes.length,11,'PHONE_DONOR_PROBE_COUNT');assert.equal(off.probes.length,11,'PHONE_ABLATED_DONOR_PROBE_COUNT');
  const probes=on.probes.map((a,i)=>{const b=off.probes[i];assert.equal(a.id,b.id,'PHONE_PAIR_ID');return {id:a.id,meanAlphaDelta:a.meanAlpha-b.meanAlpha,coverageDelta:a.nonzeroFraction-b.nonzeroFraction,strongDelta:a.strongFraction-b.strongFraction,checksumDifferent:a.checksum!==b.checksum,enabled:a,ablated:b};});
  const positive=probes.filter(p=>p.meanAlphaDelta>0&&p.checksumDifferent),material=probes.filter(p=>p.meanAlphaDelta>=GUARDS.meanAlphaDelta&&(p.coverageDelta>=GUARDS.coverageDelta||p.strongDelta>=GUARDS.coverageDelta));
  assert.ok(positive.length>=GUARDS.positiveMinimum,`PHONE_POSITIVE_CAUSAL_PROBES_${positive.length}`);assert.ok(material.length>=GUARDS.materialMinimum,`PHONE_MATERIAL_CAUSAL_PROBES_${material.length}`);
  const maxDonor=Math.max(...on.probes.map(p=>p.meanAlpha));
  for(const clear of on.clear)assert.ok(clear.meanAlpha<=maxDonor*GUARDS.clearFactor+GUARDS.epsilon,`PHONE_CLEAR_WINDOW_FAILURE:${clear.id}:${clear.meanAlpha}:${maxDonor}`);
  return {positiveProbeCount:positive.length,materialProbeCount:material.length,maxDonorMeanAlpha:maxDonor,clear:on.clear,probes};
}

async function tablet(browser){
  const page=await browser.newPage();await page.setViewport(PROFILES.TABLET);await page.evaluateOnNewDocument(installAudit,{fixedTime:FIXED_TIME,ablate:false,profile:'TABLET'});const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
  try{
    await page.goto(`${BASE}/showroom/globe/audralia/`,{waitUntil:'domcontentloaded',timeout:60000});await waitReady(page,'TABLET');
    const state=await page.evaluate(()=>({budget:window.__AUDRALIA_RENDER_PIXEL_BUDGET__,startup:window.__AUDRALIA_TABLET_STARTUP_STABILITY__,runtime:window.__AUDRALIA_TABLET_SINGLE_CONTEXT__?{schema:window.__AUDRALIA_TABLET_SINGLE_CONTEXT__.schema,invariants:window.__AUDRALIA_TABLET_SINGLE_CONTEXT__.invariants,cloudEvidence:window.__AUDRALIA_TABLET_SINGLE_CONTEXT__.getCloudEvidence(),cloudRuntime:window.__AUDRALIA_TABLET_SINGLE_CONTEXT__.clouds.getRuntime()}:null,canvases:document.querySelectorAll('canvas').length,audit:window.__AUDRALIA_VISIBLE_CLOUD_AUDIT__.get()}));
    assert.equal(state.budget.active,true,'TABLET_BUDGET_BRANCH_NOT_ACTIVE');assert.ok(state.budget.effectiveDpr<=state.budget.nativeDpr,'TABLET_DPR_BUDGET_INVALID');assert.equal(state.runtime?.invariants?.pass,true,'TABLET_RUNTIME_INVARIANT_FAIL');assert.equal(state.runtime.invariants.singleWebGLContext,true,'TABLET_NOT_SINGLE_CONTEXT');assert.equal(state.runtime.invariants.webgl2ContextRequests,1,'TABLET_CONTEXT_REQUEST_COUNT');assert.equal(state.runtime.invariants.additionalCanvasCount,0,'TABLET_ADDITIONAL_CANVAS');assert.equal(state.runtime.cloudEvidence.primaryContextOnly,true,'TABLET_CLOUD_NOT_PRIMARY_CONTEXT');assert.equal(state.runtime.cloudEvidence.createsCanvas,false,'TABLET_CLOUD_CREATES_CANVAS');assert.equal(state.runtime.cloudEvidence.requestsWebGLContext,false,'TABLET_CLOUD_REQUESTS_CONTEXT');assert.equal(state.runtime.cloudEvidence.frontalSystemCount,5,'TABLET_FRONT_COUNT_RUNTIME');assert.equal(state.runtime.cloudEvidence.jetBandSystemCount,4,'TABLET_JET_COUNT_RUNTIME');assert.equal(state.runtime.cloudEvidence.cycloneSystemCount,2,'TABLET_CYCLONE_COUNT_RUNTIME');assert.ok(state.runtime.cloudRuntime.renderedFrames>0,'TABLET_CLOUD_DRAW_MISSING');assert.equal(state.canvases,1,'TABLET_CANVAS_COUNT');assert.equal(state.audit.programs.length,1,'TABLET_RELEVANT_PROGRAM_COUNT');assert.ok(state.audit.programs[0].draws>0,'TABLET_NATIVE_DRAW_MISSING');assert.equal(state.audit.programs[0].world,true,'TABLET_DRAW_NOT_PRIMARY_WORLD');assert.deepEqual(errors,[],'TABLET_PAGE_ERROR');
    return state;
  }finally{await page.close();}
}

const receipt={schema:'AUDRALIA_VISIBLE_CLOUD_AUTHORITY_BINDING_QUALIFICATION_v1',result:'FAIL_CLOSED',mechanicalOnly:true,physicalDeviceStabilityProven:false,ownerVisualAcceptanceProven:false,productionDeploymentPerformed:false};
let browser;
try{
  receipt.staticEvidence=staticCandidate();
  browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  const enabled=await phoneVariant(browser,false),ablated=await phoneVariant(browser,true);receipt.phone={enabled,ablated,causality:comparePhone(enabled,ablated)};
  receipt.tablet=await tablet(browser);
  receipt.result='PASS_CLOSED';
}catch(error){receipt.failure=String(error?.stack||error);process.exitCode=1;
}finally{if(browser)await browser.close();console.log(JSON.stringify(receipt,null,2));}
