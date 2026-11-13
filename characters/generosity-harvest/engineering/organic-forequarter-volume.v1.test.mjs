import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ACCEPTED_R63_SHA256, ORGANIC_OPERATION_ID, DEFAULT_ORGANIC_STATIONS, organicForequarterSdf, auditGeneratedSurface, buildOrganicExperimentalSurface} from './organic-forequarter-volume.v1.mjs';
import {FIRST_PARTY_CAMERAS, verifyAcceptedR63Bytes, toFirstPartyWebGLBuffers, authorDisposableOrganicRabbit} from './organic-forequarter-sculpt-lab-bridge.v1.mjs';

const tetra={positions:[0,0,0,1,0,0,0,1,0,0,0,1],indices:[0,2,1,0,1,3,0,3,2,1,2,3]};

test('exact immutable R63 identity and bounded station controls',()=>{
  assert.equal(ACCEPTED_R63_SHA256,'afb4727e1027e88535e7f18dcd6caaf792b8779b113b7b5ffac663fe057d21fd');
  assert.equal(ORGANIC_OPERATION_ID,'FIRST_PARTY_ORGANIC_FOREQUARTER_AUTHORING_V1_20261110_001');
  assert.equal(DEFAULT_ORGANIC_STATIONS.length,6);
  assert.ok(organicForequarterSdf(.38,-.063,.30)<0);
  assert.ok(organicForequarterSdf(2,2,2)>0);
});

test('source editing is rejected on invalid coordinates and indices',()=>{
  assert.throws(()=>buildOrganicExperimentalSurface({positions:[0,0,0],indices:[0,1,2]}),/ORGANIC_SOURCE_MESH_INVALID/);
  assert.throws(()=>buildOrganicExperimentalSurface({positions:tetra.positions,indices:[0,1,99]}),/ORGANIC_SOURCE_NONFINITE_OR_INDEX_INVALID/);
  assert.throws(()=>buildOrganicExperimentalSurface(tetra,{cellSize:.1}),/ORGANIC_CELL_SIZE_OUT_OF_BOUNDS/);
  assert.throws(()=>buildOrganicExperimentalSurface(tetra,{cellSize:.01,maxGridNodes:1}),/ORGANIC_GRID_BUDGET_EXCEEDED/);
  assert.throws(()=>buildOrganicExperimentalSurface(tetra,{stations:[DEFAULT_ORGANIC_STATIONS[0]]}),/ORGANIC_STATIONS_INVALID/);
});

test('closed, connected, orientable topology audit is distinct from self-intersection qualification',()=>{
  const valid=auditGeneratedSurface(tetra);
  assert.equal(valid.connectedWatertight,true);
  assert.equal(valid.connectedComponents,1);
  assert.equal(valid.zeroAreaTriangles,0);
  assert.equal(valid.openOrNonmanifoldEdges,0);
  const hole=auditGeneratedSurface({positions:tetra.positions,indices:tetra.indices.slice(0,-3)});
  assert.equal(hole.connectedWatertight,false);
});

test('the engine buffers retain source-Z-up to GPU-Y-up orientation with only neutral-material entitlement',()=>{
  const b=toFirstPartyWebGLBuffers(tetra);
  assert.deepEqual(Array.from(b.positions.slice(6,9)),[0,0,-1]);
  assert.equal(b.indices.length,12);
  assert.equal(b.materialContract,'UNIFORM_NEUTRAL_MATERIAL_DIAGNOSTIC_ONLY');
  assert.deepEqual(Object.keys(FIRST_PARTY_CAMERAS),['hero','side','front','rear']);
});

test('no unverified parent bytes can enter the character operation',()=>{
  assert.throws(()=>verifyAcceptedR63Bytes(Buffer.from('{}')),/ORGANIC_PARENT_DIGEST_MISMATCH/);
  assert.throws(()=>authorDisposableOrganicRabbit(Buffer.from('{}')),/ORGANIC_PARENT_DIGEST_MISMATCH/);
});

test('exact original R63 one-specimen optional native fidelity test', {skip:!process.env.GH_EXACT_R63_JSON},()=>{
  const bytes=fs.readFileSync(process.env.GH_EXACT_R63_JSON);
  const originalHash=ACCEPTED_R63_SHA256;
  const a=authorDisposableOrganicRabbit(bytes);
  assert.equal(a.acceptedParent.sha256,originalHash);
  assert.equal(a.experimentalCopy.mechanicalAudit.connectedWatertight,true);
  assert.equal(a.experimentalCopy.mechanicalAudit.openOrNonmanifoldEdges,0);
  assert.equal(a.experimentalCopy.mechanicalAudit.inconsistentDirectedEdges,0);
  assert.equal(a.experimentalCopy.mechanicalAudit.zeroAreaTriangles,0);
  assert.ok(a.experimentalCopy.geometry.indices.length>10000);
  assert.equal(a.restrictions.UVAndTexturedRenderNotQualified,true);
});
