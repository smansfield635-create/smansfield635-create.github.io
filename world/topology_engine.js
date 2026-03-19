export function createTopologyEngine(config = {}) {
  const ELEVATION_GAIN =
    Number.isFinite(config.elevationGain) ? config.elevationGain : 1.18;
  const RIDGE_GAIN =
    Number.isFinite(config.ridgeGain) ? config.ridgeGain : 1.22;
  const BASIN_GAIN =
    Number.isFinite(config.basinGain) ? config.basinGain : 1.16;
  const SUMMIT_GAIN =
    Number.isFinite(config.summitGain) ? config.summitGain : 1.18;
  const CANYON_GAIN =
    Number.isFinite(config.canyonGain) ? config.canyonGain : 1.14;
  const COAST_GAIN =
    Number.isFinite(config.coastGain) ? config.coastGain : 1.10;
  const RELIEF_GAIN =
    Number.isFinite(config.reliefGain) ? config.reliefGain : 1.20;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function terrainClass(sample) {
    return typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
  }

  function isLandSample(sample) {
    if (sample?.landMask === 1) return true;
    if (sample?.waterMask === 1) return false;

    const tc = terrainClass(sample);
    return tc !== "WATER" && tc !== "SHELF";
  }

  function coastlineStrength(sample) {
    const shoreline =
      sample?.shoreline === true ||
      sample?.shorelineBand === true ||
      terrainClass(sample) === "SHORELINE" ||
      terrainClass(sample) === "BEACH";

    if (!shoreline) return 0;

    const slope = clamp(sample?.slope ?? 0, 0, 1);
    const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
    const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);

    return clamp(
      0.42 + ridge * 0.18 - basin * 0.10 - slope * 0.08,
      0,
      1
    );
  }

  function reliefComposite(sample) {
    const elevation = clamp(sample?.elevation ?? 0, -1, 1);
    const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
    const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
    const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
    const summit = clamp(sample?.strongestSummitScore ?? 0, 0, 1);
    const slope = clamp(sample?.slope ?? 0, 0, 1);

    return clamp(
      Math.max(0, elevation) * 0.24 +
      ridge * 0.26 +
      summit * 0.20 +
      slope * 0.14 -
      basin * 0.10 -
      canyon * 0.06,
      0,
      1
    );
  }

  function squareMaskStrength(sample) {
    if (!isLandSample(sample)) return 0;

    const relief = reliefComposite(sample);
    const coast = coastlineStrength(sample);
    const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
    const sediment = clamp(sample?.sedimentLoad ?? 0, 0, 1);

    return clamp(
      relief * 0.42 +
      coast * 0.24 +
      rainfall * 0.10 +
      sediment * 0.10,
      0,
      1
    );
  }

  function classifyMacroForm(sample) {
    const tc = terrainClass(sample);

    if (!isLandSample(sample)) return "WATER";
    if (tc === "SUMMIT" || tc === "MOUNTAIN" || tc === "GLACIAL_HIGHLAND") return "HIGHLAND";
    if (tc === "RIDGE" || tc === "PLATEAU") return "RIDGE_SYSTEM";
    if (tc === "BASIN") return "BASIN_SYSTEM";
    if (tc === "CANYON") return "CANYON_SYSTEM";
    if (tc === "BEACH" || tc === "SHORELINE") return "COAST_SYSTEM";
    return "LANDMASS";
  }

  function computeSampleTopology(sample) {
    const elevation = clamp(sample?.elevation ?? 0, -1, 1);
    const ridge = clamp((sample?.ridgeStrength ?? 0) * RIDGE_GAIN, 0, 1);
    const basin = clamp((sample?.basinStrength ?? 0) * BASIN_GAIN, 0, 1);
    const summit = clamp((sample?.strongestSummitScore ?? 0) * SUMMIT_GAIN, 0, 1);
    const canyon = clamp((sample?.canyonStrength ?? 0) * CANYON_GAIN, 0, 1);
    const coast = clamp(coastlineStrength(sample) * COAST_GAIN, 0, 1);
    const relief = clamp(reliefComposite(sample) * RELIEF_GAIN, 0, 1);
    const blockMask = squareMaskStrength(sample);
    const macroForm = classifyMacroForm(sample);

    const elevationAmplified = clamp(elevation * ELEVATION_GAIN, -1, 1);

    return Object.freeze({
      elevationAmplified,
      ridgeAmplified: ridge,
      basinAmplified: basin,
      summitAmplified: summit,
      canyonAmplified: canyon,
      coastAmplified: coast,
      reliefComposite: relief,
      squareMaskStrength: blockMask,
      macroForm
    });
  }

  function buildTopologyField(planetField) {
    const rows = Array.isArray(planetField?.samples) ? planetField.samples : [];
    if (!Array.isArray(rows[0])) {
      return Object.freeze({
        samples: Object.freeze([]),
        summary: Object.freeze({
          landSampleCount: 0,
          highlandCount: 0,
          ridgeSystemCount: 0,
          basinSystemCount: 0,
          canyonSystemCount: 0,
          coastSystemCount: 0,
          reliefAverage: 0,
          squareMaskAverage: 0
        })
      });
    }

    let landSampleCount = 0;
    let highlandCount = 0;
    let ridgeSystemCount = 0;
    let basinSystemCount = 0;
    let canyonSystemCount = 0;
    let coastSystemCount = 0;
    let reliefTotal = 0;
    let squareMaskTotal = 0;

    const interpreted = rows.map((row) =>
      Object.freeze(
        row.map((sample) => {
          const topology = computeSampleTopology(sample);

          if (isLandSample(sample)) {
            landSampleCount += 1;
            reliefTotal += topology.reliefComposite;
            squareMaskTotal += topology.squareMaskStrength;

            if (topology.macroForm === "HIGHLAND") highlandCount += 1;
            else if (topology.macroForm === "RIDGE_SYSTEM") ridgeSystemCount += 1;
            else if (topology.macroForm === "BASIN_SYSTEM") basinSystemCount += 1;
            else if (topology.macroForm === "CANYON_SYSTEM") canyonSystemCount += 1;
            else if (topology.macroForm === "COAST_SYSTEM") coastSystemCount += 1;
          }

          return Object.freeze(topology);
        })
      )
    );

    const divisor = Math.max(1, landSampleCount);

    return Object.freeze({
      samples: Object.freeze(interpreted),
      summary: Object.freeze({
        landSampleCount,
        highlandCount,
        ridgeSystemCount,
        basinSystemCount,
        canyonSystemCount,
        coastSystemCount,
        reliefAverage: reliefTotal / divisor,
        squareMaskAverage: squareMaskTotal / divisor
      })
    });
  }

  function getSampleTopology(topologyField, x, y) {
    const row = topologyField?.samples?.[y];
    const sample = row?.[x];
    return sample || null;
  }

  return Object.freeze({
    buildTopologyField,
    getSampleTopology,
    computeSampleTopology
  });
}

const DEFAULT_TOPOLOGY_ENGINE = createTopologyEngine();

export function buildTopologyField(planetField) {
  return DEFAULT_TOPOLOGY_ENGINE.buildTopologyField(planetField);
}

export function getSampleTopology(topologyField, x, y) {
  return DEFAULT_TOPOLOGY_ENGINE.getSampleTopology(topologyField, x, y);
}

export function computeSampleTopology(sample) {
  return DEFAULT_TOPOLOGY_ENGINE.computeSampleTopology(sample);
}
