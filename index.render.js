(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const dollCopy = {
    DOLL_1_COMPASS: [
      "Compass",
      "Rich Manor and Estate",
      "Flat stays default. Round opens the Tree of Life. Globe remains later."
    ],
    DOLL_2_ESTATE: [
      "Estate",
      "Tree before Manor.",
      "Snow, road, grass, roots, branches, leaves, fruit, blossoms, and habitat details now build the scene."
    ],
    DOLL_3_TRUNK_AND_PRIMARY_LIMBS: [
      "Tree structure",
      "One trunk. Four primary limbs.",
      "The tree opens from trunk authority into branch-supported foliage."
    ],
    DOLL_4_CANOPIES: [
      "Canopy layer",
      "Canopy emerges from leaves.",
      "No green canopy blobs. The canopy is implied by independent leaves and terminal nodes."
    ],
    DOLL_5_BRANCH_SEATS: [
      "Branch seats",
      "Sixty-four branch seats.",
      "Each branch seat carries four terminal expressions from the 256 structure."
    ],
    DOLL_6_TERMINAL_NODES: [
      "Terminal layer",
      "Two hundred fifty-six visible terminals.",
      "Leaves are independent objects with veins, stems, rotation, and branch attachment."
    ],
    DOLL_7_FRUIT_AND_WILDLIFE_DETAIL: [
      "Detail layer",
      "Fruit, butterflies, blossoms, habitat.",
      "Fruit and wildlife remain controlled detail layers. The tree still stays oak-bound."
    ]
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
        <feDropShadow dx="0" dy="4" stdDeviation="2.7" flood-color="#000000" flood-opacity=".34"/>
      </filter>

      <filter id="roadShadow">
        <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000000" flood-opacity=".35"/>
      </filter>

      <filter id="fruitGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f2c76f" flood-opacity=".18"/>
      </filter>
    `;

    svg.appendChild(defs);
  }

  function pathCubic(start, c1, c2, end) {
    return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
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
      for (let localBranch = 1; localBranch <= 4; localBranch += 1) {
        const branchIndex = ((canopy - 1) * 4) + localBranch;

        branchSeats.push({
          id: `BRANCH_SEAT_${String(branchIndex).padStart(2, "0")}`,
          index: branchIndex,
          localIndex: localBranch,
          canopyCluster: canopy
        });

        for (let localNode = 1; localNode <= 4; localNode += 1) {
          const nodeIndex = ((branchIndex - 1) * 4) + localNode;
          terminalNodes.push({
            id: `TERMINAL_${String(nodeIndex).padStart(3, "0")}`,
            index: nodeIndex,
            localIndex: localNode,
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

  function canopyPosition(index) {
    const ring = index <= 8 ? 1 : 2;
    const local = index <= 8 ? index - 1 : index - 9;
    const angle = ring === 1 ? -137 + local * (274 / 7) : -154 + local * (308 / 7);
    const radiusX = ring === 1 ? 315 : 445;
    const radiusY = ring === 1 ? 188 : 268;

    return {
      x: 800 + Math.cos(angle * Math.PI / 180) * radiusX,
      y: 326 + Math.sin(angle * Math.PI / 180) * radiusY,
      angle
    };
  }

  function branchSeatPosition(canopyIndex, branchLocal) {
    const c = canopyPosition(canopyIndex);

    const offsets = [
      { x: -108, y: -62 },
      { x: 98, y: -58 },
      { x: -92, y: 70 },
      { x: 104, y: 72 }
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
      { x: -58, y: -40 },
      { x: 54, y: -43 },
      { x: -48, y: 46 },
      { x: 61, y: 41 }
    ];

    const base = spreads[terminalLocal - 1];
    const jitterX = ((node.index * 31) % 37) - 18;
    const jitterY = ((node.index * 43) % 31) - 15;

    return {
      x: branch.x + base.x + jitterX,
      y: branch.y + base.y + jitterY,
      angle: ((node.index * 41) % 148) - 74,
      scale: 0.82 + ((node.index % 7) * 0.055)
    };
  }

  function drawSkyGround(svg) {
    const layer = s("g", { class: "svg-layer layer-estate", "data-scene-layer": "estate-ground" });

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

    for (let i = 0; i < 280; i += 1) {
      const x = 78 + ((i * 73) % 1445);
      const y = 720 + ((i * 41) % 160);
      const height = 10 + ((i * 17) % 38);
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

    const tracks = s("g", { class: "svg-layer layer-details", "data-detail-layer": "tracks" });

    for (let i = 0; i < 22; i += 1) {
      const x = 530 + (i * 23);
      const y = 784 - (i % 7) * 10;

      tracks.appendChild(s("ellipse", {
        class: "track-mark",
        cx: x,
        cy: y,
        rx: 10,
        ry: 4,
        transform: `rotate(${i % 2 ? 16 : -18} ${x} ${y})`,
        fill: "none",
        stroke: "rgba(67,70,68,.42)",
        "stroke-width": 3,
        "stroke-linecap": "round"
      }));
    }

    layer.appendChild(grass);
    layer.appendChild(tracks);
    svg.appendChild(layer);
  }

  function drawManor(svg) {
    const manor = s("g", { class: "svg-layer layer-estate", "data-object": "manor" });

    manor.appendChild(s("polygon", { class: "manor-roof-svg", points: "585,338 800,205 1015,338", fill: "url(#manorRoof)" }));
    manor.appendChild(s("rect", { class: "manor-body-svg", x: 565, y: 338, width: 470, height: 155, rx: 18, fill: "url(#manorBody)" }));

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
      class: "structure-label",
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

  function drawButterflies(layer, state) {
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

  function leafColor(node) {
    const palette = [
      "rgba(28,78,31,.96)",
      "rgba(42,100,39,.94)",
      "rgba(57,120,48,.92)",
      "rgba(76,135,58,.90)",
      "rgba(34,91,36,.94)",
      "rgba(87,142,67,.88)"
    ];

    if (node.terminalType === "habitat") return "rgba(151,126,82,.90)";
    return palette[node.index % palette.length];
  }

  function makeLeaf(node, pos) {
    const leaf = s("path", {
      class: "terminal-node terminal-leaf individual-leaf",
      d: "M 0 -17 C 10 -15 17 -7 17 2 C 17 15 4 22 0 29 C -4 22 -17 15 -17 2 C -17 -7 -10 -15 0 -17 Z",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: leafColor(node),
      stroke: "rgba(224,244,208,.24)",
      "stroke-width": 1,
      filter: "url(#leafShadow)",
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": node.terminalType,
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat
    });

    const midrib = s("path", {
      class: "leaf-vein",
      d: "M 0 -12 C 1 -3 0 9 0 20",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: "none",
      stroke: "rgba(235,248,220,.34)",
      "stroke-width": .95,
      "stroke-linecap": "round"
    });

    const sideA = s("path", {
      class: "leaf-side-vein",
      d: "M 0 -2 L 8 -7 M 0 4 L 10 0 M 0 10 L 8 8 M 0 15 L 6 15",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: "none",
      stroke: "rgba(235,248,220,.18)",
      "stroke-width": .65,
      "stroke-linecap": "round"
    });

    const sideB = s("path", {
      class: "leaf-side-vein",
      d: "M 0 -2 L -8 -7 M 0 4 L -10 0 M 0 10 L -8 8 M 0 15 L -6 15",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: "none",
      stroke: "rgba(235,248,220,.18)",
      "stroke-width": .65,
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
      r: 6.4 * pos.scale,
      fill: "url(#fruitGradient)",
      filter: "url(#fruitGlow)"
    }));

    group.appendChild(s("circle", {
      cx: -2.1 * pos.scale,
      cy: -2.4 * pos.scale,
      r: 1.4 * pos.scale,
      fill: "rgba(255,230,210,.78)"
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
        rx: 3.1,
        ry: 5.5,
        transform: `rotate(${i * 72})`,
        fill: "rgba(247,214,222,.90)",
        stroke: "rgba(255,255,255,.25)",
        "stroke-width": .7
      }));
    }

    group.appendChild(s("circle", { cx: 0, cy: 0, r: 2, fill: "rgba(242,199,111,.90)" }));

    return [group];
  }

  function makeTerminalNode(node) {
    const pos = terminalPosition(node);
    const baseLeaf = makeLeaf(node, pos);

    if (node.terminalType === "fruit") return baseLeaf.concat(makeFruit(node, { ...pos, scale: pos.scale * 0.72 }));
    if (node.terminalType === "blossom") return baseLeaf.concat(makeBlossom(node, { ...pos, scale: pos.scale * 0.68 }));

    return baseLeaf;
  }

  function drawTree(svg, state) {
    const data = sourceTree();
    const branchSeats = data.branchSeats;
    const terminalNodes = data.terminalNodes;

    const trunkLayer = s("g", { class: "svg-layer layer-limbs", "data-tree-layer": "trunk-primary-limbs" });
    const branchLayer = s("g", { class: "svg-layer layer-branches", "data-tree-layer": "branch-network" });
    const terminalLayer = s("g", { class: "svg-layer layer-terminals", "data-tree-layer": "256-visible-independent-leaves" });
    const detailLayer = s("g", { class: "svg-layer layer-details", "data-tree-layer": "fruit-wildlife-butterflies" });

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

    for (let i = 0; i < 84; i += 1) {
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

    drawButterflies(detailLayer, state);

    [trunkLayer, branchLayer, terminalLayer, detailLayer].forEach((layer) => svg.appendChild(layer));
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
    const svg = s("svg", {
      class: "tree-svg",
      viewBox: "0 0 1600 900",
      role: "img",
      "aria-label": label
    });

    addDefs(svg);
    drawSkyGround(svg);
    drawManor(svg);

    return svg;
  }

  function renderFlat(root, state) {
    const scene = h("section", { className: "tree-scene flat-tree-scene", "aria-label": "Flat World route map" });
    const svg = baseSvg("Flat World verified route map for Rich Manor and Estate");

    const mapLayer = s("g", { class: "svg-layer layer-estate" });

    [
      { x: 800, y: 300, label: "Compass" },
      { x: 520, y: 470, label: "Door" },
      { x: 800, y: 500, label: "Home" },
      { x: 1080, y: 470, label: "Products" },
      { x: 640, y: 665, label: "Showroom" },
      { x: 960, y: 665, label: "Gauges" }
    ].forEach((item) => {
      mapLayer.appendChild(s("circle", {
        cx: item.x,
        cy: item.y,
        r: 54,
        fill: "rgba(3,7,12,.72)",
        stroke: "rgba(242,199,111,.46)",
        "stroke-width": 2
      }));

      const text = s("text", {
        class: "structure-label",
        x: item.x,
        y: item.y + 7,
        "text-anchor": "middle",
        fill: "rgba(255,247,228,.78)",
        "font-size": 18,
        "paint-order": "stroke",
        stroke: "rgba(2,5,10,.72)",
        "stroke-width": 4
      });

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

    svg.appendChild(s("circle", {
      cx: 800,
      cy: 455,
      r: 190,
      fill: "rgba(98,145,180,.24)",
      stroke: "rgba(242,199,111,.40)",
      "stroke-width": 3
    }));

    const label = s("text", {
      class: "structure-label",
      x: 800,
      y: 462,
      "text-anchor": "middle",
      fill: "rgba(255,247,228,.78)",
      "font-size": 18,
      "paint-order": "stroke",
      stroke: "rgba(2,5,10,.72)",
      "stroke-width": 4
    });

    label.textContent = "GLOBE / META LOCKED LATER";
    svg.appendChild(label);

    scene.appendChild(svg);
    root.appendChild(scene);
    renderSceneCopy(root, state);
  }

  function renderRound(root, state) {
    const scene = h("section", {
      className: "tree-scene round-tree-scene",
      "aria-label": "Round World Tree of Life with visible independent leaves",
      "data-tree-structure": "256",
      "data-doll-layer": state.dollLayer
    });

    const svg = baseSvg("Tree of Life scene with visible independent leaves, fruit, blossoms, habitat nodes, branches, and grass");
    drawTree(svg, state);

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

    if (next.mode === "round") renderRound(root, next);
    else if (next.mode === "globe") renderGlobe(root, next);
    else renderFlat(root, next);

    root.dataset.renderStatus = "complete";
  }

  window.DGBIndexRender = Object.freeze({ render });
})();
