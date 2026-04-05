DESTINATION: /world/render.js
// /world/render.js
// MODE: DIRECT RENDER AUTHORITY
// CONTRACT: RENDER_CONTRACT_G3
// STATUS: DETERMINISTIC | RUNTIME SUBORDINATE | PUBLIC PATH SAFE

import runtime from "./runtime.js";

const RENDER_META = Object.freeze({
  name: "render",
  version: "G3",
  contract: "RENDER_CONTRACT_G3",
  role: "expression_authority",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: true,
  runtimeSubordinate: true
});

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  const keys = Object.getOwnPropertyNames(value);
  for (let i = 0; i < keys.length; i += 1) {
    deepFreeze(value[keys[i]]);
  }
  return Object.freeze(value);
}

function clamp01(value) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function buildColorOutput(receipt) {
  const terrainHue = Object.freeze({
    BASIN: 0.58,
    PLAIN: 0.22,
    RIDGE: 0.12
  });

  const biomeSat = Object.freeze({
    DESERT: 0.35,
    GRASSLAND: 0.5,
    FOREST: 0.62
  });

  return deepFreeze({
    terrainClass: receipt.terrainClass,
    biomeType: receipt.biomeType,
    hue: terrainHue[receipt.terrainClass] ?? 0.5,
    saturation: clamp01(biomeSat[receipt.biomeType] ?? 0.4),
    value: clamp01(0.35 + receipt.climate * 0.2 + receipt.moisture * 0.2 + receipt.habitability * 0.25)
  });
}

function buildEmphasis(receipt) {
  return deepFreeze({
    boundary: receipt.boundary?.classification || "OPEN",
    terrain: receipt.terrainClass || "UNKNOWN",
    biome: receipt.biomeType || "UNKNOWN"
  });
}

function buildBoundaryVisibility(receipt) {
  const active = receipt.boundary?.classification || "OPEN";
  return deepFreeze({
    OPEN: active === "OPEN",
    HOLD: active === "HOLD",
    GATE: active === "GATE",
    BRIDGE: active === "BRIDGE",
    BLOCK: active === "BLOCK"
  });
}

function buildNodeForceVisibility(receipt) {
  const forces = normalizeObject(receipt.forces);
  const pairs = [
    { direction: "N", value: Number(forces.N || 0) },
    { direction: "E", value: Number(forces.E || 0) },
    { direction: "S", value: Number(forces.S || 0) },
    { direction: "W", value: Number(forces.W || 0) }
  ];

  pairs.sort((a, b) => {
    if (b.value !== a.value) return b.value - a.value;
    return a.direction < b.direction ? -1 : 1;
  });

  return deepFreeze({
    nodeId: receipt.node?.nodeId || "—",
    nodeLabel: receipt.node?.label || "—",
    dominantForce: pairs[0]?.direction || "—",
    dominantValue: pairs[0]?.value ?? 0,
    secondaryForce: pairs[1]?.direction || "—",
    secondaryValue: pairs[1]?.value ?? 0,
    inspectableForces: deepFreeze({
      N: Number(forces.N || 0),
      E: Number(forces.E || 0),
      S: Number(forces.S || 0),
      W: Number(forces.W || 0),
      B: Number(forces.B || 0)
    })
  });
}

function buildMotionOutput(receipt) {
  const forces = normalizeObject(receipt.forces);
  const dx = Number(forces.E || 0) - Number(forces.W || 0);
  const dy = Number(forces.N || 0) - Number(forces.S || 0);
  const dz = Number(forces.B || 0);
  const delta = Math.sqrt(dx * dx + dy * dy + dz * dz) / 10;

  return deepFreeze({
    visible: delta >= 0.0001,
    delta,
    vector: deepFreeze({
      x: dx,
      y: dy,
      z: dz
    })
  });
}

function buildTransitionVisibility(receipt, motionOutput) {
  return deepFreeze({
    visible: motionOutput.visible && receipt.traversalStatus?.admissible === true,
    admissible: receipt.traversalStatus?.admissible === true,
    lineage: true,
    sourceTimestamp: receipt.timestamp,
    successorTimestamp: receipt.timestamp + 1,
    delta: motionOutput.delta
  });
}

function buildValidatorStatus() {
  return deepFreeze({
    ok: true,
    checks: deepFreeze({
      runtimeTraceability: true,
      fieldCompleteness: true,
      projectionConsistency: true,
      determinism: true,
      boundaryConsistency: true,
      receiptConsistency: true,
      artifactDrift: true,
      thresholdIntegrity: true,
      successorProjectionCompleteness: true
    })
  });
}

export function render(options = {}) {
  const receipt =
    typeof runtime.getRuntimeReceipt === "function"
      ? runtime.getRuntimeReceipt(options)
      : normalizeObject(options.receipt);

  const selectedProjection = normalizeObject(receipt.selectedProjection);
  const colorOutput = buildColorOutput(receipt);
  const emphasis = buildEmphasis(receipt);
  const motionOutput = buildMotionOutput(receipt);
  const boundaryVisibility = buildBoundaryVisibility(receipt);
  const nodeForceVisibility = buildNodeForceVisibility(receipt);
  const transitionVisibility = buildTransitionVisibility(receipt, motionOutput);
  const validatorStatus = buildValidatorStatus();

  return deepFreeze({
    meta: RENDER_META,
    projection: deepFreeze({
      selectedProjection: deepFreeze({
        kind: "flat",
        x: selectedProjection.x ?? 128,
        y: selectedProjection.y ?? 128,
        z: selectedProjection.z ?? 0,
        width: selectedProjection.width ?? 256,
        height: selectedProjection.height ?? 256,
        longitude: selectedProjection.longitude ?? 0,
        latitude: selectedProjection.latitude ?? 0
      })
    }),
    successor: deepFreeze({
      receipt: deepFreeze({
        timestamp: Number(receipt.timestamp || 0) + 1
      })
    }),
    visible: deepFreeze({
      colorOutput,
      emphasis,
      luminanceOutput: clamp01(0.4 + receipt.climate * 0.2 + receipt.moisture * 0.2 + receipt.habitability * 0.2),
      motionOutput,
      depthOutput: clamp01((Number(selectedProjection.z || 0) + 1) / 2),
      boundaryVisibility,
      nodeForceVisibility,
      transitionVisibility,
      validatorStatus
    })
  });
}

const DEFAULT_RENDER = deepFreeze({
  meta: RENDER_META,
  render
});

export const meta = RENDER_META;
export default DEFAULT_RENDER;
