export function createHydrologyEngine() {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function noise(latDeg, lonDeg) {
    return fract(
      Math.sin(latDeg * 12.9898 + lonDeg * 78.233) * 43758.5453123
    );
  }

  function computeRainfall(sample, runtime) {
    const temperature =
      runtime?.thermodynamicField?.temperatureField ?? 0.5;
    const evaporation =
      runtime?.thermodynamicField?.evaporationPressureField ?? 0.5;

    const latitudeBias =
      0.50 +
      Math.cos(toRad(sample.latDeg)) * 0.18 -
      Math.pow(Math.abs(sample.latDeg) / 90, 1.2) * 0.14;

    const noiseBias =
      (noise(sample.latDeg * 0.7, sample.lonDeg * 0.7) - 0.5) * 0.20;

    return clamp(
      latitudeBias + evaporation * 0.18 + temperature * 0.08 + noiseBias,
      0,
      1
    );
  }

  function computeRunoff(sample, runtime) {
    const rainfall = computeRainfall(sample, runtime);
    const elevation = Number.isFinite(sample.elevation) ? sample.elevation : 0;
    const freeze =
      runtime?.thermodynamicField?.freezePotentialField ?? 0;
    const melt =
      runtime?.thermodynamicField?.meltPotentialField ?? 0;

    const slopeBias = clamp((elevation - (sample.seaLevel ?? 0)) * 1.6, 0, 1);
    const liquidWaterBias = clamp(1 - freeze * 0.65 + melt * 0.25, 0, 1);

    return clamp(
      rainfall * 0.58 + slopeBias * 0.24 + liquidWaterBias * 0.18,
      0,
      1
    );
  }

  function computeDrainageDirection(sample) {
    const latFlow = Math.sin(toRad(sample.latDeg * 0.9));
    const lonFlow = Math.cos(toRad(sample.lonDeg * 0.7));

    const x = clamp(lonFlow, -1, 1);
    const y = clamp(latFlow, -1, 1);

    return Object.freeze({
      x,
      y
    });
  }

  function computeBasinAccumulation(sample, runtime) {
    const runoff = computeRunoff(sample, runtime);
    const elevation = Number.isFinite(sample.elevation) ? sample.elevation : 0;
    const seaLevel = Number.isFinite(sample.seaLevel) ? sample.seaLevel : 0;
    const depthBelowSea = clamp((seaLevel - elevation) / 0.45, 0, 1);

    return clamp(runoff * 0.55 + depthBelowSea * 0.45, 0, 1);
  }

  function classifyRiverCandidate(sample, runtime) {
    const runoff = computeRunoff(sample, runtime);
    const accumulation = computeBasinAccumulation(sample, runtime);
    const aboveSea = (sample.elevation ?? 0) > (sample.seaLevel ?? 0);

    return aboveSea && runoff > 0.56 && accumulation > 0.38;
  }

  function classifyLakeCandidate(sample, runtime) {
    const accumulation = computeBasinAccumulation(sample, runtime);
    const nearSeaLevel =
      Math.abs((sample.elevation ?? 0) - (sample.seaLevel ?? 0)) < 0.06;
    const inland =
      sample.terrain === "LAND" || sample.terrain === "OCEAN";

    return inland && nearSeaLevel && accumulation > 0.62;
  }

  function buildHydrologyField(terrainField, runtime) {
    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return Object.freeze({
        samples: Object.freeze([]),
        summary: Object.freeze({
          runoffAverage: 0,
          basinAverage: 0,
          riverCandidateCount: 0,
          lakeCandidateCount: 0
        })
      });
    }

    let runoffTotal = 0;
    let basinTotal = 0;
    let riverCandidateCount = 0;
    let lakeCandidateCount = 0;

    const samples = terrainField.samples.map((sample) => {
      const rainfall = computeRainfall(sample, runtime);
      const runoff = computeRunoff(sample, runtime);
      const basinAccumulation = computeBasinAccumulation(sample, runtime);
      const drainage = computeDrainageDirection(sample);
      const riverCandidate = classifyRiverCandidate(sample, runtime);
      const lakeCandidate = classifyLakeCandidate(sample, runtime);

      runoffTotal += runoff;
      basinTotal += basinAccumulation;
      if (riverCandidate) riverCandidateCount += 1;
      if (lakeCandidate) lakeCandidateCount += 1;

      return Object.freeze({
        latDeg: sample.latDeg,
        lonDeg: sample.lonDeg,
        visible: sample.visible,
        rainfall,
        runoff,
        basinAccumulation,
        drainage,
        riverCandidate,
        lakeCandidate
      });
    });

    const count = samples.length || 1;

    return Object.freeze({
      samples: Object.freeze(samples),
      summary: Object.freeze({
        runoffAverage: runoffTotal / count,
        basinAverage: basinTotal / count,
        riverCandidateCount,
        lakeCandidateCount
      })
    });
  }

  function render(ctx, projector, runtime, state, terrainField) {
    const field = buildHydrologyField(terrainField, runtime);

    return Object.freeze({
      mode: "hydrology_field",
      field,
      summary: field.summary
    });
  }

  return Object.freeze({
    render
  });
}
