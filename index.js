// /index.js
// ROOT_COMPASS_CONTROLLER_TNT_v1
// Full-file replacement.
// Authority: lightweight Compass interaction only.
// Owns: root page filter controls, route-card enhancement, status receipt rendering.
// Does not own: Audralia loader, planet rendering, canvas, runtime, Gauges truth, hero profile truth, or game engine logic.

(() => {
  "use strict";

  const ROOT_COMPASS_META = Object.freeze({
    name: "root_compass_controller",
    version: "G1",
    contract: "ROOT_COMPASS_PAIRED_TNT_v1",
    file: "/index.js",
    pageRole: "COMPASS_WHOLE_SITE_CORRELATION_LAYER",
    deterministic: true,
    mutatesCanonicalState: false,
    sourceOfTruthFor: Object.freeze([
      "ROOT_FILTER_UI",
      "ROUTE_CARD_ENHANCEMENT",
      "ROOT_STATUS_RENDER"
    ]),
    doesNotOwn: Object.freeze([
      "AUDRALIA_LOADER",
      "PLANET_RENDERER",
      "CANVAS_RENDERER",
      "RUNTIME_MOTION",
      "GAUGES_MEASUREMENT_TRUTH",
      "HERO_PROFILE_TRUTH",
      "PLAY_ENGINE",
      "SERVER_LOGIC",
      "BOOK_PAGE_CONTENT"
    ])
  });

  const PERSPECTIVES = Object.freeze([
    Object.freeze({
      id: "scientific-backing",
      label: "Scientific Backing",
      shortRead: "proof, systems, scale, gauges, future measures"
    }),
    Object.freeze({
      id: "community",
      label: "Community",
      shortRead: "sanctuary, restoration, access, stewardship"
    }),
    Object.freeze({
      id: "fun-narrative-game-series",
      label: "Fun Narrative / Game / Series",
      shortRead: "Mirrorland, heroes, play, series-ready story"
    })
  ]);

  const ROUTE_ROLES = Object.freeze([
    Object.freeze({
      id: "door",
      route: "/door/",
      role: "threshold_entry",
      title: "Door",
      perspective: "all"
    }),
    Object.freeze({
      id: "home",
      route: "/home/",
      role: "stabilized_return",
      title: "Home",
      perspective: "community"
    }),
    Object.freeze({
      id: "nine-summits",
      route: "/nine-summits/",
      role: "human_climb_and_macro_lane",
      title: "Nine Summits",
      perspective: "community"
    }),
    Object.freeze({
      id: "universe",
      route: "/nine-summits/universe/",
      role: "world_scale_structure",
      title: "Universe",
      perspective: "scientific-backing"
    }),
    Object.freeze({
      id: "zionts",
      route: "/showroom/globe/earth/",
      role: "consequence_warning",
      title: "ZIONTS / Earthchild",
      perspective: "fun-narrative-game-series"
    }),
    Object.freeze({
      id: "audralia",
      route: "/showroom/globe/audralia/",
      role: "possibility_living_world",
      title: "Audralia",
      perspective: "scientific-backing"
    }),
    Object.freeze({
      id: "explore",
      route: "/explore/",
      role: "estate_orientation",
      title: "Explore",
      perspective: "community"
    }),
    Object.freeze({
      id: "frontier",
      route: "/frontier/",
      role: "future_measures",
      title: "Frontier",
      perspective: "scientific-backing"
    }),
    Object.freeze({
      id: "gauges",
      route: "/gauges/",
      role: "proof_surface",
      title: "Gauges / Triple G",
      perspective: "scientific-backing"
    })
  ]);

  function safeQuery(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch {
      return null;
    }
  }

  function safeQueryAll(selector, root = document) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch {
      return [];
    }
  }

  function parseReceipt() {
    const node = safeQuery("#rootCompassReceipt");
    if (!node) return null;

    try {
      return JSON.parse(node.textContent || "{}");
    } catch {
      return null;
    }
  }

  function setText(node, text) {
    if (!node) return;
    node.textContent = String(text);
  }

  function perspectiveExists(filterId) {
    return filterId === "all" || PERSPECTIVES.some((entry) => entry.id === filterId);
  }

  function cardMatchesFilter(card, filterId) {
    if (filterId === "all") return true;

    const values = String(card.getAttribute("data-perspective") || "")
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    return values.includes(filterId);
  }

  function setActiveFilter(filterId) {
    if (!perspectiveExists(filterId)) return;

    const buttons = safeQueryAll("[data-compass-filter] button[data-filter]");
    const cards = safeQueryAll(".route-card[data-perspective]");

    for (const button of buttons) {
      const isActive = button.getAttribute("data-filter") === filterId;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    let visibleCount = 0;

    for (const card of cards) {
      const visible = cardMatchesFilter(card, filterId);
      card.classList.toggle("is-dimmed", !visible);
      card.setAttribute("aria-hidden", visible ? "false" : "true");
      if (visible) visibleCount += 1;
    }

    renderStatus(filterId, visibleCount);
  }

  function setupFilters() {
    const panel = safeQuery("[data-compass-filter]");
    if (!panel) return;

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const button = target.closest("button[data-filter]");
      if (!button) return;

      const filterId = button.getAttribute("data-filter") || "all";
      setActiveFilter(filterId);
    });
  }

  function enhanceRouteCards() {
    const cards = safeQueryAll(".route-card");

    cards.forEach((card, index) => {
      card.setAttribute("data-route-card-index", String(index + 1));

      const link = safeQuery("a.card-link", card);
      if (!link) return;

      link.addEventListener("focus", () => {
        card.classList.add("has-focus");
      });

      link.addEventListener("blur", () => {
        card.classList.remove("has-focus");
      });
    });
  }

  function buildStatusMessage(filterId, visibleCount) {
    const receipt = parseReceipt();
    const activePerspective =
      filterId === "all"
        ? "all public perspectives"
        : (PERSPECTIVES.find((entry) => entry.id === filterId) || {}).label || filterId;

    const receiptRole =
      receipt && receipt.role === "COMPASS_WHOLE_SITE_CORRELATION_LAYER"
        ? "Compass role confirmed"
        : "Compass role receipt unavailable";

    return `${receiptRole}. Showing ${visibleCount} route cards for ${activePerspective}. Root owns orientation only; Audralia remains on its own route.`;
  }

  function renderStatus(filterId = "all", visibleCount = null) {
    const status = safeQuery("#compass-status");
    if (!status) return;

    const count =
      typeof visibleCount === "number"
        ? visibleCount
        : safeQueryAll(".route-card:not(.is-dimmed)").length;

    setText(status, buildStatusMessage(filterId, count));
  }

  function exposeReadOnlyDebug() {
    const receipt = parseReceipt();

    window.DGBRootCompass = Object.freeze({
      meta: ROOT_COMPASS_META,
      perspectives: PERSPECTIVES,
      routeRoles: ROUTE_ROLES,
      receipt: receipt ? Object.freeze(receipt) : null,
      getStatus() {
        return Object.freeze({
          booted: true,
          role: ROOT_COMPASS_META.pageRole,
          routeCount: ROUTE_ROLES.length,
          perspectiveCount: PERSPECTIVES.length,
          audraliaLoaderActive: false,
          planetRuntimeActive: false,
          canvasRendererActive: false
        });
      }
    });
  }

  function validateRootScope() {
    const html = document.documentElement;
    const page = html ? html.getAttribute("data-page") : null;
    const contract = html ? html.getAttribute("data-contract") : null;

    return Object.freeze({
      valid: page === "root-compass" && contract === "ROOT_COMPASS_PAIRED_TNT_v1",
      page,
      contract
    });
  }

  function boot() {
    const scope = validateRootScope();

    if (!scope.valid) {
      renderStatus("all", safeQueryAll(".route-card").length);
      return;
    }

    setupFilters();
    enhanceRouteCards();
    exposeReadOnlyDebug();
    setActiveFilter("all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
