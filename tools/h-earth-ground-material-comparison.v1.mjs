import fs from 'node:fs';
import {WORLD_MODES,WORLD_ENCODING,instrumentWorldRenderer,validateCalibration,decodeWorld} from './h-earth-world-position-overlay.mjs';
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
const worldCapture=process.env.H_EARTH_COMPARISON_PROFILE==='WORLD_POSITION_DIAGNOSTIC_V1';
const identityCapture=process.env.H_EARTH_COMPARISON_PROFILE==='IDENTITY_BLEND_DIAGNOSTIC_V1';
export const IDENTITY_SOURCE_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';
export const IDENTITY_RENDERER_SHA256='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
const contributionCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GROUNDCOVER_CONTRIBUTION_LEDGER_V1';
export const CONTRIBUTION_SOURCE_HEAD='1e39f93a07eb2cc5156483b899094937ba2149db';
export const CONTRIBUTION_RENDERER_SHA256='b4bda2b8953b5bcc3cd65e101a447a878c2d033ec683af53a93ff211c13cdf70';
const fertileCapture=process.env.H_EARTH_COMPARISON_PROFILE==='IDENTITY_FERTILE_TRANSITION_V1';
const residualCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GROUNDCOVER_RESIDUAL_TRANSFER_V1';
const residentCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GROUNDCOVER_RESIDENT_FIELD_V1';
const composedCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GROUNDCOVER_COMPOSED_TARGET_V1';
const footprintCapture=process.env.H_EARTH_COMPARISON_PROFILE==='GROUNDCOVER_FOOTPRINT_V1';
export const FOOTPRINT_BASELINE_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';
export const FOOTPRINT_BASELINE_SHA256='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
const pairedCapture=footprintCapture||composedCapture||residentCapture||residualCapture||fertileCapture;
const resourceCapture=pairedCapture||contributionCapture||identityCapture||worldCapture;
const candidateCapture=pairedCapture||process.env.H_EARTH_COMPARISON_PROFILE==='MAPWIDE_CANDIDATE_V1';
const candidateHead=process.env.H_EARTH_COMPARISON_CANDIDATE_SHA||'';
if(candidateCapture&&!/^[a-f0-9]{40}$/.test(candidateHead))throw Error('CANDIDATE_EXACT_SHA_REQUIRED');
export const HEADS=Object.freeze({baseline:(identityCapture||worldCapture)?IDENTITY_SOURCE_HEAD:contributionCapture?CONTRIBUTION_SOURCE_HEAD:pairedCapture?FOOTPRINT_BASELINE_HEAD:MATERIAL_BASELINE_HEAD,candidate:(identityCapture||worldCapture)?IDENTITY_SOURCE_HEAD:contributionCapture?CONTRIBUTION_SOURCE_HEAD:candidateCapture?candidateHead:MATERIAL_BASELINE_HEAD});
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
export const COMPOSED_MODES=Object.freeze(['reference-lit','after-groundcover-unlit']);
export const CONTRIBUTION_POSES=Object.freeze(FOOTPRINT_POSES.slice(0,2));
export const CONTRIBUTION_MODES=Object.freeze(['before-groundcover-unlit','groundcover-tone-color','groundcover-weight-raw','after-groundcover-unlit']);
MODE_ID_BY_NAME.set('footprint-activation-raw',4);
export const IDENTITY_MODES=Object.freeze(['identity-incoming-color','identity-result-color','identity-target-color','identity-palette-factors-raw','identity-mix-factors-raw','identity-brightness-factors-raw','identity-noise-factors-raw','identity-landform-factors-raw','identity-protection-factors-raw','identity-footprint-raw']);
export const IDENTITY_POSES=CONTRIBUTION_POSES;
export const WORLD_POSES=CONTRIBUTION_POSES;
if(worldCapture)WORLD_MODES.forEach((name,index)=>MODE_ID_BY_NAME.set(name,index));
if(identityCapture)IDENTITY_MODES.forEach((name,index)=>MODE_ID_BY_NAME.set(name,index));
export function instrumentIdentityRenderer(original){
 if(sha(original)!==IDENTITY_RENDERER_SHA256)throw Error('IDENTITY_FROZEN_RENDERER_MISMATCH');
 const start=original.indexOf('const FS = '),end=original.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('IDENTITY_FRAGMENT_SCOPE');
 let fragment=original.slice(start,end);
 fragment=replaceExactlyOnce(fragment,'out vec4 outColor;','out vec4 outColor;\nuniform int uIdentityDiagnosticMode;');
 // Derivatives precede every conditional/discard in this fragment shader.
 fragment=replaceExactlyOnce(fragment,'void main(){',`void main(){
  vec3 identityDx=dFdx(vWorldPosition),identityDy=dFdy(vWorldPosition);
  float identityQWorld=max(length(identityDx.xz),length(identityDy.xz));
  float identityQTri=max(max(max(length(identityDx.xy),length(identityDx.xz)),max(length(identityDx.yz),length(identityDy.xy))),max(length(identityDy.xz),length(identityDy.yz)));
  vec3 identityP=vec3(0.0),identityC=vec3(0.0),identityT=vec3(0.0);
  vec3 identityPack0=vec3(0.0),identityPack1=vec3(0.0),identityPack2=vec3(0.0),identityPack3=vec3(0.0),identityPack4=vec3(0.0),identityPack5=vec3(0.0);
  float identitySeen=0.0;`);
 const anchor='    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN';
 fragment=replaceExactlyOnce(fragment,anchor,'    identityP=palette;\n    identityC=palette;\n    identityT=palette;\n'+anchor);
 const mix='      palette=mix(palette,identityBase,identityWeight);';
 fragment=replaceExactlyOnce(fragment,mix,`      identityT=identityBase;
      identitySeen=1.0;
      identityPack0=vec3(coastalEarth,fertilePatch,moistShelter);
      identityPack1=vec3(upperDry,mineralExposure,identityWeight);
      identityPack2=vec3(materialVariation,triFine,nearMaterial);
      identityPack3=vec3(macroField,mesoField,detailField);
      identityPack4=vec3(shelteredBasin,slopeResponse,rockExposure);
      identityPack5=vec3(inlandIdentity,protectedGrove,smoothstep(8.0,30.0,vWorldPosition.y));
${mix}
      identityC=palette;`);
 const gamma='  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));';
 fragment=replaceExactlyOnce(fragment,gamma,`  if(worldSoilTerrain){
    if(uIdentityDiagnosticMode==0)lit=identityP;
    else if(uIdentityDiagnosticMode==1)lit=identityC;
    else if(uIdentityDiagnosticMode==2)lit=identityT;
  }
${gamma}
  if(uIdentityDiagnosticMode>=3){
    lit=vec3(0.0);
    if(worldSoilTerrain&&identitySeen>0.5){
      if(uIdentityDiagnosticMode==3)lit=identityPack0;
      else if(uIdentityDiagnosticMode==4)lit=identityPack1;
      else if(uIdentityDiagnosticMode==5)lit=identityPack2;
      else if(uIdentityDiagnosticMode==6)lit=identityPack3;
      else if(uIdentityDiagnosticMode==7)lit=identityPack4;
      else if(uIdentityDiagnosticMode==8)lit=identityPack5;
      else lit=vec3(identityQWorld/(1.0+identityQWorld),identityQTri/(1.0+identityQTri),identitySeen);
    }
  }`);
 let source=original.slice(0,start)+fragment+original.slice(end);
 const draw='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';
 source=replaceExactlyOnce(source,draw,draw+`\n    {const mode=globalThis.__groundcoverFactorMode;
      if(!Number.isInteger(mode)||mode<0||mode>=10)throw Error('IDENTITY_MODE_INVALID');
      const loc=gl.getUniformLocation(resources.geometryProgram,'uIdentityDiagnosticMode');
      if(loc===null)throw Error('IDENTITY_UNIFORM_MISSING');
      gl.uniform1i(loc,mode);globalThis.__groundcoverFactorModeApplied=mode;}`);
 return instrumentRenderer(source);
}
export function validateIdentitySet(views){
 if(views.length!==20)throw Error('IDENTITY_FRAME_CAP_INVALID');
 // Do not depend on process profile when verifying persisted evidence.
 for(const pose of IDENTITY_POSES){
  const group=views.filter(v=>v.pose?.name===pose.name),ref=group[0];
  if(group.length!==10)throw Error('IDENTITY_POSE_COUNT');
  for(const [index,mode] of IDENTITY_MODES.entries()){
   const matches=group.filter(v=>v.mode===mode);if(matches.length!==1)throw Error('IDENTITY_MODE_SET');
   const v=matches[0];
   if(v.label!=='candidate'||v.sourceHead!==IDENTITY_SOURCE_HEAD||v.rendererHash!==IDENTITY_RENDERER_SHA256||v.modeId!==index||v.diagnosticApplied!==index||!v.grassHidden)throw Error('IDENTITY_SOURCE_OR_MODE_MISMATCH');
   if(JSON.stringify(v.pose)!==JSON.stringify(pose)||JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition)||normalizeAssetSignature(v.assetSignature)!==normalizeAssetSignature(ref.assetSignature))throw Error('IDENTITY_POSE_OR_ASSET_DRIFT');
   validateFrame(v,pose,v.state.sequence);
   const assets=assetReadiness(v.resources,v.lastFrame.cameraPosition),vegetation=footprintVegetationReadiness(v.resources);
   if(!assets.ready||!vegetation.ready||assets.signature+'|'+vegetation.signature!==normalizeAssetSignature(v.assetSignature))throw Error('IDENTITY_RESOURCE_SIGNATURE_MISMATCH');
   if(v.cpuSubmitMilliseconds?.length!==1||v.softwareGpuFinishMilliseconds?.length!==1)throw Error('IDENTITY_SUBMISSION_COUNT');
  }
 }
 return true;
}

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
export const RESIDUAL_MODES=COMPOSED_MODES;
export const RESIDUAL_POSES=FOOTPRINT_POSES;
export const ORIGINAL_RESIDUAL_COMPOSITION='      groundcoverTone*=0.88+0.24*materialVariation;\n      palette=mix(palette,groundcoverTone,groundcoverWeight);';
export const RESIDUAL_COMPOSITION='      palette+=0.24*groundcoverWeight*groundcoverTone*(materialVariation-0.5);';
export const RESIDUAL_PROBE='      probeGCAfter=palette+0.24*groundcoverWeight*groundcoverTone*(materialVariation-0.5);';
export function reconstructResidualBaseline(source){
 const baseline=replaceExactlyOnce(source,RESIDUAL_COMPOSITION,ORIGINAL_RESIDUAL_COMPOSITION);
 if(sha(baseline)!==FOOTPRINT_BASELINE_SHA256)throw Error('RESIDUAL_BASELINE_RECONSTRUCTION_MISMATCH');
 return baseline;
}
export function verifyResidualInstrumentation(source){
 if(source.split(RESIDUAL_COMPOSITION).length!==2||source.split(RESIDUAL_PROBE).length!==2||source.includes('probeGCAfter=mix(')||source.includes('palette=mix(palette,groundcoverTone,groundcoverWeight);')||source.includes('groundcoverTone*=0.88+0.24*materialVariation;'))throw Error('RESIDUAL_PROBE_CONTAMINATION');
 return true;
}
export function instrumentResidualRenderer(source){
 reconstructResidualBaseline(source);
 // Reuse the established overlay's anchors without restoring the old T0
 // modulation. Both its actual composition and albedo probe are then replaced.
 const overlayInput=replaceExactlyOnce(source,RESIDUAL_COMPOSITION,'      palette=mix(palette,groundcoverTone,groundcoverWeight);');
 let observed=transformPublishedRenderer(overlayInput,{strictHash:false}).source;
 observed=replaceExactlyOnce(observed,'      probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);',RESIDUAL_PROBE);
 observed=replaceExactlyOnce(observed,'      palette=mix(palette,groundcoverTone,groundcoverWeight);',RESIDUAL_COMPOSITION);
 verifyResidualInstrumentation(observed);
 return instrumentRenderer(observed);
}

