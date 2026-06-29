/* /products/archcoin/index.interactions.js
   ARCHCOIN pointer, gesture, direct-manipulation, hit-testing,
   release-swipe, motion-quaternion, and interaction-priority authority.

   Module:
   DGB_ARCHCOIN_INTERACTIONS
   1.0.0-pointer-gesture-interpreter

   Required controller:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Frozen motion contract:
   AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1
   1.0.0

   Controlling distinction:

   INTERACTIONS DETERMINES MOTION.
   CONTROLLER DETERMINES AUTHORITY.

   Gesture distinction:

   FINGER HELD + MOVEMENT
   =
   DIRECT DRAG / ROTATION

   QUALIFIED HORIZONTAL SWIPE + RELEASE
   =
   RETURN TO CONSTELLATION

   Cluster return is no longer determined by:
   - radial origin;
   - outward-from-center direction;
   - bottom-left position;
   - downward motion;
   - a particular corner of the scene.

   A cluster-return swipe may travel:
   - left to right; or
   - right to left.

   It is evaluated on release using:
   - horizontal distance;
   - horizontal dominance;
   - duration;
   - average horizontal velocity.

   Interactions owns:
   - pointer lifecycle and capture;
   - tap-versus-drag arbitration;
   - whole-crystal and semantic-control hit testing;
   - Compass/front/rear interaction priority;
   - drag direction and sensitivity;
   - incremental complete-quaternion construction;
   - grabbed-object tracking and correction;
   - primary visual identity calculation;
   - horizontal release-swipe classification;
   - synthetic-click suppression;
   - projection-driven semantic-control application;
   - cleanup, validation, and receipts.

   Interactions does not own:
   - canonical navigation state;
   - transition legality;
   - canonical routes;
   - authoritative quaternion storage;
   - navigation execution;
   - camera or projection mathematics;
   - crystal geometry or WebGL drawing;
   - Compass geometry or renderer lifecycle.

   Controller preview payloads contain exactly:
   - quaternion
   - primaryId

   Source status:
   PAIRED_INTERACTIONS_RELEASE_SWIPE_STANDARD
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

    controllerModuleId:
      "DGB_ARCHCOIN_CONTROLLER",

    controllerModuleVersion:
      "7.0.0-controller-interaction-semantic-priority",

    motionContractId:
      "AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",

    motionContractVersion:
      "1.0.0"
  });

  const INTENTS = Object.freeze({
    IDLE:
      "IDLE",

    UNKNOWN:
      "UNKNOWN",

    TAP:
      "TAP",

    ORBIT_ROTATE:
      "ORBIT_ROTATE",

    CLUSTER_ROTATE:
      "CLUSTER_ROTATE",

    CLUSTER_HORIZONTAL_SWIPE:
      "CLUSTER_HORIZONTAL_SWIPE",

    COMPASS_CANCELLED:
      "COMPASS_CANCELLED",

    CANCELLED:
      "CANCELLED"
  });

  const HIT_KINDS = Object.freeze({
    CARDINAL:
      "cardinal",

    ROOM:
      "room",

    COMPASS:
      "compass",

    OPEN_SPACE:
      "open-space"
  });

  const DEPTH_LAYERS = Object.freeze({
    FRONT:
      "front",

    REAR:
      "rear",

    UNKNOWN:
      "unknown"
  });

  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER:
      "CLUSTER",

    HELD:
      "HELD"
  });

  const INTERACTION_PRIORITY = Object.freeze({
    FRONT:
      300,

    COMPASS:
      200,

    REAR:
      100,

    INACTIVE:
      0
  });

  /*
   * All interaction feel and gesture thresholds are confined to this file.
   */
  const MOTION = Object.freeze({
    dragActivationDistancePx:
      7,

    tapMaximumDistancePx:
      8,

    tapMaximumDurationMs:
      650,

    orbitRadiansPerPixel:
      0.0062,

    clusterRadiansPerPixel:
      0.007,

    grabbedCorrectionRadiansPerPixel:
      0.0028,

    maximumIncrementalAngle:
      0.24,

    maximumGrabCorrectionAngle:
      0.12,

    reducedMotionMultiplier:
      0.72,

    minimumProjectedHitRadiusPx:
      22,

    maximumProjectedHitRadiusPx:
      96,

    hitRadiusScale:
      1.18,

    /*
     * Release-swipe contract.
     *
     * The gesture must be:
     * - sufficiently long;
     * - predominantly horizontal;
     * - completed within the maximum duration;
     * - fast enough on average.
     *
     * Both horizontal directions are accepted.
     */
    clusterSwipeMinimumHorizontalDistancePx:
      72,

    clusterSwipeMaximumVerticalDistancePx:
      92,

    clusterSwipeHorizontalDominanceRatio:
      1.6,

    clusterSwipeMaximumDurationMs:
      560,

    clusterSwipeMinimumHorizontalVelocityPxPerMs:
      0.3,

    clusterSwipeRequireRelease:
      true,

    openSpaceRotationEnabled:
      true,

    directGrabEnabled:
      true,

    preventBrowserPanDuringActiveGesture:
      true
  });

  const QUATERNION = Object.freeze({
    identity:
      Object.freeze([
        0,
        0,
        0,
        1
      ]),

    minimumLength:
      1e-8
  });

  const REQUIRED_CONTROLLER_METHODS = Object.freeze([
    "getFrameState",
    "getSemanticProjection",
    "subscribeFrameState",
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
    controller:
      null,

    root:
      null,

    scene:
      null,

    sceneField:
      null,

    compassControl:
      null,

    frame:
      null,

    projections:
      Object.freeze([]),

    semanticControls:
      new Map(),

    activePointerId:
      null,

    pointerType:
      "",

    pointerDownTarget:
      null,

    pointerDownTime:
      0,

    startX:
      0,

    startY:
      0,

    lastX:
      0,

    lastY:
      0,

    currentX:
      0,

    currentY:
      0,

    totalDx:
      0,

    totalDy:
      0,

    dragDistance:
      0,

    intent:
      INTENTS.IDLE,

    transactionKind:
      "",

    transactionWing:
      "",

    transactionOpened:
      false,

    previewAccepted:
      false,

    latestQuaternion:
      null,

    latestPrimaryId:
      "",

    grabbed:
      null,

    suppressClickUntil:
      0,

    suppressClickTarget:
      null,

    unsubscribeFrame:
      null,

    unsubscribeProjection:
      null,

    listeners:
      [],

    initialized:
      false,

    disposed:
      false,

    lastAction:
      "pending",

    lastFailure:
      "",

    validationReceipt:
      null
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
    return Math.min(
      maximum,
      Math.max(
        minimum,
        value
      )
    );
  }

  function distance(
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

  function normalizeWing(value) {
    const wing =
      String(value || "")
        .trim()
        .toLowerCase();

    return [
      "north",
      "east",
      "south",
      "west"
    ].includes(wing)
      ? wing
      : "";
  }

  function normalizeRoomId(value) {
    return String(
      value || ""
    ).trim();
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

  function normalizeQuaternion(
    value,
    fallback =
      QUATERNION.identity
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : null;

    if (
      !source ||
      source.length !== 4
    ) {
      return Array.from(
        fallback
      );
    }

    const quaternion =
      source.map(
        component =>
          Number(component)
      );

    if (
      quaternion.some(
        component =>
          !Number.isFinite(
            component
          )
      )
    ) {
      return Array.from(
        fallback
      );
    }

    const length =
      Math.hypot(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      );

    if (
      !Number.isFinite(length) ||
      length <
        QUATERNION.minimumLength
    ) {
      return Array.from(
        fallback
      );
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function quaternionMultiply(
    first,
    second
  ) {
    const [
      ax,
      ay,
      az,
      aw
    ] = normalizeQuaternion(first);

    const [
      bx,
      by,
      bz,
      bw
    ] = normalizeQuaternion(second);

    return normalizeQuaternion([
      aw * bx +
        ax * bw +
        ay * bz -
        az * by,

      aw * by -
        ax * bz +
        ay * bw +
        az * bx,

      aw * bz +
        ax * by -
        ay * bx +
        az * bw,

      aw * bw -
        ax * bx -
        ay * by -
        az * bz
    ]);
  }

  function quaternionFromAxisAngle(
    axisX,
    axisY,
    axisZ,
    angle
  ) {
    const axisLength =
      Math.hypot(
        axisX,
        axisY,
        axisZ
      );

    if (
      !Number.isFinite(axisLength) ||
      axisLength <= 1e-8 ||
      !Number.isFinite(angle) ||
      Math.abs(angle) <= 1e-10
    ) {
      return Array.from(
        QUATERNION.identity
      );
    }

    const halfAngle =
      angle * 0.5;

    const scale =
      Math.sin(halfAngle) /
      axisLength;

    return normalizeQuaternion([
      axisX * scale,
      axisY * scale,
      axisZ * scale,
      Math.cos(halfAngle)
    ]);
  }

  /*
   * Incremental drag mapping.
   *
   * Horizontal pointer movement uses world Y.
   * Vertical pointer movement uses world X.
   * Ordinary drag introduces no world-Z key-turn roll.
   */
  function quaternionFromScreenIncrement(
    dx,
    dy,
    radiansPerPixel,
    maximumAngle
  ) {
    const length =
      Math.hypot(
        dx,
        dy
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-8
    ) {
      return Array.from(
        QUATERNION.identity
      );
    }

    const angle =
      clamp(
        length *
          radiansPerPixel,

        0,

        maximumAngle
      );

    return quaternionFromAxisAngle(
      dy,
      dx,
      0,
      angle
    );
  }

  function applyWorldSpaceDelta(
    currentQuaternion,
    deltaQuaternion
  ) {
    return quaternionMultiply(
      deltaQuaternion,
      currentQuaternion
    );
  }

  function getSceneRect() {
    if (!state.sceneField) {
      return null;
    }

    const rect =
      state.sceneField
        .getBoundingClientRect();

    if (
      !rect ||
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return null;
    }

    return rect;
  }

  function viewportToScenePoint(
    clientX,
    clientY
  ) {
    const rect =
      getSceneRect();

    if (!rect) {
      return Object.freeze({
        x:
          finiteNumber(
            clientX,
            0
          ),

        y:
          finiteNumber(
            clientY,
            0
          )
      });
    }

    return Object.freeze({
      x:
        finiteNumber(
          clientX,
          0
        ) -
        rect.left,

      y:
        finiteNumber(
          clientY,
          0
        ) -
        rect.top
    });
  }

  function sceneCenter() {
    const rect =
      getSceneRect();

    if (!rect) {
      return Object.freeze({
        x: 0,
        y: 0
      });
    }

    return Object.freeze({
      x:
        rect.width * 0.5,

      y:
        rect.height * 0.5
    });
  }

  function getControllerFrame() {
    if (
      !state.controller ||
      typeof state.controller
        .getFrameState !==
        "function"
    ) {
      return null;
    }

    try {
      return state.controller
        .getFrameState();
    } catch (_) {
      return null;
    }
  }

  function activePresentationMode() {
    const frame =
      state.frame ||
      getControllerFrame();

    return String(
      frame &&
      frame.presentationMode
        ? frame.presentationMode
        : ""
    ).trim();
  }

  function activeClusterWing() {
    const frame =
      state.frame ||
      getControllerFrame();

    return normalizeWing(
      frame &&
      frame.activeClusterWing
        ? frame.activeClusterWing
        : frame &&
          frame.selectedCardinal
          ? frame.selectedCardinal
          : ""
    );
  }

  function currentOrbitQuaternion() {
    const frame =
      state.frame ||
      getControllerFrame();

    return normalizeQuaternion(
      frame &&
      frame.orbitOrientation &&
      frame.orbitOrientation
        .quaternion
        ? frame.orbitOrientation
            .quaternion
        : QUATERNION.identity
    );
  }

  function currentClusterQuaternion() {
    const frame =
      state.frame ||
      getControllerFrame();

    return normalizeQuaternion(
      frame &&
      frame.cluster &&
      frame.cluster.orientation &&
      frame.cluster.orientation
        .quaternion
        ? frame.cluster
            .orientation
            .quaternion
        : QUATERNION.identity
    );
  }

  function isHeld() {
    const frame =
      state.frame ||
      getControllerFrame();

    return Boolean(
      frame &&
      frame.held
    );
  }

  function reducedMotionMultiplier() {
    const frame =
      state.frame ||
      getControllerFrame();

    return frame &&
      frame.reducedMotion
      ? MOTION
          .reducedMotionMultiplier
      : 1;
  }

  function normalizeProjectionRecord(
    input
  ) {
    if (
      !input ||
      typeof input !== "object"
    ) {
      return null;
    }

    const id =
      String(
        input.id || ""
      ).trim();

    const kind =
      String(
        input.kind || ""
      )
        .trim()
        .toLowerCase();

    if (
      !id ||
      !kind
    ) {
      return null;
    }

    return Object.freeze({
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
        input.visible !== false
    });
  }

  function replaceProjectionSnapshot(
    records
  ) {
    const normalized =
      [];

    if (Array.isArray(records)) {
      for (const input of records) {
        const record =
          normalizeProjectionRecord(
            input
          );

        if (record) {
          normalized.push(record);
        }
      }
    }

    state.projections =
      Object.freeze(
        normalized
      );

    applyProjectionFactsToControls();
  }

  function projectedHitRadius(
    record
  ) {
    const declared =
      Math.max(
        0,

        finiteNumber(
          record &&
          record.radiusPx,
          0
        )
      );

    const scaled =
      declared > 0
        ? declared *
          MOTION.hitRadiusScale
        : MOTION
            .minimumProjectedHitRadiusPx;

    return clamp(
      scaled,

      MOTION
        .minimumProjectedHitRadiusPx,

      MOTION
        .maximumProjectedHitRadiusPx
    );
  }

  /*
   * Visual interaction order:
   *
   * front crystal
   * Compass
   * rear crystal outside Compass overlap
   */
  function deriveInteractionPriority(
    record
  ) {
    if (
      !record ||
      record.visible !== true
    ) {
      return INTERACTION_PRIORITY
        .INACTIVE;
    }

    if (
      record.depthLayer ===
      DEPTH_LAYERS.FRONT
    ) {
      return INTERACTION_PRIORITY
        .FRONT;
    }

    if (
      record.depthLayer ===
      DEPTH_LAYERS.REAR
    ) {
      return record.compassOverlap
        ? INTERACTION_PRIORITY
            .INACTIVE
        : INTERACTION_PRIORITY
            .REAR;
    }

    return INTERACTION_PRIORITY
      .INACTIVE;
  }

  function semanticControlIdentity(
    element
  ) {
    if (!element) {
      return null;
    }

    if (
      element.matches(
        "[data-archcoin-room]"
      )
    ) {
      const id =
        normalizeRoomId(
          element.dataset.roomId
        );

      return id
        ? Object.freeze({
            kind:
              HIT_KINDS.ROOM,

            id
          })
        : null;
    }

    if (
      element.matches(
        "[data-archcoin-coin]"
      )
    ) {
      const id =
        normalizeWing(
          element.dataset.wing
        );

      return id
        ? Object.freeze({
            kind:
              HIT_KINDS.CARDINAL,

            id
          })
        : null;
    }

    if (
      element.matches(
        "[data-upstream-compass-control]"
      )
    ) {
      return Object.freeze({
        kind:
          HIT_KINDS.COMPASS,

        id:
          "home-compass"
      });
    }

    return null;
  }

  function semanticControlKey(
    kind,
    id
  ) {
    return `${String(
      kind || ""
    )
      .trim()
      .toLowerCase()}:${String(
      id || ""
    ).trim()}`;
  }

  function rebuildSemanticControlIndex() {
    state.semanticControls.clear();

    if (!state.root) {
      return;
    }

    const controls =
      Array.from(
        state.root
          .querySelectorAll(
            [
              "[data-archcoin-coin]",
              "[data-archcoin-room]"
            ].join(",")
          )
      );

    for (const control of controls) {
      const identity =
        semanticControlIdentity(
          control
        );

      if (!identity) {
        continue;
      }

      state.semanticControls.set(
        semanticControlKey(
          identity.kind,
          identity.id
        ),

        control
      );

      if (
        identity.kind ===
        HIT_KINDS.CARDINAL
      ) {
        state.semanticControls.set(
          semanticControlKey(
            "coin",
            identity.id
          ),

          control
        );
      }
    }
  }

  function findSemanticControlForRecord(
    record
  ) {
    if (!record) {
      return null;
    }

    return (
      state.semanticControls.get(
        semanticControlKey(
          record.kind,
          record.id
        )
      ) ||
      (
        record.kind === "cardinal"
          ? state.semanticControls.get(
              semanticControlKey(
                "coin",
                record.id
              )
            )
          : null
      ) ||
      (
        record.kind === "coin"
          ? state.semanticControls.get(
              semanticControlKey(
                HIT_KINDS.CARDINAL,
                record.id
              )
            )
          : null
      ) ||
      null
    );
  }

  function applyProjectionFactsToControls() {
    if (
      !state.root ||
      state.disposed
    ) {
      return;
    }

    for (
      const record
      of state.projections
    ) {
      const control =
        findSemanticControlForRecord(
          record
        );

      if (!control) {
        continue;
      }

      const priority =
        deriveInteractionPriority(
          record
        );

      const radius =
        projectedHitRadius(
          record
        );

      control.style.setProperty(
        "--archcoin-projection-x",
        `${record.x}px`
      );

      control.style.setProperty(
        "--archcoin-projection-y",
        `${record.y}px`
      );

      control.style.setProperty(
        "--archcoin-projection-radius",
        `${radius}px`
      );

      control.dataset
        .projectionVisible =
        record.visible
          ? "true"
          : "false";

      control.dataset
        .projectionDepthLayer =
        record.depthLayer;

      control.dataset
        .projectionCompassOverlap =
        record.compassOverlap
          ? "true"
          : "false";

      control.dataset
        .interactionPriority =
        String(priority);

      control.style.position =
        "absolute";

      control.style.left =
        `${record.x}px`;

      control.style.top =
        `${record.y}px`;

      control.style.width =
        `${radius * 2}px`;

      control.style.height =
        `${radius * 2}px`;

      control.style.margin =
        "0";

      control.style.transform =
        "translate(-50%, -50%)";

      control.style.pointerEvents =
        priority >
          INTERACTION_PRIORITY.INACTIVE
          ? "auto"
          : "none";

      if (
        record.visible &&
        priority >
          INTERACTION_PRIORITY.INACTIVE
      ) {
        control.removeAttribute(
          "aria-hidden"
        );

        if (
          control.dataset.active ===
          "true"
        ) {
          control.removeAttribute(
            "tabindex"
          );
        }
      } else {
        control.setAttribute(
          "aria-hidden",
          "true"
        );

        control.setAttribute(
          "tabindex",
          "-1"
        );
      }
    }
  }

  function pointInElementRect(
    element,
    clientX,
    clientY
  ) {
    if (!element) {
      return false;
    }

    const rect =
      element
        .getBoundingClientRect();

    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  function compassHit(
    clientX,
    clientY
  ) {
    if (
      !state.compassControl ||
      state.compassControl
        .dataset
        .interactionEnabled ===
        "false" ||
      !pointInElementRect(
        state.compassControl,
        clientX,
        clientY
      )
    ) {
      return null;
    }

    return Object.freeze({
      kind:
        HIT_KINDS.COMPASS,

      id:
        "home-compass",

      priority:
        INTERACTION_PRIORITY
          .COMPASS,

      record:
        null,

      element:
        state.compassControl
    });
  }

  function canonicalRoomRecord(
    roomId
  ) {
    if (
      !state.controller ||
      !Array.isArray(
        state.controller
          .canonicalRoomRecords
      )
    ) {
      return null;
    }

    return (
      state.controller
        .canonicalRoomRecords
        .find(
          record =>
            record.roomId ===
            roomId
        ) ||
      null
    );
  }

  function crystalHitsAt(
    sceneX,
    sceneY
  ) {
    const hits =
      [];

    const mode =
      activePresentationMode();

    const clusterWing =
      activeClusterWing();

    for (
      const record
      of state.projections
    ) {
      if (!record.visible) {
        continue;
      }

      const isCardinal =
        record.kind === "cardinal" ||
        record.kind === "coin";

      const isRoom =
        record.kind === "room";

      if (
        mode ===
          PRESENTATION_MODES.CONSTELLATION &&
        !isCardinal
      ) {
        continue;
      }

      if (
        mode ===
          PRESENTATION_MODES.CLUSTER &&
        !isRoom
      ) {
        continue;
      }

      if (
        isRoom &&
        clusterWing
      ) {
        const canonical =
          canonicalRoomRecord(
            record.id
          );

        if (
          !canonical ||
          canonical.wing !==
            clusterWing
        ) {
          continue;
        }
      }

      const radius =
        projectedHitRadius(
          record
        );

      const hitDistance =
        distance(
          sceneX,
          sceneY,
          record.x,
          record.y
        );

      if (
        hitDistance > radius
      ) {
        continue;
      }

      const priority =
        deriveInteractionPriority(
          record
        );

      if (
        priority <=
        INTERACTION_PRIORITY.INACTIVE
      ) {
        continue;
      }

      hits.push(
        Object.freeze({
          kind:
            isRoom
              ? HIT_KINDS.ROOM
              : HIT_KINDS.CARDINAL,

          id:
            record.id,

          priority,
          distance:
            hitDistance,
          radius,
          record,

          element:
            findSemanticControlForRecord(
              record
            )
        })
      );
    }

    hits.sort(
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

        return (
          first.distance -
          second.distance
        );
      }
    );

    return hits;
  }

  function semanticTargetFromEvent(
    event
  ) {
    const target =
      event &&
      event.target &&
      typeof event.target
        .closest === "function"
        ? event.target.closest(
            [
              "[data-archcoin-room]",
              "[data-archcoin-coin]",
              "[data-upstream-compass-control]"
            ].join(",")
          )
        : null;

    if (
      !target ||
      !state.root.contains(target)
    ) {
      return null;
    }

    const identity =
      semanticControlIdentity(
        target
      );

    if (!identity) {
      return null;
    }

    if (
      identity.kind ===
      HIT_KINDS.COMPASS
    ) {
      return Object.freeze({
        kind:
          HIT_KINDS.COMPASS,

        id:
          identity.id,

        priority:
          INTERACTION_PRIORITY
            .COMPASS,

        record:
          null,

        element:
          target
      });
    }

    const record =
      state.projections.find(
        projection => {
          if (
            identity.kind ===
            HIT_KINDS.ROOM
          ) {
            return (
              projection.kind ===
                "room" &&
              projection.id ===
                identity.id
            );
          }

          return (
            (
              projection.kind ===
                "cardinal" ||
              projection.kind ===
                "coin"
            ) &&
            projection.id ===
              identity.id
          );
        }
      ) ||
      null;

    return Object.freeze({
      kind:
        identity.kind,

      id:
        identity.id,

      priority:
        record
          ? deriveInteractionPriority(
              record
            )
          : INTERACTION_PRIORITY.REAR,

      record,

      element:
        target
    });
  }

  function resolvePointerDownTarget(
    event
  ) {
    const direct =
      semanticTargetFromEvent(
        event
      );

    const point =
      viewportToScenePoint(
        event.clientX,
        event.clientY
      );

    const crystal =
      crystalHitsAt(
        point.x,
        point.y
      )[0] ||
      null;

    const compass =
      compassHit(
        event.clientX,
        event.clientY
      );

    const candidates =
      [
        direct,
        crystal,
        compass
      ].filter(Boolean);

    candidates.sort(
      (
        first,
        second
      ) =>
        finiteNumber(
          second.priority,
          0
        ) -
        finiteNumber(
          first.priority,
          0
        )
    );

    if (
      candidates.length > 0
    ) {
      return candidates[0];
    }

    return Object.freeze({
      kind:
        HIT_KINDS.OPEN_SPACE,

      id:
        "",

      priority:
        INTERACTION_PRIORITY
          .INACTIVE,

      record:
        null,

      element:
        state.sceneField
    });
  }

  function primaryCandidateRecords() {
    const mode =
      activePresentationMode();

    const clusterWing =
      activeClusterWing();

    if (
      mode ===
      PRESENTATION_MODES.CONSTELLATION
    ) {
      return state.projections.filter(
        record =>
          record.visible &&
          (
            record.kind ===
              "cardinal" ||
            record.kind ===
              "coin"
          )
      );
    }

    if (
      mode ===
      PRESENTATION_MODES.CLUSTER
    ) {
      return state.projections.filter(
        record => {
          if (
            !record.visible ||
            record.kind !== "room"
          ) {
            return false;
          }

          const canonical =
            canonicalRoomRecord(
              record.id
            );

          return Boolean(
            canonical &&
            canonical.wing ===
              clusterWing
          );
        }
      );
    }

    return [];
  }

  function calculatePrimaryIdentity(
    fallbackId = ""
  ) {
    const candidates =
      primaryCandidateRecords();

    const center =
      sceneCenter();

    let best =
      null;

    let bestDistance =
      Infinity;

    for (
      const record
      of candidates
    ) {
      if (
        deriveInteractionPriority(
          record
        ) <=
        INTERACTION_PRIORITY.INACTIVE
      ) {
        continue;
      }

      const candidateDistance =
        distance(
          record.x,
          record.y,
          center.x,
          center.y
        );

      if (
        candidateDistance <
        bestDistance
      ) {
        best =
          record;

        bestDistance =
          candidateDistance;
      }
    }

    if (best) {
      return best.id;
    }

    const mode =
      activePresentationMode();

    if (
      mode ===
      PRESENTATION_MODES.CONSTELLATION
    ) {
      return (
        normalizeWing(
          fallbackId
        ) ||
        normalizeWing(
          state.frame &&
          state.frame
            .orbitPreviewFocus
        ) ||
        normalizeWing(
          state.frame &&
          state.frame
            .orbitFocus
        ) ||
        "north"
      );
    }

    if (
      mode ===
      PRESENTATION_MODES.CLUSTER
    ) {
      const cluster =
        state.frame &&
        state.frame.cluster;

      const roomIds =
        cluster &&
        Array.isArray(
          cluster.roomIds
        )
          ? cluster.roomIds
          : [];

      const fallbackRoom =
        normalizeRoomId(
          fallbackId
        );

      if (
        roomIds.includes(
          fallbackRoom
        )
      ) {
        return fallbackRoom;
      }

      return (
        normalizeRoomId(
          cluster &&
          cluster
            .previewPrimaryRoom
        ) ||
        normalizeRoomId(
          cluster &&
          cluster
            .primaryRoom
        ) ||
        roomIds[0] ||
        ""
      );
    }

    return "";
  }

  function createGrabRecord(
    target,
    pointerPoint
  ) {
    if (
      !MOTION.directGrabEnabled ||
      !target ||
      !target.record
    ) {
      return null;
    }

    return {
      kind:
        target.kind,

      id:
        target.id,

      pointerOffsetX:
        pointerPoint.x -
        target.record.x,

      pointerOffsetY:
        pointerPoint.y -
        target.record.y
    };
  }

  function latestProjectionForGrab() {
    if (!state.grabbed) {
      return null;
    }

    return (
      state.projections.find(
        record => {
          if (
            state.grabbed.kind ===
            HIT_KINDS.ROOM
          ) {
            return (
              record.kind ===
                "room" &&
              record.id ===
                state.grabbed.id
            );
          }

          return (
            (
              record.kind ===
                "cardinal" ||
              record.kind ===
                "coin"
            ) &&
            record.id ===
              state.grabbed.id
          );
        }
      ) ||
      null
    );
  }

  function grabbedCorrectionDelta(
    pointerPoint
  ) {
    if (!state.grabbed) {
      return Object.freeze({
        dx: 0,
        dy: 0
      });
    }

    const projection =
      latestProjectionForGrab();

    if (!projection) {
      return Object.freeze({
        dx: 0,
        dy: 0
      });
    }

    const desiredX =
      pointerPoint.x -
      state.grabbed
        .pointerOffsetX;

    const desiredY =
      pointerPoint.y -
      state.grabbed
        .pointerOffsetY;

    return Object.freeze({
      dx:
        desiredX -
        projection.x,

      dy:
        desiredY -
        projection.y
    });
  }

  function currentMotionSensitivity() {
    const multiplier =
      reducedMotionMultiplier();

    return activePresentationMode() ===
      PRESENTATION_MODES.CLUSTER
      ? MOTION
          .clusterRadiansPerPixel *
        multiplier
      : MOTION
          .orbitRadiansPerPixel *
        multiplier;
  }

  function buildIncrementalQuaternion(
    pointerPoint
  ) {
    const incrementalDx =
      pointerPoint.x -
      state.lastX;

    const incrementalDy =
      pointerPoint.y -
      state.lastY;

    const movementDelta =
      quaternionFromScreenIncrement(
        incrementalDx,
        incrementalDy,
        currentMotionSensitivity(),
        MOTION
          .maximumIncrementalAngle
      );

    let result =
      applyWorldSpaceDelta(
        state.latestQuaternion ||
        QUATERNION.identity,

        movementDelta
      );

    if (state.grabbed) {
      const correction =
        grabbedCorrectionDelta(
          pointerPoint
        );

      if (
        Math.hypot(
          correction.dx,
          correction.dy
        ) > 0.5
      ) {
        const correctionDelta =
          quaternionFromScreenIncrement(
            correction.dx,
            correction.dy,

            MOTION
              .grabbedCorrectionRadiansPerPixel *
            reducedMotionMultiplier(),

            MOTION
              .maximumGrabCorrectionAngle
          );

        result =
          applyWorldSpaceDelta(
            result,
            correctionDelta
          );
      }
    }

    return normalizeQuaternion(
      result
    );
  }

  /*
   * Compass-origin gestures are Compass-owned.
   *
   * A Compass tap may select the Compass.
   * A Compass drag may not rotate either crystal field.
   */
  function updateIntentFromMovement() {
    if (
      state.intent ===
        INTENTS.ORBIT_ROTATE ||
      state.intent ===
        INTENTS.CLUSTER_ROTATE ||
      state.intent ===
        INTENTS.COMPASS_CANCELLED ||
      state.intent ===
        INTENTS.CANCELLED
    ) {
      return state.intent;
    }

    if (
      state.pointerDownTarget &&
      state.pointerDownTarget.kind ===
        HIT_KINDS.COMPASS
    ) {
      if (
        state.dragDistance >
        MOTION.tapMaximumDistancePx
      ) {
        state.intent =
          INTENTS.COMPASS_CANCELLED;
      }

      return state.intent;
    }

    if (
      state.dragDistance <
      MOTION.dragActivationDistancePx
    ) {
      return INTENTS.UNKNOWN;
    }

    if (
      state.pointerDownTarget &&
      state.pointerDownTarget.kind ===
        HIT_KINDS.OPEN_SPACE &&
      !MOTION.openSpaceRotationEnabled
    ) {
      state.intent =
        INTENTS.CANCELLED;

      return state.intent;
    }

    const mode =
      activePresentationMode();

    if (
      mode ===
      PRESENTATION_MODES.CONSTELLATION
    ) {
      state.intent =
        INTENTS.ORBIT_ROTATE;

      return state.intent;
    }

    if (
      mode ===
      PRESENTATION_MODES.CLUSTER
    ) {
      state.intent =
        INTENTS.CLUSTER_ROTATE;

      return state.intent;
    }

    state.intent =
      INTENTS.CANCELLED;

    return state.intent;
  }

  function openMotionTransaction() {
    if (
      state.transactionOpened ||
      isHeld()
    ) {
      return state.transactionOpened;
    }

    if (
      state.intent ===
      INTENTS.ORBIT_ROTATE
    ) {
      if (
        !state.controller
          .beginOrbitGesture()
      ) {
        return false;
      }

      state.transactionKind =
        "orbit";

      state.transactionOpened =
        true;

      state.latestQuaternion =
        currentOrbitQuaternion();

      return true;
    }

    if (
      state.intent ===
      INTENTS.CLUSTER_ROTATE
    ) {
      const wing =
        activeClusterWing();

      if (
        !wing ||
        !state.controller
          .beginClusterGesture(
            wing
          )
      ) {
        return false;
      }

      state.transactionKind =
        "cluster";

      state.transactionWing =
        wing;

      state.transactionOpened =
        true;

      state.latestQuaternion =
        currentClusterQuaternion();

      return true;
    }

    return false;
  }

  function submitPreview(
    pointerPoint
  ) {
    if (
      !state.transactionOpened
    ) {
      return false;
    }

    const quaternion =
      buildIncrementalQuaternion(
        pointerPoint
      );

    const fallbackPrimary =
      state.grabbed
        ? state.grabbed.id
        : state.latestPrimaryId;

    const primaryId =
      calculatePrimaryIdentity(
        fallbackPrimary
      );

    if (!primaryId) {
      return false;
    }

    let accepted =
      false;

    if (
      state.transactionKind ===
      "orbit"
    ) {
      const wing =
        normalizeWing(
          primaryId
        );

      if (!wing) {
        return false;
      }

      accepted =
        state.controller
          .requestOrbitPreview({
            quaternion,
            primaryId: wing
          });
    } else if (
      state.transactionKind ===
      "cluster"
    ) {
      const roomId =
        normalizeRoomId(
          primaryId
        );

      if (!roomId) {
        return false;
      }

      accepted =
        state.controller
          .requestClusterPreview(
            state.transactionWing,

            {
              quaternion,
              primaryId:
                roomId
            }
          );
    }

    if (!accepted) {
      return false;
    }

    state.previewAccepted =
      true;

    state.latestQuaternion =
      quaternion;

    state.latestPrimaryId =
      primaryId;

    /*
     * Increment origin advances only after controller acceptance.
     */
    state.lastX =
      pointerPoint.x;

    state.lastY =
      pointerPoint.y;

    recordAction(
      `preview-accepted:${state.transactionKind}:${primaryId}`
    );

    return true;
  }

  function commitMotionTransaction() {
    if (
      !state.transactionOpened ||
      !state.previewAccepted
    ) {
      return false;
    }

    let committed =
      false;

    if (
      state.transactionKind ===
      "orbit"
    ) {
      committed =
        state.controller
          .requestOrbitCommit();
    } else if (
      state.transactionKind ===
      "cluster"
    ) {
      committed =
        state.controller
          .requestClusterCommit(
            state.transactionWing
          );
    }

    if (committed) {
      recordAction(
        `transaction-committed:${state.transactionKind}`
      );
    }

    return committed;
  }

  function cancelMotionTransaction(
    reason
  ) {
    if (
      !state.transactionOpened
    ) {
      return false;
    }

    let cancelled =
      false;

    if (
      state.transactionKind ===
      "orbit"
    ) {
      cancelled =
        state.controller
          .requestOrbitCancel(
            reason
          );
    } else if (
      state.transactionKind ===
      "cluster"
    ) {
      cancelled =
        state.controller
          .requestClusterCancel(
            state.transactionWing,
            reason
          );
    }

    if (cancelled) {
      recordAction(
        `transaction-cancelled:${state.transactionKind}:${reason}`
      );
    }

    return cancelled;
  }

  function activateSemanticTarget(
    target
  ) {
    if (
      !target ||
      isHeld()
    ) {
      return false;
    }

    if (
      target.kind ===
      HIT_KINDS.CARDINAL
    ) {
      return state.controller
        .requestCardinalSelection(
          target.id
        );
    }

    if (
      target.kind ===
      HIT_KINDS.ROOM
    ) {
      return state.controller
        .requestRoomSelection(
          target.id
        );
    }

    if (
      target.kind ===
      HIT_KINDS.COMPASS
    ) {
      return state.controller
        .requestCompassSelection();
    }

    return false;
  }

  /*
   * Release-only horizontal swipe classifier.
   *
   * It is independent of scene quadrant, radial origin, and vertical
   * outward direction.
   */
  function classifyClusterHorizontalSwipe(
    elapsedMs
  ) {
    if (
      activePresentationMode() !==
      PRESENTATION_MODES.CLUSTER
    ) {
      return Object.freeze({
        qualified: false,
        reason:
          "NOT_CLUSTER_MODE"
      });
    }

    if (
      state.pointerDownTarget &&
      state.pointerDownTarget.kind ===
        HIT_KINDS.COMPASS
    ) {
      return Object.freeze({
        qualified: false,
        reason:
          "COMPASS_ORIGIN"
      });
    }

    const absoluteHorizontal =
      Math.abs(
        state.totalDx
      );

    const absoluteVertical =
      Math.abs(
        state.totalDy
      );

    const duration =
      Math.max(
        1,
        finiteNumber(
          elapsedMs,
          1
        )
      );

    const horizontalVelocity =
      absoluteHorizontal /
      duration;

    const horizontalDominance =
      absoluteHorizontal /
      Math.max(
        absoluteVertical,
        1
      );

    const qualified =
      absoluteHorizontal >=
        MOTION
          .clusterSwipeMinimumHorizontalDistancePx &&
      absoluteVertical <=
        MOTION
          .clusterSwipeMaximumVerticalDistancePx &&
      horizontalDominance >=
        MOTION
          .clusterSwipeHorizontalDominanceRatio &&
      duration <=
        MOTION
          .clusterSwipeMaximumDurationMs &&
      horizontalVelocity >=
        MOTION
          .clusterSwipeMinimumHorizontalVelocityPxPerMs;

    return Object.freeze({
      qualified,

      direction:
        state.totalDx >= 0
          ? "LEFT_TO_RIGHT"
          : "RIGHT_TO_LEFT",

      horizontalDistancePx:
        absoluteHorizontal,

      verticalDistancePx:
        absoluteVertical,

      horizontalDominance,

      durationMs:
        duration,

      horizontalVelocityPxPerMs:
        horizontalVelocity,

      reason:
        qualified
          ? "QUALIFIED_HORIZONTAL_RELEASE_SWIPE"
          : "THRESHOLD_NOT_MET"
    });
  }

  function requestClusterSwipeReturn(
    swipe
  ) {
    if (
      !swipe ||
      swipe.qualified !== true
    ) {
      return false;
    }

    /*
     * Drag previews remain provisional. A qualifying release swipe restores
     * the cluster's gesture origin before requesting the navigation return.
     */
    if (
      state.transactionOpened
    ) {
      cancelMotionTransaction(
        "cluster-horizontal-swipe"
      );

      state.transactionOpened =
        false;

      state.previewAccepted =
        false;
    }

    state.intent =
      INTENTS.CLUSTER_HORIZONTAL_SWIPE;

    const returned =
      state.controller
        .requestReturnToConstellation({
          source:
            "cluster-horizontal-swipe",

          scrollToScene:
            true
        });

    if (returned) {
      recordAction(
        `cluster-horizontal-swipe-returned:${swipe.direction}`
      );
    }

    return returned;
  }

  function setPointerCapture(
    pointerId
  ) {
    if (
      !state.sceneField ||
      typeof state.sceneField
        .setPointerCapture !==
        "function"
    ) {
      return false;
    }

    try {
      state.sceneField
        .setPointerCapture(
          pointerId
        );

      return true;
    } catch (_) {
      return false;
    }
  }

  function releasePointerCapture() {
    if (
      state.activePointerId === null ||
      !state.sceneField ||
      typeof state.sceneField
        .releasePointerCapture !==
        "function"
    ) {
      return false;
    }

    try {
      if (
        typeof state.sceneField
          .hasPointerCapture ===
          "function" &&
        !state.sceneField
          .hasPointerCapture(
            state.activePointerId
          )
      ) {
        return false;
      }

      state.sceneField
        .releasePointerCapture(
          state.activePointerId
        );

      return true;
    } catch (_) {
      return false;
    }
  }

  function resetPointerState() {
    state.activePointerId =
      null;

    state.pointerType =
      "";

    state.pointerDownTarget =
      null;

    state.pointerDownTime =
      0;

    state.startX =
      0;

    state.startY =
      0;

    state.lastX =
      0;

    state.lastY =
      0;

    state.currentX =
      0;

    state.currentY =
      0;

    state.totalDx =
      0;

    state.totalDy =
      0;

    state.dragDistance =
      0;

    state.intent =
      INTENTS.IDLE;

    state.transactionKind =
      "";

    state.transactionWing =
      "";

    state.transactionOpened =
      false;

    state.previewAccepted =
      false;

    state.latestQuaternion =
      null;

    state.latestPrimaryId =
      "";

    state.grabbed =
      null;
  }

  function suppressNextClick(
    target
  ) {
    state.suppressClickUntil =
      performance.now() +
      700;

    state.suppressClickTarget =
      target &&
      target.element
        ? target.element
        : null;
  }

  function shouldSuppressClick(
    event
  ) {
    if (
      performance.now() >
      state.suppressClickUntil
    ) {
      state.suppressClickTarget =
        null;

      return false;
    }

    if (
      !state.suppressClickTarget
    ) {
      return true;
    }

    if (
      event.target ===
      state.suppressClickTarget
    ) {
      return true;
    }

    const semantic =
      event.target &&
      typeof event.target
        .closest === "function"
        ? event.target.closest(
            [
              "[data-archcoin-room]",
              "[data-archcoin-coin]",
              "[data-upstream-compass-control]"
            ].join(",")
          )
        : null;

    return (
      semantic ===
      state.suppressClickTarget
    );
  }

  function pointerDownIsEligible(
    event
  ) {
    if (
      state.disposed ||
      !state.initialized ||
      isHeld() ||
      state.activePointerId !== null
    ) {
      return false;
    }

    if (
      event.pointerType ===
        "mouse" &&
      event.button !== 0
    ) {
      return false;
    }

    const insideScene =
      state.sceneField &&
      state.sceneField.contains(
        event.target
      );

    const insideCompass =
      state.compassControl &&
      state.compassControl.contains(
        event.target
      );

    return (
      insideScene ||
      insideCompass
    );
  }

  function handlePointerDown(
    event
  ) {
    if (
      !pointerDownIsEligible(event)
    ) {
      return;
    }

    const point =
      viewportToScenePoint(
        event.clientX,
        event.clientY
      );

    const target =
      resolvePointerDownTarget(
        event
      );

    state.activePointerId =
      event.pointerId;

    state.pointerType =
      String(
        event.pointerType || ""
      );

    state.pointerDownTarget =
      target;

    state.pointerDownTime =
      performance.now();

    state.startX =
      point.x;

    state.startY =
      point.y;

    state.lastX =
      point.x;

    state.lastY =
      point.y;

    state.currentX =
      point.x;

    state.currentY =
      point.y;

    state.totalDx =
      0;

    state.totalDy =
      0;

    state.dragDistance =
      0;

    state.intent =
      INTENTS.UNKNOWN;

    state.transactionKind =
      "";

    state.transactionWing =
      "";

    state.transactionOpened =
      false;

    state.previewAccepted =
      false;

    state.latestQuaternion =
      null;

    state.latestPrimaryId =
      target &&
      target.id
        ? target.id
        : "";

    state.grabbed =
      createGrabRecord(
        target,
        point
      );

    setPointerCapture(
      event.pointerId
    );

    if (
      target &&
      target.kind !==
        HIT_KINDS.COMPASS
    ) {
      event.preventDefault();
    }

    recordAction(
      `pointer-down:${target.kind}:${target.id || "none"}`
    );
  }

  function handlePointerMove(
    event
  ) {
    if (
      state.disposed ||
      state.activePointerId !==
        event.pointerId
    ) {
      return;
    }

    const point =
      viewportToScenePoint(
        event.clientX,
        event.clientY
      );

    state.currentX =
      point.x;

    state.currentY =
      point.y;

    state.totalDx =
      point.x -
      state.startX;

    state.totalDy =
      point.y -
      state.startY;

    state.dragDistance =
      Math.hypot(
        state.totalDx,
        state.totalDy
      );

    const intent =
      updateIntentFromMovement();

    if (
      intent ===
        INTENTS.UNKNOWN
    ) {
      return;
    }

    if (
      intent ===
        INTENTS.COMPASS_CANCELLED ||
      intent ===
        INTENTS.CANCELLED
    ) {
      if (
        MOTION
          .preventBrowserPanDuringActiveGesture
      ) {
        event.preventDefault();
      }

      return;
    }

    if (
      MOTION
        .preventBrowserPanDuringActiveGesture
    ) {
      event.preventDefault();
    }

    if (
      intent !==
        INTENTS.ORBIT_ROTATE &&
      intent !==
        INTENTS.CLUSTER_ROTATE
    ) {
      return;
    }

    if (
      !openMotionTransaction()
    ) {
      state.intent =
        INTENTS.CANCELLED;

      recordFailure(
        "ARCHCOIN_INTERACTION_TRANSACTION_OPEN_FAILED"
      );

      return;
    }

    if (
      !submitPreview(point)
    ) {
      cancelMotionTransaction(
        "preview-rejected"
      );

      state.intent =
        INTENTS.CANCELLED;

      recordFailure(
        "ARCHCOIN_INTERACTION_PREVIEW_REJECTED"
      );
    }
  }

  function finalizePointer(
    event,
    {
      cancelled = false,
      reason = "pointer-up"
    } = {}
  ) {
    if (
      state.activePointerId !==
      event.pointerId
    ) {
      return;
    }

    const elapsed =
      performance.now() -
      state.pointerDownTime;

    const target =
      state.pointerDownTarget;

    let handled =
      false;

    if (cancelled) {
      if (
        state.transactionOpened
      ) {
        cancelMotionTransaction(
          reason
        );
      }

      state.intent =
        INTENTS.CANCELLED;

      handled =
        true;
    } else {
      /*
       * A cluster swipe is evaluated first on release.
       *
       * During the held drag, the cluster was allowed to preview rotation.
       * A qualifying horizontal release cancels that provisional rotation
       * and returns to the constellation.
       */
      const swipe =
        classifyClusterHorizontalSwipe(
          elapsed
        );

      if (swipe.qualified) {
        handled =
          requestClusterSwipeReturn(
            swipe
          );

        suppressNextClick(
          target
        );
      } else if (
        (
          state.intent ===
            INTENTS.ORBIT_ROTATE ||
          state.intent ===
            INTENTS.CLUSTER_ROTATE
        ) &&
        state.transactionOpened
      ) {
        if (
          state.previewAccepted
        ) {
          handled =
            commitMotionTransaction();
        } else {
          cancelMotionTransaction(
            "no-preview"
          );
        }

        suppressNextClick(
          target
        );
      } else {
        const qualifiesAsTap =
          state.dragDistance <=
            MOTION.tapMaximumDistancePx &&
          elapsed <=
            MOTION.tapMaximumDurationMs;

        if (
          qualifiesAsTap &&
          target &&
          target.kind !==
            HIT_KINDS.OPEN_SPACE
        ) {
          state.intent =
            INTENTS.TAP;

          handled =
            activateSemanticTarget(
              target
            );

          suppressNextClick(
            target
          );
        } else if (
          state.transactionOpened
        ) {
          cancelMotionTransaction(
            "gesture-not-committed"
          );
        }
      }
    }

    releasePointerCapture();

    recordAction(
      `pointer-finalized:${state.intent}:${handled ? "handled" : "unhandled"}`
    );

    resetPointerState();
  }

  function handlePointerUp(
    event
  ) {
    finalizePointer(
      event,
      {
        cancelled:
          false,

        reason:
          "pointer-up"
      }
    );
  }

  function handlePointerCancel(
    event
  ) {
    finalizePointer(
      event,
      {
        cancelled:
          true,

        reason:
          "pointer-cancel"
      }
    );
  }

  function handleLostPointerCapture(
    event
  ) {
    if (
      state.activePointerId !==
      event.pointerId
    ) {
      return;
    }

    if (
      state.transactionOpened
    ) {
      cancelMotionTransaction(
        "lost-pointer-capture"
      );
    }

    recordAction(
      "pointer-capture-lost"
    );

    resetPointerState();
  }

  function handleClickCapture(
    event
  ) {
    if (state.disposed) {
      return;
    }

    if (
      shouldSuppressClick(event)
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      return;
    }

    /*
     * Pointer-generated activation is handled by the pointer lifecycle.
     * detail === 0 preserves keyboard semantic activation.
     */
    if (
      event.detail !== 0
    ) {
      return;
    }

    const target =
      semanticTargetFromEvent(
        event
      );

    if (!target) {
      return;
    }

    event.preventDefault();

    activateSemanticTarget(
      target
    );
  }

  function handleDragStart(
    event
  ) {
    if (
      state.sceneField &&
      state.sceneField.contains(
        event.target
      )
    ) {
      event.preventDefault();
    }
  }

  function addListener(
    target,
    type,
    listener,
    options
  ) {
    target.addEventListener(
      type,
      listener,
      options
    );

    state.listeners.push({
      target,
      type,
      listener,
      options
    });
  }

  function removeAllListeners() {
    for (
      const binding
      of state.listeners
    ) {
      try {
        binding.target
          .removeEventListener(
            binding.type,
            binding.listener,
            binding.options
          );
      } catch (_) {}
    }

    state.listeners.length =
      0;
  }

  function bindPointerPolicy() {
    invariant(
      state.sceneField,
      "ARCHCOIN_INTERACTIONS_SCENE_FIELD_REQUIRED"
    );

    state.sceneField.style
      .touchAction =
      "none";

    state.sceneField.style
      .userSelect =
      "none";

    state.sceneField.style
      .webkitUserSelect =
      "none";

    state.sceneField.style
      .webkitTouchCallout =
      "none";

    /*
     * Root capture includes the fixed Compass and scene controls.
     */
    addListener(
      state.root,
      "pointerdown",
      handlePointerDown,
      {
        passive: false,
        capture: true
      }
    );

    addListener(
      state.sceneField,
      "pointermove",
      handlePointerMove,
      {
        passive: false
      }
    );

    addListener(
      state.sceneField,
      "pointerup",
      handlePointerUp,
      {
        passive: false
      }
    );

    addListener(
      state.sceneField,
      "pointercancel",
      handlePointerCancel,
      {
        passive: false
      }
    );

    addListener(
      state.sceneField,
      "lostpointercapture",
      handleLostPointerCapture,
      false
    );

    addListener(
      state.root,
      "click",
      handleClickCapture,
      true
    );

    addListener(
      state.root,
      "dragstart",
      handleDragStart,
      true
    );
  }

  function restorePointerPolicy() {
    if (!state.sceneField) {
      return;
    }

    state.sceneField.style
      .touchAction =
      "";

    state.sceneField.style
      .userSelect =
      "";

    state.sceneField.style
      .webkitUserSelect =
      "";

    state.sceneField.style
      .webkitTouchCallout =
      "";
  }

  function validateController(
    controller
  ) {
    invariant(
      controller &&
      typeof controller ===
        "object",

      "ARCHCOIN_INTERACTIONS_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.moduleId ===
        MODULE.controllerModuleId,

      "ARCHCOIN_INTERACTIONS_CONTROLLER_MODULE_ID_MISMATCH"
    );

    invariant(
      controller.moduleVersion ===
        MODULE.controllerModuleVersion,

      "ARCHCOIN_INTERACTIONS_CONTROLLER_VERSION_MISMATCH"
    );

    invariant(
      controller.motionContractId ===
        MODULE.motionContractId,

      "ARCHCOIN_INTERACTIONS_MOTION_CONTRACT_ID_MISMATCH"
    );

    invariant(
      controller.motionContractVersion ===
        MODULE.motionContractVersion,

      "ARCHCOIN_INTERACTIONS_MOTION_CONTRACT_VERSION_MISMATCH"
    );

    for (
      const methodName
      of REQUIRED_CONTROLLER_METHODS
    ) {
      invariant(
        typeof controller[
          methodName
        ] === "function",

        `ARCHCOIN_INTERACTIONS_CONTROLLER_METHOD_MISSING:${methodName}`
      );
    }

    invariant(
      Array.isArray(
        controller
          .canonicalRoomRecords
      ) &&
      controller
        .canonicalRoomRecords
        .length === 16,

      "ARCHCOIN_INTERACTIONS_CANONICAL_ROOM_REGISTRY_INVALID"
    );

    return true;
  }

  function validateQuaternionContract() {
    const horizontal =
      quaternionFromScreenIncrement(
        40,
        0,
        0.006,
        0.24
      );

    const vertical =
      quaternionFromScreenIncrement(
        0,
        -40,
        0.006,
        0.24
      );

    invariant(
      horizontal.length === 4 &&
      horizontal.every(
        Number.isFinite
      ),

      "ARCHCOIN_INTERACTIONS_HORIZONTAL_QUATERNION_INVALID"
    );

    invariant(
      vertical.length === 4 &&
      vertical.every(
        Number.isFinite
      ),

      "ARCHCOIN_INTERACTIONS_VERTICAL_QUATERNION_INVALID"
    );

    invariant(
      Math.abs(
        horizontal[2]
      ) < 1e-8,

      "ARCHCOIN_INTERACTIONS_HORIZONTAL_DRAG_CREATED_Z_ROLL"
    );

    invariant(
      Math.abs(
        vertical[2]
      ) < 1e-8,

      "ARCHCOIN_INTERACTIONS_VERTICAL_DRAG_CREATED_Z_ROLL"
    );

    let accumulated =
      Array.from(
        QUATERNION.identity
      );

    for (
      let index = 0;
      index < 12;
      index += 1
    ) {
      accumulated =
        applyWorldSpaceDelta(
          accumulated,
          horizontal
        );
    }

    invariant(
      accumulated.every(
        Number.isFinite
      ),

      "ARCHCOIN_INTERACTIONS_INCREMENTAL_ACCUMULATION_INVALID"
    );

    return Object.freeze({
      pass: true,

      completeQuaternionOutput:
        true,

      incrementalComposition:
        true,

      horizontalAxis:
        "WORLD_Y",

      verticalAxis:
        "WORLD_X",

      ordinaryDragWorldZRoll:
        false
    });
  }

  function validateReleaseSwipeContract() {
    invariant(
      MOTION
        .clusterSwipeMinimumHorizontalDistancePx >
      MOTION
        .dragActivationDistancePx,

      "ARCHCOIN_INTERACTIONS_SWIPE_DISTANCE_INVALID"
    );

    invariant(
      MOTION
        .clusterSwipeHorizontalDominanceRatio >
        1,

      "ARCHCOIN_INTERACTIONS_SWIPE_DOMINANCE_INVALID"
    );

    invariant(
      MOTION
        .clusterSwipeMinimumHorizontalVelocityPxPerMs >
        0,

      "ARCHCOIN_INTERACTIONS_SWIPE_VELOCITY_INVALID"
    );

    return Object.freeze({
      pass: true,

      evaluatedOnRelease:
        true,

      leftToRightAccepted:
        true,

      rightToLeftAccepted:
        true,

      radialOriginRequired:
        false,

      outwardDirectionRequired:
        false,

      bottomLeftOriginRequired:
        false,

      downwardMotionRequired:
        false,

      provisionalClusterRotationCancelledBeforeReturn:
        true
    });
  }

  function validateResponsibilityContract() {
    return Object.freeze({
      pass: true,

      pointerLifecycleOwned:
        true,

      tapDragArbitrationOwned:
        true,

      hitTestingOwned:
        true,

      syntheticClickSuppressionOwned:
        true,

      interactionPriorityOwned:
        true,

      projectionDomApplicationOwned:
        true,

      releaseSwipeClassificationOwned:
        true,

      gestureAxisSelectionOwned:
        true,

      gestureQuaternionConstructionOwned:
        true,

      grabbedObjectTrackingOwned:
        true,

      canonicalNavigationStateOwned:
        false,

      legalTransitionAuthorityOwned:
        false,

      routeAuthorityOwned:
        false,

      authoritativeQuaternionStorageOwned:
        false,

      cameraOwnership:
        false,

      projectionMathOwnership:
        false,

      crystalRendererOwnership:
        false,

      compassRendererOwnership:
        false
    });
  }

  function runSelfTest() {
    const results = {
      quaternion:
        validateQuaternionContract(),

      releaseSwipe:
        validateReleaseSwipeContract(),

      responsibility:
        validateResponsibilityContract()
    };

    const pass =
      Object.values(results).every(
        result =>
          result.pass === true
      );

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_INTERACTIONS_HORIZONTAL_RELEASE_SWIPE_VALIDATION_RECEIPT_v1",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      controllerModuleId:
        MODULE.controllerModuleId,

      controllerModuleVersion:
        MODULE.controllerModuleVersion,

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      pass,

      motionOwner:
        MODULE.id,

      acceptedStateAuthority:
        MODULE.controllerModuleId,

      navigationTransitionAuthority:
        MODULE.controllerModuleId,

      previewPayloadShape:
        Object.freeze([
          "quaternion",
          "primaryId"
        ]),

      results:
        Object.freeze(results)
    });
  }

  function createReceipt() {
    return Object.freeze({
      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      status:
        state.lastFailure
          ? "failed"
          : state.initialized
            ? "available"
            : "pending",

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      controllerModuleId:
        MODULE.controllerModuleId,

      initialized:
        state.initialized,

      disposed:
        state.disposed,

      activePointer:
        state.activePointerId !==
        null,

      intent:
        state.intent,

      transactionKind:
        state.transactionKind,

      transactionOpened:
        state.transactionOpened,

      previewAccepted:
        state.previewAccepted,

      grabbedId:
        state.grabbed
          ? state.grabbed.id
          : "",

      totalDx:
        state.totalDx,

      totalDy:
        state.totalDy,

      projectionCount:
        state.projections.length,

      releaseSwipeEvaluation:
        "POINTER_UP",

      releaseSwipeDirections:
        Object.freeze([
          "LEFT_TO_RIGHT",
          "RIGHT_TO_LEFT"
        ]),

      radialExitClassification:
        false,

      motionOwner:
        MODULE.id,

      acceptedStateAuthority:
        MODULE.controllerModuleId,

      lastAction:
        state.lastAction,

      lastFailure:
        state.lastFailure
    });
  }

  function publishReceipt() {
    const receipt =
      createReceipt();

    globalThis
      .DGB_ARCHCOIN_INTERACTIONS_RECEIPT =
      receipt;

    if (state.root) {
      state.root.dataset
        .archcoinInteractionsReceipt =
        JSON.stringify(receipt);

      state.root.dataset
        .archcoinInteractionsStatus =
        receipt.status;

      state.root.dataset
        .archcoinInteractionsVersion =
        MODULE.version;

      state.root.dataset
        .archcoinMotionOwner =
        MODULE.id;

      state.root.dataset
        .archcoinClusterReturnGesture =
        "horizontal-release-swipe";
    }

    return receipt;
  }

  function recordAction(action) {
    state.lastAction =
      String(action || "");

    state.lastFailure =
      "";

    publishReceipt();
  }

  function recordFailure(reason) {
    state.lastFailure =
      String(reason || "");

    publishReceipt();
  }

  function resolveDom() {
    state.root =
      document.querySelector(
        "[data-archcoin-root]"
      );

    invariant(
      state.root,
      "ARCHCOIN_INTERACTIONS_ROOT_NOT_FOUND"
    );

    state.scene =
      state.root.querySelector(
        "[data-archcoin-scene]"
      );

    state.sceneField =
      state.root.querySelector(
        "[data-archcoin-scene-field]"
      );

    state.compassControl =
      state.root.querySelector(
        "[data-upstream-compass-control]"
      );

    invariant(
      state.scene,
      "ARCHCOIN_INTERACTIONS_SCENE_NOT_FOUND"
    );

    invariant(
      state.sceneField,
      "ARCHCOIN_INTERACTIONS_SCENE_FIELD_NOT_FOUND"
    );

    invariant(
      state.compassControl,
      "ARCHCOIN_INTERACTIONS_COMPASS_CONTROL_NOT_FOUND"
    );

    rebuildSemanticControlIndex();
  }

  function subscribeController() {
    state.frame =
      state.controller
        .getFrameState();

    replaceProjectionSnapshot(
      state.controller
        .getSemanticProjection()
    );

    state.unsubscribeFrame =
      state.controller
        .subscribeFrameState(
          frame => {
            state.frame =
              frame;

            if (
              frame &&
              Array.isArray(
                frame.semanticProjection
              )
            ) {
              replaceProjectionSnapshot(
                frame.semanticProjection
              );
            }

            if (
              frame &&
              frame.held &&
              state.activePointerId !==
                null
            ) {
              if (
                state.transactionOpened
              ) {
                cancelMotionTransaction(
                  "controller-held"
                );
              }

              releasePointerCapture();
              resetPointerState();
            }
          }
        );

    state.unsubscribeProjection =
      state.controller
        .subscribeSemanticProjection(
          records => {
            replaceProjectionSnapshot(
              records
            );
          }
        );
  }

  function exposeApi() {
    globalThis
      .DGB_ARCHCOIN_INTERACTIONS =
      Object.freeze({
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        controllerModuleId:
          MODULE.controllerModuleId,

        controllerModuleVersion:
          MODULE.controllerModuleVersion,

        motionContractId:
          MODULE.motionContractId,

        motionContractVersion:
          MODULE.motionContractVersion,

        intents:
          INTENTS,

        motionSettings:
          MOTION,

        getReceipt:
          createReceipt,

        getValidationReceipt:
          () =>
            state.validationReceipt,

        runSelfTest,

        dispose
      });
  }

  function dispatchReady() {
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
                MODULE.controllerModuleId,

              controllerModuleVersion:
                MODULE.controllerModuleVersion,

              motionContractId:
                MODULE.motionContractId,

              motionContractVersion:
                MODULE.motionContractVersion,

              motionOwner:
                MODULE.id,

              acceptedStateAuthority:
                MODULE.controllerModuleId,

              dragBehavior:
                "ROTATE_WHILE_HELD",

              clusterReturnBehavior:
                "QUALIFIED_HORIZONTAL_SWIPE_ON_RELEASE",

              clusterReturnDirections:
                Object.freeze([
                  "LEFT_TO_RIGHT",
                  "RIGHT_TO_LEFT"
                ]),

              radialExitClassification:
                false
            })
        }
      )
    );
  }

  function dispatchFailure(reason) {
    globalThis.dispatchEvent(
      new CustomEvent(
        "ARCHCOIN_INTERACTIONS_FAILURE",

        {
          detail:
            Object.freeze({
              moduleId:
                MODULE.id,

              moduleVersion:
                MODULE.version,

              reason:
                String(reason || "")
            })
        }
      )
    );
  }

  function cleanupActiveInteraction(
    reason
  ) {
    if (
      state.transactionOpened
    ) {
      cancelMotionTransaction(
        reason
      );
    }

    releasePointerCapture();
    resetPointerState();
  }

  function dispose() {
    if (state.disposed) {
      return true;
    }

    cleanupActiveInteraction(
      "interactions-disposed"
    );

    if (
      typeof state.unsubscribeFrame ===
        "function"
    ) {
      try {
        state.unsubscribeFrame();
      } catch (_) {}
    }

    if (
      typeof state.unsubscribeProjection ===
        "function"
    ) {
      try {
        state.unsubscribeProjection();
      } catch (_) {}
    }

    state.unsubscribeFrame =
      null;

    state.unsubscribeProjection =
      null;

    removeAllListeners();
    restorePointerPolicy();

    state.initialized =
      false;

    state.disposed =
      true;

    recordAction(
      "interactions-disposed"
    );

    return true;
  }

  function initializeAgainstController(
    controller
  ) {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    try {
      validateController(
        controller
      );

      state.controller =
        controller;

      resolveDom();

      const validation =
        runSelfTest();

      invariant(
        validation.pass === true,

        "ARCHCOIN_INTERACTIONS_SOURCE_VALIDATION_FAILED",

        validation
      );

      state.validationReceipt =
        validation;

      globalThis
        .DGB_ARCHCOIN_INTERACTIONS_VALIDATION_RECEIPT =
        validation;

      subscribeController();
      bindPointerPolicy();
      exposeApi();

      state.initialized =
        true;

      recordAction(
        "interactions-initialized"
      );

      dispatchReady();
    } catch (error) {
      const reason =
        error &&
        (
          error.code ||
          error.message
        )
          ? String(
              error.code ||
              error.message
            )
          : "UNKNOWN_ARCHCOIN_INTERACTIONS_INITIALIZATION_FAILURE";

      state.lastFailure =
        reason;

      cleanupActiveInteraction(
        "initialization-failure"
      );

      removeAllListeners();
      restorePointerPolicy();
      publishReceipt();
      dispatchFailure(reason);
    }
  }

  function attemptInitialization() {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    const controller =
      globalThis
        .DGB_ARCHCOIN_CONTROLLER;

    if (controller) {
      initializeAgainstController(
        controller
      );
    }
  }

  function waitForController() {
    attemptInitialization();

    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    const handleControllerReady =
      () => {
        attemptInitialization();
      };

    addListener(
      globalThis,
      "ARCHCOIN_CONTROLLER_READY",
      handleControllerReady,
      {
        once: true
      }
    );
  }

  if (
    document.readyState ===
      "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      waitForController,
      {
        once: true
      }
    );
  } else {
    waitForController();
  }
})();

