import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildHEarthC2R1CompleteWorldRenderPackage,
  evaluateHEarthC2R1CompleteWorldRenderPackage,
  H_EARTH_C2_R1_COMPLETE_WORLD_BINDING,
  H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
  H_EARTH_C2_R1_EXACT_BINDING_CACHE_SCHEMA
} from '../review/complete-world/complete-world-render-package.js';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';
import { resolveHEarthC2R1CoastalFrame } from '../../../../terrain/h-earth.coastal-profile.c2-r1.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../../../terrain/h-earth.successor-terrain-field.run8b.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../../../');
const startingHead = '4f0491f00fae794ecdefbae36f4ee86c8a1bd21a';
const priorPackageIdentity = 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_218F37AE';
const priorPackageDigest = 'fnv1a32:218f37ae';
const authorizedPaths = [
  '.github/workflows/h-earth-c2-r1-complete-world-integration.yml',
  '.github/workflows/h-earth-c2-r1-integrated-environment-coherence.yml',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/identity.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world-render-package.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.complete-world-integration.mjs',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-source-custody.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-operation-ledger.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-role3-entry.json',
  'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  'showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'
].sort();

const sha256 = value => createHash('sha256').update(value).digest('hex');
const keyOf = (x, z) => `${Object.is(x, -0) ? '-0' : x}|${Object.is(z, -0) ? '-0' : z}`;
const nearlyEqual = (left, right, tolerance = 1e-12) => Math.abs(left - right) <= tolerance;
const decodeFloat64 = base64 => {
  const buffer = Buffer.from(base64, 'base64');
  return Array.from(new Float64Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)));
};
const encodeFloat64 = values => {
  const array = Float64Array.from(values);
  return Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString('base64');
};
const records = section => {
  const values = decodeFloat64(section.valuesBase64);
  assert.equal(values.length, section.recordWidth * section.recordCount);
  const output = [];
  for (let offset = 0; offset < values.length; offset += section.recordWidth) {
    output.push(values.slice(offset, offset + section.recordWidth));
  }
  return output;
};
const hashBuffers = buffers => {
  let hash = 0x811c9dc5;
  const storage = new ArrayBuffer(8);
  const view = new DataView(storage);
  const byte = value => {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  };
  for (const name of ['positions','normals','baseColorsLinear','materialParameters','materialModelCodes','surfaceClassCodes','primitiveIndices','roleCodes','indices']) {
    for (const value of buffers[name]) {
      view.setFloat64(0, Number(value), true);
      for (let index = 0; index < 8; index += 1) byte(view.getUint8(index));
    }
    byte(0xff);
  }
  return hash.toString(16).padStart(8, '0');
};

for (const path of authorizedPaths) await readFile(resolve(root, path));

