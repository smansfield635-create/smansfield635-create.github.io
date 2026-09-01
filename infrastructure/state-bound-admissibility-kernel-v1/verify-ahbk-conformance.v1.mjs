#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SPEC_SHA256 = '1c61a7101763dd39815b76b3dc71e9b6767c3be42f511860f572af73b343f297';
const SPEC_BYTES = 28702;
const BASE = 'c2dbceb0267b124f5c34ac2fdf5245fc2015bca3';
const VALUES = new Set(['SURVIVE', 'FAIL', 'UNINTERPRETABLE']);
const U_REASONS = new Set([
  'MEASUREMENT_INVALID',
  'SEMANTIC_MAPPING_INVALID',
  'EXECUTION_IDENTITY_INVALID',
  'CUSTODY_INVALID',
  'PROVENANCE_INVALID',
  'OTHER_PREDECLARED_UNINTERPRETABLE'
]);
const REQUIRED_CASES = [
  'EMPTY_CANDIDATE_SPACE',
  'NO_ENTRY_ADMISSIBLE_CANDIDATES',
  'NO_SURVIVORS',
  'NO_FAILURES',
  'ALL_UNINTERPRETABLE',
  'ALL_INCOMPARABLE',
  'DISCONNECTED_POSET',
  'NONMONOTONE_RESULT',
  'NOMINAL_MAXIMUM_UNINTERPRETABLE',
  'PARTIAL_OBSERVATION_COVERAGE',
  'INVALID_OR_CYCLIC_ORDER',
  'DUPLICATE_CANDIDATE_IDENTITY',
  'UNRESOLVED_ADMISSIBILITY'
];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = 'infrastructure/state-bound-admissibility-kernel-v1';
const PATHS = [
  `${DIR}/AHBK_NORMATIVE_SPECIFICATION_v1.md`,
  `${DIR}/ahbk-contract.v1.json`,
  `${DIR}/ahbk-output.schema.v1.json`,
  `${DIR}/cmapss-nonexecuting-binding.v1.json`,
  `${DIR}/fixtures/synthetic-edge-cases.v1.json`,
  `${DIR}/verify-ahbk-conformance.v1.mjs`,
  `${DIR}/receipts/AHBK_SPECIFICATION_CONFORMANCE_RECEIPT_v1.json`
].sort();

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
const canonical = value => JSON.stringify(stable(value));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = relative => fs.readFileSync(path.join(ROOT, relative));
const json = relative => JSON.parse(read(relative).toString('utf8'));
const pairKey = (a, b) => `${a}\u0000${b}`;
const sortedPairs = pairs => pairs.map(([a, b]) => [a, b]).sort((x, y) => canonical(x).localeCompare(canonical(y)));

function fail(code, detail = null) {
  const error = new Error(detail == null ? code : `${code}:${typeof detail === 'string' ? detail : canonical(detail)}`);
  error.code = code;
  error.detail = detail;
  throw error;
}
function assert(condition, code, detail = null) {
  if (!condition) fail(code, detail);
}
function args(argv) {
  const result = { base: BASE, candidate: 'HEAD' };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--base' || token === '--candidate') result[token.slice(2)] = argv[++index];
    else fail('UNKNOWN_ARGUMENT', token);
  }
  return result;
}
function git(argv) {
  const run = spawnSync('git', argv, { cwd: ROOT, encoding: 'utf8' });
  if (run.status !== 0) fail('GIT_COMMAND_FAILED', { argv, stderr: run.stderr.trim() });
  return run.stdout.trim();
}
function verifyExactDelta(base, candidate) {
  assert(git(['rev-parse', base]) === BASE, 'GOVERNING_HEAD_MISMATCH');
  const candidateHead = git(['rev-parse', candidate]);
  const changed = git(['diff', '--name-only', `${base}..${candidate}`]).split(/\r?\n/).filter(Boolean).sort();
  assert(canonical(changed) === canonical(PATHS), 'EXACT_PATH_DELTA_MISMATCH', { expected: PATHS, actual: changed });
  assert(git(['status', '--porcelain']) === '', 'WORKTREE_NOT_CLEAN');
  return { candidateHead, changedPaths: changed };
}

