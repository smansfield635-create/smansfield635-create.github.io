/* /assets/compass/compass.controller.js
   Diamond Gate Bridge Compass
   Controller authority for constellation state, cluster state, selection,
   panel presentation, spherical orientation commitment, Mirrorland lifecycle,
   navigation, lens tabs, and receipts.

   Full-file replacement scope:
   - Preserve all existing routes, room declarations, cardinal declarations,
     panel behavior, Mirrorland lifecycle, navigation, lens tabs, and receipts.
   - Preserve the four-cardinal spherical constellation contract.
   - Add one independently preserved spherical room-cluster orientation
     for each cardinal wing.
   - Keep orbitFocus distinct from selectedCardinal.
   - Keep primaryRoom distinct from selectedRoom.
   - Support controlled room-cluster drag preview, commitment, cancellation,
     and deterministic room focus.
   - Keep room-cluster manipulation distinct from room selection.
   - Permit a quick flick to invoke requestReturnToConstellation().
   - Do not interpret an ordinary drag release as a return gesture.
   - Preserve constellation and cluster orientations through Mirrorland reveal,
     focus, withdrawal, timeout, and renderer failure.
   - Descend into the page panel after room-star selection.
   - Return the viewport to the Compass scene after Return To Orbit.
   - Keep Return To Orbit distinct from constellation restoration.
   - Restore cardinal or room panel content after Mirrorland withdrawal
     and Mirrorland renderer failure.
   - Keep Back available during Mirrorland reveal and focus.
   - Ensure panelDescended describes an actual page descent rather than
     the mere presence of a selected destination.

   This file does not:
   - Render crystals.
   - Calculate rendered hit targets.
   - Bind pointer gestures.
   - Classify drag velocity.
   - Project spherical geometry.
   - Own Mirrorland geometry.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "DGB_COMPASS_CONTROLLER_SPHERICAL_CONSTELLATION_AND_CLUSTER_REBUILD_v3",

    previousId:
      "DGB_COMPASS_CONTROLLER_SPHERICAL_ORBIT_REBUILD_v2",

    file:
      "/assets/compass/compass.controller.js",

    releaseId:
      "dgb-compass-spherical-clusters-v3",

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const STATES = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER_OPEN:
      "CLUSTER_OPEN",

    ROOM_SELECTED:
      "ROOM_SELECTED",

    MIRRORLAND_REVEALING:
      "MIRRORLAND_REVEALING",

    MIRRORLAND_FOCUSED:
      "MIRRORLAND_FOCUSED",

    MIRRORLAND_WITHDRAWING:
      "MIRRORLAND_WITHDRAWING",

    NAVIGATING:
      "NAVIGATING",

    HELD:
      "HELD"
  });

  const MIRRORLAND_STATES = Object.freeze({
    DORMANT:
      "DORMANT",

    REVEALING:
      "MIRRORLAND_REVEALING",

    FOCUSED:
      "MIRRORLAND_FOCUSED",

    WITHDRAWING:
      "MIRRORLAND_WITHDRAWING",

    HELD:
      "HELD"
  });

  const ORIENTATION_PHASES = Object.freeze({
    IDLE:
      "IDLE",

    PREVIEW:
      "PREVIEW",

    SETTLING:
      "SETTLING",

    COMMITTED:
      "COMMITTED",

    CANCELLED:
      "CANCELLED"
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const LEGACY_ORBIT_SEQUENCE = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const CONSTELLATION_ORBIT = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    orientationRepresentation:
      "UNIT_QUATERNION",

    manipulationStates:
      Object.freeze([
        STATES.CONSTELLATION
      ]),

    commitStates:
      Object.freeze([
        STATES.CONSTELLATION
      ]),

    directCardinalSelectionCommitsFocus:
      true,

    dragCommitOpensCluster:
      false,

    dragCommitClosesCluster:
      false
  });

  const CLUSTER_ORBIT = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    orientationRepresentation:
      "UNIT_QUATERNION",

    manipulationStates:
      Object.freeze([
        STATES.CLUSTER_OPEN,
        STATES.ROOM_SELECTED
      ]),

    commitStates:
      Object.freeze([
        STATES.CLUSTER_OPEN,
        STATES.ROOM_SELECTED
      ]),

    dragCommitSelectsRoom:
      false,

    dragCommitDescendsPanel:
      false,

    flickReturnsToConstellation:
      true,

    ordinaryDragReturnsToConstellation:
      false,

    roomSelectionCommitsPrimary:
      false
  });

  const QUATERNION = Object.freeze({
    minimumLength:
      1e-8,

    identity:
      Object.freeze([
        0,
        0,
        0,
        1
      ])
  });

  const CANONICAL_CONSTELLATION_EULER = Object.freeze({
    north:
      Object.freeze({
        yaw: 0,
        pitch: 0,
        roll: 0
      }),

    east:
      Object.freeze({
        yaw: -Math.PI / 2,
        pitch: 0,
        roll: 0
      }),

    south:
      Object.freeze({
        yaw: Math.PI,
        pitch: 0,
        roll: 0
      }),

    west:
      Object.freeze({
        yaw: Math.PI / 2,
        pitch: 0,
        roll: 0
      })
  });

  const PROMINENCE = Object.freeze({
    [STATES.CONSTELLATION]:
      Object.freeze({
        compass: 1,
        window: 0.36
      }),

    [STATES.CLUSTER_OPEN]:
      Object.freeze({
        compass: 1,
        window: 0.34
      }),

    [STATES.ROOM_SELECTED]:
      Object.freeze({
        compass: 0.94,
        window: 0.32
      }),

    [STATES.MIRRORLAND_REVEALING]:
      Object.freeze({
        compass: 0.62,
        window: 1
      }),

    [STATES.MIRRORLAND_FOCUSED]:
      Object.freeze({
        compass: 0.36,
        window: 1
      }),

    [STATES.MIRRORLAND_WITHDRAWING]:
      Object.freeze({
        compass: 0.70,
        window: 0.82
      }),

    [STATES.NAVIGATING]:
      Object.freeze({
        compass: 0.22,
        window: 1
      }),

    [STATES.HELD]:
      Object.freeze({
        compass: 0.80,
        window: 0
      })
  });

  const TIMEOUTS = Object.freeze({
    mirrorlandRevealMs:
      8000,

    mirrorlandWithdrawalMs:
      6000
  });

  const DEFAULT_PANEL = Object.freeze({
    eyebrow:
      "Selected path",

    title:
      "Choose a star",

    purpose:
      "Tap a star to open its cluster.",

    relationship:
      "Drag the constellation to bring a cardinal star forward. Tap the primary star to open its cluster."
  });

  const GUIDANCE = Object.freeze({
    CONSTELLATION:
      "Drag any star, label, or open part of the constellation to rotate the shared sphere. Release to bring the nearest cardinal forward. Tap a star to open its cluster.",

    CLUSTER_OPEN:
      "Pull and hold to rotate the room stars as one cluster. Release a controlled drag to settle the nearest room forward. Use a quick swipe to return to the constellation.",

    ROOM_SELECTED:
      "Inspect the selected path. A controlled pull still rotates the room cluster. Use Enter Room to navigate, Return To Orbit to reopen the cluster, or a quick swipe to return to the constellation.",

    MIRRORLAND_REVEALING:
      "Mirrorland is revealing. Wait for the Window to stabilize.",

    MIRRORLAND_FOCUSED:
      "Mirrorland is stable. Enter when ready, or use Back to Compass to restore the prior state.",

    MIRRORLAND_WITHDRAWING:
      "Mirrorland is withdrawing. Your prior Compass state will be restored.",

    HELD:
      "The Compass remains available, but one visual subsystem is temporarily held."
  });

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    previousContractId:
      CONTRACT.previousId,

    status:
      "pending",

    state:
      STATES.CONSTELLATION,

    orbitFocus:
      "north",

    orbitPreviewFocus:
      "north",

    orbitPhase:
      ORIENTATION_PHASES.COMMITTED,

    orbitGestureActive:
      false,

    orbitRevision:
      0,

    orbitQuaternion:
      QUATERNION.identity,

    activeClusterWing:
      "",

    clusterPrimaryRoom:
      "",

    clusterPreviewPrimaryRoom:
      "",

    clusterPhase:
      ORIENTATION_PHASES.IDLE,

    clusterGestureActive:
      false,

    clusterRevision:
      0,

    clusterQuaternion:
      QUATERNION.identity,

    selectedCardinal:
      "",

    selectedRoom:
      "",

    selectedDestinationType:
      "",

    selectedRoute:
      "",

    panelDescended:
      false,

    mirrorlandState:
      MIRRORLAND_STATES.DORMANT,

    mirrorlandTransitionId:
      "",

    sphericalConstellationEnabled:
      true,

    sphericalClustersEnabled:
      true,

    lastAction:
      "",

    lastFailure:
      null,

    visualPassClaimed:
      false
  };

  const state = {
    root:
      null,

    scene:
      null,

    panel:
      null,

    panelEyebrow:
      null,

    panelTitle:
      null,

    panelPurpose:
      null,

    panelRelationship:
      null,

    enterButton:
      null,

    enterLabel:
      null,

    returnButton:
      null,

    mirrorlandBackButton:
      null,

    guidance:
      null,

    controllerReceiptOutput:
      null,

    current:
      STATES.CONSTELLATION,

    orbitFocus:
      "north",

    orbitPreviewFocus:
      "north",

    orbitPhase:
      ORIENTATION_PHASES.COMMITTED,

    orbitGestureActive:
      false,

    orbitRevision:
      0,

    orbitOrientation:
      null,

    committedOrbitOrientation:
      null,

    orbitGestureOrigin:
      null,

    clusters:
      new Map(),

    selectedCardinal:
      "",

    selectedRoom:
      "",

    selectedDestinationType:
      "",

    selectedDestinationId:
      "",

    selectedDestinationLabel:
      "",

    selectedRoute:
      "",

    panelDescended:
      false,

    panelDescentFrame:
      0,

    panelDescentCommitFrame:
      0,

    sceneAscentFrame:
      0,

    sceneAscentCommitFrame:
      0,

    mirrorlandState:
      MIRRORLAND_STATES.DORMANT,

    mirrorlandTransitionId:
      "",

    mirrorlandTimeout:
      0,

    preserved:
      null,

    initialized:
      false,

    reducedMotion:
      false
  };

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

  function normalizeWing(
    value
  ) {
    const wing =
      String(value || "")
        .trim()
        .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeRoomId(
    value
  ) {
    return String(value || "")
      .trim();
  }

  function normalizeRoute(
    value
  ) {
    const route =
      String(value || "")
        .trim();

    return route.startsWith("/")
      ? route
      : "";
  }

  function wrapRadians(
    value
  ) {
    let angle =
      finiteNumber(
        value,
        0
      );

    while (angle > Math.PI) {
      angle -=
        Math.PI * 2;
    }

    while (angle < -Math.PI) {
      angle +=
        Math.PI * 2;
    }

    return angle;
  }

  function quaternionLength(
    quaternion
  ) {
    return Math.hypot(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );
  }

  function normalizeQuaternion(
    value,
    fallback = QUATERNION.identity
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return Array.from(fallback);
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
    ];

    const length =
      quaternionLength(
        quaternion
      );

    if (
      !Number.isFinite(length) ||
      length < QUATERNION.minimumLength
    ) {
      return Array.from(fallback);
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function quaternionFromEuler(
    yaw,
    pitch,
    roll
  ) {
    const safeYaw =
      wrapRadians(yaw);

    const safePitch =
      clamp(
        finiteNumber(pitch, 0),
        -Math.PI / 2,
        Math.PI / 2
      );

    const safeRoll =
      wrapRadians(roll);

    const cy =
      Math.cos(
        safeYaw * 0.5
      );

    const sy =
      Math.sin(
        safeYaw * 0.5
      );

    const cp =
      Math.cos(
        safePitch * 0.5
      );

    const sp =
      Math.sin(
        safePitch * 0.5
      );

    const cr =
      Math.cos(
        safeRoll * 0.5
      );

    const sr =
      Math.sin(
        safeRoll * 0.5
      );

    return normalizeQuaternion([
      sr * cp * cy -
        cr * sp * sy,

      cr * sp * cy +
        sr * cp * sy,

      cr * cp * sy -
        sr * sp * cy,

      cr * cp * cy +
        sr * sp * sy
    ]);
  }

  function eulerFromQuaternion(
    value
  ) {
    const quaternion =
      normalizeQuaternion(
        value
      );

    const [
      x,
      y,
      z,
      w
    ] = quaternion;

    const sinPitch =
      2 *
      (
        w * y -
        z * x
      );

    const pitch =
      Math.abs(sinPitch) >= 1
        ? Math.sign(sinPitch) *
          Math.PI / 2
        : Math.asin(sinPitch);

    const yaw =
      Math.atan2(
        2 *
        (
          w * z +
          x * y
        ),

        1 -
        2 *
        (
          y * y +
          z * z
        )
      );

    const roll =
      Math.atan2(
        2 *
        (
          w * x +
          y * z
        ),

        1 -
        2 *
        (
          x * x +
          y * y
        )
      );

    return {
      yaw:
        wrapRadians(yaw),

      pitch:
        clamp(
          pitch,
          -Math.PI / 2,
          Math.PI / 2
        ),

      roll:
        wrapRadians(roll)
    };
  }

  function orientationFromEuler(
    yaw,
    pitch,
    roll,
    primaryId = ""
  ) {
    const quaternion =
      quaternionFromEuler(
        yaw,
        pitch,
        roll
      );

    return {
      yaw:
        wrapRadians(yaw),

      pitch:
        clamp(
          finiteNumber(pitch, 0),
          -Math.PI / 2,
          Math.PI / 2
        ),

      roll:
        wrapRadians(roll),

      quaternion,

      primaryId:
        String(primaryId || "")
          .trim()
    };
  }

  function orientationFromQuaternion(
    quaternion,
    primaryId = ""
  ) {
    const normalized =
      normalizeQuaternion(
        quaternion
      );

    const euler =
      eulerFromQuaternion(
        normalized
      );

    return {
      yaw:
        euler.yaw,

      pitch:
        euler.pitch,

      roll:
        euler.roll,

      quaternion:
        normalized,

      primaryId:
        String(primaryId || "")
          .trim()
    };
  }

  function cloneOrientation(
    orientation
  ) {
    const source =
      orientation ||
      orientationFromQuaternion(
        QUATERNION.identity
      );

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

      quaternion:
        normalizeQuaternion(
          source.quaternion
        ),

      primaryId:
        String(
          source.primaryId ||
          source.primaryWing ||
          source.primaryRoom ||
          ""
        ).trim()
    };
  }

  function freezeOrientation(
    orientation
  ) {
    const clone =
      cloneOrientation(
        orientation
      );

    return Object.freeze({
      yaw:
        clone.yaw,

      pitch:
        clone.pitch,

      roll:
        clone.roll,

      quaternion:
        Object.freeze(
          clone.quaternion.slice()
        ),

      primaryId:
        clone.primaryId
    });
  }

  function resolveOrientation(
    payload,
    fallbackOrientation
  ) {
    const fallback =
      cloneOrientation(
        fallbackOrientation
      );

    if (
      !payload ||
      typeof payload !== "object"
    ) {
      return fallback;
    }

    const primaryId =
      String(
        payload.primaryId ||
        payload.primaryWing ||
        payload.primaryRoom ||
        payload.focus ||
        fallback.primaryId ||
        ""
      ).trim();

    if (
      Array.isArray(payload.quaternion) ||
      ArrayBuffer.isView(
        payload.quaternion
      )
    ) {
      return orientationFromQuaternion(
        payload.quaternion,
        primaryId
      );
    }

    if (
      payload.orientation &&
      (
        Array.isArray(
          payload.orientation.quaternion
        ) ||
        ArrayBuffer.isView(
          payload.orientation.quaternion
        )
      )
    ) {
      return orientationFromQuaternion(
        payload.orientation.quaternion,

        primaryId ||
        payload.orientation.primaryId
      );
    }

    return orientationFromEuler(
      payload.yaw !== undefined
        ? payload.yaw
        : fallback.yaw,

      payload.pitch !== undefined
        ? payload.pitch
        : fallback.pitch,

      payload.roll !== undefined
        ? payload.roll
        : fallback.roll,

      primaryId
    );
  }

  function canonicalConstellationOrientation(
    wing
  ) {
    const normalizedWing =
      normalizeWing(wing) ||
      "north";

    const canonical =
      CANONICAL_CONSTELLATION_EULER[
        normalizedWing
      ];

    return orientationFromEuler(
      canonical.yaw,
      canonical.pitch,
      canonical.roll,
      normalizedWing
    );
  }

  function createClusterState(
    wing
  ) {
    return {
      wing,

      roomIds:
        [],

      primaryRoom:
        "",

      previewPrimaryRoom:
        "",

      phase:
        ORIENTATION_PHASES.IDLE,

      gestureActive:
        false,

      revision:
        0,

      orientation:
        orientationFromQuaternion(
          QUATERNION.identity
        ),

      committedOrientation:
        orientationFromQuaternion(
          QUATERNION.identity
        ),

      gestureOrigin:
        null
    };
  }

  function getCluster(
    wing
  ) {
    const normalizedWing =
      normalizeWing(
        wing
      );

    if (!normalizedWing) {
      return null;
    }

    return (
      state.clusters.get(
        normalizedWing
      ) ||
      null
    );
  }

  function activeClusterWing() {
    return normalizeWing(
      state.selectedCardinal ||
      state.orbitFocus
    );
  }

  function activeCluster() {
    return getCluster(
      activeClusterWing()
    );
  }

  function clusterContainsRoom(
    cluster,
    roomId
  ) {
    return Boolean(
      cluster &&
      cluster.roomIds.includes(
        normalizeRoomId(roomId)
      )
    );
  }

  function makeTransitionId(
    prefix = "mirrorland"
  ) {
    const time =
      Date.now()
        .toString(36);

    const random =
      Math.random()
        .toString(36)
        .slice(2, 8);

    return `${prefix}-${time}-${random}`;
  }

  function canManipulateConstellation() {
    return (
      CONSTELLATION_ORBIT
        .manipulationStates
        .includes(
          state.current
        ) &&
      state.mirrorlandState ===
        MIRRORLAND_STATES.DORMANT
    );
  }

  function canCommitConstellation() {
    return (
      CONSTELLATION_ORBIT
        .commitStates
        .includes(
          state.current
        ) &&
      state.mirrorlandState ===
        MIRRORLAND_STATES.DORMANT
    );
  }

  function canManipulateCluster(
    wing = activeClusterWing()
  ) {
    return Boolean(
      normalizeWing(wing) &&
      CLUSTER_ORBIT
        .manipulationStates
        .includes(
          state.current
        ) &&
      state.mirrorlandState ===
        MIRRORLAND_STATES.DORMANT &&
      normalizeWing(
        state.selectedCardinal
      ) === normalizeWing(wing)
    );
  }

  function canCommitCluster(
    wing = activeClusterWing()
  ) {
    return Boolean(
      normalizeWing(wing) &&
      CLUSTER_ORBIT
        .commitStates
        .includes(
          state.current
        ) &&
      state.mirrorlandState ===
        MIRRORLAND_STATES.DORMANT &&
      normalizeWing(
        state.selectedCardinal
      ) === normalizeWing(wing)
    );
  }

  function setHiddenControl(
    control,
    hidden
  ) {
    if (!control) {
      return;
    }

    control.hidden =
      hidden;

    control.disabled =
      hidden;

    control.setAttribute(
      "aria-hidden",
      hidden
        ? "true"
        : "false"
    );

    control.setAttribute(
      "aria-disabled",
      hidden
        ? "true"
        : "false"
    );

    if (hidden) {
      control.setAttribute(
        "tabindex",
        "-1"
      );
    } else {
      control.removeAttribute(
        "tabindex"
      );
    }
  }

  function setEnterEnabled(
    enabled,
    label = "Enter Room"
  ) {
    if (!state.enterButton) {
      return;
    }

    state.enterButton.disabled =
      !enabled;

    state.enterButton.setAttribute(
      "aria-disabled",
      enabled
        ? "false"
        : "true"
    );

    if (state.enterLabel) {
      state.enterLabel.textContent =
        label;
    } else {
      state.enterButton.textContent =
        label;
    }
  }

  function setPanel({
    eyebrow,
    title,
    purpose,
    relationship
  }) {
    if (state.panelEyebrow) {
      state.panelEyebrow.textContent =
        eyebrow ||
        DEFAULT_PANEL.eyebrow;
    }

    if (state.panelTitle) {
      state.panelTitle.textContent =
        title ||
        DEFAULT_PANEL.title;
    }

    if (state.panelPurpose) {
      state.panelPurpose.textContent =
        purpose ||
        DEFAULT_PANEL.purpose;
    }

    if (state.panelRelationship) {
      state.panelRelationship.textContent =
        relationship ||
        DEFAULT_PANEL.relationship;
    }
  }

  function setGuidance(
    message
  ) {
    if (state.guidance) {
      state.guidance.textContent =
        message || "";
    }
  }

  function prominenceFor(
    currentState
  ) {
    return (
      PROMINENCE[currentState] ||
      PROMINENCE[STATES.HELD]
    );
  }

  function clearPanelDescentSchedule() {
    if (state.panelDescentFrame) {
      cancelAnimationFrame(
        state.panelDescentFrame
      );

      state.panelDescentFrame =
        0;
    }

    if (
      state.panelDescentCommitFrame
    ) {
      cancelAnimationFrame(
        state.panelDescentCommitFrame
      );

      state.panelDescentCommitFrame =
        0;
    }
  }

  function clearSceneAscentSchedule() {
    if (state.sceneAscentFrame) {
      cancelAnimationFrame(
        state.sceneAscentFrame
      );

      state.sceneAscentFrame =
        0;
    }

    if (
      state.sceneAscentCommitFrame
    ) {
      cancelAnimationFrame(
        state.sceneAscentCommitFrame
      );

      state.sceneAscentCommitFrame =
        0;
    }
  }

  function clearViewportSchedules() {
    clearPanelDescentSchedule();
    clearSceneAscentSchedule();
  }

  function setPanelDescended(
    descended
  ) {
    state.panelDescended =
      Boolean(descended);
  }

  function schedulePanelDescent(
    expectedRoomId
  ) {
    clearViewportSchedules();

    const roomId =
      normalizeRoomId(
        expectedRoomId
      );

    if (
      !roomId ||
      !state.panel
    ) {
      return;
    }

    state.panelDescentFrame =
      requestAnimationFrame(
        () => {
          state.panelDescentFrame =
            0;

          state.panelDescentCommitFrame =
            requestAnimationFrame(
              () => {
                state.panelDescentCommitFrame =
                  0;

                if (
                  state.current !==
                    STATES.ROOM_SELECTED ||
                  state.selectedRoom !==
                    roomId ||
                  !state.panel
                ) {
                  return;
                }

                state.panel.scrollIntoView({
                  behavior:
                    state.reducedMotion
                      ? "auto"
                      : "smooth",

                  block:
                    "start",

                  inline:
                    "nearest"
                });

                emitReceipt({
                  lastAction:
                    `panel-descended:${roomId}`,

                  lastFailure:
                    null
                });
              }
            );
        }
      );
  }

  function scheduleSceneAscent(
    expectedWing
  ) {
    clearViewportSchedules();

    const wing =
      normalizeWing(
        expectedWing
      );

    if (
      !wing ||
      !state.scene
    ) {
      return;
    }

    state.sceneAscentFrame =
      requestAnimationFrame(
        () => {
          state.sceneAscentFrame =
            0;

          state.sceneAscentCommitFrame =
            requestAnimationFrame(
              () => {
                state.sceneAscentCommitFrame =
                  0;

                if (
                  state.current !==
                    STATES.CLUSTER_OPEN ||
                  state.selectedCardinal !==
                    wing ||
                  state.selectedRoom ||
                  !state.scene
                ) {
                  return;
                }

                state.scene.scrollIntoView({
                  behavior:
                    state.reducedMotion
                      ? "auto"
                      : "smooth",

                  block:
                    "start",

                  inline:
                    "nearest"
                });

                emitReceipt({
                  lastAction:
                    `returned-to-orbit:${wing}`,

                  lastFailure:
                    null
                });
              }
            );
        }
      );
  }

  function setConstellationOrientation(
    orientation,
    {
      committed = false,
      phase =
        ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      incrementRevision = false
    } = {}
  ) {
    const normalized =
      cloneOrientation(
        orientation
      );

    const primaryWing =
      normalizeWing(
        normalized.primaryId
      );

    normalized.primaryId =
      primaryWing ||
      state.orbitPreviewFocus ||
      state.orbitFocus ||
      "north";

    state.orbitOrientation =
      normalized;

    state.orbitPreviewFocus =
      normalized.primaryId;

    state.orbitPhase =
      phase;

    state.orbitGestureActive =
      Boolean(
        gestureActive
      );

    if (incrementRevision) {
      state.orbitRevision +=
        1;
    }

    if (committed) {
      state.committedOrbitOrientation =
        cloneOrientation(
          normalized
        );

      state.orbitFocus =
        normalized.primaryId;

      state.orbitPreviewFocus =
        normalized.primaryId;
    }
  }

  function setClusterOrientation(
    cluster,
    orientation,
    {
      committed = false,
      phase =
        ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      incrementRevision = false
    } = {}
  ) {
    if (!cluster) {
      return false;
    }

    const normalized =
      cloneOrientation(
        orientation
      );

    const primaryRoom =
      normalizeRoomId(
        normalized.primaryId
      );

    normalized.primaryId =
      clusterContainsRoom(
        cluster,
        primaryRoom
      )
        ? primaryRoom
        : cluster.previewPrimaryRoom ||
          cluster.primaryRoom ||
          cluster.roomIds[0] ||
          "";

    cluster.orientation =
      normalized;

    cluster.previewPrimaryRoom =
      normalized.primaryId;

    cluster.phase =
      phase;

    cluster.gestureActive =
      Boolean(
        gestureActive
      );

    if (incrementRevision) {
      cluster.revision +=
        1;
    }

    if (committed) {
      cluster.committedOrientation =
        cloneOrientation(
          normalized
        );

      cluster.primaryRoom =
        normalized.primaryId;

      cluster.previewPrimaryRoom =
        normalized.primaryId;
    }

    return true;
  }

  function beginOrbitGesture(
    payload = {}
  ) {
    if (
      !canManipulateConstellation()
    ) {
      return false;
    }

    if (state.orbitGestureActive) {
      return true;
    }

    state.orbitGestureOrigin =
      cloneOrientation(
        state.committedOrbitOrientation ||
        state.orbitOrientation
      );

    const preview =
      resolveOrientation(
        payload,
        state.orbitOrientation
      );

    setConstellationOrientation(
      preview,
      {
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
      }
    );

    syncPresentation();

    emitReceipt({
      lastAction:
        "orbit-gesture-began",

      lastFailure:
        null
    });

    return true;
  }

  function requestOrbitPreview(
    payload = {}
  ) {
    if (
      !canManipulateConstellation()
    ) {
      return false;
    }

    if (!state.orbitGestureActive) {
      beginOrbitGesture();
    }

    const orientation =
      resolveOrientation(
        payload,
        state.orbitOrientation
      );

    setConstellationOrientation(
      orientation,
      {
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
      }
    );

    syncDatasets();

    return true;
  }

  function requestOrbitCommit(
    payload = {}
  ) {
    if (
      !canCommitConstellation()
    ) {
      return false;
    }

    const orientation =
      resolveOrientation(
        payload,
        state.orbitOrientation ||
        state.committedOrbitOrientation
      );

    const primaryWing =
      normalizeWing(
        payload.primaryWing ||
        payload.primaryId ||
        orientation.primaryId ||
        state.orbitPreviewFocus ||
        state.orbitFocus
      );

    if (!primaryWing) {
      emitReceipt({
        lastAction:
          "orbit-commit-rejected",

        lastFailure:
          "ORBIT_PRIMARY_WING_REQUIRED"
      });

      return false;
    }

    orientation.primaryId =
      primaryWing;

    setConstellationOrientation(
      orientation,
      {
        committed:
          true,

        phase:
          ORIENTATION_PHASES.COMMITTED,

        gestureActive:
          false,

        incrementRevision:
          true
      }
    );

    state.orbitGestureOrigin =
      null;

    setPanelDescended(
      false
    );

    syncPresentation();

    emitReceipt({
      lastAction:
        `orbit-committed:${primaryWing}`,

      lastFailure:
        null,

      orbitCommitSource:
        String(
          payload.source ||
          "renderer"
        )
    });

    return true;
  }

  function requestOrbitCancel(
    reason = "cancelled"
  ) {
    if (
      !state.orbitGestureActive &&
      state.orbitPhase !==
        ORIENTATION_PHASES.PREVIEW
    ) {
      return false;
    }

    const restored =
      cloneOrientation(
        state.orbitGestureOrigin ||
        state.committedOrbitOrientation ||
        canonicalConstellationOrientation(
          state.orbitFocus
        )
      );

    setConstellationOrientation(
      restored,
      {
        committed:
          false,

        phase:
          ORIENTATION_PHASES.CANCELLED,

        gestureActive:
          false
      }
    );

    state.orbitGestureOrigin =
      null;

    syncPresentation();

    emitReceipt({
      lastAction:
        `orbit-preview-cancelled:${String(
          reason ||
          "cancelled"
        )}`,

      lastFailure:
        null
    });

    return true;
  }

  function requestOrbitFocus(
    wing,
    options = {}
  ) {
    const normalizedWing =
      normalizeWing(
        wing
      );

    if (
      !normalizedWing ||
      !canCommitConstellation()
    ) {
      return false;
    }

    const canonical =
      canonicalConstellationOrientation(
        normalizedWing
      );

    return requestOrbitCommit({
      ...canonical,

      primaryWing:
        normalizedWing,

      source:
        options.source ||
        "direct-focus"
    });
  }

  function beginClusterGesture(
    wingOrPayload,
    maybePayload = {}
  ) {
    const wing =
      typeof wingOrPayload ===
        "string"
        ? normalizeWing(
            wingOrPayload
          )
        : activeClusterWing();

    const payload =
      typeof wingOrPayload ===
        "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(
        wing
      );

    if (
      !cluster ||
      !canManipulateCluster(
        wing
      )
    ) {
      return false;
    }

    if (cluster.gestureActive) {
      return true;
    }

    cluster.gestureOrigin =
      cloneOrientation(
        cluster.committedOrientation ||
        cluster.orientation
      );

    const preview =
      resolveOrientation(
        payload,
        cluster.orientation
      );

    setClusterOrientation(
      cluster,
      preview,
      {
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
      }
    );

    syncPresentation();

    emitReceipt({
      lastAction:
        `cluster-gesture-began:${wing}`,

      lastFailure:
        null
    });

    return true;
  }

  function requestClusterPreview(
    wingOrPayload,
    maybePayload = {}
  ) {
    const wing =
      typeof wingOrPayload ===
        "string"
        ? normalizeWing(
            wingOrPayload
          )
        : activeClusterWing();

    const payload =
      typeof wingOrPayload ===
        "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(
        wing
      );

    if (
      !cluster ||
      !canManipulateCluster(
        wing
      )
    ) {
      return false;
    }

    if (!cluster.gestureActive) {
      beginClusterGesture(
        wing
      );
    }

    const orientation =
      resolveOrientation(
        payload,
        cluster.orientation
      );

    const primaryRoom =
      normalizeRoomId(
        payload.primaryRoom ||
        payload.primaryId ||
        orientation.primaryId
      );

    if (
      primaryRoom &&
      !clusterContainsRoom(
        cluster,
        primaryRoom
      )
    ) {
      return false;
    }

    orientation.primaryId =
      primaryRoom ||
      orientation.primaryId ||
      cluster.previewPrimaryRoom ||
      cluster.primaryRoom ||
      cluster.roomIds[0] ||
      "";

    setClusterOrientation(
      cluster,
      orientation,
      {
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
      }
    );

    syncDatasets();

    return true;
  }

  function requestClusterCommit(
    wingOrPayload,
    maybePayload = {}
  ) {
    const wing =
      typeof wingOrPayload ===
        "string"
        ? normalizeWing(
            wingOrPayload
          )
        : activeClusterWing();

    const payload =
      typeof wingOrPayload ===
        "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(
        wing
      );

    if (
      !cluster ||
      !canCommitCluster(
        wing
      )
    ) {
      return false;
    }

    const orientation =
      resolveOrientation(
        payload,
        cluster.orientation ||
        cluster.committedOrientation
      );

    const primaryRoom =
      normalizeRoomId(
        payload.primaryRoom ||
        payload.primaryId ||
        orientation.primaryId ||
        cluster.previewPrimaryRoom ||
        cluster.primaryRoom
      );

    if (
      !primaryRoom ||
      !clusterContainsRoom(
        cluster,
        primaryRoom
      )
    ) {
      emitReceipt({
        lastAction:
          `cluster-commit-rejected:${wing}`,

        lastFailure:
          "CLUSTER_PRIMARY_ROOM_REQUIRED"
      });

      return false;
    }

    orientation.primaryId =
      primaryRoom;

    setClusterOrientation(
      cluster,
      orientation,
      {
        committed:
          true,

        phase:
          ORIENTATION_PHASES.COMMITTED,

        gestureActive:
          false,

        incrementRevision:
          true
      }
    );

    cluster.gestureOrigin =
      null;

    /*
     * A cluster-orientation commitment does not select the room,
     * descend the panel, or change the current controller state.
     */
    syncPresentation();

    emitReceipt({
      lastAction:
        `cluster-committed:${wing}:${primaryRoom}`,

      lastFailure:
        null,

      clusterCommitSource:
        String(
          payload.source ||
          "renderer"
        )
    });

    return true;
  }

  function requestClusterCancel(
    wingOrReason,
    maybeReason = "cancelled"
  ) {
    const possibleWing =
      normalizeWing(
        wingOrReason
      );

    const wing =
      possibleWing ||
      activeClusterWing();

    const reason =
      possibleWing
        ? maybeReason
        : wingOrReason ||
          maybeReason;

    const cluster =
      getCluster(
        wing
      );

    if (
      !cluster ||
      (
        !cluster.gestureActive &&
        cluster.phase !==
          ORIENTATION_PHASES.PREVIEW
      )
    ) {
      return false;
    }

    const restored =
      cloneOrientation(
        cluster.gestureOrigin ||
        cluster.committedOrientation ||
        orientationFromQuaternion(
          QUATERNION.identity,
          cluster.primaryRoom
        )
      );

    setClusterOrientation(
      cluster,
      restored,
      {
        committed:
          false,

        phase:
          ORIENTATION_PHASES.CANCELLED,

        gestureActive:
          false
      }
    );

    cluster.gestureOrigin =
      null;

    syncPresentation();

    emitReceipt({
      lastAction:
        `cluster-preview-cancelled:${wing}:${String(
          reason ||
          "cancelled"
        )}`,

      lastFailure:
        null
    });

    return true;
  }

  function requestClusterFocus(
    wing,
    roomId,
    options = {}
  ) {
    const normalizedWing =
      normalizeWing(
        wing
      );

    const normalizedRoom =
      normalizeRoomId(
        roomId
      );

    const cluster =
      getCluster(
        normalizedWing
      );

    if (
      !cluster ||
      !canCommitCluster(
        normalizedWing
      ) ||
      !clusterContainsRoom(
        cluster,
        normalizedRoom
      )
    ) {
      return false;
    }

    return requestClusterCommit(
      normalizedWing,
      {
        quaternion:
          cluster.committedOrientation
            .quaternion,

        primaryRoom:
          normalizedRoom,

        source:
          options.source ||
          "direct-cluster-focus"
      }
    );
  }

  function requestAxisSwipe(
    axis
  ) {
    if (
      !canCommitConstellation()
    ) {
      return false;
    }

    const normalized =
      String(axis || "")
        .trim()
        .toLowerCase();

    const currentWing =
      normalizeWing(
        state.orbitFocus
      ) ||
      "north";

    const currentIndex =
      Math.max(
        0,
        LEGACY_ORBIT_SEQUENCE.indexOf(
          currentWing
        )
      );

    let step =
      1;

    if (
      normalized === "vertical" ||
      normalized === "up" ||
      normalized === "left" ||
      normalized === "swipeup" ||
      normalized === "swipeleft"
    ) {
      step =
        -1;
    }

    const nextIndex =
      (
        currentIndex +
        step +
        LEGACY_ORBIT_SEQUENCE.length
      ) %
      LEGACY_ORBIT_SEQUENCE.length;

    return requestOrbitFocus(
      LEGACY_ORBIT_SEQUENCE[
        nextIndex
      ],
      {
        source:
          `legacy-axis:${normalized || "unspecified"}`
      }
    );
  }

  function clusterReceiptState() {
    const cluster =
      activeCluster();

    if (!cluster) {
      return {
        activeClusterWing:
          "",

        clusterPrimaryRoom:
          "",

        clusterPreviewPrimaryRoom:
          "",

        clusterPhase:
          ORIENTATION_PHASES.IDLE,

        clusterGestureActive:
          false,

        clusterRevision:
          0,

        clusterQuaternion:
          QUATERNION.identity
      };
    }

    return {
      activeClusterWing:
        cluster.wing,

      clusterPrimaryRoom:
        cluster.primaryRoom,

      clusterPreviewPrimaryRoom:
        cluster.previewPrimaryRoom,

      clusterPhase:
        cluster.phase,

      clusterGestureActive:
        cluster.gestureActive,

      clusterRevision:
        cluster.revision,

      clusterQuaternion:
        Object.freeze(
          cluster.orientation
            .quaternion
            .slice()
        )
    };
  }

  function syncDatasets() {
    if (!state.root) {
      return;
    }

    const prominence =
      prominenceFor(
        state.current
      );

    const orbit =
      cloneOrientation(
        state.orbitOrientation ||
        canonicalConstellationOrientation(
          state.orbitFocus
        )
      );

    const cluster =
      activeCluster();

    state.root.dataset.compassMode =
      state.current;

    state.root.dataset.orbitFocus =
      state.orbitFocus;

    state.root.dataset.orbitPreviewFocus =
      state.orbitPreviewFocus;

    state.root.dataset.orbitPhase =
      state.orbitPhase;

    state.root.dataset.orbitGestureActive =
      state.orbitGestureActive
        ? "true"
        : "false";

    state.root.dataset.orbitRevision =
      String(
        state.orbitRevision
      );

    state.root.dataset.orbitQuaternion =
      JSON.stringify(
        orbit.quaternion
      );

    state.root.dataset.sphericalOrbitEnabled =
      "true";

    state.root.dataset.activeClusterWing =
      cluster
        ? cluster.wing
        : "";

    state.root.dataset.clusterPrimaryRoom =
      cluster
        ? cluster.primaryRoom
        : "";

    state.root.dataset.clusterPreviewPrimaryRoom =
      cluster
        ? cluster.previewPrimaryRoom
        : "";

    state.root.dataset.clusterPhase =
      cluster
        ? cluster.phase
        : ORIENTATION_PHASES.IDLE;

    state.root.dataset.clusterGestureActive =
      cluster &&
      cluster.gestureActive
        ? "true"
        : "false";

    state.root.dataset.clusterRevision =
      String(
        cluster
          ? cluster.revision
          : 0
      );

    state.root.dataset.clusterQuaternion =
      cluster
        ? JSON.stringify(
            cluster.orientation
              .quaternion
          )
        : "";

    state.root.dataset.sphericalClustersEnabled =
      "true";

    state.root.dataset.selectedCardinal =
      state.selectedCardinal;

    state.root.dataset.selectedWing =
      state.selectedCardinal;

    state.root.dataset.selectedRoom =
      state.selectedRoom;

    state.root.dataset.selectedDestinationType =
      state.selectedDestinationType;

    state.root.dataset.selectedDestinationId =
      state.selectedDestinationId;

    state.root.dataset.selectedDestinationLabel =
      state.selectedDestinationLabel;

    state.root.dataset.selectedRoute =
      state.selectedRoute;

    state.root.dataset.flowerExpanded =
      state.current ===
        STATES.CLUSTER_OPEN ||
      state.current ===
        STATES.ROOM_SELECTED
        ? "true"
        : "false";

    state.root.dataset.panelDescended =
      state.panelDescended
        ? "true"
        : "false";

    state.root.dataset.reducedMotion =
      state.reducedMotion
        ? "true"
        : "false";

    state.root.dataset.mirrorlandWindowState =
      state.mirrorlandState;

    state.root.dataset.mirrorlandWindowActive =
      state.mirrorlandState ===
        MIRRORLAND_STATES.REVEALING ||
      state.mirrorlandState ===
        MIRRORLAND_STATES.FOCUSED ||
      state.mirrorlandState ===
        MIRRORLAND_STATES.WITHDRAWING
        ? "true"
        : "false";

    state.root.dataset.mirrorlandWindowStable =
      state.mirrorlandState ===
        MIRRORLAND_STATES.FOCUSED ||
      state.mirrorlandState ===
        MIRRORLAND_STATES.DORMANT
        ? "true"
        : "false";

    state.root.dataset.mirrorlandEnterEnabled =
      state.current ===
        STATES.MIRRORLAND_FOCUSED
        ? "true"
        : "false";

    state.root.dataset.mirrorlandBackEnabled =
      state.current ===
        STATES.MIRRORLAND_REVEALING ||
      state.current ===
        STATES.MIRRORLAND_FOCUSED
        ? "true"
        : "false";

    state.root.dataset.mirrorlandTransitionId =
      state.mirrorlandTransitionId;

    state.root.dataset.compassProminence =
      String(
        prominence.compass
      );

    state.root.dataset.windowProminence =
      String(
        prominence.window
      );

    state.root.dataset.visualPassClaimed =
      "false";

    const mirrorlandControl =
      qs(
        "[data-compass-object='mirrorland']",
        state.root
      );

    if (mirrorlandControl) {
      mirrorlandControl.setAttribute(
        "aria-expanded",

        state.mirrorlandState ===
          MIRRORLAND_STATES.REVEALING ||
        state.mirrorlandState ===
          MIRRORLAND_STATES.FOCUSED
          ? "true"
          : "false"
      );
    }

    qsa(
      "[data-compass-cardinal]",
      state.root
    ).forEach(
      element => {
        const wing =
          normalizeWing(
            element.dataset.wing
          );

        const selected =
          wing ===
            state.selectedCardinal &&
          (
            state.current ===
              STATES.CLUSTER_OPEN ||
            state.current ===
              STATES.ROOM_SELECTED
          );

        const primary =
          wing ===
            state.orbitFocus &&
          state.current ===
            STATES.CONSTELLATION;

        element.dataset.selected =
          selected
            ? "true"
            : "false";

        element.dataset.primary =
          primary
            ? "true"
            : "false";

        if (
          selected ||
          primary
        ) {
          element.setAttribute(
            "aria-current",
            "true"
          );
        } else {
          element.removeAttribute(
            "aria-current"
          );
        }
      }
    );

    qsa(
      "[data-compass-room]",
      state.root
    ).forEach(
      element => {
        const roomId =
          normalizeRoomId(
            element.dataset.roomId
          );

        const selected =
          roomId ===
          state.selectedRoom;

        const primary =
          Boolean(
            cluster &&
            roomId ===
              cluster.primaryRoom
          );

        element.dataset.selected =
          selected
            ? "true"
            : "false";

        element.dataset.primary =
          primary
            ? "true"
            : "false";

        if (
          selected ||
          primary
        ) {
          element.setAttribute(
            "aria-current",
            "true"
          );
        } else {
          element.removeAttribute(
            "aria-current"
          );
        }
      }
    );
  }

  function emitReceipt(
    extra = {}
  ) {
    const orbit =
      cloneOrientation(
        state.orbitOrientation ||
        canonicalConstellationOrientation(
          state.orbitFocus
        )
      );

    const clusterState =
      clusterReceiptState();

    Object.assign(
      RECEIPT,
      {
        status:
          state.current ===
            STATES.HELD
            ? "held"
            : "available",

        state:
          state.current,

        orbitFocus:
          state.orbitFocus,

        orbitPreviewFocus:
          state.orbitPreviewFocus,

        orbitPhase:
          state.orbitPhase,

        orbitGestureActive:
          state.orbitGestureActive,

        orbitRevision:
          state.orbitRevision,

        orbitQuaternion:
          Object.freeze(
            orbit.quaternion.slice()
          ),

        ...clusterState,

        selectedCardinal:
          state.selectedCardinal,

        selectedRoom:
          state.selectedRoom,

        selectedDestinationType:
          state.selectedDestinationType,

        selectedRoute:
          state.selectedRoute,

        panelDescended:
          state.panelDescended,

        mirrorlandState:
          state.mirrorlandState,

        mirrorlandTransitionId:
          state.mirrorlandTransitionId,

        sphericalConstellationEnabled:
          true,

        sphericalClustersEnabled:
          true,

        visualPassClaimed:
          false
      },

      extra
    );

    const serialized =
      JSON.stringify(
        RECEIPT
      );

    if (state.root) {
      state.root.dataset.compassControllerReceipt =
        serialized;

      state.root.dataset.compassControllerStatus =
        RECEIPT.status;

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (state.controllerReceiptOutput) {
      state.controllerReceiptOutput.value =
        serialized;

      state.controllerReceiptOutput.textContent =
        serialized;

      state.controllerReceiptOutput.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_COMPASS_CONTROLLER_RECEIPT =
      Object.freeze({
        ...RECEIPT,

        orbitQuaternion:
          Object.freeze(
            Array.from(
              RECEIPT.orbitQuaternion
            )
          ),

        clusterQuaternion:
          Object.freeze(
            Array.from(
              RECEIPT.clusterQuaternion
            )
          )
      });
  }

  function cancelAllGestures(
    reason
  ) {
    if (state.orbitGestureActive) {
      requestOrbitCancel(
        reason
      );
    }

    state.clusters.forEach(
      cluster => {
        if (cluster.gestureActive) {
          requestClusterCancel(
            cluster.wing,
            reason
          );
        }
      }
    );
  }

  function fail(
    reason,
    action = "controller-failure"
  ) {
    clearMirrorlandTimers();
    clearViewportSchedules();
    cancelAllGestures(
      "controller-failure"
    );

    state.current =
      STATES.HELD;

    state.mirrorlandState =
      MIRRORLAND_STATES.HELD;

    setPanelDescended(
      false
    );

    syncPresentation();

    emitReceipt({
      lastAction:
        action,

      lastFailure:
        String(
          reason ||
          "UNKNOWN_FAILURE"
        )
    });
  }

  function clearMirrorlandTimers() {
    if (state.mirrorlandTimeout) {
      clearTimeout(
        state.mirrorlandTimeout
      );

      state.mirrorlandTimeout =
        0;
    }
  }

  function destinationFromElement(
    element
  ) {
    if (!element) {
      return null;
    }

    const destinationType =
      String(
        element.dataset.destinationType ||
        ""
      )
        .trim()
        .toLowerCase();

    const destinationId =
      String(
        element.dataset.destinationId ||
        element.dataset.roomId ||
        element.dataset.cardinalId ||
        ""
      ).trim();

    const label =
      String(
        element.dataset.label ||
        element.dataset.coordinateLabel ||
        element.textContent ||
        ""
      ).trim();

    const route =
      normalizeRoute(
        element.dataset.route ||
        element.getAttribute("href") ||
        ""
      );

    return {
      element,
      destinationType,
      destinationId,
      label,
      route
    };
  }

  function panelFromCardinal(
    element
  ) {
    return {
      eyebrow:
        element.dataset.coordinateLabel ||
        "Selected coordinate",

      title:
        element.dataset.panelTitle ||
        element.dataset.title ||
        element.dataset.coordinateLabel ||
        "Selected coordinate",

      purpose:
        element.dataset.panelBody ||
        element.dataset.coordinateFunction ||
        "",

      relationship:
        element.dataset.panelWhy ||
        "Inspect this coordinate before entering."
    };
  }

  function panelFromRoom(
    element
  ) {
    return {
      eyebrow:
        element.dataset.localCoordinate ||
        "Selected path",

      title:
        element.dataset.label ||
        element.textContent.trim(),

      purpose:
        element.dataset.preview ||
        element.dataset.localFunction ||
        "",

      relationship:
        element.dataset.whyEnter ||
        "Inspect this path, then enter when ready."
    };
  }

  function panelFromMirrorland(
    element
  ) {
    return {
      eyebrow:
        element.dataset.panelEyebrow ||
        element.dataset.orbitLabel ||
        "Mirrorland Threshold",

      title:
        element.dataset.panelTitle ||
        "Mirrorland",

      purpose:
        element.dataset.panelBody ||
        element.dataset.coordinateFunction ||
        "",

      relationship:
        element.dataset.panelWhy ||
        "Reveal the threshold before entering."
    };
  }

  function resetSelection() {
    state.selectedCardinal =
      "";

    state.selectedRoom =
      "";

    state.selectedDestinationType =
      "";

    state.selectedDestinationId =
      "";

    state.selectedDestinationLabel =
      "";

    state.selectedRoute =
      "";

    setPanelDescended(
      false
    );
  }

  function setState(
    nextState,
    action
  ) {
    if (
      !Object.values(STATES)
        .includes(
          nextState
        )
    ) {
      fail(
        `INVALID_STATE:${nextState}`,
        action
      );

      return false;
    }

    state.current =
      nextState;

    syncPresentation();

    emitReceipt({
      lastAction:
        action ||
        `state:${nextState}`,

      lastFailure:
        null
    });

    return true;
  }

  function syncPresentation() {
    syncDatasets();

    const mirrorlandActive =
      state.current ===
        STATES.MIRRORLAND_REVEALING ||
      state.current ===
        STATES.MIRRORLAND_FOCUSED ||
      state.current ===
        STATES.MIRRORLAND_WITHDRAWING;

    if (mirrorlandActive) {
      setHiddenControl(
        state.returnButton,
        true
      );

      setHiddenControl(
        state.mirrorlandBackButton,

        state.current ===
          STATES.MIRRORLAND_WITHDRAWING
      );

      setEnterEnabled(
        state.current ===
          STATES.MIRRORLAND_FOCUSED,

        "Enter Mirrorland"
      );

      if (
        state.current ===
        STATES.MIRRORLAND_REVEALING
      ) {
        setGuidance(
          GUIDANCE.MIRRORLAND_REVEALING
        );
      } else if (
        state.current ===
        STATES.MIRRORLAND_FOCUSED
      ) {
        setGuidance(
          GUIDANCE.MIRRORLAND_FOCUSED
        );
      } else {
        setGuidance(
          GUIDANCE.MIRRORLAND_WITHDRAWING
        );
      }

      return;
    }

    if (
      state.current ===
      STATES.CONSTELLATION
    ) {
      setPanel(
        DEFAULT_PANEL
      );

      setEnterEnabled(
        false,
        "Enter Room"
      );

      setHiddenControl(
        state.returnButton,
        true
      );

      setHiddenControl(
        state.mirrorlandBackButton,
        true
      );

      setGuidance(
        GUIDANCE.CONSTELLATION
      );

      return;
    }

    if (
      state.current ===
      STATES.CLUSTER_OPEN
    ) {
      setEnterEnabled(
        Boolean(
          state.selectedRoute
        ),

        "Enter Coordinate"
      );

      setHiddenControl(
        state.returnButton,
        true
      );

      setHiddenControl(
        state.mirrorlandBackButton,
        true
      );

      setGuidance(
        GUIDANCE.CLUSTER_OPEN
      );

      return;
    }

    if (
      state.current ===
      STATES.ROOM_SELECTED
    ) {
      setEnterEnabled(
        Boolean(
          state.selectedRoute
        ),

        "Enter Room"
      );

      setHiddenControl(
        state.returnButton,
        false
      );

      setHiddenControl(
        state.mirrorlandBackButton,
        true
      );

      setGuidance(
        GUIDANCE.ROOM_SELECTED
      );

      return;
    }

    if (
      state.current ===
      STATES.NAVIGATING
    ) {
      setEnterEnabled(
        false,
        "Entering…"
      );

      setHiddenControl(
        state.returnButton,
        true
      );

      setHiddenControl(
        state.mirrorlandBackButton,
        true
      );

      return;
    }

    if (
      state.current ===
      STATES.HELD
    ) {
      setEnterEnabled(
        false,
        "Unavailable"
      );

      setHiddenControl(
        state.returnButton,
        true
      );

      setHiddenControl(
        state.mirrorlandBackButton,
        true
      );

      setGuidance(
        GUIDANCE.HELD
      );
    }
  }

  function findCardinalElement(
    wing
  ) {
    const normalized =
      normalizeWing(
        wing
      );

    if (!normalized) {
      return null;
    }

    return qs(
      `[data-compass-cardinal][data-wing="${normalized}"]`,
      state.root
    );
  }

  function findRoomDeclaration(
    roomId
  ) {
    const id =
      normalizeRoomId(
        roomId
      );

    if (!id) {
      return null;
    }

    const escaped =
      globalThis.CSS &&
      typeof globalThis.CSS.escape ===
        "function"
        ? globalThis.CSS.escape(id)
        : id.replace(
            /["\\]/g,
            "\\$&"
          );

    return (
      qs(
        `[data-compass-room-declarations] [data-compass-room][data-room-id="${escaped}"]`,
        state.root
      ) ||
      qs(
        `[data-compass-room][data-room-id="${escaped}"]`,
        state.root
      )
    );
  }

  function restorePanelForCurrentState() {
    if (
      state.current ===
        STATES.ROOM_SELECTED &&
      state.selectedRoom
    ) {
      const room =
        findRoomDeclaration(
          state.selectedRoom
        );

      if (room) {
        setPanel(
          panelFromRoom(
            room
          )
        );

        return true;
      }
    }

    if (
      state.current ===
        STATES.CLUSTER_OPEN &&
      state.selectedCardinal
    ) {
      const cardinal =
        findCardinalElement(
          state.selectedCardinal
        );

      if (cardinal) {
        setPanel(
          panelFromCardinal(
            cardinal
          )
        );

        return true;
      }
    }

    if (
      state.current ===
      STATES.CONSTELLATION
    ) {
      setPanel(
        DEFAULT_PANEL
      );

      return true;
    }

    return false;
  }

  function requestCardinalSelection(
    cardinalId
  ) {
    const wing =
      normalizeWing(
        cardinalId
      );

    if (!wing) {
      fail(
        `INVALID_CARDINAL:${cardinalId}`,
        "requestCardinalSelection"
      );

      return false;
    }

    if (
      state.current !==
        STATES.CONSTELLATION
    ) {
      return false;
    }

    if (
      state.mirrorlandState !==
        MIRRORLAND_STATES.DORMANT
    ) {
      return false;
    }

    const element =
      findCardinalElement(
        wing
      );

    if (!element) {
      fail(
        `CARDINAL_NOT_FOUND:${wing}`,
        "requestCardinalSelection"
      );

      return false;
    }

    if (state.orbitGestureActive) {
      requestOrbitCancel(
        "cardinal-selection"
      );
    }

    if (
      CONSTELLATION_ORBIT
        .directCardinalSelectionCommitsFocus
    ) {
      requestOrbitFocus(
        wing,
        {
          source:
            "cardinal-tap"
        }
      );
    }

    clearViewportSchedules();
    setPanelDescended(
      false
    );

    const destination =
      destinationFromElement(
        element
      );

    state.orbitFocus =
      wing;

    state.orbitPreviewFocus =
      wing;

    state.selectedCardinal =
      wing;

    state.selectedRoom =
      "";

    state.selectedDestinationType =
      "cardinal";

    state.selectedDestinationId =
      wing;

    state.selectedDestinationLabel =
      destination.label ||
      element.dataset.coordinateLabel ||
      wing;

    state.selectedRoute =
      destination.route;

    setPanel(
      panelFromCardinal(
        element
      )
    );

    return setState(
      STATES.CLUSTER_OPEN,
      `cardinal-selected:${wing}`
    );
  }

  function requestRoomSelection(
    roomId
  ) {
    const id =
      normalizeRoomId(
        roomId
      );

    if (
      !id ||
      (
        state.current !==
          STATES.CLUSTER_OPEN &&
        state.current !==
          STATES.ROOM_SELECTED
      )
    ) {
      return false;
    }

    const element =
      findRoomDeclaration(
        id
      );

    if (!element) {
      fail(
        `ROOM_NOT_FOUND:${id}`,
        "requestRoomSelection"
      );

      return false;
    }

    const wing =
      normalizeWing(
        element.dataset.wing
      );

    if (
      !wing ||
      wing !==
        state.selectedCardinal
    ) {
      return false;
    }

    const cluster =
      getCluster(
        wing
      );

    if (
      !cluster ||
      !clusterContainsRoom(
        cluster,
        id
      )
    ) {
      fail(
        `ROOM_CLUSTER_INVALID:${id}`,
        "requestRoomSelection"
      );

      return false;
    }

    if (cluster.gestureActive) {
      requestClusterCancel(
        wing,
        "room-selection"
      );
    }

    clearViewportSchedules();

    const destination =
      destinationFromElement(
        element
      );

    state.selectedRoom =
      id;

    state.selectedDestinationType =
      "petal";

    state.selectedDestinationId =
      id;

    state.selectedDestinationLabel =
      destination.label;

    state.selectedRoute =
      destination.route;

    setPanelDescended(
      true
    );

    setPanel(
      panelFromRoom(
        element
      )
    );

    const committed =
      setState(
        STATES.ROOM_SELECTED,
        `room-selected:${id}`
      );

    if (!committed) {
      setPanelDescended(
        false
      );

      return false;
    }

    schedulePanelDescent(
      id
    );

    return true;
  }

  function requestReturnToConstellation(
    options = {}
  ) {
    if (
      state.current !==
        STATES.CLUSTER_OPEN &&
      state.current !==
        STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const wing =
      normalizeWing(
        state.selectedCardinal ||
        state.orbitFocus
      ) ||
      "north";

    const cluster =
      getCluster(
        wing
      );

    if (
      cluster &&
      cluster.gestureActive
    ) {
      requestClusterCancel(
        wing,
        "return-to-constellation"
      );
    }

    clearViewportSchedules();
    resetSelection();

    state.orbitFocus =
      wing;

    state.orbitPreviewFocus =
      wing;

    setPanel(
      DEFAULT_PANEL
    );

    const committed =
      setState(
        STATES.CONSTELLATION,
        `returned-to-constellation:${wing}`
      );

    if (!committed) {
      return false;
    }

    if (
      options.scrollToScene !==
      false &&
      state.scene
    ) {
      state.scene.scrollIntoView({
        behavior:
          state.reducedMotion
            ? "auto"
            : "smooth",

        block:
          "start",

        inline:
          "nearest"
      });
    }

    emitReceipt({
      lastAction:
        `returned-to-constellation:${wing}`,

      lastFailure:
        null,

      returnSource:
        String(
          options.source ||
          "controller"
        )
    });

    return true;
  }

  function requestReturnToOrbit() {
    if (
      state.current !==
        STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const wing =
      state.selectedCardinal;

    const cardinal =
      findCardinalElement(
        wing
      );

    if (!cardinal) {
      fail(
        `CARDINAL_NOT_FOUND:${wing}`,
        "requestReturnToOrbit"
      );

      return false;
    }

    clearViewportSchedules();
    setPanelDescended(
      false
    );

    state.selectedRoom =
      "";

    state.selectedDestinationType =
      "cardinal";

    state.selectedDestinationId =
      wing;

    const destination =
      destinationFromElement(
        cardinal
      );

    state.selectedDestinationLabel =
      destination.label ||
      cardinal.dataset.coordinateLabel ||
      wing;

    state.selectedRoute =
      destination.route;

    setPanel(
      panelFromCardinal(
        cardinal
      )
    );

    const committed =
      setState(
        STATES.CLUSTER_OPEN,
        "return-to-orbit"
      );

    if (!committed) {
      return false;
    }

    scheduleSceneAscent(
      wing
    );

    return true;
  }

  function cloneClusterSnapshot(
    cluster
  ) {
    return Object.freeze({
      wing:
        cluster.wing,

      roomIds:
        Object.freeze(
          cluster.roomIds.slice()
        ),

      primaryRoom:
        cluster.primaryRoom,

      previewPrimaryRoom:
        cluster.previewPrimaryRoom,

      phase:
        cluster.phase,

      gestureActive:
        false,

      revision:
        cluster.revision,

      orientation:
        freezeOrientation(
          cluster.orientation
        ),

      committedOrientation:
        freezeOrientation(
          cluster.committedOrientation
        )
    });
  }

  function preserveCompassState() {
    cancelAllGestures(
      "mirrorland-preserve"
    );

    const clusters =
      {};

    state.clusters.forEach(
      cluster => {
        clusters[cluster.wing] =
          cloneClusterSnapshot(
            cluster
          );
      }
    );

    state.preserved =
      Object.freeze({
        current:
          state.current ===
            STATES.MIRRORLAND_REVEALING ||
          state.current ===
            STATES.MIRRORLAND_FOCUSED ||
          state.current ===
            STATES.MIRRORLAND_WITHDRAWING
            ? STATES.CONSTELLATION
            : state.current,

        orbitFocus:
          state.orbitFocus,

        orbitPreviewFocus:
          state.orbitPreviewFocus,

        orbitPhase:
          state.orbitPhase,

        orbitRevision:
          state.orbitRevision,

        orbitOrientation:
          freezeOrientation(
            state.orbitOrientation
          ),

        committedOrbitOrientation:
          freezeOrientation(
            state.committedOrbitOrientation
          ),

        clusters:
          Object.freeze(
            clusters
          ),

        selectedCardinal:
          state.selectedCardinal,

        selectedRoom:
          state.selectedRoom,

        selectedDestinationType:
          state.selectedDestinationType,

        selectedDestinationId:
          state.selectedDestinationId,

        selectedDestinationLabel:
          state.selectedDestinationLabel,

        selectedRoute:
          state.selectedRoute,

        panelDescended:
          state.panelDescended
      });
  }

  function requestMirrorlandReveal() {
    if (
      state.current ===
        STATES.MIRRORLAND_REVEALING ||
      state.current ===
        STATES.MIRRORLAND_FOCUSED ||
      state.current ===
        STATES.MIRRORLAND_WITHDRAWING ||
      state.current ===
        STATES.NAVIGATING
    ) {
      return false;
    }

    const element =
      qs(
        "[data-compass-object='mirrorland']",
        state.root
      );

    if (!element) {
      fail(
        "MIRRORLAND_CONTROL_NOT_FOUND",
        "requestMirrorlandReveal"
      );

      return false;
    }

    preserveCompassState();
    clearMirrorlandTimers();
    clearViewportSchedules();

    setPanelDescended(
      false
    );

    const destination =
      destinationFromElement(
        element
      );

    state.selectedDestinationType =
      "mirrorland";

    state.selectedDestinationId =
      "mirrorland";

    state.selectedDestinationLabel =
      destination.label ||
      "Mirrorland";

    state.selectedRoute =
      destination.route;

    state.mirrorlandTransitionId =
      makeTransitionId(
        "reveal"
      );

    state.mirrorlandState =
      MIRRORLAND_STATES.REVEALING;

    setPanel(
      panelFromMirrorland(
        element
      )
    );

    const committed =
      setState(
        STATES.MIRRORLAND_REVEALING,
        "mirrorland-reveal-requested"
      );

    if (!committed) {
      return false;
    }

    dispatchWindowCommand(
      "DGB_MIRRORLAND_WINDOW_REVEAL_REQUEST",
      {
        transitionId:
          state.mirrorlandTransitionId,

        reducedMotion:
          state.reducedMotion
      }
    );

    state.mirrorlandTimeout =
      globalThis.setTimeout(
        () => {
          if (
            state.current ===
            STATES.MIRRORLAND_REVEALING
          ) {
            handleMirrorlandFailure(
              "MIRRORLAND_REVEAL_TIMEOUT",
              state.mirrorlandTransitionId
            );
          }
        },

        TIMEOUTS.mirrorlandRevealMs
      );

    return true;
  }

  function requestMirrorlandBack() {
    if (
      state.current !==
        STATES.MIRRORLAND_REVEALING &&
      state.current !==
        STATES.MIRRORLAND_FOCUSED
    ) {
      return false;
    }

    clearMirrorlandTimers();
    clearViewportSchedules();

    state.mirrorlandTransitionId =
      makeTransitionId(
        "withdraw"
      );

    state.mirrorlandState =
      MIRRORLAND_STATES.WITHDRAWING;

    const committed =
      setState(
        STATES.MIRRORLAND_WITHDRAWING,
        "mirrorland-withdrawal-requested"
      );

    if (!committed) {
      return false;
    }

    dispatchWindowCommand(
      "DGB_MIRRORLAND_WINDOW_WITHDRAW_REQUEST",
      {
        transitionId:
          state.mirrorlandTransitionId,

        reducedMotion:
          state.reducedMotion
      }
    );

    state.mirrorlandTimeout =
      globalThis.setTimeout(
        () => {
          if (
            state.current ===
            STATES.MIRRORLAND_WITHDRAWING
          ) {
            handleMirrorlandFailure(
              "MIRRORLAND_WITHDRAWAL_TIMEOUT",
              state.mirrorlandTransitionId
            );
          }
        },

        TIMEOUTS.mirrorlandWithdrawalMs
      );

    return true;
  }

  function applyClusterSnapshots(
    snapshots
  ) {
    if (
      !snapshots ||
      typeof snapshots !==
        "object"
    ) {
      return;
    }

    WINGS.forEach(
      wing => {
        const source =
          snapshots[wing];

        const cluster =
          getCluster(
            wing
          );

        if (
          !source ||
          !cluster
        ) {
          return;
        }

        cluster.primaryRoom =
          clusterContainsRoom(
            cluster,
            source.primaryRoom
          )
            ? source.primaryRoom
            : cluster.roomIds[0] ||
              "";

        cluster.previewPrimaryRoom =
          clusterContainsRoom(
            cluster,
            source.previewPrimaryRoom
          )
            ? source.previewPrimaryRoom
            : cluster.primaryRoom;

        cluster.phase =
          source.phase ||
          ORIENTATION_PHASES.COMMITTED;

        cluster.gestureActive =
          false;

        cluster.revision =
          finiteNumber(
            source.revision,
            cluster.revision
          );

        cluster.orientation =
          cloneOrientation(
            source.orientation
          );

        cluster.committedOrientation =
          cloneOrientation(
            source.committedOrientation
          );

        cluster.gestureOrigin =
          null;
      }
    );
  }

  function applyPreservedState(
    preserved
  ) {
    state.current =
      preserved.current;

    state.orbitFocus =
      normalizeWing(
        preserved.orbitFocus
      ) ||
      "north";

    state.orbitPreviewFocus =
      normalizeWing(
        preserved.orbitPreviewFocus
      ) ||
      state.orbitFocus;

    state.orbitPhase =
      preserved.orbitPhase ||
      ORIENTATION_PHASES.COMMITTED;

    state.orbitRevision =
      finiteNumber(
        preserved.orbitRevision,
        state.orbitRevision
      );

    state.orbitOrientation =
      cloneOrientation(
        preserved.orbitOrientation
      );

    state.committedOrbitOrientation =
      cloneOrientation(
        preserved.committedOrbitOrientation
      );

    state.orbitGestureActive =
      false;

    state.orbitGestureOrigin =
      null;

    applyClusterSnapshots(
      preserved.clusters
    );

    state.selectedCardinal =
      preserved.selectedCardinal;

    state.selectedRoom =
      preserved.selectedRoom;

    state.selectedDestinationType =
      preserved.selectedDestinationType;

    state.selectedDestinationId =
      preserved.selectedDestinationId;

    state.selectedDestinationLabel =
      preserved.selectedDestinationLabel;

    state.selectedRoute =
      preserved.selectedRoute;

    setPanelDescended(
      Boolean(
        preserved.panelDescended
      )
    );
  }

  function normalizeRestoredState() {
    if (
      state.current ===
        STATES.ROOM_SELECTED &&
      state.selectedRoom &&
      findRoomDeclaration(
        state.selectedRoom
      )
    ) {
      return;
    }

    if (
      state.current ===
        STATES.CLUSTER_OPEN &&
      state.selectedCardinal &&
      findCardinalElement(
        state.selectedCardinal
      )
    ) {
      setPanelDescended(
        false
      );

      return;
    }

    state.current =
      STATES.CONSTELLATION;

    resetSelection();
  }

  function restorePreservedCompassState() {
    const preserved =
      state.preserved;

    state.preserved =
      null;

    state.mirrorlandState =
      MIRRORLAND_STATES.DORMANT;

    state.mirrorlandTransitionId =
      "";

    clearViewportSchedules();

    if (!preserved) {
      resetSelection();

      state.current =
        STATES.CONSTELLATION;

      setConstellationOrientation(
        canonicalConstellationOrientation(
          state.orbitFocus ||
          "north"
        ),
        {
          committed:
            true,

          phase:
            ORIENTATION_PHASES.COMMITTED,

          gestureActive:
            false
        }
      );

      setPanel(
        DEFAULT_PANEL
      );

      syncPresentation();

      emitReceipt({
        lastAction:
          "mirrorland-withdrawal-complete-default",

        lastFailure:
          null
      });

      return;
    }

    applyPreservedState(
      preserved
    );

    normalizeRestoredState();
    restorePanelForCurrentState();
    syncPresentation();

    emitReceipt({
      lastAction:
        "mirrorland-withdrawal-complete-restored",

      lastFailure:
        null
    });
  }

  function requestEnterSelection() {
    if (!state.selectedRoute) {
      return false;
    }

    if (
      state.selectedDestinationType ===
        "mirrorland" &&
      state.current !==
        STATES.MIRRORLAND_FOCUSED
    ) {
      return false;
    }

    if (
      state.current !==
        STATES.CLUSTER_OPEN &&
      state.current !==
        STATES.ROOM_SELECTED &&
      state.current !==
        STATES.MIRRORLAND_FOCUSED
    ) {
      return false;
    }

    const route =
      normalizeRoute(
        state.selectedRoute
      );

    if (!route) {
      fail(
        "INVALID_SELECTED_ROUTE",
        "requestEnterSelection"
      );

      return false;
    }

    clearViewportSchedules();
    cancelAllGestures(
      "navigation"
    );

    const committed =
      setState(
        STATES.NAVIGATING,
        `navigate:${route}`
      );

    if (!committed) {
      return false;
    }

    globalThis.location.assign(
      route
    );

    return true;
  }

  function dispatchWindowCommand(
    type,
    detail
  ) {
    globalThis.dispatchEvent(
      new CustomEvent(
        type,
        {
          detail:
            Object.freeze({
              ...detail
            })
        }
      )
    );
  }

  function handleMirrorlandRevealComplete(
    event
  ) {
    const detail =
      event.detail ||
      {};

    if (
      state.current !==
        STATES.MIRRORLAND_REVEALING ||
      !detail.transitionId ||
      detail.transitionId !==
        state.mirrorlandTransitionId
    ) {
      return;
    }

    clearMirrorlandTimers();

    state.mirrorlandState =
      MIRRORLAND_STATES.FOCUSED;

    setState(
      STATES.MIRRORLAND_FOCUSED,
      "mirrorland-reveal-complete"
    );
  }

  function handleMirrorlandWithdrawalComplete(
    event
  ) {
    const detail =
      event.detail ||
      {};

    if (
      state.current !==
        STATES.MIRRORLAND_WITHDRAWING ||
      !detail.transitionId ||
      detail.transitionId !==
        state.mirrorlandTransitionId
    ) {
      return;
    }

    clearMirrorlandTimers();
    restorePreservedCompassState();
  }

  function handleMirrorlandFailure(
    reason,
    transitionId
  ) {
    if (
      transitionId &&
      state.mirrorlandTransitionId &&
      transitionId !==
        state.mirrorlandTransitionId
    ) {
      return;
    }

    clearMirrorlandTimers();
    clearViewportSchedules();

    state.mirrorlandState =
      MIRRORLAND_STATES.DORMANT;

    state.mirrorlandTransitionId =
      "";

    const preserved =
      state.preserved;

    state.preserved =
      null;

    if (preserved) {
      applyPreservedState(
        preserved
      );

      normalizeRestoredState();
      restorePanelForCurrentState();
    } else {
      state.current =
        STATES.CONSTELLATION;

      resetSelection();

      setConstellationOrientation(
        state.committedOrbitOrientation ||
        canonicalConstellationOrientation(
          state.orbitFocus
        ),
        {
          committed:
            true,

          phase:
            ORIENTATION_PHASES.COMMITTED,

          gestureActive:
            false
        }
      );

      setPanel(
        DEFAULT_PANEL
      );
    }

    syncPresentation();

    emitReceipt({
      status:
        "available",

      lastAction:
        "mirrorland-failure-compass-preserved",

      lastFailure:
        String(
          reason ||
          "MIRRORLAND_RENDER_FAILURE"
        )
    });
  }

  function handleMirrorlandFailureEvent(
    event
  ) {
    const detail =
      event.detail ||
      {};

    handleMirrorlandFailure(
      detail.reason ||
      "MIRRORLAND_RENDER_FAILURE",

      detail.transitionId ||
      ""
    );
  }

  function handleCrystalsFailureEvent(
    event
  ) {
    const detail =
      event.detail ||
      {};

    cancelAllGestures(
      "crystals-render-failure"
    );

    emitReceipt({
      status:
        "available",

      lastAction:
        "crystals-render-failure-semantic-fallback-active",

      lastFailure:
        detail.reason ||
        "COMPASS_CRYSTALS_RENDER_FAILURE"
    });

    setGuidance(
      "The visual star field is temporarily unavailable. Semantic Compass controls remain active."
    );
  }

  function handleSemanticDestination(
    event
  ) {
    const control =
      event.target.closest(
        "[data-compass-destination]"
      );

    if (
      !control ||
      !state.root.contains(
        control
      )
    ) {
      return;
    }

    const type =
      String(
        control.dataset.destinationType ||
        ""
      ).toLowerCase();

    if (type === "mirrorland") {
      event.preventDefault();
      requestMirrorlandReveal();
      return;
    }

    if (
      control.matches(
        "[data-compass-cardinal]"
      )
    ) {
      event.preventDefault();

      requestCardinalSelection(
        control.dataset.wing ||
        control.dataset.cardinalId
      );

      return;
    }

    if (
      control.matches(
        "[data-compass-room]"
      )
    ) {
      event.preventDefault();

      requestRoomSelection(
        control.dataset.roomId
      );
    }
  }

  function bindPanelControls() {
    if (state.enterButton) {
      state.enterButton.addEventListener(
        "click",
        () => {
          requestEnterSelection();
        }
      );
    }

    if (state.returnButton) {
      state.returnButton.addEventListener(
        "click",
        () => {
          requestReturnToOrbit();
        }
      );
    }

    if (state.mirrorlandBackButton) {
      state.mirrorlandBackButton.addEventListener(
        "click",
        () => {
          requestMirrorlandBack();
        }
      );
    }
  }

  function bindSemanticControls() {
    state.root.addEventListener(
      "click",
      handleSemanticDestination
    );
  }

  function bindRendererEvents() {
    globalThis.addEventListener(
      "MIRRORLAND_WINDOW_REVEAL_COMPLETE",
      handleMirrorlandRevealComplete
    );

    globalThis.addEventListener(
      "MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE",
      handleMirrorlandWithdrawalComplete
    );

    globalThis.addEventListener(
      "MIRRORLAND_WINDOW_RENDER_FAILURE",
      handleMirrorlandFailureEvent
    );

    globalThis.addEventListener(
      "COMPASS_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailureEvent
    );
  }

  function activateLensTab(
    tab
  ) {
    const set =
      tab.closest(
        "[data-compass-lens-set]"
      );

    if (!set) {
      return;
    }

    const requested =
      tab.dataset.compassLensTab;

    qsa(
      "[data-compass-lens-tab]",
      set
    ).forEach(
      candidate => {
        const selected =
          candidate === tab;

        candidate.setAttribute(
          "aria-selected",
          selected
            ? "true"
            : "false"
        );

        candidate.tabIndex =
          selected
            ? 0
            : -1;
      }
    );

    qsa(
      "[data-compass-lens-panel]",
      set
    ).forEach(
      panel => {
        panel.hidden =
          panel.dataset.compassLensPanel !==
          requested;
      }
    );
  }

  function bindLensTabs() {
    qsa(
      "[data-compass-lens-set]",
      state.root
    ).forEach(
      set => {
        const tabs =
          qsa(
            "[data-compass-lens-tab]",
            set
          );

        tabs.forEach(
          (
            tab,
            index
          ) => {
            tab.tabIndex =
              tab.getAttribute(
                "aria-selected"
              ) === "true"
                ? 0
                : -1;

            tab.addEventListener(
              "click",
              () => {
                activateLensTab(
                  tab
                );
              }
            );

            tab.addEventListener(
              "keydown",
              event => {
                if (
                  event.key !==
                    "ArrowRight" &&
                  event.key !==
                    "ArrowLeft" &&
                  event.key !==
                    "Home" &&
                  event.key !==
                    "End"
                ) {
                  return;
                }

                event.preventDefault();

                let nextIndex =
                  index;

                if (
                  event.key ===
                  "ArrowRight"
                ) {
                  nextIndex =
                    (
                      index + 1
                    ) %
                    tabs.length;
                }

                if (
                  event.key ===
                  "ArrowLeft"
                ) {
                  nextIndex =
                    (
                      index -
                      1 +
                      tabs.length
                    ) %
                    tabs.length;
                }

                if (
                  event.key ===
                  "Home"
                ) {
                  nextIndex =
                    0;
                }

                if (
                  event.key ===
                  "End"
                ) {
                  nextIndex =
                    tabs.length - 1;
                }

                activateLensTab(
                  tabs[nextIndex]
                );

                tabs[nextIndex]
                  .focus();
              }
            );
          }
        );
      }
    );
  }

  function readReducedMotion() {
    state.reducedMotion =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ||
      state.root.dataset.reducedMotion ===
        "true";
  }

  function clusterFrameSnapshot(
    cluster
  ) {
    if (!cluster) {
      return null;
    }

    return Object.freeze({
      wing:
        cluster.wing,

      roomIds:
        Object.freeze(
          cluster.roomIds.slice()
        ),

      primaryRoom:
        cluster.primaryRoom,

      previewPrimaryRoom:
        cluster.previewPrimaryRoom,

      phase:
        cluster.phase,

      gestureActive:
        cluster.gestureActive,

      revision:
        cluster.revision,

      orientation:
        freezeOrientation(
          cluster.orientation
        ),

      committedOrientation:
        freezeOrientation(
          cluster.committedOrientation
        )
    });
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER =
      Object.freeze({
        contract:
          CONTRACT,

        constellationOrbit:
          CONSTELLATION_ORBIT,

        clusterOrbit:
          CLUSTER_ORBIT,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT,

              orbitQuaternion:
                Object.freeze(
                  Array.from(
                    RECEIPT.orbitQuaternion
                  )
                ),

              clusterQuaternion:
                Object.freeze(
                  Array.from(
                    RECEIPT.clusterQuaternion
                  )
                )
            }),

        beginOrbitGesture,

        requestOrbitPreview,

        requestOrbitCommit,

        requestOrbitCancel,

        requestOrbitFocus,

        beginClusterGesture,

        requestClusterPreview,

        requestClusterCommit,

        requestClusterCancel,

        requestClusterFocus,

        requestAxisSwipe,

        requestCardinalSelection,

        requestRoomSelection,

        requestReturnToOrbit,

        requestReturnToConstellation,

        requestMirrorlandReveal,

        requestMirrorlandBack,

        requestEnterSelection,

        getFrameState:
          () => {
            const cluster =
              activeCluster();

            return Object.freeze({
              state:
                state.current,

              orbitFocus:
                state.orbitFocus,

              orbitPreviewFocus:
                state.orbitPreviewFocus,

              orbitPhase:
                state.orbitPhase,

              orbitGestureActive:
                state.orbitGestureActive,

              orbitRevision:
                state.orbitRevision,

              orbitOrientation:
                freezeOrientation(
                  state.orbitOrientation
                ),

              committedOrbitOrientation:
                freezeOrientation(
                  state.committedOrbitOrientation
                ),

              activeClusterWing:
                cluster
                  ? cluster.wing
                  : "",

              cluster:
                clusterFrameSnapshot(
                  cluster
                ),

              sphericalConstellation:
                CONSTELLATION_ORBIT,

              sphericalCluster:
                CLUSTER_ORBIT,

              selectedCardinal:
                state.selectedCardinal,

              selectedRoom:
                state.selectedRoom,

              selectedDestinationType:
                state.selectedDestinationType,

              selectedDestinationId:
                state.selectedDestinationId,

              selectedDestinationLabel:
                state.selectedDestinationLabel,

              selectedRoute:
                state.selectedRoute,

              panelDescended:
                state.panelDescended,

              mirrorlandState:
                state.mirrorlandState,

              mirrorlandTransitionId:
                state.mirrorlandTransitionId,

              reducedMotion:
                state.reducedMotion,

              prominence:
                Object.freeze({
                  ...prominenceFor(
                    state.current
                  )
                })
            });
          },

        getClusterState:
          wing =>
            clusterFrameSnapshot(
              getCluster(
                wing
              )
            )
      });
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-compass-root]"
      );

    if (!state.root) {
      throw new Error(
        "COMPASS_ROOT_NOT_FOUND"
      );
    }

    state.scene =
      qs(
        "[data-compass-scene]",
        state.root
      );

    state.panel =
      qs(
        "[data-compass-panel]",
        state.root
      );

    state.panelEyebrow =
      qs(
        "[data-compass-panel-eyebrow]",
        state.root
      );

    state.panelTitle =
      qs(
        "[data-compass-panel-title]",
        state.root
      );

    state.panelPurpose =
      qs(
        "[data-compass-panel-purpose]",
        state.root
      );

    state.panelRelationship =
      qs(
        "[data-compass-panel-relationship]",
        state.root
      );

    state.enterButton =
      qs(
        "[data-compass-enter]",
        state.root
      );

    state.enterLabel =
      qs(
        "[data-compass-enter-label]",
        state.root
      );

    state.returnButton =
      qs(
        "[data-compass-return-to-orbit]",
        state.root
      );

    state.mirrorlandBackButton =
      qs(
        "[data-compass-mirrorland-back]",
        state.root
      );

    state.guidance =
      qs(
        "[data-compass-guidance]",
        state.root
      );

    state.controllerReceiptOutput =
      qs(
        "[data-compass-controller-receipt]",
        state.root
      );

    if (!state.scene) {
      throw new Error(
        "COMPASS_SCENE_NOT_FOUND"
      );
    }

    if (!state.panel) {
      throw new Error(
        "COMPASS_PANEL_NOT_FOUND"
      );
    }
  }

  function initializeConstellationState() {
    const requestedFocus =
      normalizeWing(
        state.root.dataset.orbitFocus
      ) ||
      "north";

    let initialOrientation =
      canonicalConstellationOrientation(
        requestedFocus
      );

    const serialized =
      String(
        state.root.dataset.orbitQuaternion ||
        ""
      ).trim();

    if (serialized) {
      try {
        initialOrientation =
          orientationFromQuaternion(
            JSON.parse(serialized),
            requestedFocus
          );
      } catch (_) {}
    }

    state.orbitFocus =
      requestedFocus;

    state.orbitPreviewFocus =
      requestedFocus;

    state.orbitPhase =
      ORIENTATION_PHASES.COMMITTED;

    state.orbitGestureActive =
      false;

    state.orbitRevision =
      finiteNumber(
        state.root.dataset.orbitRevision,
        0
      );

    state.orbitOrientation =
      cloneOrientation(
        initialOrientation
      );

    state.committedOrbitOrientation =
      cloneOrientation(
        initialOrientation
      );

    state.orbitGestureOrigin =
      null;
  }

  function initializeClusterStates() {
    state.clusters.clear();

    WINGS.forEach(
      wing => {
        const cluster =
          createClusterState(
            wing
          );

        cluster.roomIds =
          qsa(
            `[data-compass-room-declarations] [data-compass-room][data-wing="${wing}"]`,
            state.root
          )
            .map(
              element =>
                normalizeRoomId(
                  element.dataset.roomId
                )
            )
            .filter(Boolean);

        if (!cluster.roomIds.length) {
          throw new Error(
            `CLUSTER_ROOM_DECLARATIONS_MISSING:${wing}`
          );
        }

        cluster.primaryRoom =
          cluster.roomIds[0];

        cluster.previewPrimaryRoom =
          cluster.roomIds[0];

        cluster.phase =
          ORIENTATION_PHASES.COMMITTED;

        cluster.orientation =
          orientationFromQuaternion(
            QUATERNION.identity,
            cluster.primaryRoom
          );

        cluster.committedOrientation =
          cloneOrientation(
            cluster.orientation
          );

        state.clusters.set(
          wing,
          cluster
        );
      }
    );

    const roomCount =
      Array.from(
        state.clusters.values()
      ).reduce(
        (
          total,
          cluster
        ) =>
          total +
          cluster.roomIds.length,
        0
      );

    if (roomCount !== 19) {
      throw new Error(
        `CLUSTER_ROOM_COUNT_INVALID:${roomCount}`
      );
    }
  }

  function init() {
    try {
      resolveDom();
      readReducedMotion();
      initializeConstellationState();
      initializeClusterStates();
      exposeApi();
      bindSemanticControls();
      bindPanelControls();
      bindRendererEvents();
      bindLensTabs();

      state.current =
        STATES.CONSTELLATION;

      state.mirrorlandState =
        MIRRORLAND_STATES.DORMANT;

      resetSelection();

      setPanel(
        DEFAULT_PANEL
      );

      syncPresentation();

      state.initialized =
        true;

      emitReceipt({
        status:
          "available",

        lastAction:
          "controller-initialized-spherical-constellation-and-clusters",

        lastFailure:
          null,

        sphericalConstellationEnabled:
          true,

        sphericalClustersEnabled:
          true
      });
    } catch (error) {
      const reason =
        error &&
        error.message
          ? error.message
          : String(error);

      RECEIPT.status =
        "held";

      RECEIPT.lastFailure =
        `CONTROLLER_INIT_FAILURE:${reason}`;

      globalThis.DGB_COMPASS_CONTROLLER_RECEIPT =
        Object.freeze({
          ...RECEIPT
        });

      globalThis.dispatchEvent(
        new CustomEvent(
          "COMPASS_CONTROLLER_FAILURE",
          {
            detail:
              Object.freeze({
                reason:
                  RECEIPT.lastFailure
              })
          }
        )
      );
    }
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );
  } else {
    init();
  }
})();
