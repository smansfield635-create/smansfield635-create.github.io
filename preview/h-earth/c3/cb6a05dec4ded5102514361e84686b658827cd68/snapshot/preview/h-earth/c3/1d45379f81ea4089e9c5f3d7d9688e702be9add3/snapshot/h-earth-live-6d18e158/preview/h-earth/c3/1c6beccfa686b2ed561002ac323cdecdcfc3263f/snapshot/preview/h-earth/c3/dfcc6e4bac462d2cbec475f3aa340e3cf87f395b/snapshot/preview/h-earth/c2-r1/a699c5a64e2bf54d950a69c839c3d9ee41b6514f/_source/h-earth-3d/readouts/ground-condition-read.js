/**
 * /h-earth-3d/readouts/ground-condition-read.js
 * COMPLETE RENEWED FILE
 * H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1
 *
 * Renews:
 * H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1
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
 * Exact historical lineage retained:
 * /h-earth-3d/zones/ground-cell-001.zones.js
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1
 *
 * /h-earth-3d/objects/ground-cell-001.objects.js
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1
 *
 * /h-earth-3d/actions/inspect-ground.js
 * H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v1
 *
 * Retired noncontrolling compatibility lineage retained:
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1
 * H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1
 * H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1
 *
 * Purpose:
 * Renew the existing Drive scratch Ground Condition Read from the retired
 * lattice-zone-object-action readout model into a Path 3-bound object/action
 * readout descriptor for H_EARTH_GROUND_CELL_001.
 *
 * Canonical upstream relation:
 * H_EARTH_REGION_CELL_X07_Z08
 *   -> H_EARTH_GROUND_CELL_001
 *
 * Room 5 authority:
 * Room 5 does not create Path 3 authority.
 * Room 5 does not create matrix authority.
 * Room 5 does not create cell authority.
 * Room 5 does not create zone authority.
 * Room 5 does not create object authority.
 * Room 5 does not create action authority.
 * Room 5 does not execute Inspect Ground.
 * Room 5 binds Ground Condition Read to the Step 011D v2 Inspect Ground action
 * output surface and prepares the lawful Room 6 receipt handoff.
 *
 * Compatibility:
 * The old lattice/address readout model remains available only as retired
 * compatibility metadata through upstream compatibility surfaces. It does not
 * create spatial authority, traversal authority, renderer authority, runtime
 * execution, validation evidence, production readiness, or visual-pass proof.
 *
 * Fail-closed action descriptor rule:
 * This file does not accept externally supplied actionDescriptor objects.
 * Ground Condition Read always rebuilds the Step 011D v2 Inspect Ground action
 * result through inspectGround(), then consumes the descriptor from that same
 * result occurrence.
 *
 * Boundary:
 * This file defines readout structure only.
 * This file does not execute gameplay.
 * This file does not persist receipts.
 * This file does not define renderer geometry.
 * This file does not create material channels.
 * This file does not create DOM/CSS/WebGL/canvas output.
 * This file does not activate lattice, traversal, gameplay, runtime, route,
 * renderer, compositor, controller, canvas, WebGL, validation, production,
 * diagnostic scoring, health scoring, survival scoring, or matrix collapse.
 */

import {
  H_EARTH_MATRIX_SEPARATION,
  H_EARTH_MATRIX_PATH3_DOMAIN_BINDING,
  H_EARTH_MATRIX_PATH3_BINDING_ADMISSION,
  H_EARTH_SOURCE_LATTICE_AUTHORITY,
  H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
  H_EARTH_GROUND_CELL_001_LATTICE_SCOPE,
  getHEarthMatrixReceipt,
  getHEarthSourceLatticeAuthority,
  getHEarthGroundCell001LatticeScope,
  getHEarthSourceLatticeAddressFieldSchema,
  getHEarthMatrixPath3DomainBinding,
  getHEarthMatrixPath3BindingAdmission
} from '../h-earth.matrix.js';

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
} from '../cells/ground-cell-001.js';

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
  getHEarthGroundCell001ZoneDescriptor,
  getHEarthGroundCell001ZoneAddressRegion,
  getHEarthGroundCell001ZoneAdjacency,
  getHEarthGroundCell001ZonesReceipt,
  getHEarthRoom3ObjectMappingUnblockReceipt,
  isHEarthGroundCell001ZoneId,
  getHEarthGroundCell001ExpectedObjectsForZone
} from '../zones/ground-cell-001.zones.js';

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
  getHEarthGroundCell001ObjectDescriptor,
  getHEarthGroundCell001ObjectZoneBinding,
  getHEarthGroundCell001ObjectAddressBinding,
  getHEarthGroundCell001ObjectsForZone,
  getHEarthGroundCell001ObjectsReceipt,
  getHEarthRoom4ActionBindingUnblockReceipt,
  isHEarthGroundCell001ObjectId,
  isHEarthGroundCell001InspectionObject,
  isHEarthGroundCell001ContextOnlyObject
} from '../objects/ground-cell-001.objects.js';

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
  normalizeHEarthInspectGroundString,
  normalizeHEarthInspectGroundTargets,
  buildHEarthInspectGroundActionDescriptor,
  inspectGround,
  getHEarthInspectGroundTargets,
  getHEarthInspectGroundAction,
  getHEarthInspectGroundActionReceipt,
  getHEarthRoom5ReadoutBindingUnblockReceipt,
  getHEarthInspectGroundObjectAnchorBinding,
  getHEarthInspectGroundObjectBindings,
  getHEarthInspectGroundOutputModel
} from '../actions/inspect-ground.js';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);
const EMPTY_FROZEN_OBJECT = Object.freeze({});

const H_EARTH_GROUND_CONDITION_READ_ALLOWED_INPUT_KEYS = Object.freeze([
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

const H_EARTH_GROUND_CONDITION_READ_ALLOWED_INPUT_KEY_SET = new Set(
  H_EARTH_GROUND_CONDITION_READ_ALLOWED_INPUT_KEYS
);

const H_EARTH_GROUND_CONDITION_READ_REJECTED_INPUT_KEYS = Object.freeze([
  'actionDescriptor'
]);

const H_EARTH_GROUND_CONDITION_READ_REJECTED_INPUT_KEY_SET = new Set(
  H_EARTH_GROUND_CONDITION_READ_REJECTED_INPUT_KEYS
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
      issue:
        'GROUND_CONDITION_READ_INPUT_CONTAINER_INVALID:ARRAY_NOT_ALLOWED',
      record: EMPTY_FROZEN_OBJECT
    });
  }

  if (input === null) {
    return Object.freeze({
      status: 'MALFORMED_NULL_INPUT',
      issue: 'GROUND_CONDITION_READ_INPUT_CONTAINER_INVALID:NULL_NOT_ALLOWED',
      record: EMPTY_FROZEN_OBJECT
    });
  }

  return Object.freeze({
    status: 'MALFORMED_NON_RECORD_INPUT',
    issue:
      'GROUND_CONDITION_READ_INPUT_CONTAINER_INVALID:PLAIN_RECORD_REQUIRED',
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
      issue: `GROUND_CONDITION_READ_INPUT_FIELD_INVALID_TYPE:${key}`
    });
  }

  const value = record[key].trim();

  if (value.length === 0) {
    return Object.freeze({
      supplied: true,
      valid: false,
      value: null,
      issue: `GROUND_CONDITION_READ_INPUT_FIELD_EMPTY:${key}`
    });
  }

  return Object.freeze({
    supplied: true,
    valid: true,
    value,
    issue: null
  });
}

function normalizeHEarthGroundConditionReadTargetEntries(targets = []) {
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
          issue: `GROUND_CONDITION_READ_INPUT_SUPPORTING_TARGET_INVALID_TYPE:${index}`
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
          issue: `GROUND_CONDITION_READ_INPUT_SUPPORTING_TARGET_EMPTY:${index}`
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
    entries: Object.freeze([...entries]),
    invalidEntries: Object.freeze([...invalidEntries]),
    duplicateSupportingTargets: Object.freeze(
      duplicateSupportingTargets.filter(
        (target, index, array) => array.indexOf(target) === index
      )
    )
  });
}

