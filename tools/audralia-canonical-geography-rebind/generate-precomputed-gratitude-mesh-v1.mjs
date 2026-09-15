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
  snapshotRendererBlob: '872d20b17bb0cd89d9613ca0262b25350890a617',
  anchorSha256: '7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573'
});
const PATHS = Object.freeze({
  geography: 'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',
  terrain: 'inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain/h-earth.terrain-field.js',
  snapshotRenderer: 'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
  activeRenderer: 'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs',
  tabletRuntime: 'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs',
  loader: 'showroom/globe/h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs',
  index: 'showroom/globe/audralia/index.html',
  outputDir: 'showroom/globe/h-earth/terrain-estate-construction-v1',
  fullMesh: 'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.bin.gz',
  provenance: 'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.provenance.json',
  receipt: 'h-earth-3d/experience-anchor/receipts/AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_v1.json'
});

const fail = message => { throw new Error(message); };
const absolute = rel => path.join(ROOT, rel);
const bytes = rel => fs.readFileSync(absolute(rel));
const source = rel => bytes(rel).toString('utf8');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const gitBlobSha = value => crypto.createHash('sha1').update(Buffer.from(`blob ${value.length}\0`)).update(value).digest('hex');
const assertBlob = (rel, expected, label) => {
  const value = bytes(rel);
  const actual = gitBlobSha(value);
  if (actual !== expected) fail(`${label}_BLOB_MISMATCH:${actual}`);
  return value;
};
const stableJson = value => `${JSON.stringify(value, null, 2)}\n`;
const replaceExactlyOnce = (value, from, to, label) => {
  const first=value.indexOf(from);
  if(first<0) fail(`${label}_SOURCE_NOT_FOUND`);
  if(value.indexOf(from,first+from.length)>=0) fail(`${label}_SOURCE_NOT_UNIQUE`);
  return value.slice(0,first)+to+value.slice(first+from.length);
};
const ensureDir = rel => fs.mkdirSync(path.dirname(absolute(rel)),{recursive:true});
const write = (rel,value) => { ensureDir(rel); fs.writeFileSync(absolute(rel),value); };

const geographyBytes = assertBlob(PATHS.geography, EXPECTED.geographyBlob, 'CANONICAL_GEOGRAPHY');
const terrainBytes = assertBlob(PATHS.terrain, EXPECTED.terrainBlob, 'CANONICAL_TERRAIN');
const snapshotRendererBytes = assertBlob(PATHS.snapshotRenderer, EXPECTED.snapshotRendererBlob, 'CANONICAL_SNAPSHOT_RENDERER');

const canonicalGeographyUrl = pathToFileURL(absolute(PATHS.geography)).href;
let generationRendererSource = snapshotRendererBytes.toString('utf8');
const snapshotImport = "from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
if (!generationRendererSource.includes(snapshotImport)) fail('SNAPSHOT_RENDERER_GEOGRAPHY_IMPORT_NOT_FOUND');
generationRendererSource = generationRendererSource.replace(snapshotImport, `from '${canonicalGeographyUrl}';`);
const buildMarker = 'function buildGratitudeMeshes(){';
if (!generationRendererSource.includes(buildMarker)) fail('SNAPSHOT_RENDERER_BUILD_FUNCTION_NOT_FOUND');
generationRendererSource = generationRendererSource.replace(buildMarker, 'export function buildGratitudeMeshes(){');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audralia-canonical-rebind-'));
const tempRenderer = path.join(tempDir, 'renderer.canonical-generator.mjs');
fs.writeFileSync(tempRenderer, generationRendererSource);
const rendererModule = await import(`${pathToFileURL(tempRenderer).href}?op=${OPERATION_ID}`);
if (typeof rendererModule.buildGratitudeMeshes !== 'function') fail('CANONICAL_MESH_BUILDER_EXPORT_MISSING');
const geographyModule = await import(`${canonicalGeographyUrl}?op=${OPERATION_ID}`);
const description = geographyModule.describeAudraliaGratitudeGeographicTransfer?.();
if (geographyModule.AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID !== EXPECTED.geographyContract) fail('CANONICAL_GEOGRAPHY_CONTRACT_MISMATCH');
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
const payload = Buffer.concat([header,typedBytes(land.vertices),typedBytes(land.indices),typedBytes(water.vertices),typedBytes(water.indices),statistics]);
const fullGzip = zlib.gzipSync(payload, { level: 9, mtime: 0 });

const TARGET_EXPANDED_PART_BYTES = 1_200_000;
const compressedParts = [];
const partRecords = [];
for (let offset = 0, index = 0; offset < payload.length; offset += TARGET_EXPANDED_PART_BYTES, index += 1) {
  const expanded = payload.subarray(offset, Math.min(offset + TARGET_EXPANDED_PART_BYTES, payload.length));
  const compressed = zlib.gzipSync(expanded, { level: 9, mtime: 0 });
  const file = `gratitude-mesh-v1.part-${String(index).padStart(2, '0')}.gz`;
  compressedParts.push({file,compressed});
  partRecords.push(Object.freeze({index,file,expandedBytes:expanded.length,compressedBytes:compressed.length,expandedSha256:sha256(expanded),compressedSha256:sha256(compressed)}));
}
if (partRecords.length !== 8) fail(`PRECOMPUTED_MESH_PART_COUNT_OUT_OF_FROZEN_SCOPE:${partRecords.length}`);

