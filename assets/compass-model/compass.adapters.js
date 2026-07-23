import { assertContract } from "./compass.contracts.js";

export function createAdapters({
  routes = {},
  navigate,
  projectWorldPoint,
  renderFrame,
  semanticPublisher = null
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

  const routeMap = Object.freeze({ ...routes });

  return Object.freeze({
    resolveRoute: key => routeMap[key] || null,
    navigate,
    projectWorldPoint,
    renderFrame,
    publishSemantic(snapshot) {
      return semanticPublisher
        ? semanticPublisher(snapshot)
        : snapshot;
    },
    receipt() {
      return Object.freeze({
        routeCount: Object.keys(routeMap).length,
        reversible: true,
        ownsPageIdentity: false,
        ownsProductionRoutes: false
      });
    }
  });
}
