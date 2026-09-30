/**
 * Task 19 structural cardinal-site geometry.
 *
 * This module constructs repository-native triangle meshes for the four
 * admitted Gratitude Harbor cardinal sites. Geometry is local to each site;
 * the canonical world placement is always resolved through the read-only
 * Gratitude geography adapter. LOD changes realization density and retained
 * structural detail, never the geographic state or site identity.
 */

import {
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  GRATITUDE_LOD_PROFILES,
  resolveLodSiteAnchor,
  resolveSiteAnchor
} from './gratitude-geography.adapter.mjs';
import {
  CARDINAL_PRESENCE_STATES,
  CARDINAL_SITE_IDS
} from './cardinal-scene-state.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const rounded = (value) => Math.round(value * 1e9) / 1e9;

export const CARDINAL_SCENE_GEOMETRY_CONTRACT_ID = 'CHARACTERS_TASK19_CARDINAL_SCENE_GEOMETRY_v1';
export const CARDINAL_SCENE_LODS = deepFreeze(['PLANETARY', 'CONTINENTAL', 'REGIONAL', 'LOCAL']);

export const CARDINAL_SITE_GEOMETRY_AUTHORITY = deepFreeze({
  WATCHFIRE_OVERLOOK: {
    characterId: 'ALARIC_AXION',
    landmarkId: 'WATCHFIRE_AND_ROUTE_TABLE',
    landmarkComponentIds: ['ALARIC_WATCHFIRE', 'ALARIC_ROUTE_TABLE'],
    geometryFamily: 'ELEVATED_ORIENTATION_OVERLOOK',
    silhouetteClass: 'HORIZONTAL_CROWN_TWIN_THRESHOLD_AND_WATCHFIRE',
    approachAzimuths: [18, 112, 208, 302]
  },
  WATERLINE_STATION: {
    characterId: 'TARIAN_MERROW',
    landmarkId: 'LOAD_BRIDGE_AND_RECOVERY_BASIN',
    landmarkComponentIds: ['TARIAN_LOAD_BRIDGE_DECK', 'TARIAN_RECOVERY_BASIN'],
    geometryFamily: 'WORKING_WATERLINE_LOAD_STATION',
    silhouetteClass: 'LONG_SPAN_TRUSS_BASIN_AND_TIDE_STAFFS',
    approachAzimuths: [42, 138, 224, 318]
  },
  SIGNAL_LANTERN_FIELD: {
    characterId: 'ELARA_SYLENE',
    landmarkId: 'LANTERN_ARRAY_AND_LISTENING_PAVILION',
    landmarkComponentIds: ['ELARA_PRIMARY_LANTERN', 'ELARA_SECONDARY_LANTERN', 'ELARA_LISTENING_PAVILION'],
    geometryFamily: 'DISTRIBUTED_SIGNAL_AND_LISTENING_FIELD',
    silhouetteClass: 'ASYMMETRIC_TOWER_ARRAY_AND_OPEN_PAVILION',
    approachAzimuths: [8, 96, 194, 286]
  },
  RESTORATION_BOUNDARY: {
    characterId: 'SOREN_SEVRIN',
    landmarkId: 'RESTORED_CAUSEWAY_AND_RETURN_LOCK',
    landmarkComponentIds: ['SOREN_CAUSEWAY_WEST', 'SOREN_CAUSEWAY_EAST', 'SOREN_RETURN_LOCK_WEST', 'SOREN_RETURN_LOCK_EAST'],
    geometryFamily: 'REBUILT_CAUSEWAY_TEST_BOUNDARY',
    silhouetteClass: 'BROKEN_LINEAR_CAUSEWAY_LOCK_AND_TEST_FRAME',
    approachAzimuths: [34, 126, 216, 310]
  }
});

export const CARDINAL_GEOMETRY_MATERIALS = deepFreeze({
  WEATHERED_STONE: { baseColor: [0.33, 0.34, 0.32], roughness: 0.91, metalness: 0.02, emissiveStrength: 0 },
  ROUTE_BRASS: { baseColor: [0.49, 0.36, 0.18], roughness: 0.58, metalness: 0.62, emissiveStrength: 0 },
  WATCHFIRE: { baseColor: [0.82, 0.34, 0.08], roughness: 0.42, metalness: 0.08, emissiveStrength: 1.4 },
  HARBOR_TIMBER: { baseColor: [0.24, 0.18, 0.12], roughness: 0.88, metalness: 0, emissiveStrength: 0 },
  TIDE_IRON: { baseColor: [0.18, 0.25, 0.27], roughness: 0.67, metalness: 0.55, emissiveStrength: 0 },
  BASIN_STONE: { baseColor: [0.3, 0.38, 0.39], roughness: 0.84, metalness: 0.04, emissiveStrength: 0 },
  SIGNAL_CERAMIC: { baseColor: [0.62, 0.57, 0.43], roughness: 0.72, metalness: 0.03, emissiveStrength: 0 },
  SIGNAL_GLASS: { baseColor: [0.26, 0.49, 0.53], roughness: 0.24, metalness: 0.08, emissiveStrength: 0.82 },
  RESTORATION_MASONRY: { baseColor: [0.4, 0.38, 0.34], roughness: 0.86, metalness: 0.02, emissiveStrength: 0 },
  TEST_FRAME_STEEL: { baseColor: [0.22, 0.24, 0.23], roughness: 0.53, metalness: 0.68, emissiveStrength: 0 }
});