function components(ids, relation) {
  const adjacency = new Map(ids.map(id => [id, new Set()]));
  for (const a of ids) for (const b of ids) {
    if (a !== b && (relation.has(pairKey(a, b)) || relation.has(pairKey(b, a)))) {
      adjacency.get(a).add(b);
      adjacency.get(b).add(a);
    }
  }
  const seen = new Set();
  const output = [];
  for (const seed of [...ids].sort()) {
    if (seen.has(seed)) continue;
    const queue = [seed];
    const group = [];
    seen.add(seed);
    while (queue.length) {
      const current = queue.shift();
      group.push(current);
      for (const neighbor of [...adjacency.get(current)].sort()) if (!seen.has(neighbor)) {
        seen.add(neighbor);
        queue.push(neighbor);
      }
    }
    output.push(group.sort());
  }
  return output.sort((a, b) => canonical(a).localeCompare(canonical(b)));
}

function validateOrder(ids, relationPairs) {
  const idSet = new Set(ids);
  const relation = new Set();
  for (const pair of relationPairs) {
    assert(Array.isArray(pair) && pair.length === 2, 'INVALID_OR_CYCLIC_ORDER', pair);
    const [a, b] = pair;
    assert(idSet.has(a) && idSet.has(b), 'INVALID_OR_CYCLIC_ORDER', pair);
    relation.add(pairKey(a, b));
  }
  for (const id of ids) assert(relation.has(pairKey(id, id)), 'INVALID_OR_CYCLIC_ORDER', `REFLEXIVITY:${id}`);
  for (const a of ids) for (const b of ids) {
    if (a !== b && relation.has(pairKey(a, b)) && relation.has(pairKey(b, a))) {
      fail('INVALID_OR_CYCLIC_ORDER', `ANTISYMMETRY:${a}:${b}`);
    }
  }
  for (const a of ids) for (const b of ids) for (const c of ids) {
    if (relation.has(pairKey(a, b)) && relation.has(pairKey(b, c)) && !relation.has(pairKey(a, c))) {
      fail('INVALID_OR_CYCLIC_ORDER', `TRANSITIVITY:${a}:${b}:${c}`);
    }
  }
  return relation;
}

function outcomeCode({ ids, entered, V, F, U, I, N, missing, disconnected, relation }) {
  if (ids.length === 0) return 'EMPTY_CANDIDATE_SPACE';
  if (entered.length === 0) return 'NO_ENTRY_ADMISSIBLE_CANDIDATES';
  if (missing.length) return 'PARTIAL_OBSERVATION_COVERAGE';
  if (N.length) return 'NONMONOTONE_RESULT';
  if (U.length === entered.length) return 'ALL_UNINTERPRETABLE';
  const everyDistinctPairIncomparable = entered.length > 1 && I.length === entered.length * (entered.length - 1) / 2;
  if (everyDistinctPairIncomparable) return 'ALL_INCOMPARABLE';
  const nominalUninterpretable = U.some(record => !entered.some(other => other !== record.candidateId && relation.has(pairKey(record.candidateId, other))))
    && V.some(v => U.some(record => relation.has(pairKey(v, record.candidateId)) && v !== record.candidateId));
  if (nominalUninterpretable) return 'NOMINAL_MAXIMUM_UNINTERPRETABLE';
  const hasStrictComparison = entered.some(a => entered.some(b => a !== b && relation.has(pairKey(a, b))));
  if (disconnected.length > 1 && hasStrictComparison) return 'DISCONNECTED_POSET';
  if (V.length === 0 && F.length > 0) return 'NO_SURVIVORS';
  if (F.length === 0 && V.length > 0) return 'NO_FAILURES';
  return 'EVALUATED_BOUNDARY';
}

