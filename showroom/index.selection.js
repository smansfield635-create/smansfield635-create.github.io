/* /showroom/index.selection.js
   Showroom primary-star preview and release-settlement bridge.
   Applies the Main Compass nearest-primary and snap-to-anchor model without
   taking controller, compositor, route, or renderer authority.
*/
(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_PRIMARY_SELECTION_AND_SETTLEMENT_v1";

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const CARDINAL_BASE_POSITIONS = Object.freeze({
    north: Object.freeze([0, 1.68, -0.48]),
    east: Object.freeze([1.86, 0, 0.54]),
    south: Object.freeze([0, -1.68, 0.44]),
    west: Object.freeze([-1.86, 0, -0.58])
  });

  const ROOM_BASE_POSITIONS = Object.freeze({
    1: Object.freeze([0, 0.60, -1.38]),
    2: Object.freeze([1.87, 0.414, 0]),
    3: Object.freeze([0, -0.72, 1.33]),
    4: Object.freeze([-1.92, -0.182, 0])
  });

  const PRIMARY_ANCHORS = Object.freeze({
    orbit: Object.freeze([0, 0.78, 0.625]),
    cluster: Object.freeze([0, 0.70, 0.714])
  });

  const state = {
    bound: false,
    pointer: null,
    settleCount: 0,
    previewCount: 0
  };

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeWing(value) {
    const wing = String(value == null ? "" : value).trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function roomOrdinal(roomId) {
    const match = String(roomId == null ? "" : roomId)
      .trim()
      .match(/-(\d+)$/);
    if (!match) return 0;
    const ordinal = Number(match[1]);
    return ordinal >= 1 && ordinal <= 4 ? ordinal : 0;
  }

  function normalizeVector(vector, fallback = [0, 0, 1]) {
    const length = Math.hypot(
      finiteNumber(vector && vector[0], 0),
      finiteNumber(vector && vector[1], 0),
      finiteNumber(vector && vector[2], 0)
    );
    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }
    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function dot(first, second) {
    return (
      first[0] * second[0] +
      first[1] * second[1] +
      first[2] * second[2]
    );
  }

  function cross(first, second) {
    return [
      first[1] * second[2] - first[2] * second[1],
      first[2] * second[0] - first[0] * second[2],
      first[0] * second[1] - first[1] * second[0]
    ];
  }

  function quaternionNormalize(value, fallback = [0, 0, 0, 1]) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value)
      ? Array.from(value)
      : [];
    if (source.length !== 4) return fallback.slice();
    const quaternion = source.map((component, index) =>
      finiteNumber(component, index === 3 ? 1 : 0)
    );
    const length = Math.hypot(...quaternion);
    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }
    return quaternion.map(component => component / length);
  }

  function quaternionMultiplyRaw(first, second) {
    return [
      first[3] * second[0] + first[0] * second[3] + first[1] * second[2] - first[2] * second[1],
      first[3] * second[1] - first[0] * second[2] + first[1] * second[3] + first[2] * second[0],
      first[3] * second[2] + first[0] * second[1] - first[1] * second[0] + first[2] * second[3],
      first[3] * second[3] - first[0] * second[0] - first[1] * second[1] - first[2] * second[2]
    ];
  }

  function quaternionMultiply(first, second) {
    return quaternionNormalize(
      quaternionMultiplyRaw(
        quaternionNormalize(first),
        quaternionNormalize(second)
      )
    );
  }

  function quaternionConjugate(value) {
    const quaternion = quaternionNormalize(value);
    return [
      -quaternion[0],
      -quaternion[1],
      -quaternion[2],
      quaternion[3]
    ];
  }

  function quaternionRotateVector(quaternionValue, vector) {
    const quaternion = quaternionNormalize(quaternionValue);
    const pure = [vector[0], vector[1], vector[2], 0];
    const rotated = quaternionMultiplyRaw(
      quaternionMultiplyRaw(quaternion, pure),
      quaternionConjugate(quaternion)
    );
    return [rotated[0], rotated[1], rotated[2]];
  }

  function quaternionFromAxisAngle(axis, angle) {
    const normalizedAxis = normalizeVector(axis);
    const half = angle * 0.5;
    const sine = Math.sin(half);
    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function quaternionFromUnitVectors(fromVector, toVector) {
    const from = normalizeVector(fromVector);
    const to = normalizeVector(toVector);
    const cosine = Math.max(-1, Math.min(1, dot(from, to)));

    if (cosine > 0.999999) return [0, 0, 0, 1];

    if (cosine < -0.999999) {
      let axis = cross([1, 0, 0], from);
      if (Math.hypot(...axis) < 1e-6) {
        axis = cross([0, 1, 0], from);
      }
      return quaternionFromAxisAngle(axis, Math.PI);
    }

    const axis = cross(from, to);
    return quaternionNormalize([
      axis[0],
      axis[1],
      axis[2],
      1 + cosine
    ]);
  }

  function primaryForQuaternion(records, anchor, quaternion) {
    const normalizedAnchor = normalizeVector(anchor);
    const normalizedQuaternion = quaternionNormalize(quaternion);
    let bestId = "";
    let bestScore = -Infinity;

    for (const [id, vector] of records) {
      const rotated = normalizeVector(
        quaternionRotateVector(normalizedQuaternion, vector)
      );
      const score = dot(rotated, normalizedAnchor);
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    }

    return bestId;
  }

  function primaryWingForQuaternion(quaternion) {
    return primaryForQuaternion(
      WINGS.map(wing => [wing, CARDINAL_BASE_POSITIONS[wing]]),
      PRIMARY_ANCHORS.orbit,
      quaternion
    ) || "north";
  }

  function primaryRoomForQuaternion(roomIds, quaternion) {
    const records = Array.isArray(roomIds)
      ? roomIds
          .map(roomId => [String(roomId || "").trim(), roomOrdinal(roomId)])
          .filter(record => record[0] && record[1] > 0)
          .map(record => [record[0], ROOM_BASE_POSITIONS[record[1]]])
      : [];
    return primaryForQuaternion(
      records,
      PRIMARY_ANCHORS.cluster,
      quaternion
    );
  }

  function settledQuaternion(baseVector, anchor, currentQuaternion) {
    const current = quaternionNormalize(currentQuaternion);
    const currentVector = normalizeVector(
      quaternionRotateVector(current, baseVector)
    );
    const alignment = quaternionFromUnitVectors(currentVector, anchor);
    return quaternionNormalize(
      quaternionMultiply(alignment, current)
    );
  }

  function settleOrbit(controller, frame) {
    const current = quaternionNormalize(
      frame && frame.orbitOrientation && frame.orbitOrientation.quaternion
    );
    const primaryId = primaryWingForQuaternion(current);
    const settled = settledQuaternion(
      CARDINAL_BASE_POSITIONS[primaryId],
      PRIMARY_ANCHORS.orbit,
      current
    );

    if (controller.beginOrbitGesture() === false) return false;
    if (controller.requestOrbitPreview({
      quaternion: settled.slice(),
      primaryId
    }) === false) {
      controller.requestOrbitCancel("selection-settlement-preview-rejected");
      return false;
    }
    const committed = controller.requestOrbitCommit() !== false;
    if (!committed) {
      controller.requestOrbitCancel("selection-settlement-commit-rejected");
      return false;
    }
    return true;
  }

  function settleCluster(controller, frame, pointer) {
    const cluster = frame && frame.cluster;
    if (!cluster || !cluster.wing || cluster.wing !== pointer.wing) return false;

    const current = quaternionNormalize(
      cluster.orientation && cluster.orientation.quaternion
    );
    const roomIds = Array.isArray(cluster.roomIds)
      ? cluster.roomIds
      : pointer.roomIds;
    const primaryId = primaryRoomForQuaternion(roomIds, current);
    const ordinal = roomOrdinal(primaryId);
    if (!primaryId || !ordinal) return false;

    const settled = settledQuaternion(
      ROOM_BASE_POSITIONS[ordinal],
      PRIMARY_ANCHORS.cluster,
      current
    );

    if (controller.beginClusterGesture(cluster.wing) === false) return false;
    if (controller.requestClusterPreview(cluster.wing, {
      quaternion: settled.slice(),
      primaryId
    }) === false) {
      controller.requestClusterCancel(
        cluster.wing,
        "selection-settlement-preview-rejected"
      );
      return false;
    }
    const committed = controller.requestClusterCommit(cluster.wing) !== false;
    if (!committed) {
      controller.requestClusterCancel(
        cluster.wing,
        "selection-settlement-commit-rejected"
      );
      return false;
    }
    return true;
  }

  function controllerApi() {
    const controller =
      globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER;
    return controller && typeof controller.getFrameState === "function"
      ? controller
      : null;
  }

  function readFrame() {
    const controller = controllerApi();
    if (!controller) return null;
    try {
      return controller.getFrameState();
    } catch {
      return null;
    }
  }

  function updatePreview() {
    const pointer = state.pointer;
    const controller = controllerApi();
    const frame = readFrame();
    if (!pointer || !controller || !frame || pointer.maximumDistance < 7) {
      return;
    }

    try {
      if (
        pointer.scope === "orbit" &&
        frame.presentationMode === "CONSTELLATION"
      ) {
        const quaternion = quaternionNormalize(
          frame.orbitOrientation && frame.orbitOrientation.quaternion
        );
        const primaryId = primaryWingForQuaternion(quaternion);
        if (controller.requestOrbitPreview({
          quaternion: quaternion.slice(),
          primaryId
        }) !== false) {
          state.previewCount += 1;
        }
      } else if (
        pointer.scope === "cluster" &&
        frame.presentationMode === "CLUSTER" &&
        frame.cluster &&
        frame.cluster.wing === pointer.wing
      ) {
        const quaternion = quaternionNormalize(
          frame.cluster.orientation && frame.cluster.orientation.quaternion
        );
        const roomIds = Array.isArray(frame.cluster.roomIds)
          ? frame.cluster.roomIds
          : pointer.roomIds;
        const primaryId = primaryRoomForQuaternion(roomIds, quaternion);
        if (
          primaryId &&
          controller.requestClusterPreview(frame.cluster.wing, {
            quaternion: quaternion.slice(),
            primaryId
          }) !== false
        ) {
          state.previewCount += 1;
        }
      }
    } catch {
      /* Existing interaction authority remains controlling on failure. */
    }
  }

  function bind() {
    if (state.bound) return true;

    const root = document.querySelector("[data-showroom-root]");
    const field = root && root.querySelector("[data-showroom-orbit-field]");
    if (!root || !field) return false;

    field.addEventListener("pointerdown", event => {
      const frame = readFrame();
      if (!frame) return;

      const scope = frame.presentationMode === "CONSTELLATION"
        ? "orbit"
        : frame.presentationMode === "CLUSTER"
          ? "cluster"
          : "";
      if (!scope) return;

      state.pointer = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        maximumDistance: 0,
        scope,
        wing: frame.cluster && frame.cluster.wing
          ? frame.cluster.wing
          : "",
        roomIds: frame.cluster && Array.isArray(frame.cluster.roomIds)
          ? frame.cluster.roomIds.slice()
          : []
      };
    }, { passive: true });

    field.addEventListener("pointermove", event => {
      const pointer = state.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      pointer.maximumDistance = Math.max(
        pointer.maximumDistance,
        Math.hypot(
          event.clientX - pointer.startX,
          event.clientY - pointer.startY
        )
      );
      updatePreview();
    }, { passive: true });

    field.addEventListener("pointerup", event => {
      const pointer = state.pointer;
      state.pointer = null;
      if (!pointer || pointer.id !== event.pointerId || pointer.maximumDistance < 8) {
        return;
      }

      const controller = controllerApi();
      const frame = readFrame();
      if (!controller || !frame) return;

      let settled = false;
      try {
        if (
          pointer.scope === "orbit" &&
          frame.presentationMode === "CONSTELLATION"
        ) {
          settled = settleOrbit(controller, frame);
        } else if (
          pointer.scope === "cluster" &&
          frame.presentationMode === "CLUSTER"
        ) {
          settled = settleCluster(controller, frame, pointer);
        }
      } catch {
        settled = false;
      }

      if (settled) {
        state.settleCount += 1;
        root.dataset.showroomPrimarySettlement = pointer.scope;
      }
    }, { passive: true });

    const clearPointer = () => {
      state.pointer = null;
    };
    field.addEventListener("pointercancel", clearPointer, { passive: true });
    field.addEventListener("lostpointercapture", clearPointer, { passive: true });
    window.addEventListener("blur", clearPointer, { passive: true });

    state.bound = true;
    root.dataset.showroomPrimarySelection = "active";
    root.dataset.showroomPrimarySelectionContract = CONTRACT;
    return true;
  }

  function activate() {
    if (bind()) return;
    window.setTimeout(activate, 80);
  }

  window.addEventListener("SHOWROOM_INTERACTIONS_READY", activate, {
    once: true
  });

  if (globalThis.SHOWROOM_INTERACTIONS) {
    activate();
  }

  globalThis.SHOWROOM_PRIMARY_SELECTION = Object.freeze({
    contract: CONTRACT,
    primaryWingForQuaternion,
    primaryRoomForQuaternion,
    getState: () => Object.freeze({
      bound: state.bound,
      previewCount: state.previewCount,
      settleCount: state.settleCount
    })
  });
})();
