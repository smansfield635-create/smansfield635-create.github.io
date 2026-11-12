// Gen3237 first-party native source/preview bridge. Character-only; original R63 remains immutable.
import {createHash} from 'node:crypto';
import {construct} from './v6-articulated-forequarter.v1.mjs';
import {verifyCandidate,patchBoundary} from './v6-articulated-independent-verifier.v1.mjs';

export const ACCEPTED_R63_SHA256='afb4727e1027e88535e7f18dcd6caaf792b8779b113b7b5ffac663fe057d21fd';
export const GEN3237_OPERATION='GENEROSITY_HARVEST_V6_ARTICULATED_CHARACTER_ONLY_20261112_001';
export const GEN3237_BRANCH='characters/gh-gen3237-articulated-forequarter';
export const R63_FACE_COUNTS=Object.freeze({sourceFaces:2508,keptFaces:2089,retiredFaces:419,collarEdges:21});
export const ACCEPTED_R63_RETIREMENT_MASK_SHA256='986ae211675c21840954f7aac6a88ece16afdf8773797d459fdf8e416536a836';
export const SOURCE_ANCHOR_FACES=Object.freeze({scapula:2245,axilla:2227,upperArm:2444,elbow:2451,forearm:2425,paw:2412});

export function verifySourceBytes(rawBytes,expectedDigest=ACCEPTED_R63_SHA256){
 if(!Buffer.isBuffer(rawBytes)&&typeof rawBytes!=='string'&&!(rawBytes instanceof Uint8Array))throw Error('R63_RAW_BYTES_REQUIRED');
 if(!/^[0-9a-f]{64}$/.test(expectedDigest))throw Error('R63_DIGEST_INVALID');
 const observed=createHash('sha256').update(rawBytes).digest('hex');
 if(observed!==expectedDigest)throw Error('R63_SOURCE_SHA256_MISMATCH:'+observed);
 return {result:'EXACT_SOURCE_BYTES_VERIFIED',sha256:observed};
}
function assertNormalized(mesh){
 if(!mesh||!Array.isArray(mesh.vertices)||!Array.isArray(mesh.faces))throw Error('FIRST_PARTY_NATIVE_MESH_EXTRACTION_REQUIRED');
 if(mesh.vertices.some(v=>!Array.isArray(v)||v.length!==3||v.some(x=>!Number.isFinite(x))))throw Error('NATIVE_MESH_XYZ_INVALID');
 if(mesh.faces.some(f=>!Number.isInteger(f.id)||!Array.isArray(f.indices)||f.indices.length!==3||f.indices.some(i=>!Number.isInteger(i)||i<0||i>=mesh.vertices.length)))throw Error('NATIVE_TRIANGLE_SOURCE_IDS_INVALID');
 if(new Set(mesh.faces.map(f=>f.id)).size!==mesh.faces.length)throw Error('NATIVE_SOURCE_FACE_IDS_NOT_UNIQUE');
 return mesh;
}
// Exact accepted private R63 schema: weld only logical geometry for testing;
// retain the 1,963 original render vertices, UV seams, sourceMap and transactions.
export function extractAcceptedR63Native(original){
 if(original?.schema!=='DGB_FRAME52_PRIVATE_SCULPT_TOPOLOGY_SNAPSHOT_V2'||original.acceptedRevision!==63||original.transactions?.length!==63)
  throw Error('ACCEPTED_R63_NATIVE_SCHEMA_OR_REVISION_INVALID');
 const m=original.mesh;
 if(!m||m.positions?.length!==5889||m.indices?.length!==7524||m.uv?.length!==3926||m.logical?.length!==1963||m.groups?.length!==1652||m.sourceMap?.length!==1963)
  throw Error('ACCEPTED_R63_NATIVE_ARRAY_CARDINALITY_INVALID');
 const rawPositions=Array.from({length:1963},(_,i)=>m.positions.slice(3*i,3*i+3));
 const seen=new Set();
 const vertices=m.groups.map((group,logicalId)=>{
  if(!Array.isArray(group)||!group.length)throw Error('EMPTY_LOGICAL_WELD_GROUP:'+logicalId);
  const first=rawPositions[group[0]];
  if(!first||!first.every(Number.isFinite))throw Error('INVALID_LOGICAL_SOURCE_VERTEX');
  for(const i of group){
   if(!Number.isInteger(i)||i<0||i>=1963||seen.has(i)||m.logical[i]!==logicalId)throw Error('R63_LOGICAL_SEAM_MAP_INCONSISTENT');
   if(rawPositions[i].some((x,k)=>x!==first[k]))throw Error('R63_WELD_GROUP_XYZ_DIVERGED');
   seen.add(i);
  }
  return first.slice();
 });
 if(seen.size!==1963)throw Error('R63_LOGICAL_SEAM_MAP_INCOMPLETE');
 const faces=Array.from({length:2508},(_,id)=>{
  const rawIndices=m.indices.slice(3*id,3*id+3);
  if(rawIndices.some(i=>!Number.isInteger(i)||i<0||i>=1963))throw Error('R63_RAW_TRIANGLE_INVALID:'+id);
  const indices=rawIndices.map(i=>m.logical[i]);
  if(new Set(indices).size!==3)throw Error('R63_LOGICAL_TRIANGLE_COLLAPSED:'+id);
  return {id,indices,rawIndices};
 });
 return assertNormalized({vertices,faces,rawToLogical:m.logical.slice(),seamGroups:m.groups.map(g=>g.slice()),
  nativeUV:m.uv.slice(),nativeSourceMap:m.sourceMap.slice()});
}
export function createAcceptedR63Manifest(source,retiredFaceIds){
 if(!Array.isArray(retiredFaceIds)||retiredFaceIds.length!==419||retiredFaceIds.some(i=>!Number.isInteger(i)||i<0||i>=2508)||new Set(retiredFaceIds).size!==419)
  throw Error('R63_RETIREMENT_ID_SET_INVALID');
 const sorted=[...retiredFaceIds].sort((a,b)=>a-b);
 const digest=createHash('sha256').update(JSON.stringify(sorted)).digest('hex');
 if(digest!==ACCEPTED_R63_RETIREMENT_MASK_SHA256)throw Error('R63_RETIREMENT_MASK_DIGEST_MISMATCH:'+digest);
 const collar=patchBoundary(source,sorted).collarEdges;
 if(collar.length!==21)throw Error('R63_LOGICAL_COLLAR_MISMATCH');
 const retired=new Set(sorted);
 return {keptFaceIds:Array.from({length:2508},(_,i)=>i).filter(i=>!retired.has(i)),
  retiredFaceIds:sorted,collarEdges:collar,expected:R63_FACE_COUNTS,retirementMaskSha256:digest};
}
export function bindAcceptedR63(rawJson,extractNativeMeshOrManifest,manifestArg){
 verifySourceBytes(rawJson);
 const reader=typeof extractNativeMeshOrManifest==='function'?extractNativeMeshOrManifest:extractAcceptedR63Native;
 const input=typeof extractNativeMeshOrManifest==='function'?manifestArg:extractNativeMeshOrManifest;
 if(!input||!Array.isArray(input.retiredFaceIds))throw Error('GEN3237_EXACT_RETIREMENT_MANIFEST_REQUIRED');
 const original=JSON.parse(Buffer.from(rawJson).toString('utf8'));
 const source=assertNormalized(reader(original));
 if(source.faces.length!==2508)throw Error('R63_SOURCE_FACE_COUNT_INVALID');
 const canonical=createAcceptedR63Manifest(source,input.retiredFaceIds);
 if(input.keptFaceIds&&JSON.stringify([...input.keptFaceIds].sort((a,b)=>a-b))!==JSON.stringify(canonical.keptFaceIds))throw Error('R63_PROTECTED_FACE_MASK_MISMATCH');
 const key=([a,b])=>[a,b].sort((x,y)=>x-y).join(':');
 if(input.collarEdges&&JSON.stringify(input.collarEdges.map(key).sort())!==JSON.stringify(canonical.collarEdges.map(key).sort()))throw Error('R63_SOURCE_COLLAR_IDENTITY_MISMATCH');
 return {source,manifest:canonical,sourceSha256:ACCEPTED_R63_SHA256,originalEditable:original};
}
export function prepareGen3237Unfrozen(binding,spec){
 if(binding?.sourceSha256!==ACCEPTED_R63_SHA256)throw Error('R63_SOURCE_BINDING_MISSING');
 if(spec?.operationId!==GEN3237_OPERATION)throw Error('GEN3237_OPERATION_MISMATCH');
 const outcome=construct(binding.source,{...spec,manifest:binding.manifest,requireR63:true});
 return {operationId:GEN3237_OPERATION,sourceSha256:ACCEPTED_R63_SHA256,...outcome};
}
export function prepareNativeFourCameraReview(binding,outcome){
 if(binding?.sourceSha256!==ACCEPTED_R63_SHA256||outcome?.operationId!==GEN3237_OPERATION)throw Error('EXACT_R63_OPERATION_REQUIRED');
 if(outcome.status!=='MECHANICAL_CANDIDATE_UNFROZEN'||!outcome.candidate)throw Error('MECHANICAL_CANDIDATE_REQUIRED');
 const verification=verifyCandidate(binding.source,outcome.candidate,binding.manifest,{clearance:0});
 if(verification.result!=='PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2')throw Error('NATIVE_PREVIEW_WITHOUT_INDEPENDENT_MECHANICAL_PASS_FORBIDDEN');
 // A request, not fabricated rendered evidence; real first-party WebGL2 must return each camera.
 return {status:'NATIVE_WEBGL2_REVIEW_REQUEST_ONLY',sourceSha256:ACCEPTED_R63_SHA256,cameras:['SIDE','FRONT','HERO','REAR'],verification,artisticC1:'HOLD',R64:'HOLD',publication:'HOLD'};
}
