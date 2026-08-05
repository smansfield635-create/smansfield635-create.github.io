import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const repositoryRoot = process.cwd();
const outputDir = argValue('--output-dir', '/tmp/imi-multi-domain-portfolio-synthesis');
const hospitalDir = argValue('--hospital-dir', '/tmp/imi-cms-hospital-refresh-2026');
const beeDir = argValue('--bee-dir', '/tmp/imi-usda-honey-bee-refresh-2026');
const dssiDir = argValue('--dssi-dir', '/tmp/imi-dssi-sovereign-debt-service-expansion-2026');
const speechDir = argValue('--speech-dir', '/tmp/imi-spontaneous-speech-rerun-2026');
const clock = () => new Date(argValue('--clock', '2026-08-05T17:11:00.000Z'));

const paths = deepFreeze({
  plan: path.join(repositoryRoot, 'h-earth-3d/control-plane/imi-empirical-platform/IMI_SCOPE_GENERALIZABILITY_AND_PRACTICAL_VALUE_FIVE_PHASE_PLAN_v1.json'),
  protocol: path.join(repositoryRoot, 'h-earth-3d/tools/imi-empirical-platform/synthesis/imi-multi-domain-empirical-portfolio-synthesis-protocol.v1.json'),
  durableHospital: path.join(repositoryRoot, 'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_CONFIRMATORY_HOSPITAL_REFRESH_2026_v1/cms-hospital-refresh-summary.v1.json'),
  durableBee: path.join(repositoryRoot, 'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_USDA_HONEY_BEE_COLONY_RESILIENCE_REFRESH_2026_v1/usda-honey-bee-refresh-summary.v1.json'),
  durableDssi: path.join(repositoryRoot, 'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_v1/dssi-expansion-summary.v1.json'),
  durableSpeech: path.join(repositoryRoot, 'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_SPONTANEOUS_SPEECH_REPOSITORY_RERUN_2026_v1/spontaneous-speech-rerun-summary.v1.json'),
  runtimeHospital: path.join(hospitalDir, 'cms-hospital-refresh-summary.v1.json'),
  runtimeBee: path.join(beeDir, 'usda-honey-bee-refresh-summary.v1.json'),
  runtimeDssi: path.join(dssiDir, 'dssi-expansion-summary.v1.json'),
  runtimeSpeech: path.join(speechDir, 'spontaneous-speech-rerun-summary.v1.json')
});

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function readRuntimeOrDurable(runtimePath, durablePath) {
  try {
    return { source: 'CURRENT_WORKFLOW_RUNTIME', path: runtimePath, value: await readJson(runtimePath) };
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    return { source: 'DURABLE_BRANCH_SUMMARY', path: durablePath, value: await readJson(durablePath) };
  }
}

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function domainRecord({ id, family, summary, evidenceLevel, variance, factorPattern, comparator, practicalCandidate }) {
  return deepFreeze({
    domainId: id,
    routeFamily: family,
    result: summary.result,
    evaluatedCases: summary.transformedHospitalRows ?? summary.participantRows ?? summary.transitionRows ?? summary.transformedCountryRows,
    validCases: summary.validCases,
    unevaluableCases: summary.unevaluableCases,
    hardCollapseCases: summary.hardCollapseCases,
    evidenceLevel,
    varianceFinding: variance,
    weakestFactorFinding: factorPattern,
    comparatorFinding: comparator,
    practicalValueCandidate: practicalCandidate
  });
}

const plan = await readJson(paths.plan);
const protocol = await readJson(paths.protocol);
const hospitalInput = await readRuntimeOrDurable(paths.runtimeHospital, paths.durableHospital);
const beeInput = await readRuntimeOrDurable(paths.runtimeBee, paths.durableBee);
const dssiInput = await readRuntimeOrDurable(paths.runtimeDssi, paths.durableDssi);
const speechInput = await readRuntimeOrDurable(paths.runtimeSpeech, paths.durableSpeech);

