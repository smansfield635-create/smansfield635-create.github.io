/* /products/archcoin/index.interactions.js
   ARCHCOIN adjustable pointer, gesture, semantic-input, and whole-crystal
   interaction interpreter.

   Module:
   DGB_ARCHCOIN_INTERACTIONS
   1.0.1-scene-capture-pointer-gesture-interpreter

   Required controller:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Corrected interaction model:
   - pointer events are observed from the ARCHCOIN root in capture phase;
   - projected semantic controls may sit above the scene field;
   - cardinal and room controls are recognized directly;
   - data-archcoin-destination is not required;
   - pointer capture belongs to the root-level interaction surface;
   - scene-field geometry remains the coordinate reference;
   - touch-action suppression applies only inside the ARCHCOIN interaction region;
   - normal page scrolling remains available outside that region.

   Owned:
   - pointerdown, pointermove, pointerup, pointercancel;
   - pointer capture and release;
   - mouse, touch, and pen normalization;
   - tap-versus-drag arbitration;
   - orbit drag interpretation;
   - cluster drag interpretation;
   - outward cluster-exit swipe classification;
   - whole-crystal circular hit testing;
   - semantic-label activation;
   - front-crystal / Compass / rear-crystal interaction priority;
   - synthetic-click suppression;
   - projection-to-control DOM application;
   - projected touch-target positioning;
   - pointer-event enablement for projected controls;
   - interaction receipts, validation, and disposal.

   Not owned:
   - navigation state;
   - legal transition policy;
   - selected wing or room state;
   - route authority;
   - orbit or cluster state mutation;
   - camera or projection mathematics;
   - crystal geometry;
   - crystal drawing;
   - Compass rendering;
   - final Return-to-Constellation authorization.

   Authority flow:
   physical pointer input
   -> DGB_ARCHCOIN_INTERACTIONS classification
   -> controller command request
   -> DGB_ARCHCOIN_CONTROLLER authorization
   -> canonical state transition

   Source status:
   CORRECTED_FILE_SPLIT_INTERACTION_SOURCE_CANDIDATE
   !=
   RUNTIME_PASS
   !=
   VISUAL_PASS
   !=
   PRODUCTION_AUTHORIZATION
*/

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id:
      "DGB_ARCHCOIN_INTERACTIONS",

    version:
      "1.0.1-scene-capture-pointer-gesture-interpreter",

    file:
      "/products/archcoin/index.interactions.js",

    requiredControllerModuleId:
      "DGB_ARCHCOIN_CONTROLLER",

    requiredControllerModuleVersion:
      "7.0.0-controller-interaction-semantic-priority"
  });

  const MODES = Object.freeze({
    NONE:
      "none",

    ORBIT:
      "orbit",

    CLUSTER:
      "cluster",

    COMPASS:
      "compass"
  });

  const TARGET_TYPES = Object.freeze({
    NONE:
      "none",

    CARDINAL:
      "cardinal",

    ROOM:
      "room",

    COMPASS:
      "compass"
  });

  const DEPTH_LAYERS = Object.freeze({
    FRONT:
      "front",

    REAR:
      "rear",

    UNKNOWN:
      "unknown"
  });

  const PRIORITIES = Object.freeze({
    FRONT:
      300,

    COMPASS:
      200,

    REAR:
      100,

    INACTIVE:
      0
  });

  const GESTURE = Object.freeze({
    dragDeadZonePx:
      8,

    exitSwipeMinimumPx:
      94,

    exitSwipeMinimumStartRadiusPx:
      42,

    exitSwipeDirectionThreshold:
      0.58,

    syntheticClickSuppressionMs:
      720,

    yawRadiansPerViewport:
      Math.PI * 1.35,

    pitchRadiansPerViewport:
      Math.PI * 0.92,

    maximumPitch:
      Math.PI * 0.42,

    cardinalFallbackRadiusPx:
      56,

    roomFallbackRadiusPx:
      34,

    minimumHitRadiusPx:
      18,

    releaseTolerancePx:
      10
  });

  const INTERACTIVE_CONTROL_SELECTOR = [
    "[data-archcoin-coin]",
    "[data-archcoin-room]",
    "[data-upstream-compass-control]"
  ].join(",");

  const EXCLUDED_GESTURE_SELECTOR = [
    "[data-archcoin-enter]",
    "[data-archcoin-return-to-orbit]",
    "[data-archcoin-return-home-compass]",
    "input",
    "select",
    "textarea",
    "summary",
    "[contenteditable='true']"
  ].join(",");

  const REQUIRED_CONTROLLER_SURFACES = Object.freeze([
    "getFrameState",
    "getSemanticProjection",
    "subscribeSemanticProjection",
    "beginOrbitGesture",
    "requestOrbitPreview",
    "requestOrbitCommit",
    "requestOrbitCancel",
    "beginClusterGesture",
    "requestClusterPreview",
    "requestClusterCommit",
    "requestClusterCancel",
    "requestCardinalSelection",
    "requestRoomSelection",
    "requestCompassSelection",
    "requestReturnToConstellation"
  ]);

  const state = {
    initialized:
      false,

    disposed:
      false,

    status:
      "uninitialized",

    root:
      null,

    scene:
      null,

    field:
      null,

    semanticLayer:
      null,

    compassControl:
      null,

    controller:
      null,

    pointer:
      null,

    semanticProjection:
      new Map(),

    semanticProjectionRevision:
      0,

    suppressedClick:
      null,

    unsubscribeSemanticProjection:
      null,

    interactionStyleSnapshots:
      new Map(),

    lastAction:
      "pending",

    lastFailure:
      "",

    validationReceipt:
      null
  };

  const RECEIPT = {
    receiptSchema:
      "ARCHCOIN_INTERACTIONS_RECEIPT_v2",

    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    controllerModuleId:
      "",

    controllerModuleVersion:
      "",

    initialized:
      false,

    status:
      "uninitialized",

    eventSurface:
      "ARCHCOIN_ROOT_CAPTURE_PHASE",

    coordinateSurface:
      "ARCHCOIN_SCENE_FIELD",

    directCardinalSelectorSupported:
      true,

    directRoomSelectorSupported:
      true,

    destinationMarkerRequired:
      false,

    pointerInterpreterOwned:
      true,

    pointerCaptureOwned:
      true,

    tapDragArbitrationOwned:
      true,

    orbitSwipeClassificationOwned:
      true,

    clusterSwipeClassificationOwned:
      true,

    clusterExitSwipeClassificationOwned:
      true,

    wholeCrystalHitTestingOwned:
      true,

    semanticClickDelegationOwned:
      true,

    syntheticClickSuppressionOwned:
      true,

    projectionDomApplicationOwned:
      true,

    navigationTransitionAuthorityOwned:
      false,

    orbitStateAuthorityOwned:
      false,

    clusterStateAuthorityOwned:
      false,

    routeAuthorityOwned:
      false,

    cameraOwned:
      false,

    crystalGeometryOwned:
      false,

    activePointer:
      false,

    pointerMode:
      MODES.NONE,

    pointerDragging:
      false,

    semanticProjectionRevision:
      0,

    semanticProjectionCount:
      0,

    lastAction:
      "pending",

    lastFailure:
      "",

    runtimePassClaimed:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  };

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error =
      new Error(code);

    error.code =
      code;

    error.details =
      details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(
      selector
    );
  }

  function qsa(
    selector,
    root = document
  ) {
    return Array.from(
      root.querySelectorAll(
        selector
      )
    );
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number =
      Number(value);

    return Number.isFinite(
      number
    )
      ? number
      : fallback;
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        value
      )
    );
  }

  function distance2d(
    x1,
    y1,
    x2,
    y2
  ) {
    return Math.hypot(
      x2 - x1,
      y2 - y1
    );
  }

  function normalizeElement(target) {
    if (
      target instanceof Element
    ) {
      return target;
    }

    if (
      target &&
      target.parentElement instanceof
        Element
    ) {
      return target.parentElement;
    }

    return null;
  }

  function normalizeKind(value) {
    const kind =
      String(value || "")
        .trim()
        .toLowerCase();

    if (
      kind ===
        "coin" ||
      kind ===
        "cardinal"
    ) {
      return TARGET_TYPES.CARDINAL;
    }

    if (
      kind ===
      "room"
    ) {
      return TARGET_TYPES.ROOM;
    }

    return TARGET_TYPES.NONE;
  }

  function normalizeDepthLayer(value) {
    const layer =
      String(value || "")
        .trim()
        .toLowerCase();

    if (
      layer ===
      DEPTH_LAYERS.FRONT
    ) {
      return DEPTH_LAYERS.FRONT;
    }

    if (
      layer ===
      DEPTH_LAYERS.REAR
    ) {
      return DEPTH_LAYERS.REAR;
    }

    return DEPTH_LAYERS.UNKNOWN;
  }

  function normalizeId(value) {
    return String(
      value || ""
    ).trim();
  }

  function projectionKey(
    kind,
    id
  ) {
    return `${
      normalizeKind(
        kind
      )
    }:${
      normalizeId(
        id
      )
    }`;
  }

  function wrapRadians(value) {
    let angle =
      finiteNumber(
        value,
        0
      );

    while (
      angle >
      Math.PI
    ) {
      angle -=
        Math.PI * 2;
    }

    while (
      angle <
      -Math.PI
    ) {
      angle +=
        Math.PI * 2;
    }

    return angle;
  }

  function cloneOrientation(
    orientation
  ) {
    const source =
      orientation &&
      typeof orientation ===
        "object"
        ? orientation
        : {};

    const quaternion =
      Array.isArray(
        source.quaternion
      ) ||
      ArrayBuffer.isView(
        source.quaternion
      )
        ? Array.from(
            source.quaternion
          ).slice(
            0,
            4
          )
        : [
            0,
            0,
            0,
            1
          ];

    while (
      quaternion.length <
      4
    ) {
      quaternion.push(
        quaternion.length ===
          3
          ? 1
          : 0
      );
    }

    return {
      yaw:
        finiteNumber(
          source.yaw,
          0
        ),

      pitch:
        finiteNumber(
          source.pitch,
          0
        ),

      roll:
        finiteNumber(
          source.roll,
          0
        ),

      quaternion,

      primaryId:
        normalizeId(
          source.primaryId ||
          source.primaryWing ||
          source.primaryRoom
        )
    };
  }

  function frameState() {
    return state.controller
      .getFrameState();
  }

  function currentMode(frame) {
    if (
      !frame ||
      frame.held
    ) {
      return MODES.NONE;
    }

    if (
      frame.navigationState ===
        state.controller.states
          .CONSTELLATION
    ) {
      return MODES.ORBIT;
    }

    if (
      frame.navigationState ===
        state.controller.states
          .CLUSTER_OPEN ||
      frame.navigationState ===
        state.controller.states
          .ROOM_SELECTED
    ) {
      return MODES.CLUSTER;
    }

    return MODES.NONE;
  }

  function currentOriginOrientation(
    frame,
    mode
  ) {
    if (
      mode ===
      MODES.ORBIT
    ) {
      return cloneOrientation(
        frame
          .committedOrbitOrientation ||
        frame.orbitOrientation
      );
    }

    if (
      mode ===
        MODES.CLUSTER &&
      frame.cluster
    ) {
      return cloneOrientation(
        frame.cluster
          .committedOrientation ||
        frame.cluster.orientation
      );
    }

    return cloneOrientation(
      null
    );
  }

  function activeClusterWing(frame) {
    return normalizeId(
      frame &&
      frame.activeClusterWing
    );
  }

  function fallbackRadiusForKind(
    kind
  ) {
    if (
      normalizeKind(
        kind
      ) ===
      TARGET_TYPES.CARDINAL
    ) {
      return GESTURE
        .cardinalFallbackRadiusPx;
    }

    if (
      normalizeKind(
        kind
      ) ===
      TARGET_TYPES.ROOM
    ) {
      return GESTURE
        .roomFallbackRadiusPx;
    }

    return 0;
  }

  function effectiveRadius(record) {
    const declared =
      Math.max(
        0,
        finiteNumber(
          record &&
          record.radiusPx,
          0
        )
      );

    return Math.max(
      GESTURE.minimumHitRadiusPx,
      declared ||
      fallbackRadiusForKind(
        record &&
        record.kind
      )
    );
  }

  function priorityForProjection(
    projection
  ) {
    if (
      !projection ||
      projection.visible ===
        false
    ) {
      return PRIORITIES.INACTIVE;
    }

    if (
      projection.depthLayer ===
      DEPTH_LAYERS.FRONT
    ) {
      return PRIORITIES.FRONT;
    }

    if (
      projection.depthLayer ===
        DEPTH_LAYERS.REAR &&
      projection.compassOverlap
    ) {
      return PRIORITIES.INACTIVE;
    }

    if (
      projection.depthLayer ===
      DEPTH_LAYERS.REAR
    ) {
      return PRIORITIES.REAR;
    }

    return PRIORITIES.INACTIVE;
  }

  function recordPermittedByFrame(
    record,
    frame
  ) {
    if (
      !record ||
      !frame ||
      frame.held ||
      record.visible ===
        false
    ) {
      return false;
    }

    const kind =
      normalizeKind(
        record.kind
      );

    if (
      frame.navigationState ===
        state.controller.states
          .CONSTELLATION
    ) {
      return (
        kind ===
        TARGET_TYPES.CARDINAL
      );
    }

    if (
      frame.navigationState ===
        state.controller.states
          .CLUSTER_OPEN ||
      frame.navigationState ===
        state.controller.states
          .ROOM_SELECTED
    ) {
      if (
        kind !==
        TARGET_TYPES.ROOM
      ) {
        return false;
      }

      const canonical =
        state.controller
          .canonicalRoomRecords
          .find(
            room =>
              room.roomId ===
              record.id
          );

      return Boolean(
        canonical &&
        canonical.wing ===
          frame.activeClusterWing
      );
    }

    return false;
  }

  function fieldPointFromClient(
    clientX,
    clientY
  ) {
    const rect =
      state.field
        .getBoundingClientRect();

    return Object.freeze({
      x:
        finiteNumber(
          clientX,
          rect.left
        ) -
        rect.left,

      y:
        finiteNumber(
          clientY,
          rect.top
        ) -
        rect.top,

      rect
    });
  }

  function pointInsideRect(
    clientX,
    clientY,
    rect
  ) {
    return (
      clientX >=
        rect.left &&
      clientX <=
        rect.right &&
      clientY >=
        rect.top &&
      clientY <=
        rect.bottom
    );
  }

  function pointInsideField(
    clientX,
    clientY
  ) {
    if (
      !state.field
    ) {
      return false;
    }

    return pointInsideRect(
      clientX,
      clientY,
      state.field
        .getBoundingClientRect()
    );
  }

  function eventOriginInsideInteractionRegion(
    event
  ) {
    const element =
      normalizeElement(
        event.target
      );

    if (
      element &&
      (
        state.scene.contains(
          element
        ) ||
        state.semanticLayer.contains(
          element
        ) ||
        state.compassControl.contains(
          element
        )
      )
    ) {
      return true;
    }

    return pointInsideField(
      event.clientX,
      event.clientY
    );
  }

  function hitTestCrystals(
    clientX,
    clientY,
    frame = frameState()
  ) {
    const local =
      fieldPointFromClient(
        clientX,
        clientY
      );

    const matches = [];

    for (
      const record
      of state.semanticProjection
        .values()
    ) {
      if (
        !recordPermittedByFrame(
          record,
          frame
        )
      ) {
        continue;
      }

      const priority =
        priorityForProjection(
          record
        );

      if (
        priority ===
        PRIORITIES.INACTIVE
      ) {
        continue;
      }

      const radius =
        effectiveRadius(
          record
        );

      const distance =
        distance2d(
          local.x,
          local.y,
          record.x,
          record.y
        );

      if (
        distance >
        radius
      ) {
        continue;
      }

      matches.push({
        type:
          normalizeKind(
            record.kind
          ),

        id:
          record.id,

        kind:
          normalizeKind(
            record.kind
          ),

        x:
          record.x,

        y:
          record.y,

        radiusPx:
          radius,

        distance,

        normalizedDistance:
          radius >
          0
            ? distance /
              radius
            : Infinity,

        depthLayer:
          record.depthLayer,

        compassOverlap:
          record.compassOverlap,

        priority,

        projection:
          record
      });
    }

    matches.sort(
      (
        first,
        second
      ) => {
        if (
          first.priority !==
          second.priority
        ) {
          return (
            second.priority -
            first.priority
          );
        }

        if (
          first.normalizedDistance !==
          second.normalizedDistance
        ) {
          return (
            first.normalizedDistance -
            second.normalizedDistance
          );
        }

        return (
          first.distance -
          second.distance
        );
      }
    );

    return matches[0] ||
      null;
  }

  function compassContainsPoint(
    clientX,
    clientY
  ) {
    if (
      !state.compassControl
    ) {
      return false;
    }

    return pointInsideRect(
      clientX,
      clientY,
      state.compassControl
        .getBoundingClientRect()
    );
  }

  function directDestinationFromTarget(
    target
  ) {
    const element =
      normalizeElement(
        target
      );

    if (
      !element ||
      !state.root
    ) {
      return null;
    }

    const control =
      element.closest(
        "[data-archcoin-coin], [data-archcoin-room]"
      );

    if (
      !control ||
      !state.root.contains(
        control
      )
    ) {
      return null;
    }

    if (
      control.matches(
        "[data-archcoin-coin]"
      )
    ) {
      const id =
        normalizeId(
          control.dataset.wing ||
          control.dataset.coinId ||
          control.dataset
            .destinationId
        );

      return id
        ? {
            type:
              TARGET_TYPES.CARDINAL,

            kind:
              TARGET_TYPES.CARDINAL,

            id,

            control,

            source:
              "semantic-control"
          }
        : null;
    }

    if (
      control.matches(
        "[data-archcoin-room]"
      )
    ) {
      const id =
        normalizeId(
          control.dataset.roomId ||
          control.dataset
            .destinationId
        );

      return id
        ? {
            type:
              TARGET_TYPES.ROOM,

            kind:
              TARGET_TYPES.ROOM,

            id,

            control,

            source:
              "semantic-control"
          }
        : null;
    }

    return null;
  }

  function projectionForTarget(
    target
  ) {
    if (
      !target ||
      !target.id
    ) {
      return null;
    }

    return (
      state.semanticProjection.get(
        projectionKey(
          target.kind,
          target.id
        )
      ) ||
      null
    );
  }

  function directDestinationPermitted(
    target,
    frame
  ) {
    if (
      !target ||
      !frame ||
      frame.held
    ) {
      return false;
    }

    const projection =
      projectionForTarget(
        target
      );

    if (projection) {
      return (
        recordPermittedByFrame(
          projection,
          frame
        ) &&
        priorityForProjection(
          projection
        ) !==
          PRIORITIES.INACTIVE
      );
    }

    if (
      target.type ===
      TARGET_TYPES.CARDINAL
    ) {
      return (
        frame.navigationState ===
        state.controller.states
          .CONSTELLATION
      );
    }

    if (
      target.type ===
      TARGET_TYPES.ROOM
    ) {
      if (
        frame.navigationState !==
          state.controller.states
            .CLUSTER_OPEN &&
        frame.navigationState !==
          state.controller.states
            .ROOM_SELECTED
      ) {
        return false;
      }

      const canonical =
        state.controller
          .canonicalRoomRecords
          .find(
            room =>
              room.roomId ===
              target.id
          );

      return Boolean(
        canonical &&
        canonical.wing ===
          frame.activeClusterWing
      );
    }

    return false;
  }

  function resolvePointerTarget(
    event,
    frame
  ) {
    const crystalHit =
      hitTestCrystals(
        event.clientX,
        event.clientY,
        frame
      );

    if (
      crystalHit &&
      crystalHit.priority ===
        PRIORITIES.FRONT
    ) {
      return Object.freeze({
        ...crystalHit,

        source:
          "whole-crystal-hit"
      });
    }

    const direct =
      directDestinationFromTarget(
        event.target
      );

    if (
      direct &&
      directDestinationPermitted(
        direct,
        frame
      )
    ) {
      const projection =
        projectionForTarget(
          direct
        );

      return Object.freeze({
        ...direct,

        x:
          projection
            ? projection.x
            : 0,

        y:
          projection
            ? projection.y
            : 0,

        radiusPx:
          projection
            ? effectiveRadius(
                projection
              )
            : fallbackRadiusForKind(
                direct.kind
              ),

        depthLayer:
          projection
            ? projection.depthLayer
            : DEPTH_LAYERS.UNKNOWN,

        compassOverlap:
          projection
            ? projection
                .compassOverlap
            : false,

        priority:
          projection
            ? priorityForProjection(
                projection
              )
            : PRIORITIES.REAR
      });
    }

    const element =
      normalizeElement(
        event.target
      );

    const compassTarget =
      Boolean(
        element &&
        element.closest(
          "[data-upstream-compass-control]"
        )
      );

    if (
      compassTarget ||
      compassContainsPoint(
        event.clientX,
        event.clientY
      )
    ) {
      return Object.freeze({
        type:
          TARGET_TYPES.COMPASS,

        kind:
          TARGET_TYPES.COMPASS,

        id:
          "home-compass",

        source:
          "compass",

        priority:
          PRIORITIES.COMPASS
      });
    }

    if (crystalHit) {
      return Object.freeze({
        ...crystalHit,

        source:
          "whole-crystal-hit"
      });
    }

    return null;
  }

  function gestureAllowedFromTarget(
    target
  ) {
    const element =
      normalizeElement(
        target
      );

    if (!element) {
      return true;
    }

    return !element.closest(
      EXCLUDED_GESTURE_SELECTOR
    );
  }

  function orientationFromPointerDelta(
    pointer
  ) {
    const dx =
      pointer.currentX -
      pointer.startX;

    const dy =
      pointer.currentY -
      pointer.startY;

    const yawDelta =
      (
        dx /
        pointer.width
      ) *
      GESTURE
        .yawRadiansPerViewport;

    const pitchDelta =
      (
        dy /
        pointer.height
      ) *
      GESTURE
        .pitchRadiansPerViewport;

    return {
      yaw:
        wrapRadians(
          pointer.originOrientation
            .yaw +
          yawDelta
        ),

      pitch:
        clamp(
          pointer.originOrientation
            .pitch +
          pitchDelta,

          -GESTURE.maximumPitch,
          GESTURE.maximumPitch
        ),

      roll:
        wrapRadians(
          pointer.originOrientation
            .roll
        ),

      primaryId:
        pointer.originOrientation
          .primaryId
    };
  }

  function isQualifiedClusterExitSwipe(
    pointer
  ) {
    const dx =
      pointer.currentX -
      pointer.startX;

    const dy =
      pointer.currentY -
      pointer.startY;

    const distance =
      Math.hypot(
        dx,
        dy
      );

    if (
      distance <
      GESTURE.exitSwipeMinimumPx
    ) {
      return false;
    }

    const radialX =
      pointer.startX -
      pointer.centerX;

    const radialY =
      pointer.startY -
      pointer.centerY;

    const startRadius =
      Math.hypot(
        radialX,
        radialY
      );

    if (
      startRadius <
      GESTURE
        .exitSwipeMinimumStartRadiusPx
    ) {
      return false;
    }

    const directionLength =
      Math.max(
        1,
        distance
      );

    const radialLength =
      Math.max(
        1,
        startRadius
      );

    const dot =
      (
        (
          dx /
          directionLength
        ) *
        (
          radialX /
          radialLength
        )
      ) +
      (
        (
          dy /
          directionLength
        ) *
        (
          radialY /
          radialLength
        )
      );

    return (
      dot >=
      GESTURE
        .exitSwipeDirectionThreshold
    );
  }

  function createPointerState(
    event,
    frame,
    target
  ) {
    const rect =
      state.field
        .getBoundingClientRect();

    const mode =
      target &&
      target.type ===
        TARGET_TYPES.COMPASS
        ? MODES.COMPASS
        : currentMode(
            frame
          );

    return {
      pointerId:
        event.pointerId,

      pointerType:
        event.pointerType ||
        "unknown",

      button:
        finiteNumber(
          event.button,
          0
        ),

      startX:
        event.clientX,

      startY:
        event.clientY,

      currentX:
        event.clientX,

      currentY:
        event.clientY,

      centerX:
        rect.left +
        rect.width /
        2,

      centerY:
        rect.top +
        rect.height /
        2,

      width:
        Math.max(
          1,
          rect.width
        ),

      height:
        Math.max(
          1,
          rect.height
        ),

      startedAt:
        performance.now(),

      mode,

      activeClusterWing:
        activeClusterWing(
          frame
        ),

      originOrientation:
        currentOriginOrientation(
          frame,
          mode
        ),

      target,

      dragging:
        false,

      controllerGestureBegan:
        false
    };
  }

  function clearPointerState() {
    state.pointer =
      null;

    if (state.root) {
      state.root.dataset
        .gestureActive =
        "false";

      state.root.dataset
        .gestureMode =
        MODES.NONE;
    }

    if (state.scene) {
      state.scene.dataset
        .gestureActive =
        "false";

      state.scene.dataset
        .gestureMode =
        MODES.NONE;
    }

    if (state.field) {
      state.field.dataset
        .gestureActive =
        "false";

      state.field.dataset
        .gestureMode =
        MODES.NONE;
    }

    publishReceipt();
  }

  function suppressionKey(target) {
    if (!target) {
      return "";
    }

    return `${
      target.type ||
      TARGET_TYPES.NONE
    }:${
      target.id ||
      ""
    }`;
  }

  function suppressNextClick(target) {
    const key =
      suppressionKey(
        target
      );

    if (!key) {
      state.suppressedClick =
        null;

      return;
    }

    state.suppressedClick = {
      key,

      expiresAt:
        performance.now() +
        GESTURE
          .syntheticClickSuppressionMs
    };
  }

  function shouldSuppressClick(
    event,
    target
  ) {
    const suppression =
      state.suppressedClick;

    if (!suppression) {
      return false;
    }

    if (
      performance.now() >
      suppression.expiresAt
    ) {
      state.suppressedClick =
        null;

      return false;
    }

    if (
      event &&
      event.detail ===
        0
    ) {
      return false;
    }

    if (
      suppression.key !==
      suppressionKey(
        target
      )
    ) {
      return false;
    }

    state.suppressedClick =
      null;

    return true;
  }

  function activateTarget(target) {
    if (
      !target ||
      !state.controller
    ) {
      return false;
    }

    if (
      target.type ===
      TARGET_TYPES.CARDINAL
    ) {
      const accepted =
        state.controller
          .requestCardinalSelection(
            target.id
          );

      recordAction(
        accepted
          ? `cardinal-activated:${target.id}`
          : `cardinal-rejected:${target.id}`
      );

      return accepted;
    }

    if (
      target.type ===
      TARGET_TYPES.ROOM
    ) {
      const accepted =
        state.controller
          .requestRoomSelection(
            target.id
          );

      recordAction(
        accepted
          ? `room-activated:${target.id}`
          : `room-rejected:${target.id}`
      );

      return accepted;
    }

    if (
      target.type ===
      TARGET_TYPES.COMPASS
    ) {
      const accepted =
        state.controller
          .requestCompassSelection();

      recordAction(
        accepted
          ? "compass-activated"
          : "compass-rejected"
      );

      return accepted;
    }

    return false;
  }

  function beginControllerGesture(
    pointer
  ) {
    if (
      pointer.controllerGestureBegan
    ) {
      return true;
    }

    if (
      pointer.mode ===
      MODES.ORBIT
    ) {
      pointer.controllerGestureBegan =
        state.controller
          .beginOrbitGesture({
            orientation:
              pointer
                .originOrientation
          }) !==
        false;

      return (
        pointer
          .controllerGestureBegan
      );
    }

    if (
      pointer.mode ===
      MODES.CLUSTER
    ) {
      pointer.controllerGestureBegan =
        state.controller
          .beginClusterGesture(
            pointer.activeClusterWing,
            {
              orientation:
                pointer
                  .originOrientation
            }
          ) !==
        false;

      return (
        pointer
          .controllerGestureBegan
      );
    }

    return false;
  }

  function updateControllerGesture(
    pointer
  ) {
    const orientation =
      orientationFromPointerDelta(
        pointer
      );

    if (
      pointer.mode ===
      MODES.ORBIT
    ) {
      return (
        state.controller
          .requestOrbitPreview(
            orientation
          ) !==
        false
      );
    }

    if (
      pointer.mode ===
      MODES.CLUSTER
    ) {
      return (
        state.controller
          .requestClusterPreview(
            pointer.activeClusterWing,
            orientation
          ) !==
        false
      );
    }

    return false;
  }

  function cancelControllerGesture(
    pointer,
    reason
  ) {
    if (
      !pointer ||
      !pointer.controllerGestureBegan
    ) {
      return false;
    }

    if (
      pointer.mode ===
      MODES.ORBIT
    ) {
      return (
        state.controller
          .requestOrbitCancel(
            reason
          ) !==
        false
      );
    }

    if (
      pointer.mode ===
      MODES.CLUSTER
    ) {
      return (
        state.controller
          .requestClusterCancel(
            pointer.activeClusterWing,
            reason
          ) !==
        false
      );
    }

    return false;
  }

  function commitControllerGesture(
    pointer
  ) {
    const orientation =
      orientationFromPointerDelta(
        pointer
      );

    if (
      pointer.mode ===
      MODES.ORBIT
    ) {
      return (
        state.controller
          .requestOrbitCommit(
            orientation
          ) !==
        false
      );
    }

    if (
      pointer.mode ===
      MODES.CLUSTER
    ) {
      return (
        state.controller
          .requestClusterCommit(
            pointer.activeClusterWing,
            orientation
          ) !==
        false
      );
    }

    return false;
  }

  function capturePointer(pointerId) {
    if (!state.root) {
      return false;
    }

    try {
      state.root.setPointerCapture(
        pointerId
      );

      return true;
    } catch (_) {
      return false;
    }
  }

  function releasePointerCapture(
    pointerId
  ) {
    if (!state.root) {
      return;
    }

    try {
      if (
        state.root
          .hasPointerCapture(
            pointerId
          )
      ) {
        state.root
          .releasePointerCapture(
            pointerId
          );
      }
    } catch (_) {}
  }

  function handlePointerDown(event) {
    if (
      state.disposed ||
      !state.initialized ||
      state.pointer
    ) {
      return;
    }

    if (
      event.pointerType ===
        "mouse" &&
      event.button !==
        0
    ) {
      return;
    }

    if (
      !eventOriginInsideInteractionRegion(
        event
      )
    ) {
      return;
    }

    if (
      !gestureAllowedFromTarget(
        event.target
      )
    ) {
      return;
    }

    const frame =
      frameState();

    if (
      !frame ||
      frame.held
    ) {
      return;
    }

    const target =
      resolvePointerTarget(
        event,
        frame
      );

    const mode =
      target &&
      target.type ===
        TARGET_TYPES.COMPASS
        ? MODES.COMPASS
        : currentMode(
            frame
          );

    if (
      mode ===
      MODES.NONE
    ) {
      return;
    }

    state.suppressedClick =
      null;

    state.pointer =
      createPointerState(
        event,
        frame,
        target
      );

    state.root.dataset
      .gestureActive =
      "true";

    state.root.dataset
      .gestureMode =
      state.pointer.mode;

    state.scene.dataset
      .gestureActive =
      "true";

    state.scene.dataset
      .gestureMode =
      state.pointer.mode;

    state.field.dataset
      .gestureActive =
      "true";

    state.field.dataset
      .gestureMode =
      state.pointer.mode;

    capturePointer(
      event.pointerId
    );

    event.preventDefault();

    recordAction(
      `pointer-began:${state.pointer.mode}`
    );
  }

  function handlePointerMove(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !==
        event.pointerId
    ) {
      return;
    }

    pointer.currentX =
      finiteNumber(
        event.clientX,
        pointer.currentX
      );

    pointer.currentY =
      finiteNumber(
        event.clientY,
        pointer.currentY
      );

    if (
      pointer.mode ===
      MODES.COMPASS
    ) {
      event.preventDefault();
      return;
    }

    const distance =
      distance2d(
        pointer.startX,
        pointer.startY,
        pointer.currentX,
        pointer.currentY
      );

    if (
      !pointer.dragging &&
      distance <
        GESTURE.dragDeadZonePx
    ) {
      event.preventDefault();
      return;
    }

    if (
      !pointer.dragging
    ) {
      pointer.dragging =
        true;

      if (pointer.target) {
        suppressNextClick(
          pointer.target
        );
      }

      const began =
        beginControllerGesture(
          pointer
        );

      if (!began) {
        releasePointerCapture(
          pointer.pointerId
        );

        clearPointerState();

        recordAction(
          "gesture-begin-rejected"
        );

        return;
      }

      recordAction(
        `drag-began:${pointer.mode}`
      );
    }

    event.preventDefault();

    const accepted =
      updateControllerGesture(
        pointer
      );

    if (!accepted) {
      cancelControllerGesture(
        pointer,
        "preview-rejected"
      );

      releasePointerCapture(
        pointer.pointerId
      );

      clearPointerState();

      recordAction(
        "gesture-preview-rejected"
      );
    }
  }

  function finishPointer(
    event,
    cancelled
  ) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !==
        event.pointerId
    ) {
      return;
    }

    pointer.currentX =
      finiteNumber(
        event.clientX,
        pointer.currentX
      );

    pointer.currentY =
      finiteNumber(
        event.clientY,
        pointer.currentY
      );

    releasePointerCapture(
      pointer.pointerId
    );

    if (
      pointer.mode ===
      MODES.COMPASS
    ) {
      const target =
        pointer.target;

      clearPointerState();

      if (
        cancelled ||
        !target
      ) {
        recordAction(
          "compass-pointer-cancelled"
        );

        return;
      }

      const distance =
        distance2d(
          pointer.startX,
          pointer.startY,
          pointer.currentX,
          pointer.currentY
        );

      if (
        distance >
        GESTURE.dragDeadZonePx +
        GESTURE.releaseTolerancePx
      ) {
        recordAction(
          "compass-pointer-moved"
        );

        return;
      }

      event.preventDefault();

      suppressNextClick(
        target
      );

      activateTarget(
        target
      );

      return;
    }

    if (!pointer.dragging) {
      const target =
        pointer.target;

      clearPointerState();

      if (
        cancelled ||
        !target
      ) {
        recordAction(
          cancelled
            ? "tap-cancelled"
            : "tap-empty"
        );

        return;
      }

      event.preventDefault();

      suppressNextClick(
        target
      );

      activateTarget(
        target
      );

      return;
    }

    event.preventDefault();

    if (cancelled) {
      cancelControllerGesture(
        pointer,
        "pointer-cancel"
      );

      clearPointerState();

      recordAction(
        "gesture-cancelled"
      );

      return;
    }

    if (
      pointer.mode ===
        MODES.CLUSTER &&
      isQualifiedClusterExitSwipe(
        pointer
      )
    ) {
      cancelControllerGesture(
        pointer,
        "cluster-exit-swipe"
      );

      clearPointerState();

      const accepted =
        state.controller
          .requestReturnToConstellation();

      recordAction(
        accepted
          ? "cluster-exit-committed"
          : "cluster-exit-rejected"
      );

      return;
    }

    const committed =
      commitControllerGesture(
        pointer
      );

    const mode =
      pointer.mode;

    clearPointerState();

    recordAction(
      committed
        ? `gesture-committed:${mode}`
        : `gesture-commit-rejected:${mode}`
    );
  }

  function handlePointerUp(event) {
    finishPointer(
      event,
      false
    );
  }

  function handlePointerCancel(event) {
    finishPointer(
      event,
      true
    );
  }

  function handleLostPointerCapture(
    event
  ) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !==
        event.pointerId
    ) {
      return;
    }

    if (pointer.dragging) {
      cancelControllerGesture(
        pointer,
        "lost-pointer-capture"
      );
    }

    clearPointerState();

    recordAction(
      "pointer-capture-lost"
    );
  }

  function semanticTargetFromClick(
    event
  ) {
    const element =
      normalizeElement(
        event.target
      );

    if (!element) {
      return null;
    }

    const compass =
      element.closest(
        "[data-upstream-compass-control]"
      );

    if (
      compass &&
      state.root.contains(
        compass
      )
    ) {
      return Object.freeze({
        type:
          TARGET_TYPES.COMPASS,

        kind:
          TARGET_TYPES.COMPASS,

        id:
          "home-compass",

        control:
          compass,

        source:
          "semantic-click"
      });
    }

    const direct =
      directDestinationFromTarget(
        element
      );

    if (!direct) {
      return null;
    }

    const frame =
      frameState();

    return directDestinationPermitted(
      direct,
      frame
    )
      ? Object.freeze({
          ...direct,

          source:
            "semantic-click"
        })
      : null;
  }

  function handleClick(event) {
    if (
      state.disposed ||
      !state.initialized
    ) {
      return;
    }

    const target =
      semanticTargetFromClick(
        event
      );

    if (!target) {
      return;
    }

    if (
      shouldSuppressClick(
        event,
        target
      )
    ) {
      event.preventDefault();
      event.stopPropagation();

      recordAction(
        `synthetic-click-suppressed:${suppressionKey(
          target
        )}`
      );

      return;
    }

    event.preventDefault();

    activateTarget(
      target
    );
  }

  function escapeSelectorValue(value) {
    const source =
      String(value || "");

    if (
      globalThis.CSS &&
      typeof globalThis.CSS
        .escape ===
        "function"
    ) {
      return globalThis.CSS.escape(
        source
      );
    }

    return source.replace(
      /["\\]/g,
      "\\$&"
    );
  }

  function findControlForProjection(
    projection
  ) {
    if (
      !projection ||
      !state.root
    ) {
      return null;
    }

    const id =
      normalizeId(
        projection.id
      );

    const kind =
      normalizeKind(
        projection.kind
      );

    if (
      kind ===
      TARGET_TYPES.CARDINAL
    ) {
      return qs(
        `[data-archcoin-coin][data-wing="${escapeSelectorValue(
          id
        )}"]`,
        state.root
      );
    }

    if (
      kind ===
      TARGET_TYPES.ROOM
    ) {
      return qs(
        `[data-archcoin-room][data-room-id="${escapeSelectorValue(
          id
        )}"]`,
        state.root
      );
    }

    return null;
  }

  function applyProjectionToControl(
    control,
    projection
  ) {
    if (
      !control ||
      !projection
    ) {
      return;
    }

    const radius =
      effectiveRadius(
        projection
      );

    control.style.setProperty(
      "--archcoin-label-x",
      `${projection.x}px`
    );

    control.style.setProperty(
      "--archcoin-label-y",
      `${projection.y}px`
    );

    control.style.setProperty(
      "--archcoin-projected-radius",
      `${radius}px`
    );

    control.dataset.archcoinProjectedX =
      String(
        projection.x
      );

    control.dataset.archcoinProjectedY =
      String(
        projection.y
      );

    control.dataset.archcoinProjectedRadius =
      String(
        radius
      );

    control.dataset.archcoinDepthLayer =
      projection.depthLayer;

    control.dataset.archcoinCompassOverlap =
      projection.compassOverlap
        ? "true"
        : "false";

    control.dataset.archcoinProjectionVisible =
      projection.visible
        ? "true"
        : "false";

    control.dataset.archcoinInteractionPriority =
      String(
        projection
          .interactionPriority ||
        ""
      );

    const interactive =
      projection.visible &&
      priorityForProjection(
        projection
      ) !==
        PRIORITIES.INACTIVE;

    control.style.pointerEvents =
      interactive
        ? "auto"
        : "none";

    control.style.touchAction =
      interactive
        ? "none"
        : "";

    control.setAttribute(
      "aria-hidden",
      projection.visible
        ? "false"
        : "true"
    );

    if (interactive) {
      control.removeAttribute(
        "tabindex"
      );
    } else {
      control.setAttribute(
        "tabindex",
        "-1"
      );
    }
  }

  function deactivateControl(control) {
    control.dataset.archcoinProjectionVisible =
      "false";

    control.dataset.archcoinInteractionPriority =
      "inactive";

    control.dataset.archcoinProjectedRadius =
      "0";

    control.style.setProperty(
      "--archcoin-projected-radius",
      "0px"
    );

    control.style.pointerEvents =
      "none";

    control.style.touchAction =
      "";

    control.setAttribute(
      "aria-hidden",
      "true"
    );

    control.setAttribute(
      "tabindex",
      "-1"
    );
  }

  function applyProjectionSnapshot(records) {
    const next =
      new Map();

    const projectedControls =
      new Set();

    if (
      Array.isArray(
        records
      )
    ) {
      for (
        const input
        of records
      ) {
        if (
          !input ||
          typeof input !==
            "object"
        ) {
          continue;
        }

        const id =
          normalizeId(
            input.id
          );

        const kind =
          normalizeKind(
            input.kind
          );

        if (
          !id ||
          kind ===
            TARGET_TYPES.NONE
        ) {
          continue;
        }

        const projection =
          Object.freeze({
            id,

            kind,

            x:
              finiteNumber(
                input.x,
                0
              ),

            y:
              finiteNumber(
                input.y,
                0
              ),

            radiusPx:
              Math.max(
                0,
                finiteNumber(
                  input.radiusPx,
                  0
                )
              ),

            depthLayer:
              normalizeDepthLayer(
                input.depthLayer
              ),

            compassOverlap:
              Boolean(
                input.compassOverlap
              ),

            visible:
              input.visible !==
              false,

            interactionPriority:
              String(
                input
                  .interactionPriority ||
                ""
              )
                .trim()
                .toLowerCase()
          });

        next.set(
          projectionKey(
            projection.kind,
            projection.id
          ),
          projection
        );

        const control =
          findControlForProjection(
            projection
          );

        if (control) {
          projectedControls.add(
            control
          );

          applyProjectionToControl(
            control,
            projection
          );
        }
      }
    }

    qsa(
      "[data-archcoin-coin], [data-archcoin-room]",
      state.root
    ).forEach(
      control => {
        if (
          !projectedControls.has(
            control
          )
        ) {
          deactivateControl(
            control
          );
        }
      }
    );

    state.semanticProjection =
      next;

    state.semanticProjectionRevision +=
      1;

    publishReceipt();

    return true;
  }

  function requireController() {
    const controller =
      globalThis
        .DGB_ARCHCOIN_CONTROLLER;

    invariant(
      controller,
      "ARCHCOIN_INTERACTIONS_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.moduleId ===
        MODULE
          .requiredControllerModuleId,
      "ARCHCOIN_INTERACTIONS_CONTROLLER_MODULE_INVALID",
      {
        expected:
          MODULE
            .requiredControllerModuleId,

        actual:
          controller.moduleId
      }
    );

    invariant(
      controller.moduleVersion ===
        MODULE
          .requiredControllerModuleVersion,
      "ARCHCOIN_INTERACTIONS_CONTROLLER_VERSION_INVALID",
      {
        expected:
          MODULE
            .requiredControllerModuleVersion,

        actual:
          controller.moduleVersion
      }
    );

    for (
      const surface
      of REQUIRED_CONTROLLER_SURFACES
    ) {
      invariant(
        typeof controller[
          surface
        ] ===
          "function",
        `ARCHCOIN_INTERACTIONS_CONTROLLER_SURFACE_REQUIRED:${surface}`
      );
    }

    invariant(
      controller.states &&
      controller.states
        .CONSTELLATION &&
      controller.states
        .CLUSTER_OPEN &&
      controller.states
        .ROOM_SELECTED,
      "ARCHCOIN_INTERACTIONS_CONTROLLER_STATES_REQUIRED"
    );

    invariant(
      Array.isArray(
        controller
          .canonicalRoomRecords
      ) &&
      controller
        .canonicalRoomRecords
        .length ===
        16,
      "ARCHCOIN_INTERACTIONS_CANONICAL_ROOM_REGISTRY_REQUIRED"
    );

    return controller;
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-archcoin-root]"
      );

    invariant(
      state.root,
      "ARCHCOIN_INTERACTIONS_ROOT_NOT_FOUND"
    );

    state.scene =
      qs(
        "[data-archcoin-scene]",
        state.root
      );

    invariant(
      state.scene,
      "ARCHCOIN_INTERACTIONS_SCENE_NOT_FOUND"
    );

    state.field =
      qs(
        "[data-archcoin-scene-field]",
        state.scene
      ) ||
      qs(
        ".archcoin-scene__field",
        state.scene
      );

    invariant(
      state.field,
      "ARCHCOIN_INTERACTIONS_FIELD_NOT_FOUND"
    );

    state.semanticLayer =
      qs(
        "[data-archcoin-objects]",
        state.root
      );

    invariant(
      state.semanticLayer,
      "ARCHCOIN_INTERACTIONS_SEMANTIC_LAYER_NOT_FOUND"
    );

    state.compassControl =
      qs(
        "[data-upstream-compass-control]",
        state.root
      );

    invariant(
      state.compassControl,
      "ARCHCOIN_INTERACTIONS_COMPASS_CONTROL_NOT_FOUND"
    );
  }

  function captureStyleSnapshot(element) {
    if (
      !element ||
      state.interactionStyleSnapshots
        .has(
          element
        )
    ) {
      return;
    }

    state.interactionStyleSnapshots.set(
      element,
      Object.freeze({
        touchAction:
          element.style
            .touchAction,

        userSelect:
          element.style
            .userSelect,

        webkitUserSelect:
          element.style
            .webkitUserSelect
      })
    );
  }

  function applyInteractionStyle(element) {
    if (!element) {
      return;
    }

    captureStyleSnapshot(
      element
    );

    element.style.touchAction =
      "none";

    element.style.userSelect =
      "none";

    element.style.webkitUserSelect =
      "none";
  }

  function establishInteractionPolicy() {
    applyInteractionStyle(
      state.scene
    );

    applyInteractionStyle(
      state.field
    );

    applyInteractionStyle(
      state.semanticLayer
    );

    applyInteractionStyle(
      state.compassControl
    );

    qsa(
      INTERACTIVE_CONTROL_SELECTOR,
      state.root
    ).forEach(
      applyInteractionStyle
    );

    state.root.dataset
      .archcoinInteractionOwner =
      MODULE.id;

    state.root.dataset
      .archcoinInteractionEventSurface =
      "root-capture";

    state.root.dataset
      .gestureActive =
      "false";

    state.root.dataset
      .gestureMode =
      MODES.NONE;

    state.scene.dataset
      .archcoinInteractionOwner =
      MODULE.id;

    state.scene.dataset
      .gestureActive =
      "false";

    state.scene.dataset
      .gestureMode =
      MODES.NONE;

    state.field.dataset
      .archcoinInteractionOwner =
      MODULE.id;

    state.field.dataset
      .gestureActive =
      "false";

    state.field.dataset
      .gestureMode =
      MODES.NONE;
  }

  function restoreInteractionPolicy() {
    for (
      const [
        element,
        snapshot
      ]
      of state
        .interactionStyleSnapshots
        .entries()
    ) {
      element.style.touchAction =
        snapshot.touchAction;

      element.style.userSelect =
        snapshot.userSelect;

      element.style.webkitUserSelect =
        snapshot.webkitUserSelect;
    }

    state.interactionStyleSnapshots
      .clear();

    if (state.root) {
      delete state.root.dataset
        .archcoinInteractionOwner;

      delete state.root.dataset
        .archcoinInteractionEventSurface;

      delete state.root.dataset
        .gestureActive;

      delete state.root.dataset
        .gestureMode;
    }

    if (state.scene) {
      delete state.scene.dataset
        .archcoinInteractionOwner;

      delete state.scene.dataset
        .gestureActive;

      delete state.scene.dataset
        .gestureMode;
    }

    if (state.field) {
      delete state.field.dataset
        .archcoinInteractionOwner;

      delete state.field.dataset
        .gestureActive;

      delete state.field.dataset
        .gestureMode;
    }
  }

  function bindEvents() {
    state.root.addEventListener(
      "pointerdown",
      handlePointerDown,
      {
        capture:
          true,

        passive:
          false
      }
    );

    state.root.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        capture:
          true,

        passive:
          false
      }
    );

    state.root.addEventListener(
      "pointerup",
      handlePointerUp,
      {
        capture:
          true,

        passive:
          false
      }
    );

    state.root.addEventListener(
      "pointercancel",
      handlePointerCancel,
      {
        capture:
          true,

        passive:
          false
      }
    );

    state.root.addEventListener(
      "lostpointercapture",
      handleLostPointerCapture,
      true
    );

    state.root.addEventListener(
      "click",
      handleClick,
      true
    );
  }

  function unbindEvents() {
    if (!state.root) {
      return;
    }

    state.root.removeEventListener(
      "pointerdown",
      handlePointerDown,
      true
    );

    state.root.removeEventListener(
      "pointermove",
      handlePointerMove,
      true
    );

    state.root.removeEventListener(
      "pointerup",
      handlePointerUp,
      true
    );

    state.root.removeEventListener(
      "pointercancel",
      handlePointerCancel,
      true
    );

    state.root.removeEventListener(
      "lostpointercapture",
      handleLostPointerCapture,
      true
    );

    state.root.removeEventListener(
      "click",
      handleClick,
      true
    );
  }

  function runSelfTest() {
    invariant(
      MODULE.id ===
        "DGB_ARCHCOIN_INTERACTIONS",
      "ARCHCOIN_INTERACTIONS_MODULE_ID_INVALID"
    );

    invariant(
      MODULE.version ===
        "1.0.1-scene-capture-pointer-gesture-interpreter",
      "ARCHCOIN_INTERACTIONS_MODULE_VERSION_INVALID"
    );

    invariant(
      GESTURE.dragDeadZonePx >
        0,
      "ARCHCOIN_INTERACTIONS_DEAD_ZONE_INVALID"
    );

    invariant(
      GESTURE.exitSwipeMinimumPx >
        GESTURE.dragDeadZonePx,
      "ARCHCOIN_INTERACTIONS_EXIT_THRESHOLD_INVALID"
    );

    invariant(
      GESTURE
        .exitSwipeDirectionThreshold >
        0 &&
      GESTURE
        .exitSwipeDirectionThreshold <=
        1,
      "ARCHCOIN_INTERACTIONS_EXIT_DIRECTION_THRESHOLD_INVALID"
    );

    invariant(
      PRIORITIES.FRONT >
        PRIORITIES.COMPASS &&
      PRIORITIES.COMPASS >
        PRIORITIES.REAR,
      "ARCHCOIN_INTERACTIONS_PRIORITY_ORDER_INVALID"
    );

    invariant(
      Boolean(
        qs(
          "[data-archcoin-coin]",
          state.root
        )
      ),
      "ARCHCOIN_INTERACTIONS_CARDINAL_CONTROL_REQUIRED"
    );

    invariant(
      Boolean(
        qs(
          "[data-archcoin-room]",
          state.root
        )
      ),
      "ARCHCOIN_INTERACTIONS_ROOM_CONTROL_REQUIRED"
    );

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_INTERACTIONS_VALIDATION_RECEIPT_v2",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      pass:
        true,

      eventSurface:
        "ARCHCOIN_ROOT_CAPTURE_PHASE",

      coordinateSurface:
        "ARCHCOIN_SCENE_FIELD",

      destinationMarkerRequired:
        false,

      directCardinalSelectorSupported:
        true,

      directRoomSelectorSupported:
        true,

      semanticOverlayPointerStartsSupported:
        true,

      compassPointerStartsSupported:
        true,

      pointerInterpreterOwned:
        true,

      pointerCaptureOwned:
        true,

      tapDragArbitrationOwned:
        true,

      wholeCrystalHitTestingOwned:
        true,

      projectionDomApplicationOwned:
        true,

      clusterExitSwipeClassificationOwned:
        true,

      navigationTransitionAuthorityOwned:
        false,

      orbitStateAuthorityOwned:
        false,

      clusterStateAuthorityOwned:
        false,

      frontCompassRearPriority:
        Object.freeze([
          "front",
          "compass",
          "rear"
        ]),

      controllerModuleId:
        state.controller
          ? state.controller
              .moduleId
          : "",

      controllerModuleVersion:
        state.controller
          ? state.controller
              .moduleVersion
          : ""
    });
  }

  function publishReceipt() {
    Object.assign(
      RECEIPT,
      {
        controllerModuleId:
          state.controller
            ? state.controller
                .moduleId
            : "",

        controllerModuleVersion:
          state.controller
            ? state.controller
                .moduleVersion
            : "",

        initialized:
          state.initialized &&
          !state.disposed,

        status:
          state.status,

        activePointer:
          Boolean(
            state.pointer
          ),

        pointerMode:
          state.pointer
            ? state.pointer.mode
            : MODES.NONE,

        pointerDragging:
          Boolean(
            state.pointer &&
            state.pointer.dragging
          ),

        semanticProjectionRevision:
          state
            .semanticProjectionRevision,

        semanticProjectionCount:
          state
            .semanticProjection
            .size,

        lastAction:
          state.lastAction,

        lastFailure:
          state.lastFailure,

        runtimePassClaimed:
          false,

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false
      }
    );

    const frozen =
      Object.freeze({
        ...RECEIPT
      });

    globalThis
      .DGB_ARCHCOIN_INTERACTIONS_RECEIPT =
      frozen;

    if (state.root) {
      state.root.dataset
        .archcoinInteractionsReceipt =
        JSON.stringify(
          frozen
        );

      state.root.dataset
        .archcoinInteractionsStatus =
        state.status;

      state.root.dataset
        .archcoinInteractionsVersion =
        MODULE.version;

      state.root.dataset
        .archcoinPointerInterpreterOwner =
        MODULE.id;

      state.root.dataset
        .archcoinWholeCrystalHitTestOwner =
        MODULE.id;

      state.root.dataset
        .archcoinProjectionDomApplicationOwner =
        MODULE.id;

      state.root.dataset
        .archcoinInteractionEventSurface =
        "root-capture";
    }

    return frozen;
  }

  function recordAction(
    action,
    failure = ""
  ) {
    state.lastAction =
      String(
        action || ""
      );

    state.lastFailure =
      String(
        failure || ""
      );

    return publishReceipt();
  }

  function exposeApi() {
    globalThis
      .DGB_ARCHCOIN_INTERACTIONS =
      Object.freeze({
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        modes:
          MODES,

        targetTypes:
          TARGET_TYPES,

        gesture:
          GESTURE,

        getPointerState:
          () => {
            if (!state.pointer) {
              return null;
            }

            return Object.freeze({
              pointerId:
                state.pointer
                  .pointerId,

              pointerType:
                state.pointer
                  .pointerType,

              mode:
                state.pointer.mode,

              dragging:
                state.pointer
                  .dragging,

              startX:
                state.pointer
                  .startX,

              startY:
                state.pointer
                  .startY,

              currentX:
                state.pointer
                  .currentX,

              currentY:
                state.pointer
                  .currentY,

              target:
                state.pointer.target
                  ? Object.freeze({
                      type:
                        state.pointer
                          .target.type,

                      id:
                        state.pointer
                          .target.id,

                      source:
                        state.pointer
                          .target.source
                    })
                  : null
            });
          },

        getSemanticProjection:
          () =>
            Object.freeze(
              Array.from(
                state
                  .semanticProjection
                  .values()
              )
            ),

        hitTest:
          (
            clientX,
            clientY
          ) => {
            const result =
              hitTestCrystals(
                clientX,
                clientY
              );

            return result
              ? Object.freeze({
                  type:
                    result.type,

                  id:
                    result.id,

                  x:
                    result.x,

                  y:
                    result.y,

                  radiusPx:
                    result.radiusPx,

                  distance:
                    result.distance,

                  depthLayer:
                    result.depthLayer,

                  compassOverlap:
                    result
                      .compassOverlap,

                  priority:
                    result.priority
                })
              : null;
          },

        applySemanticProjection:
          applyProjectionSnapshot,

        runSelfTest,

        receipt:
          publishReceipt,

        dispose
      });
  }

  function dispose() {
    if (state.disposed) {
      return true;
    }

    if (
      state.pointer &&
      state.pointer.dragging
    ) {
      cancelControllerGesture(
        state.pointer,
        "interactions-disposed"
      );
    }

    if (state.pointer) {
      releasePointerCapture(
        state.pointer.pointerId
      );
    }

    clearPointerState();

    unbindEvents();

    if (
      typeof state
        .unsubscribeSemanticProjection ===
        "function"
    ) {
      try {
        state
          .unsubscribeSemanticProjection();
      } catch (_) {}
    }

    state.unsubscribeSemanticProjection =
      null;

    restoreInteractionPolicy();

    state.semanticProjection.clear();

    state.suppressedClick =
      null;

    state.initialized =
      false;

    state.disposed =
      true;

    state.status =
      "disposed";

    recordAction(
      "interactions-disposed"
    );

    return true;
  }

  function enterFailure(error) {
    state.status =
      "failed";

    state.lastAction =
      "interactions-initialization-failed";

    state.lastFailure =
      error &&
      (
        error.code ||
        error.message
      )
        ? String(
            error.code ||
            error.message
          )
        : "UNKNOWN_INTERACTIONS_INITIALIZATION_FAILURE";

    try {
      unbindEvents();
      restoreInteractionPolicy();
    } catch (_) {}

    publishReceipt();

    globalThis.dispatchEvent(
      new CustomEvent(
        "ARCHCOIN_INTERACTIONS_FAILURE",
        {
          detail:
            Object.freeze({
              reason:
                state.lastFailure,

              code:
                error &&
                error.code
                  ? error.code
                  : "",

              details:
                error &&
                error.details
                  ? error.details
                  : null
            })
        }
      )
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    state.status =
      "initializing";

    try {
      state.controller =
        requireController();

      resolveDom();

      establishInteractionPolicy();

      state.validationReceipt =
        runSelfTest();

      applyProjectionSnapshot(
        state.controller
          .getSemanticProjection()
      );

      state.unsubscribeSemanticProjection =
        state.controller
          .subscribeSemanticProjection(
            applyProjectionSnapshot
          );

      bindEvents();

      exposeApi();

      state.initialized =
        true;

      state.status =
        "available";

      recordAction(
        "interactions-initialized"
      );

      globalThis.dispatchEvent(
        new CustomEvent(
          "ARCHCOIN_INTERACTIONS_READY",
          {
            detail:
              Object.freeze({
                moduleId:
                  MODULE.id,

                moduleVersion:
                  MODULE.version,

                controllerModuleId:
                  state.controller
                    .moduleId,

                controllerModuleVersion:
                  state.controller
                    .moduleVersion,

                eventSurface:
                  "ARCHCOIN_ROOT_CAPTURE_PHASE",

                coordinateSurface:
                  "ARCHCOIN_SCENE_FIELD",

                destinationMarkerRequired:
                  false
              })
          }
        )
      );
    } catch (error) {
      enterFailure(
        error
      );
    }
  }

  if (
    document.readyState ===
      "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once:
          true
      }
    );
  } else {
    initialize();
  }
})();

