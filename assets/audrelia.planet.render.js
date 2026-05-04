/* /assets/audrelia.planet.render.js
   AUDRALIA_HOME_WORLD_PLANETARY_EXPRESSION_G2_RENDER_BODY_TERRAIN_TNT_v1

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   AUDRALIA_PLANET_PROFILE
   AUDRALIA_PLANET_TEXTURE_LAW
   AUDRALIA_PLANET_SURFACE_COLOR
   AUDRALIA_PLANET_EXTENSION_RECEIPT
   AUDRALIA_G2_RENDER_BODY_TERRAIN_EXPRESSION

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

  const VERSION = "AUDRALIA_HOME_WORLD_PLANETARY_EXPRESSION_G2_RENDER_BODY_TERRAIN_TNT_v1";

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
    ctx.fillStyle = fill;
    ctx.fill();

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
    const step = lonStart <= lonEnd ? 3 : -3;

    for (let lon = lonStart; step > 0 ? lon <= lonEnd : lon >= lonEnd; lon += step) {
      const wobble =
        Math.sin((lon + phase) * frequency) * amplitude +
        Math.sin((lon - phase * 0.45) * frequency * 1.9) * amplitude * 0.34;

      points.push([lon, latBase + wobble]);
    }

    drawStroke(ctx, points, stroke, width);
  }

  function drawShelf(ctx, land) {
    drawEllipse(
      ctx,
      land.lon,
      land.lat,
      land.lonRadius * 1.22,
      land.latRadius * 1.27,
      land.rotation,
      "rgba(105, 225, 226, 0.155)",
      "rgba(198, 248, 236, 0.075)",
      1.6
    );

    drawEllipse(
      ctx,
      land.lon,
      land.lat,
      land.lonRadius * 1.10,
      land.latRadius * 1.14,
      land.rotation,
      "rgba(136, 238, 220, 0.105)",
      "rgba(242, 238, 176, 0.095)",
      1.2
    );
  }

  function drawLand(ctx, land) {
    drawEllipse(
      ctx,
      land.lon,
      land.lat,
      land.lonRadius,
      land.latRadius,
      land.rotation,
      land.fill,
      land.stroke,
      land.lineWidth || 1.2
    );

    if (land.inner) {
      land.inner.forEach(function drawInner(part) {
        drawEllipse(
          ctx,
          land.lon + part.lon,
          land.lat + part.lat,
          land.lonRadius * part.lonScale,
          land.latRadius * part.latScale,
          land.rotation + (part.rotation || 0),
          part.fill,
          part.stroke || null,
          part.lineWidth || 1
        );
      });
    }
  }

  function drawReefArc(ctx, lon, lat, radiusLon, radiusLat, startDeg, endDeg, count, random) {
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = mix(startDeg, endDeg, t) * DEG;
      const reefLon = lon + Math.cos(angle) * radiusLon + (random() - 0.5) * 2.8;
      const reefLat = lat + Math.sin(angle) * radiusLat + (random() - 0.5) * 1.4;

      drawEllipse(
        ctx,
        reefLon,
        reefLat,
        0.55 + random() * 1.9,
        0.16 + random() * 0.52,
        random() * 180,
        "rgba(226, 244, 188, " + (0.10 + random() * 0.12).toFixed(4) + ")",
        null,
        0
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
      "rgba(188, 128, 76, 0.23)",
      "rgba(238, 182, 101, 0.12)",
      1
    );

    for (let i = 0; i < 42; i += 1) {
      const a = random() * TAU;
      const r = Math.sqrt(random());
      const pLon = lon + Math.cos(a) * lonRadius * r * 0.82;
      const pLat = lat + Math.sin(a) * latRadius * r * 0.62;

      drawEllipse(
        ctx,
        pLon,
        pLat,
        0.45 + random() * 3.4,
        0.14 + random() * 1.1,
        rotation + random() * 80 - 40,
        random() > 0.45
          ? "rgba(220, 176, 111, " + (0.06 + random() * 0.12).toFixed(4) + ")"
          : "rgba(96, 70, 54, " + (0.05 + random() * 0.09).toFixed(4) + ")",
        null,
        0
      );
    }
  }

  function drawFrontierBelt(ctx, random) {
    for (let i = 0; i < 9; i += 1) {
      const lat = -48 + i * 4.5 + (random() - 0.5) * 2.5;
      const lonStart = -172 + random() * 16;
      const lonEnd = 172 - random() * 16;

      drawRibbon(
        ctx,
        lonStart,
        lonEnd,
        lat,
        1.8 + random() * 1.2,
        0.055 + random() * 0.025,
        i % 2 === 0 ? "rgba(242, 199, 111, 0.105)" : "rgba(143, 240, 198, 0.085)",
        1.4 + random() * 1.4,
        random() * 100
      );
    }
  }

  function drawSouthernLight(ctx) {
    const south = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.58);
    south.addColorStop(0.00, "rgba(216, 236, 255, 0.22)");
    south.addColorStop(0.20, "rgba(143, 240, 198, 0.10)");
    south.addColorStop(0.44, "rgba(143, 101, 255, 0.055)");
    south.addColorStop(1.00, "rgba(143, 101, 255, 0)");

    ctx.fillStyle = south;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.58, SOURCE_WIDTH, SOURCE_HEIGHT * 0.42);

    const horizon = ctx.createLinearGradient(0, SOURCE_HEIGHT * 0.50, 0, SOURCE_HEIGHT);
    horizon.addColorStop(0.00, "rgba(255, 255, 255, 0)");
    horizon.addColorStop(0.42, "rgba(242, 199, 111, 0.028)");
    horizon.addColorStop(0.70, "rgba(130, 204, 255, 0.055)");
    horizon.addColorStop(1.00, "rgba(255, 255, 255, 0.12)");

    ctx.fillStyle = horizon;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.50, SOURCE_WIDTH, SOURCE_HEIGHT * 0.50);
  }

  function drawCloudBands(ctx, random) {
    for (let band = -58; band <= 62; band += 11) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble =
          Math.sin((lon + band * 2.5) * 0.08) * 3.4 +
          Math.sin((lon - band * 1.2) * 0.15) * 1.2;
        points.push([lon, band + wobble]);
      }

      drawStroke(
        ctx,
        points,
        band < -28 ? "rgba(255,255,255,0.095)" : "rgba(255,255,255,0.072)",
        band < -28 ? 3.4 : 2.4
      );
    }

    for (let i = 0; i < 680; i += 1) {
      const southernBias = random() > 0.56 ? 1 : 0;
      const lat = southernBias
        ? -72 + random() * 64
        : -62 + random() * 124;

      drawEllipse(
        ctx,
        -180 + random() * 360,
        lat,
        1 + random() * 10,
        0.35 + random() * 2.2,
        random() * 180,
        "rgba(255,255,255," + (0.018 + random() * 0.09).toFixed(4) + ")"
      );
    }
  }

  function drawOceanTexture(ctx, random) {
    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    ocean.addColorStop(0.00, "#071b45");
    ocean.addColorStop(0.18, "#0d3f76");
    ocean.addColorStop(0.34, "#0b6a93");
    ocean.addColorStop(0.50, "#0c7c98");
    ocean.addColorStop(0.66, "#0b4f7d");
    ocean.addColorStop(0.84, "#082d5a");
    ocean.addColorStop(1.00, "#04152f");

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    const equatorialLight = ctx.createRadialGradient(
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.45,
      SOURCE_HEIGHT * 0.04,
      SOURCE_WIDTH * 0.50,
      SOURCE_HEIGHT * 0.45,
      SOURCE_HEIGHT * 0.68
    );
    equatorialLight.addColorStop(0.00, "rgba(90, 226, 218, 0.14)");
    equatorialLight.addColorStop(0.42, "rgba(90, 226, 218, 0.055)");
    equatorialLight.addColorStop(1.00, "rgba(90, 226, 218, 0)");

    ctx.fillStyle = equatorialLight;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < 2600; i += 1) {
      const lat = -76 + random() * 152;
      const alpha = lat < -35 ? 0.018 + random() * 0.075 : 0.014 + random() * 0.055;

      drawEllipse(
        ctx,
        -180 + random() * 360,
        lat,
        0.6 + random() * 8.8,
        0.20 + random() * 2.6,
        random() * 180,
        "rgba(145,226,255," + alpha.toFixed(4) + ")"
      );
    }

    for (let i = 0; i < 120; i += 1) {
      drawRibbon(
        ctx,
        -180,
        180,
        -70 + random() * 140,
        0.8 + random() * 1.8,
        0.042 + random() * 0.055,
        random() > 0.5 ? "rgba(125, 225, 255, 0.035)" : "rgba(255, 255, 255, 0.026)",
        0.7 + random() * 1.1,
        random() * 200
      );
    }
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
      homeWorldExpression: true,
      australiaRelationship: "inspiration_signal_only",
      audraliaRelationship: "fictional_metaverse_home_world_construct",
      terrainLanguage: [
        "ocean_forward_world_read",
        "island_continent_energy",
        "coastal_shelf",
        "reef_edge_signal",
        "inland_pressure_field",
        "frontier_belt",
        "southern_horizon_light",
        "land_water_contrast"
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

    const random = makeSeededRandom(6350101);

    drawOceanTexture(ctx, random);

    const landmasses = [
      {
        name: "central-island-continent",
        lon: 118,
        lat: -24,
        lonRadius: 52,
        latRadius: 27,
        rotation: -11,
        fill: "rgba(104, 118, 86, 0.92)",
        stroke: "rgba(242, 228, 170, 0.16)",
        lineWidth: 1.6,
        inner: [
          {
            lon: -10,
            lat: -2,
            lonScale: 0.52,
            latScale: 0.50,
            rotation: 16,
            fill: "rgba(152, 119, 84, 0.35)"
          },
          {
            lon: 12,
            lat: 5,
            lonScale: 0.36,
            latScale: 0.34,
            rotation: -22,
            fill: "rgba(74, 112, 84, 0.38)"
          },
          {
            lon: 7,
            lat: -8,
            lonScale: 0.28,
            latScale: 0.24,
            rotation: 34,
            fill: "rgba(190, 156, 104, 0.24)"
          }
        ]
      },
      {
        name: "western-frontier-plateau",
        lon: 54,
        lat: -19,
        lonRadius: 22,
        latRadius: 13,
        rotation: 18,
        fill: "rgba(134, 112, 88, 0.84)",
        stroke: "rgba(235, 205, 128, 0.12)",
        lineWidth: 1.2,
        inner: [
          {
            lon: 0,
            lat: 0,
            lonScale: 0.55,
            latScale: 0.40,
            rotation: 14,
            fill: "rgba(184, 138, 84, 0.22)"
          }
        ]
      },
      {
        name: "northeast-green-belt",
        lon: 162,
        lat: -7,
        lonRadius: 22,
        latRadius: 15,
        rotation: -28,
        fill: "rgba(70, 118, 92, 0.88)",
        stroke: "rgba(174, 239, 196, 0.12)",
        lineWidth: 1.1,
        inner: [
          {
            lon: -4,
            lat: 2,
            lonScale: 0.42,
            latScale: 0.36,
            rotation: -18,
            fill: "rgba(92, 139, 98, 0.30)"
          }
        ]
      },
      {
        name: "southern-cold-arc",
        lon: 102,
        lat: -54,
        lonRadius: 38,
        latRadius: 9,
        rotation: -4,
        fill: "rgba(104, 126, 112, 0.76)",
        stroke: "rgba(218, 246, 242, 0.14)",
        lineWidth: 1.1,
        inner: [
          {
            lon: 8,
            lat: 1,
            lonScale: 0.45,
            latScale: 0.44,
            rotation: 12,
            fill: "rgba(210, 229, 224, 0.15)"
          }
        ]
      },
      {
        name: "eastern-reef-lands",
        lon: -156,
        lat: -28,
        lonRadius: 24,
        latRadius: 11,
        rotation: 24,
        fill: "rgba(72, 112, 94, 0.78)",
        stroke: "rgba(216, 244, 188, 0.14)",
        lineWidth: 1,
        inner: []
      },
      {
        name: "northwest-archipelago",
        lon: -76,
        lat: 18,
        lonRadius: 30,
        latRadius: 13,
        rotation: -16,
        fill: "rgba(90, 128, 86, 0.78)",
        stroke: "rgba(204, 240, 190, 0.11)",
        lineWidth: 1,
        inner: []
      },
      {
        name: "small-equatorial-chain",
        lon: -20,
        lat: -4,
        lonRadius: 18,
        latRadius: 7,
        rotation: 9,
        fill: "rgba(84, 120, 90, 0.70)",
        stroke: "rgba(204, 240, 190, 0.10)",
        lineWidth: 1,
        inner: []
      }
    ];

    landmasses.forEach(function shelfFirst(land) {
      drawShelf(ctx, land);
    });

    drawReefArc(ctx, 122, -24, 67, 38, 126, 250, 96, random);
    drawReefArc(ctx, 162, -8, 30, 21, -72, 130, 48, random);
    drawReefArc(ctx, -156, -28, 31, 18, 38, 236, 54, random);
    drawReefArc(ctx, 102, -54, 46, 15, 196, 348, 34, random);

    landmasses.forEach(function drawLandmass(land) {
      drawLand(ctx, land);
    });

    drawPressureField(ctx, 114, -27, 28, 14, -9, random);
    drawPressureField(ctx, 52, -20, 14, 7, 20, random);

    for (let i = 0; i < 90; i += 1) {
      const baseLon = 118 + (random() - 0.5) * 94;
      const baseLat = -24 + (random() - 0.5) * 42;
      const angle = -12 + random() * 64;
      const length = 8 + random() * 34;
      const points = [];

      for (let p = 0; p < 12; p += 1) {
        const t = p / 11;
        points.push([
          baseLon + Math.cos(angle * DEG) * length * (t - 0.5) + Math.sin(t * TAU) * 1.9,
          baseLat + Math.sin(angle * DEG) * length * (t - 0.5) + Math.cos(t * TAU) * 1.1
        ]);
      }

      drawStroke(
        ctx,
        points,
        random() > 0.55 ? "rgba(238, 224, 190, 0.18)" : "rgba(110, 76, 52, 0.13)",
        1.4 + random() * 1.8
      );
    }

    drawFrontierBelt(ctx, random);

    for (let i = 0; i < 720; i += 1) {
      const landBias = random();
      const lon =
        landBias > 0.55
          ? 118 + (random() - 0.5) * 122
          : -180 + random() * 360;
      const lat =
        landBias > 0.55
          ? -28 + (random() - 0.5) * 72
          : -66 + random() * 132;

      drawEllipse(
        ctx,
        lon,
        lat,
        0.35 + random() * 2.5,
        0.15 + random() * 0.92,
        random() * 180,
        random() > 0.52
          ? "rgba(255,255,255," + (0.018 + random() * 0.055).toFixed(4) + ")"
          : "rgba(16,22,30," + (0.018 + random() * 0.05).toFixed(4) + ")"
      );
    }

    drawCloudBands(ctx, random);
    drawSouthernLight(ctx);

    const polarNorth = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.22);
    polarNorth.addColorStop(0, "rgba(245,250,255,0.24)");
    polarNorth.addColorStop(1, "rgba(245,250,255,0)");

    ctx.fillStyle = polarNorth;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    const polarSouth = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.72);
    polarSouth.addColorStop(0, "rgba(245,250,255,0.34)");
    polarSouth.addColorStop(0.35, "rgba(143,240,198,0.10)");
    polarSouth.addColorStop(1, "rgba(245,250,255,0)");

    ctx.fillStyle = polarSouth;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.72, SOURCE_WIDTH, SOURCE_HEIGHT * 0.28);

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
      oceanForwardWorldRead: true,
      islandContinentEnergy: true,
      coastalShelfSignal: true,
      reefBoundarySignal: true,
      inlandPressureField: true,
      frontierBelt: true,
      southernHorizonAtmosphere: true,
      landWaterContrast: true,
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
