import { assertContract, freezeRecord } from "./compass.contracts.js";
import { normalize3 } from "./compass.math.js";

export function createNodeRegistry(nodeDefinitions) {
  assertContract(Array.isArray(nodeDefinitions) && nodeDefinitions.length > 0, "COMPASS_NODE_DEFINITIONS_REQUIRED");
  const ids = new Set();
  const records = nodeDefinitions.map((definition, index) => {
    assertContract(definition.id && !ids.has(definition.id), "COMPASS_NODE_ID_INVALID", definition.id);
    ids.add(definition.id);
    return freezeRecord({
      index,
      id: definition.id,
      kind: definition.kind,
      domain: definition.domain || "",
      routeKey: definition.routeKey || "",
      presentation: definition.presentation,
      baseVector: Object.freeze(normalize3(definition.baseVector)),
      semantic: freezeRecord(definition.semantic || {})
    });
  });
  const byId = new Map(records.map(record => [record.id, record]));
  return Object.freeze({
    all: () => Object.freeze(records.slice()),
    get: id => byId.get(id) || null,
    forPresentation: presentation => Object.freeze(records.filter(record => record.presentation === presentation)),
    has: id => byId.has(id)
  });
}
