import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import authority from '../../control-plane/post-cp2-round2/baked-material/h-earth.bm3-unique-material-bake-authority.v1.mjs';
import { generateHEarthBM3UniqueMaterialField } from '../../authoring/round2-baked-material/h-earth.bm3-unique-material-bake.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, passed, status: passed ? 'PASS' : 'FAIL', detail });
  if (!passed) failures.push({ id, detail });
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const exactBytes = (left, right) => {
  if (left.byteLength !== right.byteLength) return false;
  for (let index = 0; index < left.byteLength; index += 1) if (left[index] !== right[index]) return false;
  return true;
};

const head = git('rev-parse', 'HEAD');
const base = authority.controllingBasis.bm2MergeHead;
const changedPaths = git('diff', '--name-only', `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
check('EXACT_BM2_BASE', git('merge-base', base, head) === base, { base, head });
check('EXACT_BM3_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify([...authority.exactPathScope].sort()), { changedPaths, expected: authority.exactPathScope });
const productPaths = changedPaths.filter((entry) => entry.startsWith('showroom/'));
check('EXACT_TWO_BAKED_PRODUCT_PATHS', JSON.stringify(productPaths) === JSON.stringify([authority.product.metadataPath, authority.product.rawMapPath].sort()), { productPaths });
for (const [id, record] of Object.entries({
  ACCEPTED_RENDERER: { path: authority.controllingBasis.acceptedRendererPath, blob: authority.controllingBasis.acceptedRendererBlob },
  TERRAIN: { path: authority.controllingBasis.terrainPath, blob: authority.controllingBasis.terrainBlob },
  LIVE_HOST: { path: authority.controllingBasis.liveHostPath, blob: authority.controllingBasis.liveHostBlob },
  LIVE_BINDING: { path: authority.controllingBasis.liveBindingPath, blob: authority.controllingBasis.liveBindingBlob }
})) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_PRESERVED`, actual === record.blob, { expected: record.blob, actual });
}

const first = generateHEarthBM3UniqueMaterialField();
const second = generateHEarthBM3UniqueMaterialField();
check('TWO_GENERATIONS_BYTE_EXACT', first.canonicalSha256 === second.canonicalSha256 && exactBytes(first.bytes, second.bytes), { first: first.canonicalSha256, second: second.canonicalSha256 });
check('DIMENSIONS_AND_BYTE_LENGTH_EXACT', first.width === authority.product.width && first.height === authority.product.height && first.byteLength === authority.product.byteLength);
const rawPath = path.join(ROOT, authority.product.rawMapPath);
const metadataPath = path.join(ROOT, authority.product.metadataPath);
check('RAW_MAP_EXISTS', fs.existsSync(rawPath));
check('METADATA_EXISTS', fs.existsSync(metadataPath));
const raw = fs.readFileSync(rawPath);
const rawDigest = sha256(raw);
check('RAW_MAP_EXACT_BYTE_LENGTH', raw.byteLength === authority.gates.exactByteLength, { actual: raw.byteLength });
check('RAW_MAP_DIGEST_MATCHES_GENERATOR', rawDigest === first.canonicalSha256, { rawDigest, generated: first.canonicalSha256 });
check('RAW_MAP_BYTES_MATCH_GENERATOR', exactBytes(raw, first.bytes));
const metadata = await import(`${pathToFileURL(metadataPath).href}?head=${head}`);
check('METADATA_DIMENSIONS_EXACT', metadata.H_EARTH_BAKED_MATERIAL_FIELD_WIDTH === first.width && metadata.H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT === first.height);
check('METADATA_BYTE_LENGTH_EXACT', metadata.H_EARTH_BAKED_MATERIAL_FIELD_BYTE_LENGTH === first.byteLength);
check('METADATA_DIGEST_EXACT', metadata.H_EARTH_BAKED_MATERIAL_FIELD_SHA256 === first.canonicalSha256);
check('METADATA_SOURCE_DIGESTS_EXACT', metadata.H_EARTH_BAKED_MATERIAL_SOURCE_DESCRIPTOR_SHA256 === first.sourceDescriptorDigest && metadata.H_EARTH_BAKED_MATERIAL_SOURCE_SEGMENTATION_SHA256 === first.sourceSegmentationDigest);

