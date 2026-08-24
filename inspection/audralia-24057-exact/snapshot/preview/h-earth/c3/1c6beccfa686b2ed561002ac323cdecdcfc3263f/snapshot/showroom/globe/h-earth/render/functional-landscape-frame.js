/**
 * /showroom/globe/h-earth/render/functional-landscape-frame.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_ADMITTED_FRAME_RUN_6E_v3
 *
 * Constructs one successor renderer frame from the neutral functional
 * landscape, existing West admission, and the bounded successor transfer.
 * Existing wet-sand and minimum-shoreline admitted-frame modes remain intact.
 */

import {
  admitHEarthPrimitiveBatch,
  isHEarthAggregateFrameAdmissionRecord
} from './geometry-kernel.js';

import { previewHEarthFunctionalLandscape } from './landscape-preview.js';
import {
  buildHEarthFunctionalLandscapePostWestTransfer,
  H_EARTH_FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_CONTRACT_ID
} from '../../../../h-earth-3d/integration/h-earth.functional-landscape-post-west-transfer.js';
import { H_EARTH_3D_CAMERA_CAPACITY } from '../capacity.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const finiteVector = (value) => value && ['x', 'y', 'z'].every((axis) =>
  typeof value[axis] === 'number' && Number.isFinite(value[axis]));

// C3C2 camera-to-envelope sizing. The accessible authored region remains frozen;
// only already noninteractive visible-world continuation receives additional draw reach.
const C3C2_VISUAL_HORIZON_FAR_PLANE = 5600;

export const H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_ADMITTED_FRAME_C3C2_CLOSED_PLANETARY_WORLD_v1';
export const H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE =
  'FUNCTIONAL_LANDSCAPE_COAST_TO_INLAND_PROOF';
export const H_EARTH_FUNCTIONAL_LANDSCAPE_COMPATIBILITY_MODES = freeze([
  'FIRST_ADMITTED_WET_SAND_PROOF',
  'MINIMUM_NATIVE_SHORELINE_PROOF'
]);

function defaultCamera() {
  const source = H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate;
  return freeze({
    position: { ...source.position },
    target: { ...source.target },
    up: { ...source.up },
    verticalFovDegrees: source.verticalFovDegrees,
    nearPlane: source.nearPlane,
    farPlane: Math.max(source.farPlane, C3C2_VISUAL_HORIZON_FAR_PLANE),
    sourceCapacityContractId: 'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5',
    cameraAuthority: source.cameraStateAuthority,
    visualHorizonReachOnly: true,
    navigationExtentExpanded: false,
    collisionExtentExpanded: false
  });
}

function defaultEnvironment() {
  return freeze({
    environmentSnapshotId: 'H_EARTH_FUNCTIONAL_LANDSCAPE_ENVIRONMENT_C3C2_CLOSED_PLANETARY_COAST_001',
    sourceEnvironmentContractId: 'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034M_PUBLIC_STAGE_ENVIRONMENT_DESCRIPTOR_v1',
    climateIdentity: 'WARM_SUBTROPICAL_COASTAL',
    skyTop: [56, 105, 139, 255],
    skyHorizon: [182, 211, 204, 255],
    groundHaze: [126, 153, 134, 255],
    humidityCharacter: 'WARM_MARITIME_HAZE_WITH_GREEN_REFLECTED_GROUND_LIGHT',
    horizonClosed: true,
    fullViewportSkyCoverageRequired: true,
    celestialReferenceRequired: true,
    curvedHorizonHazeRequired: true,
    distanceHazeEnabled: true,
    ownsSkyAuthority: false,
    baselinePreservationId: 'H_EARTH_C3C1_OWNER_NAVIGATED_SUCCESS_BASELINE_20260816'
  });
}

function stablePaletteIndex(primitive, count) {
  const token = String(primitive?.metadata?.chunkId ?? primitive?.primitiveId ?? '');
  let hash = 0;
  for (let index = 0; index < token.length; index += 1) hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
  return count > 0 ? hash % count : 0;
}

