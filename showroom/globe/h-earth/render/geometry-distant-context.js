/**
 * H_EARTH_GRATITUDE_AUDRALIA_FAR_CONTEXT_GEOMETRY_GEN328_v1
 *
 * Gen328 preserves the bounded Gen327 land/ocean continuation and adds one
 * fixed, non-geographic spherical planet-body shell beneath it. The shell
 * begins at the lawful world-manifold edge and exists only to provide the
 * physical planetary depth/silhouette required between that edge and the
 * true geometric horizon at elevated observer heights.
 */
import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID
} from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import {
  H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,
  buildHEarthWorldManifoldRepresentationPlan
} from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';
import {
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  regionToHEarthPlanetPoint
} from './planetary-world-frame.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID =
  'H_EARTH_GRATITUDE_AUDRALIA_FAR_CONTEXT_GEOMETRY_GEN328_v1';
export const H_EARTH_PLANET_BODY_HORIZON_SHELL_ID =
  'H_EARTH_PLANET_BODY_HORIZON_SHELL_GEN328_v1';

const DEFAULT_RINGS = freeze([360, 540, 780, 1120, 1600, 2260, 3160, 4400, 6000]);
const DEFAULT_SECTORS = 96;
const PLANET_BODY_RINGS = freeze([6000, 7000, 8200, 9600, 11200, 13200, 15600, 18000]);
const PLANET_BODY_SURFACE_OFFSET = -0.35;

function buildCompactMesh(plan, rings, sectorCount, surfaceClass) {
  const rawVertices = plan.vertices.map((vertex) => createHEarthVector3(
    vertex.world.x,
    vertex.world.y + (surfaceClass === 'OCEAN' ? 0.02 : 0),
    vertex.world.z
  ));
  const rawIndices = [];
  let retainedCellCount = 0;
  let suppressedCellCount = 0;
  let mixedTransitionCellCount = 0;

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    for (let column = 0; column < sectorCount; column += 1) {
      const next = (column + 1) % sectorCount;
      const a = ring * sectorCount + column;
      const b = ring * sectorCount + next;
      const d = (ring + 1) * sectorCount + next;
      const e = (ring + 1) * sectorCount + column;
      const cell = [plan.vertices[a], plan.vertices[b], plan.vertices[d], plan.vertices[e]];
      const landVotes = cell.filter((vertex) => vertex.terrainSilhouettePermitted === true).length;
      const keep = surfaceClass === 'LAND' ? landVotes >= 3 : landVotes <= 2;
      if (!keep) {
        suppressedCellCount += 1;
        continue;
      }
      if (landVotes > 0 && landVotes < 4) mixedTransitionCellCount += 1;
      rawIndices.push(a, e, b, b, e, d);
      retainedCellCount += 1;
    }
  }

  const referenced = [...new Set(rawIndices)].sort((a, b) => a - b);
  const remap = new Map(referenced.map((oldIndex, newIndex) => [oldIndex, newIndex]));
  return freeze({
    vertices: referenced.map((index) => rawVertices[index]),
    indices: rawIndices.map((index) => remap.get(index)),
    sourceVertexCount: rawVertices.length,
    compactVertexCount: referenced.length,
    removedUnreferencedVertexCount: rawVertices.length - referenced.length,
    retainedCellCount,
    suppressedCellCount,
    mixedTransitionCellCount,
    triangleCount: rawIndices.length / 3
  });
}

