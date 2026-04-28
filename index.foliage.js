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
          const terminalType = terminalTypes[(nodeIndex - 1) % terminalTypes.length];

          terminalNodes.push({
            id: `TERMINAL_${String(nodeIndex).padStart(3, "0")}`,
            index: nodeIndex,
            localIndex: terminalLocal,
            branchSeat: branchIndex,
            canopyCluster: canopy,
            terminalType,
            fruit: { active: terminalType === "fruit" }
          });
        }
      }
    }

    return { branchSeats, terminalNodes };
  }

  function canopyPosition(index) {
    const ring = index <= 8 ? 1 : 2;
    const local = index <= 8 ? index - 1 : index - 9;
    const angle = ring === 1 ? -139 + local * (278 / 7) : -157 + local * (314 / 7);
    const radiusX = ring === 1 ? 330 : 468;
    const radiusY = ring === 1 ? 198 : 282;

    return {
      x: 800 + Math.cos(angle * Math.PI / 180) * radiusX,
      y: 326 + Math.sin(angle * Math.PI / 180) * radiusY,
      angle
    };
  }

  function branchSeatPosition(canopyIndex, branchLocal) {
    const c = canopyPosition(canopyIndex);

    const offsets = [
      { x: -122, y: -72 },
      { x: 116, y: -68 },
      { x: -108, y: 82 },
      { x: 124, y: 84 }
    ];

    const offset = offsets[branchLocal - 1];

    return {
      x: c.x + offset.x,
      y: c.y + offset.y
    };
  }

  function terminalPosition(node) {
    const branchLocal = ((node.branchSeat - 1) % 4) + 1;
    const branch = branchSeatPosition(node.canopyCluster, branchLocal);
    const terminalLocal = ((node.localIndex - 1) % 4) + 1;

    const spreads = [
      { x: -70, y: -52 },
      { x: 66, y: -55 },
      { x: -60, y: 58 },
      { x: 74, y: 53 }
    ];

    const base = spreads[terminalLocal - 1];
    const jitterX = ((node.index * 31) % 43) - 21;
    const jitterY = ((node.index * 43) % 37) - 18;

    return {
      x: branch.x + base.x + jitterX,
      y: branch.y + base.y + jitterY,
      angle: ((node.index * 41) % 154) - 77,
      scale: 0.94 + ((node.index % 9) * 0.05)
    };
  }

  function leafColor(node) {
    const palette = [
      "rgba(25,76,31,.97)",
      "rgba(38,96,38,.96)",
      "rgba(53,116,47,.94)",
      "rgba(71,132,57,.92)",
      "rgba(32,88,35,.95)",
      "rgba(83,143,65,.90)",
      "rgba(44,106,44,.94)"
    ];

    if (node.terminalType === "habitat") return "rgba(146,122,80,.92)";
    return palette[node.index % palette.length];
  }

  function makeLeaf(node, pos) {
    const leaf = s("path", {
      class: "terminal-node terminal-leaf individual-leaf",
      d: "M 0 -18 C 11 -16 19 -8 19 2 C 19 16 5 25 0 32 C -5 25 -19 16 -19 2 C -19 -8 -11 -16 0 -18 Z",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: leafColor(node),
      stroke: "rgba(224,244,208,.28)",
      "stroke-width": 1.05,
      filter: "url(#leafShadow)",
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": node.terminalType,
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat
    });

    const midrib = s("path", {
      class: "leaf-vein",
      d: "M 0 -13 C 1 -3 0 10 0 23",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: "none",
      stroke: "rgba(235,248,220,.38)",
      "stroke-width": 1,
      "stroke-linecap": "round"
    });

    const sideA = s("path", {
      class: "leaf-side-vein",
      d: "M 0 -3 L 9 -9 M 0 4 L 12 -1 M 0 11 L 10 8 M 0 17 L 7 17",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: "none",
      stroke: "rgba(235,248,220,.19)",
      "stroke-width": .7,
      "stroke-linecap": "round"
    });

    const sideB = s("path", {
      class: "leaf-side-vein",
      d: "M 0 -3 L -9 -9 M 0 4 L -12 -1 M 0 11 L -10 8 M 0 17 L -7 17",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: "none",
      stroke: "rgba(235,248,220,.19)",
      "stroke-width": .7,
      "stroke-linecap": "round"
    });

    return [leaf, midrib, sideA, sideB];
  }

  function makeFruit(node, pos) {
    const group = s("g", {
      class: "terminal-fruit-node",
      transform: `translate(${pos.x} ${pos.y})`,
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": "fruit",
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat
    });

    group.appendChild(s("circle", {
      class: "terminal-node terminal-fruit",
      cx: 0,
      cy: 0,
      r: 6.7 * pos.scale,
      fill: "url(#fruitGradient)",
      filter: "url(#fruitGlow)"
    }));

    group.appendChild(s("circle", {
      cx: -2.2 * pos.scale,
      cy: -2.6 * pos.scale,
      r: 1.45 * pos.scale,
      fill: "rgba(255,230,210,.82)"
    }));

    return [group];
  }

  function makeBlossom(node, pos) {
    const group = s("g", {
      class: "terminal-blossom-node",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": "blossom",
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat
    });

    for (let i = 0; i < 5; i += 1) {
      group.appendChild(s("ellipse", {
        class: "terminal-node terminal-blossom",
        cx: Math.cos((i * 72) * Math.PI / 180) * 4.2,
        cy: Math.sin((i * 72) * Math.PI / 180) * 4.2,
        rx: 3.3,
        ry: 5.8,
        transform: `rotate(${i * 72})`,
        fill: "rgba(247,214,222,.92)",
        stroke: "rgba(255,255,255,.28)",
        "stroke-width": .75
      }));
    }

    group.appendChild(s("circle", { cx: 0, cy: 0, r: 2.1, fill: "rgba(242,199,111,.92)" }));

    return [group];
  }

  function makeTerminalNode(node) {
    const pos = terminalPosition(node);
    const shapes = makeLeaf(node, pos);

    if (node.terminalType === "fruit") {
      return shapes.concat(makeFruit(node, { ...pos, scale: pos.scale * 0.70 }));
    }

    if (node.terminalType === "blossom") {
      return shapes.concat(makeBlossom(node, { ...pos, scale: pos.scale * 0.66 }));
    }

    return shapes;
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
      { x: 545, y: 365, scale: 1.1 },
      { x: 1022, y: 292, scale: .9 },
      { x: 1120, y: 535, scale: .75 },
      { x: 672, y: 590, scale: .62 },
      { x: 928, y: 420, scale: .68 }
    ];

    positions.forEach((p) => {
      const g = s("g", {
        class: "butterfly",
        transform: `translate(${p.x} ${p.y}) scale(${p.scale})`,
        "data-butterfly-option": option,
        "data-butterfly-role": "pollination"
      });

      const wingFill =
        option === "blue_morpho_style" ? "#3d91ff" :
        option === "estate_gold_variant" ? "#f2c76f" :
        "#e86d1f";

      g.appendChild(s("ellipse", { cx: -8, cy: -2, rx: 10, ry: 16, transform: "rotate(-28 -8 -2)", fill: wingFill, stroke: "rgba(2,5,10,.72)" }));
      g.appendChild(s("ellipse", { cx: 8, cy: -2, rx: 10, ry: 16, transform: "rotate(28 8 -2)", fill: wingFill, stroke: "rgba(2,5,10,.72)" }));
      g.appendChild(s("path", { d: "M 0 -11 L 0 12", stroke: "rgba(20,12,8,.86)", "stroke-width": 2, "stroke-linecap": "round" }));

      layer.appendChild(g);
    });
  }

  function drawFoliageLayer(svg, state) {
    const data = sourceTree();
    const branchSeats = data.branchSeats;
    const terminalNodes = data.terminalNodes;

    const branchLayer = s("g", {
      class: "svg-layer layer-branches",
      "data-render-layer": "foliage-branches",
      "data-tree-layer": "branch-network"
    });

    const terminalLayer = s("g", {
      class: "svg-layer layer-terminals",
      "data-render-layer": "foliage-terminals",
      "data-tree-layer": "256-visible-independent-leaves"
    });

    const detailLayer = s("g", {
      class: "svg-layer layer-details",
      "data-render-layer": "foliage-details",
      "data-tree-layer": "fruit-wildlife-butterflies"
    });

    const shoulder = { x: 800, y: 452 };

    for (let canopyIndex = 1; canopyIndex <= 16; canopyIndex += 1) {
      const c = canopyPosition(canopyIndex);

      branchLayer.appendChild(s("path", {
        class: "canopy-support-branch",
        d: `M ${shoulder.x} ${shoulder.y} C ${(shoulder.x + c.x) / 2} ${shoulder.y - 62}, ${(shoulder.x + c.x) / 2} ${c.y + 48}, ${c.x} ${c.y}`,
        fill: "none",
        stroke: "rgba(91,54,32,.46)",
        "stroke-width": 7,
        "stroke-linecap": "round",
        "data-canopy": canopyIndex
      }));
    }

    branchSeats.forEach((branch) => {
      const branchLocal = ((branch.localIndex - 1) % 4) + 1;
      const p = branchSeatPosition(branch.canopyCluster, branchLocal);
      const c = canopyPosition(branch.canopyCluster);

      branchLayer.appendChild(s("path", {
        class: "secondary-branch",
        d: `M ${c.x} ${c.y} C ${(c.x + p.x) / 2} ${c.y + 18}, ${(c.x + p.x) / 2} ${p.y - 18}, ${p.x} ${p.y}`,
        fill: "none",
        stroke: "rgba(82,48,28,.80)",
        "stroke-width": 9,
        "stroke-linecap": "round",
        "data-branch-seat": branch.id,
        "data-canopy": branch.canopyCluster
      }));

      terminalNodes
        .filter((node) => node.branchSeat === branch.index)
        .forEach((node) => {
          const t = terminalPosition(node);

          branchLayer.appendChild(s("path", {
            class: "terminal-twig",
            d: `M ${p.x} ${p.y} C ${(p.x + t.x) / 2} ${p.y - 9}, ${(p.x + t.x) / 2} ${t.y + 9}, ${t.x} ${t.y}`,
            fill: "none",
            stroke: "rgba(91,54,32,.62)",
            "stroke-width": 3.4,
            "stroke-linecap": "round",
            "data-terminal-id": node.id
          }));
        });
    });

    terminalNodes.forEach((node) => {
      makeTerminalNode(node).forEach((shape) => terminalLayer.appendChild(shape));
    });

    const selectedNode = terminalNodes.find((node) => node.index === state.terminalIndex);

    if (selectedNode && state.dollLayer === "DOLL_7_FRUIT_AND_WILDLIFE_DETAIL") {
      const label = s("text", {
        class: "structure-label",
        x: 800,
        y: 850,
        "text-anchor": "middle",
        fill: "rgba(255,247,228,.78)",
        "font-size": 18,
        "paint-order": "stroke",
        stroke: "rgba(2,5,10,.72)",
        "stroke-width": 4
      });

      label.textContent = `${selectedNode.id} · ${selectedNode.terminalType}${selectedNode.fruit && selectedNode.fruit.active ? " · fruit active" : ""}`;
      detailLayer.appendChild(label);
    }

    makeButterflies(detailLayer, state);

    svg.appendChild(branchLayer);
    svg.appendChild(terminalLayer);
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
