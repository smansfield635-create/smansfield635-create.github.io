// Gen3237 code checkpoint tests: deterministic synthetic fixtures only; never a frozen R63 specimen.
import test from 'node:test';
import assert from 'node:assert/strict';
import {triangleDistance,coplanarOverlapArea,segmentDistance,geometryWitness,patchBoundary,verifyCandidate,exhaustiveCollisionCensus,articulationFidelity} from './v6-articulated-independent-verifier.v1.mjs';
import {sourceAnchors,kinematicFrame,measuredRadii,clearancePreflight,construct,constructGen3243} from './v6-articulated-forequarter.v1.mjs';
import {verifySourceBytes,prepareNativeFourCameraReview,ACCEPTED_R63_SHA256} from './v6-articulated-native-bridge.v1.mjs';
import {createHash} from 'node:crypto';

const tetra=()=>({
 vertices:[[0,0,0],[1,0,0],[0,1,0],[0,0,1]],
 faces:[{id:0,indices:[0,2,1]},{id:1,indices:[0,1,3]},{id:2,indices:[0,3,2]},{id:3,indices:[1,2,3]}]
});
const tinyManifest={keptFaceIds:[0,1,2],retiredFaceIds:[3],collarEdges:[[1,2],[2,3],[3,1]],expected:{sourceFaces:4,keptFaces:3,retiredFaces:1,collarEdges:3}};
const bodyPatch=()=>({
 vertices:[[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1/3,1/3,1/3]],
 faces:[{id:0,indices:[0,2,1]},{id:1,indices:[0,1,3]},{id:2,indices:[0,3,2]},
  {id:10,indices:[1,2,4]},{id:11,indices:[2,3,4]},{id:12,indices:[3,1,4]}]
});
const patchManifest={keptFaceIds:[0,1,2],retiredFaceIds:[10,11,12],collarEdges:[[1,2],[2,3],[3,1]],expected:{sourceFaces:6,keptFaces:3,retiredFaces:3,collarEdges:3}};
const toyAnchors={
 scapula:{faceId:10,barycentric:[1,0,0]},
 axilla:{faceId:11,barycentric:[1,0,0]},
 upperArm:{faceId:12,barycentric:[1,0,0]},
 elbow:{faceId:11,barycentric:[0,1,0]},
 forearm:{faceId:10,barycentric:[0,1,0]},
 paw:{faceId:12,barycentric:[0,0,1]}
};
test('proper 3D triangle crossing is detected independent of centroid distances',()=>{
 const A=[[0,0,0],[1,0,0],[0,1,0]],B=[[.2,.2,-1],[.2,.2,1],[.8,.2,0]];
 assert.ok(triangleDistance(A,B)<1e-9);
 const mesh={vertices:[...A,...B],faces:[{id:1,indices:[0,1,2]},{id:2,indices:[3,4,5]}]};
 assert.equal(geometryWitness(mesh,mesh.faces[0],mesh,mesh.faces[1],0).kind,'PROPER_3D_CONTACT');
});
test('positive-area coplanar overlap is not ignored',()=>{
 const A=[[0,0,0],[1,0,0],[0,1,0]],B=[[.2,.2,0],[.5,.2,0],[.2,.5,0]];
 assert.ok(coplanarOverlapArea(A,B)>.01);
 const mesh={vertices:[...A,...B],faces:[{id:1,indices:[0,1,2]},{id:2,indices:[3,4,5]}]};
 assert.equal(geometryWitness(mesh,mesh.faces[0],mesh,mesh.faces[1],0).kind,'COPLANAR_AREA');
});
test('separated triangles and nonincident segment distance remain positive',()=>{
 const A=[[0,0,0],[1,0,0],[0,1,0]];
 assert.ok(triangleDistance(A,A.map(p=>[p[0],p[1],2]))>1.9);
 assert.equal(segmentDistance([0,0,0],[1,0,0],[.5,-1,0],[.5,1,0]),0);
});
test('retired region is one oriented connected disk with authentic collar',()=>{
 const p=patchBoundary(bodyPatch(),[10,11,12]);
 assert.equal(p.euler,1);assert.equal(p.collarEdges.length,3);assert.equal(p.faceCount,3);
 const bad={vertices:[[0,0,0],[1,0,0],[0,1,0],[5,0,0],[6,0,0],[5,1,0]],faces:[{id:0,indices:[0,1,2]},{id:1,indices:[3,4,5]}]};
 assert.throws(()=>patchBoundary(bad,[0,1]),/PATCH_NOT_SINGLE_ORIENTED_DISK/);
});
test('protected face, vertex, retirement, and 21-edge contracts fail closed',()=>{
 const a=tetra();assert.equal(verifyCandidate(a,a,tinyManifest).result,'PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2');
 const b=structuredClone(a);b.vertices[0][0]=.003;
 assert.throws(()=>verifyCandidate(a,b,tinyManifest),/PROTECTED_VERTEX_CHANGED/);
 assert.throws(()=>verifyCandidate(a,a,{...tinyManifest,collarEdges:[[0,1],[1,2],[2,0]]}),/SOURCE_COLLAR_EDGE_IDENTITY_CHANGED/);
 assert.throws(()=>verifyCandidate(a,a,{...tinyManifest,expected:{...tinyManifest.expected,sourceFaces:2508}}),/R63_SOURCE_FACE_COUNT_MISMATCH/);
});
test('nonincident changed-to-protected collision produces a mechanical witness',()=>{
 const source={
  vertices:[[0,0,0],[1,0,0],[0,1,0],[1/3,1/3,0],[.2,.2,2],[.5,.2,2],[.2,.5,2]],
  faces:[{id:10,indices:[0,1,3]},{id:11,indices:[1,2,3]},{id:12,indices:[2,0,3]},{id:30,indices:[4,5,6]}]
 };
 const m={keptFaceIds:[30],retiredFaceIds:[10,11,12],collarEdges:[[0,1],[1,2],[2,0]],expected:{sourceFaces:4,keptFaces:1,retiredFaces:3,collarEdges:3}};
 const moved=structuredClone(source);moved.vertices[3]=[1/3,1/3,3];
 const result=verifyCandidate(source,moved,m);
 assert.equal(result.result,'FAIL_MECHANICAL');
 assert.ok(['PROPER_3D_CONTACT','COPLANAR_AREA','CLEARANCE'].includes(result.witness.kind));
});
test('source-owned anchors must use measured barycentric control, never free-space guesses',()=>{
 const a=bodyPatch();const s={manifest:patchManifest,anchors:toyAnchors,requireR63:false};
 const pts=sourceAnchors(a,s);assert.deepEqual(pts.scapula,[1,0,0]);assert.deepEqual(pts.elbow,[0,0,1]);
 assert.throws(()=>sourceAnchors(a,{...s,anchors:{...toyAnchors,paw:{faceId:999,barycentric:[1,0,0]}}}),/ANCHOR_NOT_SOURCE_RETIRED_FACE/);
 assert.throws(()=>sourceAnchors(a,{...s,requireR63:true}),/R63_SOURCE_FACE_OWNERSHIP_MISMATCH/);
});
test('source-derived limb radii and missing spatial trajectory are enforced',()=>{
 const src=bodyPatch(),s={manifest:patchManifest,anchors:toyAnchors,requireR63:false,clearance:.001};
 assert.throws(()=>construct(src,s),/EXPLICIT_3D_ANATOMICAL_TRAJECTORY_REQUIRED/);
 const pts=sourceAnchors(src,s),frame=kinematicFrame(pts,{shoulder:pts.scapula,elbow:pts.elbow,wrist:pts.forearm,paw:pts.paw});
 assert.equal(frame.segments.length,3);
 const computed=measuredRadii(src,s,frame);assert.equal(computed.length,3);assert.ok(computed.every(x=>Number.isFinite(x)&&x>0));
 assert.throws(()=>construct(src,{...s,trajectory:{shoulder:pts.scapula,elbow:pts.elbow,wrist:pts.forearm,paw:pts.paw},radii:[.001,.001,.001]}),/RADIUS_NOT_SOURCE_MEASURED/);
});
test('the bridge rejects mismatched accepted R63 bytes and premature camera review',()=>{
 const bytes='synthetic fixture',sha=createHash('sha256').update(bytes).digest('hex');
 assert.equal(verifySourceBytes(bytes,sha).result,'EXACT_SOURCE_BYTES_VERIFIED');
 assert.throws(()=>verifySourceBytes(bytes),/R63_SOURCE_SHA256_MISMATCH/);
 assert.equal(ACCEPTED_R63_SHA256.length,64);
 assert.throws(()=>prepareNativeFourCameraReview({sourceSha256:ACCEPTED_R63_SHA256},{operationId:'bad'}),/EXACT_R63_OPERATION_REQUIRED/);
});

