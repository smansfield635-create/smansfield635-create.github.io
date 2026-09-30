(function () {
  "use strict";

  const TREE_VERSION = "TREE_OF_LIFE_256_BRANCH_FRUIT_STRUCTURE_v1";

  const TREE_COUNTS = Object.freeze({
    trunks: 1,
    primaryLimbs: 4,
    canopyClusters: 16,
    branchSeats: 64,
    terminalNodes: 256
  });

  const PRIMARY_LIMBS = Object.freeze([
    {
      index: 1,
      key: "north",
      label: "North Limb",
      role: "frame / boundary / upper orientation",
      seasonalTone: "winter",
      axis: "vertical"
    },
    {
      index: 2,
      key: "east",
      label: "East Limb",
      role: "growth / learning / emergence",
      seasonalTone: "spring",
      axis: "formation"
    },
    {
      index: 3,
      key: "south",
      label: "South Limb",
      role: "continuity / care / nourishment",
      seasonalTone: "summer",
      axis: "stability"
    },
    {
      index: 4,
      key: "west",
      label: "West Limb",
      role: "audit / pressure / maturity",
      seasonalTone: "autumn",
      axis: "testing"
    }
  ]);

  const CANOPY_ROLES = Object.freeze([
    "orientation",
    "threshold",
    "arrival",
    "source",
    "proof",
    "measurement",
    "product-flow",
    "learning",
    "support",
    "exploration",
    "law",
    "governance",
    "event",
    "origin",
    "summit",
    "love"
  ]);

  const TERMINAL_TYPES = Object.freeze([
    "leaf",
    "fruit",
    "blossom",
    "habitat"
  ]);

  const FRUIT_TYPES = Object.freeze([
    "seed-fruit",
    "wisdom-fruit",
    "care-fruit",
    "proof-fruit"
  ]);

  const HABITAT_TYPES = Object.freeze([
    "snow-track",
    "root-shelter",
    "bark-insect",
    "hollow-shadow",
    "branch-nest",
    "canopy-bird",
    "grass-break",
    "frost-ledge"
  ]);

  function pad(value, size) {
    return String(value).padStart(size, "0");
  }

  function makeAddress(parts) {
    return [
      "T" + pad(parts.trunk, 1),
      "L" + pad(parts.limb, 1),
      "C" + pad(parts.canopy, 2),
      "B" + pad(parts.branch, 2),
      "N" + pad(parts.node, 3)
    ].join(".");
  }

  function makeNodeId(prefix, index) {
    return prefix + "_" + pad(index, prefix === "TERMINAL" ? 3 : 2);
  }

  function terminalTypeFor(globalTerminalIndex) {
    return TERMINAL_TYPES[(globalTerminalIndex - 1) % TERMINAL_TYPES.length];
  }

  function fruitTypeFor(globalTerminalIndex) {
    return FRUIT_TYPES[Math.floor((globalTerminalIndex - 1) / 4) % FRUIT_TYPES.length];
  }

  function habitatTypeFor(globalTerminalIndex) {
    return HABITAT_TYPES[(globalTerminalIndex - 1) % HABITAT_TYPES.length];
  }

  function buildTerminalNode(context, terminalLocalIndex) {
    const globalTerminalIndex =
      ((context.branchSeatGlobalIndex - 1) * 4) + terminalLocalIndex;

    const terminalType = terminalTypeFor(globalTerminalIndex);
    const isFruit = terminalType === "fruit";

    return {
      id: makeNodeId("TERMINAL", globalTerminalIndex),
      index: globalTerminalIndex,
      localIndex: terminalLocalIndex,
      depth: 5,
      class: "terminal_node",
      address: makeAddress({
        trunk: 1,
        limb: context.limbIndex,
        canopy: context.canopyGlobalIndex,
        branch: context.branchSeatGlobalIndex,
        node: globalTerminalIndex
      }),
      parent: context.branchSeatId,
      primaryLimb: context.limbKey,
      canopyCluster: context.canopyGlobalIndex,
      branchSeat: context.branchSeatGlobalIndex,
      terminalType,
      visualRole: isFruit ? "fruit" : terminalType,
      fruit: isFruit ? {
        active: true,
        type: fruitTypeFor(globalTerminalIndex),
        rule: "Fruit belongs to terminal structure and appears through zoom, not as first-screen clutter."
      } : {
        active: false,
        type: null,
        rule: "Non-fruit terminal node."
      },
      habitat: {
        active: terminalType === "habitat",
        type: habitatTypeFor(globalTerminalIndex)
      },
      material: {
        snow: globalTerminalIndex % 5 === 0,
        frost: globalTerminalIndex % 3 === 0,
        grassBreak: globalTerminalIndex % 7 === 0,
        barkDetail: globalTerminalIndex % 11 === 0,
        wildlifeHint: terminalType === "habitat"
      },
      renderHints: {
        visibleAtDollLayer: terminalType === "fruit" ? "DOLL_5_WILDLIFE" : "DOLL_4_HABITAT",
        zoomLevel: terminalType === "fruit" ? "wildlife" : "habitat",
        densityClass: "micro_detail",
        shouldRenderFirstScreen: false
      }
    };
  }

  function buildBranchSeat(context, branchLocalIndex) {
    const branchSeatGlobalIndex =
      ((context.canopyGlobalIndex - 1) * 4) + branchLocalIndex;

    const branchSeatId = makeNodeId("BRANCH_SEAT", branchSeatGlobalIndex);

    const branchContext = {
      ...context,
      branchSeatId,
      branchSeatGlobalIndex
    };

    return {
      id: branchSeatId,
      index: branchSeatGlobalIndex,
      localIndex: branchLocalIndex,
      depth: 4,
      class: "branch_seat",
      address: [
        "T1",
        "L" + pad(context.limbIndex, 1),
        "C" + pad(context.canopyGlobalIndex, 2),
        "B" + pad(branchSeatGlobalIndex, 2)
      ].join("."),
      parent: context.canopyId,
      primaryLimb: context.limbKey,
      canopyCluster: context.canopyGlobalIndex,
      role: "holds four terminal expressions",
      terminalNodes: [1, 2, 3, 4].map((terminalLocalIndex) =>
        buildTerminalNode(branchContext, terminalLocalIndex)
      ),
      renderHints: {
        visibleAtDollLayer: "DOLL_4_HABITAT",
        zoomLevel: "habitat",
        densityClass: "branch_detail",
        shouldRenderFirstScreen: false
      }
    };
  }

  function buildCanopyCluster(context, canopyLocalIndex) {
    const canopyGlobalIndex =
      ((context.limbIndex - 1) * 4) + canopyLocalIndex;

    const canopyId = makeNodeId("CANOPY", canopyGlobalIndex);

    const canopyContext = {
      ...context,
      canopyId,
      canopyGlobalIndex
    };

    return {
      id: canopyId,
      index: canopyGlobalIndex,
      localIndex: canopyLocalIndex,
      depth: 3,
      class: "canopy_cluster",
      address: [
        "T1",
        "L" + pad(context.limbIndex, 1),
        "C" + pad(canopyGlobalIndex, 2)
      ].join("."),
      parent: context.limbId,
      primaryLimb: context.limbKey,
      role: CANOPY_ROLES[canopyGlobalIndex - 1],
      branchSeats: [1, 2, 3, 4].map((branchLocalIndex) =>
        buildBranchSeat(canopyContext, branchLocalIndex)
      ),
      renderHints: {
        visibleAtDollLayer: "DOLL_3_OAK",
        zoomLevel: "oak",
        densityClass: "canopy_mass",
        shouldRenderFirstScreen: canopyGlobalIndex <= 4
      }
    };
  }

  function buildPrimaryLimb(limbDefinition) {
    const limbId = makeNodeId("PRIMARY_LIMB", limbDefinition.index);

    const limbContext = {
      limbId,
      limbIndex: limbDefinition.index,
      limbKey: limbDefinition.key
    };

    return {
      id: limbId,
      index: limbDefinition.index,
      depth: 2,
      class: "primary_limb",
      address: ["T1", "L" + pad(limbDefinition.index, 1)].join("."),
      parent: "TRUNK_1",
      key: limbDefinition.key,
      label: limbDefinition.label,
      role: limbDefinition.role,
      seasonalTone: limbDefinition.seasonalTone,
      axis: limbDefinition.axis,
      canopyClusters: [1, 2, 3, 4].map((canopyLocalIndex) =>
        buildCanopyCluster(limbContext, canopyLocalIndex)
      ),
      renderHints: {
        visibleAtDollLayer: "DOLL_2_ESTATE",
        zoomLevel: "estate",
        densityClass: "major_structure",
        shouldRenderFirstScreen: true
      }
    };
  }

  function buildTree() {
    const primaryLimbs = PRIMARY_LIMBS.map(buildPrimaryLimb);

    return {
      version: TREE_VERSION,
      status: "STRUCTURE_ONLY_NO_GRAPHIC",
      species: {
        boundBaseline: "256-year-old sequoia-scale oak",
        speciesRebindStatus: "not_rebound",
        fruitPolicy: "fruit is structural terminal-node layer; it does not change species by itself"
      },
      counts: TREE_COUNTS,
      formula: "1 trunk -> 4 primary limbs -> 16 canopies -> 64 branch seats -> 256 terminal nodes",
      trunk: {
        id: "TRUNK_1",
        index: 1,
        depth: 1,
        class: "trunk_root_authority",
        address: "T1",
        role: "one central living authority connecting estate, Manor, oak, roots, branches, fruit, habitat, and inspection",
        primaryObject: "Tree of Life",
        boundEstateObject: "Rich Manor and Estate",
        primaryLimbs,
        renderHints: {
          visibleAtDollLayer: "DOLL_1_COMPASS",
          zoomLevel: "estate",
          densityClass: "root_authority",
          shouldRenderFirstScreen: true
        }
      }
    };
  }

  function flattenTree(tree) {
    const flat = {
      trunks: [tree.trunk],
      primaryLimbs: [],
      canopyClusters: [],
      branchSeats: [],
      terminalNodes: []
    };

    tree.trunk.primaryLimbs.forEach((limb) => {
      flat.primaryLimbs.push(limb);

      limb.canopyClusters.forEach((canopy) => {
        flat.canopyClusters.push(canopy);

        canopy.branchSeats.forEach((branchSeat) => {
          flat.branchSeats.push(branchSeat);

          branchSeat.terminalNodes.forEach((terminalNode) => {
            flat.terminalNodes.push(terminalNode);
          });
        });
      });
    });

    return flat;
  }

  function validateTree(tree) {
    const flat = flattenTree(tree);

    const report = {
      version: tree.version,
      valid: true,
      expected: TREE_COUNTS,
      actual: {
        trunks: flat.trunks.length,
        primaryLimbs: flat.primaryLimbs.length,
        canopyClusters: flat.canopyClusters.length,
        branchSeats: flat.branchSeats.length,
        terminalNodes: flat.terminalNodes.length
      },
      failures: []
    };

    Object.keys(TREE_COUNTS).forEach((key) => {
      if (report.actual[key] !== TREE_COUNTS[key]) {
        report.valid = false;
        report.failures.push(`${key}: expected ${TREE_COUNTS[key]}, got ${report.actual[key]}`);
      }
    });

    const uniqueTerminalIds = new Set(flat.terminalNodes.map((node) => node.id));
    if (uniqueTerminalIds.size !== TREE_COUNTS.terminalNodes) {
      report.valid = false;
      report.failures.push("terminalNodes: duplicate terminal IDs detected");
    }

    const fruitCount = flat.terminalNodes.filter((node) => node.fruit.active).length;
    report.fruit = {
      active: fruitCount > 0,
      count: fruitCount,
      policy: tree.species.fruitPolicy
    };

    return report;
  }

  function indexById(tree) {
    const flat = flattenTree(tree);
    const map = new Map();

    flat.trunks.forEach((node) => map.set(node.id, node));
    flat.primaryLimbs.forEach((node) => map.set(node.id, node));
    flat.canopyClusters.forEach((node) => map.set(node.id, node));
    flat.branchSeats.forEach((node) => map.set(node.id, node));
    flat.terminalNodes.forEach((node) => map.set(node.id, node));

    return map;
  }

  const tree = buildTree();
  const flat = flattenTree(tree);
  const idIndex = indexById(tree);
  const validation = validateTree(tree);

  window.DGBTreeOfLife256 = Object.freeze({
    version: TREE_VERSION,
    tree,
    flat,
    validation,

    getCounts() {
      return Object.assign({}, TREE_COUNTS);
    },

    getValidation() {
      return JSON.parse(JSON.stringify(validation));
    },

    getNodeById(id) {
      return idIndex.get(id) || null;
    },

    getPrimaryLimbs() {
      return flat.primaryLimbs.slice();
    },

    getCanopies() {
      return flat.canopyClusters.slice();
    },

    getBranchSeats() {
      return flat.branchSeats.slice();
    },

    getTerminalNodes() {
      return flat.terminalNodes.slice();
    },

    getFruitNodes() {
      return flat.terminalNodes.filter((node) => node.fruit.active);
    },

    getNodesByDollLayer(layerName) {
      return [
        ...flat.trunks,
        ...flat.primaryLimbs,
        ...flat.canopyClusters,
        ...flat.branchSeats,
        ...flat.terminalNodes
      ].filter((node) => node.renderHints && node.renderHints.visibleAtDollLayer === layerName);
    },

    getTerminalsForBranchSeat(branchSeatId) {
      const branchSeat = idIndex.get(branchSeatId);
      return branchSeat && Array.isArray(branchSeat.terminalNodes)
        ? branchSeat.terminalNodes.slice()
        : [];
    },

    getBranchSeatsForCanopy(canopyId) {
      const canopy = idIndex.get(canopyId);
      return canopy && Array.isArray(canopy.branchSeats)
        ? canopy.branchSeats.slice()
        : [];
    },

    getCanopiesForLimb(limbId) {
      const limb = idIndex.get(limbId);
      return limb && Array.isArray(limb.canopyClusters)
        ? limb.canopyClusters.slice()
        : [];
    },

    toJSON() {
      return JSON.parse(JSON.stringify(tree));
    }
  });

  if (!validation.valid) {
    console.warn("[DGBTreeOfLife256] validation failed", validation);
  }
})();
