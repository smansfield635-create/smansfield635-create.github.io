import { canonicalDigest, deepFreeze, requireNonEmptyString } from './platform-core.mjs';

export const CONTROLLING_RMA3_MAIN_HEAD = 'accdec74088120446bfc28f4441fc08a8210813f';
export const ACCEPTED_CP2_RENDERER_BLOB = 'de55609b0b0bd66601445a369c727ff7a6d7065d';

const authorityPartition = {
  repository: ['SOURCE_IDENTITY', 'COMMIT_IDENTITY', 'BLOB_IDENTITY', 'TREE_IDENTITY', 'AUTHORIZED_MUTATION'],
  executedBrowser: ['RUNTIME_BEHAVIOR'],
  liveRouteAndBinding: ['PUBLIC_STATE'],
  physicalDeviceSession: ['PHYSICAL_DEVICE_BEHAVIOR'],
  userDifferential: ['PRODUCT_ACCEPTANCE'],
  defaultPromotionAndReverification: ['PUBLIC_DEFAULT']
};

export function createProjectContext(overrides = {}) {
  const sourceHead = requireNonEmptyString(overrides.sourceHead ?? CONTROLLING_RMA3_MAIN_HEAD, 'SOURCE_HEAD');
  const body = {
    schemaVersion: 'H_EARTH_PROJECT_CONTEXT_v1',
    repository: 'smansfield635-create/smansfield635-create.github.io',
    baseBranch: 'main',
    sourceHead,
    controllingRMA3MainHead: CONTROLLING_RMA3_MAIN_HEAD,
    acceptedLiveBaseline: 'CP2',
    acceptedPresentationProfile: 'H_EARTH_GRATITUDE_REGION_CP2_ROUND_1_PRESENTATION_PROFILE_v1',
    acceptedRenderer: {
      path: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
      blob: ACCEPTED_CP2_RENDERER_BLOB
    },
    liveHost: 'showroom/globe/h-earth/index.html',
    liveBinding: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    terrainAuthority: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
    navigationAuthority: 'showroom/globe/h-earth/functional-landscape/navigation.js',
    permanentSceneRegistryVersion: 'H_EARTH_PERMANENT_SCENE_REGISTRY_v1',
    activeProgram: 'H_EARTH_INSTRUMENT_PLATFORM_v1',
    currentTerrainOperation: 'H_EARTH_CP2_MEASURED_SIGNATURE_PERCEPTUAL_CORRESPONDENCE_TEST_v1',
    acceptedClosedCheckpoints: ['CP0', 'CP1'],
    acceptedEngineeringCheckpoint: 'CP2',
    openAuthorityQuestions: [
      'DOES_THE_MEASURED_CP2_SIGNATURE_CORRESPOND_TO_THE_REPETITION_THE_USER_ACTUALLY_OBJECTS_TO'
    ],
    protectedAuthorities: [
      'ACCEPTED_CP2_RENDERER',
      'RUN_8B_TERRAIN_FIELD',
      'CANONICAL_RENDER_PACKAGE',
      'CANONICAL_GPU_UPLOAD_VIEWS',
      'NAVIGATION_AUTHORITY',
      'LIVE_HOST',
      'LIVE_BINDING',
      'PERMANENT_EIGHT_SCENES'
    ],
    prohibitedDirections: [
      'MORPHOLOGY_PROBE_BEFORE_PERCEPTUAL_CORRESPONDENCE',
      'WHOLE_BAKED_MAP_BEFORE_PERCEPTUAL_CORRESPONDENCE',
      'GENERAL_SHADER_REPLACEMENT_BEFORE_PERCEPTUAL_CORRESPONDENCE',
      'METRIC_DRIVEN_PRODUCT_CANDIDATE_BEFORE_PERCEPTUAL_CORRESPONDENCE',
      'AUTOMATIC_LIVE_ADMISSION',
      'AUTOMATIC_PRODUCT_ACCEPTANCE'
    ],
    authorityPartition,
    lifecycleLaw: {
      sourceImplemented: ['WRITTEN', 'COMMITTED', 'FETCHED_BACK', 'EXACT_REPOSITORY_VERIFIED'],
      runtimeImplemented: ['SOURCE_IMPLEMENTED', 'EXECUTED_FROM_EXACT_SOURCE'],
      liveAvailable: ['RUNTIME_IMPLEMENTED', 'BOUNDED_LIVE_ADMISSION'],
      productAccepted: ['LIVE_AVAILABLE', 'USER_DIFFERENTIAL_RECORDED'],
      publicDefault: ['PRODUCT_ACCEPTED', 'SEPARATE_PROMOTION', 'PUBLIC_REVERIFICATION']
    },
    bottlenecks: {
      repositoryExecutionTransfer: 'RELIABLE_REPOSITORY_EXECUTION_TRANSFER',
      diagnosisToCandidateAuthority: 'INTEGRATED_DIAGNOSIS_TO_CANDIDATE_AUTHORITY'
    },
    boundaries: {
      productMutationAuthorized: false,
      liveStateMutationAuthorized: false,
      candidateConstructionAutomaticallyAuthorized: false
    }
  };
  return deepFreeze({ ...body, projectContextId: `H_EARTH_PROJECT_CONTEXT_${canonicalDigest(body).replace(':', '_')}` });
}

export const H_EARTH_PROJECT_CONTEXT = createProjectContext();
export default H_EARTH_PROJECT_CONTEXT;
