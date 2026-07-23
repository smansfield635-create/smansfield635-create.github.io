/*
 * Immutable dependency graph, awareness snapshot builder, and bounded query
 * interface. The graph records typed relations only; it does not execute or
 * mutate the artifacts it describes.
 */

import {
  PERMITTED_AWARENESS_OPERATIONS,
  PROHIBITED_AWARENESS_OPERATIONS,
  PROJECT_AWARENESS_BASELINE,
  PROJECT_AWARENESS_CONTRACT,
  createRepositoryFact,
  deepFreeze,
  stableSerialize
} from "./project-awareness.contract.js";
import {
  REPOSITORY_INSPECTION_ANCHOR,
  REPOSITORY_SOURCE_REGISTRY,
  UNIVERSAL_COMPASS_PACKAGE_IDENTITY,
  UNIVERSAL_COMPASS_SHELL_RECORDS
} from "./repository-source-registry.js";
import {
  ARTIFACT_AUTHORITY_RECORDS,
  AUTHORITY_AND_STATUS_LEDGER,
  UNRESOLVED_QUESTIONS
} from "./authority-and-status-ledger.js";

const GRAPH_DECLARATION = "DGB_PROJECT_AWARENESS_DEPENDENCY_GRAPH_v1";

function relationFact(
  value,
  {
    evidencePosture = "DECLARED",
    supportingPath = "/prototypes/universal-compass/",
    blobSha = null,
    derivedFrom = null,
    unresolvedReason = null
  } = {}
) {
  return createRepositoryFact(value, {
    evidencePosture,
    sourcePath: supportingPath,
    blobSha,
    declaredBy: GRAPH_DECLARATION,
    derivedFrom,
    unresolvedReason
  });
}

function artifactNode(artifactId, kind, sourcePath, evidencePosture = "DECLARED") {
  return deepFreeze({
    recordSchema: "DGB_PROJECT_AWARENESS_DEPENDENCY_NODE_v1",
    awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    artifactId: relationFact(artifactId, {
      evidencePosture,
      supportingPath: sourcePath,
      unresolvedReason:
        evidencePosture === "UNRESOLVED"
          ? "The exact support artifact has not yet been recovered into the seven-file package."
          : null
    }),
    kind: relationFact(kind, {
      evidencePosture,
      supportingPath: sourcePath,
      unresolvedReason:
        evidencePosture === "UNRESOLVED"
          ? "The exact support artifact has not yet been recovered into the seven-file package."
          : null
    }),
    sourcePath: relationFact(sourcePath, {
      evidencePosture,
      supportingPath: sourcePath,
      unresolvedReason:
        evidencePosture === "UNRESOLVED"
          ? "The final redistributed path is unresolved."
          : null
    })
  });
}

export const DEPENDENCY_GRAPH_NODES = deepFreeze([
  ...UNIVERSAL_COMPASS_SHELL_RECORDS.map(record =>
    artifactNode(
      record.artifactId.value,
      "REPOSITORY_ARTIFACT",
      record.path.value
    )
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_WORLD_TRUTH",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.planet.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_WORLD_GEOMETRY",
    "GOVERNED_WORLD_PROPERTY",
    "/prototypes/universal-compass/index.planet.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_VISUAL_RECORDS",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.crystals.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_COMPOSITOR_INPUT",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.crystals.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_PRESENTATION_CONTEXT",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.controller.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_PROJECTION_SNAPSHOTS",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.compositor.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_INTERACTION_PROJECTIONS",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.compositor.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_LOCAL_PROPOSALS",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.interactions.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_ACCEPTED_STATE",
    "PUBLISHED_DATA_PRODUCT",
    "/prototypes/universal-compass/index.controller.js"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_RUNTIME_MOUNTS",
    "RUNTIME_SHELL_CAPABILITY",
    "/prototypes/universal-compass/index.html"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_SEMANTIC_CONTROLS",
    "RUNTIME_SHELL_CAPABILITY",
    "/prototypes/universal-compass/index.html"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_PUBLISHED_STATE",
    "PRESENTATION_STATE",
    "/prototypes/universal-compass/index.css"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_CONTRACTS_SUPPORT",
    "UNRESOLVED_SUPPORT_ARTIFACT",
    "/prototypes/universal-compass/compass.contracts.js",
    "UNRESOLVED"
  ),
  artifactNode(
    "UNIVERSAL_COMPASS_ADAPTERS_SUPPORT",
    "UNRESOLVED_SUPPORT_ARTIFACT",
    "/prototypes/universal-compass/compass.adapters.js",
    "UNRESOLVED"
  )
]);

