/**
 * H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_AND_ROUTE_ENTRY_AMENDMENT_CANDIDATE_v1
 *
 * Candidate-only amendment for two current H-Earth occurrences omitted from the
 * installed registry candidate. This file does not alter the accepted bootstrap,
 * activate the amendment, authorize source mutation, or create canonical status.
 */

function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
}

export const H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_AND_ROUTE_ENTRY_AMENDMENT_CANDIDATE = deepFreeze({
  amendmentId: 'H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_AND_ROUTE_ENTRY_AMENDMENT_CANDIDATE_v1',
  amendmentVersion: 1,
  status: 'COMPLETE_CANDIDATE_NOT_ACCEPTED_NOT_CANONICAL_NOT_ACTIVE',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  baseMainCommit: '465596de77ef0a28a7f779e06851130f4768e445',
  targetRegistryId: 'H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1',
  targetRegistryPath: '/h-earth-3d/registry/h-earth.repository-registry.candidate.js',
  mutationBoundary: {
    acceptedBootstrapChanged: false,
    activeRegistryChanged: false,
    implementationSourceChanged: false,
    canonicalizationCreated: false,
    mergeAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    productionAuthorityCreated: false
  },
  evidenceRecords: [
    {
      evidenceId: 'EVIDENCE_REPOSITORY_CURRENT_COMPOSITOR_MAIN_465596D',
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      sourceKind: 'REPOSITORY_FILE',
      sourceIdOrPath: '/showroom/globe/h-earth/compositor.js',
      sourceOccurrenceOrRevision: 'COMMIT=465596de77ef0a28a7f779e06851130f4768e445;GIT_BLOB_SHA=480cd4519a4d3cc364be4b16acc7791aadb5071c;CONTRACT=H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1',
      assertionScope: [
        'EXACT_PATH_OCCURRENCE',
        'CONTRACT_IDENTITY',
        'DECLARED_AUTHORITY_AND_BOUNDARIES'
      ],
      verifiedOn: '2026-07-23',
      evidenceLimitations: [
        'CURRENT_MAIN_OCCURRENCE_AND_SOURCE_HEADER_INSPECTED',
        'CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS AMENDMENT',
        'SOURCE_EXECUTION_NOT_PERFORMED_BY_THIS_AMENDMENT'
      ]
    },
    {
      evidenceId: 'EVIDENCE_REPOSITORY_CURRENT_ROUTE_ENTRY_MAIN_465596D',
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      sourceKind: 'REPOSITORY_FILE',
      sourceIdOrPath: '/showroom/globe/h-earth/index.html',
      sourceOccurrenceOrRevision: 'COMMIT=465596de77ef0a28a7f779e06851130f4768e445;GIT_BLOB_SHA=c14600319946c45fca9b6d37e74033eb44680b05;CONTRACT=H_EARTH_3D_ROUTE_ENTRY_FILE_RENEWAL_STEP_034W_STEP_034Q_BRANCH_SPECIFIC_PREBOOTSTRAP_IMPORT_DIAGNOSTICS_v1',
      assertionScope: [
        'EXACT_PATH_OCCURRENCE',
        'CONTRACT_IDENTITY',
        'DECLARED_AUTHORITY_AND_BOUNDARIES'
      ],
      verifiedOn: '2026-07-23',
      evidenceLimitations: [
        'CURRENT_MAIN_OCCURRENCE_AND_SOURCE_HEADER_INSPECTED',
        'CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_AMENDMENT',
        'BROWSER_EXECUTION_NOT_PERFORMED_BY_THIS_AMENDMENT'
      ]
    }
  ],
  nodes: [
    {
      nodeId: 'H_EARTH_SHOWROOM_COMPOSITOR_FILE',
      nodeType: 'FILE',
      nodeSubtype: 'COMPOSITOR_AND_FRAME_SEQUENCE_AUTHORITY',
      displayName: 'H-Earth Showroom Compositor',
      description: 'Current compositor occurrence consuming admitted geometry frames and owning compositor-state correspondence, camera, viewport, visibility, and frame sequencing before renderer presentation.',
      repositoryPaths: ['/showroom/globe/h-earth/compositor.js'],
      repositoryOccurrences: [{
        repository: 'smansfield635-create/smansfield635-create.github.io',
        refType: 'COMMIT',
        refName: '465596de77ef0a28a7f779e06851130f4768e445',
        commitSha: '465596de77ef0a28a7f779e06851130f4768e445',
        path: '/showroom/globe/h-earth/compositor.js',
        gitBlobSha: '480cd4519a4d3cc364be4b16acc7791aadb5071c',
        contentSha256: null,
        byteCount: null,
        existenceStatus: 'PRESENT',
        fetchbackStatus: 'VERIFIED',
        occurrenceClass: 'CANDIDATE'
      }],
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      evidenceReferences: ['EVIDENCE_REPOSITORY_CURRENT_COMPOSITOR_MAIN_465596D'],
      authorityClass: 'COMPOSITOR_AUTHORITY',
      authorityPosture: 'ADMITTED_FRAME_CAMERA_VIEWPORT_VISIBILITY_AND_FRAME_SEQUENCE_COMPOSITION_ONLY',
      authoritySource: ['H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1'],
      authorityScope: ['COMPOSITOR_STATE_CORRESPONDENCE', 'CAMERA_VIEWPORT_VISIBILITY', 'FRAME_SEQUENCE_COMPOSITION'],
      authorityLimitations: [
        'NO_PACKET_002_PRODUCTION_AUTHORITY',
        'NO_GEOMETRY_CONSTRUCTION_OR_WEST_ADMISSION_AUTHORITY',
        'NO_RENDERER_MATERIALIZATION_AUTHORITY',
        'NO_ROUTE_OR_DEPLOYMENT_AUTHORITY'
      ],
      parentRelations: ['REL_GEOMETRY_SYSTEM_CONTAINS_SHOWROOM_COMPOSITOR'],
      childRelations: [],
      peerRelations: [],
      upstreamBoundaries: ['REL_ADMITTED_FRAME_CONTINUES_TO_SHOWROOM_COMPOSITOR'],
      downstreamBoundaries: ['REL_SHOWROOM_COMPOSITOR_CONTINUES_TO_RENDERER'],
      cardinalRole: 'NONE',
      cardinalStatus: 'NONE',
      cardinalCompleteness: 'NOT_APPLICABLE',
      orderingRules: [],
      dependencyRelations: [],
      allowedMutationScope: 'WITHHELD',
      prohibitedMutations: [
        'AUTHORITY_TRANSFER_OR_COLLAPSE',
        'CALL_ORDER_CHANGE',
        'IMPORT_PATH_CHANGE',
        'MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE',
        'SOURCE_BEHAVIOR_CHANGE',
        'SOURCE_FILE_MOVE_OR_RENAME'
      ],
      requiredValidations: [
        'AUTHORITY_NON_COLLAPSE',
        'EVIDENCE_REFERENCE_RESOLUTION',
        'REFERENTIAL_INTEGRITY',
        'SCHEMA_VALIDATION',
        'STOPPING_BOUNDARY_PRESENCE'
      ],
      stoppingBoundaries: [
        'STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM',
        'STOP_BEFORE_REPOSITORY_MUTATION',
        'STOP_ON_HIGHER_AUTHORITY_CONFLICT',
        'STOP_ON_UNRESOLVED_CRITICAL_FIELD'
      ],
      currentIdentityReferences: [
        '/showroom/globe/h-earth/compositor.js',
        'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1'
      ],
      lifecycleStatus: 'CANDIDATE',
      unresolvedFields: ['BYTE_COUNT', 'CONTENT_SHA256']
    },
    {
      nodeId: 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE',
      nodeType: 'FILE',
      nodeSubtype: 'PUBLIC_ROUTE_ENTRY_AND_IMPORT_ORCHESTRATION',
      displayName: 'H-Earth Public Route Entry HTML',
      description: 'Current public route-entry occurrence owning DOM prerequisites, module import orchestration, route-entry correlation identities, and visible pre-bootstrap failure reporting.',
      repositoryPaths: ['/showroom/globe/h-earth/index.html'],
      repositoryOccurrences: [{
        repository: 'smansfield635-create/smansfield635-create.github.io',
        refType: 'COMMIT',
        refName: '465596de77ef0a28a7f779e06851130f4768e445',
        commitSha: '465596de77ef0a28a7f779e06851130f4768e445',
        path: '/showroom/globe/h-earth/index.html',
        gitBlobSha: 'c14600319946c45fca9b6d37e74033eb44680b05',
        contentSha256: null,
        byteCount: null,
        existenceStatus: 'PRESENT',
        fetchbackStatus: 'VERIFIED',
        occurrenceClass: 'CANDIDATE'
      }],
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      evidenceReferences: ['EVIDENCE_REPOSITORY_CURRENT_ROUTE_ENTRY_MAIN_465596D'],
      authorityClass: 'ROUTE_ENTRY_ORCHESTRATION_AUTHORITY',
      authorityPosture: 'PUBLIC_ROUTE_ENTRY_IMPORT_AND_BOOTSTRAP_ORCHESTRATION_ONLY',
      authoritySource: ['H_EARTH_3D_ROUTE_ENTRY_FILE_RENEWAL_STEP_034W_STEP_034Q_BRANCH_SPECIFIC_PREBOOTSTRAP_IMPORT_DIAGNOSTICS_v1'],
      authorityScope: ['DOM_PREREQUISITE_SURFACES', 'MODULE_IMPORT_ORCHESTRATION', 'ROUTE_ENTRY_CORRELATION', 'PREBOOTSTRAP_FAILURE_REPORTING'],
      authorityLimitations: [
        'NO_GEOMETRY_IDENTITY_OR_CONSTRUCTION_AUTHORITY',
        'NO_WEST_ADMISSION_AUTHORITY',
        'NO_PACKET_002_PRODUCER_AUTHENTICATION',
        'NO_COMPOSITOR_OR_RENDERER_AUTHORITY',
        'NO_DEPLOYMENT_OR_PRODUCTION_EVIDENCE'
      ],
      parentRelations: ['REL_REPOSITORY_ROOT_CONTAINS_PUBLIC_ROUTE_ENTRY'],
      childRelations: [],
      peerRelations: [],
      upstreamBoundaries: [],
      downstreamBoundaries: ['REL_PUBLIC_ROUTE_ENTRY_INVOKES_CURRENT_H_EARTH_CORRIDOR'],
      cardinalRole: 'NONE',
      cardinalStatus: 'NONE',
      cardinalCompleteness: 'NOT_APPLICABLE',
      orderingRules: ['IMPORT_VERIFY_THEN_INITIALIZE_ROUTE'],
      dependencyRelations: [],
      allowedMutationScope: 'WITHHELD',
      prohibitedMutations: [
        'AUTHORITY_TRANSFER_OR_COLLAPSE',
        'CALL_ORDER_CHANGE',
        'IMPORT_PATH_CHANGE',
        'MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE',
        'SOURCE_BEHAVIOR_CHANGE',
        'SOURCE_FILE_MOVE_OR_RENAME'
      ],
      requiredValidations: [
        'AUTHORITY_NON_COLLAPSE',
        'EVIDENCE_REFERENCE_RESOLUTION',
        'REFERENTIAL_INTEGRITY',
        'SCHEMA_VALIDATION',
        'STOPPING_BOUNDARY_PRESENCE'
      ],
      stoppingBoundaries: [
        'STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM',
        'STOP_BEFORE_REPOSITORY_MUTATION',
        'STOP_ON_HIGHER_AUTHORITY_CONFLICT',
        'STOP_ON_UNRESOLVED_CRITICAL_FIELD'
      ],
      currentIdentityReferences: [
        '/showroom/globe/h-earth/index.html',
        'H_EARTH_3D_ROUTE_ENTRY_FILE_RENEWAL_STEP_034W_STEP_034Q_BRANCH_SPECIFIC_PREBOOTSTRAP_IMPORT_DIAGNOSTICS_v1'
      ],
      lifecycleStatus: 'CANDIDATE',
      unresolvedFields: ['BYTE_COUNT', 'CONTENT_SHA256', 'BROWSER_EXECUTION_CORRESPONDENCE']
    }
  ],
  relations: [
    {
      relationId: 'REL_GEOMETRY_SYSTEM_CONTAINS_SHOWROOM_COMPOSITOR',
      relationType: 'CONTAINS',
      fromNodeId: 'H_EARTH_GEOMETRY_CONTINUITY_SYSTEM',
      toNodeId: 'H_EARTH_SHOWROOM_COMPOSITOR_FILE',
      scale: 'SYSTEM_TO_FILE',
      direction: 'FROM_TO',
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      evidenceReferences: ['EVIDENCE_REPOSITORY_CURRENT_COMPOSITOR_MAIN_465596D'],
      order: null,
      authorityEffect: 'NO_AUTHORITY_TRANSFER_OR_INHERITANCE',
      continuityEffect: 'EXTENDS_REGISTERED_CONTINUITY_TO_CURRENT_COMPOSITOR_OCCURRENCE',
      mutationEffect: 'NO_MUTATION_AUTHORITY_CREATED',
      lifecycleStatus: 'CANDIDATE',
      roleWithinComposite: 'NONE',
      roleStatus: 'NONE'
    },
    {
      relationId: 'REL_ADMITTED_FRAME_CONTINUES_TO_SHOWROOM_COMPOSITOR',
      relationType: 'CONTINUES_TO',
      fromNodeId: 'H_EARTH_ADMITTED_GEOMETRY_FRAME_FILE',
      toNodeId: 'H_EARTH_SHOWROOM_COMPOSITOR_FILE',
      scale: 'FILE',
      direction: 'FROM_TO',
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      evidenceReferences: ['EVIDENCE_REPOSITORY_CURRENT_COMPOSITOR_MAIN_465596D'],
      order: null,
      authorityEffect: 'NO_AUTHORITY_TRANSFER_OR_INHERITANCE',
      continuityEffect: 'ADMITTED_FRAME_INPUT_TO_COMPOSITOR',
      mutationEffect: 'NO_MUTATION_AUTHORITY_CREATED',
      lifecycleStatus: 'CANDIDATE',
      roleWithinComposite: 'NONE',
      roleStatus: 'NONE'
    },
    {
      relationId: 'REL_REPOSITORY_ROOT_CONTAINS_PUBLIC_ROUTE_ENTRY',
      relationType: 'CONTAINS',
      fromNodeId: 'H_EARTH_REPOSITORY_ARCHITECTURE',
      toNodeId: 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE',
      scale: 'SYSTEM_TO_FILE',
      direction: 'FROM_TO',
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      evidenceReferences: ['EVIDENCE_REPOSITORY_CURRENT_ROUTE_ENTRY_MAIN_465596D'],
      order: null,
      authorityEffect: 'NO_AUTHORITY_TRANSFER_OR_INHERITANCE',
      continuityEffect: 'REPRESENTS_CURRENT_PUBLIC_ROUTE_ENTRY_OCCURRENCE',
      mutationEffect: 'NO_MUTATION_AUTHORITY_CREATED',
      lifecycleStatus: 'CANDIDATE',
      roleWithinComposite: 'NONE',
      roleStatus: 'NONE'
    },
    {
      relationId: 'REL_PUBLIC_ROUTE_ENTRY_INVOKES_CURRENT_H_EARTH_CORRIDOR',
      relationType: 'ORCHESTRATES',
      fromNodeId: 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE',
      toNodeId: 'H_EARTH_GEOMETRY_CONTINUITY_SYSTEM',
      scale: 'FILE_TO_SYSTEM',
      direction: 'FROM_TO',
      evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
      evidenceReferences: ['EVIDENCE_REPOSITORY_CURRENT_ROUTE_ENTRY_MAIN_465596D'],
      order: null,
      authorityEffect: 'NO_AUTHORITY_TRANSFER_OR_INHERITANCE',
      continuityEffect: 'IMPORT_VERIFY_AND_ROUTE_INITIALIZATION_ORCHESTRATION',
      mutationEffect: 'NO_MUTATION_AUTHORITY_CREATED',
      lifecycleStatus: 'CANDIDATE',
      roleWithinComposite: 'NONE',
      roleStatus: 'NONE'
    }
  ],
  unresolvedFields: [
    { nodeId: 'H_EARTH_SHOWROOM_COMPOSITOR_FILE', field: 'BYTE_COUNT', criticality: 'NONCRITICAL' },
    { nodeId: 'H_EARTH_SHOWROOM_COMPOSITOR_FILE', field: 'CONTENT_SHA256', criticality: 'CONTEXT_DEPENDENT' },
    { nodeId: 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE', field: 'BYTE_COUNT', criticality: 'NONCRITICAL' },
    { nodeId: 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE', field: 'CONTENT_SHA256', criticality: 'CONTEXT_DEPENDENT' },
    { nodeId: 'H_EARTH_PUBLIC_ROUTE_ENTRY_HTML_FILE', field: 'BROWSER_EXECUTION_CORRESPONDENCE', criticality: 'CONTEXT_DEPENDENT' }
  ],
  requiredNextActions: [
    'VALIDATE_AMENDMENT_SHAPE_AND_REFERENTIAL_INTEGRITY',
    'INTEGRATE_INTO_A_SUCCESSOR_REGISTRY_CANDIDATE_WITH_DETERMINISTIC_DIGEST',
    'UPDATE_BOOTSTRAP_IDENTITY_ONLY_AFTER_SUCCESSOR_VALIDATION_AND_SEPARATE_ACCEPTANCE',
    'RERUN_CORRECTED_EIGHT_PATH_PREFLIGHT'
  ]
});

export default H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_AND_ROUTE_ENTRY_AMENDMENT_CANDIDATE;
