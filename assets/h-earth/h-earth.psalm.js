// /assets/h-earth/h-earth.psalm.js
// H_EARTH_MASTER_PSALM_AUTHORITY_TNT_v1
// Full-file replacement.
// PSALM authority layer above kernel.
//
// Purpose:
// - Implement MASTER_PSALM_FIBONACCI_256_CANONICAL_BINDING_v1 as an executable authority surface.
// - Keep PSALM above kernel, runtime, renderer, gauge, route, and child files.
// - Preserve the fixed 256 field.
// - Bind Fibonacci as lawful unfolding rhythm inside the 256 field.
// - Bind LEAP as execution protocol after the gap is clear.
//
// Does not:
// - mutate parent truth
// - replace kernel
// - replace lattice256
// - replace landmap
// - replace terrain
// - replace surface
// - authorize ground level
// - authorize manor placement
// - authorize estate placement
// - claim visual pass
// - touch DOM
// - create canvas
// - start requestAnimationFrame

const H_EARTH_PSALM_CONTRACT = "H_EARTH_MASTER_PSALM_AUTHORITY_TNT_v1";

const MASTER_PSALM_BINDING =
  "MASTER_PSALM_FIBONACCI_256_CANONICAL_BINDING_v1";

const MASTER_PSALM_RECEIPT =
  "MASTER_PSALM_FIBONACCI_256_CANONICAL_BINDING_RECEIPT_v1";

const PSALM_TERM_LOCK = "PSALM";

const FORBIDDEN_PSALM_SUBSTITUTIONS = Object.freeze([
  "SONG",
  "SOM",
  "SUN",
  "SON"
]);

const HIERARCHY = Object.freeze({
  masterKey: "MK",
  masterPsalmKey: "MPK",
  masterPsalms: 4,
  canopyPsalms: 16,
  branchSeats: 64,
  strata: 256,
  innerStrataKeysPerStratum: 256,
  notation: "MK → MPK → MP[1-4] → CP[1-16] → BS[1-64] → ST[1-256] → ISK[1-256]"
});

const FIBONACCI_WITHIN_256 = Object.freeze([
  1,
  2,
  3,
  5,
  8,
  13,
  21,
  34,
  55,
  89,
  144,
  233
]);

const MASTER_PSALM = Object.freeze({
  P: "Perception",
  S: "Structure",
  A: "Alignment",
  L: "Law",
  M: "Motion"
});

const LEAP_PROTOCOL = Object.freeze({
  L: "Learn",
  E: "Evidence",
  A: "Assemble",
  P: "Progress"
});

const HELD_GATES = Object.freeze({
  groundLevelReady: false,
  manorPlacementReady: false,
  estatePlacementReady: false,
  groundLevelHoldReason: "definitive-land-state-required",
  manorPlacementHoldReason: "lawful-build-candidate-terrain-required",
  estatePlacementHoldReason: "lawful-build-candidate-terrain-required"
});

const AUTHORITY_RANK = Object.freeze({
  psalmAboveKernel: true,
  psalmAboveRuntime: true,
  psalmAboveRenderer: true,
  psalmAboveGauge: true,
  psalmAboveRoute: true,
  psalmAboveChildFile: true,
  kernelMayExecute: true,
  kernelMayOutrankPsalm: false
});

const PRESERVED_PARENT_TRUTH = Object.freeze({
  kernel: "/assets/h-earth/h-earth.kernel.js",
  lattice256: "/assets/h-earth/h-earth.lattice256.js",
  landmap: "/assets/h-earth/h-earth.landmap.js",
  terrain: "/assets/h-earth/h-earth.terrain.js",
  surface: "/assets/h-earth/h-earth.surface.js"
});

function clamp(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

function toInteger(value, fallback = 1) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.trunc(numeric);
}

function normalizeStratum(value) {
  return clamp(toInteger(value, 1), 1, HIERARCHY.strata);
}

function normalizeInnerStrataKey(value) {
  return clamp(toInteger(value, 1), 1, HIERARCHY.innerStrataKeysPerStratum);
}

