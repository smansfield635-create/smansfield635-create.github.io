/* /assets/audrelia.planet.render.js
   AUDRALIA_G2_NINE_SUMMIT_COHERENT_PLANET_TERRAIN_TNT_v2

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   AUDRALIA_PLANET_PROFILE
   AUDRALIA_PLANET_TEXTURE_LAW
   AUDRALIA_PLANET_SURFACE_COLOR
   AUDRALIA_PLANET_EXTENSION_RECEIPT
   AUDRALIA_G2_RENDER_BODY_TERRAIN_EXPRESSION
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

  const VERSION = "AUDRALIA_G2_NINE_SUMMIT_COHERENT_PLANET_TERRAIN_TNT_v2";

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

  function makePath(ctx, points) {
    points.forEach(function pointToPath(point, index) {
      const p = lonLatToXY(point[0], point[1], ctx.canvas.width, ctx.canvas.height);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
  }

  function drawPolygon(ctx, points, fill, stroke, lineWidth) {
    ctx.save();
    ctx.beginPath();
    makePath(ctx, points);
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
    makePath(ctx, points);
    ctx.closePath();
    ctx.clip();
  }

  function drawEllipse(ctx, lon, lat, lonRadius, latRadius, rotationDeg, fill, stroke, lineWidth) {
    const p = lonLatToXY(lon, lat, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
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

    if (alpha !== undefined) {
      ctx.globalAlpha = alpha;
    }

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
    const step = lonStart <= lonEnd ? 3 : -3;

    for (let lon = lonStart; step > 0 ? lon <= lonEnd : lon >= lonEnd; lon += step) {
      const wobble =
        Math.sin((lon + phase) * frequency) * amplitude +
        Math.sin((lon - phase * 0.45) * frequency * 1.9) * amplitude * 0.34;

      points.push([lon, latBase + wobble]);
    }

    drawStroke(ctx, points, stroke, width);
  }

  function drawOceanBase(ctx, random) {
    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    ocean.addColorStop(0.00, "#06133a");
    ocean.addColorStop(0.15, "#0b2d61");
    ocean.addColorStop(0.31, "#0b5a82");
    ocean.addColorStop(0.49, "#0b7894");
    ocean.addColorStop(0.64, "#0b5b82");
    ocean.addColorStop(0.82, "#07284f");
    ocean.addColorStop(1.00, "#031126");

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    const equatorialLight = ctx.createRadialGradient(
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.46,
      SOURCE_HEIGHT * 0.04,
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.46,
      SOURCE_HEIGHT * 0.76
    );
    equatorialLight.addColorStop(0.00, "rgba(74, 222, 216, 0.18)");
    equatorialLight.addColorStop(0.34, "rgba(74, 222, 216, 0.075)");
    equatorialLight.addColorStop(0.72, "rgba(17, 78, 118, 0.045)");
    equatorialLight.addColorStop(1.00, "rgba(4, 11, 28, 0)");

    ctx.fillStyle = equatorialLight;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < 34; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -74 + random() * 148;
      const rLon = 12 + random() * 42;
      const rLat = 5 + random() * 22;

      drawEllipse(
        ctx,
        lon,
        lat,
        rLon,
        rLat,
        random() * 180,
        random() > 0.45
          ? "rgba(0, 22, 54, " + (0.10 + random() * 0.16).toFixed(4) + ")"
          : "rgba(0, 98, 132, " + (0.035 + random() * 0.08).toFixed(4) + ")",
        null,
        0
      );
    }

    for (let i = 0; i < 160; i += 1) {
      drawRibbon(
        ctx,
        -180,
        180,
        -70 + random() * 140,
        0.7 + random() * 2.0,
        0.038 + random() * 0.058,
        random() > 0.5 ? "rgba(125, 225, 255, 0.032)" : "rgba(255, 255, 255, 0.024)",
        0.6 + random() * 1.15,
        random() * 220
      );
    }

    for (let i = 0; i < 1900; i += 1) {
      const lat = -76 + random() * 152;
      const alpha = lat < -35 ? 0.018 + random() * 0.062 : 0.012 + random() * 0.046;

      drawEllipse(
        ctx,
        -180 + random() * 360,
        lat,
        0.6 + random() * 7.2,
        0.18 + random() * 2.1,
        random() * 180,
        "rgba(145,226,255," + alpha.toFixed(4) + ")",
        null,
        0
      );
    }
  }

  function drawShelfSystems(ctx, landmasses) {
    landmasses.forEach(function drawShelf(land) {
      const shelf2 = scalePolygon(land.points, 1.15, 1.20);
      const shelf1 = scalePolygon(land.points, 1.075, 1.105);

      drawPolygon(ctx, shelf2, "rgba(85, 212, 224, 0.24)", "rgba(191, 248, 235, 0.10)", 1.35);
      drawPolygon(ctx, shelf1, "rgba(144, 236, 218, 0.21)", "rgba(242, 238, 176, 0.16)", 1.15);
    });
  }

  function drawLandBase(ctx, land) {
    drawPolygon(ctx, land.points, land.fill, "rgba(255, 238, 178, 0.36)", land.coastWidth || 2.0);

    drawPolygon(ctx, scalePolygon(land.points, 0.985, 0.985), land.fill, null, 0);

    ctx.save();
    clipToPolygon(ctx, land.points);

    const c = polygonCentroid(land.points);
    const terrainGlow = ctx.createRadialGradient(
      lonLatToXY(c.lon, c.lat, SOURCE_WIDTH, SOURCE_HEIGHT).x,
      lonLatToXY(c.lon, c.lat, SOURCE_WIDTH, SOURCE_HEIGHT).y,
      SOURCE_HEIGHT * 0.02,
      lonLatToXY(c.lon, c.lat, SOURCE_WIDTH, SOURCE_HEIGHT).x,
      lonLatToXY(c.lon, c.lat, SOURCE_WIDTH, SOURCE_HEIGHT).y,
      SOURCE_HEIGHT * 0.28
    );

    terrainGlow.addColorStop(0.00, land.center || "rgba(200, 178, 112, 0.30)");
    terrainGlow.addColorStop(0.50, "rgba(58, 111, 72, 0.22)");
    terrainGlow.addColorStop(1.00, "rgba(19, 52, 42, 0.10)");

    ctx.fillStyle = terrainGlow;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    ctx.restore();

    drawPolygon(ctx, land.points, null, "rgba(18, 35, 30, 0.54)", 1.1);
    drawPolygon(ctx, scalePolygon(land.points, 1.012, 1.016), null, "rgba(242, 232, 169, 0.20)", 1.0);
  }

  function drawClippedTerrain(ctx, land, random) {
    const c = polygonCentroid(land.points);

    ctx.save();
    clipToPolygon(ctx, land.points);

    for (let i = 0; i < land.textureCount; i += 1) {
      const lon = c.lon + (random() - 0.5) * land.textureLonSpan;
      const lat = c.lat + (random() - 0.5) * land.textureLatSpan;
      const isDry = random() > 0.54;

      drawEllipse(
        ctx,
        lon,
        lat,
        0.35 + random() * 3.3,
        0.12 + random() * 1.0,
        land.rotation + random() * 100 - 50,
        isDry
          ? "rgba(199, 162, 94, " + (0.075 + random() * 0.14).toFixed(4) + ")"
          : "rgba(43, 108, 68, " + (0.075 + random() * 0.15).toFixed(4) + ")",
        null,
        0
      );
    }

    for (let i = 0; i < land.ridgeCount; i += 1) {
      const baseLon = c.lon + (random() - 0.5) * land.textureLonSpan * 0.76;
      const baseLat = c.lat + (random() - 0.5) * land.textureLatSpan * 0.68;
      const angle = land.rotation + (random() - 0.5) * 70;
      const length = 6 + random() * land.ridgeLength;
      const points = [];

      for (let p = 0; p < 11; p += 1) {
        const t = p / 10;
        points.push([
          baseLon + Math.cos(angle * DEG) * length * (t - 0.5) + Math.sin(t * TAU) * 1.35,
          baseLat + Math.sin(angle * DEG) * length * (t - 0.5) + Math.cos(t * TAU) * 0.88
        ]);
      }

      drawStroke(
        ctx,
        points,
        random() > 0.52 ? "rgba(235, 230, 204, 0.25)" : "rgba(70, 48, 38, 0.22)",
        1.1 + random() * 1.7
      );
    }

    ctx.restore();
  }

  function drawReefArc(ctx, lon, lat, radiusLon, radiusLat, startDeg, endDeg, count, random) {
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = mix(startDeg, endDeg, t) * DEG;
      const reefLon = lon + Math.cos(angle) * radiusLon + (random() - 0.5) * 2.2;
      const reefLat = lat + Math.sin(angle) * radiusLat + (random() - 0.5) * 1.15;

      drawEllipse(
        ctx,
        reefLon,
        reefLat,
        0.42 + random() * 1.55,
        0.12 + random() * 0.42,
        random() * 180,
        "rgba(226, 244, 188, " + (0.18 + random() * 0.22).toFixed(4) + ")",
        "rgba(20, 88, 94, 0.10)",
        0.45
      );
    }
  }

  function drawPressureField(ctx, lon, lat, lonRadius, latRadius, rotation, random) {
    drawEllipse(
      ctx,
      lon,
      lat,
      lonRadius,
      latRadius,
      rotation,
      "rgba(168, 120, 68, 0.32)",
      "rgba(238, 190, 106, 0.18)",
      1.25
    );

    for (let i = 0; i < 58; i += 1) {
      const a = random() * TAU;
      const r = Math.sqrt(random());
      const pLon = lon + Math.cos(a) * lonRadius * r * 0.82;
      const pLat = lat + Math.sin(a) * latRadius * r * 0.62;

      drawEllipse(
        ctx,
        pLon,
        pLat,
        0.38 + random() * 2.8,
        0.12 + random() * 0.86,
        rotation + random() * 80 - 40,
        random() > 0.45
          ? "rgba(224, 180, 110, " + (0.08 + random() * 0.16).toFixed(4) + ")"
          : "rgba(78, 55, 42, " + (0.06 + random() * 0.12).toFixed(4) + ")",
        null,
        0
      );
    }
  }

  function drawFrontierBelt(ctx, random) {
    for (let i = 0; i < 11; i += 1) {
      const lat = -48 + i * 4.3 + (random() - 0.5) * 2.0;
      const lonStart = -172 + random() * 18;
      const lonEnd = 172 - random() * 18;

      drawRibbon(
        ctx,
        lonStart,
        lonEnd,
        lat,
        1.3 + random() * 1.0,
        0.050 + random() * 0.022,
        i % 2 === 0 ? "rgba(242, 199, 111, 0.13)" : "rgba(143, 240, 198, 0.10)",
        1.25 + random() * 1.2,
        random() * 100
      );
    }
  }

  function drawCloudBands(ctx, random) {
    for (let band = -58; band <= 62; band += 12) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble =
          Math.sin((lon + band * 2.5) * 0.08) * 3.0 +
          Math.sin((lon - band * 1.2) * 0.15) * 0.95;
        points.push([lon, band + wobble]);
      }

      drawStroke(
        ctx,
        points,
        band < -28 ? "rgba(255,255,255,0.080)" : "rgba(255,255,255,0.058)",
        band < -28 ? 2.6 : 1.9
      );
    }

    for (let i = 0; i < 420; i += 1) {
      const southernBias = random() > 0.58 ? 1 : 0;
      const lat = southernBias
        ? -72 + random() * 64
        : -62 + random() * 124;

      drawEllipse(
        ctx,
        -180 + random() * 360,
        lat,
        1 + random() * 8,
        0.28 + random() * 1.8,
        random() * 180,
        "rgba(255,255,255," + (0.014 + random() * 0.060).toFixed(4) + ")",
        null,
        0
      );
    }
  }

  function drawSouthernLight(ctx) {
    const south = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.58);
    south.addColorStop(0.00, "rgba(216, 236, 255, 0.25)");
    south.addColorStop(0.20, "rgba(143, 240, 198, 0.105)");
    south.addColorStop(0.44, "rgba(143, 101, 255, 0.055)");
    south.addColorStop(1.00, "rgba(143, 101, 255, 0)");

    ctx.fillStyle = south;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.58, SOURCE_WIDTH, SOURCE_HEIGHT * 0.42);

    const polarSouth = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.72);
    polarSouth.addColorStop(0, "rgba(245,250,255,0.32)");
    polarSouth.addColorStop(0.35, "rgba(143,240,198,0.10)");
    polarSouth.addColorStop(1, "rgba(245,250,255,0)");

    ctx.fillStyle = polarSouth;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.72, SOURCE_WIDTH, SOURCE_HEIGHT * 0.28);
  }

  function getLandmasses() {
    return [
      {
        name: "love-convergence-heartland",
        summit: "Love",
        fill: "#5f7f52",
        center: "rgba(216, 190, 116, 0.30)",
        rotation: -10,
        textureCount: 460,
        ridgeCount: 80,
        ridgeLength: 31,
        textureLonSpan: 90,
        textureLatSpan: 54,
        coastWidth: 2.6,
        points: [
          [56, -6], [71, 10], [103, 17], [136, 9], [164, -6],
          [172, -28], [154, -45], [123, -55], [91, -50], [63, -38],
          [42, -21]
        ]
      },
      {
        name: "character-origin-ridge",
        summit: "Character",
        fill: "#476b4d",
        center: "rgba(206, 226, 172, 0.24)",
        rotation: 18,
        textureCount: 150,
        ridgeCount: 52,
        ridgeLength: 24,
        textureLonSpan: 45,
        textureLatSpan: 31,
        coastWidth: 2.1,
        points: [
          [-136, 18], [-122, 33], [-95, 36], [-73, 22],
          [-68, 3], [-88, -8], [-117, -2]
        ]
      },
      {
        name: "structure-foundation-plateau",
        summit: "Structure",
        fill: "#6e7652",
        center: "rgba(208, 176, 108, 0.28)",
        rotation: -7,
        textureCount: 190,
        ridgeCount: 38,
        ridgeLength: 22,
        textureLonSpan: 50,
        textureLatSpan: 29,
        coastWidth: 2.2,
        points: [
          [-36, 8], [-15, 19], [11, 12], [28, -5],
          [20, -23], [-4, -29], [-30, -16]
        ]
      },
      {
        name: "balance-transition-basin",
        summit: "Balance",
        fill: "#597f66",
        center: "rgba(120, 176, 138, 0.26)",
        rotation: 22,
        textureCount: 120,
        ridgeCount: 24,
        ridgeLength: 15,
        textureLonSpan: 36,
        textureLatSpan: 24,
        coastWidth: 1.9,
        points: [
          [10, -39], [30, -30], [48, -36], [54, -52],
          [40, -64], [18, -59]
        ]
      },
      {
        name: "stability-habitable-shelf",
        summit: "Stability",
        fill: "#54794f",
        center: "rgba(170, 210, 140, 0.24)",
        rotation: -26,
        textureCount: 150,
        ridgeCount: 30,
        ridgeLength: 18,
        textureLonSpan: 42,
        textureLatSpan: 26,
        coastWidth: 2.0,
        points: [
          [172, -2], [-172, 8], [-148, 2], [-135, -14],
          [-144, -31], [-169, -32], [174, -20]
        ]
      },
      {
        name: "peace-protected-green-blue-basin",
        summit: "Peace",
        fill: "#497c63",
        center: "rgba(108, 198, 170, 0.24)",
        rotation: 14,
        textureCount: 115,
        ridgeCount: 18,
        ridgeLength: 14,
        textureLonSpan: 36,
        textureLatSpan: 23,
        coastWidth: 1.8,
        points: [
          [-65, -42], [-45, -34], [-24, -42], [-19, -58],
          [-38, -69], [-62, -61]
        ]
      },
      {
        name: "joy-bright-archipelago",
        summit: "Joy",
        fill: "#629154",
        center: "rgba(226, 230, 136, 0.24)",
        rotation: -14,
        textureCount: 90,
        ridgeCount: 16,
        ridgeLength: 12,
        textureLonSpan: 34,
        textureLatSpan: 19,
        coastWidth: 1.7,
        points: [
          [-170, 32], [-153, 42], [-132, 39], [-119, 26],
          [-130, 14], [-154, 12]
        ]
      },
      {
        name: "dignity-mineral-crownland",
        summit: "Dignity",
        fill: "#6c694e",
        center: "rgba(225, 202, 142, 0.30)",
        rotation: 8,
        textureCount: 130,
        ridgeCount: 46,
        ridgeLength: 20,
        textureLonSpan: 38,
        textureLatSpan: 26,
        coastWidth: 2.0,
        points: [
          [138, 35], [160, 43], [179, 34], [174, 15],
          [152, 7], [132, 18]
        ]
      },
      {
        name: "free-will-frontier-edge",
        summit: "Free Will",
        fill: "#5b704b",
        center: "rgba(190, 150, 94, 0.26)",
        rotation: 29,
        textureCount: 120,
        ridgeCount: 36,
        ridgeLength: 20,
        textureLonSpan: 42,
        textureLatSpan: 24,
        coastWidth: 1.9,
        points: [
          [-10, 42], [12, 51], [39, 44], [51, 28],
          [32, 17], [4, 23]
        ]
      }
    ];
  }

  function drawNineSummitTerrain(ctx, random) {
    const landmasses = getLandmasses();

    drawShelfSystems(ctx, landmasses);

    drawReefArc(ctx, 108, -24, 75, 44, 115, 250, 128, random);
    drawReefArc(ctx, 146, 28, 42, 22, 190, 346, 56, random);
    drawReefArc(ctx, -146, 26, 42, 28, 8, 220, 72, random);
    drawReefArc(ctx, -148, -15, 35, 25, 40, 250, 58, random);
    drawReefArc(ctx, -42, -52, 37, 21, 160, 342, 42, random);

    landmasses.forEach(function drawLand(land) {
      drawLandBase(ctx, land);
      drawClippedTerrain(ctx, land, random);
    });

    drawPressureField(ctx, 112, -24, 28, 15, -9, random);
    drawPressureField(ctx, -10, -10, 20, 10, 12, random);
    drawPressureField(ctx, 152, 27, 17, 9, 8, random);

    drawFrontierBelt(ctx, random);

    const ridgeSystems = [
      [[64, -8], [84, 5], [112, 8], [140, -4], [162, -20]],
      [[73, -38], [98, -27], [122, -30], [150, -42]],
      [[-134, 21], [-112, 28], [-91, 18], [-76, 4]],
      [[137, 35], [153, 31], [171, 22]]
    ];

    ridgeSystems.forEach(function drawMainRidge(points, index) {
      drawStroke(
        ctx,
        points,
        index === 0 ? "rgba(240, 236, 216, 0.42)" : "rgba(228, 216, 184, 0.30)",
        index === 0 ? 3.8 : 2.6
      );

      drawStroke(
        ctx,
        points.map(function offset(point) {
          return [point[0] + 1.4, point[1] - 1.0];
        }),
        "rgba(43, 35, 28, 0.32)",
        index === 0 ? 2.4 : 1.8
      );
    });
  }

  function drawAtmosphereAndClouds(ctx, random) {
    drawCloudBands(ctx, random);
    drawSouthernLight(ctx);

    const polarNorth = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.22);
    polarNorth.addColorStop(0, "rgba(245,250,255,0.21)");
    polarNorth.addColorStop(1, "rgba(245,250,255,0)");

    ctx.fillStyle = polarNorth;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    const fineHaze = ctx.createRadialGradient(
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.50,
      SOURCE_HEIGHT * 0.20,
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.50,
      SOURCE_HEIGHT * 0.88
    );

    fineHaze.addColorStop(0.00, "rgba(255,255,255,0.02)");
    fineHaze.addColorStop(0.55, "rgba(255,255,255,0.016)");
    fineHaze.addColorStop(1.00, "rgba(130,204,255,0.07)");

    ctx.fillStyle = fineHaze;
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
      coherentPlanetTerrainV2: true,
      definitiveLandWaterSeparation: true,
      homeWorldExpression: true,
      australiaRelationship: "inspiration_signal_only",
      audraliaRelationship: "fictional_metaverse_home_world_construct",
      terrainLanguage: [
        "definitive_land_water_separation",
        "coherent_home_world_planet",
        "ocean_forward_world_read",
        "clear_coastlines",
        "shallow_water_shelves",
        "reef_edge_chains",
        "nine_summit_terrain_regions",
        "inland_pressure_field",
        "frontier_belt",
        "southern_horizon_light",
        "land_water_contrast"
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

    const random = makeSeededRandom(6350902);

    drawOceanBase(ctx, random);
    drawNineSummitTerrain(ctx, random);
    drawAtmosphereAndClouds(ctx, random);

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
      coherentPlanetTerrainV2: true,
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
      coherentPlanetTerrainV2: true,
      definitiveLandWaterSeparation: true,
      oceanForwardWorldRead: true,
      islandContinentEnergy: true,
      clearCoastlines: true,
      shallowWaterShelves: true,
      reefBoundarySignal: true,
      inlandPressureField: true,
      frontierBelt: true,
      southernHorizonAtmosphere: true,
      landWaterContrast: true,
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
