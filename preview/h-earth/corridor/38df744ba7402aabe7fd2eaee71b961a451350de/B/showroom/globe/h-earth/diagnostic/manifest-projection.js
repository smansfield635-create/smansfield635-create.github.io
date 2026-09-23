/**
 * /showroom/globe/h-earth/diagnostic/manifest-projection.js
 * Frozen browser projection of the accepted nineteen-row FD_05 manifest.
 */

export const H_EARTH_FD05_ACCEPTED_MANIFEST_ID =
  'H_EARTH_FD05_POLICY_ENRICHED_NINETEEN_ROW_OCCURRENCE_MANIFEST_v2';
export const H_EARTH_FD05_ACCEPTED_MANIFEST_DIGEST =
  'ccd3773fefc72e74bd611f685cbcf9239ea5b71fba5171ff9ba07bcb81242c7a';
export const H_EARTH_FD05_FIXED_REPOSITORY_COMMIT =
  '41f1fc2a99f3161966d6ad2228a6e2d12a8890d6';
export const H_EARTH_FD05_SOURCE_MODIFICATION_AUTHORITY_STATUS = 'WITHHELD';
export const H_EARTH_FD05_PRODUCTION_CLAIM_AUTHORITY = 'NONE';

function freeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value) ||
    seen.has(value)
  ) return value;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
      freeze(descriptor.value, seen);
    }
  }
  return Object.freeze(value);
}

/*
 * Tuple:
 * order, repositoryPath, deployedUrl, expectedContractId, importParents,
 * driveSha256, driveDocumentId, repositorySha256, repositoryDigestStatus,
 * riskMask (1 import-time readback, 2 persistent state, 4 deferred DOM).
 */
