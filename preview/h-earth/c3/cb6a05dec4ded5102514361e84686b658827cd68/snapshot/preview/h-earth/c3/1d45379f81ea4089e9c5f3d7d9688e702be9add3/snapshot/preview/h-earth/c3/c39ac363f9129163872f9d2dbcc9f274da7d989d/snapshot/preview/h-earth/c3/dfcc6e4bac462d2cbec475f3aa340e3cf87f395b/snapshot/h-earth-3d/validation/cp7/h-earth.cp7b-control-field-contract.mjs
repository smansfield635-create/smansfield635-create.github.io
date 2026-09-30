import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import contract from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7b-control-field-contract.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const outputPath = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, 'h-earth-3d/validation/cp7/h-earth.cp7b-control-field-contract.receipt.v1.json');
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  if (!passed) failures.push({ id, detail });
};
const deepFrozen = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((entry) => deepFrozen(entry, seen));
};

const base = contract.controllingBasis.cp7aMergeHead;
const head = git(['rev-parse', 'HEAD']);
const changedPaths = git(['diff', '--name-only', `${base}..${head}`]).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...contract.exactSubcheckpoint7BPathScope].sort();
check('CONTRACT_DEEP_FROZEN', deepFrozen(contract));
check('CONTRACT_IDENTITY', contract.schemaVersion === 'H_EARTH_CP7B_TERRAIN_CONTROL_FIELD_CONTRACT_v1');
check('EXACT_CP7A_BASE', git(['merge-base', base, head]) === base, { base, head });
check('EXACT_7B_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('ACCEPTED_CP2_RENDERER_PRESERVED', git(['hash-object', contract.controllingBasis.acceptedCp2RendererPath]) === contract.controllingBasis.acceptedCp2RendererBlob);
check('SUCCESSOR_TERRAIN_FIELD_PRESERVED', git(['hash-object', contract.controllingBasis.successorTerrainFieldPath]) === contract.controllingBasis.successorTerrainFieldBlob);
check('CUSTODY_DRAFT_NOT_AUTHORITY', contract.controllingBasis.custodyDraftIsAuthority === false && contract.controllingBasis.custodyDraftAdmitted === false);

check('STORAGE_CONTRACT_EXACT',
  contract.storage.width === 256 && contract.storage.height === 256 &&
  contract.storage.channelCount === 4 && contract.storage.format === 'RGBA8_UNORM' &&
  contract.storage.baseByteLength === 262144 && contract.storage.mipmapsRequiredAtRendererIntegration === true &&
  contract.storage.immutableAfterGeneration === true && contract.storage.consumerReceivesDefensiveByteCopy === true);
check('WORLD_MAPPING_EXACT',
  contract.sourceAndMapping.texelCoordinateLaw.firstTexel === 'EXACT_DOMAIN_X_MINIMUM_Z_MINIMUM' &&
  contract.sourceAndMapping.texelCoordinateLaw.lastTexel === 'EXACT_DOMAIN_X_MAXIMUM_Z_MAXIMUM' &&
  contract.sourceAndMapping.texelCoordinateLaw.rowsAdvanceTowardIncreasingWorldZ === true &&
  contract.sourceAndMapping.texelCoordinateLaw.columnsAdvanceTowardIncreasingWorldX === true &&
  contract.sourceAndMapping.shaderUvLaw.wrapS === 'CLAMP_TO_EDGE' &&
  contract.sourceAndMapping.shaderUvLaw.wrapT === 'CLAMP_TO_EDGE');
check('DIRECTION_AND_FLOW_LAW_EXACT',
  contract.derivativeAndFlowLaw.neighborOrderForDeterministicTieBreak.length === 8 &&
  contract.derivativeAndFlowLaw.strictLowerEpsilon === 1e-12 &&
  contract.derivativeAndFlowLaw.flowAccumulation.includes('DESCENDING_ELEVATION') &&
  contract.derivativeAndFlowLaw.cycleDisposition.includes('STRICTLY_LOWER'));
check('CHANNELS_COMPLETE', Object.keys(contract.channels).sort().join(',') === 'alpha,blue,green,red');
check('CHANNEL_SEMANTICS_EXACT',
  contract.channels.red.semantic === 'ENCODED_DOWNSLOPE_DIRECTION_X' &&
  contract.channels.green.semantic === 'ENCODED_DOWNSLOPE_DIRECTION_Z' &&
  contract.channels.blue.semantic === 'NORMALIZED_FLOW_ACCUMULATION_OR_DRAINAGE_STRENGTH' &&
  contract.channels.alpha.semantic === 'NORMALIZED_SIGNED_CURVATURE_OR_LANDFORM_CLASS');
check('CANONICAL_DIGEST_EXACT',
  contract.canonicalizationAndDigest.canonicalDigestAlgorithm === 'SHA-256' &&
  contract.canonicalizationAndDigest.canonicalDigestEncoding === 'LOWERCASE_HEXADECIMAL_64_CHARACTERS' &&
  contract.canonicalizationAndDigest.canonicalDigestInput === 'EXACT_262144_BASE_LEVEL_BYTES_ONLY' &&
  contract.canonicalizationAndDigest.metadataExcludedFromCanonicalDigest === true &&
  contract.canonicalizationAndDigest.repeatedGenerationMustBeByteIdentical === true);
check('GENERATOR_API_FIXED',
  contract.generatorApiContract.requiredExports.length === 7 &&
  contract.generatorApiContract.generationFunctionMustPermitIndependentRepeatedRuns === true &&
  contract.generatorApiContract.returnedBytesAlwaysDefensiveCopy === true);
check('NO_CONTROL_FIELD_BYTES_GENERATED', contract.boundaries.controlFieldBytesGenerated === false && contract.boundaries.generatorImplemented === false);
check('NO_RENDERER_INTEGRATION', contract.boundaries.rendererIntegrationPerformed === false && contract.boundaries.liveRouteChanged === false);
check('CHECKPOINT_7C_AUTHORIZED_AFTER_MERGE', contract.boundaries.checkpoint7CMayStartOnlyAfter7BMerge === true);

const stable = {
  receiptType: 'H_EARTH_CP7B_CONTROL_FIELD_CONTRACT_RECEIPT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7B',
  result: failures.length === 0 ? contract.result : 'CP7B_CONTROL_FIELD_CONTRACT_FAIL',
  pass: failures.length === 0,
  exactBaseHead: base,
  executedHead: head,
  changedPaths,
  format: { width: contract.storage.width, height: contract.storage.height, format: contract.storage.format, baseByteLength: contract.storage.baseByteLength },
  canonicalDigestAlgorithm: contract.canonicalizationAndDigest.canonicalDigestAlgorithm,
  productMutationPerformed: false,
  controlFieldBytesGenerated: false,
  checkpoint7CAuthorized: failures.length === 0,
  checks,
  failureCount: failures.length,
  failures
};
const canonicalSha256 = crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex');
const receipt = { ...stable, canonicalSha256 };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
