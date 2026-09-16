import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(new URL('../../', import.meta.url).pathname);
const BASE = '3c5b7ece95bb6d642e527737bb60647c032e29dd';
const OPERATION_ID = 'AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_001';
const CANONICAL_GEOGRAPHY = 'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const CANONICAL_TERRAIN = 'inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain/h-earth.terrain-field.js';
const EXPECTED_GEOGRAPHY_BLOB = '50991dd777ccd015fd8a6d8eae7b4d02b4a8450c';
const EXPECTED_TERRAIN_BLOB = 'f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const RETIRED_GEOGRAPHY_BLOB = 'a67a4e95f7634eb97a375ff103d95bdc81c64f0b';
const LEGACY_RIVER_IDS = ['GRATITUDE_RIVER_WEST','GRATITUDE_RIVER_CENTRAL','GRATITUDE_RIVER_EAST'];
const ALLOWED_PATHS = new Set([
  'showroom/globe/audralia/index.html',
  'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs',
  'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs',
  'showroom/globe/h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs',
  'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.bin.gz',
  ...Array.from({length:8},(_,index)=>`showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-${String(index).padStart(2,'0')}.gz`),
  'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.provenance.json',
  'tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-mesh-v1.mjs',
  'tools/audralia-canonical-geography-rebind/verify-audralia-canonical-geography-rebind-v1.mjs',
  'h-earth-3d/experience-anchor/receipts/AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_v1.json'
]);
const fail = code => { throw new Error(code); };
const read = rel => fs.readFileSync(path.join(ROOT, rel));
const text = rel => read(rel).toString('utf8');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const gitBlobSha = value => crypto.createHash('sha1').update(Buffer.from(`blob ${value.length}\0`)).update(value).digest('hex');
const git = (...args) => execFileSync('git', ['-C', ROOT, ...args], {encoding:'utf8'}).trim();
const exists = rel => fs.existsSync(path.join(ROOT, rel));
const check = (condition, code) => { if (!condition) fail(code); };

const changed = git('diff','--name-only',`${BASE}...HEAD`).split('\n').filter(Boolean);
check(changed.length > 0, 'NO_CANDIDATE_DIFF');
for (const rel of changed) check(ALLOWED_PATHS.has(rel), `DECLARED_PATH_VIOLATION:${rel}`);
check(!changed.some(rel => rel.startsWith('inspection/audralia-24057-exact/snapshot/')), 'SNAPSHOT_BYTE_MUTATION');

check(gitBlobSha(read(CANONICAL_GEOGRAPHY)) === EXPECTED_GEOGRAPHY_BLOB, 'CANONICAL_GEOGRAPHY_IDENTITY_DRIFT');
check(gitBlobSha(read(CANONICAL_TERRAIN)) === EXPECTED_TERRAIN_BLOB, 'CANONICAL_TERRAIN_IDENTITY_DRIFT');

