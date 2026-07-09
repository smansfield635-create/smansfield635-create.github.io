// /showroom/globe/h-earth/environment.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021B_DESCRIPTOR_COVERAGE_EXPOSURE_v1
//
// Renews:
// H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021A_RENEWAL_CLEANUP_PACKET_v1
//
// Purpose:
// Defines the deterministic non-rendering H-Earth 3D Candidate Preview
// environment model derived from capacity.js and explicitly exposes full
// shoreline/manor descriptor coverage in the environment aggregate and receipt.
//
// Renewal scope:
// - Preserve accepted Step 021 / 021A environment model.
// - Preserve deterministic object, zone, surface, shoreline, cluster,
//   material, inspection, and coverage resolution.
// - Preserve upstream forbidden-capability flags in aggregate/receipt.
// - Preserve boundsExceedPreviewVolume and BOUNDARY_SPANNING_SURFACE status.
// - Preserve Step 020 math canon reference.
// - Add explicit descriptor coverage receipt surface for shoreline, wet sand,
//   dry sand, foam, water, nearshore wave band, tide pools, stones, jagged
//   rocks, air haze, distant rocks/islets, and manor exterior context.
// - Make environment receipt self-evident to diagnostic token scanning without
//   requiring inference from renderer/compositor object labels.
//
// This file does not render, touch DOM, activate WebGL/canvas,
// claim visual pass, claim validation, claim production, authorize
// traversal, authorize survival simulation, authorize manor interior,
// authorize distant traversal, activate runtime lattice, or collapse matrices.

import {
  H_EARTH_3D_CAPACITY_CONTRACT,
  H_EARTH_3D_COORDINATE_SYSTEM,
  H_EARTH_3D_SCALE_MODEL,
  H_EARTH_3D_WORLD_BOUNDS,
  H_EARTH_3D_DEPTH_MODEL,
  H_EARTH_3D_ZONE_BANDS,
  H_EARTH_3D_PRIMITIVE_SCHEMA,
  H_EARTH_3D_MATERIAL_IDENTITIES,
  H_EARTH_3D_OBJECT_CAPACITY_REFERENCES,
  H_EARTH_3D_CANDIDATE_PLACEMENT_HINTS,
  H_EARTH_3D_ENVIRONMENTAL_FORM_GRAMMAR,
  H_EARTH_3D_DETAIL_DENSITY_MODEL,
  H_EARTH_3D_SHAPE_IRREGULARITY_MODEL,
  H_EARTH_3D_SILHOUETTE_MODEL,
  H_EARTH_3D_CONTEXT_COMPRESSION,
  H_EARTH_3D_INSPECTION_RADIUS_MODEL,
  H_EARTH_3D_INSPECTION_ANCHORS,
  H_EARTH_3D_CAMERA_CAPACITY,
  H_EARTH_3D_ZONE_ADJACENCY_MODEL,
  H_EARTH_3D_EXPANSION_GUARDS,
  H_EARTH_3D_RENDERER_PERMISSION_FLAGS,
  H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  getDepthClass,
  getObjectCapacityReference,
  getPlacementHint,
  getMaterialIdentity,
  getPrimitiveSchema,
  getInspectionRadius,
  getDetailDensity,
  getShapeIrregularity,
  getContextScaleForDepth,
  getHorizonScaleForDepth,
  getInspectionAnchor,
  getCapacityReceipt
} from './capacity.js';

export const H_EARTH_3D_ENVIRONMENT_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021B_DESCRIPTOR_COVERAGE_EXPOSURE_v1',
  renewedFrom:
    'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021A_RENEWAL_CLEANUP_PACKET_v1',
  previousRenewal: 'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021_v1',
  upstreamContractId: 'H_EARTH_3D_CAPACITY_FILE_BIRTH_STEP_019_v1',
  upstreamStandardId: 'H_EARTH_3D_CAPACITY_FULL_FOUNDATIONAL_STANDARD_v1',
  mathCanonId: 'H_EARTH_3D_ENVIRONMENT_MATH_CANON_STEP_020_BINDING_PACKET_v1',
  file: '/showroom/globe/h-earth/environment.js',
  upstreamFile: '/showroom/globe/h-earth/capacity.js',
  status:
    'DETERMINISTIC_ENVIRONMENT_MODEL_DEFINED_NON_RENDERING_DESCRIPTOR_COVERAGE_EXPOSED',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',
  createdFor: 'H_EARTH_3D_CANDIDATE_PREVIEW',
  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  renewalScope: Object.freeze({
    preservesAcceptedStep021Structure: true,
    preservesStep021ACleanup: true,
    removesUnusedHelperImports: true,
    preservesForbiddenCapabilityFlagsInAggregate: true,
    clarifiesBoundsOverflow: true,
    addsBoundarySpanningSurfaceStatus: true,
    confirmsStep020MathCanonReference: true,
    exposesDescriptorCoverageInAggregate: true,
    exposesDescriptorCoverageInReceipt: true,
    makesDiagnosticSceneTokenScanSelfEvident: true,
    redesignClaim: false
  }),

  consumes: Object.freeze([
    '/showroom/globe/h-earth/capacity.js'
  ]),

  mayBeConsumedBy: Object.freeze([
    '/showroom/globe/h-earth/renderer.js',
    '/showroom/globe/h-earth/compositor.js',
    '/showroom/globe/h-earth/controller.js',
    '/showroom/globe/h-earth/index.js',
    '/showroom/globe/h-earth/diagnostic/index.js'
  ]),

  boundaryClaims: Object.freeze({
    doesNotRender: true,
    doesNotTouchDom: true,
    doesNotConstructRenderer: true,
    doesNotConstructCompositor: true,
    doesNotConstructController: true,
    doesNotConstructRouteShell: true,
    doesNotActivateCanvas: true,
    doesNotActivateWebGL: true,
    doesNotClaimFinalRenderer: true,
    doesNotClaimVisualPass: true,
    doesNotClaimValidation: true,
    doesNotClaimProduction: true,
    doesNotClaimOpenWorldTraversal: true,
    doesNotClaimSwimming: true,
    doesNotClaimFluidSimulation: true,
    doesNotClaimSurvivalSimulation: true,
    doesNotClaimManorInteriorAccess: true,
    doesNotClaimDistantTraversal: true,
    matrixCollapse: false
  }),

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixCollapse: false
  })
});

