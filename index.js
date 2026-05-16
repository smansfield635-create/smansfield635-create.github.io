// /index.js
// ROOT_COMPASS_DOOR_STANDARD_THREE_ENTRY_CONTROLLER_TNT_v1
// Full-file replacement.
// Authority: lightweight Compass entry enhancement only.
// Primary entries:
// - Scientific Backing -> /laws/
// - Community -> /products/
// - Fun Narrative / Game / Series -> /showroom/globe/
// Does not boot Audralia, planet renderers, runtime loaders, gauges, heroes, products, or play engines.

(() => {
  "use strict";

  const META = Object.freeze({
    name: "root_compass_three_entry_controller",
    version: "G1",
    contract: "ROOT_COMPASS_DOOR_STANDARD_THREE_ENTRY_TNT_v1",
    file: "/index.js",
    role: "ROOT_COMPASS_SIMPLE_ENTRY_ENHANCEMENT",
    mutatesCanonicalState: false,
    owns: Object.freeze([
      "light_entry_focus",
      "receipt_read",
      "reduced_motion_safe_interaction"
    ]),
    doesNotOwn: Object.freeze([
      "AUDRALIA_LOADER",
      "PLANET_RENDERER",
      "CANVAS_RENDERER",
      "RUNTIME_MOTION",
      "GAUGES_TRUTH",
      "HERO_PROFILE_TRUTH",
      "PRODUCTS_ORBIT",
      "PLAY_ENGINE",
      "BOOK_PAGE_CONTENT"
    ])
  });

  const PRIMARY_ENTRY_MAP = Object.freeze({
    scientificBacking: Object.freeze({
      label: "Scientific Backing",
      route: "/laws/",
      role: "proof_structure_route_law"
    }),
    community: Object.freeze({
      label: "Community",
      route: "/products/",
      role: "usable_doors_public_value"
    }),
    funNarrativeGameSeries: Object.freeze({
      label: "Fun Narrative / Game / Series",
      route: "/showroom/globe/",
      role: "story_world_globe_entry"
    })
  });

  function query(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch {
      return null;
    }
  }

  function queryAll(selector, root = document) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch {
      return [];
    }
  }

  function readReceipt() {
    const node = query("#rootCompassReceipt");
    if (!node) return null;

    try {
      return JSON.parse(node.textContent || "{}");
    } catch {
      return null;
    }
  }

  function validScope() {
    const html = document.documentElement;

    return (
      !!html &&
      html.getAttribute("data-page") === "compass" &&
      html.getAttribute("data-contract") === "ROOT_COMPASS_DOOR_STANDARD_THREE_ENTRY_TNT_v1"
    );
  }

  function enhanceCards() {
    const cards = queryAll("[data-entry-card], [data-compass-routes] .card");

    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => {
        card.setAttribute("data-active", "true");
      });

      card.addEventListener("pointerleave", () => {
        card.removeAttribute("data-active");
      });

      card.addEventListener("focus", () => {
        card.setAttribute("data-active", "true");
      });

      card.addEventListener("blur", () => {
        card.removeAttribute("data-active");
      });
    });
  }

  function exposeReadOnlyStatus() {
    const receipt = readReceipt();

    window.DGBRootCompass = Object.freeze({
      meta: META,
      primaryEntryMap: PRIMARY_ENTRY_MAP,
      receipt: receipt ? Object.freeze(receipt) : null,

      getStatus() {
        return Object.freeze({
          booted: true,
          role: META.role,
          contract: META.contract,
          rootIsCompass: true,
          audraliaIsRoot: false,
          primaryEntries: PRIMARY_ENTRY_MAP,
          audraliaLoaderActive: false,
          planetRendererActive: false,
          runtimePublicMessage: false,
          staticPageUsableWithoutJs: true
        });
      }
    });
  }

  function boot() {
    if (!validScope()) return;

    enhanceCards();
    exposeReadOnlyStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