const boundsFromPositions = (positions) => {
  const minimum = [Infinity, Infinity, Infinity];
  const maximum = [-Infinity, -Infinity, -Infinity];
  for (let index = 0; index < positions.length; index += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      minimum[axis] = Math.min(minimum[axis], positions[index + axis]);
      maximum[axis] = Math.max(maximum[axis], positions[index + axis]);
    }
  }
  return {
    minimum: { x: rounded(minimum[0]), y: rounded(minimum[1]), z: rounded(minimum[2]) },
    maximum: { x: rounded(maximum[0]), y: rounded(maximum[1]), z: rounded(maximum[2]) },
    span: {
      x: rounded(maximum[0] - minimum[0]),
      y: rounded(maximum[1] - minimum[1]),
      z: rounded(maximum[2] - minimum[2])
    }
  };
};

const rotateY = ([x, y, z], yawDegrees) => {
  const angle = yawDegrees * Math.PI / 180;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [rounded(x * cosine - z * sine), rounded(y), rounded(x * sine + z * cosine)];
};

const translated = (point, center) => [
  rounded(point[0] + center[0]),
  rounded(point[1] + center[1]),
  rounded(point[2] + center[2])
];

const meshRecord = ({ id, semanticRole, materialId, occlusionRole, positions, normals, indices, sourceShape }) => deepFreeze({
  meshId: id,
  primitiveType: 'TRIANGLE_MESH',
  sourceShape,
  semanticRole,
  materialId,
  lightingResponse: {
    model: 'NORMAL_DRIVEN_LAMBERTIAN_WITH_MATERIAL_RESPONSE',
    ...CARDINAL_GEOMETRY_MATERIALS[materialId]
  },
  occlusionRole,
  closedVolume: true,
  billboard: false,
  positions,
  normals,
  indices,
  vertexCount: positions.length / 3,
  triangleCount: indices.length / 3,
  bounds: boundsFromPositions(positions)
});

const boxMesh = ({ id, center, size, yaw = 0, semanticRole, materialId, occlusionRole = 'PRIMARY_MASS' }) => {
  const [halfX, halfY, halfZ] = size.map((value) => value / 2);
  const faces = [
    { normal: [1, 0, 0], corners: [[halfX, -halfY, -halfZ], [halfX, halfY, -halfZ], [halfX, halfY, halfZ], [halfX, -halfY, halfZ]] },
    { normal: [-1, 0, 0], corners: [[-halfX, -halfY, halfZ], [-halfX, halfY, halfZ], [-halfX, halfY, -halfZ], [-halfX, -halfY, -halfZ]] },
    { normal: [0, 1, 0], corners: [[-halfX, halfY, -halfZ], [-halfX, halfY, halfZ], [halfX, halfY, halfZ], [halfX, halfY, -halfZ]] },
    { normal: [0, -1, 0], corners: [[-halfX, -halfY, halfZ], [-halfX, -halfY, -halfZ], [halfX, -halfY, -halfZ], [halfX, -halfY, halfZ]] },
    { normal: [0, 0, 1], corners: [[halfX, -halfY, halfZ], [halfX, halfY, halfZ], [-halfX, halfY, halfZ], [-halfX, -halfY, halfZ]] },
    { normal: [0, 0, -1], corners: [[-halfX, -halfY, -halfZ], [-halfX, halfY, -halfZ], [halfX, halfY, -halfZ], [halfX, -halfY, -halfZ]] }
  ];
  const positions = [];
  const normals = [];
  const indices = [];
  for (const face of faces) {
    const offset = positions.length / 3;
    const normal = rotateY(face.normal, yaw);
    for (const corner of face.corners) {
      positions.push(...translated(rotateY(corner, yaw), center));
      normals.push(...normal);
    }
    indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
  }
  return meshRecord({ id, semanticRole, materialId, occlusionRole, positions, normals, indices, sourceShape: 'ORIENTED_BOX_VOLUME' });
};

const cylinderMesh = ({ id, center, radius, height, segments, semanticRole, materialId, occlusionRole = 'VERTICAL_INTERRUPT' }) => {
  const positions = [];
  const normals = [];
  const indices = [];
  const half = height / 2;
  for (let segment = 0; segment < segments; segment += 1) {
    const start = segment * Math.PI * 2 / segments;
    const end = (segment + 1) * Math.PI * 2 / segments;
    const x0 = Math.cos(start) * radius;
    const z0 = Math.sin(start) * radius;
    const x1 = Math.cos(end) * radius;
    const z1 = Math.sin(end) * radius;
    const offset = positions.length / 3;
    positions.push(
      ...translated([x0, -half, z0], center), ...translated([x0, half, z0], center),
      ...translated([x1, half, z1], center), ...translated([x1, -half, z1], center)
    );
    normals.push(Math.cos(start), 0, Math.sin(start), Math.cos(start), 0, Math.sin(start), Math.cos(end), 0, Math.sin(end), Math.cos(end), 0, Math.sin(end));
    indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);

    const capOffset = positions.length / 3;
    positions.push(...translated([0, half, 0], center), ...translated([x0, half, z0], center), ...translated([x1, half, z1], center));
    normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
    indices.push(capOffset, capOffset + 1, capOffset + 2);

    const bottomOffset = positions.length / 3;
    positions.push(...translated([0, -half, 0], center), ...translated([x1, -half, z1], center), ...translated([x0, -half, z0], center));
    normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
    indices.push(bottomOffset, bottomOffset + 1, bottomOffset + 2);
  }
  return meshRecord({ id, semanticRole, materialId, occlusionRole, positions, normals, indices, sourceShape: 'CLOSED_CYLINDER_VOLUME' });
};

