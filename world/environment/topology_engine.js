export function createTopologyEngine() {
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

  function getBaseElevation(sample) {
    if (Number.isFinite(sample?.elevation)) {
      return clamp(sample.elevation, -1, 1);
    }

    const shoreline = Number.isFinite(sample?.shoreline) ? sample.shoreline : 0;
    const terrainBias = sample?.terrain === "LAND" ? 0.18 : -0.12;
    const continentalBias =
      Math.sin(toRad((sample?.latDeg ?? 0) * 1.1)) * 0.14 +
      Math.cos(toRad((sample?.lonDeg ?? 0) * 0.8)) * 0.10;
    const noiseBias = (noise(sample?.latDeg ?? 0, sample?.lonDeg ?? 0) - 0.5) * 0.26;

    return clamp(
      terrainBias + continentalBias + noiseBias + shoreline * 0.22,
      -1,
      1
    );
  }

  function getSlope(sample, elevation) {
    const shoreline = Number.isFinite(sample?.shoreline) ? sample.shoreline : 0;
    const latTerm = Math.abs(Math.cos(toRad((sample?.latDeg ?? 0) * 1.7))) * 0.18;
    const lonTerm = Math.abs(Math.sin(toRad((sample?.lonDeg ?? 0) * 1.3))) * 0.16;
    const coastalTerm = shoreline * 0.34;
    const elevationTerm = Math.abs(elevation) * 0.22;

    return clamp(latTerm + lonTerm + coastalTerm + elevationTerm, 0, 1);
  }

  function getCurvature(sample) {
    const latWave = Math.sin(toRad((sample?.latDeg ?? 0) * 2.2)) * 0.28;
    const lonWave = Math.cos(toRad((sample?.lonDeg ?? 0) * 1.9)) * 0.24;
    const micro = (noise((sample?.latDeg ?? 0) + 17, (sample?.lonDeg ?? 0) + 29) - 0.5) * 0.20;

    return clamp(latWave + lonWave + micro, -1, 1);
  }

  function getRidgeStrength(elevation, slope, curvature) {
    return clamp(
      Math.max(0, elevation) * 0.48 +
        slope * 0.34 +
        Math.max(0, curvature) * 0.18,
      0,
      1
    );
  }

  function getValleyStrength(elevation, slope, curvature) {
    return clamp(
      Math.max(0, -elevation) * 0.22 +
        Math.max(0, -curvature) * 0.46 +
        (1 - slope) * 0.18,
      0,
      1
    );
  }

  function getBasinPotential(elevation, curvature) {
    return clamp(
      Math.max(0, -elevation) * 0.42 +
        Math.max(0, -curvature) * 0.58,
      0,
      1
    );
  }

  function getCanyonPotential(slope, ridgeStrength, valleyStrength) {
    return clamp(
      slope * 0.42 +
        ridgeStrength * 0.18 +
        valleyStrength * 0.40,
      0,
      1
    );
  }

  function getCliffPotential(slope, elevation) {
    return clamp(
      slope * 0.72 + Math.max(0, elevation) * 0.18,
      0,
      1
    );
  }

  function getPlateauPotential(elevation, slope) {
    return clamp(
      Math.max(0, elevation) * 0.55 + (1 - slope) * 0.30,
      0,
      1
    );
  }

  function getCavePotential(elevation, slope, canyonPotential) {
    return clamp(
      Math.max(0, elevation) * 0.30 +
        slope * 0.22 +
        canyonPotential * 0.48,
      0,
      1
    );
  }

  function classifyTerrainType(elevation, slope, ridgeStrength, valleyStrength, basinPotential, canyonPotential, cliffPotential, plateauPotential) {
    if (elevation > 0.72) return "summit";
    if (ridgeStrength > 0.66 && elevation > 0.32) return "mountain";
    if (cliffPotential > 0.70) return "cliff";
    if (canyonPotential > 0.68) return "canyon";
    if (plateauPotential > 0.62 && elevation > 0.20) return "plateau";
    if (valleyStrength > 0.62) return "valley";
    if (basinPotential > 0.68) return "basin";
    if (elevation > 0.18) return "hill";
    if (elevation > 0.03) return "plain";
    if (elevation > -0.06) return "shoreline";
    return "subsea";
  }

  function buildTopologyField(terrainField) {
    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return Object.freeze({
        samples: Object.freeze([]),
        summary: Object.freeze({
          elevationAverage: 0,
          slopeAverage: 0,
          ridgeAverage: 0,
          valleyAverage: 0,
          mountainCount: 0,
          basinCount: 0,
          canyonCount: 0,
          caveCandidateCount: 0
        })
      });
    }

    let elevationTotal = 0;
    let slopeTotal = 0;
    let ridgeTotal = 0;
    let valleyTotal = 0;
    let mountainCount = 0;
    let basinCount = 0;
    let canyonCount = 0;
    let caveCandidateCount = 0;

    const samples = terrainField.samples.map((sample) => {
      const elevation = getBaseElevation(sample);
      const slope = getSlope(sample, elevation);
      const curvature = getCurvature(sample);
      const ridgeStrength = getRidgeStrength(elevation, slope, curvature);
      const valleyStrength = getValleyStrength(elevation, slope, curvature);
      const basinPotential = getBasinPotential(elevation, curvature);
      const canyonPotential = getCanyonPotential(slope, ridgeStrength, valleyStrength);
      const cliffPotential = getCliffPotential(slope, elevation);
      const plateauPotential = getPlateauPotential(elevation, slope);
      const cavePotential = getCavePotential(elevation, slope, canyonPotential);
      const terrainType = classifyTerrainType(
        elevation,
        slope,
        ridgeStrength,
        valleyStrength,
        basinPotential,
        canyonPotential,
        cliffPotential,
        plateauPotential
      );

      elevationTotal += elevation;
      slopeTotal += slope;
      ridgeTotal += ridgeStrength;
      valleyTotal += valleyStrength;

      if (terrainType === "mountain" || terrainType === "summit") mountainCount += 1;
      if (terrainType === "basin") basinCount += 1;
      if (terrainType === "canyon") canyonCount += 1;
      if (cavePotential > 0.62) caveCandidateCount += 1;

      return Object.freeze({
        latDeg: sample.latDeg,
        lonDeg: sample.lonDeg,
        visible: sample.visible,
        elevation,
        slope,
        curvature,
        ridgeStrength,
        valleyStrength,
        basinPotential,
        canyonPotential,
        cliffPotential,
        plateauPotential,
        cavePotential,
        terrainType
      });
    });

    const count = samples.length || 1;

    return Object.freeze({
      samples: Object.freeze(samples),
      summary: Object.freeze({
        elevationAverage: elevationTotal / count,
        slopeAverage: slopeTotal / count,
        ridgeAverage: ridgeTotal / count,
        valleyAverage: valleyTotal / count,
        mountainCount,
        basinCount,
        canyonCount,
        caveCandidateCount
      })
    });
  }

  function render(ctx, projector, runtime, state, terrainField) {
    const field = buildTopologyField(terrainField);

    return Object.freeze({
      mode: "topology_field",
      field,
      summary: field.summary
    });
  }

  return Object.freeze({
    render
  });
}
