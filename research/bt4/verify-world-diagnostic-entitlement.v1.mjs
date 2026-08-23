import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeEntitlement, serveRequestedState } from '../../preview/bt4/entitlement-v1/entitlement-engine.v1.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function readJson(rel) {
  return JSON.parse(read(rel));
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function evaluate(label, state, expected) {
  const entitlement = computeEntitlement(state);
  const served = serveRequestedState('QUALIFIED', state);
  assert(entitlement.state === expected, `${label}: entitlement expected ${expected}, observed ${entitlement.state}`);
  assert(served.served === expected, `${label}: served expected ${expected}, observed ${served.served}`);
  return { label, expected, entitlement: entitlement.state, served: served.served, blocked: served.blocked, reason: entitlement.reason };
}

// Lane A: bind to the real Audralia world/runtime publication contract.
const audraliaManifestPath = '.github/ai-router/publication-surfaces/audralia.json';
const audraliaIndexPath = 'showroom/globe/audralia/index.html';
const manifest = readJson(audraliaManifestPath);
const audraliaIndex = read(audraliaIndexPath);

assert(manifest.schema === 'PUBLICATION_SURFACE_VERIFICATION_v1', 'Audralia manifest schema mismatch');
assert(manifest.surfaceId === 'audralia', 'Audralia surface identity mismatch');
assert(manifest.runtime?.enabled === true, 'Audralia runtime verification is not enabled');
assert(manifest.runtime?.path === '/showroom/globe/audralia/', 'Audralia runtime path mismatch');
assert(typeof manifest.runtime?.readySelector === 'string' && manifest.runtime.readySelector.length > 0, 'Audralia runtime ready selector missing');
for (const check of manifest.checks || []) {
  if (check.path === '/showroom/globe/audralia/') {
    for (const marker of check.includes || []) {
      assert(audraliaIndex.includes(marker), `Audralia source missing required manifest marker: ${marker}`);
    }
  }
}

const worldBaseline = { epoch: 7, provenance: true, reproduction: true, evidence: 'supporting', authority: true, receiptEpoch: 7 };
const worldResults = [];
worldResults.push(evaluate('WORLD_BASELINE_CURRENT_RUNTIME_CONTRACT', worldBaseline, 'QUALIFIED'));
worldResults.push(evaluate('WORLD_RUNTIME_VERIFICATION_FAILURE', { ...worldBaseline, epoch: 8, reproduction: false }, 'HELD'));
worldResults.push(evaluate('WORLD_RUNTIME_REPAIRED_STALE_RECEIPT', { ...worldBaseline, epoch: 9, receiptEpoch: 7 }, 'SUPPORTED'));
worldResults.push(evaluate('WORLD_RUNTIME_FRESH_REQUALIFICATION', { ...worldBaseline, epoch: 9, receiptEpoch: 9 }, 'QUALIFIED'));
worldResults.push(evaluate('WORLD_SOURCE_IDENTITY_FAILURE', { ...worldBaseline, epoch: 10, provenance: false }, 'HELD'));

// Lane B: bind to the real Audralia diagnostic/qualification authority source.
const diagnosticPath = 'showroom/globe/audralia/diagnostic/index.inspection.authority.js';
const diagnosticSource = read(diagnosticPath);
const requiredDiagnosticTokens = [
  'AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY',
  'AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE',
  'AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_RECEIPT',
  'HELD_CONTRACT_MISMATCH',
  'HELD_MISSING_AUTHORITIES',
  'validationStatus',
  'manualReviewRequired',
  'receiptHash',
  'productionMutationAuthority: false',
  'runtimeAuthority: false',
  'systemReadinessClaimed: false'
];
for (const token of requiredDiagnosticTokens) {
  assert(diagnosticSource.includes(token), `Diagnostic authority binding token missing: ${token}`);
}

const diagnosticBaseline = { epoch: 21, provenance: true, reproduction: true, evidence: 'supporting', authority: true, receiptEpoch: 21 };
const diagnosticResults = [];
diagnosticResults.push(evaluate('DIAGNOSTIC_BASELINE_AUTHORITY_INTEGRITY', diagnosticBaseline, 'QUALIFIED'));
diagnosticResults.push(evaluate('DIAGNOSTIC_CONTRACT_MISMATCH', { ...diagnosticBaseline, epoch: 22, reproduction: false }, 'HELD'));
diagnosticResults.push(evaluate('DIAGNOSTIC_MISSING_REQUIRED_AUTHORITY', { ...diagnosticBaseline, epoch: 23, authority: false }, 'HELD'));
diagnosticResults.push(evaluate('DIAGNOSTIC_REPAIRED_STALE_RECEIPT', { ...diagnosticBaseline, epoch: 24, receiptEpoch: 21 }, 'SUPPORTED'));
diagnosticResults.push(evaluate('DIAGNOSTIC_FRESH_REQUALIFICATION', { ...diagnosticBaseline, epoch: 24, receiptEpoch: 24 }, 'QUALIFIED'));

const result = {
  schema: 'BT4_WORLD_DIAGNOSTIC_ENTITLEMENT_INVARIANCE_RESULT_v1',
  kernel: 'preview/bt4/entitlement-v1/entitlement-engine.v1.mjs',
  objectBindings: {
    worldRuntime: { manifest: audraliaManifestPath, source: audraliaIndexPath, surfaceId: manifest.surfaceId, runtime: manifest.runtime },
    diagnosticQualification: { source: diagnosticPath, readOnlyProductionAuthority: true }
  },
  worldResults,
  diagnosticResults,
  invariants: {
    sameKernel: true,
    failureContractsRepresentation: true,
    repairWithoutFreshReceiptDoesNotFullyRestore: true,
    freshReceiptRestoresStrongState: true
  },
  pass: true
};

console.log(JSON.stringify(result, null, 2));
