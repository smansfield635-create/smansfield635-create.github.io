import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const get = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const repo = path.resolve(get('--repository') || '.');
const output = get('--output');
const C = 'control-plane/methods-information-benchmark/context-displacement-minimum-real-3d-proof-v1';

const receiptPaths = [
  `${C}/receipts/builder.receipt.v1.json`,
  `${C}/receipts/fresh-verifier.receipt.v1.json`,
  `${C}/receipts/independent-equality.receipt.v1.json`,
  `${C}/receipts/operation-closure.receipt.v1.json`
];

const corePaths = [
  '.github/workflows/methods-context-displacement-minimum-real-3d-proof-v1.yml',
  `${C}/README.md`,
  `${C}/index.html`,
  `${C}/styles.css`,
  `${C}/data.mjs`,
  `${C}/math.mjs`,
  `${C}/state.mjs`,
  `${C}/renderer.mjs`,
  `${C}/navigation.mjs`,
  `${C}/app.mjs`,
  `${C}/proof-contract.v1.json`,
  `${C}/smaller-corpus.fixture.v1.json`,
  `${C}/verify.v1.mjs`
];

const requiredPaths = [...corePaths, ...receiptPaths];
const errors = [];
const read = (file) => fs.readFileSync(path.join(repo, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));

for (const file of requiredPaths) {
  if (!fs.existsSync(path.join(repo, file))) errors.push(`MISSING:${file}`);
}
if (errors.length) finish();

const contract = readJson(`${C}/proof-contract.v1.json`);
const fixture = readJson(`${C}/smaller-corpus.fixture.v1.json`);
const builderReceipt = readJson(receiptPaths[0]);
const freshReceipt = readJson(receiptPaths[1]);
const equalityReceipt = readJson(receiptPaths[2]);
const closureReceipt = readJson(receiptPaths[3]);

if (requiredPaths.length !== 17 || corePaths.length !== 13 || receiptPaths.length !== 4 || contract.registeredPathCount !== 17) {
  errors.push('REGISTERED_PATH_COUNT_MISMATCH');
}
if (contract.minimumReference.stages !== 2 || contract.minimumReference.modelsPerStage !== 3 || contract.minimumReference.fullyPopulatedModel !== 'pcr') {
  errors.push('MINIMUM_REFERENCE_MISMATCH');
}
if (contract.authorityBoundary.publicPageMutation !== false || contract.authorityBoundary.mergeAuthorized !== false) {
  errors.push('AUTHORITY_BOUNDARY_MISMATCH');
}
if (fixture.stages.length !== 1 || fixture.stages[0].models.length !== 2) {
  errors.push('SMALLER_CORPUS_FIXTURE_MISMATCH');
}

const html = read(`${C}/index.html`);
const css = read(`${C}/styles.css`);
const renderer = read(`${C}/renderer.mjs`);
const navigation = read(`${C}/navigation.mjs`);
const state = read(`${C}/state.mjs`);
const app = read(`${C}/app.mjs`);

for (const token of ['Practical', 'Engineering', 'Evidence']) {
  if (!html.includes(token)) errors.push(`VISIBLE_LENS_MISSING:${token}`);
}
if (!renderer.includes("getContext('webgl2'")) errors.push('WEBGL2_CONTEXT_MISSING');
for (const token of ['pointerdown', 'pointermove', 'pointerup', 'wheel']) {
  if (!navigation.includes(token)) errors.push(`NAVIGATION_INPUT_MISSING:${token}`);
}
for (const token of ['createReturnEnvelope', 'verifyAndRestore', 'SHA-256']) {
  if (!state.includes(token)) errors.push(`EXACT_RETURN_MISSING:${token}`);
}
if (!css.includes('prefers-reduced-motion')) errors.push('REDUCED_MOTION_MISSING');
if (!app.includes('renderer.render(state)')) errors.push('PERSISTENT_FRAME_LOOP_MISSING');
for (const token of ['modal', 'previous-model', 'next-model', 'travel-button']) {
  if (html.includes(token)) errors.push(`PROHIBITED_PRIMARY_CONTROL:${token}`);
}

