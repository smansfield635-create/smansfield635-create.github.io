import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { assembleContextGraph } from "./laws-context-graph-assembler-v1.mjs";
import { emitNativeGraphReceipt } from "./laws-context-graph-native-receipt-v1.mjs";
import {
  adaptTestsObjectProjectionRegistry,
  GammaOutcome,
  resolveGamma
} from "./laws-contextual-gamma-resolver-v1.mjs";
import {
  ProjectionConformanceHarnessBinding,
  judgeProjectionDescription
} from "./laws-nonspatial-projection-conformance-harness-v1.mjs";
import {
  canonicalizeText,
  createReceipt,
  verifyReceipt
} from "../../../infrastructure/lineage-receipt-protocol-v1/javascript/lineage_receipt_protocol_v1.mjs";

const readJson = (url) => JSON.parse(readFileSync(url, "utf8"));
const clone = (value) => structuredClone(value);
const evidenceDir = process.env.LAWS_PROJECTION_CONFORMANCE_EVIDENCE_DIR || "/tmp/laws-projection-conformance-evidence";
mkdirSync(evidenceDir, { recursive: true });

const projectionPolicy = readJson(new URL("./laws-semantics-preserving-projection-policy-v1.json", import.meta.url));
const relationRegistry = readJson(new URL("./laws-contextual-relation-registry-v1.json", import.meta.url));
const nativeTestsRegistry = readJson(new URL("../../../control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json", import.meta.url));

const POLICY_IDENTITY = Object.freeze({
  schema: "LAWS_SEMANTICS_PRESERVING_PROJECTION_POLICY_v1",
  version: "1.0.0",
  freezeCommit: "c60b2102998cfbacd0a2bcb2b7cccf123e17738c",
  blob: "93f8d8d9edcb961f2bacf6f82be799f347b19217"
});
const HARNESS_BLOB = "19ad7a16f37357a5ac91090139b510416d54b4f5";
const HARNESS_IDENTITY = Object.freeze({
  schema: ProjectionConformanceHarnessBinding.schema,
  version: ProjectionConformanceHarnessBinding.version,
  sourcePath: "laws/control-plane/contextual-topology/laws-nonspatial-projection-conformance-harness-v1.mjs",
  blob: HARNESS_BLOB
});
const SOURCE_DESCRIPTOR = Object.freeze({
  sourceId: "SRC09",
  path: "control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json",
  gitBlob: "b801a11e342051a6b00e6f7098b1d691685ad0b6"
});
const GAMMA_RESOLVER_BLOB = "1d715884d71419ac25892da452ca7b6d21e6c909";
const RELATION_REGISTRY_BLOB = "5d79eca4ee7d9366f8d8c2287c34001ae37ffc4e";
const EXPECTED_GRAPH_RECEIPT_DIGEST = "40873d2cdcae915f66cee8abed1afc810cfbf3df0d44a331af57ba9e263cdedc";

const adapted = adaptTestsObjectProjectionRegistry({
  registry: nativeTestsRegistry,
  relationRegistry,
  sourceDescriptor: SOURCE_DESCRIPTOR
});
const adaptedObject = (id) => adapted.authoritativeObjects.find((entry) => entry.identity === id);
const portfolio = adaptedObject("PROSPECTIVE_FINAL_REPORT_PORTFOLIO");
const routeOperator = adaptedObject("ROUTE_OPERATOR_PLATFORM");
const methods = adaptedObject("METHODS");
assert.ok(portfolio && routeOperator && methods, "native Tests graph endpoints must exist");

const contextBinding = Object.freeze({
  objectIdentity: portfolio.identity,
  contextScope: "LAWS_CONTEXT_GRAPH_NATIVE_EVIDENCE_VERIFICATION",
  authority: clone(portfolio.authority),
  version: portfolio.version,
  contextRevision: 12
});
const gammaContext = Object.freeze({
  objectIdentity: contextBinding.objectIdentity,
  contextScope: contextBinding.contextScope,
  authority: clone(contextBinding.authority),
  version: contextBinding.version
});

function syntheticObject(identity) {
  return Object.freeze({
    identity,
    objectClass: routeOperator.objectClass,
    authority: { id: `${identity}:authority` },
    version: routeOperator.version,
    provenance: {
      source: "laws-context-graph-native-evidence-verifier-fixture",
      baseClassIdentity: routeOperator.identity
    }
  });
}

const unknownObject = syntheticObject("GRAPH_EVIDENCE_UNKNOWN_OBJECT");
const noneObject = syntheticObject("GRAPH_EVIDENCE_NONE_OBJECT");
const unevaluableObject = syntheticObject("GRAPH_EVIDENCE_UNEVALUABLE_OBJECT");
const conflictedObject = syntheticObject("GRAPH_EVIDENCE_CONFLICTED_OBJECT");
const admittedObjects = [
  ...adapted.authoritativeObjects,
  unknownObject,
  noneObject,
  unevaluableObject,
  conflictedObject
];

