#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { executeBridge } from '../../../tools/pre-registration-intake-bridge/canonical-intake-execution-bridge.v1.mjs';

export const MARKER = 'TRUSTED_INTAKE_FIXTURE_V1';
export const ONLY_FIXTURE_ID = 'METHODS_MODELS_FROZEN_CANDIDATE_INTAKE_20260813_V1';
export const FIXTURE_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/methods-models-frozen-candidate-intake.v1.json');
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])])) : value;
const canonical = value => JSON.stringify(stable(value));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const fail = code => { const error = new Error(code); error.code = code; throw error; };

export function parseMarker(body) {
  const normalized = String(body ?? '').trim().split(/\s+/);
  if (normalized.length !== 2 || normalized[0] !== MARKER) fail('LOW_ENTROPY_MARKER_INVALID');
  if (normalized[1] !== ONLY_FIXTURE_ID) fail('FIXTURE_SELECTOR_NOT_ALLOWED');
  return normalized[1];
}

export function loadFrozenFixture(selector, file = FIXTURE_PATH) {
  if (selector !== ONLY_FIXTURE_ID) fail('FIXTURE_SELECTOR_NOT_ALLOWED');
  const fixture = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (fixture.schema !== 'TRUSTED_CANONICAL_INTAKE_FIXTURE_v1') fail('FIXTURE_SCHEMA_MISMATCH');
  if (fixture.fixtureId !== ONLY_FIXTURE_ID || fixture.issue !== 977) fail('FIXTURE_IDENTITY_MISMATCH');
  if (fixture.repository !== 'smansfield635-create/smansfield635-create.github.io') fail('FIXTURE_REPOSITORY_MISMATCH');
  if (fixture.exactGoverningHead !== 'e0c69d3f2581b0917dab882f5750a45403a523b9') fail('FIXTURE_GOVERNING_HEAD_MISMATCH');
  if (fixture.operationRequest?.exactGoverningHead !== fixture.exactGoverningHead || fixture.constructionProcedure?.exactGoverningHead !== fixture.exactGoverningHead) fail('FIXTURE_INTERNAL_HEAD_MISMATCH');
  if (!Array.isArray(fixture.operationRequest?.allowedPaths) || fixture.operationRequest.allowedPaths.length !== 10) fail('FIXTURE_ALLOWED_PATH_COUNT_MISMATCH');
  if (canonical(fixture.operationRequest.allowedPaths) !== canonical(fixture.constructionProcedure?.exactAllowedRepositoryPaths)) fail('FIXTURE_SCOPE_MISMATCH');
  if (fixture.operationRequest?.requestingAuthority?.mergeAuthority !== false || fixture.operationRequest?.executingRole?.mayMerge !== false) fail('FIXTURE_MERGE_AUTHORITY_INVALID');
  return stable(fixture);
}

export function bridgeRequestFromFixture(fixture) {
  const request = stable({
    schema: 'PRE_REGISTRATION_INTAKE_BRIDGE_REQUEST_v1',
    requestId: fixture.fixtureId,
    repository: fixture.repository,
    exactGoverningHead: fixture.exactGoverningHead,
    operationRequest: fixture.operationRequest,
    constructionProcedure: fixture.constructionProcedure,
    requestNonce: fixture.requestNonce,
    executionHolder: fixture.executionHolder
  });
  if (canonical(request.operationRequest) !== canonical(fixture.operationRequest)) fail('OPERATION_REQUEST_REWRITE_DETECTED');
  if (canonical(request.constructionProcedure) !== canonical(fixture.constructionProcedure)) fail('CONSTRUCTION_PROCEDURE_REWRITE_DETECTED');
  return request;
}

export async function executeTrustedFixture({commentBody, outputPath}) {
  const selector = parseMarker(commentBody);
  const fixture = loadFrozenFixture(selector);
  const bridgeRequest = bridgeRequestFromFixture(fixture);
  const operationDigestBefore = sha256(canonical(fixture.operationRequest));
  const procedureDigestBefore = sha256(canonical(fixture.constructionProcedure));
  const bridgeReceipt = await executeBridge(bridgeRequest, {inputPath:FIXTURE_PATH, outputPath});
  if (bridgeReceipt?.canonicalGateExecuted === true) {
    if (bridgeReceipt.requestDigest !== operationDigestBefore) fail('CANONICAL_GATE_OPERATION_DIGEST_MISMATCH');
    if (bridgeReceipt.procedureDigest !== procedureDigestBefore) fail('CANONICAL_GATE_PROCEDURE_DIGEST_MISMATCH');
  }
  const receipt = stable({
    schema: 'TRUSTED_CANONICAL_INTAKE_CARRIER_RECEIPT_v1',
    result: bridgeReceipt?.result === 'CANONICAL_RECEIPT_RETURNED' ? 'CANONICAL_RECEIPT_PRESERVED' : 'FAIL_CLOSED',
    marker: MARKER,
    fixtureId: fixture.fixtureId,
    fixtureSha256: sha256(canonical(fixture)),
    operationRequestSha256: operationDigestBefore,
    constructionProcedureSha256: procedureDigestBefore,
    exactGoverningHead: fixture.exactGoverningHead,
    allowedPathCount: fixture.operationRequest.allowedPaths.length,
    mergeAuthority: false,
    admissionSemanticsDuplicated: false,
    canonicalGateExecuted: bridgeReceipt?.canonicalGateExecuted === true,
    canonicalGatePath: bridgeReceipt?.canonicalGatePath ?? null,
    canonicalGateBlob: bridgeReceipt?.canonicalGateBlob ?? null,
    admissionResultRewritten: bridgeReceipt?.admissionResultRewritten ?? false,
    canonicalReceiptSha256: bridgeReceipt?.canonicalReceiptSha256 ?? null,
    canonicalReceiptJson: bridgeReceipt?.canonicalReceiptJson ?? null,
    bridgeReceipt
  });
  fs.mkdirSync(path.dirname(outputPath), {recursive:true});
  fs.writeFileSync(outputPath, JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}

async function main() {
  const outputPath = process.env.TRUSTED_INTAKE_OUTPUT || path.join(process.env.RUNNER_TEMP || '/tmp', 'trusted-intake-carrier-receipt.json');
  const receipt = await executeTrustedFixture({commentBody:process.env.COMMENT_BODY, outputPath});
  if (receipt.result !== 'CANONICAL_RECEIPT_PRESERVED') process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { process.stderr.write(JSON.stringify({errorCode:error.code ?? 'UNEXPECTED_FAILURE',detail:error.message}) + '\n'); process.exitCode=1; });