export const FERTILE_MODES=COMPOSED_MODES;
export const FERTILE_POSES=FOOTPRINT_POSES;
export const FERTILE_ORIGINAL_EXPRESSION='fertilePatch=smoothstep(\n        0.42,0.68,\n        macroField*0.47+mesoField*0.38+detailField*0.15\n      )';
export const FERTILE_CANDIDATE_EXPRESSION='fertilePatch=smoothstep(\n        0.29,0.81,\n        macroField*0.47+mesoField*0.38+detailField*0.15\n      )';
export function reconstructFertileBaseline(source){
 const baseline=replaceExactlyOnce(source,FERTILE_CANDIDATE_EXPRESSION,FERTILE_ORIGINAL_EXPRESSION);
 if(sha(baseline)!==FOOTPRINT_BASELINE_SHA256)throw Error('FERTILE_BASELINE_RECONSTRUCTION_MISMATCH');
 return baseline;
}
export function verifyFertileInstrumentation(source){
 if(source.split(FERTILE_CANDIDATE_EXPRESSION).length!==2||source.includes(FERTILE_ORIGINAL_EXPRESSION)||source.includes(RESIDUAL_COMPOSITION)||source.includes(RESIDUAL_PROBE)||source.split('      probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);').length!==2||source.split(ORIGINAL_RESIDUAL_COMPOSITION).length!==1||!source.includes('      groundcoverTone*=0.88+0.24*materialVariation;')||source.split('      palette=mix(palette,groundcoverTone,groundcoverWeight);').length!==2)throw Error('FERTILE_PROBE_CONTAMINATION');
 return true;
}
export function instrumentFertileRenderer(source){
 reconstructFertileBaseline(source);
 const observed=instrumentRenderer(transformPublishedRenderer(source,{strictHash:false}).source);
 verifyFertileInstrumentation(observed);
 return observed;
}

