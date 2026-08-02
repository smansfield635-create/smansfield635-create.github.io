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

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../../../');
const START = '4f0491f00fae794ecdefbae36f4ee86c8a1bd21a';
const OLD_ID = 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_218F37AE';
const OLD_DIGEST = 'fnv1a32:218f37ae';
const PACKET_TERRAIN_Y = 1.526628584078394;
const PACKET_CAMERA_Y = 3.776628584078394;
const CLEARANCE = 2.25;
const FLOAT32_TOLERANCE = 1e-6;
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
const key = (x, z) => `${Object.is(x, -0) ? '-0' : x}|${Object.is(z, -0) ? '-0' : z}`;
const close = (a, b) => Math.abs(a - b) <= FLOAT32_TOLERANCE;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const decode64 = value => {
  const bytes = Buffer.from(value, 'base64');
  return Array.from(new Float64Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const encode64 = values => {
  const array = Float64Array.from(values);
  return Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString('base64');
};
const records = section => {
  const values = decode64(section.valuesBase64);
  assert.equal(values.length, section.recordWidth * section.recordCount);
  return Array.from({ length: section.recordCount }, (_, index) =>
    values.slice(index * section.recordWidth, (index + 1) * section.recordWidth));
};
const fnv = buffers => {
  let hash = 0x811c9dc5;
  const storage = new ArrayBuffer(8);
  const view = new DataView(storage);
  const byte = value => { hash ^= value & 255; hash = Math.imul(hash, 0x01000193) >>> 0; };
  for (const name of ['positions','normals','baseColorsLinear','materialParameters','materialModelCodes','surfaceClassCodes','primitiveIndices','roleCodes','indices']) {
    for (const value of buffers[name]) {
      view.setFloat64(0, Number(value), true);
      for (let index = 0; index < 8; index += 1) byte(view.getUint8(index));
    }
    byte(255);
  }
  return hash.toString(16).padStart(8, '0');
};
for (const path of authorizedPaths) await readFile(resolve(root, path));

const ledgerPath = resolve(root, 'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-operation-ledger.json');
const role3Path = resolve(root, 'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-role3-entry.json');
const ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));
const role3 = JSON.parse(await readFile(role3Path, 'utf8'));
assert.equal(ledger.exactBindingCacheCarrier?.partIndex, 1);
assert.equal(role3.exactBindingCacheCarrier?.partIndex, 2);
const oldCache = JSON.parse(gunzipSync(Buffer.from(
  ledger.exactBindingCacheCarrier.value + role3.exactBindingCacheCarrier.value,
  'base64'
)).toString('utf8'));
assert.equal(oldCache.cacheType, 'H_EARTH_C2_R1_COMPLETE_WORLD_EXACT_BINDING_CACHE_v1');
assert.equal(oldCache.completeWorldPackageIdentity, OLD_ID);
assert.equal(oldCache.completeWorldPackageContentDigest, OLD_DIGEST);

const canonical = getHEarthRun8ER2CanonicalLiveRenderPackage();
const canonicalBefore = structuredClone(canonical);
const terrain = records(oldCache.terrain).map(record =>
  [record[0], record[1], record[6], record[7], record[8], record[9], record[10], record[11]]);
const shoreline = [];
let inlandRecordCount = 0;
for (const record of records(oldCache.shoreline)) {
  const frame = resolveHEarthC2R1CoastalFrame(record[0], record[1]);
  assert(frame && Number.isFinite(frame.signedInlandDistance));
  if (frame.signedInlandDistance <= 0) shoreline.push(record);
  else inlandRecordCount += 1;
}
assert(terrain.length > 0 && shoreline.length > 0 && inlandRecordCount > 0);
const terrainMap = new Map(terrain.map(record => [key(record[0], record[1]), record]));
const shorelineMap = new Map(shoreline.map(record => [key(record[0], record[1]), record]));
assert.equal(terrainMap.size, terrain.length);
assert.equal(shorelineMap.size, shoreline.length);

