(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const dollCopy = {
    DOLL_1_COMPASS: [
      "Compass · outer shell",
      "Rich Manor and Estate",
      "Flat stays default. Round opens the Tree of Life. Globe remains later. Gauges hold Generation 3 readiness until this Index experience is accepted."
    ],
    DOLL_2_ESTATE: [
      "Estate arrival",
      "The tree stands before the Manor.",
      "Snow covers the ground. Grass breaks through the crust. The U-road bends around the Tree of Life before the visitor reaches the house."
    ],
    DOLL_3_TRUNK_AND_PRIMARY_LIMBS: [
      "Tree structure",
      "One trunk. Four primary limbs.",
      "The structure opens from one trunk authority into four directional limbs."
    ],
    DOLL_4_CANOPIES: [
      "Canopy layer",
      "Sixteen living canopy fields.",
      "No canopy blobs. Each canopy is implied by independent leaves, twigs, fruit, blossoms, and habitat terminals."
    ],
    DOLL_5_BRANCH_SEATS: [
      "Branch-seat layer",
      "Sixty-four branch seats.",
      "Each branch seat carries four terminal expressions. The tree opens from limb to branch to leaf."
    ],
    DOLL_6_TERMINAL_NODES: [
      "Terminal layer",
      "Two hundred fifty-six independent terminals.",
      "Leaves, fruit, blossoms, and habitats are rendered as separate source-backed objects."
    ],
    DOLL_7_FRUIT_AND_WILDLIFE_DETAIL: [
      "Fruit and wildlife detail",
      "Fruit, butterflies, and habitat are controlled detail layers.",
      "Fruit is active without changing species. Butterflies appear through pollination state, not as stickers."
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
        <stop offset="0%" stop-color="#f3f8fa"/>
        <stop offset="58%" stop-color="#d4e0e4"/>
        <stop offset="100%" stop-color="#b5c5cc"/>
      </linearGradient>

      <linearGradient id="barkGradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#251208"/>
        <stop offset="20%" stop-color="#6b3b22"/>
        <stop offset="49%" stop-color="#8b5636"/>
        <stop offset="72%" stop-color="#4b2815"/>
        <stop offset="100%" stop-color="#1b0c05"/>
      </linearGradient>

      <radialGradient id="fruitGradient" cx="32%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#f7a0a6"/>
        <stop offset="42%" stop-color="#ba2639"/>
        <stop offset="100%" stop-color="#5f0b18"/>
      </radialGradient>

      <linearGradient id="manorBody" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#243042"/>
        <stop offset="100%" stop-color="#0b1018"/>
      </linearGradient>

      <linearGradient id="manorRoof" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#f2c76f"/>
        <stop offset="100%" stop-color="#563a22"/>
      </linearGradient>

      <filter id="trunkShadow">
        <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000000" flood-opacity=".55"/>
      </filter>

      <filter id="rootShadow">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity=".42"/>
      </filter>

      <filter id="limbShadow">
        <feDropShadow dx="0" dy="14" stdDeviation="11" flood-color="#000000" flood-opacity=".40"/>
      </filter>

      <filter id="leafShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="#000000" flood-opacity=".30"/>
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

  function canopyPosition(index) {
    const ring = index <= 8 ? 1 : 2;
    const local = index <= 8 ? index - 1 : index - 9;
    const angle = ring === 1 ? -135 + local * (270 / 7) : -150 + local * (300 / 7);
    const radiusX = ring === 1 ? 310 : 435;
    const radiusY = ring === 1 ? 188 : 265;

    return {
      x: 800 + Math.cos(angle * Math.PI / 180) * radiusX,
      y: 330 + Math.sin(angle * Math.PI / 180) * radiusY,
      angle
    };
  }

  function branchSeatPosition(canopyIndex, branchLocal) {
    const c = canopyPosition(canopyIndex);

    const offsets = [
      { x: -98, y: -58 },
      { x: 94, y: -52 },
      { x: -86, y: 64 },
      { x: 92, y: 70 }
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
      { x: -44, y: -31 },
      { x: 42, y: -35 },
      { x: -38, y: 36 },
      { x: 47, y: 32 }
    ];

    const base = spreads[terminalLocal - 1];
    const jitterX = ((node.index * 17) % 29) - 14;
    const jitterY = ((node.index * 23) % 27) - 13;

    return {
      x: branch.x + base.x + jitterX,
      y: branch.y + base.y + jitterY,
      angle: ((node.index * 37) % 140) - 70,
      scale: 0.58 + ((node.index % 9) * 0.045)
    };
  }

  function drawSkyGround(svg) {
    const layer = s("g", { class: "svg-layer layer-estate", "data-scene-layer": "estate-ground" });

    layer.appendChild(s("rect", { x: 0, y: 0, width: 1600, height: 900, fill: "url(#skyGradient)" }));

    layer.appendChild(s("path", {
      d: "M 0 395 C 240 340, 420 382, 600 350 C 860 300, 1060 350, 1600 310 L 1600 900 L 0 900 Z",
      fill: "rgba(34,70,48,.58)"
    }));

    layer.appendChild(s("path", {
      d: "M 0 452 C 260 430, 480 470, 760 420 C 1050 365, 1250 442, 1600 392 L 1600 900 L 0 900 Z",
      fill: "url(#snowGradient)"
    }));

    layer.appendChild(s("path", {
      class: "tree-road",
      d: "M 360 900 C 420 740, 520 660, 684 644 C 770 636, 838 636, 916 644 C 1080 660, 1180 740, 1240 900"
    }));

    layer.appendChild(s("path", {
      class: "tree-road-snow",
      d: "M 360 900 C 420 740, 520 660, 684 644 C 770 636, 838 636, 916 644 C 1080 660, 1180 740, 1240 900"
    }));

    const grass = s("g", { "data-detail-layer": "grass" });

    for (let i = 0; i < 260; i += 1) {
      const x = 80 + ((i * 73) % 1440);
      const y = 720 + ((i * 41) % 160);
      const height = 10 + ((i * 17) % 38);
      const lean = ((i % 7) - 3) * 2.5;

      grass.appendChild(s("path", {
        class: "grass-blade-svg",
        d: `M ${x} ${y} C ${x + lean} ${y - height * .35}, ${x + lean * .4} ${y - height * .68}, ${x + lean} ${y - height}`
      }));

      if (i % 5 === 0) {
        grass.appendChild(s("path", {
          class: "grass-snow-tip",
          d: `M ${x + lean - 1} ${y - height} L ${x + lean + 3} ${y - height - 2}`
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
        transform: `rotate(${i % 2 ? 16 : -18} ${x} ${y})`
      }));
    }

    layer.appendChild(grass);
    layer.appendChild(tracks);
    svg.appendChild(layer);
  }

  function drawManor(svg) {
    const manor = s("g", { class: "svg-layer layer-estate", "data-object": "manor" });

    manor.appendChild(s("polygon", { class: "manor-roof-svg", points: "585,338 800,205 1015,338" }));
    manor.appendChild(s("rect", { class: "manor-body-svg", x: 565, y: 338, width: 470, height: 155, rx: 18 }));

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

    const label = s("text", { class: "structure-label", x: 800, y: 475, "text-anchor": "middle" });
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

      const wingClass =
        option === "blue_morpho_style" ? "butterfly-wing-b" :
        option === "estate_gold_variant" ? "butterfly-wing-gold" :
        "butterfly-wing-a";

      g.appendChild(s("ellipse", { class: wingClass, cx: -8, cy: -2, rx: 10, ry: 16, transform: "rotate(-28 -8 -2)" }));
      g.appendChild(s("ellipse", { class: wingClass, cx: 8, cy: -2, rx: 10, ry: 16, transform: "rotate(28 8 -2)" }));
      g.appendChild(s("path", { class: "butterfly-body", d: "M 0 -11 L 0 12" }));

      layer.appendChild(g);
    });
  }

  function leafColor(node) {
    const palette = [
      "rgba(34,82,34,.92)",
      "rgba(50,107,45,.90)",
      "rgba(69,127,55,.88)",
      "rgba(91,138,65,.86)",
      "rgba(43,91,42,.90)"
    ];

    if (node.terminalType === "habitat") return "rgba(157,128,82,.86)";
    return palette[node.index % palette.length];
  }

  function makeLeaf(node, pos) {
    const leaf = s("path", {
      class: "terminal-node terminal-leaf individual-leaf",
      d: "M 0 -14 C 7 -12 13 -6 13 1 C 13 11 3 17 0 22 C -3 17 -13 11 -13 1 C -13 -6 -7 -12 0 -14 Z",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      fill: leafColor(node),
      stroke: "rgba(224,244,208,.20)",
      "stroke-width": 1,
      filter: "url(#leafShadow)",
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": node.terminalType,
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat
    });

    const vein = s("path", {
      class: "leaf-vein",
      d: "M 0 -10 C 1 -2 0 8 0 16",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      stroke: "rgba(235,248,220,.30)",
      "stroke-width": .85
    });

    const sideA = s("path", {
      class: "leaf-side-vein",
      d: "M 0 1 L 7 -4 M 0 6 L 8 2 M 0 10 L 7 8",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      stroke: "rgba(235,248,220,.16)",
      "stroke-width": .65
    });

    const sideB = s("path", {
      class: "leaf-side-vein",
      d: "M 0 1 L -7 -4 M 0 6 L -8 2 M 0 10 L -7 8",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      stroke: "rgba(235,248,220,.16)",
      "stroke-width": .65
    });

    return [leaf, vein, sideA, sideB];
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
      r: 5.6 * pos.scale,
      fill: "url(#fruitGradient)",
      filter: "url(#fruitGlow)"
    }));

    group.appendChild(s("circle", {
      cx: -1.9 * pos.scale,
      cy: -2.3 * pos.scale,
      r: 1.2 * pos.scale,
      fill: "rgba(255,230,210,.72)"
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
        fill: "rgba(247,214,222,.86)",
        stroke: "rgba(255,255,255,.22)",
        "stroke-width": .7
      }));
    }

    group.appendChild(s("circle", { cx: 0, cy: 0, r: 2, fill: "rgba(242,199,111,.88)" }));

    return [group];
  }

  function makeTerminalNode(node) {
    const pos = terminalPosition(node);

    if (node.terminalType === "fruit") return makeFruit(node, pos);
    if (node.terminalType === "blossom") return makeBlossom(node, pos);

    return makeLeaf(node, pos);
  }

  function drawTree(svg, state) {
    const treeApi = window.DGBTreeOfLife256;
    const flat = treeApi && treeApi.flat ? treeApi.flat : null;

    const trunkLayer = s("g", { class: "svg-layer layer-limbs", "data-tree-layer": "trunk-primary-limbs" });
    const branchLayer = s("g", { class: "svg-layer layer-branches", "data-tree-layer": "64-branch-seats" });
    const terminalLayer = s("g", { class: "svg-layer layer-terminals", "data-tree-layer": "256-independent-terminal-nodes" });
    const detailLayer = s("g", { class: "svg-layer layer-details", "data-tree-layer": "fruit-wildlife-butterflies" });

    trunkLayer.appendChild(s("path", {
      class: "tree-trunk",
      d: "M 720 790 C 748 675, 748 555, 782 435 C 793 398, 812 398, 824 435 C 858 555, 852 675, 884 790 Z"
    }));

    trunkLayer.appendChild(s("path", { class: "root-structure", d: "M 800 760 C 725 782, 650 818, 560 850" }));
    trunkLayer.appendChild(s("path", { class: "root-structure", d: "M 805 762 C 890 788, 984 822, 1060 858" }));
    trunkLayer.appendChild(s("path", { class: "root-structure", d: "M 785 748 C 740 790, 700 840, 690 895" }));
    trunkLayer.appendChild(s("path", { class: "root-structure", d: "M 820 748 C 865 790, 900 842, 910 895" }));
    trunkLayer.appendChild(s("path", { class: "root-snow", d: "M 720 790 C 670 810, 620 832, 560 850" }));
    trunkLayer.appendChild(s("path", { class: "root-snow", d: "M 878 792 C 935 814, 996 838, 1060 858" }));

    for (let i = 0; i < 76; i += 1) {
      const x = 746 + (i * 13) % 106;
      const y1 = 444 + (i * 29) % 292;
      const y2 = y1 + 34 + (i % 5) * 12;

      trunkLayer.appendChild(s("path", {
        class: i % 3 === 0 ? "bark-highlight" : "bark-fissure",
        d: `M ${x} ${y1} C ${x - 12 + i % 9} ${y1 + 22}, ${x + 9 - i % 8} ${y2 - 16}, ${x + 2} ${y2}`
      }));
    }

    const shoulder = { x: 800, y: 455 };

    [
      { x: 350, y: 238, c1: { x: 720, y: 410 }, c2: { x: 540, y: 276 } },
      { x: 605, y: 118, c1: { x: 770, y: 380 }, c2: { x: 690, y: 178 } },
      { x: 995, y: 118, c1: { x: 830, y: 380 }, c2: { x: 910, y: 178 } },
      { x: 1250, y: 238, c1: { x: 880, y: 410 }, c2: { x: 1060, y: 276 } }
    ].forEach((target, index) => {
      trunkLayer.appendChild(s("path", {
        class: "primary-limb",
        d: pathCubic(shoulder, target.c1, target.c2, { x: target.x, y: target.y }),
        "data-primary-limb": index + 1
      }));
    });

    const branchSeats = flat ? flat.branchSeats : [];
    const terminalNodes = flat ? flat.terminalNodes : [];

    branchSeats.forEach((branch) => {
      const branchLocal = ((branch.localIndex - 1) % 4) + 1;
      const p = branchSeatPosition(branch.canopyCluster, branchLocal);
      const c = canopyPosition(branch.canopyCluster);

      branchLayer.appendChild(s("path", {
        class: "secondary-branch",
        d: `M ${c.x} ${c.y} C ${(c.x + p.x) / 2} ${c.y + 16}, ${(c.x + p.x) / 2} ${p.y - 16}, ${p.x} ${p.y}`,
        "data-branch-seat": branch.id,
        "data-canopy": branch.canopyCluster
      }));

      terminalNodes
        .filter((node) => node.branchSeat === branch.index)
        .forEach((node) => {
          const t = terminalPosition(node);

          branchLayer.appendChild(s("path", {
            class: "terminal-twig",
            d: `M ${p.x} ${p.y} C ${(p.x + t.x) / 2} ${p.y - 8}, ${(p.x + t.x) / 2} ${t.y + 8}, ${t.x} ${t.y}`,
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
        "text-anchor": "middle"
      });

      label.textContent = `${selectedNode.id} · ${selectedNode.terminalType}${selectedNode.fruit && selectedNode.fruit.active ? " · fruit active" : ""}`;
      detailLayer.appendChild(label);
    }

    drawButterflies(detailLayer, state);

    [trunkLayer, branchLayer, terminalLayer, detailLayer].forEach((layer) => svg.appendChild(layer));
  }

  function renderSceneCopy(root, state) {
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

      const text = s("text", { class: "structure-label", x: item.x, y: item.y + 7, "text-anchor": "middle" });
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

    const label = s("text", { class: "structure-label", x: 800, y: 462, "text-anchor": "middle" });
    label.textContent = "GLOBE / META LOCKED LATER";
    svg.appendChild(label);

    scene.appendChild(svg);
    root.appendChild(scene);
    renderSceneCopy(root, state);
  }

  function renderRound(root, state) {
    const scene = h("section", {
      className: "tree-scene round-tree-scene",
      "aria-label": "Round World Tree of Life with independent leaves and terminal nodes",
      "data-tree-structure": "256",
      "data-doll-layer": state.dollLayer
    });

    const svg = baseSvg("Tree of Life scene with independent leaves, fruit, blossoms, and habitat nodes");
    drawTree(svg, state);

    scene.appendChild(svg);
    root.appendChild(scene);
    renderSceneCopy(root, state);
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
