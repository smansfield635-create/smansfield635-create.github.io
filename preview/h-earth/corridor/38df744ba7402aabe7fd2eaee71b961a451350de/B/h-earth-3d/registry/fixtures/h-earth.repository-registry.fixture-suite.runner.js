/** Targets 4C-10 and 4C-11 · Deterministic fixture runner and receipt bundle. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateHEarthRepositoryRegistryOperation,
  H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE
} from '../h-earth.repository-registry.validator-engine.js';
import { deepFreeze, stableStrings } from '../h-earth.repository-registry.validator-engine.identity.js';
import {
  H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES
} from './h-earth.repository-registry.fixture-suite.fixtures.js';
import {
  H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY
} from './h-earth.repository-registry.fixture-suite.identity.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const oracle = JSON.parse(fs.readFileSync(path.join(directory, 'h-earth.repository-registry.fixture-suite.oracle.json'), 'utf8'));
const oracleById = new Map(oracle.entries.map((entry) => [entry.fixtureId, entry]));

function classifyOccurrence(result) {
  const codes = result.receipt.failureCodes;
  if (codes.includes('OCCURRENCE_IDENTITY_DRIFT')) return 'DRIFT';
  if (codes.includes('REQUESTED_PATH_UNRESOLVED') || codes.includes('EXACT_OCCURRENCE_UNRESOLVED')) return 'UNRESOLVED';
  if ((result.diagnostics?.occurrence?.resolvedPaths?.length ?? 0) > 0) return 'RESOLVED';
  return 'NOT_APPLICABLE';
}

function explicitCardinalRoles(result) {
  return new Set(result.receipt.cardinalParticipation
    .filter((record) => record.cardinalStatus === 'EXPLICIT')
    .map((record) => record.cardinalRole));
}

function evaluateCriticalAssertion(assertion, result, deterministic) {
  if (assertion === 'EXACT_SCOPE') return result.diagnostics?.comparison?.exactMatch === true;
  if (assertion === 'FULL_CARDINAL_KERNEL') {
    const roles = explicitCardinalRoles(result);
    return ['NORTH', 'EAST', 'SOUTH', 'WEST'].every((role) => roles.has(role));
  }
  if (assertion === 'GATE_B_PRESENT') return result.receipt.affectedNodes.some((node) => node.nodeId.includes('GATE_B'));
  if (assertion === 'EXACT_OCCURRENCE') {
    return result.diagnostics?.occurrence?.assertedOccurrenceResults?.some((record) => record.resolved === true) === true;
  }
  if (assertion === 'DETERMINISTIC') return deterministic;
  if (assertion === 'LIMITED_EVIDENCE_REVIEW') {
    return result.receipt.finalDisposition === 'REVIEW_REQUIRED' && result.receipt.failureCodes.includes('OPTIONAL_EVIDENCE_LIMITATION');
  }
  if (assertion === 'NO_MUTATION_AUTHORITY') {
    return result.boundary.mutationAuthorityCreated === false && result.boundary.mergeAuthorityCreated === false;
  }
  if (assertion === 'MUTATION_BLOCKED') {
    return result.decision.mutationMayProceed === false && result.receipt.finalDisposition !== 'PASS';
  }
  return false;
}

function executeFixture(fixture) {
  const expectation = oracleById.get(fixture.fixtureId);
  if (!expectation) throw new Error(`TARGET_4C_ORACLE_ENTRY_MISSING:${fixture.fixtureId}`);

  const first = validateHEarthRepositoryRegistryOperation(structuredClone(fixture.operationInput));
  const second = validateHEarthRepositoryRegistryOperation(structuredClone(fixture.operationInput));
  const deterministic = JSON.stringify(first.receipt) === JSON.stringify(second.receipt);
  const actualFailureCodes = stableStrings(first.receipt.failureCodes);
  const occurrenceResult = classifyOccurrence(first);
  const requiredPresent = expectation.requiredFailureCodes.every((code) => actualFailureCodes.includes(code));
  const prohibitedAbsent = expectation.prohibitedFailureCodes.every((code) => !actualFailureCodes.includes(code));
  const traceLengthExact = first.receipt.derivationTrace.length === expectation.expectedTraceLength;
  const traceOrderExact = first.receipt.derivationTrace.every((entry, index) => entry.sequence === index + 1);
  const mutationExpectationExact = first.decision.mutationMayProceed === expectation.expectedMutationMayProceed;
  const authorityPreserved = !fixture.expectedAuthorityPreservation || (
    first.boundary.mutationAuthorityCreated === false &&
    first.boundary.mergeAuthorityCreated === false &&
    first.receipt.authorityProjection.length > 0
  );
  const cardinalPreserved = !fixture.expectedCardinalPreservation || (
    ['NORTH', 'EAST', 'SOUTH', 'WEST'].every((role) => explicitCardinalRoles(first).has(role))
  );
  const criticalAssertionResults = Object.fromEntries(
    fixture.criticalAssertions.map((assertion) => [assertion, evaluateCriticalAssertion(assertion, first, deterministic)])
  );

  const checks = deepFreeze({
    dispositionExact: first.receipt.finalDisposition === expectation.expectedDisposition,
    requiredFailureCodesPresent: requiredPresent,
    prohibitedFailureCodesAbsent: prohibitedAbsent,
    traceLengthExact,
    traceOrderExact,
    mutationExpectationExact,
    deterministic,
    receiptFrozen: Object.isFrozen(first.receipt) && Object.isFrozen(first.receipt.derivationTrace),
    authorityPreserved,
    cardinalPreserved,
    occurrenceResultExact: occurrenceResult === fixture.expectedOccurrenceResult,
    criticalAssertionsPass: Object.values(criticalAssertionResults).every(Boolean)
  });
  const failedChecks = Object.entries(checks).filter(([, value]) => value !== true).map(([name]) => name).sort();

  return deepFreeze({
    fixtureReceiptId: `${fixture.fixtureId}_RECEIPT_v1`,
    fixtureId: fixture.fixtureId,
    fixtureClass: fixture.fixtureClass,
    fixtureCategory: fixture.fixtureCategory,
    sourceOperationId: fixture.sourceOperationId,
    expectedDisposition: expectation.expectedDisposition,
    actualDisposition: first.receipt.finalDisposition,
    expectedFailureCodes: Object.freeze([...expectation.requiredFailureCodes]),
    actualFailureCodes,
    occurrenceResult,
    checks,
    criticalAssertionResults: deepFreeze(criticalAssertionResults),
    failedChecks: Object.freeze(failedChecks),
    result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
    engineReceipt: first.receipt
  });
}

export function runHEarthRepositoryRegistryTarget4CFixtureSuite({
  writeIndividualReceipts = false,
  receiptsDirectory = path.join(directory, 'receipts')
} = {}) {
  const individualResults = H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES
    .map(executeFixture)
    .sort((a, b) => a.fixtureId.localeCompare(b.fixtureId));

  if (writeIndividualReceipts) {
    fs.mkdirSync(receiptsDirectory, { recursive: true });
    for (const result of individualResults) {
      fs.writeFileSync(
        path.join(receiptsDirectory, `${result.fixtureId}.receipt.json`),
        JSON.stringify(result, null, 2) + '\n'
      );
    }
  }

  const fixtureClassCounts = Object.fromEntries(
    ['POSITIVE', 'NEGATIVE', 'DRIFT', 'ADVERSARIAL'].map((fixtureClass) => [
      fixtureClass,
      individualResults.filter((result) => result.fixtureClass === fixtureClass).length
    ])
  );
  const dispositionCounts = Object.fromEntries(
    ['PASS', 'REVIEW_REQUIRED', 'BLOCK', 'STOP'].map((disposition) => [
      disposition,
      individualResults.filter((result) => result.actualDisposition === disposition).length
    ])
  );
  const failedFixtureIds = individualResults.filter((result) => result.result !== 'PASS').map((result) => result.fixtureId);

  return deepFreeze({
    suiteId: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY.suiteId,
    suiteVersion: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY.suiteVersion,
    targetNumber: 4,
    targetSubtarget: '4C-10',
    executedFixtureCount: individualResults.length,
    passedFixtureCount: individualResults.length - failedFixtureIds.length,
    failedFixtureCount: failedFixtureIds.length,
    fixtureClassCounts: deepFreeze(fixtureClassCounts),
    dispositionCounts: deepFreeze(dispositionCounts),
    failureCodeCoverage: stableStrings(individualResults.flatMap((result) => result.actualFailureCodes)),
    individualResults: Object.freeze(individualResults.map((result) => deepFreeze({
      fixtureId: result.fixtureId,
      fixtureClass: result.fixtureClass,
      fixtureCategory: result.fixtureCategory,
      expectedDisposition: result.expectedDisposition,
      actualDisposition: result.actualDisposition,
      actualFailureCodes: result.actualFailureCodes,
      result: result.result,
      failedChecks: result.failedChecks
    }))),
    failedFixtureIds: Object.freeze(failedFixtureIds),
    engineIdentity: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE.identity,
    protectedIdentities: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY.protectedDependencies,
    finalResult: failedFixtureIds.length === 0 ? 'PASS' : 'FAIL',
    receiptDeterminism: {
      fixtureOrder: 'LEXICOGRAPHIC_BY_FIXTURE_ID',
      failureCodeOrder: 'LEXICOGRAPHIC',
      timestampsPermitted: false,
      randomIdentifiersPermitted: false,
      repeatedExecutionReceiptsByteEquivalent: individualResults.every((result) => result.checks.deterministic)
    },
    stoppingCondition: {
      fixtureRunnerComplete: true,
      receiptAndDeterminismContractComplete: true,
      advanceBeyondTarget4C11: false,
      nextAuthorizedSubtarget: '4C-12'
    }
  });
}

export default runHEarthRepositoryRegistryTarget4CFixtureSuite;
