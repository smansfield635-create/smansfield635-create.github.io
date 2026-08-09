import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { assembleContextGraph } from "./laws-context-graph-assembler-v1.mjs";
import { emitNativeGraphReceipt } from "./laws-context-graph-native-receipt-v1.mjs";
import { validateNativeGraphReceiptConformance, AuthoritativeEstateConformanceBinding } from "./laws-context-graph-evidence-conformance-v1.mjs";
import { adaptTestsObjectProjectionRegistry, GammaOutcome, resolveGamma } from "./laws-contextual-gamma-resolver-v1.mjs";
import { canonicalizeText, createReceipt, verifyReceipt } from "../../../infrastructure/lineage-receipt-protocol-v1/javascript/lineage_receipt_protocol_v1.mjs";

const readJson = (url) => JSON.parse(readFileSync(url, "utf8"));
const clone = (value) => structuredClone(value);
const evidenceDir = process.env.LAWS_CONTEXT_GRAPH_EVIDENCE_DIR || "/tmp/laws-context-graph-evidence";
mkdirSync(evidenceDir, { recursive: true });

const profile = readJson(new URL("./laws-context-graph-native-receipt-profile-v1.json", import.meta.url));
const relationRegistry = readJson(new URL("./laws-contextual-relation-registry-v1.json", import.meta.url));
const nativeTestsRegistry = readJson(new URL("../../../control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json", import.meta.url));

const estateRoot = process.env.ESTATE_CONFORMANCE_ROOT;
assert.ok(estateRoot, "ESTATE_CONFORMANCE_ROOT is required and must point to exact authoritative #813 checkout");
const estateContractsPath = path.join(estateRoot, "validation/integration/semantic-evidence-conformance-v1/contracts.v1.json");
const estateCorePath = path.join(estateRoot, "validation/integration/semantic-evidence-conformance-v1/conformance-core.v1.mjs");
const estateContracts = JSON.parse(readFileSync(estateContractsPath, "utf8"));
const estateCore = await import(pathToFileURL(estateCorePath).href);

const sourceDescriptor = Object.freeze({
  sourceId: "SRC09",
  path: "control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json",
  gitBlob: "b801a11e342051a6b00e6f7098b1d691685ad0b6"
});
const GAMMA_RESOLVER_BLOB = "1d715884d71419ac25892da452ca7b6d21e6c909";
const RELATION_REGISTRY_BLOB = "5d79eca4ee7d9366f8d8c2287c34001ae37ffc4e";
const LRPV1_JS_BLOB = "98b8173893a437f31bb8d71ffbf06ae5a1eec4e2";

const adapted = adaptTestsObjectProjectionRegistry({ registry: nativeTestsRegistry, relationRegistry, sourceDescriptor });
const adaptedObject = (id) => adapted.authoritativeObjects.find((entry) => entry.identity === id);
const portfolio = adaptedObject("PROSPECTIVE_FINAL_REPORT_PORTFOLIO");
const routeOperator = adaptedObject("ROUTE_OPERATOR_PLATFORM");
const methods = adaptedObject("METHODS");
assert.ok(portfolio && routeOperator && methods, "native Tests EXECUTES/GOVERNS endpoints must exist");

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
    provenance: { source: "laws-context-graph-native-evidence-verifier-fixture", baseClassIdentity: routeOperator.identity }
  });
}

const unknownObject = syntheticObject("GRAPH_EVIDENCE_UNKNOWN_OBJECT");
const noneObject = syntheticObject("GRAPH_EVIDENCE_NONE_OBJECT");
const unevaluableObject = syntheticObject("GRAPH_EVIDENCE_UNEVALUABLE_OBJECT");
const conflictedObject = syntheticObject("GRAPH_EVIDENCE_CONFLICTED_OBJECT");
const admittedObjects = [...adapted.authoritativeObjects, unknownObject, noneObject, unevaluableObject, conflictedObject];

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
    sourceBinding: sourceDescriptor,
    resolverIdentity: GAMMA_RESOLVER_BLOB,
    relationRegistryIdentity: RELATION_REGISTRY_BLOB
  });
}

