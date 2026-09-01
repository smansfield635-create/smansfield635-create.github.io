#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stable, fail, writeJson, parseArgs } from './lib.v1.mjs';
import { validateExecutionRequest } from './toolset-resolver.v1.mjs';

const START = '<!-- AI_ROOM_EXECUTION_REQUEST_V1';
const END = 'AI_ROOM_EXECUTION_REQUEST_V1 -->';

export function parseTransportBody(body) {
  if (typeof body !== 'string' || body.length === 0) fail('TRANSPORT_BODY_EMPTY');
  const starts = body.split(START).length - 1;
  const ends = body.split(END).length - 1;
  if (starts !== 1 || ends !== 1) fail('TRANSPORT_REQUEST_ENVELOPE_CARDINALITY_INVALID', `${starts}:${ends}`);
  const startIndex = body.indexOf(START) + START.length;
  const endIndex = body.indexOf(END, startIndex);
  if (endIndex < startIndex) fail('TRANSPORT_REQUEST_ENVELOPE_INVALID');
  const payload = body.slice(startIndex, endIndex).trim();
  let request;
  try { request = JSON.parse(payload); }
  catch (error) { fail('TRANSPORT_REQUEST_JSON_INVALID', error.message); }
  return validateExecutionRequest(request);
}

export function parseTransportJson(text) {
  let request;
  try { request = JSON.parse(text); }
  catch (error) { fail('TRANSPORT_REQUEST_JSON_INVALID', error.message); }
  return validateExecutionRequest(request);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const modes = [args['body-file'] != null, args['json-file'] != null].filter(Boolean).length;
  if (modes !== 1) fail('EXACTLY_ONE_TRANSPORT_INPUT_MODE_REQUIRED');
  const text = fs.readFileSync(path.resolve(args['body-file'] ?? args['json-file']), 'utf8');
  const request = args['body-file'] ? parseTransportBody(text) : parseTransportJson(text);
  writeJson(args.output, stable(request));
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try { main(); }
  catch (error) {
    const args = (() => { try { return parseArgs(process.argv.slice(2)); } catch { return {}; } })();
    const failure = stable({
      schema: 'AI_ROOM_EXECUTION_TRANSPORT_PARSE_FAILURE_v1',
      result: 'FAIL_CLOSED',
      errorCode: error.code ?? 'UNEXPECTED_TRANSPORT_PARSE_ERROR',
      detail: error.detail ?? error.message
    });
    if (args.output) writeJson(args.output, failure);
    else process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
    process.exitCode = 1;
  }
}
