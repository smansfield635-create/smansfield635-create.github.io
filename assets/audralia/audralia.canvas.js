/* /assets/audralia/audralia.runtime.js */
/* AUDRALIA_RUNTIME_TRUTH_AUTHORITY */
/* TNT: AUDRALIA_RUNTIME_TRUTH_RENEWAL_TNT_v1 */

const RECEIPT = "AUDRALIA_RUNTIME_TRUTH_RECEIPT";
const CONTRACT = "AUDRALIA_RUNTIME_TRUTH_RENEWAL_TNT_v1";
const VERSION = "2026-05-06.runtime-truth-renewal";

const PLANET = Object.freeze({
  name: "Audralia",
  route: "/showroom/globe/audralia/",
  canvasAuthority: "/assets/audralia/audralia.canvas.js",
  runtimeAuthority: "/assets/audralia/audralia.runtime.js",
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  lineage: "tectonics -> topology -> terrain",
  runtimeRole: "truth-object-provider",
  topologyRole: "subterranean-and-sea-level-blueprint",
  terrainRole: "above-sea-level-elevation-expression",
  hydrationRole: "water-authority-boundary-and-depth",
  exposedLandRatioTarget: 0.292,
  ageRelation: "approximately-four-times-earth",
  climatePremise: "clean-early-world-ecology-with-ancient-weathered-geology"
});

const REGIONS = Object.freeze([
  { id: 1, key: "north-crown", elevationBand: "highest", role: "ice-reserve-and-pressure-cap" },
  { id: 2, key: "west-mainland", elevationBand: "high", role: "weathered-granite-slate-mainland" },
  { id: 3, key: "east-mainland", elevationBand: "medium-high", role: "opal-granite-coastal-rise" },
  { id: 4, key: "equatorial-chain", elevationBand: "medium", role: "ancient-eroded-mountain-memory" },
  { id: 5, key: "southern-mass", elevationBand: "medium-low", role: "diamond-opal-wet-edge" },
  { id: 6, key: "island-belt-alpha", elevationBand: "low", role: "island-and-shelf-expression" },
  { id: 7, key: "island-belt-beta", elevationBand: "low", role: "miscellaneous-territory-expression" },
  { id: 8, key: "deep-basin-grid", elevationBand: "below-sea", role: "ocean-basin-and-void-definition" },
  { id: 9, key: "subterranean-grid", elevationBand: "subsurface", role: "pressure-lines-caverns-and-underbody-boundaries" }
]);

const MATERIALS = Object.freeze({
  primary: ["diamond", "opal", "granite", "slate"],
  metals: ["gold", "platinum", "silver", "copper", "iron", "lead"],
  coastalSands: ["white-opal-sand", "black-diamond-sand"],
  waterStates: ["deep-ocean", "shelf-water", "coastal-water", "glacier-reserve", "ice-cap"]
});

