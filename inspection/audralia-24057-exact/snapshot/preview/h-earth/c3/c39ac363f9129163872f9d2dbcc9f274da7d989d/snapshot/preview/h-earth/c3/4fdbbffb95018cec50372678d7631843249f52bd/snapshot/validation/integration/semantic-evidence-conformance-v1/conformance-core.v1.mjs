const SEMANTIC_REQUIRED = Object.freeze([
  "schemaVersion",
  "receiptClass",
  "decisionId",
  "resolverIdentity",
  "contextBinding",
  "relation",
  "authority",
  "sourceIdentities",
  "provenancePointers",
  "qualifiers",
  "failureReasons",
  "inputDigest"
]);

const UNRESOLVED = new Set(["UNKNOWN", "UNEVALUABLE", "CONFLICTED"]);

function result(issues) {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...new Set(issues)].sort())
  });
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function stringArray(value, { nonEmpty = false } = {}) {
  return Array.isArray(value) &&
    (!nonEmpty || value.length > 0) &&
    value.every(nonEmptyString) &&
    new Set(value).size === value.length;
}

export function validateSemanticDecision(decision, contracts) {
  const issues = [];
  if (!decision || typeof decision !== "object" || Array.isArray(decision)) {
    return result(["SEMANTIC_DECISION_NOT_OBJECT"]);
  }

  for (const field of SEMANTIC_REQUIRED) {
    if (!Object.prototype.hasOwnProperty.call(decision, field)) issues.push(`SEMANTIC_REQUIRED_FIELD_MISSING:${field}`);
  }

  if (decision.schemaVersion !== contracts?.semanticDecisionProfile?.schema) issues.push("SEMANTIC_SCHEMA_VERSION_MISMATCH");
  if (decision.receiptClass !== contracts?.semanticDecisionProfile?.receiptClass) issues.push("SEMANTIC_RECEIPT_CLASS_MISMATCH");
  if (!nonEmptyString(decision.decisionId)) issues.push("SEMANTIC_DECISION_ID_INVALID");

  if (!nonEmptyString(decision?.resolverIdentity?.id) || !nonEmptyString(decision?.resolverIdentity?.version)) {
    issues.push("SEMANTIC_RESOLVER_IDENTITY_INVALID");
  }
  if (!nonEmptyString(decision?.contextBinding?.contextId) || !nonEmptyString(decision?.contextBinding?.contextRevision)) {
    issues.push("SEMANTIC_CONTEXT_BINDING_INVALID");
  }

  const relation = decision?.relation ?? {};
  const states = new Set(contracts?.relationResolution?.states ?? []);
  if (!nonEmptyString(relation.relationId) ||
      !nonEmptyString(relation.relationType) ||
      !nonEmptyString(relation.fromObjectIdentity) ||
      !nonEmptyString(relation.toObjectIdentity)) {
    issues.push("SEMANTIC_RELATION_IDENTITY_INVALID");
  }
  if (!states.has(relation.resolutionState)) issues.push("SEMANTIC_RESOLUTION_STATE_INVALID");
  if (typeof relation.edgeEligible !== "boolean") issues.push("SEMANTIC_EDGE_ELIGIBILITY_INVALID");
  if (relation.edgeEligible === true && relation.resolutionState !== "ASSERTED") {
    issues.push("SEMANTIC_EDGE_REQUIRES_ASSERTED");
  }

  if (!nonEmptyString(decision?.authority?.authorityId) ||
      !nonEmptyString(decision?.authority?.authorityVersion) ||
      !nonEmptyString(decision?.authority?.standing) ||
      !nonEmptyString(decision?.authority?.claimCeiling)) {
    issues.push("SEMANTIC_AUTHORITY_ENVELOPE_INVALID");
  }

  if (!stringArray(decision.sourceIdentities, { nonEmpty: true })) issues.push("SEMANTIC_SOURCE_IDENTITIES_INVALID");
  if (!stringArray(decision.provenancePointers, { nonEmpty: true })) issues.push("SEMANTIC_PROVENANCE_POINTERS_INVALID");
  if (!stringArray(decision.qualifiers)) issues.push("SEMANTIC_QUALIFIERS_INVALID");
  if (!stringArray(decision.failureReasons)) issues.push("SEMANTIC_FAILURE_REASONS_INVALID");
  if (typeof decision.inputDigest !== "string" || !/^[0-9a-f]{64}$/.test(decision.inputDigest)) {
    issues.push("SEMANTIC_INPUT_DIGEST_INVALID");
  }

  return result(issues);
}