const expectedSchemas = new Map([
  [builderReceipt.schema, 'METHODS_MINIMUM_REAL_3D_PROOF_BUILDER_RECEIPT_v1'],
  [freshReceipt.schema, 'METHODS_MINIMUM_REAL_3D_PROOF_FRESH_VERIFIER_RECEIPT_v1'],
  [equalityReceipt.schema, 'METHODS_MINIMUM_REAL_3D_PROOF_INDEPENDENT_EQUALITY_RECEIPT_v1'],
  [closureReceipt.schema, 'METHODS_MINIMUM_REAL_3D_PROOF_OPERATION_CLOSURE_RECEIPT_v1']
]);
for (const [actual, expected] of expectedSchemas) {
  if (actual !== expected) errors.push(`RECEIPT_SCHEMA_MISMATCH:${expected}`);
}

const allowedStatuses = {
  builder: new Set(['CANDIDATE_MATERIALIZED_PENDING_WORKFLOW', 'PASS']),
  fresh: new Set(['PENDING_INDEPENDENT_WORKFLOW_EXECUTION', 'PASS']),
  equality: new Set(['PENDING_INDEPENDENT_WORKFLOW_EXECUTION', 'PASS']),
  closure: new Set(['CANDIDATE_OPEN', 'PASS_CLOSED'])
};
if (!allowedStatuses.builder.has(builderReceipt.status)) errors.push('BUILDER_RECEIPT_STATUS_INVALID');
if (!allowedStatuses.fresh.has(freshReceipt.status)) errors.push('FRESH_RECEIPT_STATUS_INVALID');
if (!allowedStatuses.equality.has(equalityReceipt.status)) errors.push('EQUALITY_RECEIPT_STATUS_INVALID');
if (!allowedStatuses.closure.has(closureReceipt.status)) errors.push('CLOSURE_RECEIPT_STATUS_INVALID');

const domain = {
  schema: 'METHODS_MINIMUM_REAL_3D_PROOF_CORE_FINGERPRINT_DOMAIN_v1',
  serialization: 'JSON_STRINGIFY_WITH_ORDERED_PATH_ARRAY',
  excludedVolatilePaths: receiptPaths,
  paths: corePaths.map((file) => ({
    path: file,
    sha256: crypto.createHash('sha256').update(read(file)).digest('hex')
  })),
  contract,
  fixture
};
const fingerprint = crypto.createHash('sha256').update(JSON.stringify(domain)).digest('hex');

if (closureReceipt.status === 'PASS_CLOSED') {
  if (builderReceipt.status !== 'PASS' || builderReceipt.fingerprint !== fingerprint) errors.push('FINAL_BUILDER_RECEIPT_MISMATCH');
  if (freshReceipt.status !== 'PASS' || freshReceipt.fingerprint !== fingerprint) errors.push('FINAL_FRESH_RECEIPT_MISMATCH');
  if (equalityReceipt.status !== 'PASS' || equalityReceipt.fingerprint !== fingerprint || equalityReceipt.exactNormalizedEquality !== true) errors.push('FINAL_EQUALITY_RECEIPT_MISMATCH');
  if (closureReceipt.fingerprint !== fingerprint || closureReceipt.lockGeneration !== 316 || closureReceipt.lockReleased !== true || closureReceipt.terminalDisposition !== 'PASS_CLOSED' || closureReceipt.constructionAuthorityTerminated !== true || closureReceipt.mergeAuthorized !== false || closureReceipt.publicMutation !== false) {
    errors.push('FINAL_CLOSURE_RECEIPT_MISMATCH');
  }
}

finish({
  schema: 'METHODS_MINIMUM_REAL_3D_PROOF_VERIFICATION_RECEIPT_v1',
  result: errors.length ? 'FAIL' : 'PASS',
  fingerprint,
  fingerprintDomainPathCount: corePaths.length,
  registeredPathCount: requiredPaths.length,
  receiptPathCount: receiptPaths.length,
  conditionsChecked: 18,
  errors
});

function finish(value = { schema: 'METHODS_MINIMUM_REAL_3D_PROOF_VERIFICATION_RECEIPT_v1', result: 'FAIL', errors }) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (output) fs.writeFileSync(output, text);
  else process.stdout.write(text);
  if (value.result !== 'PASS') process.exitCode = 1;
}
