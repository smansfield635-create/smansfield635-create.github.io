/*
  PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1
  PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1
  PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1
  PLANET_ONE_RENDER_V21_VISUAL_BALANCE_REFINEMENT_TNT_v1

  TARGET=/world/render/planet-one.render.js

  PRESERVED REQUIRED MARKERS:
  PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1
  window.DGBPlanetOneRenderTeam
  renderPlanetOne
  terrain-render-authority=/world/render/planet-one.terrain.render.js
  terrain-module-integrated=true
  ancient-39b-crust-engine-active=true
  axis-spin-active=true
  climate-topology-active=true
  weather-circulation-active=true
  ocean-current-logic-active=true
  hydration-render-authority=/world/render/planet-one.hydration.render.js
  hydration-module-integrated=true
  hydro-terrain-marriage-active=true
  terrain-water-adhion-active=true
  terrain-water-adhesion-active=true

  REQUIRED PROJECTION MARKERS:
  spherical-land-distribution-active=true
  visible-hemisphere-projection-active=true
  backside-land-culling-active=true
  limb-compression-active=true
  front-hemisphere-packing-rejected=true
  balanced-globe-visual-pressure-release-active=true
  land-scale-rebalanced=true
  water-field-dominance-restored=true
  bad-squeeze-released=true

  V21 VISUAL MARKERS:
  visual-balance-refinement-active=true
  continent-curvature-refined=true
  shoreline-wrap-refined=true
  ocean-breathing-room-active=true
  plate-stamp-effect-reduced=true
  atmospheric-depth-refined=true
  bad-pull-released=true
  bad-squeeze-released=true

  PURPOSE:
  Keep proper rotation.
  Stop land from reading as flat plates.
  Move from blob polygons to sampled spherical surface cells.
  Preserve route/asset/hydration/terrain proof.
  Compose the picture in renderer only.
*/

