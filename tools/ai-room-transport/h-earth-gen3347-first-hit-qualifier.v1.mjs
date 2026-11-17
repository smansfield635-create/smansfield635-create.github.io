/** Gen3347. Fixed, read-only, exact-current-head material sampling. No Android pixel parity claim. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL,fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export const FIXED=Object.freeze({
 operationId:'H_EARTH_GEN3347_CURRENT_HEAD_FIRST_HIT_QUALIFIER_ADAPTATION_20261116_001',
 productHead:'e400920ced2f244344c59daf0015b44c178ea31c',
 rendererBlob:'969a5dce59f7a3f15235a677173522d0c9736528',
 routeBlob:'bddf7dcf22c33ba4fa04928016016c37a78e031f',
 historicOverlayHead:'ba741660459180de632a03f826800548a40e325f',
 historicOverlayBlob:'d5d4dd0b7607b37b9b62cab54848d4cb059b396b',
 renderer:'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',
 route:'showroom/globe/h-earth/vegetation-prototype/route.js',
 root:'/showroom/globe/h-earth/',
 viewport:Object.freeze([602,862]),
 browserViewport:Object.freeze([800,1146]),
 frame:'cpu-submit:404:nav:1478',
 photographSha256:'3894c43ed6317f6c21e43ce0e8a92c0ea35a5792df8fdc7ab601d66acf56c929',
 ownerNavigation:Object.freeze({x:189.44655456958074,y:25.464462201545384,z:-232.87709610812828,yaw:82.28081197023364,pitch:-19.87206530590953}),
 ownerCamera:Object.freeze({x:189.4580245198595,y:25.35716791683808,z:-232.89119553959847}),
 ownerMatrix:Object.freeze([0.3617189908060235,0.634308590648288,0.9318006332266275,0.9317773385019809,0.0013164969915610656,1.7684008598419596,-0.34042282101361465,-0.3404143105494701,2.6685967371174346,-0.08685072362454384,-0.12613438905235896,-0.12613123573204915,552.9287364556475,-185.24325892589357,-197.78054349744392,-197.275605295584])
});
export const POSES=Object.freeze([
 Object.freeze({id:'owner-reconstruction',owner:true,point:FIXED.ownerNavigation,
 samples:Object.freeze([
  Object.freeze({id:'middle-north',x:360,yTop:387}),
  Object.freeze({id:'middle-south',x:360,yTop:403}),
  Object.freeze({id:'foreground-north',x:156,yTop:664}),
  Object.freeze({id:'foreground-south',x:156,yTop:680})
 ])}),
 Object.freeze({id:'approved-grove-A',owner:false,point:Object.freeze({x:-139.40268,z:-194.5,yaw:180,pitch:-19}),
 samples:Object.freeze([Object.freeze({id:'grove-A-center',x:301,yTop:431})])}),
 Object.freeze({id:'approved-grove-B',owner:false,point:Object.freeze({x:-141,z:-226,yaw:180,pitch:-19}),
 samples:Object.freeze([Object.freeze({id:'grove-B-center',x:301,yTop:431})])})
]);
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
export const objectId=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const insist=(p,code)=>{if(!p){const e=new Error(code);e.code=code;throw e;}};
const one=(s,from,to)=>{insist(typeof s==='string'&&s.split(from).length===2,'GEN3347_SOURCE_ANCHOR_NOT_UNIQUE');return s.replace(from,to);};
export function toGlPixel(p,viewport=FIXED.viewport){
 insist(p&&Number.isInteger(p.x)&&Number.isInteger(p.yTop)&&p.x>=0&&p.x<viewport[0]&&p.yTop>=0&&p.yTop<viewport[1],'GEN3347_PIXEL_OUTSIDE_VIEWPORT');
 return [p.x,viewport[1]-1-p.yTop];
}
export function validatePoseReport(actual,owner=false){
 insist(actual&&Array.isArray(actual.viewport)&&actual.viewport[0]===FIXED.viewport[0]&&actual.viewport[1]===FIXED.viewport[1],'GEN3347_FRAMEBUFFER_DIMENSIONS_MISMATCH');
 insist(actual.camera&&Array.isArray(actual.camera.matrix)&&actual.camera.matrix.length===16&&actual.camera.matrix.every(Number.isFinite),'GEN3347_CAMERA_MATRIX_MISSING');
 if(owner){
  for(const k of ['x','y','z'])insist(Math.abs(actual.camera.position?.[k]-FIXED.ownerCamera[k])<=0.2,'GEN3347_OWNER_POSE_NOT_REPRODUCED');
  insist(actual.camera.matrix.every((n,i)=>Math.abs(n-FIXED.ownerMatrix[i])<0.06),'GEN3347_OWNER_PROJECTION_MISMATCH');
 }
 return true;
}
export function retargetHistoricalOverlay(overlay,renderer){
 insist(objectId(overlay)===FIXED.historicOverlayBlob,'GEN3347_HISTORICAL_PROBE_BLOB_DRIFT');
 insist(objectId(renderer)===FIXED.rendererBlob,'GEN3347_CURRENT_RENDERER_BLOB_DRIFT');
 let updated=one(overlay,"head: 'bcfb0650077323851f01f51d712c7f8b8ac39220'","head: '"+FIXED.productHead+"'");
 updated=one(updated,"rendererBlob: '85ee835060d5106a670077a5f4352b7ad202b49b'","rendererBlob: '"+FIXED.rendererBlob+"'");
 return updated;
}
export function injectHideGrass(source){
 return one(source,'resources.singleOwnerVegetation?.draw(packet);',
 'if(!globalThis.__gen3347HideGrass)resources.singleOwnerVegetation?.draw(packet);');
}
export function instrumentRoute(route){
 insist(objectId(route)===FIXED.routeBlob,'GEN3347_CURRENT_ROUTE_BLOB_DRIFT');
 return one(route,'const cssWidth=',
  'globalThis.__HEarthAuditPresent=present;globalThis.__HEarthAuditPacket=createHEarthRun8ER3AFrameUniformPacket;\nconst cssWidth=');
}
export function verifyReceiptRows(rows){
 insist(Array.isArray(rows)&&rows.length===3,'GEN3347_THREE_POSES_REQUIRED');
 insist(rows[0].samples?.length===4&&rows[1].samples?.length===1&&rows[2].samples?.length===1,'GEN3347_EDGE_AND_CONTROLS_INCOMPLETE');
 for(const row of rows)for(const sample of row.samples){
  insist(sample.modeEvidence?.length===7&&sample.modeEvidence.every((v,i)=>v.mode===i+1),'GEN3347_SEVEN_MODE_EVIDENCE_MISSING');
  insist(sample.compound?.status==='SOURCE_BOUND_MATCHED_PIXEL_MODE_SET_NOT_ANDROID_FIRST_HIT','GEN3347_MATERIAL_MODE_SET_UNRESOLVED');
 }
 return true;
}
export function parseArgs(argv){
 insist(Array.isArray(argv)&&argv.length===6,'GEN3347_ARGUMENT_SET');
 const accepted=new Set(['--candidate-head','--execution-holder','--output']);
 const o={};for(let i=0;i<argv.length;i+=2){insist(accepted.has(argv[i])&&o[argv[i]]===undefined&&argv[i+1],'GEN3347_ARGUMENT_INVALID');o[argv[i]]=argv[i+1];}
 insist(o['--candidate-head']===FIXED.productHead,'GEN3347_PRODUCT_HEAD_MISMATCH');
 insist(/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(o['--execution-holder']),'GEN3347_EXECUTION_HOLDER_INVALID');
 insist(path.isAbsolute(o['--output']),'GEN3347_OUTPUT_ABSOLUTE_REQUIRED');
 return o;
}
const PUBLIC_BASE='https://diamondgatebridge.com';
const HISTORIC_BASE='https://raw.githubusercontent.com/smansfield635-create/smansfield635-create.github.io';
const git=(dir,args)=>{
 const started=Date.now();
 const r=spawnSync('git',['-C',dir,...args],{encoding:'utf8',maxBuffer:16*1024*1024,timeout:120000});
 insist(r.status===0&&!r.error,'GEN3347_GIT_FAILURE:'+args.join(' ')+':code='+String(r.error?.code||'NONE')+':status='+String(r.status)+':signal='+String(r.signal)+':elapsedMs='+String(Date.now()-started)+':stderr='+String(r.stderr||'').slice(0,250));
 return r.stdout.trim();
};
async function fetchPinnedSource(url,expectedBlob,expectedHost){
 const parsed=new URL(url);
 insist(parsed.protocol==='https:'&&parsed.hostname===expectedHost&&parsed.port===''&&parsed.username===''&&parsed.password===''&&parsed.search===''&&parsed.hash===''&&parsed.href===url,'GEN3347_UNTRUSTED_SOURCE_URL');
 const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(120000)});
 insist(response.status===200&&!response.redirected&&response.url===url,'GEN3347_SOURCE_FETCH_FAILED:'+String(response.status));
 const data=Buffer.from(await response.arrayBuffer());
 insist(data.length>0&&data.length<=16*1024*1024,'GEN3347_SOURCE_SIZE_OUT_OF_BOUNDS');
 const blob=crypto.createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');
 insist(blob===expectedBlob,'GEN3347_SOURCE_GIT_BLOB_MISMATCH:'+expectedHost+':'+blob);
 return data.toString('utf8');
}
function installChromium(temp){
 const dep=path.join(temp,'browser-deps');fs.mkdirSync(dep,{recursive:true});
 const checkedRun=(exe,args,cwd,timeout=600000)=>{
  const r=spawnSync(exe,args,{cwd,encoding:'utf8',timeout,maxBuffer:16*1024*1024,env:process.env});
  insist(r.status===0&&!r.error,'GEN3347_BROWSER_DEPENDENCY_INSTALL_FAILED:'+exe+':'+String(r.error?.message||r.stderr||r.stdout||'').slice(-500));
 };
 checkedRun('npm',['install','--prefix',dep,'--no-save','--no-package-lock','--no-audit','playwright@1.55.0'],temp);
 const cli=path.join(dep,'node_modules/playwright/cli.js');
 insist(fs.existsSync(cli),'GEN3347_PLAYWRIGHT_CLI_NOT_FOUND');
 checkedRun(process.execPath,[cli,'install','--with-deps','chromium'],dep);
 return createRequire(path.join(dep,'package.json'))('playwright');
}
function pngCheck(data){
 const b=Buffer.from(data.slice('data:image/png;base64,'.length),'base64');
 insist(data.startsWith('data:image/png;base64,')&&b.length>1024&&b.toString('ascii',12,16)==='IHDR'&&b.readUInt32BE(16)===FIXED.viewport[0]&&b.readUInt32BE(20)===FIXED.viewport[1],'GEN3347_NORMAL_COLOR_PNG_INVALID');
 return b;
}
/** Gen3358: exact-source, normal-color WebGL2 grass ON/OFF/ON diagnostic.
 * The sole visibility intervention is the existing source-injected grass draw switch.
 * All three frames reuse the same navigation state; the third bounds frame drift.
 * This produces RGB evidence, never an Android photograph-parity assertion. */
