/**
 * /showroom/globe/h-earth/index.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034P_COMPOSITOR_RENDERER_ROUTE_ORCHESTRATION_v1
 *
 * Renews:
 * H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034M_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_v1
 *
 * Canonical route corridor:
 *
 * ROUTE MOUNT RESOLUTION
 * → TEMPORARY DESCRIPTOR-ONLY SOURCE PREVIEW
 * → PACKET 002 INPUT VALIDATION
 * → EXACT ./compositor.js IMPORT
 * → EXACT COMPOSITOR CONTRACT VERIFICATION
 * → EXACT ./renderer.js IMPORT
 * → EXACT RENDERER CONTRACT VERIFICATION
 * → COMPOSITOR RENDERER HANDOFF REQUEST
 * → RENDERER CONSTRUCTION
 * → RENDERER MOUNT
 * → EXPLICIT SOURCE-PREVIEW TAKEOVER
 * → SYNCHRONIZED PUBLIC RECEIPTS AND ACTIVE GLOBALS
 *
 * Stale-occurrence law:
 *
 * AN INVALID INITIALIZATION TOKEN IS OBSERVATIONAL ONLY.
 *
 * A stale occurrence must not:
 * - mutate shared route state;
 * - mutate rendererBootstrapStatus;
 * - publish import, handoff, construction, or mount evidence;
 * - replace active module references;
 * - release the current renderer;
 * - restore or replace current DOM;
 * - publish active global evidence.
 *
 * Active-global law:
 *
 * ALL NORMAL AND EXCEPTIONAL ROUTE CORRIDORS MUST PUBLISH OR CLEAR THE COMPLETE
 * ACTIVE-GLOBAL SET AS ONE CURRENT-OCCURRENCE EVIDENCE SURFACE.
 *
 * Destruction owns invalidation and renderer cleanup.
 */


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID =
  'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034P_COMPOSITOR_RENDERER_ROUTE_ORCHESTRATION_v1';

export const H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID =
  'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034M_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_v1';

export const H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID =
  'H_EARTH_3D_ROUTE_SHELL_FILE_RENEWAL_STEP_034C_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_PROJECTION_v1';

export const H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID =
  'H_EARTH_3D_ROUTE_SHELL_STYLE_FILE_RENEWAL_STEP_034D_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_SUPPORT_v1';

export const H_EARTH_3D_PUBLIC_ROUTE_FILE =
  '/showroom/globe/h-earth/index.js';

export const H_EARTH_3D_PUBLIC_ROUTE =
  '/showroom/globe/h-earth/';

export const H_EARTH_3D_DIAGNOSTIC_ROUTE =
  '/showroom/globe/h-earth/diagnostic/';

export const H_EARTH_3D_COMPOSITOR_MODULE_PATH =
  './compositor.js';

export const H_EARTH_3D_RENDERER_MODULE_PATH =
  './renderer.js';

export const H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH =
  '../../../h-earth-3d/runtime/tests/h-earth.headless-serialization-bridge.js';

export const H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID =
  'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1';

export const H_EARTH_3D_EXPECTED_RENDERER_CONTRACT_ID =
  'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1';


/* ==========================================================================
 * 02 · STATUS ENUMERATIONS
 * ========================================================================== */

export const H_EARTH_3D_PUBLIC_STAGE_STATUS =
  Object.freeze({
    NOT_STARTED:
      'PUBLIC_STAGE_NOT_STARTED',

    INITIALIZING:
      'PUBLIC_STAGE_INITIALIZING',

    PREVIEW_READY:
      'PUBLIC_STAGE_PREVIEW_READY',

    READY:
      'PUBLIC_STAGE_READY',

    PARTIAL:
      'PUBLIC_STAGE_PARTIAL',

    FALLBACK:
      'PUBLIC_STAGE_FALLBACK',

    DESTROYING:
      'PUBLIC_STAGE_DESTROYING',

    DESTROYED:
      'PUBLIC_STAGE_DESTROYED',

    ERROR:
      'PUBLIC_STAGE_ERROR'
  });

export const H_EARTH_3D_SOURCE_PREVIEW_STATUS =
  Object.freeze({
    NOT_STARTED:
      'SOURCE_PREVIEW_NOT_STARTED',

    MOUNTED:
      'SOURCE_PREVIEW_MOUNTED',

    TAKEN_OVER:
      'SOURCE_PREVIEW_TAKEN_OVER_BY_RENDERER',

    RESTORED:
      'SOURCE_PREVIEW_RESTORED_AFTER_RENDERER_FAILURE',

    HELD:
      'SOURCE_PREVIEW_HELD',

    FAILED:
      'SOURCE_PREVIEW_FAILED',

    REMOVED:
      'SOURCE_PREVIEW_REMOVED'
  });

export const H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS =
  Object.freeze({
    NOT_STARTED:
      'RENDERER_BOOTSTRAP_NOT_STARTED',

    INPUT_REJECTED:
      'RENDERER_BOOTSTRAP_INPUT_REJECTED',

    IMPORT_PENDING:
      'RENDERER_IMPORT_PENDING',

    IMPORT_FAILED:
      'RENDERER_IMPORT_FAILED',

    API_REJECTED:
      'EXACT_COMPOSITOR_OR_RENDERER_API_REJECTED',

    HANDOFF_PENDING:
      'COMPOSITOR_HANDOFF_PENDING',

    HANDOFF_REJECTED:
      'COMPOSITOR_HANDOFF_REJECTED',

    CONSTRUCTION_PENDING:
      'RENDERER_CONSTRUCTION_PENDING',

    CONSTRUCTION_REJECTED:
      'RENDERER_CONSTRUCTION_REJECTED',

    MOUNT_PENDING:
      'RENDERER_MOUNT_PENDING',

    MOUNT_REJECTED:
      'RENDERER_MOUNT_REJECTED',

    MOUNTED:
      'RENDERER_MOUNTED',

    SKIPPED:
      'RENDERER_BOOTSTRAP_SKIPPED',

    STALE_COMPLETION:
      'RENDERER_BOOTSTRAP_STALE_COMPLETION'
  });

export const H_EARTH_3D_LAYER_4_STATUS =
  Object.freeze({
    STATIC_METADATA_PROJECTED:
      'LAYER_4_STATIC_METADATA_PROJECTED',

    DESCRIPTOR_IMPORT_PENDING:
      'LAYER_4_DESCRIPTOR_IMPORT_PENDING',

    DESCRIPTOR_IMPORT_OBSERVED:
      'LAYER_4_DESCRIPTOR_IMPORT_OBSERVED',

    DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED:
      'LAYER_4_DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED',

    DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED:
      'LAYER_4_DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED'
  });


/* ==========================================================================
 * 03 · GENERIC HELPERS
 * ========================================================================== */

function nowIso() {
  return new Date().toISOString();
}

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isNonEmptyExactString(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.trim() === value
  );
}

function deepFreeze(
  value,
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const key of Reflect.ownKeys(value)) {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );

    if (
      descriptor &&
      Object.prototype.hasOwnProperty.call(
        descriptor,
        'value'
      )
    ) {
      deepFreeze(
        descriptor.value,
        seen
      );
    }
  }

  if (!Object.isFrozen(value)) {
    Object.freeze(value);
  }

  return value;
}

/**
 * The initialization key can hold a browser-owned Document reference.
 * Freeze the key record only. Do not recursively freeze the Document.
 */
function freezeInitializationKey(value) {
  return Object.freeze(value);
}

function getDocumentFromOptions(options = {}) {
  return (
    options.document ??
    globalThis.document ??
    null
  );
}

function getById(rootDocument, id) {
  if (
    !rootDocument ||
    typeof rootDocument.getElementById !==
      'function'
  ) {
    return null;
  }

  return rootDocument.getElementById(id);
}

function safeSerialize(
  value,
  options = {}
) {
  const maxDepth =
    Number.isFinite(options.maxDepth)
      ? options.maxDepth
      : 7;

  const maxArrayLength =
    Number.isFinite(options.maxArrayLength)
      ? options.maxArrayLength
      : 120;

  const seen =
    new WeakSet();

  function visit(input, depth) {
    if (input === null) {
      return null;
    }

    const type =
      typeof input;

    if (
      type === 'string' ||
      type === 'boolean'
    ) {
      return input;
    }

    if (type === 'number') {
      return Number.isFinite(input)
        ? input
        : String(input);
    }

    if (type === 'bigint') {
      return String(input);
    }

    if (type === 'undefined') {
      return null;
    }

    if (type === 'function') {
      return `[Function ${input.name || 'anonymous'}]`;
    }

    if (type === 'symbol') {
      return String(input);
    }

    if (depth > maxDepth) {
      return '[MaxDepthExceeded]';
    }

    if (type === 'object') {
      if (seen.has(input)) {
        return '[Circular]';
      }

      seen.add(input);

      if (Array.isArray(input)) {
        const output =
          input
            .slice(
              0,
              maxArrayLength
            )
            .map(
              (entry) =>
                visit(
                  entry,
                  depth + 1
                )
            );

        if (
          input.length >
          maxArrayLength
        ) {
          output.push(
            `[ArrayTruncated ${
              input.length -
              maxArrayLength
            }]`
          );
        }

        return output;
      }

      const output = {};

      for (const key of Object.keys(input)) {
        if (
          key === 'document' ||
          key === 'ownerDocument' ||
          key === 'mountElement' ||
          key === 'mountNode' ||
          key === 'routeRoot' ||
          key === 'statusNode' ||
          key === 'fallbackNode' ||
          key === 'rendererMount' ||
          key === 'target' ||
          key === 'objectNode' ||
          key === 'rootNode'
        ) {
          output[key] =
            '[DOMNodeOmitted]';

          continue;
        }

        output[key] =
          visit(
            input[key],
            depth + 1
          );
      }

      return output;
    }

    return String(input);
  }

  return visit(
    value,
    0
  );
}

function stringifyPayload(
  value,
  options = {}
) {
  return JSON.stringify(
    safeSerialize(
      value,
      options
    ),
    null,
    2
  );
}

function writeText(node, value) {
  if (!node) {
    return false;
  }

  node.textContent =
    String(
      value ??
      ''
    );

  return true;
}

function writeJson(
  node,
  value,
  options = {}
) {
  if (!node) {
    return false;
  }

  node.textContent =
    stringifyPayload(
      value,
      options
    );

  return true;
}

function setRouteClass(
  routeRoot,
  className
) {
  if (!routeRoot) {
    return false;
  }

  routeRoot.classList.remove(
    'h-earth-3d-boot-ready',
    'h-earth-3d-boot-fallback',
    'h-earth-3d-boot-error'
  );

  if (className) {
    routeRoot.classList.add(
      className
    );
  }

  return true;
}

function normalizePreviewToken(
  value,
  fallback = 'unresolved'
) {
  return (
    String(
      value ||
      fallback
    )
      .trim()
      .replace(
        /([a-z0-9])([A-Z])/g,
        '$1-$2'
      )
      .replace(
        /[_\s]+/g,
        '-'
      )
      .replace(
        /[^a-zA-Z0-9-]/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      )
      .replace(
        /^-|-$/g,
        ''
      )
      .toLowerCase() ||
    fallback
  );
}


/* ==========================================================================
 * 04 · EXECUTION CEILING AND BOUNDARY FLAGS
 * ========================================================================== */

export const H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING =
  deepFreeze({
    moduleInitializationObservedMayBecomeTrue:
      true,

    compositorHandoffRequestedMayBecomeTrue:
      true,

    rendererConstructionAttemptedMayBecomeTrue:
      true,

    rendererMountAttemptedMayBecomeTrue:
      true,

    sourcePreviewMounted:
      'descriptor-only-public-stage-fallback',

    sourcePreviewRuntimeExecution:
      false,

    packet002Construction:
      false,

    admittedFrameConstruction:
      false,

    geometryConstruction:
      false,

    cameraAuthority:
      false,

    compositorViewportAuthority:
      false,

    visibilityAuthority:
      false,

    compositorRevisionAuthority:
      false,

    runFunctionExecuted:
      false,

    step012H1RunExecuted:
      false,

    step012IVectorExecuted:
      false,

    step012IRunnerExecuted:
      false,

    target002RuntimeExecuted:
      false,

    target003ReplayExecuted:
      false,

    runtimeExecuted:
      false,

    replayExecuted:
      false,

    vectorRunnerExecuted:
      false,

    canonicalDigestGenerated:
      false,

    replayComparison:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    matrixCollapse:
      false
  });

export const H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS =
  deepFreeze({
    publicRouteOnly:
      true,

    publicEnvironmentHost:
      true,

    visibleStageAuthorized:
      true,

    temporarySourcePreviewAuthorized:
      true,

    compositorHandoffConsumptionAuthorized:
      true,

    rendererConstructionAuthorized:
      true,

    rendererMountAuthorized:
      true,

    rendererReleaseAuthorized:
      true,

    selectedSurfaceDisplayAuthorized:
      true,

    groundConditionReadDisplayAuthorized:
      true,

    layer4StatusProjectionAuthorized:
      true,

    publicStageReceiptDefinitionAuthorized:
      true,

    diagnosticRouteHandoffAuthorized:
      true,

    sourcePreviewDescriptorOnly:
      true,

    sourcePreviewRuntimeExecution:
      false,

    sourcePreviewSameNodePreservationClaim:
      false,

    rendererTakeoverMayReplacePreviewDOM:
      true,

    routeConstructsPacket002:
      false,

    routeConstructsAdmittedFrame:
      false,

    routeConstructsGeometry:
      false,

    routeOwnsCameraState:
      false,

    routeOwnsCompositorViewportState:
      false,

    routeOwnsVisibilityState:
      false,

    routeOwnsCompositorRevisions:
      false,

    productionModulePathOverrides:
      false,

    genericRendererAPIDiscovery:
      false,

    exactRendererAPIConsumption:
      true,

    exactRendererContractRequired:
      true,

    exactCompositorAPIConsumption:
      true,

    exactCompositorContractRequired:
      true,

    rendererReleasedOnDestroy:
      true,

    cleanupPreservesPrimaryFailureStatus:
      true,

    overlappingInitializationGuarded:
      true,

    staleAsyncCompletionGuarded:
      true,

    staleCompletionSharedStateMutation:
      false,

    staleCompletionRendererCleanup:
      false,

    staleCompletionDOMMutation:
      false,

    constructReceiptCommittedOnlyAfterActiveTokenCheck:
      true,

    mountReceiptCommittedOnlyAfterActiveTokenCheck:
      true,

    activeGlobalSynchronization:
      true,

    exceptionalPathActiveGlobalSynchronization:
      true,

    mountFailureRouteStatusSynchronization:
      true,

    asyncFailureLayer4ReceiptSynchronization:
      true,

    asyncFailureRouteStatusSynchronization:
      true,

    repeatedListenerBindingGuarded:
      true,

    completeInitializationIdentity:
      true,

    occurrenceEvidenceIsolation:
      true,

    diagnosticWallEmbedded:
      false,

    reportWallEmbedded:
      false,

    rawEvidenceWallEmbedded:
      false,

    receiptWallEmbedded:
      false,

    advancedCopySurfaceEmbedded:
      false,

    shellOwnedSceneObjects:
      false,

    fakeRuntimeGeometry:
      false,

    webglActivation:
      false,

    canvasActivation:
      false,

    svgActivation:
      false,

    iframeActivation:
      false,

    step012H1RunExecution:
      false,

    step012IVectorExecution:
      false,

    step012IRunnerExecution:
      false,

    target002RuntimeExecution:
      false,

    target003ReplayExecution:
      false,

    canonicalDigestGeneration:
      false,

    replayComparison:
      false,

    runtimeActivation:
      false,

    routeActivationProof:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    traversal:
      false,

    survivalSimulation:
      false,

    swimming:
      false,

    fluidSimulation:
      false,

    manorInteriorAccess:
      false,

    distantTraversal:
      false,

    runtimeLatticeActivation:
      false,

    active16x16RuntimeLatticeClaim:
      false,

    active256AddressRuntimeClaim:
      false,

    mirrorManorRouteCanonNaming:
      false,

    matrixCollapse:
      false
  });


/* ==========================================================================
 * 05 · STATIC CUSTODY METADATA
 * ========================================================================== */

export const H_EARTH_3D_LAYER_4_CONTRACTS =
  deepFreeze({
    step012JContractId:
      'H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_FILE_BIRTH_STEP_012J_v1',

    step012H1ContractId:
      'H_EARTH_HEADLESS_REPLAY_CONTRACT_FILE_RENEWAL_STEP_012H_1_HISTORICAL_FIXTURE_ALIGNMENT_v1',

    step012IContractId:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_FILE_BIRTH_STEP_012I_v1',

    step012ICanonicalizationId:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_UTF16_UTF8_SHA256_v1',

    target002ContractId:
      'H_EARTH_DETERMINISTIC_RUNTIME_FILE_RENEWAL_STEP_012G_TARGET_002_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

    target003ContractId:
      'H_EARTH_CANONICAL_REPLAY_FILE_RENEWAL_STEP_012G_TARGET_003_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

    step012IRunnerContractId:
      'H_EARTH_SERIALIZATION_VECTOR_RUNNER_FILE_BIRTH_STEP_012I_RUNNER_v1'
  });

