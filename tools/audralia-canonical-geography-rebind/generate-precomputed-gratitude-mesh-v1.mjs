import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(new URL('../../', import.meta.url).pathname);
const OPERATION_ID = 'AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_001';
const EXPECTED = Object.freeze({
  governingHead: '3c5b7ece95bb6d642e527737bb60647c032e29dd',
  geographyBlob: '50991dd777ccd015fd8a6d8eae7b4d02b4a8450c',
  terrainBlob: 'f4f65b05ab303a11fb1d9c4e25de211fde73722a',
  retiredGeographyBlob: 'a67a4e95f7634eb97a375ff103d95bdc81c64f0b',
  geographyContract: 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',
  geographyRevision: 5,
  snapshotRendererBlob: '872d20b17bb0cd89d9613ca0262b25350890a617'
});
const PATHS = Object.freeze({
  geography: 'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',
  terrain: 'inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain/h-earth.terrain-field.js',
  renderer: 'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
  outputDir: 'showroom/globe/h-earth/terrain-estate-construction-v1',
  fullMesh: 'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.bin.gz',
  provenance: 'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.provenance.json'
});

const fail = message => { throw new Error(message); };
const bytes = rel => fs.readFileSync(path.join(ROOT, rel));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const gitBlobSha = value => crypto.createHash('sha1').update(Buffer.from(`blob ${value.length}\0`)).update(value).digest('hex');
const assertBlob = (rel, expected, label) => {
  const value = bytes(rel);
  const actual = gitBlobSha(value);
  if (actual !== expected) fail(`${label}_BLOB_MISMATCH:${actual}`);
  return value;
};
const stableJson = value => `${JSON.stringify(value, null, 2)}\n`;

const geographyBytes = assertBlob(PATHS.geography, EXPECTED.geographyBlob, 'CANONICAL_GEOGRAPHY');
const terrainBytes = assertBlob(PATHS.terrain, EXPECTED.terrainBlob, 'CANONICAL_TERRAIN');
const rendererBytes = assertBlob(PATHS.renderer, EXPECTED.snapshotRendererBlob, 'CANONICAL_SNAPSHOT_RENDERER');

const canonicalGeographyUrl = pathToFileURL(path.join(ROOT, PATHS.geography)).href;
let rendererSource = rendererBytes.toString('utf8');
const snapshotImport = "from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
if (!rendererSource.includes(snapshotImport)) fail('SNAPSHOT_RENDERER_GEOGRAPHY_IMPORT_NOT_FOUND');
rendererSource = rendererSource.replace(snapshotImport, `from '${canonicalGeographyUrl}';`);
const buildMarker = 'function buildGratitudeMeshes(){';
if (!rendererSource.includes(buildMarker)) fail('SNAPSHOT_RENDERER_BUILD_FUNCTION_NOT_FOUND');
rendererSource = rendererSource.replace(buildMarker, 'export function buildGratitudeMeshes(){');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audralia-canonical-rebind-'));
const tempRenderer = path.join(tempDir, 'renderer.canonical-generator.mjs');
fs.writeFileSync(tempRenderer, rendererSource);

const rendererModule = await import(`${pathToFileURL(tempRenderer).href}?op=${OPERATION_ID}`);
if (typeof rendererModule.buildGratitudeMeshes !== 'function') fail('CANONICAL_MESH_BUILDER_EXPORT_MISSING');
const geographyModule = await import(`${canonicalGeographyUrl}?op=${OPERATION_ID}`);
const description = geographyModule.describeAudraliaGratitudeGeographicTransfer?.();
if (geographyModule.AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID !== EXPECTED.geographyContract) {
  fail('CANONICAL_GEOGRAPHY_CONTRACT_MISMATCH');
}
if (description?.revision !== EXPECTED.geographyRevision) fail(`CANONICAL_GEOGRAPHY_REVISION_MISMATCH:${description?.revision}`);

const built = rendererModule.buildGratitudeMeshes();
const land = built?.landMesh;
const water = built?.coastalWaterMesh;
if (!(land?.vertices instanceof Float32Array) || !(land?.indices instanceof Uint32Array)) fail('LAND_MESH_INVALID');
if (!(water?.vertices instanceof Float32Array) || !(water?.indices instanceof Uint32Array)) fail('WATER_MESH_INVALID');

const statistics = Buffer.from(JSON.stringify({land: land.statistics, water: water.statistics}), 'utf8');
const header = Buffer.alloc(32);
header.write('AUDGMV1', 0, 'ascii');
header.writeUInt32LE(1, 8);
header.writeUInt32LE(land.vertices.length, 12);
header.writeUInt32LE(land.indices.length, 16);
header.writeUInt32LE(water.vertices.length, 20);
header.writeUInt32LE(water.indices.length, 24);
header.writeUInt32LE(statistics.length, 28);
const typedBytes = typed => Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
const payload = Buffer.concat([
  header,
  typedBytes(land.vertices),
  typedBytes(land.indices),
  typedBytes(water.vertices),
  typedBytes(water.indices),
  statistics
]);

