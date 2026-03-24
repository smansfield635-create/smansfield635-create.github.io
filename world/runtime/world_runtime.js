// /world/runtime/world_runtime.js
// MODE: BASELINE RENEWAL
// STATUS: PLANET-ENGINE-AUTHORITY | SINGLE-RECEIPT | VARIANCE-VERIFIED | NON-DRIFT
// OWNER: SEAN

import { createPlanetEngine } from "../planet_engine.js";
import { renderPlanet } from "../render/index.js";

let runtimeActive = false;

const RECEIPT_KEY = "__RUNTIME_RECEIPT__";
const STORAGE_KEY = "cte_runtime_v4";

function nowMs() {
  return Date.now();
}

function nowPerf() {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function hasWindow() {
  return typeof window !== "undefined" && !!window;
}

function hasRAF() {
  return typeof requestAnimationFrame === "function";
}

function hasCAF() {
  return typeof cancelAnimationFrame === "function";
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeWriteReceipt(receipt) {
  try {
    if (!hasWindow()) return false;
    window[RECEIPT_KEY] = receipt;
    return true;
  } catch (_) {
    return false;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

function baseReceipt() {
  return {
    status: "BOOTING",
    phase: "INIT",
    verification: { pass: false },
    timestamp: nowMs(),
    error: null,
    errorCode: null,
    backend: null,
    engineAuthority: "planet_engine",
    fieldContractVersion: null,
    motionEnabled: false,
    frameIndex: 0,
    elapsedSeconds: 0,
    dayPhase: 0,
    seasonPhase: 0,
    stormPhase: 0,
    density: 0,
    projectionState: null,
    renderAuthority: null,
    audit: null,
    sampleCount: 0,
    dynamicIlluminationAverage: null,
    dynamicCloudBiasAverage: null,
    dynamicStormBiasAverage: null,
    dynamicCurrentBiasAverage: null,
    dynamicAuroraBiasAverage: null,
    dynamicGlowBiasAverage: null,
    fieldVariancePass: false,
    visualProgressPass: false,
    degraded: false,
    degradedDomains: []
  };
}

function emitReceipt(receipt) {
  const normalized = normalizeObject(receipt);
  safeWriteReceipt(normalized);
  safeSetStorage(STORAGE_KEY, normalized);
  return normalized;
}

function buildFailureReceipt(code, message, prior = null) {
  return {
    ...baseReceipt(),
    ...(prior ? normalizeObject(prior) : {}),
    status: "FAIL",
    phase: "FAIL",
    verification: { pass: false },
    errorCode: code,
    error: message,
    degraded: false,
    degradedDomains: [],
    timestamp: nowMs()
  };
}

function buildDegradedReceipt(code, message, diagnostics, prior = null) {
  return {
    ...baseReceipt(),
    ...(prior ? normalizeObject(prior) : {}),
    ...normalizeObject(diagnostics),
    status: "DEGRADED",
    phase: "DEGRADED",
    verification: { pass: false },
    errorCode: code,
    error: message,
    degraded: true,
    degradedDomains: ["FIELD_SIGNAL"],
    timestamp: nowMs()
  };
}

function ensureCanvas(canvas) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("Missing valid canvas");
  }
  return canvas;
}

function ensureCanvasBackingStore(canvas) {
  const dpr = Math.max(1, hasWindow() ? window.devicePixelRatio || 1 : 1);
  const width = Math.max(1, Math.floor((hasWindow() ? window.innerWidth : canvas.clientWidth || 1) * dpr));
  const height = Math.max(1, Math.floor((hasWindow() ? window.innerHeight : canvas.clientHeight || 1) * dpr));

  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
}

function resolveBackend(canvas) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    throw new Error("2d backend unavailable");
  }
  return {
    backend: "2d",
    ctx
  };
}

