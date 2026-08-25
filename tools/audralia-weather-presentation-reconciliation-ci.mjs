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
const BASELINE_PRODUCT_HEAD='1a4d75c136fd20eca5c24bb21a96ae4ddbd4b1d8';
const BASELINE_SCHEMA='AUDRALIA_SPHERICAL_VISIBLE_WEATHER_BASELINE_v1';

const REQUIRED_STAGES=Object.freeze([
  'FAP1_ORGANIZED_WEATHER_V6',
  'XYZ_VOLUMETRIC_DEPTH_V2',
  'ACF1_PRESENTATION_V3',
  'DIRECT_DENSITY_V4'
]);
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

  return Object.freeze({
    policyId:POLICY_ID,
    liveSchema:LIVE_SCHEMA,
    baselineProductHead:BASELINE_PRODUCT_HEAD,
    fap1ByteParity:true,
    requiredStages:REQUIRED_STAGES,
    v6Families:V6_FAMILIES,
    glslVersionFirstLineGuard:true,
    frozenPerformanceCeilings:true,
    additionalRenderCanvasSource:false
  });
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
      return {
        present:Boolean(c),
        policyId:c?.policyId||null,
        contract:c?{
          singleVolumetricPassPreserved:c.singleVolumetricPassPreserved,
          additionalRenderPasses:c.additionalRenderPasses,
          additionalCanvases:c.additionalCanvases,
          rayMarchCeilingsChanged:c.rayMarchCeilingsChanged,
          pixelCeilingsChanged:c.pixelCeilingsChanged
        }:null,
        evidence:c?.getRuntimeEvidence?.()||null
      };
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

const PROBES=Object.freeze([
  Object.freeze({id:'CIRRUS_A',...targetFromLatLon(.610865,-2.827433),distance:5000,pitch:1.08,yaw:0}),
  Object.freeze({id:'CIRROSTRATUS_B',...targetFromLatLon(-.191986,.872665),distance:5000,pitch:1.08,yaw:.34}),
  Object.freeze({id:'ALTOCUMULUS_C',...targetFromLatLon(.733038,1.745329),distance:5000,pitch:1.08,yaw:-.28}),
  Object.freeze({id:'CIRRUS_C_NEAR_GRATITUDE',...targetFromLatLon(.209440,.191986),distance:5000,pitch:1.08,yaw:.18})
]);

const SWEEP_VIEWPORT=Object.freeze({width:320,height:180,deviceScaleFactor:1});
const SWEEP_LAT_CENTERS_DEG=Object.freeze([-75,-45,-15,15,45,75]);
const SWEEP_LON_CENTERS_DEG=Object.freeze([-165,-135,-105,-75,-45,-15,15,45,75,105,135,165]);
const REGION_LEVELS=Object.freeze([
  Object.freeze({id:'VISIBLE_2_PERCENT',metric:'nonzeroFraction',threshold:.02}),
  Object.freeze({id:'STRONG_1_PERCENT',metric:'strongFraction',threshold:.01}),
  Object.freeze({id:'MEAN_ALPHA_1_PERCENT',metric:'meanAlpha',threshold:.01})
]);

function degToRad(value){return value*Math.PI/180;}

function buildSweepSectors(){
  const sectors=[];
  for(let row=0;row<SWEEP_LAT_CENTERS_DEG.length;row++){
    const latDeg=SWEEP_LAT_CENTERS_DEG[row];
    const latLoDeg=Math.max(-90,latDeg-15),latHiDeg=Math.min(90,latDeg+15);
    for(let col=0;col<SWEEP_LON_CENTERS_DEG.length;col++){
      const lonDeg=SWEEP_LON_CENTERS_DEG[col];
      const lonLoDeg=lonDeg-15,lonHiDeg=lonDeg+15;
      const solidAngleSteradians=degToRad(lonHiDeg-lonLoDeg)*
        (Math.sin(degToRad(latHiDeg))-Math.sin(degToRad(latLoDeg)));
      sectors.push(Object.freeze({
        id:`LAT_${latDeg>=0?'P':'M'}${Math.abs(latDeg)}_LON_${lonDeg>=0?'P':'M'}${Math.abs(lonDeg)}`,
        row,col,latDeg,lonDeg,latLoDeg,latHiDeg,lonLoDeg,lonHiDeg,
        solidAngleSteradians,
        ...targetFromLatLon(degToRad(latDeg),degToRad(lonDeg)),
        distance:5000,pitch:1.08,yaw:0
      }));
    }
  }
  return Object.freeze(sectors);
}