function createEdge({
  fromArtifactId,
  relation,
  toArtifactId,
  supportingPath,
  evidencePosture = "DECLARED",
  unresolvedReason = null
}) {
  return deepFreeze({
    recordSchema: "DGB_PROJECT_AWARENESS_DEPENDENCY_EDGE_v1",
    awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    fromArtifactId: relationFact(fromArtifactId, {
      evidencePosture,
      supportingPath,
      derivedFrom: [fromArtifactId, relation, toArtifactId],
      unresolvedReason
    }),
    relation: relationFact(relation, {
      evidencePosture,
      supportingPath,
      derivedFrom: [fromArtifactId, relation, toArtifactId],
      unresolvedReason
    }),
    toArtifactId: relationFact(toArtifactId, {
      evidencePosture,
      supportingPath,
      derivedFrom: [fromArtifactId, relation, toArtifactId],
      unresolvedReason
    }),
    evidencePosture: relationFact(evidencePosture, {
      evidencePosture,
      supportingPath,
      derivedFrom: [fromArtifactId, relation, toArtifactId],
      unresolvedReason
    }),
    supportingPath: relationFact(supportingPath, {
      evidencePosture,
      supportingPath,
      derivedFrom: [fromArtifactId, relation, toArtifactId],
      unresolvedReason
    })
  });
}

const declaredEdge = edge => createEdge(edge);
const unresolvedEdge = edge =>
  createEdge({
    ...edge,
    evidencePosture: "UNRESOLVED",
    unresolvedReason:
      edge.unresolvedReason ||
      "Executable compatibility evidence has not yet been produced."
  });

export const DEPENDENCY_RELATIONS = deepFreeze([
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_PLANET",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_WORLD_TRUTH",
    supportingPath: "/prototypes/universal-compass/index.planet.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_PLANET",
    relation: "DECLARES_AUTHORITY_OVER",
    toArtifactId: "UNIVERSAL_COMPASS_WORLD_GEOMETRY",
    supportingPath: "/prototypes/universal-compass/index.planet.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CRYSTALS",
    relation: "CONSUMES",
    toArtifactId: "UNIVERSAL_COMPASS_PLANET",
    supportingPath: "/prototypes/universal-compass/index.crystals.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CRYSTALS",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_VISUAL_RECORDS",
    supportingPath: "/prototypes/universal-compass/index.crystals.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CRYSTALS",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_COMPOSITOR_INPUT",
    supportingPath: "/prototypes/universal-compass/index.crystals.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CRYSTALS",
    relation: "PROHIBITED_FROM_OWNING",
    toArtifactId: "UNIVERSAL_COMPASS_WORLD_GEOMETRY",
    supportingPath: "/prototypes/universal-compass/index.crystals.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    relation: "CONSUMES",
    toArtifactId: "UNIVERSAL_COMPASS_PLANET",
    supportingPath: "/prototypes/universal-compass/index.compositor.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    relation: "CONSUMES",
    toArtifactId: "UNIVERSAL_COMPASS_CRYSTALS",
    supportingPath: "/prototypes/universal-compass/index.compositor.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    relation: "CONSUMES",
    toArtifactId: "UNIVERSAL_COMPASS_PRESENTATION_CONTEXT",
    supportingPath: "/prototypes/universal-compass/index.compositor.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_PROJECTION_SNAPSHOTS",
    supportingPath: "/prototypes/universal-compass/index.compositor.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_INTERACTION_PROJECTIONS",
    supportingPath: "/prototypes/universal-compass/index.compositor.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_INTERACTIONS",
    relation: "CONSUMES",
    toArtifactId: "UNIVERSAL_COMPASS_INTERACTION_PROJECTIONS",
    supportingPath: "/prototypes/universal-compass/index.interactions.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_INTERACTIONS",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_LOCAL_PROPOSALS",
    supportingPath: "/prototypes/universal-compass/index.interactions.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CONTROLLER",
    relation: "CONSUMES",
    toArtifactId: "UNIVERSAL_COMPASS_LOCAL_PROPOSALS",
    supportingPath: "/prototypes/universal-compass/index.controller.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CONTROLLER",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_ACCEPTED_STATE",
    supportingPath: "/prototypes/universal-compass/index.controller.js"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CONTROLLER",
    relation: "PRODUCES",
    toArtifactId: "UNIVERSAL_COMPASS_PRESENTATION_CONTEXT",
    supportingPath: "/prototypes/universal-compass/index.controller.js"
  }),
  ...[
    "UNIVERSAL_COMPASS_PLANET",
    "UNIVERSAL_COMPASS_CRYSTALS",
    "UNIVERSAL_COMPASS_COMPOSITOR",
    "UNIVERSAL_COMPASS_CONTROLLER",
    "UNIVERSAL_COMPASS_INTERACTIONS"
  ].map(artifactId =>
    declaredEdge({
      fromArtifactId: "UNIVERSAL_COMPASS_HTML",
      relation: "LOADS",
      toArtifactId: artifactId,
      supportingPath: "/prototypes/universal-compass/index.html"
    })
  ),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_HTML",
    relation: "PROVIDES",
    toArtifactId: "UNIVERSAL_COMPASS_RUNTIME_MOUNTS",
    supportingPath: "/prototypes/universal-compass/index.html"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_HTML",
    relation: "PROVIDES",
    toArtifactId: "UNIVERSAL_COMPASS_SEMANTIC_CONTROLS",
    supportingPath: "/prototypes/universal-compass/index.html"
  }),
  declaredEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_CSS",
    relation: "PRESENTS",
    toArtifactId: "UNIVERSAL_COMPASS_PUBLISHED_STATE",
    supportingPath: "/prototypes/universal-compass/index.css"
  }),
  unresolvedEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_PLANET",
    relation: "REQUIRES_RECOVERY_OF",
    toArtifactId: "UNIVERSAL_COMPASS_CONTRACTS_SUPPORT",
    supportingPath: "/prototypes/universal-compass/index.planet.js"
  }),
  unresolvedEdge({
    fromArtifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    relation: "REQUIRES_RECOVERY_OF",
    toArtifactId: "UNIVERSAL_COMPASS_ADAPTERS_SUPPORT",
    supportingPath: "/prototypes/universal-compass/index.compositor.js"
  }),
  ...[
    "UNIVERSAL_COMPASS_PLANET",
    "UNIVERSAL_COMPASS_CRYSTALS",
    "UNIVERSAL_COMPASS_COMPOSITOR",
    "UNIVERSAL_COMPASS_CONTROLLER",
    "UNIVERSAL_COMPASS_INTERACTIONS",
    "UNIVERSAL_COMPASS_HTML",
    "UNIVERSAL_COMPASS_CSS"
  ].map(artifactId =>
    unresolvedEdge({
      fromArtifactId: "UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE",
      relation: "REQUIRES_COMPATIBILITY_WITH",
      toArtifactId: artifactId,
      supportingPath: "/prototypes/universal-compass/"
    })
  )
]);

