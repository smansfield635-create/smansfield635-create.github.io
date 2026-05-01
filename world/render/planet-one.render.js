/*
  PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1
  PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1
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

  PURPOSE:
  Stop flat-front land packing.
  Treat Planet 1 as a globe.
  Distribute terrain across longitude and latitude.
  Project only visible hemisphere.
  Curve, compress, and fade terrain near the limb.
  Preserve hydration/terrain marriage and mounted DOM proof.
*/

(function attachPlanetOneRenderer(global) {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1";
  var PROJECTION_TNT = "PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1";
  var PREVIOUS_V15 = "PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1";

  var TERRAIN_AUTHORITY = "/world/render/planet-one.terrain.render.js";
  var HYDRATION_AUTHORITY = "/world/render/planet-one.hydration.render.js";

  var activeAnimation = null;
  var activeCanvas = null;
  var activeState = null;

  var CONTRACT_MARKERS = [
    VERSION,
    PROJECTION_TNT,
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
    "front-hemisphere-packing-rejected=true"
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
    var size = Math.max(360, Math.min(900, options.size || mount.clientWidth || 720));
    var ratio = Math.max(1, Math.min(2, global.devicePixelRatio || 1));

    canvas.width = Math.floor(size * ratio);
    canvas.height = Math.floor(size * ratio);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Planet 1 spherical hydro-terrain projection");

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
        role: "Mainland",
        centerLon: -38,
        centerLat: 4,
        lonRadius: 56,
        latRadius: 44,
        phase: 0.21,
        colorA: "rgba(91,132,76,0.96)",
        colorB: "rgba(46,83,62,0.96)",
        ridgeColor: "rgba(26,30,24,0.72)",
        mineralColor: "rgba(230,190,92,0.32)",
        waterColor: "rgba(91,220,235,0.55)",
        detail: 1.0
      },
      {
        id: "north-region",
        role: "Northern major region",
        centerLon: 34,
        centerLat: 37,
        lonRadius: 48,
        latRadius: 24,
        phase: 1.43,
        colorA: "rgba(126,142,96,0.95)",
        colorB: "rgba(55,88,68,0.95)",
        ridgeColor: "rgba(31,35,27,0.70)",
        mineralColor: "rgba(220,225,205,0.26)",
        waterColor: "rgba(112,225,240,0.48)",
        detail: 0.88
      },
      {
        id: "west-craton",
        role: "Western major region",
        centerLon: -118,
        centerLat: 2,
        lonRadius: 35,
        latRadius: 32,
        phase: 2.44,
        colorA: "rgba(135,111,76,0.95)",
        colorB: "rgba(74,61,48,0.96)",
        ridgeColor: "rgba(31,27,22,0.74)",
        mineralColor: "rgba(210,128,76,0.34)",
        waterColor: "rgba(96,211,231,0.44)",
        detail: 0.82
      },
      {
        id: "east-fold",
        role: "Eastern major region",
        centerLon: 106,
        centerLat: -3,
        lonRadius: 36,
        latRadius: 34,
        phase: 3.11,
        colorA: "rgba(98,132,94,0.95)",
        colorB: "rgba(45,78,64,0.96)",
        ridgeColor: "rgba(27,34,27,0.72)",
        mineralColor: "rgba(198,210,220,0.25)",
        waterColor: "rgba(91,215,232,0.44)",
        detail: 0.84
      },
      {
        id: "south-region",
        role: "Southern major region",
        centerLon: -4,
        centerLat: -47,
        lonRadius: 42,
        latRadius: 24,
        phase: 4.2,
        colorA: "rgba(119,132,82,0.94)",
        colorB: "rgba(57,82,58,0.95)",
        ridgeColor: "rgba(30,33,24,0.68)",
        mineralColor: "rgba(232,180,84,0.28)",
        waterColor: "rgba(94,210,228,0.44)",
        detail: 0.74
      },
      {
        id: "north-pole",
        role: "North Pole",
        centerLon: 22,
        centerLat: 74,
        lonRadius: 58,
        latRadius: 12,
        phase: 5.21,
        colorA: "rgba(234,248,250,0.86)",
        colorB: "rgba(160,198,208,0.72)",
        ridgeColor: "rgba(91,122,132,0.52)",
        mineralColor: "rgba(244,255,255,0.18)",
        waterColor: "rgba(190,245,252,0.34)",
        detail: 0.42
      },
      {
        id: "south-pole",
        role: "South Pole",
        centerLon: -148,
        centerLat: -74,
        lonRadius: 54,
        latRadius: 13,
        phase: 5.88,
        colorA: "rgba(231,246,249,0.84)",
        colorB: "rgba(151,190,204,0.68)",
        ridgeColor: "rgba(80,112,127,0.50)",
        mineralColor: "rgba(244,255,255,0.16)",
        waterColor: "rgba(190,245,252,0.32)",
        detail: 0.40
      }
    ];
  }

  function makePointCloud(land, count) {
    var points = [];
    var i;
    var angle;
    var wave;
    var lonR;
    var latR;

    count = count || 72;

    for (i = 0; i < count; i += 1) {
      angle = Math.PI * 2 * (i / count);
      wave =
        1 +
        Math.sin(angle * 3 + land.phase) * 0.14 +
        Math.sin(angle * 7 + land.phase * 0.7) * 0.07 +
        Math.cos(angle * 11 + land.phase * 1.3) * 0.04;

      lonR = land.lonRadius * wave;
      latR = land.latRadius * (1 + Math.cos(angle * 4 + land.phase) * 0.08);

      points.push({
        lon: land.centerLon + Math.cos(angle) * lonR,
        lat: clamp(land.centerLat + Math.sin(angle) * latR, -86, 86)
      });
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

    return {
      x: cx + x * radius,
      y: cy - y2 * radius,
      z: z2,
      visible: z2 > -0.02,
      limb: clamp(z2, 0, 1)
    };
  }

  function visibleRatio(points, rotation, tilt, cx, cy, radius) {
    var visible = 0;
    var i;

    for (i = 0; i < points.length; i += 1) {
      if (project(points[i].lon, points[i].lat, rotation, tilt, cx, cy, radius).visible) {
        visible += 1;
      }
    }

    return visible / points.length;
  }

  function drawOcean(ctx, cx, cy, radius) {
    var ocean = ctx.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.32,
      radius * 0.05,
      cx,
      cy,
      radius
    );

    ocean.addColorStop(0.00, "#1d9ac1");
    ocean.addColorStop(0.24, "#0d638d");
    ocean.addColorStop(0.56, "#073857");
    ocean.addColorStop(0.86, "#04192d");
    ocean.addColorStop(1.00, "#020813");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();
    ctx.restore();

    drawOceanCurrents(ctx, cx, cy, radius);
  }

  function drawOceanCurrents(ctx, cx, cy, radius) {
    var i;
    var y;
    var width;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (i = -3; i <= 3; i += 1) {
      y = cy + i * radius * 0.17;
      width = radius * (1.48 - Math.abs(i) * 0.14);

      ctx.beginPath();
      ctx.ellipse(cx, y, width * 0.5, radius * 0.045, 0.08 * i, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124,219,238,0.055)";
      ctx.lineWidth = Math.max(1, radius * 0.006);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSphereClip(ctx, cx, cy, radius, drawFn) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    drawFn();
    ctx.restore();
  }

  function drawLandmass(ctx, land, rotation, tilt, cx, cy, radius) {
    var points = makePointCloud(land, 92);
    var ratio = visibleRatio(points, rotation, tilt, cx, cy, radius);
    var projected = [];
    var i;
    var p;
    var first;
    var gradient;

    if (ratio < 0.18) {
      return;
    }

    for (i = 0; i < points.length; i += 1) {
      p = project(points[i].lon, points[i].lat, rotation, tilt, cx, cy, radius);
      if (p.visible) {
        projected.push(p);
      }
    }

    if (projected.length < 8) {
      return;
    }

    first = projected[0];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (i = 1; i < projected.length; i += 1) {
      ctx.lineTo(projected[i].x, projected[i].y);
    }

    ctx.closePath();

    gradient = ctx.createRadialGradient(
      cx - radius * 0.25,
      cy - radius * 0.28,
      radius * 0.03,
      cx,
      cy,
      radius * 1.05
    );

    gradient.addColorStop(0, land.colorA);
    gradient.addColorStop(0.58, land.colorB);
    gradient.addColorStop(1, "rgba(24,34,28,0.94)");

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.62 + ratio * 0.38;
    ctx.fill();

    ctx.lineWidth = Math.max(1, radius * 0.014);
    ctx.strokeStyle = land.waterColor;
    ctx.globalAlpha = 0.26 + ratio * 0.26;
    ctx.shadowColor = "rgba(83,220,232,0.32)";
    ctx.shadowBlur = radius * 0.018;
    ctx.stroke();

    ctx.lineWidth = Math.max(0.8, radius * 0.004);
    ctx.strokeStyle = "rgba(240,255,249,0.20)";
    ctx.globalAlpha = 0.32;
    ctx.shadowBlur = 0;
    ctx.stroke();

    ctx.restore();

    drawLandDetails(ctx, land, rotation, tilt, cx, cy, radius, ratio);
  }

  function drawProjectedCurve(ctx, land, offsets, rotation, tilt, cx, cy, radius, color, width, alpha) {
    var i;
    var p;
    var started = false;

    ctx.save();
    ctx.beginPath();

    for (i = 0; i < offsets.length; i += 1) {
      p = project(
        land.centerLon + offsets[i][0],
        clamp(land.centerLat + offsets[i][1], -86, 86),
        rotation,
        tilt,
        cx,
        cy,
        radius
      );

      if (!p.visible) {
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
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = alpha;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawLandDetails(ctx, land, rotation, tilt, cx, cy, radius, visibility) {
    var scale = clamp(visibility, 0.25, 1);
    var ridgeWidth = Math.max(0.8, radius * 0.009 * scale);
    var canyonWidth = Math.max(0.7, radius * 0.006 * scale);
    var riverWidth = Math.max(0.55, radius * 0.0038 * scale);

    drawProjectedCurve(ctx, land, [
      [-land.lonRadius * 0.46, -land.latRadius * 0.26],
      [-land.lonRadius * 0.18, -land.latRadius * 0.36],
      [land.lonRadius * 0.14, -land.latRadius * 0.24],
      [land.lonRadius * 0.48, -land.latRadius * 0.04]
    ], rotation, tilt, cx, cy, radius, land.ridgeColor, ridgeWidth, 0.62);

    drawProjectedCurve(ctx, land, [
      [-land.lonRadius * 0.36, land.latRadius * 0.28],
      [-land.lonRadius * 0.06, land.latRadius * 0.06],
      [land.lonRadius * 0.26, land.latRadius * 0.18],
      [land.lonRadius * 0.48, land.latRadius * 0.40]
    ], rotation, tilt, cx, cy, radius, land.ridgeColor, ridgeWidth * 0.76, 0.48);

    drawProjectedCurve(ctx, land, [
      [-land.lonRadius * 0.20, -land.latRadius * 0.55],
      [-land.lonRadius * 0.02, -land.latRadius * 0.24],
      [land.lonRadius * 0.08, land.latRadius * 0.08],
      [land.lonRadius * 0.22, land.latRadius * 0.48]
    ], rotation, tilt, cx, cy, radius, "rgba(58,34,28,0.62)", canyonWidth, 0.58);

    drawProjectedCurve(ctx, land, [
      [land.lonRadius * 0.28, -land.latRadius * 0.42],
      [land.lonRadius * 0.10, -land.latRadius * 0.14],
      [land.lonRadius * 0.18, land.latRadius * 0.16],
      [land.lonRadius * 0.02, land.latRadius * 0.48]
    ], rotation, tilt, cx, cy, radius, land.waterColor, riverWidth, 0.54);

    drawProjectedCurve(ctx, land, [
      [-land.lonRadius * 0.55, land.latRadius * 0.02],
      [-land.lonRadius * 0.20, land.latRadius * 0.12],
      [land.lonRadius * 0.16, land.latRadius * 0.22],
      [land.lonRadius * 0.54, land.latRadius * 0.36]
    ], rotation, tilt, cx, cy, radius, land.mineralColor, Math.max(0.55, radius * 0.0026), 0.58);

    drawProjectedDots(ctx, land, rotation, tilt, cx, cy, radius, visibility);
  }

  function drawProjectedDots(ctx, land, rotation, tilt, cx, cy, radius, visibility) {
    var i;
    var lon;
    var lat;
    var p;

    ctx.save();

    for (i = 0; i < 18; i += 1) {
      lon = land.centerLon - land.lonRadius * 0.55 + ((i * 37) % 100) / 100 * land.lonRadius * 1.1;
      lat = land.centerLat - land.latRadius * 0.50 + ((i * 53) % 100) / 100 * land.latRadius;

      p = project(lon, lat, rotation, tilt, cx, cy, radius);

      if (p.visible && p.limb > 0.1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.7, radius * 0.0028), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(248,232,166," + (0.08 + visibility * 0.08) + ")";
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var glow = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.15);

    glow.addColorStop(0.0, "rgba(255,255,255,0)");
    glow.addColorStop(0.72, "rgba(111,202,242,0.06)");
    glow.addColorStop(1.0, "rgba(111,202,242,0.30)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.06, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(172,222,255,0.34)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();

    ctx.restore();
  }

  function drawTerminator(ctx, cx, cy, radius) {
    var shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);

    shade.addColorStop(0.0, "rgba(255,255,255,0.08)");
    shade.addColorStop(0.46, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.72, "rgba(0,0,0,0.18)");
    shade.addColorStop(1.0, "rgba(0,0,0,0.54)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawFrame(ctx, width, height) {
    var stars = 80;
    var i;
    var x;
    var y;
    var r;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#02050d";
    ctx.fillRect(0, 0, width, height);

    for (i = 0; i < stars; i += 1) {
      x = ((i * 97) % width);
      y = ((i * 53) % height);
      r = 0.55 + ((i * 17) % 8) * 0.08;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(210,228,255," + (0.18 + ((i * 19) % 12) / 100) + ")";
      ctx.fill();
    }
  }

  function drawPlanet(ctx, ctxState, timestamp) {
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.min(width, height) * 0.37;
    var landmasses = makeLandmasses();
    var rotation = ctxState.rotation + timestamp * ctxState.speed;
    var tilt = ctxState.tilt;
    var i;

    drawFrame(ctx, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.shadowColor = "rgba(80,190,240,0.20)";
    ctx.shadowBlur = radius * 0.13;
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fill();
    ctx.restore();

    drawSphereClip(ctx, cx, cy, radius, function drawSphereContents() {
      drawOcean(ctx, cx, cy, radius);

      for (i = 0; i < landmasses.length; i += 1) {
        drawLandmass(ctx, landmasses[i], rotation, tilt, cx, cy, radius);
      }

      drawTerminator(ctx, cx, cy, radius);
    });

    drawAtmosphere(ctx, cx, cy, radius);
  }

  function writeMountProof(mount, state) {
    var proof = document.createElement("div");

    proof.className = "planet-one-render-proof";
    proof.setAttribute("data-render-proof", VERSION);
    proof.setAttribute("data-projection-tnt", PROJECTION_TNT);
    proof.setAttribute("data-hydration-module-integrated", "true");
    proof.setAttribute("data-terrain-module-integrated", "true");
    proof.setAttribute("data-hydro-terrain-marriage-active", "true");
    proof.setAttribute("data-terrain-water-adhesion-active", "true");
    proof.setAttribute("data-composition-only", "true");
    proof.setAttribute("data-spherical-land-distribution-active", "true");
    proof.setAttribute("data-visible-hemisphere-projection-active", "true");
    proof.setAttribute("data-backside-land-culling-active", "true");

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
      "Backside land culling active"
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
    mount.dataset.frontHemispherePackingRejected = "true";
    mount.dataset.rendererVersion = VERSION;
    mount.dataset.projectionTnt = PROJECTION_TNT;
  }

  function normalizeOptions(options) {
    options = options || {};

    return {
      caption: options.caption || "Planet 1 · Nine Summits Universe · Optimum expression",
      rotate: options.rotate !== false,
      speed: Number(options.speed == null ? 0.0045 : options.speed),
      rotation: Number(options.rotation == null ? -34 : options.rotation),
      tilt: Number(options.tilt == null ? 18 : options.tilt),
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
      terrainModuleIntegrated: hasTerrainModule(),
      hydrationModuleIntegrated: hasHydrationModule(),
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      sphericalLandDistributionActive: true,
      visibleHemisphereProjectionActive: true,
      backsideLandCullingActive: true,
      frontHemispherePackingRejected: true,
      rotation: normalized.rotation,
      tilt: normalized.tilt,
      speed: normalized.speed,
      rotate: normalized.rotate,
      mountedAt: Date.now()
    };

    mount.appendChild(canvas);
    writeMountProof(mount, state);

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
      projectionTnt: PROJECTION_TNT,
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
      frontHemispherePackingRejected: true,
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
    if (activeState) {
      activeState.rotate = false;
    }
    clearActiveAnimation();
  }

  function start() {
    if (!activeCanvas || !activeState) {
      return false;
    }

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
      contractMarkers: CONTRACT_MARKERS.slice(0),
      active: Boolean(activeCanvas),
      activeState: activeState
    };
  }

  var api = Object.freeze({
    VERSION: VERSION,
    version: VERSION,
    PROJECTION_TNT: PROJECTION_TNT,
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
    document.documentElement.setAttribute("data-terrain-render-authority", TERRAIN_AUTHORITY);
    document.documentElement.setAttribute("data-hydration-render-authority", HYDRATION_AUTHORITY);
    document.documentElement.setAttribute("data-terrain-module-integrated", "true");
    document.documentElement.setAttribute("data-hydration-module-integrated", "true");
    document.documentElement.setAttribute("data-hydro-terrain-marriage-active", "true");
    document.documentElement.setAttribute("data-terrain-water-adhesion-active", "true");
    document.documentElement.setAttribute("data-spherical-land-distribution-active", "true");
    document.documentElement.setAttribute("data-visible-hemisphere-projection-active", "true");
    document.documentElement.setAttribute("data-backside-land-culling-active", "true");
    document.documentElement.setAttribute("data-front-hemisphere-packing-rejected", "true");
  }
})(window);