function buildTimeState(elapsedSeconds) {
  const elapsed = Math.max(0, elapsedSeconds);
  return Object.freeze({
    elapsedSeconds: elapsed,
    dayPhase: ((elapsed * 0.02) % 1 + 1) % 1,
    seasonPhase: ((elapsed * 0.0025) % 1 + 1) % 1,
    stormPhase: ((elapsed * 0.01) % 1 + 1) % 1
  });
}

function summarizeField(planetField) {
  const field = normalizeObject(planetField);
  const samples = Array.isArray(field.samples) ? field.samples : [];
  const motionContract = normalizeObject(field.motionContract);
  const fieldSummary = normalizeObject(field.summary);

  let sampleCount = 0;
  let illuminationTotal = 0;
  let cloudTotal = 0;
  let stormTotal = 0;
  let currentTotal = 0;
  let auroraTotal = 0;
  let glowTotal = 0;

  let illuminationMin = Infinity;
  let illuminationMax = -Infinity;
  let cloudMin = Infinity;
  let cloudMax = -Infinity;
  let stormMin = Infinity;
  let stormMax = -Infinity;
  let currentMin = Infinity;
  let currentMax = -Infinity;
  let auroraMin = Infinity;
  let auroraMax = -Infinity;
  let glowMin = Infinity;
  let glowMax = -Infinity;

  for (let y = 0; y < samples.length; y += 1) {
    const row = samples[y];
    if (!Array.isArray(row)) continue;

    for (let x = 0; x < row.length; x += 1) {
      const sample = normalizeObject(row[x]);

      const illumination = clamp(isFiniteNumber(sample.dynamicIllumination) ? sample.dynamicIllumination : 0, 0, 1);
      const cloud = clamp(isFiniteNumber(sample.dynamicCloudBias) ? sample.dynamicCloudBias : 0, 0, 1);
      const storm = clamp(isFiniteNumber(sample.dynamicStormBias) ? sample.dynamicStormBias : 0, 0, 1);
      const current = clamp(isFiniteNumber(sample.dynamicCurrentBias) ? sample.dynamicCurrentBias : 0, 0, 1);
      const aurora = clamp(isFiniteNumber(sample.dynamicAuroraBias) ? sample.dynamicAuroraBias : 0, 0, 1);
      const glow = clamp(isFiniteNumber(sample.dynamicGlowBias) ? sample.dynamicGlowBias : 0, 0, 1);

      sampleCount += 1;

      illuminationTotal += illumination;
      cloudTotal += cloud;
      stormTotal += storm;
      currentTotal += current;
      auroraTotal += aurora;
      glowTotal += glow;

      illuminationMin = Math.min(illuminationMin, illumination);
      illuminationMax = Math.max(illuminationMax, illumination);
      cloudMin = Math.min(cloudMin, cloud);
      cloudMax = Math.max(cloudMax, cloud);
      stormMin = Math.min(stormMin, storm);
      stormMax = Math.max(stormMax, storm);
      currentMin = Math.min(currentMin, current);
      currentMax = Math.max(currentMax, current);
      auroraMin = Math.min(auroraMin, aurora);
      auroraMax = Math.max(auroraMax, aurora);
      glowMin = Math.min(glowMin, glow);
      glowMax = Math.max(glowMax, glow);
    }
  }

  const divisor = Math.max(1, sampleCount);

  const dynamicIlluminationAverage = illuminationTotal / divisor;
  const dynamicCloudBiasAverage = cloudTotal / divisor;
  const dynamicStormBiasAverage = stormTotal / divisor;
  const dynamicCurrentBiasAverage = currentTotal / divisor;
  const dynamicAuroraBiasAverage = auroraTotal / divisor;
  const dynamicGlowBiasAverage = glowTotal / divisor;

  const illuminationRange = Number.isFinite(illuminationMin) && Number.isFinite(illuminationMax)
    ? illuminationMax - illuminationMin
    : 0;
  const cloudRange = Number.isFinite(cloudMin) && Number.isFinite(cloudMax)
    ? cloudMax - cloudMin
    : 0;
  const stormRange = Number.isFinite(stormMin) && Number.isFinite(stormMax)
    ? stormMax - stormMin
    : 0;
  const currentRange = Number.isFinite(currentMin) && Number.isFinite(currentMax)
    ? currentMax - currentMin
    : 0;
  const auroraRange = Number.isFinite(auroraMin) && Number.isFinite(auroraMax)
    ? auroraMax - auroraMin
    : 0;
  const glowRange = Number.isFinite(glowMin) && Number.isFinite(glowMax)
    ? glowMax - glowMin
    : 0;

  const strongestRange = Math.max(
    illuminationRange,
    cloudRange,
    stormRange,
    currentRange,
    auroraRange,
    glowRange
  );

  const fieldVariancePass = sampleCount > 0 && strongestRange >= 0.02;
  const visualProgressPass = sampleCount > 0 && strongestRange >= 0.05;

  return Object.freeze({
    fieldContractVersion:
      typeof field.contractVersion === "string"
        ? field.contractVersion
        : (typeof fieldSummary.contractVersion === "string" ? fieldSummary.contractVersion : null),
    motionEnabled: motionContract.enabled === true,
    sampleCount,
    dynamicIlluminationAverage,
    dynamicCloudBiasAverage,
    dynamicStormBiasAverage,
    dynamicCurrentBiasAverage,
    dynamicAuroraBiasAverage,
    dynamicGlowBiasAverage,
    fieldVariancePass,
    visualProgressPass
  });
}

