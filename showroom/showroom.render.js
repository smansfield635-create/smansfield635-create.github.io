/*
  /showroom/showroom.render.js
  SHOWROOM_PARENT_RENDER_BRIDGE_GEN3_CAPTION_CONGRUENCE_TNT_v1

  Owns:
  - parent render bridge
  - parent mount discovery/creation
  - parent caption passed into the current Generation 3 asset instrument
  - parent render bridge receipts

  Does not own:
  - runtime tick
  - CSS animation
  - asset paths
  - route rail
  - page structure
  - Gauges logic
  - standalone globe route
*/

(function () {
  "use strict";

  const VERSION = "showroom-parent-render-bridge-gen3-caption-congruence-v1";
  const MOUNT_ID = "showroom-globe-mount";
  const PARENT_CAPTION = "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE";

  function getInstrument() {
    return window.DGBShowroomGlobeInstrument || null;
  }

  function writeDataset(node, values) {
    if (!node) return;

    Object.entries(values || {}).forEach(function (entry) {
      node.dataset[entry[0]] = String(entry[1]);
    });
  }

  function baseReceipts() {
    return {
      showroomParentRenderBridge: VERSION,
      generation1NoGraphicBaseline: "preserved",
      generation2BaselineGraphics: "preserved",
      generation2ActiveGlobe: "preserved",
      generation3: "axis-rotation-depth-refinement-active",
      generation3AxisRotationDepth: "active",
      generation3RuntimeMotion: "active",
      generation3VisualClarityRefinement: "active",
      generation3VisualTruth: "pending-user-confirmation",
      showroomGeneration3ParentRenderCongruence: "active",
      latticeFunctionalState: "254-of-256",
      latticeResolvedBit: "B6_PARENT_RENDER_CONGRUENCE"
    };
  }

  function ensureMount() {
    const existing = document.getElementById(MOUNT_ID);
    if (existing) return existing;

    const visualPanel =
      document.querySelector(".visual-panel") ||
      document.querySelector(".showroom-globe") ||
      document.querySelector("[data-showroom-globe='active']");

    const mount = document.createElement("div");
    mount.id = MOUNT_ID;
    mount.className = "showroom-globe-mount showroom-globe showroom-earth-color showroom-earth-clouds showroom-earth-atmosphere";
    mount.setAttribute("data-showroom-globe-mount", "true");
    mount.setAttribute("data-render-created-by", VERSION);
    mount.setAttribute("data-generation-2-active-globe", "preserved");
    mount.setAttribute("data-generation-3-axis-rotation-depth", "active");
    mount.setAttribute("data-generation-3-visual-truth", "pending-user-confirmation");
    mount.setAttribute("aria-label", "Showroom Generation 3 axis rotation and shadow depth Earth globe");

    if (visualPanel) {
      visualPanel.appendChild(mount);
    } else {
      const main = document.getElementById("showroom-main");
      (main || document.body).prepend(mount);
    }

    return mount;
  }

  function normalizeCaption(mount) {
    if (!mount) return;

    const caption =
      mount.querySelector(".showroom-generation-3-caption") ||
      mount.querySelector(".showroom-generation-2-caption");

    if (caption) {
      caption.textContent = PARENT_CAPTION;
      caption.dataset.captionStatus = "generation-3-parent-render-congruent";
      caption.dataset.captionOwner = VERSION;
    }
  }

  function writeParentReceipts(mount) {
    const receipts = baseReceipts();

    [
      document.getElementById("showroom-root"),
      document.getElementById("showroom-main"),
      mount
    ].forEach(function (node) {
      writeDataset(node, receipts);
    });

    if (mount) {
      mount.dataset.renderStatus = "generation-3-parent-render-congruent";
      mount.dataset.showroomGlobePlacement = "generation-3-axis-rotation-depth";
    }
  }

  function renderFallback(mount, reason) {
    if (!mount) return { ok: false, reason: reason || "mount missing" };

    mount.dataset.renderStatus = "parent-render-bridge-fallback";
    mount.dataset.fallbackReason = reason || "unknown";
    mount.replaceChildren();

    const caption = document.createElement("p");
    caption.className = "showroom-generation-2-caption showroom-generation-3-caption";
    caption.textContent = PARENT_CAPTION;
    caption.dataset.captionStatus = "generation-3-parent-render-fallback";

    const link = document.createElement("a");
    link.className = "showroom-generation-2-link showroom-generation-3-link";
    link.href = "/showroom/globe/";
    link.textContent = "Open Demo Universe Earth";

    mount.appendChild(caption);
    mount.appendChild(link);
    writeParentReceipts(mount);

    return { ok: false, reason: reason || "fallback rendered", mount: mount };
  }

  function renderParentGlobe() {
    const mount = ensureMount();
    const instrument = getInstrument();

    if (!instrument || typeof instrument.renderGlobe !== "function") {
      return renderFallback(mount, "DGBShowroomGlobeInstrument missing");
    }

    try {
      instrument.renderGlobe(mount, {
        context: "parent",
        caption: PARENT_CAPTION
      });

      if (typeof instrument.writeReceipts === "function") {
        instrument.writeReceipts(mount, "parent", Object.assign({}, baseReceipts(), {
          renderContext: "parent",
          parentCaption: PARENT_CAPTION
        }));
      }

      writeParentReceipts(mount);
      normalizeCaption(mount);

      window.setTimeout(function () {
        writeParentReceipts(mount);
        normalizeCaption(mount);
      }, 250);

      window.setTimeout(function () {
        writeParentReceipts(mount);
        normalizeCaption(mount);
      }, 1200);

      return { ok: true, mount: mount, version: VERSION };
    } catch (error) {
      return renderFallback(
        mount,
        error && error.message ? error.message : String(error)
      );
    }
  }

  window.DGBShowroomRender = Object.freeze({
    version: VERSION,
    renderParentGlobe: renderParentGlobe,
    ensureMount: ensureMount,
    normalizeCaption: normalizeCaption
  });
})();
