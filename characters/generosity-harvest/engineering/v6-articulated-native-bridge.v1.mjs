// Gen3237 first-party native source/preview bridge. Character-only; original R63 remains immutable.
import {createHash} from 'node:crypto';
import {construct} from './v6-articulated-forequarter.v1.mjs';
import {verifyCandidate} from './v6-articulated-independent-verifier.v1.mjs';

export const ACCEPTED_R63_SHA256='afb4727e1027e88535e7f18dcd6caaf792b8779b113b7b5ffac663fe057d21fd';
export const GEN3237_OPERATION='GENEROSITY_HARVEST_V6_ARTICULATED_CHARACTER_ONLY_20261112_001';
export const GEN3237_BRANCH='characters/gh-gen3237-articulated-forequarter';
export const R63_FACE_COUNTS=Object.freeze({sourceFaces:2508,keptFaces:2089,retiredFaces:419,collarEdges:21});
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
export function bindAcceptedR63(rawJson,extractNativeMesh,manifest){
 // The first-party reader supplies the exact native face/UV/normal/sourceMap extraction.
 // Do not guess the private R63 editable JSON schema or silently remap UV seam indices.
 verifySourceBytes(rawJson);
 if(typeof extractNativeMesh!=='function')throw Error('FIRST_PARTY_R63_EXTRACTOR_REQUIRED');
 const original=JSON.parse(Buffer.from(rawJson).toString('utf8'));
 const source=assertNormalized(extractNativeMesh(original));
 if(source.faces.length!==R63_FACE_COUNTS.sourceFaces)throw Error('R63_SOURCE_FACE_COUNT_INVALID');
 if(!manifest||manifest.keptFaceIds?.length!==2089||manifest.retiredFaceIds?.length!==419||manifest.collarEdges?.length!==21)throw Error('GEN3237_EXACT_RETIREMENT_MANIFEST_REQUIRED');
 return {source,manifest:{...manifest,expected:R63_FACE_COUNTS},sourceSha256:ACCEPTED_R63_SHA256,originalEditable:original};
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
