/** H-Earth PR #7478: read-only first-party WebGL2 baseline/trial woodland soil-material comparison.
 * Exact reuse of the successful Gen3364 same-camera/GPU root/PNG capture method.
 * No grass/root/terrain/product mutation and no Android or artistic KEEP claim. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';

export const FIXED=Object.freeze({
 operationId:'H_EARTH_PR7478_INHOUSE_WEBGL2_MATERIAL_DIFFERENTIAL_BINDING_20261118_001',
 baseHead:'2fe4560b30cd9e46c2af141899eceb0559af5806',
 candidateHead:'840d2800d058c4234adc9c73e65a0129f82b5c94',
 grassPath:'showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js',
 baselineGrassBlob:'4c8428178b8a5d0b3ecf6fedf5173c37921e63ac',
 candidateGrassBlob:'4c8428178b8a5d0b3ecf6fedf5173c37921e63ac',
 rendererPath:'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',
 baseRendererBlob:'969a5dce59f7a3f15235a677173522d0c9736528',
 candidateRendererBlob:'a369cc6a1cce8b2ce84cc967f7ee3958b2a849a9',
 routePath:'showroom/globe/h-earth/vegetation-prototype/route.js',
 routeBlob:'bddf7dcf22c33ba4fa04928016016c37a78e031f',
 originalRootCount:3805291,
 framebuffer:Object.freeze([602,862]),
 browserViewport:Object.freeze([800,1146])
});
const RAW='https://raw.githubusercontent.com/smansfield635-create/smansfield635-create.github.io/';
const LIVE='https://diamondgatebridge.com/';
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const blobId=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const insist=(condition,code)=>{if(!condition)throw Error(code)};
function parseArgs(args){
 insist(Array.isArray(args)&&args.length===6,'GEN3364_CLOSED_INPUT_SET_REQUIRED');
 const o={};for(let i=0;i<args.length;i+=2){insist(['--candidate-head','--execution-holder','--output'].includes(args[i])&&!Object.hasOwn(o,args[i]),'GEN3364_EXTRA_OR_DUPLICATE_ARGUMENT');o[args[i]]=args[i+1]}
 insist(o['--candidate-head']===FIXED.candidateHead,'GEN3364_CANDIDATE_HEAD_MISMATCH');
 insist(/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(o['--execution-holder']||''),'GEN3364_HOLDER_INVALID');
 insist(path.isAbsolute(o['--output']||''),'GEN3364_ABSOLUTE_OUTPUT_REQUIRED');
 return o;
}
async function pinned(url,expected,host){
 const u=new URL(url);
 insist(u.protocol==='https:'&&u.hostname===host&&!u.search&&!u.hash&&!u.username&&!u.password,'GEN3364_UNTRUSTED_SOURCE_URL');
 const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(120000)});
 insist(response.status===200&&!response.redirected,'GEN3364_SOURCE_FETCH_FAILED:'+String(response.status));
 const bytes=Buffer.from(await response.arrayBuffer());
 insist(bytes.length>0&&bytes.length<16*1024*1024&&blobId(bytes)===expected,'GEN3364_PINNED_SOURCE_BLOB_DRIFT:'+url);
 return bytes.toString('utf8');
}
function once(source,oldText,newText){
 insist(source.split(oldText).length===2,'GEN3364_NONUNIQUE_SOURCE_INSTRUMENTATION');
 return source.replace(oldText,newText);
}
function installChromium(dir){
 const prefix=path.join(dir,'browser-deps');fs.mkdirSync(prefix,{recursive:true});
 const run=(cmd,args,cwd)=>{const r=spawnSync(cmd,args,{cwd,encoding:'utf8',timeout:720000,maxBuffer:16*1024*1024});insist(!r.error&&r.status===0,'GEN3364_BROWSER_INSTALL_FAILED:'+String(r.stderr||r.error||'').slice(-300))};
 run('npm',['install','--prefix',prefix,'--no-save','--no-package-lock','--no-audit','playwright@1.55.0'],dir);
 run(process.execPath,[path.join(prefix,'node_modules/playwright/cli.js'),'install','--with-deps','chromium'],prefix);
 return createRequire(path.join(prefix,'package.json'))('playwright');
}
const poses=Object.freeze([
 Object.freeze({id:'owner',point:{x:189.44655456958074,y:25.464462201545384,z:-232.87709610812828,yaw:82.28081197023364,pitch:-19.87206530590953}}),
 Object.freeze({id:'groveA',point:{x:-139.40268,z:-194.5,yaw:180,pitch:-19}}),
 Object.freeze({id:'groveB',point:{x:-141,z:-226,yaw:180,pitch:-19}})
]);
async function capture(browser,kind,grass,renderer,route,dir){
 const context=await browser.newContext({viewport:{width:FIXED.browserViewport[0],height:FIXED.browserViewport[1]},deviceScaleFactor:1.5,serviceWorkers:'block'});
 const page=await context.newPage();page.setDefaultTimeout(60000);
 let requestedGrass=0;const pageErrors=[];
 page.on('pageerror',e=>pageErrors.push(String(e.message)));
 await page.route(u=>u.pathname==='/'+FIXED.rendererPath,h=>h.fulfill({status:200,contentType:'text/javascript',body:renderer}));
 await page.route(u=>u.pathname==='/'+FIXED.routePath,h=>h.fulfill({status:200,contentType:'text/javascript',body:route}));
 await page.route(u=>u.pathname==='/'+FIXED.grassPath,h=>{requestedGrass++;return h.fulfill({status:200,contentType:'text/javascript',body:grass})});
 const records=[];
 try{
  await page.goto(LIVE+'showroom/globe/h-earth/?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
  insist(!(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true')),'GEN3364_ROUTE_STARTUP_ERROR');
  await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
  await page.mouse.move(160,240);await page.mouse.down();await page.mouse.move(220,240,{steps:8});await page.mouse.up();
  await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled,null,{timeout:180000});
  await page.click('[data-enter]');
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true'&&document.querySelector('#h-earth-loading-screen')?.hidden===true,null,{timeout:180000});
  await page.waitForFunction(()=>{
   const root=document.querySelector('#h-earth-functional-landscape-route');
   if(root?.dataset.vegetationState==='failed')return true;
   const g=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.singleOwnerVegetation;
   return root?.dataset.vegetationState==='prepared'&&g?.gpuAllocationVerified===true&&g?.installedRootCount>0&&g?.coarseRootCount>0&&g?.drawCallCount>0;
  },null,{timeout:600000});
  await page.evaluate(async()=>{
   const urls=[...new Set(performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x)))];
   if(urls.length!==1)throw Error('GEN3364_NAVIGATION_MODULE_AMBIGUOUS');
   const url=urls[0];let src=await(await fetch(url)).text();
   src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));
   src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';
   globalThis.__gen3364Nav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
  });
  for(let i=0;i<poses.length;i++){
   const pose=poses[i],sequence=336400+i;
   const state=await page.evaluate(({pose,sequence})=>{
    const nav=globalThis.__gen3364Nav,p=pose.point;
    if(pose.id==='owner')return {contractId:nav.H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,position:{x:p.x,y:p.y,z:p.z},yawDegrees:p.yaw,pitchDegrees:p.pitch,verticalFovDegrees:56,sequence,action:'GEN3364_OWNER_CAMERA_RECONSTRUCTION',accepted:false,terrainSupported:false,geologicalPhysicalSupport:false,diagnosticObserver:true,canonicalCameraStateAuthority:false,collisionOrPhysicsClaim:false};
    const support=nav.auditResolvePosition(p.x,p.z,p.yaw,'SURFACE');
    if(!support.eligible)throw Error('GEN3364_GROVE_POSE_NOT_ADMITTED:'+pose.id);
    return nav.auditStateFrom(support,{yaw:p.yaw,pitch:p.pitch,fov:56,sequence,action:'GEN3364_APPROVED_GROVE_CONTROL'});
   },{pose,sequence});
   const read=await page.evaluate(state=>{
    const cv=document.querySelector('#h-earth-functional-landscape-canvas'),gl=cv?.getContext('webgl2');
    if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true||!String(gl.getParameter(gl.VERSION)).includes('WebGL 2.0'))throw Error('GEN3364_REAL_WEBGL2_CONTEXT_MISSING');
    globalThis.__HEarthAuditPresent(state);
    const gpu=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt();
    const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:state.sequence});
    const grass=gpu?.resources?.singleOwnerVegetation;
    if(cv.width!==602||cv.height!==862||!grass?.gpuAllocationVerified||grass?.installedRootCount!==3805291)throw Error('GEN3364_RESIDENCY_OR_VIEWPORT_DRIFT');
    const b=new Uint8Array(cv.width*cv.height*4);gl.readPixels(0,0,cv.width,cv.height,gl.RGBA,gl.UNSIGNED_BYTE,b);
    if(gl.getError()!==gl.NO_ERROR||gl.isContextLost()||gpu.frameRecords.at(-1)?.navigationSequence!==state.sequence)throw Error('GEN3364_GPU_READBACK_FRAME_INVALID');
    let binary='';for(let j=0;j<b.length;j+=8192)binary+=String.fromCharCode(...b.subarray(j,j+8192));
    return {rgba:btoa(binary),png:cv.toDataURL('image/png'),camera:{position:packet.camera.position,matrix:Array.from(packet.camera.viewProjectionMatrix)},frameSequence:gpu.frameRecords.at(-1).frameSequence,rootCount:grass.installedRootCount,coarseRoots:grass.coarseRootCount,visibleCoarseRoots:grass.visibleCoarseRoots,drawCalls:grass.drawCallCount,gpuAllocationVerified:grass.gpuAllocationVerified};
   },state);
   const raw=Buffer.from(read.rgba,'base64'),png=Buffer.from(read.png.slice('data:image/png;base64,'.length),'base64');
   insist(raw.length===FIXED.framebuffer[0]*FIXED.framebuffer[1]*4&&png.length>1024,'GEN3364_FRAME_BYTES_INVALID');
   fs.writeFileSync(path.join(dir,kind+'-'+pose.id+'.rgba'),raw);
   fs.writeFileSync(path.join(dir,kind+'-'+pose.id+'.png'),png);
   records.push({poseId:pose.id,frameSequence:read.frameSequence,camera:read.camera,rootCount:read.rootCount,coarseRoots:read.coarseRoots,visibleCoarseRoots:read.visibleCoarseRoots,drawCalls:read.drawCalls,gpuAllocationVerified:read.gpuAllocationVerified,rgbaSha256:sha256(raw),pngSha256:sha256(png),rgbaPath:kind+'-'+pose.id+'.rgba',pngPath:kind+'-'+pose.id+'.png'});
  }
  insist(requestedGrass>0,'GEN3364_GRASS_SOURCE_INTERCEPTION_NOT_EXERCISED');
  insist(pageErrors.length===0,'GEN3364_PAGE_SCRIPT_ERRORS:'+pageErrors.join('|').slice(0,400));
  return {variant:kind,grassRequested:requestedGrass,poses:records,sourceMutationPerformed:false};
 }finally{await context.close()}
}
function compare(a,b,dir){
 const rows=[];
 for(const pose of ['owner','groveA','groveB']){
  const x=a.poses.find(p=>p.poseId===pose),y=b.poses.find(p=>p.poseId===pose);
  insist(x&&y&&x.rootCount===FIXED.originalRootCount&&y.rootCount===FIXED.originalRootCount,'GEN3364_ROOT_CENSUS_PARITY_FAILED');
  insist(x.coarseRoots===y.coarseRoots&&x.gpuAllocationVerified&&y.gpuAllocationVerified,'GEN3364_COARSE_GPU_PARITY_FAILED');
  const q=x.camera.position,r=y.camera.position;
  insist(['x','y','z'].every(k=>Math.abs(q[k]-r[k])<=0.02),'GEN3364_SAME_CAMERA_POSITION_DRIFT');
  insist(x.camera.matrix.length===16&&y.camera.matrix.length===16&&x.camera.matrix.every((v,i)=>Math.abs(v-y.camera.matrix[i])<0.06),'GEN3364_SAME_CAMERA_MATRIX_DRIFT');
  const c=fs.readFileSync(path.join(dir,x.rgbaPath)),d=fs.readFileSync(path.join(dir,y.rgbaPath));
  insist(c.length===d.length&&c.length===FIXED.framebuffer[0]*FIXED.framebuffer[1]*4,'GEN3364_FRAMEBUFFER_PARITY_FAILED');
  let changed8=0,changed24=0,sum=0,max=0;for(let i=0;i<c.length;i+=4){let delta=Math.max(Math.abs(c[i]-d[i]),Math.abs(c[i+1]-d[i+1]),Math.abs(c[i+2]-d[i+2]));sum+=delta;if(delta>=8)changed8++;if(delta>=24)changed24++;if(delta>max)max=delta}
  rows.push({poseId:pose,rootCount:x.rootCount,baseRgbSha256:x.rgbaSha256,trialRgbSha256:y.rgbaSha256,changedRGBAtLeast8:changed8,changedRGBAtLeast24:changed24,meanMaxRGBDelta:Number((sum/(c.length/4)).toFixed(5)),maxRGBDelta:max,baselineImage:x.pngPath,trialImage:y.pngPath,framebuffer:[...FIXED.framebuffer],sourceBoundSameCamera:true});
 }
 return rows;
}
async function qualify(args){
 const out=args['--output'],dir=path.dirname(out);fs.mkdirSync(dir,{recursive:true});
 const receipt={schema:'H_EARTH_PR7478_MATERIAL_WEBGL2_AB_RECEIPT_v1',operationId:FIXED.operationId,exactProductHead:FIXED.candidateHead,acceptedBaseHead:FIXED.baseHead,executionHolder:args['--execution-holder'],result:'FAIL_CLOSED',errorCode:null,evidenceClass:'FIRST_PARTY_NORMAL_COLOR_CHROMIUM_WEBGL2_NOT_PHYSICAL_ANDROID',sourceMutationPerformed:false,productMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false,ownerVisualAccepted:false,originalAnchorVideoReplayed:false,proofOnlyNotArtisticKeep:true,poses:[]};
 const persist=()=>fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'gen3364-grass-'));let browser;persist();
 try{
  const [baseGrass,candidateGrass,baseRenderer,candidateRenderer,route]=await Promise.all([
   pinned(RAW+FIXED.baseHead+'/'+FIXED.grassPath,FIXED.baselineGrassBlob,'raw.githubusercontent.com'),
   pinned(RAW+FIXED.candidateHead+'/'+FIXED.grassPath,FIXED.candidateGrassBlob,'raw.githubusercontent.com'),
   pinned(RAW+FIXED.baseHead+'/'+FIXED.rendererPath,FIXED.baseRendererBlob,'raw.githubusercontent.com'),
   pinned(RAW+FIXED.candidateHead+'/'+FIXED.rendererPath,FIXED.candidateRendererBlob,'raw.githubusercontent.com'),
   pinned(LIVE+FIXED.routePath,FIXED.routeBlob,'diamondgatebridge.com')
  ]);
  insist(candidateGrass===baseGrass,'PR7478_GRASS_SOURCE_MUST_BE_IDENTICAL');
  const donor='vec3 worldSoilActualAlbedo=';
  const authority='ordinaryLandDonorMaterial=geologicalEarthRock?0.0:worldSoilEligibility;';
  const synthetic='identityWeight*=1.0-ordinaryLandDonorMaterial;';
  const pigment='groundcoverPigmentWeight*=1.0-ordinaryLandDonorMaterial;';
  insist(baseRenderer.includes(donor)&&candidateRenderer.includes(donor),'PR7478_PHOTOGRAPHIC_DONOR_MISSING');
  for(const token of [authority,synthetic,pigment]){
   insist(!baseRenderer.includes(token)&&candidateRenderer.split(token).length===2,'PR7478_EXACT_MATERIAL_DELTA_MISMATCH');
  }
  insist(candidateRenderer.includes('float sandCoverage=renderedBeachCoverage(')&&candidateRenderer.includes('float steepBank=materialHillsideWeight'),'PR7478_COAST_ROCK_CONTROLS_MISSING');
  const instrumentedRoute=once(route,'const cssWidth=','globalThis.__HEarthAuditPresent=present;globalThis.__HEarthAuditPacket=createHEarthRun8ER3AFrameUniformPacket;\nconst cssWidth=');
  const {chromium}=installChromium(tmp);
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
  const baseline=await capture(browser,'accepted',baseGrass,baseRenderer,instrumentedRoute,dir);
  receipt.accepted=baseline;persist();
  const candidate=await capture(browser,'candidate',candidateGrass,candidateRenderer,instrumentedRoute,dir);
  receipt.candidate=candidate;receipt.poses=compare(baseline,candidate,dir);
  receipt.groveAReferenceOnlyNotPositiveControl=true;
  const owner=receipt.poses.find(p=>p.poseId==='owner');
  receipt.ownerChangedRGBAtLeast8=owner?.changedRGBAtLeast8??null;
  receipt.ownerVisualDefectResolved='NOT_DETERMINED_BY_GPU_PIXEL_DELTA';
  receipt.coastAndRockPreservedInSourceOnly=true;
  receipt.result='CANDIDATE_SOURCE_BOUND_NATIVE_RGB_DIFFERENTIAL_CAPTURED_NOT_OWNER_ACCEPTED';
 }catch(e){receipt.result='FAIL_CLOSED';receipt.errorCode=String(e.message||e).slice(0,800)}
 finally{persist();if(browser)await browser.close();fs.rmSync(tmp,{recursive:true,force:true})}
 return receipt;
}
const args=parseArgs(process.argv.slice(2));
const final=await qualify(args);
if(final.result!=='CANDIDATE_SOURCE_BOUND_NATIVE_RGB_DIFFERENTIAL_CAPTURED_NOT_OWNER_ACCEPTED')process.exitCode=1;
