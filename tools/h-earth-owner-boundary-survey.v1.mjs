/** Bounded owner-location search, not proof of the screenshot's exact pose. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {assertCheckout,comparisonState,instrumentProductionRoute,assetReadiness,footprintVegetationReadiness,normalizeVegetationIdentity,PRODUCTION_RENDERER_SHA256,PRODUCTION_ROUTE_SHA256,PRODUCTION_ATLASES,validateProductionAtlasResponses} from './h-earth-ground-material-comparison.v1.mjs';
export const SCENE_HEAD='50b337ff7bbfb6fce4876e1037ac96d5faff65a6';
export const PROFILE='OWNER_BOUNDARY_SURVEY_V1';
export const ANCHOR=Object.freeze({x:140.1713950862869,z:-365.406512359563,capturedAt:'2026-10-29T22:43:55.216Z',source:'OWNER_LOADING_REPORT_NAVIGATION_POSITION',exactScreenshotPoseProven:false});
export const VIEWPORT=Object.freeze({width:384,height:688});
export const POSES=Object.freeze(Array.from({length:12},(_,i)=>Object.freeze({name:`owner-heading-${String(i*30).padStart(3,'0')}`,x:ANCHOR.x,z:ANCHOR.z,yaw:i*30,pitch:-14})));
export const ROOT='/showroom/globe/h-earth/';
export const RENDERER=ROOT+'render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
export const ROUTE=ROOT+'vegetation-prototype/route.js';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function parseArgs(argv){
 const a={};for(let i=0;i<argv.length;i+=2){if(!['--scene-dir','--output'].includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('SURVEY_CLI_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}
 if(Object.keys(a).length!==2||a['--output']===a['--scene-dir']||a['--output'].startsWith(a['--scene-dir']+path.sep))throw Error('SURVEY_DIRECTORIES');return a;
}
export function surveyReadiness(resources,camera){
 const a=assetReadiness(resources,camera),b=footprintVegetationReadiness(resources);
 const imported=[resources.jacaranda,...resources.treeCollection.entries];
 return {ready:a.ready&&b.ready&&resources.singleOwnerVegetation?.installedRootCount===2914527&&imported.length===9&&imported.every(e=>e.state==='READY'&&e.ready===true),signature:a.signature+'|'+b.signature};
}
export function validateView(v,pose,sequence){
 if(v.state?.position?.x!==pose.x||v.state.position.z!==pose.z||v.state.yawDegrees!==pose.yaw||v.state.pitchDegrees!==pose.pitch||v.state.verticalFovDegrees!==56||!Number.isFinite(v.state.position.y)||v.state.diagnosticObserver===true)throw Error('SURVEY_POSE');
 if(v.state.sequence!==sequence||v.lastFrame?.navigationSequence!==sequence||!Number.isInteger(v.lastFrame.frameSequence)||v.lastFrame.frameSequence<1)throw Error('SURVEY_FRAME');
 for(const k of ['x','y','z'])if(!Number.isFinite(v.expectedCameraPosition?.[k])||!Number.isFinite(v.lastFrame.cameraPosition?.[k])||Math.abs(v.expectedCameraPosition[k]-v.lastFrame.cameraPosition[k])>1e-8)throw Error('SURVEY_CAMERA');
 if(v.canvas?.width!==384||v.canvas?.height!==688||v.canvas?.cssWidth!==384||v.canvas?.cssHeight!==688)throw Error('SURVEY_VIEWPORT');
 const a=surveyReadiness(v.resources,v.lastFrame.cameraPosition);
 if(!a.ready||v.assetSignature!==a.signature)throw Error('SURVEY_RESIDENCY');
 if(v.grassHidden!==false||v.rendererResponseTransformed!==false)throw Error('SURVEY_PRESENTATION_CHANGED');return true;
}
export function decodeCapture(capture,frame){
 for(const f of [capture.before,capture.after])if(f?.navigationSequence!==frame.navigationSequence||f?.frameSequence!==frame.frameSequence)throw Error('SURVEY_CAPTURE_FRAME_CHANGED');
 if(!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(capture.dataUrl??''))throw Error('SURVEY_PNG');
 const b=Buffer.from(capture.dataUrl.split(',')[1],'base64');if(b.length<1024||!b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||b.toString('ascii',12,16)!=='IHDR'||b.readUInt32BE(16)!==384||b.readUInt32BE(20)!==688)throw Error('SURVEY_PNG_DIMENSIONS');return b;
}
export function validateSet(views){
 if(views.length!==12)throw Error('SURVEY_FRAME_CAP');
 if(views.some(v=>v.assetSignature!==views[0].assetSignature))throw Error('SURVEY_ASSET_IDENTITY_DRIFT');
 for(const pose of POSES){const a=views.filter(v=>v.pose?.name===pose.name);if(a.length!==1||JSON.stringify(a[0].pose)!==JSON.stringify(pose))throw Error('SURVEY_POSE_SET');validateView(a[0],pose,a[0].state.sequence);}
 return true;
}
export async function run(argv){
 const a=parseArgs(argv),dir=a['--scene-dir'],out=a['--output'];fs.mkdirSync(out,{recursive:true});
 const receipt={schema:'H_EARTH_OWNER_BOUNDARY_SURVEY_v1',profile:PROFILE,result:'INCOMPLETE',sceneHead:SCENE_HEAD,anchor:ANCHOR,poses:POSES,viewport:VIEWPORT,frameCap:12,runBudget:1,automaticRetry:false,exactScreenshotMatchProven:false,rootCauseProven:false,productMutation:false,rendererResponseTransformed:false,physicalVegetationPreserved:true,actualVegetationPixelVisibilityAsserted:false,physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,views:[],errors:[]};
 const persist=()=>fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 let server,browser;persist();
 try{
  assertCheckout(dir,SCENE_HEAD);
  const renderer=fs.readFileSync(path.join(dir,RENDERER),'utf8'),routeSource=fs.readFileSync(path.join(dir,ROUTE),'utf8');
  if(sha(renderer)!==PRODUCTION_RENDERER_SHA256||sha(routeSource)!==PRODUCTION_ROUTE_SHA256)throw Error('SURVEY_PRODUCT_CUSTODY');
  const auditRoute=instrumentProductionRoute(routeSource);receipt.sourceSha256={renderer:sha(renderer),route:sha(routeSource)};receipt.routeObservationSha256=sha(auditRoute);persist();
  const base='http://127.0.0.1:18767';server=spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',dir],{stdio:'ignore'});const serverErrors=[];server.on('error',e=>serverErrors.push(e.message));
  let listening=false;for(let i=0;i<50;i++){try{if((await fetch(base+ROOT)).ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SURVEY_SERVER:'+serverErrors.join(';'));
  const {chromium}=await import('playwright');browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:VIEWPORT,deviceScaleFactor:1}),page=await context.newPage();page.setDefaultTimeout(30000);
  await page.addInitScript({content:'globalThis.__groundComparisonState='+comparisonState.toString()+';globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.normalizeVegetationIdentity='+normalizeVegetationIdentity.toString()+';globalThis.__footprintVegetationReadiness='+footprintVegetationReadiness.toString()+';globalThis.assetReadiness=__groundAssetReadiness;globalThis.footprintVegetationReadiness=__footprintVegetationReadiness;globalThis.__surveyReadiness='+surveyReadiness.toString()+';'});
  const responses=[],pending=[];
  page.on('pageerror',e=>receipt.errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')receipt.errors.push('CONSOLE:'+m.text());});page.on('requestfailed',r=>receipt.errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
  page.on('response',r=>{if(r.status()>=400)receipt.errors.push('HTTP:'+r.status()+':'+r.url());const pathname=new URL(r.url()).pathname;if(Object.hasOwn(PRODUCTION_ATLASES,pathname)||pathname===RENDERER)pending.push((async()=>{try{const b=await r.body();responses.push({path:pathname,status:r.status(),sha256:sha(b),bytes:b.length});}catch(e){receipt.errors.push('RESPONSE:'+String(e));}})());});
  // Only expose the already-existing presentation and packet functions. No renderer interception.
  await page.route(url=>url.pathname===ROUTE,r=>r.fulfill({status:200,contentType:'text/javascript',body:auditRoute}));
  await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
  if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('SURVEY_STARTUP_FAILED');
  await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
  await page.mouse.move(170,350);await page.mouse.down();await page.mouse.move(220,350,{steps:8});await page.mouse.up();await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled);await page.click('[data-enter]');
  await page.evaluate(async()=>{const urls=[...new Set(performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x)))];if(urls.length!==1)throw Error('SURVEY_NAV_IDENTITY');const url=urls[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
  let sequence=10000,previousFrame=0;
  for(const pose of POSES){
   const seq=++sequence,deadline=Date.now()+180000;let signature=null,stable=0;
   while(stable<2){
    const settled=await page.evaluate(async({pose,seq})=>{const state=__groundComparisonState(__groundComparisonNav,pose,seq,'OWNER_BOUNDARY_SURVEY_SETTLE');__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas'),packet=__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:seq});const a=__surveyReadiness(gpu.resources,packet.camera.position);return {...a,frame:gpu.frameRecords.at(-1)};},{pose,seq});
    receipt.lastSettle={pose,...settled};persist();stable=settled.ready&&settled.frame.navigationSequence===seq&&settled.signature===signature?stable+1:0;signature=settled.signature;if(Date.now()>deadline)throw Error('SURVEY_ASSETS_NOT_SETTLED');if(stable<2)await new Promise(r=>setTimeout(r,250));
   }
   const v=await page.evaluate(async({pose,seq})=>{const state=__groundComparisonState(__groundComparisonNav,pose,seq,'OWNER_BOUNDARY_SURVEY_CAPTURE');__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);const canvas=document.querySelector('#h-earth-functional-landscape-canvas'),gl=canvas.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('SURVEY_CANVAS');gl.finish();const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),packet=__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:seq});const before=gpu.frameRecords.at(-1),dataUrl=canvas.toDataURL('image/png'),after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {state,worldPacket:packet,expectedCameraPosition:packet.camera.position,lastFrame:before,canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},resources:gpu.resources,capture:{before,after,dataUrl}};},{pose,seq});
   Object.assign(v,{pose,assetSignature:signature,grassHidden:false,rendererResponseTransformed:false});validateView(v,pose,seq);if(v.lastFrame.frameSequence<=previousFrame)throw Error('SURVEY_FRAME_NOT_ADVANCED');previousFrame=v.lastFrame.frameSequence;
   const bytes=decodeCapture(v.capture,v.lastFrame);delete v.capture;const image=pose.name+'.png';fs.writeFileSync(path.join(out,image),bytes);receipt.views.push({...v,image,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
  }
  await Promise.all(pending);validateProductionAtlasResponses(responses.filter(r=>Object.hasOwn(PRODUCTION_ATLASES,r.path)));const rendererResponses=responses.filter(r=>r.path===RENDERER);if(rendererResponses.length!==1||rendererResponses[0].sha256!==PRODUCTION_RENDERER_SHA256||rendererResponses[0].status!==200)throw Error('SURVEY_RENDERER_HTTP_CUSTODY');receipt.productResponses=responses;
  validateSet(receipt.views);assertCheckout(dir,SCENE_HEAD);if(receipt.errors.length)throw Error('SURVEY_BROWSER_ERRORS');receipt.result='LOCATION_SURVEY_COMPLETE_VISUAL_MATCH_REVIEW_PENDING';
 }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
 finally{persist();server?.kill();await browser?.close();}
 return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});