const nativeExecRecord = adapted.relationRecords.find((record) =>
  record.RELATION_TYPE === "EXECUTES" &&
  ((record.FROM_OBJECT === routeOperator.identity && record.TO_OBJECT === portfolio.identity) ||
   (record.TO_OBJECT === routeOperator.identity && record.FROM_OBJECT === portfolio.identity))
);
assert.ok(nativeExecRecord, "native EXECUTES relation record must exist");

function syntheticRecord(object, overrides = {}) {
  return {
    ...clone(nativeExecRecord),
    RELATION_ID: `${object.identity}:EXECUTES`,
    FROM_OBJECT: object.identity,
    TO_OBJECT: portfolio.identity,
    AUTHORITY_POINTERS: { id: `${object.identity}:relation-authority` },
    EVIDENCE_REFERENCES: [{ id: `${object.identity}:relation-authority` }],
    SOURCE_OR_PROVENANCE: { source: "laws-context-graph-native-evidence-verifier-fixture" },
    ...overrides
  };
}

function evaluation(object, relationRecords, relationTypes = null) {
  const resolution = resolveGamma({
    registry: relationRegistry,
    object,
    context: gammaContext,
    authoritativeObjects: admittedObjects,
    relationRecords,
    relationTypes
  });
  return Object.freeze({
    evaluatedObjectIdentity: object.identity,
    contextRevision: contextBinding.contextRevision,
    resolution,
    sourceBinding: SOURCE_DESCRIPTOR,
    resolverIdentity: GAMMA_RESOLVER_BLOB,
    relationRegistryIdentity: RELATION_REGISTRY_BLOB
  });
}

const realExecutes = evaluation(routeOperator, adapted.relationRecords);
const realGoverns = evaluation(methods, adapted.relationRecords);
const unknown = evaluation(unknownObject, []);
const none = evaluation(
  noneObject,
  [syntheticRecord(noneObject, { EXISTENCE_STATE: "NONE" })],
  ["EXECUTES"]
);
const unevaluable = evaluation(
  unevaluableObject,
  [syntheticRecord(unevaluableObject, { AUTHORITY_STATUS: "UNRESOLVED" })],
  ["EXECUTES"]
);
const conflictId = `${conflictedObject.identity}:CONFLICT`;
const conflicted = evaluation(
  conflictedObject,
  [
    syntheticRecord(conflictedObject, { RELATION_ID: conflictId, EXISTENCE_STATE: "ASSERTED" }),
    syntheticRecord(conflictedObject, { RELATION_ID: conflictId, EXISTENCE_STATE: "NONE" })
  ],
  ["EXECUTES"]
);

assert.equal(realExecutes.resolution.outcome, GammaOutcome.ASSERTED);
assert.equal(realGoverns.resolution.outcome, GammaOutcome.ASSERTED);
assert.equal(unknown.resolution.outcome, GammaOutcome.UNKNOWN);
assert.equal(none.resolution.outcome, GammaOutcome.NONE);
assert.equal(unevaluable.resolution.outcome, GammaOutcome.UNEVALUABLE);
assert.equal(conflicted.resolution.outcome, GammaOutcome.CONFLICTED);

const representativeGraph = assembleContextGraph({
  contextBinding,
  admittedObjects,
  gammaEvaluations: [realExecutes, realGoverns, unknown, none, unevaluable, conflicted]
});
const nativeGraphReceipt = emitNativeGraphReceipt(representativeGraph);
const nativeGraphSeal = await createReceipt(nativeGraphReceipt);
const nativeGraphSealVerification = await verifyReceipt(nativeGraphSeal);
assert.equal(nativeGraphSealVerification.state, "VALID");
assert.equal(nativeGraphSeal.lineage_digest, EXPECTED_GRAPH_RECEIPT_DIGEST, "representative graph receipt lineage must remain exact");

function graphBinding(receipt, seal) {
  return {
    nativeReceiptLrpv1Digest: seal.lineage_digest,
    assemblyIdentity: clone(receipt.assemblyIdentity),
    graphContractIdentity: clone(receipt.graphContractIdentity),
    assemblerIdentity: clone(receipt.assemblerIdentity)
  };
}

