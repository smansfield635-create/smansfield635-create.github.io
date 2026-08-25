#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
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
const FROZEN_C3_HEAD='c3a88dc4bdb47bb9116acd6cfd1cfc4e30ade4ff';
const FROZEN_C3_COMPOSITOR_GIT_BLOB='e5bcbe65abb051fc5648a3c8bf1e16a4ecc2837e';
const FROZEN_C3_COMPOSITOR_SHA256='8dd2dcb76f090b6e7f4520160d5ec7d2c5c52c7fe59f422ddfad2a5ed156c4e2';
const FAIL_FIRST_SCHEMA='AUDRALIA_FINAL_EXPANSION_FAIL_FIRST_VISUAL_VERIFIER_v1';
const FAILING_CORPUS_SCHEMA='AUDRALIA_C3_FAILING_CORPUS_RECEIPT_v1';
const ATLAS_ROWS=90,ATLAS_COLUMNS=180,ATLAS_RADIUS=6405;
const POLAR_PIXEL_FOOTPRINT_HALF_WIDTH_COLUMNS=2;
const SWEEP_LATITUDES_DEG=Object.freeze([-75,-45,-15,15,45,75]);
const SWEEP_LONGITUDES_DEG=Object.freeze([-165,-135,-105,-75,-45,-15,15,45,75,105,135,165]);
const MATERIAL_COMPONENT_MIN_SPHERE_FRACTION=.0025;
const SATURATION_SUPPRESSION_LIMIT=.25;
const DELTA_LEVELS=Object.freeze([
  Object.freeze({id:'DELTA_1',threshold:1}),
  Object.freeze({id:'DELTA_4',threshold:4})
]);

const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const REQUIRED_STAGES=Object.freeze([
  'FAP1_ORGANIZED_WEATHER_V6',
  'XYZ_VOLUMETRIC_DEPTH_V2',
  'ACF1_PRESENTATION_V3',
  'DIRECT_DENSITY_V4',
  'FINAL_DENSITY_EXPANSION_V1'
]);
const V6_FAMILIES=Object.freeze(['CIRRUS_FIELD','CIRROSTRATUS_VEIL','ALTOCUMULUS_FIELD']);