const RAW = [[1,"/showroom/globe/h-earth/render/geometry-preview.js","https://diamondgatebridge.com/showroom/globe/h-earth/render/geometry-preview.js?v=034o6","H_EARTH_3D_GEOMETRY_PREVIEW_FILE_RENEWAL_STEP_034O_6_PREVIEW_PACKET_001_WET_SAND_PROVIDER_TRANSLATION_v1",[["./render/geometry-preview.js?v=034o6","dynamic-prebootstrap","/showroom/globe/h-earth/index.html",null,"PUBLIC_ENTRY_EXTENSION_REQUIRED"]],"f4a532d1ef0d1da3cccf5b194eb08c613081f98141b2ebd572b2300d82785102","1b_SZd0fFYN6z34TIjTGgaN-O1dfN0QCBBfXsoLbodSQ","b3ca7e964c3fcfd0106bb0cc94022d09435ccfa0c8c5cde666613a878671950f","ESTABLISHED",0],[2,"/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js","https://diamondgatebridge.com/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js","H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1",[["../../../../h-earth-3d/integration/h-earth.source-object-geometry-resolution.js","static","/showroom/globe/h-earth/render/geometry-preview.js",59,null]],"805c8f3199b9a5bf92fbc8f46d23620ab308f4db1b86c7407039471ebbf3b19e","1mO0tSC03CmXPKpsjS387YR3YpT8ZA8tjo_b-1aT0GqU","0b7ce4277ed2611162c207ce4956b8e31e607483e78bdb4e97755329e825a544","ESTABLISHED",0],[3,"/showroom/globe/h-earth/environment.js","https://diamondgatebridge.com/showroom/globe/h-earth/environment.js","H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v2",[["../environment.js","static","/showroom/globe/h-earth/render/geometry-preview.js",65,null]],"3f783c8e4a09ece934d9683a164bb1dd9fd3c9336bfa109f1a2bd3f042b826b5","12MQE-zcWepQ4csnItvlqMoG2QMtlG0sFOpJsOL_8ah4",null,"UNEVALUATED",1],[4,"/showroom/globe/h-earth/render/geometry-ground.js","https://diamondgatebridge.com/showroom/globe/h-earth/render/geometry-ground.js","H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1",[["./geometry-ground.js","static","/showroom/globe/h-earth/render/geometry-preview.js",72,null]],"96b1af32579296e0d322bbc23f411664e488af27b5f9d57cef5f4110455a55d3","1BH2xOc_DcNCJsnEPgyFlZqnWGZceYPNFvsZOIBhqf9c",null,"UNEVALUATED",0],[5,"/h-earth-3d/objects/ground-cell-001.objects.js","https://diamondgatebridge.com/h-earth-3d/objects/ground-cell-001.objects.js","H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2",[["./objects/ground-cell-001.objects.js","static","/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js",70,null]],"fe7f3ccd380fe4a8fb7e312511a9603d264d372c78cf069f91e144d9393887b0","1C2ZBe82WfmE0GGQf2v9w4kmWQoZ42CZLwh49secL-P0","c187a98b96249f3ff8e142e58916815b11040c0e42e5cd3b522e4dec76ca284b","ESTABLISHED",1],[6,"/h-earth-3d/zones/ground-cell-001.zones.js","https://diamondgatebridge.com/h-earth-3d/zones/ground-cell-001.zones.js","H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1",[["./zones/ground-cell-001.zones.js","static","/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js",79,null],["./zones/ground-cell-001.zones.js","static","/h-earth-3d/objects/ground-cell-001.objects.js",96,null],["./ground-cell-001.zones.js","static","/h-earth-3d/zones/ground-cell-001.landscape-lattice.js",77,null]],"16c971180d934c3440fd34489c8ad92bc0b2dea790f8da5275def0f2fdd31da5","1XV4IDS04Qop95QEw9o2w1KwJnO80JOZOjdn0gNZeNuI",null,"UNEVALUATED",0],[7,"/h-earth-3d/zones/ground-cell-001.landscape-lattice.js","https://diamondgatebridge.com/h-earth-3d/zones/ground-cell-001.landscape-lattice.js","H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_RENEWAL_STEP_034L_LANDSCAPE_LATTICE_ZONE_AND_RENDER_TARGET_ALIGNMENT_v1",[["./zones/ground-cell-001.landscape-lattice.js","static","/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js",86,null]],"437970d4fdd7e523931404baa44eeed8d8e887c10afc9df2574bae6b073236e8","10HUxO6UsqD0CoSLIB4v6bgJpwLehVFH5bLY-n0jsQnU","766348f5499685719a126642a8b3bb93ac082afaf4ff7f7bc972e158c306d482","ESTABLISHED",1],[8,"/showroom/globe/h-earth/capacity.js","https://diamondgatebridge.com/showroom/globe/h-earth/capacity.js","H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v1",[["./capacity.js","static","/showroom/globe/h-earth/admitted-geometry-frame.js",93,null],["./capacity.js","static","/showroom/globe/h-earth/compositor.js",32,null],["./capacity.js","static","/showroom/globe/h-earth/environment.js",83,null],["./capacity.js","static","/showroom/globe/h-earth/renderer.js",76,null]],"3f0a113f625b100287d50e5bc88059f1d28fc19b6d58917f402739ddbe74b22c","1x8zMkyvLJe4Wx--cmvj5I5aq0lBLSkvQu_nnuiKJTVs","00842af69432cd35645cc646075fab100ae713d5ce45e3fb6d0802bfc34aac7b","ESTABLISHED",1],[9,"/showroom/globe/h-earth/render/geometry-kernel.js","https://diamondgatebridge.com/showroom/globe/h-earth/render/geometry-kernel.js","H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1",[["././showroom/globe/h-earth/render/geometry-kernel.js","static","/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js",55,null],["./render/geometry-kernel.js","static","/showroom/globe/h-earth/admitted-geometry-frame.js",83,null],["KERNEL_BRANCH_CANONICAL_URL","dynamic-prebootstrap","/showroom/globe/h-earth/index.html",null,"PUBLIC_ENTRY_EXTENSION_REQUIRED"],["./geometry-kernel.js","static","/showroom/globe/h-earth/render/geometry-ground.js",44,null]],"71524f80ba4e506ffe3063cd328d75159260180579e6386224be47fec448f6bc","1IYlcxEVGFU4IR6CbS_neCyc6MQxnBWyw3Kd96xc8Z8w","dca2673d76c46358d4e66b8392f24457c6caf4f07128f653250ee26768824817","ESTABLISHED",0],[10,"/h-earth-3d/cells/ground-cell-001.js","https://diamondgatebridge.com/h-earth-3d/cells/ground-cell-001.js","H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_011A_PATH3_DOMAIN_BINDING_CONSUMER_v1",[["./cells/ground-cell-001.js","static","/h-earth-3d/objects/ground-cell-001.objects.js",79,null],["./cells/ground-cell-001.js","static","/h-earth-3d/zones/ground-cell-001.landscape-lattice.js",69,null],["./cells/ground-cell-001.js","static","/h-earth-3d/zones/ground-cell-001.zones.js",107,null]],"59f865f9d14d728a2a66c143111650f0e68d34e68c54f45506200763df2af7e2","1APD3SU-CCyK6dTv08cHItojBNGsPbiaFInf2jS6PT6A","e2175ef2ddb0399d5d325d2478a72c34e8e67feb9ae28f92b77ebdc1a4b615f2","ESTABLISHED",0],[11,"/h-earth-3d/h-earth.matrix.js","https://diamondgatebridge.com/h-earth-3d/h-earth.matrix.js","H_EARTH_MATRIX_FILE_RENEWAL_STEP_009D_REJECTED_BINDING_CLASSIFICATION_GUARD_v1",[["./h-earth.matrix.js","static","/h-earth-3d/cells/ground-cell-001.js",51,null],["./h-earth.matrix.js","static","/h-earth-3d/zones/ground-cell-001.landscape-lattice.js",62,null],["./h-earth.matrix.js","static","/h-earth-3d/zones/ground-cell-001.zones.js",95,null]],"a827cb66d35ce62bf01cbac1368c4cb8e8b25fd10bef3bfbcf7f378df1dc0e21","1y_55VOg4t4zbQAUwy0VyCeXapKdraheJqhdL2gS-ZAU","1aa461d7502cb53401a7281b54da4728e05cd897527bf4efc262f4c905d7f9c5","ESTABLISHED",0],[12,"/showroom/globe/h-earth/render/geometry-kernel.north.js","https://diamondgatebridge.com/showroom/globe/h-earth/render/geometry-kernel.north.js","H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1",[["./geometry-kernel.north.js","static","/showroom/globe/h-earth/render/geometry-kernel.east.js",59,null],["./geometry-kernel.north.js","static","/showroom/globe/h-earth/render/geometry-kernel.js",49,null],["./geometry-kernel.north.js","static","/showroom/globe/h-earth/render/geometry-kernel.south.js",29,null],["./geometry-kernel.north.js","static","/showroom/globe/h-earth/render/geometry-kernel.west.js",49,null]],"87637991d9c6d2488bdf593a99445c0f9bb1c7107ef2f880c8f7900d68a4b613","1ZC_7nYbtHTddOhKuqL6xIRyY2tMzoJnPrML8qOIlTJE",null,"UNEVALUATED",0],[13,"/showroom/globe/h-earth/render/geometry-kernel.east.js","https://diamondgatebridge.com/showroom/globe/h-earth/render/geometry-kernel.east.js","H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1",[["./geometry-kernel.east.js","static","/showroom/globe/h-earth/render/geometry-kernel.js",93,null],["./geometry-kernel.east.js","static","/showroom/globe/h-earth/render/geometry-kernel.south.js",75,null],["./geometry-kernel.east.js","static","/showroom/globe/h-earth/render/geometry-kernel.west.js",73,null]],"1cd3382135c18bde4356a86a075d62351e3ae9d2763d0a2ca9d404a14421d682","1XHwY1mSPp6ZfraHX_nkqeLyyyqcxMjEicvDaoRlUG80",null,"UNEVALUATED",0],[14,"/showroom/globe/h-earth/render/geometry-kernel.south.js","https://diamondgatebridge.com/showroom/globe/h-earth/render/geometry-kernel.south.js","H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1",[["./geometry-kernel.south.js","static","/showroom/globe/h-earth/render/geometry-kernel.js",121,null],["./geometry-kernel.south.js","static","/showroom/globe/h-earth/render/geometry-kernel.west.js",80,null]],"fe80ca793b367d12c4acd98cb5d8638aed609d327bfb3a4ad68ef26f3f8fb404","1Qi_gvAEgyDlsdL0MLmQdYsyoXFSjtDeTeweYPAuThzo",null,"UNEVALUATED",0],[15,"/showroom/globe/h-earth/render/geometry-kernel.west.js","https://diamondgatebridge.com/showroom/globe/h-earth/render/geometry-kernel.west.js","H_EARTH_3D_GEOMETRY_KERNEL_WEST_FILE_BIRTH_STEP_034O_4W_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_v1",[["./geometry-kernel.west.js","static","/showroom/globe/h-earth/render/geometry-kernel.js",164,null]],"acc4c2d9a1c7b58c0c9438eda885e7b73789bba69b3bc9a2fa2754ef32f067a3","1vPp4m74yVx2CQwtiD10k9yQ3RBV9EA3aMI7GmQaef4Q","bd95314b232086d3a410ddc643557f54c161c24d3134be7ba356d47203b3d970","ESTABLISHED",2],[16,"/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js","https://diamondgatebridge.com/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js","H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1",[["./././h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js","static","/showroom/globe/h-earth/admitted-geometry-frame.js",78,null],["PACKET_002_BRANCH_CANONICAL_URL","dynamic-prebootstrap","/showroom/globe/h-earth/index.html",null,"PUBLIC_ENTRY_EXTENSION_REQUIRED"]],"dc9cb66a29bb084c314dadac11c1690d9fe707b7c10420a8af9019e08ad79f7f","1NpwuHCfCmCsCx-_Z2Uk5XVr7BQmL_4ZfBDuZdkAcQzs","88856e3b3442e752f71a6b8e089fe0cba28b3e51e19a06d5930d5b9947a80f41","ESTABLISHED",0],[17,"/showroom/globe/h-earth/admitted-geometry-frame.js","https://diamondgatebridge.com/showroom/globe/h-earth/admitted-geometry-frame.js","H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_FILE_BIRTH_STEP_034O_7_PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_v1",[["./admitted-geometry-frame.js","static","/showroom/globe/h-earth/compositor.js",46,null],["./admitted-geometry-frame.js","dynamic-prebootstrap","/showroom/globe/h-earth/index.html",null,"PUBLIC_ENTRY_EXTENSION_REQUIRED"],["./admitted-geometry-frame.js","static","/showroom/globe/h-earth/renderer.js",89,null]],"2c28052ee9e1acc8563673f3fd3488904b50a271a29d15d365596406345a22f3","1VO88mo3JILHKiVanhEnAbgoOcHkOkIQ-mZwdJTrFoY8",null,"UNEVALUATED",1],[18,"/showroom/globe/h-earth/compositor.js","https://diamondgatebridge.com/showroom/globe/h-earth/compositor.js","H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1",[["./compositor.js","dynamic-bootstrap","/showroom/globe/h-earth/index.js",null,"PUBLIC_ENTRY_EXTENSION_REQUIRED"],["./compositor.js","static","/showroom/globe/h-earth/renderer.js",84,null]],"8fc2680af7a8324d4f6c8475f10f4388c73d9e384c99cd5388eb0eb26071b684","12z5pEDHEN6IXrZy2e1J4xmKUg8skIlE0MtUME5bCwuE",null,"UNEVALUATED",3],[19,"/showroom/globe/h-earth/renderer.js","https://diamondgatebridge.com/showroom/globe/h-earth/renderer.js","H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1",[["./renderer.js","dynamic-bootstrap","/showroom/globe/h-earth/index.js",null,"PUBLIC_ENTRY_EXTENSION_REQUIRED"]],"c1d1465c0e88004d7aa4914b1c46a2d2a936a89d5504e0892e1f4204386ad33d","1GbZvpQRhMva51daWqMsteCg-I8VF7uJhZaezj5wKZ1E",null,"UNEVALUATED",7]];

