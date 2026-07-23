export const COMPASS_MODEL_CONTRACT = Object.freeze({
  id: "DGB_UNIVERSAL_COMPASS_MODEL_CANDIDATE_v1",
  status: "CANDIDATE_NOT_ADMITTED",
  sourceFamilies: Object.freeze(["MAIN_COMPASS", "LAW_COMPASS", "SHOWROOM_COMPASS", "ARCHCOIN_COMPASS"]),
  templateCompass: null,
  sourceFamilyPrecedence: null,
  productionAuthorized: false,
  liveRebuildAuthorized: false
});

export const AUTHORITY = Object.freeze({
  WORLD: "WORLD",
  NODES: "NODES",
  COMPOSITOR: "COMPOSITOR",
  CONTROLLER: "CONTROLLER",
  INTERACTIONS: "INTERACTIONS",
  PROFILE: "PROFILE",
  ADAPTER: "ADAPTER",
  VALIDATION: "VALIDATION"
});

export const PRESENTATION = Object.freeze({ CONSTELLATION: "CONSTELLATION", CLUSTER: "CLUSTER", HELD: "HELD" });
export const ORIENTATION_PHASE = Object.freeze({ IDLE: "IDLE", PREVIEW: "PREVIEW", COMMITTED: "COMMITTED", CANCELLED: "CANCELLED" });
export const TRANSACTION_PHASE = Object.freeze({ ORIENTATION: "ORIENTATION", SELECTION: "SELECTION", PREVIEW: "PREVIEW", CONFIRMATION: "CONFIRMATION", SETTLEMENT: "SETTLEMENT", ROUTE_COMMIT: "ROUTE_COMMIT", CANCELLED: "CANCELLED" });
export const DEPTH_LAYER = Object.freeze({ REAR: "REAR", CENTER: "CENTER", FRONT: "FRONT", UNKNOWN: "UNKNOWN" });
export const POINTER_KIND = Object.freeze({ MOUSE: "mouse", TOUCH: "touch", PEN: "pen", KEYBOARD: "keyboard" });

export const REQUIRED_INVARIANTS = Object.freeze([
  "AUTHORITY_SEPARATION",
  "INTERFACE_COMPLETENESS",
  "TRANSACTION_DETERMINISM",
  "PROFILE_ISOLATION",
  "PAGE_IDENTITY_EXCLUSION",
  "WORLD_PROJECTION_CONSISTENCY",
  "VISUAL_SEMANTIC_ALIGNMENT",
  "POINTER_AND_DEVICE_BEHAVIOR",
  "INTERRUPTION_RECOVERY",
  "REDUCED_MOTION_FUNCTIONALITY",
  "OPTIONAL_PARTICIPANT_ISOLATION",
  "ADAPTER_REVERSIBILITY",
  "BASELINE_MIGRATION_SAFETY"
]);

export function freezeRecord(record) {
  return Object.freeze({ ...record });
}

export function assertContract(condition, code, details = null) {
  if (condition) return;
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}