const TOPOLOGY = Object.freeze({
  receipt: "AUDRALIA_TOPOLOGY_RUNTIME_BLUEPRINT_v1",
  scope: "subterranean-and-sea-level-blueprint-only",
  owns: [
    "land-void-footprint",
    "sea-level-boundary",
    "coastal-shelf",
    "beach-threshold",
    "basin-depth",
    "subsurface-boundaries",
    "pressure-line-map"
  ],
  doesNotOwn: [
    "foliage",
    "climate-animation",
    "final-canvas-render",
    "above-sea-terrain-relief",
    "visual-pass-claim"
  ],
  landmasses: [
    {
      id: "western-mainland-arc",
      region: 2,
      seaLevelState: "exposed",
      points: [
        [-53, -156], [-43, -139], [-31, -126], [-15, -130],
        [-2, -116], [13, -103], [23, -83], [14, -63],
        [-5, -56], [-22, -68], [-35, -92], [-49, -121]
      ]
    },
    {
      id: "eastern-attached-mainland",
      region: 3,
      seaLevelState: "exposed",
      points: [
        [-19, -61], [-2, -40], [12, -22], [28, -7],
        [35, 16], [29, 43], [12, 56], [-8, 49],
        [-21, 30], [-25, 3], [-29, -29]
      ]
    },
    {
      id: "northern-rock-crown",
      region: 1,
      seaLevelState: "exposed-ice-cap",
      points: [
        [43, -148], [58, -112], [65, -66], [60, -18],
        [49, 22], [39, 0], [35, -42], [38, -91]
      ]
    },
    {
      id: "southern-weathered-mass",
      region: 5,
      seaLevelState: "exposed-wet-edge",
      points: [
        [-66, -42], [-58, 9], [-48, 54], [-35, 78],
        [-24, 113], [-38, 147], [-57, 171], [-72, 132],
        [-75, 53]
      ]
    },
    {
      id: "equatorial-ancient-chain",
      region: 4,
      seaLevelState: "exposed-chain",
      points: [
        [-9, 67], [4, 82], [17, 105], [14, 139],
        [1, 162], [-13, 150], [-19, 115], [-18, 86]
      ]
    }
  ],
  islandBelts: [
    { id: "alpha-islands", region: 6, center: [-7, 128], spread: 26, count: 18 },
    { id: "beta-islands", region: 7, center: [18, -166], spread: 30, count: 22 },
    { id: "southern-shelf-islands", region: 6, center: [-42, 108], spread: 18, count: 14 },
    { id: "western-pressure-islands", region: 7, center: [4, -142], spread: 22, count: 16 }
  ],
  shelves: [
    [[-58, -161], [-44, -144], [-30, -133], [-10, -139], [9, -118], [28, -88], [20, -57], [-4, -48], [-29, -61], [-43, -95], [-56, -126]],
    [[-24, -65], [2, -44], [24, -13], [42, 16], [34, 51], [6, 66], [-21, 42], [-34, 2], [-34, -38]],
    [[38, -158], [64, -122], [72, -66], [67, -4], [50, 35], [34, 8], [29, -45], [33, -103]],
    [[-76, -59], [-65, 11], [-53, 64], [-31, 92], [-21, 131], [-42, 169], [-67, 178], [-82, 124], [-83, 32]]
  ],
  pressureLines: [
    [[-61, -142], [-47, -120], [-35, -93], [-24, -62], [-11, -31], [7, -4], [22, 26]],
    [[41, -139], [53, -101], [57, -60], [53, -17], [43, 19]],
    [[-68, 98], [-52, 119], [-35, 139], [-17, 158], [3, 177]],
    [[-15, 72], [-1, 94], [7, 118], [4, 144], [-8, 162]],
    [[-33, -128], [-10, -114], [11, -95], [29, -72]]
  ],
  basinLines: [
    [[-38, 112], [-18, 87], [4, 74], [30, 73], [55, 88]],
    [[-62, -18], [-39, 4], [-15, 17], [13, 23], [39, 18]],
    [[10, -169], [-7, 169], [-24, 145], [-41, 126]]
  ]
});