const rgb = new Set();
const alpha = new Set();
let redMinimum = 255, redMaximum = 0, greenMinimum = 255, greenMaximum = 0, blueMinimum = 255, blueMaximum = 0, alphaMinimum = 255, alphaMaximum = 0;
for (let offset = 0; offset < raw.length; offset += 4) {
  const r = raw[offset], g = raw[offset + 1], b = raw[offset + 2], a = raw[offset + 3];
  if (rgb.size < authority.gates.minimumDistinctRgbTriples + 1) rgb.add((r << 16) | (g << 8) | b);
  alpha.add(a);
  redMinimum = Math.min(redMinimum, r); redMaximum = Math.max(redMaximum, r);
  greenMinimum = Math.min(greenMinimum, g); greenMaximum = Math.max(greenMaximum, g);
  blueMinimum = Math.min(blueMinimum, b); blueMaximum = Math.max(blueMaximum, b);
  alphaMinimum = Math.min(alphaMinimum, a); alphaMaximum = Math.max(alphaMaximum, a);
}
check('DISTINCT_RGB_SUFFICIENT', rgb.size >= authority.gates.minimumDistinctRgbTriples, { distinctRgbAtLeast: rgb.size });
check('ALPHA_LEVELS_SUFFICIENT', alpha.size >= authority.gates.minimumAlphaLevels, { alphaLevels: alpha.size });
check('ALL_CHANNELS_NONCONSTANT', redMinimum < redMaximum && greenMinimum < greenMaximum && blueMinimum < blueMaximum && alphaMinimum < alphaMaximum, { redMinimum, redMaximum, greenMinimum, greenMaximum, blueMinimum, blueMaximum, alphaMinimum, alphaMaximum });
check('ONE_FIXED_BAKE_ONLY', authority.synthesisLaw.oneFixedBake === true && authority.synthesisLaw.parameterSweep === false && authority.synthesisLaw.secondAtlas === false);
check('NO_RUNTIME_PERIODIC_SYNTHESIS', authority.synthesisLaw.periodicRuntimeSignals === false && authority.synthesisLaw.runtimeSynthesis === false);
check('RENDERER_INTEGRATION_NOT_STARTED', authority.boundaries.rendererIntegrationStarted === false && authority.boundaries.liveAdmissionAuthorized === false);

const stable = {
  receiptType: 'H_EARTH_BM3_UNIQUE_1024_BAKED_MATERIAL_FIELD_RECEIPT_v1',
  result: failures.length === 0 ? authority.result : 'BM3_UNIQUE_1024_BAKED_MATERIAL_FIELD_FAIL',
  pass: failures.length === 0,
  baseHead: base,
  executedHead: head,
  changedPaths,
  rawMapPath: authority.product.rawMapPath,
  metadataPath: authority.product.metadataPath,
  canonicalMapSha256: rawDigest,
  byteLength: raw.byteLength,
  dimensions: { width: first.width, height: first.height },
  sourceDescriptorDigest: first.sourceDescriptorDigest,
  sourceSegmentationDigest: first.sourceSegmentationDigest,
  activeRegionCount: first.activeRegionCount,
  representedClassCount: first.representedClassCount,
  distinctRgbAtLeast: rgb.size,
  alphaLevelCount: alpha.size,
  channelRanges: { red: [redMinimum, redMaximum], green: [greenMinimum, greenMaximum], blue: [blueMinimum, blueMaximum], alpha: [alphaMinimum, alphaMaximum] },
  checks,
  failureCount: failures.length,
  failures,
  checkpointBM4Authorized: failures.length === 0,
  rendererIntegrationStarted: false,
  liveRouteChanged: false
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
