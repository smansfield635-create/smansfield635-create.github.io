(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const dollCopy = {
    DOLL_1_COMPASS: {
      kicker: "Compass · outer shell",
      title: "Rich Manor and Estate",
      body: "Flat stays default. Round opens the Tree of Life. Globe remains later. Gauges hold Generation 3 readiness until this Index experience is accepted."
    },
    DOLL_2_ESTATE: {
      kicker: "Estate arrival",
      title: "The tree stands before the Manor.",
      body: "Snow covers the ground. Grass breaks through the crust. The U-road bends around the Tree of Life before the visitor reaches the house."
    },
    DOLL_3_TRUNK_AND_PRIMARY_LIMBS: {
      kicker: "Tree structure",
      title: "One trunk. Four primary limbs.",
      body: "The tree is now structural: one trunk authority opens into four directional limbs before the 16 canopies appear."
    },
    DOLL_4_CANOPIES: {
      kicker: "Canopy layer",
      title: "Sixteen canopy clusters.",
      body: "The 16 canopy clusters are generated from the 256 tree structure. They are not labels pretending to be branches."
    },
    DOLL_5_BRANCH_SEATS: {
      kicker: "Branch-seat layer",
      title: "Sixty-four branch seats.",
      body: "Each canopy holds four branch seats. The tree can now be navigated without showing every terminal at once."
    },
    DOLL_6_TERMINAL_NODES: {
      kicker: "Terminal layer",
      title: "Two hundred fifty-six terminal nodes.",
      body: "Leaves, fruit, blossoms, and habitats live at terminal-node level. The 256 exists as source structure."
    },
    DOLL_7_FRUIT_AND_WILDLIFE_DETAIL: {
      kicker: "Fruit and wildlife detail",
      title: "Fruit belongs to the living terminal layer.",
      body: "Fruit is active without changing the tree species. Oak remains bound; fruit is a Tree of Life terminal expression."
    }
  };

  function createSvgElement(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    });
    return node;
  }

  function createElement(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "className") {
        node.className = value;
      } else if (key === "text") {
        node.textContent = value;
      } else {
        node.setAttribute(key, String(value));
      }
    });

    (children || []).forEach((child) => {
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });

    return node;
  }

  function append(parent, children) {
    children.forEach((child) => parent.appendChild(child));
    return parent;
  }

  function polar(cx, cy, radius, angleDeg) {
    const angle = (angleDeg - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  }

  function pathCubic(start, c1, c2, end) {
    return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
  }

  function addDefs(svg) {
    const defs = createSvgElement("defs");

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

      <radialGradient id="leafGradient" cx="50%" cy="42%" r="70%">
        <stop offset="0%" stop-color="#eef7e5" stop-opacity=".28"/>
        <stop offset="32%" stop-color="#47763c"/>
        <stop offset="100%" stop-color="#142a1a"/>
      </radialGradient>

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

      <filter id="canopyShadow">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity=".30"/>
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

  function drawSkyGround(svg) {
    const layer = createSvgElement("g", { class: "svg-layer layer-estate", "data-scene-layer": "estate-ground" });

    append(layer, [
      createSvgElement("rect", { x: 0, y: 0, width: 1600, height: 900, fill: "url(#skyGradient)" }),
      createSvgElement("path", { d: "M 0 395 C 240 340, 420 382, 600 350 C 860 300, 1060 350, 1600 310 L 1600 900 L 0 900 Z", fill: "rgba(34,70,48,.58)" }),
      createSvgElement("path", { d: "M 0 452 C 260 430, 480 470, 760 420 C 1050 365, 1250 442, 1600 392 L 1600 900 L 0 900 Z", fill: "url(#snowGradient)" }),
      createSvgElement("path", { class: "tree-road", d: "M 360 900 C 420 740, 520 660, 684 644 C 770 636, 838 636, 916 644 C 1080 660, 1180 740, 1240 900" }),
      createSvgElement("path", { class: "tree-road-snow", d: "M 360 900 C 420 740, 520 660, 684 644 C 770 636, 838 636, 916 644 C 1080 660, 1180 740, 1240 900" })
    ]);

    const grass = createSvgElement("g", { "data-detail-layer": "grass" });
    for (let i = 0; i < 190; i += 1) {
      const x = 90 + ((i * 73) % 1410);
      const y = 725 + ((i * 41) % 155);
      const h = 10 + ((i * 17) % 38);
      const lean = ((i % 7) - 3) * 2.5;
      grass.appendChild(createSvgElement("path", {
        class: "grass-blade-svg",
        d: `M ${x} ${y} C ${x + lean} ${y - h * .35}, ${x + lean * .4} ${y - h * .68}, ${x + lean} ${y - h}`
      }));
      if (i % 5 === 0) {
        grass.appendChild(createSvgElement("path", {
          class: "grass-snow-tip",
          d: `M ${x + lean - 1} ${y - h} L ${x + lean + 3} ${y - h - 2}`
        }));
      }
    }

    const tracks = createSvgElement("g", { class: "svg-layer layer-details", "data-detail-layer": "tracks" });
    for (let i = 0; i < 22; i += 1) {
      const x = 530 + (i * 23);
      const y = 784 - (i % 7) * 10;
      tracks.appendChild(createSvgElement("ellipse", {
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
    const manor = createSvgElement("g", { class: "svg-layer layer-estate", "data-object": "manor" });

    append(manor, [
      createSvgElement("polygon", { class: "manor-roof-svg", points: "585,338 800,205 1015,338" }),
      createSvgElement("rect", { class: "manor-body-svg", x: 565, y: 338, width: 470, height: 155, rx: 18 }),
      createSvgElement("rect", { x: 615, y: 382, width: 44, height: 72, rx: 6, fill: "rgba(242,199,111,.33)" }),
      createSvgElement("rect", { x: 715, y: 382, width: 44, height: 72, rx: 6, fill: "rgba(242,199,111,.25)" }),
      createSvgElement("rect", { x: 841, y: 382, width: 44, height: 72, rx: 6, fill: "rgba(242,199,111,.25)" }),
      createSvgElement("rect", { x: 941, y: 382, width: 44, height: 72, rx: 6, fill: "rgba(242,199,111,.33)" }),
      createSvgElement("text", { class: "structure-label", x: 800, y: 475, "text-anchor": "middle" })
    ]);

    manor.lastChild.textContent = "Rich Manor";
    svg.appendChild(manor);
  }

  function canopyPosition(index) {
    const ring = index <= 8 ? 1 : 2;
    const local = index <= 8 ? index - 1 : index - 9;
    const angle = ring === 1 ? -135 + local * (270 / 7) : -150 + local * (300 / 7);
    const radiusX = ring === 1 ? 300 : 410;
    const radiusY = ring === 1 ? 190 : 260;
    const center = { x: 800, y: 330 };

    return {
      x: center.x + Math.cos(angle * Math.PI / 180) * radiusX,
      y: center.y + Math.sin(angle * Math.PI / 180) * radiusY,
      angle
    };
  }

  function branchSeatPosition(canopyIndex, branchLocal) {
    const c = canopyPosition(canopyIndex);
    const offset = [
      { x: -42, y: -20 },
      { x: 42, y: -18 },
      { x: -36, y: 28 },
      { x: 38, y: 30 }
    ][branchLocal - 1];

    return {
      x: c.x + offset.x,
      y: c.y + offset.y
    };
  }

  function drawTree(svg, state) {
    const treeApi = window.DGBTreeOfLife256;
    const flat = treeApi && treeApi.flat ? treeApi.flat : null;

    const trunkLayer = createSvgElement("g", { class: "svg-layer layer-limbs", "data-tree-layer": "trunk-primary-limbs" });
    const canopyLayer = createSvgElement("g", { class: "svg-layer layer-canopies", "data-tree-layer": "16-canopies" });
    const branchLayer = createSvgElement("g", { class: "svg-layer layer-branches", "data-tree-layer": "64-branch-seats" });
    const terminalLayer = createSvgElement("g", { class: "svg-layer layer-terminals", "data-tree-layer": "256-terminal-nodes" });
    const detailLayer = createSvgElement("g", { class: "svg-layer layer-details", "data-tree-layer": "fruit-wildlife-details" });

    const base = { x: 800, y: 770 };
    const shoulder = { x: 800, y: 455 };

    append(trunkLayer, [
      createSvgElement("path", { class: "tree-trunk", d: "M 720 790 C 748 675, 748 555, 782 435 C 793 398, 812 398, 824 435 C 858 555, 852 675, 884 790 Z" }),
      createSvgElement("path", { class: "root-structure", d: "M 800 760 C 725 782, 650 818, 560 850" }),
      createSvgElement("path", { class: "root-structure", d: "M 805 762 C 890 788, 984 822, 1060 858" }),
      createSvgElement("path", { class: "root-structure", d: "M 785 748 C 740 790, 700 840, 690 895" }),
      createSvgElement("path", { class: "root-structure", d: "M 820 748 C 865 790, 900 842, 910 895" }),
      createSvgElement("path", { class: "root-snow", d: "M 720 790 C 670 810, 620 832, 560 850" }),
      createSvgElement("path", { class: "root-snow", d: "M 878 792 C 935 814, 996 838, 1060 858" })
    ]);

    for (let i = 0; i < 56; i += 1) {
      const x = 746 + (i * 13) % 106;
      const y1 = 444 + (i * 29) % 292;
      const y2 = y1 + 34 + (i % 5) * 12;
      trunkLayer.appendChild(createSvgElement("path", {
        class: i % 3 === 0 ? "bark-highlight" : "bark-fissure",
        d: `M ${x} ${y1} C ${x - 12 + i % 9} ${y1 + 22}, ${x + 9 - i % 8} ${y2 - 16}, ${x + 2} ${y2}`
      }));
    }

    const limbTargets = [
      { x: 360, y: 245, c1: { x: 720, y: 410 }, c2: { x: 560, y: 282 } },
      { x: 610, y: 135, c1: { x: 770, y: 380 }, c2: { x: 700, y: 185 } },
      { x: 990, y: 135, c1: { x: 830, y: 380 }, c2: { x: 900, y: 185 } },
      { x: 1240, y: 245, c1: { x: 880, y: 410 }, c2: { x: 1040, y: 282 } }
    ];

    limbTargets.forEach((target, index) => {
      trunkLayer.appendChild(createSvgElement("path", {
        class: "primary-limb",
        d: pathCubic(shoulder, target.c1, target.c2, { x: target.x, y: target.y }),
        "data-primary-limb": index + 1
      }));
    });

    const canopyNodes = flat ? flat.canopyClusters : [];
    canopyNodes.forEach((canopy) => {
      const p = canopyPosition(canopy.index);
      const rx = 118 + (canopy.index % 4) * 10;
      const ry = 76 + (canopy.index % 3) * 12;

      const canopyCell = createSvgElement("ellipse", {
        class: "canopy-cell",
        cx: p.x,
        cy: p.y,
        rx,
        ry,
        "data-canopy-id": canopy.id,
        "data-canopy-index": canopy.index,
        "data-canopy-role": canopy.role
      });

      canopyLayer.appendChild(canopyCell);

      if (canopy.index % 2 === 0) {
        canopyLayer.appendChild(createSvgElement("ellipse", {
          class: "canopy-frost",
          cx: p.x - rx * .28,
          cy: p.y - ry * .36,
          rx: rx * .32,
          ry: ry * .12
        }));
      }

      if (canopy.index === state.canopyIndex) {
        const text = createSvgElement("text", {
          class: "structure-label",
          x: p.x,
          y: p.y + ry + 34,
          "text-anchor": "middle"
        });
        text.textContent = `C${String(canopy.index).padStart(2, "0")} · ${canopy.role}`;
        canopyLayer.appendChild(text);
      }
    });

    const branchSeats = flat ? flat.branchSeats : [];
    branchSeats.forEach((branch) => {
      const canopyIndex = branch.canopyCluster;
      const branchLocal = ((branch.localIndex - 1) % 4) + 1;
      const p = branchSeatPosition(canopyIndex, branchLocal);
      const c = canopyPosition(canopyIndex);

      branchLayer.appendChild(createSvgElement("path", {
        class: "secondary-branch",
        d: `M ${c.x} ${c.y} C ${(c.x + p.x) / 2} ${c.y + 20}, ${(c.x + p.x) / 2} ${p.y - 20}, ${p.x} ${p.y}`,
        "data-branch-seat": branch.id
      }));

      if (canopyIndex === state.canopyIndex || branch.index === state.branchSeatIndex) {
        branchLayer.appendChild(createSvgElement("circle", {
          cx: p.x,
          cy: p.y,
          r: branch.index === state.branchSeatIndex ? 13 : 8,
          fill: branch.index === state.branchSeatIndex ? "rgba(242,199,111,.88)" : "rgba(255,247,228,.35)",
          stroke: "rgba(2,5,10,.72)",
          "stroke-width": 2
        }));
      }
    });

    const terminalNodes = flat ? flat.terminalNodes : [];
    terminalNodes.forEach((node) => {
      const branchIndex = node.branchSeat;
      const branchLocal = ((branchIndex - 1) % 4) + 1;
      const branchP = branchSeatPosition(node.canopyCluster, branchLocal);
      const terminalLocal = ((node.localIndex - 1) % 4) + 1;
      const offsets = [
        { x: -18, y: -13 },
        { x: 18, y: -13 },
        { x: -18, y: 14 },
        { x: 18, y: 14 }
      ];
      const pos = offsets[terminalLocal - 1];

      const activeGroup =
        node.canopyCluster === state.canopyIndex ||
        node.branchSeat === state.branchSeatIndex ||
        node.index === state.terminalIndex ||
        state.dollLayer === "DOLL_6_TERMINAL_NODES" ||
        state.dollLayer === "DOLL_7_FRUIT_AND_WILDLIFE_DETAIL";

      if (!activeGroup) return;

      const className =
        node.terminalType === "fruit" ? "terminal-node terminal-fruit" :
        node.terminalType === "blossom" ? "terminal-node terminal-blossom" :
        node.terminalType === "habitat" ? "terminal-node terminal-habitat" :
        "terminal-node terminal-leaf";

      const r = node.index === state.terminalIndex ? 7 : node.terminalType === "fruit" ? 5 : 4;

      terminalLayer.appendChild(createSvgElement("circle", {
        class: className,
        cx: branchP.x + pos.x,
        cy: branchP.y + pos.y,
        r,
        "data-terminal-id": node.id,
        "data-terminal-index": node.index,
        "data-terminal-type": node.terminalType
      }));

      if (node.terminalType === "fruit" && state.dollLayer === "DOLL_7_FRUIT_AND_WILDLIFE_DETAIL") {
        detailLayer.appendChild(createSvgElement("circle", {
          class: "terminal-fruit",
          cx: branchP.x + pos.x + 4,
          cy: branchP.y + pos.y - 4,
          r: 2.2
        }));
      }
    });

    const selectedNode = flat ? flat.terminalNodes.find((node) => node.index === state.terminalIndex) : null;
    if (selectedNode && state.dollLayer === "DOLL_7_FRUIT_AND_WILDLIFE_DETAIL") {
      const text = createSvgElement("text", {
        class: "fruit-label",
        x: 800,
        y: 850,
        "text-anchor": "middle"
      });
      text.textContent = `${selectedNode.id} · ${selectedNode.terminalType}${selectedNode.fruit.active ? " · fruit active" : ""}`;
      detailLayer.appendChild(text);
    }

    [trunkLayer, canopyLayer, branchLayer, terminalLayer, detailLayer].forEach((layer) => svg.appendChild(layer));
  }

  function renderSceneCopy(root, state) {
    const copy = dollCopy[state.dollLayer] || dollCopy.DOLL_1_COMPASS;

    root.appendChild(createElement("article", { className: "scene-copy-card" }, [
      createElement("p", { className: "kicker", text: copy.kicker }),
      createElement("h2", { text: copy.title }),
      createElement("p", { text: copy.body })
    ]));
  }

  function renderFlat(root, state) {
    const scene = createElement("section", {
      className: "tree-scene flat-tree-scene",
      "aria-label": "Flat World route map"
    });

    const svg = createSvgElement("svg", {
      class: "tree-svg",
      viewBox: "0 0 1600 900",
      role: "img",
      "aria-label": "Flat World verified route map for Rich Manor and Estate"
    });

    addDefs(svg);
    drawSkyGround(svg);
    drawManor(svg);

    const links = [
      { x: 800, y: 300, label: "Compass" },
      { x: 520, y: 470, label: "Door" },
      { x: 800, y: 500, label: "Home" },
      { x: 1080, y: 470, label: "Products" },
      { x: 640, y: 665, label: "Showroom" },
      { x: 960, y: 665, label: "Gauges" }
    ];

    const mapLayer = createSvgElement("g", { class: "svg-layer layer-estate" });
    links.forEach((item) => {
      mapLayer.appendChild(createSvgElement("circle", {
        cx: item.x,
        cy: item.y,
        r: 54,
        fill: "rgba(3,7,12,.72)",
        stroke: "rgba(242,199,111,.46)",
        "stroke-width": 2
      }));
      const text = createSvgElement("text", {
        class: "structure-label",
        x: item.x,
        y: item.y + 7,
        "text-anchor": "middle"
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
    const scene = createElement("section", {
      className: "tree-scene globe-hold-scene",
      "aria-label": "Globe view locked later"
    });

    const svg = createSvgElement("svg", {
      class: "tree-svg",
      viewBox: "0 0 1600 900",
      role: "img",
      "aria-label": "Globe view locked later"
    });

    addDefs(svg);
    drawSkyGround(svg);

    const orb = createSvgElement("circle", {
      cx: 800,
      cy: 455,
      r: 190,
      fill: "rgba(98,145,180,.24)",
      stroke: "rgba(242,199,111,.40)",
      "stroke-width": 3
    });

    const label = createSvgElement("text", {
      class: "structure-label",
      x: 800,
      y: 462,
      "text-anchor": "middle"
    });
    label.textContent = "GLOBE / META LOCKED LATER";

    svg.appendChild(orb);
    svg.appendChild(label);
    scene.appendChild(svg);
    root.appendChild(scene);
    renderSceneCopy(root, state);
  }

  function renderRound(root, state) {
    const scene = createElement("section", {
      className: "tree-scene round-tree-scene",
      "aria-label": "Round World Tree of Life 256 structure",
      "data-tree-structure": "256",
      "data-doll-layer": state.dollLayer
    });

    const svg = createSvgElement("svg", {
      class: "tree-svg",
      viewBox: "0 0 1600 900",
      role: "img",
      "aria-label": "Tree of Life scene with one trunk, four primary limbs, sixteen canopies, sixty-four branch seats, and two hundred fifty-six terminal nodes"
    });

    addDefs(svg);
    drawSkyGround(svg);
    drawManor(svg);
    drawTree(svg, state);

    scene.appendChild(svg);
    root.appendChild(scene);
    renderSceneCopy(root, state);
  }

  function normalizeState(state) {
    return Object.assign({
      mode: "flat",
      dollLayer: "DOLL_1_COMPASS",
      canopyIndex: 1,
      branchSeatIndex: 1,
      terminalIndex: 1
    }, state || {});
  }

  function render(state, root) {
    if (!root) return;

    const next = normalizeState(state);
    root.replaceChildren();
    root.dataset.renderStatus = "rendering";
    root.dataset.activeMode = next.mode;
    root.dataset.dollLayer = next.dollLayer;
    root.dataset.canopyIndex = String(next.canopyIndex);
    root.dataset.branchSeatIndex = String(next.branchSeatIndex);
    root.dataset.terminalIndex = String(next.terminalIndex);

    if (next.mode === "round") {
      renderRound(root, next);
    } else if (next.mode === "globe") {
      renderGlobe(root, next);
    } else {
      renderFlat(root, next);
    }

    root.dataset.renderStatus = "complete";
  }

  window.DGBIndexRender = Object.freeze({ render });
})();
