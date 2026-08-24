/**
 * Laws CP6 spacecraft geometry contract.
 *
 * This module consumes the H-Earth North/East/South/West geometry-kernel
 * facade directly. It constructs projection-neutral primitives, requires
 * East topology/normal analysis through South construction, and requires
 * West primitive plus aggregate-frame admission before any runtime buffers
 * are exposed.
 */

import {
  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_EAST_ENUMS,
  createHEarthVector3,
  constructHEarthSuperellipsoidMesh,
  constructHEarthEllipsoidMesh,
  constructHEarthConvexExtrusionMesh,
  admitHEarthPrimitiveBatch,
  isHEarthAggregateFrameAdmissionRecord,
  hasHEarthBlockingIssues
} from "../showroom/globe/h-earth/render/geometry-kernel.js";

export const LAWS_SPACECRAFT_GEOMETRY_CONTRACT = Object.freeze({
  id: "LAWS_CP6_SPACECRAFT_GEOMETRY_KERNEL_ADMITTED_v1",
  designId: "DGB_SCOUTCRAFT_01",
  frameId: "laws-cp6-spacecraft-frame-001",
  coordinateFrame: H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
  localAxes: Object.freeze({
    forward: "+X",
    aft: "-X",
    dorsal: "+Y",
    ventral: "-Y",
    starboard: "+Z",
    port: "-Z"
  }),
  kernelContracts: Object.freeze({
    north: H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
    east: H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
    south: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
    west: H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID
  }),
  visualPassClaimed: false,
  productionAuthorized: false,
  deploymentAuthorized: false
});

const MATERIALS = Object.freeze({
  hull: Object.freeze({ color: Object.freeze([0.16, 0.23, 0.31]), emissive: 0.035, metallic: 0.72 }),
  nose: Object.freeze({ color: Object.freeze([0.64, 0.56, 0.34]), emissive: 0.045, metallic: 0.82 }),
  canopy: Object.freeze({ color: Object.freeze([0.20, 0.76, 0.94]), emissive: 0.24, metallic: 0.32 }),
  engine: Object.freeze({ color: Object.freeze([0.90, 0.62, 0.22]), emissive: 0.42, metallic: 0.58 }),
  north: Object.freeze({ color: Object.freeze([0.28, 0.66, 0.88]), emissive: 0.055, metallic: 0.74 }),
  south: Object.freeze({ color: Object.freeze([0.80, 0.46, 0.23]), emissive: 0.045, metallic: 0.74 }),
  east: Object.freeze({ color: Object.freeze([0.33, 0.78, 0.88]), emissive: 0.055, metallic: 0.74 }),
  west: Object.freeze({ color: Object.freeze([0.86, 0.58, 0.27]), emissive: 0.045, metallic: 0.74 })
});

function vector(x, y, z) {
  const value = createHEarthVector3(x, y, z);
  if (!value) {
    throw new Error("LAWS_SPACECRAFT_VECTOR_CONSTRUCTION_FAILED");
  }
  return value;
}

function assertConstruction(result, label) {
  if (
    !result ||
    result.valid !== true ||
    !result.primitiveRecord ||
    !result.geometry ||
    hasHEarthBlockingIssues(result.issues)
  ) {
    const details = result?.issues?.map(issue => issue.code).join(",") || "UNKNOWN";
    throw new Error(`LAWS_SPACECRAFT_${label}_CONSTRUCTION_HELD:${details}`);
  }
  return result.primitiveRecord;
}

function circleProfileYZ(x, radius, sides = 10) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2;
    return vector(x, Math.cos(angle) * radius, Math.sin(angle) * radius);
  });
}