const SWEEP_SECTORS=buildSweepSectors();

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
    return {
      id:probe.id,width,height,
      nonzeroFraction:alphaNonzero/total,
      strongFraction:alphaStrong/total,
      meanAlpha:alphaSum/total,
      meanRgb:rgbSum/total,
      weightedChecksum,
      camera
    };
  },probe);
}

function connectedRegions(sectors,level){
  const columns=SWEEP_LON_CENTERS_DEG.length;
  const rows=SWEEP_LAT_CENTERS_DEG.length;
  const byCell=new Map(sectors.map(sector=>[`${sector.row}:${sector.col}`,sector]));
  const occupied=new Set(sectors.filter(sector=>sector[level.metric]>=level.threshold).map(sector=>`${sector.row}:${sector.col}`));
  const seen=new Set(),regions=[];
  const neighbors=(row,col)=>[
    [row,(col+columns-1)%columns],
    [row,(col+1)%columns],
    [row-1,col],
    [row+1,col]
  ].filter(([r])=>r>=0&&r<rows);

  for(const key of occupied){
    if(seen.has(key))continue;
    const queue=[key],members=[];
    seen.add(key);
    while(queue.length){
      const current=queue.shift();
      const sector=byCell.get(current);
      members.push(sector);
      for(const [nr,nc] of neighbors(sector.row,sector.col)){
        const neighborKey=`${nr}:${nc}`;
        if(occupied.has(neighborKey)&&!seen.has(neighborKey)){
          seen.add(neighborKey);
          queue.push(neighborKey);
        }
      }
    }
    const solidAngleSteradians=members.reduce((sum,sector)=>sum+sector.solidAngleSteradians,0);
    regions.push(Object.freeze({
      sectorCount:members.length,
      solidAngleSteradians,
      sphereFraction:solidAngleSteradians/(4*Math.PI),
      sectorIds:Object.freeze(members.map(sector=>sector.id).sort())
    }));
  }
  regions.sort((a,b)=>b.solidAngleSteradians-a.solidAngleSteradians);
  const occupiedSolidAngle=sectors.filter(sector=>sector[level.metric]>=level.threshold)
    .reduce((sum,sector)=>sum+sector.solidAngleSteradians,0);
  return Object.freeze({
    ...level,
    occupiedSectorCount:occupied.size,
    occupiedSphereFraction:occupiedSolidAngle/(4*Math.PI),
    disconnectedRegionCount:regions.length,
    regions:Object.freeze(regions)
  });
}

