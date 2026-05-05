/*
  /assets/audralia/audralia.planet.render.js
  AUDRALIA_G2_DISTRIBUTED_LAND_SEGMENTATION_TNT_v1

  Purpose:
  - Reduce the oversized single land body.
  - Split Audralia into five distributed land bodies plus one South Pole ice-only segment.
  - Preserve G2 parent-consumed terrain + hydration + climate.
  - Preserve G3 ecology preparation without falsely claiming G3 completion.
  - Preserve Audralia identity, API compatibility, and route/instrument handoff.

  Land law:
  - 5 land bodies total.
  - 1 dominant non-polar land body remains near the current visual position.
  - 3 additional non-polar distributed land bodies / island-chain structures.
  - 1 North Pole land body.
  - South Pole is ice only, not a landmass.

  Scope:
  - Audralia parent render-body authority only.
  - No Earth, Showroom selector, CSS, Gauges, Products, Sun, Moon, route shell, or global file mutation.

  Public API preserved:
  - createProfile
  - buildTexture
  - sampleSurface
  - renderSurface
  - getStatus
  - registerExtension
*/

(function () {
  "use strict";

  const VERSION = "AUDRALIA_G2_DISTRIBUTED_LAND_SEGMENTATION_TNT_v1";

  const BODY = Object.freeze({
    id: "audralia",
    legacyId: "audrelia",
    label: "Audralia",
    publicLabel: "Audralia",
    classification: "constructed-home-world-body",
    parentAuthority: "/assets/audralia/audralia.planet.render.js",
    generation: "G2_PARENT_CONSUMED_DISTRIBUTED_LAND",
    generationClaim: "G2",
    generation3Prepared: true,
    generation3Claimed: false,
    generation4Claimed: false
  });

  const CONTRACT = Object.freeze({
    landBodies: 5,
    visibleSegments: 6,
    southPoleIceOnly: true,
    northPoleLandBody: true,
    dominantLandReduced: true,
    noSingleOversizedLandPlate: true,
    noCrossSeamContinentChord: true,
    terrainFoundationPreserved: true,
    hydrationConsumed: true,
    climateConsumed: true,
    parentWorldBodyActive: true,
    ecologyPrepared: true,
    ecologyClaimed: false,
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
    imageGeneration: false,
    staticPictureReplacement: false,
    hybridBondStatus: "PASS"
  });

  const CHILDREN = Object.freeze({
    terrain: {
      status: "CONSUMED_BY_PARENT",
      generationRole: "G1_TERRAFORM_FOUNDATION"
    },
    hydration: {
      status: "CONSUMED_BY_PARENT",
      generationRole: "G2_HYDRATION_CHILD"
    },
    climate: {
      status: "CONSUMED_BY_PARENT",
      generationRole: "G2_CLIMATE_CHILD"
    },
    ecology: {
      status: "PREPARED_NOT_CLAIMED",
      generationRole: "G3_ECOLOGY_PREP"
    },
    fauna: {
      status: "NOT_BUILT",
      generationRole: "G4_FAUNA_FUTURE"
    }
  });

  const LAND_SEGMENTS = Object.freeze([
    {
      id: "dominant-mainland",
      type: "land",
      role: "dominant_current_position_body",
      lon: 0.44,
      lat: 0.49,
      radiusX: 0.145,
      radiusY: 0.185,
      height: 0.58,
      moisture: 0.08,
      climate: "temperate-convergence",
      priority: 1
    },
    {
      id: "western-weathered-body",
      type: "land",
      role: "secondary_weathered_continent",
      lon: 0.18,
      lat: 0.48,
      radiusX: 0.105,
      radiusY: 0.155,
      height: 0.44,
      moisture: 0.02,
      climate: "weathered-western-basin",
      priority: 2
    },
    {
      id: "eastern-shelf-body",
      type: "land",
      role: "temperate_shelf_continent",
      lon: 0.69,
      lat: 0.51,
      radiusX: 0.11,
      radiusY: 0.145,
      height: 0.42,
      moisture: 0.14,
      climate: "temperate-eastern-shelf",
      priority: 3
    },
    {
      id: "southern-archipelago",
      type: "archipelago",
      role: "broken_island_chain",
      lon: 0.58,
      lat: 0.68,
      radiusX: 0.075,
      radiusY: 0.055,
      height: 0.30,
      moisture: 0.20,
      islandCount: 9,
      climate: "warm-reef-archipelago",
      priority: 4
    },
    {
      id: "north-polar-land",
      type: "land",
      role: "north_pole_land_body",
      lon: 0.5,
      lat: 0.075,
      radiusX: 0.18,
      radiusY: 0.075,
      height: 0.34,
      moisture: -0.04,
      climate: "north-polar-mineral-land",
      polar: "north",
      priority: 5
    },
    {
      id: "south-polar-ice",
      type: "ice",
      role: "south_pole_ice_only",
      lon: 0.5,
      lat: 0.94,
      radiusX: 0.5,
      radiusY: 0.085,
      height: 0,
      moisture: 0,
      climate: "south-polar-ice-only",
      polar: "south",
      priority: 6
    }
  ]);

  const NINE_SUMMITS = Object.freeze([
    { key: "character", index: 1, lon: 0.34, lat: 0.33, radius: 0.09, elevation: 0.22, moisture: -0.04 },
    { key: "structure", index: 2, lon: 0.43, lat: 0.42, radius: 0.11, elevation: 0.16, moisture: -0.02 },
    { key: "balance", index: 3, lon: 0.52, lat: 0.50, radius: 0.10, elevation: 0.04, moisture: 0.10 },
    { key: "stability", index: 4, lon: 0.66, lat: 0.45, radius: 0.10, elevation: 0.06, moisture: 0.14 },
    { key: "peace", index: 5, lon: 0.36, lat: 0.58, radius: 0.09, elevation: -0.02, moisture: 0.22 },
    { key: "joy", index: 6, lon: 0.58, lat: 0.68, radius: 0.09, elevation: -0.04, moisture: 0.25 },
    { key: "dignity", index: 7, lon: 0.53, lat: 0.28, radius: 0.08, elevation: 0.24, moisture: -0.10 },
    { key: "free-will", index: 8, lon: 0.21, lat: 0.52, radius: 0.10, elevation: 0.08, moisture: 0.02 },
    { key: "love", index: 9, lon: 0.47, lat: 0.50, radius: 0.12, elevation: 0.06, moisture: 0.16 }
  ]);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function wrapDistance(a, b) {
    const direct = Math.abs(a - b);
    return Math.min(direct, 1 - direct);
  }

  function hash2(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }

  function valueNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const d = hash2(xi + 1, yi + 1);

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  function fbm(x, y, octaves) {
    let total = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let normalization = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency) * amplitude;
      normalization += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return total / normalization;
  }

  function ellipseInfluence(x, y, segment, noiseScale) {
    const dx = wrapDistance(x, segment.lon) / segment.radiusX;
    const dy = Math.abs(y - segment.lat) / segment.radiusY;
    const d = Math.sqrt(dx * dx + dy * dy);

    const n =
      (fbm(x * noiseScale + segment.priority * 11, y * noiseScale + segment.priority * 17, 4) - 0.5) *
      0.24;

    const eroded = d + n;
    return smoothstep(1.12, 0.34, eroded);
  }

  function archipelagoInfluence(x, y, segment) {
    let height = 0;
    let moisture = 0;
    let strength = 0;

    for (let i = 0; i < segment.islandCount; i += 1) {
      const lon = wrap01(segment.lon + (i - 4) * 0.028 + Math.sin(i * 1.73) * 0.011);
      const lat = clamp(segment.lat + Math.cos(i * 1.17) * 0.038 + (i % 3 - 1) * 0.01, 0.08, 0.88);
      const radiusX = segment.radiusX * (0.34 + (i % 4) * 0.055);
      const radiusY = segment.radiusY * (0.46 + (i % 3) * 0.055);

      const local = ellipseInfluence(x, y, {
        lon,
        lat,
        radiusX,
        radiusY,
        priority: segment.priority + i,
        height: segment.height,
        moisture: segment.moisture
      }, 76);

      if (local > 0) {
        height += segment.height * local;
        moisture += segment.moisture * local;
        strength = Math.max(strength, local);
      }
    }

    return { height, moisture, strength };
  }

  function landDistribution(x, y) {
    let elevation = -0.46;
    let moisture = 0;
    let dominantSegment = "deep-ocean";
    let dominantStrength = 0;
    let landBodyCounted = false;
    let southIceStrength = 0;

    for (let i = 0; i < LAND_SEGMENTS.length; i += 1) {
      const segment = LAND_SEGMENTS[i];

      if (segment.type === "ice") {
        const iceStrength = ellipseInfluence(x, y, segment, 28);
        southIceStrength = Math.max(southIceStrength, iceStrength);
        continue;
      }

      let influence;

      if (segment.type === "archipelago") {
        const chain = archipelagoInfluence(x, y, segment);
        influence = chain.strength;
        elevation += chain.height;
        moisture += chain.moisture;
      } else {
        influence = ellipseInfluence(x, y, segment, 38);
        elevation += segment.height * influence;
        moisture += segment.moisture * influence;
      }

      if (influence > dominantStrength) {
        dominantStrength = influence;
        dominantSegment = segment.id;
      }

      if (influence > 0.18) {
        landBodyCounted = true;
      }
    }

    return {
      elevation,
      moisture,
      dominantSegment,
      dominantStrength,
      landBodyCounted,
      southIceStrength
    };
  }

  function summitInfluence(x, y, landStrength) {
    let elevation = 0;
    let moisture = 0;
    let regionKey = "open-ocean";
    let regionStrength = 0;

    for (let i = 0; i < NINE_SUMMITS.length; i += 1) {
      const summit = NINE_SUMMITS[i];
      const dx = wrapDistance(x, summit.lon) / summit.radius;
      const dy = Math.abs(y - summit.lat) / summit.radius;
      const d = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.max(0, 1 - d);

      if (strength > 0) {
        const shaped = strength * strength * (3 - 2 * strength);
        const landLimited = shaped * clamp(landStrength * 1.35, 0, 1);

        elevation += summit.elevation * landLimited;
        moisture += summit.moisture * landLimited;

        if (landLimited > regionStrength) {
          regionStrength = landLimited;
          regionKey = summit.key;
        }
      }
    }

    return { elevation, moisture, regionKey, regionStrength };
  }

  function ridgeField(x, y, landStrength) {
    const folded =
      1 -
      Math.abs(
        Math.sin((x * 2.15 - y * 1.3 + fbm(x * 9 + 4, y * 9 + 7, 4) * 0.13) * Math.PI)
      );

    const ancient =
      1 -
      Math.abs(
        Math.sin((x * 1.5 + y * 0.84 + fbm(x * 11 + 8, y * 10 + 3, 4) * 0.10) * Math.PI)
      );

    return Math.pow(Math.max(folded, ancient * 0.78), 4) * clamp(landStrength * 1.25, 0, 1);
  }

  function calculateSurface(xInput, yInput) {
    const x = wrap01(Number(xInput) || 0);
    const y = clamp(Number(yInput) || 0, 0, 1);

    const latFromEquator = Math.abs(y - 0.5) * 2;
    const northPolar = smoothstep(0.78, 0.98, 1 - y);
    const southPolar = smoothstep(0.82, 0.98, y);
    const equatorial = 1 - smoothstep(0.08, 0.52, Math.abs(y - 0.5));

    const distribution = landDistribution(x, y);
    const landStrength = clamp(distribution.dominantStrength, 0, 1);
    const summit = summitInfluence(x, y, landStrength);
    const ridges = ridgeField(x, y, landStrength);

    const macro = fbm(x * 3.5, y * 2.8, 5);
    const erosion = fbm(x * 22 + 19, y * 18 + 7, 5);
    const micro = fbm(x * 74 + 2, y * 58 + 11, 3);

    let elevation =
      distribution.elevation +
      summit.elevation +
      ridges * 0.14 +
      (macro - 0.5) * 0.14 * clamp(landStrength + 0.18, 0, 1) +
      (erosion - 0.5) * 0.09 * clamp(landStrength + 0.2, 0, 1) +
      (micro - 0.5) * 0.025 * clamp(landStrength + 0.1, 0, 1);

    const southIce = southPolar > 0.32 || distribution.southIceStrength > 0.32;

    if (southIce) {
      elevation = Math.min(elevation, -0.08);
    }

    elevation = clamp(elevation, -0.96, 0.9);

    const isLand = elevation >= 0 && !southIce;
    const isWater = !isLand && !southIce;
    const isIce = southIce || (!isWater && northPolar > 0.66 && elevation > -0.05);

    const depth = isWater ? clamp(Math.abs(elevation), 0, 1) : 0;
    const coast = isLand ? 1 - clamp(Math.abs(elevation) / 0.16, 0, 1) : 0;
    const shelf = isWater && elevation > -0.22 ? 1 - Math.abs(elevation + 0.09) / 0.13 : 0;
    const reef =
      shelf *
      equatorial *
      smoothstep(0.48, 0.78, fbm(x * 44 + 5, y * 44 + 17, 3));

    const aridity =
      smoothstep(0.18, 0.48, latFromEquator) *
      (1 - smoothstep(0.58, 0.92, latFromEquator));

    const mountainCold = isLand ? smoothstep(0.28, 0.62, elevation) : 0;

    const moisture = clamp(
      0.46 +
        distribution.moisture +
        summit.moisture +
        equatorial * 0.18 -
        aridity * 0.22 +
        coast * 0.12 -
        mountainCold * 0.08 +
        (fbm(x * 7 + 6, y * 9 + 3, 4) - 0.5) * 0.16,
      0,
      1
    );

    let biome = "deep-ocean";

    if (isIce && southIce) biome = "south-polar-ice-only";
    else if (isIce) biome = "north-polar-land-ice";
    else if (isWater && shelf > 0.25) biome = reef > 0.35 ? "reef-shelf" : "shallow-shelf";
    else if (isWater) biome = depth > 0.48 ? "deep-ocean" : "open-ocean";
    else if (isLand && elevation > 0.42) biome = "weathered-mountain-ridge";
    else if (isLand && moisture < 0.27) biome = "ancient-dry-interior";
    else if (isLand && moisture > 0.64 && equatorial > 0.35) biome = "humid-green-belt";
    else if (isLand && moisture > 0.5) biome = "temperate-green-coast";
    else if (isLand) biome = "olive-weathered-basin";

    return {
      x,
      y,
      elevation,
      isLand,
      isWater,
      isIce,
      southIce,
      depth,
      shelf: clamp(shelf, 0, 1),
      reef: clamp(reef, 0, 1),
      coast: clamp(coast, 0, 1),
      ridges: clamp(ridges, 0, 1),
      northPolar: clamp(northPolar, 0, 1),
      southPolar: clamp(southPolar, 0, 1),
      moisture,
      biome,
      segment: distribution.dominantSegment,
      segmentStrength: distribution.dominantStrength,
      summitRegion: summit.regionKey,
      summitStrength: summit.regionStrength,
      generation: BODY.generation,
      parentConsumption: "terrain+hydration+climate",
      ecologyPrep: true
    };
  }

  function colorToBytes(hex) {
    const normalized = String(hex || "#000000").replace("#", "");
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function mixColor(a, b, amount) {
    const colorA = typeof a === "string" ? colorToBytes(a) : a;
    const colorB = typeof b === "string" ? colorToBytes(b) : b;
    const t = clamp(amount, 0, 1);

    return {
      r: Math.round(lerp(colorA.r, colorB.r, t)),
      g: Math.round(lerp(colorA.g, colorB.g, t)),
      b: Math.round(lerp(colorA.b, colorB.b, t))
    };
  }

  function rgba(color, alpha) {
    return "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
  }

  function surfaceColor(surface) {
    if (surface.isIce) {
      if (surface.southIce) {
        return mixColor("#dfeff7", "#ffffff", 0.48 + surface.southPolar * 0.28);
      }

      return mixColor("#d3e4ea", "#f7fbff", 0.34 + surface.northPolar * 0.22);
    }

    if (surface.isWater) {
      const deep = colorToBytes("#061b4d");
      const mid = colorToBytes("#145c94");
      const shelf = colorToBytes("#2bb9c2");
      const reef = colorToBytes("#72d6c3");

      let color = mixColor(mid, deep, clamp(surface.depth * 1.18, 0, 1));
      color = mixColor(color, shelf, surface.shelf * 0.72);
      color = mixColor(color, reef, surface.reef * 0.66);

      return color;
    }

    const dry = colorToBytes("#b8894f");
    const basin = colorToBytes("#8f8b57");
    const green = colorToBytes("#3f8c58");
    const humid = colorToBytes("#2d7d4e");
    const ridge = colorToBytes("#817363");
    const mineral = colorToBytes("#a89171");

    let color;

    if (surface.biome === "ancient-dry-interior") color = dry;
    else if (surface.biome === "humid-green-belt") color = humid;
    else if (surface.biome === "temperate-green-coast") color = green;
    else if (surface.biome === "weathered-mountain-ridge") color = ridge;
    else color = basin;

    color = mixColor(color, mineral, surface.ridges * 0.24);

    if (surface.coast > 0.35) {
      color = mixColor(color, "#d1b878", surface.coast * 0.18);
    }

    if (surface.summitStrength > 0.35) {
      color = mixColor(color, "#c2a163", surface.summitStrength * 0.12);
    }

    return color;
  }

  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.body = BODY.id;
    canvas.dataset.legacyBody = BODY.legacyId;
    canvas.dataset.label = BODY.label;
    canvas.dataset.version = VERSION;
    canvas.dataset.generation = BODY.generation;
    canvas.dataset.landBodies = String(CONTRACT.landBodies);
    canvas.dataset.visibleSegments = String(CONTRACT.visibleSegments);
    canvas.dataset.southPole = "ice-only";
    canvas.dataset.northPole = "land-body";
    canvas.dataset.visualPass = CONTRACT.visualPass;
    return canvas;
  }

  function buildTexture(options) {
    const config = options || {};
    const width = Math.max(256, Math.min(4096, Number(config.width) || 1024));
    const height = Math.max(128, Math.min(2048, Number(config.height) || 512));

    const canvas =
      config.canvas && typeof config.canvas.getContext === "function"
        ? config.canvas
        : createCanvas(width, height);

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: false });
    const image = context.createImageData(width, height);
    const data = image.data;

    for (let py = 0; py < height; py += 1) {
      const y = py / (height - 1);

      for (let px = 0; px < width; px += 1) {
        const x = px / width;
        const surface = calculateSurface(x, y);
        const color = surfaceColor(surface);

        const textureNoise = fbm(x * 96 + 41, y * 96 + 83, 2) - 0.5;
        const light =
          0.88 +
          surface.ridges * 0.08 +
          surface.coast * 0.04 +
          surface.reef * 0.06 -
          surface.depth * 0.035 +
          textureNoise * 0.052;

        const index = (py * width + px) * 4;
        data[index] = clamp(Math.round(color.r * light), 0, 255);
        data[index + 1] = clamp(Math.round(color.g * light), 0, 255);
        data[index + 2] = clamp(Math.round(color.b * light), 0, 255);
        data[index + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    canvas.dataset.textureStatus = "AUDRALIA_G2_DISTRIBUTED_LAND_TEXTURE_READY";
    canvas.dataset.landDistribution = "five-land-bodies-plus-south-pole-ice";
    canvas.dataset.staticPictureReplacement = "false";
    canvas.dataset.imageGeneration = "false";

    if (config.returnObject === true) {
      return {
        canvas,
        width,
        height,
        body: BODY.id,
        legacyId: BODY.legacyId,
        label: BODY.label,
        version: VERSION,
        generation: BODY.generation,
        landSegments: LAND_SEGMENTS,
        status: getStatus()
      };
    }

    return canvas;
  }

  function normalizeSampleArgs(input, y) {
    if (typeof input === "object" && input !== null) {
      if (Number.isFinite(input.lon) || Number.isFinite(input.lat)) {
        return {
          x: wrap01((Number(input.lon) || 0) / 360 + 0.5),
          y: clamp(0.5 - (Number(input.lat) || 0) / 180, 0, 1)
        };
      }

      return {
        x: wrap01(Number(input.x) || 0),
        y: clamp(Number(input.y) || 0, 0, 1)
      };
    }

    return {
      x: wrap01(Number(input) || 0),
      y: clamp(Number(y) || 0, 0, 1)
    };
  }

  function sampleSurface(input, y) {
    const point = normalizeSampleArgs(input, y);
    return calculateSurface(point.x, point.y);
  }

  function drawWrappedStrip(ctx, texture, phase, sy, sh, dx, dy, dw, dh) {
    if (!texture || !texture.width || !texture.height || dw <= 0 || dh <= 0) return;

    const sourceWidth = texture.width;
    const sourceHeight = texture.height;
    const start = wrap01(phase) * sourceWidth;
    const safeSy = clamp(sy, 0, sourceHeight - 1);
    const safeSh = clamp(sh, 1, sourceHeight - safeSy);

    const firstSourceWidth = sourceWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(
      texture,
      start,
      safeSy,
      firstSourceWidth,
      safeSh,
      dx,
      dy,
      firstDestWidth,
      dh
    );

    if (secondDestWidth > 0.5) {
      ctx.drawImage(
        texture,
        0,
        safeSy,
        start,
        safeSh,
        dx + firstDestWidth,
        dy,
        secondDestWidth,
        dh
      );
    }
  }

  function drawSphere(ctx, texture, phase) {
    const size = ctx.canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;
    const stripHeight = Math.max(1, Math.floor(size / 420));
    const sourceHeight = texture.height || 512;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let y = -radius; y <= radius; y += stripHeight) {
      const yMid = y + stripHeight / 2;
      const normalizedY = yMid / radius;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const destWidth = radius * 2 * chord;
      const destX = cx - destWidth / 2;
      const destY = cy + y;
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (sourceHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.9));

      drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const light = ctx.createRadialGradient(
      cx - radius * 0.36,
      cy - radius * 0.34,
      radius * 0.03,
      cx,
      cy,
      radius * 1.16
    );

    light.addColorStop(0, "rgba(255,255,255,0.20)");
    light.addColorStop(0.34, "rgba(255,255,255,0.06)");
    light.addColorStop(0.72, "rgba(0,0,0,0.10)");
    light.addColorStop(1, "rgba(0,0,0,0.42)");

    ctx.fillStyle = light;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const rim = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(0.82, "rgba(10,25,44,0.08)");
    rim.addColorStop(1, "rgba(10,20,38,0.34)");

    ctx.fillStyle = rim;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(176, 218, 255, 0.28)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function createReceiptNode(status) {
    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-distributed-land-receipt";
    receipt.dataset.body = BODY.id;
    receipt.dataset.legacyBody = BODY.legacyId;
    receipt.dataset.label = BODY.label;
    receipt.dataset.version = VERSION;
    receipt.dataset.generation = BODY.generation;
    receipt.dataset.landBodies = String(CONTRACT.landBodies);
    receipt.dataset.visibleSegments = String(CONTRACT.visibleSegments);
    receipt.dataset.southPole = "ice-only";
    receipt.dataset.northPole = "land-body";
    receipt.dataset.visualPass = CONTRACT.visualPass;
    receipt.textContent = [
      "AUDRALIA_LAND_DISTRIBUTION=5_LAND_BODIES_PLUS_SOUTH_POLE_ICE",
      "DOMINANT_MAINLAND=REDUCED",
      "NORTH_POLE=LAND_BODY",
      "SOUTH_POLE=ICE_ONLY",
      "VISUAL_PASS=HELD"
    ].join(" · ");

    if (status && status.mountId) {
      receipt.dataset.mountId = status.mountId;
    }

    return receipt;
  }

  function renderSurface(mount, options) {
    const config = options || {};
    const target =
      typeof mount === "string"
        ? document.querySelector(mount)
        : mount && mount.nodeType === 1
          ? mount
          : null;

    const texture = buildTexture({
      width: Number(config.textureWidth) || 1024,
      height: Number(config.textureHeight) || 512
    });

    const size = Math.max(320, Math.min(1200, Number(config.size) || 720));
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.className = [
      "audralia-world-body-canvas",
      "audralia-g2-parent-consumed",
      "audralia-distributed-land-body",
      "audralia-g3-ecology-prep"
    ].join(" ");

    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Audralia Generation 2 distributed land world body with five land bodies and South Pole ice only"
    );

    canvas.style.width = "100%";
    canvas.style.maxWidth = config.maxWidth || "720px";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.display = "block";
    canvas.style.borderRadius = "50%";
    canvas.style.objectFit = "cover";
    canvas.style.background = "transparent";

    drawSphere(ctx, texture, Number(config.phase) || 0.18);

    const status = getStatus();
    status.mountId = target && target.id ? target.id : "";

    if (target) {
      target.replaceChildren();

      target.dataset.body = BODY.id;
      target.dataset.legacyBody = BODY.legacyId;
      target.dataset.label = BODY.label;
      target.dataset.version = VERSION;
      target.dataset.generation = BODY.generation;
      target.dataset.landBodies = String(CONTRACT.landBodies);
      target.dataset.visibleSegments = String(CONTRACT.visibleSegments);
      target.dataset.southPole = "ice-only";
      target.dataset.northPole = "land-body";
      target.dataset.parentConsumption = "terrain-hydration-climate";
      target.dataset.g3EcologyPrep = "true";
      target.dataset.g3Claimed = "false";
      target.dataset.visualPass = CONTRACT.visualPass;

      target.appendChild(canvas);

      if (config.receipt !== false) {
        target.appendChild(createReceiptNode(status));
      }
    }

    return canvas;
  }

  function createProfile(overrides) {
    return Object.assign(
      {
        id: BODY.id,
        legacyId: BODY.legacyId,
        label: BODY.label,
        publicLabel: BODY.publicLabel,
        classification: BODY.classification,
        parentAuthority: BODY.parentAuthority,
        version: VERSION,
        generation: BODY.generation,
        generationClaim: BODY.generationClaim,
        generation3Prepared: true,
        generation3Claimed: false,
        generation4Claimed: false,
        landBodies: CONTRACT.landBodies,
        visibleSegments: CONTRACT.visibleSegments,
        landLaw: "five-land-bodies-plus-south-pole-ice",
        landSegments: LAND_SEGMENTS,
        activeDownstreamChildren: ["terrain", "hydration", "climate"],
        consumedChildren: ["terrain", "hydration", "climate"],
        preparedChildren: ["ecology"],
        futureChildren: ["fauna"],
        children: CHILDREN,
        contract: CONTRACT,
        nineSummits: NINE_SUMMITS.map(function (region) {
          return {
            index: region.index,
            key: region.key
          };
        }),
        api: {
          createProfile: true,
          buildTexture: true,
          sampleSurface: true,
          renderSurface: true,
          getStatus: true,
          registerExtension: true
        }
      },
      overrides || {}
    );
  }

  function getStatus() {
    return {
      version: VERSION,
      body: BODY.id,
      legacyId: BODY.legacyId,
      label: BODY.label,
      parentAuthority: BODY.parentAuthority,
      generation: BODY.generation,
      generationClaim: BODY.generationClaim,
      g1TerrainFoundation: "PRESERVED",
      g2ParentConsumption: "ACTIVE",
      g2HydrationConsumed: true,
      g2ClimateConsumed: true,
      g3EcologyPrepared: true,
      g3Claimed: false,
      g4FaunaBuilt: false,
      children: CHILDREN,
      landDistribution: "FIVE_LAND_BODIES_PLUS_SOUTH_POLE_ICE",
      visibleSegments: CONTRACT.visibleSegments,
      landBodies: CONTRACT.landBodies,
      dominantMainland: "REDUCED_AND_PRESERVED_NEAR_CURRENT_POSITION",
      northPole: "LAND_BODY",
      southPole: "ICE_ONLY",
      oversizedLandPlate: "REMOVED",
      seamSafeTerrainGrammar: true,
      noCrossSeamContinentChord: true,
      terrainHydrationClimateParentConsumed: true,
      activeDownstreamChildren: ["terrain", "hydration", "climate"],
      downstreamChildrenActive: "terrain+hydration+climate",
      visualPass: CONTRACT.visualPass,
      imageGeneration: CONTRACT.imageGeneration,
      staticPictureReplacement: CONTRACT.staticPictureReplacement,
      protectedNonJurisdiction: [
        "Earth",
        "Showroom selector",
        "Showroom CSS",
        "Gauges",
        "Products",
        "Sun",
        "Moon",
        "global files"
      ],
      returnReceipt:
        "AUDRALIA_DISTRIBUTED_LAND_SEGMENTATION_ACTIVE_5_LAND_BODIES_NORTH_POLE_LAND_SOUTH_POLE_ICE_ONLY"
    };
  }

  function registerExtension(target) {
    const api = window.DGBAudraliaPlanetRender;
    const profile = createProfile();

    if (!target) return api;
    if (target === api) return api;

    if (typeof target.registerPlanet === "function") {
      target.registerPlanet(profile, api);
    }

    if (typeof target.registerRenderer === "function") {
      target.registerRenderer(BODY.id, api);
      target.registerRenderer(BODY.legacyId, api);
    }

    if (typeof target.registerExtension === "function") {
      target.registerExtension(BODY.id, api);
    }

    if (typeof target.addExtension === "function") {
      target.addExtension(BODY.id, api);
    }

    if (target.extensions && typeof target.extensions === "object") {
      target.extensions[BODY.id] = api;
      target.extensions[BODY.legacyId] = api;
    }

    if (target.planets && typeof target.planets === "object") {
      target.planets[BODY.id] = profile;
      target.planets[BODY.legacyId] = profile;
    }

    return api;
  }

  function autoRegister() {
    const api = window.DGBAudraliaPlanetRender;

    [
      window.DGBPlanetRegistry,
      window.DGBShowroomPlanetRegistry,
      window.DGBShowroomGlobeInstrument,
      window.DGBAudraliaRegistry,
      window.DGBAudreliaRegistry
    ].forEach(function (registry) {
      if (registry) registerExtension(registry);
    });

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-distributed-land-ready", {
        detail: {
          body: BODY.id,
          legacyId: BODY.legacyId,
          label: BODY.label,
          version: VERSION,
          generation: BODY.generation,
          landBodies: CONTRACT.landBodies,
          visibleSegments: CONTRACT.visibleSegments,
          api
        }
      })
    );
  }

  function autoMount() {
    const mount =
      document.getElementById("audraliaRenderMount") ||
      document.getElementById("audreliaRenderMount") ||
      document.querySelector("[data-audralia-render-mount]") ||
      document.querySelector("[data-audrelia-render-mount]") ||
      document.querySelector("[data-body='audralia'][data-render-mount]") ||
      document.querySelector("[data-body='audrelia'][data-render-mount]");

    if (!mount) return;

    renderSurface(mount, {
      size: 720,
      receipt: true
    });
  }

  const api = Object.freeze({
    version: VERSION,
    body: BODY,
    children: CHILDREN,
    contract: CONTRACT,
    landSegments: LAND_SEGMENTS,
    nineSummits: NINE_SUMMITS,
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus,
    registerExtension
  });

  window.DGBAudraliaPlanetRender = api;
  window.AudraliaPlanetRender = api;
  window.audraliaPlanetRender = api;

  window.DGBAudreliaPlanetRender = api;
  window.AudreliaPlanetRender = api;
  window.audreliaPlanetRender = api;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        autoRegister();
        autoMount();
      },
      { once: true }
    );
  } else {
    autoRegister();
    autoMount();
  }
})();
