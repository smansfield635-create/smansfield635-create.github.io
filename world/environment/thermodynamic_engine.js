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

  function computeThermalState(latDeg, lonDeg) {
    const normalizedLon = normalizeLonDeg(lonDeg);
    const
