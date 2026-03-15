import { WORLD_KERNEL } from "./world_kernel.js";

function normalizeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function isLegalDepthTransition(from, to) {
  const order = WORLD_KERNEL.depthOrder;
  const a = order.indexOf(from);
  const b = order.indexOf(to);
  if (a === -1 || b === -1) return false;
  return Math.abs(a - b) <= 1;
}

function freezePlanetField(field) {
  return Object.freeze({
    terrainField: field.terrainField,
    topologyField: field.topologyField,
    thermodynamicField: field.thermodynamicField,
    hydrologyField: field.hydrologyField,
    magneticField: field.magneticField
  });
}

export function createCosmicEngineSpine() {
  function getNextLegalDepth(current) {
    const order = WORLD_KERNEL.depthOrder;
    const idx = order.indexOf(current);
    if (idx === -1) return current;
    return order[Math.min(idx + 1, order.length - 1)];
  }

  function resolveWorldState(input = {}) {
    const data = normalizeObject(input);

    const currentDepth = data.currentDepth || "galaxy";
    const activeDepth = data.activeDepth || "harbor";
    const selection = normalizeObject(data.selection);

    const row = Number.isInteger(selection.row) ? selection.row : 1;
    const col = Number.isInteger(selection.col) ? selection.col : 1;
    const cellIndex = row * 4 + col;
    const zone = selection.zone || "local_zone_alpha";
    const cellId = WORLD_KERNEL.localGrid.cellIds[cellIndex] || "R1C1";

    return Object.freeze({
      activeScale: WORLD_KERNEL.naming.activeScale,
      activeDepth,
      transition: Object.freeze({
        from: currentDepth,
        to: activeDepth,
        legal: isLegalDepthTransition(currentDepth, activeDepth)
      }),
      region: Object.freeze({
        id: `external_${activeDepth}_baseline`,
        displayName: `External ${activeDepth}`
      }),
      auditLabels: Object.freeze({
        branch: "external.harbor"
      }),
      branches: Object.freeze({
        harbor: Object.freeze({
          gratitude: WORLD_KERNEL.branches.harbor.gratitude,
          generosity: WORLD_KERNEL.branches.harbor.generosity,
          corePremise: Object.freeze({
            label: "harbor_exchange_state",
            premise: WORLD_KERNEL.branches.harbor.recombination
          })
        })
      }),
      localSelection: Object.freeze({
        zone,
        row,
        col,
        cellIndex,
        cellId
      }),
      gridBound: WORLD_KERNEL.depthToGridBinding[activeDepth] === true,
      activeDepthLabel: activeDepth
    });
  }

  function evaluateExecutionGate(canon, input = {}) {
    const req = normalizeObject(input);

    const current = req.currentDepth || "galaxy";
    const requested = req.requestedDepth || "harbor";

    const legal = isLegalDepthTransition(current, requested);

    return Object.freeze({
      allow: legal,
      mode: "runtime_execution",
      blocked_by: legal ? [] : ["SCALE_TRANSITION_GATE"],
      reasons: legal ? [] : ["illegal_depth_jump"],
      canon_verdict: canon,
      next_authorized_action: legal ? "continue_execution" : "correct_canonical_structure"
    });
  }

  function assemblePlanetField(input = {}) {
    const data = normalizeObject(input);

    const order = WORLD_KERNEL.planetField.order;
    const terrainField = data.terrainField ?? null;
    const topologyField = data.topologyField ?? null;
    const thermodynamicField = data.thermodynamicField ?? null;
    const hydrologyField = data.hydrologyField ?? null;
    const magneticField = data.magneticField ?? null;

    const completeness = Object.freeze({
      terrainField: !!terrainField,
      topologyField: !!topologyField,
      thermodynamicField: !!thermodynamicField,
      hydrologyField: !!hydrologyField,
      magneticField: !!magneticField
    });

    return Object.freeze({
      label: WORLD_KERNEL.naming.planetFieldLabel,
      order,
      completeness,
      ...freezePlanetField({
        terrainField,
        topologyField,
        thermodynamicField,
        hydrologyField,
        magneticField
      })
    });
  }

  return Object.freeze({
    resolveWorldState,
    evaluateExecutionGate,
    getNextLegalDepth,
    assemblePlanetField
  });
}
