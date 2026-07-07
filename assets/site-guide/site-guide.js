// TARGET FILE: /assets/site-guide/site-guide.js
// COMPLETE REPLACEMENT
// SITE GUIDE RESURRECTION JS
// SITE_GUIDE_BLUEPRINT_HARD_JUMP_PAD_CONTROLLER_RESURRECTION_TNT_v1

(() => {
  "use strict";

  const CONTRACT =
    "SITE_GUIDE_BLUEPRINT_HARD_JUMP_PAD_CONTROLLER_RESURRECTION_TNT_v1";

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
      actionHref: "/"
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
      actionHref: "/site-guide/"
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
      actionHref: "/home/"
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
      actionHref: "/showroom/"
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
      actionHref: "/showroom/globe/"
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
      actionHref: "/showroom/globe/earth/"
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
      actionHref: "/showroom/globe/audralia/"
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
      actionHref: "/showroom/globe/audralia/planet/"
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
      actionHref: "/showroom/globe/audralia/disposition/"
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
      actionHref: "/explore/frontier/"
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
      actionHref: "/products/"
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
      actionHref: "/gauges/"
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
      actionHref: "/laws/"
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

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function setActiveWithinGroup(target, groupSelector, activeAttr = "data-active") {
    const group =
      target.closest("[data-select-group]") ||
      target.parentElement;

    if (!group) {
      return;
    }

    qsa(groupSelector, group).forEach(item => {
      item.setAttribute(activeAttr, item === target ? "true" : "false");
    });
  }

  function showOnly(target, allPanels) {
    allPanels.forEach(panel => {
      const active =
        panel === target;

      panel.hidden =
        !active;

      panel.dataset.active =
        String(active);
    });
  }

  function smoothFocus(selectorOrElement) {
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

      block:
        "start"
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setBodyFocusMode(value) {
    document.body.dataset.focusMode =
      value ? "true" : "false";
  }

  function setFeature(feature) {
    const gem =
      qs(`[data-feature-gem][data-feature="${CSS.escape(feature)}"]`);

    const detail =
      qs(`[data-feature-detail="${CSS.escape(feature)}"]`);

    if (!gem || !detail) {
      return;
    }

    setActiveWithinGroup(
      gem,
      "[data-feature-gem]"
    );

    showOnly(
      detail,
      qsa("[data-feature-detail]")
    );

    setBodyFocusMode(true);

    document.body.dataset.orbitFocused =
      "true";

    smoothFocus(detail);
  }

  function returnToOrbit() {
    qsa("[data-feature-detail]").forEach(detail => {
      detail.hidden =
        true;

      detail.dataset.active =
        "false";
    });

    qsa("[data-feature-gem]").forEach(gem => {
      gem.dataset.active =
        "false";
    });

    setBodyFocusMode(false);
    document.body.dataset.orbitFocused = "false";
    document.body.dataset.blueprintOpen = "false";

    smoothFocus("#guide-orbit");
  }

  function setLens(lens) {
    const button =
      qs(`[data-lens-button="${CSS.escape(lens)}"]`);

    const panel =
      qs(`[data-lens-panel="${CSS.escape(lens)}"]`);

    if (!button || !panel) {
      return;
    }

    qsa("[data-lens-button]").forEach(item => {
      item.dataset.active =
        String(item === button);
    });

    qsa("[data-lens-panel]").forEach(item => {
      const active =
        item === panel;

      item.hidden =
        !active;

      item.dataset.active =
        String(active);
    });

    setBodyFocusMode(true);
    smoothFocus(panel);
  }

  function setCategory(category) {
    const button =
      qs(`[data-category-button][data-category="${CSS.escape(category)}"]`);

    const panel =
      qs(`[data-category-panel="${CSS.escape(category)}"]`);

    if (!button || !panel) {
      return;
    }

    setActiveWithinGroup(
      button,
      "[data-category-button]"
    );

    qsa("[data-category-panel]").forEach(item => {
      const active =
        item === panel;

      item.hidden =
        !active;

      item.dataset.active =
        String(active);
    });
  }

  function setDemoCard(card) {
    setActiveWithinGroup(
      card,
      "[data-demo-card]"
    );
  }

  function setBlueprintRoom(roomKey, options = {}) {
    const room =
      BLUEPRINT_ROOMS[roomKey];

    const roomButton =
      qs(`[data-blueprint-room][data-room="${CSS.escape(roomKey)}"]`);

    if (!room || !roomButton) {
      return;
    }

    qsa("[data-blueprint-room]").forEach(item => {
      item.dataset.active =
        String(item === roomButton);
    });

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
      list.replaceChildren(
        ...room.list.map(item => {
          const li =
            document.createElement("li");

          li.textContent =
            item;

          return li;
        })
      );
    }

    if (action) {
      action.textContent =
        room.actionLabel;

      action.href =
        room.actionHref;
    }

    document.body.dataset.blueprintOpen =
      "true";

    document.body.dataset.selectedBlueprintRoom =
      roomKey;

    setBodyFocusMode(true);

    if (options.jump !== false) {
      const target =
        roomButton.dataset.jumpTarget;

      if (target) {
        smoothFocus(target);
      } else {
        smoothFocus(".blueprint-detail");
      }
    }

    emitReceipt();
  }

  function returnToBlueprint() {
    document.body.dataset.blueprintOpen =
      "true";

    smoothFocus(".estate-blueprint");
  }

  function openBlueprint() {
    setLens("presentation");
    document.body.dataset.blueprintOpen = "true";
    setBodyFocusMode(true);
    smoothFocus(".estate-blueprint");
  }

  function setMatrixCell(cell) {
    setActiveWithinGroup(
      cell,
      "[data-matrix-cell]"
    );

    document.documentElement.dataset
      .siteGuideSelectedMatrix =
      cell.textContent.trim();

    emitReceipt();
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
    spectrum.dataset.spectrumBuilt = "true";
  }

  function setSpectrumCell(cell) {
    const group =
      cell.closest(".spectrum-16x16");

    if (!group) {
      return;
    }

    qsa("[data-spectrum-cell]", group).forEach(item => {
      item.dataset.active =
        String(item === cell);
    });

    const index =
      cell.dataset.spectrumCell || cell.textContent.trim();

    const row =
      Math.ceil(Number(index) / 16);

    const column =
      ((Number(index) - 1) % 16) + 1;

    const readout =
      qs("[data-spectrum-readout]");

    if (readout) {
      readout.textContent =
        `Selected state: ${index} · row ${row} · column ${column}.`;
    }

    document.documentElement.dataset
      .siteGuideSelectedSpectrum =
      JSON.stringify({
        index:
          Number(index),

        row,
        column,

        scope:
          "16x16-256"
      });

    emitReceipt();
  }

  function getActiveRouteStart() {
    return (
      qs("[data-route-start][data-active='true']")?.dataset.routeStart ||
      "new"
    );
  }

  function getActiveRouteGoal() {
    return (
      qs("[data-route-goal][data-active='true']")?.dataset.routeGoal ||
      "orientation"
    );
  }

  function updateRoutePlan() {
    const key =
      `${getActiveRouteStart()}:${getActiveRouteGoal()}`;

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
      rail.replaceChildren(
        ...plan.steps.map(([label, href]) => {
          const link =
            document.createElement("a");

          link.className =
            "path-step";

          link.href =
            href;

          link.textContent =
            label;

          return link;
        })
      );
    }

    document.documentElement.dataset
      .siteGuideRoutePlan =
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
    setActiveWithinGroup(
      button,
      "[data-route-start]"
    );

    updateRoutePlan();
  }

  function setRouteGoal(button) {
    setActiveWithinGroup(
      button,
      "[data-route-goal]"
    );

    updateRoutePlan();
  }

  function emitReceipt() {
    const receipt = {
      contract:
        CONTRACT,

      route:
        ROUTE,

      resurrectedAssets:
        {
          css:
            "/assets/site-guide/site-guide.css",

          js:
            "/assets/site-guide/site-guide.js"
        },

      selectedFeature:
        qs("[data-feature-gem][data-active='true']")?.dataset.feature || null,

      selectedLens:
        qs("[data-lens-button][data-active='true']")?.dataset.lensButton || null,

      selectedBlueprintRoom:
        document.body.dataset.selectedBlueprintRoom || null,

      selectedRouteStart:
        getActiveRouteStart(),

      selectedRouteGoal:
        getActiveRouteGoal(),

      selectedMatrix:
        document.documentElement.dataset.siteGuideSelectedMatrix || null,

      selectedSpectrum:
        document.documentElement.dataset.siteGuideSelectedSpectrum || null,

      blueprintOpen:
        document.body.dataset.blueprintOpen === "true",

      focusMode:
        document.body.dataset.focusMode === "true",

      canvas:
        false,

      webgl:
        false,

      generatedImage:
        false,

      timestamp:
        new Date().toISOString()
    };

    document.documentElement.dataset
      .siteGuideControllerReceipt =
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
        setFeature(featureGem.dataset.feature || "");
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
        setLens(lensButton.dataset.lensButton || "");
        return;
      }

      const categoryButton =
        target.closest("[data-category-button]");

      if (categoryButton instanceof HTMLElement) {
        event.preventDefault();
        setCategory(categoryButton.dataset.category || "");
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
        setBlueprintRoom(roomButton.dataset.room || "");
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
  }

  function restoreFromHash() {
    const hash =
      window.location.hash;

    if (!hash || hash.length < 2) {
      return;
    }

    const target =
      qs(hash);

    if (!target) {
      return;
    }

    const lensPanel =
      target.closest("[data-lens-panel]");

    if (lensPanel instanceof HTMLElement && lensPanel.dataset.lensPanel) {
      setLens(lensPanel.dataset.lensPanel);
    }

    target.hidden =
      false;

    setBodyFocusMode(true);
    smoothFocus(target);
  }

  function bootManorBlueprintSafeMode() {
    const manorRuntimePresent =
      Boolean(window.DGB_MANOR_BLUEPRINT) ||
      Boolean(window.MANOR_BLUEPRINT) ||
      Boolean(document.querySelector("[data-manor-blueprint-root]"));

    document.documentElement.dataset
      .siteGuideManorBlueprintRuntimePresent =
      String(manorRuntimePresent);

    if (!manorRuntimePresent) {
      document.documentElement.dataset
        .siteGuideManorBlueprintSafeFailure =
        "true";
    }
  }

  function initializeDefaults() {
    buildSpectrum();

    document.body.dataset.focusMode =
      "false";

    document.body.dataset.orbitFocused =
      "false";

    document.body.dataset.blueprintOpen =
      "false";

    const activeLens =
      qs("[data-lens-button][data-active='true']");

    if (activeLens?.dataset.lensButton) {
      qsa("[data-lens-panel]").forEach(panel => {
        const active =
          panel.dataset.lensPanel === activeLens.dataset.lensButton;

        panel.hidden =
          !active;

        panel.dataset.active =
          String(active);
      });
    }

    const activeCategory =
      qs("[data-category-button][data-active='true']");

    if (activeCategory?.dataset.category) {
      setCategory(activeCategory.dataset.category);
    }

    const defaultRoom =
      qs("[data-blueprint-room][data-active='true']")?.dataset.room ||
      "atrium";

    setBlueprintRoom(defaultRoom, {
      jump:
        false
    });

    updateRoutePlan();

    restoreFromHash();

    bootManorBlueprintSafeMode();

    emitReceipt();
  }

  function boot() {
    bindEvents();
    initializeDefaults();

    window.addEventListener("hashchange", restoreFromHash);

    window.DGB_SITE_GUIDE =
      Object.freeze({
        contract:
          CONTRACT,

        route:
          ROUTE,

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
