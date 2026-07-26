/**
 * /showroom/globe/h-earth/render/functional-landscape-compositor.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_COMPOSITOR_ADAPTER_RUN_6E_v2
 *
 * Isolated successor compositor adapter. It consumes one lawful functional-
 * landscape admitted frame, preserves primitive/admission identity across
 * camera revisions, and produces one successor renderer handoff.
 */

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE,
  constructHEarthFunctionalLandscapeFrame
} from './functional-landscape-frame.js';

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,
  prepareHEarthFunctionalLandscapeRenderPlan
} from './renderer.functional-landscape.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const finiteVector = (value) => value &&
  ['x', 'y', 'z'].every((axis) =>
    typeof value[axis] === 'number' && Number.isFinite(value[axis]));

const cameraValid = (camera) =>
  finiteVector(camera?.position) &&
  finiteVector(camera?.target) &&
  finiteVector(camera?.up) &&
  Number.isFinite(camera?.verticalFovDegrees) &&
  Number.isFinite(camera?.nearPlane) &&
  Number.isFinite(camera?.farPlane) &&
  camera.nearPlane > 0 &&
  camera.farPlane > camera.nearPlane;

export const H_EARTH_FUNCTIONAL_LANDSCAPE_COMPOSITOR_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_COMPOSITOR_ADAPTER_RUN_6E_v2_CAMERA_REVISION';

export function applyHEarthFunctionalLandscapeCameraRevision({
  baseFrame,
  camera,
  cameraRevision
} = {}) {
  const issues = [];

  if (baseFrame?.ok !== true ||
      baseFrame?.contractId !==
        H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_CONTRACT_ID ||
      baseFrame?.presentationMode !==
        H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE ||
      !Array.isArray(baseFrame?.primitives) ||
      baseFrame.primitives.length === 0) {
    issues.push('BASE_FUNCTIONAL_LANDSCAPE_FRAME_INVALID');
  }
  if (!cameraValid(camera)) {
    issues.push('CAMERA_REVISION_INVALID');
  }
  if (!Number.isSafeInteger(cameraRevision) || cameraRevision < 1) {
    issues.push('CAMERA_REVISION_SEQUENCE_INVALID');
  }

  if (issues.length > 0) {
    return freeze({
      ok: false,
      status: 'FUNCTIONAL_LANDSCAPE_CAMERA_REVISION_REJECTED',
      contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_COMPOSITOR_CONTRACT_ID,
      issues
    });
  }

  return freeze({
    ...baseFrame,
    status: 'FUNCTIONAL_LANDSCAPE_CAMERA_FRAME_COMPLETE',
    frameOccurrenceId:
      `${baseFrame.frameOccurrenceId}:CAMERA_REVISION_${cameraRevision}`,
    frameId:
      `${baseFrame.frameId}:CAMERA_REVISION_${cameraRevision}`,
    revision: baseFrame.revision + cameraRevision,
    cameraRevision,
    baseFrameOccurrenceId: baseFrame.frameOccurrenceId,
    camera: freeze({
      position: freeze({ ...camera.position }),
      target: freeze({ ...camera.target }),
      up: freeze({ ...camera.up }),
      verticalFovDegrees: camera.verticalFovDegrees,
      nearPlane: camera.nearPlane,
      farPlane: camera.farPlane,
      sourceCapacityContractId:
        camera.sourceCapacityContractId ??
        baseFrame.camera.sourceCapacityContractId,
      cameraAuthority:
        camera.cameraAuthority ??
        baseFrame.camera.cameraAuthority,
      terrainClearanceReceiptId:
        camera.terrainClearanceReceiptId ?? null
    }),
    primitiveMembershipPreserved: true,
    admissionRecordsPreserved: true,
    geometryReconstructed: false,
    westAdmissionRepeated: false,
    runtimeActivated: true,
    productionAuthority: false,
    issues: []
  });
}

