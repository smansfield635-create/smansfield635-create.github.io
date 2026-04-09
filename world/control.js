import { createWorldKernel } from "./world_kernel.js";
import { getPlanetEngineReceipt } from "./planet_engine.js";
import { render } from "./render.js";

const CONTROL_META = Object.freeze({
  name: "CONTROL",
  version: "G1_EXTERNAL_BASELINE",
  role: "interaction_and_motion_governance",
  contract: "CONTROL_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

const KERNEL = createWorldKernel();

export function getControlReceipt(options = {}) {
  const hostRead = KERNEL.getHostRead();
  const planetReceipt = getPlanetEngineReceipt(options);
  const renderPacket = render(options);

  return deepFreeze({
    meta: CONTROL_META,
    verification: {
      pass: true,
      deterministic: true
    },
    hostEntry: hostRead.publicEntry,
    house: hostRead.house,
    roomCount: hostRead.roomCount,
    descendantOrder: ["render", "control", "index", "explore", "products"],
    publicTraversal: {
      houseFirst: true,
      metaverseRequired: false,
      roomsVisible: true,
      programmableRooms: true
    },
    runtimeLaw: {
      localRuntimeAllowedForDistinctSpines: true,
      globalHostTruthRequired: true,
      signalSubordinateToGeometry: true
    },
    controlState: {
      phase: "READY",
      admissible: true,
      activeSurface: "external_expression",
      projection: planetReceipt.projection.kind,
      motionVisible: renderPacket.visible.motionOutput.visible
    }
  });
}

export function getControlPlan(options = {}) {
  const receipt = getControlReceipt(options);

  return deepFreeze({
    meta: CONTROL_META,
    intent: "governed_external_expression",
    entry: receipt.hostEntry,
    next: receipt.descendantOrder,
    state: receipt.controlState
  });
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach(function eachKey(key) {
    deepFreeze(value[key]);
  });
  return Object.freeze(value);
}
