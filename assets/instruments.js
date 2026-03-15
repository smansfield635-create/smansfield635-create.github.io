export function createInstruments() {
  function toFixedSafe(value, digits = 2, fallback = "—") {
    return Number.isFinite(value) ? value.toFixed(digits) : fallback;
  }

  function buildRuntimePanel(runtime) {
    const projection = runtime?.projection ?? null;
    const region = runtime?.resolvedState?.region ?? runtime?.region ?? null;
    const encoding = runtime?.encoding ?? null;
    const orientation = runtime?.orientation ?? null;
    const timing = runtime?.timing ?? null;
    const branch = runtime?.resolvedState?.branches?.harbor ?? null;

    return {
      phase: runtime?.phase ?? "BOOT",
      region: region?.displayName ?? region?.id ?? "—",
      scale: runtime?.resolvedState?.activeScale ?? "—",
      cell: projection?.cellId ?? "—",
      sector: projection?.sector ?? "—",
      band: projection?.bandIndex ?? "—",
      encoding: encoding?.label ?? "—",
      byte: projection?.stateByte ?? "—",
      yaw: toFixedSafe(orientation?.yaw, 3),
      pitch: toFixedSafe(orientation?.pitch, 3),
      radius: toFixedSafe(runtime?.projector?.state?.radius, 1),
      fps: toFixedSafe(timing?.fps, 1),
      dt: toFixedSafe(timing?.dtMs, 1),
      harbor: branch?.corePremise?.label ?? "—"
    };
  }

  function buildSelectionPanel(runtime) {
    const selected = runtime?.selection ?? null;
    const destination = runtime?.destination ?? null;

    if (!selected) {
      return {
        selectedName: "—",
        selectedType: "—",
        destination: destination?.displayName ?? "—",
        hint: "External branch baseline active. Drag globe to rotate."
      };
    }

    const selectedType = selected.kind === "region"
      ? "Region"
      : selected.kind === "path"
        ? "Path"
        : selected.kind === "node"
          ? "Node"
          : "Unknown";

    return {
      selectedName: selected.displayName ?? selected.id ?? "—",
      selectedType,
      destination: destination?.displayName ?? "—",
      hint: selected.hint ?? "Selection active."
    };
  }

  function buildBranchAuditPanel(runtime) {
    const harbor = runtime?.resolvedState?.branches?.harbor ?? null;
    const gratitude = harbor?.gratitude ?? null;
    const generosity = harbor?.generosity ?? null;
    const core = harbor?.corePremise ?? null;

    return {
      branch: "harbor",
      gratitudeNorth: gratitude?.north ?? "—",
      gratitudeSouth: gratitude?.south ?? "—",
      gratitudeEast: gratitude?.east ?? "—",
      gratitudeWest: gratitude?.west ?? "—",
      generosityNorth: generosity?.north ?? "—",
      generositySouth: generosity?.south ?? "—",
      generosityEast: generosity?.east ?? "—",
      generosityWest: generosity?.west ?? "—",
      premise: core?.label ?? "—"
    };
  }

  function buildOrientationPanel(runtime) {
    const orientation = runtime?.orientation ?? null;
    const cardinals = runtime?.cardinals ?? null;

    return {
      heading: cardinals?.heading ?? "—",
      yaw: toFixedSafe(orientation?.yaw, 3),
      pitch: toFixedSafe(orientation?.pitch, 3),
      northWeight: toFixedSafe(cardinals?.north, 2),
      southWeight: toFixedSafe(cardinals?.south, 2),
      eastWeight: toFixedSafe(cardinals?.east, 2),
      westWeight: toFixedSafe(cardinals?.west, 2)
    };
  }

  function renderKeyValueSection(title, data) {
    const lines = Object.entries(data).map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      return `<div class="panel-row"><span class="panel-key">${label}</span><span class="panel-value">${value}</span></div>`;
    });

    return `
      <section class="panel-section">
        <h3 class="panel-title">${title}</h3>
        ${lines.join("")}
      </section>
    `;
  }

  function renderPanelHTML(runtime) {
    return [
      renderKeyValueSection("Runtime", buildRuntimePanel(runtime)),
      renderKeyValueSection("Selection", buildSelectionPanel(runtime)),
      renderKeyValueSection("Orientation", buildOrientationPanel(runtime)),
      renderKeyValueSection("Harbor Audit", buildBranchAuditPanel(runtime))
    ].join("");
  }

  return Object.freeze({
    buildRuntimePanel,
    buildSelectionPanel,
    buildBranchAuditPanel,
    buildOrientationPanel,
    renderPanelHTML
  });
}
