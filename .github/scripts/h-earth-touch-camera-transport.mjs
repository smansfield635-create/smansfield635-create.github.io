import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const mode = process.argv[2] ?? 'apply';
const targetPath = 'showroom/globe/h-earth/index.js';
const baseCommit = '691346d3f0dbe8e16f46c705a78d26f63c733d1b';

function replaceExact(source, oldText, newText, label) {
  const first = source.indexOf(oldText);
  const last = source.lastIndexOf(oldText);
  if (first < 0 || first !== last) {
    throw new Error(`${label}_EXPECTED_EXACTLY_ONCE:first=${first}:last=${last}`);
  }
  return source.slice(0, first) + newText + source.slice(first + oldText.length);
}

function apply() {
  let source = fs.readFileSync(targetPath, 'utf8');

  source = replaceExact(
    source,
    [
      ' * → RENDERER MOUNT',
      ' * → EXPLICIT SOURCE-PREVIEW TAKEOVER'
    ].join('\n'),
    [
      ' * → RENDERER MOUNT',
      ' * → BOUNDED TOUCH-CAMERA INTENT BINDING',
      ' * → EXPLICIT SOURCE-PREVIEW TAKEOVER'
    ].join('\n'),
    'HEADER_SEQUENCE'
  );

  source = replaceExact(
    source,
    [
      '    rendererReleaseAuthorized:',
      '      true,',
      '',
      '    branchSpecificModuleImportDiagnosticsAuthorized:'
    ].join('\n'),
    [
      '    rendererReleaseAuthorized:',
      '      true,',
      '',
      '    touchCameraIntentBindingAuthorized:',
      '      true,',
      '',
      '    onePointerOrbitIntentAuthorized:',
      '      true,',
      '',
      '    twoPointerPinchDistanceIntentAuthorized:',
      '      true,',
      '',
      '    branchSpecificModuleImportDiagnosticsAuthorized:'
    ].join('\n'),
    'BOUNDARY_FLAGS'
  );

  source = replaceExact(
    source,
    [
      '  listenerAbortController:',
      '    null,',
      '',
      '  selectedTargetId:'
    ].join('\n'),
    [
      '  listenerAbortController:',
      '    null,',
      '',
      '  touchCameraCleanup:',
      '    null,',
      '',
      '  touchCameraReceipt:',
      '    null,',
      '',
      '  touchCameraGestureRevision:',
      '    0,',
      '',
      '  selectedTargetId:'
    ].join('\n'),
    'MODULE_STATE_FIELDS'
  );

  source = replaceExact(
    source,
    [
      'function resetCurrentOccurrenceEvidence() {',
      '  MODULE_STATE.sourcePreviewStatus ='
    ].join('\n'),
    [
      'function resetCurrentOccurrenceEvidence() {',
      '  releaseHEarthTouchCameraControls();',
      '',
      '  MODULE_STATE.touchCameraReceipt =',
      '    null;',
      '',
      '  MODULE_STATE.touchCameraGestureRevision =',
      '    0;',
      '',
      '  MODULE_STATE.sourcePreviewStatus ='
    ].join('\n'),
    'OCCURRENCE_RESET'
  );

  source = replaceExact(
    source,
    [
      "    'hEarthRendererMounted',",
      "    'hEarthRunFunctionExecuted',"
    ].join('\n'),
    [
      "    'hEarthRendererMounted',",
      "    'hEarthTouchCameraControls',",
      "    'hEarthRunFunctionExecuted',"
    ].join('\n'),
    'RESET_DATASET_KEYS'
  );

  source = replaceExact(
    source,
    [
      "    'H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT'",
      '  ];'
    ].join('\n'),
    [
      "    'H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT',",
      "    'H_EARTH_3D_TOUCH_CAMERA_CONTROL_RECEIPT',",
      "    'H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT'",
      '  ];'
    ].join('\n'),
    'ACTIVE_GLOBAL_KEYS'
  );

  const touchCameraSource = String.raw`
export const H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID =
  'H_EARTH_3D_TOUCH_CAMERA_ORBIT_AND_PINCH_DISTANCE_CONTROL_v1';

const H_EARTH_3D_TOUCH_CAMERA_LIMITS =
  deepFreeze({
    orbitYawDegreesPerPixel: 0.11,
    orbitPitchDegreesPerPixel: 0.09,
    maximumOrbitDeltaDegreesPerFrame: 8,
    pinchDistanceScalePerViewport: 0.9,
    maximumZoomScaleDeltaPerFrame: 0.14,
    minimumMaterialPixelDelta: 0.75
  });

function clampHEarthTouchCameraNumber(
  value,
  minimum,
  maximum
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      Number.isFinite(value)
        ? value
        : 0
    )
  );
}

function getHEarthTouchPointerDistance(
  first,
  second
) {
  return Math.hypot(
    second.x - first.x,
    second.y - first.y
  );
}

function publishHEarthTouchCameraReceipt(
  receipt,
  {
    installation = false
  } = {}
) {
  if (installation) {
    MODULE_STATE.touchCameraReceipt =
      receipt;

    globalThis
      .H_EARTH_3D_TOUCH_CAMERA_CONTROL_RECEIPT =
      receipt;
  } else {
    globalThis
      .H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT =
      receipt;
  }

  return receipt;
}

function releaseHEarthTouchCameraControls() {
  const cleanup =
    MODULE_STATE.touchCameraCleanup;

  MODULE_STATE.touchCameraCleanup =
    null;

  if (typeof cleanup !== 'function') {
    return false;
  }

  try {
    cleanup();
    return true;
  } catch (_error) {
    return false;
  }
}

function applyHEarthTouchCameraIntent(
  intent,
  gestureMode
) {
  const compositorModule =
    MODULE_STATE.compositorModule;

  const rendererModule =
    MODULE_STATE.rendererModule;

  const applyIntent =
    compositorModule
      ?.applyHEarth3DCompositorIntent;

  const createHandoff =
    compositorModule
      ?.getHEarth3DCompositorRendererHandoff;

  const applyHandoff =
    rendererModule
      ?.applyHEarth3DRendererHandoff;

  if (
    typeof applyIntent !== 'function' ||
    typeof createHandoff !== 'function' ||
    typeof applyHandoff !== 'function'
  ) {
    return publishHEarthTouchCameraReceipt(
      deepFreeze({
        receiptType:
          'H_EARTH_3D_TOUCH_CAMERA_GESTURE_RECEIPT',
        controlId:
          H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID,
        accepted: false,
        applied: false,
        gestureMode,
        status:
          'TOUCH_CAMERA_RUNTIME_API_UNAVAILABLE',
        intent,
        cameraStateOwnedByRoute: false,
        compositorCameraAuthorityPreserved: true,
        admittedGeometryMutated: false,
        traversalCreated: false
      })
    );
  }

  const intentReceipt =
    applyIntent(intent);

  if (intentReceipt?.accepted !== true) {
    return publishHEarthTouchCameraReceipt(
      deepFreeze({
        receiptType:
          'H_EARTH_3D_TOUCH_CAMERA_GESTURE_RECEIPT',
        controlId:
          H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID,
        accepted: false,
        applied: false,
        gestureMode,
        status:
          'TOUCH_CAMERA_INTENT_REJECTED',
        intent,
        intentReceipt:
          safeSerialize(intentReceipt),
        cameraStateOwnedByRoute: false,
        compositorCameraAuthorityPreserved: true,
        admittedGeometryMutated: false,
        traversalCreated: false
      })
    );
  }

  const initializationKey =
    MODULE_STATE.activeInitializationKey;

  let handoff;
  let rendererApplyReceipt;

  try {
    handoff =
      createHandoff({
        packet002Transfer:
          initializationKey?.packet002Transfer,
        packet002TransferOccurrenceId:
          initializationKey?.packet002TransferOccurrenceId,
        presentationMode:
          initializationKey?.presentationMode
      });

    rendererApplyReceipt =
      applyHandoff(handoff);
  } catch (error) {
    return publishHEarthTouchCameraReceipt(
      deepFreeze({
        receiptType:
          'H_EARTH_3D_TOUCH_CAMERA_GESTURE_RECEIPT',
        controlId:
          H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID,
        accepted: true,
        applied: false,
        gestureMode,
        status:
          'TOUCH_CAMERA_REPROJECTION_THREW',
        intent,
        intentReceipt:
          safeSerialize(intentReceipt),
        ...getErrorEvidence(error),
        cameraStateOwnedByRoute: false,
        compositorCameraAuthorityPreserved: true,
        admittedGeometryMutated: false,
        traversalCreated: false
      })
    );
  }

  const applied =
    rendererApplyReceipt?.applied === true;

  if (applied) {
    MODULE_STATE.compositorHandoff =
      handoff;

    MODULE_STATE.touchCameraGestureRevision +=
      1;

    const routeRoot =
      MODULE_STATE.mountPoints?.routeRoot;

    if (routeRoot?.dataset) {
      routeRoot.dataset
        .hEarthTouchCameraGestureRevision =
        String(
          MODULE_STATE.touchCameraGestureRevision
        );
    }
  }

  return publishHEarthTouchCameraReceipt(
    deepFreeze({
      receiptType:
        'H_EARTH_3D_TOUCH_CAMERA_GESTURE_RECEIPT',
      controlId:
        H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID,
      accepted: true,
      applied,
      gestureMode,
      status:
        applied
          ? 'TOUCH_CAMERA_GESTURE_APPLIED'
          : 'TOUCH_CAMERA_RENDERER_REPROJECTION_REJECTED',
      gestureRevision:
        MODULE_STATE.touchCameraGestureRevision,
      intent,
      intentReceipt:
        safeSerialize(intentReceipt),
      rendererApplyReceipt:
        safeSerialize(rendererApplyReceipt),
      cameraStateOwnedByRoute: false,
      compositorCameraAuthorityPreserved: true,
      rendererProjectionAuthorityPreserved: true,
      admittedGeometryMutated: false,
      DOMScaledAsPageContent: false,
      traversalCreated: false
    })
  );
}

function installHEarthTouchCameraControls({
  mountElement,
  routeRoot
} = {}) {
  releaseHEarthTouchCameraControls();

  if (
    !mountElement ||
    typeof mountElement.addEventListener !==
      'function'
  ) {
    return publishHEarthTouchCameraReceipt(
      deepFreeze({
        receiptType:
          'H_EARTH_3D_TOUCH_CAMERA_CONTROL_RECEIPT',
        controlId:
          H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID,
        active: false,
        status:
          'TOUCH_CAMERA_MOUNT_UNAVAILABLE',
        onePointerOrbit: false,
        twoPointerPinchDistance: false,
        cameraStateOwnedByRoute: false,
        admittedGeometryMutated: false,
        traversalCreated: false
      }),
      { installation: true }
    );
  }

  const compositorModule =
    MODULE_STATE.compositorModule;

  const rendererModule =
    MODULE_STATE.rendererModule;

  const APIsEligible =
    typeof compositorModule
      ?.applyHEarth3DCompositorIntent ===
      'function' &&
    typeof compositorModule
      ?.getHEarth3DCompositorRendererHandoff ===
      'function' &&
    typeof rendererModule
      ?.applyHEarth3DRendererHandoff ===
      'function';

  if (!APIsEligible) {
    return publishHEarthTouchCameraReceipt(
      deepFreeze({
        receiptType:
          'H_EARTH_3D_TOUCH_CAMERA_CONTROL_RECEIPT',
        controlId:
          H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID,
        active: false,
        status:
          'TOUCH_CAMERA_REQUIRED_APIS_UNAVAILABLE',
        onePointerOrbit: false,
        twoPointerPinchDistance: false,
        cameraStateOwnedByRoute: false,
        admittedGeometryMutated: false,
        traversalCreated: false
      }),
      { installation: true }
    );
  }

  const intentTypes =
    compositorModule
      .H_EARTH_3D_COMPOSITOR_INTENT_TYPES;

  const activePointers =
    new Map();

  let lastPinchDistance =
    null;

  let pendingYawDegrees =
    0;

  let pendingPitchDegrees =
    0;

  let pendingZoomScale =
    0;

  let frameHandle =
    null;

  const previousStyle = {
    touchAction:
      mountElement.style.touchAction,
    overscrollBehavior:
      mountElement.style.overscrollBehavior,
    userSelect:
      mountElement.style.userSelect,
    cursor:
      mountElement.style.cursor
  };

  function cancelScheduledFrame() {
    if (frameHandle === null) {
      return;
    }

    if (
      typeof globalThis.cancelAnimationFrame ===
      'function'
    ) {
      globalThis.cancelAnimationFrame(
        frameHandle
      );
    } else {
      globalThis.clearTimeout(
        frameHandle
      );
    }

    frameHandle =
      null;
  }

  function flushPendingIntent() {
    frameHandle =
      null;

    if (
      Math.abs(pendingZoomScale) >
      0.0001
    ) {
      const zoomScaleDelta =
        clampHEarthTouchCameraNumber(
          pendingZoomScale,
          -H_EARTH_3D_TOUCH_CAMERA_LIMITS
            .maximumZoomScaleDeltaPerFrame,
          H_EARTH_3D_TOUCH_CAMERA_LIMITS
            .maximumZoomScaleDeltaPerFrame
        );

      pendingZoomScale =
        0;

      pendingYawDegrees =
        0;

      pendingPitchDegrees =
        0;

      applyHEarthTouchCameraIntent(
        {
          type:
            intentTypes.zoom,
          zoomScaleDelta
        },
        'TWO_POINTER_PINCH_DISTANCE'
      );

      return;
    }

    if (
      Math.abs(pendingYawDegrees) <=
        0.0001 &&
      Math.abs(pendingPitchDegrees) <=
        0.0001
    ) {
      return;
    }

    const yawDeltaDegrees =
      clampHEarthTouchCameraNumber(
        pendingYawDegrees,
        -H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .maximumOrbitDeltaDegreesPerFrame,
        H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .maximumOrbitDeltaDegreesPerFrame
      );

    const pitchDeltaDegrees =
      clampHEarthTouchCameraNumber(
        pendingPitchDegrees,
        -H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .maximumOrbitDeltaDegreesPerFrame,
        H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .maximumOrbitDeltaDegreesPerFrame
      );

    pendingYawDegrees =
      0;

    pendingPitchDegrees =
      0;

    applyHEarthTouchCameraIntent(
      {
        type:
          intentTypes.orbit,
        yawDeltaDegrees,
        pitchDeltaDegrees
      },
      'ONE_POINTER_ORBIT'
    );
  }

  function schedulePendingIntent() {
    if (frameHandle !== null) {
      return;
    }

    if (
      typeof globalThis.requestAnimationFrame ===
      'function'
    ) {
      frameHandle =
        globalThis.requestAnimationFrame(
          flushPendingIntent
        );
    } else {
      frameHandle =
        globalThis.setTimeout(
          flushPendingIntent,
          16
        );
    }
  }

  function onPointerDown(event) {
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    activePointers.set(
      event.pointerId,
      {
        x: event.clientX,
        y: event.clientY
      }
    );

    if (activePointers.size >= 2) {
      const points =
        Array.from(
          activePointers.values()
        );

      lastPinchDistance =
        getHEarthTouchPointerDistance(
          points[0],
          points[1]
        );

      pendingYawDegrees =
        0;

      pendingPitchDegrees =
        0;
    }

    try {
      mountElement.setPointerCapture(
        event.pointerId
      );
    } catch (_error) {
      // Synthetic and unsupported pointer-capture occurrences remain lawful.
    }

    mountElement.dataset
      .hEarthTouchCameraGestureMode =
      activePointers.size >= 2
        ? 'pinch'
        : 'orbit';
  }

  function onPointerMove(event) {
    const priorPoint =
      activePointers.get(
        event.pointerId
      );

    if (!priorPoint) {
      return;
    }

    event.preventDefault();

    const nextPoint = {
      x: event.clientX,
      y: event.clientY
    };

    activePointers.set(
      event.pointerId,
      nextPoint
    );

    if (activePointers.size >= 2) {
      const points =
        Array.from(
          activePointers.values()
        );

      const currentDistance =
        getHEarthTouchPointerDistance(
          points[0],
          points[1]
        );

      if (lastPinchDistance === null) {
        lastPinchDistance =
          currentDistance;

        return;
      }

      const distanceDelta =
        currentDistance -
        lastPinchDistance;

      lastPinchDistance =
        currentDistance;

      if (
        Math.abs(distanceDelta) <
        H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .minimumMaterialPixelDelta
      ) {
        return;
      }

      const viewportReference =
        Math.max(
          240,
          Math.min(
            mountElement.clientWidth || 0,
            mountElement.clientHeight || 0
          )
        );

      pendingZoomScale +=
        -distanceDelta /
        viewportReference *
        H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .pinchDistanceScalePerViewport;

      pendingYawDegrees =
        0;

      pendingPitchDegrees =
        0;

      schedulePendingIntent();

      return;
    }

    const deltaX =
      nextPoint.x -
      priorPoint.x;

    const deltaY =
      nextPoint.y -
      priorPoint.y;

    if (
      Math.abs(deltaX) <
        H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .minimumMaterialPixelDelta &&
      Math.abs(deltaY) <
        H_EARTH_3D_TOUCH_CAMERA_LIMITS
          .minimumMaterialPixelDelta
    ) {
      return;
    }

    pendingYawDegrees +=
      -deltaX *
      H_EARTH_3D_TOUCH_CAMERA_LIMITS
        .orbitYawDegreesPerPixel;

    pendingPitchDegrees +=
      deltaY *
      H_EARTH_3D_TOUCH_CAMERA_LIMITS
        .orbitPitchDegreesPerPixel;

    schedulePendingIntent();
  }

  function onPointerEnd(event) {
    if (!activePointers.has(event.pointerId)) {
      return;
    }

    event.preventDefault();

    activePointers.delete(
      event.pointerId
    );

    if (activePointers.size < 2) {
      lastPinchDistance =
        null;
    }

    mountElement.dataset
      .hEarthTouchCameraGestureMode =
      activePointers.size >= 2
        ? 'pinch'
        : activePointers.size === 1
          ? 'orbit'
          : 'idle';

    try {
      mountElement.releasePointerCapture(
        event.pointerId
      );
    } catch (_error) {
      // Pointer capture may already be released.
    }
  }

  mountElement.addEventListener(
    'pointerdown',
    onPointerDown,
    { passive: false }
  );

  mountElement.addEventListener(
    'pointermove',
    onPointerMove,
    { passive: false }
  );

  mountElement.addEventListener(
    'pointerup',
    onPointerEnd,
    { passive: false }
  );

  mountElement.addEventListener(
    'pointercancel',
    onPointerEnd,
    { passive: false }
  );

  mountElement.addEventListener(
    'lostpointercapture',
    onPointerEnd,
    { passive: false }
  );

  mountElement.style.touchAction =
    'none';

  mountElement.style.overscrollBehavior =
    'contain';

  mountElement.style.userSelect =
    'none';

  mountElement.style.cursor =
    'grab';

  mountElement.dataset
    .hEarthTouchCameraControls =
    'active';

  mountElement.dataset
    .hEarthTouchCameraGestureMode =
    'idle';

  if (routeRoot?.dataset) {
    routeRoot.dataset
      .hEarthTouchCameraControls =
      'true';

    routeRoot.dataset
      .hEarthTouchCameraGestureRevision =
      String(
        MODULE_STATE.touchCameraGestureRevision
      );
  }

  MODULE_STATE.touchCameraCleanup =
    () => {
      cancelScheduledFrame();

      activePointers.clear();

      mountElement.removeEventListener(
        'pointerdown',
        onPointerDown
      );

      mountElement.removeEventListener(
        'pointermove',
        onPointerMove
      );

      mountElement.removeEventListener(
        'pointerup',
        onPointerEnd
      );

      mountElement.removeEventListener(
        'pointercancel',
        onPointerEnd
      );

      mountElement.removeEventListener(
        'lostpointercapture',
        onPointerEnd
      );

      mountElement.style.touchAction =
        previousStyle.touchAction;

      mountElement.style.overscrollBehavior =
        previousStyle.overscrollBehavior;

      mountElement.style.userSelect =
        previousStyle.userSelect;

      mountElement.style.cursor =
        previousStyle.cursor;

      delete mountElement.dataset
        .hEarthTouchCameraControls;

      delete mountElement.dataset
        .hEarthTouchCameraGestureMode;

      if (routeRoot?.dataset) {
        routeRoot.dataset
          .hEarthTouchCameraControls =
          'false';
      }
    };

  return publishHEarthTouchCameraReceipt(
    deepFreeze({
      receiptType:
        'H_EARTH_3D_TOUCH_CAMERA_CONTROL_RECEIPT',
      controlId:
        H_EARTH_3D_TOUCH_CAMERA_CONTROL_CONTRACT_ID,
      active: true,
      status:
        'TOUCH_CAMERA_CONTROLS_ACTIVE',
      onePointerOrbit: true,
      twoPointerPinchDistance: true,
      pinchInMeaning:
        'INCREASE_CAMERA_DISTANCE_ZOOM_SCALE',
      spreadMeaning:
        'DECREASE_CAMERA_DISTANCE_ZOOM_SCALE',
      pageScaleGestureUsed: false,
      cameraStateOwnedByRoute: false,
      compositorCameraAuthorityPreserved: true,
      rendererProjectionAuthorityPreserved: true,
      admittedGeometryMutated: false,
      DOMNodeCountChangedByControlInstallation: false,
      traversalCreated: false
    }),
    { installation: true }
  );
}
`;

  source = replaceExact(
    source,
    [
      '/* ==========================================================================',
      ' * 12 · DEPLOYED MODULE RESPONSE DIAGNOSTICS',
      ' * ========================================================================== */'
    ].join('\n'),
    touchCameraSource + '\n\n' + [
      '/* ==========================================================================',
      ' * 12 · DEPLOYED MODULE RESPONSE DIAGNOSTICS',
      ' * ========================================================================== */'
    ].join('\n'),
    'TOUCH_CAMERA_FUNCTION_INSERTION'
  );

  source = replaceExact(
    source,
    [
      'function releaseRendererSafely({',
      '  cleanupReason = null',
      '} = {}) {',
      '  const releaseFunction ='
    ].join('\n'),
    [
      'function releaseRendererSafely({',
      '  cleanupReason = null',
      '} = {}) {',
      '  releaseHEarthTouchCameraControls();',
      '',
      '  const releaseFunction ='
    ].join('\n'),
    'RENDERER_RELEASE_CLEANUP'
  );

  source = replaceExact(
    source,
    [
      '  markSourcePreviewTakenOver();',
      '',
      '  return deepFreeze({'
    ].join('\n'),
    [
      '  markSourcePreviewTakenOver();',
      '',
      '  const touchCameraReceipt =',
      '    installHEarthTouchCameraControls({',
      '      mountElement:',
      '        mountPoints.rendererMount,',
      '      routeRoot:',
      '        mountPoints.routeRoot',
      '    });',
      '',
      '  return deepFreeze({'
    ].join('\n'),
    'TOUCH_CAMERA_INSTALLATION'
  );

  source = replaceExact(
    source,
    [
      '    previewMetadataPreserved:',
      '      true,',
      '',
      '    exactCompositorContractRequired:'
    ].join('\n'),
    [
      '    previewMetadataPreserved:',
      '      true,',
      '',
      '    touchCameraReceipt,',
      '',
      '    touchCameraControlsActive:',
      '      touchCameraReceipt?.active ===',
      '      true,',
      '',
      '    exactCompositorContractRequired:'
    ].join('\n'),
    'BOOTSTRAP_RECEIPT_TOUCH_FIELDS'
  );

  source = replaceExact(
    source,
    [
      '  routeRoot.dataset',
      '    .hEarthRendererMounted =',
      '    MODULE_STATE',
      '      .rendererMountReceipt',
      '      ?.mounted ===',
      '    true',
      "      ? 'true'",
      "      : 'false';",
      '',
      '  routeRoot.dataset',
      '    .hEarthCompositorImportSucceeded ='
    ].join('\n'),
    [
      '  routeRoot.dataset',
      '    .hEarthRendererMounted =',
      '    MODULE_STATE',
      '      .rendererMountReceipt',
      '      ?.mounted ===',
      '    true',
      "      ? 'true'",
      "      : 'false';",
      '',
      '  routeRoot.dataset',
      '    .hEarthTouchCameraControls =',
      '    MODULE_STATE',
      '      .touchCameraReceipt',
      '      ?.active ===',
      '    true',
      "      ? 'true'",
      "      : 'false';",
      '',
      '  routeRoot.dataset',
      '    .hEarthCompositorImportSucceeded ='
    ].join('\n'),
    'ROUTE_DATASET_TOUCH_STATE'
  );

  fs.writeFileSync(targetPath, source, 'utf8');
}

