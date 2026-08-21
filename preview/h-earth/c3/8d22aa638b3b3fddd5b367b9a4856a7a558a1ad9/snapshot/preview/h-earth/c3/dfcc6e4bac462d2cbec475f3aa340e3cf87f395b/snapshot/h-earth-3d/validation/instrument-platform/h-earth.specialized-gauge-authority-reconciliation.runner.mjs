import assert from 'node:assert/strict';
import {
  H_EARTH_CURRENT_AUTHORITY_GAUGE,
  H_EARTH_CURRENT_AUTHORITY_CHECKS,
  H_EARTH_LEGACY_GAUGE_DISPOSITIONS,
  buildDeterministicGaugeReceipt,
  canonicalDigest,
  computeGaugeReadiness
} from '../../../gauges/h-earth/h-earth.current-authority-gauge.v3.mjs';
import toolRegistry from '../../tools/instrument-platform/tool-registry.mjs';
import sceneRegistry from '../../tools/instrument-platform/permanent-scene-registry.mjs';

let assertions = 0;
const check = (condition, message) => {
  assertions += 1;
  assert.equal(Boolean(condition), true, message);
};
const expectThrows = (fn, pattern, message) => {
  assertions += 1;
  assert.throws(fn, pattern, message);
};
const fixtureResult = (checkDefinition, status = 'PASS', extra = {}) => ({
  ...checkDefinition,
  status,
  detail: extra.detail ?? `fixture:${status}`,
  authority: extra.authority ?? { fixture: true },
  predicates: extra.predicates ?? { fixture: true }
});
const passResults = H_EARTH_CURRENT_AUTHORITY_CHECKS.map((definition) => fixtureResult(definition));

check(H_EARTH_CURRENT_AUTHORITY_GAUGE.contractId === 'H_EARTH_CURRENT_AUTHORITY_GAUGE_v3', 'contract identity');
check(H_EARTH_CURRENT_AUTHORITY_GAUGE.receiptId === 'H_EARTH_CURRENT_AUTHORITY_GAUGE_RECEIPT_v3', 'receipt identity');
check(H_EARTH_CURRENT_AUTHORITY_GAUGE.checks.length === 11, 'eleven current checks');
check(H_EARTH_LEGACY_GAUGE_DISPOSITIONS.length === 11, 'eleven legacy dispositions');
check(H_EARTH_LEGACY_GAUGE_DISPOSITIONS.every((row) => row.disposition), 'all legacy rows classified');
check(H_EARTH_LEGACY_GAUGE_DISPOSITIONS.filter((row) => row.disposition === 'INVALID_HARDCODED_HOLD').length === 2, 'two invalid hardcoded holds');
check(H_EARTH_LEGACY_GAUGE_DISPOSITIONS.filter((row) => row.status === 'SUPERSEDED').length === 10, 'ten superseded legacy rows');
check(H_EARTH_LEGACY_GAUGE_DISPOSITIONS.filter((row) => row.status === 'PASS').length === 1, 'one retained current legacy row');

const allPass = computeGaugeReadiness(passResults);
check(allPass.requiredApplicableChecks === 11, 'all-pass denominator');
check(allPass.requiredApplicablePasses === 11, 'all-pass numerator');
check(allPass.requiredApplicableFailures === 0, 'all-pass failures');
check(allPass.requiredApplicableUnresolved === 0, 'all-pass unresolved');
check(allPass.readinessPercent === 100, 'all-pass readiness');
check(allPass.mergeEligible === true, 'all-pass merge eligible');

const oneFail = computeGaugeReadiness(passResults.map((result, index) => index === 4 ? { ...result, status: 'FAIL' } : result));
check(oneFail.requiredApplicableChecks === 11, 'failure denominator preserved');
check(oneFail.requiredApplicablePasses === 10, 'failure numerator');
check(oneFail.requiredApplicableFailures === 1, 'failure counted');
check(oneFail.readinessPercent === 91, 'failure readiness rounded');
check(oneFail.mergeEligible === false, 'failure blocks merge');

const oneUnresolved = computeGaugeReadiness(passResults.map((result, index) => index === 6 ? { ...result, status: 'UNRESOLVED' } : result));
check(oneUnresolved.requiredApplicableChecks === 11, 'unresolved denominator preserved');
check(oneUnresolved.requiredApplicablePasses === 10, 'unresolved numerator');
check(oneUnresolved.requiredApplicableUnresolved === 1, 'unresolved counted');
check(oneUnresolved.readinessPercent === 91, 'unresolved readiness rounded');
check(oneUnresolved.mergeEligible === false, 'unresolved blocks merge');

