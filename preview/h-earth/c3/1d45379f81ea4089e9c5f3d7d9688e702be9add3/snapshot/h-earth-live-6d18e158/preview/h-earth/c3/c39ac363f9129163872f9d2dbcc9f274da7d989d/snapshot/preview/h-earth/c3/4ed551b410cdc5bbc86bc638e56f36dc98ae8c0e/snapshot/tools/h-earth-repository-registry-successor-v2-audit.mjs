import crypto from 'node:crypto';
import fs from 'node:fs';

const candidatePath = new URL('../h-earth-3d/registry/candidates/h-earth.repository-registry.successor.candidate.js', import.meta.url);
const moduleRecord = await import(candidatePath.href);
const { identity, registrySchema } = moduleRecord;

const registry = Object.values(moduleRecord).find((value) =>
  value && typeof value === 'object' && Array.isArray(value.nodes) && Array.isArray(value.relations) && Array.isArray(value.evidenceRecords)
);

const failures = [];
const checks = [];
const check = (name, condition, details = null) => {
  checks.push({ name, pass: Boolean(condition), details });
  if (!condition) failures.push(name);
};

check('SUCCESSOR_IDENTITY_PRESENT', identity?.successorId === 'H_EARTH_REPOSITORY_REGISTRY_SUCCESSOR_CANDIDATE_v2');
check('SUCCESSOR_VERSION_PRESENT', identity?.registryVersion === '1.0.0-candidate.2');
check('SUCCESSOR_NONCANONICAL', identity?.canonical === false);
check('SUCCESSOR_NOT_ACTIVE', identity?.activeRegistryChanged === false);
check('SUCCESSOR_NOT_ACCEPTED', identity?.status === 'COMPLETE_CANDIDATE_NOT_ACCEPTED_NOT_CANONICAL_NOT_ACTIVE');
check('REGISTRY_INSTANCE_DISCOVERED', Boolean(registry));
check('SCHEMA_VERSION_CONSTRAINT_RENEWED', registrySchema?.properties?.registryVersion?.const === '1.0.0-candidate.2');
check('REGISTRY_VERSION_RENEWED', registry?.registryVersion === '1.0.0-candidate.2');

