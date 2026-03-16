export function createMagneticFieldEngine() {
  const FIELD_NODES = Object.freeze([
    Object.freeze({ latDeg: 82, lonDeg: 0, strength: 1.0 }),
    Object.freeze({ latDeg: -82, lonDeg: 180, strength: 1.0 })
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

  function computeFieldStrength(latDeg, lonDeg) {
    const normalizedLon = normalizeLonDeg(lonDeg);
    const poleBias = Math.pow(Math.abs(latDeg) / 90, 0.72);

    let nodeInfluence = 0;
    for (const node of FIELD_NODES) {
      const distance = angularDistanceDeg(latDeg, normalizedLon, node.latDeg, node.lonDeg);
      const normalized = 1 - clamp(distance / 180, 0, 1);
      nodeInfluence += Math.pow(normalized, 2.2) * node.strength;
    }

    const magneticIntensityField = clamp(
      0.20 + poleBias * 0.45 + nodeInfluence * 0.20,
      0,
      1
    );

    const shieldingGradientField = clamp(
      0.25 + magneticIntensityField * 0.70,
      0,
      1
    );

    const auroralPotentialField = clamp(
      Math.pow(poleBias, 1.6) * 0.85 + nodeInfluence * 0.10,
      0,
      1
    );

    const navigationFieldBasis = Object.freeze({
      headingBias: latDeg >= 0 ? "N" : "S",
      stability: clamp(0.35 + magneticIntensityField * 0.50, 0, 1)
    });

    return Object.freeze({
      latDeg,
      lonDeg: normalizedLon,
      magneticIntensityField,
      shieldingGradientField,
      auroralPotentialField,
      navigationFieldBasis
    });
  }

  function computeSampleMagneticState(sample) {
    const latDeg = Number.isFinite(sample?.latDeg) ? sample.latDeg : 0;
    const lonDeg = Number.isFinite(sample?.lonDeg) ? sample.lonDeg : 0;

    const base = computeFieldStrength(latDeg, lonDeg);

    return Object.freeze({
      latDeg: base.latDeg,
      lonDeg: base.lonDeg,
      visible: sample?.visible === true,
      z: Number.isFinite(sample?.z) ? sample.z : -Infinity,
      magneticIntensityField: base.magneticIntensityField,
      shieldingGradientField: base.shieldingGradientField,
      auroralPotentialField: base.auroralPotentialField,
      navigationFieldBasis: base.navigationFieldBasis
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
      magneticIntensityField: 0,
      shieldingGradientField: 0,
      auroralPotentialField: 0,
      navigationFieldBasis: Object.freeze({
        headingBias: "N",
        stability: 0
      }),
      samples: Object.freeze([]),
      summary: Object.freeze({
        sampleCount: 0,
        magneticIntensityAverage: 0,
        shieldingGradientAverage: 0,
        auroralPotentialAverage: 0,
        stabilityAverage: 0,
        northHeadingCount: 0,
        southHeadingCount: 0
      })
    });
  }

  function buildMagneticField(terrainField) {
    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return buildEmptyField();
    }

    let magneticIntensityTotal = 0;
    let shieldingGradientTotal = 0;
    let auroralPotentialTotal = 0;
    let stabilityTotal = 0;
    let northHeadingCount = 0;
    let southHeadingCount = 0;

    const samples = terrainField.samples.map((sample) => {
      const magneticSample = computeSampleMagneticState(sample);

      magneticIntensityTotal += magneticSample.magneticIntensityField;
      shieldingGradientTotal += magneticSample.shieldingGradientField;
      auroralPotentialTotal += magneticSample.auroralPotentialField;
      stabilityTotal += magneticSample.navigationFieldBasis.stability;

      if (magneticSample.navigationFieldBasis.headingBias === "N") northHeadingCount += 1;
      if (magneticSample.navigationFieldBasis.headingBias === "S") southHeadingCount += 1;

      return magneticSample;
    });

    const count = samples.length || 1;
    const representative = pickRepresentativeSample(samples) ?? buildEmptyField();

    return Object.freeze({
      latDeg: representative.latDeg ?? 0,
      lonDeg: representative.lonDeg ?? 0,
      magneticIntensityField: representative.magneticIntensityField ?? 0,
      shieldingGradientField: representative.shieldingGradientField ?? 0,
      auroralPotentialField: representative.auroralPotentialField ?? 0,
      navigationFieldBasis: Object.freeze({
        headingBias: representative.navigationFieldBasis?.headingBias ?? "N",
        stability: representative.navigationFieldBasis?.stability ?? 0
      }),
      samples: Object.freeze(samples),
      summary: Object.freeze({
        sampleCount: samples.length,
        magneticIntensityAverage: magneticIntensityTotal / count,
        shieldingGradientAverage: shieldingGradientTotal / count,
        auroralPotentialAverage: auroralPotentialTotal / count,
        stabilityAverage: stabilityTotal / count,
        northHeadingCount,
        southHeadingCount
      })
    });
  }

  return Object.freeze({
    buildMagneticField
  });
}
