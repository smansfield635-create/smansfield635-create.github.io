export function createHydrologyEngine() {

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function fract(v) {
    return v - Math.floor(v);
  }

  function noise(lat, lon) {
    return fract(Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453123);
  }

  function computeHydrologySample(sample) {
    const elevation = sample.elevation ?? 0;
    const rainfall =
      0.45 +
      Math.sin(toRad(sample.latDeg)) * 0.25 +
      (noise(sample.latDeg, sample.lonDeg) - 0.5) * 0.25;

    const runoff = clamp(rainfall - elevation * 0.6, 0, 1);

    const accumulation =
      clamp(
        runoff +
        Math.sin(toRad(sample.latDeg * 0.8)) * 0.1,
        0,
        1
      );

    return Object.freeze({
      rainfall,
      runoff,
      accumulation
    });
  }

  function buildHydrologyField(terrainField) {

    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return Object.freeze({ samples: [] });
    }

    const samples = terrainField.samples.map(sample => {

      const hydro = computeHydrologySample(sample);

      return Object.freeze({
        ...sample,
        hydrology: hydro
      });

    });

    return Object.freeze({
      samples: Object.freeze(samples)
    });

  }

  function render(ctx, projector, runtime, state, terrainField) {

    const hydrologyField = buildHydrologyField(terrainField);

    return Object.freeze({
      mode: "hydrology_field",
      sampleCount: hydrologyField.samples.length
    });

  }

  return Object.freeze({
    render
  });

}
