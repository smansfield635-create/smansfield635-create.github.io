/*
  /assets/audralia/audralia.planet.render.js
  AUDRALIA_G2_PARENT_CONSUMES_HYDRATION_CLIMATE_AND_PREPARES_G3_ECOLOGY_TNT_v1

  Purpose:
  - Keep Audralia as the active constructed world-body.
  - Preserve the G1 terraform terrain foundation.
  - Consume hydration and climate into the Audralia parent body.
  - Prepare G3 ecology / foliage hooks without falsely claiming G3 completion.
  - Preserve route shell, Showroom globe split, Earth hold, Sun baseline, Moon baseline, controls, and current mount compatibility.

  Scope:
  - This file owns Audralia parent render-body authority only.
  - This file does not own Earth, Showroom route shell, CSS, Gauges, Products, Sun, Moon, or global site files.

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

  const VERSION = "AUDRALIA_G2_PARENT_CONSUMES_HYDRATION_CLIMATE_AND_PREPARES_G3_ECOLOGY_TNT_v1";

  const BODY = Object.freeze({
    id: "audralia",
    legacyId: "audrelia",
    label: "Audralia",
    publicLabel: "Audralia",
    classification: "constructed-home-world-body",
    parentAuthority: "/assets/audralia/audralia.planet.render.js",
    generation: "G2_PARENT_CONSUMED",
    generationClaim: "G2",
    nextGenerationPrep: "G3_ECOLOGY_PREPARED_NOT_CLAIMED"
  });

  const CHILDREN = Object.freeze({
    terrain: {
      status: "CONSUMED_BY_PARENT",
      path: "/assets/audralia/audralia.terrain.render.js",
      generationRole: "G1_TERRAFORM_FOUNDATION"
    },
    hydration: {
      status: "CONSUMED_BY_PARENT",
      path: "/assets/audralia/audralia.hydration.render.js",
      generationRole: "G2_HYDRATION_CHILD"
    },
    climate: {
      status: "CONSUMED_BY_PARENT",
      path: "/assets/audralia/audralia.climate.render.js",
      generationRole: "G2_CLIMATE_CHILD"
    },
    ecology: {
      status: "PREPARED_NOT_CLAIMED",
      path: null,
      generationRole: "G3_ECOLOGY_PREP"
    },
    fauna: {
      status: "NOT_BUILT",
      path: null,
      generationRole: "G4_FAUNA_FUTURE"
    }
  });

  const CONTRACT = Object.freeze({
    terrainFoundationPreserved: true,
    hydrationConsumed: true,
    climateConsumed: true,
    ecologyPrepared: true,
    ecologyClaimed: false,
    generation3Claimed: false,
    visualPass: "HELD_UNTIL_SEAN_SCREENSHOT_OR_OWNER_CONFIRMATION",
    imageGeneration: false,
    staticPictureReplacement: false,
    seamSafeTerrainGrammar: true,
    noBlob: true,
    noTrespass: true,
    noFalseFix: true,
    hybridBondStatus: "PASS"
  });

  const NINE_SUMMITS = Object.freeze([
    {
      key: "character",
      index: 1,
      lon: 0.28,
      lat: 0.34,
      radius: 0.105,
      terrain: "origin-ridge-highland-spine",
      climate: "cool exposed stone",
      elevation: 0.36,
      moisture: -0.04
    },
    {
      key: "structure",
      index: 2,
      lon: 0.41,
      lat: 0.42,
      radius: 0.135,
      terrain: "stable-plateau-mature-foundation",
      climate: "temperate plateau",
      elevation: 0.22,
      moisture: -0.02
    },
    {
      key: "balance",
      index: 3,
      lon: 0.55,
      lat: 0.48,
      radius: 0.128,
      terrain: "transition-basin-wet-dry-elevation-meet",
      climate: "mixed transition",
      elevation: 0.06,
      moisture: 0.12
    },
    {
      key: "stability",
      index: 4,
      lon: 0.66,
      lat: 0.39,
      radius: 0.12,
      terrain: "broad-habitable-shelf-temperate-coast",
      climate: "temperate coastal",
      elevation: 0.08,
      moisture: 0.18
    },
    {
      key: "peace",
      index: 5,
      lon: 0.36,
      lat: 0.58,
      radius: 0.118,
      terrain: "protected-green-blue-basin",
      climate: "sheltered basin",
      elevation: -0.02,
      moisture: 0.28
    },
    {
      key: "joy",
      index: 6,
      lon: 0.74,
      lat: 0.57,
      radius: 0.112,
      terrain: "warm-archipelago-reef-life",
      climate: "warm reef islands",
      elevation: -0.06,
      moisture: 0.24
    },
    {
      key: "dignity",
      index: 7,
      lon: 0.62,
      lat: 0.25,
      radius: 0.102,
      terrain: "elevated-mineral-crownland-weathered-ridge",
      climate: "dry highland mineral belt",
      elevation: 0.34,
      moisture: -0.12
    },
    {
      key: "free-will",
      index: 8,
      lon: 0.21,
      lat: 0.52,
      radius: 0.13,
      terrain: "frontier-belt-open-edge",
      climate: "wild transitional",
      elevation: 0.1,
      moisture: 0.02
    },
    {
      key: "love",
      index: 9,
      lon: 0.50,
      lat: 0.50,
      radius: 0.15,
      terrain: "convergence-heartland",
      climate: "waters-ridges-routes-converge",
      elevation: 0.08,
      moisture: 0.18
    }
  ]);

  const LOCAL_LAND_SEEDS = Object.freeze([
    { lon: 0.18, lat: 0.47, radiusX: 0.16, radiusY: 0.23, height: 0.56, moisture: 0.05 },
    { lon: 0.31, lat: 0.36, radiusX: 0.18, radiusY: 0.15, height: 0.48, moisture: -0.06 },
    { lon: 0.44, lat: 0.52, radiusX: 0.21, radiusY: 0.16, height: 0.5, moisture: 0.06 },
    { lon: 0.58, lat: 0.38, radiusX: 0.16, radiusY: 0.20, height: 0.5, moisture: -0.04 },
    { lon: 0.72, lat: 0.55, radiusX: 0.18, radiusY: 0.15, height: 0.38, moisture: 0.18 },
    { lon: 0.80, lat: 0.31, radiusX: 0.09, radiusY: 0.12, height: 0.32, moisture: -0.08 }
  ]);

  const ISLAND_CHAINS = Object.freeze([
    { lon: 0.12, lat: 0.61, count: 7, stepLon: 0.026, stepLat: -0.012, radius: 0.022, height: 0.32 },
    { lon: 0.70, lat: 0.66, count: 9, stepLon: 0.019, stepLat: -0.018, radius: 0.02, height: 0.29 },
    { lon: 0.82, lat: 0.50, count: 6, stepLon: -0.022, stepLat: 0.016, radius: 0.018, height: 0.24 }
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

  function summitInfluence(x, y) {
    let elevation = 0;
    let moisture = 0;
    let regionKey = "open-ocean";
    let regionStrength = 0;

    for (let i = 0; i < NINE_SUMMITS.length; i += 1) {
      const region = NINE_SUMMITS[i];
      const dx = wrapDistance(x, region.lon) / region.radius;
      const dy = Math.abs(y - region.lat) / region.radius;
      const d = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.max(0, 1 - d);

      if (strength > 0) {
        const shaped = strength * strength * (3 - 2 * strength);
        elevation += region.elevation * shaped;
        moisture += region.moisture * shaped;

        if (shaped > regionStrength) {
          regionStrength = shaped;
          regionKey = region.key;
        }
      }
    }

    return {
      elevation,
      moisture,
      regionKey,
      regionStrength
    };
  }

  function landSeedInfluence(x, y) {
    let height = -0.34;
    let moisture = 0;

    for (let i = 0; i < LOCAL_LAND_SEEDS.length; i += 1) {
      const seed = LOCAL_LAND_SEEDS[i];
      const dx = wrapDistance(x, seed.lon) / seed.radiusX;
      const dy = Math.abs(y - seed.lat) / seed.radiusY;
      const d = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.max(0, 1 - d);

      if (strength > 0) {
        const shaped = strength * strength * (3 - 2 * strength);
        height += seed.height * shaped;
        moisture += seed.moisture * shaped;
      }
    }

    for (let c = 0; c < ISLAND_CHAINS.length; c += 1) {
      const chain = ISLAND_CHAINS[c];

      for (let n = 0; n < chain.count; n += 1) {
        const lon = wrap01(chain.lon + chain.stepLon * n);
        const lat = clamp(chain.lat + chain.stepLat * n, 0.08, 0.92);
        const dx = wrapDistance(x, lon) / chain.radius;
        const dy = Math.abs(y - lat) / (chain.radius * 0.82);
        const d = Math.sqrt(dx * dx + dy * dy);
        const strength = Math.max(0, 1 - d);

        if (strength > 0) {
          const shaped = strength * strength;
          height += chain.height * shaped;
          moisture += 0.05 * shaped;
        }
      }
    }

    return { height, moisture };
  }

  function ridgeField(x, y) {
    const diagonalRidge =
      1 -
      Math.abs(
        Math.sin((x * 1.65 + y * 0.9 + fbm(x * 8, y * 8, 4) * 0.08) * Math.PI)
      );

    const oldFold =
      1 -
      Math.abs(
        Math.sin((x * 2.25 - y * 1.15 + fbm(x * 11 + 4, y * 11 + 9, 4) * 0.12) * Math.PI)
      );

    return Math.pow(Math.max(diagonalRidge, oldFold * 0.86), 4);
  }

  function calculateSurface(xInput, yInput) {
    const x = wrap01(Number(xInput) || 0);
    const y = clamp(Number(yInput) || 0, 0, 1);

    const latFromEquator = Math.abs(y - 0.5) * 2;
    const polar = smoothstep(0.72, 1, latFromEquator);
    const equatorial = 1 - smoothstep(0.08, 0.48, Math.abs(y - 0.5));

    const macro = fbm(x * 3.2, y * 2.6, 5);
    const erosion = fbm(x * 22 + 19, y * 18 + 7, 5);
    const micro = fbm(x * 64 + 2, y * 48 + 11, 3);

    const local = landSeedInfluence(x, y);
    const summit = summitInfluence(x, y);
    const ridges = ridgeField(x, y);

    const ancientErosion = (erosion - 0.5) * 0.12 + (micro - 0.5) * 0.035;
    let elevation =
      local.height +
      summit.elevation +
      (macro - 0.5) * 0.28 +
      ridges * 0.18 +
      ancientErosion -
      polar * 0.08;

    elevation = clamp(elevation, -0.92, 0.92);

    const coast = 1 - clamp(Math.abs(elevation) / 0.17, 0, 1);
    const shelf = elevation < 0 && elevation > -0.22 ? 1 - Math.abs(elevation + 0.09) / 0.13 : 0;
    const reef =
      shelf *
      equatorial *
      smoothstep(0.48, 0.78, fbm(x * 44 + 5, y * 44 + 17, 3));

    const aridityBand =
      smoothstep(0.18, 0.48, latFromEquator) *
      (1 - smoothstep(0.58, 0.9, latFromEquator));

    const mountainCold = smoothstep(0.24, 0.56, elevation);
    const moisture =
      clamp(
        0.48 +
          local.moisture +
          summit.moisture +
          equatorial * 0.18 -
          aridityBand * 0.22 +
          coast * 0.12 -
          mountainCold * 0.08 +
          (fbm(x * 7 + 6, y * 9 + 3, 4) - 0.5) * 0.18,
        0,
        1
      );

    const isWater = elevation < 0;
    const depth = isWater ? clamp(Math.abs(elevation), 0, 1) : 0;
    const ice = clamp(polar * 0.92 + mountainCold * 0.42 - moisture * 0.18, 0, 1);

    let biome = "deep-ocean";
    if (isWater && shelf > 0.25) biome = reef > 0.35 ? "reef-shelf" : "shallow-shelf";
    if (!isWater && ice > 0.62) biome = "ice-highland";
    else if (!isWater && elevation > 0.42) biome = "weathered-mountain-ridge";
    else if (!isWater && moisture < 0.26) biome = "ancient-dry-interior";
    else if (!isWater && moisture > 0.64 && equatorial > 0.42) biome = "humid-green-belt";
    else if (!isWater && moisture > 0.5) biome = "temperate-green-coast";
    else if (!isWater) biome = "olive-weathered-basin";

    return {
      x,
      y,
      elevation,
      isWater,
      depth,
      shelf: clamp(shelf, 0, 1),
      reef: clamp(reef, 0, 1),
      coast: clamp(coast, 0, 1),
      ridges: clamp(ridges, 0, 1),
      polar: clamp(polar, 0, 1),
      equatorial: clamp(equatorial, 0, 1),
      moisture,
      ice,
      biome,
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

  function mixColor(a, b, t) {
    const colorA = typeof a === "string" ? colorToBytes(a) : a;
    const colorB = typeof b === "string" ? colorToBytes(b) : b;
    const amount = clamp(t, 0, 1);

    return {
      r: Math.round(lerp(colorA.r, colorB.r, amount)),
      g: Math.round(lerp(colorA.g, colorB.g, amount)),
      b: Math.round(lerp(colorA.b, colorB.b, amount))
    };
  }

  function surfaceColor(surface) {
    if (surface.isWater) {
      const deep = colorToBytes("#071f58");
      const mid = colorToBytes("#145c94");
      const shelf = colorToBytes("#2bb9c2");
      const reef = colorToBytes("#72d6c3");

      let color = mixColor(mid, deep, clamp(surface.depth * 1.15, 0, 1));

      if (surface.shelf > 0) {
        color = mixColor(color, shelf, surface.shelf * 0.72);
      }

      if (surface.reef > 0) {
        color = mixColor(color, reef, surface.reef * 0.66);
      }

      return color;
    }

    const dry = colorToBytes("#b8894f");
    const basin = colorToBytes("#8f8b57");
    const green = colorToBytes("#3f8c58");
    const humid = colorToBytes("#2d7d4e");
    const ridge = colorToBytes("#817363");
    const mineral = colorToBytes("#a89171");
    const ice = colorToBytes("#e9eef0");

    let color;

    if (surface.biome === "ancient-dry-interior") color = dry;
    else if (surface.biome === "humid-green-belt") color = humid;
    else if (surface.biome === "temperate-green-coast") color = green;
    else if (surface.biome === "weathered-mountain-ridge") color = ridge;
    else color = basin;

    color = mixColor(color, mineral, surface.ridges * 0.22);
    color = mixColor(color, ice, surface.ice * 0.7);

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
    canvas.dataset.label = BODY.label;
    canvas.dataset.version = VERSION;
    canvas.dataset.generation = BODY.generation;
    canvas.dataset.parentConsumption = "terrain-hydration-climate";
    canvas.dataset.ecologyPrep = "true";
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

        const light =
          0.86 +
          surface.ridges * 0.08 +
          surface.coast * 0.04 +
          surface.reef * 0.06 -
          surface.depth * 0.04 +
          (fbm(x * 96 + 41, y * 96 + 83, 2) - 0.5) * 0.055;

        const idx = (py * width + px) * 4;
        data[idx] = clamp(Math.round(color.r * light), 0, 255);
        data[idx + 1] = clamp(Math.round(color.g * light), 0, 255);
        data[idx + 2] = clamp(Math.round(color.b * light), 0, 255);
        data[idx + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    canvas.dataset.textureStatus = "AUDRALIA_G2_PARENT_CONSUMED_TEXTURE_READY";
    canvas.dataset.seamSafe = "true";
    canvas.dataset.staticPictureReplacement = "false";
    canvas.dataset.imageGeneration = "false";

    if (config.returnObject === true) {
      return {
        canvas,
        width,
        height,
        body: BODY.id,
        label: BODY.label,
        version: VERSION,
        generation: BODY.generation,
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

  function createReceiptNode(status) {
    const receipt = document.createElement("div");
    receipt.className = "audralia-parent-consumption-receipt";
    receipt.dataset.body = BODY.id;
    receipt.dataset.label = BODY.label;
    receipt.dataset.version = VERSION;
    receipt.dataset.generation = BODY.generation;
    receipt.dataset.parentAuthority = BODY.parentAuthority;
    receipt.dataset.terrainChild = CHILDREN.terrain.status;
    receipt.dataset.hydrationChild = CHILDREN.hydration.status;
    receipt.dataset.climateChild = CHILDREN.climate.status;
    receipt.dataset.ecologyPrep = CHILDREN.ecology.status;
    receipt.dataset.visualPass = CONTRACT.visualPass;
    receipt.textContent = [
      "AUDRALIA_PARENT_CONSUMPTION=G2",
      "TERRAIN=CONSUMED",
      "HYDRATION=CONSUMED",
      "CLIMATE=CONSUMED",
      "G3_ECOLOGY=PREPARED_NOT_CLAIMED",
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

    const width = Number(config.width) || 1024;
    const height = Number(config.height) || 512;
    const canvas = buildTexture({ width, height });

    canvas.className = [
      "audralia-world-body-canvas",
      "audralia-g2-parent-consumed",
      "audralia-g3-ecology-prep"
    ].join(" ");

    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Audralia Generation 2 parent-consumed world body with terrain, hydration, and climate integrated"
    );

    canvas.style.width = "100%";
    canvas.style.maxWidth = config.maxWidth || "720px";
    canvas.style.aspectRatio = "2 / 1";
    canvas.style.display = "block";
    canvas.style.borderRadius = "999px";
    canvas.style.objectFit = "cover";

    const status = getStatus();
    status.mountId = target && target.id ? target.id : "";

    if (target) {
      target.replaceChildren();
      target.dataset.body = BODY.id;
      target.dataset.label = BODY.label;
      target.dataset.version = VERSION;
      target.dataset.generation = BODY.generation;
      target.dataset.parentConsumption = "terrain-hydration-climate";
      target.dataset.terrainChildActive = "true";
      target.dataset.hydrationChildConsumed = "true";
      target.dataset.climateChildConsumed = "true";
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
    const profile = Object.assign(
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
        activeDownstreamChildren: ["terrain", "hydration", "climate"],
        consumedChildren: ["terrain", "hydration", "climate"],
        preparedChildren: ["ecology"],
        futureChildren: ["fauna"],
        children: CHILDREN,
        contract: CONTRACT,
        nineSummits: NINE_SUMMITS.map(function (region) {
          return {
            index: region.index,
            key: region.key,
            terrain: region.terrain,
            climate: region.climate
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

    return profile;
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
      seamSafeTerrainGrammar: true,
      terrainHydrationClimateParentConsumed: true,
      activeDownstreamChildren: ["terrain", "hydration", "climate"],
      downstreamChildrenActive: "terrain+hydration+climate",
      visualPass: CONTRACT.visualPass,
      imageGeneration: CONTRACT.imageGeneration,
      staticPictureReplacement: CONTRACT.staticPictureReplacement,
      protectedNonJurisdiction: [
        "Earth",
        "Showroom route shell",
        "Showroom globe instrument",
        "Showroom CSS",
        "Gauges",
        "Products",
        "Sun",
        "Moon",
        "global files"
      ],
      returnReceipt:
        "AUDRALIA_PARENT_CONSUMES_TERRAIN_HYDRATION_CLIMATE_AND_PREPARES_G3_ECOLOGY_WITHOUT_FALSE_G3_CLAIM"
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
      window.DGBAudraliaRegistry
    ].forEach(function (registry) {
      if (registry) registerExtension(registry);
    });

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-parent-consumption-ready", {
        detail: {
          body: BODY.id,
          label: BODY.label,
          version: VERSION,
          generation: BODY.generation,
          api
        }
      })
    );
  }

  function autoMount() {
    const mount =
      document.getElementById("audraliaRenderMount") ||
      document.querySelector("[data-audralia-render-mount]") ||
      document.querySelector("[data-body='audralia'][data-render-mount]");

    if (!mount) return;

    renderSurface(mount, {
      width: 1024,
      height: 512,
      receipt: true
    });
  }

  const api = Object.freeze({
    version: VERSION,
    body: BODY,
    children: CHILDREN,
    contract: CONTRACT,
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
