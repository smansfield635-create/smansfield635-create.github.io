import {
  canonicalizeText,
  digest,
  verifyReceipt
} from "../../../infrastructure/lineage-receipt-protocol-v1/javascript/lineage_receipt_protocol_v1.mjs";

export const ProjectionConformanceHarnessBinding = Object.freeze({
  schema: "LAWS_NONSPATIAL_PROJECTION_CONFORMANCE_HARNESS_v1",
  version: "1.0.0",
  receiptSchema: "LAWS_PROJECTION_CONFORMANCE_RECEIPT_v1",
  acceptedProjectionDescriptionSchema: "LAWS_ABSTRACT_PROJECTION_DESCRIPTION_v1",
  acceptedPolicySchema: "LAWS_SEMANTICS_PRESERVING_PROJECTION_POLICY_v1",
  acceptedPolicyVersion: "1.0.0",
  policyFreezeCommit: "c60b2102998cfbacd0a2bcb2b7cccf123e17738c",
  policyBlob: "93f8d8d9edcb961f2bacf6f82be799f347b19217",
  acceptedNativeGraphReceiptSchema: "LAWS_CONTEXT_GRAPH_NATIVE_RECEIPT_v1",
  semanticProfile: "DIRECT_TYPED_RELATION_V1",
  zeroSpatialDependencies: true
});

export const ProjectionConformanceReasonCodes = Object.freeze([
  "GRAPH_RECEIPT_INVALID",
  "GRAPH_RECEIPT_SEAL_PAYLOAD_MISMATCH",
  "GRAPH_BINDING_MISMATCH",
  "POLICY_BINDING_MISMATCH",
  "PROJECTION_DESCRIPTION_SCHEMA_MISMATCH",
  "PROJECTION_DESCRIPTION_REQUIRED_FIELD_MISSING",
  "UNCLASSIFIED_VISUAL_CUE",
  "EDGE_WITHOUT_ASSERTED_RELATION",
  "NON_ASSERTED_STATE_EXPRESSED_SEMANTICALLY",
  "RELATION_DIRECTION_REVERSED",
  "RELATION_DIRECTION_LOST",
  "RELATION_TYPE_MISMATCH",
  "RELATION_PROFILE_MISMATCH",
  "RELATION_QUALIFIER_MISMATCH",
  "SCIENTIFIC_STANDING_MISMATCH",
  "CLAIM_CEILING_MISMATCH",
  "AUTHORITY_IDENTITY_MISMATCH",
  "PROVENANCE_IDENTITY_MISMATCH",
  "SEMANTIC_CHANNEL_NOT_AUTHORIZED",
  "REQUIRED_SEMANTIC_CHANNEL_MISSING",
  "ASSERTED_RELATION_UNACCOUNTED",
  "ASSERTED_RELATION_DUPLICATED",
  "VISIBLE_RELATION_PRESENTATION_MISSING",
  "VISIBLE_RELATION_PRESENTATION_DUPLICATED",
  "SUPPRESSION_REASON_NOT_AUTHORIZED",
  "HIDDEN_RELATION_REPORTED_NONEXISTENT",
  "PARALLEL_RELATION_MULTIPLICITY_LOST",
  "BUNDLE_MEMBER_NOT_RECOVERABLE",
  "BUNDLE_MEMBER_NOT_VISIBLE",
  "VISUAL_CLUSTER_AUTHORITY_PROHIBITED",
  "VISUAL_CLUSTER_MEMBER_UNKNOWN",
  "UNRESOLVED_STATE_UNACCOUNTED",
  "UNRESOLVED_STATE_DUPLICATED",
  "UNRESOLVED_STATE_MISMATCH",
  "UNRESOLVED_STATE_NOT_RECOVERABLE",
  "NON_SEMANTIC_VISUAL_CARRIES_SEMANTIC_AUTHORITY",
  "NON_SEMANTIC_PURPOSE_NOT_AUTHORIZED",
  "ANIMATION_SEMANTIC_IMPLICATION_PROHIBITED",
  "ACCESSIBILITY_SEMANTIC_LOSS",
  "VIEW_STATE_SEMANTIC_MUTATION",
  "PROJECTION_WRITEBACK_PROHIBITED",
  "GRAPH_MUTATED_BY_HARNESS"
]);

