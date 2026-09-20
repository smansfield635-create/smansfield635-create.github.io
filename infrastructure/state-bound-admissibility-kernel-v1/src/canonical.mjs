import crypto from 'node:crypto';

export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function canonical(value) {
  return JSON.stringify(stable(value));
}

export function sha256(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(typeof value === 'string' ? value : canonical(value));
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

export function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw coded('INVALID_INPUT', `${label} must be an object`);
  return value;
}

export function assertString(value, label) {
  if (typeof value !== 'string' || value.length === 0) throw coded('INVALID_INPUT', `${label} must be a non-empty string`);
  return value;
}

export function coded(code, message, details = null) {
  const error = new Error(message || code);
  error.code = code;
  error.details = details;
  return error;
}

export function digestRecord(value, label = 'value') {
  assertObject(value, label);
  return sha256(value);
}

export function normalizeDigestList(items, label = 'evidence') {
  if (!Array.isArray(items) || items.length === 0) throw coded('INVALID_INPUT', `${label} must be a non-empty array`);
  return items.map((item, index) => ({
    id: assertString(item?.id, `${label}[${index}].id`),
    digest: /^[0-9a-f]{64}$/.test(item?.digest ?? '') ? item.digest : sha256(item?.value ?? item)
  })).sort((a, b) => a.id.localeCompare(b.id) || a.digest.localeCompare(b.digest));
}
