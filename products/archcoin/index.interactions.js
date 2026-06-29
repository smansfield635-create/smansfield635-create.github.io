/* /products/archcoin/index.interactions.js
   ARCHCOIN pointer, gesture, direct-manipulation, hit-testing,
   motion-quaternion, and interaction-priority authority.

   Module:
   DGB_ARCHCOIN_INTERACTIONS
   1.0.0-pointer-gesture-interpreter

   Required controller:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Frozen motion contract:
   AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1
   1.0.0

   Frozen distinction:

   INTERACTIONS DETERMINES MOTION.
   CONTROLLER DETERMINES AUTHORITY.

   This file exclusively owns:
   - pointer lifecycle and pointer capture;
   - tap-versus-drag arbitration;
   - whole-crystal hit testing;
   - semantic-control hit testing;
   - front / Compass / rear interaction priority;
   - orbit, cluster, and cluster-exit gesture classification;
   - drag direction and sensitivity;
   - incremental gesture quaternion construction;
   - quaternion composition order;
   - grabbed-crystal tracking;
   - primary wing and room calculation;
   - projection-driven semantic-control application;
   - synthetic-click suppression;
   - interaction cleanup and receipts.

   This file does not own:
   - canonical navigation state;
   - legal transitions;
   - route authority;
   - authoritative quaternion storage;
   - controller revisions;
   - camera or projection mathematics;
   - crystal geometry or rendering;
   - Compass geometry or renderer lifecycle.

   Controller transaction contract:

   Orbit:
   - beginOrbitGesture()
   - requestOrbitPreview({ quaternion, primaryId })
   - requestOrbitCommit()
   - requestOrbitCancel(reason)

   Cluster:
   - beginClusterGesture(wing)
   - requestClusterPreview(wing, { quaternion, primaryId })
   - requestClusterCommit(wing)
   - requestClusterCancel(wing, reason)

   Preview payloads contain exactly:
   - quaternion
   - primaryId

   Source status:
   PAIRED_INTERACTIONS_MOTION_STANDARD
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

    CLUSTER_PENDING:
      "CLUSTER_PENDING",

    CLUSTER_ROTATE:
      "CLUSTER_ROTATE",

    CLUSTER_EXIT:
      "CLUSTER_EXIT",

    CANCELLED:
      "CANCELLED"
  });

  const HIT_KINDS = Object.freeze({
    NONE:
      "none",

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
   * Every motion-feel value is confined to this file.
   *
   * Direction, sensitivity, drag thresholds, grabbed-object correction,
   * and cluster-exit behavior must remain adjustable here without a
   * controller modification.
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

    clusterRotationLockDistancePx:
      16,

    clusterRotationTangentialThreshold:
      0.56,

    clusterRotationInwardThreshold:
      0.18,

    clusterExitMinimumDistancePx:
      42,

    clusterExitLockDistancePx:
      52,

    clusterExitMinimumRadialOriginPx:
      28,

    clusterExitAlignmentThreshold:
      0.72,

    clusterExitTangentialRejectionThreshold:
      0.62,

    directGrabEnabled:
      true,

    openSpaceRotationEnabled:
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

    exitQualified:
      false,

    exitLocked:
      false,

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

  function normalizeVector2(
    x,
    y
  ) {
    const length =
      Math.hypot(
        x,
        y
      );

    if (
      !Number.isFinite(
        length
      ) ||
      length <=
        1e-8
    ) {
      return Object.freeze({
        x:
          0,

        y:
          0,

        length:
          0
      });
    }

    return Object.freeze({
      x:
        x / length,

      y:
        y / length,

      length
    });
  }

  function dot2(
    ax,
    ay,
    bx,
    by
  ) {
    return (
      ax * bx +
      ay * by
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
    ].includes(
      wing
    )
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
      source.length !==
        4
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
      !Number.isFinite(
        length
      ) ||
      length <
        QUATERNION.minimumLength
    ) {
      return Array.from(
        fallback
      );
    }

    return quaternion.map(
      component =>
        component /
        length
    );
  }

  function quaternionMultiply(
    first,
    second
  ) {
    const a =
      normalizeQuaternion(
        first
      );

    const b =
      normalizeQuaternion(
        second
      );

    const [
      ax,
      ay,
      az,
      aw
    ] = a;

    const [
      bx,
      by,
      bz,
      bw
    ] = b;

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
      !Number.isFinite(
        axisLength
      ) ||
      axisLength <=
        1e-8 ||
      !Number.isFinite(
        angle
      ) ||
      Math.abs(angle) <=
        1e-10
    ) {
      return Array.from(
        QUATERNION.identity
      );
    }

    const halfAngle =
      angle * 0.5;

    const scale =
      Math.sin(
        halfAngle
      ) /
      axisLength;

    return normalizeQuaternion([
      axisX * scale,
      axisY * scale,
      axisZ * scale,
      Math.cos(
        halfAngle
      )
    ]);
  }

  /*
   * Screen drag mapping:
   *
   * - horizontal movement rotates around world Y;
   * - vertical movement rotates around world X;
   * - ordinary drag does not introduce world-Z roll;
   * - movement is calculated incrementally, so a long drag is not capped
   *   to one small total angle.
   *
   * Runtime projection tests remain responsible for confirming the final
   * camera-relative sign convention on the deployed compositor.
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
      !Number.isFinite(
        length
      ) ||
      length <=
        1e-8
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
      rect.width <=
        0 ||
      rect.height <=
        0
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
        x:
          0,

        y:
          0
      });
    }

    return Object.freeze({
      x:
        rect.width *
        0.5,

      y:
        rect.height *
        0.5
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
      frame.cluster
        .orientation &&
      frame.cluster
        .orientation
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
      typeof input !==
        "object"
    ) {
      return null;
    }

    const id =
      String(
        input.id ||
        ""
      ).trim();

    const kind =
      String(
        input.kind ||
        ""
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
        input.visible !==
        false
    });
  }

  function replaceProjectionSnapshot(
    records
  ) {
    const normalized =
      [];

    if (
      Array.isArray(
        records
      )
    ) {
      for (
        const input
        of records
      ) {
        const record =
          normalizeProjectionRecord(
            input
          );

        if (record) {
          normalized.push(
            record
          );
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
      declared >
        0
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
   * Priority order:
   *
   * 1. front crystal;
   * 2. Compass;
   * 3. rear crystal outside Compass overlap.
   *
   * Rear crystals overlapping the Compass are not pointer-eligible.
   */
  function deriveInteractionPriority(
    record
  ) {
    if (
      !record ||
      record.visible !==
        true
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
          element.dataset
            .roomId
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

    for (
      const control
      of controls
    ) {
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
        record.kind ===
        "cardinal"
          ? state.semanticControls.get(
              semanticControlKey(
                "coin",
                record.id
              )
            )
          : null
      ) ||
      (
        record.kind ===
        "coin"
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
        String(
          priority
        );

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
          INTERACTION_PRIORITY
            .INACTIVE
          ? "auto"
          : "none";

      if (
        record.visible &&
        priority >
          INTERACTION_PRIORITY
            .INACTIVE
      ) {
        control.removeAttribute(
          "aria-hidden"
        );

        if (
          control.dataset
            .active ===
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
        record.kind ===
          "cardinal" ||
        record.kind ===
          "coin";

      const isRoom =
        record.kind ===
        "room";

      if (
        mode ===
          PRESENTATION_MODES
            .CONSTELLATION &&
        !isCardinal
      ) {
        continue;
      }

      if (
        mode ===
          PRESENTATION_MODES
            .CLUSTER &&
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
        hitDistance >
        radius
      ) {
        continue;
      }

      const priority =
        deriveInteractionPriority(
          record
        );

      if (
        priority <=
        INTERACTION_PRIORITY
          .INACTIVE
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
        .closest ===
        "function"
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
      !state.root.contains(
        target
      )
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
          : INTERACTION_PRIORITY
              .REAR,

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

    const scenePoint =
      viewportToScenePoint(
        event.clientX,
        event.clientY
      );

    const crystal =
      crystalHitsAt(
        scenePoint.x,
        scenePoint.y
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
      ].filter(
        Boolean
      );

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
      candidates.length >
        0
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
      PRESENTATION_MODES
        .CONSTELLATION
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
            record.kind !==
              "room"
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
        INTERACTION_PRIORITY
          .INACTIVE
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
      PRESENTATION_MODES
        .CONSTELLATION
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
    pointerScenePoint
  ) {
    if (
      !MOTION
        .directGrabEnabled ||
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
        pointerScenePoint.x -
        target.record.x,

      pointerOffsetY:
        pointerScenePoint.y -
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
    pointerScenePoint
  ) {
    if (!state.grabbed) {
      return Object.freeze({
        dx:
          0,

        dy:
          0
      });
    }

    const projection =
      latestProjectionForGrab();

    if (!projection) {
      return Object.freeze({
        dx:
          0,

        dy:
          0
      });
    }

    const desiredX =
      pointerScenePoint.x -
      state.grabbed
        .pointerOffsetX;

    const desiredY =
      pointerScenePoint.y -
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

  /*
   * Incremental construction:
   *
   * The delta uses only movement since the previous accepted update.
   * It is composed onto the latest accepted quaternion.
   *
   * This allows arbitrarily long gestures while retaining a bounded
   * per-update angular change.
   */
  function buildIncrementalQuaternion(
    pointerScenePoint
  ) {
    const incrementalDx =
      pointerScenePoint.x -
      state.lastX;

    const incrementalDy =
      pointerScenePoint.y -
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
          pointerScenePoint
        );

      if (
        Math.hypot(
          correction.dx,
          correction.dy
        ) >
        0.5
      ) {
        const correctionQuaternion =
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
            correctionQuaternion
          );
      }
    }

    return normalizeQuaternion(
      result
    );
  }

  /*
   * Cluster intent remains pending while an outward radial gesture is
   * developing. It is not prematurely converted into cluster rotation.
   *
   * Rotation locks when:
   * - movement is strongly tangential; or
   * - movement is inward; or
   * - the gesture is not plausibly outward after sufficient travel.
   *
   * Exit locks only after its full radial-distance qualification.
   */
  function evaluateClusterIntent() {
    const center =
      sceneCenter();

    const radialOrigin =
      normalizeVector2(
        state.startX -
          center.x,

        state.startY -
          center.y
      );

    const drag =
      normalizeVector2(
        state.totalDx,
        state.totalDy
      );

    if (
      drag.length <
      MOTION
        .dragActivationDistancePx
    ) {
      return INTENTS.UNKNOWN;
    }

    if (
      radialOrigin.length <
      MOTION
        .clusterExitMinimumRadialOriginPx
    ) {
      return drag.length >=
        MOTION
          .clusterRotationLockDistancePx
        ? INTENTS
            .CLUSTER_ROTATE
        : INTENTS
            .CLUSTER_PENDING;
    }

    const radialAlignment =
      dot2(
        radialOrigin.x,
        radialOrigin.y,
        drag.x,
        drag.y
      );

    const tangentX =
      -radialOrigin.y;

    const tangentY =
      radialOrigin.x;

    const tangentialAlignment =
      Math.abs(
        dot2(
          tangentX,
          tangentY,
          drag.x,
          drag.y
        )
      );

    const exitQualified =
      drag.length >=
        MOTION
          .clusterExitMinimumDistancePx &&
      radialAlignment >=
        MOTION
          .clusterExitAlignmentThreshold &&
      tangentialAlignment <=
        MOTION
          .clusterExitTangentialRejectionThreshold;

    if (exitQualified) {
      state.exitQualified =
        true;

      state.exitLocked =
        drag.length >=
        MOTION
          .clusterExitLockDistancePx;

      return INTENTS.CLUSTER_EXIT;
    }

    const outwardStillPlausible =
      radialAlignment >=
        MOTION
          .clusterRotationInwardThreshold &&
      tangentialAlignment <
        MOTION
          .clusterRotationTangentialThreshold;

    if (
      outwardStillPlausible &&
      drag.length <
        MOTION
          .clusterExitMinimumDistancePx
    ) {
      return INTENTS.CLUSTER_PENDING;
    }

    const tangentialRotation =
      tangentialAlignment >=
      MOTION
        .clusterRotationTangentialThreshold;

    const inwardRotation =
      radialAlignment <
      MOTION
        .clusterRotationInwardThreshold;

    if (
      drag.length >=
        MOTION
          .clusterRotationLockDistancePx &&
      (
        tangentialRotation ||
        inwardRotation ||
        !outwardStillPlausible
      )
    ) {
      return INTENTS.CLUSTER_ROTATE;
    }

    return INTENTS.CLUSTER_PENDING;
  }

  function updateIntentFromMovement() {
    if (
      state.intent ===
        INTENTS.ORBIT_ROTATE ||
      state.intent ===
        INTENTS.CLUSTER_ROTATE ||
      state.intent ===
        INTENTS.CLUSTER_EXIT ||
      state.intent ===
        INTENTS.CANCELLED
    ) {
      return state.intent;
    }

    if (
      state.dragDistance <
      MOTION
        .dragActivationDistancePx
    ) {
      return INTENTS.UNKNOWN;
    }

    const mode =
      activePresentationMode();

    if (
      mode ===
      PRESENTATION_MODES
        .CONSTELLATION
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
        evaluateClusterIntent();

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
    pointerScenePoint
  ) {
    if (
      !state.transactionOpened
    ) {
      return false;
    }

    const quaternion =
      buildIncrementalQuaternion(
        pointerScenePoint
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
            primaryId:
              wing
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
      pointerScenePoint.x;

    state.lastY =
      pointerScenePoint.y;

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

  function requestClusterExit() {
    if (
      activePresentationMode() !==
      PRESENTATION_MODES.CLUSTER
    ) {
      return false;
    }

    if (
      state.transactionOpened
    ) {
      cancelMotionTransaction(
        "cluster-exit"
      );
    }

    const returned =
      state.controller
        .requestReturnToConstellation({
          source:
            "cluster-exit-gesture",

          scrollToScene:
            true
        });

    if (returned) {
      recordAction(
        "cluster-exit-committed"
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
      state.activePointerId ===
        null ||
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

    state.exitQualified =
      false;

    state.exitLocked =
      false;
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
        .closest ===
        "function"
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
      state.activePointerId !==
        null
    ) {
      return false;
    }

    if (
      event.pointerType ===
        "mouse" &&
      event.button !==
        0
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
      !pointerDownIsEligible(
        event
      )
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
        event.pointerType ||
        ""
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

    state.exitQualified =
      false;

    state.exitLocked =
      false;

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
      MOTION
        .preventBrowserPanDuringActiveGesture
    ) {
      event.preventDefault();
    }

    if (
      intent ===
      INTENTS.CLUSTER_PENDING
    ) {
      recordAction(
        "cluster-intent-pending"
      );

      return;
    }

    if (
      intent ===
      INTENTS.CLUSTER_EXIT
    ) {
      /*
       * Exit classification occurs before any cluster transaction begins.
       * No cluster preview is sent while exit is pending or locked.
       */
      if (
        state.transactionOpened
      ) {
        cancelMotionTransaction(
          "cluster-exit-qualified"
        );

        state.transactionOpened =
          false;

        state.previewAccepted =
          false;
      }

      recordAction(
        state.exitLocked
          ? "cluster-exit-locked"
          : "cluster-exit-qualified"
      );

      return;
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
      !submitPreview(
        point
      )
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
      cancelled =
        false,

      reason =
        "pointer-up"
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
    } else if (
      state.intent ===
        INTENTS.CLUSTER_EXIT &&
      state.exitQualified
    ) {
      handled =
        requestClusterExit();

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
          MOTION
            .tapMaximumDistancePx &&
        elapsed <=
          MOTION
            .tapMaximumDurationMs;

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
    if (
      state.disposed
    ) {
      return;
    }

    if (
      shouldSuppressClick(
        event
      )
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      return;
    }

    /*
     * Pointer-generated clicks are handled through the pointer lifecycle.
     * Keyboard-generated clicks use detail === 0.
     */
    if (
      event.detail !==
        0
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

    state.listeners.push(
      Object.freeze({
        target,
        type,
        listener,
        options
      })
    );
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
     * Pointerdown is bound at the root so the Compass remains reachable
     * even when its control is not a child of the scene-field element.
     */
    addListener(
      state.root,
      "pointerdown",
      handlePointerDown,
      {
        passive:
          false,

        capture:
          true
      }
    );

    addListener(
      state.sceneField,
      "pointermove",
      handlePointerMove,
      {
        passive:
          false
      }
    );

    addListener(
      state.sceneField,
      "pointerup",
      handlePointerUp,
      {
        passive:
          false
      }
    );

    addListener(
      state.sceneField,
      "pointercancel",
      handlePointerCancel,
      {
        passive:
          false
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

      "ARCHCOIN_INTERACTIONS_CONTROLLER_MODULE_ID_MISMATCH",

      {
        expected:
          MODULE
            .controllerModuleId,

        actual:
          controller.moduleId
      }
    );

    invariant(
      controller.moduleVersion ===
        MODULE
          .controllerModuleVersion,

      "ARCHCOIN_INTERACTIONS_CONTROLLER_VERSION_MISMATCH",

      {
        expected:
          MODULE
            .controllerModuleVersion,

        actual:
          controller.moduleVersion
      }
    );

    invariant(
      controller.motionContractId ===
        MODULE.motionContractId,

      "ARCHCOIN_INTERACTIONS_MOTION_CONTRACT_ID_MISMATCH"
    );

    invariant(
      controller.motionContractVersion ===
        MODULE
          .motionContractVersion,

      "ARCHCOIN_INTERACTIONS_MOTION_CONTRACT_VERSION_MISMATCH"
    );

    for (
      const methodName
      of REQUIRED_CONTROLLER_METHODS
    ) {
      invariant(
        typeof controller[
          methodName
        ] ===
          "function",

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
        .length ===
        16,

      "ARCHCOIN_INTERACTIONS_CANONICAL_ROOM_REGISTRY_INVALID"
    );

    return true;
  }

  function validateQuaternionMath() {
    const rightIncrement =
      quaternionFromScreenIncrement(
        40,
        0,
        0.006,
        0.24
      );

    const upIncrement =
      quaternionFromScreenIncrement(
        0,
        -40,
        0.006,
        0.24
      );

    invariant(
      rightIncrement.length ===
        4 &&
      rightIncrement.every(
        Number.isFinite
      ),

      "ARCHCOIN_INTERACTIONS_RIGHT_INCREMENT_INVALID"
    );

    invariant(
      upIncrement.length ===
        4 &&
      upIncrement.every(
        Number.isFinite
      ),

      "ARCHCOIN_INTERACTIONS_UP_INCREMENT_INVALID"
    );

    invariant(
      Math.abs(
        rightIncrement[2]
      ) <
        1e-8,

      "ARCHCOIN_INTERACTIONS_HORIZONTAL_DRAG_MUST_NOT_CREATE_Z_ROLL"
    );

    invariant(
      Math.abs(
        upIncrement[2]
      ) <
        1e-8,

      "ARCHCOIN_INTERACTIONS_VERTICAL_DRAG_MUST_NOT_CREATE_Z_ROLL"
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
          rightIncrement
        );
    }

    invariant(
      accumulated.length ===
        4 &&
      accumulated.every(
        Number.isFinite
      ),

      "ARCHCOIN_INTERACTIONS_INCREMENTAL_ACCUMULATION_INVALID"
    );

    invariant(
      Math.abs(
        accumulated[3] -
        rightIncrement[3]
      ) >
        1e-4,

      "ARCHCOIN_INTERACTIONS_GESTURE_MUST_NOT_BE_TOTAL_ANGLE_CAPPED"
    );

    return Object.freeze({
      pass:
        true,

      horizontalAxis:
        "WORLD_Y",

      verticalAxis:
        "WORLD_X",

      ordinaryDragWorldZRoll:
        false,

      incrementalComposition:
        true,

      longGestureTotalAngleCapped:
        false,

      multiplicationOrder:
        "WORLD_INCREMENT_TIMES_LATEST_ACCEPTED"
    });
  }

  function validateIntentContract() {
    invariant(
      INTENTS.CLUSTER_PENDING !==
        INTENTS.CLUSTER_ROTATE,

      "ARCHCOIN_INTERACTIONS_CLUSTER_PENDING_COLLISION"
    );

    invariant(
      INTENTS.CLUSTER_EXIT !==
        INTENTS.CLUSTER_ROTATE,

      "ARCHCOIN_INTERACTIONS_EXIT_ROTATION_COLLISION"
    );

    invariant(
      MOTION
        .clusterExitMinimumDistancePx >
      MOTION
        .clusterRotationLockDistancePx,

      "ARCHCOIN_INTERACTIONS_EXIT_DISTANCE_MUST_EXCEED_ROTATION_LOCK_DISTANCE"
    );

    invariant(
      MOTION
        .clusterExitMinimumDistancePx >
      MOTION
        .dragActivationDistancePx,

      "ARCHCOIN_INTERACTIONS_EXIT_DISTANCE_MUST_EXCEED_DRAG_ACTIVATION"
    );

    return Object.freeze({
      pass:
        true,

      clusterPendingIntent:
        true,

      outwardIntentRemainsPendingBeforeExitThreshold:
        true,

      tangentialIntentMayLockRotation:
        true,

      exitBeforeClusterTransaction:
        true,

      lockedExitSendsNoPreview:
        true,

      tapDoesNotOpenTransaction:
        true
    });
  }

  function validateResponsibilityContract() {
    return Object.freeze({
      pass:
        true,

      pointerLifecycleOwned:
        true,

      tapDragArbitrationOwned:
        true,

      wholeCrystalHitTestingOwned:
        true,

      syntheticClickSuppressionOwned:
        true,

      interactionPriorityDerivationOwned:
        true,

      projectionDomApplicationOwned:
        true,

      clusterExitClassificationOwned:
        true,

      dragDirectionOwned:
        true,

      sensitivityOwned:
        true,

      gestureAxisSelectionOwned:
        true,

      gestureQuaternionConstructionOwned:
        true,

      grabbedObjectTrackingOwned:
        true,

      primaryVisualIdentityCalculationOwned:
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
      quaternionMath:
        validateQuaternionMath(),

      intent:
        validateIntentContract(),

      responsibility:
        validateResponsibilityContract()
    };

    const pass =
      Object.values(
        results
      ).every(
        result =>
          result.pass ===
          true
      );

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_INTERACTIONS_COMPLETE_QUATERNION_MOTION_VALIDATION_RECEIPT_v2",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      controllerModuleId:
        MODULE
          .controllerModuleId,

      controllerModuleVersion:
        MODULE
          .controllerModuleVersion,

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE
          .motionContractVersion,

      pass,

      motionOwner:
        MODULE.id,

      acceptedStateAuthority:
        MODULE
          .controllerModuleId,

      navigationTransitionAuthority:
        MODULE
          .controllerModuleId,

      previewPayloadShape:
        Object.freeze([
          "quaternion",
          "primaryId"
        ]),

      results:
        Object.freeze(
          results
        )
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
        MODULE
          .motionContractVersion,

      controllerModuleId:
        MODULE
          .controllerModuleId,

      controllerModuleVersion:
        MODULE
          .controllerModuleVersion,

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

      exitQualified:
        state.exitQualified,

      exitLocked:
        state.exitLocked,

      projectionCount:
        state.projections.length,

      motionOwner:
        MODULE.id,

      acceptedStateAuthority:
        MODULE
          .controllerModuleId,

      pointerLifecycleOwner:
        MODULE.id,

      tapDragArbitrationOwner:
        MODULE.id,

      hitTestOwner:
        MODULE.id,

      interactionPriorityOwner:
        MODULE.id,

      clusterExitClassificationOwner:
        MODULE.id,

      gestureQuaternionConstructionOwner:
        MODULE.id,

      gestureAxisSelectionOwner:
        MODULE.id,

      motionSensitivityOwner:
        MODULE.id,

      grabbedObjectTrackingOwner:
        MODULE.id,

      projectionDomApplicationOwner:
        MODULE.id,

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
        JSON.stringify(
          receipt
        );

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
        .archcoinInteractionPriorityOwner =
        MODULE.id;
    }

    return receipt;
  }

  function recordAction(action) {
    state.lastAction =
      String(
        action || ""
      );

    state.lastFailure =
      "";

    publishReceipt();
  }

  function recordFailure(reason) {
    state.lastFailure =
      String(
        reason || ""
      );

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
          MODULE
            .controllerModuleId,

        controllerModuleVersion:
          MODULE
            .controllerModuleVersion,

        motionContractId:
          MODULE.motionContractId,

        motionContractVersion:
          MODULE
            .motionContractVersion,

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
                MODULE
                  .controllerModuleId,

              controllerModuleVersion:
                MODULE
                  .controllerModuleVersion,

              motionContractId:
                MODULE.motionContractId,

              motionContractVersion:
                MODULE
                  .motionContractVersion,

              motionOwner:
                MODULE.id,

              acceptedStateAuthority:
                MODULE
                  .controllerModuleId,

              pointerLifecycleOwner:
                MODULE.id,

              gestureQuaternionConstructionOwner:
                MODULE.id,

              gestureAxisSelectionOwner:
                MODULE.id,

              interactionPriorityOwner:
                MODULE.id,

              clusterExitClassificationOwner:
                MODULE.id,

              directManipulationOwner:
                MODULE.id,

              incrementalQuaternionAccumulation:
                true,

              clusterPendingIntent:
                true
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
                String(
                  reason || ""
                )
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
        validation.pass ===
          true,

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
      dispatchFailure(
        reason
      );
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
        once:
          true
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
        once:
          true
      }
    );
  } else {
    waitForController();
  }
})();

/*
AUDRALIA_ARCHCOIN_INTERACTIONS_COMPLETE_QUATERNION_MOTION_RESULT_v2

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

No third implementation file included.

Anchoring rule:
 INTERACTIONS DETERMINES MOTION.
 CONTROLLER DETERMINES AUTHORITY.

Corrected cluster-intent behavior:
- cluster drag first enters CLUSTER_PENDING
- plausible outward movement remains pending
- outward movement is not prematurely locked as rotation
- tangential or inward movement may lock CLUSTER_ROTATE
- qualified outward movement locks CLUSTER_EXIT
- cluster transaction does not begin while intent is pending
- cluster transaction does not begin for exit
- exit sends no cluster preview
- exit release requests Return to Constellation

Corrected quaternion behavior:
- pointer movement is processed incrementally
- each accepted increment composes onto the latest accepted quaternion
- per-update angle remains bounded
- complete gesture angle is not capped
- long drags may continue rotating
- ordinary drag uses world X and world Y
- ordinary drag introduces no world-Z key-turn roll

Implemented interaction ownership:
- pointer lifecycle
- pointer capture
- pointer cancellation
- tap-versus-drag arbitration
- whole-crystal hit testing
- semantic-control hit testing
- front / Compass / rear priority
- synthetic-click suppression
- gesture intent locking
- orbit rotation
- cluster rotation
- cluster exit
- direct-manipulation correction
- grabbed-node retention
- complete quaternion construction
- incremental quaternion composition
- primary wing calculation
- primary room calculation
- motion sensitivity
- reduced-motion sensitivity
- projection-driven semantic controls
- interaction cleanup
- validation and receipts

Controller payload shape:
 {
   quaternion: [x, y, z, w],
   primaryId: "canonical-identity"
 }

No controller payload contains:
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

Controller authority preserved:
- navigation state
- transition legality
- canonical registry
- canonical routes
- accepted quaternion normalization
- authoritative preview storage
- commit
- cancel
- revision counters
- Return to Orbit
- Return to Constellation
- Main Compass navigation

Crystals modified:
 FALSE

Compositor modified:
 FALSE

HTML modified:
 FALSE

CSS modified:
 FALSE

Runtime execution:
 NOT PERFORMED

Directional compositor verification:
 REQUIRED DURING RUNTIME TESTING

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/