export const H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY =
  deepFreeze({
    custodyClass:
      'BACKED_STATIC_SUPPORT_METADATA_FOR_PUBLIC_STAGE_PROJECTION',

    step012JBackupComplete:
      true,

    step012JArchiveTitle:
      'h-earth-headless-serialization-bridge-step-012j-backup',

    step012JDriveDocumentId:
      '1zt8rsROGF8roudC3re1KOwmU5KSws6pQIap7kd0gQpw',

    step012H1ArchiveTitle:
      'h-earth-headless-replay-step-012h-1-backup',

    step012H1DriveDocumentId:
      '1DfSsDzKRYQNJn9S43hmA8gMeebY_7WeQ0ygoIl6Qt2Y',

    step012IArchiveTitle:
      'h-earth-canonical-state-serialization-law-step-012i-backup',

    step012IDriveDocumentId:
      '1K8bszh6SMeutLpCeyCjK6D9r8m6zsIEP3R6soBip6GA',

    step012IRunnerArchiveTitle:
      'h-earth-serialization-vector-runner-step-012i-backup',

    step012IRunnerDriveDocumentId:
      '1EcXxqb2M_MwdiHFVDX95klU4Dh6X1Be8Q5TFNDyCIUE',

    target002ArchiveTitle:
      'h-earth-deterministic-runtime-step-012g-target-002-backup',

    target002DriveDocumentId:
      '1AYVrqdmnBEdM5k4pop8wJNXMThXxdLZd7TNkhgkq2Z0',

    target003ArchiveTitle:
      'h-earth-canonical-replay-step-012g-target-003-backup',

    target003DriveDocumentId:
      '1qbNHRW9L3l7FjfJW04x30J9qNO9dNvWTR8b6Vh0C3vU',

    archiveCustodyStatus:
      'BACKED_OCCURRENCE_RECORDED_BY_CONSTRUCTION_BASIS',

    publicStageReverifiesDriveArchive:
      false,

    publicStageClaimsNetworkBackup:
      false
  });

export const H_EARTH_3D_SOURCE_SPINE_CONTRACTS =
  deepFreeze({
    step034IBoundaryContractId:
      'H_EARTH_MATRIX_BOUNDARIES_FILE_RENEWAL_STEP_034I_PUBLIC_STAGE_AUTHORITY_AMENDMENT_v1',

    step034JObjectsContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    step034KZonesContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    step034LLandscapeLatticeContractId:
      'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_RENEWAL_STEP_034L_LANDSCAPE_LATTICE_ZONE_AND_RENDER_TARGET_ALIGNMENT_v1'
  });

export const H_EARTH_3D_SOURCE_SPINE_ARCHIVE_CUSTODY =
  deepFreeze({
    step034IArchiveTitle:
      'h-earth-matrix-boundaries-step-034i-public-stage-authority-amendment-backup',

    step034IDriveDocumentId:
      '1wLPI7frZHb8Xtq3Syrcnjc6xx3Rkn1LHfHLm12LQjQM',

    step034JArchiveTitle:
      'h-earth-ground-cell-001-objects-step-034j-public-stage-readability-amendment-backup',

    step034JDriveDocumentId:
      '1PLWtLG-BluKzgUO89SOwNTJk32DCQ1lfDAJWKDc_WO8',

    step034KArchiveTitle:
      'h-earth-ground-cell-001-zones-step-034k-public-stage-render-target-zone-alignment-backup',

    step034KDriveDocumentId:
      '1XV4IDS04Qop95QEw9o2w1KwJnO80JOZOjdn0gNZeNuI',

    step034LArchiveTitle:
      'h-earth-256-lattice-landscape-step-034l-zone-and-render-target-alignment-backup',

    step034LDriveDocumentId:
      '10HUxO6UsqD0CoSLIB4v6bgJpwLehVFH5bLY-n0jsQnU',

    sourceSpineBackupStatus:
      'BACKED_OCCURRENCES_RECORDED_BY_CONSTRUCTION_BASIS',

    publicStageReverifiesDriveArchive:
      false,

    publicStageClaimsNetworkBackup:
      false,

    assistantRepositoryInstallationVerified:
      false
  });


/* ==========================================================================
 * 06 · PUBLIC MOUNT IDENTITIES
 * ========================================================================== */

export const H_EARTH_3D_PUBLIC_MOUNT_IDS =
  deepFreeze({
    routeRoot:
      'h-earth-3d-route-root',

    status:
      'h-earth-3d-status',

    fallback:
      'h-earth-3d-fallback',

    rendererMount:
      'h-earth-3d-renderer-mount',

    actionInspectGround:
      'h-earth-3d-action-inspect-ground',

    selectedTargetCard:
      'h-earth-3d-selected-target-card',

    selectedTargetLabel:
      'h-earth-3d-selected-target-label',

    selectedTargetObjectId:
      'h-earth-3d-selected-target-object-id',

    selectedTargetClassification:
      'h-earth-3d-selected-target-classification',

    publicReadoutTitle:
      'h-earth-3d-public-readout-title',

    publicReadoutLine:
      'h-earth-3d-public-readout-line',

    publicReadout:
      'h-earth-3d-public-readout',

    targetList:
      'h-earth-3d-target-list',

    layer4StatusCard:
      'h-earth-3d-layer-4-status-card',

    layer4Status:
      'h-earth-3d-layer-4-status',

    layer4Summary:
      'h-earth-3d-layer-4-summary',

    layer4ProjectionPayload:
      'h-earth-3d-layer-4-projection-payload',

    step012JContractId:
      'h-earth-3d-step-012j-contract-id',

    step012H1ContractId:
      'h-earth-3d-step-012h-1-contract-id',

    step012IContractId:
      'h-earth-3d-step-012i-contract-id',

    step012ICanonicalizationId:
      'h-earth-3d-step-012i-canonicalization-id',

    inspectionPanel:
      'h-earth-3d-inspection-panel',

    debug:
      'h-earth-3d-debug',

    publicStageReceipt:
      'h-earth-3d-public-stage-receipt',

    copyStatus:
      'h-earth-3d-copy-status',

    diagnosticLink:
      'h-earth-3d-diagnostic-link'
  });


/* ==========================================================================
 * 07 · SOURCE-PREVIEW DESCRIPTORS
 * ========================================================================== */

export const H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS =
  deepFreeze([
    {
      bandId:
        'R16_HORIZON_ATMOSPHERE_COMPRESSION',

      label:
        'R16 · Horizon / atmosphere compression',

      rowRange:
        'R16',

      zoneId:
        'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

      depthClass:
        'horizon',

      cssTop:
        '4%',

      cssHeight:
        '18%',

      summary:
        'Distant atmosphere and horizon compression above the first public shoreline cell.'
    },

    {
      bandId:
        'R14_R15_SPLIT_ELEVATED_MANOR_AND_OFFSHORE_ISLETS',

      label:
        'R14–R15 · Elevated manor context / offshore islets',

      rowRange:
        'R14-R15',

      zoneId:
        'ZONE_004_MANOR_CONTEXT_ZONE + ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

      depthClass:
        'context',

      cssTop:
        '19%',

      cssHeight:
        '18%',

      summary:
        'Split region: offshore rock stacks and islets on one side, elevated Mirror Manor context on the other.'
    },

    {
      bandId:
        'R12_R13_WATER_PLANE_AIR_HAZE_RELATION',

      label:
        'R12–R13 · Water plane / air-haze relation',

      rowRange:
        'R12-R13',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      depthClass:
        'water',

      cssTop:
        '35%',

      cssHeight:
        '16%',

      summary:
        'Open water plane and atmospheric-water relation before the nearshore band.'
    },

    {
      bandId:
        'R10_R11_NEARSHORE_WAVE_DEPTH_TRANSITION',

      label:
        'R10–R11 · Nearshore wave / depth transition',

      rowRange:
        'R10-R11',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      depthClass:
        'water',

      cssTop:
        '48%',

      cssHeight:
        '11%',

      summary:
        'Nearshore wave band and water-depth transition approaching shoreline contact.'
    },

    {
      bandId:
        'R08_R09_TIDE_POOLS_FOAM_SHORELINE_CONTACT',

      label:
        'R08–R09 · Tide pools / foam / shoreline contact',

      rowRange:
        'R08-R09',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      depthClass:
        'shoreline',

      cssTop:
        '57%',

      cssHeight:
        '12%',

      summary:
        'Foam line, tide pools, reflective puddles, and shoreline-contact field.'
    },

    {
      bandId:
        'R06_R07_DRY_SAND_TRANSITION',

      label:
        'R06–R07 · Dry sand transition',

      rowRange:
        'R06-R07',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      depthClass:
        'shoreline',

      cssTop:
        '67%',

      cssHeight:
        '13%',

      summary:
        'Dry-wet transition band between beach foreground and shoreline contact.'
    },

    {
      bandId:
        'R01_R05_FOREGROUND_WET_SAND_STONES_ROCKS',

      label:
        'R01–R05 · Foreground wet sand / stones / jagged rocks',

      rowRange:
        'R01-R05',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      depthClass:
        'foreground',

      cssTop:
        '78%',

      cssHeight:
        '22%',

      summary:
        'Foreground inspection surface: wet sand, stones, rocks, and first Inspect Ground field.'
    }
  ]);

export const H_EARTH_3D_PUBLIC_TARGETS =
  deepFreeze([
    {
      objectId:
        'OBJ_002_FOREGROUND_WET_SAND',

      label:
        'Foreground Wet Sand',

      classification:
        'PRIMARY_PUBLIC_INSPECTION_OBJECT',

      material:
        'wet-sand',

      materialClass:
        'h-earth-material-wet-sand',

      layerClass:
        'h-earth-layer-foreground-wet-sand',

      landscapeClass:
        'h-earth-landscape-ground-wet-sand',

      primitiveClass:
        'h-earth-primitive-contoured-terrain-band',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      rowBand:
        'R01-R05',

      previewRole:
        'foreground inspection surface',

      xPercent:
        50,

      yPercent:
        87,

      widthCss:
        '112%',

      heightCss:
        '26%',

      action:
        'Inspect Ground',

      readout:
        'Ground Condition Read',

      receipt:
        'H_EARTH_GROUND_INSPECTION_RECEIPT',

      publicLine:
        'Foreground wet sand is the first readable surface. The temporary preview is descriptor-only and is replaced when the lawful renderer mounts.'
    },

    {
      objectId:
        'OBJ_003_DRY_SAND_TRANSITION',

      label:
        'Dry Sand Transition',

      classification:
        'SECONDARY_SURFACE_CONTEXT',

      material:
        'dry-sand',

      materialClass:
        'h-earth-material-dry-sand',

      layerClass:
        'h-earth-layer-dry-sand-transition',

      landscapeClass:
        'h-earth-landscape-ground-dry-sand',

      primitiveClass:
        'h-earth-primitive-terrain-band',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      rowBand:
        'R06-R07',

      previewRole:
        'dry-wet transition',

      xPercent:
        50,

      yPercent:
        73,

      widthCss:
        '106%',

      heightCss:
        '16%',

      action:
        'Inspect Context',

      readout:
        'Surface Context Read',

      receipt:
        'H_EARTH_SURFACE_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Dry sand transition is public-stage context. It does not create traversal, survival simulation, or route activation.'
    },

    {
      objectId:
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',

      label:
        'Tide Pools and Reflective Puddles',

      classification:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      material:
        'tide-pool',

      materialClass:
        'h-earth-material-tide-pool',

      layerClass:
        'h-earth-layer-tide-pools-stones-rocks-detail',

      landscapeClass:
        'h-earth-landscape-surface-detail',

      primitiveClass:
        'h-earth-primitive-scatter-cluster',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      rowBand:
        'R08-R09',

      previewRole:
        'low shoreline detail',

      xPercent:
        38,

      yPercent:
        63,

      widthCss:
        '15%',

      heightCss:
        '5%',

      action:
        'Inspect Context',

      readout:
        'Tide Pool Context Read',

      receipt:
        'H_EARTH_TIDE_POOL_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Tide pools are readable shoreline detail. They do not activate swimming, fluid simulation, or survival simulation.'
    },

    {
      objectId:
        'OBJ_005_SHORELINE_FOAM_LINE',

      label:
        'Shoreline Foam Line',

      classification:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      material:
        'foam',

      materialClass:
        'h-earth-material-foam',

      layerClass:
        'h-earth-layer-shoreline-foam-line',

      landscapeClass:
        'h-earth-landscape-shoreline-band',

      primitiveClass:
        'h-earth-primitive-irregular-shoreline-band',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      rowBand:
        'R08-R09',

      previewRole:
        'shoreline surf boundary',

      xPercent:
        50,

      yPercent:
        57,

      widthCss:
        '96%',

      heightCss:
        '3%',

      action:
        'Inspect Context',

      readout:
        'Shoreline Context Read',

      receipt:
        'H_EARTH_SHORELINE_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'The shoreline foam line marks the public surf boundary. It does not activate swimming, fluid simulation, or traversal.'
    },

    {
      objectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',

      label:
        'Nearshore Wave Band',

      classification:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      material:
        'nearshore-wave',

      materialClass:
        'h-earth-material-nearshore-wave',

      layerClass:
        'h-earth-layer-nearshore-wave-band',

      landscapeClass:
        'h-earth-landscape-nearshore-wave',

      primitiveClass:
        'h-earth-primitive-water-depth-band',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      rowBand:
        'R10-R11',

      previewRole:
        'nearshore wave band',

      xPercent:
        50,

      yPercent:
        50,

      widthCss:
        '104%',

      heightCss:
        '6%',

      action:
        'Inspect Context',

      readout:
        'Nearshore Context Read',

      receipt:
        'H_EARTH_NEARSHORE_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Nearshore wave band is context-only in the public stage. It does not activate swimming, fluid simulation, or traversal.'
    },

    {
      objectId:
        'OBJ_007_WATER_SURFACE_PLANE',

      label:
        'Water Surface Plane',

      classification:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      material:
        'water',

      materialClass:
        'h-earth-material-water',

      layerClass:
        'h-earth-layer-water-surface-plane',

      landscapeClass:
        'h-earth-landscape-water-plane',

      primitiveClass:
        'h-earth-primitive-water-plane',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      rowBand:
        'R12-R13',

      previewRole:
        'ocean body',

      xPercent:
        50,

      yPercent:
        40,

      widthCss:
        '112%',

      heightCss:
        '22%',

      action:
        'Inspect Context',

      readout:
        'Water Plane Context Read',

      receipt:
        'H_EARTH_WATER_PLANE_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Water surface plane is public-stage ocean context. It does not activate swimming, fluid simulation, or survival simulation.'
    },

    {
      objectId:
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',

      label:
        'Air Haze Light Layer',

      classification:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      material:
        'air-haze',

      materialClass:
        'h-earth-material-air-haze',

      layerClass:
        'h-earth-layer-air-haze-light',

      landscapeClass:
        'h-earth-landscape-air-haze-light',

      primitiveClass:
        'h-earth-primitive-atmospheric-layer',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      rowBand:
        'R12-R16',

      previewRole:
        'atmosphere and distance light',

      xPercent:
        50,

      yPercent:
        24,

      widthCss:
        '114%',

      heightCss:
        '32%',

      action:
        'Inspect Context',

      readout:
        'Atmospheric Context Read',

      receipt:
        'H_EARTH_ATMOSPHERIC_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Air haze and light are atmospheric context. They do not create weather simulation, traversal, or validation proof.'
    },

    {
      objectId:
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',

      label:
        'Mirror Manor Exterior Context',

      classification:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      material:
        'manor-context',

      materialClass:
        'h-earth-material-manor-context',

      layerClass:
        'h-earth-layer-manor-exterior-context',

      landscapeClass:
        'h-earth-landscape-manor-context',

      primitiveClass:
        'h-earth-primitive-layered-silhouette',

      zoneId:
        'ZONE_004_MANOR_CONTEXT_ZONE',

      rowBand:
        'R14-R15',

      previewRole:
        'elevated hill or cliff context',

      xPercent:
        71,

      yPercent:
        29,

      widthCss:
        '13%',

      heightCss:
        '13%',

      action:
        'Inspect Context',

      readout:
        'Distant Context Read',

      receipt:
        'H_EARTH_MANOR_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Mirror Manor is visible as elevated exterior context. It does not grant manor interior access or distant traversal.'
    },

    {
      objectId:
        'OBJ_010_SMALL_BEACH_STONES',

      label:
        'Small Beach Stones',

      classification:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      material:
        'stone',

      materialClass:
        'h-earth-material-stone',

      layerClass:
        'h-earth-layer-tide-pools-stones-rocks-detail',

      landscapeClass:
        'h-earth-landscape-ground-scatter-cluster',

      primitiveClass:
        'h-earth-primitive-scatter-cluster',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      rowBand:
        'R01-R05',

      previewRole:
        'foreground beach texture',

      xPercent:
        57,

      yPercent:
        82,

      widthCss:
        '4%',

      heightCss:
        '3%',

      action:
        'Inspect Context',

      readout:
        'Stone Context Read',

      receipt:
        'H_EARTH_STONE_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Small beach stones support the foreground inspection surface. They do not create collision, traversal, or gameplay authority.'
    },

    {
      objectId:
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',

      label:
        'Foreground Jagged Rocks',

      classification:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      material:
        'jagged-rock',

      materialClass:
        'h-earth-material-jagged-rock',

      layerClass:
        'h-earth-layer-tide-pools-stones-rocks-detail',

      landscapeClass:
        'h-earth-landscape-foreground-rocks',

      primitiveClass:
        'h-earth-primitive-rock-cluster',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      rowBand:
        'R01-R05',

      previewRole:
        'foreground rocky edge',

      xPercent:
        22,

      yPercent:
        84,

      widthCss:
        '10%',

      heightCss:
        '9%',

      action:
        'Inspect Context',

      readout:
        'Foreground Rock Context Read',

      receipt:
        'H_EARTH_ROCK_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Foreground jagged rocks support the visible inspection field. They do not create traversal, collision, or gameplay authority.'
    },

    {
      objectId:
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',

      label:
        'Distance Rock Stacks and Islets',

      classification:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      material:
        'distant-rock',

      materialClass:
        'h-earth-material-distant-rock',

      layerClass:
        'h-earth-layer-distant-world-context',

      landscapeClass:
        'h-earth-landscape-distant-world-context',

      primitiveClass:
        'h-earth-primitive-distant-cluster',

      zoneId:
        'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

      rowBand:
        'R14-R15',

      previewRole:
        'offshore distant forms',

      xPercent:
        28,

      yPercent:
        31,

      widthCss:
        '17%',

      heightCss:
        '8%',

      action:
        'Inspect Context',

      readout:
        'Distant Islet Context Read',

      receipt:
        'H_EARTH_DISTANT_ISLET_CONTEXT_RECEIPT_CANDIDATE',

      publicLine:
        'Distant rock stacks and islets remain context-only. They do not grant distant traversal or route-canon authority.'
    },

    {
      objectId:
        'OBJ_001_GROUND_SPAWN_ANCHOR',

      label:
        'Ground Spawn Anchor',

      classification:
        'STRUCTURAL_NOT_PUBLIC_READABLE',

      material:
        'inspection-anchor',

      materialClass:
        'h-earth-material-inspection-anchor',

      layerClass:
        'h-earth-layer-inspection-anchor-overlay',

      landscapeClass:
        'h-earth-landscape-primary-inspection-anchor',

      primitiveClass:
        'h-earth-primitive-inspection-anchor',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      rowBand:
        'R01-R05',

      previewRole:
        'structural anchor only',

      xPercent:
        50,

      yPercent:
        84,

      widthCss:
        '2.4rem',

      heightCss:
        '2.4rem',

      action:
        'Inspect Ground',

      readout:
        'Ground Condition Read',

      receipt:
        'H_EARTH_GROUND_INSPECTION_RECEIPT',

      publicLine:
        'Ground spawn anchor is structural only. It is displayed as an anchor marker, not as player or avatar authority.'
    }
  ]);


