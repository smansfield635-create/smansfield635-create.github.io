/*
  PLANET_ONE_RENDER_TEAM_TNT_v4_PSALM_SURFACE_REALISM
  OWNER=SEAN
  TARGET=/world/render/planet-one.render.js
  PURPOSE=REPLACE_DIAGRAMMATIC_PLANET_RENDER_WITH_SURFACE_FIRST_REAL_PLANET_RENDER
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
  Found desolate and restored through a half-natural / half-man-made floating magnetic core.
  Seven-landmass law remains structural, not diagrammatic.
  Exact continent outlines, countries, climate bands, river systems, cities, physics, and population total are not closed here.

  VISUAL CONTRACT:
  no-generated-graphic=true
  no-external-image=true
  planet-one-realism-pass=v4-psalm-surface-realism
  cartoon-blob-globe-retired=true
  surface-first-render=true
*/

(function () {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_TEAM_TNT_v4_PSALM_SURFACE_REALISM";
  var RENDERER_PATH = "/world/render/planet-one.render.js";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-team-style-v4")) return;

    var style = document.createElement("style");
    style.id = "planet-one-render-team-style-v4";
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
        width: min(640px, 100%);
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
        width: min(520px, 86vw);
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
        max-width: 820px;
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
        max-width: 860px;
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
        width: min(720px, 100%);
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
    return [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t),
      mix(a[2], b[2], t)
    ];
  }

  function rgba(c, alpha) {
    return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + alpha + ")";
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

  function regionInfluence(u, v) {
    var regions = [
      { id: "northPole", cx: 0.50, cy: 0.075, rx: 0.52, ry: 0.090, weight: 1.00 },
      { id: "north", cx: 0.50, cy: 0.245, rx: 0.48, ry: 0.145, weight: 0.92 },
      { id: "mainland", cx: 0.50, cy: 0.505, rx: 0.44, ry: 0.255, weight: 1.00 },
      { id: "west", cx: 0.245, cy: 0.505, rx: 0.245, ry: 0.255, weight: 0.92 },
      { id: "east", cx: 0.755, cy: 0.505, rx: 0.245, ry: 0.255, weight: 0.92 },
      { id: "south", cx: 0.50, cy: 0.745, rx: 0.43, ry: 0.160, weight: 0.90 },
      { id: "southPole", cx: 0.50, cy: 0.925, rx: 0.49, ry: 0.090, weight: 0.96 }
    ];

    var best = {
      id: "ocean",
      value: 0
    };

    regions.forEach(function (r) {
      var dx = (u - r.cx) / r.rx;
      var dy = (v - r.cy) / r.ry;
      var base = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
      var value = Math.pow(base, 0.72) * r.weight;

      if (value > best.value) {
        best = {
          id: r.id,
          value: value
        };
      }
    });

    return best;
  }

  function paletteFor(regionId, elevation, mineralNoise) {
    var palettes = {
      northPole: [[238, 247, 251], [166, 185, 194], [89, 111, 122]],
      north: [[149, 160, 155], [86, 98, 94], [42, 54, 59]],
      mainland: [[119, 151, 83], [78, 111, 65], [166, 139, 82]],
      west: [[137, 119, 91], [83, 76, 66], [35, 42, 48]],
      east: [[135, 178, 115], [70, 126, 79], [28, 66, 68]],
      south: [[131, 151, 84], [72, 107, 62], [34, 54, 46]],
      southPole: [[230, 240, 244], [162, 180, 188], [88, 105, 113]]
    };

    var p = palettes[regionId] || palettes.mainland;
    var lowMid = mixColor(p[1], p[0], smoothstep(0.38, 0.86, elevation));
    var mineral = mixColor(lowMid, p[2], smoothstep(0.62, 0.95, mineralNoise) * 0.35);

    return mineral;
  }

  function drawStarField(ctx, size) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(0, 0, size, size);

    for (var i = 0; i < 120; i += 1) {
      var x = hash2(i, 10, 91) * size;
      var y = hash2(i, 20, 91) * size;
      var a = 0.16 + hash2(i, 30, 91) * 0.52;
      var r = 0.45 + hash2(i, 40, 91) * 1.25;
      ctx.fillStyle = "rgba(255,255,255," + a + ")";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function renderPlanetSurface(canvas) {
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

    var light = normalize([-0.58, -0.62, 0.64]);
    var ambient = 0.18;

    for (var py = 0; py < size; py += 1) {
      for (var px = 0; px < size; px += 1) {
        var dx = (px - cx) / radius;
        var dy = (py - cy) / radius;
        var rr = dx * dx + dy * dy;
        var idx = (py * size + px) * 4;

        if (rr > 1) {
          data[idx + 3] = 0;
          continue;
        }

        var z = Math.sqrt(1 - rr);
        var normal = normalize([dx, dy, z]);
        var lightDot = clamp(dot(normal, light), 0, 1);
        var shade = ambient + lightDot * 0.88;

        var lon = Math.atan2(dx, z) / Math.PI;
        var lat = Math.asin(-dy) / (Math.PI / 2);
        var u = lon * 0.5 + 0.5;
        var v = lat * -0.5 + 0.5;

        var broad = fbm(u * 2.3 + 1.7, v * 3.2 - 0.6, 401, 5);
        var shelfNoise = fbm(u * 7.0 + 3.1, v * 7.6 + 5.2, 771, 4);
        var elevation = fbm(u * 15.0 + 9.5, v * 17.0 + 1.5, 1001, 5);
        var mineral = fbm(u * 33.0 + 2.3, v * 31.0 + 7.7, 1401, 4);
        var pressure = fbm(u * 4.8 + Math.sin(v * 6.2), v * 6.0 + Math.cos(u * 5.8), 1701, 4);

        var influence = regionInfluence(u, v);
        var coastlineRaggedness = (shelfNoise - 0.5) * 0.34 + (broad - 0.5) * 0.24;
        var landScore = influence.value + coastlineRaggedness + pressure * 0.10;
        var isPolar = influence.id === "northPole" || influence.id === "southPole";
        var landThreshold = isPolar ? 0.34 : 0.42;
        var shelf = smoothstep(landThreshold - 0.12, landThreshold + 0.02, landScore);
        var isLand = landScore > landThreshold;

        var oceanDeep = [3, 20, 39];
        var oceanMid = [10, 65, 103];
        var oceanLit = [37, 128, 158];
        var oceanShelf = [58, 142, 135];

        var color = mixColor(oceanDeep, oceanMid, clamp(broad * 0.78 + lightDot * 0.22, 0, 1));
        color = mixColor(color, oceanLit, smoothstep(0.46, 0.92, shelfNoise) * 0.36);

        if (!isLand && shelf > 0.08) {
          color = mixColor(color, oceanShelf, shelf * 0.38);
        }

        if (isLand) {
          var landColor = paletteFor(influence.id, elevation, mineral);

          var ridge = smoothstep(0.62, 0.92, elevation) * smoothstep(0.36, 0.88, pressure);
          var valley = smoothstep(0.16, 0.42, elevation);
          landColor = mixColor(landColor, [218, 202, 152], ridge * 0.25);
          landColor = mixColor(landColor, [39, 67, 56], (1 - valley) * 0.12);

          var snowLine = 0;
          if (isPolar) snowLine = 0.62;
          else if (influence.id === "north") snowLine = smoothstep(0.72, 0.96, elevation) * 0.38;
          else if (influence.id === "west") snowLine = smoothstep(0.82, 0.99, elevation) * 0.14;

          landColor = mixColor(landColor, [235, 243, 247], snowLine);

          var coastFade = smoothstep(landThreshold, landThreshold + 0.10, landScore);
          color = mixColor(color, landColor, coastFade);
        }

        var cloudBand =
          Math.sin((v * 18.0 + u * 4.0) + fbm(u * 3.2, v * 3.2, 2221, 3) * 2.2) * 0.5 + 0.5;
        var cloudNoise = fbm(u * 20.0 + 11.5, v * 13.0 + 8.1, 2301, 4);
        var cloudMask = smoothstep(0.67, 0.91, cloudNoise * 0.70 + cloudBand * 0.30);

        var polarCloud = smoothstep(0.80, 1.0, Math.abs(lat)) * 0.25;
        cloudMask = clamp(cloudMask * 0.54 + polarCloud, 0, 0.70);

        color = mixColor(color, [242, 247, 250], cloudMask);

        var limb = smoothstep(0.68, 1.0, Math.sqrt(rr));
        var atmosphereBlue = [116, 190, 222];
        color = mixColor(color, atmosphereBlue, limb * 0.22);

        var dayNight = clamp(shade, 0.06, 1.12);
        var nightBlue = [2, 6, 15];
        color = mixColor(nightBlue, color, dayNight);

        var terminatorWarmth = smoothstep(0.16, 0.42, lightDot) * (1 - smoothstep(0.42, 0.82, lightDot));
        color = mixColor(color, [214, 176, 106], terminatorWarmth * 0.06);

        data[idx] = clamp(color[0], 0, 255);
        data[idx + 1] = clamp(color[1], 0, 255);
        data[idx + 2] = clamp(color[2], 0, 255);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    drawAtmosphere(ctx, cx, cy, radius);
    drawCoreSignal(ctx, cx, cy, radius);
    drawSubtleMapLaw(ctx, cx, cy, radius);
  }

  function normalize(v) {
    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    ctx.save();

    var outer = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.16);
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

  function drawCoreSignal(ctx, cx, cy, r) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.13;

    var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.22);
    core.addColorStop(0, "rgba(143,240,198,0.56)");
    core.addColorStop(0.45, "rgba(242,199,111,0.18)");
    core.addColorStop(1, "rgba(143,240,198,0)");

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(143,240,198,0.20)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawSubtleMapLaw(ctx, cx, cy, r) {
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = "rgba(242,199,111,0.22)";
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.94);
    ctx.lineTo(cx, cy + r * 0.94);
    ctx.stroke();

    ctx.globalAlpha = 0.09;
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.48, cy, r * 0.18, r * 0.94, -0.12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + r * 0.48, cy, r * 0.18, r * 0.94, 0.12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function buildCanvas() {
    var wrap = el("div", "planet-one-canvas-wrap");
    var canvas = el("canvas", "planet-one-canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Planet 1 Nine Summits Universe surface-first realistic globe");
    wrap.appendChild(canvas);
    renderPlanetSurface(canvas);
    return wrap;
  }

  function buildTelemetry() {
    var telemetry = el("div", "planet-one-telemetry");

    [
      "Planet 1",
      "Surface-first",
      "Real globe lane",
      "Seven-landmass law",
      "Jagged living shorelines",
      "Plateau pressure ecology",
      "Coherence access",
      "Tree demo mode"
    ].forEach(function (item) {
      telemetry.appendChild(el("span", "", item));
    });

    return telemetry;
  }

  function buildMapKey() {
    var key = el("div", "planet-one-mapkey");

    [
      ["Surface first", "The globe must read as a planet before it reads as a map."],
      ["Seven landmasses", "The structure is embedded under atmosphere, ocean, cloud, and terrain."],
      ["Psalm gravity", "The render carries desolation-to-restoration weight, not scenery."],
      ["No closure", "Exact countries, shores, cities, rivers, and physics remain unclosed."]
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
    var caption = config.caption || "Planet 1 · Nine Summits Universe · Psalm surface realism render lane";

    mount.innerHTML = "";
    mount.dataset.renderStatus = "mounted";
    mount.dataset.planetOneRenderActive = "true";
    mount.dataset.planetOneRenderer = RENDERER_PATH;
    mount.dataset.globeDemoStatusRetired = "true";
    mount.dataset.treeDemoMode = "true";
    mount.dataset.renderLanesSeparated = "true";
    mount.dataset.noRenderLaneCollapse = "true";
    mount.dataset.realismPass = "v4-psalm-surface-realism";
    mount.dataset.cartoonBlobGlobeRetired = "true";
    mount.dataset.surfaceFirstRender = "true";
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
    document.documentElement.dataset.planetOneRealismPass = "v4-psalm-surface-realism";
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
      realismPass: "v4-psalm-surface-realism",
      cartoonBlobGlobeRetired: true,
      surfaceFirstRender: true,
      noFinalGeographyClosure: true
    };
  }

  window.DGBPlanetOneRenderTeam = {
    version: VERSION,
    render: renderPlanetOne,
    renderPlanetOne: renderPlanetOne
  };
})();
