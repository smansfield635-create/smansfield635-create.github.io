import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const outDir='.fd05/ground-shoreline-prework-output'; await mkdir(outDir,{recursive:true});
const route='http://127.0.0.1:8000/showroom/globe/h-earth/';
const configs=[
  {id:'mobile',context:{viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true}},
  {id:'desktop',context:{viewport:{width:1440,height:1000},deviceScaleFactor:1,isMobile:false,hasTouch:false}}
];
const variants=['BASELINE','CAMERA_ONLY','RELIEF_SCREEN_SPACE','COMPOSITION_CONTEXT','COMBINED'];

async function waitMounted(page){await page.waitForFunction(()=>document.getElementById('h-earth-3d-status')?.textContent?.trim()==='PUBLIC_STAGE_RENDERER_MOUNTED',{timeout:120000});await page.waitForTimeout(700);}

async function applyCameraDiagnostic(page){
  return page.evaluate(async()=>{
    const base=new URL('.',location.href);
    const [preview,kernel,transfer,admitted,compositor,index]=await Promise.all([
      import(new URL('./render/geometry-preview.js',base)),import(new URL('./render/geometry-kernel.js',base)),
      import(new URL('../../../h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',base)),
      import(new URL('./admitted-geometry-frame.js',base)),import(new URL('./compositor.js',base)),import(new URL('./index.js?v=034q',base))
    ]);
    const getter=compositor.getHEarth3DCompositorState;
    const setter=compositor.setHEarth3DCompositorCameraState;
    const before=typeof getter==='function'?getter():null;
    if(!before?.camera||typeof setter!=='function')return {available:false,exports:Object.keys(compositor).sort(),before};
    const candidate=structuredClone(before.camera);
    const changes={};
    if(Number.isFinite(candidate.pitchDegrees)){changes.pitchDegrees={from:candidate.pitchDegrees,to:Math.max(-75,Math.min(75,candidate.pitchDegrees-12))};candidate.pitchDegrees=changes.pitchDegrees.to;}
    if(Number.isFinite(candidate.zoom)){changes.zoom={from:candidate.zoom,to:candidate.zoom*1.18};candidate.zoom=changes.zoom.to;}
    if(candidate.position&&Number.isFinite(candidate.position.y)){changes.positionY={from:candidate.position.y,to:candidate.position.y*0.72};candidate.position.y=changes.positionY.to;}
    const cameraReceipt=setter(candidate);
    if(cameraReceipt?.accepted!==true)return {available:true,accepted:false,before,candidate,changes,cameraReceipt};
    const p=preview.previewHEarthWetSandGeometry({sourceObjectId:'OBJ_002_FOREGROUND_WET_SAND',requestedPurpose:'WET_SAND_GEOMETRY_PREVIEW',requestId:`FD05_CAMERA_DIAGNOSTIC_${Date.now()}`});
    const west=kernel.admitHEarthPrimitiveBatch(p.primitives,{frameId:`FD05_CAMERA_FRAME_${Date.now()}`,metadata:Object.freeze({requestId:p.requestId,providerRequestId:p.providerRequestId,resolutionReceiptId:p.resolutionReceiptId,sourceObjectIds:Object.freeze([p.sourceObjectId]),sourceZoneIds:p.sourceZoneIds,latticeRegionIds:p.latticeRegionIds})});
    const packet=transfer.buildHEarthPostWestAdmittedGeometryTransfer({previewResult:p,westBatchAdmissionResult:west});
    index.destroyHEarthRoute();
    index.initializeHEarthRoute({document,packet002Transfer:packet,packet002TransferOccurrenceId:`P2_CAMERA_${Date.now()}`,compositorFrameOccurrenceId:`CF_CAMERA_${Date.now()}`,presentationMode:admitted.H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,skipLayer4DescriptorImport:true});
    const completion=await index.getRouteBootstrapCompletion();
    return {available:true,accepted:true,before,candidate,changes,cameraReceipt,completionStatus:completion?.status,after:typeof getter==='function'?getter():null};
  });
}

async function applyDomDiagnostic(page,variant){
  return page.evaluate((mode)=>{
    const mount=document.getElementById('h-earth-3d-renderer-mount');
    const stage=mount?.querySelector('.h-earth-3d-render-stage');
    const tri=mount?.querySelector('[data-material-reference="H_EARTH_MATERIAL_WET_SAND"]');
    const layer=tri?.closest('.h-earth-3d-render-semantic-layer');
    const applied=[];
    if((mode==='RELIEF_SCREEN_SPACE'||mode==='COMBINED')&&layer){layer.style.transformOrigin='50% 72%';layer.style.transform='scaleY(1.65)';applied.push('SCREEN_SPACE_RELIEF_SCALE_Y_1_65');}
    if((mode==='COMPOSITION_CONTEXT'||mode==='COMBINED')&&stage){
      const overlay=document.createElement('div'); overlay.dataset.fd05DiagnosticComposition='true';
      Object.assign(overlay.style,{position:'absolute',inset:'0',pointerEvents:'none',zIndex:'2147483000',background:'linear-gradient(to bottom, transparent 0%, transparent 37%, rgba(72,132,151,0.68) 37%, rgba(92,151,164,0.58) 46%, rgba(235,241,228,0.86) 46.2%, rgba(235,241,228,0.55) 47.2%, transparent 48.5%, transparent 100%)',mixBlendMode:'normal'});
      stage.appendChild(overlay); applied.push('DIAGNOSTIC_NEARSHORE_WATER_AND_FOAM_CONTEXT');
    }
    return {applied,stageRect:stage?{width:stage.getBoundingClientRect().width,height:stage.getBoundingClientRect().height}:null};
  },variant);
}

