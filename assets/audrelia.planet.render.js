/* /assets/audrelia.planet.render.js
   AUDRALIA_G2_ORGANIC_CLIMATE_SEAM_AND_COASTLINE_CORRECTION_TNT_v4

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   AUDRALIA_PLANET_PROFILE
   AUDRALIA_PLANET_TEXTURE_LAW
   AUDRALIA_PLANET_SURFACE_COLOR
   AUDRALIA_PLANET_EXTENSION_RECEIPT
   SEAM_SAFE_ORGANIC_CLIMATE_PLANET_TERRAIN
   DEFINITIVE_LAND_WATER_SEPARATION
   NINE_SUMMIT_TERRAIN_REGION_LOGIC

   DOES_NOT_OWN=
   PLATFORM_PROJECTION
   INSTRUMENT_STATE
   ROUTE_COPY
   SUN_PIXELS
   MOON_PIXELS
   GAUGES_LOGIC
   PRODUCT_LOGIC
   SHOWROOM_LAYOUT
   IMAGE_GENERATION
   GRAPHIC_BOX_BEHAVIOR

   PRESERVES=
   existing audrelia file path
   existing audrelia id compatibility
   existing texture build API
   existing sampleSurface API
   existing render-platform registration

   V4_REPAIR=
   Removes diagonal seam/chord artifacts by replacing closed polygon masks with
   seam-safe continuous field terrain. No land, shelf, reef, or climate mask is
   allowed to draw a wrong-edge chord across the equirectangular texture.
*/