const annularMesh = ({ id, center, innerRadius, outerRadius, height, segments, semanticRole, materialId, occlusionRole = 'APERTURE_FRAME' }) => {
  const positions = [];
  const normals = [];
  const indices = [];
  const half = height / 2;
  for (let segment = 0; segment < segments; segment += 1) {
    const start = segment * Math.PI * 2 / segments;
    const end = (segment + 1) * Math.PI * 2 / segments;
    const unit0 = [Math.cos(start), Math.sin(start)];
    const unit1 = [Math.cos(end), Math.sin(end)];
    const outer0 = [unit0[0] * outerRadius, unit0[1] * outerRadius];
    const outer1 = [unit1[0] * outerRadius, unit1[1] * outerRadius];
    const inner0 = [unit0[0] * innerRadius, unit0[1] * innerRadius];
    const inner1 = [unit1[0] * innerRadius, unit1[1] * innerRadius];
    const quads = [
      { points: [[outer0[0], -half, outer0[1]], [outer0[0], half, outer0[1]], [outer1[0], half, outer1[1]], [outer1[0], -half, outer1[1]]], normals: [[unit0[0], 0, unit0[1]], [unit0[0], 0, unit0[1]], [unit1[0], 0, unit1[1]], [unit1[0], 0, unit1[1]]] },
      { points: [[inner1[0], -half, inner1[1]], [inner1[0], half, inner1[1]], [inner0[0], half, inner0[1]], [inner0[0], -half, inner0[1]]], normals: [[-unit1[0], 0, -unit1[1]], [-unit1[0], 0, -unit1[1]], [-unit0[0], 0, -unit0[1]], [-unit0[0], 0, -unit0[1]]] },
      { points: [[inner0[0], half, inner0[1]], [inner1[0], half, inner1[1]], [outer1[0], half, outer1[1]], [outer0[0], half, outer0[1]]], normals: [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]] },
      { points: [[inner1[0], -half, inner1[1]], [inner0[0], -half, inner0[1]], [outer0[0], -half, outer0[1]], [outer1[0], -half, outer1[1]]], normals: [[0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0]] }
    ];
    for (const quad of quads) {
      const offset = positions.length / 3;
      for (const point of quad.points) positions.push(...translated(point, center));
      for (const normal of quad.normals) normals.push(...normal.map(rounded));
      indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
    }
  }
  return meshRecord({ id, semanticRole, materialId, occlusionRole, positions, normals, indices, sourceShape: 'CLOSED_ANNULAR_PRISM_VOLUME' });
};

const component = (id, tier, mesh) => deepFreeze({ componentId: id, detailTier: tier, mesh });
const box = (id, tier, spec) => component(id, tier, boxMesh({ id, ...spec }));
const cylinder = (id, tier, spec, segments) => component(id, tier, cylinderMesh({ id, ...spec, segments }));
const annulus = (id, tier, spec, segments) => component(id, tier, annularMesh({ id, ...spec, segments }));

const segmentCount = (lod) => ({ PLANETARY: 6, CONTINENTAL: 8, REGIONAL: 12, LOCAL: 20 })[lod];
const tierForLod = (lod) => CARDINAL_SCENE_LODS.indexOf(lod);