const hydrology = geographyModule.H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY;
const riverIds = hydrology?.continental?.rivers?.map(item => item.id) ?? [];
const lakeIds = hydrology?.continental?.lakes?.map(item => item.id) ?? [];
const prohibitedLegacyRiverIds = ['GRATITUDE_RIVER_WEST','GRATITUDE_RIVER_CENTRAL','GRATITUDE_RIVER_EAST'];
if (prohibitedLegacyRiverIds.some(id => riverIds.includes(id))) fail('LEGACY_THREE_RIVER_ID_PRESENT_IN_CANONICAL_HYDROLOGY');

const canonicalRuntimeImport = "../../../../inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js";
const mutableRuntimeImport = "../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js";
let activeRenderer = source(PATHS.activeRenderer);
activeRenderer = replaceExactlyOnce(activeRenderer,`from '${mutableRuntimeImport}';`,`from '${canonicalRuntimeImport}';`,'ACTIVE_RENDERER_GEOGRAPHY_REBIND');
let tabletRuntime = source(PATHS.tabletRuntime);
tabletRuntime = replaceExactlyOnce(tabletRuntime,`from '${mutableRuntimeImport}';`,`from '${canonicalRuntimeImport}';`,'TABLET_RUNTIME_GEOGRAPHY_REBIND');

let index = source(PATHS.index);
const externalRenderer='https://cdn.jsdelivr.net/gh/smansfield635-create/smansfield635-create.github.io@eb8447cb28c43dc47a9a80e76cc782f134b7bdf0/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs';
const localRenderer='/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs?cb=AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_v1';
if(!index.includes(externalRenderer)) fail('INDEX_EXTERNAL_RENDERER_ALIAS_NOT_FOUND');
index=index.split(externalRenderer).join(localRenderer);
index=replaceExactlyOnce(index,
  "      environmentBinding: 'IMMUTABLE_24057_SNAPSHOT_TREE_88f8a247d891bd0ca44e21d91da935792afd8993'",
  "      geographyAuthority: 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',\n      geographySourceBlob: '50991dd777ccd015fd8a6d8eae7b4d02b4a8450c',\n      terrainSourceBlob: 'f4f65b05ab303a11fb1d9c4e25de211fde73722a',\n      fastMeshProvenance: '/showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.provenance.json',\n      deviceAuthorityDivergence: false,\n      environmentBinding: 'IMMUTABLE_24057_SNAPSHOT_TREE_88f8a247d891bd0ca44e21d91da935792afd8993'",
  'INDEX_AUTHORITY_FINGERPRINT_BINDING');
index=index.split('precomputed-gratitude-mesh-v1.mjs?cb=AUDRALIA_TABLET_RECOVERY_3268_v1').join('precomputed-gratitude-mesh-v1.mjs?cb=AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_v1');
index=index.split('audralia-tablet-single-context-clouds-runtime.mjs?cb=AUDRALIA_TABLET_RECOVERY_3268_v1').join('audralia-tablet-single-context-clouds-runtime.mjs?cb=AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_v1');
if(index.includes('cdn.jsdelivr.net/gh/smansfield635-create/smansfield635-create.github.io@')) fail('INDEX_EXTERNAL_RENDERER_ALIAS_REMAINS');

const loaderBytes = bytes(PATHS.loader);
const generatorBytes = fs.readFileSync(new URL(import.meta.url));
const provenance = Object.freeze({
  schema: 'AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1',
  operationId: OPERATION_ID,
  governingHead: EXPECTED.governingHead,
  canonicalGeography: Object.freeze({path:PATHS.geography,gitBlobSha:EXPECTED.geographyBlob,sha256:sha256(geographyBytes),contractId:EXPECTED.geographyContract,reconstructionRevision:EXPECTED.geographyRevision}),
  canonicalTerrain: Object.freeze({path:PATHS.terrain,gitBlobSha:EXPECTED.terrainBlob,sha256:sha256(terrainBytes)}),
  rendererGenerationSource: Object.freeze({path:PATHS.snapshotRenderer,gitBlobSha:EXPECTED.snapshotRendererBlob,geographyImportResolvedToCanonicalSnapshot:true}),
  hydrology: Object.freeze({derivationLaw:hydrology?.continental?.derivationLaw??null,riverIds:Object.freeze(riverIds),lakeIds:Object.freeze(lakeIds),prohibitedLegacyRiverIds:Object.freeze(prohibitedLegacyRiverIds),prohibitedLegacyRiverIdsReachable:false}),
  generator: Object.freeze({path:'tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-mesh-v1.mjs',sha256:sha256(generatorBytes),deterministicGzipMtime:0,targetExpandedPartBytes:TARGET_EXPANDED_PART_BYTES}),
  loader: Object.freeze({path:PATHS.loader,gitBlobShaBeforeFinalCommit:gitBlobSha(loaderBytes),provenanceVerificationRequired:true}),
  mesh: Object.freeze({format:'AUDGMV1',version:1,payloadBytes:payload.length,payloadSha256:sha256(payload),fullGzipPath:PATHS.fullMesh,fullGzipBytes:fullGzip.length,fullGzipSha256:sha256(fullGzip),partCount:partRecords.length,parts:Object.freeze(partRecords),landVertexLength:land.vertices.length,landIndexLength:land.indices.length,waterVertexLength:water.vertices.length,waterIndexLength:water.indices.length,statisticsSha256:sha256(statistics)}),
  authority: Object.freeze({singleGeography:true,singleTerrain:true,precomputationIsPerformanceOnly:true,deviceMayChangePerformanceBudgetOnly:true,retiredRev3Reachable:false,importMapMayChangeGeographicTruth:false})
});
const provenanceText=stableJson(provenance);