function constructNeutralPrimitives() {
  const projection = H_EARTH_3D_GEOMETRY_EAST_ENUMS.polygonProjectionPlane;

  const hull = assertConstruction(
    constructHEarthSuperellipsoidMesh({
      primitiveId: "spacecraft-hull",
      center: vector(-0.02, 0, 0),
      radii: vector(0.72, 0.18, 0.24),
      latitudeExponent: 0.76,
      longitudeExponent: 0.82,
      longitudeSampleCount: 20,
      latitudeSampleCount: 11,
      semanticRole: "PRIMARY_CLOSED_HULL",
      materialHint: MATERIALS.hull,
      metadata: { component: "hull", cardinalRole: "CENTER" }
    }),
    "HULL"
  );

  const nose = assertConstruction(
    constructHEarthEllipsoidMesh({
      primitiveId: "spacecraft-nose",
      center: vector(0.60, 0, 0),
      radii: vector(0.24, 0.125, 0.16),
      longitudeSampleCount: 16,
      latitudeSampleCount: 9,
      semanticRole: "FORWARD_NOSE",
      materialHint: MATERIALS.nose,
      metadata: { component: "nose", cardinalRole: "FORWARD" }
    }),
    "NOSE"
  );

  const canopy = assertConstruction(
    constructHEarthEllipsoidMesh({
      primitiveId: "spacecraft-canopy",
      center: vector(0.12, 0.15, 0),
      radii: vector(0.27, 0.09, 0.155),
      longitudeSampleCount: 16,
      latitudeSampleCount: 9,
      semanticRole: "DORSAL_CANOPY",
      materialHint: MATERIALS.canopy,
      metadata: { component: "canopy", cardinalRole: "NORTH" }
    }),
    "CANOPY"
  );

  const engine = assertConstruction(
    constructHEarthConvexExtrusionMesh({
      primitiveId: "spacecraft-engine-collar",
      profilePoints: circleProfileYZ(-0.69, 0.155, 10),
      projectionPlane: projection.YZ,
      direction: vector(1, 0, 0),
      distance: 0.15,
      semanticRole: "AFT_ENGINE_COLLAR",
      materialHint: MATERIALS.engine,
      metadata: { component: "engine", cardinalRole: "AFT" }
    }),
    "ENGINE"
  );

  const north = assertConstruction(
    constructHEarthConvexExtrusionMesh({
      primitiveId: "spacecraft-stabilizer-north",
      profilePoints: [
        vector(-0.48, 0.09, -0.028),
        vector(0.13, 0.105, -0.028),
        vector(-0.24, 0.37, -0.028)
      ],
      projectionPlane: projection.XY,
      direction: vector(0, 0, 1),
      distance: 0.056,
      semanticRole: "NORTH_STABILIZER",
      materialHint: MATERIALS.north,
      metadata: { component: "stabilizer", cardinalRole: "NORTH" }
    }),
    "NORTH_STABILIZER"
  );

  const south = assertConstruction(
    constructHEarthConvexExtrusionMesh({
      primitiveId: "spacecraft-stabilizer-south",
      profilePoints: [
        vector(-0.48, -0.09, 0.028),
        vector(-0.24, -0.37, 0.028),
        vector(0.13, -0.105, 0.028)
      ],
      projectionPlane: projection.XY,
      direction: vector(0, 0, -1),
      distance: 0.056,
      semanticRole: "SOUTH_STABILIZER",
      materialHint: MATERIALS.south,
      metadata: { component: "stabilizer", cardinalRole: "SOUTH" }
    }),
    "SOUTH_STABILIZER"
  );

  const east = assertConstruction(
    constructHEarthConvexExtrusionMesh({
      primitiveId: "spacecraft-stabilizer-east",
      profilePoints: [
        vector(-0.48, -0.028, 0.09),
        vector(0.13, -0.028, 0.105),
        vector(-0.24, -0.028, 0.37)
      ],
      projectionPlane: projection.XZ,
      direction: vector(0, 1, 0),
      distance: 0.056,
      semanticRole: "EAST_STABILIZER",
      materialHint: MATERIALS.east,
      metadata: { component: "stabilizer", cardinalRole: "EAST" }
    }),
    "EAST_STABILIZER"
  );

  const west = assertConstruction(
    constructHEarthConvexExtrusionMesh({
      primitiveId: "spacecraft-stabilizer-west",
      profilePoints: [
        vector(-0.48, 0.028, -0.09),
        vector(-0.24, 0.028, -0.37),
        vector(0.13, 0.028, -0.105)
      ],
      projectionPlane: projection.XZ,
      direction: vector(0, -1, 0),
      distance: 0.056,
      semanticRole: "WEST_STABILIZER",
      materialHint: MATERIALS.west,
      metadata: { component: "stabilizer", cardinalRole: "WEST" }
    }),
    "WEST_STABILIZER"
  );

  return [hull, nose, canopy, engine, north, south, east, west];
}