const buildWatchfireOverlook = (lod) => {
  const segments = segmentCount(lod);
  return [
    box('ALARIC_OVERLOOK_CROWN', 0, { center: [0, 2, 0], size: [38, 4, 28], yaw: -8, semanticRole: 'ELEVATED_BOUNDARY_OVERLOOK', materialId: 'WEATHERED_STONE', occlusionRole: 'PRIMARY_MASS' }),
    cylinder('ALARIC_ROUTE_TABLE', 0, { center: [0, 6.2, 0], radius: 6.2, height: 4.4, semanticRole: 'ROUTE_AUTHORITY_TABLE', materialId: 'ROUTE_BRASS', occlusionRole: 'LANDMARK_CORE' }, segments),
    cylinder('ALARIC_WATCHFIRE', 0, { center: [-12, 8.5, -5], radius: 2.5, height: 13, semanticRole: 'WATCHFIRE_SIGNAL', materialId: 'WATCHFIRE', occlusionRole: 'VERTICAL_SIGNAL' }, segments),
    box('ALARIC_THRESHOLD_WEST', 1, { center: [-14, 8, 11], size: [4, 16, 5], yaw: -8, semanticRole: 'THRESHOLD_GATE_WEST', materialId: 'WEATHERED_STONE', occlusionRole: 'APPROACH_OCCLUDER' }),
    box('ALARIC_THRESHOLD_EAST', 1, { center: [14, 8, 11], size: [4, 16, 5], yaw: -8, semanticRole: 'THRESHOLD_GATE_EAST', materialId: 'WEATHERED_STONE', occlusionRole: 'APPROACH_OCCLUDER' }),
    box('ALARIC_THRESHOLD_LINTEL', 1, { center: [0, 15, 11], size: [25, 3, 4], yaw: -8, semanticRole: 'BOUNDARY_LINTEL', materialId: 'WEATHERED_STONE', occlusionRole: 'SKYLINE_FRAME' }),
    box('ALARIC_ROUTE_NORTH_SOUTH', 2, { center: [0, 8.7, 0], size: [1.1, 0.8, 22], semanticRole: 'FOUR_WAY_ROUTE_AXIS', materialId: 'ROUTE_BRASS', occlusionRole: 'SURFACE_RELIEF' }),
    box('ALARIC_ROUTE_EAST_WEST', 2, { center: [0, 8.7, 0], size: [22, 0.8, 1.1], semanticRole: 'FOUR_WAY_ROUTE_AXIS', materialId: 'ROUTE_BRASS', occlusionRole: 'SURFACE_RELIEF' }),
    box('ALARIC_UNDERFRAME_WEST', 2, { center: [-10, -2, 0], size: [4, 8, 22], yaw: -8, semanticRole: 'UNDERFRAME_SUPPORT', materialId: 'WEATHERED_STONE', occlusionRole: 'UNDERCUT_DEPTH' }),
    box('ALARIC_UNDERFRAME_EAST', 2, { center: [10, -2, 0], size: [4, 8, 22], yaw: -8, semanticRole: 'UNDERFRAME_SUPPORT', materialId: 'WEATHERED_STONE', occlusionRole: 'UNDERCUT_DEPTH' }),
    box('ALARIC_APPROACH_STEP_LOW', 3, { center: [0, 0, 19], size: [24, 2, 7], yaw: -8, semanticRole: 'LAWFUL_APPROACH_STEP', materialId: 'WEATHERED_STONE', occlusionRole: 'FOREGROUND_LAYER' }),
    box('ALARIC_APPROACH_STEP_HIGH', 3, { center: [0, 1.2, 14.5], size: [28, 2.4, 5], yaw: -8, semanticRole: 'LAWFUL_APPROACH_STEP', materialId: 'WEATHERED_STONE', occlusionRole: 'FOREGROUND_LAYER' }),
    cylinder('ALARIC_HELD_MARKER', 3, { center: [10, 6.5, -8], radius: 1.4, height: 9, semanticRole: 'HELD_ROUTE_MARKER', materialId: 'ROUTE_BRASS', occlusionRole: 'LOCAL_INTERRUPT' }, segments)
  ];
};

const buildWaterlineStation = (lod) => {
  const segments = segmentCount(lod);
  return [
    box('TARIAN_LOAD_BRIDGE_DECK', 0, { center: [0, 5, 0], size: [48, 4, 11], yaw: 6, semanticRole: 'LOAD_BEARING_CROSSING', materialId: 'HARBOR_TIMBER', occlusionRole: 'PRIMARY_SPAN' }),
    annulus('TARIAN_RECOVERY_BASIN', 0, { center: [-15, 2.5, 16], innerRadius: 6, outerRadius: 11, height: 5, semanticRole: 'RECOVERY_BASIN', materialId: 'BASIN_STONE', occlusionRole: 'OPEN_BASIN_DEPTH' }, segments),
    cylinder('TARIAN_TIDE_STAFF_HIGH', 0, { center: [19, 9, -5], radius: 1.2, height: 18, semanticRole: 'TIDE_MEASUREMENT_STAFF', materialId: 'TIDE_IRON', occlusionRole: 'VERTICAL_GAUGE' }, segments),
    box('TARIAN_BRIDGE_PIER_WEST', 1, { center: [-17, 0, 0], size: [5, 10, 9], yaw: 6, semanticRole: 'SUBMERGED_LOAD_PIER', materialId: 'BASIN_STONE', occlusionRole: 'SUBSTRUCTURE' }),
    box('TARIAN_BRIDGE_PIER_EAST', 1, { center: [17, 0, 0], size: [5, 10, 9], yaw: 6, semanticRole: 'SUBMERGED_LOAD_PIER', materialId: 'BASIN_STONE', occlusionRole: 'SUBSTRUCTURE' }),
    box('TARIAN_FLOW_GATE', 1, { center: [-15, 7, 4], size: [16, 8, 2], yaw: -12, semanticRole: 'FLOW_GATE', materialId: 'TIDE_IRON', occlusionRole: 'CHANNEL_OCCLUDER' }),
    box('TARIAN_TRUSS_NORTH', 2, { center: [0, 11, -5], size: [44, 2, 2], yaw: 6, semanticRole: 'LOAD_TRUSS', materialId: 'TIDE_IRON', occlusionRole: 'SKYLINE_SPAN' }),
    box('TARIAN_TRUSS_SOUTH', 2, { center: [0, 11, 5], size: [44, 2, 2], yaw: 6, semanticRole: 'LOAD_TRUSS', materialId: 'TIDE_IRON', occlusionRole: 'SKYLINE_SPAN' }),
    box('TARIAN_CHANNEL_WEST', 2, { center: [-20, 0.5, 13], size: [24, 3, 5], yaw: -28, semanticRole: 'CONNECTED_WATER_CHANNEL_EDGE', materialId: 'BASIN_STONE', occlusionRole: 'WATERLINE_EDGE' }),
    box('TARIAN_CHANNEL_EAST', 2, { center: [2, 0.5, 16], size: [22, 3, 5], yaw: 18, semanticRole: 'CONNECTED_WATER_CHANNEL_EDGE', materialId: 'BASIN_STONE', occlusionRole: 'WATERLINE_EDGE' }),
    cylinder('TARIAN_TIDE_STAFF_LOW', 3, { center: [11, 6.5, 8], radius: 0.8, height: 13, semanticRole: 'TIDE_MEASUREMENT_STAFF', materialId: 'TIDE_IRON', occlusionRole: 'LOCAL_GAUGE' }, segments),
    cylinder('TARIAN_COUNTERFEIT_BUOY', 3, { center: [-2, 4, 17], radius: 1.7, height: 8, semanticRole: 'COUNTERFEIT_BUOY_WITNESS', materialId: 'ROUTE_BRASS', occlusionRole: 'LOCAL_INTERRUPT' }, segments),
    box('TARIAN_CONFLUENCE_BEAM', 3, { center: [-9, 3, 14], size: [2, 5, 16], yaw: 38, semanticRole: 'CONFLUENCE_JUNCTION', materialId: 'TIDE_IRON', occlusionRole: 'CHANNEL_CROSSING' })
  ];
};