const HYDRATION = Object.freeze({
  receipt: "AUDRALIA_HYDRATION_RUNTIME_BOUNDARY_v1",
  seaLevel: 0,
  deepOceanBelow: -0.62,
  shelfRange: [-0.62, -0.08],
  coastalRange: [-0.08, 0.035],
  beachRange: [0.035, 0.085],
  glacierAbove: 0.82,
  owns: [
    "ocean-depth",
    "shelf-water",
    "coastal-wet-edge",
    "sea-level-datum",
    "glacier-reserve-state"
  ]
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeLon(lon) {
  let value = Number(lon) || 0;

  while (value > 180) value -= 360;
  while (value < -180) value += 360;

  return value;
}

function normalizeLat(lat) {
  return clamp(Number(lat) || 0, -90, 90);
}

function hash01(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function signedDistanceToPoint(lat, lon, pointLat, pointLon) {
  const dLat = lat - pointLat;
  const dLon = normalizeLon(lon - pointLon);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

function pointScoreFromPolygon(lat, lon, points) {
  let minDistance = Infinity;

  for (const [pointLat, pointLon] of points) {
    minDistance = Math.min(minDistance, signedDistanceToPoint(lat, lon, pointLat, pointLon));
  }

  const anchorScore = smoothstep(42, 0, minDistance);
  const waveScore =
    Math.sin((lat + points.length * 7) * 0.075) * 0.07 +
    Math.cos((lon - points.length * 11) * 0.061) * 0.07;

  return clamp(anchorScore + waveScore, 0, 1);
}

function computeLandInfluence(lat, lon) {
  let best = {
    influence: 0,
    region: 8,
    massId: "ocean-void"
  };

  for (const mass of TOPOLOGY.landmasses) {
    const influence = pointScoreFromPolygon(lat, lon, mass.points);

    if (influence > best.influence) {
      best = {
        influence,
        region: mass.region,
        massId: mass.id
      };
    }
  }

  for (const belt of TOPOLOGY.islandBelts) {
    for (let i = 0; i < belt.count; i += 1) {
      const angle = hash01((i + 1) * 91 + belt.region) * Math.PI * 2;
      const radius = hash01((i + 1) * 193 + belt.region) * belt.spread;
      const islandLat = clamp(belt.center[0] + Math.sin(angle) * radius * 0.55, -72, 72);
      const islandLon = normalizeLon(belt.center[1] + Math.cos(angle) * radius);
      const distance = signedDistanceToPoint(lat, lon, islandLat, islandLon);
      const influence = smoothstep(7.5, 0, distance) * 0.78;

      if (influence > best.influence) {
        best = {
          influence,
          region: belt.region,
          massId: `${belt.id}-${i + 1}`
        };
      }
    }
  }

  return best;
}

function computePressure(lat, lon) {
  let pressure = 0;

  for (const line of TOPOLOGY.pressureLines) {
    for (const [lineLat, lineLon] of line) {
      const distance = signedDistanceToPoint(lat, lon, lineLat, lineLon);
      pressure = Math.max(pressure, smoothstep(24, 0, distance));
    }
  }

  const mineralNoise =
    hash01(lat * 17.31 + lon * 3.77) * 0.16 +
    Math.abs(Math.sin(lat * 0.21) * Math.cos(lon * 0.13)) * 0.22;

  return clamp(pressure * 0.72 + mineralNoise, 0, 1);
}

function computeBasin(lat, lon) {
  let basin = 0;

  for (const line of TOPOLOGY.basinLines) {
    for (const [lineLat, lineLon] of line) {
      const distance = signedDistanceToPoint(lat, lon, lineLat, lineLon);
      basin = Math.max(basin, smoothstep(34, 0, distance));
    }
  }

  const oceanNoise = Math.abs(Math.sin((lat - 12) * 0.087) * Math.cos((lon + 31) * 0.049));

  return clamp(basin * 0.65 + oceanNoise * 0.28, 0, 1);
}

function computeElevation(lat, lon) {
  const land = computeLandInfluence(lat, lon);
  const pressure = computePressure(lat, lon);
  const basin = computeBasin(lat, lon);
  const polarLift = smoothstep(42, 88, Math.abs(lat)) * 0.36;
  const raw =
    land.influence * 1.15 +
    pressure * 0.28 +
    polarLift -
    basin * 0.44 -
    0.42;

  return clamp(raw, -1, 1);
}

function classifySurface(latInput, lonInput) {
  const lat = normalizeLat(latInput);
  const lon = normalizeLon(lonInput);
  const land = computeLandInfluence(lat, lon);
  const pressure = computePressure(lat, lon);
  const basin = computeBasin(lat, lon);
  const elevation = computeElevation(lat, lon);
  const absLat = Math.abs(lat);

  let region = land.region;
  let className = "deep-ocean";
  let hydration = "deep-ocean";
  let material = "basaltic-basin";

  if (elevation >= HYDRATION.glacierAbove || absLat >= 68) {
    className = "ice-cap-glacier-reserve";
    hydration = "frozen-water";
    material = "ice-over-slate-diamond";
    region = absLat >= 0 ? (lat >= 0 ? 1 : 5) : region;
  } else if (elevation > HYDRATION.beachRange[1]) {
    className = "exposed-weathered-land";
    hydration = "above-sea";
    material = pressure > 0.66 ? "diamond-opal-granite-slate" : "granite-slate";
  } else if (elevation > HYDRATION.beachRange[0]) {
    className = "beach-threshold";
    hydration = "wet-edge";
    material = pressure > 0.52 ? "black-diamond-and-white-opal-sand" : "white-opal-sand";
  } else if (elevation > HYDRATION.coastalRange[0]) {
    className = "coastal-water";
    hydration = "coastal-water";
    material = "coastal-shelf";
  } else if (elevation > HYDRATION.deepOceanBelow) {
    className = "continental-shelf-water";
    hydration = "shelf-water";
    material = "submerged-shelf";
    region = 8;
  } else {
    className = "deep-ocean-basin";
    hydration = "deep-ocean";
    material = basin > 0.56 ? "deep-basin" : "ocean-void";
    region = 8;
  }

  if (pressure > 0.72 && elevation < 0.18) {
    region = 9;
  }

  return {
    lat,
    lon,
    className,
    region,
    regionKey: REGIONS.find((item) => item.id === region)?.key || "unclassified",
    massId: land.massId,
    elevation,
    landInfluence: land.influence,
    pressure,
    basin,
    hydration,
    material,
    isLand: elevation > HYDRATION.beachRange[1],
    isBeach: elevation > HYDRATION.beachRange[0] && elevation <= HYDRATION.beachRange[1],
    isWater: elevation <= HYDRATION.beachRange[0],
    isFrozen: hydration === "frozen-water",
    isSubterraneanRelevant: pressure > 0.62 || region === 9
  };
}

function buildLattice256() {
  const states = [];

  for (let i = 0; i < 256; i += 1) {
    const bits = i.toString(2).padStart(8, "0");
    const latBand = parseInt(bits.slice(0, 3), 2);
    const lonBand = parseInt(bits.slice(3, 6), 2);
    const depthBit = Number(bits[6]);
    const pressureBit = Number(bits[7]);

    const lat = -78 + latBand * (156 / 7);
    const lon = -168 + lonBand * (336 / 7);
    const sample = classifySurface(lat, lon);

    states.push({
      id: i,
      bits,
      lat,
      lon,
      depthClass: depthBit ? "subsurface" : "surface",
      pressureClass: pressureBit ? "high-pressure" : "standard-pressure",
      surfaceClass: sample.className,
      region: sample.region,
      hydration: sample.hydration,
      material: sample.material,
      admissible: true
    });
  }

  return states;
}

function computeRuntimeSummary() {
  const sampleGrid = [];
  let land = 0;
  let water = 0;
  let beach = 0;
  let frozen = 0;
  let subterranean = 0;

  for (let lat = -75; lat <= 75; lat += 15) {
    for (let lon = -165; lon <= 165; lon += 15) {
      const sample = classifySurface(lat, lon);
      sampleGrid.push(sample);

      if (sample.isLand) land += 1;
      if (sample.isWater) water += 1;
      if (sample.isBeach) beach += 1;
      if (sample.isFrozen) frozen += 1;
      if (sample.isSubterraneanRelevant) subterranean += 1;
    }
  }

  const total = sampleGrid.length || 1;

  return {
    sampleCount: total,
    landRatio: Number((land / total).toFixed(3)),
    waterRatio: Number((water / total).toFixed(3)),
    beachRatio: Number((beach / total).toFixed(3)),
    frozenRatio: Number((frozen / total).toFixed(3)),
    subterraneanRatio: Number((subterranean / total).toFixed(3)),
    targetLandRatio: PLANET.exposedLandRatioTarget,
    visualPassClaimed: false
  };
}

const lattice256 = buildLattice256();

const runtimeTruth = {
  loaded: true,
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  generatedAt: new Date().toISOString(),
  planet: PLANET,
  regions: REGIONS,
  materials: MATERIALS,
  topology: TOPOLOGY,
  hydration: HYDRATION,
  lattice256,
  summary: computeRuntimeSummary(),
  classifySurface,
  sampleSurface: classifySurface,
  getSurfaceAt: classifySurface,
  getTopology: () => TOPOLOGY,
  getHydration: () => HYDRATION,
  getRegions: () => REGIONS,
  getMaterials: () => MATERIALS,
  getLattice256: () => lattice256,
  getSummary: computeRuntimeSummary
};

function publishRuntimeTruth() {
  if (typeof window === "undefined") {
    return runtimeTruth;
  }

  const status = {
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    runtimeTruthReady: true,
    exposesClassifySurface: true,
    exposesLattice256: true,
    exposesTopology: true,
    exposesHydration: true,
    summary: runtimeTruth.summary
  };

  window.__AUDRALIA_RUNTIME_TRUTH__ = runtimeTruth;
  window.__AUDRALIA_RUNTIME_STATUS__ = status;
  window.DGBAudraliaRuntime = runtimeTruth;
  window.DGBAudraliaRuntimeStatus = status;

  window.dispatchEvent(new CustomEvent("audralia:runtime-truth-ready", {
    detail: status
  }));

  return runtimeTruth;
}

publishRuntimeTruth();

export {
  RECEIPT,
  CONTRACT,
  VERSION,
  PLANET,
  REGIONS,
  MATERIALS,
  TOPOLOGY,
  HYDRATION,
  lattice256,
  classifySurface,
  computeRuntimeSummary,
  publishRuntimeTruth
};

export default runtimeTruth;
