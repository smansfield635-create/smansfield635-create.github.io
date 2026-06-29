/* /products/archcoin/index.interactions.js
   ARCHCOIN adjustable pointer, gesture, semantic-input, and whole-crystal
   interaction interpreter.

   Module:
   DGB_ARCHCOIN_INTERACTIONS
   1.0.0-pointer-gesture-interpreter

   Required controller:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Runtime position:
   - load after /products/archcoin/index.crystals.js;
   - load before closing body completion;
   - controller must already expose its public command surface.

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
   FILE_SPLIT_INTERACTION_SOURCE_CANDIDATE
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
      "1.0.0-pointer-gesture-interpreter",

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

    fieldTouchActionSnapshot:
      "",

    fieldUserSelectSnapshot:
      "",

    fieldWebkitUserSelectSnapshot:
      "",

    lastAction:
      "pending",

    lastFailure:
      "",

    validationReceipt:
      null
  };

  const RECEIPT = {
    receiptSchema:
      "ARCHCOIN_INTERACTIONS_RECEIPT_v1",

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

    return Number.isFinite(number)
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
      kind === "coin" ||
      kind === "cardinal"
    ) {
      return TARGET_TYPES.CARDINAL;
    }

    if (
      kind === "room"
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
      normalizeKind(kind)
    }:${
      normalizeId(id)
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
          ).slice(0, 4)
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
      normalizeKind(kind) ===
      TARGET_TYPES.CARDINAL
    ) {
      return GESTURE
        .cardinalFallbackRadiusPx;
    }

    if (
      normalizeKind(kind) ===
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
          radius > 0
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

    const rect =
      state.compassControl
        .getBoundingClientRect();

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

    const destination =
      element.closest(
        "[data-archcoin-destination]"
      );

    if (
      !destination ||
      !state.root.contains(
        destination
      )
    ) {
      return null;
    }

    if (
      destination.matches(
        "[data-archcoin-coin]"
      )
    ) {
      const id =
        normalizeId(
          destination.dataset.wing ||
          destination.dataset.coinId ||
          destination.dataset
            .destinationId
        );

      return id
        ? {
            type:
              TARGET_TYPES.CARDINAL,

            kind:
              TARGET_TYPES.CARDINAL,

            id,

            control:
              destination,

            source:
              "semantic-control"
          }
        : null;
    }

    if (
      destination.matches(
        "[data-archcoin-room]"
      )
    ) {
      const id =
        normalizeId(
          destination.dataset.roomId ||
          destination.dataset
            .destinationId
        );

      return id
        ? {
            type:
              TARGET_TYPES.ROOM,

            kind:
              TARGET_TYPES.ROOM,

            id,

            control:
              destination,

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

    if (
      projection
    ) {
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

  function suppressionKey(
    target
  ) {
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

  function suppressNextClick(
    target
  ) {
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

  function releasePointerCapture(
    pointerId
  ) {
    if (
      !state.field
    ) {
      return;
    }

    try {
      if (
        state.field
          .hasPointerCapture(
            pointerId
          )
      ) {
        state.field
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

    if (
      !target &&
      !gestureAllowedFromTarget(
        event.target
      )
    ) {
      return;
    }

    if (
      target &&
      target.type !==
        TARGET_TYPES.COMPASS &&
      !gestureAllowedFromTarget(
        event.target
      )
    ) {
      return;
    }

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

    state.field.dataset
      .gestureActive =
      "true";

    state.field.dataset
      .gestureMode =
      state.pointer.mode;

    try {
      state.field
        .setPointerCapture(
          event.pointerId
        );
    } catch (_) {}

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
      return;
    }

    if (
      !pointer.dragging
    ) {
      pointer.dragging =
        true;

      if (
        pointer.target
      ) {
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

    if (
      !pointer.dragging
    ) {
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

    if (
      pointer.dragging
    ) {
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

    control.setAttribute(
      "aria-hidden",
      "true"
    );

    control.setAttribute(
      "tabindex",
      "-1"
    );
  }

  function applyProjectionSnapshot(
    records
  ) {
    const next =
      new Map();

    const projectedControls =
      new Set();

    if (
      Array.isArray(records)
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

  function establishFieldInteractionPolicy() {
    state.fieldTouchActionSnapshot =
      state.field.style
        .touchAction;

    state.fieldUserSelectSnapshot =
      state.field.style
        .userSelect;

    state.fieldWebkitUserSelectSnapshot =
      state.field.style
        .webkitUserSelect;

    state.field.style.touchAction =
      "none";

    state.field.style.userSelect =
      "none";

    state.field.style.webkitUserSelect =
      "none";

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

  function restoreFieldInteractionPolicy() {
    if (!state.field) {
      return;
    }

    state.field.style.touchAction =
      state.fieldTouchActionSnapshot;

    state.field.style.userSelect =
      state.fieldUserSelectSnapshot;

    state.field.style.webkitUserSelect =
      state
        .fieldWebkitUserSelectSnapshot;

    delete state.field.dataset
      .archcoinInteractionOwner;

    delete state.field.dataset
      .gestureActive;

    delete state.field.dataset
      .gestureMode;
  }

  function bindEvents() {
    state.field.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    state.field.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive:
          false
      }
    );

    state.field.addEventListener(
      "pointerup",
      handlePointerUp,
      {
        passive:
          false
      }
    );

    state.field.addEventListener(
      "pointercancel",
      handlePointerCancel,
      {
        passive:
          false
      }
    );

    state.field.addEventListener(
      "lostpointercapture",
      handleLostPointerCapture
    );

    state.root.addEventListener(
      "click",
      handleClick
    );
  }

  function unbindEvents() {
    if (
      !state.field ||
      !state.root
    ) {
      return;
    }

    state.field.removeEventListener(
      "pointerdown",
      handlePointerDown
    );

    state.field.removeEventListener(
      "pointermove",
      handlePointerMove
    );

    state.field.removeEventListener(
      "pointerup",
      handlePointerUp
    );

    state.field.removeEventListener(
      "pointercancel",
      handlePointerCancel
    );

    state.field.removeEventListener(
      "lostpointercapture",
      handleLostPointerCapture
    );

    state.root.removeEventListener(
      "click",
      handleClick
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
        "1.0.0-pointer-gesture-interpreter",
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

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_INTERACTIONS_VALIDATION_RECEIPT_v1",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      pass:
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
            if (
              !state.pointer
            ) {
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
    if (
      state.disposed
    ) {
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

    restoreFieldInteractionPolicy();

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
      restoreFieldInteractionPolicy();
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

      establishFieldInteractionPolicy();

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
                    .moduleVersion
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
AUDRALIA_ARCHCOIN_INTERACTIONS_FILE_SPLIT_RESULT_v1

Artifact:
 /products/archcoin/index.interactions.js

Module:
 DGB_ARCHCOIN_INTERACTIONS
 1.0.0-pointer-gesture-interpreter

Required controller:
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Restored:
- pointerdown
- pointermove
- pointerup
- pointercancel
- pointer capture
- pointer release
- mouse input
- touch input
- pen input
- orbit drag
- cluster drag
- outward cluster-exit swipe
- tap-versus-drag arbitration
- drag initiation over cardinal controls
- drag initiation over room controls
- whole-cardinal-star activation
- whole-room-star activation
- semantic-label activation
- Compass activation
- synthetic-click suppression
- keyboard-generated semantic activation
- front-crystal priority over Compass
- Compass priority over overlapping rear crystals
- rear-crystal activation outside Compass overlap
- projected-control positioning
- projected touch-radius publication
- stale projected-control deactivation

Whole-star hit contract:
- x is field-local projected center
- y is field-local projected center
- radiusPx is projected visible radius
- cardinal fallback radius is available until exact radius publication
- room fallback radius is available until exact radius publication
- hit testing is circular and independent of label bounds

Controller boundary:
- interactions classifies input
- interactions does not mutate controller state
- controller authorizes orbit preview
- controller authorizes orbit commit
- controller authorizes cluster preview
- controller authorizes cluster commit
- controller authorizes cardinal selection
- controller authorizes room selection
- controller authorizes Return to Constellation

Still required:
- compositor must return radiusPx from projectWorldPoint()
- crystals must forward radiusPx in semantic projection records
- HTML must load index.interactions.js after index.crystals.js
- CSS must preserve projected semantic controls without oversized field-covering rectangles

Runtime execution:
 NOT PERFORMED

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/