/* ==========================================================================
 * 08 · SOURCE-PREVIEW MODEL
 * ========================================================================== */

export const H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_MODEL =
  deepFreeze({
    previewId:
      'H_EARTH_3D_PUBLIC_STAGE_TEMPORARY_SOURCE_PREVIEW_STEP_034P',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

    previewClass:
      'DESCRIPTOR_ONLY_TEMPORARY_ROUTE_FALLBACK',

    matrix:
      'H-Earth',

    matrixRole:
      'Ground-View Matrix',

    activeCell:
      'H_EARTH_GROUND_CELL_001',

    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    displayPurpose:
      'Provide a temporary descriptor-only public-stage fallback before lawful renderer takeover or after renderer failure.',

    sourceSpineContracts:
      H_EARTH_3D_SOURCE_SPINE_CONTRACTS,

    sourceSpineArchiveCustody:
      H_EARTH_3D_SOURCE_SPINE_ARCHIVE_CUSTODY,

    bands:
      H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS,

    objects:
      H_EARTH_3D_PUBLIC_TARGETS,

    descriptorOnly:
      true,

    temporaryFallbackOnly:
      true,

    rendererDependencyRequiredForPreview:
      false,

    rendererMayTakeOverSameMount:
      true,

    previewDOMPreservedAfterRendererTakeover:
      false,

    previewMayBeRestoredAfterRendererFailure:
      true,

    runtimeExecution:
      false,

    runtimeLatticeActivation:
      false,

    active16x16RuntimeClaim:
      false,

    active256AddressRuntimeClaim:
      false,

    traversalClaim:
      false,

    survivalSimulationClaim:
      false,

    swimmingClaim:
      false,

    fluidSimulationClaim:
      false,

    manorInteriorAccessClaim:
      false,

    distantTraversalClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    matrixCollapse:
      false,

    boundary:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });


/* ==========================================================================
 * 09 · INTERNAL STATE
 * ========================================================================== */

const MODULE_STATE = {
  initialized:
    false,

  destroyed:
    false,

  status:
    H_EARTH_3D_PUBLIC_STAGE_STATUS.NOT_STARTED,

  initializationSequence:
    0,

  activeInitializationToken:
    null,

  activeInitializationKey:
    null,

  completionPromise:
    null,

  mountPoints:
    null,

  listenerAbortController:
    null,

  selectedTargetId:
    'OBJ_002_FOREGROUND_WET_SAND',

  generatedAt:
    null,

  sourcePreviewStatus:
    H_EARTH_3D_SOURCE_PREVIEW_STATUS.NOT_STARTED,

  sourcePreviewReceipt:
    null,

  compositorModule:
    null,

  compositorImportReceipt:
    null,

  compositorHandoff:
    null,

  compositorHandoffReceipt:
    null,

  rendererModule:
    null,

  rendererImportReceipt:
    null,

  rendererConstructReceipt:
    null,

  rendererMountReceipt:
    null,

  rendererReleaseReceipt:
    null,

  rendererBootstrapStatus:
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS.NOT_STARTED,

  layer4ImportReceipt:
    null,

  layer4StatusProjection:
    null,

  layer4PublicStageReceipt:
    null,

  routeBootstrapReceipt:
    null,

  routeBootstrapResult:
    null,

  asyncInitializationStarted:
    false,

  asyncInitializationComplete:
    false
};


/* ==========================================================================
 * 10 · INITIALIZATION IDENTITY AND OCCURRENCE RESET
 * ========================================================================== */

function createInitializationToken(sequence) {
  return deepFreeze({
    sequence,

    token:
      `H_EARTH_3D_ROUTE_INITIALIZATION_${sequence}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`
  });
}

function isActiveInitializationToken(token) {
  return (
    token !== null &&
    MODULE_STATE.activeInitializationToken === token &&
    MODULE_STATE.destroyed === false
  );
}

function createInitializationKey(
  options,
  rootDocument
) {
  return freezeInitializationKey({
    packet002Transfer:
      options.packet002Transfer ??
      null,

    packet002TransferOccurrenceId:
      options.packet002TransferOccurrenceId ??
      null,

    compositorFrameOccurrenceId:
      options.compositorFrameOccurrenceId ??
      null,

    presentationMode:
      options.presentationMode ??
      null,

    skipRendererBootstrap:
      options.skipRendererBootstrap ===
      true,

    skipLayer4DescriptorImport:
      options.skipLayer4DescriptorImport ===
      true,

    layer4BridgeModulePath:
      options.layer4BridgeModulePath ??
      H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH,

    document:
      rootDocument
  });
}

function initializationKeysMatch(
  left,
  right
) {
  return (
    left !== null &&
    right !== null &&

    left.packet002Transfer ===
      right.packet002Transfer &&

    left.packet002TransferOccurrenceId ===
      right.packet002TransferOccurrenceId &&

    left.compositorFrameOccurrenceId ===
      right.compositorFrameOccurrenceId &&

    left.presentationMode ===
      right.presentationMode &&

    left.skipRendererBootstrap ===
      right.skipRendererBootstrap &&

    left.skipLayer4DescriptorImport ===
      right.skipLayer4DescriptorImport &&

    left.layer4BridgeModulePath ===
      right.layer4BridgeModulePath &&

    left.document ===
      right.document
  );
}

function resetCurrentOccurrenceEvidence() {
  MODULE_STATE.sourcePreviewStatus =
    H_EARTH_3D_SOURCE_PREVIEW_STATUS.NOT_STARTED;

  MODULE_STATE.sourcePreviewReceipt =
    null;

  MODULE_STATE.compositorModule =
    null;

  MODULE_STATE.compositorImportReceipt =
    null;

  MODULE_STATE.compositorHandoff =
    null;

  MODULE_STATE.compositorHandoffReceipt =
    null;

  MODULE_STATE.rendererModule =
    null;

  MODULE_STATE.rendererImportReceipt =
    null;

  MODULE_STATE.rendererConstructReceipt =
    null;

  MODULE_STATE.rendererMountReceipt =
    null;

  MODULE_STATE.rendererReleaseReceipt =
    null;

  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS.NOT_STARTED;

  MODULE_STATE.layer4ImportReceipt =
    null;

  MODULE_STATE.layer4StatusProjection =
    null;

  MODULE_STATE.layer4PublicStageReceipt =
    null;

  MODULE_STATE.routeBootstrapReceipt =
    null;

  MODULE_STATE.routeBootstrapResult =
    null;

  MODULE_STATE.completionPromise =
    null;

  MODULE_STATE.asyncInitializationStarted =
    false;

  MODULE_STATE.asyncInitializationComplete =
    false;
}

function resetRoutePresentationState(
  mountPoints
) {
  const routeRoot =
    mountPoints?.routeRoot;

  if (!routeRoot) {
    return false;
  }

  routeRoot.classList.remove(
    'h-earth-3d-boot-ready',
    'h-earth-3d-boot-fallback',
    'h-earth-3d-boot-error'
  );

  const booleanDatasetKeys = [
    'hEarthModuleInitializationObserved',
    'hEarthSourcePreviewMounted',
    'hEarthSourcePreviewTakenOver',
    'hEarthRendererConstructed',
    'hEarthRendererMounted',
    'hEarthRunFunctionExecuted',
    'hEarthReplayExecuted',
    'hEarthVectorRunnerExecuted',
    'hEarthRuntimeExecuted',
    'hEarthCanonicalDigestGenerated',
    'hEarthReplayComparison',
    'hEarthValidationClaim',
    'hEarthProductionClaim',
    'hEarthRendererPassClaim',
    'hEarthVisualPassClaim',
    'hEarthMatrixCollapse'
  ];

  for (const key of booleanDatasetKeys) {
    routeRoot.dataset[key] =
      'false';
  }

  return true;
}

function clearPublishedActiveGlobals() {
  const keys = [
    'H_EARTH_3D_ROUTE_BOOTSTRAP_RESULT',
    'H_EARTH_3D_ROUTE_BOOTSTRAP_COMPLETION',
    'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
    'H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS',
    'H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT',
    'H_EARTH_3D_LAYER_4_STATUS_PROJECTION',
    'H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT',
    'H_EARTH_3D_PUBLIC_STAGE_ASYNC_FAILURE'
  ];

  for (const key of keys) {
    try {
      delete globalThis[key];
    } catch (_error) {
      globalThis[key] =
        undefined;
    }
  }
}


/* ==========================================================================
 * 11 · MOUNT RESOLUTION
 * ========================================================================== */

function resolveMountPoints(
  rootDocument =
    globalThis.document
) {
  const ids =
    H_EARTH_3D_PUBLIC_MOUNT_IDS;

  const routeRoot =
    getById(
      rootDocument,
      ids.routeRoot
    );

  const statusNode =
    getById(
      rootDocument,
      ids.status
    );

  const fallbackNode =
    getById(
      rootDocument,
      ids.fallback
    );

  const rendererMount =
    getById(
      rootDocument,
      ids.rendererMount
    );

  const missingRequiredIds = [];

  if (!routeRoot) {
    missingRequiredIds.push(
      ids.routeRoot
    );
  }

  if (!statusNode) {
    missingRequiredIds.push(
      ids.status
    );
  }

  if (!fallbackNode) {
    missingRequiredIds.push(
      ids.fallback
    );
  }

  if (!rendererMount) {
    missingRequiredIds.push(
      ids.rendererMount
    );
  }

  return Object.freeze({
    documentAvailable:
      Boolean(
        rootDocument &&
        typeof rootDocument.getElementById ===
          'function'
      ),

    routeRoot,
    statusNode,
    fallbackNode,
    rendererMount,

    actionInspectGround:
      getById(
        rootDocument,
        ids.actionInspectGround
      ),

    selectedTargetCard:
      getById(
        rootDocument,
        ids.selectedTargetCard
      ),

    selectedTargetLabel:
      getById(
        rootDocument,
        ids.selectedTargetLabel
      ),

    selectedTargetObjectId:
      getById(
        rootDocument,
        ids.selectedTargetObjectId
      ),

    selectedTargetClassification:
      getById(
        rootDocument,
        ids.selectedTargetClassification
      ),

    publicReadoutTitle:
      getById(
        rootDocument,
        ids.publicReadoutTitle
      ),

    publicReadoutLine:
      getById(
        rootDocument,
        ids.publicReadoutLine
      ),

    publicReadout:
      getById(
        rootDocument,
        ids.publicReadout
      ),

    targetList:
      getById(
        rootDocument,
        ids.targetList
      ),

    layer4StatusCard:
      getById(
        rootDocument,
        ids.layer4StatusCard
      ),

    layer4Status:
      getById(
        rootDocument,
        ids.layer4Status
      ),

    layer4Summary:
      getById(
        rootDocument,
        ids.layer4Summary
      ),

    layer4ProjectionPayload:
      getById(
        rootDocument,
        ids.layer4ProjectionPayload
      ),

    step012JContractId:
      getById(
        rootDocument,
        ids.step012JContractId
      ),

    step012H1ContractId:
      getById(
        rootDocument,
        ids.step012H1ContractId
      ),

    step012IContractId:
      getById(
        rootDocument,
        ids.step012IContractId
      ),

    step012ICanonicalizationId:
      getById(
        rootDocument,
        ids.step012ICanonicalizationId
      ),

    inspectionPanel:
      getById(
        rootDocument,
        ids.inspectionPanel
      ),

    debug:
      getById(
        rootDocument,
        ids.debug
      ),

    publicStageReceipt:
      getById(
        rootDocument,
        ids.publicStageReceipt
      ),

    copyStatus:
      getById(
        rootDocument,
        ids.copyStatus
      ),

    diagnosticLink:
      getById(
        rootDocument,
        ids.diagnosticLink
      ),

    requiredFound:
      missingRequiredIds.length ===
      0,

    missingRequiredIds:
      Object.freeze([
        ...missingRequiredIds
      ])
  });
}


/* ==========================================================================
 * 12 · TARGET READOUT
 * ========================================================================== */

function getTarget(targetId) {
  return (
    H_EARTH_3D_PUBLIC_TARGETS.find(
      (target) =>
        target.objectId ===
        targetId
    ) ??
    H_EARTH_3D_PUBLIC_TARGETS[0]
  );
}

