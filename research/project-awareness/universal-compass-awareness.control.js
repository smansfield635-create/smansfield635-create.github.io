import { deepFreeze, deterministicDigest } from "./project-awareness.contract.js";
import {
  FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP
} from "./universal-compass-four-source-capability-map.js";

const REPOSITORY = "smansfield635-create/smansfield635-create.github.io";
const SOURCE_BRANCH = "agent/archcoin-compass-calibration-workspace-001";
const SOURCE_HEAD = "3dd5d4428f50bf373b4646792b8157e2394ffcdc";
const MERGE_BRANCH = "agent/project-awareness-control-plane-merge-001";
const TARGET_BRANCH = "main";

export const ACTIVE_FILES = deepFreeze([
  "/research/project-awareness/project-awareness.contract.js",
  "/research/project-awareness/universal-compass-four-source-capability-map.js",
  "/research/project-awareness/universal-compass-awareness.control.js",
  "/research/project-awareness/receipts/universal-compass-awareness-control-plane-validation-receipt.json"
]);

export const HISTORICAL_FILES = deepFreeze([
  "repository-source-registry.js",
  "authority-and-status-ledger.js",
  "dependency-graph.snapshot.js",
  "awareness-validation.fixtures.js",
  "universal-compass-four-source-cardinal-standard.js",
  "universal-compass-four-source-capability-map.v2.js",
  "universal-compass-awareness-snapshot.v2.js",
  "universal-compass-cardinal-standard.fixtures.js",
  "universal-compass-variable-cardinality-standard.js",
  "universal-compass-four-source-capability-map.v3.js",
  "universal-compass-awareness-snapshot.v3.js",
  "universal-compass-variable-cardinality.fixtures.js",
  "receipts/universal-compass-cardinal-standard-validation-receipt.json",
  "receipts/universal-compass-variable-cardinality-validation-receipt.json"
].map(path => `/research/project-awareness/${path}`));

export const RUNTIME_FILES = deepFreeze([
  ["UNIVERSAL_COMPASS_PLANET", "/prototypes/universal-compass/index.planet.js", "0d462361776288b88584a7272c8e42ea6b14f1fa", "WORLD_TRUTH"],
  ["UNIVERSAL_COMPASS_CRYSTALS", "/prototypes/universal-compass/index.crystals.js", "0bdf6bd08732d72935192dc211014cf7ec84dc15", "VISUAL_INTERPRETATION"],
  ["UNIVERSAL_COMPASS_COMPOSITOR", "/prototypes/universal-compass/index.compositor.js", "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8", "PROJECTION"],
  ["UNIVERSAL_COMPASS_CONTROLLER", "/prototypes/universal-compass/index.controller.js", "7eae298304d53c711adc1714fbc44dcd94f6b065", "ACCEPTED_STATE_TRANSACTION_NAVIGATION"],
  ["UNIVERSAL_COMPASS_INTERACTIONS", "/prototypes/universal-compass/index.interactions.js", "cf06c107a23115a809826b949e306e5c810e60f0", "GESTURE_PROPOSALS"],
  ["UNIVERSAL_COMPASS_HTML", "/prototypes/universal-compass/index.html", "cd1abe75ba93e5733514ad378f52223ec53805b2", "MOUNTS_CONTROLS_LOADING"],
  ["UNIVERSAL_COMPASS_CSS", "/prototypes/universal-compass/index.css", "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa", "PRESENTATION"]
].map(([artifactId, path, blobSha, authority]) =>
  deepFreeze({ artifactId, path, blobSha, authority })
));

export const SOURCE_FAMILIES = deepFreeze([
  "MAIN_COMPASS", "LAW_COMPASS", "SHOWROOM_COMPASS", "ARCHCOIN_COMPASS"
]);
export const CARDINALS = deepFreeze(["NORTH", "EAST", "SOUTH", "WEST"]);

