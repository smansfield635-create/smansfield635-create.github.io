import {
  FLAG_STATUSES,
  PHASE_STATUSES,
  SCALE_CLASSES,
  FakeClosureError,
  IdentityLossError,
  ParentBoundaryViolationError,
  ScaleCollapseError,
  createScaleObject,
  assertSpineLegibility,
} from "./diamond_interface_spine.js";

export const ADAPTER_NAMESPACE = "kernel_adapter_v1";
export const NOTE_SET_SIZE = 64;
export const MICROSTATE_VECTOR_SIZE = 8;
export const MESO_ENGINE_COUNT = 16;

function assert(condition, ErrorType, message, context = {}) {
  if (!condition) {
    throw new ErrorType(message, context);
  }
}

function assertNonEmptyString(value, fieldName) {
  assert(
    typeof value === "string" && value.trim().length > 0,
    IdentityLossError,
    `${fieldName} must be a non-empty string.`,
    { fieldName, value },
  );
}

function assertArray(value, fieldName) {
  assert(
    Array.isArray(value),
    IdentityLossError,
    `${fieldName} must be an array.`,
    { fieldName, value },
  );
}

function assertPlainObject(value, fieldName) {
  assert(
    value !== null && typeof value === "object" && !Array.isArray(value),
    IdentityLossError,
    `${fieldName} must be a plain object.`,
    { fieldName, value },
  );
}

