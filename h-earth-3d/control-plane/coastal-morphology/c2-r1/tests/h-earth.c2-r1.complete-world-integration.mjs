import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  buildHEarthC2R1CompleteWorldRenderPackage,
  evaluateHEarthC2R1CompleteWorldRenderPackage,
  H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID
} from '../review/complete-world/complete-world-render-package.js';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';
import { sampleHEarthC2R1CoastalTerrainField } from '../../../../terrain/h-earth.coastal-profile.c2-r1.js';
import { sampleHEarthC2R1CoastalSurfaceFrame } from '../../../../terrain/h-earth.coastal-surface-frame.c2-r1.js';
import { sampleHEarthC2R1CandidateRendererMaterial } from '../h-earth.c2-r1.candidate-renderer-sampling.js';
import { sampleHEarthC2R1ContinuousCoastalSedimentMembership } from '../h-earth.c2-r1.continuous-sediment-membership.js';
import { sampleHEarthC2R1CoastalSwashFoamWetness } from '../../../../environment/h-earth.coastal-swash-foam-wetness.c2-r1.js';
import { sampleHEarthC2R1CoastalWaterOptics } from '../../../../environment/h-earth.coastal-water-optics.c2-r1.js';
import { sampleHEarthC2R1CoastalBreakerField } from '../../../../environment/h-earth.coastal-breaker-field.c2-r1.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../../../');
const authorizedPaths = [
  '.github/workflows/h-earth-c2-r1-complete-world-integration.yml',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/index.html',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/identity.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world-render-package.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world-persistent-renderer.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.complete-world-integration.mjs',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-source-custody.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-operation-ledger.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-role3-entry.json'
].sort();

const syntheticCanonicalPackage = {
  eligible: true,
  status: 'SYNTHETIC_CANONICAL_COMPLETE_WORLD_PACKAGE',
  contractId: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1',
  packageIdentity: 'SYNTHETIC_PARENT_PACKAGE',
  contentDigest: 'fnv1a32:parent',
  revision: 2,
  primitiveIds: ['TERRAIN', 'SHORELINE', 'VEGETATION'],
  primitiveSpans: [{ id: 'TERRAIN', start: 0 }, { id: 'SHORELINE', start: 3 }, { id: 'VEGETATION', start: 5 }],
  drawRanges: [{ role: 'TERRAIN', indexStart: 0, indexCount: 6, primitiveIds: ['TERRAIN'] }],
  environmentDefaults: {
    sunDirection: { x: -0.3, y: 0.8, z: 0.4 }, sunIntensity: 1,
    sunColor: [1, 1, 1], skyZenithColor: [0.1, 0.2, 0.3], skyHorizonColor: [0.2, 0.3, 0.4],
    groundHazeColor: [0.1, 0.1, 0.1], fogStartDistance: 100, fogFalloff: 0.01,
    maximumFogFactor: 0.7, distanceDesaturationStrength: 0.4
  },
  buffers: {
    positions: [10, 5, 20, 250, 6, 20, 30, 7, 40, 10, 0, 20, 250, 0, 20, 20, 3, 30],
    normals: [0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0],
    baseColorsLinear: [.3,.3,.3,1, .4,.4,.4,1, .5,.5,.5,1, .1,.2,.3,.7, .1,.2,.3,.7, .2,.5,.2,1],
    materialParameters: [.7,.2,0,.1, .7,.2,0,.1, .7,.2,0,.1, 0,0,0,0, 0,0,0,0, .8,.1,0,.1],
    materialModelCodes: [1,1,1,0,0,0],
    surfaceClassCodes: [1,1,1,255,255,255],
    primitiveIndices: [0,0,0,1,1,2],
    roleCodes: [1,1,1,2,2,3],
    indices: [0,1,2, 3,4,5]
  }
};
const syntheticBefore = structuredClone(syntheticCanonicalPackage);
const syntheticTerrain = (x, z) => ({
  valid: true,
  candidateWeight: x <= 184 && z !== 40 ? 1 : 0,
  coastalFrame: { anchorX: x, signedInlandDistance: z },
  world: { x, y: -2 + x / 100, z }
});
const syntheticSurface = (x, z) => ({
  valid: true,
  normal: { x: 0.1, y: 0.98, z: 0.15 },
  world: { x, y: -2 + x / 100, z }
});
const syntheticMaterial = () => ({
  valid: true,
  material: { colorLinear: [.22,.31,.18], roughness: .61, cavityOrAmbientOcclusion: .9 },
  preservedCandidateResponses: {
    temporaryWetness: .42,
    waterSurfaceColorLinear: [.04,.24,.35],
    waterSurfaceOpacity: .58,
    foamIntensity: .5,
    foamOpacity: .4,
    foamColorLinear: [.9,.95,.92]
  }
});
const syntheticDiagnostic = () => ({ valid: true, status: 'SYNTHETIC_PASS', issues: [] });
const syntheticProgress = [];

