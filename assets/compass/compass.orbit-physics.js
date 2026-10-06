/* Shared Compass orbit physics. Extracted unchanged from Compass at
 * 171a74bc3f1f170c36079b00407fb569b56992bf; no DOM or renderer initialization. */
(() => {
  "use strict";
  const GESTURE = Object.freeze({
    dragDeadZonePx:
      6,

    maximumTapDistancePx:
      12,

    minimumDragDistancePx:
      8,

    radiansPerViewport:
      Math.PI * 1.12,

    settleSpeed:
      7.4,

    suppressClickMs:
      520,

    sampleWindowMs:
      140,

    releaseInertiaMinimumVelocityPxPerMs:
      0.12,

    releaseInertiaMinimumMs:
      600,

    releaseInertiaMaximumMs:
      780,

    releaseInertiaDampingRate:
      4.2,

    maximumSamples:
      18,

    flickMaximumDurationMs:
      260,

    flickMinimumDistancePx:
      52,

    flickMinimumAverageVelocityPxPerMs:
      0.55,

    flickMinimumReleaseVelocityPxPerMs:
      0.72,

    flickMinimumDirectionalRatio:
      1.28,

    flickMaximumPauseBeforeReleaseMs:
      90,

    flickMaximumPathEfficiencyLoss:
      0.22
  });

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

  function vectorLength(
    vector
  ) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalizeVector(
    vector,
    fallback = [
      0,
      0,
      1
    ]
  ) {
    const length =
      vectorLength(
        vector
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function dot(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function cross(
    a,
    b
  ) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function subtract(
    a,
    b
  ) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function quaternionNormalize(
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

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
    ];

    const length =
      Math.hypot(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-12
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function quaternionMultiplyRaw(
    a,
    b
  ) {
    return [
      a[3] * b[0] +
        a[0] * b[3] +
        a[1] * b[2] -
        a[2] * b[1],

      a[3] * b[1] -
        a[0] * b[2] +
        a[1] * b[3] +
        a[2] * b[0],

      a[3] * b[2] +
        a[0] * b[1] -
        a[1] * b[0] +
        a[2] * b[3],

      a[3] * b[3] -
        a[0] * b[0] -
        a[1] * b[1] -
        a[2] * b[2]
    ];
  }

  function quaternionMultiply(
    a,
    b
  ) {
    return quaternionNormalize(
      quaternionMultiplyRaw(
        a,
        b
      )
    );
  }

  function quaternionConjugate(
    quaternion
  ) {
    return [
      -quaternion[0],
      -quaternion[1],
      -quaternion[2],
      quaternion[3]
    ];
  }

  function quaternionFromAxisAngle(
    axis,
    angle
  ) {
    const normalizedAxis =
      normalizeVector(
        axis
      );

    const half =
      angle * 0.5;

    const sine =
      Math.sin(
        half
      );

    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function quaternionRotateVector(
    quaternion,
    vector
  ) {
    const q =
      quaternionNormalize(
        quaternion
      );

    const pure = [
      vector[0],
      vector[1],
      vector[2],
      0
    ];

    const rotated =
      quaternionMultiplyRaw(
        quaternionMultiplyRaw(
          q,
          pure
        ),
        quaternionConjugate(q)
      );

    return [
      rotated[0],
      rotated[1],
      rotated[2]
    ];
  }

  function quaternionFromUnitVectors(
    fromVector,
    toVector
  ) {
    const from =
      normalizeVector(
        fromVector
      );

    const to =
      normalizeVector(
        toVector
      );

    const cosine =
      clamp(
        dot(
          from,
          to
        ),
        -1,
        1
      );

    if (cosine > 0.999999) {
      return [
        0,
        0,
        0,
        1
      ];
    }

    if (cosine < -0.999999) {
      let axis =
        cross(
          [1, 0, 0],
          from
        );

      if (
        vectorLength(axis) <
        1e-6
      ) {
        axis =
          cross(
            [0, 1, 0],
            from
          );
      }

      return quaternionFromAxisAngle(
        normalizeVector(axis),
        Math.PI
      );
    }

    const axis =
      cross(
        from,
        to
      );

    return quaternionNormalize([
      axis[0],
      axis[1],
      axis[2],
      1 + cosine
    ]);
  }

  function quaternionSlerp(
    fromValue,
    toValue,
    amount
  ) {
    const from =
      quaternionNormalize(
        fromValue
      );

    let to =
      quaternionNormalize(
        toValue
      );

    let cosine =
      (
        from[0] * to[0] +
        from[1] * to[1] +
        from[2] * to[2] +
        from[3] * to[3]
      );

    if (cosine < 0) {
      to = [
        -to[0],
        -to[1],
        -to[2],
        -to[3]
      ];

      cosine =
        -cosine;
    }

    if (cosine > 0.9995) {
      return quaternionNormalize([
        from[0] +
          (
            to[0] -
            from[0]
          ) *
          amount,

        from[1] +
          (
            to[1] -
            from[1]
          ) *
          amount,

        from[2] +
          (
            to[2] -
            from[2]
          ) *
          amount,

        from[3] +
          (
            to[3] -
            from[3]
          ) *
          amount
      ]);
    }

    const theta =
      Math.acos(
        clamp(
          cosine,
          -1,
          1
        )
      );

    const sineTheta =
      Math.sin(
        theta
      );

    const weightFrom =
      Math.sin(
        (
          1 -
          amount
        ) *
        theta
      ) /
      sineTheta;

    const weightTo =
      Math.sin(
        amount *
        theta
      ) /
      sineTheta;

    return quaternionNormalize([
      from[0] * weightFrom +
        to[0] * weightTo,

      from[1] * weightFrom +
        to[1] * weightTo,

      from[2] * weightFrom +
        to[2] * weightTo,

      from[3] * weightFrom +
        to[3] * weightTo
    ]);
  }

  function pointerDistance(
    pointer,
    clientX,
    clientY
  ) {
    return Math.hypot(
      clientX -
      pointer.startX,

      clientY -
      pointer.startY
    );
  }

  function addPointerSample(
    pointer,
    clientX,
    clientY,
    time
  ) {
    pointer.samples.push({
      x:
        clientX,

      y:
        clientY,

      time
    });

    const minimumTime =
      time -
      Math.max(
        GESTURE.sampleWindowMs *
          2,
        260
      );

    pointer.samples =
      pointer.samples
        .filter(
          sample =>
            sample.time >=
            minimumTime
        )
        .slice(
          -GESTURE.maximumSamples
        );
  }

  function gestureMetrics(
    pointer,
    endX,
    endY,
    endTime
  ) {
    const dx =
      endX -
      pointer.startX;

    const dy =
      endY -
      pointer.startY;

    const distance =
      Math.hypot(
        dx,
        dy
      );

    const durationMs =
      Math.max(
        1,
        endTime -
        pointer.startTime
      );

    const averageVelocity =
      distance /
      durationMs;

    /*
     * Samples intentionally exclude the pointerup point. This preserves a
     * real pause-before-release measurement instead of forcing the value to
     * zero by appending an endTime sample before classification.
     */
    const motionSamples =
      pointer.samples.filter(
        sample =>
          sample.time <
          endTime
      );

    const recentSamples =
      motionSamples.filter(
        sample =>
          sample.time >=
          endTime -
          GESTURE.sampleWindowMs
      );

    const releaseStart =
      recentSamples.length
        ? recentSamples[0]
        : {
            x:
              pointer.startX,

            y:
              pointer.startY,

            time:
              pointer.startTime
          };

    const releaseDistance =
      Math.hypot(
        endX -
        releaseStart.x,

        endY -
        releaseStart.y
      );

    const releaseDuration =
      Math.max(
        1,
        endTime -
        releaseStart.time
      );

    const releaseVelocity =
      releaseDistance /
      releaseDuration;

    let pathLength =
      0;

    let previous = {
      x:
        pointer.startX,

      y:
        pointer.startY
    };

    motionSamples.forEach(
      sample => {
        pathLength +=
          Math.hypot(
            sample.x -
            previous.x,

            sample.y -
            previous.y
          );

        previous =
          sample;
      }
    );

    pathLength +=
      Math.hypot(
        endX -
        previous.x,

        endY -
        previous.y
      );

    const pathEfficiency =
      pathLength > 0
        ? distance /
          pathLength
        : 1;

    const absX =
      Math.abs(dx);

    const absY =
      Math.abs(dy);

    const directionalRatio =
      Math.max(
        absX,
        absY
      ) /
      Math.max(
        1,
        Math.min(
          absX,
          absY
        )
      );

    const lastMotionSample =
      motionSamples.length
        ? motionSamples[
            motionSamples.length -
            1
          ]
        : null;

    const pauseBeforeRelease =
      lastMotionSample
        ? Math.max(
            0,
            endTime -
            lastMotionSample.time
          )
        : durationMs;

    return {
      dx,
      dy,
      distance,
      durationMs,
      averageVelocity,
      releaseVelocity,
      pathLength,
      pathEfficiency,
      directionalRatio,
      pauseBeforeRelease
    };
  }

  function isQuickClusterFlick(
    metrics
  ) {
    return (
      metrics.durationMs <=
        GESTURE
          .flickMaximumDurationMs &&
      metrics.distance >=
        GESTURE
          .flickMinimumDistancePx &&
      metrics.averageVelocity >=
        GESTURE
          .flickMinimumAverageVelocityPxPerMs &&
      metrics.releaseVelocity >=
        GESTURE
          .flickMinimumReleaseVelocityPxPerMs &&
      metrics.directionalRatio >=
        GESTURE
          .flickMinimumDirectionalRatio &&
      metrics.pauseBeforeRelease <=
        GESTURE
          .flickMaximumPauseBeforeReleaseMs &&
      (
        1 -
        metrics.pathEfficiency
      ) <=
        GESTURE
          .flickMaximumPathEfficiencyLoss
    );
  }

  function constellationReleaseQuaternionAt(
    inertia,
    elapsedMs
  ) {
    const seconds =
      Math.max(
        0,
        elapsedMs
      ) * 0.001;

    const integrated =
      (
        1 -
        Math.exp(
          -GESTURE
            .releaseInertiaDampingRate *
          seconds
        )
      ) /
      GESTURE
        .releaseInertiaDampingRate;

    const yawQuaternion =
      quaternionFromAxisAngle(
        [0, 1, 0],
        inertia.yawVelocity *
          integrated
      );

    const pitchQuaternion =
      quaternionFromAxisAngle(
        [1, 0, 0],
        inertia.pitchVelocity *
          integrated
      );

    return quaternionMultiply(
      pitchQuaternion,
      quaternionMultiply(
        yawQuaternion,
        inertia.releaseQuaternion
      )
    );
  }

  function dragQuaternionFromPointer(
    pointer,
    clientX,
    clientY,
    viewportWidth,
    viewportHeight
  ) {
    const width =
      Math.max(
        1,
        viewportWidth
      );

    const height =
      Math.max(
        1,
        viewportHeight
      );

    const dx =
      clientX -
      pointer.startX;

    const dy =
      clientY -
      pointer.startY;

    const yaw =
      (
        dx /
        width
      ) *
      GESTURE.radiansPerViewport;

    const pitch =
      (
        dy /
        height
      ) *
      GESTURE.radiansPerViewport;

    const horizontalAxis =
      [0, 1, 0];

    const yawQuaternion =
      quaternionFromAxisAngle(
        horizontalAxis,
        yaw
      );

    const pitchQuaternion =
      quaternionFromAxisAngle(
        [1, 0, 0],
        pitch
      );

    return quaternionNormalize(
      quaternionMultiply(
        pitchQuaternion,

        quaternionMultiply(
          yawQuaternion,
          pointer.startQuaternion
        )
      )
    );
  }

  function releaseParameters(metrics, width, height, reducedMotion = false) {
    if (reducedMotion || metrics.distance <= 0) return null;
    const releaseSpeed =
      Math.max(
        metrics.releaseVelocity,
        GESTURE
          .releaseInertiaMinimumVelocityPxPerMs
      );

    const directionScale =
      releaseSpeed /
      metrics.distance;

    const releaseVelocityX =
      metrics.dx *
      directionScale;

    const releaseVelocityY =
      metrics.dy *
      directionScale;

    const yawVelocity =
      Math.max(
        -4.2,
        Math.min(
          4.2,
          releaseVelocityX *
          1000 /
          Math.max(
            1,
            width
          ) *
          GESTURE
            .radiansPerViewport
        )
      );

    const pitchVelocity =
      Math.max(
        -3.4,
        Math.min(
          3.4,
          releaseVelocityY *
          1000 /
          Math.max(
            1,
            height
          ) *
          GESTURE
            .radiansPerViewport
        )
      );

    const durationMs =
      Math.round(
        Math.max(
          GESTURE
            .releaseInertiaMinimumMs,
          Math.min(
            GESTURE
              .releaseInertiaMaximumMs,
            GESTURE
              .releaseInertiaMinimumMs +
            releaseSpeed *
              100
          )
        )
      );

    return { releaseSpeed, releaseVelocityX, releaseVelocityY, yawVelocity, pitchVelocity, durationMs };
  }

  globalThis.DGB_COMPASS_ORBIT_PHYSICS = Object.freeze({
    GESTURE, vectorLength, normalizeVector, dot, cross, subtract, quaternionNormalize, quaternionMultiplyRaw, quaternionMultiply, quaternionConjugate, quaternionFromAxisAngle, quaternionRotateVector, quaternionFromUnitVectors, quaternionSlerp, pointerDistance, addPointerSample, gestureMetrics, isQuickClusterFlick, constellationReleaseQuaternionAt,
    dragQuaternionFromPointer, releaseParameters
  });
})();
