import crypto from 'node:crypto';
import { canonical, coded, digestRecord, normalizeDigestList, sha256, stable } from './canonical.mjs';
import { createStatement, publicKeyId, signStatement } from './dsse.mjs';

export const CAPABILITY_SCHEMA = 'DIAMOND_GATE_STATE_BOUND_ADMISSION_CAPABILITY_v1';
export const DECISION_SCHEMA = 'DIAMOND_GATE_STATE_BOUND_ADMISSIBILITY_DECISION_v1';

function requiredContext(context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw coded('INVALID_INPUT', 'context must be an object');
  for (const field of ['principal', 'operation', 'resource', 'state', 'authority', 'policy', 'procedure', 'evidence']) {
    if (!(field in context)) throw coded('INVALID_INPUT', `context missing ${field}`);
  }
  return context;
}

function bindings(context) {
  const c = requiredContext(context);
  return stable({
    principalDigest: digestRecord(c.principal, 'principal'),
    operationDigest: digestRecord(c.operation, 'operation'),
    resourceDigest: digestRecord(c.resource, 'resource'),
    stateDigest: digestRecord(c.state, 'state'),
    authorityDigest: digestRecord(c.authority, 'authority'),
    policyDigest: digestRecord(c.policy, 'policy'),
    procedureDigest: digestRecord(c.procedure, 'procedure'),
    evidence: normalizeDigestList(c.evidence)
  });
}

function capabilityCore(capability) {
  const { capabilityDigest: _digest, proof: _proof, ...core } = capability ?? {};
  return core;
}

function capabilityIntegrity(capability) {
  return sha256(capabilityCore(capability));
}