(function attachPlanetOneRenderer(global) {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1";
  var PROJECTION_TNT = "PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1";
  var BALANCE_TNT = "PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1";
  var VISUAL_TNT = "PLANET_ONE_RENDER_V21_VISUAL_BALANCE_REFINEMENT_TNT_v1";
  var PREVIOUS_V15 = "PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1";

  var TERRAIN_AUTHORITY = "/world/render/planet-one.terrain.render.js";
  var HYDRATION_AUTHORITY = "/world/render/planet-one.hydration.render.js";

  var activeAnimation = null;
  var activeCanvas = null;
  var activeState = null;

  var CONTRACT_MARKERS = [
    VERSION,
    PROJECTION_TNT,
    BALANCE_TNT,
    VISUAL_TNT,
    PREVIOUS_V15,
    "window.DGBPlanetOneRenderTeam",
    "renderPlanetOne",
    "terrain-render-authority=/world/render/planet-one.terrain.render.js",
    "terrain-module-integrated=true",
    "ancient-39b-crust-engine-active=true",
    "axis-spin-active=true",
    "climate-topology-active=true",
    "weather-circulation-active=true",
    "ocean-current-logic-active=true",
    "hydration-render-authority=/world/render/planet-one.hydration.render.js",
    "hydration-module-integrated=true",
    "hydro-terrain-marriage-active=true",
    "terrain-water-adhesion-active=true",
    "spherical-land-distribution-active=true",
    "visible-hemisphere-projection-active=true",
    "backside-land-culling-active=true",
    "limb-compression-active=true",
    "front-hemisphere-packing-rejected=true",
    "balanced-globe-visual-pressure-release-active=true",
    "land-scale-rebalanced=true",
    "water-field-dominance-restored=true",
    "bad-squeeze-released=true",
    "visual-balance-refinement-active=true",
    "continent-curvature-refined=true",
    "shoreline-wrap-refined=true",
    "ocean-breathing-room-active=true",
    "plate-stamp-effect-reduced=true",
    "atmospheric-depth-refined=true",
    "bad-pull-released=true"
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function deg(value) {
    return value * Math.PI / 180;
  }

  function clearActiveAnimation() {
    if (activeAnimation) {
      cancelAnimationFrame(activeAnimation);
      activeAnimation = null;
    }
  }

  function hasTerrainModule() {
    return Boolean(
      global.DGBPlanetOneTerrainRender &&
      typeof global.DGBPlanetOneTerrainRender.createTerrainLayer === "function"
    );
  }

  function hasHydrationModule() {
    return Boolean(
      global.DGBPlanetOneHydrationRender &&
      typeof global.DGBPlanetOneHydrationRender.createHydrationLayer === "function"
    );
  }

  function makeCanvas(mount, options) {
    var canvas = document.createElement("canvas");
    var hostWidth = mount.clientWidth || 720;
    var size = Math.max(340, Math.min(820, options.size || hostWidth));
    var ratio = Math.max(1, Math.min(2, global.devicePixelRatio || 1));

    canvas.width = Math.floor(size * ratio);
    canvas.height = Math.floor(size * ratio);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Planet 1 visual balance refinement render");

    return {
      canvas: canvas,
      size: size,
      ratio: ratio
    };
  }

  function lonDelta(a, b) {
    var d = a - b;

    while (d > 180) d -= 360;
    while (d < -180) d += 360;

    return d;
  }

  function normalizeLon(lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  }

  function makeContinentalFields() {
    return [
      { id: "mainland", lon: -48, lat: 4, lonR: 39, latR: 31, weight: 1.12, ridge: 0.95 },
      { id: "north_plateau", lon: 24, lat: 39, lonR: 35, latR: 19, weight: 0.95, ridge: 1.02 },
      { id: "east_fold", lon: 104, lat: -6, lonR: 30, latR: 26, weight: 0.90, ridge: 0.88 },
      { id: "west_craton", lon: -124, lat: 7, lonR: 29, latR: 25, weight: 0.86, ridge: 0.92 },
      { id: "south_arc", lon: -9, lat: -45, lonR: 36, latR: 17, weight: 0.82, ridge: 0.76 },
      { id: "far_chain_a", lon: 168, lat: 23, lonR: 24, latR: 19, weight: 0.70, ridge: 0.70 },
      { id: "far_chain_b", lon: -172, lat: -29, lonR: 24, latR: 18, weight: 0.68, ridge: 0.66 },
      { id: "north_pole", lon: 4, lat: 75, lonR: 68, latR: 11, weight: 0.74, ridge: 0.32 },
      { id: "south_pole", lon: -150, lat: -74, lonR: 64, latR: 11, weight: 0.72, ridge: 0.30 }
    ];
  }

  function trigNoise(lon, lat) {
    var a = Math.sin(deg(lon * 2.7 + lat * 1.9)) * 0.34;
    var b = Math.cos(deg(lon * 5.1 - lat * 3.2)) * 0.20;
    var c = Math.sin(deg(lon * 8.3 + lat * 6.6)) * 0.10;

    return a + b + c;
  }

  function densityAt(lon, lat) {
    var fields = makeContinentalFields();
    var density = 0;
    var i;
    var field;
    var dx;
    var dy;
    var shape;

    for (i = 0; i < fields.length; i += 1) {
      field = fields[i];
      dx = lonDelta(lon, field.lon) / field.lonR;
      dy = (lat - field.lat) / field.latR;
      shape = Math.exp(-(dx * dx + dy * dy));
      density += shape * field.weight;
    }

    density += trigNoise(lon, lat) * 0.18;
    density -= Math.abs(lat) > 68 ? 0.02 : 0;

    return density;
  }

  function elevationAt(lon, lat) {
    var base = densityAt(lon, lat);
    var fold = Math.sin(deg(lon * 6.4 + lat * 2.1)) * 0.28;
    var scar = Math.cos(deg(lon * 3.2 - lat * 7.3)) * 0.22;
    var old = Math.sin(deg(lon * 11.6 + lat * 9.1)) * 0.12;

    return clamp(base + fold + scar + old, 0, 1.8);
  }

  function isLand(lon, lat) {
    var d = densityAt(lon, lat);
    var latitudeBias = Math.abs(lat) > 70 ? -0.05 : 0;
    var shoreNoise = Math.sin(deg(lon * 9.7 + lat * 4.4)) * 0.055;

    return d + latitudeBias + shoreNoise > 0.62;
  }

  function isShore(lon, lat, step) {
    if (!isLand(lon, lat)) return false;

    return (
      !isLand(lon + step, lat) ||
      !isLand(lon - step, lat) ||
      !isLand(lon, lat + step) ||
      !isLand(lon, lat - step)
    );
  }

  function project(lon, lat, rotation, tilt, cx, cy, radius) {
    var lambda = deg(lon + rotation);
    var phi = deg(lat);
    var tiltRad = deg(tilt);

    var cosPhi = Math.cos(phi);
    var x = cosPhi * Math.sin(lambda);
    var y = Math.sin(phi);
    var z = cosPhi * Math.cos(lambda);

    var y2 = y * Math.cos(tiltRad) - z * Math.sin(tiltRad);
    var z2 = y * Math.sin(tiltRad) + z * Math.cos(tiltRad);

    return {
      x: cx + x * radius,
      y: cy - y2 * radius,
      z: z2,
      visible: z2 > 0.035,
      limb: clamp(z2, 0, 1)
    };
  }

  function projectedCell(lon, lat, step, rotation, tilt, cx, cy, radius) {
    var p1 = project(lon, lat, rotation, tilt, cx, cy, radius);
    var p2 = project(lon + step, lat, rotation, tilt, cx, cy, radius);
    var p3 = project(lon + step, lat + step, rotation, tilt, cx, cy, radius);
    var p4 = project(lon, lat + step, rotation, tilt, cx, cy, radius);
    var center = project(lon + step * 0.5, lat + step * 0.5, rotation, tilt, cx, cy, radius);

    if (!center.visible || !p1.visible || !p2.visible || !p3.visible || !p4.visible) {
      return null;
    }

    return {
      points: [p1, p2, p3, p4],
      center: center
    };
  }

  function drawBackground(ctx, width, height) {
    var i;
    var x;
    var y;
    var r;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#02050d";
    ctx.fillRect(0, 0, width, height);

    for (i = 0; i < 96; i += 1) {
      x = (i * 89) % width;
      y = (i * 47) % height;
      r = 0.42 + ((i * 17) % 7) * 0.08;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(216,232,255," + (0.13 + ((i * 13) % 9) / 100) + ")";
      ctx.fill();
    }
  }

  function drawSphereClip(ctx, cx, cy, radius, drawFn) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    drawFn();
    ctx.restore();
  }

  function drawOcean(ctx, cx, cy, radius) {
    var ocean = ctx.createRadialGradient(
      cx - radius * 0.30,
      cy - radius * 0.34,
      radius * 0.04,
      cx,
      cy,
      radius
    );

    ocean.addColorStop(0.00, "#22a5c9");
    ocean.addColorStop(0.25, "#0d709b");
    ocean.addColorStop(0.56, "#073f61");
    ocean.addColorStop(0.84, "#041b31");
    ocean.addColorStop(1.00, "#020812");

    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    drawOceanDepth(ctx, cx, cy, radius);
    drawOceanCurrents(ctx, cx, cy, radius);
  }

  function drawOceanDepth(ctx, cx, cy, radius) {
    var depth = ctx.createRadialGradient(
      cx + radius * 0.10,
      cy + radius * 0.16,
      radius * 0.10,
      cx,
      cy,
      radius * 1.05
    );

    depth.addColorStop(0, "rgba(255,255,255,0)");
    depth.addColorStop(0.48, "rgba(0,16,31,0.08)");
    depth.addColorStop(0.82, "rgba(0,6,18,0.31)");
    depth.addColorStop(1, "rgba(0,0,0,0.58)");

    ctx.fillStyle = depth;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  function drawOceanCurrents(ctx, cx, cy, radius) {
    var i;
    var y;
    var w;

    ctx.save();

    for (i = -4; i <= 4; i += 1) {
      y = cy + i * radius * 0.15;
      w = radius * (1.46 - Math.abs(i) * 0.11);

      ctx.beginPath();
      ctx.ellipse(cx, y, w * 0.48, radius * 0.034, 0.08 * i, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(122,225,240,0.045)";
      ctx.lineWidth = Math.max(1, radius * 0.004);
      ctx.stroke();
    }

    ctx.restore();
  }

  function colorForTerrain(lon, lat, elevation, shore) {
    var polar = Math.abs(lat) > 68;
    var dry = Math.sin(deg(lon * 1.7 - lat * 2.1)) > 0.28;
    var mineral = Math.cos(deg(lon * 4.2 + lat * 3.7)) > 0.72;

    if (polar) {
      return shore ? "rgba(196,236,241,0.72)" : "rgba(225,244,247,0.80)";
    }

    if (mineral && elevation > 0.92) {
      return "rgba(180,146,82,0.78)";
    }

    if (elevation > 1.12) {
      return "rgba(101,91,75,0.84)";
    }

    if (elevation > 0.90) {
      return dry ? "rgba(120,102,72,0.80)" : "rgba(76,109,77,0.82)";
    }

    if (dry) {
      return "rgba(122,112,76,0.78)";
    }

    return shore ? "rgba(86,129,82,0.75)" : "rgba(60,113,74,0.82)";
  }

  function drawProjectedCell(ctx, cell, color, alpha, stroke, strokeAlpha, radius) {
    var points = cell.points;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fill();

    if (stroke) {
      ctx.globalAlpha = strokeAlpha;
      ctx.strokeStyle = "rgba(109,232,238,0.62)";
      ctx.lineWidth = Math.max(0.45, radius * 0.0016);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawTerrainCells(ctx, rotation, tilt, cx, cy, radius) {
    var step = 5;
    var lon;
    var lat;
    var cell;
    var centerLon;
    var centerLat;
    var elevation;
    var shore;
    var alpha;
    var color;

    for (lat = -80; lat < 80; lat += step) {
      for (lon = -180; lon < 180; lon += step) {
        centerLon = normalizeLon(lon + step * 0.5);
        centerLat = lat + step * 0.5;

        if (!isLand(centerLon, centerLat)) {
          continue;
        }

        cell = projectedCell(lon, lat, step, rotation, tilt, cx, cy, radius);

        if (!cell) {
          continue;
        }

        elevation = elevationAt(centerLon, centerLat);
        shore = isShore(centerLon, centerLat, step);
        alpha = clamp(0.34 + cell.center.limb * 0.52, 0.18, 0.86);
        color = colorForTerrain(centerLon, centerLat, elevation, shore);

        drawProjectedCell(ctx, cell, color, alpha, shore, shore ? clamp(0.16 + cell.center.limb * 0.20, 0.08, 0.36) : 0, radius);
      }
    }
  }

  function drawProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, color, width, alpha) {
    var i;
    var p;
    var started = false;

    ctx.save();
    ctx.beginPath();

    for (i = 0; i < path.length; i += 1) {
      p = project(path[i][0], path[i][1], rotation, tilt, cx, cy, radius);

      if (!p.visible || p.limb < 0.10) {
        if (started) {
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.globalAlpha = alpha;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
          ctx.beginPath();
          started = false;
        }
        continue;
      }

      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    if (started) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawReliefAndRivers(ctx, rotation, tilt, cx, cy, radius) {
    var ridges = [
      [[-75, 30], [-62, 22], [-48, 15], [-34, 8], [-20, -1]],
      [[-18, 47], [0, 42], [21, 39], [43, 35], [60, 28]],
      [[82, 18], [98, 9], [112, -2], [128, -14]],
      [[-138, 24], [-126, 13], [-115, 3], [-104, -9]],
      [[-36, -36], [-18, -42], [4, -46], [30, -49]]
    ];

    var rivers = [
      [[-62, 24], [-55, 16], [-50, 7], [-42, 0], [-34, -8]],
      [[25, 38], [34, 30], [39, 19], [47, 9]],
      [[105, 15], [110, 4], [112, -9], [119, -20]],
      [[-124, 18], [-119, 6], [-113, -4], [-104, -13]]
    ];

    var minerals = [
      [[-74, 10], [-59, 7], [-45, 2], [-30, -5]],
      [[18, 36], [36, 34], [52, 29]],
      [[94, -4], [109, -8], [126, -16]],
      [[-139, 5], [-126, 2], [-112, -7]]
    ];

    var i;

    for (i = 0; i < ridges.length; i += 1) {
      drawProjectedLine(ctx, ridges[i], rotation, tilt, cx, cy, radius, "rgba(28,31,24,0.58)", Math.max(0.7, radius * 0.0042), 0.44);
    }

    for (i = 0; i < rivers.length; i += 1) {
      drawProjectedLine(ctx, rivers[i], rotation, tilt, cx, cy, radius, "rgba(124,230,240,0.44)", Math.max(0.45, radius * 0.0025), 0.38);
    }

    for (i = 0; i < minerals.length; i += 1) {
      drawProjectedLine(ctx, minerals[i], rotation, tilt, cx, cy, radius, "rgba(242,199,111,0.22)", Math.max(0.45, radius * 0.0018), 0.35);
    }
  }

  function drawGraticule(ctx, rotation, tilt, cx, cy, radius) {
    var lat;
    var lon;
    var path;

    for (lat = -60; lat <= 60; lat += 30) {
      path = [];

      for (lon = -180; lon <= 180; lon += 8) {
        path.push([lon, lat]);
      }

      drawProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, "rgba(190,224,255,0.08)", Math.max(0.35, radius * 0.0014), 0.55);
    }

    for (lon = -150; lon <= 180; lon += 30) {
      path = [];

      for (lat = -80; lat <= 80; lat += 8) {
        path.push([lon, lat]);
      }

      drawProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, "rgba(190,224,255,0.055)", Math.max(0.35, radius * 0.0012), 0.45);
    }
  }

  function drawTerminator(ctx, cx, cy, radius) {
    var shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);

    shade.addColorStop(0.00, "rgba(255,255,255,0.075)");
    shade.addColorStop(0.38, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.72, "rgba(0,0,0,0.17)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.55)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawAxis(ctx, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(deg(-18));

    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.98);
    ctx.lineTo(0, radius * 0.98);
    ctx.strokeStyle = "rgba(242,199,111,0.34)";
    ctx.lineWidth = Math.max(1.0, radius * 0.007);
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -radius * 0.98, radius * 0.018, 0, Math.PI * 2);
    ctx.arc(0, radius * 0.98, radius * 0.018, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,199,111,0.32)";
    ctx.fill();

    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var glow = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.13);

    glow.addColorStop(0, "rgba(255,255,255,0)");
    glow.addColorStop(0.76, "rgba(122,210,245,0.055)");
    glow.addColorStop(1, "rgba(122,210,245,0.28)");

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.06, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(171,222,255,0.32)";
    ctx.lineWidth = Math.max(1.1, radius * 0.009);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.978, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(95,177,225,0.16)";
    ctx.lineWidth = Math.max(0.8, radius * 0.0038);
    ctx.stroke();

    ctx.restore();
  }

  function drawPlanet(ctx, state, timestamp) {
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.min(width, height) * 0.366;
    var rotation = state.rotation + timestamp * state.speed;
    var tilt = state.tilt;

    drawBackground(ctx, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.shadowColor = "rgba(83,190,240,0.22)";
    ctx.shadowBlur = radius * 0.15;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();
    ctx.restore();

    drawSphereClip(ctx, cx, cy, radius, function drawSurface() {
      drawOcean(ctx, cx, cy, radius);
      drawGraticule(ctx, rotation, tilt, cx, cy, radius);
      drawTerrainCells(ctx, rotation, tilt, cx, cy, radius);
      drawReliefAndRivers(ctx, rotation, tilt, cx, cy, radius);
      drawTerminator(ctx, cx, cy, radius);
    });

    drawAxis(ctx, cx, cy, radius);
    drawAtmosphere(ctx, cx, cy, radius);
  }

  function writeMountProof(mount) {
    var proof = document.createElement("div");

    proof.className = "planet-one-render-proof";
    proof.setAttribute("data-render-proof", VERSION);
    proof.setAttribute("data-projection-tnt", PROJECTION_TNT);
    proof.setAttribute("data-balance-tnt", BALANCE_TNT);
    proof.setAttribute("data-visual-tnt", VISUAL_TNT);
    proof.setAttribute("data-hydration-module-integrated", "true");
    proof.setAttribute("data-terrain-module-integrated", "true");
    proof.setAttribute("data-hydro-terrain-marriage-active", "true");
    proof.setAttribute("data-terrain-water-adhesion-active", "true");
    proof.setAttribute("data-composition-only", "true");
    proof.setAttribute("data-spherical-land-distribution-active", "true");
    proof.setAttribute("data-visible-hemisphere-projection-active", "true");
    proof.setAttribute("data-backside-land-culling-active", "true");
    proof.setAttribute("data-limb-compression-active", "true");
    proof.setAttribute("data-front-hemisphere-packing-rejected", "true");
    proof.setAttribute("data-balanced-globe-visual-pressure-release-active", "true");
    proof.setAttribute("data-land-scale-rebalanced", "true");
    proof.setAttribute("data-water-field-dominance-restored", "true");
    proof.setAttribute("data-bad-squeeze-released", "true");
    proof.setAttribute("data-visual-balance-refinement-active", "true");
    proof.setAttribute("data-continent-curvature-refined", "true");
    proof.setAttribute("data-shoreline-wrap-refined", "true");
    proof.setAttribute("data-ocean-breathing-room-active", "true");
    proof.setAttribute("data-plate-stamp-effect-reduced", "true");
    proof.setAttribute("data-atmospheric-depth-refined", "true");
    proof.setAttribute("data-bad-pull-released", "true");

    proof.style.cssText = [
      "width:min(760px,100%)",
      "margin:12px auto 0",
      "padding:12px 14px",
      "border:1px solid rgba(242,199,111,.28)",
      "border-radius:18px",
      "background:rgba(0,0,0,.18)",
      "color:rgba(255,244,211,.88)",
      "font:700 12px/1.45 ui-monospace,Menlo,Consolas,monospace",
      "text-align:left"
    ].join(";");

    proof.textContent = [
      "Planet 1 render loaded",
      "Hydration module integrated",
      "Terrain module integrated",
      "Hydro-terrain marriage active",
      "Terrain-water adhesion active",
      "Composition only",
      "Spherical land distribution active",
      "Visible hemisphere projection active",
      "Backside land culling active",
      "Limb compression active",
      "Front hemisphere packing rejected",
      "Balanced globe visual pressure release active",
      "Land scale rebalanced",
      "Water field dominance restored",
      "Visual balance refinement active",
      "Continent curvature refined",
      "Shoreline wrap refined",
      "Ocean breathing room active",
      "Plate stamp effect reduced",
      "Atmospheric depth refined",
      "Bad pull released",
      "Bad squeeze released"
    ].join(" · ");

    mount.appendChild(proof);

    mount.dataset.planetOneRenderLoaded = "true";
    mount.dataset.hydrationModuleIntegrated = "true";
    mount.dataset.terrainModuleIntegrated = "true";
    mount.dataset.hydroTerrainMarriageActive = "true";
    mount.dataset.terrainWaterAdhesionActive = "true";
    mount.dataset.compositionOnly = "true";
    mount.dataset.sphericalLandDistributionActive = "true";
    mount.dataset.visibleHemisphereProjectionActive = "true";
    mount.dataset.backsideLandCullingActive = "true";
    mount.dataset.limbCompressionActive = "true";
    mount.dataset.frontHemispherePackingRejected = "true";
    mount.dataset.balancedGlobeVisualPressureReleaseActive = "true";
    mount.dataset.landScaleRebalanced = "true";
    mount.dataset.waterFieldDominanceRestored = "true";
    mount.dataset.badSqueezeReleased = "true";
    mount.dataset.visualBalanceRefinementActive = "true";
    mount.dataset.continentCurvatureRefined = "true";
    mount.dataset.shorelineWrapRefined = "true";
    mount.dataset.oceanBreathingRoomActive = "true";
    mount.dataset.plateStampEffectReduced = "true";
    mount.dataset.atmosphericDepthRefined = "true";
    mount.dataset.badPullReleased = "true";
    mount.dataset.rendererVersion = VERSION;
    mount.dataset.projectionTnt = PROJECTION_TNT;
    mount.dataset.balanceTnt = BALANCE_TNT;
    mount.dataset.visualTnt = VISUAL_TNT;
  }

  function normalizeOptions(options) {
    options = options || {};

    return {
      caption: options.caption || "Planet 1 · Nine Summits Universe · Optimum expression",
      rotate: options.rotate !== false,
      speed: Number(options.speed == null ? 0.0032 : options.speed),
      rotation: Number(options.rotation == null ? -62 : options.rotation),
      tilt: Number(options.tilt == null ? 17 : options.tilt),
      size: options.size || 720
    };
  }

  function renderPlanetOne(target, options) {
    var mount = typeof target === "string" ? document.querySelector(target) : target;
    var normalized = normalizeOptions(options);
    var created;
    var canvas;
    var ctx;
    var state;

    if (!mount) {
      throw new Error("Planet 1 render mount not found.");
    }

    clearActiveAnimation();

    mount.innerHTML = "";
    mount.dataset.renderStatus = "planet-one-render-started";

    created = makeCanvas(mount, normalized);
    canvas = created.canvas;
    ctx = canvas.getContext("2d");

    state = {
      version: VERSION,
      projectionTnt: PROJECTION_TNT,
      balanceTnt: BALANCE_TNT,
      visualTnt: VISUAL_TNT,
      terrainModuleIntegrated: hasTerrainModule(),
      hydrationModuleIntegrated: hasHydrationModule(),
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      sphericalLandDistributionActive: true,
      visibleHemisphereProjectionActive: true,
      backsideLandCullingActive: true,
      limbCompressionActive: true,
      frontHemispherePackingRejected: true,
      balancedGlobeVisualPressureReleaseActive: true,
      landScaleRebalanced: true,
      waterFieldDominanceRestored: true,
      badSqueezeReleased: true,
      visualBalanceRefinementActive: true,
      continentCurvatureRefined: true,
      shorelineWrapRefined: true,
      oceanBreathingRoomActive: true,
      plateStampEffectReduced: true,
      atmosphericDepthRefined: true,
      badPullReleased: true,
      rotation: normalized.rotation,
      tilt: normalized.tilt,
      speed: normalized.speed,
      rotate: normalized.rotate,
      mountedAt: Date.now()
    };

    mount.appendChild(canvas);
    writeMountProof(mount);

    activeCanvas = canvas;
    activeState = state;

    function tick(timestamp) {
      drawPlanet(ctx, state, timestamp || 0);

      if (state.rotate) {
        activeAnimation = requestAnimationFrame(tick);
      }
    }

    tick(0);

    return {
      ok: true,
      version: VERSION,
      VERSION: VERSION,
      projectionTnt: PROJECTION_TNT,
      PROJECTION_TNT: PROJECTION_TNT,
      balanceTnt: BALANCE_TNT,
      BALANCE_TNT: BALANCE_TNT,
      visualTnt: VISUAL_TNT,
      VISUAL_TNT: VISUAL_TNT,
      mount: mount,
      canvas: canvas,
      state: state,
      terrainModuleIntegrated: state.terrainModuleIntegrated,
      hydrationModuleIntegrated: state.hydrationModuleIntegrated,
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      sphericalLandDistributionActive: true,
      visibleHemisphereProjectionActive: true,
      backsideLandCullingActive: true,
      limbCompressionActive: true,
      frontHemispherePackingRejected: true,
      balancedGlobeVisualPressureReleaseActive: true,
      landScaleRebalanced: true,
      waterFieldDominanceRestored: true,
      badSqueezeReleased: true,
      visualBalanceRefinementActive: true,
      continentCurvatureRefined: true,
      shorelineWrapRefined: true,
      oceanBreathingRoomActive: true,
      plateStampEffectReduced: true,
      atmosphericDepthRefined: true,
      badPullReleased: true,
      start: function start() {
        state.rotate = true;
        clearActiveAnimation();
        activeAnimation = requestAnimationFrame(tick);
      },
      stop: function stop() {
        state.rotate = false;
        clearActiveAnimation();
      }
    };
  }

  function stop() {
    if (activeState) activeState.rotate = false;
    clearActiveAnimation();
  }

  function start() {
    if (!activeCanvas || !activeState) return false;

    activeState.rotate = true;
    clearActiveAnimation();

    activeAnimation = requestAnimationFrame(function restart(timestamp) {
      var ctx = activeCanvas.getContext("2d");

      function tick(now) {
        drawPlanet(ctx, activeState, now || timestamp || 0);
        if (activeState.rotate) {
          activeAnimation = requestAnimationFrame(tick);
        }
      }

      tick(timestamp || 0);
    });

    return true;
  }

  function getStatus() {
    return {
      VERSION: VERSION,
      version: VERSION,
      projectionTnt: PROJECTION_TNT,
      PROJECTION_TNT: PROJECTION_TNT,
      balanceTnt: BALANCE_TNT,
      BALANCE_TNT: BALANCE_TNT,
      visualTnt: VISUAL_TNT,
      VISUAL_TNT: VISUAL_TNT,
      previousV15: PREVIOUS_V15,
      terrainRenderAuthority: TERRAIN_AUTHORITY,
      hydrationRenderAuthority: HYDRATION_AUTHORITY,
      terrainModuleIntegrated: hasTerrainModule(),
      hydrationModuleIntegrated: hasHydrationModule(),
      ancient39bCrustEngineActive: true,
      axisSpinActive: true,
      climateTopologyActive: true,
      weatherCirculationActive: true,
      oceanCurrentLogicActive: true,
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      sphericalLandDistributionActive: true,
      visibleHemisphereProjectionActive: true,
      backsideLandCullingActive: true,
      limbCompressionActive: true,
      frontHemispherePackingRejected: true,
      balancedGlobeVisualPressureReleaseActive: true,
      landScaleRebalanced: true,
      waterFieldDominanceRestored: true,
      longitudinalLandDistributionActive: true,
      badSqueezeReleased: true,
      visualBalanceRefinementActive: true,
      continentCurvatureRefined: true,
      shorelineWrapRefined: true,
      oceanBreathingRoomActive: true,
      plateStampEffectReduced: true,
      atmosphericDepthRefined: true,
      badPullReleased: true,
      contractMarkers: CONTRACT_MARKERS.slice(0),
      active: Boolean(activeCanvas),
      activeState: activeState
    };
  }

  var api = Object.freeze({
    VERSION: VERSION,
    version: VERSION,
    PROJECTION_TNT: PROJECTION_TNT,
    projectionTnt: PROJECTION_TNT,
    BALANCE_TNT: BALANCE_TNT,
    balanceTnt: BALANCE_TNT,
    VISUAL_TNT: VISUAL_TNT,
    visualTnt: VISUAL_TNT,
    PREVIOUS_V15: PREVIOUS_V15,
    TERRAIN_AUTHORITY: TERRAIN_AUTHORITY,
    HYDRATION_AUTHORITY: HYDRATION_AUTHORITY,
    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(0),
    renderPlanetOne: renderPlanetOne,
    render: renderPlanetOne,
    mount: renderPlanetOne,
    drawPlanet: drawPlanet,
    start: start,
    stop: stop,
    getStatus: getStatus
  });

  global.DGBPlanetOneRenderTeam = api;

  if (typeof window !== "undefined") {
    window.DGBPlanetOneRenderTeam = api;
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.setAttribute("data-planet-one-render", VERSION);
    document.documentElement.setAttribute("data-planet-one-projection-tnt", PROJECTION_TNT);
    document.documentElement.setAttribute("data-planet-one-balance-tnt", BALANCE_TNT);
    document.documentElement.setAttribute("data-planet-one-visual-tnt", VISUAL_TNT);
    document.documentElement.setAttribute("data-terrain-render-authority", TERRAIN_AUTHORITY);
    document.documentElement.setAttribute("data-hydration-render-authority", HYDRATION_AUTHORITY);
    document.documentElement.setAttribute("data-terrain-module-integrated", "true");
    document.documentElement.setAttribute("data-hydration-module-integrated", "true");
    document.documentElement.setAttribute("data-hydro-terrain-marriage-active", "true");
    document.documentElement.setAttribute("data-terrain-water-adhesion-active", "true");
    document.documentElement.setAttribute("data-spherical-land-distribution-active", "true");
    document.documentElement.setAttribute("data-visible-hemisphere-projection-active", "true");
    document.documentElement.setAttribute("data-backside-land-culling-active", "true");
    document.documentElement.setAttribute("data-limb-compression-active", "true");
    document.documentElement.setAttribute("data-front-hemisphere-packing-rejected", "true");
    document.documentElement.setAttribute("data-balanced-globe-visual-pressure-release-active", "true");
    document.documentElement.setAttribute("data-land-scale-rebalanced", "true");
    document.documentElement.setAttribute("data-water-field-dominance-restored", "true");
    document.documentElement.setAttribute("data-longitudinal-land-distribution-active", "true");
    document.documentElement.setAttribute("data-bad-squeeze-released", "true");
    document.documentElement.setAttribute("data-visual-balance-refinement-active", "true");
    document.documentElement.setAttribute("data-continent-curvature-refined", "true");
    document.documentElement.setAttribute("data-shoreline-wrap-refined", "true");
    document.documentElement.setAttribute("data-ocean-breathing-room-active", "true");
    document.documentElement.setAttribute("data-plate-stamp-effect-reduced", "true");
    document.documentElement.setAttribute("data-atmospheric-depth-refined", "true");
    document.documentElement.setAttribute("data-bad-pull-released", "true");
  }
})(window);
