// /assets/audralia/clean/audralia.canvas.js
// AUDRALIA_CLEAN_CANVAS_COMPOSITOR_TNT_v1
// Full-file replacement.
// File 15 of 16.
// Planet Audralia canvas / composition-only authority.
// Purpose:
// - Establishes Audralia-specific visible canvas composition authority.
// - Owns draw order, canvas sizing, texture-buffer coordination, sphere composition, lighting composition, atmosphere overlay composition, rim composition, and optional proof-status drawing.
// - Consumes Audralia runtime snapshots, surface material, atmosphere/weather, and universal math/palette when available.
// - Does not create land/ocean footprint.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not create climate fields.
// - Does not create biome categories.
// - Does not synthesize surface truth.
// - Does not create atmosphere/weather truth.
// - Does not own runtime motion.
// - Does not attach controls.
// - Does not own route bridge or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_COMPOSITOR_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_COMPOSITOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_CONTROLS_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-compositor-v1";

  const FILE_NUMBER = 15;
  const PRIMARY_NODE = 15;
  const SUBNODE_RANGE = Object.freeze([225, 240]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const CANVAS_TARGETS = Object.freeze({
    drawOrder: true,
    canvasSizing: true,
    textureBufferCoordination: true,
    sphereComposition: true,
    lightingComposition: true,
    atmosphereOverlayComposition: true,
    rimComposition: true,
    optionalProofStatus: true,
    ownsCompositionOnly: true,
    ownsRuntimeMotion: false,
    ownsControls: false,
    ownsRoute: false,
    ownsHtml: false
  });

  const DEFAULTS = Object.freeze({
    textureWidth: 288,
    textureHeight: 144,
    minTextureWidth: 160,
    maxTextureWidth: 420,
    dprCap: 1.65,
    radiusScale: 0.365,
    cxRatio: 0.50,
    cyRatio: 0.51,
    background: true,
    proofStatus: false,
    surfaceVisibilityFloor: 0.70,
    atmosphereMaxBlend: 0.26,
    rimMaxOpacity: 0.38,
    lightingFloor: 0.34,
    lightingCeiling: 1.14,
    specularStrength: 0.10
  });

  const FALLBACK_COLORS = Object.freeze({
    spaceTop: Object.freeze([1, 4, 13]),
    spaceMid: Object.freeze([3, 9, 24]),
    spaceGlow: Object.freeze([17, 45, 63]),
    ocean: Object.freeze([8, 78, 132]),
    shelf: Object.freeze([58, 166, 172]),
    beach: Object.freeze([222, 198, 126]),
    land: Object.freeze([108, 154, 80]),
    forest: Object.freeze([44, 118, 72]),
    mountain: Object.freeze([138, 132, 116]),
    snow: Object.freeze([226, 236, 230]),
    atmosphere: Object.freeze([92, 174, 210]),
    haze: Object.freeze([180, 226, 220]),
    cloud: Object.freeze([234, 242, 235]),
    rim: Object.freeze([152, 230, 214]),
    ink: Object.freeze([255, 244, 216]),
    line: Object.freeze([158, 240, 191])
  });

  const DRAW_ORDER = Object.freeze([
    "background",
    "planet-body-mask",
    "ocean-land-footprint",
    "shelves-beaches-coastlines",
    "terrain-elevation",
    "hydrology-detail",
    "biome-surface-material",
    "lighting",
    "atmosphere",
    "rim-glow",
    "optional-proof-status"
  ]);

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function P() {
    return window.DGB_PLANET_FAMILY_PALETTE || window.AUDRALIA_CLEAN_CANVAS_PALETTE || null;
  }

  function S() {
    return window.AUDRALIA_SURFACE || window.AUDRALIA_CLEAN_CANVAS_SURFACE || null;
  }

  function A() {
    return window.AUDRALIA_ATMOSPHERE || window.AUDRALIA_CLEAN_CANVAS_ATMOSPHERE || window.AUDRALIA_WEATHER || null;
  }

  function R() {
    return window.AUDRALIA_RUNTIME || window.AUDRALIA_CLEAN_CANVAS_RUNTIME || null;
  }

  function Cn() {
    return window.AUDRALIA_CONTROLS || window.AUDRALIA_CLEAN_CANVAS_CONTROLS || null;
  }

  function finite(value, fallback = 0) {
    const helper = M();
    if (helper?.finite) return helper.finite(value, fallback);
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const helper = M();
    if (helper?.clamp) return helper.clamp(value, min, max);
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    const helper = M();
    if (helper?.clamp01) return helper.clamp01(value);
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    const helper = M();
    if (helper?.lerp) return helper.lerp(a, b, t);
    return finite(a, 0) + (finite(b, 0) - finite(a, 0)) * clamp01(t);
  }

  function wrap01(value) {
    const helper = M();
    if (helper?.wrap01) return helper.wrap01(value);
    const number = finite(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function projectSpherePoint(nx, ny, rotation, tilt) {
    const helper = M();
    if (helper?.projectSpherePoint) return helper.projectSpherePoint(nx, ny, rotation, tilt);

    const x = finite(nx, 0);
    const y = finite(ny, 0);
    const rr = x * x + y * y;

    if (rr > 1) {
      return Object.freeze({
        visible: false,
        u: 0,
        v: 0,
        normal: Object.freeze({ x: 0, y: 0, z: 0 })
      });
    }

    const z = Math.sqrt(Math.max(0, 1 - rr));
    const t = finite(tilt, 0);
    const r = finite(rotation, 0);
    const ct = Math.cos(t);
    const st = Math.sin(t);

    const sx = x;
    const sy = -y * ct - z * st;
    const sz = -y * st + z * ct;

    let lon = Math.atan2(sx, sz) + r;
    while (lon < -Math.PI) lon += Math.PI * 2;
    while (lon > Math.PI) lon -= Math.PI * 2;

    const lat = Math.asin(clamp(sy, -1, 1));

    return Object.freeze({
      visible: true,
      u: wrap01((lon + Math.PI) / (Math.PI * 2)),
      v: clamp01(0.5 - lat / Math.PI),
      longitudeRadians: lon,
      latitudeRadians: lat,
      normal: Object.freeze({ x: sx, y: sy, z: sz })
    });
  }

  function fbm2(u, v, options = {}) {
    const helper = M();
    if (helper?.fbm2) return helper.fbm2(u, v, options);

    const x = Math.sin((u * 127.1 + v * 311.7 + finite(options.seed, 0)) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  function rgb(color) {
    const source = Array.isArray(color) ? color : [0, 0, 0];

    return Object.freeze([
      clamp(Math.round(finite(source[0], 0)), 0, 255),
      clamp(Math.round(finite(source[1], 0)), 0, 255),
      clamp(Math.round(finite(source[2], 0)), 0, 255)
    ]);
  }

  function colorFromPalette(path, fallback) {
    const palette = P();
    if (palette?.getColor) return rgb(palette.getColor(path, fallback));
    return rgb(fallback);
  }

  function mixColor(a, b, t) {
    const aa = rgb(a);
    const bb = rgb(b);
    const k = clamp01(t);

    return Object.freeze([
      Math.round(lerp(aa[0], bb[0], k)),
      Math.round(lerp(aa[1], bb[1], k)),
      Math.round(lerp(aa[2], bb[2], k))
    ]);
  }

  function shadeColor(color, factor) {
    const source = rgb(color);
    const f = finite(factor, 1);

    return Object.freeze([
      clamp(Math.round(source[0] * f), 0, 255),
      clamp(Math.round(source[1] * f), 0, 255),
      clamp(Math.round(source[2] * f), 0, 255)
    ]);
  }

  function blendColor(base, overlay, alpha) {
    const b = rgb(base);
    const o = rgb(overlay);
    const a = clamp01(alpha);

    return Object.freeze([
      Math.round(lerp(b[0], o[0], a)),
      Math.round(lerp(b[1], o[1], a)),
      Math.round(lerp(b[2], o[2], a))
    ]);
  }

  function rgba(color, alpha = 1) {
    const c = rgb(color);
    return `rgba(${c[0]},${c[1]},${c[2]},${clamp01(alpha)})`;
  }

  function safeDataset(key, value) {
    if (typeof document === "undefined" || !document.documentElement?.dataset) return;

    try {
      document.documentElement.dataset[key] = String(value);
    } catch {
      // Dataset writes are proof metadata only.
    }
  }

  function sampleSurfaceFallback(uInput, vInput) {
    const u = wrap01(uInput);
    const v = clamp01(vInput);
    const lat = 90 - v * 180;
    const landNoise = fbm2(u * 1.4 + 0.12, v * 1.2 - 0.18, { seed: 16001, scale: 3.0, octaves: 4 });
    const ridge = fbm2(u * 4.6 - 0.22, v * 3.4 + 0.16, { seed: 16002, scale: 6.0, octaves: 3 });
    const landScore = landNoise * 0.58 + ridge * 0.18 + (1 - Math.abs(lat) / 90) * 0.12 - 0.43;

    let color = FALLBACK_COLORS.ocean;
    let surfaceClass = "ocean-material";

    if (landScore > -0.06 && landScore <= 0.02) {
      color = mixColor(FALLBACK_COLORS.shelf, FALLBACK_COLORS.beach, clamp01((landScore + 0.06) / 0.08));
      surfaceClass = "shelf-beach-material";
    } else if (landScore > 0.02) {
      color = mixColor(FALLBACK_COLORS.land, FALLBACK_COLORS.forest, clamp01(ridge * 0.45));
      surfaceClass = "land-material";

      if (ridge > 0.72) {
        color = mixColor(color, FALLBACK_COLORS.mountain, 0.38);
        surfaceClass = "mountain-material";
      }

      if (Math.abs(lat) > 68) {
        color = mixColor(color, FALLBACK_COLORS.snow, 0.52);
        surfaceClass = "snow-ice-material";
      }
    }

    return Object.freeze({
      contract: "fallback-surface",
      class: surfaceClass,
      color,
      rgb: color,
      materialColor: color,
      visualGuidance: Object.freeze({
        shouldPaint: true,
        shouldStayBelowAtmosphere: true
      })
    });
  }

  function sampleAtmosphereFallback(uInput, vInput) {
    const u = wrap01(uInput);
    const v = clamp01(vInput);
    const cloud = fbm2(u * 3.0 + 0.33, v * 2.2 - 0.19, { seed: 17001, scale: 4.0, octaves: 4 });
    const haze = fbm2(u * 1.2 - 0.11, v * 0.9 + 0.17, { seed: 17002, scale: 2.0, octaves: 3 });

    return Object.freeze({
      contract: "fallback-atmosphere",
      class: "restrained-atmosphere-field",
      skyTint: FALLBACK_COLORS.atmosphere,
      cloudColor: FALLBACK_COLORS.cloud,
      rimColor: FALLBACK_COLORS.rim,
      weatherColor: mixColor(FALLBACK_COLORS.haze, FALLBACK_COLORS.cloud, clamp01(cloud)),
      cloudCover: clamp01(cloud * 0.42),
      cloudOpacity: clamp01(cloud * 0.18),
      hazeOpacity: clamp01(haze * 0.12),
      globalVeilOpacity: clamp01(cloud * 0.12 + haze * 0.08),
      rimLight: 0.28,
      terminatorSoftness: 0.30,
      surfaceVisibility: 0.88,
      hEarthInheritance: Object.freeze({
        inheritsByDefault: true,
        sourcePlanet: "Audralia",
        downstreamView: "H-Earth / Hybrid Earth",
        downstreamRoute: H_EARTH_ROUTE
      })
    });
  }

  function sampleSurface(u, v) {
    const surface = S();

    try {
      if (surface?.sampleSurface) return surface.sampleSurface(u, v);
      if (surface?.sample) return surface.sample(u, v);
    } catch (error) {
      safeDataset("audraliaCanvasSurfaceReadFailed", "true");
      safeDataset("audraliaCanvasSurfaceReadError", error instanceof Error ? error.message : String(error));
    }

    return sampleSurfaceFallback(u, v);
  }

  function sampleAtmosphere(u, v) {
    const atmosphere = A();

    try {
      if (atmosphere?.sampleAtmosphere) return atmosphere.sampleAtmosphere(u, v);
      if (atmosphere?.sampleWeather) return atmosphere.sampleWeather(u, v);
      if (atmosphere?.sample) return atmosphere.sample(u, v);
    } catch (error) {
      safeDataset("audraliaCanvasAtmosphereReadFailed", "true");
      safeDataset("audraliaCanvasAtmosphereReadError", error instanceof Error ? error.message : String(error));
    }

    return sampleAtmosphereFallback(u, v);
  }

  function getContext2d(canvas) {
    if (!canvas || typeof canvas.getContext !== "function") return null;

    return canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    }) || canvas.getContext("2d");
  }

  function readDpr(maxDpr = DEFAULTS.dprCap) {
    const native = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    return clamp(native, 1, finite(maxDpr, DEFAULTS.dprCap));
  }

  function computeCanvasSize(canvas, snapshot = {}, options = {}) {
    const dpr = clamp(
      finite(snapshot.dpr, readDpr(options.dprCap ?? DEFAULTS.dprCap)),
      1,
      finite(options.dprCap, DEFAULTS.dprCap)
    );

    const cssWidth = Math.max(
      1,
      Math.floor(
        finite(
          snapshot.width,
          canvas?.clientWidth || canvas?.offsetWidth || options.width || 800
        )
      )
    );

    const cssHeight = Math.max(
      1,
      Math.floor(
        finite(
          snapshot.height,
          canvas?.clientHeight || canvas?.offsetHeight || options.height || 520
        )
      )
    );

    const pixelWidth = Math.max(1, Math.floor(finite(snapshot.pixelWidth, cssWidth * dpr)));
    const pixelHeight = Math.max(1, Math.floor(finite(snapshot.pixelHeight, cssHeight * dpr)));
    const radius = Math.max(
      80,
      finite(snapshot.radius, Math.min(pixelWidth, pixelHeight) * finite(options.radiusScale, DEFAULTS.radiusScale))
    );
    const cx = finite(snapshot.cx, pixelWidth * finite(options.cxRatio, DEFAULTS.cxRatio));
    const cy = finite(snapshot.cy, pixelHeight * finite(options.cyRatio, DEFAULTS.cyRatio));
    const sphereSize = clamp(Math.floor(radius * 2), 260, 720);

    return Object.freeze({
      cssWidth,
      cssHeight,
      pixelWidth,
      pixelHeight,
      dpr,
      radius,
      cx,
      cy,
      sphereSize
    });
  }

  function normalizeOptions(options = {}) {
    return Object.freeze({
      textureWidth: clamp(
        Math.floor(finite(options.textureWidth, DEFAULTS.textureWidth)),
        DEFAULTS.minTextureWidth,
        DEFAULTS.maxTextureWidth
      ),
      textureHeight: clamp(
        Math.floor(finite(options.textureHeight, DEFAULTS.textureHeight)),
        Math.floor(DEFAULTS.minTextureWidth / 2),
        Math.floor(DEFAULTS.maxTextureWidth / 2)
      ),
      dprCap: finite(options.dprCap, DEFAULTS.dprCap),
      radiusScale: finite(options.radiusScale, DEFAULTS.radiusScale),
      cxRatio: finite(options.cxRatio, DEFAULTS.cxRatio),
      cyRatio: finite(options.cyRatio, DEFAULTS.cyRatio),
      background: Boolean(options.background ?? DEFAULTS.background),
      proofStatus: Boolean(options.proofStatus ?? DEFAULTS.proofStatus),
      surfaceVisibilityFloor: clamp01(options.surfaceVisibilityFloor ?? DEFAULTS.surfaceVisibilityFloor),
      atmosphereMaxBlend: clamp01(options.atmosphereMaxBlend ?? DEFAULTS.atmosphereMaxBlend),
      rimMaxOpacity: clamp01(options.rimMaxOpacity ?? DEFAULTS.rimMaxOpacity),
      lightingFloor: clamp01(options.lightingFloor ?? DEFAULTS.lightingFloor),
      lightingCeiling: finite(options.lightingCeiling, DEFAULTS.lightingCeiling),
      specularStrength: clamp01(options.specularStrength ?? DEFAULTS.specularStrength)
    });
  }

  function createTexture(width, height) {
    return {
      width,
      height,
      surface: new Uint8ClampedArray(width * height * 4),
      atmosphere: new Uint8ClampedArray(width * height * 4),
      classes: new Array(width * height),
      built: false,
      builtAt: 0
    };
  }

  function writeTexturePixel(texture, index, surfaceColor, atmosphereColor, atmosphereAlpha, surfaceClass) {
    const offset = index * 4;
    const s = rgb(surfaceColor);
    const a = rgb(atmosphereColor);

    texture.surface[offset] = s[0];
    texture.surface[offset + 1] = s[1];
    texture.surface[offset + 2] = s[2];
    texture.surface[offset + 3] = 255;

    texture.atmosphere[offset] = a[0];
    texture.atmosphere[offset + 1] = a[1];
    texture.atmosphere[offset + 2] = a[2];
    texture.atmosphere[offset + 3] = clamp(Math.round(clamp01(atmosphereAlpha) * 255), 0, 255);

    texture.classes[index] = surfaceClass || "surface-material";
  }

  function sampleTexture(texture, uInput, vInput) {
    const u = wrap01(uInput);
    const v = clamp01(vInput);
    const x = Math.floor(u * texture.width) % texture.width;
    const y = clamp(Math.floor(v * texture.height), 0, texture.height - 1);
    const index = y * texture.width + x;
    const offset = index * 4;

    return Object.freeze({
      surface: Object.freeze([
        texture.surface[offset],
        texture.surface[offset + 1],
        texture.surface[offset + 2]
      ]),
      atmosphere: Object.freeze([
        texture.atmosphere[offset],
        texture.atmosphere[offset + 1],
        texture.atmosphere[offset + 2]
      ]),
      atmosphereAlpha: texture.atmosphere[offset + 3] / 255,
      class: texture.classes[index] || "surface-material"
    });
  }

  function buildTexture(texture, options = {}) {
    const start = Date.now();

    for (let y = 0; y < texture.height; y += 1) {
      const v = (y + 0.5) / texture.height;

      for (let x = 0; x < texture.width; x += 1) {
        const u = (x + 0.5) / texture.width;
        const index = y * texture.width + x;

        const surface = sampleSurface(u, v);
        const atmosphere = sampleAtmosphere(u, v);

        const surfaceColor = surface.rgb || surface.color || surface.materialColor || FALLBACK_COLORS.land;
        const atmosphereColor = atmosphere.weatherColor || atmosphere.cloudColor || atmosphere.skyTint || FALLBACK_COLORS.atmosphere;

        const visibility = clamp01(atmosphere.surfaceVisibility ?? 0.88);
        const rawVeil = clamp01(
          atmosphere.globalVeilOpacity ??
          ((atmosphere.cloudOpacity || 0) + (atmosphere.hazeOpacity || 0)) * 0.5
        );

        const alpha = clamp(
          rawVeil * 0.78 + (1 - visibility) * 0.10,
          0,
          finite(options.atmosphereMaxBlend, DEFAULTS.atmosphereMaxBlend)
        );

        writeTexturePixel(
          texture,
          index,
          surfaceColor,
          atmosphereColor,
          alpha,
          surface.surfaceClass || surface.class
        );
      }
    }

    texture.built = true;
    texture.builtAt = Date.now();

    return Object.freeze({
      textureBuilt: true,
      textureWidth: texture.width,
      textureHeight: texture.height,
      buildMs: texture.builtAt - start,
      surfaceSamples: texture.width * texture.height,
      atmosphereSamples: texture.width * texture.height,
      visualPassClaimed: false
    });
  }

  function drawBackground(ctx, size) {
    const gradient = ctx.createRadialGradient(
      size.pixelWidth * 0.50,
      size.pixelHeight * 0.42,
      Math.min(size.pixelWidth, size.pixelHeight) * 0.08,
      size.pixelWidth * 0.50,
      size.pixelHeight * 0.50,
      Math.max(size.pixelWidth, size.pixelHeight) * 0.74
    );

    gradient.addColorStop(0, rgba(colorFromPalette("space.field", FALLBACK_COLORS.spaceGlow), 0.72));
    gradient.addColorStop(0.44, rgba(colorFromPalette("space.deep", FALLBACK_COLORS.spaceMid), 0.96));
    gradient.addColorStop(1, rgba(colorFromPalette("space.void", FALLBACK_COLORS.spaceTop), 1));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.pixelWidth, size.pixelHeight);
  }

  function renderSphereImage(ctx, texture, snapshot, size, options) {
    const diameter = Math.max(2, Math.floor(size.radius * 2));
    const image = ctx.createImageData(diameter, diameter);
    const data = image.data;

    const rotation = finite(snapshot.rotation, -0.88);
    const tilt = finite(snapshot.tilt, -0.11);
    const lightX = -0.32;
    const lightY = -0.20;
    const lightZ = 0.925;

    let painted = 0;
    let atmospherePixels = 0;

    for (let py = 0; py < diameter; py += 1) {
      const ny = (py + 0.5 - size.radius) / size.radius;

      for (let px = 0; px < diameter; px += 1) {
        const nx = (px + 0.5 - size.radius) / size.radius;
        const rr = nx * nx + ny * ny;
        const outOffset = (py * diameter + px) * 4;

        if (rr > 1) {
          data[outOffset + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const projected = projectSpherePoint(nx, ny, rotation, tilt);

        if (!projected.visible) {
          data[outOffset + 3] = 0;
          continue;
        }

        const texel = sampleTexture(texture, projected.u, projected.v);

        const lambert = clamp01(nx * lightX + (-ny) * lightY + z * lightZ);
        const edge = clamp01(1 - z);
        const terminator = clamp01(lambert);
        const lighting = clamp(
          options.lightingFloor + terminator * 0.74 - edge * 0.12,
          options.lightingFloor,
          options.lightingCeiling
        );

        let color = shadeColor(texel.surface, lighting);

        const specular = Math.pow(clamp01(lambert), 18) * options.specularStrength;
        if (specular > 0.005) {
          color = blendColor(color, colorFromPalette("lighting.specular", [244, 255, 240]), specular);
        }

        const atmosphereAlpha = clamp(
          texel.atmosphereAlpha * (0.72 + edge * 0.38),
          0,
          options.atmosphereMaxBlend
        );

        if (atmosphereAlpha > 0.002) {
          color = blendColor(color, texel.atmosphere, atmosphereAlpha);
          atmospherePixels += 1;
        }

        const rimAlpha = clamp(edge * edge * options.rimMaxOpacity, 0, options.rimMaxOpacity);
        if (rimAlpha > 0.002) {
          color = blendColor(color, colorFromPalette("atmosphere.rim", FALLBACK_COLORS.rim), rimAlpha);
        }

        data[outOffset] = color[0];
        data[outOffset + 1] = color[1];
        data[outOffset + 2] = color[2];
        data[outOffset + 3] = 255;
        painted += 1;
      }
    }

    const dx = Math.round(size.cx - size.radius);
    const dy = Math.round(size.cy - size.radius);
    ctx.putImageData(image, dx, dy);

    return Object.freeze({
      paintedPixels: painted,
      atmospherePixels,
      diameter,
      radius: size.radius,
      cx: size.cx,
      cy: size.cy
    });
  }

  function drawRim(ctx, size, options) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(size.cx, size.cy, size.radius, 0, Math.PI * 2);
    ctx.closePath();

    const rim = ctx.createRadialGradient(
      size.cx,
      size.cy,
      size.radius * 0.72,
      size.cx,
      size.cy,
      size.radius * 1.08
    );

    rim.addColorStop(0, rgba(colorFromPalette("atmosphere.rim", FALLBACK_COLORS.rim), 0));
    rim.addColorStop(0.78, rgba(colorFromPalette("atmosphere.rim", FALLBACK_COLORS.rim), options.rimMaxOpacity * 0.32));
    rim.addColorStop(1, rgba(colorFromPalette("atmosphere.rim", FALLBACK_COLORS.rim), 0));

    ctx.strokeStyle = rgba(colorFromPalette("atmosphere.rim", FALLBACK_COLORS.rim), options.rimMaxOpacity * 0.70);
    ctx.lineWidth = Math.max(1, size.dpr * 1.4);
    ctx.stroke();

    ctx.fillStyle = rim;
    ctx.fillRect(size.cx - size.radius * 1.15, size.cy - size.radius * 1.15, size.radius * 2.3, size.radius * 2.3);
    ctx.restore();
  }

  function drawProofStatus(ctx, size, state) {
    const line = `${CONTRACT} · composition-only · no visual-pass claim`;
    const fontSize = Math.max(11, Math.round(11 * size.dpr));

    ctx.save();
    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = rgba(colorFromPalette("proof.ink", FALLBACK_COLORS.ink), 0.86);
    ctx.fillText(line, Math.round(18 * size.dpr), size.pixelHeight - Math.round(16 * size.dpr));

    ctx.fillStyle = rgba(colorFromPalette("proof.line", FALLBACK_COLORS.line), 0.76);
    ctx.fillText(
      `texture ${state.texture?.width || 0}×${state.texture?.height || 0} · draw-order locked`,
      Math.round(18 * size.dpr),
      size.pixelHeight - Math.round(34 * size.dpr)
    );
    ctx.restore();
  }

  function createCompositor(options = {}) {
    const opts = normalizeOptions(options);

    const state = {
      canvas: options.canvas || null,
      ctx: null,
      texture: createTexture(opts.textureWidth, opts.textureHeight),
      textureDirty: true,
      lastSize: null,
      lastRenderReceipt: null,
      renderCount: 0,
      destroyed: false,
      options: opts
    };

    function bindCanvas(canvas) {
      state.canvas = canvas || null;
      state.ctx = getContext2d(state.canvas);

      if (!state.canvas || !state.ctx) {
        return Object.freeze({
          bound: false,
          reason: "canvas_bind_failed",
          contract: CONTRACT
        });
      }

      safeDataset("audraliaCanvasBound", "true");
      safeDataset("audraliaCanvasContract", CONTRACT);

      return Object.freeze({
        bound: true,
        reason: "canvas_bound",
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }

    function resize(snapshot = {}) {
      if (!state.canvas) {
        return Object.freeze({
          resized: false,
          reason: "canvas_missing"
        });
      }

      const size = computeCanvasSize(state.canvas, snapshot, state.options);

      if (state.canvas.width !== size.pixelWidth) state.canvas.width = size.pixelWidth;
      if (state.canvas.height !== size.pixelHeight) state.canvas.height = size.pixelHeight;

      state.lastSize = size;

      return Object.freeze({
        resized: true,
        size
      });
    }

    function rebuildTexture() {
      const result = buildTexture(state.texture, state.options);
      state.textureDirty = false;

      safeDataset("audraliaCanvasTextureBuilt", "true");
      safeDataset("audraliaCanvasTextureSize", `${state.texture.width}x${state.texture.height}`);

      return result;
    }

    function markTextureDirty() {
      state.textureDirty = true;

      return Object.freeze({
        textureDirty: true,
        contract: CONTRACT
      });
    }

    function render(snapshot = {}) {
      if (state.destroyed) {
        return Object.freeze({
          rendered: false,
          reason: "canvas_compositor_destroyed",
          contract: CONTRACT
        });
      }

      if (!state.canvas || !state.ctx) {
        const bindResult = bindCanvas(state.canvas);
        if (!bindResult.bound) {
          return Object.freeze({
            rendered: false,
            reason: "canvas_context_missing",
            contract: CONTRACT
          });
        }
      }

      const sizeResult = resize(snapshot);
      if (!sizeResult.resized) {
        return Object.freeze({
          rendered: false,
          reason: sizeResult.reason,
          contract: CONTRACT
        });
      }

      const size = sizeResult.size;
      const ctx = state.ctx;

      if (state.textureDirty || !state.texture.built) {
        rebuildTexture();
      }

      ctx.save();
      ctx.clearRect(0, 0, size.pixelWidth, size.pixelHeight);

      if (state.options.background) {
        drawBackground(ctx, size);
      }

      const sphere = renderSphereImage(ctx, state.texture, snapshot, size, state.options);
      drawRim(ctx, size, state.options);

      state.renderCount += 1;

      const receipt = Object.freeze({
        rendered: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "audralia-canvas-composition-only",
        fileNumber: FILE_NUMBER,
        primaryNode: PRIMARY_NODE,
        subnodes: SUBNODE_RANGE,
        drawOrder: DRAW_ORDER,
        renderCount: state.renderCount,
        size,
        sphere,
        texture: Object.freeze({
          width: state.texture.width,
          height: state.texture.height,
          built: state.texture.built,
          builtAt: state.texture.builtAt
        }),
        runtimeRead: Boolean(snapshot && typeof snapshot === "object"),
        ownsCanvas: true,
        ownsCompositionOnly: true,
        ownsRuntimeMotion: false,
        ownsControls: false,
        ownsRoute: false,
        ownsHtml: false,
        ownsFootprint: false,
        ownsHydrology: false,
        ownsElevation: false,
        ownsClimate: false,
        ownsBiome: false,
        ownsSurfaceTruth: false,
        ownsAtmosphereTruth: false,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });

      state.lastRenderReceipt = receipt;

      if (state.options.proofStatus) {
        drawProofStatus(ctx, size, state);
      }

      ctx.restore();

      safeDataset("audraliaCanvasRendered", "true");
      safeDataset("audraliaCanvasRenderCount", String(state.renderCount));
      safeDataset("audraliaCanvasVisualPassClaimed", "false");

      return receipt;
    }

    function getLastRenderReceipt() {
      return state.lastRenderReceipt || Object.freeze({
        rendered: false,
        reason: "canvas_not_rendered_yet",
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }

    function getState() {
      return Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "audralia-canvas-composition-only-instance",
        canvasBound: Boolean(state.canvas),
        contextBound: Boolean(state.ctx),
        textureWidth: state.texture.width,
        textureHeight: state.texture.height,
        textureBuilt: state.texture.built,
        textureDirty: state.textureDirty,
        renderCount: state.renderCount,
        destroyed: state.destroyed,
        lastSize: state.lastSize,
        lastRenderReceipt: state.lastRenderReceipt,
        ownsCompositionOnly: true,
        visualPassClaimed: false
      });
    }

    function destroy() {
      state.destroyed = true;
      state.canvas = null;
      state.ctx = null;
      state.lastRenderReceipt = null;

      return Object.freeze({
        destroyed: true,
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }

    if (state.canvas) bindCanvas(state.canvas);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-canvas-composition-only-instance",

      bindCanvas,
      resize,
      rebuildTexture,
      markTextureDirty,
      render,
      getLastRenderReceipt,
      getState,
      destroy
    });
  }

  function renderCanvas(canvas, snapshot = {}, options = {}) {
    const compositor = createCompositor({ ...options, canvas });
    return compositor.render(snapshot);
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_canvas_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.canvas.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function validatePriorAuthorities() {
    const runtime = R();
    const controls = Cn();
    const surface = S();
    const atmosphere = A();
    const math = M();
    const palette = P();

    return Object.freeze({
      math: Object.freeze({
        available: Boolean(math),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
        actualContract: math?.contract || null,
        valid: !math || math.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
      }),
      palette: Object.freeze({
        available: Boolean(palette),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1",
        actualContract: palette?.contract || null,
        valid: !palette || palette.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1"
      }),
      runtime: Object.freeze({
        available: Boolean(runtime),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1",
        actualContract: runtime?.contract || null,
        valid: !runtime || runtime.contract === "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1"
      }),
      controls: Object.freeze({
        available: Boolean(controls),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_CONTROLS_TNT_v1",
        actualContract: controls?.contract || null,
        valid: !controls || controls.contract === "AUDRALIA_CLEAN_CANVAS_CONTROLS_TNT_v1"
      }),
      surface: Object.freeze({
        available: Boolean(surface),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1",
        actualContract: surface?.contract || null,
        valid: !surface || surface.contract === "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1"
      }),
      atmosphere: Object.freeze({
        available: Boolean(atmosphere),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1",
        actualContract: atmosphere?.contract || null,
        valid: !atmosphere || atmosphere.contract === "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1"
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-canvas-composition-only",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.js",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: CANVAS_TARGETS,
      defaults: DEFAULTS,
      drawOrder: DRAW_ORDER,
      owns: Object.freeze([
        "draw order",
        "canvas sizing",
        "texture buffer coordination",
        "sphere composition",
        "lighting composition",
        "atmosphere overlay composition",
        "rim composition",
        "optional proof-status drawing"
      ]),
      doesNotOwn: Object.freeze([
        "universal manifest law",
        "math primitives",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "land/ocean footprint",
        "continent creation",
        "water behavior",
        "hydrology authority",
        "elevation depth",
        "climate fields",
        "biome categories",
        "surface material truth",
        "atmosphere truth",
        "weather truth",
        "runtime motion",
        "pointer listeners",
        "touch listeners",
        "controls",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      priorAuthorities: validatePriorAuthorities(),
      ownsCompositionOnly: true,
      runtimeMotionForbidden: true,
      controlsForbidden: true,
      routeBridgeForbidden: true,
      htmlExpressionForbidden: true,
      hEarthMayReceiveCanvasPattern: true,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    FILE_NUMBER,
    PRIMARY_NODE,
    SUBNODE_RANGE,
    UNIVERSAL_ANCHOR,
    AUDRALIA_ROUTE,
    H_EARTH_ROUTE,
    DEFAULTS,
    CANVAS_TARGETS,
    DRAW_ORDER,

    createCompositor,
    renderCanvas,
    computeCanvasSize,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_CANVAS = API;
  window.AUDRALIA_CANVAS_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_COMPOSITOR = API;
  window.AUDRALIA_CLEAN_CANVAS_COMPOSITOR_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_CANVAS = API;
  window.AUDRALIA_CLEAN_CANVAS_CANVAS_RECEIPT = getStatus();

  if (typeof document !== "undefined" && document.documentElement?.dataset) {
    document.documentElement.dataset.audraliaCanvasLoaded = "true";
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasCompositorLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasCompositorContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasCompositorReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasCompositorNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasCompositorSubnodes = "225-240";
    document.documentElement.dataset.audraliaCanvasOwnsCompositionOnly = "true";
    document.documentElement.dataset.audraliaCanvasOwnsRuntimeMotion = "false";
    document.documentElement.dataset.audraliaCanvasOwnsControls = "false";
    document.documentElement.dataset.audraliaCanvasOwnsRoute = "false";
    document.documentElement.dataset.audraliaCanvasOwnsHtml = "false";
    document.documentElement.dataset.audraliaCanvasOwnsSurfaceTruth = "false";
    document.documentElement.dataset.audraliaCanvasOwnsAtmosphereTruth = "false";
    document.documentElement.dataset.audraliaCanvasDrawOrderLocked = "true";
    document.documentElement.dataset.audraliaCanvasTextureBufferCoordination = "true";
    document.documentElement.dataset.audraliaCanvasSphereComposition = "true";
    document.documentElement.dataset.audraliaCanvasAtmosphereOverlayComposition = "true";
    document.documentElement.dataset.hEarthMayReceiveAudraliaCanvasPattern = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();