export function validateAuthorityTransition(transition, contracts) {
  const issues = [];
  const states = new Set(contracts?.relationResolution?.states ?? []);
  if (!transition || typeof transition !== "object" || Array.isArray(transition)) {
    return result(["AUTHORITY_TRANSITION_NOT_OBJECT"]);
  }

  if (!states.has(transition.previousState) || !states.has(transition.nextState)) {
    issues.push("AUTHORITY_TRANSITION_STATE_INVALID");
  }
  const stateChanged = transition.previousState !== transition.nextState;
  if (stateChanged && !nonEmptyString(transition.authorityReceiptId)) {
    issues.push("AUTHORITY_TRANSITION_REQUIRES_AUTHORITY_RECEIPT");
  }
  if (transition.nextState === "ASSERTED" && transition.previousState !== "ASSERTED") {
    if (!stringArray(transition.sourceEvidenceReceiptIds, { nonEmpty: true })) {
      issues.push("AUTHORITY_TRANSITION_TO_ASSERTED_REQUIRES_EVIDENCE");
    }
  }
  if (transition.standingChanged === true && !nonEmptyString(transition.standingAuthorityReceiptId)) {
    issues.push("AUTHORITY_STANDING_CHANGE_REQUIRES_AUTHORITY_RECEIPT");
  }
  if (transition.claimCeilingChanged === true && !nonEmptyString(transition.claimCeilingAuthorityReceiptId)) {
    issues.push("AUTHORITY_CLAIM_CEILING_CHANGE_REQUIRES_AUTHORITY_RECEIPT");
  }

  return result(issues);
}

export function validateAiEvidenceTransformation(record, contracts) {
  const issues = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return result(["AI_TRANSFORMATION_NOT_OBJECT"]);
  }
  if (record.schemaVersion !== contracts?.aiEvidenceConformance?.schema) issues.push("AI_PROFILE_VERSION_MISMATCH");

  const input = record.inputAuthority ?? {};
  const output = record.output ?? {};
  const inputStates = Array.isArray(input.sourceRelationStates) ? input.sourceRelationStates : [];
  const allowedStates = new Set(contracts?.relationResolution?.states ?? []);
  const permittedClaims = new Set(Array.isArray(input.permittedOutputClaimClasses) ? input.permittedOutputClaimClasses : []);
  const modes = new Set(contracts?.aiEvidenceConformance?.epistemicModes ?? []);

  if (!stringArray(input.sourceReceiptIds, { nonEmpty: true })) issues.push("AI_SOURCE_RECEIPTS_INVALID");
  if (!inputStates.length || inputStates.some((state) => !allowedStates.has(state))) issues.push("AI_SOURCE_RELATION_STATES_INVALID");
  if (!stringArray(input.permittedOutputClaimClasses, { nonEmpty: true })) issues.push("AI_PERMITTED_CLAIM_CLASSES_INVALID");
  if (output.mutatesSourceReceipt === true) issues.push("AI_SOURCE_RECEIPT_MUTATION_PROHIBITED");

  const claims = Array.isArray(output.claims) ? output.claims : [];
  if (!claims.length) issues.push("AI_OUTPUT_CLAIMS_REQUIRED");

  const unresolvedPresent = inputStates.some((state) => UNRESOLVED.has(state));
  const assertedInputPresent = inputStates.includes("ASSERTED");

  for (const claim of claims) {
    if (!permittedClaims.has(claim?.claimClass)) issues.push("AI_CLAIM_CEILING_VIOLATION");
    if (!modes.has(claim?.epistemicMode)) issues.push("AI_EPISTEMIC_MODE_INVALID");
    if (!stringArray(claim?.sourceReceiptIds, { nonEmpty: true })) issues.push("AI_CLAIM_SOURCE_RECEIPTS_INVALID");
    if (claim?.relationState === "ASSERTED" &&
        !assertedInputPresent &&
        !nonEmptyString(claim?.authorizedTransitionReceiptId)) {
      issues.push("AI_UNAUTHORIZED_ASSERTION");
    }
    if (input.preserveUnresolvedStates === true && unresolvedPresent && claim?.suppressesUnresolvedState === true) {
      issues.push("AI_UNRESOLVED_STATE_SUPPRESSED");
    }
  }

  return result(issues);
}

