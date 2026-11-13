import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {POLICY_A, REGION_ID, R63_ACCEPTED_SHA256, R63_PRIVATE_SCULPT_LAB_SHA256, validateTwoClassCandidate} from './r63-authored-face-contract.v1.mjs';
import {attachAuthenticatedFaceLineage, integratePrivateSculptLab} from './r63-sculpt-lab-integration.v1.mjs';

function tetra({mixed=false,center=[0.5, Math.sqrt(3)/6,-0.01]}={}) {
  const xyz=new Float32Array([0,0,0, 1,0,0, 0.5,Math.sqrt(3)/2,0, 0.5,Math.sqrt(3)/6,1]);
  const uv=new Float32Array([0,0, 1,0, 0.5,Math.sqrt(3)/2, 0.5,0.4]);
  const src=[0,1,2,3],orig=new Uint16Array([0,1,3, 1,2,3, 2,0,3, 0,2,1]);
  const kept=mixed?[0,1]:[0,1,2], selected=new Set(mixed?[2,3]:[3]);
  const retained=mixed?[[2,0,3]]:[];
  const faces=[...retained, [0,2,4],[2,1,4],[1,0,4]];
  const positions=new Float32Array([...xyz,...center]);
  const candidate={positions,indices:new Uint16Array([...kept.flatMap(f=>Array.from(orig.slice(f*3,f*3+3))),...faces.flat()]),UV:new Float32Array([...uv,0.5,0.3]),logical:new Uint16Array([0,1,2,3,4]),groups:[[0],[1],[2],[3],[4]],sources:[...src,-1]};
  const faceLineage=[...(mixed?[{class:'RETAINED_OR_SOURCE_DERIVED_FACE',originalFace:2,sourceParent:2,sourceQualityRule:'UNCHANGED_R63_ORIGINAL_PARENT'}]:[]),...[0,1,2].map(i=>({
    class:'NEW_AUTHORED_FACE', authoredFaceId:`GH_TEST_FACE_ID_${i}`, geometryParent:null,
    immutableParentSnapshot:R63_ACCEPTED_SHA256, replacementRegion:REGION_ID,
    constructionReceipt:'GH_NATIVE_UNIT_TEST_RECEIPT', constructionSeedR63Face:3,
    appearanceReference:{sourceR63Face:3,basis:'BARYCENTRIC_UV_ONLY',geometryParentClaimed:false}
  }))];
  const loop=mixed?[2,1,0,3]:[0,2,1];
  const repl={schema:'DGB_HARVEST_R63_EXISTING_CONNECTED_REGION_REPLACEMENT_V1',parentSnapshotSHA256:R63_ACCEPTED_SHA256,
    boundaryLogicalLoopsOrdered:[loop],vertices:[{xyz:center,uv:[0.5,0.3]}],faces:faces.map(tri=>tri.map(v=>v===4?'v:0':'o:'+v))};
  const bound=attachAuthenticatedFaceLineage(repl,faceLineage);
  const base={kept,selected,loops:[loop]};
  const ctx={exactAcceptedSourceSHA256:R63_ACCEPTED_SHA256,expectedRegionId:REGION_ID,
    expectedKeptFaces:kept.length,expectedSelectedFaces:selected.size,expectedBoundaryLength:loop.length,
    expectedOriginalSourceStitches:0,originalSourceProtectionFaceCount:0,originalPositions:xyz,originalIndices:orig,
    originalUV:uv,originalSources:src,patchAuditMesh:()=>({valid:true}),inspectSurfaceIntersections:()=>({intersections:0,nonadjacentPairs:1})};
  return {candidate,base,repl:bound,ctx};
}
function reject(f,regexp){assert.throws(f,regexp)}

test('Policy A is exactly owner-ratified and the immutable accepted source is explicit',()=>{
  assert.equal(POLICY_A.minAngleP5Degrees,5.89735549);
  assert.equal(POLICY_A.medianMinAngleDegrees,23.75240338);
  assert.equal(POLICY_A.adjacentMedianEdgeRatioP95Maximum,2.52665403);
  assert.match(R63_ACCEPTED_SHA256,/^[0-9a-f]{64}$/);
});

test('genuine new faces pass mechanical + Policy A without a source-parent fiction',()=>{
  const x=tetra();const result=validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx);
  assert.equal(result.result,'ACCEPTED_MECHANICALLY_ONLY_NOT_ARTISTIC');
  assert.equal(result.shapeGrade.newFaceCount,3);
  assert.equal(result.shapeGrade.retainedFaceCount,0);
  assert.equal(result.cutStitches,3);
  assert.equal(result.originalSourceStitches,0);
  assert.equal(result.collisionCheckInvoked,true);
  assert.equal(result.R64Saved,false);
  assert.deepEqual(x.repl.provenance,[null,null,null]);
});

test('mixed source-derived and newly authored faces preserve original-source strain tests',()=>{
  const x=tetra({mixed:true});const r=validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx);
  assert.equal(r.shapeGrade.retainedFaceCount,1);
  assert.equal(r.shapeGrade.newFaceCount,3);
  assert.equal(r.minArea,1);
  assert.equal(r.minEdge,1);
  assert.equal(r.maxEdge,1);
  assert.equal(r.cutStitches,4);
  assert.deepEqual(x.repl.provenance,[2,null,null,null]);
});

