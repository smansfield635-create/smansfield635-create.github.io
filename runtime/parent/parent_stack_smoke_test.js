import {
  SCALE_CLASSES,
  PATH_CLASSES,
  FLAG_STATUSES,
  PHASE_STATUSES,
  createTopologyObject,
  createCoordinateObject,
  createAdjacencyObject,
  createDiagnosticObject,
  createRouteObject,
  createClosureObject,
  assertSpineLegibility,
} from "./diamond_interface_spine.js";

import {
  NOTE_SET_SIZE,
  createNoteBindObject,
  createNodeBindObject,
  createMicrostateBindObject,
  createEngineBindObject,
  createMacroEngineBindObject,
  createFlagPhaseBindObject,
  adaptKernelToSpine,
  assertScaleLadderIntegrity,
} from "./kernel_adapter.js";

import {
  createUniverseTemplate,
  createWorldEngine,
  createPlanetEngine,
  createBodyEngine,
  createRegionEngine,
  createEnvironmentEngine,
  createRelationField,
  createSeedState,
  assertUniverseFactoryOutput,
} from "./universe_engine_factory.js";

import {
  createStateInstrument,
  createDiagnosticInstrument,
  createRouteInstrument,
  createEngineInstrument,
  createFidelityInstrument,
  createDriftInstrument,
  createFractureInstrument,
  createClosureInstrument,
  createReturnAudit,
  assertInstrumentFactoryOutput,
} from "./instrument_factory.js";

import {
  createAdmissionDecision,
  createRoutingDecision,
  createMonitoringState,
  createLockDecision,
  createSealDecision,
  createReturnDecision,
  createParentAuditTrail,
  createPhaseGate,
  createTrackPermission,
  assertOrchestrationDecision,
} from "./orchestration_fabric.js";

function range(count, mapper) {
  return Array.from({ length: count }, (_, index) => mapper(index));
}