function evaluateFixture(fixture) {
  const candidates = fixture.candidates;
  assert(Array.isArray(candidates), 'FIXTURE_INVALID', fixture.id);
  const ids = candidates.map(candidate => candidate.id);
  if (new Set(ids).size !== ids.length) fail('DUPLICATE_CANDIDATE_IDENTITY');
  const relation = validateOrder(ids, fixture.relation);
  const enteredRecords = candidates.filter(candidate => candidate.entryStatus === 'PASS');
  const entered = enteredRecords.map(candidate => candidate.id).sort();
  for (const candidate of candidates) {
    assert(['PASS', 'FAIL', 'UNRESOLVED'].includes(candidate.entryStatus), 'FIXTURE_INVALID', candidate.id);
    if (candidate.entryStatus !== 'PASS') assert(candidate.classification === null, 'EXCLUDED_CANDIDATE_HAS_CLASSIFICATION', candidate.id);
    if (candidate.classification !== null) assert(VALUES.has(candidate.classification), 'INVALID_CLASSIFICATION', candidate.id);
    if (candidate.classification === 'UNINTERPRETABLE') {
      assert(U_REASONS.has(candidate.uninterpretableReason), 'INVALID_UNINTERPRETABILITY_REASON', candidate.id);
    }
  }
  const classification = new Map(enteredRecords.map(candidate => [candidate.id, candidate.classification]));
  const V = entered.filter(id => classification.get(id) === 'SURVIVE');
  const F = entered.filter(id => classification.get(id) === 'FAIL');
  const R_star = V.filter(v => !V.some(v2 => v !== v2 && relation.has(pairKey(v, v2)))).sort();
  const F_min = F.filter(f => !F.some(f2 => f !== f2 && relation.has(pairKey(f2, f)))).sort();
  const incomparable = [];
  for (let i = 0; i < entered.length; i += 1) for (let j = i + 1; j < entered.length; j += 1) {
    const [a, b] = [entered[i], entered[j]];
    if (!relation.has(pairKey(a, b)) && !relation.has(pairKey(b, a))) incomparable.push([a, b]);
  }
  const nonmonotone = [];
  for (const a of entered) for (const b of entered) {
    if (a !== b && relation.has(pairKey(a, b)) && classification.get(a) === 'FAIL' && classification.get(b) === 'SURVIVE') {
      nonmonotone.push([a, b]);
    }
  }
  const uninterpretable = enteredRecords
    .filter(candidate => candidate.classification === 'UNINTERPRETABLE')
    .map(candidate => ({ candidateId: candidate.id, reason: candidate.uninterpretableReason }))
    .sort((a, b) => a.candidateId.localeCompare(b.candidateId));
  const missing = enteredRecords.filter(candidate => candidate.classification === null).map(candidate => candidate.id).sort();
  const disconnected = components(ids, relation);
  const code = outcomeCode({ ids, entered, V, F, U: uninterpretable, I: incomparable, N: nonmonotone, missing, disconnected, relation });
  const evaluationCoverage = ids.length === 0 || entered.length === 0 || uninterpretable.length === entered.length
    ? 'UNCOMPLETED'
    : missing.length ? 'PARTIAL' : 'COMPLETE';
  return stable({
    structuralConformance: 'PASS',
    outcomeCode: code,
    evaluationCoverage,
    R_star,
    F_min,
    I: sortedPairs(incomparable),
    N: sortedPairs(nonmonotone),
    U: uninterpretable,
    missingObligations: missing,
    disconnectedComponents: disconnected
  });
}

function verifyFixtures(contract, suite) {
  assert(suite.schema === 'AHBK_SYNTHETIC_EDGE_CASE_SUITE_v1', 'FIXTURE_SCHEMA_MISMATCH');
  assert(suite.scientificAuthority === 'NONE_SYNTHETIC_CONFORMANCE_ONLY', 'SYNTHETIC_AUTHORITY_LEAK');
  const ids = suite.fixtures.map(fixture => fixture.id);
  assert(canonical(ids) === canonical(REQUIRED_CASES), 'REQUIRED_EDGE_CASE_SET_MISMATCH', { expected: REQUIRED_CASES, actual: ids });
  assert(canonical(contract.requiredEdgeCases) === canonical(REQUIRED_CASES), 'CONTRACT_EDGE_CASE_SET_MISMATCH');
  const results = [];
  for (const fixture of suite.fixtures) {
    if (fixture.expectedFailure) {
      let caught = null;
      try { evaluateFixture(fixture); } catch (error) { caught = error; }
      assert(caught, 'EXPECTED_FIXTURE_FAILURE_NOT_OBSERVED', fixture.id);
      assert(caught.code === fixture.expectedFailure.errorCode, 'EXPECTED_FIXTURE_ERROR_CODE_MISMATCH', { fixture: fixture.id, expected: fixture.expectedFailure.errorCode, actual: caught.code });
      assert(fixture.expectedFailure.structuralConformance === 'FAIL' && fixture.expectedFailure.frontierOutputAuthorized === false, 'INVALID_EXPECTED_FAILURE_BOUNDARY', fixture.id);
      results.push({ fixtureId: fixture.id, result: 'PASS_EXPECTED_FAIL_CLOSED', errorCode: caught.code });
    } else {
      const actual = evaluateFixture(fixture);
      assert(canonical(actual) === canonical(fixture.expected), 'EDGE_CASE_FIXTURE_FAILURE', { fixture: fixture.id, expected: fixture.expected, actual });
      results.push({ fixtureId: fixture.id, result: 'PASS', outcomeCode: actual.outcomeCode });
    }
  }
  return results;
}