export function compareDecodedCoastPair(baseline,candidate){
 for(const image of [baseline,candidate])if(image.width!==529||image.height!==980||image.data?.length!==529*980*4)throw Error('RESIDUAL_COAST_DECODE_INVALID');
 let differingPixels=0;
 for(let i=0;i<baseline.data.length;i+=4)if([0,1,2,3].some(c=>baseline.data[i+c]!==candidate.data[i+c]))differingPixels++;
 if(differingPixels)throw Error('RESIDUAL_COAST_PIXEL_MISMATCH:'+differingPixels);
 return {width:529,height:980,differingPixels};
}
export async function validateResidualCoastPixels(views,outputDir){
 const {PNG}=await import('pngjs');
 const results=[];
 for(const mode of RESIDUAL_MODES){
  const pair=['baseline','candidate'].map(label=>{
   const matches=views.filter(v=>v.label===label&&v.pose.name==='protected-coast'&&v.mode===mode);
   if(matches.length!==1)throw Error('RESIDUAL_COAST_PAIR_MISSING');
   const view=matches[0];if(path.basename(view.image)!==view.image)throw Error('RESIDUAL_COAST_PATH_INVALID');
   const bytes=fs.readFileSync(path.join(outputDir,view.image));
   if(sha(bytes)!==view.imageSha256)throw Error('RESIDUAL_COAST_IMAGE_DRIFT');
   return PNG.sync.read(bytes,{checkCRC:true});
  });
  results.push({mode,...compareDecodedCoastPair(...pair)});
 }
 return {result:'EXACT_DECODED_RGBA_COAST_PARITY',comparisons:results};
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
export function reconstructComposedBaseline(source){
 const pattern=/^[ \t]*\/\/ H_EARTH_GROUNDCOVER_COMPOSED_TARGET_BEGIN\n[\s\S]*?^[ \t]*\/\/ H_EARTH_GROUNDCOVER_COMPOSED_TARGET_END\n/gm;
 if([...source.matchAll(pattern)].length!==1)throw Error('COMPOSED_BLOCK_NOT_UNIQUE');
 const baseline=source.replace(pattern,'');
 if(sha(baseline)!==FOOTPRINT_BASELINE_SHA256)throw Error('COMPOSED_BASELINE_RECONSTRUCTION_MISMATCH');
 return baseline;
}
export function instrumentComposedRenderer(source){
 reconstructComposedBaseline(source);
 return instrumentRenderer(transformPublishedRenderer(source,{strictHash:false}).source);
}
export const ORIGINAL_GROUNDCOVER_FIELD='      // Rotate and softly warp one material sample with resident fields.\n      // This bends cell boundaries without adding geometry or texture reads.\n      float groundcoverDomainX=(0.8*world.x-0.6*world.y)*0.018+5.0+0.65*(broad-0.5);\n      float groundcoverDomainZ=(0.6*world.x+0.8*world.y)*0.018-11.0+0.65*(macroField-0.5);\n      float groundcoverOrganic=noise2(vec2(groundcoverDomainX,groundcoverDomainZ));\n      float groundcoverPatch=smoothstep(\n        0.20,0.66,groundcoverOrganic*0.78+mesoField*0.22\n      );\n';
export function reconstructResidentBaseline(source){
 const pattern=/^[ \t]*\/\/ H_EARTH_GROUNDCOVER_RESIDENT_FIELD_BEGIN\n[\s\S]*?^[ \t]*\/\/ H_EARTH_GROUNDCOVER_RESIDENT_FIELD_END\n/gm;
 if([...source.matchAll(pattern)].length!==1)throw Error('RESIDENT_BLOCK_NOT_UNIQUE');
 const baseline=source.replace(pattern,ORIGINAL_GROUNDCOVER_FIELD);
 if(sha(baseline)!==FOOTPRINT_BASELINE_SHA256)throw Error('RESIDENT_BASELINE_RECONSTRUCTION_MISMATCH');
 return baseline;
}
export function instrumentResidentRenderer(source){
 reconstructResidentBaseline(source);
 return instrumentRenderer(transformPublishedRenderer(source,{strictHash:false}).source);
}
export function instrumentContributionRenderer(source){
 if(sha(source)!==CONTRIBUTION_RENDERER_SHA256)throw Error('CONTRIBUTION_FROZEN_RENDERER_MISMATCH');
 return instrumentResidentRenderer(source);
}
export function validateContributionSet(views){
 validateDiagnosticSet(views,CONTRIBUTION_POSES,CONTRIBUTION_MODES);
 for(const view of views){
  if(view.label!=='candidate'||view.sourceHead!==CONTRIBUTION_SOURCE_HEAD||view.rendererHash!==CONTRIBUTION_RENDERER_SHA256||view.modeId!==MODE_ID_BY_NAME.get(view.mode))throw Error('CONTRIBUTION_SOURCE_OR_MODE_MISMATCH');
  const pose=CONTRIBUTION_POSES.find(p=>p.name===view.pose.name);
  if(JSON.stringify(view.pose)!==JSON.stringify(pose))throw Error('CONTRIBUTION_POSE_DRIFT');
  validateFrame(view,pose,view.state.sequence);
  const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);
  const vegetation=footprintVegetationReadiness(view.resources);
  if(!assets.ready||!vegetation.ready||assets.signature+'|'+vegetation.signature!==normalizeAssetSignature(view.assetSignature))throw Error('CONTRIBUTION_RESOURCE_SIGNATURE_MISMATCH');
 }
 return true;
}
// Only this measured duration is nondeterministic metadata. Missing, malformed,
// negative or non-finite values remain different; all physical fields survive.
export function normalizeVegetationIdentity(identity){
 const copy=structuredClone(identity);
 const repair=copy?.entranceGrass?.slopeRepair;
 if(repair&&Number.isFinite(repair.generationMs)&&repair.generationMs>=0)repair.generationMs=0;
 return copy;
}
export function normalizeAssetSignature(signature){
 const separator=typeof signature==='string'?signature.indexOf('|'):-1;
 if(separator<0)return signature;
 try{
  const vegetation=JSON.parse(signature.slice(separator+1));
  if(vegetation.schema!=='H_EARTH_SINGLE_OWNER_WOODLAND_v1')return signature;
  return signature.slice(0,separator+1)+JSON.stringify(normalizeVegetationIdentity(vegetation));
 }catch{return signature;}
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
export function validateFootprintSet(views,expectedCandidateHead=HEADS.candidate,modes=FOOTPRINT_MODES){
 if(!/^[a-f0-9]{40}$/.test(expectedCandidateHead))throw Error('FOOTPRINT_CANDIDATE_IDENTITY_INVALID');
 const candidateHashes=new Set(views.filter(v=>v.label==='candidate').map(v=>v.rendererHash));
 if(candidateHashes.size!==1||![...candidateHashes].every(h=>/^[a-f0-9]{64}$/.test(h)&&h!==FOOTPRINT_BASELINE_SHA256))throw Error('FOOTPRINT_CANDIDATE_HASH_INVALID');
 if(views.length!==2*FOOTPRINT_POSES.length*modes.length)throw Error('FOOTPRINT_INCOMPLETE');
 for(const pose of FOOTPRINT_POSES)for(const mode of modes){
   const pair=views.filter(v=>v.pose.name===pose.name&&v.mode===mode);
   if(pair.length!==2||!['baseline','candidate'].every(label=>pair.filter(v=>v.label===label).length===1))throw Error('FOOTPRINT_PAIR_MISSING');
   for(const v of pair){if(v.sourceHead!==(v.label==='baseline'?FOOTPRINT_BASELINE_HEAD:expectedCandidateHead)||v.modeId!==MODE_ID_BY_NAME.get(mode)||v.diagnosticApplied!==v.modeId||v.grassHidden!==(mode!=='reference-lit')||(v.label==='baseline'&&v.rendererHash!==FOOTPRINT_BASELINE_SHA256))throw Error('FOOTPRINT_SOURCE_OR_MODE_MISMATCH');}
   const [a,b]=pair;
   if(normalizeAssetSignature(a.assetSignature)!==normalizeAssetSignature(b.assetSignature)||JSON.stringify(a.lastFrame.cameraPosition)!==JSON.stringify(b.lastFrame.cameraPosition)||a.grassHidden!==b.grassHidden)throw Error('FOOTPRINT_PAIR_MISMATCH');
 }
 return true;
}
export function validateComposedSet(views,expectedCandidateHead=HEADS.candidate){
 validateFootprintSet(views,expectedCandidateHead,COMPOSED_MODES);
 for(const view of views){
  const pose=FOOTPRINT_POSES.find(p=>p.name===view.pose.name);
  validateFrame(view,pose,view.state.sequence);
  if(JSON.stringify(view.pose)!==JSON.stringify(pose))throw Error('COMPOSED_POSE_DRIFT');
  // The immutable baseline manifest intentionally stores the full signature,
  // not redundant resource objects. Candidate receipts retain both for readback.
  if(view.label==='candidate'){
   const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);
   const vegetation=footprintVegetationReadiness(view.resources);
   if(!assets.ready||!vegetation.ready||assets.signature+'|'+vegetation.signature!==normalizeAssetSignature(view.assetSignature))throw Error('COMPOSED_RESOURCE_SIGNATURE_MISMATCH');
  }
 }
 return true;
}
export function validateResidualSet(views,expectedCandidateHead,expectedRendererHash){
 validateComposedSet(views,expectedCandidateHead);
 if(!/^[a-f0-9]{64}$/.test(expectedRendererHash)||views.some(v=>v.label==='candidate'&&v.rendererHash!==expectedRendererHash))throw Error('RESIDUAL_CANDIDATE_HASH_MISMATCH');
 if(views.filter(v=>v.label==='candidate').length!==8||views.filter(v=>v.label==='baseline').length!==8)throw Error('RESIDUAL_FRAME_SET_INVALID');
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
export const PRESERVED_CONTRIBUTION_EVIDENCE_PATHS=Object.freeze(["h-earth-3d/evidence/groundcover-contribution-ledger-20261028/README.md","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/admission-receipt.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/analysis-plan.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/analyze-capture.py","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/construction-procedure.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/independent-recovery-review.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/operation-request.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/reconstructed-repair-proposal.md","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/recovered-analysis/analysis-rows.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/recovered-analysis/analysis.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/recovery-authority-readback.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/recovery-continuity-input.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/recovery-continuity.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/recovery-main-delta-review.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/recovery-source-tests.txt","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-far-after-groundcover-unlit.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-far-before-groundcover-unlit.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-far-groundcover-tone-color.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-far-groundcover-weight-raw.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-near-after-groundcover-unlit.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-near-before-groundcover-unlit.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-near-groundcover-tone-color.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/candidate-inland-seam-near-groundcover-weight-raw.png","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/receipt.json.gz","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/source-review.json","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/source-tests.txt","h-earth-3d/evidence/groundcover-contribution-ledger-20261028/test-analysis.py"]);
export const RESIDUAL_EVIDENCE_PATHS=Object.freeze(["h-earth-3d/evidence/groundcover-residual-transfer-20261028/operation-request.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/construction-procedure.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/repair-contract.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/comparison-manifest.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/admission-receipt.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/source-reconstruction-receipt.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/source-tests.txt","h-earth-3d/evidence/groundcover-residual-transfer-20261028/independent-source-review.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/dispatch-intent.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/launch-receipt.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/capture-receipt.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/evidence-manifest.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/comparison-report.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/independent-evidence-review.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/owner-disposition.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/continuation.json","h-earth-3d/evidence/groundcover-residual-transfer-20261028/README.md","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-inland-seam-near-reference-lit.png","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-inland-seam-near-after-groundcover-unlit.png","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-inland-seam-far-reference-lit.png","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-inland-seam-far-after-groundcover-unlit.png","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-protected-meadow-reference-lit.png","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-protected-meadow-after-groundcover-unlit.png","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-protected-coast-reference-lit.png","h-earth-3d/evidence/groundcover-residual-transfer-20261028/candidate-protected-coast-after-groundcover-unlit.png","h-earth-3d/experience-anchor/receipts/groundcover-residual-transfer-20261028.acceptance.json"]);
export const PRESERVED_IDENTITY_EVIDENCE_PATHS=Object.freeze(["h-earth-3d/evidence/identity-blend-diagnostic-20261028/README.md","h-earth-3d/evidence/identity-blend-diagnostic-20261028/admission-receipt.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/analysis-plan.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/analysis.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/analyze-capture.py","h-earth-3d/evidence/identity-blend-diagnostic-20261028/archive-custody.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/capture-verification.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/construction-procedure.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/continuation.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/diagnostic-contract.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/dispatch-intent.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/glsl-compile-receipt.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/independent-measurement-review.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/independent-source-review.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/launch-receipt.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/mechanism-analysis.py","h-earth-3d/evidence/identity-blend-diagnostic-20261028/mechanism-evidence.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/operation-request.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/packet-receipt.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/predecessor-closure-receipt.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/reference/candidate-inland-seam-near-after-identity.png","h-earth-3d/evidence/identity-blend-diagnostic-20261028/reference/candidate-inland-seam-near-after-soil.png","h-earth-3d/evidence/identity-blend-diagnostic-20261028/reference/receipt.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/router-receipt.json","h-earth-3d/evidence/identity-blend-diagnostic-20261028/test-analysis.py"]);
export function assertSceneParity(baselineDir,candidateDir,{residual=false,fertile=false}={}){
 const manifest=dir=>execFileSync('git',['-C',dir,'ls-tree','-r','HEAD','--','showroom/globe/h-earth','h-earth-3d'],{encoding:'utf8',maxBuffer:16*1024*1024}).split('\n').filter(line=>{
   const p=line.split('\t')[1]??'';
   return p&&p!==RENDERER.slice(1)&&!((residual||fertile)&&(PRESERVED_CONTRIBUTION_EVIDENCE_PATHS.includes(p)||RESIDUAL_EVIDENCE_PATHS.includes(p)))&&!(fertile&&(PRESERVED_IDENTITY_EVIDENCE_PATHS.includes(p)||p.startsWith('h-earth-3d/evidence/identity-fertile-transition-20261028/')||p==='h-earth-3d/experience-anchor/receipts/identity-fertile-transition-20261028.acceptance.json'))&&!p.startsWith('h-earth-3d/evidence/groundcover-resident-field-20261028/')&&p!=='h-earth-3d/experience-anchor/receipts/groundcover-resident-field-20261028.json'&&!p.startsWith('h-earth-3d/evidence/groundcover-composed-target-20261028/')&&p!=='h-earth-3d/experience-anchor/receipts/groundcover-composed-target-20261028.json'&&!p.startsWith('h-earth-3d/evidence/groundcover-footprint-continuity-20261028/')&&p!=='h-earth-3d/experience-anchor/receipts/groundcover-footprint-continuity-20261028.json';
 }).join('\n');
 const a=manifest(baselineDir),b=manifest(candidateDir);
 if(!a||a!==b)throw Error('FOOTPRINT_SCENE_SOURCE_DRIFT');
 return {result:'EXACT_SCENE_TREE_PARITY_EXCEPT_DECLARED_RENDERER_AND_EVIDENCE',manifestSha256:sha(a)};
}
export function footprintVegetationReadiness(resources){
 const r=resources?.singleOwnerVegetation;
 if(!r)return {ready:false,signature:'SINGLE_OWNER_PENDING'};
 if(r.disposed||r.allocationGlError||r.uploadGlError)throw Error('FOOTPRINT_VEGETATION_UPLOAD_FAILED');
 const keys=['schema','installedRootCount','originalRootCount','rootOwnerCount','gpuAllocationVerified','gpuUploadCount','gpuUploadedBytes','gpuAllocatedBytes','gpuRequestedBytes','gpuObservedBufferBytes','entranceGrass','allocationGlError','uploadGlError','disposed','tileCount','controlRoots'];
 const ready=r.schema==='H_EARTH_SINGLE_OWNER_WOODLAND_v1'&&r.rootOwnerCount===1&&r.gpuAllocationVerified===true&&Number.isInteger(r.installedRootCount)&&r.installedRootCount>0&&r.gpuUploadCount>0&&r.disposed===false&&r.gpuRequestedBytes===r.installedRootCount*16&&r.gpuObservedBufferBytes===r.gpuRequestedBytes&&r.gpuAllocatedBytes===r.gpuRequestedBytes&&r.gpuUploadedBytes===r.gpuRequestedBytes&&r.allocationGlError===0&&r.uploadGlError===0;
 return {ready,signature:JSON.stringify(normalizeVegetationIdentity(Object.fromEntries(keys.map(k=>[k,r[k]]))))};
}
export function assertCheckout(dir,expected){const head=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==expected)throw Error('CHECKOUT_HEAD_MISMATCH');if(execFileSync('git',['-C',dir,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim())throw Error('CHECKOUT_TRACKED_BYTES_CHANGED');}
export function parseArgs(argv){const a={};for(let i=0;i<argv.length;i+=2){if(!['--baseline-dir','--candidate-dir','--output'].includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('CLI_NOT_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}if(Object.keys(a).length!==3)throw Error('CLI_INCOMPLETE');if(contributionCapture||identityCapture||worldCapture){if(a['--baseline-dir']!==a['--candidate-dir']||a['--output']===a['--candidate-dir'])throw Error('CONTRIBUTION_REQUIRES_ONE_FROZEN_SCENE_AND_DISTINCT_OUTPUT');}else if(new Set(Object.values(a)).size!==3)throw Error('DIRECTORIES_NOT_DISTINCT');return a;}
export async function run(argv){
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const profile=process.env.H_EARTH_COMPARISON_PROFILE||'FACTOR_18_V1';
  if(!['FACTOR_18_V1','MAPWIDE_SCOUT_V1','MAPWIDE_CANDIDATE_V1','GROUNDCOVER_FOOTPRINT_V1','GROUNDCOVER_COMPOSED_TARGET_V1','GROUNDCOVER_RESIDENT_FIELD_V1','GROUNDCOVER_CONTRIBUTION_LEDGER_V1','GROUNDCOVER_RESIDUAL_TRANSFER_V1','IDENTITY_BLEND_DIAGNOSTIC_V1','IDENTITY_FERTILE_TRANSITION_V1','WORLD_POSITION_DIAGNOSTIC_V1'].includes(profile))throw Error('COMPARISON_PROFILE_NOT_REGISTERED');
  const poses=worldCapture?WORLD_POSES:identityCapture?IDENTITY_POSES:contributionCapture?CONTRIBUTION_POSES:pairedCapture?FOOTPRINT_POSES:profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_POSES:DIAGNOSTIC_POSES;
  const modes=worldCapture?WORLD_MODES:identityCapture?IDENTITY_MODES:contributionCapture?CONTRIBUTION_MODES:(composedCapture||residentCapture||residualCapture||fertileCapture)?COMPOSED_MODES:footprintCapture?FOOTPRINT_MODES:profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_MODES:DIAGNOSTIC_MODES;
  if(residualCapture&&poses.length*modes.length!==8)throw Error('RESIDUAL_FRAME_CAP_INVALID');
  if(poses.length*modes.length>20)throw Error('DIAGNOSTIC_FRAME_CAP_EXCEEDED');
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,profile,poses,modes,repairOperationId:'H_EARTH_GROUNDCOVER_BAND_CONTINUITY_REPAIR_20261026_001',baselineProductSha256:RENDERER_SHA256,diagnosticOnly:true,searchProvenance:SEARCH_PROVENANCE,stageMeanings:DIAGNOSTIC_STAGE_MEANINGS,sourceProductSha256:RENDERER_SHA256,colorTransform:'ORIGINAL_EXPOSURE_1.12_AND_GAMMA_1_OVER_2.2_EXCEPT_RAW_COVERAGE_MODE',viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,views:[],runs:[],errors:[]};
  if(pairedCapture)Object.assign(receipt,{repairOperationId:'H_EARTH_GROUNDCOVER_FOOTPRINT_CONTINUITY_20261028_001',baselineProductSha256:FOOTPRINT_BASELINE_SHA256,searchProvenance:{kind:'REUSE_ARCHIVED_SOURCE_PROVEN_INLAND_BAND_AND_HEALTHY_CONTROLS',exactScreenshotMatchProven:false,priorStageAttributionRun:40411050366},stageMeanings:{'reference-lit':'Unchanged final lighting with physical vegetation visible','after-groundcover-unlit':'Composed groundcover albedo; physical vegetation hidden','footprint-activation-raw':'Linear raw filter activation (zero means hypothesis not exercised)'},filterHypothesisProven:false});
  if(composedCapture)Object.assign(receipt,{repairOperationId:'H_EARTH_GROUNDCOVER_COMPOSED_TARGET_20261028_001',stageMeanings:{'reference-lit':'Original final lighting, physical vegetation visible','after-groundcover-unlit':'Actual composed-target albedo, physical vegetation hidden'},composedHypothesisProven:false});
  if(residentCapture)Object.assign(receipt,{repairOperationId:'H_EARTH_GROUNDCOVER_RESIDENT_FIELD_20261028_001',stageMeanings:{'reference-lit':'Original final lighting, physical vegetation visible','after-groundcover-unlit':'Resident-field groundcover albedo, physical vegetation hidden'},residentFieldHypothesisProven:false});
  if(fertileCapture)Object.assign(receipt,{repairOperationId:'H_EARTH_IDENTITY_FERTILE_TRANSITION_20261028_001',noBaselineCapture:true,candidateFrameLimit:8,baselineProductSha256:FOOTPRINT_BASELINE_SHA256,stageMeanings:{'reference-lit':'Actual fertile-transition candidate with unchanged lighting and physical vegetation visible','after-groundcover-unlit':'Actual fertile-transition candidate albedo with physical vegetation hidden'},fertileHypothesisProven:false});
  if(residualCapture)Object.assign(receipt,{repairOperationId:'H_EARTH_GROUNDCOVER_RESIDUAL_TRANSFER_20261028_001',noBaselineCapture:true,candidateFrameLimit:8,stageMeanings:{'reference-lit':'Actual residual-transfer candidate with unchanged lighting and physical vegetation visible','after-groundcover-unlit':'Actual residual-transfer candidate albedo with physical vegetation hidden'},residualHypothesisProven:false});
  if(contributionCapture)Object.assign(receipt,{heads:{candidate:CONTRIBUTION_SOURCE_HEAD},repairOperationId:'H_EARTH_GROUNDCOVER_CONTRIBUTION_LEDGER_20261028_001',baselineProductSha256:null,sourceProductSha256:CONTRIBUTION_RENDERER_SHA256,noBaselineCapture:true,searchProvenance:{kind:'REUSE_FROZEN_RESIDENT_FIELD_NEAR_FAR_POSES',exactScreenshotMatchProven:false,sourceDisposition:'REJECTED_CANDIDATE_DIAGNOSTIC_ONLY',priorResidentRun:40734434775},stageMeanings:{'before-groundcover-unlit':'Incoming soil albedo before the groundcover mix','groundcover-tone-color':'Existing target tone before the groundcover mix','groundcover-weight-raw':'Original linear groundcover weight (no exposure or gamma)','after-groundcover-unlit':'Actual result of the groundcover mix'},contributionAttributionProven:false});
  if(identityCapture)Object.assign(receipt,{heads:{candidate:IDENTITY_SOURCE_HEAD},repairOperationId:'H_EARTH_IDENTITY_BLEND_DIAGNOSTIC_20261028_001',baselineProductSha256:null,sourceProductSha256:IDENTITY_RENDERER_SHA256,noBaselineCapture:true,frameCap:20,performanceClaims:false,measuredSubmissionsPerMode:1,settledFramesPerMode:2,colorTransform:'P_C_T_ORIGINAL_EXPOSURE_1.12_GAMMA_1_OVER_2.2_OTHER_CHANNELS_RAW',stageMeanings:Object.fromEntries(IDENTITY_MODES.map((m,i)=>[m,i<3?'Environmental identity boundary linear color encoded with original exposure/gamma':'Raw packed identity factors; see diagnostic-contract.json'])),searchProvenance:{kind:'FROZEN_APPROVED_NEAR_FAR_IDENTITY_INTERNALS',exactScreenshotMatchProven:false},contributionAttributionProven:false});
  if(worldCapture)Object.assign(receipt,{schema:'H_EARTH_WORLD_POSITION_CAPTURE_v1',heads:{candidate:IDENTITY_SOURCE_HEAD},repairOperationId:'H_EARTH_WORLD_POSITION_DIAGNOSTIC_20261028_001',sourceProductSha256:IDENTITY_RENDERER_SHA256,baselineProductSha256:null,noBaselineCapture:true,frameCap:8,runBudget:1,automaticRetry:false,performanceClaims:false,measuredSubmissionsPerMode:1,encoding:WORLD_ENCODING,colorTransform:'RAW_RGB_OPAQUE_ALPHA_NO_GAMMA_NO_EXPOSURE',calibrationRegion:{x:0,y:979,width:16,height:1,origin:'PNG_TOP_LEFT'},stageMeanings:Object.fromEntries(WORLD_MODES.map(m=>[m,'Encoded interpolated highp terrain scalar'])),searchProvenance:{kind:'FROZEN_APPROVED_NEAR_FAR_WORLD_COORDINATES',exactScreenshotMatchProven:false}});
  const persist=()=>{fs.writeFileSync(out+'/receipt.tmp',JSON.stringify(receipt,null,2)+'\n');fs.renameSync(out+'/receipt.tmp',out+'/receipt.json');};
  let browser=null,server=null;
  const interrupt=signal=>{receipt.result='INTERRUPTED';receipt.errors.push(signal);persist();server?.kill();process.exit(signal==='SIGTERM'?143:130);};
  const onTerm=()=>interrupt('SIGTERM'),onInt=()=>interrupt('SIGINT');
  process.once('SIGTERM',onTerm);process.once('SIGINT',onInt);persist();
  try{
    if(worldCapture||identityCapture){
      assertCheckout(a['--candidate-dir'],IDENTITY_SOURCE_HEAD);
      const frozenRenderer=fs.readFileSync(path.join(a['--candidate-dir'],RENDERER),'utf8');(worldCapture?instrumentWorldRenderer:instrumentIdentityRenderer)(frozenRenderer);
      receipt.sceneIdentity={result:'EXACT_FROZEN_SCENE_IDENTITY_NO_BASELINE_RENDER',sourceHead:IDENTITY_SOURCE_HEAD,rendererSha256:sha(frozenRenderer),toolingHead:execFileSync('git',['-C',path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),'rev-parse','HEAD'],{encoding:'utf8'}).trim()};persist();
    }else if(contributionCapture){
      assertCheckout(a['--candidate-dir'],CONTRIBUTION_SOURCE_HEAD);
      const frozenRenderer=fs.readFileSync(path.join(a['--candidate-dir'],RENDERER),'utf8');
      instrumentContributionRenderer(frozenRenderer);
      receipt.sceneIdentity={result:'EXACT_FROZEN_SCENE_IDENTITY_NO_BASELINE_RENDER',sourceHead:CONTRIBUTION_SOURCE_HEAD,rendererSha256:sha(frozenRenderer),toolingHead:execFileSync('git',['-C',path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),'rev-parse','HEAD'],{encoding:'utf8'}).trim(),independentBaselineParityClaimed:false};persist();
    }else for(const label of Object.keys(HEADS))assertCheckout(a['--'+label+'-dir'],HEADS[label]);
    if(pairedCapture){receipt.sceneParity=assertSceneParity(a['--baseline-dir'],a['--candidate-dir'],{residual:residualCapture,fertile:fertileCapture});const archive=preservedFootprintBaseline(a['--candidate-dir'],out);receipt.views.push(...archive.views.filter(v=>modes.includes(v.mode)).map(v=>({...v,inheritedFromRun:archive.sourceRun})));receipt.runs.push({label:'baseline',head:FOOTPRINT_BASELINE_HEAD,inheritedFromRun:archive.sourceRun,manifestSha256:FOOTPRINT_ARCHIVE_SHA256,completedAt:archive.baselineCompletedAt,errors:[]});persist();}
    if(residualCapture||fertileCapture){const {PNG}=await import('pngjs');if(typeof PNG?.sync?.read!=='function')throw Error('RESIDUAL_PNG_DECODER_UNAVAILABLE');}
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of ['candidate'].entries()){
      const dir=a['--'+label+'-dir'],port=18767+index,base='http://127.0.0.1:'+port;
      const runRecord={label,head:HEADS[label],errors:[],instrumentation:[],startedAt:new Date().toISOString()};receipt.runs.push(runRecord);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      const serverError=[];server.on('error',e=>serverError.push(e.message));
      let listening=false;for(let n=0;n<50;n++){try{const r=await fetch(base+ROOT);if(r.ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SERVER_UNAVAILABLE:'+serverError.join(';'));
      const context=await browser.newContext({viewport:{width:540,height:1000},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(30000);
      await page.addInitScript({content:'globalThis.__groundcoverFactorMode=0;globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';globalThis.normalizeVegetationIdentity='+normalizeVegetationIdentity.toString()+';globalThis.__footprintVegetationReadiness='+footprintVegetationReadiness.toString()+';' });
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,worldCapture?instrumentWorldRenderer:identityCapture?instrumentIdentityRenderer:fertileCapture?instrumentFertileRenderer:residualCapture?instrumentResidualRenderer:contributionCapture?instrumentContributionRenderer:residentCapture?instrumentResidentRenderer:composedCapture?instrumentComposedRenderer:footprintCapture?(source=>instrumentFootprintRenderer(source,{baseline:label==='baseline'})):profile==='MAPWIDE_CANDIDATE_V1'?instrumentCandidateRenderer:instrumentDiagnosticRenderer]]){
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
        const hidden=!(pairedCapture&&mode==='reference-lit');await page.evaluate(value=>{globalThis.__groundcoverFactorMode=value;},MODE_ID_BY_NAME.get(mode));
        const settleDeadline=Date.now()+180000;let stable=0,signature=null;
        while(stable<2){
          const settled=await page.evaluate(async({pose,hidden,sequence,footprint})=>{
            globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON_SETTLE');
            globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
            const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');const expected=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});const asset=globalThis.__groundAssetReadiness(gpu.resources,expected.camera.position);if(footprint){const vegetation=globalThis.__footprintVegetationReadiness(gpu.resources);asset.ready=asset.ready&&vegetation.ready;asset.signature+='|'+vegetation.signature;}return {asset,frame:gpu.frameRecords.at(-1)};
          },{pose,hidden,sequence:sequence+1,footprint:resourceCapture});
          receipt.lastSettle={label,pose,...settled};persist();
          stable=settled.frame.navigationSequence===sequence+1&&settled.asset.ready&&settled.asset.signature===signature?stable+1:0;signature=settled.asset.signature;
          if(Date.now()>settleDeadline)throw Error('ASSETS_NOT_SETTLED');
          if(stable<2)await new Promise(r=>setTimeout(r,250));
        }

        const view=await page.evaluate(async({pose,hidden,sequence,measureGpu,submissionCount})=>{
          globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON');
          globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
          const costs=[],finishedCosts=[];const timingGl=document.querySelector('#h-earth-functional-landscape-canvas')?.getContext('webgl2');for(let i=0;i<submissionCount;i++){const t=performance.now();globalThis.__HEarthAuditPresent(state);costs.push(performance.now()-t);if(measureGpu){timingGl.finish();finishedCosts.push(performance.now()-t);}await new Promise(requestAnimationFrame);}
          const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');
          const expectedPacket=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});
          return {state,expectedCameraPosition:expectedPacket.camera.position,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,softwareGpuFinishMilliseconds:finishedCosts,resources:gpu.resources,grassHidden:hidden,diagnosticApplied:globalThis.__groundcoverFactorModeApplied,worldPacket:globalThis.__preciseWorldEnabled?expectedPacket:null,worldActualPacket:globalThis.__preciseWorldActualPacket??null};
        },{pose,hidden,sequence:++sequence,measureGpu:resourceCapture,submissionCount:worldCapture?1:identityCapture?1:12});
        receipt.lastAttempt={label,pose,mode,...view};persist();
        if(view.diagnosticApplied!==MODE_ID_BY_NAME.get(mode))throw Error('DIAGNOSTIC_MODE_NOT_APPLIED');
        const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);if(resourceCapture){const vegetation=footprintVegetationReadiness(view.resources);assets.ready=assets.ready&&vegetation.ready;assets.signature+='|'+vegetation.signature;}if(!assets.ready||assets.signature!==signature)throw Error('ASSETS_CHANGED_DURING_CAPTURE');view.assetSignature=assets.signature;
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+mode+'.png';const capture=await page.evaluate(()=>{const canvas=document.querySelector('#h-earth-functional-landscape-canvas');const gl=canvas?.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('CAPTURE_CONTEXT_NOT_PRESERVED');const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);const dataUrl=canvas.toDataURL('image/png');const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {dataUrl,before,after};});const bytes=decodeCanvasCapture(capture,view.lastFrame);fs.writeFileSync(path.join(out,name),bytes);
        if(worldCapture){const {PNG}=await import('pngjs');const png=PNG.sync.read(bytes);view.worldData=validateWorldPixels(png,MODE_ID_BY_NAME.get(mode));}
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        if(footprintCapture&&mode==='footprint-activation-raw'){view.activationSamples=await page.evaluate(()=>{const c=document.querySelector('#h-earth-functional-landscape-canvas'),gl=c.getContext('webgl2'),out=[];for(const y of [260,270,280,290,300])for(const x of [240,264,288]){const p=new Uint8Array(4);gl.readPixels(x,c.height-1-y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);out.push({x,y,rgba:[...p]});}return out;});}
        receipt.views.push({label,pose,mode,instrumentation:runRecord.instrumentation,...view,modeId:MODE_ID_BY_NAME.get(mode),sourceHead:HEADS[label],rendererHash:receipt.sourceProductSha256,captureMethod:'PRESERVED_WEBGL_CANVAS_PNG',imageWidth:529,imageHeight:980,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    if(worldCapture)validateWorldSet(receipt.views);else if(identityCapture)validateIdentitySet(receipt.views);else if(residualCapture||fertileCapture)validateResidualSet(receipt.views,HEADS.candidate,receipt.sourceProductSha256);else if(contributionCapture)validateContributionSet(receipt.views);else if(composedCapture||residentCapture)validateComposedSet(receipt.views);else if(footprintCapture)validateFootprintSet(receipt.views);else validateDiagnosticSet(receipt.views,poses,modes);
    if(residualCapture||fertileCapture)receipt.coastPixelParity=await validateResidualCoastPixels(receipt.views,out);
    receipt.result=worldCapture?'WORLD_POSITION_CAPTURE_COMPLETE_CALIBRATED_ANALYSIS_PENDING':fertileCapture?'FERTILE_CAPTURE_COMPLETE_COAST_PARITY_VERIFIED_VISUAL_REVIEW_PENDING':identityCapture?'IDENTITY_CAPTURE_COMPLETE_ANALYSIS_PENDING':residualCapture?'RESIDUAL_CAPTURE_COMPLETE_COAST_PARITY_VERIFIED_VISUAL_REVIEW_PENDING':contributionCapture?'CONTRIBUTION_LEDGER_CAPTURE_COMPLETE_ANALYSIS_PENDING':residentCapture?'RESIDENT_FIELD_CAPTURE_COMPLETE_VISUAL_REVIEW_PENDING':composedCapture?'COMPOSED_CAPTURE_COMPLETE_VISUAL_REVIEW_PENDING':footprintCapture?'FOOTPRINT_CAPTURE_COMPLETE_VISUAL_AND_ACTIVATION_REVIEW_PENDING':'DIAGNOSTIC_CAPTURE_COMPLETE_FACTOR_REVIEW_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',onTerm);process.removeListener('SIGINT',onInt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});


export function validateWorldPixels(png,mode){
 if(png.width!==529||png.height!==980||png.data.length!==529*980*4)throw Error('WORLD_IMAGE_DIMENSIONS');
 const offset=(980-1)*529*4,calibration=[...png.data.subarray(offset,offset+64)];validateCalibration(calibration,mode);
 let valid=0,invalid=0,min=Infinity,max=-Infinity;const mask=Buffer.alloc(529*980);
 for(let y=0;y<980;y++)for(let x=0;x<529;x++){
  if(y===979&&x<16)continue;
  const i=y*529+x,d=decodeWorld([...png.data.subarray(i*4,i*4+4)],mode);
  if(!d.valid){if(d.reason!=='NON_TERRAIN')throw Error('WORLD_TERRAIN_OUT_OF_RANGE');invalid++;continue;}
  valid++;mask[i]=1;min=Math.min(min,d.value);max=Math.max(max,d.value);
 }
 if(!valid)throw Error('WORLD_NO_TERRAIN');
 return {calibration,calibrationVerified:true,validPixels:valid,invalidPixels:invalid,min,max,terrainMaskSha256:sha(mask)};
}
export function validateWorldSet(views){
 if(views.length!==8)throw Error('WORLD_FRAME_CAP');
 for(const pose of WORLD_POSES){
  const group=views.filter(v=>v.pose?.name===pose.name),ref=group[0];if(group.length!==4)throw Error('WORLD_POSE_COUNT');
  for(const [index,mode] of WORLD_MODES.entries()){
   const matches=group.filter(v=>v.mode===mode);if(matches.length!==1)throw Error('WORLD_MODE_SET');const v=matches[0];
   if(v.label!=='candidate'||v.sourceHead!==IDENTITY_SOURCE_HEAD||v.rendererHash!==IDENTITY_RENDERER_SHA256||v.modeId!==index||v.diagnosticApplied!==index||!v.grassHidden)throw Error('WORLD_SOURCE_OR_MODE');
   if(JSON.stringify(v.pose)!==JSON.stringify(pose)||JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition)||normalizeAssetSignature(v.assetSignature)!==normalizeAssetSignature(ref.assetSignature))throw Error('WORLD_POSE_OR_ASSET_DRIFT');
   validateFrame(v,pose,v.state.sequence);
   const assets=assetReadiness(v.resources,v.lastFrame.cameraPosition),vegetation=footprintVegetationReadiness(v.resources);
   if(!assets.ready||!vegetation.ready||assets.signature+'|'+vegetation.signature!==normalizeAssetSignature(v.assetSignature))throw Error('WORLD_RESOURCE_SIGNATURE');
   if(v.cpuSubmitMilliseconds?.length!==1||v.softwareGpuFinishMilliseconds?.length!==1)throw Error('WORLD_SUBMISSION_COUNT');
   if(!v.worldActualPacket||JSON.stringify(v.worldActualPacket.camera)!==JSON.stringify(v.worldPacket?.camera)||v.worldActualPacket.mode!==index||v.worldActualPacket.viewport?.width!==529||v.worldActualPacket.viewport?.height!==980)throw Error('WORLD_ACTUAL_MATRIX_MISMATCH');
   if(!v.worldPacket||JSON.stringify(v.worldPacket.camera)!==JSON.stringify(ref.worldPacket.camera)||JSON.stringify(v.worldPacket.viewport)!==JSON.stringify(ref.worldPacket.viewport))throw Error('WORLD_MATRIX_DRIFT');
   if(!v.worldData?.calibrationVerified||v.worldData.validPixels<1||v.worldData.terrainMaskSha256!==ref.worldData.terrainMaskSha256)throw Error('WORLD_PIXEL_CUSTODY');
   validateCalibration(v.worldData.calibration,index);
  }
 }
 return true;
}