const SEMANTICS = deepFreeze({
  MAIN_COMPASS: ["MAIN_NORTH_WING", "MAIN_EAST_WING", "MAIN_SOUTH_WING", "MAIN_WEST_WING"],
  LAW_COMPASS: ["FLOW", "INTEGRITY", "REALITY", "STRUCTURE"],
  SHOWROOM_COMPASS: ["STORY", "CHARACTERS", "WONDERS", "MYSTERIES"],
  ARCHCOIN_COMPASS: ["CONTRACT", "RECEIVABLE", "PAYABLE", "ALLOCATION"]
});

export const CARDINAL_OCCURRENCES = deepFreeze(
  SOURCE_FAMILIES.flatMap(family => CARDINALS.map((cardinal, index) => deepFreeze({
    occurrenceId: `${family}_${cardinal}_CARDINAL_OCCURRENCE`,
    family,
    cardinal,
    semanticIdentity: SEMANTICS[family][index],
    structuralComparability: true,
    semanticEquivalenceAcrossFamilies: false,
    sourceAuthorityTransferred: false,
    runtimeIdentityTransferred: false
  })))
);

export const MEMBERSHIP_CENSUS = deepFreeze(
  CARDINAL_OCCURRENCES.map(occurrence => deepFreeze({
    censusId: `${occurrence.occurrenceId}_MEMBERSHIP_CENSUS`,
    occurrenceId: occurrence.occurrenceId,
    family: occurrence.family,
    cardinal: occurrence.cardinal,
    status: "UNRESOLVED_SOURCE_INSPECTION_REQUIRED",
    exactMemberCount: null,
    members: deepFreeze([]),
    fixedCardinality: false,
    paddingPermitted: false,
    truncationPermitted: false
  }))
);

const QUERY_IDS = deepFreeze([
  "ARCHITECTURE_REVIEW", "ACTIVE_FILES", "HISTORICAL_FILES", "MERGE_BOUNDARY",
  "RUNTIME_FILES", "SOURCE_FAMILIES", "SOURCE_RECORDS_BY_FAMILY",
  "CAPABILITIES_BY_DESTINATION", "CARDINAL_OCCURRENCES", "MEMBERSHIP_CENSUS",
  "PASS_GATES", "CURRENT_STATE"
]);

function factValue(value) {
  return value && typeof value === "object" && "value" in value ? value.value : value;
}