function verifySchema(schema, contract) {
  assert(schema.$id === 'AHBK_OUTPUT_SCHEMA_v1', 'OUTPUT_SCHEMA_ID_MISMATCH');
  const output = schema.properties?.ahbk_output;
  assert(output && output.additionalProperties === false, 'OUTPUT_SCHEMA_OPEN_OR_MISSING');
  assert(canonical(output.required) === canonical(contract.requiredOutputSections), 'OUTPUT_SCHEMA_REQUIRED_SECTIONS_MISMATCH');
  const boundaries = output.properties?.boundaries;
  assert(canonical(boundaries?.required) === canonical(contract.requiredBoundaryArrays), 'OUTPUT_SCHEMA_BOUNDARY_ARRAYS_MISMATCH');
  for (const key of contract.requiredBoundaryArrays) assert(boundaries.properties?.[key], 'OUTPUT_SCHEMA_BOUNDARY_MISSING', key);
  assert(canonical(output.properties.status.properties.structural_conformance.enum) === canonical(['PASS', 'FAIL']), 'OUTPUT_SCHEMA_STATUS_ENUM_MISMATCH');
  assert(canonical(output.properties.evaluations.properties.evaluation_state.enum) === canonical(['NOT_EVALUATED', 'PARTIAL', 'COMPLETE']), 'OUTPUT_SCHEMA_EVALUATION_ENUM_MISMATCH');
}

function verifyCmapss(binding) {
  assert(binding.schema === 'AHBK_CMAPSS_NONEXECUTING_BINDING_v1', 'CMAPSS_BINDING_SCHEMA_MISMATCH');
  assert(binding.status.structuralConformance === 'PASS', 'CMAPSS_STRUCTURAL_CONFORMANCE_MISMATCH');
  assert(binding.status.executionAuthorization === 'PROHIBITED', 'CMAPSS_EXECUTION_AUTHORITY_LEAK');
  assert(binding.status.experimentalCompletion === 'UNCOMPLETED', 'CMAPSS_EXPERIMENTAL_COMPLETION_MISREPRESENTATION');
  assert(binding.status.claimEntitlement === 'NOT_ENTITLED', 'CMAPSS_CLAIM_ENTITLEMENT_LEAK');
  assert(binding.status.evaluationState === 'NOT_EVALUATED', 'CMAPSS_EVALUATION_STATE_MISMATCH');
  assert(canonical(binding.presentBoundaries.R_star) === '[]', 'CMAPSS_R_STAR_NOT_EMPTY');
  assert(canonical(binding.presentBoundaries.F_min) === '[]', 'CMAPSS_F_MIN_NOT_EMPTY');
  assert(canonical(binding.presentBoundaries.I) === canonical([['A1', 'A2']]), 'CMAPSS_INCOMPARABILITY_MISMATCH');
  assert(canonical(binding.presentBoundaries.N) === '[]' && canonical(binding.presentBoundaries.U) === '[]', 'CMAPSS_UNEVALUATED_BOUNDARY_MISMATCH');
  assert(Object.values(binding.authorityEffects).every(value => value === false), 'CMAPSS_AUTHORITY_EFFECT_LEAK');
}

function verifyReceipt(receipt) {
  assert(receipt.schema === 'AHBK_SPECIFICATION_CONFORMANCE_RECEIPT_v1', 'RECEIPT_SCHEMA_MISMATCH');
  assert(receipt.result === 'PASS_STRUCTURAL_CONFORMANCE_ONLY', 'RECEIPT_RESULT_MISMATCH');
  assert(receipt.experimentalCompletion === 'UNCOMPLETED', 'RECEIPT_EXPERIMENTAL_COMPLETION_MISREPRESENTATION');
  assert(receipt.claimEntitlement === 'NOT_ENTITLED', 'RECEIPT_CLAIM_ENTITLEMENT_LEAK');
  assert(receipt.cmapssExecutionAuthorization === 'PROHIBITED', 'RECEIPT_CMAPSS_EXECUTION_AUTHORITY_LEAK');
  assert(receipt.syntheticFixtureCount === REQUIRED_CASES.length, 'RECEIPT_FIXTURE_COUNT_MISMATCH');
  const expectedPaths = PATHS.filter(relative => !relative.endsWith('/receipts/AHBK_SPECIFICATION_CONFORMANCE_RECEIPT_v1.json'));
  assert(canonical(Object.keys(receipt.artifactDigests).sort()) === canonical(expectedPaths), 'RECEIPT_ARTIFACT_SET_MISMATCH');
  const actual = Object.fromEntries(expectedPaths.map(relative => [relative, sha256(read(relative))]));
  assert(canonical(actual) === canonical(receipt.artifactDigests), 'RECEIPT_ARTIFACT_DIGEST_MISMATCH');
  assert(receipt.packageFingerprint === sha256(canonical(actual)), 'RECEIPT_PACKAGE_FINGERPRINT_MISMATCH');
  assert(Object.values(receipt.authorityEffects).every(value => value === false), 'RECEIPT_AUTHORITY_EFFECT_LEAK');
}

