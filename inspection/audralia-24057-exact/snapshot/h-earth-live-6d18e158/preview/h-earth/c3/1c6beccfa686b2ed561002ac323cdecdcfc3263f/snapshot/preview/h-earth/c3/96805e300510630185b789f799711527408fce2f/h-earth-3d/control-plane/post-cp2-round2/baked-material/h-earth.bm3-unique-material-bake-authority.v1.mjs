import bm1 from './h-earth.bm1-unique-baked-material-contract.v1.mjs';
import bm2 from './h-earth.bm2-landform-segmentation-authority.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_BM3_UNIQUE_MATERIAL_BAKE_AUTHORITY_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_BM3_UNIQUE_MATERIAL_BAKE_AUTHORITY_v1',
  checkpoint: 'BM3',
  status: 'ONE_FIXED_OFFLINE_BAKE_ONLY',
  controllingBasis: {
    bm2MergeHead: '8a7b523d18a7b3a38e13e8476b2b7f82c16cd58c',
    bm1ContractId: bm1.schemaVersion,
    bm2AuthorityId: bm2.schemaVersion,
    acceptedRendererPath: bm1.controllingBasis.acceptedRendererPath,
    acceptedRendererBlob: bm1.controllingBasis.acceptedRendererBlob,
    terrainPath: bm1.controllingBasis.terrainPath,
    terrainBlob: bm1.controllingBasis.terrainBlob,
    liveHostPath: bm1.controllingBasis.liveHostPath,
    liveHostBlob: bm1.controllingBasis.liveHostBlob,
    liveBindingPath: bm1.controllingBasis.liveBindingPath,
    liveBindingBlob: bm1.controllingBasis.liveBindingBlob
  },
  product: {
    rawMapPath: bm1.mapContract.productPath,
    metadataPath: bm1.mapContract.metadataPath,
    width: bm1.mapContract.width,
    height: bm1.mapContract.height,
    channelCount: bm1.mapContract.channelCount,
    byteLength: bm1.mapContract.baseByteLength,
    storage: bm1.mapContract.storage,
    digestAlgorithm: bm1.mapContract.canonicalDigestAlgorithm
  },
  synthesisLaw: {
    oneFixedBake: true,
    parameterSweep: false,
    secondAtlas: false,
    source: 'BM2_DETERMINISTIC_LANDFORM_SEGMENTATION',
    regionOrganization: 'DISCRETE_COHERENT_LANDFORM_REGIONS',
    variantOrganization: 'ADJACENT_SAFE_LOW_DISCREPANCY_VARIANTS',
    textureCharacter: 'UNIQUE_WORLD_COVERAGE_WITH_BAKED_APERIODIC_MULTISCALE_DETAIL',
    periodicRuntimeSignals: false,
    runtimeSynthesis: false,
    geometryMutation: false
  },
  paletteLaw: {
    classPaletteCount: 10,
    variantCount: 16,
    regionIdentityPerturbation: 'BOUNDED_DETERMINISTIC',
    microVariation: 'BAKED_COORDINATE_HASH_SMOOTHED_AND_REGION_SEEDED',
    alpha: 'BOUNDARY_BLEND_AND_EXPOSURE_RESPONSE',
    linearAlbedoOutput: true
  },
  exactPathScope: [
    '.github/workflows/h-earth-bm3-unique-material-bake.yml',
    'h-earth-3d/authoring/round2-baked-material/h-earth.bm3-unique-material-bake.v1.mjs',
    'h-earth-3d/control-plane/post-cp2-round2/baked-material/h-earth.bm3-unique-material-bake-authority.v1.mjs',
    'h-earth-3d/validation/baked-material/h-earth.bm3-unique-material-bake.mjs',
    bm1.mapContract.productPath,
    bm1.mapContract.metadataPath
  ],
  gates: {
    generationRuns: 2,
    byteIdentityRequired: true,
    exactByteLength: bm1.mapContract.baseByteLength,
    canonicalSha256Required: true,
    minimumDistinctRgbTriples: 4096,
    minimumAlphaLevels: 32,
    allChannelsNonconstant: true,
    acceptedRendererPreserved: true,
    terrainPreserved: true,
    liveHostPreserved: true,
    liveBindingPreserved: true
  },
  boundaries: {
    rendererIntegrationStarted: false,
    liveAdmissionAuthorized: false,
    stop: 'STOP_AFTER_ONE_DETERMINISTIC_RAW_RGBA_MAP_AND_METADATA_BEFORE_BM4_RENDERER_INTEGRATION'
  },
  validationTrigger: 'CONNECTOR_AUTHORED_EXACT_HEAD_REVALIDATION_AFTER_GENERATED_PRODUCT_COMMIT',
  result: 'BM3_UNIQUE_1024_BAKED_MATERIAL_FIELD_PASS_CLOSED'
});

export default H_EARTH_BM3_UNIQUE_MATERIAL_BAKE_AUTHORITY_v1;