export const DEPENDENCY_GRAPH = deepFreeze({
  schema: "DGB_PROJECT_AWARENESS_DEPENDENCY_GRAPH_v1",
  awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  nodes: DEPENDENCY_GRAPH_NODES,
  edges: DEPENDENCY_RELATIONS
});

export function createProjectAwarenessSnapshot({
  validationReceipts = [],
  supersessionRelations = []
} = {}) {
  return deepFreeze({
    schema: "DGB_PROJECT_AWARENESS_SNAPSHOT_v1",
    awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    repositoryIdentity: REPOSITORY_INSPECTION_ANCHOR.repositoryIdentity,
    inspectedCommit: REPOSITORY_INSPECTION_ANCHOR.inspectedCommit,
    branchIdentity: REPOSITORY_INSPECTION_ANCHOR.branchIdentity,
    sourcePaths: deepFreeze(
      UNIVERSAL_COMPASS_SHELL_RECORDS.map(record => record.path)
    ),
    artifactIdentities: deepFreeze([
      UNIVERSAL_COMPASS_PACKAGE_IDENTITY.artifactId,
      ...DEPENDENCY_GRAPH_NODES.map(node => node.artifactId)
    ]),
    authorityClassification: deepFreeze(
      ARTIFACT_AUTHORITY_RECORDS.map(record =>
        record.authorityClassification
      )
    ),
    dependencyRelations: DEPENDENCY_RELATIONS,
    lifecycleStatus: deepFreeze(
      ARTIFACT_AUTHORITY_RECORDS.map(record => record.lifecycleStatus)
    ),
    supersessionRelations: deepFreeze(supersessionRelations),
    evidencePosture: deepFreeze(
      PROJECT_AWARENESS_CONTRACT.evidencePostures.map(value =>
        createRepositoryFact(value, {
          evidencePosture: "DECLARED",
          sourcePath:
            "/research/project-awareness/project-awareness.contract.js",
          declaredBy: PROJECT_AWARENESS_CONTRACT.id
        })
      )
    ),
    validationReceipts: deepFreeze(validationReceipts),
    unresolvedQuestions: UNRESOLVED_QUESTIONS,
    permittedOperations: deepFreeze(
      PERMITTED_AWARENESS_OPERATIONS.map(value =>
        createRepositoryFact(value, {
          evidencePosture: "DECLARED",
          sourcePath:
            "/research/project-awareness/project-awareness.contract.js",
          declaredBy: PROJECT_AWARENESS_CONTRACT.id
        })
      )
    ),
    prohibitedOperations: deepFreeze(
      PROHIBITED_AWARENESS_OPERATIONS.map(value =>
        createRepositoryFact(value, {
          evidencePosture: "DECLARED",
          sourcePath:
            "/research/project-awareness/project-awareness.contract.js",
          declaredBy: PROJECT_AWARENESS_CONTRACT.id
        })
      )
    )
  });
}

