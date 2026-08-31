#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const REPOSITORY = "smansfield635-create/smansfield635-create.github.io";
export const LOCK_REF = "refs/heads/operation-locks/repository-operation-intake-v1";
export const BRIDGE_ID = "CANONICAL_REPOSITORY_OPERATION_INTAKE_PRE_REGISTRATION_EXECUTION_BRIDGE_v1";
export const CONTRACT_ID = "REPOSITORY_OPERATION_INTAKE_PRE_REGISTRATION_EXECUTION_BRIDGE_CONTRACT_v1";
export const IDENTITIES = Object.freeze({
  gate: Object.freeze({ path: "tools/operation-intake/repository-operation-intake-gate.v1.mjs", blob: "f0b22e6b9574507632f1ad07647710971a4d63de" }),
  lockManager: Object.freeze({ path: "tools/operation-intake/repository-operation-lock-manager.v1.mjs", blob: "6fc0199c9dc943b8cdf3efe7c789f0e1888774b8" }),
  requestSchema: Object.freeze({ path: ".github/operation-intake/request.schema.v1.json", blob: "e4f79b23cb02566702b2f5569369f1a20cafe5ad" }),
  procedureSchema: Object.freeze({ path: ".github/operation-intake/construction-procedure.schema.v1.json", blob: "f2fd36b4f3f562cdb9bb99ed936160238aefd45e" }),
  receiptSchema: Object.freeze({ path: ".github/operation-intake/admission-receipt.schema.v1.json", blob: "46d99ead199530003a0332c5cb5b7c541f1c0312" })
});
const REQUIRED = Object.freeze(['schema','requestId','repository','exactGoverningHead','operationRequest','constructionProcedure','requestNonce','executionHolder']);
const PROHIBITED = Object.freeze(['command','shellCommand','scriptBody','workflowOverride','repositoryOverride','lockRef','lockRefOverride','environment','environmentOverride','extraArguments','branch','path']);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const canonical = value => JSON.stringify(stable(value));
const jsonText = value => JSON.stringify(stable(value), null, 2) + '\n';
const gitBlobSha = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const fail = (code, detail = null) => { const error = new Error(code); error.code = code; error.detail = detail; throw error; };
const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

export function validateBridgeRequest(value) {
  if (!isObject(value)) fail('BRIDGE_INPUT_NOT_OBJECT');
  const keys = Object.keys(value).sort();
  if (JSON.stringify(keys) !== JSON.stringify([...REQUIRED].sort())) fail('BRIDGE_INPUT_KEYS_NOT_CLOSED', keys);
  for (const key of PROHIBITED) if (Object.hasOwn(value, key)) fail('PROHIBITED_BRIDGE_INPUT_FIELD', key);
  if (value.schema !== 'PRE_REGISTRATION_INTAKE_BRIDGE_REQUEST_v1') fail('BRIDGE_INPUT_SCHEMA_MISMATCH');
  if (value.repository !== REPOSITORY) fail('REPOSITORY_SUBSTITUTION_PROHIBITED');
  if (!/^[0-9a-f]{40}$/.test(value.exactGoverningHead ?? '')) fail('GOVERNING_HEAD_INVALID');
  if (!/^[0-9a-f]{64}$/.test(value.requestNonce ?? '')) fail('REQUEST_NONCE_INVALID');
  if (!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(value.requestId ?? '')) fail('REQUEST_ID_INVALID');
  if (!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(value.executionHolder ?? '')) fail('EXECUTION_HOLDER_INVALID');
  if (!isObject(value.operationRequest) || !isObject(value.constructionProcedure)) fail('CANONICAL_DOCUMENTS_MISSING');
  if (value.operationRequest.exactGoverningHead !== value.exactGoverningHead) fail('REQUEST_GOVERNING_HEAD_MISMATCH');
  if (value.constructionProcedure.exactGoverningHead !== value.exactGoverningHead) fail('PROCEDURE_GOVERNING_HEAD_MISMATCH');
  return stable(value);
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]; const value = argv[i + 1];
    if (!['--input','--output'].includes(key) || value === undefined) fail('CLI_ARGUMENTS_NOT_FIXED', key);
    result[key.slice(2)] = value;
  }
  if (Object.keys(result).length !== 2 || !result.input || !result.output) fail('CLI_ARGUMENTS_INCOMPLETE');
  return result;
}

