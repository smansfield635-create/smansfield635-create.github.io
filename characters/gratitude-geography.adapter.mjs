/**
 * Task 19 read-only Gratitude geography adapter.
 *
 * This module is the sole Characters-side coordinate authority for the
 * development view of Gratitude Harbor. It consumes the admitted H-Earth /
 * Audralia geography contracts without mutating or restating their terrain
 * equations. Development anchors remain non-final until the controlling
 * continental geography program replaces them through a later admitted task.
 */

import {
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  H_EARTH_TERRAIN_FIELD
} from '../h-earth-3d/terrain/h-earth.terrain-field.js';
import {
  H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
  H_EARTH_TERRAIN_FORMATIONS
} from '../h-earth-3d/terrain/h-earth.terrain-formations.js';
import {
  AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER,
  describeAudraliaGratitudeGeographicTransfer,
  resolveAudraliaGratitudeShorelineZ,
  sampleAudraliaGratitudeTerrain
} from '../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const near = (left, right, tolerance = 1e-9) => Math.abs(left - right) <= tolerance;

export const GRATITUDE_GEOGRAPHY_ADAPTER_ID = 'CHARACTERS_GRATITUDE_GEOGRAPHY_ADAPTER_TASK19_v1';

export const GRATITUDE_GEOGRAPHY_SOURCE_BINDINGS = deepFreeze({
  governingBase: 'c2dbceb0267b124f5c34ac2fdf5245fc2015bca3',
  prototypeCoordinateSource: {
    path: 'characters/app.mjs',
    blobSha: '6f6d126cf4dbfc198ed950c917bfc1c3c44d345e',
    role: 'DEVELOPMENT_ANCHOR_SEED_NOT_FINAL_GEOGRAPHY_AUTHORITY'
  },
  terrainField: {
    path: 'h-earth-3d/terrain/h-earth.terrain-field.js',
    blobSha: 'f4f65b05ab303a11fb1d9c4e25de211fde73722a',
    contractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID
  },
  terrainFormations: {
    path: 'h-earth-3d/terrain/h-earth.terrain-formations.js',
    blobSha: '880d099ef617edb9108607d911b1750f64856486',
    contractId: H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID
  },
  geographicTransfer: {
    path: 'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',
    blobSha: 'a67a4e95f7634eb97a375ff103d95bdc81c64f0b',
    contractId: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID
  }
});

const transferDescription = describeAudraliaGratitudeGeographicTransfer();
const continentalDomain = transferDescription.continentalDomain;

export const GRATITUDE_DEVELOPMENT_FRAME = deepFreeze({
  frameId: 'CHARACTERS_GRATITUDE_HARBOR_DEVELOPMENT_FRAME_v1',
  coordinateFrame: H_EARTH_TERRAIN_FIELD.coordinateFrame,
  worldIdentity: 'AUDRALIA',
  publicWorldIdentity: 'AUDRELIA',
  continentIdentity: 'GRATITUDE',
  regionIdentity: 'GRATITUDE_HARBOR_MIRROR_MANOR_REGION',
  geographyClass: 'DEVELOPMENT_GEOGRAPHY_CONSUMER_NOT_FINAL_CONTINENTAL_AUTHORITY',
  envelope: {
    xMinimum: Math.max(continentalDomain.xMinimum, -1050),
    xMaximum: Math.min(continentalDomain.xMaximum, 1050),
    zMinimum: Math.max(continentalDomain.zMinimum, -1200),
    zMaximum: Math.min(continentalDomain.zMaximum, 280),
    seaLevelY: 0
  },
  mapFrame: {
    uMinimum: 0,
    uMaximum: 1,
    vMinimum: 0,
    vMaximum: 1,
    worldNorth: 'NEGATIVE_Z',
    worldEast: 'POSITIVE_X'
  },
  laws: [
    'ONE_WORLD_ONE_GEOGRAPHY_MULTIPLE_SCALES_OF_ACCESS',
    'LOD_CHANGES_SAMPLING_DENSITY_NOT_GEOGRAPHIC_STATE',
    'WORLD_MAP_CAMERA_LANDMARKS_AND_LOD_RESOLVE_THROUGH_THIS_ADAPTER',
    'DEVELOPMENT_ANCHORS_DO_NOT_CREATE_FINAL_CONTINENTAL_AUTHORITY'
  ]
});

const anchor = ({ id, kind, x, z, surveyOffset }) => deepFreeze({
  id,
  kind,
  developmentOnly: true,
  finalContinentalAuthorityCreated: false,
  seed: { x, z },
  surveyOffset
});