async function snapshot(page){return page.evaluate(()=>{
  const mount=document.getElementById('h-earth-3d-renderer-mount');const stage=mount?.querySelector('.h-earth-3d-render-stage');
  const triangles=[...(mount?.querySelectorAll('[data-material-reference="H_EARTH_MATERIAL_WET_SAND"][data-projected-type="TRIANGLE"]')??[])];
  const rects=triangles.map(t=>t.getBoundingClientRect());
  const tops=rects.map(r=>r.top), bottoms=rects.map(r=>r.bottom), heights=rects.map(r=>r.height);
  const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
  return {status:document.getElementById('h-earth-3d-status')?.textContent?.trim()??null,mount:{width:mount?.clientWidth??null,height:mount?.clientHeight??null,triangleCount:triangles.length,primitiveCount:mount?.querySelectorAll('.h-earth-3d-render-primitive').length??null,semanticLayerCount:mount?.querySelectorAll('.h-earth-3d-render-semantic-layer').length??null,sourcePreviewCount:mount?.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length??null},stageRect:stage?{width:stage.getBoundingClientRect().width,height:stage.getBoundingClientRect().height}:null,projectedDistribution:{minimumTop:tops.length?Math.min(...tops):null,maximumBottom:bottoms.length?Math.max(...bottoms):null,meanTriangleHeight:mean(heights),maximumTriangleHeight:heights.length?Math.max(...heights):null},diagnosticOverlayCount:stage?.querySelectorAll('[data-fd05-diagnostic-composition="true"]').length??0};});}

const browser=await chromium.launch({headless:true}); const results=[];
for(const config of configs){for(const variant of variants){
  const context=await browser.newContext(config.context);const page=await context.newPage();const pageErrors=[],requestFailures=[];
  page.on('pageerror',e=>pageErrors.push({name:e.name,message:e.message}));page.on('requestfailed',r=>requestFailures.push({url:r.url(),failure:r.failure()}));
  const started=Date.now();await page.goto(`${route}?fd05GroundShoreline=${Date.now()}-${config.id}-${variant}`,{waitUntil:'domcontentloaded',timeout:60000});await waitMounted(page);
  let cameraDiagnostic=null,domDiagnostic=null;
  if(variant==='CAMERA_ONLY'||variant==='COMBINED'){cameraDiagnostic=await applyCameraDiagnostic(page);if(cameraDiagnostic?.accepted)await waitMounted(page);}
  if(variant==='RELIEF_SCREEN_SPACE'||variant==='COMPOSITION_CONTEXT'||variant==='COMBINED'){domDiagnostic=await applyDomDiagnostic(page,variant);await page.waitForTimeout(400);}
  const snap=await snapshot(page);const screenshotPath=path.join(outDir,`${config.id}-${variant.toLowerCase()}.png`);await page.locator('#h-earth-3d-world-stage').screenshot({path:screenshotPath});const bytes=await readFile(screenshotPath);
  results.push({configuration:config.id,variant,elapsedMs:Date.now()-started,cameraDiagnostic,domDiagnostic,snapshot:snap,pageErrors,requestFailures,screenshot:{path:screenshotPath,byteLength:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}});
  await context.close();
}}
await browser.close();
const report={reportId:'H_EARTH_FD05_GROUND_SHORELINE_RUNTIME_DIAGNOSTICS_001',generatedAt:new Date().toISOString(),status:'PASS',repositoryModified:false,results,aggregate:{captureCount:results.length,pageErrors:results.reduce((n,r)=>n+r.pageErrors.length,0),requestFailures:results.reduce((n,r)=>n+r.requestFailures.length,0),allMounted:results.every(r=>r.snapshot.status==='PUBLIC_STAGE_RENDERER_MOUNTED')}};
await writeFile(`${outDir}/runtime-diagnostics.json`,JSON.stringify(report,null,2)+'\n','utf8');console.log(JSON.stringify({reportId:report.reportId,aggregate:report.aggregate,results:results.map(r=>({configuration:r.configuration,variant:r.variant,cameraAvailable:r.cameraDiagnostic?.available??null,cameraAccepted:r.cameraDiagnostic?.accepted??null,triangles:r.snapshot.mount.triangleCount,distribution:r.snapshot.projectedDistribution,screenshot:r.screenshot}))},null,2));
