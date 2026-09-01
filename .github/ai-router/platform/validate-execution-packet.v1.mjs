#!/usr/bin/env node
import fs from 'node:fs';

const packetPath = process.argv[2];
if (!packetPath) {
  console.error('EXECUTION_PACKET_PATH_REQUIRED');
  process.exit(2);
}

const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
const fail = (code, detail = '') => {
  console.error(`${code}${detail ? `: ${detail}` : ''}`);
  process.exit(1);
};

if (packet.schema !== 'EXECUTION_PACKET_v1') fail('EXECUTION_PACKET_SCHEMA_INVALID');
if (!['TRANSPORT_BINDING', 'DIRECT_CONSTRUCTION'].includes(packet.mode)) fail('EXECUTION_PACKET_MODE_INVALID');
if (!/^[0-9a-f]{40}$/.test(String(packet.exactGoverningHead || ''))) fail('EXECUTION_PACKET_HEAD_INVALID');
if (!Array.isArray(packet.allowedPaths) || packet.allowedPaths.length === 0) fail('EXECUTION_PACKET_ALLOWED_PATHS_EMPTY');
if (!Array.isArray(packet.targetSymbols) || packet.targetSymbols.length === 0) fail('EXECUTION_PACKET_TARGETS_EMPTY');
if (!Array.isArray(packet.requiredMutations) || packet.requiredMutations.length === 0) fail('EXECUTION_PACKET_MUTATIONS_EMPTY');
if (!Array.isArray(packet.prohibitedActions) || packet.prohibitedActions.length === 0) fail('EXECUTION_PACKET_PROHIBITED_ACTIONS_EMPTY');
if (!packet.watchdog || packet.watchdog.observes !== 'REPOSITORY_VISIBLE_ALLOWED_PATH_MUTATION') fail('EXECUTION_PACKET_WATCHDOG_INVALID');
if (!Number.isInteger(packet.watchdog.deadlineSeconds) || packet.watchdog.deadlineSeconds < 30) fail('EXECUTION_PACKET_WATCHDOG_DEADLINE_INVALID');
if (packet.watchdog.timeoutDisposition !== 'DIRECT_CONSTRUCTION_TIMEOUT') fail('EXECUTION_PACKET_TIMEOUT_DISPOSITION_INVALID');
if (!packet.qualification || packet.qualification.mustRemainUnchanged !== true) fail('EXECUTION_PACKET_QUALIFICATION_MUTABLE');

const transport = packet.executionTransport;
if (!transport) fail('EXECUTION_TRANSPORT_REQUIRED');
for (const key of ['status', 'primary', 'targetRepository', 'targetBranch', 'supportsAllowedPaths', 'supportsLargeFiles', 'fallback', 'unboundDisposition']) {
  if (!(key in transport)) fail('EXECUTION_TRANSPORT_FIELD_MISSING', key);
}
if (transport.unboundDisposition !== 'EXECUTION_TRANSPORT_UNBOUND') fail('EXECUTION_TRANSPORT_DISPOSITION_INVALID');

if (transport.status === 'UNBOUND') {
  if (packet.mode !== 'TRANSPORT_BINDING') fail('EXECUTION_TRANSPORT_UNBOUND_MODE_INVALID');
  if (packet.nextRequiredEvent !== 'WRITE_TRANSPORT_BOUND') fail('EXECUTION_TRANSPORT_UNBOUND_NEXT_EVENT_INVALID');
  console.log(JSON.stringify({
    result: 'EXECUTION_TRANSPORT_UNBOUND',
    operationId: packet.operationId,
    targetRepository: transport.targetRepository,
    targetBranch: transport.targetBranch,
    primary: transport.primary,
    fallback: transport.fallback,
    handoffTarget: transport.handoffTarget || null
  }, null, 2));
  process.exit(3);
}

if (transport.status !== 'BOUND') fail('EXECUTION_TRANSPORT_STATUS_INVALID');
if (transport.supportsAllowedPaths !== true) fail('EXECUTION_TRANSPORT_PATH_SUPPORT_MISSING');
if (packet.mode !== 'DIRECT_CONSTRUCTION') fail('EXECUTION_TRANSPORT_BOUND_MODE_INVALID');
if (packet.nextRequiredEvent === 'WRITE_TRANSPORT_BOUND') fail('EXECUTION_TRANSPORT_BOUND_NEXT_EVENT_INVALID');

const allowed = new Set(packet.allowedPaths);
for (const target of packet.targetSymbols) {
  if (!allowed.has(target.path)) fail('EXECUTION_PACKET_TARGET_OUTSIDE_SCOPE', target.path);
  if (!Array.isArray(target.symbols) || target.symbols.length === 0) fail('EXECUTION_PACKET_TARGET_SYMBOLS_EMPTY', target.path);
  if (!Number.isInteger(target.maximumExactReads) || target.maximumExactReads < 0) fail('EXECUTION_PACKET_READ_LIMIT_INVALID', target.path);
}

const forbiddenDiscovery = new Set([
  'WEB_SEARCH',
  'BROAD_REPOSITORY_SEARCH',
  'ARCHITECTURE_SEARCH',
  'PRECEDENT_SEARCH',
  'WORKFLOW_DISCOVERY',
  'CAPABILITY_DISCOVERY',
  'RE_AUDIT',
  'REPEATED_SOURCE_FETCH'
]);
for (const action of forbiddenDiscovery) {
  if (!packet.prohibitedActions.includes(action)) fail('EXECUTION_PACKET_DISCOVERY_ESCAPE_PRESENT', action);
}

const exit = new Set(packet.exitConditions || []);
for (const required of ['CANDIDATE_READY', 'EXECUTION_TRANSPORT_UNBOUND', 'EXECUTION_TOOLING_BLOCKED', 'DIRECT_CONSTRUCTION_TIMEOUT', 'GOVERNING_HEAD_OVERLAP']) {
  if (!exit.has(required)) fail('EXECUTION_PACKET_EXIT_MISSING', required);
}

const normalized = {
  schema: packet.schema,
  operationId: packet.operationId,
  mode: packet.mode,
  exactGoverningHead: packet.exactGoverningHead,
  allowedPaths: packet.allowedPaths,
  targetCount: packet.targetSymbols.length,
  mutationCount: packet.requiredMutations.length,
  watchdogSeconds: packet.watchdog.deadlineSeconds,
  nextRequiredEvent: packet.nextRequiredEvent,
  executionTransport: {
    status: transport.status,
    primary: transport.primary,
    targetRepository: transport.targetRepository,
    targetBranch: transport.targetBranch,
    fallback: transport.fallback
  },
  candidateAuthority: packet.qualification.candidateAuthority
};

console.log(JSON.stringify({ result: 'EXECUTION_PACKET_VALID', packet: normalized }, null, 2));