const syntheticResult = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage: syntheticCanonicalPackage,
  sampleCoastalTerrain: syntheticTerrain,
  sampleCoastalSurfaceFrame: syntheticSurface,
  sampleCandidateMaterial: syntheticMaterial,
  sampleSediment: syntheticDiagnostic,
  sampleSwash: syntheticDiagnostic,
  sampleWaterOptics: syntheticDiagnostic,
  sampleBreaker: syntheticDiagnostic,
  yieldEveryVertices: 2,
  startupBudgetMilliseconds: 10000,
  onProgress: receipt => syntheticProgress.push(receipt)
});
assert.equal(H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID, 'H_EARTH_C2_R1_COMPLETE_WORLD_RENDER_PACKAGE_v4');
assert.equal(syntheticResult.eligible, true);
assert.equal(syntheticResult.completeWorldBinding.counters.boundTerrainVertexCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.boundShorelineVertexCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.candidateSampleFailureCount, 0);
assert.equal(syntheticResult.completeWorldBinding.counters.adapterBoundaryExcludedVertexCount, 0);
assert.equal(syntheticResult.completeWorldBinding.counters.terrainSampleInvocationCount, 3);
assert.equal(syntheticResult.completeWorldBinding.counters.terrainSampleCacheHitCount, 2);
assert.equal(syntheticResult.completeWorldBinding.counters.candidateMaterialSampleInvocationCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.candidateMaterialSampleCacheHitCount, 1);
assert(syntheticResult.completeWorldBinding.counters.constructionYieldCount > 0);
assert.equal(Object.isFrozen(syntheticResult.buffers.positions), true);
assert.deepEqual(syntheticCanonicalPackage, syntheticBefore, 'synthetic canonical package was mutated');
assert.deepEqual(syntheticResult.primitiveIds, syntheticBefore.primitiveIds);
assert.deepEqual(syntheticResult.primitiveSpans, syntheticBefore.primitiveSpans);
assert.deepEqual(syntheticResult.drawRanges, syntheticBefore.drawRanges);
assert.deepEqual(syntheticResult.buffers.indices, syntheticBefore.buffers.indices);
const syntheticEvaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(syntheticResult, syntheticCanonicalPackage);
assert.equal(syntheticEvaluation.eligible, true, syntheticEvaluation.issues.join(','));

const ledgerCarrierRecord = JSON.parse(await readFile(resolve(
  root,
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-operation-ledger.json'
), 'utf8'));
const role3CarrierRecord = JSON.parse(await readFile(resolve(
  root,
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-role3-entry.json'
), 'utf8'));
assert.equal(ledgerCarrierRecord.exactBindingCacheCarrier?.partIndex, 1);
assert.equal(role3CarrierRecord.exactBindingCacheCarrier?.partIndex, 2);
assert.equal(ledgerCarrierRecord.exactBindingCacheCarrier?.partCount, 2);
assert.equal(role3CarrierRecord.exactBindingCacheCarrier?.partCount, 2);
assert.equal(ledgerCarrierRecord.exactBindingCacheCarrier?.encoding, 'BASE64_GZIP_JSON');
assert.equal(role3CarrierRecord.exactBindingCacheCarrier?.encoding, 'BASE64_GZIP_JSON');
const exactBindingCacheBase64 = ledgerCarrierRecord.exactBindingCacheCarrier.value +
  role3CarrierRecord.exactBindingCacheCarrier.value;
