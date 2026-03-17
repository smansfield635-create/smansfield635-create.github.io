import { WORLD_KERNEL } from "../world/world_kernel.js";

export function createInstruments() {
  const EMPTY = "—";
  const GATE_THRESHOLD = Number.isFinite(WORLD_KERNEL?.constants?.gateThreshold)
    ? WORLD_KERNEL.constants.gateThreshold
    : 0.61;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function normalizeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeString(value, fallback = EMPTY) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function toFixedSafe(value, digits = 2, fallback = EMPTY) {
    return isFiniteNumber(value) ? value.toFixed(digits) : fallback;
  }

  function normalizePrimitive(value, fallback = EMPTY) {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string") return normalizeString(value, fallback);
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
    if (typeof value === "boolean") return value ? "true" : "false";
    return fallback;
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

  function classifyValueTone(value) {
    const normalized = normalizePrimitive(value);
    if (
      normalized === "PASS" ||
      normalized === "STABLE" ||
      normalized === "ASCENT" ||
      normalized === "control.js" ||
      normalized === "render.js" ||
      normalized === "ROUND" ||
      normalized === "true"
    ) {
      return "ok";
    }

    if (
      normalized === "FAIL" ||
      normalized === "COLLAPSE" ||
      normalized === "DESCENT" ||
      normalized === "blocked" ||
      normalized === "denied" ||
      normalized === "false"
    ) {
      return "danger";
    }

    if (normalized === EMPTY) return "muted";
    return "default";
  }

  function renderKeyValueSection(title, data) {
    const rows = Object.entries(data).map(([key, value]) => {
      const tone = classifyValueTone(value);
      const valueClass =
        tone === "ok"
          ? "panel-value panel-value--ok"
          : tone === "danger"
            ? "panel-value panel-value--danger"
            : tone === "muted"
              ? "panel-value panel-value--muted"
              : "panel-value";

      return `<div class="panel-row"><span class="panel-key">${escapeHTML(labelize(key))}</span><span class="${valueClass}">${escapeHTML(normalizePrimitive(value))}</span></div>`;
    });

    return `<section class="panel-section"><h3 class="panel-title">${escapeHTML(title)}</h3>${rows.join("")}</section>`;
  }

  function buildDirection16FromSamples(currentSample, previousSample) {
    const fallback = currentSample?.lobeId === "GENEROSITY" ? "N" : "S";
    if (!currentSample || !isFiniteNumber(currentSample.latDeg) || !isFiniteNumber(currentSample.lonDeg)) {
      return fallback;
    }

    const previousLat = isFiniteNumber(previousSample?.latDeg) ? previousSample.latDeg : currentSample.latDeg;
    const previousLon = isFiniteNumber(previousSample?.lonDeg) ? previousSample.lonDeg : currentSample.lonDeg;

    const dLat = currentSample.latDeg - previousLat;
    const dLon = currentSample.lonDeg - previousLon;

    if (Math.abs(dLat) < 0.0001 && Math.abs(dLon) < 0.0001) {
      return fallback;
    }

    const directions = WORLD_KERNEL?.cardinal16 ?? [
      "N", "NNE", "NE", "ENE",
      "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW",
      "W", "WNW", "NW", "NNW"
    ];

    const angle = Math.atan2(dLon, dLat);
    const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
    const sector = Math.round(normalized / (Math.PI / 8)) % 16;
    return directions[sector] ?? fallback;
  }

  function buildVector(currentSample, previousSample) {
    const dx =
      isFiniteNumber(currentSample?.lonDeg) && isFiniteNumber(previousSample?.lonDeg)
        ? currentSample.lonDeg - previousSample.lonDeg
        : 0;

    const dy =
      isFiniteNumber(currentSample?.latDeg) && isFiniteNumber(previousSample?.latDeg)
        ? currentSample.latDeg - previousSample.latDeg
        : 0;

    const magnitude = Math.sqrt((dx * dx) + (dy * dy));
    return Object.freeze({
      dx,
      dy,
      magnitude
    });
  }

  function buildCoherence(currentSample) {
    const sample = normalizeObject(currentSample);

    const plateau = clamp(sample.plateauStrength ?? 0, 0, 1);
    const mountain = clamp(sample.mountainStrength ?? 0, 0, 1);
    const escarpment = clamp(sample.escarpmentStrength ?? 0, 0, 1);
    const mirror = clamp(sample.mirrorCorrelation ?? 0, 0, 1);
    const portal = clamp(sample.portalAffinity ?? 0, 0, 1);
    const harbor = sample.isHarbor === true ? 1 : 0;
    const star = sample.isStarRegion === true ? 1 : 0;

    const energy = clamp(0.28 + plateau * 0.30 + mountain * 0.18 + star * 0.12, 0, 1);
    const information = clamp(0.30 + mirror * 0.28 + harbor * 0.22 + portal * 0.10, 0, 1);
    const value = clamp(0.26 + harbor * 0.24 + plateau * 0.12 + (1 - escarpment) * 0.16 + portal * 0.12, 0, 1);

    return clamp(Math.min(energy, information, value), 0, 1);
  }

  function buildStateIndex(currentSample) {
    const sample = normalizeObject(currentSample);

    const bits = [
      clamp(sample.plateauStrength ?? 0, 0, 1) >= 0.5 ? 1 : 0,
      clamp(sample.mountainStrength ?? 0, 0, 1) >= 0.45 ? 1 : 0,
      sample.isHarbor === true ? 1 : 0,
      sample.isStarRegion === true ? 1 : 0,
      clamp(sample.escarpmentStrength ?? 0, 0, 1) >= 0.35 ? 1 : 0,
      clamp(sample.mirrorCorrelation ?? 0, 0, 1) >= 0.45 ? 1 : 0,
      clamp(sample.portalAffinity ?? 0, 0, 1) >= 0.5 ? 1 : 0,
      sample.lobeId === "GENEROSITY" ? 1 : 0
    ];

    let stateIndex = 0;
    for (let i = 0; i < bits.length; i += 1) {
      stateIndex |= bits[i] << (7 - i);
    }
    return stateIndex;
  }

  function buildTrajectoryClass(coherence, previousCoherence, vectorMagnitude) {
    const delta = coherence - previousCoherence;

    if (delta > 0.03) return "ASCENT";
    if (delta < -0.03) return "DESCENT";
    if (vectorMagnitude < 0.01) return "STALL";
    return "OSCILLATION";
  }

  function buildWorldPhase(currentSample) {
    if (!currentSample) return "VOID";
    if (currentSample.isHarbor === true) return "HARBOR";
    if (currentSample.isStarRegion === true) return "STAR";
    if ((currentSample.mountainStrength ?? 0) > 0.78) return "SUMMIT";
    if ((currentSample.mountainStrength ?? 0) > 0.40) return "MOUNTAIN";
    if ((currentSample.plateauStrength ?? 0) > 0.12) return "PLATEAU";
    if ((currentSample.escarpmentStrength ?? 0) > 0.18) return "ESCARPMENT";
    if (currentSample.waterMask === 1) return "WATER";
    return "LOWLAND";
  }

  function buildStabilityClass(coherence) {
    if (coherence >= GATE_THRESHOLD) return "STABLE";
    if (coherence >= 0.40) return "STRAINED";
    return "COLLAPSE";
  }

  function buildValueVector(source = {}) {
    const valueSource = normalizeObject(source);
    const V = clamp(valueSource.V ?? valueSource.valuation ?? 0, 0, 1);
    const A = clamp(valueSource.A ?? valueSource.aim ?? 0, 0, 1);
    const L = clamp(valueSource.L ?? valueSource.logic ?? 0, 0, 1);
    const U = clamp(valueSource.U ?? valueSource.utilization ?? 0, 0, 1);
    const EVAL = clamp(
      valueSource.EVAL ??
      valueSource.Evaluation ??
      valueSource.evaluation ??
      valueSource.E ??
      0,
      0,
      1
    );

    const aggregate = clamp(Math.min(V, A, L, U, EVAL), 0, 1);

    return Object.freeze({
      V,
      A,
      L,
      U,
      EVAL,
      aggregate
    });
  }

  function buildPsychologyReceipt(input = {}) {
    const source = normalizeObject(input);
    return Object.freeze({
      type: normalizeString(source.type, "UNSET"),
      stability: normalizeString(source.stability, "UNSET"),
      pressure: toFixedSafe(source.pressure, 2),
      outputClass: normalizeString(source.outputClass, "UNSET")
    });
  }

  function buildAuthorityReceipt(input = {}) {
    const source = normalizeObject(input);
    return Object.freeze({
      motionOwner: normalizeString(source.motionOwner, "UNSET"),
      projectionOwner: normalizeString(source.projectionOwner, "UNSET"),
      inputOwner: normalizeString(source.inputOwner, "UNSET"),
      renderSource: normalizeString(source.renderSource, "UNSET"),
      orbitSource: normalizeString(source.orbitSource, "UNSET")
    });
  }

  function buildMotionReceipt(input = {}) {
    const source = normalizeObject(input);
    return Object.freeze({
      motionRunning: source.motionRunning === true,
      rafActive: source.rafActive === true,
      pageVisible: source.pageVisible === true,
      pageRestored: source.pageRestored === true,
      yawVelocity: isFiniteNumber(source.yawVelocity) ? source.yawVelocity : null,
      pitchVelocity: isFiniteNumber(source.pitchVelocity) ? source.pitchVelocity : null,
      orbitVelocity: isFiniteNumber(source.orbitVelocity) ? source.orbitVelocity : null,
      orbitPhase: isFiniteNumber(source.orbitPhase) ? source.orbitPhase : null,
      blockedDragOnStarCount: Number.isInteger(source.blockedDragOnStarCount) ? source.blockedDragOnStarCount : 0,
      starTapCount: Number.isInteger(source.starTapCount) ? source.starTapCount : 0
    });
  }

  function buildTransitionReceipt(input = {}) {
    const source = normalizeObject(input);
    return Object.freeze({
      proposed: normalizeString(source.proposed, EMPTY),
      admissible: source.admissible === true ? "true" : source.admissible === false ? "false" : EMPTY,
      accepted: source.accepted === true ? "true" : source.accepted === false ? "false" : EMPTY,
      blockedReason: normalizeString(source.blockedReason, EMPTY),
      family: normalizeString(source.family, EMPTY)
    });
  }

  function buildInstrumentReceipt({
    currentSample,
    previousSample = null,
    tickIndex = 0,
    valueState = null,
    psychologyState = null,
    motionState = null,
    authorityState = null,
    transitionState = null
  } = {}) {
    if (!currentSample) {
      return Object.freeze({
        stateIndex: 0,
        coherence: 0,
        direction16: "S",
        gate: "FAIL",
        vector: Object.freeze({ dx: 0, dy: 0, magnitude: 0 }),
        trajectoryClass: "STALL",
        tickIndex,
        world: Object.freeze({
          lobeId: "NONE",
          phase: "VOID",
          terrainClass: "VOID",
          stabilityClass: "COLLAPSE"
        }),
        value: buildValueVector(valueState),
        psychology: buildPsychologyReceipt(psychologyState),
        motion: buildMotionReceipt(motionState),
        authority: buildAuthorityReceipt(authorityState),
        transition: buildTransitionReceipt(transitionState)
      });
    }

    const coherence = buildCoherence(currentSample);
    const previousCoherence = previousSample ? buildCoherence(previousSample) : coherence;
    const vector = buildVector(currentSample, previousSample);
    const direction16 = buildDirection16FromSamples(currentSample, previousSample);

    return Object.freeze({
      stateIndex: buildStateIndex(currentSample),
      coherence,
      direction16,
      gate: coherence >= GATE_THRESHOLD ? "PASS" : "FAIL",
      vector,
      trajectoryClass: buildTrajectoryClass(coherence, previousCoherence, vector.magnitude),
      tickIndex,
      world: Object.freeze({
        lobeId: normalizeString(currentSample.lobeId, "NONE"),
        phase: buildWorldPhase(currentSample),
        terrainClass: normalizeString(currentSample.terrainClass, "VOID"),
        stabilityClass: buildStabilityClass(coherence)
      }),
      value: buildValueVector(valueState),
      psychology: buildPsychologyReceipt(psychologyState),
      motion: buildMotionReceipt(motionState),
      authority: buildAuthorityReceipt(authorityState),
      transition: buildTransitionReceipt(transitionState)
    });
  }

  function renderCompactBarHTML(runtime = {}) {
    const instrument = normalizeObject(runtime.instrument);
    const summary = normalizeObject(runtime.planetField?.summary);
    const motion = normalizeObject(instrument.motion);
    const authority = normalizeObject(instrument.authority);

    return `
      <div class="diagnostic-bar__group">
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Phase</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(runtime.phase, "BOOT"))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Dir</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(instrument.direction16))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">State</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(instrument.stateIndex))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">C</span>
          <span class="diagnostic-pill__value">${escapeHTML(toFixedSafe(instrument.coherence, 2))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Orbit</span>
          <span class="diagnostic-pill__value">${escapeHTML(toFixedSafe(motion.orbitVelocity, 4))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Owner</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(authority.motionOwner))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Land</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(summary.landCount))}</span>
        </span>
      </div>
    `.trim();
  }

  function renderPanelHTML(runtime = {}) {
    const instrument = normalizeObject(runtime.instrument);
    const projection = normalizeObject(runtime.control?.projectionSummary);
    const summary = normalizeObject(runtime.planetField?.summary);
    const verification = normalizeObject(runtime.verification);
    const failure = normalizeObject(runtime.failure);
    const value = normalizeObject(instrument.value);
    const psychology = normalizeObject(instrument.psychology);
    const motion = normalizeObject(instrument.motion);
    const authority = normalizeObject(instrument.authority);
    const transition = normalizeObject(instrument.transition);

    const sections = [
      renderKeyValueSection("Runtime", Object.freeze({
        phase: normalizePrimitive(runtime.phase, "BOOT"),
        fps: toFixedSafe(runtime.fps, 1),
        dtMs: toFixedSafe(runtime.dtMs, 2),
        elapsedMs: toFixedSafe(runtime.elapsedMs, 1),
        tickIndex: normalizePrimitive(instrument.tickIndex)
      })),
      renderKeyValueSection("Instrument", Object.freeze({
        stateIndex: normalizePrimitive(instrument.stateIndex),
        coherence: toFixedSafe(instrument.coherence, 2),
        direction16: normalizePrimitive(instrument.direction16),
        gate: normalizePrimitive(instrument.gate),
        trajectoryClass: normalizePrimitive(instrument.trajectoryClass)
      })),
      renderKeyValueSection("Value", Object.freeze({
        valuation: toFixedSafe(value.V, 2),
        aim: toFixedSafe(value.A, 2),
        logic: toFixedSafe(value.L, 2),
        utilization: toFixedSafe(value.U, 2),
        evaluation: toFixedSafe(value.EVAL, 2),
        aggregate: toFixedSafe(value.aggregate, 2)
      })),
      renderKeyValueSection("Psychology", Object.freeze({
        type: normalizePrimitive(psychology.type),
        stability: normalizePrimitive(psychology.stability),
        pressure: normalizePrimitive(psychology.pressure),
        outputClass: normalizePrimitive(psychology.outputClass)
      })),
      renderKeyValueSection("Vector", Object.freeze({
        dx: toFixedSafe(instrument.vector?.dx, 2),
        dy: toFixedSafe(instrument.vector?.dy, 2),
        magnitude: toFixedSafe(instrument.vector?.magnitude, 2)
      })),
      renderKeyValueSection("Motion", Object.freeze({
        motionRunning: normalizePrimitive(motion.motionRunning),
        rafActive: normalizePrimitive(motion.rafActive),
        pageVisible: normalizePrimitive(motion.pageVisible),
        pageRestored: normalizePrimitive(motion.pageRestored),
        yawVelocity: toFixedSafe(motion.yawVelocity, 4),
        pitchVelocity: toFixedSafe(motion.pitchVelocity, 4),
        orbitVelocity: toFixedSafe(motion.orbitVelocity, 4),
        orbitPhase: toFixedSafe(motion.orbitPhase, 3),
        blockedDragOnStarCount: normalizePrimitive(motion.blockedDragOnStarCount),
        starTapCount: normalizePrimitive(motion.starTapCount)
      })),
      renderKeyValueSection("Authority", Object.freeze({
        motionOwner: normalizePrimitive(authority.motionOwner),
        projectionOwner: normalizePrimitive(authority.projectionOwner),
        inputOwner: normalizePrimitive(authority.inputOwner),
        renderSource: normalizePrimitive(authority.renderSource),
        orbitSource: normalizePrimitive(authority.orbitSource)
      })),
      renderKeyValueSection("Transition", Object.freeze({
        proposed: normalizePrimitive(transition.proposed),
        admissible: normalizePrimitive(transition.admissible),
        accepted: normalizePrimitive(transition.accepted),
        blockedReason: normalizePrimitive(transition.blockedReason),
        family: normalizePrimitive(transition.family)
      })),
      renderKeyValueSection("World", Object.freeze({
        lobeId: normalizePrimitive(instrument.world?.lobeId),
        phase: normalizePrimitive(instrument.world?.phase),
        terrainClass: normalizePrimitive(instrument.world?.terrainClass),
        stabilityClass: normalizePrimitive(instrument.world?.stabilityClass),
        cellId: normalizePrimitive(projection.cellId),
        sampleX: normalizePrimitive(projection.sampleX),
        sampleY: normalizePrimitive(projection.sampleY)
      })),
      renderKeyValueSection("Field", Object.freeze({
        sampleCount: normalizePrimitive(summary.sampleCount),
        landCount: normalizePrimitive(summary.landCount),
        waterCount: normalizePrimitive(summary.waterCount),
        escarpmentCount: normalizePrimitive(summary.escarpmentCount),
        plateauCount: normalizePrimitive(summary.plateauCount),
        mountainCount: normalizePrimitive(summary.mountainCount),
        beachCount: normalizePrimitive(summary.beachCount)
      })),
      renderKeyValueSection("Verification", Object.freeze({
        pass: normalizePrimitive(verification.pass),
        reason: Array.isArray(verification.reasons) ? verification.reasons.join(", ") : EMPTY
      })),
      renderKeyValueSection("Failure", Object.freeze({
        phase: normalizePrimitive(failure.phase),
        message: normalizePrimitive(failure.message)
      }))
    ];

    return sections.join("");
  }

  return Object.freeze({
    buildInstrumentReceipt,
    renderCompactBarHTML,
    renderPanelHTML
  });
}
