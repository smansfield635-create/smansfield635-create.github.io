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
    for (const sample of samples) {
      index.set(`${sample.latDeg}:${normalizeLonDeg(sample.lonDeg)}`, sample);
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

  function classifyTerrainClass(sample) {
    const aboveSea = (sample.elevation ?? 0) > (sample.seaLevel ?? 0);

    if (!aboveSea) {
      if ((sample.elevation ?? 0) < (sample.seaLevel ?? 0) - 0.22) return "deep_ocean";
      if ((sample.elevation ?? 0) < (sample.seaLevel ?? 0) - 0.08) return "ocean";
      return "shelf";
    }

    if (sample.mountainMask > 0.62 && sample.cliffMask > 0.36) return "peak";
    if (sample.mountainMask > 0.48) return "mountain";
    if (sample.plateauMask > 0.46) return "plateau";
    if (sample.canyonMask > 0.46) return "canyon";
    if (sample.cliffMask > 0.42) return "cliff";
    if (sample.valleyMask > 0.40) return "valley";
    if (sample.basinStrength > 0.34) return "basin";
    if (sample.ridgeStrength > 0.34) return "ridge";
    return "plain";
  }

  function buildEmptyField() {
    return Object.freeze({
      samples: Object.freeze([]),
      ridgeCandidates: Object.freeze([]),
      basinCandidates: Object.freeze([]),
      divideCandidates: Object.freeze([]),
      watershedSeeds: Object.freeze([]),
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

  function buildTopologyField(terrainField) {
    if (!terrainField || !Array.isArray(terrainField.samples)) {
      return buildEmptyField();
    }

    const samples = terrainField.samples;
    const seaLevel = terrainField.seaLevel ?? 0;
    const index = buildNeighborIndex(samples);

    const ridgeCandidates = [];
    const basinCandidates = [];
    const divideCandidates = [];
    const watershedSeeds = [];

    let elevationTotal = 0;
    let slopeTotal = 0;
    let ridgeTotal = 0;
    let valleyTotal = 0;
    let mountainCount = 0;
    let basinCount = 0;
    let canyonCount = 0;
    let caveCandidateCount = 0;

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

      const mountainMask = clamp(
        ridgeStrength * 0.72 +
          continentMass * 0.24 +
          clamp((elevation - seaLevel) / 0.30, 0, 1) * 0.22,
        0,
        1
      );

      const cliffMask = clamp(
        slope * 0.68 +
          divideStrength * 0.18 +
          Math.max(0, gradient) * 0.16,
        0,
        1
      );

      const valleyMask = clamp(
        basinStrength * 0.72 +
          Math.max(0, curvature) * 0.18,
        0,
        1
      );

      const canyonMask = clamp(
        valleyMask * 0.52 +
          cliffMask * 0.34 +
          basinStrength * 0.20,
        0,
        1
      );

      const plateauMask = clamp(
        continentMass * 0.30 +
          clamp((elevation - seaLevel) / 0.26, 0, 1) * 0.34 +
          clamp(0.42 - slope, 0, 0.42) * 0.72,
        0,
        1
      );

      const caveCandidateMask = clamp(
        cliffMask * 0.42 +
          canyonMask * 0.28 +
          basinStrength * 0.12,
        0,
        1
      );

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
        watershedSeed,
        mountainMask,
        cliffMask,
        valleyMask,
        canyonMask,
        plateauMask,
        caveCandidateMask,
        terrainClass: ""
      });

      const terrainClass = classifyTerrainClass(enrichedSample);
      const finalSample = Object.freeze({
        ...enrichedSample,
        terrainClass
      });

      elevationTotal += elevation;
      slopeTotal += slope;
      ridgeTotal += ridgeStrength;
      valleyTotal += valleyMask;

      if (terrainClass === "peak" || terrainClass === "mountain") mountainCount += 1;
      if (terrainClass === "basin" || terrainClass === "valley") basinCount += 1;
      if (terrainClass === "canyon") canyonCount += 1;
      if (caveCandidateMask > 0.50) caveCandidateCount += 1;

      if (ridgeStrength > 0.55) ridgeCandidates.push(finalSample);
      if (basinStrength > 0.55) basinCandidates.push(finalSample);
      if (divideStrength > 0.55) divideCandidates.push(finalSample);
      if (watershedSeed) watershedSeeds.push(finalSample);

      return finalSample;
    });

    const count = enrichedSamples.length || 1;

    return Object.freeze({
      samples: Object.freeze(enrichedSamples),
      ridgeCandidates: Object.freeze(ridgeCandidates),
      basinCandidates: Object.freeze(basinCandidates),
      divideCandidates: Object.freeze(divideCandidates),
      watershedSeeds: Object.freeze(watershedSeeds),
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

  return Object.freeze({
    buildTopologyField
  });
}
