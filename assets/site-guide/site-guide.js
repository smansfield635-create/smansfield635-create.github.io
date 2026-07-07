// TARGET FILE: /assets/site-guide/site-guide.js
// COMPLETE REPLACEMENT
// SITE GUIDE DEPTH INTERACTION CONTROLLER
// SITE_GUIDE_DEPTH_INTERACTION_CONTROLLER_TNT_v2

(() => {
  "use strict";

  const CONTRACT =
    "SITE_GUIDE_DEPTH_INTERACTION_CONTROLLER_TNT_v2";

  const ROUTE =
    "/site-guide/";

  const BLUEPRINT_ROOMS = {
    compass: {
      kicker: "Orientation Room",
      title: "Compass Desk",
      copy:
        "Compass Desk re-centers the visitor before deeper movement. Use it before moving into rooms, products, proof, or story layers.",
      list: [
        "Purpose: orientation before movement",
        "Connects to: Guide Desk, Main Hall, Law Library",
        "Next move: open Compass or preview another room"
      ],
      actionLabel: "Open Compass",
      actionHref: "/",
      jumpTarget: "#jump-compass"
    },

    guide: {
      kicker: "Guide Room",
      title: "Guide Desk",
      copy:
        "Guide Desk demonstrates the estate’s controls, maps, rooms, and movement patterns.",
      list: [
        "Purpose: explain the website’s movement system",
        "Connects to: Blueprint, Guide Orbit, Route Choice Board",
        "Next move: stay here or preview another room"
      ],
      actionLabel: "Open Guide Desk",
      actionHref: "/site-guide/",
      jumpTarget: "#jump-guide"
    },

    main: {
      kicker: "Main Menu Room",
      title: "Main Hall",
      copy:
        "Main Hall keeps the ordinary public website path clear.",
      list: [
        "Purpose: regular public-site center",
        "Connects to: Compass, Products, Laws, Guide Desk",
        "Next move: open Main Hall or preview another room"
      ],
      actionLabel: "Open Main Hall",
      actionHref: "/home/",
      jumpTarget: "#jump-main"
    },

    atrium: {
      kicker: "Entry Room",
      title: "Atrium",
      copy:
        "Atrium is the entrance into the Mirrorland side of the estate. It is the first step from the regular website into the immersive experience.",
      list: [
        "Purpose: enter the Mirrorland side of the estate",
        "Connects to: Atlas Study, Frontier Workshop Yard, Compass Desk",
        "Next move: enter Atrium or preview another room"
      ],
      actionLabel: "Enter Atrium",
      actionHref: "/showroom/",
      jumpTarget: "#jump-atrium"
    },

    atlas: {
      kicker: "Worlds Room",
      title: "Atlas Study",
      copy:
        "Atlas Study gathers the world-facing routes.",
      list: [
        "Purpose: open the world-study layer",
        "Connects to: ZIONTS, Audralia, Control Cockpit",
        "Next move: open Atlas Study or preview a world room"
      ],
      actionLabel: "Open Atlas Study",
      actionHref: "/showroom/globe/",
      jumpTarget: "#jump-atlas"
    },

    zionts: {
      kicker: "ZIONTS Room",
      title: "ZIONTS Room",
      copy:
        "ZIONTS is the room identity for the path currently served under Earth.",
      list: [
        "Purpose: reference-world side of Atlas Study",
        "Pronunciation: Zience",
        "Next move: enter ZIONTS or preview another world room"
      ],
      actionLabel: "Enter ZIONTS",
      actionHref: "/showroom/globe/earth/",
      jumpTarget: "#jump-zionts"
    },

    audralia: {
      kicker: "World Room",
      title: "Audralia Conservatory",
      copy:
        "Audralia Conservatory introduces the forming world before its deeper rooms and systems.",
      list: [
        "Purpose: introduce the constructive living-world path",
        "Connects to: Audralia Worldroom and Control Cockpit",
        "Next move: enter Conservatory or preview another room"
      ],
      actionLabel: "Enter Conservatory",
      actionHref: "/showroom/globe/audralia/",
      jumpTarget: "#jump-audralia"
    },

    worldroom: {
      kicker: "World Body Room",
      title: "Audralia Worldroom",
      copy:
        "Audralia Worldroom gives a focused look at the visible world-body.",
      list: [
        "Purpose: inspect the visible world surface path",
        "Connects to: Audralia Conservatory and Control Cockpit",
        "Next move: inspect Worldroom or preview another room"
      ],
      actionLabel: "Inspect Worldroom",
      actionHref: "/showroom/globe/audralia/planet/",
      jumpTarget: "#jump-worldroom"
    },

    cockpit: {
      kicker: "Control Room",
      title: "Control Cockpit",
      copy:
        "Control Cockpit holds Audralia’s readouts, controls, and instrument-facing views.",
      list: [
        "Purpose: inspect the control-room side of the world",
        "Connects to: Audralia, gauges, disposition, bridge readouts",
        "Next move: open Cockpit or preview another room"
      ],
      actionLabel: "Open Cockpit",
      actionHref: "/showroom/globe/audralia/disposition/",
      jumpTarget: "#jump-cockpit"
    },

    frontier: {
      kicker: "Workshop Room",
      title: "Frontier Workshop Yard",
      copy:
        "Frontier Workshop Yard is the applied systems area.",
      list: [
        "Purpose: inspect applied future systems",
        "Connects to: energy, water, infrastructure, manuals",
        "Next move: enter Workshop Yard or preview another room"
      ],
      actionLabel: "Enter Workshop Yard",
      actionHref: "/explore/frontier/",
      jumpTarget: "#jump-frontier"
    },

    product: {
      kicker: "Products Room",
      title: "Product Gallery",
      copy:
        "Product Gallery shows how ideas, tools, and offerings become public-facing value.",
      list: [
        "Purpose: move from concept to usable public value",
        "Connects to: product surfaces and public offers",
        "Next move: open Product Gallery or preview another room"
      ],
      actionLabel: "Open Product Gallery",
      actionHref: "/products/",
      jumpTarget: "#jump-product"
    },

    lab: {
      kicker: "Proof Room",
      title: "The Lab",
      copy:
        "The Lab separates what works, what is held, and what still needs proof.",
      list: [
        "Purpose: status, readiness, proof, and measurement",
        "Connects to: Gauges, Laws, readiness surfaces",
        "Next move: open The Lab or preview another room"
      ],
      actionLabel: "Open The Lab",
      actionHref: "/gauges/",
      jumpTarget: "#jump-lab"
    },

    law: {
      kicker: "Boundary Room",
      title: "Law Library",
      copy:
        "Law Library holds the rules, categories, and constraints.",
      list: [
        "Purpose: boundary layer before deeper movement",
        "Connects to: Laws Compass, Categories, tracks",
        "Next move: open Law Library or preview another room"
      ],
      actionLabel: "Open Law Library",
      actionHref: "/laws/",
      jumpTarget: "#jump-law"
    }
  };

  const ROUTE_PLANS = {
    "new:orientation": {
      kicker: "Recommended Path",
      title: "Guide Desk → Compass Desk → Atrium",
      copy:
        "Start with Guide Desk, use Compass Desk for orientation, then enter Atrium when you are ready to cross into Mirrorland.",
      steps: [
        ["Guide Desk", "/site-guide/"],
        ["Compass Desk", "/"],
        ["Atrium", "/showroom/"]
      ]
    },

    "new:worlds": {
      kicker: "Recommended Path",
      title: "Guide Desk → Atrium → Atlas Study",
      copy:
        "Start with the controls, enter Atrium, then open Atlas Study to choose a world-facing route.",
      steps: [
        ["Guide Desk", "/site-guide/"],
        ["Atrium", "/showroom/"],
        ["Atlas Study", "/showroom/globe/"]
      ]
    },

    "new:proof": {
      kicker: "Recommended Path",
      title: "Guide Desk → Law Library → The Lab",
      copy:
        "Start by understanding the map, then move through the boundary layer before opening readiness and measurement.",
      steps: [
        ["Guide Desk", "/site-guide/"],
        ["Law Library", "/laws/"],
        ["The Lab", "/gauges/"]
      ]
    },

    "new:frontier": {
      kicker: "Recommended Path",
      title: "Guide Desk → Compass Desk → Frontier Workshop Yard",
      copy:
        "Orient first, then move into the applied systems yard.",
      steps: [
        ["Guide Desk", "/site-guide/"],
        ["Compass Desk", "/"],
        ["Frontier Yard", "/explore/frontier/"]
      ]
    },

    "new:products": {
      kicker: "Recommended Path",
      title: "Guide Desk → Main Hall → Product Gallery",
      copy:
        "Start with the map, return to the public center, then open the product-facing route.",
      steps: [
        ["Guide Desk", "/site-guide/"],
        ["Main Hall", "/home/"],
        ["Product Gallery", "/products/"]
      ]
    },

    "mirrorland:orientation": {
      kicker: "Recommended Path",
      title: "Atrium → Guide Desk → Compass Desk",
      copy:
        "Exit the immersive room long enough to re-orient, then return when ready.",
      steps: [
        ["Atrium", "/showroom/"],
        ["Guide Desk", "/site-guide/"],
        ["Compass Desk", "/"]
      ]
    },

    "mirrorland:worlds": {
      kicker: "Recommended Path",
      title: "Atrium → Atlas Study → World Room",
      copy:
        "Stay inside the estate path and continue into the world-facing rooms.",
      steps: [
        ["Atrium", "/showroom/"],
        ["Atlas Study", "/showroom/globe/"],
        ["Audralia", "/showroom/globe/audralia/"]
      ]
    },

    "mirrorland:proof": {
      kicker: "Recommended Path",
      title: "Atrium → Law Library → The Lab",
      copy:
        "Move from immersive context back into boundaries and measurement.",
      steps: [
        ["Atrium", "/showroom/"],
        ["Law Library", "/laws/"],
        ["The Lab", "/gauges/"]
      ]
    },

    "mirrorland:frontier": {
      kicker: "Recommended Path",
      title: "Atrium → Frontier Workshop Yard",
      copy:
        "Move from the immersive estate entrance into the applied systems yard.",
      steps: [
        ["Atrium", "/showroom/"],
        ["Frontier Yard", "/explore/frontier/"]
      ]
    },

    "mirrorland:products": {
      kicker: "Recommended Path",
      title: "Atrium → Main Hall → Product Gallery",
      copy:
        "Leave the immersive layer, return to the public center, then move toward product value.",
      steps: [
        ["Atrium", "/showroom/"],
        ["Main Hall", "/home/"],
        ["Product Gallery", "/products/"]
      ]
    },

    "proof:orientation": {
      kicker: "Recommended Path",
      title: "The Lab → Law Library → Compass Desk",
      copy:
        "Move from proof need into the boundary layer, then re-center at the Compass.",
      steps: [
        ["The Lab", "/gauges/"],
        ["Law Library", "/laws/"],
        ["Compass Desk", "/"]
      ]
    },

    "proof:worlds": {
      kicker: "Recommended Path",
      title: "The Lab → Law Library → Atlas Study",
      copy:
        "When proof is the starting point, move through boundaries before entering a world route.",
      steps: [
        ["The Lab", "/gauges/"],
        ["Law Library", "/laws/"],
        ["Atlas Study", "/showroom/globe/"]
      ]
    },

    "proof:proof": {
      kicker: "Recommended Path",
      title: "Law Library → The Lab",
      copy:
        "Use the Law Library for boundary context, then open The Lab for readiness and measurement.",
      steps: [
        ["Law Library", "/laws/"],
        ["The Lab", "/gauges/"]
      ]
    },

    "proof:frontier": {
      kicker: "Recommended Path",
      title: "The Lab → Frontier Workshop Yard",
      copy:
        "Move from readiness into applied system work.",
      steps: [
        ["The Lab", "/gauges/"],
        ["Frontier Yard", "/explore/frontier/"]
      ]
    },

    "proof:products": {
      kicker: "Recommended Path",
      title: "The Lab → Product Gallery",
      copy:
        "Move from proof posture toward usable public value.",
      steps: [
        ["The Lab", "/gauges/"],
        ["Product Gallery", "/products/"]
      ]
    },

    "frontier:orientation": {
      kicker: "Recommended Path",
      title: "Frontier Workshop Yard → Guide Desk → Compass Desk",
      copy:
        "When applied systems feel too large, return to the guide and re-center.",
      steps: [
        ["Frontier Yard", "/explore/frontier/"],
        ["Guide Desk", "/site-guide/"],
        ["Compass Desk", "/"]
      ]
    },

    "frontier:worlds": {
      kicker: "Recommended Path",
      title: "Frontier Workshop Yard → Atlas Study",
      copy:
        "Move from applied systems back into the world-study room.",
      steps: [
        ["Frontier Yard", "/explore/frontier/"],
        ["Atlas Study", "/showroom/globe/"]
      ]
    },

    "frontier:proof": {
      kicker: "Recommended Path",
      title: "Frontier Workshop Yard → The Lab",
      copy:
        "Move from applied systems into readiness and measurement.",
      steps: [
        ["Frontier Yard", "/explore/frontier/"],
        ["The Lab", "/gauges/"]
      ]
    },

    "frontier:frontier": {
      kicker: "Recommended Path",
      title: "Frontier Workshop Yard",
      copy:
        "Stay in the applied systems yard and choose the relevant bench.",
      steps: [
        ["Frontier Yard", "/explore/frontier/"]
      ]
    },

    "frontier:products": {
      kicker: "Recommended Path",
      title: "Frontier Workshop Yard → Product Gallery",
      copy:
        "Move from applied system work toward public-facing value.",
      steps: [
        ["Frontier Yard", "/explore/frontier/"],
        ["Product Gallery", "/products/"]
      ]
    }
  };

  const STATE = {
    selectedFeature: null,
    selectedLens: "presentation",
    selectedBlueprintRoom: "atrium",
    selectedRouteStart: "new",
    selectedRouteGoal: "orientation",
    selectedMatrix: null,
    selectedSpectrum: null,
    blueprintOpen: false,
    orbitFocused: false,
    focusMode: false,
    lastFocusSource: null
  };

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function supportsEscape() {
    return Boolean(window.CSS && typeof window.CSS.escape === "function");
  }

  function esc(value) {
    const stringValue =
      String(value ?? "");

    if (supportsEscape()) {
      return CSS.escape(stringValue);
    }

    return stringValue.replace(/["\\#.:,[\]=]/g, "\\$&");
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function smoothFocus(selectorOrElement, block = "start") {
    const element =
      typeof selectorOrElement === "string"
        ? qs(selectorOrElement)
        : selectorOrElement;

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior:
        prefersReducedMotion() ? "auto" : "smooth",
      block
    });
  }

  function setDatasetBoolean(element, key, value) {
    if (!element) {
      return;
    }

    element.dataset[key] =
      value ? "true" : "false";
  }

  function setBodyState() {
    document.body.dataset.focusMode =
      STATE.focusMode ? "true" : "false";

    document.body.dataset.orbitFocused =
      STATE.orbitFocused ? "true" : "false";

    document.body.dataset.blueprintOpen =
      STATE.blueprintOpen ? "true" : "false";

    if (STATE.selectedFeature) {
      document.body.dataset.selectedFeature =
        STATE.selectedFeature;
    } else {
      delete document.body.dataset.selectedFeature;
    }

    if (STATE.selectedBlueprintRoom) {
      document.body.dataset.selectedBlueprintRoom =
        STATE.selectedBlueprintRoom;
    } else {
      delete document.body.dataset.selectedBlueprintRoom;
    }
  }

  function markActive(items, activeItem) {
    items.forEach(item => {
      item.dataset.active =
        item === activeItem ? "true" : "false";

      if (item === activeItem) {
        item.setAttribute("aria-pressed", "true");
      } else {
        item.setAttribute("aria-pressed", "false");
      }
    });
  }

  function clearActive(items) {
    items.forEach(item => {
      item.dataset.active =
        "false";

      item.setAttribute("aria-pressed", "false");
    });
  }

  function setHiddenState(panel, active) {
    panel.hidden =
      !active;

    panel.dataset.active =
      active ? "true" : "false";
  }

  function showOnly(target, panels) {
    panels.forEach(panel => {
      setHiddenState(
        panel,
        panel === target
      );
    });
  }

  function updateGuideOrbitFocus() {
    const orbit =
      qs(".guide-orbit");

    if (!orbit) {
      return;
    }

    orbit.dataset.focusActive =
      STATE.selectedFeature ? "true" : "false";

    orbit.dataset.selectedFeature =
      STATE.selectedFeature || "";
  }

  function setFocusMode(value, source = null) {
    STATE.focusMode =
      Boolean(value);

    STATE.lastFocusSource =
      source;

    setBodyState();
    emitReceipt();
  }

  function setFeature(feature, options = {}) {
    const featureKey =
      String(feature || "");

    const gem =
      qs(`[data-feature-gem][data-feature="${esc(featureKey)}"]`);

    const detail =
      qs(`[data-feature-detail="${esc(featureKey)}"]`);

    if (!gem || !detail) {
      return false;
    }

    STATE.selectedFeature =
      featureKey;

    STATE.orbitFocused =
      true;

    STATE.focusMode =
      true;

    markActive(
      qsa("[data-feature-gem]"),
      gem
    );

    showOnly(
      detail,
      qsa("[data-feature-detail]")
    );

    updateGuideOrbitFocus();
    setBodyState();

    if (options.scroll !== false) {
      smoothFocus(detail);
    }

    emitReceipt();

    return true;
  }

  function returnToOrbit(options = {}) {
    STATE.selectedFeature =
      null;

    STATE.orbitFocused =
      false;

    STATE.focusMode =
      false;

    STATE.lastFocusSource =
      "return-to-orbit";

    clearActive(
      qsa("[data-feature-gem]")
    );

    qsa("[data-feature-detail]").forEach(detail => {
      setHiddenState(detail, false);
    });

    updateGuideOrbitFocus();
    setBodyState();

    if (options.scroll !== false) {
      smoothFocus("#guide-orbit");
    }

    emitReceipt();
  }

  function setLens(lens, options = {}) {
    const lensKey =
      String(lens || "");

    const button =
      qs(`[data-lens-button="${esc(lensKey)}"]`);

    const panel =
      qs(`[data-lens-panel="${esc(lensKey)}"]`);

    if (!button || !panel) {
      return false;
    }

    STATE.selectedLens =
      lensKey;

    markActive(
      qsa("[data-lens-button]"),
      button
    );

    qsa("[data-lens-panel]").forEach(item => {
      const active =
        item === panel;

      setHiddenState(item, active);
    });

    STATE.focusMode =
      true;

    STATE.lastFocusSource =
      `lens:${lensKey}`;

    setBodyState();

    if (options.scroll !== false) {
      smoothFocus(panel);
    }

    emitReceipt();

    return true;
  }

  function setCategory(category, options = {}) {
    const categoryKey =
      String(category || "");

    const button =
      qs(`[data-category-button][data-category="${esc(categoryKey)}"]`);

    const panel =
      qs(`[data-category-panel="${esc(categoryKey)}"]`);

    if (!button || !panel) {
      return false;
    }

    markActive(
      qsa("[data-category-button]"),
      button
    );

    qsa("[data-category-panel]").forEach(item => {
      setHiddenState(
        item,
        item === panel
      );
    });

    if (options.scroll) {
      smoothFocus(panel);
    }

    emitReceipt();

    return true;
  }

  function setDemoCard(card) {
    if (!(card instanceof HTMLElement)) {
      return false;
    }

    const group =
      card.closest("[data-select-group]") ||
      card.parentElement;

    if (!group) {
      return false;
    }

    markActive(
      qsa("[data-demo-card]", group),
      card
    );

    emitReceipt();

    return true;
  }

  function updateBlueprintDetail(roomKey) {
    const room =
      BLUEPRINT_ROOMS[roomKey];

    if (!room) {
      return false;
    }

    const kicker =
      qs("[data-blueprint-kicker]");

    const title =
      qs("[data-blueprint-title]");

    const copy =
      qs("[data-blueprint-copy]");

    const list =
      qs("[data-blueprint-list]");

    const action =
      qs("[data-blueprint-action]");

    if (kicker) {
      kicker.textContent =
        room.kicker;
    }

    if (title) {
      title.textContent =
        room.title;
    }

    if (copy) {
      copy.textContent =
        room.copy;
    }

    if (list) {
      const fragment =
        document.createDocumentFragment();

      room.list.forEach(item => {
        const li =
          document.createElement("li");

        li.textContent =
          item;

        fragment.appendChild(li);
      });

      list.replaceChildren(fragment);
    }

    if (action) {
      action.textContent =
        room.actionLabel;

      action.href =
        room.actionHref;
    }

    return true;
  }

  function focusJumpSurface(roomKey, options = {}) {
    const room =
      BLUEPRINT_ROOMS[roomKey];

    if (!room) {
      return;
    }

    const target =
      qs(room.jumpTarget) ||
      qs(`[data-jump-section="${esc(roomKey)}"]`);

    if (!target) {
      return;
    }

    qsa(".jump-surface").forEach(surface => {
      const active =
        surface === target;

      surface.dataset.active =
        active ? "true" : "false";

      if (active) {
        surface.dataset.selectedPreview =
          "true";
      } else {
        delete surface.dataset.selectedPreview;
      }
    });

    if (options.scroll !== false) {
      smoothFocus(target);
    }
  }

  function setBlueprintRoom(roomKey, options = {}) {
    const key =
      String(roomKey || "");

    const room =
      BLUEPRINT_ROOMS[key];

    const button =
      qs(`[data-blueprint-room][data-room="${esc(key)}"]`);

    if (!room || !button) {
      return false;
    }

    STATE.selectedBlueprintRoom =
      key;

    STATE.blueprintOpen =
      true;

    STATE.focusMode =
      true;

    STATE.lastFocusSource =
      `blueprint:${key}`;

    markActive(
      qsa("[data-blueprint-room]"),
      button
    );

    updateBlueprintDetail(key);

    setBodyState();

    if (options.preview !== false) {
      focusJumpSurface(key, {
        scroll:
          options.jump !== false
      });
    } else if (options.jump !== false) {
      smoothFocus(".blueprint-detail");
    }

    emitReceipt();

    return true;
  }

  function returnToBlueprint(options = {}) {
    STATE.blueprintOpen =
      true;

    STATE.focusMode =
      true;

    STATE.lastFocusSource =
      "return-to-blueprint";

    setBodyState();

    if (options.scroll !== false) {
      smoothFocus(".estate-blueprint");
    }

    emitReceipt();
  }

  function openBlueprint(options = {}) {
    setLens("presentation", {
      scroll:
        false
    });

    STATE.blueprintOpen =
      true;

    STATE.focusMode =
      true;

    STATE.lastFocusSource =
      "open-blueprint";

    setBodyState();

    if (options.scroll !== false) {
      smoothFocus(".estate-blueprint");
    }

    emitReceipt();
  }

  function setMatrixCell(cell) {
    if (!(cell instanceof HTMLElement)) {
      return false;
    }

    const group =
      cell.closest("[data-select-group]") ||
      cell.closest(".matrix-4x4");

    if (!group) {
      return false;
    }

    markActive(
      qsa("[data-matrix-cell]", group),
      cell
    );

    STATE.selectedMatrix =
      cell.textContent.trim();

    document.documentElement.dataset.siteGuideSelectedMatrix =
      STATE.selectedMatrix;

    emitReceipt();

    return true;
  }

  function buildSpectrum() {
    const spectrum =
      qs("[data-select-group='spectrum'], .spectrum-16x16");

    if (!spectrum || spectrum.dataset.spectrumBuilt === "true") {
      return;
    }

    const fragment =
      document.createDocumentFragment();

    for (let index = 1; index <= 256; index += 1) {
      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "spectrum-cell";

      button.dataset.spectrumCell =
        String(index);

      button.setAttribute(
        "aria-label",
        `Diagnostic spectrum state ${index}`
      );

      button.textContent =
        String(index);

      fragment.appendChild(button);
    }

    spectrum.appendChild(fragment);
    spectrum.dataset.spectrumBuilt =
      "true";
  }

  function setSpectrumCell(cell) {
    if (!(cell instanceof HTMLElement)) {
      return false;
    }

    const group =
      cell.closest(".spectrum-16x16");

    if (!group) {
      return false;
    }

    markActive(
      qsa("[data-spectrum-cell]", group),
      cell
    );

    const index =
      Number(cell.dataset.spectrumCell || cell.textContent.trim());

    if (!Number.isFinite(index)) {
      return false;
    }

    const row =
      Math.ceil(index / 16);

    const column =
      ((index - 1) % 16) + 1;

    const readout =
      qs("[data-spectrum-readout]");

    if (readout) {
      readout.textContent =
        `Selected state: ${index} · row ${row} · column ${column}.`;
    }

    STATE.selectedSpectrum =
      {
        index,
        row,
        column,
        scope: "16x16-256"
      };

    document.documentElement.dataset.siteGuideSelectedSpectrum =
      JSON.stringify(STATE.selectedSpectrum);

    emitReceipt();

    return true;
  }

  function getActiveRouteStart() {
    return (
      qs("[data-route-start][data-active='true']")?.dataset.routeStart ||
      STATE.selectedRouteStart ||
      "new"
    );
  }

  function getActiveRouteGoal() {
    return (
      qs("[data-route-goal][data-active='true']")?.dataset.routeGoal ||
      STATE.selectedRouteGoal ||
      "orientation"
    );
  }

  function updateRoutePlan() {
    const start =
      getActiveRouteStart();

    const goal =
      getActiveRouteGoal();

    STATE.selectedRouteStart =
      start;

    STATE.selectedRouteGoal =
      goal;

    const key =
      `${start}:${goal}`;

    const plan =
      ROUTE_PLANS[key] ||
      ROUTE_PLANS["new:orientation"];

    const kicker =
      qs("[data-plan-kicker]");

    const title =
      qs("[data-plan-title]");

    const copy =
      qs("[data-plan-copy]");

    const rail =
      qs("[data-path-rail]");

    if (kicker) {
      kicker.textContent =
        plan.kicker;
    }

    if (title) {
      title.textContent =
        plan.title;
    }

    if (copy) {
      copy.textContent =
        plan.copy;
    }

    if (rail) {
      const fragment =
        document.createDocumentFragment();

      plan.steps.forEach(([label, href]) => {
        const link =
          document.createElement("a");

        link.className =
          "path-step";

        link.href =
          href;

        link.textContent =
          label;

        fragment.appendChild(link);
      });

      rail.replaceChildren(fragment);
    }

    document.documentElement.dataset.siteGuideRoutePlan =
      JSON.stringify({
        key,
        title:
          plan.title,
        steps:
          plan.steps.map(([label, href]) => ({
            label,
            href
          }))
      });

    emitReceipt();
  }

  function setRouteStart(button) {
    if (!(button instanceof HTMLElement)) {
      return false;
    }

    const group =
      button.closest("[data-select-group]") ||
      button.parentElement;

    if (!group) {
      return false;
    }

    markActive(
      qsa("[data-route-start]", group),
      button
    );

    STATE.selectedRouteStart =
      button.dataset.routeStart || "new";

    updateRoutePlan();

    return true;
  }

  function setRouteGoal(button) {
    if (!(button instanceof HTMLElement)) {
      return false;
    }

    const group =
      button.closest("[data-select-group]") ||
      button.parentElement;

    if (!group) {
      return false;
    }

    markActive(
      qsa("[data-route-goal]", group),
      button
    );

    STATE.selectedRouteGoal =
      button.dataset.routeGoal || "orientation";

    updateRoutePlan();

    return true;
  }

  function restoreFromHash() {
    const hash =
      window.location.hash;

    if (!hash || hash.length < 2) {
      return false;
    }

    const id =
      hash.slice(1);

    const target =
      document.getElementById(id);

    if (!target) {
      return false;
    }

    const lensPanel =
      target.closest("[data-lens-panel]");

    if (lensPanel instanceof HTMLElement && lensPanel.dataset.lensPanel) {
      setLens(lensPanel.dataset.lensPanel, {
        scroll:
          false
      });
    }

    const jumpSection =
      target.closest("[data-jump-section]");

    if (jumpSection instanceof HTMLElement && jumpSection.dataset.jumpSection) {
      setBlueprintRoom(jumpSection.dataset.jumpSection, {
        jump:
          false,
        preview:
          true
      });
    }

    const featureDetail =
      target.closest("[data-feature-detail]");

    if (featureDetail instanceof HTMLElement && featureDetail.dataset.featureDetail) {
      setFeature(featureDetail.dataset.featureDetail, {
        scroll:
          false
      });
    }

    smoothFocus(target);

    emitReceipt();

    return true;
  }

  function bootManorBlueprintSafeMode() {
    const manorRuntimePresent =
      Boolean(window.DGB_MANOR_BLUEPRINT) ||
      Boolean(window.MANOR_BLUEPRINT) ||
      Boolean(document.querySelector("[data-manor-blueprint-root]"));

    document.documentElement.dataset.siteGuideManorBlueprintRuntimePresent =
      manorRuntimePresent ? "true" : "false";

    document.documentElement.dataset.siteGuideManorBlueprintSafeFailure =
      manorRuntimePresent ? "false" : "true";
  }

  function enhanceAccessibility() {
    qsa("[data-feature-gem]").forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.active === "true" ? "true" : "false");
    });

    qsa("[data-blueprint-room]").forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.active === "true" ? "true" : "false");
    });

    qsa("[data-lens-button]").forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.active === "true" ? "true" : "false");
    });

    qsa("[data-demo-card]").forEach(button => {
      if (button instanceof HTMLButtonElement) {
        button.setAttribute("aria-pressed", button.dataset.active === "true" ? "true" : "false");
      }
    });

    qsa("[data-route-start], [data-route-goal], [data-matrix-cell]").forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.active === "true" ? "true" : "false");
    });
  }

  function emitReceipt() {
    const receipt = {
      contract:
        CONTRACT,

      route:
        ROUTE,

      htmlContract:
        document.documentElement.dataset.contract || null,

      cssContract:
        document.documentElement.dataset.cssContract || null,

      resurrectedAssets:
        {
          css:
            "/assets/site-guide/site-guide.css",

          js:
            "/assets/site-guide/site-guide.js"
        },

      selectedFeature:
        STATE.selectedFeature,

      selectedLens:
        STATE.selectedLens,

      selectedBlueprintRoom:
        STATE.selectedBlueprintRoom,

      selectedRouteStart:
        STATE.selectedRouteStart,

      selectedRouteGoal:
        STATE.selectedRouteGoal,

      selectedMatrix:
        STATE.selectedMatrix,

      selectedSpectrum:
        STATE.selectedSpectrum,

      blueprintOpen:
        STATE.blueprintOpen,

      orbitFocused:
        STATE.orbitFocused,

      focusMode:
        STATE.focusMode,

      lastFocusSource:
        STATE.lastFocusSource,

      canvas:
        false,

      webgl:
        false,

      generatedImage:
        false,

      timestamp:
        new Date().toISOString()
    };

    document.documentElement.dataset.siteGuideControllerReceipt =
      JSON.stringify(receipt);
  }

  function bindEvents() {
    document.addEventListener("click", event => {
      const target =
        event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const featureGem =
        target.closest("[data-feature-gem]");

      if (featureGem instanceof HTMLElement) {
        event.preventDefault();

        setFeature(
          featureGem.dataset.feature || ""
        );

        return;
      }

      const returnOrbit =
        target.closest("[data-return-to-orbit]");

      if (returnOrbit) {
        event.preventDefault();

        returnToOrbit();

        return;
      }

      const openBlueprintButton =
        target.closest("[data-open-blueprint]");

      if (openBlueprintButton) {
        event.preventDefault();

        openBlueprint();

        return;
      }

      const returnBlueprint =
        target.closest("[data-return-to-blueprint]");

      if (returnBlueprint) {
        event.preventDefault();

        returnToBlueprint();

        return;
      }

      const lensButton =
        target.closest("[data-lens-button]");

      if (lensButton instanceof HTMLElement) {
        event.preventDefault();

        setLens(
          lensButton.dataset.lensButton || ""
        );

        return;
      }

      const categoryButton =
        target.closest("[data-category-button]");

      if (categoryButton instanceof HTMLElement) {
        event.preventDefault();

        setCategory(
          categoryButton.dataset.category || "",
          {
            scroll:
              false
          }
        );

        return;
      }

      const demoCard =
        target.closest("[data-demo-card]");

      if (demoCard instanceof HTMLElement) {
        event.preventDefault();

        setDemoCard(demoCard);

        return;
      }

      const roomButton =
        target.closest("[data-blueprint-room]");

      if (roomButton instanceof HTMLElement) {
        event.preventDefault();

        setBlueprintRoom(
          roomButton.dataset.room || ""
        );

        return;
      }

      const routeStart =
        target.closest("[data-route-start]");

      if (routeStart instanceof HTMLElement) {
        event.preventDefault();

        setRouteStart(routeStart);

        return;
      }

      const routeGoal =
        target.closest("[data-route-goal]");

      if (routeGoal instanceof HTMLElement) {
        event.preventDefault();

        setRouteGoal(routeGoal);

        return;
      }

      const matrixCell =
        target.closest("[data-matrix-cell]");

      if (matrixCell instanceof HTMLElement) {
        event.preventDefault();

        setMatrixCell(matrixCell);

        return;
      }

      const spectrumCell =
        target.closest("[data-spectrum-cell]");

      if (spectrumCell instanceof HTMLElement) {
        event.preventDefault();

        setSpectrumCell(spectrumCell);
      }
    });

    window.addEventListener("hashchange", () => {
      restoreFromHash();
    });
  }

  function initializeDefaults() {
    buildSpectrum();
    enhanceAccessibility();

    STATE.selectedFeature =
      null;

    STATE.orbitFocused =
      false;

    STATE.focusMode =
      false;

    const activeLens =
      qs("[data-lens-button][data-active='true']");

    if (activeLens?.dataset.lensButton) {
      STATE.selectedLens =
        activeLens.dataset.lensButton;

      qsa("[data-lens-panel]").forEach(panel => {
        setHiddenState(
          panel,
          panel.dataset.lensPanel === STATE.selectedLens
        );
      });
    } else {
      setLens("presentation", {
        scroll:
          false
      });
    }

    const activeCategory =
      qs("[data-category-button][data-active='true']");

    if (activeCategory?.dataset.category) {
      setCategory(
        activeCategory.dataset.category,
        {
          scroll:
            false
        }
      );
    }

    const activeRoom =
      qs("[data-blueprint-room][data-active='true']")?.dataset.room ||
      "atrium";

    STATE.selectedBlueprintRoom =
      activeRoom;

    updateBlueprintDetail(activeRoom);

    markActive(
      qsa("[data-blueprint-room]"),
      qs(`[data-blueprint-room][data-room="${esc(activeRoom)}"]`)
    );

    focusJumpSurface(activeRoom, {
      scroll:
        false
    });

    STATE.blueprintOpen =
      false;

    STATE.selectedRouteStart =
      getActiveRouteStart();

    STATE.selectedRouteGoal =
      getActiveRouteGoal();

    updateRoutePlan();

    setBodyState();
    updateGuideOrbitFocus();
    bootManorBlueprintSafeMode();

    const restored =
      restoreFromHash();

    if (!restored) {
      emitReceipt();
    }
  }

  function boot() {
    bindEvents();
    initializeDefaults();

    window.DGB_SITE_GUIDE =
      Object.freeze({
        contract:
          CONTRACT,

        route:
          ROUTE,

        state:
          STATE,

        setFeature,
        returnToOrbit,
        setLens,
        setCategory,
        setBlueprintRoom,
        returnToBlueprint,
        openBlueprint,
        updateRoutePlan,
        emitReceipt
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {
      once:
        true
    });
  } else {
    boot();
  }
})();
