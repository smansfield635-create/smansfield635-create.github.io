/* /assets/audrelia.planet.render.js
   AUDRALIA_G2_ORGANIC_CLIMATE_PLANET_TERRAIN_TNT_v3

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   AUDRALIA_PLANET_PROFILE
   AUDRALIA_PLANET_TEXTURE_LAW
   AUDRALIA_PLANET_SURFACE_COLOR
   AUDRALIA_PLANET_EXTENSION_RECEIPT
   ORGANIC_CLIMATE_PLANET_TERRAIN
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
*/

(function bindAudraliaPlanetRenderExtension(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_ORGANIC_CLIMATE_PLANET_TERRAIN_TNT_v3";

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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a * (1 - t) + b * t;
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
    let n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function fbm(x, y, seed) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;

    for (let i = 0; i < 5; i += 1) {
      value += amp * hashNoise(x * freq, y * freq, seed + i * 11.13);
      amp *= 0.5;
      freq *= 2.02;
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

  function polygonCentroid(points) {
    let lon = 0;
    let lat = 0;

    points.forEach(function sum(point) {
      lon += point[0];
      lat += point[1];
    });

    return {
      lon: lon / points.length,
      lat: lat / points.length
    };
  }

  function scalePolygon(points, lonScale, latScale) {
    const c = polygonCentroid(points);

    return points.map(function scale(point) {
      return [
        c.lon + (point[0] - c.lon) * lonScale,
        c.lat + (point[1] - c.lat) * latScale
      ];
    });
  }

  function smoothClosedPath(ctx, points) {
    if (!points || points.length < 3) return;

    const last = points[points.length - 1];
    const first = points[0];
    const firstMid = [
      (last[0] + first[0]) * 0.5,
      (last[1] + first[1]) * 0.5
    ];

    const firstXY = lonLatToXY(firstMid[0], firstMid[1], ctx.canvas.width, ctx.canvas.height);

    ctx.moveTo(firstXY.x, firstXY.y);

    points.forEach(function curve(point, index) {
      const next = points[(index + 1) % points.length];
      const mid = [
        (point[0] + next[0]) * 0.5,
        (point[1] + next[1]) * 0.5
      ];

      const pointXY = lonLatToXY(point[0], point[1], ctx.canvas.width, ctx.canvas.height);
      const midXY = lonLatToXY(mid[0], mid[1], ctx.canvas.width, ctx.canvas.height);

      ctx.quadraticCurveTo(pointXY.x, pointXY.y, midXY.x, midXY.y);
    });
  }

  function drawPolygon(ctx, points, fill, stroke, lineWidth, alpha) {
    ctx.save();

    if (alpha !== undefined) ctx.globalAlpha = alpha;

    ctx.beginPath();
    smoothClosedPath(ctx, points);
    ctx.closePath();

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.restore();
  }

  function clipToPolygon(ctx, points) {
    ctx.beginPath();
    smoothClosedPath(ctx, points);
    ctx.closePath();
    ctx.clip();
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
        Math.sin((lon - phase * 0.45) * frequency * 1.9) * amplitude * 0.34 +
        Math.sin((lon + phase * 1.7) * frequency * 3.1) * amplitude * 0.12;

      points.push([lon, latBase + wobble]);
    }

    drawStroke(ctx, points, stroke, width);
  }

  function makeOrganicRegion(config) {
    const points = [];
    const count = config.count || 128;
    const rotation = (config.rotation || 0) * DEG;
    const seed = config.seed || 1;
    const roughness = config.roughness || 0.18;

    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * TAU;

      const n1 = Math.sin(a * 2 + seed * 0.37) * 0.13;
      const n2 = Math.sin(a * 3.4 + seed * 1.91) * 0.09;
      const n3 = Math.sin(a * 6.7 + seed * 2.41) * 0.045;
      const n4 = (hashNoise(Math.cos(a) * 3.1, Math.sin(a) * 3.1, seed) - 0.5) * roughness;

      const r = 1 + n1 + n2 + n3 + n4;

      const lx = Math.cos(a) * config.lonRadius * r;
      const ly = Math.sin(a) * config.latRadius * r;

      const lon = config.lon + lx * Math.cos(rotation) - ly * Math.sin(rotation);
      const lat = config.lat + lx * Math.sin(rotation) * 0.55 + ly * Math.cos(rotation);

      points.push([
        clamp(lon, -178, 178),
        clamp(lat, -78, 78)
      ]);
    }

    return points;
  }

  function drawOceanBase(ctx, random) {
    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    ocean.addColorStop(0.00, "#051236");
    ocean.addColorStop(0.14, "#082c5f");
    ocean.addColorStop(0.30, "#0a5c84");
    ocean.addColorStop(0.47, "#0a7891");
    ocean.addColorStop(0.61, "#0a547b");
    ocean.addColorStop(0.80, "#06264c");
    ocean.addColorStop(1.00, "#020e24");

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    const equatorialLight = ctx.createRadialGradient(
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.47,
      SOURCE_HEIGHT * 0.04,
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.47,
      SOURCE_HEIGHT * 0.78
    );
    equatorialLight.addColorStop(0.00, "rgba(78, 226, 218, 0.18)");
    equatorialLight.addColorStop(0.34, "rgba(78, 226, 218, 0.070)");
    equatorialLight.addColorStop(0.72, "rgba(17, 78, 118, 0.042)");
    equatorialLight.addColorStop(1.00, "rgba(4, 11, 28, 0)");

    ctx.fillStyle = equatorialLight;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < 48; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -76 + random() * 152;
      const rLon = 10 + random() * 54;
      const rLat = 4 + random() * 25;

      drawEllipse(
        ctx,
        lon,
        lat,
        rLon,
        rLat,
        random() * 180,
        random() > 0.44
          ? "rgba(0, 20, 52, " + (0.09 + random() * 0.17).toFixed(4) + ")"
          : "rgba(0, 100, 132, " + (0.030 + random() * 0.075).toFixed(4) + ")",
        null,
        0
      );
    }

    for (let i = 0; i < 180; i += 1) {
      drawRibbon(
        ctx,
        -180,
        180,
        -72 + random() * 144,
        0.55 + random() * 1.9,
        0.034 + random() * 0.058,
        random() > 0.5 ? "rgba(125, 225, 255, 0.030)" : "rgba(255, 255, 255, 0.022)",
        0.55 + random() * 1.05,
        random() * 240
      );
    }

    for (let i = 0; i < 2100; i += 1) {
      const lat = -78 + random() * 156;
      const alpha = lat < -36 ? 0.018 + random() * 0.055 : 0.011 + random() * 0.040;

      drawEllipse(
        ctx,
        -180 + random() * 360,
        lat,
        0.5 + random() * 7.0,
        0.16 + random() * 2.0,
        random() * 180,
        "rgba(145,226,255," + alpha.toFixed(4) + ")",
        null,
        0
      );
    }
  }

  function getOrganicLandmasses() {
    const regions = [
      {
        name: "love-convergence-heartland",
        summit: "Love",
        lon: 79,
        lat: -8,
        lonRadius: 76,
        latRadius: 43,
        rotation: -13,
        seed: 1701,
        roughness: 0.20,
        baseFill: "#5c7e4f",
        humidFill: "rgba(38, 107, 69, 0.34)",
        dryFill: "rgba(190, 151, 91, 0.28)",
        coldFill: "rgba(205, 219, 212, 0.12)",
        center: "rgba(218, 190, 116, 0.26)",
        textureLonSpan: 126,
        textureLatSpan: 70,
        textureCount: 620,
        ridgeCount: 112,
        ridgeLength: 35,
        coastWidth: 2.2
      },
      {
        name: "character-origin-ridge",
        summit: "Character",
        lon: -122,
        lat: 22,
        lonRadius: 34,
        latRadius: 24,
        rotation: 18,
        seed: 2011,
        roughness: 0.24,
        baseFill: "#486c4c",
        humidFill: "rgba(52, 126, 76, 0.35)",
        dryFill: "rgba(168, 132, 82, 0.16)",
        coldFill: "rgba(218, 232, 222, 0.18)",
        center: "rgba(207, 225, 172, 0.22)",
        textureLonSpan: 58,
        textureLatSpan: 42,
        textureCount: 210,
        ridgeCount: 62,
        ridgeLength: 24,
        coastWidth: 1.9
      },
      {
        name: "structure-foundation-plateau",
        summit: "Structure",
        lon: -18,
        lat: 4,
        lonRadius: 38,
        latRadius: 24,
        rotation: -8,
        seed: 3017,
        roughness: 0.19,
        baseFill: "#6c7552",
        humidFill: "rgba(62, 111, 69, 0.20)",
        dryFill: "rgba(202, 159, 94, 0.28)",
        coldFill: "rgba(218, 225, 208, 0.08)",
        center: "rgba(209, 176, 108, 0.24)",
        textureLonSpan: 66,
        textureLatSpan: 42,
        textureCount: 250,
        ridgeCount: 52,
        ridgeLength: 24,
        coastWidth: 2.0
      },
      {
        name: "balance-transition-basin",
        summit: "Balance",
        lon: 18,
        lat: -47,
        lonRadius: 29,
        latRadius: 19,
        rotation: 24,
        seed: 4049,
        roughness: 0.22,
        baseFill: "#5a8168",
        humidFill: "rgba(62, 126, 94, 0.32)",
        dryFill: "rgba(180, 139, 89, 0.18)",
        coldFill: "rgba(200, 226, 224, 0.12)",
        center: "rgba(120, 176, 138, 0.24)",
        textureLonSpan: 52,
        textureLatSpan: 34,
        textureCount: 150,
        ridgeCount: 30,
        ridgeLength: 16,
        coastWidth: 1.7
      },
      {
        name: "stability-habitable-shelf",
        summit: "Stability",
        lon: 160,
        lat: -10,
        lonRadius: 34,
        latRadius: 21,
        rotation: -25,
        seed: 5021,
        roughness: 0.25,
        baseFill: "#557b50",
        humidFill: "rgba(55, 124, 72, 0.34)",
        dryFill: "rgba(188, 145, 91, 0.13)",
        coldFill: "rgba(214, 226, 210, 0.08)",
        center: "rgba(170, 210, 140, 0.22)",
        textureLonSpan: 55,
        textureLatSpan: 35,
        textureCount: 180,
        ridgeCount: 36,
        ridgeLength: 18,
        coastWidth: 1.8
      },
      {
        name: "peace-protected-green-blue-basin",
        summit: "Peace",
        lon: -53,
        lat: -47,
        lonRadius: 29,
        latRadius: 20,
        rotation: 13,
        seed: 6067,
        roughness: 0.20,
        baseFill: "#4b7b62",
        humidFill: "rgba(54, 136, 98, 0.36)",
        dryFill: "rgba(170, 138, 86, 0.10)",
        coldFill: "rgba(204, 232, 225, 0.15)",
        center: "rgba(108, 198, 170, 0.24)",
        textureLonSpan: 50,
        textureLatSpan: 34,
        textureCount: 145,
        ridgeCount: 24,
        ridgeLength: 14,
        coastWidth: 1.7
      },
      {
        name: "joy-bright-archipelago",
        summit: "Joy",
        lon: -148,
        lat: 31,
        lonRadius: 31,
        latRadius: 20,
        rotation: -15,
        seed: 7079,
        roughness: 0.30,
        baseFill: "#629353",
        humidFill: "rgba(72, 142, 82, 0.38)",
        dryFill: "rgba(202, 171, 102, 0.10)",
        coldFill: "rgba(224, 234, 208, 0.08)",
        center: "rgba(226, 230, 136, 0.20)",
        textureLonSpan: 54,
        textureLatSpan: 32,
        textureCount: 105,
        ridgeCount: 16,
        ridgeLength: 12,
        coastWidth: 1.6
      },
      {
        name: "dignity-mineral-crownland",
        summit: "Dignity",
        lon: 139,
        lat: 36,
        lonRadius: 33,
        latRadius: 21,
        rotation: 9,
        seed: 8081,
        roughness: 0.23,
        baseFill: "#6e684e",
        humidFill: "rgba(66, 111, 72, 0.16)",
        dryFill: "rgba(210, 165, 96, 0.25)",
        coldFill: "rgba(228, 235, 224, 0.20)",
        center: "rgba(225, 202, 142, 0.25)",
        textureLonSpan: 52,
        textureLatSpan: 36,
        textureCount: 155,
        ridgeCount: 58,
        ridgeLength: 21,
        coastWidth: 1.9
      },
      {
        name: "free-will-frontier-edge",
        summit: "Free Will",
        lon: 16,
        lat: 43,
        lonRadius: 36,
        latRadius: 21,
        rotation: 27,
        seed: 9091,
        roughness: 0.27,
        baseFill: "#5d724d",
        humidFill: "rgba(60, 117, 72, 0.22)",
        dryFill: "rgba(198, 146, 88, 0.23)",
        coldFill: "rgba(220, 229, 216, 0.12)",
        center: "rgba(190, 150, 94, 0.22)",
        textureLonSpan: 56,
        textureLatSpan: 34,
        textureCount: 150,
        ridgeCount: 42,
        ridgeLength: 21,
        coastWidth: 1.7
      }
    ];

    return regions.map(function withPoints(region) {
      return Object.assign({}, region, {
        points: makeOrganicRegion(region)
      });
    });
  }

  function drawShelfSystems(ctx, landmasses, random) {
    landmasses.forEach(function drawShelf(land) {
      const shelfOuter = scalePolygon(land.points, 1.18, 1.23);
      const shelfMiddle = scalePolygon(land.points, 1.105, 1.145);
      const shelfInner = scalePolygon(land.points, 1.045, 1.065);

      drawPolygon(ctx, shelfOuter, "rgba(44, 174, 190, 0.23)", "rgba(155, 232, 230, 0.09)", 1.2);
      drawPolygon(ctx, shelfMiddle, "rgba(99, 221, 219, 0.24)", "rgba(204, 248, 235, 0.13)", 1.1);
      drawPolygon(ctx, shelfInner, "rgba(166, 239, 216, 0.23)", "rgba(242, 238, 176, 0.17)", 0.9);

      const c = polygonCentroid(land.points);
      for (let i = 0; i < 28; i += 1) {
        const a = random() * TAU;
        const pLon = c.lon + Math.cos(a) * land.lonRadius * (1.02 + random() * 0.32);
        const pLat = c.lat + Math.sin(a) * land.latRadius * (1.06 + random() * 0.38);

        drawEllipse(
          ctx,
          pLon,
          pLat,
          0.35 + random() * 1.25,
          0.10 + random() * 0.30,
          random() * 180,
          "rgba(223, 242, 184, " + (0.08 + random() * 0.16).toFixed(4) + ")",
          null,
          0
        );
      }
    });
  }

  function drawLandBase(ctx, land) {
    drawPolygon(ctx, land.points, land.baseFill, "rgba(255, 238, 178, 0.30)", land.coastWidth || 1.8);
    drawPolygon(ctx, scalePolygon(land.points, 0.992, 0.992), land.baseFill, null, 0);

    ctx.save();
    clipToPolygon(ctx, land.points);

    const c = polygonCentroid(land.points);
    const center = lonLatToXY(c.lon, c.lat, SOURCE_WIDTH, SOURCE_HEIGHT);

    const terrainGlow = ctx.createRadialGradient(
      center.x,
      center.y,
      SOURCE_HEIGHT * 0.015,
      center.x,
      center.y,
      SOURCE_HEIGHT * 0.25
    );

    terrainGlow.addColorStop(0.00, land.center);
    terrainGlow.addColorStop(0.46, "rgba(61, 118, 75, 0.25)");
    terrainGlow.addColorStop(1.00, "rgba(20, 54, 42, 0.12)");

    ctx.fillStyle = terrainGlow;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    ctx.restore();

    drawPolygon(ctx, land.points, null, "rgba(13, 30, 27, 0.48)", 0.9);
    drawPolygon(ctx, scalePolygon(land.points, 1.010, 1.012), null, "rgba(242, 232, 169, 0.16)", 0.9);
  }

  function drawClimateBeltsOnLand(ctx, land, random) {
    const c = polygonCentroid(land.points);

    ctx.save();
    clipToPolygon(ctx, land.points);

    const top = lonLatToXY(0, c.lat + land.latRadius, SOURCE_WIDTH, SOURCE_HEIGHT).y;
    const bottom = lonLatToXY(0, c.lat - land.latRadius, SOURCE_WIDTH, SOURCE_HEIGHT).y;

    const climate = ctx.createLinearGradient(0, top, 0, bottom);
    climate.addColorStop(0.00, land.coldFill);
    climate.addColorStop(0.18, "rgba(82, 125, 82, 0.22)");
    climate.addColorStop(0.38, land.humidFill);
    climate.addColorStop(0.58, land.dryFill);
    climate.addColorStop(0.78, "rgba(66, 116, 72, 0.20)");
    climate.addColorStop(1.00, land.coldFill);

    ctx.fillStyle = climate;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < land.textureCount; i += 1) {
      const lon = c.lon + (random() - 0.5) * land.textureLonSpan;
      const lat = c.lat + (random() - 0.5) * land.textureLatSpan;

      const humidBias = Math.max(0, 1 - Math.abs(lat) / 55);
      const dryBias = Math.max(0, 1 - Math.abs(Math.abs(lat) - 26) / 28);
      const coldBias = Math.max(0, (Math.abs(lat) - 45) / 32);
      const n = fbm(lon * 0.021, lat * 0.036, land.seed);

      let fill;

      if (coldBias > 0.42 && random() < coldBias * 0.72) {
        fill = "rgba(220, 232, 224, " + (0.055 + random() * 0.12).toFixed(4) + ")";
      } else if (dryBias + n * 0.35 > 0.82) {
        fill = "rgba(207, 161, 91, " + (0.080 + random() * 0.17).toFixed(4) + ")";
      } else if (humidBias + n * 0.38 > 0.76) {
        fill = "rgba(35, 116, 67, " + (0.080 + random() * 0.17).toFixed(4) + ")";
      } else {
        fill = "rgba(86, 124, 73, " + (0.055 + random() * 0.13).toFixed(4) + ")";
      }

      drawEllipse(
        ctx,
        lon,
        lat,
        0.30 + random() * 2.7,
        0.10 + random() * 0.82,
        land.rotation + random() * 120 - 60,
        fill,
        null,
        0
      );
    }

    ctx.restore();
  }

  function drawAncientTerrain(ctx, land, random) {
    const c = polygonCentroid(land.points);

    ctx.save();
    clipToPolygon(ctx, land.points);

    for (let i = 0; i < land.ridgeCount; i += 1) {
      const baseLon = c.lon + (random() - 0.5) * land.textureLonSpan * 0.78;
      const baseLat = c.lat + (random() - 0.5) * land.textureLatSpan * 0.70;
      const angle = land.rotation + (random() - 0.5) * 80;
      const length = 6 + random() * land.ridgeLength;
      const points = [];

      for (let p = 0; p < 13; p += 1) {
        const t = p / 12;
        points.push([
          baseLon + Math.cos(angle * DEG) * length * (t - 0.5) + Math.sin(t * TAU) * 1.15,
          baseLat + Math.sin(angle * DEG) * length * (t - 0.5) + Math.cos(t * TAU) * 0.72
        ]);
      }

      drawStroke(
        ctx,
        points,
        random() > 0.55 ? "rgba(225, 221, 196, 0.22)" : "rgba(70, 48, 38, 0.19)",
        0.85 + random() * 1.35
      );
    }

    for (let i = 0; i < 34; i += 1) {
      const lon = c.lon + (random() - 0.5) * land.textureLonSpan * 0.65;
      const lat = c.lat + (random() - 0.5) * land.textureLatSpan * 0.58;

      drawEllipse(
        ctx,
        lon,
        lat,
        2.6 + random() * 8.8,
        0.8 + random() * 3.2,
        land.rotation + random() * 60 - 30,
        random() > 0.48
          ? "rgba(112, 84, 62, " + (0.035 + random() * 0.080).toFixed(4) + ")"
          : "rgba(218, 181, 110, " + (0.030 + random() * 0.065).toFixed(4) + ")",
        null,
        0
      );
    }

    ctx.restore();
  }

  function drawReefArc(ctx, lon, lat, radiusLon, radiusLat, startDeg, endDeg, count, random) {
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = mix(startDeg, endDeg, t) * DEG;
      const reefLon = lon + Math.cos(angle) * radiusLon + (random() - 0.5) * 2.4;
      const reefLat = lat + Math.sin(angle) * radiusLat + (random() - 0.5) * 1.25;

      drawEllipse(
        ctx,
        reefLon,
        reefLat,
        0.32 + random() * 1.45,
        0.10 + random() * 0.36,
        random() * 180,
        "rgba(226, 244, 188, " + (0.16 + random() * 0.20).toFixed(4) + ")",
        "rgba(20, 88, 94, 0.08)",
        0.35
      );
    }
  }

  function drawGlobalReefs(ctx, random) {
    drawReefArc(ctx, 87, -9, 88, 54, 112, 264, 142, random);
    drawReefArc(ctx, 144, 33, 43, 24, 186, 356, 62, random);
    drawReefArc(ctx, -148, 29, 42, 28, 5, 225, 78, random);
    drawReefArc(ctx, -150, -16, 38, 26, 35, 254, 64, random);
    drawReefArc(ctx, -44, -50, 38, 22, 150, 346, 48, random);
    drawReefArc(ctx, 18, 43, 42, 25, 190, 358, 58, random);
  }

  function drawFrontierAndClimateCurrents(ctx, random) {
    for (let i = 0; i < 11; i += 1) {
      const lat = -49 + i * 4.4 + (random() - 0.5) * 2.2;
      const lonStart = -172 + random() * 18;
      const lonEnd = 172 - random() * 18;

      drawRibbon(
        ctx,
        lonStart,
        lonEnd,
        lat,
        1.1 + random() * 1.1,
        0.046 + random() * 0.023,
        i % 2 === 0 ? "rgba(242, 199, 111, 0.105)" : "rgba(143, 240, 198, 0.082)",
        1.05 + random() * 1.0,
        random() * 100
      );
    }

    for (let i = 0; i < 9; i += 1) {
      drawRibbon(
        ctx,
        -180,
        180,
        -18 + i * 6,
        0.6 + random() * 0.8,
        0.052 + random() * 0.018,
        "rgba(255, 255, 255, 0.028)",
        0.85,
        random() * 220
      );
    }
  }

  function drawNineSummitTerrain(ctx, random) {
    const landmasses = getOrganicLandmasses();

    drawShelfSystems(ctx, landmasses, random);
    drawGlobalReefs(ctx, random);

    landmasses.forEach(function drawLand(land) {
      drawLandBase(ctx, land);
      drawClimateBeltsOnLand(ctx, land, random);
      drawAncientTerrain(ctx, land, random);
    });

    const ridgeSystems = [
      [[51, -8], [77, 5], [105, 9], [132, -4], [158, -22]],
      [[72, -38], [99, -27], [126, -31], [151, -43]],
      [[-136, 24], [-113, 31], [-91, 18], [-75, 2]],
      [[135, 37], [153, 32], [173, 22]],
      [[-25, 5], [-7, 15], [17, 8], [30, -8]]
    ];

    ridgeSystems.forEach(function drawMainRidge(points, index) {
      drawStroke(
        ctx,
        points,
        index === 0 ? "rgba(238, 234, 214, 0.40)" : "rgba(228, 216, 184, 0.26)",
        index === 0 ? 3.1 : 2.1
      );

      drawStroke(
        ctx,
        points.map(function offset(point) {
          return [point[0] + 1.2, point[1] - 0.9];
        }),
        "rgba(43, 35, 28, 0.28)",
        index === 0 ? 1.9 : 1.4
      );
    });

    drawFrontierAndClimateCurrents(ctx, random);
  }

  function drawCloudBands(ctx, random) {
    for (let band = -60; band <= 62; band += 12) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble =
          Math.sin((lon + band * 2.5) * 0.08) * 2.8 +
          Math.sin((lon - band * 1.2) * 0.15) * 0.90 +
          Math.sin((lon + band) * 0.032) * 1.3;
        points.push([lon, band + wobble]);
      }

      drawStroke(
        ctx,
        points,
        band < -30 ? "rgba(255,255,255,0.070)" : "rgba(255,255,255,0.052)",
        band < -30 ? 2.4 : 1.6
      );
    }

    for (let i = 0; i < 460; i += 1) {
      const southernBias = random() > 0.58 ? 1 : 0;
      const lat = southernBias
        ? -72 + random() * 64
        : -62 + random() * 124;

      drawEllipse(
        ctx,
        -180 + random() * 360,
        lat,
        0.9 + random() * 7.4,
        0.24 + random() * 1.6,
        random() * 180,
        "rgba(255,255,255," + (0.012 + random() * 0.052).toFixed(4) + ")",
        null,
        0
      );
    }
  }

  function drawAtmosphereAndPolarSystems(ctx, random) {
    drawCloudBands(ctx, random);

    const north = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.25);
    north.addColorStop(0, "rgba(245,250,255,0.24)");
    north.addColorStop(0.42, "rgba(245,250,255,0.075)");
    north.addColorStop(1, "rgba(245,250,255,0)");

    ctx.fillStyle = north;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.25);

    const south = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.56);
    south.addColorStop(0.00, "rgba(216, 236, 255, 0.28)");
    south.addColorStop(0.20, "rgba(143, 240, 198, 0.115)");
    south.addColorStop(0.48, "rgba(143, 101, 255, 0.055)");
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

    haze.addColorStop(0.00, "rgba(255,255,255,0.018)");
    haze.addColorStop(0.55, "rgba(255,255,255,0.014)");
    haze.addColorStop(1.00, "rgba(130,204,255,0.070)");

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
      organicClimatePlanetV3: true,
      coherentPlanetTerrain: true,
      definitiveLandWaterSeparation: true,
      homeWorldExpression: true,
      fourTimesEarthAgeExpression: true,
      australiaRelationship: "inspiration_signal_only",
      audraliaRelationship: "fictional_metaverse_home_world_construct",
      terrainLanguage: [
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

    const random = makeSeededRandom(6351103);

    drawOceanBase(ctx, random);
    drawNineSummitTerrain(ctx, random);
    drawAtmosphereAndPolarSystems(ctx, random);

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
      organicClimatePlanetV3: true,
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
      organicClimatePlanetV3: true,
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
