/*
  PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY
  OWNER=SEAN
  TARGET=/world/render/planet-one.render.js
  PURPOSE=ADD_AXIS_ROTATION_AND_CLIMATE_TOPOLOGY_LOGIC_TO_PLANET_ONE_RENDER
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

  PLANET ONE LAW:
  Earth-equivalent mirror-world.
  Not ordinary Earth.
  Not decorative fantasy.
  Not flat map.
  Ancient mineral-rich pressure ecology.
  Seven-landmass law remains structural, not diagrammatic.
  Pangaea fracture memory is present without closing exact final geography.
  Exact countries, cities, named rivers, named climates, physics constants, and population total are not closed here.

  VISUAL CONTRACT:
  no-generated-graphic=true
  no-external-image=true
  code-render-only=true
  planet-one-realism-pass=v8-axis-spin-climate-topology
  axis-spin-active=true
  climate-topology-active=true
  weather-circulation-active=true
  ocean-current-logic-active=true
  pangaea-fracture-memory=true
  jagged-living-shorelines=true
  plateau-heavy-interior=true
  cinematic-mirror-earth-world=true
  no-final-geography-closure=true
*/

(function () {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY";
  var RENDERER_PATH = "/world/render/planet-one.render.js";
  var STYLE_ID = "planet-one-render-team-style-v8-axis-spin-climate-topology";
  var ACTIVE = [];

  var SURFACE_CLASSES = [
    "deep_ocean",
    "shallow_ocean",
    "continental_shelf",
    "beach_band",
    "rocky_coast",
    "wetland_margin",
    "lowland_plain",
    "valley_basin",
    "river_corridor",
    "lake_basin",
    "plateau_field",
    "mountain_ridge",
    "canyon_fracture",
    "mineral_scar",
    "polar_ice",
    "tundra_belt",
    "boreal_belt",
    "temperate_belt",
    "humid_basin",
    "dry_plateau",
    "rain_shadow",
    "cloud_cover",
    "weather_circulation",
    "ocean_current",
    "atmospheric_limb",
    "magnetic_core_signal",
    "pangaea_fracture_seam"
  ];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .planet-one-render-shell {
        display: grid;
        justify-items: center;
        gap: 16px;
        width: 100%;
      }

      .planet-one-render-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: min(540px, 88vw);
        aspect-ratio: 1;
        border-radius: 50%;
        isolation: isolate;
      }

      .planet-one-render-canvas {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        filter:
          drop-shadow(0 34px 56px rgba(0, 0, 0, 0.84))
          drop-shadow(0 0 34px rgba(112, 171, 255, 0.16));
      }

      .planet-one-axis-overlay {
        position: absolute;
        inset: -7%;
        width: 114%;
        height: 114%;
        pointer-events: none;
        z-index: 3;
      }

      .planet-one-axis-overlay line {
        stroke: rgba(242, 199, 111, 0.28);
        stroke-width: 1.25;
        stroke-linecap: round;
      }

      .planet-one-axis-overlay circle {
        fill: rgba(242, 199, 111, 0.28);
      }

      .planet-one-axis-overlay ellipse {
        fill: none;
        stroke: rgba(145, 189, 255, 0.10);
        stroke-width: 0.8;
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

      .planet-one-hidden-receipt {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
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
    return [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t),
      mix(a[2], b[2], t)
    ];
  }

  function normalize(v) {
    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function rotateX(v, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
  }

  function rotateY(v, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  }

  function hash2(ix, iy, seed) {
    var n = (ix * 374761393 + iy * 668265263 + seed * 1442695041) | 0;
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
      value += valueNoise(x * freq, y * freq, seed + i * 103) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.04;
    }

    return value / (norm || 1);
  }

  function rotate2(x, y, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return { x: x * c - y * s, y: x * s + y * c };
  }

  function continentLobe(u, v, cx, cy, rx, ry, rot, seed) {
    var p = rotate2(u - cx, v - cy, -rot);
    var nx = p.x / rx;
    var ny = p.y / ry;
    var d = Math.sqrt(nx * nx + ny * ny);
    var a = Math.atan2(ny, nx);

    var edge =
      Math.sin(a * 3 + seed * 0.017) * 0.10 +
      Math.sin(a * 5 - seed * 0.013) * 0.07 +
      Math.sin(a * 8 + seed * 0.019) * 0.04;

    var jag =
      (fbm(u * 23 + seed * 0.03, v * 23 - seed * 0.02, seed, 4) - 0.5) * 0.20 +
      (fbm(u * 61 - seed * 0.01, v * 58 + seed * 0.01, seed + 700, 3) - 0.5) * 0.06;

    return 1 - d + edge + jag;
  }

  function regionField(u, v) {
    var groups = [
      {
        id: "mainland",
        lobes: [
          [0.50, 0.53, 0.22, 0.20, 0.12, 101],
          [0.42, 0.42, 0.15, 0.12, -0.35, 102],
          [0.60, 0.60, 0.16, 0.14, 0.38, 103],
          [0.50, 0.69, 0.16, 0.09, -0.08, 104]
        ]
      },
      {
        id: "west",
        lobes: [
          [0.25, 0.51, 0.11, 0.22, -0.36, 201],
          [0.20, 0.36, 0.09, 0.11, -0.10, 202],
          [0.32, 0.66, 0.08, 0.10, 0.14, 203]
        ]
      },
      {
        id: "east",
        lobes: [
          [0.75, 0.50, 0.13, 0.22, 0.34, 301],
          [0.81, 0.35, 0.08, 0.11, 0.16, 302],
          [0.66, 0.65, 0.09, 0.11, -0.16, 303]
        ]
      },
      {
        id: "north",
        lobes: [
          [0.50, 0.25, 0.23, 0.10, -0.04, 401],
          [0.37, 0.29, 0.10, 0.07, 0.22, 402],
          [0.63, 0.23, 0.11, 0.07, -0.17, 403]
        ]
      },
      {
        id: "south",
        lobes: [
          [0.50, 0.76, 0.23, 0.10, 0.04, 501],
          [0.36, 0.73, 0.10, 0.07, -0.19, 502],
          [0.64, 0.79, 0.10, 0.07, 0.18, 503]
        ]
      },
      {
        id: "northPole",
        lobes: [
          [0.50, 0.075, 0.29, 0.05, 0.01, 601],
          [0.34, 0.095, 0.08, 0.035, -0.09, 602],
          [0.66, 0.085, 0.10, 0.035, 0.11, 603]
        ]
      },
      {
        id: "southPole",
        lobes: [
          [0.50, 0.925, 0.30, 0.05, -0.01, 701],
          [0.35, 0.905, 0.09, 0.035, 0.09, 702],
          [0.65, 0.92, 0.11, 0.035, -0.11, 703]
        ]
      }
    ];

    var best = { id: "ocean", value: -99 };
    var second = { id: "ocean", value: -99 };

    groups.forEach(function (group) {
      var value = -99;

      group.lobes.forEach(function (lobe) {
        value = Math.max(value, continentLobe(u, v, lobe[0], lobe[1], lobe[2], lobe[3], lobe[4], lobe[5]));
      });

      if (value > best.value) {
        second = best;
        best = { id: group.id, value: value };
      } else if (value > second.value) {
        second = { id: group.id, value: value };
      }
    });

    return {
      id: best.id,
      value: best.value,
      secondId: second.id,
      secondValue: second.value
    };
  }

  function fractureField(u, v) {
    var horizontal =
      1 - smoothstep(0.008, 0.034, Math.abs((v - 0.50) + Math.sin((u - 0.5) * 10.8) * 0.040));
    var lower =
      1 - smoothstep(0.008, 0.030, Math.abs((v - 0.66) - Math.sin((u - 0.45) * 9.0) * 0.030));
    var vertical =
      1 - smoothstep(0.008, 0.031, Math.abs((u - 0.50) + Math.sin((v - 0.52) * 8.4) * 0.032));

    return clamp(Math.max(horizontal * 0.90, lower * 0.72, vertical * 0.72), 0, 1);
  }

  function pangaeaMemory(u, v) {
    var d = Math.hypot((u - 0.5) / 0.43, (v - 0.53) / 0.44);
    return clamp(smoothstep(1.22, 0.32, d) * (0.72 + fbm(u * 5.5, v * 5.2, 909, 4) * 0.28), 0, 1);
  }

  function classifyClimateAndTopology(u, v) {
    var region = regionField(u, v);
    var memory = pangaeaMemory(u, v);
    var fracture = fractureField(u, v);

    var broad = fbm(u * 2.2 + 0.2, v * 2.6 + 1.4, 810, 5);
    var coastNoise = fbm(u * 12.5 + 7.2, v * 13.8 + 2.9, 811, 4);
    var elevationBase = fbm(u * 6.2 + 3.8, v * 6.8 + 1.5, 812, 5);
    var elevationDetail = fbm(u * 22.0 + 4.1, v * 24.0 + 8.8, 813, 4);
    var moistureBase = fbm(u * 5.4 + 6.0, v * 5.1 + 4.0, 814, 4);
    var moistureDetail = fbm(u * 18.0 + 2.0, v * 19.0 + 9.0, 815, 3);
    var mineral = fbm(u * 20.0 + 5.0, v * 17.0 + 3.0, 816, 4);
    var basin = fbm(u * 10.5 + 8.0, v * 11.5 + 1.0, 817, 4);
    var ridgeNoise = fbm(u * 30.0 + 6.5, v * 14.0 + 2.8, 818, 4);

    var coastlineRag = (coastNoise - 0.5) * 0.18 + (broad - 0.5) * 0.08;
    var landScore = region.value + coastlineRag + memory * 0.04 - fracture * 0.30;
    var threshold = region.id === "northPole" || region.id === "southPole" ? 0.035 : 0.065;
    var margin = landScore - threshold;
    var isLand = margin > 0;

    var latitudeFromEquator = Math.abs(v * 2 - 1);
    var equatorial = 1 - smoothstep(0.00, 0.24, latitudeFromEquator);
    var tropic = 1 - smoothstep(0.18, 0.42, Math.abs(latitudeFromEquator - 0.42));
    var temperate = 1 - smoothstep(0.22, 0.58, Math.abs(latitudeFromEquator - 0.62));
    var polar = smoothstep(0.70, 1.00, latitudeFromEquator);

    var coastalMoisture = 1 - smoothstep(0.01, 0.22, Math.abs(margin));
    var oceanCurrent = 0.5 + 0.5 * Math.sin(u * Math.PI * 4.0 + v * Math.PI * 2.0 + fbm(u * 3, v * 3, 825, 3));
    var mountain = smoothstep(0.66, 0.91, ridgeNoise) * smoothstep(0.38, 0.92, broad);
    var plateau = smoothstep(0.47, 0.80, elevationBase) * smoothstep(0.32, 0.88, broad);
    var elevation = clamp(elevationBase * 0.50 + elevationDetail * 0.16 + mountain * 0.38 + plateau * 0.25 - coastalMoisture * 0.08, 0, 1);

    var rainShadow = mountain * smoothstep(0.38, 0.82, u) * (region.id === "west" || region.id === "mainland" ? 1 : 0.45);
    var humidity = clamp(moistureBase * 0.60 + moistureDetail * 0.18 + coastalMoisture * 0.25 + oceanCurrent * 0.08 - rainShadow * 0.24, 0, 1);
    var temperature = clamp(1 - polar * 1.05 - elevation * 0.50 + equatorial * 0.15, 0, 1);

    var desert = tropic * smoothstep(0.45, 0.86, 1 - humidity) * (1 - smoothstep(0.72, 0.95, elevation));
    var tropicalForest = equatorial * smoothstep(0.50, 0.88, humidity) * (1 - smoothstep(0.76, 0.96, elevation));
    var temperateGreen = temperate * smoothstep(0.35, 0.84, humidity) * (1 - desert * 0.8);
    var steppe = temperate * smoothstep(0.34, 0.74, 1 - humidity) * (1 - desert * 0.5);
    var boreal = smoothstep(0.55, 0.83, latitudeFromEquator) * smoothstep(0.25, 0.82, humidity) * (1 - polar * 0.35);
    var tundra = polar * (1 - smoothstep(0.45, 0.82, temperature));
    var snow = smoothstep(0.78, 1.0, polar + elevation * 0.42);

    var river =
      isLand
        ? smoothstep(0.90, 0.985, 1 - Math.abs(Math.sin((u * 17 + v * 9) + moistureDetail * 2.5))) *
          smoothstep(0.43, 0.86, humidity) *
          (1 - smoothstep(0.80, 0.98, elevation))
        : 0;

    var lake =
      isLand
        ? smoothstep(0.85, 0.975, basin) *
          smoothstep(0.40, 0.86, humidity) *
          (1 - smoothstep(0.72, 0.95, elevation))
        : 0;

    var beach =
      isLand
        ? smoothstep(-0.025, 0.025, margin) * (1 - smoothstep(0.055, 0.15, margin))
        : 0;

    var shelf =
      !isLand
        ? smoothstep(-0.20, -0.025, margin) * (1 - smoothstep(0.02, 0.16, margin))
        : 0;

    var cloudNoise = fbm(u * 8.0 + 1.0, v * 7.5 + 4.0, 910, 4);
    var stormTrack =
      temperate * 0.36 +
      equatorial * 0.46 +
      polar * 0.16 +
      coastalMoisture * 0.14 -
      desert * 0.20;

    var clouds = clamp(smoothstep(0.54, 0.86, cloudNoise + stormTrack * 0.32), 0, 0.78);

    return {
      isLand: isLand,
      region: region,
      margin: margin,
      memory: memory,
      fracture: fracture,
      broad: broad,
      elevation: elevation,
      mountain: mountain,
      plateau: plateau,
      mineral: mineral,
      humidity: humidity,
      temperature: temperature,
      oceanCurrent: oceanCurrent,
      rainShadow: rainShadow,
      desert: desert,
      tropicalForest: tropicalForest,
      temperateGreen: temperateGreen,
      steppe: steppe,
      boreal: boreal,
      tundra: tundra,
      snow: snow,
      river: river,
      lake: lake,
      beach: beach,
      shelf: shelf,
      clouds: clouds
    };
  }

  function colorForClimate(s) {
    if (!s.isLand) {
      var deep = mixColor([4, 17, 40], [8, 62, 108], smoothstep(-0.48, -0.06, s.margin));
      deep = mixColor(deep, [32, 124, 148], s.shelf * 0.64);
      deep = mixColor(deep, [9, 39, 79], s.fracture * 0.30);
      deep = mixColor(deep, [18, 84, 120], s.oceanCurrent * 0.13);
      return deep;
    }

    var color = [90, 116, 76];

    color = mixColor(color, [39, 105, 60], s.tropicalForest * 0.92);
    color = mixColor(color, [86, 132, 72], s.temperateGreen * 0.84);
    color = mixColor(color, [74, 102, 72], s.boreal * 0.74);
    color = mixColor(color, [142, 146, 88], s.steppe * 0.72);
    color = mixColor(color, [176, 150, 96], s.desert * 0.96);
    color = mixColor(color, [126, 120, 86], s.plateau * 0.44);
    color = mixColor(color, [108, 98, 84], s.mountain * 0.54);
    color = mixColor(color, [76, 58, 50], s.rainShadow * 0.24);
    color = mixColor(color, [202, 188, 145], s.beach * 0.78);
    color = mixColor(color, [74, 150, 174], s.river * 0.64);
    color = mixColor(color, [55, 122, 160], s.lake * 0.86);
    color = mixColor(color, [168, 162, 146], smoothstep(0.72, 0.96, s.mineral) * 0.16);
    color = mixColor(color, [182, 188, 180], s.tundra * 0.66);
    color = mixColor(color, [234, 242, 246], s.snow);

    if (s.region.id === "northPole" || s.region.id === "southPole") {
      color = mixColor(color, [238, 246, 250], 0.86);
    }

    color = mixColor(color, [38, 38, 42], s.fracture * 0.10);
    return color;
  }

  function buildTexture(width, height) {
    var surface = new Uint8ClampedArray(width * height * 4);
    var cloud = new Uint8ClampedArray(width * height * 4);

    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        var u = x / (width - 1);
        var v = y / (height - 1);
        var sample = classifyClimateAndTopology(u, v);
        var color = colorForClimate(sample);

        var idx = (y * width + x) * 4;

        surface[idx] = Math.round(clamp(color[0], 0, 255));
        surface[idx + 1] = Math.round(clamp(color[1], 0, 255));
        surface[idx + 2] = Math.round(clamp(color[2], 0, 255));
        surface[idx + 3] = 255;

        var coldCloud = sample.temperature < 0.35 ? [226, 234, 240] : [241, 246, 248];
        cloud[idx] = coldCloud[0];
        cloud[idx + 1] = coldCloud[1];
        cloud[idx + 2] = coldCloud[2];
        cloud[idx + 3] = Math.round(sample.clouds * 255);
      }
    }

    return {
      width: width,
      height: height,
      surface: surface,
      cloud: cloud
    };
  }

  function sampleTexture(texture, u, v, layer) {
    u = u - Math.floor(u);
    v = clamp(v, 0, 1);

    var x = Math.floor(u * (texture.width - 1));
    var y = Math.floor(v * (texture.height - 1));
    var idx = (y * texture.width + x) * 4;
    var data = layer === "cloud" ? texture.cloud : texture.surface;

    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  }

  function drawStarField(ctx, size) {
    ctx.clearRect(0, 0, size, size);

    var bg = ctx.createRadialGradient(size * 0.54, size * 0.46, size * 0.04, size * 0.54, size * 0.46, size * 0.54);
    bg.addColorStop(0, "rgba(92, 139, 210, 0.11)");
    bg.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    for (var i = 0; i < 110; i += 1) {
      var x = hash2(i, 11, 41) * size;
      var y = hash2(i, 29, 41) * size;
      var r = 0.4 + hash2(i, 53, 41) * 1.2;
      var a = 0.10 + hash2(i, 67, 41) * 0.40;
      ctx.fillStyle = "rgba(255,255,255," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawAxis(axis, tiltDeg) {
    axis.setAttribute("viewBox", "0 0 100 100");

    var tilt = tiltDeg * Math.PI / 180;
    var len = 43;
    var cx = 50;
    var cy = 50;
    var dx = Math.sin(tilt) * len;
    var dy = Math.cos(tilt) * len;

    axis.innerHTML = [
      '<ellipse cx="50" cy="50" rx="35" ry="7"></ellipse>',
      '<line x1="' + (cx - dx).toFixed(2) + '" y1="' + (cy + dy).toFixed(2) + '" x2="' + (cx + dx).toFixed(2) + '" y2="' + (cy - dy).toFixed(2) + '"></line>',
      '<circle cx="' + (cx - dx).toFixed(2) + '" cy="' + (cy + dy).toFixed(2) + '" r="1.45"></circle>',
      '<circle cx="' + (cx + dx).toFixed(2) + '" cy="' + (cy - dy).toFixed(2) + '" r="1.45"></circle>'
    ].join("");
  }

  function PlanetOneRenderer(canvas, axis, texture) {
    this.canvas = canvas;
    this.axis = axis;
    this.texture = texture;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.raf = 0;
    this.last = 0;
    this.spin = 0;
    this.cloudSpin = 0;
    this.tilt = 23.5 * Math.PI / 180;
    this.spinSpeed = 0.105;
    this.cloudSpeed = 0.036;
    this.size = 0;
    this.radius = 0;
    this.center = 0;

    drawAxis(this.axis, 23.5);
    this.resize();
  }

  PlanetOneRenderer.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var dpr = clamp(window.devicePixelRatio || 1, 1, 1.5);
    var cssSize = Math.max(300, Math.min(520, Math.floor(Math.min(rect.width || 430, rect.height || 430))));
    this.size = Math.floor(cssSize * dpr);
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.center = this.size / 2;
    this.radius = this.size * 0.405;
    this.draw();
  };

  PlanetOneRenderer.prototype.draw = function () {
    var ctx = this.ctx;
    var size = this.size;
    var cx = this.center;
    var cy = this.center;
    var r = this.radius;

    if (!ctx || !size) return;

    drawStarField(ctx, size);

    var image = ctx.createImageData(size, size);
    var data = image.data;
    var light = normalize([-0.66, -0.34, 0.68]);

    for (var py = 0; py < size; py += 1) {
      for (var px = 0; px < size; px += 1) {
        var dx = (px - cx) / r;
        var dy = (py - cy) / r;
        var rr = dx * dx + dy * dy;
        var idx = (py * size + px) * 4;

        if (rr > 1) {
          data[idx + 3] = 0;
          continue;
        }

        var z = Math.sqrt(1 - rr);
        var screenNormal = normalize([dx, dy, z]);

        var world = rotateX(screenNormal, -this.tilt);
        world = rotateY(world, this.spin);

        var lon = Math.atan2(world[0], world[2]);
        var lat = Math.asin(clamp(world[1], -1, 1));

        var u = lon / (Math.PI * 2) + 0.5;
        var v = 0.5 - lat / Math.PI;

        var surface = sampleTexture(this.texture, u, v, "surface");
        var cloud = sampleTexture(this.texture, u + this.cloudSpin / (Math.PI * 2), v, "cloud");

        var lightDot = clamp(dot(screenNormal, light), 0, 1);
        var limb = smoothstep(0.62, 1.0, Math.sqrt(rr));
        var shade = clamp(0.20 + lightDot * 0.92, 0, 1.08);

        var color = [surface[0] * shade, surface[1] * shade, surface[2] * shade];

        var cloudAlpha = (cloud[3] / 255) * (0.42 + lightDot * 0.34);
        color = mixColor(color, [cloud[0], cloud[1], cloud[2]], cloudAlpha);

        color = mixColor([4, 8, 16], color, clamp(0.15 + lightDot * 0.96, 0, 1));
        color = mixColor(color, [110, 174, 234], limb * 0.24);

        data[idx] = Math.round(clamp(color[0], 0, 255));
        data[idx + 1] = Math.round(clamp(color[1], 0, 255));
        data[idx + 2] = Math.round(clamp(color[2], 0, 255));
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    var outer = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.13);
    outer.addColorStop(0, "rgba(110,170,255,0)");
    outer.addColorStop(0.56, "rgba(110,170,255,0.16)");
    outer.addColorStop(1, "rgba(110,170,255,0)");

    ctx.save();
    ctx.strokeStyle = outer;
    ctx.lineWidth = r * 0.105;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.012, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(180,220,245,0.30)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  PlanetOneRenderer.prototype.tick = function (time) {
    if (!this.last) this.last = time;
    var dt = Math.min(0.05, (time - this.last) / 1000);
    this.last = time;

    this.spin += this.spinSpeed * dt;
    this.cloudSpin += this.cloudSpeed * dt;

    this.draw();
    this.raf = window.requestAnimationFrame(this.tick.bind(this));
  };

  PlanetOneRenderer.prototype.start = function () {
    if (this.raf) return;
    this.last = 0;
    this.raf = window.requestAnimationFrame(this.tick.bind(this));
  };

  PlanetOneRenderer.prototype.stop = function () {
    if (this.raf) window.cancelAnimationFrame(this.raf);
    this.raf = 0;
  };

  PlanetOneRenderer.prototype.destroy = function () {
    this.stop();
  };

  function applyContractData(mount) {
    mount.dataset.renderStatus = "mounted";
    mount.dataset.planetOneRenderActive = "true";
    mount.dataset.planetOneRenderer = RENDERER_PATH;
    mount.dataset.globeDemoStatusRetired = "true";
    mount.dataset.treeDemoMode = "true";
    mount.dataset.renderLanesSeparated = "true";
    mount.dataset.noRenderLaneCollapse = "true";
    mount.dataset.realismPass = "v8-axis-spin-climate-topology";
    mount.dataset.recognitionFirstRender = "true";
    mount.dataset.pangaeaFractureMemory = "true";
    mount.dataset.cinematicMirrorEarthWorld = "true";
    mount.dataset.jaggedLivingShorelines = "true";
    mount.dataset.plateauHeavyInterior = "true";
    mount.dataset.axisSpinActive = "true";
    mount.dataset.climateTopologyActive = "true";
    mount.dataset.weatherCirculationActive = "true";
    mount.dataset.oceanCurrentLogicActive = "true";
    mount.dataset.cartoonBlobGlobeRetired = "true";
    mount.dataset.noFinalGeographyClosure = "true";
    mount.dataset.surfaceClasses = SURFACE_CLASSES.join(",");

    document.documentElement.dataset.planetOneRenderActive = "true";
    document.documentElement.dataset.planetOneRenderer = RENDERER_PATH;
    document.documentElement.dataset.globeDemoStatusRetired = "true";
    document.documentElement.dataset.treeDemoMode = "true";
    document.documentElement.dataset.renderLanesSeparated = "true";
    document.documentElement.dataset.noRenderLaneCollapse = "true";
    document.documentElement.dataset.planetOneRealismPass = "v8-axis-spin-climate-topology";
    document.documentElement.dataset.axisSpinActive = "true";
    document.documentElement.dataset.climateTopologyActive = "true";
    document.documentElement.dataset.weatherCirculationActive = "true";
    document.documentElement.dataset.oceanCurrentLogicActive = "true";
    document.documentElement.dataset.pangaeaFractureMemory = "true";
    document.documentElement.dataset.cinematicMirrorEarthWorld = "true";
    document.documentElement.dataset.jaggedLivingShorelines = "true";
    document.documentElement.dataset.plateauHeavyInterior = "true";
    document.documentElement.dataset.noFinalGeographyClosure = "true";
  }

  function buildTelemetry() {
    var telemetry = el("div", "planet-one-telemetry");

    [
      "Planet 1",
      "Axis spin",
      "Climate topology",
      "Weather circulation",
      "Ocean currents",
      "Plateau interiors",
      "Pangaea fracture",
      "Tree demo mode"
    ].forEach(function (item) {
      telemetry.appendChild(el("span", "", item));
    });

    return telemetry;
  }

  function buildMapKey() {
    var key = el("div", "planet-one-mapkey");

    [
      ["Axis", "The globe now has a visible tilted axis and slow rotation."],
      ["Climate", "Color is driven by latitude, elevation, humidity, ocean proximity, and rain shadow."],
      ["Topology", "Mountains, plateaus, basins, lakes, rivers, beaches, shelves, and polar regions are integrated."],
      ["No false close", "Exact countries, cities, rivers, climate names, physics, and final map geometry remain unclosed."]
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
    applyContractData(mount);

    ACTIVE = ACTIVE.filter(function (entry) {
      if (entry.mount === mount) {
        entry.destroy();
        return false;
      }
      return true;
    });

    mount.innerHTML = "";

    var shell = el("div", "planet-one-render-shell");
    var stage = el("div", "planet-one-render-stage");

    var canvas = el("canvas", "planet-one-render-canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Planet 1 rotating on a tilted axis with climate-aware terrain, oceans, shorelines, mountains, plateaus, and weather."
    );

    var axis = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    axis.setAttribute("class", "planet-one-axis-overlay");
    axis.setAttribute("aria-hidden", "true");

    var receipt = el("div", "planet-one-hidden-receipt");
    receipt.textContent =
      "PLANET_ONE_RENDER_TEAM_TNT_v1 " +
      "PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY " +
      "planet-one-render-active=true " +
      "planet-one-renderer=/world/render/planet-one.render.js " +
      "globe-demo-status-retired=true " +
      "tree-demo-mode=true " +
      "render-lanes-separated=true " +
      "no-render-lane-collapse=true " +
      "axis-spin-active=true " +
      "climate-topology-active=true " +
      "weather-circulation-active=true " +
      "ocean-current-logic-active=true";

    stage.appendChild(canvas);
    stage.appendChild(axis);
    stage.appendChild(receipt);

    var caption = el(
      "div",
      "planet-one-caption",
      (options && options.caption) || "Planet 1 · Nine Summits Universe · axis-spin climate topology render lane"
    );

    shell.appendChild(stage);
    shell.appendChild(caption);
    shell.appendChild(buildTelemetry());
    shell.appendChild(buildMapKey());
    mount.appendChild(shell);

    var texture = buildTexture(1024, 512);
    var renderer = new PlanetOneRenderer(canvas, axis, texture);
    renderer.start();

    var onResize = function () {
      renderer.resize();
    };

    window.addEventListener("resize", onResize, { passive: true });

    var handle = {
      mount: mount,
      renderer: renderer,
      destroy: function () {
        window.removeEventListener("resize", onResize);
        renderer.destroy();
      },
      start: function () {
        renderer.start();
      },
      stop: function () {
        renderer.stop();
      },
      version: VERSION
    };

    ACTIVE.push(handle);

    return {
      ok: true,
      version: VERSION,
      renderer: RENDERER_PATH,
      planetOneRenderActive: true,
      globeDemoStatusRetired: true,
      treeDemoMode: true,
      renderLanesSeparated: true,
      noRenderLaneCollapse: true,
      realismPass: "v8-axis-spin-climate-topology",
      axisSpinActive: true,
      climateTopologyActive: true,
      weatherCirculationActive: true,
      oceanCurrentLogicActive: true,
      pangaeaFractureMemory: true,
      cinematicMirrorEarthWorld: true,
      jaggedLivingShorelines: true,
      plateauHeavyInterior: true,
      noFinalGeographyClosure: true,
      surfaceClasses: SURFACE_CLASSES.slice(),
      handle: handle
    };
  }

  window.DGBPlanetOneRenderTeam = {
    version: VERSION,
    render: renderPlanetOne,
    renderPlanetOne: renderPlanetOne,
    stopAll: function () {
      ACTIVE.forEach(function (entry) {
        entry.destroy();
      });
      ACTIVE = [];
    }
  };
})();
