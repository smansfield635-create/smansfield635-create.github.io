import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {transformPublishedRenderer,MODES,MODES_MINIMUM,transformPinnedGen3155InlandRenderer,GEN3155_INLAND_MODES} from './h-earth-groundcover-factor-overlay.mjs';

export const DIAGNOSTIC_MODES=Object.freeze(MODES_MINIMUM.map(i=>MODES[i]));
const MODE_ID_BY_NAME=new Map(MODES.map((name,index)=>[name,index]));
export const DIAGNOSTIC_STAGE_MEANINGS=Object.freeze(Object.fromEntries(DIAGNOSTIC_MODES.map(name=>[name,'GPU source-interception read-only factor visualization; product bytes unchanged'])));
export const SEARCH_PROVENANCE=Object.freeze({kind:'PUBLISHED_RENDERER_KNOWN_INLAND_BAND_PLUS_HEALTHY_COAST_CONTROL',exactScreenshotMatchProven:false,operationId:'H_EARTH_GROUNDCOVER_FACTOR_GPU_DIAGNOSTIC_20261026_001',priorStageAttributionRun:40411050366,expectedPublishedRendererSha256:'7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2'});
export const RENDERER_SHA256='7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2';
export const MATERIAL_BASELINE_HEAD='60b3c07f0216645119a1b92b16dac82cae739145';
const gen3155Capture=process.env.H_EARTH_COMPARISON_PROFILE==='GEN3155_INLAND_FACTOR_V1';
const candidateCapture=process.env.H_EARTH_COMPARISON_PROFILE==='MAPWIDE_CANDIDATE_V1';
const candidateHead=process.env.H_EARTH_COMPARISON_CANDIDATE_SHA||'';
if(candidateCapture&&!/^[a-f0-9]{40}$/.test(candidateHead))throw Error('CANDIDATE_EXACT_SHA_REQUIRED');
export const HEADS=Object.freeze({baseline:gen3155Capture?'bcfb0650077323851f01f51d712c7f8b8ac39220':MATERIAL_BASELINE_HEAD,candidate:gen3155Capture?'7610827598eaadf4fbb92e7ec8b9371c8cd08581':(candidateCapture?candidateHead:MATERIAL_BASELINE_HEAD)});
export const POSES=Object.freeze([{name:'river-overlook',x:18,z:-226,yaw:210,pitch:-14},{name:'bare-mountain',x:88,z:-260,yaw:95,pitch:-10},{name:'coast-oblique',x:0,z:-110,yaw:170,pitch:-8},{name:'foothill-west',x:-52,z:-208,yaw:180,pitch:-12},
{name:'inland-seam-near',x:-200,z:-728,y:18.361431,yaw:0,pitch:-14,diagnosticObserver:true},
{name:'inland-seam-mid',x:-200,z:-704,y:18.272624,yaw:0,pitch:-4,diagnosticObserver:true},
{name:'inland-seam-far',x:-200,z:-656,y:18.793665,yaw:0,pitch:-2,diagnosticObserver:true},
{name:'coastal-seam-east',x:376,z:-96,y:2.603263,yaw:90,pitch:-14,diagnosticObserver:true},
{name:'coastal-seam-west',x:-376,z:-96,y:2.518974,yaw:270,pitch:-14,diagnosticObserver:true},
{name:'patch-close-south',x:88,z:-236,yaw:180,pitch:-17.72},
{name:'patch-east',x:92,z:-232,yaw:270,pitch:-6.69},
{name:'patch-west',x:84,z:-232,yaw:90,pitch:-13.5}].map(Object.freeze));
export const DIAGNOSTIC_POSES=Object.freeze([POSES.find(p=>p.name==='inland-seam-near'),POSES.find(p=>p.name==='coast-oblique')]);
// Additive Gen2928 source-bound survey; the original Gen2925 18-frame profile remains unchanged.
export const SURVEY_POSES=Object.freeze(['inland-seam-near','inland-seam-far','coastal-seam-east','coast-oblique'].map(name=>POSES.find(p=>p.name===name)));
export const SURVEY_MODES=Object.freeze(['reference-lit','before-groundcover-unlit','after-groundcover-unlit','patch-weight-raw','groundcover-weight-raw']);
export const GEN3155_INLAND_POSES=Object.freeze(['inland-seam-near','inland-seam-far'].map(name=>POSES.find(p=>p.name===name)));
export function gen3155ModeId(mode){const id=GEN3155_INLAND_MODES.indexOf(mode);if(id<0)throw Error('GEN3155_MODE_NOT_REGISTERED:'+mode);return id;}
export function gen3155ValidateSet(views){const labels=['baseline','candidate'];const expected=labels.length*GEN3155_INLAND_POSES.length*GEN3155_INLAND_MODES.length;if(views.length!==expected)throw Error('GEN3155_CAPTURE_INCOMPLETE');for(const label of labels)for(const pose of GEN3155_INLAND_POSES){const group=views.filter(v=>v.label===label&&v.pose?.name===pose.name);if(group.length!==GEN3155_INLAND_MODES.length)throw Error('GEN3155_MODE_SET_INCOMPLETE:'+label+':'+pose.name);const first=group[0];for(const mode of GEN3155_INLAND_MODES){const found=group.filter(v=>v.mode===mode);if(found.length!==1||found[0].diagnosticApplied!==gen3155ModeId(mode))throw Error('GEN3155_MODE_NOT_APPLIED:'+label+':'+pose.name+':'+mode);const v=found[0];if(v.sourceHead!==first.sourceHead||v.rendererHash!==first.rendererHash||v.assetSignature!==first.assetSignature||JSON.stringify(v.lastFrame?.cameraPosition)!==JSON.stringify(first.lastFrame?.cameraPosition)||v.imageWidth!==529||v.imageHeight!==980)throw Error('GEN3155_SOURCE_CAMERA_ASSET_PARITY_FAILED');}}return true;}
export function comparisonState(nav,pose,sequence,action){
  if(pose.diagnosticObserver===true){
    if(!['x','y','z','yaw','pitch'].every(k=>Number.isFinite(pose[k])))throw Error('DIAGNOSTIC_POSE_INVALID');
    return {contractId:nav.H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,position:{x:pose.x,y:pose.y,z:pose.z},yawDegrees:pose.yaw,pitchDegrees:pose.pitch,verticalFovDegrees:56,sequence,action,accepted:false,terrainSupported:false,geologicalPhysicalSupport:false,diagnosticObserver:true,canonicalCameraStateAuthority:false,collisionOrPhysicsClaim:false};
  }
  const r=nav.auditResolvePosition(pose.x,pose.z,pose.yaw,'SURFACE');if(!r.eligible)throw Error('POSE_INELIGIBLE');
  return nav.auditStateFrom(r,{yaw:pose.yaw,pitch:pose.pitch,fov:56,sequence,action});
}
const ROOT='/showroom/globe/h-earth/';
const RENDERER=ROOT+'render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const ROUTE=ROOT+'vegetation-prototype/route.js';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
export function replaceExactlyOnce(source,needle,replacement){if(source.split(needle).length!==2)throw Error('INSTRUMENTATION_ANCHOR_NOT_UNIQUE:'+needle);return source.replace(needle,replacement);}
export function instrumentRoute(source){return replaceExactlyOnce(source,'const cssWidth=','globalThis.__HEarthAuditPresent=present;globalThis.__HEarthAuditPacket=createHEarthRun8ER3AFrameUniformPacket;\nconst cssWidth=');}
export function instrumentRenderer(source){return replaceExactlyOnce(source,'resources.singleOwnerVegetation?.draw(packet);','if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);');}
export const ORIGINAL_BLEND_EXPRESSION='float groundcoverWeight=0.88*groundcoverPatch*\\n        groundcoverSuitability*groundcoverProtection;'.replace('\\n','\n');
export const CANDIDATE_BLEND_EXPRESSION='float groundcoverPatchContinuity=smoothstep(0.30,0.85,groundcoverPatch);\\n      float groundcoverWeight=0.88*groundcoverPatch*\\n        (1.0-0.25*groundcoverPatchContinuity)*\\n        groundcoverSuitability*groundcoverProtection;'.replaceAll('\\n','\n');
export function verifyExactMaterialCandidate(source){
 if(source.split(CANDIDATE_BLEND_EXPRESSION).length!==2)throw Error('GEN2928_BLEND_EXPRESSION_NOT_UNIQUE');
 const reconstructed=source.replace(CANDIDATE_BLEND_EXPRESSION,ORIGINAL_BLEND_EXPRESSION);
 if(sha(reconstructed)!==RENDERER_SHA256)throw Error('GEN2928_CANDIDATE_NOT_EXACT_ONE_FORMULA_DIFF');
 return sha(source);
}
export function instrumentCandidateRenderer(source){
 verifyExactMaterialCandidate(source);
 return instrumentRenderer(transformPublishedRenderer(source,{strictHash:false}).source);
}
export function instrumentDiagnosticRenderer(source){
 if(sha(source)!==RENDERER_SHA256)throw Error('DIAGNOSTIC_SOURCE_HASH_MISMATCH');
 return instrumentRenderer(transformPublishedRenderer(source).source);
}
export function validateDiagnosticSet(views,poses=DIAGNOSTIC_POSES,modes=DIAGNOSTIC_MODES){
 if(views.length!==poses.length*modes.length)throw Error('DIAGNOSTIC_INCOMPLETE');
 for(const pose of poses){
  const group=views.filter(v=>v.pose.name===pose.name);
  if(group.length!==modes.length||new Set(group.map(v=>v.mode)).size!==modes.length||!modes.every(m=>group.some(v=>v.mode===m)))throw Error('DIAGNOSTIC_MODE_SET');
  const ref=group[0];
  for(const v of group){
   if(!v.grassHidden||v.diagnosticApplied!==MODE_ID_BY_NAME.get(v.mode)||v.assetSignature!==ref.assetSignature||JSON.stringify(v.state.position)!==JSON.stringify(ref.state.position)||JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition)||v.sourceHead!==ref.sourceHead||v.rendererHash!==ref.rendererHash)throw Error('DIAGNOSTIC_MATCH_MISMATCH');
  }
 }
 return true;
}
export function sameHeading(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(((a-b)%360+540)%360-180)<1e-8;}
export function validateFrame(value,pose,sequence){
  const {state,lastFrame,canvas,expectedCameraPosition}=value;
  if(pose.diagnosticObserver&&(state?.diagnosticObserver!==true||state.accepted!==false||state.terrainSupported!==false||state.geologicalPhysicalSupport!==false||state.position?.y!==pose.y))throw Error('DIAGNOSTIC_AUTHORITY_MISMATCH');
  if(!state||!lastFrame||state.sequence!==sequence||lastFrame.navigationSequence!==sequence)throw Error('FRAME_NAVIGATION_MISMATCH');
  if(!Number.isInteger(lastFrame.frameSequence)||lastFrame.frameSequence<1)throw Error('FRAME_SEQUENCE_INVALID');
  if(state.position.x!==pose.x||state.position.z!==pose.z||!sameHeading(state.yawDegrees,pose.yaw)||state.pitchDegrees!==pose.pitch||state.verticalFovDegrees!==56)throw Error('POSE_MISMATCH');
  if(!Number.isFinite(state.position.y)||!expectedCameraPosition||!['x','y','z'].every(k=>Number.isFinite(expectedCameraPosition[k])&&Number.isFinite(lastFrame.cameraPosition?.[k])&&Math.abs(expectedCameraPosition[k]-lastFrame.cameraPosition[k])<1e-8))throw Error('FRAME_CAMERA_MISMATCH');
  if(canvas.width!==529||canvas.height!==980||canvas.cssWidth!==540||canvas.cssHeight!==1000)throw Error('RESOLUTION_MISMATCH');
  return true;
}
export function assetReadiness(resources,camera){
  const tree=resources?.treeCollection,jac=resources?.jacaranda;
  if(!tree?.queue||!Array.isArray(tree.entries)||!jac||!Number.isFinite(camera?.x)||!Number.isFinite(camera?.z))throw Error('ASSET_RECEIPT_MISSING');
  const all=[jac,...tree.entries];
  if(all.some(x=>!['IDLE','LOADING','READY'].includes(x.state)||x.failure)||Object.keys(tree.queue.failures??{}).length)throw Error('ASSET_FAILURE');
  const near=(e,inclusive)=>{const a=inclusive?e.targetAnchor:e;if(!Number.isFinite(a.x)||!Number.isFinite(a.z))throw Error('ASSET_ANCHOR_MISSING');const d=Math.hypot(camera.x-a.x,camera.z-a.z);return inclusive?d<=180:d<180;};
  const pending=tree.queue.loading||all.some(x=>x.state==='LOADING')||(jac.state==='IDLE'&&near(jac,true))||tree.entries.some(e=>e.state==='IDLE'&&near(e,false));
  return {ready:!pending,signature:JSON.stringify(all.map(e=>({id:e.focusId??e.id,state:e.state,ready:e.ready}))),queue:tree.queue};
}
export function decodeCanvasCapture(capture,expectedFrame){
  for(const frame of [capture.before,capture.after])if(!frame||frame.navigationSequence!==expectedFrame.navigationSequence||frame.frameSequence!==expectedFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
  if(!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(capture.dataUrl??''))throw Error('CAPTURE_PNG_INVALID');
  const bytes=Buffer.from(capture.dataUrl.split(',')[1],'base64');
  if(bytes.length<1024)throw Error('EMPTY_CAPTURE');
  if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)!==529||bytes.readUInt32BE(20)!==980)throw Error('CAPTURE_PNG_DIMENSIONS_INVALID');
  return bytes;
}
export function assertCheckout(dir,expected){const head=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==expected)throw Error('CHECKOUT_HEAD_MISMATCH');if(execFileSync('git',['-C',dir,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim())throw Error('CHECKOUT_TRACKED_BYTES_CHANGED');}
export function parseArgs(argv){const a={};for(let i=0;i<argv.length;i+=2){if(!['--baseline-dir','--candidate-dir','--output'].includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('CLI_NOT_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}if(Object.keys(a).length!==3)throw Error('CLI_INCOMPLETE');if(new Set(Object.values(a)).size!==3)throw Error('DIRECTORIES_NOT_DISTINCT');return a;}

// Gen3147: additive owner-frame matched GPU profile. Historical A03 factor
// comparison, its source formula guard and fixed viewport remain unchanged.
export const GEN3142_MATCHED=Object.freeze({
  profile:'GEN3142_OWNER_FRAME_V1',
  baseline:'bcfb0650077323851f01f51d712c7f8b8ac39220',
  candidate:'7610827598eaadf4fbb92e7ec8b9371c8cd08581',
  rendererBlobs:Object.freeze({
    baseline:'85ee835060d5106a670077a5f4352b7ad202b49b',
    candidate:'9fe90b5c0e58fb3a121c910cb0110a0846bf07bc'
  }),
  viewport:Object.freeze({width:384,height:688}),
  pixel:Object.freeze({x:201,y:337}),
  camera:Object.freeze({x:124.41538691662353,y:8.878180721309036,z:-394.78748830810326}),
  navigationPosition:Object.freeze({x:124.4127167356344,y:9.082148204768242,z:-394.77901544898066}),
  matrix:Object.freeze([1.7771363583600006,-0.11927131267090438,-0.8472698375627118,-0.8472486560815412,-0.003217411805814398,1.8753955197000167,-0.07523539731990678,-0.07523351645848454,-2.8629033316640613,-0.07614483644326633,-0.5258549786743445,-0.5258418324642052,-1351.3129584420474,-31.87194256089432,-102.01961437803863,-101.51707016948177]),
  ownerFrame:'cpu-submit:2583:nav:5085'
});
export const GEN3142_MATCHED_POSES=Object.freeze([
  {name:'owner-frame2583',x:GEN3142_MATCHED.navigationPosition.x,z:GEN3142_MATCHED.navigationPosition.z,yaw:-58.17022448618572,pitch:-4.2995192852338775,owner:true},
  {name:'meadow-control',x:18,z:-226,yaw:210,pitch:-14},
  {name:'grove-control',x:-139.40267987050615,z:-194.5,yaw:0,pitch:16},
  {name:'slope-control',x:88,z:-260,yaw:95,pitch:-10},
  {name:'coast-control',x:0,z:-110,yaw:170,pitch:-8}
].map(p=>Object.freeze(p)));
const GEN3142_PATCH_RADIUS=12;
const sameFinite=(a,b,tolerance=1e-6)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tolerance;
function gen3142Parity(a,b,name,tol=1e-6){
  if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length||a.some((x,i)=>!sameFinite(x,b[i],tol)))throw Error('GEN3142_'+name+'_MISMATCH');
}
export function gen3142VerifyRenderer(dir,label){
  if(!['baseline','candidate'].includes(label))throw Error('GEN3142_LABEL_INVALID');
  assertCheckout(dir,GEN3142_MATCHED[label]);
  const rel=RENDERER.slice(1),bytes=fs.readFileSync(path.join(dir,rel));
  const blob=execFileSync('git',['-C',dir,'hash-object',rel],{encoding:'utf8'}).trim();
  if(blob!==GEN3142_MATCHED.rendererBlobs[label])throw Error('GEN3142_RENDERER_BLOB_MISMATCH:'+label);
  return {blob,sha256:sha(bytes),bytes:bytes.length};
}
export function gen3142ValidateView(view,pose){
  if(view?.worldEntered!==true||view.loaderMode!=='entered'||view.loaderHidden!==true||view.loaderDomMode!=='ready'||view.routeReady!==true)throw Error('GEN3142_WORLD_NOT_ENTERED');
  if(!view.glVersion?.includes('WebGL 2.0')||!view.glslVersion?.includes('WebGL GLSL ES 3.00')||view.glError!==0||view.contextLost!==false)throw Error('GEN3142_WEBGL2_NOT_HEALTHY');
  const c=view.canvas;
  if(c?.width!==384||c.height!==688||c.cssWidth!==384||c.cssHeight!==688)throw Error('GEN3142_CANVAS_DIMENSION_MISMATCH');
  const state=view.state,f=view.lastFrame,cam=view.packetCamera;
  if(!state||!f||!cam||f.navigationSequence!==state.sequence||!Number.isInteger(f.frameSequence)||f.frameSequence<1)throw Error('GEN3142_FRAME_IDENTITY_MISMATCH');
  if(!sameFinite(state.position?.x,pose.x,1e-7)||!sameFinite(state.position?.z,pose.z,1e-7)||!sameHeading(state.yawDegrees,pose.yaw)||!sameFinite(state.pitchDegrees,pose.pitch,1e-8)||state.verticalFovDegrees!==56)throw Error('GEN3142_POSE_MISMATCH');
  for(const k of ['x','y','z'])if(!sameFinite(f.cameraPosition?.[k],cam.position?.[k],1e-7))throw Error('GEN3142_SUBMITTED_CAMERA_MISMATCH');
  if(!Array.isArray(cam.viewProjectionMatrix)||cam.viewProjectionMatrix.length!==16||cam.viewProjectionMatrix.some(x=>!Number.isFinite(x)))throw Error('GEN3142_PROJECTION_INVALID');
  if(pose.owner){
    for(const k of ['x','y','z']){
      if(!sameFinite(cam.position[k],GEN3142_MATCHED.camera[k],1e-5)||!sameFinite(state.position[k],GEN3142_MATCHED.navigationPosition[k],1e-5))throw Error('GEN3142_OWNER_CAMERA_MISMATCH:'+k);
    }
    gen3142Parity(cam.viewProjectionMatrix,GEN3142_MATCHED.matrix,'OWNER_PROJECTION',1e-4);
  }
  if(!view.pixelPatch||view.pixelPatch.radius!==GEN3142_PATCH_RADIUS||view.pixelPatch.rgba?.length!==(2*GEN3142_PATCH_RADIUS+1)**2*4)throw Error('GEN3142_GPU_PATCH_INCOMPLETE');
  if(!view.framebufferPresentations||view.framebufferPresentations<1)throw Error('GEN3142_NO_PRESENTATION');
  return true;
}
function gen3142PatchMetrics(p){
  const d=p.rgba,w=2*GEN3142_PATCH_RADIUS+1;let horizontal=0,vertical=0,edges=0;
  for(let y=0;y<w;y++)for(let x=0;x<w;x++){
    const i=4*(y*w+x);
    if(x+1<w){for(let c=0;c<3;c++)horizontal+=Math.abs(d[i+c]-d[i+4+c]);edges++;}
    if(y+1<w){for(let c=0;c<3;c++)vertical+=Math.abs(d[i+c]-d[i+w*4+c]);}
  }
  return {horizontalGradientMean:horizontal/(edges*3),verticalGradientMean:vertical/(edges*3)};
}
export function gen3142CompareViews(views){
  if(!Array.isArray(views)||views.length!==GEN3142_MATCHED_POSES.length*2)throw Error('GEN3142_PAIR_SET_INCOMPLETE');
  const comparisons=[];
  for(const pose of GEN3142_MATCHED_POSES){
    const pair=views.filter(v=>v.pose?.name===pose.name);
    if(pair.length!==2||!pair.some(v=>v.label==='baseline')||!pair.some(v=>v.label==='candidate'))throw Error('GEN3142_PAIR_IDENTITY_MISMATCH:'+pose.name);
    const base=pair.find(v=>v.label==='baseline'),cand=pair.find(v=>v.label==='candidate');
    for(const v of pair)gen3142ValidateView(v,pose);
    for(const k of ['x','y','z'])if(!sameFinite(base.packetCamera.position[k],cand.packetCamera.position[k],1e-6))throw Error('GEN3142_AB_CAMERA_MISMATCH');
    gen3142Parity(base.packetCamera.viewProjectionMatrix,cand.packetCamera.viewProjectionMatrix,'AB_PROJECTION',1e-6);
    if(base.assetSignature!==cand.assetSignature)throw Error('GEN3142_AB_ASSET_STATE_MISMATCH');
    const a=base.pixelPatch.rgba,b=cand.pixelPatch.rgba;
    if(a.length!==b.length)throw Error('GEN3142_AB_PIXEL_PATCH_MISMATCH');
    const diff=a.reduce((acc,x,i)=>acc+Math.abs(x-b[i]),0)/a.length;
    comparisons.push({pose:pose.name,ownerMarkedPixel:pose.owner===true,
      meanAbsoluteRGBA8PatchDifference:diff,
      baselineGradient:gen3142PatchMetrics(base.pixelPatch),
      candidateGradient:gen3142PatchMetrics(cand.pixelPatch),
      baselineImage:base.image,baselineImageSha256:base.imageSha256,
      candidateImage:cand.image,candidateImageSha256:cand.imageSha256});
  }
  return comparisons;
}
function gen3142Decode(capture,frame){
  for(const f of [capture.before,capture.after])if(f?.frameSequence!==frame.frameSequence||f.navigationSequence!==frame.navigationSequence)throw Error('GEN3142_CAPTURE_FRAME_CHANGED');
  if(!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(capture.dataUrl??''))throw Error('GEN3142_CAPTURE_PNG_INVALID');
  const b=Buffer.from(capture.dataUrl.split(',')[1],'base64');
  if(b.length<1024||!b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||b.toString('ascii',12,16)!=='IHDR'||b.readUInt32BE(16)!==384||b.readUInt32BE(20)!==688)throw Error('GEN3142_PNG_DIMENSIONS_INVALID');
  return b;
}
export async function runGen3142(argv){
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const receipt={schema:'H_EARTH_GEN3142_MATCHED_OWNER_FRAME_GPU_v1',result:'INCOMPLETE',profile:GEN3142_MATCHED.profile,originalOwnerFrame:GEN3142_MATCHED.ownerFrame,
    heads:{baseline:GEN3142_MATCHED.baseline,candidate:GEN3142_MATCHED.candidate},viewport:GEN3142_MATCHED.viewport,markedPixel:GEN3142_MATCHED.pixel,
    physicalAndroidEquivalenceProven:false,pixelFirstHitMaterialAttributed:false,ownerVisualAcceptance:false,shaderChanged:false,
    productDiskMutation:false,mergeAuthorized:false,pagesReleaseAuthorized:false,runs:[],views:[],comparisons:[],errors:[]};
  const persist=()=>fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  let browser=null,server=null;persist();
  try{
    const identities={};
    for(const label of ['baseline','candidate'])identities[label]=gen3142VerifyRenderer(a['--'+label+'-dir'],label);
    receipt.rendererSources=identities;persist();
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of ['baseline','candidate'].entries()){
      const dir=a['--'+label+'-dir'],port=18867+index,base='http://127.0.0.1:'+port;
      const rr={label,head:GEN3142_MATCHED[label],renderer:identities[label],errors:[],startedAt:new Date().toISOString()};
      receipt.runs.push(rr);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      let listening=false;
      for(let i=0;i<50;i++){try{if((await fetch(base+ROOT)).ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
      if(!listening)throw Error('GEN3142_SERVER_UNAVAILABLE:'+label);
      const context=await browser.newContext({viewport:{width:384,height:688},deviceScaleFactor:1});
      const page=await context.newPage();page.setDefaultTimeout(30000);
      await page.addInitScript({content:'globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';'});
      page.on('pageerror',e=>rr.errors.push('PAGE:'+e.message));
      page.on('console',m=>{if(m.type()==='error')rr.errors.push('CONSOLE:'+m.text());});
      page.on('requestfailed',req=>rr.errors.push('REQUEST:'+req.url()+':'+req.failure()?.errorText));
      page.on('response',resp=>{if(resp.status()>=400)rr.errors.push('HTTP:'+resp.status()+':'+resp.url());});
      const originalRoute=fs.readFileSync(path.join(dir,ROUTE.slice(1)),'utf8');
      await page.route(url=>url.pathname===ROUTE,route=>route.fulfill({status:200,contentType:'text/javascript',body:instrumentRoute(originalRoute)}));
      rr.routeSourceSha256=sha(originalRoute);
      await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
      if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('GEN3142_STARTUP_FAILED');
      await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
      await page.mouse.move(160,240);await page.mouse.down();await page.mouse.move(220,240,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled,null,{timeout:180000});
      await page.click('[data-enter]');
      await page.waitForFunction(()=>{const root=document.querySelector('#h-earth-functional-landscape-route'),shell=document.querySelector('#h-earth-loading-screen');return root?.dataset.run8eReady==='true'&&shell?.hidden===true&&shell?.dataset.mode==='ready'&&globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.().mode==='entered';},null,{timeout:120000});
      rr.entryVerified=true;persist();
      await page.evaluate(async()=>{
        const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));
        const unique=[...new Set(urls)];if(unique.length!==1)throw Error('GEN3142_NAV_MODULE_AMBIGUOUS:'+JSON.stringify(unique));
        const url=unique[0];let src=await(await fetch(url)).text();
        src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));
        src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';
        globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
      });
      let sequence=20000,lastFrameSequence=0;
      for(const pose of GEN3142_MATCHED_POSES){
        let stable=0,lastSig=null;const deadline=Date.now()+180000;
        while(stable<2){
          const x=await page.evaluate(async({pose,sequence})=>{
            const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'GEN3142_SETTLE_ONLY');
            globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
            const g=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),cv=document.querySelector('#h-earth-functional-landscape-canvas');
            const pkt=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:sequence});
            return {asset:globalThis.__groundAssetReadiness(g.resources,pkt.camera.position),frame:g.frameRecords.at(-1)};
          },{pose,sequence:sequence+1});
          stable=x.frame?.navigationSequence===sequence+1&&x.asset.ready&&x.asset.signature===lastSig?stable+1:0;
          lastSig=x.asset.signature;
          if(Date.now()>deadline)throw Error('GEN3142_ASSETS_NOT_SETTLED:'+label+':'+pose.name);
          if(stable<2)await new Promise(r=>setTimeout(r,250));
        }
        const view=await page.evaluate(async({pose,sequence,pixel,radius})=>{
          const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'GEN3142_MATCHED_GPU');
          for(let i=0;i<10;i++){globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);}
          const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),cv=document.querySelector('#h-earth-functional-landscape-canvas');
          const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:cv.width,height:cv.height,pixelRatio:1},frameSequence:sequence});
          const gl=cv.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('GEN3142_CONTEXT_NOT_PRESERVED');
          const x=pixel.x,y=cv.height-1-pixel.y,w=2*radius+1;
          if(x<radius||y<radius||x+radius>=cv.width||y+radius>=cv.height)throw Error('GEN3142_SAMPLE_OUT_OF_RANGE');
          const pixels=new Uint8Array(w*w*4);gl.readPixels(x-radius,y-radius,w,w,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
          const glError=gl.getError();
          const asset=globalThis.__groundAssetReadiness(gpu.resources,packet.camera.position);
          const loading=document.querySelector('#h-earth-loading-screen'),root=document.querySelector('#h-earth-functional-landscape-route');
          return {state,lastFrame:gpu.frameRecords.at(-1),
            packetCamera:{position:packet.camera.position,viewProjectionMatrix:Array.from(packet.camera.viewProjectionMatrix)},
            canvas:{width:cv.width,height:cv.height,cssWidth:cv.clientWidth,cssHeight:cv.clientHeight},
            assetSignature:asset.signature,assetsReady:asset.ready,worldEntered:root?.dataset.run8eReady==='true',
            loaderMode:globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.().mode,loaderDomMode:loading?.dataset.mode,loaderHidden:loading?.hidden===true,routeReady:root?.dataset.run8eReady==='true',
            glVersion:String(gl.getParameter(gl.VERSION)),glslVersion:String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION)),
            contextLost:gl.isContextLost(),glError,framebufferPresentations:gpu.counters?.gpuFramebufferPresentationCount,
            pixelPatch:{radius,center:pixel,rgba:Array.from(pixels)}};
        },{pose,sequence:++sequence,pixel:pose.owner?GEN3142_MATCHED.pixel:{x:192,y:344},radius:GEN3142_PATCH_RADIUS});
        if(!view.assetsReady||view.assetSignature!==lastSig)throw Error('GEN3142_ASSETS_CHANGED_DURING_CAPTURE');
        if(view.lastFrame?.frameSequence<=lastFrameSequence)throw Error('GEN3142_FRAME_DID_NOT_ADVANCE');
        gen3142ValidateView(view,pose);lastFrameSequence=view.lastFrame.frameSequence;
        const capture=await page.evaluate(()=>{
          const cv=document.querySelector('#h-earth-functional-landscape-canvas');
          const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);
          const dataUrl=cv.toDataURL('image/png');
          const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);
          return {before,after,dataUrl};
        });
        const png=gen3142Decode(capture,view.lastFrame);
        const image=label+'-'+pose.name+'.png';fs.writeFileSync(path.join(out,image),png);
        const final=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));
        if(final.navigationSequence!==view.lastFrame.navigationSequence||final.frameSequence!==view.lastFrame.frameSequence)throw Error('GEN3142_CAPTURE_FRAME_CHANGED_AFTER_READ');
        receipt.views.push({...view,label,pose,image,imageSha256:sha(png),imageBytes:png.length,sourceHead:GEN3142_MATCHED[label],rendererBlob:identities[label].blob});persist();
      }
      if(rr.errors.length)throw Error('GEN3142_BROWSER_ERRORS:'+label+':'+rr.errors.join('|'));
      rr.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;gen3142VerifyRenderer(dir,label);
    }
    receipt.comparisons=gen3142CompareViews(receipt.views);
    receipt.result='MATCHED_OWNER_FRAME_CAPTURED_VISUAL_DISPOSITION_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();if(server)server.kill();if(browser)await browser.close();}
  return receipt;
}