// The only Characters-side development coordinate table. No consumer may
// duplicate these x/z values; map, world, camera, landmark and LOD views must
// request the resolved anchor through this adapter.
export const GRATITUDE_DEVELOPMENT_ANCHOR_SPECS = deepFreeze({
  WATCHFIRE_OVERLOOK: anchor({ id: 'WATCHFIRE_OVERLOOK', kind: 'CARDINAL_SITE', x: -210, z: -575, surveyOffset: { x: 235, y: 112, z: 275 } }),
  WATERLINE_STATION: anchor({ id: 'WATERLINE_STATION', kind: 'CARDINAL_SITE', x: 115, z: -360, surveyOffset: { x: 185, y: 108, z: 235 } }),
  SIGNAL_LANTERN_FIELD: anchor({ id: 'SIGNAL_LANTERN_FIELD', kind: 'CARDINAL_SITE', x: 760, z: -650, surveyOffset: { x: 155, y: 121, z: 255 } }),
  RESTORATION_BOUNDARY: anchor({ id: 'RESTORATION_BOUNDARY', kind: 'CARDINAL_SITE', x: 690, z: -1010, surveyOffset: { x: 130, y: 151, z: 290 } }),
  MIRROR_MANOR: anchor({ id: 'MIRROR_MANOR', kind: 'MAJOR_PLACE_CONTEXT', x: 430, z: -820, surveyOffset: { x: 195, y: 186, z: 300 } }),
  CROSSING: anchor({ id: 'CROSSING', kind: 'MAJOR_PLACE_CONTEXT', x: -690, z: -300, surveyOffset: { x: 190, y: 150, z: 245 } }),
  CLOCK: anchor({ id: 'CLOCK', kind: 'INSTRUMENT_CONTEXT', x: 930, z: -1080, surveyOffset: { x: 135, y: 207, z: 345 } }),
  DEXTRION_TRANSMISSION: anchor({ id: 'DEXTRION_TRANSMISSION', kind: 'DISTRIBUTED_SIGNAL_CONTEXT', x: -920, z: -500, surveyOffset: { x: 200, y: 145, z: 290 } })
});

export const GRATITUDE_LOD_PROFILES = deepFreeze({
  PLANETARY: { samplingDensity: 0.125, landmarkScale: 0.18 },
  CONTINENTAL: { samplingDensity: 0.25, landmarkScale: 0.32 },
  REGIONAL: { samplingDensity: 0.5, landmarkScale: 0.62 },
  LOCAL: { samplingDensity: 1, landmarkScale: 1 }
});

const requireFinitePair = (x, z, operation) => {
  if (!finite(x) || !finite(z)) throw new TypeError(`${operation}_REQUIRES_FINITE_WORLD_X_Z`);
};

export function sampleGratitudeWorld(worldX, worldZ) {
  requireFinitePair(worldX, worldZ, 'SAMPLE_GRATITUDE_WORLD');
  const sample = sampleAudraliaGratitudeTerrain(worldX, worldZ);
  if (sample?.valid !== true) throw new RangeError('GRATITUDE_SOURCE_TERRAIN_SAMPLE_INVALID');
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    geographyAuthority: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
    source: sample
  });
}

export function resolveGratitudeShoreline(worldX) {
  if (!finite(worldX)) throw new TypeError('RESOLVE_GRATITUDE_SHORELINE_REQUIRES_FINITE_WORLD_X');
  const z = resolveAudraliaGratitudeShorelineZ(worldX);
  if (!finite(z)) throw new RangeError('GRATITUDE_SOURCE_SHORELINE_SAMPLE_INVALID');
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    geographyAuthority: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
    world: { x: worldX, y: GRATITUDE_DEVELOPMENT_FRAME.envelope.seaLevelY, z }
  });
}

export function worldToMap({ x, z }, { clampToFrame = false } = {}) {
  requireFinitePair(x, z, 'WORLD_TO_MAP');
  const envelope = GRATITUDE_DEVELOPMENT_FRAME.envelope;
  let u = (x - envelope.xMinimum) / (envelope.xMaximum - envelope.xMinimum);
  let v = (z - envelope.zMinimum) / (envelope.zMaximum - envelope.zMinimum);
  if (clampToFrame) {
    u = clamp(u, 0, 1);
    v = clamp(v, 0, 1);
  }
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    frameId: GRATITUDE_DEVELOPMENT_FRAME.frameId,
    u,
    v,
    insideFrame: u >= 0 && u <= 1 && v >= 0 && v <= 1
  });
}

