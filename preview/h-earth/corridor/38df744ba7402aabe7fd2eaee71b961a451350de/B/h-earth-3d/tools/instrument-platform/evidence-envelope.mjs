import { canonicalDigest, clone, deepFreeze, deterministicId, nowIso, requireNonEmptyString, stableStringify } from './platform-core.mjs';

export const EVIDENCE_AUTHORITY_CLASSES = deepFreeze([
  'SOURCE_AUTHORITY',
  'RUNTIME_AUTHORITY',
  'PUBLIC_STATE_AUTHORITY',
  'DEVICE_BEHAVIOR_AUTHORITY',
  'PRODUCT_ACCEPTANCE_AUTHORITY',
  'PUBLIC_DEFAULT_AUTHORITY',
  'DIAGNOSTIC_ONLY'
]);

export function buildEvidenceEnvelope(input, options = {}) {
  const authorityClass = requireNonEmptyString(input.authorityClass, 'AUTHORITY_CLASS');
  if (!EVIDENCE_AUTHORITY_CLASSES.includes(authorityClass)) throw new Error(`AUTHORITY_CLASS_UNKNOWN:${authorityClass}`);
  const body = {
    schemaVersion: 'H_EARTH_EVIDENCE_ENVELOPE_v1',
    projectContextId: requireNonEmptyString(input.projectContextId, 'PROJECT_CONTEXT_ID'),
    sessionId: requireNonEmptyString(input.sessionId, 'SESSION_ID'),
    toolId: requireNonEmptyString(input.toolId, 'TOOL_ID'),
    toolVersion: input.toolVersion ?? 'UNVERSIONED_EXISTING_INSTRUMENT',
    operationId: requireNonEmptyString(input.operationId, 'OPERATION_ID'),
    changeClass: requireNonEmptyString(input.changeClass ?? 'EVIDENCE_ONLY_OPERATION', 'CHANGE_CLASS'),
    authorityClass,
    sourceHead: requireNonEmptyString(input.sourceHead, 'SOURCE_HEAD'),
    executedHead: input.executedHead ?? null,
    fetchedBlobIdentities: clone(input.fetchedBlobIdentities ?? []),
    sceneRegistryVersion: input.sceneRegistryVersion ?? null,
    inputAuthorities: clone(input.inputAuthorities ?? []),
    executionEnvironment: clone(input.executionEnvironment ?? {}),
    outputArtifacts: clone(input.outputArtifacts ?? []),
    checks: clone(input.checks ?? []),
    failures: clone(input.failures ?? []),
    authorityEstablished: clone(input.authorityEstablished ?? []),
    authorityNotEstablished: clone(input.authorityNotEstablished ?? []),
    mutationsPerformed: clone(input.mutationsPerformed ?? []),
    liveStateChanged: input.liveStateChanged === true,
    userInputPresent: input.userInputPresent === true,
    stopBoundary: requireNonEmptyString(input.stopBoundary ?? 'STOP_AFTER_EVIDENCE_ADMISSION', 'STOP_BOUNDARY'),
    payload: clone(input.payload ?? null),
    recordedAt: nowIso(options.clock)
  };
  const canonicalDigestValue = canonicalDigest(body);
  return deepFreeze({
    ...body,
    envelopeId: deterministicId('H_EARTH_EVIDENCE_ENVELOPE', body),
    canonicalDigest: canonicalDigestValue
  });
}

export function verifyEvidenceEnvelope(envelope) {
  const { canonicalDigest: expected, envelopeId, ...body } = clone(envelope ?? {});
  const issues = [];
  if (envelope?.schemaVersion !== 'H_EARTH_EVIDENCE_ENVELOPE_v1') issues.push('SCHEMA_VERSION');
  if (!expected || expected !== canonicalDigest(body)) issues.push('CANONICAL_DIGEST');
  if (!envelopeId || envelopeId !== deterministicId('H_EARTH_EVIDENCE_ENVELOPE', body)) issues.push('ENVELOPE_ID');
  if (!EVIDENCE_AUTHORITY_CLASSES.includes(envelope?.authorityClass)) issues.push('AUTHORITY_CLASS');
  return deepFreeze({ valid: issues.length === 0, issues });
}

export function serializeEvidenceEnvelope(envelope, indentation = 2) {
  const verification = verifyEvidenceEnvelope(envelope);
  if (!verification.valid) throw new Error(`EVIDENCE_ENVELOPE_INVALID:${verification.issues.join(',')}`);
  return `${stableStringify(envelope, indentation)}\n`;
}

export default buildEvidenceEnvelope;
