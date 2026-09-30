import { deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { createProjectContext } from '../../tools/instrument-platform/project-context.mjs';
import toolRegistry from '../../tools/instrument-platform/tool-registry.mjs';
import sceneRegistry from '../../tools/instrument-platform/permanent-scene-registry.mjs';
import { assembleBoundedCandidate } from '../../tools/instrument-platform/bounded-candidate-assembler.mjs';

const controllingBaseHead = 'be895c33d72a332605e374b29750c30d7bed5b6d';
const candidateId = 'H_EARTH_POST_MERGE_ENGINEERING_PROOF_001';
const defaultRoute = '/h-earth-3d/tools/instrument-platform/';
const candidateRoute = `/h-earth-3d/tools/instrument-platform/?candidate=${candidateId}`;
const indexPath = 'h-earth-3d/tools/instrument-platform/index.html';
const platformPath = 'h-earth-3d/tools/instrument-platform/platform.mjs';
const exactPathScope = [
  '.github/workflows/h-earth-instrument-platform.yml',
  'h-earth-3d/control-plane/instrument-platform/H_EARTH_POST_MERGE_ENGINEERING_PROOF_001.v1.mjs',
  indexPath,
  platformPath,
  'h-earth-3d/validation/instrument-platform/h-earth.instrument-platform.runner.mjs'
];
const expectedSourceSha256 = {
  '.github/workflows/h-earth-instrument-platform.yml': '624884f7003bd383b651d4094c2d71624c9243ff57cf4301be63555246b2c673',
  [indexPath]: '820a947505934c97b21ab265bd862d49597430405f8ba2f63e52e8f89e97fc9c',
  [platformPath]: '31db712c2702a90a0c7931c72afb470fa1f92d2152f1c2dd0d2cf225436d751b',
  'h-earth-3d/validation/instrument-platform/h-earth.instrument-platform.runner.mjs': '729d07e304c7c1b050b12755d55fa0cd3de8845f8ea7d546df716723a9342aed'
};
const exactProjectContext = createProjectContext({ sourceHead: controllingBaseHead });
const candidateInput = {
  operationId: 'H_EARTH_UNIFIED_PLATFORM_POST_MERGE_ENGINEERING_PROOF_001',
  exactProjectContext,
  establishedDiagnosis: {
    status: 'ESTABLISHED',
    statement: 'THE_UNIFIED_INSTRUMENT_DOES_NOT_VISIBLY_EXPOSE_THE_IDENTITY_OF_THE_EXACT_DEPLOYED_SOURCE_AND_RUNTIME_RECEIPT_IT_IS_EXECUTING'
  },
  perceptualTarget: {
    status: 'ESTABLISHED',
    statement: 'ONE_READ_ONLY_CANDIDATE_GATED_POST_MERGE_EXECUTION_IDENTITY_PANEL'
  },
  causalTarget: {
    status: 'ESTABLISHED',
    statement: 'CANDIDATE_QUERY_PRESENTATION_AND_RUNTIME_IDENTITY_VERIFICATION_ONLY'
  },
  authorizedMutationManifest: {
    changeClass: 'PUBLIC_ROUTE_CHANGE',
    exactChangedPaths: exactPathScope,
    expectedBlobIdentities: expectedSourceSha256
  },
  protectedAuthoritySet: [
    {
      authorityId: 'ACCEPTED_CP2_H_EARTH_PRODUCT',
      paths: [
        'showroom/globe/h-earth/index.html',
        'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
        'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'
      ]
    },
    {
      authorityId: 'H_EARTH_TERRAIN_AND_NAVIGATION',
      paths: [
        'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
        'showroom/globe/h-earth/functional-landscape/navigation.js'
      ]
    }
  ],
  requiredVerificationMatrix: [
    { checkId: 'EXACT_WRITE_COMMIT_FETCH_BACK_SHA256', authorityClass: 'SOURCE_AUTHORITY' },
    { checkId: 'DEFAULT_ROUTE_NONREGRESSION', authorityClass: 'RUNTIME_AUTHORITY' },
    { checkId: 'CANDIDATE_ROUTE_IDENTITY_PANEL', authorityClass: 'RUNTIME_AUTHORITY' },
    { checkId: 'PUBLIC_CANDIDATE_DEPLOYMENT', authorityClass: 'PUBLIC_STATE_AUTHORITY' },
    { checkId: 'USER_DIFFERENTIAL_REQUIRED', authorityClass: 'PRODUCT_ACCEPTANCE_AUTHORITY' }
  ],
  rollbackRelation: { baseHead: controllingBaseHead, rollbackTarget: controllingBaseHead },
  stopBoundary: 'STOP_AFTER_PUBLIC_CANDIDATE_VERIFICATION_AWAIT_USER_DIFFERENTIAL',
  presumesUserAcceptance: false
};
const candidateAssembly = assembleBoundedCandidate(candidateInput);
if (candidateAssembly.authorized !== true) throw new Error(`POST_MERGE_PROOF_CANDIDATE_REFUSED:${candidateAssembly.refusalReasons?.join(',')}`);
if (candidateAssembly.isolatedBranch !== 'agent/h-earth-unified-platform-post-merge-engineering-proof-00-065b5cd7') throw new Error(`POST_MERGE_PROOF_BRANCH_IDENTITY_MISMATCH:${candidateAssembly.isolatedBranch}`);

export const H_EARTH_POST_MERGE_ENGINEERING_PROOF_001 = deepFreeze({
  schemaVersion: 'H_EARTH_POST_MERGE_ENGINEERING_PROOF_001_v1',
  operationId: candidateInput.operationId,
  candidateId,
  baselineId: 'H_EARTH_INSTRUMENT_PLATFORM_MAIN_be895c33',
  classification: 'REAL_POST_MERGE_ENGINEERING_OPERATION_COMPLETE_PLATFORM_TRAVERSAL',
  changeClass: 'PUBLIC_ROUTE_CHANGE',
  controllingBaseHead,
  defaultRoute,
  candidateRoute,
  indexPath,
  platformPath,
  exactPathScope,
  expectedSourceSha256,
  toolRegistryDigest: toolRegistry.registryDigest,
  sceneRegistryDigest: sceneRegistry.registryDigest,
  candidateInput,
  candidateAssembly,
  authorityPartition: exactProjectContext.authorityPartition,
  currentProofBoundary: 'ENGINEERING_AND_PUBLIC_CANDIDATE_VERIFICATION_BEFORE_USER_DIFFERENTIAL',
  boundaries: {
    hEarthProductMutationAuthorized: false,
    hEarthLiveRouteMutationAuthorized: false,
    acceptedRendererMutationAuthorized: false,
    terrainMutationAuthorized: false,
    automaticUserAcceptanceAuthorized: false,
    automaticDefaultPromotionAuthorized: false,
    defaultInstrumentRouteVisibleChangeAuthorizedBeforeDifferential: false
  },
  requiredNextAuthority: 'USER_DIFFERENTIAL_ON_DEFAULT_ROUTE_VERSUS_CANDIDATE_ROUTE'
});

export default H_EARTH_POST_MERGE_ENGINEERING_PROOF_001;
