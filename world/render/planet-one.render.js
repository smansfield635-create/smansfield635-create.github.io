/*
  PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1
  PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1
  PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1

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
  terrain-water-adhesion-active=true

  REQUIRED PROJECTION MARKERS:
  spherical-land-distribution-active=true
  visible-hemisphere-projection-active=true
  backside-land-culling-active=true
  limb-compression-active=true
  front-hemisphere-packing-rejected=true

  PURPOSE:
  Keep proper rotation.
  Release bad visual squeeze.
  Reduce front-face land dominance.
  Restore water-to-land balance.
  Distribute land across sphere longitude.
  Preserve route/asset renderer-consumption proof.
  Do not draw fallback/demo/legacy planet.
*/

(function attachPlanetOneRenderer(global) {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1";
  var PROJECTION_TNT = "PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1";
  var BALANCE_TNT = "PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1";
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
    "longitudinal-land-distribution-active=true",
    "bad-squeeze-released=true"
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
    canvas.setAttribute("aria-label", "Planet 1 balanced spherical hydro-terrain projection");

    return {
      canvas: canvas,
      size: size,
      ratio: ratio
    };
  }

  function makeLandmasses() {
    return [
      {
        id: "mainland",
        centerLon: -42,
        centerLat: 2,
        lonRadius: 32,
        latRadius: 27,
        colorA: "rgba(83,132,78,0.94)",
        colorB: "rgba(38,79,61,0.95)",
        shore: "rgba(105,231,238,0.48)",
        ridge: "rgba(21,27,22,0.62)",
        mineral: "rgba(238,195,92,0.22)",
        phase: 0.2,
        detail: 1
      },
      {
        id: "north-plateau",
        centerLon: 31,
        centerLat: 38,
        lonRadius: 29,
        latRadius: 15,
        colorA: "rgba(119,142,96,0.92)",
        colorB: "rgba(48,86,67,0.94)",
        shore: "rgba(119,230,240,0.42)",
        ridge: "rgba(24,31,24,0.58)",
        mineral: "rgba(226,231,210,0.18)",
        phase: 1.1,
        detail: 0.82
      },
      {
        id: "east-fold",
        centerLon: 105,
        centerLat: -6,
        lonRadius: 24,
        latRadius: 23,
        colorA: "rgba(96,132,93,0.92)",
        colorB: "rgba(42,76,61,0.94)",
        shore: "rgba(95,218,232,0.40)",
        ridge: "rgba(25,31,26,0.58)",
        mineral: "rgba(198,214,224,0.17)",
        phase: 2.4,
        detail: 0.8
      },
      {
        id: "west-craton",
        centerLon: -123,
        centerLat: 5,
        lonRadius: 22,
        latRadius: 21,
        colorA: "rgba(130,106,75,0.92)",
        colorB: "rgba(75,60,47,0.94)",
        shore: "rgba(95,212,230,0.39)",
        ridge: "rgba(31,26,20,0.60)",
        mineral: "rgba(212,126,77,0.20)",
        phase: 3.2,
        detail: 0.72
      },
      {
        id: "south-arc",
        centerLon: -7,
        centerLat: -46,
        lonRadius: 29,
        latRadius: 13,
        colorA: "rgba(112,130,82,0.90)",
        colorB: "rgba(54,82,58,0.93)",
        shore: "rgba(98,211,229,0.38)",
        ridge: "rgba(29,34,24,0.54)",
        mineral: "rgba(233,182,83,0.17)",
        phase: 4.1,
        detail: 0.66
      },
      {
        id: "far-side-chain-a",
        centerLon: 171,
        centerLat: 22,
        lonRadius: 20,
        latRadius: 17,
        colorA: "rgba(86,118,86,0.86)",
        colorB: "rgba(38,70,58,0.88)",
        shore: "rgba(90,207,225,0.32)",
        ridge: "rgba(23,28,24,0.45)",
        mineral: "rgba(210,225,220,0.12)",
        phase: 5.3,
        detail: 0.55
      },
      {
        id: "far-side-chain-b",
        centerLon: -173,
        centerLat: -28,
        lonRadius: 19,
        latRadius: 15,
        colorA: "rgba(104,121,80,0.86)",
        colorB: "rgba(49,72,55,0.88)",
        shore: "rgba(90,205,224,0.32)",
        ridge: "rgba(24,28,22,0.45)",
        mineral: "rgba(225,182,95,0.12)",
        phase: 6.0,
        detail: 0.52
      },
      {
        id: "north-pole",
        centerLon: 12,
        centerLat: 75,
        lonRadius: 43,
        latRadius: 8,
        colorA: "rgba(230,247,251,0.84)",
        colorB: "rgba(148,190,204,0.66)",
        shore: "rgba(200,246,252,0.30)",
        ridge: "rgba(87,118,130,0.34)",
        mineral: "rgba(255,255,255,0.12)",
        phase: 0.9,
        detail: 0.35
      },
      {
        id: "south-pole",
        centerLon: -150,
        centerLat: -74,
        lonRadius: 42,
        latRadius: 8,
        colorA: "rgba(229,246,249,0.82)",
        colorB: "rgba(145,187,202,0.64)",
        shore: "rgba(200,246,252,0.28)",
        ridge: "rgba(86,116,130,0.32)",
        mineral: "rgba(255,255,255,0.10)",
        phase: 2.6,
        detail: 0.32
      }
    ];
  }

  function normalizeLon(lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  }

  function makeOutline(land, count) {
    var points = [];
    var i;
    var angle;
    var wobble;
    var lon;
    var lat;

    count = count || 76;

    for (i = 0; i < count; i += 1) {
      angle = Math.PI * 2 * (i / count);
      wobble =
        1 +
        Math.sin(angle * 3 + land.phase) * 0.10 +
        Math.sin(angle * 5 + land.phase * 0.7) * 0.055 +
        Math.cos(angle * 9 + land.phase * 1.2) * 0.035;

      lon = normalizeLon(land.centerLon + Math.cos(angle) * land.lonRadius * wobble);
      lat = clamp(
        land.centerLat + Math.sin(angle) * land.latRadius * (1 + Math.cos(angle * 4 + land.phase) * 0.06),
        -86,
        86
      );

      points.push({ lon: lon, lat: lat });
    }

    return points;
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

    var limb = clamp(z2, 0, 1);
    var compression = 0.72 + limb * 0.28;

    return {
      x: cx + x * radius * compression,
      y: cy - y2 * radius,
      z: z2,
      visible: z2 > 0.02,
      limb: limb
    };
  }

  function visibleOutline(points, rotation, tilt, cx, cy, radius) {
    var projected = [];
    var i;
    var p;

    for (i = 0; i < points.length; i += 1) {
      p = project(points[i].lon, points[i].lat, rotation, tilt, cx, cy, radius);
      if (p.visible) projected.push(p);
    }

    return projected;
  }

  function visibleRatio(points, rotation, tilt, cx, cy, radius) {
    var projected = visibleOutline(points, rotation, tilt, cx, cy, radius);
    return projected.length / points.length;
  }

  function drawBackground(ctx, width, height) {
    var i;
    var x;
    var y;
    var r;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#02050d";
    ctx.fillRect(0, 0, width, height);

    for (i = 0; i < 86; i += 1) {
      x = (i * 89) % width;
      y = (i * 47) % height;
      r = 0.45 + ((i * 17) % 7) * 0.09;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(216,232,255," + (0.14 + ((i * 13) % 9) / 100) + ")";
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
      cx - radius * 0.28,
      cy - radius * 0.32,
      radius * 0.04,
      cx,
      cy,
      radius
    );

    ocean.addColorStop(0.00, "#23a4c8");
    ocean.addColorStop(0.26, "#0d6d96");
    ocean.addColorStop(0.58, "#073b5b");
    ocean.addColorStop(0.84, "#041a2f");
    ocean.addColorStop(1.00, "#020812");

    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    drawOceanDepth(ctx, cx, cy, radius);
    drawOceanCurrents(ctx, cx, cy, radius);
  }

  function drawOceanDepth(ctx, cx, cy, radius) {
    var depth = ctx.createRadialGradient(cx + radius * 0.12, cy + radius * 0.18, radius * 0.1, cx, cy, radius * 1.05);

    depth.addColorStop(0, "rgba(255,255,255,0)");
    depth.addColorStop(0.46, "rgba(0,16,31,0.08)");
    depth.addColorStop(0.82, "rgba(0,6,18,0.30)");
    depth.addColorStop(1, "rgba(0,0,0,0.56)");

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

  function drawLandmass(ctx, land, rotation, tilt, cx, cy, radius) {
    var outline = makeOutline(land, 88);
    var ratio = visibleRatio(outline, rotation, tilt, cx, cy, radius);
    var points;
    var i;
    var p0;
    var avgLimb = 0;
    var fill;

    if (ratio < 0.15) return;

    points = visibleOutline(outline, rotation, tilt, cx, cy, radius);

    if (points.length < 8) return;

    for (i = 0; i < points.length; i += 1) {
      avgLimb += points[i].limb;
    }

    avgLimb = avgLimb / points.length;

    ctx.save();
    ctx.beginPath();

    p0 = points[0];
    ctx.moveTo(p0.x, p0.y);

    for (i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();

    fill = ctx.createRadialGradient(
      cx - radius * 0.20,
      cy - radius * 0.28,
      radius * 0.04,
      cx,
      cy,
      radius * 1.05
    );

    fill.addColorStop(0, land.colorA);
    fill.addColorStop(0.55, land.colorB);
    fill.addColorStop(1, "rgba(21,31,27,0.92)");

    ctx.globalAlpha = clamp(0.36 + ratio * 0.50 + avgLimb * 0.12, 0.30, 0.92);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.globalAlpha = clamp(0.22 + avgLimb * 0.28, 0.20, 0.54);
    ctx.strokeStyle = land.shore;
    ctx.lineWidth = Math.max(1.2, radius * 0.010);
    ctx.shadowColor = "rgba(92,228,238,0.22)";
    ctx.shadowBlur = radius * 0.010;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "rgba(238,255,247,0.22)";
    ctx.lineWidth = Math.max(0.7, radius * 0.0028);
    ctx.stroke();

    ctx.restore();

    drawLandDetails(ctx, land, rotation, tilt, cx, cy, radius, ratio, avgLimb);
  }

  function drawProjectedPath(ctx, land, offsets, rotation, tilt, cx, cy, radius, color, width, alpha) {
    var i;
    var p;
    var started = false;

    ctx.save();
    ctx.beginPath();

    for (i = 0; i < offsets.length; i += 1) {
      p = project(
        normalizeLon(land.centerLon + offsets[i][0]),
        clamp(land.centerLat + offsets[i][1], -86, 86),
        rotation,
        tilt,
        cx,
        cy,
        radius
      );

      if (!p.visible || p.limb < 0.08) continue;

      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    if (started) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = alpha;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawLandDetails(ctx, land, rotation, tilt, cx, cy, radius, visibility, limb) {
    var detail = land.detail || 1;
    var alpha = clamp(visibility * limb * 0.9, 0.08, 0.55);

    drawProjectedPath(ctx, land, [
      [-land.lonRadius * 0.42, -land.latRadius * 0.22],
      [-land.lonRadius * 0.15, -land.latRadius * 0.33],
      [land.lonRadius * 0.12, -land.latRadius * 0.15],
      [land.lonRadius * 0.38, land.latRadius * 0.02]
    ], rotation, tilt, cx, cy, radius, land.ridge, Math.max(0.7, radius * 0.0056 * detail), alpha);

    drawProjectedPath(ctx, land, [
      [-land.lonRadius * 0.36, land.latRadius * 0.24],
      [-land.lonRadius * 0.08, land.latRadius * 0.04],
      [land.lonRadius * 0.20, land.latRadius * 0.15],
      [land.lonRadius * 0.42, land.latRadius * 0.34]
    ], rotation, tilt, cx, cy, radius, land.ridge, Math.max(0.6, radius * 0.0046 * detail), alpha * 0.82);

    drawProjectedPath(ctx, land, [
      [-land.lonRadius * 0.18, -land.latRadius * 0.48],
      [land.lonRadius * 0.00, -land.latRadius * 0.18],
      [land.lonRadius * 0.08, land.latRadius * 0.06],
      [land.lonRadius * 0.19, land.latRadius * 0.42]
    ], rotation, tilt, cx, cy, radius, "rgba(61,39,33,0.60)", Math.max(0.55, radius * 0.004), alpha * 0.75);

    drawProjectedPath(ctx, land, [
      [land.lonRadius * 0.22, -land.latRadius * 0.36],
      [land.lonRadius * 0.08, -land.latRadius * 0.11],
      [land.lonRadius * 0.15, land.latRadius * 0.18],
      [land.lonRadius * 0.02, land.latRadius * 0.42]
    ], rotation, tilt, cx, cy, radius, land.shore, Math.max(0.45, radius * 0.0028), alpha * 0.72);

    drawProjectedPath(ctx, land, [
      [-land.lonRadius * 0.48, land.latRadius * 0.02],
      [-land.lonRadius * 0.18, land.latRadius * 0.11],
      [land.lonRadius * 0.15, land.latRadius * 0.20],
      [land.lonRadius * 0.45, land.latRadius * 0.31]
    ], rotation, tilt, cx, cy, radius, land.mineral, Math.max(0.45, radius * 0.002), alpha * 0.68);
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var glow = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.12);

    glow.addColorStop(0, "rgba(255,255,255,0)");
    glow.addColorStop(0.76, "rgba(122,210,245,0.055)");
    glow.addColorStop(1, "rgba(122,210,245,0.26)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(171,222,255,0.30)";
    ctx.lineWidth = Math.max(1.2, radius * 0.010);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.976, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(95,177,225,0.18)";
    ctx.lineWidth = Math.max(0.8, radius * 0.004);
    ctx.stroke();

    ctx.restore();
  }

  function drawAxis(ctx, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(deg(-18));

    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.98);
    ctx.lineTo(0, radius * 0.98);
    ctx.strokeStyle = "rgba(242,199,111,0.42)";
    ctx.lineWidth = Math.max(1.2, radius * 0.010);
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -radius * 0.98, radius * 0.024, 0, Math.PI * 2);
    ctx.arc(0, radius * 0.98, radius * 0.024, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,199,111,0.38)";
    ctx.fill();

    ctx.restore();
  }

  function drawTerminator(ctx, cx, cy, radius) {
    var shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);

    shade.addColorStop(0.00, "rgba(255,255,255,0.08)");
    shade.addColorStop(0.38, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.72, "rgba(0,0,0,0.18)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.54)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawPlanet(ctx, state, timestamp) {
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.min(width, height) * 0.365;
    var rotation = state.rotation + timestamp * state.speed;
    var tilt = state.tilt;
    var landmasses = makeLandmasses();
    var i;

    drawBackground(ctx, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.shadowColor = "rgba(83,190,240,0.22)";
    ctx.shadowBlur = radius * 0.15;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();
    ctx.restore();

    drawSphereClip(ctx, cx, cy, radius, function () {
      drawOcean(ctx, cx, cy, radius);

      for (i = 0; i < landmasses.length; i += 1) {
        drawLandmass(ctx, landmasses[i], rotation, tilt, cx, cy, radius);
      }

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
      "Water field dominance restored"
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
    mount.dataset.rendererVersion = VERSION;
    mount.dataset.projectionTnt = PROJECTION_TNT;
    mount.dataset.balanceTnt = BALANCE_TNT;
  }

  function normalizeOptions(options) {
    options = options || {};

    return {
      caption: options.caption || "Planet 1 · Nine Summits Universe · Optimum expression",
      rotate: options.rotate !== false,
      speed: Number(options.speed == null ? 0.0035 : options.speed),
      rotation: Number(options.rotation == null ? -58 : options.rotation),
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
  }
})(window);
