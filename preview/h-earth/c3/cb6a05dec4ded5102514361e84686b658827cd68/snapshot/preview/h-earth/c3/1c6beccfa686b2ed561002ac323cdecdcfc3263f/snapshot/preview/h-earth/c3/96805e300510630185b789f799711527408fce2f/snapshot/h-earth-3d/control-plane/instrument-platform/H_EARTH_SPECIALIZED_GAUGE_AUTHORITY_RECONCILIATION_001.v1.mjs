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
      status: 'PASS_CLOSED',
      branchHead: '2f811a1fa5896c04267e58bd2f996e31f8e995c4',
      receiptSha256: '78f1f093a32365e2521b79c1d8d02194b9e17a3557772f1f2c64a00a231e4a30',
      stoppingBoundary: 'STOP_AFTER_SOURCE_IMPLEMENTATION_FETCH_BACK_BEFORE_DETERMINISTIC_KERNEL_EXECUTION'
    },
    A4: {
      status: 'PASS_CLOSED',
      assertionCount: 49,
      deterministicGaugeReceiptDigest: 'fnv1a32:0117a46f',
      receiptDigest: 'fnv1a32:f03a97e7',
      receiptSha256: '66404327e5ff0fa4b81bafd24fa81d72d2968661cb02e43665f52b37a02bad8c',
      browserExecutionPerformed: false,
      liveRouteExecutionPerformed: false,
      stoppingBoundary: 'STOP_AFTER_DETERMINISTIC_KERNEL_EXECUTION'
    },
    A5: {
      status: 'PASS_CLOSED',
      finalExecutedSyntheticMergeHead: 'fa31f1ac74767784c78793f12bcae0d77ed213bc',
      requiredApplicableChecks: 11,
      requiredApplicablePasses: 11,
      requiredApplicableFailures: 0,
      requiredApplicableUnresolved: 0,
      readinessPercent: 100,
      mergeEligible: true,
      unifiedPlatformAdapterReceiptMatched: true,
      browserConsoleErrorCount: 0,
      browserPageErrorCount: 0,
      browserHttpErrorCount: 0,
      finalBrowserCanonicalReceiptSha256: '3833522c8b4449cb13205862959dd8eed28663da18acd0eb72b01af8f833abaa',
      finalWorkflowRunId: 30586808973,
      stoppingBoundary: 'STOP_AFTER_EXACT_BROWSER_EXECUTION'
    },
    A6: {
      status: 'PASS_CLOSED',
      auditedCandidateHead: '68ce8625d868f2ece5f24240bb95724c8db93c5b',
      exactChangedPathCount: 9,
      showroomProductPathsChanged: 0,
      terrainPathsChanged: 0,
      rendererPathsChanged: 0,
      liveBindingPathsChanged: 0,
      navigationPathsChanged: 0,
      defaultHEarthSourceUnchanged: true,
      defaultHEarthRuntimeUnchanged: true,
      noRejectedVisualContentBoundToLive: 'PASS',
      liveProductAndToolingPathsRemainSeparate: 'PASS',
      stoppingBoundary: 'STOP_AFTER_PRODUCT_NON_MUTATION_AND_SEPARATION_AUDIT'
    },
    A7: {
      status: 'HELD_VERIFICATION_EVIDENCE_TRANSPORT_BLOCKER',
      firstMergeCommit: '113a6f3aa986c8bd6446ab0d90064f0213ad47ba',
      implementationReclassifiedAsFailed: false,
      preMergeA5PassMaySubstituteForPublicExecution: false,
      correctionAttemptCount: 1,
      maximumCorrectionAttemptCount: 1,
      correctionBranch: 'agent/h-earth-specialized-gauge-authority-reconciliation-a7-evidence-transport-001',
      supersededCarrierPr: 402,
      correctionScope: [
        '.github/workflows/h-earth-specialized-gauge-authority-reconciliation.yml',
        'h-earth-3d/control-plane/instrument-platform/H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001.v1.mjs'
      ],
      correctionChangesVerificationLogic: false,
      correctionChangesProduct: false,
      requiredSuccessTransport: 'H_EARTH_A7_PUBLIC_EXECUTION_RECEIPT_v1_COMMENT_ON_PR_401',
      stopIfReceiptNotPublished: true
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
  fullOperationPathScope: [
    '.github/workflows/h-earth-instrument-platform.yml',
    '.github/workflows/h-earth-specialized-gauge-authority-reconciliation.yml',
    'gauges/h-earth/h-earth.current-authority-gauge.v3.mjs',
    'gauges/h-earth/index.html',
    'h-earth-3d/control-plane/instrument-platform/H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001.v1.mjs',
    'h-earth-3d/tools/instrument-platform/instrument-adapters.mjs',
    'h-earth-3d/tools/instrument-platform/tool-registry.mjs',
    'h-earth-3d/validation/instrument-platform/h-earth.specialized-gauge-authority-reconciliation.browser.mjs',
    'h-earth-3d/validation/instrument-platform/h-earth.specialized-gauge-authority-reconciliation.runner.mjs'
  ],
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
  nextCheckpoint: 'A7_PUBLIC_EXECUTION_RECEIPT'
});

export default H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001;
