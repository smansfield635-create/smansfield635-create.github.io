#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const LOCATOR_PATH = '.github/operation-intake/locator.v1.json';
const REPOSITORY = process.env.GITHUB_REPOSITORY || 'smansfield635-create/smansfield635-create.github.io';

function fail(code, detail = null) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  return value;
}
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(path.resolve(file), JSON.stringify(stable(value), null, 2) + '\n');
}
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i], value = argv[i + 1];
    if (!['--input','--output'].includes(key) || value === undefined) fail('CLI_ARGUMENTS_NOT_CLOSED', key);
    out[key.slice(2)] = value;
  }
  if (!out.input || !out.output) fail('CLI_ARGUMENTS_INCOMPLETE');
  return out;
}
function loadLocator() {
  const locator = JSON.parse(fs.readFileSync(LOCATOR_PATH, 'utf8'));
  if (locator.schema !== 'REPOSITORY_OPERATION_INTAKE_LOCATOR_v1' || locator.status !== 'ACTIVE_FAIL_CLOSED') fail('CANONICAL_LOCATOR_INVALID');
  for (const key of ['entrypoint','lockManager','lockRef','requestSchema','constructionProcedureSchema']) if (!locator[key]) fail('CANONICAL_LOCATOR_INCOMPLETE', key);
  if (!fs.existsSync(locator.entrypoint) || !fs.existsSync(locator.lockManager)) fail('CANONICAL_TOOLING_MISSING');
  return locator;
}
function validateEnvelope(envelope) {
  if (envelope?.schema !== 'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1') fail('TRANSPORT_SCHEMA_INVALID');
  if (!envelope.operationRequest || !envelope.constructionProcedure) fail('TRANSPORT_ENVELOPE_INCOMPLETE');
  const a = envelope.operationRequest.exactGoverningHead;
  const b = envelope.constructionProcedure.exactGoverningHead;
  if (!a || a !== b) fail('EXACT_GOVERNING_HEAD_MISMATCH');
  return envelope;
}
function selfTest() {
  const locator = loadLocator();
  const checks = [
    locator.entrypoint === 'tools/operation-intake/repository-operation-intake-gate.v1.mjs',
    locator.lockManager === 'tools/operation-intake/repository-operation-lock-manager.v1.mjs',
    typeof locator.lockRef === 'string' && locator.lockRef.startsWith('refs/heads/operation-locks/'),
    locator.requestSchema === '.github/operation-intake/request.schema.v1.json',
    locator.constructionProcedureSchema === '.github/operation-intake/construction-procedure.schema.v1.json'
  ];
  return {schema:'CANONICAL_OPERATION_INTAKE_TRANSPORT_SELF_TEST_v1',result:checks.every(Boolean)?'PASS_CLOSED':'FAIL_CLOSED',checkCount:checks.length,checks,canonicalLocator:LOCATOR_PATH,canonicalIdentitiesResolvedAtRuntime:true,authorityCreated:false,admissionSemanticsDuplicated:false};
}

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--self-test') {
  const receipt = selfTest();
  process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
  process.exit(receipt.result === 'PASS_CLOSED' ? 0 : 1);
}

let output = null;
try {
  const parsed = parseArgs(args); output = parsed.output;
  const envelope = validateEnvelope(JSON.parse(fs.readFileSync(parsed.input, 'utf8')));
  const locator = loadLocator();
  if (!process.env.GITHUB_TOKEN) fail('GITHUB_TOKEN_MISSING');
  const root = path.dirname(path.resolve(parsed.output));
  fs.mkdirSync(root, { recursive: true });
  const requestPath = path.join(root, 'canonical-operation-request.json');
  const procedurePath = path.join(root, 'canonical-construction-procedure.json');
  const canonicalPath = path.join(root, 'canonical-admission-receipt.json');
  writeJson(requestPath, envelope.operationRequest);
  writeJson(procedurePath, envelope.constructionProcedure);
  const child = spawnSync(process.execPath, [locator.entrypoint,'--request',requestPath,'--procedure',procedurePath,'--repository',REPOSITORY,'--lock-ref',locator.lockRef,'--output',canonicalPath], {encoding:'utf8',env:process.env,timeout:120000});
  if (!fs.existsSync(canonicalPath)) fail('CANONICAL_RECEIPT_MISSING', {exitCode:child.status,stderr:child.stderr});
  const canonicalReceipt = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
  if (canonicalReceipt.schema !== 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1') fail('CANONICAL_RECEIPT_SCHEMA_INVALID');
  const receipt = {schema:'CANONICAL_OPERATION_INTAKE_TRANSPORT_RECEIPT_v1',result:canonicalReceipt.result==='ADMITTED_AND_LOCKED'?'CANONICAL_RECEIPT_PRESERVED':'FAIL_CLOSED',canonicalLocator:LOCATOR_PATH,canonicalGateExecuted:true,canonicalReceiptJson:canonicalReceipt,canonicalChildExitCode:child.status,authorityCreated:false,mergeAuthorityCreated:false,admissionSemanticsDuplicated:false,repositoryMutationPerformedByTransport:false};
  writeJson(parsed.output, receipt);
  process.exitCode = receipt.result === 'CANONICAL_RECEIPT_PRESERVED' ? 0 : 1;
} catch (error) {
  const receipt = {schema:'CANONICAL_OPERATION_INTAKE_TRANSPORT_RECEIPT_v1',result:'FAIL_CLOSED',errorCode:error.code || 'UNEXPECTED_FAILURE',detail:error.detail || error.message,canonicalGateExecuted:false,authorityCreated:false,mergeAuthorityCreated:false,admissionSemanticsDuplicated:false,repositoryMutationPerformedByTransport:false};
  if (output) writeJson(output, receipt); else process.stderr.write(JSON.stringify(receipt, null, 2) + '\n');
  process.exitCode = 1;
}