const syntheticCanonical = {
  eligible: true,
  contractId: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1',
  packageIdentity: 'SYNTHETIC_PARENT_PACKAGE',
  contentDigest: 'fnv1a32:parent',
  revision: 2,
  primitiveIds: ['TERRAIN', 'SHORELINE', 'VEGETATION'],
  primitiveSpans: [{ id: 'TERRAIN', start: 0 }, { id: 'SHORELINE', start: 3 }, { id: 'VEGETATION', start: 5 }],
  drawRanges: [{ role: 'TERRAIN', indexStart: 0, indexCount: 6, primitiveIds: ['TERRAIN'] }],
  environmentDefaults: {
    sunDirection: { x: -0.3, y: 0.8, z: 0.4 }, sunIntensity: 1,
    sunColor: [1,1,1], skyZenithColor: [.1,.2,.3], skyHorizonColor: [.2,.3,.4],
    groundHazeColor: [.1,.1,.1], fogStartDistance: 100, fogFalloff: .01,
    maximumFogFactor: .7, distanceDesaturationStrength: .4
  },
  buffers: {
    positions: [10,5,-20, 250,6,-20, 30,7,40, 10,0,-20, 20,0,20, 20,3,30],
    normals: [0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0],
    baseColorsLinear: [.3,.3,.3,1, .4,.4,.4,1, .5,.5,.5,1, .1,.2,.3,.7, .1,.2,.3,.7, .2,.5,.2,1],
    materialParameters: [.7,.2,0,.1, .7,.2,0,.1, .7,.2,0,.1, 0,0,0,0, 0,0,0,0, .8,.1,0,.1],
    materialModelCodes: [1,1,1,0,0,0],
    surfaceClassCodes: [1,1,1,255,255,255],
    primitiveIndices: [0,0,0,1,1,2],
    roleCodes: [1,1,1,2,2,3],
    indices: [0,1,2,3,4,5]
  }
};
const syntheticBefore = structuredClone(syntheticCanonical);
const syntheticTerrain = (x, z) => ({
  valid: true,
  candidateWeight: x <= 184 && z !== 40 ? 1 : 0,
  coastalFrame: { anchorX: x, signedInlandDistance: z },
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
const syntheticResult = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage: syntheticCanonical,
  sampleCoastalTerrain: syntheticTerrain,
  sampleCandidateMaterial: syntheticMaterial,
  yieldEveryVertices: 2
});
assert.equal(syntheticResult.eligible, true);
assert.equal(syntheticResult.completeWorldBinding.counters.boundTerrainVertexCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.boundShorelineVertexCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.positiveInlandDistanceShorelineVertexCount, 1);
assert.equal(syntheticResult.completeWorldBinding.counters.inlandWaterMembershipViolationCount, 0);
assert.deepEqual(syntheticResult.buffers.positions, syntheticBefore.buffers.positions);
assert.deepEqual(syntheticResult.buffers.normals, syntheticBefore.buffers.normals);
assert.deepEqual(syntheticResult.buffers.indices, syntheticBefore.buffers.indices);
assert.deepEqual(syntheticResult.primitiveSpans, syntheticBefore.primitiveSpans);
assert.deepEqual(syntheticResult.drawRanges, syntheticBefore.drawRanges);
assert.deepEqual(
  syntheticResult.buffers.baseColorsLinear.slice(4 * 4, 4 * 5),
  syntheticBefore.buffers.baseColorsLinear.slice(4 * 4, 4 * 5),
  'positive inland shoreline material changed'
);
assert.equal(evaluateHEarthC2R1CompleteWorldRenderPackage(syntheticResult, syntheticCanonical).eligible, true);

const ledgerPath = resolve(root, 'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-operation-ledger.json');
const role3Path = resolve(root, 'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-role3-entry.json');
const ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));
const role3 = JSON.parse(await readFile(role3Path, 'utf8'));
assert.equal(ledger.exactBindingCacheCarrier?.partIndex, 1);
assert.equal(role3.exactBindingCacheCarrier?.partIndex, 2);
assert.equal(ledger.exactBindingCacheCarrier?.partCount, 2);
assert.equal(role3.exactBindingCacheCarrier?.partCount, 2);
const oldCacheGzip = Buffer.from(
  ledger.exactBindingCacheCarrier.value + role3.exactBindingCacheCarrier.value,
  'base64'
);
const oldCache = JSON.parse(gunzipSync(oldCacheGzip).toString('utf8'));
assert.equal(oldCache.cacheType, 'H_EARTH_C2_R1_COMPLETE_WORLD_EXACT_BINDING_CACHE_v1');
assert.equal(oldCache.completeWorldPackageIdentity, priorPackageIdentity);
assert.equal(oldCache.completeWorldPackageContentDigest, priorPackageDigest);

const canonical = getHEarthRun8ER2CanonicalLiveRenderPackage();
const canonicalBefore = structuredClone(canonical);
const oldTerrainRecords = records(oldCache.terrain);
const oldShorelineRecords = records(oldCache.shoreline);
const terrainRecords = oldTerrainRecords.map(record => [
  record[0], record[1], record[6], record[7], record[8], record[9], record[10], record[11]
]);
const shorelineRecords = [];
let positiveInlandDistanceRecordCount = 0;
for (const record of oldShorelineRecords) {
  const frame = resolveHEarthC2R1CoastalFrame(record[0], record[1]);
  assert(frame && Number.isFinite(frame.signedInlandDistance));
  if (frame.signedInlandDistance <= 0) shorelineRecords.push(record);
  else positiveInlandDistanceRecordCount += 1;
}
assert(shorelineRecords.length > 0);
assert(positiveInlandDistanceRecordCount > 0);

