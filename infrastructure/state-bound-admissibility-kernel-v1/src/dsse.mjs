import crypto from 'node:crypto';
import { assertObject, assertString, canonical, sha256, stable } from './canonical.mjs';

export const IN_TOTO_STATEMENT_V1 = 'https://in-toto.io/Statement/v1';
export const IN_TOTO_PAYLOAD_TYPE = 'application/vnd.in-toto+json';
export const DIAMOND_GATE_PREDICATE_V1 = 'https://diamond-gate.dev/attestation/state-bound-admissibility/v1';

export function createStatement({ subjectName, subjectDigest, predicate, predicateType = DIAMOND_GATE_PREDICATE_V1 }) {
  assertString(subjectName, 'subjectName');
  if (!/^[0-9a-f]{64}$/.test(subjectDigest ?? '')) throw new Error('subjectDigest must be sha256 hex');
  assertObject(predicate, 'predicate');
  return stable({
    _type: IN_TOTO_STATEMENT_V1,
    subject: [{ name: subjectName, digest: { sha256: subjectDigest } }],
    predicateType,
    predicate
  });
}

export function pae(payloadType, payloadBytes) {
  const type = Buffer.from(assertString(payloadType, 'payloadType'), 'utf8');
  const payload = Buffer.isBuffer(payloadBytes) ? payloadBytes : Buffer.from(payloadBytes);
  return Buffer.concat([
    Buffer.from(`DSSEv1 ${type.length} `, 'utf8'), type,
    Buffer.from(` ${payload.length} `, 'utf8'), payload
  ]);
}

export function publicKeyId(keyLike) {
  const key = keyLike?.type === 'public' ? keyLike : crypto.createPublicKey(keyLike);
  return sha256(key.export({ type: 'spki', format: 'der' }));
}

export function generateEd25519Signer() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
  return { privateKey, publicKey, keyid: publicKeyId(publicKey) };
}

export function signStatement(statement, privateKey, keyid = null) {
  const payload = Buffer.from(canonical(statement), 'utf8');
  const signature = crypto.sign(null, pae(IN_TOTO_PAYLOAD_TYPE, payload), privateKey);
  const publicKey = crypto.createPublicKey(privateKey);
  return stable({
    payloadType: IN_TOTO_PAYLOAD_TYPE,
    payload: payload.toString('base64'),
    signatures: [{ keyid: keyid ?? publicKeyId(publicKey), sig: signature.toString('base64') }]
  });
}

export function verifyEnvelope(envelope, publicKey) {
  try {
    assertObject(envelope, 'DSSE envelope');
    if (envelope.payloadType !== IN_TOTO_PAYLOAD_TYPE || typeof envelope.payload !== 'string') return false;
    if (!Array.isArray(envelope.signatures) || envelope.signatures.length === 0) return false;
    const payload = Buffer.from(envelope.payload, 'base64');
    const expectedKeyId = publicKeyId(publicKey);
    return envelope.signatures.some((entry) => entry?.keyid === expectedKeyId && crypto.verify(null, pae(envelope.payloadType, payload), publicKey, Buffer.from(entry.sig, 'base64')));
  } catch {
    return false;
  }
}

export function decodeStatement(envelope) {
  return JSON.parse(Buffer.from(envelope.payload, 'base64').toString('utf8'));
}
