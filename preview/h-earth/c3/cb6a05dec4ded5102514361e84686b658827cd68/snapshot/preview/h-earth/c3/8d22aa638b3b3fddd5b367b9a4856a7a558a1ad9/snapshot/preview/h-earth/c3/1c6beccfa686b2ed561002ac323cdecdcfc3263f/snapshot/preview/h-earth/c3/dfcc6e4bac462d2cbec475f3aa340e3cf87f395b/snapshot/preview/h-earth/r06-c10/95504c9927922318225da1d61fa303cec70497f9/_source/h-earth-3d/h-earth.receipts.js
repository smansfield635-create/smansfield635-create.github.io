/**
 * /h-earth-3d/h-earth.receipts.js
 * COMPLETE RENEWED FILE
 * H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1
 *
 * Renews:
 * H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1
 *
 * Consumes:
 * /h-earth-3d/h-earth.matrix.js
 * H_EARTH_MATRIX_FILE_RENEWAL_STEP_009D_REJECTED_BINDING_CLASSIFICATION_GUARD_v1
 *
 * /h-earth-3d/cells/ground-cell-001.js
 * H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_011A_PATH3_DOMAIN_BINDING_CONSUMER_v1
 *
 * /h-earth-3d/zones/ground-cell-001.zones.js
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1
 *
 * /h-earth-3d/objects/ground-cell-001.objects.js
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2
 *
 * /h-earth-3d/actions/inspect-ground.js
 * H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v2
 *
 * /h-earth-3d/readouts/ground-condition-read.js
 * H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1
 *
 * Exact historical lineage retained:
 * H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v1
 *
 * Retired noncontrolling compatibility lineage retained:
 * H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1
 * H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1
 * H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1
 * H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1
 * H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1
 *
 * Purpose:
 * Renew the H-Earth receipts file from the retired Step 031G lattice-chain
 * receipt binding into the active Step 011F Path 3-bound Ground Inspection
 * Receipt descriptor binding.
 *
 * Canonical upstream relation:
 * H_EARTH_REGION_CELL_X07_Z08
 *   -> H_EARTH_GROUND_CELL_001
 *   -> H_EARTH_INSPECT_GROUND_ACTION
 *   -> H_EARTH_GROUND_CONDITION_READ
 *   -> H_EARTH_GROUND_INSPECTION_RECEIPT
 *
 * Room 6 authority:
 * Room 6 binds receipt descriptors to the admitted upstream source chain.
 * Room 6 does not create Path 3 authority.
 * Room 6 does not create matrix authority.
 * Room 6 does not create cell, zone, object, action, or readout authority.
 * Room 6 does not persist runtime receipts.
 * Room 6 does not execute runtime actions or runtime readouts.
 *
 * Compatibility:
 * Step 031A–031G identifiers remain referenced only as retired lineage /
 * compatibility history. They are not active authority in this file.
 *
 * Boundary:
 * This file defines receipt binding descriptors only.
 * This file does not persist runtime receipts.
 * This file does not execute runtime actions.
 * This file does not execute runtime readouts.
 * This file does not activate route, runtime, lattice, renderer, compositor,
 * controller, canvas, WebGL, SVG, iframe, traversal, gameplay, simulation,
 * validation, production, public deployment, visual pass, score generation,
 * or matrix collapse.
 */

import {
  H_EARTH_MATRIX_SEPARATION,
  H_EARTH_ACTIVE_GROUND_VIEW,
  H_EARTH_SOURCE_SCENE_IDENTITY,
  H_EARTH_MATRIX_PATH3_DOMAIN_BINDING,
  H_EARTH_MATRIX_PATH3_BINDING_ADMISSION,
  H_EARTH_MATRIX_PATH3_DEPENDENCY,
  H_EARTH_MATRIX_PATH3_DEPENDENCY_DIRECTION_LAW,
  H_EARTH_MATRIX_REJECTED_BINDING_CLASSIFICATION,
  H_EARTH_MATRIX_STATE_CLASSIFICATION_REFERENCE,
  H_EARTH_MATRIX_ACTION_IDENTIFIER_BRIDGE,
  H_EARTH_MATRIX_DOWNSTREAM_RENEWAL,
  H_EARTH_SOURCE_LATTICE_AUTHORITY,
  H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
  H_EARTH_GROUND_CELL_001_LATTICE_SCOPE,
  getHEarthMatrixReceipt,
  getHEarthSourceLatticeAuthority,
  getHEarthGroundCell001LatticeScope,
  getHEarthSourceLatticeAddressFieldSchema,
  getHEarthMatrixPath3DomainBinding,
  getHEarthMatrixPath3BindingAdmission,
  getHEarthMatrixActionIdentifierBridge
} from './h-earth.matrix.js';

import {
  H_EARTH_GROUND_CELL_001,
  H_EARTH_GROUND_CELL_001_CONTRACT,
  H_EARTH_GROUND_CELL_001_SCENE_BINDING,
  H_EARTH_GROUND_CELL_001_PATH3_BINDING,
  H_EARTH_GROUND_CELL_001_LATTICE_BINDING,
  H_EARTH_GROUND_CELL_001_ADDRESS_FIELD_SUMMARY,
  H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
  H_EARTH_GROUND_CELL_001_RECEIPT,
  H_EARTH_ROOM_3_UNBLOCK_RECEIPT,
  H_EARTH_GROUND_CELL_001_DOWNSTREAM_INTERFACE,
  getHEarthGroundCell001Receipt,
  getHEarthGroundCell001Path3Binding,
  getHEarthGroundCell001LatticeBinding,
  getHEarthGroundCell001AddressFieldSummary,
  getHEarthRoom3UnblockReceipt
} from './cells/ground-cell-001.js';

import {
  H_EARTH_ZONE_BOUNDARIES,
  H_EARTH_GROUND_CELL_001_ZONES,
  H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,
  H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_ZONE_IDS,
  H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL,
  H_EARTH_GROUND_CELL_001_ZONE_REGION_RULES,
  H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
  H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,
  H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
  H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL,
  H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,
  H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,
  H_EARTH_GROUND_CELL_001_ALLOWED_ZONE_ACTIONS,
  H_EARTH_GROUND_CELL_001_BLOCKED_ZONE_ACTIONS,
  H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,
  H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,
  getHEarthGroundCell001ZonesReceipt,
  getHEarthRoom3ObjectMappingUnblockReceipt
} from './zones/ground-cell-001.zones.js';

import {
  H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT,
  H_EARTH_PRIMARY_INSPECTION_TARGET,
  H_EARTH_SUPPORTING_INSPECTION_TARGETS,
  H_EARTH_CONTEXT_OBJECTS,
  H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_OBJECT_IDS,
  H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL,
  H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS,
  H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS,
  H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES,
  H_EARTH_GROUND_CELL_001_OBJECT_CONTEXT_BOUNDARIES,
  H_EARTH_GROUND_CELL_001_OBJECTS,
  H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS,
  H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE,
  H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE,
  H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,
  H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE,
  H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT,
  H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT,
  getHEarthGroundCell001ObjectsReceipt,
  getHEarthRoom4ActionBindingUnblockReceipt
} from './objects/ground-cell-001.objects.js';

import {
  H_EARTH_INSPECT_GROUND_ACTION_CONTRACT,
  H_EARTH_INSPECT_GROUND_BOUNDARIES,
  H_EARTH_INSPECT_GROUND_TARGETS,
  H_EARTH_INSPECT_GROUND_STATE_PATH,
  H_EARTH_INSPECT_GROUND_INPUT_MODEL,
  H_EARTH_INSPECT_GROUND_TARGET_MODEL,
  H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING,
  H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS,
  H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
  H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL,
  H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,
  H_EARTH_INSPECT_GROUND_ACTION,
  H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,
  H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT,
  getHEarthInspectGroundActionReceipt,
  getHEarthRoom5ReadoutBindingUnblockReceipt,
  getHEarthInspectGroundObjectAnchorBinding,
  getHEarthInspectGroundObjectBindings,
  getHEarthInspectGroundOutputModel
} from './actions/inspect-ground.js';