const rows = RAW.map(([
  captureOrder,
  repositoryPath,
  requestedDeployedUrl,
  expectedContractId,
  parentTuples,
  driveSha256,
  driveDocumentId,
  repositorySha256,
  repositoryDigestStatus,
  riskMask
]) => ({
  captureOrder,
  repositoryPath,
  requestedDeployedUrl,
  importParents: parentTuples.map(([
    importSpecifier,
    importType,
    parentPath,
    sourceLine,
    registryCoverage
  ]) => ({
    importSpecifier,
    importType,
    parentPath,
    sourceLine,
    ...(registryCoverage ? { registryCoverage } : {})
  })),
  expectedContractId,
  expectedResponseClass: 'ES_MODULE_JAVASCRIPT',
  backedDigest: {
    expectedDigest: driveSha256,
    expectedDigestDomain:
      'SHA-256 over the scan-selected UTF-8 source bytes exported from the designated active Drive occurrence',
    expectedDigestAuthority:
      `ACTIVE_DRIVE_SOURCE_AUTHORITY:${driveDocumentId}`,
    sourceDigestStatus: 'ESTABLISHED',
    documentId: driveDocumentId
  },
  repositoryDigest: {
    expectedDigest: repositorySha256,
    expectedDigestDomain:
      'SHA-256 over the exact bytes of the fixed GitHub repository occurrence',
    expectedDigestAuthority:
      `FIXED_GITHUB_REPOSITORY_OCCURRENCE:smansfield635-create/smansfield635-create.github.io@${H_EARTH_FD05_FIXED_REPOSITORY_COMMIT}`,
    sourceDigestStatus: repositoryDigestStatus
  },
  nativeImportPolicy: 'OBSERVE',
  nativeImportAuthorized: true,
  nativeImportSkipReason: null,
  nativeImportRiskFlags: {
    importTimeReadbacks: Boolean(riskMask & 1),
    persistentModuleLocalState: Boolean(riskMask & 2),
    deferredDomOperations: Boolean(riskMask & 4),
    directDomMutationAtImport: false,
    automaticRuntimeActivation: false,
    freshNetworkRetrievalClaimAuthorized: false,
    independentModuleEvaluationClaimAuthorized: false
  }
}));

