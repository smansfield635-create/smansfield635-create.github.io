export function createThermodynamicEngine() {
  const HEAT_NODES = Object.freeze([
    Object.freeze({ latDeg: 8, lonDeg: 10, strength: 1.0 }),
    Object.freeze({ latDeg: 22, lonDeg: 58, strength: 0.92 }),
    Object.freeze({ latDeg: 18, lonDeg: -52, strength: 0.92 }),
    Object.freeze({ latDeg: -14, lonDeg: 134, strength: 0.76 }),
    Object.freeze({ latDeg: -38, lonDeg: -96, strength: 0.72 }),
    Object.freeze({ latDeg: -6, lonDeg: -148, strength: 0.70 })
  ]);

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

  function angularDistanceDeg(latA, lonA, latB, lonB) {
    const latARad = toRad(latA);
    const lonARad = toRad(lonA);
    const latBRad = toRad(latB);
    const lonBRad = toRad(lonB);

    const cosine =
      Math.sin(latARad) * Math.sin(latBRad) +
      Math.cos(latARad) * Math.cos(latBRad) * Math.cos(lonARad - lonBRad);

    return Math.acos(clamp(cosine, -1, 1)) * (180 / Math.PI);
  }

  function buildTopologyIndex(topologyField) {
    const index = new Map();
    const samples = Array.isArray(topologyField?.samples) ? topologyField.samples : [];

    for (const sample of samples) {
      index.set(`${sample.latDeg}:${normalizeLonDeg(sample.lonDeg)}`, sample);
    }

    return index;
  }

  function computeHeatNodeState(latDeg, lonDeg) {
    let heatNodeInfluence = 0;
    let nearestHeatDistanceDeg = 180;

    for (const node of HEAT_NODES) {
      const distanceDeg = angularDistanceDeg(latDeg, lonDeg, node.latDeg, node.lonDeg);
      nearestHeatDistanceDeg = Math.min(nearestHeatDistanceDeg, distanceDeg);
      heatNodeInfluence += Math.exp(-distanceDeg / 34) * node.strength;
    }

    return Object.freeze({
      heatNodeInfluence: clamp(heatNodeInfluence, 0, 1.5),
      nearestHeatDistanceDeg
    });
  }

  function computeSampleThermalState(sample, topologySample) {
    const latDeg = sample.latDeg;
    const lonDeg = normalizeLonDeg(sample.lonDeg);
    const elevation = Number.isFinite(sample.elevation) ? sample.elevation : 0;
    const seaLevel = Number.isFinite(sample.seaLevel) ? sample.seaLevel : 0;

    const slope = Number.isFinite(topologySample?.slope) ? topologySample.slope : 0;
    const continentMass = Number.isFinite(topologySample?.continentMass) ? topologySample.continentMass : 0;
    const basinStrength = Number.isFinite(topologySample?.basinStrength) ? topologySample.basinStrength : 0;
    const divideStrength = Number.isFinite(topologySample?.divideStrength) ? topologySample.divideStrength : 0;

    const polarCooling = Math.pow(Math.abs(latDeg) / 90, 1.35) * 0.82;
    const ambient = 0.48 - polarCooling;

    const heatNodeState = computeHeatNodeState(latDeg, lonDeg);
    const wildernessDecay = clamp(heatNodeState.nearestHeatDistanceDeg / 140, 0, 1) * 0.26;

    const elevationCooling = clamp((elevation - seaLevel) * 0.85, 0, 0.22);
    const continentalRetention = continentMass * 0.05;
    const slopeExposure = slope * 0.04;
    const basinRetention = basinStrength * 0.03;
    const divideExposure = divideStrength * 0.03;

    const temperatureField = clamp(
      ambient +
        heatNodeState.heatNodeInfluence * 0.34 -
        wildernessDecay -
        elevationCooling -
        slopeExposure -
        divideExposure +
        continentalRetention +
        basinRetention,
      0,
      1
    );

    const freezePotentialField = clamp((0.42 - temperatureField) / 0.42, 0, 1);
    const meltPotentialField = clamp((temperatureField - 0.38) / 0.42, 0, 1);
    const evaporationPressureField = clamp((temperatureField - 0.28) / 0.52, 0, 1);

    return Object.freeze({
      latDeg,
      lonDeg,
      visible: sample.visible === true,
      z: Number.isFinite(sample.z) ? sample.z : -Infinity,
      temperatureField,
      thermalGradientField: Object.freeze({
        polarCooling,
        heatNodeInfluence: heatNodeState.heatNodeInfluence,
        wildernessDecay,
        nearestHeatDistanceDeg: heatNodeState.nearestHeatDistanceDeg
      }),
      freezePotentialField,
      meltPotentialField,
      evaporationPressureField
    });
  }

  function pickRepresentativeSample(samples) {
    if (!samples.length) return null;

    let best = null;
    let bestScore = -Infinity;

    for (const sample of samples) {
      const visibilityBias = sample.visible ? 1000 : 0;
      const zScore = Number.isFinite(sample.z) ? sample.z : -1;
      const score = visibilityBias + zScore;

      if (score > bestScore) {
        bestScore = score;
        best = sample;
      }
    }

    return best;
  }

  function buildEmptyField() {
    return Object.freeze({
      latDeg: 0,
      lonDeg: 0,
      temperatureField: 0,
      thermalGradientField: Object.freeze({
        polarCooling: 0,
        heatNodeInfluence: 0,
        wildernessDecay: 0,
        nearestHeatDistanceDeg: 0
      }),
      freezePotentialField: 0,
      meltPotentialField: 0,
      evaporationPressureField: 0,
      samples: Object.freeze([]),
      summary: Object.freeze({
        sampleCount: 0,
        temperatureAverage: 0,
        freezeAverage: 0,
        meltAverage: 0,
        evaporationAverage: 0,
        polarCoolingAverage: 0,
        heatNodeInfluenceAverage: 0,
        wildernessDecayAverage: 0,
        nearestHeatDistanceAverage: 0
      })
    });
  }

  function buildThermodynamicField(terrainField, topologyField) {
    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return buildEmptyField();
    }

    const topologyIndex = buildTopologyIndex(topologyField);

    let temperatureTotal = 0;
    let freezeTotal = 0;
    let meltTotal = 0;
    let evaporationTotal = 0;
    let polarCoolingTotal = 0;
    let heatNodeInfluenceTotal = 0;
    let wildernessDecayTotal = 0;
    let nearestHeatDistanceTotal = 0;

    const samples = terrainField.samples.map((sample) => {
      const key = `${sample.latDeg}:${normalizeLonDeg(sample.lonDeg)}`;
      const topologySample = topologyIndex.get(key) ?? null;
      const thermalSample = computeSampleThermalState(sample, topologySample);

      temperatureTotal += thermalSample.temperatureField;
      freezeTotal += thermalSample.freezePotentialField;
      meltTotal += thermalSample.meltPotentialField;
      evaporationTotal += thermalSample.evaporationPressureField;
      polarCoolingTotal += thermalSample.thermalGradientField.polarCooling;
      heatNodeInfluenceTotal += thermalSample.thermalGradientField.heatNodeInfluence;
      wildernessDecayTotal += thermalSample.thermalGradientField.wildernessDecay;
      nearestHeatDistanceTotal += thermalSample.thermalGradientField.nearestHeatDistanceDeg;

      return thermalSample;
    });

    const count = samples.length || 1;
    const representative = pickRepresentativeSample(samples) ?? buildEmptyField();

    return Object.freeze({
      latDeg: representative.latDeg ?? 0,
      lonDeg: representative.lonDeg ?? 0,
      temperatureField: representative.temperatureField ?? 0,
      thermalGradientField: Object.freeze({
        polarCooling: representative.thermalGradientField?.polarCooling ?? 0,
        heatNodeInfluence: representative.thermalGradientField?.heatNodeInfluence ?? 0,
        wildernessDecay: representative.thermalGradientField?.wildernessDecay ?? 0,
        nearestHeatDistanceDeg: representative.thermalGradientField?.nearestHeatDistanceDeg ?? 0
      }),
      freezePotentialField: representative.freezePotentialField ?? 0,
      meltPotentialField: representative.meltPotentialField ?? 0,
      evaporationPressureField: representative.evaporationPressureField ?? 0,
      samples: Object.freeze(samples),
      summary: Object.freeze({
        sampleCount: samples.length,
        temperatureAverage: temperatureTotal / count,
        freezeAverage: freezeTotal / count,
        meltAverage: meltTotal / count,
        evaporationAverage: evaporationTotal / count,
        polarCoolingAverage: polarCoolingTotal / count,
        heatNodeInfluenceAverage: heatNodeInfluenceTotal / count,
        wildernessDecayAverage: wildernessDecayTotal / count,
        nearestHeatDistanceAverage: nearestHeatDistanceTotal / count
      })
    });
  }

  return Object.freeze({
    buildThermodynamicField
  });
}