import {
  H_EARTH_GROUND_CONDITION_READ_CONTRACT,
  H_EARTH_GROUND_CONDITION_READ_BOUNDARIES,
  H_EARTH_GROUND_CONDITION_READ_TARGETS,
  H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL,
  H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS,
  H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL,
  H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE,
  H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD,
  H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL,
  H_EARTH_GROUND_CONDITION_READ,
  H_EARTH_GROUND_CONDITION_READ_RECEIPT,
  H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT,
  groundConditionRead,
  getHEarthGroundConditionReadReceipt,
  getHEarthRoom6ReceiptBindingUnblockReceipt,
  getHEarthGroundConditionReadObjectBindings,
  getHEarthGroundConditionReadOutputModel
} from './readouts/ground-condition-read.js';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);
const EMPTY_FROZEN_OBJECT = Object.freeze({});

const H_EARTH_RECEIPTS_ALLOWED_INPUT_KEYS = Object.freeze([
  'activeMatrix',
  'activeMatrixRole',
  'activeCell',
  'sceneIdentity',
  'sourceAction',
  'sourceActionId',
  'runtimeIntentId',
  'readoutName',
  'readoutId',
  'primaryFocusTarget',
  'supportingInspectionTargets',
  'requestedReceipt'
]);

const H_EARTH_RECEIPTS_REJECTED_INPUT_KEYS = Object.freeze([
  'actionDescriptor',
  'readoutDescriptor'
]);

const H_EARTH_RECEIPTS_ALLOWED_INPUT_KEY_SET = new Set(
  H_EARTH_RECEIPTS_ALLOWED_INPUT_KEYS
);

const H_EARTH_RECEIPTS_REJECTED_INPUT_KEY_SET = new Set(
  H_EARTH_RECEIPTS_REJECTED_INPUT_KEYS
);

const H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS = Object.freeze([
  ...H_EARTH_SUPPORTING_INSPECTION_TARGETS
]);

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function hasOwn(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function freezeArray(values = []) {
  return Object.freeze(Array.isArray(values) ? [...values] : []);
}

function dedupeFrozen(values = []) {
  return Object.freeze(
    Array.isArray(values)
      ? values.filter((value, index, array) => array.indexOf(value) === index)
      : []
  );
}

function resolveInputContainerStatus(input) {
  if (input === undefined) {
    return Object.freeze({
      status: 'OMITTED_DEFAULT_INPUT_ALLOWED',
      issue: null,
      record: EMPTY_FROZEN_OBJECT
    });
  }

  if (isPlainRecord(input)) {
    return Object.freeze({
      status: 'VALID_PLAIN_RECORD',
      issue: null,
      record: input
    });
  }

  if (Array.isArray(input)) {
    return Object.freeze({
      status: 'MALFORMED_ARRAY_INPUT',
      issue: 'H_EARTH_RECEIPTS_INPUT_CONTAINER_INVALID:ARRAY_NOT_ALLOWED',
      record: EMPTY_FROZEN_OBJECT
    });
  }

  if (input === null) {
    return Object.freeze({
      status: 'MALFORMED_NULL_INPUT',
      issue: 'H_EARTH_RECEIPTS_INPUT_CONTAINER_INVALID:NULL_NOT_ALLOWED',
      record: EMPTY_FROZEN_OBJECT
    });
  }

  return Object.freeze({
    status: 'MALFORMED_NON_RECORD_INPUT',
    issue: 'H_EARTH_RECEIPTS_INPUT_CONTAINER_INVALID:PLAIN_RECORD_REQUIRED',
    record: EMPTY_FROZEN_OBJECT
  });
}

function resolveRequiredStringField(record, key, fallback) {
  if (!hasOwn(record, key)) {
    return Object.freeze({
      supplied: false,
      valid: true,
      value: fallback,
      issue: null
    });
  }

  if (typeof record[key] !== 'string') {
    return Object.freeze({
      supplied: true,
      valid: false,
      value: null,
      issue: `H_EARTH_RECEIPTS_INPUT_FIELD_INVALID_TYPE:${key}`
    });
  }

  const value = record[key].trim();

  if (value.length === 0) {
    return Object.freeze({
      supplied: true,
      valid: false,
      value: null,
      issue: `H_EARTH_RECEIPTS_INPUT_FIELD_EMPTY:${key}`
    });
  }

  return Object.freeze({
    supplied: true,
    valid: true,
    value,
    issue: null
  });
}

export function normalizeHEarthReceiptsString(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeHEarthReceiptsTargetEntries(targets = []) {
  if (!Array.isArray(targets)) {
    return Object.freeze({
      validContainer: false,
      entries: EMPTY_FROZEN_ARRAY,
      invalidEntries: EMPTY_FROZEN_ARRAY,
      duplicateSupportingTargets: EMPTY_FROZEN_ARRAY
    });
  }

  const entries = [];
  const invalidEntries = [];

  targets.forEach((target, index) => {
    if (typeof target !== 'string') {
      invalidEntries.push(
        Object.freeze({
          index,
          value: target,
          issue: `H_EARTH_RECEIPTS_INPUT_SUPPORTING_TARGET_INVALID_TYPE:${index}`
        })
      );
      return;
    }

    const normalized = target.trim();

    if (normalized.length === 0) {
      invalidEntries.push(
        Object.freeze({
          index,
          value: target,
          issue: `H_EARTH_RECEIPTS_INPUT_SUPPORTING_TARGET_EMPTY:${index}`
        })
      );
      return;
    }

    entries.push(normalized);
  });

  const duplicateSupportingTargets = entries.filter(
    (target, index, array) => array.indexOf(target) !== index
  );

  return Object.freeze({
    validContainer: true,
    entries: freezeArray(entries),
    invalidEntries: freezeArray(invalidEntries),
    duplicateSupportingTargets: dedupeFrozen(duplicateSupportingTargets)
  });
}

export function normalizeHEarthReceiptsTargets(targets = []) {
  return normalizeHEarthReceiptsTargetEntries(targets).entries;
}

export const H_EARTH_RECEIPTS_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  renewsContractId:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',
  sourceRoot: '/h-earth-3d/',
  room: 'ROOM_6_RECEIPTS_AND_INTEGRITY_AFTER_READOUT',

  fileClass: 'PATH3_GROUND_INSPECTION_RECEIPT_BINDING_DESCRIPTOR_ONLY',

  upstreamMatrixContractId:
    'H_EARTH_MATRIX_FILE_RENEWAL_STEP_009D_REJECTED_BINDING_CLASSIFICATION_GUARD_v1',

  upstreamCellContractId:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_011A_PATH3_DOMAIN_BINDING_CONSUMER_v1',

  activeUpstreamZoneContractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

  activeUpstreamObjectContractId:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2',

  activeUpstreamActionContractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v2',

  activeUpstreamReadoutContractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1',

  exactHistoricalZoneLineageContractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

  exactHistoricalObjectLineageContractId:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

  exactHistoricalActionLineageContractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v1',

  retiredContractLineage: Object.freeze({
    matrix:
      'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',
    cell:
      'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',
    zones:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',
    objects:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',
    action:
      'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',
    readout:
      'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',
    receipts:
      'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1'
  }),

  upstreamFiles: Object.freeze({
    matrix: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.matrix.js',
    cell: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/cells/ground-cell-001.js',
    zones: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/zones/ground-cell-001.zones.js',
    objects: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',
    action: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/actions/inspect-ground.js',
    readout: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/readouts/ground-condition-read.js'
  }),

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  spatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  firstReadout: 'Ground Condition Read',
  firstReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  renewalPurpose:
    'Bind H_EARTH_GROUND_INSPECTION_RECEIPT and H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT to the active Step 009D through Step 011E Path 3 source chain without creating runtime persistence, execution, renderer activation, validation, production, deployment, visual pass, or matrix collapse.',

  renewalScope: Object.freeze({
    step009DMatrixConsumed: true,
    step011ACellConsumed: true,
    step034KZonesConsumed: true,
    step034Jv2ObjectsConsumed: true,
    step011Dv2InspectGroundConsumed: true,
    step011EGroundConditionReadConsumed: true,

    groundInspectionReceiptBound: true,
    nonRenderingHarnessReceiptBound: true,
    receiptChainModelDefined: true,
    receiptHandoffDefined: true,
    integrityHandoffPrepared: true,

    retired031LineagePreservedAsHistory: true,
    retired031LineageActiveAuthority: false,

    path3AuthorityCreatedHere: false,
    matrixAuthorityCreatedHere: false,
    activeCellBindingCreatedHere: false,
    zoneAuthorityCreatedHere: false,
    objectAuthorityCreatedHere: false,
    actionAuthorityCreatedHere: false,
    readoutAuthorityCreatedHere: false,
    runtimeReceiptPersistenceAdded: false,
    routeExposureAdded: false,
    rendererActivationAdded: false,
    validationAdded: false,
    productionAdded: false
  }),

  sourceEvidenceSeparation: Object.freeze({
    backupEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    repositoryInstallationEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    runtimeExecutionEvidenceOwnedExternally: true,
    fetchReadbackEvidenceOwnedExternally: true
  })
});

