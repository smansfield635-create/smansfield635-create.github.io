import {
  RECORD_SCHEMAS,
  assertContract,
  assertExactKeys,
  assertFiniteVector,
  deepFreeze,
  validateAdapterProjectionOutput,
  validateCameraRecord
} from "./compass.contracts.js";

export const NAVIGATION_EFFECT = Object.freeze({
  NONE: "NONE",
  LOCAL_RECEIPT: "LOCAL_RECEIPT",
  LOCATION_FRAGMENT: "LOCATION_FRAGMENT",
  HISTORY_PUSH: "HISTORY_PUSH",
  LOCATION_ASSIGN: "LOCATION_ASSIGN",
  EXTERNAL: "EXTERNAL"
});

const LOCAL_EFFECTS = Object.freeze([
  NAVIGATION_EFFECT.NONE,
  NAVIGATION_EFFECT.LOCAL_RECEIPT
]);

function stableDigest(value) {
  return JSON.stringify(value);
}

function validateProjectionInput(input) {
  assertExactKeys(
    input,
    RECORD_SCHEMAS.ADAPTER_PROJECTION_INPUT,
    "COMPASS_ADAPTER_PROJECTION_INPUT_KEYS_INVALID"
  );
  assertContract(
    typeof input.nodeId === "string" && input.nodeId.length > 0,
    "COMPASS_ADAPTER_PROJECTION_NODE_ID_INVALID"
  );
  assertContract(
    Number.isInteger(input.worldRevision) && input.worldRevision >= 0,
    "COMPASS_ADAPTER_PROJECTION_WORLD_REVISION_INVALID"
  );
  assertFiniteVector(
    input.worldPosition,
    3,
    "COMPASS_ADAPTER_PROJECTION_WORLD_POSITION_INVALID"
  );
  validateCameraRecord(input.camera);
  return deepFreeze(structuredClone(input));
}

function validateRouteMap(routes) {
  assertContract(
    routes !== null &&
      typeof routes === "object" &&
      !Array.isArray(routes),
    "COMPASS_ROUTE_MAP_INVALID"
  );

  const admitted = {};
  Object.entries(routes).forEach(([key, route]) => {
    assertContract(
      typeof key === "string" && key.length > 0,
      "COMPASS_ROUTE_KEY_INVALID"
    );
    assertContract(route !== undefined && route !== null, "COMPASS_ROUTE_INVALID", key);
    admitted[key] = structuredClone(route);
  });
  return deepFreeze(admitted);
}

