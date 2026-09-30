import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
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
function manifestPathToRepoPath(publicPath) {
  const rel = publicPath.replace(/^\/+/, '');
  return publicPath.endsWith('/') ? `${rel}index.html` : rel;
}
function parseDiagnosticContracts(source) {
  const requiredBlock = source.match(/var REQUIRED_GLOBALS = Object\.freeze\(\[([\s\S]*?)\]\);/);
  const contractsBlock = source.match(/var EXPECTED_CONTRACTS = Object\.freeze\(\{([\s\S]*?)\}\);/);
  assert(requiredBlock && contractsBlock, 'Diagnostic authority contract declarations could not be parsed');
  const required = [...requiredBlock[1].matchAll(/"([A-Z0-9_]+)"/g)].map(m => m[1]);
  const contracts = Object.fromEntries([...contractsBlock[1].matchAll(/([A-Z0-9_]+):\s*"([^"]+)"/g)].map(m => [m[1], m[2]]));
  assert(required.length > 0, 'Diagnostic authority required-global set is empty');
  for (const name of required) assert(contracts[name], `Expected contract missing for required diagnostic global: ${name}`);
  return { required, contracts };
}
function executeDiagnosticAuthority(source, { missing = null, mismatch = null } = {}) {
  const { required, contracts } = parseDiagnosticContracts(source);
  const context = {};
  for (const name of required) {
    if (name === missing) continue;
    context[name] = {
      CONTRACT: name === mismatch ? `${contracts[name]}__PERTURBED` : contracts[name],
      VERSION: 'fixture',
      FILE: `fixture/${name}.js`,
      getStatus() { return { fixture: true, symbol: name }; }
    };
  }
  vm.runInNewContext(source, context, { filename: 'index.inspection.authority.js', timeout: 3000 });
  const state = context.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE;
  const receipt = context.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_RECEIPT;
  assert(state && receipt, 'Diagnostic authority failed to publish state/receipt in controlled execution');
  return {
    correspondenceStatus: state.correspondenceStatus,
    validationStatus: state.validationStatus,
    manualReviewRequired: state.manualReviewRequired,
    absentCount: state.familySummary?.absentCount,
    mismatchCount: state.familySummary?.mismatchCount,
    receiptResult: receipt.result,
    receiptHash: receipt.receiptHash
  };
}

// Lane A: bind to the real Audralia world/runtime publication contract.
const audraliaManifestPath = '.github/ai-router/publication-surfaces/audralia.json';
const manifest = readJson(audraliaManifestPath);

assert(manifest.schema === 'PUBLICATION_SURFACE_VERIFICATION_v1', 'Audralia manifest schema mismatch');
assert(manifest.surfaceId === 'audralia', 'Audralia surface identity mismatch');
assert(manifest.runtime?.enabled === true, 'Audralia runtime verification is not enabled');
assert(manifest.runtime?.path === '/showroom/globe/audralia/', 'Audralia runtime path mismatch');
assert(typeof manifest.runtime?.readySelector === 'string' && manifest.runtime.readySelector.length > 0, 'Audralia runtime ready selector missing');
assert(Array.isArray(manifest.checks) && manifest.checks.length > 0, 'Audralia manifest has no static checks');

const validatedManifestPaths = [];
for (const check of manifest.checks) {
  const repoPath = manifestPathToRepoPath(check.path);
  const source = read(repoPath);
  for (const marker of check.includes || []) {
    assert(source.includes(marker), `Audralia manifest include missing at ${check.path}: ${marker}`);
  }
  for (const marker of check.excludes || []) {
    assert(!source.includes(marker), `Audralia manifest exclusion violated at ${check.path}: ${marker}`);
  }
  validatedManifestPaths.push({ publicPath: check.path, repoPath, includes: (check.includes || []).length, excludes: (check.excludes || []).length });
}

const worldBaseline = { epoch: 7, provenance: true, reproduction: true, evidence: 'supporting', authority: true, receiptEpoch: 7 };
const worldResults = [];
worldResults.push(evaluate('WORLD_BASELINE_CURRENT_RUNTIME_CONTRACT', worldBaseline, 'QUALIFIED'));
worldResults.push(evaluate('WORLD_RUNTIME_VERIFICATION_FAILURE', { ...worldBaseline, epoch: 8, reproduction: false }, 'HELD'));
worldResults.push(evaluate('WORLD_RUNTIME_REPAIRED_STALE_RECEIPT', { ...worldBaseline, epoch: 9, receiptEpoch: 7 }, 'SUPPORTED'));
worldResults.push(evaluate('WORLD_RUNTIME_FRESH_REQUALIFICATION', { ...worldBaseline, epoch: 9, receiptEpoch: 9 }, 'QUALIFIED'));
worldResults.push(evaluate('WORLD_SOURCE_IDENTITY_FAILURE', { ...worldBaseline, epoch: 10, provenance: false }, 'HELD'));

// Lane B: execute the real Audralia diagnostic authority under controlled authority perturbations.
const diagnosticPath = 'showroom/globe/audralia/diagnostic/index.inspection.authority.js';
const diagnosticSource = read(diagnosticPath);
const baselineDiagnostic = executeDiagnosticAuthority(diagnosticSource);
const diagnosticContracts = parseDiagnosticContracts(diagnosticSource);
const missingSymbol = diagnosticContracts.required[0];
const mismatchSymbol = diagnosticContracts.required[1];
const missingDiagnostic = executeDiagnosticAuthority(diagnosticSource, { missing: missingSymbol });
const mismatchDiagnostic = executeDiagnosticAuthority(diagnosticSource, { mismatch: mismatchSymbol });

assert(baselineDiagnostic.correspondenceStatus === 'AVAILABLE', `Diagnostic baseline expected AVAILABLE, observed ${baselineDiagnostic.correspondenceStatus}`);
assert(baselineDiagnostic.validationStatus === 'VALID', `Diagnostic baseline expected VALID, observed ${baselineDiagnostic.validationStatus}`);
assert(baselineDiagnostic.manualReviewRequired === false, 'Diagnostic baseline unexpectedly requires manual review');
assert(missingDiagnostic.correspondenceStatus === 'HELD_MISSING_AUTHORITIES', `Missing-authority execution expected HELD_MISSING_AUTHORITIES, observed ${missingDiagnostic.correspondenceStatus}`);
assert(missingDiagnostic.absentCount === 1, `Missing-authority execution expected absentCount=1, observed ${missingDiagnostic.absentCount}`);
assert(mismatchDiagnostic.correspondenceStatus === 'HELD_CONTRACT_MISMATCH', `Contract-mismatch execution expected HELD_CONTRACT_MISMATCH, observed ${mismatchDiagnostic.correspondenceStatus}`);
assert(mismatchDiagnostic.validationStatus === 'HELD', `Contract-mismatch execution expected validationStatus=HELD, observed ${mismatchDiagnostic.validationStatus}`);
assert(mismatchDiagnostic.mismatchCount === 1, `Contract-mismatch execution expected mismatchCount=1, observed ${mismatchDiagnostic.mismatchCount}`);

const diagnosticBaseline = { epoch: 21, provenance: true, reproduction: baselineDiagnostic.validationStatus === 'VALID', evidence: 'supporting', authority: !baselineDiagnostic.manualReviewRequired, receiptEpoch: 21 };
const diagnosticResults = [];
diagnosticResults.push(evaluate('DIAGNOSTIC_BASELINE_AUTHORITY_INTEGRITY', diagnosticBaseline, 'QUALIFIED'));
diagnosticResults.push(evaluate('DIAGNOSTIC_CONTRACT_MISMATCH', { ...diagnosticBaseline, epoch: 22, reproduction: mismatchDiagnostic.validationStatus === 'VALID' }, 'HELD'));
diagnosticResults.push(evaluate('DIAGNOSTIC_MISSING_REQUIRED_AUTHORITY', { ...diagnosticBaseline, epoch: 23, authority: !missingDiagnostic.manualReviewRequired }, 'HELD'));
diagnosticResults.push(evaluate('DIAGNOSTIC_REPAIRED_STALE_RECEIPT', { ...diagnosticBaseline, epoch: 24, receiptEpoch: 21 }, 'SUPPORTED'));
diagnosticResults.push(evaluate('DIAGNOSTIC_FRESH_REQUALIFICATION', { ...diagnosticBaseline, epoch: 24, receiptEpoch: 24 }, 'QUALIFIED'));

const result = {
  schema: 'BT4_WORLD_DIAGNOSTIC_ENTITLEMENT_INVARIANCE_RESULT_v1',
  kernel: 'preview/bt4/entitlement-v1/entitlement-engine.v1.mjs',
  objectBindings: {
    worldRuntime: { manifest: audraliaManifestPath, surfaceId: manifest.surfaceId, runtime: manifest.runtime, validatedManifestPaths },
    diagnosticQualification: {
      source: diagnosticPath,
      executedRealAuthority: true,
      baseline: baselineDiagnostic,
      perturbations: {
        missingAuthority: { symbol: missingSymbol, observed: missingDiagnostic },
        contractMismatch: { symbol: mismatchSymbol, observed: mismatchDiagnostic }
      }
    }
  },
  worldResults,
  diagnosticResults,
  invariants: {
    sameKernel: true,
    realDiagnosticAuthorityExecuted: true,
    failureContractsRepresentation: true,
    repairWithoutFreshReceiptDoesNotFullyRestore: true,
    freshReceiptRestoresStrongState: true
  },
  pass: true
};

console.log(JSON.stringify(result, null, 2));
