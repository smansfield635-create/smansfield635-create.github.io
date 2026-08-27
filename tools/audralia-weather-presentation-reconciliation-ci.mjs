#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
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
const PRODUCER_POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v7';
const BASELINE_PRODUCER_POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v6';
const BASELINE_PRODUCER_GIT_BLOB='d4c7d230ea8ffa265cfd347629ec2e46d653726c';
const LIVE_SCHEMA='AUDRALIA_LIVE_PLANETARY_INTEGRATION_v8_FINAL_CLOUD_COMPOSITION';
const REQUEST_IDENTITY='AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION_v1_GEN1754_WEATHER_POPULATION_V7';
const FIXED_TIME_MS=Date.parse('2026-08-24T22:00:00.000Z');

const REQUIRED_STAGES=Object.freeze([
  'FAP1_ORGANIZED_WEATHER_V6',
  'XYZ_VOLUMETRIC_DEPTH_V2',
  'ACF1_PRESENTATION_V3',
  'DIRECT_DENSITY_V4'
]);
const V6_FAMILIES=Object.freeze(['CIRRUS_FIELD','CIRROSTRATUS_VEIL','ALTOCUMULUS_FIELD']);

const directFap1=fs.readFileSync(DIRECT_FAP1,'utf8');
const snapshotFap1=fs.readFileSync(SNAPSHOT_FAP1,'utf8');

