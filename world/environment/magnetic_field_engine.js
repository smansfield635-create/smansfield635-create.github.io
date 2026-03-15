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

  function getLatLonFromProjector(projector) {
    const inverse = projector?.inverseProject?.(
      projector?.state?.centerX ?? 0,
      projector?.state?.centerY ?? 0
    );

    if (!inverse) {
      return Object.freeze({ latDeg: 0, lonDeg: 0 });
    }

    return Object.freeze({
      latDeg: inverse.lat * (180 / Math.PI),
      lonDeg: inverse.lon * (180 / Math.PI)
    });
  }

  function computeFieldStrength(latDeg, lonDeg) {
    const poleBias = Math.pow(Math.abs(latDeg) / 90, 0.72);

    let nodeInfluence = 0;
    for (const node of FIELD_NODES) {
      const distance = angularDistanceDeg(latDeg, lonDeg, node.latDeg, node.lonDeg);
      const normalized = 1 - clamp(distance / 180, 0, 1);
      nodeInfluence += Math.pow(normalized, 2.2) * node.strength;
    }

    const magneticIntensityField = clamp(0.20 + poleBias * 0.45 + nodeInfluence * 0.20, 0, 1);
    const shieldingGradientField = clamp(0.25 + magneticIntensityField * 0.70, 0, 1);
    const auroralPotentialField = clamp(Math.pow(poleBias, 1.6) * 0.85 + nodeInfluence * 0.10, 0, 1);
    const navigationFieldBasis = Object.freeze({
      headingBias: latDeg >= 0 ? "N" : "S",
      stability: clamp(0.35 + magneticIntensityField * 0.50, 0, 1)
    });

    return Object.freeze({
      latDeg,
      lonDeg: normalizeLonDeg(lonDeg),
      magneticIntensityField,
      shieldingGradientField,
      auroralPotentialField,
      navigationFieldBasis
    });
  }

  function compute(projector, runtime, renderState) {
    const sample = getLatLonFromProjector(projector);
    return computeFieldStrength(sample.latDeg, sample.lonDeg);
  }

  return Object.freeze({
    compute
  });
}