const buildSignalLanternField = (lod) => {
  const segments = segmentCount(lod);
  return [
    annulus('ELARA_LISTENING_PAVILION', 0, { center: [0, 9, 0], innerRadius: 8, outerRadius: 13, height: 3, semanticRole: 'OPEN_LISTENING_PAVILION', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'SKYLINE_APERTURE' }, segments),
    cylinder('ELARA_PRIMARY_LANTERN', 0, { center: [-16, 12, -6], radius: 2.2, height: 24, semanticRole: 'PRIMARY_SIGNAL_TOWER', materialId: 'SIGNAL_GLASS', occlusionRole: 'VERTICAL_SIGNAL' }, segments),
    cylinder('ELARA_SECONDARY_LANTERN', 0, { center: [17, 8, 10], radius: 1.8, height: 16, semanticRole: 'SECONDARY_SIGNAL_TOWER', materialId: 'SIGNAL_GLASS', occlusionRole: 'VERTICAL_SIGNAL' }, segments),
    cylinder('ELARA_PAVILION_POST_NW', 1, { center: [-9, 4, -9], radius: 1.1, height: 8, semanticRole: 'LISTENING_PAVILION_SUPPORT', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'OPEN_FRAME_SUPPORT' }, segments),
    cylinder('ELARA_PAVILION_POST_NE', 1, { center: [9, 4, -9], radius: 1.1, height: 8, semanticRole: 'LISTENING_PAVILION_SUPPORT', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'OPEN_FRAME_SUPPORT' }, segments),
    cylinder('ELARA_PAVILION_POST_SE', 1, { center: [9, 4, 9], radius: 1.1, height: 8, semanticRole: 'LISTENING_PAVILION_SUPPORT', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'OPEN_FRAME_SUPPORT' }, segments),
    cylinder('ELARA_PAVILION_POST_SW', 1, { center: [-9, 4, 9], radius: 1.1, height: 8, semanticRole: 'LISTENING_PAVILION_SUPPORT', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'OPEN_FRAME_SUPPORT' }, segments),
    cylinder('ELARA_FAINT_LANTERN', 2, { center: [5, 6, -19], radius: 1.4, height: 12, semanticRole: 'FAINT_SIGNAL_TOWER', materialId: 'SIGNAL_GLASS', occlusionRole: 'DISTANT_SIGNAL' }, segments),
    box('ELARA_DOUBLE_APERTURE_WEST', 2, { center: [-6, 6, 1], size: [2, 11, 12], yaw: 24, semanticRole: 'DOUBLE_APERTURE_FRAME', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'INTERPRETIVE_OCCLUDER' }),
    box('ELARA_DOUBLE_APERTURE_EAST', 2, { center: [6, 6, 1], size: [2, 11, 12], yaw: -24, semanticRole: 'DOUBLE_APERTURE_FRAME', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'INTERPRETIVE_OCCLUDER' }),
    box('ELARA_RELATION_ARRAY_AXIS', 3, { center: [0, 2, -12], size: [31, 1.2, 1.2], yaw: 18, semanticRole: 'SIGNAL_RELATION_ALIGNMENT', materialId: 'SIGNAL_CERAMIC', occlusionRole: 'GROUND_ALIGNMENT' }),
    cylinder('ELARA_ARCHIVE_RESONATOR', 3, { center: [14, 3.5, -13], radius: 3.2, height: 7, semanticRole: 'ARCHIVE_RESONATOR', materialId: 'ROUTE_BRASS', occlusionRole: 'LOCAL_RESONATOR' }, segments),
    annulus('ELARA_CONTRADICTION_LENS', 3, { center: [-7, 4, 12], innerRadius: 2.2, outerRadius: 4.6, height: 2.2, semanticRole: 'CONTRADICTION_LENS', materialId: 'SIGNAL_GLASS', occlusionRole: 'LOCAL_APERTURE' }, segments)
  ];
};

