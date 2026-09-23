import { canonicalDigest, clone, deepFreeze, deterministicId, nowIso, stableStringify } from './platform-core.mjs';
import { verifyEvidenceEnvelope } from './evidence-envelope.mjs';

export function createCrossToolSessionLedger({ projectContext, objective, sessionId = null, clock = () => new Date() }) {
  if (!projectContext?.projectContextId) throw new Error('SESSION_PROJECT_CONTEXT_REQUIRED');
  const createdAt = nowIso(clock);
  const id = sessionId ?? deterministicId('H_EARTH_SESSION', {
    projectContextId: projectContext.projectContextId,
    objective,
    createdAt
  });
  const events = [];
  const evidence = [];
  let currentStatus = 'OPEN';
  let blockingCondition = null;
  let finalDisposition = null;

  function append(type, payload = null) {
    const event = deepFreeze({
      sequence: events.length + 1,
      type,
      recordedAt: nowIso(clock),
      payload: clone(payload)
    });
    events.push(event);
    return event;
  }

  append('SESSION_OPENED', { objective, projectContextId: projectContext.projectContextId });

  function admitEvidence(envelope) {
    const verification = verifyEvidenceEnvelope(envelope);
    if (!verification.valid) throw new Error(`SESSION_EVIDENCE_INVALID:${verification.issues.join(',')}`);
    if (envelope.projectContextId !== projectContext.projectContextId) throw new Error('SESSION_PROJECT_CONTEXT_MISMATCH');
    if (envelope.sessionId !== id) throw new Error('SESSION_ID_MISMATCH');
    if (evidence.some((entry) => entry.envelopeId === envelope.envelopeId)) throw new Error('SESSION_DUPLICATE_EVIDENCE');
    evidence.push(deepFreeze(clone(envelope)));
    append('EVIDENCE_ADMITTED', {
      envelopeId: envelope.envelopeId,
      toolId: envelope.toolId,
      authorityClass: envelope.authorityClass,
      authorityEstablished: envelope.authorityEstablished
    });
    return envelope;
  }

  function recordToolInvocation(record) {
    return append('TOOL_INVOKED', record);
  }

  function recordStateTransition(record) {
    return append('AUTHORITY_STATE_TRANSITION', record);
  }

  function setBlock(condition) {
    blockingCondition = clone(condition);
    currentStatus = 'BLOCKED';
    return append('SESSION_BLOCKED', blockingCondition);
  }

  function clearBlock(reason) {
    const prior = blockingCondition;
    blockingCondition = null;
    currentStatus = 'OPEN';
    return append('SESSION_BLOCK_CLEARED', { reason, prior });
  }

  function close(disposition) {
    finalDisposition = clone(disposition);
    currentStatus = 'CLOSED';
    append('SESSION_CLOSED', finalDisposition);
    return snapshot();
  }

  function snapshot() {
    const body = {
      schemaVersion: 'H_EARTH_CROSS_TOOL_SESSION_LEDGER_v1',
      sessionId: id,
      objective,
      initialProjectContext: clone(projectContext),
      toolInvocations: events.filter((event) => event.type === 'TOOL_INVOKED'),
      evidenceEnvelopes: clone(evidence),
      stateTransitions: events.filter((event) => event.type === 'AUTHORITY_STATE_TRANSITION'),
      authorityDecisions: events.filter((event) => ['EVIDENCE_ADMITTED', 'SESSION_BLOCKED', 'SESSION_BLOCK_CLEARED'].includes(event.type)),
      userDifferentials: evidence.filter((entry) => entry.authorityClass === 'PRODUCT_ACCEPTANCE_AUTHORITY'),
      events: clone(events),
      currentStatus,
      blockingCondition: clone(blockingCondition),
      finalDisposition: clone(finalDisposition),
      createdAt
    };
    return deepFreeze({ ...body, ledgerDigest: canonicalDigest(body) });
  }

  function serialize(indentation = 2) {
    return `${stableStringify(snapshot(), indentation)}\n`;
  }

  return Object.freeze({
    sessionId: id,
    admitEvidence,
    recordToolInvocation,
    recordStateTransition,
    setBlock,
    clearBlock,
    close,
    snapshot,
    serialize
  });
}

export default createCrossToolSessionLedger;