function relationPresentation(edge, overrides = {}) {
  return {
    presentationId: `PRESENT:${edge.RELATION_ID}`,
    semanticClassification: "SEMANTIC_EXPRESSION",
    sourceRelationId: edge.RELATION_ID,
    sourceResolutionObjectId: null,
    relationType: edge.RELATION_TYPE,
    fromObjectId: edge.FROM_OBJECT,
    toObjectId: edge.TO_OBJECT,
    semanticProfile: "DIRECT_TYPED_RELATION_V1",
    direction: edge.DIRECTION,
    qualifiers: clone(edge.QUALIFIERS),
    standing: clone(edge.SCIENTIFIC_STANDING),
    claimCeiling: clone(edge.CLAIM_CEILING),
    authorityRefs: clone(edge.AUTHORITY_POINTERS),
    provenanceRefs: clone(edge.SOURCE_OR_PROVENANCE),
    presentationChannels: [
      "DIRECT_CONNECTION",
      "DIRECTION_MARKER",
      "RELATION_TYPE_LABEL",
      "RELATION_QUALIFIER_DISPLAY",
      "INSPECTION_DETAIL"
    ],
    ...overrides
  };
}

function resolutionPresentation(entry) {
  return {
    evaluatedObjectIdentity: entry.evaluatedObjectIdentity,
    semanticClassification: "SEMANTIC_EXPRESSION",
    channelType: "RESOLUTION_STATE_LITERAL",
    resolutionState: entry.gammaOutcome,
    presentationDisposition: "INSPECTABLE_NON_EDGE_STATE",
    recoverable: true
  };
}

function accessibilityFor(receipt) {
  const relationEntries = receipt.assertedEdgeIds.map((relationId) => ({
    kind: "RELATION",
    relationId,
    relationIdentityRecoverable: true,
    directionRecoverable: true,
    multiplicityRecoverable: true
  }));
  const resolutionEntries = receipt.resolutionLedger
    .filter((entry) => entry.gammaOutcome !== "ASSERTED")
    .map((entry) => ({
      kind: "RESOLUTION",
      evaluatedObjectIdentity: entry.evaluatedObjectIdentity,
      resolutionState: entry.gammaOutcome,
      resolutionStateRecoverable: true
    }));
  return [...relationEntries, ...resolutionEntries];
}

function lawfulDescription(receipt, seal, projectionId = "PROJECTION_DESCRIPTION_BASE") {
  return {
    schema: "LAWS_ABSTRACT_PROJECTION_DESCRIPTION_v1",
    projectionId,
    graphBinding: graphBinding(receipt, seal),
    policyBinding: clone(POLICY_IDENTITY),
    viewState: {
      mode: "ABSTRACT_NONSPATIAL_TEST",
      levelOfDetail: "FULL",
      zoomToken: "Z0",
      semanticOverrides: {},
      changesSemanticState: false
    },
    visibleNodeIds: [...receipt.assertedNodeIds],
    suppressedNodeIds: [],
    visibleRelationIds: [...receipt.assertedEdgeIds],
    relationPresentations: receipt.assertedEdges.map((edge) => relationPresentation(edge)),
    suppressedRelations: [],
    resolutionPresentations: receipt.resolutionLedger
      .filter((entry) => entry.gammaOutcome !== "ASSERTED")
      .map(resolutionPresentation),
    relationBundles: [],
    visualClusters: [],
    nonSemanticVisuals: [],
    accessibilityRepresentations: accessibilityFor(receipt),
    projectionWriteback: { enabled: false }
  };
}

function suppressRelation(description, relationId, reason = "LOD") {
  description.visibleRelationIds = description.visibleRelationIds.filter((id) => id !== relationId);
  description.relationPresentations = description.relationPresentations.filter((item) => item.sourceRelationId !== relationId);
  description.accessibilityRepresentations = description.accessibilityRepresentations.filter(
    (item) => !(item.kind === "RELATION" && item.relationId === relationId)
  );
  description.suppressedRelations.push({
    relationId,
    suppressionReason: reason,
    reportedAsNonexistent: false,
    semanticState: "ASSERTED"
  });
}

function syntheticParallelGraphReceipt() {
  const receipt = clone(nativeGraphReceipt);
  const base = clone(receipt.assertedEdges.find((edge) => edge.RELATION_TYPE === "EXECUTES") ?? receipt.assertedEdges[0]);
  assert.ok(base, "parallel fixture requires asserted edge");

  const edge1 = clone(base);
  edge1.RELATION_ID = "PROJECTION_PARALLEL_EXECUTES_1";
  edge1.RELATION_TYPE = "EXECUTES";
  edge1.QUALIFIERS = { projectionHarnessFixture: "ONE" };

  const edge2 = clone(base);
  edge2.RELATION_ID = "PROJECTION_PARALLEL_GOVERNS_2";
  edge2.RELATION_TYPE = "GOVERNS_PROCEDURE_FOR";
  edge2.QUALIFIERS = { projectionHarnessFixture: "TWO" };

  const edge3 = clone(base);
  edge3.RELATION_ID = "PROJECTION_PARALLEL_EXECUTES_3";
  edge3.RELATION_TYPE = "EXECUTES";
  edge3.QUALIFIERS = { projectionHarnessFixture: "THREE" };

  receipt.assertedEdges = [edge1, edge2, edge3].sort((a, b) => a.RELATION_ID.localeCompare(b.RELATION_ID));
  receipt.assertedEdgeIds = receipt.assertedEdges.map((edge) => edge.RELATION_ID);
  receipt.assemblyDisposition = "SYNTHETIC_PROJECTION_HARNESS_MULTIPLICITY_FIXTURE_NOT_PRODUCTION";
  return receipt;
}

