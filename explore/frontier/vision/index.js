(() => {
  "use strict";

  const STORAGE_KEYS = {
    lang: "gd_lang",
    style: "gd_style",
    time: "gd_time",
    depth: "gd_depth"
  };

  const VALID = {
    lang: new Set(["en", "zh", "es"]),
    time: new Set(["origin", "now", "post"]),
    lane: new Set(["platform", "engineering"])
  };

  const DEFAULTS = {
    lang: "en",
    time: "now",
    lane: "platform",
    style: "informal",
    depth: "explore"
  };

  const UI_COPY = {
    en: {
      exit: "EXIT",
      hub: "HUB",
      core: "INDEX",
      langLabels: { en: "English", zh: "Chinese", es: "Spanish" },
      laneLabels: { platform: "Platform lane", engineering: "Engineering lane" }
    },
    zh: {
      exit: "退出",
      hub: "枢纽",
      core: "索引",
      langLabels: { en: "英文", zh: "中文", es: "西班牙语" },
      laneLabels: { platform: "平台通道", engineering: "工程通道" }
    },
    es: {
      exit: "SALIR",
      hub: "HUB",
      core: "ÍNDICE",
      langLabels: { en: "Inglés", zh: "Chino", es: "Español" },
      laneLabels: { platform: "Carril de plataforma", engineering: "Carril de ingeniería" }
    }
  };

  const ROUTES = {
    core: "/explore/frontier/manual/",
    exit: "/door/",
    hub: "/index.html"
  };

  const ORBIT_LANES = {
    lane1: { rx: 184, ry: 86,  zBias: 38,  yBias: -10, group: "inner" },
    lane2: { rx: 252, ry: 108, zBias: 18,  yBias: 4,   group: "mid" },
    lane3: { rx: 314, ry: 128, zBias: -4,  yBias: 10,  group: "outer" },
    lane4: { rx: 358, ry: 150, zBias: -20, yBias: 16,  group: "outerWide" }
  };

  const MANIFOLDS = [
    { code: "N",   href: "/explore/frontier/urban/",              p: { en: "CITIES",   zh: "城市",   es: "CIUDADES" }, e: { en: "URBAN",   zh: "城市OS", es: "URB-OS" }, tier: "l1", lane: "lane1", angle: -Math.PI / 2 + 0.02, orbitSpeed: 0.000034, spinSpeed: 0.00104 },
    { code: "NNE", href: "/explore/frontier/shimmer/",            p: { en: "SHIMMER",  zh: "闪烁",   es: "SHIMMER" },  e: { en: "CLEAR",   zh: "清晰",   es: "CLAR" },   tier: "l3", lane: "lane3", angle: -Math.PI / 2 + 0.52, orbitSpeed: 0.000024, spinSpeed: 0.00120 },
    { code: "NE",  href: "/explore/frontier/water/",              p: { en: "WATER",    zh: "水",     es: "AGUA" },     e: { en: "H2O",     zh: "水系",   es: "H2O" },    tier: "l2", lane: "lane2", angle: -Math.PI / 2 + 0.98, orbitSpeed: 0.000028, spinSpeed: 0.00112 },
    { code: "ENE", href: "/explore/frontier/trajectory/",         p: { en: "TRAJ",     zh: "轨迹",   es: "TRAY" },     e: { en: "WIN",     zh: "窗口",   es: "VENT" },   tier: "l3", lane: "lane4", angle: -Math.PI / 2 + 1.32, orbitSpeed: 0.000020, spinSpeed: 0.00116 },
    { code: "E",   href: "/explore/frontier/energy/",             p: { en: "ENERGY",   zh: "能源",   es: "ENERGÍA" },  e: { en: "POWER",   zh: "功率",   es: "PWR" },    tier: "l1", lane: "lane1", angle: 0.04,                orbitSpeed: 0.000036, spinSpeed: 0.00102 },
    { code: "ESE", href: "/explore/frontier/waste/",              p: { en: "WASTE",    zh: "废弃物", es: "RESID" },    e: { en: "ENTROPY", zh: "熵",     es: "ENT" },    tier: "l3", lane: "lane4", angle: 0.72,                orbitSpeed: 0.000021, spinSpeed: 0.00118 },
    { code: "SE",  href: "/explore/frontier/closed-loop/",        p: { en: "HABITATS", zh: "栖息地", es: "HÁBIT" },    e: { en: "HAB",     zh: "栖息",   es: "HAB" },    tier: "l2", lane: "lane2", angle: 0.98,                orbitSpeed: 0.000027, spinSpeed: 0.00108 },
    { code: "SSE", href: "/explore/frontier/urban/",              p: { en: "URBAN",    zh: "城市群", es: "URBANO" },   e: { en: "CLUSTER", zh: "集群",   es: "CLUST" },  tier: "l3", lane: "lane4", angle: 1.26,                orbitSpeed: 0.000022, spinSpeed: 0.00114 },
    { code: "S",   href: "/explore/frontier/agri/",               p: { en: "AGRI",     zh: "农业",   es: "AGRO" },     e: { en: "FOOD",    zh: "食物",   es: "ALIM" },   tier: "l1", lane: "lane1", angle: Math.PI / 2 + 0.03,  orbitSpeed: 0.000035, spinSpeed: 0.00100 },
    { code: "SSW", href: "/explore/frontier/closed-loop/",        p: { en: "CLOSED",   zh: "闭环",   es: "CERRADO" },  e: { en: "NO-AWAY", zh: "无扔掉", es: "SIN" },    tier: "l3", lane: "lane4", angle: Math.PI / 2 + 0.44,  orbitSpeed: 0.000023, spinSpeed: 0.00122 },
    { code: "SW",  href: "/products/finance/",                    p: { en: "FINANCE",  zh: "金融",   es: "FINANZ" },   e: { en: "CAPITAL", zh: "资本",   es: "CAP" },    tier: "l2", lane: "lane2", angle: Math.PI / 2 + 0.98,  orbitSpeed: 0.000029, spinSpeed: 0.00110 },
    { code: "WSW", href: "/explore/infrastructure/grid-storage/", p: { en: "GRID",     zh: "电网",   es: "RED" },      e: { en: "BALANCE", zh: "平衡",   es: "BAL" },    tier: "l3", lane: "lane4", angle: Math.PI / 2 + 1.22,  orbitSpeed: 0.000021, spinSpeed: 0.00118 },
    { code: "W",   href: "/explore/infrastructure/",              p: { en: "INFRA",    zh: "基建",   es: "INFRA" },    e: { en: "SUBST",   zh: "替代",   es: "SUB" },    tier: "l1", lane: "lane1", angle: Math.PI - 0.02,      orbitSpeed: 0.000036, spinSpeed: 0.00102 },
    { code: "WNW", href: "/products/capital-doctrine/",           p: { en: "DOCTRINE", zh: "教义",   es: "DOCTR" },    e: { en: "CCD",     zh: "CCD",    es: "CCD" },    tier: "l3", lane: "lane4", angle: Math.PI + 0.38,      orbitSpeed: 0.000022, spinSpeed: 0.00116 },
    { code: "NW",  href: "/explore/frontier/lattice/",            p: { en: "LATTICE",  zh: "晶格",   es: "LATTICE" },  e: { en: "256",     zh: "256态",  es: "256" },    tier: "l2", lane: "lane2", angle: Math.PI + 0.98,      orbitSpeed: 0.000028, spinSpeed: 0.00108 },
    { code: "NNW", href: "/explore/frontier/vision/",             p: { en: "VISION",   zh: "愿景",   es: "VISIÓN" },   e: { en: "MAP",     zh: "映射",   es: "MAP" },    tier: "l3", lane: "lane3", angle: Math.PI + 1.52,      orbitSpeed: 0.000024, spinSpeed: 0.00118 }
  ];

  const elements = {
    stage: document.getElementById("stage"),
    starfield: document.getElementById("starfield"),
    langEN: document.getElementById("langEN"),
    langZH: document.getElementById("langZH"),
    langES: document.getElementById("langES"),
    lanePlatform: document.getElementById("lanePlatform"),
    laneEngineering: document.getElementById("laneEngineering"),
    btnExit: document.getElementById("btnExit"),
    btnHub: document.getElementById("btnHub"),
    lblExit: document.getElementById("lblExit"),
    lblHub: document.getElementById("lblHub")
  };

  const state = {
    lang: readInitialLang(),
    time: readInitialTime(),
    lane: readInitialLane(),
    style: DEFAULTS.style,
    depth: DEFAULTS.depth
  };

  const runtime = {
    raf: 0,
    resizeScheduled: false,
    starsBuilt: false,
    centerX: 0,
    centerY: 0,
    stageWidth: 0,
    stageHeight: 0,
    mobile: false,
    planets: [],
    orbitNodes: [],
    core: null
  };

  function getSearchParams() {
    return new URLSearchParams(window.location.search);
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {}
  }

  function normalizeLang(value) {
    return VALID.lang.has(value) ? value : DEFAULTS.lang;
  }

  function normalizeTime(value) {
    const candidate = value === "trajectory" ? "post" : value;
    return VALID.time.has(candidate) ? candidate : DEFAULTS.time;
  }

  function normalizeLane(value) {
    return VALID.lane.has(value) ? value : DEFAULTS.lane;
  }

  function readInitialLang() {
    const params = getSearchParams();
    return normalizeLang(params.get("lang") || readStorage(STORAGE_KEYS.lang) || DEFAULTS.lang);
  }

  function readInitialTime() {
    const params = getSearchParams();
    return normalizeTime(params.get("time") || readStorage(STORAGE_KEYS.time) || DEFAULTS.time);
  }

  function readInitialLane() {
    const params = getSearchParams();
    return normalizeLane(params.get("lane") || DEFAULTS.lane);
  }

  function currentCopy() {
    return UI_COPY[state.lang] || UI_COPY.en;
  }

  function buildQueryString(overrides = {}) {
    const params = new URLSearchParams();
    params.set("lang", overrides.lang || state.lang);
    params.set("style", DEFAULTS.style);
    params.set("time", overrides.time || state.time);
    params.set("depth", DEFAULTS.depth);

    const lane = overrides.lane || state.lane;
    if (VALID.lane.has(lane)) {
      params.set("lane", lane);
    }

    return `?${params.toString()}`;
  }

  function syncCanonicalState() {
    writeStorage(STORAGE_KEYS.lang, state.lang);
    writeStorage(STORAGE_KEYS.style, DEFAULTS.style);
    writeStorage(STORAGE_KEYS.time, state.time);
    writeStorage(STORAGE_KEYS.depth, DEFAULTS.depth);
    window.history.replaceState({}, "", window.location.pathname + buildQueryString());
    document.documentElement.lang = state.lang === "zh" ? "zh" : state.lang === "es" ? "es" : "en";
  }

  function navigate(path) {
    window.location.href = path + buildQueryString();
  }

  function setToggleStates() {
    const copy = currentCopy();

    elements.langEN.classList.toggle("is-on", state.lang === "en");
    elements.langZH.classList.toggle("is-on", state.lang === "zh");
    elements.langES.classList.toggle("is-on", state.lang === "es");

    elements.lanePlatform.classList.toggle("is-on", state.lane === "platform");
    elements.laneEngineering.classList.toggle("is-on", state.lane === "engineering");

    elements.langEN.setAttribute("aria-label", copy.langLabels.en);
    elements.langZH.setAttribute("aria-label", copy.langLabels.zh);
    elements.langES.setAttribute("aria-label", copy.langLabels.es);
    elements.lanePlatform.setAttribute("aria-label", copy.laneLabels.platform);
    elements.laneEngineering.setAttribute("aria-label", copy.laneLabels.engineering);
  }

  function pickLocalized(map) {
    if (state.lang === "zh") return map.zh;
    if (state.lang === "es") return map.es || map.en;
    return map.en;
  }

  function labelFor(manifold) {
    return state.lane === "engineering" ? pickLocalized(manifold.e) : pickLocalized(manifold.p);
  }

  function bindPress(node, handler) {
    node.addEventListener("click", handler, { passive: true });
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handler();
      }
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function ensureStars() {
    if (runtime.starsBuilt) return;
    runtime.starsBuilt = true;
    elements.starfield.innerHTML = "";

    const count = Math.max(50, Math.floor((window.innerWidth * window.innerHeight) / 16000));
    for (let i = 0; i < count; i += 1) {
      const star = document.createElement("div");
      const size = 1 + Math.random() * 2.2;
      star.className = "star";
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = `${0.18 + Math.random() * 0.66}`;
      star.style.animationDuration = `${3.4 + Math.random() * 6.8}s`;
      star.style.animationDelay = `${Math.random() * 5.2}s`;
      elements.starfield.appendChild(star);
    }
  }

  function createFace(faceClass) {
    const face = document.createElement("div");
    face.className = `face ${faceClass}`;
    return face;
  }

  function createSkeleton() {
    const s = document.createElement("div");
    s.className = "skeleton";

    const front = document.createElement("div");
    front.className = "skeleton__plane skeleton__plane--front";
    const back = document.createElement("div");
    back.className = "skeleton__plane skeleton__plane--back";
    const v = document.createElement("div");
    v.className = "skeleton__edge skeleton__edge--v";
    const d1 = document.createElement("div");
    d1.className = "skeleton__edge skeleton__edge--d1";
    const d2 = document.createElement("div");
    d2.className = "skeleton__edge skeleton__edge--d2";
    const spine = document.createElement("div");
    spine.className = "skeleton__spine";

    s.appendChild(front);
    s.appendChild(back);
    s.appendChild(v);
    s.appendChild(d1);
    s.appendChild(d2);
    s.appendChild(spine);
    return s;
  }

  function createCubeMarkup(nodeClass, word, code, phase) {
    const node = document.createElement("div");
    node.className = nodeClass;
    node.style.setProperty("--phase", `${phase}s`);

    const shadow = document.createElement("div");
    shadow.className = "planetShadow";

    const cube = document.createElement("div");
    cube.className = "planetCube";

    cube.appendChild(createFace("face--front"));
    cube.appendChild(createFace("face--back"));
    cube.appendChild(createFace("face--left"));
    cube.appendChild(createFace("face--right"));
    cube.appendChild(createFace("face--top"));
    cube.appendChild(createFace("face--bottom"));
    cube.appendChild(createSkeleton());

    const label = document.createElement("div");
    label.className = "planetLabel";

    const wordEl = document.createElement("div");
    wordEl.className = "planetWord";
    wordEl.textContent = word;

    const codeEl = document.createElement("div");
    codeEl.className = "planetCode";
    codeEl.textContent = code;

    label.appendChild(wordEl);
    label.appendChild(codeEl);

    node.appendChild(shadow);
    node.appendChild(cube);
    node.appendChild(label);

    return { node, cube, wordEl };
  }

  function clearRuntimeNodes() {
    runtime.planets.forEach((planet) => {
      if (planet.node && planet.node.parentNode === elements.stage) {
        elements.stage.removeChild(planet.node);
      }
    });

    runtime.orbitNodes.forEach((node) => {
      if (node.parentNode === elements.stage) {
        elements.stage.removeChild(node);
      }
    });

    if (runtime.core && runtime.core.node && runtime.core.node.parentNode === elements.stage) {
      elements.stage.removeChild(runtime.core.node);
    }

    runtime.planets = [];
    runtime.orbitNodes = [];
    runtime.core = null;
  }

  function getLaneScale() {
    return runtime.mobile ? 0.78 : 1;
  }

  function getLaneFlatten() {
    return runtime.mobile ? 0.88 : 1;
  }

  function buildOrbitBands() {
    const laneScale = getLaneScale();
    const laneFlatten = getLaneFlatten();

    Object.keys(ORBIT_LANES).forEach((laneKey) => {
      const lane = ORBIT_LANES[laneKey];
      const band = document.createElement("div");
      band.className = "orbitBand";
      band.style.width = `${lane.rx * laneScale * 2}px`;
      band.style.height = `${lane.ry * laneFlatten * 2}px`;
      elements.stage.appendChild(band);
      runtime.orbitNodes.push(band);
    });
  }

  function buildCore() {
    const copy = currentCopy();
    const markup = createCubeMarkup("planetNode planetNode--core", copy.core, "CORE", 0.10);

    markup.node.setAttribute("role", "button");
    markup.node.setAttribute("tabindex", "0");
    markup.node.setAttribute("aria-label", copy.core);
    markup.node.style.left = `${runtime.centerX}px`;
    markup.node.style.top = `${runtime.centerY}px`;
    markup.node.style.zIndex = "240";

    bindPress(markup.node, () => navigate(ROUTES.core));
    elements.stage.appendChild(markup.node);

    runtime.core = {
      node: markup.node,
      cube: markup.cube,
      wordEl: markup.wordEl
    };
  }

  function getTierBaseScale(tier) {
    if (tier === "l1") return runtime.mobile ? 0.92 : 1;
    if (tier === "l2") return runtime.mobile ? 0.86 : 0.94;
    return runtime.mobile ? 0.80 : 0.88;
  }

  function buildPlanets() {
    runtime.planets = MANIFOLDS.map((manifold, index) => {
      const label = labelFor(manifold);
      const phase = 0.16 * (index + 1);
      const nodeClass = `planetNode planetNode--${manifold.tier}`;
      const markup = createCubeMarkup(nodeClass, label, manifold.code, phase);

      markup.node.setAttribute("role", "button");
      markup.node.setAttribute("tabindex", "0");
      markup.node.setAttribute("aria-label", `${label} ${manifold.code}`);

      bindPress(markup.node, () => navigate(manifold.href));
      elements.stage.appendChild(markup.node);

      const lane = ORBIT_LANES[manifold.lane];

      return {
        manifold,
        lane,
        angle: manifold.angle,
        orbitSpeed: manifold.orbitSpeed,
        spinSpeed: manifold.spinSpeed,
        phase,
        node: markup.node,
        cube: markup.cube,
        wordEl: markup.wordEl,
        tierBaseScale: getTierBaseScale(manifold.tier),
        projected: {
          x: 0,
          y: 0,
          z: 0,
          depth: 0.5,
          scale: 1
        }
      };
    });
  }

  function layoutCenter() {
    const rect = elements.stage.getBoundingClientRect();
    runtime.stageWidth = rect.width || 1;
    runtime.stageHeight = rect.height || 1;
    runtime.mobile = runtime.stageWidth <= 640;
    runtime.centerX = runtime.stageWidth * 0.5;
    runtime.centerY = runtime.stageHeight * (runtime.mobile ? 0.585 : 0.58);
  }

  function updateCornerLabels() {
    const copy = currentCopy();
    elements.lblExit.textContent = copy.exit;
    elements.lblHub.textContent = copy.hub;
    if (runtime.core && runtime.core.wordEl) {
      runtime.core.wordEl.textContent = copy.core;
      runtime.core.node.setAttribute("aria-label", copy.core);
    }
  }

  function updatePlanetLabelsOnly() {
    runtime.planets.forEach((planet) => {
      const label = labelFor(planet.manifold);
      planet.wordEl.textContent = label;
      planet.node.setAttribute("aria-label", `${label} ${planet.manifold.code}`);
    });
  }

  function computeProjectedState(planet, ts, delta) {
    planet.angle += planet.orbitSpeed * delta;

    const laneScale = getLaneScale();
    const laneFlatten = getLaneFlatten();
    const rx = planet.lane.rx * laneScale;
    const ry = planet.lane.ry * laneFlatten;

    const depth = (Math.sin(planet.angle) + 1) * 0.5;
    const x = runtime.centerX + Math.cos(planet.angle) * rx;
    const y = runtime.centerY + Math.sin(planet.angle) * ry + planet.lane.yBias;
    const z = lerp(planet.lane.zBias - 12, planet.lane.zBias + 12, depth);

    const baseScale = planet.tierBaseScale;
    const scale = baseScale + depth * (runtime.mobile ? 0.24 : 0.30);

    const localSpin = Math.sin(ts * planet.spinSpeed + planet.phase) * 6.5;
    const localTilt = Math.cos(ts * planet.spinSpeed * 0.82 + planet.phase) * 1.4;
    const brightness = 0.76 + depth * 0.28;
    const opacity = 0.76 + depth * 0.22;

    planet.projected = {
      x,
      y,
      z,
      depth,
      scale,
      localSpin,
      localTilt,
      brightness,
      opacity
    };
  }

  function solveFieldSeparation() {
    const planets = runtime.planets.slice();
    const minGapX = runtime.mobile ? 76 : 94;
    const minGapY = runtime.mobile ? 64 : 78;
    const edgePadX = runtime.mobile ? 46 : 60;
    const topPad = runtime.mobile ? 66 : 48;
    const bottomPad = runtime.mobile ? 78 : 54;
    const iterations = 2;

    for (let pass = 0; pass < iterations; pass += 1) {
      planets.sort((a, b) => a.projected.y - b.projected.y);

      for (let i = 0; i < planets.length; i += 1) {
        const current = planets[i];

        current.projected.x = clamp(current.projected.x, edgePadX, runtime.stageWidth - edgePadX);
        current.projected.y = clamp(current.projected.y, topPad, runtime.stageHeight - bottomPad);

        for (let j = i + 1; j < planets.length; j += 1) {
          const other = planets[j];
          const dx = other.projected.x - current.projected.x;
          const dy = other.projected.y - current.projected.y;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          if (absDx < minGapX && absDy < minGapY) {
            const overlapX = minGapX - absDx;
            const overlapY = minGapY - absDy;

            if (overlapX > overlapY) {
              const pushY = overlapY * 0.5 + 3;
              current.projected.y -= pushY;
              other.projected.y += pushY;
            } else {
              const pushX = overlapX * 0.5 + 3;
              if (dx >= 0) {
                current.projected.x -= pushX;
                other.projected.x += pushX;
              } else {
                current.projected.x += pushX;
                other.projected.x -= pushX;
              }
            }

            current.projected.x = clamp(current.projected.x, edgePadX, runtime.stageWidth - edgePadX);
            other.projected.x = clamp(other.projected.x, edgePadX, runtime.stageWidth - edgePadX);
            current.projected.y = clamp(current.projected.y, topPad, runtime.stageHeight - bottomPad);
            other.projected.y = clamp(other.projected.y, topPad, runtime.stageHeight - bottomPad);
          }
        }
      }
    }
  }

  function applyProjectedState(planet, ts) {
    const projected = planet.projected;
    const zIndex = 40 + Math.round(projected.depth * 120);

    planet.node.style.left = `${projected.x}px`;
    planet.node.style.top = `${projected.y}px`;
    planet.node.style.transform = `translate(-50%,-50%) scale(${projected.scale})`;
    planet.node.style.opacity = String(projected.opacity);
    planet.node.style.zIndex = String(zIndex);

    planet.cube.style.transform =
      `translate(-50%,-50%) rotateZ(45deg) rotateX(${62 + projected.localTilt}deg) rotateY(${-36 + projected.localSpin}deg)`;
    planet.cube.style.filter = `brightness(${projected.brightness}) saturate(${0.94 + projected.depth * 0.14})`;
  }

  function updateRuntime(ts) {
    if (!updateRuntime.lastTs) updateRuntime.lastTs = ts;
    const delta = ts - updateRuntime.lastTs;
    updateRuntime.lastTs = ts;

    runtime.planets.forEach((planet) => {
      computeProjectedState(planet, ts, delta);
    });

    solveFieldSeparation();

    runtime.planets.forEach((planet) => {
      applyProjectedState(planet, ts);
    });

    if (runtime.core && runtime.core.cube) {
      const coreSpin = Math.sin(ts * 0.00055) * 4;
      runtime.core.cube.style.transform =
        `translate(-50%,-50%) rotateZ(45deg) rotateX(62deg) rotateY(${-30 + coreSpin}deg)`;
      runtime.core.cube.style.filter = "brightness(1.04) saturate(1.04)";
    }

    runtime.raf = window.requestAnimationFrame(updateRuntime);
  }

  function setLanguage(nextLang) {
    state.lang = normalizeLang(nextLang);
    syncCanonicalState();
    setToggleStates();
    updatePlanetLabelsOnly();
    updateCornerLabels();
  }

  function setLane(nextLane) {
    state.lane = normalizeLane(nextLane);
    window.history.replaceState({}, "", window.location.pathname + buildQueryString());
    setToggleStates();
    updatePlanetLabelsOnly();
  }

  function safeLayout() {
    const rect = elements.stage.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) {
      window.requestAnimationFrame(safeLayout);
      return;
    }
    buildScene();
  }

  function requestSafeLayout() {
    if (runtime.resizeScheduled) return;
    runtime.resizeScheduled = true;
    window.requestAnimationFrame(() => {
      runtime.resizeScheduled = false;
      safeLayout();
    });
  }

  function buildScene() {
    clearRuntimeNodes();
    layoutCenter();
    buildOrbitBands();
    buildCore();
    buildPlanets();
    updateCornerLabels();
  }

  function bindEvents() {
    bindPress(elements.langEN, () => setLanguage("en"));
    bindPress(elements.langZH, () => setLanguage("zh"));
    bindPress(elements.langES, () => setLanguage("es"));
    bindPress(elements.lanePlatform, () => setLane("platform"));
    bindPress(elements.laneEngineering, () => setLane("engineering"));
    bindPress(elements.btnExit, () => navigate(ROUTES.exit));
    bindPress(elements.btnHub, () => navigate(ROUTES.hub));
    window.addEventListener("resize", requestSafeLayout);
  }

  function start() {
    ensureStars();
    bindEvents();
    syncCanonicalState();
    setToggleStates();
    safeLayout();
    if (runtime.raf) window.cancelAnimationFrame(runtime.raf);
    runtime.raf = window.requestAnimationFrame(updateRuntime);
  }

  start();
})();