export function mapToWorld({ u, v }) {
  if (!finite(u) || !finite(v)) throw new TypeError('MAP_TO_WORLD_REQUIRES_FINITE_U_V');
  const envelope = GRATITUDE_DEVELOPMENT_FRAME.envelope;
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    frameId: GRATITUDE_DEVELOPMENT_FRAME.frameId,
    x: envelope.xMinimum + u * (envelope.xMaximum - envelope.xMinimum),
    z: envelope.zMinimum + v * (envelope.zMaximum - envelope.zMinimum)
  });
}

export function resolveSiteAnchor(siteId) {
  const spec = GRATITUDE_DEVELOPMENT_ANCHOR_SPECS[siteId];
  if (!spec) throw new RangeError(`UNKNOWN_GRATITUDE_DEVELOPMENT_ANCHOR:${siteId}`);
  const terrain = sampleGratitudeWorld(spec.seed.x, spec.seed.z).source;
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    frameId: GRATITUDE_DEVELOPMENT_FRAME.frameId,
    siteId,
    kind: spec.kind,
    world: { x: spec.seed.x, y: terrain.elevation, z: spec.seed.z },
    terrain,
    developmentOnly: true,
    finalContinentalAuthorityCreated: false
  });
}

export function resolveMapSiteAnchor(siteId) {
  const site = resolveSiteAnchor(siteId);
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    siteId,
    world: site.world,
    map: worldToMap(site.world)
  });
}

export function resolveCameraSiteAnchor(siteId) {
  const site = resolveSiteAnchor(siteId);
  const offset = GRATITUDE_DEVELOPMENT_ANCHOR_SPECS[siteId].surveyOffset;
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    siteId,
    worldReference: site.world,
    look: { ...site.world },
    eye: {
      x: site.world.x + offset.x,
      y: site.world.y + offset.y,
      z: site.world.z + offset.z
    },
    pathClass: 'DESTINATION_DRIVEN_AUTHORED_CINEMATIC_SURVEY_PATH'
  });
}

export function resolveLodSiteAnchor(siteId, lod = 'LOCAL') {
  const profile = GRATITUDE_LOD_PROFILES[lod];
  if (!profile) throw new RangeError(`UNKNOWN_GRATITUDE_LOD:${lod}`);
  const site = resolveSiteAnchor(siteId);
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    siteId,
    lod,
    canonicalWorldReference: site.world,
    mapReference: worldToMap(site.world),
    samplingDensity: profile.samplingDensity,
    landmarkScale: profile.landmarkScale,
    geographicStateChanged: false
  });
}

export function resolveCoastlinePolyline({ sampleCount = 65 } = {}) {
  if (!Number.isInteger(sampleCount) || sampleCount < 2 || sampleCount > 513) throw new RangeError('COASTLINE_SAMPLE_COUNT_OUT_OF_RANGE');
  const envelope = GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const points = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const amount = index / (sampleCount - 1);
    const x = envelope.xMinimum + amount * (envelope.xMaximum - envelope.xMinimum);
    const shoreline = resolveGratitudeShoreline(x).world;
    points.push(deepFreeze({
      adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
      ordinal: index,
      world: shoreline,
      map: worldToMap(shoreline)
    }));
  }
  return deepFreeze({
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    geographyAuthority: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
    sampleCount,
    points
  });
}