const positiveResults = [];
async function expectPass(name, receipt, seal, description) {
  const result = await judgeProjectionDescription({
    nativeGraphReceipt: receipt,
    nativeGraphLrpv1Receipt: seal,
    projectionPolicy,
    projectionPolicyIdentity: POLICY_IDENTITY,
    projectionDescription: description,
    harnessIdentity: HARNESS_IDENTITY
  });
  assert.equal(result.disposition, "PASS_SEMANTICS_PRESERVING_PROJECTION_DESCRIPTION", `${name}: ${result.violations.map((v) => v.code).join(",")}`);
  assert.equal(result.violations.length, 0, name);
  positiveResults.push({ name, disposition: result.disposition, checks: result.checks });
  return result;
}

const adversarialResults = [];
async function expectFail(name, receipt, seal, description, expectedCodes) {
  const result = await judgeProjectionDescription({
    nativeGraphReceipt: receipt,
    nativeGraphLrpv1Receipt: seal,
    projectionPolicy,
    projectionPolicyIdentity: POLICY_IDENTITY,
    projectionDescription: description,
    harnessIdentity: HARNESS_IDENTITY
  });
  assert.equal(result.disposition, "FAIL_PROJECTION_CONFORMANCE", `${name} must fail`);
  const observed = new Set(result.violations.map((entry) => entry.code));
  for (const code of expectedCodes) {
    assert.ok(observed.has(code), `${name} missing ${code}; observed=${[...observed].join(",")}`);
  }
  adversarialResults.push({
    name,
    expectedCodes,
    observedCodes: [...observed].sort(),
    disposition: result.disposition
  });
  return result;
}

const primaryDescription = lawfulDescription(nativeGraphReceipt, nativeGraphSeal);
const primaryConformanceReceipt = await expectPass(
  "EXACT_TYPED_DIRECTED_RELATION_IS_ACCEPTED",
  nativeGraphReceipt,
  nativeGraphSeal,
  primaryDescription
);

const parallelReceipt = syntheticParallelGraphReceipt();
const parallelSeal = await createReceipt(parallelReceipt);
assert.equal((await verifyReceipt(parallelSeal)).state, "VALID");
const parallelDescription = lawfulDescription(parallelReceipt, parallelSeal, "PROJECTION_PARALLEL_RELATIONS");
parallelDescription.relationBundles.push({
  bundleId: "BUNDLE_PARALLEL_THREE",
  semanticClassification: "SEMANTIC_EXPRESSION",
  memberRelationIds: [...parallelReceipt.assertedEdgeIds],
  recoverableRelationIds: [...parallelReceipt.assertedEdgeIds],
  anonymousGenericConnection: false
});
await expectPass(
  "SEVERAL_DISTINCT_PARALLEL_RELATIONS_ARE_ACCEPTED",
  parallelReceipt,
  parallelSeal,
  parallelDescription
);

const suppressedDescription = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "PROJECTION_LAWFUL_SUPPRESSION");
suppressRelation(suppressedDescription, nativeGraphReceipt.assertedEdgeIds[0], "LOD");
await expectPass(
  "RELATION_MAY_BE_SUPPRESSED_WITH_LAWFUL_REASON",
  nativeGraphReceipt,
  nativeGraphSeal,
  suppressedDescription
);

const reappearedDescription = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "PROJECTION_RELATION_REAPPEARS");
reappearedDescription.viewState = {
  ...reappearedDescription.viewState,
  levelOfDetail: "RESTORED",
  zoomToken: "Z1"
};
const reappearedResult = await expectPass(
  "RELATION_REAPPEARS_AFTER_VIEW_STATE_CHANGE_WITHOUT_SEMANTIC_MUTATION",
  nativeGraphReceipt,
  nativeGraphSeal,
  reappearedDescription
);
assert.equal(reappearedResult.graphDigest, primaryConformanceReceipt.graphDigest);