export const H_EARTH_FD05_MANIFEST_PROJECTION = freeze({
  manifestId: H_EARTH_FD05_ACCEPTED_MANIFEST_ID,
  manifestDigest: H_EARTH_FD05_ACCEPTED_MANIFEST_DIGEST,
  schemaVersion: 2,
  repositoryFullName:
    'smansfield635-create/smansfield635-create.github.io',
  repositoryBranch: 'main',
  repositoryCommit: H_EARTH_FD05_FIXED_REPOSITORY_COMMIT,
  moduleCount: 19,
  incident: {
    failureDomain: 'FD_05_DEPLOYED_ES_MODULE_IMPORT_GRAPH',
    failedRootBranch: 'PREVIEW',
    failedRootRepositoryPath:
      '/showroom/globe/h-earth/render/geometry-preview.js',
    rootRequest: './render/geometry-preview.js?v=034o6',
    nativeError: {
      name: 'SyntaxError',
      message: "Unexpected token '{'"
    },
    exactFailedTransitiveResponse: 'NOT_IDENTIFIED'
  },
  rows,
  sourceModificationAuthorityStatus:
    H_EARTH_FD05_SOURCE_MODIFICATION_AUTHORITY_STATUS,
  productionClaimAuthority:
    H_EARTH_FD05_PRODUCTION_CLAIM_AUTHORITY
});