function buildGroundConditionReadPayload(
  target =
    getTarget(
      MODULE_STATE.selectedTargetId
    )
) {
  return deepFreeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_GROUND_CONDITION_READ_PAYLOAD',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    generatedAt:
      nowIso(),

    matrix:
      'H-Earth',

    matrixRole:
      'Ground-View Matrix',

    activeCell:
      'H_EARTH_GROUND_CELL_001',

    selectedObjectId:
      target.objectId,

    selectedObjectLabel:
      target.label,

    selectedObjectClassification:
      target.classification,

    selectedMaterial:
      target.material,

    selectedZoneId:
      target.zoneId,

    selectedRowBand:
      target.rowBand,

    selectedPreviewRole:
      target.previewRole,

    action:
      target.action,

    readout:
      target.readout,

    receipt:
      target.receipt,

    publicLine:
      target.publicLine,

    descriptorOnly:
      true,

    rendererInteractionClaim:
      false,

    runtimeActionExecutionClaim:
      false,

    receiptPersistenceClaim:
      false,

    survivalSimulationClaim:
      false,

    traversalClaim:
      false,

    swimmingClaim:
      false,

    fluidSimulationClaim:
      false,

    manorInteriorAccessClaim:
      false,

    distantTraversalClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false,

    boundary:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function renderSelectedTarget(
  mountPoints,
  target
) {
  if (
    !mountPoints ||
    !target
  ) {
    return false;
  }

  writeText(
    mountPoints.selectedTargetLabel,
    target.label
  );

  writeText(
    mountPoints.selectedTargetObjectId,
    target.objectId
  );

  writeText(
    mountPoints.selectedTargetClassification,
    target.classification
  );

  writeText(
    mountPoints.publicReadoutTitle,
    `${target.label} · ${target.action}`
  );

  writeText(
    mountPoints.publicReadoutLine,
    target.publicLine
  );

  writeJson(
    mountPoints.inspectionPanel,
    buildGroundConditionReadPayload(
      target
    ),
    {
      maxDepth:
        8,

      maxArrayLength:
        120
    }
  );

  return true;
}


/* ==========================================================================
 * 13 · ROUTE-OWNED EVENT LISTENERS
 * ========================================================================== */

function getListenerOptions() {
  const signal =
    MODULE_STATE
      .listenerAbortController
      ?.signal;

  return signal
    ? {
        signal
      }
    : undefined;
}

function resetListenerController() {
  if (
    MODULE_STATE
      .listenerAbortController
  ) {
    MODULE_STATE
      .listenerAbortController
      .abort();
  }

  MODULE_STATE.listenerAbortController =
    typeof AbortController ===
    'function'
      ? new AbortController()
      : null;
}

function renderTargetList(
  mountPoints
) {
  if (
    !mountPoints?.targetList ||
    !mountPoints
      .targetList
      .ownerDocument
  ) {
    return false;
  }

  const rootDocument =
    mountPoints
      .targetList
      .ownerDocument;

  mountPoints
    .targetList
    .replaceChildren();

  const listenerOptions =
    getListenerOptions();

  for (
    const target
    of H_EARTH_3D_PUBLIC_TARGETS
  ) {
    const button =
      rootDocument.createElement(
        'button'
      );

    button.type =
      'button';

    button.className =
      'h-earth-3d-target-button';

    button.dataset.hEarthTargetId =
      target.objectId;

    button.dataset.hEarthTargetClassification =
      target.classification;

    button.dataset.hEarthZoneId =
      target.zoneId;

    button.dataset.hEarthRowBand =
      target.rowBand;

    button.setAttribute(
      'aria-current',
      target.objectId ===
        MODULE_STATE.selectedTargetId
        ? 'true'
        : 'false'
    );

    button.textContent =
      `${target.label} · ${target.classification}`;

    button.addEventListener(
      'click',
      () => {
        MODULE_STATE.selectedTargetId =
          target.objectId;

        for (
          const node
          of mountPoints
            .targetList
            .querySelectorAll(
              '[data-h-earth-target-id]'
            )
        ) {
          node.setAttribute(
            'aria-current',
            node.getAttribute(
              'data-h-earth-target-id'
            ) ===
              target.objectId
              ? 'true'
              : 'false'
          );
        }

        renderSelectedTarget(
          mountPoints,
          target
        );

        markPreviewSelectedObject(
          mountPoints,
          target.objectId
        );

        rebuildAndRenderPublicReceipts(
          mountPoints
        );
      },
      listenerOptions
    );

    mountPoints
      .targetList
      .appendChild(
        button
      );
  }

  return true;
}


/* ==========================================================================
 * 14 · SOURCE-PREVIEW DOM
 * ========================================================================== */

function clearSourcePreviewOwnedNodes(
  rendererMount
) {
  if (
    !rendererMount ||
    typeof rendererMount.querySelectorAll !==
      'function'
  ) {
    return deepFreeze({
      cleared:
        false,

      removedCount:
        0,

      failureCode:
        'RENDERER_MOUNT_UNAVAILABLE'
    });
  }

  const ownedNodes =
    Array.from(
      rendererMount.querySelectorAll(
        '[data-h-earth-source-preview-owned="true"]'
      )
    );

  for (const node of ownedNodes) {
    node.remove();
  }

  return deepFreeze({
    cleared:
      true,

    removedCount:
      ownedNodes.length
  });
}

function sourcePreviewExists(
  rendererMount
) {
  return Boolean(
    rendererMount?.querySelector?.(
      '[data-h-earth-source-preview-root="true"]'
    )
  );
}

function createPreviewLayer(
  rootDocument,
  layerClass,
  layerId
) {
  const layer =
    rootDocument.createElement(
      'div'
    );

  layer.className = [
    'h-earth-render-layer',
    layerClass,
    'h-earth-layer-member'
  ].join(
    ' '
  );

  layer.dataset.hEarthSourcePreviewOwned =
    'true';

  layer.dataset.hEarthSourcePreviewLayer =
    'true';

  layer.dataset.hEarthLayerId =
    layerId;

  return layer;
}

function createPreviewLabel(
  rootDocument,
  target
) {
  const label =
    rootDocument.createElement(
      'span'
    );

  label.className =
    'h-earth-render-label';

  label.dataset.hEarthSourcePreviewOwned =
    'true';

  label.dataset.hEarthSourcePreviewLabel =
    'true';

  label.textContent =
    target.label;

  return label;
}

function createPreviewObject(
  rootDocument,
  target
) {
  const objectNode =
    rootDocument.createElement(
      'button'
    );

  objectNode.type =
    'button';

  objectNode.className = [
    'h-earth-render-object',
    'h-earth-render-descriptor-only',
    target.materialClass,
    target.landscapeClass,
    target.primitiveClass,
    `h-earth-object-${normalizePreviewToken(
      target.objectId
    )}`,
    `h-earth-source-object-${normalizePreviewToken(
      target.objectId
    )}`,
    target.classification ===
      'PRIMARY_PUBLIC_INSPECTION_OBJECT'
      ? 'h-earth-context-primary-inspection h-earth-target-inspectable h-earth-target-selectable'
      : target.classification ===
          'SUPPORTING_PUBLIC_READABLE_OBJECT'
        ? 'h-earth-context-supporting-inspection h-earth-target-inspectable h-earth-target-selectable'
        : 'h-earth-context-only h-earth-target-context-only'
  ]
    .filter(Boolean)
    .join(' ');

  objectNode.dataset.hEarthSourcePreviewOwned =
    'true';

  objectNode.dataset.hEarthSourcePreviewObject =
    'true';

  objectNode.dataset.hEarthObjectId =
    target.objectId;

  objectNode.dataset.hEarthObjectLabel =
    target.label;

  objectNode.dataset.hEarthObjectClassification =
    target.classification;

  objectNode.dataset.hEarthZoneId =
    target.zoneId;

  objectNode.dataset.hEarthRowBand =
    target.rowBand;

  objectNode.dataset.hEarthPreviewRole =
    target.previewRole;

  objectNode.dataset.hEarthDescriptorOnly =
    'true';

  objectNode.dataset.hEarthRendererProof =
    'false';

  objectNode.dataset.hEarthVisualPassClaim =
    'false';

  objectNode.dataset.hEarthValidationClaim =
    'false';

  objectNode.dataset.hEarthProductionClaim =
    'false';

  objectNode.setAttribute(
    'aria-label',
    `${target.label}: ${target.previewRole}`
  );

  objectNode.style.left =
    `${target.xPercent}%`;

  objectNode.style.top =
    `${target.yPercent}%`;

  objectNode.style.width =
    target.widthCss;

  objectNode.style.height =
    target.heightCss;

  objectNode.style.transform =
    'translate3d(-50%, -50%, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1)';

  objectNode.addEventListener(
    'click',
    () => {
      MODULE_STATE.selectedTargetId =
        target.objectId;

      const mountPoints =
        MODULE_STATE.mountPoints;

      renderSelectedTarget(
        mountPoints,
        target
      );

      markPreviewSelectedObject(
        mountPoints,
        target.objectId
      );

      if (mountPoints?.targetList) {
        for (
          const node
          of mountPoints
            .targetList
            .querySelectorAll(
              '[data-h-earth-target-id]'
            )
        ) {
          node.setAttribute(
            'aria-current',
            node.getAttribute(
              'data-h-earth-target-id'
            ) ===
              target.objectId
              ? 'true'
              : 'false'
          );
        }
      }

      rebuildAndRenderPublicReceipts(
        mountPoints
      );
    },
    getListenerOptions()
  );

  objectNode.appendChild(
    createPreviewLabel(
      rootDocument,
      target
    )
  );

  return objectNode;
}

function createPreviewBand(
  rootDocument,
  band
) {
  const bandNode =
    rootDocument.createElement(
      'div'
    );

  bandNode.className =
    'h-earth-source-preview-band';

  bandNode.dataset.hEarthSourcePreviewOwned =
    'true';

  bandNode.dataset.hEarthSourcePreviewBand =
    band.bandId;

  bandNode.dataset.hEarthRowRange =
    band.rowRange;

  bandNode.dataset.hEarthZoneId =
    band.zoneId;

  bandNode.dataset.hEarthDepthClass =
    band.depthClass;

  bandNode.setAttribute(
    'aria-label',
    band.label
  );

  bandNode.style.position =
    'absolute';

  bandNode.style.left =
    '0';

  bandNode.style.right =
    '0';

  bandNode.style.top =
    band.cssTop;

  bandNode.style.height =
    band.cssHeight;

  bandNode.style.borderTop =
    '1px solid rgba(255, 255, 255, 0.045)';

  bandNode.style.pointerEvents =
    'none';

  return bandNode;
}

function createPreviewCaption(
  rootDocument
) {
  const caption =
    rootDocument.createElement(
      'div'
    );

  caption.className =
    'h-earth-source-preview-caption';

  caption.dataset.hEarthSourcePreviewOwned =
    'true';

  caption.dataset.hEarthSourcePreviewCaption =
    'true';

  caption.style.position =
    'absolute';

  caption.style.left =
    '18px';

  caption.style.top =
    '18px';

  caption.style.zIndex =
    '220';

  caption.style.maxWidth =
    'min(520px, calc(100% - 36px))';

  caption.style.padding =
    '10px 12px';

  caption.style.border =
    '1px solid rgba(149, 213, 232, 0.22)';

  caption.style.borderRadius =
    '12px';

  caption.style.background =
    'rgba(7, 16, 25, 0.62)';

  caption.style.color =
    'rgba(237, 247, 251, 0.86)';

  caption.style.fontSize =
    '0.76rem';

  caption.style.lineHeight =
    '1.35';

  caption.style.pointerEvents =
    'none';

  caption.textContent =
    'Temporary source preview · descriptor-only fallback · replaced by lawful renderer takeover · no renderer-pass or visual-pass claim.';

  return caption;
}

function createPreviewRoot(
  rootDocument
) {
  const previewRoot =
    rootDocument.createElement(
      'div'
    );

  previewRoot.className = [
    'h-earth-render-root',
    'h-earth-css-3d-candidate-root',
    'h-earth-render-scene',
    'h-earth-source-preview-root'
  ].join(
    ' '
  );

  previewRoot.dataset.hEarthSourcePreviewOwned =
    'true';

  previewRoot.dataset.hEarthSourcePreviewRoot =
    'true';

  previewRoot.dataset.hEarthPreviewContract =
    H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID;

  previewRoot.dataset.hEarthDescriptorOnly =
    'true';

  previewRoot.dataset.hEarthTemporaryFallback =
    'true';

  previewRoot.dataset.hEarthRuntimeExecution =
    'false';

  previewRoot.dataset.hEarthRendererProof =
    'false';

  previewRoot.dataset.hEarthVisualPassClaim =
    'false';

  previewRoot.dataset.hEarthValidationClaim =
    'false';

  previewRoot.dataset.hEarthProductionClaim =
    'false';

  previewRoot.dataset.hEarthMatrixCollapse =
    'false';

  return previewRoot;
}

function markPreviewSelectedObject(
  mountPoints,
  objectId
) {
  const rendererMount =
    mountPoints?.rendererMount;

  if (
    !rendererMount ||
    typeof rendererMount.querySelectorAll !==
      'function'
  ) {
    return false;
  }

  for (
    const node
    of rendererMount.querySelectorAll(
      '[data-h-earth-source-preview-object="true"]'
    )
  ) {
    const selected =
      node.getAttribute(
        'data-h-earth-object-id'
      ) === objectId;

    node.setAttribute(
      'aria-current',
      selected
        ? 'true'
        : 'false'
    );

    if (selected) {
      node.classList.add(
        'h-earth-context-primary-inspection'
      );

      node.classList.add(
        'h-earth-target-inspectable'
      );
    } else if (
      node.dataset
        .hEarthObjectClassification !==
      'PRIMARY_PUBLIC_INSPECTION_OBJECT'
    ) {
      node.classList.remove(
        'h-earth-context-primary-inspection'
      );
    }
  }

  return true;
}

function renderPublicSourcePreview(
  mountPoints,
  {
    restoration = false
  } = {}
) {
  const rendererMount =
    mountPoints?.rendererMount;

  if (
    !rendererMount ||
    !rendererMount.ownerDocument
  ) {
    MODULE_STATE.sourcePreviewStatus =
      H_EARTH_3D_SOURCE_PREVIEW_STATUS
        .FAILED;

    MODULE_STATE.sourcePreviewReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT',

        file:
          H_EARTH_3D_PUBLIC_ROUTE_FILE,

        contractId:
          H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

        generatedAt:
          nowIso(),

        sourcePreviewStatus:
          MODULE_STATE.sourcePreviewStatus,

        mounted:
          false,

        failureCode:
          'RENDERER_MOUNT_UNAVAILABLE',

        descriptorOnly:
          true,

        temporaryFallbackOnly:
          true,

        rendererPassClaim:
          false,

        visualPassClaim:
          false,

        validationClaim:
          false,

        productionClaim:
          false,

        matrixCollapse:
          false,

        boundary:
          H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
      });

    return MODULE_STATE
      .sourcePreviewReceipt;
  }

  const rootDocument =
    rendererMount.ownerDocument;

  const clearResult =
    clearSourcePreviewOwnedNodes(
      rendererMount
    );

  const previewRoot =
    createPreviewRoot(
      rootDocument
    );

  const bandLayer =
    createPreviewLayer(
      rootDocument,
      'h-earth-layer-air-haze-light',
      'source-preview-band-overlay-layer'
    );

  for (
    const band
    of H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS
  ) {
    bandLayer.appendChild(
      createPreviewBand(
        rootDocument,
        band
      )
    );
  }

  previewRoot.appendChild(
    bandLayer
  );

  const layersByClass =
    new Map();

  for (
    const target
    of H_EARTH_3D_PUBLIC_TARGETS
  ) {
    if (
      !layersByClass.has(
        target.layerClass
      )
    ) {
      layersByClass.set(
        target.layerClass,
        createPreviewLayer(
          rootDocument,
          target.layerClass,
          target.layerClass.replace(
            /^h-earth-layer-/,
            ''
          )
        )
      );
    }

    layersByClass
      .get(
        target.layerClass
      )
      .appendChild(
        createPreviewObject(
          rootDocument,
          target
        )
      );
  }

  for (
    const layer
    of layersByClass.values()
  ) {
    previewRoot.appendChild(
      layer
    );
  }

  previewRoot.appendChild(
    createPreviewCaption(
      rootDocument
    )
  );

  rendererMount.appendChild(
    previewRoot
  );

  markPreviewSelectedObject(
    mountPoints,
    MODULE_STATE.selectedTargetId
  );

  MODULE_STATE.sourcePreviewStatus =
    restoration
      ? H_EARTH_3D_SOURCE_PREVIEW_STATUS
          .RESTORED
      : H_EARTH_3D_SOURCE_PREVIEW_STATUS
          .MOUNTED;

  MODULE_STATE.sourcePreviewReceipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT',

      file:
        H_EARTH_3D_PUBLIC_ROUTE_FILE,

      contractId:
        H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

      renewedFrom:
        H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

      generatedAt:
        nowIso(),

      sourcePreviewStatus:
        MODULE_STATE.sourcePreviewStatus,

      mounted:
        true,

      restoration,

      rendererMountNodeFound:
        true,

      priorSourcePreviewNodesCleared:
        clearResult.cleared ===
        true,

      priorSourcePreviewNodeCountRemoved:
        clearResult.removedCount ??
        0,

      previewModel:
        H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_MODEL,

      displayedBandCount:
        H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS
          .length,

      displayedObjectCount:
        H_EARTH_3D_PUBLIC_TARGETS
          .length,

      selectedTargetId:
        MODULE_STATE.selectedTargetId,

      descriptorOnly:
        true,

      temporaryFallbackOnly:
        true,

      rendererDependencyRequiredForPreview:
        false,

      rendererTakeoverMayReplacePreviewDOM:
        true,

      previewDOMPreservedAfterRendererTakeover:
        false,

      sourcePreviewCreatesDOMNodes:
        true,

      sourcePreviewCreatesDOMCSSCandidateDisplayOnly:
        true,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false,

      runtimeExecution:
        false,

      traversalClaim:
        false,

      survivalSimulationClaim:
        false,

      swimmingClaim:
        false,

      fluidSimulationClaim:
        false,

      manorInteriorAccessClaim:
        false,

      distantTraversalClaim:
        false,

      matrixCollapse:
        false,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

  globalThis
    .H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT =
    MODULE_STATE.sourcePreviewReceipt;

  return MODULE_STATE
    .sourcePreviewReceipt;
}

function markSourcePreviewTakenOver() {
  MODULE_STATE.sourcePreviewStatus =
    H_EARTH_3D_SOURCE_PREVIEW_STATUS
      .TAKEN_OVER;

  MODULE_STATE.sourcePreviewReceipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_TAKEOVER_RECEIPT',

      file:
        H_EARTH_3D_PUBLIC_ROUTE_FILE,

      contractId:
        H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

      generatedAt:
        nowIso(),

      sourcePreviewStatus:
        MODULE_STATE.sourcePreviewStatus,

      mounted:
        false,

      rendererTakeover:
        true,

      previewDOMPreserved:
        false,

      previewMetadataPreservedInReceipt:
        true,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false,

      matrixCollapse:
        false
    });

  return MODULE_STATE
    .sourcePreviewReceipt;
}


/* ==========================================================================
 * 15 · LAYER 4 PROJECTION
 * ========================================================================== */

