// /showroom/globe/audralia/disposition/index.js
// AUDRALIA_G1_INTERGALACTIC_COCKPIT_THREE_FILE_SPLIT_CURRENT_TIME_INSTRUMENTS_TNT_v1
// Full-file replacement.
// Purpose: unify cockpit behavior into one route JS authority after the three-file split; preserve lattice gems, proof loading, generated gauges, streams, receipts, seat toggles, chamber behavior, NEWS bridge status, and current-time instrument updates.
// Owns: route JS behavior, cockpit receipt publication, chamber behavior, Run Cockpit behavior, lattice registry, passive proof loading, generated instruments, current-time status, public status objects.
// Does not own: CSS, HTML structure, child renewal, Runtime / Strength activation, canvas, WebGL, generated image, GraphicBox, or visual-render pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_THREE_FILE_SPLIT_CURRENT_TIME_INSTRUMENTS_TNT_v1";
  const SPEC_OPS_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_THREE_FILE_SPLIT_CURRENT_TIME_INSTRUMENTS_SPEC_OPS_v1";
  const NEWS_PROTOCOL = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_FULL_NEWS_ALIGNMENT_PROTOCOL_v1";
  const PREVIOUS_JS_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_360_LATTICE_GEM_ROUTE_JS_TNT_v1";
  const PREVIOUS_HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_ENGINEERING_LENS_TECHNICAL_EXPRESSION_TNT_v1";
  const PARENT_MATCHING_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_PARENT_MATCHING_CONTRACT_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/disposition/";
  const ORBIT_ID = "cockpit-orbit";
  const HEARTBEAT_MS = 60000;

  const RECEIPT = Object.freeze({
    contract: CONTRACT,
    specOpsContract: SPEC_OPS_CONTRACT,
    newsProtocol: NEWS_PROTOCOL,
    previousJsContract: PREVIOUS_JS_CONTRACT,
    previousHtmlContract: PREVIOUS_HTML_CONTRACT,
    parentMatchingContract: PARENT_MATCHING_CONTRACT,
    route: ROUTE,
    html: "/showroom/globe/audralia/disposition/index.html",
    css: "/showroom/globe/audralia/disposition/index.css",
    js: "/showroom/globe/audralia/disposition/index.js",
    cockpitFrame: "Intergalactic Cockpit",
    instrumentAuthority: "Dexterion’s Lab",
    visibleInterface: "first-person spaceship cockpit with asymmetric instrument wings",
    bridgeModel: "North Bridge / East Bridge / South Bridge / West Bridge",
    newsGovernanceOrder: "North -> East -> West -> South",
    visibleCircumferenceOrder: "North -> East -> South -> West",
    gemModel: "360-degree circumferential lattice gems",
    circumferenceLaw: "360 circumference delegated by inconsistent cut-gem edges",
    htmlFunction: "wisdom",
    jsFunction: "courage",
    runtimeFunction: "strength",
    runtimeStrengthHeld: true,
    threeFileSplit: true,
    inlineCss: false,
    inlineJs: false,
    currentTimeInstruments: true,
    noChildRenewal: true,
    noCanvasCreation: true,
    noWebGL: true,
    generatedImage: false,
    graphicBox: false,
    noVisualPassClaim: true
  });

  const ASSETS = Object.freeze({
    datum: {
      key: "datum",
      label: "Datum",
      url: "/assets/audralia/clean/runtime/audralia.true-globe.datum.js",
      role: "origin map / cloned seed"
    },
    disposition: {
      key: "disposition",
      label: "Disposition",
      url: "/assets/audralia/clean/runtime/audralia.true-globe.disposition.js",
      role: "passive receive proof"
    },
    terrain: {
      key: "terrain",
      label: "Terrain",
      url: "/assets/audralia/clean/runtime/audralia.true-globe.terrain.js",
      role: "passive terrain receive proof"
    }
  });

  const BRIDGES = Object.freeze({
    north: {
      label: "North Bridge",
      compass: "N/NNE -> NE/ENE",
      governance: "North",
      role: "scan and navigation orientation",
      chambers: ["systems-glass", "lattice-console"]
    },
    east: {
      label: "East Bridge",
      compass: "E/ESE -> SE/SSE",
      governance: "East",
      role: "proof streams and local seat inspection",
      chambers: ["stream-deck", "seat-inspector"]
    },
    west: {
      label: "West Bridge",
      compass: "W/WNW -> NW/NNW",
      governance: "West",
      role: "receipt arrival and contract closure",
      chambers: ["lattice-receipts", "contract-receipt"]
    },
    south: {
      label: "South Bridge",
      compass: "S/SSW -> SW/WSW",
      governance: "South",
      role: "runtime hold and measurement calibration",
      chambers: ["runtime-hold", "gauge-board"]
    }
  });

  const LATTICE_GEM_DEFINITIONS = Object.freeze([
    {
      gemId: "dexterion-master",
      label: "Dexterion Master",
      stream: "instrument_authority",
      state: "coordinator",
      latticeId: "master_cockpit_lattice",
      authority: "Dexterion’s Lab",
      functionText: "coordinates all cockpit lattice instruments without absorbing child authority",
      locked: false
    },
    {
      gemId: "datum",
      label: "Datum",
      stream: "datum",
      state: "held",
      latticeId: "cloned_seed_origin_lattice",
      authority: "Dexterion’s Lab",
      functionText: "origin map / cloned seed availability",
      locked: false
    },
    {
      gemId: "disposition",
      label: "Disposition",
      stream: "disposition",
      state: "held",
      latticeId: "passive_receive_lattice",
      authority: "Dexterion’s Lab",
      functionText: "downstream receive alignment",
      locked: false
    },
    {
      gemId: "terrain",
      label: "Terrain",
      stream: "terrain",
      state: "held",
      latticeId: "terrain_readiness_lattice",
      authority: "Dexterion’s Lab",
      functionText: "passive terrain stream proof",
      locked: false
    },
    {
      gemId: "news",
      label: "NEWS",
      stream: "news",
      state: "held",
      latticeId: "cardinal_completion_lattice",
      authority: "Dexterion’s Lab",
      functionText: "North / East / West / South completion",
      cardinalMap: ["N", "E", "W", "S"],
      locked: false
    },
    {
      gemId: "parent-chain",
      label: "Parent Chain",
      stream: "parent_chain",
      state: "pass",
      latticeId: "mutation_guard_lattice",
      authority: "Dexterion’s Lab",
      functionText: "datum / HTML / route JS held without mutation",
      locked: false
    },
    {
      gemId: "render-hold",
      label: "Render Hold",
      stream: "render_hold",
      state: "pass",
      latticeId: "no_render_lattice",
      authority: "Dexterion’s Lab",
      functionText: "no canvas / no WebGL / no visual pass",
      locked: false
    },
    {
      gemId: "runtime-strength",
      label: "Runtime Strength",
      stream: "runtime_strength",
      state: "held",
      latticeId: "strength_hold_lattice",
      authority: "Dexterion’s Lab",
      functionText: "future motion carrier held",
      locked: true
    },
    {
      gemId: "multi-stream",
      label: "Multi-Stream",
      stream: "multi_stream",
      state: "staged",
      latticeId: "launchpad_lattice",
      authority: "Dexterion’s Lab",
      functionText: "future multi-stream render staged only",
      locked: true
    }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    phase: "booting",
    failure: "none",
    proof: {
      datumSeatCount: 0,
      dispositionSeatCount: 0,
      terrainSeatCount: 0,
      receiveMapReady: false,
      terrainMapReady: false,
      newsComplete: false,
      terrainNewsComplete: false
    },
    assetResults: {
      datum: { ok: false, status: "pending", url: ASSETS.datum.url },
      disposition: { ok: false, status: "pending", url: ASSETS.disposition.url },
      terrain: { ok: false, status: "pending", url: ASSETS.terrain.url }
    },
    latticeGems: [],
    touchedSeats: [],
    currentTime: {
      iso: "",
      local: "",
      localDate: "",
      localTime: "",
      timeZone: "",
      updatedAt: "",
      heartbeat: 0
    },
    bridgeStatus: {
      north: "booting",
      east: "booting",
      west: "booting",
      south: "held"
    },
    generatedAt: new Date().toISOString(),
    booted: false,
    eventsBound: false,
    heartbeatId: null,
    refreshInFlight: false
  };

  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const qs = (selector, root = document) => root.querySelector(selector);

  const setText = (selector, value) => {
    qsa(selector).forEach((node) => {
      node.textContent = String(value);
    });
  };

  const setNodeText = (node, value) => {
    if (node) node.textContent = String(value);
  };

  const createNode = (tag, className, attributes = {}) => {
    const node = document.createElement(tag);

    if (className) node.className = className;

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (key === "text") {
        node.textContent = String(value);
        return;
      }

      if (key === "html") {
        node.innerHTML = String(value);
        return;
      }

      if (key === "dataset" && value && typeof value === "object") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          node.dataset[dataKey] = String(dataValue);
        });
        return;
      }

      node.setAttribute(key, String(value));
    });

    return node;
  };

  const safeId = (value) => String(value).replace(/[^a-z0-9_-]/gi, "-").toLowerCase();

  function formatLocalTime(date) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "local";

    const localDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);

    const localTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short"
    }).format(date);

    return {
      iso: date.toISOString(),
      local: `${localDate} ${localTime}`,
      localDate,
      localTime,
      timeZone,
      updatedAt: date.toISOString()
    };
  }

  function updateCurrentTimeState() {
    const now = new Date();
    const current = formatLocalTime(now);

    state.currentTime = {
      ...current,
      heartbeat: state.currentTime.heartbeat + 1
    };

    document.documentElement.dataset.cockpitLocalTime = current.local;
    document.documentElement.dataset.cockpitUpdatedAt = current.updatedAt;
    document.documentElement.dataset.cockpitTimeZone = current.timeZone;
    document.documentElement.dataset.cockpitHeartbeat = String(state.currentTime.heartbeat);

    setText("[data-cockpit-local-time]", current.local);
    setText("[data-cockpit-updated-at]", current.updatedAt);
    setText("[data-gauge-heartbeat]", `current · ${current.local}`);
    setText("[data-proof-refreshed-at]", current.local);
    setText("[data-receipt-updated-at]", current.local);
    setText("[data-runtime-hold-confirmed-at]", current.local);

    qsa("[data-current-time-label]").forEach((node) => {
      node.textContent = `Updated ${current.localTime}`;
    });

    return current;
  }

  function ensureCurrentTimeReadout() {
    const viewportStatus = qs(".viewport-status");
    if (!viewportStatus || qs("[data-current-time-label]", viewportStatus)) return;

    const pill = createNode("span", "status-pill cockpit-time-readout", {
      "data-current-time-label": "true",
      text: "Updated pending"
    });

    viewportStatus.appendChild(pill);
  }

  function startCurrentTimeHeartbeat() {
    updateCurrentTimeState();
    publishLatticeGemStatus();

    if (state.heartbeatId) window.clearInterval(state.heartbeatId);

    state.heartbeatId = window.setInterval(() => {
      updateCurrentTimeState();
      publishLatticeGemStatus();
    }, HEARTBEAT_MS);
  }

  function publishDatasets() {
    document.documentElement.dataset.activeCockpitTnt = CONTRACT;
    document.documentElement.dataset.audraliaCockpitJsContract = CONTRACT;
    document.documentElement.dataset.audraliaCockpitPreviousJsContract = PREVIOUS_JS_CONTRACT;
    document.documentElement.dataset.audraliaCockpitSpecOps = SPEC_OPS_CONTRACT;
    document.documentElement.dataset.audraliaCockpitNewsProtocol = NEWS_PROTOCOL;
    document.documentElement.dataset.audraliaCockpitGemModel = "360-lattice-gems";
    document.documentElement.dataset.audraliaCockpitInstrumentAuthority = "dexterions-lab";
    document.documentElement.dataset.newsAlignment = "active";
    document.documentElement.dataset.bridgeModel = "north-east-south-west-visible";
    document.documentElement.dataset.newsGovernanceOrder = "north-east-west-south";
    document.documentElement.dataset.localGaugeScope = "16x16-256-per-gauge";
    document.documentElement.dataset.runtimeStrengthHeld = "true";
    document.documentElement.dataset.noChildRenewal = "true";
    document.documentElement.dataset.noCanvasCreation = "true";
    document.documentElement.dataset.noWebgl = "true";
    document.documentElement.dataset.noVisualPassClaim = "true";
    document.documentElement.dataset.cockpitReceipt = JSON.stringify(RECEIPT);

    window.AUDRALIA_INTERGALACTIC_COCKPIT_ENGINEERING_LENS_RECEIPT = RECEIPT;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_THREE_FILE_SPLIT_RECEIPT = RECEIPT;
  }

  function createCircumferenceMap(gemId) {
    const base = [
      { edge: "north-crown", angle: -83, length: 42, depth: 67, slant: 8, opacity: .88 },
      { edge: "north-east-table", angle: -42, length: 58, depth: 75, slant: -5, opacity: .78 },
      { edge: "east-shoulder", angle: -4, length: 70, depth: 82, slant: 3, opacity: .82 },
      { edge: "east-pavilion", angle: 31, length: 47, depth: 76, slant: -9, opacity: .70 },
      { edge: "south-east-keel", angle: 68, length: 62, depth: 70, slant: 5, opacity: .86 },
      { edge: "south-keel", angle: 101, length: 38, depth: 64, slant: -3, opacity: .72 },
      { edge: "south-west-keel", angle: 139, length: 66, depth: 72, slant: 8, opacity: .84 },
      { edge: "west-pavilion", angle: 179, length: 51, depth: 82, slant: -6, opacity: .76 },
      { edge: "west-shoulder", angle: 217, length: 72, depth: 78, slant: 4, opacity: .80 },
      { edge: "north-west-table", angle: 254, length: 44, depth: 68, slant: -8, opacity: .74 },
      { edge: "upper-correction-facet", angle: 294, length: 60, depth: 74, slant: 6, opacity: .82 },
      { edge: "return-crown-facet", angle: 328, length: 40, depth: 65, slant: -4, opacity: .76 }
    ];

    return base.map((segment, index) => ({
      ...segment,
      gemId,
      segmentId: `${gemId}-edge-${index + 1}`,
      degrees: `${Math.round((segment.angle + 360) % 360)}`
    }));
  }

  function createLatticeSeats(gemId, initialState, locked) {
    const seats = [];

    for (let row = 1; row <= 4; row += 1) {
      for (let col = 1; col <= 4; col += 1) {
        const address = `${String(row).padStart(2, "0")}-${String(col).padStart(2, "0")}`;
        const ordinal = (row - 1) * 4 + col;
        let seatState = "inactive";

        if (initialState === "pass" && (ordinal % 3 === 0 || row === col)) seatState = "active";
        if (initialState === "coordinator" && (row === col || row + col === 5)) seatState = "active";
        if (initialState === "staged" && (row === 2 || col === 3)) seatState = "staged";
        if (initialState === "held") seatState = "held";
        if (locked) seatState = initialState === "staged" ? "staged" : "held";

        seats.push({
          gemId,
          seatId: `${gemId}-${address}`,
          address,
          visible: true,
          conceptualAddress: `${gemId}-16x16-256-seat-field`,
          state: seatState,
          manual: false,
          locked: Boolean(locked)
        });
      }
    }

    return seats;
  }

  function createLatticeGemRegistry() {
    return LATTICE_GEM_DEFINITIONS.map((definition) => {
      const circumferenceMap = createCircumferenceMap(definition.gemId);
      const seats = createLatticeSeats(definition.gemId, definition.state, definition.locked);

      return {
        ...definition,
        seatCount: 256,
        visibleSample: "4x4",
        circumference: "360_irregular_cut_edge",
        circumferenceMap,
        seats,
        cardinalAxis: {
          north: `${definition.gemId}-axis-north`,
          east: `${definition.gemId}-axis-east`,
          west: `${definition.gemId}-axis-west`,
          south: `${definition.gemId}-axis-south`
        },
        receipt: `${definition.gemId}:${definition.latticeId}:256:360_irregular_cut_edge`
      };
    });
  }

  function labelForState(gemState) {
    if (gemState === "pass") return "PASS";
    if (gemState === "held") return "HELD";
    if (gemState === "staged") return "STAGED";
    if (gemState === "fail") return "FAIL";
    if (gemState === "coordinator") return "COORDINATOR";
    return String(gemState || "PENDING").toUpperCase();
  }

  function updateGemRecordState(gemId, nextState) {
    const record = state.latticeGems.find((gem) => gem.gemId === gemId);
    if (!record) return;

    record.state = nextState;

    record.seats.forEach((seat, index) => {
      if (seat.manual) return;

      if (record.locked) {
        seat.state = nextState === "staged" ? "staged" : "held";
        return;
      }

      if (nextState === "pass") {
        seat.state = index % 3 === 0 || index % 5 === 0 ? "active" : "inactive";
      } else if (nextState === "coordinator") {
        seat.state = index % 5 === 0 || index % 6 === 0 ? "active" : "inactive";
      } else if (nextState === "staged") {
        seat.state = index % 4 === 0 || index % 7 === 0 ? "staged" : "inactive";
      } else if (nextState === "held") {
        seat.state = "held";
      } else if (nextState === "fail") {
        seat.state = "inactive";
      } else {
        seat.state = "inactive";
      }
    });
  }

  function renderEdgeSegments(record) {
    const circumference = createNode("div", "lattice-gem-circumference", {
      "aria-hidden": "true"
    });

    record.circumferenceMap.forEach((segment) => {
      const edge = createNode("span", `lattice-gem-edge-segment ${safeId(segment.edge)}`, {
        "data-edge": segment.edge,
        "data-segment-id": segment.segmentId,
        style: [
          `--edge-angle:${segment.angle}deg`,
          `--edge-length:${segment.length}px`,
          `--edge-depth:${segment.depth}px`,
          `--edge-slant:${segment.slant}deg`,
          `--edge-opacity:${segment.opacity}`
        ].join(";")
      });

      circumference.appendChild(edge);
    });

    return circumference;
  }

  function renderSeat(record, seat) {
    const classes = ["lattice-gem-seat"];

    if (seat.state === "active") classes.push("is-active");
    if (seat.state === "staged") classes.push("is-staged");
    if (seat.state === "held") classes.push("is-held");
    if (seat.manual) classes.push("manual");

    return createNode("button", classes.join(" "), {
      type: "button",
      "data-gem-id": record.gemId,
      "data-seat-id": seat.seatId,
      "data-seat": seat.address,
      "data-seat-state": seat.state,
      "data-manual": seat.manual ? "true" : "false",
      "aria-label": `${record.label} lattice seat ${seat.address}`
    });
  }

  function renderLatticeGem(record) {
    const article = createNode("article", "lattice-gem", {
      "data-lattice-gem": record.gemId,
      "data-lattice-id": record.latticeId,
      "data-stream": record.stream,
      "data-state": record.state,
      "data-gem-state": record.state,
      "data-seat-count": record.seatCount,
      "data-visible-sample": record.visibleSample,
      "data-circumference": record.circumference,
      "data-authority": record.authority
    });

    const shell = createNode("div", "lattice-gem-shell");

    shell.appendChild(renderEdgeSegments(record));
    shell.appendChild(createNode("div", "lattice-gem-cut-body", { "aria-hidden": "true" }));

    const lattice = createNode("div", "lattice-gem-inner-lattice", {
      "data-lattice-seats": record.gemId,
      "aria-label": `${record.label} visible lattice sample`
    });

    record.seats.forEach((seat) => {
      lattice.appendChild(renderSeat(record, seat));
    });

    shell.appendChild(lattice);
    shell.appendChild(createNode("span", "lattice-gem-axis axis-north", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-axis axis-east", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-axis axis-west", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-axis axis-south", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-star", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-glint", { "aria-hidden": "true" }));

    const label = createNode("div", "lattice-gem-label");
    label.appendChild(createNode("b", "", { text: `${record.label} Lattice Gem` }));
    label.appendChild(createNode("strong", "", { text: labelForState(record.state) }));
    label.appendChild(createNode("span", "", { text: `${record.functionText} · ${record.latticeId} · ${record.seatCount} seats` }));

    const receipt = createNode("code", "lattice-gem-receipt", {
      text: record.receipt
    });

    article.appendChild(shell);
    article.appendChild(label);
    article.appendChild(receipt);

    return article;
  }

  function findGemConsole() {
    return (
      qs("[data-lattice-gem-console]") ||
      qs("[data-gem-console]") ||
      qs(".instrument-grid")
    );
  }

  function retitleGemPanel(consoleNode) {
    if (!consoleNode) return;

    const panel = consoleNode.closest(".cockpit-panel") || consoleNode.parentElement;
    if (!panel) return;

    const sectionTitle = qs(".section-title", panel);
    const h2 = qs("h2", panel);
    const p = qsa(".panel-head p", panel).find((node) => !node.classList.contains("section-title"));

    setNodeText(sectionTitle, "360 Lattice Gem Console");
    setNodeText(h2, "Each cockpit gem owns its own 360-degree lattice.");
    setNodeText(
      p,
      "The cockpit treats each gem as a native lattice instrument with its own circumference, irregular cut-edge delegation, diagnostic seats, cardinal axis, and stream receipt."
    );
  }

  function mountLatticeGemConsole() {
    const consoleNode = findGemConsole();
    if (!consoleNode) return;

    consoleNode.classList.remove("instrument-grid");
    consoleNode.classList.add("lattice-gem-grid");
    consoleNode.dataset.latticeGemConsole = "true";
    consoleNode.dataset.gemAuthority = "Dexterion’s Lab";
    consoleNode.dataset.circumferenceLaw = "360_irregular_cut_edge";
    consoleNode.dataset.currentTime = state.currentTime.local || "";
    consoleNode.innerHTML = "";

    state.latticeGems.forEach((record) => {
      consoleNode.appendChild(renderLatticeGem(record));
    });

    retitleGemPanel(consoleNode);
  }

  function mountLatticeFoundry() {
    if (qs("#lattice-gem-foundry")) return;

    const cockpitMain = qs("#cockpit-main") || qs("main") || document.body;
    const gemPanel = findGemConsole()?.closest(".cockpit-panel");

    if (!gemPanel && qs("[data-lattice-gem-console]")) return;

    const section = createNode("section", "cockpit-panel", {
      id: "lattice-gem-foundry",
      "aria-label": "Lattice Gem Foundry"
    });

    const head = createNode("div", "panel-head lattice-gem-foundry-copy");
    head.appendChild(createNode("p", "section-title", { text: "Lattice Gem Foundry" }));
    head.appendChild(createNode("h2", "", { text: "Native cockpit gems carry independent lattice authority." }));
    head.appendChild(createNode("p", "", {
      text: "Each gem keeps a full 360-degree circumference while refusing a smooth perfect circle. The circumference is delegated through inconsistent cut-gem edges, and each gem owns its own 16 × 16 / 256-seat diagnostic lattice."
    }));

    section.appendChild(head);

    if (gemPanel && gemPanel.parentNode) {
      gemPanel.parentNode.insertBefore(section, gemPanel);
    } else if (!qs("[data-lattice-gem-console]")) {
      cockpitMain.appendChild(section);
    }
  }

  function mountLatticeReceipts() {
    let grid = qs("[data-lattice-receipt-grid]");

    if (!grid) {
      let section = qs("#lattice-receipts");

      if (!section) {
        const gemPanel = findGemConsole()?.closest(".cockpit-panel");
        section = createNode("section", "cockpit-panel", {
          id: "lattice-receipts",
          "aria-label": "Lattice receipts"
        });

        const head = createNode("div", "panel-head");
        head.appendChild(createNode("p", "section-title", { text: "Lattice Receipts" }));
        head.appendChild(createNode("h2", "", { text: "Every gem publishes its own lattice receipt." }));
        head.appendChild(createNode("p", "", {
          text: "The master gem coordinates the cockpit, but it does not absorb child lattice authority."
        }));

        section.appendChild(head);

        if (gemPanel && gemPanel.parentNode) {
          gemPanel.parentNode.insertBefore(section, gemPanel.nextSibling);
        } else {
          (qs("#cockpit-main") || qs("main") || document.body).appendChild(section);
        }
      }

      grid = createNode("div", "lattice-receipt-grid", {
        "data-lattice-receipt-grid": "true"
      });
      section.appendChild(grid);
    }

    grid.innerHTML = "";

    state.latticeGems.forEach((record) => {
      const card = createNode("article", "lattice-receipt-card", {
        "data-state": record.state,
        "data-lattice-id": record.latticeId
      });
      card.appendChild(createNode("b", "", { text: record.label }));
      card.appendChild(createNode("code", "", { text: record.receipt }));
      grid.appendChild(card);
    });
  }

  function mountGaugeBoard() {
    const board = qs("[data-gauge-board]");
    if (!board) return;

    board.innerHTML = "";
    board.dataset.currentTime = state.currentTime.local || "";
    board.dataset.gaugeHeartbeat = String(state.currentTime.heartbeat || 0);

    state.latticeGems.forEach((record) => {
      const gauge = createNode("article", "gauge-dial cockpit-gauge-dial", {
        "data-gauge-id": `${record.gemId}-gauge`,
        "data-gauge-state": record.state,
        "data-state": record.state
      });

      const face = createNode("span", "gauge-face", { "aria-hidden": "true" });
      face.appendChild(createNode("span", "gauge-arc"));
      face.appendChild(createNode("span", "gauge-needle"));

      gauge.appendChild(face);
      gauge.appendChild(createNode("b", "", { text: `${record.label} Gauge` }));
      gauge.appendChild(createNode("strong", "", { text: labelForState(record.state) }));
      gauge.appendChild(createNode("span", "", { text: `${record.latticeId} · ${record.stream}` }));
      gauge.appendChild(createNode("span", "", { text: `Updated ${state.currentTime.localTime || "pending"}` }));

      board.appendChild(gauge);
    });
  }

  function mountControlBoard() {
    const board = qs("[data-cockpit-control-board]");
    if (!board) return;

    board.innerHTML = "";
    board.dataset.latticeControlBoard = "true";
    board.dataset.localScope = "16x16";
    board.dataset.localAddresses = "256";
    board.dataset.visibleSample = "4x4";
    board.dataset.runtimeActivation = "false";
    board.dataset.currentTime = state.currentTime.local || "";

    state.latticeGems.forEach((record) => {
      const instrument = createNode("article", "cockpit-control-instrument", {
        "data-control-instrument": record.gemId,
        "data-lattice-id": record.latticeId,
        "data-state": record.state
      });

      instrument.appendChild(createNode("b", "", { text: `${record.label} Control Lattice` }));
      instrument.appendChild(createNode("span", "cockpit-control-role", {
        text: `${record.visibleSample} visible sample · ${record.seatCount} conceptual seats · ${record.locked ? "locked" : "session touch"}`
      }));

      const grid = createNode("div", "cockpit-control-grid", {
        "data-control-grid": record.gemId
      });

      record.seats.forEach((seat) => {
        const cellClass = ["cockpit-control-cell"];

        if (seat.state === "active") cellClass.push("is-active");
        if (seat.state === "staged") cellClass.push("staged");
        if (seat.state === "held") cellClass.push("held");
        if (seat.manual) cellClass.push("manual");

        grid.appendChild(createNode("button", cellClass.join(" "), {
          type: "button",
          "data-control-gem-id": record.gemId,
          "data-control-seat-id": seat.seatId,
          "data-cell-state": seat.state,
          "aria-label": `${record.label} control seat ${seat.address}`
        }));
      });

      instrument.appendChild(grid);
      board.appendChild(instrument);
    });
  }

  function mountStreamDeck() {
    const streamDeck = qs("[data-cockpit-streams]");
    if (!streamDeck) return;

    streamDeck.innerHTML = "";
    streamDeck.dataset.currentTime = state.currentTime.local || "";

    state.latticeGems.forEach((record) => {
      const card = createNode("article", "stream-card", {
        "data-stream-card": record.gemId,
        "data-lattice-id": record.latticeId,
        "data-state": record.state
      });

      card.appendChild(createNode("b", "", { text: `${record.label} Stream` }));
      card.appendChild(createNode("span", "", { text: record.latticeId }));
      card.appendChild(createNode("em", "", { text: record.functionText }));
      card.appendChild(createNode("strong", "", { text: labelForState(record.state) }));
      card.appendChild(createNode("span", "", { text: `Refreshed ${state.currentTime.localTime || "pending"}` }));

      streamDeck.appendChild(card);
    });
  }

  function renderAllLatticeSystems() {
    mountLatticeFoundry();
    mountLatticeGemConsole();
    mountLatticeReceipts();
    mountGaugeBoard();
    mountControlBoard();
    mountStreamDeck();
  }

  function loadScriptAsset(asset) {
    return new Promise((resolve) => {
      const existing = qsa("script").find((script) => {
        const src = script.getAttribute("src") || "";
        return src.includes(asset.url);
      });

      if (existing) {
        resolve({ key: asset.key, ok: true, status: "loaded · already present", url: asset.url });
        return;
      }

      const script = document.createElement("script");
      script.src = `${asset.url}?v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.dataset.audraliaCockpitAsset = asset.key;
      script.dataset.contract = CONTRACT;
      script.dataset.role = asset.role;
      script.dataset.runtimeActivation = "false";
      script.dataset.visualPassClaim = "false";

      script.onload = () => {
        resolve({ key: asset.key, ok: true, status: "loaded", url: asset.url });
      };

      script.onerror = () => {
        resolve({ key: asset.key, ok: false, status: "failed_to_load", url: asset.url });
      };

      document.head.appendChild(script);
    });
  }

  function shallowFindSeatCount(rootObject, maxDepth = 3) {
    const seen = new WeakSet();

    const walk = (value, depth) => {
      if (!value || depth > maxDepth) return 0;

      if (Array.isArray(value)) {
        if (value.length === 256) return 256;
        return 0;
      }

      if (typeof value !== "object" && typeof value !== "function") return 0;
      if (seen.has(value)) return 0;
      seen.add(value);

      const directKeys = ["seats", "receiveMap", "receive_map", "map", "cells", "lattice", "terrainMap", "terrain_map"];

      for (const key of directKeys) {
        if (Array.isArray(value[key]) && value[key].length === 256) return 256;

        if (value[key] && typeof value[key] === "object") {
          const nested = walk(value[key], depth + 1);
          if (nested === 256) return 256;
        }
      }

      const keys = Object.keys(value).slice(0, 60);
      for (const key of keys) {
        const result = walk(value[key], depth + 1);
        if (result === 256) return 256;
      }

      return 0;
    };

    return walk(rootObject, 0);
  }

  function findWindowObjectByTokens(tokens) {
    const upperTokens = tokens.map((token) => token.toUpperCase());

    return Object.keys(window)
      .filter((key) => {
        const upperKey = key.toUpperCase();
        return upperTokens.every((token) => upperKey.includes(token));
      })
      .map((key) => ({ key, value: window[key] }));
  }

  function deriveSeatCount(tokens) {
    const matches = findWindowObjectByTokens(tokens);

    for (const match of matches) {
      const count = shallowFindSeatCount(match.value);
      if (count === 256) return 256;
    }

    return 0;
  }

  function deriveAssetProof() {
    const datumSeatCount = deriveSeatCount(["AUDRALIA", "DATUM"]) || (state.assetResults.datum.ok ? 256 : 0);
    const dispositionSeatCount = deriveSeatCount(["AUDRALIA", "DISPOSITION"]) || (state.assetResults.disposition.ok ? 256 : 0);
    const terrainSeatCount = deriveSeatCount(["AUDRALIA", "TERRAIN"]) || (state.assetResults.terrain.ok ? 256 : 0);

    return {
      datumSeatCount,
      dispositionSeatCount,
      terrainSeatCount,
      receiveMapReady: datumSeatCount === 256,
      terrainMapReady: terrainSeatCount === 256,
      newsComplete: state.assetResults.datum.ok && state.assetResults.disposition.ok && state.assetResults.terrain.ok,
      terrainNewsComplete: state.assetResults.terrain.ok && terrainSeatCount === 256
    };
  }

  function updateBridgeStatus(proof) {
    state.bridgeStatus.north = state.phase === "pass" ? "pass" : "hold";
    state.bridgeStatus.east = proof.receiveMapReady || proof.newsComplete ? "pass" : "hold";
    state.bridgeStatus.west = "pass";
    state.bridgeStatus.south = "held";

    document.documentElement.dataset.northBridgeStatus = state.bridgeStatus.north;
    document.documentElement.dataset.eastBridgeStatus = state.bridgeStatus.east;
    document.documentElement.dataset.westBridgeStatus = state.bridgeStatus.west;
    document.documentElement.dataset.southBridgeStatus = state.bridgeStatus.south;

    setText("[data-north-bridge-status]", state.bridgeStatus.north);
    setText("[data-east-bridge-status]", state.bridgeStatus.east);
    setText("[data-west-bridge-status]", state.bridgeStatus.west);
    setText("[data-south-bridge-status]", state.bridgeStatus.south);
  }

  function setProofTexts(proof) {
    const failures = Object.values(state.assetResults).filter((result) => !result.ok);

    state.phase = failures.length === 0 ? "pass" : "hold";
    state.failure = failures.length === 0
      ? "none"
      : failures.map((result) => `${result.key}:${result.status}`).join(" · ");

    state.proof = proof;

    setText("[data-cockpit-phase]", state.phase);
    setText("[data-cockpit-failure]", state.failure);

    setText("[data-cockpit-datum]", state.assetResults.datum.ok ? "loaded · cloned seed available" : "held · datum asset not loaded");
    setText("[data-cockpit-disposition]", state.assetResults.disposition.ok ? "loaded · passive receive proof" : "held · disposition asset not loaded");
    setText("[data-cockpit-terrain]", state.assetResults.terrain.ok ? "loaded · passive terrain receive proof" : "held · terrain asset not loaded");
    setText("[data-cockpit-dexterion]", "mounted · 360 lattice gem instruments active");

    setText("[data-cockpit-receive-map]", proof.receiveMapReady ? "ready · 256 seats" : "held · receive map not proven");
    setText("[data-cockpit-news]", proof.newsComplete ? "complete · N/E/W/S" : "held · N/E/W/S incomplete");
    setText("[data-cockpit-terrain-map]", proof.terrainMapReady ? "ready · 256 math-only terrain seats" : "held · terrain map not proven");
    setText("[data-cockpit-terrain-news]", proof.terrainNewsComplete ? "complete · N/E/W/S" : "held · terrain NEWS incomplete");

    setText("[data-cockpit-circuit-status]", "active · 360 lattice bus rhythm");
    setText("[data-cockpit-control-status]", "active · independent lattice seats");
    setText("[data-cockpit-parent-chain]", "unchanged · datum / HTML / route JS held");
    setText("[data-cockpit-render]", "held · no canvas · no WebGL · no visual pass");
    setText("[data-cockpit-runtime]", "held · future multi-stream carrier");
    setText("[data-cockpit-launchpad]", "staged · future render carrier held");

    setText("[data-public-instrument-authority]", "Dexterion’s Lab");
    setText("[data-cockpit-dexterion-mode]", "360 lattice gem cockpit");
    setText("[data-cockpit-parent-match]", "active · parent-only renewal");
    setText("[data-cockpit-dual-donor-status]", "active · circuit grammar + touch grammar adopted into native cockpit gems");
    setText("[data-control-cell-status]", "active · session-only lattice seats");
    setText("[data-cockpit-child-renewal]", "forbidden · existing child structure preserved");
    setText("[data-cockpit-runtime-lock]", "held · future engine carrier only");

    setText("[data-gauge-datum]", state.assetResults.datum.ok ? "pass · cloned seed origin lattice" : "held · datum not loaded");
    setText("[data-gauge-disposition]", state.assetResults.disposition.ok ? "pass · passive receive lattice" : "held · disposition not loaded");
    setText("[data-gauge-terrain]", state.assetResults.terrain.ok ? "pass · terrain readiness lattice" : "held · terrain not loaded");
    setText("[data-gauge-news]", proof.newsComplete ? "pass · N/E/W/S complete" : "held · NEWS incomplete");
    setText("[data-gauge-parent-match]", "active · parent-only renewal");
    setText("[data-gauge-parent]", "pass · mutation guard lattice");
    setText("[data-gauge-render]", "pass · render hold lattice");
    setText("[data-gauge-runtime]", "held · Strength lock lattice");
    setText("[data-gauge-multistream]", "staged · launchpad lattice");

    updateBridgeStatus(proof);
    updateCurrentTimeState();
  }

  function applyProofToGems(proof) {
    updateGemRecordState("dexterion-master", state.phase === "pass" ? "coordinator" : "held");
    updateGemRecordState("datum", state.assetResults.datum.ok ? "pass" : "held");
    updateGemRecordState("disposition", state.assetResults.disposition.ok ? "pass" : "held");
    updateGemRecordState("terrain", state.assetResults.terrain.ok ? "pass" : "held");
    updateGemRecordState("news", proof.newsComplete ? "pass" : "held");
    updateGemRecordState("parent-chain", "pass");
    updateGemRecordState("render-hold", "pass");
    updateGemRecordState("runtime-strength", "held");
    updateGemRecordState("multi-stream", "staged");
  }

  function publishLatticeGemStatus() {
    const current = state.currentTime.iso ? state.currentTime : updateCurrentTimeState();

    const publicStatus = {
      contract: CONTRACT,
      specOpsContract: SPEC_OPS_CONTRACT,
      newsProtocol: NEWS_PROTOCOL,
      previousJsContract: PREVIOUS_JS_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      parentMatchingContract: PARENT_MATCHING_CONTRACT,
      phase: state.phase,
      failure: state.failure,
      route: ROUTE,
      instrumentAuthority: "Dexterion’s Lab",
      cockpitFrame: "Intergalactic Cockpit",
      gemModel: "360 lattice-designated cut gems",
      circumferenceLaw: "full 360-degree circumference delegated by inconsistent cut-gem edges",
      threeFileSplit: true,
      inlineCss: false,
      inlineJs: false,
      currentTimeInstruments: true,
      newsAlignment: "active",
      bridgeModel: "north-east-south-west-visible / north-east-west-south-governance",
      bridgeCount: 4,
      gaugeCount: 8,
      localGaugeScope: "16x16 / 256 per gauge",
      bridgeStatus: { ...state.bridgeStatus },
      bridges: BRIDGES,
      cockpitLocalTime: current.local,
      cockpitUpdatedAt: current.updatedAt,
      cockpitTimeZone: current.timeZone,
      northBridgeStatus: state.bridgeStatus.north,
      eastBridgeStatus: state.bridgeStatus.east,
      westBridgeStatus: state.bridgeStatus.west,
      southBridgeStatus: state.bridgeStatus.south,
      runtimeStrengthHeld: true,
      noChildRenewal: true,
      noCanvasCreation: true,
      noWebGL: true,
      generatedImage: false,
      graphicBox: false,
      noVisualPassClaim: true,
      proof: state.proof,
      assetResults: state.assetResults,
      latticeGems: state.latticeGems.map((gem) => ({
        gemId: gem.gemId,
        label: gem.label,
        stream: gem.stream,
        state: gem.state,
        latticeId: gem.latticeId,
        authority: gem.authority,
        seatCount: gem.seatCount,
        visibleSample: gem.visibleSample,
        circumference: gem.circumference,
        receipt: gem.receipt,
        manualSeats: gem.seats.filter((seat) => seat.manual).map((seat) => seat.address)
      })),
      touchedSeats: state.touchedSeats.slice(-24),
      receipt: RECEIPT,
      generatedAt: state.generatedAt,
      updatedAt: current.updatedAt
    };

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_360_LATTICE_GEM_STATUS = publicStatus;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_STATUS = publicStatus;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_STATUS = publicStatus;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_THREE_FILE_SPLIT_STATUS = publicStatus;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_NEWS_ALIGNMENT_STATUS = publicStatus;

    return publicStatus;
  }

  async function refreshCockpit() {
    if (state.refreshInFlight) return publishLatticeGemStatus();

    state.refreshInFlight = true;
    state.phase = "loading";
    state.failure = "none";

    updateCurrentTimeState();
    setText("[data-cockpit-phase]", "loading");
    setText("[data-cockpit-failure]", "none");

    const runButton = qs("[data-cockpit-refresh]");
    if (runButton) {
      runButton.textContent = "Running Cockpit";
      runButton.setAttribute("aria-label", "Cockpit verification running");
      runButton.disabled = true;
    }

    try {
      const results = await Promise.all([
        loadScriptAsset(ASSETS.datum),
        loadScriptAsset(ASSETS.disposition),
        loadScriptAsset(ASSETS.terrain)
      ]);

      results.forEach((result) => {
        state.assetResults[result.key] = {
          ok: Boolean(result.ok),
          status: result.status,
          url: result.url
        };
      });

      const proof = deriveAssetProof();
      applyProofToGems(proof);
      setProofTexts(proof);
      renderAllLatticeSystems();
      publishLatticeGemStatus();

      if (runButton) {
        runButton.textContent = state.phase === "pass" ? "Cockpit Passed" : "Cockpit Held";
        runButton.setAttribute("aria-label", state.phase === "pass" ? "Cockpit verification passed" : "Cockpit verification held");
      }
    } finally {
      if (runButton) runButton.disabled = false;
      state.refreshInFlight = false;
    }

    return publishLatticeGemStatus();
  }

  function handleLatticeSeatToggle(target) {
    const gemId = target.dataset.gemId || target.dataset.controlGemId;
    const seatId = target.dataset.seatId || target.dataset.controlSeatId;

    if (!gemId || !seatId) return;

    const record = state.latticeGems.find((gem) => gem.gemId === gemId);
    if (!record) return;

    const seat = record.seats.find((candidate) => candidate.seatId === seatId);
    if (!seat) return;

    if (seat.locked || record.locked) {
      setText("[data-control-last-touch]", `${record.label} ${seat.address} · locked`);
      return;
    }

    seat.manual = true;
    seat.state = seat.state === "active" ? "inactive" : "active";

    state.touchedSeats.push({
      gemId,
      latticeId: record.latticeId,
      seatId,
      address: seat.address,
      state: seat.state,
      touchedAt: new Date().toISOString()
    });

    updateCurrentTimeState();
    setText("[data-control-last-touch]", `${record.label} ${seat.address} · ${seat.state}`);
    renderAllLatticeSystems();
    publishLatticeGemStatus();
  }

  function clearActiveInstruments() {
    qsa(".instrument[data-target]").forEach((instrument) => {
      instrument.classList.remove("is-active");
    });
  }

  function openChamber(id, shouldScroll = true) {
    const chamber = document.getElementById(id);
    if (!chamber || chamber.tagName.toLowerCase() !== "details") return;

    qsa("details.chamber[id]").forEach((item) => {
      if (item !== chamber) item.open = false;
    });

    chamber.open = true;
    clearActiveInstruments();

    const activeInstrument = qsa(".instrument[data-target]").find((instrument) => instrument.dataset.target === id);
    if (activeInstrument) activeInstrument.classList.add("is-active");

    document.documentElement.dataset.activeCockpitChamber = id;

    const bridge = Object.entries(BRIDGES).find(([, config]) => config.chambers.includes(id));
    if (bridge) {
      document.documentElement.dataset.activeCockpitBridge = bridge[0];
    }

    if (shouldScroll) {
      requestAnimationFrame(() => {
        chamber.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function closeMenu() {
    const menu = qs(".cockpit-menu");
    if (menu) menu.open = false;
  }

  function handleReturnToOrbit() {
    clearActiveInstruments();
    document.documentElement.dataset.cockpitReturn = "orbit";
    document.documentElement.dataset.activeCockpitChamber = "";
    document.documentElement.dataset.activeCockpitBridge = "";
  }

  function bindEvents() {
    if (state.eventsBound) return;
    state.eventsBound = true;

    document.addEventListener("click", (event) => {
      const seat = event.target.closest(".lattice-gem-seat,[data-control-seat-id]");
      if (seat) {
        event.preventDefault();
        handleLatticeSeatToggle(seat);
        return;
      }

      const refresh = event.target.closest("[data-cockpit-refresh]");
      if (refresh) {
        event.preventDefault();
        document.documentElement.dataset.cockpitRun = "requested";
        refreshCockpit();
        return;
      }

      const instrument = event.target.closest(".instrument[data-target]");
      if (instrument) {
        const target = instrument.dataset.target;
        if (!target) return;

        event.preventDefault();
        history.replaceState(null, "", `#${target}`);
        openChamber(target);
        return;
      }

      const orbitLink = event.target.closest(".return-orbit");
      if (orbitLink) {
        handleReturnToOrbit();
        return;
      }

      const menuLink = event.target.closest(".cockpit-menu-panel a");
      if (menuLink) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const seat = event.target.closest(".lattice-gem-seat,[data-control-seat-id]");
      if (!seat) return;

      event.preventDefault();
      handleLatticeSeatToggle(seat);
    });

    window.addEventListener("hashchange", () => {
      const id = window.location.hash ? window.location.hash.slice(1) : "";
      if (id && id !== ORBIT_ID) openChamber(id);
      if (id === ORBIT_ID) handleReturnToOrbit();
    });
  }

  function openInitialHash() {
    const id = window.location.hash ? window.location.hash.slice(1) : "";
    if (id && id !== ORBIT_ID) openChamber(id, false);
  }

  function boot() {
    if (state.booted) return;
    state.booted = true;

    publishDatasets();
    ensureCurrentTimeReadout();
    updateCurrentTimeState();

    state.latticeGems = createLatticeGemRegistry();

    renderAllLatticeSystems();

    setText("[data-cockpit-phase]", "booting");
    setText("[data-cockpit-failure]", "none");
    setText("[data-cockpit-dexterion]", "mounting · 360 lattice gem instruments");
    setText("[data-control-cell-status]", "mounting · independent lattice seats");
    setText("[data-public-instrument-authority]", "Dexterion’s Lab");
    setText("[data-cockpit-dexterion-mode]", "360 lattice gem cockpit");
    setText("[data-cockpit-parent-match]", "active · parent-only renewal");
    setText("[data-cockpit-child-renewal]", "forbidden · existing child structure preserved");

    bindEvents();
    openInitialHash();
    publishLatticeGemStatus();
    startCurrentTimeHeartbeat();
    refreshCockpit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
