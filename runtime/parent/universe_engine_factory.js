import {
  IdentityLossError,
  ParentBoundaryViolationError,
  PrivateGeometryError,
  ScaleCollapseError,
  assertSpineLegibility,
} from "./diamond_interface_spine.js";
import { ADAPTER_NAMESPACE, assertScaleLadderIntegrity } from "./kernel_adapter.js";

export const UNIVERSE_FACTORY_NAMESPACE = "universe_engine_factory_v1";

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

function assertAdapterBundle(adapterBundle) {
  assertPlainObject(adapterBundle, "adapterBundle");
  assert(
    adapterBundle.adapterNamespace === ADAPTER_NAMESPACE,
    ParentBoundaryViolationError,
    "Universe factory requires kernel_adapter_v1 inputs.",
    { adapterBundle },
  );
}

export function createUniverseTemplate({
  universeId,
  topologyBind,
  scaleContext,
  fusionCoreSet = [],
  relationFieldSchema = [],
  seedRuleset = {},
  closureCompatibility = {},
} = {}) {
  assertNonEmptyString(universeId, "universeId");
  assertSpineLegibility(topologyBind, "topologyBind");
  assertPlainObject(scaleContext, "scaleContext");
  assertArray(fusionCoreSet, "fusionCoreSet");
  assertArray(relationFieldSchema, "relationFieldSchema");
  assertPlainObject(seedRuleset, "seedRuleset");
  assertPlainObject(closureCompatibility, "closureCompatibility");

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "universe_template",
    universeId,
    topologyBind: cloneObject(topologyBind),
    scaleContext: cloneObject(scaleContext),
    fusionCoreSet: cloneObject(fusionCoreSet),
    relationFieldSchema: cloneObject(relationFieldSchema),
    seedRuleset: cloneObject(seedRuleset),
    closureCompatibility: cloneObject(closureCompatibility),
  });
}

export function createWorldEngine({
  worldId,
  universeId,
  macroEngineDependencies = [],
  regionSet = [],
  environmentRules = {},
  routeSpace = [],
  runtimeReadyFlag = false,
} = {}) {
  assertNonEmptyString(worldId, "worldId");
  assertNonEmptyString(universeId, "universeId");
  assertArray(macroEngineDependencies, "macroEngineDependencies");
  assert(
    macroEngineDependencies.length > 0,
    ScaleCollapseError,
    "World engines must depend on macro-engine inputs.",
    { worldId },
  );
  assertArray(regionSet, "regionSet");
  assertPlainObject(environmentRules, "environmentRules");
  assertArray(routeSpace, "routeSpace");

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "world_engine",
    worldId,
    universeId,
    macroEngineDependencies: cloneObject(macroEngineDependencies),
    regionSet: cloneObject(regionSet),
    environmentRules: cloneObject(environmentRules),
    routeSpace: cloneObject(routeSpace),
    runtimeReadyFlag: Boolean(runtimeReadyFlag),
  });
}

export function createPlanetEngine({
  planetId,
  worldId,
  bodyClass = "planet",
  engineDependencies = [],
  regionDependencies = [],
  seedStateBind = null,
  diagnosticCompatibility = {},
} = {}) {
  assertNonEmptyString(planetId, "planetId");
  assertNonEmptyString(worldId, "worldId");
  assertNonEmptyString(bodyClass, "bodyClass");
  assertArray(engineDependencies, "engineDependencies");
  assertArray(regionDependencies, "regionDependencies");
  assertPlainObject(diagnosticCompatibility, "diagnosticCompatibility");

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "planet_engine",
    planetId,
    worldId,
    bodyClass,
    engineDependencies: cloneObject(engineDependencies),
    regionDependencies: cloneObject(regionDependencies),
    seedStateBind: seedStateBind ? cloneObject(seedStateBind) : null,
    diagnosticCompatibility: cloneObject(diagnosticCompatibility),
  });
}

export function createBodyEngine({
  bodyId,
  planetId = null,
  bodyClass = "body",
  engineDependencies = [],
  relationFields = [],
} = {}) {
  assertNonEmptyString(bodyId, "bodyId");
  assertNonEmptyString(bodyClass, "bodyClass");
  assertArray(engineDependencies, "engineDependencies");
  assertArray(relationFields, "relationFields");

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "body_engine",
    bodyId,
    planetId,
    bodyClass,
    engineDependencies: cloneObject(engineDependencies),
    relationFields: cloneObject(relationFields),
  });
}

