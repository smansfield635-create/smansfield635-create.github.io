(() => {
  "use strict";

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildGeometry(opts) {
    return `
      <g opacity="${opts.geometryOpacity}">
        <circle cx="50" cy="44" r="22" fill="none" stroke="${opts.geometryStroke}" stroke-width=".35"/>
        <circle cx="50" cy="44" r="12" fill="none" stroke="${opts.geometryStroke}" stroke-width=".35"/>
        <path d="M50 8 L81 26 L81 62 L50 82 L19 62 L19 26 Z" fill="none" stroke="${opts.geometryStroke}" stroke-width=".38"/>
        <path d="M50 14 L74 28 L74 58 L50 72 L26 58 L26 28 Z" fill="none" stroke="${opts.geometryStroke}" stroke-width=".28"/>
        <path d="M50 8 V92" fill="none" stroke="${opts.geometryStroke}" stroke-width=".28"/>
        <path d="M14 44 H86" fill="none" stroke="${opts.geometryStroke}" stroke-width=".28"/>
        <path d="M30 24 L70 64" fill="none" stroke="${opts.geometryStroke}" stroke-width=".22"/>
        <path d="M70 24 L30 64" fill="none" stroke="${opts.geometryStroke}" stroke-width=".22"/>
        <circle cx="50" cy="44" r="2.2" fill="${opts.geometryStroke}"/>
        <circle cx="50" cy="86" r="6" fill="none" stroke="${opts.geometryStroke}" stroke-width=".28"/>
        <path d="M50 80 L50 98" fill="none" stroke="${opts.geometryStroke}" stroke-width=".22"/>
      </g>
    `;
  }

  function buildStormFlash(opts) {
    return `
      <g class="pg-lightning" opacity="0">
        <ellipse cx="${opts.flashCx}" cy="${opts.flashCy}" rx="${opts.flashRx}" ry="${opts.flashRy}" fill="${opts.flashCore}" opacity=".72"/>
        <ellipse cx="${opts.flashCx}" cy="${opts.flashCy}" rx="${opts.flashRx * 1.8}" ry="${opts.flashRy * 1.6}" fill="${opts.flashGlow}" opacity=".30"/>
        <ellipse cx="${opts.flashCx}" cy="${opts.flashCy}" rx="${opts.flashRx * 2.8}" ry="${opts.flashRy * 2.3}" fill="${opts.flashGlow}" opacity=".12"/>
        <rect x="0" y="0" width="100" height="100" fill="url(#${opts.id}-flash-grad)" opacity=".34"/>
      </g>
    `;
  }

  function buildTree(opts) {
    const blossom = opts.canopyNodes.map((node) => `
      <ellipse
        cx="${node.cx}"
        cy="${node.cy}"
        rx="${node.rx}"
        ry="${node.ry}"
        fill="url(#${opts.id}-leaf-grad)"
        opacity="${node.opacity}"
      />
    `).join("");

    const branchSet = opts.branches.map((d) => `
      <path
        d="${esc(d)}"
        fill="none"
        stroke="url(#${opts.id}-branch-grad)"
        stroke-width="${opts.branchWidth}"
        stroke-linecap="round"
        opacity="${opts.branchOpacity}"
      />
    `).join("");

    const fineBranchSet = opts.fineBranches.map((d) => `
      <path
        d="${esc(d)}"
        fill="none"
        stroke="${opts.fineBranchStroke}"
        stroke-width="${opts.fineBranchWidth}"
        stroke-linecap="round"
        opacity="${opts.fineBranchOpacity}"
      />
    `).join("");

    const roots = opts.roots.map((d) => `
      <path
        d="${esc(d)}"
        fill="none"
        stroke="${opts.rootStroke}"
        stroke-width="${opts.rootWidth}"
        stroke-linecap="round"
        opacity="${opts.rootOpacity}"
      />
    `).join("");

    return `
      <g
        class="pg-tree"
        opacity="${opts.treeOpacity}"
        filter="url(#${opts.id}-tree-blur)"
        transform="translate(${opts.treeTranslateX} ${opts.treeTranslateY}) scale(${opts.treeScale})"
      >
        <path
          d="${esc(opts.trunkPath)}"
          fill="none"
          stroke="url(#${opts.id}-trunk-grad)"
          stroke-width="${opts.trunkWidth}"
          stroke-linecap="round"
          opacity="${opts.trunkOpacity}"
        />
        ${branchSet}
        ${fineBranchSet}
        ${roots}
        ${blossom}
      </g>
    `;
  }

  function buildLandscape(opts) {
    return `
      <g opacity="${opts.landOpacity}">
        <path d="${esc(opts.hillBack)}" fill="${opts.hillBackFill}"/>
        <path d="${esc(opts.hillMid)}" fill="${opts.hillMidFill}"/>
        <path d="${esc(opts.hillFront)}" fill="${opts.hillFrontFill}"/>
      </g>
    `;
  }

  function buildRain(opts) {
    return `
      <rect x="-20" y="-20" width="140" height="140" fill="url(#${opts.id}-rain)" opacity="${opts.rainOpacity}"/>
    `;
  }

  function buildFrameLines(opts) {
    return opts.mullionV
      ? `<rect x="48.7" y="0" width="2.6" height="100" fill="rgba(10,14,24,.92)" opacity=".94"/>`
      : "";
  }

  function sceneSvg(opts) {
    return `
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        class="pg-scene-svg"
        style="position:absolute;inset:0;width:100%;height:100%;display:block;"
      >
        <defs>
          <linearGradient id="${opts.id}-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${opts.skyTop}"/>
            <stop offset="52%" stop-color="${opts.skyMid}"/>
            <stop offset="100%" stop-color="${opts.skyBottom}"/>
          </linearGradient>

          <radialGradient id="${opts.id}-fog-a" cx="18%" cy="18%" r="35%">
            <stop offset="0%" stop-color="${opts.glowA}"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>

          <radialGradient id="${opts.id}-fog-b" cx="82%" cy="22%" r="35%">
            <stop offset="0%" stop-color="${opts.glowB}"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>

          <radialGradient id="${opts.id}-fog-c" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stop-color="${opts.fog}"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>

          <radialGradient id="${opts.id}-horizon" cx="50%" cy="100%" r="45%">
            <stop offset="0%" stop-color="${opts.horizonGlow}"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>

          <linearGradient id="${opts.id}-rain" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${opts.rainAngle})">
            <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
            <stop offset="48%" stop-color="rgba(194,214,255,.05)"/>
            <stop offset="50%" stop-color="rgba(194,214,255,.09)"/>
            <stop offset="52%" stop-color="rgba(255,255,255,0)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
          </linearGradient>

          <linearGradient id="${opts.id}-trunk-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${opts.treeTintA}"/>
            <stop offset="100%" stop-color="${opts.treeTintB}"/>
          </linearGradient>

          <linearGradient id="${opts.id}-branch-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${opts.treeTintA}"/>
            <stop offset="100%" stop-color="${opts.treeTintB}"/>
          </linearGradient>

          <radialGradient id="${opts.id}-leaf-grad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="${opts.leafTintA}"/>
            <stop offset="100%" stop-color="${opts.leafTintB}"/>
          </radialGradient>

          <radialGradient id="${opts.id}-flash-grad" cx="${opts.flashCx}%" cy="${opts.flashCy}%" r="46%">
            <stop offset="0%" stop-color="${opts.flashGlow}"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>

          <filter id="${opts.id}-tree-blur">
            <feGaussianBlur stdDeviation="${opts.treeBlur}"/>
          </filter>
        </defs>

        <rect x="0" y="0" width="100" height="100" fill="url(#${opts.id}-sky)"/>
        <rect x="0" y="0" width="100" height="100" fill="url(#${opts.id}-fog-a)"/>
        <rect x="0" y="0" width="100" height="100" fill="url(#${opts.id}-fog-b)"/>
        <rect x="0" y="0" width="100" height="100" fill="url(#${opts.id}-fog-c)"/>
        ${buildRain(opts)}
        <rect x="0" y="56" width="100" height="44" fill="url(#${opts.id}-horizon)"/>
        ${buildLandscape(opts)}
        ${buildGeometry(opts)}
        ${buildTree(opts)}
        ${buildStormFlash(opts)}
        ${buildFrameLines(opts)}
      </svg>
    `;
  }

  const SCENES = Object.freeze({
    archcoin: {
      id: "pg-archcoin",
      skyTop: "#0a1224",
      skyMid: "#142544",
      skyBottom: "#090f1b",
      fog: "rgba(173,195,232,.14)",
      glowA: "rgba(232,192,116,.12)",
      glowB: "rgba(123,151,224,.14)",
      horizonGlow: "rgba(232,181,104,.10)",
      rainOpacity: 0.14,
      rainAngle: 103,
      flashCx: 62,
      flashCy: 24,
      flashRx: 7,
      flashRy: 10,
      flashCore: "rgba(241,246,255,.88)",
      flashGlow: "rgba(203,219,255,.22)",
      treeTintA: "#c9b07a",
      treeTintB: "#6f5a40",
      leafTintA: "rgba(214,187,118,.28)",
      leafTintB: "rgba(116,92,54,.22)",
      treeOpacity: 0.20,
      treeBlur: 1.35,
      treeScale: 0.88,
      treeTranslateX: 6,
      treeTranslateY: 9,
      trunkWidth: 2.2,
      trunkOpacity: 0.88,
      branchWidth: 1.1,
      branchOpacity: 0.62,
      fineBranchStroke: "rgba(206,186,136,.42)",
      fineBranchWidth: 0.42,
      fineBranchOpacity: 0.44,
      rootStroke: "rgba(166,136,90,.34)",
      rootWidth: 0.62,
      rootOpacity: 0.32,
      geometryOpacity: 0.18,
      geometryStroke: "rgba(214,183,118,.26)",
      landOpacity: 0.42,
      hillBackFill: "rgba(17,27,44,.44)",
      hillMidFill: "rgba(26,36,58,.34)",
      hillFrontFill: "rgba(17,16,22,.28)",
      hillBack: "M0 62 C16 56, 30 54, 46 58 C58 61, 72 54, 100 59 L100 100 L0 100 Z",
      hillMid: "M0 72 C18 69, 36 63, 52 66 C70 70, 84 64, 100 68 L100 100 L0 100 Z",
      hillFront: "M0 82 C14 80, 28 76, 46 78 C63 80, 80 75, 100 79 L100 100 L0 100 Z",
      trunkPath: "M50 82 C50 70, 50 60, 50 50 C50 40, 50 30, 50 20",
      branches: [
        "M50 46 C42 41, 35 33, 28 25",
        "M50 44 C58 40, 66 33, 74 26",
        "M50 38 C45 30, 39 24, 34 18",
        "M50 36 C56 29, 62 24, 68 18"
      ],
      fineBranches: [
        "M34 18 C31 15, 28 13, 25 11",
        "M34 18 C36 15, 38 13, 41 11",
        "M68 18 C64 14, 61 12, 58 10",
        "M68 18 C71 15, 74 12, 77 10",
        "M28 25 C24 23, 21 20, 18 17",
        "M74 26 C78 23, 81 20, 84 17",
        "M50 22 C48 18, 47 15, 45 12",
        "M50 22 C52 18, 53 15, 55 12"
      ],
      roots: [
        "M50 82 C46 86, 42 89, 38 92",
        "M50 82 C54 86, 58 89, 62 92",
        "M50 82 C49 87, 49 91, 48 96",
        "M50 82 C51 87, 52 91, 53 96"
      ],
      canopyNodes: [
        { cx: 38, cy: 22, rx: 12, ry: 8, opacity: 0.62 },
        { cx: 50, cy: 19, rx: 15, ry: 9, opacity: 0.66 },
        { cx: 62, cy: 22, rx: 12, ry: 8, opacity: 0.62 },
        { cx: 44, cy: 28, rx: 11, ry: 7, opacity: 0.56 },
        { cx: 57, cy: 28, rx: 11, ry: 7, opacity: 0.56 }
      ],
      mullionV: true
    },
    aai: {
      id: "pg-aai",
      skyTop: "#091220",
      skyMid: "#11213d",
      skyBottom: "#070d17",
      fog: "rgba(173,199,237,.16)",
      glowA: "rgba(184,213,255,.10)",
      glowB: "rgba(110,142,216,.12)",
      horizonGlow: "rgba(129,154,214,.08)",
      rainOpacity: 0.12,
      rainAngle: 102,
      flashCx: 56,
      flashCy: 22,
      flashRx: 7,
      flashRy: 9,
      flashCore: "rgba(239,245,255,.84)",
      flashGlow: "rgba(191,213,255,.20)",
      treeTintA: "#b4cceb",
      treeTintB: "#5c7599",
      leafTintA: "rgba(191,216,255,.22)",
      leafTintB: "rgba(102,127,164,.18)",
      treeOpacity: 0.18,
      treeBlur: 1.55,
      treeScale: 0.82,
      treeTranslateX: 8,
      treeTranslateY: 10,
      trunkWidth: 2.0,
      trunkOpacity: 0.82,
      branchWidth: 1.0,
      branchOpacity: 0.58,
      fineBranchStroke: "rgba(191,216,255,.34)",
      fineBranchWidth: 0.40,
      fineBranchOpacity: 0.40,
      rootStroke: "rgba(148,171,199,.28)",
      rootWidth: 0.58,
      rootOpacity: 0.28,
      geometryOpacity: 0.16,
      geometryStroke: "rgba(183,210,255,.24)",
      landOpacity: 0.36,
      hillBackFill: "rgba(15,25,42,.42)",
      hillMidFill: "rgba(22,34,52,.30)",
      hillFrontFill: "rgba(14,15,20,.24)",
      hillBack: "M0 61 C18 57, 34 55, 48 58 C62 61, 78 56, 100 60 L100 100 L0 100 Z",
      hillMid: "M0 72 C17 68, 34 64, 50 66 C67 69, 82 65, 100 69 L100 100 L0 100 Z",
      hillFront: "M0 83 C18 80, 36 77, 52 79 C68 81, 84 78, 100 81 L100 100 L0 100 Z",
      trunkPath: "M50 82 C50 72, 50 62, 50 52 C50 41, 50 31, 50 22",
      branches: [
        "M50 46 C43 40, 36 34, 29 27",
        "M50 44 C57 39, 64 34, 72 27",
        "M50 37 C46 31, 41 25, 37 20",
        "M50 36 C55 31, 60 25, 65 20"
      ],
      fineBranches: [
        "M29 27 C26 24, 23 21, 20 18",
        "M29 27 C32 24, 35 22, 39 20",
        "M72 27 C68 24, 64 21, 61 18",
        "M72 27 C75 24, 79 21, 82 18",
        "M37 20 C35 17, 33 14, 31 12",
        "M65 20 C67 17, 69 14, 71 12"
      ],
      roots: [
        "M50 82 C46 86, 42 89, 38 92",
        "M50 82 C54 86, 58 89, 62 92",
        "M50 82 C49 87, 48 91, 47 95",
        "M50 82 C51 87, 52 91, 53 95"
      ],
      canopyNodes: [
        { cx: 39, cy: 23, rx: 11, ry: 7, opacity: 0.54 },
        { cx: 50, cy: 20, rx: 14, ry: 8, opacity: 0.58 },
        { cx: 61, cy: 23, rx: 11, ry: 7, opacity: 0.54 },
        { cx: 45, cy: 29, rx: 10, ry: 6, opacity: 0.46 },
        { cx: 56, cy: 29, rx: 10, ry: 6, opacity: 0.46 }
      ],
      mullionV: true
    },
    nutrition: {
      id: "pg-nutrition",
      skyTop: "#0d1621",
      skyMid: "#1a2b36",
      skyBottom: "#0b1218",
      fog: "rgba(189,210,182,.12)",
      glowA: "rgba(155,190,129,.10)",
      glowB: "rgba(215,189,123,.08)",
      horizonGlow: "rgba(182,166,106,.08)",
      rainOpacity: 0.06,
      rainAngle: 101,
      flashCx: 52,
      flashCy: 25,
      flashRx: 6,
      flashRy: 8,
      flashCore: "rgba(241,246,255,.74)",
      flashGlow: "rgba(194,216,173,.14)",
      treeTintA: "#9dbc84",
      treeTintB: "#536d48",
      leafTintA: "rgba(176,207,150,.20)",
      leafTintB: "rgba(95,125,77,.18)",
      treeOpacity: 0.16,
      treeBlur: 1.65,
      treeScale: 0.78,
      treeTranslateX: 6,
      treeTranslateY: 11,
      trunkWidth: 1.9,
      trunkOpacity: 0.78,
      branchWidth: 0.94,
      branchOpacity: 0.54,
      fineBranchStroke: "rgba(181,208,155,.28)",
      fineBranchWidth: 0.36,
      fineBranchOpacity: 0.34,
      rootStroke: "rgba(132,152,110,.24)",
      rootWidth: 0.54,
      rootOpacity: 0.24,
      geometryOpacity: 0.14,
      geometryStroke: "rgba(185,205,146,.20)",
      landOpacity: 0.30,
      hillBackFill: "rgba(22,33,30,.34)",
      hillMidFill: "rgba(24,38,28,.26)",
      hillFrontFill: "rgba(14,18,14,.20)",
      hillBack: "M0 62 C18 58, 35 56, 50 58 C65 60, 82 56, 100 60 L100 100 L0 100 Z",
      hillMid: "M0 73 C18 69, 36 66, 52 67 C68 69, 84 66, 100 69 L100 100 L0 100 Z",
      hillFront: "M0 84 C18 81, 37 79, 54 80 C70 82, 85 80, 100 82 L100 100 L0 100 Z",
      trunkPath: "M50 82 C50 72, 50 63, 50 54 C50 44, 50 35, 50 25",
      branches: [
        "M50 47 C44 42, 38 37, 32 31",
        "M50 45 C56 41, 63 36, 69 31",
        "M50 39 C46 34, 42 29, 38 24",
        "M50 38 C54 34, 59 29, 63 24"
      ],
      fineBranches: [
        "M32 31 C29 28, 26 26, 23 23",
        "M69 31 C72 28, 75 26, 78 23",
        "M38 24 C36 21, 34 19, 32 16",
        "M63 24 C65 21, 67 19, 69 16"
      ],
      roots: [
        "M50 82 C46 86, 42 89, 38 92",
        "M50 82 C54 86, 58 89, 62 92",
        "M50 82 C49 87, 48 91, 47 95",
        "M50 82 C51 87, 52 91, 53 95"
      ],
      canopyNodes: [
        { cx: 38, cy: 24, rx: 10, ry: 6, opacity: 0.48 },
        { cx: 50, cy: 21, rx: 13, ry: 8, opacity: 0.54 },
        { cx: 62, cy: 24, rx: 10, ry: 6, opacity: 0.48 },
        { cx: 44, cy: 30, rx: 9, ry: 6, opacity: 0.40 },
        { cx: 56, cy: 30, rx: 9, ry: 6, opacity: 0.40 }
      ],
      mullionV: false
    },
    "five-flags": {
      id: "pg-fiveflags",
      skyTop: "#111320",
      skyMid: "#201f34",
      skyBottom: "#0c0e17",
      fog: "rgba(202,178,171,.10)",
      glowA: "rgba(201,145,110,.10)",
      glowB: "rgba(150,123,206,.08)",
      horizonGlow: "rgba(193,126,88,.08)",
      rainOpacity: 0.07,
      rainAngle: 105,
      flashCx: 58,
      flashCy: 23,
      flashRx: 6,
      flashRy: 8,
      flashCore: "rgba(242,244,255,.74)",
      flashGlow: "rgba(214,168,144,.14)",
      treeTintA: "#bf8869",
      treeTintB: "#714b3d",
      leafTintA: "rgba(205,157,128,.22)",
      leafTintB: "rgba(109,74,61,.18)",
      treeOpacity: 0.16,
      treeBlur: 1.6,
      treeScale: 0.78,
      treeTranslateX: 10,
      treeTranslateY: 11,
      trunkWidth: 1.95,
      trunkOpacity: 0.78,
      branchWidth: 0.96,
      branchOpacity: 0.54,
      fineBranchStroke: "rgba(204,156,127,.28)",
      fineBranchWidth: 0.36,
      fineBranchOpacity: 0.34,
      rootStroke: "rgba(152,107,89,.24)",
      rootWidth: 0.54,
      rootOpacity: 0.24,
      geometryOpacity: 0.14,
      geometryStroke: "rgba(208,155,126,.20)",
      landOpacity: 0.30,
      hillBackFill: "rgba(32,28,36,.34)",
      hillMidFill: "rgba(34,28,28,.26)",
      hillFrontFill: "rgba(18,15,15,.22)",
      hillBack: "M0 61 C18 57, 35 55, 52 57 C67 59, 84 56, 100 60 L100 100 L0 100 Z",
      hillMid: "M0 72 C18 68, 36 65, 54 67 C70 69, 84 66, 100 68 L100 100 L0 100 Z",
      hillFront: "M0 83 C18 80, 36 78, 54 79 C71 80, 86 79, 100 81 L100 100 L0 100 Z",
      trunkPath: "M50 82 C50 72, 50 63, 50 54 C50 44, 50 35, 50 25",
      branches: [
        "M50 47 C44 42, 37 37, 31 31",
        "M50 45 C57 40, 64 35, 71 30",
        "M50 39 C46 34, 42 29, 38 24",
        "M50 38 C54 34, 59 29, 64 24"
      ],
      fineBranches: [
        "M31 31 C28 28, 25 26, 22 23",
        "M71 30 C74 27, 77 24, 80 21",
        "M38 24 C36 21, 34 19, 31 16",
        "M64 24 C66 21, 69 19, 72 16"
      ],
      roots: [
        "M50 82 C46 86, 42 89, 38 92",
        "M50 82 C54 86, 58 89, 62 92",
        "M50 82 C49 87, 48 91, 47 95",
        "M50 82 C51 87, 52 91, 53 95"
      ],
      canopyNodes: [
        { cx: 38, cy: 24, rx: 10, ry: 6, opacity: 0.48 },
        { cx: 50, cy: 21, rx: 13, ry: 8, opacity: 0.54 },
        { cx: 62, cy: 24, rx: 10, ry: 6, opacity: 0.48 },
        { cx: 44, cy: 30, rx: 9, ry: 6, opacity: 0.40 },
        { cx: 56, cy: 30, rx: 9, ry: 6, opacity: 0.40 }
      ],
      mullionV: false
    },
    esl: {
      id: "pg-esl",
      skyTop: "#0c1420",
      skyMid: "#172435",
      skyBottom: "#081019",
      fog: "rgba(196,204,214,.10)",
      glowA: "rgba(171,192,222,.08)",
      glowB: "rgba(227,196,138,.06)",
      horizonGlow: "rgba(170,166,154,.07)",
      rainOpacity: 0.05,
      rainAngle: 100,
      flashCx: 48,
      flashCy: 24,
      flashRx: 5,
      flashRy: 7,
      flashCore: "rgba(239,244,255,.68)",
      flashGlow: "rgba(201,213,228,.12)",
      treeTintA: "#b0bdcb",
      treeTintB: "#63717f",
      leafTintA: "rgba(201,213,228,.18)",
      leafTintB: "rgba(108,118,129,.16)",
      treeOpacity: 0.14,
      treeBlur: 1.8,
      treeScale: 0.72,
      treeTranslateX: -2,
      treeTranslateY: 12,
      trunkWidth: 1.85,
      trunkOpacity: 0.72,
      branchWidth: 0.92,
      branchOpacity: 0.50,
      fineBranchStroke: "rgba(201,213,228,.24)",
      fineBranchWidth: 0.34,
      fineBranchOpacity: 0.30,
      rootStroke: "rgba(150,158,170,.22)",
      rootWidth: 0.52,
      rootOpacity: 0.22,
      geometryOpacity: 0.13,
      geometryStroke: "rgba(201,213,228,.18)",
      landOpacity: 0.28,
      hillBackFill: "rgba(20,28,36,.30)",
      hillMidFill: "rgba(24,28,32,.22)",
      hillFrontFill: "rgba(15,16,18,.18)",
      hillBack: "M0 61 C18 58, 36 56, 52 58 C69 60, 84 57, 100 60 L100 100 L0 100 Z",
      hillMid: "M0 73 C18 70, 37 67, 55 68 C71 69, 86 68, 100 70 L100 100 L0 100 Z",
      hillFront: "M0 84 C18 82, 37 80, 55 80 C72 81, 87 81, 100 82 L100 100 L0 100 Z",
      trunkPath: "M50 82 C50 73, 50 64, 50 56 C50 46, 50 37, 50 27",
      branches: [
        "M50 47 C45 42, 39 38, 33 33",
        "M50 46 C56 41, 62 37, 68 32",
        "M50 40 C46 35, 42 31, 38 26",
        "M50 39 C54 35, 58 31, 62 26"
      ],
      fineBranches: [
        "M33 33 C30 30, 27 28, 24 25",
        "M68 32 C71 29, 74 27, 77 24",
        "M38 26 C36 23, 34 21, 31 18",
        "M62 26 C64 23, 66 21, 69 18"
      ],
      roots: [
        "M50 82 C46 86, 42 89, 38 92",
        "M50 82 C54 86, 58 89, 62 92",
        "M50 82 C49 87, 48 91, 47 95",
        "M50 82 C51 87, 52 91, 53 95"
      ],
      canopyNodes: [
        { cx: 40, cy: 24, rx: 9, ry: 6, opacity: 0.40 },
        { cx: 50, cy: 21, rx: 12, ry: 7, opacity: 0.46 },
        { cx: 60, cy: 24, rx: 9, ry: 6, opacity: 0.40 },
        { cx: 45, cy: 30, rx: 8, ry: 5, opacity: 0.34 },
        { cx: 55, cy: 30, rx: 8, ry: 5, opacity: 0.34 }
      ],
      mullionV: false
    }
  });

  function renderScene(productKey) {
    const scene = SCENES[productKey] || SCENES.archcoin;
    return sceneSvg(scene);
  }

  window.ProductsGraphics = Object.freeze({
    renderScene
  });
})();
