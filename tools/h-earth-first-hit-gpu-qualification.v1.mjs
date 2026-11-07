/** Gen3150: source-pinned H-Earth material first-hit browser qualification; no product mutation. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const FIXED=Object.freeze({
  probe:'ba741660459180de632a03f826800548a40e325f',
  probeModule:'d5d4dd0b7607b37b9b62cab54848d4cb059b396b',
  published:'bcfb0650077323851f01f51d712c7f8b8ac39220',
  candidate:'7610827598eaadf4fbb92e7ec8b9371c8cd08581',
  renderer:'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',
  route:'showroom/globe/h-earth/vegetation-prototype/route.js',
  root:'/showroom/globe/h-earth/',
  viewport:Object.freeze([384,688]),
  ownerPixelTop:Object.freeze([201,337]),
  healthyPixelTop:Object.freeze([192,344]),
  modes:Object.freeze([1,2,3,4,5,6,7])
});
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
export function readinessDigest(fullSignature){
  requireCondition(typeof fullSignature==='string'&&fullSignature.length>0,'GEN3150_ASSET_SIGNATURE_MISSING');
  return hash(fullSignature);
}
const close=(a,b,tol=1e-5)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol;
const sameVector=(a,b,tol=1e-5)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>close(v,b[i],tol));
export function verifyPng(bytes,viewport=FIXED.viewport){
  const b=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);
  requireCondition(b.length>=1024&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&
    b.toString('ascii',12,16)==='IHDR'&&b.readUInt32BE(16)===viewport[0]&&b.readUInt32BE(20)===viewport[1],
    'GEN3150_VISUAL_PNG_INVALID');
  return hash(b);
}
const requireCondition=(truth,error)=>{if(!truth)throw Error(error);};
export function bottomPixel(top,viewport=FIXED.viewport){
  requireCondition(Array.isArray(top)&&top.length===2&&top.every(Number.isInteger)&&
    top[0]>=0&&top[1]>=0&&top[0]<viewport[0]&&top[1]<viewport[1],'GEN3150_PIXEL_INVALID');
  return Object.freeze([top[0],viewport[1]-1-top[1]]);
}
export function parseArguments(args){
  const allowed=['--baseline-dir','--candidate-dir','--probe-dir','--output'];
  requireCondition(args.length===8,'GEN3150_ARGUMENT_COUNT');
  const o={};for(let i=0;i<args.length;i+=2){
    requireCondition(allowed.includes(args[i])&&!o[args[i]]&&args[i+1],'GEN3150_ARGUMENT_INVALID');
    o[args[i]]=path.resolve(args[i+1]);
  }
  requireCondition(allowed.every(k=>o[k])&&new Set(Object.values(o)).size===4,'GEN3150_ARGUMENT_SET');
  return o;
}
export function validateReadback(x,mode,viewport,pixel,expectedMode,expected){
  requireCondition(FIXED.modes.includes(mode)&&mode===expectedMode,'GEN3150_MODE_MISMATCH');
  requireCondition(x&&x.webgl2===true&&x.contextLost===false&&x.glError===0,'GEN3150_WEBGL_INVALID');
  requireCondition(x.appliedMode===mode,'GEN3150_MODE_NOT_APPLIED');
  requireCondition(Array.isArray(x.rgba)&&x.rgba.length===4&&x.rgba.every(k=>Number.isInteger(k)&&k>=0&&k<=255),'GEN3150_RGBA8_INVALID');
  requireCondition(JSON.stringify(x.viewport)===JSON.stringify(viewport)&&
    JSON.stringify(x.pixelBottom)===JSON.stringify(pixel),'GEN3150_VIEWPORT_OR_ORIGIN_MISMATCH');
  requireCondition(x.assetReady===true&&typeof x.assetSignature==='string'&&x.assetSignature.length>0,'GEN3150_ASSET_NOT_READY');
  requireCondition(x.camera&&Array.isArray(x.camera.matrix)&&x.camera.matrix.length===16&&x.camera.matrix.every(Number.isFinite),'GEN3150_CAMERA_INVALID');
  requireCondition(x.frame&&Number.isInteger(x.frame.frameSequence)&&x.frame.frameSequence>0,'GEN3150_FRAME_INVALID');
  requireCondition(expected&&expected.state&&Number.isInteger(expected.state.sequence)&&expected.state.sequence>=1,
    'GEN3150_REQUESTED_STATE_MISSING');
  requireCondition(x.frame.navigationSequence===expected.state.sequence&&
    Number.isInteger(expected.previousFrame)&&x.frame.frameSequence>expected.previousFrame&&
    ['x','y','z'].every(k=>close(x.frame.cameraPosition?.[k],x.camera.position?.[k],1e-6)),
    'GEN3150_SUBMITTED_FRAME_OR_CAMERA_MISMATCH');
  if(expected.owner){
    const witness=expected.ownerWitness;
    requireCondition(witness&&['x','y','z'].every(k=>close(x.camera.position[k],witness.camera[k],1e-5))&&
      sameVector(x.camera.matrix,witness.matrix,1e-4)&&
      ['x','y','z'].every(k=>close(expected.state.position?.[k],witness.navigationPosition?.[k],1e-5)),
      'GEN3150_OWNER_CAMERA_OR_PROJECTION_MISMATCH');
  }
  return true;
}
export function classifySample(compound){
  if(compound?.status!=='SOURCE_BOUND_MATCHED_PIXEL_MODE_SET_NOT_ANDROID_FIRST_HIT')
    return Object.freeze({result:'MATERIAL_FIRST_HIT_UNRESOLVED',sourceFirstHitVerified:false,physicalAndroidParity:false});
  return Object.freeze({result:'OPAQUE_SOURCE_BOUND_GPU_MATERIAL_SAMPLE',sourceFirstHitVerified:false,physicalAndroidParity:false,materialRole:compound.role,primitiveIndex:compound.primitiveIndex,appliedGroundcoverWeight:compound.groundcoverWeight});
}
function verifyCheckout(dir,head){
  requireCondition(execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim()===head,'GEN3150_CHECKOUT_SHA_MISMATCH');
  const trackedChanges=execFileSync('git',['-C',dir,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim();
  requireCondition(trackedChanges.length===0,'GEN3150_TRACKED_CHECKOUT_CHANGED');
}
function verifyObject(dir,rel,expected){
  const actual=execFileSync('git',['-C',dir,'hash-object',rel],{encoding:'utf8'}).trim();
  requireCondition(actual===expected,'GEN3150_SOURCE_OBJECT_MISMATCH:'+rel);
}
async function staticServer(root,port){
  const child=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',root],{stdio:'ignore'});
  const base='http://127.0.0.1:'+port;
  for(let i=0;i<75;i++){
    try{const res=await fetch(base+FIXED.root);if(res.ok)return {child,base}}catch{}
    await new Promise(r=>setTimeout(r,120));
  }
  child.kill();throw Error('GEN3150_LOCAL_SERVER_UNAVAILABLE');
}
export async function run(argv){
  const opts=parseArguments(argv);const out=opts['--output'];
  fs.mkdirSync(out,{recursive:true});
  const receipt={schema:'H_EARTH_GEN3150_SOURCE_PINNED_WEBGL_MATERIAL_FIRST_HIT_v1',
    result:'INCOMPLETE',probeHead:FIXED.probe,heads:{published:FIXED.published,candidate:FIXED.candidate},
    viewport:FIXED.viewport,androidFrame:'cpu-submit:2583:nav:5085',androidPixelTop:FIXED.ownerPixelTop,
    physicalAndroidEquivalenceProven:false,ownerBoundaryVisuallyRecognized:false,
    mapWideTerrainRepairProven:false,productMutationPerformed:false,mergePerformed:false,deployPerformed:false,
    evidenceClass:'SOFTWARE_WEBGL2_CONTROLLED_RECONSTRUCTED_CAMERA_NOT_PHYSICAL_DEVICE',views:[],errors:[]};
  const persist=()=>fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  let browser,server;persist();
  try{
    verifyCheckout(opts['--probe-dir'],FIXED.probe);
    verifyObject(opts['--probe-dir'],'tools/h-earth-first-hit-material-overlay.mjs',FIXED.probeModule);
    verifyCheckout(opts['--baseline-dir'],FIXED.published);
    verifyCheckout(opts['--candidate-dir'],FIXED.candidate);
    const comparison=await import(pathToFileURL(path.resolve('tools/h-earth-ground-material-comparison.v1.mjs')).href);
    const probe=await import(pathToFileURL(path.join(opts['--probe-dir'],'tools/h-earth-first-hit-material-overlay.mjs')).href);
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of ['published','candidate'].entries()){
      const dir=opts[label==='published'?'--baseline-dir':'--candidate-dir'];
      const productHead=FIXED[label],target=label==='published'?'published':'candidate';
      const original=fs.readFileSync(path.join(dir,FIXED.renderer),'utf8');
      const injected=probe.transformExactRenderer(original,{target});
      const originalRoute=fs.readFileSync(path.join(dir,FIXED.route),'utf8');
      const captureRenderer='/'+FIXED.renderer,captureRoute='/'+FIXED.route;
      const profile={label,sourceHead:productHead,rendererObjectId:injected.sourceBlob,instrumentedSha256:injected.instrumentedSha256};
      server=await staticServer(dir,18878+index);
      const context=await browser.newContext({viewport:{width:384,height:688},deviceScaleFactor:1});
      const page=await context.newPage();page.setDefaultTimeout(30000);
      const browserErrors=[];page.on('pageerror',e=>browserErrors.push(e.message));
      await page.addInitScript({content:'globalThis.__hEarthFirstHitMaterialMode=0;globalThis.__groundAssetReadiness='+comparison.assetReadiness.toString()+';globalThis.__groundComparisonState='+comparison.comparisonState.toString()+';'});
      await page.route(url=>url.pathname===captureRenderer,route=>route.fulfill({status:200,contentType:'text/javascript',body:injected.source}));
      await page.route(url=>url.pathname===captureRoute,route=>route.fulfill({status:200,contentType:'text/javascript',body:comparison.instrumentRoute(originalRoute)}));
      await page.goto(server.base+FIXED.root+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||
        !!globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
      requireCondition(!(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true')),'GEN3150_STARTUP_FAILED');
      await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
      await page.mouse.move(160,240);await page.mouse.down();await page.mouse.move(220,240,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled,null,{timeout:180000});
      await page.click('[data-enter]');
      await page.waitForFunction(()=>{const root=document.querySelector('#h-earth-functional-landscape-route'),shell=document.querySelector('#h-earth-loading-screen');
        return root?.dataset.run8eReady==='true'&&shell?.hidden===true&&shell?.dataset.mode==='ready'&&globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.().mode==='entered'},null,{timeout:120000});
      await page.evaluate(async()=>{
        const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));
        const unique=[...new Set(urls)];if(unique.length!==1)throw Error('GEN3150_NAV_MODULE_AMBIGUOUS');
        const url=unique[0];let src=await(await fetch(url)).text();
        src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));
        src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';
        globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
      });
      const poses=[comparison.GEN3142_MATCHED_POSES[0],comparison.GEN3142_MATCHED_POSES[1]];
      for(const [poseIndex,pose] of poses.entries()){
        const pixelTop=pose.owner?FIXED.ownerPixelTop:FIXED.healthyPixelTop,pixelBottom=bottomPixel(pixelTop);
        const sequence=32000+index*100+poseIndex;
        const state=await page.evaluate(({pose,sequence})=>{
          const nav=globalThis.__groundComparisonNav;
          return globalThis.__groundComparisonState(nav,pose,sequence,'GEN3150_MATERIAL_ID_READBACK');
        },{pose,sequence});
        let ready=false,signature='';
        for(let attempt=0;attempt<50;attempt++){
          const info=await page.evaluate(async state=>{
            globalThis.__hEarthFirstHitMaterialMode=0;
            globalThis.__HEarthAuditPresent(state);
            await new Promise(requestAnimationFrame);
            const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
            const cv=document.querySelector('#h-earth-functional-landscape-canvas');
            const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:state.sequence});
            return globalThis.__groundAssetReadiness(gpu.resources,packet.camera.position);
          },state);
          if(info.ready&&info.signature===signature){ready=true;break}
          signature=info.signature;await new Promise(r=>setTimeout(r,220));
        }
        requireCondition(ready,'GEN3150_ASSET_READINESS_UNRESOLVED:'+label+':'+pose.name);
        // Required visual evidence: unchanged normal-color rendering, not a synthetic
        // palette image. Inspect these pixels to decide if the Android edge reproduced.
        const visual=await page.evaluate(state=>{
          globalThis.__hEarthFirstHitMaterialMode=0;
          globalThis.__HEarthAuditPresent(state);
          const cv=document.querySelector('#h-earth-functional-landscape-canvas');
          const gl=cv?.getContext('webgl2');
          if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)
            throw Error('GEN3150_MODE0_WEBGL2_UNAVAILABLE');
          const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);
          const dataUrl=cv.toDataURL('image/png');
          const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);
          const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,
            viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:state.sequence});
          return {dataUrl,before,after,
            camera:{position:packet.camera.position,matrix:Array.from(packet.camera.viewProjectionMatrix)},
            viewport:[cv.width,cv.height],glError:gl.getError()};
        },state);
        requireCondition(visual.dataUrl?.startsWith('data:image/png;base64,')&&
          visual.before?.frameSequence===visual.after?.frameSequence&&
          visual.before?.navigationSequence===state.sequence&&visual.after?.navigationSequence===state.sequence&&
          visual.glError===0&&JSON.stringify(visual.viewport)===JSON.stringify(FIXED.viewport)&&
          ['x','y','z'].every(k=>close(visual.before?.cameraPosition?.[k],visual.camera.position?.[k],1e-6)),
          'GEN3150_MODE0_FRAME_OR_CAPTURE_INVALID');
        if(pose.owner){
          requireCondition(['x','y','z'].every(k=>close(visual.camera.position?.[k],comparison.GEN3142_MATCHED.camera[k],1e-5))&&
            sameVector(visual.camera.matrix,comparison.GEN3142_MATCHED.matrix,1e-4),
            'GEN3150_OWNER_MODE0_CAMERA_INVALID');
        }
        const pngBytes=Buffer.from(visual.dataUrl.slice('data:image/png;base64,'.length),'base64');
        const imageDigest=verifyPng(pngBytes);
        const imageName=label+'-'+pose.name+'-normal.png';
        fs.writeFileSync(path.join(out,imageName),pngBytes);
        let previousFrame=visual.after.frameSequence;
        const decoded=[];
        for(const mode of FIXED.modes){
          const raw=await page.evaluate(({state,mode,pixelBottom})=>{
            globalThis.__hEarthFirstHitMaterialMode=mode;
            globalThis.__HEarthAuditPresent(state);
            const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
            const cv=document.querySelector('#h-earth-functional-landscape-canvas'),gl=cv.getContext('webgl2');
            if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('GEN3150_WEBGL2_UNAVAILABLE');
            const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:state.sequence});
            const bytes=new Uint8Array(4);gl.readPixels(pixelBottom[0],pixelBottom[1],1,1,gl.RGBA,gl.UNSIGNED_BYTE,bytes);
            const error=gl.getError();const asset=globalThis.__groundAssetReadiness(gpu.resources,packet.camera.position);
            return {rgba:Array.from(bytes),appliedMode:globalThis.__hEarthFirstHitModeApplied,
              webgl2:String(gl.getParameter(gl.VERSION)).includes('WebGL 2.0'),glError:error,contextLost:gl.isContextLost(),
              viewport:[cv.width,cv.height],pixelBottom,assetReady:asset.ready,assetSignature:asset.signature,
              camera:{position:packet.camera.position,matrix:Array.from(packet.camera.viewProjectionMatrix)},
              frame:gpu.frameRecords.at(-1),drawSignature:JSON.stringify({renderer:gpu.resources?.rendererId,package:gpu.resources?.package?.runtimeIdentity}),};
          },{state,mode,pixelBottom});
          validateReadback(raw,mode,FIXED.viewport,pixelBottom,mode,{
            state,previousFrame,owner:pose.owner===true,ownerWitness:comparison.GEN3142_MATCHED
          });
          previousFrame=raw.frame.frameSequence;
          requireCondition(raw.assetSignature===signature,'GEN3150_ASSETS_CHANGED_IN_MODE_SERIES');
          const capture={target,sourceHead:productHead,rendererObjectId:injected.sourceBlob,
            instrumentedSha256:injected.instrumentedSha256,webgl2:true,readbackClass:probe.PROBE_READBACK_CLASS,
            appliedMode:mode,poseId:pose.name,
            assetSignature:readinessDigest(raw.assetSignature),drawSignature:hash(raw.drawSignature),
            cameraPosition:[raw.camera.position.x,raw.camera.position.y,raw.camera.position.z],
            viewProjectionMatrix:raw.camera.matrix,viewport:FIXED.viewport,pixel:pixelBottom,webglErrors:[]};
          decoded.push(probe.decodeModePixel(mode,new Uint8Array(raw.rgba),capture));
        }
        const compound=probe.combinePixelReceipts(decoded);
        const sample={label,pose:pose.name,owner:pose.owner===true,pixelTop,pixelBottom,
          sourceHead:productHead,rendererObjectId:injected.sourceBlob,instrumentedSha256:injected.instrumentedSha256,
          normalImage:imageName,normalImageSha256:imageDigest,normalImageBytes:pngBytes.length,
          normalFrame:visual.after.frameSequence,normalCamera:visual.camera,
          completeAssetReadinessSignature:signature,assetReadinessSha256:readinessDigest(signature),
          sevenModeStatuses:decoded.map(x=>({mode:x.mode,status:x.status,rgba:x.rgba})),
          compound:classifySample(compound),decodedCompound:compound};
        receipt.views.push(sample);persist();
      }
      requireCondition(browserErrors.length===0,'GEN3150_BROWSER_ERRORS:'+browserErrors.join('|'));
      await context.close();server.child.kill();server=null;
      verifyCheckout(dir,productHead);
    }
    requireCondition(receipt.views.length===4,'GEN3150_OWNER_AND_CONTROL_SET_INCOMPLETE');
    verifyCheckout(opts['--probe-dir'],FIXED.probe);
    verifyCheckout(opts['--baseline-dir'],FIXED.published);
    verifyCheckout(opts['--candidate-dir'],FIXED.candidate);
    receipt.result='SOURCE_BOUND_WEBGL2_MODE_CAPTURED_OWNER_VISUAL_PARITY_UNVERIFIED';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack||e));throw e}
  finally{persist();if(server)server.child.kill();if(browser)await browser.close()}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname))
  run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1});
