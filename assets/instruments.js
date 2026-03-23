import { WORLD_KERNEL } from "/world/world_kernel.js";

const EMPTY = "—";
const STALE_THRESHOLD_MS = 3000;
const DEFAULT_FPS = 0;
const DEFAULT_DT_MS = 0;
const DEFAULT_SOURCE_PHASE = "RUNNING";
const DEFAULT_SOURCE_MODE = "active";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value, fallback = EMPTY) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizePrimitive(value, fallback = EMPTY) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return normalizeString(value, fallback);
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
  if (typeof value === "boolean") return value ? "true" : "false";
  return fallback;
}

function toFixedSafe(value, digits = 3, fallback = EMPTY) {
  return isFiniteNumber(value) ? value.toFixed(digits) : fallback;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function labelize(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
}

function renderKeyValueSection(title, data) {
  const rows = Object.entries(data).map(([key, value]) => {
    return `<div class="panel-row"><span class="panel-key">${escapeHTML(labelize(key))}</span><span class="panel-value">${escapeHTML(normalizePrimitive(value))}</span></div>`;
  });

  return `<section class="panel-section"><h3 class="panel-title">${escapeHTML(title)}</h3>${rows.join("")}</section>`;
}

function buildVector(currentSample, previousSample) {
  const current = normalizeObject(currentSample);
  const previous = normalizeObject(previousSample);

  const dx =
    isFiniteNumber(current.lonDeg) && isFiniteNumber(previous.lonDeg)
      ? current.lonDeg - previous.lonDeg
      : 0;

  const dy =
    isFiniteNumber(current.latDeg) && isFiniteNumber(previous.latDeg)
      ? current.latDeg - previous.latDeg
      : 0;

  return Object.freeze({
    dx,
    dy,
    magnitude: Math.sqrt((dx * dx) + (dy * dy))
  });
}

function buildStateIndex(currentSample) {
  const sample = normalizeObject(currentSample);

  const bits = [
    clamp(sample.plateauStrength ?? 0, 0, 1) >= 0.5 ? 1 : 0,
    clamp(sample.strongestSummitScore ?? 0, 0, 1) >= 0.2 ? 1 : 0,
    sample.shoreline === true ? 1 : 0,
    sample.waterMask === 1 ? 1 : 0,
    clamp(sample.basinStrength ?? 0, 0, 1) >= 0.18 ? 1 : 0,
    sample.riverCandidate === true ? 1 : 0,
    sample.lakeCandidate === true ? 1 : 0,
    sample.subRegion === "GENEROSITY_CONTINENT" ? 1 : 0
  ];

  let stateIndex = 0;

  for (let i = 0; i < bits.length; i += 1) {
    stateIndex |= bits[i] << (7 - i);
  }

  return stateIndex;
}

function buildCoherence(currentSample, coherenceBindingState = null, perceptionModifiersState = null) {
  const coherence = normalizeObject(coherenceBindingState);
  const perception = normalizeObject(perceptionModifiersState);
  const sample = normalizeObject(currentSample);

  const direct =
    coherence?.globalField?.coherence ??
    coherence?.global?.coherence ??
    perception?.globalEnvelope?.clarityLevel;

  if (isFiniteNumber(direct)) {
    return clamp(direct, 0, 1);
  }

  const plateau = clamp(sample.plateauStrength ?? 0, 0, 1);
  const mountain = clamp(sample.strongestSummitScore ?? 0, 0, 1);
  const basin = clamp(sample.strongestBasinScore ?? 0, 0, 1);
  const shoreline = sample.shoreline === true ? 1 : 0;
  const wetland = sample.biomeType === "WETLAND" ? 1 : 0;
  const glacier = sample.biomeType === "GLACIER" ? 1 : 0;

  const energy = clamp(0.26 + plateau * 0.20 + mountain * 0.28 + shoreline * 0.08, 0, 1);
  const information = clamp(0.28 + basin * 0.24 + shoreline * 0.12 + wetland * 0.10, 0, 1);
  const value = clamp(0.24 + (1 - glacier) * 0.16 + plateau * 0.14 + basin * 0.16 + wetland * 0.10, 0, 1);

  return clamp(Math.min(energy, information, value), 0, 1);
}

function buildDirection16FromSamples(currentSample, previousSample) {
  const directions = WORLD_KERNEL?.cardinal16 ?? [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ];

  const current = normalizeObject(currentSample);
  const previous = normalizeObject(previousSample);

  const fallback = current.subRegion === "GENEROSITY_CONTINENT" ? "N" : "S";

  if (!isFiniteNumber(current.latDeg) || !isFiniteNumber(current.lonDeg)) {
    return fallback;
  }

  const previousLat = isFiniteNumber(previous.latDeg) ? previous.latDeg : current.latDeg;
  const previousLon = isFiniteNumber(previous.lonDeg) ? previous.lonDeg : current.lonDeg;

  const dLat = current.latDeg - previousLat;
  const dLon = current.lonDeg - previousLon;

  if (Math.abs(dLat) < 0.0001 && Math.abs(dLon) < 0.0001) {
    return fallback;
  }

  const angle = Math.atan2(dLon, dLat);
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const sector = Math.round(normalized / (Math.PI / 8)) % 16;

  return directions[sector] ?? fallback;
}

function buildTrajectoryClass(coherence, previousCoherence, vectorMagnitude) {
  const delta = coherence - previousCoherence;

  if (delta > 0.03) return "ASCENT";
  if (delta < -0.03) return "DESCENT";
  if (vectorMagnitude < 0.01) return "STALL";
  return "OSCILLATION";
}

function deriveTimestampMs(tickIndex, fps) {
  if (!isFiniteNumber(tickIndex)) return null;
  const safeFps = isFiniteNumber(fps) && fps > 0 ? fps : 60;
  const ageMs = Math.max(0, Math.round((1 / safeFps) * 1000));
  return Date.now() - ageMs;
}

function deriveAgeMs(timestampMs) {
  if (!isFiniteNumber(timestampMs)) return null;
  return Math.max(0, Date.now() - timestampMs);
}

function deriveFrameSync(motionState) {
  const motion = normalizeObject(motionState);
  if (motion.rafActive === true && motion.motionRunning === true) return true;
  if (motion.rafActive === false || motion.motionRunning === false) return false;
  return null;
}

function classifyState({
  timestampValid,
  fresh,
  frameSync,
  verificationPass,
  failurePhase
}) {
  if (normalizeString(failurePhase, "") !== "") return "INVALID";
  if (verificationPass !== true) return "OFFLINE";
  if (timestampValid !== true) return "INVALID";
  if (frameSync === false) return "OFFLINE";
  if (fresh === false) return "STALE";
  return "LIVE";
}

export function buildInstrumentReceipt({
  currentSample = null,
  previousSample = null,
  tickIndex = 0,
  motionState = null,
  authorityState = null,
  planetField = null,
  projectionSummary = null,
  worldVariantState = null,
  traversalState = null,
  coherenceBindingState = null,
  perceptionModifiersState = null,
  subsurfaceActivationState = null,
  worldModeState = null
} = {}) {
  const current = normalizeObject(currentSample);
  const previous = normalizeObject(previousSample);
  const motion = normalizeObject(motionState);
  const authority = normalizeObject(authorityState);
  const traversal = normalizeObject(traversalState);
  const coherence = normalizeObject(coherenceBindingState);
  const perception = normalizeObject(perceptionModifiersState);
  const subsurface = normalizeObject(subsurfaceActivationState);
  const worldMode = normalizeObject(worldModeState);
  const variant = normalizeObject(worldVariantState);

  const fps = isFiniteNumber(motion.fps) ? motion.fps : DEFAULT_FPS;
  const dtMs = isFiniteNumber(motion.dtMs) ? motion.dtMs : DEFAULT_DT_MS;
  const timestampMs = deriveTimestampMs(tickIndex, fps);
  const ageMs = deriveAgeMs(timestampMs);
  const timestampValid = isFiniteNumber(timestampMs);
  const fresh = isFiniteNumber(ageMs) ? ageMs <= STALE_THRESHOLD_MS : false;
  const frameSync = deriveFrameSync(motion);
  const verificationPass = motion.motionRunning === true && motion.rafActive === true;
  const sourcePhase = normalizeString(motion.sourcePhase, DEFAULT_SOURCE_PHASE);
  const sourceMode = normalizeString(motion.sourceMode, DEFAULT_SOURCE_MODE);
  const failurePhase = normalizeString(motion.failurePhase, "");
  const failureMessage = normalizeString(motion.failureMessage, "");

  const coherenceValue = buildCoherence(current, coherence, perception);
  const previousCoherence = buildCoherence(previous, coherence, perception);
  const vector = buildVector(current, previous);
  const direction16 = buildDirection16FromSamples(current, previous);
  const stateIndex = buildStateIndex(current);
  const trajectoryClass = buildTrajectoryClass(coherenceValue, previousCoherence, vector.magnitude);
  const stability =
    coherence?.globalField?.stability ??
    coherence?.global?.stability ??
    perception?.globalEnvelope?.stabilityLevel ??
    0;
  const classifiedState = classifyState({
    timestampValid,
    fresh,
    frameSync,
    verificationPass,
    failurePhase
  });

  return Object.freeze({
    classifiedState,

    displayPayload: Object.freeze({
      baseline: Object.freeze({
        t: normalizeString(sourcePhase, EMPTY),
        p: normalizeString(direction16, EMPTY),
        s: normalizePrimitive(stateIndex, EMPTY),
        v: normalizeString(variant.ratio, EMPTY)
      }),

      progress: Object.freeze({
        f: normalizeString(worldMode?.diagnostics?.activeTraversalMode ?? traversal.activeMode, EMPTY),
        dt: isFiniteNumber(dtMs) ? `${Math.round(dtMs)}ms` : EMPTY,
        c: coherenceValue,
        st: isFiniteNumber(stability) ? clamp(stability, 0, 1) : 0,
        tr: normalizeString(trajectoryClass, EMPTY)
      }),

      failure: Object.freeze({
        ph: normalizeString(failurePhase, EMPTY),
        msg: normalizeString(failureMessage, EMPTY),
        s: failurePhase.length > 0
      })
    }),

    diagnosticsPayload: Object.freeze({
      timestampMs,
      ageMs,
      timestampValid,
      fresh,
      frameSync,
      verificationPass,
      fps,
      dtMs,
      classifiedState,
      sourcePhase,
      sourceMode,
      failurePhase: normalizeString(failurePhase, EMPTY),
      failureMessage: normalizeString(failureMessage, EMPTY)
    }),

    meta: Object.freeze({
      tickIndex,
      stateIndex,
      coherence: coherenceValue,
      direction16,
      trajectoryClass,
      vector: Object.freeze(vector),
      authority: Object.freeze({
        runtimeSource: normalizeString(authority.runtimeSource, "/world/runtime/world_runtime.js"),
        instrumentSource: normalizeString(authority.instrumentSource, "/assets/instruments.js")
      }),
      projectionSummary: Object.freeze(normalizeObject(projectionSummary)),
      fieldSummary: Object.freeze({
        hasPlanetField: Array.isArray(planetField?.samples),
        accessAllowed: subsurface?.accessState?.accessAllowed === true || subsurface.accessAllowed === true
      })
    })
  });
}

export function buildInstrumentState(input = {}) {
  return buildInstrumentReceipt(input);
}

export function renderCompactBarHTML(runtime = {}) {
  const instrument = normalizeObject(runtime.instrument);
  const diagnosticsPayload = normalizeObject(instrument.diagnosticsPayload);
  const displayPayload = normalizeObject(instrument.displayPayload);
  const baseline = normalizeObject(displayPayload.baseline);
  const progress = normalizeObject(displayPayload.progress);

  return `
    <div class="diagnostic-bar__group">
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">State</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(instrument.classifiedState))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Phase</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(diagnosticsPayload.sourcePhase))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">FPS</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(diagnosticsPayload.fps))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">dt</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(displayPayload.progress?.dt))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Dir</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(baseline.p))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">C</span>
        <span class="diagnostic-pill__value">${escapeHTML(toFixedSafe(progress.c, 2))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">St</span>
        <span class="diagnostic-pill__value">${escapeHTML(toFixedSafe(progress.st, 2))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Tr</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(progress.tr))}</span>
      </span>
    </div>
  `.trim();
}

export function renderPanelHTML(runtime = {}) {
  const instrument = normalizeObject(runtime.instrument);
  const displayPayload = normalizeObject(instrument.displayPayload);
  const diagnosticsPayload = normalizeObject(instrument.diagnosticsPayload);
  const baseline = normalizeObject(displayPayload.baseline);
  const progress = normalizeObject(displayPayload.progress);
  const failure = normalizeObject(displayPayload.failure);
  const meta = normalizeObject(instrument.meta);

  const sections = [
    renderKeyValueSection("Instrument", Object.freeze({
      classifiedState: normalizePrimitive(instrument.classifiedState),
      timestampMs: normalizePrimitive(diagnosticsPayload.timestampMs),
      ageMs: normalizePrimitive(diagnosticsPayload.ageMs),
      timestampValid: normalizePrimitive(diagnosticsPayload.timestampValid),
      fresh: normalizePrimitive(diagnosticsPayload.fresh),
      frameSync: normalizePrimitive(diagnosticsPayload.frameSync),
      verificationPass: normalizePrimitive(diagnosticsPayload.verificationPass),
      fps: normalizePrimitive(diagnosticsPayload.fps),
      dtMs: normalizePrimitive(diagnosticsPayload.dtMs)
    })),
    renderKeyValueSection("Baseline", Object.freeze({
      t: normalizePrimitive(baseline.t),
      p: normalizePrimitive(baseline.p),
      s: normalizePrimitive(baseline.s),
      v: normalizePrimitive(baseline.v)
    })),
    renderKeyValueSection("Progress", Object.freeze({
      f: normalizePrimitive(progress.f),
      dt: normalizePrimitive(progress.dt),
      c: toFixedSafe(progress.c, 3),
      st: toFixedSafe(progress.st, 3),
      tr: normalizePrimitive(progress.tr)
    })),
    renderKeyValueSection("Failure", Object.freeze({
      phase: normalizePrimitive(failure.ph),
      message: normalizePrimitive(failure.msg),
      signaled: normalizePrimitive(failure.s)
    })),
    renderKeyValueSection("Meta", Object.freeze({
      tickIndex: normalizePrimitive(meta.tickIndex),
      stateIndex: normalizePrimitive(meta.stateIndex),
      coherence: toFixedSafe(meta.coherence, 3),
      direction16: normalizePrimitive(meta.direction16),
      trajectoryClass: normalizePrimitive(meta.trajectoryClass),
      vectorDx: toFixedSafe(meta.vector?.dx, 3),
      vectorDy: toFixedSafe(meta.vector?.dy, 3),
      vectorMagnitude: toFixedSafe(meta.vector?.magnitude, 3)
    }))
  ];

  return sections.join("");
}

export function createInstruments() {
  return Object.freeze({
    buildInstrumentState,
    buildInstrumentReceipt,
    renderCompactBarHTML,
    renderPanelHTML
  });
}

const DEFAULT_INSTRUMENTS = createInstruments();

export default DEFAULT_INSTRUMENTS;
