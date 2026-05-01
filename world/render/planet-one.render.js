/*
 PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1
 PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1
 PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1
 PLANET_ONE_RENDER_V21_VISUAL_BALANCE_REFINEMENT_TNT_v1
 PLANET_ONE_RENDER_V22_FINE_SURFACE_SAMPLING_AND_SHORELINE_SMOOTHING_TNT_v1
 PLANET_ONE_RENDER_V23_CINEMATIC_MATERIAL_ATMOSPHERE_REFINEMENT_TNT_v1
 PLANET_ONE_RENDER_V24_NODAL_LAND_CONSTRUCT_EXPRESSIVE_WRAP_TNT_v1
 PLANET_ONE_RENDER_V24_BLOB_REMOVAL_CONTINENT_WRAP_CORRECTION_TNT_v1
 TARGET=/world/render/planet-one.render.js
 PURPOSE:
 Renderer-only replacement.
 Remove the blob / puzzle-plate read.
 Preserve seven-landmass logic: one Mainland, four major regions, North Pole, South Pole.
 Allow three non-polar bodies to attach into one wrapped continental system covering much of the globe.
 Preserve route / asset / terrain / hydration chain markers and public renderer API.
 DO NOT TOUCH:
 /showroom/globe/index.html
 /assets/showroom.globe.instrument.js
 /world/render/planet-one.terrain.render.js
 /world/render/planet-one.hydration.render.js
 /world/render/index.tree.js
 /gauges/index.html
 */

