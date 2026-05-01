/*
 B27B_SURFACE_MATERIALS_RELIEF_TNT_v1
 TARGET=/world/render/planet-one.surface.materials.js
 PURPOSE:
 Materials-second renewal for Planet 1 after B27A geometry.
 Owns ocean depth, coast-following cuts, shelf gradients, plateau relief, mountain spine contrast,
 valley/basin shadow, mineral pressure, surface film, and atmospheric finish.
 DOES NOT OWN:
 Landmass law, construct count, region attachment law, polar separation law, public renderer contract,
 canvas mount, route, runtime, asset consumer, gauges, or tree demo.
*/

(function attachPlanetOneSurfaceMaterials(global) {
  "use strict";

  var VERSION = "B27B_SURFACE_MATERIALS_RELIEF_TNT_v1";
  var PREVIOUS_VERSION = "B26C_SURFACE_MATERIALS_MODULE_TNT_v1";
  var CONTRACT_MARKERS = [
    VERSION,
    PREVIOUS_VERSION,
    "planet-one-surface-materials-module-active=true",
    "cinematic-material-authority-active=true",
    "ocean-depth-authority-active=true",
    "coastal-shelf-authority-active=true",
    "plateau-ridge-material-authority-active=true",
    "mineral-pressure-authority-active=true",
    "coast-following-material-cuts-active=true",
    "plateau-relief-visible=true",
    "mountain-spine-contrast-active=true",
    "basin-valley-shadow-active=true",
    "mineral-pressure-banding-active=true",
    "flat-fill-dominance-reduced=true",
    "physical-world-material-read-active=true",
    "surface-authority-only=true",
    "land-geometry-owned-by-land-constructs-module=true",
    "canvas-mount-owned-by-renderer-facade=true"
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function deg(value) {
    return value * Math.PI / 180;
  }

  function signedNoise(lon, lat, phase) {
    return (
      Math.sin(deg(lon * 1.7 + lat * 2.9 + phase * 31)) * 0.46 +
      Math.cos(deg(lon * 3.3 - lat * 1.8 + phase * 17)) * 0.31 +
      Math.sin(deg(lon * 7.2 + lat * 5.6 + phase * 13)) * 0.15 +
      Math.cos(deg(lon * 13.8 - lat * 8.7 + phase * 11)) * 0.08
    );
  }

  function highNoise(lon, lat, phase) {
    return (
      Math.sin(deg(lon * 11.1 + lat * 7.3 + phase * 19)) * 0.36 +
      Math.cos(deg(lon * 19.7 - lat * 13.5 + phase * 23)) * 0.24 +
      Math.sin(deg(lon * 31.0 + lat * 17.0 + phase * 29)) * 0.14
    );
  }

  function drawPlanetOneOcean(ctx, frame) {
    var cx = frame.cx;
    var cy = frame.cy;
    var radius = frame.radius;
    var ocean = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.02, cx, cy, radius * 1.04);

    ocean.addColorStop(0.00, "#1b96ae");
    ocean.addColorStop(0.18, "#0f6f8e");
    ocean.addColorStop(0.44, "#063750");
    ocean.addColorStop(0.72, "#02182b");
    ocean.addColorStop(1.00, "#010610");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    drawOceanBasins(ctx, cx, cy, radius);
    drawOceanCurrents(ctx, cx, cy, radius);
  }

  function drawOceanBasins(ctx, cx, cy, radius) {
    var basins = [
      { x: -0.43, y: -0.10, rx: 0.31, ry: 0.20, a: 0.24, r: -11 },
      { x: 0.28, y: 0.18, rx: 0.39, ry: 0.24, a: 0.22, r: 19 },
      { x: 0.10, y: -0.36, rx: 0.33, ry: 0.17, a: 0.18, r: -7 },
      { x: -0.02, y: 0.49, rx: 0.39, ry: 0.13, a: 0.16, r: 4 },
      { x: 0.47, y: -0.09, rx: 0.21, ry: 0.39, a: 0.18, r: 10 }
    ];
    var i;
    var basin;

    ctx.save();
    for (i = 0; i < basins.length; i += 1) {
      basin = basins[i];
      ctx.beginPath();
      ctx.ellipse(
        cx + radius * basin.x,
        cy + radius * basin.y,
        radius * basin.rx,
        radius * basin.ry,
        deg(basin.r),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0,6,18," + basin.a + ")";
      ctx.fill();
    }
    ctx.restore();
  }

  function drawOceanCurrents(ctx, cx, cy, radius) {
    var i;
    var y;
    var w;

    ctx.save();
    for (i = -6; i <= 6; i += 1) {
      y = cy + i * radius * 0.115;
      w = radius * (1.52 - Math.abs(i) * 0.08);
      ctx.beginPath();
      ctx.ellipse(cx, y, w * 0.48, radius * 0.026, 0.055 * i, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124,220,232,0.036)";
      ctx.lineWidth = Math.max(1, radius * 0.003);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlanetOneConstructSurface(ctx, construct, helpers, frame) {
    var outline = helpers.fractureConstructOutline(construct.outline, construct.fractureProfile || { phase: construct.phase, force: construct.type === "attached-triad" ? 1.2 : 0.9 });
    var projected = helpers.visibleProjectedPath(outline, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
    var fill;
    var radius = frame.radius;
    var i;

    if (projected.length < 5) return;

    ctx.save();
    if (helpers.smoothClosedPath(ctx, projected)) {
      fill = ctx.createRadialGradient(frame.cx - radius * 0.25, frame.cy - radius * 0.32, radius * 0.03, frame.cx, frame.cy, radius * 1.07);
      fill.addColorStop(0.00, construct.colorA || "rgba(86,123,74,0.82)");
      fill.addColorStop(0.26, "rgba(55,106,72,0.84)");
      fill.addColorStop(0.48, construct.colorB || "rgba(39,78,57,0.88)");
      fill.addColorStop(0.69, construct.colorC || "rgba(132,107,71,0.28)");
      fill.addColorStop(1.00, "rgba(13,22,21,0.88)");

      ctx.globalAlpha = construct.type === "attached-triad" ? 0.79 : 0.74;
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.save();
      if (helpers.smoothClosedPath(ctx, projected)) {
        ctx.clip();
        drawInteriorTerrain(ctx, construct, helpers, frame);
        drawFusedLobePressure(ctx, construct, helpers, frame);
        drawBasins(ctx, construct, helpers, frame);
        drawMineralPressure(ctx, construct, helpers, frame);
      }
      ctx.restore();

      ctx.shadowColor = "rgba(95,222,232,0.16)";
      ctx.shadowBlur = radius * 0.006;
      ctx.strokeStyle = construct.shore || "rgba(137,232,235,0.38)";
      ctx.lineWidth = Math.max(0.9, radius * (construct.type === "attached-triad" ? 0.0062 : 0.0046));
      ctx.globalAlpha = construct.type === "attached-triad" ? 0.41 : 0.26;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(238,255,247,0.17)";
      ctx.lineWidth = Math.max(0.4, radius * 0.0012);
      ctx.globalAlpha = 0.14;
      ctx.stroke();
    }
    ctx.restore();

    drawCoastalShelf(ctx, projected, construct, radius, helpers);
    drawCoastFollowingCuts(ctx, construct, helpers, frame);

    for (i = 0; construct.plateaus && i < construct.plateaus.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.plateaus[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(215,183,112,0.24)", Math.max(0.75, radius * 0.0027), construct.type === "attached-triad" ? 0.68 : 0.40);
      helpers.drawOpenProjectedLine(ctx, construct.plateaus[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(18,26,20,0.24)", Math.max(0.55, radius * 0.0014), construct.type === "attached-triad" ? 0.34 : 0.22);
    }

    for (i = 0; construct.ridges && i < construct.ridges.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.ridges[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, construct.ridge || "rgba(12,18,17,0.56)", Math.max(0.8, radius * (construct.type === "attached-triad" ? 0.0038 : 0.0028)), construct.type === "attached-triad" ? 0.48 : 0.28);
      helpers.drawOpenProjectedLine(ctx, construct.ridges[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(232,197,113,0.12)", Math.max(0.38, radius * 0.0012), construct.type === "attached-triad" ? 0.38 : 0.20);
    }

    for (i = 0; construct.tectonicSeams && i < construct.tectonicSeams.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.tectonicSeams[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(7,12,12,0.38)", Math.max(0.9, radius * 0.0032), 0.36);
      helpers.drawOpenProjectedLine(ctx, construct.tectonicSeams[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(238,196,111,0.20)", Math.max(0.48, radius * 0.0017), 0.34);
    }

    for (i = 0; construct.lobeBoundaryPressure && i < construct.lobeBoundaryPressure.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.lobeBoundaryPressure[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(0,10,12,0.28)", Math.max(1.1, radius * 0.0045), 0.30);
      helpers.drawOpenProjectedLine(ctx, construct.lobeBoundaryPressure[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(134,219,213,0.10)", Math.max(0.55, radius * 0.0016), 0.36);
    }
  }

  function drawCoastalShelf(ctx, projected, construct, radius, helpers) {
    if (!projected || projected.length < 5) return;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = construct.shelf || "rgba(78,196,210,0.16)";
    ctx.lineWidth = Math.max(1.4, radius * (construct.type === "attached-triad" ? 0.014 : 0.008));
    ctx.globalAlpha = construct.type === "attached-triad" ? 0.44 : 0.24;
    if (helpers.smoothClosedPath(ctx, projected)) ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(1,10,20,0.38)";
    ctx.lineWidth = Math.max(1.0, radius * 0.006);
    ctx.globalAlpha = construct.type === "attached-triad" ? 0.31 : 0.15;
    if (helpers.smoothClosedPath(ctx, projected)) ctx.stroke();
    ctx.restore();
  }

  function drawCoastFollowingCuts(ctx, construct, helpers, frame) {
    var cuts = construct.coastalCuts || [];
    var radius = frame.radius;
    var i;
    var cut;
    var width;

    ctx.save();
    for (i = 0; i < cuts.length; i += 1) {
      cut = cuts[i];
      width = Math.max(1.0, radius * (cut.width || 8) / 560);
      helpers.drawOpenProjectedLine(ctx, cut.path, frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(0,12,24," + (0.22 + (cut.depth || 0.5) * 0.26) + ")", width * 3.2, 0.78);
      helpers.drawOpenProjectedLine(ctx, cut.path, frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(35,150,174," + (0.10 + (cut.depth || 0.5) * 0.10) + ")", width * 2.0, 0.62);
      helpers.drawOpenProjectedLine(ctx, cut.path, frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(151,236,232," + (0.10 + (cut.depth || 0.5) * 0.08) + ")", width * 0.8, 0.50);
    }
    ctx.restore();

    if (!cuts.length) {
      drawLegacyIntrusions(ctx, construct, helpers, frame);
    }
  }

  function drawLegacyIntrusions(ctx, construct, helpers, frame) {
    var i;
    var bite;
    var p;
    var scale;
    var radius = frame.radius;

    if (!construct.coastalIntrusions || !construct.coastalIntrusions.length) return;

    ctx.save();
    for (i = 0; i < construct.coastalIntrusions.length; i += 1) {
      bite = construct.coastalIntrusions[i];
      p = helpers.project(bite.lon, bite.lat, frame.rotation, frame.tilt, frame.cx, frame.cy, radius);
      if (!p.visible || p.limb < 0.12) continue;
      scale = p.limb * radius;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(deg(bite.angle || 0));
      ctx.beginPath();
      ctx.ellipse(0, 0, scale * bite.rx / 100, scale * bite.ry / 112, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(1,20,32," + (0.10 + bite.depth * 0.11) + ")";
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawInteriorTerrain(ctx, construct, helpers, frame) {
    var lat;
    var lon;
    var p;
    var n;
    var h;
    var alpha;

    if (construct.type === "pole") return;

    for (lat = -62; lat <= 62; lat += 4) {
      for (lon = -170; lon <= 170; lon += 4) {
        if (!helpers.pointInPolygon(construct.outline, lon, lat)) continue;
        n = signedNoise(lon, lat, (construct.phase || 0) + 1.7);
        h = highNoise(lon, lat, (construct.phase || 0) + 2.1);
        if (n + h * 0.62 < 0.22) continue;
        p = helpers.project(lon, lat, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
        if (!p.visible || p.limb < 0.14) continue;
        alpha = clamp(0.014 + (n + h) * 0.033, 0.010, 0.074) * p.limb;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.30, frame.radius * 0.0022), 0, Math.PI * 2);
        ctx.fillStyle = n > 0.52 ? "rgba(223,186,104," + alpha + ")" : "rgba(8,16,14," + alpha + ")";
        ctx.fill();
      }
    }
  }

  function drawFusedLobePressure(ctx, construct, helpers, frame) {
    var i;
    var lobe;
    var p;
    var radius = frame.radius;

    if (!construct.fusedLobes || construct.type !== "attached-triad") return;

    ctx.save();
    for (i = 0; i < construct.fusedLobes.length; i += 1) {
      lobe = construct.fusedLobes[i];
      p = helpers.project(lobe.center[0], lobe.center[1], frame.rotation, frame.tilt, frame.cx, frame.cy, radius);
      if (!p.visible || p.limb < 0.10) continue;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, radius * lobe.radius[0] / 180, radius * lobe.radius[1] / 180, deg((i - 1) * 10), 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? "rgba(226,194,113,0.038)" : "rgba(0,12,10,0.042)";
      ctx.fill();
      ctx.strokeStyle = i === 1 ? "rgba(229,193,112,0.060)" : "rgba(0,20,18,0.070)";
      ctx.lineWidth = Math.max(0.5, radius * 0.0015);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBasins(ctx, construct, helpers, frame) {
    var basins = construct.basins || [];
    var i;
    var basin;
    var p;
    var radius = frame.radius;

    ctx.save();
    for (i = 0; i < basins.length; i += 1) {
      basin = basins[i];
      p = helpers.project(basin.center[0], basin.center[1], frame.rotation, frame.tilt, frame.cx, frame.cy, radius);
      if (!p.visible || p.limb < 0.12) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(deg(basin.angle || 0));
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * basin.radius[0] / 210, radius * basin.radius[1] / 210, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,13,11," + (0.038 + (basin.depth || 0.3) * 0.055) + ")";
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawMineralPressure(ctx, construct, helpers, frame) {
    var lon;
    var lat;
    var p;
    var n;
    var h;
    var alpha;

    ctx.save();
    for (lat = -78; lat <= 78; lat += 5) {
      for (lon = -178; lon <= 178; lon += 5) {
        if (!helpers.pointInPolygon(construct.outline, lon, lat)) continue;
        n = signedNoise(lon, lat, (construct.phase || 0) + 6.3);
        h = highNoise(lon, lat, (construct.phase || 0) + 5.6);
        if (n + h * 0.40 < 0.24) continue;
        p = helpers.project(lon, lat, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
        if (!p.visible || p.limb < 0.14) continue;
        alpha = clamp(0.012 + p.limb * 0.033 + Math.max(0, h) * 0.010, 0.010, 0.060);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.28, frame.radius * 0.0022), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(225,181,95," + alpha + ")";
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawPlanetOneSurfaceFilm(ctx, frame) {
    var i;
    var x;
    var y;
    var alpha;
    var cx = frame.cx;
    var cy = frame.cy;
    var radius = frame.radius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (i = 0; i < 230; i += 1) {
      x = cx - radius + ((i * 97) % Math.floor(radius * 2));
      y = cy - radius + ((i * 53) % Math.floor(radius * 2));
      if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) > radius * radius) continue;
      alpha = 0.009 + ((i * 17) % 13) / 1500;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.42, radius * (0.0016 + ((i % 5) * 0.00040))), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,238,190," + alpha + ")";
      ctx.fill();
    }

    ctx.restore();
  }

  function drawPlanetOneAtmosphere(ctx, frame) {
    var ctx = frame.ctx;
    var cx = frame.cx;
    var cy = frame.cy;
    var radius = frame.radius;
    var shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    var limb = ctx.createRadialGradient(cx, cy, radius * 0.48, cx, cy, radius * 1.05);

    shade.addColorStop(0.00, "rgba(255,255,255,0.095)");
    shade.addColorStop(0.28, "rgba(255,255,255,0.020)");
    shade.addColorStop(0.55, "rgba(0,0,0,0.16)");
    shade.addColorStop(0.80, "rgba(0,0,0,0.46)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.76)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    limb.addColorStop(0.00, "rgba(255,255,255,0)");
    limb.addColorStop(0.66, "rgba(72,164,192,0.035)");
    limb.addColorStop(0.88, "rgba(98,218,238,0.19)");
    limb.addColorStop(1.00, "rgba(220,248,255,0.36)");
    ctx.fillStyle = limb;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(142,232,245,0.25)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.shadowColor = "rgba(114,219,242,0.25)";
    ctx.shadowBlur = radius * 0.032;
    ctx.stroke();
    ctx.restore();
  }

  function getSurfaceMaterialStatus() {
    return {
      ok: true,
      active: true,
      version: VERSION,
      VERSION: VERSION,
      previousVersion: PREVIOUS_VERSION,
      cinematicMaterialAuthorityActive: true,
      oceanDepthAuthorityActive: true,
      coastalShelfAuthorityActive: true,
      plateauRidgeMaterialAuthorityActive: true,
      mineralPressureAuthorityActive: true,
      coastFollowingMaterialCutsActive: true,
      plateauReliefVisible: true,
      mountainSpineContrastActive: true,
      basinValleyShadowActive: true,
      mineralPressureBandingActive: true,
      flatFillDominanceReduced: true,
      physicalWorldMaterialReadActive: true,
      markers: CONTRACT_MARKERS.slice(),
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice()
    };
  }

  global.DGBPlanetOneSurfaceMaterials = {
    VERSION: VERSION,
    version: VERSION,
    PREVIOUS_VERSION: PREVIOUS_VERSION,
    previousVersion: PREVIOUS_VERSION,
    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
    markers: CONTRACT_MARKERS.slice(),
    drawPlanetOneOcean: drawPlanetOneOcean,
    drawPlanetOneConstructSurface: drawPlanetOneConstructSurface,
    drawPlanetOneAtmosphere: drawPlanetOneAtmosphere,
    drawPlanetOneSurfaceFilm: drawPlanetOneSurfaceFilm,
    getSurfaceMaterialStatus: getSurfaceMaterialStatus,
    status: getSurfaceMaterialStatus
  };
})(typeof window !== "undefined" ? window : globalThis);
