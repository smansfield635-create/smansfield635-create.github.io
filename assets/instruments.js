export function createInstruments() {
  function buildRuntimePanel(runtime) {
    if (!runtime?.projection || !runtime?.region || !runtime?.encoding) {
      return {
        region: "—",
        cell: "—",
        sector: "—",
        band: "—",
        encoding: "—",
        byte: "—"
      };
    }

    return {
      region: runtime.region.displayName,
      cell: runtime.projection.cellId,
      sector: runtime.projection.sector,
      band: String(runtime.projection.bandIndex),
      encoding: runtime.encoding.label,
      byte: runtime.projection.stateByte
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
        hint: "Tap a region or route to inspect. Tap a region to move there."
      };
    }

    const selectedType = selected.kind === "region"
      ? "Region"
      : selected.kind === "path"
        ? "Path"
        : "Unknown";

    let hint = "Selection active.";
    if (selected.kind === "region") {
      hint = "Tap again to move there, or use keys to travel manually.";
    } else if (selected.kind === "path") {
      hint = "Path selected. Travel manually or choose the next region.";
    }

    return {
      selectedName: selected.displayName,
      selectedType,
      destination: destination?.displayName ?? "—",
      hint
    };
  }

  return Object.freeze({
    buildRuntimePanel,
    buildSelectionPanel
  });
}