export const H_EARTH_RECEIPTS_BOUNDARIES = Object.freeze({
  receiptBindingAuthority: true,
  descriptorOnlyReceiptAuthority: true,
  path3ReceiptBindingOnly: true,

  groundInspectionReceiptDescriptorOnly: true,
  nonRenderingHarnessReceiptDescriptorOnly: true,

  path3Mutation: false,
  downstreamSceneMutation: false,

  runtimeReceiptPersistence: false,
  runtimeReceiptCreation: false,
  gameplayExecutionClaim: false,
  runtimeActionExecutionClaim: false,
  runtimeReadoutExecutionClaim: false,

  matrixAuthorityCreatedHere: false,
  path3AuthorityCreatedHere: false,
  activeCellBindingCreatedHere: false,
  zoneMappingCreatedHere: false,
  objectCompositionCreatedHere: false,
  actionBehaviorCreatedHere: false,
  readoutPayloadCreatedHere: false,

  routeActivation: false,
  routeRuntimeCreation: false,
  routeExposureCompleted: false,
  publicRouteIntegration: false,
  githubInstallation: false,

  rendererActivation: false,
  compositorActivation: false,
  controllerActivation: false,
  materialChannelRendering: false,
  rendererGeometryCreatedHere: false,
  assetLoading: false,

  webglActivation: false,
  canvasActivation: false,
  svgActivation: false,
  iframeActivation: false,

  latticeActivation: false,
  runtime16x16LatticeActivationClaim: false,
  active16x16RuntimeClaim: false,
  active256AddressRuntimeClaim: false,

  movementExpansion: false,
  traversalExpansion: false,
  openWorldExpansion: false,
  walkingSystemClaim: false,
  freeFlightSystemClaim: false,
  survivalSimulation: false,
  swimming: false,
  fluidSimulation: false,
  weatherSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,
  persistentSaveLogic: false,

  diagnosticScoreClaim: false,
  healthScoreClaim: false,
  survivalScoreClaim: false,
  empiricalDiagnosisClaim: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,

  mirrorManorRouteCanonNameClaim: false,
  matrixCollapse: false
});

export const H_EARTH_RECEIPTS_INPUT_MODEL = Object.freeze({
  inputModelId: 'H_EARTH_RECEIPTS_INPUT_MODEL',
  status:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
      ? 'PATH3_GROUND_INSPECTION_RECEIPT_INPUT_DESCRIPTOR_ONLY'
      : 'PATH3_GROUND_INSPECTION_RECEIPT_INPUT_BLOCKED_BY_BINDING_REJECTION',

  acceptedInputKeys: H_EARTH_RECEIPTS_ALLOWED_INPUT_KEYS,
  rejectedInputKeys: H_EARTH_RECEIPTS_REJECTED_INPUT_KEYS,

  defaultInput: Object.freeze({
    activeMatrix: 'H-Earth',
    activeMatrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',
    sourceAction: 'Inspect Ground',
    sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentId: 'INSPECT_GROUND',
    readoutName: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    requestedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
  }),

  externalActionDescriptorAcceptance: false,
  externalReadoutDescriptorAcceptance: false,
  receiptsAlwaysConsumeStep011EResult: true,

  inputCreatesRuntimeExecution: false,
  inputCreatesReceiptPersistence: false,
  inputCreatesRendererState: false,

  boundary: H_EARTH_RECEIPTS_BOUNDARIES
});

export function buildHEarthReceiptsInput(input = undefined) {
  const containerResolution = resolveInputContainerStatus(input);
  const safeInput = containerResolution.record;
  const defaultInput = H_EARTH_RECEIPTS_INPUT_MODEL.defaultInput;

  const providedKeys = Object.keys(safeInput);

  const unknownInputKeys = freezeArray(
    providedKeys.filter(
      (key) =>
        H_EARTH_RECEIPTS_ALLOWED_INPUT_KEY_SET.has(key) === false &&
        H_EARTH_RECEIPTS_REJECTED_INPUT_KEY_SET.has(key) === false
    )
  );

  const rejectedInputKeysProvided = freezeArray(
    providedKeys.filter((key) => H_EARTH_RECEIPTS_REJECTED_INPUT_KEY_SET.has(key))
  );

  const activeMatrixField = resolveRequiredStringField(
    safeInput,
    'activeMatrix',
    defaultInput.activeMatrix
  );
  const activeMatrixRoleField = resolveRequiredStringField(
    safeInput,
    'activeMatrixRole',
    defaultInput.activeMatrixRole
  );
  const activeCellField = resolveRequiredStringField(
    safeInput,
    'activeCell',
    defaultInput.activeCell
  );
  const sceneIdentityField = resolveRequiredStringField(
    safeInput,
    'sceneIdentity',
    defaultInput.sceneIdentity
  );
  const sourceActionField = resolveRequiredStringField(
    safeInput,
    'sourceAction',
    defaultInput.sourceAction
  );
  const sourceActionIdField = resolveRequiredStringField(
    safeInput,
    'sourceActionId',
    defaultInput.sourceActionId
  );
  const runtimeIntentIdField = resolveRequiredStringField(
    safeInput,
    'runtimeIntentId',
    defaultInput.runtimeIntentId
  );
  const readoutNameField = resolveRequiredStringField(
    safeInput,
    'readoutName',
    defaultInput.readoutName
  );
  const readoutIdField = resolveRequiredStringField(
    safeInput,
    'readoutId',
    defaultInput.readoutId
  );
  const primaryFocusTargetField = resolveRequiredStringField(
    safeInput,
    'primaryFocusTarget',
    defaultInput.primaryFocusTarget
  );
  const requestedReceiptField = resolveRequiredStringField(
    safeInput,
    'requestedReceipt',
    defaultInput.requestedReceipt
  );

  const supportingTargetsSupplied = hasOwn(
    safeInput,
    'supportingInspectionTargets'
  );

  const rawSupportingTargetSource = supportingTargetsSupplied
    ? safeInput.supportingInspectionTargets
    : defaultInput.supportingInspectionTargets;

  const supportingTargetSequence =
    normalizeHEarthReceiptsTargetEntries(rawSupportingTargetSource);

  const supportingTargetEntryIssues = supportingTargetSequence.invalidEntries.map(
    (entry) => entry.issue
  );

  const fieldIssues = dedupeFrozen(
    [
      activeMatrixField.issue,
      activeMatrixRoleField.issue,
      activeCellField.issue,
      sceneIdentityField.issue,
      sourceActionField.issue,
      sourceActionIdField.issue,
      runtimeIntentIdField.issue,
      readoutNameField.issue,
      readoutIdField.issue,
      primaryFocusTargetField.issue,
      requestedReceiptField.issue,
      supportingTargetsSupplied === true &&
      Array.isArray(rawSupportingTargetSource) === false
        ? 'H_EARTH_RECEIPTS_INPUT_FIELD_INVALID_TYPE:supportingInspectionTargets'
        : null,
      ...rejectedInputKeysProvided.map(
        (key) => `H_EARTH_RECEIPTS_INPUT_REJECTED_KEY_PROVIDED:${key}`
      ),
      ...supportingTargetEntryIssues
    ].filter(Boolean)
  );

  const allRequiredFieldsValid =
    activeMatrixField.valid === true &&
    activeMatrixRoleField.valid === true &&
    activeCellField.valid === true &&
    sceneIdentityField.valid === true &&
    sourceActionField.valid === true &&
    sourceActionIdField.valid === true &&
    runtimeIntentIdField.valid === true &&
    readoutNameField.valid === true &&
    readoutIdField.valid === true &&
    primaryFocusTargetField.valid === true &&
    requestedReceiptField.valid === true &&
    fieldIssues.length === 0;

  return Object.freeze({
    activeMatrix: activeMatrixField.value,
    activeMatrixRole: activeMatrixRoleField.value,
    activeCell: activeCellField.value,
    sceneIdentity: sceneIdentityField.value,
    sourceAction: sourceActionField.value,
    sourceActionId: sourceActionIdField.value,
    runtimeIntentId: runtimeIntentIdField.value,
    readoutName: readoutNameField.value,
    readoutId: readoutIdField.value,
    primaryFocusTarget: primaryFocusTargetField.value,
    supportingInspectionTargets: supportingTargetSequence.entries,
    invalidSupportingTargetEntries: supportingTargetSequence.invalidEntries,
    duplicateSupportingTargets:
      supportingTargetSequence.duplicateSupportingTargets,
    requestedReceipt: requestedReceiptField.value,

    fieldIssues,
    allRequiredFieldsValid,

    inputContainerStatus: containerResolution.status,
    inputContainerIssue: containerResolution.issue,
    providedInputKeys: freezeArray(providedKeys),
    unknownInputKeys,
    rejectedInputKeysProvided,

    descriptorOnly: true,
    runtimeExecutionClaim: false,
    receiptPersistenceClaim: false
  });
}