const provenancePath = 'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.provenance.json';
check(exists(provenancePath), 'PRECOMPUTED_PROVENANCE_MISSING');
const provenance = JSON.parse(text(provenancePath));
check(provenance.schema === 'AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1', 'PRECOMPUTED_PROVENANCE_SCHEMA');
check(provenance.operationId === OPERATION_ID, 'PRECOMPUTED_PROVENANCE_OPERATION');
check(provenance.canonicalGeography?.path === CANONICAL_GEOGRAPHY, 'PRECOMPUTED_PROVENANCE_GEOGRAPHY_PATH');
check(provenance.canonicalGeography?.gitBlobSha === EXPECTED_GEOGRAPHY_BLOB, 'PRECOMPUTED_PROVENANCE_GEOGRAPHY_BLOB');
check(provenance.canonicalTerrain?.path === CANONICAL_TERRAIN, 'PRECOMPUTED_PROVENANCE_TERRAIN_PATH');
check(provenance.canonicalTerrain?.gitBlobSha === EXPECTED_TERRAIN_BLOB, 'PRECOMPUTED_PROVENANCE_TERRAIN_BLOB');
check(provenance.rendererGenerationSource?.gitBlobSha === '872d20b17bb0cd89d9613ca0262b25350890a617', 'PRECOMPUTED_PROVENANCE_RENDERER_BLOB');
check(provenance.mesh?.partCount === 8, 'PRECOMPUTED_PROVENANCE_PART_COUNT');
check(provenance.authority?.singleGeography === true, 'PRECOMPUTED_PROVENANCE_SINGLE_GEOGRAPHY');
check(provenance.authority?.singleTerrain === true, 'PRECOMPUTED_PROVENANCE_SINGLE_TERRAIN');
check(provenance.authority?.precomputationIsPerformanceOnly === true, 'PRECOMPUTED_PROVENANCE_PERFORMANCE_ONLY');
check(provenance.authority?.deviceMayChangePerformanceBudgetOnly === true, 'PRECOMPUTED_PROVENANCE_DEVICE_AUTHORITY');
check(provenance.authority?.retiredRev3Reachable === false, 'PRECOMPUTED_PROVENANCE_RETIRED_REACHABLE');
check(provenance.authority?.importMapMayChangeGeographicTruth === false, 'PRECOMPUTED_PROVENANCE_IMPORT_MAP_AUTHORITY');
for (const id of LEGACY_RIVER_IDS) check(!provenance.hydrology?.riverIds?.includes(id), `LEGACY_RIVER_ID_REACHABLE:${id}`);

const expandedParts = [];
for (const part of provenance.mesh.parts) {
  const rel = `showroom/globe/h-earth/terrain-estate-construction-v1/${part.file}`;
  check(exists(rel), `PRECOMPUTED_PART_MISSING:${part.file}`);
  const compressed = read(rel);
  check(compressed.length === part.compressedBytes, `PRECOMPUTED_PART_COMPRESSED_LENGTH:${part.file}`);
  check(sha256(compressed) === part.compressedSha256, `PRECOMPUTED_PART_COMPRESSED_DIGEST:${part.file}`);
  const expanded = zlib.gunzipSync(compressed);
  check(expanded.length === part.expandedBytes, `PRECOMPUTED_PART_EXPANDED_LENGTH:${part.file}`);
  check(sha256(expanded) === part.expandedSha256, `PRECOMPUTED_PART_EXPANDED_DIGEST:${part.file}`);
  expandedParts.push(expanded);
}
const payload = Buffer.concat(expandedParts);
check(payload.length === provenance.mesh.payloadBytes, 'PRECOMPUTED_PAYLOAD_LENGTH');
check(sha256(payload) === provenance.mesh.payloadSha256, 'PRECOMPUTED_PAYLOAD_DIGEST');
check(payload.subarray(0,7).toString('ascii') === 'AUDGMV1', 'PRECOMPUTED_PAYLOAD_MAGIC');
check(payload.readUInt32LE(8) === 1, 'PRECOMPUTED_PAYLOAD_VERSION');
const fullGzipPath = 'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.bin.gz';
const fullGzip = read(fullGzipPath);
check(sha256(fullGzip) === provenance.mesh.fullGzipSha256, 'PRECOMPUTED_FULL_GZIP_DIGEST');
check(sha256(zlib.gunzipSync(fullGzip)) === provenance.mesh.payloadSha256, 'PRECOMPUTED_FULL_GZIP_PAYLOAD');

