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
      "Snow, road, grass, roots, limbs, and foliage now render through separated layers."
    ],
    DOLL_3_TRUNK_AND_PRIMARY_LIMBS: [
      "Tree structure",
      "One trunk. Four primary limbs.",
      "The render file composes the scene. The foliage file renders leaves, fruit, blossoms, habitat, and butterflies."
    ],
    DOLL_4_CANOPIES: [
      "Canopy layer",
      "Canopy emerges from leaves.",
      "No green canopy blobs. The canopy is implied by independent leaves and terminal nodes."
    ],
    DOLL_5_BRANCH_SEATS: [
      "Branch seats",
      "Sixty-four branch seats.",
      "Branch seats and terminal foliage now come from the foliage render layer."
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

  function drawSkyGround(svg) {
    const layer = s("g", { class: "svg-layer layer-estate", "data-render-layer": "scene-base" });

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
    const manor = s("g", { class: "svg-layer layer-estate", "data-render-layer": "manor-background" });

    manor.appendChild(s("polygon", {
      class: "manor-roof-svg",
      points: "585,338 800,205 1015,338",
      fill: "url(#manorRoof)",
      stroke: "rgba(242,199,111,.35)",
      "stroke-width": 2
    }));

    manor.appendChild(s("rect", {
      class: "manor-body-svg",
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

  function drawTrunkAndPrimaryLimbs(svg) {
    const trunkLayer = s("g", { class: "svg-layer layer-limbs", "data-render-layer": "trunk-primary-limbs" });

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

    svg.appendChild(trunkLayer);
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

    const mapLayer = s("g", { class: "svg-layer layer-estate", "data-render-layer": "flat-map" });

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
      "aria-label": "Round World Tree of Life with expanded foliage render layer",
      "data-tree-structure": "256",
      "data-doll-layer": state.dollLayer,
      "data-render-layer-expansion": "active",
      "data-foliage-layer": "active"
    });

    const svg = baseSvg("Tree of Life scene with compositor render layer and independent foliage layer");

    drawTrunkAndPrimaryLimbs(svg);

    if (window.DGBIndexFoliage && typeof window.DGBIndexFoliage.drawFoliageLayer === "function") {
      window.DGBIndexFoliage.drawFoliageLayer(svg, state);
    } else {
      const warning = s("text", {
        x: 800,
        y: 850,
        "text-anchor": "middle",
        fill: "rgba(255,247,228,.82)",
        "font-size": 18,
        "paint-order": "stroke",
        stroke: "rgba(2,5,10,.72)",
        "stroke-width": 4
      });

      warning.textContent = "Foliage layer unavailable: /index.foliage.js not loaded";
      svg.appendChild(warning);
    }

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
    root.dataset.renderLayerExpansion = "active";
    root.dataset.foliageLayer = "active";

    if (next.mode === "round") renderRound(root, next);
    else if (next.mode === "globe") renderGlobe(root, next);
    else renderFlat(root, next);

    root.dataset.renderStatus = "complete";
  }

  window.DGBIndexRender = Object.freeze({ render });
})();