function validate() {
  execFileSync('node', ['--check', targetPath], { stdio: 'inherit' });
  const base = execFileSync(
    'git',
    ['show', `${baseCommit}:${targetPath}`],
    { encoding: 'utf8' }
  );
  const candidate = fs.readFileSync(targetPath, 'utf8');
  const createCount = (text) =>
    (text.match(/document\.createElement\(/g) ?? []).length;
  if (createCount(candidate) !== createCount(base)) {
    throw new Error('TOUCH_CONTROL_CHANGED_STATIC_DOM_CREATION_COUNT');
  }
  for (const required of [
    'H_EARTH_3D_TOUCH_CAMERA_ORBIT_AND_PINCH_DISTANCE_CONTROL_v1',
    "touchAction =\n    'none'",
    'applyHEarth3DCompositorIntent',
    'getHEarth3DCompositorRendererHandoff',
    'applyHEarth3DRendererHandoff',
    'ONE_POINTER_ORBIT',
    'TWO_POINTER_PINCH_DISTANCE',
    "pinchInMeaning:\n        'INCREASE_CAMERA_DISTANCE_ZOOM_SCALE'",
    'cameraStateOwnedByRoute: false',
    'admittedGeometryMutated: false',
    'traversalCreated: false'
  ]) {
    if (!candidate.includes(required)) {
      throw new Error(`REQUIRED_TOUCH_CONTROL_SURFACE_MISSING:${required}`);
    }
  }
  if (!candidate.includes('routeOwnsCameraState:\n      false')) {
    throw new Error('ROUTE_CAMERA_OWNERSHIP_BOUNDARY_CHANGED');
  }
}

if (mode === 'apply') {
  apply();
  validate();
} else if (mode === 'validate') {
  validate();
} else {
  throw new Error(`UNKNOWN_MODE:${mode}`);
}