export const H_EARTH_GROUND_CONDITION_READ_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1',

  renewsContractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

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

  exactHistoricalZoneLineageContractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

  exactHistoricalObjectLineageContractId:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

  exactHistoricalActionLineageContractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v1',

  retiredUpstreamMatrixContractId:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  retiredUpstreamCellContractId:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  retiredUpstreamZoneContractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  retiredUpstreamObjectContractId:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  retiredUpstreamActionContractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  file: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/readouts/ground-condition-read.js',
  upstreamMatrixFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.matrix.js',
  upstreamCellFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/cells/ground-cell-001.js',
  upstreamZoneFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/zones/ground-cell-001.zones.js',
  upstreamObjectFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/objects/ground-cell-001.objects.js',
  upstreamActionFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/actions/inspect-ground.js',
  sourceRoot: '/h-earth-3d/',

  room: 'ROOM_5_READOUT_PREPARATION',
  upstreamRoom: 'ROOM_4_ACTIONS',
  downstreamRoom: 'ROOM_6_RECEIPTS_AND_INTEGRITY_AFTER_READOUT',

  fileClass:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
      ? 'PATH3_OBJECT_READOUT_BINDING_DESCRIPTOR_ONLY'
      : 'PATH3_OBJECT_READOUT_BINDING_REJECTED_DESCRIPTOR_ONLY',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  expectedSpatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',
  expectedDomainCellId: 'H_EARTH_GROUND_CELL_001',

  path3BindingAdmission: H_EARTH_MATRIX_PATH3_BINDING_ADMISSION,
  path3DomainBinding: H_EARTH_MATRIX_PATH3_DOMAIN_BINDING,
  cellPath3Binding: H_EARTH_GROUND_CELL_001_PATH3_BINDING,

  zoneCompositionContract:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

  objectCompositionContract:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2',

  actionBindingContract:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v2',

  exactHistoricalZoneLineageContract:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

  exactHistoricalObjectLineageContract:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

  exactHistoricalActionLineageContract:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v1',

  retiredCompatibilityZoneLineageContract:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  retiredCompatibilityObjectLineageContract:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  retiredCompatibilityActionLineageContract:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',

  sourceAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  failClosedActionDescriptorPolicy: Object.freeze({
    externalActionDescriptorAcceptance: false,
    readoutAlwaysRebuildsStep011DDescriptor: false,
    readoutAlwaysConsumesSingleStep011DResult: true,
    arbitraryActionDescriptorInjectionAllowed: false,
    validatorImplementedHere: false,
    reason:
      'Ground Condition Read must derive the Step 011D v2 action result through inspectGround(), then consume the descriptor from that same lawful or rejected result occurrence.'
  }),

  sourceEvidenceSeparation: Object.freeze({
    baselineDiffEvidenceOwnedExternally: true,
    backupEvidenceOwnedExternally: true,
    repositoryInstallationEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    runtimeExecutionEvidenceOwnedExternally: true,
    visualValidationEvidenceOwnedExternally: true,
    fetchReadbackEvidenceOwnedExternally: true
  }),

  renewalPurpose:
    'Bind Ground Condition Read to the Step 011D v2 Inspect Ground action output, Step 034J v2 object composition, Step 034K zone composition, Step 011A cell binding, and Step 009D Path 3 matrix boundary without creating runtime execution, renderer facts, diagnostic scoring, validation, production, or receipt persistence.',

  renewalScope: Object.freeze({
    upstreamMatrixPath3BindingConsumed: true,
    upstreamCellPath3BindingConsumed: true,
    upstreamZoneCompositionConsumed: true,
    upstreamObjectCompositionConsumed: true,
    upstreamInspectGroundActionConsumed: true,
    actionOutputSurfaceConsumed: true,

    externalActionDescriptorAcceptanceDisallowed: true,
    readoutConsumesSingleStep011DResult: true,
    descriptorTakenFromThatSameResult: true,

    retiredLatticeReadoutModelPreservedAsCompatibility: true,
    retiredObjectAddressBindingConsumedAsCompatibility: true,
    retiredActionAddressBindingConsumedAsCompatibility: true,

    primaryReadoutObjectBound: true,
    supportingReadoutObjectsBound: true,
    surfaceTransitionContextBound: true,
    waterAirContextBoundariesPreserved: true,
    hearthContextBoundaryPreserved: true,
    audraliaContextBoundaryPreserved: true,
    readoutPayloadTemplateDefined: true,
    descriptorBuilderDefined: true,
    receiptHandoffPrepared: true,

    room6ReceiptBindingUnblocked:
      H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,

    sourceLatticeAuthorityCreatedHere: false,
    activeCellBindingCreatedHere: false,
    path3AuthorityCreatedHere: false,
    zoneAuthorityCreatedHere: false,
    objectAuthorityCreatedHere: false,
    actionAuthorityCreatedHere: false,
    receiptAuthorityCreatedHere: false,
    full256AddressEnumerationAdded: false,
    materialChannelMappingAdded: false,
    rendererGeometryAdded: false,
    assetLoadingAdded: false,
    gameplayExecutionAdded: false,
    runtimeActionExecutionAdded: false,
    runtimeReadoutExecutionAdded: false,
    routeExposureAdded: false,
    receiptRuntimePersistenceAdded: false,
    validationAdded: false,
    productionAdded: false,
    runtimeActivated: false
  })
});

export const H_EARTH_GROUND_CONDITION_READ_BOUNDARIES = Object.freeze({
  readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',
  descriptorOnlyReadoutAuthority: true,
  objectBoundReadoutAuthority: true,
  actionOutputAwareReadoutAuthority: true,

  externalActionDescriptorAcceptance: false,
  readoutConsumesSingleStep011DResult: true,
  descriptorTakenFromThatSameResult: true,

  path3CellBindingConsumed:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  path3ZoneCompositionConsumed:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  path3ObjectCompositionConsumed:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  path3ActionBindingConsumed:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  path3SpatialAuthorityOnly: true,

  cellLatticeConsumed: false,
  zoneMappingConsumed: false,
  objectCompressionConsumed: false,
  inspectGroundLegacyActionConsumed: false,
  sceneScopedAddressabilityConsumed: false,
  legacyReadoutAddressModelCompatibilityOnly: true,
  legacyReadoutAddressModelCreatesSpatialAuthority: false,

  rawDriveScratchFileOnly: false,
  renewedSourceReadoutDescriptor: true,

  sourceMatrixAuthorityCreatedHere: false,
  cellLatticeBindingCreatedHere: false,
  cellPath3BindingCreatedHere: false,
  zoneMappingCreatedHere: false,
  zoneAuthorityCreatedHere: false,
  objectMappingCreatedHere: false,
  objectAuthorityCreatedHere: false,
  actionBindingCreatedHere: false,
  actionAuthorityCreatedHere: false,
  receiptAuthorityCreatedHere: false,
  materialChannelMappingCreatedHere: false,
  rendererGeometryCreatedHere: false,
  renderedAssetCreatedHere: false,
  assetLoadingCreatedHere: false,
  routeExposureCreatedHere: false,

  runtimeReadoutExecutionClaim: false,
  runtimeActionExecutionClaim: false,
  gameplayExecutionClaim: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,
  diagnosticScoreClaim: false,
  empiricalDiagnosisClaim: false,
  rendererStatusClaim: false,
  rendererActivationClaim: false,
  compositorActivationClaim: false,
  controllerActivationClaim: false,
  visualPassStatusClaim: false,
  validationStatusClaim: false,
  openWorldScanClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  persistentSaveLogic: false,
  receiptRuntimePersistence: false,
  routeIntegration: false,
  githubInstallation: false,

  full256AddressRuntimeClaim: false,
  full256AddressEnumerationIncludedHere: false,
  routeRuntimeCreation: false,
  routeExposureCompleted: false,

  rendererActivation: false,
  webglActivation: false,
  canvasActivation: false,
  svgActivation: false,
  iframeActivation: false,

  latticeActivation: false,
  runtime16x16LatticeActivationClaim: false,
  active16x16RuntimeClaim: false,
  movementExpansion: false,
  traversalExpansion: false,
  deepInspectionExpansion: false,

  survivalSimulation: false,
  swimming: false,
  fluidSimulation: false,
  weatherSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,

  matrixCollapse: false
});

