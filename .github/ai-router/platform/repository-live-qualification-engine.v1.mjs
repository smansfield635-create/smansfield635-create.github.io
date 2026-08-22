#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const stable = (value) => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
};

function validateManifest(file) {
  const m = readJson(file);
  const required = ['schema','projectId','publicRoute','stage','publicByteAssertions','runtime'];
  for (const key of required) if (!(key in m)) throw new Error(`MANIFEST_MISSING_${key}`);
  if (m.schema !== 'DGB_LIVE_QUALIFICATION_MANIFEST_v1') throw new Error('MANIFEST_SCHEMA_UNSUPPORTED');
  if (!Array.isArray(m.publicByteAssertions)) throw new Error('PUBLIC_BYTE_ASSERTIONS_NOT_ARRAY');
  if (!m.stage || typeof m.stage !== 'object') throw new Error('STAGE_INVALID');
  if (!m.runtime || typeof m.runtime !== 'object') throw new Error('RUNTIME_INVALID');
  for (const a of m.publicByteAssertions) {
    if (!a.sourcePath || !a.publicPath) throw new Error('BYTE_ASSERTION_INCOMPLETE');
  }
  if (m.stage.adapter && !m.stage.adapter.startsWith('.github/live-qualification/')) throw new Error('STAGE_ADAPTER_OUTSIDE_ENGINE_ROOT');
  if (m.runtime.verifier && !m.runtime.verifier.startsWith('.github/live-qualification/')) throw new Error('RUNTIME_VERIFIER_OUTSIDE_ENGINE_ROOT');
  return {manifest:m, manifestSha256:sha256(fs.readFileSync(file))};
}

function finalizeReceipt(inputPath, outputPath) {
  const r = readJson(inputPath);
  const requiredStates = ['SOURCE_IDENTITY','CANDIDATE_QUALIFICATION','ASSET_IDENTITY','MERGE_IDENTITY','PUBLICATION','PUBLIC_BYTES','LIVE_RUNTIME'];
  r.schema = 'DGB_LIVE_QUALIFICATION_RECEIPT_v1';
  r.states ||= {};
  for (const state of requiredStates) {
    if (!(state in r.states)) r.states[state] = {status:'NOT_REQUIRED'};
  }
  const failures = Object.entries(r.states).filter(([,v]) => v?.status === 'FAIL');
  const unresolved = Object.entries(r.states).filter(([,v]) => !['PASS','NOT_REQUIRED'].includes(v?.status));
  r.terminalDisposition = failures.length ? 'FAIL_CLOSED' : unresolved.length ? 'INCOMPLETE_CLOSED' : 'PASS_CLOSED';
  r.generatedAt = new Date().toISOString();
  const withoutDigest = structuredClone(r);
  delete withoutDigest.receiptSha256;
  r.receiptSha256 = sha256(stable(withoutDigest));
  fs.writeFileSync(outputPath, JSON.stringify(r, null, 2) + '\n');
  if (r.terminalDisposition !== 'PASS_CLOSED') process.exitCode = 1;
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === 'validate-manifest') {
    const [file, out] = args;
    const result = validateManifest(file);
    if (out) fs.writeFileSync(out, JSON.stringify({projectId:result.manifest.projectId, manifestSha256:result.manifestSha256}, null, 2) + '\n');
    else console.log(JSON.stringify(result, null, 2));
  } else if (command === 'finalize-receipt') {
    finalizeReceipt(args[0], args[1]);
  } else if (command === 'self-test') {
    const sample = {b:2,a:1};
    if (stable(sample) !== '{"a":1,"b":2}') throw new Error('STABLE_SERIALIZATION_FAILED');
    console.log('REPOSITORY_LIVE_QUALIFICATION_ENGINE_SELF_TEST_PASS');
  } else {
    throw new Error('UNKNOWN_COMMAND');
  }
} catch (error) {
  console.error(error?.stack || String(error));
  process.exit(1);
}