const realExecutes = evaluation(routeOperator, adapted.relationRecords);
const realGoverns = evaluation(methods, adapted.relationRecords);
const unknown = evaluation(unknownObject, []);
const none = evaluation(noneObject, [syntheticRecord(noneObject, { EXISTENCE_STATE: "NONE" })], ["EXECUTES"]);
const unevaluable = evaluation(unevaluableObject, [syntheticRecord(unevaluableObject, { AUTHORITY_STATUS: "UNRESOLVED" })], ["EXECUTES"]);
const conflictId = `${conflictedObject.identity}:CONFLICT`;
const conflicted = evaluation(conflictedObject, [
  syntheticRecord(conflictedObject, { RELATION_ID: conflictId, EXISTENCE_STATE: "ASSERTED" }),
  syntheticRecord(conflictedObject, { RELATION_ID: conflictId, EXISTENCE_STATE: "NONE" })
], ["EXECUTES"]);

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
assert.equal(representativeGraph.assertedEdges.length, 2);
assert.deepEqual(representativeGraph.assertedEdges.map((edge) => edge.RELATION_TYPE).sort(), ["EXECUTES", "GOVERNS_PROCEDURE_FOR"]);
assert.deepEqual(new Set(representativeGraph.resolutionLedger.map((entry) => entry.gammaOutcome)), new Set(["ASSERTED", "NONE", "UNKNOWN", "UNEVALUABLE", "CONFLICTED"]));

const nativeReceipt = emitNativeGraphReceipt(representativeGraph);
const estateBinding = {...AuthoritativeEstateConformanceBinding};
const conformance = validateNativeGraphReceiptConformance({
  nativeReceipt,
  assembledGraph: representativeGraph,
  receiptProfile: profile,
  estateContracts,
  estateCore,
  estateBinding
});
assert.equal(conformance.valid, true, conformance.issues.join("\n"));

const adversarial = [];
function expectConformanceFail(name, mutate, expectedIssuePrefix) {
  const tampered = clone(nativeReceipt);
  mutate(tampered);
  const result = validateNativeGraphReceiptConformance({
    nativeReceipt: tampered,
    assembledGraph: representativeGraph,
    receiptProfile: profile,
    estateContracts,
    estateCore,
    estateBinding
  });
  assert.equal(result.valid, false, `${name} must fail conformance`);
  assert.ok(result.issues.some((issue) => issue.startsWith(expectedIssuePrefix)), `${name} missing ${expectedIssuePrefix}: ${result.issues.join(",")}`);
  adversarial.push({ name, expectedDisposition: "CONFORMANCE_FAIL", observedValid: result.valid, issues: result.issues });
}

expectConformanceFail("UNKNOWN_LEDGER_STATE_CONVERTED_TO_EDGE", (receipt) => {
  const template = clone(receipt.assertedEdges[0]);
  template.RELATION_ID = "TAMPER_UNKNOWN_EDGE";
  template.FROM_OBJECT = unknownObject.identity;
  template.TO_OBJECT = portfolio.identity;
  template.EXISTENCE_STATE = "UNKNOWN";
  receipt.assertedEdges.push(template);
  receipt.assertedEdgeIds.push(template.RELATION_ID);
  receipt.assertedEdgeIds.sort();
}, "EDGE_NOT_ASSERTED:");

expectConformanceFail("SUPPRESSED_UNRESOLVED_LEDGER_ENTRY", (receipt) => {
  receipt.resolutionLedger = receipt.resolutionLedger.filter((entry) => entry.gammaOutcome !== "UNKNOWN");
}, "RESOLUTION_LEDGER_NOT_PRESERVED");

expectConformanceFail("UPGRADED_SCIENTIFIC_STANDING", (receipt) => {
  receipt.assertedEdges[0].SCIENTIFIC_STANDING = "UPGRADED_BY_GRAPH";
}, "SCIENTIFIC_STANDING_CHANGED:");

expectConformanceFail("INCREASED_CLAIM_CEILING", (receipt) => {
  receipt.assertedEdges[0].CLAIM_CEILING = "INCREASED_BY_GRAPH";
}, "CLAIM_CEILING_CHANGED:");