export class MemoryReplayStore {
  #consumed = new Set();
  isConsumed(id) { return this.#consumed.has(id); }
  consume(id) {
    if (this.#consumed.has(id)) return false;
    this.#consumed.add(id);
    return true;
  }
}

export class StateBoundAdmissibilityKernel {
  constructor({ replayStore = new MemoryReplayStore(), signer = null, trustedPublicKeys = [], clock = () => new Date().toISOString() } = {}) {
    this.replayStore = replayStore;
    this.signer = signer;
    this.clock = clock;
    const keys = [...trustedPublicKeys];
    if (signer?.publicKey) keys.push(signer.publicKey);
    this.trustedPublicKeys = new Map(keys.map((key) => [publicKeyId(key), key]));
  }

  admit(context, { nonce, predecessorCapabilityId = null } = {}) {
    if (!this.signer?.privateKey || !this.signer?.publicKey) throw coded('SIGNER_REQUIRED', 'admission requires an Ed25519 signing identity');
    if (typeof nonce !== 'string' || nonce.length < 16) throw coded('INVALID_NONCE', 'nonce must be a fresh string of at least 16 characters');
    const bound = bindings(context);
    const core = stable({
      schema: CAPABILITY_SCHEMA,
      version: 1,
      capabilityId: sha256({ nonce, bound, predecessorCapabilityId }),
      predecessorCapabilityId,
      authorityInherited: false,
      exactStateRevalidationRequired: true,
      evidenceRevalidationRequired: true,
      issuedAt: this.clock(),
      nonceDigest: sha256(nonce),
      bindings: bound
    });
    const capabilityDigest = sha256(core);
    const signature = crypto.sign(null, Buffer.from(capabilityDigest, 'hex'), this.signer.privateKey);
    const proof = stable({ algorithm: 'Ed25519', keyid: this.signer.keyid ?? publicKeyId(this.signer.publicKey), sig: signature.toString('base64') });
    const capability = stable({ ...core, capabilityDigest, proof });
    return { capability, receipt: this.#receipt('ADMITTED', capability, { reasonCode: 'FRESH_STATE_BOUND_ADMISSION' }) };
  }

  admitSuccessor(predecessorCapability, freshContext, { nonce, inheritedAuthority = false } = {}) {
    this.#assertCapability(predecessorCapability);
    if (inheritedAuthority !== false) throw coded('IMPLICIT_AUTHORITY_INHERITANCE_FORBIDDEN', 'successor authority must be supplied fresh');
    return this.admit(freshContext, { nonce, predecessorCapabilityId: predecessorCapability.capabilityId });
  }

  evaluate(capability, currentContext) {
    const integrity = this.#validateCapability(capability);
    if (integrity) return this.#decision(integrity, capability);
    if (this.replayStore.isConsumed(capability.capabilityId)) return this.#decision('DENY_REPLAY', capability);
    const now = bindings(currentContext);
    const expected = capability.bindings;
    const checks = [
      ['principalDigest', 'DENY_PRINCIPAL_DRIFT'],
      ['operationDigest', 'DENY_OPERATION_DRIFT'],
      ['resourceDigest', 'DENY_SCOPE_DRIFT'],
      ['stateDigest', 'DENY_STALE_STATE'],
      ['authorityDigest', 'DENY_STALE_AUTHORITY'],
      ['policyDigest', 'DENY_POLICY_DRIFT'],
      ['procedureDigest', 'DENY_PROCEDURE_DRIFT']
    ];
    for (const [field, code] of checks) if (expected[field] !== now[field]) return this.#decision(code, capability);
    if (canonical(expected.evidence) !== canonical(now.evidence)) return this.#decision('DENY_STALE_EVIDENCE', capability);
    return this.#decision('EXECUTE', capability);
  }

  enforce(capability, currentContext) {
    const decision = this.evaluate(capability, currentContext);
    if (decision.result !== 'EXECUTE') return decision;
    if (!this.replayStore.consume(capability.capabilityId)) return this.#decision('DENY_REPLAY', capability);
    return this.#decision('EXECUTE', capability, { consumed: true });
  }

  #validateCapability(capability) {
    if (!capability || capability.schema !== CAPABILITY_SCHEMA) return 'DENY_INVALID_CAPABILITY';
    if (typeof capability.capabilityDigest !== 'string' || capabilityIntegrity(capability) !== capability.capabilityDigest) return 'DENY_TAMPERED_CAPABILITY';
    if (capability.authorityInherited !== false || capability.exactStateRevalidationRequired !== true) return 'DENY_INVALID_CAPABILITY';
    const proof = capability.proof;
    if (!proof || proof.algorithm !== 'Ed25519' || typeof proof.keyid !== 'string' || typeof proof.sig !== 'string') return 'DENY_UNSIGNED_CAPABILITY';
    const trustedKey = this.trustedPublicKeys.get(proof.keyid);
    if (!trustedKey) return 'DENY_UNTRUSTED_CAPABILITY';
    let verified = false;
    try { verified = crypto.verify(null, Buffer.from(capability.capabilityDigest, 'hex'), trustedKey, Buffer.from(proof.sig, 'base64')); } catch { verified = false; }
    if (!verified) return 'DENY_INVALID_CAPABILITY_SIGNATURE';
    return null;
  }

  #assertCapability(capability) {
    const failure = this.#validateCapability(capability);
    if (failure) throw coded(failure, failure);
  }

  #decision(result, capability, extra = {}) {
    const predicate = stable({
      schema: DECISION_SCHEMA,
      result,
      capabilityId: capability?.capabilityId ?? null,
      evaluatedAt: this.clock(),
      ...extra
    });
    return this.#receipt(result, capability, predicate);
  }

  #receipt(result, capability, predicate) {
    const subjectDigest = capability?.capabilityDigest ?? sha256(predicate);
    const statement = createStatement({
      subjectName: `diamond-gate-capability:${capability?.capabilityId ?? 'none'}`,
      subjectDigest,
      predicate: stable({ ...predicate, result })
    });
    const receipt = { schema: 'DIAMOND_GATE_RECEIPT_v1', result, statement };
    if (this.signer?.privateKey) receipt.envelope = signStatement(statement, this.signer.privateKey, this.signer.keyid);
    return stable(receipt);
  }
}

export function inspectCapability(capability) {
  return stable({ validDigest: capabilityIntegrity(capability) === capability?.capabilityDigest, capability });
}
