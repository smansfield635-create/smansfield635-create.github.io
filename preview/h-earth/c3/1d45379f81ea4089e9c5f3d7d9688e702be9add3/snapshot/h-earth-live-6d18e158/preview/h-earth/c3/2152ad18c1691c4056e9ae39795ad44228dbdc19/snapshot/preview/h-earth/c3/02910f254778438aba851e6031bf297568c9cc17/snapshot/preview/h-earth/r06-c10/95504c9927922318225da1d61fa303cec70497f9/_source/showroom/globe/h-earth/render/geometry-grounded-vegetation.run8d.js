/**
 * /showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js
 *
 * H_EARTH_GROUNDED_VEGETATION_NEUTRAL_GEOMETRY_AND_WORLD_ATTACHMENT_RUN_8D_v1
 *
 * Constructs the three frozen Run 8A vegetation archetypes through the existing
 * South kernel and realizes accepted Run 7E population instances as immutable
 * world-space neutral primitives anchored to the Run 8B successor terrain.
 * No West admission, Packet 002 transfer, renderer loop, camera, route,
 * deployment, or public visual claim is created here.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  createHEarthVector3,
  addHEarthVector3,
  scaleHEarthVector3,
  crossHEarthVector3,
  normalizeHEarthVector3
} from './geometry-kernel.north.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  constructHEarthTriangleMesh,
  constructHEarthPrismMesh,
  constructHEarthRadialShellMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
} from '../../../../h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID
} from './geometry-successor-terrain.run8b.js';

import {
  H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID
} from './lighting-material-successor-terrain.run8c.js';

import {
  H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION,
  buildHEarthRun8DVegetationResolution,
  evaluateHEarthRun8DVegetationResolution
} from '../../../../h-earth-3d/environment/h-earth.vegetation-resolution.run8d.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export const H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID =
  'H_EARTH_GROUNDED_VEGETATION_NEUTRAL_GEOMETRY_AND_WORLD_ATTACHMENT_RUN_8D_v1';

export const H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_SOURCE_FILE =
  '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js';

export const H_EARTH_RUN_8D_GROUNDED_VEGETATION_PROFILE = freeze({
  contractId: H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  sourceResolutionContractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  terrainGeometryContractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  inheritedLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
  northKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  southKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  localArchetypeCount: 3,
  worldAttachmentClass: 'WORLD_SPACE_VERTEX_REALIZATION_FROM_TERRAIN_NORMAL_BASIS',
  sameWorldToCameraTransformAsTerrainRequired: true,
  samePhysicalDepthDomainAsTerrainRequired: true,
  terrainOcclusionExecution: 'WITHHELD_FOR_RUN_8E_RENDERER_INTEGRATION',
  cameraRelativeAttachment: false,
  screenRelativeAttachment: false,
  WestAdmission: false,
  Packet002Transfer: false,
  rendererMutation: false,
  publicRouteMutation: false,
  deployment: false
});

function triangleMesh({ primitiveId, vertices, indices, semanticRole, materialHint, metadata }) {
  return constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole,
    materialHint,
    metadata,
    source: {
      sourceType: 'RUN_8D_FROZEN_VEGETATION_ARCHETYPE_OR_WORLD_INSTANCE',
      vegetationAnchorContractId:
        H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT.contractId
    }
  });
}

function buildGrassTuftLocal() {
  const vertices = [];
  const indices = [];
  const halfWidth = 0.035;
  const radius = 0.18;
  const height = 0.8;
  for (let blade = 0; blade < 6; blade += 1) {
    const angle = blade * Math.PI / 3;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const px = -dz;
    const pz = dx;
    const baseCenterX = dx * radius * 0.16;
    const baseCenterZ = dz * radius * 0.16;
    const tipX = dx * radius;
    const tipZ = dz * radius;
    const offset = vertices.length;
    vertices.push(
      createHEarthVector3(baseCenterX - px * halfWidth, 0, baseCenterZ - pz * halfWidth),
      createHEarthVector3(baseCenterX + px * halfWidth, 0, baseCenterZ + pz * halfWidth),
      createHEarthVector3(tipX + px * halfWidth * 0.28, height * 0.72, tipZ + pz * halfWidth * 0.28),
      createHEarthVector3(tipX, height, tipZ)
    );
    indices.push(
      offset, offset + 1, offset + 2,
      offset, offset + 2, offset + 3
    );
  }
  return triangleMesh({
    primitiveId: 'H_EARTH_RUN_8D_ARCHETYPE_COASTAL_GRASS_TUFT',
    vertices,
    indices,
    semanticRole: 'RUN_8D_LOCAL_VEGETATION_ARCHETYPE_COASTAL_GRASS_TUFT',
    materialHint: {
      materialIntent: H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION.COASTAL_GRASS_TUFT.materialIntent,
      inheritedLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID
    },
    metadata: {
      archetypeId: 'COASTAL_GRASS_TUFT',
      topologyLaw: 'THREE_CROSSED_TAPERED_RIBBON_PAIRS',
      directionalRibbonCount: 6,
      localRootAnchor: { x: 0, y: 0, z: 0 },
      admitted: false
    }
  });
}

function buildShrubBranchCoreLocal() {
  const vertices = [];
  const indices = [];
  const root = createHEarthVector3(0, 0, 0);
  const top = createHEarthVector3(0, 0.78, 0);
  for (let segment = 0; segment < 8; segment += 1) {
    const angle = segment * Math.PI / 4;
    const offset = vertices.length;
    vertices.push(
      root,
      createHEarthVector3(Math.cos(angle) * 0.38, 0.42, Math.sin(angle) * 0.32),
      top
    );
    indices.push(offset, offset + 1, offset + 2);
  }
  return triangleMesh({
    primitiveId: 'H_EARTH_RUN_8D_ARCHETYPE_LOWLAND_SHRUB_BRANCH_CORE',
    vertices,
    indices,
    semanticRole: 'RUN_8D_LOCAL_VEGETATION_ARCHETYPE_LOWLAND_SHRUB_BRANCH_CORE',
    materialHint: {
      materialIntent: 'VEGETATION_WOODY_BRANCH_CORE',
      inheritedLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID
    },
    metadata: {
      archetypeId: 'LOWLAND_SHRUB',
      topologyLaw: 'RADIAL_BRANCH_CORE',
      radialSegmentCount: 8,
      localRootAnchor: { x: 0, y: 0, z: 0 },
      admitted: false
    }
  });
}

function ellipsoidRadialEvaluator(rx, ry, rz) {
  return ({ longitudeRadians, latitudeRadians }) => {
    const cosLatitude = Math.cos(latitudeRadians);
    const x = cosLatitude * Math.cos(longitudeRadians);
    const y = Math.sin(latitudeRadians);
    const z = cosLatitude * Math.sin(longitudeRadians);
    const denominator = Math.sqrt(
      (x * x) / (rx * rx) +
      (y * y) / (ry * ry) +
      (z * z) / (rz * rz)
    );
    return 1 / denominator;
  };
}

function buildShrubCanopyLocal() {
  return constructHEarthRadialShellMesh({
    primitiveId: 'H_EARTH_RUN_8D_ARCHETYPE_LOWLAND_SHRUB_CANOPY',
    center: createHEarthVector3(0, 0.65, 0),
    radialEvaluator: ellipsoidRadialEvaluator(0.7, 0.5, 0.6),
    longitudeSampleCount: 8,
    latitudeSampleCount: 7,
    semanticRole: 'RUN_8D_LOCAL_VEGETATION_ARCHETYPE_LOWLAND_SHRUB_CANOPY',
    materialHint: {
      materialIntent: H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION.LOWLAND_SHRUB.materialIntent,
      inheritedLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID
    },
    metadata: {
      archetypeId: 'LOWLAND_SHRUB',
      topologyLaw: 'LAYERED_CANOPY_SHELL',
      radialSegmentCount: 8,
      localRootAnchor: { x: 0, y: 0, z: 0 },
      admitted: false
    }
  });
}

function buildConiferTrunkLocal() {
  return constructHEarthPrismMesh({
    primitiveId: 'H_EARTH_RUN_8D_ARCHETYPE_HIGHLAND_CONIFER_TRUNK',
    center: createHEarthVector3(0, 0.8, 0),
    radius: 0.1,
    height: 1.6,
    sideCount: 8,
    semanticRole: 'RUN_8D_LOCAL_VEGETATION_ARCHETYPE_HIGHLAND_CONIFER_TRUNK',
    materialHint: {
      materialIntent: 'VEGETATION_CONIFER_TRUNK',
      inheritedLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID
    },
    metadata: {
      archetypeId: 'HIGHLAND_CONIFER_SAPLING',
      topologyLaw: 'TRUNK_PRISM',
      radialSegmentCount: 8,
      localRootAnchor: { x: 0, y: 0, z: 0 },
      admitted: false
    }
  });
}

function buildConiferCanopyTierLocal(tierId, centerY, rx, ry, rz) {
  return constructHEarthRadialShellMesh({
    primitiveId: `H_EARTH_RUN_8D_ARCHETYPE_HIGHLAND_CONIFER_CANOPY_${tierId}`,
    center: createHEarthVector3(0, centerY, 0),
    radialEvaluator: ellipsoidRadialEvaluator(rx, ry, rz),
    longitudeSampleCount: 8,
    latitudeSampleCount: 7,
    semanticRole: `RUN_8D_LOCAL_VEGETATION_ARCHETYPE_HIGHLAND_CONIFER_CANOPY_${tierId}`,
    materialHint: {
      materialIntent: H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION.HIGHLAND_CONIFER_SAPLING.materialIntent,
      inheritedLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID
    },
    metadata: {
      archetypeId: 'HIGHLAND_CONIFER_SAPLING',
      topologyLaw: 'TAPERED_RADIAL_CANOPY_TIER',
      tierId,
      radialSegmentCount: 8,
      localRootAnchor: { x: 0, y: 0, z: 0 },
      admitted: false
    }
  });
}

export function constructHEarthRun8DLocalVegetationArchetypes() {
  const constructions = {
    COASTAL_GRASS_TUFT: [buildGrassTuftLocal()],
    LOWLAND_SHRUB: [buildShrubBranchCoreLocal(), buildShrubCanopyLocal()],
    HIGHLAND_CONIFER_SAPLING: [
      buildConiferTrunkLocal(),
      buildConiferCanopyTierLocal('LOWER', 1.55, 0.6, 0.65, 0.6),
      buildConiferCanopyTierLocal('MIDDLE', 2.35, 0.48, 0.65, 0.48),
      buildConiferCanopyTierLocal('UPPER', 3.05, 0.34, 0.75, 0.34)
    ]
  };
  const issues = [];
  for (const [archetypeId, components] of Object.entries(constructions)) {
    components.forEach((component, index) => {
      if (component?.valid !== true ||
          !isHEarthNeutralPrimitiveRecord(component?.primitiveRecord)) {
        issues.push(`RUN_8D_LOCAL_ARCHETYPE_COMPONENT_INVALID:${archetypeId}:${index}`);
      }
    });
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8D_LOCAL_VEGETATION_ARCHETYPES_COMPLETE'
      : 'RUN_8D_LOCAL_VEGETATION_ARCHETYPES_FAILED',
    contractId: H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
    archetypeCount: Object.keys(constructions).length,
    componentCount: Object.values(constructions).reduce((sum, list) => sum + list.length, 0),
    constructions: freeze(constructions),
    issues: freeze(issues)
  });
}

function resolveWorldBasis(normal, yawRadians) {
  const normalizedUp = normalizeHEarthVector3(normal, 1e-12);
  if (normalizedUp?.valid !== true) return null;
  const up = normalizedUp.vector;
  const reference = Math.abs(up.y) < 0.92
    ? createHEarthVector3(0, 1, 0)
    : createHEarthVector3(0, 0, 1);
  const baseRightResult = normalizeHEarthVector3(crossHEarthVector3(up, reference), 1e-12);
  if (baseRightResult?.valid !== true) return null;
  const baseRight = baseRightResult.vector;
  const baseForwardResult = normalizeHEarthVector3(crossHEarthVector3(baseRight, up), 1e-12);
  if (baseForwardResult?.valid !== true) return null;
  const baseForward = baseForwardResult.vector;
  const cosine = Math.cos(yawRadians);
  const sine = Math.sin(yawRadians);
  const right = addHEarthVector3(
    scaleHEarthVector3(baseRight, cosine),
    scaleHEarthVector3(baseForward, sine)
  );
  const forward = addHEarthVector3(
    scaleHEarthVector3(baseForward, cosine),
    scaleHEarthVector3(baseRight, -sine)
  );
  return freeze({ right, up, forward });
}

function transformLocalVertex(local, anchor, basis, scale) {
  const right = scaleHEarthVector3(basis.right, local.x * scale);
  const up = scaleHEarthVector3(basis.up, local.y * scale);
  const forward = scaleHEarthVector3(basis.forward, local.z * scale);
  return addHEarthVector3(anchor, addHEarthVector3(right, addHEarthVector3(up, forward)));
}

function instantiateComponent(instance, localConstruction, componentIndex) {
  const localPrimitive = localConstruction.primitiveRecord;
  const basis = resolveWorldBasis(instance.successorTerrainNormal, instance.yawRadians);
  if (!basis || !isHEarthNeutralPrimitiveRecord(localPrimitive)) {
    return freeze({ valid: false, primitiveRecord: null, issues: ['RUN_8D_INSTANCE_BASIS_OR_LOCAL_PRIMITIVE_INVALID'] });
  }
  const worldVertices = localPrimitive.geometry.vertices.map((vertex) =>
    transformLocalVertex(vertex, instance.worldAnchor, basis, instance.uniformScale)
  );
  if (worldVertices.some((vertex) =>
      ![vertex?.x, vertex?.y, vertex?.z].every(finite))) {
    return freeze({ valid: false, primitiveRecord: null, issues: ['RUN_8D_WORLD_VERTEX_NONFINITE'] });
  }
  const primitiveId = `${instance.instanceId}:COMPONENT:${componentIndex}`;
  const result = triangleMesh({
    primitiveId,
    vertices: worldVertices,
    indices: [...localPrimitive.geometry.indices],
    semanticRole: 'RUN_8D_GROUNDED_WORLD_VEGETATION_INSTANCE_COMPONENT',
    materialHint: {
      ...localPrimitive.materialHint,
      archetypeId: instance.archetypeId,
      sourceSpeciesId: instance.speciesId,
      inheritedLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID
    },
    metadata: {
      run8DInstanceId: instance.instanceId,
      sourcePopulationInstanceId: instance.sourcePopulationInstanceId,
      sourceLocalPrimitiveId: localPrimitive.primitiveId,
      componentIndex,
      worldAnchor: instance.worldAnchor,
      successorTerrainNormal: instance.successorTerrainNormal,
      yawRadians: instance.yawRadians,
      uniformScale: instance.uniformScale,
      worldSpaceVertices: true,
      cameraRelativePosition: false,
      screenRelativePosition: false,
      sameWorldToCameraTransformAsTerrainRequired: true,
      samePhysicalDepthDomainAsTerrainRequired: true,
      terrainOcclusionRequiredAtRun8E: true,
      admitted: false,
      WestAdmissionExecuted: false,
      packet002TransferExecuted: false,
      rendererMaterialized: false
    }
  });
  return freeze({ ...result, worldBasis: basis });
}

export function constructHEarthRun8DGroundedVegetation() {
  const localArchetypes = constructHEarthRun8DLocalVegetationArchetypes();
  const resolution = buildHEarthRun8DVegetationResolution();
  const resolutionEvaluation = evaluateHEarthRun8DVegetationResolution(resolution);
  const issues = [...localArchetypes.issues, ...resolutionEvaluation.issues];
  const instances = [];
  let primitiveCount = 0;
  let worldVertexCount = 0;
  let worldTriangleCount = 0;

  if (localArchetypes.eligible && resolutionEvaluation.eligible) {
    for (const instance of resolution.instances) {
      const localComponents = localArchetypes.constructions[instance.archetypeId] ?? [];
      const components = localComponents.map((component, index) =>
        instantiateComponent(instance, component, index)
      );
      components.forEach((component, index) => {
        if (component?.valid !== true ||
            !isHEarthNeutralPrimitiveRecord(component?.primitiveRecord)) {
          issues.push(`RUN_8D_WORLD_COMPONENT_INVALID:${instance.instanceId}:${index}`);
          return;
        }
        primitiveCount += 1;
        worldVertexCount += component.primitiveRecord.geometry.vertices.length;
        worldTriangleCount += component.primitiveRecord.geometry.indices.length / 3;
      });
      instances.push(freeze({
        ...instance,
        componentCount: components.length,
        components: freeze(components)
      }));
    }
  }

  return freeze({
    eligible: issues.length === 0 && instances.length > 0 && primitiveCount > 0,
    status: issues.length === 0 && instances.length > 0 && primitiveCount > 0
      ? 'RUN_8D_GROUNDED_VEGETATION_COMPLETE'
      : 'RUN_8D_GROUNDED_VEGETATION_FAILED',
    contractId: H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
    profile: H_EARTH_RUN_8D_GROUNDED_VEGETATION_PROFILE,
    localArchetypes,
    resolution,
    instanceCount: instances.length,
    primitiveCount,
    worldVertexCount,
    worldTriangleCount,
    instances: freeze(instances),
    worldSpaceAttachmentEstablished: issues.length === 0,
    terrainNormalAlignmentEstablished: issues.length === 0,
    cameraRelativeAttachment: false,
    screenRelativeAttachment: false,
    sameWorldToCameraTransformAsTerrainRequired: true,
    samePhysicalDepthDomainAsTerrainRequired: true,
    terrainOcclusionCompatibility: true,
    terrainOcclusionExecuted: false,
    sourceRun8BGeometryMutated: false,
    sourceRun8CMaterialLightMutated: false,
    WestAdmissionExecuted: false,
    packet002TransferExecuted: false,
    rendererMutation: false,
    publicRouteMutation: false,
    deployment: false,
    visualImprovementClaim: false,
    issues: freeze(issues)
  });
}

export function evaluateHEarthRun8DGroundedVegetation(result) {
  const issues = [];
  if (result?.eligible !== true) issues.push('RUN_8D_GROUNDED_VEGETATION_NOT_ELIGIBLE');
  if (result?.contractId !== H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID) {
    issues.push('RUN_8D_GROUNDED_VEGETATION_CONTRACT_ID_MISMATCH');
  }
  if (result?.localArchetypes?.archetypeCount !== 3 ||
      result?.localArchetypes?.componentCount !== 7) {
    issues.push('RUN_8D_LOCAL_ARCHETYPE_PACKAGE_INVALID');
  }
  if (!Number.isInteger(result?.instanceCount) || result.instanceCount <= 0 ||
      !Number.isInteger(result?.primitiveCount) || result.primitiveCount <= 0 ||
      result.worldVertexCount <= 0 || result.worldTriangleCount <= 0) {
    issues.push('RUN_8D_WORLD_INSTANCE_COUNTS_INVALID');
  }
  for (const instance of result?.instances ?? []) {
    if (![instance.worldAnchor?.x, instance.worldAnchor?.y, instance.worldAnchor?.z,
      instance.successorTerrainNormal?.x, instance.successorTerrainNormal?.y,
      instance.successorTerrainNormal?.z].every(finite)) {
      issues.push(`RUN_8D_WORLD_ANCHOR_NONFINITE:${instance.instanceId}`);
    }
    for (const component of instance.components ?? []) {
      if (!isHEarthNeutralPrimitiveRecord(component?.primitiveRecord)) {
        issues.push(`RUN_8D_WORLD_PRIMITIVE_INVALID:${instance.instanceId}`);
      }
      if (component?.primitiveRecord?.metadata?.cameraRelativePosition !== false ||
          component?.primitiveRecord?.metadata?.screenRelativePosition !== false ||
          component?.primitiveRecord?.metadata?.worldSpaceVertices !== true) {
        issues.push(`RUN_8D_CAMERA_OR_SCREEN_ATTACHMENT_VIOLATION:${instance.instanceId}`);
      }
    }
  }
  if (result?.terrainOcclusionCompatibility !== true ||
      result?.terrainOcclusionExecuted !== false ||
      result?.sourceRun8BGeometryMutated !== false ||
      result?.sourceRun8CMaterialLightMutated !== false ||
      result?.WestAdmissionExecuted !== false ||
      result?.packet002TransferExecuted !== false ||
      result?.rendererMutation !== false ||
      result?.publicRouteMutation !== false ||
      result?.deployment !== false ||
      result?.visualImprovementClaim !== false) {
    issues.push('RUN_8D_BOUNDARY_VIOLATION');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8D_GROUNDED_VEGETATION_PASS'
      : 'RUN_8D_GROUNDED_VEGETATION_FAIL',
    issues: freeze(issues)
  });
}

export default H_EARTH_RUN_8D_GROUNDED_VEGETATION_PROFILE;
