import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authority from '../../control-plane/post-cp2-round2/baked-material/h-earth.bm1-unique-baked-material-contract.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, passed, status: passed ? 'PASS' : 'FAIL', detail });
  if (!passed) failures.push({ id, detail });
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const head = git('rev-parse', 'HEAD');
const base = authority.controllingBasis.checkpoint8MergeHead;
const changedPaths = git('diff', '--name-only', `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [
  '.github/workflows/h-earth-bm1-unique-baked-material-contract.yml',
  'h-earth-3d/control-plane/post-cp2-round2/baked-material/h-earth.bm1-unique-baked-material-contract.v1.mjs',
  'h-earth-3d/validation/baked-material/h-earth.bm1-unique-baked-material-contract.mjs'
].sort();

check('EXACT_CP8_BASE', git('merge-base', base, head) === base, { base, head });
check('EXACT_BM1_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_PATH_CHANGED', changedPaths.every((entry) => !entry.startsWith('showroom/')), { changedPaths });
for (const [id, record] of Object.entries({
  ACCEPTED_RENDERER: { path: authority.controllingBasis.acceptedRendererPath, blob: authority.controllingBasis.acceptedRendererBlob },
  TERRAIN: { path: authority.controllingBasis.terrainPath, blob: authority.controllingBasis.terrainBlob },
  LIVE_HOST: { path: authority.controllingBasis.liveHostPath, blob: authority.controllingBasis.liveHostBlob },
  LIVE_BINDING: { path: authority.controllingBasis.liveBindingPath, blob: authority.controllingBasis.liveBindingBlob }
})) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_PRESERVED`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

const map = authority.mapContract;
check('MAP_DIMENSIONS_FIXED_1024', map.width === 1024 && map.height === 1024);
check('MAP_FORMAT_FIXED_RGBA8', map.channelCount === 4 && map.storage.startsWith('RGBA8_UNORM'));
check('MAP_BASE_BYTES_EXACT', map.baseByteLength === 1024 * 1024 * 4);
check('MAP_MIP_CHAIN_REQUIRED', map.mipmapsRequired === true && map.estimatedFullMipChainBytes >= 5592405 && map.estimatedFullMipChainBytes <= 5592406);
check('MAP_CANONICAL_DIGEST_FIXED', map.canonicalDigestAlgorithm === 'SHA-256' && map.deterministicByteIdentityRequired === true);
check('ALL_EIGHT_OFFLINE_DESCRIPTORS_REQUIRED', authority.offlineDescriptors.required.length === 8);
check('DESCRIPTORS_COLLAPSED_OFFLINE', authority.offlineDescriptors.runtimeDescriptorSampling === false && authority.offlineDescriptors.collapsedOutputs.length === 4);
check('UNIQUE_APERIODIC_REGION_LAW_FIXED', authority.regionLaw.coherentLandformSegmentationRequired === true && authority.regionLaw.uniqueWorldCoverage === true && authority.regionLaw.periodicTileGridVisibleAtRuntime === false);
check('ONE_MAP_ONE_SAMPLE_BUDGET_FIXED', authority.runtimeBudget.newPersistentTextures === 1 && authority.runtimeBudget.terrainFragmentTextureSamples === 1 && authority.runtimeBudget.controlFieldTextureSamples === 0 && authority.runtimeBudget.dynamicProceduralOctaveLoops === 0);
check('CP2_LIGHTING_AND_LANDMARK_TERMS_REQUIRED', authority.runtimeBudget.acceptedCp2LightingPreserved === true && authority.runtimeBudget.acceptedCp2ManorCavernRavineAndContactTermsPreserved === true);
check('THREE_AUTHORIZED_PRODUCT_PATHS_ONLY', authority.authorizedProgramProductPaths.length === 3 && new Set(authority.authorizedProgramProductPaths).size === 3);
check('NO_PHASE_OR_PROCEDURAL_ROUTE', authority.architecture.phaseWarping === false && authority.architecture.dynamicProceduralTerrainSynthesis === false && authority.architecture.continuousControlFieldModulation === false);
check('BM1_STOP_BOUNDARY', authority.boundaries.productMutationPerformed === false && authority.boundaries.descriptorImplementationStarted === false && authority.boundaries.mapBakeStarted === false && authority.boundaries.rendererIntegrationStarted === false && authority.boundaries.liveAdmissionAuthorized === false);

const stable = {
  receiptType: 'H_EARTH_BM1_UNIQUE_BAKED_MATERIAL_CONTRACT_RECEIPT_v1',
  result: failures.length === 0 ? authority.result : 'BM1_UNIQUE_BAKED_MATERIAL_CONTRACT_FAIL',
  pass: failures.length === 0,
  baseHead: base,
  executedHead: head,
  changedPaths,
  mapContract: map,
  runtimeBudget: authority.runtimeBudget,
  checks,
  failureCount: failures.length,
  failures,
  checkpointBM2Authorized: failures.length === 0,
  liveRouteChanged: false
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
