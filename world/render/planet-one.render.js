/*
  PLANET_ONE_RENDER_TEAM_TNT_v6_PANGAEA_FRACTURE_SURFACE_SYSTEM
  OWNER=SEAN
  TARGET=/world/render/planet-one.render.js
  PURPOSE=GIVE_PLANET_ONE_LANDMASSES_FORMER_PANGAEA_FRACTURE_SHAPE_WITH_RECOGNITION_FIRST_SURFACE_CLASSES
  STATUS=ACTIVE

  REQUIRED GAUGES / CONTRACT MARKERS:
  PLANET_ONE_RENDER_TEAM_TNT_v1
  window.DGBPlanetOneRenderTeam
  renderPlanetOne
  planet-one-render-active=true
  planet-one-renderer=/world/render/planet-one.render.js
  globe-demo-status-retired=true
  tree-demo-mode=true
  render-lanes-separated=true
  no-render-lane-collapse=true

  VISUAL CONTRACT:
  no-generated-graphic=true
  no-external-image=true
  planet-one-realism-pass=v6-pangaea-fracture-surface-system
  recognition-first-render=true
  pangaea-fracture-memory=true
  cartoon-blob-globe-retired=true
*/

(function () {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_TEAM_TNT_v6_PANGAEA_FRACTURE_SURFACE_SYSTEM";
  var RENDERER_PATH = "/world/render/planet-one.render.js";

  var SURFACE_CLASSES = [
    "deep_ocean", "shallow_ocean", "continental_shelf", "beach_band",
    "rocky_coast", "wetland_margin", "lowland_plain", "valley_basin",
    "river_corridor", "lake_basin", "plateau_field", "mountain_ridge",
    "canyon_fracture", "mineral_scar", "polar_ice", "cloud_cover",
    "atmospheric_limb", "magnetic_core_signal", "pangaea_fracture_seam",
    "rift_ocean"
  ];

  var PLATES = [
    { id: "northPole", cx: 0.50, cy: 0.075, rx: 0.34, ry: 0.060, rot: 0.02, weight: 1.05, seed: 111 },
    { id: "north", cx: 0.49, cy: 0.260, rx: 0.285, ry: 0.135, rot: -0.10, weight: 0.95, seed: 222 },
    { id: "mainland", cx: 0.485, cy: 0.505, rx: 0.255, ry: 0.230, rot: 0.16, weight: 1.05, seed: 333 },
    { id: "west", cx: 0.285, cy: 0.500, rx: 0.165, ry: 0.260, rot: -0.38, weight: 0.96, seed: 444 },
    { id: "east", cx: 0.725, cy: 0.485, rx: 0.185, ry: 0.250, rot: 0.35, weight: 0.96, seed: 555 },
    { id: "south", cx: 0.525, cy: 0.740, rx: 0.300, ry: 0.135, rot: -0.08, weight: 0.92, seed: 666 },
    { id: "southPole", cx: 0.50, cy: 0.925, rx: 0.35, ry: 0.060, rot: -0.01, weight: 1.02, seed: 777 }
  ];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-team-style-v6")) return;

    var style = document.createElement("style");
    style.id = "planet-one-render-team-style-v6";
    style.textContent = `
      .planet-one-render-shell {
        display: grid;
        justify-items: center;
        gap: 18px;
        width: 100%;
      }

      .planet-one-render-card {
        display: grid;
        justify-items: center;
        gap: 14px;
        width: min(660px, 100%);
        padding: clamp(12px, 3vw, 20px);
        border: 1px solid rgba(242, 199, 111, 0.38);
        border-radius: 30px;
        background:
          radial-gradient(circle at 50% 10%, rgba(145, 189, 255, 0.14), transparent 16rem),
          radial-gradient(circle at 50% 62%, rgba(143, 240, 198, 0.06), transparent 18rem),
          rgba(3, 7, 14, 0.80);
        box-shadow:
          0 30px 90px rgba(0, 0, 0, 0.64),
          0 0 74px rgba(145, 189, 255, 0.15);
      }

      .planet-one-canvas-wrap {
        position: relative;
        width: min(540px, 88vw);
        aspect-ratio: 1;
        display: grid;
        place-items: center;
      }

      .planet-one-canvas {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 50%;
        filter:
          drop-shadow(0 34px 54px rgba(0, 0, 0, 0.84))
          drop-shadow(0 0 32px rgba(145, 189, 255, 0.12));
      }

      .planet-one-caption {
        max-width: 840px;
        color: rgba(244, 247, 255, 0.86);
        font-size: 0.78rem;
        font-weight: 950;
        letter-spacing: 0.12em;
        line-height: 1.35;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-telemetry {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        max-width: 880px;
      }

      .planet-one-telemetry span {
        border: 1px solid rgba(168, 199, 255, 0.18);
        border-radius: 999px;
        padding: 6px 9px;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(244, 247, 255, 0.74);
        font-size: 0.66rem;
        font-weight: 850;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .planet-one-mapkey {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        width: min(740px, 100%);
      }

      .planet-one-mapkey div {
        border: 1px solid rgba(168, 199, 255, 0.14);
        border-radius: 14px;
        padding: 8px 10px;
        background: rgba(255, 255, 255, 0.045);
        color: rgba(244, 247, 255, 0.78);
        font-size: 0.72rem;
        font-weight: 800;
        line-height: 1.25;
      }

      .planet-one-mapkey strong {
        display: block;
        color: #f2c76f;
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 2px;
      }

      @media (max-width: 620px) {
        .planet-one-mapkey {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  function mixColor(a, b, t) {
    return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
  }

  function normalize(v) {
    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function hash2(ix, iy, seed) {
    var n = ix * 374761393 + iy * 668265263 + seed * 1442695041;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) >>> 0) / 4294967295;
  }

  function valueNoise(x, y, seed) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = x - ix;
    var fy = y - iy;
    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);

    var a = hash2(ix, iy, seed);
    var b = hash2(ix + 1, iy, seed);
    var c = hash2(ix, iy + 1, seed);
    var d = hash2(ix + 1, iy + 1, seed);

    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    var value = 0;
    var amp = 0.5;
    var freq = 1;
    var norm = 0;

    for (var i = 0; i < octaves; i += 1) {
      value += valueNoise(x * freq, y * freq, seed + i * 101) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.05;
    }

    return value / norm;
  }

  function rotatePoint(x, y, angle) {
    var ca = Math.cos(angle);
    var sa = Math.sin(angle);
    return { x: x * ca - y * sa, y: x * sa + y * ca };
  }

  function plateShapeValue(u, v, plate) {
    var local = rotatePoint(u - plate.cx, v - plate.cy, -plate.rot);
    var nx = local.x / plate.rx;
    var ny = local.y / plate.ry;
    var angle = Math.atan2(ny, nx);
    var dist = Math.sqrt(nx * nx + ny * ny);

    var lobe =
      Math.sin(angle * 3 + plate.seed * 0.011) * 0.11 +
      Math.sin(angle * 5 - plate.seed * 0.017) * 0.08 +
      Math.sin(angle * 9 + plate.seed * 0.023) * 0.045;

    var edgeNoise = fbm(u * 13.0 + plate.seed * 0.01, v * 13.0 - plate.seed * 0.02, plate.seed, 4) - 0.5;
    var shelfNoise = fbm(u * 30.0 + plate.seed * 0.04, v * 26.0 + plate.seed * 0.03, plate.seed + 800, 3) - 0.5;
    var shape = 1 - dist + lobe + edgeNoise * 0.22 + shelfNoise * 0.08;

    return shape * plate.weight;
  }

  function riftLineDistance(u, v, seed, baseX, baseY, angle, length, wobbleScale) {
    var x = u - baseX;
    var y = v - baseY;
    var p = rotatePoint(x, y, -angle);
    var along = p.x / length;
    var wobble = Math.sin(along * 7 + seed) * wobbleScale + (fbm(along * 4 + seed, seed * 0.13, seed + 99, 3) - 0.5) * wobbleScale * 1.2;
    var cross = Math.abs(p.y - wobble);
    var endFade = 1 - smoothstep(0.82, 1.10, Math.abs(along));
    return { cross: cross, endFade: endFade };
  }

  function pangaeaFractureField(u, v) {
    var lines = [
      riftLineDistance(u, v, 101, 0.50, 0.375, 0.04, 0.62, 0.016),
      riftLineDistance(u, v, 202, 0.50, 0.655, -0.04, 0.58, 0.018),
      riftLineDistance(u, v, 303, 0.385, 0.505, 1.18, 0.44, 0.014),
      riftLineDistance(u, v, 404, 0.615, 0.500, -1.16, 0.45, 0.014),
      riftLineDistance(u, v, 505, 0.500, 0.505, 1.56, 0.44, 0.010)
    ];

    var field = 0;
    lines.forEach(function (line) {
      var band = (1 - smoothstep(0.006, 0.035, line.cross)) * line.endFade;
      field = Math.max(field, band);
    });

    return clamp(field, 0, 1);
  }

  function pangaeaMemoryEnvelope(u, v) {
    var x = (u - 0.5) / 0.43;
    var y = (v - 0.52) / 0.48;
    var d = Math.sqrt(x * x + y * y);
    var memory = smoothstep(1.22, 0.32, d);
    var broken = fbm(u * 5.5 + 7.2, v * 5.2 + 1.1, 909, 4);
    return clamp(memory * (0.74 + broken * 0.26), 0, 1);
  }

  function regionInfluence(u, v) {
    var best = { id: "ocean", value: -1, plate: null };
    var second = { id: "ocean", value: -1, plate: null };

    PLATES.forEach(function (plate) {
      var value = plateShapeValue(u, v, plate);
      if (value > best.value) {
        second = best;
        best = { id: plate.id, value: value, plate: plate };
      } else if (value > second.value) {
        second = { id: plate.id, value: value, plate: plate };
      }
    });

    var rift = pangaeaFractureField(u, v);
    var memory = pangaeaMemoryEnvelope(u, v);

    return {
      id: best.id,
      value: best.value,
      plate: best.plate,
      secondId: second.id,
      secondValue: second.value,
      rift: rift,
      memory: memory,
      fitPressure: smoothstep(0.06, 0.44, Math.abs(best.value - second.value))
    };
  }

  function projectPoint(px, py, cx, cy, r) {
    var dx = (px - cx) / r;
    var dy = (py - cy) / r;
    var rr = dx * dx + dy * dy;

    if (rr > 1) return null;

    var z = Math.sqrt(1 - rr);
    var normal = normalize([dx, dy, z]);
    var lon = Math.atan2(dx, z) / Math.PI;
    var lat = Math.asin(-dy) / (Math.PI / 2);

    return {
      rr: rr,
      normal: normal,
      u: lon * 0.5 + 0.5,
      v: lat * -0.5 + 0.5,
      lat: lat
    };
  }

  function buildSurfaceSample(point) {
    var u = point.u;
    var v = point.v;
    var region = regionInfluence(u, v);

    var broad = fbm(u * 2.1 + 1.7, v * 3.2 - 0.6, 401, 5);
    var shelfNoise = fbm(u * 7.2 + 3.1, v * 7.8 + 5.2, 771, 4);
    var elevation = fbm(u * 15.0 + 9.5, v * 17.0 + 1.5, 1001, 5);
    var mineral = fbm(u * 34.0 + 2.3, v * 31.0 + 7.7, 1401, 4);
    var pressure = fbm(u * 5.0 + Math.sin(v * 6.2), v * 6.0 + Math.cos(u * 5.8), 1701, 4);
    var moisture = fbm(u * 10.2 + 9.4, v * 9.3 + 2.1, 1901, 3);
    var basin = fbm(u * 18.5 + 6.4, v * 20.2 + 4.9, 2101, 4);
    var fracture = fbm(u * 28.0 + 1.2, v * 13.0 + 2.7, 3101, 4);
    var riverWave = 1 - Math.abs(Math.sin((u * 19.0 + fbm(u * 2.2, v * 2.2, 3301, 3) * 2.6) + v * 11.0));
    var canyonWave = 1 - Math.abs(Math.sin((u * 24.0 - v * 18.0) + fracture * 4.0));

    var isPolar = region.id === "northPole" || region.id === "southPole";
    var coastlineRaggedness = (shelfNoise - 0.5) * 0.24 + (broad - 0.5) * 0.14 + (pressure - 0.5) * 0.10;
    var landScore = region.value + coastlineRaggedness + region.memory * 0.05 - region.rift * 0.38;
    var threshold = isPolar ? 0.08 : 0.10;
    var isLand = landScore > threshold;

    return {
      point: point,
      region: region,
      u: u,
      v: v,
      broad: broad,
      shelfNoise: shelfNoise,
      elevation: elevation,
      mineral: mineral,
      pressure: pressure,
      moisture: moisture,
      basin: basin,
      fracture: fracture,
      riverWave: riverWave,
      canyonWave: canyonWave,
      isPolar: isPolar,
      landScore: landScore,
      threshold: threshold,
      isLand: isLand,
      pangaeaMemory: region.memory,
      rift: region.rift
    };
  }

  function classifySurfacePoint(sample) {
    var classes = {};
    SURFACE_CLASSES.forEach(function (name) {
      classes[name] = 0;
    });

    var margin = sample.landScore - sample.threshold;
    var shelf = smoothstep(-0.20, -0.025, margin) * (1 - smoothstep(0.02, 0.16, margin));
    var beach = smoothstep(-0.035, 0.018, margin) * (1 - smoothstep(0.05, 0.15, margin));
    var shallow = smoothstep(-0.25, -0.055, margin) * (sample.isLand ? 0 : 1);
    var deep = 1 - smoothstep(-0.42, -0.12, margin);

    classes.deep_ocean = sample.isLand ? 0 : clamp(deep, 0, 1);
    classes.shallow_ocean = sample.isLand ? 0 : clamp(shallow, 0, 1);
    classes.continental_shelf = sample.isLand ? 0 : clamp(shelf, 0, 1);
    classes.rift_ocean = sample.isLand ? 0 : sample.rift * smoothstep(-0.05, 0.10, sample.region.value);
    classes.beach_band = sample.isLand ? clamp(beach, 0, 1) : 0;
    classes.rocky_coast = classes.beach_band * smoothstep(0.52, 0.88, sample.mineral);
    classes.wetland_margin = classes.beach_band * smoothstep(0.55, 0.90, sample.moisture) * (sample.region.id === "south" || sample.region.id === "east" ? 1 : 0.35);
    classes.pangaea_fracture_seam = sample.rift * smoothstep(-0.08, 0.18, sample.region.value);

    var lowland = sample.isLand ? (1 - smoothstep(0.42, 0.72, sample.elevation)) : 0;
    classes.lowland_plain = lowland * (sample.region.id === "mainland" || sample.region.id === "south" ? 1 : 0.55);
    classes.valley_basin = sample.isLand ? smoothstep(0.56, 0.86, sample.basin) * (1 - smoothstep(0.58, 0.82, sample.elevation)) : 0;
    classes.river_corridor = sample.isLand ? smoothstep(0.86, 0.98, sample.riverWave) * smoothstep(0.35, 0.85, sample.moisture) * (1 - smoothstep(0.82, 1.0, sample.elevation)) : 0;
    classes.lake_basin = sample.isLand ? smoothstep(0.88, 0.975, sample.basin) * smoothstep(0.42, 0.88, sample.moisture) * (1 - smoothstep(0.70, 0.92, sample.elevation)) : 0;
    classes.plateau_field = sample.isLand ? smoothstep(0.48, 0.78, sample.elevation) * smoothstep(0.38, 0.84, sample.pressure) : 0;
    classes.mountain_ridge = sample.isLand ? smoothstep(0.70, 0.94, sample.elevation) * smoothstep(0.46, 0.90, sample.pressure) : 0;
    classes.canyon_fracture = sample.isLand ? smoothstep(0.86, 0.98, sample.canyonWave) * smoothstep(0.52, 0.95, sample.fracture) * (sample.region.id === "west" ? 1 : 0.40) : 0;
    classes.mineral_scar = sample.isLand ? smoothstep(0.72, 0.96, sample.mineral) * smoothstep(0.45, 0.92, sample.pressure) : 0;
    classes.polar_ice = sample.isLand && sample.isPolar ? 1 : smoothstep(0.82, 1.0, Math.abs(sample.point.lat)) * smoothstep(0.70, 0.96, sample.elevation);
    classes.atmospheric_limb = smoothstep(0.68, 1.0, Math.sqrt(sample.point.rr));
    classes.magnetic_core_signal = smoothstep(0.22, 0, Math.sqrt(Math.pow(sample.point.u - 0.5, 2) + Math.pow(sample.point.v - 0.5, 2)));

    var cloudBand = Math.sin((sample.v * 18.0 + sample.u * 4.0) + fbm(sample.u * 3.2, sample.v * 3.2, 2221, 3) * 2.2) * 0.5 + 0.5;
    var cloudNoise = fbm(sample.u * 20.0 + 11.5, sample.v * 13.0 + 8.1, 2301, 4);
    var cloudMask = smoothstep(0.68, 0.91, cloudNoise * 0.70 + cloudBand * 0.30);
    var polarCloud = smoothstep(0.80, 1.0, Math.abs(sample.point.lat)) * 0.25;
    classes.cloud_cover = clamp(cloudMask * 0.46 + polarCloud, 0, 0.72);

    return classes;
  }

  function renderWater(sample, classes) {
    var water = mixColor([3, 18, 37], [9, 63, 103], clamp(sample.broad * 0.72 + sample.shelfNoise * 0.18, 0, 1));
    water = mixColor(water, [36, 126, 156], smoothstep(0.52, 0.92, sample.shelfNoise) * 0.28);
    water = mixColor(water, [62, 146, 138], classes.continental_shelf * 0.48 + classes.shallow_ocean * 0.20);
    water = mixColor(water, [9, 40, 76], classes.rift_ocean * 0.34);
    return water;
  }

  function regionBaseColor(regionId, sample) {
    var palettes = {
      northPole: [[239, 248, 252], [168, 186, 194], [88, 111, 121]],
      north: [[148, 160, 155], [86, 98, 94], [42, 54, 59]],
      mainland: [[122, 154, 86], [76, 112, 66], [164, 137, 82]],
      west: [[137, 119, 91], [83, 76, 66], [35, 42, 48]],
      east: [[137, 181, 116], [72, 127, 80], [28, 66, 68]],
      south: [[133, 154, 86], [72, 108, 62], [34, 54, 46]],
      southPole: [[229, 240, 244], [162, 180, 188], [88, 105, 113]]
    };

    var p = palettes[regionId] || palettes.mainland;
    var c = mixColor(p[1], p[0], smoothstep(0.35, 0.82, sample.elevation));
    c = mixColor(c, p[2], smoothstep(0.70, 0.97, sample.mineral) * 0.32);
    return c;
  }

  function renderLand(sample, classes) {
    var color = regionBaseColor(sample.region.id, sample);

    color = mixColor(color, [39, 66, 56], classes.lowland_plain * 0.10);
    color = mixColor(color, [120, 108, 78], sample.pangaeaMemory * 0.04);
    color = mixColor(color, [199, 179, 121], classes.beach_band * 0.42);
    color = mixColor(color, [92, 82, 69], classes.rocky_coast * 0.36);
    color = mixColor(color, [82, 119, 86], classes.wetland_margin * 0.32);
    color = mixColor(color, [128, 118, 83], classes.plateau_field * 0.22);
    color = mixColor(color, [96, 93, 70], classes.plateau_field * sample.pressure * 0.16);
    color = mixColor(color, [217, 206, 164], classes.mountain_ridge * 0.26);
    color = mixColor(color, [54, 50, 44], classes.mountain_ridge * smoothstep(0.55, 0.95, sample.pressure) * 0.22);
    color = mixColor(color, [60, 96, 65], classes.valley_basin * 0.22);
    color = mixColor(color, [30, 58, 53], classes.valley_basin * smoothstep(0.55, 0.90, sample.moisture) * 0.18);
    color = mixColor(color, [48, 38, 35], classes.canyon_fracture * 0.36);
    color = mixColor(color, [136, 103, 72], classes.canyon_fracture * sample.mineral * 0.18);
    color = mixColor(color, [20, 23, 28], classes.pangaea_fracture_seam * 0.10);
    color = mixColor(color, [35, 112, 139], classes.lake_basin * 0.62);
    color = mixColor(color, [86, 157, 174], classes.lake_basin * classes.plateau_field * 0.30);
    color = mixColor(color, [73, 151, 171], classes.river_corridor * 0.38);
    color = mixColor(color, [168, 218, 225], classes.river_corridor * classes.valley_basin * 0.22);
    color = mixColor(color, [198, 196, 182], classes.mineral_scar * smoothstep(0.56, 0.74, sample.mineral) * 0.10);
    color = mixColor(color, [61, 68, 75], classes.mineral_scar * smoothstep(0.70, 0.90, sample.pressure) * 0.16);
    color = mixColor(color, [164, 98, 61], classes.mineral_scar * smoothstep(0.82, 0.98, sample.mineral) * 0.09);
    color = mixColor(color, [138, 182, 179], classes.mineral_scar * smoothstep(0.92, 1.0, sample.mineral) * 0.07);

    return color;
  }

  function finishPixel(color, sample, classes) {
    color = mixColor(color, [143, 240, 198], classes.magnetic_core_signal * 0.08);
    color = mixColor(color, [242, 199, 111], classes.magnetic_core_signal * sample.pressure * 0.04);

    var highAccess = Math.max(classes.mountain_ridge, classes.polar_ice, classes.plateau_field * 0.55);
    color = mixColor(color, [201, 166, 91], highAccess * 0.035);
    color = mixColor(color, [24, 26, 29], smoothstep(0.44, 0.92, sample.pressure) * 0.10);
    color = mixColor(color, [242, 247, 250], classes.cloud_cover);

    var light = normalize([-0.58, -0.62, 0.64]);
    var lightDot = clamp(dot(sample.point.normal, light), 0, 1);
    color = mixColor([2, 6, 15], color, clamp(0.18 + lightDot * 0.88, 0.06, 1.08));

    var terminatorWarmth = smoothstep(0.16, 0.42, lightDot) * (1 - smoothstep(0.42, 0.82, lightDot));
    color = mixColor(color, [214, 176, 106], terminatorWarmth * 0.055);
    color = mixColor(color, [116, 190, 222], classes.atmospheric_limb * 0.22);

    return color;
  }

  function renderSpherePixel(sample, classes) {
    var color = sample.isLand ? renderLand(sample, classes) : renderWater(sample, classes);
    return finishPixel(color, sample, classes);
  }

  function drawStarField(ctx, size) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.018)";
    ctx.fillRect(0, 0, size, size);

    for (var i = 0; i < 130; i += 1) {
      var x = hash2(i, 10, 91) * size;
      var y = hash2(i, 20, 91) * size;
      var alpha = 0.14 + hash2(i, 30, 91) * 0.50;
      var radius = 0.45 + hash2(i, 40, 91) * 1.22;
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawAtmosphereRim(ctx, cx, cy, r) {
    ctx.save();

    var outer = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.18);
    outer.addColorStop(0, "rgba(145,189,255,0.00)");
    outer.addColorStop(0.52, "rgba(145,189,255,0.16)");
    outer.addColorStop(1, "rgba(145,189,255,0.00)");

    ctx.strokeStyle = outer;
    ctx.lineWidth = r * 0.10;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(174, 220, 244, 0.34)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawSubtleMapLaw(ctx, cx, cy, r) {
    ctx.save();

    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = "rgba(242,199,111,0.22)";
    ctx.lineWidth = 1.15;

    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.94);
    ctx.lineTo(cx, cy + r * 0.94);
    ctx.stroke();

    ctx.globalAlpha = 0.065;
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.48, cy, r * 0.18, r * 0.94, -0.12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + r * 0.48, cy, r * 0.18, r * 0.94, 0.12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function renderSphere(canvas) {
    var size = 760;
    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.345;

    canvas.width = size;
    canvas.height = size;

    var ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    drawStarField(ctx, size);

    var image = ctx.createImageData(size, size);
    var data = image.data;

    for (var py = 0; py < size; py += 1) {
      for (var px = 0; px < size; px += 1) {
        var idx = (py * size + px) * 4;
        var point = projectPoint(px, py, cx, cy, radius);

        if (!point) {
          data[idx + 3] = 0;
          continue;
        }

        var sample = buildSurfaceSample(point);
        var classes = classifySurfacePoint(sample);
        var color = renderSpherePixel(sample, classes);

        data[idx] = clamp(color[0], 0, 255);
        data[idx + 1] = clamp(color[1], 0, 255);
        data[idx + 2] = clamp(color[2], 0, 255);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    drawAtmosphereRim(ctx, cx, cy, radius);
    drawSubtleMapLaw(ctx, cx, cy, radius);
  }

  function buildCanvas() {
    var wrap = el("div", "planet-one-canvas-wrap");
    var canvas = el("canvas", "planet-one-canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Planet 1 with former Pangaea fracture memory and recognition-first terrain");
    wrap.appendChild(canvas);
    renderSphere(canvas);
    return wrap;
  }

  function buildTelemetry() {
    var telemetry = el("div", "planet-one-telemetry");

    [
      "Planet 1",
      "Pangaea fracture memory",
      "Recognition-first",
      "Surface classes",
      "Water / beaches",
      "Mountains / valleys",
      "Canyons / lakes",
      "Tree demo mode"
    ].forEach(function (item) {
      telemetry.appendChild(el("span", "", item));
    });

    return telemetry;
  }

  function buildMapKey() {
    var key = el("div", "planet-one-mapkey");

    [
      ["Former whole", "The land carries memory of one older connected body without closing exact final outlines."],
      ["Broken plates", "Rifts, shelves, bays, and jagged coasts separate the plates into the current world."],
      ["Integrated surface", "Water, beaches, mountains, valleys, canyons, lakes, plateaus, and minerals are blended into one globe."],
      ["No final geography", "Exact shores, countries, cities, rivers, climate, physics, and population totals remain unclosed."]
    ].forEach(function (pair) {
      var row = el("div");
      row.appendChild(el("strong", "", pair[0]));
      row.appendChild(document.createTextNode(pair[1]));
      key.appendChild(row);
    });

    return key;
  }

  function renderPlanetOne(mount, options) {
    if (!mount) {
      throw new Error("DGBPlanetOneRenderTeam.renderPlanetOne requires a mount element.");
    }

    injectStyles();

    var config = options || {};
    var caption = config.caption || "Planet 1 · Nine Summits Universe · Pangaea fracture surface render lane";

    mount.innerHTML = "";
    mount.dataset.renderStatus = "mounted";
    mount.dataset.planetOneRenderActive = "true";
    mount.dataset.planetOneRenderer = RENDERER_PATH;
    mount.dataset.globeDemoStatusRetired = "true";
    mount.dataset.treeDemoMode = "true";
    mount.dataset.renderLanesSeparated = "true";
    mount.dataset.noRenderLaneCollapse = "true";
    mount.dataset.realismPass = "v6-pangaea-fracture-surface-system";
    mount.dataset.recognitionFirstRender = "true";
    mount.dataset.pangaeaFractureMemory = "true";
    mount.dataset.cartoonBlobGlobeRetired = "true";
    mount.dataset.surfaceClasses = SURFACE_CLASSES.join(",");
    mount.dataset.noFinalGeographyClosure = "true";

    var shell = el("div", "planet-one-render-shell");
    var card = el("div", "planet-one-render-card");

    card.appendChild(buildCanvas());
    card.appendChild(el("div", "planet-one-caption", caption));
    card.appendChild(buildTelemetry());
    card.appendChild(buildMapKey());

    shell.appendChild(card);
    mount.appendChild(shell);

    document.documentElement.dataset.planetOneRenderActive = "true";
    document.documentElement.dataset.planetOneRenderer = RENDERER_PATH;
    document.documentElement.dataset.globeDemoStatusRetired = "true";
    document.documentElement.dataset.treeDemoMode = "true";
    document.documentElement.dataset.renderLanesSeparated = "true";
    document.documentElement.dataset.noRenderLaneCollapse = "true";
    document.documentElement.dataset.planetOneRealismPass = "v6-pangaea-fracture-surface-system";
    document.documentElement.dataset.recognitionFirstRender = "true";
    document.documentElement.dataset.pangaeaFractureMemory = "true";
    document.documentElement.dataset.cartoonBlobGlobeRetired = "true";
    document.documentElement.dataset.surfaceFirstRender = "true";
    document.documentElement.dataset.noFinalGeographyClosure = "true";

    return {
      ok: true,
      version: VERSION,
      planetOneRenderActive: true,
      renderer: RENDERER_PATH,
      globeDemoStatusRetired: true,
      treeDemoMode: true,
      renderLanesSeparated: true,
      noRenderLaneCollapse: true,
      realismPass: "v6-pangaea-fracture-surface-system",
      recognitionFirstRender: true,
      pangaeaFractureMemory: true,
      cartoonBlobGlobeRetired: true,
      noFinalGeographyClosure: true,
      surfaceClasses: SURFACE_CLASSES.slice()
    };
  }

  window.DGBPlanetOneRenderTeam = {
    version: VERSION,
    render: renderPlanetOne,
    renderPlanetOne: renderPlanetOne
  };
})();
