export function createHydrologyEngine() {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function normalizeLonDeg(lonDeg) {
    let value = lonDeg;
    while (value > 180) value -= 360;
    while (value < -180) value += 360;
    return value;
  }

  function buildIndex(samples) {
    const index = new Map();
    for (const sample of samples) {
      index.set(`${sample.latDeg}:${normalizeLonDeg(sample.lonDeg)}`, sample);
    }
    return index;
  }

  function getLowestNeighbor(sample, terrainIndex, topologyIndex) {
    const offsets = [
      [3, 0], [-3, 0], [0, 3], [0, -3],
      [3, 3], [3, -3], [-3, 3], [-3, -3]
    ];

    let best = null;
    let bestElevation = Number.isFinite(sample.elevation) ? sample.elevation : 0;

    for (const [dLat, dLon] of offsets) {
      const key = `${sample.latDeg + dLat}:${normalizeLonDeg(sample.lonDeg + dLon)}`;
      const terrainNeighbor = terrainIndex.get(key);
      const topologyNeighbor = topologyIndex.get(key);

      if (!terrainNeighbor || !topologyNeighbor) continue;

      const candidateElevation = Number.isFinite(terrainNeighbor.elevation) ? terrainNeighbor.elevation : 0;
      if (candidateElevation < bestElevation) {
        bestElevation = candidateElevation;
        best = Object.freeze({
          terrain: terrainNeighbor,
          topology: topologyNeighbor
        });
      }
    }

    return best;
  }

  function computeDrainageDirection(sample, downhillNeighbor) {
    if (!downhillNeighbor) {
      return Object.freeze({ x: 0, y: 0 });
    }

    const dLat = downhillNeighbor.terrain.latDeg - sample.latDeg;
    const dLon = normalizeLonDeg(downhillNeighbor.terrain.lonDeg - sample.lonDeg);

    const x = clamp(dLon / 3, -1, 1);
    const y = clamp(dLat / 3, -1, 1);

    return Object.freeze({ x, y });
  }

  function buildHydrologyField(terrainField, topologyField, thermodynamicField) {
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

    const terrainSamples = terrainField.samples;
    const topologySamples = Array.isArray(topologyField?.samples) ? topologyField.samples : [];
    const thermodynamicSamples = Array.isArray(thermodynamicField?.samples) ? thermodynamicField.samples : [];

    const terrainIndex = buildIndex(terrainSamples);
    const topologyIndex = buildIndex(topologySamples);
    const thermodynamicIndex = buildIndex(thermodynamicSamples);

    let runoffTotal = 0;
    let basinTotal = 0;
    let riverCandidateCount = 0;
    let lakeCandidateCount = 0;

    const samples = terrainSamples.map((sample) => {
      const key = `${sample.latDeg}:${normalizeLonDeg(sample.lonDeg)}`;
      const topologySample = topologyIndex.get(key) ?? null;
      const thermalSample = thermodynamicIndex.get(key) ?? null;
      const downhillNeighbor = getLowestNeighbor(sample, terrainIndex, topologyIndex);

      const temperature = Number.isFinite(thermalSample?.temperatureField) ? thermalSample.temperatureField : 0.5;
      const evaporation = Number.isFinite(thermalSample?.evaporationPressureField) ? thermalSample.evaporationPressureField : 0.5;
      const freeze = Number.isFinite(thermalSample?.freezePotentialField) ? thermalSample.freezePotentialField : 0;
      const melt = Number.isFinite(thermalSample?.meltPotentialField) ? thermalSample.meltPotentialField : 0;
      const slope = Number.isFinite(topologySample?.slope) ? topologySample.slope : 0;
      const basinStrength = Number.isFinite(topologySample?.basinStrength) ? topologySample.basinStrength : 0;
      const divideStrength = Number.isFinite(topologySample?.divideStrength) ? topologySample.divideStrength : 0;
      const watershedSeed = topologySample?.watershedSeed === true;

      const latitudeBias =
        0.50 +
        Math.cos(toRad(sample.latDeg)) * 0.18 -
        Math.pow(Math.abs(sample.latDeg) / 90, 1.2) * 0.14;

      const rainfall = clamp(
        latitudeBias +
          evaporation * 0.22 +
          temperature * 0.08 -
          divideStrength * 0.04,
        0,
        1
      );

      const liquidWaterBias = clamp(1 - freeze * 0.65 + melt * 0.25, 0, 1);
      const runoff = clamp(
        rainfall * 0.50 +
          slope * 0.22 +
          liquidWaterBias * 0.18 +
          (watershedSeed ? 0.10 : 0),
        0,
        1
      );

      const basinAccumulation = clamp(
        runoff * 0.46 +
          basinStrength * 0.34 +
          clamp(((sample.seaLevel ?? 0) - (sample.elevation ?? 0)) / 0.45, 0, 1) * 0.20,
        0,
        1
      );

      const drainage = computeDrainageDirection(sample, downhillNeighbor);

      const aboveSea = (sample.elevation ?? 0) > (sample.seaLevel ?? 0);
      const nearSeaLevel = Math.abs((sample.elevation ?? 0) - (sample.seaLevel ?? 0)) < 0.06;

      const riverCandidate =
        aboveSea &&
        runoff > 0.56 &&
        (watershedSeed || divideStrength > 0.45 || slope > 0.42);

      const lakeCandidate =
        sample.terrain === "LAND" &&
        nearSeaLevel &&
        basinAccumulation > 0.62 &&
        basinStrength > 0.42;

      runoffTotal += runoff;
      basinTotal += basinAccumulation;
      if (riverCandidate) riverCandidateCount += 1;
      if (lakeCandidate) lakeCandidateCount += 1;

      return Object.freeze({
        latDeg: sample.latDeg,
        lonDeg: normalizeLonDeg(sample.lonDeg),
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

  return Object.freeze({
    buildHydrologyField
  });
}