const informational = [
  fixtureResult({ ordinal: 12, checkId: 'FIXTURE_HELD', label: 'Fixture held', required: false }, 'HELD_BY_CURRENT_AUTHORITY'),
  fixtureResult({ ordinal: 13, checkId: 'FIXTURE_SUPERSEDED', label: 'Fixture superseded', required: false }, 'SUPERSEDED'),
  fixtureResult({ ordinal: 14, checkId: 'FIXTURE_NOT_APPLICABLE', label: 'Fixture not applicable', required: false }, 'NOT_APPLICABLE')
];
const withInformational = computeGaugeReadiness([...passResults, ...informational]);
check(withInformational.requiredApplicableChecks === 11, 'informational statuses excluded from denominator');
check(withInformational.requiredApplicablePasses === 11, 'informational statuses do not reduce numerator');
check(withInformational.readinessPercent === 100, 'informational statuses do not reduce readiness');
check(withInformational.counts.HELD_BY_CURRENT_AUTHORITY === 1, 'held remains visible');
check(withInformational.counts.SUPERSEDED === 1, 'superseded remains visible');
check(withInformational.counts.NOT_APPLICABLE === 1, 'not applicable remains visible');
check(withInformational.mergeEligible === true, 'informational statuses do not block merge');

expectThrows(
  () => computeGaugeReadiness([{ ...passResults[0], status: 'UNKNOWN' }]),
  /GAUGE_RESULT_STATUS_INVALID/,
  'invalid result status rejected'
);

const derived = [
  { recordId: 'GROUND_VIEW_STATUS', status: 'PASS', value: 'ACTIVE_PUBLIC_NAVIGABLE_GROUND_VIEW', hardcoded: false },
  { recordId: 'ESTATE_OR_MANOR_STATUS', status: 'HELD_BY_CURRENT_AUTHORITY', value: 'SITE_ENVELOPE_ACCEPTED_DETAILED_ARCHITECTURE_DEFERRED', hardcoded: false }
];
const receiptA = buildDeterministicGaugeReceipt({ sourceHead: 'fixture-head', results: passResults, derivedAuthorityRecords: derived });
const receiptB = buildDeterministicGaugeReceipt({ sourceHead: 'fixture-head', results: passResults, derivedAuthorityRecords: derived });
const receiptC = buildDeterministicGaugeReceipt({ sourceHead: 'fixture-head-2', results: passResults, derivedAuthorityRecords: derived });
check(receiptA.receiptDigest === receiptB.receiptDigest, 'same exact inputs produce same receipt digest');
check(receiptA.receiptDigest !== receiptC.receiptDigest, 'source-head identity changes receipt digest');
check(receiptA.boundaries.readOnly === true, 'receipt read-only boundary');
check(receiptA.boundaries.repositoryMutationPerformed === false, 'receipt repository mutation false');
check(receiptA.boundaries.liveHEarthMutationPerformed === false, 'receipt live mutation false');
check(receiptA.boundaries.productAcceptanceClaimed === false, 'receipt acceptance false');
check(receiptA.legacyDispositionCount === 11, 'receipt preserves legacy dispositions');
check(receiptA.currentAuthorityCheckCount === 11, 'receipt preserves current checks');

check(toolRegistry.registryDigest === 'fnv1a32:3651f363', 'candidate tool registry digest');
check(toolRegistry.tools.length === 4, 'tool registry application count');
const gaugeTool = toolRegistry.tools.find((tool) => tool.toolId === 'H_EARTH_GAUGES');
check(gaugeTool?.runtimeApiKey === 'H_EARTH_CURRENT_AUTHORITY_GAUGE', 'gauge runtime API registered');
check(gaugeTool?.actions?.includes('RUN_CURRENT_AUTHORITY_AUDIT') === true, 'current audit action registered');
check(gaugeTool?.prohibitedMutations?.includes('REPOSITORY_WRITE') === true, 'repository write prohibited');
check(gaugeTool?.prohibitedMutations?.includes('LIVE_BINDING_CHANGE') === true, 'live binding change prohibited');
check(gaugeTool?.prohibitedMutations?.includes('PRODUCT_ACCEPTANCE') === true, 'product acceptance prohibited');
check(sceneRegistry.registryDigest === 'fnv1a32:b996656d', 'scene registry digest unchanged');
check(sceneRegistry.scenes.length === 8, 'eight permanent scenes unchanged');

const receiptBody = {
  receiptType: 'H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_A4_RECEIPT_v1',
  operationId: 'H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001',
  checkpointId: 'A4_DETERMINISTIC_GAUGE_KERNEL_VERIFICATION',
  status: 'PASS_CLOSED',
  exactBase: '6037cdad3bde1dfcac1aec253d5ad079fc1df1f5',
  assertionCount: assertions,
  fixtures: {
    allPass: allPass,
    oneRequiredFailure: oneFail,
    oneRequiredUnresolved: oneUnresolved,
    informationalStatuses: withInformational
  },
  deterministicGaugeReceiptDigest: receiptA.receiptDigest,
  candidateToolRegistryDigest: toolRegistry.registryDigest,
  permanentSceneRegistryDigest: sceneRegistry.registryDigest,
  browserExecutionPerformed: false,
  liveRouteExecutionPerformed: false,
  stopBoundary: 'STOP_AFTER_DETERMINISTIC_KERNEL_EXECUTION',
  nextCheckpoint: 'A5_EXACT_BROWSER_EXECUTION'
};
const receipt = Object.freeze({ ...receiptBody, receiptDigest: canonicalDigest(receiptBody) });
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