const REQUIRED_DESCRIPTION_FIELDS = Object.freeze([
  "schema",
  "projectionId",
  "graphBinding",
  "policyBinding",
  "viewState",
  "visibleNodeIds",
  "suppressedNodeIds",
  "visibleRelationIds",
  "relationPresentations",
  "suppressedRelations",
  "resolutionPresentations",
  "relationBundles",
  "visualClusters",
  "nonSemanticVisuals",
  "accessibilityRepresentations",
  "projectionWriteback"
]);

const REQUIRED_SAFE_SEMANTIC_CHANNELS = Object.freeze([
  "DIRECT_CONNECTION",
  "DIRECTION_MARKER",
  "RELATION_TYPE_LABEL"
]);

const AMBIGUOUS_CHANNELS = new Set([
  "PROXIMITY",
  "DISTANCE",
  "SIZE",
  "LUMINANCE",
  "LINE_WEIGHT",
  "COLOR",
  "SHARED_COLOR",
  "OPACITY",
  "PERSISTENCE",
  "PLACEMENT",
  "DEPTH",
  "ORBIT",
  "CONTAINMENT",
  "GROUPING",
  "CONVERGENCE",
  "MOTION_PATH",
  "ANIMATION_ORDER",
  "ANIMATION_EMPHASIS"
]);

const ANIMATION_CHANNELS = new Set([
  "MOTION_PATH",
  "ANIMATION_ORDER",
  "ANIMATION_EMPHASIS"
]);

const clone = (value) => value == null ? value : structuredClone(value);
const stableEqual = (a, b) => canonicalizeText(a) === canonicalizeText(b);
const nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

