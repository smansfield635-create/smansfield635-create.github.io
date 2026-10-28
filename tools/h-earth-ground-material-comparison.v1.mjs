import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {transformPublishedRenderer,MODES,MODES_MINIMUM} from './h-earth-groundcover-factor-overlay.mjs';

export const DIAGNOSTIC_MODES=Object.freeze(MODES_MINIMUM.map(i=>MODES[i]));
const MODE_ID_BY_NAME=new Map(MODES.map((name,index)=>[name,index]));
export const DIAGNOSTIC_STAGE_MEANINGS=Object.freeze(Object.fromEntries(DIAGNOSTIC_MODES.map(name=>[name,'GPU source-interception read-only factor visualization; product bytes unchanged'])));
export const SEARCH_PROVENANCE=Object.freeze({kind:'PUBLISHED_RENDERER_KNOWN_INLAND_BAND_PLUS_HEALTHY_COAST_CONTROL',exactScreenshotMatchProven:false,operationId:'H_EARTH_GROUNDCOVER_FACTOR_GPU_DIAGNOSTIC_20261026_001',priorStageAttributionRun:40411050366,expectedPublishedRendererSha256:'7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2'});
export const RENDERER_SHA256='7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2';
export const MATERIAL_BASELINE_HEAD='60b3c07f0216645119a1b92b16dac82cae739145';
const footprintCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GROUNDCOVER_FOOTPRINT_V1';
export const FOOTPRINT_BASELINE_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';
export const FOOTPRINT_BASELINE_SHA256='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
const candidateCapture=footprintCapture||process.env.H_EARTH_COMPARISON_PROFILE==='MAPWIDE_CANDIDATE_V1';
const candidateHead=process.env.H_EARTH_COMPARISON_CANDIDATE_SHA||'';
if(candidateCapture&&!/^[a-f0-9]{40}$/.test(candidateHead))throw Error('CANDIDATE_EXACT_SHA_REQUIRED');
export const HEADS=Object.freeze({baseline:footprintCapture?FOOTPRINT_BASELINE_HEAD:MATERIAL_BASELINE_HEAD,candidate:candidateCapture?candidateHead:MATERIAL_BASELINE_HEAD});
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
export const FOOTPRINT_POSES=Object.freeze([POSES.find(p=>p.name==='inland-seam-near'),POSES.find(p=>p.name==='inland-seam-far'),Object.freeze({name:'protected-meadow',x:-52,z:-208,yaw:136,pitch:-15}),Object.freeze({name:'protected-coast',x:0,z:-110,yaw:170,pitch:-8})]);
export const FOOTPRINT_MODES=Object.freeze(['reference-lit','after-groundcover-unlit','footprint-activation-raw']);
MODE_ID_BY_NAME.set('footprint-activation-raw',4);
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
export function reconstructFootprintBaseline(source){
 let baseline=source;
 for(const kind of ['HELPER','DERIVATIVES','BLEND']){
   const pattern=new RegExp('^[ \t]*// H_EARTH_GROUNDCOVER_FOOTPRINT_'+kind+'_BEGIN\\n[\\s\\S]*?^[ \t]*// H_EARTH_GROUNDCOVER_FOOTPRINT_'+kind+'_END\\n','gm');
   if([...baseline.matchAll(pattern)].length!==1)throw Error('FOOTPRINT_BLOCK_NOT_UNIQUE:'+kind);
   baseline=baseline.replace(pattern,'');
 }
 if(sha(baseline)!==FOOTPRINT_BASELINE_SHA256)throw Error('FOOTPRINT_BASELINE_RECONSTRUCTION_MISMATCH');
 return baseline;
}
export function instrumentFootprintRenderer(source,{baseline=false}={}){
 if(baseline){if(sha(source)!==FOOTPRINT_BASELINE_SHA256)throw Error('FOOTPRINT_BASELINE_HASH_MISMATCH');}
 else reconstructFootprintBaseline(source);
 let transformed=transformPublishedRenderer(source,{strictHash:false}).source;
 // Mode 4 is raw footprint activation in this profile only; other historical modes are unchanged.
 if(baseline){
   const at=transformed.indexOf('const FS = '),end=transformed.indexOf('// Ordered screen-door coverage',at);
   const fragment=replaceExactlyOnce(transformed.slice(at,end),'void main(){','void main(){\n  vec2 footprintProbeDx=dFdx(vWorldPosition.xz),footprintProbeDy=dFdy(vWorldPosition.xz);');
   transformed=transformed.slice(0,at)+fragment+transformed.slice(end);
   transformed=replaceExactlyOnce(transformed,'probeGCOrganic=groundcoverOrganic;', 'probeGCOrganic=smoothstep(0.25,0.75,max(length(footprintProbeDx*0.082),length(footprintProbeDy*0.082)));');
 }else transformed=replaceExactlyOnce(transformed,'probeGCOrganic=groundcoverOrganic;', 'probeGCOrganic=groundcoverFilterActivation;');
 return instrumentRenderer(transformed);
}
export function validateFootprintSet(views,expectedCandidateHead=HEADS.candidate){
 if(!/^[a-f0-9]{40}$/.test(expectedCandidateHead))throw Error('FOOTPRINT_CANDIDATE_IDENTITY_INVALID');
 const candidateHashes=new Set(views.filter(v=>v.label==='candidate').map(v=>v.rendererHash));
 if(candidateHashes.size!==1||![...candidateHashes].every(h=>/^[a-f0-9]{64}$/.test(h)&&h!==FOOTPRINT_BASELINE_SHA256))throw Error('FOOTPRINT_CANDIDATE_HASH_INVALID');
 if(views.length!==2*FOOTPRINT_POSES.length*FOOTPRINT_MODES.length)throw Error('FOOTPRINT_INCOMPLETE');
 for(const pose of FOOTPRINT_POSES)for(const mode of FOOTPRINT_MODES){
   const pair=views.filter(v=>v.pose.name===pose.name&&v.mode===mode);
   if(pair.length!==2||!['baseline','candidate'].every(label=>pair.filter(v=>v.label===label).length===1))throw Error('FOOTPRINT_PAIR_MISSING');
   for(const v of pair){if(v.sourceHead!==(v.label==='baseline'?FOOTPRINT_BASELINE_HEAD:expectedCandidateHead)||v.modeId!==MODE_ID_BY_NAME.get(mode)||v.diagnosticApplied!==v.modeId||v.grassHidden!==(mode!=='reference-lit')||(v.label==='baseline'&&v.rendererHash!==FOOTPRINT_BASELINE_SHA256))throw Error('FOOTPRINT_SOURCE_OR_MODE_MISMATCH');}
   const [a,b]=pair;
   if(comparisonAssetIdentity(a.assetSignature)!==comparisonAssetIdentity(b.assetSignature)||JSON.stringify(a.lastFrame.cameraPosition)!==JSON.stringify(b.lastFrame.cameraPosition)||a.grassHidden!==b.grassHidden)throw Error('FOOTPRINT_PAIR_MISMATCH');
 }
 return true;
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
export const FOOTPRINT_ARCHIVE_SHA256='6ce5e77441d037646c19cf6b37698bbed99eebda34b2246c214a7fc3e5d2fbea';
export function preservedFootprintBaseline(candidateDir,outputDir){
 const dir=path.join(candidateDir,'h-earth-3d/evidence/groundcover-footprint-continuity-20261028/baseline-run40716213632');
 const bytes=fs.readFileSync(path.join(dir,'manifest.json'));
 if(sha(bytes)!==FOOTPRINT_ARCHIVE_SHA256)throw Error('PRESERVED_BASELINE_MANIFEST_DRIFT');
 const m=JSON.parse(bytes);
 if(m.sourceRun!==40716213632||m.baselineHead!==FOOTPRINT_BASELINE_HEAD||m.baselineErrors.length||m.views.length!==12)throw Error('PRESERVED_BASELINE_CUSTODY_INVALID');
 for(const v of m.views){
   if(v.label!=='baseline'||v.sourceHead!==FOOTPRINT_BASELINE_HEAD||v.rendererHash!==FOOTPRINT_BASELINE_SHA256||path.basename(v.image)!==v.image)throw Error('PRESERVED_BASELINE_VIEW_INVALID');
   const png=fs.readFileSync(path.join(dir,v.image));if(sha(png)!==v.imageSha256)throw Error('PRESERVED_BASELINE_IMAGE_DRIFT');
   fs.writeFileSync(path.join(outputDir,v.image),png);
 }
 return m;
}
export function assertSceneParity(baselineDir,candidateDir){
 const manifest=dir=>execFileSync('git',['-C',dir,'ls-tree','-r','HEAD','--','showroom/globe/h-earth','h-earth-3d'],{encoding:'utf8',maxBuffer:16*1024*1024}).split('\n').filter(line=>{
   const p=line.split('\t')[1]??'';
   return p&&p!==RENDERER.slice(1)&&!p.startsWith('h-earth-3d/evidence/groundcover-footprint-continuity-20261028/')&&p!=='h-earth-3d/experience-anchor/receipts/groundcover-footprint-continuity-20261028.json';
 }).join('\n');
 const a=manifest(baselineDir),b=manifest(candidateDir);
 if(!a||a!==b)throw Error('FOOTPRINT_SCENE_SOURCE_DRIFT');
 return {result:'EXACT_SCENE_TREE_PARITY_EXCEPT_DECLARED_RENDERER_AND_EVIDENCE',manifestSha256:sha(a)};
}
// Exclude only the observed execution duration, never physical asset identity.
export function comparisonAssetIdentity(signature){
 const parts=signature.split('|');
 if(parts.length===1)return signature;
 if(parts.length!==2)throw Error('ASSET_SIGNATURE_FORMAT_INVALID');
 const physical=JSON.parse(parts[1]);
 if(physical.entranceGrass?.slopeRepair)delete physical.entranceGrass.slopeRepair.generationMs;
 return parts[0]+'|'+JSON.stringify(physical);
}
export function footprintVegetationReadiness(resources){
 const r=resources?.singleOwnerVegetation;
 if(!r)return {ready:false,signature:'SINGLE_OWNER_PENDING'};
 if(r.disposed||r.allocationGlError||r.uploadGlError)throw Error('FOOTPRINT_VEGETATION_UPLOAD_FAILED');
 const keys=['schema','installedRootCount','originalRootCount','rootOwnerCount','gpuAllocationVerified','gpuUploadCount','gpuUploadedBytes','gpuAllocatedBytes','gpuRequestedBytes','gpuObservedBufferBytes','entranceGrass','allocationGlError','uploadGlError','disposed','tileCount','controlRoots'];
 const ready=r.schema==='H_EARTH_SINGLE_OWNER_WOODLAND_v1'&&r.rootOwnerCount===1&&r.gpuAllocationVerified===true&&Number.isInteger(r.installedRootCount)&&r.installedRootCount>0&&r.gpuUploadCount>0&&r.disposed===false&&r.gpuRequestedBytes===r.installedRootCount*16&&r.gpuObservedBufferBytes===r.gpuRequestedBytes&&r.gpuAllocatedBytes===r.gpuRequestedBytes&&r.gpuUploadedBytes===r.gpuRequestedBytes&&r.allocationGlError===0&&r.uploadGlError===0;
 const identity=structuredClone(Object.fromEntries(keys.map(k=>[k,r[k]])));
 if(identity.entranceGrass?.slopeRepair)delete identity.entranceGrass.slopeRepair.generationMs;
 return {ready,signature:JSON.stringify(identity)};
}
export function assertCheckout(dir,expected){const head=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==expected)throw Error('CHECKOUT_HEAD_MISMATCH');if(execFileSync('git',['-C',dir,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim())throw Error('CHECKOUT_TRACKED_BYTES_CHANGED');}
export function parseArgs(argv){const a={};for(let i=0;i<argv.length;i+=2){if(!['--baseline-dir','--candidate-dir','--output'].includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('CLI_NOT_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}if(Object.keys(a).length!==3)throw Error('CLI_INCOMPLETE');if(new Set(Object.values(a)).size!==3)throw Error('DIRECTORIES_NOT_DISTINCT');return a;}
export async function run(argv){
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const profile=process.env.H_EARTH_COMPARISON_PROFILE||'FACTOR_18_V1';
  if(!['FACTOR_18_V1','MAPWIDE_SCOUT_V1','MAPWIDE_CANDIDATE_V1','GROUNDCOVER_FOOTPRINT_V1'].includes(profile))throw Error('COMPARISON_PROFILE_NOT_REGISTERED');
  const poses=footprintCapture?FOOTPRINT_POSES:profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_POSES:DIAGNOSTIC_POSES;
  const modes=footprintCapture?FOOTPRINT_MODES:profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_MODES:DIAGNOSTIC_MODES;
  if(poses.length*modes.length>20)throw Error('DIAGNOSTIC_FRAME_CAP_EXCEEDED');
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,profile,poses,modes,repairOperationId:'H_EARTH_GROUNDCOVER_BAND_CONTINUITY_REPAIR_20261026_001',baselineProductSha256:RENDERER_SHA256,diagnosticOnly:true,searchProvenance:SEARCH_PROVENANCE,stageMeanings:DIAGNOSTIC_STAGE_MEANINGS,sourceProductSha256:RENDERER_SHA256,colorTransform:'ORIGINAL_EXPOSURE_1.12_AND_GAMMA_1_OVER_2.2_EXCEPT_RAW_COVERAGE_MODE',viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,views:[],runs:[],errors:[]};
  if(footprintCapture)Object.assign(receipt,{repairOperationId:'H_EARTH_GROUNDCOVER_FOOTPRINT_CONTINUITY_20261028_001',baselineProductSha256:FOOTPRINT_BASELINE_SHA256,searchProvenance:{kind:'REUSE_ARCHIVED_SOURCE_PROVEN_INLAND_BAND_AND_HEALTHY_CONTROLS',exactScreenshotMatchProven:false,priorStageAttributionRun:40411050366},stageMeanings:{'reference-lit':'Unchanged final lighting with physical vegetation visible','after-groundcover-unlit':'Composed groundcover albedo; physical vegetation hidden','footprint-activation-raw':'Linear raw filter activation (zero means hypothesis not exercised)'},filterHypothesisProven:false});
  const persist=()=>{fs.writeFileSync(out+'/receipt.tmp',JSON.stringify(receipt,null,2)+'\n');fs.renameSync(out+'/receipt.tmp',out+'/receipt.json');};
  let browser=null,server=null;
  const interrupt=signal=>{receipt.result='INTERRUPTED';receipt.errors.push(signal);persist();server?.kill();process.exit(signal==='SIGTERM'?143:130);};
  const onTerm=()=>interrupt('SIGTERM'),onInt=()=>interrupt('SIGINT');
  process.once('SIGTERM',onTerm);process.once('SIGINT',onInt);persist();
  try{
    for(const label of Object.keys(HEADS))assertCheckout(a['--'+label+'-dir'],HEADS[label]);
    if(footprintCapture){receipt.sceneParity=assertSceneParity(a['--baseline-dir'],a['--candidate-dir']);const archive=preservedFootprintBaseline(a['--candidate-dir'],out);receipt.views.push(...archive.views.map(v=>({...v,inheritedFromRun:archive.sourceRun})));receipt.runs.push({label:'baseline',head:FOOTPRINT_BASELINE_HEAD,inheritedFromRun:archive.sourceRun,manifestSha256:FOOTPRINT_ARCHIVE_SHA256,completedAt:archive.baselineCompletedAt,errors:[]});persist();}
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of ['candidate'].entries()){
      const dir=a['--'+label+'-dir'],port=18767+index,base='http://127.0.0.1:'+port;
      const runRecord={label,head:HEADS[label],errors:[],instrumentation:[],startedAt:new Date().toISOString()};receipt.runs.push(runRecord);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      const serverError=[];server.on('error',e=>serverError.push(e.message));
      let listening=false;for(let n=0;n<50;n++){try{const r=await fetch(base+ROOT);if(r.ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SERVER_UNAVAILABLE:'+serverError.join(';'));
      const context=await browser.newContext({viewport:{width:540,height:1000},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(30000);
      await page.addInitScript({content:'globalThis.__groundcoverFactorMode=0;globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';globalThis.__footprintVegetationReadiness='+footprintVegetationReadiness.toString()+';' });
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,footprintCapture?(source=>instrumentFootprintRenderer(source,{baseline:label==='baseline'})):profile==='MAPWIDE_CANDIDATE_V1'?instrumentCandidateRenderer:instrumentDiagnosticRenderer]]){
        const original=fs.readFileSync(path.join(dir,pathname),'utf8'),transformed=transform(original);runRecord.instrumentation.push({path:pathname,sourceSha256:sha(original),observedSha256:sha(transformed)});
        await page.route(url=>url.pathname===pathname,route=>route.fulfill({status:200,contentType:'text/javascript',body:transformed}));
      }
      receipt.sourceProductSha256=runRecord.instrumentation.find(x=>x.path===RENDERER)?.sourceSha256;
      persist();
      await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
      if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('RENDERER_STARTUP_FAILED');
      await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
      await page.mouse.move(270,350);await page.mouse.down();await page.mouse.move(320,350,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled);await page.click('[data-enter]');
      await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
      let sequence=10000,previousFrame=0;
      for(const pose of poses)for(const mode of modes){
        const hidden=!(footprintCapture&&mode==='reference-lit');await page.evaluate(value=>{globalThis.__groundcoverFactorMode=value;},MODE_ID_BY_NAME.get(mode));
        const settleDeadline=Date.now()+180000;let stable=0,signature=null;
        while(stable<2){
          const settled=await page.evaluate(async({pose,hidden,sequence,footprint})=>{
            globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON_SETTLE');
            globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
            const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');const expected=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});const asset=globalThis.__groundAssetReadiness(gpu.resources,expected.camera.position);if(footprint){const vegetation=globalThis.__footprintVegetationReadiness(gpu.resources);asset.ready=asset.ready&&vegetation.ready;asset.signature+='|'+vegetation.signature;}return {asset,frame:gpu.frameRecords.at(-1)};
          },{pose,hidden,sequence:sequence+1,footprint:footprintCapture});
          receipt.lastSettle={label,pose,...settled};persist();
          stable=settled.frame.navigationSequence===sequence+1&&settled.asset.ready&&settled.asset.signature===signature?stable+1:0;signature=settled.asset.signature;
          if(Date.now()>settleDeadline)throw Error('ASSETS_NOT_SETTLED');
          if(stable<2)await new Promise(r=>setTimeout(r,250));
        }

        const view=await page.evaluate(async({pose,hidden,sequence,measureGpu})=>{
          globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON');
          globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
          const costs=[],finishedCosts=[];const timingGl=document.querySelector('#h-earth-functional-landscape-canvas')?.getContext('webgl2');for(let i=0;i<12;i++){const t=performance.now();globalThis.__HEarthAuditPresent(state);costs.push(performance.now()-t);if(measureGpu){timingGl.finish();finishedCosts.push(performance.now()-t);}await new Promise(requestAnimationFrame);}
          const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');
          const expectedPacket=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});
          return {state,expectedCameraPosition:expectedPacket.camera.position,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,softwareGpuFinishMilliseconds:finishedCosts,resources:gpu.resources,grassHidden:hidden,diagnosticApplied:globalThis.__groundcoverFactorModeApplied};
        },{pose,hidden,sequence:++sequence,measureGpu:footprintCapture});
        receipt.lastAttempt={label,pose,mode,...view};persist();
        if(view.diagnosticApplied!==MODE_ID_BY_NAME.get(mode))throw Error('DIAGNOSTIC_MODE_NOT_APPLIED');
        const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);if(footprintCapture){const vegetation=footprintVegetationReadiness(view.resources);assets.ready=assets.ready&&vegetation.ready;assets.signature+='|'+vegetation.signature;}if(!assets.ready||assets.signature!==signature)throw Error('ASSETS_CHANGED_DURING_CAPTURE');view.assetSignature=assets.signature;
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+mode+'.png';const capture=await page.evaluate(()=>{const canvas=document.querySelector('#h-earth-functional-landscape-canvas');const gl=canvas?.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('CAPTURE_CONTEXT_NOT_PRESERVED');const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);const dataUrl=canvas.toDataURL('image/png');const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {dataUrl,before,after};});const bytes=decodeCanvasCapture(capture,view.lastFrame);fs.writeFileSync(path.join(out,name),bytes);
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        if(footprintCapture&&mode==='footprint-activation-raw'){view.activationSamples=await page.evaluate(()=>{const c=document.querySelector('#h-earth-functional-landscape-canvas'),gl=c.getContext('webgl2'),out=[];for(const y of [260,270,280,290,300])for(const x of [240,264,288]){const p=new Uint8Array(4);gl.readPixels(x,c.height-1-y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);out.push({x,y,rgba:[...p]});}return out;});}
        receipt.views.push({label,pose,mode,instrumentation:runRecord.instrumentation,...view,modeId:MODE_ID_BY_NAME.get(mode),sourceHead:HEADS[label],rendererHash:receipt.sourceProductSha256,captureMethod:'PRESERVED_WEBGL_CANVAS_PNG',imageWidth:529,imageHeight:980,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    if(footprintCapture)validateFootprintSet(receipt.views);else validateDiagnosticSet(receipt.views,poses,modes);
    receipt.result=footprintCapture?'FOOTPRINT_CAPTURE_COMPLETE_VISUAL_AND_ACTIVATION_REVIEW_PENDING':'DIAGNOSTIC_CAPTURE_COMPLETE_FACTOR_REVIEW_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',onTerm);process.removeListener('SIGINT',onInt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});


