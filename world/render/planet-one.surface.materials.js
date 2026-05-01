/*
 B26C_SURFACE_MATERIALS_MODULE_TNT_v1
 TARGET=/world/render/planet-one.surface.materials.js
 PURPOSE:
 Dedicated Planet 1 surface material and visual expression authority.
 Owns ocean depth, continental shelf, coastal shadow, plateau/ridge rendering,
 mineral pressure, ancient surface film, and atmosphere.
 DOES NOT OWN:
 Landmass law, construct count, region attachment law, polar separation law,
 public renderer contract, canvas mount, page route, gauges, tree demo.
*/

(function attachPlanetOneSurfaceMaterials(global) {
  "use strict";

  var VERSION = "B26C_SURFACE_MATERIALS_MODULE_TNT_v1";
  var CONTRACT_MARKERS = [
    VERSION,
    "planet-one-surface-materials-module-active=true",
    "cinematic-material-authority-active=true",
    "ocean-depth-authority-active=true",
    "coastal-shelf-authority-active=true",
    "plateau-ridge-material-authority-active=true",
    "mineral-pressure-authority-active=true",
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

    ocean.addColorStop(0.00, "#1a8fa8");
    ocean.addColorStop(0.22, "#0c607f");
    ocean.addColorStop(0.50, "#052d45");
    ocean.addColorStop(0.78, "#021425");
    ocean.addColorStop(1.00, "#010611");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    drawOceanBasins(ctx, cx, cy, radius);
    drawOceanCurrents(ctx, cx, cy, radius);
  }

  function drawOceanBasins(ctx, cx, cy, radius) {
    var basins = [
      { x: -0.39, y: -0.08, rx: 0.26, ry: 0.18, a: 0.21 },
      { x: 0.24, y: 0.19, rx: 0.36, ry: 0.22, a: 0.18 },
      { x: 0.10, y: -0.34, rx: 0.29, ry: 0.15, a: 0.15 },
      { x: -0.05, y: 0.46, rx: 0.34, ry: 0.11, a: 0.13 }
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
        deg(i * 23 - 18),
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
    for (i = -5; i <= 5; i += 1) {
      y = cy + i * radius * 0.13;
      w = radius * (1.46 - Math.abs(i) * 0.09);
      ctx.beginPath();
      ctx.ellipse(cx, y, w * 0.48, radius * 0.030, 0.06 * i, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124,220,232,0.042)";
      ctx.lineWidth = Math.max(1, radius * 0.0035);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlanetOneConstructSurface(ctx, construct, helpers, frame) {
    var outline;
    var projected;
    var fill;
    var i;
    var radius = frame.radius;

    outline = helpers.fractureConstructOutline(construct.outline, construct.fractureProfile || { phase: construct.phase, force: construct.type === "attached-triad" ? 1.45 : 0.92 });
    projected = helpers.visibleProjectedPath(outline, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);

    if (projected.length < 5) return;

    ctx.save();
    if (helpers.smoothClosedPath(ctx, projected)) {
      fill = ctx.createRadialGradient(frame.cx - radius * 0.30, frame.cy - radius * 0.34, radius * 0.05, frame.cx, frame.cy, radius * 1.05);
      fill.addColorStop(0.00, construct.colorA || "rgba(88,124,76,0.86)");
      fill.addColorStop(0.34, construct.colorB || "rgba(42,80,58,0.90)");
      fill.addColorStop(0.64, construct.colorC || "rgba(126,105,73,0.30)");
      fill.addColorStop(1.00, "rgba(15,25,23,0.88)");

      ctx.globalAlpha = construct.type === "attached-triad" ? 0.84 : 0.76;
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.save();
      if (helpers.smoothClosedPath(ctx, projected)) {
        ctx.clip();
        drawInteriorTerrain(ctx, construct, helpers, frame);
        drawFusedLobePressure(ctx, construct, helpers, frame);
      }
      ctx.restore();

      ctx.shadowColor = "rgba(95,222,232,0.15)";
      ctx.shadowBlur = radius * 0.007;
      ctx.strokeStyle = construct.shore || "rgba(137,232,235,0.38)";
      ctx.lineWidth = Math.max(0.9, radius * (construct.type === "attached-triad" ? 0.0064 : 0.0048));
      ctx.globalAlpha = construct.type === "attached-triad" ? 0.42 : 0.27;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(238,255,247,0.18)";
      ctx.lineWidth = Math.max(0.4, radius * 0.0013);
      ctx.globalAlpha = 0.16;
      ctx.stroke();
    }
    ctx.restore();

    drawCoastalShelf(ctx, projected, construct, radius, helpers);
    drawCoastalIntrusions(ctx, construct, helpers, frame);

    for (i = 0; construct.plateaus && i < construct.plateaus.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.plateaus[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(197,167,102,0.18)", Math.max(0.65, radius * 0.0023), construct.type === "attached-triad" ? 0.56 : 0.34);
    }

    for (i = 0; construct.ridges && i < construct.ridges.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.ridges[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, construct.ridge || "rgba(14,20,18,0.50)", Math.max(0.7, radius * (construct.type === "attached-triad" ? 0.0035 : 0.0027)), construct.type === "attached-triad" ? 0.38 : 0.23);
    }

    for (i = 0; construct.tectonicSeams && i < construct.tectonicSeams.length; i += 1) {
      helpers.drawOpenProjectedLine(ctx, construct.tectonicSeams[i], frame.rotation, frame.tilt, frame.cx, frame.cy, radius, "rgba(238,196,111,0.18)", Math.max(0.48, radius * 0.0018), 0.34);
    }

    drawMineralPressure(ctx, construct, helpers, frame);
  }

  function drawCoastalShelf(ctx, projected, construct, radius, helpers) {
    if (projected.length < 5) return;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = construct.shelf || "rgba(78,196,210,0.16)";
    ctx.lineWidth = Math.max(1.2, radius * (construct.type === "attached-triad" ? 0.012 : 0.008));
    ctx.globalAlpha = construct.type === "attached-triad" ? 0.40 : 0.23;
    if (helpers.smoothClosedPath(ctx, projected)) ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(1,10,20,0.32)";
    ctx.lineWidth = Math.max(0.8, radius * 0.005);
    ctx.globalAlpha = construct.type === "attached-triad" ? 0.28 : 0.14;
    if (helpers.smoothClosedPath(ctx, projected)) ctx.stroke();
    ctx.restore();
  }

  function drawCoastalIntrusions(ctx, construct, helpers, frame) {
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
      ctx.ellipse(0, 0, scale * bite.rx / 80, scale * bite.ry / 80, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(1,20,32," + (0.18 + bite.depth * 0.17) + ")";
      ctx.fill();
      ctx.strokeStyle = "rgba(119,223,232," + (0.14 + bite.depth * 0.11) + ")";
      ctx.lineWidth = Math.max(0.5, radius * 0.0017);
      ctx.stroke();
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

    for (lat = -62; lat <= 62; lat += 5) {
      for (lon = -170; lon <= 170; lon += 5) {
        n = signedNoise(lon, lat, (construct.phase || 0) + 1.7);
        h = highNoise(lon, lat, (construct.phase || 0) + 2.1);
        if (n + h * 0.6 < 0.28) continue;
        if (!helpers.pointInPolygon(construct.outline, lon, lat)) continue;
        p = helpers.project(lon, lat, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
        if (!p.visible || p.limb < 0.16) continue;
        alpha = clamp(0.012 + (n + h) * 0.028, 0.010, 0.060) * p.limb;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.32, frame.radius * 0.0024), 0, Math.PI * 2);
        ctx.fillStyle = n > 0.50 ? "rgba(220,184,104," + alpha + ")" : "rgba(10,18,14," + alpha + ")";
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
      ctx.ellipse(p.x, p.y, radius * lobe.radius[0] / 190, radius * lobe.radius[1] / 190, deg((i - 1) * 11), 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? "rgba(228,194,112,0.030)" : "rgba(1,12,8,0.035)";
      ctx.fill();
    }
    ctx.restore();
  }

  function drawMineralPressure(ctx, construct, helpers, frame) {
    var lon;
    var lat;
    var p;
    var n;

    ctx.save();
    for (lat = -78; lat <= 78; lat += 6) {
      for (lon = -178; lon <= 178; lon += 6) {
        if (!helpers.pointInPolygon(construct.outline, lon, lat)) continue;
        n = signedNoise(lon, lat, (construct.phase || 0) + 6.3);
        if (n < 0.22) continue;
        p = helpers.project(lon, lat, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius);
        if (!p.visible || p.limb < 0.14) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.32, frame.radius * 0.0023), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(225,181,95," + clamp(0.012 + p.limb * 0.032, 0.010, 0.048) + ")";
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

    for (i = 0; i < 210; i += 1) {
      x = cx - radius + ((i * 97) % Math.floor(radius * 2));
      y = cy - radius + ((i * 53) % Math.floor(radius * 2));
      if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) > radius * radius) continue;
      alpha = 0.010 + ((i * 17) % 13) / 1400;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.45, radius * (0.0018 + ((i % 5) * 0.00045))), 0, Math.PI * 2);
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
    var limb = ctx.createRadialGradient(cx, cy, radius * 0.54, cx, cy, radius * 1.04);

    shade.addColorStop(0.00, "rgba(255,255,255,0.085)");
    shade.addColorStop(0.30, "rgba(255,255,255,0.018)");
    shade.addColorStop(0.62, "rgba(0,0,0,0.18)");
    shade.addColorStop(0.84, "rgba(0,0,0,0.43)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.72)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    limb.addColorStop(0.00, "rgba(255,255,255,0)");
    limb.addColorStop(0.72, "rgba(72,164,192,0.04)");
    limb.addColorStop(0.91, "rgba(98,218,238,0.18)");
    limb.addColorStop(1.00, "rgba(220,248,255,0.34)");
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
      cinematicMaterialAuthorityActive: true,
      oceanDepthAuthorityActive: true,
      coastalShelfAuthorityActive: true,
      plateauRidgeMaterialAuthorityActive: true,
      mineralPressureAuthorityActive: true,
      markers: CONTRACT_MARKERS.slice(),
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice()
    };
  }

  global.DGBPlanetOneSurfaceMaterials = {
    VERSION: VERSION,
    version: VERSION,
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
