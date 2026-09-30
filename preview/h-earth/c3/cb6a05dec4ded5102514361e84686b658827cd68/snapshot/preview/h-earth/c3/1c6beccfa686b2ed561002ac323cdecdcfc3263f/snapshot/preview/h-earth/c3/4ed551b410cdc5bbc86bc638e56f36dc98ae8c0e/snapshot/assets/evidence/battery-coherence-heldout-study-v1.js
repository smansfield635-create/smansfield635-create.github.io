(() => {
  "use strict";

  globalThis.DGB_BATTERY_COHERENCE_HELDOUT_STUDY_V1 = Object.freeze({
    studyId: "BATTERY_COHERENCE_HELDOUT_STUDY_v1",
    status: "DOMAIN_SPECIFIC_HELD_OUT_EMPIRICAL_SUPPORT",
    evaluationDesign: "CELL_DISJOINT_HELD_OUT",
    evaluationCycles: 1653,
    unseenBatteries: Object.freeze(["CS2_34", "CS2_36", "CS2_38"]),
    target: Object.freeze({ event: "CROSS_BELOW_80_PERCENT_RETAINED_CAPACITY", horizonCycles: 20 }),
    results: Object.freeze({
      axisLogisticAuroc: 0.9394,
      burdenAuroc: 0.9704,
      hStarAuroc: 0.7712,
      weakestAxisRiskAuroc: 0.6743,
      rawPhysicalBaselineAuroc: 0.7850,
      rawPlusHStarAuroc: 0.7770,
      hStarIncrementalDelta: -0.0080,
      mqTruePositives: 0,
      mqSensitivity: 0,
      mqBalancedAccuracy: 0.4994
    }),
    interpretation: Object.freeze({
      supported: "The B/P/E/I/V representation contained strong transferable information about near-term physical degradation in unseen batteries.",
      unresolved: "Burden may substantially encode cycle age, accumulated throughput, current capacity, or degradation trend.",
      hStar: "H* showed standalone discrimination but no incremental advantage over the raw physical model.",
      weakestAxis: "Weakest-axis risk was above chance but provides preliminary support only.",
      mq: "The current hard MQ conjunction was not supported in this realization."
    }),
    requiredControls: Object.freeze(["cycle number", "cumulative throughput", "current capacity", "recent degradation slope", "burden ablation", "raw-plus-axes incremental comparison", "cell-family and chemistry transfer", "external dataset replication"]),
    claimBoundary: Object.freeze({
      domainSpecificSignal: true,
      novelMechanismEstablished: false,
      weakestAxisLawEstablished: false,
      hStarIncrementalSuperiority: false,
      hardMqThresholdSupported: false,
      universalCoherenceLawValidated: false,
      independentReplicationComplete: false
    }),
    sourceOfTruth: "Drive-backed cross-domain study controls and battery execution artifacts",
    presentationAuthorityOnly: true
  });
})();
