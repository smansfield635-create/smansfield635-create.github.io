/*
  /showroom/showroom.render.js
  SHOWROOM_PARENT_RENDER_SPINE_v1

  Parent Showroom render caller.
  Consumes /assets/showroom.globe.instrument.js.
*/

(function () {
  "use strict";

  const VERSION = "showroom-parent-render-spine-v1";
  const MOUNT_ID = "showroom-globe-mount";

  function getInstrument() {
    return window.DGBShowroomGlobeInstrument || null;
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
    mount.setAttribute("aria-label", "Showroom Generation 2 active Earth globe");

    if (visualPanel) {
      visualPanel.appendChild(mount);
      return mount;
    }

    const main = document.getElementById("showroom-main") || document.body;
    main.prepend(mount);
    return mount;
  }

  function renderParentGlobe() {
    const instrument = getInstrument();
    const mount = ensureMount();

    if (!instrument || typeof instrument.renderGlobe !== "function") {
      mount.dataset.renderStatus = "instrument-missing";
      mount.replaceChildren();

      const fallback = document.createElement("p");
      fallback.className = "showroom-generation-2-caption";
      fallback.textContent = "GENERATION 2 · ACTIVE GLOBE INSTRUMENT MISSING";
      mount.appendChild(fallback);

      return {
        ok: false,
        reason: "DGBShowroomGlobeInstrument missing"
      };
    }

    instrument.renderGlobe(mount, {
      context: "parent",
      caption: "GENERATION 2 · ACTIVE GLOBE · EARTH SURFACE RESTORED"
    });

    instrument.writeReceipts(mount, "parent", {
      showroomParentRenderSpine: VERSION,
      generation2ActiveGlobe: "mounted"
    });

    return {
      ok: true,
      mount
    };
  }

  window.DGBShowroomRender = Object.freeze({
    version: VERSION,
    renderParentGlobe
  });
})();
