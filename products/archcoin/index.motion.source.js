/* /prototypes/universal-compass/archcoin.interactions.round3.js
   ARCHCOIN calibration lab · Round 3.
   Main Compass room-cluster motion transplant with display-space correction.
   Production ARCHCOIN files are not modified.
*/
(() => {
  "use strict";

  const BUILD = "ARCHCOIN_CALIBRATION_ROUND3_v1";
  const SOURCE_URL = `./archcoin.index.interactions.source.js?build=${encodeURIComponent(BUILD)}`;
  const SOURCE_READY_EVENT = "ARCHCOIN_INTERACTIONS_READY";
  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const WING_LABELS = Object.freeze({
    north: "Contract",
    east: "Receivable",
    south: "Payable",
    west: "Allocation"
  });

  const GESTURE = Object.freeze({
    maximumTapDistancePx: 12,
    minimumDragDistancePx: 8,
    radiansPerViewport: Math.PI * 1.12,
    settleSpeed: 7.4,
    suppressClickMs: 520,
    sampleWindowMs: 140,
    maximumSamples: 18,
    flickMaximumDurationMs: 260,
    flickMinimumDistancePx: 52,
    flickMinimumAverageVelocityPxPerMs: 0.55,
    flickMinimumReleaseVelocityPxPerMs: 0.72,
    flickMinimumDirectionalRatio: 1.28,
    flickMaximumPauseBeforeReleaseMs: 90,
    flickMaximumPathEfficiencyLoss: 0.22,
    maximumTapDurationMs: 650,
    maximumSettlementMs: 1100,
    settlementDotThreshold: 0.99996
  });

  const SPHERE = Object.freeze({
    constellation: Object.freeze({
      primaryAnchor: Object.freeze([0, 0.78, 0.625]),
      vectors: Object.freeze({
        north: Object.freeze([0, 1, 0]),
        east: Object.freeze([1, 0, 0]),
        south: Object.freeze([0, -1, 0]),
        west: Object.freeze([-1, 0, 0])
      })
    }),
    cluster: Object.freeze({
      primaryAnchor: Object.freeze([0, 0.70, 0.714]),
      latitudeAmplitude: 0.48,
      latitudeFrequency: 1.73
    })
  });

  let installed = false;
  let sourceScript = null;

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function cssEscape(value) {
    const text = String(value || "");
    return globalThis.CSS && typeof globalThis.CSS.escape === "function"
      ? globalThis.CSS.escape(text)
      : text.replace(/["\\]/g, "\\$&");
  }

  function vectorLength(vector) {
    return Math.hypot(vector[0], vector[1], vector[2]);
  }

  function normalizeVector(vector, fallback = [0, 0, 1]) {
    const length = vectorLength(vector);
    if (!Number.isFinite(length) || length <= 1e-12) return fallback.slice();
    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }

  function dot(first, second) {
    return first[0] * second[0] + first[1] * second[1] + first[2] * second[2];
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
    const quaternion = [
      finiteNumber(source[0], fallback[0]),
      finiteNumber(source[1], fallback[1]),
      finiteNumber(source[2], fallback[2]),
      finiteNumber(source[3], fallback[3])
    ];
    const length = Math.hypot(...quaternion);
    if (!Number.isFinite(length) || length <= 1e-12) return fallback.slice();
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
      quaternionMultiplyRaw(quaternionNormalize(first), quaternionNormalize(second))
    );
  }

  function quaternionConjugate(value) {
    const quaternion = quaternionNormalize(value);
    return [-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3]];
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

  function quaternionRotateVector(quaternionValue, vector) {
    const quaternion = quaternionNormalize(quaternionValue);
    const pure = [
      finiteNumber(vector[0], 0),
      finiteNumber(vector[1], 0),
      finiteNumber(vector[2], 0),
      0
    ];
    const rotated = quaternionMultiplyRaw(
      quaternionMultiplyRaw(quaternion, pure),
      quaternionConjugate(quaternion)
    );
    return [rotated[0], rotated[1], rotated[2]];
  }

  function quaternionFromUnitVectors(fromVector, toVector) {
    const from = normalizeVector(fromVector);
    const to = normalizeVector(toVector);
    const cosine = clamp(dot(from, to), -1, 1);
    if (cosine > 0.999999) return [0, 0, 0, 1];
    if (cosine < -0.999999) {
      let axis = cross([1, 0, 0], from);
      if (vectorLength(axis) < 1e-6) axis = cross([0, 1, 0], from);
      return quaternionFromAxisAngle(normalizeVector(axis), Math.PI);
    }
    const axis = cross(from, to);
    return quaternionNormalize([axis[0], axis[1], axis[2], 1 + cosine]);
  }

  function quaternionSlerp(fromValue, toValue, amount) {
    const from = quaternionNormalize(fromValue);
    let to = quaternionNormalize(toValue);
    let cosine =
      from[0] * to[0] +
      from[1] * to[1] +
      from[2] * to[2] +
      from[3] * to[3];
    if (cosine < 0) {
      to = [-to[0], -to[1], -to[2], -to[3]];
      cosine = -cosine;
    }
    if (cosine > 0.9995) {
      return quaternionNormalize([
        from[0] + (to[0] - from[0]) * amount,
        from[1] + (to[1] - from[1]) * amount,
        from[2] + (to[2] - from[2]) * amount,
        from[3] + (to[3] - from[3]) * amount
      ]);
    }
    const theta = Math.acos(clamp(cosine, -1, 1));
    const sineTheta = Math.sin(theta);
    if (Math.abs(sineTheta) <= 1e-12) return from;
    const weightFrom = Math.sin((1 - amount) * theta) / sineTheta;
    const weightTo = Math.sin(amount * theta) / sineTheta;
    return quaternionNormalize([
      from[0] * weightFrom + to[0] * weightTo,
      from[1] * weightFrom + to[1] * weightTo,
      from[2] * weightFrom + to[2] * weightTo,
      from[3] * weightFrom + to[3] * weightTo
    ]);
  }

  function quaternionDot(first, second) {
    const a = quaternionNormalize(first);
    const b = quaternionNormalize(second);
    return Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]);
  }

  function dragQuaternionFromPointer(pointer, clientX, clientY, width, height) {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    const deltaX = clientX - pointer.startX;
    const deltaY = clientY - pointer.startY;
    const yaw = (deltaX / safeWidth) * GESTURE.radiansPerViewport;
    const pitch = (deltaY / safeHeight) * GESTURE.radiansPerViewport;
    const yawQuaternion = quaternionFromAxisAngle([0, 1, 0], yaw);
    const pitchQuaternion = quaternionFromAxisAngle([1, 0, 0], pitch);
    return quaternionNormalize(
      quaternionMultiply(
        pitchQuaternion,
        quaternionMultiply(yawQuaternion, pointer.startQuaternion)
      )
    );
  }

  function clusterBaseVector(index, count) {
    const safeCount = Math.max(1, count);
    const longitude = (Math.PI * 2 * index) / safeCount - Math.PI / 2;
    const latitude = Math.sin((index + 0.5) * SPHERE.cluster.latitudeFrequency) *
      SPHERE.cluster.latitudeAmplitude;
    const cosineLatitude = Math.cos(latitude);
    return normalizeVector([
      Math.cos(longitude) * cosineLatitude,
      Math.sin(latitude),
      Math.sin(longitude) * cosineLatitude
    ]);
  }

  function nearestPrimaryWing(quaternion) {
    const anchor = normalizeVector(SPHERE.constellation.primaryAnchor);
    let bestWing = "north";
    let bestScore = -Infinity;
    for (const wing of WINGS) {
      const vector = normalizeVector(
        quaternionRotateVector(quaternion, SPHERE.constellation.vectors[wing])
      );
      const score = dot(vector, anchor);
      if (score > bestScore) {
        bestScore = score;
        bestWing = wing;
      }
    }
    return bestWing;
  }

  function settledConstellationQuaternion(wing, currentQuaternion) {
    const currentVector = normalizeVector(
      quaternionRotateVector(currentQuaternion, SPHERE.constellation.vectors[wing])
    );
    const alignment = quaternionFromUnitVectors(
      currentVector,
      normalizeVector(SPHERE.constellation.primaryAnchor)
    );
    return quaternionNormalize(quaternionMultiply(alignment, currentQuaternion));
  }

  function installCalibrationInteractions() {
    if (installed) return;

    const controller = globalThis.DGB_ARCHCOIN_CONTROLLER;
    const root = document.querySelector("[data-archcoin-root]");
    const field = root && root.querySelector("[data-archcoin-scene-field]");
    if (!controller || !root || !field) {
      throw new Error("ARCHCOIN_CALIBRATION_ROUND3_FOUNDATION_MISSING");
    }

    installed = true;
    const listeners = [];
    let unsubscribeProjection = null;
    let unsubscribeFrame = null;
    let settlementFrame = 0;
    let settlementToken = 0;

    const roomIdsByWing = new Map(
      WINGS.map(wing => [
        wing,
        controller.canonicalRoomRecords
          .filter(record => record.wing === wing)
          .map(record => record.roomId)
      ])
    );

    const state = {
      frame: controller.getFrameState(),
      projections: Array.from(controller.getSemanticProjection() || []),
      pointer: null,
      livePrimaryId: "",
      suppressClickUntil: 0,
      settling: false
    };

    root.dataset.archcoinCalibrationRound = BUILD;
    root.dataset.archcoinCalibrationInteraction = "main-compass-cluster-display-space-transplant";
    root.dataset.archcoinCalibrationTargetResistance = "false";
    root.dataset.archcoinCalibrationClusterPivot = "fixed-center-object";
    root.dataset.archcoinCalibrationLabelAttachment = "star-projection";
    field.style.touchAction = "none";
    field.style.userSelect = "none";
    field.style.webkitUserSelect = "none";
    field.style.webkitTouchCallout = "none";

    function addListener(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      listeners.push({ target, type, handler, options });
    }

    function mode() {
      const value = String(controller.getPresentationMode ? controller.getPresentationMode() : "");
      if (value === "CONSTELLATION") return "CONSTELLATION";
      if (value === "CLUSTER") return "CLUSTER";
      return "HELD";
    }

    function activeWing() {
      const frame = state.frame || controller.getFrameState();
      return normalizeWing(
        frame && (frame.activeClusterWing || frame.selectedCardinal || frame.orbitFocus)
      );
    }

    function orbitQuaternion() {
      const frame = state.frame || controller.getFrameState();
      return quaternionNormalize(
        frame && frame.orbitOrientation && frame.orbitOrientation.quaternion
      );
    }

    function clusterLocalQuaternion() {
      const frame = state.frame || controller.getFrameState();
      return quaternionNormalize(
        frame && frame.cluster && frame.cluster.orientation && frame.cluster.orientation.quaternion
      );
    }

    function clusterDisplayQuaternion(parentQuaternion = orbitQuaternion()) {
      return quaternionMultiply(parentQuaternion, clusterLocalQuaternion());
    }

    function localClusterQuaternionFromDisplay(displayQuaternion, parentQuaternion) {
      return quaternionNormalize(
        quaternionMultiply(quaternionConjugate(parentQuaternion), displayQuaternion)
      );
    }

    function roomVector(wing, roomId) {
      const roomIds = roomIdsByWing.get(wing) || [];
      const index = roomIds.indexOf(roomId);
      return clusterBaseVector(Math.max(0, index), Math.max(1, roomIds.length));
    }

    function nearestPrimaryRoom(wing, displayQuaternion) {
      const roomIds = roomIdsByWing.get(wing) || [];
      const anchor = normalizeVector(SPHERE.cluster.primaryAnchor);
      let bestRoom = roomIds[0] || "";
      let bestScore = -Infinity;
      roomIds.forEach((roomId, index) => {
        const vector = normalizeVector(
          quaternionRotateVector(
            displayQuaternion,
            clusterBaseVector(index, roomIds.length)
          )
        );
        const score = dot(vector, anchor);
        if (score > bestScore) {
          bestScore = score;
          bestRoom = roomId;
        }
      });
      return bestRoom;
    }

    function settledClusterQuaternion(wing, roomId, currentDisplayQuaternion) {
      if (!roomId) return quaternionNormalize(currentDisplayQuaternion);
      const currentVector = normalizeVector(
        quaternionRotateVector(currentDisplayQuaternion, roomVector(wing, roomId))
      );
      const alignment = quaternionFromUnitVectors(
        currentVector,
        normalizeVector(SPHERE.cluster.primaryAnchor)
      );
      return quaternionNormalize(
        quaternionMultiply(alignment, currentDisplayQuaternion)
      );
    }

    function controlForRecord(record) {
      if (!record) return null;
      const id = String(record.id || "");
      const kind = String(record.kind || "").toLowerCase();
      if (kind === "room") {
        return root.querySelector(
          `[data-archcoin-room][data-room-id="${cssEscape(id)}"]`
        );
      }
      const wing = normalizeWing(id);
      return wing
        ? root.querySelector(`[data-archcoin-coin][data-wing="${wing}"]`)
        : null;
    }

    function roomLabel(control, record) {
      const localFunction = String(
        control && (control.dataset.localFunction || control.dataset.lens) || ""
      ).replace(/\s+/g, " ").trim();
      if (localFunction) {
        return localFunction.charAt(0).toUpperCase() + localFunction.slice(1);
      }
      const wing = normalizeWing(control && control.dataset.wing);
      const domain = WING_LABELS[wing] || "";
      const source = String(
        control && control.dataset.label || record && record.id || "Room"
      ).replace(/\s+/g, " ").trim();
      const withoutDomain = domain
        ? source.replace(new RegExp(`^${domain}\\s+`, "i"), "")
        : source;
      return withoutDomain.replace(/\s+coin\b/gi, "").trim() || "Room";
    }

    function labelForRecord(record, control) {
      const kind = String(record && record.kind || "").toLowerCase();
      if (kind === "room") return roomLabel(control, record);
      const wing = normalizeWing(record && record.id);
      return WING_LABELS[wing] || "Target";
    }

    function currentPrimaryId() {
      if (state.livePrimaryId) return state.livePrimaryId;
      const frame = state.frame || controller.getFrameState();
      if (mode() === "CLUSTER") {
        return String(
          frame && frame.cluster &&
          (frame.cluster.previewPrimaryRoom || frame.cluster.primaryRoom) || ""
        );
      }
      return normalizeWing(
        frame && (frame.orbitPreviewFocus || frame.orbitFocus)
      ) || "north";
    }

    function hideControl(control) {
      control.dataset.round3Active = "false";
      control.dataset.round3Primary = "false";
      control.style.setProperty("opacity", "0", "important");
      control.style.setProperty("visibility", "hidden", "important");
      control.style.setProperty("pointer-events", "none", "important");
      control.setAttribute("aria-hidden", "true");
      control.removeAttribute("aria-current");
    }

    function showControl(control, record, primaryId) {
      const visible = record.visible !== false;
      if (!visible) {
        hideControl(control);
        return;
      }
      const depth = String(record.depthLayer || "unknown").toLowerCase();
      const isPrimary = String(record.id || "") === primaryId;
      control.style.setProperty("--archcoin-label-x", `${finiteNumber(record.x, 0)}px`);
      control.style.setProperty("--archcoin-label-y", `${finiteNumber(record.y, 0)}px`);
      control.style.setProperty("--archcoin-label-offset-x", "0px");
      control.style.setProperty("--archcoin-label-offset-y", "0px");
      control.dataset.archcoinProjectionVisible = "true";
      control.dataset.projectionVisible = "true";
      control.dataset.archcoinDepthLayer = depth;
      control.dataset.projectionDepthLayer = depth;
      control.dataset.archcoinCompassOverlap = record.compassOverlap ? "true" : "false";
      control.dataset.projectionCompassOverlap = record.compassOverlap ? "true" : "false";
      control.dataset.round3Active = "true";
      control.dataset.round3Primary = isPrimary ? "true" : "false";
      control.dataset.round3Label = labelForRecord(record, control);
      control.style.removeProperty("opacity");
      control.style.removeProperty("visibility");
      control.style.removeProperty("pointer-events");
      control.style.zIndex = isPrimary ? "6" : depth === "front" ? "5" : "2";
      control.removeAttribute("aria-hidden");
      if (isPrimary) control.setAttribute("aria-current", "true");
      else control.removeAttribute("aria-current");
    }

    function eligibleProjection(record, requestedMode = mode()) {
      if (!record || record.visible === false) return false;
      const kind = String(record.kind || "").toLowerCase();
      if (requestedMode === "CONSTELLATION") {
        return (kind === "cardinal" || kind === "coin") &&
          Boolean(normalizeWing(record.id));
      }
      return requestedMode === "CLUSTER" && kind === "room";
    }

    function applyProjectionUi() {
      const activeMode = mode();
      const primaryId = currentPrimaryId();
      root.querySelectorAll("[data-archcoin-coin], [data-archcoin-room]")
        .forEach(hideControl);
      state.projections
        .filter(record => eligibleProjection(record, activeMode))
        .forEach(record => {
          const control = controlForRecord(record);
          if (control) showControl(control, record, primaryId);
        });
      root.dataset.archcoinCalibrationFocusId = primaryId;
      root.dataset.archcoinCalibrationPresentationMode = activeMode;
    }

    function recordAtPoint(clientX, clientY) {
      const rect = field.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const candidates = state.projections
        .filter(record => eligibleProjection(record))
        .map(record => {
          const radius = clamp(finiteNumber(record.radiusPx, 28) * 1.20, 28, 92);
          const distance = Math.hypot(
            finiteNumber(record.x) - x,
            finiteNumber(record.y) - y
          );
          const depthPenalty =
            String(record.depthLayer || "").toLowerCase() === "rear" ? 10 : 0;
          return { record, radius, distance, score: distance + depthPenalty };
        })
        .filter(candidate => candidate.distance <= candidate.radius)
        .sort((first, second) => first.score - second.score);
      return candidates[0] ? candidates[0].record : null;
    }

    function semanticTarget(event) {
      const element = event.target instanceof Element ? event.target : null;
      const compass = element && element.closest("[data-upstream-compass-control]");
      if (compass && field.contains(compass)) {
        return { kind: "compass", id: "home-compass" };
      }
      const room = element && element.closest("[data-archcoin-room]");
      if (room && field.contains(room)) {
        return { kind: "room", id: normalizeRoomId(room.dataset.roomId) };
      }
      const coin = element && element.closest("[data-archcoin-coin]");
      if (coin && field.contains(coin)) {
        return {
          kind: "cardinal",
          id: normalizeWing(coin.dataset.wing || coin.dataset.cardinalId)
        };
      }
      const record = recordAtPoint(event.clientX, event.clientY);
      if (!record) return { kind: "open-space", id: "" };
      return {
        kind: String(record.kind || "").toLowerCase() === "room" ? "room" : "cardinal",
        id: String(record.id || "")
      };
    }

    function addPointerSample(pointer, clientX, clientY, time) {
      pointer.samples.push({ x: clientX, y: clientY, time });
      const minimumTime = time - Math.max(GESTURE.sampleWindowMs * 2, 260);
      pointer.samples = pointer.samples
        .filter(sample => sample.time >= minimumTime)
        .slice(-GESTURE.maximumSamples);
    }

    function gestureMetrics(pointer, endX, endY, endTime) {
      const deltaX = endX - pointer.startX;
      const deltaY = endY - pointer.startY;
      const distance = Math.hypot(deltaX, deltaY);
      const durationMs = Math.max(1, endTime - pointer.startTime);
      const averageVelocity = distance / durationMs;
      const motionSamples = pointer.samples.filter(sample => sample.time < endTime);
      const recentSamples = motionSamples.filter(
        sample => sample.time >= endTime - GESTURE.sampleWindowMs
      );
      const releaseStart = recentSamples.length
        ? recentSamples[0]
        : { x: pointer.startX, y: pointer.startY, time: pointer.startTime };
      const releaseDistance = Math.hypot(
        endX - releaseStart.x,
        endY - releaseStart.y
      );
      const releaseDuration = Math.max(1, endTime - releaseStart.time);
      const releaseVelocity = releaseDistance / releaseDuration;
      let pathLength = 0;
      let previous = { x: pointer.startX, y: pointer.startY };
      motionSamples.forEach(sample => {
        pathLength += Math.hypot(sample.x - previous.x, sample.y - previous.y);
        previous = sample;
      });
      pathLength += Math.hypot(endX - previous.x, endY - previous.y);
      const pathEfficiency = pathLength > 0 ? distance / pathLength : 1;
      const absoluteX = Math.abs(deltaX);
      const absoluteY = Math.abs(deltaY);
      const directionalRatio =
        Math.max(absoluteX, absoluteY) / Math.max(1, Math.min(absoluteX, absoluteY));
      const lastMotionSample = motionSamples.length
        ? motionSamples[motionSamples.length - 1]
        : null;
      const pauseBeforeRelease = lastMotionSample
        ? Math.max(0, endTime - lastMotionSample.time)
        : durationMs;
      return {
        distance,
        durationMs,
        averageVelocity,
        releaseVelocity,
        pathEfficiency,
        directionalRatio,
        pauseBeforeRelease
      };
    }

    function isQuickClusterFlick(metrics) {
      return metrics.durationMs <= GESTURE.flickMaximumDurationMs &&
        metrics.distance >= GESTURE.flickMinimumDistancePx &&
        metrics.averageVelocity >= GESTURE.flickMinimumAverageVelocityPxPerMs &&
        metrics.releaseVelocity >= GESTURE.flickMinimumReleaseVelocityPxPerMs &&
        metrics.directionalRatio >= GESTURE.flickMinimumDirectionalRatio &&
        metrics.pauseBeforeRelease <= GESTURE.flickMaximumPauseBeforeReleaseMs &&
        (1 - metrics.pathEfficiency) <= GESTURE.flickMaximumPathEfficiencyLoss;
    }

    function openTransaction(pointer) {
      if (pointer.transactionOpen) return true;
      pointer.transactionOpen = pointer.scope === "constellation"
        ? controller.beginOrbitGesture() !== false
        : controller.beginClusterGesture(pointer.wing) !== false;
      return pointer.transactionOpen;
    }

    function submitPreview(pointer, displayQuaternion, primaryId) {
      let accepted = false;
      if (pointer.scope === "constellation") {
        accepted = controller.requestOrbitPreview({
          quaternion: quaternionNormalize(displayQuaternion),
          primaryId: normalizeWing(primaryId) || "north"
        }) !== false;
      } else {
        const localQuaternion = localClusterQuaternionFromDisplay(
          displayQuaternion,
          pointer.parentQuaternion
        );
        accepted = controller.requestClusterPreview(pointer.wing, {
          quaternion: localQuaternion,
          primaryId: normalizeRoomId(primaryId)
        }) !== false;
      }
      if (accepted) {
        pointer.currentQuaternion = quaternionNormalize(displayQuaternion);
        state.livePrimaryId = String(primaryId || "");
        requestAnimationFrame(applyProjectionUi);
      }
      return accepted;
    }

    function cancelTransaction(pointer, reason) {
      if (!pointer || !pointer.transactionOpen) return false;
      const cancelled = pointer.scope === "constellation"
        ? controller.requestOrbitCancel(reason)
        : controller.requestClusterCancel(pointer.wing, reason);
      pointer.transactionOpen = false;
      return cancelled;
    }

    function commitTransaction(pointer) {
      if (!pointer || !pointer.transactionOpen) return false;
      const committed = pointer.scope === "constellation"
        ? controller.requestOrbitCommit()
        : controller.requestClusterCommit(pointer.wing);
      pointer.transactionOpen = false;
      return committed;
    }

    function cancelSettlement() {
      settlementToken += 1;
      if (settlementFrame) cancelAnimationFrame(settlementFrame);
      settlementFrame = 0;
      state.settling = false;
      field.classList.remove("is-calibration-settling");
    }

    function settleAndCommit(pointer) {
      const currentQuaternion = quaternionNormalize(pointer.currentQuaternion);
      const primaryId = pointer.scope === "constellation"
        ? nearestPrimaryWing(currentQuaternion)
        : nearestPrimaryRoom(pointer.wing, currentQuaternion);
      const targetQuaternion = pointer.scope === "constellation"
        ? settledConstellationQuaternion(primaryId, currentQuaternion)
        : settledClusterQuaternion(pointer.wing, primaryId, currentQuaternion);

      state.livePrimaryId = primaryId;
      state.settling = true;
      field.classList.remove("is-calibration-dragging");
      field.classList.add("is-calibration-settling");
      const token = ++settlementToken;
      const startedAt = performance.now();
      let lastAt = startedAt;
      let animatedQuaternion = currentQuaternion.slice();

      const finish = () => {
        if (token !== settlementToken) return false;
        submitPreview(pointer, targetQuaternion, primaryId);
        const committed = commitTransaction(pointer);
        state.settling = false;
        field.classList.remove("is-calibration-settling");
        root.dataset.archcoinCalibrationLastGesture = committed
          ? `${pointer.scope}-settled:${primaryId}`
          : `${pointer.scope}-settlement-failed:${primaryId}`;
        requestAnimationFrame(applyProjectionUi);
        return committed;
      };

      const reducedMotion = Boolean(
        state.frame && state.frame.reducedMotion ||
        globalThis.matchMedia &&
          globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
      if (reducedMotion) return finish();

      const step = now => {
        if (token !== settlementToken) return;
        const deltaSeconds = Math.min(
          0.05,
          Math.max(0.001, (now - lastAt) / 1000)
        );
        lastAt = now;
        animatedQuaternion = quaternionSlerp(
          animatedQuaternion,
          targetQuaternion,
          Math.min(1, deltaSeconds * GESTURE.settleSpeed)
        );
        if (!submitPreview(pointer, animatedQuaternion, primaryId)) {
          cancelTransaction(pointer, "round3-settlement-preview-rejected");
          cancelSettlement();
          return;
        }
        const complete =
          quaternionDot(animatedQuaternion, targetQuaternion) >=
            GESTURE.settlementDotThreshold ||
          now - startedAt >= GESTURE.maximumSettlementMs;
        if (complete) {
          finish();
          return;
        }
        settlementFrame = requestAnimationFrame(step);
      };

      settlementFrame = requestAnimationFrame(step);
      return true;
    }

    function activateTarget(target) {
      if (!target) return false;
      if (target.kind === "cardinal" && target.id) {
        return controller.requestCardinalSelection(normalizeWing(target.id));
      }
      if (target.kind === "room" && target.id) {
        return controller.requestRoomSelection(normalizeRoomId(target.id));
      }
      if (target.kind === "compass") {
        return controller.requestCompassSelection();
      }
      return false;
    }

    function handlePointerDown(event) {
      if (state.pointer || state.settling) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const currentMode = mode();
      if (currentMode === "HELD") return;
      const wing = currentMode === "CLUSTER" ? activeWing() : "";
      if (currentMode === "CLUSTER" && !wing) return;
      const now = performance.now();
      const parentQuaternion = orbitQuaternion();
      const startQuaternion = currentMode === "CLUSTER"
        ? clusterDisplayQuaternion(parentQuaternion)
        : parentQuaternion;
      state.pointer = {
        id: event.pointerId,
        scope: currentMode === "CLUSTER" ? "cluster" : "constellation",
        wing,
        parentQuaternion,
        target: semanticTarget(event),
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        startTime: now,
        startQuaternion,
        currentQuaternion: startQuaternion.slice(),
        dragging: false,
        transactionOpen: false,
        samples: [{ x: event.clientX, y: event.clientY, time: now }]
      };
      try { field.setPointerCapture(event.pointerId); } catch (_) {}
      if (event.cancelable) event.preventDefault();
    }

    function handlePointerMove(event) {
      const pointer = state.pointer;
      if (!pointer || event.pointerId !== pointer.id) return;
      const now = performance.now();
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      addPointerSample(pointer, event.clientX, event.clientY, now);
      const distance = Math.hypot(
        event.clientX - pointer.startX,
        event.clientY - pointer.startY
      );
      if (!pointer.dragging && distance < GESTURE.minimumDragDistancePx) return;
      if (!pointer.dragging) {
        if (pointer.target.kind === "compass") return;
        pointer.dragging = openTransaction(pointer);
        if (!pointer.dragging) return;
        field.classList.add("is-calibration-dragging");
      }
      if (event.cancelable) event.preventDefault();
      const rect = field.getBoundingClientRect();
      const displayQuaternion = dragQuaternionFromPointer(
        pointer,
        event.clientX,
        event.clientY,
        rect.width,
        rect.height
      );
      const primaryId = pointer.scope === "constellation"
        ? nearestPrimaryWing(displayQuaternion)
        : nearestPrimaryRoom(pointer.wing, displayQuaternion);
      submitPreview(pointer, displayQuaternion, primaryId);
    }

    function finalizePointer(event, cancelled = false) {
      const pointer = state.pointer;
      if (!pointer || event.pointerId !== pointer.id) return;
      const endX = finiteNumber(event.clientX, pointer.lastX);
      const endY = finiteNumber(event.clientY, pointer.lastY);
      const now = performance.now();
      const metrics = gestureMetrics(pointer, endX, endY, now);
      let handled = false;
      if (cancelled) {
        handled = cancelTransaction(pointer, "round3-pointer-cancel");
      } else if (pointer.dragging) {
        if (pointer.scope === "cluster" && isQuickClusterFlick(metrics)) {
          cancelTransaction(pointer, "round3-cluster-flick-return");
          handled = controller.requestReturnToConstellation() !== false;
          state.livePrimaryId = "";
        } else {
          handled = settleAndCommit(pointer);
        }
      } else if (
        metrics.distance <= GESTURE.maximumTapDistancePx &&
        metrics.durationMs <= GESTURE.maximumTapDurationMs
      ) {
        handled = activateTarget(pointer.target);
      }
      state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;
      try { field.releasePointerCapture(event.pointerId); } catch (_) {}
      state.pointer = null;
      field.classList.remove("is-calibration-dragging");
      if (!state.settling) {
        root.dataset.archcoinCalibrationLastGesture = handled ? "handled" : "unhandled";
      }
    }

    function handleClickCapture(event) {
      if (performance.now() < state.suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.detail !== 0) return;
      const target = semanticTarget(event);
      if (target.kind === "open-space") return;
      event.preventDefault();
      activateTarget(target);
    }

    const pointerOptions = { capture: true, passive: false };
    addListener(field, "pointerdown", handlePointerDown, pointerOptions);
    addListener(field, "pointermove", handlePointerMove, pointerOptions);
    addListener(field, "pointerup", event => finalizePointer(event, false), pointerOptions);
    addListener(field, "pointercancel", event => finalizePointer(event, true), pointerOptions);
    addListener(field, "lostpointercapture", event => {
      if (state.pointer && state.pointer.id === event.pointerId) {
        finalizePointer(event, true);
      }
    }, true);
    addListener(root, "click", handleClickCapture, true);
    addListener(field, "dragstart", event => event.preventDefault(), true);

    unsubscribeProjection = controller.subscribeSemanticProjection(records => {
      state.projections = Array.from(records || []);
      requestAnimationFrame(applyProjectionUi);
    });

    unsubscribeFrame = controller.subscribeFrameState(frame => {
      state.frame = frame;
      if (frame && Array.isArray(frame.semanticProjection)) {
        state.projections = Array.from(frame.semanticProjection);
      }
      if (!state.pointer && !state.settling) state.livePrimaryId = "";
      requestAnimationFrame(applyProjectionUi);
    });

    requestAnimationFrame(applyProjectionUi);

    const calibrationApi = Object.freeze({
      moduleId: "DGB_ARCHCOIN_INTERACTIONS",
      moduleVersion: "5.0.0-calibration-round3-main-cluster-motion",
      build: BUILD,
      sourceModel: "DGB_COMPASS_CRYSTALS_SPHERICAL_CONSTELLATION_AND_CLUSTER_HARDENED_v4",
      handFollowingDrag: true,
      clusterDisplaySpaceCorrection: true,
      sharedRoomQuaternion: true,
      fixedCenterPivot: true,
      shortestArcSettlement: true,
      frontMetricsPreserved: true,
      duplicateLabelsRemoved: true,
      getReceipt: () => Object.freeze({
        build: BUILD,
        installed,
        mode: mode(),
        handFollowingDrag: true,
        clusterDisplaySpaceCorrection: true,
        fixedCenterPivot: true,
        settling: state.settling,
        primaryId: currentPrimaryId(),
        projectionCount: state.projections.length
      }),
      dispose: () => {
        cancelSettlement();
        if (state.pointer) cancelTransaction(state.pointer, "round3-disposed");
        listeners.forEach(binding => {
          try {
            binding.target.removeEventListener(
              binding.type,
              binding.handler,
              binding.options
            );
          } catch (_) {}
        });
        if (typeof unsubscribeProjection === "function") unsubscribeProjection();
        if (typeof unsubscribeFrame === "function") unsubscribeFrame();
        installed = false;
        return true;
      }
    });

    globalThis.DGB_ARCHCOIN_INTERACTIONS = calibrationApi;
    globalThis.DGB_ARCHCOIN_CALIBRATION_INTERACTIONS = calibrationApi;
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_CALIBRATION_ROUND3_READY", {
      detail: calibrationApi.getReceipt()
    }));
  }

  function replaceSourceInteractions() {
    const sourceApi = globalThis.DGB_ARCHCOIN_INTERACTIONS;
    if (!sourceApi || typeof sourceApi.dispose !== "function") return;
    globalThis.removeEventListener(SOURCE_READY_EVENT, replaceSourceInteractions);
    globalThis.DGB_ARCHCOIN_INTERACTIONS_SOURCE = sourceApi;
    sourceApi.dispose();
    installCalibrationInteractions();
  }

  globalThis.addEventListener(SOURCE_READY_EVENT, replaceSourceInteractions);
  sourceScript = document.createElement("script");
  sourceScript.src = SOURCE_URL;
  sourceScript.async = false;
  sourceScript.dataset.archcoinCalibrationSource = BUILD;
  sourceScript.addEventListener("load", () => {
    if (globalThis.DGB_ARCHCOIN_INTERACTIONS && !installed) {
      replaceSourceInteractions();
    }
  }, { once: true });
  sourceScript.addEventListener("error", () => {
    throw new Error("ARCHCOIN_CALIBRATION_ROUND3_SOURCE_INTERACTIONS_LOAD_FAILED");
  }, { once: true });
  document.head.append(sourceScript);
})();
