import { WORLD_KERNEL, getDepthById, isGridBoundDepth } from "./world_kernel.js";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeInteger(value, fallback = 0) {
  return Number.isInteger(value) ? value : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makeScaleNode(id, displayName, depth, upstreamId = null) {
  return Object.freeze({
    id,
    displayName,
    depth,
    upstreamId
  });
}

function resolveDepthNodes() {
  const cosmic = makeScaleNode("cosmic", "Cosmic", 0, null);
  const region = makeScaleNode("region", "Region", 1, cosmic.id);
  const galaxy = makeScaleNode("galaxy", "Galaxy", 2, region.id);
  const system = makeScaleNode("system", "System", 3, galaxy.id);
  const planet = makeScaleNode("planet", "Planet", 4, system.id);
  const macroSurface = makeScaleNode("macro_surface", "Macro Surface", 5, planet.id);
  const regionalSurface = makeScaleNode("regional_surface", "Regional Surface", 6, macroSurface.id);
  const localZone = makeScaleNode("local_zone", "Local Zone", 7, regionalSurface.id);
  const siteCell = makeScaleNode("site_cell", "Site Cell", 8, localZone.id);
  const microCell = makeScaleNode("micro_cell", "Micro Cell", 9, siteCell.id);

  return Object.freeze({
    cosmic,
    region,
    galaxy,
    system,
    planet,
    macroSurface,
    regionalSurface,
    localZone,
    siteCell,
    microCell
  });
}

function splitHarborGratitude() {
  const source = WORLD_KERNEL.branches.harbor.gratitude;

  return Object.freeze({
    north: source.north,
    south: source.south,
    east: source.east,
    west: source.west,
    conclusion: source.recombination
  });
}

function splitHarborGenerosity() {
  const source = WORLD_KERNEL.branches.harbor.generosity;

  return Object.freeze({
    north: source.north,
    south: source.south,
    east: source.east,
    west: source.west,
    conclusion: source.recombination
  });
}

function recombineBranch(label, splitState) {
  return Object.freeze({
    label,
    conclusion: splitState.conclusion,
    north: splitState.north,
    south: splitState.south,
    east: splitState.east,
    west: splitState.west
  });
}

function resolveHarborExchange(gratitude, generosity) {
  return Object.freeze({
    label: "harbor_exchange_state",
    premise: WORLD_KERNEL.branches.harbor.recombination,
    gratitudeConclusion: gratitude.conclusion,
    generosityConclusion: generosity.conclusion
  });
}

function concludeNodeState(gratitude, generosity, exchange) {
  return Object.freeze({
    node: "harbor",
    status: "coherent",
    gratitudeConclusion: gratitude.conclusion,
    generosityConclusion: generosity.conclusion,
    exchangePremise: exchange.premise
  });
}

function buildAuditLabels(activeDepthId, localCell) {
  return Object.freeze({
    activeDepth: activeDepthId,
    activeDepthLabel: getDepthById(activeDepthId)?.label ?? "Unknown",
    localCellLabel: localCell.cellId,
    branch: "external.harbor",
    mode: "runtime_execution"
  });
}

function buildLocalCellSelection(input = {}) {
  const selection = normalizeObject(input.selection);
  const row = clamp(normalizeInteger(selection.row, 0), 0, 3);
  const col = clamp(normalizeInteger(selection.col, 0), 0, 3);
  const cellIndex = row * 4 + col;

  return Object.freeze({
    zone: normalizeString(selection.zone, "local_zone_alpha"),
    row,
    col,
    cellIndex,
    cellId: WORLD_KERNEL.localGrid.cellIds[cellIndex]
  });
}

function isLegalDepthTransition(fromDepthId, toDepthId) {
  const fromIndex = WORLD_KERNEL.depthOrder.indexOf(fromDepthId);
  const toIndex = WORLD_KERNEL.depthOrder.indexOf(toDepthId);
  if (fromIndex === -1 || toIndex === -1) return false;

  return Math.abs(toIndex - fromIndex) <= 1;
}

function buildScaleTransitionState(fromDepthId, toDepthId) {
  return Object.freeze({
    from: fromDepthId,
    to: toDepthId,
    legal: isLegalDepthTransition(fromDepthId, toDepthId)
  });
}

function buildScaleContainment(activeDepthId) {
  const live = WORLD_KERNEL.depthScope.live.includes(activeDepthId);
  const scaffolded = WORLD_KERNEL.depthScope.scaffolded.includes(activeDepthId);

  return Object.freeze({
    activeDepth: activeDepthId,
    live,
    scaffolded,
    externalViewOnly: WORLD_KERNEL.depthScope.externalBranchOnly
  });
}

function normalizeExecutionRequest(input = {}) {
  const normalized = normalizeObject(input);

  return Object.freeze({
    mode: normalizeString(normalized.mode, "runtime_execution"),
    fileCount: normalizeInteger(normalized.fileCount, 9),
    requestedDepth: normalizeString(normalized.requestedDepth, "planet"),
    currentDepth: normalizeString(normalized.currentDepth, "galaxy"),
    scopePath: Array.isArray(normalized.scopePath)
      ? normalized.scopePath.map((item) => String(item))
      : WORLD_KERNEL.scope.activePath,
    roleConflict: normalized.roleConflict === true,
    ownershipDrift: normalized.ownershipDrift === true,
    chronologyValid: normalized.chronologyValid !== false,
    duplicateTruth: normalized.duplicateTruth === true
  });
}

function classifyMode(normalizedRequest) {
  const allowedModes = new Set([
    "packet_acceptance",
    "kernel_population",
    "architecture_rewrite",
    "runtime_execution"
  ]);

  return allowedModes.has(normalizedRequest.mode) ? normalizedRequest.mode : "unknown";
}

function packageExecutionVerdict({ allow, mode, blockedBy, reasons, canonVerdict, nextAuthorizedAction }) {
  return Object.freeze({
    allow,
    mode,
    blocked_by: Object.freeze(blockedBy),
    reasons: Object.freeze(reasons),
    canon_verdict: canonVerdict,
    next_authorized_action: nextAuthorizedAction
  });
}

export function createCosmicEngineSpine() {
  function resolveWorldState(input = {}) {
    const nodes = resolveDepthNodes();
    const activeDepth = normalizeString(input.activeDepth, "planet");
    const localCell = buildLocalCellSelection(input);

    const gratitudeSplit = splitHarborGratitude();
    const generositySplit = splitHarborGenerosity();
    const gratitudeRecombination = recombineBranch("gratitude", gratitudeSplit);
    const generosityRecombination = recombineBranch("generosity", generositySplit);
    const harborExchange = resolveHarborExchange(gratitudeSplit, generositySplit);
    const nodeConclusion = concludeNodeState(gratitudeRecombination, generosityRecombination, harborExchange);

    const transition = buildScaleTransitionState(
      normalizeString(input.currentDepth, "galaxy"),
      activeDepth
    );

    const containment = buildScaleContainment(activeDepth);
    const auditLabels = buildAuditLabels(activeDepth, localCell);

    return Object.freeze({
      activeScale: WORLD_KERNEL.naming.activeScale,
      activeDepth,
      activeDepthLabel: getDepthById(activeDepth)?.label ?? "Unknown",
      externalViewLock: WORLD_KERNEL.modes.externalViewOnly,
      depthNodes: nodes,
      cosmic: nodes.cosmic,
      region: nodes.region,
      galaxy: nodes.galaxy,
      system: nodes.system,
      planet: nodes.planet,
      macroSurface: nodes.macroSurface,
      regionalSurface: nodes.regionalSurface,
      localZone: nodes.localZone,
      siteCell: nodes.siteCell,
      microCell: nodes.microCell,
      localSelection: localCell,
      branches: Object.freeze({
        harbor: Object.freeze({
          gratitude: gratitudeSplit,
          generosity: generositySplit,
          gratitudeRecombination,
          generosityRecombination,
          corePremise: harborExchange,
          nodeConclusion
        })
      }),
      transition,
      containment,
      auditLabels,
      gridBound: isGridBoundDepth(activeDepth),
      input: normalizeObject(input)
    });
  }

  function evaluateExecutionGate(canonVerdict, input = {}) {
    const request = normalizeExecutionRequest(input);
    const mode = classifyMode(request);

    const blockedBy = [];
    const reasons = [];

    if (!canonVerdict?.pass) {
      blockedBy.push("CANON_VERDICT_RECEIVER");
      reasons.push("canon_verification_failed");
    }

    if (mode === "unknown") {
      blockedBy.push("MODE_CLASSIFIER");
      reasons.push("unauthorized_execution_mode");
    }

    if (request.ownershipDrift) {
      blockedBy.push("OWNERSHIP_DRIFT_GATE");
      reasons.push("ownership_drift_detected");
    }

    if (!request.chronologyValid) {
      blockedBy.push("CHRONOLOGY_GATE");
      reasons.push("chronology_violation");
    }

    if (request.scopePath.join("|") !== WORLD_KERNEL.scope.activePath.join("|")) {
      blockedBy.push("SCOPE_GATE");
      reasons.push("scope_violation");
    }

    if (request.duplicateTruth) {
      blockedBy.push("DUPLICATE_TRUTH_GATE");
      reasons.push("duplicate_truth_detected");
    }

    if (request.fileCount !== 9) {
      blockedBy.push("FILE_COUNT_GATE");
      reasons.push("unauthorized_file_count");
    }

    if (request.roleConflict) {
      blockedBy.push("ROLE_CONFLICT_GATE");
      reasons.push("role_conflict_detected");
    }

    if (!isLegalDepthTransition(request.currentDepth, request.requestedDepth)) {
      blockedBy.push("SCALE_TRANSITION_GATE");
      reasons.push("illegal_depth_jump");
    }

    const allow = blockedBy.length === 0;
    const nextAuthorizedAction = allow ? "continue_execution" : "correct_canonical_structure";

    return packageExecutionVerdict({
      allow,
      mode,
      blockedBy,
      reasons,
      canonVerdict,
      nextAuthorizedAction
    });
  }

  return Object.freeze({
    resolveWorldState,
    evaluateExecutionGate
  });
}