const terrainMap = new Map(terrainRecords.map(record => [keyOf(record[0], record[1]), record]));
const shorelineMap = new Map(shorelineRecords.map(record => [keyOf(record[0], record[1]), record]));
assert.equal(terrainMap.size, terrainRecords.length);
assert.equal(shorelineMap.size, shorelineRecords.length);
const outputBuffers = Object.fromEntries(
  Object.entries(canonical.buffers).map(([name, values]) => [name, Array.from(values)])
);
let boundTerrainVertexCount = 0;
let boundShorelineVertexCount = 0;
let positiveInlandDistanceShorelineVertexCount = 0;
for (let vertexIndex = 0; vertexIndex < canonical.buffers.roleCodes.length; vertexIndex += 1) {
  const role = canonical.buffers.roleCodes[vertexIndex];
  const positionOffset = vertexIndex * 3;
  const colorOffset = vertexIndex * 4;
  const x = canonical.buffers.positions[positionOffset];
  const z = canonical.buffers.positions[positionOffset + 2];
  const key = keyOf(x, z);
  if (role === 1 && terrainMap.has(key)) {
    const record = terrainMap.get(key);
    outputBuffers.baseColorsLinear[colorOffset] = record[2];
    outputBuffers.baseColorsLinear[colorOffset + 1] = record[3];
    outputBuffers.baseColorsLinear[colorOffset + 2] = record[4];
    outputBuffers.materialParameters[colorOffset] = record[5];
    outputBuffers.materialParameters[colorOffset + 2] = record[6];
    outputBuffers.materialParameters[colorOffset + 3] = record[7];
    boundTerrainVertexCount += 1;
  } else if (role === 2) {
    const frame = resolveHEarthC2R1CoastalFrame(x, z);
    assert(frame && Number.isFinite(frame.signedInlandDistance));
    if (frame.signedInlandDistance > 0) positiveInlandDistanceShorelineVertexCount += 1;
    if (shorelineMap.has(key)) {
      assert(frame.signedInlandDistance <= 0, `INLAND_WATER_MEMBERSHIP:${vertexIndex}:${x}:${z}`);
      const record = shorelineMap.get(key);
      outputBuffers.baseColorsLinear[colorOffset] = record[2];
      outputBuffers.baseColorsLinear[colorOffset + 1] = record[3];
      outputBuffers.baseColorsLinear[colorOffset + 2] = record[4];
      outputBuffers.baseColorsLinear[colorOffset + 3] = record[5];
      outputBuffers.materialParameters[colorOffset + 2] = record[6];
      outputBuffers.materialParameters[colorOffset + 3] = record[7];
      boundShorelineVertexCount += 1;
    }
  }
}
assert.deepEqual(outputBuffers.positions, canonical.buffers.positions);
assert.deepEqual(outputBuffers.normals, canonical.buffers.normals);
assert.deepEqual(outputBuffers.indices, canonical.buffers.indices);
const digest = hashBuffers(outputBuffers);
const newPackageIdentity = `H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_${digest.toUpperCase()}`;
const newPackageDigest = `fnv1a32:${digest}`;
assert.notEqual(newPackageIdentity, priorPackageIdentity);
assert.notEqual(newPackageDigest, priorPackageDigest);