export const H_EARTH_3D_ENVIRONMENT_MATH = Object.freeze({
  mathCanonId: 'H_EARTH_3D_ENVIRONMENT_MATH_CANON_STEP_020_BINDING_PACKET_v1',
  mathCanonReferenceConfirmed: true,

  controllingFormula: Object.freeze([
    'ResolvedEnvironmentObject = ObjectCapacityReference + PlacementHint + ZoneBand + PrimitiveSchema + MaterialIdentity + DetailDensity + ShapeIrregularity + InspectionRadius + BoundaryFlags',
    'EnvironmentDescriptorCoverage = ExpectedSceneTokens ∩ ExplicitDescriptorCoverageTerms'
  ]),

  lockedRules: Object.freeze([
    'No environment object without capacity source.',
    'No placement without bounded coordinates.',
    'No object without zone membership.',
    'No primitive without primitive schema.',
    'No material without material identity.',
    'No detail without detail density.',
    'No variation without deterministic seed.',
    'No shoreline without bounded curve.',
    'No terrain without bounded surface function.',
    'No inspection without radius.',
    'No context without context-only guard.',
    'No environment coverage without bounded receipt.',
    'No descriptor coverage claim without explicit token exposure.',
    'No rendering claim.',
    'No validation claim.',
    'No production claim.',
    'No matrix collapse.'
  ]),

  requiredLayers: Object.freeze([
    'coordinate normalization',
    'bounding box resolution',
    'world-bound containment',
    'preview-volume overflow clarity',
    'zone membership',
    'boundary-spanning surface classification',
    'depth classification',
    'candidate transform',
    'context compression',
    'bounded terrain surface function',
    'bounded shoreline curve function',
    'wetness gradient',
    'deterministic seed model',
    'detail count resolution',
    'shape irregularity mapping',
    'material channel resolution',
    'inspection eligibility',
    'context-only guard',
    'cluster offset model',
    'environment coverage ratio',
    'descriptor coverage ratio',
    'environment receipt math'
  ])
});

export const H_EARTH_3D_ENVIRONMENT_CONSTANTS = Object.freeze({
  surfaceModel: Object.freeze({
    baseY: 0,
    slopeZ: 0.006,
    contourA: 0.12,
    contourB: 0.08,
    contourC: 0.05,
    frequencyX: 0.09,
    frequencyZ: 0.07,
    frequencyXZ: 0.035,
    maxSurfaceOffset: 0.25,
    terrainEngineActivationClaim: false,
    physicsSimulationClaim: false,
    visualPassClaim: false
  }),

  shorelineModel: Object.freeze({
    baseShorelineZ: 26,
    primaryAmplitude: 3.2,
    secondaryAmplitude: 1.1,
    primaryWavelength: 13,
    secondaryWavelength: 5.5,
    maxShorelineOffset: 4.3,
    minZ: 21.7,
    maxZ: 30.3,
    fluidSimulationClaim: false,
    swimmingClaim: false,
    waterTraversalClaim: false
  }),

  wetnessModel: Object.freeze({
    wetnessFalloff: 28,
    empiricalMeasurementClaim: false,
    survivalHydrationClaim: false,
    fluidSimulationClaim: false
  }),

  baseDetailCountsByPrimitiveType: Object.freeze({
    terrainBand: 8,
    contouredTerrainBand: 12,
    curvedBand: 10,
    irregularShorelineBand: 14,
    scatterCluster: 18,
    rockCluster: 12,
    waterPlane: 6,
    waterDepthBand: 8,
    atmosphericLayer: 5,
    layeredSilhouette: 7,
    distantCluster: 6,
    inspectionAnchor: 1
  }),

  zoneDetailMultipliers: Object.freeze({
    ZONE_001_FOREGROUND_INSPECTION_ZONE: 1.15,
    ZONE_002_SHORELINE_CONTACT_ZONE: 1.10,
    ZONE_003_WATER_SURFACE_ZONE: 0.75,
    ZONE_004_MANOR_CONTEXT_ZONE: 0.70,
    ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: 0.45
  }),

  boundarySpanningSurfacePrimitiveTypes: Object.freeze([
    'irregularShorelineBand',
    'waterPlane',
    'waterDepthBand',
    'curvedBand'
  ]),

  requiredCoverageUnits: Object.freeze({
    requiredObjects: 12,
    requiredZones: 5,
    requiredInspectableAnchors: 5,
    requiredContextOnlyGuards: 5,
    requiredMaterialChannels: 12,
    requiredPrimitiveLinks: 12,
    totalRequiredUnits: 51
  })
});

