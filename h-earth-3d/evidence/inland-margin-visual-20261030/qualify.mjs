/** Six-frame remaining-boundary capture; prior controls retained in Gen2996 evidence. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {assertCheckout,comparisonState,instrumentRoute,assetReadiness,footprintVegetationReadiness,normalizeVegetationIdentity,PRODUCTION_RENDERER_SHA256,PRODUCTION_ROUTE_SHA256,PRODUCTION_ATLASES,validateProductionAtlasResponses} from '../../../tools/h-earth-ground-material-comparison.v1.mjs';
export const BASELINE_HEAD='260c66540b4471bb3d50cbc28cf82d160b732b19';
export const CANDIDATE_HEAD='3ea149e5b56e8cc0d5aac192bce0cdd47da7e626';
const ADMISSION=JSON.parse(fs.readFileSync(new URL('./admission.json',import.meta.url)));
export const PROFILE='INLAND_REMAINING_MARGIN_COVERAGE_V1';
export const OPERATION='H_EARTH_REMAINING_MARGIN_COVERAGE_20261030_001';
export const VIEWPORT=Object.freeze({width:384,height:688});
export const TARGET=Object.freeze({x:-189,z:-736});
export const COVERAGE_PLAN=JSON.parse(fs.readFileSync(new URL('./coverage-plan.json',import.meta.url)));
export const POSES=Object.freeze(COVERAGE_PLAN.poses.map(Object.freeze));
export const WARMUP_POSE=Object.freeze({name:'protected-meadow',x:-52,z:-208,yaw:136,pitch:-15});
export const CAPTURE_STEPS=Object.freeze([
 Object.freeze({pose:WARMUP_POSE,sequence:9999,capture:false}),
 ...POSES.map((pose,i)=>Object.freeze({pose,sequence:10001+i,capture:true}))
]);
export const BINDING_PATH='h-earth-3d/evidence/inland-margin-visual-20261030/product-binding.json';
export const ROOT='/showroom/globe/h-earth/';
export const RENDERER=ROOT+'render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
export const ROUTE=ROOT+'vegetation-prototype/route.js';
export const PRESENTATION=ROOT+'render/habitat-material-presentation.v1.js';
export const MARGIN=ROOT+'render/material-margin-field.v1.js';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function validateNavigationDomain(nav,poses=[WARMUP_POSE,...POSES]){
 if(typeof nav.isHEarthPositionInsideTraversalDomain!=='function')throw Error('NAVIGATION_DOMAIN_API');
 for(const pose of poses){
  if(pose.diagnosticObserver===true){if(!['x','y','z','yaw','pitch'].every(k=>Number.isFinite(pose[k])))throw Error('DIAGNOSTIC_POSE_INVALID:'+pose.name);}
  else if(!nav.isHEarthPositionInsideTraversalDomain(pose.x,pose.z))throw Error('POSE_OUTSIDE_NAVIGATION_DOMAIN:'+pose.name);
 }
 return true;
}
export function parseArgs(argv){
 const a={};for(let i=0;i<argv.length;i+=2){if(!['--baseline-dir','--candidate-dir','--output'].includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('EDGE_CLI_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}
 if(Object.keys(a).length!==3||new Set(Object.values(a)).size!==3||['--baseline-dir','--candidate-dir'].some(k=>a['--output'].startsWith(a[k]+path.sep)))throw Error('EDGE_DIRECTORIES');return a;
}
export function surveyReadiness(resources,camera){
 const a=assetReadiness(resources,camera),b=footprintVegetationReadiness(resources);
 const imported=[resources.jacaranda,...resources.treeCollection.entries];
 return {ready:a.ready&&b.ready&&resources.singleOwnerVegetation?.installedRootCount===2914527&&imported.length===9&&imported.every(e=>e.state==='READY'&&e.ready===true),signature:a.signature+'|'+b.signature};
}
export function expectedNavigationYaw(requested){
 if(!Number.isFinite(requested))throw Error('SURVEY_HEADING_NONFINITE');
 let x=requested%360;if(x>180)x-=360;if(x< -180)x+=360;return x;
}
export function matchesCanonicalHeading(actual,requested){
 return Number.isFinite(actual)&&Number.isFinite(requested)&&actual>=-180&&actual<=180&&actual===expectedNavigationYaw(requested);
}
export function validateCoverageCamera(v,pose){
 const c=v.worldPacket?.camera,p=c?.localAuthoringPosition,m=c?.viewProjectionMatrix;
 if(!p||!Number.isFinite(p.y)||Math.abs(p.y-pose.expectedReconciledY)>1e-8||p.x!==pose.x||p.z!==pose.z)throw Error('COVERAGE_RECONCILED_EYE');
 if(!Array.isArray(m)||m.length!==16||m.some((x,i)=>!Number.isFinite(x)||Math.abs(x-pose.viewProjectionMatrix[i])>1e-8))throw Error('COVERAGE_PROJECTION_MATRIX');
 return true;
}
export function validateView(v,pose,sequence){
 validateCoverageCamera(v,pose);
 if(v.state?.position?.x!==pose.x||v.state.position.z!==pose.z||!matchesCanonicalHeading(v.state.yawDegrees,pose.yaw)||v.state.pitchDegrees!==pose.pitch||v.state.verticalFovDegrees!==56||!Number.isFinite(v.state.position.y)||(v.state.diagnosticObserver===true)!==(pose.diagnosticObserver===true)||(pose.diagnosticObserver===true&&v.state.position.y!==pose.y))throw Error('SURVEY_POSE');
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
 if(views.length!==3)throw Error('SURVEY_FRAME_CAP');
 if(views.some(v=>v.assetSignature!==views[0].assetSignature))throw Error('SURVEY_ASSET_IDENTITY_DRIFT');
 for(const pose of POSES){const a=views.filter(v=>v.pose?.name===pose.name);if(a.length!==1||JSON.stringify(a[0].pose)!==JSON.stringify(pose))throw Error('SURVEY_POSE_SET');validateView(a[0],pose,a[0].state.sequence);}
 return true;
}
export function validateMaterial(resources,label,expected){
 const m=resources?.materialMarginCorrection;
 if(label==='baseline'){if(m!=null)throw Error('BASELINE_MARGIN_PRESENT');return true;}
 if(label!=='candidate'||!m||m.status!=='SOURCE_MATCHED_COMPARISON_CANDIDATE')throw Error('MARGIN_NOT_ACTIVE');
 for(const [k,v]of Object.entries(expected.marginReceipt))if(JSON.stringify(m[k])!==JSON.stringify(v))throw Error('MARGIN_RECEIPT:'+k);
 return true;
}
export function validateHttp(responses,label,expected){
 for(const [name,key]of [[PRESENTATION,'presentationSha256'],...(label==='candidate'?[[MARGIN,'marginSha256']]:[])]){
  const a=responses.filter(r=>r.path===name);if(a.length!==1||a[0].status!==200||a[0].sha256!==expected[key])throw Error('HELPER_HTTP_CUSTODY:'+name);
 }
 if(label==='baseline'&&responses.some(r=>r.path===MARGIN))throw Error('BASELINE_MARGIN_HTTP');
 return true;
}
export function validateHeads(before,after){if(before!==BASELINE_HEAD||after!==CANDIDATE_HEAD)throw Error('FROZEN_SCENE_HEAD');return true;}
export async function preflightNavigation(dir,expected){
 const navigationFile=path.join(dir,ROOT,'functional-landscape/navigation.js');
 if(sha(fs.readFileSync(navigationFile))!==expected.navigationSha256)throw Error('NAVIGATION_SOURCE_CUSTODY');
 validateNavigationDomain(await import(pathToFileURL(navigationFile).href));
 return {navigationSha256:expected.navigationSha256,posesChecked:CAPTURE_STEPS.length};
}
export async function captureScene({dir,out,head,label,expected}){
 fs.mkdirSync(out,{recursive:true});
 const receipt={lockGeneration:ADMISSION.lockGeneration,admissionRun:ADMISSION.workflowRun,target:TARGET,sourceEdge:{kind:'FULL_MATERIAL_INLAND',bounds:[-213,-759,-165,-711],centerProfileX:-189},schema:'H_EARTH_MATERIAL_MARGIN_SCENE_v1',profile:PROFILE,operationId:OPERATION,result:'INCOMPLETE',sceneHead:head,label,poses:POSES,viewport:VIEWPORT,frameCap:3,runBudget:1,automaticRetry:false,exactScreenshotMatchProven:false,rootCauseProven:false,productMutation:false,comparisonCandidate:label==='candidate',rendererResponseTransformed:false,physicalVegetationPreserved:true,actualVegetationPixelVisibilityAsserted:false,physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,views:[],errors:[]};
 const persist=()=>fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 let server,browser;persist();
 try{
  assertCheckout(dir,head);
  const renderer=fs.readFileSync(path.join(dir,RENDERER),'utf8'),routeSource=fs.readFileSync(path.join(dir,ROUTE),'utf8');
  if(sha(renderer)!==expected.rendererSha256||sha(routeSource)!==expected.routeSha256)throw Error('SURVEY_PRODUCT_CUSTODY');
  const auditRoute=instrumentRoute(routeSource);receipt.sourceSha256={renderer:sha(renderer),route:sha(routeSource)};receipt.routeObservationSha256=sha(auditRoute);persist();
  const base='http://127.0.0.1:18767';server=spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',dir],{stdio:'ignore'});const serverErrors=[];server.on('error',e=>serverErrors.push(e.message));
  let listening=false;for(let i=0;i<50;i++){try{if((await fetch(base+ROOT)).ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SURVEY_SERVER:'+serverErrors.join(';'));
  const {chromium}=await import('playwright');browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:VIEWPORT,deviceScaleFactor:1}),page=await context.newPage();page.setDefaultTimeout(30000);
  await page.addInitScript({content:'globalThis.__groundComparisonState='+comparisonState.toString()+';globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.normalizeVegetationIdentity='+normalizeVegetationIdentity.toString()+';globalThis.__footprintVegetationReadiness='+footprintVegetationReadiness.toString()+';globalThis.assetReadiness=__groundAssetReadiness;globalThis.footprintVegetationReadiness=__footprintVegetationReadiness;globalThis.__surveyReadiness='+surveyReadiness.toString()+';'});
  const responses=[],pending=[];receipt.productResponses=responses;persist();
  page.on('pageerror',e=>receipt.errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')receipt.errors.push('CONSOLE:'+m.text());});page.on('requestfailed',r=>receipt.errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
  page.on('response',r=>{if(r.status()>=400)receipt.errors.push('HTTP:'+r.status()+':'+r.url());const pathname=new URL(r.url()).pathname;if(Object.hasOwn(PRODUCTION_ATLASES,pathname)||pathname===RENDERER||pathname===PRESENTATION||pathname===MARGIN)pending.push((async()=>{try{const b=await r.body();responses.push({path:pathname,status:r.status(),sha256:sha(b),bytes:b.length});persist();}catch(e){receipt.errors.push('RESPONSE:'+String(e));persist();}})());});
  // Only expose the already-existing presentation and packet functions. No renderer interception.
  await page.route(url=>url.pathname===ROUTE,r=>r.fulfill({status:200,contentType:'text/javascript',body:auditRoute}));
  await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
  if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('SURVEY_STARTUP_FAILED');
  await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
  await page.mouse.move(170,350);await page.mouse.down();await page.mouse.move(220,350,{steps:8});await page.mouse.up();await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled);await page.click('[data-enter]');
  await page.evaluate(async()=>{const urls=[...new Set(performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x)))];if(urls.length!==1)throw Error('SURVEY_NAV_IDENTITY');const url=urls[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
  let previousFrame=0;
  for(const step of CAPTURE_STEPS){
   const {pose,sequence:seq}=step,deadline=Date.now()+180000;let signature=null,stable=0;receipt.attemptedPose=pose;persist();
   while(stable<2){
    const settled=await page.evaluate(async({pose,seq})=>{const state=__groundComparisonState(__groundComparisonNav,pose,seq,'OWNER_BOUNDARY_SURVEY_SETTLE');__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas'),packet=__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:seq});const a=__surveyReadiness(gpu.resources,packet.camera.position);return {...a,frame:gpu.frameRecords.at(-1),importedAssets:[gpu.resources.jacaranda,...gpu.resources.treeCollection.entries].map(e=>({id:e.focusId??e.id,state:e.state,ready:e.ready})),queue:gpu.resources.treeCollection.queue};},{pose,seq});
    receipt.lastSettle={pose,capture:step.capture,...settled};persist();stable=settled.ready&&settled.frame.navigationSequence===seq&&settled.signature===signature?stable+1:0;signature=settled.signature;if(Date.now()>deadline)throw Error((step.capture?'SURVEY':'WARMUP')+'_ASSETS_NOT_SETTLED:'+settled.importedAssets.filter(e=>e.state!=='READY'||e.ready!==true).map(e=>e.id+':'+e.state).join(','));if(stable<2)await new Promise(r=>setTimeout(r,250));
   }
   if(!step.capture){receipt.warmup={...receipt.lastSettle,result:'ALL_NINE_READY_NO_IMAGE_CAPTURED',navigationSequence:seq};persist();continue;}
   const v=await page.evaluate(async({pose,seq})=>{const state=__groundComparisonState(__groundComparisonNav,pose,seq,'OWNER_BOUNDARY_SURVEY_CAPTURE');__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);const canvas=document.querySelector('#h-earth-functional-landscape-canvas'),gl=canvas.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('SURVEY_CANVAS');gl.finish();const error=gl.getError();if(error!==gl.NO_ERROR)throw Error('SURVEY_GL_ERROR:'+error);const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),packet=__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:seq});const before=gpu.frameRecords.at(-1),dataUrl=canvas.toDataURL('image/png'),after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {state,worldPacket:packet,expectedCameraPosition:packet.camera.position,lastFrame:before,canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},resources:gpu.resources,capture:{before,after,dataUrl}};},{pose,seq});
   Object.assign(v,{pose,assetSignature:signature,grassHidden:false,rendererResponseTransformed:false});validateMaterial(v.resources,label,expected);validateView(v,pose,seq);if(v.lastFrame.frameSequence<=previousFrame)throw Error('SURVEY_FRAME_NOT_ADVANCED');previousFrame=v.lastFrame.frameSequence;
   const bytes=decodeCapture(v.capture,v.lastFrame);delete v.capture;const image=pose.name+'.png';fs.writeFileSync(path.join(out,image),bytes);receipt.views.push({...v,image,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
  }
  await Promise.all(pending);validateProductionAtlasResponses(responses.filter(r=>Object.hasOwn(PRODUCTION_ATLASES,r.path)));const rendererResponses=responses.filter(r=>r.path===RENDERER);if(rendererResponses.length!==1||rendererResponses[0].sha256!==expected.rendererSha256||rendererResponses[0].status!==200)throw Error('SURVEY_RENDERER_HTTP_CUSTODY');receipt.productResponses=responses;
  validateHttp(responses,label,expected);
  validateSet(receipt.views);assertCheckout(dir,head);if(receipt.errors.length)throw Error('SURVEY_BROWSER_ERRORS');receipt.result='THREE_LIT_FRAMES_CAPTURED_REQUIRES_PAIRED_REVIEW';
 }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
 finally{persist();await browser?.close();if(server&&server.exitCode===null){const exited=new Promise(resolve=>server.once('exit',resolve));server.kill();await exited;}}
 return receipt;
}
export function validatePair(before,after){
 validateSet(before.views);validateSet(after.views);
 if(before.warmup?.result!=='ALL_NINE_READY_NO_IMAGE_CAPTURED'||after.warmup?.result!=='ALL_NINE_READY_NO_IMAGE_CAPTURED')throw Error('PAIR_WARMUP');
 for(let i=0;i<POSES.length;i++){
  const a=before.views[i],b=after.views[i];
  if(JSON.stringify(a.pose)!==JSON.stringify(b.pose)||JSON.stringify(a.state)!==JSON.stringify(b.state)||JSON.stringify(a.expectedCameraPosition)!==JSON.stringify(b.expectedCameraPosition))throw Error('PAIR_CAMERA');
  if(JSON.stringify(a.worldPacket.camera)!==JSON.stringify(b.worldPacket.camera))throw Error('PAIR_WORLD_CAMERA');
  if(a.assetSignature!==b.assetSignature)throw Error('PAIR_VEGETATION');
 }
 return true;
}
export async function run(argv){
 const a=parseArgs(argv),binding=JSON.parse(fs.readFileSync(new URL('./product-binding.json',import.meta.url)));
 const candidateHead=execFileSync('git',['-C',a['--candidate-dir'],'rev-parse','HEAD'],{encoding:'utf8'}).trim();
 validateHeads(execFileSync('git',['-C',a['--baseline-dir'],'rev-parse','HEAD'],{encoding:'utf8'}).trim(),candidateHead);
 fs.mkdirSync(a['--output'],{recursive:true});
 const preflight={result:'CHECKING_BOTH_SCENES_BEFORE_BROWSER',scenes:{}};
 const savePreflight=()=>fs.writeFileSync(path.join(a['--output'],'preflight.json'),JSON.stringify(preflight,null,2)+'\n');
 savePreflight();
 try{for(const label of ['baseline','candidate']){preflight.scenes[label]=await preflightNavigation(a['--'+label+'-dir'],binding[label]);savePreflight();}preflight.result='BOTH_SCENE_POSES_PREFLIGHT_PASS';savePreflight();}
 catch(e){preflight.result='FAILED_BEFORE_BROWSER';preflight.error=e.message;savePreflight();throw e;}
 const before=await captureScene({dir:a['--baseline-dir'],out:path.join(a['--output'],'baseline'),head:BASELINE_HEAD,label:'baseline',expected:binding.baseline});
 const after=await captureScene({dir:a['--candidate-dir'],out:path.join(a['--output'],'candidate'),head:candidateHead,label:'candidate',expected:binding.candidate});
 validatePair(before,after);
 const result={schema:'H_EARTH_MATERIAL_MARGIN_COMPARISON_v1',result:'SIX_PAIRED_FRAMES_CAPTURED_REQUIRES_VISUAL_REVIEW',operationId:OPERATION,baselineHead:BASELINE_HEAD,candidateHead,frameCap:6,runBudget:1,automaticRetry:false,ownerVisualAcceptance:false,releaseAuthorized:false,images:[...before.views,...after.views].map(v=>({image:v.image,sha256:v.imageSha256}))};
 fs.writeFileSync(path.join(a['--output'],'comparison.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});