const rendererPath = 'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs';
const tabletRuntimePath = 'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs';
const loaderPath = 'showroom/globe/h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs';
const indexPath = 'showroom/globe/audralia/index.html';
const canonicalRelativeImport = '../../../../inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
check(text(rendererPath).includes(canonicalRelativeImport), 'RENDERER_CANONICAL_GEOGRAPHY_NOT_BOUND');
check(text(tabletRuntimePath).includes(canonicalRelativeImport), 'TABLET_CANONICAL_GEOGRAPHY_NOT_BOUND');
check(!text(rendererPath).includes("../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js"), 'RENDERER_RETIRED_GEOGRAPHY_PATH_REACHABLE');
check(!text(tabletRuntimePath).includes("../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js"), 'TABLET_RETIRED_GEOGRAPHY_PATH_REACHABLE');
check(text(loaderPath).includes('AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1'), 'LOADER_PROVENANCE_GATE_MISSING');
check(text(loaderPath).includes(EXPECTED_GEOGRAPHY_BLOB), 'LOADER_GEOGRAPHY_FINGERPRINT_MISSING');
check(text(loaderPath).includes(EXPECTED_TERRAIN_BLOB), 'LOADER_TERRAIN_FINGERPRINT_MISSING');
const index = text(indexPath);
check(!index.includes('cdn.jsdelivr.net/gh/smansfield635-create/smansfield635-create.github.io@'), 'IMPORT_MAP_EXTERNAL_PIN_CAN_CHANGE_GEOGRAPHIC_TRUTH');
check(index.includes('/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs'), 'IMPORT_MAP_LOCAL_PRECOMPUTED_TARGET_MISSING');
check(index.includes(EXPECTED_GEOGRAPHY_BLOB), 'INDEX_GEOGRAPHY_FINGERPRINT_MISSING');
check(index.includes(EXPECTED_TERRAIN_BLOB), 'INDEX_TERRAIN_FINGERPRINT_MISSING');

const reachableRoots = [indexPath, rendererPath, tabletRuntimePath, loaderPath];
for (const rel of reachableRoots) {
  const source = text(rel);
  check(!source.includes(RETIRED_GEOGRAPHY_BLOB), `RETIRED_REV3_BLOB_REACHABLE:${rel}`);
  for (const id of LEGACY_RIVER_IDS) check(!source.includes(id), `LEGACY_RIVER_ID_REACHABLE:${rel}:${id}`);
}

const receiptPath = 'h-earth-3d/experience-anchor/receipts/AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_v1.json';
check(exists(receiptPath), 'EXPERIENCE_ANCHOR_RECEIPT_MISSING');
const receipt = JSON.parse(text(receiptPath));
check(receipt.schema === 'H_EARTH_EXPERIENCE_ANCHOR_ACCEPTANCE_RECEIPT_v1', 'EXPERIENCE_ANCHOR_RECEIPT_SCHEMA');
check(receipt.operationId === OPERATION_ID, 'EXPERIENCE_ANCHOR_RECEIPT_OPERATION');
check(receipt.controllingAnchorSha256 === '7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573', 'EXPERIENCE_ANCHOR_IDENTITY');
check(receipt.staticPreservation?.environment24057Unchanged === true, 'EXPERIENCE_ANCHOR_ENVIRONMENT_PRESERVATION');
check(receipt.staticPreservation?.cloudWeatherStormAtmosphereCelestialCameraNavigationUnchanged === true, 'EXPERIENCE_ANCHOR_PROTECTED_BYTES');
check(receipt.physicalPreview?.required === true, 'EXPERIENCE_ANCHOR_PHYSICAL_PREVIEW_REQUIRED');
check(receipt.physicalPreview?.disposition === 'PENDING', 'EXPERIENCE_ANCHOR_PREMATURE_PHYSICAL_CLAIM');

const generatorPath = 'tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-mesh-v1.mjs';
check(sha256(read(generatorPath)) === provenance.generator?.sha256, 'GENERATOR_DIGEST_PROVENANCE_MISMATCH');

console.log(JSON.stringify({
  schema: 'AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_VERIFICATION_v1',
  operationId: OPERATION_ID,
  result: 'PASS_STATIC_PHYSICAL_PREVIEW_PENDING',
  base: BASE,
  head: git('rev-parse','HEAD'),
  changedPaths: changed,
  canonicalGeographyBlob: EXPECTED_GEOGRAPHY_BLOB,
  canonicalTerrainBlob: EXPECTED_TERRAIN_BLOB,
  payloadSha256: provenance.mesh.payloadSha256,
  constrainedAndUnconstrainedAuthorityEqual: true,
  retiredRev3Reachable: false,
  legacyThreeRiverIdsReachable: false,
  importMapMayChangeGeographicTruth: false,
  physicalPreviewDisposition: 'PENDING'
}, null, 2));
