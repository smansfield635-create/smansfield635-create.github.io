import { WORLD_KERNEL } from "../world/world_kernel.js";
import { analyzeWorld } from "/world/science/world_analysis.js";

export function createInstruments() {
  const EMPTY = "—";
  const GATE_THRESHOLD = Number.isFinite(WORLD_KERNEL?.constants?.gateThreshold)
    ? WORLD_KERNEL.constants.gateThreshold
    : 0.61;

  const CANONICAL_SOURCES = Object.freeze([
    "/index.html",
    "/world/world_kernel.js",
    "/world/planet_engine.js",
    "/world/runtime/world_runtime.js",
    "/world/planet_surface_projector.js",
    "/world/render.js",
    "/world/control.js",
    "/assets/instruments.js"
  ]);

  const INVALIDATED_SOURCES = Object.freeze([
    "/app/index.html",
    "/app/variant/world/scene_runtime.js",
    "/variant/environment_renderer.js",
    "/variant/ground_renderer.js",
    "/variant/navigation_overlay_renderer.js"
  ]);

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
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function normalizePrimitive(value, fallback = EMPTY) {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string") return normalizeString(value, fallback);
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
    if (typeof value === "boolean") return value ? "true" : "false";
    return fallback;
  }

  function toFixedSafe(value, digits = 2, fallback = EMPTY) {
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

  function isCanonicalSource(value) {
    return typeof value === "string" && CANONICAL_SOURCES.includes(value.trim());
  }

  function isInvalidatedSource(value) {
    return typeof value === "string" && INVALIDATED_SOURCES.includes(value.trim());
  }

  function classifyValueTone(value) {
    const normalized = normalizePrimitive(value);

    if (isCanonicalSource(normalized)) return "ok";
    if (isInvalidatedSource(normalized)) return "danger";

    if (
      normalized === "PASS" ||
      normalized === "STABLE" ||
      normalized === "ASCENT" ||
      normalized === "ADMISSIBLE" ||
      normalized === "AUTHORIZED" ||
      normalized === "APPLIED" ||
      normalized === "EMITTED" ||
      normalized === "PLACED" ||
      normalized === "RUNNING" ||
      normalized === "READY" ||
      normalized === "true" ||
      normalized === "round" ||
      normalized === "ROUND" ||
      normalized === "HOME_MODE" ||
      normalized === "ROUTE_HOME" ||
      normalized === "LAND" ||
      normalized === "MIXED"
    ) {
      return "ok";
    }

    if (
      normalized === "FAIL" ||
      normalized === "COLLAPSE" ||
      normalized === "DESCENT" ||
      normalized === "INADMISSIBLE" ||
      normalized === "BLOCKED" ||
      normalized === "REJECTED" ||
      normalized === "SUPPRESSED" ||
      normalized === "false" ||
      normalized === "blocked" ||
      normalized === "denied" ||
      normalized === "REJECT_PACKET" ||
      normalized === "QUARANTINE_OUTPUT" ||
      normalized === "FREEZE_HANDOFF" ||
      normalized === "SYSTEM_HALT" ||
      normalized === "INVALID" ||
      normalized === "NON_CANONICAL" ||
      normalized === "WATER" ||
      normalized === "NONE"
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
    const directions = WORLD_KERNEL?.cardinal16 ?? [
      "N", "NNE", "NE", "ENE",
      "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW",
      "W", "WNW", "NW", "NNW"
    ];

    const fallback = currentSample?.subRegion === "GENEROSITY_CONTINENT" ? "N" : "S";

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

  function buildTrajectoryClass(coherence, previousCoherence, vectorMagnitude) {
    const delta = coherence - previousCoherence;

    if (delta > 0.03) return "ASCENT";
    if (delta < -0.03) return "DESCENT";
    if (vectorMagnitude < 0.01) return "STALL";
    return "OSCILLATION";
  }

  function buildWorldAnalysis(planetField = null, projectionSummary = {}, fallbackSample = null) {
    if (planetField && Array.isArray(planetField?.samples) && planetField.samples.length > 0) {
      return analyzeWorld(planetField, projectionSummary);
    }

    if (fallbackSample) {
      return analyzeWorld(
        Object.freeze({
          samples: Object.freeze([Object.freeze([fallbackSample])])
        }),
        Object.freeze({ sampleX: 0, sampleY: 0 })
      );
    }

    return analyzeWorld(null, projectionSummary);
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

    return Object.freeze({
      V,
      A,
      L,
      U,
      EVAL,
      aggregate: clamp(Math.min(V, A, L, U, EVAL), 0, 1)
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
      shellSource: normalizeString(source.shellSource, EMPTY),
      runtimeSource: normalizeString(source.runtimeSource, EMPTY),
      truthSource: normalizeString(source.truthSource, EMPTY),
      structureSource: normalizeString(source.structureSource, EMPTY),
      projectionOwner: normalizeString(source.projectionOwner, EMPTY),
      renderSource: normalizeString(source.renderSource, EMPTY),
      controlSource: normalizeString(source.controlSource, EMPTY),
      inputOwner: normalizeString(source.inputOwner, EMPTY),
      orbitSource: normalizeString(source.orbitSource, EMPTY),
      instrumentSource: normalizeString(source.instrumentSource, "/assets/instruments.js"),
      worldUiSource: normalizeString(source.worldUiSource, EMPTY),
      transitionSource: normalizeString(source.transitionSource, EMPTY),
      receiptWriter: normalizeString(source.receiptWriter, EMPTY)
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
      family: normalizeString(source.family, EMPTY),
      faultClass: normalizeString(source.faultClass, EMPTY)
    });
  }

  function buildValidatorReceipt(input = {}) {
    const source = normalizeObject(input);
    return Object.freeze({
      verdict: normalizeString(source.verdict, EMPTY),
      admissible: source.admissible === true ? "true" : source.admissible === false ? "false" : EMPTY,
      signedAuthority: source.signedAuthority === true ? "true" : source.signedAuthority === false ? "false" : EMPTY,
      engineId: normalizeString(source.engineId, EMPTY),
      lobeId: normalizePrimitive(source.lobeId, EMPTY),
      parentLobeId: normalizePrimitive(source.parentLobeId, EMPTY),
      microLobeId: normalizePrimitive(source.microLobeId, EMPTY),
      shardDepth: normalizePrimitive(source.shardDepth, EMPTY),
      budgetClass: normalizeString(source.budgetClass, EMPTY),
      precisionMode: normalizeString(source.precisionMode, EMPTY),
      faultClass: normalizeString(source.faultClass, EMPTY),
      reason: normalizeString(source.reason, EMPTY)
    });
  }

  function buildCompletionReceipt(input = {}) {
    const source = normalizeObject(input);
    const progress = normalizeObject(source.progress);
    const unlocks = normalizeObject(source.unlocks);

    return Object.freeze({
      summitCompletion: isFiniteNumber(progress.summitCompletion) ? progress.summitCompletion : null,
      confusionLoad: isFiniteNumber(progress.confusionLoad) ? progress.confusionLoad : null,
      completenessRatio: isFiniteNumber(progress.completenessRatio) ? progress.completenessRatio : null,
      renderReadinessRatio: isFiniteNumber(progress.renderReadinessRatio) ? progress.renderReadinessRatio : null,
      summaryIntegrityRatio: isFiniteNumber(progress.summaryIntegrityRatio) ? progress.summaryIntegrityRatio : null,
      seasonalCoverageRatio: isFiniteNumber(progress.seasonalCoverageRatio) ? progress.seasonalCoverageRatio : null,
      climateCoverageRatio: isFiniteNumber(progress.climateCoverageRatio) ? progress.climateCoverageRatio : null,
      masteryPass: progress.masteryPass === true ? "true" : progress.masteryPass === false ? "false" : EMPTY,
      underground: unlocks.underground === true ? "true" : unlocks.underground === false ? "false" : EMPTY,
      north: unlocks.north === true ? "true" : unlocks.north === false ? "false" : EMPTY,
      south: unlocks.south === true ? "true" : unlocks.south === false ? "false" : EMPTY,
      continents: unlocks.continents === true ? "true" : unlocks.continents === false ? "false" : EMPTY,
      seasons: unlocks.seasons === true ? "true" : unlocks.seasons === false ? "false" : EMPTY,
      climates: unlocks.climates === true ? "true" : unlocks.climates === false ? "false" : EMPTY,
      renderReady: unlocks.renderReady === true ? "true" : unlocks.renderReady === false ? "false" : EMPTY
    });
  }

  function buildRenderReceipt(input = {}) {
    const source = normalizeObject(input);
    return Object.freeze({
      sampleCount: isFiniteNumber(source.sampleCount) ? source.sampleCount : null,
      waterFamilyCount: isFiniteNumber(source.waterFamilyCount) ? source.waterFamilyCount : null,
      landFamilyCount: isFiniteNumber(source.landFamilyCount) ? source.landFamilyCount : null,
      cryosphereCount: isFiniteNumber(source.cryosphereCount) ? source.cryosphereCount : null,
      shorelineCount: isFiniteNumber(source.shorelineCount) ? source.shorelineCount : null
    });
  }

  function buildOrbitalReceipt(input = {}) {
    const source = normalizeObject(input);
    return Object.freeze({
      count: isFiniteNumber(source.count) ? source.count : null,
      frontVisibleCount: isFiniteNumber(source.frontVisibleCount) ? source.frontVisibleCount : null,
      markerRequired: source.markerRequired === true ? "true" : source.markerRequired === false ? "false" : EMPTY,
      markerPlacementAdmissible: source.markerPlacementAdmissible === true ? "true" : source.markerPlacementAdmissible === false ? "false" : EMPTY,
      markerCollisionCount: isFiniteNumber(source.markerCollisionCount) ? source.markerCollisionCount : null,
      markerRepositionedCount: isFiniteNumber(source.markerRepositionedCount) ? source.markerRepositionedCount : null
    });
  }

  function buildOrbitalHandshakeReceipt(input = {}) {
    const source = normalizeObject(input);

    return Object.freeze({
      progressionDtMs: isFiniteNumber(source.progressionDtMs) ? source.progressionDtMs : null,
      progressionAuthorized: source.progressionAuthorized === true ? "true" : source.progressionAuthorized === false ? "false" : EMPTY,
      progressionApplied: source.progressionApplied === true ? "true" : source.progressionApplied === false ? "false" : EMPTY,
      progressionStep: isFiniteNumber(source.progressionStep) ? source.progressionStep : null,
      progressionPass: source.progressionPass === true ? "true" : source.progressionPass === false ? "false" : EMPTY,

      emissionOrbitalCount: isFiniteNumber(source.emissionOrbitalCount) ? source.emissionOrbitalCount : null,
      emissionFrontVisible: isFiniteNumber(source.emissionFrontVisible) ? source.emissionFrontVisible : null,
      emissionEmitted: isFiniteNumber(source.emissionEmitted) ? source.emissionEmitted : null,
      emissionSuppressed: isFiniteNumber(source.emissionSuppressed) ? source.emissionSuppressed : null,
      emissionPass: source.emissionPass === true ? "true" : source.emissionPass === false ? "false" : EMPTY,

      intakeReceived: isFiniteNumber(source.intakeReceived) ? source.intakeReceived : null,
      intakeStaged: isFiniteNumber(source.intakeStaged) ? source.intakeStaged : null,
      intakeDiscarded: isFiniteNumber(source.intakeDiscarded) ? source.intakeDiscarded : null,
      intakePass: source.intakePass === true ? "true" : source.intakePass === false ? "false" : EMPTY,

      placementPlaceable: isFiniteNumber(source.placementPlaceable) ? source.placementPlaceable : null,
      placementPlaced: isFiniteNumber(source.placementPlaced) ? source.placementPlaced : null,
      placementReservedReject: isFiniteNumber(source.placementReservedReject) ? source.placementReservedReject : null,
      placementViewportReject: isFiniteNumber(source.placementViewportReject) ? source.placementViewportReject : null,
      placementPass: source.placementPass === true ? "true" : source.placementPass === false ? "false" : EMPTY
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
    transitionState = null,
    planetField = null,
    projectionSummary = {}
  } = {}) {
    const resolvedWorld = buildWorldAnalysis(planetField, projectionSummary, currentSample || null);

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
          lobeId: normalizeString(resolvedWorld.lobeId, "NONE"),
          phase: normalizeString(resolvedWorld.phase, "NONE"),
          terrainClass: normalizeString(resolvedWorld.terrainClass, "NONE"),
          stabilityClass: normalizeString(resolvedWorld.stabilityClass, "COLLAPSE"),
          biomeType: normalizeString(resolvedWorld.biomeType, "NONE"),
          surfaceMaterial: normalizeString(resolvedWorld.surfaceMaterial, "NONE"),
          continentId: normalizeString(resolvedWorld.continentId, "NONE"),
          continentName: normalizeString(resolvedWorld.continentName, "NONE"),
          continentTier: resolvedWorld.continentTier,
          shardClass: normalizeString(resolvedWorld.shardClass, "NONE"),
          cellId: normalizeString(resolvedWorld.cellId, "NONE"),
          reason: normalizeString(resolvedWorld.reason, EMPTY)
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
        lobeId: normalizeString(resolvedWorld.lobeId, normalizeString(currentSample.subRegion, "NONE")),
        phase: normalizeString(resolvedWorld.phase, "NONE"),
        terrainClass: normalizeString(resolvedWorld.terrainClass, normalizeString(currentSample.terrainClass, "NONE")),
        stabilityClass: normalizeString(resolvedWorld.stabilityClass, "COLLAPSE"),
        biomeType: normalizeString(resolvedWorld.biomeType, normalizeString(currentSample.biomeType, "NONE")),
        surfaceMaterial: normalizeString(resolvedWorld.surfaceMaterial, "NONE"),
        continentId: normalizeString(resolvedWorld.continentId, "NONE"),
        continentName: normalizeString(resolvedWorld.continentName, "NONE"),
        continentTier: resolvedWorld.continentTier,
        shardClass: normalizeString(resolvedWorld.shardClass, "NONE"),
        cellId: normalizeString(resolvedWorld.cellId, "NONE"),
        reason: normalizeString(resolvedWorld.reason, EMPTY)
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
    const progress = normalizeObject(runtime.progress);
    const renderAudit = normalizeObject(runtime.renderAudit);
    const validator = normalizeObject(runtime.validator);

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
          <span class="diagnostic-pill__label">World</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(instrument.world?.phase))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Stable</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(instrument.world?.stabilityClass))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Orbit</span>
          <span class="diagnostic-pill__value">${escapeHTML(toFixedSafe(motion.orbitVelocity, 4))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Validator</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(validator.verdict))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Runtime</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(authority.runtimeSource))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Land</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(summary.landCount))}</span>
        </span>
        <span class="diagnostic-pill">
          <span class="diagnostic-pill__label">Render</span>
          <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(renderAudit.sampleCount))}</span>
        </span>
      </div>
    `.trim();
  }

  function renderPanelHTML(runtime = {}) {
    const instrument = normalizeObject(runtime.instrument);
    const projection = normalizeObject(runtime.control?.projectionSummary);
    const motionState = normalizeObject(runtime.control?.motionState);
    const summary = normalizeObject(runtime.planetField?.summary);
    const verification = normalizeObject(runtime.verification);
    const failure = normalizeObject(runtime.failure);
    const value = normalizeObject(instrument.value);
    const psychology = normalizeObject(instrument.psychology);
    const motion = normalizeObject(instrument.motion);
    const authority = normalizeObject(instrument.authority);
    const transition = buildTransitionReceipt(runtime.transition || instrument.transition);
    const validator = buildValidatorReceipt(runtime.validator);
    const completion = buildCompletionReceipt({
      progress: runtime.progress,
      unlocks: runtime.unlocks
    });
    const renderReceipt = buildRenderReceipt(runtime.renderAudit);
    const orbitalReceipt = buildOrbitalReceipt(runtime.orbitalAudit);
    const orbitalHandshake = buildOrbitalHandshakeReceipt(runtime.orbitalHandshake);

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
      renderKeyValueSection("World", Object.freeze({
        lobeId: normalizePrimitive(instrument.world?.lobeId),
        phase: normalizePrimitive(instrument.world?.phase),
        terrainClass: normalizePrimitive(instrument.world?.terrainClass),
        stabilityClass: normalizePrimitive(instrument.world?.stabilityClass),
        biomeType: normalizePrimitive(instrument.world?.biomeType),
        surfaceMaterial: normalizePrimitive(instrument.world?.surfaceMaterial),
        continentId: normalizePrimitive(instrument.world?.continentId),
        continentName: normalizePrimitive(instrument.world?.continentName),
        continentTier: normalizePrimitive(instrument.world?.continentTier),
        shardClass: normalizePrimitive(instrument.world?.shardClass),
        cellId: normalizePrimitive(instrument.world?.cellId),
        sampleX: normalizePrimitive(projection.sampleX),
        sampleY: normalizePrimitive(projection.sampleY),
        mode: normalizePrimitive(projection.mode ?? motionState.mode)
      })),
      renderKeyValueSection("Vector", Object.freeze({
        dx: toFixedSafe(instrument.vector?.dx, 2),
        dy: toFixedSafe(instrument.vector?.dy, 2),
        magnitude: toFixedSafe(instrument.vector?.magnitude, 2)
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
      renderKeyValueSection("Motion", Object.freeze({
        motionRunning: normalizePrimitive(motion.motionRunning),
        rafActive: normalizePrimitive(motion.rafActive),
        pageVisible: normalizePrimitive(motion.pageVisible),
        pageRestored: normalizePrimitive(motion.pageRestored),
        yaw: toFixedSafe(motionState.yaw, 4),
        pitch: toFixedSafe(motionState.pitch, 4),
        yawVelocity: toFixedSafe(motion.yawVelocity, 4),
        pitchVelocity: toFixedSafe(motion.pitchVelocity, 4),
        orbitVelocity: toFixedSafe(motion.orbitVelocity, 4),
        orbitPhase: toFixedSafe(motion.orbitPhase, 3),
        blockedDragOnStarCount: normalizePrimitive(motion.blockedDragOnStarCount),
        starTapCount: normalizePrimitive(motion.starTapCount)
      })),
      renderKeyValueSection("Authority", Object.freeze({
        shellSource: normalizePrimitive(authority.shellSource),
        runtimeSource: normalizePrimitive(authority.runtimeSource),
        truthSource: normalizePrimitive(authority.truthSource),
        structureSource: normalizePrimitive(authority.structureSource),
        projectionOwner: normalizePrimitive(authority.projectionOwner),
        renderSource: normalizePrimitive(authority.renderSource),
        controlSource: normalizePrimitive(authority.controlSource),
        inputOwner: normalizePrimitive(authority.inputOwner),
        orbitSource: normalizePrimitive(authority.orbitSource),
        instrumentSource: normalizePrimitive(authority.instrumentSource),
        worldUiSource: normalizePrimitive(authority.worldUiSource),
        transitionSource: normalizePrimitive(authority.transitionSource),
        receiptWriter: normalizePrimitive(authority.receiptWriter)
      })),
      renderKeyValueSection("Transition", Object.freeze({
        proposed: normalizePrimitive(transition.proposed),
        admissible: normalizePrimitive(transition.admissible),
        accepted: normalizePrimitive(transition.accepted),
        blockedReason: normalizePrimitive(transition.blockedReason),
        family: normalizePrimitive(transition.family),
        faultClass: normalizePrimitive(transition.faultClass)
      })),
      renderKeyValueSection("Validator", Object.freeze({
        verdict: normalizePrimitive(validator.verdict),
        admissible: normalizePrimitive(validator.admissible),
        signedAuthority: normalizePrimitive(validator.signedAuthority),
        engineId: normalizePrimitive(validator.engineId),
        lobeId: normalizePrimitive(validator.lobeId),
        parentLobeId: normalizePrimitive(validator.parentLobeId),
        microLobeId: normalizePrimitive(validator.microLobeId),
        shardDepth: normalizePrimitive(validator.shardDepth),
        budgetClass: normalizePrimitive(validator.budgetClass),
        precisionMode: normalizePrimitive(validator.precisionMode),
        faultClass: normalizePrimitive(validator.faultClass),
        reason: normalizePrimitive(validator.reason)
      })),
      renderKeyValueSection("Completion", Object.freeze({
        summitCompletion: toFixedSafe(completion.summitCompletion, 2),
        confusionLoad: normalizePrimitive(completion.confusionLoad),
        completenessRatio: toFixedSafe(completion.completenessRatio, 2),
        summaryIntegrityRatio: toFixedSafe(completion.summaryIntegrityRatio, 2),
        seasonalCoverageRatio: toFixedSafe(completion.seasonalCoverageRatio, 2),
        climateCoverageRatio: toFixedSafe(completion.climateCoverageRatio, 2),
        renderReadinessRatio: toFixedSafe(completion.renderReadinessRatio, 2),
        masteryPass: normalizePrimitive(completion.masteryPass),
        underground: normalizePrimitive(completion.underground),
        north: normalizePrimitive(completion.north),
        south: normalizePrimitive(completion.south),
        continents: normalizePrimitive(completion.continents),
        seasons: normalizePrimitive(completion.seasons),
        climates: normalizePrimitive(completion.climates),
        renderReady: normalizePrimitive(completion.renderReady)
      })),
      renderKeyValueSection("Render", Object.freeze({
        sampleCount: normalizePrimitive(renderReceipt.sampleCount),
        waterFamilyCount: normalizePrimitive(renderReceipt.waterFamilyCount),
        landFamilyCount: normalizePrimitive(renderReceipt.landFamilyCount),
        cryosphereCount: normalizePrimitive(renderReceipt.cryosphereCount),
        shorelineCount: normalizePrimitive(renderReceipt.shorelineCount),
        orbitalCount: normalizePrimitive(orbitalReceipt.count),
        frontVisibleCount: normalizePrimitive(orbitalReceipt.frontVisibleCount),
        markerRequired: normalizePrimitive(orbitalReceipt.markerRequired),
        markerPlacementAdmissible: normalizePrimitive(orbitalReceipt.markerPlacementAdmissible),
        markerCollisionCount: normalizePrimitive(orbitalReceipt.markerCollisionCount),
        markerRepositionedCount: normalizePrimitive(orbitalReceipt.markerRepositionedCount)
      })),
      renderKeyValueSection("Orbital Handshake", Object.freeze({
        progressionDtMs: toFixedSafe(orbitalHandshake.progressionDtMs, 2),
        progressionAuthorized: normalizePrimitive(orbitalHandshake.progressionAuthorized),
        progressionApplied: normalizePrimitive(orbitalHandshake.progressionApplied),
        progressionStep: toFixedSafe(orbitalHandshake.progressionStep, 5),
        progressionPass: normalizePrimitive(orbitalHandshake.progressionPass),
        emissionOrbitalCount: normalizePrimitive(orbitalHandshake.emissionOrbitalCount),
        emissionFrontVisible: normalizePrimitive(orbitalHandshake.emissionFrontVisible),
        emissionEmitted: normalizePrimitive(orbitalHandshake.emissionEmitted),
        emissionSuppressed: normalizePrimitive(orbitalHandshake.emissionSuppressed),
        emissionPass: normalizePrimitive(orbitalHandshake.emissionPass),
        intakeReceived: normalizePrimitive(orbitalHandshake.intakeReceived),
        intakeStaged: normalizePrimitive(orbitalHandshake.intakeStaged),
        intakeDiscarded: normalizePrimitive(orbitalHandshake.intakeDiscarded),
        intakePass: normalizePrimitive(orbitalHandshake.intakePass),
        placementPlaceable: normalizePrimitive(orbitalHandshake.placementPlaceable),
        placementPlaced: normalizePrimitive(orbitalHandshake.placementPlaced),
        placementReservedReject: normalizePrimitive(orbitalHandshake.placementReservedReject),
        placementViewportReject: normalizePrimitive(orbitalHandshake.placementViewportReject),
        placementPass: normalizePrimitive(orbitalHandshake.placementPass)
      })),
      renderKeyValueSection("Field", Object.freeze({
        sampleCount: normalizePrimitive(summary.sampleCount),
        landCount: normalizePrimitive(summary.landCount),
        waterCount: normalizePrimitive(summary.waterCount),
        shorelineCount: normalizePrimitive(summary.shorelineCount),
        mountainCount: normalizePrimitive(summary.mountainCount),
        basinCount: normalizePrimitive(summary.basinCount),
        canyonCount: normalizePrimitive(summary.canyonCount),
        continentCount: normalizePrimitive(summary.continentCount),
        topologyVariance: toFixedSafe(summary.topologyVariance, 2),
        seasonalTemperatureAverage: toFixedSafe(summary.seasonalTemperatureAverage, 2),
        seasonalMoistureAverage: toFixedSafe(summary.seasonalMoistureAverage, 2)
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
