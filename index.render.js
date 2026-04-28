(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const TREE_GENERATION = "TREE_G2_SEASONAL_AGE_RENDER";

  const routeFruit = [
    { label: "Compass", href: "/", kind: "gold-apple", ripeness: "golden", x: 706, y: 332, r: 12 },
    { label: "Door", href: "/door/", kind: "pear", ripeness: "young", x: 552, y: 438, r: 11 },
    { label: "Home", href: "/home/", kind: "apple", ripeness: "ripe", x: 800, y: 284, r: 13 },
    { label: "Products", href: "/products/", kind: "cherry", ripeness: "ripe", x: 970, y: 372, r: 14 },
    { label: "Showroom", href: "/showroom/", kind: "plum", ripeness: "deep", x: 640, y: 514, r: 12 },
    { label: "Gauges", href: "/gauges/", kind: "gold-plum", ripeness: "frosted", x: 1050, y: 504, r: 12 }
  ];

  const productFruit = [
    { label: "ARCHCOIN", href: "/products/archcoin/", kind: "cherry", ripeness: "ripe", x: 930, y: 330, r: 7 },
    { label: "Five Flags", href: "/products/five-flags/", kind: "apple", ripeness: "yellowing", x: 996, y: 332, r: 7 },
    { label: "On Your Side AAI", href: "/products/on-your-side-ai/", kind: "pear", ripeness: "young", x: 1038, y: 380, r: 7 },
    { label: "Education", href: "/products/education/", kind: "plum", ripeness: "deep", x: 990, y: 426, r: 7 },
    { label: "Nutrition", href: "/products/nutrition/", kind: "gold-apple", ripeness: "golden", x: 924, y: 416, r: 7 }
  ];

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
        <stop offset="0%" stop-color="#061327"/>
        <stop offset="52%" stop-color="#122d37"/>
        <stop offset="100%" stop-color="#eef7f8"/>
      </linearGradient>

      <linearGradient id="snowGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#f8fdff"/>
        <stop offset="58%" stop-color="#d9e7eb"/>
        <stop offset="100%" stop-color="#b3c7ce"/>
      </linearGradient>

      <linearGradient id="barkGradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#1f0d05"/>
        <stop offset="18%" stop-color="#5d311b"/>
        <stop offset="46%" stop-color="#8f5b39"/>
        <stop offset="70%" stop-color="#4a2411"/>
        <stop offset="100%" stop-color="#160802"/>
      </linearGradient>

      <linearGradient id="oldBarkGrain" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(235,205,150,.28)"/>
        <stop offset="50%" stop-color="rgba(34,14,7,.72)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,.10)"/>
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

      <radialGradient id="fruitApple" cx="32%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#ffd8d8"/>
        <stop offset="42%" stop-color="#c42d3d"/>
        <stop offset="100%" stop-color="#610b18"/>
      </radialGradient>

      <radialGradient id="fruitCherry" cx="32%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#ffe1e1"/>
        <stop offset="42%" stop-color="#d01730"/>
        <stop offset="100%" stop-color="#57040f"/>
      </radialGradient>

      <radialGradient id="fruitPear" cx="32%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#f5f5b5"/>
        <stop offset="48%" stop-color="#8aa846"/>
        <stop offset="100%" stop-color="#3f561f"/>
      </radialGradient>

      <radialGradient id="fruitPlum" cx="32%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#d7c8ff"/>
        <stop offset="48%" stop-color="#7251ad"/>
        <stop offset="100%" stop-color="#2d164e"/>
      </radialGradient>

      <radialGradient id="fruitGold" cx="32%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#fff6c9"/>
        <stop offset="48%" stop-color="#f2c76f"/>
        <stop offset="100%" stop-color="#795020"/>
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
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f2c76f" flood-opacity=".24"/>
      </filter>

      <filter id="frostGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="2.8" flood-color="#e8fbff" flood-opacity=".28"/>
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

  function viewBoxFor(view) {
    if (view === "inspect") return "430 90 760 560";
    if (view === "tree") return "205 60 1190 780";
    return "0 0 1600 900";
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

    return {
      x: seat.x + layout.dx + seededRange(node.index * 11, -12, 12),
      y: seat.y + layout.dy + seededRange(node.index * 13, -10, 10),
      angle: layout.tilt + seededRange(node.index * 19, -13, 13),
      scale: 0.82 + seededRange(node.index * 17, 0.00, 0.36)
    };
  }

  function leafPath(variant) {
    if (variant === 1) return "M 0 -18 C 10 -18 17 -10 18 -1 C 19 13 8 24 0 31 C -8 24 -19 13 -18 -1 C -17 -10 -10 -18 0 -18 Z";
    if (variant === 2) return "M 0 -20 C 12 -18 18 -8 16 2 C 14 15 7 23 0 30 C -7 23 -14 15 -16 2 C -18 -8 -12 -18 0 -20 Z";
    if (variant === 3) return "M 0 -17 C 9 -18 18 -12 19 -2 C 20 11 10 22 0 29 C -10 22 -20 11 -19 -2 C -18 -12 -9 -18 0 -17 Z";
    return "M 0 -19 C 11 -17 18 -9 18 1 C 18 13 7 23 0 31 C -7 23 -18 13 -18 1 C -18 -9 -11 -17 0 -19 Z";
  }

  function lifeStage(seed, type) {
    if (type === "habitat") return "habitat";

    const stages = [
      "new-growth",
      "spring-green",
      "mature-green",
      "deep-mature",
      "yellowing",
      "copper-aging",
      "frost-touch",
      "snow-touch",
      "late-cycle"
    ];

    return stages[Math.floor(seededUnit(seed * 29) * stages.length)];
  }

  function leafFill(seed, type, stage) {
    if (type === "habitat") return "rgba(146,122,80,.90)";

    const palette = {
      "new-growth": ["rgba(132,176,89,.92)", "rgba(111,164,78,.92)", "rgba(151,190,101,.90)"],
      "spring-green": ["rgba(85,151,76,.94)", "rgba(76,142,70,.94)", "rgba(92,162,84,.92)"],
      "mature-green": ["rgba(48,110,56,.95)", "rgba(56,120,62,.95)", "rgba(67,130,70,.93)"],
      "deep-mature": ["rgba(31,78,38,.96)", "rgba(38,92,48,.96)", "rgba(41,97,49,.95)"],
      "yellowing": ["rgba(164,149,70,.91)", "rgba(181,158,74,.90)", "rgba(137,130,65,.91)"],
      "copper-aging": ["rgba(139,96,55,.90)", "rgba(155,108,61,.88)", "rgba(116,83,51,.91)"],
      "frost-touch": ["rgba(74,126,91,.86)", "rgba(83,135,101,.84)", "rgba(93,141,108,.82)"],
      "snow-touch": ["rgba(79,117,86,.82)", "rgba(91,130,96,.80)", "rgba(72,105,80,.82)"],
      "late-cycle": ["rgba(88,81,50,.88)", "rgba(106,91,54,.86)", "rgba(75,78,48,.88)"]
    }[stage] || ["rgba(56,120,62,.95)"];

    return palette[Math.abs(seed) % palette.length];
  }

  function leafEdge(seed, stage) {
    if (stage === "frost-touch" || stage === "snow-touch") return "rgba(232,251,255,.44)";
    if (stage === "yellowing") return "rgba(244,221,137,.28)";
    if (stage === "copper-aging" || stage === "late-cycle") return "rgba(214,155,91,.24)";

    const palette = [
      "rgba(214,236,198,.22)",
      "rgba(225,244,214,.18)",
      "rgba(193,221,177,.24)",
      "rgba(238,248,222,.16)"
    ];

    return palette[Math.abs(seed) % palette.length];
  }

  function fruitFill(kind) {
    if (kind === "cherry") return "url(#fruitCherry)";
    if (kind === "pear") return "url(#fruitPear)";
    if (kind === "plum") return "url(#fruitPlum)";
    if (kind === "gold-apple" || kind === "gold-plum") return "url(#fruitGold)";
    return "url(#fruitApple)";
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
    for (let i = 0; i < 330; i += 1) {
      const x = 70 + ((i * 73) % 1460);
      const y = 720 + ((i * 41) % 160);
      const height = 10 + ((i * 17) % 42);
      const lean = ((i % 7) - 3) * 2.5;

      grass.appendChild(s("path", {
        d: `M ${x} ${y} C ${x + lean} ${y - height * .35}, ${x + lean * .4} ${y - height * .68}, ${x + lean} ${y - height}`,
        fill: "none",
        stroke: "rgba(77,111,52,.82)",
        "stroke-width": 2,
        "stroke-linecap": "round"
      }));

      if (i % 5 === 0) {
        grass.appendChild(s("path", {
          d: `M ${x + lean - 1} ${y - height} L ${x + lean + 3} ${y - height - 2}`,
          fill: "none",
          stroke: "rgba(239,246,248,.72)",
          "stroke-width": 1,
          "stroke-linecap": "round"
        }));
      }
    }

    layer.appendChild(grass);
    drawFallenLeaves(layer);
    svg.appendChild(layer);
  }

  function drawFallenLeaves(layer) {
    const fallen = s("g", {
      class: "fallen-leaf-field",
      "data-seasonal-age-layer": "fallen-leaves"
    });

    for (let i = 0; i < 96; i += 1) {
      const x = 360 + seededRange(i * 31, -210, 940);
      const y = 690 + seededRange(i * 37, 0, 150);
      const stage = i % 4 === 0 ? "copper-aging" : i % 4 === 1 ? "yellowing" : i % 4 === 2 ? "late-cycle" : "snow-touch";
      const color = leafFill(i + 4000, "leaf", stage);

      fallen.appendChild(s("path", {
        class: `fallen-leaf fallen-${stage}`,
        d: leafPath((i % 4) + 1),
        transform: `translate(${x} ${y}) rotate(${seededRange(i * 41, -88, 88)}) scale(${seededRange(i * 43, .12, .23)})`,
        fill: color,
        stroke: leafEdge(i, stage),
        "stroke-width": .7,
        opacity: seededRange(i * 47, .34, .74)
      }));
    }

    layer.appendChild(fallen);
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
        d: path,
        fill: "none",
        stroke: "rgba(239,246,248,.56)",
        "stroke-width": 7,
        "stroke-linecap": "round"
      }));
    });

    for (let i = 0; i < 128; i += 1) {
      const x = 742 + (i * 13) % 118;
      const y1 = 418 + (i * 29) % 324;
      const y2 = y1 + 28 + (i % 7) * 12;
      const isHighlight = i % 4 === 0;
      const isScar = i % 11 === 0;

      trunkLayer.appendChild(s("path", {
        class: isScar ? "bark-scar" : isHighlight ? "bark-highlight" : "bark-fissure",
        d: `M ${x} ${y1} C ${x - 12 + i % 9} ${y1 + 22}, ${x + 9 - i % 8} ${y2 - 16}, ${x + 2} ${y2}`,
        fill: "none",
        stroke: isScar ? "rgba(242,199,111,.30)" : isHighlight ? "rgba(235,205,150,.24)" : "rgba(28,14,7,.72)",
        "stroke-width": isScar ? 4 : isHighlight ? 2 : 3,
        "stroke-linecap": "round"
      }));
    }

    for (let i = 0; i < 24; i += 1) {
      const x = 748 + seededRange(i * 53, 0, 104);
      const y = 430 + seededRange(i * 59, 0, 300);

      trunkLayer.appendChild(s("ellipse", {
        class: "old-bark-knot",
        cx: x,
        cy: y,
        rx: seededRange(i * 61, 3, 8),
        ry: seededRange(i * 67, 5, 14),
        fill: "rgba(28,13,7,.55)",
        stroke: "rgba(224,183,121,.18)",
        "stroke-width": 1.2,
        transform: `rotate(${seededRange(i * 71, -28, 28)} ${x} ${y})`
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
      filter: attrs.frosted ? "url(#frostGlow)" : "url(#leafShadow)",
      opacity: attrs.opacity || 1,
      "data-life-stage": attrs.stage,
      "data-leaf-role": attrs.role,
      "data-structural-terminal": attrs.structuralTerminal ? "true" : "false",
      "data-parent-terminal": attrs.parentTerminal,
      "data-parent-branch-seat": attrs.parentBranchSeat,
      "data-canopy": attrs.canopy
    }));

    group.appendChild(s("path", {
      d: "M 0 -13 C 1 -4 0 8 0 22",
      transform: `translate(${attrs.x} ${attrs.y}) rotate(${attrs.angle}) scale(${attrs.scale})`,
      fill: "none",
      stroke: attrs.midrib || "rgba(235,248,220,.25)",
      "stroke-width": attrs.structuralTerminal ? 0.95 : 0.62,
      "stroke-linecap": "round",
      opacity: attrs.veinOpacity || 1
    }));

    if (attrs.stage === "snow-touch") {
      group.appendChild(s("path", {
        class: "leaf-snow-touch",
        d: "M -8 -15 C -3 -18, 5 -18, 11 -14",
        transform: `translate(${attrs.x} ${attrs.y}) rotate(${attrs.angle}) scale(${attrs.scale})`,
        fill: "none",
        stroke: "rgba(241,252,255,.72)",
        "stroke-width": 1.2,
        "stroke-linecap": "round"
      }));
    }

    if (attrs.stage === "frost-touch") {
      group.appendChild(s("path", {
        class: "leaf-frost-crystal",
        d: "M -7 -8 L 7 8 M 7 -8 L -7 8 M 0 -12 L 0 12",
        transform: `translate(${attrs.x} ${attrs.y}) rotate(${attrs.angle}) scale(${attrs.scale * .55})`,
        fill: "none",
        stroke: "rgba(232,251,255,.42)",
        "stroke-width": .7,
        "stroke-linecap": "round"
      }));
    }

    if (attrs.stage === "late-cycle" || attrs.stage === "copper-aging") {
      group.appendChild(s("circle", {
        class: "leaf-decay-speck",
        cx: attrs.x + seededRange(attrs.seed * 73, -4, 4),
        cy: attrs.y + seededRange(attrs.seed * 79, -2, 6),
        r: seededRange(attrs.seed * 83, .8, 1.7),
        fill: "rgba(49,31,16,.42)"
      }));
    }
  }

  function makeLeafCluster(node, pos) {
    const structuralStage = lifeStage(node.index, node.terminalType);

    const cluster = s("g", {
      class: "terminal-node-group terminal-leaf-cluster",
      transform: `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${pos.scale})`,
      "data-terminal-id": node.id,
      "data-terminal-index": node.index,
      "data-terminal-type": node.terminalType,
      "data-canopy": node.canopyCluster,
      "data-branch-seat": node.branchSeat,
      "data-leaf-cluster": "seasonal-age-expanded",
      "data-tree-generation": TREE_GENERATION,
      "data-structural-terminal-count": "1",
      "data-detail-leaf-count": "5",
      "data-primary-life-stage": structuralStage
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
      const stage = lifeStage(seed, node.terminalType);

      appendLeafShape(cluster, {
        className: "terminal-node terminal-leaf detail-leaf seasonal-detail-leaf",
        x: leaf.x + seededRange(seed * 31, -3, 3),
        y: leaf.y + seededRange(seed * 37, -3, 3),
        angle: leaf.angle + seededRange(seed * 41, -9, 9),
        scale: leaf.scale + seededRange(seed * 43, -0.04, 0.05),
        fill: leafFill(seed, node.terminalType, stage),
        stroke: leafEdge(seed, stage),
        variant: (seed % 4) + 1,
        role: "detail-leaf",
        structuralTerminal: false,
        parentTerminal: node.id,
        parentBranchSeat: node.branchSeat,
        canopy: node.canopyCluster,
        midrib: stage === "snow-touch" || stage === "frost-touch" ? "rgba(232,251,255,.30)" : "rgba(235,248,220,.18)",
        opacity: stage === "late-cycle" ? .82 : 1,
        veinOpacity: stage === "deep-mature" ? .78 : 1,
        stage,
        seed,
        frosted: stage === "frost-touch" || stage === "snow-touch"
      });
    });

    appendLeafShape(cluster, {
      className: "terminal-node terminal-leaf individual-leaf structural-terminal-leaf seasonal-structural-leaf",
      x: 0,
      y: 0,
      angle: 0,
      scale: 1,
      fill: leafFill(node.index, node.terminalType, structuralStage),
      stroke: leafEdge(node.index, structuralStage),
      strokeWidth: 1.05,
      variant: (node.index % 4) + 1,
      role: "structural-terminal-leaf",
      structuralTerminal: true,
      parentTerminal: node.id,
      parentBranchSeat: node.branchSeat,
      canopy: node.canopyCluster,
      midrib: structuralStage === "snow-touch" || structuralStage === "frost-touch" ? "rgba(232,251,255,.34)" : "rgba(235,248,220,.32)",
      opacity: structuralStage === "late-cycle" ? .86 : 1,
      stage: structuralStage,
      seed: node.index,
      frosted: structuralStage === "frost-touch" || structuralStage === "snow-touch"
    });

    if (node.index % 9 === 0) {
      cluster.appendChild(s("path", {
        class: "new-growth-tip",
        d: "M -5 -30 C -2 -37, 4 -38, 8 -31",
        fill: "none",
        stroke: "rgba(154,207,104,.78)",
        "stroke-width": 2.1,
        "stroke-linecap": "round"
      }));
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
      "data-tree-generation": TREE_GENERATION,
      "data-structural-terminals": "256",
      "data-detail-leaves": "1280",
      "data-total-visible-leaves": "1536",
      "data-seasonal-cycle": "mixed"
    });

    const seatNodeMap = new Map();

    terminalNodes.forEach((node) => {
      if (!seatNodeMap.has(node.branchSeat)) seatNodeMap.set(node.branchSeat, []);
      seatNodeMap.get(node.branchSeat).push(node);
    });

    branchSeats.forEach((branch) => {
      const canopy = canopyPosition(branch.canopyCluster);
      const seat = branchSeatPosition(branch.canopyCluster, branch.localIndex);

      branchLayer.appendChild(s("path", {
        d: `M ${canopy.x} ${canopy.y} C ${(canopy.x + seat.x) / 2} ${canopy.y - 10}, ${(canopy.x + seat.x) / 2} ${seat.y + 10}, ${seat.x} ${seat.y}`,
        fill: "none",
        stroke: "rgba(82,48,28,.86)",
        "stroke-width": 7.8,
        "stroke-linecap": "round",
        "data-canopy": branch.canopyCluster,
        "data-branch-seat": branch.id
      }));

      if (branch.index % 7 === 0) {
        branchLayer.appendChild(s("path", {
          class: "bare-seasonal-twig",
          d: `M ${seat.x} ${seat.y} C ${seat.x + seededRange(branch.index * 13, -24, 24)} ${seat.y - seededRange(branch.index * 17, 14, 36)}, ${seat.x + seededRange(branch.index * 19, -46, 46)} ${seat.y - seededRange(branch.index * 23, 28, 64)}, ${seat.x + seededRange(branch.index * 29, -58, 58)} ${seat.y - seededRange(branch.index * 31, 44, 76)}`,
          fill: "none",
          stroke: "rgba(76,47,29,.58)",
          "stroke-width": 2.1,
          "stroke-linecap": "round"
        }));
      }

      const nodes = seatNodeMap.get(branch.index) || [];
      const positioned = nodes.map((node) => ({ node, pos: terminalPosition(node) }));
      const upperHub = { x: seat.x + seededRange(branch.index * 21, 6, 12), y: seat.y - seededRange(branch.index * 23, 8, 14) };
      const lowerHub = { x: seat.x - seededRange(branch.index * 25, 4, 10), y: seat.y + seededRange(branch.index * 27, 8, 14) };

      [upperHub, lowerHub].forEach((hub, index) => {
        branchLayer.appendChild(s("path", {
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

    svg.appendChild(branchLayer);
    svg.appendChild(leafLayer);
  }

  function drawFruitBody(group, fruit) {
    const stem = s("path", {
      d: `M ${fruit.x} ${fruit.y - fruit.r} C ${fruit.x + 2} ${fruit.y - fruit.r - 8}, ${fruit.x + 8} ${fruit.y - fruit.r - 10}, ${fruit.x + 12} ${fruit.y - fruit.r - 15}`,
      fill: "none",
      stroke: "rgba(77,50,28,.88)",
      "stroke-width": Math.max(1.4, fruit.r * 0.18),
      "stroke-linecap": "round"
    });

    group.appendChild(stem);

    if (fruit.kind === "cherry") {
      group.appendChild(s("circle", { cx: fruit.x - fruit.r * .35, cy: fruit.y, r: fruit.r * .68, fill: fruitFill(fruit.kind), filter: "url(#fruitGlow)", "data-ripeness": fruit.ripeness }));
      group.appendChild(s("circle", { cx: fruit.x + fruit.r * .38, cy: fruit.y + fruit.r * .08, r: fruit.r * .68, fill: fruitFill(fruit.kind), filter: "url(#fruitGlow)", "data-ripeness": fruit.ripeness }));
    } else if (fruit.kind === "pear") {
      group.appendChild(s("path", {
        d: `M ${fruit.x} ${fruit.y - fruit.r} C ${fruit.x + fruit.r} ${fruit.y - fruit.r * .3}, ${fruit.x + fruit.r * .9} ${fruit.y + fruit.r}, ${fruit.x} ${fruit.y + fruit.r * 1.2} C ${fruit.x - fruit.r * .9} ${fruit.y + fruit.r}, ${fruit.x - fruit.r} ${fruit.y - fruit.r * .3}, ${fruit.x} ${fruit.y - fruit.r} Z`,
        fill: fruitFill(fruit.kind),
        filter: "url(#fruitGlow)",
        "data-ripeness": fruit.ripeness
      }));
    } else {
      group.appendChild(s("circle", { cx: fruit.x, cy: fruit.y, r: fruit.r, fill: fruitFill(fruit.kind), filter: "url(#fruitGlow)", "data-ripeness": fruit.ripeness }));
    }

    group.appendChild(s("circle", {
      cx: fruit.x - fruit.r * .32,
      cy: fruit.y - fruit.r * .36,
      r: Math.max(1.4, fruit.r * .13),
      fill: "rgba(255,245,221,.72)"
    }));

    if (fruit.ripeness === "frosted") {
      group.appendChild(s("path", {
        class: "fruit-frost-touch",
        d: `M ${fruit.x - fruit.r * .62} ${fruit.y - fruit.r * .2} C ${fruit.x - fruit.r * .2} ${fruit.y - fruit.r * .62}, ${fruit.x + fruit.r * .38} ${fruit.y - fruit.r * .54}, ${fruit.x + fruit.r * .68} ${fruit.y - fruit.r * .1}`,
        fill: "none",
        stroke: "rgba(235,252,255,.68)",
        "stroke-width": 1.4,
        "stroke-linecap": "round"
      }));
    }

    if (fruit.ripeness === "yellowing" || fruit.ripeness === "deep") {
      group.appendChild(s("circle", {
        class: "fruit-age-speck",
        cx: fruit.x + fruit.r * .36,
        cy: fruit.y + fruit.r * .28,
        r: Math.max(1.1, fruit.r * .12),
        fill: "rgba(45,24,12,.36)"
      }));
    }
  }

  function drawNavigationFruit(svg) {
    const fruitLayer = s("g", {
      class: "svg-layer fruit-navigation-layer",
      "data-render-pass": "PASS_7_FRUIT_NAVIGATION",
      "data-fruit-navigation": "active",
      "data-fruit-cycle": "mixed-ripeness"
    });

    routeFruit.forEach((fruit) => {
      const link = s("a", {
        class: "fruit-route-link",
        href: fruit.href,
        "aria-label": `${fruit.label} fruit route`,
        "data-fruit-route": fruit.href,
        "data-fruit-label": fruit.label,
        "data-fruit-kind": fruit.kind,
        "data-ripeness": fruit.ripeness
      });

      const group = s("g", { class: "fruit-route", tabindex: "0" });
      drawFruitBody(group, fruit);

      const label = s("text", {
        class: "fruit-route-label",
        x: fruit.x,
        y: fruit.y + fruit.r + 18,
        "text-anchor": "middle"
      });
      label.textContent = fruit.label;
      group.appendChild(label);

      link.appendChild(group);
      fruitLayer.appendChild(link);
    });

    productFruit.forEach((fruit) => {
      const link = s("a", {
        class: "product-fruit-route-link",
        href: fruit.href,
        "aria-label": `${fruit.label} product fruit route`,
        "data-fruit-route": fruit.href,
        "data-fruit-label": fruit.label,
        "data-fruit-kind": fruit.kind,
        "data-ripeness": fruit.ripeness
      });

      const group = s("g", { class: "product-fruit-route", tabindex: "0" });
      drawFruitBody(group, fruit);

      const label = s("text", {
        class: "product-fruit-label",
        x: fruit.x,
        y: fruit.y + fruit.r + 13,
        "text-anchor": "middle"
      });
      label.textContent = fruit.label;
      group.appendChild(label);

      link.appendChild(group);
      fruitLayer.appendChild(link);
    });

    svg.appendChild(fruitLayer);
  }

  function drawInsects(svg, state) {
    if (state.view !== "inspect") return;

    const insectLayer = s("g", {
      class: "svg-layer insect-layer",
      "data-render-pass": "PASS_7_INSECT_INSPECTION"
    });

    for (let i = 0; i < 42; i += 1) {
      const x = 500 + seededRange(i * 17, 0, 620);
      const y = 160 + seededRange(i * 19, 0, 395);
      const scale = seededRange(i * 23, .55, 1.15);

      const bug = s("g", {
        class: i % 3 === 0 ? "ladybug inspect-insect" : "inspect-insect",
        transform: `translate(${x} ${y}) scale(${scale}) rotate(${seededRange(i * 31, -30, 30)})`
      });

      bug.appendChild(s("ellipse", {
        cx: 0,
        cy: 0,
        rx: 3.8,
        ry: 5.2,
        fill: i % 3 === 0 ? "rgba(190,29,40,.88)" : "rgba(40,30,20,.82)",
        stroke: "rgba(5,5,5,.55)",
        "stroke-width": .8
      }));

      if (i % 3 === 0) {
        bug.appendChild(s("circle", { cx: -1.2, cy: -1.2, r: .55, fill: "rgba(10,10,10,.86)" }));
        bug.appendChild(s("circle", { cx: 1.4, cy: 1.3, r: .55, fill: "rgba(10,10,10,.86)" }));
      }

      insectLayer.appendChild(bug);
    }

    svg.appendChild(insectLayer);
  }

  function drawReceipt(svg) {
    const receipt = s("g", { class: "svg-layer layer-details", "data-render-pass": "PASS_8_RECEIPT_MARKERS" });
    receipt.appendChild(s("metadata", {
      "data-render-filter": "single-authority",
      "data-tree-generation": TREE_GENERATION,
      "data-tree-g1": "accepted-baseline",
      "data-tree-g2": "seasonal-age-render",
      "data-structural-terminals": "256",
      "data-detail-leaves": "1280",
      "data-total-visible-leaves": "1536",
      "data-seasonal-cycle": "mixed",
      "data-leaf-age-variation": "active",
      "data-fruit-navigation": "active",
      "data-three-view-system": "active",
      "data-generation-readiness": "GEN_1_3D_BASELINE",
      "data-core-experience-hold": "true"
    }));
    svg.appendChild(receipt);
  }

  function drawSceneCaption(root, state) {
    const copy = {
      gate: ["Gate View · Tree G2", "From the gate, the Manor and tree now carry age: mixed leaves, frost touches, fallen leaves, older bark, and fruit in different ripeness stages."],
      tree: ["Tree View · Seasonal Age", "The tree is no longer instant-green. Leaves sit at different points in the cycle while fruit remains the navigational surface."],
      inspect: ["Inspect View · Living Detail", "Zoom into mixed-cycle leaves, insects, frost, age marks, fruit, and branch texture."]
    }[state.view];

    root.appendChild(h("article", { className: "scene-mini-caption tree-g2-caption" }, [
      h("p", { className: "kicker", text: copy[0] }),
      h("p", { text: copy[1] })
    ]));
  }

  function baseSvg(state) {
    const svg = s("svg", {
      class: "tree-svg",
      viewBox: viewBoxFor(state.view),
      role: "img",
      "aria-label": "Rich Manor and Estate Tree of Life fruit navigation scene with Tree G2 seasonal age rendering",
      "data-active-view": state.view,
      "data-render-filter": "single-authority",
      "data-tree-generation": TREE_GENERATION
    });

    addDefs(svg);
    drawSceneBase(svg);
    drawManor(svg);
    drawTreeStructure(svg);
    drawBranchFrameAndTerminals(svg, state);
    drawNavigationFruit(svg, state);
    drawInsects(svg, state);
    drawReceipt(svg);

    return svg;
  }

  function render(state, root) {
    if (!root) return;

    const next = Object.assign({
      view: "gate",
      butterflyVisibility: "hidden",
      generationReadiness: "GEN_1_3D_BASELINE",
      coreExperienceHold: true
    }, state || {});

    root.replaceChildren();

    root.dataset.renderStatus = "rendering";
    root.dataset.activeView = next.view;
    root.dataset.renderFilter = "single-authority";
    root.dataset.treeGeneration = TREE_GENERATION;
    root.dataset.treeG1 = "accepted-baseline";
    root.dataset.treeG2 = "seasonal-age-render";
    root.dataset.structuralTerminals = "256";
    root.dataset.detailLeaves = "1280";
    root.dataset.totalVisibleLeaves = "1536";
    root.dataset.seasonalCycle = "mixed";
    root.dataset.leafAgeVariation = "active";
    root.dataset.fruitNavigation = "active";

    const scene = h("section", {
      className: `tree-scene tree-view-${next.view}`,
      "aria-label": `${next.view} view`,
      "data-active-view": next.view,
      "data-render-filter": "single-authority",
      "data-tree-generation": TREE_GENERATION
    });

    scene.appendChild(baseSvg(next));
    root.appendChild(scene);
    drawSceneCaption(root, next);

    root.dataset.renderStatus = "complete";
  }

  window.DGBIndexRender = Object.freeze({ render });
})();
