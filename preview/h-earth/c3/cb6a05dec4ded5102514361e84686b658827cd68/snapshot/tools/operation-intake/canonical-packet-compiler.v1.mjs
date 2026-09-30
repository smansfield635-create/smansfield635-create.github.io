#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare } from './repository-operation-intake-gate.v1.mjs';
import { canonical, sha, stable, text } from './repository-operation-lock-manager.v1.mjs';

export const PACKET_READY_SCHEMA = 'CANONICAL_PACKET_READY_RECEIPT_v1';
export const TRANSPORT_SCHEMA = 'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1';
export const MARKER = 'CANONICAL_OPERATION_INTAKE_REQUEST_V1';

function failure(code, field = null, sourceDocument = null, detail = null) {
  return stable({
    schema: PACKET_READY_SCHEMA,
    result: 'PACKET_NOT_READY',
    errorCode: code,
    field,
    sourceDocument,
    detail,
    submissionReady: false,
    admissionAuthorityCreated: false,
    mutationAuthorityCreated: false,
    mergeAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    releaseAuthorityCreated: false,
    publicationAuthorityCreated: false,
    scientificAuthorityCreated: false,
    claimAuthorityCreated: false,
    authorityEffect: 'NONE_PACKET_COMPILATION_ONLY'
  });
}

function parseCompiledComment(comment) {
  if (typeof comment !== 'string') throw Object.assign(new Error('TRANSPORT_COMMENT_INVALID'), { code: 'TRANSPORT_COMMENT_INVALID', field: 'comment' });
  const firstNewline = comment.indexOf('\n');
  if (firstNewline < 0 || comment.slice(0, firstNewline).trim() !== MARKER) {
    throw Object.assign(new Error('TRANSPORT_MARKER_MISMATCH'), { code: 'TRANSPORT_MARKER_MISMATCH', field: 'comment' });
  }
  const raw = comment.slice(firstNewline + 1).trim();
  let envelope;
  try { envelope = JSON.parse(raw); }
  catch (error) { throw Object.assign(new Error('TRANSPORT_COMMENT_JSON_INVALID'), { code: 'TRANSPORT_COMMENT_JSON_INVALID', field: 'comment', detail: error.message }); }
  if (envelope?.schema !== TRANSPORT_SCHEMA) throw Object.assign(new Error('TRANSPORT_SCHEMA_INVALID'), { code: 'TRANSPORT_SCHEMA_INVALID', field: 'envelope.schema' });
  if (!envelope.operationRequest || !envelope.constructionProcedure) throw Object.assign(new Error('TRANSPORT_ENVELOPE_INCOMPLETE'), { code: 'TRANSPORT_ENVELOPE_INCOMPLETE', field: 'envelope' });
  const keys = Object.keys(envelope).sort();
  if (canonical(keys) !== canonical(['constructionProcedure', 'operationRequest', 'schema'])) {
    throw Object.assign(new Error('TRANSPORT_ENVELOPE_EXTRA_FIELDS'), { code: 'TRANSPORT_ENVELOPE_EXTRA_FIELDS', field: 'envelope' });
  }
  return stable(envelope);
}

export function validateCompiledComment(comment) {
  const envelope = parseCompiledComment(comment);
  const prepared = prepare(envelope.operationRequest, envelope.constructionProcedure);
  if (canonical(envelope.operationRequest) !== canonical(prepared.request)) {
    throw Object.assign(new Error('COMPILED_REQUEST_DRIFT'), { code: 'COMPILED_REQUEST_DRIFT', field: 'operationRequest' });
  }
  if (canonical(envelope.constructionProcedure) !== canonical(prepared.procedure)) {
    throw Object.assign(new Error('COMPILED_PROCEDURE_DRIFT'), { code: 'COMPILED_PROCEDURE_DRIFT', field: 'constructionProcedure' });
  }
  return stable({ envelope, prepared });
}

