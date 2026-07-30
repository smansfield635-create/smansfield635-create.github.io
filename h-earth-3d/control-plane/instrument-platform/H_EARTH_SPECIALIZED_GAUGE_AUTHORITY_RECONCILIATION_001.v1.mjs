const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((member) => freeze(member, seen));
  return Object.freeze(value);
};

export const H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001 = freeze({
  schemaVersion: 'H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_CONTROL_v1',
  operationId: 'H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001',
  operationClass: 'INTERNAL_INSTRUMENT_CORRECTION_ONLY',
  exactBase: '6037cdad3bde1dfcac1aec253d5ad079fc1df1f5',
  rollbackTarget: '6037cdad3bde1dfcac1aec253d5ad079fc1df1f5',
  checkpoints: {
    A0: {
      status: 'PASS_CLOSED',
      receiptSha256: 'cb1e5924a08716ec185a1848fa94ba7f006fd8053a7bb18a4a04b219f85b710f'
    },
    A1: {
      status: 'PASS_CLOSED',
      explicitlyClassifiedLegacyRows: 11,
      unresolvedLegacyRows: 0,
      receiptSha256: '06822bc586afbbd36078da2846c220019943da4668d938eab58007d4439f636b'
    },
    A2: {
      status: 'PASS_CLOSED',
      currentAuthorityCheckCount: 11,
      resultDomain: [
        'PASS',
        'FAIL',
        'HELD_BY_CURRENT_AUTHORITY',
        'SUPERSEDED',
        'NOT_APPLICABLE',
        'UNRESOLVED'
      ],
      readinessLaw: 'REQUIRED_APPLICABLE_PASSES_DIVIDED_BY_REQUIRED_APPLICABLE_CHECKS',
      specificationSha256: '7c326be426256106753de89c951a0d26b7308bec30c040ce559884bc35e68b52'
    },
    A3: {
      status: 'SOURCE_IMPLEMENTATION_CANDIDATE',
      stoppingBoundary: 'STOP_AFTER_SOURCE_IMPLEMENTATION_FETCH_BACK_BEFORE_DETERMINISTIC_KERNEL_EXECUTION'
    }
  },
  authorizedA3MutationManifest: {
    exactChangedPaths: [
      'gauges/h-earth/index.html',
      'gauges/h-earth/h-earth.current-authority-gauge.v3.mjs',
      'h-earth-3d/tools/instrument-platform/tool-registry.mjs',
      'h-earth-3d/tools/instrument-platform/instrument-adapters.mjs',
      'h-earth-3d/control-plane/instrument-platform/H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001.v1.mjs'
    ],
    productPathsChanged: [],
    liveHEarthPathsChanged: [],
    narrativePresentationPathsChanged: []
  },
  registryIdentityTransition: {
    baseToolRegistryDigest: 'fnv1a32:459c71ce',
    candidateToolRegistryDigest: 'fnv1a32:3651f363',
    permanentSceneRegistryDigest: 'fnv1a32:b996656d',
    sceneRegistryMutation: false
  },
  boundaries: {
    readOnlyGauge: true,
    repositoryWriteCapabilityExposedToGauge: false,
    liveBindingChangeCapabilityExposedToGauge: false,
    productAcceptanceCapabilityExposedToGauge: false,
    liveHEarthMutationAuthorized: false,
    showroomProductMutationAuthorized: false,
    narrativePresentationMutationAuthorized: false,
    userDifferentialRequired: false
  },
  nextCheckpoint: 'A4_DETERMINISTIC_GAUGE_KERNEL_VERIFICATION'
});

export default H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001;
