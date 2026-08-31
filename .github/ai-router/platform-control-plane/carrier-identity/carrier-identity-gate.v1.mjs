import fs from 'node:fs';

export const EXPECTED_HC03_CANDIDATE =
  '66351b7d39705e726d5d6a39b396e6711fb2d92a';

export const FORBIDDEN_AUTHORITY_LINEAGE = Object.freeze([
  'H_EARTH_B10',
  'RUN7I',
  '36933be2d4d1a4de7229766ff5b9b89f99ee8e3a'
]);

const SHA40 = /^[0-9a-f]{40}$/i;

function stop(errorCode, details = {}) {
  return {
    schema: 'L2_CARRIER_IDENTITY_DIAGNOSTIC_RECEIPT_v1',
    result: 'STOP',
    routeAdmissible: false,
    candidateDefectEstablished: false,
    authorityInherited: false,
    errorCode,
    diagnostics: [],
    ...details
  };
}

function normalizeAuthority(values) {
  if (!Array.isArray(values)) return null;
  return values.map((value) => String(value).trim()).filter(Boolean);
}

function forbiddenAuthorityHits(values) {
  const normalized = normalizeAuthority(values);
  if (normalized === null) return null;
  return FORBIDDEN_AUTHORITY_LINEAGE.filter((forbidden) =>
    normalized.some((value) => value.toUpperCase().includes(forbidden.toUpperCase()))
  );
}

export function evaluateCarrierIdentity(input = {}) {
  const requiredStrings = [
    'candidateHead',
    'expectedCandidateHead',
    'executionHead',
    'evidenceSourceHead',
    'wrapperDeclaredHead',
    'precheckContractIdentity',
    'verifierCapabilityIdentity'
  ];

  for (const field of requiredStrings) {
    if (typeof input[field] !== 'string' || input[field].trim() === '') {
      return stop('AMBIGUOUS_STOP', { field, reason: 'MISSING_TYPED_IDENTITY' });
    }
  }

  for (const field of [
    'candidateHead',
    'expectedCandidateHead',
    'executionHead',
    'evidenceSourceHead',
    'wrapperDeclaredHead'
  ]) {
    if (!SHA40.test(input[field])) {
      return stop('AMBIGUOUS_STOP', { field, reason: 'INVALID_HEAD_IDENTITY' });
    }
  }

  if (
    input.expectedCandidateHead !== EXPECTED_HC03_CANDIDATE ||
    input.candidateHead !== input.expectedCandidateHead
  ) {
    return stop('CANDIDATE_HEAD_MISMATCH', {
      expectedCandidateHead: input.expectedCandidateHead,
      observedCandidateHead: input.candidateHead
    });
  }

  const authorityHits = forbiddenAuthorityHits(input.authorityLineage);
  if (authorityHits === null) {
    return stop('AMBIGUOUS_STOP', {
      field: 'authorityLineage',
      reason: 'AUTHORITY_LINEAGE_MUST_BE_EXPLICIT_ARRAY'
    });
  }
  if (authorityHits.length > 0) {
    return stop('AUTHORITY_LINEAGE_SUPERSEDED', {
      forbiddenAuthorityHits: authorityHits
    });
  }

  const capability = input.browserCapability;
  if (
    !capability ||
    capability.technicalReuseOnly !== true ||
    capability.authorityReuse === true ||
    capability.workflowId !== 320949283 ||
    capability.workflowPath !== '.github/workflows/h-earth-run8e-public-route-validation.yml' ||
    capability.browserEngine !== 'PLAYWRIGHT_CHROMIUM'
  ) {
    return stop('BROWSER_CAPABILITY_UNAVAILABLE', {
      reason: 'CURRENT_BOUNDED_BROWSER_CAPABILITY_BINDING_NOT_PROVEN'
    });
  }

  const diagnostics = [];

  const staleWrapper = input.wrapperDeclaredHead !== input.executionHead;
  if (staleWrapper) {
    if (input.wrapperUsedAsAuthority === true) {
      return stop('CARRIER_STALE_IDENTITY', {
        wrapperDeclaredHead: input.wrapperDeclaredHead,
        executionHead: input.executionHead,
        reason: 'STALE_WRAPPER_WOULD_BE_USED_AS_AUTHORITY'
      });
    }
    diagnostics.push({
      code: 'CARRIER_STALE_IDENTITY',
      blocking: false,
      candidateDefectEstablished: false,
      wrapperDeclaredHead: input.wrapperDeclaredHead,
      executionHead: input.executionHead
    });
  }

  const obsoletePrecheck =
    input.precheckContractIdentity === 'RUN7I_SOURCE_PRECHECK' ||
    input.precheckContractIdentity === 'RUN8E_RUN7I_SOURCE_PRECHECK';

  if (obsoletePrecheck) {
    if (input.precheckUsedAsAuthority === true) {
      return stop('PRECHECK_SCHEMA_OBSOLETE', {
        precheckContractIdentity: input.precheckContractIdentity,
        reason: 'OBSOLETE_PRECHECK_WOULD_GATE_CURRENT_CANDIDATE'
      });
    }
    diagnostics.push({
      code: 'PRECHECK_SCHEMA_OBSOLETE',
      blocking: false,
      candidateDefectEstablished: false,
      precheckContractIdentity: input.precheckContractIdentity
    });
  }

  if (
    input.capabilityReuseAcknowledged !== true ||
    input.authorityReuseAcknowledged === true ||
    input.freshReceiptRequired !== true
  ) {
    return stop('AMBIGUOUS_STOP', {
      reason: 'CAPABILITY_AUTHORITY_SEPARATION_NOT_EXPLICIT'
    });
  }

  return {
    schema: 'L2_CARRIER_IDENTITY_DIAGNOSTIC_RECEIPT_v1',
    result: diagnostics.length
      ? 'ROUTE_ADMISSIBLE_WITH_DIAGNOSTIC'
      : 'ROUTE_ADMISSIBLE',
    routeAdmissible: true,
    candidateDefectEstablished: false,
    authorityInherited: false,
    exactCandidateHead: input.candidateHead,
    executionHead: input.executionHead,
    evidenceSourceHead: input.evidenceSourceHead,
    verifierCapabilityIdentity: input.verifierCapabilityIdentity,
    receiptIdentity: input.receiptIdentity ?? 'L2_HC03_CANDIDATE_BOUND_BROWSER_RECEIPT_v1',
    diagnostics
  };
}

export function writeReceipt(file, receipt) {
  fs.writeFileSync(file, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
}
