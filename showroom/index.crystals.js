/* /showroom/index.crystals.js
   Showroom spherical cluster, projected cardinal labels, and primary-derived
   Compass-family prominence.
*/
(() => {
  "use strict";

  const SOURCE_URL = "./index.crystals.source.js";
  const SELECTION_URL =
    "./index.selection.js?v=SHOWROOM_PRIMARY_SELECTION_AND_SETTLEMENT_v1";

  const LABELS = Object.freeze({
    north: "Story",
    east: "Characters",
    south: "Mirrorland",
    west: "Mysteries"
  });

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    if (request.status < 200 || request.status >= 300) {
      throw new Error(`SHOWROOM_CRYSTALS_SOURCE_LOAD_FAILED:${request.status}`);
    }
    return request.responseText;
  }

  function loadSelectionSupport() {
    if (
      globalThis.SHOWROOM_PRIMARY_SELECTION ||
      document.querySelector("script[data-showroom-primary-selection]")
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = SELECTION_URL;
    script.async = false;
    script.dataset.showroomPrimarySelection = "true";
    script.addEventListener("error", () => {
      globalThis.dispatchEvent(
        new CustomEvent("SHOWROOM_PRIMARY_SELECTION_FAILURE", {
          detail: Object.freeze({ source: SELECTION_URL })
        })
      );
    }, { once: true });
    document.head.append(script);
  }

  function replaceRequired(source, before, after, identity) {
    if (!source.includes(before)) {
      throw new Error(`SHOWROOM_CRYSTALS_REQUIRED_PATTERN_MISSING:${identity}`);
    }
    return source.replace(before, after);
  }

  function replaceRegexRequired(source, pattern, replacement, identity) {
    if (!pattern.test(source)) {
      throw new Error(`SHOWROOM_CRYSTALS_REQUIRED_PATTERN_MISSING:${identity}`);
    }
    return source.replace(pattern, replacement);
  }

  function replaceSection(source, startMarker, endMarker, transform, identity) {
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker, start + startMarker.length);
    if (start < 0 || end < 0) {
      throw new Error(`SHOWROOM_CRYSTALS_SECTION_MISSING:${identity}`);
    }
    const section = source.slice(start, end);
    return source.slice(0, start) + transform(section) + source.slice(end);
  }

  function replaceMaterialValues(source, family, endMarker, values) {
    const startMarker = `    ${family}:\n      Object.freeze({`;
    return replaceSection(
      source,
      startMarker,
      endMarker,
      section => {
        let output = section;
        for (const [property, value] of Object.entries(values)) {
          const pattern = new RegExp(`(${property}:\\n\\s+)([0-9.]+)`);
          if (!pattern.test(output)) {
            throw new Error(
              `SHOWROOM_CRYSTALS_MATERIAL_PROPERTY_MISSING:${family}:${property}`
            );
          }
          output = output.replace(pattern, `$1${value}`);
        }
        return output;
      },
      `MATERIAL_${family}`
    );
  }

  function transformSource(source) {
    source = replaceSection(
      source,
      "  const ROOM_BASE_POSITIONS = Object.freeze({",
      "\n\n  const PALETTES = Object.freeze({",
      () => `  const ROOM_BASE_POSITIONS = Object.freeze({
    1:
      Object.freeze([
        0,
        0.60,
        -1.38
      ]),

    2:
      Object.freeze([
        1.87,
        0.414,
        0
      ]),

    3:
      Object.freeze([
        0,
        -0.72,
        1.33
      ]),

    4:
      Object.freeze([
        -1.92,
        -0.182,
        0
      ])
  });`,
      "EXPANDED_SPHERICAL_ROOM_CLUSTER"
    );

    source = replaceRequired(
      source,
      `    const candidates = [
      frame.cluster
        ? frame.cluster.activeChildId
        : "",`,
      `    const candidates = [
      frame.cluster
        ? frame.cluster.previewPrimaryRoom
        : "",

      frame.cluster
        ? frame.cluster.primaryRoom
        : "",

      frame.cluster
        ? frame.cluster.activeChildId
        : "",`,
      "CLUSTER_PREVIEW_PRIMARY"
    );

    source = replaceRequired(
      source,
      `    const candidates = [
      frame.selectedCardinal,`,
      `    const candidates = [
      frame.orbitPreviewFocus,

      frame.orbitFocus,

      frame.selectedCardinal,`,
      "CONSTELLATION_PREVIEW_PRIMARY"
    );

    source = replaceRequired(
      source,
      "    haloDisableWidth:\n      420",
      "    haloDisableWidth:\n      0",
      "HALO_MOBILE_CONTINUITY"
    );

    source = replaceMaterialValues(
      source,
      "CARDINAL",
      "\n\n    LOCAL:",
      { emissive: 0.17, rim: 1.02, sparkle: 0.26, halo: 0.82 }
    );
    source = replaceMaterialValues(
      source,
      "LOCAL",
      "\n\n    PORTAL:",
      { emissive: 0.12, rim: 0.82, sparkle: 0.16, halo: 0.44 }
    );
    source = replaceMaterialValues(
      source,
      "PORTAL",
      "\n\n    PRIMARY_PORTAL:",
      { emissive: 0.15, rim: 0.94, sparkle: 0.22, halo: 0.60 }
    );
    source = replaceMaterialValues(
      source,
      "PRIMARY_PORTAL",
      "\n  });\n\n  const state =",
      { emissive: 0.18, rim: 1.04, sparkle: 0.26, halo: 0.72 }
    );

    source = replaceRequired(
      source,
      `        vec3 haloColor =
          base * 0.45 +
          uRimColor *
          fresnel *
          0.92;

        float haloAlpha =
          clamp(
            (
              0.025 +
              fresnel * 0.18
            ) *
            uHaloStrength *
            uOpacity,
            0.0,
            0.28
          );`,
      `        vec3 haloColor =
          base * 0.62 +
          uRimColor *
          fresnel *
          1.18;

        float haloAlpha =
          clamp(
            (
              0.04 +
              fresnel * 0.26
            ) *
            uHaloStrength *
            uOpacity,
            0.0,
            0.42
          );`,
      "COMPASS_FAMILY_HALO_SHADER"
    );

    source = replaceRegexRequired(
      source,
      /material\.emissive \*\s*1\.28,\s*0,\s*0\.55/,
      `material.emissive *\n              1.72,\n              0,\n              0.76`,
      "PRIMARY_EMISSIVE_PROMINENCE"
    );

    source = replaceRegexRequired(
      source,
      /material\.rim \*\s*1\.18,\s*0,\s*1\.7/,
      `material.rim *\n              1.46,\n              0,\n              2.0`,
      "PRIMARY_RIM_PROMINENCE"
    );

    source = replaceRegexRequired(
      source,
      /material\.sparkle \*\s*1\.24,\s*0,\s*0\.52/,
      `material.sparkle *\n                    1.68,\n                    0,\n                    0.72`,
      "PRIMARY_SPARKLE_PROMINENCE"
    );

    source = replaceRegexRequired(
      source,
      /material\.halo \*\s*1\.18,\s*0,\s*1\.4/,
      `material.halo *\n              1.72,\n              0,\n              1.8`,
      "PRIMARY_HALO_PROMINENCE"
    );

    return source;
  }

  function installProjectedCardinalLabels() {
    const root = document.querySelector("[data-showroom-root]");
    const field = root && root.querySelector("[data-showroom-orbit-field]");
    const controller =
      globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER;

    if (
      !root ||
      !field ||
      !controller ||
      typeof controller.getFrameState !== "function"
    ) {
      return false;
    }

    let layer = field.querySelector(
      "[data-showroom-projected-cardinal-labels]"
    );
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "showroom-projected-cardinal-labels";
      layer.dataset.showroomProjectedCardinalLabels = "true";
      field.append(layer);
    }

    if (!document.getElementById("showroom-projected-cardinal-label-style")) {
      const style = document.createElement("style");
      style.id = "showroom-projected-cardinal-label-style";
      style.textContent = `
.showroom-projected-cardinal-labels {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}
.showroom-projected-cardinal-label {
  position: absolute;
  display: block;
  min-width: 4.5rem;
  padding: .38rem .56rem;
  border: 0;
  color: rgba(246, 238, 223, .94);
  background: transparent;
  font: 850 clamp(.62rem, 1.35vw, .78rem)/1.05 Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: .085em;
  text-align: center;
  text-transform: uppercase;
  text-shadow:
    0 .1rem .18rem rgba(0, 0, 0, .98),
    0 0 .45rem rgba(0, 0, 0, .98),
    0 0 .85rem rgba(117, 233, 255, .28);
  white-space: nowrap;
  cursor: pointer;
  pointer-events: auto;
  transform: translate(-50%, -50%);
  transform-origin: center;
  transition: opacity 150ms ease, filter 150ms ease, transform 150ms ease;
}
.showroom-projected-cardinal-label[data-depth-layer="rear"] {
  opacity: .48;
  filter: saturate(.72) brightness(.72);
  transform: translate(-50%, -50%) scale(.88);
}
.showroom-projected-cardinal-label[data-depth-layer="front"] {
  opacity: .9;
}
.showroom-projected-cardinal-label[data-primary="true"] {
  opacity: 1;
  color: #fff2bd;
  filter: brightness(1.14) drop-shadow(0 0 .55rem rgba(245, 213, 130, .42));
  transform: translate(-50%, -50%) scale(1.08);
}
.showroom-projected-cardinal-label:hover,
.showroom-projected-cardinal-label:focus-visible {
  color: #fff7d7;
  filter: brightness(1.18) drop-shadow(0 0 .7rem rgba(117, 233, 255, .4));
}
.showroom-projected-cardinal-label:focus-visible {
  outline: 2px solid rgba(117, 233, 255, .9);
  outline-offset: .16rem;
  border-radius: .4rem;
}
`;
      document.head.append(style);
    }

    const controls = new Map();
    for (const [wing, label] of Object.entries(LABELS)) {
      let control = layer.querySelector(
        `[data-showroom-projected-cardinal-label="${wing}"]`
      );
      if (!control) {
        control = document.createElement("button");
        control.type = "button";
        control.className = "showroom-projected-cardinal-label";
        control.dataset.showroomProjectedCardinalLabel = wing;
        control.textContent = label;
        control.setAttribute("aria-label", `Open ${label}`);
        control.addEventListener("click", event => {
          event.preventDefault();
          const activeController =
            globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER;
          if (
            activeController &&
            typeof activeController.requestCardinalSelection === "function"
          ) {
            activeController.requestCardinalSelection(wing);
          }
        });
        layer.append(control);
      }
      controls.set(wing, control);
    }

    function apply(records) {
      const frame = controller.getFrameState();
      const constellation =
        frame &&
        frame.presentationMode === "CONSTELLATION" &&
        frame.held !== true;
      const fieldRect = field.getBoundingClientRect();
      const centerX = fieldRect.width * 0.5;
      const centerY = fieldRect.height * 0.5;
      const byId = new Map(
        Array.from(records || []).map(record => [String(record.id || ""), record])
      );

      for (const [wing, control] of controls) {
        const record = byId.get(wing);
        if (!constellation || !record || record.visible === false) {
          control.hidden = true;
          continue;
        }

        const x = Number(record.x);
        const y = Number(record.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          control.hidden = true;
          continue;
        }

        const dx = x - centerX;
        const dy = y - centerY;
        const length = Math.hypot(dx, dy) || 1;
        const radius = Math.max(28, Number(record.radiusPx) || 28);
        const outward = Math.min(62, Math.max(34, radius * 0.66 + 10));

        control.hidden = false;
        control.style.left = `${x + (dx / length) * outward}px`;
        control.style.top = `${y + (dy / length) * outward}px`;
        control.style.zIndex = String(record.depthLayer === "rear" ? 2 : 7);
        control.dataset.depthLayer = String(
          record.depthLayer || "unknown"
        ).toLowerCase();
        control.dataset.primary = String(
          wing === String(frame.orbitPreviewFocus || frame.orbitFocus || "")
        );
      }
    }

    let records = typeof controller.getSemanticProjection === "function"
      ? controller.getSemanticProjection()
      : [];
    apply(records);

    if (typeof controller.subscribeSemanticProjection === "function") {
      controller.subscribeSemanticProjection(next => {
        records = Array.from(next || []);
        apply(records);
      });
    }
    if (typeof controller.subscribeFrameState === "function") {
      controller.subscribeFrameState(() => apply(records));
    }
    window.addEventListener("resize", () => apply(records), { passive: true });

    return true;
  }

  function publish(detail = {}) {
    const receipt = Object.freeze({
      module: "SHOWROOM_PRIMARY_SELECTION_CLUSTER_PRESENTATION",
      source: SOURCE_URL,
      selectionSupport: SELECTION_URL,
      labels: LABELS,
      clusterGeometry: "EXPANDED_MAIN_COMPASS_SPHERICAL_DEPTH",
      glow: "PRIMARY_SELECTION_DERIVED",
      ...detail
    });
    globalThis.SHOWROOM_SPHERICAL_CLUSTER_PRESENTATION = receipt;
    return receipt;
  }

  try {
    loadSelectionSupport();
    installProjectedCardinalLabels();
    let source = transformSource(loadSourceSynchronously(SOURCE_URL));
    source += "\n//# sourceURL=/showroom/index.crystals.primary-selection.js";
    (0, eval)(source);
    publish({ installed: true });
  } catch (error) {
    publish({
      installed: false,
      error: error instanceof Error ? error.message : String(error)
    });
    globalThis.dispatchEvent(
      new CustomEvent("SHOWROOM_CRYSTALS_FAILURE", {
        detail: Object.freeze({
          reason: "primary-selection-cluster-presentation-installation",
          error: error instanceof Error ? error.message : String(error)
        })
      })
    );
    throw error;
  }
})();