if (registry) {
  const nodeIds = registry.nodes.map((node) => node.nodeId);
  const relationIds = registry.relations.map((relation) => relation.relationId);
  const evidenceIds = registry.evidenceRecords.map((record) => record.evidenceId);
  const nodeSet = new Set(nodeIds);
  const relationSet = new Set(relationIds);
  const evidenceSet = new Set(evidenceIds);

  check('NODE_IDS_UNIQUE', nodeSet.size === nodeIds.length);
  check('RELATION_IDS_UNIQUE', relationSet.size === relationIds.length);
  check('EVIDENCE_IDS_UNIQUE', evidenceSet.size === evidenceIds.length);

  const compositor = registry.nodes.find((node) => node.nodeId === 'H_EARTH_SHOWROOM_COMPOSITOR_FILE');
  const routeEntry = registry.nodes.find((node) => node.nodeId === 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE');
  check('COMPOSITOR_NODE_PRESENT', Boolean(compositor));
  check('ROUTE_ENTRY_NODE_PRESENT', Boolean(routeEntry));
  check('COMPOSITOR_PATH_EXACT', compositor?.repositoryPaths?.includes('/showroom/globe/h-earth/compositor.js'));
  check('ROUTE_ENTRY_PATH_EXACT', routeEntry?.repositoryPaths?.includes('/showroom/globe/h-earth/index.html'));
  check('COMPOSITOR_BLOB_EXACT', compositor?.repositoryOccurrences?.some((occurrence) => occurrence.gitBlobSha === '480cd4519a4d3cc364be4b16acc7791aadb5071c'));
  check('ROUTE_ENTRY_BLOB_EXACT', routeEntry?.repositoryOccurrences?.some((occurrence) => occurrence.gitBlobSha === 'c14600319946c45fca9b6d37e74033eb44680b05'));
  check('COMPOSITOR_AUTHORITY_BOUNDED', compositor?.authorityClass === 'COMPOSITOR_AUTHORITY' && compositor?.authorityLimitations?.includes('NO_RENDERER_MATERIALIZATION_AUTHORITY'));
  check('ROUTE_ENTRY_AUTHORITY_BOUNDED', routeEntry?.authorityClass === 'ROUTE_ENTRY_ORCHESTRATION_AUTHORITY' && routeEntry?.authorityLimitations?.includes('NO_COMPOSITOR_OR_RENDERER_AUTHORITY'));
  check('COMPOSITOR_MUTATION_WITHHELD', compositor?.allowedMutationScope === 'WITHHELD');
  check('ROUTE_ENTRY_MUTATION_WITHHELD', routeEntry?.allowedMutationScope === 'WITHHELD');

  const brokenRelationEndpoints = registry.relations.filter((relation) => !nodeSet.has(relation.fromNodeId) || !nodeSet.has(relation.toNodeId));
  check('RELATION_ENDPOINTS_RESOLVE', brokenRelationEndpoints.length === 0, brokenRelationEndpoints.map((relation) => relation.relationId));

  const brokenEvidenceRefs = [];
  for (const node of registry.nodes) {
    for (const ref of node.evidenceReferences ?? []) if (!evidenceSet.has(ref)) brokenEvidenceRefs.push(`NODE:${node.nodeId}:${ref}`);
  }
  for (const relation of registry.relations) {
    for (const ref of relation.evidenceReferences ?? []) if (!evidenceSet.has(ref)) brokenEvidenceRefs.push(`RELATION:${relation.relationId}:${ref}`);
  }
  check('EVIDENCE_REFERENCES_RESOLVE', brokenEvidenceRefs.length === 0, brokenEvidenceRefs);

  const brokenNodeRelationRefs = [];
  for (const node of registry.nodes) {
    for (const field of ['parentRelations','childRelations','peerRelations','upstreamBoundaries','downstreamBoundaries','dependencyRelations']) {
      for (const ref of node[field] ?? []) if (!relationSet.has(ref)) brokenNodeRelationRefs.push(`${node.nodeId}:${field}:${ref}`);
    }
  }
  check('NODE_RELATION_REFERENCES_RESOLVE', brokenNodeRelationRefs.length === 0, brokenNodeRelationRefs);

  const requiredStops = ['STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM','STOP_BEFORE_REPOSITORY_MUTATION','STOP_ON_HIGHER_AUTHORITY_CONFLICT','STOP_ON_UNRESOLVED_CRITICAL_FIELD'];
  check('NEW_NODES_HAVE_STOPPING_BOUNDARIES', [compositor, routeEntry].every((node) => node && requiredStops.every((stop) => node.stoppingBoundaries?.includes(stop))));

  const clone = structuredClone(registry);
  const embedded = clone.serialization?.contentDigest;
  if (clone.serialization) delete clone.serialization.contentDigest;
  const canonicalize = (value) => {
    if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
    if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
    return JSON.stringify(value);
  };
  const calculated = crypto.createHash('sha256').update(canonicalize(clone)).digest('hex');
  check('EMBEDDED_REGISTRY_DIGEST_MATCHES_IDENTITY', embedded === identity.contentDigest, { embedded, identity: identity.contentDigest });
  check('CANONICAL_CONTENT_DIGEST_REPRODUCES', calculated === identity.contentDigest, { calculated, identity: identity.contentDigest });
}

const sourceBytes = fs.readFileSync(candidatePath);
const sourceSha256 = crypto.createHash('sha256').update(sourceBytes).digest('hex');
const receipt = {
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_SUCCESSOR_CANDIDATE_v2_VALIDATION_RECEIPT_v1',
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  successorId: identity?.successorId ?? null,
  registryVersion: identity?.registryVersion ?? null,
  contentDigest: identity?.contentDigest ?? null,
  sourceSha256,
  checkCount: checks.length,
  passedCheckCount: checks.filter((entry) => entry.pass).length,
  failedCheckCount: failures.length,
  failures,
  checks,
  boundaries: {
    acceptedBootstrapChanged: false,
    activeRegistryChanged: false,
    canonicalizationCreated: false,
    implementationSourceChanged: false,
    mergeAuthorityCreated: false
  }
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/h-earth.repository-registry.successor-v2-validation-receipt.json', `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