function decorateSubtropicalPrimitive(primitive) {
  const intent = String(primitive?.materialHint?.materialIntent ??
    primitive?.materialHint?.materialReference ?? 'DEFAULT');
  if (intent.includes('WATER') || intent.includes('FOAM')) return primitive;

  const physicalRole = String(primitive?.metadata?.physicalRole ?? '');
  const isDistant = intent.includes('DISTANT') || primitive?.metadata?.visualContinuationLayer === true;
  const isTerrain = primitive?.semanticRole === 'FUNCTIONAL_LANDSCAPE_TERRAIN_CHUNK';
  if (!isDistant && !isTerrain) return primitive;

  const coastal = [
    [81, 105, 68, 255],
    [94, 108, 72, 255],
    [74, 101, 65, 255],
    [105, 106, 74, 255]
  ];
  const transition = [
    [66, 101, 62, 255],
    [75, 108, 66, 255],
    [82, 105, 67, 255],
    [70, 95, 61, 255]
  ];
  const inland = [
    [60, 92, 58, 255],
    [70, 98, 61, 255],
    [76, 94, 63, 255],
    [63, 88, 57, 255]
  ];
  const distant = [
    [67, 87, 70, 255],
    [73, 91, 72, 255],
    [62, 82, 66, 255]
  ];

  let palette = coastal;
  if (isDistant) palette = distant;
  else if (physicalRole.includes('INLAND_ELEVATED')) palette = inland;
  else if (physicalRole.includes('COASTAL_TO_INLAND')) palette = transition;

  return freeze({
    ...primitive,
    renderMaterial: freeze({
      rgba: palette[stablePaletteIndex(primitive, palette.length)],
      transparencyClass: 'OPAQUE'
    }),
    metadata: freeze({
      ...primitive.metadata,
      climatePresentation: 'WARM_SUBTROPICAL_COASTAL',
      materialDistribution: isDistant
        ? 'ATMOSPHERIC_SUBTROPICAL_DISTANCE'
        : 'MUTED_VEGETATED_MOSAIC_WITH_JUSTIFIED_SOIL_AND_STONE_EXPOSURE',
      uniformGreening: false,
      rendererAuthorityCreated: false
    })
  });
}

function createPresentationAssignment(primitive) {
  const intent = primitive?.materialHint?.materialIntent ??
    primitive?.materialHint?.materialReference ?? 'DEFAULT';
  const isWater = String(intent).includes('WATER');
  const isFoam = String(intent).includes('FOAM');
  const isDistant = String(intent).includes('HIGHLAND') || String(intent).includes('DISTANT');
  return freeze({
    primitiveId: primitive.primitiveId,
    presentationMode: H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE,
    physicalPass: isWater || isFoam ? 'TRANSLUCENT' : 'OPAQUE',
    depthClass: isDistant ? 'DISTANT_PROXY' : 'ACTIVE_GEOMETRY',
    materialReference: primitive?.materialHint?.materialReference ?? null,
    materialIntent: intent,
    semanticRole: primitive.semanticRole ?? null,
    semanticAddressIds: primitive?.metadata?.memberAddressIds ?? [],
    formationIds: primitive?.metadata?.formationIds ?? [primitive?.metadata?.formationId].filter(Boolean),
    geometryIdentityPreserved: true,
    sourceGeometryReconstructed: false,
    admissionRecordAltered: false,
    rendererResourceCreated: false
  });
}

