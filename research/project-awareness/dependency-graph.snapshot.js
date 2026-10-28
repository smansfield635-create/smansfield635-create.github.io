import {
  PROJECT_AWARENESS_CONTRACT,
  createFact,
  createProjectAwarenessSnapshot,
  deepFreeze
} from "./project-awareness.contract.js";
import {
  ARTIFACT_RECORDS,
  BRANCH_IDENTITY,
  INSPECTED_COMMIT,
  REPOSITORY_IDENTITY,
  REPOSITORY_INSPECTION,
  UNIVERSAL_COMPASS_SHELL_RECORDS
} from "./repository-source-registry.js";
import {
  AUTHORITY_RECORDS,
  BASELINE_VALIDATION_RECEIPTS,
  PERMITTED_OPERATIONS,
  PROHIBITED_OPERATIONS,
  SUPERSESSION_RELATIONS,
  UNRESOLVED_QUESTIONS
} from "./authority-and-status-ledger.js";

function edgeFact(value, {
  evidencePosture = "DECLARED",
  supportingPath = null,
  blobSha = null,
  derivedFrom = null,
  unresolvedReason = null
} = {}) {
  return createFact({
    value,
    evidencePosture,
    repositoryIdentity: REPOSITORY_IDENTITY,
    inspectedCommit: INSPECTED_COMMIT,
    branchIdentity: BRANCH_IDENTITY,
    sourcePath: supportingPath,
    blobSha,
    declaredBy: "PROJECT_AWARENESS_CONVERSION_CHECKPOINT",
    derivedFrom,
    verifiedAt: evidencePosture === "VERIFIED" ? "2026-07-23T19:56:08Z" : null,
    unresolvedReason
  });
}

function relation(fromArtifactId, relationType, toArtifactId, supportingPath, evidencePosture = "DECLARED", unresolvedReason = null) {
  if (!PROJECT_AWARENESS_CONTRACT.relationTypes.includes(relationType)) {
    throw new TypeError(`PROJECT_AWARENESS_RELATION_TYPE_INVALID:${relationType}`);
  }
  return deepFreeze({
    schema: "DGB_DEPENDENCY_RELATION_v1",
    recordKind: "DEPENDENCY_RELATION",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      fromArtifactId: edgeFact(fromArtifactId, { evidencePosture, supportingPath, unresolvedReason }),
      relation: edgeFact(relationType, { evidencePosture, supportingPath, unresolvedReason }),
      toArtifactId: edgeFact(toArtifactId, { evidencePosture, supportingPath, unresolvedReason }),
      supportingPath: edgeFact(supportingPath, { evidencePosture, supportingPath, unresolvedReason }),
      inspectedCommit: edgeFact(INSPECTED_COMMIT, { evidencePosture: "VERIFIED", supportingPath }),
      executableVerification: edgeFact(false, {
        evidencePosture: "DECLARED",
        supportingPath,
        derivedFrom: "COMPATIBILITY_WORK_NOT_COMPLETED"
      })
    }
  });
}

