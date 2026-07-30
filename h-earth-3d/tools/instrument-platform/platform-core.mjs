export function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
}

export function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeCanonical(value) {
  if (value === undefined) return null;
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('NON_FINITE_CANONICAL_NUMBER');
    return value;
  }
  if (Array.isArray(value)) return value.map(normalizeCanonical);
  if (ArrayBuffer.isView(value)) return Array.from(value, normalizeCanonical);
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => [key, normalizeCanonical(value[key])])
  );
}

export function stableStringify(value, indentation = 0) {
  return JSON.stringify(normalizeCanonical(value), null, indentation);
}

export function fnv1a32(text) {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(String(text));
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

export function canonicalDigest(value) {
  return fnv1a32(stableStringify(value));
}

export function requireNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${label}_REQUIRED`);
  return value.trim();
}

export function uniqueStrings(values, label) {
  if (!Array.isArray(values) || values.length === 0) throw new Error(`${label}_REQUIRED`);
  const normalized = values.map((value) => requireNonEmptyString(value, label));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${label}_DUPLICATE`);
  return normalized;
}

export function deterministicId(prefix, payload) {
  return `${prefix}_${canonicalDigest(payload).replace(':', '_')}`;
}

export function nowIso(clock = () => new Date()) {
  const value = clock();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('CLOCK_INVALID');
  return date.toISOString();
}