function runtimePath(value, label) {
  const root = path.resolve(process.env.RUNNER_TEMP || '/tmp');
  const resolved = path.resolve(value);
  if (!(resolved === root || resolved.startsWith(root + path.sep))) fail('RUNTIME_PATH_OUTSIDE_RUNNER_TEMP', label);
  return resolved;
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, jsonText(value)); }
function repositoryRoot() { return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'); }
function verifyIdentity(root, identity) {
  const absolute = path.join(root, identity.path);
  const bytes = fs.readFileSync(absolute);
  const actual = gitBlobSha(bytes);
  if (actual !== identity.blob) fail('BOUND_REPOSITORY_BLOB_MISMATCH', {path:identity.path,expected:identity.blob,actual});
  return actual;
}
async function apiJson(url, token) {
  const response = await fetch(url, {headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'}});
  const text = await response.text();
  let body; try { body = text ? JSON.parse(text) : null; } catch { body = {raw:text}; }
  if (!response.ok) fail('GITHUB_API_READ_FAILED', {status:response.status,url,body});
  return body;
}
async function currentMainHead(token) {
  const branch = await apiJson(`https://api.github.com/repos/${REPOSITORY}/branches/main`, token);
  return branch?.commit?.sha;
}
async function readLockLedger(token) {
  const encodedPath = '.github/operation-intake/active-operation-ledger.v1.json'.split('/').map(encodeURIComponent).join('/');
  const branch = LOCK_REF.slice('refs/heads/'.length);
  const file = await apiJson(`https://api.github.com/repos/${REPOSITORY}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`, token);
  return JSON.parse(Buffer.from(String(file.content).replace(/\s/g,''), 'base64').toString('utf8'));
}
function replayMatch(ledger, operationId, requestDigest) {
  const active = Object.values(ledger?.activeScopes ?? {});
  const terminal = Array.isArray(ledger?.terminalHistory) ? ledger.terminalHistory : [];
  return [...active, ...terminal].find(entry => entry?.operationId === operationId && entry?.requestDigest === requestDigest) ?? null;
}
function auditFactory() {
  const events = []; return {events, add(event, details={}) { events.push({sequence:events.length+1,event,timestamp:new Date().toISOString(),details:stable(details)}); }};
}
function failureReceipt(error, audit, extra={}) {
  return stable({schema:'PRE_REGISTRATION_INTAKE_BRIDGE_RECEIPT_v1',result:'FAIL_CLOSED_NON_ADMISSION',bridgeId:BRIDGE_ID,contractId:CONTRACT_ID,errorCode:error.code ?? 'UNEXPECTED_BRIDGE_FAILURE',detail:error.detail ?? error.message,canonicalGateExecuted:false,admissionResultRewritten:false,lockMutationAttempted:false,auditEvents:audit.events,...extra});
}

export async function executeBridge(raw, {inputPath, outputPath}) {
  const audit = auditFactory();
  try {
    const request = validateBridgeRequest(raw); audit.add('INPUT_ACCEPTED', {requestId:request.requestId});
    const token = process.env.GITHUB_TOKEN; if (!token) fail('GITHUB_TOKEN_MISSING');
    const root = repositoryRoot();
    const verified = Object.fromEntries(Object.entries(IDENTITIES).map(([key,identity]) => [key,verifyIdentity(root,identity)]));
    audit.add('BOUND_IDENTITIES_VERIFIED', verified);
    const observedHead = await currentMainHead(token);
    if (observedHead !== request.exactGoverningHead) fail('GOVERNING_HEAD_MISMATCH', {expected:request.exactGoverningHead,observed:observedHead});
    audit.add('GOVERNING_HEAD_VERIFIED', {observedHead});
    const requestDigest = sha256(canonical(request.operationRequest));
    const procedureDigest = sha256(canonical(request.constructionProcedure));
    const ledger = await readLockLedger(token);
    const replay = replayMatch(ledger, request.operationRequest.operationId, requestDigest);
    if (replay) fail('REPLAY_DETECTED_NO_EXECUTION', {operationId:replay.operationId,lockGeneration:replay.lockGeneration,state:replay.state});
    audit.add('REPLAY_PRECHECK_PASS', {requestDigest});
    const work = path.join(path.dirname(outputPath), `bridge-${request.requestNonce}`);
    fs.mkdirSync(work, {recursive:false});
    const requestFile = path.join(work,'operation-request.json');
    const procedureFile = path.join(work,'construction-procedure.json');
    const canonicalReceiptFile = path.join(work,'canonical-admission-receipt.json');
    fs.writeFileSync(requestFile, jsonText(request.operationRequest));
    fs.writeFileSync(procedureFile, jsonText(request.constructionProcedure));
    const child = spawnSync(process.execPath,[path.join(root,IDENTITIES.gate.path),'--request',requestFile,'--procedure',procedureFile,'--repository',REPOSITORY,'--lock-ref',LOCK_REF,'--output',canonicalReceiptFile],{cwd:root,env:{...process.env,GITHUB_TOKEN:token},shell:false,encoding:'utf8',timeout:120000});
    audit.add('CANONICAL_GATE_EXECUTED', {exitCode:child.status,signal:child.signal,stderrSha256:sha256(child.stderr ?? ''),stdoutSha256:sha256(child.stdout ?? '')});
    if (!fs.existsSync(canonicalReceiptFile)) fail('CANONICAL_RECEIPT_MISSING', {childExitCode:child.status});
    const receiptBytes = fs.readFileSync(canonicalReceiptFile);
    let receipt; try { receipt = JSON.parse(receiptBytes.toString('utf8')); } catch { fail('CANONICAL_RECEIPT_NOT_JSON'); }
    if (receipt.schema !== 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1') fail('CANONICAL_RECEIPT_SCHEMA_MISMATCH', receipt.schema);
    if (!['ADMITTED_AND_LOCKED','INPUT_INCOMPLETE_NOT_STARTED','ACTIVE_SCOPE_ALREADY_LOCKED'].includes(receipt.result)) fail('CANONICAL_RECEIPT_RESULT_INVALID', receipt.result);
    audit.add('CANONICAL_RECEIPT_PRESERVED', {receiptDigest:sha256(receiptBytes),result:receipt.result});
    return stable({schema:'PRE_REGISTRATION_INTAKE_BRIDGE_RECEIPT_v1',result:'CANONICAL_RECEIPT_RETURNED',bridgeId:BRIDGE_ID,contractId:CONTRACT_ID,requestId:request.requestId,executionHolder:request.executionHolder,repository:REPOSITORY,exactGoverningHead:request.exactGoverningHead,canonicalGateExecuted:true,canonicalGatePath:IDENTITIES.gate.path,canonicalGateBlob:IDENTITIES.gate.blob,lockRef:LOCK_REF,requestDigest,procedureDigest,childExitCode:child.status,canonicalReceiptSha256:sha256(receiptBytes),canonicalReceiptBase64:receiptBytes.toString('base64'),canonicalReceiptJson:receipt,admissionResultRewritten:false,lockIdentity:receipt.lock ?? null,auditEvents:audit.events});
  } catch (error) { return failureReceipt(error,audit,{inputPath}); }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = runtimePath(args.input,'input'); const outputPath = runtimePath(args.output,'output');
  const raw = readJson(inputPath); const receipt = await executeBridge(raw,{inputPath,outputPath}); writeJson(outputPath,receipt);
  if (receipt.result !== 'CANONICAL_RECEIPT_RETURNED') process.exitCode = 1;
}
const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main().catch(error => { process.stderr.write(jsonText({schema:'PRE_REGISTRATION_INTAKE_BRIDGE_PROCESS_FAILURE_v1',error:error.message})); process.exitCode=1; });