const buildRestorationBoundary = (lod) => {
  const segments = segmentCount(lod);
  return [
    box('SOREN_CAUSEWAY_WEST', 0, { center: [-13, 3, 0], size: [25, 6, 13], yaw: -4, semanticRole: 'RESTORED_CAUSEWAY_SEGMENT', materialId: 'RESTORATION_MASONRY', occlusionRole: 'PRIMARY_MASS' }),
    box('SOREN_CAUSEWAY_EAST', 0, { center: [15, 4, 2], size: [24, 7, 13], yaw: 5, semanticRole: 'DISPLACED_CAUSEWAY_SEGMENT', materialId: 'RESTORATION_MASONRY', occlusionRole: 'PRIMARY_MASS' }),
    box('SOREN_TEST_FRAME_LINTEL', 0, { center: [4, 17, -6], size: [21, 3, 3], yaw: 3, semanticRole: 'STRUCTURAL_TEST_FRAME', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'SKYLINE_FRAME' }),
    box('SOREN_TEST_FRAME_WEST', 1, { center: [-5, 10, -6], size: [3, 16, 3], yaw: 3, semanticRole: 'STRUCTURAL_TEST_FRAME', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'LOAD_PATH' }),
    box('SOREN_TEST_FRAME_EAST', 1, { center: [13, 10, -6], size: [3, 16, 3], yaw: 3, semanticRole: 'STRUCTURAL_TEST_FRAME', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'LOAD_PATH' }),
    box('SOREN_SEAWALL', 1, { center: [1, 5, -11], size: [50, 10, 5], yaw: 1, semanticRole: 'REBUILT_SEAWALL_BOUNDARY', materialId: 'RESTORATION_MASONRY', occlusionRole: 'BOUNDARY_OCCLUDER' }),
    box('SOREN_RETURN_LOCK_WEST', 2, { center: [-6, 7, 11], size: [5, 14, 6], yaw: -7, semanticRole: 'RETURN_LOCK_JAW', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'LOCK_APERTURE' }),
    box('SOREN_RETURN_LOCK_EAST', 2, { center: [7, 7, 11], size: [5, 14, 6], yaw: 7, semanticRole: 'RETURN_LOCK_JAW', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'LOCK_APERTURE' }),
    box('SOREN_RETURN_LOCK_HEADER', 2, { center: [0.5, 13, 11], size: [10, 3, 5], semanticRole: 'RETURN_LOCK_HEADER', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'LOCK_APERTURE' }),
    box('SOREN_FAILED_JOINT_WITNESS', 2, { center: [1, 6.5, 1], size: [3.2, 13, 10], yaw: 28, semanticRole: 'FAILED_JOINT_EXPOSURE', materialId: 'TIDE_IRON', occlusionRole: 'FRACTURE_DEPTH' }),
    box('SOREN_LOAD_PATH_BRACE', 3, { center: [4, 10, -6], size: [2, 2, 20], yaw: 42, semanticRole: 'TESTED_LOAD_PATH', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'DIAGONAL_LOAD_PATH' }),
    cylinder('SOREN_FOUR_BEARING_JUNCTION', 3, { center: [-14, 7, 8], radius: 2.4, height: 14, semanticRole: 'FOUR_BEARING_JUNCTION', materialId: 'TEST_FRAME_STEEL', occlusionRole: 'LOCAL_JUNCTION' }, segments),
    cylinder('SOREN_FOUNDATION_WITNESS', 3, { center: [20, -1.5, -4], radius: 3.1, height: 9, semanticRole: 'FOUNDATION_WITNESS', materialId: 'RESTORATION_MASONRY', occlusionRole: 'SUBSTRUCTURE' }, segments)
  ];
};

const SITE_BUILDERS = {
  WATCHFIRE_OVERLOOK: buildWatchfireOverlook,
  WATERLINE_STATION: buildWaterlineStation,
  SIGNAL_LANTERN_FIELD: buildSignalLanternField,
  RESTORATION_BOUNDARY: buildRestorationBoundary
};

const geometryCache = new Map();
const fingerprint = (value) => {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
};

const aggregateBounds = (components) => {
  const positions = components.flatMap(({ mesh }) => mesh.positions);
  return boundsFromPositions(positions);
};

