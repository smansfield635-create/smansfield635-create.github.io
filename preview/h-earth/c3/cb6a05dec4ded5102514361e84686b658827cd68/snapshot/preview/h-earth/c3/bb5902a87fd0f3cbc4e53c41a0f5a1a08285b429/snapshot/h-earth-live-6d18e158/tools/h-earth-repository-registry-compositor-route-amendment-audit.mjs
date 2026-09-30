import assert from 'node:assert/strict';
import { H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_AND_ROUTE_ENTRY_AMENDMENT_CANDIDATE as candidate } from '../h-earth-3d/registry/candidates/h-earth.repository-registry.compositor-and-route-entry-amendment.candidate.js';

const checks = [];
function check(name, fn) {
  fn();
  checks.push(name);
}

check('candidate identity', () => {
  assert.equal(candidate.amendmentId, 'H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_AND_ROUTE_ENTRY_AMENDMENT_CANDIDATE_v1');
  assert.equal(candidate.status, 'COMPLETE_CANDIDATE_NOT_ACCEPTED_NOT_CANONICAL_NOT_ACTIVE');
});

check('non-activation boundary', () => {
  assert.equal(candidate.mutationBoundary.acceptedBootstrapChanged, false);
  assert.equal(candidate.mutationBoundary.activeRegistryChanged, false);
  assert.equal(candidate.mutationBoundary.implementationSourceChanged, false);
  assert.equal(candidate.mutationBoundary.canonicalizationCreated, false);
});

check('two exact nodes', () => {
  assert.equal(candidate.nodes.length, 2);
  assert.deepEqual(candidate.nodes.map((node) => node.nodeId).sort(), [
    'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE',
    'H_EARTH_SHOWROOM_COMPOSITOR_FILE'
  ]);
});

check('two exact current paths', () => {
  assert.deepEqual(candidate.nodes.flatMap((node) => node.repositoryPaths).sort(), [
    '/showroom/globe/h-earth/compositor.js',
    '/showroom/globe/h-earth/index.html'
  ]);
});

check('current main occurrence identities', () => {
  const compositor = candidate.nodes.find((node) => node.nodeId === 'H_EARTH_SHOWROOM_COMPOSITOR_FILE');
  const route = candidate.nodes.find((node) => node.nodeId === 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE');
  assert.equal(compositor.repositoryOccurrences[0].commitSha, '465596de77ef0a28a7f779e06851130f4768e445');
  assert.equal(compositor.repositoryOccurrences[0].gitBlobSha, '480cd4519a4d3cc364be4b16acc7791aadb5071c');
  assert.equal(route.repositoryOccurrences[0].commitSha, '465596de77ef0a28a7f779e06851130f4768e445');
  assert.equal(route.repositoryOccurrences[0].gitBlobSha, 'c14600319946c45fca9b6d37e74033eb44680b05');
});

check('authority non-collapse', () => {
  const compositor = candidate.nodes.find((node) => node.nodeId === 'H_EARTH_SHOWROOM_COMPOSITOR_FILE');
  const route = candidate.nodes.find((node) => node.nodeId === 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE');
  assert(compositor.authorityLimitations.includes('NO_PACKET_002_PRODUCTION_AUTHORITY'));
  assert(compositor.authorityLimitations.includes('NO_GEOMETRY_CONSTRUCTION_OR_WEST_ADMISSION_AUTHORITY'));
  assert(route.authorityLimitations.includes('NO_WEST_ADMISSION_AUTHORITY'));
  assert(route.authorityLimitations.includes('NO_COMPOSITOR_OR_RENDERER_AUTHORITY'));
});

check('relation references resolve', () => {
  const localNodeIds = new Set(candidate.nodes.map((node) => node.nodeId));
  const knownExistingNodeIds = new Set([
    'H_EARTH_REPOSITORY_ARCHITECTURE',
    'H_EARTH_GEOMETRY_CONTINUITY_SYSTEM',
    'H_EARTH_ADMITTED_GEOMETRY_FRAME_FILE'
  ]);
  for (const relation of candidate.relations) {
    assert(localNodeIds.has(relation.fromNodeId) || knownExistingNodeIds.has(relation.fromNodeId));
    assert(localNodeIds.has(relation.toNodeId) || knownExistingNodeIds.has(relation.toNodeId));
    assert.equal(relation.authorityEffect, 'NO_AUTHORITY_TRANSFER_OR_INHERITANCE');
    assert.equal(relation.mutationEffect, 'NO_MUTATION_AUTHORITY_CREATED');
  }
});

check('evidence references resolve', () => {
  const evidenceIds = new Set(candidate.evidenceRecords.map((record) => record.evidenceId));
  for (const node of candidate.nodes) {
    for (const reference of node.evidenceReferences) assert(evidenceIds.has(reference));
  }
  for (const relation of candidate.relations) {
    for (const reference of relation.evidenceReferences) assert(evidenceIds.has(reference));
  }
});

const receipt = Object.freeze({
  auditId: 'H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_AND_ROUTE_ENTRY_AMENDMENT_AUDIT_v1',
  result: 'PASS',
  passedChecks: checks.length,
  failedChecks: 0,
  amendmentId: candidate.amendmentId,
  amendmentStatus: candidate.status,
  activeRegistryChanged: false,
  acceptedBootstrapChanged: false,
  implementationSourceChanged: false,
  nextBoundary: 'SUCCESSOR_REGISTRY_CANDIDATE_INTEGRATION_AND_DETERMINISTIC_IDENTITY'
});

console.log(JSON.stringify(receipt, null, 2));
