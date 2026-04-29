/*
  /assets/showroom.globe.instrument.js
  SHOWROOM_GLOBE_INSTRUMENT_CONTEXT_ISOLATED_GEN3_OBJECT_TNT_v1

  Renewal duties:
  1. Emit Generation 3 visual classes only.
  2. Split parent-context receipts from standalone-context receipts.

  Preserved:
  - window.DGBShowroomGlobeInstrument
  - renderGlobe(mount, options)
  - writeReceipts(node, context, extra)
  - parent Showroom compatibility
  - standalone Demo Universe Earth compatibility
  - Earth surface / cloud assets
  - axis, rotation, shadow, depth, terminator, atmosphere, telemetry

  Removed from active visual emission:
  - showroom-generation-2-* DOM classes

  Generation 2 remains as receipt data only.
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-3-context-isolated-instrument-v1";

  const ASSETS = Object.freeze({
    earthSurface: "/assets/earth/earth_surface_2048.jpg",
    earthClouds: "/assets/earth/earth_clouds_2048.jpg",
    parentRoute: "/showroom/",
    globeRoute: "/showroom/globe/"
  });

  const GENERATIONS = Object.freeze({
    generation1: "no-graphic-baseline-preserved",
    generation2: "baseline-graphics-preserved-as-receipt-only",
    generation3: "context-isolated-shared-globe-object"
  });

  const CONTEXTS = Object.freeze({
    parent: "parent",
    standalone: "standalone"
  });

  const MOTION = Object.freeze({
    axisTiltDegrees: 23.5,
    rotationDirection: "east-west",
    surfaceRotationPeriodSeconds: 18,
    cloudRotationPeriodSeconds: 31,
    reducedMotionMode: "static-axis-shadow-preserved"
  });

  const GEN3 = Object.freeze({
    axis: "active",
    rotation: "active",
    runtimeMotion: "active",
    shadows: "active",
    depth: "active",
    colorDiscrimination: "active",
    moonReflection: "prepared",
    terminator: "active",
    atmosphere: "active",
    telemetry: "active",
    detail: "active",
    visualTruth: "pending-user-visual-confirmation",
    objectPurification: "active",
    contextIsolation: "active",
    legacyVisualClassEmission: "removed"
  });

  const LEGACY_VISUAL_CLASSES = Object.freeze([
    "showroom-generation-2-shell",
    "showroom-generation-2-orbit",
    "showroom-generation-2-active-globe",
    "showroom-generation-2-earth-surface",
    "showroom-generation-2-earth-clouds",
    "showroom-generation-2-light",
    "showroom-generation-2-rim",
    "showroom-generation-2-caption",
    "showroom-generation-2-link"
  ]);

  function normalizeContext(context) {
    return context === CONTEXTS.standalone ? CONTEXTS.standalone : CONTEXTS.parent;
  }

  function create(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];

      if (value === null || value === undefined || value === false) return;

      if (key === "className") {
        node.className = value;
      } else if (key === "text") {
        node.textContent = value;
      } else {
        node.setAttribute(key, String(value));
      }
    });

    (children || []).forEach(function (child) {
      if (typeof child === "string") {
        node.appendChild(document.createTextNode(child));
      } else if (child) {
        node.appendChild(child);
      }
    });

    return node;
  }

  function setDataset(node, values) {
    if (!node) return;

    Object.entries(values || {}).forEach(function (entry) {
      node.dataset[entry[0]] = String(entry[1]);
    });
  }

  function removeDatasetKeys(node, keys) {
    if (!node) return;

    keys.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
        delete node.dataset[key];
      }
    });
  }

  function stripLegacyVisualClasses(root) {
    if (!root) return;

    const nodes = [root].concat(Array.from(root.querySelectorAll("*")));

    nodes.forEach(function (node) {
      if (!node.classList) return;

      LEGACY_VISUAL_CLASSES.forEach(function (className) {
        node.classList.remove(className);
      });
    });
  }

  function getContextReceipts(context) {
    const normalized = normalizeContext(context);

    const base = {
      showroomGlobeInstrument: VERSION,
      worldKernelCompatible: "true",
      worldPlanetEngineCompatible: "true",
      assetInstrument: "showroom-globe",

      generation1NoGraphicBaseline: "preserved",
      generation2BaselineGraphics: "preserved",
      generation2ActiveGlobe: "preserved",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",

      generation3: GENERATIONS.generation3,
      generation3FullExpression: "axis-rotation-depth-refinement-active",
      generation3ObjectPurification: GEN3.objectPurification,
      generation3ContextIsolation: GEN3.contextIsolation,
      generation3VisualTruth: GEN3.visualTruth,
      generation3Axis: GEN3.axis,
      generation3AxisTiltDegrees: String(MOTION.axisTiltDegrees),
      generation3Rotation: GEN3.rotation,
      generation3RuntimeMotion: GEN3.runtimeMotion,
      generation3RotationDirection: MOTION.rotationDirection,
      generation3SurfaceRotationPeriodSeconds: String(MOTION.surfaceRotationPeriodSeconds),
      generation3CloudRotationPeriodSeconds: String(MOTION.cloudRotationPeriodSeconds),
      generation3Shadows: GEN3.shadows,
      generation3Depth: GEN3.depth,
      generation3ColorDiscrimination: GEN3.colorDiscrimination,
      generation3MoonReflection: GEN3.moonReflection,
      generation3Terminator: GEN3.terminator,
      generation3Atmosphere: GEN3.atmosphere,
      generation3Telemetry: GEN3.telemetry,
      generation3Detail: GEN3.detail,

      legacyScaffoldStatus: "visual-class-emission-removed",
      contextIsolationStatus: "active",
      earthSurface: ASSETS.earthSurface,
      earthClouds: ASSETS.earthClouds,
      renderContext: normalized
    };

    if (normalized === CONTEXTS.standalone) {
      return Object.assign(base, {
        activeRouteRole: "demo-universe-earth",
        standaloneRole: "demo-universe-earth",
        showroomGlobeRoute: ASSETS.globeRoute,
        parentRouteAvailable: ASSETS.parentRoute,
        contextReceiptMode: "standalone-isolated",
        contextCaption: "GENERATION 3 · DEMO UNIVERSE EARTH · AXIS ROTATION ACTIVE"
      });
    }

    return Object.assign(base, {
      activeRouteRole: "showroom-proof-surface",
      parentRole: "showroom-proof-surface",
      showroomParentRoute: ASSETS.parentRoute,
      globeRouteAvailable: ASSETS.globeRoute,
      contextReceiptMode: "parent-isolated",
      contextCaption: "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE"
    });
  }

  function enforceContextIsolation(node, context) {
    const normalized = normalizeContext(context);

    if (!node) return;

    stripLegacyVisualClasses(node);

    if (normalized === CONTEXTS.parent) {
      removeDatasetKeys(node, [
        "showroomGlobeRoute",
        "standaloneRole",
        "demoUniverseEarthBoot",
        "generation2StandaloneGlobe"
      ]);

      setDataset(node, {
        renderContext: "parent",
        parentRole: "showroom-proof-surface",
        showroomParentRoute: ASSETS.parentRoute,
        globeRouteAvailable: ASSETS.globeRoute,
        contextReceiptMode: "parent-isolated"
      });
    } else {
      removeDatasetKeys(node, [
        "showroomParentRoute",
        "parentRole",
        "showroomParentBoot",
        "showroomParentRenderBridge"
      ]);

      setDataset(node, {
        renderContext: "standalone",
        standaloneRole: "demo-universe-earth",
        showroomGlobeRoute: ASSETS.globeRoute,
        parentRouteAvailable: ASSETS.parentRoute,
        contextReceiptMode: "standalone-isolated"
      });
    }
  }

  function installContextGuard(mount, context) {
    const normalized = normalizeContext(context);

    enforceContextIsolation(mount, normalized);

    if (!mount || mount.dataset.contextGuardInstalled === VERSION + ":" + normalized) return;

    mount.dataset.contextGuardInstalled = VERSION + ":" + normalized;

    let locked = false;

    const guard = function () {
      if (locked) return;
      locked = true;

      window.requestAnimationFrame(function () {
        enforceContextIsolation(mount, normalized);
        locked = false;
      });
    };

    const observer = new MutationObserver(guard);

    observer.observe(mount, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "data-showroom-globe-route", "data-showroom-parent-route"]
    });

    window.setTimeout(guard, 200);
    window.setTimeout(guard, 900);
    window.setTimeout(guard, 1800);
  }

  function createTelemetryNode(context) {
    const normalized = normalizeContext(context);

    return create(
      "div",
      {
        className: "showroom-generation-3-telemetry",
        "data-generation-3-telemetry": "active",
        "data-generation-3-object-purification": "active",
        "data-generation-3-context-isolation": "active",
        "aria-label": "Generation 3 telemetry receipt"
      },
      [
        create("span", { text: "GEN 3" }),
        create("span", { text: "axis=23.5°" }),
        create("span", { text: "rotation=active" }),
        create("span", { text: "shadow=active" }),
        create("span", { text: "depth=active" }),
        create("span", { text: "terminator=active" }),
        create("span", { text: "atmosphere=active" }),
        create("span", { text: "object=purified" }),
        create("span", { text: "context=" + normalized })
      ]
    );
  }

  function captionForContext(context, override) {
    if (override) return override;

    return normalizeContext(context) === CONTEXTS.standalone
      ? "GENERATION 3 · DEMO UNIVERSE EARTH · AXIS ROTATION ACTIVE"
      : "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE";
  }

  function linkForContext(context) {
    return normalizeContext(context) === CONTEXTS.standalone
      ? {
          href: ASSETS.parentRoute,
          text: "Return to Showroom"
        }
      : {
          href: ASSETS.globeRoute,
          text: "Open Demo Universe Earth"
        };
  }

  function createGlobeNode(options) {
    const config = options || {};
    const context = normalizeContext(config.context);
    const caption = captionForContext(context, config.caption);
    const link = linkForContext(context);

    const shell = create(
      "section",
      {
        className: "showroom-generation-3-shell",
        "data-showroom-generation-3-shell": "true",
        "data-generation-1-no-graphic-baseline": "preserved",
        "data-generation-2-baseline-graphics": "preserved",
        "data-generation-2-active-globe": "preserved",
        "data-generation-2-receipt-only": "true",
        "data-generation-2-visual-class-emission": "removed",
        "data-generation-3-full-expression": "axis-rotation-depth-refinement-active",
        "data-generation-3-object-purification": "active",
        "data-generation-3-context-isolation": "active",
        "data-generation-3-axis": "active",
        "data-generation-3-rotation": "active",
        "data-generation-3-runtime-motion": "active",
        "data-axis-tilt-degrees": String(MOTION.axisTiltDegrees),
        "data-render-context": context,
        "data-context-receipt-mode": context + "-isolated"
      },
      [
        create("div", {
          className: "showroom-generation-3-orbit",
          "data-generation-3-orbit": "subordinate-support",
          "aria-hidden": "true"
        }),

        create("span", {
          className: "showroom-generation-3-axis-line",
          "data-generation-3-axis-line": "active",
          "aria-hidden": "true"
        }),

        create("span", {
          className: "showroom-generation-3-axis-node showroom-generation-3-axis-node-north",
          "aria-hidden": "true"
        }),

        create("span", {
          className: "showroom-generation-3-axis-node showroom-generation-3-axis-node-south",
          "aria-hidden": "true"
        }),

        create(
          "div",
          {
            className: "showroom-generation-3-active-globe",
            role: "img",
            "data-generation-3-active-globe": "true",
            "data-generation-3-object-purification": "active",
            "data-generation-3-context-isolation": "active",
            "aria-label":
              context === CONTEXTS.standalone
                ? "Demo Universe Earth Generation 3 axis rotation globe"
                : "Showroom Generation 3 axis rotation Earth globe"
          },
          [
            create("img", {
              className: "showroom-generation-3-earth-surface",
              src: ASSETS.earthSurface,
              alt: "",
              decoding: "async",
              loading: "eager",
              "data-generation-3-earth-surface": "active",
              "aria-hidden": "true"
            }),

            create("img", {
              className: "showroom-generation-3-earth-clouds",
              src: ASSETS.earthClouds,
              alt: "",
              decoding: "async",
              loading: "eager",
              "data-generation-3-earth-clouds": "active",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-ocean-land-color",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-cloud-depth",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-light",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-terminator",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-night-depth",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-moon-reflection",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-atmosphere",
              "aria-hidden": "true"
            }),

            create("span", {
              className: "showroom-generation-3-rim",
              "aria-hidden": "true"
            })
          ]
        ),

        create("p", {
          className: "showroom-generation-3-caption",
          "data-generation-3-caption": "active",
          "data-generation-3-context-isolation": "active",
          text: caption
        }),

        createTelemetryNode(context),

        create("a", {
          className: "showroom-generation-3-link",
          href: link.href,
          text: link.text
        })
      ]
    );

    setDataset(shell, getContextReceipts(context));
    stripLegacyVisualClasses(shell);

    return shell;
  }

  function notifyRuntime(status) {
    const runtime = window.DGBShowroomRuntime;

    if (runtime && typeof runtime.setGeneration3MotionStatus === "function") {
      runtime.setGeneration3MotionStatus(status || "generation-3-context-isolated-mounted");
    }

    if (runtime && typeof runtime.setActiveGlobeStatus === "function") {
      runtime.setActiveGlobeStatus(status || "generation-3-context-isolated-mounted");
    }
  }

  function monitorAssetLoad(mount, context) {
    if (!mount) return;

    const normalized = normalizeContext(context);
    const surface = mount.querySelector(".showroom-generation-3-earth-surface");
    const clouds = mount.querySelector(".showroom-generation-3-earth-clouds");

    function update() {
      const surfaceLoaded = Boolean(surface && surface.complete && surface.naturalWidth > 0);
      const cloudsLoaded = Boolean(clouds && clouds.complete && clouds.naturalWidth > 0);

      mount.dataset.surfaceImg = surface ? "true" : "false";
      mount.dataset.surfaceImgLoaded = surfaceLoaded ? "true" : "false";
      mount.dataset.cloudImg = clouds ? "true" : "false";
      mount.dataset.cloudImgLoaded = cloudsLoaded ? "true" : "false";

      if (surfaceLoaded) {
        setDataset(mount, getContextReceipts(normalized));
        mount.dataset.renderStatus = "generation-3-context-isolated-visible";
        mount.dataset.showroomGlobePlacement = "generation-3-context-isolated";
        notifyRuntime("generation-3-context-isolated-visible");
      }

      enforceContextIsolation(mount, normalized);
    }

    if (surface) {
      surface.addEventListener("load", update, { once: true });
      surface.addEventListener("error", update, { once: true });
    }

    if (clouds) {
      clouds.addEventListener("load", update, { once: true });
      clouds.addEventListener("error", update, { once: true });
    }

    update();
    window.setTimeout(update, 300);
    window.setTimeout(update, 1200);
  }

  function renderGlobe(mount, options) {
    if (!mount) {
      throw new Error("Showroom globe instrument requires a mount node.");
    }

    const config = options || {};
    const context = normalizeContext(config.context);

    mount.replaceChildren(createGlobeNode(config));

    setDataset(mount, getContextReceipts(context));
    mount.dataset.renderStatus = "generation-3-context-isolated-mounted";
    mount.dataset.showroomGlobePlacement = "generation-3-context-isolated";

    enforceContextIsolation(mount, context);
    installContextGuard(mount, context);
    monitorAssetLoad(mount, context);
    notifyRuntime("generation-3-context-isolated-mounted");

    return mount;
  }

  function writeReceipts(node, context, extra) {
    const normalized = normalizeContext(context);

    setDataset(node, Object.assign({}, getContextReceipts(normalized), extra || {}));
    enforceContextIsolation(node, normalized);
  }

  async function verifyAssets() {
    const surface = await fetch(ASSETS.earthSurface, { cache: "no-store" });
    const clouds = await fetch(ASSETS.earthClouds, { cache: "no-store" });

    return {
      surfaceOk: surface.ok,
      surfaceStatus: surface.status,
      cloudsOk: clouds.ok,
      cloudsStatus: clouds.status,
      generation1NoGraphicBaseline: "preserved",
      generation2BaselineGraphics: "preserved",
      generation2ActiveGlobe: "preserved",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",
      generation3: GENERATIONS.generation3,
      generation3RuntimeMotion: GEN3.runtimeMotion,
      generation3Axis: GEN3.axis,
      generation3Rotation: GEN3.rotation,
      generation3ObjectPurification: GEN3.objectPurification,
      generation3ContextIsolation: GEN3.contextIsolation,
      generation3VisualTruth: GEN3.visualTruth
    };
  }

  window.DGBShowroomGlobeInstrument = Object.freeze({
    version: VERSION,
    assets: ASSETS,
    generations: GENERATIONS,
    contexts: CONTEXTS,
    generation3: GEN3,
    motion: MOTION,
    create: create,
    setDataset: setDataset,
    stripLegacyVisualClasses: stripLegacyVisualClasses,
    getContextReceipts: getContextReceipts,
    enforceContextIsolation: enforceContextIsolation,
    createGlobeNode: createGlobeNode,
    renderGlobe: renderGlobe,
    writeReceipts: writeReceipts,
    verifyAssets: verifyAssets
  });
})();
