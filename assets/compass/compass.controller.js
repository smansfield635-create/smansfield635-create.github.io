/* /assets/compass/compass.controller.js
   Diamond Gate Bridge Compass
   Controller authority for state, selection, panel presentation,
   spherical orbit commitment, Mirrorland lifecycle, navigation,
   lens tabs, and receipts.

   Spherical-orbit correction scope:
   - Preserve the existing controller state model, routes, room declarations,
     cardinal declarations, panel descent, Return To Orbit behavior,
     Mirrorland lifecycle, navigation, lens tabs, and receipts.
   - Replace the former flat four-step axis command with a committed
     three-dimensional spherical-orientation contract.
   - Preserve orbitFocus as the committed primary cardinal.
   - Expose preview, commit, cancel, and direct-focus orbit APIs for the
     crystal renderer.
   - Accept normalized quaternions as the authoritative orientation form.
   - Preserve yaw, pitch, roll, revision, gesture, and primary-cardinal
     telemetry for inspection and renderer synchronization.
   - Keep continuous pointer tracking and visual projection in
     compass.crystals.js.
   - Keep a drag-to-primary action distinct from tapping a cardinal to open
     its cluster.
   - Prevent an ordinary spherical drag from closing an open cluster.
   - Preserve committed spherical orientation through Mirrorland reveal,
     focus, withdrawal, renderer failure, and state restoration.
   - Descend into the page panel after room-star selection.
   - Return the viewport to the Compass scene after Return To Orbit.
   - Keep Return To Orbit distinct from constellation manipulation.
   - Restore cardinal or room panel content after Mirrorland withdrawal
     and Mirrorland renderer failure.
   - Keep Back available during Mirrorland reveal and focus.
   - Ensure panelDescended describes an actual page descent rather than
     the mere presence of a selected destination.

   This file does not:
   - Render crystals.
   - Project spherical coordinates.
   - Bind pointer gestures.
   - Calculate rendered hit targets.
   - Own Mirrorland geometry.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "DGB_COMPASS_CONTROLLER_SPHERICAL_ORBIT_REBUILD_v2",

    previousId:
      "DGB_COMPASS_CONTROLLER_FIVE_FILE_REBUILD_v1",

    file:
      "/assets/compass/compass.controller.js",

    releaseId:
      "dgb-compass-spherical-orbit-v2",

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

  const ORBIT_PHASES = Object.freeze({
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

  const LEGACY_ORBIT_SEQUENCE =
    Object.freeze([
      "north",
      "east",
      "south",
      "west"
    ]);

  const SPHERICAL_ORBIT = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    orientationRepresentation:
      "UNIT_QUATERNION",

    xAxis:
      "horizontal",

    yAxis:
      "vertical",

    zAxis:
      "viewer-depth",

    frontDirection:
      Object.freeze([
        0,
        0,
        1
      ]),

    upDirection:
      Object.freeze([
        0,
        1,
        0
      ]),

    minimumQuaternionLength:
      1e-8,

    maximumPitchRadians:
      Math.PI * 0.46,

    minimumPitchRadians:
      -Math.PI * 0.46,

    canonicalRollRadians:
      0,

    allowPreviewInStates:
      Object.freeze([
        STATES.CONSTELLATION
      ]),

    allowCommitInStates:
      Object.freeze([
        STATES.CONSTELLATION
      ]),

    directCardinalSelectionCommitsFocus:
      true,

    dragCommitOpensCluster:
      false,

    dragCommitClosesCluster:
      false,

    clusterRotationEnabled:
      false,

    roomRotationEnabled:
      false
  });

  const CANONICAL_FOCUS_EULER =
    Object.freeze({
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
      6000,

    rendererReadyMs:
      3000
  });

  const DEFAULT_PANEL = Object.freeze({
    eyebrow:
      "Selected path",

    title:
      "Choose a star",

    purpose:
      "Tap a star to open its cluster.",

    relationship:
      "Drag the constellation like a globe to bring a cardinal star forward. Tap the primary star to open its cluster."
  });

  const GUIDANCE = Object.freeze({
    CONSTELLATION:
      "Drag any star, label, or open part of the constellation to rotate the shared sphere. Release to make the nearest front-facing cardinal primary. Tap a star to open its cluster.",

    CLUSTER_OPEN:
      "Tap a room star to inspect its path. Return To Orbit restores the open cluster after room inspection. Spherical constellation rotation resumes after returning to the constellation.",

    ROOM_SELECTED:
      "Inspect the selected path. Use Enter Room to navigate, or Return To Orbit to reopen the cluster.",

    MIRRORLAND_DORMANT:
      "Activate the center threshold to reveal Mirrorland without losing your Compass position.",

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
      ORBIT_PHASES.IDLE,

    orbitGestureActive:
      false,

    orbitRevision:
      0,

    orbitYaw:
      0,

    orbitPitch:
      0,

    orbitRoll:
      0,

    orbitQuaternion:
      Object.freeze([
        0,
        0,
        0,
        1
      ]),

    sphericalOrbitEnabled:
      true,

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
      ORBIT_PHASES.IDLE,

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

    rendererReadyTimeout:
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

    return Number.isFinite(
      number
    )
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

    return WINGS.includes(
      wing
    )
      ? wing
      : "";
  }

  function normalizeRoute(
    value
  ) {
    const route =
      String(value || "")
        .trim();

    return route.startsWith(
      "/"
    )
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

    while (
      angle > Math.PI
    ) {
      angle -=
        Math.PI * 2;
    }

    while (
      angle < -Math.PI
    ) {
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
    fallback = [
      0,
      0,
      0,
      1
    ]
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (
      source.length !==
      4
    ) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(
        source[0],
        0
      ),

      finiteNumber(
        source[1],
        0
      ),

      finiteNumber(
        source[2],
        0
      ),

      finiteNumber(
        source[3],
        1
      )
    ];

    const length =
      quaternionLength(
        quaternion
      );

    if (
      !Number.isFinite(length) ||
      length <
        SPHERICAL_ORBIT
          .minimumQuaternionLength
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component /
        length
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
        finiteNumber(
          pitch,
          0
        ),

        SPHERICAL_ORBIT
          .minimumPitchRadians,

        SPHERICAL_ORBIT
          .maximumPitchRadians
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
      Math.abs(sinPitch) >=
        1
        ? Math.sign(
            sinPitch
          ) *
          Math.PI /
          2
        : Math.asin(
            sinPitch
          );

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

          SPHERICAL_ORBIT
            .minimumPitchRadians,

          SPHERICAL_ORBIT
            .maximumPitchRadians
        ),

      roll:
        wrapRadians(roll)
    };
  }

  function orientationFromEuler(
    yaw,
    pitch,
    roll,
    primaryWing = ""
  ) {
    const safeYaw =
      wrapRadians(yaw);

    const safePitch =
      clamp(
        finiteNumber(
          pitch,
          0
        ),

        SPHERICAL_ORBIT
          .minimumPitchRadians,

        SPHERICAL_ORBIT
          .maximumPitchRadians
      );

    const safeRoll =
      wrapRadians(roll);

    return {
      yaw:
        safeYaw,

      pitch:
        safePitch,

      roll:
        safeRoll,

      quaternion:
        quaternionFromEuler(
          safeYaw,
          safePitch,
          safeRoll
        ),

      primaryWing:
        normalizeWing(
          primaryWing
        )
    };
  }

  function orientationFromQuaternion(
    quaternion,
    primaryWing = ""
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

      primaryWing:
        normalizeWing(
          primaryWing
        )
    };
  }

  function canonicalOrientationForWing(
    wing
  ) {
    const normalized =
      normalizeWing(
        wing
      ) ||
      "north";

    const canonical =
      CANONICAL_FOCUS_EULER[
        normalized
      ];

    return orientationFromEuler(
      canonical.yaw,
      canonical.pitch,
      canonical.roll,
      normalized
    );
  }

  function cloneOrientation(
    orientation
  ) {
    const source =
      orientation ||
      canonicalOrientationForWing(
        "north"
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

      primaryWing:
        normalizeWing(
          source.primaryWing
        )
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

      primaryWing:
        clone.primaryWing
    });
  }

  function resolveOrbitOrientation(
    payload,
    fallbackOrientation
  ) {
    const fallback =
      cloneOrientation(
        fallbackOrientation
      );

    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      return fallback;
    }

    const primaryWing =
      normalizeWing(
        payload.primaryWing ||
        payload.orbitFocus ||
        payload.focus ||
        fallback.primaryWing
      );

    if (
      Array.isArray(
        payload.quaternion
      ) ||
      ArrayBuffer.isView(
        payload.quaternion
      )
    ) {
      return orientationFromQuaternion(
        payload.quaternion,
        primaryWing
      );
    }

    if (
      payload.orientation &&
      (
        Array.isArray(
          payload.orientation
            .quaternion
        ) ||
        ArrayBuffer.isView(
          payload.orientation
            .quaternion
        )
      )
    ) {
      return orientationFromQuaternion(
        payload.orientation
          .quaternion,

        primaryWing ||
        payload.orientation
          .primaryWing
      );
    }

    const yaw =
      payload.yaw !==
        undefined
        ? payload.yaw
        : fallback.yaw;

    const pitch =
      payload.pitch !==
        undefined
        ? payload.pitch
        : fallback.pitch;

    const roll =
      payload.roll !==
        undefined
        ? payload.roll
        : fallback.roll;

    return orientationFromEuler(
      yaw,
      pitch,
      roll,
      primaryWing
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

  function canManipulateOrbit() {
    return (
      SPHERICAL_ORBIT
        .allowPreviewInStates
        .includes(
          state.current
        ) &&
      state.mirrorlandState ===
        MIRRORLAND_STATES.DORMANT
    );
  }

  function canCommitOrbit() {
    return (
      SPHERICAL_ORBIT
        .allowCommitInStates
        .includes(
          state.current
        ) &&
      state.mirrorlandState ===
        MIRRORLAND_STATES.DORMANT
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
    if (
      state.panelEyebrow
    ) {
      state.panelEyebrow.textContent =
        eyebrow ||
        DEFAULT_PANEL.eyebrow;
    }

    if (
      state.panelTitle
    ) {
      state.panelTitle.textContent =
        title ||
        DEFAULT_PANEL.title;
    }

    if (
      state.panelPurpose
    ) {
      state.panelPurpose.textContent =
        purpose ||
        DEFAULT_PANEL.purpose;
    }

    if (
      state.panelRelationship
    ) {
      state.panelRelationship.textContent =
        relationship ||
        DEFAULT_PANEL.relationship;
    }
  }

  function setGuidance(
    message
  ) {
    if (
      state.guidance
    ) {
      state.guidance.textContent =
        message ||
        "";
    }
  }

  function prominenceFor(
    currentState
  ) {
    return (
      PROMINENCE[
        currentState
      ] ||
      PROMINENCE[
        STATES.HELD
      ]
    );
  }

  function clearPanelDescentSchedule() {
    if (
      state.panelDescentFrame
    ) {
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
    if (
      state.sceneAscentFrame
    ) {
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
      String(
        expectedRoomId ||
        ""
      ).trim();

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

  function setOrbitOrientation(
    orientation,
    {
      committed = false,
      phase =
        ORBIT_PHASES.PREVIEW,

      gestureActive =
        false,

      incrementRevision =
        false
    } = {}
  ) {
    const normalized =
      cloneOrientation(
        orientation
      );

    state.orbitOrientation =
      normalized;

    state.orbitPreviewFocus =
      normalized.primaryWing ||
      state.orbitPreviewFocus ||
      state.orbitFocus ||
      "north";

    state.orbitPhase =
      phase;

    state.orbitGestureActive =
      Boolean(
        gestureActive
      );

    if (
      incrementRevision
    ) {
      state.orbitRevision +=
        1;
    }

    if (committed) {
      state.committedOrbitOrientation =
        cloneOrientation(
          normalized
        );

      const committedWing =
        normalizeWing(
          normalized.primaryWing
        );

      if (committedWing) {
        state.orbitFocus =
          committedWing;

        state.orbitPreviewFocus =
          committedWing;
      }
    }
  }

  function beginOrbitGesture(
    payload = {}
  ) {
    if (
      !canManipulateOrbit()
    ) {
      return false;
    }

    if (
      state.orbitGestureActive
    ) {
      return true;
    }

    state.orbitGestureOrigin =
      cloneOrientation(
        state.committedOrbitOrientation ||
        state.orbitOrientation
      );

    state.orbitGestureActive =
      true;

    state.orbitPhase =
      ORBIT_PHASES.PREVIEW;

    if (
      payload &&
      typeof payload ===
        "object"
    ) {
      const preview =
        resolveOrbitOrientation(
          payload,
          state.orbitOrientation
        );

      setOrbitOrientation(
        preview,
        {
          committed:
            false,

          phase:
            ORBIT_PHASES.PREVIEW,

          gestureActive:
            true
        }
      );
    }

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
      !canManipulateOrbit()
    ) {
      return false;
    }

    if (
      !state.orbitGestureActive
    ) {
      beginOrbitGesture();
    }

    const orientation =
      resolveOrbitOrientation(
        payload,
        state.orbitOrientation
      );

    setOrbitOrientation(
      orientation,
      {
        committed:
          false,

        phase:
          ORBIT_PHASES.PREVIEW,

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
      !canCommitOrbit()
    ) {
      return false;
    }

    const orientation =
      resolveOrbitOrientation(
        payload,
        state.orbitOrientation ||
        state.committedOrbitOrientation
      );

    const requestedWing =
      normalizeWing(
        payload.primaryWing ||
        payload.orbitFocus ||
        payload.focus ||
        orientation.primaryWing ||
        state.orbitPreviewFocus ||
        state.orbitFocus
      );

    if (!requestedWing) {
      emitReceipt({
        lastAction:
          "orbit-commit-rejected",

        lastFailure:
          "ORBIT_PRIMARY_WING_REQUIRED"
      });

      return false;
    }

    orientation.primaryWing =
      requestedWing;

    setOrbitOrientation(
      orientation,
      {
        committed:
          true,

        phase:
          ORBIT_PHASES.COMMITTED,

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
        `orbit-committed:${requestedWing}`,

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
    reason =
      "cancelled"
  ) {
    if (
      !state.orbitGestureActive &&
      state.orbitPhase !==
        ORBIT_PHASES.PREVIEW
    ) {
      return false;
    }

    const restored =
      cloneOrientation(
        state.orbitGestureOrigin ||
        state.committedOrbitOrientation ||
        canonicalOrientationForWing(
          state.orbitFocus
        )
      );

    setOrbitOrientation(
      restored,
      {
        committed:
          false,

        phase:
          ORBIT_PHASES.CANCELLED,

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
      !canCommitOrbit()
    ) {
      return false;
    }

    const canonical =
      canonicalOrientationForWing(
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

  function requestAxisSwipe(
    axis
  ) {
    if (
      !canCommitOrbit()
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
        LEGACY_ORBIT_SEQUENCE
          .indexOf(
            currentWing
          )
      );

    let step =
      1;

    if (
      normalized ===
        "vertical" ||
      normalized ===
        "up" ||
      normalized ===
        "left" ||
      normalized ===
        "swipeup" ||
      normalized ===
        "swipeleft"
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

    const nextWing =
      LEGACY_ORBIT_SEQUENCE[
        nextIndex
      ];

    return requestOrbitFocus(
      nextWing,
      {
        source:
          `legacy-axis:${normalized || "unspecified"}`
      }
    );
  }

  function syncDatasets() {
    if (
      !state.root
    ) {
      return;
    }

    const prominence =
      prominenceFor(
        state.current
      );

    const orientation =
      cloneOrientation(
        state.orbitOrientation ||
        canonicalOrientationForWing(
          state.orbitFocus
        )
      );

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

    state.root.dataset.orbitYaw =
      String(
        orientation.yaw
      );

    state.root.dataset.orbitPitch =
      String(
        orientation.pitch
      );

    state.root.dataset.orbitRoll =
      String(
        orientation.roll
      );

    state.root.dataset.orbitQuaternion =
      JSON.stringify(
        orientation.quaternion
      );

    state.root.dataset.orbitCoordinateSystem =
      SPHERICAL_ORBIT
        .coordinateSystem;

    state.root.dataset.orbitRepresentation =
      SPHERICAL_ORBIT
        .orientationRepresentation;

    state.root.dataset.sphericalOrbitEnabled =
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

    if (
      state.preserved
    ) {
      state.root.dataset.preservedCompassMode =
        state.preserved.current ||
        "";

      state.root.dataset.preservedOrbitFocus =
        state.preserved.orbitFocus ||
        "";

      state.root.dataset.preservedOrbitQuaternion =
        JSON.stringify(
          state.preserved
            .orbitOrientation
            .quaternion
        );

      state.root.dataset.preservedSelectedCardinal =
        state.preserved.selectedCardinal ||
        "";

      state.root.dataset.preservedSelectedRoom =
        state.preserved.selectedRoom ||
        "";
    } else {
      state.root.dataset.preservedCompassMode =
        "";

      state.root.dataset.preservedOrbitFocus =
        "";

      state.root.dataset.preservedOrbitQuaternion =
        "";

      state.root.dataset.preservedSelectedCardinal =
        "";

      state.root.dataset.preservedSelectedRoom =
        "";
    }

    const mirrorlandControl =
      qs(
        "[data-compass-object='mirrorland']",
        state.root
      );

    if (
      mirrorlandControl
    ) {
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
        const selected =
          element.dataset.roomId ===
          state.selectedRoom;

        element.dataset.selected =
          selected
            ? "true"
            : "false";

        if (selected) {
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
    const orientation =
      cloneOrientation(
        state.orbitOrientation ||
        canonicalOrientationForWing(
          state.orbitFocus
        )
      );

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

        orbitYaw:
          orientation.yaw,

        orbitPitch:
          orientation.pitch,

        orbitRoll:
          orientation.roll,

        orbitQuaternion:
          Object.freeze(
            orientation
              .quaternion
              .slice()
          ),

        sphericalOrbitEnabled:
          true,

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

        visualPassClaimed:
          false
      },

      extra
    );

    const serialized =
      JSON.stringify(
        RECEIPT
      );

    if (
      state.root
    ) {
      state.root.dataset.compassControllerReceipt =
        serialized;

      state.root.dataset.compassControllerStatus =
        RECEIPT.status;

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (
      state.controllerReceiptOutput
    ) {
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
              RECEIPT
                .orbitQuaternion
            )
          )
      });
  }

  function fail(
    reason,
    action =
      "controller-failure"
  ) {
    clearMirrorlandTimers();
    clearViewportSchedules();

    requestOrbitCancel(
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
    if (
      state.mirrorlandTimeout
    ) {
      clearTimeout(
        state.mirrorlandTimeout
      );

      state.mirrorlandTimeout =
        0;
    }

    if (
      state.rendererReadyTimeout
    ) {
      clearTimeout(
        state.rendererReadyTimeout
      );

      state.rendererReadyTimeout =
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
        element.dataset
          .destinationType ||
        ""
      )
        .trim()
        .toLowerCase();

    const destinationId =
      String(
        element.dataset
          .destinationId ||
        element.dataset
          .roomId ||
        element.dataset
          .cardinalId ||
        ""
      ).trim();

    const label =
      String(
        element.dataset.label ||
        element.dataset
          .coordinateLabel ||
        element.textContent ||
        ""
      ).trim();

    const route =
      normalizeRoute(
        element.dataset.route ||
        element.getAttribute(
          "href"
        ) ||
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
        element.dataset
          .coordinateLabel ||
        "Selected coordinate",

      title:
        element.dataset
          .panelTitle ||
        element.dataset.title ||
        element.dataset
          .coordinateLabel ||
        "Selected coordinate",

      purpose:
        element.dataset
          .panelBody ||
        element.dataset
          .coordinateFunction ||
        "",

      relationship:
        element.dataset
          .panelWhy ||
        "Inspect this coordinate before entering."
    };
  }

  function panelFromRoom(
    element
  ) {
    return {
      eyebrow:
        element.dataset
          .localCoordinate ||
        "Selected path",

      title:
        element.dataset.label ||
        element.textContent.trim(),

      purpose:
        element.dataset.preview ||
        element.dataset
          .localFunction ||
        "",

      relationship:
        element.dataset
          .whyEnter ||
        "Inspect this path, then enter when ready."
    };
  }

  function panelFromMirrorland(
    element
  ) {
    return {
      eyebrow:
        element.dataset
          .panelEyebrow ||
        element.dataset
          .orbitLabel ||
        "Mirrorland Threshold",

      title:
        element.dataset
          .panelTitle ||
        "Mirrorland",

      purpose:
        element.dataset
          .panelBody ||
        element.dataset
          .coordinateFunction ||
        "",

      relationship:
        element.dataset
          .panelWhy ||
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
      !Object.values(
        STATES
      ).includes(
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

    if (
      mirrorlandActive
    ) {
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
          GUIDANCE
            .MIRRORLAND_REVEALING
        );
      } else if (
        state.current ===
        STATES.MIRRORLAND_FOCUSED
      ) {
        setGuidance(
          GUIDANCE
            .MIRRORLAND_FOCUSED
        );
      } else {
        setGuidance(
          GUIDANCE
            .MIRRORLAND_WITHDRAWING
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
      String(
        roomId ||
        ""
      ).trim();

    if (!id) {
      return null;
    }

    return (
      qs(
        `[data-compass-room-declarations] [data-compass-room][data-room-id="${CSS.escape(id)}"]`,
        state.root
      ) ||
      qs(
        `[data-compass-room][data-room-id="${CSS.escape(id)}"]`,
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

      if (
        cardinal
      ) {
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

    if (
      state.current !==
        STATES.CONSTELLATION &&
      state.current !==
        STATES.CLUSTER_OPEN &&
      state.current !==
        STATES.ROOM_SELECTED
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

    if (
      state.orbitGestureActive
    ) {
      requestOrbitCancel(
        "cardinal-selection"
      );
    }

    if (
      SPHERICAL_ORBIT
        .directCardinalSelectionCommitsFocus &&
      state.current ===
        STATES.CONSTELLATION
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
      element.dataset
        .coordinateLabel ||
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
      String(
        roomId ||
        ""
      ).trim();

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

    if (!wing) {
      fail(
        `ROOM_WING_INVALID:${id}`,
        "requestRoomSelection"
      );

      return false;
    }

    if (
      state.selectedCardinal &&
      wing !==
        state.selectedCardinal
    ) {
      return false;
    }

    clearViewportSchedules();

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

  function requestReturnToConstellation() {
    if (
      state.current !==
        STATES.CLUSTER_OPEN
    ) {
      return false;
    }

    clearViewportSchedules();

    const preservedFocus =
      normalizeWing(
        state.selectedCardinal ||
        state.orbitFocus
      ) ||
      "north";

    resetSelection();

    state.orbitFocus =
      preservedFocus;

    state.orbitPreviewFocus =
      preservedFocus;

    setPanel(
      DEFAULT_PANEL
    );

    return setState(
      STATES.CONSTELLATION,
      `returned-to-constellation:${preservedFocus}`
    );
  }

  function requestReturnToOrbit() {
    if (
      state.current !==
        STATES.ROOM_SELECTED
    ) {
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
      state.selectedCardinal;

    const cardinal =
      findCardinalElement(
        state.selectedCardinal
      );

    if (!cardinal) {
      fail(
        `CARDINAL_NOT_FOUND:${state.selectedCardinal}`,
        "requestReturnToOrbit"
      );

      return false;
    }

    const destination =
      destinationFromElement(
        cardinal
      );

    state.selectedDestinationLabel =
      destination.label ||
      cardinal.dataset
        .coordinateLabel ||
      state.selectedCardinal;

    state.selectedRoute =
      destination.route;

    setPanel(
      panelFromCardinal(
        cardinal
      )
    );

    const wing =
      state.selectedCardinal;

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

  function preserveCompassState() {
    if (
      state.orbitGestureActive
    ) {
      requestOrbitCancel(
        "mirrorland-preserve"
      );
    }

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

        TIMEOUTS
          .mirrorlandRevealMs
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

        TIMEOUTS
          .mirrorlandWithdrawalMs
      );

    return true;
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
      ORBIT_PHASES.COMMITTED;

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
        preserved
          .committedOrbitOrientation
      );

    state.orbitGestureActive =
      false;

    state.orbitGestureOrigin =
      null;

    state.selectedCardinal =
      preserved.selectedCardinal;

    state.selectedRoom =
      preserved.selectedRoom;

    state.selectedDestinationType =
      preserved
        .selectedDestinationType;

    state.selectedDestinationId =
      preserved
        .selectedDestinationId;

    state.selectedDestinationLabel =
      preserved
        .selectedDestinationLabel;

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

      setOrbitOrientation(
        canonicalOrientationForWing(
          state.orbitFocus ||
          "north"
        ),
        {
          committed:
            true,

          phase:
            ORBIT_PHASES.COMMITTED,

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
    if (
      !state.selectedRoute
    ) {
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

      setOrbitOrientation(
        state.committedOrbitOrientation ||
        canonicalOrientationForWing(
          state.orbitFocus
        ),
        {
          committed:
            true,

          phase:
            ORBIT_PHASES.COMMITTED,

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

    if (
      state.orbitGestureActive
    ) {
      requestOrbitCancel(
        "crystals-render-failure"
      );
    }

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
        control.dataset
          .destinationType ||
        ""
      ).toLowerCase();

    if (
      type ===
      "mirrorland"
    ) {
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
        control.dataset
          .cardinalId
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
    if (
      state.enterButton
    ) {
      state.enterButton.addEventListener(
        "click",
        () => {
          requestEnterSelection();
        }
      );
    }

    if (
      state.returnButton
    ) {
      state.returnButton.addEventListener(
        "click",
        () => {
          requestReturnToOrbit();
        }
      );
    }

    if (
      state.mirrorlandBackButton
    ) {
      state.mirrorlandBackButton
        .addEventListener(
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
      tab.dataset
        .compassLensTab;

    qsa(
      "[data-compass-lens-tab]",
      set
    ).forEach(
      candidate => {
        const selected =
          candidate ===
          tab;

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
          panel.dataset
            .compassLensPanel !==
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
              ) ===
                "true"
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
                      index +
                      1
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
                    tabs.length -
                    1;
                }

                activateLensTab(
                  tabs[
                    nextIndex
                  ]
                );

                tabs[
                  nextIndex
                ].focus();
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
      state.root.dataset
        .reducedMotion ===
        "true";
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER =
      Object.freeze({
        contract:
          CONTRACT,

        sphericalOrbit:
          SPHERICAL_ORBIT,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT,

              orbitQuaternion:
                Object.freeze(
                  Array.from(
                    RECEIPT
                      .orbitQuaternion
                  )
                )
            }),

        beginOrbitGesture,

        requestOrbitPreview,

        requestOrbitCommit,

        requestOrbitCancel,

        requestOrbitFocus,

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
            const orientation =
              cloneOrientation(
                state.orbitOrientation
              );

            const committed =
              cloneOrientation(
                state
                  .committedOrbitOrientation
              );

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
                  orientation
                ),

              committedOrbitOrientation:
                freezeOrientation(
                  committed
                ),

              sphericalOrbit:
                SPHERICAL_ORBIT,

              selectedCardinal:
                state.selectedCardinal,

              selectedRoom:
                state.selectedRoom,

              selectedDestinationType:
                state
                  .selectedDestinationType,

              selectedDestinationId:
                state
                  .selectedDestinationId,

              selectedDestinationLabel:
                state
                  .selectedDestinationLabel,

              selectedRoute:
                state.selectedRoute,

              panelDescended:
                state.panelDescended,

              mirrorlandState:
                state.mirrorlandState,

              mirrorlandTransitionId:
                state
                  .mirrorlandTransitionId,

              reducedMotion:
                state.reducedMotion,

              prominence:
                Object.freeze({
                  ...prominenceFor(
                    state.current
                  )
                })
            });
          }
      });
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-compass-root]"
      );

    if (
      !state.root
    ) {
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

    if (
      !state.scene
    ) {
      throw new Error(
        "COMPASS_SCENE_NOT_FOUND"
      );
    }

    if (
      !state.panel
    ) {
      throw new Error(
        "COMPASS_PANEL_NOT_FOUND"
      );
    }
  }

  function initializeOrbitState() {
    const requestedFocus =
      normalizeWing(
        state.root.dataset
          .orbitFocus
      ) ||
      "north";

    let initialOrientation =
      canonicalOrientationForWing(
        requestedFocus
      );

    const datasetQuaternion =
      String(
        state.root.dataset
          .orbitQuaternion ||
        ""
      ).trim();

    if (
      datasetQuaternion
    ) {
      try {
        const parsed =
          JSON.parse(
            datasetQuaternion
          );

        initialOrientation =
          orientationFromQuaternion(
            parsed,
            requestedFocus
          );
      } catch (_) {}
    } else {
      const datasetYaw =
        state.root.dataset
          .orbitYaw;

      const datasetPitch =
        state.root.dataset
          .orbitPitch;

      const datasetRoll =
        state.root.dataset
          .orbitRoll;

      if (
        datasetYaw !==
          undefined ||
        datasetPitch !==
          undefined ||
        datasetRoll !==
          undefined
      ) {
        initialOrientation =
          orientationFromEuler(
            finiteNumber(
              datasetYaw,
              initialOrientation.yaw
            ),

            finiteNumber(
              datasetPitch,
              initialOrientation.pitch
            ),

            finiteNumber(
              datasetRoll,
              initialOrientation.roll
            ),

            requestedFocus
          );
      }
    }

    state.orbitFocus =
      requestedFocus;

    state.orbitPreviewFocus =
      requestedFocus;

    state.orbitPhase =
      ORBIT_PHASES.COMMITTED;

    state.orbitGestureActive =
      false;

    state.orbitRevision =
      finiteNumber(
        state.root.dataset
          .orbitRevision,
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

  function init() {
    try {
      resolveDom();
      readReducedMotion();
      initializeOrbitState();
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
          "controller-initialized-spherical-orbit",

        lastFailure:
          null,

        sphericalOrbitEnabled:
          true,

        orbitContract:
          SPHERICAL_ORBIT
            .orientationRepresentation
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
                  RECEIPT
                    .lastFailure
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