const output = Object.fromEntries(Object.entries(canonical.buffers).map(([name, values]) => [name, Array.from(values)]));
let boundTerrainVertexCount = 0;
let boundShorelineVertexCount = 0;
let positiveInlandDistanceShorelineVertexCount = 0;
for (let vertex = 0; vertex < canonical.buffers.roleCodes.length; vertex += 1) {
  const role = canonical.buffers.roleCodes[vertex];
  const p = vertex * 3;
  const m = vertex * 4;
  const x = canonical.buffers.positions[p];
  const z = canonical.buffers.positions[p + 2];
  const coordinate = key(x, z);
  if (role === 1 && terrainMap.has(coordinate)) {
    const record = terrainMap.get(coordinate);
    output.baseColorsLinear[m] = record[2];
    output.baseColorsLinear[m + 1] = record[3];
    output.baseColorsLinear[m + 2] = record[4];
    output.materialParameters[m] = record[5];
    output.materialParameters[m + 2] = record[6];
    output.materialParameters[m + 3] = record[7];
    boundTerrainVertexCount += 1;
  } else if (role === 2) {
    const frame = resolveHEarthC2R1CoastalFrame(x, z);
    assert(frame && Number.isFinite(frame.signedInlandDistance));
    if (frame.signedInlandDistance > 0) positiveInlandDistanceShorelineVertexCount += 1;
    if (shorelineMap.has(coordinate)) {
      assert(frame.signedInlandDistance <= 0, `INLAND_WATER_MEMBERSHIP:${vertex}`);
      const record = shorelineMap.get(coordinate);
      output.baseColorsLinear[m] = record[2];
      output.baseColorsLinear[m + 1] = record[3];
      output.baseColorsLinear[m + 2] = record[4];
      output.baseColorsLinear[m + 3] = record[5];
      output.materialParameters[m + 2] = record[6];
      output.materialParameters[m + 3] = record[7];
      boundShorelineVertexCount += 1;
    }
  }
}
assert.deepEqual(output.positions, canonical.buffers.positions);
assert.deepEqual(output.normals, canonical.buffers.normals);
assert.deepEqual(output.indices, canonical.buffers.indices);
const digest = fnv(output);
const newIdentity = `H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_${digest.toUpperCase()}`;
const newDigest = `fnv1a32:${digest}`;
assert.notEqual(newIdentity, OLD_ID);
assert.notEqual(newDigest, OLD_DIGEST);

const fixedVertex = canonical.buffers.roleCodes.findIndex((role, vertex) => {
  const offset = vertex * 3;
  return role === 1 && canonical.buffers.positions[offset] === 0 && canonical.buffers.positions[offset + 2] === -96;
});
assert(fixedVertex >= 0, 'CANONICAL_FIXED_VIEW_TERRAIN_VERTEX_NOT_FOUND');
const measuredTerrainY = canonical.buffers.positions[fixedVertex * 3 + 1];
assert(close(measuredTerrainY, PACKET_TERRAIN_Y), `CANONICAL_FIXED_VIEW_TERRAIN_Y_MISMATCH:${measuredTerrainY}`);
const measuredCameraY = measuredTerrainY + CLEARANCE;
assert(close(measuredCameraY, PACKET_CAMERA_Y));
assert(close(measuredCameraY - measuredTerrainY, CLEARANCE));

const roleCount = role => canonical.buffers.roleCodes.filter(value => value === role).length;
const cache = {
  cacheType: H_EARTH_C2_R1_EXACT_BINDING_CACHE_SCHEMA,
  encoding: 'BASE64_LITTLE_ENDIAN_FLOAT64',
  operationId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.operationId,
  objectId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.objectId,
  executionHistoryId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.executionHistoryId,
  activeEdgeId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.activeEdgeId,
  sourceHead: process.env.GITHUB_SHA ?? START,
  startingHead: START,
  canonicalPackageIdentity: canonical.packageIdentity,
  canonicalPackageContentDigest: canonical.contentDigest,
  priorCompleteWorldPackageIdentity: OLD_ID,
  priorCompleteWorldPackageContentDigest: OLD_DIGEST,
  completeWorldPackageIdentity: newIdentity,
  completeWorldPackageContentDigest: newDigest,
  completeWorldContractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
  counters: {
    vertexCount: canonical.buffers.roleCodes.length,
    terrainVertexCount: roleCount(1), shorelineVertexCount: roleCount(2), vegetationVertexCount: roleCount(3),
    boundTerrainVertexCount, boundShorelineVertexCount, candidateSampleFailureCount: 0,
    terrainPositionMutationCount: 0, terrainNormalMutationCount: 0,
    shorelinePositionMutationCount: 0, shorelineNormalMutationCount: 0,
    inlandWaterMembershipViolationCount: 0,
    positiveInlandDistanceShorelineVertexCount,
    positiveInlandDistanceRecordCount: inlandRecordCount,
    unchangedVertexCount: canonical.buffers.roleCodes.length - boundTerrainVertexCount - boundShorelineVertexCount
  },
  membership: {
    shorelineAdmissionLaw: 'SIGNED_INLAND_DISTANCE_LESS_THAN_OR_EQUAL_TO_ZERO_ONLY',
    positiveInlandDistanceWaterAdmissionProhibited: true,
    inlandWaterMembershipViolationCount: 0,
    positiveInlandDistanceRecordCount: inlandRecordCount
  },
  terrain: {
    recordWidth: 8, recordCount: terrain.length,
    fields: ['worldX','worldZ','colorR','colorG','colorB','roughness','wetness','cavity'],
    valuesBase64: encode64(terrain.flat())
  },
  shoreline: {
    recordWidth: 8, recordCount: shoreline.length,
    fields: ['worldX','worldZ','colorR','colorG','colorB','alpha','wetness','foam'],
    valuesBase64: encode64(shoreline.flat())
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
    worldX: 0, worldZ: -96,
    packetTerrainY: PACKET_TERRAIN_Y,
    measuredCanonicalTerrainY: measuredTerrainY,
    packetCameraY: PACKET_CAMERA_Y,
    measuredCameraY,
    cameraClearance: CLEARANCE,
    canonicalFloatTolerance: FLOAT32_TOLERANCE
  },
  turquoiseClassification: {
    normalizedCanvasX: [0.35, 0.5, 0.65], normalizedCanvasY: [0.65, 0.75, 0.85],
    greenMinimum: 140, blueMinimum: 140, greenMinusRedMinimum: 25, blueMinusRedMinimum: 20,
    requiredInlandTurquoiseResult: '0_OF_9'
  }
};
const cacheJson = `${JSON.stringify(cache)}\n`;
const cacheJsonDigest = sha256(cacheJson);
const cacheGzip = gzipSync(Buffer.from(cacheJson), { level: 9, mtime: 0 });
const cacheGzipDigest = sha256(cacheGzip);
const base64 = cacheGzip.toString('base64');
const midpoint = Math.ceil(base64.length / 2);
const carrierParts = [base64.slice(0, midpoint), base64.slice(midpoint)];
assert.equal(carrierParts.join(''), base64);