export function createAdapters({
  routes = {},
  navigate,
  projectWorldPoint,
  renderFrame,
  semanticPublisher = null,
  navigationEffect = NAVIGATION_EFFECT.LOCAL_RECEIPT,
  rollbackNavigation = null,
  ownsResources = false,
  disposeResources = null
}) {
  assertContract(
    typeof navigate === "function",
    "COMPASS_NAVIGATE_ADAPTER_REQUIRED"
  );
  assertContract(
    typeof projectWorldPoint === "function",
    "COMPASS_PROJECT_ADAPTER_REQUIRED"
  );
  assertContract(
    typeof renderFrame === "function",
    "COMPASS_RENDER_ADAPTER_REQUIRED"
  );
  assertContract(
    semanticPublisher === null || typeof semanticPublisher === "function",
    "COMPASS_SEMANTIC_PUBLISHER_INVALID"
  );
  assertContract(
    Object.values(NAVIGATION_EFFECT).includes(navigationEffect),
    "COMPASS_NAVIGATION_EFFECT_INVALID",
    navigationEffect
  );
  assertContract(
    LOCAL_EFFECTS.includes(navigationEffect) ||
      typeof rollbackNavigation === "function",
    "COMPASS_NAVIGATION_ROLLBACK_REQUIRED",
    navigationEffect
  );
  assertContract(
    !ownsResources || typeof disposeResources === "function",
    "COMPASS_RESOURCE_DISPOSAL_REQUIRED"
  );

  const routeMap = validateRouteMap(routes);
  const admittedRoutes = new Set(Object.values(routeMap));
  let disposed = false;
  let lastNavigationReceipt = null;
  let lastRenderedSnapshot = null;
  let lastSemanticSnapshot = null;

  function requireActive() {
    assertContract(!disposed, "COMPASS_ADAPTERS_DISPOSED");
  }

  function resolveRoute(key) {
    requireActive();
    return Object.prototype.hasOwnProperty.call(routeMap, key)
      ? routeMap[key]
      : null;
  }

  function project(input) {
    requireActive();
    const admittedInput = validateProjectionInput(input);
    const inputDigest = stableDigest(admittedInput);
    const output = projectWorldPoint(admittedInput);
    assertContract(
      stableDigest(admittedInput) === inputDigest,
      "COMPASS_PROJECT_ADAPTER_MUTATED_INPUT"
    );
    return validateAdapterProjectionOutput(output, admittedInput);
  }

  function render(snapshot) {
    requireActive();
    assertContract(
      snapshot !== null && typeof snapshot === "object",
      "COMPASS_RENDER_SNAPSHOT_REQUIRED"
    );
    deepFreeze(snapshot);
    const before = stableDigest(snapshot);
    const result = renderFrame(snapshot);
    assertContract(
      stableDigest(snapshot) === before,
      "COMPASS_RENDER_ADAPTER_MUTATED_SNAPSHOT"
    );
    lastRenderedSnapshot = snapshot;
    return result;
  }

  function publishSemantic(snapshot) {
    requireActive();
    assertContract(
      snapshot !== null && typeof snapshot === "object",
      "COMPASS_SEMANTIC_SNAPSHOT_REQUIRED"
    );
    deepFreeze(snapshot);
    const before = stableDigest(snapshot);
    const result = semanticPublisher
      ? semanticPublisher(snapshot)
      : snapshot;
    assertContract(
      stableDigest(snapshot) === before,
      "COMPASS_SEMANTIC_ADAPTER_MUTATED_SNAPSHOT"
    );
    lastSemanticSnapshot = snapshot;
    return result;
  }

  function navigateRoute(route) {
    requireActive();
    assertContract(
      admittedRoutes.has(route),
      "COMPASS_NAVIGATION_ROUTE_NOT_ADMITTED"
    );
    const result = navigate(route);
    lastNavigationReceipt = deepFreeze({
      schema: "UNIVERSAL_COMPASS_NAVIGATION_RECEIPT_v1",
      effect: navigationEffect,
      route: structuredClone(route),
      result: result === undefined ? null : structuredClone(result),
      reversible:
        LOCAL_EFFECTS.includes(navigationEffect) ||
        typeof rollbackNavigation === "function"
    });
    return lastNavigationReceipt;
  }

  function rollback() {
    requireActive();
    assertContract(
      lastNavigationReceipt,
      "COMPASS_NAVIGATION_ROLLBACK_WITHOUT_RECEIPT"
    );
    if (LOCAL_EFFECTS.includes(navigationEffect)) {
      const receipt = lastNavigationReceipt;
      lastNavigationReceipt = null;
      return deepFreeze({
        rolledBack: true,
        effect: navigationEffect,
        sourceReceipt: receipt
      });
    }
    const result = rollbackNavigation(lastNavigationReceipt);
    lastNavigationReceipt = null;
    return result;
  }

  function dispose() {
    if (disposed) {
      return deepFreeze({ disposed: true, repeated: true });
    }
    if (ownsResources) {
      disposeResources();
    }
    disposed = true;
    lastRenderedSnapshot = null;
    lastSemanticSnapshot = null;
    lastNavigationReceipt = null;
    return deepFreeze({ disposed: true, repeated: false });
  }

  return Object.freeze({
    resolveRoute,
    navigate: navigateRoute,
    projectWorldPoint: project,
    renderFrame: render,
    publishSemantic,
    rollbackNavigation: rollback,
    dispose,
    getLastNavigationReceipt: () => lastNavigationReceipt,
    getLastRenderedSnapshot: () => lastRenderedSnapshot,
    getLastSemanticSnapshot: () => lastSemanticSnapshot,
    receipt() {
      return deepFreeze({
        schema: "UNIVERSAL_COMPASS_ADAPTER_RECEIPT_v2",
        routeCount: Object.keys(routeMap).length,
        navigationEffect,
        reversible:
          LOCAL_EFFECTS.includes(navigationEffect) ||
          typeof rollbackNavigation === "function",
        ownsResources: Boolean(ownsResources),
        disposalDeclared:
          !ownsResources || typeof disposeResources === "function",
        ownsPageIdentity: false,
        ownsProductionRoutes: false,
        disposed
      });
    }
  });
}