export function createRegionEngine({
  regionId,
  parentId,
  regionClass = "region",
  coordinate = null,
  adjacencySet = [],
} = {}) {
  assertNonEmptyString(regionId, "regionId");
  assertNonEmptyString(parentId, "parentId");
  assertNonEmptyString(regionClass, "regionClass");
  assertArray(adjacencySet, "adjacencySet");

  if (coordinate) {
    assertSpineLegibility(coordinate, "coordinate");
  }

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "region_engine",
    regionId,
    parentId,
    regionClass,
    coordinate: coordinate ? cloneObject(coordinate) : null,
    adjacencySet: cloneObject(adjacencySet),
  });
}

export function createEnvironmentEngine({
  environmentId,
  parentId,
  rules = {},
  diagnosticCompatibility = {},
} = {}) {
  assertNonEmptyString(environmentId, "environmentId");
  assertNonEmptyString(parentId, "parentId");
  assertPlainObject(rules, "rules");
  assertPlainObject(diagnosticCompatibility, "diagnosticCompatibility");

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "environment_engine",
    environmentId,
    parentId,
    rules: cloneObject(rules),
    diagnosticCompatibility: cloneObject(diagnosticCompatibility),
  });
}

export function createRelationField({
  fieldId,
  sourceObjects = [],
  targetObjects = [],
  adjacencySchema = [],
  pressureRules = {},
  transferRules = {},
} = {}) {
  assertNonEmptyString(fieldId, "fieldId");
  assertArray(sourceObjects, "sourceObjects");
  assertArray(targetObjects, "targetObjects");
  assertArray(adjacencySchema, "adjacencySchema");
  assertPlainObject(pressureRules, "pressureRules");
  assertPlainObject(transferRules, "transferRules");

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "relation_field",
    fieldId,
    sourceObjects: cloneObject(sourceObjects),
    targetObjects: cloneObject(targetObjects),
    adjacencySchema: cloneObject(adjacencySchema),
    pressureRules: cloneObject(pressureRules),
    transferRules: cloneObject(transferRules),
  });
}

export function createSeedState({
  seedId,
  targetClass,
  noteNodeBindSet = {},
  microstateSet = [],
  engineAttachments = [],
  flagPhaseBind = null,
  initialRouteRead = null,
} = {}) {
  assertNonEmptyString(seedId, "seedId");
  assertNonEmptyString(targetClass, "targetClass");
  assertPlainObject(noteNodeBindSet, "noteNodeBindSet");
  assertArray(microstateSet, "microstateSet");
  assertArray(engineAttachments, "engineAttachments");

  return Object.freeze({
    factoryNamespace: UNIVERSE_FACTORY_NAMESPACE,
    outputClass: "seed_state",
    seedId,
    targetClass,
    noteNodeBindSet: cloneObject(noteNodeBindSet),
    microstateSet: cloneObject(microstateSet),
    engineAttachments: cloneObject(engineAttachments),
    flagPhaseBind: flagPhaseBind ? cloneObject(flagPhaseBind) : null,
    initialRouteRead: initialRouteRead ? cloneObject(initialRouteRead) : null,
  });
}

export function assertUniverseFactoryOutput(output, { adapterBundle = null } = {}) {
  assertPlainObject(output, "output");
  assert(
    output.factoryNamespace === UNIVERSE_FACTORY_NAMESPACE,
    ParentBoundaryViolationError,
    "Output does not belong to universe_engine_factory_v1.",
    { output },
  );

  if (adapterBundle) {
    assertAdapterBundle(adapterBundle);
    assertScaleLadderIntegrity({
      notes: adapterBundle.notes ?? [],
      nodes: adapterBundle.nodes ?? [],
      microstates: adapterBundle.microstates ?? [],
      engines: adapterBundle.engines ?? [],
      macroEngines: adapterBundle.macroEngines ?? [],
    });
  }

  if ("geometryNamespace" in output && output.geometryNamespace !== undefined) {
    throw new PrivateGeometryError(
      "Universe factory outputs must not declare private geometry.",
      { output },
    );
  }

  const supportedClasses = new Set([
    "universe_template",
    "world_engine",
    "planet_engine",
    "body_engine",
    "region_engine",
    "environment_engine",
    "relation_field",
    "seed_state",
  ]);

  assert(
    supportedClasses.has(output.outputClass),
    ParentBoundaryViolationError,
    "Unsupported universe factory output class.",
    { outputClass: output.outputClass },
  );

  return true;
}