const countRole = role => canonical.buffers.roleCodes.filter(value => value === role).length;
const cache = {
  cacheType: H_EARTH_C2_R1_EXACT_BINDING_CACHE_SCHEMA,
  encoding: 'BASE64_LITTLE_ENDIAN_FLOAT64',
  operationId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.operationId,
  objectId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.objectId,
  executionHistoryId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.executionHistoryId,
  activeEdgeId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.activeEdgeId,
  sourceHead: process.env.GITHUB_SHA ?? startingHead,
  startingHead,
  canonicalPackageIdentity: canonical.packageIdentity,
  canonicalPackageContentDigest: canonical.contentDigest,
  priorCompleteWorldPackageIdentity: priorPackageIdentity,
  priorCompleteWorldPackageContentDigest: priorPackageDigest,
  completeWorldPackageIdentity: newPackageIdentity,
  completeWorldPackageContentDigest: newPackageDigest,
  completeWorldContractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
  counters: {
    vertexCount: canonical.buffers.roleCodes.length,
    terrainVertexCount: countRole(1),
    shorelineVertexCount: countRole(2),
    vegetationVertexCount: countRole(3),
    boundTerrainVertexCount,
    boundShorelineVertexCount,
    candidateSampleFailureCount: 0,
    terrainPositionMutationCount: 0,
    terrainNormalMutationCount: 0,
    shorelinePositionMutationCount: 0,
    shorelineNormalMutationCount: 0,
    inlandWaterMembershipViolationCount: 0,
    positiveInlandDistanceShorelineVertexCount,
    positiveInlandDistanceRecordCount,
    unchangedVertexCount:
      canonical.buffers.roleCodes.length - boundTerrainVertexCount - boundShorelineVertexCount
  },
  membership: {
    shorelineAdmissionLaw: 'SIGNED_INLAND_DISTANCE_LESS_THAN_OR_EQUAL_TO_ZERO_ONLY',
    positiveInlandDistanceWaterAdmissionProhibited: true,
    inlandWaterMembershipViolationCount: 0,
    positiveInlandDistanceRecordCount
  },
  terrain: {
    recordWidth: 8,
    recordCount: terrainRecords.length,
    fields: ['worldX','worldZ','colorR','colorG','colorB','roughness','wetness','cavity'],
    valuesBase64: encodeFloat64(terrainRecords.flat())
  },
  shoreline: {
    recordWidth: 8,
    recordCount: shorelineRecords.length,
    fields: ['worldX','worldZ','colorR','colorG','colorB','alpha','wetness','foam'],
    valuesBase64: encodeFloat64(shorelineRecords.flat())
  },
  preservation: {
    canonicalPackageReadOnly: true,
    canonicalPositionsByteIdentical: true,
    canonicalNormalsByteIdentical: true,
    primitiveIdentitiesPreserved: true,
    primitiveSpansPreserved: true,
    drawRangesPreserved: true,
    indicesPreserved: true,
    nonmaterialVertexChannelsPreserved: true,
    canonicalWorldRebuild: false,
    coastalComponentRebuild: false
  },
  fixedView: {
    worldX: 0,
    worldZ: -96,
    terrainY: 1.526628584078394,
    cameraY: 3.776628584078394,
    cameraClearance: 2.25
  },
  turquoiseClassification: {
    normalizedCanvasX: [0.35, 0.5, 0.65],
    normalizedCanvasY: [0.65, 0.75, 0.85],
    greenMinimum: 140,
    blueMinimum: 140,
    greenMinusRedMinimum: 25,
    blueMinusRedMinimum: 20,
    requiredInlandTurquoiseResult: '0_OF_9'
  }
};
const cacheJson = `${JSON.stringify(cache)}\n`;
const cacheJsonSha256 = sha256(cacheJson);
const cacheGzip = gzipSync(Buffer.from(cacheJson), { level: 9, mtime: 0 });
const cacheGzipSha256 = sha256(cacheGzip);
const cacheBase64 = cacheGzip.toString('base64');
const midpoint = Math.ceil(cacheBase64.length / 2);
const carriers = [cacheBase64.slice(0, midpoint), cacheBase64.slice(midpoint)];
assert.equal(carriers.join(''), cacheBase64);

const result = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage: canonical,
  exactBindingCacheBase64: cacheBase64,
  exactBindingCacheArtifactDigest: `sha256:${cacheJsonSha256}`,
  startupBudgetMilliseconds: 105000,
  yieldEveryVertices: 128
});
const evaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(result, canonical);
assert.equal(result.eligible, true, JSON.stringify(result));
assert.equal(evaluation.eligible, true, evaluation.issues.join(','));
assert.equal(result.packageIdentity, newPackageIdentity);
assert.equal(result.contentDigest, newPackageDigest);
assert.deepEqual(result.buffers.positions, canonical.buffers.positions);
assert.deepEqual(result.buffers.normals, canonical.buffers.normals);
assert.deepEqual(result.buffers.indices, canonical.buffers.indices);
assert.deepEqual(result.primitiveSpans, canonical.primitiveSpans);
assert.deepEqual(result.drawRanges, canonical.drawRanges);
assert.equal(result.completeWorldBinding.counters.terrainPositionMutationCount, 0);
assert.equal(result.completeWorldBinding.counters.terrainNormalMutationCount, 0);
assert.equal(result.completeWorldBinding.counters.inlandWaterMembershipViolationCount, 0);
assert.equal(result.completeWorldBinding.counters.boundTerrainVertexCount, boundTerrainVertexCount);
assert.equal(result.completeWorldBinding.counters.boundShorelineVertexCount, boundShorelineVertexCount);
assert.deepEqual(canonical, canonicalBefore, 'canonical package mutated');

