const WORLD_KERNEL_META = Object.freeze({
  name: "WORLD_KERNEL",
  version: "G2_SOLAR_TEMPLATE_BASELINE",
  role: "shared_substrate_authority",
  contract: "WORLD_KERNEL_CONTRACT_G2_SOLAR_TEMPLATE",
  status: "ACTIVE",
  deterministic: true
});

const HOST_READ = Object.freeze({
  publicEntry: "richie_richs_manor",
  house: "diamond_gate_bridge",
  roomCount: 9,
  animationContext: "demo_template_universe",
  structureAuthority: "html",
  motionAuthority: "js",
  substrateAuthority: "shared_runtime"
});

const DESCENDANT_ORDER = Object.freeze([
  "world_kernel",
  "planet_engine",
  "world_runtime",
  "render",
  "control",
  "index"
]);

const BASELINE_RULES = Object.freeze({
  htmlOwnsStructureAndRouteSafety: true,
  jsOwnsMotionAndOrchestrationOnly: true,
  sharedKernelEngineRuntimeOwnBehaviorBeneathPages: true,
  publicFacingKeyPagesMustNotExposePendingPlaceholders: true,
  pagesWithAnimationRequireDedicatedChambers: true,
  motionMustBeBoundedEuclideanAndNonDecorative: true,
  movingObjectsMustBeCompressedReadableAndMobileSafe: true,
  labelsMustRemainReadableDuringMotion: true,
  noRenewedPageMayRemainOnOlderContract: true
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createKernelReceipt() {
  return deepFreeze({
    meta: WORLD_KERNEL_META,
    verification: {
      pass: true,
      deterministic: true,
      baselineLocked: true
    },
    hostRead: HOST_READ,
    descendantOrder: DESCENDANT_ORDER,
    baselineRules: BASELINE_RULES,
    executionState: {
      phase: "SHARED_SUBSTRATE_BASELINE",
      admissible: true,
      canonicalScene: "FULL_NINE_PLANET_SOLAR_TEMPLATE",
      centerBody: "sun",
      includePluto: true
    }
  });
}

export function createWorldKernel() {
  const receipt = createKernelReceipt();

  return deepFreeze({
    meta: WORLD_KERNEL_META,

    getMeta() {
      return WORLD_KERNEL_META;
    },

    getHostRead() {
      return HOST_READ;
    },

    getDescendantOrder() {
      return DESCENDANT_ORDER;
    },

    getBaselineRules() {
      return BASELINE_RULES;
    },

    getKernelReceipt() {
      return receipt;
    },

    toJSON() {
      return clone(receipt);
    }
  });
}

export function getWorldKernelReceipt() {
  return createKernelReceipt();
}

export default deepFreeze({
  meta: WORLD_KERNEL_META,
  createWorldKernel,
  getWorldKernelReceipt
});