const BODY = {
  artifactId: "UNIVERSAL_COMPASS_AWARENESS_CONTROL_PLANE_v1",
  schema: "DGB_UNIVERSAL_COMPASS_AWARENESS_CONTROL_PLANE_v1",
  mode: "READ_ONLY_CONTROL_PLANE",
  repositoryIdentity: REPOSITORY,
  sourceBranch: SOURCE_BRANCH,
  sourceHead: SOURCE_HEAD,
  mergeBranch: MERGE_BRANCH,
  targetBranch: TARGET_BRANCH,
  baseMapArtifactId: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.artifactId,
  baseMapDigest: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.deterministicDigest,
  architectureReview: deepFreeze({
    conclusion: "CONSOLIDATED_ACTIVE_CONTROL_PLANE_WITH_HISTORY_PRESERVED",
    stableKernel: ACTIVE_FILES[0],
    detailedSourceMap: ACTIVE_FILES[1],
    controllingFacade: ACTIVE_FILES[2],
    durableReceipt: ACTIVE_FILES[3],
    historicalFiles: HISTORICAL_FILES,
    excludedReasons: deepFreeze([
      "STALE_BRANCH_AND_COMMIT_ANCHORS",
      "OBSOLETE_RETIRED_SUPPORT_RECOVERY_QUESTIONS",
      "DUPLICATE_VERSIONED_CARDINALITY_STATE",
      "MULTIPLE_COMPETING_SNAPSHOTS_AND_FIXTURES"
    ])
  }),
  activeFiles: ACTIVE_FILES,
  historicalFiles: HISTORICAL_FILES,
  mergeBoundary: deepFreeze({
    allowedPathPrefix: "/research/project-awareness/",
    awarenessOnlyDiffRequired: true,
    runtimeFilesPermitted: false,
    sourceCompassFilesPermitted: false,
    productFilesPermitted: false,
    independentRuntimeMergeCorridor: true,
    autonomousMergeAuthority: false,
    productAuthority: false,
    runtimeAuthority: false
  }),
  runtimeBoundary: deepFreeze({
    exactFileCount: 7,
    files: RUNTIME_FILES,
    eighthRuntimeFilePermitted: false,
    awarenessRuntimeImportPermitted: false
  }),
  authorityChain: deepFreeze([
    "PLANET_WORLD_TRUTH",
    "CRYSTALS_VISUAL_INTERPRETATION",
    "COMPOSITOR_PROJECTION",
    "CONTROLLER_ACCEPTED_STATE_TRANSACTION_NAVIGATION",
    "INTERACTIONS_GESTURE_PROPOSALS",
    "HTML_MOUNTS_CONTROLS_LOADING",
    "CSS_PRESENTATION"
  ]),
  sourceModel: deepFreeze({
    families: SOURCE_FAMILIES,
    cardinals: CARDINALS,
    cardinalOccurrences: CARDINAL_OCCURRENCES,
    membershipCensus: MEMBERSHIP_CENSUS,
    variableClusterCardinality: true,
    fixedFourMemberRule: false,
    fixedSixtyFourObservationRule: false,
    universalSixteenChildRule: false,
    observationCountRule: "SUM_ACTUAL_MEMBERS_AFTER_CENSUS"
  }),
  capabilityModel: deepFreeze({
    sourceRecords: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.sourceRecords,
    destinationRecords: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.destinationRecords,
    capabilityMatrix: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.capabilityMatrix,
    absenceRecords: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.absenceRecords,
    conflictRecords: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.knownConflictAndBoundaryRecords,
    sourceSelectionRules: UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.sourceSelectionRules
  }),
  passGates: deepFreeze({
    awarenessArchitectureReviewed: true,
    awarenessMergeReady: true,
    membershipCensusComplete: false,
    planetMutationReady: false,
    runtimeExecutable: false,
    runtimeAccepted: false,
    nextAwarenessTarget: "FOUR_SOURCE_SIXTEEN_OCCURRENCE_MEMBERSHIP_CENSUS",
    nextRuntimeTarget: "BLOCKED_UNTIL_MEMBERSHIP_CENSUS_COMPLETE"
  }),
  simultaneousUse: deepFreeze({
    usableDuringSevenFileConstruction: true,
    mode: "READ_ONLY_QUERY_AND_RECEIPT_SUPPORT",
    automaticSourceSelection: false,
    automaticRuntimeMutation: false,
    automaticAcceptance: false
  }),
  queryIds: QUERY_IDS,
  productAuthority: false,
  runtimeAuthority: false,
  mutationAuthority: false,
  implementationAuthority: false
};

export const UNIVERSAL_COMPASS_AWARENESS_CONTROL = deepFreeze({
  ...BODY,
  deterministicDigest: deterministicDigest(BODY)
});

export function queryUniversalCompassAwareness(queryId, options = {}) {
  if (!QUERY_IDS.includes(queryId)) {
    throw new RangeError(`UNIVERSAL_COMPASS_AWARENESS_QUERY_NOT_PERMITTED:${queryId}`);
  }
  let answer;
  switch (queryId) {
    case "ARCHITECTURE_REVIEW": answer = BODY.architectureReview; break;
    case "ACTIVE_FILES": answer = ACTIVE_FILES; break;
    case "HISTORICAL_FILES": answer = HISTORICAL_FILES; break;
    case "MERGE_BOUNDARY": answer = BODY.mergeBoundary; break;
    case "RUNTIME_FILES": answer = RUNTIME_FILES; break;
    case "SOURCE_FAMILIES": answer = SOURCE_FAMILIES; break;
    case "SOURCE_RECORDS_BY_FAMILY": {
      const family = String(options.family || "").trim().toUpperCase();
      answer = BODY.capabilityModel.sourceRecords.filter(
        record => factValue(record.facts.family) === family
      );
      break;
    }
    case "CAPABILITIES_BY_DESTINATION": {
      const owner = String(options.destinationOwner || "").trim().toUpperCase();
      answer = BODY.capabilityModel.capabilityMatrix.filter(
        record => record.destinationOwner === owner
      );
      break;
    }
    case "CARDINAL_OCCURRENCES": answer = CARDINAL_OCCURRENCES; break;
    case "MEMBERSHIP_CENSUS": answer = MEMBERSHIP_CENSUS; break;
    case "PASS_GATES": answer = BODY.passGates; break;
    case "CURRENT_STATE": answer = deepFreeze({
      activeFileCount: ACTIVE_FILES.length,
      runtimeFileCount: RUNTIME_FILES.length,
      sourceFamilyCount: SOURCE_FAMILIES.length,
      cardinalOccurrenceCount: CARDINAL_OCCURRENCES.length,
      unresolvedCensusCount: MEMBERSHIP_CENSUS.length,
      awarenessMergeReady: BODY.passGates.awarenessMergeReady,
      planetMutationReady: BODY.passGates.planetMutationReady
    }); break;
    default: throw new RangeError(`UNIVERSAL_COMPASS_AWARENESS_QUERY_NOT_IMPLEMENTED:${queryId}`);
  }
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_AWARENESS_QUERY_RESULT_v1",
    queryId,
    controlDigest: UNIVERSAL_COMPASS_AWARENESS_CONTROL.deterministicDigest,
    answer
  });
}