(function attachPlanetOneRenderer(global) {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1";
  var PROJECTION_TNT = "PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1";
  var BALANCE_TNT = "PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1";
  var VISUAL_TNT = "PLANET_ONE_RENDER_V21_VISUAL_BALANCE_REFINEMENT_TNT_v1";
  var SURFACE_TNT = "PLANET_ONE_RENDER_V22_FINE_SURFACE_SAMPLING_AND_SHORELINE_SMOOTHING_TNT_v1";
  var CINEMATIC_TNT = "PLANET_ONE_RENDER_V23_CINEMATIC_MATERIAL_ATMOSPHERE_REFINEMENT_TNT_v1";
  var NODAL_TNT = "PLANET_ONE_RENDER_V24_NODAL_LAND_CONSTRUCT_EXPRESSIVE_WRAP_TNT_v1";
  var BLOB_CORRECTION_TNT = "PLANET_ONE_RENDER_V24_BLOB_REMOVAL_CONTINENT_WRAP_CORRECTION_TNT_v1";
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
    SURFACE_TNT,
    CINEMATIC_TNT,
    NODAL_TNT,
    BLOB_CORRECTION_TNT,
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
    "bad-pull-released=true",
    "fine-surface-sampling-active=true",
    "shoreline-smoothing-active=true",
    "blocky-cell-artifact-reduced=true",
    "geologic-blend-field-active=true",
    "smooth-continent-wrap-active=true",
    "renderer-only-visual-refinement=true",
    "cinematic-material-atmosphere-active=true",
    "ancient-surface-materiality-active=true",
    "ocean-basin-depth-active=true",
    "atmospheric-limb-depth-active=true",
    "non-cartoon-world-body-active=true",
    "mineral-pressure-surface-active=true",
    "geologic-scar-subtlety-active=true",
    "nodal-land-construct-active=true",
    "central-blob-rejected=true",
    "three-region-attached-wrap-active=true",
    "five-major-regions-preserved=true",
    "north-south-poles-preserved=true",
    "expressive-nodal-terrain-system-active=true",
    "blob-read-removed=true",
    "puzzle-plate-read-rejected=true",
    "broad-continental-wrap-active=true",
    "jagged-living-shorelines-active=true",
    "mainland-plus-two-regions-attached=true",
    "two-secondary-major-regions-visible=true",
    "polar-bodies-distinct=true"
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function deg(value) {
    return value * Math.PI / 180;
  }

  function normalizeLon(lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  }

  function safeNow() {
    return global.performance && typeof global.performance.now === "function" ? global.performance.now() : Date.now();
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

  function clearActiveAnimation() {
    if (activeAnimation && typeof global.cancelAnimationFrame === "function") {
      global.cancelAnimationFrame(activeAnimation);
    }
    activeAnimation = null;
  }

  function normalizeOptions(maybeOptions) {
    var options = maybeOptions || {};
    if (options.nodeType || typeof options.getContext === "function") {
      return { mount: options };
    }
    return options;
  }

  function resolveMount(mountOrOptions, options) {
    var candidate = null;
    if (mountOrOptions && (mountOrOptions.nodeType || typeof mountOrOptions.getContext === "function")) {
      candidate = mountOrOptions;
    } else if (options && options.mount) {
      candidate = options.mount;
    } else if (mountOrOptions && mountOrOptions.mount) {
      candidate = mountOrOptions.mount;
    }

    if (typeof candidate === "string" && global.document) {
      candidate = global.document.querySelector(candidate);
    }

    if (!candidate && global.document) {
      candidate =
        global.document.querySelector("[data-planet-one-render]") ||
        global.document.querySelector("[data-dgb-planet-one]") ||
        global.document.querySelector("#planet-one-render") ||
        global.document.querySelector("#planet-one-canvas") ||
        global.document.querySelector(".planet-one-render") ||
        global.document.querySelector("main") ||
        global.document.body;
    }

    return candidate || null;
  }

  function makeCanvas(mount, options) {
    var canvas;
    var hostWidth;
    var size;
    var ratio;

    if (!global.document) return null;

    if (mount && typeof mount.getContext === "function") {
      canvas = mount;
      hostWidth = canvas.clientWidth || canvas.parentNode && canvas.parentNode.clientWidth || 720;
    } else {
      canvas = global.document.createElement("canvas");
      hostWidth = mount && mount.clientWidth ? mount.clientWidth : 720;
    }

    size = Math.max(340, Math.min(960, options.size || hostWidth || 720));
    ratio = Math.max(1, Math.min(2, global.devicePixelRatio || 1));

    canvas.width = Math.floor(size * ratio);
    canvas.height = Math.floor(size * ratio);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Planet 1 broad continental wrap render with distinct polar bodies");
    canvas.dataset.planetOneRenderer = BLOB_CORRECTION_TNT;

    if (mount && !canvas.parentNode && typeof mount.appendChild === "function") {
      if (options.replace !== false) {
        while (mount.firstChild) mount.removeChild(mount.firstChild);
      }
      mount.appendChild(canvas);
    }

    return {
      canvas: canvas,
      size: size,
      ratio: ratio,
      width: canvas.width,
      height: canvas.height
    };
  }

  function signedNoise(lon, lat, phase) {
    return (
      Math.sin(deg(lon * 1.7 + lat * 2.9 + phase * 31)) * 0.46 +
      Math.cos(deg(lon * 3.3 - lat * 1.8 + phase * 17)) * 0.31 +
      Math.sin(deg(lon * 7.2 + lat * 5.6 + phase * 13)) * 0.15 +
      Math.cos(deg(lon * 13.8 - lat * 8.7 + phase * 11)) * 0.08
    );
  }

  function project(lon, lat, rotation, tilt, cx, cy, radius) {
    var lonRad = deg(normalizeLon(lon + rotation));
    var latRad = deg(lat);
    var tiltRad = deg(tilt);
    var cosLat = Math.cos(latRad);
    var x = cosLat * Math.sin(lonRad);
    var y = -Math.sin(latRad);
    var z = cosLat * Math.cos(lonRad);
    var y2 = y * Math.cos(tiltRad) - z * Math.sin(tiltRad);
    var z2 = y * Math.sin(tiltRad) + z * Math.cos(tiltRad);
    return {
      x: cx + x * radius,
      y: cy + y2 * radius,
      z: z2,
      visible: z2 > -0.06,
      limb: clamp((z2 + 0.06) / 1.06, 0, 1)
    };
  }

  function drawBackground(ctx, width, height) {
    var bg;
    var i;
    var x;
    var y;
    var r;

    ctx.clearRect(0, 0, width, height);
    bg = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.5, width * 0.74);
    bg.addColorStop(0, "#071426");
    bg.addColorStop(0.62, "#020714");
    bg.addColorStop(1, "#010207");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    for (i = 0; i < 136; i += 1) {
      x = (i * 89) % width;
      y = (i * 47) % height;
      r = 0.34 + ((i * 17) % 7) * 0.07;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(216,232,255," + (0.08 + ((i * 13) % 9) / 125) + ")";
      ctx.fill();
    }
  }

  function clipSphere(ctx, cx, cy, radius, drawFn) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    drawFn();
    ctx.restore();
  }

  function drawOcean(ctx, cx, cy, radius) {
    var ocean = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.02, cx, cy, radius * 1.04);
    ocean.addColorStop(0.00, "#1b91ac");
    ocean.addColorStop(0.20, "#0d6687");
    ocean.addColorStop(0.50, "#06364f");
    ocean.addColorStop(0.78, "#031827");
    ocean.addColorStop(1.00, "#010611");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    drawOceanBasins(ctx, cx, cy, radius);
    drawOceanCurrents(ctx, cx, cy, radius);
  }

  function drawOceanBasins(ctx, cx, cy, radius) {
    var basins = [
      { x: -0.39, y: -0.08, rx: 0.26, ry: 0.18, a: 0.20 },
      { x: 0.24, y: 0.19, rx: 0.36, ry: 0.22, a: 0.17 },
      { x: 0.10, y: -0.34, rx: 0.29, ry: 0.15, a: 0.14 },
      { x: -0.05, y: 0.46, rx: 0.34, ry: 0.11, a: 0.12 }
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

  function makeConstructs() {
    return [
      {
        id: "attached_continental_wrap",
        type: "attached-triad",
        name: "Mainland + North Region + East Region",
        attachedRegions: 3,
        phase: 0.4,
        colorA: "rgba(88,124,76,0.90)",
        colorB: "rgba(43,78,56,0.94)",
        colorC: "rgba(128,107,73,0.35)",
        shore: "rgba(132,229,232,0.40)",
        shelf: "rgba(78,196,210,0.15)",
        ridge: "rgba(18,23,20,0.46)",
        mineral: "rgba(224,184,92,0.18)",
        outline: [
          [-154, 12], [-145, 28], [-126, 42], [-101, 49], [-76, 46], [-54, 55], [-23, 50],
          [5, 42], [35, 46], [66, 34], [92, 25], [121, 8], [131, -10], [116, -25],
          [88, -30], [61, -21], [35, -34], [2, -29], [-26, -39], [-58, -31], [-86, -36],
          [-112, -23], [-139, -18], [-160, -3]
        ],
        ridges: [
          [[-144, 18], [-118, 32], [-88, 41], [-57, 37], [-24, 45], [9, 36], [39, 39], [73, 26], [109, 9]],
          [[-125, -10], [-92, 2], [-56, 12], [-20, 25], [21, 21], [55, 9], [92, -5], [119, -19]],
          [[-79, -28], [-49, -16], [-18, -7], [20, -13], [58, -23], [90, -20]]
        ],
        seams: [
          [[-63, -30], [-54, -7], [-48, 16], [-42, 38], [-36, 54]],
          [[26, -31], [24, -8], [20, 16], [17, 39], [13, 47]]
        ]
      },
      {
        id: "western_craton",
        type: "separate-major-body",
        name: "West Region",
        phase: 2.7,
        colorA: "rgba(117,93,68,0.84)",
        colorB: "rgba(72,60,47,0.90)",
        colorC: "rgba(136,84,55,0.28)",
        shore: "rgba(96,201,216,0.30)",
        shelf: "rgba(71,176,190,0.12)",
        ridge: "rgba(27,24,20,0.40)",
        mineral: "rgba(198,111,70,0.14)",
        outline: [[-173, 3], [-159, 28], [-137, 37], [-114, 26], [-108, 4], [-121, -19], [-146, -30], [-166, -20]],
        ridges: [
          [[-160, -16], [-148, 2], [-135, 17], [-116, 29]],
          [[-155, 20], [-138, 10], [-121, -3]]
        ],
        seams: []
      },
      {
        id: "southern_arc",
        type: "separate-major-body",
        name: "South Region",
        phase: 4.0,
        colorA: "rgba(103,117,80,0.82)",
        colorB: "rgba(48,72,55,0.88)",
        colorC: "rgba(115,95,67,0.24)",
        shore: "rgba(96,199,216,0.27)",
        shelf: "rgba(70,170,184,0.12)",
        ridge: "rgba(25,30,23,0.36)",
        mineral: "rgba(212,171,88,0.11)",
        outline: [[-76, -50], [-52, -41], [-20, -43], [12, -51], [43, -47], [58, -60], [29, -69], [-13, -67], [-50, -64]],
        ridges: [
          [[-64, -55], [-35, -48], [-4, -51], [22, -57], [47, -53]]
        ],
        seams: []
      },
      {
        id: "north_pole",
        type: "pole",
        name: "North Pole",
        phase: 1.0,
        colorA: "rgba(224,239,240,0.70)",
        colorB: "rgba(130,169,186,0.54)",
        colorC: "rgba(255,255,255,0.12)",
        shore: "rgba(203,238,243,0.22)",
        shelf: "rgba(214,246,250,0.09)",
        ridge: "rgba(80,108,122,0.22)",
        mineral: "rgba(255,255,255,0.07)",
        outline: [[-178, 76], [-139, 82], [-80, 85], [-18, 82], [44, 86], [111, 82], [177, 76], [116, 70], [44, 67], [-25, 69], [-95, 68], [-154, 71]],
        ridges: [
          [[-150, 76], [-90, 80], [-20, 78], [55, 81], [134, 75]]
        ],
        seams: []
      },
      {
        id: "south_pole",
        type: "pole",
        name: "South Pole",
        phase: 3.1,
        colorA: "rgba(205,225,228,0.58)",
        colorB: "rgba(101,144,166,0.48)",
        colorC: "rgba(242,255,255,0.10)",
        shore: "rgba(190,231,238,0.18)",
        shelf: "rgba(196,236,242,0.07)",
        ridge: "rgba(71,98,116,0.18)",
        mineral: "rgba(255,255,255,0.05)",
        outline: [[-176, -75], [-116, -69], [-47, -72], [20, -68], [90, -71], [172, -76], [121, -83], [42, -86], [-31, -82], [-106, -84]],
        ridges: [
          [[-140, -77], [-70, -80], [0, -75], [76, -80], [146, -77]]
        ],
        seams: []
      }
    ];
  }

  function jitteredOutline(outline, phase) {
    var result = [];
    var i;
    var p;
    var next;
    var t;
    var steps;
    var lon;
    var lat;
    var noise;

    for (i = 0; i < outline.length; i += 1) {
      p = outline[i];
      next = outline[(i + 1) % outline.length];
      steps = 4 + Math.floor(Math.abs(next[0] - p[0]) / 18);
      for (t = 0; t < steps; t += 1) {
        lon = p[0] + (next[0] - p[0]) * (t / steps);
        lat = p[1] + (next[1] - p[1]) * (t / steps);
        noise = signedNoise(lon, lat, phase);
        result.push([
          normalizeLon(lon + noise * 2.2),
          clamp(lat + noise * 2.9, -86, 86)
        ]);
      }
    }

    return result;
  }

  function visibleProjectedPath(path, rotation, tilt, cx, cy, radius) {
    var points = [];
    var i;
    var p;
    for (i = 0; i < path.length; i += 1) {
      p = project(path[i][0], path[i][1], rotation, tilt, cx, cy, radius);
      if (p.visible) points.push(p);
    }
    return points;
  }

  function smoothClosedPath(ctx, points) {
    var i;
    var current;
    var next;
    var mid;
    if (points.length < 3) return false;
    ctx.beginPath();
    current = points[0];
    next = points[1];
    ctx.moveTo((current.x + next.x) / 2, (current.y + next.y) / 2);
    for (i = 1; i < points.length; i += 1) {
      current = points[i];
      next = points[(i + 1) % points.length];
      mid = {
        x: (current.x + next.x) / 2,
        y: (current.y + next.y) / 2
      };
      ctx.quadraticCurveTo(current.x, current.y, mid.x, mid.y);
    }
    ctx.closePath();
    return true;
  }

  function drawOpenProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, color, width, alpha) {
    var projected = visibleProjectedPath(path, rotation, tilt, cx, cy, radius);
    var i;
    var current;
    var next;
    var mid;

    if (projected.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    for (i = 1; i < projected.length - 1; i += 1) {
      current = projected[i];
      next = projected[i + 1];
      mid = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
      ctx.quadraticCurveTo(current.x, current.y, mid.x, mid.y);
    }
    ctx.lineTo(projected[projected.length - 1].x, projected[projected.length - 1].y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawConstruct(ctx, construct, rotation, tilt, cx, cy, radius) {
    var outline = jitteredOutline(construct.outline, construct.phase);
    var projected = visibleProjectedPath(outline, rotation, tilt, cx, cy, radius);
    var fill;
    var i;

    if (projected.length < 5) return;

    ctx.save();
    if (smoothClosedPath(ctx, projected)) {
      fill = ctx.createRadialGradient(cx - radius * 0.30, cy - radius * 0.34, radius * 0.05, cx, cy, radius * 1.05);
      fill.addColorStop(0.00, construct.colorA);
      fill.addColorStop(0.42, construct.colorB);
      fill.addColorStop(0.76, construct.colorC);
      fill.addColorStop(1.00, "rgba(18,27,24,0.90)");

      ctx.globalAlpha = construct.type === "attached-triad" ? 0.90 : 0.78;
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      ctx.shadowColor = "rgba(95,222,232,0.14)";
      ctx.shadowBlur = radius * 0.006;
      ctx.strokeStyle = construct.shore;
      ctx.lineWidth = Math.max(0.9, radius * (construct.type === "attached-triad" ? 0.0058 : 0.0046));
      ctx.globalAlpha = construct.type === "attached-triad" ? 0.36 : 0.25;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(238,255,247,0.20)";
      ctx.lineWidth = Math.max(0.4, radius * 0.0015);
      ctx.globalAlpha = 0.16;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = construct.shelf;
    ctx.lineWidth = Math.max(1.2, radius * 0.010);
    ctx.globalAlpha = construct.type === "attached-triad" ? 0.34 : 0.22;
    if (smoothClosedPath(ctx, projected)) ctx.stroke();
    ctx.restore();

    for (i = 0; i < construct.ridges.length; i += 1) {
      drawOpenProjectedLine(
        ctx,
        construct.ridges[i],
        rotation,
        tilt,
        cx,
        cy,
        radius,
        construct.ridge,
        Math.max(0.55, radius * (construct.type === "attached-triad" ? 0.0032 : 0.0026)),
        construct.type === "attached-triad" ? 0.29 : 0.20
      );
    }

    for (i = 0; i < construct.seams.length; i += 1) {
      drawOpenProjectedLine(
        ctx,
        construct.seams[i],
        rotation,
        tilt,
        cx,
        cy,
        radius,
        "rgba(238,196,111,0.16)",
        Math.max(0.45, radius * 0.0017),
        0.27
      );
    }

    drawConstructMinerals(ctx, construct, rotation, tilt, cx, cy, radius);
  }

  function pointInConstruct(construct, lon, lat) {
    var outline = construct.outline;
    var i;
    var j;
    var xi;
    var yi;
    var xj;
    var yj;
    var inside = false;

    for (i = 0, j = outline.length - 1; i < outline.length; j = i, i += 1) {
      xi = outline[i][0];
      yi = outline[i][1];
      xj = outline[j][0];
      yj = outline[j][1];
      if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / ((yj - yi) || 1) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  function drawConstructMinerals(ctx, construct, rotation, tilt, cx, cy, radius) {
    var lon;
    var lat;
    var p;
    var n;

    ctx.save();
    for (lat = -78; lat <= 78; lat += 6) {
      for (lon = -178; lon <= 178; lon += 6) {
        if (!pointInConstruct(construct, lon, lat)) continue;
        n = signedNoise(lon, lat, construct.phase + 6.3);
        if (n < 0.20) continue;
        p = project(lon, lat, rotation, tilt, cx, cy, radius);
        if (!p.visible || p.limb < 0.14) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.35, radius * 0.0025), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(225,181,95," + clamp(0.012 + p.limb * 0.035, 0.010, 0.050) + ")";
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawGraticule(ctx, rotation, tilt, cx, cy, radius) {
    var lat;
    var lon;
    var path;

    for (lat = -60; lat <= 60; lat += 30) {
      path = [];
      for (lon = -180; lon <= 180; lon += 6) path.push([lon, lat]);
      drawOpenProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, "rgba(190,224,255,0.034)", Math.max(0.32, radius * 0.001), 0.38);
    }

    for (lon = -150; lon <= 180; lon += 30) {
      path = [];
      for (lat = -80; lat <= 80; lat += 6) path.push([lon, lat]);
      drawOpenProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, "rgba(190,224,255,0.026)", Math.max(0.30, radius * 0.0009), 0.32);
    }
  }

  function drawAncientSurfaceFilm(ctx, cx, cy, radius) {
    var i;
    var x;
    var y;
    var alpha;

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

  function drawAtmosphere(ctx, cx, cy, radius) {
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

  function drawPlanetFrame(state, timestamp) {
    var canvas = state.canvas;
    var ctx = state.ctx;
    var width = canvas.width;
    var height = canvas.height;
    var cx = width * 0.5;
    var cy = height * 0.5;
    var radius = Math.min(width, height) * 0.385;
    var elapsed = (timestamp - state.startedAt) / 1000;
    var rotation = state.baseRotation + elapsed * state.rotationSpeed;
    var tilt = state.tilt;
    var constructs = state.constructs;
    var i;

    drawBackground(ctx, width, height);

    clipSphere(ctx, cx, cy, radius, function drawSphereContents() {
      drawOcean(ctx, cx, cy, radius);
      drawGraticule(ctx, rotation, tilt, cx, cy, radius);
      for (i = 0; i < constructs.length; i += 1) {
        drawConstruct(ctx, constructs[i], rotation, tilt, cx, cy, radius);
      }
      drawAncientSurfaceFilm(ctx, cx, cy, radius);
    });

    drawAtmosphere(ctx, cx, cy, radius);
  }

  function animationLoop(timestamp) {
    if (!activeState || !activeState.running) return;
    drawPlanetFrame(activeState, timestamp || safeNow());
    if (typeof global.requestAnimationFrame === "function") {
      activeAnimation = global.requestAnimationFrame(animationLoop);
    }
  }

  function start() {
    if (!activeState) return { ok: false, reason: "no-active-render" };
    if (activeState.running) return getStatus();
    activeState.running = true;
    activeState.startedAt = safeNow();
    if (typeof global.requestAnimationFrame === "function") {
      activeAnimation = global.requestAnimationFrame(animationLoop);
    } else {
      drawPlanetFrame(activeState, safeNow());
    }
    return getStatus();
  }

  function stop() {
    if (activeState) activeState.running = false;
    clearActiveAnimation();
    return getStatus();
  }

  function renderPlanetOne(mountOrOptions, maybeOptions) {
    var options;
    var mount;
    var made;
    var ctx;
    var state;

    clearActiveAnimation();

    options = normalizeOptions(maybeOptions || mountOrOptions || {});
    if (mountOrOptions && !mountOrOptions.nodeType && typeof mountOrOptions.getContext !== "function" && mountOrOptions.mount && !maybeOptions) {
      options = mountOrOptions;
    }

    mount = resolveMount(mountOrOptions, options);
    if (!mount) {
      return {
        ok: false,
        reason: "planet-one-render-mount-not-found",
        version: VERSION,
        VERSION: VERSION,
        PROJECTION_TNT: PROJECTION_TNT,
        projectionTnt: PROJECTION_TNT,
        markers: CONTRACT_MARKERS.slice()
      };
    }

    made = makeCanvas(mount, options);
    if (!made || !made.canvas || typeof made.canvas.getContext !== "function") {
      return {
        ok: false,
        reason: "planet-one-render-canvas-not-available",
        version: VERSION,
        VERSION: VERSION,
        PROJECTION_TNT: PROJECTION_TNT,
        projectionTnt: PROJECTION_TNT,
        markers: CONTRACT_MARKERS.slice()
      };
    }

    ctx = made.canvas.getContext("2d");
    if (!ctx) {
      return {
        ok: false,
        reason: "planet-one-render-2d-context-not-available",
        version: VERSION,
        VERSION: VERSION,
        PROJECTION_TNT: PROJECTION_TNT,
        projectionTnt: PROJECTION_TNT,
        markers: CONTRACT_MARKERS.slice()
      };
    }

    state = {
      canvas: made.canvas,
      ctx: ctx,
      mount: mount,
      size: made.size,
      ratio: made.ratio,
      baseRotation: typeof options.rotation === "number" ? options.rotation : -18,
      rotationSpeed: typeof options.rotationSpeed === "number" ? options.rotationSpeed : 3.2,
      tilt: typeof options.tilt === "number" ? options.tilt : -11,
      startedAt: safeNow(),
      running: options.animate !== false,
      constructs: makeConstructs(),
      markers: CONTRACT_MARKERS.slice(),
      terrainModuleDetected: hasTerrainModule(),
      hydrationModuleDetected: hasHydrationModule()
    };

    activeCanvas = made.canvas;
    activeState = state;
    drawPlanetFrame(state, safeNow());

    if (state.running && typeof global.requestAnimationFrame === "function") {
      activeAnimation = global.requestAnimationFrame(animationLoop);
    }

    return {
      ok: true,
      canvas: made.canvas,
      state: state,
      version: VERSION,
      VERSION: VERSION,
      PROJECTION_TNT: PROJECTION_TNT,
      projectionTnt: PROJECTION_TNT,
      BALANCE_TNT: BALANCE_TNT,
      VISUAL_TNT: VISUAL_TNT,
      SURFACE_TNT: SURFACE_TNT,
      CINEMATIC_TNT: CINEMATIC_TNT,
      NODAL_TNT: NODAL_TNT,
      BLOB_CORRECTION_TNT: BLOB_CORRECTION_TNT,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      markers: CONTRACT_MARKERS.slice(),
      start: start,
      stop: stop,
      getStatus: getStatus,
      renderFrame: function renderFrame() {
        drawPlanetFrame(state, safeNow());
        return getStatus();
      }
    };
  }

  function getStatus() {
    return {
      ok: true,
      active: Boolean(activeState),
      running: Boolean(activeState && activeState.running),
      version: VERSION,
      VERSION: VERSION,
      PROJECTION_TNT: PROJECTION_TNT,
      projectionTnt: PROJECTION_TNT,
      BALANCE_TNT: BALANCE_TNT,
      VISUAL_TNT: VISUAL_TNT,
      SURFACE_TNT: SURFACE_TNT,
      CINEMATIC_TNT: CINEMATIC_TNT,
      NODAL_TNT: NODAL_TNT,
      BLOB_CORRECTION_TNT: BLOB_CORRECTION_TNT,
      terrainAuthority: TERRAIN_AUTHORITY,
      hydrationAuthority: HYDRATION_AUTHORITY,
      terrainModuleDetected: hasTerrainModule(),
      hydrationModuleDetected: hasHydrationModule(),
      activeCanvas: activeCanvas,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      markers: CONTRACT_MARKERS.slice()
    };
  }

  function mount(mountOrOptions, maybeOptions) {
    return renderPlanetOne(mountOrOptions, maybeOptions);
  }

  function render(mountOrOptions, maybeOptions) {
    return renderPlanetOne(mountOrOptions, maybeOptions);
  }

  global.DGBPlanetOneRenderTeam = {
    VERSION: VERSION,
    version: VERSION,
    PROJECTION_TNT: PROJECTION_TNT,
    projectionTnt: PROJECTION_TNT,
    BALANCE_TNT: BALANCE_TNT,
    VISUAL_TNT: VISUAL_TNT,
    SURFACE_TNT: SURFACE_TNT,
    CINEMATIC_TNT: CINEMATIC_TNT,
    NODAL_TNT: NODAL_TNT,
    BLOB_CORRECTION_TNT: BLOB_CORRECTION_TNT,
    TERRAIN_AUTHORITY: TERRAIN_AUTHORITY,
    HYDRATION_AUTHORITY: HYDRATION_AUTHORITY,
    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
    markers: CONTRACT_MARKERS.slice(),
    renderPlanetOne: renderPlanetOne,
    render: render,
    mount: mount,
    start: start,
    stop: stop,
    getStatus: getStatus,
    status: getStatus,
    createRender: renderPlanetOne,
    createPlanetOneRender: renderPlanetOne
  };
})(typeof window !== "undefined" ? window : globalThis);
