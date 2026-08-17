#!/usr/bin/env node
import fs from 'node:fs';

export const SCHEMA = 'PAGES_DEPLOYMENT_RESILIENCE_RECEIPT_v1';
export const MAX_ARTIFACT_BYTES = 1_073_741_824;
export const DEFAULT_MAX_PROVIDER_RETRIES = 2;

function asInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.trunc(n) : fallback;
}

export function classifyPagesDeployment(input = {}) {
  const expectedHead = String(input.expectedHead || '');
  const observedHead = String(input.observedHead || expectedHead);
  const topology = String(input.topology || 'legacy');
  const artifactBytes = asInt(input.artifactBytes, 0);
  const providerHttpStatuses = Array.isArray(input.providerHttpStatuses)
    ? input.providerHttpStatuses.map(v => asInt(v, 0)).filter(Boolean)
    : [];
  const provider5xx = providerHttpStatuses.filter(v => v >= 500 && v <= 599);
  const providerFailureCount = provider5xx.length
    ? Math.max(asInt(input.providerFailureCount, provider5xx.length), provider5xx.length)
    : 0;
  const maxProviderRetries = Math.max(1, asInt(input.maxProviderRetries, DEFAULT_MAX_PROVIDER_RETRIES));
  const pagesBuildStatus = String(input.pagesBuildStatus || 'unknown');
  const dynamicRunConclusion = input.dynamicRunConclusion == null ? null : String(input.dynamicRunConclusion);
  const deploymentState = input.deploymentState == null ? null : String(input.deploymentState);
  const artifactLimitExceeded = artifactBytes > MAX_ARTIFACT_BYTES;
  const signals = {
    exactHeadMatch: !expectedHead || observedHead === expectedHead,
    topology,
    pagesBuildStatus,
    dynamicRunConclusion,
    deploymentState,
    artifactBytes,
    artifactLimitBytes: MAX_ARTIFACT_BYTES,
    artifactLimitExceeded,
    providerHttpStatuses,
    providerFailureCount,
    maxProviderRetries
  };

  let disposition = 'READY';
  let action = 'CONTINUE';
  let retryAuthorized = false;
  const repositoryMutationAuthorized = false;
  let reason = 'NO_BLOCKING_SIGNAL';

  if (!signals.exactHeadMatch) {
    disposition = 'REPOSITORY_DEFECT';
    action = 'STOP';
    reason = 'EXACT_HEAD_MISMATCH';
  } else if (!['legacy', 'workflow'].includes(topology)) {
    disposition = 'TOPOLOGY_FAILURE';
    action = 'STOP';
    reason = 'UNSUPPORTED_PAGES_TOPOLOGY';
  } else if (provider5xx.length) {
    if (providerFailureCount >= maxProviderRetries) {
      disposition = 'WAITING_EXTERNAL_SERVICE';
      action = 'PRESERVE_AND_WAIT';
      reason = 'PROVIDER_5XX_RETRY_BUDGET_EXHAUSTED';
    } else {
      disposition = 'RETRYABLE_PROVIDER_FAILURE';
      action = 'RETRY_EXACT_DEPLOYMENT';
      retryAuthorized = true;
      reason = 'PROVIDER_5XX_WITHIN_RETRY_BUDGET';
    }
  } else if (artifactLimitExceeded) {
    disposition = 'ARTIFACT_LIMIT_FAILURE';
    action = 'STOP_AND_REDUCE_ARTIFACT';
    reason = 'GITHUB_PAGES_ARTIFACT_EXCEEDS_1_GIB';
  } else if (pagesBuildStatus === 'errored' || pagesBuildStatus === 'timeout' || deploymentState === 'failure' || dynamicRunConclusion === 'failure') {
    disposition = 'REPOSITORY_DEFECT';
    action = 'STOP_AND_INSPECT';
    reason = 'NON_PROVIDER_DEPLOYMENT_FAILURE';
  }

  return {
    schema: SCHEMA,
    disposition,
    reason,
    action,
    retryAuthorized,
    repositoryMutationAuthorized,
    productMutationAuthorized: false,
    signals
  };
}

function assertCase(name, input, expected) {
  const actual = classifyPagesDeployment(input);
  if (actual.disposition !== expected) {
    throw new Error(`${name}: expected ${expected}, received ${actual.disposition}`);
  }
  if (actual.productMutationAuthorized !== false || actual.repositoryMutationAuthorized !== false) {
    throw new Error(`${name}: classifier must never create mutation authority`);
  }
  return { name, disposition: actual.disposition };
}

export function selfTest() {
  const head = '74e48531e73fa2de687ba6b42777891f28e5a9ba';
  const cases = [
    assertCase('ready', { expectedHead: head, observedHead: head, topology: 'legacy', artifactBytes: 128_000_000, pagesBuildStatus: 'built' }, 'READY'),
    assertCase('single-503', { expectedHead: head, observedHead: head, topology: 'legacy', providerHttpStatuses: [503], providerFailureCount: 1, maxProviderRetries: 2 }, 'RETRYABLE_PROVIDER_FAILURE'),
    assertCase('repeated-503-real-fixture', { expectedHead: head, observedHead: head, topology: 'legacy', artifactBytes: 1_192_627_948, providerHttpStatuses: [503], providerFailureCount: 2, maxProviderRetries: 2, dynamicRunConclusion: 'failure', pagesBuildStatus: 'building' }, 'WAITING_EXTERNAL_SERVICE'),
    assertCase('artifact-limit', { expectedHead: head, observedHead: head, topology: 'legacy', artifactBytes: 1_192_627_948, pagesBuildStatus: 'building' }, 'ARTIFACT_LIMIT_FAILURE'),
    assertCase('failed-without-5xx-over-limit', { expectedHead: head, observedHead: head, topology: 'legacy', artifactBytes: 1_192_627_948, dynamicRunConclusion: 'failure', providerFailureCount: 2, providerHttpStatuses: [] }, 'ARTIFACT_LIMIT_FAILURE'),
    assertCase('failed-without-5xx', { expectedHead: head, observedHead: head, topology: 'legacy', artifactBytes: 128_000_000, dynamicRunConclusion: 'failure', providerFailureCount: 2, providerHttpStatuses: [] }, 'REPOSITORY_DEFECT'),
    assertCase('timeout-without-5xx', { expectedHead: head, observedHead: head, topology: 'legacy', pagesBuildStatus: 'timeout', providerHttpStatuses: [] }, 'REPOSITORY_DEFECT'),
    assertCase('topology', { expectedHead: head, observedHead: head, topology: 'unknown' }, 'TOPOLOGY_FAILURE'),
    assertCase('head-mismatch', { expectedHead: head, observedHead: 'deadbeef', topology: 'legacy' }, 'REPOSITORY_DEFECT')
  ];
  return { schema: 'PAGES_DEPLOYMENT_RESILIENCE_SELF_TEST_v1', result: 'PASS_CLOSED', cases };
}

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--self-test')) {
    process.stdout.write(JSON.stringify(selfTest(), null, 2) + '\n');
    process.exit(0);
  }
  const inputPath = argValue('--input');
  const outputPath = argValue('--output');
  const input = inputPath ? JSON.parse(fs.readFileSync(inputPath, 'utf8')) : JSON.parse(fs.readFileSync(0, 'utf8'));
  const receipt = classifyPagesDeployment(input);
  const rendered = JSON.stringify(receipt, null, 2) + '\n';
  if (outputPath) fs.writeFileSync(outputPath, rendered);
  process.stdout.write(rendered);
}
