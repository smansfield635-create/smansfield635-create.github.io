import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import authority from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7a-exact-implementation-baseline.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const outputPath = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, 'h-earth-3d/validation/cp7/h-earth.cp7a-exact-implementation-baseline.receipt.v1.json');
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, status: passed ? 'PASS' : 'FAIL', passed, detail };
  checks.push(record);
  if (!passed) failures.push({ id, detail });
};
const isDeepFrozen = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  seen.add(value);
  if (!Object.isFrozen(value)) return false;
  return Object.values(value).every((member) => isDeepFrozen(member, seen));
};

const base = authority.exactBaseHead;
const head = git(['rev-parse', 'HEAD']);
const mergeBase = git(['merge-base', base, head]);
const changedPaths = git(['diff', '--name-only', `${base}..${head}`])
  .split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactSubcheckpoint7APathScope].sort();

check('AUTHORITY_DEEP_FROZEN', isDeepFrozen(authority));
check('AUTHORITY_IDENTITY', authority.schemaVersion === 'H_EARTH_CP7A_EXACT_IMPLEMENTATION_BASELINE_v1');
check('EXACT_CP6_MERGE_BASE', mergeBase === base, { base, mergeBase, head });
check('EXACT_7A_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), {
  changedPaths,
  expectedPaths
});
check('NO_PRODUCT_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), {
  productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/'))
});

const inventoryResults = {};
for (const [key, record] of Object.entries(authority.frozenRuntimeInventory)) {
  const actualBlob = git(['hash-object', record.path]);
  inventoryResults[key] = { path: record.path, expectedBlob: record.blob, actualBlob };
  check(`FROZEN_${key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}_BLOB`, actualBlob === record.blob, inventoryResults[key]);
}

const envelope = authority.wholeCheckpoint7AuthorizedPathEnvelope;
check('WHOLE_CP7_PRODUCT_TARGETS_EXACT', JSON.stringify(envelope.exactProductTargets) === JSON.stringify([
  'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
  'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
]));
check('WHOLE_CP7_CONTROL_PREFIX_FIXED', envelope.controlPrefix === 'h-earth-3d/control-plane/post-cp2-round2/cp7/');
check('WHOLE_CP7_VALIDATION_PREFIX_FIXED', envelope.validationPrefix === 'h-earth-3d/validation/cp7/');
check('WHOLE_CP7_WORKFLOW_PREFIX_FIXED', envelope.workflowPrefix === '.github/workflows/h-earth-cp7');
check('ALL_OTHER_PRODUCT_PATHS_PROHIBITED', envelope.allOtherProductPathsProhibited === true);

const custodyRef = `refs/heads/${authority.preservedPreboundedWork.custodyBranch}`;
let custodyLookup = '';
try {
  custodyLookup = git(['ls-remote', 'origin', custodyRef]);
} catch {
  custodyLookup = '';
}
check('PREBOUNDED_WORK_CUSTODY_BRANCH_EXISTS', custodyLookup.length > 0, {
  custodyBranch: authority.preservedPreboundedWork.custodyBranch,
  lookup: custodyLookup
});
check('PREBOUNDED_WORK_NOT_ADMITTED', authority.preservedPreboundedWork.admittedIntoActiveCp7Branch === false);

check('SUBCHECKPOINT_BOUNDARY_EXACT',
  authority.boundaries.productMutationPerformed === false &&
  authority.boundaries.controlFieldContractDefined === false &&
  authority.boundaries.controlFieldGeneratorCreated === false &&
  authority.boundaries.candidateRendererCreatedOnActiveBranch === false &&
  authority.boundaries.liveRouteChanged === false &&
  authority.boundaries.liveCandidateAuthorized === false &&
  authority.boundaries.checkpoint7BMayStartOnlyAfter7AClosure === true);

const stableReceipt = {
  receiptType: 'H_EARTH_CP7A_EXACT_IMPLEMENTATION_BASELINE_RECEIPT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7A',
  result: failures.length === 0 ? authority.result : 'CP7A_EXACT_IMPLEMENTATION_BASELINE_FAIL',
  pass: failures.length === 0,
  exactBaseHead: base,
  executedHead: head,
  mergeBase,
  changedPaths,
  inventoryResults,
  custodyBranch: authority.preservedPreboundedWork.custodyBranch,
  custodyBranchExists: custodyLookup.length > 0,
  productMutationPerformed: false,
  liveRouteChanged: false,
  checkpoint7BAuthorized: failures.length === 0,
  checks,
  failureCount: failures.length,
  failures
};
const canonical = JSON.stringify(stableReceipt);
const receipt = {
  ...stableReceipt,
  canonicalSha256: crypto.createHash('sha256').update(canonical).digest('hex')
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
