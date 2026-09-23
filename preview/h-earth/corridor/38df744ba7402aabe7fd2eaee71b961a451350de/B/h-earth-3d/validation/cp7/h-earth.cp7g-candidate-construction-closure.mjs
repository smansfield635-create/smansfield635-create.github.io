import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import authority from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7g-candidate-construction-closure.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const outputPath = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, 'h-earth-3d/validation/cp7/h-earth.cp7g-candidate-construction-closure.receipt.v1.json');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  if (!passed) failures.push({ id, detail });
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const isDeepFrozen = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  seen.add(value);
  if (!Object.isFrozen(value)) return false;
  return Object.values(value).every((member) => isDeepFrozen(member, seen));
};

const base = authority.mergeChain.checkpoint7F;
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactSubcheckpoint7GPathScope].sort();
check('AUTHORITY_DEEP_FROZEN', isDeepFrozen(authority));
check('EXACT_CP7F_BASE', git('merge-base', base, head) === base, { base, head });
check('EXACT_7G_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_7G_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });

const mergeEntries = Object.entries(authority.mergeChain);
for (let index = 0; index < mergeEntries.length; index += 1) {
  const [id, merge] = mergeEntries[index];
  let ancestor = true;
  try { execFileSync('git', ['merge-base', '--is-ancestor', merge, head], { cwd: ROOT, stdio: 'pipe' }); }
  catch { ancestor = false; }
  check(`${id.toUpperCase()}_MERGE_IS_ANCESTOR`, ancestor, { merge });
  if (index > 0) {
    const prior = mergeEntries[index - 1][1];
    let ordered = true;
    try { execFileSync('git', ['merge-base', '--is-ancestor', prior, merge], { cwd: ROOT, stdio: 'pipe' }); }
    catch { ordered = false; }
    check(`${id.toUpperCase()}_FOLLOWS_PRIOR_MERGE`, ordered, { prior, merge });
  }
}

for (const [id, record] of Object.entries(authority.productIdentities)) {
  const actualBlob = git('hash-object', record.path);
  check(`${id.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}_BLOB_EXACT`, actualBlob === record.blob, { path: record.path, expected: record.blob, actual: actualBlob });
}

const cp7ProductPaths = git('diff', '--name-only', `${authority.mergeChain.checkpoint7A}..${head}`)
  .split(/\r?\n/).filter((entry) => entry.startsWith('showroom/')).sort();
const expectedProductPaths = [...authority.authorizedProductPathsAcrossCheckpoint7].sort();
check('WHOLE_CP7_PRODUCT_SCOPE_EXACT', JSON.stringify(cp7ProductPaths) === JSON.stringify(expectedProductPaths), { cp7ProductPaths, expectedProductPaths });

const candidatePath = path.join(ROOT, authority.productIdentities.isolatedCandidateRenderer.path);
const generatorPath = path.join(ROOT, authority.productIdentities.controlFieldGenerator.path);
const candidateSource = fs.readFileSync(candidatePath, 'utf8');
const generatorSource = fs.readFileSync(generatorPath, 'utf8');
check('CANDIDATE_SOURCE_SHA256_EXACT', sha256(candidateSource) === authority.productIdentities.isolatedCandidateRenderer.sourceSha256, { actual: sha256(candidateSource), expected: authority.productIdentities.isolatedCandidateRenderer.sourceSha256 });
const generatorModule = await import(`${pathToFileURL(generatorPath).href}?closure=${head.slice(0, 12)}`);
const fieldReceipt = generatorModule.getHEarthTerrainControlFieldReceipt();
check('CONTROL_FIELD_DIGEST_EXACT', fieldReceipt.canonicalSha256 === authority.productIdentities.controlFieldGenerator.canonicalControlFieldSha256, { actual: fieldReceipt.canonicalSha256, expected: authority.productIdentities.controlFieldGenerator.canonicalControlFieldSha256 });
check('CONTROL_FIELD_BYTES_EXACT', fieldReceipt.baseByteLength === 262144 && fieldReceipt.width === 256 && fieldReceipt.height === 256 && fieldReceipt.storage === 'RGBA8_UNORM');
check('CANDIDATE_AND_GENERATOR_PARSE', (() => {
  try {
    execFileSync(process.execPath, ['--check', candidatePath], { cwd: ROOT, stdio: 'pipe' });
    execFileSync(process.execPath, ['--check', generatorPath], { cwd: ROOT, stdio: 'pipe' });
    return true;
  } catch { return false; }
})());

for (const [id, record] of Object.entries(authority.evidenceLedger)) {
  check(`${id.toUpperCase()}_EVIDENCE_COMPLETE`, Number.isInteger(record.workflowRun) && record.workflowRun > 0 && Number.isInteger(record.artifactId) && record.artifactId > 0 && /^[0-9a-f]{64}$/.test(record.receiptSha256) && /^[0-9a-f]{64}$/.test(record.artifactSha256), record);
}
check('EVIDENCE_WORKFLOW_RUNS_UNIQUE', new Set(Object.values(authority.evidenceLedger).map((record) => record.workflowRun)).size === Object.keys(authority.evidenceLedger).length);
check('EVIDENCE_ARTIFACT_IDS_UNIQUE', new Set(Object.values(authority.evidenceLedger).map((record) => record.artifactId)).size === Object.keys(authority.evidenceLedger).length);
check('ROLLBACK_IS_NONLIVE_AND_BOUNDED', authority.rollback.liveRollbackRequired === false && authority.rollback.acceptedLiveRendererRemainsCP2 === true && authority.rollback.constructionRollbackAnchor === authority.mergeChain.checkpoint7D);
check('CLOSURE_BOUNDARY_EXACT', authority.closure.checkpoint7Result === 'PASS_CLOSED' && authority.closure.checkpoint8Authorized === true && authority.closure.engineeringPassDetermined === false && authority.closure.liveCandidateAvailable === false && authority.closure.liveRouteChanged === false && authority.closure.userDifferentialRequiredNow === false);

const stable = {
  receiptType: 'H_EARTH_CP7G_CANDIDATE_CONSTRUCTION_CLOSURE_RECEIPT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7G',
  result: failures.length === 0 ? authority.result : 'CP7G_CANDIDATE_CONSTRUCTION_CLOSURE_FAIL',
  pass: failures.length === 0,
  exactBaseHead: base,
  executedHead: head,
  changedPaths,
  mergeChain: authority.mergeChain,
  productPaths: cp7ProductPaths,
  candidateRendererBlob: git('hash-object', authority.productIdentities.isolatedCandidateRenderer.path),
  candidateSourceSha256: sha256(candidateSource),
  generatorBlob: git('hash-object', authority.productIdentities.controlFieldGenerator.path),
  generatorSourceSha256: sha256(generatorSource),
  canonicalControlFieldSha256: fieldReceipt.canonicalSha256,
  evidenceLedger: authority.evidenceLedger,
  rollback: authority.rollback,
  checkpoint7Status: failures.length === 0 ? 'PASS_CLOSED' : 'NOT_CLOSED',
  checkpoint8Authorized: failures.length === 0,
  engineeringPassDetermined: false,
  liveCandidateAvailable: false,
  liveRouteChanged: false,
  checks,
  failureCount: failures.length,
  failures
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