await expectPass(
  "UNRESOLVED_STATES_ARE_INSPECTABLE_WITHOUT_EDGES",
  nativeGraphReceipt,
  nativeGraphSeal,
  lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "PROJECTION_UNRESOLVED_INSPECTABLE")
);

const decorativeDescription = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "PROJECTION_DECORATIVE_POSITIONING");
decorativeDescription.nonSemanticVisuals.push({
  visualId: "DECORATIVE_POSITIONING",
  semanticClassification: "NON_SEMANTIC_PRESENTATION",
  channelType: "PLACEMENT",
  purpose: "LAYOUT_COORDINATES",
  doesNotAssertRelation: true,
  impliedSemanticMeanings: [],
  presentationToken: "ARBITRARY_DECORATIVE_SLOT"
});
await expectPass(
  "ARBITRARY_DECORATIVE_POSITIONING_IS_ALLOWED_WHEN_NON_SEMANTIC",
  nativeGraphReceipt,
  nativeGraphSeal,
  decorativeDescription
);

const replacementA = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "PROJECTION_REPLACEMENT_A");
const replacementB = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "PROJECTION_REPLACEMENT_B");
replacementB.nonSemanticVisuals.push({
  visualId: "REPLACEMENT_BACKGROUND",
  semanticClassification: "NON_SEMANTIC_PRESENTATION",
  channelType: "DECORATIVE_BACKGROUND",
  purpose: "DECORATIVE_BACKGROUND",
  doesNotAssertRelation: true,
  impliedSemanticMeanings: []
});
const replacementAResult = await expectPass(
  "REPLACEMENT_PROJECTION_A_IS_LAWFUL",
  nativeGraphReceipt,
  nativeGraphSeal,
  replacementA
);
const replacementBResult = await expectPass(
  "ENTIRE_PROJECTION_CAN_BE_REPLACED_WITH_GRAPH_IDENTITY_UNCHANGED",
  nativeGraphReceipt,
  nativeGraphSeal,
  replacementB
);
assert.equal(replacementAResult.graphDigest, replacementBResult.graphDigest);
assert.deepEqual(replacementA.graphBinding, replacementB.graphBinding);

const ledgerByState = new Map(
  nativeGraphReceipt.resolutionLedger
    .filter((entry) => entry.gammaOutcome !== "ASSERTED")
    .map((entry) => [entry.gammaOutcome, entry])
);
const execEdge = nativeGraphReceipt.assertedEdges.find((edge) => edge.RELATION_TYPE === "EXECUTES") ?? nativeGraphReceipt.assertedEdges[0];
assert.ok(execEdge, "EXECUTES edge required for adversarial suite");

async function nonAssertedEdgeAttack(state) {
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, `ATTACK_${state}_AS_EDGE`);
  const ledgerEntry = ledgerByState.get(state);
  assert.ok(ledgerEntry, `${state} ledger entry required`);
  description.relationPresentations.push(relationPresentation(execEdge, {
    presentationId: `ATTACK:${state}`,
    sourceRelationId: `NON_ASSERTED:${state}`,
    sourceResolutionObjectId: ledgerEntry.evaluatedObjectIdentity
  }));
  await expectFail(
    `${state}_TO_SEMANTIC_CONNECTION`,
    nativeGraphReceipt,
    nativeGraphSeal,
    description,
    ["NON_ASSERTED_STATE_EXPRESSED_SEMANTICALLY"]
  );
}