export const BASELINE_PROJECT_AWARENESS_SNAPSHOT =
  createProjectAwarenessSnapshot();

export const BOUNDED_PROJECT_QUERY_IDS = Object.freeze([
  "UNIVERSAL_COMPASS_FILES",
  "COPIED_SOURCE_BY_TARGET",
  "CURRENT_BLOBS",
  "INSPECTED_COMMIT",
  "PACKAGE_EXECUTABLE",
  "UNRESOLVED_DEPENDENCIES",
  "WORLD_TRUTH_OWNER",
  "PROJECTION_OWNER",
  "PERMITTED_OPERATIONS",
  "PROHIBITED_OPERATIONS",
  "CHANGES_SINCE_PREVIOUS_ACCEPTED_SNAPSHOT"
]);

function factsToValues(facts) {
  return facts.map(fact => fact.value);
}

export function createBoundedProjectQueryInterface(
  snapshot,
  previousAcceptedSnapshot = null
) {
  const admittedSnapshot = snapshot || BASELINE_PROJECT_AWARENESS_SNAPSHOT;

  function query(queryId) {
    if (!BOUNDED_PROJECT_QUERY_IDS.includes(queryId)) {
      return deepFreeze({
        queryId,
        status: "REJECTED_OUT_OF_BOUNDS",
        value: null
      });
    }

    const answers = {
      UNIVERSAL_COMPASS_FILES: () =>
        UNIVERSAL_COMPASS_SHELL_RECORDS.map(record => ({
          artifactId: record.artifactId.value,
          path: record.path.value
        })),
      COPIED_SOURCE_BY_TARGET: () =>
        UNIVERSAL_COMPASS_SHELL_RECORDS.map(record => ({
          targetPath: record.path.value,
          copiedFrom: record.copiedFrom.value
        })),
      CURRENT_BLOBS: () =>
        UNIVERSAL_COMPASS_SHELL_RECORDS.map(record => ({
          path: record.path.value,
          blobSha: record.blobSha.value
        })),
      INSPECTED_COMMIT: () => admittedSnapshot.inspectedCommit.value,
      PACKAGE_EXECUTABLE: () =>
        UNIVERSAL_COMPASS_PACKAGE_IDENTITY.executable.value,
      UNRESOLVED_DEPENDENCIES: () =>
        admittedSnapshot.dependencyRelations
          .filter(edge => edge.evidencePosture.value === "UNRESOLVED")
          .map(edge => ({
            fromArtifactId: edge.fromArtifactId.value,
            relation: edge.relation.value,
            toArtifactId: edge.toArtifactId.value
          })),
      WORLD_TRUTH_OWNER: () => "UNIVERSAL_COMPASS_PLANET",
      PROJECTION_OWNER: () => "UNIVERSAL_COMPASS_COMPOSITOR",
      PERMITTED_OPERATIONS: () =>
        factsToValues(admittedSnapshot.permittedOperations),
      PROHIBITED_OPERATIONS: () =>
        factsToValues(admittedSnapshot.prohibitedOperations),
      CHANGES_SINCE_PREVIOUS_ACCEPTED_SNAPSHOT: () =>
        previousAcceptedSnapshot === null
          ? {
              status: "BASELINE_ONLY_NO_PREVIOUS_ACCEPTED_SNAPSHOT",
              changes: null
            }
          : compareAwarenessSnapshots(
              previousAcceptedSnapshot,
              admittedSnapshot
            )
    };

    return deepFreeze({
      queryId,
      status: "ANSWERED",
      value: answers[queryId]()
    });
  }

  return deepFreeze({
    schema: "DGB_BOUNDED_PROJECT_AWARENESS_QUERY_INTERFACE_v1",
    mode: "READ_ONLY",
    supportedQueryIds: BOUNDED_PROJECT_QUERY_IDS,
    query
  });
}

