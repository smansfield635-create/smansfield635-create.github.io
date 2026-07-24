import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'showroom/globe/h-earth/capacity.base.js');
const targetPath = path.join(root, 'showroom/globe/h-earth/capacity.js');
const retiredPath = sourcePath;
const artifactDirectory = path.join(root, 'artifacts/h-earth-capacity-single-module-restoration');
const artifactCapacityPath = path.join(artifactDirectory, 'capacity.js');
const receiptPath = path.join(artifactDirectory, 'receipt.json');

const read = (value) => fs.readFileSync(value, 'utf8');
const sha256 = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex');

function replaceExact(source, expected, replacement, identity) {
  const first = source.indexOf(expected);
  const last = source.lastIndexOf(expected);
  if (first < 0 || first !== last) {
    throw new Error(`${identity}: expected exactly one source occurrence`);
  }
  return source.slice(0, first) + replacement + source.slice(first + expected.length);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const baseSource = read(sourcePath);
let generated = baseSource;

generated = replaceExact(
  generated,
`  initialProjectionCandidate: deepFreeze({
    position: deepFreeze({
      x: 0,
      y: 24,
      z: 64
    }),

    target: deepFreeze({
      x: 0,
      y: 0.5,
      z: -128
    }),

    up: deepFreeze({
      x: 0,
      y: 1,
      z: 0
    }),

    verticalFovDegrees: 52,
    nearPlane: 0.25,
    farPlane: 194,

    cameraStateAuthority:
      'COMPOSITOR',

    projectionAuthority:
      'RENDERER'
  }),`,
`  initialProjectionCandidate: deepFreeze({
    position: deepFreeze({
      x: 0,
      y: 14,
      z: -240
    }),

    target: deepFreeze({
      x: 0,
      y: 0.6,
      z: -48
    }),

    up: deepFreeze({
      x: 0,
      y: 1,
      z: 0
    }),

    verticalFovDegrees: 60,
    nearPlane: 0.25,
    farPlane: 512,

    cameraStateAuthority:
      'COMPOSITOR',

    projectionAuthority:
      'RENDERER'
  }),`,
  'camera-envelope-replacement'
);

generated = replaceExact(
  generated,
`    yawDegrees: deepFreeze({
      minimum: -38,
      maximum: 38,

      maximumDeltaPerIntent: 8,

      wrapPermitted: false
    }),`,
`    yawDegrees: deepFreeze({
      minimum: -180,
      maximum: 180,

      maximumDeltaPerIntent: 8,

      wrapPermitted: true,
      initialWaterwardYawDegrees: 180,
      compositionArcDegrees: 76
    }),`,
  'waterward-yaw-capacity-replacement'
);

const presentationBlock = `

/**
 * Land-side camera composition and bounded living-presentation capacity.
 * These declarations create no animation runtime and mutate no admitted geometry.
 */
export const H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID =
  'H_EARTH_LANDWARD_GROUND_INSPECTION_CAMERA_ENVELOPE_v2_SINGLE_MODULE';

export const H_EARTH_3D_CAMERA_COMPOSITION_INTENT = deepFreeze({
  compositionId:
    H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,
  compositionRole:
    'LANDWARD_GROUND_INSPECTION_LOOKING_WATERWARD',
  cameraSide:
    'LAND_SIDE_NEGATIVE_Z',
  viewDirection:
    'TOWARD_POSITIVE_Z_WATER_SIDE',
  shorelineReferenceZ: -96,
  wetSandForegroundRequired: true,
  foamContactSeamRequired: true,
  waterRecessionRequired: true,
  futureContextDepthReserved: true,
  admittedGeometryMutationPermitted: false,
  animationStandardPreparationOnly: true,
  moduleGraphPolicy:
    'EXISTING_NINETEEN_MODULE_BROWSER_GRAPH_ONLY'
});

export const H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID =
  'H_EARTH_MINIMUM_SHORELINE_LIVING_PRESENTATION_CAPACITY_v2_SINGLE_MODULE';

export const H_EARTH_3D_LIVING_PRESENTATION_CAPACITY = deepFreeze({
  capacityId:
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,
  status:
    'CAPACITY_STANDARD_DEFINED_RUNTIME_NOT_CREATED',
  sourceObjectIds: deepFreeze([
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_005_SHORELINE_FOAM_LINE',
    'OBJ_007_WATER_SURFACE_PLANE'
  ]),
  moduleGraph: deepFreeze({
    canonicalCapacityPath:
      '/showroom/globe/h-earth/capacity.js',
    auxiliaryCapacityModulePermitted: false,
    governedBrowserRowCount: 19,
    graphExpansionPermitted: false
  }),
  geometryBoundary: deepFreeze({
    admittedGeometryMutationPermitted: false,
    admittedVertexMutationPermitted: false,
    admittedIndexMutationPermitted: false,
    admittedBoundsMutationPermitted: false,
    primitiveIdentityMutationPermitted: false,
    sourceObjectIdentityMutationPermitted: false,
    sharedShorelineBoundaryMutationPermitted: false,
    materialPresentationMutationPermitted: true
  }),
  scheduler: deepFreeze({
    singleCoordinatorRequired: true,
    requestAnimationFrameRequired: true,
    maximumActiveFramesPerSecond: 30,
    nominalFrameIntervalMilliseconds: 1000 / 30,
    maximumMainThreadWorkMillisecondsPerFrame: 8,
    unboundedTimersPermitted: false,
    duplicateAnimationLoopsPermitted: false,
    deterministicPhaseSeedsRequired: true
  }),
  suspension: deepFreeze({
    suspendWhenDocumentHidden: true,
    suspendWhenStageOffscreen: true,
    suspendOnPageHide: true,
    controlledResumeRequired: true,
    backgroundAnimationWorkPermitted: false
  }),
  reducedMotion: deepFreeze({
    operatingSystemPreferenceRequired: true,
    staticEquivalentRequired: true,
    animationLoopsMustStop: true,
    timersMustStop: true,
    semanticInformationMustRemainAvailable: true
  }),
  permittedMotionChannels: deepFreeze([
    'TRANSFORM',
    'OPACITY',
    'BACKGROUND_POSITION',
    'BOUNDED_CSS_CUSTOM_PROPERTY'
  ]),
  prohibitedMotionChannels: deepFreeze([
    'LAYOUT_GEOMETRY',
    'DOM_NODE_CHURN',
    'ADMITTED_VERTEX_REWRITE',
    'ADMITTED_INDEX_REWRITE',
    'SHORELINE_BOUNDARY_REWRITE',
    'PHYSICAL_FLUID_SIMULATION'
  ]),
  materialMotionIntent: deepFreeze({
    wetSand:
      'SUBTLE_REFLECTED_LIGHT_AND_DAMP_SHEEN_VARIATION',
    foam:
      'GENTLE_CONTACT_BRIGHTNESS_AND_LATERAL_PHASE_MOTION',
    water:
      'SLOW_SURFACE_SHIMMER_AND_DIRECTIONAL_HIGHLIGHT_DRIFT'
  }),
  qualityCapacity: deepFreeze({
    maximumConcurrentMaterialAnimations: 3,
    devicePixelRatioMustRemainWithinViewportCapacity: true,
    adaptiveQualityPermitted: true,
    frameCostSamplingRequired: true,
    qualityMayDecreaseToProtectFrameBudget: true,
    qualityMayIncreaseOnlyWithinDeclaredCapacity: true
  }),
  lifecycleStates: deepFreeze([
    'IDLE',
    'RUNNING',
    'SUSPENDED',
    'REDUCED_MOTION_STATIC',
    'DISPOSED'
  ]),
  claimCeilings: deepFreeze({
    animationRuntimeCreated: false,
    animationExecuted: false,
    fluidSimulationCreated: false,
    physicalWaveSimulationCreated: false,
    weatherSimulationCreated: false,
    traversalCreated: false,
    gameplayCreated: false,
    visualPassClaim: false,
    productionClaim: false
  })
});
`;

generated = replaceExact(
  generated,
`});

/**
 * Render-stage limits.
 */
export const H_EARTH_3D_RENDER_STAGE_LIMITS`,
`});${presentationBlock}

/**
 * Render-stage limits.
 */
export const H_EARTH_3D_RENDER_STAGE_LIMITS`,
  'presentation-capacity-insertion'
);

generated = replaceExact(
  generated,
`  checks.push(
    createCapacityCheck(
      'CAPACITY_CONTROLLER_INTENT_SHAPE_COMPLETE',
      controllerIntentShapeComplete
    )
  );

  const evaluatorsAvailable = [`,
`  checks.push(
    createCapacityCheck(
      'CAPACITY_CONTROLLER_INTENT_SHAPE_COMPLETE',
      controllerIntentShapeComplete
    )
  );

  checks.push(
    createCapacityCheck(
      'CAPACITY_LANDWARD_CAMERA_ENVELOPE_DEFINED',
      H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.position.z <
        H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.target.z
    )
  );

  checks.push(
    createCapacityCheck(
      'CAPACITY_WATERWARD_YAW_ELIGIBLE',
      H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.yawDegrees.minimum <= 180 &&
        H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.yawDegrees.maximum >= 180
    )
  );

  checks.push(
    createCapacityCheck(
      'CAPACITY_LIVING_PRESENTATION_STANDARD_DEFINED',
      H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.claimCeilings.animationRuntimeCreated === false
    )
  );

  const evaluatorsAvailable = [`,
  'preflight-check-insertion'
);

generated = replaceExact(
  generated,
`  initialProjectionCandidateDefined: true,
  positionBoundsDefined: true,`,
`  initialProjectionCandidateDefined: true,
  cameraEnvelopeCorrectionId:
    H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,
  cameraCompositionIntentDefined: true,
  livingPresentationCapacityId:
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,
  livingPresentationCapacityDefined: true,
  animationRuntimeCreated: false,
  auxiliaryCapacityModuleRequired: false,
  governedBrowserModuleCount: 19,
  positionBoundsDefined: true,`,
  'receipt-capacity-fields-insertion'
);

generated = replaceExact(
  generated,
`  cameraCapacity:
    H_EARTH_3D_CAMERA_CAPACITY,

  renderStageLimits:`,
`  cameraCapacity:
    H_EARTH_3D_CAMERA_CAPACITY,

  cameraCompositionIntent:
    H_EARTH_3D_CAMERA_COMPOSITION_INTENT,

  livingPresentationCapacity:
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY,

  renderStageLimits:`,
  'contract-capacity-fields-insertion'
);

generated = replaceExact(
  generated,
`  nextRequired:
    'RE_EXECUTE_COMPOSITOR_AND_RENDERER_GAUGE_AGAINST_RECONCILED_CAMERA_ENVELOPE',`,
`  nextRequired:
    'EXECUTE_NINETEEN_ROW_DEPLOYED_MODULE_AND_RENDERER_CORRIDOR_AUDIT',`,
  'receipt-next-required-renewal'
);

assert(!generated.includes("from './capacity.base.js'"), 'generated capacity must not import capacity.base.js');
assert(!generated.includes("export * from './capacity.base.js'"), 'generated capacity must not re-export capacity.base.js');
assert(generated.includes('governedBrowserRowCount: 19'), 'generated capacity must preserve nineteen-row graph law');
assert(generated.includes('initialWaterwardYawDegrees: 180'), 'generated capacity must declare waterward yaw');

fs.mkdirSync(artifactDirectory, { recursive: true });
fs.writeFileSync(artifactCapacityPath, generated, 'utf8');
fs.writeFileSync(targetPath, generated, 'utf8');
fs.rmSync(retiredPath);

const capacityUrl = `${pathToFileURL(targetPath).href}?audit=${Date.now()}`;
const capacity = await import(capacityUrl);
const compositor = await import(`${pathToFileURL(path.join(root, 'showroom/globe/h-earth/compositor.js')).href}?audit=${Date.now()}`);
const renderer = await import(`${pathToFileURL(path.join(root, 'showroom/globe/h-earth/renderer.js')).href}?audit=${Date.now()}`);
const environment = await import(`${pathToFileURL(path.join(root, 'showroom/globe/h-earth/environment.js')).href}?audit=${Date.now()}`);
const admittedFrame = await import(`${pathToFileURL(path.join(root, 'showroom/globe/h-earth/admitted-geometry-frame.js')).href}?audit=${Date.now()}`);

const initial = capacity.H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate;
const offset = {
  x: initial.position.x - initial.target.x,
  y: initial.position.y - initial.target.y,
  z: initial.position.z - initial.target.z
};
const initialYawDegrees = Math.atan2(offset.x, offset.z) * 180 / Math.PI;
const yawBounds = capacity.H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.yawDegrees;
const initialCameraState = compositor.H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE;
const cameraEvaluation = capacity.evaluateHEarth3DCameraCapacity(initialCameraState);
const poseEvaluation = compositor.resolveHEarth3DCompositorCameraPose(initialCameraState, 0);

const checks = {
  singleCanonicalCapacityFilePresent: fs.existsSync(targetPath),
  auxiliaryCapacityFileAbsent: !fs.existsSync(retiredPath),
  generatedModuleHasNoAuxiliaryImport: !generated.includes('capacity.base.js'),
  contractIdentityPreserved:
    capacity.H_EARTH_3D_CAPACITY_CONTRACT_ID ===
      'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v2',
  landwardCameraPositioned:
    initial.position.z < initial.target.z && initial.position.z === -240,
  waterwardYawResolved:
    Math.abs(Math.abs(initialYawDegrees) - 180) < 1e-9,
  waterwardYawWithinCapacity:
    initialYawDegrees >= yawBounds.minimum && initialYawDegrees <= yawBounds.maximum,
  compositorInitialYawCorresponds:
    Math.abs(Math.abs(initialCameraState.yawDegrees) - 180) < 1e-9,
  compositorInitialCameraCapacityEligible:
    cameraEvaluation.eligible === true,
  compositorInitialPoseEligible:
    poseEvaluation.eligible === true,
  cameraDepthEnvelopeExpanded:
    initial.farPlane === 512 && initial.nearPlane === 0.25,
  livingPresentationDefined:
    capacity.H_EARTH_3D_LIVING_PRESENTATION_CAPACITY?.scheduler?.maximumActiveFramesPerSecond === 30,
  animationRuntimeWithheld:
    capacity.H_EARTH_3D_LIVING_PRESENTATION_CAPACITY?.claimCeilings?.animationRuntimeCreated === false,
  geometryMutationWithheld:
    capacity.H_EARTH_3D_LIVING_PRESENTATION_CAPACITY?.geometryBoundary?.admittedGeometryMutationPermitted === false,
  compositorImported: typeof compositor.H_EARTH_3D_COMPOSITOR_CONTRACT_ID === 'string',
  rendererImported: typeof renderer.H_EARTH_3D_RENDERER_CONTRACT_ID === 'string',
  environmentImported: typeof environment.H_EARTH_3D_ENVIRONMENT_CONTRACT_ID === 'string',
  admittedFrameImported: typeof admittedFrame.H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID === 'string'
};

const failedChecks = Object.entries(checks).filter(([, passed]) => passed !== true).map(([name]) => name);
const receipt = {
  receiptId: 'H_EARTH_CAPACITY_SINGLE_MODULE_RESTORATION_BUILD_AND_EXECUTION_RECEIPT_v1',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  sourceCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  canonicalCapacityPath: '/showroom/globe/h-earth/capacity.js',
  retiredAuxiliaryPath: '/showroom/globe/h-earth/capacity.base.js',
  governedBrowserModuleCount: 19,
  generatedByteLength: Buffer.byteLength(generated, 'utf8'),
  generatedSha256: sha256(generated),
  initialYawDegrees,
  yawBounds,
  initialCameraState,
  cameraEvaluationStatus: cameraEvaluation.status,
  poseEvaluationStatus: poseEvaluation.status,
  moduleExports: {
    capacity: Object.keys(capacity).sort(),
    compositor: Object.keys(compositor).sort(),
    renderer: Object.keys(renderer).sort(),
    environment: Object.keys(environment).sort(),
    admittedFrame: Object.keys(admittedFrame).sort()
  },
  totalChecks: Object.keys(checks).length,
  passedChecks: Object.values(checks).filter(Boolean).length,
  failedChecks,
  checks,
  boundaries: {
    admittedGeometryMutated: false,
    animationRuntimeCreated: false,
    fluidSimulationCreated: false,
    mainChanged: false,
    mergeAuthorityCreated: false
  }
};

fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (failedChecks.length > 0) process.exitCode = 1;
