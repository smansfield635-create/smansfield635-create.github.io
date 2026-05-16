// /index.js
// ROOT_COMPASS_STRICT_ORGANIC_GEM_ORBITAL_ROTATION_CONTROLLER_TNT_v5
// Full-file replacement.
// Authority: minimal Compass gem-entry enhancement only.
// Gem body rotation and orbital rotation are CSS-owned in /index.html.
// Labels remain upright and readable.

(() => {
  "use strict";

  const META = Object.freeze({
    name: "root_compass_strict_organic_gem_orbital_rotation_controller",
    version: "G5",
    contract: "ROOT_COMPASS_STRICT_ORGANIC_GEM_ORBITAL_ROTATION_TNT_v5",
    file: "/index.js",
    role: "ROOT_COMPASS_ORIENTATION_CURIOSITY_THRESHOLD_ENHANCEMENT",
    mutatesCanonicalState: false,
    primaryEntryMap: Object.freeze({
      scientificBacking: "/laws/",
      community: "/products/",
      funNarrativeGameSeries: "/showroom/globe/"
    }),
    motion: Object.freeze({
      gemBodyRotates: true,
      gemsOrbitCenter: true,
      labelRotates: false,
      cssOwned: true
    }),
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
      !!html &&
      html.getAttribute("data-page") === "compass" &&
      html.getAttribute("data-contract") === "ROOT_COMPASS_STRICT_ORGANIC_GEM_ORBITAL_ROTATION_TNT_v5"
    );
  }

  function enhanceGemFocus() {
    const nodes = queryAll(".choice-node");

    nodes.forEach((node) => {
      node.addEventListener("pointerenter", () => {
        node.setAttribute("data-active", "true");
      });

      node.addEventListener("pointerleave", () => {
        node.removeAttribute("data-active");
      });

      node.addEventListener("focus", () => {
        node.setAttribute("data-active", "true");
      });

      node.addEventListener("blur", () => {
        node.removeAttribute("data-active");
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
          contract: META.contract,
          role: META.role,
          rootIsCompass: true,
          visibleExplanationLevel: "minimal",
          gemBodyRotates: true,
          gemsOrbitCenter: true,
          labelRotates: false,
          primaryEntries: META.primaryEntryMap,
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

    enhanceGemFocus();
    exposeReadOnlyStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
