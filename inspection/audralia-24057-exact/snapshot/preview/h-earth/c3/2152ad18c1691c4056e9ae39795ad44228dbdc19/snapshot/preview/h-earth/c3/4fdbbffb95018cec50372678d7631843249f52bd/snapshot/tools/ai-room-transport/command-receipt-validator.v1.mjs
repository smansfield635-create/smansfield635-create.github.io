#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  stable,
  hashObject,
  fail,
  assertObject,
  assertDigest,
  readJson,
  writeJson,
  parseArgs
} from './lib.v1.mjs';

function validateChangedPaths(descriptor, paths) {
  if (!Array.isArray(paths)) fail('RECEIPT_CHANGED_PATHS_INVALID');
  const allowed = descriptor.allowedMutationPaths ?? [];
  const prohibited = descriptor.prohibitedPaths ?? [];
  for (const changed of paths) {
    if (prohibited.some(prefix => changed === prefix || changed.startsWith(prefix))) fail('RECEIPT_PROHIBITED_PATH_OBSERVED', changed);
    if (!allowed.includes(changed)) fail('RECEIPT_UNAUTHORIZED_PATH_OBSERVED', changed);
  }
}

export function validateCommandReceipt({ descriptor: rawDescriptor, receipt: rawReceipt }) {
  const descriptor = assertObject(rawDescriptor, 'EXPECTED_DESCRIPTOR_INVALID');
  const receipt = assertObject(rawReceipt, 'COMMAND_RECEIPT_INVALID');
  if (descriptor.schema !== 'AUTHORIZED_TOOLSET_DESCRIPTOR_v1') fail('EXPECTED_DESCRIPTOR_SCHEMA_MISMATCH');
  if (receipt.schema !== 'COMMAND_EXECUTION_RECEIPT_v1') fail('COMMAND_RECEIPT_SCHEMA_MISMATCH');
  if (receipt.descriptorId !== descriptor.descriptorId) fail('COMMAND_RECEIPT_DESCRIPTOR_MISMATCH');
  if (receipt.operationId !== descriptor.operationId) fail('COMMAND_RECEIPT_OPERATION_MISMATCH');
  if (receipt.toolId !== descriptor.toolId && receipt.executionDisposition !== 'COMMAND_NOT_EXECUTED_FAIL_CLOSED') fail('COMMAND_RECEIPT_TOOL_MISMATCH');
  if (receipt.exactToolingHead !== descriptor.exactToolingHead && receipt.executionDisposition !== 'COMMAND_NOT_EXECUTED_FAIL_CLOSED') fail('COMMAND_RECEIPT_TOOLING_HEAD_MISMATCH');
  if (receipt.descriptorDigest != null && receipt.descriptorDigest !== hashObject(descriptor)) fail('COMMAND_RECEIPT_DESCRIPTOR_DIGEST_MISMATCH');
  assertDigest(receipt.commandDigest, 'COMMAND_RECEIPT_COMMAND_DIGEST_INVALID');
  assertDigest(receipt.inputDigest, 'COMMAND_RECEIPT_INPUT_DIGEST_INVALID');
  const allowedBackends = (descriptor.allowedBackends ?? []).map(entry => entry.backendId);
  if (receipt.executionDisposition !== 'COMMAND_NOT_EXECUTED_FAIL_CLOSED' && !allowedBackends.includes(receipt.selectedBackend)) fail('COMMAND_RECEIPT_BACKEND_MISMATCH');
  validateChangedPaths(descriptor, receipt.changedPaths);
  if (receipt.prohibitedSideEffectsObserved !== false) fail('COMMAND_RECEIPT_PROHIBITED_SIDE_EFFECT');
  const dispositions = [
    'COMMAND_EXECUTED_AND_PASSED',
    'COMMAND_EXECUTED_AND_FAILED',
    'COMMAND_NOT_EXECUTED_FAIL_CLOSED'
  ];
  if (!dispositions.includes(receipt.executionDisposition)) fail('COMMAND_RECEIPT_DISPOSITION_INVALID');
  if (receipt.executionDisposition === 'COMMAND_EXECUTED_AND_PASSED') {
    if (receipt.exitStatus !== 0) fail('COMMAND_RECEIPT_PASS_EXIT_STATUS_INVALID');
    if (!receipt.outputDigests || Object.keys(receipt.outputDigests).length === 0) fail('COMMAND_RECEIPT_PASS_OUTPUT_MISSING');
    if (receipt.commandPayloadSchema !== descriptor.canonicalOutputSchema.schemaId) fail('COMMAND_RECEIPT_PAYLOAD_SCHEMA_MISMATCH');
  }
  if (receipt.executionDisposition === 'COMMAND_EXECUTED_AND_FAILED' && receipt.exitStatus === 0) fail('COMMAND_RECEIPT_FAILURE_EXIT_STATUS_INVALID');
  if (receipt.executionDisposition === 'COMMAND_NOT_EXECUTED_FAIL_CLOSED' && receipt.exitStatus !== null) fail('COMMAND_RECEIPT_NONEXECUTION_EXIT_STATUS_INVALID');
  const passed = receipt.executionDisposition === 'COMMAND_EXECUTED_AND_PASSED';
  return stable({
    schema: 'RECEIPT_VALIDATION_RESULT_v1',
    descriptorId: descriptor.descriptorId,
    operationId: descriptor.operationId,
    valid: true,
    validationDisposition: passed ? 'VALIDATED_PASS' : 'VALIDATED_FAILURE',
    executionDisposition: receipt.executionDisposition,
    reasonCodes: [passed ? 'COMMAND_RECEIPT_MATCHES_EXPECTED_DESCRIPTOR' : 'STRUCTURALLY_VALID_FAILURE_RECEIPT'],
    descriptorDigest: hashObject(descriptor),
    commandReceiptDigest: hashObject(receipt)
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const descriptor = readJson(args.descriptor);
  const receipt = readJson(args.receipt);
  try {
    writeJson(args.output, validateCommandReceipt({ descriptor, receipt }));
  } catch (error) {
    writeJson(args.output, stable({
      schema: 'RECEIPT_VALIDATION_RESULT_v1',
      descriptorId: descriptor?.descriptorId ?? 'UNRESOLVED_DESCRIPTOR',
      operationId: descriptor?.operationId ?? 'UNRESOLVED_OPERATION',
      valid: false,
      validationDisposition: 'INVALID_RECEIPT_STOP',
      executionDisposition: receipt?.executionDisposition ?? null,
      reasonCodes: [error.code ?? 'UNEXPECTED_RECEIPT_VALIDATION_ERROR'],
      detail: error.detail ?? error.message
    }));
    process.exitCode = 1;
  }
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