function staticCandidate(){
  const index=fs.readFileSync(INDEX,'utf8');
  const compositor=fs.readFileSync(COMPOSITOR,'utf8');
  const directFap1=fs.readFileSync(DIRECT_FAP1,'utf8');
  const snapshotFap1=fs.readFileSync(SNAPSHOT_FAP1,'utf8');
  const renderer=fs.readFileSync(SNAPSHOT_RENDERER,'utf8');
  const compositorSha256=sha256(compositor);
  const compositorLength=Buffer.byteLength(compositor,'utf8');

  assert.equal(directFap1,snapshotFap1,'FAP1_SOURCE_SNAPSHOT_BYTE_PARITY_FAILURE');
  assert.match(index,new RegExp(LIVE_SCHEMA),'LIVE_FINAL_COMPOSITION_SCHEMA_MISSING');
  assert.match(index,/final-cloud-shader-composition-v1\.mjs\?cb=AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION_v[0-9]+/,'FINAL_COMPOSITOR_REQUEST_IDENTITY_MISSING');
  assert.doesNotMatch(index,/type="module" src="\.\/fap1-orbital-support-tuning-v1\.mjs/,'LEGACY_DIRECT_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/acf1-cloud-presentation-v1\.mjs/,'LEGACY_ACF1_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-xyz-volumetric-depth-v1\.mjs/,'LEGACY_XYZ_WRAPPER_STILL_BOOTED_SEPARATELY');
  assert.doesNotMatch(index,/type="module" src="\/inspection\/audralia-24057-exact\/snapshot\/showroom\/globe\/audralia\/fap1-weather-presentation-v1\.mjs/,'LEGACY_FAP1_WRAPPER_STILL_BOOTED_SEPARATELY');

  assert.match(compositor,new RegExp(POLICY_ID),'FINAL_COMPOSITOR_POLICY_MISSING');
  assert.match(compositor,/AUDRALIA_FINAL_DIRECT_DENSITY_SUPPORT_v1/,'FINAL_DIRECT_DENSITY_REPAIR_MISSING');
  assert.match(compositor,/cloudAblation/,'V6_ABLATION_CONTROL_MISSING');
  assert.match(compositor,/ablate==='finalExpansion'/,'FINAL_EXPANSION_ABLATION_CONTROL_MISSING');
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
    frozenC3Head:FROZEN_C3_HEAD,
    frozenC3CompositorGitBlob:FROZEN_C3_COMPOSITOR_GIT_BLOB,
    compositorSha256,
    compositorLength,
    frozenC3ProductCorpus:compositorSha256===FROZEN_C3_COMPOSITOR_SHA256,
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


function buildAtlasViews(){
  const views=[];
  for(const latDeg of SWEEP_LATITUDES_DEG){
    for(const lonDeg of SWEEP_LONGITUDES_DEG){
      views.push(Object.freeze({
        id:'ATLAS_LAT_'+String(latDeg).replace('-','M')+'_LON_'+String(lonDeg).replace('-','M'),
        latDeg,lonDeg,
        ...targetFromLatLon(latDeg*Math.PI/180,lonDeg*Math.PI/180),
        distance:5000,pitch:1.08,yaw:0
      }));
    }
  }
  const poleYaws=Object.freeze([0,Math.PI/8,Math.PI/4,3*Math.PI/8,Math.PI/2,5*Math.PI/8,3*Math.PI/4,7*Math.PI/8]);
  for(const [poleId,latDeg] of [['NORTH',90],['SOUTH',-90]]){
    for(let yawIndex=0;yawIndex<poleYaws.length;yawIndex++){
      views.push(Object.freeze({
        id:'ATLAS_POLE_'+poleId+'_YAW_'+yawIndex,latDeg,lonDeg:0,
        ...targetFromLatLon(latDeg*Math.PI/180,0),
        distance:5000,pitch:1.08,yaw:poleYaws[yawIndex]
      }));
    }
  }
  return Object.freeze(views);
}
const ATLAS_VIEWS=buildAtlasViews();

async function captureServedCompositorIdentity(page){
  return page.evaluate(async()=>{
    const script=[...document.scripts].find(node=>String(node.src||'').includes('final-cloud-shader-composition-v1.mjs'));
    if(!script)throw new Error('SERVED_COMPOSITOR_SCRIPT_ELEMENT_MISSING');
    const response=await fetch(script.src,{cache:'no-store'});
    if(!response.ok)throw new Error('SERVED_COMPOSITOR_FETCH_FAILED:'+response.status);
    const buffer=await response.arrayBuffer();
    const digest=await crypto.subtle.digest('SHA-256',buffer);
    return {
      url:script.src,
      sha256:[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join(''),
      byteLength:buffer.byteLength
    };
  });
}

async function accumulateAtlasFrame(page,probe){
  return page.evaluate(async input=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    if(!proof?.setCameraStateForTest)throw new Error('ATLAS_CAMERA_CONTROL_MISSING');
    const state={targetU:input.targetU,targetV:input.targetV,distance:input.distance,pitch:input.pitch,yaw:input.yaw};
    proof.setCameraStateForTest(state);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    proof.setCameraStateForTest(state);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const canvas=proof.exterior?.overlay;
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('ATLAS_EXTERIOR_CANVAS_MISSING');
    const gl=canvas.getContext('webgl2');
    if(!gl)throw new Error('ATLAS_WEBGL2_MISSING');
    gl.finish();
    const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,total=width*height;
    if(total<=0)throw new Error('ATLAS_EMPTY_DRAWING_BUFFER');
    const pixels=new Uint8Array(total*4);
    gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    const program=gl.getParameter(gl.CURRENT_PROGRAM);
    if(!program)throw new Error('ATLAS_CURRENT_PROGRAM_MISSING');
    const readUniform=name=>{
      const location=gl.getUniformLocation(program,name);
      if(location===null)throw new Error('ATLAS_UNIFORM_MISSING:'+name);
      const value=gl.getUniform(program,location);
      return typeof value==='number'?value:Array.from(value);
    };
    const eye=readUniform('uEye'),forward=readUniform('uForward'),right=readUniform('uRight'),up=readUniform('uUp');
    const aspect=readUniform('uAspect'),tanHalfFov=readUniform('uTanHalfFov');
    const rows=input.rows,columns=input.columns,size=rows*columns;
    let atlas=globalThis.__AUDRALIA_FAIL_FIRST_ATLAS__;
    if(!atlas){
      atlas=globalThis.__AUDRALIA_FAIL_FIRST_ATLAS__={
        rows,columns,
        count:new Uint32Array(size),
        sumR:new Float64Array(size),
        sumG:new Float64Array(size),
        sumB:new Float64Array(size),
        sumA:new Float64Array(size),
        maxA:new Uint8Array(size),
        maxLuma:new Uint8Array(size),
        frameCount:0,
        mappedPixelCount:0
      };
    }
    if(atlas.rows!==rows||atlas.columns!==columns)throw new Error('ATLAS_DIMENSION_DRIFT');
    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const normalize=value=>{
      const length=Math.hypot(value[0],value[1],value[2])||1;
      return [value[0]/length,value[1]/length,value[2]/length];
    };
    const center=[0,-6200,0],north=[0,.5,-.8660254037844386],meridian=[0,.8660254037844386,.5],east=[1,0,0];
    const origin=[eye[0]-center[0],eye[1]-center[1],eye[2]-center[2]];
    let mapped=0;
    for(let y=0;y<height;y++){
      const ndcY=((y+.5)/height)*2-1;
      for(let x=0;x<width;x++){
        const ndcX=((x+.5)/width)*2-1;
        const ray=normalize([
          forward[0]+right[0]*(ndcX*aspect*tanHalfFov)+up[0]*(ndcY*tanHalfFov),
          forward[1]+right[1]*(ndcX*aspect*tanHalfFov)+up[1]*(ndcY*tanHalfFov),
          forward[2]+right[2]*(ndcX*aspect*tanHalfFov)+up[2]*(ndcY*tanHalfFov)
        ]);
        const b=dot(origin,ray),c=dot(origin,origin)-input.radius*input.radius,disc=b*b-c;
        if(disc<0)continue;
        const root=Math.sqrt(disc),near=-b-root,far=-b+root;
        const t=near>0?near:(far>0?far:-1);
        if(t<=0)continue;
        const radial=normalize([
          eye[0]+ray[0]*t-center[0],
          eye[1]+ray[1]*t-center[1],
          eye[2]+ray[2]*t-center[2]
        ]);
        const lat=Math.asin(Math.max(-1,Math.min(1,dot(radial,north))));
        const lon=Math.atan2(dot(radial,east),dot(radial,meridian));
        const row=Math.max(0,Math.min(rows-1,Math.floor((lat+Math.PI/2)/Math.PI*rows)));
        const column=Math.max(0,Math.min(columns-1,Math.floor((lon+Math.PI)/(2*Math.PI)*columns)));
        const pixel=(y*width+x)*4;
        const r=pixels[pixel],g=pixels[pixel+1],blue=pixels[pixel+2],a=pixels[pixel+3];
        const luma=Math.round((r+g+blue)/3);
        const polar=row===0||row===rows-1;
        const halfWidth=polar?input.polarFootprintHalfWidthColumns:0;
        for(let offset=-halfWidth;offset<=halfWidth;offset++){
          const footprintColumn=(column+offset+columns)%columns;
          const cell=row*columns+footprintColumn;
          atlas.count[cell]++;
          atlas.sumR[cell]+=r;
          atlas.sumG[cell]+=g;
          atlas.sumB[cell]+=blue;
          atlas.sumA[cell]+=a;
          atlas.maxA[cell]=Math.max(atlas.maxA[cell],a);
          atlas.maxLuma[cell]=Math.max(atlas.maxLuma[cell],luma);
        }
        mapped++;
      }
    }
    atlas.frameCount++;
    atlas.mappedPixelCount+=mapped;
    return {id:input.id,width,height,mapped,frameCount:atlas.frameCount};
  },{...probe,rows:ATLAS_ROWS,columns:ATLAS_COLUMNS,radius:ATLAS_RADIUS,polarFootprintHalfWidthColumns:POLAR_PIXEL_FOOTPRINT_HALF_WIDTH_COLUMNS});
}

async function captureSphericalAtlas(page){
  await page.setViewport({width:320,height:180,deviceScaleFactor:1});
  await page.evaluate(()=>{delete globalThis.__AUDRALIA_FAIL_FIRST_ATLAS__;});
  const frames=[];
  for(const view of ATLAS_VIEWS)frames.push(await accumulateAtlasFrame(page,view));
  const atlas=await page.evaluate(()=>{
    const value=globalThis.__AUDRALIA_FAIL_FIRST_ATLAS__;
    if(!value)throw new Error('ATLAS_ACCUMULATOR_MISSING');
    return {
      rows:value.rows,
      columns:value.columns,
      frameCount:value.frameCount,
      mappedPixelCount:value.mappedPixelCount,
      count:Array.from(value.count),
      sumR:Array.from(value.sumR),
      sumG:Array.from(value.sumG),
      sumB:Array.from(value.sumB),
      sumA:Array.from(value.sumA),
      maxA:Array.from(value.maxA),
      maxLuma:Array.from(value.maxLuma)
    };
  });
  assert.equal(atlas.frameCount,ATLAS_VIEWS.length,'ATLAS_VIEW_COUNT_MISMATCH');
  return Object.freeze({...atlas,frames:Object.freeze(frames)});
}

function summarizeAtlasCoverage(atlas){
  const missingByRow=[];
  const missingCellExamples=[];
  let missingCells=0;
  for(let row=0;row<atlas.rows;row++){
    let rowMissing=0;
    for(let column=0;column<atlas.columns;column++){
      if(atlas.count[row*atlas.columns+column]>0)continue;
      missingCells++;
      rowMissing++;
      if(missingCellExamples.length<40)missingCellExamples.push({
        row,column,
        latCenterDeg:-90+(row+.5)*180/atlas.rows,
        lonCenterDeg:-180+(column+.5)*360/atlas.columns
      });
    }
    if(rowMissing>0)missingByRow.push({row,missingCells:rowMissing});
  }
  return Object.freeze({
    rows:atlas.rows,
    columns:atlas.columns,
    viewCount:atlas.frameCount,
    mappedPixelCount:atlas.mappedPixelCount,
    polarPixelFootprintHalfWidthColumns:POLAR_PIXEL_FOOTPRINT_HALF_WIDTH_COLUMNS,
    missingCells,
    missingByRow:Object.freeze(missingByRow),
    missingCellExamples:Object.freeze(missingCellExamples)
  });
}

function cellSphereFraction(row,rows,columns){
  const latLo=-Math.PI/2+row*Math.PI/rows;
  const latHi=-Math.PI/2+(row+1)*Math.PI/rows;
  return (2*Math.PI/columns)*(Math.sin(latHi)-Math.sin(latLo))/(4*Math.PI);
}

function componentAnalysis(strength,threshold,rows,columns){
  const size=rows*columns,mask=new Uint8Array(size);
  for(let index=0;index<size;index++)if(strength[index]>=threshold)mask[index]=1;
  const seen=new Uint8Array(size),components=[];
  const neighbors=(row,column)=>{
    const result=[];
    for(let dr=-1;dr<=1;dr++){
      for(let dc=-1;dc<=1;dc++){
        if(dr===0&&dc===0)continue;
        const nextRow=row+dr;
        if(nextRow<0||nextRow>=rows)continue;
        result.push(nextRow*columns+((column+dc+columns)%columns));
      }
    }
    if(row===0)for(let c=0;c<columns;c++)result.push(c);
    if(row===rows-1)for(let c=0;c<columns;c++)result.push((rows-1)*columns+c);
    return result;
  };
  for(let start=0;start<size;start++){
    if(!mask[start]||seen[start])continue;
    const queue=[start],cells=[];
    seen[start]=1;
    while(queue.length){
      const current=queue.pop();
      cells.push(current);
      const row=Math.floor(current/columns),column=current%columns;
      for(const next of neighbors(row,column)){
        if(mask[next]&&!seen[next]){
          seen[next]=1;
          queue.push(next);
        }
      }
    }
    const sphereFraction=cells.reduce((sum,index)=>sum+cellSphereFraction(Math.floor(index/columns),rows,columns),0);
    components.push({cells,sphereFraction,cellCount:cells.length});
  }
  components.sort((a,b)=>b.sphereFraction-a.sphereFraction);
  const material=components.filter(component=>component.sphereFraction>=MATERIAL_COMPONENT_MIN_SPHERE_FRACTION);
  let minimumGapCells=null;
  if(material.length>1){
    minimumGapCells=Infinity;
    for(let a=0;a<material.length;a++){
      for(let b=a+1;b<material.length;b++){
        for(const left of material[a].cells){
          const lr=Math.floor(left/columns),lc=left%columns;
          for(const right of material[b].cells){
            const rr=Math.floor(right/columns),rc=right%columns;
            const dc=Math.abs(lc-rc),wrapped=Math.min(dc,columns-dc);
            const gap=Math.max(Math.abs(lr-rr),wrapped);
            if(gap<minimumGapCells)minimumGapCells=gap;
            if(minimumGapCells<2)break;
          }
          if(minimumGapCells<2)break;
        }
        if(minimumGapCells<2)break;
      }
      if(minimumGapCells<2)break;
    }
  }
  return {
    threshold,
    occupiedCellCount:mask.reduce((sum,value)=>sum+value,0),
    componentCount:components.length,
    materialComponentCount:material.length,
    minimumMaterialSphereFraction:MATERIAL_COMPONENT_MIN_SPHERE_FRACTION,
    minimumGapCells,
    trueClearAirSeparated:material.length>=2&&minimumGapCells>=2,
    materialComponents:material,
    publicComponents:material.map((component,index)=>({
      id:'COMPONENT_'+String(index+1),
      cellCount:component.cellCount,
      sphereFraction:component.sphereFraction
    }))
  };
}

function buildFailFirstAnalysis(enabled,ablated,isolated){
  const atlases=[enabled,ablated,isolated];
  for(const atlas of atlases){
    assert.equal(atlas.rows,ATLAS_ROWS,'ATLAS_ROW_COUNT_MISMATCH');
    assert.equal(atlas.columns,ATLAS_COLUMNS,'ATLAS_COLUMN_COUNT_MISMATCH');
  }
  const size=ATLAS_ROWS*ATLAS_COLUMNS;
  const deltaStrength=new Float64Array(size),isolatedStrength=new Float64Array(size);
  let missingCells=0,coveredSphereFraction=0;
  for(let index=0;index<size;index++){
    const counts=[enabled.count[index],ablated.count[index],isolated.count[index]];
    if(counts.some(count=>count<=0)){missingCells++;continue;}
    if(counts[0]!==counts[1]||counts[0]!==counts[2])throw new Error('ATLAS_SAMPLE_COUNT_DRIFT:'+index);
    coveredSphereFraction+=cellSphereFraction(Math.floor(index/ATLAS_COLUMNS),ATLAS_ROWS,ATLAS_COLUMNS);
    const means=atlas=>({
      r:atlas.sumR[index]/atlas.count[index],
      g:atlas.sumG[index]/atlas.count[index],
      b:atlas.sumB[index]/atlas.count[index],
      a:atlas.sumA[index]/atlas.count[index]
    });
    const on=means(enabled),off=means(ablated),only=means(isolated);
    const onLuma=(on.r+on.g+on.b)/3,offLuma=(off.r+off.g+off.b)/3,onlyLuma=(only.r+only.g+only.b)/3;
    deltaStrength[index]=Math.max(
      Math.abs(on.a-off.a),
      Math.abs(onLuma-offLuma),
      Math.abs(enabled.maxA[index]-ablated.maxA[index]),
      Math.abs(enabled.maxLuma[index]-ablated.maxLuma[index])
    );
    isolatedStrength[index]=Math.max(only.a,onlyLuma,isolated.maxA[index],isolated.maxLuma[index]);
  }
  const deltaAnalyses=DELTA_LEVELS.map(level=>({
    id:level.id,
    ...componentAnalysis(deltaStrength,level.threshold,ATLAS_ROWS,ATLAS_COLUMNS)
  }));
  const isolatedAnalysis=componentAnalysis(isolatedStrength,1,ATLAS_ROWS,ATLAS_COLUMNS);
  const supportCells=[];
  let supportSphereFraction=0,suppressedSphereFraction=0;
  for(let index=0;index<size;index++){
    if(isolatedStrength[index]<4)continue;
    const weight=cellSphereFraction(Math.floor(index/ATLAS_COLUMNS),ATLAS_ROWS,ATLAS_COLUMNS);
    supportCells.push(index);
    supportSphereFraction+=weight;
    if(deltaStrength[index]<Math.max(1,isolatedStrength[index]*.25))suppressedSphereFraction+=weight;
  }
  const suppressionFraction=supportSphereFraction>0?suppressedSphereFraction/supportSphereFraction:1;
  const perComponentVisibility=isolatedAnalysis.materialComponents.map((component,index)=>{
    let area=0,visibleArea=0;
    for(const cell of component.cells){
      const weight=cellSphereFraction(Math.floor(cell/ATLAS_COLUMNS),ATLAS_ROWS,ATLAS_COLUMNS);
      area+=weight;
      if(deltaStrength[cell]>=1)visibleArea+=weight;
    }
    return {
      id:'ISOLATED_COMPONENT_'+String(index+1),
      sphereFraction:component.sphereFraction,
      visibleDeltaSphereFraction:visibleArea,
      visibleFractionWithinComponent:area>0?visibleArea/area:0
    };
  });
  const checks={
    completeSphericalCoverage:missingCells===0&&Math.abs(coveredSphereFraction-1)<1e-9,
    sixMaterialDeltaComponentsAt1:(deltaAnalyses.find(level=>level.id==='DELTA_1')?.materialComponentCount||0)>=6,
    sixMaterialDeltaComponentsAt4:(deltaAnalyses.find(level=>level.id==='DELTA_4')?.materialComponentCount||0)>=6,
    sixMaterialIsolatedComponents:isolatedAnalysis.materialComponentCount>=6,
    trueClearAirDeltaSeparation:deltaAnalyses.find(level=>level.id==='DELTA_1')?.trueClearAirSeparated===true,
    trueClearAirIsolatedSeparation:isolatedAnalysis.trueClearAirSeparated===true,
    saturationSuppressionWithinLimit:suppressionFraction<=SATURATION_SUPPRESSION_LIMIT,
    everyIsolatedComponentVisiblyCausal:perComponentVisibility.length>=6&&perComponentVisibility.every(component=>component.visibleFractionWithinComponent>=.25)
  };
  return Object.freeze({
    schema:FAIL_FIRST_SCHEMA,
    atlas:Object.freeze({
      rows:ATLAS_ROWS,
      columns:ATLAS_COLUMNS,
      viewCount:ATLAS_VIEWS.length,
      cellCount:size,
      missingCells,
      coveredSphereFraction
    }),
    deltaLevels:Object.freeze(deltaAnalyses.map(level=>Object.freeze({
      id:level.id,
      threshold:level.threshold,
      occupiedCellCount:level.occupiedCellCount,
      componentCount:level.componentCount,
      materialComponentCount:level.materialComponentCount,
      minimumMaterialSphereFraction:level.minimumMaterialSphereFraction,
      minimumGapCells:level.minimumGapCells,
      trueClearAirSeparated:level.trueClearAirSeparated,
      materialComponents:Object.freeze(level.publicComponents)
    }))),
    isolatedExpansion:Object.freeze({
      threshold:isolatedAnalysis.threshold,
      occupiedCellCount:isolatedAnalysis.occupiedCellCount,
      componentCount:isolatedAnalysis.componentCount,
      materialComponentCount:isolatedAnalysis.materialComponentCount,
      minimumGapCells:isolatedAnalysis.minimumGapCells,
      trueClearAirSeparated:isolatedAnalysis.trueClearAirSeparated,
      materialComponents:Object.freeze(isolatedAnalysis.publicComponents)
    }),
    saturation:Object.freeze({
      isolatedSupportCellCount:supportCells.length,
      isolatedSupportSphereFraction:supportSphereFraction,
      suppressedSphereFraction,
      suppressionFraction,
      maximumAllowedSuppressionFraction:SATURATION_SUPPRESSION_LIMIT,
      perComponentVisibility:Object.freeze(perComponentVisibility)
    }),
    acceptance:Object.freeze({
      requiredMaterialDeltaComponents:6,
      checks:Object.freeze(checks),
      failures:Object.freeze(Object.entries(checks).filter(([,pass])=>!pass).map(([id])=>id)),
      pass:Object.values(checks).every(Boolean)
    })
  });
}

function c3EnvelopeTopologyReference(){
  const rows=181,columns=360,size=rows*columns;
  const levels=[.25,.50,.75];
  const specifications=[
    [2.530727,.905/.92,.314159,.50,.82,1.14],
    [-2.757620,.970/.88,-.244346,.48,.80,1.13],
    [2.234021,.788/.90,-.663225,.46,.82,1.15],
    [-.383972,.574/.84,-.959931,.38,.78,1.12],
    [.139626,.469/.86,1.082104,.34,.80,1.13],
    [-2.530727,.998/.94,.069813,.52,.83,1.16]
  ];
  const smooth=(a,b,value)=>{
    const t=Math.max(0,Math.min(1,(value-a)/(b-a)));
    return t*t*(3-2*t);
  };
  const wrap=value=>Math.atan2(Math.sin(value),Math.cos(value));
  const envelope=new Float64Array(size);
  let supportWeight=0,totalWeight=0;
  for(let row=0;row<rows;row++){
    const lat=-Math.PI/2+(row+.5)*Math.PI/rows,weight=Math.cos(lat);
    for(let column=0;column<columns;column++){
      const lon=-Math.PI+(column+.5)*2*Math.PI/columns,index=row*columns+column;
      let value=0;
      for(const [center,lonScale,latCenter,latScale,edge0,edge1] of specifications){
        const radius=Math.hypot(wrap(lon-center)*lonScale,(lat-latCenter)/latScale);
        value=Math.max(value,1-smooth(edge0,edge1,radius));
      }
      envelope[index]=value;
      totalWeight+=weight;
      if(value>1e-12)supportWeight+=weight;
    }
  }
  const countComponents=threshold=>{
    const seen=new Uint8Array(size);
    let count=0;
    for(let start=0;start<size;start++){
      if(envelope[start]<threshold||seen[start])continue;
      count++;
      const queue=[start];
      seen[start]=1;
      while(queue.length){
        const current=queue.pop(),row=Math.floor(current/columns),column=current%columns;
        for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nextRow=row+dr;
          if(nextRow<0||nextRow>=rows)continue;
          const next=nextRow*columns+((column+dc+columns)%columns);
          if(envelope[next]>=threshold&&!seen[next]){
            seen[next]=1;
            queue.push(next);
          }
        }
      }
    }
    return count;
  };
  return Object.freeze({
    source:'EXACT_C3_FDX_ENVELOPE_EQUATIONS',
    supportSphereFraction:supportWeight/totalWeight,
    levels:Object.freeze(levels.map(threshold=>Object.freeze({threshold,componentCount:countComponents(threshold)})))
  });
}

async function captureVariant(browser,{ablation='none',withAtlas=false,withProbes=false,isolatedExpansion=false}={}){
  const page=await browser.newPage();
  await page.setViewport({width:720,height:1280,deviceScaleFactor:1});
  await page.evaluateOnNewDocument((fixed,isolated)=>{
    const NativeDate=Date;
    class FixedDate extends NativeDate{
      constructor(...args){super(...(args.length?args:[fixed]));}
      static now(){return fixed;}
    }
    Object.setPrototypeOf(FixedDate,NativeDate);
    globalThis.Date=FixedDate;
    if(!isolated)return;
    const nativeShaderSource=WebGL2RenderingContext.prototype.shaderSource;
    const state={
      schema:'AUDRALIA_FINAL_EXPANSION_TEST_ONLY_ISOLATION_HOOK_v1',
      patchedCount:0,
      actualCompiledShaderSha256:null,
      actualCompiledShaderLength:0
    };
    globalThis.__AUDRALIA_FINAL_EXPANSION_TEST_ONLY_ISOLATION__=state;
    WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
      let next=source;
      const marker='/* AUDRALIA_FINAL_DENSITY_CLOUD_EXPANSION_v1 */';
      if(typeof source==='string'&&source.includes(marker)){
        if(source.indexOf(marker)!==source.lastIndexOf(marker))throw new Error('ISOLATION_MARKER_AMBIGUOUS');
        next=source.replace(marker,marker+'\n  mass=0.0;iceMass=0.0;precipMass=0.0;/* TEST_ONLY_FINAL_EXPANSION_ISOLATED */');
        state.patchedCount++;
        state.actualCompiledShaderLength=next.length;
        crypto.subtle.digest('SHA-256',new TextEncoder().encode(next)).then(buffer=>{
          state.actualCompiledShaderSha256=[...new Uint8Array(buffer)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
        });
      }
      return nativeShaderSource.call(this,shader,next);
    };
  },FIXED_TIME_MS,isolatedExpansion);
  const errors=installErrorCapture(page);
  const suffix=ablation==='none'?'':'?cloudAblation='+encodeURIComponent(ablation);
  await page.goto(base+'/showroom/globe/audralia/'+suffix,{waitUntil:'domcontentloaded',timeout:60000});
  const label=isolatedExpansion?'isolated':ablation;
  const authoritative=await waitForAuthoritativeRuntime(page,{label});
  const composition=await waitForComposition(page,{label:label+'_composition'});
  const servedCompositor=await captureServedCompositorIdentity(page);
  if(isolatedExpansion){
    const started=Date.now();
    while(Date.now()-started<20000){
      const ready=await page.evaluate(()=>Boolean(globalThis.__AUDRALIA_FINAL_EXPANSION_TEST_ONLY_ISOLATION__?.actualCompiledShaderSha256));
      if(ready)break;
      await sleep(100);
    }
  }
  const live=await page.evaluate(()=>({
    integration:window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__,
    status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
    loaderProgress:Number(document.querySelector('[data-audralia-loader]')?.dataset?.progress||0),
    worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,
    canvasCount:document.querySelectorAll('canvas').length,
    composition:window.__AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION__?.getRuntimeEvidence?.()||null,
    isolation:window.__AUDRALIA_FINAL_EXPANSION_TEST_ONLY_ISOLATION__||null
  }));
  const probes=[];
  if(withProbes)for(const probe of PROBES)probes.push(await captureExteriorMetrics(page,probe));
  const atlas=withAtlas?await captureSphericalAtlas(page):null;
  await page.close();
  return Object.freeze({ablation,isolatedExpansion,authoritative,composition,servedCompositor,live,probes,atlas,errors});
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
  const enabled=await captureVariant(browser,{ablation:'none',withAtlas:true,withProbes:true});
  const enabledCoverage=summarizeAtlasCoverage(enabled.atlas);
  console.log(JSON.stringify({enabledCoverage},null,2));
  assert.equal(enabledCoverage.missingCells,0,'INCOMPLETE_ENABLED_SPHERICAL_COVERAGE '+JSON.stringify(enabledCoverage));
  const v6Ablated=await captureVariant(browser,{ablation:'v6',withProbes:true});
  const finalExpansionAblated=await captureVariant(browser,{ablation:'finalExpansion',withAtlas:true});
  const isolatedExpansion=await captureVariant(browser,{ablation:'none',withAtlas:true,isolatedExpansion:true});

  const variants=[enabled,v6Ablated,finalExpansionAblated,isolatedExpansion];
  for(const variant of variants){
    assert.equal(variant.errors.pageErrors.length,0,(variant.ablation||'NONE')+'_PAGE_ERROR');
    assert.equal(variant.live.integration?.schema,LIVE_SCHEMA,'LIVE_INTEGRATION_SCHEMA_DRIFT');
    assert.equal(variant.live.integration?.startupArchitecture,'APPROVED_PRESENTATION_PRE_RENDER_v1','LIVE_STARTUP_ARCHITECTURE_DRIFT');
    assert.equal(variant.live.integration?.cameraSemanticsFrozen,true,'LIVE_CAMERA_SEMANTICS_NOT_FROZEN');
    assert.equal(variant.live.integration?.finalCloudShaderComposition,POLICY_ID,'LIVE_FINAL_COMPOSITION_BINDING_MISSING');
    assert.ok(variant.live.loaderProgress>=4,'LIVE_LOADER_NOT_READY');
    assert.ok(String(variant.live.status).includes('USER_REVIEW_REQUIRED'),'LIVE_RUNTIME_NOT_READY');
    assert.equal(variant.live.worldCanvasCount,1,'LIVE_PRIMARY_WORLD_CANVAS_MULTIPLIED');
    assert.equal(variant.composition.policyId,POLICY_ID,'FINAL_COMPOSITION_POLICY_DRIFT');
    assert.equal(variant.composition.evidence?.finalStageEvidence?.pass,true,'FINAL_COMPOSITION_STAGE_FAILURE');
    assert.equal(variant.composition.evidence?.composedCloudShaders,1,'FINAL_COMPOSITION_EXPECTED_ONE_CLOUD_SHADER');
    assert.equal(variant.composition.evidence?.rejectedCloudShaders,0,'FINAL_COMPOSITION_REJECTED_SHADER');
    assert.equal(variant.composition.evidence?.finalShaderSha256?.length,64,'FINAL_SHADER_SHA256_MISSING');
    assert.equal(variant.servedCompositor.sha256,staticEvidence.compositorSha256,'SERVED_COMPOSITOR_SOURCE_IDENTITY_MISMATCH');
    assert.equal(variant.servedCompositor.byteLength,staticEvidence.compositorLength,'SERVED_COMPOSITOR_LENGTH_MISMATCH');
    for(const stage of REQUIRED_STAGES){
      const evidence=variant.composition.evidence.finalStageEvidence.stages?.[stage];
      assert.equal(evidence?.observedMutationCount,evidence?.requiredMutationCount,'FINAL_STAGE_MUTATION_COUNT_FAILURE:'+stage);
    }
  }

  assert.equal(enabled.composition.evidence.finalAblationMode,'NONE','ENABLED_VARIANT_ABLATION_STATE_WRONG');
  assert.equal(v6Ablated.composition.evidence.finalAblationMode,'V6_FIELDS_ABLATED','V6_ABLATION_STATE_WRONG');
  assert.equal(finalExpansionAblated.composition.evidence.finalAblationMode,'FINAL_DENSITY_EXPANSION_ABLATED','FINAL_EXPANSION_ABLATION_STATE_WRONG');
  assert.notEqual(enabled.composition.evidence.finalShaderSha256,v6Ablated.composition.evidence.finalShaderSha256,'V6_ABLATION_FINAL_SHADER_HASH_IDENTICAL');
  assert.notEqual(enabled.composition.evidence.finalShaderSha256,finalExpansionAblated.composition.evidence.finalShaderSha256,'FINAL_EXPANSION_ABLATION_FINAL_SHADER_HASH_IDENTICAL');
  assert.equal(isolatedExpansion.live.isolation?.patchedCount,1,'ISOLATED_EXPANSION_SHADER_PATCH_COUNT_WRONG');
  assert.equal(isolatedExpansion.live.isolation?.actualCompiledShaderSha256?.length,64,'ISOLATED_EXPANSION_COMPILED_SHADER_SHA256_MISSING');
  assert.notEqual(isolatedExpansion.live.isolation.actualCompiledShaderSha256,enabled.composition.evidence.finalShaderSha256,'ISOLATED_EXPANSION_COMPILED_SHADER_HASH_IDENTICAL');

  const v6Causality=compareCausality(enabled,v6Ablated);
  assert.equal(v6Causality.pass,true,'V6_FRAMEBUFFER_CAUSALITY_REGRESSION');

  const failFirst=buildFailFirstAnalysis(enabled.atlas,finalExpansionAblated.atlas,isolatedExpansion.atlas);
  assert.equal(failFirst.atlas.missingCells,0,'INCOMPLETE_SPHERICAL_COVERAGE');
  assert.ok(Math.abs(failFirst.atlas.coveredSphereFraction-1)<1e-9,'INCOMPLETE_SPHERICAL_SOLID_ANGLE');
  assert.ok(failFirst.deltaLevels.some(level=>level.occupiedCellCount>0),'FINAL_EXPANSION_ABLATION_NOT_CAUSAL');
  assert.ok(failFirst.saturation.isolatedSupportCellCount>0,'SATURATION_MEASUREMENT_MISSING');

  const topologyReference=c3EnvelopeTopologyReference();
  const frozenCorpus=staticEvidence.frozenC3ProductCorpus;
  let result;
  if(frozenCorpus){
    assert.equal(staticEvidence.compositorSha256,FROZEN_C3_COMPOSITOR_SHA256,'C3_COMPOSITOR_SHA256_DRIFT');
    assert.equal(failFirst.acceptance.pass,false,'C3_FAILING_CORPUS_UNEXPECTEDLY_PASSED');
    for(const level of topologyReference.levels)assert.equal(level.componentCount,3,'C3_TOPOLOGY_REFERENCE_COMPONENT_COUNT_DRIFT');
    result='C3_FAILING_CORPUS_CONFIRMED';
  }else{
    assert.equal(failFirst.acceptance.pass,true,'FINAL_EXPANSION_VISUAL_ACCEPTANCE_FAILURE:'+failFirst.acceptance.failures.join(','));
    result='FINAL_EXPANSION_VISUAL_ACCEPTANCE_PASS';
  }

  console.log(JSON.stringify({
    schema:FAILING_CORPUS_SCHEMA,
    result,
    frozenCorpus:Object.freeze({
      expectedHead:FROZEN_C3_HEAD,
      expectedCompositorGitBlob:FROZEN_C3_COMPOSITOR_GIT_BLOB,
      expectedCompositorSha256:FROZEN_C3_COMPOSITOR_SHA256,
      observedCompositorSha256:staticEvidence.compositorSha256,
      matched:frozenCorpus
    }),
    sourceIdentity:Object.freeze({
      servedCompositorSha256:enabled.servedCompositor.sha256,
      servedCompositorUrl:enabled.servedCompositor.url,
      enabledFinalShaderSha256:enabled.composition.evidence.finalShaderSha256,
      finalExpansionAblatedShaderSha256:finalExpansionAblated.composition.evidence.finalShaderSha256,
      isolatedActualCompiledShaderSha256:isolatedExpansion.live.isolation.actualCompiledShaderSha256
    }),
    fullSphereDelta:failFirst,
    exactC3EnvelopeTopologyReference:topologyReference,
    preservedV6Causality:Object.freeze({
      pass:v6Causality.pass,
      positiveProbeCount:v6Causality.positiveProbeCount,
      materialProbeCount:v6Causality.materialProbeCount,
      maxMeanAlphaDelta:v6Causality.maxMeanAlphaDelta,
      maxCoverageDelta:v6Causality.maxCoverageDelta
    }),
    productBytesMutated:false,
    cloudEnvelopeRedesignPerformed:false,
    productionDeploymentPerformed:false
  },null,2));
}finally{
  await browser.close();
}
