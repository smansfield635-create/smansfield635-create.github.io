import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import contract from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7b-control-field-contract.v1.mjs';
import authority from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7c-control-field-generator-execution.v1.mjs';
import {
  H_EARTH_TERRAIN_CONTROL_FIELD_ID,
  H_EARTH_TERRAIN_CONTROL_FIELD_WIDTH,
  H_EARTH_TERRAIN_CONTROL_FIELD_HEIGHT,
  H_EARTH_TERRAIN_CONTROL_FIELD_BYTE_LENGTH,
  generateHEarthTerrainControlField,
  getHEarthTerrainControlField,
  getHEarthTerrainControlFieldReceipt
} from '../../../showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const outputPath = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, 'h-earth-3d/validation/cp7/h-earth.cp7c-control-field-generator.receipt.v1.json');
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  if (!passed) failures.push({ id, detail });
};
const deepFrozen = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  if (ArrayBuffer.isView(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((entry) => deepFrozen(entry, seen));
};
const bytesEqual = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

const base = authority.controllingBasis.cp7bMergeHead;
const head = git(['rev-parse', 'HEAD']);
const changedPaths = git(['diff', '--name-only', `${base}..${head}`]).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactSubcheckpoint7CPathScope].sort();
check('AUTHORITY_DEEP_FROZEN', deepFrozen(authority));
check('EXACT_CP7B_BASE', git(['merge-base', base, head]) === base, { base, head });
check('EXACT_7C_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
const productPaths = changedPaths.filter((entry) => entry.startsWith('showroom/'));
check('GENERATOR_IS_ONLY_PRODUCT_MUTATION', JSON.stringify(productPaths) === JSON.stringify([authority.generatorProductPath]), { productPaths });

for (const [id, record] of Object.entries({
  CONTRACT: { path: authority.controllingBasis.contractPath, blob: authority.controllingBasis.contractBlob },
  TERRAIN: { path: authority.controllingBasis.terrainPath, blob: authority.controllingBasis.terrainBlob },
  ACCEPTED_RENDERER: { path: authority.controllingBasis.acceptedRendererPath, blob: authority.controllingBasis.acceptedRendererBlob },
  LIVE_HOST: { path: authority.controllingBasis.liveHostPath, blob: authority.controllingBasis.liveHostBlob },
  LIVE_BINDING: { path: authority.controllingBasis.liveBindingPath, blob: authority.controllingBasis.liveBindingBlob }
})) {
  const actual = git(['hash-object', record.path]);
  check(`${id}_BLOB_PRESERVED`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

const source = fs.readFileSync(path.join(ROOT, authority.generatorProductPath), 'utf8');
const prohibitedTokens = ['SCENE_01', 'SCENE_02', 'SCENE_03', 'SCENE_04', 'SCENE_05', 'SCENE_06', 'SCENE_07', 'SCENE_08', 'cameraId', 'targetName', 'manorCenter', 'cavernCenter', 'Math.random', 'Date.now', 'performance.now'];
const foundProhibited = prohibitedTokens.filter((token) => source.includes(token));
check('GENERATOR_HAS_NO_SCENE_CAMERA_SITE_OR_TIME_HACKS', foundProhibited.length === 0, { foundProhibited });
check('GENERATOR_CONSUMES_FROZEN_RUN8B_SAMPLER', source.includes('sampleHEarthRun8BSuccessorTerrainElevation') && source.includes('H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD'));
check('GENERATOR_EXPORT_SURFACE_COMPLETE', contract.generatorApiContract.requiredExports.every((name) => source.includes(`export ${name.startsWith('H_') ? 'const' : 'function'} ${name}`) || source.includes(`export function ${name}`)));

const first = generateHEarthTerrainControlField();
const second = generateHEarthTerrainControlField();
check('CONTROL_FIELD_IDENTITY', first.fieldId === H_EARTH_TERRAIN_CONTROL_FIELD_ID && second.fieldId === first.fieldId);
check('CONTROL_FIELD_DIMENSIONS', first.width === H_EARTH_TERRAIN_CONTROL_FIELD_WIDTH && first.height === H_EARTH_TERRAIN_CONTROL_FIELD_HEIGHT && first.width === contract.storage.width && first.height === contract.storage.height);
check('CONTROL_FIELD_BYTE_LENGTH', first.bytes.length === H_EARTH_TERRAIN_CONTROL_FIELD_BYTE_LENGTH && first.bytes.length === contract.storage.baseByteLength);
check('INDEPENDENT_GENERATIONS_BYTE_IDENTICAL', bytesEqual(first.bytes, second.bytes));
check('INDEPENDENT_GENERATIONS_DISTINCT_STORAGE', first.bytes !== second.bytes);
const nodeSha = sha256(first.bytes);
check('CANONICAL_SHA256_MATCHES_NODE_CRYPTO', first.canonicalSha256 === nodeSha && second.canonicalSha256 === nodeSha && /^[0-9a-f]{64}$/.test(nodeSha), { nodeSha, moduleFirst: first.canonicalSha256, moduleSecond: second.canonicalSha256 });
check('CANONICAL_DIGEST_ALGORITHM', first.canonicalDigestAlgorithm === 'SHA-256');
check('DOMAIN_AND_TEXEL_STEP_EXACT',
  first.domain.xMinimum < first.domain.xMaximum && first.domain.zMinimum < first.domain.zMaximum &&
  Math.abs(first.texelWorldStep.x - (first.domain.xMaximum - first.domain.xMinimum) / 255) < 1e-12 &&
  Math.abs(first.texelWorldStep.z - (first.domain.zMaximum - first.domain.zMinimum) / 255) < 1e-12,
  { domain: first.domain, texelWorldStep: first.texelWorldStep });
check('STRICT_LOWER_FLOW_ACCOUNTING', first.strictLowerReceiverLaw === true && first.sinkCount > 0 && first.receiverCount > 0 && first.sinkCount + first.receiverCount === 65536 && first.maximumFlowAccumulation > 1, { sinkCount: first.sinkCount, receiverCount: first.receiverCount, maximumFlowAccumulation: first.maximumFlowAccumulation });

const channelSets = [new Set(), new Set(), new Set(), new Set()];
for (let offset = 0; offset < first.bytes.length; offset += 4) {
  channelSets[0].add(first.bytes[offset]);
  channelSets[1].add(first.bytes[offset + 1]);
  channelSets[2].add(first.bytes[offset + 2]);
  channelSets[3].add(first.bytes[offset + 3]);
}
const channelDistinctCounts = channelSets.map((set) => set.size);
check('ALL_CHANNELS_NONCONSTANT', channelDistinctCounts.every((count) => count > 2), { channelDistinctCounts });
check('DIRECTION_CHANNELS_HAVE_BROAD_SUPPORT', channelDistinctCounts[0] > 16 && channelDistinctCounts[1] > 16, { channelDistinctCounts });
check('CURVATURE_CHANNEL_HAS_BROAD_SUPPORT', channelDistinctCounts[3] > 16, { channelDistinctCounts });

const cachedA = getHEarthTerrainControlField();
const originalFirstByte = cachedA.bytes[0];
cachedA.bytes[0] = originalFirstByte ^ 0xff;
const cachedB = getHEarthTerrainControlField();
check('CACHED_ACCESSOR_RETURNS_DEFENSIVE_BYTES', cachedB.bytes[0] === originalFirstByte && cachedA.bytes !== cachedB.bytes);
const runtimeReceipt = getHEarthTerrainControlFieldReceipt();
check('RUNTIME_RECEIPT_DEEP_FROZEN', deepFrozen(runtimeReceipt));
check('RUNTIME_RECEIPT_EXCLUDES_BYTES', !Object.prototype.hasOwnProperty.call(runtimeReceipt, 'bytes'));
check('RUNTIME_RECEIPT_CANONICAL_DIGEST', runtimeReceipt.canonicalSha256 === nodeSha);
check('METADATA_IMMUTABILITY_AND_CONTRACT', deepFrozen(first.domain) && deepFrozen(first.channels) && first.immutablePrivateStorage === true && first.mipmapsRequired === true);

check('NO_RENDERER_INTEGRATION_PERFORMED', authority.boundaries.rendererIntegrationPerformed === false && authority.boundaries.candidateRendererCreated === false);
check('LIVE_ROUTE_UNCHANGED', authority.boundaries.liveRouteChanged === false);

const stable = {
  receiptType: 'H_EARTH_CP7C_CONTROL_FIELD_GENERATOR_RECEIPT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7C',
  result: failures.length === 0 ? authority.result : 'CP7C_CONTROL_FIELD_GENERATOR_FAIL',
  pass: failures.length === 0,
  exactBaseHead: base,
  executedHead: head,
  changedPaths,
  generatorProductPath: authority.generatorProductPath,
  controlField: {
    fieldId: first.fieldId,
    width: first.width,
    height: first.height,
    baseByteLength: first.baseByteLength,
    canonicalSha256: nodeSha,
    runtimeFastDigest: first.runtimeFastDigest,
    minimumElevation: first.minimumElevation,
    maximumElevation: first.maximumElevation,
    maximumFlowAccumulation: first.maximumFlowAccumulation,
    maximumAbsoluteCurvature: first.maximumAbsoluteCurvature,
    sinkCount: first.sinkCount,
    receiverCount: first.receiverCount,
    channelDistinctCounts
  },
  repeatedGenerationByteIdentical: bytesEqual(first.bytes, second.bytes),
  rendererIntegrationPerformed: false,
  liveRouteChanged: false,
  checkpoint7DAuthorized: failures.length === 0,
  checks,
  failureCount: failures.length,
  failures
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(Buffer.from(JSON.stringify(stable))) };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