function resolveMasterPsalm(stratum) {
  const normalized = normalizeStratum(stratum);
  return Math.ceil(normalized / 64);
}

function resolveCanopyPsalm(stratum) {
  const normalized = normalizeStratum(stratum);
  return Math.ceil(normalized / 16);
}

function resolveBranchSeat(stratum) {
  const normalized = normalizeStratum(stratum);
  return Math.ceil(normalized / 4);
}

function resolveLocalStratumInBranch(stratum) {
  const normalized = normalizeStratum(stratum);
  return ((normalized - 1) % 4) + 1;
}

function resolvePsalmAddress(stratum = 1, innerStrataKey = 1) {
  const st = normalizeStratum(stratum);
  const isk = normalizeInnerStrataKey(innerStrataKey);
  const mp = resolveMasterPsalm(st);
  const cp = resolveCanopyPsalm(st);
  const bs = resolveBranchSeat(st);
  const local = resolveLocalStratumInBranch(st);

  return {
    contract: H_EARTH_PSALM_CONTRACT,
    masterPsalmBinding: MASTER_PSALM_BINDING,
    hierarchy: HIERARCHY.notation,
    MK: 1,
    MPK: 1,
    MP: mp,
    CP: cp,
    BS: bs,
    ST: st,
    ISK: isk,
    localStratumInBranch: local,
    shortPath: `MK/MPK/MP${mp}/CP${cp}/BS${bs}/ST${st}/ISK${isk}`,
    longPath: `Master Key / Master Psalm Key / Master Psalm ${mp} / Canopy Psalm ${cp} / Branch Seat ${bs} / Stratum ${st} / Inner Strata Key ${isk}`,
    psalmTermLocked: true
  };
}

function fibonacciRankForStratum(stratum) {
  const st = normalizeStratum(stratum);

  let rank = 0;
  let value = FIBONACCI_WITHIN_256[0];

  for (let index = 0; index < FIBONACCI_WITHIN_256.length; index += 1) {
    if (FIBONACCI_WITHIN_256[index] <= st) {
      rank = index;
      value = FIBONACCI_WITHIN_256[index];
    }
  }

  const nextValue =
    FIBONACCI_WITHIN_256[Math.min(rank + 1, FIBONACCI_WITHIN_256.length - 1)];

  return {
    stratum: st,
    fibonacciRank: rank + 1,
    fibonacciValue: value,
    nextFibonacciValue: nextValue,
    exactFibonacciNode: FIBONACCI_WITHIN_256.includes(st),
    progressionRatioWithin256: st / HIERARCHY.strata
  };
}

function fibonacciDensityPriority(stratum) {
  const st = normalizeStratum(stratum);
  const fib = fibonacciRankForStratum(st);
  const nearestDistance = Math.min(
    ...FIBONACCI_WITHIN_256.map((value) => Math.abs(value - st))
  );

  const proximity = clamp(1 - nearestDistance / 34, 0, 1);
  const rankWeight = clamp(fib.fibonacciRank / FIBONACCI_WITHIN_256.length, 0, 1);

  return {
    stratum: st,
    fibonacciRank: fib.fibonacciRank,
    fibonacciValue: fib.fibonacciValue,
    exactFibonacciNode: fib.exactFibonacciNode,
    densityPriority: clamp(0.35 + proximity * 0.45 + rankWeight * 0.20, 0, 1),
    refinementPriority: clamp(0.25 + proximity * 0.50 + rankWeight * 0.25, 0, 1),
    traversalPriority: clamp(0.30 + proximity * 0.40 + rankWeight * 0.30, 0, 1)
  };
}

function buildFibonacciTraversalOrder() {
  const visited = new Set();
  const order = [];

  for (const value of FIBONACCI_WITHIN_256) {
    if (value >= 1 && value <= HIERARCHY.strata && !visited.has(value)) {
      visited.add(value);
      order.push(value);
    }
  }

  for (let stratum = 1; stratum <= HIERARCHY.strata; stratum += 1) {
    if (!visited.has(stratum)) {
      visited.add(stratum);
      order.push(stratum);
    }
  }

  return order;
}