export function checkHEarthReceiptsInput(input = undefined) {
  const normalizedInput = buildHEarthReceiptsInput(input);

  const supportingTargetsContainDuplicates =
    normalizedInput.duplicateSupportingTargets.length > 0;

  const supportingTargetsSetExact =
    normalizedInput.supportingInspectionTargets.length ===
      H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS.length &&
    H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS.every((target) =>
      normalizedInput.supportingInspectionTargets.includes(target)
    );

  const supportingTargetOrderCanonical =
    normalizedInput.supportingInspectionTargets.length ===
      H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS.length &&
    H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS.every(
      (target, index) =>
        normalizedInput.supportingInspectionTargets[index] === target
    );

  const missingSupportingTargets =
    H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS.filter(
      (target) =>
        normalizedInput.supportingInspectionTargets.includes(target) === false
    );

  const extraSupportingTargets =
    normalizedInput.supportingInspectionTargets.filter(
      (target) =>
        H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS.includes(target) === false
    );

  const checks = Object.freeze({
    inputContainerAccepted: normalizedInput.inputContainerIssue === null,
    unknownInputKeysRejected: normalizedInput.unknownInputKeys.length === 0,
    rejectedInputKeysRejected:
      normalizedInput.rejectedInputKeysProvided.length === 0,
    allRequiredFieldsValid: normalizedInput.allRequiredFieldsValid === true,
    fieldIssuesEmpty: normalizedInput.fieldIssues.length === 0,

    path3BindingAccepted:
      H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
    matrixBindingAccepted:
      H_EARTH_MATRIX_PATH3_BINDING_ADMISSION.admitted === true,
    room6ReceiptBindingAllowed:
      H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT
        .room6ReceiptFileMayProceed === true,

    activeMatrixAccepted: normalizedInput.activeMatrix === 'H-Earth',
    activeMatrixRoleAccepted:
      normalizedInput.activeMatrixRole === 'Ground-View Matrix',
    activeCellAccepted:
      normalizedInput.activeCell === 'H_EARTH_GROUND_CELL_001',
    sceneIdentityAccepted:
      normalizedInput.sceneIdentity ===
      'earth-water-air-survival-shoreline-manor',

    sourceActionAccepted: normalizedInput.sourceAction === 'Inspect Ground',
    sourceActionIdAccepted:
      normalizedInput.sourceActionId === 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentIdAccepted:
      normalizedInput.runtimeIntentId === 'INSPECT_GROUND',
    readoutNameAccepted:
      normalizedInput.readoutName === 'Ground Condition Read',
    readoutIdAccepted:
      normalizedInput.readoutId === 'H_EARTH_GROUND_CONDITION_READ',

    primaryFocusTargetAccepted:
      normalizedInput.primaryFocusTarget === H_EARTH_PRIMARY_INSPECTION_TARGET,

    supportingTargetEntriesValid:
      normalizedInput.invalidSupportingTargetEntries.length === 0,
    supportingTargetsContainNoDuplicates:
      supportingTargetsContainDuplicates === false,
    supportingTargetSetExact: supportingTargetsSetExact,
    supportingTargetOrderCanonical,
    requestedReceiptAccepted:
      normalizedInput.requestedReceipt ===
      'H_EARTH_GROUND_INSPECTION_RECEIPT'
  });

  const failureCodes = [];

  if (normalizedInput.inputContainerIssue) {
    failureCodes.push(normalizedInput.inputContainerIssue);
  }

  if (normalizedInput.unknownInputKeys.length > 0) {
    failureCodes.push(
      ...normalizedInput.unknownInputKeys.map(
        (key) => `H_EARTH_RECEIPTS_INPUT_UNKNOWN_KEY_REJECTED:${key}`
      )
    );
  }

  if (normalizedInput.fieldIssues.length > 0) {
    failureCodes.push(...normalizedInput.fieldIssues);
  }

  if (checks.supportingTargetsContainNoDuplicates !== true) {
    failureCodes.push(
      ...normalizedInput.duplicateSupportingTargets.map(
        (target) =>
          `H_EARTH_RECEIPTS_INPUT_DUPLICATE_SUPPORTING_TARGET:${target}`
      )
    );
  }

  if (checks.supportingTargetSetExact !== true) {
    failureCodes.push(
      'H_EARTH_RECEIPTS_INPUT_CHECK_FAILED:supportingTargetSetExact'
    );
  }

  if (checks.supportingTargetOrderCanonical !== true) {
    failureCodes.push(
      'H_EARTH_RECEIPTS_INPUT_CHECK_FAILED:supportingTargetOrderCanonical'
    );
  }

  for (const [key, value] of Object.entries(checks)) {
    if (
      value !== true &&
      key !== 'supportingTargetsContainNoDuplicates' &&
      key !== 'supportingTargetSetExact' &&
      key !== 'supportingTargetOrderCanonical' &&
      key !== 'inputContainerAccepted' &&
      key !== 'unknownInputKeysRejected' &&
      key !== 'fieldIssuesEmpty'
    ) {
      failureCodes.push(`H_EARTH_RECEIPTS_INPUT_CHECK_FAILED:${key}`);
    }
  }

  return Object.freeze({
    input: normalizedInput,
    checks,
    passed: Object.values(checks).every((value) => value === true),
    missingSupportingTargets: freezeArray(missingSupportingTargets),
    extraSupportingTargets: freezeArray(extraSupportingTargets),
    failureCodes: dedupeFrozen(failureCodes),
    descriptorOnly: true,
    runtimeExecutionClaim: false,
    validationClaim: false
  });
}

