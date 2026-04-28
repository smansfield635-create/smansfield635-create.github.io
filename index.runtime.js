(function () {
  "use strict";

  const DOLL_LAYERS = [
    "DOLL_1_COMPASS",
    "DOLL_2_ESTATE",
    "DOLL_3_TRUNK_AND_PRIMARY_LIMBS",
    "DOLL_4_CANOPIES",
    "DOLL_5_BRANCH_SEATS",
    "DOLL_6_TERMINAL_NODES",
    "DOLL_7_FRUIT_AND_WILDLIFE_DETAIL"
  ];

  const DOLL_LABELS = {
    DOLL_1_COMPASS: "Compass",
    DOLL_2_ESTATE: "Estate",
    DOLL_3_TRUNK_AND_PRIMARY_LIMBS: "Trunk + 4",
    DOLL_4_CANOPIES: "16 Canopies",
    DOLL_5_BRANCH_SEATS: "64 Branch Seats",
    DOLL_6_TERMINAL_NODES: "256 Terminals",
    DOLL_7_FRUIT_AND_WILDLIFE_DETAIL: "Fruit + Wildlife"
  };

  const MODES = ["flat", "round", "globe"];
  const PANEL_STATES = ["collapsed", "open", "structure", "inspect", "receipt"];

  const state = {
    mode: "flat",
    controlPanelState: "collapsed",
    dollLayer: "DOLL_1_COMPASS",
    canopyIndex: 1,
    branchSeatIndex: 1,
    terminalIndex: 1,
    treeZone: "roots",
    wildlifeFocus: "none",
    generationReadiness: "GEN_1_3D_BASELINE",
    coreExperienceHold: true,
    lastUserAction: "init"
  };

  function clampNumber(value, min, max, fallback) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
  }

  function safeOption(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function getTree() {
    return window.DGBTreeOfLife256 || null;
  }

  function getRenderRoot() {
    return document.getElementById("index-render-root");
  }

  function getPanel() {
    return document.getElementById("index-control-panel");
  }

  function getToggle() {
    return document.getElementById("controlPanelToggle");
  }

  function syncStateMarkers() {
    document.documentElement.dataset.currentMode = state.mode;
    document.documentElement.dataset.currentDollLayer = state.dollLayer;
    document.documentElement.dataset.generationReadiness = state.generationReadiness;
    document.documentElement.dataset.coreExperienceHold = state.coreExperienceHold ? "true" : "false";

    document.body.dataset.activeMode = state.mode;
    document.body.dataset.controlPanelState = state.controlPanelState;
    document.body.dataset.activeDollLayer = state.dollLayer;
    document.body.dataset.zoomLevel = state.dollLayer;
    document.body.dataset.treeZone = state.treeZone;
    document.body.dataset.wildlifeFocus = state.wildlifeFocus;
    document.body.dataset.generationReadiness = state.generationReadiness;
    document.body.dataset.coreExperienceHold = state.coreExperienceHold ? "true" : "false";
    document.body.dataset.runtimeStatus = "active";
    document.body.dataset.lastUserAction = state.lastUserAction;
    document.body.dataset.routesChanged = "false";
    document.body.dataset.gaugesLogicTouched = "false";
    document.body.dataset.fakeHealthClaim = "false";

    const toggle = getToggle();
    if (toggle) {
      const open = state.controlPanelState !== "collapsed";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close Control Panel" : "Open Control Panel";
    }
  }

  function renderScene() {
    const root = getRenderRoot();
    if (!root || !window.DGBIndexRender || typeof window.DGBIndexRender.render !== "function") {
      document.body.dataset.runtimeStatus = "render-unavailable";
      return;
    }

    window.DGBIndexRender.render(state, root);
  }

  function makeButton(label, patch, active) {
    const button = document.createElement("button");
    button.className = active ? "panel-button active" : "panel-button";
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.addEventListener("click", () => setState(patch));
    return button;
  }

  function makeSection(title, children) {
    const section = document.createElement("section");
    section.className = "panel-section";

    const heading = document.createElement("h3");
    heading.textContent = title;
    section.appendChild(heading);

    children.forEach((child) => section.appendChild(child));
    return section;
  }

  function makeRow(children) {
    const row = document.createElement("div");
    row.className = "panel-row";
    children.forEach((child) => row.appendChild(child));
    return row;
  }

  function makeSelect(label, value, options, onChange) {
    const wrap = document.createElement("label");
    wrap.className = "panel-select-label";

    const span = document.createElement("span");
    span.className = "sr-only";
    span.textContent = label;

    const select = document.createElement("select");
    select.className = "panel-select";
    select.value = String(value);
    select.setAttribute("aria-label", label);

    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = String(option.value);
      opt.textContent = option.label;
      select.appendChild(opt);
    });

    select.addEventListener("change", () => onChange(select.value));

    wrap.appendChild(span);
    wrap.appendChild(select);
    return wrap;
  }

  function getBranchOptions(tree, canopyIndex) {
    const branches = tree ? tree.getBranchSeats().filter((branch) => branch.canopyCluster === canopyIndex) : [];
    return branches.map((branch) => ({
      value: branch.index,
      label: `${branch.id} · canopy ${String(branch.canopyCluster).padStart(2, "0")}`
    }));
  }

  function getTerminalOptions(tree, branchSeatIndex) {
    const terminals = tree ? tree.getTerminalNodes().filter((node) => node.branchSeat === branchSeatIndex) : [];
    return terminals.map((node) => ({
      value: node.index,
      label: `${node.id} · ${node.terminalType}${node.fruit && node.fruit.active ? " · fruit" : ""}`
    }));
  }

  function renderPanel() {
    const panel = getPanel();
    const tree = getTree();

    if (!panel) return;

    panel.replaceChildren();

    const inner = document.createElement("div");
    inner.className = "control-panel-inner";

    const validation = tree && tree.getValidation ? tree.getValidation() : null;
    const counts = tree && tree.getCounts ? tree.getCounts() : {
      trunks: 1,
      primaryLimbs: 4,
      canopyClusters: 16,
      branchSeats: 64,
      terminalNodes: 256
    };

    inner.appendChild(makeSection("World Mode", [
      makeRow(MODES.map((mode) =>
        makeButton(mode.toUpperCase(), {
          mode,
          dollLayer: mode === "round" ? "DOLL_2_ESTATE" : "DOLL_1_COMPASS",
          lastUserAction: `mode:${mode}`
        }, state.mode === mode)
      ))
    ]));

    inner.appendChild(makeSection("Russian Doll Layer", [
      makeRow(DOLL_LAYERS.map((layer) =>
        makeButton(DOLL_LABELS[layer], {
          mode: "round",
          dollLayer: layer,
          controlPanelState: "structure",
          lastUserAction: `doll:${layer}`
        }, state.dollLayer === layer)
      ))
    ]));

    const canopyOptions = Array.from({ length: 16 }, (_, index) => ({
      value: index + 1,
      label: `CANOPY_${String(index + 1).padStart(2, "0")}`
    }));

    inner.appendChild(makeSection("Tree Navigation", [
      makeSelect("Select canopy", state.canopyIndex, canopyOptions, (value) => {
        const canopyIndex = clampNumber(value, 1, 16, 1);
        const branchSeatIndex = ((canopyIndex - 1) * 4) + 1;
        const terminalIndex = ((branchSeatIndex - 1) * 4) + 1;

        setState({
          mode: "round",
          dollLayer: "DOLL_4_CANOPIES",
          canopyIndex,
          branchSeatIndex,
          terminalIndex,
          controlPanelState: "structure",
          lastUserAction: `select-canopy:${canopyIndex}`
        });
      }),

      makeSelect("Select branch seat", state.branchSeatIndex, getBranchOptions(tree, state.canopyIndex), (value) => {
        const branchSeatIndex = clampNumber(value, 1, 64, 1);
        const terminalIndex = ((branchSeatIndex - 1) * 4) + 1;

        setState({
          mode: "round",
          dollLayer: "DOLL_5_BRANCH_SEATS",
          branchSeatIndex,
          terminalIndex,
          controlPanelState: "structure",
          lastUserAction: `select-branch:${branchSeatIndex}`
        });
      }),

      makeSelect("Select terminal node", state.terminalIndex, getTerminalOptions(tree, state.branchSeatIndex), (value) => {
        const terminalIndex = clampNumber(value, 1, 256, 1);

        setState({
          mode: "round",
          dollLayer: "DOLL_7_FRUIT_AND_WILDLIFE_DETAIL",
          terminalIndex,
          controlPanelState: "inspect",
          lastUserAction: `select-terminal:${terminalIndex}`
        });
      })
    ]));

    inner.appendChild(makeSection("256 Structure Receipt", [
      makeRow([
        makeButton("Structure", { controlPanelState: "structure", lastUserAction: "panel:structure" }, state.controlPanelState === "structure"),
        makeButton("Inspect", { controlPanelState: "inspect", dollLayer: "DOLL_7_FRUIT_AND_WILDLIFE_DETAIL", lastUserAction: "panel:inspect" }, state.controlPanelState === "inspect"),
        makeButton("Receipt", { controlPanelState: "receipt", lastUserAction: "panel:receipt" }, state.controlPanelState === "receipt")
      ]),
      (function () {
        const pre = document.createElement("pre");
        pre.className = "panel-receipt";
        pre.textContent = [
          `Tree file: /index.tree.js`,
          `Validation: ${validation && validation.valid ? "PASS" : "PENDING"}`,
          `Trunk: ${counts.trunks}`,
          `Primary limbs: ${counts.primaryLimbs}`,
          `Canopies: ${counts.canopyClusters}`,
          `Branch seats: ${counts.branchSeats}`,
          `Terminal nodes: ${counts.terminalNodes}`,
          `Fruit: terminal-node layer active`,
          `Species: oak-bound / fruit-layer-active`,
          `Generation: ${state.generationReadiness}`,
          `Core experience hold: ${state.coreExperienceHold ? "TRUE" : "FALSE"}`
        ].join("\n");
        return pre;
      })()
    ]));

    inner.appendChild(makeSection("Proof Return", [
      makeRow([
        (function () {
          const a = document.createElement("a");
          a.className = "panel-button";
          a.href = "/gauges/";
          a.textContent = "Run Gauges";
          return a;
        })(),
        (function () {
          const a = document.createElement("a");
          a.className = "panel-button";
          a.href = "/";
          a.textContent = "Compass";
          return a;
        })()
      ])
    ]));

    panel.appendChild(inner);
  }

  function setState(patch) {
    const next = patch || {};

    if (Object.prototype.hasOwnProperty.call(next, "mode")) {
      state.mode = safeOption(next.mode, MODES, "flat");
    }

    if (Object.prototype.hasOwnProperty.call(next, "controlPanelState")) {
      state.controlPanelState = safeOption(next.controlPanelState, PANEL_STATES, "collapsed");
    }

    if (Object.prototype.hasOwnProperty.call(next, "dollLayer")) {
      state.dollLayer = safeOption(next.dollLayer, DOLL_LAYERS, "DOLL_1_COMPASS");
    }

    if (Object.prototype.hasOwnProperty.call(next, "canopyIndex")) {
      state.canopyIndex = clampNumber(next.canopyIndex, 1, 16, 1);
    }

    if (Object.prototype.hasOwnProperty.call(next, "branchSeatIndex")) {
      state.branchSeatIndex = clampNumber(next.branchSeatIndex, 1, 64, 1);
    }

    if (Object.prototype.hasOwnProperty.call(next, "terminalIndex")) {
      state.terminalIndex = clampNumber(next.terminalIndex, 1, 256, 1);
    }

    if (Object.prototype.hasOwnProperty.call(next, "treeZone")) {
      state.treeZone = next.treeZone || "roots";
    }

    if (Object.prototype.hasOwnProperty.call(next, "wildlifeFocus")) {
      state.wildlifeFocus = next.wildlifeFocus || "none";
    }

    if (Object.prototype.hasOwnProperty.call(next, "lastUserAction")) {
      state.lastUserAction = next.lastUserAction || "unknown";
    }

    if (state.mode !== "round") {
      state.dollLayer = "DOLL_1_COMPASS";
    }

    syncStateMarkers();
    renderScene();
    renderPanel();
  }

  function bindStaticControls() {
    const toggle = getToggle();

    if (toggle) {
      toggle.addEventListener("click", () => {
        setState({
          controlPanelState: state.controlPanelState === "collapsed" ? "open" : "collapsed",
          lastUserAction: state.controlPanelState === "collapsed" ? "panel:open" : "panel:collapse"
        });
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "Escape") {
        setState({ controlPanelState: "collapsed", lastUserAction: "keyboard:escape-panel" });
      }

      if (state.mode === "round" && event.key === "ArrowRight") {
        const current = DOLL_LAYERS.indexOf(state.dollLayer);
        const next = DOLL_LAYERS[Math.min(current + 1, DOLL_LAYERS.length - 1)];
        setState({ dollLayer: next, lastUserAction: "keyboard:doll-next" });
      }

      if (state.mode === "round" && event.key === "ArrowLeft") {
        const current = DOLL_LAYERS.indexOf(state.dollLayer);
        const next = DOLL_LAYERS[Math.max(current - 1, 0)];
        setState({ dollLayer: next, lastUserAction: "keyboard:doll-prev" });
      }
    });
  }

  function init() {
    bindStaticControls();
    setState({
      mode: "flat",
      controlPanelState: "collapsed",
      dollLayer: "DOLL_1_COMPASS",
      canopyIndex: 1,
      branchSeatIndex: 1,
      terminalIndex: 1,
      lastUserAction: "init:flat-default"
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DGBIndexRuntime = Object.freeze({
    setState,
    readState() {
      return Object.assign({}, state);
    }
  });
})();
