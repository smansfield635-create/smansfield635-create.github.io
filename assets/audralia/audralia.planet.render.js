/*
  /assets/audralia/audralia.planet.render.js
  AUDRALIA_PARENT_BASELINE_LAND_WATER_RESTORE_TNT_v1

  Purpose:
  - Restore Audralia parent authority after parent overreach.
  - Keep the parent file small, stable, and fast.
  - Parent owns only:
    1. Audralia identity
    2. baseline planet body
    3. baseline land/water divide
    4. simple sphere projection
    5. child-system handoff receipts
  - Terrain pressure, hydration, climate, islands, elevation regions, and ecology are downstream child responsibilities.

  Scope:
  - Audralia parent render-body authority only.
  - No Earth mutation.
  - No Showroom selector mutation.
  - No CSS mutation.
  - No Gauges mutation.
  - No Products mutation.
  - No Sun/Moon mutation.
  - No global file mutation.

  API preserved:
  - createProfile
  - buildTexture
  - sampleSurface
  - renderSurface
  - getStatus
  - registerExtension
*/

(function () {
  "use strict";

  const VERSION = "AUDRALIA_PARENT_BASELINE_LAND_WATER_RESTORE_TNT_v1";

  const BODY = Object.freeze({
    id: "audralia",
    legacyId: "audrelia",
    label: "Audralia",
    publicLabel: "Audralia",
    classification: "constructed-home-world-body",
    parentAuthority: "/assets/audralia/audralia.planet.render.js",
    generation: "G2_PARENT_BASELINE_LAND_WATER_RESTORED",
    generationClaim: "G2_BASELINE",
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION"
  });

  const CONTRACT = Object.freeze({
    parentOwns: [
      "identity",
      "baseline_sphere",
      "baseline_land_water_divide",
      "simple_projection",
      "child_handoff"
    ],
    parentDoesNotOwn: [
      "terrain_pressure",
      "full_island_density",
      "region_elevation_engine",
      "hydration_network",
      "full_climate_model",
      "biome_ecology_expansion",
      "heavy_world_simulation"
    ],
    terrainChildRequired: true,
    hydrationChildRequired: true,
    climateChildLater: true,
    ecologyChildLater: true,
    southPoleIceOnly: true,
    northPoleLandAllowed: true,
    noParentBloat: true,
    imageGeneration: false,
    staticPictureReplacement: false,
    visualPass: BODY.visualPass
  });

  const BASELINE_LAND_BODIES = Object.freeze([
    {
      id: "dominant-mainland",
      lon: 0.43,
      lat: 0.49,
      radiusX: 0.15,
      radiusY: 0.18,
      height: 0.56,
      moisture: 0.08
    },
    {
      id: "western-body",
      lon: 0.18,
      lat: 0.49,
      radiusX: 0.11,
      radiusY: 0.14,
      height: 0.42,
      moisture: 0.04
    },
    {
      id: "eastern-body",
      lon: 0.70,
      lat: 0.51,
      radiusX: 0.11,
      radiusY: 0.14,
      height: 0.40,
      moisture: 0.12
    },
    {
      id: "southern-island-body",
      lon: 0.58,
      lat: 0.66,
      radiusX: 0.085,
      radiusY: 0.07,
      height: 0.30,
      moisture: 0.18
    },
    {
      id: "north-polar-land",
      lon: 0.50,
      lat: 0.08,
      radiusX: 0.18,
      radiusY: 0.075,
      height: 0.34,
      moisture: -0.02
    }
  ]);

  const BASELINE_ISLANDS = Object.freeze([
    { lon: 0.09, lat: 0.54, radius: 0.026, height: 0.22 },
    { lon: 0.14, lat: 0.58, radius: 0.018, height: 0.18 },
    { lon: 0.34, lat: 0.56, radius: 0.024, height: 0.20 },
    { lon: 0.39, lat: 0.62, radius: 0.018, height: 0.18 },
    { lon: 0.53, lat: 0.68, radius: 0.024, height: 0.20 },
    { lon: 0.61, lat: 0.70, radius: 0.020, height: 0.18 },
    { lon: 0.76, lat: 0.46, radius: 0.022, height: 0.20 },
    { lon: 0.82, lat: 0.52, radius: 0.018, height: 0.18 },
    { lon: 0.49, lat: 0.20, radius: 0.020, height: 0.18 },
    { lon: 0.56, lat: 0.22, radius: 0.018, height: 0.18 }
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

  function noise(x, y) {
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
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(x * freq, y * freq) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }

    return total / norm;
  }

  function ellipseInfluence(x, y, body, noiseScale) {
    const dx = wrapDistance(x, body.lon) / body.radiusX;
    const dy = Math.abs(y - body.lat) / body.radiusY;
    const d = Math.sqrt(dx * dx + dy * dy);
    const wobble = (fbm(x * noiseScale + body.lon * 31, y * noiseScale + body.lat * 41, 3) - 0.5) * 0.16;

    return smoothstep(1.05, 0.35, d + wobble);
  }

  function islandInfluence(x, y, island) {
    const dx = wrapDistance(x, island.lon) / island.radius;
    const dy = Math.abs(y - island.lat) / (island.radius * 0.82);
    const d = Math.sqrt(dx * dx + dy * dy);
    const wobble = (fbm(x * 80 + island.lon * 17, y * 80 + island.lat * 19, 2) - 0.5) * 0.12;

    return smoothstep(1.0, 0.28, d + wobble);
  }

  function baseElevation(x, y) {
    let elevation = -0.46;
    let moisture = 0;
    let dominant = "open-ocean";
    let strength = 0;

    for (let i = 0; i < BASELINE_LAND_BODIES.length; i += 1) {
      const body = BASELINE_LAND_BODIES[i];
      const influence = ellipseInfluence(x, y, body, 34);

      elevation += body.height * influence;
      moisture += body.moisture * influence;

      if (influence > strength) {
        strength = influence;
        dominant = body.id;
      }
    }

    for (let i = 0; i < BASELINE_ISLANDS.length; i += 1) {
      const island = BASELINE_ISLANDS[i];
      const influence = islandInfluence(x, y, island);

      elevation += island.height * influence;
      moisture += 0.12 * influence;

      if (influence > strength) {
        strength = influence;
        dominant = "misc-island";
      }
    }

    const relief = (fbm(x * 5.5 + 4, y * 5.5 + 8, 4) - 0.5) * 0.10 * clamp(strength + 0.15, 0, 1);
    const erosion = (fbm(x * 22 + 11, y * 19 + 7, 3) - 0.5) * 0.045 * clamp(strength + 0.2, 0, 1);

    return {
      elevation: clamp(elevation + relief + erosion, -0.95, 0.82),
      moisture: clamp(0.45 + moisture, 0, 1),
      dominant,
      strength
    };
  }

  function sampleSurface(input, yInput) {
    let x;
    let y;

    if (typeof input === "object" && input !== null) {
      if (Number.isFinite(input.lon) || Number.isFinite(input.lat)) {
        x = wrap01((Number(input.lon) || 0) / 360 + 0.5);
        y = clamp(0.5 - (Number(input.lat) || 0) / 180, 0, 1);
      } else {
        x = wrap01(Number(input.x) || 0);
        y = clamp(Number(input.y) || 0, 0, 1);
      }
    } else {
      x = wrap01(Number(input) || 0);
      y = clamp(Number(yInput) || 0, 0, 1);
    }

    const base = baseElevation(x, y);
    const southPolar = smoothstep(0.82, 0.98, y);
    const northPolar = smoothstep(0.78, 0.98, 1 - y);
    const equatorial = 1 - smoothstep(0.08, 0.54, Math.abs(y - 0.5));

    const southIce = southPolar > 0.32;
    const elevation = southIce ? Math.min(base.elevation, -0.10) : base.elevation;
    const isLand = elevation >= 0 && !southIce;
    const isWater = !isLand && !southIce;
    const isIce = southIce || (northPolar > 0.72 && isLand);

    const depth = isWater ? clamp(Math.abs(elevation), 0, 1) : 0;
    const shelf = isWater && elevation > -0.22 ? 1 - Math.abs(elevation + 0.09) / 0.13 : 0;
    const coast = isLand ? 1 - clamp(Math.abs(elevation) / 0.16, 0, 1) : 0;
    const reef = shelf * equatorial * smoothstep(0.48, 0.78, fbm(x * 42 + 5, y * 42 + 17, 3));

    let biome = "deep-ocean";

    if (isIce && southIce) biome = "south-polar-ice-only";
    else if (isIce) biome = "north-polar-land-ice";
    else if (isWater && shelf > 0.25) biome = reef > 0.35 ? "reef-shelf" : "shallow-shelf";
    else if (isWater) biome = depth > 0.48 ? "deep-ocean" : "open-ocean";
    else if (isLand && elevation > 0.45) biome = "highland";
    else if (isLand && base.moisture > 0.62) biome = "green-basin";
    else if (isLand && base.moisture < 0.36) biome = "dry-upland";
    else if (isLand) biome = "temperate-land";

    return {
      x,
      y,
      elevation,
      moisture: base.moisture,
      isLand,
      isWater,
      isIce,
      southIce,
      depth,
      shelf: clamp(shelf, 0, 1),
      reef: clamp(reef, 0, 1),
      coast: clamp(coast, 0, 1),
      northPolar,
      southPolar,
      equatorial,
      biome,
      segment: base.dominant,
      segmentStrength: base.strength,
      generation: BODY.generation,
      parentRole: "baseline-land-water-only",
      terrainPressure: "child-authority",
      hydrationPressure: "child-authority",
      climatePressure: "child-authority"
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
    const ca = typeof a === "string" ? colorToBytes(a) : a;
    const cb = typeof b === "string" ? colorToBytes(b) : b;
    const t = clamp(amount, 0, 1);

    return {
      r: Math.round(lerp(ca.r, cb.r, t)),
      g: Math.round(lerp(ca.g, cb.g, t)),
      b: Math.round(lerp(ca.b, cb.b, t))
    };
  }

  function surfaceColor(surface) {
    if (surface.isIce) {
      return surface.southIce
        ? mixColor("#e7f3f8", "#ffffff", 0.62)
        : mixColor("#d4e7ee", "#f8fbff", 0.38);
    }

    if (surface.isWater) {
      const deep = colorToBytes("#061b4d");
      const mid = colorToBytes("#145c94");
      const shelf = colorToBytes("#2bb9c2");
      const reef = colorToBytes("#72d6c3");

      let color = mixColor(mid, deep, clamp(surface.depth * 1.16, 0, 1));
      color = mixColor(color, shelf, surface.shelf * 0.72);
      color = mixColor(color, reef, surface.reef * 0.66);
      return color;
    }

    let color;

    if (surface.biome === "highland") color = colorToBytes("#8a7b62");
    else if (surface.biome === "green-basin") color = colorToBytes("#3f8c58");
    else if (surface.biome === "dry-upland") color = colorToBytes("#b8894f");
    else color = colorToBytes("#7d9259");

    color = mixColor(color, "#d1b878", surface.coast * 0.16);

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
    canvas.dataset.parentRole = "baseline-land-water-only";
    canvas.dataset.terrainPressure = "child-authority";
    canvas.dataset.hydrationPressure = "child-authority";
    canvas.dataset.climatePressure = "child-authority";
    canvas.dataset.southPole = "ice-only";
    canvas.dataset.visualPass = BODY.visualPass;
    return canvas;
  }

  function buildTexture(options) {
    const config = options || {};
    const width = Math.max(256, Math.min(2048, Number(config.width) || 768));
    const height = Math.max(128, Math.min(1024, Number(config.height) || 384));

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
        const surface = sampleSurface(x, y);
        const color = surfaceColor(surface);

        const light =
          0.90 +
          surface.coast * 0.04 +
          surface.reef * 0.06 -
          surface.depth * 0.035 +
          (fbm(x * 72 + 41, y * 72 + 83, 2) - 0.5) * 0.035;

        const index = (py * width + px) * 4;
        data[index] = clamp(Math.round(color.r * light), 0, 255);
        data[index + 1] = clamp(Math.round(color.g * light), 0, 255);
        data[index + 2] = clamp(Math.round(color.b * light), 0, 255);
        data[index + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    canvas.dataset.textureStatus = "AUDRALIA_PARENT_BASELINE_LAND_WATER_READY";
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
        status: getStatus()
      };
    }

    return canvas;
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

    ctx.drawImage(texture, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

    if (secondDestWidth > 0.5) {
      ctx.drawImage(texture, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
    }
  }

  function drawSphere(ctx, texture, phase) {
    const size = ctx.canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;
    const stripHeight = Math.max(1, Math.floor(size / 360));
    const sourceHeight = texture.height || 384;

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
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.7));

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
      radius * 1.15
    );

    light.addColorStop(0, "rgba(255,255,255,0.18)");
    light.addColorStop(0.36, "rgba(255,255,255,0.05)");
    light.addColorStop(0.76, "rgba(0,0,0,0.10)");
    light.addColorStop(1, "rgba(0,0,0,0.38)");

    ctx.fillStyle = light;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const rim = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(0.84, "rgba(12,28,48,0.08)");
    rim.addColorStop(1, "rgba(70,130,180,0.20)");

    ctx.fillStyle = rim;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(176,218,255,0.24)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function createReceiptNode(status) {
    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-parent-baseline-receipt";
    receipt.dataset.body = BODY.id;
    receipt.dataset.legacyBody = BODY.legacyId;
    receipt.dataset.version = VERSION;
    receipt.dataset.generation = BODY.generation;
    receipt.dataset.parentRole = "baseline-land-water-only";
    receipt.dataset.terrainPressure = "child-authority";
    receipt.dataset.hydrationPressure = "child-authority";
    receipt.dataset.climatePressure = "child-authority";
    receipt.dataset.visualPass = BODY.visualPass;
    receipt.textContent = [
      "AUDRALIA_PARENT=BASELINE_LAND_WATER_ONLY",
      "TERRAIN_PRESSURE=CHILD_AUTHORITY",
      "HYDRATION_PRESSURE=CHILD_AUTHORITY",
      "CLIMATE_PRESSURE=CHILD_AUTHORITY",
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
      width: Number(config.textureWidth) || 768,
      height: Number(config.textureHeight) || 384
    });

    const size = Math.max(320, Math.min(960, Number(config.size) || 680));
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.className = [
      "audralia-world-body-canvas",
      "audralia-parent-baseline",
      "audralia-land-water-baseline"
    ].join(" ");

    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Audralia baseline parent body with land and water divide restored"
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
      target.dataset.parentRole = "baseline-land-water-only";
      target.dataset.terrainPressure = "child-authority";
      target.dataset.hydrationPressure = "child-authority";
      target.dataset.climatePressure = "child-authority";
      target.dataset.southPole = "ice-only";
      target.dataset.visualPass = BODY.visualPass;

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
        parentRole: "baseline-land-water-only",
        parentOwns: CONTRACT.parentOwns,
        parentDoesNotOwn: CONTRACT.parentDoesNotOwn,
        terrainChildRequired: true,
        hydrationChildRequired: true,
        climateChildLater: true,
        ecologyChildLater: true,
        southPoleIceOnly: true,
        noParentBloat: true,
        contract: CONTRACT,
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
      parentRole: "BASELINE_LAND_WATER_ONLY",
      parentOwns: CONTRACT.parentOwns,
      parentDoesNotOwn: CONTRACT.parentDoesNotOwn,
      terrainPressure: "CHILD_AUTHORITY",
      hydrationPressure: "CHILD_AUTHORITY",
      climatePressure: "CHILD_AUTHORITY",
      terrainChildRequired: true,
      hydrationChildRequired: true,
      climateChildLater: true,
      ecologyChildLater: true,
      southPole: "ICE_ONLY",
      northPole: "LAND_ALLOWED",
      noParentBloat: true,
      visualPass: BODY.visualPass,
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
        "AUDRALIA_PARENT_BASELINE_RESTORED_TERRAIN_AND_HYDRATION_PRESSURE_MOVED_DOWNSTREAM"
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
      new CustomEvent("dgb:audralia-parent-baseline-ready", {
        detail: {
          body: BODY.id,
          legacyId: BODY.legacyId,
          label: BODY.label,
          version: VERSION,
          generation: BODY.generation,
          parentRole: "baseline-land-water-only",
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
      size: 680,
      receipt: true
    });
  }

  const api = Object.freeze({
    version: VERSION,
    body: BODY,
    contract: CONTRACT,
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