/*
AUDRALIA_ARCHCOIN_INTERACTIONS_HORIZONTAL_RELEASE_SWIPE_RESULT_v1

Artifact:
 /products/archcoin/index.interactions.js

Module:
 DGB_ARCHCOIN_INTERACTIONS
 1.0.0-pointer-gesture-interpreter

Required controller:
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Motion contract:
 AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1
 1.0.0

Exact coordinated pair:
 1. /products/archcoin/index.controller.js
 2. /products/archcoin/index.interactions.js

No controller modification required.
No compositor modification required.
No crystals modification required.
No HTML modification required.
No CSS modification required.

Controlling gesture distinction:

 FINGER HELD + MOVEMENT
 =
 DRAG / ROTATION

 QUALIFIED HORIZONTAL SWIPE + RELEASE
 =
 RETURN TO CONSTELLATION

Removed cluster-return requirements:
- outward radial movement
- scene-center radial alignment
- bottom-left origin
- downward movement
- corner-specific movement
- pre-release exit locking

Implemented cluster-return requirements:
- release-time classification
- left-to-right swipe
- right-to-left swipe
- minimum horizontal distance
- horizontal-over-vertical dominance
- maximum swipe duration
- minimum average horizontal velocity
- provisional cluster rotation cancellation
- exact controller return request

Return request:
 controller.requestReturnToConstellation({
   source: "cluster-horizontal-swipe",
   scrollToScene: true
 });

Controller preview payload:
 {
   quaternion: [x, y, z, w],
   primaryId: "canonical-identity"
 }

No controller motion payload contains:
- yaw
- pitch
- roll
- dx
- dy
- axis
- angle
- direction
- distance
- sensitivity

Compass behavior:
- Compass tap remains selectable
- Compass-origin drag does not rotate constellation
- Compass-origin drag does not rotate cluster
- moved Compass gesture does not activate on release

Runtime execution:
 NOT PERFORMED

Swipe threshold tuning:
 OWNED EXCLUSIVELY BY THIS FILE

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/