const SHA256 = /^[a-f0-9]{64}$/;

export function validateHEarthFd05ManifestProjection(
  manifest = H_EARTH_FD05_MANIFEST_PROJECTION
) {
  const issues = [];
  const orders = new Set();
  const paths = new Set();
  const urls = new Set();

  if (manifest?.manifestId !== H_EARTH_FD05_ACCEPTED_MANIFEST_ID) {
    issues.push('MANIFEST_ID_MISMATCH');
  }
  if (
    manifest?.manifestDigest !== H_EARTH_FD05_ACCEPTED_MANIFEST_DIGEST ||
    !SHA256.test(manifest?.manifestDigest || '')
  ) {
    issues.push('MANIFEST_DIGEST_MISMATCH');
  }
  if (manifest?.repositoryCommit !== H_EARTH_FD05_FIXED_REPOSITORY_COMMIT) {
    issues.push('REPOSITORY_COMMIT_MISMATCH');
  }
  if (!Array.isArray(manifest?.rows) || manifest.rows.length !== 19) {
    issues.push('ROW_COUNT_NOT_19');
  }

  for (const row of manifest?.rows || []) {
    orders.add(row.captureOrder);
    paths.add(row.repositoryPath);
    try {
      urls.add(new URL(row.requestedDeployedUrl).href);
    } catch {
      issues.push(`ROW_DEPLOYED_URL_INVALID:${row.captureOrder}`);
    }
    if (!Array.isArray(row.importParents) || row.importParents.length === 0) {
      issues.push(`ROW_IMPORT_PARENTS_INVALID:${row.captureOrder}`);
    }
    if (!SHA256.test(row.backedDigest?.expectedDigest || '')) {
      issues.push(`ROW_BACKED_DIGEST_INVALID:${row.captureOrder}`);
    }
    if (
      row.repositoryDigest?.sourceDigestStatus === 'ESTABLISHED' &&
      !SHA256.test(row.repositoryDigest?.expectedDigest || '')
    ) {
      issues.push(`ROW_REPOSITORY_DIGEST_INVALID:${row.captureOrder}`);
    }
    if (
      row.nativeImportPolicy !== 'OBSERVE' ||
      row.nativeImportAuthorized !== true ||
      row.nativeImportSkipReason !== null
    ) {
      issues.push(`ROW_NATIVE_IMPORT_POLICY_INVALID:${row.captureOrder}`);
    }
  }

  for (let order = 1; order <= 19; order += 1) {
    if (!orders.has(order)) issues.push(`CAPTURE_ORDER_MISSING:${order}`);
  }
  if (paths.size !== 19) issues.push('REPOSITORY_PATHS_NOT_UNIQUE');
  if (urls.size !== 19) issues.push('DEPLOYED_URLS_NOT_UNIQUE');

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues)
  });
}

export default H_EARTH_FD05_MANIFEST_PROJECTION;
