import { sha256Hex, stableJson } from "./math.mjs";

export const STATES = Object.freeze([
  "LANE_READY",
  "RECORD_SELECTED",
  "LENS_SELECTED",
  "SUBTAB_SELECTED",
  "TERM_SELECTED",
  "TRANSITIONING",
  "RETURNING",
  "HELD"
]);

export const STABLE_FIELDS = Object.freeze([
  "activeLane",
  "activeRecord",
  "activeLens",
  "activeSubtab",
  "activeTerm",
  "recordScrollPosition",
  "priorFocusTarget",
  "reducedMotion",
  "contentVersion"
]);

export const RETURN_FIELDS = Object.freeze([
  "activeRecord",
  "activeLens",
  "activeSubtab",
  "activeTerm",
  "recordScrollPosition",
  "priorFocusTarget"
]);

export function createInitialState(data) {
  return {
    phase: "LANE_READY",
    activeLane: data.lane.id,
    activeRecord: data.lane.defaultRecord,
    activeLens: data.lane.defaultLens,
    activeSubtab: null,
    activeTerm: null,
    recordScrollPosition: 0,
    priorFocusTarget: null,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    contentVersion: data.contentVersion,
    sourceVersion: data.sourceVersion,
    returnStack: []
  };
}

export function snapshotState(state) {
  return Object.fromEntries(STABLE_FIELDS.map((field) => [field, state[field]]));
}

export async function createReturnEnvelope(state) {
  const snapshot = snapshotState(state);
  return {
    schema: "METHODS_CHECKPOINT_4_RETURN_ENVELOPE_v1",
    contentVersion: state.contentVersion,
    sourceVersion: state.sourceVersion,
    snapshot,
    sha256: await sha256Hex(stableJson(snapshot))
  };
}

export async function verifyReturnEnvelope(envelope, state) {
  if (!envelope || envelope.schema !== "METHODS_CHECKPOINT_4_RETURN_ENVELOPE_v1") return false;
  if (envelope.contentVersion !== state.contentVersion) return false;
  if (envelope.sourceVersion !== state.sourceVersion) return false;
  return envelope.sha256 === await sha256Hex(stableJson(envelope.snapshot));
}

export async function pushReturnPoint(state, focusTarget) {
  const next = structuredClone(state);
  next.recordScrollPosition = window.scrollY;
  next.priorFocusTarget = focusTarget?.id || null;
  next.returnStack.push(await createReturnEnvelope(next));
  return next;
}

export async function restoreReturnPoint(state) {
  if (state.returnStack.length === 0) return state;
  const next = structuredClone(state);
  const envelope = next.returnStack.pop();
  if (!(await verifyReturnEnvelope(envelope, next))) {
    next.phase = "HELD";
    return next;
  }
  Object.assign(next, envelope.snapshot);
  next.phase = next.activeSubtab ? "SUBTAB_SELECTED" : next.activeLens ? "LENS_SELECTED" : "RECORD_SELECTED";
  return next;
}

export function selectRecord(state, recordId) {
  return {
    ...state,
    phase: "RECORD_SELECTED",
    activeRecord: recordId,
    activeLens: "practical",
    activeSubtab: null,
    activeTerm: null
  };
}

export function selectLens(state, lensId) {
  return {
    ...state,
    phase: "LENS_SELECTED",
    activeLens: lensId,
    activeSubtab: null,
    activeTerm: null
  };
}

export function selectSubtab(state, subtabId) {
  return {
    ...state,
    phase: "SUBTAB_SELECTED",
    activeSubtab: subtabId,
    activeTerm: null
  };
}

export function selectTerm(state, termId) {
  return {
    ...state,
    phase: "TERM_SELECTED",
    activeTerm: termId
  };
}
