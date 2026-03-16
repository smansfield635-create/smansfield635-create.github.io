import { WORLD_KERNEL } from "../world/world_kernel.js";

export function createInstruments() {
  const EMPTY = "—";

  const PANEL_ORDER = Object.freeze([
    "Runtime",
    "Kernel",
    "Orientation",
    "Verification",
    "Thermodynamics",
    "Hydrology",
    "Topology",
    "Failure"
  ]);

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function toFixedSafe(value, digits = 2, fallback = EMPTY) {
    return isFiniteNumber(value) ? value.toFixed(digits) : fallback;
  }

  function normalizePrimitive(value, fallback = EMPTY) {
    if (value === null || value === undefined) return fallback;

    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed ? trimmed : fallback;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? String(value) : fallback;
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    return fallback;
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
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

  function joinList(value) {
    const items = normalizeArray(value)
      .map((item) => normalizePrimitive(item))
      .filter((item) => item !== EMPTY);

    return items.length ? items.join(", ") : EMPTY;
  }

  function classifyValue(value) {
    const normalized = normalizePrimitive(value);

    if (normalized === "ALLOW" || normalized === "PASS" || normalized === "true") return "ok";
    if (
      normalized === "BLOCK" ||
      normalized === "FAIL" ||
      normalized === "false" ||
      normalized === "ERROR"
    ) {
      return "danger";
    }
    if (normalized === EMPTY) return "muted";
    return "default";
  }

  function renderKeyValueSection(title, data, sectionClass = "") {
    const rows = Object.entries(data).map(([key, value]) => {
      const safeLabel = escapeHTML(labelize(key));
      const safeValue = escapeHTML(normalizePrimitive(value));
      const tone = classifyValue(value);

      const valueClass =
        tone === "ok"
          ? "panel-value panel-value--ok"
          : tone === "danger"
            ? "panel-value panel-value--danger"
            : tone === "muted"
              ? "panel-value panel-value--muted"
              : "panel-value";

      return `<div class="panel-row"><span class="panel-key">${safeLabel}</span><span class="${valueClass}">${safeValue}</span></div>`;
    });

    const className = sectionClass ? `panel-section ${sectionClass}` : "panel-section";
    return `<section class="${className}"><h3 class="panel-title">${escapeHTML(title)}</h3>${rows.join("")}</section>`;
  }

  function getRuntime(runtime) {
    return normalizeObject(runtime);
  }

  function getKernel(runtime) {
    const candidate = normalizeObject(runtime?.kernel);
    return Object.keys(candidate).length ? candidate : WORLD_KERNEL;
  }

  function getControl(runtime) {
    return normalizeObject(runtime?.control);
  }

  function getPlanetField(runtime) {
    return normalizeObject(runtime?.planetField);
  }

  function getSummary(runtime) {
    return normalizeObject(getPlanetField(runtime)?.summary);
  }

  function getCompleteness(runtime) {
    return normalizeObject(getPlanetField(runtime)?.completeness);
  }

  function getFailure(runtime) {
    return normalizeObject(runtime?.failure);
  }

  function getVerificationState(runtime) {
    const provided = normalizeObject(runtime?.verification);
    const hasProvided = Object.keys(provided).length > 0;

    if (hasProvided) {
      return Object.freeze({
        ...provided,
        __source: "provided",
        __present: true
      });
    }

    return Object.freeze({
      pass: "MISSING",
      file_home_pass: EMPTY,
      dependency_pass: EMPTY,
      chronology_pass: EMPTY,
      ownership_pass: EMPTY,
      duplicate_truth_pass: EMPTY,
      pulse_order_pass: EMPTY,
      field_order_pass: EMPTY,
      sample_contract_pass: EMPTY,
      scope_pass: EMPTY,
      reasons: Object.freeze(["verification_missing"]),
      __source: "missing",
      __present: false
    });
  }

  function getOrientation(runtime) {
    const control = getControl(runtime);
    const cameraState = normalizeObject(control?.cameraState);
    const cardinals = normalizeObject(control?.cardinals);

    return Object.freeze({
      yaw: cameraState.yaw,
      pitch: cameraState.pitch,
      yawVelocity: cameraState.yawVelocity,
      pitchVelocity: cameraState.pitchVelocity,
      heading: cardinals.heading,
      north: cardinals.north,
      south: cardinals.south,
      east: cardinals.east,
      west: cardinals.west
    });
  }

  function buildRuntimePanel(runtime) {
    const state = getRuntime(runtime);
    const control = getControl(runtime);
    const projection = normalizeObject(control?.projectionSummary);
    const summary = getSummary(runtime);

    return Object.freeze({
      phase: normalizePrimitive(state.phase, "BOOT"),
      activeFile: normalizePrimitive(state.activeFile),
      sampleCount: normalizePrimitive(summary.sampleCount),
      sampleX: normalizePrimitive(projection.sampleX),
      sampleY: normalizePrimitive(projection.sampleY),
      cellId: normalizePrimitive(projection.cellId),
      dtMs: toFixedSafe(state.dtMs, 2),
      fps: toFixedSafe(state.fps, 1),
      elapsedMs: toFixedSafe(state.elapsedMs, 1)
    });
  }

  function buildKernelPanel(runtime) {
    const kernel = getKernel(runtime);
    const planetField = normalizeObject(kernel.planetField);
    const lattices = normalizeObject(kernel.lattices);
    const planetSample = normalizeObject(lattices.planetSample);

    return Object.freeze({
      label: normalizePrimitive(kernel.label),
      version: normalizePrimitive(kernel.version),
      latticeWidth: normalizePrimitive(planetSample.width ?? planetField.width),
      latticeHeight: normalizePrimitive(planetSample.height ?? planetField.height),
      fieldOrder: joinList(planetField.order ?? planetField.pulseOrder),
      scopeBranch: normalizePrimitive(kernel.scope?.activeBranch),
      diagnosticsEnabled: normalizePrimitive(kernel.flags?.enableDiagnostics)
    });
  }

  function buildOrientationPanel(runtime) {
    const orientation = getOrientation(runtime);

    return Object.freeze({
      heading: normalizePrimitive(orientation.heading),
      yaw: toFixedSafe(orientation.yaw, 3),
      pitch: toFixedSafe(orientation.pitch, 3),
      yawVelocity: toFixedSafe(orientation.yawVelocity, 4),
      pitchVelocity: toFixedSafe(orientation.pitchVelocity, 4),
      northWeight: toFixedSafe(orientation.north, 2),
      southWeight: toFixedSafe(orientation.south, 2),
      eastWeight: toFixedSafe(orientation.east, 2),
      westWeight: toFixedSafe(orientation.west, 2)
    });
  }

  function buildVerificationPanel(runtime) {
    const verification = getVerificationState(runtime);
    const completeness = getCompleteness(runtime);
    const reasons = normalizeArray(verification.reasons);

    const passValue =
      verification.__present === false
        ? "MISSING"
        : verification.pass === true
          ? "PASS"
          : verification.pass === false
            ? "FAIL"
            : normalizePrimitive(verification.pass);

    return Object.freeze({
      source: verification.__source === "provided" ? "provided" : "missing",
      pass: passValue,
      fileHomePass: normalizePrimitive(verification.file_home_pass),
      dependencyPass: normalizePrimitive(
        verification.dependency_pass ?? verification.chronology_pass
      ),
      ownershipPass: normalizePrimitive(verification.ownership_pass),
      duplicateTruthPass: normalizePrimitive(verification.duplicate_truth_pass),
      pulseOrderPass: normalizePrimitive(
        verification.pulse_order_pass ?? verification.field_order_pass
      ),
      sampleContractPass: normalizePrimitive(verification.sample_contract_pass),
      scopePass: normalizePrimitive(verification.scope_pass),
      completeness: joinList(
        Object.entries(completeness)
          .filter(([, value]) => value === true)
          .map(([key]) => key)
      ),
      reasons: joinList(reasons)
    });
  }

  function buildThermodynamicsPanel(runtime) {
    const summary = getSummary(runtime);
    const planetField = getPlanetField(runtime);

    return Object.freeze({
      sampleCount: normalizePrimitive(summary.sampleCount),
      temperatureAverage: toFixedSafe(summary.temperatureAverage, 3),
      rainfallAverage: toFixedSafe(summary.rainfallAverage, 3),
      runoffAverage: toFixedSafe(summary.runoffAverage, 3),
      completeness: normalizePrimitive(getCompleteness(runtime).thermodynamics),
      width: normalizePrimitive(planetField.width),
      height: normalizePrimitive(planetField.height)
    });
  }

  function buildHydrologyPanel(runtime) {
    const summary = getSummary(runtime);

    return Object.freeze({
      sampleCount: normalizePrimitive(summary.sampleCount),
      runoffAverage: toFixedSafe(summary.runoffAverage, 3),
      shorelineCount: normalizePrimitive(summary.shorelineCount),
      landCount: normalizePrimitive(summary.landCount),
      waterCount: normalizePrimitive(summary.waterCount),
      completeness: normalizePrimitive(getCompleteness(runtime).hydrology)
    });
  }

  function buildTopologyPanel(runtime) {
    const summary = getSummary(runtime);

    return Object.freeze({
      sampleCount: normalizePrimitive(summary.sampleCount),
      mountainCount: normalizePrimitive(summary.mountainCount),
      basinCount: normalizePrimitive(summary.basinCount),
      canyonCount: normalizePrimitive(summary.canyonCount),
      caveCandidateCount: normalizePrimitive(summary.caveCandidateCount),
      diamondAverage: toFixedSafe(summary.diamondAverage, 3),
      opalAverage: toFixedSafe(summary.opalAverage, 3),
      sedimentAverage: toFixedSafe(summary.sedimentAverage, 3),
      completeness: normalizePrimitive(getCompleteness(runtime).topology)
    });
  }

  function buildFailurePanel(runtime) {
    const failure = getFailure(runtime);

    return Object.freeze({
      phase: normalizePrimitive(failure.phase),
      message: normalizePrimitive(failure.message),
      code: normalizePrimitive(failure.code),
      blockedBy: joinList(failure.blockedBy),
      details: normalizePrimitive(failure.details)
    });
  }

  function buildCompactBar(runtime) {
    const state = getRuntime(runtime);
    const control = getControl(runtime);
    const projection = normalizeObject(control?.projectionSummary);
    const summary = getSummary(runtime);
    const verification = getVerificationState(runtime);

    const verifyValue =
      verification.__present === false
        ? "MISSING"
        : verification.pass === true
          ? "PASS"
          : verification.pass === false
            ? "FAIL"
            : normalizePrimitive(verification.pass);

    return Object.freeze({
      phase: normalizePrimitive(state.phase, "BOOT"),
      fps: toFixedSafe(state.fps, 1),
      sampleCount: normalizePrimitive(summary.sampleCount),
      cell: normalizePrimitive(projection.cellId),
      verify: verifyValue
    });
  }

  function renderCompactBarHTML(runtime = {}) {
    const compact = buildCompactBar(runtime);
    const verifyTone =
      compact.verify === "PASS"
        ? "ok"
        : compact.verify === "FAIL"
          ? "danger"
          : "";

    const verifyClass = verifyTone ? ` diagnostic-pill--${verifyTone}` : "";

    return `
      <div class="diagnostic-bar__group">
        <span class="diagnostic-pill"><span class="diagnostic-pill__label">Phase</span><span class="diagnostic-pill__value">${escapeHTML(compact.phase)}</span></span>
        <span class="diagnostic-pill"><span class="diagnostic-pill__label">FPS</span><span class="diagnostic-pill__value">${escapeHTML(compact.fps)}</span></span>
        <span class="diagnostic-pill"><span class="diagnostic-pill__label">Samples</span><span class="diagnostic-pill__value">${escapeHTML(compact.sampleCount)}</span></span>
        <span class="diagnostic-pill"><span class="diagnostic-pill__label">Cell</span><span class="diagnostic-pill__value">${escapeHTML(compact.cell)}</span></span>
        <span class="diagnostic-pill${verifyClass}"><span class="diagnostic-pill__label">Verify</span><span class="diagnostic-pill__value">${escapeHTML(compact.verify)}</span></span>
      </div>
    `.trim();
  }

  function buildPanelMap(runtime) {
    return Object.freeze({
      Runtime: buildRuntimePanel(runtime),
      Kernel: buildKernelPanel(runtime),
      Orientation: buildOrientationPanel(runtime),
      Verification: buildVerificationPanel(runtime),
      Thermodynamics: buildThermodynamicsPanel(runtime),
      Hydrology: buildHydrologyPanel(runtime),
      Topology: buildTopologyPanel(runtime),
      Failure: buildFailurePanel(runtime)
    });
  }

  function renderPanelHTML(runtime = {}) {
    const panelMap = buildPanelMap(runtime);
    return PANEL_ORDER.map((title) => renderKeyValueSection(title, panelMap[title])).join("");
  }

  return Object.freeze({
    renderKeyValueSection,
    renderCompactBarHTML,
    renderPanelHTML
  });
}