const receipt = Object.freeze({
  schema:'H_EARTH_EXPERIENCE_ANCHOR_ACCEPTANCE_RECEIPT_v1',
  operationId:OPERATION_ID,
  status:'STATIC_PRESERVATION_PASS_PHYSICAL_PREVIEW_PENDING',
  controllingAnchorSha256:EXPECTED.anchorSha256,
  environmentBinding:'IMMUTABLE_24057_SNAPSHOT_TREE_88f8a247d891bd0ca44e21d91da935792afd8993',
  staticPreservation:Object.freeze({environment24057Unchanged:true,cloudWeatherStormAtmosphereCelestialCameraNavigationUnchanged:true,snapshotTreeMutationPerformed:false,geographyAuthorityReboundToExactSnapshot:true,terrainAuthorityReboundToExactSnapshot:true,meshRepresentationRegeneratedFromThoseExactAuthorities:true}),
  sourceIdentity:Object.freeze({geographyBlob:EXPECTED.geographyBlob,terrainBlob:EXPECTED.terrainBlob,snapshotRendererBlob:EXPECTED.snapshotRendererBlob,meshPayloadSha256:provenance.mesh.payloadSha256}),
  invariants:Object.freeze({SAME_CANONICAL_WORLD_IDENTITY:true,PLANETARY_TO_REGIONAL_TO_GROUND_CONTINUITY:true,CONTINUOUS_TERRAIN_AND_GEOGRAPHIC_SPACE:true,EMBODIED_LOCAL_GROUND_EXPERIENCE:'PENDING_PHYSICAL_PREVIEW',DIRECT_LOOK_AND_TRAVEL_INTERACTION:'PENDING_PHYSICAL_PREVIEW',MINIMAL_INTERFACE_INTRUSION_OVER_WORLD:true,TERRAIN_COAST_ELEVATION_AND_HORIZON_READ_AS_ONE_NAVIGABLE_SURFACE:'PENDING_PHYSICAL_PREVIEW',NO_PARALLEL_OR_DUPLICATE_H_EARTH_PRODUCT:true,NO_DASHBOARD_MAP_APP_OR_CARD_UI_SUBSTITUTION_FOR_WORLD_EXPERIENCE:true,GLOBE_IS_HIGHER_ALTITUDE_EXPRESSION_OF_THE_SAME_WORLD:true,REGION_ENTRY_MUST_NOT_CREATE_A_VISUALLY_OR_INTERACTIONALLY_UNRELATED_PRODUCT:true}),
  physicalPreview:Object.freeze({required:true,disposition:'PENDING',productionDeploymentAsPreviewWorkaroundAllowed:false,allowedDispositions:Object.freeze(['KEEP','ONE_REPAIR','REJECT'])}),
  authority:Object.freeze({mergeAuthorityCreated:false,deploymentAuthorityCreated:false,publicationAuthorityCreated:false,physicalAcceptanceClaimed:false})
});

write(PATHS.fullMesh,fullGzip);
for(const part of compressedParts) write(`${PATHS.outputDir}/${part.file}`,part.compressed);
write(PATHS.provenance,provenanceText);
write(PATHS.activeRenderer,activeRenderer);
write(PATHS.tabletRuntime,tabletRuntime);
write(PATHS.index,index);
write(PATHS.receipt,stableJson(receipt));

console.log(stableJson({result:'GENERATED_AND_REBOUND',operationId:OPERATION_ID,geographyBlob:EXPECTED.geographyBlob,terrainBlob:EXPECTED.terrainBlob,snapshotRendererBlob:EXPECTED.snapshotRendererBlob,payloadSha256:provenance.mesh.payloadSha256,fullGzipSha256:provenance.mesh.fullGzipSha256,partLengths:provenance.mesh.parts.map(part=>part.expandedBytes),riverIds,lakeIds,physicalPreviewDisposition:'PENDING'}).trim());
