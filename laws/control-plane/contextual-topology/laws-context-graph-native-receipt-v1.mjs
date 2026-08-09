const PROFILE = Object.freeze({
  schema: "LAWS_CONTEXT_GRAPH_NATIVE_RECEIPT_PROFILE_v1",
  version: "1.0.0",
  nativeReceiptSchema: "LAWS_CONTEXT_GRAPH_NATIVE_RECEIPT_v1",
  receiptClass: "SEMANTIC_GRAPH_ASSEMBLY_EVIDENCE",
  graphContractVersion: "1.0.0",
  graphContractFreezeCommit: "84cd86ff93e657af6c38b52cfc6525da594f01a7",
  graphContractBlob: "240dbb7dca3db8f5a0a21e77d1aee91f1d21cb5a",
  assemblerSchema: "LAWS_CONTEXT_GRAPH_ASSEMBLER_v1",
  assemblerVersion: "1.0.0",
  assemblerConstructionCommit: "eb17fe67e8eb486b9f04dc221331ae96ed33d4fa",
  assemblerBlob: "f94fd5840316c338b7456957eeed8e77b24ac5fc"
});

const FORBIDDEN_VISUAL_FIELDS = new Set([
  "x", "y", "z", "screenX", "screenY", "screenPosition", "projectedRadius", "depth", "depthLayer",
  "orbitRadius", "quaternion", "camera", "visualPriority", "visualScale", "color", "animation"
]);

const clone = (value) => value == null ? value : structuredClone(value);

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function assertNoVisualAuthority(value, path = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoVisualAuthority(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_VISUAL_FIELDS.has(key)) throw new TypeError(`VISUAL_STATE_FIELD_FORBIDDEN:${path}.${key}`);
    assertNoVisualAuthority(item, `${path}.${key}`);
  }
}

export function emitNativeGraphReceipt(snapshot) {
  if (!snapshot || snapshot.schema !== "LAWS_CONTEXT_GRAPH_SNAPSHOT_v1") {
    throw new TypeError("NATIVE_GRAPH_RECEIPT_REQUIRES_LAWS_CONTEXT_GRAPH_SNAPSHOT_v1");
  }
  if (snapshot.graphContractVersion !== PROFILE.graphContractVersion) {
    throw new TypeError("GRAPH_CONTRACT_VERSION_MISMATCH");
  }
  if (snapshot.assemblyIdentity?.assembler !== PROFILE.assemblerSchema ||
      snapshot.assemblyIdentity?.assemblerVersion !== PROFILE.assemblerVersion ||
      snapshot.assemblyIdentity?.graphContractBlob !== PROFILE.graphContractBlob) {
    throw new TypeError("ASSEMBLER_OR_CONTRACT_IDENTITY_MISMATCH");
  }
  assertNoVisualAuthority(snapshot);
  const assertedNodeIds = (snapshot.assertedNodes ?? []).map((node) => node.identity).sort();
  const assertedEdgeIds = (snapshot.assertedEdges ?? []).map((edge) => edge.RELATION_ID).sort();
  if (new Set(assertedNodeIds).size !== assertedNodeIds.length) throw new TypeError("DUPLICATE_ASSERTED_NODE_ID");
  if (new Set(assertedEdgeIds).size !== assertedEdgeIds.length) throw new TypeError("DUPLICATE_ASSERTED_EDGE_ID");

  const receipt = canonicalize({
    schema: PROFILE.nativeReceiptSchema,
    profileVersion: PROFILE.version,
    receiptClass: PROFILE.receiptClass,
    graphContractVersion: snapshot.graphContractVersion,
    graphContractIdentity: {
      freezeCommit: PROFILE.graphContractFreezeCommit,
      blob: PROFILE.graphContractBlob
    },
    assemblerIdentity: {
      schema: PROFILE.assemblerSchema,
      version: PROFILE.assemblerVersion,
      constructionCommit: PROFILE.assemblerConstructionCommit,
      blob: PROFILE.assemblerBlob
    },
    contextBinding: clone(snapshot.contextBinding),
    sourceBindings: clone(snapshot.sourceBindings),
    assertedNodeIds,
    assertedEdgeIds,
    assertedEdges: clone(snapshot.assertedEdges ?? []),
    resolutionLedger: clone(snapshot.resolutionLedger ?? []),
    assemblyIdentity: clone(snapshot.assemblyIdentity),
    assemblyRejections: clone(snapshot.assemblyRejections ?? []),
    assemblyDisposition: "ASSEMBLY_SUCCEEDED_REPRESENTATIVE_GRAPH_NOT_PRODUCTION"
  });
  return deepFreeze(receipt);
}

export const NativeGraphReceiptBinding = deepFreeze(canonicalize(clone(PROFILE)));