export function startRuntime({ canvas, root = null, mode = "index" } = {}) {
  if (runtimeActive) {
    emitReceipt(buildFailureReceipt("RUNTIME_DUPLICATE_START", "Runtime already active"));
    return { dispose() {} };
  }

  if (!hasRAF()) {
    emitReceipt(buildFailureReceipt("RUNTIME_NO_RAF", "requestAnimationFrame unavailable"));
    return { dispose() {} };
  }

  let runtimeCanvas;
  let backendState;
  let engine;
  let running = false;
  let rafId = null;
  let frameIndex = 0;
  let lastReceipt = baseReceipt();
  const startedAt = nowPerf();

  try {
    runtimeCanvas = ensureCanvas(canvas);
    ensureCanvasBackingStore(runtimeCanvas);
    backendState = resolveBackend(runtimeCanvas);
    engine = createPlanetEngine();

    if (typeof engine.buildPlanetFrame !== "function") {
      throw new Error("Planet engine frame contract missing");
    }

    runtimeActive = true;
    running = true;

    lastReceipt = emitReceipt({
      ...baseReceipt(),
      backend: backendState.backend,
      status: "BOOTING",
      phase: "BOOTING"
    });
  } catch (error) {
    runtimeActive = false;
    emitReceipt(
      buildFailureReceipt(
        "RUNTIME_BOOT_ERROR",
        error instanceof Error ? error.message : String(error)
      )
    );
    return { dispose() {} };
  }

  function onResize() {
    try {
      ensureCanvasBackingStore(runtimeCanvas);
    } catch (_) {}
  }

  function frame() {
    if (!running) return;

    try {
      const elapsedSeconds = Math.max(0, (nowPerf() - startedAt) / 1000);
      const timeState = buildTimeState(elapsedSeconds);
      const planetField = engine.buildPlanetFrame(timeState);
      const diagnostics = summarizeField(planetField);

      const renderResult = renderPlanet({
        ctx: backendState.ctx,
        canvas: runtimeCanvas,
        root,
        mode,
        planetField
      });

      frameIndex += 1;

      if (!diagnostics.fieldVariancePass) {
        lastReceipt = emitReceipt(
          buildDegradedReceipt(
            "FIELD_VARIANCE_LOW",
            "Planet field variance below admissible threshold",
            {
              backend: backendState.backend,
              engineAuthority: "planet_engine",
              fieldContractVersion: diagnostics.fieldContractVersion,
              motionEnabled: diagnostics.motionEnabled,
              frameIndex,
              elapsedSeconds: timeState.elapsedSeconds,
              dayPhase: timeState.dayPhase,
              seasonPhase: timeState.seasonPhase,
              stormPhase: timeState.stormPhase,
              density: renderResult?.density ?? 0,
              projectionState: renderResult?.projectionState ?? null,
              renderAuthority: renderResult?.renderAuthority ?? null,
              audit: renderResult?.audit ?? null,
              sampleCount: diagnostics.sampleCount,
              dynamicIlluminationAverage: diagnostics.dynamicIlluminationAverage,
              dynamicCloudBiasAverage: diagnostics.dynamicCloudBiasAverage,
              dynamicStormBiasAverage: diagnostics.dynamicStormBiasAverage,
              dynamicCurrentBiasAverage: diagnostics.dynamicCurrentBiasAverage,
              dynamicAuroraBiasAverage: diagnostics.dynamicAuroraBiasAverage,
              dynamicGlowBiasAverage: diagnostics.dynamicGlowBiasAverage,
              fieldVariancePass: diagnostics.fieldVariancePass,
              visualProgressPass: diagnostics.visualProgressPass
            },
            lastReceipt
          )
        );
      } else {
        lastReceipt = emitReceipt({
          ...baseReceipt(),
          status: "RUNNING",
          phase: "RUNNING",
          verification: { pass: true },
          timestamp: nowMs(),
          backend: backendState.backend,
          engineAuthority: "planet_engine",
          fieldContractVersion: diagnostics.fieldContractVersion,
          motionEnabled: diagnostics.motionEnabled,
          frameIndex,
          elapsedSeconds: timeState.elapsedSeconds,
          dayPhase: timeState.dayPhase,
          seasonPhase: timeState.seasonPhase,
          stormPhase: timeState.stormPhase,
          density: renderResult?.density ?? 0,
          projectionState: renderResult?.projectionState ?? null,
          renderAuthority: renderResult?.renderAuthority ?? null,
          audit: renderResult?.audit ?? null,
          sampleCount: diagnostics.sampleCount,
          dynamicIlluminationAverage: diagnostics.dynamicIlluminationAverage,
          dynamicCloudBiasAverage: diagnostics.dynamicCloudBiasAverage,
          dynamicStormBiasAverage: diagnostics.dynamicStormBiasAverage,
          dynamicCurrentBiasAverage: diagnostics.dynamicCurrentBiasAverage,
          dynamicAuroraBiasAverage: diagnostics.dynamicAuroraBiasAverage,
          dynamicGlowBiasAverage: diagnostics.dynamicGlowBiasAverage,
          fieldVariancePass: diagnostics.fieldVariancePass,
          visualProgressPass: diagnostics.visualProgressPass,
          degraded: false,
          degradedDomains: []
        });
      }

      rafId = requestAnimationFrame(frame);
    } catch (error) {
      running = false;
      runtimeActive = false;
      lastReceipt = emitReceipt(
        buildFailureReceipt(
          "RUNTIME_FRAME_ERROR",
          error instanceof Error ? error.message : String(error),
          lastReceipt
        )
      );
    }
  }

  function dispose() {
    running = false;
    runtimeActive = false;

    if (rafId !== null && hasCAF()) {
      try {
        cancelAnimationFrame(rafId);
      } catch (_) {}
    }

    if (hasWindow()) {
      try {
        window.removeEventListener("resize", onResize);
      } catch (_) {}
    }
  }

  if (hasWindow()) {
    window.addEventListener("resize", onResize);
    window.addEventListener("pagehide", dispose, { once: true });
  }

  rafId = requestAnimationFrame(frame);

  return { dispose };
}

export default { startRuntime };
