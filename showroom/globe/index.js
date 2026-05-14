// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_PARENT_SELECTOR_ONLY_DEMOTION_TNT_v1
// Parent /showroom/globe/ only.
// Lightweight selector/status helper.
// No canvas runtime. No material renderer import. No requestAnimationFrame. No drag/glide.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_GLOBE_PARENT_SELECTOR_ONLY_DEMOTION_TNT_v1";
  const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_EXIT_NAVIGATION_RELEASE_RENEWAL_TNT_v1";

  const ROUTES = Object.freeze({
    zionts: Object.freeze({
      key: "zionts",
      label: "ZIONTS",
      route: "/showroom/globe/earth/",
      role: "child-route-render-authority",
      owns: "zionts-rendering-only"
    }),
    "h-earth": Object.freeze({
      key: "h-earth",
      label: "H-Earth",
      route: "/showroom/globe/h-earth/",
      role: "child-route-render-authority",
      owns: "h-earth-rendering-only"
    }),
    audralia: Object.freeze({
      key: "audralia",
      label: "Audralia",
      route: "/showroom/globe/audralia/",
      role: "child-route-render-authority",
      owns: "audralia-rendering-only"
    })
  });

  const STATUS = Object.freeze({
    ok: true,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    route: "/showroom/globe/",
    page: "showroom-globe-parent-selector",
    role: "parent-selector-only",
    primaryLaw: "selector_selects_child_planet_route_renders",
    parentSelectorOnly: true,
    liveCanvasRuntime: false,
    materialRendererImport: false,
    requestAnimationFrame: false,
    pointerDragRuntime: false,
    glideRuntime: false,
    sharedInterplanetaryRendering: false,
    childRoutesOwnRendering: true,
    generatedImage: false,
    graphicBox: false,
    streaming: false,
    visualPassClaimed: false,
    routes: ROUTES
  });

  function publishStatus(extra = {}) {
    const status = Object.freeze({ ...STATUS, ...extra });

    window.DGBShowroomGlobeSelector = Object.freeze({
      status() {
        return status;
      },
      routes() {
        return ROUTES;
      },
      open(key) {
        const target = ROUTES[key];
        if (!target) return false;
        window.location.href = target.route;
        return true;
      }
    });

    window.DGBShowroomGlobeReceipt = status;

    document.documentElement.dataset.contract = CONTRACT;
    document.documentElement.dataset.previousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.parentSelectorOnly = "true";
    document.documentElement.dataset.liveCanvasRuntime = "false";
    document.documentElement.dataset.materialRendererImport = "false";
    document.documentElement.dataset.requestAnimationFrame = "false";
    document.documentElement.dataset.pointerDragRuntime = "false";
    document.documentElement.dataset.glideRuntime = "false";
    document.documentElement.dataset.sharedInterplanetaryRendering = "false";
    document.documentElement.dataset.childRoutesOwnRendering = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.streaming = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.contract = CONTRACT;
      document.body.dataset.parentSelectorOnly = "true";
      document.body.dataset.liveCanvasRuntime = "false";
      document.body.dataset.materialRendererImport = "false";
      document.body.dataset.childRoutesOwnRendering = "true";
    }

    return status;
  }

  function protectRouteNavigation() {
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener(
        "pointerdown",
        () => {
          document.documentElement.dataset.routeIntent = link.getAttribute("href") || "";
        },
        { passive: true }
      );

      link.addEventListener(
        "click",
        () => {
          document.documentElement.dataset.routeClickReleased = "true";
        },
        { passive: true }
      );
    });
  }

  function markCardsReady() {
    const cards = Array.from(document.querySelectorAll(".planet-card[href]"));

    cards.forEach((card) => {
      const href = card.getAttribute("href") || "";
      const key = Object.values(ROUTES).find((route) => route.route === href)?.key;

      if (key) {
        card.dataset.selectorRoute = key;
        card.dataset.childRouteOwnsRendering = "true";
      }
    });

    return {
      cardCount: cards.length,
      routeCardsReady: cards.length === Object.keys(ROUTES).length
    };
  }

  function hideVisibleReceipts() {
    const receiptNodes = Array.from(
      document.querySelectorAll(".receipt, [data-route-receipt], [data-contract-receipt], [data-debug-receipt]")
    );

    receiptNodes.forEach((node) => {
      if (node instanceof HTMLTemplateElement) return;
      node.hidden = true;
      node.setAttribute("aria-hidden", "true");
      node.setAttribute("data-debug-receipt", "hidden-by-selector-runtime");
    });

    return {
      visibleReceiptNodesHidden: receiptNodes.filter((node) => !(node instanceof HTMLTemplateElement)).length,
      templateReceiptPresent: Boolean(document.querySelector("template[data-route-receipt]"))
    };
  }

  function boot() {
    const cards = markCardsReady();
    const receipts = hideVisibleReceipts();

    protectRouteNavigation();

    publishStatus({
      booted: true,
      selectorHelperOnly: true,
      cards,
      receipts,
      forbiddenRuntimePresent: false,
      canvasFound: Boolean(document.querySelector("canvas")),
      materialScriptFound: Array.from(document.scripts).some((script) =>
        String(script.src || "").includes("showroom.globe.cinematic.material")
      ),
      audit: Object.freeze({
        parentHasCanvasRuntime: false,
        parentImportsMaterialRenderer: false,
        parentRunsRequestAnimationFrame: false,
        parentHandlesDragGlide: false,
        parentSwitchesLiveBodies: false,
        childRoutesOwnRendering: true
      })
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
