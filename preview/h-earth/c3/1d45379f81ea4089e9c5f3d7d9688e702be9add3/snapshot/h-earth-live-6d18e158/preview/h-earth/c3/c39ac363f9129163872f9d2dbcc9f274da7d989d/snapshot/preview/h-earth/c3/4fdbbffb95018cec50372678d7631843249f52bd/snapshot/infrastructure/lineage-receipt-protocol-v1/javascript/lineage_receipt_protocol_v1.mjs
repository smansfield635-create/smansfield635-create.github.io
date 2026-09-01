/** LRPv1 ECMAScript reference implementation. */

export const PROTOCOL = "LRP";
export const PROTOCOL_VERSION = "1.0.0";
export const CANONICALIZATION = "JCS-RFC8785-SAFEINT";
export const DIGEST_ALGORITHM = "SHA-256";
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
export const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

const RECEIPT_KEYS = new Set([
  "protocol",
  "protocol_version",
  "canonicalization",
  "digest_algorithm",
  "payload",
  "lineage_digest",
]);
const BODY_KEYS = [
  "protocol",
  "protocol_version",
  "canonicalization",
  "digest_algorithm",
  "payload",
];
const SHA256_RE = /^[0-9a-f]{64}$/;
const encoder = new TextEncoder();

export class LRPError extends Error {}
export class ValueDomainError extends LRPError {}

function rejectSurrogates(value, path) {
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new ValueDomainError(`LONE_SURROGATE:${path}`);
      }
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      throw new ValueDomainError(`LONE_SURROGATE:${path}`);
    }
  }
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function validateValue(value, path = "$") {
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      if (Number.isFinite(value) && !Number.isInteger(value)) {
        throw new ValueDomainError(`FLOAT_NOT_ALLOWED:${path}`);
      }
      throw new ValueDomainError(`INTEGER_OUT_OF_SAFE_RANGE:${path}`);
    }
    return;
  }
  if (typeof value === "string") {
    rejectSurrogates(value, path);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateValue(item, `${path}[${index}]`));
    return;
  }
  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      rejectSurrogates(key, `${path}.<key>`);
      validateValue(value[key], `${path}.${key}`);
    }
    return;
  }
  throw new ValueDomainError(`UNSUPPORTED_TYPE:${path}:${typeof value}`);
}

function quoteString(value) {
  rejectSurrogates(value, "$string");
  return JSON.stringify(value);
}

function serialize(value) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return quoteString(value);
  if (Array.isArray(value)) return `[${value.map(serialize).join(",")}]`;
  if (isPlainObject(value)) {
    // ECMAScript's default string sort compares UTF-16 code units, matching RFC 8785 §3.2.3.
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${quoteString(key)}:${serialize(value[key])}`).join(",")}}`;
  }
  throw new Error("validateValue must run before serialization");
}

export function canonicalizeText(value) {
  validateValue(value);
  return serialize(value);
}

export function canonicalize(value) {
  return encoder.encode(canonicalizeText(value));
}

export async function sha256Hex(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError("sha256Hex requires Uint8Array");
  }
  const buffer = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function digest(value) {
  return sha256Hex(canonicalize(value));
}

function cloneValue(value) {
  if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) return value.map(cloneValue);
  const result = {};
  for (const key of Object.keys(value)) result[key] = cloneValue(value[key]);
  return result;
}

function body(payload) {
  validateValue(payload);
  return {
    protocol: PROTOCOL,
    protocol_version: PROTOCOL_VERSION,
    canonicalization: CANONICALIZATION,
    digest_algorithm: DIGEST_ALGORITHM,
    payload: cloneValue(payload),
  };
}

export async function createReceipt(payload) {
  const receiptBody = body(payload);
  return {...receiptBody, lineage_digest: await digest(receiptBody)};
}

function verification({state, reasons, claimedDigest, computedDigest}) {
  return {
    state,
    protocol: PROTOCOL,
    protocol_version: PROTOCOL_VERSION,
    claimed_digest: claimedDigest,
    computed_digest: computedDigest,
    reasons: [...new Set(reasons)].sort(),
  };
}

export async function verifyReceipt(receipt) {
  const reasons = [];
  let claimedDigest = null;
  let computedDigest = null;

  if (!isPlainObject(receipt)) {
    return verification({state: "INVALID", reasons: ["RECEIPT_NOT_OBJECT"], claimedDigest, computedDigest});
  }

  const keys = Object.keys(receipt);
  for (const key of RECEIPT_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(receipt, key)) reasons.push(`MISSING_FIELD:${key}`);
  }
  for (const key of keys) {
    if (!RECEIPT_KEYS.has(key)) reasons.push(`UNDECLARED_FIELD:${key}`);
  }

  if (receipt.protocol !== PROTOCOL) reasons.push("PROTOCOL_MISMATCH");
  if (receipt.protocol_version !== PROTOCOL_VERSION) reasons.push("PROTOCOL_VERSION_MISMATCH");
  if (receipt.canonicalization !== CANONICALIZATION) reasons.push("CANONICALIZATION_MISMATCH");
  if (receipt.digest_algorithm !== DIGEST_ALGORITHM) reasons.push("DIGEST_ALGORITHM_MISMATCH");

  if (typeof receipt.lineage_digest === "string") claimedDigest = receipt.lineage_digest;
  if (typeof receipt.lineage_digest !== "string" || !SHA256_RE.test(receipt.lineage_digest)) {
    reasons.push("LINEAGE_DIGEST_INVALID");
  }

  if (BODY_KEYS.every((key) => Object.prototype.hasOwnProperty.call(receipt, key))) {
    try {
      const receiptBody = {};
      for (const key of BODY_KEYS) receiptBody[key] = cloneValue(receipt[key]);
      validateValue(receiptBody);
      computedDigest = await digest(receiptBody);
    } catch (error) {
      reasons.push(String(error.message || error));
    }
  } else if (Object.prototype.hasOwnProperty.call(receipt, "payload")) {
    try {
      validateValue(receipt.payload);
    } catch (error) {
      reasons.push(String(error.message || error));
    }
  }

  if (computedDigest !== null && claimedDigest !== null && computedDigest !== claimedDigest) {
    reasons.push("LINEAGE_DIGEST_MISMATCH");
  }

  return verification({
    state: reasons.length === 0 ? "VALID" : "INVALID",
    reasons,
    claimedDigest,
    computedDigest,
  });
}
