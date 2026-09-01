/**
 * /showroom/globe/h-earth/diagnostic/repository-registry-projection.js
 * Read-only diagnostic projection of the installed repository-registry candidate.
 * This file creates no route activation, mutation authority, validation claim,
 * renderer authority, production claim, or canonical registry status.
 */

import {
  H_EARTH_REPOSITORY_REGISTRY_DISCOVERY_DESCRIPTOR,
  H_EARTH_REPOSITORY_REGISTRY_CONSUMER_BOUNDARY,
  getHEarthRepositoryRegistryInstance,
  findHEarthRepositoryRegistryNodes,
  findHEarthRepositoryRegistryRelations,
  resolveHEarthRepositoryRegistryPath,
  buildHEarthRepositoryArchitectureSnapshot,
  evaluateHEarthRepositoryRegistryOperation,
  auditHEarthRepositoryRegistryStructure
} from '../../../../h-earth-3d/registry/h-earth.repository-registry.js';

const instance = getHEarthRepositoryRegistryInstance();
const structuralAudit = auditHEarthRepositoryRegistryStructure();

export const H_EARTH_REPOSITORY_REGISTRY_DIAGNOSTIC_PROJECTION = Object.freeze({
  projectionId: 'H_EARTH_REPOSITORY_REGISTRY_DIAGNOSTIC_PROJECTION_v1',
  registryId: instance.registryId,
  registryVersion: instance.registryVersion,
  schemaId: instance.schemaId,
  schemaVersion: instance.schemaVersion,
  status: instance.status,
  accepted: instance.accepted,
  scope: instance.scope,
  nodeCount: instance.nodes.length,
  relationCount: instance.relations.length,
  evidenceCount: instance.evidenceRecords.length,
  unresolvedFields: instance.unresolvedFields,
  structuralAudit,
  discovery: H_EARTH_REPOSITORY_REGISTRY_DISCOVERY_DESCRIPTOR,
  boundary: H_EARTH_REPOSITORY_REGISTRY_CONSUMER_BOUNDARY,
  routeActivationCreated: false,
  runtimeActivationCreated: false,
  validationClaimCreated: false,
  productionClaimCreated: false
});

export function inspectHEarthRepositoryRegistryDiagnosticProjection() {
  return H_EARTH_REPOSITORY_REGISTRY_DIAGNOSTIC_PROJECTION;
}

export function queryHEarthRepositoryRegistryDiagnosticProjection(query = {}) {
  return Object.freeze({
    nodes: findHEarthRepositoryRegistryNodes(query.nodes ?? {}),
    relations: findHEarthRepositoryRegistryRelations(query.relations ?? {}),
    path: query.repositoryPath
      ? resolveHEarthRepositoryRegistryPath(query.repositoryPath)
      : null,
    snapshot: buildHEarthRepositoryArchitectureSnapshot({
      nodeIds: query.nodeIds ?? [],
      paths: query.paths ?? [],
      relationIds: query.relationIds ?? [],
      includeNeighborhoodDepth: query.includeNeighborhoodDepth ?? 1
    })
  });
}

export function evaluateHEarthRepositoryRegistryDiagnosticOperation(input = {}) {
  return evaluateHEarthRepositoryRegistryOperation(input);
}

export default H_EARTH_REPOSITORY_REGISTRY_DIAGNOSTIC_PROJECTION;
