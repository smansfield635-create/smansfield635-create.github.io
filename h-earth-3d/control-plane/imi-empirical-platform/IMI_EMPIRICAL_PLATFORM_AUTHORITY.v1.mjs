import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { IMI_EMPIRICAL_ENGINE_META, DEFAULT_IMI_ORDINAL_SCALE } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const authorityBody = {
  schemaVersion: 'IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1',
  operation: 'IMI_ACTIVE_TOOLBASE_EMPIRICAL_PLATFORM_INTEGRATION_v1',
  deliverable: 'IMI_CORE_AND_EMPIRICAL_PORTFOLIO_ENGINE_v1',
  class: 'REPOSITORY_INTEGRATED_EMPIRICAL_INTRINSIC_MANEUVERABILITY_INDEX_ROUTE_SCORING_AND_PORTFOLIO_RECEIPT_TOOL',
  status: 'PREOFFICIAL_REPOSITORY_INTEGRATED_TOOLBASE_MODULE',
  sourceDisposition: 'SANDBOX_PROTOTYPE_PROMOTED_AS_NONCONTROLLING_SOURCE_MATERIAL',
  empiricalFunction: [
    'ROUTE_SPECIFIC_IMI_SCORING',
    'CS_WMI_ADDITIVE_AND_GEOMETRIC_COMPARATORS',
    'MISSINGNESS_AND_UNEVALUABLE_CLASSIFICATION',
    'HARD_COLLAPSE_DETECTION',
    'CASE_LEVEL_OUTPUT',
    'STUDY_RECEIPT_GENERATION',
    'PORTFOLIO_REGISTRY_APPEND_ENTRY_GENERATION'
  ],
  includedSchemas: [
    'IMI_ROUTE_SCHEMA_v1',
    'IMI_STUDY_RECEIPT_SCHEMA_v1',
    'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_SCHEMA_v1'
  ],
  engineMeta: IMI_EMPIRICAL_ENGINE_META,
  defaultOrdinalScale: DEFAULT_IMI_ORDINAL_SCALE.scaleId,
  exactPathScope: [
    'h-earth-3d/control-plane/imi-empirical-platform/IMI_EMPIRICAL_PLATFORM_AUTHORITY.v1.mjs',
    'h-earth-3d/tools/imi-empirical-platform/README.md',
    'h-earth-3d/tools/imi-empirical-platform/index.html',
    'h-earth-3d/tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs',
    'h-earth-3d/tools/imi-empirical-platform/schemas/route.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/schemas/study-receipt.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/schemas/portfolio-registry.schema.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/routes/example-hospital-route.v1.json',
    'h-earth-3d/tools/imi-empirical-platform/examples/example-hospital-rows.v1.json',
    'h-earth-3d/validation/imi-empirical-platform/imi.empirical-platform.runner.mjs'
  ],
  boundaries: {
    officialScaleClaimed: false,
    routeCertificationPerformed: false,
    realStudyDataLoaded: false,
    empiricalValidationClaimed: false,
    productionReleaseAuthorized: false,
    publicReleaseAuthorized: false,
    stop: 'STOP_AFTER_REPOSITORY_INTEGRATED_PREOFFICIAL_TOOLBASE_MODULE_AND_FIXTURE_VALIDATION'
  },
  result: 'IMI_EMPIRICAL_PLATFORM_PREOFFICIAL_TOOLBASE_INTEGRATION_READY_FOR_VALIDATION'
};

export const IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1 = deepFreeze({
  ...authorityBody,
  authorityDigest: canonicalDigest(authorityBody)
});

export default IMI_EMPIRICAL_PLATFORM_AUTHORITY_v1;