function uniqueStrings(value) {
  return Array.isArray(value) && value.every(nonEmptyString) && new Set(value).size === value.length;
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function addViolation(target, code, details = {}) {
  target.push(Object.freeze({ code, ...clone(details) }));
}

function resultCount(records) {
  return Array.isArray(records) ? records.length : 0;
}

function checkResult(name, before, violations) {
  return Object.freeze({
    name,
    passed: violations.length === before
  });
}

function exactSetEqual(left, right) {
  if (!uniqueStrings(left) || !uniqueStrings(right)) return false;
  return stableEqual([...left].sort(), [...right].sort());
}

function nonAssertedLedger(nativeGraphReceipt) {
  return (nativeGraphReceipt.resolutionLedger ?? []).filter((entry) => entry.gammaOutcome !== "ASSERTED");
}

function ledgerStateForPresentation(presentation, ledger) {
  if (!nonEmptyString(presentation?.sourceResolutionObjectId)) return null;
  return ledger.find((entry) => entry.evaluatedObjectIdentity === presentation.sourceResolutionObjectId) ?? null;
}

export async function judgeProjectionDescription({
  nativeGraphReceipt,
  nativeGraphLrpv1Receipt,
  projectionPolicy,
  projectionPolicyIdentity,
  projectionDescription,
  harnessIdentity = ProjectionConformanceHarnessBinding
}) {
  const graphBefore = canonicalizeText(nativeGraphReceipt);
  const violations = [];
  const checks = [];

  {
    const before = violations.length;
    const graphSeal = await verifyReceipt(nativeGraphLrpv1Receipt);
    if (graphSeal.state !== "VALID" ||
        nativeGraphReceipt?.schema !== ProjectionConformanceHarnessBinding.acceptedNativeGraphReceiptSchema) {
      addViolation(violations, "GRAPH_RECEIPT_INVALID", { verificationState: graphSeal.state });
    }
    if (!stableEqual(nativeGraphLrpv1Receipt?.payload, nativeGraphReceipt)) {
      addViolation(violations, "GRAPH_RECEIPT_SEAL_PAYLOAD_MISMATCH");
    }

    const expectedGraphBinding = {
      nativeReceiptLrpv1Digest: nativeGraphLrpv1Receipt?.lineage_digest ?? null,
      assemblyIdentity: clone(nativeGraphReceipt?.assemblyIdentity),
      graphContractIdentity: clone(nativeGraphReceipt?.graphContractIdentity),
      assemblerIdentity: clone(nativeGraphReceipt?.assemblerIdentity)
    };
    if (!stableEqual(projectionDescription?.graphBinding, expectedGraphBinding) ||
        nativeGraphReceipt?.graphContractIdentity?.blob !== projectionPolicy?.authorityBindings?.graphContract?.blob ||
        nativeGraphReceipt?.assemblerIdentity?.blob !== projectionPolicy?.authorityBindings?.graphAssembler?.blob) {
      addViolation(violations, "GRAPH_BINDING_MISMATCH");
    }

    const expectedPolicyBinding = {
      schema: ProjectionConformanceHarnessBinding.acceptedPolicySchema,
      version: ProjectionConformanceHarnessBinding.acceptedPolicyVersion,
      freezeCommit: ProjectionConformanceHarnessBinding.policyFreezeCommit,
      blob: ProjectionConformanceHarnessBinding.policyBlob
    };
    if (projectionPolicy?.schema !== expectedPolicyBinding.schema ||
        projectionPolicy?.version !== expectedPolicyBinding.version ||
        projectionPolicyIdentity?.freezeCommit !== expectedPolicyBinding.freezeCommit ||
        projectionPolicyIdentity?.blob !== expectedPolicyBinding.blob ||
        !stableEqual(projectionDescription?.policyBinding, expectedPolicyBinding)) {
      addViolation(violations, "POLICY_BINDING_MISMATCH");
    }

    if (projectionDescription?.schema !== ProjectionConformanceHarnessBinding.acceptedProjectionDescriptionSchema) {
      addViolation(violations, "PROJECTION_DESCRIPTION_SCHEMA_MISMATCH");
    }
    for (const field of REQUIRED_DESCRIPTION_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(projectionDescription ?? {}, field)) {
        addViolation(violations, "PROJECTION_DESCRIPTION_REQUIRED_FIELD_MISSING", { field });
      }
    }
    checks.push(checkResult("GRAPH_POLICY_AND_DESCRIPTION_BINDINGS", before, violations));
  }

  const edges = new Map((nativeGraphReceipt?.assertedEdges ?? []).map((edge) => [edge.RELATION_ID, edge]));
  const assertedIds = [...edges.keys()].sort();
  const ledger = nativeGraphReceipt?.resolutionLedger ?? [];
  const unresolvedLedger = nonAssertedLedger(nativeGraphReceipt);
  const profile = projectionPolicy?.directTypedRelationProfile ?? {};
  const allowedSemanticChannels = new Set(profile.allowedSemanticChannels ?? []);
  const allowedSuppressionReasons = new Set(projectionPolicy?.filteringRules?.allowedSuppressionReasons ?? []);
  const allowedNonSemanticPurposes = new Set(projectionPolicy?.nonSemanticVisualChannels?.allowedPurposes ?? []);

  {
    const before = violations.length;
    for (const presentation of projectionDescription?.relationPresentations ?? []) {
      if (presentation?.semanticClassification !== "SEMANTIC_EXPRESSION") {
        addViolation(violations, "UNCLASSIFIED_VISUAL_CUE", { locus: "relationPresentation", presentationId: presentation?.presentationId ?? null });
      }

      const edge = edges.get(presentation?.sourceRelationId);
      if (!edge) {
        const sourceLedger = ledgerStateForPresentation(presentation, unresolvedLedger);
        if (sourceLedger) {
          addViolation(violations, "NON_ASSERTED_STATE_EXPRESSED_SEMANTICALLY", {
            presentationId: presentation?.presentationId ?? null,
            evaluatedObjectIdentity: sourceLedger.evaluatedObjectIdentity,
            resolutionState: sourceLedger.gammaOutcome
          });
        } else {
          addViolation(violations, "EDGE_WITHOUT_ASSERTED_RELATION", {
            presentationId: presentation?.presentationId ?? null,
            relationId: presentation?.sourceRelationId ?? null
          });
        }
        continue;
      }

      if (presentation.relationType !== edge.RELATION_TYPE) {
        addViolation(violations, "RELATION_TYPE_MISMATCH", { relationId: edge.RELATION_ID });
      }
      if (presentation.fromObjectId === edge.TO_OBJECT && presentation.toObjectId === edge.FROM_OBJECT) {
        addViolation(violations, "RELATION_DIRECTION_REVERSED", { relationId: edge.RELATION_ID });
      } else if (presentation.fromObjectId !== edge.FROM_OBJECT || presentation.toObjectId !== edge.TO_OBJECT ||
                 presentation.direction !== edge.DIRECTION) {
        addViolation(violations, "RELATION_DIRECTION_LOST", { relationId: edge.RELATION_ID });
      }
      if (presentation.semanticProfile !== profile.profileId ||
          projectionPolicy?.relationTypeMappings?.[edge.RELATION_TYPE]?.profile !== profile.profileId) {
        addViolation(violations, "RELATION_PROFILE_MISMATCH", { relationId: edge.RELATION_ID });
      }
      if (!stableEqual(presentation.qualifiers, edge.QUALIFIERS)) {
        addViolation(violations, "RELATION_QUALIFIER_MISMATCH", { relationId: edge.RELATION_ID });
      }
      if (!stableEqual(presentation.standing, edge.SCIENTIFIC_STANDING)) {
        addViolation(violations, "SCIENTIFIC_STANDING_MISMATCH", { relationId: edge.RELATION_ID });
      }
      if (!stableEqual(presentation.claimCeiling, edge.CLAIM_CEILING)) {
        addViolation(violations, "CLAIM_CEILING_MISMATCH", { relationId: edge.RELATION_ID });
      }
      if (!stableEqual(presentation.authorityRefs, edge.AUTHORITY_POINTERS)) {
        addViolation(violations, "AUTHORITY_IDENTITY_MISMATCH", { relationId: edge.RELATION_ID });
      }
      if (!stableEqual(presentation.provenanceRefs, edge.SOURCE_OR_PROVENANCE)) {
        addViolation(violations, "PROVENANCE_IDENTITY_MISMATCH", { relationId: edge.RELATION_ID });
      }

      const channels = Array.isArray(presentation.presentationChannels) ? presentation.presentationChannels : [];
      for (const channel of channels) {
        if (!allowedSemanticChannels.has(channel) || AMBIGUOUS_CHANNELS.has(channel)) {
          addViolation(violations, "SEMANTIC_CHANNEL_NOT_AUTHORIZED", { relationId: edge.RELATION_ID, channel });
        }
      }
      for (const required of REQUIRED_SAFE_SEMANTIC_CHANNELS) {
        if (!channels.includes(required)) {
          addViolation(violations, "REQUIRED_SEMANTIC_CHANNEL_MISSING", { relationId: edge.RELATION_ID, channel: required });
        }
      }
    }
    checks.push(checkResult("SEMANTIC_RELATION_TRACE_AND_CHANNELS", before, violations));
  }

  {
    const before = violations.length;
    const visible = projectionDescription?.visibleRelationIds ?? [];
    const suppressed = projectionDescription?.suppressedRelations ?? [];
    const suppressionIds = suppressed.map((entry) => entry?.relationId).filter(nonEmptyString);

    const visibleCounts = new Map();
    for (const id of visible) visibleCounts.set(id, (visibleCounts.get(id) ?? 0) + 1);
    const suppressedCounts = new Map();
    for (const id of suppressionIds) suppressedCounts.set(id, (suppressedCounts.get(id) ?? 0) + 1);

    for (const relationId of assertedIds) {
      const total = (visibleCounts.get(relationId) ?? 0) + (suppressedCounts.get(relationId) ?? 0);
      if (total === 0) addViolation(violations, "ASSERTED_RELATION_UNACCOUNTED", { relationId });
      if (total > 1) addViolation(violations, "ASSERTED_RELATION_DUPLICATED", { relationId });
    }

    const presentationCounts = new Map();
    for (const presentation of projectionDescription?.relationPresentations ?? []) {
      const id = presentation?.sourceRelationId;
      if (nonEmptyString(id)) presentationCounts.set(id, (presentationCounts.get(id) ?? 0) + 1);
    }
    for (const relationId of visible) {
      const count = presentationCounts.get(relationId) ?? 0;
      if (count === 0) addViolation(violations, "VISIBLE_RELATION_PRESENTATION_MISSING", { relationId });
      if (count > 1) addViolation(violations, "VISIBLE_RELATION_PRESENTATION_DUPLICATED", { relationId });
    }

    for (const item of suppressed) {
      if (!allowedSuppressionReasons.has(item?.suppressionReason)) {
        addViolation(violations, "SUPPRESSION_REASON_NOT_AUTHORIZED", {
          relationId: item?.relationId ?? null,
          suppressionReason: item?.suppressionReason ?? null
        });
      }
      if (item?.reportedAsNonexistent === true || item?.semanticState === "NONE") {
        addViolation(violations, "HIDDEN_RELATION_REPORTED_NONEXISTENT", { relationId: item?.relationId ?? null });
      }
    }
    checks.push(checkResult("ASSERTED_EDGE_CONSERVATION_AND_SUPPRESSION", before, violations));
  }

  {
    const before = violations.length;
    const visible = new Set(projectionDescription?.visibleRelationIds ?? []);
    for (const bundle of projectionDescription?.relationBundles ?? []) {
      if (bundle?.semanticClassification !== "SEMANTIC_EXPRESSION") {
        addViolation(violations, "UNCLASSIFIED_VISUAL_CUE", { locus: "relationBundle", bundleId: bundle?.bundleId ?? null });
      }
      const members = bundle?.memberRelationIds ?? [];
      const recoverable = bundle?.recoverableRelationIds ?? [];
      if (!exactSetEqual(members, recoverable)) {
        addViolation(violations, "BUNDLE_MEMBER_NOT_RECOVERABLE", { bundleId: bundle?.bundleId ?? null });
      }
      if (bundle?.anonymousGenericConnection === true && members.length > 1) {
        addViolation(violations, "PARALLEL_RELATION_MULTIPLICITY_LOST", { bundleId: bundle?.bundleId ?? null });
      }
      for (const id of members) {
        if (!visible.has(id)) addViolation(violations, "BUNDLE_MEMBER_NOT_VISIBLE", { bundleId: bundle?.bundleId ?? null, relationId: id });
      }
    }
    checks.push(checkResult("RELATION_MULTIPLICITY_AND_BUNDLING", before, violations));
  }

  {
    const before = violations.length;
    const presentations = projectionDescription?.resolutionPresentations ?? [];
    for (const entry of unresolvedLedger) {
      const matches = presentations.filter((item) => item?.evaluatedObjectIdentity === entry.evaluatedObjectIdentity);
      if (matches.length === 0) {
        addViolation(violations, "UNRESOLVED_STATE_UNACCOUNTED", {
          evaluatedObjectIdentity: entry.evaluatedObjectIdentity,
          resolutionState: entry.gammaOutcome
        });
        continue;
      }
      if (matches.length > 1) {
        addViolation(violations, "UNRESOLVED_STATE_DUPLICATED", { evaluatedObjectIdentity: entry.evaluatedObjectIdentity });
      }
      const item = matches[0];
      if (item?.semanticClassification !== "SEMANTIC_EXPRESSION" || item?.channelType !== "RESOLUTION_STATE_LITERAL") {
        addViolation(violations, "UNCLASSIFIED_VISUAL_CUE", { locus: "resolutionPresentation", evaluatedObjectIdentity: entry.evaluatedObjectIdentity });
      }
      if (item?.resolutionState !== entry.gammaOutcome) {
        addViolation(violations, "UNRESOLVED_STATE_MISMATCH", { evaluatedObjectIdentity: entry.evaluatedObjectIdentity });
      }
      if (item?.recoverable !== true) {
        addViolation(violations, "UNRESOLVED_STATE_NOT_RECOVERABLE", { evaluatedObjectIdentity: entry.evaluatedObjectIdentity });
      }
    }
    checks.push(checkResult("UNRESOLVED_STATE_CONSERVATION", before, violations));
  }

  {
    const before = violations.length;
    const knownNodes = new Set(nativeGraphReceipt?.assertedNodeIds ?? []);
    for (const cluster of projectionDescription?.visualClusters ?? []) {
      if (cluster?.semanticClassification !== "NON_SEMANTIC_PRESENTATION") {
        addViolation(violations, "UNCLASSIFIED_VISUAL_CUE", { locus: "visualCluster", clusterId: cluster?.clusterId ?? null });
      }
      if (cluster?.authoritativeObject === true || cluster?.semanticEndpoint === true) {
        addViolation(violations, "VISUAL_CLUSTER_AUTHORITY_PROHIBITED", { clusterId: cluster?.clusterId ?? null });
      }
      for (const nodeId of cluster?.memberNodeIds ?? []) {
        if (!knownNodes.has(nodeId)) addViolation(violations, "VISUAL_CLUSTER_MEMBER_UNKNOWN", { clusterId: cluster?.clusterId ?? null, nodeId });
      }
    }

    for (const visual of projectionDescription?.nonSemanticVisuals ?? []) {
      if (visual?.semanticClassification !== "NON_SEMANTIC_PRESENTATION") {
        addViolation(violations, "UNCLASSIFIED_VISUAL_CUE", { locus: "nonSemanticVisual", visualId: visual?.visualId ?? null });
      }
      if (!allowedNonSemanticPurposes.has(visual?.purpose)) {
        addViolation(violations, "NON_SEMANTIC_PURPOSE_NOT_AUTHORIZED", { visualId: visual?.visualId ?? null, purpose: visual?.purpose ?? null });
      }
      const carriesSemanticAuthority =
        visual?.doesNotAssertRelation !== true ||
        Object.prototype.hasOwnProperty.call(visual ?? {}, "relationId") ||
        (Array.isArray(visual?.relationIds) && visual.relationIds.length > 0) ||
        Object.prototype.hasOwnProperty.call(visual ?? {}, "authorityRefs") ||
        Object.prototype.hasOwnProperty.call(visual ?? {}, "provenanceRefs") ||
        Object.prototype.hasOwnProperty.call(visual ?? {}, "graphTrace");
      if (carriesSemanticAuthority) {
        addViolation(violations, "NON_SEMANTIC_VISUAL_CARRIES_SEMANTIC_AUTHORITY", { visualId: visual?.visualId ?? null });
      }
      const implied = Array.isArray(visual?.impliedSemanticMeanings) ? visual.impliedSemanticMeanings : [];
      if (implied.length > 0 && ANIMATION_CHANNELS.has(visual?.channelType)) {
        addViolation(violations, "ANIMATION_SEMANTIC_IMPLICATION_PROHIBITED", { visualId: visual?.visualId ?? null, impliedMeanings: implied });
      } else if (implied.length > 0) {
        addViolation(violations, "NON_SEMANTIC_VISUAL_CARRIES_SEMANTIC_AUTHORITY", { visualId: visual?.visualId ?? null, impliedMeanings: implied });
      }
    }
    checks.push(checkResult("NON_SEMANTIC_VISUAL_AND_CLUSTER_BOUNDARIES", before, violations));
  }

  {
    const before = violations.length;
    const accessibility = projectionDescription?.accessibilityRepresentations ?? [];
    for (const relationId of projectionDescription?.visibleRelationIds ?? []) {
      const records = accessibility.filter((entry) => entry?.kind === "RELATION" && entry?.relationId === relationId);
      if (!records.some((entry) =>
        entry.relationIdentityRecoverable === true &&
        entry.directionRecoverable === true &&
        entry.multiplicityRecoverable === true)) {
        addViolation(violations, "ACCESSIBILITY_SEMANTIC_LOSS", { relationId });
      }
    }
    for (const entry of unresolvedLedger) {
      const records = accessibility.filter((item) =>
        item?.kind === "RESOLUTION" &&
        item?.evaluatedObjectIdentity === entry.evaluatedObjectIdentity &&
        item?.resolutionState === entry.gammaOutcome
      );
      if (!records.some((item) => item.resolutionStateRecoverable === true)) {
        addViolation(violations, "ACCESSIBILITY_SEMANTIC_LOSS", {
          evaluatedObjectIdentity: entry.evaluatedObjectIdentity,
          resolutionState: entry.gammaOutcome
        });
      }
    }
    checks.push(checkResult("ACCESSIBILITY_EQUIVALENCE", before, violations));
  }

  {
    const before = violations.length;
    const viewState = projectionDescription?.viewState ?? {};
    if (viewState?.changesSemanticState === true ||
        (viewState?.semanticOverrides && Object.keys(viewState.semanticOverrides).length > 0) ||
        Object.prototype.hasOwnProperty.call(viewState, "relationTypeOverride") ||
        Object.prototype.hasOwnProperty.call(viewState, "standingOverride") ||
        Object.prototype.hasOwnProperty.call(viewState, "claimCeilingOverride")) {
      addViolation(violations, "VIEW_STATE_SEMANTIC_MUTATION");
    }
    if (projectionDescription?.projectionWriteback &&
        projectionDescription.projectionWriteback.enabled !== false) {
      addViolation(violations, "PROJECTION_WRITEBACK_PROHIBITED");
    }
    checks.push(checkResult("VIEW_STATE_IMMUTABILITY_AND_REVERSIBILITY", before, violations));
  }

  if (canonicalizeText(nativeGraphReceipt) !== graphBefore) {
    addViolation(violations, "GRAPH_MUTATED_BY_HARNESS");
  }

  const canonicalViolations = violations
    .map((entry) => clone(entry))
    .sort((a, b) => canonicalizeText(a).localeCompare(canonicalizeText(b)));

  const receipt = {
    schema: ProjectionConformanceHarnessBinding.receiptSchema,
    graphReceiptIdentity: {
      schema: nativeGraphReceipt?.schema ?? null,
      nativeReceiptLrpv1Digest: nativeGraphLrpv1Receipt?.lineage_digest ?? null,
      assemblyIdentity: clone(nativeGraphReceipt?.assemblyIdentity)
    },
    graphDigest: nativeGraphLrpv1Receipt?.lineage_digest ?? null,
    projectionPolicyIdentity: clone(projectionPolicyIdentity),
    projectionPolicyBlob: ProjectionConformanceHarnessBinding.policyBlob,
    projectionDescriptionDigest: await digest(projectionDescription),
    harnessIdentity: clone(harnessIdentity),
    harnessVersion: ProjectionConformanceHarnessBinding.version,
    semanticPresentationCount:
      resultCount(projectionDescription?.relationPresentations) +
      resultCount(projectionDescription?.resolutionPresentations) +
      resultCount(projectionDescription?.relationBundles),
    nonSemanticPresentationCount:
      resultCount(projectionDescription?.visualClusters) +
      resultCount(projectionDescription?.nonSemanticVisuals),
    visibleRelationCount: resultCount(projectionDescription?.visibleRelationIds),
    suppressedRelationCount: resultCount(projectionDescription?.suppressedRelations),
    unresolvedStateCount: resultCount(projectionDescription?.resolutionPresentations),
    bundleCount: resultCount(projectionDescription?.relationBundles),
    clusterCount: resultCount(projectionDescription?.visualClusters),
    checks,
    violations: canonicalViolations,
    disposition: canonicalViolations.length === 0
      ? "PASS_SEMANTICS_PRESERVING_PROJECTION_DESCRIPTION"
      : "FAIL_PROJECTION_CONFORMANCE"
  };

  return Object.freeze(receipt);
}
