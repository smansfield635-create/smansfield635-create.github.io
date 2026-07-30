import bm1 from './h-earth.bm1-unique-baked-material-contract.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_BM2_LANDFORM_SEGMENTATION_AUTHORITY_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_BM2_LANDFORM_SEGMENTATION_AUTHORITY_v1',
  checkpoint: 'BM2',
  status: 'DESCRIPTOR_AND_SEGMENTATION_IMPLEMENTATION_ONLY',
  controllingBasis: {
    bm1MergeHead: 'b484a8469a95f8aa51b21cf049663c05e4287109',
    bm1ContractId: bm1.schemaVersion,
    terrainPath: bm1.controllingBasis.terrainPath,
    terrainBlob: bm1.controllingBasis.terrainBlob,
    acceptedRendererPath: bm1.controllingBasis.acceptedRendererPath,
    acceptedRendererBlob: bm1.controllingBasis.acceptedRendererBlob,
    liveHostPath: bm1.controllingBasis.liveHostPath,
    liveHostBlob: bm1.controllingBasis.liveHostBlob,
    liveBindingPath: bm1.controllingBasis.liveBindingPath,
    liveBindingBlob: bm1.controllingBasis.liveBindingBlob
  },
  analysisGrid: {
    width: 256,
    height: 256,
    sampleCount: 65536,
    tpiRadiiTexels: [2, 8, 24],
    regionSeedGrid: { columns: 32, rows: 32, maximumSeedCount: 1024 },
    materialVariantCount: 16,
    landformClassCount: 10
  },
  descriptors: [
    'MULTISCALE_LANDFORM_CLASS',
    'MULTISCALE_TOPOGRAPHIC_POSITION_INDEX',
    'SIGNED_RIDGE_OR_VALLEY_DISTANCE',
    'SLOPE_MAGNITUDE',
    'PROFILE_CURVATURE',
    'PLAN_CURVATURE',
    'EXPOSURE_OR_WETNESS_ESTIMATE',
    'TERRAIN_ASPECT'
  ],
  landformClasses: [
    'FLAT', 'SUMMIT', 'RIDGE', 'SHOULDER', 'SPUR',
    'SLOPE', 'HOLLOW', 'FOOTSLOPE', 'VALLEY', 'DEPRESSION'
  ],
  segmentationLaw: {
    deterministicJitteredSeedVoronoi: true,
    landformMismatchPenalty: true,
    boundaryBlendDerivedFromNearestTwoRegions: true,
    regionAdjacencyComputed: true,
    lowDiscrepancyVariantAllocation: true,
    adjacentSameVariantProhibitedWhereAlternativeExists: true,
    uniqueWorldCoverageRequired: true
  },
  outputs: [
    'MATERIAL_REGION_ID',
    'MATERIAL_VARIANT_ID',
    'BOUNDARY_BLEND_WEIGHT',
    'EXPOSURE_OR_WETNESS_RESPONSE'
  ],
  exactPathScope: [
    '.github/workflows/h-earth-bm2-landform-segmentation.yml',
    'h-earth-3d/authoring/round2-baked-material/h-earth.bm2-landform-segmentation.v1.mjs',
    'h-earth-3d/control-plane/post-cp2-round2/baked-material/h-earth.bm2-landform-segmentation-authority.v1.mjs',
    'h-earth-3d/validation/baked-material/h-earth.bm2-landform-segmentation.mjs'
  ],
  gates: {
    generationRuns: 2,
    byteIdentityRequired: true,
    allDescriptorArraysFinite: true,
    allTenLandformClassesRepresentedMinimum: 6,
    minimumRegionCount: 256,
    maximumRegionCount: 1024,
    adjacentSameVariantViolationCount: 0,
    coverageFraction: 1,
    productMutationCount: 0
  },
  boundaries: {
    mapBakeStarted: false,
    rendererIntegrationStarted: false,
    liveAdmissionAuthorized: false,
    stop: 'STOP_AFTER_DETERMINISTIC_DESCRIPTOR_AND_SEGMENTATION_RECEIPT_BEFORE_BM3_MAP_BAKE'
  },
  result: 'BM2_LANDFORM_DESCRIPTOR_AND_SEGMENTATION_PASS_CLOSED'
});

export default H_EARTH_BM2_LANDFORM_SEGMENTATION_AUTHORITY_v1;
