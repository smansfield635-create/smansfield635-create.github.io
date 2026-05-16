// /index.js
// ROOT_COMPASS_GEM_PROFILE_CONTROLLER_TNT_v1
// Full-file replacement.
// Authority: lightweight Compass profile enhancement only.
// Does not boot Audralia, planet renderers, runtime loaders, gauges, heroes, products, or play engines.

(() => {
  "use strict";

  const META = Object.freeze({
    name: "root_compass_gem_profile_controller",
    version: "G1",
    contract: "ROOT_COMPASS_GEM_PROFILE_TNT_v1",
    file: "/index.js",
    role: "ROOT_COMPASS_PROFILE_ENHANCEMENT",
    mutatesCanonicalState: false,
    owns: Object.freeze([
      "light_route_focus",
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
      html &&
      html.getAttribute("data-page") === "compass" &&
      html.getAttribute("data-contract") === "ROOT_COMPASS_GEM_PROFILE_TNT_v1"
    );
  }

  function enhanceCards() {
    const cards = queryAll("[data-compass-routes] .card");

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
      receipt: receipt ? Object.freeze(receipt) : null,
      getStatus() {
        return Object.freeze({
          booted: true,
          role: META.role,
          contract: META.contract,
          rootIsCompass: true,
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
