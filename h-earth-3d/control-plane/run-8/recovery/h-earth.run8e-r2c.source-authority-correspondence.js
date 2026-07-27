const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R2C_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2C_SOURCE_AUTHORITY_GEOMETRY_MATERIAL_AND_PROVENANCE_CORRESPONDENCE_v1';

export const H_EARTH_RUN_8E_R2C_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R2C_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  parentContractId: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1',
  checkpointId: 'RUN_8E_R2C',
  checkpointName: 'SOURCE_AUTHORITY_GEOMETRY_MATERIAL_AND_PROVENANCE_CORRESPONDENCE_AUDIT',
  currentStatus: 'EXECUTION_OPEN',
  predecessor: {
    checkpointId: 'RUN_8E_R2B',
    status: 'PASS_CLOSED',
    exactHead: '39de87edefcc037eaafa8a988dc0c84e40e3d1ba',
    packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    contentDigest: 'fnv1a32:fd913c25',
    custodyManifestDigest: 'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d'
  },
  protectedSourceManifest: {
    liveRenderPackage: {
      path: '/showroom/globe/h-earth/render/live-render-package.run8e-r2.js',
      gitBlobSha: '1699654f39c9e183f4cfc6f75b20ba051641b763'
    },
    neutralPackage: {
      path: '/showroom/globe/h-earth/render/run8e-successor-environment.js',
      gitBlobSha: 'fa6fb8bdc579be109c30a963c2bbdcea398a1d57'
    },
    packet002Transfer: {
      path: '/h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js',
      gitBlobSha: '9d32fd89070fa534d63c3c6a3feb4c8f5fd519f4'
    },
    successorTerrainGeometry: {
      path: '/showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js',
      gitBlobSha: 'a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46'
    },
    shorelineGeometry: {
      path: '/showroom/globe/h-earth/render/geometry-shoreline.js',
      gitBlobSha: '36b6520bc0f6d393ae926cffc21c237521c087e3'
    },
    groundedVegetationGeometry: {
      path: '/showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js',
      gitBlobSha: 'cd7a15e9cc67dbb598ae68c26027fd4ea26bdd5b'
    },
    run8CSurfaceMaterial: {
      path: '/h-earth-3d/environment/h-earth.successor-surface-material.run8c.js',
      gitBlobSha: 'caaef944e0681a98b722f9c99526d38d8f25ec50'
    },
    functionalLandscapeRenderer: {
      path: '/showroom/globe/h-earth/render/renderer.functional-landscape.js',
      gitBlobSha: '71ec6950e1a47c31862b596b4144635a97cbaa20'
    },
    atmosphereState: {
      path: '/h-earth-3d/environment/h-earth.atmosphere-state.js',
      gitBlobSha: '7d50eaf13d0bc719039bc24e571b3dec0dcaf978'
    }
  },
  requiredProofs: [
    'PRIMITIVE_MEMBERSHIP_AND_ORDER_EXACT',
    'GEOMETRY_IDS_POSITIONS_AND_TOPOLOGY_EXACT',
    'SOURCE_NORMALS_EXACT_FOR_ALL_PRIMITIVES',
    'PRIMITIVE_SPANS_AND_ROLE_CODES_EXACT',
    'RUN_8C_TERRAIN_MATERIAL_CHANNELS_EXACT_PER_VERTEX',
    'RUN_6D_SHORELINE_MATERIAL_REFERENCE_INTENT_COLOR_AND_TRANSPARENCY_EXACT',
    'RUN_8E_VEGETATION_MATERIAL_INTENT_COLOR_AND_OPACITY_EXACT',
    'DRAW_RANGE_GROUPING_EXACT',
    'BOUNDS_EXACT',
    'SOURCE_CONTRACT_IDENTITIES_EXACT',
    'SEMANTIC_ADDRESS_PARTITION_COUNTS_AND_UNIQUE_ID_CORPUS_EXACT',
    'FORMATION_AND_SHORELINE_BAND_PROVENANCE_EXACT',
    'LEGACY_PROXY_AND_SUCCESSOR_MOUNTAIN_DISPOSITION_EXACT',
    'RUN_7C_ATMOSPHERE_DEFAULTS_EXACT',
    'PIXEL_IDENTITY_NOT_REQUIRED'
  ],
  semanticProvenancePolicy: {
    packageStoresAggregateCounts: true,
    transferRetainsExactAddressIdCorpus: true,
    auditMustProveTransferPartitionUnionAndDisjointness: true,
    rendererPackageIsNotASecondSemanticRegistry: true
  },
  permittedScope: [
    'R2C_CONTROL_OVERLAY',
    'R2C_READ_ONLY_CORRESPONDENCE_HARNESS',
    'R2C_READ_ONLY_WORKFLOW',
    'R2C_FAILURE_OR_PASS_RECEIPT',
    'PARENT_R2_CHECKPOINT_PROGRESSION_AT_CLOSURE'
  ],
  prohibitedScope: [
    'R2A_OR_R2B_HISTORY_REWRITE',
    'LIVE_RENDER_PACKAGE_SOURCE_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'GEOMETRY_MATERIAL_LIGHT_OR_PROVENANCE_RETUNING',
    'GPU_RESOURCE_CREATION_OR_UPLOAD',
    'WEBGL_CONTEXT_OR_RENDER_LOOP',
    'PUBLIC_ROUTE_BINDING',
    'CAMERA_NAVIGATION_OR_GESTURE_MUTATION',
    'RUN_8E_R2D_OR_LATER_EXECUTION',
    'DEPLOYMENT_OR_RUN_8E_PASS_CLAIM'
  ],
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2C_EXECUTION_OPEN',
    nextCheckpoint: 'RUN_8E_R2D_NOT_STARTED',
    run8ER2DStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2CControl(candidate = H_EARTH_RUN_8E_R2C_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2C_CONTRACT_ID) issues.push('R2C_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.status !== 'PASS_CLOSED') issues.push('R2B_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.exactHead !== '39de87edefcc037eaafa8a988dc0c84e40e3d1ba') issues.push('R2B_EXACT_HEAD_MISMATCH');
  if (Object.keys(candidate?.protectedSourceManifest ?? {}).length !== 9) issues.push('R2C_SOURCE_MANIFEST_INVALID');
  if (candidate?.semanticProvenancePolicy?.rendererPackageIsNotASecondSemanticRegistry !== true) {
    issues.push('R2C_SEMANTIC_PROVENANCE_POLICY_INVALID');
  }
  if (candidate?.stoppingBoundary?.run8ER2DStarted !== false) issues.push('R2D_STARTED_INSIDE_R2C');
  if (!candidate?.prohibitedScope?.includes('LIVE_RENDER_PACKAGE_SOURCE_MUTATION')) {
    issues.push('R2C_PACKAGE_PROTECTION_BOUNDARY_MISSING');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2C_CONTROL_PASS' : 'RUN_8E_R2C_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2C_CONTROL;
