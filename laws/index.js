// /laws/index.js
// LAWS_PURPLE_RULE_CHAMBER_PAIR_RUNTIME_TNT_v1
// Light route script only.
// Owns: law diamond drift variables, single-open law cards, route status receipts.
// Does not own: HTML shell, page copy, CSS theme, Gauges logic, render files, planet files, GraphicBox, image generation, or visual pass.

(() => {
  "use strict";

  const RECEIPT = "LAWS_PURPLE_RULE_CHAMBER_PAIR_RUNTIME_TNT_v1";
  const PAGE_CONTRACT = "LAWS_PURPLE_RULE_CHAMBER_PAIR_RENEWAL_TNT_v1";

  const STATUS = {
    ok: true,
    receipt: RECEIPT,
    pageContract: PAGE_CONTRACT,
    route: "/laws/",
    role: "laws-light-route-script",
    owns: [
      "law_diamond_motion_variables",
      "single_open_law_cards",
      "route_status_receipt",
      "reduced_motion_respect",
      "pagehide_animation_cleanup"
    ],
    doesNotOwn: [
      "html_shell",
      "law_copy",
      "css_theme",
      "gauges_logic",
      "render_files",
      "planet_surface",
      "moon_surface",
      "sun_surface",
      "instrument_state",
      "GraphicBox",
      "image_generation",
      "visual_pass_claim"
    ],
    heavyRuntimeLoaded: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  function publishStatus(extra = {}) {
    const status = Object.freeze({ ...STATUS, ...extra });

    window.__DGB_LAWS_STATUS__ = status;
    window.__DGB_LAWS_RUNTIME_RECEIPT__ = RECEIPT;

    if (document.documentElement) {
      document.documentElement.dataset.lawsScriptReceipt = RECEIPT;
      document.documentElement.dataset.lawsScriptLoaded = "true";
      document.documentElement.dataset.lawsScriptHeavyRuntimeLoaded = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.visualPassClaimed = "false";
    }

    return status;
  }

  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function setupSingleOpenCards() {
    const cards = Array.from(document.querySelectorAll("details.law-card"));

    if (!cards.length) {
      return { cardCount: 0, singleOpenActive: false };
    }

    cards.forEach((card) => {
      card.addEventListener("toggle", () => {
        if (!card.open) return;

        cards.forEach((other) => {
          if (other !== card) other.open = false;
        });
      });
    });

    return { cardCount: cards.length, singleOpenActive: true };
  }

  function setupHashOpenCards() {
    const cards = Array.from(document.querySelectorAll("details.law-card[id]"));
    const byId = new Map(cards.map((card) => [card.id, card]));

    function openFromHash() {
      const id = String(window.location.hash || "").replace("#", "");
      if (!id || !byId.has(id)) return false;

      const target = byId.get(id);
      cards.forEach((card) => {
        card.open = card === target;
      });

      return true;
    }

    window.addEventListener("hashchange", openFromHash, { passive: true });
    return openFromHash();
  }

  function setupDiamondMotion() {
    const field = document.querySelector("[data-law-field]") || document.querySelector(".law-field");
    const nodes = Array.from(document.querySelectorAll(".law-diamond"));

    if (!field || !nodes.length || prefersReducedMotion()) {
      return {
        motionActive: false,
        nodeCount: nodes.length,
        reason: prefersReducedMotion() ? "reduced-motion" : "missing-field-or-nodes",
        stop: () => {}
      };
    }

    let start = 0;
    let raf = 0;
    let stopped = false;

    function frame(now) {
      if (stopped) return;
      if (!start) start = now;

      const rect = field.getBoundingClientRect();
      const t = ((now - start) / 1000) * 0.52;
      const ampX = Math.min(18, Math.max(8, rect.width * 0.022));
      const ampY = Math.min(13, Math.max(6, rect.height * 0.015));

      nodes.forEach((node, index) => {
        const phase = Number(node.dataset.phase || index * 0.392699);
        const loop = node.dataset.loop || "a";
        const foreground = node.classList.contains("forefront");
        const p = t + phase;
        const localAmpX = foreground ? ampX * 0.58 : ampX;
        const localAmpY = foreground ? ampY * 0.58 : ampY;

        let dx;
        let dy;

        if (loop === "a") {
          dx = Math.sin(p) * localAmpX;
          dy = Math.sin(p * 2) * localAmpY;
        } else {
          dx = Math.sin(p * 2) * localAmpX;
          dy = Math.sin(p) * localAmpY;
        }

        node.style.setProperty("--dx", `${dx.toFixed(2)}px`);
        node.style.setProperty("--dy", `${dy.toFixed(2)}px`);
      });

      raf = window.requestAnimationFrame(frame);
    }

    raf = window.requestAnimationFrame(frame);

    const stop = () => {
      stopped = true;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    window.addEventListener("pagehide", stop, { once: true });

    return {
      motionActive: true,
      nodeCount: nodes.length,
      reason: "active",
      stop
    };
  }

  function setupReceiptProtection() {
    const visibleReceiptNodes = Array.from(document.querySelectorAll(".receipt"));

    visibleReceiptNodes.forEach((node) => {
      node.hidden = true;
      node.setAttribute("aria-hidden", "true");
      node.setAttribute("data-debug-receipt", "hidden-by-laws-runtime");
    });

    return {
      visibleReceiptNodesHidden: visibleReceiptNodes.length,
      templateReceiptPresent: Boolean(document.querySelector("template[data-route-receipt]"))
    };
  }

  function boot() {
    const receiptProtection = setupReceiptProtection();
    const cards = setupSingleOpenCards();
    const hashOpened = setupHashOpenCards();
    const motion = setupDiamondMotion();

    publishStatus({
      booted: true,
      receiptProtection,
      cards,
      hashOpened,
      motion: {
        active: motion.motionActive,
        nodeCount: motion.nodeCount,
        reason: motion.reason
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
