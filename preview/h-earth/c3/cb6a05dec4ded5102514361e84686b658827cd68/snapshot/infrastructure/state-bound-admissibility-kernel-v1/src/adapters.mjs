import { assertObject, assertString, coded, sha256, stable } from './canonical.mjs';

export const ADAPTER_POSTURE = 'BOUNDARY_ADAPTER_NOT_STANDARDS_CONFORMANCE';

export function adaptSpiffeIdentity(assertion) {
  assertObject(assertion, 'SPIFFE assertion');
  const subject = assertString(assertion.spiffeId, 'spiffeId');
  if (!subject.startsWith('spiffe://')) throw coded('IDENTITY_ASSERTION_INVALID', 'SPIFFE ID must start with spiffe://');
  if (assertion.verified !== true) throw coded('IDENTITY_NOT_VERIFIED', 'SPIFFE identity must be verified by an external SVID verifier');
  return stable({
    schema: 'DIAMOND_GATE_IDENTITY_ASSERTION_v1',
    kind: 'SPIFFE',
    subject,
    externalVerification: { verified: true, verifier: assertString(assertion.verifier, 'verifier') },
    adapterPosture: ADAPTER_POSTURE
  });
}

export function adaptOidcIdentity(assertion) {
  assertObject(assertion, 'OIDC assertion');
  if (assertion.verified !== true) throw coded('IDENTITY_NOT_VERIFIED', 'OIDC identity must be verified externally');
  return stable({
    schema: 'DIAMOND_GATE_IDENTITY_ASSERTION_v1',
    kind: 'OIDC',
    issuer: assertString(assertion.issuer, 'issuer'),
    subject: assertString(assertion.subject, 'subject'),
    audience: assertion.audience ?? null,
    externalVerification: { verified: true, verifier: assertString(assertion.verifier, 'verifier') },
    adapterPosture: ADAPTER_POSTURE
  });
}

export function adaptCedarDecision(decision) {
  assertObject(decision, 'Cedar decision');
  if (decision.decision !== 'Allow') throw coded('AUTHORIZATION_DENIED', 'External Cedar decision is not Allow');
  if (decision.verified !== true) throw coded('AUTHORIZATION_NOT_VERIFIED', 'Cedar Allow decision must be verified by the external evaluator boundary');
  const request = assertObject(decision.request, 'Cedar request');
  for (const field of ['principal', 'action', 'resource']) if (!(field in request)) throw coded('AUTHORIZATION_ASSERTION_INVALID', `Cedar request missing ${field}`);
  return stable({
    schema: 'DIAMOND_GATE_AUTHORIZATION_ASSERTION_v1',
    kind: 'CEDAR_DECISION',
    decision: 'Allow',
    requestDigest: sha256(request),
    evaluator: decision.evaluator ?? null,
    policySetDigest: decision.policySetDigest ?? null,
    externalVerification: { verified: true },
    adapterPosture: ADAPTER_POSTURE
  });
}

export function adaptInTotoStatementEvidence(statement, verification = {}) {
  assertObject(statement, 'in-toto statement');
  if (statement._type !== 'https://in-toto.io/Statement/v1') throw coded('EVIDENCE_ASSERTION_INVALID', 'Expected in-toto Statement/v1');
  if (!Array.isArray(statement.subject) || statement.subject.length === 0) throw coded('EVIDENCE_ASSERTION_INVALID', 'in-toto Statement must contain subject');
  assertString(statement.predicateType, 'predicateType');
  if (verification.verified !== true) throw coded('EVIDENCE_NOT_VERIFIED', 'in-toto Statement must be authenticated by an external envelope/signature verifier');
  return stable({ id: verification.id ?? 'in-toto-statement', digest: sha256(statement), format: 'IN_TOTO_STATEMENT_V1', externalVerification: { verified: true, verifier: assertString(verification.verifier, 'verifier') }, adapterPosture: ADAPTER_POSTURE });
}

export function adaptGenericEvidence(id, value) {
  return stable({ id: assertString(id, 'evidence id'), digest: sha256(value), format: 'GENERIC_DIGESTED_EVIDENCE' });
}