export function buildHEarthGroundInspectionReceiptBinding(input = undefined) {
  const inputCheck = checkHEarthReceiptsInput(input);

  const readoutInput = Object.freeze({
    activeMatrix: inputCheck.input.activeMatrix,
    activeMatrixRole: inputCheck.input.activeMatrixRole,
    activeCell: inputCheck.input.activeCell,
    sceneIdentity: inputCheck.input.sceneIdentity,
    sourceAction: inputCheck.input.sourceAction,
    sourceActionId: inputCheck.input.sourceActionId,
    runtimeIntentId: inputCheck.input.runtimeIntentId,
    readoutName: inputCheck.input.readoutName,
    readoutId: inputCheck.input.readoutId,
    primaryFocusTarget: inputCheck.input.primaryFocusTarget,
    supportingInspectionTargets: inputCheck.input.supportingInspectionTargets,
    requestedReceipt: inputCheck.input.requestedReceipt
  });

  const readoutResult = groundConditionRead(readoutInput);
  const sourceReadoutDescriptor = readoutResult?.descriptor || null;

  const sourceReadoutLawful =
    readoutResult?.lawful === true &&
    readoutResult?.handoffEligible === true &&
    Array.isArray(readoutResult?.issues) &&
    readoutResult.issues.length === 0 &&
    sourceReadoutDescriptor?.readoutDescriptorReady === true &&
    sourceReadoutDescriptor?.sourceActionLawful === true &&
    readoutResult?.receiptHandoff !== null &&
    readoutResult?.receiptHandoff?.handoffEligible === true;

  const receiptBindingReady =
    inputCheck.passed === true && sourceReadoutLawful === true;

  const combinedIssues = dedupeFrozen([
    ...inputCheck.failureCodes,
    ...(Array.isArray(readoutResult?.issues) ? readoutResult.issues : []),
    ...(inputCheck.passed === true && sourceReadoutLawful !== true
      ? [
          'H_EARTH_RECEIPTS_READOUT_HANDOFF_REJECTED:SOURCE_READOUT_RESULT_NOT_LAWFUL'
        ]
      : [])
  ]);

  const receiptShape = receiptBindingReady
    ? Object.freeze({
        receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
        receiptId: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
        activeMatrix: inputCheck.input.activeMatrix,
        activeMatrixRole: inputCheck.input.activeMatrixRole,
        activeCell: inputCheck.input.activeCell,
        domainCellId: 'H_EARTH_GROUND_CELL_001',
        spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
        sceneIdentity: inputCheck.input.sceneIdentity,
        sourceAction: inputCheck.input.sourceAction,
        descriptorActionId: inputCheck.input.sourceActionId,
        runtimeIntentId: inputCheck.input.runtimeIntentId,
        readoutName: inputCheck.input.readoutName,
        readoutId: inputCheck.input.readoutId,
        primaryFocusTarget: inputCheck.input.primaryFocusTarget,
        supportingInspectionTargets: inputCheck.input.supportingInspectionTargets,
        matrixSeparationPreserved: true,
        receiptPersistenceDefinedHere: false,
        matrixCollapse: false
      })
    : null;

  return Object.freeze({
    bindingId: 'H_EARTH_GROUND_INSPECTION_RECEIPT_BINDING',
    receiptId: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    receiptRole: 'FIRST_GROUND_VIEW_INSPECTION_RECEIPT_DESCRIPTOR',

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    spatialCellId: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING.spatialCellId,
    domainCellId: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING.domainCellId,
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    path3BindingAdmission: H_EARTH_MATRIX_PATH3_BINDING_ADMISSION,
    path3DomainBinding: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING,
    cellPath3Binding: H_EARTH_GROUND_CELL_001_PATH3_BINDING,

    sourceAction: 'Inspect Ground',
    descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentId: 'INSPECT_GROUND',

    sourceReadout: 'Ground Condition Read',
    sourceReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
    expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

    primaryObjectId: H_EARTH_PRIMARY_INSPECTION_TARGET,
    supportingObjectIds: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    contextObjectIds: H_EARTH_CONTEXT_OBJECTS,

    expectedPrimaryObject: 'OBJ_002_FOREGROUND_WET_SAND',
    expectedSupportingObjects: freezeArray([
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_010_SMALL_BEACH_STONES',
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',
      'OBJ_005_SHORELINE_FOAM_LINE'
    ]),

    sourceChain: Object.freeze({
      matrixContract: H_EARTH_RECEIPTS_CONTRACT.upstreamMatrixContractId,
      cellContract: H_EARTH_RECEIPTS_CONTRACT.upstreamCellContractId,
      zoneContract: H_EARTH_RECEIPTS_CONTRACT.activeUpstreamZoneContractId,
      objectContract: H_EARTH_RECEIPTS_CONTRACT.activeUpstreamObjectContractId,
      actionContract: H_EARTH_RECEIPTS_CONTRACT.activeUpstreamActionContractId,
      readoutContract:
        H_EARTH_RECEIPTS_CONTRACT.activeUpstreamReadoutContractId,
      receiptsContract: H_EARTH_RECEIPTS_CONTRACT.contractId
    }),

    inputCheck,
    sourceReadoutInput: readoutInput,
    sourceReadoutResult: readoutResult,
    sourceReadoutDescriptor,
    sourceReadoutLawful,

    lawful: receiptBindingReady,
    handoffEligible: receiptBindingReady,
    receiptBindingReady,
    issues: combinedIssues,

    receiptShape,
    descriptorOnly: true,
    runtimeReceiptPersistence: false,
    receiptCreationClaim: false,
    validationClaim: false,
    productionClaim: false,

    boundary: H_EARTH_RECEIPTS_BOUNDARIES
  });
}

function buildHEarthGroundInspectionReceiptFromBinding(binding) {
  const status =
    binding.receiptBindingReady === true
      ? 'PATH3_GROUND_INSPECTION_RECEIPT_BOUND_DESCRIPTOR_ONLY'
      : 'PATH3_GROUND_INSPECTION_RECEIPT_REJECTED_DESCRIPTOR_ONLY';

  return Object.freeze({
    receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    receiptId: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    contractId:
      'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1',

    renewsReceiptContractId:
      'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1',

    status,
    lawful: binding.lawful === true,
    handoffEligible: binding.handoffEligible === true,
    issues: binding.issues,

    file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',
    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    spatialCellId: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING.spatialCellId,
    domainCellId: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING.domainCellId,
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    firstAction: 'Inspect Ground',
    descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentId: 'INSPECT_GROUND',
    firstReadout: 'Ground Condition Read',
    firstReadoutId: 'H_EARTH_GROUND_CONDITION_READ',

    selectedObjectId:
      binding.receiptBindingReady === true
        ? H_EARTH_PRIMARY_INSPECTION_TARGET
        : null,
    selectedSurface:
      binding.receiptBindingReady === true ? 'Foreground Wet Sand' : null,
    selectedZoneId:
      binding.receiptBindingReady === true
        ? 'ZONE_001_FOREGROUND_INSPECTION_ZONE'
        : null,
    classification:
      binding.receiptBindingReady === true
        ? 'PRIMARY_INSPECTION_TARGET'
        : 'REJECTED_RECEIPT_BINDING',

    supportingObjectIds: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    contextObjectIds: H_EARTH_CONTEXT_OBJECTS,

    upstreamMatrixReceipt: getHEarthMatrixReceipt(),
    upstreamMatrixPath3DomainBinding: getHEarthMatrixPath3DomainBinding(),
    upstreamMatrixPath3BindingAdmission: getHEarthMatrixPath3BindingAdmission(),
    upstreamActionIdentifierBridge: getHEarthMatrixActionIdentifierBridge(),

    upstreamCellReceipt: getHEarthGroundCell001Receipt(),
    upstreamCellPath3Binding: getHEarthGroundCell001Path3Binding(),

    upstreamZonesReceipt: getHEarthGroundCell001ZonesReceipt(),
    upstreamObjectsReceipt: getHEarthGroundCell001ObjectsReceipt(),
    upstreamActionReceipt: getHEarthInspectGroundActionReceipt(),
    upstreamReadoutReceipt: getHEarthGroundConditionReadReceipt(),

    binding,
    actionDescriptor: H_EARTH_INSPECT_GROUND_ACTION,
    actionOutputModel: H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
    readoutDescriptor: H_EARTH_GROUND_CONDITION_READ,
    readoutOutputModel: H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL,
    readoutReceipt: H_EARTH_GROUND_CONDITION_READ_RECEIPT,

    receiptPosture: Object.freeze({
      descriptorOnly: true,
      sourceBindingReceiptOnly: true,
      runtimeReceiptPersistence: false,
      runtimeReceiptCreation: false,
      runtimeActionExecutionClaim: false,
      runtimeReadoutExecutionClaim: false,
      readoutProductionClaim: false,
      validationClaim: false,
      productionClaim: false,
      deploymentClaim: false,
      visualPassClaim: false
    }),

    receiptShape: binding.receiptShape,
    matrixSeparation: H_EARTH_MATRIX_SEPARATION,
    boundary: H_EARTH_RECEIPTS_BOUNDARIES
  });
}

