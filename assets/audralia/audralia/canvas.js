function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function stableDither(u, v) {
  const s = Math.sin((u * 127.1 + v * 311.7) * 43758.5453123);
  return s - Math.floor(s);
}

function cubeRound(q, r) {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(s);

  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}

function nearestHexCenter(xPx, yPx, hexRadius) {
  const q = (Math.sqrt(3) / 3 * xPx - 1 / 3 * yPx) / hexRadius;
  const r = (2 / 3 * yPx) / hexRadius;
  const rounded = cubeRound(q, r);

  return {
    x: hexRadius * Math.sqrt(3) * (rounded.q + rounded.r / 2),
    y: hexRadius * 1.5 * rounded.r
  };
}

function colorMix(a, b, amount) {
  const t = clamp(amount, 0, 1);

  return [
    Math.round(mix(a[0], b[0], t)),
    Math.round(mix(a[1], b[1], t)),
    Math.round(mix(a[2], b[2], t)),
    255
  ];
}

function applyLight(color, amount) {
  return [
    clamp(Math.round(color[0] * amount), 0, 255),
    clamp(Math.round(color[1] * amount), 0, 255),
    clamp(Math.round(color[2] * amount), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

function sampleNumber(sample, keys, fallback = 0) {
  if (!sample || typeof sample !== "object") return fallback;

  for (let i = 0; i < keys.length; i += 1) {
    const value = Number(sample[keys[i]]);
    if (Number.isFinite(value)) return value;
  }

  return fallback;
}

function isVisibleTerrainLand(sample) {
  return Boolean(
    sample &&
      (
        sample.visibleTerrainLand ||
        sample.landVisibleToRoute ||
        sample.isLand ||
        sample.land ||
        sample.isAboveWaterLandFootprint
      )
  );
}

function isIceSurface(sample) {
  const text = [
    sample && sample.visualSurfaceClass,
    sample && sample.surfaceClass,
    sample && sample.waterClass
  ].join(" ");

  return Boolean(
    sample &&
      (
        sample.isIce ||
        sample.isGlacier ||
        sample.isSnowpack ||
        text.includes("ice") ||
        text.includes("glacier") ||
        text.includes("snowpack")
      )
  );
}

function isSolidSurface(sample) {
  return Boolean(
    sample &&
      (
        sample.solidSurfaceLand ||
        sample.solidSurface ||
        sample.topologyLandFootprint ||
        isVisibleTerrainLand(sample) ||
        isIceSurface(sample)
      )
  );
}

function isWaterSurface(sample) {
  return Boolean(
    sample &&
      (
        sample.isOceanWater ||
        sample.isWater ||
        sample.waterVisibleToRoute ||
        sample.waterClass === "ocean_water" ||
        sample.waterClass === "shelf_water" ||
        sample.waterClass === "coastal_water" ||
        sample.waterClass === "terrain_moisture"
      ) &&
      !isVisibleTerrainLand(sample) &&
      !isIceSurface(sample)
  );
}

function isShelfSurface(sample) {
  return Boolean(
    sample &&
      (
        sample.isShelfWater ||
        sample.isCoastalWater ||
        Number(sample.shelfWaterIndex) > 0.30 ||
        Number(sample.coastalTurquoiseIndex) > 0.34 ||
        sample.waterClass === "shelf_water" ||
        sample.waterClass === "coastal_water" ||
        String(sample.visualSurfaceClass || "").includes("shelf")
      ) &&
      isWaterSurface(sample)
  );
}

function isDarkWaterPixel(color) {
  const r = color[0];
  const g = color[1];
  const b = color[2];

  return b > r * 1.12 && b > g * 0.92 && r < 34 && g < 102;
}

function isTurquoisePixel(color) {
  const r = color[0];
  const g = color[1];
  const b = color[2];

  return g > 128 && b > 140 && g >= r * 1.18;
}

function landColor(sample, u, v) {
  const elevation = clamp(sampleNumber(sample, ["normalizedElevation", "elevation"], 0.28), 0, 1);
  const mineral = clamp(
    sampleNumber(sample, ["mineralReliefIndex", "exposedMineralHardnessIndex", "diamondGraniteSlateReliefIndex"], 0.35),
    0,
    1
  );
  const ridge = clamp(sampleNumber(sample, ["ridgePressure", "mountainPressure", "terrainPressureHandoff"], 0.30), 0, 1);
  const basin = clamp(sampleNumber(sample, ["basinPressure", "ancientWeatheringIndex", "erosionMemoryIndex"], 0.28), 0, 1);
  const beach =
    Boolean(sample && sample.isBeach) ||
    sampleNumber(sample, ["beachOutlinePressure", "beachWaterContactIndex"], 0) > 0.18;

  const low = [138, 112, 78, 255];
  const mid = [166, 136, 92, 255];
  const high = [190, 162, 112, 255];
  const rock = [116, 112, 104, 255];
  const sand = [200, 178, 126, 255];

  let color = colorMix(low, mid, clamp(elevation * 0.84 + basin * 0.10, 0, 1));
  color = colorMix(color, high, clamp(elevation * 0.24, 0, 0.44));
  color = colorMix(color, rock, clamp(mineral * ridge * 0.16, 0, 0.24));

  if (beach) {
    color = colorMix(color, sand, clamp(0.22 + sampleNumber(sample, ["beachOutlinePressure"], 0) * 0.18, 0.18, 0.42));
  }

  const grain = (stableDither(u * 19.0, v * 19.0) - 0.5) * 0.035;
  return applyLight(color, clamp(0.98 + grain + ridge * 0.032 - basin * 0.016, 0.90, 1.08));
}

function iceColor(sample, u, v) {
  const relief = clamp(sampleNumber(sample, ["glacierSeatPressure", "snowpackPressure", "ridgePressure"], 0.5), 0, 1);
  const color = colorMix([208, 226, 232, 255], [244, 250, 252, 255], clamp(0.36 + relief * 0.30, 0, 1));
  const grain = (stableDither(u * 13.0, v * 13.0) - 0.5) * 0.026;

  return applyLight(color, clamp(0.98 + grain, 0.92, 1.06));
}

function waterColor(sample, u, v) {
  const shelf = clamp(
    sampleNumber(sample, ["coastalTurquoiseIndex", "shelfWaterIndex", "coastalShelfBlueIndex", "shelfDepthIndex"], 0),
    0,
    1
  );

  const routeSafeDepth = clamp(
    sampleNumber(sample, ["oceanDepthIndex", "visibleWaterDepthIndex", "bathymetryHydrationIndex", "basinDepthIndex"], 0.28),
    0,
    1
  );

  const softDeep = clamp(
    sampleNumber(sample, ["deepOceanBlendIndex", "deepOceanFeatherIndex", "organicDeepOceanPresenceIndex"], 0),
    0,
    1
  );

  const hydration = clamp(
    sampleNumber(sample, ["surfaceWaterIndex", "hydrationActivationIndex", "hydrationConductionIndex"], 0.58),
    0,
    1
  );

  const open = [46, 150, 198, 255];
  const blue = [40, 136, 194, 255];
  const mildDepth = [34, 126, 188, 255];
  const turquoise = [60, 205, 210, 255];
  const paleShelf = [92, 220, 214, 255];

  let color = colorMix(open, blue, clamp(routeSafeDepth * 0.25, 0, 0.30));
  color = colorMix(color, mildDepth, clamp(softDeep * 0.08, 0, 0.10));
  color = colorMix(color, turquoise, clamp(shelf * 0.56, 0, 0.64));
  color = colorMix(color, paleShelf, clamp(Math.max(0, shelf - 0.58) * 0.22, 0, 0.22));

  const ripple = (stableDither(u * 17.0 + 0.11, v * 17.0 - 0.23) - 0.5) * 0.026;
  const lift = clamp((hydration - 0.45) * 0.036, -0.012, 0.032);

  return applyLight(color, clamp(1.00 + ripple + lift, 0.92, 1.08));
}

function surfaceColor(sample, u, v) {
  if (!sample || sample.routeSampleError) {
    return [48, 132, 176, 255];
  }

  if (isIceSurface(sample)) return iceColor(sample, u, v);
  if (isVisibleTerrainLand(sample)) return landColor(sample, u, v);
  if (isWaterSurface(sample)) return waterColor(sample, u, v);
  if (isSolidSurface(sample)) return landColor(sample, u, v);

  return waterColor(sample, u, v);
}

function applyAqueousGlaze(color, sample) {
  if (isIceSurface(sample)) {
    return colorMix(color, [96, 190, 216, 255], 0.035);
  }

  if (isVisibleTerrainLand(sample)) {
    return colorMix(color, [50, 172, 204, 255], 0.105);
  }

  if (isWaterSurface(sample)) {
    const shelf = clamp(
      sampleNumber(sample, ["coastalTurquoiseIndex", "shelfWaterIndex", "coastalShelfBlueIndex"], 0),
      0,
      1
    );

    return colorMix(color, [58, 203, 210, 255], clamp(0.08 + shelf * 0.11, 0.08, 0.20));
  }

  return color;
}

function readRuntimeApi(module) {
  return module && module.default && typeof module.default === "object" ? module.default : module;
}

function createRuntimeInstance(runtimeApi) {
  if (runtimeApi && typeof runtimeApi.createAudraliaRuntime === "function") {
    return runtimeApi.createAudraliaRuntime({
      fieldWidth: DEFAULTS.runtimeFieldWidth,
      fieldHeight: DEFAULTS.runtimeFieldHeight
    });
  }

  return runtimeApi;
}

function safeRuntimeStatus(runtime, runtimeApi) {
  try {
    if (runtime && typeof runtime.getStatus === "function") return runtime.getStatus();
    if (runtimeApi && typeof runtimeApi.getStatus === "function") return runtimeApi.getStatus();
  } catch (error) {
    return {
      ok: false,
      error: String(error && error.message ? error.message : error)
    };
  }

  return {
    ok: false,
    error: "AUDRALIA_RUNTIME_STATUS_UNAVAILABLE"
  };
}

function safeRuntimeStats(runtime, runtimeApi) {
  try {
    if (runtime && typeof runtime.getRuntimeStats === "function") return runtime.getRuntimeStats();
    if (runtime && typeof runtime.getStats === "function") return runtime.getStats();
    if (runtimeApi && typeof runtimeApi.getRuntimeStats === "function") return runtimeApi.getRuntimeStats();
    if (runtimeApi && typeof runtimeApi.getStats === "function") return runtimeApi.getStats();
  } catch (error) {
    return {
      totalSamples: 0,
      error: String(error && error.message ? error.message : error)
    };
  }

  return {
    totalSamples: 0
  };
}

function safeSampleRuntime(runtime, runtimeApi, u, v) {
  const input = { u: wrap01(u), v: clamp(v, 0, 1), x: wrap01(u), y: clamp(v, 0, 1) };

  try {
    if (runtime && typeof runtime.sampleRuntimeState === "function") return runtime.sampleRuntimeState(input);
    if (runtime && typeof runtime.sampleAudraliaPlanetState === "function") return runtime.sampleAudraliaPlanetState(input);
    if (runtime && typeof runtime.sampleSurface === "function") return runtime.sampleSurface(input);

    if (runtimeApi && typeof runtimeApi.sampleRuntimeState === "function") return runtimeApi.sampleRuntimeState(input);
    if (runtimeApi && typeof runtimeApi.sampleAudraliaPlanetState === "function") return runtimeApi.sampleAudraliaPlanetState(input);
    if (runtimeApi && typeof runtimeApi.sampleSurface === "function") return runtimeApi.sampleSurface(input);
  } catch (error) {
    return {
      routeSampleError: true,
      routeSampleErrorMessage: String(error && error.message ? error.message : error),
      u: input.u,
      v: input.v
    };
  }

  return {
    routeSampleError: true,
    routeSampleErrorMessage: "AUDRALIA_RUNTIME_SAMPLE_UNAVAILABLE",
    u: input.u,
    v: input.v
  };
}

function createCanvas(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.className = "audralia-true-globe-canvas audralia-adopted-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Audralia current runtime globe rendered by adopted canvas authority");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.maxWidth = `${size}px`;
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.borderRadius = "50%";
  canvas.style.background = "transparent";
  return canvas;
}

function drawAtmosphere(ctx, size, radius) {
  const cx = size / 2;
  const cy = size / 2;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const highlight = ctx.createRadialGradient(
    cx - radius * 0.36,
    cy - radius * 0.36,
    radius * 0.02,
    cx,
    cy,
    radius * 1.18
  );

  highlight.addColorStop(0, "rgba(255,255,255,0.15)");
  highlight.addColorStop(0.32, "rgba(255,255,255,0.04)");
  highlight.addColorStop(0.78, "rgba(0,0,0,0.08)");
  highlight.addColorStop(1, "rgba(0,0,0,0.30)");

  ctx.fillStyle = highlight;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const rim = ctx.createRadialGradient(cx, cy, radius * 0.70, cx, cy, radius);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(0.82, "rgba(8,23,44,0.10)");
  rim.addColorStop(1, "rgba(4,10,20,0.36)");

  ctx.fillStyle = rim;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(190,226,255,0.28)";
  ctx.lineWidth = Math.max(1, size * 0.003);
  ctx.stroke();
  ctx.restore();
}

function drawCanvasFrame(canvas, runtime, runtimeApi, options) {
  const size = canvas.width;
  const ctx = canvas.getContext("2d", { alpha: true });
  const image = ctx.createImageData(size, size);
  const data = image.data;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * DEFAULTS.radiusRatio;
  const hexRadius = clamp(Number(options.hexRadius) || DEFAULTS.hexRadius, 2.5, 7.5);
  const phase = Number(options.phase) || DEFAULTS.phase;

  const lightX = -0.42;
  const lightY = 0.36;
  const lightZ = 0.83;

  const counters = {
    canvasWidth: size,
    canvasHeight: size,
    runtimeSamples: 0,
    opaqueSamples: 0,
    landPixelSamples: 0,
    waterPixelSamples: 0,
    turquoisePixelSamples: 0,
    darkWaterPixelSamples: 0,
    iceOrHighlightPixelSamples: 0,
    solidSurfacePixelSamples: 0,
    solidSurfaceSamples: 0,
    landSamples: 0,
    waterSamples: 0,
    iceSamples: 0,
    shelfSamples: 0,
    softDepthSamples: 0,
    fallbackSamples: 0,
    maxSurfaceWaterIndex: 0,
    maxHydrationActivationIndex: 0,
    maxRouteSafeDepthIndex: 0,
    maxSoftDeepOceanBlendIndex: 0,
    maxTurquoise: 0
  };

  for (let py = 0; py < size; py += 1) {
    const yRaw = py + 0.5 - cy;
    const y = yRaw / radius;

    for (let px = 0; px < size; px += 1) {
      const xRaw = px + 0.5 - cx;
      const x = xRaw / radius;
      const r2 = x * x + y * y;
      const out = (py * size + px) * 4;

      if (r2 > 1) {
        data[out] = 0;
        data[out + 1] = 0;
        data[out + 2] = 0;
        data[out + 3] = 0;
        continue;
      }

      const center = nearestHexCenter(xRaw, yRaw, hexRadius);

      let hx = center.x / radius;
      let hy = center.y / radius;
      let hr2 = hx * hx + hy * hy;

      if (hr2 > 0.999) {
        const scale = 0.999 / Math.sqrt(hr2);
        hx *= scale;
        hy *= scale;
        hr2 = hx * hx + hy * hy;
      }

      const z = Math.sqrt(Math.max(0, 1 - hr2));
      const u = wrap01(phase + Math.atan2(hx, z) / (Math.PI * 2));
      const latitude = Math.asin(clamp(-hy, -1, 1));
      const v = clamp(0.5 - latitude / Math.PI, 0, 1);

      const sample = safeSampleRuntime(runtime, runtimeApi, u, v);
      let color = surfaceColor(sample, u, v);
      color = applyAqueousGlaze(color, sample);

      const dot = clamp(hx * lightX + (-hy) * lightY + z * lightZ, -1, 1);
      const edgeShadow = clamp(1 - Math.pow(r2, 1.85) * 0.24, 0.68, 1);
      const hemisphereShade = clamp(0.82 + dot * 0.22, 0.70, 1.08);
      const shade = clamp(edgeShadow * hemisphereShade, 0.68, 1.10);

      color = applyLight(color, shade);

      data[out] = color[0];
      data[out + 1] = color[1];
      data[out + 2] = color[2];
      data[out + 3] = 255;

      counters.runtimeSamples += 1;
      counters.opaqueSamples += 1;

      if (sample && sample.routeSampleError) counters.fallbackSamples += 1;
      if (isSolidSurface(sample)) counters.solidSurfaceSamples += 1;
      if (isVisibleTerrainLand(sample)) counters.landSamples += 1;
      if (isWaterSurface(sample)) counters.waterSamples += 1;
      if (isIceSurface(sample)) counters.iceSamples += 1;
      if (isShelfSurface(sample)) counters.shelfSamples += 1;

      if (isVisibleTerrainLand(sample)) counters.landPixelSamples += 1;
      if (isWaterSurface(sample)) counters.waterPixelSamples += 1;
      if (isSolidSurface(sample)) counters.solidSurfacePixelSamples += 1;
      if (isIceSurface(sample)) counters.iceOrHighlightPixelSamples += 1;
      if (isTurquoisePixel(color)) counters.turquoisePixelSamples += 1;
      if (isDarkWaterPixel(color)) counters.darkWaterPixelSamples += 1;

      const softDepth = sampleNumber(sample, ["deepOceanBlendIndex", "deepOceanFeatherIndex", "organicDeepOceanPresenceIndex"], 0);
      if (softDepth > 0.10) counters.softDepthSamples += 1;

      counters.maxSurfaceWaterIndex = Math.max(counters.maxSurfaceWaterIndex, sampleNumber(sample, ["surfaceWaterIndex"], 0));
      counters.maxHydrationActivationIndex = Math.max(counters.maxHydrationActivationIndex, sampleNumber(sample, ["hydrationActivationIndex"], 0));
      counters.maxRouteSafeDepthIndex = Math.max(counters.maxRouteSafeDepthIndex, sampleNumber(sample, ["oceanDepthIndex", "visibleWaterDepthIndex"], 0));
      counters.maxSoftDeepOceanBlendIndex = Math.max(counters.maxSoftDeepOceanBlendIndex, softDepth);
      counters.maxTurquoise = Math.max(counters.maxTurquoise, sampleNumber(sample, ["coastalTurquoiseIndex", "shelfWaterIndex"], 0));
    }
  }

  ctx.putImageData(image, 0, 0);
  drawAtmosphere(ctx, size, radius);

  return counters;
}

function createLabel() {
  const label = document.createElement("div");
  label.className = "audralia-globe-label";
  label.textContent = "AUDRALIA · ADOPTED CANVAS";
  label.dataset.labelText = "AUDRALIA · ADOPTED CANVAS";
  return label;
}

function createReceipt(status) {
  const receipt = document.createElement("div");
  receipt.hidden = true;
  receipt.setAttribute("aria-hidden", "true");
  receipt.className = "audralia-canvas-receipt";
  receipt.dataset.body = BODY;
  receipt.dataset.route = ROUTE;
  receipt.dataset.receipt = RECEIPT;
  receipt.dataset.routeReceipt = ROUTE_RECEIPT;
  receipt.dataset.routeRenewal = ROUTE_RENEWAL;
  receipt.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
  receipt.dataset.runtimeVersion = status.runtimeVersion || "";
  receipt.dataset.canvasAuthority = "assets/audralia/audralia.canvas.js";
  receipt.dataset.visualPassClaimed = "false";
  receipt.textContent = [
    "AUDRALIA_CANVAS=ADOPTED_COLUMN_AUTHORITY",
    "ROUTE=DOORWAY_ONLY",
    "RUNTIME=SOURCE_TRUTH",
    "WATER_BLEND=SOFT_CONSUMER_ONLY",
    "VISUAL_PASS=HELD"
  ].join(" · ");
  return receipt;
}

function writeProofDataset(target, result) {
  const counters = result.counters || {};
  const runtimeStats = result.runtimeStats || {};

  target.dataset.audraliaRenderMount = "true";
  target.dataset.renderMount = "true";
  target.dataset.body = BODY;
  target.dataset.route = ROUTE;
  target.dataset.contract = ROUTE_RECEIPT;
  target.dataset.activeRenewal = ROUTE_RENEWAL;
  target.dataset.canvasAuthority = "assets/audralia/audralia.canvas.js";
  target.dataset.canvasAuthorityReceipt = RECEIPT;
  target.dataset.routeMode = "doorway-only";
  target.dataset.routeOwnsCanvas = "false";
  target.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
  target.dataset.runtimeVersion = result.runtimeVersion || "";
  target.dataset.runtimeActiveRenewal = result.runtimeActiveRenewal || "";
  target.dataset.runtimeAuthorityLoaded = String(Boolean(result.runtimeLoaded));
  target.dataset.runtimeInstanceLoaded = String(Boolean(result.runtimeInstanceLoaded));
  target.dataset.runtimeLoadedReceipt = result.runtimeVersion || "";

  target.dataset.compositorModel = "adopted-column-canvas-authority";
  target.dataset.activeSurfaceRenderer = "audralia-adopted-canvas";
  target.dataset.rotationModel = "true-orthographic-front-hemisphere";
  target.dataset.projectionModel = "orthographic-sphere-coordinate-sampling";
  target.dataset.visibleLongitudeSpanDegrees = "180";
  target.dataset.hiddenLongitudeSpanDegrees = "180";
  target.dataset.fullTextureOnVisibleFace = "forbidden";
  target.dataset.flatMapOnSphere = "forbidden";

  target.dataset.consumerOnlySoftWaterBlend = "true";
  target.dataset.hardDeepOceanRouteColor = "removed";
  target.dataset.deepOceanRouteClassification = "forbidden";
  target.dataset.deepOceanHardBlobSuppression = "active";
  target.dataset.routeSoftWaterBlend = "active";

  target.dataset.runtimeSamples = String(counters.runtimeSamples || 0);
  target.dataset.solidSurfaceSamples = String(counters.solidSurfaceSamples || 0);
  target.dataset.landSamples = String(counters.landSamples || 0);
  target.dataset.waterSamples = String(counters.waterSamples || 0);
  target.dataset.iceSamples = String(counters.iceSamples || 0);
  target.dataset.shelfSamples = String(counters.shelfSamples || 0);
  target.dataset.softDepthSamples = String(counters.softDepthSamples || 0);
  target.dataset.fallbackSamples = String(counters.fallbackSamples || 0);

  target.dataset.landPixelSamples = String(counters.landPixelSamples || 0);
  target.dataset.waterPixelSamples = String(counters.waterPixelSamples || 0);
  target.dataset.turquoisePixelSamples = String(counters.turquoisePixelSamples || 0);
  target.dataset.darkWaterPixelSamples = String(counters.darkWaterPixelSamples || 0);
  target.dataset.iceOrHighlightPixelSamples = String(counters.iceOrHighlightPixelSamples || 0);
  target.dataset.solidSurfacePixelSamples = String(counters.solidSurfacePixelSamples || 0);

  target.dataset.maxSurfaceWaterIndex = Number(counters.maxSurfaceWaterIndex || 0).toFixed(4);
  target.dataset.maxHydrationActivationIndex = Number(counters.maxHydrationActivationIndex || 0).toFixed(4);
  target.dataset.maxRouteSafeDepthIndex = Number(counters.maxRouteSafeDepthIndex || 0).toFixed(4);
  target.dataset.maxSoftDeepOceanBlendIndex = Number(counters.maxSoftDeepOceanBlendIndex || 0).toFixed(4);
  target.dataset.maxTurquoise = Number(counters.maxTurquoise || 0).toFixed(4);

  target.dataset.runtimeSolidSurfaceLandRatio = String(runtimeStats.solidSurfaceLandRatio || "");
  target.dataset.runtimeLiquidWaterRatio = String(runtimeStats.liquidWaterRatio || "");
  target.dataset.runtimeOrganicOceanPlacementActive = String(Boolean(runtimeStats.organicOceanPlacementActive));
  target.dataset.runtimeHardDeepOceanRouteClassSuppressed = String(Boolean(runtimeStats.hardDeepOceanRouteClassSuppressed));
  target.dataset.runtimeDeepOceanIsDepthFieldNotRouteBlob = String(Boolean(runtimeStats.deepOceanIsDepthFieldNotRouteBlob));

  target.dataset.routeOwnedLandGeneration = "forbidden";
  target.dataset.routeOwnedWaterGeneration = "forbidden";
  target.dataset.topologyRewrittenHere = "false";
  target.dataset.tectonicsRewrittenHere = "false";
  target.dataset.terrainRewrittenHere = "false";
  target.dataset.hydrationRewrittenHere = "false";
  target.dataset.oceansRewrittenHere = "false";
  target.dataset.climateRewrittenHere = "false";
  target.dataset.runtimeRewrittenHere = "false";
  target.dataset.hexRewrittenHere = "false";

  target.dataset.noTrees = "true";
  target.dataset.noFoliage = "true";
  target.dataset.noVegetation = "true";
  target.dataset.noGreenYellowDots = "true";
  target.dataset.hydration = "runtime-read-only-active";
  target.dataset.hydrationReadout = "runtime-only";
  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.publicReceipts = "hidden";
  target.dataset.rawReceipts = "suppressed";
  target.dataset.visualPass = "HELD_UNTIL_OWNER_SCREENSHOT_CONFIRMATION";
  target.dataset.visualPassClaimed = "false";
  target.dataset.renderMode = "audralia-adopted-canvas";
  target.dataset.phase = String(DEFAULTS.phase);
  target.dataset.velocity = String(DEFAULTS.velocity);
}

function exposeCanvasStatus(result) {
  const status = Object.freeze({
    ok: Boolean(result.ok),
    receipt: RECEIPT,
    routeReceipt: ROUTE_RECEIPT,
    routeRenewal: ROUTE_RENEWAL,
    activeRenewal: RECEIPT,
    body: BODY,
    route: ROUTE,
    canvasAuthority: "assets/audralia/audralia.canvas.js",
    routeMode: "doorway-only",
    runtimeAuthority: RUNTIME_AUTHORITY,
    runtimeVersion: result.runtimeVersion || "",
    runtimeActiveRenewal: result.runtimeActiveRenewal || "",
    runtimeLoaded: Boolean(result.runtimeLoaded),
    runtimeInstanceLoaded: Boolean(result.runtimeInstanceLoaded),
    canvasRendered: Boolean(result.canvasRendered),
    consumerOnlySoftWaterBlend: true,
    hardDeepOceanRouteColor: false,
    deepOceanRouteClassification: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    visualPassClaimed: false,
    counters: result.counters || null,
    runtimeStats: result.runtimeStats || null,
    error: result.error || ""
  });

  if (typeof window !== "undefined") {
    window.DGBAudraliaCanvasStatus = status;
    window.AudraliaCanvasStatus = status;
    window.audraliaCanvasStatus = status;

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-canvas-status", {
        detail: status
      })
    );
  }

  return status;
}