function analyzeSphericalBaseline(samples){
  assert.equal(samples.length,SWEEP_SECTORS.length,'SPHERICAL_BASELINE_SECTOR_COUNT_MISMATCH');
  const totalSolidAngle=samples.reduce((sum,sector)=>sum+sector.solidAngleSteradians,0);
  assert.ok(Math.abs(totalSolidAngle-4*Math.PI)<1e-9,'SPHERICAL_BASELINE_INCOMPLETE_SOLID_ANGLE');
  const weighted=metric=>samples.reduce((sum,sector)=>sum+sector[metric]*sector.solidAngleSteradians,0)/totalSolidAngle;
  const rankedEmptySectors=[...samples].sort((a,b)=>
    a.strongFraction-b.strongFraction||
    a.meanAlpha-b.meanAlpha||
    a.nonzeroFraction-b.nonzeroFraction||
    a.row-b.row||
    a.col-b.col
  ).slice(0,12).map(sector=>Object.freeze({
    id:sector.id,
    row:sector.row,col:sector.col,
    latDeg:sector.latDeg,lonDeg:sector.lonDeg,
    strongFraction:sector.strongFraction,
    nonzeroFraction:sector.nonzeroFraction,
    meanAlpha:sector.meanAlpha,
    solidAngleSteradians:sector.solidAngleSteradians
  }));
  const regionAnalyses=REGION_LEVELS.map(level=>connectedRegions(samples,level));
  return Object.freeze({
    schema:BASELINE_SCHEMA,
    productHead:BASELINE_PRODUCT_HEAD,
    candidateHead:process.env.GITHUB_SHA||null,
    fixedTimeIso:new Date(FIXED_TIME_MS).toISOString(),
    measurementUnit:'FRAMEBUFFER_FRACTION_PER_ANGULAR_CELL',
    camera:Object.freeze({distance:5000,pitch:1.08,yaw:0}),
    viewport:SWEEP_VIEWPORT,
    grid:Object.freeze({
      latitudeBands:SWEEP_LAT_CENTERS_DEG.length,
      longitudeSectors:SWEEP_LON_CENTERS_DEG.length,
      sectorCount:samples.length,
      sectorSpanDegrees:30,
      totalSolidAngleSteradians:totalSolidAngle,
      fullSphereSolidAngleSteradians:4*Math.PI,
      fullAngularCoverage:true
    }),
    global:Object.freeze({
      areaWeightedNonzeroFraction:weighted('nonzeroFraction'),
      areaWeightedStrongFraction:weighted('strongFraction'),
      areaWeightedMeanAlpha:weighted('meanAlpha'),
      areaWeightedMeanRgb:weighted('meanRgb')
    }),
    regionAnalyses:Object.freeze(regionAnalyses),
    rankedEmptySectors:Object.freeze(rankedEmptySectors),
    sectors:Object.freeze(samples)
  });
}

async function captureSphericalBaseline(page){
  await page.setViewport(SWEEP_VIEWPORT);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const samples=[];
  for(const sector of SWEEP_SECTORS){
    const metrics=await captureExteriorMetrics(page,sector);
    samples.push(Object.freeze({
      id:sector.id,
      row:sector.row,col:sector.col,
      latDeg:sector.latDeg,lonDeg:sector.lonDeg,
      latLoDeg:sector.latLoDeg,latHiDeg:sector.latHiDeg,
      lonLoDeg:sector.lonLoDeg,lonHiDeg:sector.lonHiDeg,
      solidAngleSteradians:sector.solidAngleSteradians,
      width:metrics.width,height:metrics.height,
      nonzeroFraction:metrics.nonzeroFraction,
      strongFraction:metrics.strongFraction,
      meanAlpha:metrics.meanAlpha,
      meanRgb:metrics.meanRgb,
      weightedChecksum:metrics.weightedChecksum
    }));
  }
  return analyzeSphericalBaseline(samples);
}

async function captureVariant(browser,{ablateV6=false}={}){
  const page=await browser.newPage();
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
  const errors=installErrorCapture(page);
  const suffix=ablateV6?'?cloudAblation=v6':'';
  await page.goto(`${base}/showroom/globe/audralia/${suffix}`,{waitUntil:'domcontentloaded',timeout:60000});
  const authoritative=await waitForAuthoritativeRuntime(page,{label:ablateV6?'ablated':'enabled'});
  const composition=await waitForComposition(page,{label:ablateV6?'ablated_composition':'enabled_composition'});
  const live=await page.evaluate(()=>({
    integration:window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__,
    status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
    loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),
    worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,
    canvasCount:document.querySelectorAll('canvas').length,
    composition:window.__AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION__?.getRuntimeEvidence?.()||null
  }));
  const probes=[];
  for(const probe of PROBES)probes.push(await captureExteriorMetrics(page,probe));
  const sphericalBaseline=ablateV6?null:await captureSphericalBaseline(page);
  await page.close();
  return Object.freeze({ablateV6,authoritative,composition,live,probes,sphericalBaseline,errors});
}