function gitBlobSha(source){
  const bytes=Buffer.from(source,'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function staticCandidate(){
  const index=fs.readFileSync(INDEX,'utf8');
  const compositor=fs.readFileSync(COMPOSITOR,'utf8');
  const renderer=fs.readFileSync(SNAPSHOT_RENDERER,'utf8');

  assert.equal(gitBlobSha(snapshotFap1),BASELINE_PRODUCER_GIT_BLOB,'PROTECTED_24057_FAP1_BASELINE_DRIFT');
  assert.notEqual(directFap1,snapshotFap1,'CANDIDATE_PRODUCER_DID_NOT_DEPART_FROM_PROTECTED_BASELINE');
  assert.match(snapshotFap1,new RegExp(BASELINE_PRODUCER_POLICY_ID),'PROTECTED_24057_FAP1_POLICY_DRIFT');
  assert.match(directFap1,new RegExp(PRODUCER_POLICY_ID),'CANDIDATE_FAP1_POLICY_IDENTITY_MISSING');
  assert.match(directFap1,/existingCloudSystemsExpanded:true/,'CANDIDATE_EXISTING_SYSTEM_EXPANSION_IDENTITY_MISSING');
  assert.match(directFap1,/secondFailingCorpusRepair:true/,'SECOND_FAILING_CORPUS_IDENTITY_MISSING');
  assert.match(directFap1,/orbitalSurvivalBoost:true/,'ORBITAL_SURVIVAL_IDENTITY_MISSING');

  assert.match(index,new RegExp(LIVE_SCHEMA),'LIVE_FINAL_COMPOSITION_SCHEMA_MISSING');
  assert.match(index,new RegExp(`final-cloud-shader-composition-v1\\.mjs\\?cb=${REQUEST_IDENTITY}`),'GEN1754_FINAL_COMPOSITOR_REQUEST_IDENTITY_MISSING');
  assert.match(index,new RegExp(`fap1WeatherPopulationPolicy: '${PRODUCER_POLICY_ID}'`),'PUBLIC_FAP1_POLICY_IDENTITY_MISSING');
  assert.match(index,/weatherPopulationOperation: 'AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_20260827_001_SUCCESSOR_001'/,'PUBLIC_OPERATION_IDENTITY_MISSING');
  assert.doesNotMatch(index,/type="module" src="\.\/fap1-orbital-support-tuning-v1\.mjs/,'LEGACY_DIRECT_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/acf1-cloud-presentation-v1\.mjs/,'LEGACY_ACF1_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-xyz-volumetric-depth-v1\.mjs/,'LEGACY_XYZ_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-weather-presentation-v1\.mjs/,'LEGACY_FAP1_WRAPPER_STILL_BOOTED_SEPARATELY');

  assert.match(compositor,new RegExp(POLICY_ID),'FINAL_COMPOSITOR_POLICY_MISSING');
  assert.match(compositor,/AUDRALIA_FINAL_DIRECT_DENSITY_SUPPORT_v1/,'FINAL_DIRECT_DENSITY_REPAIR_MISSING');
  assert.match(compositor,/FINAL_CLOUD_SHADER_GLSL_VERSION_NOT_FIRST_LINE/,'FINAL_GLSL_VERSION_ORDER_GUARD_MISSING');
  for(const stage of REQUIRED_STAGES)assert.match(compositor,new RegExp(stage),`FINAL_STAGE_DECLARATION_MISSING:${stage}`);
  for(const family of V6_FAMILIES){
    assert.match(snapshotFap1,new RegExp(family),`BASELINE_FAMILY_SOURCE_MISSING:${family}`);
    assert.match(directFap1,new RegExp(family),`CANDIDATE_FAMILY_SOURCE_MISSING:${family}`);
  }

  assert.match(renderer,/const REST_STEPS=32,INTERACTION_STEPS=15,REST_MAX_PIXELS=230000,INTERACTION_MAX_PIXELS=90000;/,'FINAL_COMPOSITION_PERFORMANCE_CEILINGS_CHANGED');
  assert.match(renderer,/uSysA\[8\]/,'FINAL_COMPOSITION_NATIVE_SYSTEM_ARRAY_CHANGED');
  assert.doesNotMatch(compositor,/createElement\(\s*['"]canvas['"]\s*\)/,'FINAL_COMPOSITOR_ADDITIONAL_CANVAS_SOURCE_DETECTED');
  assert.doesNotMatch(compositor,/new\s+OffscreenCanvas\s*\(/,'FINAL_COMPOSITOR_OFFSCREEN_CANVAS_SOURCE_DETECTED');

  return Object.freeze({
    policyId:POLICY_ID,
    producerPolicyId:PRODUCER_POLICY_ID,
    protectedBaselinePolicyId:BASELINE_PRODUCER_POLICY_ID,
    protectedBaselineGitBlob:BASELINE_PRODUCER_GIT_BLOB,
    liveSchema:LIVE_SCHEMA,
    requestIdentity:REQUEST_IDENTITY,
    protectedSnapshotImmutable:true,
    candidateProducerDistinctFromBaseline:true,
    requiredStages:REQUIRED_STAGES,
    v6Families:V6_FAMILIES,
    frozenPerformanceCeilings:true,
    additionalRenderCanvasSource:false
  });
}

const SYSTEMS=Object.freeze([
  Object.freeze({
    id:'MARINE_STRATUS_STRATOCUMULUS_BANK',
    key:'marine',lat:.383972,lon:2.303835,
    replacements:Object.freeze([
      Object.freeze(['float marineDeck=marineEnvelope*fap1Band(h,30.0,49.0)*(.20+.58*marineOpenCells)*.72;','float marineDeck=marineEnvelope*fap1Band(h,30.0,49.0)*(.20+.58*marineOpenCells)*.60;'])
    ])
  }),
  Object.freeze({
    id:'TRADE_CUMULUS_STREETS',
    key:'trade',lat:-.122173,lon:2.757620,
    replacements:Object.freeze([
      Object.freeze(['float tradeCumulus=tradeEnvelope*fap1Band(h,30.0,57.0)*tradeStreet*.84;','float tradeCumulus=tradeEnvelope*fap1Band(h,30.0,57.0)*tradeStreet*.72;'])
    ])
  }),
  Object.freeze({
    id:'MIDLATITUDE_COMMA_FRONT',
    key:'comma',lat:.785398,lon:3.071779,
    replacements:Object.freeze([
      Object.freeze(['float commaMid=commaShape*fap1Band(h,46.0,84.0)*commaBreak*.72;','float commaMid=commaShape*fap1Band(h,46.0,84.0)*commaBreak*.60;']),
      Object.freeze(['float commaIce=max(commaHead,commaWrap)*fap1Band(h,73.0,104.0)*mix(.22,1.0,fap1CloudBreak(radial,t,20.0,.35,.70))*.46;','float commaIce=max(commaHead,commaWrap)*fap1Band(h,73.0,104.0)*mix(.22,1.0,fap1CloudBreak(radial,t,20.0,.35,.70))*.38;'])
    ])
  }),
  Object.freeze({
    id:'MESOSCALE_CONVECTIVE_COMPLEX',
    key:'mcc',lat:.139626,lon:-2.722714,
    replacements:Object.freeze([
      Object.freeze(['float mccTower=mccCore*fap1Band(h,30.0,105.0)*mccBreak*.96;','float mccTower=mccCore*fap1Band(h,30.0,105.0)*mccBreak*.90;']),
      Object.freeze(['float mccAnvil=fap1Ellipse(xq,vec2(.025,.075),vec2(.32,.19),-.08)*fap1Band(h,78.0,108.0)*mix(.30,1.0,fap1CloudBreak(radial,t,18.0,.33,.69))*.68;','float mccAnvil=fap1Ellipse(xq,vec2(.025,.075),vec2(.32,.19),-.08)*fap1Band(h,78.0,108.0)*mix(.30,1.0,fap1CloudBreak(radial,t,18.0,.33,.69))*.60;'])
    ])
  }),
  Object.freeze({
    id:'HIGH_CIRRUS_CIRROCUMULUS_JET_PLUME',
    key:'jet',lat:-.820305,lon:-2.495821,
    replacements:Object.freeze([
      Object.freeze(['float jetTexture=.22+.46*smoothstep(.42,.76,jetRipple*.48+jetBreak*.52);','float jetTexture=.18+.42*smoothstep(.42,.76,jetRipple*.48+jetBreak*.52);']),
      Object.freeze(['float cirrusPlume=jetEnvelope*fap1Band(h,81.0,108.0)*jetTexture*.58;','float cirrusPlume=jetEnvelope*fap1Band(h,81.0,108.0)*jetTexture*.46;'])
    ])
  }),
  Object.freeze({
    id:'CIRRUS_FIELD',
    key:'cirrus',lat:.610865,lon:-2.827433,
    replacements:Object.freeze([
      Object.freeze(['float cirrusTextureA=.17+.44*smoothstep(.36,.77,cirrusWaveA*.55+cirrusNoise*.45);','float cirrusTextureA=.12+.38*smoothstep(.36,.77,cirrusWaveA*.55+cirrusNoise*.45);']),
      Object.freeze(['float cirrusTextureB=.17+.42*smoothstep(.38,.78,cirrusWaveB*.52+cirrusNoise*.48);','float cirrusTextureB=.12+.36*smoothstep(.38,.78,cirrusWaveB*.52+cirrusNoise*.48);']),
      Object.freeze(['float cirrusTextureC=.17+.43*smoothstep(.37,.77,cirrusWaveC*.56+cirrusNoise*.44);','float cirrusTextureC=.12+.37*smoothstep(.37,.77,cirrusWaveC*.56+cirrusNoise*.44);']),
      Object.freeze(['float cirrusTextureD=.17+.41*smoothstep(.39,.79,cirrusWaveD*.54+cirrusNoise*.46);','float cirrusTextureD=.12+.35*smoothstep(.39,.79,cirrusWaveD*.54+cirrusNoise*.46);']),
      Object.freeze(['float cirrusFields=(cirrusEnvA*cirrusTextureA+cirrusEnvB*cirrusTextureB+cirrusEnvC*cirrusTextureC+cirrusEnvD*cirrusTextureD)*fap1Band(h,84.0,108.0)*.68;','float cirrusFields=(cirrusEnvA*cirrusTextureA+cirrusEnvB*cirrusTextureB+cirrusEnvC*cirrusTextureC+cirrusEnvD*cirrusTextureD)*fap1Band(h,84.0,108.0)*.50;'])
    ])
  }),
  Object.freeze({
    id:'CIRROSTRATUS_VEIL',
    key:'cirrostratus',lat:-.191986,lon:.872665,
    replacements:Object.freeze([
      Object.freeze(['float veilBreak=.22+.52*fap1CloudBreak(radial,t,10.0,.20,.64);','float veilBreak=.18+.45*fap1CloudBreak(radial,t,10.0,.20,.64);']),
      Object.freeze(['float cirrostratus=max(veilA,max(veilB,veilC))*fap1Band(h,76.0,104.0)*veilBreak*.72;','float cirrostratus=max(veilA,max(veilB,veilC))*fap1Band(h,76.0,104.0)*veilBreak*.58;'])
    ])
  }),
  Object.freeze({
    id:'ALTOCUMULUS_FIELD',
    key:'altocumulus',lat:.733038,lon:1.745329,
    replacements:Object.freeze([
      Object.freeze(['float altocumulus=(altoEnvA+altoEnvB+altoEnvC+altoEnvD)*fap1Band(h,52.0,79.0)*(.18+.70*altoCells)*.64;','float altocumulus=(altoEnvA+altoEnvB+altoEnvC+altoEnvD)*fap1Band(h,52.0,79.0)*(.12+.64*altoCells)*.48;'])
    ])
  })
]);

function replaceOnce(source,from,to,label){
  const first=source.indexOf(from);
  assert.ok(first>=0,`PRODUCER_ROLLBACK_TARGET_MISSING:${label}`);
  assert.equal(source.indexOf(from,first+from.length),-1,`PRODUCER_ROLLBACK_TARGET_AMBIGUOUS:${label}`);
  return source.slice(0,first)+to+source.slice(first+from.length);
}

function rollbackOneSystem(system){
  let source=directFap1;
  for(const [from,to] of system.replacements)source=replaceOnce(source,from,to,system.id);
  return source;
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

async function waitForComposition(page,{timeout=20000,label='composition'}={}){
  const started=Date.now();
  let last=null;
  while(Date.now()-started<timeout){
    last=await page.evaluate(()=>{
      const c=window.__AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION__;
      return {present:Boolean(c),policyId:c?.policyId||null,evidence:c?.getRuntimeEvidence?.()||null};
    });
    const ev=last?.evidence;
    if(last.present&&ev?.composedCloudShaders>=1&&typeof ev?.finalShaderSha256==='string'&&ev.finalShaderSha256.length===64&&ev?.finalStageEvidence?.pass===true)return last;
    await sleep(100);
  }
  throw new Error(`${label.toUpperCase()}_FINAL_COMPOSITION_TIMEOUT ${JSON.stringify(last)}`);
}

function installErrorCapture(page){
  const pageErrors=[],consoleErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  return {pageErrors,consoleErrors};
}

function targetFromLatLon(lat,lon){
  const R=6200;
  const north=[0,.5,-.8660254037844386];
  const meridian=[0,.8660254037844386,.5];
  const east=[1,0,0];
  const cl=Math.cos(lat);
  const direction=[0,1,2].map(i=>east[i]*cl*Math.sin(lon)+meridian[i]*cl*Math.cos(lon)+north[i]*Math.sin(lat));
  const length=Math.hypot(...direction)||1;
  for(let i=0;i<3;i++)direction[i]/=length;
  const angle=Math.acos(Math.max(-1,Math.min(1,direction[1])));
  const sine=Math.sin(angle);
  if(Math.abs(sine)<1e-9)return {targetU:0,targetV:0};
  return {targetU:R*angle*direction[0]/sine,targetV:R*angle*direction[2]/sine};
}

const PROBES=Object.freeze(SYSTEMS.map(system=>Object.freeze({
  id:system.id,
  ...targetFromLatLon(system.lat,system.lon),
  distance:5000,
  pitch:1.08,
  yaw:0
})));
const PROBE_BY_ID=new Map(PROBES.map(probe=>[probe.id,probe]));

async function captureExteriorMetrics(page,probe){
  return page.evaluate(async probe=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    if(!proof?.setCameraStateForTest)throw new Error('FINAL_FRAME_PROOF_CAMERA_CONTROL_MISSING');
    const state={targetU:probe.targetU,targetV:probe.targetV,distance:probe.distance,pitch:probe.pitch,yaw:probe.yaw};
    proof.setCameraStateForTest(state);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    proof.setCameraStateForTest(state);
    const canvas=proof.exterior?.overlay;
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('FINAL_FRAME_EXTERIOR_CANVAS_MISSING');
    const gl=canvas.getContext('webgl2');
    if(!gl)throw new Error('FINAL_FRAME_EXTERIOR_WEBGL2_MISSING');
    gl.finish();
    const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,total=width*height;
    if(total<=0)throw new Error('FINAL_FRAME_EMPTY_DRAWING_BUFFER');
    const pixels=new Uint8Array(total*4);
    gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let alphaNonzero=0,alphaStrong=0,alphaSum=0,rgbSum=0,weightedChecksum=0;
    for(let i=0,p=0;i<pixels.length;i+=4,p++){
      const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
      if(a>8)alphaNonzero++;
      if(a>32)alphaStrong++;
      alphaSum+=a/255;
      rgbSum+=(r+g+b)/(3*255);
      weightedChecksum=(weightedChecksum+((p%65521)+1)*(r+3*g+7*b+11*a))%2147483647;
    }
    const camera=proof.renderer?.getSnapshot?.()||null;
    return {id:probe.id,width,height,nonzeroFraction:alphaNonzero/total,strongFraction:alphaStrong/total,meanAlpha:alphaSum/total,meanRgb:rgbSum/total,weightedChecksum,camera};
  },probe);
}

async function captureVariant(browser,{id,producerSource=null,probes=PROBES}={}){
  const page=await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({width:720,height:1280,deviceScaleFactor:1});
  await page.evaluateOnNewDocument(fixed=>{
    const NativeDate=Date;
    class FixedDate extends NativeDate{
      constructor(...args){super(...(args.length?args:[fixed]));}
      static now(){return fixed;}
    }
    Object.setPrototypeOf(FixedDate,NativeDate);
    globalThis.Date=FixedDate;
  },FIXED_TIME_MS);
  if(typeof producerSource==='string'){
    await page.setRequestInterception(true);
    page.on('request',request=>{
      try{
        const url=new URL(request.url());
        if(url.pathname==='/showroom/globe/audralia/fap1-weather-presentation-v1.mjs'){
          request.respond({status:200,contentType:'text/javascript; charset=utf-8',body:producerSource});
          return;
        }
      }catch{}
      request.continue();
    });
  }
  const errors=installErrorCapture(page);
  await page.goto(`${base}/showroom/globe/audralia/?qualification=${encodeURIComponent(id)}`,{waitUntil:'domcontentloaded',timeout:60000});
  const authoritative=await waitForAuthoritativeRuntime(page,{label:id});
  const composition=await waitForComposition(page,{label:`${id}_composition`});
  const live=await page.evaluate(()=>({
    integration:window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__,
    producerPolicyId:window.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__?.policyId||null,
    producerEvidence:window.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__?.getRuntimeEvidence?.()||null,
    status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
    loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),
    worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,
    canvasCount:document.querySelectorAll('canvas').length,
    composition:window.__AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION__?.getRuntimeEvidence?.()||null
  }));
  const frames=[];
  for(const probe of probes)frames.push(await captureExteriorMetrics(page,probe));
  await page.close();
  return Object.freeze({id,authoritative,composition,live,probes:Object.freeze(frames),errors});
}

function delta(on,off){
  assert.equal(on.id,off.id,'FRAMEBUFFER_PROBE_ID_MISMATCH');
  assert.equal(on.width,off.width,'FRAMEBUFFER_WIDTH_MISMATCH');
  assert.equal(on.height,off.height,'FRAMEBUFFER_HEIGHT_MISMATCH');
  return Object.freeze({
    nonzeroFraction:on.nonzeroFraction-off.nonzeroFraction,
    strongFraction:on.strongFraction-off.strongFraction,
    meanAlpha:on.meanAlpha-off.meanAlpha,
    meanRgb:on.meanRgb-off.meanRgb,
    checksumDifferent:on.weightedChecksum!==off.weightedChecksum
  });
}

function compareAggregate(enabled,baseline){
  assert.equal(enabled.probes.length,baseline.probes.length,'FRAMEBUFFER_PROBE_COUNT_MISMATCH');
  const probes=enabled.probes.map((on,index)=>Object.freeze({id:on.id,enabled:on,baseline:baseline.probes[index],delta:delta(on,baseline.probes[index])}));
  const positive=probes.filter(p=>p.delta.meanAlpha>0&&p.delta.checksumDifferent);
  const material=probes.filter(p=>p.delta.meanAlpha>=.0015&&(p.delta.nonzeroFraction>=.002||p.delta.strongFraction>=.002));
  const maxMeanAlphaDelta=Math.max(...probes.map(p=>p.delta.meanAlpha));
  const maxCoverageDelta=Math.max(...probes.map(p=>Math.max(p.delta.nonzeroFraction,p.delta.strongFraction)));
  return Object.freeze({
    probes:Object.freeze(probes),
    positiveProbeCount:positive.length,
    materialProbeCount:material.length,
    maxMeanAlphaDelta,
    maxCoverageDelta,
    pass:positive.length>=2&&material.length>=1&&maxMeanAlphaDelta>=.0015&&maxCoverageDelta>=.002
  });
}

function validateRuntimeVariant(variant,{expectedProducerPolicyId}={}){
  assert.equal(variant.errors.pageErrors.length,0,`${variant.id.toUpperCase()}_PAGE_ERROR`);
  assert.equal(variant.live.integration?.schema,LIVE_SCHEMA,'LIVE_INTEGRATION_SCHEMA_DRIFT');
  assert.equal(variant.live.integration?.startupArchitecture,'APPROVED_PRESENTATION_PRE_RENDER_v1','LIVE_STARTUP_ARCHITECTURE_DRIFT');
  assert.equal(variant.live.integration?.cameraSemanticsFrozen,true,'LIVE_CAMERA_SEMANTICS_NOT_FROZEN');
  assert.equal(variant.live.integration?.finalCloudShaderComposition,POLICY_ID,'LIVE_FINAL_COMPOSITION_BINDING_MISSING');
  assert.equal(variant.live.integration?.fap1WeatherPopulationPolicy,PRODUCER_POLICY_ID,'PUBLIC_PRODUCER_IDENTITY_DRIFT');
  assert.equal(variant.live.producerPolicyId,expectedProducerPolicyId,'ACTUAL_PRODUCER_POLICY_IDENTITY_DRIFT');
  assert.ok(variant.live.loaderProgress>=4,'LIVE_LOADER_NOT_READY');
  assert.ok(String(variant.live.status).includes('USER_REVIEW_REQUIRED'),'LIVE_RUNTIME_NOT_READY');
  assert.equal(variant.live.worldCanvasCount,1,'LIVE_PRIMARY_WORLD_CANVAS_MULTIPLIED');
  assert.equal(variant.composition.policyId,POLICY_ID,'FINAL_COMPOSITION_POLICY_DRIFT');
  assert.equal(variant.composition.evidence?.finalStageEvidence?.pass,true,'FINAL_COMPOSITION_STAGE_FAILURE');
  assert.equal(variant.composition.evidence?.composedCloudShaders,1,'FINAL_COMPOSITION_EXPECTED_ONE_CLOUD_SHADER');
  assert.equal(variant.composition.evidence?.rejectedCloudShaders,0,'FINAL_COMPOSITION_REJECTED_SHADER');
  assert.equal(variant.composition.evidence?.finalShaderSha256?.length,64,'FINAL_SHADER_SHA256_MISSING');
  for(const stage of REQUIRED_STAGES){
    const evidence=variant.composition.evidence.finalStageEvidence.stages?.[stage];
    assert.equal(evidence?.observedMutationCount,evidence?.requiredMutationCount,`FINAL_STAGE_MUTATION_COUNT_FAILURE:${stage}`);
  }
}

const staticEvidence=staticCandidate();
console.log(JSON.stringify({staticEvidence},null,2));

const browser=await puppeteer.launch({
  executablePath:chrome,
  headless:'new',
  args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});

try{
  const enabled=await captureVariant(browser,{id:'enabled'});
  const baseline=await captureVariant(browser,{id:'aggregate_baseline_v6',producerSource:snapshotFap1});
  validateRuntimeVariant(enabled,{expectedProducerPolicyId:PRODUCER_POLICY_ID});
  validateRuntimeVariant(baseline,{expectedProducerPolicyId:BASELINE_PRODUCER_POLICY_ID});
  assert.notEqual(enabled.composition.evidence.finalShaderSha256,baseline.composition.evidence.finalShaderSha256,'AGGREGATE_BASELINE_FINAL_SHADER_HASH_IDENTICAL');

  const aggregate=compareAggregate(enabled,baseline);
  if(!aggregate.pass)throw new Error(`FRAMEBUFFER_AGGREGATE_CAUSALITY_FAILURE ${JSON.stringify({positiveProbeCount:aggregate.positiveProbeCount,materialProbeCount:aggregate.materialProbeCount,maxMeanAlphaDelta:aggregate.maxMeanAlphaDelta,maxCoverageDelta:aggregate.maxCoverageDelta})}`);

  const enabledById=new Map(enabled.probes.map(probe=>[probe.id,probe]));
  const perSystem=[];
  for(const system of SYSTEMS){
    const probe=PROBE_BY_ID.get(system.id);
    const rolledSource=rollbackOneSystem(system);
    const variant=await captureVariant(browser,{id:`system_${system.key}_baseline`,producerSource:rolledSource,probes:[probe]});
    validateRuntimeVariant(variant,{expectedProducerPolicyId:PRODUCER_POLICY_ID});
    assert.notEqual(enabled.composition.evidence.finalShaderSha256,variant.composition.evidence.finalShaderSha256,`SYSTEM_FINAL_SHADER_HASH_IDENTICAL:${system.id}`);
    const d=delta(enabledById.get(system.id),variant.probes[0]);
    perSystem.push(Object.freeze({
      id:system.id,
      rollbackKey:system.key,
      candidate:enabledById.get(system.id),
      rollback:variant.probes[0],
      delta:d,
      positive:d.meanAlpha>0&&d.checksumDifferent,
      material:d.meanAlpha>=.00025&&(d.nonzeroFraction>=.0005||d.strongFraction>=.0005),
      rollbackFinalShaderSha256:variant.composition.evidence.finalShaderSha256
    }));
  }

  const positiveSystems=perSystem.filter(item=>item.positive);
  const materialSystems=perSystem.filter(item=>item.material);
  const perSystemPass=positiveSystems.length===SYSTEMS.length&&materialSystems.length>=4;
  console.log(JSON.stringify({
    schema:'AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_CAUSAL_QUALIFICATION_v1',
    staticEvidence,
    enabled,
    baseline,
    aggregate,
    perSystem,
    perSystemSummary:Object.freeze({
      systemCount:SYSTEMS.length,
      positiveSystemCount:positiveSystems.length,
      materialSystemCount:materialSystems.length,
      pass:perSystemPass
    })
  },null,2));

  if(!perSystemPass)throw new Error(`PER_SYSTEM_CAUSALITY_FAILURE ${JSON.stringify({systemCount:SYSTEMS.length,positiveSystemCount:positiveSystems.length,materialSystemCount:materialSystems.length,failed:perSystem.filter(item=>!item.positive).map(item=>item.id)})}`);

  console.log(JSON.stringify({
    schema:'AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_CAUSAL_QUALIFICATION_v1',
    result:'PASS',
    operationId:'AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_20260827_001_SUCCESSOR_001',
    policyId:POLICY_ID,
    producerPolicyId:PRODUCER_POLICY_ID,
    protectedBaselinePolicyId:BASELINE_PRODUCER_POLICY_ID,
    protectedBaselineGitBlob:BASELINE_PRODUCER_GIT_BLOB,
    enabledFinalShaderSha256:enabled.composition.evidence.finalShaderSha256,
    baselineFinalShaderSha256:baseline.composition.evidence.finalShaderSha256,
    aggregate:Object.freeze({
      positiveProbeCount:aggregate.positiveProbeCount,
      materialProbeCount:aggregate.materialProbeCount,
      maxMeanAlphaDelta:aggregate.maxMeanAlphaDelta,
      maxCoverageDelta:aggregate.maxCoverageDelta
    }),
    perSystem:Object.freeze(perSystem.map(item=>Object.freeze({
      id:item.id,
      positive:item.positive,
      material:item.material,
      meanAlphaDelta:item.delta.meanAlpha,
      nonzeroFractionDelta:item.delta.nonzeroFraction,
      strongFractionDelta:item.delta.strongFraction,
      checksumDifferent:item.delta.checksumDifferent
    }))),
    positiveSystemCount:positiveSystems.length,
    materialSystemCount:materialSystems.length,
    singleVolumetricPassPreserved:true,
    performanceCeilingsFrozen:true,
    protected24057SnapshotMutated:false,
    productionDeploymentPerformed:false
  },null,2));
}finally{
  await browser.close();
}