function constructFarPrimitive({ mesh, surfaceClass, plan }) {
  if (mesh.indices.length === 0 || mesh.vertices.length < 3) return null;
  const ocean = surfaceClass === 'OCEAN';
  const primitiveId = `H_EARTH_WORLD_MANIFOLD:FAR_${surfaceClass}_CONTINUATION`;
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices: mesh.vertices,
    indices: mesh.indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: ocean
      ? 'AUDRALIA_OPEN_OCEAN_ATMOSPHERIC_CONTINUATION_FROM_WORLD_MANIFOLD'
      : 'AUDRALIA_CONTINENTAL_CONTEXT_FROM_WORLD_MANIFOLD',
    materialHint: freeze({
      materialReference: ocean
        ? 'H_EARTH_MATERIAL_OPEN_WATER_DISTANCE'
        : 'H_EARTH_MATERIAL_AUDRALIA_SUBTROPICAL_DISTANCE',
      materialIntent: ocean
        ? 'OPEN_OCEAN_DISTANCE_CONTINUATION'
        : 'AUDRALIA_WARM_SUBTROPICAL_CONTINENTAL_CONTEXT'
    }),
    source: freeze({
      sourceType: 'WORLD_MANIFOLD_REPRESENTATION_PLAN',
      representationPlanContractId: H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,
      planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
      worldDomainContractId: H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
      topologySourceId: H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID
    }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      representationClass: 'FAR',
      farSurfaceClass: surfaceClass,
      geographicIdentity: 'AUDRALIA',
      playableRegionIdentity: 'GRATITUDE',
      climateIdentity: 'WARM_SUBTROPICAL_COASTAL',
      representationPlanContractId: H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,
      planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
      topologySourceId: H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
      sourceAuthority: 'DERIVED_REPRESENTATION_ONLY',
      independentGeographyAuthority: false,
      fullXYZSphericalContinuation: true,
      fixedPlanetaryAnchor: plan.continuationAnchorFixed === true,
      worldRecenteredForCamera: false,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      oceanFacingLandmassCreated: false,
      visibleRectangularTerminationProhibited: true,
      admitted: false,
      aggregateFrameAuthority: false
    })
  });
  return construction?.valid === true && isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord)
    ? construction.primitiveRecord
    : null;
}

function buildPlanetBodyShellMesh(sectorCount = DEFAULT_SECTORS) {
  const vertices = [];
  const indices = [];
  for (const radius of PLANET_BODY_RINGS) {
    for (let column = 0; column < sectorCount; column += 1) {
      const theta = column / sectorCount * Math.PI * 2;
      const planar = {
        x: Math.cos(theta) * radius,
        y: PLANET_BODY_SURFACE_OFFSET,
        z: Math.sin(theta) * radius
      };
      const projected = regionToHEarthPlanetPoint(planar);
      vertices.push(createHEarthVector3(projected.x, projected.y, projected.z));
    }
  }
  for (let ring = 0; ring < PLANET_BODY_RINGS.length - 1; ring += 1) {
    for (let column = 0; column < sectorCount; column += 1) {
      const next = (column + 1) % sectorCount;
      const a = ring * sectorCount + column;
      const b = ring * sectorCount + next;
      const c = (ring + 1) * sectorCount + next;
      const d = (ring + 1) * sectorCount + column;
      indices.push(a, d, b, b, d, c);
    }
  }
  return freeze({
    vertices,
    indices,
    ringRadii: PLANET_BODY_RINGS,
    innerRadius: PLANET_BODY_RINGS[0],
    outerRadius: PLANET_BODY_RINGS[PLANET_BODY_RINGS.length - 1],
    sectorCount,
    surfaceOffset: PLANET_BODY_SURFACE_OFFSET,
    triangleCount: indices.length / 3
  });
}

function constructPlanetBodyHorizonShell() {
  const mesh = buildPlanetBodyShellMesh();
  const primitiveId = 'H_EARTH_PLANET_BODY:HORIZON_DEPTH_SHELL';
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices: mesh.vertices,
    indices: mesh.indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'NON_GEOGRAPHIC_PLANET_BODY_HORIZON_DEPTH_OCCLUSION',
    materialHint: freeze({
      materialReference: 'H_EARTH_MATERIAL_PLANET_BODY_ATMOSPHERIC_DISTANCE',
      materialIntent: 'PLANET_BODY_DEPTH_AND_HORIZON_SILHOUETTE_ONLY'
    }),
    source: freeze({
      sourceType: 'PLANETARY_WORLD_FRAME_GEOMETRIC_BODY',
      planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
      geographySource: null,
      topologySourceId: null
    }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      planetBodyHorizonShellId: H_EARTH_PLANET_BODY_HORIZON_SHELL_ID,
      representationClass: 'FAR',
      farSurfaceClass: 'PLANET_BODY',
      geographicIdentity: null,
      playableRegionIdentity: null,
      climateIdentity: 'WARM_SUBTROPICAL_COASTAL_PRESENTATION_ONLY',
      planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
      topologySourceId: null,
      sourceAuthority: 'PLANETARY_WORLD_FRAME_GEOMETRIC_BODY_ONLY',
      independentGeographyAuthority: false,
      surfaceClassificationAuthority: false,
      topologyAuthority: false,
      fullXYZSphericalContinuation: true,
      fixedPlanetaryAnchor: true,
      worldRecenteredForCamera: false,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      oceanFacingLandmassCreated: false,
      planetBodyOnly: true,
      boundedGeographyExtension: false,
      admitted: false,
      aggregateFrameAuthority: false,
      innerRadius: mesh.innerRadius,
      outerRadius: mesh.outerRadius,
      surfaceOffset: mesh.surfaceOffset
    })
  });
  if (construction?.valid !== true || !isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord)) return null;
  return freeze({ primitive: construction.primitiveRecord, mesh });
}

