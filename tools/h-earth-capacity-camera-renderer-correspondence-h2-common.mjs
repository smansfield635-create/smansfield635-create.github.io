import { createHash } from 'node:crypto';

export const freeze = value => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) freeze(child);
  return value;
};

export const canonical = value =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
      : value;

export const digest = value =>
  createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');

export const fail = (code, details = null) => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

export const clone = value => JSON.parse(JSON.stringify(value));
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const gitBlobSha = bytes =>
  createHash('sha1').update(`blob ${bytes.byteLength}\0`).update(bytes).digest('hex');

export const exactFiniteFields = (value, fields) =>
  value && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).length === fields.length &&
  fields.every(field => Number.isFinite(value[field]));