export const H_EARTH_GROUND_CONDITION_READ_TARGETS = Object.freeze({
  targetModelId: 'H_EARTH_GROUND_CONDITION_READ_TARGETS',
  status: 'PATH3_OBJECT_BOUND_READOUT_TARGETS_DEFINED_DESCRIPTOR_ONLY',

  primaryReadoutObject: H_EARTH_PRIMARY_INSPECTION_TARGET,

  supportingInspectionObjects: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  surfaceContextObjects: Object.freeze(['OBJ_003_DRY_SAND_TRANSITION']),

  waterAirContextObjects: Object.freeze([
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER'
  ]),

  hearthContextObjects: Object.freeze(['OBJ_009_MANOR_EXTERIOR_CONTEXT']),

  audraliaContextObjects: Object.freeze([
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]),

  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  allReadoutRelevantObjects:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE
      .supportingReadoutObjects,

  readoutContextObjects:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE.contextReadoutObjects,

  sourceAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  targetPolicy: Object.freeze({
    primaryObjectMayAnchorReadout: true,
    supportingObjectsMayContributeReadoutContext: true,
    drySandMaySupportSurfaceTransitionContext: true,
    waterAirObjectsMaySupportEnvironmentalContextOnly: true,
    hearthObjectMaySupportSeparationContextOnly: true,
    audraliaObjectMaySupportSeparationContextOnly: true,

    waterAirObjectsMayBecomeDirectActionTargets: false,
    hearthObjectMayBecomeDirectActionTarget: false,
    audraliaObjectMayBecomeDirectActionTarget: false,
    contextObjectsMayCreateTraversal: false,
    contextObjectsMayCreateSimulation: false,
    readoutMayCreateRuntimeReceipt: false
  }),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL = Object.freeze({
  inputModelId: 'H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL',
  status:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
      ? 'PATH3_ACTION_OUTPUT_AWARE_READOUT_INPUT_DESCRIPTOR_ONLY'
      : 'PATH3_ACTION_OUTPUT_AWARE_READOUT_BLOCKED_BY_BINDING_REJECTION',

  expectedReadout: 'Ground Condition Read',
  expectedReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
  expectedAction: 'Inspect Ground',
  expectedDescriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  expectedRuntimeIntentId: 'INSPECT_GROUND',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
  currentState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,

  primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  acceptedInputKeys: H_EARTH_GROUND_CONDITION_READ_ALLOWED_INPUT_KEYS,

  rejectedInputKeys: H_EARTH_GROUND_CONDITION_READ_REJECTED_INPUT_KEYS,

  externalActionDescriptorAcceptance: false,
  readoutConsumesSingleStep011DResult: true,
  descriptorTakenFromThatSameResult: true,

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

  inputCreatesRuntimeExecution: false,
  inputCreatesGameplayExecution: false,
  inputCreatesRouteMutation: false,
  inputCreatesRendererState: false,
  inputCreatesReceiptPersistence: false,

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL = Object.freeze({
  observationModelId: 'H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL',
  status: 'BOUNDED_ENVIRONMENTAL_OBSERVATION_CATEGORIES_DEFINED_DESCRIPTOR_ONLY',

  observationCategories: Object.freeze({
    surface: Object.freeze([
      'wet-sand-surface',
      'dry-sand-transition',
      'local-footing-context'
    ]),

    moisture: Object.freeze([
      'tide-pool-presence',
      'reflective-puddle-context',
      'shoreline-contact',
      'foam-line-context'
    ]),

    localDetail: Object.freeze([
      'small-beach-stone-context',
      'foreground-jagged-rock-context',
      'local-ground-hazard-reference'
    ]),

    waterAirContext: Object.freeze([
      'nearshore-wave-context',
      'water-surface-context-only',
      'air-haze-light-context-only'
    ]),

    matrixSeparationContext: Object.freeze([
      'hearth-support-control-context-only',
      'audralia-planetary-world-context-only',
      'matrix-collapse-remains-false'
    ])
  }),

  observationClaims: Object.freeze({
    environmentalDescriptorOnly: true,
    playerFacingReadoutTemplate: true,
    empiricalDiagnosisClaim: false,
    diagnosticScoreClaim: false,
    healthScoreClaim: false,
    survivalScoreClaim: false,
    rendererStatusClaim: false,
    weatherSimulationClaim: false,
    fluidSimulationClaim: false,
    traversalClaim: false,
    validationClaim: false,
    productionClaim: false
  }),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD = Object.freeze({
  guardId: 'H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD',
  status: 'MATRIX_AND_CONTEXT_BOUNDARIES_PRESERVED_FOR_READOUT',

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,

  hEarthRole: 'Ground-View Matrix',
  hearthRole: 'support/control context only',
  audraliaRole: 'planetary-world context only',

  guardedContextObjects: Object.freeze({
    waterAirContext: H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects,
    hearthContext: H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects,
    audraliaContext: H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects
  }),

  prohibitions: Object.freeze({
    hearthMergedIntoHEarth: false,
    audraliaMergedIntoHEarth: false,
    mirrorManorRouteCanonNameClaim: false,
    manorInteriorAccessAuthorized: false,
    distantTraversalAuthorized: false,
    openWorldMovementAuthorized: false,
    waterTraversalAuthorized: false,
    swimmingAuthorized: false,
    fluidSimulationAuthorized: false,
    weatherSimulationAuthorized: false,
    survivalSimulationAuthorized: false,
    matrixCollapse: false
  }),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export function normalizeHEarthGroundConditionReadString(
  value,
  fallback = ''
) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function normalizeHEarthGroundConditionReadTargets(targets = []) {
  return normalizeHEarthGroundConditionReadTargetEntries(targets).entries;
}

export function getHEarthGroundConditionReadObjectDescriptor(objectId) {
  if (!objectId || typeof objectId !== 'string') return null;

  const objectDescriptor = getHEarthGroundCell001ObjectDescriptor(objectId);

  if (!objectDescriptor) return null;

  const zoneBinding = getHEarthGroundCell001ObjectZoneBinding(objectId);
  const addressBinding = getHEarthGroundCell001ObjectAddressBinding(objectId);
  const zoneDescriptor = zoneBinding?.zoneId
    ? getHEarthGroundCell001ZoneDescriptor(zoneBinding.zoneId)
    : null;

  return Object.freeze({
    objectId,
    objectDescriptor,
    zoneBinding,
    addressBinding,
    addressBindingAuthorityStatus: 'RETIRED_COMPATIBILITY_ONLY',
    zoneDescriptor,

    isPrimaryReadoutObject:
      objectId === H_EARTH_GROUND_CONDITION_READ_TARGETS.primaryReadoutObject,

    isSupportingInspectionObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.supportingInspectionObjects.includes(
        objectId
      ),

    isSurfaceContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.surfaceContextObjects.includes(
        objectId
      ),

    isWaterAirContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects.includes(
        objectId
      ),

    isHearthContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects.includes(
        objectId
      ),

    isAudraliaContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects.includes(
        objectId
      ),

    descriptorOnly: true,
    rendererGeometryClaim: false,
    runtimeReadoutClaim: false,
    validationClaim: false
  });
}

export function classifyHEarthGroundConditionReadObject(objectId) {
  if (objectId === H_EARTH_GROUND_CONDITION_READ_TARGETS.primaryReadoutObject) {
    return 'PRIMARY_READOUT_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.supportingInspectionObjects.includes(
      objectId
    )
  ) {
    return 'SUPPORTING_INSPECTION_READOUT_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.surfaceContextObjects.includes(
      objectId
    )
  ) {
    return 'SURFACE_TRANSITION_CONTEXT_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects.includes(
      objectId
    )
  ) {
    return 'WATER_AIR_CONTEXT_ONLY_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects.includes(
      objectId
    )
  ) {
    return 'HEARTH_CONTEXT_ONLY_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects.includes(
      objectId
    )
  ) {
    return 'AUDRALIA_CONTEXT_ONLY_OBJECT';
  }

  return 'UNCLASSIFIED_READOUT_OBJECT';
}

export function buildHEarthGroundConditionReadInput(input = undefined) {
  const containerResolution = resolveInputContainerStatus(input);
  const safeInput = containerResolution.record;
  const defaultInput = H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL.defaultInput;

  const providedKeys = Object.keys(safeInput);

  const unknownInputKeys = Object.freeze(
    providedKeys.filter(
      (key) =>
        !H_EARTH_GROUND_CONDITION_READ_ALLOWED_INPUT_KEY_SET.has(key) &&
        !H_EARTH_GROUND_CONDITION_READ_REJECTED_INPUT_KEY_SET.has(key)
    )
  );

  const rejectedInputKeysProvided = Object.freeze(
    providedKeys.filter((key) =>
      H_EARTH_GROUND_CONDITION_READ_REJECTED_INPUT_KEY_SET.has(key)
    )
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
    normalizeHEarthGroundConditionReadTargetEntries(rawSupportingTargetSource);

  const supportingTargetEntryIssues = supportingTargetSequence.invalidEntries.map(
    (entry) => entry.issue
  );

  const externalActionDescriptorProvided = rejectedInputKeysProvided.includes(
    'actionDescriptor'
  );

  const fieldIssues = Object.freeze(
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
        ? 'GROUND_CONDITION_READ_INPUT_FIELD_INVALID_TYPE:supportingInspectionTargets'
        : null,
      externalActionDescriptorProvided === true
        ? 'GROUND_CONDITION_READ_INPUT_REJECTED_KEY_PROVIDED:actionDescriptor'
        : null,
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
    providedInputKeys: Object.freeze(providedKeys),
    unknownInputKeys,
    rejectedInputKeysProvided,
    externalActionDescriptorProvided,
    externalActionDescriptorRejected: externalActionDescriptorProvided === true,

    descriptorOnly: true,
    runtimeExecutionClaim: false,
    receiptPersistenceClaim: false
  });
}

export function checkHEarthGroundConditionReadInput(input = undefined) {
  const normalizedInput = buildHEarthGroundConditionReadInput(input);

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

  const extraSupportingTargets = normalizedInput.supportingInspectionTargets.filter(
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
    room5ReadoutBindingAllowed:
      H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT
        .room5ReadoutFileMayProceed === true,

    externalActionDescriptorRejectedIfProvided:
      normalizedInput.externalActionDescriptorRejected === true ||
      normalizedInput.externalActionDescriptorProvided === false,

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
    runtimeIntentIdKnown: normalizedInput.runtimeIntentId === 'INSPECT_GROUND',
    readoutNameAccepted:
      normalizedInput.readoutName === 'Ground Condition Read',
    readoutIdAccepted:
      normalizedInput.readoutId === 'H_EARTH_GROUND_CONDITION_READ',
    primaryFocusTargetAccepted:
      normalizedInput.primaryFocusTarget === H_EARTH_PRIMARY_INSPECTION_TARGET,
    primaryTargetExists:
      isHEarthGroundCell001ObjectId(normalizedInput.primaryFocusTarget),
    primaryTargetInspectionEligible:
      isHEarthGroundCell001InspectionObject(normalizedInput.primaryFocusTarget),

    supportingTargetEntriesValid:
      normalizedInput.invalidSupportingTargetEntries.length === 0,
    supportingTargetsContainNoDuplicates:
      supportingTargetsContainDuplicates === false,
    supportingTargetSetExact: supportingTargetsSetExact,
    supportingTargetOrderCanonical,
    supportingTargetsExist:
      supportingTargetsSetExact &&
      H_EARTH_CANONICAL_SUPPORTING_INSPECTION_TARGETS.every((target) =>
        isHEarthGroundCell001ObjectId(target)
      ),

    requestedReceiptAccepted:
      normalizedInput.requestedReceipt === 'H_EARTH_GROUND_INSPECTION_RECEIPT'
  });

  const passed = Object.values(checks).every((value) => value === true);

  const failureCodes = [];

  if (normalizedInput.inputContainerIssue) {
    failureCodes.push(normalizedInput.inputContainerIssue);
  }

  if (normalizedInput.unknownInputKeys.length > 0) {
    failureCodes.push(
      ...normalizedInput.unknownInputKeys.map(
        (key) => `GROUND_CONDITION_READ_INPUT_UNKNOWN_KEY_REJECTED:${key}`
      )
    );
  }

  if (normalizedInput.rejectedInputKeysProvided.length > 0) {
    failureCodes.push(
      ...normalizedInput.rejectedInputKeysProvided.map(
        (key) => `GROUND_CONDITION_READ_INPUT_REJECTED_KEY_PROVIDED:${key}`
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
          `GROUND_CONDITION_READ_INPUT_DUPLICATE_SUPPORTING_TARGET:${target}`
      )
    );
  }

  if (checks.supportingTargetSetExact !== true) {
    failureCodes.push(
      'GROUND_CONDITION_READ_INPUT_CHECK_FAILED:supportingTargetSetExact'
    );
  }

  if (checks.supportingTargetOrderCanonical !== true) {
    failureCodes.push(
      'GROUND_CONDITION_READ_INPUT_CHECK_FAILED:supportingTargetOrderCanonical'
    );
  }

  for (const [key, value] of Object.entries(checks)) {
    if (
      value !== true &&
      key !== 'supportingTargetSetExact' &&
      key !== 'supportingTargetOrderCanonical' &&
      key !== 'supportingTargetsContainNoDuplicates' &&
      key !== 'inputContainerAccepted' &&
      key !== 'unknownInputKeysRejected' &&
      key !== 'rejectedInputKeysRejected' &&
      key !== 'fieldIssuesEmpty'
    ) {
      failureCodes.push(`GROUND_CONDITION_READ_INPUT_CHECK_FAILED:${key}`);
    }
  }

  return Object.freeze({
    input: normalizedInput,
    checks,
    passed,
    missingSupportingTargets: Object.freeze(missingSupportingTargets),
    extraSupportingTargets: Object.freeze(extraSupportingTargets),
    failureCodes: Object.freeze(failureCodes),
    descriptorOnly: true,
    runtimeExecutionClaim: false,
    validationClaim: false
  });
}

export function buildHEarthGroundConditionReadObjectBinding(objectId) {
  const descriptor = getHEarthGroundConditionReadObjectDescriptor(objectId);
  const classification = classifyHEarthGroundConditionReadObject(objectId);

  if (!descriptor) {
    return Object.freeze({
      objectId,
      bindingResolved: false,
      classification,
      descriptorOnly: true,
      validationClaim: false,
      matrixCollapse: false
    });
  }

  return Object.freeze({
    objectId,
    bindingResolved: true,
    classification,

    label: descriptor.objectDescriptor.label,
    role: descriptor.objectDescriptor.role,
    objectClass: descriptor.objectDescriptor.objectClass || null,
    layer: descriptor.objectDescriptor.layer,

    zoneId: descriptor.zoneBinding?.zoneId || null,
    secondaryZoneId: descriptor.zoneBinding?.secondaryZoneId || null,
    zoneRole: descriptor.zoneBinding?.zoneRole || null,
    primaryAddress: descriptor.addressBinding?.primaryAddress || null,
    supportingAddresses:
      descriptor.addressBinding?.supportingAddresses || Object.freeze([]),
    addressRole: descriptor.addressBinding?.addressRole || null,
    addressBindingAuthorityStatus: 'RETIRED_COMPATIBILITY_ONLY',

    readoutContribution: Object.freeze({
      primaryReadoutAnchor: classification === 'PRIMARY_READOUT_OBJECT',
      supportingInspectionContext:
        classification === 'SUPPORTING_INSPECTION_READOUT_OBJECT',
      surfaceTransitionContext:
        classification === 'SURFACE_TRANSITION_CONTEXT_OBJECT',
      waterAirContextOnly: classification === 'WATER_AIR_CONTEXT_ONLY_OBJECT',
      hearthContextOnly: classification === 'HEARTH_CONTEXT_ONLY_OBJECT',
      audraliaContextOnly: classification === 'AUDRALIA_CONTEXT_ONLY_OBJECT'
    }),

    restrictions: Object.freeze({
      directRuntimeInspectionClaim: false,
      directActionExecutionClaim: false,
      rendererGeometryClaim: false,
      materialChannelClaim: false,
      traversalClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      weatherSimulationClaim: false,
      manorInteriorAccessClaim: false,
      distantTraversalClaim: false,
      validationClaim: false,
      matrixCollapse: false
    }),

    descriptorOnly: true,
    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

export const H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS = Object.freeze({
  bindingId: 'H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS',
  status: 'PATH3_GROUND_CONDITION_READ_OBJECT_BINDINGS_DEFINED_DESCRIPTOR_ONLY',

  objectToReadoutReference:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,

  primaryBinding:
    buildHEarthGroundConditionReadObjectBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),

  supportingInspectionBindings: Object.freeze(
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  surfaceContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.surfaceContextObjects.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  waterAirContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects.map(
      (objectId) => buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  hearthContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  audraliaContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects.map(
      (objectId) => buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  readoutPayloadDefinedHere: false,
  readoutPayloadTemplateDefinedHere: true,
  actionExecutionDefinedHere: false,
  receiptPersistenceDefinedHere: false,
  rendererGeometryDefinedHere: false,

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE = Object.freeze({
  payloadTemplateId: 'H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE',
  status: 'DESCRIPTOR_ONLY_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE_DEFINED',

  readoutType: 'Ground Condition Read',
  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',
  sourceAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',

  requiredFields: Object.freeze([
    'readoutType',
    'readoutId',
    'activeMatrix',
    'activeMatrixRole',
    'activeCell',
    'domainCellId',
    'spatialCellId',
    'sceneIdentity',
    'sourceAction',
    'descriptorActionId',
    'primaryFocusTarget',
    'surfaceCondition',
    'moistureCondition',
    'localDetailCondition',
    'waterAirContext',
    'matrixSeparationContext',
    'deferredClaims',
    'receiptHandoff'
  ]),

  defaultSurfaceCondition: Object.freeze({
    primarySurface: 'foreground wet sand',
    surfaceState: 'wet local ground surface descriptor',
    dryTransitionPresent: true,
    footingDescriptor: 'local ground inspection context only',
    traversalClaim: false,
    validationClaim: false
  }),

  defaultMoistureCondition: Object.freeze({
    tidePoolsPresent: true,
    reflectivePuddlesPresent: true,
    shorelineFoamLinePresent: true,
    waterContactContextPresent: true,
    fluidSimulationClaim: false,
    swimmingClaim: false,
    validationClaim: false
  }),

  defaultLocalDetailCondition: Object.freeze({
    smallBeachStonesPresent: true,
    foregroundJaggedRocksPresent: true,
    localHazardReferenceOnly: true,
    physicsClaim: false,
    collisionClaim: false,
    validationClaim: false
  }),

  defaultWaterAirContext: Object.freeze({
    nearshoreWaveBandContext: true,
    waterSurfaceContextOnly: true,
    airHazeLightContextOnly: true,
    waterTraversalAuthorized: false,
    swimmingAuthorized: false,
    fluidSimulationAuthorized: false,
    weatherSimulationAuthorized: false,
    validationClaim: false
  }),

  defaultMatrixSeparationContext: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    hearthMergedIntoHEarth: false,
    audraliaMergedIntoHEarth: false,
    manorInteriorAccessAuthorized: false,
    distantTraversalAuthorized: false,
    matrixCollapse: false
  }),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export function buildHEarthGroundConditionReadDescriptor(input = undefined) {
  const inputCheck = checkHEarthGroundConditionReadInput(input);

  const actionInput = Object.freeze({
    activeMatrix: inputCheck.input.activeMatrix,
    activeMatrixRole: inputCheck.input.activeMatrixRole,
    activeCell: inputCheck.input.activeCell,
    sceneIdentity: inputCheck.input.sceneIdentity,
    userAction: inputCheck.input.sourceAction,
    actionId: inputCheck.input.sourceActionId,
    primaryFocusTarget: inputCheck.input.primaryFocusTarget,
    supportingInspectionTargets: inputCheck.input.supportingInspectionTargets,
    requestedReadout: inputCheck.input.readoutName,
    requestedReceipt: inputCheck.input.requestedReceipt
  });

  const actionResult = inspectGround(actionInput);
  const actionDescriptor = actionResult?.descriptor || null;

  const sourceActionLawful =
    actionResult?.lawful === true &&
    actionResult?.handoffEligible === true &&
    actionDescriptor?.actionDescriptorReady === true &&
    Array.isArray(actionResult?.issues) &&
    actionResult.issues.length === 0 &&
    actionResult?.readout?.readoutId === 'H_EARTH_GROUND_CONDITION_READ' &&
    actionResult?.readout?.readoutType === 'Ground Condition Read' &&
    actionResult?.receipt?.receiptType ===
      'H_EARTH_GROUND_INSPECTION_RECEIPT' &&
    actionResult?.receipt?.receiptPersistenceDefinedHere === false;

  const readoutDescriptorReady =
    inputCheck.passed === true && sourceActionLawful === true;

  const receiptHandoff = readoutDescriptorReady
    ? Object.freeze({
        expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
        receiptAuthorityCreatedHere: false,
        receiptRuntimePersistenceCreatedHere: false,
        room6ReceiptMayProceedAfterReadout:
          H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
        requiredRoom6ReceiptAuthority: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.receipts.js',
        handoffEligible: true
      })
    : null;

  return Object.freeze({
    descriptorType: 'H_EARTH_GROUND_CONDITION_READ_DESCRIPTOR',
    readoutType: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    readoutRole: 'FIRST_GROUND_VIEW_READOUT',
    readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',

    activeMatrix: inputCheck.input.activeMatrix,
    activeMatrixRole: inputCheck.input.activeMatrixRole,
    activeCell: inputCheck.input.activeCell,
    domainCellId: 'H_EARTH_GROUND_CELL_001',
    spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
    sceneIdentity: inputCheck.input.sceneIdentity,

    sourceAction: inputCheck.input.sourceAction,
    descriptorActionId: inputCheck.input.sourceActionId,
    runtimeIntentId: inputCheck.input.runtimeIntentId,
    sourceActionResult: actionResult,
    sourceActionDescriptor: actionDescriptor,
    sourceActionDescriptorSource: 'CONSUMED_FROM_SINGLE_STEP_011D_RESULT',
    sourceActionLawful,
    externalActionDescriptorAccepted: false,
    externalActionDescriptorRejected:
      inputCheck.input.externalActionDescriptorRejected === true,
    sourceActionReceipt: H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,

    previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
    currentState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,

    primaryFocusTarget: inputCheck.input.primaryFocusTarget,
    primaryObjectBinding:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS.primaryBinding,

    supportingInspectionTargets: inputCheck.input.supportingInspectionTargets,

    supportingObjectBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS
        .supportingInspectionBindings,

    surfaceContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS.surfaceContextBindings,

    waterAirContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS.waterAirContextBindings,

    hearthContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS.hearthContextBindings,

    audraliaContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS.audraliaContextBindings,

    observationModel: H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL,

    surfaceCondition: readoutDescriptorReady
      ? H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE.defaultSurfaceCondition
      : null,

    moistureCondition: readoutDescriptorReady
      ? H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE.defaultMoistureCondition
      : null,

    localDetailCondition: readoutDescriptorReady
      ? H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE.defaultLocalDetailCondition
      : null,

    waterAirContext: readoutDescriptorReady
      ? H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE.defaultWaterAirContext
      : null,

    matrixSeparationContext: readoutDescriptorReady
      ? H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE
          .defaultMatrixSeparationContext
      : null,

    contextGuard: H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD,

    deferredClaims: Object.freeze({
      runtimeReadoutExecutionClaim: false,
      runtimeActionExecutionClaim: false,
      gameplayExecutionClaim: false,
      rendererStatusClaim: false,
      rendererActivationClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      empiricalDiagnosisClaim: false,
      diagnosticScoreClaim: false,
      healthScoreClaim: false,
      survivalScoreClaim: false,
      openWorldScanClaim: false,
      traversalClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      weatherSimulationClaim: false,
      manorInteriorAccessClaim: false,
      distantTraversalClaim: false,
      receiptPersistenceClaim: false,
      matrixCollapse: false
    }),

    receiptHandoff,

    inputCheck,
    readoutDescriptorReady,
    handoffEligible: receiptHandoff?.handoffEligible === true,
    descriptorOnly: true,
    runtimeReadoutExecutionClaim: false,
    receiptPersistenceCreatedHere: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

export function getHEarthGroundConditionReadForObject(
  objectId,
  input = undefined
) {
  const objectBinding = buildHEarthGroundConditionReadObjectBinding(objectId);
  const descriptor = buildHEarthGroundConditionReadDescriptor(input);
  const classification = classifyHEarthGroundConditionReadObject(objectId);

  const objectReadoutEligible = classification !== 'UNCLASSIFIED_READOUT_OBJECT';

  const objectReadoutResolved =
    objectBinding.bindingResolved === true &&
    objectReadoutEligible === true &&
    descriptor.readoutDescriptorReady === true;

  const handoffEligible =
    objectBinding.bindingResolved === true &&
    objectReadoutEligible === true &&
    descriptor.handoffEligible === true;

  return Object.freeze({
    objectId,
    objectBinding,
    classification,
    objectReadoutEligible,
    readoutType: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    sourceAction: 'Inspect Ground',
    descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentId: 'INSPECT_GROUND',
    primaryDescriptor: descriptor,
    objectReadoutResolved,
    handoffEligible,
    descriptorOnly: true,
    runtimeReadoutExecutionClaim: false,
    rendererStatusClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

/**
 * Contract-only readout descriptor builder.
 * This does not activate runtime and does not persist a receipt.
 */
export function groundConditionRead(input = undefined) {
  const descriptor = buildHEarthGroundConditionReadDescriptor(input);

  const issues = [
    ...descriptor.inputCheck.failureCodes,
    ...(Array.isArray(descriptor.sourceActionResult?.issues)
      ? descriptor.sourceActionResult.issues
      : [])
  ];

  if (
    descriptor.inputCheck.passed === true &&
    descriptor.sourceActionLawful !== true
  ) {
    issues.push(
      'GROUND_CONDITION_READ_ACTION_HANDOFF_REJECTED:SOURCE_ACTION_RESULT_NOT_LAWFUL'
    );
  }

  const lawful = descriptor.readoutDescriptorReady === true;

  return Object.freeze({
    readoutResultType:
      'H_EARTH_GROUND_CONDITION_READ_CONTRACT_DESCRIPTOR_RESULT',
    result: lawful === true ? 'DESCRIPTOR_READY' : 'DESCRIPTOR_REJECTED',
    lawful,
    handoffEligible: descriptor.handoffEligible === true,
    readoutType: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    sourceAction: 'Inspect Ground',
    descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentId: 'INSPECT_GROUND',

    descriptor,

    receiptHandoff: descriptor.receiptHandoff,

    issues: Object.freeze(issues),

    dryRunCompatibleActionResult: descriptor.sourceActionResult,

    descriptorOnly: true,
    readoutExecutedAtRuntime: false,
    gameplayExecuted: false,
    routeIntegrated: false,
    runtimeActivated: false,
    rendererActivated: false,
    compositorActivated: false,
    controllerActivated: false,
    canvasActivated: false,
    webglActivated: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    openWorldClaim: false,
    traversalClaim: false,
    survivalSimulationClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

export const H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL = Object.freeze({
  outputModelId: 'H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL',
  status: 'RECEIPT_HANDOFF_DESCRIPTOR_ONLY',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',

  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  sourceActionLabel: 'Inspect Ground',

  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  outputReceiptFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.receipts.js',
  outputReceiptRuntimePersistenceDefinedHere: false,

  expectedReceiptShape: Object.freeze({
    receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    activeMatrix: 'H-Earth',
    activeMatrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    domainCellId: 'H_EARTH_GROUND_CELL_001',
    spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
    previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
    newState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,
    userAction: 'Inspect Ground',
    descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    runtimeIntentId: 'INSPECT_GROUND',
    terrainReadout: 'Ground Condition Read',
    primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    matrixSeparationPreserved: true,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  }),

  createsReadoutDescriptorHere: true,
  persistsReceiptHere: false,
  createsRuntimeResultHere: false,
  routeOutputClaim: false,
  validationClaim: false,

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ = Object.freeze({
  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  sourceAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  sourceActionObject: H_EARTH_INSPECT_GROUND_ACTION,

  primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',
  contract: H_EARTH_GROUND_CONDITION_READ_CONTRACT,
  boundaries: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES,
  targets: H_EARTH_GROUND_CONDITION_READ_TARGETS,
  inputModel: H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL,
  objectBindings: H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS,
  observationModel: H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL,
  payloadTemplate: H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE,
  contextGuard: H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD,
  outputModel: H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL,

  descriptorBuilder: buildHEarthGroundConditionReadDescriptor,
  readoutFunction: groundConditionRead,

  readoutPayloadDefinedHere: false,
  readoutPayloadTemplateDefinedHere: true,
  readoutPayloadClass: 'CONTRACT_ONLY_DESCRIPTOR_READOUT',
  runtimeReadoutExecutionClaim: false,
  gameplayExecutionClaim: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,
  diagnosticScoreClaim: false,
  empiricalDiagnosisClaim: false,
  rendererStatusClaim: false,
  visualPassStatusClaim: false,
  validationStatusClaim: false,
  openWorldScanClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  persistentSaveLogic: false,
  routeIntegration: false,
  githubInstallation: false,
  matrixCollapse: false
});

export const H_EARTH_GROUND_CONDITION_READ_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_GROUND_CONDITION_READ_RECEIPT',

  contractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1',

  renewsContractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  file: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/readouts/ground-condition-read.js',
  room: 'ROOM_5_READOUT_PREPARATION',

  status:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
      ? 'GROUND_CONDITION_READ_RENEWED_AS_PATH3_OBJECT_READOUT_BINDING_DESCRIPTOR_ONLY'
      : 'GROUND_CONDITION_READ_HELD_BY_REJECTED_PATH3_CELL_BINDING',

  upstreamMatrixFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.matrix.js',
  upstreamMatrixContract:
    'H_EARTH_MATRIX_FILE_RENEWAL_STEP_009D_REJECTED_BINDING_CLASSIFICATION_GUARD_v1',

  upstreamCellFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/cells/ground-cell-001.js',
  upstreamCellContract:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_011A_PATH3_DOMAIN_BINDING_CONSUMER_v1',

  upstreamZoneFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/zones/ground-cell-001.zones.js',
  activeUpstreamZoneContract:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

  exactHistoricalZoneLineageContract:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

  upstreamObjectFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/objects/ground-cell-001.objects.js',
  activeUpstreamObjectContract:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2',

  exactHistoricalObjectLineageContract:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

  upstreamActionFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/actions/inspect-ground.js',
  activeUpstreamActionContract:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v2',

  exactHistoricalActionLineageContract:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_011D_PATH3_OBJECT_ACTION_BINDING_v1',

  retiredUpstreamMatrixContract:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  retiredUpstreamCellContract:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  retiredUpstreamZoneContract:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  retiredUpstreamObjectContract:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  retiredUpstreamActionContract:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  upstreamMatrixReceipt: getHEarthMatrixReceipt(),
  upstreamCellReceipt: getHEarthGroundCell001Receipt(),
  upstreamRoom3UnblockReceipt: getHEarthRoom3UnblockReceipt(),
  upstreamZonesReceipt: getHEarthGroundCell001ZonesReceipt(),
  upstreamObjectMappingUnblockReceipt:
    getHEarthRoom3ObjectMappingUnblockReceipt(),
  upstreamObjectsReceipt: getHEarthGroundCell001ObjectsReceipt(),
  upstreamRoom4ActionBindingUnblockReceipt:
    getHEarthRoom4ActionBindingUnblockReceipt(),
  upstreamActionReceipt: getHEarthInspectGroundActionReceipt(),
  upstreamRoom5ReadoutBindingUnblockReceipt:
    getHEarthRoom5ReadoutBindingUnblockReceipt(),

  path3BindingAdmission: H_EARTH_MATRIX_PATH3_BINDING_ADMISSION,
  cellPath3Binding: H_EARTH_GROUND_CELL_001_PATH3_BINDING,
  cellPath3BindingAdmitted:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,

  externalActionDescriptorAcceptance: false,
  readoutConsumesSingleStep011DResult: true,
  descriptorTakenFromThatSameResult: true,

  sourceEvidenceSeparation: Object.freeze({
    baselineDiffEvidenceOwnedExternally: true,
    backupEvidenceOwnedExternally: true,
    repositoryInstallationEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    runtimeExecutionEvidenceOwnedExternally: true,
    readoutPayloadEvidenceOwnedExternally: true,
    receiptPersistenceEvidenceOwnedExternally: true,
    fetchReadbackEvidenceOwnedExternally: true
  }),

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',
  readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',

  sourceAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  previousState: 'H_EARTH_GROUND_VIEW_ACTIVE',
  currentState: 'H_EARTH_SURFACE_INSPECTION_ACTIVE',

  sourceLatticeAuthorityConsumedAsActiveAuthority: false,
  sourceLatticeAuthorityRetainedAsCompatibility: true,
  sourceLatticeAuthorityCreatedHere: false,

  cellLatticeBindingConsumedAsActiveAuthority: false,
  cellLatticeBindingRetainedAsCompatibility: true,
  cellLatticeBindingCreatedHere: false,

  zoneMappingConsumedAsActiveAuthority: false,
  zoneCompositionConsumedAsActiveAuthority: true,
  zoneMappingCreatedHere: false,

  objectCompressionConsumedAsActiveAuthority: false,
  objectCompositionConsumedAsActiveAuthority: true,
  objectCompressionCreatedHere: false,

  actionBindingConsumedAsActiveAuthority: true,
  actionBindingCreatedHere: false,

  legacyLatticeShape: '16x16',
  legacyRowCount: 16,
  legacyColumnCount: 16,
  legacyAddressCount: 256,
  legacyAddressFormat: 'H_EARTH_GROUND_CELL_001:R{row}:C{column}',

  readoutTargetsDefined: true,
  primaryReadoutObjectBound: true,
  supportingReadoutObjectsBound: true,
  surfaceTransitionContextBound: true,
  waterAirContextBound: true,
  hearthContextBound: true,
  audraliaContextBound: true,
  objectBindingsDefined: true,
  observationModelDefined: true,
  payloadTemplateDefined: true,
  descriptorBuilderDefined: true,
  receiptHandoffPrepared: true,
  contextGuardDefined: true,

  primaryInspectionTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  room6ReceiptFileMayProceed:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,

  room6NextFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.receipts.js',
  room6NextStep:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  retiredRoom6NextStep:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  routeMayProceedNow: false,
  routeHoldReason:
    'Route-side renewal remains held until source renewal chain and receipt/integrity handoff authority are complete.',

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT',

  contractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1',

  status:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
      ? 'ROOM_6_GROUND_INSPECTION_RECEIPT_BINDING_READY_BY_PATH3_READOUT_BINDING'
      : 'ROOM_6_GROUND_INSPECTION_RECEIPT_BINDING_BLOCKED_BY_REJECTED_PATH3_CELL_BINDING',

  path3BindingAdmission: H_EARTH_MATRIX_PATH3_BINDING_ADMISSION,
  cellPath3Binding: H_EARTH_GROUND_CELL_001_PATH3_BINDING,

  sourceMatrixAuthorityReady: false,
  sourceLatticeAuthorityDefined: false,
  cellLatticeBindingComplete: false,
  zoneLatticeMappingComplete: false,
  objectLatticeCompressionContextSufficient: false,

  activeSpatialAuthorityReady:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  activeDomainBindingReady:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  localZoneCompositionComplete:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  localObjectCompositionComplete:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  inspectGroundActionBindingComplete:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,
  groundConditionReadBindingComplete:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,

  activeCell: 'H_EARTH_GROUND_CELL_001',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  requiredRoom6ReceiptFile: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.receipts.js',

  requiredRoom6ReceiptStep:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_011F_PATH3_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  sourceActionLabel: 'Inspect Ground',

  primaryInspectionTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  room6ReceiptFileMayProceed:
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true,

  room6ReceiptFileAllowedWork: Object.freeze(
    H_EARTH_GROUND_CELL_001_PATH3_BINDING.admitted === true
      ? [
          'consume admitted H_EARTH_GROUND_CELL_001_PATH3_BINDING',
          'consume Step 011D v2 Path 3-bound Inspect Ground action binding',
          'consume Step 011E Ground Condition Read descriptor handoff',
          'bind H_EARTH_GROUND_INSPECTION_RECEIPT to Inspect Ground',
          'bind H_EARTH_GROUND_INSPECTION_RECEIPT to Ground Condition Read',
          'preserve matrix separation',
          'preserve all no-runtime, no-renderer, no-validation, no-production claims',
          'prepare integrity harness handoff'
        ]
      : [
          'inspect rejected Path 3 cell binding report only',
          'preserve existing Drive baseline for later renewal',
          'do not renew receipt authority until binding admission passes'
        ]
  ),

  room6ReceiptFileNotAuthorized: Object.freeze([
    'create runtime receipt persistence',
    'create route receipt persistence',
    'create gameplay execution',
    'activate lattice',
    'create traversal grid',
    'create route navigation mesh',
    'create renderer geometry',
    'create material channels',
    'create DOM or canvas output',
    'authorize swimming',
    'authorize fluid simulation',
    'authorize weather simulation',
    'authorize manor interior access',
    'authorize distant traversal',
    'claim renderer pass',
    'claim visual pass',
    'claim validation',
    'claim production',
    'collapse matrices'
  ]),

  sourceAuthorityExports: Object.freeze([
    'H_EARTH_GROUND_CONDITION_READ',
    'H_EARTH_GROUND_CONDITION_READ_RECEIPT',
    'H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT',
    'groundConditionRead',
    'buildHEarthGroundConditionReadDescriptor',
    'getHEarthGroundConditionReadReceipt'
  ]),

  retiredCompatibilityExports: Object.freeze([
    'H_EARTH_SOURCE_LATTICE_AUTHORITY',
    'H_EARTH_GROUND_CELL_001_LATTICE_SCOPE',
    'H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA',
    'H_EARTH_GROUND_CELL_001_LATTICE_BINDING',
    'H_EARTH_GROUND_CELL_001_ADDRESS_FIELD_SUMMARY',
    'H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS',
    'H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS'
  ]),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export function getHEarthGroundConditionReadTargets() {
  return H_EARTH_GROUND_CONDITION_READ_TARGETS;
}

export function getHEarthGroundConditionRead() {
  return H_EARTH_GROUND_CONDITION_READ;
}

export function getHEarthGroundConditionReadReceipt() {
  return H_EARTH_GROUND_CONDITION_READ_RECEIPT;
}

export function getHEarthRoom6ReceiptBindingUnblockReceipt() {
  return H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT;
}

export function getHEarthGroundConditionReadObjectBindings() {
  return H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS;
}

export function getHEarthGroundConditionReadOutputModel() {
  return H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL;
}

export const H_EARTH_GROUND_CONDITION_READ_AGGREGATE = Object.freeze({
  id: 'H_EARTH_GROUND_CONDITION_READ_AGGREGATE',
  file: '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/readouts/ground-condition-read.js',
  room: 'ROOM_5_READOUT_PREPARATION',
  step:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_011E_PATH3_OBJECT_READOUT_BINDING_v1',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  spatialCellId: H_EARTH_GROUND_CELL_001_PATH3_BINDING.spatialCellId,
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',

  sourceAction: 'Inspect Ground',
  descriptorActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  runtimeIntentId: 'INSPECT_GROUND',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  contract: H_EARTH_GROUND_CONDITION_READ_CONTRACT,

  sourceEvidenceSeparation: Object.freeze({
    baselineDiffEvidenceOwnedExternally: true,
    backupEvidenceOwnedExternally: true,
    repositoryInstallationEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    fetchReadbackEvidenceOwnedExternally: true
  }),

  upstreamMatrixPath3DomainBinding: getHEarthMatrixPath3DomainBinding(),
  upstreamMatrixPath3BindingAdmission: getHEarthMatrixPath3BindingAdmission(),
  upstreamMatrixReceipt: getHEarthMatrixReceipt(),

  upstreamRetiredMatrixAuthority: getHEarthSourceLatticeAuthority(),
  upstreamRetiredSourceLatticeAddressFieldSchema:
    getHEarthSourceLatticeAddressFieldSchema(),
  upstreamRetiredGroundCell001LatticeScope:
    getHEarthGroundCell001LatticeScope(),

  upstreamCell: H_EARTH_GROUND_CELL_001,
  upstreamCellContract: H_EARTH_GROUND_CELL_001_CONTRACT,
  upstreamCellSceneBinding: H_EARTH_GROUND_CELL_001_SCENE_BINDING,
  upstreamCellPath3Binding: getHEarthGroundCell001Path3Binding(),
  upstreamCellLatticeBinding: getHEarthGroundCell001LatticeBinding(),
  upstreamCellAddressFieldSummary: getHEarthGroundCell001AddressFieldSummary(),
  upstreamCellSpawnAnchorScope: H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
  upstreamCellReceipt: H_EARTH_GROUND_CELL_001_RECEIPT,
  upstreamRoom3UnblockReceipt: H_EARTH_ROOM_3_UNBLOCK_RECEIPT,
  upstreamCellDownstreamInterface: H_EARTH_GROUND_CELL_001_DOWNSTREAM_INTERFACE,

  upstreamZoneContract: H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,
  upstreamZoneBoundaries: H_EARTH_ZONE_BOUNDARIES,
  upstreamZones: H_EARTH_GROUND_CELL_001_ZONES,
  upstreamZoneIds: H_EARTH_GROUND_CELL_001_ZONE_IDS,
  upstreamZoneMappingModel: H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL,
  upstreamZoneRegionRules: H_EARTH_GROUND_CELL_001_ZONE_REGION_RULES,
  upstreamZoneAddressRegions: H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
  upstreamZoneBoundaryRoles: H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,
  upstreamZoneAdjacency: H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
  upstreamZoneDescriptors: H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
  upstreamZoneOverlapModel: H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL,
  upstreamZoneToObjectExpectation:
    H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,
  upstreamZoneDownstreamInterface:
    H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,
  upstreamZoneAllowedActions: H_EARTH_GROUND_CELL_001_ALLOWED_ZONE_ACTIONS,
  upstreamZoneBlockedActions: H_EARTH_GROUND_CELL_001_BLOCKED_ZONE_ACTIONS,
  upstreamZonesReceipt: H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,
  upstreamObjectMappingUnblockReceipt:
    H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,

  upstreamObjectContract: H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT,
  upstreamObjectIds: H_EARTH_GROUND_CELL_001_OBJECT_IDS,
  upstreamObjectCompositionModel:
    H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL,
  upstreamObjectZoneBindings: H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS,
  upstreamObjectAddressBindings:
    H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS,
  upstreamObjectInspectionRoles:
    H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES,
  upstreamObjectContextBoundaries:
    H_EARTH_GROUND_CELL_001_OBJECT_CONTEXT_BOUNDARIES,
  upstreamObjects: H_EARTH_GROUND_CELL_001_OBJECTS,
  upstreamObjectDescriptors: H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS,
  upstreamObjectsByZone: H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE,
  upstreamObjectToActionReference:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE,
  upstreamObjectToReadoutReference:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,
  upstreamObjectDownstreamInterface:
    H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE,
  upstreamObjectsReceipt: H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT,
  upstreamRoom4ActionBindingUnblockReceipt:
    H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT,

  upstreamActionContract: H_EARTH_INSPECT_GROUND_ACTION_CONTRACT,
  upstreamActionBoundaries: H_EARTH_INSPECT_GROUND_BOUNDARIES,
  upstreamActionTargets: H_EARTH_INSPECT_GROUND_TARGETS,
  upstreamActionStatePath: H_EARTH_INSPECT_GROUND_STATE_PATH,
  upstreamActionInputModel: H_EARTH_INSPECT_GROUND_INPUT_MODEL,
  upstreamActionTargetModel: H_EARTH_INSPECT_GROUND_TARGET_MODEL,
  upstreamActionObjectAnchorBinding:
    H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING,
  upstreamActionObjectBindings: H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS,
  upstreamActionOutputModel: H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
  upstreamActionDryRunModel: H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL,
  upstreamActionContextGuard: H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,
  upstreamAction: H_EARTH_INSPECT_GROUND_ACTION,
  upstreamActionReceipt: H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,
  upstreamRoom5ReadoutBindingUnblockReceipt:
    H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT,

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

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundaryFlags: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES,

  normalizeHEarthGroundConditionReadString,
  normalizeHEarthGroundConditionReadTargets,
  getHEarthGroundConditionReadObjectDescriptor,
  classifyHEarthGroundConditionReadObject,
  buildHEarthGroundConditionReadInput,
  checkHEarthGroundConditionReadInput,
  buildHEarthGroundConditionReadObjectBinding,
  buildHEarthGroundConditionReadDescriptor,
  getHEarthGroundConditionReadForObject,
  groundConditionRead,
  getHEarthGroundConditionReadTargets,
  getHEarthGroundConditionRead,
  getHEarthGroundConditionReadReceipt,
  getHEarthRoom6ReceiptBindingUnblockReceipt,
  getHEarthGroundConditionReadObjectBindings,
  getHEarthGroundConditionReadOutputModel,

  normalizeHEarthInspectGroundString,
  normalizeHEarthInspectGroundTargets,
  buildHEarthInspectGroundActionDescriptor,
  inspectGround,
  getHEarthInspectGroundTargets,
  getHEarthInspectGroundAction,
  getHEarthInspectGroundActionReceipt,
  getHEarthRoom5ReadoutBindingUnblockReceipt,
  getHEarthInspectGroundObjectAnchorBinding,
  getHEarthInspectGroundObjectBindings,
  getHEarthInspectGroundOutputModel,

  getHEarthGroundCell001ObjectDescriptor,
  getHEarthGroundCell001ObjectZoneBinding,
  getHEarthGroundCell001ObjectAddressBinding,
  getHEarthGroundCell001ObjectsForZone,
  isHEarthGroundCell001ObjectId,
  isHEarthGroundCell001InspectionObject,
  isHEarthGroundCell001ContextOnlyObject,

  getHEarthGroundCell001ZoneDescriptor,
  getHEarthGroundCell001ZoneAddressRegion,
  getHEarthGroundCell001ZoneAdjacency,
  getHEarthGroundCell001ExpectedObjectsForZone,

  getHEarthMatrixPath3DomainBinding,
  getHEarthMatrixPath3BindingAdmission
});

export default H_EARTH_GROUND_CONDITION_READ_AGGREGATE;