await nonAssertedEdgeAttack("UNKNOWN");
await nonAssertedEdgeAttack("CONFLICTED");
await nonAssertedEdgeAttack("NONE");
await nonAssertedEdgeAttack("UNEVALUABLE");

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_REVERSED_EXECUTES");
  const item = description.relationPresentations.find((entry) => entry.sourceRelationId === execEdge.RELATION_ID);
  [item.fromObjectId, item.toObjectId] = [item.toObjectId, item.fromObjectId];
  await expectFail("REVERSED_EXECUTES", nativeGraphReceipt, nativeGraphSeal, description, ["RELATION_DIRECTION_REVERSED"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_RELATION_TYPE_SUBSTITUTION");
  description.relationPresentations[0].relationType = "DERIVED_FROM";
  await expectFail("RELATION_TYPE_SUBSTITUTION", nativeGraphReceipt, nativeGraphSeal, description, ["RELATION_TYPE_MISMATCH"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_HIDDEN_NONEXISTENT");
  const relationId = nativeGraphReceipt.assertedEdgeIds[0];
  suppressRelation(description, relationId, "FILTER");
  description.suppressedRelations[0].reportedAsNonexistent = true;
  description.suppressedRelations[0].semanticState = "NONE";
  await expectFail("HIDDEN_RELATION_DECLARED_NONEXISTENT", nativeGraphReceipt, nativeGraphSeal, description, ["HIDDEN_RELATION_REPORTED_NONEXISTENT"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_UNACCOUNTED_EDGE");
  const relationId = nativeGraphReceipt.assertedEdgeIds[0];
  description.visibleRelationIds = description.visibleRelationIds.filter((id) => id !== relationId);
  description.relationPresentations = description.relationPresentations.filter((entry) => entry.sourceRelationId !== relationId);
  description.accessibilityRepresentations = description.accessibilityRepresentations.filter(
    (entry) => !(entry.kind === "RELATION" && entry.relationId === relationId)
  );
  await expectFail("ASSERTED_RELATION_OMITTED_VISIBLE_AND_SUPPRESSED", nativeGraphReceipt, nativeGraphSeal, description, ["ASSERTED_RELATION_UNACCOUNTED"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_DUPLICATED_EDGE");
  const relationId = nativeGraphReceipt.assertedEdgeIds[0];
  description.suppressedRelations.push({
    relationId,
    suppressionReason: "LOD",
    reportedAsNonexistent: false,
    semanticState: "ASSERTED"
  });
  await expectFail("ASSERTED_RELATION_DUPLICATED", nativeGraphReceipt, nativeGraphSeal, description, ["ASSERTED_RELATION_DUPLICATED"]);
}

{
  const description = lawfulDescription(parallelReceipt, parallelSeal, "ATTACK_PARALLEL_COLLAPSE");
  description.relationBundles.push({
    bundleId: "ANONYMOUS_PARALLEL_COLLAPSE",
    semanticClassification: "SEMANTIC_EXPRESSION",
    memberRelationIds: [...parallelReceipt.assertedEdgeIds],
    recoverableRelationIds: [...parallelReceipt.assertedEdgeIds],
    anonymousGenericConnection: true
  });
  await expectFail("TWO_OR_MORE_PARALLEL_RELATIONS_COLLAPSED_ANONYMOUSLY", parallelReceipt, parallelSeal, description, ["PARALLEL_RELATION_MULTIPLICITY_LOST"]);
}

{
  const description = lawfulDescription(parallelReceipt, parallelSeal, "ATTACK_BUNDLE_RECOVERABILITY");
  description.relationBundles.push({
    bundleId: "BUNDLE_THREE_ONLY_TWO_RECOVERABLE",
    semanticClassification: "SEMANTIC_EXPRESSION",
    memberRelationIds: [...parallelReceipt.assertedEdgeIds],
    recoverableRelationIds: parallelReceipt.assertedEdgeIds.slice(0, 2),
    anonymousGenericConnection: false
  });
  await expectFail("THREE_RELATION_IDS_BUNDLED_ONLY_TWO_RECOVERABLE", parallelReceipt, parallelSeal, description, ["BUNDLE_MEMBER_NOT_RECOVERABLE"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_CLUSTER_AUTHORITY");
  description.visualClusters.push({
    clusterId: "CLUSTER_FALSE_AUTHORITY",
    semanticClassification: "NON_SEMANTIC_PRESENTATION",
    memberNodeIds: nativeGraphReceipt.assertedNodeIds.slice(0, 2),
    authoritativeObject: true,
    semanticEndpoint: false
  });
  await expectFail("VISUAL_CLUSTER_DECLARED_NEW_AUTHORITATIVE_OBJECT", nativeGraphReceipt, nativeGraphSeal, description, ["VISUAL_CLUSTER_AUTHORITY_PROHIBITED"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_STANDING");
  description.relationPresentations[0].standing = "SUPPORTED_WITHIN_BOUNDARY";
  await expectFail("SCIENTIFIC_STANDING_UPGRADE", nativeGraphReceipt, nativeGraphSeal, description, ["SCIENTIFIC_STANDING_MISMATCH"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_CLAIM_CEILING");
  description.relationPresentations[0].claimCeiling = "UNBOUNDED_BY_PRESENTATION";
  await expectFail("CLAIM_CEILING_UPGRADE", nativeGraphReceipt, nativeGraphSeal, description, ["CLAIM_CEILING_MISMATCH"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_AUTHORITY");
  description.relationPresentations[0].authorityRefs = { id: "SUBSTITUTED_AUTHORITY" };
  await expectFail("AUTHORITY_SUBSTITUTION", nativeGraphReceipt, nativeGraphSeal, description, ["AUTHORITY_IDENTITY_MISMATCH"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_PROVENANCE");
  description.relationPresentations[0].provenanceRefs = { source: "SUBSTITUTED_PROVENANCE" };
  await expectFail("PROVENANCE_SUBSTITUTION", nativeGraphReceipt, nativeGraphSeal, description, ["PROVENANCE_IDENTITY_MISMATCH"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_QUALIFIER");
  description.relationPresentations[0].qualifiers = null;
  await expectFail("QUALIFIER_LOSS", nativeGraphReceipt, nativeGraphSeal, description, ["RELATION_QUALIFIER_MISMATCH"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_DIRECTION_LOSS");
  description.relationPresentations[0].direction = "UNDIRECTED";
  await expectFail("DIRECTION_LOSS", nativeGraphReceipt, nativeGraphSeal, description, ["RELATION_DIRECTION_LOST"]);
}

for (const [name, channel] of [
  ["SEMANTIC_RELATION_EXPRESSED_ONLY_THROUGH_PROXIMITY", "PROXIMITY"],
  ["SEMANTIC_RELATION_EXPRESSED_ONLY_THROUGH_COLOR", "COLOR"],
  ["SEMANTIC_RELATION_EXPRESSED_ONLY_THROUGH_ANIMATION", "ANIMATION_ORDER"]
]) {
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, `ATTACK_${channel}`);
  description.relationPresentations[0].presentationChannels = [channel];
  await expectFail(name, nativeGraphReceipt, nativeGraphSeal, description, ["SEMANTIC_CHANNEL_NOT_AUTHORIZED", "REQUIRED_SEMANTIC_CHANNEL_MISSING"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_NONSEMANTIC_RELATION_ID");
  description.nonSemanticVisuals.push({
    visualId: "SECRET_RELATION_CARRIER",
    semanticClassification: "NON_SEMANTIC_PRESENTATION",
    channelType: "DECORATIVE_BACKGROUND",
    purpose: "DECORATIVE_BACKGROUND",
    doesNotAssertRelation: true,
    relationId: nativeGraphReceipt.assertedEdgeIds[0],
    impliedSemanticMeanings: []
  });
  await expectFail("NON_SEMANTIC_VISUAL_SECRETLY_CARRIES_RELATION_ID", nativeGraphReceipt, nativeGraphSeal, description, ["NON_SEMANTIC_VISUAL_CARRIES_SEMANTIC_AUTHORITY"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_ANIMATION_CAUSALITY");
  description.nonSemanticVisuals.push({
    visualId: "FALSE_CAUSAL_ANIMATION",
    semanticClassification: "NON_SEMANTIC_PRESENTATION",
    channelType: "ANIMATION_ORDER",
    purpose: "TRANSITION_INTERPOLATION",
    doesNotAssertRelation: true,
    impliedSemanticMeanings: ["CAUSALITY", "SCIENTIFIC_TEMPORAL_ORDER"]
  });
  await expectFail("ANIMATION_ORDER_FALSELY_IMPLIES_CAUSALITY_OR_TEMPORALITY", nativeGraphReceipt, nativeGraphSeal, description, ["ANIMATION_SEMANTIC_IMPLICATION_PROHIBITED"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_PROXIMITY_INFERENCE");
  description.nonSemanticVisuals.push({
    visualId: "PROXIMITY_RELATION_INFERENCE",
    semanticClassification: "NON_SEMANTIC_PRESENTATION",
    channelType: "PROXIMITY",
    purpose: "LAYOUT_COORDINATES",
    doesNotAssertRelation: false,
    impliedSemanticMeanings: ["NEW_RELATION"]
  });
  await expectFail("PROXIMITY_USED_TO_INFER_NEW_RELATION", nativeGraphReceipt, nativeGraphSeal, description, ["NON_SEMANTIC_VISUAL_CARRIES_SEMANTIC_AUTHORITY"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_ACCESSIBILITY_DIRECTION");
  const entry = description.accessibilityRepresentations.find((item) => item.kind === "RELATION");
  entry.directionRecoverable = false;
  await expectFail("ACCESSIBILITY_MODE_DESTROYS_RELATION_DIRECTION", nativeGraphReceipt, nativeGraphSeal, description, ["ACCESSIBILITY_SEMANTIC_LOSS"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_ACCESSIBILITY_UNRESOLVED");
  const entry = description.accessibilityRepresentations.find((item) => item.kind === "RESOLUTION");
  entry.resolutionStateRecoverable = false;
  await expectFail("ACCESSIBILITY_MODE_COLLAPSES_UNRESOLVED_STATE", nativeGraphReceipt, nativeGraphSeal, description, ["ACCESSIBILITY_SEMANTIC_LOSS"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_VIEWPORT_SEMANTIC_STATE");
  description.viewState.semanticOverrides = { relationExistence: "NONE" };
  await expectFail("VIEWPORT_CHANGE_ALTERS_SEMANTIC_STATE", nativeGraphReceipt, nativeGraphSeal, description, ["VIEW_STATE_SEMANTIC_MUTATION"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_ZOOM_RELATION_TYPE");
  description.viewState.zoomToken = "Z99";
  description.relationPresentations[0].relationType = "DERIVED_FROM";
  await expectFail("ZOOM_LEVEL_CHANGES_RELATION_TYPE", nativeGraphReceipt, nativeGraphSeal, description, ["RELATION_TYPE_MISMATCH"]);
}

{
  const description = lawfulDescription(nativeGraphReceipt, nativeGraphSeal, "ATTACK_WRITEBACK");
  description.projectionWriteback = {
    enabled: true,
    target: "G_C",
    mutation: "ADD_RELATION_FROM_PROJECTION"
  };
  await expectFail("REPLACEMENT_PROJECTION_WRITES_STATE_BACK_INTO_GRAPH", nativeGraphReceipt, nativeGraphSeal, description, ["PROJECTION_WRITEBACK_PROHIBITED"]);
}

const conformanceBytes = canonicalizeText(primaryConformanceReceipt);
writeFileSync(path.join(evidenceDir, "projection-conformance-receipt.v1.json"), conformanceBytes, "utf8");
const reparsedConformance = JSON.parse(readFileSync(path.join(evidenceDir, "projection-conformance-receipt.v1.json"), "utf8"));
assert.equal(canonicalizeText(reparsedConformance), conformanceBytes);

const projectionConformanceSeal = await createReceipt(reparsedConformance);
const projectionConformanceSealVerification = await verifyReceipt(projectionConformanceSeal);
assert.equal(projectionConformanceSealVerification.state, "VALID");
assert.deepEqual(projectionConformanceSeal.payload, reparsedConformance);

const postSealTamper = clone(projectionConformanceSeal);
postSealTamper.payload.disposition = "TAMPERED_AFTER_SEAL";
const postSealTamperVerification = await verifyReceipt(postSealTamper);
assert.equal(postSealTamperVerification.state, "INVALID");
assert.ok(postSealTamperVerification.reasons.includes("LINEAGE_DIGEST_MISMATCH"));

const harnessVerification = {
  schema: "LAWS_NONSPATIAL_PROJECTION_CONFORMANCE_HARNESS_VERIFICATION_v1",
  operation: "CONSTRUCT_AND_VERIFY_NONSPATIAL_PROJECTION_CONFORMANCE_HARNESS",
  constructionHead: process.env.GITHUB_SHA || null,
  policy: {
    ...POLICY_IDENTITY,
    modifiedByOperation: false
  },
  harness: {
    ...HARNESS_IDENTITY,
    zeroSpatialDependencies: true,
    questionAnswered: "IS_THIS_PROJECTION_DESCRIPTION_LAWFUL_UNDER_THE_FROZEN_POLICY"
  },
  representativeGraph: {
    nativeReceiptSchema: nativeGraphReceipt.schema,
    nativeReceiptLrpv1Digest: nativeGraphSeal.lineage_digest,
    productionContextGraph: false,
    graphModifiedByHarness: false
  },
  positiveSuite: {
    count: positiveResults.length,
    passed: positiveResults.length,
    results: positiveResults
  },
  adversarialSuite: {
    count: adversarialResults.length,
    rejectedAsExpected: adversarialResults.length,
    results: adversarialResults
  },
  lrpv1: {
    sealedReceiptSchema: primaryConformanceReceipt.schema,
    verificationState: projectionConformanceSealVerification.state,
    lineageDigest: projectionConformanceSeal.lineage_digest,
    postSealTamperState: postSealTamperVerification.state,
    postSealTamperReasons: postSealTamperVerification.reasons
  },
  spatialImplementationAuthority: "NOT_GRANTED_MAY_BE_CONSIDERED_AFTER_THIS_VERIFIED_GATE",
  spatialImplementation: false,
  productMutation: false,
  IMIInvoked: false,
  result: "PASS_NONSPATIAL_PROJECTION_CONFORMANCE_HARNESS_VERIFIED"
};

writeFileSync(path.join(evidenceDir, "positive-suite.v1.json"), canonicalizeText(positiveResults), "utf8");
writeFileSync(path.join(evidenceDir, "adversarial-suite.v1.json"), canonicalizeText(adversarialResults), "utf8");
writeFileSync(path.join(evidenceDir, "lrpv1-projection-conformance-receipt.v1.json"), canonicalizeText(projectionConformanceSeal), "utf8");
writeFileSync(path.join(evidenceDir, "lrpv1-projection-conformance-verification.v1.json"), canonicalizeText(projectionConformanceSealVerification), "utf8");
writeFileSync(path.join(evidenceDir, "harness-verification.v1.json"), canonicalizeText(harnessVerification), "utf8");

console.log(JSON.stringify(harnessVerification, null, 2));
