/* TARGET FILE: /showroom/index.interaction.gestures.js */
/* TNT FULL-FILE ADDITION */
/* SHOWROOM_INTERACTION_GESTURE_SUPPORT_TNT_v1 */

(() => {
  "use strict";

  const root =
    typeof window !== "undefined"
      ? window
      : globalThis;

  const CONTRACT =
    "SHOWROOM_INTERACTION_GESTURE_SUPPORT_TNT_v1";

  const GLOBAL_NAME =
    "SHOWROOM_INTERACTION_GESTURES";

  if (
    root[GLOBAL_NAME] &&
    root[GLOBAL_NAME].contract === CONTRACT
  ) {
    return;
  }

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const CARDINAL_BASE_POSITIONS = Object.freeze({
    north: Object.freeze([0, 1.42, -0.48]),
    east: Object.freeze([1.58, 0, 0.54]),
    south: Object.freeze([0, -1.42, 0.44]),
    west: Object.freeze([-1.58, 0, -0.58])
  });

  const ROOM_BASE_POSITIONS = Object.freeze({
    1: Object.freeze([-0.92, 0.82, -0.46]),
    2: Object.freeze([0.92, 0.82, 0.50]),
    3: Object.freeze([0.92, -0.82, -0.42]),
    4: Object.freeze([-0.92, -0.82, 0.46])
  });

  const PRIMARY_ANCHORS = Object.freeze({
    orbit: Object.freeze([0, 1, 0.08]),
    cluster: Object.freeze([0, 1, 0.16])
  });

  const DEFAULT_CONFIG = Object.freeze({
    radiansPerViewport: Math.PI * 1.14,
    maximumPitchRadians: Math.PI * 0.72,
    maximumSamples: 20,
    sampleWindowMs: 150,
    flickMaximumDurationMs: 285,
    flickMinimumDistancePx: 50,
    flickMinimumAverageVelocityPxPerMs: 0.50,
    flickMinimumReleaseVelocityPxPerMs: 0.64,
    flickMinimumDirectionalRatio: 1.20,
    flickMaximumPauseBeforeReleaseMs: 115,
    flickMaximumPathEfficiencyLoss: 0.32
  });

  function finiteNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function distance2d(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  function vectorLength(vector) {
    return Math.hypot(vector[0], vector[1], vector[2]);
  }

  function normalizeVector(vector, fallback = [0, 0, 1]) {
    const length = vectorLength(vector);

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

  function quaternionNormalize(value, fallback = [0, 0, 0, 1]) {
    const source =
      Array.isArray(value) || ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
    ];

    const length = Math.hypot(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );

    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }

    return quaternion.map(component => component / length);
  }

  function quaternionMultiplyRaw(first, second) {
    return [
      first[3] * second[0] +
        first[0] * second[3] +
        first[1] * second[2] -
        first[2] * second[1],

      first[3] * second[1] -
        first[0] * second[2] +
        first[1] * second[3] +
        first[2] * second[0],

      first[3] * second[2] +
        first[0] * second[1] -
        first[1] * second[0] +
        first[2] * second[3],

      first[3] * second[3] -
        first[0] * second[0] -
        first[1] * second[1] -
        first[2] * second[2]
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

    const rotated =
      quaternionMultiplyRaw(
        quaternionMultiplyRaw(quaternion, pure),
        quaternionConjugate(quaternion)
      );

    return [
      rotated[0],
      rotated[1],
      rotated[2]
    ];
  }

  function orientationQuaternion(orientation) {
    return quaternionNormalize(
      orientation && orientation.quaternion
        ? orientation.quaternion
        : [0, 0, 0, 1]
    );
  }

  function dragQuaternion(options) {
    const pointer = options && options.pointer;
    const clientX = finiteNumber(options && options.clientX, 0);
    const clientY = finiteNumber(options && options.clientY, 0);
    const width = Math.max(1, finiteNumber(options && options.width, 1));
    const height = Math.max(1, finiteNumber(options && options.height, 1));
    const config = options && options.config ? options.config : DEFAULT_CONFIG;

    const deltaX = clientX - finiteNumber(pointer && pointer.startX, clientX);
    const deltaY = clientY - finiteNumber(pointer && pointer.startY, clientY);

    const yaw =
      (deltaX / width) *
      finiteNumber(
        config.radiansPerViewport,
        DEFAULT_CONFIG.radiansPerViewport
      );

    const pitch =
      clamp(
        (deltaY / height) *
          finiteNumber(
            config.radiansPerViewport,
            DEFAULT_CONFIG.radiansPerViewport
          ),
        -finiteNumber(
          config.maximumPitchRadians,
          DEFAULT_CONFIG.maximumPitchRadians
        ),
        finiteNumber(
          config.maximumPitchRadians,
          DEFAULT_CONFIG.maximumPitchRadians
        )
      );

    const yawQuaternion =
      quaternionFromAxisAngle([0, 1, 0], yaw);

    const pitchQuaternion =
      quaternionFromAxisAngle([1, 0, 0], pitch);

    return quaternionMultiply(
      pitchQuaternion,
      quaternionMultiply(
        yawQuaternion,
        quaternionNormalize(
          pointer && pointer.startQuaternion
            ? pointer.startQuaternion
            : [0, 0, 0, 1]
        )
      )
    );
  }

  function roomOrdinal(roomId) {
    const match =
      String(roomId == null ? "" : roomId)
        .trim()
        .match(/-(\d+)$/);

    if (!match) {
      return 0;
    }

    const ordinal = Number(match[1]);

    return ordinal >= 1 && ordinal <= 4
      ? ordinal
      : 0;
  }

  function primaryWingForQuaternion(quaternion) {
    const anchor = normalizeVector(PRIMARY_ANCHORS.orbit);
    const normalizedQuaternion = quaternionNormalize(quaternion);

    let bestWing = "north";
    let bestScore = -Infinity;

    for (const wing of WINGS) {
      const rotated =
        normalizeVector(
          quaternionRotateVector(
            normalizedQuaternion,
            CARDINAL_BASE_POSITIONS[wing]
          )
        );

      const score = dot(rotated, anchor);

      if (score > bestScore) {
        bestScore = score;
        bestWing = wing;
      }
    }

    return bestWing;
  }

  function primaryRoomForQuaternion(roomIds, quaternion) {
    const anchor = normalizeVector(PRIMARY_ANCHORS.cluster);
    const normalizedQuaternion = quaternionNormalize(quaternion);

    const candidates =
      Array.isArray(roomIds)
        ? roomIds
            .map(roomId => String(roomId == null ? "" : roomId).trim())
            .filter(roomId => roomOrdinal(roomId) > 0)
        : [];

    if (!candidates.length) {
      return "";
    }

    let bestRoom = candidates[0];
    let bestScore = -Infinity;

    for (const roomId of candidates) {
      const ordinal = roomOrdinal(roomId);

      const rotated =
        normalizeVector(
          quaternionRotateVector(
            normalizedQuaternion,
            ROOM_BASE_POSITIONS[ordinal]
          )
        );

      const score = dot(rotated, anchor);

      if (score > bestScore) {
        bestScore = score;
        bestRoom = roomId;
      }
    }

    return bestRoom;
  }

  function appendSample(samples, x, y, timestamp, config = DEFAULT_CONFIG) {
    const source =
      Array.isArray(samples)
        ? samples
        : [];

    const nextSamples =
      source.concat({
        x: finiteNumber(x, 0),
        y: finiteNumber(y, 0),
        timestamp: finiteNumber(timestamp, 0)
      });

    const cutoff =
      finiteNumber(timestamp, 0) -
      Math.max(
        finiteNumber(config.sampleWindowMs, DEFAULT_CONFIG.sampleWindowMs) * 2,
        300
      );

    return nextSamples
      .filter(sample => finiteNumber(sample.timestamp, 0) >= cutoff)
      .slice(
        -Math.max(
          1,
          Math.floor(
            finiteNumber(config.maximumSamples, DEFAULT_CONFIG.maximumSamples)
          )
        )
      );
  }

  function classifyFlick(pointer, releaseX, releaseY, releaseTime, config = DEFAULT_CONFIG) {
    const startX = finiteNumber(pointer && pointer.startX, releaseX);
    const startY = finiteNumber(pointer && pointer.startY, releaseY);
    const startTime = finiteNumber(pointer && pointer.startTime, releaseTime);
    const pathLengthInput = finiteNumber(pointer && pointer.pathLength, 0);

    const deltaX = finiteNumber(releaseX, startX) - startX;
    const deltaY = finiteNumber(releaseY, startY) - startY;

    const distance = Math.hypot(deltaX, deltaY);
    const duration = Math.max(1, finiteNumber(releaseTime, startTime) - startTime);
    const averageVelocity = distance / duration;

    const sampleWindowMs =
      finiteNumber(config.sampleWindowMs, DEFAULT_CONFIG.sampleWindowMs);

    const samples =
      Array.isArray(pointer && pointer.samples)
        ? pointer.samples
        : [];

    const recentSamples =
      samples.filter(
        sample =>
          finiteNumber(sample.timestamp, 0) >=
          finiteNumber(releaseTime, 0) - sampleWindowMs
      );

    const releaseStart =
      recentSamples.length
        ? recentSamples[0]
        : {
            x: startX,
            y: startY,
            timestamp: startTime
          };

    const releaseDistance =
      distance2d(
        finiteNumber(releaseStart.x, startX),
        finiteNumber(releaseStart.y, startY),
        finiteNumber(releaseX, startX),
        finiteNumber(releaseY, startY)
      );

    const releaseDuration =
      Math.max(
        1,
        finiteNumber(releaseTime, startTime) -
          finiteNumber(releaseStart.timestamp, startTime)
      );

    const releaseVelocity =
      releaseDistance / releaseDuration;

    const dominant =
      Math.max(Math.abs(deltaX), Math.abs(deltaY));

    const secondary =
      Math.min(Math.abs(deltaX), Math.abs(deltaY));

    const directionalRatio =
      secondary <= 1e-6
        ? Infinity
        : dominant / secondary;

    const pathLength =
      Math.max(distance, pathLengthInput);

    const pathEfficiency =
      pathLength > 1e-6
        ? distance / pathLength
        : 0;

    const pathEfficiencyLoss =
      1 - pathEfficiency;

    const lastSample =
      recentSamples.length
        ? recentSamples[recentSamples.length - 1]
        : null;

    const pauseBeforeRelease =
      lastSample
        ? Math.max(
            0,
            finiteNumber(releaseTime, startTime) -
              finiteNumber(lastSample.timestamp, startTime)
          )
        : duration;

    const direction =
      Math.abs(deltaX) >= Math.abs(deltaY)
        ? deltaX >= 0
          ? "right"
          : "left"
        : deltaY >= 0
          ? "down"
          : "up";

    const qualifies =
      duration <=
        finiteNumber(
          config.flickMaximumDurationMs,
          DEFAULT_CONFIG.flickMaximumDurationMs
        ) &&
      distance >=
        finiteNumber(
          config.flickMinimumDistancePx,
          DEFAULT_CONFIG.flickMinimumDistancePx
        ) &&
      averageVelocity >=
        finiteNumber(
          config.flickMinimumAverageVelocityPxPerMs,
          DEFAULT_CONFIG.flickMinimumAverageVelocityPxPerMs
        ) &&
      releaseVelocity >=
        finiteNumber(
          config.flickMinimumReleaseVelocityPxPerMs,
          DEFAULT_CONFIG.flickMinimumReleaseVelocityPxPerMs
        ) &&
      directionalRatio >=
        finiteNumber(
          config.flickMinimumDirectionalRatio,
          DEFAULT_CONFIG.flickMinimumDirectionalRatio
        ) &&
      pauseBeforeRelease <=
        finiteNumber(
          config.flickMaximumPauseBeforeReleaseMs,
          DEFAULT_CONFIG.flickMaximumPauseBeforeReleaseMs
        ) &&
      pathEfficiencyLoss <=
        finiteNumber(
          config.flickMaximumPathEfficiencyLoss,
          DEFAULT_CONFIG.flickMaximumPathEfficiencyLoss
        );

    return Object.freeze({
      qualifies,
      direction,
      duration,
      distance,
      deltaX,
      deltaY,
      averageVelocity,
      releaseVelocity,
      directionalRatio,
      pathLength,
      pathEfficiency,
      pathEfficiencyLoss,
      pauseBeforeRelease
    });
  }

  const api =
    Object.freeze({
      contract: CONTRACT,

      defaultConfig: DEFAULT_CONFIG,

      finiteNumber,
      clamp,
      distance2d,

      vectorLength,
      normalizeVector,
      dot,

      quaternionNormalize,
      quaternionMultiplyRaw,
      quaternionMultiply,
      quaternionConjugate,
      quaternionFromAxisAngle,
      quaternionRotateVector,

      orientationQuaternion,
      dragQuaternion,

      roomOrdinal,
      primaryWingForQuaternion,
      primaryRoomForQuaternion,

      appendSample,
      classifyFlick
    });

  Object.defineProperty(
    root,
    GLOBAL_NAME,
    {
      configurable: true,
      enumerable: false,
      writable: false,
      value: api
    }
  );
})();
