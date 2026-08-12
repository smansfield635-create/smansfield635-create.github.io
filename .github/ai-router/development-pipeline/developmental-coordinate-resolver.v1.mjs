import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const defaultProtocol = JSON.parse(fs.readFileSync(fileURLToPath(new URL('./developmental-coordinate-protocol.v1.json', import.meta.url)), 'utf8'));

const clone = value => JSON.parse(JSON.stringify(value));

function requireString(value, label) {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`INVALID_${label}`);
  return value;
}

function requirePositiveInteger(value, label) {
  if (!Number.isInteger(value) || value < 1) throw new Error(`INVALID_${label}`);
  return value;
}

export function classifyNewsRole(primaryFunction, protocol = defaultProtocol) {
  requireString(primaryFunction, 'PRIMARY_FUNCTION');
  const role = protocol?.news?.roles?.[primaryFunction];
  if (!role) throw new Error(`UNRESOLVED_NEWS_ROLE:${primaryFunction}`);
  return role;
}

export function synchronizationDepth(prerequisiteDomains) {
  if (!Array.isArray(prerequisiteDomains)) throw new Error('INVALID_PREREQUISITE_DOMAINS');
  const unique = new Set(prerequisiteDomains.map(value => requireString(value, 'PREREQUISITE_DOMAIN')));
  return Math.max(1, unique.size);
}

export function fibonacciBandForDepth(depth, protocol = defaultProtocol) {
  requirePositiveInteger(depth, 'SYNCHRONIZATION_DEPTH');
  const bands = protocol?.fibonacci?.bands;
  if (!Array.isArray(bands) || bands.length === 0) throw new Error('INVALID_FIBONACCI_BANDS');
  for (const band of bands) if (band >= depth) return `F${band}`;
  throw new Error(`SYNCHRONIZATION_DEPTH_EXCEEDS_FROZEN_BANDS:${depth}`);
}

export function resolveDevelopmentalCoordinate(event, protocol = defaultProtocol) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw new Error('INVALID_EVENT');
  const eventId = requireString(event.eventId, 'EVENT_ID');
  const C = requireString(event.acceptedCenter, 'ACCEPTED_CENTER');
  const N = classifyNewsRole(event.primaryFunction, protocol);
  const depth = synchronizationDepth(event.prerequisiteDomains);
  const F = fibonacciBandForDepth(depth, protocol);
  const r = requirePositiveInteger(event.localRank, 'LOCAL_RANK');
  const D = requireString(event.dependencyDomain, 'DEPENDENCY_DOMAIN');
  const L = requireString(event.lifecycleState, 'LIFECYCLE_STATE');
  const E = requireString(event.evidenceState, 'EVIDENCE_STATE');
  const historicalOutcome = requireString(event.historicalOutcome, 'HISTORICAL_OUTCOME');
  const contradictions = Array.isArray(event.contradictions) ? clone(event.contradictions) : [];

  return {
    schema: 'DEVELOPMENTAL_COORDINATE_RECEIPT_v1',
    eventId,
    sourcePr: Number.isInteger(event.pr) ? event.pr : null,
    sourceGeneration: Number.isInteger(event.generation) ? event.generation : null,
    coordinate: { C, N, F, r, D, L, E },
    synchronizationDepth: depth,
    nativePrimaryFunction: event.primaryFunction,
    historicalOutcome,
    contradictions,
    residuePresent: contradictions.length > 0,
    nextAction: requireString(event.nextAction, 'NEXT_ACTION'),
    preservation: {
      historicalOutcomeChanged: false,
      contradictionLossCount: 0,
      carryForwardAuthority: 'NONE',
      gateOverrides: [],
      authorityCreated: false,
      sourceMutationPerformed: false
    }
  };
}

export function resolveCorpus(events, protocol = defaultProtocol) {
  if (!Array.isArray(events)) throw new Error('INVALID_EVENT_CORPUS');
  return events.map(event => resolveDevelopmentalCoordinate(event, protocol));
}