const result = await buildHEarthC2R1CompleteWorldRenderPackage({
  canonicalPackage: canonical,
  exactBindingCacheBase64: base64,
  exactBindingCacheArtifactDigest: `sha256:${cacheJsonDigest}`,
  startupBudgetMilliseconds: 105000,
  yieldEveryVertices: 128
});
const evaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(result, canonical);
assert.equal(result.eligible, true, JSON.stringify(result));
assert.equal(evaluation.eligible, true, evaluation.issues.join(','));
assert.equal(result.packageIdentity, newIdentity);
assert.equal(result.contentDigest, newDigest);
assert.deepEqual(result.buffers.positions, canonical.buffers.positions);
assert.deepEqual(result.buffers.normals, canonical.buffers.normals);
assert.deepEqual(result.buffers.indices, canonical.buffers.indices);
assert.deepEqual(result.primitiveSpans, canonical.primitiveSpans);
assert.deepEqual(result.drawRanges, canonical.drawRanges);
assert.equal(result.completeWorldBinding.counters.terrainPositionMutationCount, 0);
assert.equal(result.completeWorldBinding.counters.terrainNormalMutationCount, 0);
assert.equal(result.completeWorldBinding.counters.inlandWaterMembershipViolationCount, 0);
assert.deepEqual(canonical, canonicalBefore, 'canonical package mutated');

const manifest = JSON.parse(await readFile(resolve(root,
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json'), 'utf8'));
const operation = manifest.materialOnlyBindingRecoveryOperation;
assert(operation);
assert.equal(operation.pathCount, 12);
assert.deepEqual([...operation.exactMutablePaths].sort(), authorizedPaths);
assert.equal(operation.allOtherPathsProtected, true);
assert.equal(operation.canonicalWorldRebuildAllowed, false);
assert.equal(operation.coastalComponentRebuildAllowed, false);

const receipt = {
  receiptType: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_STATIC_RECEIPT_v1',
  operationId: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.operationId,
  startingHead: START,
  sourceHead: cache.sourceHead,
  cacheSchema: cache.cacheType,
  cacheJsonSha256: `sha256:${cacheJsonDigest}`,
  cacheGzipSha256: `sha256:${cacheGzipDigest}`,
  carrierPartCount: 2,
  newPackageIdentity: newIdentity,
  newPackageDigest: newDigest,
  boundTerrainVertexCount,
  boundShorelineVertexCount,
  canonicalPositionsPreserved: true,
  canonicalNormalsPreserved: true,
  terrainPositionMutationCount: 0,
  terrainNormalMutationCount: 0,
  inlandWaterMembershipViolationCount: 0,
  positiveInlandDistanceRecordCount: inlandRecordCount,
  positiveInlandDistanceShorelineVertexCount,
  x0ZMinus96TerrainY: measuredTerrainY,
  x0ZMinus96PacketTerrainY: PACKET_TERRAIN_Y,
  x0ZMinus96CameraY: measuredCameraY,
  x0ZMinus96CameraClearance: CLEARANCE,
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
for (const outputPath of Object.values(outputs).filter(Boolean)) await mkdir(dirname(outputPath), { recursive: true });
if (outputs.cacheJson) await writeFile(outputs.cacheJson, cacheJson, 'utf8');
if (outputs.cacheGzip) await writeFile(outputs.cacheGzip, cacheGzip);
if (outputs.carrier1) await writeFile(outputs.carrier1, carrierParts[0], 'utf8');
if (outputs.carrier2) await writeFile(outputs.carrier2, carrierParts[1], 'utf8');
if (outputs.receipt) await writeFile(outputs.receipt, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
