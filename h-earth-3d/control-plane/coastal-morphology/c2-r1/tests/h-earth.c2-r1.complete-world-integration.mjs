import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  buildHEarthC2R1CompleteWorldRenderPackage,
  evaluateHEarthC2R1CompleteWorldRenderPackage
} from '../review/complete-world/complete-world-render-package.js';

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

const canonicalPackage = {
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
const before = structuredClone(canonicalPackage);
const sampleCoastalTerrain = (x, z) => ({
  valid: true,
  candidateWeight: x <= 184 && z !== 40 ? 1 : 0,
  coastalFrame: { anchorX: x },
  world: { x, y: -2 + x / 100, z }
});
const sampleCoastalSurfaceFrame = (x, z) => ({
  valid: true,
  normal: { x: 0.1, y: 0.98, z: 0.15 },
  world: { x, y: -2 + x / 100, z }
});
const sampleCandidateMaterial = () => ({
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

const result = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage, sampleCoastalTerrain, sampleCoastalSurfaceFrame, sampleCandidateMaterial
});
assert.equal(result.eligible, true);
assert.equal(result.completeWorldBinding.counters.boundTerrainVertexCount, 1);
assert.equal(result.completeWorldBinding.counters.boundShorelineVertexCount, 1);
assert.deepEqual(canonicalPackage, before, 'canonical package was mutated');
assert.deepEqual(result.primitiveIds, before.primitiveIds);
assert.deepEqual(result.primitiveSpans, before.primitiveSpans);
assert.deepEqual(result.drawRanges, before.drawRanges);
assert.deepEqual(result.buffers.indices, before.buffers.indices);
assert.notEqual(result.buffers.positions[1], before.buffers.positions[1]);
assert.deepEqual(result.buffers.positions.slice(3, 9), before.buffers.positions.slice(3, 9));
assert.deepEqual(result.buffers.positions.slice(15, 18), before.buffers.positions.slice(15, 18));
assert.deepEqual(result.buffers.baseColorsLinear.slice(16, 24), before.buffers.baseColorsLinear.slice(16, 24));
const evaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(result, canonicalPackage);
assert.equal(evaluation.eligible, true, evaluation.issues.join(','));

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
]) {
  assert(!authorizedPaths.includes(path), `protected path admitted: ${path}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  contractId: result.completeWorldContractId,
  packageIdentity: result.packageIdentity,
  boundTerrainVertexCount: result.completeWorldBinding.counters.boundTerrainVertexCount,
  boundShorelineVertexCount: result.completeWorldBinding.counters.boundShorelineVertexCount,
  unchangedVertexCount: result.completeWorldBinding.counters.unchangedVertexCount,
  exactMutablePathCount: authorizedPaths.length,
  protectedAuthoritiesUnchanged: true
}, null, 2));
