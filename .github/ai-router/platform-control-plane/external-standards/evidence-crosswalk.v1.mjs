const ALLOWED_DISPOSITIONS = new Set(['EVIDENCED', 'PARTIAL', 'GAP', 'NOT_APPLICABLE']);
const PROHIBITED_CLAIM = /\b(COMPLIANT|COMPLIANCE|CERTIFIED|CERTIFICATION|ACCREDITED|ACCREDITATION|CONFORMS|CONFORMANT)\b/i;
const PROHIBITED_TEXT_KEYS = new Set(['clauseText', 'standardText', 'verbatimStandardText', 'copyrightedClauseText']);

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

function containsProhibitedTextKey(value) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(containsProhibitedTextKey);
  return Object.entries(value).some(([key, child]) => PROHIBITED_TEXT_KEYS.has(key) || containsProhibitedTextKey(child));
}

function stop(errorCode, detail = null) {
  return stable({
    schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_RECEIPT_v1',
    result: 'STOP',
    errorCode,
    detail,
    benchmarkOnly: true,
    complianceDeterminationAuthorized: false,
    certificationDeterminationAuthorized: false,
    accreditationDeterminationAuthorized: false,
    authorityCreated: false
  });
}

export function evaluateEvidenceCrosswalk(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request) || request.schema !== 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_REQUEST_v1') {
    return stop('APPLICABILITY_AMBIGUOUS', 'REQUEST_SCHEMA_INVALID');
  }
  if (containsProhibitedTextKey(request)) return stop('CLAUSE_TEXT_REPLICATION_ATTEMPTED');
  if (typeof request.claimLanguage === 'string' && PROHIBITED_CLAIM.test(request.claimLanguage)) {
    return stop('COMPLIANCE_OVERCLAIM_ATTEMPTED', request.claimLanguage);
  }
  if (!request.applicabilityReceipt || request.applicabilityReceipt.result !== 'PASS') {
    return stop('APPLICABILITY_AMBIGUOUS', 'VALID_APPLICABILITY_RECEIPT_REQUIRED');
  }
  if (!ALLOWED_DISPOSITIONS.has(request.disposition)) {
    return stop('EVIDENCE_DISPOSITION_INVALID', request.disposition);
  }
  if (request.applicabilityReceipt.applicability === 'NOT_APPLICABLE' && request.disposition !== 'NOT_APPLICABLE') {
    return stop('APPLICABILITY_AMBIGUOUS', 'NOT_APPLICABLE_STANDARD_CANNOT_RECEIVE_POSITIVE_EVIDENCE_DISPOSITION');
  }
  if (request.applicabilityReceipt.applicability !== 'NOT_APPLICABLE' && request.disposition === 'NOT_APPLICABLE') {
    return stop('APPLICABILITY_AMBIGUOUS', 'APPLICABLE_STANDARD_CANNOT_BE_DISPOSED_NOT_APPLICABLE');
  }
  const evidence = Array.isArray(request.evidence) ? request.evidence : [];
  if (request.disposition === 'EVIDENCED' && evidence.length === 0) {
    return stop('EVIDENCE_DISPOSITION_INVALID', 'EVIDENCED_REQUIRES_EVIDENCE');
  }
  for (const item of evidence) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim()) {
      return stop('EVIDENCE_DISPOSITION_INVALID', 'EVIDENCE_ID_REQUIRED');
    }
  }
  if (typeof request.requirementThemeId !== 'string' || !request.requirementThemeId.trim()) {
    return stop('APPLICABILITY_AMBIGUOUS', 'REQUIREMENT_THEME_ID_REQUIRED');
  }

  return stable({
    schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_RECEIPT_v1',
    result: 'PASS',
    standardId: request.applicabilityReceipt.standardId,
    standardDesignation: request.applicabilityReceipt.standardDesignation,
    applicability: request.applicabilityReceipt.applicability,
    requirementThemeId: request.requirementThemeId,
    disposition: request.disposition,
    evidence: evidence.map(item => ({ id: item.id, digest: item.digest ?? null, locator: item.locator ?? null })),
    contradictionPreserved: request.contradictionPresent === true,
    claimLanguage: request.claimLanguage ?? 'BENCHMARK_EVIDENCE_ONLY',
    benchmarkOnly: true,
    clauseLevelConformanceDetermined: false,
    fullStandardConformanceDetermined: false,
    complianceDeterminationAuthorized: false,
    certificationDeterminationAuthorized: false,
    accreditationDeterminationAuthorized: false,
    authorityCreated: false
  });
}