function renderFailure(mount, message, detail) {
  mount.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "audralia-runtime-failure-panel";
  panel.setAttribute("role", "status");
  panel.dataset.body = BODY;
  panel.dataset.route = ROUTE;
  panel.dataset.receipt = RECEIPT;
  panel.dataset.ok = "false";
  panel.dataset.canvasRendered = "false";
  panel.dataset.error = message;
  panel.dataset.visualPassClaimed = "false";

  const title = document.createElement("h2");
  title.textContent = "Audralia canvas did not render.";

  const text = document.createElement("p");
  text.textContent = message;

  panel.append(title, text);

  if (detail) {
    const pre = document.createElement("pre");
    pre.hidden = true;
    pre.textContent = JSON.stringify(detail, null, 2);
    panel.appendChild(pre);
  }

  mount.appendChild(panel);

  const result = {
    ok: false,
    runtimeLoaded: false,
    runtimeInstanceLoaded: false,
    canvasRendered: false,
    runtimeVersion: "",
    runtimeActiveRenewal: "",
    counters: {},
    runtimeStats: {},
    error: message
  };

  writeProofDataset(mount, result);
  return exposeCanvasStatus(result);
}

function normalizeMount(mount) {
  if (typeof mount === "string") return document.querySelector(mount);
  if (mount && mount.nodeType === 1) return mount;
  return (
    document.getElementById("audraliaRenderMount") ||
    document.getElementById("audreliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audrelia-render-mount]") ||
    document.querySelector("[data-body='audralia'][data-render-mount]") ||
    document.querySelector("[data-body='audrelia'][data-render-mount]")
  );
}