function keySet(values) {
  return new Set(values);
}

function difference(left, right) {
  const rightSet = keySet(right);
  return left.filter(value => !rightSet.has(value));
}

function changedPairs(previousPairs, currentPairs) {
  const previous = new Map(previousPairs.map(pair => [pair.key, pair.value]));
  const current = new Map(currentPairs.map(pair => [pair.key, pair.value]));
  return [...new Set([...previous.keys(), ...current.keys()])]
    .filter(key => previous.get(key) !== current.get(key))
    .map(key => ({
      key,
      previous: previous.has(key) ? previous.get(key) : null,
      current: current.has(key) ? current.get(key) : null
    }));
}

export function compareAwarenessSnapshots(previousSnapshot, currentSnapshot) {
  const previousArtifacts = factsToValues(previousSnapshot.artifactIdentities);
  const currentArtifacts = factsToValues(currentSnapshot.artifactIdentities);

  const previousBlobs = REPOSITORY_SOURCE_REGISTRY.sourceRecords.map(record => ({
    key: record.path.value,
    value: record.blobSha.value
  }));
  const currentBlobs = REPOSITORY_SOURCE_REGISTRY.sourceRecords.map(record => ({
    key: record.path.value,
    value: record.blobSha.value
  }));

  const previousRelations = previousSnapshot.dependencyRelations.map(edge =>
    stableSerialize([
      edge.fromArtifactId.value,
      edge.relation.value,
      edge.toArtifactId.value,
      edge.evidencePosture.value
    ])
  );
  const currentRelations = currentSnapshot.dependencyRelations.map(edge =>
    stableSerialize([
      edge.fromArtifactId.value,
      edge.relation.value,
      edge.toArtifactId.value,
      edge.evidencePosture.value
    ])
  );

  const previousQuestions = previousSnapshot.unresolvedQuestions.map(
    record => record.questionId.value
  );
  const currentQuestions = currentSnapshot.unresolvedQuestions.map(
    record => record.questionId.value
  );

  return deepFreeze({
    schema: "DGB_PROJECT_AWARENESS_SNAPSHOT_COMPARISON_v1",
    addedArtifacts: difference(currentArtifacts, previousArtifacts),
    removedArtifacts: difference(previousArtifacts, currentArtifacts),
    changedBlobs: changedPairs(previousBlobs, currentBlobs),
    changedBranches:
      previousSnapshot.branchIdentity.value === currentSnapshot.branchIdentity.value
        ? []
        : [{
            previous: previousSnapshot.branchIdentity.value,
            current: currentSnapshot.branchIdentity.value
          }],
    changedAuthorityDeclarations: changedPairs(
      previousSnapshot.authorityClassification.map((fact, index) => ({
        key: String(index),
        value: fact.value
      })),
      currentSnapshot.authorityClassification.map((fact, index) => ({
        key: String(index),
        value: fact.value
      }))
    ),
    changedLifecycleStates: changedPairs(
      previousSnapshot.lifecycleStatus.map((fact, index) => ({
        key: String(index),
        value: fact.value
      })),
      currentSnapshot.lifecycleStatus.map((fact, index) => ({
        key: String(index),
        value: fact.value
      }))
    ),
    newSupersessionRelations: difference(
      currentSnapshot.supersessionRelations.map(stableSerialize),
      previousSnapshot.supersessionRelations.map(stableSerialize)
    ),
    resolvedQuestions: difference(previousQuestions, currentQuestions),
    newUnresolvedQuestions: difference(currentQuestions, previousQuestions),
    dependencyChanges: {
      added: difference(currentRelations, previousRelations),
      removed: difference(previousRelations, currentRelations)
    },
    receiptChanges: changedPairs(
      previousSnapshot.validationReceipts.map((receipt, index) => ({
        key: String(index),
        value: stableSerialize(receipt)
      })),
      currentSnapshot.validationReceipts.map((receipt, index) => ({
        key: String(index),
        value: stableSerialize(receipt)
      }))
    ),
    automaticClassificationPerformed: false
  });
}

export const PROJECT_AWARENESS_COMPONENTS = deepFreeze({
  contract: PROJECT_AWARENESS_CONTRACT,
  baseline: PROJECT_AWARENESS_BASELINE,
  sourceRegistry: REPOSITORY_SOURCE_REGISTRY,
  authorityLedger: AUTHORITY_AND_STATUS_LEDGER,
  dependencyGraph: DEPENDENCY_GRAPH,
  baselineSnapshot: BASELINE_PROJECT_AWARENESS_SNAPSHOT
});