export function constructHEarthFunctionalLandscapeRendererHandoff({
  frame = constructHEarthFunctionalLandscapeFrame(),
  materializationExtent = null
} = {}) {
  const issues = [];

  if (frame?.ok !== true ||
      frame?.contractId !== H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_CONTRACT_ID ||
      frame?.presentationMode !==
        H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE ||
      !Array.isArray(frame?.primitives) ||
      frame.primitives.length === 0) {
    issues.push('FUNCTIONAL_LANDSCAPE_FRAME_INVALID');
  }

  const width = Math.max(
    1,
    Math.floor(
      materializationExtent?.width ??
      frame?.viewport?.width ??
      1
    )
  );
  const height = Math.max(
    1,
    Math.floor(
      materializationExtent?.height ??
      frame?.viewport?.height ??
      1
    )
  );

  const renderPlan = issues.length === 0
    ? prepareHEarthFunctionalLandscapeRenderPlan(
        frame,
        { width, height }
      )
    : null;

  if (renderPlan?.eligible !== true ||
      renderPlan?.contractId !==
        H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID ||
      renderPlan.frameId !== frame.frameId) {
    issues.push('FUNCTIONAL_LANDSCAPE_RENDER_PLAN_INVALID');
  }

  if (issues.length > 0) {
    return freeze({
      ok: false,
      status: 'FUNCTIONAL_LANDSCAPE_COMPOSITOR_HANDOFF_REJECTED',
      contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_COMPOSITOR_CONTRACT_ID,
      frame,
      renderPlan,
      issues
    });
  }

  const visibleIds = new Set(frame.visibility.visiblePrimitiveIds);
  const plannedIds = new Set(
    renderPlan.triangles.map((triangle) => triangle.primitiveId)
  );
  const visiblePrimitivePlanCoverage = frame.primitiveIds.filter(
    (primitiveId) => plannedIds.has(primitiveId)
  );
  const noUnauthorizedVisibility = [...plannedIds].every(
    (primitiveId) => visibleIds.has(primitiveId)
  );

  if (!noUnauthorizedVisibility) {
    return freeze({
      ok: false,
      status: 'FUNCTIONAL_LANDSCAPE_COMPOSITOR_VISIBILITY_REJECTED',
      contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_COMPOSITOR_CONTRACT_ID,
      frame,
      renderPlan,
      issues: ['PLANNED_PRIMITIVE_NOT_VISIBLE_IN_FRAME']
    });
  }

  return freeze({
    ok: true,
    status: 'FUNCTIONAL_LANDSCAPE_COMPOSITOR_HANDOFF_COMPLETE',
    contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_COMPOSITOR_CONTRACT_ID,
    sourcePatternContractId:
      'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1',
    rendererContractId:
      H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,
    frameContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_FRAME_CONTRACT_ID,
    presentationMode: H_EARTH_FUNCTIONAL_LANDSCAPE_PRESENTATION_MODE,
    frameOccurrenceId: frame.frameOccurrenceId,
    frameRevision: frame.revision,
    cameraRevision: frame.cameraRevision ?? 0,
    frame,
    rendererFrame: frame,
    renderPlan,
    materializationExtent: freeze({ width, height }),
    visiblePrimitiveCount: frame.visibility.visiblePrimitiveIds.length,
    plannedPrimitiveCount: plannedIds.size,
    visiblePrimitivePlanCoverage,
    cameraAuthorityPreserved: true,
    viewportAuthorityPreserved: true,
    semanticIdentityPreserved: true,
    packet001Altered: false,
    compatibilityModesPreserved: frame.compatibilityModesPreserved,
    existingCompositorAltered: false,
    successorCompositorAdapter: true,
    runtimeActivated: frame.runtimeActivated === true,
    productionAuthority: false,
    issues: []
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_HANDOFF =
  constructHEarthFunctionalLandscapeRendererHandoff();