export function constructHEarthFunctionalLandscapeFrame({
  frameOccurrenceId = 'H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_OCCURRENCE_001',
  transferOccurrenceId = 'H_EARTH_FUNCTIONAL_LANDSCAPE_TRANSFER_OCCURRENCE_001',
  camera = defaultCamera(),
  viewport = { width: 1280, height: 720, pixelRatio: 1 },
  environment = defaultEnvironment(),
  revision = 1
} = {}) {
  const issues = [];
  if (typeof frameOccurrenceId !== 'string' || frameOccurrenceId.length === 0) issues.push('FRAME_OCCURRENCE_ID_INVALID');
  if (!finiteVector(camera?.position) || !finiteVector(camera?.target) || !finiteVector(camera?.up)) issues.push('CAMERA_INVALID');
  if (!Number.isFinite(viewport?.width) || !Number.isFinite(viewport?.height) || viewport.width <= 0 || viewport.height <= 0) issues.push('VIEWPORT_INVALID');
  if (!Number.isSafeInteger(revision) || revision < 1) issues.push('REVISION_INVALID');

  const neutralPreview = previewHEarthFunctionalLandscape();
  if (neutralPreview.ok !== true) issues.push('NEUTRAL_PREVIEW_INVALID');

  const westAdmission = issues.length === 0
    ? admitHEarthPrimitiveBatch(neutralPreview.primitives, {
        frameId: `${frameOccurrenceId}:WEST_AGGREGATE`,
        metadata: { successorProgram: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6', presentationMode: H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE }
      })
    : null;

  if (westAdmission?.valid !== true || !isHEarthAggregateFrameAdmissionRecord(westAdmission?.frame)) issues.push('WEST_ADMISSION_FAILED');

  const transfer = issues.length === 0
    ? buildHEarthFunctionalLandscapePostWestTransfer({ neutralPreview, westBatchAdmissionResult: westAdmission, transferOccurrenceId })
    : null;

  if (transfer?.ok !== true || transfer.contractId !== H_EARTH_FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_CONTRACT_ID) issues.push('POST_WEST_TRANSFER_FAILED');

  if (issues.length > 0) {
    return freeze({ ok: false, status: 'FUNCTIONAL_LANDSCAPE_FRAME_REJECTED', contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_CONTRACT_ID, frameOccurrenceId, neutralPreview, westAdmission, transfer, issues });
  }

  const admittedPrimitives = transfer.admittedPrimitives.map(decorateSubtropicalPrimitive);
  const presentationAssignments = admittedPrimitives.map(createPresentationAssignment);

  return freeze({
    ok: true,
    status: 'FUNCTIONAL_LANDSCAPE_ADMITTED_FRAME_COMPLETE',
    frameType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_ADMITTED_FRAME',
    contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_CONTRACT_ID,
    frameOccurrenceId,
    frameId: frameOccurrenceId,
    revision,
    presentationMode: H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE,
    compatibilityModesPreserved: H_EARTH_FUNCTIONAL_LANDSCAPE_COMPATIBILITY_MODES,
    packet001Altered: false,
    existingPacket002Altered: false,
    existingAdmittedGeometryFrameAltered: false,
    transfer,
    westAggregateFrameAdmissionRecord: transfer.aggregateFrameAdmissionRecord,
    primitiveCount: admittedPrimitives.length,
    primitiveIds: transfer.primitiveIds,
    primitives: admittedPrimitives,
    admittedPrimitives,
    bounds: transfer.bounds,
    semanticAddressCount: transfer.semanticAddressCount,
    semanticAddressIds: transfer.semanticAddressIds,
    terrainAddressCount: transfer.terrainAddressCount,
    terrainAddressIds: transfer.terrainAddressIds,
    shorelineWaterAddressCount: transfer.shorelineWaterAddressCount,
    shorelineWaterAddressIds: transfer.shorelineWaterAddressIds,
    proxySummarizedAddressCount: transfer.proxySummarizedAddressCount,
    proxySummarizedAddressIds: transfer.proxySummarizedAddressIds,
    formationIds: transfer.formationIds,
    shorelineBandIds: transfer.shorelineBandIds,
    semanticIdentityIndependentOfPhysicalGranularity: true,
    camera: freeze({ ...camera }),
    viewport: freeze({ ...viewport }),
    environment: freeze({ ...environment }),
    visualHorizonReach: freeze({
      farPlane: camera.farPlane,
      minimumRequiredFarPlane: C3C2_VISUAL_HORIZON_FAR_PLANE,
      sizingBasis: 'COASTAL_ENTRY_CAMERA_TO_C3C2_NONINTERACTIVE_WORLD_ENVELOPE_WITH_MARGIN',
      farthestRequiredDistanceApprox: 5200,
      navigationExtentExpanded: false,
      collisionExtentExpanded: false,
      semanticAddressExtentExpanded: false,
      purpose: 'RENDER_NONINTERACTIVE_WORLD_CONTINUATION_TO_ATMOSPHERIC_DISTANCE_BEYOND_FROZEN_ACCESSIBLE_REGION'
    }),
    presentationAssignments,
    visibility: freeze({ visiblePrimitiveIds: transfer.primitiveIds, hiddenPrimitiveIds: [], visibilityAuthority: 'FUNCTIONAL_LANDSCAPE_SUCCESSOR_COMPOSITOR' }),
    geometryConstructionAuthority: false,
    westAdmissionAuthority: false,
    rendererAuthority: false,
    runtimeActivated: false,
    productionAuthority: false,
    issues: []
  });
}
