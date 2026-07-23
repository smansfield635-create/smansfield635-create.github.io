import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  H_EARTH_REPOSITORY_REGISTRY_DISCOVERY_DESCRIPTOR,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryCompositeMembership,
  getHEarthRepositoryRegistryDependencyClosure,
  resolveHEarthRepositoryRegistryLifecycle,
  buildHEarthRepositoryArchitectureSnapshot,
  evaluateHEarthRepositoryRegistryOperation,
  auditHEarthRepositoryRegistryStructure
} from '../h-earth-3d/registry/h-earth.repository-registry.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidatePath = path.join(
  repoRoot,
  'h-earth-3d/registry/h-earth.repository-registry.candidate.js'
);
const bootstrapPath = path.join(
  repoRoot,
  'h-earth-3d/registry/h-earth.repository-registry.bootstrap.json'
);

const candidateBytes = fs.readFileSync(candidatePath);
const bootstrap = JSON.parse(fs.readFileSync(bootstrapPath, 'utf8'));
const sha256 = crypto.createHash('sha256').update(candidateBytes).digest('hex');
const gitBlob = crypto
  .createHash('sha1')
  .update(Buffer.concat([
    Buffer.from(`blob ${candidateBytes.length}\0`, 'utf8'),
    candidateBytes
  ]))
  .digest('hex');

const instance = getHEarthRepositoryRegistryInstance();
const structureAudit = auditHEarthRepositoryRegistryStructure();
const packet002Path = '/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js';
const pathResolution = resolveHEarthRepositoryRegistryPath(packet002Path);
const occurrenceResolution = resolveHEarthRepositoryRegistryOccurrence({
  path: packet002Path,
  commitSha: '81d6d9e73774f61d298f73a28a1fe01a6f05798f',
  gitBlobSha: 'c31412854dbce91bc6b378f345976fff5431e671'
});
const adapter = getHEarthRepositoryRegistryNode('H_EARTH_GATE_B_WEST_ADAPTER_FILE');
const kernelMembership = getHEarthRepositoryRegistryCompositeMembership(
  'H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT'
);
const packetClosure = getHEarthRepositoryRegistryDependencyClosure(
  'H_EARTH_PACKET_001_SOURCE_RESOLUTION_FILE'
);
const lifecycle = resolveHEarthRepositoryRegistryLifecycle({ path: packet002Path });
const adapterSnapshot = buildHEarthRepositoryArchitectureSnapshot({
  nodeIds: ['H_EARTH_GATE_B_WEST_ADAPTER_FILE'],
  includeNeighborhoodDepth: 2
});
const readOnlyEvaluation = evaluateHEarthRepositoryRegistryOperation({
  operationId: 'AUDIT_READ_ONLY_PACKET_002_SCOPE',
  paths: [packet002Path],
  mutationRequested: false,
  requestedMutationScope: 'READ_ONLY_INSPECTION',
  includeNeighborhoodDepth: 2
});
const mutationEvaluation = evaluateHEarthRepositoryRegistryOperation({
  operationId: 'AUDIT_MUTATION_MUST_STOP',
  paths: [packet002Path],
  mutationRequested: true,
  requestedMutationScope: 'EXPLICIT_PATH_SET_ONLY',
  includeNeighborhoodDepth: 1
});
const observedCardinalNodes = findHEarthRepositoryRegistryNodes({
  hasUnresolvedFields: true,
  lifecycleStatus: 'CANDIDATE'
});

const checks = {
  candidateByteCount: candidateBytes.length === 140320,
  candidateSha256:
    sha256 === '5c71aba5ff60f7d8838fa4571ec18e72eafe04f01130ad146de4376279735dfe',
  candidateGitBlob:
    gitBlob === '10ab7b203e03fde419e526d0cce2c0af42860911',
  bootstrapCandidatePath:
    bootstrap.candidate.path ===
      '/h-earth-3d/registry/h-earth.repository-registry.candidate.js',
  bootstrapFacadePath:
    bootstrap.consumerFacade.path ===
      '/h-earth-3d/registry/h-earth.repository-registry.js',
  bootstrapNotAccepted: bootstrap.accepted === false,
  bootstrapNotCanonical: bootstrap.canonical === false,
  discoveryIdentity:
    H_EARTH_REPOSITORY_REGISTRY_DISCOVERY_DESCRIPTOR.registryId ===
      'H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1',
  registryCandidateStatus: instance.status === 'COMPLETE_CANDIDATE',
  registryNotAccepted: instance.accepted === false,
  registryNodeCount: instance.nodes.length === 15,
  registryRelationCount: instance.relations.length === 32,
  registryEvidenceCount: instance.evidenceRecords.length === 14,
  structuralAuditPass: structureAudit.pass === true,
  pathResolutionPass:
    pathResolution.resolved === true && pathResolution.nodes.length === 1,
  occurrenceResolutionPass:
    occurrenceResolution.resolved === true && occurrenceResolution.matches.length === 1,
  adapterOrchestrationOnly: adapter?.authorityClass === 'ORCHESTRATION_ONLY',
  kernelMembershipIncludesFiveRelations:
    kernelMembership.memberRelations.length === 5,
  packetClosureIncludesPacket002:
    packetClosure.nodes.some(
      (node) => node.nodeId === 'H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE'
    ),
  lifecycleResolutionPass:
    lifecycle.resolved === true && lifecycle.nodes.length === 1,
  adapterSnapshotHasMultipleLayers:
    adapterSnapshot.nodes.length >= 3 &&
    adapterSnapshot.evidence.length >= 3 &&
    adapterSnapshot.layers.mutationAndStopping.length >= 3,
  readOnlyOperationPermitted:
    readOnlyEvaluation.operationPermitted === true &&
    readOnlyEvaluation.mutationAuthorized === false &&
    readOnlyEvaluation.stoppingRequired === false,
  mutationOperationStopped:
    mutationEvaluation.operationPermitted === false &&
    mutationEvaluation.mutationAuthorized === false &&
    mutationEvaluation.stoppingRequired === true &&
    mutationEvaluation.issues.includes('REGISTRY_DOES_NOT_AUTHORIZE_MUTATION'),
  unresolvedFieldsReported: observedCardinalNodes.length > 0,
  outputsFrozen:
    Object.isFrozen(instance) &&
    Object.isFrozen(adapterSnapshot) &&
    Object.isFrozen(readOnlyEvaluation)
};

const failed = Object.entries(checks)
  .filter(([, value]) => value !== true)
  .map(([name]) => name);

const receipt = Object.freeze({
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_INSTALLATION_AND_INTEGRATION_AUDIT_v1',
  result: failed.length === 0 ? 'PASS' : 'FAIL',
  checks,
  totalChecks: Object.keys(checks).length,
  passedChecks: Object.keys(checks).length - failed.length,
  failedChecks: failed,
  candidate: Object.freeze({
    byteCount: candidateBytes.length,
    sha256,
    gitBlob
  }),
  registry: Object.freeze({
    registryId: instance.registryId,
    registryVersion: instance.registryVersion,
    schemaId: instance.schemaId,
    schemaVersion: instance.schemaVersion,
    status: instance.status,
    accepted: instance.accepted,
    nodeCount: instance.nodes.length,
    relationCount: instance.relations.length,
    evidenceCount: instance.evidenceRecords.length
  }),
  boundaries: Object.freeze({
    sourceAuthorityCreated: false,
    mutationAuthorityCreated: false,
    mergeAuthorityCreated: false,
    workflowEnforcementCreated: false,
    runtimeActivationCreated: false,
    productionClaimCreated: false
  })
});

assert.deepEqual(failed, []);
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
