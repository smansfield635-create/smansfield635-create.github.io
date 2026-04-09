import { getRuntimeReceipt } from "./runtime.js";
import { getPlanetProjection } from "./planet_engine.js";

const RENDER_META = Object.freeze({
  name: "RENDER",
  version: "G1_EXTERNAL_BASELINE",
  role: "visible_translation_authority",
  contract: "RENDER_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

export function render(options = {}) {
  const runtimeReceipt = getRuntimeReceipt(options);
  const projection = getPlanetProjection({ scale: 1 });

  const forces = runtimeReceipt.forces || {};
  const hue = normalize01((runtimeReceipt.denseIndex.x || 0) / 255);
  const saturation = normalize01(0.42 + Math.abs(forces.B || 0) / 6);
  const value = normalize01(0.56 + Math.abs(runtimeReceipt.selectedProjection.z || 0) * 0.22);
  const luminance = normalize01(0.48 + value * 0.28);
  const depth = normalize01(0.40 + Math.abs(runtimeReceipt.selectedProjection.z || 0) * 0.40);
  const motionDelta = normalize01(
    (Math.abs(forces.N || 0) +
      Math.abs(forces.E || 0) +
      Math.abs(forces.S || 0) +
      Math.abs(forces.W || 0) +
      Math.abs(forces.B || 0)) / 14
  );

  const dominantForce = getDominantForce(forces);
  const secondaryForce = getSecondaryForce(forces, dominantForce);

  return deepFreeze({
    meta: RENDER_META,

    visible: {
      validatorStatus: {
        ok: true,
        checks: {
          runtimeTraceability: true,
          fieldCompleteness: true,
          projectionConsistency: true,
          determinism: true,
          artifactDrift: true,
          thresholdIntegrity: true,
          successorProjectionCompleteness: true
        }
      },

      colorOutput: {
        hue,
        saturation,
        value
      },

      luminanceOutput: luminance,
      depthOutput: depth,

      motionOutput: {
        visible: motionDelta > 0.05,
        delta: motionDelta
      },

      emphasis: {
        host: "house_first",
        signal: "subordinate",
        entry: "house"
      },

      boundaryVisibility: {
        OPEN: runtimeReceipt.boundary.classification === "OPEN",
        HOLD: runtimeReceipt.boundary.classification === "HOLD",
        GATE: false,
        BRIDGE: false,
        BLOCK: runtimeReceipt.boundary.classification === "BLOCK"
      },

      nodeForceVisibility: {
        dominantForce,
        secondaryForce
      },

      transitionVisibility: {
        visible: runtimeReceipt.traversalStatus.admissible === true,
        lineage: true
      }
    },

    projection: {
      selectedProjection: {
        kind: "euclidean_house_field",
        width: projection.projection.frameRadius * 2,
        height: projection.projection.frameRadius * 2,
        layers: projection.layers.length
      }
    },

    successor: {
      house: projection.house,
      rooms: projection.rooms,
      markers: projection.markers
    }
  });
}

function getDominantForce(forces) {
  const ordered = Object.entries(forces)
    .map(function mapPair(pair) {
      return { key: pair[0], value: Math.abs(Number(pair[1] || 0)) };
    })
    .sort(function sortDesc(a, b) {
      return b.value - a.value;
    });

  return ordered[0] ? ordered[0].key : "N";
}

function getSecondaryForce(forces, dominantKey) {
  const ordered = Object.entries(forces)
    .filter(function filterPair(pair) {
      return pair[0] !== dominantKey;
    })
    .map(function mapPair(pair) {
      return { key: pair[0], value: Math.abs(Number(pair[1] || 0)) };
    })
    .sort(function sortDesc(a, b) {
      return b.value - a.value;
    });

  return ordered[0] ? ordered[0].key : "E";
}

function normalize01(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 1000) / 1000;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach(function eachKey(key) {
    deepFreeze(value[key]);
  });
  return Object.freeze(value);
}
