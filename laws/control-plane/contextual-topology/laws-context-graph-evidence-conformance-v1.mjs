const EXPECTED_ESTATE = Object.freeze({
  commit: "8df49529c3895ff07ee4655f3dd3ec708bb977aa",
  contractsBlob: "d492553d96fbeafb6550fd422e543c98c3b12a55",
  coreBlob: "42b6469dec1a36cfaad41cb9d022f40c20841ae4",
  operationId: "ESTATE_SEMANTIC_EVIDENCE_CONFORMANCE_SUPPORT_v1"
});

const EXPECTED_GRAPH_LAWS = Object.freeze([
  "NON_ASSERTED_RESOLUTION_MAY_NOT_BE_PRESENTED_AS_ASSERTED_CONNECTIVITY",
  "GRAPH_OR_GEOMETRY_MAY_NOT_UPGRADE_UPSTREAM_STANDING_OR_CLAIM_CEILING",
  "SPATIAL_MANIFESTATION_HAS_NO_SCIENTIFIC_RELATION_AUTHORITY"
]);

const FORBIDDEN_VISUAL_FIELDS = new Set([
  "x", "y", "z", "screenX", "screenY", "screenPosition", "projectedRadius", "depth", "depthLayer",
  "orbitRadius", "quaternion", "camera", "visualPriority", "visualScale", "color", "animation"
]);

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}
const stable = (value) => JSON.stringify(canonicalize(value));
const same = (a, b) => stable(a) === stable(b);
const uniqSorted = (values) => [...new Set(values)].sort();

function scanVisualFields(value, path, issues) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanVisualFields(item, `${path}[${index}]`, issues));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_VISUAL_FIELDS.has(key)) issues.push(`VISUAL_STATE_AUTHORITY_FORBIDDEN:${path}.${key}`);
    scanVisualFields(item, `${path}.${key}`, issues);
  }
}

function edgeMap(edges) {
  return new Map((edges ?? []).map((edge) => [edge.RELATION_ID, edge]));
}