assert(exactBindingCacheBase64.length > 1000000);

const realCanonicalPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
const realBefore = structuredClone(realCanonicalPackage);
const realStartedAt = performance.now();
const realResult = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage: realCanonicalPackage,
  exactBindingCacheBase64,
  exactBindingCacheArtifactDigest: 'sha256:0c01a65ce7a8304874fc9ec43ce1972a5f0e828b2ceb369c3d4faf603f1ff0d1',
  startupBudgetMilliseconds: 105000,
  yieldEveryVertices: 128
});
const realElapsedMilliseconds = Number((performance.now() - realStartedAt).toFixed(3));
const realEvaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(realResult, realCanonicalPackage);
const counters = realResult.completeWorldBinding?.counters ?? realResult.counters ?? null;
const boundaryExclusions = realResult.completeWorldBinding?.boundaryExclusionDiagnostics ?? [];
const identityPreservation = {
  primitiveIds: JSON.stringify(realResult.primitiveIds) === JSON.stringify(realCanonicalPackage.primitiveIds),
  primitiveSpans: JSON.stringify(realResult.primitiveSpans) === JSON.stringify(realCanonicalPackage.primitiveSpans),
  drawRanges: JSON.stringify(realResult.drawRanges) === JSON.stringify(realCanonicalPackage.drawRanges),
  indexBytes: JSON.stringify(realResult.buffers?.indices) === JSON.stringify(realCanonicalPackage.buffers.indices)
};
const realDiagnostic = {
  testType: 'H_EARTH_C2_R1_EXACT_BINDING_CACHE_INTEGRATION_TEST_v1',
  eligible: realResult.eligible === true && realEvaluation.eligible === true,
  rootRejectionCode: realResult.rootRejectionCode ?? null,
  issues: realEvaluation.issues,
  counters,
  adapterBoundaryExclusions: boundaryExclusions,
  failureDiagnostics: realResult.completeWorldBinding?.failureDiagnostics ?? realResult.failureDiagnostics ?? [],
  identityPreservation,
  realElapsedMilliseconds
};
console.log(`REAL_PACKAGE_DIAGNOSTIC:${JSON.stringify(realDiagnostic)}`);
assert.equal(realResult.eligible, true, JSON.stringify(realDiagnostic));
assert.equal(realEvaluation.eligible, true, JSON.stringify(realDiagnostic));
assert.equal(realResult.packageIdentity, 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_218F37AE');
assert.equal(realResult.contentDigest, 'fnv1a32:218f37ae');
assert.equal(counters.candidateSampleFailureCount, 0);
assert.equal(counters.adapterBoundaryExcludedVertexCount, 1);
assert.equal(counters.boundTerrainVertexCount, 10419);
assert.equal(counters.boundShorelineVertexCount, 299);
assert.equal(realResult.completeWorldBinding.exactBindingCacheActive, true);
assert.equal(realResult.completeWorldBinding.exactBindingCacheArtifactDigest, 'sha256:0c01a65ce7a8304874fc9ec43ce1972a5f0e828b2ceb369c3d4faf603f1ff0d1');
assert(counters.constructionMilliseconds < 105000, `cache construction exceeded browser budget: ${counters.constructionMilliseconds}`);
assert(realElapsedMilliseconds < 105000, `cache integration elapsed exceeded browser budget: ${realElapsedMilliseconds}`);
assert.equal(Object.isFrozen(realResult.buffers.positions), true);
assert.equal(boundaryExclusions.length, 1);
assert.equal(boundaryExclusions[0].vertexIndex, 24327);
assert.equal(boundaryExclusions[0].roleCode, 1);
assert.equal(boundaryExclusions[0].worldX, 128);
assert.equal(boundaryExclusions[0].worldZ, 64);
assert.deepEqual(realCanonicalPackage, realBefore, 'real canonical package was mutated');
assert.deepEqual(realResult.primitiveIds, realBefore.primitiveIds);
assert.deepEqual(realResult.primitiveSpans, realBefore.primitiveSpans);
assert.deepEqual(realResult.drawRanges, realBefore.drawRanges);
assert.deepEqual(realResult.buffers.indices, realBefore.buffers.indices);
assert(Object.values(identityPreservation).every(Boolean));

const nearlyEqual = (left, right, tolerance = 1e-12) => Math.abs(left - right) <= tolerance;
const representativeTerrain = { worldX: -54, worldZ: -230 };
const terrainVertexIndex = realCanonicalPackage.buffers.roleCodes.findIndex((roleCode, vertexIndex) => {
  const offset = vertexIndex * 3;
  return roleCode === 1 &&
    Object.is(realCanonicalPackage.buffers.positions[offset], representativeTerrain.worldX) &&
    Object.is(realCanonicalPackage.buffers.positions[offset + 2], representativeTerrain.worldZ);
});
assert(terrainVertexIndex >= 0, 'REPRESENTATIVE_TERRAIN_VERTEX_NOT_FOUND');
const terrainAudit = sampleHEarthC2R1CoastalTerrainField(representativeTerrain.worldX, representativeTerrain.worldZ);
const surfaceAudit = sampleHEarthC2R1CoastalSurfaceFrame(representativeTerrain.worldX, representativeTerrain.worldZ);
const materialAudit = sampleHEarthC2R1CandidateRendererMaterial(representativeTerrain.worldX, representativeTerrain.worldZ, { timeSeconds: 0 });
assert.equal(terrainAudit.valid, true);
assert.equal(surfaceAudit.valid, true);
assert.equal(materialAudit.valid, true);
const terrainPositionOffset = terrainVertexIndex * 3;
const terrainColorOffset = terrainVertexIndex * 4;
assert(nearlyEqual(realResult.buffers.positions[terrainPositionOffset + 1], terrainAudit.world.y));
assert(nearlyEqual(realResult.buffers.normals[terrainPositionOffset], surfaceAudit.normal.x));
assert(nearlyEqual(realResult.buffers.normals[terrainPositionOffset + 1], surfaceAudit.normal.y));
assert(nearlyEqual(realResult.buffers.normals[terrainPositionOffset + 2], surfaceAudit.normal.z));
for (let channel = 0; channel < 3; channel += 1) {
  assert(nearlyEqual(realResult.buffers.baseColorsLinear[terrainColorOffset + channel], materialAudit.material.colorLinear[channel]));
}
assert(nearlyEqual(realResult.buffers.materialParameters[terrainColorOffset], materialAudit.material.roughness));
assert(nearlyEqual(realResult.buffers.materialParameters[terrainColorOffset + 2], materialAudit.preservedCandidateResponses.temporaryWetness));
assert(nearlyEqual(realResult.buffers.materialParameters[terrainColorOffset + 3], materialAudit.material.cavityOrAmbientOcclusion));

const representativeShoreline = { worldX: -179.27073246240616, worldZ: -119.3263727426529 };
const shorelineVertexIndex = realCanonicalPackage.buffers.roleCodes.findIndex((roleCode, vertexIndex) => {
  const offset = vertexIndex * 3;
  return roleCode === 2 &&
    Object.is(realCanonicalPackage.buffers.positions[offset], representativeShoreline.worldX) &&
    Object.is(realCanonicalPackage.buffers.positions[offset + 2], representativeShoreline.worldZ);
});
assert(shorelineVertexIndex >= 0, 'REPRESENTATIVE_SHORELINE_VERTEX_NOT_FOUND');
const shorelineMaterialAudit = sampleHEarthC2R1CandidateRendererMaterial(
  representativeShoreline.worldX,
  representativeShoreline.worldZ,
  { timeSeconds: 0 }
);
assert.equal(shorelineMaterialAudit.valid, true);
const preserved = shorelineMaterialAudit.preservedCandidateResponses;
const foam = Math.min(1, Math.max(0, preserved.foamIntensity * preserved.foamOpacity));
const expectedWaterColor = preserved.waterSurfaceColorLinear.map((channel, index) =>
  Math.min(1, Math.max(0, channel * (1 - foam) + preserved.foamColorLinear[index] * foam))
);
const expectedWaterAlpha = Math.min(0.92, Math.max(0.18, preserved.waterSurfaceOpacity + foam * 0.18));
const shorelineColorOffset = shorelineVertexIndex * 4;
for (let channel = 0; channel < 3; channel += 1) {
  assert(nearlyEqual(realResult.buffers.baseColorsLinear[shorelineColorOffset + channel], expectedWaterColor[channel]));
}
assert(nearlyEqual(realResult.buffers.baseColorsLinear[shorelineColorOffset + 3], expectedWaterAlpha));
assert(nearlyEqual(realResult.buffers.materialParameters[shorelineColorOffset + 2], preserved.temporaryWetness));
assert(nearlyEqual(realResult.buffers.materialParameters[shorelineColorOffset + 3], foam));

const boundaryTerrain = sampleHEarthC2R1CoastalTerrainField(128, 64);
const boundaryMaterial = sampleHEarthC2R1CandidateRendererMaterial(128, 64, { timeSeconds: 0 });
const boundarySediment = sampleHEarthC2R1ContinuousCoastalSedimentMembership(128, 64);
const boundarySwash = sampleHEarthC2R1CoastalSwashFoamWetness(128, 64, { timeSeconds: 0 });
const boundaryWaterOptics = sampleHEarthC2R1CoastalWaterOptics(128, 64);
const boundaryBreaker = sampleHEarthC2R1CoastalBreakerField(128, 64);
assert.equal(boundaryTerrain.valid, true);
assert.equal(boundaryMaterial.valid, false);
assert.equal(boundarySediment.valid, true);
assert.equal(boundarySwash.valid, false);
assert.equal(boundaryWaterOptics.valid, true);
assert.equal(boundaryBreaker.valid, false);
assert(boundaryMaterial.issues.includes('R1_1_R1_3_OR_R1_6_CANDIDATE_INPUT_NOT_ELIGIBLE'));
assert(boundarySwash.issues.includes('R1_1_R1_3_R1_4_OR_R1_5_INPUT_NOT_ELIGIBLE'));
assert(boundaryBreaker.issues.includes('DIRECTIONAL_DEPTH_SAMPLE_INVALID'));

const manifest = JSON.parse(await readFile(resolve(root, 'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json'), 'utf8'));
assert.deepEqual([...manifest.completeWorldIntegrationOperation.exactMutablePaths].sort(), authorizedPaths);
assert.equal(manifest.completeWorldIntegrationOperation.pathCount, 11);
assert.equal(manifest.completeWorldIntegrationOperation.publicDefaultMutationAllowed, false);
assert.equal(manifest.completeWorldIntegrationOperation.mainMutationAllowed, false);
for (const path of authorizedPaths) await readFile(resolve(root, path));
for (const path of [
  'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js',
  'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.candidate-renderer-sampling.js',
  'showroom/globe/h-earth/index.html',
  'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'
]) assert(!authorizedPaths.includes(path), `protected path admitted: ${path}`);

console.log(JSON.stringify({
  status: 'PASS',
  contractId: realResult.completeWorldContractId,
  packageIdentity: realResult.packageIdentity,
  candidateSampleFailureCount: counters.candidateSampleFailureCount,
  adapterBoundaryExcludedVertexCount: counters.adapterBoundaryExcludedVertexCount,
  exactBoundaryExclusionVertex: {
    vertexIndex: boundaryExclusions[0].vertexIndex,
    roleCode: boundaryExclusions[0].roleCode,
    worldX: boundaryExclusions[0].worldX,
    worldZ: boundaryExclusions[0].worldZ
  },
  boundTerrainVertexCount: counters.boundTerrainVertexCount,
  boundShorelineVertexCount: counters.boundShorelineVertexCount,
  constructionMilliseconds: counters.constructionMilliseconds,
  realElapsedMilliseconds,
  unchangedVertexCount: counters.unchangedVertexCount,
  identityPreservationResult: 'PASS',
  exactMutablePathCount: authorizedPaths.length,
  protectedAuthoritiesUnchanged: true
}, null, 2));