function buildStaticLayer4Projection(
  status =
    H_EARTH_3D_LAYER_4_STATUS
      .STATIC_METADATA_PROJECTED
) {
  return deepFreeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_LAYER_4_STATUS_PROJECTION',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    generatedAt:
      nowIso(),

    projectionClass:
      'NARROW_PUBLIC_STAGE_PLAIN_DATA_PROJECTION',

    bridgeStatus:
      status,

    bridgeMode:
      'STEP_012J_READ_ONLY_RELATIONSHIP_DESCRIPTOR',

    step012JContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS
        .step012JContractId,

    step012H1ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS
        .step012H1ContractId,

    step012IContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS
        .step012IContractId,

    step012ICanonicalizationId:
      H_EARTH_3D_LAYER_4_CONTRACTS
        .step012ICanonicalizationId,

    target002ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS
        .target002ContractId,

    target003ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS
        .target003ContractId,

    step012IRunnerContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS
        .step012IRunnerContractId,

    archiveCustodyStatus:
      H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY
        .archiveCustodyStatus,

    archiveCustody:
      H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,

    moduleImportAttempted:
      false,

    moduleInitializationObserved:
      false,

    importedDescriptorContractMatchesExpected:
      false,

    publicStageExecutionStatus:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    displayPolicy:
      {
        narrowPlainDataProjectionOnly:
          true,

        callableFunctionsDisplayedAsInputs:
          false,

        wholeStep012JAggregateDisplayed:
          false,

        descriptorClaimsReinterpretedAsExecutionEvidence:
          false,

        successfulRenderingLabeledAsValidation:
          false
      },

    boundary:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function normalizeImportedBridgeProjection(
  importReceipt,
  bridgeModule
) {
  const targetClassification =
    bridgeModule
      ?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_TARGET_CLASSIFICATION ??
    bridgeModule
      ?.default
      ?.targetClassification ??
    null;

  const authority =
    bridgeModule
      ?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_AUTHORITY ??
    bridgeModule
      ?.default
      ?.authority ??
    null;

  const contractId =
    bridgeModule
      ?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_CONTRACT_ID ??
    bridgeModule
      ?.default
      ?.contractId ??
    authority
      ?.contractId ??
    null;

  const expected =
    H_EARTH_3D_LAYER_4_CONTRACTS;

  return deepFreeze({
    ...buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS
        .DESCRIPTOR_IMPORT_OBSERVED
    ),

    bridgeMode:
      authority
        ?.activeStatusCeiling ??
      'STATIC_BRIDGE_DESCRIPTOR_ONLY',

    step012JContractId:
      contractId ??
      expected.step012JContractId,

    step012H1ContractId:
      targetClassification
        ?.importedStep012H1ContractId ??
      targetClassification
        ?.expectedStep012H1ContractId ??
      expected.step012H1ContractId,

    step012IContractId:
      targetClassification
        ?.importedStep012IContractId ??
      targetClassification
        ?.expectedStep012IContractId ??
      expected.step012IContractId,

    step012ICanonicalizationId:
      targetClassification
        ?.importedStep012ICanonicalizationId ??
      targetClassification
        ?.expectedStep012ICanonicalizationId ??
      expected.step012ICanonicalizationId,

    moduleImportAttempted:
      true,

    moduleInitializationObserved:
      importReceipt
        ?.importSucceeded ===
      true,

    importedDescriptorContractMatchesExpected:
      contractId ===
      expected.step012JContractId,

    importReceipt
  });
}

async function readLayer4BridgeDescriptor(
  options,
  token
) {
  if (
    options.skipLayer4DescriptorImport ===
    true
  ) {
    const importReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',

        file:
          H_EARTH_3D_PUBLIC_ROUTE_FILE,

        contractId:
          H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

        importAttempted:
          false,

        importSkipped:
          true,

        importSucceeded:
          false,

        moduleInitializationObserved:
          false,

        layer4BridgeModulePath:
          options.layer4BridgeModulePath ??
          H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH,

        reason:
          'skipLayer4DescriptorImport option was true.',

        executionClaims:
          H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING
      });

    const projection =
      buildStaticLayer4Projection(
        H_EARTH_3D_LAYER_4_STATUS
          .DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED
      );

    if (
      isActiveInitializationToken(
        token
      )
    ) {
      MODULE_STATE.layer4ImportReceipt =
        importReceipt;

      MODULE_STATE.layer4StatusProjection =
        projection;
    }

    return projection;
  }

  const modulePath =
    options.layer4BridgeModulePath ??
    H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH;

  try {
    const bridgeModule =
      await import(
        modulePath
      );

    const importReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',

        file:
          H_EARTH_3D_PUBLIC_ROUTE_FILE,

        contractId:
          H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

        importAttempted:
          true,

        importSkipped:
          false,

        importSucceeded:
          true,

        moduleInitializationObserved:
          true,

        layer4BridgeModulePath:
          modulePath,

        moduleExportKeys:
          Object.keys(
            bridgeModule ??
            {}
          ),

        executionClaims:
          H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING
      });

    const projection =
      normalizeImportedBridgeProjection(
        importReceipt,
        bridgeModule
      );

    if (
      isActiveInitializationToken(
        token
      )
    ) {
      MODULE_STATE.layer4ImportReceipt =
        importReceipt;

      MODULE_STATE.layer4StatusProjection =
        projection;
    }

    return projection;
  } catch (error) {
    const importReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',

        file:
          H_EARTH_3D_PUBLIC_ROUTE_FILE,

        contractId:
          H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

        importAttempted:
          true,

        importSkipped:
          false,

        importSucceeded:
          false,

        moduleInitializationObserved:
          false,

        layer4BridgeModulePath:
          modulePath,

        errorName:
          error instanceof Error
            ? error.name
            : 'UnknownError',

        errorMessage:
          error instanceof Error
            ? error.message
            : String(error),

        staticCustodyMetadataRetained:
          true,

        executionClaims:
          H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING
      });

    const projection =
      deepFreeze({
        ...buildStaticLayer4Projection(
          H_EARTH_3D_LAYER_4_STATUS
            .DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED
        ),

        moduleImportAttempted:
          true,

        moduleInitializationObserved:
          false,

        importReceipt
      });

    if (
      isActiveInitializationToken(
        token
      )
    ) {
      MODULE_STATE.layer4ImportReceipt =
        importReceipt;

      MODULE_STATE.layer4StatusProjection =
        projection;
    }

    return projection;
  }
}

function renderLayer4Projection(
  mountPoints,
  projection
) {
  if (
    !mountPoints ||
    !projection
  ) {
    return false;
  }

  writeText(
    mountPoints.layer4Status,
    projection.bridgeStatus
  );

  writeText(
    mountPoints.layer4Summary,
    projection
      .moduleInitializationObserved ===
    true
      ? 'Step 012J module initialization was observed through public-stage import. No runner, replay, vector, runtime, digest, comparison, validation, production, renderer-pass, visual-pass, or matrix-collapse execution is claimed.'
      : 'Step 012J remains projected as read-only static custody metadata. No runner, replay, vector, runtime, digest, comparison, validation, production, renderer-pass, visual-pass, or matrix-collapse execution is claimed.'
  );

  writeText(
    mountPoints.step012JContractId,
    projection.step012JContractId
  );

  writeText(
    mountPoints.step012H1ContractId,
    projection.step012H1ContractId
  );

  writeText(
    mountPoints.step012IContractId,
    projection.step012IContractId
  );

  writeText(
    mountPoints.step012ICanonicalizationId,
    projection.step012ICanonicalizationId
  );

  writeJson(
    mountPoints.layer4ProjectionPayload,
    projection,
    {
      maxDepth:
        9,

      maxArrayLength:
        160
    }
  );

  return true;
}


/* ==========================================================================
 * 16 · RENDERER BOOTSTRAP INPUT
 * ========================================================================== */

function evaluateRendererBootstrapInput(
  options
) {
  const issues = [];

  if (
    options.skipRendererBootstrap ===
    true
  ) {
    return deepFreeze({
      eligible:
        false,

      skipped:
        true,

      status:
        H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
          .SKIPPED,

      issues:
        [
          'skipRendererBootstrap option was true.'
        ]
    });
  }

  if (
    !isPlainRecord(
      options.packet002Transfer
    )
  ) {
    issues.push(
      'packet002Transfer must be a strict plain record supplied by an authorized upstream producer.'
    );
  }

  if (
    !isNonEmptyExactString(
      options.packet002TransferOccurrenceId
    )
  ) {
    issues.push(
      'packet002TransferOccurrenceId must be an exact nonempty string.'
    );
  }

  if (
    !isNonEmptyExactString(
      options.compositorFrameOccurrenceId
    )
  ) {
    issues.push(
      'compositorFrameOccurrenceId must be an exact nonempty string.'
    );
  }

  if (
    !isNonEmptyExactString(
      options.presentationMode
    )
  ) {
    issues.push(
      'presentationMode must be an exact nonempty string.'
    );
  }

  return deepFreeze({
    eligible:
      issues.length ===
      0,

    skipped:
      false,

    status:
      issues.length ===
      0
        ? 'RENDERER_BOOTSTRAP_INPUT_ELIGIBLE'
        : H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
            .INPUT_REJECTED,

    issues
  });
}


/* ==========================================================================
 * 17 · EXACT MODULE AUTHORITY
 * ========================================================================== */

function evaluateCompositorModule(
  compositorModule
) {
  const handoffFunction =
    compositorModule
      ?.getHEarth3DCompositorRendererHandoff;

  const contractId =
    compositorModule
      ?.H_EARTH_3D_COMPOSITOR_CONTRACT_ID ??
    null;

  const contractMatchesExpected =
    contractId ===
    H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID;

  return deepFreeze({
    eligible:
      contractMatchesExpected &&
      typeof handoffFunction ===
        'function',

    expectedContractId:
      H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID,

    actualContractId:
      contractId,

    contractMatchesExpected,

    exactHandoffExportPresent:
      typeof handoffFunction ===
      'function',

    handoffFunction:
      typeof handoffFunction ===
      'function'
        ? handoffFunction
        : null
  });
}

function evaluateRendererModule(
  rendererModule
) {
  const constructFunction =
    rendererModule
      ?.constructHEarth3DRenderer;

  const mountFunction =
    rendererModule
      ?.mountHEarth3DRenderer;

  const releaseFunction =
    rendererModule
      ?.releaseHEarth3DRenderer;

  const destroyFunction =
    rendererModule
      ?.destroyHEarth3DRenderer;

  const stateGetter =
    rendererModule
      ?.getHEarth3DRendererState;

  const contractId =
    rendererModule
      ?.H_EARTH_3D_RENDERER_CONTRACT_ID ??
    null;

  const contractMatchesExpected =
    contractId ===
    H_EARTH_3D_EXPECTED_RENDERER_CONTRACT_ID;

  return deepFreeze({
    eligible:
      contractMatchesExpected &&
      typeof constructFunction ===
        'function' &&
      typeof mountFunction ===
        'function' &&
      typeof releaseFunction ===
        'function',

    expectedContractId:
      H_EARTH_3D_EXPECTED_RENDERER_CONTRACT_ID,

    actualContractId:
      contractId,

    contractMatchesExpected,

    exactConstructExportPresent:
      typeof constructFunction ===
      'function',

    exactMountExportPresent:
      typeof mountFunction ===
      'function',

    exactReleaseExportPresent:
      typeof releaseFunction ===
      'function',

    constructFunction:
      typeof constructFunction ===
      'function'
        ? constructFunction
        : null,

    mountFunction:
      typeof mountFunction ===
      'function'
        ? mountFunction
        : null,

    releaseFunction:
      typeof releaseFunction ===
      'function'
        ? releaseFunction
        : null,

    destroyFunction:
      typeof destroyFunction ===
      'function'
        ? destroyFunction
        : null,

    stateGetter:
      typeof stateGetter ===
      'function'
        ? stateGetter
        : null
  });
}


/* ==========================================================================
 * 18 · RENDERER CLEANUP
 * ========================================================================== */

function releaseRendererSafely({
  cleanupReason = null
} = {}) {
  const releaseFunction =
    MODULE_STATE.rendererModule
      ?.releaseHEarth3DRenderer;

  if (
    typeof releaseFunction !==
    'function'
  ) {
    MODULE_STATE.rendererReleaseReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_ROUTE_RENDERER_RELEASE_RECEIPT',

        cleanupReason,

        releaseAttempted:
          false,

        released:
          false,

        status:
          'RENDERER_RELEASE_FUNCTION_UNAVAILABLE'
      });

    return MODULE_STATE
      .rendererReleaseReceipt;
  }

  try {
    const rawReceipt =
      releaseFunction();

    MODULE_STATE.rendererReleaseReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_ROUTE_RENDERER_RELEASE_RECEIPT',

        cleanupReason,

        releaseAttempted:
          true,

        released:
          rawReceipt
            ?.released ===
          true,

        status:
          rawReceipt
            ?.status ??
          'RENDERER_RELEASE_CALLED',

        rawReceipt:
          safeSerialize(
            rawReceipt,
            {
              maxDepth:
                6,

              maxArrayLength:
                80
            }
          )
      });

    return MODULE_STATE
      .rendererReleaseReceipt;
  } catch (error) {
    MODULE_STATE.rendererReleaseReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_ROUTE_RENDERER_RELEASE_RECEIPT',

        cleanupReason,

        releaseAttempted:
          true,

        released:
          false,

        status:
          'RENDERER_RELEASE_THREW',

        errorName:
          error instanceof Error
            ? error.name
            : 'UnknownError',

        errorMessage:
          error instanceof Error
            ? error.message
            : String(error)
      });

    return MODULE_STATE
      .rendererReleaseReceipt;
  }
}


/* ==========================================================================
 * 19 · STRICT RENDERER BOOTSTRAP
 * ========================================================================== */

function createStaleRendererBootstrapReceipt({
  phase
} = {}) {
  return deepFreeze({
    receiptType:
      'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

    completed:
      false,

    mounted:
      false,

    stale:
      true,

    status:
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .STALE_COMPLETION,

    stalePhase:
      phase ??
      'UNSPECIFIED_STALE_PHASE',

    sharedCurrentStateMutated:
      false,

    rendererBootstrapStatusMutated:
      false,

    activeImportEvidenceMutated:
      false,

    activeModuleReferencesMutated:
      false,

    activeHandoffEvidenceMutated:
      false,

    activeConstructEvidenceMutated:
      false,

    activeMountEvidenceMutated:
      false,

    activeGlobalEvidencePublished:
      false,

    rendererCleanupAttempted:
      false,

    currentDOMMutated:
      false,

    sourcePreviewRestorationAttempted:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false
  });
}

