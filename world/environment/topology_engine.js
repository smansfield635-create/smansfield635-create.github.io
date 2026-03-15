export function createTopologyEngine() {

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y) {
    return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function valueNoise(x, y) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const sx = x - x0;
    const sy = y - y0;

    const n00 = hash2(x0, y0);
    const n10 = hash2(x1, y0);
    const n01 = hash2(x0, y1);
    const n11 = hash2(x1, y1);

    const ix0 = lerp(n00, n10, sx);
    const ix1 = lerp(n01, n11, sx);

    return lerp(ix0, ix1, sy);
  }

  function fbm(x, y) {
    let total = 0;
    let amplitude = 0.5;
    let frequency = 1.0;
    let amplitudeSum = 0;

    for (let i = 0; i < 4; i += 1) {
      total += valueNoise(x * frequency, y * frequency) * amplitude;
      amplitudeSum += amplitude;
      amplitude *= 0.5;
      frequency *= 2.0;
    }

    return amplitudeSum > 0 ? total / amplitudeSum : 0;
  }

  function buildNeighborIndex(samples) {
    const index = new Map();
    for (const s of samples) {
      index.set(`${s.latDeg}:${s.lonDeg}`, s);
    }
    return index;
  }

  function getNeighborAverage(sample, index) {
    const lat = sample.latDeg;
    const lon = sample.lonDeg;

    const keys = [
      `${lat + 3}:${lon}`,
      `${lat - 3}:${lon}`,
      `${lat}:${lon + 3}`,
      `${lat}:${lon - 3}`
    ];

    let total = 0;
    let count = 0;

    for (const k of keys) {
      const n = index.get(k);
      if (!n) continue;
      total += n.elevation ?? 0;
      count += 1;
    }

    if (count === 0) return sample.elevation ?? 0;
    return total / count;
  }

  function computeSlope(sample, neighborAverage) {
    return clamp(Math.abs(sample.elevation - neighborAverage) * 4.5, 0, 1);
  }

  function computeCurvature(sample, neighborAverage) {
    return clamp((neighborAverage - sample.elevation) * 3.8, -1, 1);
  }

  function buildTopologyField(terrainField) {

    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return Object.freeze({
        samples: Object.freeze([]),
        ridgeCandidates: Object.freeze([]),
        basinCandidates: Object.freeze([]),
        divideCandidates: Object.freeze([]),
        watershedSeeds: Object.freeze([])
      });
    }

    const samples = terrainField.samples;
    const seaLevel = terrainField.seaLevel ?? 0;

    const neighborIndex = buildNeighborIndex(samples);

    const ridgeCandidates = [];
    const basinCandidates = [];
    const divideCandidates = [];
    const watershedSeeds = [];

    const enrichedSamples = samples.map(sample => {

      const elevation = sample.elevation ?? 0;
      const neighborAverage = getNeighborAverage(sample, neighborIndex);

      const slope = computeSlope(sample, neighborAverage);
      const curvature = computeCurvature(sample, neighborAverage);

      const continentMass = clamp((elevation - seaLevel) / 0.45, 0, 1);

      const ridgeStrength = clamp(
        slope * continentMass +
        (fbm(sample.latDeg * 0.12, sample.lonDeg * 0.12) - 0.5) * 0.18,
        0,
        1
      );

      const basinStrength = clamp(
        -curvature * (1 - continentMass) +
        (fbm(sample.latDeg * 0.18, sample.lonDeg * 0.18) - 0.5) * 0.14,
        0,
        1
      );

      const divideStrength = clamp(
        ridgeStrength * 0.8 + slope * 0.4,
        0,
        1
      );

      const watershedSeed =
        ridgeStrength > 0.58 &&
        continentMass > 0.35;

      if (ridgeStrength > 0.58) ridgeCandidates.push(sample);
      if (basinStrength > 0.58) basinCandidates.push(sample);
      if (divideStrength > 0.58) divideCandidates.push(sample);
      if (watershedSeed) watershedSeeds.push(sample);

      return Object.freeze({
        ...sample,
        slope,
        curvature,
        continentMass,
        ridgeStrength,
        basinStrength,
        divideStrength,
        watershedSeed
      });

    });

    return Object.freeze({
      samples: Object.freeze(enrichedSamples),
      ridgeCandidates: Object.freeze(ridgeCandidates),
      basinCandidates: Object.freeze(basinCandidates),
      divideCandidates: Object.freeze(divideCandidates),
      watershedSeeds: Object.freeze(watershedSeeds)
    });

  }

  return Object.freeze({
    buildTopologyField
  });

}
