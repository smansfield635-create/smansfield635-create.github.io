#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileCanonicalPacket } from '../operation-intake/canonical-packet-compiler.v1.mjs';

function fail(code, detail = null) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
}
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i], value = argv[i + 1];
    if (!['--request-base64','--procedure-base64','--output'].includes(key) || value === undefined) fail('COMPILER_ADAPTER_ARGUMENTS_NOT_CLOSED', key);
    out[key.slice(2)] = value;
  }
  for (const key of ['request-base64','procedure-base64','output']) if (!out[key]) fail('COMPILER_ADAPTER_ARGUMENTS_INCOMPLETE', key);
  return out;
}
function decodeJson(value, field) {
  try {
    const text = Buffer.from(value, 'base64').toString('utf8');
    if (!text || Buffer.from(text, 'utf8').toString('base64').replace(/=+$/,'') !== value.replace(/=+$/,'')) fail('COMPILER_ADAPTER_BASE64_NONCANONICAL', field);
    return JSON.parse(text);
  } catch (error) {
    if (error.code) throw error;
    fail('COMPILER_ADAPTER_INPUT_INVALID', field);
  }
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  return value;
}
function main() {
  const args = parseArgs(process.argv.slice(2));
  const request = decodeJson(args['request-base64'], 'request');
  const procedure = decodeJson(args['procedure-base64'], 'procedure');
  const compiled = compileCanonicalPacket(request, procedure);
  if (compiled.receipt?.schema !== 'CANONICAL_PACKET_READY_RECEIPT_v1' || compiled.receipt?.result !== 'PACKET_READY' || compiled.receipt?.authorityEffect !== 'NONE_PACKET_COMPILATION_ONLY') fail('COMPILER_ADAPTER_RECEIPT_INVALID');
  const payload = stable({
    schema: 'CANONICAL_PACKET_COMPILER_EXECUTION_RECEIPT_v1',
    result: 'PACKET_READY',
    packetReadyReceipt: compiled.receipt,
    canonicalOperationRequest: compiled.request,
    canonicalConstructionProcedure: compiled.procedure,
    canonicalIntakeEnvelope: compiled.envelope,
    canonicalIntakeComment: compiled.comment,
    repositoryMutationPerformed: false,
    admissionAuthorityCreated: false,
    mutationAuthorityCreated: false,
    mergeAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    releaseAuthorityCreated: false,
    publicationAuthorityCreated: false,
    arbitraryCommandAuthorityCreated: false,
    authorityEffect: 'NONE_PACKET_COMPILATION_ONLY'
  });
  fs.writeFileSync(path.resolve(args.output), JSON.stringify(payload, null, 2) + '\n');
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){try{main()}catch(error){process.stderr.write(JSON.stringify({schema:'CANONICAL_PACKET_COMPILER_EXECUTION_FAILURE_v1',result:'FAIL_CLOSED',errorCode:error.code??'UNEXPECTED_COMPILER_ADAPTER_FAILURE',detail:error.detail??error.message})+'\n');process.exitCode=1}}