function main() {
  const parsed = args(process.argv.slice(2));
  const exact = verifyExactDelta(parsed.base, parsed.candidate);
  const specBytes = read(`${DIR}/AHBK_NORMATIVE_SPECIFICATION_v1.md`);
  assert(specBytes.length === SPEC_BYTES, 'SOURCE_SPECIFICATION_BYTE_LENGTH_MISMATCH');
  assert(sha256(specBytes) === SPEC_SHA256, 'SOURCE_SPECIFICATION_DIGEST_MISMATCH');
  const specText = specBytes.toString('utf8');
  for (const token of ['K=(\\Omega,\\preceq,A,\\Phi,S,H,\\Gamma)', 'SURVIVE', 'FAIL', 'UNINTERPRETABLE', 'R^*', 'F_{\\min}', 'STRUCTURALLY_CONFORMANT', 'EXECUTION_PROHIBITED', 'CLAIM_NOT_ENTITLED']) {
    assert(specText.includes(token), 'SPECIFICATION_REQUIRED_TOKEN_MISSING', token);
  }
  const contract = json(`${DIR}/ahbk-contract.v1.json`);
  assert(contract.schema === 'AHBK_MACHINE_CONTRACT_v1', 'CONTRACT_SCHEMA_MISMATCH');
  assert(contract.specification.sha256 === SPEC_SHA256 && contract.specification.byteLength === SPEC_BYTES, 'CONTRACT_SPECIFICATION_IDENTITY_MISMATCH');
  assert(contract.frontiers.setValued === true && contract.frontiers.uniquePointAssumptionProhibited === true, 'CONTRACT_FRONTIER_SEMANTICS_MISMATCH');
  assert(canonical(contract.survivalValues) === canonical(['SURVIVE', 'FAIL', 'UNINTERPRETABLE']), 'CONTRACT_SURVIVAL_VALUES_MISMATCH');
  assert(Object.values(contract.constructionBoundary).every(value => value === false), 'CONTRACT_AUTHORITY_BOUNDARY_LEAK');
  verifySchema(json(`${DIR}/ahbk-output.schema.v1.json`), contract);
  verifyCmapss(json(`${DIR}/cmapss-nonexecuting-binding.v1.json`));
  const fixtureResults = verifyFixtures(contract, json(`${DIR}/fixtures/synthetic-edge-cases.v1.json`));
  verifyReceipt(json(`${DIR}/receipts/AHBK_SPECIFICATION_CONFORMANCE_RECEIPT_v1.json`));
  const receipt = stable({
    schema: 'AHBK_CONFORMANCE_VERIFICATION_RECEIPT_v1',
    result: 'PASS',
    verificationClass: 'STRUCTURAL_AND_SYNTHETIC_ONLY',
    governingBase: BASE,
    candidateHead: exact.candidateHead,
    changedPaths: exact.changedPaths,
    specificationSha256: SPEC_SHA256,
    specificationByteLength: SPEC_BYTES,
    syntheticFixtureCount: fixtureResults.length,
    fixtureResults,
    cmapss: {
      structuralConformance: 'PASS',
      executionAuthorization: 'PROHIBITED',
      experimentalCompletion: 'UNCOMPLETED',
      claimEntitlement: 'NOT_ENTITLED',
      evaluationState: 'NOT_EVALUATED'
    },
    authorityEffects: {
      datasetAccessAuthorized: false,
      modelExecutionAuthorized: false,
      outcomeAccessAuthorized: false,
      preregistrationMutationAuthorized: false,
      experimentalCompletionCreated: false,
      empiricalClaimEntitled: false,
      mergeAuthorized: false,
      deploymentAuthorized: false,
      publicationAuthorized: false
    }
  });
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stdout.write(`${JSON.stringify(stable({
    schema: 'AHBK_CONFORMANCE_VERIFICATION_RECEIPT_v1',
    result: 'FAIL',
    errorCode: error.code || 'UNEXPECTED_ERROR',
    detail: error.detail || error.message,
    authorityEffects: {
      experimentalCompletionCreated: false,
      empiricalClaimEntitled: false
    }
  }), null, 2)}\n`);
  process.exitCode = 1;
}