async function captureGrassNormalColorABA(page,state,samples){
 return page.evaluate(async ({state,samples})=>{
  const cv=document.querySelector('#h-earth-functional-landscape-canvas');
  const gl=cv?.getContext('webgl2');
  if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true||
     !String(gl.getParameter(gl.VERSION)).includes('WebGL 2.0'))throw Error('GEN3358_AB_WEBGL2_CONTEXT_REQUIRED');
  const width=cv.width,height=cv.height;
  if(width!==602||height!==862)throw Error('GEN3358_AB_VIEWPORT_DRIFT');
  const frames=[];
  for(const hidden of [false,true,false]){
   globalThis.__hEarthFirstHitMaterialMode=0;
   globalThis.__gen3347HideGrass=hidden;
   globalThis.__HEarthAuditPresent(state);
   const gpu=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
   const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,
      viewport:{width,height,pixelRatio:1},frameSequence:state.sequence});
   const bytes=new Uint8Array(width*height*4);
   gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,bytes);
   if(gl.getError()!==gl.NO_ERROR||gl.isContextLost())throw Error('GEN3358_AB_GPU_READPIXELS_FAILED');
   const frame=gpu.frameRecords.at(-1);
   if(frame?.navigationSequence!==state.sequence)throw Error('GEN3358_AB_FRAME_NAVIGATION_DRIFT');
   const digest=await crypto.subtle.digest('SHA-256',bytes);
   const hex=[...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('');
   frames.push({hidden,frameSequence:frame.frameSequence,
    viewport:[width,height],camera:{position:packet.camera.position,
      matrix:Array.from(packet.camera.viewProjectionMatrix)},rgbaSha256:hex,bytes});
  }
  globalThis.__gen3347HideGrass=false;
  if(frames.some((f,i)=>f.hidden!==(i===1))||
     !(frames[0].frameSequence<frames[1].frameSequence&&frames[1].frameSequence<frames[2].frameSequence))
    throw Error('GEN3358_AB_TOGGLE_OR_FRAME_ORDER_INVALID');
  const pos=frames.map(f=>f.camera.position);
  const mat=frames.map(f=>f.camera.matrix);
  if(pos.some(p=>p.x!==pos[0].x||p.y!==pos[0].y||p.z!==pos[0].z)||
     mat.some(m=>m.length!==16||m.some((v,i)=>v!==mat[0][i])))
    throw Error('GEN3358_AB_CAMERA_MATRIX_DRIFT');
  const a=frames[0].bytes,b=frames[1].bytes,c=frames[2].bytes;
  const measure=(center,radius)=>{
   const minX=center?Math.max(0,center[0]-radius):0;
   const maxX=center?Math.min(width-1,center[0]+radius):width-1;
   const minY=center?Math.max(0,center[1]-radius):0;
   const maxY=center?Math.min(height-1,center[1]+radius):height-1;
   let pixels=0,different=0,largeDifference=0,repeatDifference=0,stableGrassDifference=0;
   let sumOnOff=0,sumRepeat=0,maxOnOff=0;
   for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
    const o=(y*width+x)*4;
    let onOff=0,repeat=0;
    for(let k=0;k<3;k++){
     onOff=Math.max(onOff,Math.abs(a[o+k]-b[o+k]));
     repeat=Math.max(repeat,Math.abs(a[o+k]-c[o+k]));
    }
    pixels++;sumOnOff+=onOff;sumRepeat+=repeat;maxOnOff=Math.max(maxOnOff,onOff);
    if(onOff>=8)different++;
    if(onOff>=24)largeDifference++;
    if(repeat>=8)repeatDifference++;
    if(onOff>=12&&onOff>=repeat+8)stableGrassDifference++;
   }
   return {pixels,changedRGBAtLeast8:different,changedRGBAtLeast24:largeDifference,
    repeatDriftAtLeast8:repeatDifference,stableGrassEffectAtLeast12:stableGrassDifference,
    meanMaxRGBDelta:Number((sumOnOff/pixels).toFixed(4)),
    meanRepeatDelta:Number((sumRepeat/pixels).toFixed(4)),maxRGBDelta:maxOnOff};
  };
  const atPixel=([x,y])=>{const o=(y*width+x)*4;return [a,b,c].map(arr=>Array.from(arr.slice(o,o+4)));};
  return {schema:'H_EARTH_GEN3358_NORMAL_COLOR_GRASS_ABA_v1',
   evidenceClass:'SOURCE_BOUND_CHROMIUM_WEBGL2_NORMAL_COLOR_RGBA_NOT_PHYSICAL_ANDROID',
   switchSequence:['GRASS_ON','GRASS_HIDDEN','GRASS_ON_REPEAT'],
   probeModeAllFrames:0,sourceMutationPerformed:false,productMutationPerformed:false,
   viewport:[width,height],frameSequence:frames.map(f=>f.frameSequence),
   rgbaSha256:frames.map(f=>f.rgbaSha256),
   camera:frames[0].camera,
   overall:measure(null,0),
   samples:samples.map(s=>({id:s.id,pixelBottom:s.pixelBottom,
    rgbaByFrame:atPixel(s.pixelBottom),neighborhood56px:measure(s.pixelBottom,28)})),
   ownerImageParity:false,materialCausationUnproven:true};
 },{state,samples});
}
async function capture(browser,base,renderer,route,probe,output,receipt){
 const context=await browser.newContext({viewport:{width:FIXED.browserViewport[0],height:FIXED.browserViewport[1]},deviceScaleFactor:1.5,serviceWorkers:'block'});
 const page=await context.newPage();page.setDefaultTimeout(60000);const browserErrors=[];
 page.on('pageerror',e=>browserErrors.push(String(e.message)));
 await page.addInitScript({content:'globalThis.__hEarthFirstHitMaterialMode=0;globalThis.__gen3347HideGrass=false;'});
 await page.route(url=>url.pathname==='/'+FIXED.renderer,routeHandler=>routeHandler.fulfill({status:200,contentType:'text/javascript',body:renderer}));
 await page.route(url=>url.pathname==='/'+FIXED.route,routeHandler=>routeHandler.fulfill({status:200,contentType:'text/javascript',body:route}));
 try{
  await page.goto(base+FIXED.root+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
  insist(!(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true')),'GEN3347_RUNTIME_STARTUP_ERROR');
  await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
  await page.mouse.move(160,240);await page.mouse.down();await page.mouse.move(220,240,{steps:8});await page.mouse.up();
  await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled,null,{timeout:180000});
  await page.click('[data-enter]');
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true'&&
   document.querySelector('#h-earth-loading-screen')?.hidden===true,null,{timeout:180000});

  // Gen3361: the public route exposes controls before asynchronous grass residency.
  // A normal-color grass OFF/ON comparison before this witness is non-discriminating.
  await page.waitForFunction(()=>{
   const root=document.querySelector('#h-earth-functional-landscape-route');
   if(root?.dataset.vegetationState==='failed')return true;
   const grass=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.singleOwnerVegetation;
   return root?.dataset.vegetationState==='prepared'&&grass?.gpuAllocationVerified===true&&
    grass?.installedRootCount>0&&grass?.coarseRootCount>0&&
    grass?.drawCallCount>0&&grass?.visibleCoarseRoots>0;
  },null,{timeout:600000});
  const grassResidency=await page.evaluate(()=>{
   const root=document.querySelector('#h-earth-functional-landscape-route');
   if(root?.dataset.vegetationState==='failed')throw Error('GEN3361_BACKGROUND_GRASS_FAILED');
   const grass=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.singleOwnerVegetation;
   if(root?.dataset.vegetationState!=='prepared'||grass?.gpuAllocationVerified!==true||
      !(grass?.installedRootCount>0&&grass?.coarseRootCount>0&&
        grass?.drawCallCount>0&&grass?.visibleCoarseRoots>0))
    throw Error('GEN3361_GRASS_RESIDENCY_NOT_PROVEN');
   return {schema:'H_EARTH_GEN3361_PRE_CAPTURE_GRASS_RESIDENCY_v1',
    state:root.dataset.vegetationState,installedRootCount:grass.installedRootCount,
    coarseRootCount:grass.coarseRootCount,visibleCoarseRoots:grass.visibleCoarseRoots,
    drawCallCount:grass.drawCallCount,gpuAllocationVerified:true,
    source:'PUBLIC_ROUTE_SINGLE_OWNER_RESIDENT_RECEIPT',sourceMutationPerformed:false};
  });
  receipt.grassResidency=grassResidency;fs.writeFileSync(path.join(output,'qualification-payload.json'),JSON.stringify(receipt,null,2)+'\n');

  await page.evaluate(async()=>{
   const urls=[...new Set(performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x)))];
   if(urls.length!==1)throw Error('GEN3347_NAV_MODULE_AMBIGUOUS');
   const url=urls[0];let src=await(await fetch(url)).text();
   src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));
   src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';
   globalThis.__gen3347Nav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
  });
  for(let poseIndex=0;poseIndex<POSES.length;poseIndex++){
   const pose=POSES[poseIndex],sequence=334700+poseIndex;
   const state=await page.evaluate(({pose,sequence})=>{
    const nav=globalThis.__gen3347Nav,p=pose.point;
    if(pose.owner)return {contractId:nav.H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,position:{x:p.x,y:p.y,z:p.z},yawDegrees:p.yaw,pitchDegrees:p.pitch,verticalFovDegrees:56,sequence,action:'GEN3347_OWNER_FRAME_RECONSTRUCTION',accepted:false,terrainSupported:false,geologicalPhysicalSupport:false,diagnosticObserver:true,canonicalCameraStateAuthority:false,collisionOrPhysicsClaim:false};
    const support=nav.auditResolvePosition(p.x,p.z,p.yaw,'SURFACE');
    if(!support.eligible)throw Error('GEN3347_APPROVED_CONTROL_NOT_ADMITTED:'+pose.id);
    return nav.auditStateFrom(support,{yaw:p.yaw,pitch:p.pitch,fov:56,sequence,action:'GEN3347_APPROVED_GROVE_CONTROL'});
   },{pose,sequence});
   const normal=await page.evaluate(state=>{
    globalThis.__gen3347HideGrass=false;globalThis.__hEarthFirstHitMaterialMode=0;
    globalThis.__HEarthAuditPresent(state);
    const cv=document.querySelector('#h-earth-functional-landscape-canvas'),gl=cv?.getContext('webgl2'),gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
    if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('GEN3347_WEBGL2_CAPTURE_MISSING');
    const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:state.sequence});
    return {data:cv.toDataURL('image/png'),camera:{position:packet.camera.position,matrix:Array.from(packet.camera.viewProjectionMatrix)},viewport:[cv.width,cv.height],frame:gpu.frameRecords.at(-1),glError:gl.getError()};
   },state);
   insist(normal.glError===0&&normal.frame?.navigationSequence===state.sequence,'GEN3347_NORMAL_FRAME_INVALID');
   validatePoseReport(normal,pose.owner);
   const png=pngCheck(normal.data),filename='gen3347-'+pose.id+'-normal.png';
   fs.writeFileSync(path.join(output,filename),png);
   const row={id:pose.id,sourceHead:FIXED.productHead,normalPng:filename,normalSha256:sha256(png),camera:normal.camera,samples:pose.samples.map(p=>({id:p.id,pixelBottom:toGlPixel(p),modeEvidence:[],compound:null}))};
   row.grassNormalColorABA=await captureGrassNormalColorABA(page,state,row.samples.map(s=>({id:s.id,pixelBottom:s.pixelBottom})));
   validatePoseReport({camera:row.grassNormalColorABA.camera,viewport:row.grassNormalColorABA.viewport},pose.owner);
   receipt.grassVisibleHiddenComparisonObserved=true;
   receipt.poses.push(row);fs.writeFileSync(path.join(output,'qualification-payload.json'),JSON.stringify(receipt,null,2)+'\n');
   let previousFrame=row.grassNormalColorABA.frameSequence.at(-1);
   for(let mode=1;mode<=7;mode++){
    const raw=await page.evaluate(({state,mode,pixels})=>{
     globalThis.__gen3347HideGrass=true;globalThis.__hEarthFirstHitMaterialMode=mode;
     globalThis.__HEarthAuditPresent(state);
     const cv=document.querySelector('#h-earth-functional-landscape-canvas'),gl=cv.getContext('webgl2'),gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
     if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('GEN3347_READPIXELS_CONTEXT_MISSING');
     const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:state.sequence});
     const values=pixels.map(p=>{const bytes=new Uint8Array(4);gl.readPixels(p[0],p[1],1,1,gl.RGBA,gl.UNSIGNED_BYTE,bytes);return Array.from(bytes)});
     return {values,applied:globalThis.__hEarthFirstHitModeApplied,frame:gpu.frameRecords.at(-1),viewport:[cv.width,cv.height],camera:{position:packet.camera.position,matrix:Array.from(packet.camera.viewProjectionMatrix)},glError:gl.getError(),webgl:String(gl.getParameter(gl.VERSION)).includes('WebGL 2.0'),lost:gl.isContextLost(),renderer:gpu.resources?.rendererId,packageId:gpu.resources?.package?.runtimeIdentity};
    },{state,mode,pixels:row.samples.map(x=>x.pixelBottom)});
    insist(raw.webgl&&!raw.lost&&raw.glError===0&&raw.applied===mode,'GEN3347_GPU_MODE_READBACK_FAILED');
    validatePoseReport(raw,pose.owner);
    insist(raw.frame?.navigationSequence===state.sequence&&raw.frame.frameSequence>previousFrame,'GEN3347_FRAME_SEQUENCE_NOT_ADVANCED');
    previousFrame=raw.frame.frameSequence;
    insist(raw.values.length===row.samples.length,'GEN3347_SAMPLE_COUNT_CHANGED');
    const assetSignature=sha256(String(raw.packageId||'')+':'+String(raw.renderer||''));
    const drawSignature=sha256(String(raw.renderer)+':'+String(raw.packageId));
    for(let i=0;i<row.samples.length;i++){
     const rec=row.samples[i],capture={target:'published',sourceHead:FIXED.productHead,rendererObjectId:FIXED.rendererBlob,instrumentedSha256:receipt.instrumentedSourceSha256,webgl2:true,readbackClass:probe.PROBE_READBACK_CLASS,appliedMode:mode,poseId:pose.id,assetSignature,drawSignature,cameraPosition:[raw.camera.position.x,raw.camera.position.y,raw.camera.position.z],viewProjectionMatrix:raw.camera.matrix,viewport:FIXED.viewport,pixel:rec.pixelBottom,webglErrors:[]};
     const decoded=probe.decodeModePixel(mode,new Uint8Array(raw.values[i]),capture);
     rec.modeEvidence.push(decoded);
    }
   }
   for(const sample of row.samples)sample.compound=probe.combinePixelReceipts(sample.modeEvidence);
   fs.writeFileSync(path.join(output,'qualification-payload.json'),JSON.stringify(receipt,null,2)+'\n');
  }
  insist(browserErrors.length===0,'GEN3347_BROWSER_PAGE_ERRORS:'+browserErrors.join('|'));
  const approvedControls=receipt.poses.filter(row=>row.id==='approved-grove-A'||row.id==='approved-grove-B');
  insist(approvedControls.length===2&&approvedControls.every(row=>
   row.grassNormalColorABA?.rgbaSha256?.length===3&&
   row.grassNormalColorABA.rgbaSha256[0]!==row.grassNormalColorABA.rgbaSha256[1]),
   'GEN3361_AB_POSITIVE_GROVE_CONTROL_MISSING');
  receipt.grassAbaControlValidity='BOTH_APPROVED_GROVES_SOURCE_BOUND_POSITIVE_RGBA_SIGNAL';
  verifyReceiptRows(receipt.poses);
 }finally{await context.close()}
}
export async function qualify(args){
 const out=args['--output'],dir=path.dirname(out);fs.mkdirSync(dir,{recursive:true});
 const receipt={schema:'H_EARTH_GEN3347_FIRST_HIT_EXACT_HEAD_QUALIFICATION_RECEIPT_v1',operationId:FIXED.operationId,exactProductHead:FIXED.productHead,toolingHead:null,executionHolder:args['--execution-holder'],status:'INCOMPLETE',frame:FIXED.frame,ownerImageDigest:FIXED.photographSha256,ownerScreenPixelParity:false,physicalAndroidFirstHit:false,terrainMaterialCauseProven:false,poses:[],sourceMutationPerformed:false,productMutationPerformed:false,workflowMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false,errors:[]};
 const persist=()=>fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'gen3347-first-hit-'));let browser;persist();
 try{
  const [renderer,route,overlay]=await Promise.all([
   fetchPinnedSource(PUBLIC_BASE+'/'+FIXED.renderer,FIXED.rendererBlob,'diamondgatebridge.com'),
   fetchPinnedSource(PUBLIC_BASE+'/'+FIXED.route,FIXED.routeBlob,'diamondgatebridge.com'),
   fetchPinnedSource(HISTORIC_BASE+'/'+FIXED.historicOverlayHead+'/tools/h-earth-first-hit-material-overlay.mjs',FIXED.historicOverlayBlob,'raw.githubusercontent.com')
  ]);
  const adapted=retargetHistoricalOverlay(overlay,renderer),probePath=path.join(temp,'gen3347-adapted-first-hit-overlay.mjs');
  fs.writeFileSync(probePath,adapted);
  const probe=await import(pathToFileURL(probePath).href);
  const instrumentation=probe.transformExactRenderer(renderer,{target:'published'});
  const injected=injectHideGrass(instrumentation.source),instrumentedRoute=instrumentRoute(route);
  receipt.toolingHead=git(process.cwd(),['rev-parse','HEAD']);
  receipt.instrumentedSourceSha256=sha256(injected);
  receipt.originalRendererBlob=objectId(renderer);
  receipt.originalRouteBlob=objectId(route);
  receipt.historicalOverlayBlob=objectId(overlay);
  receipt.browserEvidenceClass='EXACT_SOURCE_RECONSTRUCTED_CHROMIUM_NOT_ANDROID_PHYSICAL_PIXEL';
  const {chromium}=installChromium(temp);
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
  await capture(browser,PUBLIC_BASE,injected,instrumentedRoute,probe,dir,receipt);
  receipt.status='SOURCE_BOUND_GPU_MATERIAL_SAMPLES_CAPTURED_OWNER_PARITY_UNVERIFIED';
 }catch(e){receipt.status='FAIL_CLOSED';receipt.errors.push({code:e.code||'GEN3347_QUALIFICATION_FAILED',message:String(e.message||e)});}
 finally{persist();if(browser)await browser.close();fs.rmSync(temp,{recursive:true,force:true});}
 return receipt;
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){let args;try{args=parseArgs(process.argv.slice(2));const r=await qualify(args);if(r.status!=='SOURCE_BOUND_GPU_MATERIAL_SAMPLES_CAPTURED_OWNER_PARITY_UNVERIFIED')process.exitCode=1;}catch(e){const failure={schema:'H_EARTH_GEN3347_FIRST_HIT_EXACT_HEAD_QUALIFICATION_RECEIPT_v1',status:'FAIL_CLOSED',errorCode:e.code||'GEN3347_ARGUMENT_INVALID',details:String(e.message||e),productMutationPerformed:false,mergePerformed:false,releasePerformed:false};if(args?.['--output'])fs.writeFileSync(args['--output'],JSON.stringify(failure,null,2)+'\n');else process.stderr.write(JSON.stringify(failure)+'\n');process.exitCode=1;}}
