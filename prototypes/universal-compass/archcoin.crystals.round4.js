/* /prototypes/universal-compass/archcoin.crystals.round4.js
   ARCHCOIN calibration lab · Round 4.
   Loads the isolated ARCHCOIN crystal source, applies the accepted Main Compass
   room-cluster geometry/material metrics, and removes the inherited wing-center
   displacement. Production ARCHCOIN files remain unchanged.
*/
(() => {
  "use strict";

  const BUILD = "ARCHCOIN_CALIBRATION_ROUND4_v1";
  const SOURCE_URL = `./archcoin.index.crystals.js?build=${encodeURIComponent(BUILD)}`;

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    if (request.status < 200 || request.status >= 300) {
      throw new Error(`ARCHCOIN_ROUND4_CRYSTAL_SOURCE_LOAD_FAILED:${request.status}`);
    }
    return request.responseText;
  }

  function replaceRequired(source, before, after, identity) {
    if (!source.includes(before)) {
      throw new Error(`ARCHCOIN_ROUND4_REQUIRED_SOURCE_PATTERN_MISSING:${identity}`);
    }
    return source.replace(before, after);
  }

  let source = loadSourceSynchronously(SOURCE_URL);

  source = replaceRequired(
    source,
    `        horizontalRadius:\n          1.04,\n\n        verticalRadius:\n          0.90,\n\n        depthRadius:\n          0.84,\n\n        centerRadius:\n          0.26,`,
    `        horizontalRadius:\n          1.36,\n\n        verticalRadius:\n          1.18,\n\n        depthRadius:\n          1.04,\n\n        centerRadius:\n          0,`,
    "MAIN_COMPASS_CENTERED_CLUSTER_RADII"
  );

  source = replaceRequired(
    source,
    `    roomScale:\n      0.68,\n\n    primaryRoomScale:\n      0.84,\n\n    selectedRoomScale:\n      0.91,`,
    `    roomScale:\n      0.88,\n\n    primaryRoomScale:\n      1.12,\n\n    selectedRoomScale:\n      1.18,`,
    "MAIN_COMPASS_ROOM_SCALE_METRICS"
  );

  source = replaceRequired(
    source,
    `    maximumYaw:\n      0.20,\n\n    maximumPitch:\n      0.13,`,
    `    maximumYaw:\n      0.22,\n\n    maximumPitch:\n      0.14,`,
    "MAIN_COMPASS_ROOM_FACET_MOTION_LIMITS"
  );

  source = replaceRequired(
    source,
    `    ROOM_IDLE:\n      Object.freeze({\n        specular:\n          1.02,\n\n        rim:\n          0.88,\n\n        emissive:\n          0.12,\n\n        alpha:\n          0.88,\n\n        sparkle:\n          0.14,\n\n        halo:\n          0.44,\n\n        contrast:\n          1.08\n      }),`,
    `    ROOM_IDLE:\n      Object.freeze({\n        specular:\n          1.04,\n\n        rim:\n          0.90,\n\n        emissive:\n          0.15,\n\n        alpha:\n          0.88,\n\n        sparkle:\n          0.22,\n\n        halo:\n          0.64,\n\n        contrast:\n          1.10\n      }),`,
    "MAIN_COMPASS_ROOM_IDLE_MATERIAL"
  );

  source = replaceRequired(
    source,
    `    ROOM_PRIMARY:\n      Object.freeze({\n        specular:\n          1.18,\n\n        rim:\n          1.02,\n\n        emissive:\n          0.16,\n\n        alpha:\n          0.92,\n\n        sparkle:\n          0.18,\n\n        halo:\n          0.62,\n\n        contrast:\n          1.14\n      }),`,
    `    ROOM_PRIMARY:\n      Object.freeze({\n        specular:\n          1.24,\n\n        rim:\n          1.08,\n\n        emissive:\n          0.21,\n\n        alpha:\n          0.94,\n\n        sparkle:\n          0.30,\n\n        halo:\n          0.86,\n\n        contrast:\n          1.17\n      }),`,
    "MAIN_COMPASS_ROOM_PRIMARY_MATERIAL"
  );

  source = replaceRequired(
    source,
    `    ROOM_SELECTED:\n      Object.freeze({\n        specular:\n          1.26,\n\n        rim:\n          1.08,\n\n        emissive:\n          0.18,\n\n        alpha:\n          0.94,\n\n        sparkle:\n          0.22,\n\n        halo:\n          0.72,\n\n        contrast:\n          1.18\n      })`,
    `    ROOM_SELECTED:\n      Object.freeze({\n        specular:\n          1.34,\n\n        rim:\n          1.14,\n\n        emissive:\n          0.24,\n\n        alpha:\n          0.95,\n\n        sparkle:\n          0.34,\n\n        halo:\n          0.96,\n\n        contrast:\n          1.20\n      })`,
    "MAIN_COMPASS_ROOM_SELECTED_MATERIAL"
  );

  source += `\n//# sourceURL=/prototypes/universal-compass/archcoin.crystals.round4.transformed.js`;
  (0, eval)(source);

  globalThis.DGB_ARCHCOIN_CALIBRATION_ROUND4_CRYSTALS = Object.freeze({
    build: BUILD,
    source: SOURCE_URL,
    clusterCenterRadius: 0,
    clusterHorizontalRadius: 1.36,
    clusterVerticalRadius: 1.18,
    clusterDepthRadius: 1.04,
    mainCompassRoomMetricsAdopted: true,
    productionSourceModified: false
  });
})();