const hospital = hospitalInput.value;
const bee = beeInput.value;
const dssi = dssiInput.value;
const speech = speechInput.value;

assert(plan.currentDecision === 'EXECUTE_PHASE_1_ONLY', 'FIVE_PHASE_PLAN_PHASE_1_NOT_ACTIVE');
assert(plan.phases?.[0]?.operation === 'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_v1', 'FIVE_PHASE_PLAN_PHASE_1_OPERATION_MISMATCH');
assert(protocol.operation === 'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_v1', 'SYNTHESIS_PROTOCOL_OPERATION_MISMATCH');
assert(protocol.crossRouteComparisonRule === 'COMPARE_MEASUREMENT_BEHAVIOR_AND_EVIDENCE_PROPERTIES_NOT_RAW_IMI_MAGNITUDES', 'RAW_CROSS_ROUTE_COMPARISON_BOUNDARY_MISSING');

assert(hospital.result === 'PASS_CLOSED_CMS_HOSPITAL_REFRESH_2026_REPOSITORY_INTAKE_RUN', 'HOSPITAL_RESULT_NOT_CLOSED');
assert(hospital.validCases === 3147 && hospital.unevaluableCases === 1028 && hospital.hardCollapseCases === 3, 'HOSPITAL_COUNTS_MISMATCH');
assert(hospital.exactIMI1Cases === 2438 && finite(hospital.outcomeComparators?.overall_rating?.spearmanIMI), 'HOSPITAL_SYNTHESIS_FIELDS_MISSING');

assert(bee.result === 'PASS_CLOSED_USDA_HONEY_BEE_REFRESH_2026_REPOSITORY_INTAKE_RUN', 'BEE_RESULT_NOT_CLOSED');
assert(bee.validCases === 100 && bee.unevaluableCases === 0 && bee.hardCollapseCases === 0, 'BEE_COUNTS_MISMATCH');
assert(bee.weakestFactorCounts?.VARROA_AVAILABILITY === 100, 'BEE_VARROA_DOMINANCE_MISMATCH');
assert(finite(bee.outcomeComparators?.next_loss_rate?.spearmanCS), 'BEE_TEMPORAL_COMPARATOR_MISSING');

assert(dssi.result === 'PASS_CLOSED_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_REPOSITORY_INTAKE_RUN', 'DSSI_RESULT_NOT_CLOSED');
assert(dssi.validCases === 32 && dssi.unevaluableCases === 0 && dssi.hardCollapseCases === 0, 'DSSI_COUNTS_MISMATCH');
assert(dssi.weakestFactorCounts?.PRINCIPAL_DISPERSION_AVAILABILITY === 20, 'DSSI_PRINCIPAL_COUNT_MISMATCH');
assert(dssi.weakestFactorCounts?.INTEREST_DISPERSION_AVAILABILITY === 12, 'DSSI_INTEREST_COUNT_MISMATCH');
assert(dssi.boundaries?.allCountryExtractionComplete === false, 'DSSI_OPEN_COVERAGE_BOUNDARY_MISSING');

assert(speech.result === 'PASS_CLOSED_SPONTANEOUS_SPEECH_CURRENT_REPOSITORY_RERUN_2026', 'SPEECH_RESULT_NOT_CLOSED');
assert(speech.validCases === 291 && speech.unevaluableCases === 0 && speech.hardCollapseCases === 0, 'SPEECH_COUNTS_MISMATCH');
assert(speech.uniqueIMIValues === 291, 'SPEECH_VARIANCE_MISMATCH');
assert(speech.weakestFactorTieDiagnostics?.tieCases === 5, 'SPEECH_TIE_COUNT_MISMATCH');
assert(speech.determinations?.legacyNumericResultsReproducedWithinFrozenTolerance === true, 'SPEECH_REPRODUCTION_NOT_ESTABLISHED');

