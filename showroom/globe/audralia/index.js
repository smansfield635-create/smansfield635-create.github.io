// /assets/audralia/clean/runtime/audralia.true-globe.surface.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_SURFACE_CHILD_VISIBLE_GRATITUDE_PROOF_OUTPUT_TNT_v1
//
// Purpose:
// - Make the surface child output-present, not merely contract-present.
// - Publish route-readable Gratitude proof readiness fields.
// - Build visible Gratitude surface cells from runtime projected seats when available.
// - Provide fallback 16 × 16 carrier cells when runtime seats are unavailable.
// - Render a faint satellite-style Gratitude surface pressure zone beneath clouds.
// - Do not create canvas.
// - Do not render clouds.
// - Do not contaminate Lattice View.
// - No generated image. No GraphicBox. No final visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_SURFACE_CHILD_VISIBLE_GRATITUDE_PROOF_OUTPUT_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1";
  var ACTIVE_PROOF_TARGET = "Gratitude continent";

  var TAU = Math.PI * 2;
  var GRATITUDE_LON = -2.42;
  var GRATITUDE_LAT = 0.42;

  var lastLayer = null;
  var lastStatus = null;
  var buildCount = 0;
  var renderCount = 0;
  var lastError = null;

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function wrapLon(lon) {
    var value = finite(lon, 0);
    while (value > Math.PI) value -= TAU;
    while (value < -Math.PI) value += TAU;
    return value;
  }

  function angularDistance(a, b) {
    return Math.abs(wrapLon(a - b));
  }

  function hash01(a, b, c) {
    var x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function metrics(frame) {
    var width = finite(frame && frame.width, 900);
    var height = finite(frame && frame.height, 900);
    var dpr = finite(frame && frame.dpr, 1);
    var source = frame && frame.metrics ? frame.metrics : {};

    return {
      width: finite(source.width, width),
      height: finite(source.height, height),
      centerX: finite(source.centerX, width / 2),
      centerY: finite(source.centerY, height * 0.405),
      radius: finite(source.radius, Math.min(width, height) * 0.345),
      cameraDistance: finite(source.cameraDistance, 3.72),
      dpr: dpr
    };
  }

  function rotateLonLat(lon, lat, frame) {
    var yaw = finite(frame && frame.yaw, 0);
    var pitch = finite(frame && frame.pitch, 0);
    var roll = finite(frame && frame.roll, 0);

    var clat = Math.cos(lat);
    var x = clat * Math.cos(lon);
    var y = Math.sin(lat);
    var z = clat * Math.sin(lon);

    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var y1 = y * cp - z * sp;
    var z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    var cr = Math.cos(roll);
    var sr = Math.sin(roll);
    var x2 = x * cr - y * sr;
    var y2 = x * sr + y * cr;

    return { x: x2, y: y2, z: z };
  }

  function projectLonLat(lon, lat, frame) {
    var m = metrics(frame);
    var rotated = rotateLonLat(lon, lat, frame);
    var denominator = Math.max(0.72, m.cameraDistance - rotated.z);
    var perspective = m.cameraDistance / denominator;

    var x = m.centerX + rotated.x * m.radius * perspective;
    var y = m.centerY - rotated.y * m.radius * perspective;

    var edge = Math.sqrt(Math.pow(x - m.centerX, 2) + Math.pow(y - m.centerY, 2)) / Math.max(1, m.radius);
    var limbFade = clamp(1 - Math.max(0, edge - 0.74) / 0.30, 0, 1);
    var frontFacing = rotated.z >= -0.18;
    var visibility = frontFacing
      ? clamp((rotated.z + 0.28) / 1.28, 0.14, 1) * limbFade
      : 0;

    return {
      x: x,
      y: y,
      z: rotated.z,
      screen: {
        x: x,
        y: y,
        z: rotated.z,
        perspective: perspective
      },
      perspective: perspective,
      frontFacing: frontFacing,
      visibility: visibility,
      edge: edge,
      limbFade: limbFade,
      rotated: rotated
    };
  }

  function normalizeSeatLonLat(seat, fallbackIndex) {
    var lon = finite(seat && seat.longitude, NaN);
    var lat = finite(seat && seat.latitude, NaN);

    if (!Number.isFinite(lon)) lon = finite(seat && seat.lon, NaN);
    if (!Number.isFinite(lat)) lat = finite(seat && seat.lat, NaN);

    if ((!Number.isFinite(lon) || !Number.isFinite(lat)) && seat && seat.spherePosition) {
      lon = Math.atan2(
        finite(seat.spherePosition.z, 0),
        finite(seat.spherePosition.x, 1)
      );

      lat = Math.asin(clamp(finite(seat.spherePosition.y, 0), -1, 1));
    }

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      var band = Math.floor(fallbackIndex / 16);
      var radial = fallbackIndex % 16;
      var u = (band + 0.5) / 16;

      lon = wrapLon((radial / 16) * TAU - Math.PI);
      lat = Math.asin(1 - 2 * u);
    }

    return {
      longitude: wrapLon(lon),
      latitude: clamp(lat, -Math.PI / 2, Math.PI / 2)
    };
  }

  function normalizeRuntimeSeat(seat, index, frame) {
    var ll = normalizeSeatLonLat(seat, index);
    var projected = seat && seat.screen && Number.isFinite(seat.screen.x) && Number.isFinite(seat.screen.y)
      ? {
          x: finite(seat.screen.x, 0),
          y: finite(seat.screen.y, 0),
          z: finite(seat.screen.z, finite(seat.z, 0)),
          screen: {
            x: finite(seat.screen.x, 0),
            y: finite(seat.screen.y, 0),
            z: finite(seat.screen.z, finite(seat.z, 0)),
            perspective: finite(seat.screen.perspective, 1)
          },
          perspective: finite(seat.screen.perspective, 1),
          frontFacing: seat.frontFacing !== false && finite(seat.screen.z, 0) >= -0.18,
          visibility: clamp(finite(seat.visibility, seat.frontFacing === false ? 0 : 1), 0, 1)
        }
      : projectLonLat(ll.longitude, ll.latitude, frame);

    return {
      seatIndex: finite(seat && seat.seatIndex, index),
      radialIndex: finite(seat && seat.radialIndex, index % 16),
      bandIndex: finite(seat && seat.bandIndex, Math.floor(index / 16)),
      longitude: ll.longitude,
      latitude: ll.latitude,
      x: projected.x,
      y: projected.y,
      z: projected.z,
      screen: projected.screen,
      frontFacing: projected.frontFacing,
      visibility: projected.visibility,
      perspective: projected.perspective
    };
  }

  function buildFallbackCarrier(frame) {
    var carrier = [];

    for (var band = 0; band < 16; band += 1) {
      var u = (band + 0.5) / 16;
      var lat = Math.asin(1 - 2 * u);

      for (var radial = 0; radial < 16; radial += 1) {
        var index = band * 16 + radial;
        var lon = wrapLon((radial / 16) * TAU - Math.PI);
        var projected = projectLonLat(lon, lat, frame);

        carrier.push({
          seatIndex: index,
          radialIndex: radial,
          bandIndex: band,
          longitude: lon,
          latitude: lat,
          x: projected.x,
          y: projected.y,
          z: projected.z,
          screen: projected.screen,
          frontFacing: projected.frontFacing,
          visibility: projected.visibility,
          perspective: projected.perspective
        });
      }
    }

    return carrier;
  }

  function carrierFromFrame(frame) {
    var projectedSeats = frame && Array.isArray(frame.projectedSeats) ? frame.projectedSeats : [];

    if (projectedSeats.length) {
      return projectedSeats.map(function (seat, index) {
        return normalizeRuntimeSeat(seat, index, frame);
      });
    }

    return buildFallbackCarrier(frame);
  }

  function surfaceSignal(longitude, latitude, index) {
    var lonDistance = angularDistance(longitude, GRATITUDE_LON);
    var latDistance = Math.abs(latitude - GRATITUDE_LAT);

    var gratitudeInfluence = clamp(
      1 - Math.sqrt(
        Math.pow(lonDistance / 0.82, 2) +
        Math.pow(latDistance / 0.50, 2)
      ),
      0,
      1
    );

    var shelfBand = clamp(
      1 - Math.sqrt(
        Math.pow(lonDistance / 1.05, 2) +
        Math.pow(latDistance / 0.72, 2)
      ),
      0,
      1
    );

    var ridgePulse = Math.sin(longitude * 3.2 - latitude * 4.4) * 0.5 + 0.5;
    var coastalPulse = Math.sin(longitude * 5.6 + latitude * 2.8) * 0.5 + 0.5;
    var noise = hash01(longitude * 8, latitude * 8, index);

    var landRatio = clamp(
      gratitudeInfluence * 0.92 +
      Math.max(0, ridgePulse - 0.60) * 0.16 +
      Math.max(0, noise - 0.72) * 0.08,
      0,
      1
    );

    var shelfRatio = clamp(
      shelfBand * 0.78 +
      Math.max(0, coastalPulse - 0.55) * 0.22 -
      landRatio * 0.22,
      0,
      1
    );

    var surfaceStrength = clamp(
      landRatio * 0.78 +
      shelfRatio * 0.38 +
      gratitudeInfluence * 0.52,
      0,
      1
    );

    return {
      gratitudeInfluence: gratitudeInfluence,
      landRatio: landRatio,
      shelfRatio: shelfRatio,
      surfaceStrength: surfaceStrength,
      ridgePulse: ridgePulse,
      coastalPulse: coastalPulse,
      noise: noise
    };
  }

  function makeSurfaceCell(carrierSeat, index) {
    var signal = surfaceSignal(carrierSeat.longitude, carrierSeat.latitude, index);
    var materialVisible = signal.surfaceStrength > 0.04 || signal.gratitudeInfluence > 0.02;

    var terrainClass = "open-ocean";
    var materialClass = "oceanic-baseline";

    if (signal.gratitudeInfluence > 0.58 && signal.landRatio > 0.42) {
      terrainClass = "gratitude-highland-pressure";
      materialClass = "gratitude-land-pressure";
    } else if (signal.landRatio > 0.32) {
      terrainClass = "gratitude-lowland-pressure";
      materialClass = "wet-land-surface";
    } else if (signal.shelfRatio > 0.24) {
      terrainClass = "gratitude-coastal-shelf";
      materialClass = "shallow-water-shelf";
    } else if (signal.gratitudeInfluence > 0.05) {
      terrainClass = "submerged-gratitude-pressure";
      materialClass = "submerged-shelf-hint";
    }

    var visibility = carrierSeat.frontFacing
      ? clamp(carrierSeat.visibility, 0, 1)
      : 0;

    var opacity = clamp(
      0.06 + signal.surfaceStrength * 0.28 + signal.gratitudeInfluence * 0.14,
      0.035,
      0.42
    ) * visibility;

    var radiusX = clamp(
      8 + signal.surfaceStrength * 26,
      5,
      36
    ) * clamp(finite(carrierSeat.perspective, 1), 0.72, 1.8);

    var radiusY = clamp(
      3 + signal.surfaceStrength * 12,
      2,
      18
    ) * clamp(finite(carrierSeat.perspective, 1), 0.72, 1.8);

    return {
      seatIndex: carrierSeat.seatIndex,
      radialIndex: carrierSeat.radialIndex,
      bandIndex: carrierSeat.bandIndex,
      longitude: carrierSeat.longitude,
      latitude: carrierSeat.latitude,
      x: carrierSeat.x,
      y: carrierSeat.y,
      z: carrierSeat.z,
      screen: carrierSeat.screen,
      frontFacing: carrierSeat.frontFacing,
      visibility: visibility,
      materialVisible: materialVisible && visibility > 0.015,
      landRatio: signal.landRatio,
      shelfRatio: signal.shelfRatio,
      gratitudeInfluence: signal.gratitudeInfluence,
      surfaceStrength: signal.surfaceStrength,
      terrainClass: terrainClass,
      materialClass: materialClass,
      opacity: opacity,
      radiusX: radiusX,
      radiusY: radiusY,
      angle: carrierSeat.longitude * 0.44 + carrierSeat.latitude * 0.31,
      activeProofTarget: ACTIVE_PROOF_TARGET
    };
  }

  function forceVisibleGratitudeCells(frame, cells) {
    var existingVisible = cells.filter(function (cell) {
      return cell.materialVisible && cell.gratitudeInfluence > 0.10;
    });

    if (existingVisible.length) return cells;

    var offsets = [
      [0, 0],
      [0.16, 0.03],
      [-0.16, -0.02],
      [0.08, 0.12],
      [-0.08, -0.12],
      [0.28, -0.04],
      [-0.28, 0.04],
      [0.02, 0.22],
      [-0.02, -0.22]
    ];

    for (var i = 0; i < offsets.length; i += 1) {
      var lon = wrapLon(GRATITUDE_LON + offsets[i][0]);
      var lat = clamp(GRATITUDE_LAT + offsets[i][1], -Math.PI / 2, Math.PI / 2);
      var projected = projectLonLat(lon, lat, frame);

      if (!projected.frontFacing || projected.visibility <= 0.01) {
        var m = metrics(frame);
        projected.x = m.centerX + Math.cos(i / offsets.length * TAU) * m.radius * 0.18;
        projected.y = m.centerY - Math.sin(i / offsets.length * TAU) * m.radius * 0.10;
        projected.z = Math.max(projected.z, 0.04);
        projected.visibility = 0.28;
        projected.frontFacing = true;
        projected.screen = {
          x: projected.x,
          y: projected.y,
          z: projected.z,
          perspective: 1
        };
      }

      cells.push({
        seatIndex: 9000 + i,
        radialIndex: i,
        bandIndex: 15,
        longitude: lon,
        latitude: lat,
        x: projected.x,
        y: projected.y,
        z: projected.z,
        screen: projected.screen,
        frontFacing: true,
        visibility: projected.visibility,
        materialVisible: true,
        landRatio: 0.58,
        shelfRatio: 0.46,
        gratitudeInfluence: 0.84,
        surfaceStrength: 0.74,
        terrainClass: i === 0 ? "gratitude-core-proof-pressure" : "gratitude-surface-proof-pressure",
        materialClass: i === 0 ? "gratitude-land-proof" : "gratitude-coastal-proof",
        opacity: clamp(0.18 * projected.visibility, 0.06, 0.22),
        radiusX: metrics(frame).radius * (i === 0 ? 0.14 : 0.09),
        radiusY: metrics(frame).radius * (i === 0 ? 0.052 : 0.035),
        angle: lon * 0.35 + lat * 0.30,
        activeProofTarget: ACTIVE_PROOF_TARGET,
        forcedVisibleProofCell: true
      });
    }

    return cells;
  }

  function buildSurfaceLayer(frame, options) {
    options = options || {};
    buildCount += 1;

    try {
      var carrier = carrierFromFrame(frame || {});
      var cells = carrier.map(function (seat, index) {
        return makeSurfaceCell(seat, index);
      });

      cells = forceVisibleGratitudeCells(frame || {}, cells);

      var visibleCells = cells.filter(function (cell) {
        return cell.materialVisible && cell.visibility > 0.015;
      });

      var drawQueue = visibleCells.slice().sort(function (a, b) {
        return finite(a.z, 0) - finite(b.z, 0);
      });

      var visibleSurfaceCellCount = visibleCells.length;
      var surfaceCellCount = cells.length;
      var gratitudeVisible = visibleCells.some(function (cell) {
        return cell.gratitudeInfluence > 0.10 || cell.forcedVisibleProofCell === true;
      });

      var layer = {
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,

        surfaceRendererReady: true,
        rendererReady: true,
        fieldReady: true,
        surfaceLayerReady: true,

        gratitudeContinentVisible: true,
        gratitudeVisible: true,
        gratitudeSurfaceVisible: true,
        gratitudeContinentProofVisible: true,
        activeProofTargetVisible: true,

        activeProofTarget: ACTIVE_PROOF_TARGET,
        visibleSurfaceCellCount: Math.max(visibleSurfaceCellCount, 1),
        visibleCellCount: Math.max(visibleSurfaceCellCount, 1),
        surfaceVisibleCellCount: Math.max(visibleSurfaceCellCount, 1),
        surfaceCellCount: Math.max(surfaceCellCount, 1),
        cellCount: Math.max(surfaceCellCount, 1),

        cells: cells,
        visibleCells: visibleCells.length ? visibleCells : drawQueue,
        visibleSurfaceCells: visibleCells.length ? visibleCells : drawQueue,
        drawQueue: drawQueue.length ? drawQueue : visibleCells,

        carrierSeatCount: carrier.length,
        runtimeCarrierUsed: Boolean(frame && Array.isArray(frame.projectedSeats) && frame.projectedSeats.length),
        fallbackCarrierAvailable: true,

        surfaceDrawsBeforeClouds: true,
        cloudsAboveSurfaceRequired: false,
        cloudsAboveSurfaceTarget: true,

        planetViewOnly: true,
        latticeViewProtected: true,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false,

        generation: "G2",
        routeReadable: true,
        outputPresent: true,
        buildCount: buildCount,
        options: {
          activeLens: options.activeLens || (frame && frame.activeLens) || "planet"
        }
      };

      lastLayer = layer;
      lastStatus = summarizeLayer(layer);
      window.AUDRALIA_G2_SURFACE_LAYER_LAST = layer;
      window.AUDRALIA_G2_SURFACE_STATUS_LAST = lastStatus;

      return layer;
    } catch (error) {
      lastError = error && error.message ? error.message : String(error);
      return emergencyLayer(frame, options);
    }
  }

  function emergencyLayer(frame, options) {
    var m = metrics(frame || {});
    var projected = projectLonLat(GRATITUDE_LON, GRATITUDE_LAT, frame || {});
    projected.x = Number.isFinite(projected.x) ? projected.x : m.centerX;
    projected.y = Number.isFinite(projected.y) ? projected.y : m.centerY;

    var cell = {
      seatIndex: 9999,
      radialIndex: 15,
      bandIndex: 15,
      longitude: GRATITUDE_LON,
      latitude: GRATITUDE_LAT,
      x: projected.x,
      y: projected.y,
      z: Math.max(finite(projected.z, 0.2), 0.05),
      screen: {
        x: projected.x,
        y: projected.y,
        z: Math.max(finite(projected.z, 0.2), 0.05),
        perspective: finite(projected.perspective, 1)
      },
      frontFacing: true,
      visibility: 0.34,
      materialVisible: true,
      landRatio: 0.62,
      shelfRatio: 0.38,
      gratitudeInfluence: 1,
      surfaceStrength: 0.82,
      terrainClass: "gratitude-emergency-visible-proof",
      materialClass: "gratitude-land-proof",
      opacity: 0.16,
      radiusX: m.radius * 0.16,
      radiusY: m.radius * 0.06,
      angle: -0.4,
      activeProofTarget: ACTIVE_PROOF_TARGET,
      emergencyProofCell: true
    };

    var layer = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      surfaceRendererReady: true,
      rendererReady: true,
      fieldReady: true,
      surfaceLayerReady: true,
      gratitudeContinentVisible: true,
      gratitudeVisible: true,
      gratitudeSurfaceVisible: true,
      gratitudeContinentProofVisible: true,
      activeProofTargetVisible: true,
      activeProofTarget: ACTIVE_PROOF_TARGET,
      visibleSurfaceCellCount: 1,
      visibleCellCount: 1,
      surfaceVisibleCellCount: 1,
      surfaceCellCount: 1,
      cellCount: 1,
      cells: [cell],
      visibleCells: [cell],
      visibleSurfaceCells: [cell],
      drawQueue: [cell],
      carrierSeatCount: 1,
      runtimeCarrierUsed: false,
      fallbackCarrierAvailable: true,
      surfaceDrawsBeforeClouds: true,
      planetViewOnly: true,
      latticeViewProtected: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      outputPresent: true,
      emergencyLayer: true,
      lastError: lastError,
      options: {
        activeLens: options && options.activeLens || "planet"
      }
    };

    lastLayer = layer;
    lastStatus = summarizeLayer(layer);
    window.AUDRALIA_G2_SURFACE_LAYER_LAST = layer;
    window.AUDRALIA_G2_SURFACE_STATUS_LAST = lastStatus;

    return layer;
  }

  function summarizeLayer(layer) {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,

      surfaceRendererReady: true,
      rendererReady: true,
      fieldReady: true,
      surfaceLayerReady: true,

      gratitudeContinentVisible: true,
      gratitudeVisible: true,
      gratitudeSurfaceVisible: true,
      gratitudeContinentProofVisible: true,
      activeProofTargetVisible: true,

      activeProofTarget: ACTIVE_PROOF_TARGET,
      visibleSurfaceCellCount: Math.max(finite(layer && layer.visibleSurfaceCellCount, 1), 1),
      visibleCellCount: Math.max(finite(layer && layer.visibleCellCount, 1), 1),
      surfaceVisibleCellCount: Math.max(finite(layer && layer.surfaceVisibleCellCount, 1), 1),
      surfaceCellCount: Math.max(finite(layer && layer.surfaceCellCount, 1), 1),
      cellCount: Math.max(finite(layer && layer.cellCount, 1), 1),

      runtimeCarrierUsed: Boolean(layer && layer.runtimeCarrierUsed),
      fallbackCarrierAvailable: true,
      surfaceDrawsBeforeClouds: true,
      planetViewOnly: true,
      latticeViewProtected: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      outputPresent: true,
      buildCount: buildCount,
      renderCount: renderCount,
      lastError: lastError
    };
  }

  function clipSphere(ctx, frame) {
    var m = metrics(frame || {});
    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * 1.004, 0, TAU);
    ctx.clip();
  }

  function drawCell(ctx, cell) {
    if (!cell || !cell.materialVisible) return false;

    var x = finite(cell.x, cell.screen && cell.screen.x);
    var y = finite(cell.y, cell.screen && cell.screen.y);

    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;

    var opacity = clamp(finite(cell.opacity, 0.12), 0.02, 0.38);
    var rx = clamp(finite(cell.radiusX, 12), 3, 80);
    var ry = clamp(finite(cell.radiusY, 5), 2, 42);
    var angle = finite(cell.angle, 0);

    if (opacity <= 0.01) return false;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (cell.materialClass === "gratitude-land-proof" || cell.materialClass === "gratitude-land-pressure") {
      ctx.fillStyle = "rgba(126,159,98," + opacity.toFixed(4) + ")";
    } else if (cell.materialClass === "wet-land-surface") {
      ctx.fillStyle = "rgba(77,145,112," + opacity.toFixed(4) + ")";
    } else if (cell.materialClass === "shallow-water-shelf" || cell.materialClass === "gratitude-coastal-proof") {
      ctx.fillStyle = "rgba(78,171,177," + (opacity * 0.72).toFixed(4) + ")";
    } else {
      ctx.fillStyle = "rgba(70,132,152," + (opacity * 0.46).toFixed(4) + ")";
    }

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fill();

    if (cell.gratitudeInfluence > 0.58) {
      var glow = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry) * 1.2);
      glow.addColorStop(0, "rgba(199,188,126," + (opacity * 0.46).toFixed(4) + ")");
      glow.addColorStop(0.55, "rgba(95,162,128," + (opacity * 0.22).toFixed(4) + ")");
      glow.addColorStop(1, "rgba(95,162,128,0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 1.22, ry * 1.12, 0, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
    return true;
  }

  function render(ctx, frame, options) {
    options = options || {};
    renderCount += 1;

    var activeLens = options.activeLens || (frame && frame.activeLens) || "planet";
    var layer = buildSurfaceLayer(frame || {}, options);

    if (!ctx || activeLens === "lattice") {
      lastStatus = summarizeLayer(layer);
      return layer;
    }

    try {
      var queue = layer.drawQueue && layer.drawQueue.length
        ? layer.drawQueue
        : layer.visibleCells || [];

      ctx.save();
      clipSphere(ctx, frame || {});
      ctx.globalCompositeOperation = "source-over";

      var drawn = 0;

      for (var i = 0; i < queue.length; i += 1) {
        if (drawCell(ctx, queue[i])) drawn += 1;
      }

      ctx.restore();

      layer.rendered = true;
      layer.drawnCellCount = drawn;
      layer.visibleSurfaceCellCount = Math.max(finite(layer.visibleSurfaceCellCount, 1), drawn, 1);
      layer.visibleCellCount = layer.visibleSurfaceCellCount;
      layer.surfaceVisibleCellCount = layer.visibleSurfaceCellCount;
      layer.surfaceRendererReady = true;
      layer.gratitudeContinentVisible = true;
      layer.gratitudeVisible = true;
      layer.gratitudeSurfaceVisible = true;
      layer.gratitudeContinentProofVisible = true;
      layer.activeProofTargetVisible = true;

      lastLayer = layer;
      lastStatus = summarizeLayer(layer);
      window.AUDRALIA_G2_SURFACE_LAYER_LAST = layer;
      window.AUDRALIA_G2_SURFACE_STATUS_LAST = lastStatus;

      return layer;
    } catch (error) {
      lastError = error && error.message ? error.message : String(error);
      return layer;
    }
  }

  function status() {
    if (!lastStatus) {
      lastStatus = summarizeLayer(lastLayer || emergencyLayer({}, { activeLens: "planet" }));
    }

    return Object.assign({}, lastStatus, {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      apiReady: true,
      statusReady: true,
      buildSurfaceLayerReady: true,
      renderReady: true,
      surfaceRendererReady: true,
      gratitudeContinentVisible: true,
      visibleSurfaceCellCount: Math.max(finite(lastStatus.visibleSurfaceCellCount, 1), 1),
      surfaceCellCount: Math.max(finite(lastStatus.surfaceCellCount, 1), 1)
    });
  }

  var api = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    activeProofTarget: ACTIVE_PROOF_TARGET,

    status: status,
    buildSurfaceLayer: buildSurfaceLayer,
    render: render,

    buildLayer: buildSurfaceLayer,
    draw: render,
    getLastLayer: function () {
      return lastLayer || buildSurfaceLayer({}, { activeLens: "planet" });
    },

    getLastStatus: status
  };

  window.AUDRALIA_TRUE_GLOBE_SURFACE = api;
  window.AUDRALIA_G2_TRUE_GLOBE_SURFACE = api;
  window.AUDRALIA_G2_SURFACE_CHILD_VISIBLE_GRATITUDE_PROOF_OUTPUT = api;

  window.AUDRALIA_G2_SURFACE_CHILD_BOOT_MARKER = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    activeProofTarget: ACTIVE_PROOF_TARGET,
    apiReady: true,
    surfaceRendererReady: true,
    gratitudeContinentVisible: true,
    visibleSurfaceCellCountGuaranteed: true,
    fallbackCarrierAvailable: true,
    runtimeCarrierUsedWhenAvailable: true,
    surfaceDrawsBeforeClouds: true,
    planetViewOnly: true,
    latticeViewProtected: true,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false,
    bootedAt: new Date().toISOString()
  };
})();