async function bootstrapRenderer(
  mountPoints,
  options,
  token
) {
  const inputEvaluation =
    evaluateRendererBootstrapInput(
      options
    );

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'INPUT_EVALUATION'
    });
  }

  if (inputEvaluation.skipped) {
    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .SKIPPED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      skipped:
        true,

      status:
        primaryStatus,

      inputEvaluation,

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  if (!inputEvaluation.eligible) {
    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .INPUT_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      skipped:
        false,

      status:
        primaryStatus,

      inputEvaluation,

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .IMPORT_PENDING;

  let compositorModule;
  let rendererModule;

  try {
    [
      compositorModule,
      rendererModule
    ] = await Promise.all([
      import(
        H_EARTH_3D_COMPOSITOR_MODULE_PATH
      ),

      import(
        H_EARTH_3D_RENDERER_MODULE_PATH
      )
    ]);
  } catch (error) {
    if (
      !isActiveInitializationToken(
        token
      )
    ) {
      return createStaleRendererBootstrapReceipt({
        phase:
          'IMPORT_REJECTION'
      });
    }

    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .IMPORT_FAILED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

        completed:
          true,

        mounted:
          false,

        status:
          primaryStatus,

        compositorModulePath:
          H_EARTH_3D_COMPOSITOR_MODULE_PATH,

        rendererModulePath:
          H_EARTH_3D_RENDERER_MODULE_PATH,

        productionModulePathOverridesAccepted:
          false,

        errorName:
          error instanceof Error
            ? error.name
            : 'UnknownError',

        errorMessage:
          error instanceof Error
            ? error.message
            : String(error),

        sourcePreviewRetained:
          sourcePreviewExists(
            mountPoints.rendererMount
          ),

        rendererPassClaim:
          false,

        visualPassClaim:
          false,

        validationClaim:
          false,

        productionClaim:
          false
      });

    MODULE_STATE.compositorImportReceipt =
      receipt;

    MODULE_STATE.rendererImportReceipt =
      receipt;

    return receipt;
  }

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'IMPORT_RESOLUTION'
    });
  }

  const compositorEvaluation =
    evaluateCompositorModule(
      compositorModule
    );

  const rendererEvaluation =
    evaluateRendererModule(
      rendererModule
    );

  MODULE_STATE.compositorModule =
    compositorModule;

  MODULE_STATE.rendererModule =
    rendererModule;

  MODULE_STATE.compositorImportReceipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_IMPORT_RECEIPT',

      importSucceeded:
        true,

      modulePath:
        H_EARTH_3D_COMPOSITOR_MODULE_PATH,

      productionModulePathOverrideUsed:
        false,

      moduleKeys:
        Object.keys(
          compositorModule
        ),

      evaluation:
        compositorEvaluation
    });

  MODULE_STATE.rendererImportReceipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_IMPORT_RECEIPT',

      importSucceeded:
        true,

      modulePath:
        H_EARTH_3D_RENDERER_MODULE_PATH,

      productionModulePathOverrideUsed:
        false,

      moduleKeys:
        Object.keys(
          rendererModule
        ),

      evaluation:
        rendererEvaluation
    });

  if (
    !compositorEvaluation.eligible ||
    !rendererEvaluation.eligible
  ) {
    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .API_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      compositorEvaluation,

      rendererEvaluation,

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .HANDOFF_PENDING;

  let compositorHandoff;

  try {
    compositorHandoff =
      compositorEvaluation
        .handoffFunction({
          packet002Transfer:
            options.packet002Transfer,

          packet002TransferOccurrenceId:
            options.packet002TransferOccurrenceId,

          compositorFrameOccurrenceId:
            options.compositorFrameOccurrenceId,

          presentationMode:
            options.presentationMode
        });
  } catch (error) {
    if (
      !isActiveInitializationToken(
        token
      )
    ) {
      return createStaleRendererBootstrapReceipt({
        phase:
          'HANDOFF_REJECTION'
      });
    }

    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .HANDOFF_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      failureVariant:
        'COMPOSITOR_HANDOFF_REQUEST_THREW',

      errorName:
        error instanceof Error
          ? error.name
          : 'UnknownError',

      errorMessage:
        error instanceof Error
          ? error.message
          : String(error),

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'HANDOFF_RESOLUTION'
    });
  }

  const okSignalObserved =
    compositorHandoff
      ?.ok ===
    true;

  const compositorContractIdMatchesExpected =
    compositorHandoff
      ?.contractId ===
    H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID;

  const admittedGeometryFrameContractIdPresent =
    isNonEmptyExactString(
      compositorHandoff
        ?.admittedGeometryFrameContractId
    );

  const admittedGeometryFramePresent =
    isPlainRecord(
      compositorHandoff
        ?.admittedGeometryFrame
    );

  const localCompositorHandoffReceipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_COMPOSITOR_HANDOFF_RECEIPT',

      requested:
        true,

      okSignalObserved,

      handoffPresentedForRendererValidation:
        (
          okSignalObserved &&
          compositorContractIdMatchesExpected &&
          admittedGeometryFrameContractIdPresent &&
          admittedGeometryFramePresent
        ),

      routeClaimsHandoffFullyValidated:
        false,

      expectedCompositorContractId:
        H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID,

      observedCompositorContractId:
        compositorHandoff
          ?.contractId ??
        null,

      compositorContractIdMatchesExpected,

      admittedGeometryFrameContractId:
        compositorHandoff
          ?.admittedGeometryFrameContractId ??
        null,

      admittedGeometryFrameContractIdPresent,

      admittedGeometryFramePresent,

      rendererRemainsFinalBoundaryValidator:
        true,

      rawHandoff:
        safeSerialize(
          compositorHandoff,
          {
            maxDepth:
              5,

            maxArrayLength:
              40
          }
        )
    });

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'HANDOFF_EVIDENCE_COMMIT'
    });
  }

  MODULE_STATE.compositorHandoff =
    compositorHandoff;

  MODULE_STATE.compositorHandoffReceipt =
    localCompositorHandoffReceipt;

  if (
    !okSignalObserved ||
    !compositorContractIdMatchesExpected ||
    !admittedGeometryFrameContractIdPresent ||
    !admittedGeometryFramePresent
  ) {
    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .HANDOFF_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      compositorHandoffReceipt:
        localCompositorHandoffReceipt,

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .CONSTRUCTION_PENDING;

  let constructReceipt;

  try {
    constructReceipt =
      rendererEvaluation
        .constructFunction(
          compositorHandoff
        );
  } catch (error) {
    if (
      !isActiveInitializationToken(
        token
      )
    ) {
      return createStaleRendererBootstrapReceipt({
        phase:
          'CONSTRUCTION_REJECTION'
      });
    }

    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .CONSTRUCTION_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      failureVariant:
        'RENDERER_CONSTRUCTION_THREW',

      errorName:
        error instanceof Error
          ? error.name
          : 'UnknownError',

      errorMessage:
        error instanceof Error
          ? error.message
          : String(error),

      compositorHandoffReceipt:
        localCompositorHandoffReceipt,

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'CONSTRUCTION_RESOLUTION'
    });
  }

  MODULE_STATE.rendererConstructReceipt =
    constructReceipt;

  if (
    constructReceipt
      ?.constructed !==
    true
  ) {
    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .CONSTRUCTION_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      compositorHandoffReceipt:
        localCompositorHandoffReceipt,

      rendererConstructReceipt:
        safeSerialize(
          constructReceipt,
          {
            maxDepth:
              6,

            maxArrayLength:
              80
          }
        ),

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .MOUNT_PENDING;

  let mountReceipt;

  try {
    mountReceipt =
      rendererEvaluation
        .mountFunction({
          mountElement:
            mountPoints.rendererMount
        });
  } catch (error) {
    if (
      !isActiveInitializationToken(
        token
      )
    ) {
      return createStaleRendererBootstrapReceipt({
        phase:
          'MOUNT_REJECTION'
      });
    }

    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .MOUNT_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    if (
      !sourcePreviewExists(
        mountPoints.rendererMount
      )
    ) {
      renderPublicSourcePreview(
        mountPoints,
        {
          restoration:
            true
        }
      );
    }

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      failureVariant:
        'RENDERER_MOUNT_THREW',

      errorName:
        error instanceof Error
          ? error.name
          : 'UnknownError',

      errorMessage:
        error instanceof Error
          ? error.message
          : String(error),

      rendererConstructReceipt:
        safeSerialize(
          constructReceipt,
          {
            maxDepth:
              6,

            maxArrayLength:
              80
          }
        ),

      sourcePreviewRestored:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'MOUNT_RESOLUTION'
    });
  }

  MODULE_STATE.rendererMountReceipt =
    mountReceipt;

  if (
    mountReceipt
      ?.mounted !==
    true
  ) {
    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .MOUNT_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    if (
      !sourcePreviewExists(
        mountPoints.rendererMount
      )
    ) {
      renderPublicSourcePreview(
        mountPoints,
        {
          restoration:
            true
        }
      );
    }

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      rendererConstructReceipt:
        safeSerialize(
          constructReceipt,
          {
            maxDepth:
              6,

            maxArrayLength:
              80
          }
        ),

      rendererMountReceipt:
        safeSerialize(
          mountReceipt,
          {
            maxDepth:
              6,

            maxArrayLength:
              80
          }
        ),

      sourcePreviewRestored:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'PREVIEW_TAKEOVER'
    });
  }

  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .MOUNTED;

  markSourcePreviewTakenOver();

  return deepFreeze({
    receiptType:
      'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

    completed:
      true,

    mounted:
      true,

    status:
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .MOUNTED,

    compositorModulePath:
      H_EARTH_3D_COMPOSITOR_MODULE_PATH,

    rendererModulePath:
      H_EARTH_3D_RENDERER_MODULE_PATH,

    productionModulePathOverridesAccepted:
      false,

    compositorContractId:
      compositorEvaluation
        .actualContractId,

    rendererContractId:
      rendererEvaluation
        .actualContractId,

    compositorHandoffReceipt:
      localCompositorHandoffReceipt,

    rendererConstructReceipt:
      safeSerialize(
        constructReceipt,
        {
          maxDepth:
            6,

          maxArrayLength:
            80
        }
      ),

    rendererMountReceipt:
      safeSerialize(
        mountReceipt,
        {
          maxDepth:
            6,

          maxArrayLength:
            80
        }
      ),

    previewTakeover:
      true,

    previewDOMPreserved:
      false,

    previewMetadataPreserved:
      true,

    exactCompositorContractRequired:
      true,

    exactRendererContractRequired:
      true,

    exactRendererConstructAPIUsed:
      true,

    exactRendererMountAPIUsed:
      true,

    canonicalMountElementFieldUsed:
      true,

    packet002ConstructedByRoute:
      false,

    admittedFrameConstructedByRoute:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false
  });
}


/* ==========================================================================
 * 20 · ROUTE DATASETS
 * ========================================================================== */

function updateRouteRootExecutionDataset(
  mountPoints
) {
  const routeRoot =
    mountPoints?.routeRoot;

  if (!routeRoot?.dataset) {
    return false;
  }

  routeRoot.dataset
    .hEarthModuleInitializationObserved =
    MODULE_STATE
      .layer4StatusProjection
      ?.moduleInitializationObserved ===
    true
      ? 'true'
      : 'false';

  routeRoot.dataset
    .hEarthSourcePreviewMounted =
    (
      MODULE_STATE.sourcePreviewStatus ===
        H_EARTH_3D_SOURCE_PREVIEW_STATUS
          .MOUNTED ||
      MODULE_STATE.sourcePreviewStatus ===
        H_EARTH_3D_SOURCE_PREVIEW_STATUS
          .RESTORED
    )
      ? 'true'
      : 'false';

  routeRoot.dataset
    .hEarthSourcePreviewTakenOver =
    MODULE_STATE.sourcePreviewStatus ===
      H_EARTH_3D_SOURCE_PREVIEW_STATUS
        .TAKEN_OVER
      ? 'true'
      : 'false';

  routeRoot.dataset
    .hEarthRendererConstructed =
    MODULE_STATE
      .rendererConstructReceipt
      ?.constructed ===
    true
      ? 'true'
      : 'false';

  routeRoot.dataset
    .hEarthRendererMounted =
    MODULE_STATE
      .rendererMountReceipt
      ?.mounted ===
    true
      ? 'true'
      : 'false';

  routeRoot.dataset
    .hEarthRunFunctionExecuted =
    'false';

  routeRoot.dataset
    .hEarthReplayExecuted =
    'false';

  routeRoot.dataset
    .hEarthVectorRunnerExecuted =
    'false';

  routeRoot.dataset
    .hEarthRuntimeExecuted =
    'false';

  routeRoot.dataset
    .hEarthCanonicalDigestGenerated =
    'false';

  routeRoot.dataset
    .hEarthReplayComparison =
    'false';

  routeRoot.dataset
    .hEarthValidationClaim =
    'false';

  routeRoot.dataset
    .hEarthProductionClaim =
    'false';

  routeRoot.dataset
    .hEarthRendererPassClaim =
    'false';

  routeRoot.dataset
    .hEarthVisualPassClaim =
    'false';

  routeRoot.dataset
    .hEarthMatrixCollapse =
    'false';

  return true;
}


/* ==========================================================================
 * 21 · RECEIPTS
 * ========================================================================== */