export function runParentStackSmokeTest() {
  const topology = createTopologyObject({
    regionSet: ["root_region"],
    containmentRelations: [{ parent: "root", child: "root_region" }],
    partitionRules: ["single_partition"],
    boundaryFlags: ["bounded"],
  });

  const coordinate = createCoordinateObject({
    objectId: "microstate_1",
    scaleClass: SCALE_CLASSES.MICROSTATE,
    positionVector: { x: 0, y: 0, z: 0 },
    regionId: "root_region",
    orientationRead: "neutral",
    phaseTag: PHASE_STATUSES.NEW_MOON,
  });

  const adjacency = createAdjacencyObject({
    sourceId: "microstate_1",
    targetId: "microstate_2",
    edgeClass: "adjacent",
  });

  const diagnostic = createDiagnosticObject({
    energy: 1,
    coherence: 1,
    entropy: 0,
    phase: PHASE_STATUSES.NEW_MOON,
    overlayTags: ["baseline"],
  });

  const route = createRouteObject({
    pathId: "path_1",
    pathClass: PATH_CLASSES.ASCENDING,
    edgeSequence: [adjacency],
    ascentFlag: true,
  });

  const closure = createClosureObject({
    closureStatus: "depth_bound_complete",
    returnStatus: "ready",
    checkeredFlag: true,
    eclipseFlag: false,
    preservationRead: "bound_inheritance_object",
  });

  assertSpineLegibility(
    { topology, coordinate, adjacency, diagnostic, route, closure },
    "spineBundle",
  );

  const notes = range(NOTE_SET_SIZE, (index) =>
    createNoteBindObject({
      noteId: `note_${index + 1}`,
      chargeRead: index,
      localPosition: { x: index, y: 0 },
      neighborSet: index > 0 ? [`note_${index}`] : [],
    }),
  );

  const node = createNodeBindObject({
    nodeId: "node_1",
    noteSet: notes.map((item) => item.noteId),
    adjacencySet: ["node_2"],
  });

  const microstate = createMicrostateBindObject({
    stateId: "microstate_1",
    stateVector: [1, 0, 1, 0, 1, 0, 1, 0],
    nodeProjectionSet: [node.nodeId],
    spineCoordinate: coordinate,
    diagnosticObject: diagnostic,
    engineProjectionTarget: "engine_1",
  });

  const mesoEngine = createEngineBindObject({
    engineId: "engine_1",
    microstateRegionSet: [microstate.stateId],
    routeCompatibility: [route.pathClass],
    fusionCoreCompatibility: ["fusion_core_1"],
    flagPhaseAttachments: {
      flag: FLAG_STATUSES.GREEN,
      phase: PHASE_STATUSES.NEW_MOON,
    },
  });

  const macroEngine = createMacroEngineBindObject({
    macroEngineId: "macro_1",
    fusionCoreId: "fusion_core_1",
    mesoEngineDependencies: [mesoEngine.engineId],
    noteNodeTraversalSignature: [notes[0].noteId, node.nodeId],
    universeContextTag: "universe_alpha",
    closureCompatibility: { checkered: true },
  });

  const flagPhaseBinding = createFlagPhaseBindObject({
    objectId: "microstate_1",
    flagStatus: FLAG_STATUSES.CHECKERED,
    phaseStatus: PHASE_STATUSES.SETTING_SUN,
    checkeredFlagRead: true,
    eclipseFlagRead: false,
    depthBoundClosureRead: "closed",
    returnStatusRead: "ready",
  });

  const adapterBundle = adaptKernelToSpine({
    notes,
    nodes: [node],
    microstates: [microstate],
    engines: [mesoEngine],
    macroEngines: [macroEngine],
    flagPhaseBindings: [flagPhaseBinding],
    spineBundle: { topology, coordinate, adjacency, diagnostic, route, closure },
  });

  assertScaleLadderIntegrity({
    notes: adapterBundle.notes,
    nodes: adapterBundle.nodes,
    microstates: adapterBundle.microstates,
    engines: adapterBundle.engines,
    macroEngines: adapterBundle.macroEngines,
  });

  const universeTemplate = createUniverseTemplate({
    universeId: "universe_alpha",
    topologyBind: topology,
    scaleContext: { rootScale: SCALE_CLASSES.UNIVERSE_CONTEXT },
    fusionCoreSet: [macroEngine.fusionCoreId],
    relationFieldSchema: ["relation_field_alpha"],
    seedRuleset: { entry: "seed_state_alpha" },
    closureCompatibility: { allowsDepthBoundClosure: true },
  });

  const worldEngine = createWorldEngine({
    worldId: "world_alpha",
    universeId: universeTemplate.universeId,
    macroEngineDependencies: [macroEngine.macroEngineId],
    regionSet: ["root_region"],
    environmentRules: { climate: "temperate" },
    routeSpace: [route.pathId],
    runtimeReadyFlag: true,
  });

  const planetEngine = createPlanetEngine({
    planetId: "planet_alpha",
    worldId: worldEngine.worldId,
    engineDependencies: [mesoEngine.engineId, macroEngine.macroEngineId],
    regionDependencies: ["root_region"],
    seedStateBind: { seedId: "seed_state_alpha" },
    diagnosticCompatibility: { readable: true },
  });

  const bodyEngine = createBodyEngine({
    bodyId: "body_alpha",
    planetId: planetEngine.planetId,
    engineDependencies: [planetEngine.planetId],
    relationFields: ["relation_field_alpha"],
  });

  const regionEngine = createRegionEngine({
    regionId: "root_region",
    parentId: worldEngine.worldId,
    coordinate,
    adjacencySet: [adjacency.targetId],
  });

  const environmentEngine = createEnvironmentEngine({
    environmentId: "env_alpha",
    parentId: worldEngine.worldId,
    rules: { weather: "stable" },
    diagnosticCompatibility: { readable: true },
  });

  const relationField = createRelationField({
    fieldId: "relation_field_alpha",
    sourceObjects: [worldEngine.worldId],
    targetObjects: [planetEngine.planetId],
    adjacencySchema: [adjacency],
    pressureRules: { mode: "bounded" },
    transferRules: { mode: "lawful" },
  });

  const seedState = createSeedState({
    seedId: "seed_state_alpha",
    targetClass: "planet_engine",
    noteNodeBindSet: {
      notes: notes.map((note) => note.noteId),
      node: node.nodeId,
    },
    microstateSet: [microstate.stateId],
    engineAttachments: [mesoEngine.engineId, macroEngine.macroEngineId],
    flagPhaseBind: flagPhaseBinding,
    initialRouteRead: route,
  });

  [
    universeTemplate,
    worldEngine,
    planetEngine,
    bodyEngine,
    regionEngine,
    environmentEngine,
    relationField,
    seedState,
  ].forEach((output) => assertUniverseFactoryOutput(output, { adapterBundle }));

  const stateInstrument = createStateInstrument({
    instrumentId: "state_inst_1",
    targetObjectId: worldEngine.worldId,
    scaleClass: SCALE_CLASSES.MACRO_ENGINE,
    positionRead: { region: "root_region" },
    identityPreservationRead: true,
    regionRead: "root_region",
  });

  const diagnosticInstrument = createDiagnosticInstrument({
    instrumentId: "diag_inst_1",
    targetObjectId: worldEngine.worldId,
    energyRead: 1,
    coherenceRead: 1,
    entropyRead: 0,
    phaseRead: PHASE_STATUSES.MORNING_SUN,
    overlaySet: ["healthy"],
  });

  const routeInstrument = createRouteInstrument({
    instrumentId: "route_inst_1",
    targetObjectId: worldEngine.worldId,
    pathId: route.pathId,
    pathClass: route.pathClass,
    edgeSequence: route.edgeSequence,
  });

  const engineInstrument = createEngineInstrument({
    instrumentId: "engine_inst_1",
    targetObjectId: worldEngine.worldId,
    mesoEngineRead: mesoEngine.engineId,
    macroFusionRead: macroEngine.macroEngineId,
  });

  const fidelityInstrument = createFidelityInstrument({
    instrumentId: "fidelity_inst_1",
    targetObjectId: worldEngine.worldId,
    kernelMatchRead: true,
    spineMatchRead: true,
    driftScore: 0,
    misfitLocus: null,
  });

  const driftInstrument = createDriftInstrument({
    instrumentId: "drift_inst_1",
    targetObjectId: worldEngine.worldId,
    driftDetected: false,
    driftDetails: { source: "smoke_test" },
  });

  const fractureInstrument = createFractureInstrument({
    instrumentId: "fracture_inst_1",
    targetObjectId: worldEngine.worldId,
    fractureDetected: false,
    discontinuityMap: [],
  });

  const closureInstrument = createClosureInstrument({
    instrumentId: "closure_inst_1",
    targetObjectId: worldEngine.worldId,
    checkeredFlagRead: true,
    settingSunRead: true,
    eclipseRead: false,
    depthBoundClosureRead: "closed",
    returnStatusRead: "ready",
  });

  const returnAudit = createReturnAudit({
    auditId: "audit_1",
    targetObjectId: worldEngine.worldId,
    stateSummary: { ok: true },
    diagnosticSummary: { ok: true },
    routeSummary: { ok: true },
    fidelitySummary: { ok: true },
    closureSummary: { ok: true },
    orchestrationReadyFlag: true,
  });

  [
    stateInstrument,
    diagnosticInstrument,
    routeInstrument,
    engineInstrument,
    fidelityInstrument,
    driftInstrument,
    fractureInstrument,
    closureInstrument,
    returnAudit,
  ].forEach((output) => assertInstrumentFactoryOutput(output, { adapterBundle }));

  const admissionDecision = createAdmissionDecision({
    decisionId: "admission_1",
    targetObjectId: worldEngine.worldId,
    admissionStrength: "support",
    trackAssignment: "parent_factory_track",
    burdenStatus: "held",
    rationaleTags: ["smoke_test"],
  });

  const routingDecision = createRoutingDecision({
    decisionId: "routing_1",
    targetObjectId: worldEngine.worldId,
    currentTrack: "generation",
    nextTrack: "verification",
    expressStatus: false,
    returnRequiredFlag: true,
  });

  const monitoringState = createMonitoringState({
    monitorId: "monitor_1",
    targetObjectId: worldEngine.worldId,
    locationRead: { region: "root_region" },
    diagnosticSummary: { coherence: 1 },
    routeSummary: { pathClass: PATH_CLASSES.ASCENDING },
    flagStatus: FLAG_STATUSES.GREEN,
    phaseStatus: PHASE_STATUSES.MORNING_SUN,
    driftAlerts: [],
    fractureAlerts: [],
  });

  const lockDecision = createLockDecision({
    lockId: "lock_1",
    targetObjectId: worldEngine.worldId,
    lockClass: "threshold_lock",
    lockStatus: "locked",
    thresholdRead: { coherence: 1 },
  });

  const sealDecision = createSealDecision({
    sealId: "seal_1",
    targetObjectId: worldEngine.worldId,
    checkeredStatus: true,
    settingSunStatus: true,
    eclipseStatus: false,
    sealStatus: "sealed",
    falseClosureFlag: false,
  });

  const returnDecision = createReturnDecision({
    returnId: "return_1",
    targetObjectId: worldEngine.worldId,
    returnStatus: "ready",
    inheritanceObjectId: "inheritance_1",
    nextCycleAttachments: ["cycle_2"],
    memoryPreservationRead: "preserved",
  });

  const parentAuditTrail = createParentAuditTrail({
    auditId: "trail_1",
    targetObjectId: worldEngine.worldId,
    admissionHistory: [admissionDecision],
    routingHistory: [routingDecision],
    monitoringHistory: [monitoringState],
    lockHistory: [lockDecision],
    sealHistory: [sealDecision],
    returnHistory: [returnDecision],
  });

  const phaseGate = createPhaseGate({
    gateId: "phase_gate_1",
    targetObjectId: worldEngine.worldId,
    requiredFlagStatus: FLAG_STATUSES.GREEN,
    requiredPhaseStatus: PHASE_STATUSES.MORNING_SUN,
    pass: true,
  });

  const trackPermission = createTrackPermission({
    permissionId: "permission_1",
    targetObjectId: worldEngine.worldId,
    currentTrack: "verification",
    nextTrack: "orchestration",
    granted: true,
    rationaleTags: ["smoke_test"],
  });

  [
    admissionDecision,
    routingDecision,
    monitoringState,
    lockDecision,
    sealDecision,
    returnDecision,
    parentAuditTrail,
    phaseGate,
    trackPermission,
  ].forEach((output) => assertOrchestrationDecision(output));

  return {
    ok: true,
    stack: {
      spine: { topology, coordinate, adjacency, diagnostic, route, closure },
      adapterBundle,
      universeFactory: {
        universeTemplate,
        worldEngine,
        planetEngine,
        bodyEngine,
        regionEngine,
        environmentEngine,
        relationField,
        seedState,
      },
      instrumentFactory: {
        stateInstrument,
        diagnosticInstrument,
        routeInstrument,
        engineInstrument,
        fidelityInstrument,
        driftInstrument,
        fractureInstrument,
        closureInstrument,
        returnAudit,
      },
      orchestration: {
        admissionDecision,
        routingDecision,
        monitoringState,
        lockDecision,
        sealDecision,
        returnDecision,
        parentAuditTrail,
        phaseGate,
        trackPermission,
      },
    },
  };
}

export default runParentStackSmokeTest;
