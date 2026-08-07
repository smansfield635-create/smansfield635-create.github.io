import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const c01 = (value) => clamp(value, 0, 1);
const mix = (left, right, amount) => left + (right - left) * amount;
const mix3 = (left, right, amount) => [
  mix(left[0], right[0], amount),
  mix(left[1], right[1], amount),
  mix(left[2], right[2], amount)
];
const smooth = (edge0, edge1, value) => {
  const t = c01((value - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
};
const norm = (value) => {
  const length = Math.hypot(value[0], value[1], value[2]) || 1;
  return [value[0] / length, value[1] / length, value[2] / length];
};
const dot = (left, right) => left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
const cross = (left, right) => [
  left[1] * right[2] - left[2] * right[1],
  left[2] * right[0] - left[0] * right[2],
  left[0] * right[1] - left[1] * right[0]
];
const sub = (left, right) => [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
const add = (left, right) => [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
const scale = (value, amount) => [value[0] * amount, value[1] * amount, value[2] * amount];
const wrap = (value) => Math.atan2(Math.sin(value), Math.cos(value));
const radians = (degrees) => degrees * Math.PI / 180;
const freeze = (value) => Object.freeze(value);

const OPERATION_ID = 'H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const CHECKPOINT = 'OW01';
const LOCK_GENERATION = 473;
const GOVERNING_HEAD = 'c50d0a06a73ed149286508a15e697d8efa254865';
const REVISION10_SOURCE = 'ad9e72adb97df7ab867af1fe20df2c29de763d28';
const PLANET_RADIUS = 6200;
const PLANET_CENTER = freeze([0, -PLANET_RADIUS, 0]);
const LOCAL_CENTER_Z = -128;
const LOCAL_DOMAIN = freeze({
  xMin: -256,
  xMax: 256,
  zMin: -320,
  zMax: 64,
  cols: 81,
  rows: 61,
  width: 512,
  depth: 384
});
const GEOMETRIC_STITCH_WIDTH = 88;
const PLANET_SUPPORT_GAP = 3.0;
const DETAIL_HANDOFF_DISTANCE = 3000;
const MAX_TARGET_ARC = PLANET_RADIUS * Math.PI * 0.90;

const PALETTE = freeze({
  sky: [0.045, 0.062, 0.090],
  haze: [0.36, 0.42, 0.44],
  ocean: [0.050, 0.245, 0.380],
  oceanDeep: [0.028, 0.125, 0.230],
  gratitudeLow: [0.29, 0.43, 0.24],
  gratitudeHigh: [0.39, 0.42, 0.31],
  gratitudeRock: [0.43, 0.41, 0.38],
  unresolvedLow: [0.25, 0.31, 0.27],
  unresolvedHigh: [0.34, 0.36, 0.33],
  beach: [0.68, 0.60, 0.44],
  wet: [0.47, 0.42, 0.32],
  meadow: [0.34, 0.45, 0.24],
  coastal: [0.28, 0.39, 0.23],
  dune: [0.46, 0.49, 0.27],
  upland: [0.31, 0.35, 0.28],
  rock: [0.40, 0.40, 0.38],
  estate: [0.41, 0.50, 0.29],
  earth: [0.35, 0.29, 0.19],
  reservoir: [0.07, 0.27, 0.35, 0.92],
  waterfall: [0.60, 0.80, 0.84, 0.97]
});

export const AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT = freeze({
  schema: 'AUDRALIA_CONTINUOUS_MULTISCALE_WORLD_MODEL_v1',
  operationId: OPERATION_ID,
  checkpoint: CHECKPOINT,
  lockGeneration: LOCK_GENERATION,
  governingHead: GOVERNING_HEAD,
  immutableMigrationSource: REVISION10_SOURCE,
  planetIdentity: 'AUDRALIA',
  hEarthClass: 'PLAYER_EXPERIENCE_ON_AUDRALIA',
  continentCount: 9,
  resolvedContinent: 'GRATITUDE',
  unresolvedContinentCount: 8,
  gratitudeNineSummitsTrack: true,
  gratitudeSummitAnchorCount: 9,
  planetRadiusAuthoringUnits: PLANET_RADIUS,
  localGratitudeWidthAuthoringUnits: LOCAL_DOMAIN.width,
  localGratitudeDepthAuthoringUnits: LOCAL_DOMAIN.depth,
  localArcScale: 'ONE_AUTHORING_UNIT_EQUALS_ONE_SURFACE_ARC_UNIT',
  authoringRegionIsWorldBoundary: false,
  continuousZoomHierarchy: freeze(['LOCAL', 'REGION', 'CONTINENT', 'PLANETARY']),
  wholePlanetMustFitViewport: false,
  trueCoastalHarborBinding: true,
  gratitudeContinentalSkeleton: 'ASYMMETRIC_COMPOUND_TANGENT_FIELD',
  primaryInlandMountainWatershedAxes: true,
  localMacroTransition: 'GEOMETRIC_STITCH_TO_SHARED_CONTINENTAL_SURFACE',
  geometricStitchWidthAuthoringUnits: GEOMETRIC_STITCH_WIDTH,
  planetaryOceanSingleSurface: true,
  localOceanOverlayConstructed: false,
  ow02DetailedContinuationConstructed: false,
  otherContinentsNarrativelyDefined: false,
  otherContinentsPlacementsCanonical: false,
  liveIntegrationAuthorized: false,
  frontPageIntegrationAuthorized: false,
  authoringPreviewOnly: true
});

function directionFromLatLon(latDeg, lonDeg) {
  const lat = radians(latDeg);
  const lon = radians(lonDeg);
  const cosine = Math.cos(lat);
  return norm([cosine * Math.cos(lon), Math.sin(lat), cosine * Math.sin(lon)]);
}

function tangentBasis(direction) {
  const normal = norm(direction);
  const reference = Math.abs(normal[1]) < 0.92 ? [0, 1, 0] : [1, 0, 0];
  const tangent = norm(cross(reference, normal));
  return { tangent, bitangent: norm(cross(normal, tangent)) };
}

function offsetDirection(center, angle, azimuth) {
  const normal = norm(center);
  const basis = tangentBasis(normal);
  const radial = add(
    scale(basis.tangent, Math.cos(azimuth)),
    scale(basis.bitangent, Math.sin(azimuth))
  );
  return norm(add(scale(normal, Math.cos(angle)), scale(radial, Math.sin(angle))));
}

function angularDistance(left, right) {
  return Math.acos(clamp(dot(left, right), -1, 1));
}

function tangentDirection(u, v) {
  const radius = Math.hypot(u, v);
  if (radius < 1e-8) return [0, 1, 0];
  const angle = radius / PLANET_RADIUS;
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  return norm([sine * u / radius, cosine, sine * v / radius]);
}

function tangentCoordinates(direction) {
  const normal = norm(direction);
  const angle = Math.acos(clamp(normal[1], -1, 1));
  if (angle < 1e-8) return { u: 0, v: 0 };
  const horizontal = Math.hypot(normal[0], normal[2]) || 1;
  const arc = angle * PLANET_RADIUS;
  return { u: arc * normal[0] / horizontal, v: arc * normal[2] / horizontal };
}

function surfacePositionFromDirection(direction, elevation = 0) {
  const radius = PLANET_RADIUS + elevation;
  return [
    PLANET_CENTER[0] + direction[0] * radius,
    PLANET_CENTER[1] + direction[1] * radius,
    PLANET_CENTER[2] + direction[2] * radius
  ];
}

function tangentPosition(u, v, elevation = 0) {
  return surfacePositionFromDirection(tangentDirection(u, v), elevation);
}

const GRATITUDE_SUMMIT_ANCHORS = freeze([
  freeze({ u: -1120, v: -940, strength: 1.00 }),
  freeze({ u: -760, v: -610, strength: 1.04 }),
  freeze({ u: -360, v: -360, strength: 1.08 }),
  freeze({ u: 40, v: -120, strength: 1.12 }),
  freeze({ u: 410, v: 120, strength: 1.16 }),
  freeze({ u: 690, v: 430, strength: 1.20 }),
  freeze({ u: 930, v: 710, strength: 1.24 }),
  freeze({ u: 730, v: 1040, strength: 1.28 }),
  freeze({ u: 310, v: 1320, strength: 1.34 })
]);

const PRIMARY_INLAND_AXES = freeze([
  freeze({
    id: 'WESTERN_WATERSHED_AXIS',
    width: 260,
    amplitude: 72,
    points: freeze([freeze({ u: -78, v: -128 }), freeze({ u: -310, v: -650 }), freeze({ u: -720, v: -1250 })])
  }),
  freeze({
    id: 'CENTRAL_DIVIDE_AXIS',
    width: 300,
    amplitude: 88,
    points: freeze([freeze({ u: -18, v: -152 }), freeze({ u: 80, v: -760 }), freeze({ u: -80, v: -1540 })])
  }),
  freeze({
    id: 'EASTERN_WATERSHED_AXIS',
    width: 250,
    amplitude: 68,
    points: freeze([freeze({ u: 52, v: -138 }), freeze({ u: 360, v: -690 }), freeze({ u: 820, v: -1230 })])
  })
]);

const UNRESOLVED_CONTINENTS = freeze([
  freeze({ id: 'CONTINENT_02', resolved: false, anchor: freeze(directionFromLatLon(28, 38)), radius: 0.30, lobes: freeze([[0, 0, 1], [0.10, 1.1, 0.65], [0.09, 4.2, 0.55]]) }),
  freeze({ id: 'CONTINENT_03', resolved: false, anchor: freeze(directionFromLatLon(-24, 72)), radius: 0.31, lobes: freeze([[0, 0, 1], [0.11, 0.4, 0.62], [0.10, 3.7, 0.56]]) }),
  freeze({ id: 'CONTINENT_04', resolved: false, anchor: freeze(directionFromLatLon(15, 119)), radius: 0.28, lobes: freeze([[0, 0, 1], [0.10, 2.3, 0.60], [0.08, 5.2, 0.52]]) }),
  freeze({ id: 'CONTINENT_05', resolved: false, anchor: freeze(directionFromLatLon(-32, 154)), radius: 0.30, lobes: freeze([[0, 0, 1], [0.10, 0.9, 0.58], [0.09, 4.7, 0.55]]) }),
  freeze({ id: 'CONTINENT_06', resolved: false, anchor: freeze(directionFromLatLon(34, -149)), radius: 0.29, lobes: freeze([[0, 0, 1], [0.10, 1.7, 0.60], [0.08, 4.4, 0.50]]) }),
  freeze({ id: 'CONTINENT_07', resolved: false, anchor: freeze(directionFromLatLon(-27, -112)), radius: 0.32, lobes: freeze([[0, 0, 1], [0.11, 2.1, 0.62], [0.09, 5.0, 0.53]]) }),
  freeze({ id: 'CONTINENT_08', resolved: false, anchor: freeze(directionFromLatLon(8, -76)), radius: 0.29, lobes: freeze([[0, 0, 1], [0.09, 0.5, 0.58], [0.09, 3.9, 0.54]]) }),
  freeze({ id: 'CONTINENT_09', resolved: false, anchor: freeze(directionFromLatLon(-42, -37)), radius: 0.27, lobes: freeze([[0, 0, 1], [0.09, 1.4, 0.55], [0.08, 4.5, 0.50]]) })
]);

function ellipseField(u, v, centerU, centerV, radiusU, radiusV, rotation = 0) {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const deltaU = u - centerU;
  const deltaV = v - centerV;
  const localU = deltaU * cosine + deltaV * sine;
  const localV = -deltaU * sine + deltaV * cosine;
  const radius = Math.hypot(localU / radiusU, localV / radiusV);
  return 1 - smooth(0.70, 1.08, radius);
}

function gratitudeCoastalBoundaryZ(u) {
  const x = clamp(u, LOCAL_DOMAIN.xMin, LOCAL_DOMAIN.xMax);
  const local = resolveHEarthMapWideShorelineZ(x);
  const macro = -58 +
    20 * Math.sin((u + 170) / 420) +
    12 * Math.sin((u - 260) / 175) +
    10 * Math.sin((u + 30) / 83);
  const blend = smooth(256, 620, Math.abs(u));
  return mix(local, macro, blend);
}

function gratitudeCoastalBoundaryV(u) {
  return gratitudeCoastalBoundaryZ(u) - LOCAL_CENTER_Z;
}

function gratitudeSkeletonField(u, v) {
  const body = Math.max(
    ellipseField(u, v, -90, -760, 1600, 1520, -0.10),
    ellipseField(u, v, -980, -520, 900, 1080, -0.34),
    ellipseField(u, v, 900, -360, 760, 1050, 0.28),
    ellipseField(u, v, -260, -1660, 1120, 760, 0.12),
    ellipseField(u, v, 520, -1260, 980, 840, -0.24)
  );
  const boundary = gratitudeCoastalBoundaryV(u);
  const coastalGate = 1 - smooth(boundary - 28, boundary + 28, v);
  const headland = Math.max(
    ellipseField(u, v, -560, 55, 430, 360, -0.25),
    ellipseField(u, v, 540, 20, 510, 390, 0.31)
  );
  const inletCut = ellipseField(u, v, 110, 110, 270, 260, -0.15) * smooth(boundary - 120, boundary + 80, v);
  return c01(Math.max(body * coastalGate, headland * coastalGate * 0.90) - inletCut * 0.22);
}

function continentField(direction, continent) {
  let field = 0;
  for (const [offsetAngle, azimuth, strength] of continent.lobes) {
    const center = offsetAngle === 0 ? continent.anchor : offsetDirection(continent.anchor, offsetAngle, azimuth);
    const angle = angularDistance(direction, center);
    const coastVariation =
      0.025 * Math.sin(direction[0] * 31 + direction[2] * 17 + azimuth * 2.3) +
      0.018 * Math.sin(direction[1] * 43 - direction[0] * 13 + azimuth);
    const outer = continent.radius * (1 + coastVariation);
    const inner = outer * 0.63;
    field = Math.max(field, (1 - smooth(inner, outer, angle)) * strength);
  }
  return c01(field);
}

function classifyPlanet(direction) {
  const uv = tangentCoordinates(direction);
  let best = freeze({ id: 'GRATITUDE', resolved: true });
  let bestField = gratitudeSkeletonField(uv.u, uv.v);
  for (const continent of UNRESOLVED_CONTINENTS) {
    const field = continentField(direction, continent);
    if (field > bestField) {
      bestField = field;
      best = continent;
    }
  }
  return {
    continent: bestField > 0.01 ? best : null,
    field: bestField,
    land: smooth(0.38, 0.56, bestField)
  };
}

function pointSegmentDistance(pointU, pointV, left, right) {
  const segmentU = right.u - left.u;
  const segmentV = right.v - left.v;
  const offsetU = pointU - left.u;
  const offsetV = pointV - left.v;
  const denominator = segmentU * segmentU + segmentV * segmentV || 1;
  const amount = clamp((offsetU * segmentU + offsetV * segmentV) / denominator, 0, 1);
  return Math.hypot(pointU - (left.u + segmentU * amount), pointV - (left.v + segmentV * amount));
}

function axisRelief(u, v) {
  let relief = 0;
  for (const axis of PRIMARY_INLAND_AXES) {
    let distance = Infinity;
    for (let index = 0; index < axis.points.length - 1; index += 1) {
      distance = Math.min(distance, pointSegmentDistance(u, v, axis.points[index], axis.points[index + 1]));
    }
    const weight = Math.exp(-Math.pow(distance / axis.width, 2) * 2.2);
    const inland = smooth(-180, -560, v);
    relief += axis.amplitude * weight * inland;
  }
  return relief;
}

function gratitudeMacroRelief(direction, field) {
  const { u, v } = tangentCoordinates(direction);
  let summit = 0;
  for (const anchor of GRATITUDE_SUMMIT_ANCHORS) {
    const deltaU = (u - anchor.u) / 360;
    const deltaV = (v - anchor.v) / 410;
    summit += Math.exp(-(deltaU * deltaU + deltaV * deltaV) * 1.55) * anchor.strength;
  }
  const broad =
    15 * Math.sin((u + v) * 0.0018) +
    10 * Math.sin(u * 0.0031 - v * 0.0021) +
    7 * Math.sin(v * 0.0044);
  const inland = smooth(80, 1500, Math.hypot(u, v));
  return field * (28 + 48 * field + summit * 70 + axisRelief(u, v) + Math.max(-12, broad) * inland);
}

function gratitudeMacroSurfaceAtUV(u, v) {
  const direction = tangentDirection(u, v);
  const field = gratitudeSkeletonField(u, v);
  const land = smooth(0.38, 0.56, field);
  const elevation = land * gratitudeMacroRelief(direction, field);
  const high = c01((elevation - 34) / 105);
  let color = mix3(PALETTE.gratitudeLow, PALETTE.gratitudeHigh, high);
  color = mix3(color, PALETTE.gratitudeRock, c01((high - 0.48) / 0.52) * 0.66);
  const coast = 1 - smooth(0.48, 0.70, field);
  color = mix3(color, PALETTE.beach, coast * 0.34 * land);
  return { direction, field, land, elevation, color };
}

function brokenSandbarLift(x, z) {
  const pieces = [
    [-145, 3, 22, 6, -0.14, 0.55],
    [-118, 6, 18, 5, -0.08, 0.42],
    [-36, 10, 21, 6, 0.04, 0.46],
    [-5, 11, 24, 7, 0.08, 0.62],
    [22, 12, 15, 5, 0.12, 0.36],
    [107, -6, 18, 5, -0.18, 0.38],
    [136, -7, 20, 6, -0.13, 0.48]
  ];
  let best = 0;
  for (const [centerX, centerZ, radiusX, radiusZ, rotation, height] of pieces) {
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const deltaX = x - centerX;
    const deltaZ = z - centerZ;
    const localX = deltaX * cosine + deltaZ * sine;
    const localZ = -deltaX * sine + deltaZ * cosine;
    const radius = Math.hypot(localX / radiusX, localZ / radiusZ);
    let weight = 1 - smooth(0.45, 1, radius);
    weight *= clamp(0.72 + 0.20 * Math.sin(localX * 0.18) + 0.10 * Math.sin(localZ * 0.31 + centerX), 0.22, 1);
    best = Math.max(best, weight * height);
  }
  return best;
}

function gratitudeDisplayElevation(terrain, x, z) {
  let elevation = terrain.presentationElevation;
  if (z < -244) {
    const ridge =
      0.9 * Math.sin((x + 46) / 31) +
      0.55 * Math.sin((x - 17) / 17) +
      0.35 * Math.sin((x + 80) / 9);
    elevation += ridge * smooth(-244, -318, z) * 3.1;
  }
  const sandbar = c01(terrain.coastline?.sandbarWeight ?? 0);
  if (sandbar > 0.01) {
    elevation = mix(elevation, HYDRO.seaLevelY + 0.18 + brokenSandbarLift(x, z), sandbar * 0.82);
  }
  return elevation;
}

function localColor(terrain, x, z) {
  const beach = c01(terrain.coastline?.beachWeight ?? 0);
  const wet = c01(terrain.coastline?.wetSandWeight ?? 0);
  const sandbar = c01(terrain.coastline?.sandbarWeight ?? 0);
  const site = c01(terrain.sitePreparation?.weight ?? 0);
  const elevation = terrain.presentationElevation;
  const high = c01((elevation - 25) / 38);
  const low = c01((28 - elevation) / 22);
  let color = PALETTE.meadow;
  color = mix3(color, PALETTE.coastal, low * 0.48);
  const distance = terrain.coastline?.distanceToShore ?? -999;
  const dune = smooth(-42, -14, distance) * (1 - smooth(-14, -2, distance));
  color = mix3(color, PALETTE.dune, dune * 0.58);
  color = mix3(color, PALETTE.beach, beach * 0.88);
  color = mix3(color, PALETTE.wet, wet * 0.58);
  color = mix3(color, PALETTE.beach, sandbar * 0.92);
  color = mix3(color, PALETTE.upland, high * 0.44);
  color = mix3(color, PALETTE.rock, high * 0.62);
  if (terrain.insideReservedEstateEnvelope) color = mix3(color, PALETTE.estate, 0.38);
  return mix3(color, PALETTE.earth, site * 0.42);
}

function localStitchWeight(x, z) {
  if (x < LOCAL_DOMAIN.xMin || x > LOCAL_DOMAIN.xMax || z < LOCAL_DOMAIN.zMin || z > LOCAL_DOMAIN.zMax) return 0;
  const edgeDistance = Math.min(
    x - LOCAL_DOMAIN.xMin,
    LOCAL_DOMAIN.xMax - x,
    z - LOCAL_DOMAIN.zMin,
    LOCAL_DOMAIN.zMax - z
  );
  return smooth(0, GEOMETRIC_STITCH_WIDTH, edgeDistance);
}

function localTerrainAlpha(terrain, x, z) {
  const shoreline = resolveHEarthMapWideShorelineZ(x);
  const land = 1 - smooth(shoreline - 0.75, shoreline + 2.75, z);
  const sandbar = c01(terrain.coastline?.sandbarWeight ?? 0);
  return c01(Math.max(land, sandbar));
}

function localSupportAtUV(u, v) {
  const x = u;
  const z = v + LOCAL_CENTER_Z;
  const stitch = localStitchWeight(x, z);
  if (stitch <= 0) return null;
  const terrain = sampleTerrain(x, z);
  if (terrain?.valid !== true) return null;
  const macro = gratitudeMacroSurfaceAtUV(u, v);
  const localElevation = gratitudeDisplayElevation(terrain, x, z);
  const stitchedElevation = mix(macro.elevation, localElevation, stitch);
  return {
    stitch,
    terrain,
    macro,
    localElevation,
    stitchedElevation,
    supportElevation: stitchedElevation - PLANET_SUPPORT_GAP * stitch
  };
}

function planetSurface(direction) {
  const classification = classifyPlanet(direction);
  const oceanVariation = 0.5 + 0.5 * Math.sin(direction[0] * 8.2 + direction[2] * 6.1 + direction[1] * 4.7);
  if (!classification.continent || classification.land < 0.01) {
    return {
      elevation: HYDRO.seaLevelY,
      color: mix3(PALETTE.oceanDeep, PALETTE.ocean, oceanVariation * 0.38),
      land: 0,
      continentId: null
    };
  }

  const unresolved = !classification.continent.resolved;
  const macroNoise =
    18 * Math.sin(direction[0] * 19 + direction[2] * 11) +
    12 * Math.sin(direction[1] * 27 - direction[0] * 8);
  let elevation;
  let color;

  if (unresolved) {
    elevation = classification.land * (28 + 38 * classification.field + Math.max(-12, macroNoise));
    const high = c01((elevation - 34) / 105);
    color = mix3(PALETTE.unresolvedLow, PALETTE.unresolvedHigh, high);
  } else {
    const uv = tangentCoordinates(direction);
    const macro = gratitudeMacroSurfaceAtUV(uv.u, uv.v);
    elevation = macro.elevation;
    color = macro.color;
    const support = localSupportAtUV(uv.u, uv.v);
    if (support) elevation = support.supportElevation;
  }

  return {
    elevation,
    color,
    land: classification.land,
    continentId: classification.continent.id
  };
}

function buildPlanetMesh() {
  const lonSegments = 144;
  const latSegments = 96;
  const vertices = [];
  const indices = [];
  const continentHits = new Set();
  let landVertices = 0;
  let gratitudeVertices = 0;

  for (let row = 0; row <= latSegments; row += 1) {
    const latitude = -Math.PI / 2 + row / latSegments * Math.PI;
    const cosLat = Math.cos(latitude);
    const sinLat = Math.sin(latitude);
    for (let column = 0; column <= lonSegments; column += 1) {
      const longitude = -Math.PI + column / lonSegments * Math.PI * 2;
      const direction = norm([cosLat * Math.cos(longitude), sinLat, cosLat * Math.sin(longitude)]);
      const surface = planetSurface(direction);
      const position = surfacePositionFromDirection(direction, surface.elevation);
      if (surface.land > 0.15 && surface.continentId) {
        continentHits.add(surface.continentId);
        landVertices += 1;
        if (surface.continentId === 'GRATITUDE') gratitudeVertices += 1;
      }
      vertices.push(
        position[0], position[1], position[2],
        direction[0], direction[1], direction[2],
        surface.color[0], surface.color[1], surface.color[2], 1
      );
    }
  }

  const indexAt = (row, column) => row * (lonSegments + 1) + column;
  for (let row = 0; row < latSegments; row += 1) {
    for (let column = 0; column < lonSegments; column += 1) {
      const a = indexAt(row, column);
      const b = indexAt(row, column + 1);
      const d = indexAt(row + 1, column);
      const e = indexAt(row + 1, column + 1);
      indices.push(a, d, b, b, d, e);
    }
  }

  return freeze({
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    statistics: freeze({
      vertexCount: vertices.length / 10,
      triangleCount: indices.length / 3,
      definedContinentCount: 1 + UNRESOLVED_CONTINENTS.length,
      sampledContinentCount: continentHits.size,
      landVertices,
      gratitudeVertices,
      unresolvedContinentCount: 8,
      gratitudeResolved: true,
      gratitudeSummitAnchorCount: GRATITUDE_SUMMIT_ANCHORS.length,
      planetRadiusAuthoringUnits: PLANET_RADIUS,
      planetBordersRectangular: false,
      closedPlanetarySurface: true,
      wholePlanetMustFitViewport: false,
      otherContinentsPlacementsCanonical: false,
      authoringPreviewOnly: true,
      trueCoastalHarborBinding: true,
      gratitudeSkeletonAsymmetric: true,
      primaryInlandMountainWatershedAxes: true,
      primaryInlandAxisCount: PRIMARY_INLAND_AXES.length,
      geometricLocalSupportConstructed: true,
      planetaryOceanSingleSurface: true,
      ow02DetailedContinuationConstructed: false
    })
  });
}

function mappedNormal(samples, row, column, columns, rows) {
  const at = (sampleRow, sampleColumn) => samples[sampleRow * columns + sampleColumn].position;
  const left = at(row, Math.max(0, column - 1));
  const right = at(row, Math.min(columns - 1, column + 1));
  const back = at(Math.max(0, row - 1), column);
  const forward = at(Math.min(rows - 1, row + 1), column);
  const across = sub(right, left);
  const along = sub(forward, back);
  const candidate = norm(cross(along, across));
  const radial = norm(sub(at(row, column), PLANET_CENTER));
  return dot(candidate, radial) >= 0 ? candidate : scale(candidate, -1);
}

function buildGratitudeDetailMesh() {
  const domain = LOCAL_DOMAIN;
  const samples = new Array(domain.cols * domain.rows);
  const vertices = [];
  const indices = [];
  let minimumElevation = Infinity;
  let maximumElevation = -Infinity;
  let beachSamples = 0;
  let transparentOceanSamples = 0;
  let maximumBoundaryElevationError = 0;

  for (let row = 0; row < domain.rows; row += 1) {
    const z = mix(domain.zMin, domain.zMax, row / (domain.rows - 1));
    for (let column = 0; column < domain.cols; column += 1) {
      const x = mix(domain.xMin, domain.xMax, column / (domain.cols - 1));
      const terrain = sampleTerrain(x, z);
      if (terrain?.valid !== true) throw new Error(`GRATITUDE_TERRAIN_SAMPLE_INVALID:${x}:${z}`);
      const u = x;
      const v = z - LOCAL_CENTER_Z;
      const macro = gratitudeMacroSurfaceAtUV(u, v);
      const stitch = localStitchWeight(x, z);
      const localElevation = gratitudeDisplayElevation(terrain, x, z);
      const displayElevation = mix(macro.elevation, localElevation, stitch);
      const color = mix3(macro.color, localColor(terrain, x, z), stitch);
      const alpha = localTerrainAlpha(terrain, x, z);
      const position = tangentPosition(u, v, displayElevation);
      const perimeter = row === 0 || column === 0 || row === domain.rows - 1 || column === domain.cols - 1;
      if (perimeter) maximumBoundaryElevationError = Math.max(maximumBoundaryElevationError, Math.abs(displayElevation - macro.elevation));
      if (alpha < 0.5) transparentOceanSamples += 1;
      if ((terrain.coastline?.beachWeight ?? 0) > 0.1) beachSamples += 1;
      minimumElevation = Math.min(minimumElevation, displayElevation);
      maximumElevation = Math.max(maximumElevation, displayElevation);
      samples[row * domain.cols + column] = {
        terrain,
        x,
        z,
        u,
        v,
        stitch,
        localElevation,
        displayElevation,
        macroElevation: macro.elevation,
        position,
        color,
        alpha
      };
    }
  }

  for (let row = 0; row < domain.rows; row += 1) {
    for (let column = 0; column < domain.cols; column += 1) {
      const sample = samples[row * domain.cols + column];
      const normal = mappedNormal(samples, row, column, domain.cols, domain.rows);
      vertices.push(
        sample.position[0], sample.position[1], sample.position[2],
        normal[0], normal[1], normal[2],
        sample.color[0], sample.color[1], sample.color[2], sample.alpha
      );
    }
  }

  const indexAt = (row, column) => row * domain.cols + column;
  for (let row = 0; row < domain.rows - 1; row += 1) {
    for (let column = 0; column < domain.cols - 1; column += 1) {
      const a = indexAt(row, column);
      const b = indexAt(row, column + 1);
      const e = indexAt(row + 1, column);
      const f = indexAt(row + 1, column + 1);
      indices.push(a, e, b, b, e, f);
    }
  }

  return freeze({
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    statistics: freeze({
      validSampleCount: samples.length,
      triangleCount: indices.length / 3,
      minimumElevation,
      maximumElevation,
      beachSampleCount: beachSamples,
      transparentOceanSampleCount: transparentOceanSamples,
      gratitudeHighResolution: true,
      revision10MigrationSourcePreserved: true,
      localWidthAuthoringUnits: domain.width,
      localDepthAuthoringUnits: domain.depth,
      localArcScaleOneToOne: true,
      localScaleCompressed: false,
      geometricStitchWidthAuthoringUnits: GEOMETRIC_STITCH_WIDTH,
      boundaryElevationMaximumError: maximumBoundaryElevationError,
      boundaryPositionConvergesToMacro: maximumBoundaryElevationError < 1e-9,
      rectangularBoundaryVisible: false,
      authoringRegionIsWorldBoundary: false,
      singleSurfaceOceanUsesPlanetaryMesh: true,
      localOceanOverlayConstructed: false,
      trueCoastalHarborBinding: true,
      liveTerrainMutation: false
    })
  });
}

function buildLocalWaterMesh() {
  const vertices = [];
  const indices = [];
  const pushMapped = (x, y, z, color) => {
    const position = tangentPosition(x, z - LOCAL_CENTER_Z, y);
    vertices.push(position[0], position[1], position[2], color[0], color[1], color[2], color[3]);
  };

  const reservoir = HYDRO.reservoir;
  const reservoirBase = 0;
  const reservoirSegments = 64;
  pushMapped(reservoir.center.x, reservoir.waterSurfaceElevation + 0.10, reservoir.center.z, PALETTE.reservoir);
  for (let index = 0; index <= reservoirSegments; index += 1) {
    const angle = index / reservoirSegments * Math.PI * 2;
    const boundary = resolveHEarthMapWideReservoirBoundaryPoint(angle);
    pushMapped(boundary.x, reservoir.waterSurfaceElevation + 0.10, boundary.z, PALETTE.reservoir);
  }
  for (let index = 0; index < reservoirSegments; index += 1) {
    indices.push(reservoirBase, reservoirBase + index + 1, reservoirBase + index + 2);
  }

  const waterfall = HYDRO.waterfall;
  const waterfallBase = vertices.length / 7;
  const waterfallSegments = 24;
  const crestTerrain = sampleTerrain(waterfall.visibleCrest.x, waterfall.visibleCrest.z);
  const top = crestTerrain?.valid
    ? gratitudeDisplayElevation(crestTerrain, waterfall.visibleCrest.x, waterfall.visibleCrest.z) + 1.6
    : reservoir.waterSurfaceElevation + 30;
  const bottom = reservoir.waterSurfaceElevation + 0.55;
  const halfWidth = waterfall.visibleWaterHalfWidth ?? 7.5;
  for (let index = 0; index <= waterfallSegments; index += 1) {
    const amount = index / waterfallSegments;
    const x = mix(waterfall.visibleCrest.x, waterfall.landing.x, amount);
    const z = mix(waterfall.visibleCrest.z, waterfall.landing.z, amount);
    const y = mix(top, bottom, amount);
    pushMapped(x - halfWidth, y, z, PALETTE.waterfall);
    pushMapped(x + halfWidth, y, z, PALETTE.waterfall);
  }
  for (let index = 0; index < waterfallSegments; index += 1) {
    const a = waterfallBase + index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }

  return freeze({
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    statistics: freeze({
      triangleCount: indices.length / 3,
      oceanTriangleCount: 0,
      reservoirTriangleCount: reservoirSegments,
      waterfallTriangleCount: waterfallSegments * 2,
      planetaryOceanSingleSurface: true,
      localOceanOverlayConstructed: false,
      curvedToPlanetSurface: true,
      authoringContextOnly: true,
      liveWaterMutation: false
    })
  });
}

function buildOW01Evidence() {
  const coastalXs = [-256, -192, -96, 0, 96, 192, 256];
  const coastalBindingSamples = coastalXs.map((x) => {
    const localShorelineZ = resolveHEarthMapWideShorelineZ(x);
    const macroBoundaryZ = gratitudeCoastalBoundaryV(x) + LOCAL_CENTER_Z;
    return freeze({
      worldX: x,
      localShorelineZ,
      macroBoundaryZ,
      error: Math.abs(localShorelineZ - macroBoundaryZ)
    });
  });
  const maximumCoastalBindingError = Math.max(...coastalBindingSamples.map((sample) => sample.error));

  const boundarySamples = [
    [-256, -320], [0, -320], [256, -320],
    [-256, -128], [256, -128],
    [-256, 64], [0, 64], [256, 64]
  ].map(([x, z]) => {
    const terrain = sampleTerrain(x, z);
    const u = x;
    const v = z - LOCAL_CENTER_Z;
    const macro = gratitudeMacroSurfaceAtUV(u, v);
    const localElevation = terrain?.valid === true ? gratitudeDisplayElevation(terrain, x, z) : macro.elevation;
    const stitch = localStitchWeight(x, z);
    const stitchedElevation = mix(macro.elevation, localElevation, stitch);
    return freeze({ x, z, stitch, macroElevation: macro.elevation, stitchedElevation, error: Math.abs(stitchedElevation - macro.elevation) });
  });
  const maximumBoundaryElevationError = Math.max(...boundarySamples.map((sample) => sample.error));

  return freeze({
    schema: 'H_EARTH_AUDRALIA_OPEN_WORLD_OW01_GEOGRAPHIC_EVIDENCE_v2',
    operationId: OPERATION_ID,
    checkpoint: CHECKPOINT,
    lockGeneration: LOCK_GENERATION,
    governingHead: GOVERNING_HEAD,
    revision10Source: REVISION10_SOURCE,
    trueCoastalHarborBinding: maximumCoastalBindingError < 1e-9,
    maximumCoastalBindingError,
    coastalBindingSampleCount: coastalBindingSamples.length,
    coastalBindingSamples: freeze(coastalBindingSamples),
    geometricStitchConstructed: true,
    geometricStitchWidthAuthoringUnits: GEOMETRIC_STITCH_WIDTH,
    maximumBoundaryElevationError,
    boundaryElevationSamples: freeze(boundarySamples),
    detailBoundaryConvergesToMacro: maximumBoundaryElevationError < 1e-9,
    planetSupportTracksLocalDetail: true,
    planetaryOceanSingleSurface: true,
    localOceanOverlayConstructed: false,
    fullScaleLocalGratitudePreserved: true,
    gratitudeSkeletonAsymmetric: true,
    gratitudeSkeletonClass: 'ASYMMETRIC_COMPOUND_TANGENT_FIELD',
    primaryInlandMountainWatershedAxes: true,
    primaryInlandAxisCount: PRIMARY_INLAND_AXES.length,
    ow02DetailedContinuationConstructed: false,
    otherEightContinentsRemainNoncanonical: true,
    liveProductMutation: false
  });
}

const TERRAIN_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aColor;
uniform mat4 uVP;
out vec3 vPos;
out vec3 vNormal;
out vec4 vColor;
void main(){vPos=aPosition;vNormal=aNormal;vColor=aColor;gl_Position=uVP*vec4(aPosition,1.0);}`;

const TERRAIN_FS = `#version 300 es
precision highp float;
in vec3 vPos;
in vec3 vNormal;
in vec4 vColor;
uniform vec3 uEye;
uniform vec3 uHaze;
uniform float uFogStart;
uniform float uFogEnd;
uniform float uAlphaCutoff;
out vec4 outColor;
void main(){
  if(vColor.a<uAlphaCutoff) discard;
  vec3 n=normalize(vNormal);
  vec3 light=normalize(vec3(.42,.78,.46));
  float d=max(dot(n,light),0.0);
  float hemi=.62+.38*clamp(n.y*.5+.5,0.0,1.0);
  vec3 c=vColor.rgb*(.50+.62*d)*hemi;
  float dist=length(vPos-uEye);
  float fog=clamp((dist-uFogStart)/max(1.0,uFogEnd-uFogStart),0.0,.68);
  outColor=vec4(mix(c,uHaze,fog),1.0);
}`;

const WATER_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec4 aColor;
uniform mat4 uVP;
out vec4 vColor;
void main(){gl_Position=uVP*vec4(aPosition,1.0);vColor=aColor;}`;

const WATER_FS = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 outColor;
void main(){outColor=vColor;}`;

function shader(gl, type, source) {
  const handle = gl.createShader(type);
  gl.shaderSource(handle, source);
  gl.compileShader(handle);
  if (!gl.getShaderParameter(handle, gl.COMPILE_STATUS)) {
    throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(handle)}`);
  }
  return handle;
}

function program(gl, vertexSource, fragmentSource) {
  const handle = gl.createProgram();
  gl.attachShader(handle, shader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(handle, shader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(handle);
  if (!gl.getProgramParameter(handle, gl.LINK_STATUS)) {
    throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(handle)}`);
  }
  return handle;
}

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const inverse = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * inverse, -1,
    0, 0, 2 * far * near * inverse, 0
  ]);
}

function lookAt(eye, target, up) {
  const z = norm(sub(eye, target));
  let x = cross(up, z);
  if (Math.hypot(...x) < 1e-5) x = [1, 0, 0];
  x = norm(x);
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
}

function multiply(left, right) {
  const output = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      output[column * 4 + row] =
        left[row] * right[column * 4] +
        left[4 + row] * right[column * 4 + 1] +
        left[8 + row] * right[column * 4 + 2] +
        left[12 + row] * right[column * 4 + 3];
    }
  }
  return output;
}

function terrainBuffers(gl, mesh) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
  const stride = 10 * 4;
  for (const [location, size, offset] of [[0, 3, 0], [1, 3, 12], [2, 4, 24]]) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  }
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  return { vao };
}

function waterBuffers(gl, mesh) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
  const stride = 7 * 4;
  for (const [location, size, offset] of [[0, 3, 0], [1, 4, 12]]) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  }
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  return { vao };
}

export function createMapWideEnvironmentRenderer(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');

  const terrainProgram = program(gl, TERRAIN_VS, TERRAIN_FS);
  const waterProgram = program(gl, WATER_VS, WATER_FS);
  const planetMesh = buildPlanetMesh();
  const gratitudeMesh = buildGratitudeDetailMesh();
  const waterMesh = buildLocalWaterMesh();
  const planetBuffers = terrainBuffers(gl, planetMesh);
  const gratitudeBuffers = terrainBuffers(gl, gratitudeMesh);
  const localWaterBuffers = waterBuffers(gl, waterMesh);
  const ow01Evidence = buildOW01Evidence();
  const state = {
    yaw: -0.62,
    pitch: 0.88,
    distance: 720,
    targetU: 0,
    targetV: -4,
    renderedFrames: 0
  };

  function resize() {
    const pixelRatio = Math.min(1.35, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
    const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
  }

  function limitTarget() {
    const radius = Math.hypot(state.targetU, state.targetV);
    if (radius > MAX_TARGET_ARC) {
      const amount = MAX_TARGET_ARC / radius;
      state.targetU *= amount;
      state.targetV *= amount;
    }
  }

  function targetGroundElevation() {
    const x = state.targetU;
    const z = state.targetV + LOCAL_CENTER_Z;
    if (x >= LOCAL_DOMAIN.xMin && x <= LOCAL_DOMAIN.xMax && z >= LOCAL_DOMAIN.zMin && z <= LOCAL_DOMAIN.zMax) {
      const terrain = sampleTerrain(x, z);
      if (terrain?.valid === true) {
        const macro = gratitudeMacroSurfaceAtUV(state.targetU, state.targetV);
        return mix(macro.elevation, gratitudeDisplayElevation(terrain, x, z), localStitchWeight(x, z));
      }
    }
    return planetSurface(tangentDirection(state.targetU, state.targetV)).elevation;
  }

  function camera() {
    state.pitch = clamp(state.pitch, 0.46, 1.49);
    state.distance = clamp(state.distance, 95, 5600);
    limitTarget();
    const direction = tangentDirection(state.targetU, state.targetV);
    const ground = targetGroundElevation();
    const target = surfacePositionFromDirection(direction, ground);
    const pU1 = tangentPosition(state.targetU + 1, state.targetV, 0);
    const pU0 = tangentPosition(state.targetU - 1, state.targetV, 0);
    const pV1 = tangentPosition(state.targetU, state.targetV + 1, 0);
    const pV0 = tangentPosition(state.targetU, state.targetV - 1, 0);
    const eU = norm(sub(pU1, pU0));
    const eV = norm(sub(pV1, pV0));
    const horizontal = norm(add(scale(eU, Math.sin(state.yaw)), scale(eV, Math.cos(state.yaw))));
    const eye = add(
      add(target, scale(direction, state.distance * Math.sin(state.pitch) + 18)),
      scale(horizontal, state.distance * Math.cos(state.pitch))
    );
    return { eye, target, up: direction };
  }

  function viewScale() {
    if (state.distance < 900) return 'LOCAL';
    if (state.distance < 2200) return 'REGION';
    if (state.distance < 4200) return 'CONTINENT';
    return 'PLANETARY';
  }

  function detailVisible() {
    return state.distance < DETAIL_HANDOFF_DISTANCE;
  }

  function viewProjection(cam) {
    const projection = perspective(Math.PI / 3, canvas.width / canvas.height, 2, PLANET_RADIUS * 4.5);
    return multiply(projection, lookAt(cam.eye, cam.target, cam.up));
  }

  function drawTerrain(mesh, buffers, cam, fogStart, fogEnd, alphaCutoff = 0.01) {
    const vp = viewProjection(cam);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    gl.useProgram(terrainProgram);
    gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram, 'uVP'), false, vp);
    gl.uniform3fv(gl.getUniformLocation(terrainProgram, 'uEye'), cam.eye);
    gl.uniform3fv(gl.getUniformLocation(terrainProgram, 'uHaze'), PALETTE.haze);
    gl.uniform1f(gl.getUniformLocation(terrainProgram, 'uFogStart'), fogStart);
    gl.uniform1f(gl.getUniformLocation(terrainProgram, 'uFogEnd'), fogEnd);
    gl.uniform1f(gl.getUniformLocation(terrainProgram, 'uAlphaCutoff'), alphaCutoff);
    gl.bindVertexArray(buffers.vao);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);
    return vp;
  }

  function drawLocalWater(vp) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.useProgram(waterProgram);
    gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram, 'uVP'), false, vp);
    gl.bindVertexArray(localWaterBuffers.vao);
    gl.drawElements(gl.TRIANGLES, waterMesh.indices.length, gl.UNSIGNED_INT, 0);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }

  function render() {
    resize();
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(...PALETTE.sky, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const cam = camera();
    const vp = drawTerrain(planetMesh, planetBuffers, cam, 3600, 11800, 0.01);
    if (detailVisible()) {
      drawTerrain(gratitudeMesh, gratitudeBuffers, cam, 900, 4400, 0.45);
      drawLocalWater(vp);
    }
    state.renderedFrames += 1;
  }

  function orbit(deltaX, deltaY) {
    state.yaw = wrap(state.yaw + clamp(Number(deltaX) || 0, -64, 64) * 0.0052);
    state.pitch = clamp(state.pitch + clamp(Number(deltaY) || 0, -64, 64) * 0.0032, 0.46, 1.49);
    render();
  }

  function zoom(delta) {
    state.distance = clamp(state.distance * Math.exp(clamp(Number(delta) || 0, -900, 900) * 0.00115), 95, 5600);
    render();
  }

  function zoomByFactor(factor) {
    const bounded = clamp(Number(factor) || 1, 0.72, 1.38);
    state.distance = clamp(state.distance / bounded, 95, 5600);
    render();
  }

  function pan(deltaU, deltaV) {
    state.targetU += Number(deltaU) || 0;
    state.targetV += Number(deltaV) || 0;
    limitTarget();
    render();
  }

  function panScreen(deltaX, deltaY) {
    const amount = clamp(state.distance * 0.0021, 0.28, 12);
    const rightX = Math.cos(state.yaw);
    const rightZ = -Math.sin(state.yaw);
    const forwardX = Math.sin(state.yaw);
    const forwardZ = Math.cos(state.yaw);
    pan(
      (-deltaX * rightX + deltaY * forwardX) * amount,
      (-deltaX * rightZ + deltaY * forwardZ) * amount
    );
  }

  function focusGratitude() {
    Object.assign(state, { yaw: -0.62, pitch: 0.88, distance: 720, targetU: 0, targetV: -4 });
    render();
  }

  function planetaryVantage() {
    state.distance = 5000;
    state.pitch = 1.02;
    render();
  }

  function fitWorld() {
    focusGratitude();
  }

  function getCameraSafety() {
    const fullPlanetFitDistance = PLANET_RADIUS / Math.sin((Math.PI / 3) / 2) - PLANET_RADIUS;
    return freeze({
      distanceSafe: state.distance >= 95 && state.distance <= 5600,
      targetArcSafe: Math.hypot(state.targetU, state.targetV) <= MAX_TARGET_ARC + 1,
      continuousScaleRecognized: ['LOCAL', 'REGION', 'CONTINENT', 'PLANETARY'].includes(viewScale()),
      wholePlanetFitNotRequired: state.distance < fullPlanetFitDistance,
      planetHasNoRectangularBorder: planetMesh.statistics.planetBordersRectangular === false,
      nineContinentsDefined: planetMesh.statistics.definedContinentCount === 9,
      localScaleNotCompressed: gratitudeMesh.statistics.localScaleCompressed === false,
      localMacroBoundaryConverges: gratitudeMesh.statistics.boundaryPositionConvergesToMacro === true,
      singleSurfaceOcean: waterMesh.statistics.planetaryOceanSingleSurface === true,
      liveMutationAbsent: true
    });
  }

  return freeze({
    planetMesh,
    gratitudeMesh,
    waterMesh,
    state,
    render,
    orbit,
    zoom,
    zoomByFactor,
    pan,
    panScreen,
    fitWorld,
    focusGratitude,
    planetaryVantage,
    getViewScale: viewScale,
    getCameraSafety,
    getOW01GeographicEvidence: () => ow01Evidence,
    getSnapshot: () => freeze({
      ...state,
      viewScale: viewScale(),
      detailVisible: detailVisible(),
      planetStatistics: planetMesh.statistics,
      gratitudeStatistics: gratitudeMesh.statistics,
      waterStatistics: waterMesh.statistics,
      worldContract: AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT,
      ow01Evidence,
      authoringRegionIsWorldBoundary: false,
      wholePlanetMustFitViewport: false,
      manorGeometryConstructed: false,
      liveRuntimeMutated: false,
      liveCameraMutated: false,
      liveNavigationMutated: false,
      liveWaterMutated: false
    })
  });
}

export default createMapWideEnvironmentRenderer;
