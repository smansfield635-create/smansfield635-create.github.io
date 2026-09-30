import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES,
  H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_COUNTS
} from '../h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.fixtures.js';
import {
  H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY,
  H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_BOUNDARY
} from '../h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.identity.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureDirectory = path.join(root, 'h-earth-3d/registry/fixtures');
const contract = JSON.parse(fs.readFileSync(path.join(fixtureDirectory, 'h-earth.repository-registry.fixture-suite.contract.json'), 'utf8'));
const oracle = JSON.parse(fs.readFileSync(path.join(fixtureDirectory, 'h-earth.repository-registry.fixture-suite.oracle.json'), 'utf8'));
const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
const failureCodes = new Set(dependencies.contracts.failures.catalog.map((entry) => entry.failureCode));
const hashObject = (relativePath) => execFileSync('git', ['hash-object', relativePath], { cwd: root, encoding: 'utf8' }).trim();
const sorted = (values) => [...values].sort((a, b) => String(a).localeCompare(String(b)));
const unique = (values) => new Set(values).size === values.length;
const noNull = (value, seen = new WeakSet()) => {
  if (value === null) return false;
  if (typeof value !== 'object') return true;
  if (seen.has(value)) return true;
  seen.add(value);
  return Object.values(value).every((nested) => noNull(nested, seen));
};
const exactKeys = (value, expected) => JSON.stringify(sorted(Object.keys(value))) === JSON.stringify(sorted(expected));
const oracleById = new Map(oracle.entries.map((entry) => [entry.fixtureId, entry]));
const fixtureIds = H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.map((fixture) => fixture.fixtureId);
const operationIds = H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.map((fixture) => fixture.sourceOperationId);
const oracleIds = oracle.entries.map((entry) => entry.fixtureId);
const allReferencedFailureCodes = H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.flatMap((fixture) => [
  ...fixture.requiredFailureCodes,
  ...fixture.prohibitedFailureCodes
]);
const fixtureExpectationsMatchOracle = H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => {
  const entry = oracleById.get(fixture.fixtureId);
  return entry &&
    entry.expectedDisposition === fixture.expectedDisposition &&
    JSON.stringify(entry.requiredFailureCodes) === JSON.stringify(fixture.requiredFailureCodes) &&
    JSON.stringify(entry.prohibitedFailureCodes) === JSON.stringify(fixture.prohibitedFailureCodes) &&
    entry.expectedTraceLength === fixture.expectedTraceLength &&
    entry.expectedMutationMayProceed === fixture.expectedMutationMayProceed;
});

export function runHEarthRepositoryRegistryTarget4CStaticAudit() {
  const checks = {
    dependenciesVerified: dependencies.identityVerified,
    fixtureContractIdentityExact: contract.contractId === 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_FIXTURE_CONTRACT_v1',
    fixtureContractClosed: contract.fieldRules.additionalProperties === false,
    fixtureCountExact: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.length === 33,
    positiveFixtureCountExact: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_COUNTS.positive === 6,
    negativeFixtureCountExact: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_COUNTS.negative === 13,
    driftFixtureCountExact: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_COUNTS.drift === 6,
    adversarialFixtureCountExact: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_COUNTS.adversarial === 8,
    fixtureIdsUnique: unique(fixtureIds),
    operationIdsUnique: unique(operationIds),
    fixtureOrderLexicographic: JSON.stringify(fixtureIds) === JSON.stringify(sorted(fixtureIds)),
    fixtureRecordsClosed: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => exactKeys(fixture, contract.requiredFields)),
    fixtureRecordsContainNoNull: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => noNull(fixture)),
    fixtureClassesValid: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => contract.fixtureClasses.includes(fixture.fixtureClass)),
    fixtureCategoriesValid: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => contract.fixtureCategories.includes(fixture.fixtureCategory)),
    expectedDispositionsValid: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => contract.dispositions.includes(fixture.expectedDisposition)),
    expectedTraceLengthExact: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => fixture.expectedTraceLength === 14),
    expectedMutationAlwaysFalse: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => fixture.expectedMutationMayProceed === false),
    fixtureFailureArraysUnique: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.every((fixture) => unique(fixture.requiredFailureCodes) && unique(fixture.prohibitedFailureCodes)),
    referencedFailureCodesValid: allReferencedFailureCodes.every((code) => failureCodes.has(code)),
    oracleIdentityExact: oracle.oracleId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_EXPECTED_OUTCOME_ORACLE_v1',
    oracleIndependent: oracle.expectationsDerivedFromActualResults === false,
    oracleIdsUnique: unique(oracleIds),
    oracleCoverageExact: JSON.stringify(sorted(oracleIds)) === JSON.stringify(sorted(fixtureIds)),
    fixtureExpectationsMatchOracle,
    allFourFixtureClassesPresent: contract.fixtureClasses.every((fixtureClass) => H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.some((fixture) => fixture.fixtureClass === fixtureClass)),
    suiteCandidateOnly: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY.accepted === false && H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY.canonical === false,
    noEngineRewriteAuthority: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_BOUNDARY.engineSemanticsMayBeChanged === false,
    noExpectationWeakeningAuthority: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_BOUNDARY.fixtureExpectationsMayBeWeakened === false,
    noPortabilityClaim: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_BOUNDARY.portabilityClaimCreated === false,
    noSystemicComprehensionClaim: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_BOUNDARY.systemicComprehensionClaimCreated === false,
    noWorkflowEnforcement: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_BOUNDARY.workflowEnforcementInstalled === false,
    noMutationAuthority: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_BOUNDARY.mutationAuthorityCreated === false,
    target2RegistryExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.candidate.js') === '10ab7b203e03fde419e526d0cce2c0af42860911',
    target3InstructionExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json') === 'de421803f21808ce27b2ffff349af8756c4d9929',
    target4AContractExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-contract.json') === 'a6733c868cfee1abce172c0ac901fecf3dd209b2',
    target4BEngineExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-engine.js') === 'b2d7e0290a2032bef36205e1e1e5b0d3e72ca759'
  };
  const failedChecks = Object.entries(checks).filter(([, value]) => value !== true).map(([name]) => name).sort();
  return {
    auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_STATIC_FIXTURE_SUITE_AUDIT_v1',
    targetNumber: 4,
    targetSubtarget: '4C-12',
    result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
    checks,
    totalChecks: Object.keys(checks).length,
    passedChecks: Object.values(checks).filter((value) => value === true).length,
    failedChecks,
    fixtureCounts: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_COUNTS,
    protectedIdentities: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_SUITE_IDENTITY.protectedDependencies,
    stoppingCondition: {
      staticFixtureSuiteAuditPass: failedChecks.length === 0,
      advanceBeyondTarget4C12: false,
      nextAuthorizedSubtarget: '4C-13'
    }
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = runHEarthRepositoryRegistryTarget4CStaticAudit();
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  if (result.result !== 'PASS') process.exitCode = 1;
}