export const DEPENDENCY_RELATIONS = deepFreeze([
  relation("UNIVERSAL_COMPASS_PLANET", "PRODUCES", "IMMUTABLE_WORLD_TRUTH", "/prototypes/universal-compass/index.planet.js"),
  relation("UNIVERSAL_COMPASS_PLANET", "PRODUCES", "PLANET_SNAPSHOT", "/prototypes/universal-compass/index.planet.js"),
  relation("UNIVERSAL_COMPASS_PLANET", "DECLARES_AUTHORITY_OVER", "IMMUTABLE_WORLD_TRUTH", "/prototypes/universal-compass/index.planet.js"),
  relation("UNIVERSAL_COMPASS_CRYSTALS", "CONSUMES", "UNIVERSAL_COMPASS_PLANET", "/prototypes/universal-compass/index.crystals.js"),
  relation("UNIVERSAL_COMPASS_CRYSTALS", "CONSUMES", "PLANET_SNAPSHOT", "/prototypes/universal-compass/index.crystals.js"),
  relation("UNIVERSAL_COMPASS_CRYSTALS", "PRODUCES", "VISUAL_RECORDS", "/prototypes/universal-compass/index.crystals.js"),
  relation("UNIVERSAL_COMPASS_CRYSTALS", "PRODUCES", "COMPOSITOR_INPUT", "/prototypes/universal-compass/index.crystals.js"),
  relation("UNIVERSAL_COMPASS_CRYSTALS", "PROHIBITED_FROM_OWNING", "IMMUTABLE_WORLD_TRUTH", "/prototypes/universal-compass/index.crystals.js"),
  relation("UNIVERSAL_COMPASS_COMPOSITOR", "CONSUMES", "PLANET_SNAPSHOT", "/prototypes/universal-compass/index.compositor.js"),
  relation("UNIVERSAL_COMPASS_COMPOSITOR", "CONSUMES", "CRYSTAL_INPUT", "/prototypes/universal-compass/index.compositor.js"),
  relation("UNIVERSAL_COMPASS_COMPOSITOR", "CONSUMES", "CONTROLLER_PRESENTATION_CONTEXT", "/prototypes/universal-compass/index.compositor.js"),
  relation("UNIVERSAL_COMPASS_COMPOSITOR", "PRODUCES", "PROJECTION_SNAPSHOT", "/prototypes/universal-compass/index.compositor.js"),
  relation("UNIVERSAL_COMPASS_COMPOSITOR", "DECLARES_AUTHORITY_OVER", "PROJECTION_SNAPSHOT", "/prototypes/universal-compass/index.compositor.js"),
  relation("UNIVERSAL_COMPASS_INTERACTIONS", "CONSUMES", "COMPOSITOR_INTERACTION_PROJECTIONS", "/prototypes/universal-compass/index.interactions.js"),
  relation("UNIVERSAL_COMPASS_INTERACTIONS", "PRODUCES", "LOCAL_INTERACTION_PROPOSALS", "/prototypes/universal-compass/index.interactions.js"),
  relation("UNIVERSAL_COMPASS_CONTROLLER", "CONSUMES", "LOCAL_INTERACTION_PROPOSALS", "/prototypes/universal-compass/index.controller.js"),
  relation("UNIVERSAL_COMPASS_CONTROLLER", "PRODUCES", "ACCEPTED_STATE", "/prototypes/universal-compass/index.controller.js"),
  relation("UNIVERSAL_COMPASS_HTML", "LOADS", "UNIVERSAL_COMPASS_PLANET", "/prototypes/universal-compass/index.html", "UNRESOLVED", "FINAL_SCRIPT_LOADING_ORDER_UNRESOLVED"),
  relation("UNIVERSAL_COMPASS_HTML", "LOADS", "UNIVERSAL_COMPASS_CRYSTALS", "/prototypes/universal-compass/index.html", "UNRESOLVED", "FINAL_SCRIPT_LOADING_ORDER_UNRESOLVED"),
  relation("UNIVERSAL_COMPASS_HTML", "LOADS", "UNIVERSAL_COMPASS_COMPOSITOR", "/prototypes/universal-compass/index.html", "UNRESOLVED", "FINAL_SCRIPT_LOADING_ORDER_UNRESOLVED"),
  relation("UNIVERSAL_COMPASS_HTML", "LOADS", "UNIVERSAL_COMPASS_CONTROLLER", "/prototypes/universal-compass/index.html", "UNRESOLVED", "FINAL_SCRIPT_LOADING_ORDER_UNRESOLVED"),
  relation("UNIVERSAL_COMPASS_HTML", "LOADS", "UNIVERSAL_COMPASS_INTERACTIONS", "/prototypes/universal-compass/index.html", "UNRESOLVED", "FINAL_SCRIPT_LOADING_ORDER_UNRESOLVED"),
  relation("UNIVERSAL_COMPASS_HTML", "PROVIDES", "RUNTIME_MOUNTS", "/prototypes/universal-compass/index.html"),
  relation("UNIVERSAL_COMPASS_HTML", "PROVIDES", "SEMANTIC_CONTROLS", "/prototypes/universal-compass/index.html"),
  relation("UNIVERSAL_COMPASS_CSS", "PRESENTS", "PUBLISHED_STATE", "/prototypes/universal-compass/index.css"),
  relation("UNIVERSAL_COMPASS_PLANET", "COPIED_FROM", "SOURCE_UNIVERSAL_COMPASS_PLANET", "/prototypes/universal-compass/index.planet.js", "VERIFIED"),
  relation("UNIVERSAL_COMPASS_CRYSTALS", "COPIED_FROM", "SOURCE_UNIVERSAL_COMPASS_CRYSTALS", "/prototypes/universal-compass/index.crystals.js", "VERIFIED"),
  relation("UNIVERSAL_COMPASS_COMPOSITOR", "COPIED_FROM", "SOURCE_UNIVERSAL_COMPASS_COMPOSITOR", "/prototypes/universal-compass/index.compositor.js", "VERIFIED"),
  relation("UNIVERSAL_COMPASS_CONTROLLER", "COPIED_FROM", "SOURCE_UNIVERSAL_COMPASS_CONTROLLER", "/prototypes/universal-compass/index.controller.js", "VERIFIED"),
  relation("UNIVERSAL_COMPASS_INTERACTIONS", "COPIED_FROM", "SOURCE_UNIVERSAL_COMPASS_INTERACTIONS", "/prototypes/universal-compass/index.interactions.js", "VERIFIED"),
  relation("UNIVERSAL_COMPASS_HTML", "COPIED_FROM", "SOURCE_UNIVERSAL_COMPASS_HTML", "/prototypes/universal-compass/index.html", "VERIFIED"),
  relation("UNIVERSAL_COMPASS_CSS", "COPIED_FROM", "SOURCE_UNIVERSAL_COMPASS_CSS", "/prototypes/universal-compass/index.css", "VERIFIED")
]);

export const DEPENDENCY_GRAPH_SNAPSHOT = deepFreeze({
  schema: "DGB_DEPENDENCY_GRAPH_SNAPSHOT_v1",
  inspectedCommit: edgeFact(INSPECTED_COMMIT, { evidencePosture: "VERIFIED" }),
  dependencyRelations: DEPENDENCY_RELATIONS
});

export const PROJECT_AWARENESS_SNAPSHOT = createProjectAwarenessSnapshot({
  repositoryInspection: REPOSITORY_INSPECTION,
  sourceRecords: UNIVERSAL_COMPASS_SHELL_RECORDS,
  artifactRecords: ARTIFACT_RECORDS,
  authorityRecords: AUTHORITY_RECORDS,
  dependencyRelations: DEPENDENCY_RELATIONS,
  supersessionRelations: SUPERSESSION_RELATIONS,
  validationReceipts: BASELINE_VALIDATION_RECEIPTS,
  unresolvedQuestions: UNRESOLVED_QUESTIONS,
  permittedOperations: PERMITTED_OPERATIONS,
  prohibitedOperations: PROHIBITED_OPERATIONS
});