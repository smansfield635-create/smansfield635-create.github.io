(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const dollCopy = {
    DOLL_1_COMPASS: ["Compass", "Rich Manor and Estate", "Flat stays default. Round opens the Tree of Life. Globe remains later."],
    DOLL_2_ESTATE: ["Estate", "Tree before Manor.", "Snow, road, grass, roots, limbs, branches, leaves, fruit, blossoms, habitat, and butterflies are filtered through one render."],
    DOLL_3_TRUNK_AND_PRIMARY_LIMBS: ["Tree structure", "One trunk. Four primary limbs.", "The render is the single eye. The tree file is the skeleton. Runtime is the signal. CSS is the skin."],
    DOLL_4_CANOPIES: ["Canopy layer", "Canopy emerges from leaves.", "No separate canopy blobs. Canopy is implied by leaf density, branch direction, and terminal structure."],
    DOLL_5_BRANCH_SEATS: ["Branch seats", "Sixty-four branch seats.", "Branch seats expand into visible twigs and leaf clusters without changing the 256 structure."],
    DOLL_6_TERMINAL_NODES: ["Terminal layer", "Two hundred fifty-six structural terminals.", "Each structural terminal expands into visible leaf detail while remaining tied to the 256 map."],
    DOLL_7_FRUIT_AND_WILDLIFE_DETAIL: ["Detail layer", "Fruit, blossoms, habitat, butterflies.", "Detail is filtered by the single render authority and remains subordinate to the tree."]
  };

  function s(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    });
    return node;
  }

  function h(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, String(value));
    });
    (children || []).forEach((child) => {
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });
    return node;
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

  function addDefs(svg) {
    const defs = s("defs");
    defs.innerHTML = `
      <linearGradient id="skyGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#07172c"/>
        <stop offset="52%" stop-color="#172f36"/>
        <stop offset="100%" stop-color="#edf5f7"/>
      </linearGradient>

      <linearGradient id="snowGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#f6fbfd"/>
        <stop offset="58%" stop-color="#d9e5e9"/>
        <stop offset="100%" stop-color="#b6c7ce"/>
      </linearGradient>

      <linearGradient id="barkGradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#1f0d05"/>
        <stop offset="18%" stop-color="#5d311b"/>
        <stop offset="46%" stop-color="#8f5b39"/>
        <stop offset="70%" stop-color="#4a2411"/>
        <stop offset="100%" stop-color="#160802"/>
      </linearGradient>

      <linearGradient id="roadGrain" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#b18f5e"/>
        <stop offset="50%" stop-color="#8b6b43"/>
        <stop offset="100%" stop-color="#5d432b"/>
      </linearGradient>

      <linearGradient id="manorBody" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#283548"/>
        <stop offset="100%" stop-color="#0b1018"/>
      </linearGradient>

      <linearGradient id="manorRoof" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#f2c76f"/>
        <stop offset="100%" stop-color="#563a22"/>
      </linearGradient>

      <radialGradient id="fruitGradient" cx="32%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#ffd2d2"/>
        <stop offset="42%" stop-color="#c42d3d"/>
        <stop offset="100%" stop-color="#610b18"/>
      </radialGradient>

      <filter id="trunkShadow">
        <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000000" flood-opacity=".55"/>
      </filter>

      <filter id="rootShadow">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity=".42"/>
      </filter>

      <filter id="limbShadow">
        <feDropShadow dx="0" dy="13" stdDeviation="9" flood-color="#000000" flood-opacity=".38"/>
      </filter>

      <filter id="leafShadow">
        <feDropShadow dx="0" dy="3.5" stdDeviation="2.3" flood-color="#000000" flood-opacity=".30"/>
      </filter>

      <filter id="roadShadow">
        <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000000" flood-opacity=".35"/>
      </filter>

      <filter id="fruitGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f2c76f" flood-opacity=".22"/>
      </filter>
    `;
    svg.appendChild(defs);
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

  function pathCubic(start, c1, c2, end) {
    return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
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

  function leafFill(seed, type) {
    if (type === "habitat") return "rgba(146,122,80,.90)";

    const palette = [
      "rgba(48,110,56,.94)",
      "rgba(67,130,70,.93)",
      "rgba(56,120,62,.95)",
      "rgba(80,142,76,.91)",
      "rgba(41,97,49,.95)",
      "rgba(92,151,86,.89)",
      "rgba(58,114,57,.94)",
      "rgba(38,92,48,.96)",
      "rgba(71,122,64,.92)"
    ];

    return palette[Math.abs(seed) % palette.length];
  }

  function leafEdge(seed) {
    const palette = [
      "rgba(214,236,198,.22)",
      "rgba(225,244,214,.18)",
      "rgba(193,221,177,.24)",
      "rgba(238,248,222,.16)"
    ];

    return palette[Math.abs(seed) % palette.length];
  }

  function drawSceneBase(svg) {
    const layer = s("g", { class: "svg-layer layer-estate", "data-render-pass": "PASS_1_SCENE_BASE" });

    layer.appendChild(s("rect", { x: 0, y: 0, width: 1600, height: 900, fill: "url(#skyGradient)" }));

    layer.appendChild(s("path", {
      d: "M 0 392 C 240 336, 418 382, 600 348 C 858 302, 1058 348, 1600 310 L 1600 900 L 0 900 Z",
      fill: "rgba(31,68,47,.58)"
    }));

    layer.appendChild(s("path", {
      d: "M 0 450 C 260 430, 480 470, 760 420 C 1050 365, 1250 442, 1600 392 L 1600 900 L 0 900 Z",
      fill: "url(#snowGradient)"
    }));

    layer.appendChild(s("path", {
      class: "tree-road",
      d: "M 360 900 C 420 740, 520 660, 684 644 C 770 636, 838 636, 916 644 C 1080 660, 1180 740, 1240 900",
      fill: "none",
      stroke: "url(#roadGrain)",
      "stroke-width": 52,
      "stroke-linecap": "round",
      filter: "url(#roadShadow)"
    }));

    layer.appendChild(s("path", {
      class: "tree-road-snow",
      d: "M 360 900 C 420 740, 520 660, 684 644 C 770 636, 838 636, 916 644 C 1080 660, 1180 740, 1240 900",
      fill: "none",
      stroke: "rgba(239,246,248,.36)",
      "stroke-width": 9,
      "stroke-dasharray": "18 26",
      "stroke-linecap": "round"
    }));

    const grass = s("g", { "data-detail-layer": "grass" });
    for (let i = 0; i < 310; i += 1) {
      const x = 70 + ((i * 73) % 1460);
      const y = 720 + ((i * 41) % 160);
      const height = 10 + ((i * 17) % 42);
      const lean = ((i % 7) - 3) * 2.5;

      grass.appendChild(s("path", {
        class: "grass-blade-svg",
        d: `M ${x} ${y} C ${x + lean} ${y - height * .35}, ${x + lean * .4} ${y - height * .68}, ${x + lean} ${y - height}`,
        fill: "none",
        stroke: "rgba(77,111,52,.82)",
        "stroke-width": 2,
        "stroke-linecap": "round"
      }));

      if (i % 5 === 0) {
        grass.appendChild(s("path", {
          class: "grass-snow-tip",
          d: `M ${x + lean - 1} ${y - height} L ${x + lean + 3} ${y - height - 2}`,
          fill: "none",
          stroke: "rgba(239,246,248,.72)",
          "stroke-width": 1,
          "stroke-linecap": "round"
        }));
      }
    }

    layer.appendChild(grass);
    svg.appendChild(layer);
  }

  function drawManor(svg) {
    const manor = s("g", { class: "svg-layer layer-estate", "data-render-pass": "PASS_1_MANOR" });

    manor.appendChild(s("polygon", {
      points: "585,338 800,205 1015,338",
      fill: "url(#manorRoof)",
      stroke: "rgba(242,199,111,.35)",
      "stroke-width": 2
    }));

    manor.appendChild(s("rect", {
      x: 565,
      y: 338,
      width: 470,
      height: 155,
      rx: 18,
      fill: "url(#manorBody)",
      stroke: "rgba(242,199,111,.28)",
      "stroke-width": 2
    }));

    [615, 715, 841, 941].forEach((x, index) => {
      manor.appendChild(s("rect", {
        x,
        y: 382,
        width: 44,
        height: 72,
        rx: 6,
        fill: index === 0 || index === 3 ? "rgba(242,199,111,.33)" : "rgba(242,199,111,.25)"
      }));
    });

    const label = s("text", {
      x: 800,
      y: 475,
      "text-anchor": "middle",
      fill: "rgba(255,247,228,.78)",
      "font-size": 18,
      "paint-order": "stroke",
      stroke: "rgba(2,5,10,.72)",
      "stroke-width": 4
    });

    label.textContent = "Rich Manor";
    manor.appendChild(label);
    svg.appendChild(manor);
  }

  function drawTreeStructure(svg) {
    const trunkLayer = s("g", { class: "svg-layer layer-limbs", "data-render-pass": "PASS_2_TREE_STRUCTURE" });

    trunkLayer.appendChild(s("path", {
      class: "tree-trunk",
      d: "M 718 792 C 746 674, 750 556, 780 434 C 792 390, 815 390, 827 434 C 860 556, 854 674, 888 792 Z",
      fill: "url(#barkGradient)",
      stroke: "rgba(35,18,9,.94)",
      "stroke-width": 4,
      filter: "url(#trunkShadow)"
    }));

    [
      "M 800 760 C 725 782, 650 818, 560 850",
      "M 805 762 C 890 788, 984 822, 1060 858",
      "M 785 748 C 740 790, 700 840, 690 895",
      "M 820 748 C 865 790, 900 842, 910 895"
    ].forEach((path) => {
      trunkLayer.appendChild(s("path", {
        class: "root-structure",
        d: path,
        fill: "none",
        stroke: "rgba(95,54,30,.95)",
        "stroke-width": 23,
        "stroke-linecap": "round",
        filter: "url(#rootShadow)"
      }));
    });

    [
      "M 720 790 C 670 810, 620 832, 560 850",
      "M 878 792 C 935 814, 996 838, 1060 858"
    ].forEach((path) => {
      trunkLayer.appendChild(s("path", {
        class: "root-snow",
        d: path,
        fill: "none",
        stroke: "rgba(239,246,248,.56)",
        "stroke-width": 7,
        "stroke-linecap": "round"
      }));
    });

    for (let i = 0; i < 92; i += 1) {
      const x = 745 + (i * 13) % 110;
      const y1 = 432 + (i * 29) % 308;
      const y2 = y1 + 34 + (i % 5) * 12;

      trunkLayer.appendChild(s("path", {
        class: i % 3 === 0 ? "bark-highlight" : "bark-fissure",
        d: `M ${x} ${y1} C ${x - 12 + i % 9} ${y1 + 22}, ${x + 9 - i % 8} ${y2 - 16}, ${x + 2} ${y2}`,
        fill: "none",
        stroke: i % 3 === 0 ? "rgba(235,205,150,.24)" : "rgba(28,14,7,.72)",
        "stroke-width": i % 3 === 0 ? 2 : 3,
        "stroke-linecap": "round"
      }));
    }

    const shoulder = { x: 800, y: 452 };

    [
      { x: 344, y: 235, c1: { x: 720, y: 410 }, c2: { x: 536, y: 274 } },
      { x: 604, y: 112, c1: { x: 770, y: 380 }, c2: { x: 688, y: 172 } },
      { x: 996, y: 112, c1: { x: 830, y: 380 }, c2: { x: 912, y: 172 } },
      { x: 1256, y: 235, c1: { x: 880, y: 410 }, c2: { x: 1064, y: 274 } }
    ].forEach((target, index) => {
      trunkLayer.appendChild(s("path", {
        class: "primary-limb",
        d: pathCubic(shoulder, target.c1, target.c2, { x: target.x, y: target.y }),
        fill: "none",
        stroke: "rgba(78,42,22,.96)",
        "stroke-width": 28,
        "stroke-linecap": "round",
        filter: "url(#limbShadow)",
        "data-primary-limb": index + 1
      }));
    });

    svg.appendChild(trunkLayer);
  }

  function appendLeafShape(group, attrs) {
    group.appendChild(s("path", {
      class: attrs.className,
      d: leafPath(attrs.variant || 1),
      transform: `translate(${attrs.x} ${attrs.y}) rotate(${attrs.angle}) scale(${attrs.scale})`,
      fill: attrs.fill,
      stroke: attrs.stroke,
      "stroke-width": attrs.strokeWidth || 0.85,
      filter: "url(#leafShadow)",
      "data-leaf-role": attrs.role,
      "data-structural-terminal": attrs.structuralTerminal ? "true" : "false",
      "data-parent-terminal": attrs.parentTerminal,
      "data-parent-branch-seat": attrs.parentBranchSeat,
      "data-canopy": attrs.canopy
    }));

    group.appendChild(s("path", {
      class: "leaf-midrib",
      d: "M 0 -13 C 1 -4 0 8 0 22",
      transform: `translate(${attrs.x} ${attrs.y}) rotate(${attrs.angle}) scale(${attrs.scale})`,
      fill: "none",
      stroke: attrs.midrib || "rgba(235,248,220,.25)",
      "stroke-width": attrs.structuralTerminal ? 0.95 : 0.62,
      "stroke-linecap": "round"
    }));
  }

  function makeLeafCluster(node, pos) {
    const cluster = s("g", {
      class: "terminal-node-group terminal-leaf-cluster",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": node.terminalType,
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat,
      "data-leaf-cluster": "expanded",
      "data-structural-terminal-count": "1",
      "data-detail-leaf-count": "5"
    });

    cluster.appendChild(s("path", {
      d: "M 0 28 C 0 23, 0 18, 0 14",
      fill: "none",
      stroke: "rgba(86,62,35,.85)",
      "stroke-width": 1.4,
      "stroke-linecap": "round"
    }));

    [
      { x: -17, y: -8, angle: -34, scale: 0.62 },
      { x: 16, y: -10, angle: 31, scale: 0.66 },
      { x: -20, y: 10, angle: -58, scale: 0.56 },
      { x: 21, y: 11, angle: 54, scale: 0.58 },
      { x: 0, y: -23, angle: 0, scale: 0.52 }
    ].forEach((leaf, index) => {
      const seed = node.index * 10 + index;
      appendLeafShape(cluster, {
        className: "terminal-node terminal-leaf detail-leaf",
        x: leaf.x + seededRange(seed * 31, -3, 3),
        y: leaf.y + seededRange(seed * 37, -3, 3),
        angle: leaf.angle + seededRange(seed * 41, -9, 9),
        scale: leaf.scale + seededRange(seed * 43, -0.04, 0.05),
        fill: leafFill(seed, node.terminalType),
        stroke: leafEdge(seed),
        variant: (seed % 4) + 1,
        role: "detail-leaf",
        structuralTerminal: false,
        parentTerminal: node.id,
        parentBranchSeat: node.branchSeat,
        canopy: node.canopyCluster,
        midrib: "rgba(235,248,220,.18)"
      });
    });

    appendLeafShape(cluster, {
      className: "terminal-node terminal-leaf individual-leaf structural-terminal-leaf",
      x: 0,
      y: 0,
      angle: 0,
      scale: 1,
      fill: leafFill(node.index, node.terminalType),
      stroke: leafEdge(node.index),
      strokeWidth: 1.05,
      variant: (node.index % 4) + 1,
      role: "structural-terminal-leaf",
      structuralTerminal: true,
      parentTerminal: node.id,
      parentBranchSeat: node.branchSeat,
      canopy: node.canopyCluster,
      midrib: "rgba(235,248,220,.32)"
    });

    if (node.terminalType === "fruit") {
      cluster.appendChild(s("path", { d: "M 1 2 C 4 -5, 8 -9, 12 -12", fill: "none", stroke: "rgba(83,56,34,.82)", "stroke-width": 1.4, "stroke-linecap": "round" }));
      cluster.appendChild(s("circle", { class: "terminal-fruit", cx: 14, cy: -13, r: 4.8, fill: "url(#fruitGradient)", filter: "url(#fruitGlow)" }));
      cluster.appendChild(s("circle", { cx: 12.7, cy: -14.5, r: 1.2, fill: "rgba(255,231,216,.70)" }));
    }

    if (node.terminalType === "blossom") {
      const blossom = s("g", { class: "terminal-blossom-cluster", transform: "translate(-11,-11) scale(.68)" });
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
      blossom.appendChild(s("circle", { cx: 0, cy: 0, r: 1.8, fill: "rgba(242,199,111,.92)" }));
      cluster.appendChild(blossom);
    }

    if (node.terminalType === "habitat") {
      cluster.appendChild(s("ellipse", { cx: -10, cy: -5, rx: 5.5, ry: 3.6, fill: "rgba(119,92,58,.74)", stroke: "rgba(42,26,14,.68)", "stroke-width": 0.9 }));
      cluster.appendChild(s("circle", { cx: -12, cy: -5, r: 1.1, fill: "rgba(20,10,4,.85)" }));
      cluster.appendChild(s("circle", { cx: -8, cy: -5, r: 1.1, fill: "rgba(20,10,4,.85)" }));
    }

    return cluster;
  }

  function twigAnchor(pos) {
    const angle = degToRad(pos.angle + 90);
    return {
      x: pos.x + Math.cos(angle) * 13 * pos.scale,
      y: pos.y + Math.sin(angle) * 13 * pos.scale
    };
  }

  function drawBranchFrameAndTerminals(svg, state) {
    const data = sourceTree();
    const branchSeats = data.branchSeats;
    const terminalNodes = data.terminalNodes;

    const branchLayer = s("g", { class: "svg-layer layer-branches", "data-render-pass": "PASS_3_BRANCH_FRAME" });
    const leafLayer = s("g", {
      class: "svg-layer layer-terminals",
      "data-render-pass": "PASS_4_5_TERMINAL_AND_DENSITY_FILTER",
      "data-structural-terminals": "256",
      "data-detail-leaves": "1280",
      "data-total-visible-leaves": "1536"
    });

    const detailLayer = s("g", { class: "svg-layer layer-details", "data-render-pass": "PASS_7_DETAIL_FILTER" });
    const seatNodeMap = new Map();

    terminalNodes.forEach((node) => {
      if (!seatNodeMap.has(node.branchSeat)) seatNodeMap.set(node.branchSeat, []);
      seatNodeMap.get(node.branchSeat).push(node);
    });

    for (let canopyIndex = 1; canopyIndex <= 16; canopyIndex += 1) {
      const canopy = canopyPosition(canopyIndex);
      branchLayer.appendChild(s("ellipse", {
        class: "canopy-shadow",
        cx: canopy.x,
        cy: canopy.y + 22,
        rx: canopy.ring === 1 ? 98 : 116,
        ry: canopy.ring === 1 ? 37 : 44,
        fill: "rgba(0,0,0,.08)"
      }));
    }

    branchSeats.forEach((branch) => {
      const canopy = canopyPosition(branch.canopyCluster);
      const seat = branchSeatPosition(branch.canopyCluster, branch.localIndex);

      branchLayer.appendChild(s("path", {
        class: "secondary-branch",
        d: `M ${canopy.x} ${canopy.y} C ${(canopy.x + seat.x) / 2} ${canopy.y - 10}, ${(canopy.x + seat.x) / 2} ${seat.y + 10}, ${seat.x} ${seat.y}`,
        fill: "none",
        stroke: "rgba(82,48,28,.86)",
        "stroke-width": 7.8,
        "stroke-linecap": "round",
        "data-canopy": branch.canopyCluster,
        "data-branch-seat": branch.id
      }));

      const nodes = seatNodeMap.get(branch.index) || [];
      const positioned = nodes.map((node) => ({ node, pos: terminalPosition(node) }));
      const upperHub = { x: seat.x + seededRange(branch.index * 21, 6, 12), y: seat.y - seededRange(branch.index * 23, 8, 14) };
      const lowerHub = { x: seat.x - seededRange(branch.index * 25, 4, 10), y: seat.y + seededRange(branch.index * 27, 8, 14) };

      [upperHub, lowerHub].forEach((hub, index) => {
        branchLayer.appendChild(s("path", {
          class: "tertiary-branch",
          d: `M ${seat.x} ${seat.y} C ${seat.x + (hub.x - seat.x) * .42} ${seat.y - 8}, ${seat.x + (hub.x - seat.x) * .72} ${hub.y + 8}, ${hub.x} ${hub.y}`,
          fill: "none",
          stroke: "rgba(96,57,34,.90)",
          "stroke-width": index === 0 ? 4.9 : 4.5,
          "stroke-linecap": "round"
        }));
      });

      positioned.forEach(({ node, pos }) => {
        const anchor = twigAnchor(pos);
        const hub = node.localIndex <= 2 ? upperHub : lowerHub;

        branchLayer.appendChild(s("path", {
          class: "terminal-twig",
          d: `M ${hub.x} ${hub.y} C ${hub.x + (anchor.x - hub.x) * .38} ${hub.y - 4}, ${hub.x + (anchor.x - hub.x) * .74} ${anchor.y + 4}, ${anchor.x} ${anchor.y}`,
          fill: "none",
          stroke: "rgba(108,68,42,.84)",
          "stroke-width": 1.85,
          "stroke-linecap": "round",
          "data-terminal-id": node.id
        }));

        leafLayer.appendChild(makeLeafCluster(node, pos));
      });
    });

    drawButterflies(detailLayer, state);

    svg.appendChild(branchLayer);
    svg.appendChild(leafLayer);
    svg.appendChild(detailLayer);
  }

  function drawButterflies(layer, state) {
    const enabled = state.activeTab === "butterflies" || state.activeTab === "wildlife" || state.butterflyVisibility === "visible";
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
      const wingFill = option === "blue_morpho_style" ? "#3d91ff" : option === "estate_gold_variant" ? "#f2c76f" : "#e86d1f";
      const g = s("g", { class: "butterfly", transform: `translate(${p.x} ${p.y}) scale(${p.scale})`, "data-butterfly-option": option, "data-butterfly-role": "pollination" });

      g.appendChild(s("ellipse", { cx: -8, cy: -2, rx: 10, ry: 15, transform: "rotate(-28 -8 -2)", fill: wingFill, stroke: "rgba(8,8,10,.70)", "stroke-width": 1.1 }));
      g.appendChild(s("ellipse", { cx: 8, cy: -2, rx: 10, ry: 15, transform: "rotate(28 8 -2)", fill: wingFill, stroke: "rgba(8,8,10,.70)", "stroke-width": 1.1 }));
      g.appendChild(s("path", { d: "M 0 -10 L 0 12", fill: "none", stroke: "rgba(20,12,8,.86)", "stroke-width": 2, "stroke-linecap": "round" }));

      layer.appendChild(g);
    });
  }

  function drawReceipt(svg) {
    const receipt = s("g", { class: "svg-layer layer-details", "data-render-pass": "PASS_8_RECEIPT_MARKERS" });
    receipt.appendChild(s("metadata", {
      "data-render-filter": "single-authority",
      "data-structural-terminals": "256",
      "data-detail-leaves": "1280",
      "data-total-visible-leaves": "1536",
      "data-generation-readiness": "GEN_1_3D_BASELINE",
      "data-core-experience-hold": "true"
    }));
    svg.appendChild(receipt);
  }

  function renderSceneCopy(root, state) {
    if (state.mode === "round") return;

    const copy = dollCopy[state.dollLayer] || dollCopy.DOLL_1_COMPASS;
    root.appendChild(h("article", { className: "scene-copy-card" }, [
      h("p", { className: "kicker", text: copy[0] }),
      h("h2", { text: copy[1] }),
      h("p", { text: copy[2] })
    ]));
  }

  function baseSvg(label) {
    const svg = s("svg", { class: "tree-svg", viewBox: "0 0 1600 900", role: "img", "aria-label": label });
    addDefs(svg);
    drawSceneBase(svg);
    drawManor(svg);
    return svg;
  }

  function renderFlat(root, state) {
    const scene = h("section", { className: "tree-scene flat-tree-scene", "aria-label": "Flat World route map" });
    const svg = baseSvg("Flat World verified route map for Rich Manor and Estate");
    const mapLayer = s("g", { class: "svg-layer layer-estate", "data-render-pass": "FLAT_MAP" });

    [
      { x: 800, y: 300, label: "Compass" },
      { x: 520, y: 470, label: "Door" },
      { x: 800, y: 500, label: "Home" },
      { x: 1080, y: 470, label: "Products" },
      { x: 640, y: 665, label: "Showroom" },
      { x: 960, y: 665, label: "Gauges" }
    ].forEach((item) => {
      mapLayer.appendChild(s("circle", { cx: item.x, cy: item.y, r: 54, fill: "rgba(3,7,12,.72)", stroke: "rgba(242,199,111,.46)", "stroke-width": 2 }));
      const text = s("text", { x: item.x, y: item.y + 7, "text-anchor": "middle", fill: "rgba(255,247,228,.78)", "font-size": 18, "paint-order": "stroke", stroke: "rgba(2,5,10,.72)", "stroke-width": 4 });
      text.textContent = item.label;
      mapLayer.appendChild(text);
    });

    svg.appendChild(mapLayer);
    scene.appendChild(svg);
    root.appendChild(scene);
    renderSceneCopy(root, state);
  }

  function renderGlobe(root, state) {
    const scene = h("section", { className: "tree-scene globe-hold-scene", "aria-label": "Globe view locked later" });
    const svg = baseSvg("Globe view locked later");
    svg.appendChild(s("circle", { cx: 800, cy: 455, r: 190, fill: "rgba(98,145,180,.24)", stroke: "rgba(242,199,111,.40)", "stroke-width": 3 }));
    const label = s("text", { x: 800, y: 462, "text-anchor": "middle", fill: "rgba(255,247,228,.78)", "font-size": 18, "paint-order": "stroke", stroke: "rgba(2,5,10,.72)", "stroke-width": 4 });
    label.textContent = "GLOBE / META LOCKED LATER";
    svg.appendChild(label);
    scene.appendChild(svg);
    root.appendChild(scene);
    renderSceneCopy(root, state);
  }

  function renderRound(root, state) {
    const scene = h("section", {
      className: "tree-scene round-tree-scene",
      "aria-label": "Round World Tree of Life with one render filter",
      "data-tree-structure": "256",
      "data-doll-layer": state.dollLayer,
      "data-render-filter": "single-authority"
    });

    const svg = baseSvg("Single render filter Tree of Life scene with trunk, branches, 256 structural terminals, expanded leaves, fruit, blossoms, habitat, butterflies, snow, and grass");

    drawTreeStructure(svg);
    drawBranchFrameAndTerminals(svg, state);
    drawReceipt(svg);

    scene.appendChild(svg);
    root.appendChild(scene);
  }

  function normalizeState(state) {
    return Object.assign({
      mode: "flat",
      dollLayer: "DOLL_1_COMPASS",
      activeTab: "overview",
      canopyIndex: 1,
      branchSeatIndex: 1,
      terminalIndex: 1,
      activeButterflyOption: "none",
      butterflyVisibility: "hidden"
    }, state || {});
  }

  function render(state, root) {
    if (!root) return;

    const next = normalizeState(state);
    root.replaceChildren();

    root.dataset.renderStatus = "rendering";
    root.dataset.activeMode = next.mode;
    root.dataset.dollLayer = next.dollLayer;
    root.dataset.activeTab = next.activeTab;
    root.dataset.canopyIndex = String(next.canopyIndex);
    root.dataset.branchSeatIndex = String(next.branchSeatIndex);
    root.dataset.terminalIndex = String(next.terminalIndex);
    root.dataset.activeButterflyOption = next.activeButterflyOption;
    root.dataset.butterflyVisibility = next.butterflyVisibility;
    root.dataset.renderFilter = "single-authority";
    root.dataset.structuralTerminals = "256";
    root.dataset.detailLeaves = "1280";
    root.dataset.totalVisibleLeaves = "1536";

    if (next.mode === "round") renderRound(root, next);
    else if (next.mode === "globe") renderGlobe(root, next);
    else renderFlat(root, next);

    root.dataset.renderStatus = "complete";
  }

  window.DGBIndexRender = Object.freeze({ render });
})();
