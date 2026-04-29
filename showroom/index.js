/*
  /showroom/index.js
  SHOWROOM_PARENT_BOOT_v1

  Boot-only owner.
  Does not rebuild layout.
  Does not own CSS.
  Does not own standalone globe route.
*/

(function () {
  "use strict";

  const VERSION = "showroom-parent-boot-v1";

  function writeBootReceipts(status) {
    const nodes = [
      document.getElementById("showroom-root"),
      document.getElementById("showroom-main"),
      document.getElementById("showroom-globe-mount")
    ];

    nodes.forEach(function (node) {
      if (!node) return;

      node.dataset.showroomParentBoot = VERSION;
      node.dataset.generation1LayoutEstablished = "true";
      node.dataset.generation2ActiveGlobe = status;
      node.dataset.generation3 = "shadow-detail-blocked-until-generation-2-pass";
      node.dataset.showroomCardGlobeHandoff = "active";
      node.dataset.demoUniverseCardPreview = "active";
    });
  }

  function renderFallback(reason) {
    const mount = document.getElementById("showroom-globe-mount");
    if (!mount) return;

    mount.dataset.renderStatus = "parent-boot-fallback";
    mount.dataset.fallbackReason = reason || "unknown";

    if (mount.children.length > 0) return;

    const link = document.createElement("a");
    link.className = "showroom-generation-2-link";
    link.href = "/showroom/globe/";
    link.textContent = "Open Demo Universe Earth";

    const caption = document.createElement("p");
    caption.className = "showroom-generation-2-caption";
    caption.textContent = "GENERATION 2 · ACTIVE GLOBE FALLBACK";

    mount.appendChild(caption);
    mount.appendChild(link);
  }

  function boot() {
    writeBootReceipts("booting");

    if (window.DGBShowroomRuntime && typeof window.DGBShowroomRuntime.start === "function") {
      window.DGBShowroomRuntime.start();
    }

    if (!window.DGBShowroomRender || typeof window.DGBShowroomRender.renderParentGlobe !== "function") {
      writeBootReceipts("render-spine-missing");
      renderFallback("DGBShowroomRender missing");
      return;
    }

    const result = window.DGBShowroomRender.renderParentGlobe();

    if (result && result.ok) {
      writeBootReceipts("visible-target-mounted");

      if (
        window.DGBShowroomRuntime &&
        typeof window.DGBShowroomRuntime.setActiveGlobeStatus === "function"
      ) {
        window.DGBShowroomRuntime.setActiveGlobeStatus("visible-target-mounted");
      }

      return;
    }

    writeBootReceipts("render-failed");
    renderFallback(result && result.reason ? result.reason : "render failed");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.DGBShowroomParentBoot = Object.freeze({
    version: VERSION,
    boot
  });
})();
