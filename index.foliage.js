(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  function s(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    });
    return node;
  }

  function sourceTree() {
    const api = window.DGBTreeOfLife256;

    if (api && api.flat && Array.isArray(api.flat.branchSeats) && Array.isArray(api.flat.terminalNodes)) {
      return {
        branchSeats: api.flat.branchSeats,
        terminalNodes: api.flat.terminalNodes
      };
    }

    const branchSeats = [];
    const terminalNodes = [];
    const terminalTypes = ["leaf", "fruit", "blossom", "habitat"];

    for (let canopy = 1; canopy <= 16; canopy += 1) {
      for (let branchLocal = 1; branchLocal <= 4; branchLocal += 1) {
        const branchIndex = ((canopy - 1) * 4) + branchLocal;

        branchSeats.push({
          id: `BRANCH_SEAT_${String(branchIndex).padStart(2, "0")}`,
          index: branchIndex,
          localIndex: branchLocal,
          canopyCluster: canopy
        });

        for (let terminalLocal = 1; terminalLocal <= 4; terminalLocal += 1) {
          const nodeIndex = ((branchIndex - 1) * 4) + terminalLocal;
          terminalNodes.push({
            id: `TERMINAL_${String(nodeIndex).padStart(3, "0")}`,
            index: nodeIndex,
            localIndex: terminalLocal,
            branchSeat: branchIndex,
            canopyCluster: canopy,
            terminalType: terminalTypes[(nodeIndex - 1) % terminalTypes.length],
            fruit: { active: terminalTypes[(nodeIndex - 1) % terminalTypes.length] === "fruit" }
          });
        }
      }
    }

    return { branchSeats, terminalNodes };
  }

  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  function seededUnit(seed) {
    const x = Math.sin(seed * 987.654321) * 43758.5453123;
    return x - Math.floor(x);
  }

  function seededRange(seed, min, max) {
    return min + (max - min) * seededUnit(seed);
  }

  function canopyPosition(index) {
    const ring = index <= 8 ? 1 : 2;
    const local = ring === 1 ? index - 1 : index - 9;
    const angle = ring === 1 ? -150 + local * (300 / 7) : -164 + local * (328 / 7);
    const radiusX = ring === 1 ? 245 : 375;
    const radiusY = ring === 1 ? 158 : 242;

    return {
      x: 800 + Math.cos(degToRad(angle)) * radiusX,
      y: 376 + Math.sin(degToRad(angle)) * radiusY,
      angle,
      ring
    };
  }

  function branchSeatPosition(canopyIndex, branchLocal) {
    const canopy = canopyPosition(canopyIndex);
    const angleOffsets = [-118, -28, 56, 138];
    const distanceX = canopy.ring === 1 ? 64 : 78;
    const distanceY = canopy.ring === 1 ? 52 : 66;
    const theta = degToRad(canopy.angle + angleOffsets[branchLocal - 1]);

    return {
      x: canopy.x + Math.cos(theta) * distanceX,
      y: canopy.y + Math.sin(theta) * distanceY,
      angle: canopy.angle + angleOffsets[branchLocal - 1]
    };
  }

  function terminalPosition(node) {
    const branchLocal = ((node.branchSeat - 1) % 4) + 1;
    const seat = branchSeatPosition(node.canopyCluster, branchLocal);

    const layout = [
      { dx: -30, dy: -28, tilt: -24 },
      { dx: 28, dy: -26, tilt: 22 },
      { dx: -26, dy: 28, tilt: -18 },
      { dx: 32, dy: 30, tilt: 20 }
    ][node.localIndex - 1];

    const jitterX = seededRange(node.index * 11, -12, 12);
    const jitterY = seededRange(node.index * 13, -10, 10);
    const scale = 0.82 + seededRange(node.index * 17, 0.00, 0.36);
    const angle = layout.tilt + seededRange(node.index * 19, -13, 13);

    return {
      x: seat.x + layout.dx + jitterX,
      y: seat.y + layout.dy + jitterY,
      angle,
      scale
    };
  }

  function leafPath(variant) {
    if (variant === 1) return "M 0 -18 C 10 -18 17 -10 18 -1 C 19 13 8 24 0 31 C -8 24 -19 13 -18 -1 C -17 -10 -10 -18 0 -18 Z";
    if (variant === 2) return "M 0 -20 C 12 -18 18 -8 16 2 C 14 15 7 23 0 30 C -7 23 -14 15 -16 2 C -18 -8 -12 -18 0 -20 Z";
    if (variant === 3) return "M 0 -17 C 9 -18 18 -12 19 -2 C 20 11 10 22 0 29 C -10 22 -20 11 -19 -2 C -18 -12 -9 -18 0 -17 Z";
    return "M 0 -19 C 11 -17 18 -9 18 1 C 18 13 7 23 0 31 C -7 23 -18 13 -18 1 C -18 -9 -11 -17 0 -19 Z";
  }

  function leafFill(node) {
    const palette = [
      "rgba(48,110,56,.94)",
      "rgba(67,130,70,.93)",
      "rgba(56,120,62,.95)",
      "rgba(80,142,76,.91)",
      "rgba(41,97,49,.95)",
      "rgba(92,151,86,.89)",
      "rgba(58,114,57,.94)"
    ];

    return palette[node.index % palette.length];
  }

  function leafEdge(node) {
    const palette = [
      "rgba(214,236,198,.22)",
      "rgba(225,244,214,.18)",
      "rgba(193,221,177,.24)"
    ];

    return palette[node.index % palette.length];
  }

  function makeLeafGroup(node, pos) {
    const variant = (node.index % 4) + 1;
    const group = s("g", {
      class: "terminal-node-group terminal-leaf-group",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": node.terminalType,
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat
    });

    group.appendChild(s("path", {
      class: "leaf-petiole",
      d: "M 0 28 C 0 23, 0 18, 0 14",
      fill: "none",
      stroke: "rgba(86,62,35,.85)",
      "stroke-width": 1.4,
      "stroke-linecap": "round"
    }));

    group.appendChild(s("path", {
      class: "terminal-node terminal-leaf individual-leaf",
      d: leafPath(variant),
      fill: leafFill(node),
      stroke: leafEdge(node),
      "stroke-width": 1.0,
      filter: "url(#leafShadow)"
    }));

    group.appendChild(s("path", {
      class: "leaf-midrib",
      d: "M 0 -13 C 0 -4, 0 6, 0 20",
      fill: "none",
      stroke: "rgba(235,248,220,.30)",
      "stroke-width": 1.15,
      "stroke-linecap": "round"
    }));

    group.appendChild(s("path", {
      class: "leaf-side-veins",
      d: "M 0 -8 L 8 -12 M 0 -1 L 10 -3 M 0 7 L 9 8 M 0 -8 L -8 -12 M 0 -1 L -10 -3 M 0 7 L -9 8",
      fill: "none",
      stroke: "rgba(235,248,220,.16)",
      "stroke-width": 0.75,
      "stroke-linecap": "round"
    }));

    if (node.terminalType === "fruit") {
      group.appendChild(s("path", {
        d: "M 1 2 C 4 -5, 8 -9, 12 -12",
        fill: "none",
        stroke: "rgba(83,56,34,.82)",
        "stroke-width": 1.4,
        "stroke-linecap": "round"
      }));

      group.appendChild(s("circle", {
        class: "terminal-fruit",
        cx: 14,
        cy: -13,
        r: 4.8,
        fill: "url(#fruitGradient)",
        filter: "url(#fruitGlow)"
      }));

      group.appendChild(s("circle", {
        cx: 12.7,
        cy: -14.5,
        r: 1.2,
        fill: "rgba(255,231,216,.70)"
      }));
    }

    if (node.terminalType === "blossom") {
      const blossom = s("g", {
        class: "terminal-blossom-cluster",
        transform: "translate(-11,-11) scale(.68)"
      });

      for (let i = 0; i < 5; i += 1) {
        blossom.appendChild(s("ellipse", {
          cx: Math.cos(degToRad(i * 72)) * 4.3,
          cy: Math.sin(degToRad(i * 72)) * 4.3,
          rx: 2.9,
          ry: 4.9,
          transform: `rotate(${i * 72})`,
          fill: "rgba(247,214,222,.92)",
          stroke: "rgba(255,255,255,.24)",
          "stroke-width": 0.55
        }));
      }

      blossom.appendChild(s("circle", {
        cx: 0,
        cy: 0,
        r: 1.8,
        fill: "rgba(242,199,111,.92)"
      }));

      group.appendChild(blossom);
    }

    if (node.terminalType === "habitat") {
      group.appendChild(s("ellipse", {
        class: "terminal-habitat-mark",
        cx: -10,
        cy: -5,
        rx: 5.5,
        ry: 3.6,
        fill: "rgba(119,92,58,.74)",
        stroke: "rgba(42,26,14,.68)",
        "stroke-width": 0.9
      }));

      group.appendChild(s("circle", {
        cx: -12,
        cy: -5,
        r: 1.1,
        fill: "rgba(20,10,4,.85)"
      }));

      group.appendChild(s("circle", {
        cx: -8,
        cy: -5,
        r: 1.1,
        fill: "rgba(20,10,4,.85)"
      }));
    }

    return group;
  }

  function twigAnchor(pos) {
    const angle = degToRad(pos.angle + 90);
    return {
      x: pos.x + Math.cos(angle) * 13 * pos.scale,
      y: pos.y + Math.sin(angle) * 13 * pos.scale
    };
  }

  function addSecondaryBranch(branchLayer, from, to, width, meta) {
    branchLayer.appendChild(s("path", {
      class: "secondary-branch",
      d: `M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y - 10}, ${(from.x + to.x) / 2} ${to.y + 10}, ${to.x} ${to.y}`,
      fill: "none",
      stroke: "rgba(82,48,28,.86)",
      "stroke-width": width,
      "stroke-linecap": "round",
      "data-canopy": meta.canopy,
      "data-branch-seat": meta.branchSeat
    }));
  }

  function addTertiaryBranch(branchLayer, from, to, width, meta) {
    branchLayer.appendChild(s("path", {
      class: "tertiary-branch",
      d: `M ${from.x} ${from.y} C ${from.x + (to.x - from.x) * .42} ${from.y - 8}, ${from.x + (to.x - from.x) * .72} ${to.y + 8}, ${to.x} ${to.y}`,
      fill: "none",
      stroke: "rgba(96,57,34,.90)",
      "stroke-width": width,
      "stroke-linecap": "round",
      "data-terminal-id": meta.terminalId
    }));
  }

  function addTwig(branchLayer, from, to, meta) {
    branchLayer.appendChild(s("path", {
      class: "terminal-twig",
      d: `M ${from.x} ${from.y} C ${from.x + (to.x - from.x) * .38} ${from.y - 4}, ${from.x + (to.x - from.x) * .74} ${to.y + 4}, ${to.x} ${to.y}`,
      fill: "none",
      stroke: "rgba(108,68,42,.84)",
      "stroke-width": 1.85,
      "stroke-linecap": "round",
      "data-terminal-id": meta.terminalId
    }));
  }

  function buildSeatNetwork(branch, nodes, branchLayer) {
    const canopy = canopyPosition(branch.canopyCluster);
    const seat = branchSeatPosition(branch.canopyCluster, branch.localIndex);

    addSecondaryBranch(
      branchLayer,
      { x: canopy.x, y: canopy.y },
      { x: seat.x, y: seat.y },
      7.8,
      { canopy: branch.canopyCluster, branchSeat: branch.id }
    );

    const nodePositions = nodes.map((node) => ({ node, pos: terminalPosition(node) }));
    const upper = nodePositions.filter((item) => item.node.localIndex <= 2);
    const lower = nodePositions.filter((item) => item.node.localIndex >= 3);

    const upperHub = {
      x: seat.x + seededRange(branch.index * 21, 6, 12),
      y: seat.y - seededRange(branch.index * 23, 8, 14)
    };

    const lowerHub = {
      x: seat.x - seededRange(branch.index * 25, 4, 10),
      y: seat.y + seededRange(branch.index * 27, 8, 14)
    };

    addTertiaryBranch(branchLayer, seat, upperHub, 4.9, { terminalId: `${branch.id}_UPPER` });
    addTertiaryBranch(branchLayer, seat, lowerHub, 4.5, { terminalId: `${branch.id}_LOWER` });

    upper.forEach(({ node, pos }) => {
      const anchor = twigAnchor(pos);
      addTwig(branchLayer, upperHub, anchor, { terminalId: node.id });

      const spur = {
        x: upperHub.x + (anchor.x - upperHub.x) * .55 + seededRange(node.index * 31, -4, 4),
        y: upperHub.y + (anchor.y - upperHub.y) * .55 + seededRange(node.index * 37, -4, 4)
      };

      addTwig(branchLayer, spur, anchor, { terminalId: `${node.id}_SPUR` });
    });

    lower.forEach(({ node, pos }) => {
      const anchor = twigAnchor(pos);
      addTwig(branchLayer, lowerHub, anchor, { terminalId: node.id });

      const spur = {
        x: lowerHub.x + (anchor.x - lowerHub.x) * .55 + seededRange(node.index * 41, -4, 4),
        y: lowerHub.y + (anchor.y - lowerHub.y) * .55 + seededRange(node.index * 43, -4, 4)
      };

      addTwig(branchLayer, spur, anchor, { terminalId: `${node.id}_SPUR` });
    });

    return nodePositions;
  }

  function makeButterflies(layer, state) {
    const enabled =
      state.activeTab === "butterflies" ||
      state.activeTab === "wildlife" ||
      state.butterflyVisibility === "visible";

    if (!enabled) return;

    const option = state.activeButterflyOption || "monarch";
    if (option === "none") return;

    const positions = [
      { x: 535, y: 335, scale: 0.94 },
      { x: 1010, y: 286, scale: 0.82 },
      { x: 1174, y: 514, scale: 0.66 },
      { x: 650, y: 556, scale: 0.58 },
      { x: 924, y: 398, scale: 0.74 }
    ];

    positions.forEach((p) => {
      const wingFill =
        option === "blue_morpho_style" ? "#3d91ff" :
        option === "estate_gold_variant" ? "#f2c76f" :
        "#e86d1f";

      const g = s("g", {
        class: "butterfly",
        transform: `translate(${p.x} ${p.y}) scale(${p.scale})`,
        "data-butterfly-option": option,
        "data-butterfly-role": "pollination"
      });

      g.appendChild(s("ellipse", {
        cx: -8,
        cy: -2,
        rx: 10,
        ry: 15,
        transform: "rotate(-28 -8 -2)",
        fill: wingFill,
        stroke: "rgba(8,8,10,.70)",
        "stroke-width": 1.1
      }));

      g.appendChild(s("ellipse", {
        cx: 8,
        cy: -2,
        rx: 10,
        ry: 15,
        transform: "rotate(28 8 -2)",
        fill: wingFill,
        stroke: "rgba(8,8,10,.70)",
        "stroke-width": 1.1
      }));

      g.appendChild(s("path", {
        d: "M 0 -10 L 0 12",
        fill: "none",
        stroke: "rgba(20,12,8,.86)",
        "stroke-width": 2,
        "stroke-linecap": "round"
      }));

      layer.appendChild(g);
    });
  }

  function drawFoliageLayer(svg, state) {
    const data = sourceTree();
    const branchSeats = data.branchSeats;
    const terminalNodes = data.terminalNodes;

    const branchLayer = s("g", {
      class: "svg-layer layer-branches",
      "data-render-layer": "foliage-branches-expanded",
      "data-branch-detail": "expanded"
    });

    const leafLayer = s("g", {
      class: "svg-layer layer-terminals",
      "data-render-layer": "foliage-independent-leaves",
      "data-leaf-count": "256"
    });

    const detailLayer = s("g", {
      class: "svg-layer layer-details",
      "data-render-layer": "foliage-details-expanded"
    });

    for (let canopyIndex = 1; canopyIndex <= 16; canopyIndex += 1) {
      const canopy = canopyPosition(canopyIndex);
      const crownRadius = canopy.ring === 1 ? 98 : 116;

      branchLayer.appendChild(s("ellipse", {
        class: "canopy-shadow",
        cx: canopy.x,
        cy: canopy.y + 22,
        rx: crownRadius,
        ry: crownRadius * 0.38,
        fill: "rgba(0,0,0,.08)"
      }));
    }

    const seatNodeMap = new Map();
    terminalNodes.forEach((node) => {
      if (!seatNodeMap.has(node.branchSeat)) seatNodeMap.set(node.branchSeat, []);
      seatNodeMap.get(node.branchSeat).push(node);
    });

    const allNodePositions = [];

    branchSeats.forEach((branch) => {
      const nodes = seatNodeMap.get(branch.index) || [];
      const positioned = buildSeatNetwork(branch, nodes, branchLayer);
      positioned.forEach((item) => allNodePositions.push(item));
    });

    allNodePositions.forEach(({ node, pos }) => {
      leafLayer.appendChild(makeLeafGroup(node, pos));
    });

    if (state.activeTab === "wildlife") {
      const birds = [
        { x: 474, y: 234, scale: 1.0 },
        { x: 1104, y: 212, scale: 0.82 }
      ];

      birds.forEach((bird) => {
        detailLayer.appendChild(s("path", {
          class: "bird-silhouette",
          d: "M -12 0 Q -6 -6 0 0 Q 6 -6 12 0",
          transform: `translate(${bird.x} ${bird.y}) scale(${bird.scale})`,
          fill: "none",
          stroke: "rgba(210,218,228,.74)",
          "stroke-width": 2.2,
          "stroke-linecap": "round"
        }));
      });
    }

    makeButterflies(detailLayer, state);

    svg.appendChild(branchLayer);
    svg.appendChild(leafLayer);
    svg.appendChild(detailLayer);
  }

  window.DGBIndexFoliage = Object.freeze({
    drawFoliageLayer,
    geometry: Object.freeze({
      canopyPosition,
      branchSeatPosition,
      terminalPosition
    })
  });
})();