export function buildCardinalSiteGeometry(siteId, lod = 'LOCAL') {
  if (!CARDINAL_SITE_IDS.includes(siteId)) throw new RangeError(`UNKNOWN_CARDINAL_GEOMETRY_SITE:${siteId}`);
  if (!CARDINAL_SCENE_LODS.includes(lod)) throw new RangeError(`UNKNOWN_CARDINAL_GEOMETRY_LOD:${lod}`);
  const cacheKey = `${siteId}:${lod}`;
  if (geometryCache.has(cacheKey)) return geometryCache.get(cacheKey);

  const tier = tierForLod(lod);
  const authority = CARDINAL_SITE_GEOMETRY_AUTHORITY[siteId];
  const anchor = resolveLodSiteAnchor(siteId, lod);
  const components = SITE_BUILDERS[siteId](lod).filter((entry) => entry.detailTier <= tier);
  const record = {
    contractId: CARDINAL_SCENE_GEOMETRY_CONTRACT_ID,
    geometryIdentity: `CARDINAL_SITE_GEOMETRY:${siteId}`,
    siteId,
    characterId: authority.characterId,
    landmarkId: authority.landmarkId,
    geometryFamily: authority.geometryFamily,
    silhouetteClass: authority.silhouetteClass,
    approachAzimuths: authority.approachAzimuths,
    lod,
    lodExpression: {
      retainedDetailTier: tier,
      samplingDensity: anchor.samplingDensity,
      landmarkScale: anchor.landmarkScale,
      segmentCount: segmentCount(lod),
      geographicStateChanged: false
    },
    geography: {
      adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
      canonicalWorldReference: anchor.canonicalWorldReference,
      mapReference: anchor.mapReference,
      developmentOnly: true,
      finalContinentalAuthorityCreated: false
    },
    representation: 'STRUCTURAL_3D_TRIANGLE_MESH_ASSEMBLY',
    silhouetteDepthOcclusionLighting: true,
    components,
    componentCount: components.length,
    vertexCount: components.reduce((total, entry) => total + entry.mesh.vertexCount, 0),
    triangleCount: components.reduce((total, entry) => total + entry.mesh.triangleCount, 0),
    bounds: aggregateBounds(components),
    presenceInvariant: true,
    visibleCharacterGeometryConstructed: false,
    rendererIntegrationPerformed: false
  };
  record.contentFingerprint = fingerprint({
    siteId: record.siteId,
    lod: record.lod,
    world: record.geography.canonicalWorldReference,
    geometryFamily: record.geometryFamily,
    components: record.components
  });
  const frozen = deepFreeze(record);
  geometryCache.set(cacheKey, frozen);
  return frozen;
}

export function buildAllCardinalSiteGeometry(lod = 'LOCAL') {
  return deepFreeze(CARDINAL_SITE_IDS.map((siteId) => buildCardinalSiteGeometry(siteId, lod)));
}

export function resolveCardinalSiteGeometryForPresence({ siteId, lod = 'LOCAL', presenceState = 'SITE_ONLY' }) {
  if (!CARDINAL_PRESENCE_STATES.includes(presenceState)) throw new RangeError(`UNKNOWN_CARDINAL_PRESENCE_STATE:${presenceState}`);
  const geometry = buildCardinalSiteGeometry(siteId, lod);
  return deepFreeze({
    siteId,
    presenceState,
    geometryIdentity: geometry.geometryIdentity,
    geometry,
    presenceChangedSiteGeometry: false,
    visibleCharacterGeometryConstructed: false
  });
}

const meshIssues = (siteId, lod, entry) => {
  const issues = [];
  const mesh = entry.mesh;
  const label = `${siteId}:${lod}:${entry.componentId}`;
  if (mesh.primitiveType !== 'TRIANGLE_MESH' || mesh.billboard !== false) issues.push(`NON_STRUCTURAL_PRIMITIVE:${label}`);
  if (mesh.positions.length < 24 || mesh.positions.length % 3 !== 0) issues.push(`INVALID_POSITION_BUFFER:${label}`);
  if (mesh.normals.length !== mesh.positions.length) issues.push(`INVALID_NORMAL_BUFFER:${label}`);
  if (mesh.indices.length < 3 || mesh.indices.length % 3 !== 0) issues.push(`INVALID_INDEX_BUFFER:${label}`);
  if (mesh.positions.some((value) => !finite(value)) || mesh.normals.some((value) => !finite(value))) issues.push(`NON_FINITE_VERTEX_DATA:${label}`);
  if (mesh.indices.some((value) => !Number.isInteger(value) || value < 0 || value >= mesh.vertexCount)) issues.push(`INDEX_OUT_OF_RANGE:${label}`);
  for (let index = 0; index < mesh.normals.length; index += 3) {
    const length = Math.hypot(mesh.normals[index], mesh.normals[index + 1], mesh.normals[index + 2]);
    if (Math.abs(length - 1) > 1e-6) { issues.push(`NON_UNIT_NORMAL:${label}`); break; }
  }
  if (mesh.bounds.span.x <= 0.001 || mesh.bounds.span.y <= 0.001 || mesh.bounds.span.z <= 0.001) issues.push(`FLAT_GEOMETRY:${label}`);
  if (!mesh.lightingResponse || mesh.lightingResponse.model !== 'NORMAL_DRIVEN_LAMBERTIAN_WITH_MATERIAL_RESPONSE') issues.push(`LIGHTING_RESPONSE_MISSING:${label}`);
  return issues;
};