export function buildHEarthGroundInspectionReceipt(input = undefined) {
  return buildHEarthGroundInspectionReceiptFromBinding(
    buildHEarthGroundInspectionReceiptBinding(input)
  );
}

export function hEarthGroundInspectionReceipt(input = undefined) {
  return buildHEarthGroundInspectionReceipt(input);
}

const H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING =
  buildHEarthGroundInspectionReceiptBinding();

const H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT =
  buildHEarthGroundInspectionReceiptFromBinding(
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING
  );

const H_EARTH_RECEIPT_BINDING_READY =
  H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true;

export const H_EARTH_RECEIPT_SOURCE_CHAIN_STATUS = Object.freeze({
  statusId: 'H_EARTH_RECEIPT_SOURCE_CHAIN_STATUS',
  status: H_EARTH_RECEIPT_BINDING_READY
    ? 'PATH3_SOURCE_CHAIN_BACKED_AND_READY_FOR_RECEIPT_BINDING_DESCRIPTOR_ONLY'
    : 'PATH3_SOURCE_CHAIN_PRESENT_BUT_RECEIPT_BINDING_NOT_YET_LAWFUL_DESCRIPTOR_ONLY',

  activeChain: Object.freeze({
    step009D: Object.freeze({
      step: '009D',
      file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.matrix.js',
      contract:
        'H_EARTH_MATRIX_FILE_RENEWAL_STEP_009D_REJECTED_BINDING_CLASSIFICATION_GUARD_v1',
      status: H_EARTH_MATRIX_PATH3_BINDING_ADMISSION.admitted === true
        ? 'BACKED_ACTIVE_MATRIX_STANDARD'
        : 'BACKED_MATRIX_PRESENT_BUT_BINDING_NOT_ADMITTED',
      path3DomainBindingAvailable: true,
      path3BindingAdmissionAvailable: true,
      activeAuthority: H_EARTH_MATRIX_PATH3_BINDING_ADMISSION.admitted === true
    }),

    step011A: Object.freeze({
      step: '011A',
      file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/cells/ground-cell-001.js',
      contract:
        'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_011A_PATH3_DOMAIN_BINDING_CONSUMER_v1',
      status: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
        ? 'PATH3_DOMAIN_BINDING_CONSUMER'
        : 'CELL_PRESENT_BUT_BINDING_NOT_ADMITTED',
      activeAuthority: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
    }),

    step034K: Object.freeze({
      step: '034K',
      file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/zones/ground-cell-001.zones.js',
      contract:
        'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',
      status: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
        ? 'BACKED_ACTIVE_ZONE_COMPOSITION_STANDARD'
        : 'ZONE_PRESENT_BUT_UPSTREAM_BINDING_NOT_ADMITTED',
      activeAuthority: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
    }),

    step034Jv2: Object.freeze({
      step: '034J_V2',
      file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',
      contract:
        'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2',
      status: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
        ? 'BACKED_ACTIVE_OBJECT_COMPOSITION_STANDARD'
        : 'OBJECTS_PRESENT_BUT_UPSTREAM_BINDING_NOT_ADMITTED',
      activeAuthority: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
    }),

    step011Dv2: Object.freeze({
      step: '011D_V2',
      file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/actions/inspect-ground.js',
      contract:
        'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v2',
      status: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
        ? 'BACKED_ACTIVE_ACTION_BINDING_STANDARD'
        : 'ACTION_PRESENT_BUT_UPSTREAM_BINDING_NOT_ADMITTED',
      activeAuthority: H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
    }),

    step011E: Object.freeze({
      step: '011E',
      file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/readouts/ground-condition-read.js',
      contract:
        'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1',
      status: H_EARTH_RECEIPT_BINDING_READY
        ? 'BACKED_ACTIVE_READOUT_BINDING_STANDARD'
        : 'READOUT_PRESENT_BUT_TERMINAL_RESULT_NOT_LAWFUL',
      activeAuthority: H_EARTH_RECEIPT_BINDING_READY
    })
  }),

  retiredLineage: Object.freeze({
    step031A: 'RETIRED_COMPATIBILITY_HISTORY',
    step031B: 'RETIRED_COMPATIBILITY_HISTORY',
    step031C: 'RETIRED_COMPATIBILITY_HISTORY',
    step031D: 'RETIRED_COMPATIBILITY_HISTORY',
    step031E: 'RETIRED_COMPATIBILITY_HISTORY',
    step031F: 'RETIRED_COMPATIBILITY_HISTORY',
    step031G: 'RETIRED_COMPATIBILITY_HISTORY'
  }),

  spatialIdentity: Object.freeze({
    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    spatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',
    domainCellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor'
  }),

  sourceChainReadyForReceiptBinding: H_EARTH_RECEIPT_BINDING_READY,
  sourceChainReadyForRuntimeExecution: false,
  sourceChainReadyForRendererActivation: false,
  sourceChainReadyForValidation: false,
  sourceChainReadyForProduction: false,

  lawful: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.lawful === true,
  handoffEligible:
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
  issues: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.issues,

  boundary: H_EARTH_RECEIPTS_BOUNDARIES
});

export const H_EARTH_GROUND_INSPECTION_RECEIPT_BINDING =
  H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING;

export const H_EARTH_GROUND_INSPECTION_RECEIPT =
  H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT;

export const H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',
  receiptId: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',
  contractId:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  status: H_EARTH_RECEIPT_BINDING_READY
    ? 'NON_RENDERING_TEST_HARNESS_RECEIPT_BOUND_DESCRIPTOR_ONLY'
    : 'NON_RENDERING_TEST_HARNESS_RECEIPT_REJECTED_DESCRIPTOR_ONLY',

  lawful: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.lawful === true,
  handoffEligible:
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
  issues: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.issues,

  file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  spatialCellId: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING.spatialCellId,
  domainCellId: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING.domainCellId,
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  harnessClass: 'NON_RENDERING_INTERNAL_TEST_HARNESS_DESCRIPTOR',
  firstAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  verifiesSourceChainPresence: true,
  verifiesBoundaryPreservation: H_EARTH_RECEIPT_BINDING_READY,
  verifiesPath3BindingAdmissionPresent:
    H_EARTH_MATRIX_PATH3_BINDING_ADMISSION.admitted === true &&
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,

  doesNotExecuteRuntimeTests: true,
  doesNotActivateRuntime: true,
  doesNotActivateRenderer: true,
  doesNotClaimValidation: true,
  doesNotClaimProduction: true,

  receiptTargets: freezeArray([
    'H_EARTH_GROUND_INSPECTION_RECEIPT',
    'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT'
  ]),

  sourceChainStatus: H_EARTH_RECEIPT_SOURCE_CHAIN_STATUS,
  boundary: H_EARTH_RECEIPTS_BOUNDARIES
});

