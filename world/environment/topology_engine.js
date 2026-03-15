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

  function normalizeLonDeg(lonDeg) {
    let value = lonDeg;
    while (value > 180) value -= 360;
    while (value < -180) value += 360;
    return value;
  }

  function buildNeighborIndex(samples) {
    const index = new Map();
    for (const s of samples) {
      index.set(`${s.latDeg}:${normalizeLonDeg(s.lonDeg)}`, s);
    }
    return index;
  }

  function getNeighborSamples(sample, index) {
    const lat = sample.latDeg;
    const lon = normalizeLonDeg(sample.lonDeg);

    const offsets = [
      [3, 0], [-3, 0], [0, 3], [0, -3],
      [3, 3], [3, -3], [-3, 3], [-3, -3]
    ];

    const neighbors = [];
    for (const [dLat, dLon] of offsets) {
      const key = `${lat + dLat}:${normalizeLonDeg(lon + dLon)}`;
      const neighbor = index.get(key);
      if (neighbor) neighbors.push(neighbor);
    }
    return neighbors;
  }

  function getNeighborAverage(sample, index) {
    const neighbors = getNeighborSamples(sample, index);
    if (!neighbors.length) return sample.elevation ?? 0;

    let total = 0;
    for (const neighbor of neighbors) {
      total += neighbor.elevation ?? 0;
    }
    return total / neighbors.length;
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
    const index = buildNeighborIndex(samples);

    const ridgeCandidates = [];
    const basinCandidates = [];
    const divideCandidates = [];
    const watershedSeeds = [];

    const enrichedSamples = samples.map((sample) => {
      const elevation = sample.elevation ?? 0;
      const neighborAverage = getNeighborAverage(sample, index);

      const gradient = elevation - neighborAverage;
      const continentMass = clamp((elevation - seaLevel) / 0.45, 0, 1);
      const slope = clamp(Math.abs(gradient) * 5.4, 0, 1);
      const curvature = clamp((neighborAverage - elevation) * 4.2, -1, 1);

      const ridgeStrength = clamp(
        Math.max(0, gradient) * 6.2 +
          continentMass * 0.22 +
          (fbm(sample.latDeg * 0.12, sample.lonDeg * 0.12) - 0.5) * 0.08,
        0,
        1
      );

      const basinStrength = clamp(
        Math.max(0, -gradient) * 5.4 +
          Math.max(0, curvature) * 0.24 +
          (1 - continentMass) * 0.06,
        0,
        1
      );

      const divideStrength = clamp(ridgeStrength * continentMass, 0, 1);
      const watershedSeed = ridgeStrength > 0.55 && continentMass > 0.35;

      const enrichedSample = Object.freeze({
        latDeg: sample.latDeg,
        lonDeg: normalizeLonDeg(sample.lonDeg),
        visible: sample.visible,
        elevation: sample.elevation,
        seaLevel: sample.seaLevel,
        terrain: sample.terrain,
        shoreline: sample.shoreline,
        continentId: sample.continentId,
        radialOffsetPx: sample.radialOffsetPx,
        x: sample.x,
        y: sample.y,
        z: sample.z,
        continentMass,
        slope,
        curvature,
        ridgeStrength,
        basinStrength,
        divideStrength,
        watershedSeed
      });

      if (ridgeStrength > 0.55) ridgeCandidates.push(enrichedSample);
      if (basinStrength > 0.55) basinCandidates.push(enrichedSample);
      if (divideStrength > 0.55) divideCandidates.push(enrichedSample);
      if (watershedSeed) watershedSeeds.push(enrichedSample);

      return enrichedSample;
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
