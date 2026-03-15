export function createInstruments() {
  const EMPTY = "—";

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function toFixedSafe(value, digits = 2, fallback = EMPTY) {
    return isFiniteNumber(value) ? value.toFixed(digits) : fallback;
  }

  function normalizePrimitive(value, fallback = EMPTY) {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string") return value.trim() || fallback;
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

  function deriveDepthState(runtime) {
    const projection = runtime?.projection ?? {};
    const resolved = runtime?.resolvedState ?? {};
    const lattice = runtime?.lattice ?? {};
    const cellIndexRaw =
      projection.cellIndex ??
      projection.cell ??
      lattice.cellIndex ??
      runtime?.selection?.cellIndex ??
      null;

    const rowRaw =
      projection.row ??
      lattice.row ??
      runtime?.selection?.row ??
      null;

    const colRaw =
      projection.col ??
      lattice.col ??
      runtime?.selection?.col ??
      null;

    const zoneRaw =
      projection.zone ??
      resolved.zone?.displayName ??
      resolved.zone?.id ??
      runtime?.selection?.zone ??
      null;

    const depthRaw =
      resolved.depth ??
      resolved.depthLabel ??
      projection.depth ??
      runtime?.depth ??
      runtime?.resolvedState?.activeScale ??
      null;

    return {
      depth: normalizePrimitive(depthRaw),
      zone: normalizePrimitive(zoneRaw),
      row: normalizePrimitive(rowRaw),
      col: normalizePrimitive(colRaw),
      cellIndex: normalizePrimitive(cellIndexRaw),
      cellId: normalizePrimitive(projection.cellId ?? runtime?.selection?.cellId),
      sector: normalizePrimitive(projection.sector),
      band: normalizePrimitive(projection.bandIndex)
    };
  }

  function deriveVerificationState(runtime) {
    const verification =
      runtime?.canonVerification ??
      runtime?.verification ??
      runtime?.resolvedState?.verification ??
      null;

    const pass = verification?.pass;
    const reasons = Array.isArray(verification?.reasons) ? verification.reasons : [];

    return {
      status: pass === true ? "PASS" : pass === false ? "BLOCK" : EMPTY,
      topology: verification?.file_home_pass ?? verification?.topology_pass ?? EMPTY,
      chronology: verification?.chronology_pass ?? EMPTY,
      ownership: verification?.ownership_pass ?? EMPTY,
      scope: verification?.scope_pass ?? EMPTY,
      duplicateTruth: verification?.duplicate_truth_pass ?? EMPTY,
      reasonCount: reasons.length ? String(reasons.length) : "0",
      primaryReason: reasons[0] ?? EMPTY
    };
  }

  function deriveExecutionGateState(runtime) {
    const gate =
      runtime?.executionGate ??
      runtime?.gate ??
      runtime?.resolvedState?.executionGate ??
      null;

    const blockedBy = Array.isArray(gate?.blocked_by) ? gate.blocked_by : [];
    const reasons = Array.isArray(gate?.reasons) ? gate.reasons : [];

    return {
      allow: gate?.allow === true ? "ALLOW" : gate?.allow === false ? "BLOCK" : EMPTY,
      mode: normalizePrimitive(gate?.mode),
      blockedBy: blockedBy.length ? blockedBy.join(", ") : EMPTY,
      reasonCount: reasons.length ? String(reasons.length) : "0",
      primaryReason: reasons[0] ?? EMPTY,
      nextAuthorizedAction: normalizePrimitive(gate?.next_authorized_action)
    };
  }

  function buildRuntimePanel(runtime) {
    const projection = runtime?.projection ?? null;
    const region = runtime?.resolvedState?.region ?? runtime?.region ?? null;
    const encoding = runtime?.encoding ?? null;
    const orientation = runtime?.orientation ?? null;
    const timing = runtime?.timing ?? null;
    const branch = runtime?.resolvedState?.branches?.harbor ?? null;

    return {
      phase: normalizePrimitive(runtime?.phase, "BOOT"),
      region: normalizePrimitive(region?.displayName ?? region?.id),
      scale: normalizePrimitive(runtime?.resolvedState?.activeScale),
      cell: normalizePrimitive(projection?.cellId),
      sector: normalizePrimitive(projection?.sector),
      band: normalizePrimitive(projection?.bandIndex),
      encoding: normalizePrimitive(encoding?.label),
      byte: normalizePrimitive(projection?.stateByte),
      yaw: toFixedSafe(orientation?.yaw, 3),
      pitch: toFixedSafe(orientation?.pitch, 3),
      radius: toFixedSafe(runtime?.projector?.state?.radius, 1),
      fps: toFixedSafe(timing?.fps, 1),
      dt: toFixedSafe(timing?.dtMs, 1),
      harbor: normalizePrimitive(branch?.corePremise?.label)
    };
  }

  function buildSelectionPanel(runtime) {
    const selected = runtime?.selection ?? null;
    const destination = runtime?.destination ?? null;

    if (!selected) {
      return {
        selectedName: EMPTY,
        selectedType: EMPTY,
        destination: normalizePrimitive(destination?.displayName),
        hint: "External branch baseline active. Drag globe to rotate."
      };
    }

    const selectedType =
      selected.kind === "region"
        ? "Region"
        : selected.kind === "path"
          ? "Path"
          : selected.kind === "node"
            ? "Node"
            : selected.kind === "cell"
              ? "Cell"
              : "Unknown";

    return {
      selectedName: normalizePrimitive(selected.displayName ?? selected.id),
      selectedType,
      destination: normalizePrimitive(destination?.displayName),
      hint: normalizePrimitive(selected.hint, "Selection active.")
    };
  }

  function buildHarborStatePanel(runtime) {
    const harbor = runtime?.resolvedState?.branches?.harbor ?? null;
    const core = harbor?.corePremise ?? null;

    return {
      branch: normalizePrimitive(harbor?.id ?? "harbor"),
      premise: normalizePrimitive(core?.label),
      region: normalizePrimitive(runtime?.resolvedState?.region?.displayName ?? runtime?.resolvedState?.region?.id),
      scale: normalizePrimitive(runtime?.resolvedState?.activeScale),
      mode: normalizePrimitive(runtime?.mode ?? runtime?.phase)
    };
  }

  function buildGratitudeStatePanel(runtime) {
    const gratitude = runtime?.resolvedState?.branches?.harbor?.gratitude ?? null;

    return {
      north: normalizePrimitive(gratitude?.north),
      south: normalizePrimitive(gratitude?.south),
      east: normalizePrimitive(gratitude?.east),
      west: normalizePrimitive(gratitude?.west)
    };
  }

  function buildGenerosityStatePanel(runtime) {
    const generosity = runtime?.resolvedState?.branches?.harbor?.generosity ?? null;

    return {
      north: normalizePrimitive(generosity?.north),
      south: normalizePrimitive(generosity?.south),
      east: normalizePrimitive(generosity?.east),
      west: normalizePrimitive(generosity?.west)
    };
  }

  function buildBranchAuditPanel(runtime) {
    const harbor = runtime?.resolvedState?.branches?.harbor ?? null;
    const gratitude = harbor?.gratitude ?? null;
    const generosity = harbor?.generosity ?? null;
    const core = harbor?.corePremise ?? null;

    return {
      branch: "harbor",
      gratitudeNorth: normalizePrimitive(gratitude?.north),
      gratitudeSouth: normalizePrimitive(gratitude?.south),
      gratitudeEast: normalizePrimitive(gratitude?.east),
      gratitudeWest: normalizePrimitive(gratitude?.west),
      generosityNorth: normalizePrimitive(generosity?.north),
      generositySouth: normalizePrimitive(generosity?.south),
      generosityEast: normalizePrimitive(generosity?.east),
      generosityWest: normalizePrimitive(generosity?.west),
      premise: normalizePrimitive(core?.label)
    };
  }

  function buildOrientationPanel(runtime) {
    const orientation = runtime?.orientation ?? null;
    const cardinals = runtime?.cardinals ?? null;

    return {
      heading: normalizePrimitive(cardinals?.heading),
      yaw: toFixedSafe(orientation?.yaw, 3),
      pitch: toFixedSafe(orientation?.pitch, 3),
      northWeight: toFixedSafe(cardinals?.north, 2),
      southWeight: toFixedSafe(cardinals?.south, 2),
      eastWeight: toFixedSafe(cardinals?.east, 2),
      westWeight: toFixedSafe(cardinals?.west, 2)
    };
  }

  function buildDepthLatticePanel(runtime) {
    const depth = deriveDepthState(runtime);

    return {
      depth: depth.depth,
      zone: depth.zone,
      row: depth.row,
      col: depth.col,
      cellIndex: depth.cellIndex,
      cellId: depth.cellId,
      sector: depth.sector,
      band: depth.band
    };
  }

  function buildVerificationPanel(runtime) {
    return deriveVerificationState(runtime);
  }

  function buildExecutionGatePanel(runtime) {
    return deriveExecutionGateState(runtime);
  }

  function renderKeyValueSection(title, data, sectionClass = "") {
    const rows = Object.entries(data).map(([key, value]) => {
      const safeLabel = escapeHTML(labelize(key));
      const safeValue = escapeHTML(normalizePrimitive(value));
      const dataKind =
        /depth/i.test(key) ? "depth" :
        /(cell|row|col|zone)/i.test(key) ? "cell" :
        /verification/i.test(key) ? "verification" :
        /gate/i.test(key) ? "gate" :
        "generic";

      return `<div class="panel-row" data-kind="${dataKind}"><span class="panel-key">${safeLabel}</span><span class="panel-value">${safeValue}</span></div>`;
    });

    const className = sectionClass ? `panel-section ${sectionClass}` : "panel-section";

    return `<section class="${className}"><h3 class="panel-title">${escapeHTML(title)}</h3>${rows.join("")}</section>`;
  }

  function renderPanelHTML(runtime) {
    return [
      renderKeyValueSection("Runtime", buildRuntimePanel(runtime)),
      renderKeyValueSection("Selection", buildSelectionPanel(runtime)),
      renderKeyValueSection("Harbor", buildHarborStatePanel(runtime)),
      renderKeyValueSection("Gratitude", buildGratitudeStatePanel(runtime)),
      renderKeyValueSection("Generosity", buildGenerosityStatePanel(runtime)),
      renderKeyValueSection("Orientation", buildOrientationPanel(runtime)),
      renderKeyValueSection("Depth Lattice", buildDepthLatticePanel(runtime), "is-depth-aware"),
      renderKeyValueSection("Canon Verification", buildVerificationPanel(runtime)),
      renderKeyValueSection("Execution Gate", buildExecutionGatePanel(runtime)),
      renderKeyValueSection("Harbor Audit", buildBranchAuditPanel(runtime))
    ].join("");
  }

  return Object.freeze({
    buildRuntimePanel,
    buildSelectionPanel,
    buildHarborStatePanel,
    buildGratitudeStatePanel,
    buildGenerosityStatePanel,
    buildBranchAuditPanel,
    buildOrientationPanel,
    buildDepthLatticePanel,
    buildVerificationPanel,
    buildExecutionGatePanel,
    renderKeyValueSection,
    renderPanelHTML
  });
}