function buildLayer4PublicStageReceipt() {
  const projection =
    MODULE_STATE.layer4StatusProjection ??
    buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS
        .DESCRIPTOR_IMPORT_PENDING
    );

  return deepFreeze({
    receiptType:
      'H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    generatedAt:
      nowIso(),

    publicRoute:
      H_EARTH_3D_PUBLIC_ROUTE,

    diagnosticRoute:
      H_EARTH_3D_DIAGNOSTIC_ROUTE,

    publicStageAdapter:
      true,

    readOnlyLayer4StatusProjection:
      true,

    environmentHostAuthorized:
      true,

    temporarySourcePreviewAuthorized:
      true,

    layer4StatusProjection:
      projection,

    moduleInitializationObserved:
      projection
        .moduleInitializationObserved ===
      true,

    sourcePreviewReceipt:
      MODULE_STATE
        .sourcePreviewReceipt,

    executionCeiling:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    boundary:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildRouteBootstrapStatus() {
  return deepFreeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_ROUTE_BOOTSTRAP_STATUS',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

    generatedAt:
      nowIso(),

    status:
      MODULE_STATE.status,

    initialized:
      MODULE_STATE.initialized,

    destroyed:
      MODULE_STATE.destroyed,

    initializationSequence:
      MODULE_STATE.initializationSequence,

    asyncInitializationStarted:
      MODULE_STATE.asyncInitializationStarted,

    asyncInitializationComplete:
      MODULE_STATE.asyncInitializationComplete,

    selectedTargetId:
      MODULE_STATE.selectedTargetId,

    routeRootFound:
      Boolean(
        MODULE_STATE.mountPoints
          ?.routeRoot
      ),

    rendererMountNodeFound:
      Boolean(
        MODULE_STATE.mountPoints
          ?.rendererMount
      ),

    sourcePreviewStatus:
      MODULE_STATE.sourcePreviewStatus,

    sourcePreviewReceipt:
      MODULE_STATE.sourcePreviewReceipt,

    compositorImportReceipt:
      MODULE_STATE
        .compositorImportReceipt,

    compositorHandoffReceipt:
      MODULE_STATE
        .compositorHandoffReceipt,

    rendererBootstrapStatus:
      MODULE_STATE
        .rendererBootstrapStatus,

    rendererImportReceipt:
      MODULE_STATE
        .rendererImportReceipt,

    rendererConstructReceipt:
      safeSerialize(
        MODULE_STATE
          .rendererConstructReceipt
      ),

    rendererMountReceipt:
      safeSerialize(
        MODULE_STATE
          .rendererMountReceipt
      ),

    rendererReleaseReceipt:
      MODULE_STATE
        .rendererReleaseReceipt,

    layer4ImportReceipt:
      MODULE_STATE
        .layer4ImportReceipt,

    layer4StatusProjection:
      MODULE_STATE
        .layer4StatusProjection,

    executionCeiling:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    boundary:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildRouteBootstrapReceipt() {
  return deepFreeze({
    receiptType:
      'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

    routeShellContractId:
      H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,

    routeStyleContractId:
      H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,

    generatedAt:
      nowIso(),

    publicRoute:
      H_EARTH_3D_PUBLIC_ROUTE,

    diagnosticRoute:
      H_EARTH_3D_DIAGNOSTIC_ROUTE,

    status:
      MODULE_STATE.status,

    initialized:
      MODULE_STATE.initialized,

    selectedTarget:
      getTarget(
        MODULE_STATE.selectedTargetId
      ),

    sourcePreviewReceipt:
      MODULE_STATE.sourcePreviewReceipt,

    compositorImportReceipt:
      MODULE_STATE
        .compositorImportReceipt,

    compositorHandoffReceipt:
      MODULE_STATE
        .compositorHandoffReceipt,

    rendererImportReceipt:
      MODULE_STATE
        .rendererImportReceipt,

    rendererConstructReceipt:
      safeSerialize(
        MODULE_STATE
          .rendererConstructReceipt
      ),

    rendererMountReceipt:
      safeSerialize(
        MODULE_STATE
          .rendererMountReceipt
      ),

    rendererReleaseReceipt:
      MODULE_STATE
        .rendererReleaseReceipt,

    layer4PublicStageReceipt:
      MODULE_STATE
        .layer4PublicStageReceipt,

    routeStatus:
      buildRouteBootstrapStatus(),

    executionCeiling:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    boundary:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function publishCurrentActiveGlobals() {
  globalThis
    .H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT =
    MODULE_STATE
      .sourcePreviewReceipt;

  globalThis
    .H_EARTH_3D_LAYER_4_STATUS_PROJECTION =
    MODULE_STATE
      .layer4StatusProjection;

  globalThis
    .H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT =
    MODULE_STATE
      .layer4PublicStageReceipt;

  globalThis
    .H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
    MODULE_STATE
      .routeBootstrapReceipt;

  globalThis
    .H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS =
    buildRouteBootstrapStatus();

  return deepFreeze({
    sourcePreviewReceiptPublished:
      true,

    layer4StatusProjectionPublished:
      true,

    layer4PublicStageReceiptPublished:
      true,

    routeBootstrapReceiptPublished:
      true,

    routeBootstrapStatusPublished:
      true
  });
}

function rebuildAndRenderPublicReceipts(
  mountPoints =
    MODULE_STATE.mountPoints
) {
  MODULE_STATE.layer4PublicStageReceipt =
    buildLayer4PublicStageReceipt();

  MODULE_STATE.routeBootstrapReceipt =
    buildRouteBootstrapReceipt();

  writeJson(
    mountPoints?.publicStageReceipt,
    MODULE_STATE
      .layer4PublicStageReceipt,
    {
      maxDepth:
        9,

      maxArrayLength:
        180
    }
  );

  writeJson(
    mountPoints?.debug,
    MODULE_STATE
      .routeBootstrapReceipt,
    {
      maxDepth:
        9,

      maxArrayLength:
        180
    }
  );

  const publicationReceipt =
    publishCurrentActiveGlobals();

  return deepFreeze({
    sourcePreviewReceipt:
      MODULE_STATE
        .sourcePreviewReceipt,

    layer4StatusProjection:
      MODULE_STATE
        .layer4StatusProjection,

    layer4PublicStageReceipt:
      MODULE_STATE
        .layer4PublicStageReceipt,

    routeBootstrapReceipt:
      MODULE_STATE
        .routeBootstrapReceipt,

    publicationReceipt
  });
}


/* ==========================================================================
 * 22 · COPY AND ACTION CONTROLS
 * ========================================================================== */

function bindActionControls(
  mountPoints
) {
  if (
    !mountPoints
      ?.actionInspectGround
  ) {
    return deepFreeze({
      inspectGroundBound:
        false
    });
  }

  mountPoints
    .actionInspectGround
    .addEventListener(
      'click',
      () => {
        const target =
          getTarget(
            MODULE_STATE
              .selectedTargetId
          );

        renderSelectedTarget(
          mountPoints,
          target
        );

        markPreviewSelectedObject(
          mountPoints,
          target.objectId
        );

        rebuildAndRenderPublicReceipts(
          mountPoints
        );

        writeText(
          mountPoints.statusNode,
          'GROUND_CONDITION_READ_DISPLAYED_DESCRIPTOR_ONLY'
        );
      },
      getListenerOptions()
    );

  return deepFreeze({
    inspectGroundBound:
      true
  });
}

function bindCopyControls(
  rootDocument
) {
  if (
    !rootDocument ||
    typeof rootDocument.querySelectorAll !==
      'function'
  ) {
    return deepFreeze({
      copyButtonsBound:
        0
    });
  }

  const buttons =
    Array.from(
      rootDocument.querySelectorAll(
        '[data-h-earth-receipt-copy-button="true"][data-h-earth-copy-target]'
      )
    );

  for (const button of buttons) {
    button.addEventListener(
      'click',
      async () => {
        const targetId =
          button.getAttribute(
            'data-h-earth-copy-target'
          );

        const label =
          button.getAttribute(
            'data-h-earth-copy-label'
          ) ??
          targetId ??
          'Receipt';

        const copyStatus =
          getById(
            rootDocument,
            H_EARTH_3D_PUBLIC_MOUNT_IDS
              .copyStatus
          );

        const targetNode =
          targetId
            ? getById(
                rootDocument,
                targetId
              )
            : null;

        if (!targetNode) {
          writeText(
            copyStatus,
            `${label} copy failed: target not found.`
          );

          return;
        }

        const text =
          targetNode.textContent ??
          '';

        if (!text.trim()) {
          writeText(
            copyStatus,
            `${label} copy failed: payload is empty.`
          );

          return;
        }

        try {
          if (
            globalThis.navigator
              ?.clipboard &&
            typeof globalThis.navigator
              .clipboard
              .writeText ===
              'function'
          ) {
            await globalThis.navigator
              .clipboard
              .writeText(
                text
              );

            writeText(
              copyStatus,
              `${label} copied.`
            );

            return;
          }

          writeText(
            copyStatus,
            `${label} prepared, but Clipboard API is unavailable in this context.`
          );
        } catch (error) {
          writeText(
            copyStatus,
            `${label} copy failed: ${
              error instanceof Error
                ? error.message
                : String(error)
            }`
          );
        }
      },
      getListenerOptions()
    );
  }

  return deepFreeze({
    copyButtonsBound:
      buttons.length
  });
}


/* ==========================================================================
 * 23 · INITIAL STATIC ROUTE
 * ========================================================================== */

function renderInitialStaticRoute(
  mountPoints
) {
  const target =
    getTarget(
      MODULE_STATE.selectedTargetId
    );

  renderSelectedTarget(
    mountPoints,
    target
  );

  renderTargetList(
    mountPoints
  );

  renderPublicSourcePreview(
    mountPoints
  );

  MODULE_STATE.layer4StatusProjection =
    buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS
        .DESCRIPTOR_IMPORT_PENDING
    );

  renderLayer4Projection(
    mountPoints,
    MODULE_STATE
      .layer4StatusProjection
  );

  writeText(
    mountPoints.statusNode,
    'PUBLIC_STAGE_TEMPORARY_SOURCE_PREVIEW'
  );

  writeText(
    mountPoints.fallbackNode,
    'H-Earth descriptor preview is visible while the route requests the lawful compositor handoff and renderer lifecycle.'
  );

  MODULE_STATE.status =
    H_EARTH_3D_PUBLIC_STAGE_STATUS
      .PREVIEW_READY;

  rebuildAndRenderPublicReceipts(
    mountPoints
  );

  return true;
}


/* ==========================================================================
 * 24 · ASYNC INITIALIZATION
 * ========================================================================== */

async function completeAsyncPublicStageInitialization(
  mountPoints,
  options,
  token
) {
  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return deepFreeze({
      completed:
        false,

      stale:
        true,

      status:
        'STALE_ASYNC_INITIALIZATION_IGNORED',

      sharedCurrentStateMutated:
        false
    });
  }

  MODULE_STATE.asyncInitializationStarted =
    true;

  writeText(
    mountPoints.layer4Status,
    H_EARTH_3D_LAYER_4_STATUS
      .DESCRIPTOR_IMPORT_PENDING
  );

  const [
    layer4Projection,
    rendererBootstrapReceipt
  ] = await Promise.all([
    readLayer4BridgeDescriptor(
      options,
      token
    ),

    bootstrapRenderer(
      mountPoints,
      options,
      token
    )
  ]);

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return deepFreeze({
      completed:
        false,

      stale:
        true,

      status:
        'STALE_ASYNC_INITIALIZATION_IGNORED',

      sharedCurrentStateMutated:
        false,

      rendererCleanupAttempted:
        false,

      currentDOMMutated:
        false,

      activeGlobalEvidencePublished:
        false
    });
  }

  MODULE_STATE.layer4StatusProjection =
    layer4Projection;

  const rendererMounted =
    rendererBootstrapReceipt
      ?.mounted ===
    true;

  if (rendererMounted) {
    MODULE_STATE.status =
      H_EARTH_3D_PUBLIC_STAGE_STATUS
        .READY;

    setRouteClass(
      mountPoints.routeRoot,
      'h-earth-3d-boot-ready'
    );

    writeText(
      mountPoints.statusNode,
      'PUBLIC_STAGE_RENDERER_MOUNTED'
    );

    writeText(
      mountPoints.fallbackNode,
      'The lawful compositor handoff was presented to the renderer, and the admitted-frame renderer mounted. Renderer and visual pass remain unclaimed pending controlled audit.'
    );
  } else if (
    sourcePreviewExists(
      mountPoints.rendererMount
    )
  ) {
    MODULE_STATE.status =
      H_EARTH_3D_PUBLIC_STAGE_STATUS
        .FALLBACK;

    setRouteClass(
      mountPoints.routeRoot,
      'h-earth-3d-boot-fallback'
    );

    writeText(
      mountPoints.statusNode,
      'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK'
    );

    writeText(
      mountPoints.fallbackNode,
      'The renderer corridor did not complete. The descriptor-only source preview remains or was restored as the public fallback.'
    );
  } else {
    renderPublicSourcePreview(
      mountPoints,
      {
        restoration:
          true
      }
    );

    MODULE_STATE.status =
      H_EARTH_3D_PUBLIC_STAGE_STATUS
        .FALLBACK;

    setRouteClass(
      mountPoints.routeRoot,
      'h-earth-3d-boot-fallback'
    );

    writeText(
      mountPoints.statusNode,
      'PUBLIC_STAGE_SOURCE_PREVIEW_RESTORED'
    );

    writeText(
      mountPoints.fallbackNode,
      'The renderer corridor did not complete. The descriptor-only source preview was restored.'
    );
  }

  renderLayer4Projection(
    mountPoints,
    layer4Projection
  );

  updateRouteRootExecutionDataset(
    mountPoints
  );

  MODULE_STATE.asyncInitializationComplete =
    true;

  rebuildAndRenderPublicReceipts(
    mountPoints
  );

  const completionReceipt =
    deepFreeze({
      initialized:
        MODULE_STATE.initialized,

      status:
        MODULE_STATE.status,

      initializationSequence:
        token.sequence,

      layer4StatusProjection:
        MODULE_STATE
          .layer4StatusProjection,

      sourcePreviewReceipt:
        MODULE_STATE
          .sourcePreviewReceipt,

      rendererBootstrapReceipt,

      routeBootstrapReceipt:
        MODULE_STATE
          .routeBootstrapReceipt,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

  globalThis
    .H_EARTH_3D_ROUTE_BOOTSTRAP_COMPLETION =
    completionReceipt;

  return completionReceipt;
}


/* ==========================================================================
 * 25 · INITIALIZE ROUTE
 * ========================================================================== */

export function initializeHEarthRoute(
  options = {}
) {
  const rootDocument =
    getDocumentFromOptions(
      options
    );

  const proposedKey =
    createInitializationKey(
      options,
      rootDocument
    );

  if (
    MODULE_STATE.initialized &&
    initializationKeysMatch(
      MODULE_STATE
        .activeInitializationKey,
      proposedKey
    )
  ) {
    return deepFreeze({
      initialized:
        true,

      duplicateInitialization:
        true,

      materiallyChanged:
        false,

      status:
        MODULE_STATE.status,

      initializationSequence:
        MODULE_STATE
          .initializationSequence,

      completion:
        MODULE_STATE
          .completionPromise,

      routeBootstrapReceipt:
        MODULE_STATE
          .routeBootstrapReceipt,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  if (MODULE_STATE.initialized) {
    return deepFreeze({
      initialized:
        false,

      duplicateInitialization:
        false,

      materiallyChanged:
        false,

      status:
        'ROUTE_ALREADY_INITIALIZED_DESTROY_REQUIRED_BEFORE_DIFFERENT_INITIALIZATION',

      initializationSequence:
        MODULE_STATE
          .initializationSequence,

      differingBehavioralInputDetected:
        true,

      routeBootstrapReceipt:
        MODULE_STATE
          .routeBootstrapReceipt,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  const mountPoints =
    resolveMountPoints(
      rootDocument
    );

  resetCurrentOccurrenceEvidence();

  clearPublishedActiveGlobals();

  resetRoutePresentationState(
    mountPoints
  );

  MODULE_STATE.initializationSequence +=
    1;

  const token =
    createInitializationToken(
      MODULE_STATE
        .initializationSequence
    );

  MODULE_STATE.activeInitializationToken =
    token;

  MODULE_STATE.activeInitializationKey =
    proposedKey;

  MODULE_STATE.generatedAt =
    nowIso();

  MODULE_STATE.mountPoints =
    mountPoints;

  MODULE_STATE.status =
    H_EARTH_3D_PUBLIC_STAGE_STATUS
      .INITIALIZING;

  MODULE_STATE.destroyed =
    false;

  resetListenerController();

  bindCopyControls(
    rootDocument
  );

  if (!mountPoints.requiredFound) {
    MODULE_STATE.status =
      H_EARTH_3D_PUBLIC_STAGE_STATUS
        .ERROR;

    MODULE_STATE.initialized =
      false;

    MODULE_STATE.activeInitializationToken =
      null;

    MODULE_STATE.activeInitializationKey =
      null;

    const failureReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_MOUNT_FAILURE',

        file:
          H_EARTH_3D_PUBLIC_ROUTE_FILE,

        contractId:
          H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

        generatedAt:
          nowIso(),

        status:
          MODULE_STATE.status,

        missingRequiredIds:
          mountPoints.missingRequiredIds,

        boundary:
          H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
      });

    MODULE_STATE.routeBootstrapReceipt =
      failureReceipt;

    MODULE_STATE.routeBootstrapResult =
      failureReceipt;

    writeText(
      mountPoints.statusNode,
      'PUBLIC_STAGE_MOUNT_FAILURE'
    );

    writeJson(
      mountPoints.debug,
      failureReceipt
    );

    globalThis
      .H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
      failureReceipt;

    globalThis
      .H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS =
      buildRouteBootstrapStatus();

    return deepFreeze({
      initialized:
        false,

      status:
        MODULE_STATE.status,

      mountPoints:
        safeSerialize(
          mountPoints
        ),

      failureReceipt,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  MODULE_STATE.initialized =
    true;

  renderInitialStaticRoute(
    mountPoints
  );

  bindActionControls(
    mountPoints
  );

  if (mountPoints.diagnosticLink) {
    mountPoints
      .diagnosticLink
      .setAttribute(
        'href',
        H_EARTH_3D_DIAGNOSTIC_ROUTE
      );
  }

  updateRouteRootExecutionDataset(
    mountPoints
  );

  MODULE_STATE.completionPromise =
    completeAsyncPublicStageInitialization(
      mountPoints,
      options,
      token
    ).catch(
      (error) => {
        if (
          !isActiveInitializationToken(
            token
          )
        ) {
          return deepFreeze({
            completed:
              false,

            stale:
              true,

            status:
              'STALE_ASYNC_FAILURE_IGNORED',

            sharedCurrentStateMutated:
              false,

            rendererCleanupAttempted:
              false,

            currentDOMMutated:
              false,

            activeGlobalEvidencePublished:
              false
          });
        }

        MODULE_STATE.status =
          H_EARTH_3D_PUBLIC_STAGE_STATUS
            .ERROR;

        const rendererReleaseReceipt =
          releaseRendererSafely({
            cleanupReason:
              'PUBLIC_STAGE_ASYNC_FAILURE'
          });

        if (
          !sourcePreviewExists(
            mountPoints.rendererMount
          )
        ) {
          renderPublicSourcePreview(
            mountPoints,
            {
              restoration:
                true
            }
          );
        }

        MODULE_STATE.layer4PublicStageReceipt =
          buildLayer4PublicStageReceipt();

        const failureReceipt =
          deepFreeze({
            receiptType:
              'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_ASYNC_FAILURE',

            file:
              H_EARTH_3D_PUBLIC_ROUTE_FILE,

            contractId:
              H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

            generatedAt:
              nowIso(),

            status:
              MODULE_STATE.status,

            errorName:
              error instanceof Error
                ? error.name
                : 'UnknownError',

            errorMessage:
              error instanceof Error
                ? error.message
                : String(error),

            sourcePreviewRestored:
              sourcePreviewExists(
                mountPoints.rendererMount
              ),

            rendererReleaseReceipt,

            layer4PublicStageReceipt:
              MODULE_STATE
                .layer4PublicStageReceipt,

            boundary:
              H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
          });

        MODULE_STATE.routeBootstrapReceipt =
          failureReceipt;

        setRouteClass(
          mountPoints.routeRoot,
          'h-earth-3d-boot-error'
        );

        writeText(
          mountPoints.statusNode,
          'PUBLIC_STAGE_ASYNC_FAILURE'
        );

        writeText(
          mountPoints.fallbackNode,
          `Public-stage async completion failed: ${failureReceipt.errorMessage}. The descriptor fallback was retained or restored.`
        );

        writeJson(
          mountPoints.debug,
          failureReceipt
        );

        updateRouteRootExecutionDataset(
          mountPoints
        );

        globalThis
          .H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT =
          MODULE_STATE
            .sourcePreviewReceipt;

        globalThis
          .H_EARTH_3D_LAYER_4_STATUS_PROJECTION =
          MODULE_STATE
            .layer4StatusProjection;

        globalThis
          .H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT =
          MODULE_STATE
            .layer4PublicStageReceipt;

        globalThis
          .H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
          failureReceipt;

        globalThis
          .H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS =
          buildRouteBootstrapStatus();

        globalThis
          .H_EARTH_3D_PUBLIC_STAGE_ASYNC_FAILURE =
          failureReceipt;

        return failureReceipt;
      }
    );

  MODULE_STATE.routeBootstrapReceipt =
    buildRouteBootstrapReceipt();

  const immediateResult =
    deepFreeze({
      initialized:
        true,

      duplicateInitialization:
        false,

      status:
        MODULE_STATE.status,

      generatedAt:
        MODULE_STATE.generatedAt,

      initializationSequence:
        token.sequence,

      routeBootstrapReceipt:
        MODULE_STATE
          .routeBootstrapReceipt,

      sourcePreviewReceipt:
        MODULE_STATE
          .sourcePreviewReceipt,

      layer4StatusProjection:
        MODULE_STATE
          .layer4StatusProjection,

      asyncCompletion:
        'PENDING_EXACT_COMPOSITOR_RENDERER_AND_LAYER_4_IMPORTS',

      packet002ConstructedByRoute:
        false,

      admittedFrameConstructedByRoute:
        false,

      productionModulePathOverridesAccepted:
        false,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

  MODULE_STATE.routeBootstrapResult =
    immediateResult;

  globalThis.H_EARTH_3D_INDEX =
    H_EARTH_3D_INDEX;

  globalThis
    .H_EARTH_3D_ROUTE_BOOTSTRAP_RESULT =
    immediateResult;

  publishCurrentActiveGlobals();

  return immediateResult;
}


/* ==========================================================================
 * 26 · PUBLIC GETTERS
 * ========================================================================== */

export function getRouteBootstrapStatus() {
  return buildRouteBootstrapStatus();
}

export function getRouteBootstrapReceipt() {
  if (
    !MODULE_STATE
      .routeBootstrapReceipt
  ) {
    MODULE_STATE.routeBootstrapReceipt =
      buildRouteBootstrapReceipt();
  }

  return MODULE_STATE
    .routeBootstrapReceipt;
}

export function getRouteBootstrapCompletion() {
  return MODULE_STATE
    .completionPromise;
}

export function getLayer4StatusProjection() {
  if (
    !MODULE_STATE
      .layer4StatusProjection
  ) {
    MODULE_STATE.layer4StatusProjection =
      buildStaticLayer4Projection();
  }

  return MODULE_STATE
    .layer4StatusProjection;
}

export function getLayer4PublicStageReceipt() {
  if (
    !MODULE_STATE
      .layer4PublicStageReceipt
  ) {
    MODULE_STATE.layer4PublicStageReceipt =
      buildLayer4PublicStageReceipt();
  }

  return MODULE_STATE
    .layer4PublicStageReceipt;
}

export function getPublicStageSourcePreviewReceipt() {
  return (
    MODULE_STATE
      .sourcePreviewReceipt ??
    deepFreeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT',

      file:
        H_EARTH_3D_PUBLIC_ROUTE_FILE,

      contractId:
        H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

      generatedAt:
        nowIso(),

      sourcePreviewStatus:
        MODULE_STATE
          .sourcePreviewStatus,

      mounted:
        false,

      descriptorOnly:
        true,

      temporaryFallbackOnly:
        true,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false,

      matrixCollapse:
        false,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    })
  );
}

export function getPublicGroundConditionReadPayload() {
  return buildGroundConditionReadPayload(
    getTarget(
      MODULE_STATE.selectedTargetId
    )
  );
}

export function getRendererBootstrapReceipt() {
  return deepFreeze({
    compositorImportReceipt:
      MODULE_STATE
        .compositorImportReceipt,

    compositorHandoffReceipt:
      MODULE_STATE
        .compositorHandoffReceipt,

    rendererImportReceipt:
      MODULE_STATE
        .rendererImportReceipt,

    rendererConstructReceipt:
      safeSerialize(
        MODULE_STATE
          .rendererConstructReceipt
      ),

    rendererMountReceipt:
      safeSerialize(
        MODULE_STATE
          .rendererMountReceipt
      ),

    rendererReleaseReceipt:
      MODULE_STATE
        .rendererReleaseReceipt,

    rendererBootstrapStatus:
      MODULE_STATE
        .rendererBootstrapStatus
  });
}


/* ==========================================================================
 * 27 · DESTROY ROUTE
 * ========================================================================== */

export function destroyHEarthRoute() {
  const previousReceipt =
    buildRouteBootstrapReceipt();

  const mountPoints =
    MODULE_STATE.mountPoints;

  MODULE_STATE.status =
    H_EARTH_3D_PUBLIC_STAGE_STATUS
      .DESTROYING;

  MODULE_STATE.destroyed =
    true;

  MODULE_STATE.activeInitializationToken =
    null;

  if (
    MODULE_STATE
      .listenerAbortController
  ) {
    MODULE_STATE
      .listenerAbortController
      .abort();
  }

  MODULE_STATE.listenerAbortController =
    null;

  const rendererReleaseReceipt =
    releaseRendererSafely({
      cleanupReason:
        'ROUTE_DESTROY'
    });

  const previewClearReceipt =
    mountPoints?.rendererMount
      ? clearSourcePreviewOwnedNodes(
          mountPoints.rendererMount
        )
      : deepFreeze({
          cleared:
            false,

          removedCount:
            0,

          failureCode:
            'RENDERER_MOUNT_UNAVAILABLE'
        });

  resetRoutePresentationState(
    mountPoints
  );

  writeText(
    mountPoints?.statusNode,
    'PUBLIC_STAGE_DESTROYED'
  );

  writeText(
    mountPoints?.fallbackNode,
    ''
  );

  MODULE_STATE.initialized =
    false;

  MODULE_STATE.status =
    H_EARTH_3D_PUBLIC_STAGE_STATUS
      .DESTROYED;

  MODULE_STATE.sourcePreviewStatus =
    H_EARTH_3D_SOURCE_PREVIEW_STATUS
      .REMOVED;

  MODULE_STATE.activeInitializationKey =
    null;

  MODULE_STATE.activeInitializationToken =
    null;

  MODULE_STATE.mountPoints =
    null;

  const destroyReceipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_DESTROY_RECEIPT',

      file:
        H_EARTH_3D_PUBLIC_ROUTE_FILE,

      contractId:
        H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

      generatedAt:
        nowIso(),

      previousOccurrenceReceipt:
        previousReceipt,

      rendererReleaseReceipt,

      sourcePreviewClearReceipt:
        previewClearReceipt,

      listenersAborted:
        true,

      asyncInitializationInvalidated:
        true,

      rendererReleaseAttempted:
        rendererReleaseReceipt
          ?.releaseAttempted ===
        true,

      rendererReleased:
        rendererReleaseReceipt
          ?.released ===
        true,

      sourcePreviewOwnedNodesCleared:
        previewClearReceipt
          .cleared ===
        true,

      routeClassesReset:
        true,

      routeExecutionDatasetsReset:
        true,

      activeOccurrenceEvidenceCleared:
        true,

      packet002Mutated:
        false,

      admittedFrameMutated:
        false,

      layer4ExecutionClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      matrixCollapse:
        false,

      boundary:
        H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

  resetCurrentOccurrenceEvidence();

  MODULE_STATE.status =
    H_EARTH_3D_PUBLIC_STAGE_STATUS
      .DESTROYED;

  MODULE_STATE.destroyed =
    true;

  clearPublishedActiveGlobals();

  MODULE_STATE.routeBootstrapReceipt =
    destroyReceipt;

  globalThis
    .H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
    destroyReceipt;

  globalThis
    .H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_ROUTE_BOOTSTRAP_STATUS',

      file:
        H_EARTH_3D_PUBLIC_ROUTE_FILE,

      contractId:
        H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

      generatedAt:
        nowIso(),

      initialized:
        false,

      destroyed:
        true,

      status:
        H_EARTH_3D_PUBLIC_STAGE_STATUS
          .DESTROYED,

      rendererConstructed:
        false,

      rendererMounted:
        false,

      sourcePreviewMounted:
        false,

      activeOccurrenceEvidenceCleared:
        true
    });

  return destroyReceipt;
}


/* ==========================================================================
 * 28 · STATIC RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
  deepFreeze({
    receiptType:
      'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT_STATIC_DESCRIPTOR',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

    routeShellContractId:
      H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,

    routeStyleContractId:
      H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,

    canonicalRouteInput:
      [
        'packet002Transfer',
        'packet002TransferOccurrenceId',
        'compositorFrameOccurrenceId',
        'presentationMode'
      ],

    completeInitializationIdentity:
      [
        'packet002Transfer',
        'packet002TransferOccurrenceId',
        'compositorFrameOccurrenceId',
        'presentationMode',
        'skipRendererBootstrap',
        'skipLayer4DescriptorImport',
        'layer4BridgeModulePath',
        'documentIdentity'
      ],

    packet002ConstructedByRoute:
      false,

    compositorModulePath:
      H_EARTH_3D_COMPOSITOR_MODULE_PATH,

    rendererModulePath:
      H_EARTH_3D_RENDERER_MODULE_PATH,

    compositorModulePathOverrideAccepted:
      false,

    rendererModulePathOverrideAccepted:
      false,

    expectedCompositorContractId:
      H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID,

    expectedRendererContractId:
      H_EARTH_3D_EXPECTED_RENDERER_CONTRACT_ID,

    exactCompositorContractRequired:
      true,

    exactRendererContractRequired:
      true,

    exactCompositorHandoffExport:
      'getHEarth3DCompositorRendererHandoff',

    exactRendererConstructExport:
      'constructHEarth3DRenderer',

    exactRendererMountExport:
      'mountHEarth3DRenderer',

    exactRendererReleaseExport:
      'releaseHEarth3DRenderer',

    canonicalRendererMountInput:
      'mountElement',

    genericRendererAPIDiscoveryRemoved:
      true,

    primaryFailureStatusPreservedAcrossCleanup:
      true,

    rendererReleaseRecordedSeparately:
      true,

    compositorHandoffTerminology:
      'OK_SIGNAL_OBSERVED_AND_PRESENTED_FOR_RENDERER_VALIDATION',

    routeClaimsHandoffFullyValidated:
      false,

    nestedRouteOwnedReceiptsDeepFrozen:
      true,

    hostDocumentRecursivelyFrozen:
      false,

    sourcePreviewDefined:
      true,

    sourcePreviewTemporaryFallbackOnly:
      true,

    sourcePreviewSameNodePreservationClaim:
      false,

    rendererTakeoverExplicit:
      true,

    previewRestorationAfterRendererFailure:
      true,

    rendererReleaseOnDestroy:
      true,

    duplicateInitializationNoOpDefined:
      true,

    everyBehaviorChangingInputInInitializationIdentity:
      true,

    differentReinitializationRequiresDestroy:
      true,

    staleAsyncCompletionGuardDefined:
      true,

    staleCompletionSharedStateMutation:
      false,

    staleCompletionRendererCleanup:
      false,

    staleCompletionDOMMutation:
      false,

    staleCompletionActiveGlobalPublication:
      false,

    constructReceiptCommittedOnlyAfterActiveTokenCheck:
      true,

    mountReceiptCommittedOnlyAfterActiveTokenCheck:
      true,

    activeGlobalsSynchronizedDuringReceiptRebuild:
      true,

    sourcePreviewActiveGlobalSynchronized:
      true,

    layer4ProjectionActiveGlobalSynchronized:
      true,

    routeReceiptActiveGlobalSynchronized:
      true,

    routeStatusActiveGlobalSynchronized:
      true,

    mountFailureRouteStatusGlobalSynchronized:
      true,

    asyncFailureLayer4PublicStageReceiptRebuilt:
      true,

    asyncFailureLayer4PublicStageReceiptGlobalSynchronized:
      true,

    asyncFailureRouteStatusGlobalSynchronized:
      true,

    allActiveGlobalsClearedBeforeNewOccurrence:
      true,

    routeOwnedListenerAbortDefined:
      true,

    activeOccurrenceEvidenceClearedOnDestroy:
      true,

    routeDatasetsResetOnDestroy:
      true,

    routeClassesResetOnDestroy:
      true,

    activeGlobalsClearedOnDestroy:
      true,

    moduleSyntaxVerified:
      false,

    compositorImportResolutionVerified:
      false,

    rendererImportResolutionVerified:
      false,

    compositorModuleInitializationVerified:
      false,

    rendererModuleInitializationVerified:
      false,

    lawfulCompositorHandoffVerified:
      false,

    rendererConstructionVerified:
      false,

    rendererMountVerified:
      false,

    previewTakeoverVerified:
      false,

    fallbackRestorationVerified:
      false,

    duplicateInitializationVerified:
      false,

    differentInitializationRejectionVerified:
      false,

    destroyReinitializeEvidenceIsolationVerified:
      false,

    staleOccurrenceIsolationVerified:
      false,

    activeGlobalSynchronizationVerified:
      false,

    exceptionalPathActiveGlobalSynchronizationVerified:
      false,

    rendererReleaseVerified:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false,

    boundary:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });


/* ==========================================================================
 * 29 · COMPLETE CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_INDEX_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    route:
      H_EARTH_3D_PUBLIC_ROUTE,

    diagnosticRoute:
      H_EARTH_3D_DIAGNOSTIC_ROUTE,

    role:
      'COMPOSITOR_TO_RENDERER_PUBLIC_ROUTE_ORCHESTRATOR_WITH_TEMPORARY_DESCRIPTOR_FALLBACK',

    canonicalInput:
      {
        packet002Transfer:
          'AUTHORIZED_UPSTREAM_PACKET_002_TRANSFER',

        packet002TransferOccurrenceId:
          'EXACT_PACKET_002_TRANSFER_OCCURRENCE_ID',

        compositorFrameOccurrenceId:
          'EXACT_COMPOSITOR_FRAME_OCCURRENCE_ID',

        presentationMode:
          'EXACT_COMPOSITOR_PRESENTATION_MODE'
      },

    dependencyAuthority:
      {
        compositorModulePath:
          H_EARTH_3D_COMPOSITOR_MODULE_PATH,

        rendererModulePath:
          H_EARTH_3D_RENDERER_MODULE_PATH,

        compositorModulePathOverrideAccepted:
          false,

        rendererModulePathOverrideAccepted:
          false,

        compositorContractId:
          H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID,

        rendererContractId:
          H_EARTH_3D_EXPECTED_RENDERER_CONTRACT_ID,

        exactContractIdentityRequired:
          true
      },

    compositorLaw:
      {
        handoffFunction:
          'getHEarth3DCompositorRendererHandoff',

        handoffInput:
          [
            'packet002Transfer',
            'packet002TransferOccurrenceId',
            'compositorFrameOccurrenceId',
            'presentationMode'
          ],

        routeConstructsPacket002:
          false,

        routeConstructsAdmittedFrame:
          false,

        routeHandoffCheck:
          'OK_SIGNAL_AND_MINIMUM_CORRESPONDENCE_BEFORE_RENDERER_VALIDATION',

        rendererRemainsFinalBoundaryValidator:
          true
      },

    rendererLaw:
      {
        constructFunction:
          'constructHEarth3DRenderer',

        mountFunction:
          'mountHEarth3DRenderer',

        releaseFunction:
          'releaseHEarth3DRenderer',

        mountInput:
          {
            mountElement:
              'RESOLVED_RENDERER_MOUNT_NODE'
          },

        constructionRequiredBeforeMount:
          true,

        genericAPIDiscovery:
          false,

        cleanupMayOverwritePrimaryFailureOutcome:
          false
      },

    previewLaw:
      {
        preview:
          'TEMPORARY_DESCRIPTOR_ONLY_FALLBACK',

        sameMountAsRenderer:
          true,

        rendererTakeoverMayReplacePreviewDOM:
          true,

        previewDOMPreservedAfterSuccessfulTakeover:
          false,

        previewMetadataPreservedInReceipt:
          true,

        previewRestoredAfterRendererFailure:
          true
      },

    initializationLaw:
      {
        firstInitialization:
          'START',

        exactDuplicateInitialization:
          'RETURN_EXISTING_STATE_WITHOUT_REBINDING',

        exactDuplicateIdentityFields:
          [
            'packet002Transfer',
            'packet002TransferOccurrenceId',
            'compositorFrameOccurrenceId',
            'presentationMode',
            'skipRendererBootstrap',
            'skipLayer4DescriptorImport',
            'layer4BridgeModulePath',
            'documentIdentity'
          ],

        hostDocumentComparison:
          'REFERENCE_IDENTITY',

        hostDocumentRecursivelyFrozen:
          false,

        differentInitializationWhileActive:
          'REJECT_UNTIL_DESTROY',

        overlappingAsyncInitialization:
          'TOKEN_GUARDED',

        staleAsyncCompletion:
          'RETURN_LOCAL_OBSERVATIONAL_RECEIPT_ONLY_WITHOUT_SHARED_STATE_CLEANUP_GLOBAL_OR_DOM_MUTATION',

        constructReceiptCommitLaw:
          'COMMIT_ONLY_AFTER_ACTIVE_TOKEN_RECONFIRMATION',

        mountReceiptCommitLaw:
          'COMMIT_ONLY_AFTER_ACTIVE_TOKEN_RECONFIRMATION',

        reinitializationAfterDestroy:
          'AUTHORIZED_AFTER_ACTIVE_EVIDENCE_RESET'
      },

    publicationLaw:
      {
        synchronizedPublicationFunction:
          'publishCurrentActiveGlobals',

        normalReceiptRebuildFunction:
          'rebuildAndRenderPublicReceipts',

        sourcePreviewReceiptGlobal:
          'H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT',

        layer4StatusProjectionGlobal:
          'H_EARTH_3D_LAYER_4_STATUS_PROJECTION',

        layer4PublicStageReceiptGlobal:
          'H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT',

        routeBootstrapReceiptGlobal:
          'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',

        routeBootstrapStatusGlobal:
          'H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS',

        routeBootstrapResultGlobal:
          'H_EARTH_3D_ROUTE_BOOTSTRAP_RESULT',

        routeBootstrapCompletionGlobal:
          'H_EARTH_3D_ROUTE_BOOTSTRAP_COMPLETION',

        asyncFailureGlobal:
          'H_EARTH_3D_PUBLIC_STAGE_ASYNC_FAILURE',

        allActiveGlobalsPublishedFromCurrentModuleState:
          true,

        mountResolutionFailurePublishesRouteStatus:
          true,

        asynchronousFailureRebuildsLayer4PublicStageReceipt:
          true,

        asynchronousFailurePublishesLayer4PublicStageReceipt:
          true,

        asynchronousFailurePublishesRouteStatus:
          true,

        preInitializationClearIncludesRouteReceipt:
          true,

        preInitializationClearIncludesRouteStatus:
          true
      },

    destructionLaw:
      {
        abortRouteOwnedListeners:
          true,

        invalidateAsyncInitialization:
          true,

        releaseRenderer:
          true,

        clearRouteOwnedPreviewDOM:
          true,

        resetRouteClasses:
          true,

        resetRouteDatasets:
          true,

        clearActiveGlobalEvidence:
          true,

        preserveHistoricalOccurrence:
          'INSIDE_DESTROY_RECEIPT_ONLY',

        clearActiveOccurrenceEvidence:
          true
      },

    receiptLaw:
      {
        routeOwnedNestedDataDeepFrozen:
          true,

        externallyOwnedDOMObjectsDeepFrozen:
          false,

        primaryFailureOutcomePreserved:
          true,

        cleanupOutcomeRecordedSeparately:
          true,

        staleReceiptObservationalOnly:
          true,

        activeGlobalEvidenceSynchronized:
          true,

        exceptionalPathEvidenceSynchronized:
          true
      },

    executionCeiling:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    boundaryFlags:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,

    staticReceipt:
      H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT
  });


/* ==========================================================================
 * 30 · AGGREGATE EXPORT
 * ========================================================================== */

export const H_EARTH_3D_INDEX =
  deepFreeze({
    id:
      'H_EARTH_3D_INDEX',

    file:
      H_EARTH_3D_PUBLIC_ROUTE_FILE,

    route:
      H_EARTH_3D_PUBLIC_ROUTE,

    diagnosticRoute:
      H_EARTH_3D_DIAGNOSTIC_ROUTE,

    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,

    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

    routeShellContractId:
      H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,

    routeStyleContractId:
      H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,

    expectedCompositorContractId:
      H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID,

    expectedRendererContractId:
      H_EARTH_3D_EXPECTED_RENDERER_CONTRACT_ID,

    contract:
      H_EARTH_3D_INDEX_CONTRACT,

    publicStageAdapter:
      true,

    compositorRendererOrchestrator:
      true,

    temporarySourcePreviewDefined:
      true,

    sourcePreviewDescriptorOnly:
      true,

    productionModulePathOverridesAccepted:
      false,

    activeGlobalSynchronization:
      true,

    exceptionalPathActiveGlobalSynchronization:
      true,

    layer4Contracts:
      H_EARTH_3D_LAYER_4_CONTRACTS,

    layer4ArchiveCustody:
      H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,

    sourceSpineContracts:
      H_EARTH_3D_SOURCE_SPINE_CONTRACTS,

    sourceSpineArchiveCustody:
      H_EARTH_3D_SOURCE_SPINE_ARCHIVE_CUSTODY,

    sourcePreviewModel:
      H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_MODEL,

    executionCeiling:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    boundaryFlags:
      H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,

    mountIds:
      H_EARTH_3D_PUBLIC_MOUNT_IDS,

    targets:
      H_EARTH_3D_PUBLIC_TARGETS,

    sourcePreviewBands:
      H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS,

    initializeHEarthRoute,

    destroyHEarthRoute,

    getRouteBootstrapStatus,

    getRouteBootstrapReceipt,

    getRouteBootstrapCompletion,

    getLayer4StatusProjection,

    getLayer4PublicStageReceipt,

    getPublicStageSourcePreviewReceipt,

    getPublicGroundConditionReadPayload,

    getRendererBootstrapReceipt,

    receipt:
      H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT
  });

export default H_EARTH_3D_INDEX;