export async function run(argv){
  if(process.env.H_EARTH_COMPARISON_PROFILE==='GEN3142_OWNER_FRAME_V1')return runGen3142(argv);
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const profile=process.env.H_EARTH_COMPARISON_PROFILE||'FACTOR_18_V1';
  if(!['FACTOR_18_V1','MAPWIDE_SCOUT_V1','MAPWIDE_CANDIDATE_V1','GEN3155_INLAND_FACTOR_V1'].includes(profile))throw Error('COMPARISON_PROFILE_NOT_REGISTERED');
  const poses=gen3155Capture?GEN3155_INLAND_POSES:(profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_POSES:DIAGNOSTIC_POSES);
  const modes=gen3155Capture?GEN3155_INLAND_MODES:(profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_MODES:DIAGNOSTIC_MODES);
  if(poses.length*modes.length>20)throw Error('DIAGNOSTIC_FRAME_CAP_EXCEEDED');
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,profile,poses,modes,repairOperationId:gen3155Capture?'H_EARTH_GEN3142_INLAND_FACTOR_COMPATIBILITY_ADAPTER_20261107_001':'H_EARTH_GROUNDCOVER_BAND_CONTINUITY_REPAIR_20261026_001',baselineProductSha256:gen3155Capture?null:RENDERER_SHA256,diagnosticOnly:true,searchProvenance:gen3155Capture?{kind:'IMMUTABLE_GEN3142_INLAND_CURVED_BOUNDARY_REPRODUCTION_ONLY',exactAndroidPixelMatchProven:false}:SEARCH_PROVENANCE,stageMeanings:DIAGNOSTIC_STAGE_MEANINGS,sourceProductSha256:RENDERER_SHA256,colorTransform:'ORIGINAL_EXPOSURE_1.12_AND_GAMMA_1_OVER_2.2_EXCEPT_RAW_COVERAGE_MODE',viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,views:[],runs:[],errors:[]};
  const persist=()=>{fs.writeFileSync(out+'/receipt.tmp',JSON.stringify(receipt,null,2)+'\n');fs.renameSync(out+'/receipt.tmp',out+'/receipt.json');};
  let browser=null,server=null;
  const interrupt=signal=>{receipt.result='INTERRUPTED';receipt.errors.push(signal);persist();server?.kill();process.exit(signal==='SIGTERM'?143:130);};
  const onTerm=()=>interrupt('SIGTERM'),onInt=()=>interrupt('SIGINT');
  process.once('SIGTERM',onTerm);process.once('SIGINT',onInt);persist();
  try{
    for(const label of Object.keys(HEADS))assertCheckout(a['--'+label+'-dir'],HEADS[label]);
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of (gen3155Capture?['baseline','candidate']:['candidate']).entries()){
      const dir=a['--'+label+'-dir'],port=18767+index,base='http://127.0.0.1:'+port;
      const runRecord={label,head:HEADS[label],errors:[],instrumentation:[],startedAt:new Date().toISOString()};receipt.runs.push(runRecord);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      const serverError=[];server.on('error',e=>serverError.push(e.message));
      let listening=false;for(let n=0;n<50;n++){try{const r=await fetch(base+ROOT);if(r.ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SERVER_UNAVAILABLE:'+serverError.join(';'));
      const context=await browser.newContext({viewport:{width:540,height:1000},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(30000);
      await page.addInitScript({content:'globalThis.__groundcoverFactorMode=0;globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';'});
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      const exactInlandRenderer=gen3155Capture?gen3142VerifyRenderer(dir,label):null;
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,gen3155Capture?(source=>instrumentRenderer(transformPinnedGen3155InlandRenderer(source,{variant:label,verifiedBlob:exactInlandRenderer.blob,expectedSha256:exactInlandRenderer.sha256}).source)):(profile==='MAPWIDE_CANDIDATE_V1'?instrumentCandidateRenderer:instrumentDiagnosticRenderer)]]){
        const original=fs.readFileSync(path.join(dir,pathname),'utf8'),transformed=transform(original);runRecord.instrumentation.push({path:pathname,sourceSha256:sha(original),observedSha256:sha(transformed)});
        await page.route(url=>url.pathname===pathname,route=>route.fulfill({status:200,contentType:'text/javascript',body:transformed}));
      }
      receipt.sourceProductSha256=gen3155Capture?null:runRecord.instrumentation.find(x=>x.path===RENDERER)?.sourceSha256;
      persist();
      await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
      if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('RENDERER_STARTUP_FAILED');
      await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
      await page.mouse.move(270,350);await page.mouse.down();await page.mouse.move(320,350,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled);await page.click('[data-enter]');
      if(gen3155Capture)await page.waitForFunction(()=>{const root=document.querySelector('#h-earth-functional-landscape-route'),loader=document.querySelector('#h-earth-loading-screen');return root?.dataset.run8eReady==='true'&&loader?.hidden===true&&globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.().mode==='entered';},null,{timeout:120000});
      await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
      let sequence=10000,previousFrame=0;
      for(const pose of poses)for(const mode of modes){
        const modeId=gen3155Capture?gen3155ModeId(mode):MODE_ID_BY_NAME.get(mode);
        const hidden=true;await page.evaluate(value=>{globalThis.__groundcoverFactorMode=value;},modeId);
        const settleDeadline=Date.now()+180000;let stable=0,signature=null;
        while(stable<2){
          const settled=await page.evaluate(async({pose,hidden,sequence})=>{
            globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON_SETTLE');
            globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
            const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');const expected=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});return {asset:globalThis.__groundAssetReadiness(gpu.resources,expected.camera.position),frame:gpu.frameRecords.at(-1)};
          },{pose,hidden,sequence:sequence+1});
          receipt.lastSettle={label,pose,...settled};persist();
          stable=settled.frame.navigationSequence===sequence+1&&settled.asset.ready&&settled.asset.signature===signature?stable+1:0;signature=settled.asset.signature;
          if(Date.now()>settleDeadline)throw Error('ASSETS_NOT_SETTLED');
          if(stable<2)await new Promise(r=>setTimeout(r,250));
        }

        const view=await page.evaluate(async({pose,hidden,sequence})=>{
          globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON');
          globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
          const costs=[];for(let i=0;i<12;i++){const t=performance.now();globalThis.__HEarthAuditPresent(state);costs.push(performance.now()-t);await new Promise(requestAnimationFrame);}
          const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');
          const expectedPacket=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});
          return {state,expectedCameraPosition:expectedPacket.camera.position,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,resources:gpu.resources,grassHidden:hidden,diagnosticApplied:globalThis.__groundcoverFactorModeApplied};
        },{pose,hidden,sequence:++sequence});
        receipt.lastAttempt={label,pose,mode,...view};persist();
        if(view.diagnosticApplied!==modeId)throw Error('DIAGNOSTIC_MODE_NOT_APPLIED');
        const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);if(!assets.ready||assets.signature!==signature)throw Error('ASSETS_CHANGED_DURING_CAPTURE');view.assetSignature=assets.signature;
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+mode+'.png';const capture=await page.evaluate(()=>{const canvas=document.querySelector('#h-earth-functional-landscape-canvas');const gl=canvas?.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('CAPTURE_CONTEXT_NOT_PRESERVED');const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);const dataUrl=canvas.toDataURL('image/png');const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {dataUrl,before,after};});const bytes=decodeCanvasCapture(capture,view.lastFrame);fs.writeFileSync(path.join(out,name),bytes);
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        receipt.views.push({label,pose,mode,instrumentation:runRecord.instrumentation,...view,modeId,sourceHead:HEADS[label],rendererHash:receipt.sourceProductSha256,captureMethod:'PRESERVED_WEBGL_CANVAS_PNG',imageWidth:529,imageHeight:980,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(gen3155Capture)gen3142VerifyRenderer(dir,label);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    if(gen3155Capture)gen3155ValidateSet(receipt.views);else validateDiagnosticSet(receipt.views,poses,modes);
    receipt.result='DIAGNOSTIC_CAPTURE_COMPLETE_FACTOR_REVIEW_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',onTerm);process.removeListener('SIGINT',onInt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});

