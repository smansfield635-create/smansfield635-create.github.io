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
export const GEN2944_SOURCE_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';
export const GEN2944_SHADER_SHA256='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
export const NORMAL_MODES=Object.freeze(['original-lit','normal-candidate-lit','normal-correction-raw','original-lit-with-grass','normal-candidate-lit-with-grass']);
export const NORMAL_POSES=Object.freeze([
 Object.freeze({name:'ridge-diagonal',x:88,z:-260,yaw:118,pitch:-13}),
 Object.freeze({name:'healthy-coast',x:0,z:-110,yaw:170,pitch:-8})
]);
// Owner-directed steep mountain-side blending versus established meadow/tree side.
export const STEEP_MATERIAL_MODES=Object.freeze(['original-lit-with-grass','coherent-lit-with-grass']);
export const STEEP_MATERIAL_POSES=Object.freeze([
 Object.freeze({name:'steep-diagonal',x:88,z:-260,yaw:118,pitch:-13}),
 Object.freeze({name:'steep-across',x:88,z:-260,yaw:95,pitch:-10}),
 Object.freeze({name:'protected-meadow',x:-52,z:-208,yaw:136,pitch:-15}),
 Object.freeze({name:'protected-coast',x:0,z:-110,yaw:170,pitch:-8})
]);
export const NORMAL_PROBE_MODES=Object.freeze(['original-lit','normal-correction-raw']);
export const NORMAL_PROBE_POSES=Object.freeze([NORMAL_POSES[0]]);
const NORMAL_IDS=new Map(NORMAL_MODES.map((m,i)=>[m,i]));
const steepMaterialCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GEN2944_STEEP_MATERIAL_BLEND_V1';
const normalProbeCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GEN2944_NORMAL_PROBE_V1';
const normalCapture=steepMaterialCapture||normalProbeCapture||process.env.H_EARTH_COMPARISON_PROFILE==='GEN2944_NORMAL_ONLY_V1';
const candidateCapture=process.env.H_EARTH_COMPARISON_PROFILE==='MAPWIDE_CANDIDATE_V1';
const candidateHead=process.env.H_EARTH_COMPARISON_CANDIDATE_SHA||'';
if(candidateCapture&&!/^[a-f0-9]{40}$/.test(candidateHead))throw Error('CANDIDATE_EXACT_SHA_REQUIRED');
export const HEADS=Object.freeze({baseline:normalCapture?GEN2944_SOURCE_HEAD:MATERIAL_BASELINE_HEAD,candidate:normalCapture?GEN2944_SOURCE_HEAD:(candidateCapture?candidateHead:MATERIAL_BASELINE_HEAD)});
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
// Source-preserving shader interception: only a local near-terrain *normal*
// is varied in memory. The approved G_world, baked mesh and roots are immutable.
export function instrumentRidgeNormalRenderer(original){
 if(sha(original)!==GEN2944_SHADER_SHA256)throw Error('GEN2944_FROZEN_RENDERER_HASH_MISMATCH');
 const start=original.indexOf('const FS = '),end=original.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('GEN2944_FRAGMENT_SCOPE_INVALID');
 let fragment=original.slice(start,end);
 const one=(a,b)=>{if(fragment.split(a).length!==2)throw Error('GEN2944_SHADER_ANCHOR_NOT_UNIQUE:'+a.slice(0,75));fragment=fragment.replace(a,b);};
 one('out vec4 outColor;','out vec4 outColor;\nuniform int uRidgeNormalMode;');
 one('float terrainRoughnessForLighting=0.72;','float terrainRoughnessForLighting=0.72;\n  float ridgeCorrectionRaw=0.0;\n  float ridgeRegionRaw=0.0,ridgeGapRaw=0.0;\n  vec2 ridgeDebugWorld=vec2(0.0);float ridgeSignedGapRaw=0.0;');
 const classification='  bool worldSoilTerrain=geologicalEarthRock||vRoleCode==1u||\n    int(vPrimitiveIndex)==uGlobalCoverFarPrimitiveIndex;';
 const counterfactual=[
  classification,
  '  if((uRidgeNormalMode==1||uRidgeNormalMode==2||uRidgeNormalMode==4)&&vRoleCode==1u){',
  '    vec2 q=vWorldPosition.xz;',
  '    float region=smoothstep(102.0,112.0,q.x)*(1.0-smoothstep(153.0,163.0,q.x))*',
  '      smoothstep(-280.0,-270.0,q.y)*(1.0-smoothstep(-225.0,-215.0,q.y));',
  '    vec2 e=(q-vec2(148.0,-224.0))/vec2(66.0,34.0);',
  '    vec2 c=(q-vec2(86.0,-235.0))/vec2(68.0,37.0);',
  '    float a=38.0*exp(-1.6*dot(e,e));',
  '    float b=34.0*exp(-1.6*dot(c,c));',
  '    float gap=abs(a-b);',
  '    ridgeRegionRaw=region;ridgeGapRaw=1.0-smoothstep(0.0,2.0,gap);',
  '    ridgeDebugWorld=vec2(clamp((q.x+256.0)/512.0,0.0,1.0),clamp((q.y+400.0)/320.0,0.0,1.0));',
  '    ridgeSignedGapRaw=clamp(0.5+(a-b)/24.0,0.0,1.0);',
  '    if(region>0.0&&gap<2.0){',
  '      vec2 ga=vec2(-3.2*a*(q.x-148.0)/(66.0*66.0),-3.2*a*(q.y+224.0)/(34.0*34.0));',
  '      vec2 gb=vec2(-3.2*b*(q.x-86.0)/(68.0*68.0),-3.2*b*(q.y+235.0)/(37.0*37.0));',
  '      float f=gap/2.0;',
  '      float coefficient=2.0*f-1.5*f*f;',
  '      vec2 corrected=0.5*(ga+gb)+sign(a-b)*coefficient*(ga-gb);',
  '      vec2 originalGradient=a>=b?ga:gb;',
  '      vec2 correction=0.78*region*(corrected-originalGradient);',
  '      ridgeCorrectionRaw=clamp(length(correction)/0.3,0.0,1.0);',
  '      geometricNormal=normalize(vec3(geometricNormal.x-correction.x*geometricNormal.y,geometricNormal.y,geometricNormal.z-correction.y*geometricNormal.y));',
  '      shadingNormal=geometricNormal;',
  '      slope=1.0-clamp(geometricNormal.y,0.0,1.0);',
  '    }',
  '  }'
 ].join('\n');
 one(classification,counterfactual);
 const gamma='  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));';
 one(gamma,gamma+'\n  if(worldSoilTerrain&&uRidgeNormalMode==2)lit=vec3(ridgeDebugWorld,ridgeSignedGapRaw);');
 let source=original.slice(0,start)+fragment+original.slice(end);
 const draw='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';
 if(source.split(draw).length!==2)throw Error('GEN2944_DRAW_ANCHOR_NOT_UNIQUE');
 source=source.replace(draw,draw+[
  '    {const m=globalThis.__ridgeNormalMode??0;',
  '    if(!Number.isInteger(m)||m<0||m>4)throw Error("GEN2944_MODE_INVALID");',
  '    const loc=gl.getUniformLocation(resources.geometryProgram,"uRidgeNormalMode");',
  '    if(loc===null)throw Error("GEN2944_UNIFORM_NOT_FOUND");',
  '    gl.uniform1i(loc,m);globalThis.__ridgeNormalModeApplied=m;}'
 ].join('\n'));
 return instrumentRenderer(source);
}
// In-memory material candidate only: retain published geometry, sun and physical
// plants while gently reconciling steep-side bare ground toward one approved
// world-space soil texture family. The broad geographic feather has no hard edge.
export function instrumentSteepMaterialRenderer(original){
 if(sha(original)!==GEN2944_SHADER_SHA256)throw Error('GEN2944_STEEP_FROZEN_SHADER_DRIFT');
 const start=original.indexOf('const FS = '),end=original.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('GEN2944_STEEP_FS_SCOPE_MISSING');
 let fragment=original.slice(start,end);
 const one=(a,z)=>{if(fragment.split(a).length!==2)throw Error('GEN2944_STEEP_ANCHOR_MISSING:'+a.slice(0,60));fragment=fragment.replace(a,z);};
 one('out vec4 outColor;','out vec4 outColor;\\nuniform int uRidgeNormalMode;'.replaceAll('\\n','\n'));
 const anchor='  if(clearingType>0.5&&clearingType<1.5){\\n    // Texture-derived shallow bark relief'.replaceAll('\\n','\n');
 const patch=[
 '  // GEN2944_STEEP_OWNER_BLEND_DIAGNOSTIC: only physical soil roles.',
 '  if(uRidgeNormalMode==1&&worldSoilTerrain&&!geologicalEarthRock&&uClearingEnabled==1){',
 '    vec2 s=vWorldPosition.xz;',
 '    float zone=smoothstep(48.0,116.0,s.x)*(1.0-smoothstep(-200.0,-143.0,s.y))*',
 '      smoothstep(34.0,91.0,max(0.0,vCoastDistanceMeters));',
 '    float preservedGrove=1.0-smoothstep(48.0,95.0,distance(s,vec2(-139.40268,-210.74617)));',
 '    zone*=1.0-preservedGrove;',
 '    if(zone>0.0001){',
 '      vec3 coherent=pow(texture(uClearingSoil,clearingLocalXZ(vWorldPosition)*0.28).rgb,vec3(2.2))*0.75;',
 '      float wideTonal=noise2(s*0.018+vec2(5.0,-11.0));',
 '      coherent*=mix(vec3(1.12,1.06,0.91),vec3(0.92,0.97,1.02),wideTonal);',
 '      float strength=0.78*zone;',
 '      base=mix(base,coherent,strength);',
 '      terrainRoughnessForLighting=mix(terrainRoughnessForLighting,0.94,strength);',
 '      terrainReflectanceForLighting=mix(terrainReflectanceForLighting,0.02,strength);',
 '    }',
 '  }'
 ].join('\n');
 one(anchor,patch+'\n'+anchor);
 let source=original.slice(0,start)+fragment+original.slice(end);
 const draw='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';
 if(source.split(draw).length!==2)throw Error('GEN2944_STEEP_DRAW_ANCHOR_MISSING');
 source=source.replace(draw,draw+[
 '    {const m=globalThis.__ridgeNormalMode??0;',
 '    if(!Number.isInteger(m)||m<0||m>1)throw Error("GEN2944_STEEP_MODE_INVALID");',
 '    const loc=gl.getUniformLocation(resources.geometryProgram,"uRidgeNormalMode");',
 '    if(loc===null)throw Error("GEN2944_STEEP_MODE_UNIFORM_MISSING");',
 '    gl.uniform1i(loc,m);globalThis.__ridgeNormalModeApplied=m;}'
 ].join('\n'));
 return instrumentRenderer(source);
}
export function validateRidgeNormalSet(views,poses=NORMAL_POSES,modes=NORMAL_MODES){
 if(views.length!==poses.length*modes.length)throw Error('GEN2944_FRAME_COUNT');
 for(const pose of poses){
  const arr=views.filter(v=>v.pose.name===pose.name);
  if(arr.length!==modes.length)throw Error('GEN2944_POSE_INCOMPLETE');
  const ref=arr[0];
  for(const mode of modes){
   const v=arr.find(q=>q.mode===mode);
   if(!v||v.diagnosticApplied!==NORMAL_IDS.get(mode)||v.grassHidden===mode.endsWith('with-grass')||
      v.assetSignature!==ref.assetSignature||v.sourceHead!==GEN2944_SOURCE_HEAD||
      v.rendererHash!==GEN2944_SHADER_SHA256||
      JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition))
      throw Error('GEN2944_PAIR_MISMATCH');
  }
 }
 return true;
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
export async function run(argv){
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const profile=process.env.H_EARTH_COMPARISON_PROFILE||'FACTOR_18_V1';
  if(!['FACTOR_18_V1','MAPWIDE_SCOUT_V1','MAPWIDE_CANDIDATE_V1','GEN2944_NORMAL_ONLY_V1','GEN2944_NORMAL_PROBE_V1','GEN2944_STEEP_MATERIAL_BLEND_V1'].includes(profile))throw Error('COMPARISON_PROFILE_NOT_REGISTERED');
  const poses=steepMaterialCapture?STEEP_MATERIAL_POSES:(normalProbeCapture?NORMAL_PROBE_POSES:(normalCapture?NORMAL_POSES:(profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_POSES:DIAGNOSTIC_POSES)));
  const modes=steepMaterialCapture?STEEP_MATERIAL_MODES:(normalProbeCapture?NORMAL_PROBE_MODES:(normalCapture?NORMAL_MODES:(profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_MODES:DIAGNOSTIC_MODES)));
  if(poses.length*modes.length>20)throw Error('DIAGNOSTIC_FRAME_CAP_EXCEEDED');
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,profile,poses,modes,repairOperationId:normalCapture?'H_EARTH_GEN2943_CANONICAL_MOUNTAIN_RIDGE_CONTINUITY_REPAIR_20261027_001':'H_EARTH_GROUNDCOVER_BAND_CONTINUITY_REPAIR_20261026_001',baselineProductSha256:normalCapture?GEN2944_SHADER_SHA256:RENDERER_SHA256,diagnosticOnly:true,searchProvenance:SEARCH_PROVENANCE,stageMeanings:DIAGNOSTIC_STAGE_MEANINGS,sourceProductSha256:RENDERER_SHA256,colorTransform:'ORIGINAL_EXPOSURE_1.12_AND_GAMMA_1_OVER_2.2_EXCEPT_RAW_COVERAGE_MODE',viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,views:[],runs:[],errors:[]};
  const persist=()=>{fs.writeFileSync(out+'/receipt.tmp',JSON.stringify(receipt,null,2)+'\n');fs.renameSync(out+'/receipt.tmp',out+'/receipt.json');};
  let browser=null,server=null;
  const interrupt=signal=>{receipt.result='INTERRUPTED';receipt.errors.push(signal);persist();server?.kill();process.exit(signal==='SIGTERM'?143:130);};
  const onTerm=()=>interrupt('SIGTERM'),onInt=()=>interrupt('SIGINT');
  process.once('SIGTERM',onTerm);process.once('SIGINT',onInt);persist();
  try{
    for(const label of Object.keys(HEADS))assertCheckout(a['--'+label+'-dir'],HEADS[label]);
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of ['candidate'].entries()){
      const dir=a['--'+label+'-dir'],port=18767+index,base='http://127.0.0.1:'+port;
      const runRecord={label,head:HEADS[label],errors:[],instrumentation:[],startedAt:new Date().toISOString()};receipt.runs.push(runRecord);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      const serverError=[];server.on('error',e=>serverError.push(e.message));
      let listening=false;for(let n=0;n<50;n++){try{const r=await fetch(base+ROOT);if(r.ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SERVER_UNAVAILABLE:'+serverError.join(';'));
      const context=await browser.newContext({viewport:{width:540,height:1000},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(30000);
      await page.addInitScript({content:'globalThis.__groundcoverFactorMode=0;globalThis.__ridgeNormalMode=0;globalThis.__ridgeNormalCapture='+normalCapture+';globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';'});
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,steepMaterialCapture?instrumentSteepMaterialRenderer:(normalCapture?instrumentRidgeNormalRenderer:(profile==='MAPWIDE_CANDIDATE_V1'?instrumentCandidateRenderer:instrumentDiagnosticRenderer))]]){
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
        const hidden=normalCapture?!mode.endsWith('with-grass'):true;await page.evaluate(value=>{if(globalThis.__ridgeNormalCapture)globalThis.__ridgeNormalMode=value;else globalThis.__groundcoverFactorMode=value;},normalCapture?NORMAL_IDS.get(mode):MODE_ID_BY_NAME.get(mode));
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
          return {state,expectedCameraPosition:expectedPacket.camera.position,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,resources:gpu.resources,grassHidden:hidden,diagnosticApplied:globalThis.__ridgeNormalCapture?globalThis.__ridgeNormalModeApplied:globalThis.__groundcoverFactorModeApplied};
        },{pose,hidden,sequence:++sequence});
        receipt.lastAttempt={label,pose,mode,...view};persist();
        if(view.diagnosticApplied!==(normalCapture?NORMAL_IDS.get(mode):MODE_ID_BY_NAME.get(mode)))throw Error('DIAGNOSTIC_MODE_NOT_APPLIED');
        const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);if(!assets.ready||assets.signature!==signature)throw Error('ASSETS_CHANGED_DURING_CAPTURE');view.assetSignature=assets.signature;
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+mode+'.png';const capture=await page.evaluate(()=>{const canvas=document.querySelector('#h-earth-functional-landscape-canvas');const gl=canvas?.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('CAPTURE_CONTEXT_NOT_PRESERVED');const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);const dataUrl=canvas.toDataURL('image/png');const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {dataUrl,before,after};});const bytes=decodeCanvasCapture(capture,view.lastFrame);fs.writeFileSync(path.join(out,name),bytes);
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        receipt.views.push({label,pose,mode,instrumentation:runRecord.instrumentation,...view,modeId:normalCapture?NORMAL_IDS.get(mode):MODE_ID_BY_NAME.get(mode),sourceHead:HEADS[label],rendererHash:receipt.sourceProductSha256,captureMethod:'PRESERVED_WEBGL_CANVAS_PNG',imageWidth:529,imageHeight:980,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    if(normalCapture)validateRidgeNormalSet(receipt.views,poses,modes);
    else validateDiagnosticSet(receipt.views,poses,modes);
    receipt.result=normalCapture?'GEN2944_NORMAL_ONLY_CAPTURE_COMPLETE_REVIEW_PENDING':'DIAGNOSTIC_CAPTURE_COMPLETE_FACTOR_REVIEW_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',onTerm);process.removeListener('SIGINT',onInt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});