test('Gen3243 independent fidelity rejects no-motion and accepts exact frozen target',()=>{
 const source={vertices:[[0,0,0],[0,0,0],[0,0,0]]};
 const desired=[[1,0,0],[0,1,0],[0,0,1]];
 const roles=new Map([[0,0],[1,1],[2,2]]);
 const stationary={vertices:source.vertices.map(p=>p.slice())};
 const noMotion=articulationFidelity(source,stationary,desired,[0,1,2],roles);
 assert.equal(noMotion.result,'FAIL_FIDELITY');
 assert.equal(noMotion.progress,0);
 assert.equal(noMotion.relativeError,1);
 const exact=articulationFidelity(source,{vertices:desired},desired,[0,1,2],roles);
 assert.equal(exact.result,'PASS_FIDELITY');
 assert.equal(exact.progress,1);
 assert.equal(exact.relativeError,0);
 assert.deepEqual(exact.segmentProgress,[1,1,1]);
});
test('Gen3243 census checks full nonincident population and retains all witnesses',()=>{
 const mesh={vertices:[
  [0,0,0],[1,0,0],[0,1,0],
  [.2,.2,-1],[.2,.2,1],[.8,.2,0],
  [.3,.3,-1],[.3,.3,1],[.7,.3,0],
  [0,0,3],[1,0,3],[0,1,3]],
 faces:[{id:1,indices:[0,1,2]},{id:2,indices:[3,4,5]},
 {id:3,indices:[6,7,8]},{id:4,indices:[9,10,11]}]};
 const m={retiredFaceIds:[1,2,3],keptFaceIds:[4]};
 const result=exhaustiveCollisionCensus(mesh,mesh,m);
 assert.equal(result.pairsChecked,6);
 assert.equal(result.result,'FAIL_COLLISIONS');
 assert.ok(result.collisions.length>=2);
 assert.ok(result.collisions.every(c=>c.pairClass==='NEW_NEW'));
});

