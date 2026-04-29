/*
  /showroom/globe/index.js
  DEMO_UNIVERSE_EARTH_GENERATION_3_STANDALONE_CONSUMER_CONGRUENCE_TNT_v1

  Owns standalone boot and standalone consumer status only.
  Does not control parent Showroom, asset primitive, CSS, Gauges, or raw media.
*/

(function () {
  "use strict";

  const VERSION = "demo-universe-earth-generation-3-standalone-consumer-congruence-v1";
  const MOUNT_ID = "showroom-globe-mount";

  let attempts = 0;
  const maxAttempts = 20;

  function writeDataset(node, values) {
    if (!node) return;

    Object.entries(values).forEach(function (entry) {
      node.dataset[entry[0]] = String(entry[1]);
    });
  }

  function standaloneDataset(status) {
    return {
      demoUniverseEarthBoot: VERSION,
      generation2StandaloneGlobe: "preserved",
      generation2ActiveGlobe: "visible",
      generation3: "axis-rotation-depth-refinement-active",
      generation3AxisRotationDepth: "active",
      generation3RuntimeMotion: "active",
      generation3VisualClarityRefinement: "active",
      generation3VisualTruth: "pending-user-confirmation",
      renderStatus: status || "standalone-generation-3-axis-rotation-depth-mounted"
    };
  }

  function normalizeCaption() {
    const caption =
      document.querySelector("#" + MOUNT_ID + " .showroom-generation-3-caption") ||
      document.querySelector("#" + MOUNT_ID + " .showroom-generation-2-caption");

    if (caption) {
      caption.textContent = "GENERATION 3 · DEMO UNIVERSE EARTH · AXIS ROTATION ACTIVE";
      caption.dataset.captionStatus = "generation-3-standalone-congruent";
    }
  }

  function normalizeTelemetry() {
    Array.from(document.querySelectorAll("#" + MOUNT_ID + " .showroom-generation-3-telemetry span")).forEach(function (node) {
      if (node.textContent === "context=standalone") node.dataset.contextReceipt = "standalone";
    });
  }

  function writeStandaloneReceipts(mount, status) {
    if (!mount) return;

    writeDataset(mount, standaloneDataset(status));
    normalizeCaption();
    normalizeTelemetry();
  }

  function renderFallback(mount) {
    mount.dataset.renderStatus = "instrument-missing";
    mount.replaceChildren();

    const caption = document.createElement("p");
    caption.className = "showroom-generation-2-caption showroom-generation-3-caption";
    caption.textContent = "GENERATION 3 · DEMO UNIVERSE EARTH · INSTRUMENT MISSING";

    const link = document.createElement("a");
    link.className = "showroom-generation-2-link showroom-generation-3-link";
    link.href = "/showroom/";
    link.textContent = "Return to Showroom";

    mount.appendChild(caption);
    mount.appendChild(link);
  }

  function bootStandaloneGlobe() {
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) return;

    const instrument = window.DGBShowroomGlobeInstrument;

    if (!instrument || typeof instrument.renderGlobe !== "function") {
      attempts += 1;

      if (attempts < maxAttempts) {
        window.setTimeout(bootStandaloneGlobe, 100);
        return;
      }

      renderFallback(mount);
      return;
    }

    instrument.renderGlobe(mount, {
      context: "standalone",
      caption: "GENERATION 3 · DEMO UNIVERSE EARTH · AXIS ROTATION ACTIVE"
    });

    if (typeof instrument.writeReceipts === "function") {
      instrument.writeReceipts(mount, "standalone", {
        demoUniverseEarthBoot: VERSION,
        generation2StandaloneGlobe: "preserved",
        generation2ActiveGlobe: "visible",
        generation3AxisRotationDepth: "active",
        generation3RuntimeMotion: "active",
        generation3VisualClarityRefinement: "active",
        generation3VisualTruth: "pending-user-confirmation"
      });
    }

    writeStandaloneReceipts(mount, "standalone-generation-3-axis-rotation-depth-mounted");

    window.setTimeout(function () {
      writeStandaloneReceipts(mount, "standalone-generation-3-axis-rotation-depth-mounted");
    }, 300);

    window.setTimeout(function () {
      writeStandaloneReceipts(mount, "standalone-generation-3-axis-rotation-depth-mounted");
    }, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootStandaloneGlobe, { once: true });
  } else {
    bootStandaloneGlobe();
  }

  window.DGBDemoUniverseEarth = Object.freeze({
    version: VERSION,
    bootStandaloneGlobe: bootStandaloneGlobe,
    writeStandaloneReceipts: writeStandaloneReceipts
  });
})();