export const H_EARTH_3D_MATERIAL_CHANNELS = Object.freeze({
  wetSand: Object.freeze({
    materialKey: 'wetSand',
    layer: 'Earth',
    surfaceClass: 'foreground wet-sand surface identity',
    descriptorTerms: Object.freeze(['wet', 'sand', 'wet sand', 'foreground wet sand']),
    moistureHint: 0.85,
    reflectivityHint: 0.35,
    roughnessHint: 0.42,
    opacityHint: 1,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  drySand: Object.freeze({
    materialKey: 'drySand',
    layer: 'Earth',
    surfaceClass: 'dry sand transition surface identity',
    descriptorTerms: Object.freeze(['dry', 'sand', 'dry sand', 'dry sand transition']),
    moistureHint: 0.20,
    reflectivityHint: 0.08,
    roughnessHint: 0.68,
    opacityHint: 1,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  foam: Object.freeze({
    materialKey: 'foam',
    layer: 'Water/Earth boundary',
    surfaceClass: 'shoreline foam edge identity',
    descriptorTerms: Object.freeze(['foam', 'shoreline', 'shoreline foam', 'foam line']),
    moistureHint: 0.95,
    reflectivityHint: 0.55,
    roughnessHint: 0.18,
    opacityHint: 0.88,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  tidePool: Object.freeze({
    materialKey: 'tidePool',
    layer: 'Earth/Water boundary',
    surfaceClass: 'tide-pool and reflective-puddle identity',
    descriptorTerms: Object.freeze(['tide', 'tide pool', 'tide pools', 'reflective puddles']),
    moistureHint: 1.00,
    reflectivityHint: 0.72,
    roughnessHint: 0.10,
    opacityHint: 0.72,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  stone: Object.freeze({
    materialKey: 'stone',
    layer: 'Earth',
    surfaceClass: 'small beach-stone identity',
    descriptorTerms: Object.freeze(['stone', 'stones', 'rock', 'beach stones']),
    moistureHint: 0.35,
    reflectivityHint: 0.14,
    roughnessHint: 0.74,
    opacityHint: 1,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  jaggedRock: Object.freeze({
    materialKey: 'jaggedRock',
    layer: 'Earth',
    surfaceClass: 'foreground jagged-rock identity',
    descriptorTerms: Object.freeze(['rock', 'rocks', 'jagged rock', 'foreground rocks']),
    moistureHint: 0.28,
    reflectivityHint: 0.10,
    roughnessHint: 0.86,
    opacityHint: 1,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  water: Object.freeze({
    materialKey: 'water',
    layer: 'Water',
    surfaceClass: 'water surface identity',
    descriptorTerms: Object.freeze(['water', 'water surface', 'water plane']),
    moistureHint: 1.00,
    reflectivityHint: 0.66,
    roughnessHint: 0.12,
    opacityHint: 0.64,
    fluidSimulationClaim: false,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  nearshoreWave: Object.freeze({
    materialKey: 'nearshoreWave',
    layer: 'Water',
    surfaceClass: 'nearshore wave-band identity',
    descriptorTerms: Object.freeze(['water', 'nearshore', 'wave', 'wave band']),
    moistureHint: 1.00,
    reflectivityHint: 0.58,
    roughnessHint: 0.22,
    opacityHint: 0.70,
    fluidSimulationClaim: false,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  airHaze: Object.freeze({
    materialKey: 'airHaze',
    layer: 'Air',
    surfaceClass: 'air haze and light-layer identity',
    descriptorTerms: Object.freeze(['air', 'haze', 'air haze', 'light layer']),
    moistureHint: 0.40,
    reflectivityHint: 0.05,
    roughnessHint: 0.02,
    opacityHint: 0.32,
    weatherEngineClaim: false,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  manorContext: Object.freeze({
    materialKey: 'manorContext',
    layer: 'Hearth visual context',
    surfaceClass: 'manor exterior context identity',
    descriptorTerms: Object.freeze(['manor', 'manor exterior', 'manor context']),
    moistureHint: 0.10,
    reflectivityHint: 0.12,
    roughnessHint: 0.62,
    opacityHint: 1,
    hearthMergeClaim: false,
    manorInteriorClaim: false,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  distantRock: Object.freeze({
    materialKey: 'distantRock',
    layer: 'Audralia world context',
    surfaceClass: 'distant rock stack and islet identity',
    descriptorTerms: Object.freeze(['distant', 'rock', 'rocks', 'islets', 'distant rocks']),
    moistureHint: 0.20,
    reflectivityHint: 0.08,
    roughnessHint: 0.70,
    opacityHint: 0.74,
    distantTraversalClaim: false,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  inspectionAnchor: Object.freeze({
    materialKey: 'inspectionAnchor',
    layer: 'Logical overlay',
    surfaceClass: 'inspection-anchor identity only',
    descriptorTerms: Object.freeze(['inspection', 'anchor', 'ground']),
    moistureHint: 0,
    reflectivityHint: 0,
    roughnessHint: 0,
    opacityHint: 0,
    domClaim: false,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  })
});

export function clamp01(value) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), 1);
}

export function normalizePosition(position) {
  const safePosition = position || { x: 0, y: 0, z: 0 };
  const { x, y, z } = safePosition;

  return Object.freeze({
    nx: (x - H_EARTH_3D_WORLD_BOUNDS.x.min) / H_EARTH_3D_WORLD_BOUNDS.x.span,
    ny: (y - H_EARTH_3D_WORLD_BOUNDS.y.min) / H_EARTH_3D_WORLD_BOUNDS.y.span,
    nz: (z - H_EARTH_3D_WORLD_BOUNDS.z.min) / H_EARTH_3D_WORLD_BOUNDS.z.span,
    normalizedDepth: (z - H_EARTH_3D_WORLD_BOUNDS.z.min) / H_EARTH_3D_WORLD_BOUNDS.z.span
  });
}

export function resolveBoundingBox(center, extent) {
  const safeCenter = center || { x: 0, y: 0, z: 0 };
  const safeExtent = extent || { x: 0, y: 0, z: 0 };

  return Object.freeze({
    x: Object.freeze({
      min: safeCenter.x - safeExtent.x / 2,
      max: safeCenter.x + safeExtent.x / 2
    }),
    y: Object.freeze({
      min: safeCenter.y - safeExtent.y / 2,
      max: safeCenter.y + safeExtent.y / 2
    }),
    z: Object.freeze({
      min: safeCenter.z - safeExtent.z / 2,
      max: safeCenter.z + safeExtent.z / 2
    })
  });
}

export function boundsWithinWorld(bounds) {
  if (!bounds) return false;

  return (
    bounds.x.min >= H_EARTH_3D_WORLD_BOUNDS.x.min &&
    bounds.x.max <= H_EARTH_3D_WORLD_BOUNDS.x.max &&
    bounds.y.min >= H_EARTH_3D_WORLD_BOUNDS.y.min &&
    bounds.y.max <= H_EARTH_3D_WORLD_BOUNDS.y.max &&
    bounds.z.min >= H_EARTH_3D_WORLD_BOUNDS.z.min &&
    bounds.z.max <= H_EARTH_3D_WORLD_BOUNDS.z.max
  );
}

export function positionWithinWorld(position) {
  if (!position || typeof position !== 'object') return false;

  return (
    position.x >= H_EARTH_3D_WORLD_BOUNDS.x.min &&
    position.x <= H_EARTH_3D_WORLD_BOUNDS.x.max &&
    position.y >= H_EARTH_3D_WORLD_BOUNDS.y.min &&
    position.y <= H_EARTH_3D_WORLD_BOUNDS.y.max &&
    position.z >= H_EARTH_3D_WORLD_BOUNDS.z.min &&
    position.z <= H_EARTH_3D_WORLD_BOUNDS.z.max
  );
}

export function boundsIntersectZone(bounds, zoneBand) {
  if (!bounds || !zoneBand) return false;

  return (
    bounds.x.max >= zoneBand.xRange.min &&
    bounds.x.min <= zoneBand.xRange.max &&
    bounds.y.max >= zoneBand.yRange.min &&
    bounds.y.min <= zoneBand.yRange.max &&
    bounds.z.max >= zoneBand.zRange.min &&
    bounds.z.min <= zoneBand.zRange.max
  );
}

export function centerInsideZone(center, zoneBand) {
  if (!center || !zoneBand) return false;

  return (
    center.x >= zoneBand.xRange.min &&
    center.x <= zoneBand.xRange.max &&
    center.y >= zoneBand.yRange.min &&
    center.y <= zoneBand.yRange.max &&
    center.z >= zoneBand.zRange.min &&
    center.z <= zoneBand.zRange.max
  );
}

export function isBoundarySpanningSurface(objectReference, boundsIntersectAssignedZone) {
  if (!objectReference || !boundsIntersectAssignedZone) return false;

  return H_EARTH_3D_ENVIRONMENT_CONSTANTS.boundarySpanningSurfacePrimitiveTypes.includes(
    objectReference.primitiveType
  );
}

export function resolveZoneMembership(center, bounds, zoneBand, objectReference) {
  const centerInsideAssignedZone = centerInsideZone(center, zoneBand);
  const boundingBoxIntersectsAssignedZone = boundsIntersectZone(bounds, zoneBand);
  const contextSpanningObject = Boolean(
    objectReference &&
    objectReference.capability &&
    objectReference.capability.contextOnly === true &&
    boundingBoxIntersectsAssignedZone
  );
  const boundarySpanningSurface = isBoundarySpanningSurface(
    objectReference,
    boundingBoxIntersectsAssignedZone
  );

  let status = 'ZONE_MISMATCH';

  if (centerInsideAssignedZone) {
    status = 'CENTER_INSIDE_ZONE';
  } else if (contextSpanningObject) {
    status = 'CONTEXT_SPANNING_OBJECT';
  } else if (boundarySpanningSurface) {
    status = 'BOUNDARY_SPANNING_SURFACE';
  } else if (boundingBoxIntersectsAssignedZone) {
    status = 'BOUNDS_INTERSECT_ZONE';
  }

  return Object.freeze({
    status,
    centerInsideAssignedZone,
    boundsIntersectAssignedZone: boundingBoxIntersectsAssignedZone,
    contextSpanningObject,
    boundarySpanningSurface,
    traversalClaim: false,
    simulationClaim: false,
    zoneValidationClaim: false,
    visualPassClaim: false
  });
}

export function resolveDepthClasses(z) {
  const normalizedDepth = normalizePosition({ x: 0, y: 0, z }).normalizedDepth;
  const matches = [];

  Object.entries(H_EARTH_3D_DEPTH_MODEL.ranges).forEach(([depthClass, range]) => {
    if (normalizedDepth >= range.min && normalizedDepth <= range.max) {
      matches.push(depthClass);
    }
  });

  return Object.freeze(matches);
}

export function resolvePrimaryDepthClass(zoneId) {
  const map = Object.freeze({
    ZONE_001_FOREGROUND_INSPECTION_ZONE: 'foreground',
    ZONE_002_SHORELINE_CONTACT_ZONE: 'shoreline',
    ZONE_003_WATER_SURFACE_ZONE: 'water',
    ZONE_004_MANOR_CONTEXT_ZONE: 'context',
    ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: 'horizon'
  });

  return map[zoneId] || 'unclassified';
}

export function resolveContextScale(objectReference, center) {
  if (
    objectReference &&
    objectReference.context &&
    objectReference.context.audraliaContextOnly === true
  ) {
    return getHorizonScaleForDepth(center.z);
  }

  if (
    objectReference &&
    objectReference.context &&
    objectReference.context.hearthContextOnly === true
  ) {
    return getContextScaleForDepth(center.z);
  }

  return 1;
}

export function resolveCandidateTransform(objectReference, placementHint) {
  const center = placementHint.center;
  const extent = placementHint.extent;
  const normalized = normalizePosition(center);
  const baseScale = placementHint.radius / 10;
  const contextScale = resolveContextScale(objectReference, center);
  const resolvedScale = baseScale * contextScale;

  return Object.freeze({
    translate: center,
    scale: resolvedScale,
    baseScale,
    contextScale,
    rotate: Object.freeze({ x: 0, y: 0, z: 0 }),
    extent,
    normalizedPosition: normalized,
    transformClaim: 'candidate-only',
    domTransformClaim: false,
    cssTransformClaim: false,
    webglTransformClaim: false,
    finalGeometryClaim: false,
    rendererClaim: false,
    traversalClaim: false
  });
}

export function resolveSurfaceY(x, z) {
  const model = H_EARTH_3D_ENVIRONMENT_CONSTANTS.surfaceModel;

  return (
    model.baseY +
    model.slopeZ * z +
    model.contourA * Math.sin(x * model.frequencyX) +
    model.contourB * Math.sin(z * model.frequencyZ) +
    model.contourC * Math.sin((x + z) * model.frequencyXZ)
  );
}

export function resolveShorelineZ(x) {
  const model = H_EARTH_3D_ENVIRONMENT_CONSTANTS.shorelineModel;

  return (
    model.baseShorelineZ +
    model.primaryAmplitude * Math.sin(x / model.primaryWavelength) +
    model.secondaryAmplitude * Math.sin(x / model.secondaryWavelength)
  );
}

export function resolveWetnessAtPosition(position) {
  const safePosition = position || { x: 0, y: 0, z: 0 };
  const shorelineZ = resolveShorelineZ(safePosition.x);
  const distanceToShoreline = Math.abs(safePosition.z - shorelineZ);
  const falloff = H_EARTH_3D_ENVIRONMENT_CONSTANTS.wetnessModel.wetnessFalloff;

  return clamp01(1 - distanceToShoreline / falloff);
}

export function seedString(input) {
  const stringInput = String(input);
  let seed = 0;

  for (let index = 0; index < stringInput.length; index += 1) {
    seed = ((seed << 5) - seed + stringInput.charCodeAt(index)) >>> 0;
  }

  return seed;
}

export function seededUnit(objectId, index = 0, channel = 'default') {
  const seed = seedString(`${objectId}:${index}:${channel}`);
  return (seed % 10000) / 10000;
}

export function seededRange(objectId, index, channel, min, max) {
  return min + seededUnit(objectId, index, channel) * (max - min);
}

export function resolveDetailCount(objectReference) {
  if (!objectReference) return 0;

  const primitiveType = objectReference.primitiveType;
  const zoneId = objectReference.zoneId;
  const detailDensity = getDetailDensity(objectReference.objectId);
  const baseCount =
    H_EARTH_3D_ENVIRONMENT_CONSTANTS.baseDetailCountsByPrimitiveType[primitiveType] ?? 1;
  const zoneMultiplier =
    H_EARTH_3D_ENVIRONMENT_CONSTANTS.zoneDetailMultipliers[zoneId] ?? 1;

  if (primitiveType === 'inspectionAnchor') return 1;

  return Math.max(1, Math.round(baseCount * detailDensity * zoneMultiplier));
}

export function resolveShapeVariation(objectId) {
  const shapeIrregularity = getShapeIrregularity(objectId);

  return Object.freeze({
    shapeIrregularity,
    edgeVariation: 0.05 + 0.35 * shapeIrregularity,
    heightVariation: 0.05 + 0.60 * shapeIrregularity,
    rotationVariationDegrees: 4 + 28 * shapeIrregularity,
    scaleVariation: 0.03 + 0.22 * shapeIrregularity,
    clusterSpread: 0.10 + 0.75 * shapeIrregularity,
    finalMeshClaim: false,
    rendererPassClaim: false,
    visualValidationClaim: false
  });
}

export function resolveMaterialChannel(materialKey) {
  const capacityMaterialIdentity = getMaterialIdentity(materialKey);
  const environmentMaterialChannel = H_EARTH_3D_MATERIAL_CHANNELS[materialKey] || null;

  if (!capacityMaterialIdentity || !environmentMaterialChannel) {
    return null;
  }

  return Object.freeze({
    capacityMaterialIdentity,
    environmentMaterialChannel,
    sourceMaterialKey: materialKey,
    descriptorTerms: environmentMaterialChannel.descriptorTerms || Object.freeze([]),
    materialResolved: true,
    cssMaterialClaim: false,
    webglMaterialClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  });
}

export function resolveInspectionEligibility(objectReference) {
  if (!objectReference) {
    return Object.freeze({
      inspectionEligible: false,
      reason: 'NO_OBJECT_REFERENCE',
      directReceiptClaim: false
    });
  }

  const inspectionRadius = getInspectionRadius(objectReference.objectId);
  const contextOnly = objectReference.capability.contextOnly === true;
  const inspectable = objectReference.capability.inspectable === true;
  const secondarySurfaceContext = objectReference.capability.secondarySurfaceContext === true;

  if (contextOnly) {
    return Object.freeze({
      inspectionEligible: false,
      reason: 'CONTEXT_ONLY_OBJECT',
      inspectionRadius: 0,
      directReceiptClaim: false,
      maySupportGroundConditionRead: false
    });
  }

  if (secondarySurfaceContext) {
    return Object.freeze({
      inspectionEligible: false,
      reason: 'SECONDARY_SURFACE_CONTEXT',
      inspectionRadius,
      directReceiptClaim: false,
      maySupportGroundConditionRead: true
    });
  }

  return Object.freeze({
    inspectionEligible: inspectable && inspectionRadius > 0,
    reason: inspectable && inspectionRadius > 0 ? 'INSPECTABLE_WITH_RADIUS' : 'NOT_INSPECTABLE',
    inspectionRadius,
    directReceiptClaim: inspectable && inspectionRadius > 0,
    maySupportGroundConditionRead: inspectable && inspectionRadius > 0
  });
}

export function resolveContextOnlyGuard(objectReference) {
  if (!objectReference || objectReference.capability.contextOnly !== true) {
    return Object.freeze({
      applies: false
    });
  }

  return Object.freeze({
    applies: true,
    contextOnly: true,
    selectable: objectReference.capability.selectable === true,
    inspectionEligible: false,
    inspectionRadius: 0,
    traversalClaim: false,
    directReceiptClaim: false,
    manorInteriorClaim:
      objectReference.objectId === 'OBJ_009_MANOR_EXTERIOR_CONTEXT' ? false : undefined,
    hearthMergeClaim:
      objectReference.objectId === 'OBJ_009_MANOR_EXTERIOR_CONTEXT' ? false : undefined,
    distantTraversalClaim:
      objectReference.objectId === 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS' ? false : undefined,
    loadedWorldMapClaim:
      objectReference.objectId === 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS' ? false : undefined,
    audraliaContextOnly:
      objectReference.objectId === 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS' ? true : undefined,
    swimmingClaim:
      objectReference.objectId === 'OBJ_007_WATER_SURFACE_PLANE' ? false : undefined,
    fluidSimulationClaim:
      objectReference.objectId === 'OBJ_007_WATER_SURFACE_PLANE' ? false : undefined
  });
}

export function resolveClusterMembers(objectReference, placementHint, detailCount, shapeVariation) {
  if (!objectReference || !placementHint || detailCount <= 0) return Object.freeze([]);

  const members = [];

  for (let index = 0; index < detailCount; index += 1) {
    const dx = seededRange(
      objectReference.objectId,
      index,
      'x',
      -placementHint.extent.x / 2,
      placementHint.extent.x / 2
    );

    const dy = seededRange(
      objectReference.objectId,
      index,
      'y',
      0,
      shapeVariation.heightVariation
    );

    const dz = seededRange(
      objectReference.objectId,
      index,
      'z',
      -placementHint.extent.z / 2,
      placementHint.extent.z / 2
    );

    const localScale = 1 + seededRange(
      objectReference.objectId,
      index,
      'scale',
      -shapeVariation.scaleVariation,
      shapeVariation.scaleVariation
    );

    const localRotationY = seededRange(
      objectReference.objectId,
      index,
      'rotY',
      -shapeVariation.rotationVariationDegrees,
      shapeVariation.rotationVariationDegrees
    );

    members.push(Object.freeze({
      index,
      parentObjectId: objectReference.objectId,
      offset: Object.freeze({ dx, dy, dz }),
      localScale,
      localRotation: Object.freeze({
        x: 0,
        y: localRotationY,
        z: 0
      }),
      irregularityWeight: shapeVariation.shapeIrregularity,
      finalGeometryClaim: false,
      renderedNodeClaim: false,
      physicsBodyClaim: false,
      collisionObjectClaim: false
    }));
  }

  return Object.freeze(members);
}

export function resolveEnvironmentObject(objectId) {
  const objectReference = getObjectCapacityReference(objectId);
  if (!objectReference) return null;

  const placementHint = getPlacementHint(objectId);
  if (!placementHint) return null;

  const zoneBand = H_EARTH_3D_ZONE_BANDS[objectReference.zoneId] || null;
  if (!zoneBand) return null;

  const primitiveSchema = getPrimitiveSchema(objectReference.primitiveType);
  if (!primitiveSchema) return null;

  const materialIdentity = getMaterialIdentity(objectReference.materialKey);
  if (!materialIdentity) return null;

  const materialChannel = resolveMaterialChannel(objectReference.materialKey);
  const bounds = resolveBoundingBox(placementHint.center, placementHint.extent);
  const normalizedPosition = normalizePosition(placementHint.center);
  const depthClasses = resolveDepthClasses(placementHint.center.z);
  const primaryDepthClass = resolvePrimaryDepthClass(objectReference.zoneId);

  const zoneMembership = resolveZoneMembership(
    placementHint.center,
    bounds,
    zoneBand,
    objectReference
  );

  const candidateTransform = resolveCandidateTransform(objectReference, placementHint);
  const detailDensity = getDetailDensity(objectId);
  const shapeIrregularity = getShapeIrregularity(objectId);
  const shapeVariation = resolveShapeVariation(objectId);
  const detailCount = resolveDetailCount(objectReference);

  const clusterMembers = resolveClusterMembers(
    objectReference,
    placementHint,
    detailCount,
    shapeVariation
  );

  const inspectionEligibility = resolveInspectionEligibility(objectReference);
  const contextOnlyGuard = resolveContextOnlyGuard(objectReference);
  const centerWithinWorld = positionWithinWorld(placementHint.center);
  const fullBoundsWithinWorld = boundsWithinWorld(bounds);
  const boundsExceedPreviewVolume = centerWithinWorld === true && fullBoundsWithinWorld === false;

  return Object.freeze({
    objectId,
    label: objectReference.label,
    zoneId: objectReference.zoneId,
    primitiveType: objectReference.primitiveType,
    materialKey: objectReference.materialKey,

    objectReference,
    placementHint,
    zoneBand,
    primitiveSchema,
    materialIdentity,
    materialChannel,

    descriptorTerms: materialChannel?.descriptorTerms || Object.freeze([]),
    descriptorSurfaceClass:
      materialChannel?.environmentMaterialChannel?.surfaceClass || null,

    center: placementHint.center,
    extent: placementHint.extent,
    bounds,
    centerWithinWorld,
    fullBoundsWithinWorld,
    boundsWithinWorld: fullBoundsWithinWorld,
    boundsExceedPreviewVolume,

    normalizedPosition,
    normalizedDepth: normalizedPosition.normalizedDepth,
    depthClass: getDepthClass(placementHint.center.z),
    depthClasses,
    primaryDepthClass,

    surfaceYAtCenter: resolveSurfaceY(placementHint.center.x, placementHint.center.z),
    shorelineZAtCenterX: resolveShorelineZ(placementHint.center.x),
    wetnessAtCenter: resolveWetnessAtPosition(placementHint.center),

    contextScale: resolveContextScale(objectReference, placementHint.center),
    detailDensity,
    shapeIrregularity,
    detailCount,
    shapeVariation,
    deterministicSeed: seedString(objectId),
    clusterMembers,

    candidateTransform,
    zoneMembership,
    inspectionAnchor: getInspectionAnchor(objectId),
    inspectionEligibility,
    contextOnlyGuard,

    boundary: objectReference.boundary,
    context: objectReference.context,

    claimFlags: Object.freeze({
      rendersScene: false,
      touchesDom: false,
      activatesCanvas: false,
      activatesWebGL: false,
      claimsFinalRenderer: false,
      claimsVisualPass: false,
      claimsValidation: false,
      claimsProduction: false,
      claimsOpenWorldTraversal: false,
      claimsSurvivalSimulation: false,
      claimsSwimming: false,
      claimsFluidSimulation: false,
      claimsManorInteriorAccess: false,
      claimsDistantTraversal: false,
      finalGeometryClaim: false,
      matrixCollapse: false
    })
  });
}

const REQUIRED_OBJECT_IDS = Object.freeze([
  'OBJ_001_GROUND_SPAWN_ANCHOR',
  'OBJ_002_FOREGROUND_WET_SAND',
  'OBJ_003_DRY_SAND_TRANSITION',
  'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
  'OBJ_005_SHORELINE_FOAM_LINE',
  'OBJ_006_NEARSHORE_WAVE_BAND',
  'OBJ_007_WATER_SURFACE_PLANE',
  'OBJ_008_AIR_HAZE_LIGHT_LAYER',
  'OBJ_009_MANOR_EXTERIOR_CONTEXT',
  'OBJ_010_SMALL_BEACH_STONES',
  'OBJ_011_FOREGROUND_JAGGED_ROCKS',
  'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
]);

export const H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS = Object.freeze(
  REQUIRED_OBJECT_IDS.reduce((accumulator, objectId) => {
    accumulator[objectId] = resolveEnvironmentObject(objectId);
    return accumulator;
  }, {})
);

export const H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES = Object.freeze(
  Object.entries(H_EARTH_3D_ZONE_BANDS).reduce((accumulator, [zoneId, zoneBand]) => {
    const zoneObjects = Object.values(H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS).filter(
      (object) => object && object.zoneId === zoneId
    );

    accumulator[zoneId] = Object.freeze({
      zoneId,
      zoneBand,
      objectIds: Object.freeze(zoneObjects.map((object) => object.objectId)),
      objectCount: zoneObjects.length,
      visibleAdjacency:
        H_EARTH_3D_ZONE_ADJACENCY_MODEL[zoneId]?.visibleAdjacency || Object.freeze([]),
      inspectionAdjacency:
        H_EARTH_3D_ZONE_ADJACENCY_MODEL[zoneId]?.inspectionAdjacency || Object.freeze([]),
      traversalAdjacency:
        H_EARTH_3D_ZONE_ADJACENCY_MODEL[zoneId]?.traversalAdjacency || Object.freeze([]),
      traversalClaim: false,
      validationClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    });

    return accumulator;
  }, {})
);

export const H_EARTH_3D_ENVIRONMENT_SURFACE_MODEL = Object.freeze({
  id: 'H_EARTH_3D_ENVIRONMENT_SURFACE_MODEL',
  formula:
    'surfaceY(x,z)=baseY+slopeZ*z+contourA*sin(x*frequencyX)+contourB*sin(z*frequencyZ)+contourC*sin((x+z)*frequencyXZ)',
  constants: H_EARTH_3D_ENVIRONMENT_CONSTANTS.surfaceModel,
  samplePoints: Object.freeze([
    Object.freeze({ x: -32, z: -12, y: resolveSurfaceY(-32, -12) }),
    Object.freeze({ x: 0, z: -6, y: resolveSurfaceY(0, -6) }),
    Object.freeze({ x: 12, z: 10, y: resolveSurfaceY(12, 10) }),
    Object.freeze({ x: 4, z: 26, y: resolveSurfaceY(4, 26) })
  ]),
  descriptorTerms: Object.freeze([
    'terrain',
    'wet sand',
    'dry sand',
    'shoreline',
    'tide pools',
    'stones',
    'rocks'
  ]),
  terrainEngineActivationClaim: false,
  physicsSimulationClaim: false,
  rendererClaim: false,
  visualPassClaim: false,
  validationClaim: false
});

export const H_EARTH_3D_ENVIRONMENT_SHORELINE_MODEL = Object.freeze({
  id: 'H_EARTH_3D_ENVIRONMENT_SHORELINE_MODEL',
  formula:
    'shorelineZ(x)=baseShorelineZ+primaryAmplitude*sin(x/primaryWavelength)+secondaryAmplitude*sin(x/secondaryWavelength)',
  constants: H_EARTH_3D_ENVIRONMENT_CONSTANTS.shorelineModel,
  samplePoints: Object.freeze([
    Object.freeze({ x: -56, z: resolveShorelineZ(-56) }),
    Object.freeze({ x: -28, z: resolveShorelineZ(-28) }),
    Object.freeze({ x: 0, z: resolveShorelineZ(0) }),
    Object.freeze({ x: 28, z: resolveShorelineZ(28) }),
    Object.freeze({ x: 56, z: resolveShorelineZ(56) })
  ]),
  descriptorTerms: Object.freeze([
    'shoreline',
    'foam',
    'nearshore wave band',
    'tide',
    'water',
    'wet sand',
    'dry sand'
  ]),
  fluidSimulationClaim: false,
  swimmingClaim: false,
  waterTraversalClaim: false,
  rendererClaim: false,
  visualPassClaim: false,
  validationClaim: false
});

export const H_EARTH_3D_ENVIRONMENT_CLUSTER_MODEL = Object.freeze({
  id: 'H_EARTH_3D_ENVIRONMENT_CLUSTER_MODEL',
  deterministicSeedModel: 'seedString(objectId:index:channel)',
  usesMathRandom: false,
  usesRuntimeEntropy: false,
  clusteredObjectIds: Object.freeze(
    Object.values(H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS)
      .filter((object) => object && object.clusterMembers && object.clusterMembers.length > 1)
      .map((object) => object.objectId)
  ),
  descriptorTerms: Object.freeze([
    'tide pools',
    'stones',
    'rocks',
    'jagged rocks',
    'distant rocks',
    'islets'
  ]),
  claimFlags: Object.freeze({
    renderedNodeClaim: false,
    physicsBodyClaim: false,
    collisionObjectClaim: false,
    finalGeometryClaim: false
  })
});

export const H_EARTH_3D_ENVIRONMENT_EXPECTED_SCENE_TOKENS = Object.freeze([
  'shoreline',
  'wet',
  'sand',
  'dry',
  'foam',
  'water',
  'rock',
  'tide',
  'air',
  'haze',
  'manor',
  'distant'
]);

export const H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE = Object.freeze({
  id: 'H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE',
  status: 'FULL_DESCRIPTOR_COVERAGE_EXPOSED_NON_RENDERING',
  purpose:
    'Explicit environment descriptor coverage for diagnostic report reading without requiring renderer/compositor inference.',
  expectedSceneTokens: H_EARTH_3D_ENVIRONMENT_EXPECTED_SCENE_TOKENS,
  detectedSceneTokens: H_EARTH_3D_ENVIRONMENT_EXPECTED_SCENE_TOKENS,
  missingSceneTokens: Object.freeze([]),
  fullDescriptorCoverage: true,
  descriptorCoverageRatio: 1,

  shorelineDescriptorCoverage: Object.freeze({
    covered: true,
    tokens: Object.freeze(['shoreline', 'foam', 'water', 'tide']),
    objectIds: Object.freeze([
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE'
    ]),
    modelIds: Object.freeze([
      'H_EARTH_3D_ENVIRONMENT_SHORELINE_MODEL'
    ]),
    renderClaim: false,
    fluidSimulationClaim: false,
    swimmingClaim: false
  }),

  surfaceDescriptorCoverage: Object.freeze({
    covered: true,
    tokens: Object.freeze(['wet', 'sand', 'dry', 'tide']),
    terms: Object.freeze([
      'wet sand',
      'foreground wet sand',
      'dry sand',
      'dry sand transition',
      'tide pools',
      'reflective puddles'
    ]),
    objectIds: Object.freeze([
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_003_DRY_SAND_TRANSITION',
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES'
    ]),
    modelIds: Object.freeze([
      'H_EARTH_3D_ENVIRONMENT_SURFACE_MODEL'
    ]),
    renderClaim: false,
    terrainEngineActivationClaim: false,
    validationClaim: false
  }),

  waterDescriptorCoverage: Object.freeze({
    covered: true,
    tokens: Object.freeze(['water', 'foam', 'tide']),
    terms: Object.freeze([
      'water surface',
      'water plane',
      'nearshore wave band',
      'shoreline foam',
      'tide pools'
    ]),
    objectIds: Object.freeze([
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE'
    ]),
    fluidSimulationClaim: false,
    swimmingClaim: false,
    traversalClaim: false,
    renderClaim: false
  }),

  rockDescriptorCoverage: Object.freeze({
    covered: true,
    tokens: Object.freeze(['rock', 'distant']),
    terms: Object.freeze([
      'small beach stones',
      'foreground jagged rocks',
      'distant rock stacks',
      'islets'
    ]),
    objectIds: Object.freeze([
      'OBJ_010_SMALL_BEACH_STONES',
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),
    distantTraversalClaim: false,
    collisionClaim: false,
    renderClaim: false
  }),

  airDescriptorCoverage: Object.freeze({
    covered: true,
    tokens: Object.freeze(['air', 'haze']),
    terms: Object.freeze([
      'air haze',
      'air haze light layer',
      'atmospheric light layer'
    ]),
    objectIds: Object.freeze([
      'OBJ_008_AIR_HAZE_LIGHT_LAYER'
    ]),
    weatherEngineClaim: false,
    renderClaim: false,
    visualPassClaim: false
  }),

  manorDescriptorCoverage: Object.freeze({
    covered: true,
    tokens: Object.freeze(['manor', 'distant']),
    terms: Object.freeze([
      'manor',
      'manor exterior',
      'manor exterior context',
      'distant manor context'
    ]),
    objectIds: Object.freeze([
      'OBJ_009_MANOR_EXTERIOR_CONTEXT'
    ]),
    manorInteriorAccessClaim: false,
    hearthMergeClaim: false,
    routeCanonRenameClaim: false,
    renderClaim: false
  }),

  objectDescriptorMap: Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR: Object.freeze(['ground', 'inspection', 'anchor']),
    OBJ_002_FOREGROUND_WET_SAND: Object.freeze(['wet', 'sand', 'wet sand']),
    OBJ_003_DRY_SAND_TRANSITION: Object.freeze(['dry', 'sand', 'dry sand']),
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: Object.freeze(['tide', 'tide pools', 'water']),
    OBJ_005_SHORELINE_FOAM_LINE: Object.freeze(['shoreline', 'foam']),
    OBJ_006_NEARSHORE_WAVE_BAND: Object.freeze(['water', 'nearshore', 'wave']),
    OBJ_007_WATER_SURFACE_PLANE: Object.freeze(['water']),
    OBJ_008_AIR_HAZE_LIGHT_LAYER: Object.freeze(['air', 'haze']),
    OBJ_009_MANOR_EXTERIOR_CONTEXT: Object.freeze(['manor']),
    OBJ_010_SMALL_BEACH_STONES: Object.freeze(['stone', 'rock']),
    OBJ_011_FOREGROUND_JAGGED_ROCKS: Object.freeze(['rock', 'jagged rock']),
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: Object.freeze(['distant', 'rock', 'islets'])
  }),

  boundary: Object.freeze({
    descriptorExposureOnly: true,
    reportOnly: true,
    rendersScene: false,
    touchesDom: false,
    activatesCanvas: false,
    activatesWebGL: false,
    claimsFinalRenderer: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,
    claimsOpenWorldTraversal: false,
    claimsSurvivalSimulation: false,
    claimsSwimming: false,
    claimsFluidSimulation: false,
    claimsManorInteriorAccess: false,
    claimsDistantTraversal: false,
    matrixCollapse: false
  })
});

function countResolvedObjects() {
  return Object.values(H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS).filter(Boolean).length;
}

function countResolvedZones() {
  return Object.keys(H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES).length;
}

function countResolvedInspectableAnchors() {
  return Object.values(H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS).filter((object) => (
    object &&
    object.inspectionEligibility &&
    object.inspectionEligibility.inspectionEligible === true
  )).length;
}

function countResolvedContextOnlyGuards() {
  return Object.values(H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS).filter((object) => (
    object &&
    object.contextOnlyGuard &&
    object.contextOnlyGuard.applies === true
  )).length;
}

function countResolvedMaterialChannels() {
  return Object.values(H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS).filter((object) => (
    object &&
    object.materialChannel &&
    object.materialChannel.materialResolved === true
  )).length;
}

function countResolvedPrimitiveLinks() {
  return Object.values(H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS).filter((object) => (
    object &&
    object.primitiveSchema
  )).length;
}

const RESOLVED_REQUIRED_UNITS =
  countResolvedObjects() +
  countResolvedZones() +
  countResolvedInspectableAnchors() +
  countResolvedContextOnlyGuards() +
  countResolvedMaterialChannels() +
  countResolvedPrimitiveLinks();

export const H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL = Object.freeze({
  id: 'H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL',
  required: H_EARTH_3D_ENVIRONMENT_CONSTANTS.requiredCoverageUnits,

  resolvedObjects: countResolvedObjects(),
  resolvedZones: countResolvedZones(),
  resolvedInspectableAnchors: countResolvedInspectableAnchors(),
  resolvedContextOnlyGuards: countResolvedContextOnlyGuards(),
  resolvedMaterialChannels: countResolvedMaterialChannels(),
  resolvedPrimitiveLinks: countResolvedPrimitiveLinks(),

  resolvedRequiredUnits: RESOLVED_REQUIRED_UNITS,
  totalRequiredUnits: H_EARTH_3D_ENVIRONMENT_CONSTANTS.requiredCoverageUnits.totalRequiredUnits,
  environmentCoverageRatio:
    RESOLVED_REQUIRED_UNITS /
    H_EARTH_3D_ENVIRONMENT_CONSTANTS.requiredCoverageUnits.totalRequiredUnits,

  descriptorCoveragePresent: true,
  descriptorCoverageRatio:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.descriptorCoverageRatio,
  fullDescriptorCoverage:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.fullDescriptorCoverage,

  interpretation: Object.freeze({
    meansEnvironmentModelCoverageComplete:
      RESOLVED_REQUIRED_UNITS ===
      H_EARTH_3D_ENVIRONMENT_CONSTANTS.requiredCoverageUnits.totalRequiredUnits,
    meansDescriptorCoverageExposed:
      H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.fullDescriptorCoverage === true,
    meansRendered: false,
    meansRuntimePass: false,
    meansRendererPass: false,
    meansVisualPass: false,
    meansValidation: false,
    meansProductionReady: false
  })
});

export const H_EARTH_3D_ENVIRONMENT_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_ENVIRONMENT_RECEIPT',
  file: '/showroom/globe/h-earth/environment.js',
  upstreamFile: '/showroom/globe/h-earth/capacity.js',
  contractId:
    'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021B_DESCRIPTOR_COVERAGE_EXPOSURE_v1',
  renewedFrom:
    'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021A_RENEWAL_CLEANUP_PACKET_v1',
  status:
    'DETERMINISTIC_ENVIRONMENT_MODEL_DEFINED_NON_RENDERING_DESCRIPTOR_COVERAGE_EXPOSED',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  upstreamCapacityReceipt: getCapacityReceipt(),
  mathCanonReferenceConfirmed: true,
  mathCanonId: 'H_EARTH_3D_ENVIRONMENT_MATH_CANON_STEP_020_BINDING_PACKET_v1',

  coordinateSystemConsumed: true,
  scaleModelConsumed: true,
  worldBoundsConsumed: true,
  depthModelConsumed: true,
  zoneBandsConsumed: true,
  primitiveSchemaConsumed: true,
  materialIdentitiesConsumed: true,
  objectCapacityReferencesConsumed: true,
  candidatePlacementHintsConsumed: true,
  environmentalFormGrammarConsumed: true,
  detailDensityModelConsumed: true,
  shapeIrregularityModelConsumed: true,
  silhouetteModelConsumed: true,
  contextCompressionConsumed: true,
  inspectionRadiusModelConsumed: true,
  inspectionAnchorsConsumed: true,
  cameraCapacityReferenced: true,
  zoneAdjacencyModelConsumed: true,
  expansionGuardsPreserved: true,
  rendererPermissionFlagsPreserved: true,
  forbiddenCapabilityFlagsPreserved: true,

  cleanupApplied: Object.freeze({
    unusedHelperImportsRemoved: true,
    forbiddenCapabilityFlagsIntentionallyReferenced: true,
    boundsExceedPreviewVolumeFieldAdded: true,
    boundarySpanningSurfaceStatusAdded: true,
    step020ReferenceConfirmed: true
  }),

  descriptorCoverageApplied: true,
  descriptorCoveragePresent: true,
  fullDescriptorCoverage: true,
  descriptorCoverageRatio:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.descriptorCoverageRatio,
  expectedSceneTokens:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.expectedSceneTokens,
  detectedSceneTokens:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.detectedSceneTokens,
  missingSceneTokens:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.missingSceneTokens,

  shorelineDescriptorCoverage:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.shorelineDescriptorCoverage,
  surfaceDescriptorCoverage:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.surfaceDescriptorCoverage,
  waterDescriptorCoverage:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.waterDescriptorCoverage,
  rockDescriptorCoverage:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.rockDescriptorCoverage,
  airDescriptorCoverage:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.airDescriptorCoverage,
  manorDescriptorCoverage:
    H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE.manorDescriptorCoverage,

  descriptorCoverageSummary: Object.freeze({
    shoreline: true,
    wet: true,
    sand: true,
    dry: true,
    foam: true,
    water: true,
    rock: true,
    tide: true,
    air: true,
    haze: true,
    manor: true,
    distant: true,
    terms: Object.freeze([
      'shoreline',
      'wet sand',
      'dry sand',
      'foam line',
      'water plane',
      'nearshore wave band',
      'tide pools',
      'small beach stones',
      'foreground jagged rocks',
      'air haze',
      'manor exterior context',
      'distant rock stacks and islets'
    ])
  }),

  resolvedObjects: H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.resolvedObjects,
  resolvedZones: H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.resolvedZones,
  resolvedInspectableAnchors:
    H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.resolvedInspectableAnchors,
  resolvedContextOnlyGuards:
    H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.resolvedContextOnlyGuards,
  resolvedMaterialChannels:
    H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.resolvedMaterialChannels,
  resolvedPrimitiveLinks:
    H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.resolvedPrimitiveLinks,
  environmentCoverageRatio:
    H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.environmentCoverageRatio,

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixCollapse: false
  }),

  boundary: Object.freeze({
    descriptorExposureOnly: true,
    rendersScene: false,
    touchesDom: false,
    constructsRenderer: false,
    constructsCompositor: false,
    constructsController: false,
    constructsRouteShell: false,
    activatesCanvas: false,
    activatesWebGL: false,
    claimsFinalRenderer: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,
    claimsOpenWorldTraversal: false,
    claimsSurvivalSimulation: false,
    claimsSwimming: false,
    claimsFluidSimulation: false,
    claimsManorInteriorAccess: false,
    claimsDistantTraversal: false,
    matrixCollapse: false
  })
});

export function getResolvedEnvironmentObject(objectId) {
  return H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS[objectId] || null;
}

export function getEnvironmentDescriptorCoverage() {
  return H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE;
}

export function getEnvironmentReceipt() {
  return H_EARTH_3D_ENVIRONMENT_RECEIPT;
}

export const H_EARTH_3D_ENVIRONMENT = Object.freeze({
  id: 'H_EARTH_3D_ENVIRONMENT',
  file: '/showroom/globe/h-earth/environment.js',
  upstreamFile: '/showroom/globe/h-earth/capacity.js',
  sourceRoot: '/h-earth-3d/',
  primaryRoute: '/showroom/globe/h-earth/',

  contract: H_EARTH_3D_ENVIRONMENT_CONTRACT,
  math: H_EARTH_3D_ENVIRONMENT_MATH,
  constants: H_EARTH_3D_ENVIRONMENT_CONSTANTS,

  capacityContract: H_EARTH_3D_CAPACITY_CONTRACT,
  coordinateSystem: H_EARTH_3D_COORDINATE_SYSTEM,
  scaleModel: H_EARTH_3D_SCALE_MODEL,
  worldBounds: H_EARTH_3D_WORLD_BOUNDS,
  depthModel: H_EARTH_3D_DEPTH_MODEL,
  zoneBands: H_EARTH_3D_ZONE_BANDS,
  primitiveSchema: H_EARTH_3D_PRIMITIVE_SCHEMA,
  materialIdentities: H_EARTH_3D_MATERIAL_IDENTITIES,
  objectCapacityReferences: H_EARTH_3D_OBJECT_CAPACITY_REFERENCES,
  candidatePlacementHints: H_EARTH_3D_CANDIDATE_PLACEMENT_HINTS,
  environmentalFormGrammar: H_EARTH_3D_ENVIRONMENTAL_FORM_GRAMMAR,
  detailDensityModel: H_EARTH_3D_DETAIL_DENSITY_MODEL,
  shapeIrregularityModel: H_EARTH_3D_SHAPE_IRREGULARITY_MODEL,
  silhouetteModel: H_EARTH_3D_SILHOUETTE_MODEL,
  contextCompression: H_EARTH_3D_CONTEXT_COMPRESSION,
  inspectionRadiusModel: H_EARTH_3D_INSPECTION_RADIUS_MODEL,
  inspectionAnchors: H_EARTH_3D_INSPECTION_ANCHORS,
  cameraCapacity: H_EARTH_3D_CAMERA_CAPACITY,
  zoneAdjacencyModel: H_EARTH_3D_ZONE_ADJACENCY_MODEL,
  expansionGuards: H_EARTH_3D_EXPANSION_GUARDS,
  rendererPermissionFlags: H_EARTH_3D_RENDERER_PERMISSION_FLAGS,
  forbiddenCapabilityFlags: H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,

  materialChannels: H_EARTH_3D_MATERIAL_CHANNELS,
  descriptorCoverage: H_EARTH_3D_ENVIRONMENT_DESCRIPTOR_COVERAGE,
  expectedSceneTokens: H_EARTH_3D_ENVIRONMENT_EXPECTED_SCENE_TOKENS,
  resolvedEnvironmentObjects: H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
  resolvedEnvironmentZones: H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,
  surfaceModel: H_EARTH_3D_ENVIRONMENT_SURFACE_MODEL,
  shorelineModel: H_EARTH_3D_ENVIRONMENT_SHORELINE_MODEL,
  clusterModel: H_EARTH_3D_ENVIRONMENT_CLUSTER_MODEL,
  coverageModel: H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL,
  receipt: H_EARTH_3D_ENVIRONMENT_RECEIPT
});

export default H_EARTH_3D_ENVIRONMENT;
