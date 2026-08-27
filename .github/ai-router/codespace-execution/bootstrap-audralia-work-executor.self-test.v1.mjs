#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BROWSER_ARCHIVE_SHA256,
  BROWSER_ARCHIVE_URL,
  BROWSER_VERSION,
  EXACT_TARGET_HEAD,
  NODE_VERSION,
  OPERATION_ID,
  PASS_RESULT,
  PASS_SCHEMA,
  PUPPETEER_CORE_VERSION,
  parseArgs,
  sha256File,
  validatePassReceipt
} from './bootstrap-audralia-work-executor.v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const profilePath = path.join(root, '.github/ai-router/codespace-execution/project-profiles/audralia-gen1754.v1.json');
const schemaPath = path.join(root, '.github/ai-router/codespace-execution/schemas/environment-receipt.schema.v1.json');
const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

assert.deepEqual(parseArgs(['--operation-id', OPERATION_ID, '--exact-target-head', EXACT_TARGET_HEAD]), {
  'operation-id': OPERATION_ID,
  'exact-target-head': EXACT_TARGET_HEAD
});
assert.equal(profile.exactTargetHead, EXACT_TARGET_HEAD);
assert.equal(profile.portableBootstrap.operationId, OPERATION_ID);
assert.equal(profile.portableBootstrap.browser.version, BROWSER_VERSION);
assert.equal(profile.portableBootstrap.browser.archiveUrl, BROWSER_ARCHIVE_URL);
assert.equal(profile.portableBootstrap.browser.archiveSha256, BROWSER_ARCHIVE_SHA256);
assert.equal(profile.portableBootstrap.browser.executableMode, '0755');
assert.equal(profile.portableBootstrap.nodeVersion, NODE_VERSION);
assert.equal(profile.requiredRuntime.puppeteerCore, PUPPETEER_CORE_VERSION);
assert.equal(schema.properties.schema.const, PASS_SCHEMA);
assert.ok(schema.properties.result.enum.includes(PASS_RESULT));

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'audralia-bootstrap-self-test-'));
try {
  const fixture = path.join(temp, 'fixture');
  fs.writeFileSync(fixture, 'portable-bootstrap-fixture\n');
  assert.equal(sha256File(fixture), crypto.createHash('sha256').update('portable-bootstrap-fixture\n').digest('hex'));
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

const passReceipt = {
  schema: PASS_SCHEMA,
  environmentId: 'self-test-environment',
  backendId: 'LOCAL_CLEAN_GIT',
  operationId: OPERATION_ID,
  exactTargetHead: EXACT_TARGET_HEAD,
  worktreeCleanBeforeExecution: true,
  runtime: {
    readyConditions: {
      REPOSITORY_MATERIALIZED: true,
      DEPENDENCIES_READY: true,
      COMMAND_EXECUTION_AVAILABLE: true
    },
    githubActionsUsedAsAgentExecutionTransport: false
  },
  result: PASS_RESULT
};
assert.equal(validatePassReceipt(passReceipt), true);
assert.throws(() => validatePassReceipt({ ...passReceipt, runtime: { ...passReceipt.runtime, readyConditions: { REPOSITORY_MATERIALIZED: true } } }), /RECEIPT_SCHEMA_FAILURE/);

process.stdout.write(`${JSON.stringify({
  schema: 'AUDRALIA_WORK_EXECUTOR_PORTABLE_BOOTSTRAP_SELF_TEST_v1',
  result: 'PASS',
  exactTargetHead: EXACT_TARGET_HEAD,
  browserArchiveSha256: BROWSER_ARCHIVE_SHA256,
  nodeVersion: NODE_VERSION,
  puppeteerCoreVersion: PUPPETEER_CORE_VERSION
})}\n`);