export function validateNativeGraphReceiptConformance({
  nativeReceipt,
  assembledGraph,
  receiptProfile,
  estateContracts,
  estateCore,
  estateBinding
}) {
  const issues = [];

  if (estateBinding?.commit !== EXPECTED_ESTATE.commit) issues.push("ESTATE_813_COMMIT_IDENTITY_MISMATCH");
  if (estateBinding?.contractsBlob !== EXPECTED_ESTATE.contractsBlob) issues.push("ESTATE_813_CONTRACTS_BLOB_MISMATCH");
  if (estateBinding?.coreBlob !== EXPECTED_ESTATE.coreBlob) issues.push("ESTATE_813_CORE_BLOB_MISMATCH");
  if (estateContracts?.schema !== "ESTATE_SEMANTIC_EVIDENCE_CONFORMANCE_CONTRACTS_v1" ||
      estateContracts?.operationId !== EXPECTED_ESTATE.operationId) issues.push("ESTATE_813_CONTRACT_IDENTITY_INVALID");
  if (estateContracts?.relationResolution?.edgeAdmissionRule !== "EDGE_ELIGIBLE_IMPLIES_ASSERTED") {
    issues.push("ESTATE_EDGE_ADMISSION_RULE_MISMATCH");
  }
  if (estateContracts?.relationResolution?.nonAssertedStatesRemainDistinct !== true) {
    issues.push("ESTATE_NON_ASSERTED_STATE_SEPARATION_NOT_BOUND");
  }
  if (estateContracts?.relationResolution?.graphMembershipMayUpgradeResolution !== false) {
    issues.push("ESTATE_GRAPH_MEMBERSHIP_UPGRADE_BOUNDARY_NOT_BOUND");
  }
  const graphLaws = new Set(estateContracts?.graphConformance?.currentBoundaryOnly ?? []);
  for (const law of EXPECTED_GRAPH_LAWS) if (!graphLaws.has(law)) issues.push(`ESTATE_GRAPH_LAW_MISSING:${law}`);

  if (!nativeReceipt || nativeReceipt.schema !== receiptProfile?.nativeReceiptSchema) issues.push("NATIVE_GRAPH_RECEIPT_SCHEMA_MISMATCH");
  if (nativeReceipt?.profileVersion !== receiptProfile?.version) issues.push("NATIVE_GRAPH_RECEIPT_PROFILE_VERSION_MISMATCH");
  if (nativeReceipt?.receiptClass !== receiptProfile?.receiptClass) issues.push("NATIVE_GRAPH_RECEIPT_CLASS_MISMATCH");
  for (const field of receiptProfile?.requiredFields ?? []) {
    if (!Object.prototype.hasOwnProperty.call(nativeReceipt ?? {}, field)) issues.push(`NATIVE_GRAPH_RECEIPT_REQUIRED_FIELD_MISSING:${field}`);
  }

  if (!assembledGraph || assembledGraph.schema !== "LAWS_CONTEXT_GRAPH_SNAPSHOT_v1") issues.push("ASSEMBLED_GRAPH_SCHEMA_INVALID");
  if (nativeReceipt?.graphContractVersion !== assembledGraph?.graphContractVersion) issues.push("GRAPH_CONTRACT_VERSION_NOT_PRESERVED");
  if (!same(nativeReceipt?.contextBinding, assembledGraph?.contextBinding)) issues.push("CONTEXT_BINDING_NOT_PRESERVED");
  if (!same(nativeReceipt?.sourceBindings, assembledGraph?.sourceBindings)) issues.push("SOURCE_BINDINGS_NOT_PRESERVED");
  if (!same(nativeReceipt?.resolutionLedger, assembledGraph?.resolutionLedger)) issues.push("RESOLUTION_LEDGER_NOT_PRESERVED");
  if (!same(nativeReceipt?.assemblyIdentity, assembledGraph?.assemblyIdentity)) issues.push("ASSEMBLY_IDENTITY_NOT_PRESERVED");
  if (!same(nativeReceipt?.assemblyRejections, assembledGraph?.assemblyRejections)) issues.push("ASSEMBLY_REJECTIONS_NOT_PRESERVED");

  const expectedNodeIds = (assembledGraph?.assertedNodes ?? []).map((node) => node.identity).sort();
  const expectedEdgeIds = (assembledGraph?.assertedEdges ?? []).map((edge) => edge.RELATION_ID).sort();
  if (!same(nativeReceipt?.assertedNodeIds, expectedNodeIds)) issues.push("ASSERTED_NODE_IDENTITIES_NOT_PRESERVED");
  if (!same(nativeReceipt?.assertedEdgeIds, expectedEdgeIds)) issues.push("ASSERTED_EDGE_IDENTITIES_NOT_PRESERVED");
  if (!same(nativeReceipt?.assertedEdges, assembledGraph?.assertedEdges)) issues.push("ASSERTED_EDGE_PAYLOAD_NOT_PRESERVED");

  const sourceEdges = edgeMap(assembledGraph?.assertedEdges);
  const receiptEdges = edgeMap(nativeReceipt?.assertedEdges);
  let standingChanged = false;
  let claimCeilingChanged = false;
  for (const [id, sourceEdge] of sourceEdges) {
    const receiptEdge = receiptEdges.get(id);
    if (!receiptEdge) continue;
    if (!same(receiptEdge.SCIENTIFIC_STANDING, sourceEdge.SCIENTIFIC_STANDING)) {
      standingChanged = true;
      issues.push(`SCIENTIFIC_STANDING_CHANGED:${id}`);
    }
    if (!same(receiptEdge.CLAIM_CEILING, sourceEdge.CLAIM_CEILING)) {
      claimCeilingChanged = true;
      issues.push(`CLAIM_CEILING_CHANGED:${id}`);
    }
  }

  const allowedStates = new Set(estateContracts?.relationResolution?.states ?? []);
  const edgeIds = new Set(nativeReceipt?.assertedEdgeIds ?? []);
  const assertedLedgerRelationIds = new Set();
  for (const entry of nativeReceipt?.resolutionLedger ?? []) {
    if (!allowedStates.has(entry.gammaOutcome)) issues.push(`LEDGER_STATE_OUTSIDE_ESTATE_VOCABULARY:${entry.gammaOutcome}`);
    const ids = Array.isArray(entry.resolvedRelationIds) ? entry.resolvedRelationIds : [];
    if (entry.gammaOutcome === "ASSERTED") ids.forEach((id) => assertedLedgerRelationIds.add(id));
    else for (const id of ids) if (edgeIds.has(id)) issues.push(`NON_ASSERTED_LEDGER_STATE_PRESENTED_AS_EDGE:${entry.gammaOutcome}:${id}`);
  }
  for (const edge of nativeReceipt?.assertedEdges ?? []) {
    if (edge.EXISTENCE_STATE !== "ASSERTED") issues.push(`EDGE_NOT_ASSERTED:${edge.RELATION_ID ?? "UNKNOWN"}`);
    if (!assertedLedgerRelationIds.has(edge.RELATION_ID)) issues.push(`EDGE_WITHOUT_ASSERTED_LEDGER_AUTHORITY:${edge.RELATION_ID ?? "UNKNOWN"}`);
  }

  scanVisualFields(nativeReceipt, "$receipt", issues);

  if (typeof estateCore?.validateBoundaryMetadata !== "function") {
    issues.push("ESTATE_813_CORE_VALIDATOR_UNAVAILABLE");
  } else {
    const boundary = estateCore.validateBoundaryMetadata({
      lrpv1CoreMutationPerformed: false,
      subjectSystemMutationPerformed: false,
      scientificClaimUpgradePerformed: standingChanged || claimCeilingChanged,
      graphContractConstructed: false
    }, estateContracts);
    if (boundary?.valid !== true) {
      for (const issue of boundary?.issues ?? ["UNKNOWN"]) issues.push(`ESTATE_BOUNDARY:${issue}`);
    }
  }

  return Object.freeze({
    schema: "LAWS_CONTEXT_GRAPH_EVIDENCE_CONFORMANCE_RESULT_v1",
    valid: issues.length === 0,
    issues: Object.freeze(uniqSorted(issues)),
    estateConformanceBinding: Object.freeze({...EXPECTED_ESTATE}),
    graphConformanceMode: "GRAPH_SPECIFIC_CONSUMER_OF_AUTHORITATIVE_813_CURRENT_BOUNDARY_LAWS",
    representativeGraphOnly: true,
    productionGraphClaimed: false,
    spatialProjectionAuthorized: false
  });
}

export const AuthoritativeEstateConformanceBinding = EXPECTED_ESTATE;