export function compileCanonicalPacket(request, procedure) {
  const prepared = prepare(request, procedure);
  const envelope = stable({
    schema: TRANSPORT_SCHEMA,
    operationRequest: prepared.request,
    constructionProcedure: prepared.procedure
  });
  const envelopeCanonical = canonical(envelope);
  const comment = `${MARKER}\n${envelopeCanonical}\n`;
  const roundTrip = validateCompiledComment(comment);
  if (canonical(roundTrip.envelope) !== envelopeCanonical) {
    throw Object.assign(new Error('COMPILED_ENVELOPE_ROUNDTRIP_MISMATCH'), { code: 'COMPILED_ENVELOPE_ROUNDTRIP_MISMATCH', field: 'envelope' });
  }

  const requestText = text(prepared.request);
  const procedureText = text(prepared.procedure);
  const envelopeText = text(envelope);
  const receipt = stable({
    schema: PACKET_READY_SCHEMA,
    result: 'PACKET_READY',
    operationId: prepared.request.operationId,
    lockScope: prepared.request.lockScope,
    governingHead: prepared.request.exactGoverningHead,
    requestDigest: prepared.requestDigest,
    procedureDigest: prepared.procedureLocatorDigest,
    envelopeDigest: sha(envelopeCanonical),
    commentDigest: sha(comment),
    artifactDigests: {
      canonicalOperationRequest: sha(requestText),
      canonicalConstructionProcedure: sha(procedureText),
      canonicalIntakeEnvelope: sha(envelopeText),
      canonicalIntakeComment: sha(comment)
    },
    transportSchema: TRANSPORT_SCHEMA,
    marker: MARKER,
    semanticValidator: 'tools/operation-intake/repository-operation-intake-gate.v1.mjs#prepare',
    submissionReady: true,
    admissionAuthorityCreated: false,
    mutationAuthorityCreated: false,
    mergeAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    releaseAuthorityCreated: false,
    publicationAuthorityCreated: false,
    scientificAuthorityCreated: false,
    claimAuthorityCreated: false,
    authorityEffect: 'NONE_PACKET_COMPILATION_ONLY'
  });

  return stable({
    request: prepared.request,
    procedure: prepared.procedure,
    envelope,
    comment,
    receipt
  });
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!['--request', '--procedure', '--output-dir'].includes(key) || value === undefined) {
      throw Object.assign(new Error('CLI_ARGUMENTS_NOT_CLOSED'), { code: 'CLI_ARGUMENTS_NOT_CLOSED', field: key ?? 'argv' });
    }
    out[key.slice(2)] = value;
  }
  for (const key of ['request', 'procedure', 'output-dir']) {
    if (!out[key]) throw Object.assign(new Error('CLI_ARGUMENTS_INCOMPLETE'), { code: 'CLI_ARGUMENTS_INCOMPLETE', field: key });
  }
  return out;
}

function readJson(file, field) {
  try { return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')); }
  catch (error) { throw Object.assign(new Error('INPUT_READ_FAILED'), { code: 'INPUT_READ_FAILED', field, detail: error.message }); }
}

function writeOutput(dir, name, content) {
  fs.mkdirSync(path.resolve(dir), { recursive: true });
  fs.writeFileSync(path.join(path.resolve(dir), name), content);
}

async function main() {
  let outputDir = null;
  try {
    const args = parseArgs(process.argv.slice(2));
    outputDir = args['output-dir'];
    const compiled = compileCanonicalPacket(readJson(args.request, 'request'), readJson(args.procedure, 'procedure'));
    writeOutput(outputDir, 'canonical-operation-request.json', text(compiled.request));
    writeOutput(outputDir, 'canonical-construction-procedure.json', text(compiled.procedure));
    writeOutput(outputDir, 'canonical-intake-envelope.json', text(compiled.envelope));
    writeOutput(outputDir, 'canonical-intake-comment.txt', compiled.comment);
    writeOutput(outputDir, 'canonical-packet-receipt.json', text(compiled.receipt));
  } catch (error) {
    const receipt = failure(error.code || 'UNEXPECTED_PACKET_COMPILATION_FAILURE', error.field ?? null, error.sourceDocument ?? null, error.detail ?? error.message ?? null);
    if (outputDir) writeOutput(outputDir, 'canonical-packet-receipt.json', text(receipt));
    else process.stderr.write(text(receipt));
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
