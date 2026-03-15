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

  function computeSampleThermalState(sample, topologySample) {
    const latDeg = sample.latDeg;
    const lonDeg = normalizeLonDeg(sample.lonDeg);
    const elevation = Number.isFinite(sample.elevation) ? sample.elevation : 0;
    const slope = Number.isFinite(topologySample?.slope) ? topologySample.slope : 0;
    const continentMass = Number.isFinite(topologySample?.continentMass) ? topologySample.continentMass : 0;

    const polarCooling = Math.pow(Math.abs(latDeg) / 90, 1.35) * 0.82;
    const ambient = 0.48 - polarCooling;

    let heatNodeInfluence = 0;
    let nearestHeatDistanceDeg = 180;

    for (const node of HEAT_NODES) {
      const distanceDeg = angularDistanceDeg(latDeg, lonDeg, node.latDeg, node.lonDeg);
      nearestHeatDistanceDeg = Math.min(nearestHeatDistanceDeg, distanceDeg);

      const influence = Math.exp(-distanceDeg / 34) * node.strength;
      heatNodeInfluence += influence;
    }

    const wildernessDecay = clamp(nearestHeatDistanceDeg / 140, 0, 1) * 0.26;
    const elevationCooling = clamp((elevation - (sample.seaLevel ?? 0)) * 0.85, 0, 0.22);
    const continentalRetention = continentMass * 0.05;
    const slopeExposure = slope * 0.04;

    const temperatureField = clamp(
      ambient +
        heatNodeInfluence * 0.34 -
        wildernessDecay -
        elevationCooling -
        slopeExposure +
        continentalRetention,
      0,
      1
    );

    const freezePotentialField = clamp((0.42 - temperatureField) / 0.42, 0, 1);
    const meltPotentialField = clamp((temperatureField - 0.38) / 0.42, 0, 1);
    const evaporationPressureField = clamp((temperatureField - 0.28) / 0.52, 0, 1);

    return Object.freeze({
      latDeg,
      lonDeg,
      visible: sample.visible,
      temperatureField,
      thermalGradientField: Object.freeze({
        polarCooling,
        heatNodeInfluence: clamp(heatNodeInfluence, 0, 1.5),
        wildernessDecay,
        nearestHeatDistanceDeg
      }),
      freezePotentialField,
      meltPotentialField,
      evaporationPressureField
    });
  }

  function buildThermodynamicField(terrainField, topologyField) {
    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return Object.freeze({
        samples: Object.freeze([]),
        summary: Object.freeze({
          temperatureAverage: 0,
          freezeAverage: 0,
          meltAverage: 0,
          evaporationAverage: 0
        })
      });
    }

    const topologySamples = Array.isArray(topologyField?.samples) ? topologyField.samples : [];
    const topologyIndex = new Map(
      topologySamples.map((sample) => [`${sample.latDeg}:${sample.lonDeg}`, sample])
    );

    let temperatureTotal = 0;
    let freezeTotal = 0;
    let meltTotal = 0;
    let evaporationTotal = 0;

    const samples = terrainField.samples.map((sample) => {
      const topologySample = topologyIndex.get(`${sample.latDeg}:${sample.lonDeg}`) ?? null;
      const thermalSample = computeSampleThermalState(sample, topologySample);

      temperatureTotal += thermalSample.temperatureField;
      freezeTotal += thermalSample.freezePotentialField;
      meltTotal += thermalSample.meltPotentialField;
      evaporationTotal += thermalSample.evaporationPressureField;

      return thermalSample;
    });

    const count = samples.length || 1;

    return Object.freeze({
      samples: Object.freeze(samples),
      summary: Object.freeze({
        temperatureAverage: temperatureTotal / count,
        freezeAverage: freezeTotal / count,
        meltAverage: meltTotal / count,
        evaporationAverage: evaporationTotal / count
      })
    });
  }

  return Object.freeze({
    buildThermodynamicField
  });
}