/*
AUDRALIA_ARCHCOIN_INTERACTIONS_SCENE_CAPTURE_CORRECTION_RESULT_v1

Artifact:
 /products/archcoin/index.interactions.js

Module:
 DGB_ARCHCOIN_INTERACTIONS
 1.0.1-scene-capture-pointer-gesture-interpreter

Required controller:
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Corrected:
- pointer listeners no longer bind only to the buried scene field
- pointer listeners bind to the ARCHCOIN root in capture phase
- overlaid semantic controls are observed before they intercept the gesture
- data-archcoin-destination is no longer required
- data-archcoin-coin is recognized directly
- data-archcoin-room is recognized directly
- data-upstream-compass-control is recognized directly
- pointer capture is assigned to the root interaction surface
- field remains the projection and drag coordinate reference
- touch-action none applies to scene, field, semantic layer, Compass, and semantic controls
- normal page scrolling remains available outside the ARCHCOIN root interaction region
- taps on visible labels route through controller authorization
- swipes may begin over labels
- swipes may begin over crystal regions
- Compass remains above overlapping rear crystals
- front crystals remain above Compass for hit priority

Preserved:
- orbit drag interpretation
- cluster drag interpretation
- outward cluster-exit swipe
- tap-versus-drag arbitration
- whole-cardinal-star activation
- whole-room-star activation
- front / Compass / rear priority
- synthetic-click suppression
- semantic projection subscription
- projected-control positioning
- controller-only navigation authority

Controller modified:
 FALSE

Compositor modified:
 FALSE

Crystals modified:
 FALSE

HTML modified:
 FALSE

CSS modified:
 FALSE

Runtime execution:
 NOT PERFORMED

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/