const FIBONACCI_TRAVERSAL_ORDER = Object.freeze(buildFibonacciTraversalOrder());

function getTraversalPosition(stratum) {
  const st = normalizeStratum(stratum);
  const zeroIndex = FIBONACCI_TRAVERSAL_ORDER.indexOf(st);

  return {
    stratum: st,
    traversalIndex: zeroIndex + 1,
    traversalTotal: HIERARCHY.strata,
    traversalRatio: zeroIndex >= 0 ? (zeroIndex + 1) / HIERARCHY.strata : 1,
    fibonacciFirstPass: FIBONACCI_WITHIN_256.includes(st)
  };
}

function evaluatePsalmAdmissibility(request = {}) {
  const stratum = normalizeStratum(request.stratum ?? request.ST ?? 1);
  const address = resolvePsalmAddress(stratum, request.innerStrataKey ?? request.ISK ?? 1);
  const fib = fibonacciRankForStratum(stratum);
  const density = fibonacciDensityPriority(stratum);
  const traversal = getTraversalPosition(stratum);

  const wantsParentMutation =
    request.parentMutationAuthorized === true ||
    request.mutateParentTruth === true ||
    request.kernelMutationAuthorized === true ||
    request.latticeMutationAuthorized === true ||
    request.terrainTruthMutationAuthorized === true ||
    request.surfaceTruthMutationAuthorized === true;

  const wantsGroundLevel =
    request.groundLevelReady === true ||
    request.authorizeGroundLevel === true;

  const wantsManorPlacement =
    request.manorPlacementReady === true ||
    request.authorizeManorPlacement === true ||
    request.estatePlacementReady === true ||
    request.authorizeEstatePlacement === true;

  const violatesPsalmTerm =
    typeof request.term === "string" &&
    FORBIDDEN_PSALM_SUBSTITUTIONS.includes(request.term.trim().toUpperCase());

  const admissible =
    !wantsParentMutation &&
    !wantsGroundLevel &&
    !wantsManorPlacement &&
    !violatesPsalmTerm;

  const blocks = [];

  if (wantsParentMutation) blocks.push("parent-truth-mutation-not-admissible-under-psalm");
  if (wantsGroundLevel) blocks.push("ground-level-held-until-definitive-land-state");
  if (wantsManorPlacement) blocks.push("manor-estate-held-until-lawful-build-candidate-terrain");
  if (violatesPsalmTerm) blocks.push("psalm-term-substitution-forbidden");

  return {
    contract: H_EARTH_PSALM_CONTRACT,
    masterPsalmBinding: MASTER_PSALM_BINDING,
    masterPsalmReceipt: MASTER_PSALM_RECEIPT,
    admissible,
    blocks,
    address,
    fibonacci: fib,
    density,
    traversal,
    authorityRank: AUTHORITY_RANK,
    heldGates: HELD_GATES,
    parentTruthPreserved: true,
    parentMutationAuthorized: false,
    groundLevelReady: false,
    manorPlacementReady: false,
    estatePlacementReady: false,
    psalmTermLocked: true,
    fibonacciReplaces256: false,
    fibonacciProgressionUnderPsalm: true,
    leapProtocol: LEAP_PROTOCOL
  };
}

