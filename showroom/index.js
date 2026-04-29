/*
  /showroom/index.js
  SHOWROOM_GENERATION_3_PARENT_CONSUMER_CONGRUENCE_TNT_v1

  Owns parent boot and parent consumer status only.
  Does not own asset primitive, runtime loop, CSS, route rail, or Gauges.
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-3-parent-consumer-congruence-v1";
  const EARTH_SURFACE = "/assets/earth/earth_surface_2048.jpg";
  const EARTH_CLOUDS = "/assets/earth/earth_clouds_2048.jpg";
  const MOUNT_ID = "showroom-globe-mount";

  let attempts = 0;
  const maxAttempts = 20;

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function statusDataset(status) {
    return {
      showroomParentBoot: VERSION,
      generation1NoGraphicBaseline: "preserved",
      generation2BaselineGraphics: "preserved",
      generation2ActiveGlobe: status || "preserved",
      generation3: "axis-rotation-depth-refinement-active",
      generation3AxisRotationDepth: "active",
      generation3RuntimeMotion: "active",
      generation3VisualClarityRefinement: "active",
      generation3VisualTruth: "pending-user-confirmation",
      showroomCardGlobeHandoff: "active",
      demoUniverseCardPreview: "active",
      earthSurface: EARTH_SURFACE,
      earthClouds: EARTH_CLOUDS
    };
  }

  function writeDataset(node, values) {
    if (!node) return;

    Object.entries(values).forEach(function (entry) {
      node.dataset[entry[0]] = String(entry[1]);
    });
  }

  function writeParentReceipts(status) {
    [
      document.getElementById("showroom-root"),
      document.getElementById("showroom-main"),
      document.getElementById(MOUNT_ID)
    ].forEach(function (node) {
      writeDataset(node, statusDataset(status));
    });
  }

  function normalizeCaption() {
    const caption =
      document.querySelector("#" + MOUNT_ID + " .showroom-generation-3-caption") ||
      document.querySelector("#" + MOUNT_ID + " .showroom-generation-2-caption");

    if (caption) {
      caption.textContent = "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE";
      caption.dataset.captionStatus = "generation-3-parent-congruent";
    }
  }

  function normalizeTelemetry() {
    qsa("#" + MOUNT_ID + " .showroom-generation-3-telemetry span").forEach(function (node) {
      if (node.textContent === "context=parent") node.dataset.contextReceipt = "parent";
    });
  }

  function normalizeMount(status) {
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) return;

    writeDataset(mount, statusDataset(status || "generation-3-axis-rotation-depth-mounted"));

    mount.dataset.renderStatus = "generation-3-parent-consumer-congruent";
    mount.dataset.generation3AxisRotationDepth = "active";
    mount.dataset.generation3RuntimeMotion = "active";
    mount.dataset.generation3VisualClarityRefinement = "active";
    mount.dataset.generation3VisualTruth = "pending-user-confirmation";

    normalizeCaption();
    normalizeTelemetry();
  }

  function renderFallback(reason) {
    const mount = document.getElementById(MOUNT_ID);
    if (!mount || mount.children.length > 0) return;

    mount.dataset.renderStatus = "parent-boot-fallback";
    mount.dataset.fallbackReason = reason || "unknown";

    const caption = document.createElement("p");
    caption.className = "showroom-generation-2-caption showroom-generation-3-caption";
    caption.textContent = "GENERATION 3 · AXIS ROTATION FALLBACK";

    const link = document.createElement("a");
    link.className = "showroom-generation-2-link showroom-generation-3-link";
    link.href = "/showroom/globe/";
    link.textContent = "Open Demo Universe Earth";

    mount.appendChild(caption);
    mount.appendChild(link);
    normalizeMount("fallback");
  }

  function startRuntime() {
    if (window.DGBShowroomRuntime && typeof window.DGBShowroomRuntime.start === "function") {
      window.DGBShowroomRuntime.start();
    }
  }

  function notifyRuntime() {
    if (
      window.DGBShowroomRuntime &&
      typeof window.DGBShowroomRuntime.setActiveGlobeStatus === "function"
    ) {
      window.DGBShowroomRuntime.setActiveGlobeStatus("generation-3-axis-rotation-depth-mounted");
    }

    if (
      window.DGBShowroomRuntime &&
      typeof window.DGBShowroomRuntime.setGeneration3MotionStatus === "function"
    ) {
      window.DGBShowroomRuntime.setGeneration3MotionStatus("axis-rotation-depth-active");
    }
  }

  function renderViaBridge() {
    if (window.DGBShowroomRender && typeof window.DGBShowroomRender.renderParentGlobe === "function") {
      return window.DGBShowroomRender.renderParentGlobe();
    }

    return null;
  }

  function renderViaInstrument() {
    const mount = document.getElementById(MOUNT_ID);
    const instrument = window.DGBShowroomGlobeInstrument;

    if (!mount || !instrument || typeof instrument.renderGlobe !== "function") return null;

    instrument.renderGlobe(mount, {
      context: "parent",
      caption: "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE"
    });

    if (typeof instrument.writeReceipts === "function") {
      instrument.writeReceipts(mount, "parent", {
        showroomParentBoot: VERSION,
        generation2ActiveGlobe: "preserved",
        generation3AxisRotationDepth: "active",
        generation3RuntimeMotion: "active",
        generation3VisualClarityRefinement: "active",
        generation3VisualTruth: "pending-user-confirmation"
      });
    }

    return { ok: true, mount: mount, source: "instrument-direct" };
  }

  function renderParentGlobe() {
    writeParentReceipts("booting");
    startRuntime();

    const result = renderViaBridge() || renderViaInstrument();

    if (result && result.ok) {
      writeParentReceipts("generation-3-axis-rotation-depth-mounted");
      normalizeMount("generation-3-axis-rotation-depth-mounted");
      notifyRuntime();

      window.setTimeout(function () {
        normalizeMount("generation-3-axis-rotation-depth-mounted");
        notifyRuntime();
      }, 300);

      window.setTimeout(function () {
        normalizeMount("generation-3-axis-rotation-depth-mounted");
        notifyRuntime();
      }, 1200);

      return;
    }

    attempts += 1;

    if (attempts < maxAttempts) {
      window.setTimeout(renderParentGlobe, 100);
      return;
    }

    writeParentReceipts("render-failed");
    renderFallback(result && result.reason ? result.reason : "render failed");
  }

  function boot() {
    renderParentGlobe();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.DGBShowroomParentBoot = Object.freeze({
    version: VERSION,
    boot: boot,
    renderParentGlobe: renderParentGlobe,
    normalizeMount: normalizeMount,
    earthSurface: EARTH_SURFACE,
    earthClouds: EARTH_CLOUDS
  });
})();