function compareCausality(enabled,ablated){
  assert.equal(enabled.probes.length,ablated.probes.length,'FRAMEBUFFER_PROBE_COUNT_MISMATCH');
  const probes=enabled.probes.map((on,index)=>{
    const off=ablated.probes[index];
    assert.equal(on.id,off.id,'FRAMEBUFFER_PROBE_ID_MISMATCH');
    assert.equal(on.width,off.width,'FRAMEBUFFER_WIDTH_MISMATCH');
    assert.equal(on.height,off.height,'FRAMEBUFFER_HEIGHT_MISMATCH');
    return Object.freeze({
      id:on.id,
      enabled:on,
      ablated:off,
      delta:Object.freeze({
        nonzeroFraction:on.nonzeroFraction-off.nonzeroFraction,
        strongFraction:on.strongFraction-off.strongFraction,
        meanAlpha:on.meanAlpha-off.meanAlpha,
        meanRgb:on.meanRgb-off.meanRgb,
        checksumDifferent:on.weightedChecksum!==off.weightedChecksum
      })
    });
  });
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

const staticEvidence=staticCandidate();
console.log(JSON.stringify({staticEvidence},null,2));

const browser=await puppeteer.launch({
  executablePath:chrome,
  headless:'new',
  args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});

try{
  const enabled=await captureVariant(browser,{ablateV6:false});
  const ablated=await captureVariant(browser,{ablateV6:true});

  for(const variant of [enabled,ablated]){
    assert.equal(variant.errors.pageErrors.length,0,`${variant.ablateV6?'ABLATION':'ENABLED'}_PAGE_ERROR`);
    assert.equal(variant.live.integration?.schema,LIVE_SCHEMA,'LIVE_INTEGRATION_SCHEMA_DRIFT');
    assert.equal(variant.live.integration?.startupArchitecture,'APPROVED_PRESENTATION_PRE_RENDER_v1','LIVE_STARTUP_ARCHITECTURE_DRIFT');
    assert.equal(variant.live.integration?.cameraSemanticsFrozen,true,'LIVE_CAMERA_SEMANTICS_NOT_FROZEN');
    assert.equal(variant.live.integration?.finalCloudShaderComposition,POLICY_ID,'LIVE_FINAL_COMPOSITION_BINDING_MISSING');
    assert.ok(variant.live.loaderProgress>=4,'LIVE_LOADER_NOT_READY');
    assert.ok(String(variant.live.status).includes('USER_REVIEW_REQUIRED'),'LIVE_RUNTIME_NOT_READY');
    assert.equal(variant.live.worldCanvasCount,1,'LIVE_PRIMARY_WORLD_CANVAS_MULTIPLIED');
    assert.equal(variant.composition.policyId,POLICY_ID,'FINAL_COMPOSITION_POLICY_DRIFT');
    assert.equal(variant.composition.contract?.singleVolumetricPassPreserved,true,'FINAL_COMPOSITION_SINGLE_PASS_NOT_PRESERVED');
    assert.equal(variant.composition.contract?.additionalRenderPasses,0,'FINAL_COMPOSITION_RENDER_PASS_MULTIPLIED');
    assert.equal(variant.composition.contract?.additionalCanvases,0,'FINAL_COMPOSITION_CANVAS_MULTIPLIED');
    assert.equal(variant.composition.contract?.rayMarchCeilingsChanged,false,'FINAL_COMPOSITION_RAY_MARCH_CEILING_CHANGED');
    assert.equal(variant.composition.contract?.pixelCeilingsChanged,false,'FINAL_COMPOSITION_PIXEL_CEILING_CHANGED');
    assert.equal(variant.composition.evidence?.finalStageEvidence?.pass,true,'FINAL_COMPOSITION_STAGE_FAILURE');
    assert.equal(variant.composition.evidence?.composedCloudShaders,1,'FINAL_COMPOSITION_EXPECTED_ONE_CLOUD_SHADER');
    assert.equal(variant.composition.evidence?.rejectedCloudShaders,0,'FINAL_COMPOSITION_REJECTED_SHADER');
    assert.equal(variant.composition.evidence?.finalShaderSha256?.length,64,'FINAL_SHADER_SHA256_MISSING');
    for(const stage of REQUIRED_STAGES){
      const evidence=variant.composition.evidence.finalStageEvidence.stages?.[stage];
      assert.equal(evidence?.observedMutationCount,evidence?.requiredMutationCount,`FINAL_STAGE_MUTATION_COUNT_FAILURE:${stage}`);
    }
  }

  assert.equal(enabled.composition.evidence.finalAblationMode,'NONE','ENABLED_VARIANT_ABLATION_STATE_WRONG');
  assert.equal(ablated.composition.evidence.finalAblationMode,'V6_FIELDS_ABLATED','ABLATION_VARIANT_STATE_WRONG');
  assert.notEqual(enabled.composition.evidence.finalShaderSha256,ablated.composition.evidence.finalShaderSha256,'V6_ABLATION_FINAL_SHADER_HASH_IDENTICAL');

  const causality=compareCausality(enabled,ablated);
  console.log(JSON.stringify({schema:'AUDRALIA_FINAL_CLOUD_SHADER_CAUSALITY_QUALIFICATION_v1',staticEvidence,enabled:{...enabled,sphericalBaseline:undefined},ablated,causality},null,2));
  if(!causality.pass)throw new Error(`FRAMEBUFFER_CAUSALITY_FAILURE ${JSON.stringify({positiveProbeCount:causality.positiveProbeCount,materialProbeCount:causality.materialProbeCount,maxMeanAlphaDelta:causality.maxMeanAlphaDelta,maxCoverageDelta:causality.maxCoverageDelta})}`);

  const sphericalBaseline=enabled.sphericalBaseline;
  assert.equal(sphericalBaseline?.schema,BASELINE_SCHEMA,'SPHERICAL_BASELINE_SCHEMA_MISSING');
  assert.equal(sphericalBaseline?.productHead,BASELINE_PRODUCT_HEAD,'SPHERICAL_BASELINE_PRODUCT_HEAD_DRIFT');
  assert.equal(sphericalBaseline?.grid?.sectorCount,72,'SPHERICAL_BASELINE_SECTOR_COUNT_FAILURE');
  assert.equal(sphericalBaseline?.grid?.fullAngularCoverage,true,'SPHERICAL_BASELINE_ANGULAR_COVERAGE_FAILURE');
  assert.equal(sphericalBaseline?.regionAnalyses?.length,REGION_LEVELS.length,'SPHERICAL_BASELINE_REGION_ANALYSIS_MISSING');
  assert.ok(sphericalBaseline.rankedEmptySectors.length>=1,'SPHERICAL_BASELINE_EMPTY_SECTOR_RANKING_MISSING');

  console.log(JSON.stringify(sphericalBaseline,null,2));

  console.log(JSON.stringify({
    schema:'AUDRALIA_FINAL_CLOUD_SHADER_CAUSALITY_QUALIFICATION_v1',
    result:'PASS',
    policyId:POLICY_ID,
    enabledFinalShaderSha256:enabled.composition.evidence.finalShaderSha256,
    ablatedFinalShaderSha256:ablated.composition.evidence.finalShaderSha256,
    finalStageEvidence:enabled.composition.evidence.finalStageEvidence,
    causality:Object.freeze({
      positiveProbeCount:causality.positiveProbeCount,
      materialProbeCount:causality.materialProbeCount,
      maxMeanAlphaDelta:causality.maxMeanAlphaDelta,
      maxCoverageDelta:causality.maxCoverageDelta
    }),
    sphericalVisibleWeatherBaseline:Object.freeze({
      schema:sphericalBaseline.schema,
      productHead:sphericalBaseline.productHead,
      sectorCount:sphericalBaseline.grid.sectorCount,
      fullAngularCoverage:sphericalBaseline.grid.fullAngularCoverage,
      global:sphericalBaseline.global,
      regionAnalyses:sphericalBaseline.regionAnalyses.map(region=>({
        id:region.id,
        metric:region.metric,
        threshold:region.threshold,
        occupiedSphereFraction:region.occupiedSphereFraction,
        disconnectedRegionCount:region.disconnectedRegionCount
      })),
      rankedEmptySectors:sphericalBaseline.rankedEmptySectors
    }),
    singleVolumetricPassPreserved:true,
    performanceCeilingsFrozen:true,
    productionDeploymentPerformed:false
  },null,2));
}finally{
  await browser.close();
}
