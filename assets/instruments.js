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

  return Object.freeze({ buildRuntimePanel });
}