export function validateRuntimeCaptureOrder(record, contracts) {
  const issues = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return result(["RUNTIME_CAPTURE_RECORD_NOT_OBJECT"]);
  }
  if (record.schemaVersion !== contracts?.runtimeCaptureOrder?.schema) issues.push("RUNTIME_CAPTURE_PROFILE_VERSION_MISMATCH");
  if (record.failureObserved !== true) return result(issues);

  const events = Array.isArray(record.events) ? record.events : [];
  const sequences = events.map((event) => event?.sequence);
  if (!events.length ||
      sequences.some((value) => !Number.isSafeInteger(value) || value < 1) ||
      new Set(sequences).size !== sequences.length ||
      sequences.some((value, index) => index > 0 && value <= sequences[index - 1])) {
    issues.push("RUNTIME_EVENT_SEQUENCE_INVALID");
  }

  const first = (type) => events.find((event) => event?.type === type)?.sequence ?? null;
  const capture = first("CAPTURED");
  const seal = first("SEALED");
  const persist = first("PERSISTED");
  const teardown = first("TEARDOWN");

  if (capture === null) issues.push("RUNTIME_FAILURE_CAPTURE_MISSING");
  if (seal === null) issues.push("RUNTIME_FAILURE_SEAL_MISSING");
  if (persist === null) issues.push("RUNTIME_FAILURE_PERSISTENCE_MISSING");
  if (teardown === null) issues.push("RUNTIME_TEARDOWN_EVENT_MISSING");

  if (teardown !== null && capture !== null && teardown < capture) issues.push("TEARDOWN_BEFORE_CAPTURE");
  if (capture !== null && seal !== null && seal < capture) issues.push("SEAL_BEFORE_CAPTURE");
  if (seal !== null && persist !== null && persist < seal) issues.push("PERSIST_BEFORE_SEAL");
  if (persist !== null && teardown !== null && teardown < persist) issues.push("TEARDOWN_BEFORE_PERSISTENCE");

  if (record.capturePayloadPresent !== true) issues.push("RUNTIME_CAPTURE_PAYLOAD_MISSING");
  if (record.sealedReceiptPresent !== true) issues.push("RUNTIME_SEALED_RECEIPT_MISSING");
  if (record.persistedArtifactPresent !== true) issues.push("RUNTIME_PERSISTED_ARTIFACT_MISSING");

  return result(issues);
}

export function validateBoundaryMetadata(metadata, contracts) {
  const issues = [];
  if (metadata?.lrpv1CoreMutationPerformed === true) issues.push("LRPV1_CORE_MUTATION_PROHIBITED");
  if (metadata?.subjectSystemMutationPerformed === true) issues.push("SUBJECT_SYSTEM_MUTATION_PROHIBITED");
  if (metadata?.scientificClaimUpgradePerformed === true) issues.push("SCIENTIFIC_CLAIM_UPGRADE_PROHIBITED");
  if (metadata?.graphContractConstructed === true && contracts?.graphConformance?.status === "DEFERRED_PENDING_CONTEXT_GRAPH_CONTRACT_FREEZE") {
    issues.push("GRAPH_CONTRACT_PREMATURE_CONSTRUCTION");
  }
  return result(issues);
}