function flattenAdmittedFrame(frame) {
  const positions = [];
  const normals = [];
  const colors = [];
  const emissive = [];
  const indices = [];
  const components = [];

  for (const primitive of frame.primitives) {
    const geometry = primitive.geometry;
    const baseVertex = positions.length / 3;
    const color = primitive.materialHint?.color || [0.5, 0.5, 0.5];
    const emission = Number(primitive.materialHint?.emissive) || 0;

    for (let index = 0; index < geometry.vertices.length; index += 1) {
      const vertexValue = geometry.vertices[index];
      const normalValue = geometry.normals?.[index] || { x: 0, y: 1, z: 0 };
      positions.push(vertexValue.x, vertexValue.y, vertexValue.z);
      normals.push(normalValue.x, normalValue.y, normalValue.z);
      colors.push(color[0], color[1], color[2]);
      emissive.push(emission);
    }

    const indexStart = indices.length;
    for (const value of geometry.indices) {
      indices.push(baseVertex + value);
    }

    components.push(Object.freeze({
      primitiveId: primitive.primitiveId,
      semanticRole: primitive.semanticRole,
      cardinalRole: primitive.metadata?.cardinalRole || null,
      vertexStart: baseVertex,
      vertexCount: geometry.vertices.length,
      indexStart,
      indexCount: geometry.indices.length
    }));
  }

  const minimum = frame.bounds.minimum;
  const maximum = frame.bounds.maximum;
  const halfX = (maximum.x - minimum.x) * 0.5;
  const halfY = (maximum.y - minimum.y) * 0.5;
  const halfZ = (maximum.z - minimum.z) * 0.5;
  const boundingRadius = Math.hypot(halfX, halfY, halfZ);

  return Object.freeze({
    positions: Object.freeze(positions),
    normals: Object.freeze(normals),
    colors: Object.freeze(colors),
    emissive: Object.freeze(emissive),
    indices: Object.freeze(indices),
    components: Object.freeze(components),
    bounds: frame.bounds,
    boundingRadius
  });
}

let cachedGeometry = null;

export function buildLawsSpacecraftGeometry() {
  if (cachedGeometry) {
    return cachedGeometry;
  }

  const neutralPrimitives = constructNeutralPrimitives();
  const admission = admitHEarthPrimitiveBatch(neutralPrimitives, {
    frameId: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.frameId,
    metadata: {
      designId: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.designId,
      source: "H_EARTH_NEWS_GEOMETRY_KERNEL",
      localAxes: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.localAxes
    }
  });

  if (
    !admission ||
    admission.valid !== true ||
    !admission.frame ||
    !isHEarthAggregateFrameAdmissionRecord(admission.frame) ||
    hasHEarthBlockingIssues(admission.issues)
  ) {
    const details = admission?.issues?.map(issue => issue.code).join(",") || "UNKNOWN";
    throw new Error(`LAWS_SPACECRAFT_WEST_ADMISSION_HELD:${details}`);
  }

  const mesh = flattenAdmittedFrame(admission.frame);

  cachedGeometry = Object.freeze({
    contract: LAWS_SPACECRAFT_GEOMETRY_CONTRACT,
    frame: admission.frame,
    mesh,
    receipt: Object.freeze({
      contractId: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.id,
      designId: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.designId,
      coordinateFrame: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.coordinateFrame,
      primitiveCount: admission.frame.primitiveCount,
      vertexCount: mesh.positions.length / 3,
      triangleCount: mesh.indices.length / 3,
      componentCount: mesh.components.length,
      boundingRadius: mesh.boundingRadius,
      westAdmitted: true,
      aggregateFrameValid: true,
      blockingIssueCount: 0,
      visualPassClaimed: false,
      productionAuthorized: false,
      deploymentAuthorized: false
    })
  });

  return cachedGeometry;
}