export const H_EARTH_RECEIPT_CHAIN_MODEL = Object.freeze({
  modelId: 'H_EARTH_RECEIPT_CHAIN_MODEL',
  status: H_EARTH_RECEIPT_BINDING_READY
    ? 'PATH3_SOURCE_RECEIPT_CHAIN_BOUND_DESCRIPTOR_ONLY'
    : 'PATH3_SOURCE_RECEIPT_CHAIN_PRESENT_BUT_TERMINAL_RECEIPT_BINDING_REJECTED',

  chainOrder: freezeArray([
    'H_EARTH_MATRIX_FILE_RENEWAL_STEP_009D_REJECTED_BINDING_CLASSIFICATION_GUARD_v1',
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_011A_PATH3_DOMAIN_BINDING_CONSUMER_v1',
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2',
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v2',
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1',
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1'
  ]),

  retiredChainOrder: freezeArray([
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1'
  ]),

  sourceFiles: H_EARTH_RECEIPTS_CONTRACT.upstreamFiles,

  activeReceiptIds: freezeArray([
    'H_EARTH_GROUND_INSPECTION_RECEIPT',
    'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT'
  ]),

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  spatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  firstReadout: 'Ground Condition Read',
  firstReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
  primaryReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  sourceChainStatus: H_EARTH_RECEIPT_SOURCE_CHAIN_STATUS,

  descriptorOnly: true,
  runtimeReceiptPersistence: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,
  visualPassClaim: false,

  boundary: H_EARTH_RECEIPTS_BOUNDARIES
});

export const H_EARTH_GROUND_INSPECTION_RECEIPT_HANDOFF = Object.freeze({
  handoffId: 'H_EARTH_GROUND_INSPECTION_RECEIPT_HANDOFF',
  status: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible
    ? 'ROOM_6_PATH3_RECEIPT_BINDING_HANDOFF_DEFINED_DESCRIPTOR_ONLY'
    : 'ROOM_6_PATH3_RECEIPT_BINDING_HANDOFF_REJECTED_DESCRIPTOR_ONLY',

  lawful: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.lawful === true,
  handoffEligible:
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
  issues: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.issues,

  fromRoom: 'ROOM_6_RECEIPTS_AND_INTEGRITY_AFTER_READOUT',

  toConsumers: freezeArray([
    'source-integrity-review',
    'non-rendering-harness',
    'route-controller-readout-bridge-if-authorized',
    'future-reporting-layer-if-authorized'
  ]),

  receiptId: H_EARTH_GROUND_INSPECTION_RECEIPT.receiptId,
  harnessReceiptId: H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT.receiptId,

  handoffPayload:
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true
      ? Object.freeze({
          matrix: 'H-Earth',
          matrixRole: 'Ground-View Matrix',
          spatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',
          domainCellId: 'H_EARTH_GROUND_CELL_001',
          activeCell: 'H_EARTH_GROUND_CELL_001',
          sceneIdentity: 'earth-water-air-survival-shoreline-manor',
          action: 'Inspect Ground',
          descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
          runtimeIntentId: 'INSPECT_GROUND',
          readout: 'Ground Condition Read',
          readoutId: 'H_EARTH_GROUND_CONDITION_READ',
          receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
          harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',
          descriptorOnly: true
        })
      : null,

  allowedUse: Object.freeze({
    sourceReceiptBindingReview:
      H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
    nonRenderingHarnessReference:
      H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
    descriptorOnlyRouteReadoutReferenceIfAuthorized:
      H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
    runtimeReceiptPersistence: false,
    validationEvidence: false,
    productionEvidence: false,
    deploymentEvidence: false,
    visualPassEvidence: false
  }),

  boundary: H_EARTH_RECEIPTS_BOUNDARIES
});

export const H_EARTH_RECEIPTS_INTEGRITY_HANDOFF = Object.freeze({
  handoffId: 'H_EARTH_RECEIPTS_INTEGRITY_HANDOFF',
  status: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible
    ? 'SOURCE_CHAIN_INTEGRITY_HANDOFF_READY_DESCRIPTOR_ONLY'
    : 'SOURCE_CHAIN_INTEGRITY_HANDOFF_REJECTED_DESCRIPTOR_ONLY',

  lawful: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.lawful === true,
  handoffEligible:
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
  issues: H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.issues,

  receiptChainModel: H_EARTH_RECEIPT_CHAIN_MODEL,
  receiptSourceChainStatus: H_EARTH_RECEIPT_SOURCE_CHAIN_STATUS,

  integrityReviewMayProceed:
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
  nonRenderingHarnessMayReference:
    H_EARTH_DEFAULT_GROUND_INSPECTION_RECEIPT_BINDING.handoffEligible === true,
  runtimeExecutionMayProceed: false,
  rendererExecutionMayProceed: false,
  routeActivationMayProceed: false,
  validationMayProceed: false,
  productionMayProceed: false,

  requiredFutureRuntimeBridge: Object.freeze({
    descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentId: 'INSPECT_GROUND',
    relationship: 'SAME_ACTION_DIFFERENT_LAYER',
    runtimeKernelIntegrationClaimHere: false
  }),

  boundary: H_EARTH_RECEIPTS_BOUNDARIES
});

export const H_EARTH_RECEIPTS_ARCHIVE_STATUS = Object.freeze({
  expectedArchiveTitle: 'h-earth-receipts-step-011f-backup',
  sourceFile: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',
  sourceContract:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  backupEvidenceOwnedExternally: true,
  fetchReadbackEvidenceOwnedExternally: true,
  repositoryIdentityEvidenceOwnedExternally: true,

  finalMarker: 'export default H_EARTH_RECEIPTS_AGGREGATE;',
  boundary: H_EARTH_RECEIPTS_BOUNDARIES
});