function createHEarthPsalmAuthority(options = {}) {
  const createdAt = new Date().toISOString();

  return {
    contract: H_EARTH_PSALM_CONTRACT,
    receipt: H_EARTH_PSALM_CONTRACT,
    masterPsalmBinding: MASTER_PSALM_BINDING,
    masterPsalmReceipt: MASTER_PSALM_RECEIPT,
    psalmTermLock: PSALM_TERM_LOCK,
    forbiddenPsalmSubstitutions: [...FORBIDDEN_PSALM_SUBSTITUTIONS],
    hierarchy: { ...HIERARCHY },
    masterPsalm: { ...MASTER_PSALM },
    leapProtocol: { ...LEAP_PROTOCOL },
    fibonacciWithin256: [...FIBONACCI_WITHIN_256],
    authorityRank: { ...AUTHORITY_RANK },
    heldGates: { ...HELD_GATES },
    preservedParentTruth: { ...PRESERVED_PARENT_TRUTH },
    createdAt,
    options: { ...options },

    resolvePsalmAddress,
    fibonacciRankForStratum,
    fibonacciDensityPriority,
    getTraversalPosition,
    evaluatePsalmAdmissibility,

    getFibonacciTraversalOrder() {
      return [...FIBONACCI_TRAVERSAL_ORDER];
    },

    getStatus() {
      return getHEarthPsalmAuthorityStatus();
    },

    getHEarthPsalmAuthorityStatus() {
      return getHEarthPsalmAuthorityStatus();
    }
  };
}

function getHEarthPsalmAuthorityStatus() {
  return {
    contract: H_EARTH_PSALM_CONTRACT,
    receipt: H_EARTH_PSALM_CONTRACT,
    masterPsalmBinding: MASTER_PSALM_BINDING,
    masterPsalmReceipt: MASTER_PSALM_RECEIPT,
    psalmAboveKernel: true,
    psalmAboveRuntime: true,
    psalmAboveRenderer: true,
    psalmAboveGauge: true,
    psalmAboveRoute: true,
    psalmAboveChildFile: true,
    psalmTermLock: PSALM_TERM_LOCK,
    forbiddenPsalmSubstitutions: [...FORBIDDEN_PSALM_SUBSTITUTIONS],
    hierarchy: { ...HIERARCHY },
    masterPsalm: { ...MASTER_PSALM },
    fibonacciWithin256: [...FIBONACCI_WITHIN_256],
    fibonacciTraversalOrderLength: FIBONACCI_TRAVERSAL_ORDER.length,
    fibonacciReplaces256: false,
    fibonacciProgressionUnderPsalm: true,
    leapProtocol: { ...LEAP_PROTOCOL },
    parentTruthPreserved: true,
    parentMutationAuthorized: false,
    groundLevelReady: false,
    manorPlacementReady: false,
    estatePlacementReady: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false,
    touchesDom: false,
    createsCanvas: false,
    startsAnimationFrame: false,
    requiredExports: [
      "createHEarthPsalmAuthority",
      "getHEarthPsalmAuthorityStatus",
      "resolvePsalmAddress",
      "fibonacciRankForStratum",
      "fibonacciDensityPriority",
      "getTraversalPosition",
      "evaluatePsalmAdmissibility"
    ]
  };
}

export {
  H_EARTH_PSALM_CONTRACT,
  MASTER_PSALM_BINDING,
  MASTER_PSALM_RECEIPT,
  PSALM_TERM_LOCK,
  FORBIDDEN_PSALM_SUBSTITUTIONS,
  HIERARCHY,
  MASTER_PSALM,
  LEAP_PROTOCOL,
  FIBONACCI_WITHIN_256,
  AUTHORITY_RANK,
  HELD_GATES,
  PRESERVED_PARENT_TRUTH,
  resolvePsalmAddress,
  fibonacciRankForStratum,
  fibonacciDensityPriority,
  getTraversalPosition,
  evaluatePsalmAdmissibility,
  createHEarthPsalmAuthority,
  getHEarthPsalmAuthorityStatus
};

export default {
  contract: H_EARTH_PSALM_CONTRACT,
  receipt: H_EARTH_PSALM_CONTRACT,
  masterPsalmBinding: MASTER_PSALM_BINDING,
  masterPsalmReceipt: MASTER_PSALM_RECEIPT,
  create: createHEarthPsalmAuthority,
  createHEarthPsalmAuthority,
  status: getHEarthPsalmAuthorityStatus,
  getStatus: getHEarthPsalmAuthorityStatus,
  getHEarthPsalmAuthorityStatus,
  resolvePsalmAddress,
  fibonacciRankForStratum,
  fibonacciDensityPriority,
  getTraversalPosition,
  evaluatePsalmAdmissibility
};