test('Gen3243 rejects any alteration of the frozen half-step and IPC coefficients',()=>{
 const src=bodyPatch();
 const spec={manifest:patchManifest,anchors:toyAnchors,requireR63:false,trajectory:{
  shoulder:[0,0,0],elbow:[0,0,1],wrist:[1,0,0],paw:[0,1,0]}};
 assert.throws(()=>constructGen3243(src,{...spec,trialFraction:.25}),/FROZEN_HALF_STEP_MISMATCH/);
 assert.throws(()=>constructGen3243(src,{...spec,barrierActivation:.003}),/FROZEN_IPC_ACTIVATION_MISMATCH/);
 assert.throws(()=>constructGen3243(src,{...spec,barrierWeight:2}),/FROZEN_IPC_WEIGHT_MISMATCH/);
});

test('Gen3243 accelerated census retains exact protected minimum and full pair count',()=>{
 const source={
  vertices:[[0,0,0],[1,0,0],[0,1,0],[0,0,2],[1,0,2],[0,1,2],[0,0,5],[1,0,5],[0,1,5]],
  faces:[{id:1,indices:[0,1,2]},{id:2,indices:[3,4,5]},{id:3,indices:[6,7,8]}]
 };
 const manifest={retiredFaceIds:[1,2],keptFaceIds:[3]};
 const census=exhaustiveCollisionCensus(source,source,manifest,{clearance:.00129});
 assert.equal(census.result,'PASS_COLLISIONS');
 assert.equal(census.pairsChecked,3);
 assert.ok(Math.abs(census.protectedMinimum-3)<1e-10);
 assert.equal(census.collisionCount,0);
});
