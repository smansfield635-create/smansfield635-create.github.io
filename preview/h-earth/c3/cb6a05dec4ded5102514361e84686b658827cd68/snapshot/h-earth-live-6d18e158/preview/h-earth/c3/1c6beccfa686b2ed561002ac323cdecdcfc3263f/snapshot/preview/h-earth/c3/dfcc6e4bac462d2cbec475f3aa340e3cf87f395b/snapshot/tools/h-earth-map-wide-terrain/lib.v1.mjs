#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function fail(code, detail = null) {
  const error = new Error(detail ? `${code}:${detail}` : code);
  Object.assign(error, { code, detail });
  throw error;
}

export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}

export function canonical(value) { return JSON.stringify(stable(value)); }
export function sha256(value) { return crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : Buffer.from(String(value))).digest('hex'); }
export function hashObject(value) { return sha256(canonical(value)); }
export function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
export function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(stable(value), null, 2)}\n`); }

export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) fail('ARGUMENT_FORMAT_INVALID', token);
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i += 1; }
  }
  return out;
}

export function within(value, min, max) { return Number.isFinite(value) && value >= min && value <= max; }
export function intersects(a, b) { return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxZ <= b.minZ || a.minZ >= b.maxZ); }
export function contains(bounds, point) { return point.x >= bounds.minX && point.x <= bounds.maxX && point.z >= bounds.minZ && point.z <= bounds.maxZ; }
export function address(row, column) { return `R${String(row).padStart(2, '0')}:C${String(column).padStart(2, '0')}`; }
export function deepClone(value) { return structuredClone(value); }

export function entropy(values) {
  if (!values.length) return 0;
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let total = 0;
  for (const count of counts.values()) { const p = count / values.length; total -= p * Math.log2(p); }
  return total;
}
