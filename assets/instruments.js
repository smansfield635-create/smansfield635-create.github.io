export function createInstruments() {
  const EMPTY = "—";

  const PANEL_ORDER = Object.freeze([
    "Runtime",
    "Kernel",
    "Selection",
    "Harbor",
    "Gratitude",
    "Generosity",
    "Orientation",
    "Depth Lattice",
    "Canon Verification",
    "Execution Gate",
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

  function getResolvedState(runtime) {
    return normalizeObject(runtime?.resolvedState);
  }

  function getProjection(runtime) {
    return normalizeObject(runtime?.projection);
  }

  function getOrientation(runtime) {
    return normalizeObject(runtime?.orientation);
  }

  function getCardinals(runtime) {
    return normalizeObject(runtime?.cardinals);
  }

  function getTiming(runtime) {
    return normalizeObject(runtime?.timing);
  }

  function getKernel(runtime) {
    return normalizeObject(runtime?.kernel);
  }

  function getSelection(runtime) {
    return runtime?.selection ?? null;
  }

  function getDestination(runtime) {
    return runtime?.destination ?? null;
  }

  function getHarbor(runtime) {
    return normalizeObject(getResolvedState(runtime)?.branches?.harbor);
  }

  function getLocalSelection(runtime) {
    return normalizeObject(getResolvedState(runtime)?.localSelection);
  }

  function getTransition(runtime) {
    return normalizeObject(getResolvedState(runtime)?.transition);
  }

  function getCanonVerification(runtime) {
    return normalizeObject(runtime?.canonVerification);
  }

  function getExecutionGate(runtime) {
    return normalizeObject(runtime?.executionGate);
  }

  function getFailure(runtime) {
    return normalizeObject(runtime?.failure);
  }

  function getAuditLabels(runtime) {
    return normalizeObject(getResolvedState(runtime)?.auditLabels);
  }

  function buildRuntimePanel(runtime) {
    const resolvedState = getResolvedState(runtime);
    const projection = getProjection(runtime);
    const orientation = getOrientation(runtime);
    const timing = getTiming(runtime);

    return Object.freeze({
      phase: normalizePrimitive(runtime?.phase, "BOOT"),
      region: normalizePrimitive(
        runtime?.region?.displayName ??
          runtime?.region?.id ??
          resolvedState?.region?.displayName ??
          resolvedState?.region?.id
      ),
      scale: normalizePrimitive(resolvedState?.activeScale ?? getKernel(runtime)?.naming?.activeScale),
      encoding: normalizePrimitive(runtime?.encoding?.label),
      depth: normalizePrimitive(resolvedState?.activeDepth),
      cell: normalizePrimitive(projection?.cellId),
      sector: normalizePrimitive(projection?.sector),
      band: normalizePrimitive(projection?.bandIndex),
      yaw: toFixedSafe(orientation?.yaw, 3),
      pitch: toFixedSafe(orientation?.pitch, 3),
      radius: toFixedSafe(runtime?.projector?.state?.radius, 1),
      fps: toFixedSafe(timing?.fps, 1),
      dt: toFixedSafe(timing?.dtMs, 1),
      elapsed: toFixedSafe(timing?.elapsedMs, 1)
    });
  }

  function buildKernelPanel(runtime) {
    const kernel = getKernel(runtime);
    const naming = normalizeObject(kernel?.naming);
    const scope = normalizeObject(kernel?.scope);
    const modes = normalizeObject(kernel?.modes);

    return Object.freeze({
      version: normalizePrimitive(kernel?.version),
      baselineLabel: normalizePrimitive(naming?.baselineLabel),
      activeScale: normalizePrimitive(naming?.activeScale),
      activeBranch: normalizePrimitive(scope?.activeBranch),
      externalViewOnly: normalizePrimitive(modes?.externalViewOnly),
      roundWorld: normalizePrimitive(modes?.roundWorld),
      flatWorldReconnection: normalizePrimitive(modes?.flatWorldReconnection)
    });
  }

  function buildSelectionPanel(runtime) {
    const selected = getSelection(runtime);
    const destination = getDestination(runtime);

    if (!selected) {
      return Object.freeze({
        selectedName: EMPTY,
        selectedType: EMPTY,
        destination: normalizePrimitive(destination?.displayName ?? destination?.id),
        hint: "No active selection."
      });
    }

    return Object.freeze({
      selectedName: normalizePrimitive(selected?.displayName ?? selected?.id),
      selectedType: normalizePrimitive(selected?.kind),
      destination: normalizePrimitive(destination?.displayName ?? destination?.id),
      hint: normalizePrimitive(selected?.hint, "Selection active.")
    });
  }

  function buildHarborPanel(runtime) {
    const harbor = getHarbor(runtime);
    const conclusion = normalizeObject(harbor?.nodeConclusion);
    const premise = normalizeObject(harbor?.corePremise);

    return Object.freeze({
      branch: normalizePrimitive(getAuditLabels(runtime)?.branch, "external.harbor"),
      premise: normalizePrimitive(premise?.premise ?? premise?.label),
      status: normalizePrimitive(conclusion?.status),
      node: normalizePrimitive(conclusion?.node),
      gratitudeConclusion: normalizePrimitive(conclusion?.gratitudeConclusion),
      generosityConclusion: normalizePrimitive(conclusion?.generosityConclusion),
      exchangePremise: normalizePrimitive(conclusion?.exchangePremise)
    });
  }

  function buildGratitudePanel(runtime) {
    const harbor = getHarbor(runtime);
    const gratitude = normalizeObject(harbor?.gratitude);
    const recombination = normalizeObject(harbor?.gratitudeRecombination);

    return Object.freeze({
      north: normalizePrimitive(gratitude?.north),
      south: normalizePrimitive(gratitude?.south),
      east: normalizePrimitive(gratitude?.east),
      west: normalizePrimitive(gratitude?.west),
      recombination: normalizePrimitive(recombination?.conclusion ?? gratitude?.recombination)
    });
  }

  function buildGenerosityPanel(runtime) {
    const harbor = getHarbor(runtime);
    const generosity = normalizeObject(harbor?.generosity);
    const recombination = normalizeObject(harbor?.generosityRecombination);

    return Object.freeze({
      north: normalizePrimitive(generosity?.north),
      south: normalizePrimitive(generosity?.south),
      east: normalizePrimitive(generosity?.east),
      west: normalizePrimitive(generosity?.west),
      recombination: normalizePrimitive(recombination?.conclusion ?? generosity?.recombination)
    });
  }

  function buildOrientationPanel(runtime) {
    const orientation = getOrientation(runtime);
    const cardinals = getCardinals(runtime);

    return Object.freeze({
      heading: normalizePrimitive(cardinals?.heading),
      yaw: toFixedSafe(orientation?.yaw, 3),
      pitch: toFixedSafe(orientation?.pitch, 3),
      yawVelocity: toFixedSafe(orientation?.yawVelocity, 4),
      pitchVelocity: toFixedSafe(orientation?.pitchVelocity, 4),
      northWeight: toFixedSafe(cardinals?.north, 2),
      southWeight: toFixedSafe(cardinals?.south, 2),
      eastWeight: toFixedSafe(cardinals?.east, 2),
      westWeight: toFixedSafe(cardinals?.west, 2)
    });
  }

  function buildDepthLatticePanel(runtime) {
    const resolvedState = getResolvedState(runtime);
    const localSelection = getLocalSelection(runtime);
    const transition = getTransition(runtime);
    const projection = getProjection(runtime);

    return Object.freeze({
      depth: normalizePrimitive(resolvedState?.activeDepth),
      depthLabel: normalizePrimitive(resolvedState?.activeDepthLabel),
      from: normalizePrimitive(transition?.from),
      to: normalizePrimitive(transition?.to),
      legal: normalizePrimitive(transition?.legal),
      gridBound: normalizePrimitive(resolvedState?.gridBound),
      zone: normalizePrimitive(localSelection?.zone),
      row: normalizePrimitive(localSelection?.row ?? projection?.row),
      col: normalizePrimitive(localSelection?.col ?? projection?.col),
      cellIndex: normalizePrimitive(localSelection?.cellIndex ?? projection?.cellIndex),
      cellId: normalizePrimitive(localSelection?.cellId ?? projection?.cellId)
    });
  }

  function buildCanonVerificationPanel(runtime) {
    const canon = getCanonVerification(runtime);

    return Object.freeze({
      pass: normalizePrimitive(canon?.pass),
      fileHomePass: normalizePrimitive(canon?.file_home_pass),
      chronologyPass: normalizePrimitive(canon?.chronology_pass),
      ownershipPass: normalizePrimitive(canon?.ownership_pass),
      scopePass: normalizePrimitive(canon?.scope_pass),
      duplicateTruthPass: normalizePrimitive(canon?.duplicate_truth_pass),
      reasons: joinList(canon?.reasons)
    });
  }

  function buildExecutionGatePanel(runtime) {
    const gate = getExecutionGate(runtime);

    return Object.freeze({
      allow: gate?.allow === true ? "ALLOW" : gate?.allow === false ? "BLOCK" : EMPTY,
      mode: normalizePrimitive(gate?.mode),
      blockedBy: joinList(gate?.blocked_by),
      reasons: joinList(gate?.reasons),
      nextAuthorizedAction: normalizePrimitive(gate?.next_authorized_action)
    });
  }

  function buildFailurePanel(runtime) {
    const failure = getFailure(runtime);

    return Object.freeze({
      phase: normalizePrimitive(failure?.phase),
      message: normalizePrimitive(failure?.message),
      renderError: normalizePrimitive(runtime?.renderError),
      updateError: normalizePrimitive(runtime?.updateError)
    });
  }

  function classifyValue(value) {
    const normalized = normalizePrimitive(value);

    if (normalized === "ALLOW" || normalized === "true") return "ok";
    if (normalized === "BLOCK" || normalized === "ERROR" || normalized === "FAILED") return "danger";
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

  function renderPanelHTML(runtime) {
    const sectionMap = Object.freeze({
      Runtime: buildRuntimePanel(runtime),
      Kernel: buildKernelPanel(runtime),
      Selection: buildSelectionPanel(runtime),
      Harbor: buildHarborPanel(runtime),
      Gratitude: buildGratitudePanel(runtime),
      Generosity: buildGenerosityPanel(runtime),
      Orientation: buildOrientationPanel(runtime),
      "Depth Lattice": buildDepthLatticePanel(runtime),
      "Canon Verification": buildCanonVerificationPanel(runtime),
      "Execution Gate": buildExecutionGatePanel(runtime),
      Failure: buildFailurePanel(runtime)
    });

    return PANEL_ORDER.map((title) => renderKeyValueSection(title, sectionMap[title])).join("");
  }

  return Object.freeze({
    buildRuntimePanel,
    buildKernelPanel,
    buildSelectionPanel,
    buildHarborPanel,
    buildGratitudePanel,
    buildGenerosityPanel,
    buildOrientationPanel,
    buildDepthLatticePanel,
    buildCanonVerificationPanel,
    buildExecutionGatePanel,
    buildFailurePanel,
    renderKeyValueSection,
    renderPanelHTML
  });
}
