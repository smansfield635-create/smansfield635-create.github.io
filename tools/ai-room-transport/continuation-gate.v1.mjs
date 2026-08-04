#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stable, fail, assertObject, readJson, writeJson, parseArgs } from './lib.v1.mjs';

export function applyContinuationGate({ descriptor: rawDescriptor, validationResult: rawValidation }) {
  const descriptor = assertObject(rawDescriptor, 'CONTINUATION_DESCRIPTOR_INVALID');
  const validation = assertObject(rawValidation, 'CONTINUATION_VALIDATION_RESULT_INVALID');
  if (descriptor.schema !== 'AUTHORIZED_TOOLSET_DESCRIPTOR_v1') fail('CONTINUATION_DESCRIPTOR_SCHEMA_MISMATCH');
  if (validation.schema !== 'RECEIPT_VALIDATION_RESULT_v1') fail('CONTINUATION_VALIDATION_SCHEMA_MISMATCH');
  if (validation.descriptorId !== descriptor.descriptorId || validation.operationId !== descriptor.operationId) fail('CONTINUATION_IDENTITY_MISMATCH');
  if (validation.valid !== true || validation.validationDisposition === 'INVALID_RECEIPT_STOP') {
    return stable({
      schema: 'CONTINUATION_GATE_RESULT_v1',
      descriptorId: descriptor.descriptorId,
      operationId: descriptor.operationId,
      result: 'STOP',
      ruleApplied: 'MISSING_OR_INVALID_RECEIPT_STOP',
      reasonCodes: validation.reasonCodes ?? ['INVALID_RECEIPT']
    });
  }
  if (validation.validationDisposition === 'VALIDATED_PASS') {
    if (descriptor.continuationRule !== 'CONTINUE_ONLY_AFTER_VALIDATED_PASS') fail('CONTINUATION_RULE_NOT_RECOGNIZED');
    return stable({
      schema: 'CONTINUATION_GATE_RESULT_v1',
      descriptorId: descriptor.descriptorId,
      operationId: descriptor.operationId,
      result: 'CONTINUE',
      ruleApplied: descriptor.continuationRule,
      reasonCodes: ['VALIDATED_PASS']
    });
  }
  if (validation.validationDisposition === 'VALIDATED_FAILURE') {
    const executionDisposition = validation.executionDisposition;
    const rule = descriptor.failureDispositions?.[executionDisposition] ?? descriptor.failureDispositions?.MISSING_OR_INVALID_RECEIPT;
    if (!rule) fail('REGISTERED_FAILURE_DISPOSITION_MISSING', executionDisposition);
    return stable({
      schema: 'CONTINUATION_GATE_RESULT_v1',
      descriptorId: descriptor.descriptorId,
      operationId: descriptor.operationId,
      result: executionDisposition === 'COMMAND_NOT_EXECUTED_FAIL_CLOSED' ? 'STOP' : 'APPLY_REGISTERED_FAILURE_DISPOSITION',
      ruleApplied: rule,
      reasonCodes: [executionDisposition]
    });
  }
  fail('VALIDATION_DISPOSITION_UNRECOGNIZED', validation.validationDisposition);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  try {
    writeJson(args.output, applyContinuationGate({
      descriptor: readJson(args.descriptor),
      validationResult: readJson(args.validation)
    }));
  } catch (error) {
    writeJson(args.output, stable({
      schema: 'CONTINUATION_GATE_RESULT_v1',
      descriptorId: 'UNRESOLVED_DESCRIPTOR',
      operationId: 'UNRESOLVED_OPERATION',
      result: 'STOP',
      ruleApplied: 'FAIL_CLOSED_ON_GATE_ERROR',
      reasonCodes: [error.code ?? 'UNEXPECTED_CONTINUATION_GATE_ERROR'],
      detail: error.detail ?? error.message
    }));
    process.exitCode = 1;
  }
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