test('authored IDs cannot be missing or duplicated',()=>{
  const x=tetra();x.repl.faceLineage[1].authoredFaceId=x.repl.faceLineage[0].authoredFaceId;
  reject(()=>validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx),/AUTHORED_ID_INVALID_OR_DUPLICATE/);
  const y=tetra();delete y.repl.faceLineage[2].authoredFaceId;
  reject(()=>validateTwoClassCandidate(y.candidate,y.base,y.repl,y.ctx),/AUTHORED_ID_INVALID_OR_DUPLICATE/);
});

test('authored faces may cite historical UV correspondence, never a fake one-to-one geometry parent',()=>{
  const x=tetra();x.repl.provenance[1]=3;
  reject(()=>validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx),/FAKE_ONE_TO_ONE_PARENT/);
  const y=tetra();y.repl.faceLineage[0].appearanceReference.geometryParentClaimed=true;
  reject(()=>validateTwoClassCandidate(y.candidate,y.base,y.repl,y.ctx),/APPEARANCE_CORRESPONDENCE_UNTRUTHFUL/);
});

test('source-derived original-parent checks reject untruthful correspondence without changing the old limits',()=>{
  const x=tetra({mixed:true});x.repl.provenance[0]=3;
  reject(()=>validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx),/SOURCE_PARENT_UNTRUTHFUL/);
  const y=tetra({mixed:true});y.candidate.indices[0]=3;
  reject(()=>validateTwoClassCandidate(y.candidate,y.base,y.repl,y.ctx),/KEPT_FACE_CHANGED/);
});

test('source, UV, cut and exact parent hash remain hard invariants',()=>{
  const x=tetra();x.candidate.positions[0]=0.01;
  reject(()=>validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx),/OLD_RENDER_VERTEX_MUTATED/);
  const y=tetra();y.candidate.UV[0]=0.01;
  reject(()=>validateTwoClassCandidate(y.candidate,y.base,y.repl,y.ctx),/OLD_UV_MUTATED/);
  const z=tetra();z.repl.parentSnapshotSHA256='f'.repeat(64);
  reject(()=>validateTwoClassCandidate(z.candidate,z.base,z.repl,z.ctx),/EXACT_SOURCE_SHA_MISMATCH/);
  const q=tetra();q.repl.boundaryLogicalLoopsOrdered=[[1,0,2]];
  reject(()=>validateTwoClassCandidate(q.candidate,q.base,q.repl,q.ctx),/BOUNDARY_IDENTITY_MISMATCH/);
});

test('Policy A shape failure blocks acceptance rather than quietly downgrading to diagnostics',()=>{
  const x=tetra({center:[0.05,0.02,-0.005]});
  reject(()=>validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx),/POLICY_A_SHAPE_GRADE_REJECTED/);
});

test('a strict native 3D collision error is preserved as a hard rejection',()=>{
  const x=tetra();x.ctx.inspectSurfaceIntersections=()=>{throw new Error('SELF_INTERSECTION_FACES_0_4')};
  reject(()=>validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx),/SELF_INTERSECTION_FACES_0_4/);
  const y=tetra();y.ctx.inspectSurfaceIntersections=()=>({intersections:1});
  reject(()=>validateTwoClassCandidate(y.candidate,y.base,y.repl,y.ctx),/NATIVE_COLLISION_CHECK_NOT_CONFIRMED/);
});

test('native topology, manifold and winding remain hard checks even when provenance is valid',()=>{
  const x=tetra();x.ctx.patchAuditMesh=()=>({valid:false,nonmanifold:1});
  reject(()=>validateTwoClassCandidate(x.candidate,x.base,x.repl,x.ctx),/NATIVE_TOPOLOGY_UV_AUDIT_FAILED/);
  const y=tetra();y.candidate.indices[12]=1;
  reject(()=>validateTwoClassCandidate(y.candidate,y.base,y.repl,y.ctx),/WELDED_EDGE_WINDING|DEGENERATE_LOGICAL_EDGE|INVALID_TRIANGLE_INDICES/);
});

test('the exact-private-editor binder fails closed on an unverified or manipulated editor',()=>{
  reject(()=>integratePrivateSculptLab('<!doctype html><html></html>'),/PRIVATE_EDITOR_SHA256_MISMATCH/);
  const x=tetra();reject(()=>attachAuthenticatedFaceLineage(x.repl,[]),/LINEAGE_FACE_ALIGNMENT/);
});

test('when the owner-private editor is supplied, its original validator remains byte-exact',()=>{
  const privateFile=process.env.GH_PRIVATE_SCULPT_LAB_HTML;
  if(!privateFile) return;
  const html=fs.readFileSync(privateFile,'utf8');
  assert.equal(createHash('sha256').update(html).digest('hex'),R63_PRIVATE_SCULPT_LAB_SHA256);
  const bound=integratePrivateSculptLab(html);
  const a=html.slice(html.indexOf('function r63CheckCandidateGeometry('),html.indexOf('async function r63BuildExplicit('));
  assert.ok(bound.html.includes(a));
  assert.equal(bound.sourceBytesPreserved,true);
  assert.match(bound.html,/GH_R63_TWO_CLASS_NATIVE_GATE_V1/);
  assert.ok(bound.html.length>html.length);
});