async function renderAudraliaCanvas(mountInput, options = {}) {
  const mount = normalizeMount(mountInput);

  if (!mount) {
    const result = {
      ok: false,
      runtimeLoaded: false,
      runtimeInstanceLoaded: false,
      canvasRendered: false,
      error: "AUDRALIA_CANVAS_MOUNT_NOT_FOUND"
    };

    return exposeCanvasStatus(result);
  }

  let runtimeModule;

  try {
    runtimeModule = await import(RUNTIME_IMPORT_URL);
  } catch (error) {
    return renderFailure(mount, "Audralia runtime module import failed.", {
      message: String(error && error.message ? error.message : error),
      runtimeImportUrl: RUNTIME_IMPORT_URL
    });
  }

  const runtimeApi = readRuntimeApi(runtimeModule);
  const runtime = createRuntimeInstance(runtimeApi);
  const runtimeStatus = safeRuntimeStatus(runtime, runtimeApi);
  const runtimeStats = safeRuntimeStats(runtime, runtimeApi);

  const runtimeLoaded = Boolean(runtimeStatus && runtimeStatus.ok !== false);
  const runtimeInstanceLoaded = Boolean(runtime);

  if (!runtimeLoaded || !runtimeInstanceLoaded) {
    return renderFailure(mount, "Audralia runtime did not expose a usable runtime instance.", {
      runtimeStatus
    });
  }

  const canvas = createCanvas(Number(options.canvasSize) || DEFAULTS.canvasSize);
  const counters = drawCanvasFrame(canvas, runtime, runtimeApi, options);
  const label = createLabel();

  const result = {
    ok: true,
    runtimeLoaded: true,
    runtimeInstanceLoaded: true,
    canvasRendered: true,
    runtimeVersion: runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "",
    runtimeActiveRenewal: runtimeStatus && runtimeStatus.activeRenewal ? runtimeStatus.activeRenewal : "",
    counters,
    runtimeStats
  };

  mount.replaceChildren();
  mount.appendChild(canvas);
  mount.appendChild(label);
  mount.appendChild(createReceipt(result));

  writeProofDataset(mount, result);
  writeProofDataset(canvas, result);

  return exposeCanvasStatus(result);
}

function getAudraliaCanvasStatus() {
  if (typeof window !== "undefined" && window.DGBAudraliaCanvasStatus) {
    return window.DGBAudraliaCanvasStatus;
  }

  return Object.freeze({
    ok: false,
    receipt: RECEIPT,
    routeReceipt: ROUTE_RECEIPT,
    routeRenewal: ROUTE_RENEWAL,
    activeRenewal: RECEIPT,
    canvasAuthority: "assets/audralia/audralia.canvas.js",
    canvasRendered: false
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  routeReceipt: ROUTE_RECEIPT,
  routeRenewal: ROUTE_RENEWAL,
  renderAudraliaCanvas,
  getAudraliaCanvasStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvas = api;
  window.AudraliaCanvas = api;
  window.audraliaCanvas = api;
}

export {
  RECEIPT,
  ROUTE_RECEIPT,
  ROUTE_RENEWAL,
  renderAudraliaCanvas,
  getAudraliaCanvasStatus
};

export default api;