const domains = deepFreeze([
  domainRecord({
    id: 'HEALTHCARE_QUALITY',
    family: 'STATIC_INSTITUTIONAL_PROFILE',
    summary: hospital,
    evidenceLevel: 'LEVEL_2_REPRODUCED_WITH_CURRENT_RELEASE_REFRESH',
    variance: 'SATURATED_HIGH_END_DISTRIBUTION_WITH_2438_OF_3147_VALID_CASES_AT_EXACT_IMI_1',
    factorPattern: 'NOT_DURABLY_ENUMERATED_IN_CURRENT_SUMMARY',
    comparator: 'IMI_ADDITIVE_AND_WMI_HAVE_SIMILAR_MODEST_ASSOCIATION_WITH_OVERALL_RATING',
    practicalCandidate: 'HOSPITAL_REVIEW_TRIAGE'
  }),
  domainRecord({
    id: 'SPONTANEOUS_SPEECH_LANGUAGE_STRUCTURE',
    family: 'PARTICIPANT_FEATURE_STRUCTURE',
    summary: speech,
    evidenceLevel: 'LEVEL_2_REPRODUCED_FROM_PUBLISHED_SOURCE',
    variance: 'MATERIAL_CONTINUOUS_DIFFERENTIATION_WITH_291_UNIQUE_IMI_VALUES',
    factorPattern: 'FIVE_FACTOR_DIVERSITY_WITH_FIVE_EXACT_TIE_CASES_PRESERVED',
    comparator: 'NO_ADMITTED_OUTCOME_COMPARATOR_IN_CURRENT_ROUTE',
    practicalCandidate: 'RESEARCH_STRATIFICATION_AND_MULTI_FEATURE_PROFILE_ANALYSIS'
  }),
  domainRecord({
    id: 'AGRICULTURAL_COLONY_RESILIENCE',
    family: 'LONGITUDINAL_MULTI_STRESSOR_RESILIENCE',
    summary: bee,
    evidenceLevel: 'LEVEL_2_REPRODUCED_CURRENT_RELEASE_REFRESH_WITH_OPEN_ROUTE_DISCRIMINATION',
    variance: 'NONTRIVIAL_IMI_VARIATION_ACROSS_100_STATE_QUARTER_TRANSITIONS',
    factorPattern: 'VARROA_IS_WEAKEST_FACTOR_IN_100_OF_100_CURRENT_CASES',
    comparator: 'TEMPORAL_ASSOCIATION_SUPPORTED_BUT_ADDITIVE_SEVERITY_SLIGHTLY_EXCEEDS_CS_ASSOCIATION',
    practicalCandidate: 'BEE_EARLY_WARNING_AND_RESOURCE_TARGETING'
  }),
  domainRecord({
    id: 'SOVEREIGN_DEBT_SERVICE_SCHEDULE_DISPERSION',
    family: 'SCHEDULE_DISTRIBUTION_STRUCTURE',
    summary: dssi,
    evidenceLevel: 'LEVEL_1_EXECUTABLE_PARTIAL_ALL_COUNTRY_EXPANSION',
    variance: 'MATERIAL_RANGE_FROM_0_370644_TO_0_966697_ACROSS_32_ADMITTED_COUNTRIES',
    factorPattern: 'PRINCIPAL_WEAKEST_IN_20_CASES_AND_INTEREST_WEAKEST_IN_12_CASES',
    comparator: 'MULTIPLICATIVE_MEAN_IS_MATERIALLY_LOWER_THAN_ADDITIVE_MEAN_WITHOUT_AN_OUTCOME_TEST',
    practicalCandidate: 'DEBT_SERVICE_SCHEDULE_REVIEW_PRIORITIZATION'
  })
]);

