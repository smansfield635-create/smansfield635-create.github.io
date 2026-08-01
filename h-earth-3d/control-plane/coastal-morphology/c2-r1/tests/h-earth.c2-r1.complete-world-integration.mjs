import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  buildHEarthC2R1CompleteWorldRenderPackage,
  evaluateHEarthC2R1CompleteWorldRenderPackage
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

const syntheticResult = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage: syntheticCanonicalPackage,
  sampleCoastalTerrain: syntheticTerrain,
  sampleCoastalSurfaceFrame: syntheticSurface,
  sampleCandidateMaterial: syntheticMaterial,
  sampleSediment: syntheticDiagnostic,
  sampleSwash: syntheticDiagnostic,
  sampleWaterOptics: syntheticDiagnostic,
  sampleBreaker: syntheticDiagnostic
});
assert.equal(syntheticResult.eligible, true);
assert.equal(syntheticResult.completeWorldBinding.counters.boundTerrainVertexCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.boundShorelineVertexCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.candidateSampleFailureCount, 0);
assert.deepEqual(syntheticCanonicalPackage, syntheticBefore, 'synthetic canonical package was mutated');
assert.deepEqual(syntheticResult.primitiveIds, syntheticBefore.primitiveIds);
assert.deepEqual(syntheticResult.primitiveSpans, syntheticBefore.primitiveSpans);
assert.deepEqual(syntheticResult.drawRanges, syntheticBefore.drawRanges);
assert.deepEqual(syntheticResult.buffers.indices, syntheticBefore.buffers.indices);
const syntheticEvaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(syntheticResult, syntheticCanonicalPackage);
assert.equal(syntheticEvaluation.eligible, true, syntheticEvaluation.issues.join(','));

const realCanonicalPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
const realBefore = structuredClone(realCanonicalPackage);
const realResult = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage: realCanonicalPackage,
  sampleCoastalTerrain: sampleHEarthC2R1CoastalTerrainField,
  sampleCoastalSurfaceFrame: sampleHEarthC2R1CoastalSurfaceFrame,
  sampleCandidateMaterial: sampleHEarthC2R1CandidateRendererMaterial,
  sampleSediment: sampleHEarthC2R1ContinuousCoastalSedimentMembership,
  sampleSwash: sampleHEarthC2R1CoastalSwashFoamWetness,
  sampleWaterOptics: sampleHEarthC2R1CoastalWaterOptics,
  sampleBreaker: sampleHEarthC2R1CoastalBreakerField,
  timeSeconds: 0
});
const realEvaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(realResult, realCanonicalPackage);
const realDiagnostic = {
  testType: 'H_EARTH_C2_R1_REAL_CANONICAL_PACKAGE_INTEGRATION_TEST_v1',
  eligible: realResult.eligible === true && realEvaluation.eligible === true,
  rootRejectionCode: realResult.rootRejectionCode ?? null,
  issues: realEvaluation.issues,
  counters: realResult.completeWorldBinding?.counters ?? realResult.counters ?? null,
  failureDiagnostics: realResult.completeWorldBinding?.failureDiagnostics ?? realResult.failureDiagnostics ?? [],
  identityPreservation: {
    primitiveIds: JSON.stringify(realResult.primitiveIds) === JSON.stringify(realCanonicalPackage.primitiveIds),
    primitiveSpans: JSON.stringify(realResult.primitiveSpans) === JSON.stringify(realCanonicalPackage.primitiveSpans),
    drawRanges: JSON.stringify(realResult.drawRanges) === JSON.stringify(realCanonicalPackage.drawRanges),
    indexBytes: JSON.stringify(realResult.buffers?.indices) === JSON.stringify(realCanonicalPackage.buffers.indices)
  }
};
console.log(`REAL_PACKAGE_DIAGNOSTIC:${JSON.stringify(realDiagnostic)}`);
assert.equal(realResult.eligible, true, JSON.stringify(realDiagnostic));
assert.equal(realEvaluation.eligible, true, JSON.stringify(realDiagnostic));
assert.equal(realResult.completeWorldBinding.counters.candidateSampleFailureCount, 0);
assert(realResult.completeWorldBinding.counters.boundTerrainVertexCount > 0);
assert(realResult.completeWorldBinding.counters.boundShorelineVertexCount > 0);
assert.deepEqual(realCanonicalPackage, realBefore, 'real canonical package was mutated');
assert.deepEqual(realResult.primitiveIds, realBefore.primitiveIds);
assert.deepEqual(realResult.primitiveSpans, realBefore.primitiveSpans);
assert.deepEqual(realResult.drawRanges, realBefore.drawRanges);
assert.deepEqual(realResult.buffers.indices, realBefore.buffers.indices);

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
  candidateSampleFailureCount: realResult.completeWorldBinding.counters.candidateSampleFailureCount,
  boundTerrainVertexCount: realResult.completeWorldBinding.counters.boundTerrainVertexCount,
  boundShorelineVertexCount: realResult.completeWorldBinding.counters.boundShorelineVertexCount,
  unchangedVertexCount: realResult.completeWorldBinding.counters.unchangedVertexCount,
  identityPreservationResult: 'PASS',
  exactMutablePathCount: authorizedPaths.length,
  protectedAuthoritiesUnchanged: true
}, null, 2));