function finding(id, pass, details = null) {
  return deepFreeze({ id, pass: Boolean(pass), status: pass ? "PASS" : "FAIL", details });
}

export function validateUniversalCompassAwarenessControl(candidate = UNIVERSAL_COMPASS_AWARENESS_CONTROL) {
  const findings = [];
  const add = (id, pass, details = null) => findings.push(finding(id, pass, details));
  add("BASE_MAP_VALID", FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT.status === "PASS");
  add("READ_ONLY_NO_AUTHORITY", candidate.mode === "READ_ONLY_CONTROL_PLANE" &&
    !candidate.productAuthority && !candidate.runtimeAuthority &&
    !candidate.mutationAuthority && !candidate.implementationAuthority);
  add("FOUR_ACTIVE_FILES", candidate.activeFiles.length === 4);
  add("HISTORY_EXCLUDED_FROM_ACTIVE_SET", candidate.historicalFiles.every(
    path => !candidate.activeFiles.includes(path)));
  add("AWARENESS_ONLY_MERGE", candidate.mergeBoundary.awarenessOnlyDiffRequired &&
    !candidate.mergeBoundary.runtimeFilesPermitted &&
    !candidate.mergeBoundary.sourceCompassFilesPermitted &&
    !candidate.mergeBoundary.productFilesPermitted);
  add("EXACT_SEVEN_RUNTIME_FILES", candidate.runtimeBoundary.exactFileCount === 7 &&
    candidate.runtimeBoundary.files.length === 7 &&
    new Set(candidate.runtimeBoundary.files.map(record => record.path)).size === 7);
  add("NO_EIGHTH_FILE_OR_AWARENESS_IMPORT", !candidate.runtimeBoundary.eighthRuntimeFilePermitted &&
    !candidate.runtimeBoundary.awarenessRuntimeImportPermitted);
  add("FOUR_FAMILIES", candidate.sourceModel.families.length === 4);
  add("SIXTEEN_CARDINAL_OCCURRENCES", candidate.sourceModel.cardinals.length === 4 &&
    candidate.sourceModel.cardinalOccurrences.length === 16);
  add("VARIABLE_CARDINALITY", candidate.sourceModel.variableClusterCardinality &&
    !candidate.sourceModel.fixedFourMemberRule &&
    !candidate.sourceModel.fixedSixtyFourObservationRule &&
    !candidate.sourceModel.universalSixteenChildRule);
  add("CENSUS_EXPLICIT_UNRESOLVED", candidate.sourceModel.membershipCensus.length === 16 &&
    candidate.sourceModel.membershipCensus.every(record =>
      record.status === "UNRESOLVED_SOURCE_INSPECTION_REQUIRED" &&
      record.exactMemberCount === null && !record.fixedCardinality));
  add("NO_PADDING_OR_TRUNCATION", candidate.sourceModel.membershipCensus.every(
    record => !record.paddingPermitted && !record.truncationPermitted));
  add("PLANET_BLOCKED_UNTIL_CENSUS", !candidate.passGates.membershipCensusComplete &&
    !candidate.passGates.planetMutationReady);
  add("AWARENESS_MERGE_READY", candidate.passGates.awarenessArchitectureReviewed &&
    candidate.passGates.awarenessMergeReady);
  add("SIMULTANEOUS_READ_ONLY_USE", candidate.simultaneousUse.usableDuringSevenFileConstruction &&
    candidate.simultaneousUse.mode === "READ_ONLY_QUERY_AND_RECEIPT_SUPPORT" &&
    !candidate.simultaneousUse.automaticSourceSelection &&
    !candidate.simultaneousUse.automaticRuntimeMutation);
  add("QUERY_SURFACE", QUERY_IDS.every(id => {
    if (id === "SOURCE_RECORDS_BY_FAMILY") return queryUniversalCompassAwareness(id, { family: "MAIN_COMPASS" }).queryId === id;
    if (id === "CAPABILITIES_BY_DESTINATION") return queryUniversalCompassAwareness(id, { destinationOwner: "UNIVERSAL_COMPASS_PLANET" }).queryId === id;
    return queryUniversalCompassAwareness(id).queryId === id;
  }));
  const digestBody = { ...candidate };
  delete digestBody.deterministicDigest;
  const recomputed = deterministicDigest(digestBody);
  add("DIGEST_MATCH", candidate.deterministicDigest === recomputed,
    { recorded: candidate.deterministicDigest, recomputed });
  const state = queryUniversalCompassAwareness("CURRENT_STATE").answer;
  add("CURRENT_STATE_COHERENT", state.activeFileCount === 4 &&
    state.runtimeFileCount === 7 && state.sourceFamilyCount === 4 &&
    state.cardinalOccurrenceCount === 16 && state.unresolvedCensusCount === 16 &&
    state.awarenessMergeReady && !state.planetMutationReady, state);

  const failed = findings.filter(record => !record.pass);
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_AWARENESS_CONTROL_PLANE_VALIDATION_RECEIPT_v1",
    receiptId: "UNIVERSAL_COMPASS_AWARENESS_CONTROL_PLANE_VALIDATION_v1",
    status: failed.length ? "FAIL" : "PASS",
    assertionCount: findings.length,
    passed: findings.length - failed.length,
    failed: failed.length,
    controlArtifactId: candidate.artifactId,
    controlDigest: candidate.deterministicDigest,
    baseMapArtifactId: candidate.baseMapArtifactId,
    baseMapDigest: candidate.baseMapDigest,
    sourceBranch: candidate.sourceBranch,
    sourceHead: candidate.sourceHead,
    mergeBranch: candidate.mergeBranch,
    targetBranch: candidate.targetBranch,
    findings,
    claims: deepFreeze({
      awarenessArchitectureReviewed: true,
      activeAwarenessFileCount: candidate.activeFiles.length,
      awarenessOnlyMergeBoundary: true,
      sevenRuntimeFilesPreserved: true,
      awarenessRuntimeImports: 0,
      variableClusterCardinality: true,
      membershipCensusComplete: false,
      awarenessMergeReady: true,
      planetMutationReady: false,
      runtimePass: false,
      productAuthority: false,
      mutationAuthority: false
    })
  });
}

export const UNIVERSAL_COMPASS_AWARENESS_CONTROL_VALIDATION_RECEIPT =
  validateUniversalCompassAwarenessControl();

if (UNIVERSAL_COMPASS_AWARENESS_CONTROL_VALIDATION_RECEIPT.status !== "PASS") {
  const error = new Error("UNIVERSAL_COMPASS_AWARENESS_CONTROL_PLANE_VALIDATION_FAILED");
  error.receipt = UNIVERSAL_COMPASS_AWARENESS_CONTROL_VALIDATION_RECEIPT;
  throw error;
}

if ((globalThis.process?.argv?.[1] || "").endsWith("universal-compass-awareness.control.js")) {
  globalThis.console?.log(JSON.stringify(
    UNIVERSAL_COMPASS_AWARENESS_CONTROL_VALIDATION_RECEIPT, null, 2
  ));
}