const totals = deepFreeze({
  evaluatedCases: domains.reduce((sum, item) => sum + item.evaluatedCases, 0),
  validCases: domains.reduce((sum, item) => sum + item.validCases, 0),
  unevaluableCases: domains.reduce((sum, item) => sum + item.unevaluableCases, 0),
  hardCollapseCases: domains.reduce((sum, item) => sum + item.hardCollapseCases, 0),
  domains: domains.length,
  routeFamilies: new Set(domains.map((item) => item.routeFamily)).size
});

assert(totals.evaluatedCases === 4598, `SYNTHESIS_EVALUATED_TOTAL_MISMATCH:${totals.evaluatedCases}`);
assert(totals.validCases === 3570, `SYNTHESIS_VALID_TOTAL_MISMATCH:${totals.validCases}`);
assert(totals.unevaluableCases === 1028, `SYNTHESIS_UNEVALUABLE_TOTAL_MISMATCH:${totals.unevaluableCases}`);
assert(totals.hardCollapseCases === 3, `SYNTHESIS_HARD_COLLAPSE_TOTAL_MISMATCH:${totals.hardCollapseCases}`);
assert(totals.domains === 4 && totals.routeFamilies === 4, 'SYNTHESIS_DOMAIN_FAMILY_COUNT_MISMATCH');

const findings = deepFreeze([
  {
    findingId: 'COMMON_ENGINE_EXECUTION',
    classification: 'ENGINE_GENERAL',
    determination: 'SUPPORTED_AT_REPOSITORY_EXECUTION_LEVEL_ACROSS_FOUR_ROUTE_FAMILIES',
    evidence: ['HOSPITAL', 'SPEECH', 'BEES', 'DSSI']
  },
  {
    findingId: 'UNEVALUABLE_MISSINGNESS_DISCIPLINE',
    classification: 'ENGINE_GENERAL',
    determination: 'SUPPORTED_AS_ENGINE_BEHAVIOR_WITH_MATERIAL_EMPIRICAL_OCCURRENCE_IN_HOSPITAL_ROUTE',
    evidence: { hospitalUnevaluable: 1028, otherDomainsUnevaluable: 0 }
  },
  {
    findingId: 'HARD_COLLAPSE_DETECTION',
    classification: 'ENGINE_GENERAL',
    determination: 'SUPPORTED_AS_ENGINE_BEHAVIOR_WITH_CURRENT_EMPIRICAL_OCCURRENCE_ONLY_IN_HOSPITAL_DATA',
    evidence: { hospital: 3, speech: 0, bees: 0, dssi: 0 }
  },
  {
    findingId: 'EXACT_WEAKEST_FACTOR_TIE_PRESERVATION',
    classification: 'ENGINE_GENERAL',
    determination: 'SUPPORTED_AS_ENGINE_BEHAVIOR_WITH_FIVE_CURRENT_SPEECH_OCCURRENCES',
    evidence: speech.weakestFactorTieDiagnostics
  },
  {
    findingId: 'WEAKEST_FACTOR_DIVERSITY',
    classification: 'UNRESOLVED',
    determination: 'NOT_UNIVERSAL_AND_ROUTE_DEPENDENT_IN_CURRENT_PORTFOLIO',
    evidence: { speech: 'DIVERSE', bees: 'SINGLE_FACTOR_DOMINANT', dssi: 'TWO_FACTOR_DIVERSE', hospital: 'NOT_DURABLY_ENUMERATED' }
  },
  {
    findingId: 'MULTIPLICATIVE_SUPERIORITY',
    classification: 'UNRESOLVED',
    determination: 'NOT_ESTABLISHED_INSTRUMENT_WIDE',
    evidence: {
      hospital: 'NEAR_PARITY_WITH_ADDITIVE_AND_WMI',
      bees: 'ADDITIVE_ASSOCIATION_SLIGHTLY_STRONGER_THAN_CS',
      dssi: 'STRUCTURAL_SCORE_DIFFERENCE_WITHOUT_OUTCOME_COMPARATOR',
      speech: 'NO_ADMITTED_OUTCOME_COMPARATOR'
    }
  },
  {
    findingId: 'OUTCOME_OR_TEMPORAL_ASSOCIATION',
    classification: 'ROUTE_FAMILY_GENERAL',
    determination: 'SUPPORTED_ONLY_FOR_ROUTES_WITH_ADMITTED_COMPARATORS_AND_NOT_GENERALIZED_BEYOND_THEM',
    evidence: { hospitalOverallRating: hospital.outcomeComparators.overall_rating, beeNextLoss: bee.outcomeComparators.next_loss_rate }
  },
  {
    findingId: 'HOSPITAL_HIGH_END_SATURATION',
    classification: 'UNRESOLVED',
    determination: 'MAY_BE_ROUTE_DATA_RESOLUTION_NORMALIZATION_OR_DOMAIN_STRUCTURE_EFFECT',
    evidence: { exactIMI1Cases: hospital.exactIMI1Cases, validCases: hospital.validCases, percent: hospital.exactIMI1PercentOfValid }
  },
  {
    findingId: 'BEE_VARROA_DOMINANCE',
    classification: 'UNRESOLVED',
    determination: 'CANNOT_YET_DISTINGUISH_BIOLOGICAL_DOMINANCE_FROM_ROUTE_OR_AGGREGATION_EFFECT',
    evidence: bee.weakestFactorCounts
  },
  {
    findingId: 'SPEECH_NUMERIC_REPRODUCTION',
    classification: 'ROUTE_FAMILY_GENERAL',
    determination: 'SUPPORTS_FROZEN_SOURCE_AND_ROUTE_REPRODUCIBILITY_NOT_EXTERNAL_POPULATION_GENERALIZATION',
    evidence: speech.legacyReproductionAbsoluteDeltas
  },
  {
    findingId: 'DSSI_PRINCIPAL_INTEREST_PATTERN',
    classification: 'DATASET_SPECIFIC',
    determination: 'CURRENT_32_COUNTRY_SCHEDULE_DISPERSION_PATTERN_ONLY',
    evidence: dssi.weakestFactorCounts
  },
  {
    findingId: 'RAW_IMI_MAGNITUDE_COMPARABILITY_ACROSS_ROUTES',
    classification: 'ENGINE_GENERAL',
    determination: 'PROHIBITED_WITHOUT_CALIBRATION_EVIDENCE',
    evidence: protocol.crossRouteComparisonRule
  }
]);

