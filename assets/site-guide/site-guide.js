// TARGET FILE: /assets/site-guide/site-guide.js
// TNT FULL-FILE REPLACEMENT
// SITE_GUIDE_THREE_FILE_FOCUS_ANIMATION_JS_TNT_v1
//
// Owns:
// - GUIDE_FOCUS_CONTROLLER
// - page lens switching
// - feature activation
// - Open Blueprint controller action
// - Return to Orbit reset
// - focus lock
// - scroll-aware activation
// - blueprint room selection
// - category selection
// - route planner
// - 4x4 matrix selection
// - 16x16 diagnostic spectrum generation / selection
// - status globals
//
// Does not own:
// - HTML page content
// - CSS visual system
// - Map / Portal runtime
// - manor blueprint files
// - canvas
// - WebGL
// - GraphicBox
// - generated images

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "SITE_GUIDE_THREE_FILE_FOCUS_ANIMATION_TNT_v1";
  const STATUS_GLOBAL = "DGB_SITE_GUIDE_STATUS";
  const CONTROLLER_GLOBAL = "DGB_GUIDE_FOCUS_CONTROLLER";

  const SELECTORS = Object.freeze({
    guideOrbit: "#guide-orbit",
    lensButton: "[data-lens-button]",
    lensPanel: "[data-lens-panel]",
    featureGem: "[data-feature-gem]",
    featureDetail: "[data-feature-detail]",
    blueprintRoom: "[data-blueprint-room]",
    categoryButton: "[data-category-button]",
    categoryPanel: "[data-category-panel]",
    demoCard: "[data-demo-card]",
    matrixCell: "[data-matrix-cell]",
    spectrumRoot: ".spectrum-16x16",
    spectrumCell: "[data-spectrum-cell]",
    startSelect: "[data-start-select]",
    goalSelect: "[data-goal-select]",
    pathRail: "[data-path-rail]",
    planTitle: "[data-plan-title]",
    planCopy: "[data-plan-copy]",
    openBlueprint: "[data-open-blueprint]",
    returnToOrbit: "[data-return-to-orbit]"
  });

  const FEATURE_TARGETS = Object.freeze({
    estate: "#presentation-layer",
    gems: '[data-feature-detail="gems"]',
    categories: '[data-feature-detail="categories"]',
    return: '[data-feature-detail="return"]',
    portal: '[data-feature-detail="portal"]',
    blueprint: ".estate-blueprint"
  });

  const FEATURE_LENS = Object.freeze({
    estate: "presentation",
    gems: "presentation",
    categories: "presentation",
    return: "presentation",
    portal: "presentation",
    blueprint: "presentation",
    navigation: "navigation",
    diagnostics: "diagnostics",
    ledger: "ledger"
  });

  const BLUEPRINT_DEFAULT_ROOM = "atrium";

  const blueprintData = Object.freeze({
    compass: {
      title: "Compass Desk",
      copy: "Compass Desk is the front orientation position for the regular website.",
      list: ["Location: Front Orientation Desk", "Connects: Door, Main Hall, Law Library, The Lab", "Action: Open Compass"],
      href: "/",
      action: "Open Compass"
    },
    guide: {
      title: "Guide Desk",
      copy: "Guide Desk is the flex exhibit page for the estate’s design systems and construction narrative.",
      list: ["Location: Orientation Desk", "Connects: Compass Desk, The Lab, Law Library", "Action: Open Guide Desk"],
      href: "/site-guide/",
      action: "Open Guide Desk"
    },
    main: {
      title: "Main Hall",
      copy: "Main Hall stabilizes the public website before branching to products, laws, proof, or Mirrorland.",
      list: ["Location: Central House", "Connects: Compass Desk, Product Gallery, Law Library", "Action: Open Main Hall"],
      href: "/home/",
      action: "Open Main Hall"
    },
    atrium: {
      title: "Atrium",
      copy: "The Atrium is the Mirrorland entrance room. It frames the immersive estate threshold before the visitor moves deeper into Atlas Study, world rooms, or Frontier.",
      list: ["Location: Mirrorland Entrance Atrium", "Connects: Atlas Study, Frontier Workshop Yard, Compass Desk", "Action: Enter Atrium"],
      href: "/showroom/",
      action: "Enter Atrium"
    },
    atlas: {
      title: "Atlas Study",
      copy: "Atlas Study is the world-study chamber for planetary rooms, world context, and living environments.",
      list: ["Location: East / World Study", "Connects: ZIONTS Room, Audralia Conservatory, Hearth, H-Earth", "Action: Open Atlas Study"],
      href: "/showroom/globe/",
      action: "Open Atlas Study"
    },
    zionts: {
      title: "ZIONTS Room",
      copy: "ZIONTS Room, pronounced Zience, is the visitor-facing identity for the route currently served under the Earth path.",
      list: ["Location: Atlas Study", "Connects: Audralia Conservatory", "Action: Enter ZIONTS"],
      href: "/showroom/globe/earth/",
      action: "Enter ZIONTS"
    },
    audralia: {
      title: "Audralia Conservatory",
      copy: "Audralia Conservatory introduces the constructive living-world path inside Mirrorland.",
      list: ["Location: Atlas Study", "Connects: Audralia Worldroom, Control Cockpit, Frontier Workshop Yard", "Action: Enter Conservatory"],
      href: "/showroom/globe/audralia/",
      action: "Enter Conservatory"
    },
    worldroom: {
      title: "Audralia Worldroom",
      copy: "Audralia Worldroom gives a focused planet-body read without claiming the world is final.",
      list: ["Location: Audralia Conservatory", "Connects: Control Cockpit", "Action: Inspect Worldroom"],
      href: "/showroom/globe/audralia/planet/",
      action: "Inspect Worldroom"
    },
    cockpit: {
      title: "Control Cockpit",
      copy: "Control Cockpit is the instrument room for operating and inspecting Audralia’s disposition layer.",
      list: ["Location: Audralia Conservatory", "Connects: Audralia Worldroom, The Lab, Frontier", "Action: Open Cockpit"],
      href: "/showroom/globe/audralia/disposition/",
      action: "Open Cockpit"
    },
    frontier: {
      title: "Frontier Workshop Yard",
      copy: "Frontier Workshop Yard is the outdoor applied-systems yard where future systems are pressure-tested.",
      list: ["Location: West Grounds", "Connects: Audralia Conservatory, Law Library, The Lab", "Action: Enter Workshop Yard"],
      href: "/explore/frontier/",
      action: "Enter Workshop Yard"
    },
    product: {
      title: "Product Gallery",
      copy: "Product Gallery turns ideas into usable public value, offers, tools, and practical objects.",
      list: ["Location: Product Gallery", "Connects: Main Hall, Host Portrait, Frontier", "Action: Open Product Gallery"],
      href: "/products/",
      action: "Open Product Gallery"
    },
    lab: {
      title: "The Lab",
      copy: "The Lab is the estate’s measurement room for status, readiness, route truth, and proof.",
      list: ["Location: Measurement Lab", "Connects: Law Library, Frontier Workshop Yard, H-Earth Bench", "Action: Open The Lab"],
      href: "/gauges/",
      action: "Open The Lab"
    },
    law: {
      title: "Law Library",
      copy: "Law Library holds the rules, boundaries, and coherence constraints that prevent expansion without discipline.",
      list: ["Location: Law Library", "Connects: Council Room, The Lab, Frontier", "Action: Open Law Library"],
      href: "/laws/",
      action: "Open Law Library"
    }
  });

  const plans = Object.freeze({
    "new:orientation": {
      title: "Guide Desk → Compass Desk → Atrium",
      copy: "Start with Guide Desk, use Compass Desk for orientation, then enter Atrium when you are ready to cross into Mirrorland.",
      path: [["Guide Desk", "/site-guide/"], ["Compass Desk", "/"], ["Atrium", "/showroom/"]]
    },
    "new:worlds": {
      title: "Guide Desk → Atrium → Atlas Study",
      copy: "Read the construction narrative, enter the Atrium, then open Atlas Study for worlds, ZIONTS, Audralia, Hearth, and H-Earth.",
      path: [["Guide Desk", "/site-guide/"], ["Atrium", "/showroom/"], ["Atlas Study", "/showroom/globe/"]]
    },
    "new:proof": {
      title: "Guide Desk → Law Library → The Lab",
      copy: "Use Guide Desk for context, Law Library for boundaries, then The Lab for measurement and readiness.",
      path: [["Guide Desk", "/site-guide/"], ["Law Library", "/laws/"], ["The Lab", "/gauges/"]]
    },
    "new:frontier": {
      title: "Guide Desk → Atrium → Frontier Workshop Yard",
      copy: "Start with the guide, enter the estate through Atrium, then go to Frontier Workshop Yard for applied future systems.",
      path: [["Guide Desk", "/site-guide/"], ["Atrium", "/showroom/"], ["Frontier Workshop Yard", "/explore/frontier/"]]
    },
    "new:products": {
      title: "Guide Desk → Main Hall → Product Gallery",
      copy: "Use Guide Desk for the map of meaning, then move through the regular website toward usable public value.",
      path: [["Guide Desk", "/site-guide/"], ["Main Hall", "/home/"], ["Product Gallery", "/products/"]]
    },
    "mirrorland:orientation": {
      title: "Map / Portal → Main Menu → Compass Desk",
      copy: "When you are inside Mirrorland and need ordinary-site orientation, open Main Menu and exit to Compass Desk.",
      path: [["Map / Portal", "#guide-orbit"], ["Main Menu", "/"], ["Compass Desk", "/"]]
    },
    "mirrorland:worlds": {
      title: "Map / Portal → Mirrorland Doors → Atlas Study",
      copy: "Stay inside Mirrorland. Use Mirrorland Doors to move to Atlas Study and choose the world room you need.",
      path: [["Map / Portal", "#navigation-layer"], ["Mirrorland Doors", "/showroom/"], ["Atlas Study", "/showroom/globe/"]]
    },
    "mirrorland:proof": {
      title: "Map / Portal → Main Menu → The Lab",
      copy: "Proof and readiness are regular website support surfaces. Use Main Menu to exit Mirrorland and open The Lab.",
      path: [["Map / Portal", "#navigation-layer"], ["Main Menu", "/gauges/"], ["The Lab", "/gauges/"]]
    },
    "mirrorland:frontier": {
      title: "Mirrorland Doors → Frontier Workshop Yard",
      copy: "Frontier is Mirrorland-aligned. Use Mirrorland Doors to open the Workshop Yard.",
      path: [["Mirrorland Doors", "#guide-orbit"], ["Frontier Workshop Yard", "/explore/frontier/"]]
    },
    "mirrorland:products": {
      title: "Map / Portal → Main Menu → Product Gallery",
      copy: "Products are regular website rooms. Use Main Menu to exit Mirrorland and open Product Gallery.",
      path: [["Map / Portal", "#guide-orbit"], ["Main Menu", "/products/"], ["Product Gallery", "/products/"]]
    },
    "proof:orientation": {
      title: "The Lab → Guide Desk → Compass Desk",
      copy: "When proof creates too much detail, use Guide Desk for the construction narrative and Compass Desk for orientation.",
      path: [["The Lab", "/gauges/"], ["Guide Desk", "/site-guide/"], ["Compass Desk", "/"]]
    },
    "proof:worlds": {
      title: "The Lab → Atlas Study → Audralia",
      copy: "Use The Lab for measurement, then return to Atlas Study to read the world context.",
      path: [["The Lab", "/gauges/"], ["Atlas Study", "/showroom/globe/"], ["Audralia Conservatory", "/showroom/globe/audralia/"]]
    },
    "proof:proof": {
      title: "Law Library → The Lab",
      copy: "Law defines boundaries. The Lab measures readiness.",
      path: [["Law Library", "/laws/"], ["The Lab", "/gauges/"]]
    },
    "proof:frontier": {
      title: "Law Library → Frontier Workshop Yard → The Lab",
      copy: "Frontier ideas should remain bounded by Law and checked by The Lab.",
      path: [["Law Library", "/laws/"], ["Frontier Workshop Yard", "/explore/frontier/"], ["The Lab", "/gauges/"]]
    },
    "proof:products": {
      title: "The Lab → Product Gallery",
      copy: "Use proof to support usable public value, then move to Product Gallery.",
      path: [["The Lab", "/gauges/"], ["Product Gallery", "/products/"]]
    },
    "frontier:orientation": {
      title: "Frontier Workshop Yard → Guide Desk",
      copy: "When Frontier feels large, return to Guide Desk to understand how applied systems fit the estate.",
      path: [["Frontier Workshop Yard", "/explore/frontier/"], ["Guide Desk", "/site-guide/"]]
    },
    "frontier:worlds": {
      title: "Frontier Workshop Yard → Audralia Conservatory",
      copy: "Frontier systems connect back to Audralia as the constructive future-world context.",
      path: [["Frontier Workshop Yard", "/explore/frontier/"], ["Audralia Conservatory", "/showroom/globe/audralia/"]]
    },
    "frontier:proof": {
      title: "Frontier Workshop Yard → Law Library → The Lab",
      copy: "Applied systems should pass through boundary and proof.",
      path: [["Frontier Workshop Yard", "/explore/frontier/"], ["Law Library", "/laws/"], ["The Lab", "/gauges/"]]
    },
    "frontier:frontier": {
      title: "Frontier Workshop Yard → System Bench",
      copy: "Choose a bench: Fusion, Closed Water Systems, Wastewater Systems, Infrastructure, Lattice, Manual, Shimmer, Trajectory, Vision, or Urban.",
      path: [["Frontier Workshop Yard", "/explore/frontier/"], ["Fusion Bench", "/explore/frontier/energy/"], ["Closed Water Systems", "/explore/frontier/water/"]]
    },
    "frontier:products": {
      title: "Frontier Workshop Yard → Product Gallery",
      copy: "When an applied system becomes usable, it can move toward product value.",
      path: [["Frontier Workshop Yard", "/explore/frontier/"], ["Product Gallery", "/products/"]]
    }
  });

  const state = {
    activeLens: "presentation",
    activeFeature: "",
    activeSection: "",
    activeBlueprintRoom: BLUEPRINT_DEFAULT_ROOM,
    activeCategory: "presentation",
    activeDiagnosticCell: "",
    focusLocked: false,
    scrollFocusEnabled: true,
    lastAction: "boot",
    observer: null,
    abortController: null
  };

  function all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function one(selector, root = document) {
    return root.querySelector(selector);
  }

  function setBool(node, name, value) {
    if (!node) return;
    node.setAttribute(name, value ? "true" : "false");
  }

  function setActive(node, active) {
    setBool(node, "data-active", active);
  }

  function setMuted(node, muted) {
    setBool(node, "data-muted", muted);
  }

  function scrollToTarget(target, block = "start") {
    const node = typeof target === "string" ? one(target) : target;
    if (!node) return;

    node.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block,
      inline: "nearest"
    });
  }

  function prefersReducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function setExclusive(nodes, activeNode, options = {}) {
    const { muteSiblings = true } = options;

    nodes.forEach((node) => {
      const active = node === activeNode;
      setActive(node, active);
      setMuted(node, muteSiblings && !active);
    });
  }

  function clearCollection(selector) {
    all(selector).forEach((node) => {
      setActive(node, false);
      setMuted(node, false);
    });
  }

  function switchLens(lens, options = {}) {
    const clean = lens === "navigation" || lens === "diagnostics" || lens === "ledger"
      ? lens
      : "presentation";

    state.activeLens = clean;
    state.lastAction = `switch-lens:${clean}`;

    all(SELECTORS.lensButton).forEach((button) => {
      const active = button.getAttribute("data-lens-button") === clean;
      setActive(button, active);
      setMuted(button, false);
    });

    all(SELECTORS.lensPanel).forEach((panel) => {
      const active = panel.getAttribute("data-lens-panel") === clean;
      setActive(panel, active);
      panel.hidden = !active;
    });

    if (options.scroll) {
      const target = clean === "presentation"
        ? "#presentation-layer"
        : clean === "navigation"
          ? "#navigation-layer"
          : clean === "diagnostics"
            ? "#diagnostics-layer"
            : "#construction-ledger";

      scrollToTarget(target);
    }

    publishStatus();
  }

  function activateFeature(feature, options = {}) {
    if (state.focusLocked && state.activeFeature && state.activeFeature !== feature && !options.force) {
      pulseGuideOrbit();
      return;
    }

    const clean = String(feature || "").trim();
    const gem = one(`${SELECTORS.featureGem}[data-feature="${CSS.escape(clean)}"]`);
    const lens = FEATURE_LENS[clean] || "presentation";
    const target = FEATURE_TARGETS[clean] || SELECTORS.guideOrbit;

    if (!gem) return;

    state.activeFeature = clean;
    state.focusLocked = options.lock !== false;
    state.scrollFocusEnabled = false;
    state.lastAction = `activate-feature:${clean}`;

    switchLens(lens);

    setExclusive(all(SELECTORS.featureGem), gem);

    all(SELECTORS.featureDetail).forEach((detail) => {
      const active = detail.getAttribute("data-feature-detail") === clean;
      setActive(detail, active);
      detail.hidden = !active;
    });

    if (clean === "blueprint") {
      activateBlueprintRoom(state.activeBlueprintRoom || BLUEPRINT_DEFAULT_ROOM, { mute: true });
    }

    if (options.scroll !== false) {
      window.setTimeout(() => scrollToTarget(target), 40);
    }

    publishStatus();
  }

  function activateSection(sectionKey, options = {}) {
    if (state.focusLocked && !options.force) return;

    const clean = String(sectionKey || "").trim();
    if (!clean) return;

    state.activeSection = clean;
    state.lastAction = `scroll-section:${clean}`;

    all("[data-focus-section]").forEach((section) => {
      const active = section.getAttribute("data-focus-section") === clean;
      setActive(section, active);
      setMuted(section, !active);
      setBool(section, "data-scroll-active", active);
    });

    const feature = clean === "blueprint" ? "blueprint" : clean;
    const gem = one(`${SELECTORS.featureGem}[data-feature="${CSS.escape(feature)}"]`);

    if (gem) {
      all(SELECTORS.featureGem).forEach((node) => {
        const active = node === gem;
        setActive(node, active);
        setMuted(node, !active);
      });
    }

    publishStatus();
  }

  function openBlueprint(options = {}) {
    state.focusLocked = true;
    state.scrollFocusEnabled = false;
    state.activeFeature = "blueprint";
    state.lastAction = "open-blueprint";

    switchLens("presentation");
    activateFeature("blueprint", { force: true, scroll: false, lock: true });
    activateBlueprintRoom(options.room || BLUEPRINT_DEFAULT_ROOM, { mute: true });

    window.setTimeout(() => {
      scrollToTarget(".estate-blueprint", "center");
    }, 60);

    publishStatus();
  }

  function activateBlueprintRoom(roomKey, options = {}) {
    const clean = blueprintData[roomKey] ? roomKey : BLUEPRINT_DEFAULT_ROOM;
    const room = one(`${SELECTORS.blueprintRoom}[data-room="${CSS.escape(clean)}"]`);

    if (!room) return;

    state.activeBlueprintRoom = clean;
    state.lastAction = `blueprint-room:${clean}`;

    setExclusive(all(SELECTORS.blueprintRoom), room, { muteSiblings: options.mute !== false });
    updateBlueprintDetail(clean);
    publishStatus();
  }

  function updateBlueprintDetail(roomKey) {
    const data = blueprintData[roomKey] || blueprintData[BLUEPRINT_DEFAULT_ROOM];

    const title = one("[data-blueprint-title]");
    const copy = one("[data-blueprint-copy]");
    const list = one("[data-blueprint-list]");
    const action = one("[data-blueprint-action]");

    if (title) title.textContent = data.title;
    if (copy) copy.textContent = data.copy;

    if (list) {
      list.innerHTML = data.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }

    if (action) {
      action.textContent = data.action;
      action.setAttribute("href", data.href);
    }
  }

  function activateCategory(categoryKey) {
    const clean = String(categoryKey || "presentation").trim();
    const button = one(`${SELECTORS.categoryButton}[data-category="${CSS.escape(clean)}"]`);

    if (!button) return;

    state.activeCategory = clean;
    state.lastAction = `category:${clean}`;

    setExclusive(all(SELECTORS.categoryButton), button);

    all(SELECTORS.categoryPanel).forEach((panel) => {
      const active = panel.getAttribute("data-category-panel") === clean;
      setActive(panel, active);
      panel.hidden = !active;
    });

    publishStatus();
  }

  function activateCardWithinGroup(card) {
    const group = card.closest("[data-select-group]");
    const cards = group ? all(SELECTORS.demoCard, group) : all(SELECTORS.demoCard);

    setExclusive(cards, card);

    state.lastAction = `demo-card:${card.textContent.trim().slice(0, 48)}`;
    publishStatus();
  }

  function activateMatrixCell(cell) {
    setExclusive(all(SELECTORS.matrixCell), cell);

    state.activeDiagnosticCell = cell.textContent.trim();
    state.lastAction = `matrix:${state.activeDiagnosticCell}`;

    publishStatus();
  }

  function activateSpectrumCell(cell) {
    const cells = all(SELECTORS.spectrumCell);
    setExclusive(cells, cell);

    const index = cell.getAttribute("data-spectrum-cell") || "";
    state.activeDiagnosticCell = `spectrum-${index}`;
    state.lastAction = `spectrum:${index}`;

    const readout = one("[data-spectrum-readout]");
    if (readout) readout.textContent = `Selected state: ${index} of 256.`;

    publishStatus();
  }

  function returnToOrbit(options = {}) {
    state.activeFeature = "";
    state.activeSection = "";
    state.activeDiagnosticCell = "";
    state.focusLocked = false;
    state.scrollFocusEnabled = true;
    state.lastAction = "return-to-orbit";

    clearCollection(SELECTORS.featureGem);
    clearCollection(SELECTORS.demoCard);
    clearCollection(SELECTORS.matrixCell);
    clearCollection(SELECTORS.spectrumCell);
    clearCollection("[data-focus-section]");

    all(SELECTORS.featureDetail).forEach((detail) => {
      setActive(detail, false);
      setMuted(detail, false);
      detail.hidden = true;
    });

    all(SELECTORS.blueprintRoom).forEach((room) => {
      setActive(room, false);
      setMuted(room, false);
    });

    all(SELECTORS.lensButton).forEach((button) => {
      setMuted(button, false);
    });

    activateCategory("presentation");
    switchLens("presentation");

    if (options.keepBlueprintDefault !== false) {
      activateBlueprintRoom(BLUEPRINT_DEFAULT_ROOM, { mute: false });
    }

    window.setTimeout(() => scrollToTarget(SELECTORS.guideOrbit, "start"), 40);
    publishStatus();
  }

  function pulseGuideOrbit() {
    const orbit = one(SELECTORS.guideOrbit);
    if (!orbit) return;

    orbit.setAttribute("data-focus-blocked", "true");

    window.setTimeout(() => {
      orbit.removeAttribute("data-focus-blocked");
    }, 650);
  }

  function buildSpectrum() {
    const spectrum = one(SELECTORS.spectrumRoot);
    if (!spectrum) return;

    spectrum.innerHTML = "";

    for (let index = 1; index <= 256; index += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "spectrum-cell";
      cell.setAttribute("aria-label", `Diagnostic state ${index}`);
      cell.setAttribute("data-spectrum-cell", String(index));
      cell.style.setProperty("--i", String(index));
      spectrum.appendChild(cell);
    }
  }

  function renderPlan() {
    const start = one(SELECTORS.startSelect);
    const goal = one(SELECTORS.goalSelect);
    const title = one(SELECTORS.planTitle);
    const copy = one(SELECTORS.planCopy);
    const rail = one(SELECTORS.pathRail);

    if (!start || !goal || !title || !copy || !rail) return;

    const key = `${start.value}:${goal.value}`;
    const plan = plans[key] || plans["new:orientation"];

    title.textContent = plan.title;
    copy.textContent = plan.copy;

    rail.innerHTML = plan.path
      .map(([label, href]) => `<a class="path-step" href="${escapeAttribute(href)}">${escapeHtml(label)}</a>`)
      .join("");

    state.lastAction = `route-plan:${key}`;
    publishStatus();
  }

  function setupScrollObserver() {
    if (!("IntersectionObserver" in window)) return;

    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }

    const sections = all("[data-focus-section]");

    if (!sections.length) return;

    state.observer = new IntersectionObserver((entries) => {
      if (state.focusLocked || !state.scrollFocusEnabled) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const key = visible.target.getAttribute("data-focus-section");
      if (key) activateSection(key);
    }, {
      root: null,
      threshold: [0.35, 0.5, 0.68],
      rootMargin: "-12% 0px -35% 0px"
    });

    sections.forEach((section) => state.observer.observe(section));
  }

  function attachEvents() {
    const signal = state.abortController.signal;

    all(SELECTORS.lensButton).forEach((button) => {
      button.addEventListener("click", () => {
        const lens = button.getAttribute("data-lens-button") || "presentation";
        state.focusLocked = false;
        state.scrollFocusEnabled = true;
        switchLens(lens, { scroll: true });
      }, { signal });
    });

    all(SELECTORS.featureGem).forEach((gem) => {
      gem.addEventListener("click", () => {
        const feature = gem.getAttribute("data-feature") || "";
        activateFeature(feature, { lock: true });
      }, { signal });
    });

    all(SELECTORS.blueprintRoom).forEach((room) => {
      room.addEventListener("click", () => {
        activateBlueprintRoom(room.getAttribute("data-room") || BLUEPRINT_DEFAULT_ROOM, { mute: true });
      }, { signal });
    });

    all(SELECTORS.categoryButton).forEach((button) => {
      button.addEventListener("click", () => {
        activateCategory(button.getAttribute("data-category") || "presentation");
      }, { signal });
    });

    all(SELECTORS.demoCard).forEach((card) => {
      card.addEventListener("click", () => activateCardWithinGroup(card), { signal });
    });

    all(SELECTORS.matrixCell).forEach((cell) => {
      cell.addEventListener("click", () => activateMatrixCell(cell), { signal });
    });

    document.addEventListener("click", (event) => {
      const openBlueprintTrigger = event.target.closest(`${SELECTORS.openBlueprint}, a[href="#presentation-layer"]`);
      if (openBlueprintTrigger && isOpenBlueprintTrigger(openBlueprintTrigger)) {
        event.preventDefault();
        openBlueprint();
        return;
      }

      const returnTrigger = event.target.closest(`${SELECTORS.returnToOrbit}, a[href="#guide-orbit"]`);
      if (returnTrigger) {
        event.preventDefault();
        returnToOrbit();
        return;
      }

      const spectrumCell = event.target.closest(SELECTORS.spectrumCell);
      if (spectrumCell) {
        activateSpectrumCell(spectrumCell);
      }
    }, { signal });

    const start = one(SELECTORS.startSelect);
    const goal = one(SELECTORS.goalSelect);

    if (start) start.addEventListener("change", renderPlan, { signal });
    if (goal) goal.addEventListener("change", renderPlan, { signal });
  }

  function isOpenBlueprintTrigger(node) {
    if (!node) return false;
    if (node.matches(SELECTORS.openBlueprint)) return true;

    const text = String(node.textContent || "").trim().toLowerCase();
    if (text.includes("open blueprint")) return true;
    if (text.includes("blueprint") && node.getAttribute("href") === "#presentation-layer") return true;

    return false;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replaceAll("`", "&#96;");
  }

  function publishStatus() {
    const payload = {
      contract: CONTRACT,
      route: "/site-guide/",
      guideDesk: true,
      threeFileArchitecture: true,
      focusController: true,
      activeLens: state.activeLens,
      activeFeature: state.activeFeature,
      activeSection: state.activeSection,
      activeBlueprintRoom: state.activeBlueprintRoom,
      activeCategory: state.activeCategory,
      activeDiagnosticCell: state.activeDiagnosticCell,
      focusLocked: state.focusLocked,
      scrollFocusEnabled: state.scrollFocusEnabled,
      openBlueprintController: true,
      returnToOrbitReset: true,
      scrollActivation: Boolean(state.observer),
      featureClickScrollsToTarget: true,
      universalSelectedFocusBehavior: true,
      tabbedExhibit: true,
      presentationLayer: true,
      navigationLayer: true,
      underHoodDiagnosticsLayer: true,
      constructionLedger: true,
      estateBlueprintDemo: true,
      featureOrbitDemo: true,
      returnToOrbitDemo: true,
      quadrupedicQuadrilateralTraversal: "structural_core_only",
      matrix4x4: true,
      spectrum16x16: true,
      diagnosticScope256: true,
      mobileFirstNativeBuild: true,
      projectBeganLateJanuary2026: true,
      generatedImage: false,
      graphicBox: false,
      canvas: false,
      webgl: false,
      lastAction: state.lastAction,
      updatedAt: new Date().toISOString()
    };

    window[STATUS_GLOBAL] = payload;

    try {
      document.documentElement.dataset.siteGuideContract = CONTRACT;
      document.documentElement.dataset.siteGuideFocusController = "true";
      document.documentElement.dataset.siteGuideActiveLens = state.activeLens;
      document.documentElement.dataset.siteGuideActiveFeature = state.activeFeature;
      document.documentElement.dataset.siteGuideFocusLocked = String(state.focusLocked);
      document.documentElement.dataset.siteGuideReturnToOrbitReset = "true";
      document.documentElement.dataset.siteGuideScrollActivation = String(Boolean(state.observer));
      document.documentElement.dataset.siteGuideOpenBlueprintController = "true";
      document.documentElement.dataset.siteGuideDiagnosticScope256 = "true";
    } catch (_error) {}

    return payload;
  }

  function stop() {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }

    if (state.abortController) {
      try {
        state.abortController.abort();
      } catch (_error) {}
    }

    state.abortController = null;
  }

  function exposeApi() {
    const api = {
      contract: CONTRACT,
      state,
      switchLens,
      activateFeature,
      activateSection,
      openBlueprint,
      returnToOrbit,
      activateBlueprintRoom,
      activateCategory,
      renderPlan,
      publishStatus,
      stop
    };

    window[CONTROLLER_GLOBAL] = api;
  }

  function mount() {
    const prior = window[CONTROLLER_GLOBAL];

    if (prior && prior.contract !== CONTRACT && typeof prior.stop === "function") {
      try {
        prior.stop();
      } catch (_error) {}
    }

    stop();

    state.abortController = new AbortController();
    state.activeLens = "presentation";
    state.activeFeature = "";
    state.activeSection = "";
    state.activeBlueprintRoom = BLUEPRINT_DEFAULT_ROOM;
    state.activeCategory = "presentation";
    state.activeDiagnosticCell = "";
    state.focusLocked = false;
    state.scrollFocusEnabled = true;
    state.lastAction = "mounted";

    buildSpectrum();
    exposeApi();
    attachEvents();

    switchLens("presentation");
    activateCategory("presentation");
    activateBlueprintRoom(BLUEPRINT_DEFAULT_ROOM, { mute: false });
    renderPlan();
    setupScrollObserver();
    publishStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
