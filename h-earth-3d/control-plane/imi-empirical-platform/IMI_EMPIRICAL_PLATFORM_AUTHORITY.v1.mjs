import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { IMI_EMPIRICAL_ENGINE_META, DEFAULT_IMI_ORDINAL_SCALE } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const authorityBody = {
  schemaVersion: 'IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1',
  operation: 'IMI_ACTIVE_TOOLBASE_EMPIRICAL_PLATFORM_INTEGRATION_AND_BRANCH_OPERATIONAL_INTAKE_v1',
  deliverable: 'IMI_CORE_AND_EMPIRICAL_PORTFOLIO_ENGINE_v1',
  class: 'REPOSITORY_INTEGRATED_EMPIRICAL_INTRINSIC_MANEUVERABILITY_INDEX_ROUTE_SCORING_PORTFOLIO_RECEIPT_AND_CROSS_DOMAIN_SYNTHESIS_TOOL',
  status: 'PREOFFICIAL_REPOSITORY_BRANCH_OPERATIONAL_EMPIRICAL_TOOL_WITH_PHASE_1_MULTI_DOMAIN_SYNTHESIS_ACTIVE',
  sourceDisposition: 'SANDBOX_PROTOTYPE_PROMOTED_AS_NONCONTROLLING_SOURCE_MATERIAL',
  empiricalFunction: [
    'ROUTE_SPECIFIC_IMI_SCORING',
    'CS_WMI_ADDITIVE_AND_GEOMETRIC_COMPARATORS',
    'MISSINGNESS_AND_UNEVALUABLE_CLASSIFICATION',
    'HARD_COLLAPSE_DETECTION',
    'CASE_LEVEL_OUTPUT',
    'STUDY_RECEIPT_GENERATION',
    'PORTFOLIO_REGISTRY_APPEND_ENTRY_GENERATION',
    'GENERIC_EMPIRICAL_INTAKE_RUNNER',
    'REPOSITORY_BRANCH_OUTPUT_ARCHIVE_WRITER',
    'CURRENT_PUBLIC_SOURCE_RUNTIME_DOWNLOAD_AND_IDENTITY_BINDING',
    'EXISTING_FOUR_DOMAIN_EXECUTION_SURFACE_COMPLETION',
    'CROSS_DOMAIN_MEASUREMENT_BEHAVIOR_SYNTHESIS',
    'ENGINE_ROUTE_DOMAIN_DATASET_AND_UNRESOLVED_FINDING_CLASSIFICATION',
    'ROUTE_EVIDENCE_LEVEL_ASSIGNMENT',
    'PHASE_2_GENERALIZABILITY_PROTOCOL_READINESS_DECISION'
  ],
  includedSchemas: [
    'IMI_ROUTE_SCHEMA_v1',
    'IMI_STUDY_RECEIPT_SCHEMA_v1',
    'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_SCHEMA_v1',
    'IMI_SCOPE_GENERALIZABILITY_AND_PRACTICAL_VALUE_FIVE_PHASE_PLAN_v1',
    'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_PROTOCOL_v1'
  ],
  engineMeta: IMI_EMPIRICAL_ENGINE_META,
  defaultOrdinalScale: DEFAULT_IMI_ORDINAL_SCALE.scaleId,
  exactPathScope: [
    '.github/workflows/h-earth-imi-empirical-platform.yml',
    'h-earth-3d/control-plane/imi-empirical-platform/IMI_EMPIRICAL_PLATFORM_AUTHORITY.v1.mjs',
    'h-earth-3d/control-plane/imi-empirical-platform/IMI_SCOPE_GENERALIZABILITY_AND_PRACTICAL_VALUE_FIVE_PHASE_PLAN_v1.json',
    'h-earth-3d/tools/imi-empirical-platform/README.md',
    'h-earth-3d/tools/imi-empirical-platform/index.html',
    'h-earth-3d/tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs',
    'h-earth-3d/tools/imi-empirical-platform/schemas/route.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/schemas/study-receipt.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/schemas/portfolio-registry.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/synthesis/imi-multi-domain-empirical-portfolio-synthesis-protocol.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/routes/example-hospital-route.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/routes/cms-hospital-refresh-2026-route.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/routes/usda-honey-bee-refresh-2026-route.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/routes/dssi-sovereign-debt-service-expansion-2026-route.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/routes/spontaneous-speech-current-repository-rerun-2026-route.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/examples/example-hospital-rows.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_SPONTANEOUS_SPEECH_REPOSITORY_RERUN_2026_v1/spontaneous-speech-rerun-summary.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_USDA_HONEY_BEE_COLONY_RESILIENCE_REFRESH_2026_v1/usda-honey-bee-phase-consolidation-receipt.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_EXISTING_FOUR_DOMAIN_EMPIRICAL_PORTFOLIO_COMPLETION_v1/imi-existing-four-domain-portfolio-completion-receipt.v1.json',
    'h-earth-3d/validation/imi-empirical-platform/imi.empirical-platform.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.empirical-intake.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.empirical-operational-suite.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.cms-hospital-refresh-2026.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.usda-honey-bee-refresh-2026.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.dssi-sovereign-debt-service-expansion-2026.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.spontaneous-speech-rerun-2026.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.existing-four-domain-portfolio-completion.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.multi-domain-portfolio-synthesis.runner.mjs'
  ],
  operationalIntakeContract: {
    branchOperational: true,
    oneRepositoryBasedEngine: 'h-earth-3d/tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs',
    genericRunner: 'h-earth-3d/validation/imi-empirical-platform/imi.empirical-intake.runner.mjs',
    suiteRunner: 'h-earth-3d/validation/imi-empirical-platform/imi.empirical-operational-suite.runner.mjs',
    outputFiles: [
      'imi-study-run-output.v1.json',
      'imi-study-receipt.v1.json',
      'imi-case-results.v1.json',
      'imi-portfolio-registry.v1.json',
      'imi-portfolio-summary.v1.json',
      'imi-empirical-intake-operational-receipt.v1.json'
    ],
    explicitDatasetAdmissionRequired: true,
    automaticPerceivedDataCapture: false
  },
  currentEmpiricalExecutionSurface: {
    hospitalCurrentRepositoryRun: 'PASS_CLOSED_CMS_HOSPITAL_REFRESH_2026_REPOSITORY_INTAKE_RUN',
    spontaneousSpeechCurrentRepositoryRun: 'PASS_CLOSED_SPONTANEOUS_SPEECH_CURRENT_REPOSITORY_RERUN_2026',
    honeyBeeCurrentRepositoryRun: 'PASS_CLOSED_USDA_HONEY_BEE_CURRENT_REFRESH_PHASE_CONSOLIDATED',
    dssiCurrentRepositoryRun: 'PASS_CLOSED_DSSI_PARTIAL_ALL_COUNTRY_EXPANSION_PHASE_CONSOLIDATED',
    collectiveResult: 'PASS_CLOSED_EXISTING_FOUR_DOMAIN_EMPIRICAL_EXECUTION_SURFACE_COMPLETE',
    collectiveReceipt: 'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_EXISTING_FOUR_DOMAIN_EMPIRICAL_PORTFOLIO_COMPLETION_v1/imi-existing-four-domain-portfolio-completion-receipt.v1.json'
  },
  scopeGeneralizabilityProgram: {
    program: 'IMI_SCOPE_GENERALIZABILITY_AND_PRACTICAL_VALUE_PROGRAM_v1',
    phaseCount: 5,
    activePhase: 1,
    activeOperation: 'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_v1',
    phasesTwoThroughFiveExecuted: false,
    planPath: 'h-earth-3d/control-plane/imi-empirical-platform/IMI_SCOPE_GENERALIZABILITY_AND_PRACTICAL_VALUE_FIVE_PHASE_PLAN_v1.json',
    synthesisProtocolPath: 'h-earth-3d/tools/imi-empirical-platform/synthesis/imi-multi-domain-empirical-portfolio-synthesis-protocol.v1.json',
    synthesisRunnerPath: 'h-earth-3d/validation/imi-empirical-platform/imi.multi-domain-portfolio-synthesis.runner.mjs'
  },
  boundaries: {
    officialScaleClaimed: false,
    routeCertificationPerformed: false,
    realStudyDataLoaded: true,
    empiricalValidationClaimed: false,
    productionReleaseAuthorized: false,
    publicReleaseAuthorized: false,
    mainBranchMerged: false,
    liveWebsiteOperational: false,
    rawCrossRouteIMIMagnitudeComparisonAuthorized: false,
    universalMultiplicativeSuperiorityClaimed: false,
    phase2GeneralizabilityProtocolExecuted: false,
    externalTestsExecuted: false,
    decisionUtilityPilotsExecuted: false,
    independentMultiDomainReproductionExecuted: false,
    fullCrossDomainResearchSynthesisPerformed: false,
    stop: 'STOP_AFTER_PHASE_1_SYNTHESIS_AND_PHASE_2_READINESS_DECISION'
  },
  result: 'IMI_EMPIRICAL_PLATFORM_PHASE_1_MULTI_DOMAIN_SYNTHESIS_AUTHORIZED_ACTIVE'
};

export const IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1 = deepFreeze({
  ...authorityBody,
  authorityDigest: canonicalDigest(authorityBody)
});

export default IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1;
