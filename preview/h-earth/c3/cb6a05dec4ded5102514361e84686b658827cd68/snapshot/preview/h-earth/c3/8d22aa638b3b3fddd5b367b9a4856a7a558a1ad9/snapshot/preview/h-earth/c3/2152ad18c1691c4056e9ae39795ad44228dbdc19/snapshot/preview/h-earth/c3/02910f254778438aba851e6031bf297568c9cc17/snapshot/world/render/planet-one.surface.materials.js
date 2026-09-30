/*
 G5_VISUAL_REFINEMENT_SURFACE_NEGATIVE_SPACE_LOBE_SILHOUETTE_TNT_v1
 TARGET=/world/render/planet-one.surface.materials.js
 PURPOSE:
 Materials-second refinement for the G5 Planet 1 visual branch.
 Consumes the G5 land geometry, paints negative-space ocean gulfs as water/shelf/depth,
 reduces decorative dark ribbons, reinforces lobe relief only where geometry supports it,
 and preserves the public surface-material API.
*/

(function attachPlanetOneSurfaceMaterials(global) {
  "use strict";

  var VERSION = "G5_VISUAL_REFINEMENT_SURFACE_NEGATIVE_SPACE_LOBE_SILHOUETTE_TNT_v1";
  var PREVIOUS_VERSION = "B27B_SURFACE_MATERIALS_RELIEF_TNT_v1";
  var CONTRACT_MARKERS = [
    VERSION,
    PREVIOUS_VERSION,
    "planet-one-surface-materials-module-active=true",
    "cinematic-material-authority-active=true",
    "ocean-depth-authority-active=true",
    "coastal-shelf-authority-active=true",
    "plateau-ridge-material-authority-active=true",
    "mineral-pressure-authority-active=true",
    "g5-visual-refinement-active=true",
    "b27-candidate-refined=true",
    "negative-space-gulf-carving-active=true",
    "lobe-silhouette-strengthened=true",
    "decorative-ribbon-reduced=true",
    "ocean-intrusion-geometry-active=true",
    "shelf-gradient-replaces-ribbon=true",
    "physical-world-material-read-active=true",
    "visual-pass-not-claimed=true",
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

    ocean.addColorStop(0.00, "#1a91a9");
    ocean.addColorStop(0.18, "#0d6888");
    ocean.addColorStop(0.44, "#06334d");
    ocean.addColorStop(0.72, "#02182c");
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
      ctx.ellipse(cx + radius * basin.x, cy + radius * basin.y, radius * basin.rx, radius * basin.ry, deg(basin.r), 0, Math.PI * 2);
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
      ctx.strokeStyle = "rgba(124,220,232,0.034)";
      ctx.lineWidth = Math.max(1, radius * 0.003);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlanetOneConstructSurface(ctx, construct, helpers, frame) {
    var outline = helpers.fractureConstructOutline(construct.outline, construct.fractureProfile || { phase: construct.phase, force: construct.type === "attached-triad" ? 1.0 : 0.85 });
    var projected = helpers.visibleProjectedPath(outline, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
    var fill;
    var radius = frame.radius;
    var i;

    if (projected.length < 5) return;

    ctx.save();
    if (helpers.smoothClosedPath(ctx, projected)) {
      fill = ctx.createRadialGradient(frame.cx - radius * 0.25, frame.cy - radius * 0.32, radius * 0.03, frame.cx, frame.cy, radius * 1.08);
      fill.addColorStop(0.00, construct.colorA || "rgba(74,111,70,0.82)");
      fill.addColorStop(0.25, "rgba(48,96,67,0.82)");
      fill.addColorStop(0.48, construct.colorB || "rgba(34,70,55,0.88)");
      fill.addColorStop(0.69, construct.colorC || "rgba(119,98,67,0.27)");
      fill.addColorStop(1.00, "rgba(11,20,20,0.88)");

      ctx.globalAlpha = construct.type === "attached-triad" ? 0.77 : 0.72;
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.save();
      if (helpers.smoothClosedPath(ctx, projected)) {
        ctx.clip();
        drawInteriorTerrain(ctx, construct, helpers, frame);
        drawFusedLobePressure(ctx, construct, helpers, frame);
        drawBasins(ctx, construct, helpers, frame);
        drawNegativeSpaceGulfs(ctx, construct, helpers, frame);
        drawMineralPressure(ctx, construct, helpers, frame);
      }
      ctx.restore();

      ctx.shadowColor = "rgba(95,222,232,0.13)";
      ctx.shadowBlur = radius * 0.005;
      ctx.strokeStyle = construct.shore || "rgba(132,225,231,0.34)";
      ctx.lineWidth = Math.max(0.8, radius * (construct.type === "attached-triad" ? 0.0054 : 0.0042));
      ctx.globalAlpha = construct.type === "attached-triad" ? 0.34 : 0.22;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(238,255,247,0.13)";
      ctx.lineWidth = Math.max(0.35, radius * 0.0010);
      ctx.globalAlpha = 0.12;
      ctx.stroke();
    }
    ctx.restore();

    drawCoastalShelf(ctx, projected, construct, radius, helpers);
    drawCoastFollowingCuts(ctx, construct, helpers, frame);

    for (i = 0; construct.plateaus && i < construct.plateaus.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.plateaus[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(209,178,108,0.22)", Math.max(0.72, radius * 0.0025), construct.type === "attached-triad" ? 0.58 : 0.34);
      helpers.drawOpenProjectedLine(ctx, construct.plateaus[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(13,22,18,0.22)", Math.max(0.48, radius * 0.0012), construct.type === "attached-triad" ? 0.28 : 0.18);
    }

    for (i = 0; construct.ridges && i < construct.ridges.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.ridges[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, construct.ridge || "rgba(9,15,15,0.56)", Math.max(0.8, radius * (construct.type === "attached-triad" ? 0.0034 : 0.0025)), construct.type === "attached-triad" ? 0.44 : 0.24);
      helpers.drawOpenProjectedLine(ctx, construct.ridges[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(223,190,112,0.10)", Math.max(0.32, radius * 0.0010), construct.type === "attached-triad" ? 0.34 : 0.18);
    }

    for (i = 0; construct.tectonicSeams && i < construct.tectonicSeams.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.tectonicSeams[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(7,12,12,0.22)", Math.max(0.85, radius * 0.0026), 0.24);
      helpers.drawOpenProjectedLine(ctx, construct.tectonicSeams[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(230,190,112,0.12)", Math.max(0.42, radius * 0.0012), 0.24);
    }

    for (i = 0; construct.lobeBoundaryPressure && i < construct.lobeBoundaryPressure.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.lobeBoundaryPressure[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(0,10,12,0.18)", Math.max(0.95, radius * 0.0034), 0.22);
      helpers.drawOpenProjectedLine(ctx, construct.lobeBoundaryPressure[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(132,210,206,0.075)", Math.max(0.46, radius * 0.0012), 0.28);
    }
  }

  function drawProjectedPolygon(ctx, points, helpers, frame, fillStyle, strokeStyle, lineWidth, alpha) {
    var projected = helpers.visibleProjectedPath(points, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);

    if (!projected || projected.length < 3) return false;

    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    if (helpers.smoothClosedPath(ctx, projected)) {
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth || 1;
        ctx.stroke();
      }
    }
    ctx.restore();
    return true;
  }

  function drawNegativeSpaceGulfs(ctx, construct, helpers, frame) {
    var gulfs = construct.negativeSpaceGulfs || [];
    var radius = frame.radius;
    var i;
    var gulf;
    var fill;

    if (!gulfs.length) return;

    for (i = 0; i < gulfs.length; i += 1) {
      gulf = gulfs[i];
      fill = "rgba(3,42,62," + clamp(0.30 + (gulf.depth || 0.6) * 0.18, 0.28, 0.52) + ")";
      drawProjectedPolygon(ctx, gulf.polygon, helpers, frame, "rgba(0,7,14,0.18)", null, 0, 0.88);
      drawProjectedPolygon(ctx, gulf.polygon, helpers, frame, fill, "rgba(112,224,230,0.20)", Math.max(0.7, radius * 0.0022), 0.92);
      drawProjectedPolygon(ctx, gulf.polygon, helpers, frame, "rgba(120,222,224,0.055)", null, 0, 1);
    }
  }

  function drawCoastalShelf(ctx, projected, construct, radius, helpers) {
    if (!projected || projected.length < 5) return;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = construct.shelf || "rgba(74,185,204,0.16)";
    ctx.lineWidth = Math.max(1.1, radius * (construct.type === "attached-triad" ? 0.010 : 0.007));
    ctx.globalAlpha = construct.type === "attached-triad" ? 0.32 : 0.20;
    if (helpers.smoothClosedPath(ctx, projected)) ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(1,12,22,0.24)";
    ctx.lineWidth = Math.max(0.8, radius * 0.0042);
    ctx.globalAlpha = construct.type === "attached-triad" ? 0.18 : 0.10;
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
      width = Math.max(0.7, radius * (cut.width || 6) / 680);
      helpers.drawOpenProjectedLine(ctx, cut.path, frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(3,36,55," + (0.12 + (cut.depth || 0.4) * 0.10) + ")", width * 2.2, 0.54);
      helpers.drawOpenProjectedLine(ctx, cut.path, frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(69,177,196," + (0.08 + (cut.depth || 0.4) * 0.07) + ")", width * 1.4, 0.46);
      helpers.drawOpenProjectedLine(ctx, cut.path, frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(156,235,231," + (0.06 + (cut.depth || 0.4) * 0.04) + ")", width * 0.55, 0.38);
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
        if (n + h * 0.62 < 0.24) continue;
        p = helpers.project(lon, lat, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
        if (!p.visible || p.limb < 0.14) continue;
        alpha = clamp(0.012 + (n + h) * 0.030, 0.008, 0.062) * p.limb;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.27, frame.radius * 0.0020), 0, Math.PI * 2);
        ctx.fillStyle = n > 0.52 ? "rgba(218,181,102," + alpha + ")" : "rgba(8,15,14," + alpha + ")";
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
      ctx.ellipse(p.x, p.y, radius * lobe.radius[0] / 185, radius * lobe.radius[1] / 185, deg((i - 1) * 10), 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? "rgba(217,185,108,0.030)" : "rgba(0,12,10,0.034)";
      ctx.fill();
      ctx.strokeStyle = i === 1 ? "rgba(218,184,108,0.050)" : "rgba(0,19,17,0.056)";
      ctx.lineWidth = Math.max(0.45, radius * 0.0012);
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
      ctx.ellipse(0, 0, radius * basin.radius[0] / 220, radius * basin.radius[1] / 220, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,13,11," + (0.028 + (basin.depth || 0.3) * 0.045) + ")";
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
        if (n + h * 0.40 < 0.25) continue;
        p = helpers.project(lon, lat, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
        if (!p.visible || p.limb < 0.14) continue;
        alpha = clamp(0.010 + p.limb * 0.028 + Math.max(0, h) * 0.009, 0.008, 0.052);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.25, frame.radius * 0.0020), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,176,92," + alpha + ")";
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
    var ctx = frame.ctx;
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
      alpha = 0.008 + ((i * 17) % 13) / 1700;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.38, radius * (0.0014 + ((i % 5) * 0.00034))), 0, Math.PI * 2);
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
    var limb = ctx.createRadialGradient(cx, cy, radius * 0.46, cx, cy, radius * 1.05);

    shade.addColorStop(0.00, "rgba(255,255,255,0.092)");
    shade.addColorStop(0.28, "rgba(255,255,255,0.019)");
    shade.addColorStop(0.55, "rgba(0,0,0,0.16)");
    shade.addColorStop(0.80, "rgba(0,0,0,0.47)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.77)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    limb.addColorStop(0.00, "rgba(255,255,255,0)");
    limb.addColorStop(0.66, "rgba(72,164,192,0.034)");
    limb.addColorStop(0.88, "rgba(98,218,238,0.18)");
    limb.addColorStop(1.00, "rgba(220,248,255,0.35)");
    ctx.fillStyle = limb;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(142,232,245,0.24)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.shadowColor = "rgba(114,219,242,0.24)";
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
      negativeSpaceGulfCarvingActive: true,
      lobeSilhouetteStrengthened: true,
      decorativeRibbonReduced: true,
      shelfGradientReplacesRibbon: true,
      physicalWorldMaterialReadActive: true,
      visualPassClaimed: false,
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
