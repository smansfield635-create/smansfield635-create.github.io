#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  stable,
  fail,
  assertObject,
  assertArray,
  assertClosedKeys,
  readJson,
  writeJson,
  parseArgs
} from './lib.v1.mjs';

const CAPABILITY_FIELDS = ['schema', 'availableBackends', 'availableWorkflowPaths', 'availableToolingHeads'];

export function validateCapabilities(capabilities) {
  assertClosedKeys(capabilities, CAPABILITY_FIELDS, CAPABILITY_FIELDS, 'CAPABILITY_RECEIPT');
  if (capabilities.schema !== 'AVAILABLE_CAPABILITY_RECEIPT_v1') fail('CAPABILITY_RECEIPT_SCHEMA_MISMATCH');
  for (const field of ['availableBackends', 'availableWorkflowPaths', 'availableToolingHeads']) assertArray(capabilities[field], `CAPABILITY_${field.toUpperCase()}_INVALID`);
  return stable(capabilities);
}

function backendSatisfied(backend, descriptor, capabilities) {
  if (!capabilities.availableBackends.includes(backend.backendId)) return false;
  if (!capabilities.availableToolingHeads.includes(descriptor.exactToolingHead)) return false;
  if (backend.backendId === 'GITHUB_ACTIONS_CLEAN_EXECUTION' && !capabilities.availableWorkflowPaths.includes(descriptor.workflowPath)) return false;
  if (backend.backendId === 'CONNECTED_GITHUB_METADATA_INSPECTION') return false;
  return true;
}

export function selectBackend({ resolutionReceipt, capabilities: rawCapabilities }) {
  assertObject(resolutionReceipt, 'RESOLUTION_RECEIPT_INVALID');
  if (resolutionReceipt.schema !== 'AUTHORIZED_TOOLSET_RESOLUTION_RECEIPT_v1' || resolutionReceipt.result !== 'EXACTLY_ONE_AUTHORIZED_DESCRIPTOR_RESOLVED') fail('RESOLUTION_RECEIPT_NOT_EXECUTABLE');
  const descriptor = assertObject(resolutionReceipt.descriptor, 'RESOLUTION_DESCRIPTOR_MISSING');
  const capabilities = validateCapabilities(rawCapabilities);
  const eligible = assertArray(descriptor.allowedBackends, 'DESCRIPTOR_BACKENDS_INVALID')
    .filter(backend => backendSatisfied(backend, descriptor, capabilities))
    .sort((left, right) => Number(right.priority ?? 0) - Number(left.priority ?? 0));
  if (eligible.length === 0) fail('NO_AUTHORIZED_BACKEND_AVAILABLE');
  const highestPriority = Number(eligible[0].priority ?? 0);
  const finalists = eligible.filter(backend => Number(backend.priority ?? 0) === highestPriority);
  if (finalists.length !== 1) fail('AUTHORIZED_BACKEND_SELECTION_AMBIGUOUS');
  const selected = finalists[0];
  return stable({
    schema: 'EXECUTION_BACKEND_SELECTION_RECEIPT_v1',
    result: 'ONE_AUTHORIZED_BACKEND_SELECTED',
    requestId: resolutionReceipt.requestId,
    operationId: resolutionReceipt.operationId,
    descriptorId: resolutionReceipt.descriptorId,
    exactToolingHead: descriptor.exactToolingHead,
    selectedBackend: selected.backendId,
    selectedPriority: highestPriority,
    requirements: selected.requirements ?? [],
    workflowPath: descriptor.workflowPath
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = selectBackend({
    resolutionReceipt: readJson(args.resolution),
    capabilities: readJson(args.capabilities)
  });
  writeJson(args.output, result);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    main();
  } catch (error) {
    const args = (() => { try { return parseArgs(process.argv.slice(2)); } catch { return {}; } })();
    const failure = stable({
      schema: 'EXECUTION_BACKEND_SELECTION_FAILURE_v1',
      result: 'FAIL_CLOSED',
      errorCode: error.code ?? 'UNEXPECTED_BACKEND_SELECTOR_ERROR',
      detail: error.detail ?? error.message
    });
    if (args.output) writeJson(args.output, failure);
    else process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
    process.exitCode = 1;
  }
}