export function evaluateCardinalSceneGeometry() {
  const issues = [];
  const witnesses = [];
  const localFingerprints = new Set();
  const familyNames = new Set();
  const silhouetteNames = new Set();

  if (JSON.stringify(Object.keys(GRATITUDE_LOD_PROFILES)) !== JSON.stringify(CARDINAL_SCENE_LODS)) issues.push('GEOGRAPHY_ADAPTER_LOD_PROFILE_DRIFT');

  for (const siteId of CARDINAL_SITE_IDS) {
    const canonicalAnchor = resolveSiteAnchor(siteId);
    const authority = CARDINAL_SITE_GEOMETRY_AUTHORITY[siteId];
    familyNames.add(authority.geometryFamily);
    silhouetteNames.add(authority.silhouetteClass);
    let previousComponentCount = 0;
    let previousVertexCount = 0;

    for (const lod of CARDINAL_SCENE_LODS) {
      const geometry = buildCardinalSiteGeometry(siteId, lod);
      if (geometry.geography.canonicalWorldReference.x !== canonicalAnchor.world.x || geometry.geography.canonicalWorldReference.y !== canonicalAnchor.world.y || geometry.geography.canonicalWorldReference.z !== canonicalAnchor.world.z) issues.push(`LOD_GEOGRAPHIC_STATE_DIVERGED:${siteId}:${lod}`);
      if (geometry.geography.adapterId !== GRATITUDE_GEOGRAPHY_ADAPTER_ID || geometry.lodExpression.geographicStateChanged !== false) issues.push(`GEOGRAPHY_ADAPTER_BYPASSED:${siteId}:${lod}`);
      if (geometry.componentCount < previousComponentCount || geometry.vertexCount < previousVertexCount) issues.push(`LOD_DETAIL_NOT_MONOTONIC:${siteId}:${lod}`);
      if (geometry.bounds.span.x <= 0.001 || geometry.bounds.span.y <= 0.001 || geometry.bounds.span.z <= 0.001) issues.push(`SITE_NOT_STRUCTURAL_3D:${siteId}:${lod}`);
      if (geometry.components.every(({ mesh }) => mesh.occlusionRole === geometry.components[0].mesh.occlusionRole)) issues.push(`OCCLUSION_LAYERS_NOT_DISTINCT:${siteId}:${lod}`);
      for (const entry of geometry.components) issues.push(...meshIssues(siteId, lod, entry));
      previousComponentCount = geometry.componentCount;
      previousVertexCount = geometry.vertexCount;
      witnesses.push(deepFreeze({
        siteId,
        lod,
        world: geometry.geography.canonicalWorldReference,
        geometryFamily: geometry.geometryFamily,
        silhouetteClass: geometry.silhouetteClass,
        componentCount: geometry.componentCount,
        vertexCount: geometry.vertexCount,
        triangleCount: geometry.triangleCount,
        contentFingerprint: geometry.contentFingerprint
      }));
    }

    const local = buildCardinalSiteGeometry(siteId, 'LOCAL');
    localFingerprints.add(local.contentFingerprint);
    if (!authority.landmarkComponentIds.every((componentId) => local.components.some((component) => component.componentId === componentId))) {
      issues.push(`LANDMARK_GEOMETRY_NOT_WITNESSED:${siteId}`);
    }
    const presenceGeometry = CARDINAL_PRESENCE_STATES.map((presenceState) => resolveCardinalSiteGeometryForPresence({ siteId, lod: 'LOCAL', presenceState }));
    if (presenceGeometry.some((entry) => entry.geometry !== local || entry.geometryIdentity !== local.geometryIdentity || entry.presenceChangedSiteGeometry !== false)) issues.push(`PRESENCE_CHANGED_SITE_GEOMETRY:${siteId}`);
    if (fingerprint(buildCardinalSiteGeometry(siteId, 'LOCAL')) !== fingerprint(buildCardinalSiteGeometry(siteId, 'LOCAL'))) issues.push(`NON_DETERMINISTIC_GEOMETRY:${siteId}`);
  }

  if (familyNames.size !== 4) issues.push('CARDINAL_GEOMETRY_FAMILIES_NOT_DISTINCT');
  if (silhouetteNames.size !== 4) issues.push('CARDINAL_SILHOUETTES_NOT_DISTINCT');
  if (localFingerprints.size !== 4) issues.push('CARDINAL_LOCAL_GEOMETRY_NOT_DISTINCT');

  return deepFreeze({
    schema: 'TASK19_CARDINAL_SCENE_GEOMETRY_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS_PROTECTED_FOUR_STRUCTURAL_CARDINAL_SITES_AND_LOD_EXPRESSIONS' : 'HELD_TASK19_CARDINAL_SCENE_GEOMETRY',
    eligible: issues.length === 0,
    contractId: CARDINAL_SCENE_GEOMETRY_CONTRACT_ID,
    adapterId: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    siteCount: CARDINAL_SITE_IDS.length,
    lodCount: CARDINAL_SCENE_LODS.length,
    siteLodWitnessCount: witnesses.length,
    distinctGeometryFamilyCount: familyNames.size,
    distinctSilhouetteCount: silhouetteNames.size,
    distinctLocalFingerprintCount: localFingerprints.size,
    witnesses,
    issues,
    boundaries: {
      structuralSceneGeometryConstructed: true,
      sameGeometryAcrossPresenceStates: true,
      flatImageSubstituteConstructed: false,
      characterGeometryConstructed: false,
      finalContinentalAuthorityCreated: false,
      coastMapUiConstructed: false,
      knowledgeCardContentBound: false,
      rendererIntegrationPerformed: false,
      mergeAuthorityCreated: false,
      deploymentAuthorityCreated: false,
      publicationAuthorityCreated: false
    }
  });
}

export const CARDINAL_SCENE_GEOMETRY = deepFreeze({
  contractId: CARDINAL_SCENE_GEOMETRY_CONTRACT_ID,
  lods: CARDINAL_SCENE_LODS,
  siteAuthority: CARDINAL_SITE_GEOMETRY_AUTHORITY,
  materials: CARDINAL_GEOMETRY_MATERIALS,
  buildSite: buildCardinalSiteGeometry,
  buildAll: buildAllCardinalSiteGeometry,
  resolveForPresence: resolveCardinalSiteGeometryForPresence,
  evaluate: evaluateCardinalSceneGeometry
});