export function evaluateGratitudeGeographyCorrespondence() {
  const issues = [];
  const witnesses = [];
  const sourceChecks = [
    [H_EARTH_TERRAIN_FIELD_CONTRACT_ID, 'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_6B_v1', 'TERRAIN_FIELD_CONTRACT_DRIFT'],
    [H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID, 'H_EARTH_TERRAIN_FORMATIONS_RUN_6B_v2_LATTICE_SEMANTIC_ALIGNMENT', 'TERRAIN_FORMATIONS_CONTRACT_DRIFT'],
    [AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID, 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1', 'GEOGRAPHIC_TRANSFER_CONTRACT_DRIFT']
  ];
  for (const [actual, expected, issue] of sourceChecks) if (actual !== expected) issues.push(issue);
  if (AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER.worldIdentity !== 'AUDRALIA' || AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER.continentIdentity !== 'GRATITUDE') issues.push('WORLD_OR_CONTINENT_IDENTITY_DRIFT');
  if (!Object.isFrozen(H_EARTH_TERRAIN_FORMATIONS)) issues.push('FORMATION_AUTHORITY_NOT_IMMUTABLE');

  const lodNames = Object.keys(GRATITUDE_LOD_PROFILES);
  for (const siteId of Object.keys(GRATITUDE_DEVELOPMENT_ANCHOR_SPECS)) {
    const site = resolveSiteAnchor(siteId);
    const map = resolveMapSiteAnchor(siteId);
    const recovered = mapToWorld(map.map);
    const camera = resolveCameraSiteAnchor(siteId);
    const lod = lodNames.map((lodName) => resolveLodSiteAnchor(siteId, lodName));
    if (!near(site.world.x, recovered.x) || !near(site.world.z, recovered.z)) issues.push(`MAP_WORLD_ROUND_TRIP_FAILURE:${siteId}`);
    if (!near(camera.look.x, site.world.x) || !near(camera.look.z, site.world.z)) issues.push(`CAMERA_SITE_REFERENCE_DIVERGENCE:${siteId}`);
    if (lod.some((entry) => !near(entry.canonicalWorldReference.x, site.world.x) || !near(entry.canonicalWorldReference.z, site.world.z) || entry.geographicStateChanged !== false)) issues.push(`LOD_SITE_REFERENCE_DIVERGENCE:${siteId}`);
    if (site.terrain.valid !== true || !finite(site.world.y)) issues.push(`TERRAIN_SAMPLE_INVALID:${siteId}`);
    if (site.terrain.shorelineDistance <= 0) issues.push(`DEVELOPMENT_SITE_NOT_LANDSIDE:${siteId}`);
    if (site.adapterId !== GRATITUDE_GEOGRAPHY_ADAPTER_ID || map.adapterId !== GRATITUDE_GEOGRAPHY_ADAPTER_ID || camera.adapterId !== GRATITUDE_GEOGRAPHY_ADAPTER_ID || lod.some((entry) => entry.adapterId !== GRATITUDE_GEOGRAPHY_ADAPTER_ID)) issues.push(`MULTIPLE_ADAPTER_IDENTITY:${siteId}`);
    witnesses.push(deepFreeze({ siteId, world: site.world, map: map.map, cameraLook: camera.look, lodWorldReferences: lod.map((entry) => entry.canonicalWorldReference) }));
  }

  const coastline = resolveCoastlinePolyline({ sampleCount: 65 });
  for (const point of coastline.points) {
    const recovered = mapToWorld(point.map);
    const sourceZ = resolveAudraliaGratitudeShorelineZ(point.world.x);
    if (!near(recovered.x, point.world.x) || !near(recovered.z, point.world.z)) issues.push(`COASTLINE_MAP_WORLD_ROUND_TRIP_FAILURE:${point.ordinal}`);
    if (!near(sourceZ, point.world.z)) issues.push(`COASTLINE_SOURCE_DIVERGENCE:${point.ordinal}`);
    if (point.adapterId !== GRATITUDE_GEOGRAPHY_ADAPTER_ID) issues.push(`COASTLINE_ADAPTER_IDENTITY_FAILURE:${point.ordinal}`);
  }

  return deepFreeze({
    schema: 'TASK19_GRATITUDE_GEOGRAPHY_CORRESPONDENCE_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS_PROTECTED_GRATITUDE_GEOGRAPHY_ADAPTER_CORRESPONDENCE' : 'HELD_GRATITUDE_GEOGRAPHY_ADAPTER_CORRESPONDENCE',
    eligible: issues.length === 0,
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    governingBase: GRATITUDE_GEOGRAPHY_SOURCE_BINDINGS.governingBase,
    sourceBindings: GRATITUDE_GEOGRAPHY_SOURCE_BINDINGS,
    siteWitnessCount: witnesses.length,
    coastlineWitnessCount: coastline.points.length,
    lodProfileCount: lodNames.length,
    witnesses,
    issues,
    boundaries: {
      readOnlyConsumer: true,
      finalContinentalAuthorityCreated: false,
      sharedGeographyMutated: false,
      sceneStateConstructed: false,
      structuralSceneGeometryConstructed: false,
      coastMapUiConstructed: false
    }
  });
}

export const GRATITUDE_GEOGRAPHY_ADAPTER = deepFreeze({
  adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  sourceBindings: GRATITUDE_GEOGRAPHY_SOURCE_BINDINGS,
  frame: GRATITUDE_DEVELOPMENT_FRAME,
  anchorSpecs: GRATITUDE_DEVELOPMENT_ANCHOR_SPECS,
  lodProfiles: GRATITUDE_LOD_PROFILES,
  sampleWorld: sampleGratitudeWorld,
  resolveShoreline: resolveGratitudeShoreline,
  worldToMap,
  mapToWorld,
  resolveSiteAnchor,
  resolveMapSiteAnchor,
  resolveCameraSiteAnchor,
  resolveLodSiteAnchor,
  resolveCoastlinePolyline,
  evaluateCorrespondence: evaluateGratitudeGeographyCorrespondence
});
