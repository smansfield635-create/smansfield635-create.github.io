import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sanitizeNativeChildError } from './h-earth-pr7479-native-child-failure-diagnostic.v1.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const originalPath=path.join(here,'h-earth-pr7479-current-native-registry-qualifier.v1.mjs');
const diagnosticPath=path.join(here,'h-earth-pr7479-native-child-failure-diagnostic.v1.mjs');
const original=fs.readFileSync(originalPath,'utf8');
const actual=fs.readFileSync(diagnosticPath,'utf8');
const targetHead='299d68d211576cef59cab228d4fe13b1f823ad43';

test('diagnostic reconstructs accepted qualifier with exactly two isolated insertions',()=>{
  const begin=actual.indexOf('/** Fail-closed diagnostic: only selected error/stack lines');
  const end=actual.indexOf('function run(command, args, options = {}) {',begin);
  assert.ok(begin>0&&end>begin);
  const withoutHelper=actual.slice(0,begin)+actual.slice(end);
  const failGuard=/    if \(!fs\.existsSync\(nativeReceiptPath\)\) \{[\s\S]*?\n    \}/g;
  assert.equal([...withoutHelper.matchAll(failGuard)].length,1);
  const recovered=withoutHelper.replace(failGuard,
    "    if (!fs.existsSync(nativeReceiptPath)) fail('NATIVE_PREFLIGHT_RECEIPT_MISSING');");
  assert.equal(recovered,original);
});

test('native command and immutable subject remain exact and read-only',()=>{
  for(const phrase of [
    "const NATIVE_TOOL_BLOB = 'f31ee516dff631da3d7f734a5751748ed051412f'",
    "const ACTIVATION_BLOB = '785730730fc10cd6351999207c61ef483094c06f'",
    "const FROZEN_SUBJECT_HEAD = '"+targetHead+"'",
    "'--experimental-default-type=module'",
    "nativeExecution = run('node', nativeArgs, { cwd: subjectRoot, env: process.env })",
    "result: 'FAIL_CLOSED'",
    'productMutationPerformed: false'
  ]) assert.ok(actual.includes(phrase),'missing accepted contract anchor');
  assert.equal(actual.includes('blobSha'),false);
  assert.equal(actual.includes('writebackPerformed: true'),false);
});

test('stderr sanitization discards unrelated lines, masks identifiers, and caps output',()=>{
  const sample=[
    'debug: unrelated value',
    'Error [ERR_MODULE_NOT_FOUND]: cannot load /home/runner/private/secret.js from admin@example.com',
    '    at /tmp/private/module.js:41:7',
    'Error: '+('Q'.repeat(40))
  ].join('\n');
  const output=sanitizeNativeChildError(sample,512);
  assert.ok(output.includes('ERR_MODULE_NOT_FOUND'));
  assert.ok(output.includes('[PATH]'));
  assert.ok(output.includes('[ADDRESS]'));
  assert.ok(output.includes('[REDACTED]'));
  assert.ok(!output.includes('admin@example.com'));
  assert.ok(!output.includes('/home/runner'));
  assert.ok(!output.includes('debug: unrelated'));
  assert.ok(output.length<=512);
  assert.equal(sanitizeNativeChildError('just noisy output',512),'');
  assert.equal(sanitizeNativeChildError('Error: '+('x'.repeat(5000)),512).length<=512,true);
});

test('missing native receipt remains a failure and child diagnostic excludes stdout',()=>{
  assert.ok(actual.includes("fail('NATIVE_PREFLIGHT_RECEIPT_MISSING', {"));
  for(const anchor of ['childExitStatus: nativeExecution.status',
      "childProcessError: nativeExecution.error ? sanitizeNativeChildError('Error: '+nativeExecution.error,160) : null",
      'childStderrPresent: Boolean(nativeExecution.stderr)',
      'childStderrExcerpt: sanitizeNativeChildError(nativeExecution.stderr,512)']) {
    assert.ok(actual.includes(anchor),'missing diagnostic field');
  }
  assert.ok(!actual.includes('childStdout:'));
  assert.ok(!actual.includes('childStderrRaw:'));
});

test('invalid candidate head still rejects before Git/native execution',()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-gen3393-neg-'));
  try{
    const output=path.join(temp,'failure.json');
    const result=spawnSync(process.execPath,[diagnosticPath,
      '--subject-head','0'.repeat(40),
      '--paths-base64',Buffer.from(JSON.stringify(['h-earth-3d/validation/h-earth.east-a-environmental-identity.v1.test.mjs'])).toString('base64'),
      '--execution-holder','H_EARTH_GEN3393_NEGATIVE',
      '--output',output],{cwd:temp,encoding:'utf8'});
    assert.notEqual(result.status,0);
    const receipt=JSON.parse(fs.readFileSync(output,'utf8'));
    assert.equal(receipt.result,'FAIL_CLOSED');
    assert.equal(receipt.errorCode,'PR7479_SUBJECT_HEAD_MISMATCH');
    assert.equal(receipt.productMutationPerformed,false);
  }finally{fs.rmSync(temp,{recursive:true,force:true})}
});