(function bindAudraliaPlanetRenderExtension(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_ORGANIC_CLIMATE_SEAM_AND_COASTLINE_CORRECTION_TNT_v4";

  /*
    Compatibility law:
    The file path and active-body id remain audrelia because the existing route and
    instrument handoff already use that id. The public-facing label is Audralia.
  */
  const ID = "audrelia";
  const CANONICAL_ID = "audralia";
  const LABEL = "Audralia";
  const TYPE = "planet";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const SOURCE_WIDTH = 3072;
  const SOURCE_HEIGHT = 1536;

  let cachedTexture = null;

  const REGIONS = [
    {
      key: "love_convergence_heartland",
      summit: "Love",
      lon: 84,
      lat: -14,
      rx: 68,
      ry: 39,
      rot: -12,
      weight: 1.18,
      humidity: 0.64,
      dry: 0.34,
      ridge: 0.36,
      age: 0.82
    },
    {
      key: "structure_foundation_plateau",
      summit: "Structure",
      lon: -26,
      lat: 4,
      rx: 43,
      ry: 25,
      rot: -7,
      weight: 0.94,
      humidity: 0.42,
      dry: 0.55,
      ridge: 0.48,
      age: 0.88
    },
    {
      key: "character_origin_ridge",
      summit: "Character",
      lon: -122,
      lat: 23,
      rx: 36,
      ry: 25,
      rot: 17,
      weight: 0.92,
      humidity: 0.55,
      dry: 0.32,
      ridge: 0.74,
      age: 0.96
    },
    {
      key: "balance_transition_basin",
      summit: "Balance",
      lon: 20,
      lat: -47,
      rx: 31,
      ry: 20,
      rot: 22,
      weight: 0.84,
      humidity: 0.58,
      dry: 0.34,
      ridge: 0.28,
      age: 0.78
    },
    {
      key: "stability_habitable_shelf",
      summit: "Stability",
      lon: 154,
      lat: -11,
      rx: 38,
      ry: 23,
      rot: -24,
      weight: 0.90,
      humidity: 0.66,
      dry: 0.22,
      ridge: 0.32,
      age: 0.76
    },
    {
      key: "peace_protected_basin",
      summit: "Peace",
      lon: -54,
      lat: -47,
      rx: 31,
      ry: 21,
      rot: 13,
      weight: 0.82,
      humidity: 0.72,
      dry: 0.18,
      ridge: 0.20,
      age: 0.74
    },
    {
      key: "joy_bright_archipelago",
      summit: "Joy",
      lon: -148,
      lat: 31,
      rx: 33,
      ry: 20,
      rot: -15,
      weight: 0.78,
      humidity: 0.72,
      dry: 0.12,
      ridge: 0.22,
      age: 0.60
    },
    {
      key: "dignity_mineral_crownland",
      summit: "Dignity",
      lon: 139,
      lat: 36,
      rx: 34,
      ry: 21,
      rot: 9,
      weight: 0.84,
      humidity: 0.36,
      dry: 0.54,
      ridge: 0.82,
      age: 0.98
    },
    {
      key: "free_will_frontier_edge",
      summit: "Free Will",
      lon: 18,
      lat: 43,
      rx: 37,
      ry: 22,
      rot: 27,
      weight: 0.84,
      humidity: 0.44,
      dry: 0.48,
      ridge: 0.52,
      age: 0.84
    },
    {
      key: "southern_old_basin",
      summit: "Balance",
      lon: 96,
      lat: -58,
      rx: 45,
      ry: 13,
      rot: -4,
      weight: 0.58,
      humidity: 0.40,
      dry: 0.24,
      ridge: 0.20,
      age: 0.94
    },
    {
      key: "equatorial_island_chain",
      summit: "Joy",
      lon: -10,
      lat: -4,
      rx: 23,
      ry: 9,
      rot: 8,
      weight: 0.46,
      humidity: 0.76,
      dry: 0.10,
      ridge: 0.18,
      age: 0.58
    },
    {
      key: "western_littoral_chain",
      summit: "Stability",
      lon: -174,
      lat: -15,
      rx: 17,
      ry: 32,
      rot: 4,
      weight: 0.55,
      humidity: 0.66,
      dry: 0.20,
      ridge: 0.26,
      age: 0.70
    },
    {
      key: "eastern_littoral_chain",
      summit: "Stability",
      lon: 174,
      lat: -15,
      rx: 17,
      ry: 32,
      rot: -4,
      weight: 0.55,
      humidity: 0.66,
      dry: 0.20,
      ridge: 0.26,
      age: 0.70
    }
  ];

  const RIDGES = [
    { lon: 82, lat: -7, rx: 9, ry: 62, rot: 72, power: 0.82 },
    { lon: 119, lat: -32, rx: 8, ry: 36, rot: 82, power: 0.56 },
    { lon: -108, lat: 20, rx: 7, ry: 32, rot: 108, power: 0.72 },
    { lon: 149, lat: 31, rx: 7, ry: 29, rot: 72, power: 0.76 },
    { lon: -10, lat: 4, rx: 7, ry: 28, rot: 104, power: 0.54 },
    { lon: 20, lat: 42, rx: 6, ry: 34, rot: 82, power: 0.50 }
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a * (1 - t) + b * t;
  }

  function lerpColor(a, b, t) {
    return [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t),
      mix(a[2], b[2], t)
    ];
  }

  function addColor(a, amount) {
    return [
      clamp(a[0] + amount, 0, 255),
      clamp(a[1] + amount, 0, 255),
      clamp(a[2] + amount, 0, 255)
    ];
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapDeltaLon(lon, centerLon) {
    let d = lon - centerLon;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
  }

  function makeSeededRandom(seed) {
    let s = seed >>> 0;

    return function random() {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashNoise(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function fbm(x, y, seed) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;

    for (let i = 0; i < 4; i += 1) {
      value += amp * hashNoise(x * freq, y * freq, seed + i * 11.13);
      amp *= 0.5;
      freq *= 2.03;
    }

    return value;
  }

  function makeCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function lonLatToXY(lon, lat, width, height) {
    return {
      x: ((lon + 180) / 360) * width,
      y: ((90 - lat) / 180) * height
    };
  }

  function drawEllipse(ctx, lon, lat, lonRadius, latRadius, rotationDeg, fill, stroke, lineWidth, alpha) {
    const p = lonLatToXY(lon, lat, ctx.canvas.width, ctx.canvas.height);

    ctx.save();

    if (alpha !== undefined) ctx.globalAlpha = alpha;

    ctx.translate(p.x, p.y);
    ctx.rotate((rotationDeg || 0) * DEG);
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      Math.max(0.5, (lonRadius / 360) * ctx.canvas.width),
      Math.max(0.5, (latRadius / 180) * ctx.canvas.height),
      0,
      0,
      TAU
    );

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawStroke(ctx, points, stroke, lineWidth, alpha) {
    if (!points || points.length < 2) return;

    ctx.save();

    if (alpha !== undefined) ctx.globalAlpha = alpha;

    ctx.beginPath();

    points.forEach(function drawPoint(point, index) {
      const p = lonLatToXY(point[0], point[1], ctx.canvas.width, ctx.canvas.height);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawRibbon(ctx, lonStart, lonEnd, latBase, amplitude, frequency, stroke, width, phase) {
    const points = [];
    const step = lonStart <= lonEnd ? 2.5 : -2.5;

    for (let lon = lonStart; step > 0 ? lon <= lonEnd : lon >= lonEnd; lon += step) {
      const wobble =
        Math.sin((lon + phase) * frequency) * amplitude +
        Math.sin((lon - phase * 0.45) * frequency * 1.9) * amplitude * 0.32 +
        Math.sin((lon + phase * 1.7) * frequency * 3.1) * amplitude * 0.10;

      points.push([lon, latBase + wobble]);
    }

    drawStroke(ctx, points, stroke, width);
  }

  function rotatedEllipseField(lon, lat, cfg) {
    const dx = wrapDeltaLon(lon, cfg.lon);
    const dy = lat - cfg.lat;
    const rot = -(cfg.rot || 0) * DEG;

    const x = dx * Math.cos(rot) - dy * Math.sin(rot);
    const y = dx * Math.sin(rot) + dy * Math.cos(rot);

    const nx = x / cfg.rx;
    const ny = y / cfg.ry;
    const d2 = nx * nx + ny * ny;

    return Math.exp(-d2 * 1.52) * cfg.weight;
  }

  function ridgeField(lon, lat) {
    let ridge = 0;

    RIDGES.forEach(function ridgePart(cfg) {
      const dx = wrapDeltaLon(lon, cfg.lon);
      const dy = lat - cfg.lat;
      const rot = -(cfg.rot || 0) * DEG;

      const x = dx * Math.cos(rot) - dy * Math.sin(rot);
      const y = dx * Math.sin(rot) + dy * Math.cos(rot);

      const nx = x / cfg.rx;
      const ny = y / cfg.ry;
      const d2 = nx * nx + ny * ny;

      ridge = Math.max(ridge, Math.exp(-d2 * 1.7) * cfg.power);
    });

    return ridge;
  }

  function computeTerrain(lon, lat) {
    let maxScore = 0;
    let sumScore = 0;
    let activeRegion = REGIONS[0];

    REGIONS.forEach(function regionScore(region) {
      const score = rotatedEllipseField(lon, lat, region);

      sumScore += score * 0.16;

      if (score > maxScore) {
        maxScore = score;
        activeRegion = region;
      }
    });

    const localNoise =
      (fbm(lon * 0.021, lat * 0.030, 91.4) - 0.5) * 0.16 +
      (fbm(lon * 0.052, lat * 0.061, 148.2) - 0.5) * 0.055;

    const ancientErosion =
      (fbm(lon * 0.012, lat * 0.018, 301.7) - 0.5) * 0.075;

    const combined = Math.max(maxScore, sumScore);
    const threshold = 0.405 + localNoise + ancientErosion;

    const terrain = combined - threshold;
    const landBlend = smoothstep(-0.035, 0.040, terrain);
    const coast = 1 - smoothstep(0.018, 0.135, Math.abs(terrain));
    const shelf = (1 - landBlend) * smoothstep(0.18, 0.44, combined);
    const nearLand = smoothstep(0.10, 0.50, combined);

    return {
      combined,
      threshold,
      terrain,
      landBlend,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      nearLand: clamp(nearLand, 0, 1),
      region: activeRegion,
      noise: localNoise,
      erosion: ancientErosion,
      ridge: ridgeField(lon, lat)
    };
  }

  function oceanColor(lon, lat, field) {
    const deep = [4, 18, 48];
    const mid = [7, 82, 124];
    const tropic = [9, 112, 145];
    const shelf = [62, 208, 206];
    const polar = [48, 72, 103];

    const depth = clamp((0.43 - field.combined) / 0.43, 0, 1);
    const latitudeCold = smoothstep(48, 82, Math.abs(lat));
    const equator = 1 - clamp(Math.abs(lat) / 54, 0, 1);

    let color = lerpColor(mid, deep, depth);
    color = lerpColor(color, tropic, equator * 0.20);
    color = lerpColor(color, shelf, field.shelf * 0.82);
    color = lerpColor(color, polar, latitudeCold * 0.36);

    const oceanNoise = (fbm(lon * 0.044, lat * 0.052, 12.1) - 0.5) * 18;
    color = addColor(color, oceanNoise);

    return color;
  }

  function landColor(lon, lat, field) {
    const region = field.region;

    const humidGreen = [34, 109, 65];
    const darkForest = [24, 78, 57];
    const olive = [91, 126, 73];
    const temperate = [108, 139, 76];
    const dry = [184, 143, 86];
    const desert = [203, 164, 101];
    const mountain = [122, 112, 94];
    const stone = [92, 88, 78];
    const snow = [219, 232, 225];

    const absLat = Math.abs(lat);
    const temp = clamp(1 - absLat / 82, 0, 1);
    const dryBelt = Math.exp(-Math.pow((absLat - 27) / 17, 2));
    const wetBelt = Math.exp(-Math.pow(absLat / 24, 2));
    const climateNoise = fbm(lon * 0.025, lat * 0.036, 512.4);
    const detailNoise = fbm(lon * 0.080, lat * 0.092, 814.2);

    const humidity = clamp(region.humidity * 0.58 + wetBelt * 0.26 + climateNoise * 0.28 - dryBelt * 0.18, 0, 1);
    const aridity = clamp(region.dry * 0.50 + dryBelt * 0.42 + (1 - humidity) * 0.24, 0, 1);
    const elevation = clamp(field.ridge * 0.70 + region.ridge * 0.22 + detailNoise * 0.14, 0, 1);
    const ancient = clamp(region.age * 0.58 + field.erosion * 1.8 + climateNoise * 0.20, 0, 1);
    const cold = smoothstep(46, 76, absLat) + smoothstep(0.52, 0.88, elevation) * 0.35;

    let color = lerpColor(olive, humidGreen, humidity);
    color = lerpColor(color, darkForest, humidity * temp * 0.18);
    color = lerpColor(color, temperate, (1 - Math.abs(absLat - 36) / 36) * 0.18);
    color = lerpColor(color, dry, aridity * 0.62);
    color = lerpColor(color, desert, aridity * dryBelt * 0.32);
    color = lerpColor(color, mountain, elevation * 0.52);
    color = lerpColor(color, stone, ancient * elevation * 0.24);
    color = lerpColor(color, snow, clamp(cold, 0, 1) * 0.38);

    const coastGold = [216, 203, 137];
    color = lerpColor(color, coastGold, field.coast * 0.16);

    const texture = (detailNoise - 0.5) * 28 + (fbm(lon * 0.15, lat * 0.12, 108.8) - 0.5) * 12;
    color = addColor(color, texture);

    return color;
  }

  function writeTexturePixels(ctx) {
    const image = ctx.createImageData(SOURCE_WIDTH, SOURCE_HEIGHT);
    const data = image.data;

    let i = 0;

    for (let y = 0; y < SOURCE_HEIGHT; y += 1) {
      const v = y / (SOURCE_HEIGHT - 1);
      const lat = 90 - v * 180;

      for (let x = 0; x < SOURCE_WIDTH; x += 1) {
        const u = x / SOURCE_WIDTH;
        const lon = u * 360 - 180;
        const field = computeTerrain(lon, lat);

        const water = oceanColor(lon, lat, field);
        const land = landColor(lon, lat, field);

        let color = lerpColor(water, land, field.landBlend);

        const coastBrightness = field.coast * 20;
        const shelfGlow = field.shelf * 18;

        if (field.landBlend < 0.5) {
          color[0] += shelfGlow * 0.20;
          color[1] += shelfGlow * 0.78;
          color[2] += shelfGlow * 0.88;
        } else {
          color[0] += coastBrightness * 0.55;
          color[1] += coastBrightness * 0.45;
          color[2] += coastBrightness * 0.20;
        }

        const polarHaze = smoothstep(58, 84, Math.abs(lat));
        color = lerpColor(color, [230, 240, 238], polarHaze * 0.16);

        data[i] = clamp(Math.round(color[0]), 0, 255);
        data[i + 1] = clamp(Math.round(color[1]), 0, 255);
        data[i + 2] = clamp(Math.round(color[2]), 0, 255);
        data[i + 3] = 255;

        i += 4;
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  function drawLocalReefChain(ctx, centerLon, centerLat, radiusLon, radiusLat, startDeg, endDeg, count, seedOffset) {
    const random = makeSeededRandom(6351301 + seedOffset);

    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = mix(startDeg, endDeg, t) * DEG;
      const lon = centerLon + Math.cos(angle) * radiusLon + (random() - 0.5) * 2.0;
      const lat = centerLat + Math.sin(angle) * radiusLat + (random() - 0.5) * 1.0;

      if (lon < -178 || lon > 178) continue;

      drawEllipse(
        ctx,
        lon,
        lat,
        0.28 + random() * 1.1,
        0.08 + random() * 0.28,
        random() * 180,
        "rgba(226, 244, 188, " + (0.12 + random() * 0.16).toFixed(4) + ")",
        null,
        0
      );
    }
  }

  function drawRidgesAndBasins(ctx) {
    const ridgeLines = [
      [[48, -7], [72, 4], [102, 7], [132, -5], [156, -22]],
      [[70, -38], [98, -28], [126, -31], [151, -43]],
      [[-136, 24], [-113, 31], [-91, 18], [-75, 2]],
      [[135, 37], [153, 32], [173, 22]],
      [[-27, 5], [-8, 15], [17, 8], [31, -9]],
      [[13, 44], [28, 40], [45, 31]]
    ];

    ridgeLines.forEach(function drawMainRidge(points, index) {
      drawStroke(
        ctx,
        points,
        index === 0 ? "rgba(238, 234, 214, 0.22)" : "rgba(228, 216, 184, 0.16)",
        index === 0 ? 2.0 : 1.45
      );

      drawStroke(
        ctx,
        points.map(function offset(point) {
          return [point[0] + 1.0, point[1] - 0.8];
        }),
        "rgba(43, 35, 28, 0.17)",
        index === 0 ? 1.35 : 1.0
      );
    });

    const basinRandom = makeSeededRandom(6351407);

    for (let i = 0; i < 48; i += 1) {
      const lon = -170 + basinRandom() * 340;
      const lat = -62 + basinRandom() * 124;

      drawEllipse(
        ctx,
        lon,
        lat,
        2.5 + basinRandom() * 8.0,
        0.8 + basinRandom() * 2.8,
        basinRandom() * 180,
        basinRandom() > 0.5
          ? "rgba(109, 83, 62, 0.035)"
          : "rgba(218, 181, 110, 0.030)",
        null,
        0
      );
    }
  }

  function drawReefAndShelfAccents(ctx) {
    drawLocalReefChain(ctx, 82, -12, 84, 50, 112, 255, 116, 11);
    drawLocalReefChain(ctx, 144, 33, 42, 23, 186, 352, 52, 12);
    drawLocalReefChain(ctx, -148, 29, 40, 27, 8, 224, 66, 13);
    drawLocalReefChain(ctx, -150, -16, 36, 25, 36, 254, 54, 14);
    drawLocalReefChain(ctx, -44, -50, 36, 21, 150, 345, 42, 15);
    drawLocalReefChain(ctx, 18, 43, 40, 24, 190, 357, 50, 16);
  }

  function drawClimateCurrents(ctx) {
    const random = makeSeededRandom(6351503);

    for (let band = -56; band <= 58; band += 12) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble =
          Math.sin((lon + band * 2.5) * 0.08) * 2.1 +
          Math.sin((lon - band * 1.2) * 0.15) * 0.74 +
          Math.sin((lon + band) * 0.032) * 0.9;

        points.push([lon, band + wobble]);
      }

      drawStroke(
        ctx,
        points,
        band < -28 ? "rgba(255,255,255,0.052)" : "rgba(255,255,255,0.040)",
        band < -28 ? 1.8 : 1.25
      );
    }

    for (let i = 0; i < 340; i += 1) {
      const lat = random() > 0.58
        ? -72 + random() * 64
        : -62 + random() * 124;

      drawEllipse(
        ctx,
        -180 + random() * 360,
        lat,
        0.8 + random() * 6.4,
        0.20 + random() * 1.35,
        random() * 180,
        "rgba(255,255,255," + (0.010 + random() * 0.040).toFixed(4) + ")",
        null,
        0
      );
    }

    for (let i = 0; i < 9; i += 1) {
      drawRibbon(
        ctx,
        -180,
        180,
        -20 + i * 5,
        0.55 + random() * 0.70,
        0.050 + random() * 0.016,
        "rgba(255,255,255,0.020)",
        0.65,
        random() * 220
      );
    }
  }

  function drawPolarAndAtmosphere(ctx) {
    const north = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.25);
    north.addColorStop(0, "rgba(245,250,255,0.22)");
    north.addColorStop(0.42, "rgba(245,250,255,0.070)");
    north.addColorStop(1, "rgba(245,250,255,0)");

    ctx.fillStyle = north;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.25);

    const south = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.56);
    south.addColorStop(0.00, "rgba(216, 236, 255, 0.26)");
    south.addColorStop(0.20, "rgba(143, 240, 198, 0.10)");
    south.addColorStop(0.48, "rgba(143, 101, 255, 0.050)");
    south.addColorStop(1.00, "rgba(143, 101, 255, 0)");

    ctx.fillStyle = south;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.56, SOURCE_WIDTH, SOURCE_HEIGHT * 0.44);

    const haze = ctx.createRadialGradient(
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.50,
      SOURCE_HEIGHT * 0.20,
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.50,
      SOURCE_HEIGHT * 0.90
    );

    haze.addColorStop(0.00, "rgba(255,255,255,0.014)");
    haze.addColorStop(0.55, "rgba(255,255,255,0.012)");
    haze.addColorStop(1.00, "rgba(130,204,255,0.064)");

    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function createProfile() {
    return {
      id: ID,
      canonicalId: CANONICAL_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      axialTiltDeg: -18.5,
      lightModel: "planet",
      atmosphere: true,
      rimColor: "rgba(154,224,255,0.78)",
      glowColor: "rgba(90,190,255,0.38)",
      sourceDefinition: SOURCE_WIDTH,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      renderBodyTerrainG2: true,
      organicClimatePlanetV4: true,
      seamSafeTerrain: true,
      seamSafeMaskGeneration: true,
      noWrongEdgePolygonChords: true,
      coherentPlanetTerrain: true,
      definitiveLandWaterSeparation: true,
      homeWorldExpression: true,
      fourTimesEarthAgeExpression: true,
      australiaRelationship: "inspiration_signal_only",
      audraliaRelationship: "fictional_metaverse_home_world_construct",
      terrainLanguage: [
        "seam_safe_field_terrain",
        "organic_irregular_coastlines",
        "definitive_land_water_separation",
        "coherent_home_world_planet",
        "deep_ocean_systems",
        "turquoise_shallow_shelves",
        "reef_edge_systems",
        "visible_climate_belts",
        "humid_green_zones",
        "temperate_olive_zones",
        "tan_dry_interiors",
        "gray_brown_mountain_ridges",
        "white_polar_or_highland_cues",
        "weathered_ancient_basins",
        "long_eroded_mountain_chains",
        "nine_summit_terrain_regions"
      ],
      nineSummitTerrainRegions: [
        "character_origin_ridge",
        "structure_foundation_plateau",
        "balance_transition_basin",
        "stability_habitable_shelf",
        "peace_protected_basin",
        "joy_bright_archipelago",
        "dignity_mineral_crownland",
        "free_will_frontier_edge",
        "love_convergence_heartland"
      ]
    };
  }

  function buildTexture() {
    if (cachedTexture) return cachedTexture;

    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true
    });

    writeTexturePixels(ctx);
    drawRidgesAndBasins(ctx);
    drawReefAndShelfAccents(ctx);
    drawClimateCurrents(ctx);
    drawPolarAndAtmosphere(ctx);

    cachedTexture = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    return cachedTexture;
  }

  function sampleSurface(texture, u, v, out) {
    const width = texture.width;
    const height = texture.height;
    const data = texture.data;

    const x = ((u % 1 + 1) % 1) * width;
    const y = clamp(v, 0, 0.999999) * (height - 1);

    const x0 = Math.floor(x) % width;
    const x1 = (x0 + 1) % width;
    const y0 = Math.floor(y);
    const y1 = Math.min(height - 1, y0 + 1);

    const tx = x - Math.floor(x);
    const ty = y - y0;

    const i00 = (y0 * width + x0) * 4;
    const i10 = (y0 * width + x1) * 4;
    const i01 = (y1 * width + x0) * 4;
    const i11 = (y1 * width + x1) * 4;

    const r0 = data[i00] * (1 - tx) + data[i10] * tx;
    const g0 = data[i00 + 1] * (1 - tx) + data[i10 + 1] * tx;
    const b0 = data[i00 + 2] * (1 - tx) + data[i10 + 2] * tx;

    const r1 = data[i01] * (1 - tx) + data[i11] * tx;
    const g1 = data[i01 + 1] * (1 - tx) + data[i11 + 1] * tx;
    const b1 = data[i01 + 2] * (1 - tx) + data[i11 + 2] * tx;

    out[0] = r0 * (1 - ty) + r1 * ty;
    out[1] = g0 * (1 - ty) + g1 * ty;
    out[2] = b0 * (1 - ty) + b1 * ty;

    return out;
  }

  function renderSurface() {
    return {
      ok: true,
      body: ID,
      canonicalId: CANONICAL_ID,
      label: LABEL,
      version: VERSION,
      renderDelegatedToPlatformProjection: true,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
      renderBodyTerrainG2: true,
      organicClimatePlanetV4: true,
      seamSafeTerrain: true,
      seamSafeMaskGeneration: true,
      noWrongEdgePolygonChords: true,
      coherentPlanetTerrain: true,
      definitiveLandWaterSeparation: true,
      nineSummitTerrainRegions: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    return {
      ok: true,
      id: ID,
      canonicalId: CANONICAL_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/audrelia.planet.render.js",
      ownsBodyPixelsOnly: true,
      profileMerge: false,
      renderBodyTerrainG2: true,
      organicClimatePlanetV4: true,
      seamSafeTerrain: true,
      seamSafeMaskGeneration: true,
      noWrongEdgePolygonChords: true,
      coherentPlanetTerrain: true,
      definitiveLandWaterSeparation: true,
      oceanForwardWorldRead: true,
      organicIrregularCoastlines: true,
      deepOceanSystems: true,
      turquoiseShallowShelves: true,
      reefBoundarySignal: true,
      visibleClimateBelts: true,
      humidGreenZones: true,
      temperateOliveZones: true,
      tanDryInteriors: true,
      ancientBasins: true,
      longErodedMountainChains: true,
      polarSubpolarInfluence: true,
      fourTimesEarthAgeExpression: true,
      nineSummitTerrainRegions: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  const api = {
    id: ID,
    canonicalId: CANONICAL_ID,
    label: LABEL,
    type: TYPE,
    version: VERSION,
    VERSION,
    aliases: [
      "earth",
      "planet",
      "audrelia",
      "audrelia-planet",
      "audralia",
      "audralia-planet",
      "home-world"
    ],
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus
  };

  global.DGBAudreliaPlanetRenderExtension = api;
  global.DGBAudraliaPlanetRenderExtension = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudreliaPlanetRenderExtension = api;
  global.DiamondGateBridge.DGBAudraliaPlanetRenderExtension = api;

  if (
    global.DGBShowroomGlobeRender &&
    typeof global.DGBShowroomGlobeRender.registerExtension === "function"
  ) {
    global.DGBShowroomGlobeRender.registerExtension(api);
  }

  try {
    global.dispatchEvent(
      new CustomEvent("dgb:audrelia:planet-extension-ready", {
        detail: getStatus()
      })
    );

    global.dispatchEvent(
      new CustomEvent("dgb:audralia:planet-extension-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
