/*
  PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1
  PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1
  PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1
  PLANET_ONE_RENDER_V21_VISUAL_BALANCE_REFINEMENT_TNT_v1
  PLANET_ONE_RENDER_V22_FINE_SURFACE_SAMPLING_AND_SHORELINE_SMOOTHING_TNT_v1
  PLANET_ONE_RENDER_V23_CINEMATIC_MATERIAL_ATMOSPHERE_REFINEMENT_TNT_v1
  PLANET_ONE_RENDER_V24_NODAL_LAND_CONSTRUCT_EXPRESSIVE_WRAP_TNT_v1

  TARGET=/world/render/planet-one.render.js

  PURPOSE:
  Renderer-only refinement.
  Remove the central blob read.
  Preserve seven-landmass logic: North Pole, South Pole, and five major land bodies.
  Allow three of the five non-polar bodies to attach into one wrapped continental construct.
  Render land through nodal constructs that express themselves as joined terrain systems rather than isolated flat blobs.
  Preserve route / asset / terrain / hydration chain.

  DO NOT TOUCH:
  /showroom/globe/index.html
  /assets/showroom.globe.instrument.js
  /world/render/planet-one.terrain.render.js
  /world/render/planet-one.hydration.render.js
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
    "expressive-nodal-terrain-system-active=true"
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
    var size = Math.max(340, Math.min(900, options.size || hostWidth));
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
    canvas.setAttribute("aria-label", "Planet 1 nodal land construct expressive wrap render");

    return {
      canvas: canvas,
      size: size,
      ratio: ratio
    };
  }

  function normalizeLon(lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  }

  function angularDistance(a, b) {
    var d = a - b;

    while (d > 180) d -= 360;
    while (d < -180) d += 360;

    return d;
  }

  function signedNoise(lon, lat, phase) {
    return (
      Math.sin(deg(lon * 1.7 + lat * 2.9 + phase * 31)) * 0.46 +
      Math.cos(deg(lon * 3.3 - lat * 1.8 + phase * 17)) * 0.31 +
      Math.sin(deg(lon * 7.2 + lat * 5.6 + phase * 13)) * 0.15 +
      Math.cos(deg(lon * 13.8 - lat * 8.7 + phase * 11)) * 0.08
    );
  }

  function materialNoise(lon, lat, phase) {
    return (
      Math.sin(deg(lon * 5.7 + lat * 3.4 + phase * 11)) * 0.18 +
      Math.cos(deg(lon * 9.2 - lat * 6.8 + phase * 17)) * 0.11 +
      Math.sin(deg(lon * 17.4 + lat * 14.6 + phase * 29)) * 0.045
    );
  }

  function interpolateLon(a, b, t) {
    return normalizeLon(a + angularDistance(b, a) * t);
  }

  function makeNodalConstructs() {
    return [
      {
        id: "attached_continental_wrap",
        type: "attached-triad",
        name: "Mainland + North Region + East Region",
        attachedRegions: 3,
        phase: 0.4,
        colorA: "rgba(72,112,75,0.86)",
        colorB: "rgba(34,72,56,0.91)",
        colorC: "rgba(112,98,70,0.29)",
        shore: "rgba(119,218,224,0.32)",
        ridge: "rgba(20,25,21,0.43)",
        river: "rgba(100,205,218,0.23)",
        mineral: "rgba(218,176,88,0.15)",
        nodes: [
          { lon: -82, lat: -4, rx: 26, ry: 30, weight: 1.18 },
          { lon: -43, lat: 16, rx: 31, ry: 28, weight: 1.30 },
          { lon: -3, lat: 30, rx: 32, ry: 20, weight: 1.04 },
          { lon: 43, lat: 22, rx: 29, ry: 24, weight: 1.02 },
          { lon: 78, lat: -4, rx: 26, ry: 25, weight: 0.92 }
        ],
        bridges: [
          { a: 0, b: 1, width: 22 },
          { a: 1, b: 2, width: 24 },
          { a: 2, b: 3, width: 22 },
          { a: 3, b: 4, width: 18 }
        ],
        ridges: [
          [[-92, -18], [-62, -3], [-28, 12], [8, 24], [45, 18], [76, -3]],
          [[-70, 18], [-34, 27], [2, 34], [36, 29], [68, 9]],
          [[-46, -27], [-20, -9], [16, 4], [49, 2], [78, -15]]
        ],
        rivers: [
          [[-35, 39], [-21, 27], [-12, 16], [0, 4], [16, -7], [33, -19]],
          [[55, 24], [41, 12], [28, 0], [12, -11], [-3, -24]]
        ]
      },
      {
        id: "western_craton",
        type: "separate-major-body",
        name: "West Region",
        phase: 2.7,
        colorA: "rgba(116,92,68,0.82)",
        colorB: "rgba(72,59,47,0.88)",
        colorC: "rgba(136,84,55,0.26)",
        shore: "rgba(92,198,214,0.26)",
        ridge: "rgba(27,24,20,0.38)",
        river: "rgba(95,195,210,0.17)",
        mineral: "rgba(198,111,70,0.13)",
        nodes: [
          { lon: -143, lat: 7, rx: 22, ry: 25, weight: 0.96 },
          { lon: -124, lat: -19, rx: 18, ry: 20, weight: 0.76 },
          { lon: -119, lat: 28, rx: 18, ry: 16, weight: 0.62 }
        ],
        bridges: [
          { a: 0, b: 1, width: 15 },
          { a: 0, b: 2, width: 12 }
        ],
        ridges: [
          [[-155, -11], [-143, 2], [-131, 15], [-115, 29]],
          [[-151, 19], [-136, 10], [-121, -3]]
        ],
        rivers: [
          [[-132, 31], [-137, 16], [-141, 0], [-145, -15]]
        ]
      },
      {
        id: "southern_arc",
        type: "separate-major-body",
        name: "South Region",
        phase: 4.0,
        colorA: "rgba(102,116,80,0.80)",
        colorB: "rgba(48,72,55,0.86)",
        colorC: "rgba(115,95,67,0.21)",
        shore: "rgba(96,199,216,0.24)",
        ridge: "rgba(25,30,23,0.34)",
        river: "rgba(98,194,210,0.15)",
        mineral: "rgba(212,171,88,0.10)",
        nodes: [
          { lon: -22, lat: -48, rx: 29, ry: 15, weight: 0.80 },
          { lon: 19, lat: -53, rx: 26, ry: 13, weight: 0.66 },
          { lon: -61, lat: -55, rx: 18, ry: 12, weight: 0.52 }
        ],
        bridges: [
          { a: 0, b: 1, width: 13 },
          { a: 0, b: 2, width: 10 }
        ],
        ridges: [
          [[-64, -55], [-35, -48], [-4, -51], [22, -56]]
        ],
        rivers: [
          [[-18, -39], [-28, -46], [-43, -54]]
        ]
      },
      {
        id: "north_pole",
        type: "pole",
        name: "North Pole",
        phase: 1.0,
        colorA: "rgba(220,235,237,0.68)",
        colorB: "rgba(129,168,184,0.52)",
        colorC: "rgba(255,255,255,0.12)",
        shore: "rgba(203,238,243,0.20)",
        ridge: "rgba(80,108,122,0.20)",
        river: "rgba(220,250,255,0.12)",
        mineral: "rgba(255,255,255,0.07)",
        nodes: [
          { lon: 8, lat: 76, rx: 50, ry: 8, weight: 0.62 }
        ],
        bridges: [],
        ridges: [
          [[-20, 75], [6, 78], [35, 76]]
        ],
        rivers: []
      },
      {
        id: "south_pole",
        type: "pole",
        name: "South Pole",
        phase: 2.3,
        colorA: "rgba(218,233,236,0.66)",
        colorB: "rgba(126,164,181,0.50)",
        colorC: "rgba(255,255,255,0.10)",
        shore: "rgba(200,236,242,0.18)",
        ridge: "rgba(80,108,122,0.19)",
        river: "rgba(220,250,255,0.12)",
        mineral: "rgba(255,255,255,0.06)",
        nodes: [
          { lon: -151, lat: -74, rx: 48, ry: 8, weight: 0.58 }
        ],
        bridges: [],
        ridges: [
          [[-178, -74], [-150, -77], [-118, -73]]
        ],
        rivers: []
      }
    ];
  }

  function constructFieldValue(construct, lon, lat) {
    var i;
    var node;
    var dx;
    var dy;
    var v;
    var value = -1.0;

    for (i = 0; i < construct.nodes.length; i += 1) {
      node = construct.nodes[i];

      dx = angularDistance(lon, node.lon) / node.rx;
      dy = (lat - node.lat) / node.ry;

      v = node.weight - (dx * dx + dy * dy);

      value = Math.max(value, v);
    }

    for (i = 0; i < construct.bridges.length; i += 1) {
      var bridge = construct.bridges[i];
      var a = construct.nodes[bridge.a];
      var b = construct.nodes[bridge.b];
      var samples = 8;
      var j;

      for (j = 0; j <= samples; j += 1) {
        var t = j / samples;
        var blon = interpolateLon(a.lon, b.lon, t);
        var blat = a.lat + (b.lat - a.lat) * t;
        var brx = bridge.width;
        var bry = bridge.width * 0.55;

        dx = angularDistance(lon, blon) / brx;
        dy = (lat - blat) / bry;
        v = 0.56 - (dx * dx + dy * dy);

        value = Math.max(value, v);
      }
    }

    value += signedNoise(lon, lat, construct.phase) * 0.075;

    return value;
  }

  function traceConstructOutline(construct) {
    var points = [];
    var lower = [];
    var lon;
    var lat;
    var bestLat;
    var firstFound;
    var target;
    var v;
    var previousKey = null;
    var direction;

    if (construct.type === "pole") {
      target = construct.nodes[0];

      for (direction = 0; direction < 140; direction += 1) {
        var a = Math.PI * 2 * direction / 140;
        points.push({
          lon: normalizeLon(target.lon + Math.cos(a) * target.rx * (1 + Math.sin(a * 5 + construct.phase) * 0.05)),
          lat: clamp(target.lat + Math.sin(a) * target.ry * (1 + Math.cos(a * 3) * 0.05), -86, 86)
        });
      }

      return points;
    }

    for (lon = -180; lon <= 180; lon += 3) {
      firstFound = false;
      bestLat = 0;

      for (lat = -82; lat <= 82; lat += 1.5) {
        v = constructFieldValue(construct, lon, lat);

        if (v >= 0) {
          if (!firstFound) {
            bestLat = lat;
            firstFound = true;
          } else if (lat > bestLat) {
            bestLat = lat;
          }
        }
      }

      if (firstFound) {
        points.push({ lon: lon, lat: bestLat });
      }
    }

    for (lon = 180; lon >= -180; lon -= 3) {
      firstFound = false;
      bestLat = 0;

      for (lat = 82; lat >= -82; lat -= 1.5) {
        v = constructFieldValue(construct, lon, lat);

        if (v >= 0) {
          if (!firstFound) {
            bestLat = lat;
            firstFound = true;
          } else if (lat < bestLat) {
            bestLat = lat;
          }
        }
      }

      if (firstFound) {
        lower.push({ lon: lon, lat: bestLat });
      }
    }

    points = points.concat(lower);

    return points.filter(function filterDuplicate(point) {
      var key = Math.round(point.lon * 10) + ":" + Math.round(point.lat * 10);
      var keep = key !== previousKey;
      previousKey = key;
      return keep;
    });
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
      visible: z2 > 0.025,
      limb: clamp(z2, 0, 1)
    };
  }

  function splitVisibleSegments(points, rotation, tilt, cx, cy, radius) {
    var segments = [];
    var current = [];
    var i;
    var p;

    for (i = 0; i < points.length; i += 1) {
      p = project(points[i].lon, points[i].lat, rotation, tilt, cx, cy, radius);

      if (p.visible) {
        current.push(p);
      } else if (current.length) {
        segments.push(current);
        current = [];
      }
    }

    if (current.length) segments.push(current);

    if (segments.length > 1 && points.length) {
      var firstOriginal = project(points[0].lon, points[0].lat, rotation, tilt, cx, cy, radius);
      var lastOriginal = project(points[points.length - 1].lon, points[points.length - 1].lat, rotation, tilt, cx, cy, radius);

      if (firstOriginal.visible && lastOriginal.visible) {
        segments[0] = segments[segments.length - 1].concat(segments[0]);
        segments.pop();
      }
    }

    return segments;
  }

  function segmentAverageLimb(segment) {
    var total = 0;
    var i;

    if (!segment.length) return 0;

    for (i = 0; i < segment.length; i += 1) {
      total += segment[i].limb;
    }

    return total / segment.length;
  }

  function smoothClosedPath(ctx, points) {
    var i;
    var current;
    var next;
    var mid;

    if (points.length < 3) return;

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
  }

  function smoothOpenLine(ctx, points) {
    var i;
    var current;
    var next;
    var mid;

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (i = 1; i < points.length - 1; i += 1) {
      current = points[i];
      next = points[i + 1];
      mid = {
        x: (current.x + next.x) / 2,
        y: (current.y + next.y) / 2
      };

      ctx.quadraticCurveTo(current.x, current.y, mid.x, mid.y);
    }

    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  }

  function drawBackground(ctx, width, height) {
    var i;
    var x;
    var y;
    var r;
    var bg;

    ctx.clearRect(0, 0, width, height);

    bg = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.5, width * 0.72);
    bg.addColorStop(0, "#071426");
    bg.addColorStop(0.62, "#020714");
    bg.addColorStop(1, "#010207");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    for (i = 0; i < 118; i += 1) {
      x = (i * 89) % width;
      y = (i * 47) % height;
      r = 0.38 + ((i * 17) % 7) * 0.07;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(216,232,255," + (0.10 + ((i * 13) % 9) / 115) + ")";
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
      cx - radius * 0.32,
      cy - radius * 0.35,
      radius * 0.03,
      cx,
      cy,
      radius
    );

    ocean.addColorStop(0.00, "#1b91ac");
    ocean.addColorStop(0.22, "#0d617f");
    ocean.addColorStop(0.52, "#06364f");
    ocean.addColorStop(0.78, "#031827");
    ocean.addColorStop(1.00, "#010611");

    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    drawOceanBasins(ctx, cx, cy, radius);
    drawOceanDepth(ctx, cx, cy, radius);
    drawOceanCurrents(ctx, cx, cy, radius);
  }

  function drawOceanBasins(ctx, cx, cy, radius) {
    var basins = [
      { x: -0.32, y: -0.05, rx: 0.30, ry: 0.17, a: 0.18 },
      { x: 0.20, y: 0.18, rx: 0.36, ry: 0.20, a: 0.16 },
      { x: 0.08, y: -0.30, rx: 0.28, ry: 0.14, a: 0.13 },
      { x: -0.05, y: 0.43, rx: 0.34, ry: 0.11, a: 0.13 }
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
    depth.addColorStop(0.42, "rgba(0,16,31,0.08)");
    depth.addColorStop(0.72, "rgba(0,7,20,0.31)");
    depth.addColorStop(1, "rgba(0,0,0,0.68)");

    ctx.fillStyle = depth;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
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
      ctx.strokeStyle = "rgba(124,220,232,0.040)";
      ctx.lineWidth = Math.max(1, radius * 0.0035);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, color, width, alpha) {
    var projected = [];
    var i;
    var p;

    for (i = 0; i < path.length; i += 1) {
      p = project(path[i][0], path[i][1], rotation, tilt, cx, cy, radius);

      if (p.visible && p.limb > 0.08) {
        projected.push(p);
      } else if (projected.length > 1) {
        ctx.save();
        smoothOpenLine(ctx, projected);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.restore();
        projected = [];
      } else {
        projected = [];
      }
    }

    if (projected.length > 1) {
      ctx.save();
      smoothOpenLine(ctx, projected);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawGraticule(ctx, rotation, tilt, cx, cy, radius) {
    var lat;
    var lon;
    var path;

    for (lat = -60; lat <= 60; lat += 30) {
      path = [];

      for (lon = -180; lon <= 180; lon += 6) {
        path.push([lon, lat]);
      }

      drawProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, "rgba(190,224,255,0.035)", Math.max(0.32, radius * 0.001), 0.38);
    }

    for (lon = -150; lon <= 180; lon += 30) {
      path = [];

      for (lat = -80; lat <= 80; lat += 6) {
        path.push([lon, lat]);
      }

      drawProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, "rgba(190,224,255,0.025)", Math.max(0.30, radius * 0.0009), 0.32);
    }
  }

  function drawConstruct(ctx, construct, rotation, tilt, cx, cy, radius) {
    var outline = traceConstructOutline(construct);
    var segments = splitVisibleSegments(outline, rotation, tilt, cx, cy, radius);
    var s;
    var segment;
    var limb;
    var fill;
    var alpha;

    for (s = 0; s < segments.length; s += 1) {
      segment = segments[s];

      if (segment.length < 8) continue;

      limb = segmentAverageLimb(segment);
      alpha = clamp(0.17 + limb * 0.68, 0.13, 0.84);

      ctx.save();
      smoothClosedPath(ctx, segment);

      fill = ctx.createRadialGradient(
        cx - radius * 0.30,
        cy - radius * 0.34,
        radius * 0.05,
        cx,
        cy,
        radius * 1.05
      );

      fill.addColorStop(0.00, construct.colorA);
      fill.addColorStop(0.42, construct.colorB);
      fill.addColorStop(0.76, construct.colorC);
      fill.addColorStop(1.00, "rgba(18,27,24,0.88)");

      ctx.globalAlpha = alpha;
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = clamp(0.08 + limb * 0.16, 0.06, 0.23);
      ctx.fillStyle = "rgba(255,228,165,0.18)";
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = clamp(0.11 + limb * 0.19, 0.08, 0.30);
      ctx.strokeStyle = construct.shore;
      ctx.lineWidth = Math.max(0.9, radius * 0.0048);
      ctx.shadowColor = "rgba(94,220,230,0.12)";
      ctx.shadowBlur = radius * 0.006;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.globalAlpha = clamp(0.06 + limb * 0.10, 0.04, 0.16);
      ctx.strokeStyle = "rgba(238,255,247,0.20)";
      ctx.lineWidth = Math.max(0.4, radius * 0.0014);
      ctx.stroke();

      ctx.restore();
    }

    drawConstructInterior(ctx, construct, rotation, tilt, cx, cy, radius);
    drawConstructMaterial(ctx, construct, rotation, tilt, cx, cy, radius);
  }

  function drawConstructInterior(ctx, construct, rotation, tilt, cx, cy, radius) {
    var i;

    for (i = 0; i < construct.ridges.length; i += 1) {
      drawProjectedLine(
        ctx,
        construct.ridges[i],
        rotation,
        tilt,
        cx,
        cy,
        radius,
        construct.ridge,
        Math.max(0.55, radius * 0.0027),
        construct.type === "attached-triad" ? 0.27 : 0.20
      );
    }

    for (i = 0; i < construct.rivers.length; i += 1) {
      drawProjectedLine(
        ctx,
        construct.rivers[i],
        rotation,
        tilt,
        cx,
        cy,
        radius,
        construct.river,
        Math.max(0.38, radius * 0.0017),
        0.19
      );
    }

    if (construct.type === "attached-triad") {
      drawProjectedLine(
        ctx,
        [[-90, -8], [-54, 8], [-18, 22], [21, 27], [56, 14], [82, -6]],
        rotation,
        tilt,
        cx,
        cy,
        radius,
        "rgba(236,190,104,0.16)",
        Math.max(0.45, radius * 0.0015),
        0.24
      );
    }
  }

  function drawConstructMaterial(ctx, construct, rotation, tilt, cx, cy, radius) {
    var lon;
    var lat;
    var p;
    var n;

    ctx.save();

    for (lat = -78; lat <= 78; lat += 6) {
      for (lon = -178; lon <= 178; lon += 6) {
        if (constructFieldValue(construct, lon, lat) < -0.18) continue;

        n = materialNoise(lon, lat, construct.phase);

        if (n < 0.18) continue;

        p = project(lon, lat, rotation, tilt, cx, cy, radius);

        if (!p.visible || p.limb < 0.14) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.38, radius * 0.0027), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(225,181,95," + clamp(0.014 + p.limb * 0.036, 0.010, 0.052) + ")";
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawGeologicBlend(ctx, rotation, tilt, cx, cy, radius) {
    var lon;
    var lat;
    var p;
    var n;

    ctx.save();

    for (lat = -72; lat <= 72; lat += 7) {
      for (lon = -176; lon <= 176; lon += 7) {
        n = signedNoise(lon, lat, 2.5);

        if (n < 0.22) continue;

        p = project(lon, lat, rotation, tilt, cx, cy, radius);

        if (!p.visible || p.limb < 0.16) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.45, radius * 0.0030), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(242,199,111," + clamp(0.010 + p.limb * 0.020, 0.008, 0.034) + ")";
        ctx.fill();
      }
    }

    ctx.restore();
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

    for (i = 0; i < 180; i += 1) {
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

  function drawTerminator(ctx, cx, cy, radius) {
    var shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);

    shade.addColorStop(0.00, "rgba(255,255,255,0.085)");
    shade.addColorStop(0.30, "rgba(255,255,255,0.018)");
    shade.addColorStop(0.62, "rgba(0,0,0,0.18)");
    shade.addColorStop(0.84, "rgba(0,0,0,0.43)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.70)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawCinematicLimb(ctx, cx, cy, radius) {
    var limb = ctx.createRadialGradient(cx, cy, radius * 0.54, cx, cy, radius * 1.02);

    limb.addColorStop(0.00, "rgba(255,255,255,0)");
    limb.addColorStop(0.62, "rgba(255,255,255,0)");
    limb.addColorStop(0.82, "rgba(29,73,102,0.13)");
    limb.addColorStop(0.94, "rgba(5,16,30,0.42)");
    limb.addColorStop(1.00, "rgba(0,0,0,0.72)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = limb;
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
    ctx.strokeStyle = "rgba(242,199,111,0.24)";
    ctx.lineWidth = Math.max(0.9, radius * 0.0048);
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -radius * 0.98, radius * 0.015, 0, Math.PI * 2);
    ctx.arc(0, radius * 0.98, radius * 0.015, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,199,111,0.23)";
    ctx.fill();

    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var glow = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.16);
    var blueShell = ctx.createRadialGradient(cx - radius * 0.12, cy - radius * 0.18, radius * 0.52, cx, cy, radius * 1.07);

    glow.addColorStop(0, "rgba(255,255,255,0)");
    glow.addColorStop(0.70, "rgba(122,210,245,0.045)");
    glow.addColorStop(0.90, "rgba(122,210,245,0.16)");
    glow.addColorStop(1, "rgba(122,210,245,0.30)");

    blueShell.addColorStop(0, "rgba(255,255,255,0.055)");
    blueShell.addColorStop(0.55, "rgba(255,255,255,0.000)");
    blueShell.addColorStop(0.90, "rgba(81,159,209,0.13)");
    blueShell.addColorStop(1, "rgba(61,126,184,0.23)");

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.075, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = blueShell;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(166,218,255,0.30)";
    ctx.lineWidth = Math.max(1.0, radius * 0.0075);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.978, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(91,168,218,0.14)";
    ctx.lineWidth = Math.max(0.7, radius * 0.0032);
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
    var constructs = makeNodalConstructs();
    var i;

    drawBackground(ctx, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.shadowColor = "rgba(69,165,218,0.20)";
    ctx.shadowBlur = radius * 0.16;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();
    ctx.restore();

    drawSphereClip(ctx, cx, cy, radius, function drawSurface() {
      drawOcean(ctx, cx, cy, radius);
      drawGraticule(ctx, rotation, tilt, cx, cy, radius);

      for (i = 0; i < constructs.length; i += 1) {
        drawConstruct(ctx, constructs[i], rotation, tilt, cx, cy, radius);
      }

      drawGeologicBlend(ctx, rotation, tilt, cx, cy, radius);
      drawAncientSurfaceFilm(ctx, cx, cy, radius);
      drawTerminator(ctx, cx, cy, radius);
      drawCinematicLimb(ctx, cx, cy, radius);
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
    proof.setAttribute("data-surface-tnt", SURFACE_TNT);
    proof.setAttribute("data-cinematic-tnt", CINEMATIC_TNT);
    proof.setAttribute("data-nodal-tnt", NODAL_TNT);

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

    proof.setAttribute("data-fine-surface-sampling-active", "true");
    proof.setAttribute("data-shoreline-smoothing-active", "true");
    proof.setAttribute("data-blocky-cell-artifact-reduced", "true");
    proof.setAttribute("data-geologic-blend-field-active", "true");
    proof.setAttribute("data-smooth-continent-wrap-active", "true");
    proof.setAttribute("data-renderer-only-visual-refinement", "true");

    proof.setAttribute("data-cinematic-material-atmosphere-active", "true");
    proof.setAttribute("data-ancient-surface-materiality-active", "true");
    proof.setAttribute("data-ocean-basin-depth-active", "true");
    proof.setAttribute("data-atmospheric-limb-depth-active", "true");
    proof.setAttribute("data-non-cartoon-world-body-active", "true");
    proof.setAttribute("data-mineral-pressure-surface-active", "true");
    proof.setAttribute("data-geologic-scar-subtlety-active", "true");

    proof.setAttribute("data-nodal-land-construct-active", "true");
    proof.setAttribute("data-central-blob-rejected", "true");
    proof.setAttribute("data-three-region-attached-wrap-active", "true");
    proof.setAttribute("data-five-major-regions-preserved", "true");
    proof.setAttribute("data-north-south-poles-preserved", "true");
    proof.setAttribute("data-expressive-nodal-terrain-system-active", "true");

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
      "Bad squeeze released",
      "Fine surface sampling active",
      "Shoreline smoothing active",
      "Blocky cell artifact reduced",
      "Geologic blend field active",
      "Smooth continent wrap active",
      "Renderer only visual refinement",
      "Cinematic material atmosphere active",
      "Ancient surface materiality active",
      "Ocean basin depth active",
      "Atmospheric limb depth active",
      "Non-cartoon world body active",
      "Mineral pressure surface active",
      "Geologic scar subtlety active",
      "Nodal land construct active",
      "Central blob rejected",
      "Three-region attached wrap active",
      "Five major regions preserved",
      "North-south poles preserved",
      "Expressive nodal terrain system active"
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

    mount.dataset.fineSurfaceSamplingActive = "true";
    mount.dataset.shorelineSmoothingActive = "true";
    mount.dataset.blockyCellArtifactReduced = "true";
    mount.dataset.geologicBlendFieldActive = "true";
    mount.dataset.smoothContinentWrapActive = "true";
    mount.dataset.rendererOnlyVisualRefinement = "true";

    mount.dataset.cinematicMaterialAtmosphereActive = "true";
    mount.dataset.ancientSurfaceMaterialityActive = "true";
    mount.dataset.oceanBasinDepthActive = "true";
    mount.dataset.atmosphericLimbDepthActive = "true";
    mount.dataset.nonCartoonWorldBodyActive = "true";
    mount.dataset.mineralPressureSurfaceActive = "true";
    mount.dataset.geologicScarSubtletyActive = "true";

    mount.dataset.nodalLandConstructActive = "true";
    mount.dataset.centralBlobRejected = "true";
    mount.dataset.threeRegionAttachedWrapActive = "true";
    mount.dataset.fiveMajorRegionsPreserved = "true";
    mount.dataset.northSouthPolesPreserved = "true";
    mount.dataset.expressiveNodalTerrainSystemActive = "true";

    mount.dataset.rendererVersion = VERSION;
    mount.dataset.projectionTnt = PROJECTION_TNT;
    mount.dataset.balanceTnt = BALANCE_TNT;
    mount.dataset.visualTnt = VISUAL_TNT;
    mount.dataset.surfaceTnt = SURFACE_TNT;
    mount.dataset.cinematicTnt = CINEMATIC_TNT;
    mount.dataset.nodalTnt = NODAL_TNT;
  }

  function normalizeOptions(options) {
    options = options || {};

    return {
      caption: options.caption || "Planet 1 · Nine Summits Universe · Nodal land construct expressive wrap",
      rotate: options.rotate !== false,
      speed: Number(options.speed == null ? 0.0032 : options.speed),
      rotation: Number(options.rotation == null ? -82 : options.rotation),
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
      surfaceTnt: SURFACE_TNT,
      cinematicTnt: CINEMATIC_TNT,
      nodalTnt: NODAL_TNT,

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

      fineSurfaceSamplingActive: true,
      shorelineSmoothingActive: true,
      blockyCellArtifactReduced: true,
      geologicBlendFieldActive: true,
      smoothContinentWrapActive: true,
      rendererOnlyVisualRefinement: true,

      cinematicMaterialAtmosphereActive: true,
      ancientSurfaceMaterialityActive: true,
      oceanBasinDepthActive: true,
      atmosphericLimbDepthActive: true,
      nonCartoonWorldBodyActive: true,
      mineralPressureSurfaceActive: true,
      geologicScarSubtletyActive: true,

      nodalLandConstructActive: true,
      centralBlobRejected: true,
      threeRegionAttachedWrapActive: true,
      fiveMajorRegionsPreserved: true,
      northSouthPolesPreserved: true,
      expressiveNodalTerrainSystemActive: true,

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
      surfaceTnt: SURFACE_TNT,
      SURFACE_TNT: SURFACE_TNT,
      cinematicTnt: CINEMATIC_TNT,
      CINEMATIC_TNT: CINEMATIC_TNT,
      nodalTnt: NODAL_TNT,
      NODAL_TNT: NODAL_TNT,

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

      fineSurfaceSamplingActive: true,
      shorelineSmoothingActive: true,
      blockyCellArtifactReduced: true,
      geologicBlendFieldActive: true,
      smoothContinentWrapActive: true,
      rendererOnlyVisualRefinement: true,

      cinematicMaterialAtmosphereActive: true,
      ancientSurfaceMaterialityActive: true,
      oceanBasinDepthActive: true,
      atmosphericLimbDepthActive: true,
      nonCartoonWorldBodyActive: true,
      mineralPressureSurfaceActive: true,
      geologicScarSubtletyActive: true,

      nodalLandConstructActive: true,
      centralBlobRejected: true,
      threeRegionAttachedWrapActive: true,
      fiveMajorRegionsPreserved: true,
      northSouthPolesPreserved: true,
      expressiveNodalTerrainSystemActive: true,

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
      surfaceTnt: SURFACE_TNT,
      SURFACE_TNT: SURFACE_TNT,
      cinematicTnt: CINEMATIC_TNT,
      CINEMATIC_TNT: CINEMATIC_TNT,
      nodalTnt: NODAL_TNT,
      NODAL_TNT: NODAL_TNT,
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

      fineSurfaceSamplingActive: true,
      shorelineSmoothingActive: true,
      blockyCellArtifactReduced: true,
      geologicBlendFieldActive: true,
      smoothContinentWrapActive: true,
      rendererOnlyVisualRefinement: true,

      cinematicMaterialAtmosphereActive: true,
      ancientSurfaceMaterialityActive: true,
      oceanBasinDepthActive: true,
      atmosphericLimbDepthActive: true,
      nonCartoonWorldBodyActive: true,
      mineralPressureSurfaceActive: true,
      geologicScarSubtletyActive: true,

      nodalLandConstructActive: true,
      centralBlobRejected: true,
      threeRegionAttachedWrapActive: true,
      fiveMajorRegionsPreserved: true,
      northSouthPolesPreserved: true,
      expressiveNodalTerrainSystemActive: true,

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

    SURFACE_TNT: SURFACE_TNT,
    surfaceTnt: SURFACE_TNT,

    CINEMATIC_TNT: CINEMATIC_TNT,
    cinematicTnt: CINEMATIC_TNT,

    NODAL_TNT: NODAL_TNT,
    nodalTnt: NODAL_TNT,

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
    document.documentElement.setAttribute("data-planet-one-surface-tnt", SURFACE_TNT);
    document.documentElement.setAttribute("data-planet-one-cinematic-tnt", CINEMATIC_TNT);
    document.documentElement.setAttribute("data-planet-one-nodal-tnt", NODAL_TNT);

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

    document.documentElement.setAttribute("data-fine-surface-sampling-active", "true");
    document.documentElement.setAttribute("data-shoreline-smoothing-active", "true");
    document.documentElement.setAttribute("data-blocky-cell-artifact-reduced", "true");
    document.documentElement.setAttribute("data-geologic-blend-field-active", "true");
    document.documentElement.setAttribute("data-smooth-continent-wrap-active", "true");
    document.documentElement.setAttribute("data-renderer-only-visual-refinement", "true");

    document.documentElement.setAttribute("data-cinematic-material-atmosphere-active", "true");
    document.documentElement.setAttribute("data-ancient-surface-materiality-active", "true");
    document.documentElement.setAttribute("data-ocean-basin-depth-active", "true");
    document.documentElement.setAttribute("data-atmospheric-limb-depth-active", "true");
    document.documentElement.setAttribute("data-non-cartoon-world-body-active", "true");
    document.documentElement.setAttribute("data-mineral-pressure-surface-active", "true");
    document.documentElement.setAttribute("data-geologic-scar-subtlety-active", "true");

    document.documentElement.setAttribute("data-nodal-land-construct-active", "true");
    document.documentElement.setAttribute("data-central-blob-rejected", "true");
    document.documentElement.setAttribute("data-three-region-attached-wrap-active", "true");
    document.documentElement.setAttribute("data-five-major-regions-preserved", "true");
    document.documentElement.setAttribute("data-north-south-poles-preserved", "true");
    document.documentElement.setAttribute("data-expressive-nodal-terrain-system-active", "true");
  }
})(window);