expectConformanceFail("ALTERED_ASSERTED_EDGE_AFTER_ASSEMBLY", (receipt) => {
  receipt.assertedEdges[0].QUALIFIERS = { tamperedAfterAssembly: true };
}, "ASSERTED_EDGE_PAYLOAD_NOT_PRESERVED");

const nativeBytes = canonicalizeText(nativeReceipt);
const nativeReceiptPath = path.join(evidenceDir, "native-graph-receipt.v1.json");
writeFileSync(nativeReceiptPath, nativeBytes, "utf8");
const reparsedNative = JSON.parse(readFileSync(nativeReceiptPath, "utf8"));
assert.equal(canonicalizeText(reparsedNative), nativeBytes, "native receipt file must be exact canonical bytes");

const lrpv1Seal = await createReceipt(reparsedNative);
const lrpv1Verification = await verifyReceipt(lrpv1Seal);
assert.equal(lrpv1Verification.state, "VALID", lrpv1Verification.reasons.join("\n"));
assert.deepEqual(lrpv1Seal.payload, reparsedNative, "LRPv1 must seal the exact native receipt payload");

const postSealTamper = clone(lrpv1Seal);
postSealTamper.payload.assertedNodeIds = [...postSealTamper.payload.assertedNodeIds, "POST_SEAL_TAMPER"];
const tamperVerification = await verifyReceipt(postSealTamper);
assert.equal(tamperVerification.state, "INVALID");
assert.ok(tamperVerification.reasons.includes("LINEAGE_DIGEST_MISMATCH"));
adversarial.push({
  name: "POST_SEAL_NATIVE_RECEIPT_TAMPER",
  expectedDisposition: "LRPV1_INVALID",
  observedState: tamperVerification.state,
  reasons: tamperVerification.reasons
});

const graphEvidenceVerification = {
  schema: "LAWS_CONTEXT_GRAPH_EVIDENCE_VERIFICATION_v1",
  operation: "NATIVE_GRAPH_EVIDENCE_CONFORMANCE_BINDING",
  constructionHead: process.env.GITHUB_SHA || null,
  assembler: {
    constructionCommit: "eb17fe67e8eb486b9f04dc221331ae96ed33d4fa",
    blob: "f94fd5840316c338b7456957eeed8e77b24ac5fc",
    modifiedByOperation: false
  },
  nativeGraphReceipt: {
    schema: nativeReceipt.schema,
    canonicalBytesPreserved: true,
    representativeGraphOnly: true,
    productionContextGraph: false,
    assertedEdgeCount: nativeReceipt.assertedEdgeIds.length,
    ledgerEntryCount: nativeReceipt.resolutionLedger.length
  },
  estateConformance: {
    ...AuthoritativeEstateConformanceBinding,
    result: conformance.valid ? "PASS" : "FAIL",
    issues: conformance.issues
  },
  lrpv1: {
    protocol: "LINEAGE_RECEIPT_PROTOCOL_v1",
    javascriptReferenceBlob: LRPV1_JS_BLOB,
    verificationState: lrpv1Verification.state,
    lineageDigest: lrpv1Seal.lineage_digest,
    postSealTamperState: tamperVerification.state
  },
  adversarialCases: adversarial,
  spatialProjectionGate: "CLOSED",
  productMutation: false,
  IMIInvoked: false,
  result: "PASS_NATIVE_GRAPH_EVIDENCE_CONFORMANT_AND_LINEAGE_SEALED"
};

writeFileSync(path.join(evidenceDir, "graph-conformance-result.v1.json"), canonicalizeText(conformance), "utf8");
writeFileSync(path.join(evidenceDir, "lrpv1-native-graph-receipt.v1.json"), canonicalizeText(lrpv1Seal), "utf8");
writeFileSync(path.join(evidenceDir, "lrpv1-verification.v1.json"), canonicalizeText(lrpv1Verification), "utf8");
writeFileSync(path.join(evidenceDir, "adversarial-results.v1.json"), canonicalizeText(adversarial), "utf8");
writeFileSync(path.join(evidenceDir, "graph-evidence-verification.v1.json"), canonicalizeText(graphEvidenceVerification), "utf8");

console.log(JSON.stringify(graphEvidenceVerification, null, 2));