const fixedTerrain = sampleHEarthRun8BSuccessorTerrainField(0, -96);
assert.equal(fixedTerrain.valid, true);
assert(nearlyEqual(fixedTerrain.elevation, 1.526628584078394));
const fixedCameraY = fixedTerrain.elevation + 2.25;
assert(nearlyEqual(fixedCameraY, 3.776628584078394));
assert(nearlyEqual(fixedCameraY - fixedTerrain.elevation, 2.25));

const manifest = JSON.parse(await readFile(resolve(root,
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json'), 'utf8'));
const operation = manifest.materialOnlyBindingRecoveryOperation;
assert(operation, 'MATERIAL_ONLY_BINDING_RECOVERY_OPERATION_MISSING');
assert.equal(operation.pathCount, 12);
assert.deepEqual([...operation.exactMutablePaths].sort(), authorizedPaths);
assert.equal(operation.allOtherPathsProtected, true);
assert.equal(operation.canonicalWorldRebuildAllowed, false);
assert.equal(operation.coastalComponentRebuildAllowed, false);

const receipt = {
  receiptType: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_STATIC_RECEIPT_v1',
  operationId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.operationId,
  startingHead,
  sourceHead: cache.sourceHead,
  cacheSchema: cache.cacheType,
  cacheJsonSha256: `sha256:${cacheJsonSha256}`,
  cacheGzipSha256: `sha256:${cacheGzipSha256}`,
  carrierPartCount: 2,
  newPackageIdentity,
  newPackageDigest,
  boundTerrainVertexCount,
  boundShorelineVertexCount,
  canonicalPositionsPreserved: true,
  canonicalNormalsPreserved: true,
  terrainPositionMutationCount: 0,
  terrainNormalMutationCount: 0,
  inlandWaterMembershipViolationCount: 0,
  positiveInlandDistanceRecordCount,
  positiveInlandDistanceShorelineVertexCount,
  x0ZMinus96TerrainY: fixedTerrain.elevation,
  x0ZMinus96CameraY: fixedCameraY,
  x0ZMinus96CameraClearance: fixedCameraY - fixedTerrain.elevation,
  initialTurquoiseSampleRequiredResult: '0_OF_9',
  coastlineFacingWaterPreservationRequired: true,
  exactPathCorridorResult: 'PASS_12_OF_12_NO_OTHERS',
  oldPackageIdentityReused: false,
  status: 'PASS'
};

const outputs = {
  cacheJson: process.env.H_EARTH_MATERIAL_ONLY_CACHE_JSON_OUTPUT,
  cacheGzip: process.env.H_EARTH_MATERIAL_ONLY_CACHE_GZIP_OUTPUT,
  carrier1: process.env.H_EARTH_MATERIAL_ONLY_CACHE_CARRIER_1_OUTPUT,
  carrier2: process.env.H_EARTH_MATERIAL_ONLY_CACHE_CARRIER_2_OUTPUT,
  receipt: process.env.H_EARTH_MATERIAL_ONLY_STATIC_RECEIPT_OUTPUT
};
for (const output of Object.values(outputs).filter(Boolean)) await mkdir(dirname(output), { recursive: true });
if (outputs.cacheJson) await writeFile(outputs.cacheJson, cacheJson, 'utf8');
if (outputs.cacheGzip) await writeFile(outputs.cacheGzip, cacheGzip);
if (outputs.carrier1) await writeFile(outputs.carrier1, carriers[0], 'utf8');
if (outputs.carrier2) await writeFile(outputs.carrier2, carriers[1], 'utf8');
if (outputs.receipt) await writeFile(outputs.receipt, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

console.log(JSON.stringify(receipt, null, 2));
