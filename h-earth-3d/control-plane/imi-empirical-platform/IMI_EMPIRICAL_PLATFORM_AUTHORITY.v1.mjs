import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { IMI_EMPIRICAL_ENGINE_META, DEFAULT_IMI_ORDINAL_SCALE } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const authorityBody = {
  schemaVersion: 'IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1',
  operation: 'IMI_ACTIVE_TOOLBASE_EMPIRICAL_PLATFORM_INTEGRATION_AND_BRANCH_OPERATIONAL_INTAKE_v1',
  deliverable: 'IMI_CORE_AND_EMPIRICAL_PORTFOLIO_ENGINE_v1',
  class: 'REPOSITORY_INTEGRATED_EMPIRICAL_INTRINSIC_MANEUVERABILITY_INDEX_ROUTE_SCORING_AND_PORTFOLIO_RECEIPT_TOOL',
  status: 'PREOFFICIAL_REPOSITORY_BRANCH_OPERATIONAL_EMPIRICAL_INTAKE_TOOL',
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
    'REPOSITORY_BRANCH_OUTPUT_ARCHIVE_WRITER'
  ],
  includedSchemas: [
    'IMI_ROUTE_SCHEMA_v1',
    'IMI_STUDY_RECEIPT_SCHEMA_v1',
    'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_SCHEMA_v1'
  ],
  engineMeta: IMI_EMPIRICAL_ENGINE_META,
  defaultOrdinalScale: DEFAULT_IMI_ORDINAL_SCALE.scaleId,
  exactPathScope: [
    '.github/workflows/h-earth-imi-empirical-platform.yml',
    'h-earth-3d/control-plane/imi-empirical-platform/IMI_EMPIRICAL_PLATFORM_AUTHORITY.v1.mjs',
    'h-earth-3d/tools/imi-empirical-platform/README.md',
    'h-earth-3d/tools/imi-empirical-platform/index.html',
    'h-earth-3d/tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs',
    'h-earth-3d/tools/imi-empirical-platform/schemas/route.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/schemas/study-receipt.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/schemas/portfolio-registry.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/routes/example-hospital-route.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/examples/example-hospital-rows.v1.json',
    'h-earth-3d/validation/imi-empirical-platform/imi.empirical-platform.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.empirical-intake.runner.mjs',
    'h-earth-3d/validation/imi-empirical-platform/imi.empirical-operational-suite.runner.mjs'
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
  boundaries: {
    officialScaleClaimed: false,
    routeCertificationPerformed: false,
    realStudyDataLoaded: false,
    empiricalValidationClaimed: false,
    productionReleaseAuthorized: false,
    publicReleaseAuthorized: false,
    mainBranchMerged: false,
    liveWebsiteOperational: false,
    stop: 'STOP_AFTER_REPOSITORY_BRANCH_OPERATIONAL_EMPIRICAL_INTAKE_AND_FIXTURE_VALIDATION'
  },
  result: 'IMI_EMPIRICAL_PLATFORM_BRANCH_OPERATIONAL_INTAKE_READY_FOR_CI_VERIFICATION'
};

export const IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1 = deepFreeze({
  ...authorityBody,
  authorityDigest: canonicalDigest(authorityBody)
});

export default IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1;