const fullGzip = zlib.gzipSync(payload, { level: 9, mtime: 0 });
const outputDir = path.join(ROOT, PATHS.outputDir);
fs.writeFileSync(path.join(ROOT, PATHS.fullMesh), fullGzip);

const TARGET_EXPANDED_PART_BYTES = 1_200_000;
const parts = [];
for (let offset = 0, index = 0; offset < payload.length; offset += TARGET_EXPANDED_PART_BYTES, index += 1) {
  const expanded = payload.subarray(offset, Math.min(offset + TARGET_EXPANDED_PART_BYTES, payload.length));
  const compressed = zlib.gzipSync(expanded, { level: 9, mtime: 0 });
  const file = `gratitude-mesh-v1.part-${String(index).padStart(2, '0')}.gz`;
  fs.writeFileSync(path.join(outputDir, file), compressed);
  parts.push(Object.freeze({
    index,
    file,
    expandedBytes: expanded.length,
    compressedBytes: compressed.length,
    expandedSha256: sha256(expanded),
    compressedSha256: sha256(compressed)
  }));
}
if (parts.length !== 8) fail(`PRECOMPUTED_MESH_PART_COUNT_OUT_OF_FROZEN_SCOPE:${parts.length}`);

const hydrology = geographyModule.H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY;
const riverIds = hydrology?.continental?.rivers?.map(item => item.id) ?? [];
const lakeIds = hydrology?.continental?.lakes?.map(item => item.id) ?? [];
const prohibitedLegacyRiverIds = ['GRATITUDE_RIVER_WEST','GRATITUDE_RIVER_CENTRAL','GRATITUDE_RIVER_EAST'];
if (prohibitedLegacyRiverIds.some(id => riverIds.includes(id))) fail('LEGACY_THREE_RIVER_ID_PRESENT_IN_CANONICAL_HYDROLOGY');

const generatorBytes = fs.readFileSync(new URL(import.meta.url));
const provenance = Object.freeze({
  schema: 'AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1',
  operationId: OPERATION_ID,
  governingHead: EXPECTED.governingHead,
  canonicalGeography: Object.freeze({
    path: PATHS.geography,
    gitBlobSha: EXPECTED.geographyBlob,
    sha256: sha256(geographyBytes),
    contractId: EXPECTED.geographyContract,
    reconstructionRevision: EXPECTED.geographyRevision
  }),
  canonicalTerrain: Object.freeze({
    path: PATHS.terrain,
    gitBlobSha: EXPECTED.terrainBlob,
    sha256: sha256(terrainBytes)
  }),
  rendererGenerationSource: Object.freeze({
    path: PATHS.renderer,
    gitBlobSha: EXPECTED.snapshotRendererBlob,
    geographyImportResolvedToCanonicalSnapshot: true
  }),
  hydrology: Object.freeze({
    derivationLaw: hydrology?.continental?.derivationLaw ?? null,
    riverIds: Object.freeze(riverIds),
    lakeIds: Object.freeze(lakeIds),
    prohibitedLegacyRiverIds: Object.freeze(prohibitedLegacyRiverIds),
    prohibitedLegacyRiverIdsReachable: false
  }),
  generator: Object.freeze({
    path: 'tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-mesh-v1.mjs',
    sha256: sha256(generatorBytes),
    deterministicGzipMtime: 0,
    targetExpandedPartBytes: TARGET_EXPANDED_PART_BYTES
  }),
  mesh: Object.freeze({
    format: 'AUDGMV1',
    version: 1,
    payloadBytes: payload.length,
    payloadSha256: sha256(payload),
    fullGzipPath: PATHS.fullMesh,
    fullGzipBytes: fullGzip.length,
    fullGzipSha256: sha256(fullGzip),
    partCount: parts.length,
    parts: Object.freeze(parts),
    landVertexLength: land.vertices.length,
    landIndexLength: land.indices.length,
    waterVertexLength: water.vertices.length,
    waterIndexLength: water.indices.length,
    statisticsSha256: sha256(statistics)
  }),
  authority: Object.freeze({
    singleGeography: true,
    singleTerrain: true,
    precomputationIsPerformanceOnly: true,
    deviceMayChangePerformanceBudgetOnly: true,
    retiredRev3Reachable: false,
    importMapMayChangeGeographicTruth: false
  })
});
fs.writeFileSync(path.join(ROOT, PATHS.provenance), stableJson(provenance));

console.log(stableJson({
  result: 'GENERATED',
  operationId: OPERATION_ID,
  geographyBlob: EXPECTED.geographyBlob,
  terrainBlob: EXPECTED.terrainBlob,
  snapshotRendererBlob: EXPECTED.snapshotRendererBlob,
  payloadSha256: provenance.mesh.payloadSha256,
  fullGzipSha256: provenance.mesh.fullGzipSha256,
  partLengths: provenance.mesh.parts.map(part => part.expandedBytes),
  riverIds,
  lakeIds
}).trim());