assert(findings.every((finding) => protocol.classificationVocabulary.includes(finding.classification)), 'UNRECOGNIZED_FINDING_CLASSIFICATION');

const synthesis = {
  schemaVersion: 'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_v1',
  operation: 'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_v1',
  result: 'PASS_CLOSED_PHASE_1_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS',
  generatedAt: clock().toISOString(),
  invariantConstructStatement: protocol.invariantConstructStatement,
  sourceCustody: {
    planDigest: canonicalDigest(plan),
    protocolDigest: canonicalDigest(protocol),
    inputSources: {
      hospital: hospitalInput.source,
      speech: speechInput.source,
      bees: beeInput.source,
      dssi: dssiInput.source
    },
    inputDigests: {
      hospital: canonicalDigest(hospital),
      speech: canonicalDigest(speech),
      bees: canonicalDigest(bee),
      dssi: canonicalDigest(dssi)
    }
  },
  totals,
  routeFamilyTaxonomy: protocol.routeFamilies,
  domainMatrix: domains,
  crossDomainFindings: findings,
  comparatorSynthesis: {
    universalMultiplicativeSuperiorityEstablished: false,
    structuralDifferenceFromAdditiveObserved: true,
    outcomeComparatorDomains: 2,
    noOutcomeComparatorDomains: 2,
    determination: 'IMI_HAS_DISTINCT_NONCOMPENSATORY_STRUCTURE_BUT_PORTFOLIO_WIDE_PREDICTIVE_SUPERIORITY_IS_NOT_ESTABLISHED'
  },
  saturationAndNonredundancy: {
    hospital: 'HIGH_END_SATURATION_REQUIRES_ROUTE_OR_DATA_RESOLUTION_DIAGNOSIS',
    speech: 'MATERIAL_CONTINUOUS_DIFFERENTIATION_AND_MULTIPLE_WEAKEST_FACTOR_CLASSES',
    bees: 'SINGLE_WEAKEST_FACTOR_DOMINANCE_REQUIRES_ROUTE_DISCRIMINATION',
    dssi: 'TWO_REQUIRED_FACTORS_BOTH_ACTIVE_IN_CURRENT_PARTIAL_PANEL'
  },
  scopeDetermination: {
    computationalGeneralizability: 'SUPPORTED_ACROSS_FOUR_CURRENT_ROUTE_FAMILIES',
    structuralGeneralizability: 'PARTIALLY_SUPPORTED_FOR_COMMON_OUTPUT_CLASSES',
    distributionalGeneralizability: 'NOT_YET_ESTABLISHED_INSTRUMENT_WIDE',
    predictiveGeneralizability: 'ROUTE_SPECIFIC_AND_INCOMPLETE',
    operationalGeneralizability: 'SUPPORTED_AT_INTERNAL_REPOSITORY_REPRODUCTION_LEVEL',
    decisionGeneralizability: 'NOT_YET_TESTED'
  },
  practicalValueCandidates: [
    'HOSPITAL_REVIEW_TRIAGE',
    'BEE_EARLY_WARNING_AND_RESOURCE_TARGETING',
    'SPEECH_RESEARCH_STRATIFICATION',
    'DSSI_SCHEDULE_REVIEW_PRIORITIZATION'
  ],
  phase2Readiness: {
    authorized: true,
    nextOperation: 'IMI_GENERALIZABILITY_PROTOCOL_v1',
    reason: 'THE_INVARIANT_CONSTRUCT_ROUTE_FAMILIES_CURRENT_EVIDENCE_LEVELS_AND_UNRESOLVED_CLAIMS_ARE_NOW_EXPLICIT_ENOUGH_TO_FREEZE_PROSPECTIVE_GENERALIZABILITY_TESTS',
    phase2MayNotExecuteDataTests: true
  },
  boundaries: {
    phase1Only: true,
    newDataCollected: false,
    newDomainOpened: false,
    rawCrossRouteScoreComparisonPerformed: false,
    routeRetuningPerformed: false,
    externalValidationClaimed: false,
    prospectiveValidationClaimed: false,
    decisionUtilityClaimed: false,
    universalMultiplicativeSuperiorityClaimed: false,
    finalInstrumentValidationClaimed: false,
    mainMergeAuthorized: false,
    publicReleaseAuthorized: false
  }
};

const receiptBody = {
  schemaVersion: 'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_RECEIPT_v1',
  operation: synthesis.operation,
  result: synthesis.result,
  generatedAt: synthesis.generatedAt,
  totals,
  invariantConstruct: synthesis.invariantConstructStatement.construct,
  findingCount: findings.length,
  routeFamilyCount: totals.routeFamilies,
  phase2Authorized: synthesis.phase2Readiness.authorized,
  nextOperation: synthesis.phase2Readiness.nextOperation,
  synthesisDigest: canonicalDigest(synthesis),
  boundaries: synthesis.boundaries
};

const receipt = deepFreeze({ ...receiptBody, receiptDigest: canonicalDigest(receiptBody) });

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'imi-multi-domain-empirical-portfolio-synthesis.v1.json'), `${JSON.stringify(synthesis, null, 2)}\n`, 'utf8');
await writeFile(path.join(outputDir, 'imi-multi-domain-empirical-portfolio-synthesis-receipt.v1.json'), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

console.log(JSON.stringify(receipt, null, 2));
