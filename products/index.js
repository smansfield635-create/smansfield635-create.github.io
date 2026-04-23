(() => {
  "use strict";

  const PRODUCTS_PAGE_META = Object.freeze({
    name: "PRODUCTS_WINDOW_STORM_CHAMBER",
    version: "V11",
    role: "merged_chamber_renderer_and_causal_glass_owner",
    contract: "PRODUCTS_WINDOW_STORM_CHAMBER_V11",
    status: "ACTIVE",
    deterministic: true
  });

  const PRODUCTS = Object.freeze([
    {
      key: "archcoin",
      tier: "flagship",
      title: "ARCHCOIN",
      label: "Flagship",
      description: "The intelligence asset layer for a new financial era.",
      button: "Explore ARCHCOIN",
      href: "/products/archcoin/",
      theme: "gold",
      icon: "archcoin"
    },
    {
      key: "aai",
      tier: "flagship",
      title: "AAI",
      label: "Flagship",
      description: "Applied AI systems that think, learn, and execute.",
      button: "Explore AAI",
      href: "/products/aai/",
      theme: "blue",
      icon: "aai"
    },
    {
      key: "nutrition",
      tier: "path",
      title: "Baseline Nutrition Systems",
      label: "Product Path",
      description: "Nutrition intelligence for a stronger human foundation.",
      button: "Explore Path",
      href: "/products/nutrition/",
      theme: "neutral",
      icon: "leaf"
    },
    {
      key: "five-flags",
      tier: "path",
      title: "Five Flags: What’s My Scene",
      label: "Product Path",
      description: "Identity. Alignment. Purpose. Wave by wave.",
      button: "Explore Path",
      href: "/products/five-flags/",
      theme: "neutral",
      icon: "flag"
    },
    {
      key: "esl",
      tier: "path",
      title: "ESL Traversal Learning",
      label: "Product Path",
      description: "Language mastery that opens every door.",
      button: "Explore Path",
      href: "/products/education/",
      theme: "neutral",
      icon: "book"
    }
  ]);

  const SCENES = Object.freeze({
    archcoin: {
      id: "pg-archcoin",
      skyTop: "#08111f",
      skyMid: "#12203b",
      skyBottom: "#070d18",
      fog: "rgba(171,192,230,.10)",
      glowA: "rgba(226,191,112,.08)",
      glowB: "rgba(116,149,225,.10)",
      horizonGlow: "rgba(232,180,102,.06)",
      rainOpacity: 0.10,
      rainAngle: 103,
      flashCx: 66,
      flashCy: 22,
      flashRx: 10,
      flashRy: 14,
      flashCore: "rgba(243,247,255,.88)",
      flashGlow: "rgba(210,223,255,.18)",
      treeTintA: "#b89d67",
      treeTintB: "#5d4b34",
      leafTintA: "rgba(205,181,116,.14)",
      leafTintB: "rgba(96,78,52,.10)",
      treeOpacity: 0.08,
      treeBlur: 2.1,
      treeScale: 0.92,
      treeTranslateX: 6,
      treeTranslateY: 10,
      trunkWidth: 2.0,
      trunkOpacity: 0.56,
      branchWidth: 0.92,
      branchOpacity: 0.34,
      fineBranchStroke: "rgba(203,184,138,.18)",
      fineBranchWidth: 0.26,
      fineBranchOpacity: 0.14,
      rootStroke: "rgba(166,136,90,.11)",
      rootWidth: 0.38,
      rootOpacity: 0.10,
      geometryOpacity: 0.07,
      geometryStroke: "rgba(206,184,132,.10)",
      landOpacity: 0.16,
      hillBackFill: "rgba(16,27,44,.18)",
      hillMidFill: "rgba(22,34,56,.13)",
      hillFrontFill: "rgba(12,15,22,.10)",
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
        "M68 18 C71 15, 74 12, 77 10"
      ],
      roots: [
        "M50 82 C46 86, 42 89, 38 92",
        "M50 82 C54 86, 58 89, 62 92",
        "M50 82 C49 87, 49 91, 48 96",
        "M50 82 C51 87, 52 91, 53 96"
      ],
      canopyNodes: [
        { cx: 38, cy: 22, rx: 12, ry: 8, opacity: 0.28 },
        { cx: 50, cy: 19, rx: 15, ry: 9, opacity: 0.30 },
        { cx: 62, cy: 22, rx: 12, ry: 8, opacity: 0.28 },
        { cx: 44, cy: 28, rx: 11, ry: 7, opacity: 0.24 },
        { cx: 57, cy: 28, rx: 11, ry: 7, opacity: 0.24 }
      ],
      mullionV: true,
      response: {
        preflash: { sceneBlur: 0.10, sceneBrightness: 0.94, sceneSaturate: 0.92, haze: 0.30, crystal: 0.24, specular: 0.34, spill: 0.12, flash: 0.28 },
        primary:  { sceneBlur: 0.00, sceneBrightness: 1.10, sceneSaturate: 1.02, haze: 0.14, crystal: 0.40, specular: 0.54, spill: 0.22, flash: 1.00 },
        secondary:{ sceneBlur: 0.04, sceneBrightness: 1.02, sceneSaturate: 0.98, haze: 0.20, crystal: 0.32, specular: 0.44, spill: 0.16, flash: 0.56 },
        decay:    { sceneBlur: 0.12, sceneBrightness: 0.90, sceneSaturate: 0.88, haze: 0.34, crystal: 0.20, specular: 0.30, spill: 0.08, flash: 0.00 }
      }
    },
    aai: {
      id: "pg-aai",
      skyTop: "#08101e",
      skyMid: "#11203a",
      skyBottom: "#070d16",
      fog: "rgba(179,199,236,.10)",
      glowA: "rgba(186,214,255,.07)",
      glowB: "rgba(111,144,214,.09)",
      horizonGlow: "rgba(126,154,214,.05)",
      rainOpacity: 0.09,
      rainAngle: 102,
      flashCx: 64,
      flashCy: 24,
      flashRx: 10,
      flashRy: 13,
      flashCore: "rgba(240,245,255,.84)",
      flashGlow: "rgba(195,216,255,.16)",
      treeTintA: "#a7bfdc",
      treeTintB: "#576f8d",
      leafTintA: "rgba(188,214,255,.12)",
      leafTintB: "rgba(100,124,162,.10)",
      treeOpacity: 0.075,
      treeBlur: 2.2,
      treeScale: 0.86,
      treeTranslateX: 8,
      treeTranslateY: 11,
      trunkWidth: 1.9,
      trunkOpacity: 0.54,
      branchWidth: 0.88,
      branchOpacity: 0.32,
      fineBranchStroke: "rgba(189,214,255,.17)",
      fineBranchWidth: 0.24,
      fineBranchOpacity: 0.13,
      rootStroke: "rgba(148,171,199,.10)",
      rootWidth: 0.36,
      rootOpacity: 0.10,
      geometryOpacity: 0.065,
      geometryStroke: "rgba(184,210,255,.10)",
      landOpacity: 0.15,
      hillBackFill: "rgba(14,25,42,.17)",
      hillMidFill: "rgba(19,33,51,.12)",
      hillFrontFill: "rgba(12,15,20,.09)",
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
        "M72 27 C75 24, 79 21, 82 18"
      ],
      roots: [
        "M50 82 C46 86, 42 89, 38 92",
        "M50 82 C54 86, 58 89, 62 92",
        "M50 82 C49 87, 48 91, 47 95",
        "M50 82 C51 87, 52 91, 53 95"
      ],
      canopyNodes: [
        { cx: 39, cy: 23, rx: 11, ry: 7, opacity: 0.26 },
        { cx: 50, cy: 20, rx: 14, ry: 8, opacity: 0.28 },
        { cx: 61, cy: 23, rx: 11, ry: 7, opacity: 0.26 },
        { cx: 45, cy: 29, rx: 10, ry: 6, opacity: 0.22 },
        { cx: 56, cy: 29, rx: 10, ry: 6, opacity: 0.22 }
      ],
      mullionV: true,
      response: {
        preflash: { sceneBlur: 0.10, sceneBrightness: 0.94, sceneSaturate: 0.92, haze: 0.30, crystal: 0.24, specular: 0.34, spill: 0.12, flash: 0.26 },
        primary:  { sceneBlur: 0.00, sceneBrightness: 1.08, sceneSaturate: 1.01, haze: 0.14, crystal: 0.39, specular: 0.54, spill: 0.22, flash: 1.00 },
        secondary:{ sceneBlur: 0.04, sceneBrightness: 1.01, sceneSaturate: 0.98, haze: 0.20, crystal: 0.31, specular: 0.44, spill: 0.16, flash: 0.52 },
        decay:    { sceneBlur: 0.12, sceneBrightness: 0.90, sceneSaturate: 0.88, haze: 0.34, crystal: 0.20, specular: 0.30, spill: 0.08, flash: 0.00 }
      }
    },
    nutrition: {
      id: "pg-nutrition",
      skyTop: "#0b1520",
      skyMid: "#172833",
      skyBottom: "#0a1218",
      fog: "rgba(188,209,181,.08)",
      glowA: "rgba(154,190,128,.06)",
      glowB: "rgba(213,187,121,.05)",
      horizonGlow: "rgba(180,165,106,.05)",
      rainOpacity: 0.04,
      rainAngle: 101,
      flashCx: 58,
      flashCy: 26,
      flashRx: 8,
      flashRy: 11,
      flashCore: "rgba(241,246,255,.72)",
      flashGlow: "rgba(195,216,174,.10)",
      treeTintA: "#98b67f",
      treeTintB: "#526b47",
      leafTintA: "rgba(176,206,149,.11)",
      leafTintB: "rgba(95,124,77,.09)",
      treeOpacity: 0.07,
      treeBlur: 2.3,
      treeScale: 0.82,
      treeTranslateX: 6,
      treeTranslateY: 11,
      trunkWidth: 1.8,
      trunkOpacity: 0.50,
      branchWidth: 0.84,
      branchOpacity: 0.29,
      fineBranchStroke: "rgba(181,208,155,.15)",
      fineBranchWidth: 0.22,
      fineBranchOpacity: 0.12,
      rootStroke: "rgba(132,152,110,.09)",
      rootWidth: 0.34,
      rootOpacity: 0.09,
      geometryOpacity: 0.055,
      geometryStroke: "rgba(185,205,146,.09)",
      landOpacity: 0.14,
      hillBackFill: "rgba(22,33,30,.16)",
      hillMidFill: "rgba(24,38,28,.11)",
      hillFrontFill: "rgba(14,18,14,.08)",
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
        { cx: 38, cy: 24, rx: 10, ry: 6, opacity: 0.24 },
        { cx: 50, cy: 21, rx: 13, ry: 8, opacity: 0.26 },
        { cx: 62, cy: 24, rx: 10, ry: 6, opacity: 0.24 },
        { cx: 44, cy: 30, rx: 9, ry: 6, opacity: 0.20 },
        { cx: 56, cy: 30, rx: 9, ry: 6, opacity: 0.20 }
      ],
      mullionV: false,
      response: {
        preflash: { sceneBlur: 0.12, sceneBrightness: 0.93, sceneSaturate: 0.90, haze: 0.31, crystal: 0.23, specular: 0.33, spill: 0.11, flash: 0.22 },
        primary:  { sceneBlur: 0.02, sceneBrightness: 1.04, sceneSaturate: 0.98, haze: 0.16, crystal: 0.36, specular: 0.50, spill: 0.18, flash: 0.84 },
        secondary:{ sceneBlur: 0.06, sceneBrightness: 0.98, sceneSaturate: 0.95, haze: 0.22, crystal: 0.29, specular: 0.40, spill: 0.14, flash: 0.46 },
        decay:    { sceneBlur: 0.13, sceneBrightness: 0.89, sceneSaturate: 0.87, haze: 0.34, crystal: 0.20, specular: 0.30, spill: 0.08, flash: 0.00 }
      }
    },
    "five-flags": {
      id: "pg-fiveflags",
      skyTop: "#0f1220",
      skyMid: "#1d1e31",
      skyBottom: "#0b0d16",
      fog: "rgba(201,177,170,.08)",
      glowA: "rgba(200,144,110,.06)",
      glowB: "rgba(149,123,205,.05)",
      horizonGlow: "rgba(192,126,88,.05)",
      rainOpacity: 0.05,
      rainAngle: 105,
      flashCx: 60,
      flashCy: 24,
      flashRx: 8,
      flashRy: 11,
      flashCore: "rgba(242,244,255,.70)",
      flashGlow: "rgba(214,168,144,.10)",
      treeTintA: "#b88466",
      treeTintB: "#6e4a3d",
      leafTintA: "rgba(204,156,128,.11)",
      leafTintB: "rgba(109,74,61,.09)",
      treeOpacity: 0.07,
      treeBlur: 2.3,
      treeScale: 0.82,
      treeTranslateX: 10,
      treeTranslateY: 11,
      trunkWidth: 1.85,
      trunkOpacity: 0.50,
      branchWidth: 0.84,
      branchOpacity: 0.29,
      fineBranchStroke: "rgba(204,156,127,.15)",
      fineBranchWidth: 0.22,
      fineBranchOpacity: 0.12,
      rootStroke: "rgba(152,107,89,.09)",
      rootWidth: 0.34,
      rootOpacity: 0.09,
      geometryOpacity: 0.055,
      geometryStroke: "rgba(208,155,126,.09)",
      landOpacity: 0.14,
      hillBackFill: "rgba(32,28,36,.16)",
      hillMidFill: "rgba(34,28,28,.11)",
      hillFrontFill: "rgba(18,15,15,.08)",
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
        { cx: 38, cy: 24, rx: 10, ry: 6, opacity: 0.24 },
        { cx: 50, cy: 21, rx: 13, ry: 8, opacity: 0.26 },
        { cx: 62, cy: 24, rx: 10, ry: 6, opacity: 0.24 },
        { cx: 44, cy: 30, rx: 9, ry: 6, opacity: 0.20 },
        { cx: 56, cy: 30, rx: 9, ry: 6, opacity: 0.20 }
      ],
      mullionV: false,
      response: {
        preflash: { sceneBlur: 0.12, sceneBrightness: 0.93, sceneSaturate: 0.90, haze: 0.31, crystal: 0.23, specular: 0.33, spill: 0.11, flash: 0.22 },
        primary:  { sceneBlur: 0.02, sceneBrightness: 1.04, sceneSaturate: 0.98, haze: 0.16, crystal: 0.36, specular: 0.50, spill: 0.18, flash: 0.84 },
        secondary:{ sceneBlur: 0.06, sceneBrightness: 0.98, sceneSaturate: 0.95, haze: 0.22, crystal: 0.29, specular: 0.40, spill: 0.14, flash: 0.46 },
        decay:    { sceneBlur: 0.13, sceneBrightness: 0.89, sceneSaturate: 0.87, haze: 0.34, crystal: 0.20, specular: 0.30, spill: 0.08, flash: 0.00 }
      }
    },
    esl: {
      id: "pg-esl",
      skyTop: "#0b1320",
      skyMid: "#152232",
      skyBottom: "#071019",
      fog: "rgba(196,204,214,.07)",
      glowA: "rgba(171,192,222,.05)",
      glowB: "rgba(227,196,138,.04)",
      horizonGlow: "rgba(170,166,154,.04)",
      rainOpacity: 0.03,
      rainAngle: 100,
      flashCx: 52,
      flashCy: 25,
      flashRx: 7,
      flashRy: 10,
      flashCore: "rgba(239,244,255,.64)",
      flashGlow: "rgba(201,213,228,.09)",
      treeTintA: "#aab7c4",
      treeTintB: "#616f7c",
      leafTintA: "rgba(201,213,228,.10)",
      leafTintB: "rgba(108,118,129,.08)",
      treeOpacity: 0.065,
      treeBlur: 2.4,
      treeScale: 0.76,
      treeTranslateX: -2,
      treeTranslateY: 12,
      trunkWidth: 1.78,
      trunkOpacity: 0.48,
      branchWidth: 0.80,
      branchOpacity: 0.27,
      fineBranchStroke: "rgba(201,213,228,.13)",
      fineBranchWidth: 0.20,
      fineBranchOpacity: 0.11,
      rootStroke: "rgba(150,158,170,.08)",
      rootWidth: 0.32,
      rootOpacity: 0.08,
      geometryOpacity: 0.05,
      geometryStroke: "rgba(201,213,228,.08)",
      landOpacity: 0.13,
      hillBackFill: "rgba(20,28,36,.15)",
      hillMidFill: "rgba(24,28,32,.10)",
      hillFrontFill: "rgba(15,16,18,.08)",
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
        { cx: 40, cy: 24, rx: 9, ry: 6, opacity: 0.22 },
        { cx: 50, cy: 21, rx: 12, ry: 7, opacity: 0.24 },
        { cx: 60, cy: 24, rx: 9, ry: 6, opacity: 0.22 },
        { cx: 45, cy: 30, rx: 8, ry: 5, opacity: 0.18 },
        { cx: 55, cy: 30, rx: 8, ry: 5, opacity: 0.18 }
      ],
      mullionV: false,
      response: {
        preflash: { sceneBlur: 0.13, sceneBrightness: 0.92, sceneSaturate: 0.89, haze: 0.32, crystal: 0.22, specular: 0.32, spill: 0.10, flash: 0.18 },
        primary:  { sceneBlur: 0.03, sceneBrightness: 1.02, sceneSaturate: 0.96, haze: 0.17, crystal: 0.34, specular: 0.48, spill: 0.16, flash: 0.74 },
        secondary:{ sceneBlur: 0.07, sceneBrightness: 0.97, sceneSaturate: 0.94, haze: 0.23, crystal: 0.28, specular: 0.39, spill: 0.13, flash: 0.40 },
        decay:    { sceneBlur: 0.14, sceneBrightness: 0.88, sceneSaturate: 0.86, haze: 0.34, crystal: 0.20, specular: 0.30, spill: 0.08, flash: 0.00 }
      }
    }
  });

  const BASE_GLASS = Object.freeze({
    haze: 0.34,
    crystal: 0.20,
    specular: 0.30,
    spill: 0.08,
    sceneBlur: 0.15,
    sceneBrightness: 0.88,
    sceneSaturate: 0.88,
    flash: 0.00
  });

  const STRIKE_SEQUENCE = Object.freeze([
    { phase: "preflash", delay: 0 },
    { phase: "primary", delay: 85 },
    { phase: "secondary", delay: 155 },
    { phase: "decay", delay: 295 }
  ]);

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setOpacity(node, value) {
    node.style.opacity = String(clamp(value, 0, 1));
  }

  function sceneFilterString(blurPx, brightness, saturate) {
    return `blur(${Math.max(0, blurPx).toFixed(2)}px) brightness(${brightness.toFixed(3)}) saturate(${saturate.toFixed(3)})`;
  }

  function createIcon(kind, theme) {
    if (kind === "archcoin" || kind === "aai") {
      const medallion = createEl("div", `coinMedallion ${theme}`);
      Object.assign(medallion.style, {
        width: "92px",
        height: "92px",
        borderRadius: "999px",
        display: "grid",
        placeItems: "center",
        marginBottom: "14px",
        border: "1px solid rgba(255,255,255,.14)",
        background:
          "radial-gradient(circle at 34% 30%, rgba(255,255,255,.08), transparent 18%), linear-gradient(180deg, rgba(15,22,40,.96), rgba(7,11,18,.92))",
        boxShadow:
          theme === "gold"
            ? "inset 0 0 0 1px rgba(255,255,255,.04),0 0 0 1px rgba(242,211,145,.12),0 0 26px rgba(242,211,145,.10)"
            : "inset 0 0 0 1px rgba(255,255,255,.04),0 0 0 1px rgba(135,184,255,.12),0 0 26px rgba(135,184,255,.12)",
        overflow: "hidden",
        position: "relative",
        zIndex: "20"
      });

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 64 64");
      svg.setAttribute("width", "54");
      svg.setAttribute("height", "54");
      svg.setAttribute("aria-hidden", "true");

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "32");
      circle.setAttribute("cy", "32");
      circle.setAttribute("r", "25");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.86)" : "rgba(189,215,255,.88)");
      circle.setAttribute("stroke-width", "1.8");

      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M18 44 32 16 46 44");
      path1.setAttribute("fill", "none");
      path1.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)");
      path1.setAttribute("stroke-width", "3.2");
      path1.setAttribute("stroke-linecap", "round");
      path1.setAttribute("stroke-linejoin", "round");

      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute("d", "M23 34h18");
      path2.setAttribute("fill", "none");
      path2.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)");
      path2.setAttribute("stroke-width", "3.2");
      path2.setAttribute("stroke-linecap", "round");

      svg.append(circle, path1, path2);
      medallion.appendChild(svg);
      return medallion;
    }

    const box = createEl("div", "miniIcon");
    Object.assign(box.style, {
      width: "58px",
      height: "58px",
      marginBottom: "12px",
      borderRadius: "999px",
      border: "1px solid rgba(255,255,255,.12)",
      display: "grid",
      placeItems: "center",
      color: "rgba(244,247,255,.56)",
      background: "rgba(255,255,255,.02)",
      position: "relative",
      zIndex: "20"
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    if (kind === "leaf") {
      svg.innerHTML =
        '<path d="M18 3c-5.5 0-10 4.5-10 10v8"/><path d="M18 3c0 8-4 12-10 12"/><path d="M8 13c-2.8 0-5-2.2-5-5 2.8 0 5 2.2 5 5Z"/>';
    } else if (kind === "flag") {
      svg.innerHTML =
        '<path d="M6 21V4"/><path d="M6 5c2-1 4-1 6 0s4 1 6 0v8c-2 1-4 1-6 0s-4-1-6 0"/>';
    } else {
      svg.innerHTML =
        '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a1.5 1.5 0 0 0-1.5-1.5H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M8 4v14"/>';
    }

    box.appendChild(svg);
    return box;
  }

  function buildGeometry(opts) {
    return `
      <g opacity="${opts.geometryOpacity}">
        <circle cx="50" cy="44" r="22" fill="none" stroke="${opts.geometryStroke}" stroke-width=".35"/>
        <circle cx="50" cy="44" r="12" fill="none" stroke="${opts.geometryStroke}" stroke-width=".35"/>
        <path d="M50 8 L81 26 L81 62 L50 82 L19 62 L19 26 Z" fill="none" stroke="${opts.geometryStroke}" stroke-width=".30"/>
        <path d="M50 14 L74 28 L74 58 L50 72 L26 58 L26 28 Z" fill="none" stroke="${opts.geometryStroke}" stroke-width=".20"/>
        <path d="M50 8 V92" fill="none" stroke="${opts.geometryStroke}" stroke-width=".18"/>
        <path d="M14 44 H86" fill="none" stroke="${opts.geometryStroke}" stroke-width=".18"/>
        <path d="M30 24 L70 64" fill="none" stroke="${opts.geometryStroke}" stroke-width=".14"/>
        <path d="M70 24 L30 64" fill="none" stroke="${opts.geometryStroke}" stroke-width=".14"/>
        <circle cx="50" cy="44" r="1.8" fill="${opts.geometryStroke}"/>
        <circle cx="50" cy="86" r="6" fill="none" stroke="${opts.geometryStroke}" stroke-width=".18"/>
      </g>
    `;
  }

  function buildStormFlash(opts) {
    return `
      <g class="pg-lightning" opacity="0">
        <ellipse cx="${opts.flashCx}" cy="${opts.flashCy}" rx="${opts.flashRx}" ry="${opts.flashRy}" fill="${opts.flashCore}" opacity=".62"/>
        <ellipse cx="${opts.flashCx}" cy="${opts.flashCy}" rx="${opts.flashRx * 1.7}" ry="${opts.flashRy * 1.5}" fill="${opts.flashGlow}" opacity=".24"/>
        <ellipse cx="${opts.flashCx}" cy="${opts.flashCy}" rx="${opts.flashRx * 2.6}" ry="${opts.flashRy * 2.2}" fill="${opts.flashGlow}" opacity=".09"/>
        <rect x="0" y="0" width="100" height="100" fill="url(#${opts.id}-flash-grad)" opacity=".20"/>
      </g>
    `;
  }

  function buildTree(opts) {
    const blossom = opts.canopyNodes.map((node) => `
      <ellipse cx="${node.cx}" cy="${node.cy}" rx="${node.rx}" ry="${node.ry}" fill="url(#${opts.id}-leaf-grad)" opacity="${node.opacity}"/>
    `).join("");

    const branchSet = opts.branches.map((d) => `
      <path d="${esc(d)}" fill="none" stroke="url(#${opts.id}-branch-grad)" stroke-width="${opts.branchWidth}" stroke-linecap="round" opacity="${opts.branchOpacity}"/>
    `).join("");

    const fineBranchSet = opts.fineBranches.map((d) => `
      <path d="${esc(d)}" fill="none" stroke="${opts.fineBranchStroke}" stroke-width="${opts.fineBranchWidth}" stroke-linecap="round" opacity="${opts.fineBranchOpacity}"/>
    `).join("");

    const roots = opts.roots.map((d) => `
      <path d="${esc(d)}" fill="none" stroke="${opts.rootStroke}" stroke-width="${opts.rootWidth}" stroke-linecap="round" opacity="${opts.rootOpacity}"/>
    `).join("");

    return `
      <g class="pg-tree" opacity="${opts.treeOpacity}" filter="url(#${opts.id}-tree-blur)" transform="translate(${opts.treeTranslateX} ${opts.treeTranslateY}) scale(${opts.treeScale})">
        <path d="${esc(opts.trunkPath)}" fill="none" stroke="url(#${opts.id}-trunk-grad)" stroke-width="${opts.trunkWidth}" stroke-linecap="round" opacity="${opts.trunkOpacity}"/>
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
    return `<rect x="-20" y="-20" width="140" height="140" fill="url(#${opts.id}-rain)" opacity="${opts.rainOpacity}"/>`;
  }

  function buildFrameLines(opts) {
    return opts.mullionV
      ? `<rect x="48.8" y="0" width="2.4" height="100" fill="rgba(12,16,26,.88)" opacity=".92"/>`
      : "";
  }

  function renderScene(productKey) {
    const opts = SCENES[productKey] || SCENES.archcoin;

    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" class="pg-scene-svg" style="position:absolute;inset:0;width:100%;height:100%;display:block;">
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
            <stop offset="48%" stop-color="rgba(194,214,255,.035)"/>
            <stop offset="50%" stop-color="rgba(194,214,255,.06)"/>
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

  function buildWindowWrapper(productKey) {
    const sceneMarkup = renderScene(productKey);

    return `
      <div class="cardWindow" style="position:absolute;inset:0;border-radius:inherit;overflow:hidden;z-index:0;pointer-events:none;">
        <div class="cardWindowScene" style="
          position:absolute;inset:0;overflow:hidden;transition:filter .18s ease, opacity .18s ease;
          filter:${sceneFilterString(BASE_GLASS.sceneBlur, BASE_GLASS.sceneBrightness, BASE_GLASS.sceneSaturate)};
        ">
          ${sceneMarkup}
        </div>

        <div class="windowHaze" style="
          position:absolute;inset:0;z-index:1;pointer-events:none;opacity:${BASE_GLASS.haze};transition:opacity .18s ease, backdrop-filter .18s ease;
          background:
            radial-gradient(circle at 50% 38%, rgba(208,222,245,.055), transparent 28%),
            linear-gradient(180deg, rgba(255,255,255,.030), rgba(255,255,255,.012) 28%, rgba(9,12,20,.075) 68%, rgba(4,6,10,.13) 100%);
          backdrop-filter: blur(1.25px) saturate(.92);
          -webkit-backdrop-filter: blur(1.25px) saturate(.92);
        "></div>

        <div class="windowCrystal" style="
          position:absolute;inset:0;z-index:2;pointer-events:none;opacity:${BASE_GLASS.crystal};transition:opacity .18s ease, transform .18s ease;
          background:
            linear-gradient(122deg, rgba(255,255,255,.07) 0 1.1%, transparent 1.1% 13%, rgba(255,255,255,.04) 13% 14%, transparent 14% 29%, rgba(255,255,255,.03) 29% 30%, transparent 30% 48%, rgba(255,255,255,.04) 48% 49%, transparent 49% 66%, rgba(255,255,255,.03) 66% 67%, transparent 67% 100%),
            linear-gradient(58deg, rgba(255,255,255,.035) 0 0.9%, transparent .9% 17%, rgba(255,255,255,.025) 17% 18%, transparent 18% 39%, rgba(255,255,255,.03) 39% 40%, transparent 40% 62%, rgba(255,255,255,.025) 62% 63%, transparent 63% 100%);
          mix-blend-mode: screen;
        "></div>

        <div class="windowSpecular" style="
          position:absolute;inset:0;z-index:3;pointer-events:none;opacity:${BASE_GLASS.specular};transition:opacity .18s ease;
          background:
            linear-gradient(102deg, rgba(255,255,255,.085) 0%, rgba(255,255,255,.025) 10%, transparent 22%, transparent 72%, rgba(255,255,255,.04) 84%, rgba(255,255,255,.09) 100%),
            linear-gradient(180deg, rgba(240,244,255,.04), transparent 14%, transparent 72%, rgba(255,218,160,.026) 100%);
          mix-blend-mode: screen;
        "></div>

        <div class="windowSpill" style="
          position:absolute;inset:0;z-index:4;pointer-events:none;opacity:${BASE_GLASS.spill};transition:opacity .18s ease;
          background:
            radial-gradient(circle at 50% 20%, rgba(220,232,255,.05), transparent 24%),
            linear-gradient(180deg, rgba(214,228,255,.035), transparent 28%, transparent 72%, rgba(255,188,96,.020));
          mix-blend-mode:screen;
        "></div>

        <div class="cardWindowGlass" style="
          position:absolute;inset:0;z-index:5;pointer-events:none;opacity:.40;
          background:
            linear-gradient(100deg, rgba(255,255,255,.05), transparent 22%, transparent 62%, rgba(255,255,255,.025)),
            radial-gradient(circle at 50% 24%, rgba(210,226,255,.025), transparent 22%);
          mix-blend-mode:screen;
        "></div>

        <div style="
          position:absolute;inset:0;z-index:6;border-radius:inherit;
          box-shadow:
            inset 0 0 0 2px rgba(10,14,24,.92),
            inset 0 0 0 10px rgba(18,14,12,.56),
            inset 0 0 0 11px rgba(255,255,255,.04),
            inset 0 0 24px rgba(165,185,220,.035);
        "></div>
      </div>
    `;
  }

  function buildCard(product) {
    const card = createEl("article", "card");
    card.dataset.productKey = product.key;
    Object.assign(card.style, {
      position: "relative",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: "24px",
      overflow: "hidden",
      background: "linear-gradient(180deg, rgba(8,12,22,.92), rgba(6,9,17,.98))",
      boxShadow: "0 18px 48px rgba(0,0,0,.34)",
      minHeight: product.tier === "flagship" ? "380px" : "336px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "18px",
      isolation: "isolate"
    });

    if (product.key === "archcoin") {
      card.style.borderColor = "rgba(242,211,145,.22)";
    }
    if (product.key === "aai") {
      card.style.borderColor = "rgba(135,184,255,.22)";
    }

    card.insertAdjacentHTML("afterbegin", buildWindowWrapper(product.key));

    const content = createEl("div");
    Object.assign(content.style, {
      position: "relative",
      zIndex: "10",
      display: "flex",
      flexDirection: "column",
      minHeight: "100%"
    });

    content.appendChild(createIcon(product.icon, product.theme));

    const tag = createEl("p", "", product.label);
    Object.assign(tag.style, {
      margin: "0 0 12px",
      fontSize: ".82rem",
      fontWeight: "900",
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: "rgba(242,211,145,1)"
    });
    content.appendChild(tag);

    const title = createEl("h2", "", product.title);
    Object.assign(title.style, {
      margin: "0 0 12px",
      fontFamily: 'Georgia,"Times New Roman",serif',
      fontSize: product.tier === "flagship" ? "clamp(2.05rem,3vw,2.6rem)" : "clamp(1.7rem,2.2vw,2.2rem)",
      lineHeight: ".96",
      letterSpacing: "-.02em",
      textWrap: "balance",
      textShadow: "0 2px 12px rgba(0,0,0,.44)"
    });
    content.appendChild(title);

    const desc = createEl("p", "", product.description);
    Object.assign(desc.style, {
      margin: "0",
      color: "rgba(244,247,255,.80)",
      fontSize: "1rem",
      lineHeight: "1.65",
      textShadow: "0 1px 10px rgba(0,0,0,.34)"
    });
    content.appendChild(desc);

    const ctaBar = createEl("div");
    Object.assign(ctaBar.style, {
      marginTop: "18px",
      position: "relative",
      zIndex: "10"
    });

    const link = createEl("a");
    link.href = product.href;
    link.setAttribute("data-product-path", product.key);
    link.innerHTML = `<span>${product.button}</span><span aria-hidden="true">→</span>`;
    Object.assign(link.style, {
      width: "100%",
      minHeight: "46px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,.12)",
      background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
      color: "rgba(244,247,255,1)",
      fontSize: ".92rem",
      fontWeight: "800",
      letterSpacing: ".02em",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 14px",
      backdropFilter: "blur(2px)"
    });

    ctaBar.appendChild(link);
    content.appendChild(ctaBar);
    card.appendChild(content);

    return card;
  }

  function renderProducts() {
    const grid = qs("#productsGrid");
    const emptyState = qs("#productsEmptyState");
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    PRODUCTS.forEach((product) => fragment.appendChild(buildCard(product)));
    grid.replaceChildren(fragment);

    if (emptyState) {
      emptyState.style.display = PRODUCTS.length ? "none" : "flex";
    }
  }

  function applyCardPhase(card, phaseName) {
    const productKey = card.dataset.productKey;
    const scene = SCENES[productKey];
    const response = scene && scene.response ? scene.response[phaseName] : null;
    const state = response || BASE_GLASS;

    const sceneNode = qs(".cardWindowScene", card);
    const flashNode = qs(".pg-lightning", card);
    const hazeNode = qs(".windowHaze", card);
    const crystalNode = qs(".windowCrystal", card);
    const specularNode = qs(".windowSpecular", card);
    const spillNode = qs(".windowSpill", card);

    if (sceneNode) {
      sceneNode.style.filter = sceneFilterString(state.sceneBlur, state.sceneBrightness, state.sceneSaturate);
    }
    if (flashNode) {
      setOpacity(flashNode, state.flash);
    }
    if (hazeNode) {
      setOpacity(hazeNode, state.haze);
      const blurValue = phaseName === "primary" ? "blur(.38px) saturate(1.00)" :
                        phaseName === "secondary" ? "blur(.72px) saturate(.98)" :
                        phaseName === "preflash" ? "blur(.95px) saturate(.95)" :
                        "blur(1.25px) saturate(.92)";
      hazeNode.style.backdropFilter = blurValue;
      hazeNode.style.webkitBackdropFilter = blurValue;
    }
    if (crystalNode) {
      setOpacity(crystalNode, state.crystal);
      crystalNode.style.transform = phaseName === "primary" ? "scale(1.01)" : phaseName === "secondary" ? "scale(1.006)" : "";
    }
    if (specularNode) {
      setOpacity(specularNode, state.specular);
    }
    if (spillNode) {
      setOpacity(spillNode, state.spill);
    }

    card.style.boxShadow =
      phaseName === "primary"
        ? "0 18px 48px rgba(0,0,0,.34), inset 0 0 24px rgba(212,228,255,.05)"
        : phaseName === "secondary"
          ? "0 18px 48px rgba(0,0,0,.34), inset 0 0 14px rgba(212,228,255,.035)"
          : "0 18px 48px rgba(0,0,0,.34)";
  }

  function resetCardPhase(card) {
    applyCardPhase(card, "decay");
  }

  function bindLightning() {
    const cards = qsa(".card");
    const timers = [];

    function clearTimers() {
      while (timers.length) {
        window.clearTimeout(timers.pop());
      }
    }

    function scheduleStrike(card, offsetBase) {
      STRIKE_SEQUENCE.forEach((step) => {
        const timer = window.setTimeout(() => {
          applyCardPhase(card, step.phase);
        }, offsetBase + step.delay);
        timers.push(timer);
      });
    }

    function triggerCycle() {
      cards.forEach((card, index) => {
        const stagger = index * 22;
        scheduleStrike(card, stagger);
      });
    }

    cards.forEach((card) => resetCardPhase(card));

    const firstTimer = window.setTimeout(triggerCycle, 500);
    timers.push(firstTimer);

    const interval = window.setInterval(triggerCycle, 4400);

    window.addEventListener("beforeunload", () => {
      clearTimers();
      window.clearInterval(interval);
    }, { once: true });
  }

  function markRuntimeOwner() {
    const root = qs("#productsPage");
    const grid = qs("#productsGrid");
    if (root) {
      root.setAttribute("data-products-runtime", "index.js");
      root.setAttribute("data-runtime-contract", PRODUCTS_PAGE_META.contract);
    }
    if (grid) {
      grid.setAttribute("data-runtime-owner", "index.js");
    }
  }

  function init() {
    markRuntimeOwner();
    renderProducts();
    bindLightning();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