export const H_EARTH_RECEIPTS_AGGREGATE = Object.freeze({
  id: 'H_EARTH_RECEIPTS_AGGREGATE',
  file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',
  step:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  contract: H_EARTH_RECEIPTS_CONTRACT,
  boundary: H_EARTH_RECEIPTS_BOUNDARIES,

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  spatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  sourceSceneIdentity: H_EARTH_SOURCE_SCENE_IDENTITY,
  activeGroundView: H_EARTH_ACTIVE_GROUND_VIEW,
  matrixSeparation: H_EARTH_MATRIX_SEPARATION,

  path3: Object.freeze({
    dependency: H_EARTH_MATRIX_PATH3_DEPENDENCY,
    dependencyDirectionLaw: H_EARTH_MATRIX_PATH3_DEPENDENCY_DIRECTION_LAW,
    domainBinding: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING,
    bindingAdmission: H_EARTH_MATRIX_PATH3_BINDING_ADMISSION,
    rejectedBindingClassification:
      H_EARTH_MATRIX_REJECTED_BINDING_CLASSIFICATION,
    stateClassificationReference:
      H_EARTH_MATRIX_STATE_CLASSIFICATION_REFERENCE,
    actionIdentifierBridge: H_EARTH_MATRIX_ACTION_IDENTIFIER_BRIDGE,
    downstreamRenewal: H_EARTH_MATRIX_DOWNSTREAM_RENEWAL,
    getterDomainBinding: getHEarthMatrixPath3DomainBinding(),
    getterBindingAdmission: getHEarthMatrixPath3BindingAdmission()
  }),

  retiredCompatibility: Object.freeze({
    sourceLattice: Object.freeze({
      authority: H_EARTH_SOURCE_LATTICE_AUTHORITY,
      addressFieldSchema: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
      groundCellScope: H_EARTH_GROUND_CELL_001_LATTICE_SCOPE,
      matrixReceipt: getHEarthMatrixReceipt(),
      sourceLatticeAuthority: getHEarthSourceLatticeAuthority(),
      groundCellLatticeScope: getHEarthGroundCell001LatticeScope(),
      resolvedAddressFieldSchema: getHEarthSourceLatticeAddressFieldSchema()
    })
  }),

  groundCell: Object.freeze({
    descriptor: H_EARTH_GROUND_CELL_001,
    contract: H_EARTH_GROUND_CELL_001_CONTRACT,
    sceneBinding: H_EARTH_GROUND_CELL_001_SCENE_BINDING,
    path3Binding: H_EARTH_GROUND_CELL_001_PATH3_BINDING,
    latticeBinding: H_EARTH_GROUND_CELL_001_LATTICE_BINDING,
    addressFieldSummary: H_EARTH_GROUND_CELL_001_ADDRESS_FIELD_SUMMARY,
    spawnAnchorScope: H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
    receipt: H_EARTH_GROUND_CELL_001_RECEIPT,
    room3UnblockReceipt: H_EARTH_ROOM_3_UNBLOCK_RECEIPT,
    downstreamInterface: H_EARTH_GROUND_CELL_001_DOWNSTREAM_INTERFACE,
    getterReceipt: getHEarthGroundCell001Receipt(),
    getterPath3Binding: getHEarthGroundCell001Path3Binding(),
    getterLatticeBinding: getHEarthGroundCell001LatticeBinding(),
    getterAddressFieldSummary: getHEarthGroundCell001AddressFieldSummary(),
    getterRoom3UnblockReceipt: getHEarthRoom3UnblockReceipt()
  }),

  zones: Object.freeze({
    baselineBoundaries: H_EARTH_ZONE_BOUNDARIES,
    zones: H_EARTH_GROUND_CELL_001_ZONES,
    contract: H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,
    boundaryFlags: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS,
    zoneIds: H_EARTH_GROUND_CELL_001_ZONE_IDS,
    mappingModel: H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL,
    regionRules: H_EARTH_GROUND_CELL_001_ZONE_REGION_RULES,
    addressRegions: H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
    boundaryRoles: H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,
    adjacency: H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
    descriptors: H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
    overlapModel: H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL,
    zoneToObjectExpectation: H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,
    downstreamInterface: H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,
    allowedZoneActions: H_EARTH_GROUND_CELL_001_ALLOWED_ZONE_ACTIONS,
    blockedZoneActions: H_EARTH_GROUND_CELL_001_BLOCKED_ZONE_ACTIONS,
    receipt: H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,
    objectMappingUnblockReceipt: H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,
    getterZonesReceipt: getHEarthGroundCell001ZonesReceipt(),
    getterObjectMappingUnblockReceipt:
      getHEarthRoom3ObjectMappingUnblockReceipt()
  }),

  objects: Object.freeze({
    contract: H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT,
    boundaryFlags: H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS,
    objectIds: H_EARTH_GROUND_CELL_001_OBJECT_IDS,
    primaryInspectionTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    contextObjects: H_EARTH_CONTEXT_OBJECTS,
    compositionModel: H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL,
    zoneBindings: H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS,
    addressBindings: H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS,
    inspectionRoles: H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES,
    contextBoundaries: H_EARTH_GROUND_CELL_001_OBJECT_CONTEXT_BOUNDARIES,
    objects: H_EARTH_GROUND_CELL_001_OBJECTS,
    descriptors: H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS,
    objectsByZone: H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE,
    actionReference: H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE,
    readoutReference: H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,
    downstreamInterface: H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE,
    receipt: H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT,
    actionBindingUnblockReceipt: H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT,
    getterObjectsReceipt: getHEarthGroundCell001ObjectsReceipt(),
    getterActionBindingUnblockReceipt:
      getHEarthRoom4ActionBindingUnblockReceipt()
  }),

  action: Object.freeze({
    contract: H_EARTH_INSPECT_GROUND_ACTION_CONTRACT,
    boundaries: H_EARTH_INSPECT_GROUND_BOUNDARIES,
    targets: H_EARTH_INSPECT_GROUND_TARGETS,
    statePath: H_EARTH_INSPECT_GROUND_STATE_PATH,
    inputModel: H_EARTH_INSPECT_GROUND_INPUT_MODEL,
    targetModel: H_EARTH_INSPECT_GROUND_TARGET_MODEL,
    objectAnchorBinding: H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING,
    objectBindings: H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS,
    outputModel: H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
    dryRunModel: H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL,
    contextGuard: H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,
    action: H_EARTH_INSPECT_GROUND_ACTION,
    receipt: H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,
    readoutBindingUnblockReceipt: H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT,
    getterActionReceipt: getHEarthInspectGroundActionReceipt(),
    getterReadoutBindingUnblockReceipt:
      getHEarthRoom5ReadoutBindingUnblockReceipt(),
    getterObjectAnchorBinding: getHEarthInspectGroundObjectAnchorBinding(),
    getterObjectBindings: getHEarthInspectGroundObjectBindings(),
    getterOutputModel: getHEarthInspectGroundOutputModel()
  }),

  readout: Object.freeze({
    contract: H_EARTH_GROUND_CONDITION_READ_CONTRACT,
    boundaries: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES,
    targets: H_EARTH_GROUND_CONDITION_READ_TARGETS,
    inputModel: H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL,
    objectBindings: H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS,
    observationModel: H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL,
    payloadTemplate: H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE,
    contextGuard: H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD,
    outputModel: H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL,
    readout: H_EARTH_GROUND_CONDITION_READ,
    receipt: H_EARTH_GROUND_CONDITION_READ_RECEIPT,
    room6ReceiptBindingUnblockReceipt:
      H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT,
    getterReceipt: getHEarthGroundConditionReadReceipt(),
    getterRoom6ReceiptBindingUnblockReceipt:
      getHEarthRoom6ReceiptBindingUnblockReceipt(),
    getterObjectBindings: getHEarthGroundConditionReadObjectBindings(),
    getterOutputModel: getHEarthGroundConditionReadOutputModel()
  }),

  receipts: Object.freeze({
    inputModel: H_EARTH_RECEIPTS_INPUT_MODEL,
    groundInspectionReceipt: H_EARTH_GROUND_INSPECTION_RECEIPT,
    nonRenderingTestHarnessReceipt: H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT,
    receiptChainModel: H_EARTH_RECEIPT_CHAIN_MODEL,
    groundInspectionReceiptBinding: H_EARTH_GROUND_INSPECTION_RECEIPT_BINDING,
    groundInspectionReceiptHandoff: H_EARTH_GROUND_INSPECTION_RECEIPT_HANDOFF,
    integrityHandoff: H_EARTH_RECEIPTS_INTEGRITY_HANDOFF
  }),

  sourceChainStatus: H_EARTH_RECEIPT_SOURCE_CHAIN_STATUS,
  archiveStatus: H_EARTH_RECEIPTS_ARCHIVE_STATUS,

  normalizeHEarthReceiptsString,
  normalizeHEarthReceiptsTargets,
  buildHEarthReceiptsInput,
  checkHEarthReceiptsInput,
  buildHEarthGroundInspectionReceiptBinding,
  buildHEarthGroundInspectionReceipt,
  hEarthGroundInspectionReceipt,
  getHEarthGroundInspectionReceipt,
  getHEarthNonRenderingTestHarnessReceipt,
  getHEarthReceiptChainModel,
  getHEarthGroundInspectionReceiptBinding,
  getHEarthGroundInspectionReceiptHandoff,
  getHEarthReceiptSourceChainStatus,
  getHEarthReceiptsIntegrityHandoff,
  getHEarthReceiptsArchiveStatus,
  getHEarthReceiptsAggregate,

  finalMarker: 'export default H_EARTH_RECEIPTS_AGGREGATE;'
});

export function getHEarthGroundInspectionReceipt() {
  return H_EARTH_GROUND_INSPECTION_RECEIPT;
}

export function getHEarthNonRenderingTestHarnessReceipt() {
  return H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT;
}

export function getHEarthReceiptChainModel() {
  return H_EARTH_RECEIPT_CHAIN_MODEL;
}

export function getHEarthGroundInspectionReceiptBinding() {
  return H_EARTH_GROUND_INSPECTION_RECEIPT_BINDING;
}

export function getHEarthGroundInspectionReceiptHandoff() {
  return H_EARTH_GROUND_INSPECTION_RECEIPT_HANDOFF;
}

export function getHEarthReceiptSourceChainStatus() {
  return H_EARTH_RECEIPT_SOURCE_CHAIN_STATUS;
}

export function getHEarthReceiptsIntegrityHandoff() {
  return H_EARTH_RECEIPTS_INTEGRITY_HANDOFF;
}

export function getHEarthReceiptsArchiveStatus() {
  return H_EARTH_RECEIPTS_ARCHIVE_STATUS;
}

export function getHEarthReceiptsAggregate() {
  return H_EARTH_RECEIPTS_AGGREGATE;
}

export default H_EARTH_RECEIPTS_AGGREGATE;