export function constructHEarthDistantContextGeometry({
  cameraWorld = { x: 0, y: 8, z: -40 },
  rings = DEFAULT_RINGS,
  sectorCount = DEFAULT_SECTORS
} = {}) {
  const plan = buildHEarthWorldManifoldRepresentationPlan({ cameraWorld, rings, sectorCount });
  const issues = [];
  if (plan.eligible !== true) issues.push(...plan.issues);
  if (plan.vertices.some((vertex) => vertex.valid !== true)) {
    issues.push('FAR_CONTEXT_WORLD_SAMPLE_INVALID');
    return freeze({
      ok: false,
      status: 'DISTANT_CONTEXT_GEOMETRY_FAILED',
      contractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      primitives: [],
      issues
    });
  }

  const landMesh = buildCompactMesh(plan, rings, sectorCount, 'LAND');
  const oceanMesh = buildCompactMesh(plan, rings, sectorCount, 'OCEAN');
  const land = constructFarPrimitive({ mesh: landMesh, surfaceClass: 'LAND', plan });
  const ocean = constructFarPrimitive({ mesh: oceanMesh, surfaceClass: 'OCEAN', plan });
  const planetBody = constructPlanetBodyHorizonShell();
  if (!land) issues.push('FAR_LAND_REPRESENTATION_EMPTY_OR_INVALID');
  if (!ocean) issues.push('FAR_OCEAN_REPRESENTATION_EMPTY_OR_INVALID');
  if (!planetBody) issues.push('PLANET_BODY_HORIZON_SHELL_EMPTY_OR_INVALID');

  const primitives = [land, ocean, planetBody?.primitive].filter(Boolean);
  return freeze({
    ok: issues.length === 0,
    status: issues.length ? 'DISTANT_CONTEXT_GEOMETRY_FAILED' : 'DISTANT_CONTEXT_GEOMETRY_COMPLETE',
    contractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
    planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
    planetBodyHorizonShellId: H_EARTH_PLANET_BODY_HORIZON_SHELL_ID,
    representationPlan: plan,
    topologySourceId: H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    representationClass: 'FAR',
    geographicIdentity: 'AUDRALIA',
    playableRegionIdentity: 'GRATITUDE',
    climateIdentity: 'WARM_SUBTROPICAL_COASTAL',
    meshDiagnostics: freeze({
      land: landMesh,
      ocean: oceanMesh,
      planetBody: planetBody?.mesh ?? null,
      triangleCount:
        landMesh.triangleCount +
        oceanMesh.triangleCount +
        (planetBody?.mesh?.triangleCount ?? 0)
    }),
    primitives,
    bounds: primitives[0]?.geometry?.bounds ?? null,
    visualContinuationLayer: true,
    fullXYZSphericalContinuation: true,
    derivedHorizonDistance: plan.derivedHorizonDistance,
    fixedPlanetaryAnchor: true,
    worldRecenteredForCamera: false,
    accessibleRegionExpansion: false,
    radialHorizonContinuity: true,
    oceanSectorEmptinessEnforced: true,
    oceanVisualContinuationMaterialized: true,
    planetBodyHorizonShellMaterialized: planetBody != null,
    planetBodyGeographyAuthorityCreated: false,
    planetBodyTopologyAuthorityCreated: false,
    oppositeShoreFabricationProhibited: true,
    independentGeographyAuthority: false,
    admitted: false,
    issues
  });
}