function cloneObject(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createNoteBindObject({
  noteId,
  chargeRead = 0,
  localPosition,
  neighborSet = [],
  phaseTag = PHASE_STATUSES.NEW_MOON,
} = {}) {
  assertNonEmptyString(noteId, "noteId");
  assert(
    Number.isFinite(chargeRead),
    IdentityLossError,
    "chargeRead must be finite.",
    { noteId, chargeRead },
  );
  assertPlainObject(localPosition, "localPosition");
  assertArray(neighborSet, "neighborSet");

  return Object.freeze({
    adapterNamespace: ADAPTER_NAMESPACE,
    metricClass: SCALE_CLASSES.NOTE,
    noteId,
    chargeRead,
    localPosition: cloneObject(localPosition),
    neighborSet: cloneObject(neighborSet),
    phaseTag,
  });
}

export function createNodeBindObject({
  nodeId,
  noteSet,
  compilationRule = "64_note_compilation",
  localPosition = null,
  adjacencySet = [],
  diagnosticOverlay = null,
} = {}) {
  assertNonEmptyString(nodeId, "nodeId");
  assertArray(noteSet, "noteSet");
  assert(
    noteSet.length === NOTE_SET_SIZE,
    ScaleCollapseError,
    `nodeId ${nodeId} must compile exactly ${NOTE_SET_SIZE} notes.`,
    { nodeId, noteSetSize: noteSet.length },
  );
  assertArray(adjacencySet, "adjacencySet");

  return Object.freeze({
    adapterNamespace: ADAPTER_NAMESPACE,
    metricClass: SCALE_CLASSES.NODE,
    nodeId,
    noteSet: cloneObject(noteSet),
    compilationRule,
    localPosition: localPosition ? cloneObject(localPosition) : null,
    adjacencySet: cloneObject(adjacencySet),
    diagnosticOverlay: diagnosticOverlay ? cloneObject(diagnosticOverlay) : null,
  });
}

export function createMicrostateBindObject({
  stateId,
  stateVector,
  nodeProjectionSet = [],
  spineCoordinate,
  diagnosticObject = null,
  engineProjectionTarget = null,
} = {}) {
  assertNonEmptyString(stateId, "stateId");
  assertArray(stateVector, "stateVector");
  assert(
    stateVector.length === MICROSTATE_VECTOR_SIZE,
    IdentityLossError,
    `stateId ${stateId} must expose ${MICROSTATE_VECTOR_SIZE} state dimensions.`,
    { stateId, stateVector },
  );
  assertArray(nodeProjectionSet, "nodeProjectionSet");
  assertSpineLegibility(spineCoordinate, "spineCoordinate");

  return Object.freeze({
    adapterNamespace: ADAPTER_NAMESPACE,
    metricClass: SCALE_CLASSES.MICROSTATE,
    stateId,
    stateVector: cloneObject(stateVector),
    nodeProjectionSet: cloneObject(nodeProjectionSet),
    spineCoordinate: cloneObject(spineCoordinate),
    diagnosticObject: diagnosticObject ? cloneObject(diagnosticObject) : null,
    engineProjectionTarget,
  });
}

export function createEngineBindObject({
  engineId,
  engineClass = SCALE_CLASSES.MESO_ENGINE,
  microstateRegionSet = [],
  routeCompatibility = [],
  fusionCoreCompatibility = [],
  flagPhaseAttachments = {},
} = {}) {
  assertNonEmptyString(engineId, "engineId");
  assertArray(microstateRegionSet, "microstateRegionSet");
  assertArray(routeCompatibility, "routeCompatibility");
  assertArray(fusionCoreCompatibility, "fusionCoreCompatibility");
  assertPlainObject(flagPhaseAttachments, "flagPhaseAttachments");

  return Object.freeze({
    adapterNamespace: ADAPTER_NAMESPACE,
    metricClass: engineClass,
    engineId,
    microstateRegionSet: cloneObject(microstateRegionSet),
    routeCompatibility: cloneObject(routeCompatibility),
    fusionCoreCompatibility: cloneObject(fusionCoreCompatibility),
    flagPhaseAttachments: cloneObject(flagPhaseAttachments),
  });
}

export function createMacroEngineBindObject({
  macroEngineId,
  fusionCoreId,
  mesoEngineDependencies = [],
  noteNodeTraversalSignature = [],
  universeContextTag = null,
  closureCompatibility = {},
} = {}) {
  assertNonEmptyString(macroEngineId, "macroEngineId");
  assertNonEmptyString(fusionCoreId, "fusionCoreId");
  assertArray(mesoEngineDependencies, "mesoEngineDependencies");
  assertArray(noteNodeTraversalSignature, "noteNodeTraversalSignature");
  assertPlainObject(closureCompatibility, "closureCompatibility");
  assert(
    mesoEngineDependencies.length > 0,
    ScaleCollapseError,
    "Macro engine objects must preserve meso-engine dependencies.",
    { macroEngineId },
  );

  return Object.freeze({
    adapterNamespace: ADAPTER_NAMESPACE,
    metricClass: SCALE_CLASSES.MACRO_ENGINE,
    macroEngineId,
    fusionCoreId,
    mesoEngineDependencies: cloneObject(mesoEngineDependencies),
    noteNodeTraversalSignature: cloneObject(noteNodeTraversalSignature),
    universeContextTag,
    closureCompatibility: cloneObject(closureCompatibility),
  });
}

export function createFlagPhaseBindObject({
  objectId,
  flagStatus = FLAG_STATUSES.GREEN,
  phaseStatus = PHASE_STATUSES.NEW_MOON,
  checkeredFlagRead = false,
  eclipseFlagRead = false,
  depthBoundClosureRead = "open",
  returnStatusRead = "pending",
} = {}) {
  assertNonEmptyString(objectId, "objectId");
  assert(
    Object.values(FLAG_STATUSES).includes(flagStatus),
    IdentityLossError,
    "flagStatus must be a canonical flag.",
    { objectId, flagStatus },
  );
  assert(
    Object.values(PHASE_STATUSES).includes(phaseStatus),
    IdentityLossError,
    "phaseStatus must be a canonical phase.",
    { objectId, phaseStatus },
  );

  if (eclipseFlagRead && !checkeredFlagRead) {
    throw new FakeClosureError(
      "Eclipse cannot be read without checkered pass-complete status.",
      { objectId, flagStatus, phaseStatus },
    );
  }

  return Object.freeze({
    adapterNamespace: ADAPTER_NAMESPACE,
    objectId,
    flagStatus,
    phaseStatus,
    checkeredFlagRead: Boolean(checkeredFlagRead),
    eclipseFlagRead: Boolean(eclipseFlagRead),
    depthBoundClosureRead,
    returnStatusRead,
  });
}

export function assertScaleLadderIntegrity({
  notes = [],
  nodes = [],
  microstates = [],
  engines = [],
  macroEngines = [],
} = {}) {
  assertArray(notes, "notes");
  assertArray(nodes, "nodes");
  assertArray(microstates, "microstates");
  assertArray(engines, "engines");
  assertArray(macroEngines, "macroEngines");

  for (const node of nodes) {
    assert(
      Array.isArray(node.noteSet) && node.noteSet.length === NOTE_SET_SIZE,
      ScaleCollapseError,
      "Each node must preserve a 64-note compilation.",
      { node },
    );
  }

  for (const microstate of microstates) {
    assert(
      Array.isArray(microstate.stateVector) &&
        microstate.stateVector.length === MICROSTATE_VECTOR_SIZE,
      IdentityLossError,
      "Each microstate must preserve its eight-dimensional state vector.",
      { microstate },
    );
  }

  if (engines.length > MESO_ENGINE_COUNT) {
    throw new ScaleCollapseError(
      `Engine set cannot exceed canonical mesolayer count ${MESO_ENGINE_COUNT}.`,
      { engineCount: engines.length },
    );
  }

  for (const macroEngine of macroEngines) {
    assert(
      Array.isArray(macroEngine.mesoEngineDependencies) &&
        macroEngine.mesoEngineDependencies.length > 0,
      ScaleCollapseError,
      "Each macro engine must preserve meso-engine dependencies.",
      { macroEngine },
    );
  }

  return true;
}

export function adaptKernelToSpine(kernel = {}) {
  const notes = (kernel.notes ?? []).map((entry) =>
    createNoteBindObject({
      noteId: entry.noteId,
      chargeRead: entry.chargeRead ?? 0,
      localPosition: entry.localPosition ?? { x: 0, y: 0 },
      neighborSet: entry.neighborSet ?? [],
      phaseTag: entry.phaseTag ?? PHASE_STATUSES.NEW_MOON,
    }),
  );

  const nodes = (kernel.nodes ?? []).map((entry) =>
    createNodeBindObject({
      nodeId: entry.nodeId,
      noteSet: entry.noteSet ?? [],
      compilationRule: entry.compilationRule ?? "64_note_compilation",
      localPosition: entry.localPosition ?? null,
      adjacencySet: entry.adjacencySet ?? [],
      diagnosticOverlay: entry.diagnosticOverlay ?? null,
    }),
  );

  const microstates = (kernel.microstates ?? []).map((entry) =>
    createMicrostateBindObject({
      stateId: entry.stateId,
      stateVector: entry.stateVector ?? [],
      nodeProjectionSet: entry.nodeProjectionSet ?? [],
      spineCoordinate: entry.spineCoordinate,
      diagnosticObject: entry.diagnosticObject ?? null,
      engineProjectionTarget: entry.engineProjectionTarget ?? null,
    }),
  );

  const engines = (kernel.engines ?? []).map((entry) =>
    createEngineBindObject({
      engineId: entry.engineId,
      engineClass: entry.engineClass ?? SCALE_CLASSES.MESO_ENGINE,
      microstateRegionSet: entry.microstateRegionSet ?? [],
      routeCompatibility: entry.routeCompatibility ?? [],
      fusionCoreCompatibility: entry.fusionCoreCompatibility ?? [],
      flagPhaseAttachments: entry.flagPhaseAttachments ?? {},
    }),
  );

  const macroEngines = (kernel.macroEngines ?? []).map((entry) =>
    createMacroEngineBindObject({
      macroEngineId: entry.macroEngineId,
      fusionCoreId: entry.fusionCoreId,
      mesoEngineDependencies: entry.mesoEngineDependencies ?? [],
      noteNodeTraversalSignature: entry.noteNodeTraversalSignature ?? [],
      universeContextTag: entry.universeContextTag ?? null,
      closureCompatibility: entry.closureCompatibility ?? {},
    }),
  );

  const flagPhaseBindings = (kernel.flagPhaseBindings ?? []).map((entry) =>
    createFlagPhaseBindObject({
      objectId: entry.objectId,
      flagStatus: entry.flagStatus ?? FLAG_STATUSES.GREEN,
      phaseStatus: entry.phaseStatus ?? PHASE_STATUSES.NEW_MOON,
      checkeredFlagRead: entry.checkeredFlagRead ?? false,
      eclipseFlagRead: entry.eclipseFlagRead ?? false,
      depthBoundClosureRead: entry.depthBoundClosureRead ?? "open",
      returnStatusRead: entry.returnStatusRead ?? "pending",
    }),
  );

  const scaleBindings = Object.freeze([
    createScaleObject({
      lowerScaleId: SCALE_CLASSES.NOTE,
      upperScaleId: SCALE_CLASSES.NODE,
      preservationRule: "note_identity_preserved_in_node_compilation",
      compilationRule: "64_note_compilation",
      projectionRule: "note_to_node_projection",
    }),
    createScaleObject({
      lowerScaleId: SCALE_CLASSES.NODE,
      upperScaleId: SCALE_CLASSES.MICROSTATE,
      preservationRule: "node_identity_preserved_in_microstate_projection",
      compilationRule: "node_cluster_projection",
      projectionRule: "node_to_microstate_projection",
    }),
    createScaleObject({
      lowerScaleId: SCALE_CLASSES.MICROSTATE,
      upperScaleId: SCALE_CLASSES.MESO_ENGINE,
      preservationRule: "microstate_identity_preserved_in_engine_coarse_grain",
      compilationRule: "microstate_region_coarse_grain",
      projectionRule: "microstate_to_meso_engine_projection",
    }),
    createScaleObject({
      lowerScaleId: SCALE_CLASSES.MESO_ENGINE,
      upperScaleId: SCALE_CLASSES.MACRO_ENGINE,
      preservationRule: "meso_engine_identity_preserved_in_macro_fusion",
      compilationRule: "fusion_core_aggregation",
      projectionRule: "meso_engine_to_macro_engine_projection",
    }),
    createScaleObject({
      lowerScaleId: SCALE_CLASSES.MACRO_ENGINE,
      upperScaleId: SCALE_CLASSES.UNIVERSE_CONTEXT,
      preservationRule: "macro_engine_identity_preserved_in_universe_context",
      compilationRule: "universe_context_attachment",
      projectionRule: "macro_engine_to_universe_context_projection",
    }),
  ]);

  assertScaleLadderIntegrity({ notes, nodes, microstates, engines, macroEngines });

  if (kernel.spineBundle) {
    assertSpineLegibility(kernel.spineBundle, "kernel.spineBundle");
  }

  return Object.freeze({
    adapterNamespace: ADAPTER_NAMESPACE,
    notes,
    nodes,
    microstates,
    engines,
    macroEngines,
    flagPhaseBindings,
    scaleBindings,
  });
}
