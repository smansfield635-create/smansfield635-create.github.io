/*
  /assets/showroom.globe.instrument.js
  SHOWROOM_GLOBE_INSTRUMENT_GEN3_OBJECT_PURIFICATION_TNT_v1

  Purpose:
  - Emit one clean Generation 3 shared globe object.
  - Preserve Generation 2 as data/receipt baseline only.
  - Remove Generation 2 visual class emission from the active DOM object.
  - Preserve parent Showroom and standalone Demo Universe compatibility.
  - Preserve public API used by Showroom, runtime, render bridge, standalone route, and Gauges.

  Owns:
  - shared globe object factory
  - Earth surface/cloud image placement
  - Gen 3 axis, shadow, depth, terminator, atmosphere, telemetry, and receipts

  Does not own:
  - page layout
  - route rail
  - Showroom copy
  - Gauges logic
  - global Manor CSS
  - raw Earth media files
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-3-object-purified-instrument-v1";

  const ASSETS = Object.freeze({
    earthSurface: "/assets/earth/earth_surface_2048.jpg",
    earthClouds: "/assets/earth/earth_clouds_2048.jpg",
    parentRoute: "/showroom/",
    globeRoute: "/showroom/globe/"
  });

  const GENERATIONS = Object.freeze({
    generation1: "no-graphic-baseline-preserved",
    generation2: "baseline-graphics-preserved-as-receipt-only",
    generation3: "shared-globe-object-purified"
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
    legacyVisualClassEmission: "removed"
  });

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

  function getReceipts(context) {
    return {
      showroomGlobeInstrument: VERSION,
      worldKernelCompatible: "true",
      worldPlanetEngineCompatible: "true",
      assetInstrument: "showroom-globe",

      generation1NoGraphicBaseline: "preserved",
      generation2BaselineGraphics: "preserved",
      generation2ActiveGlobe: "preserved",
      generation2VisualClassEmission: "removed",
      generation2ReceiptOnly: "true",

      generation3: GENERATIONS.generation3,
      generation3FullExpression: "axis-rotation-depth-refinement-active",
      generation3ObjectPurification: GEN3.objectPurification,
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
      earthSurface: ASSETS.earthSurface,
      earthClouds: ASSETS.earthClouds,
      showroomParentRoute: ASSETS.parentRoute,
      showroomGlobeRoute: ASSETS.globeRoute,
      renderContext: context || "unassigned"
    };
  }

  function createTelemetryNode(context) {
    return create(
      "div",
      {
        className: "showroom-generation-3-telemetry",
        "data-generation-3-telemetry": "active",
        "data-generation-3-object-purification": "active",
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
        create("span", { text: "context=" + (context || "parent") })
      ]
    );
  }

  function createGlobeNode(options) {
    const config = options || {};
    const context = config.context || "parent";
    const caption =
      config.caption ||
      (context === "standalone"
        ? "GENERATION 3 · DEMO UNIVERSE EARTH · AXIS ROTATION ACTIVE"
        : "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE");

    return create(
      "section",
      {
        className: "showroom-generation-3-shell",
        "data-showroom-generation-3-shell": "true",
        "data-generation-1-no-graphic-baseline": "preserved",
        "data-generation-2-baseline-graphics": "preserved",
        "data-generation-2-active-globe": "preserved",
        "data-generation-2-visual-class-emission": "removed",
        "data-generation-3-full-expression": "axis-rotation-depth-refinement-active",
        "data-generation-3-object-purification": "active",
        "data-generation-3-axis": "active",
        "data-generation-3-rotation": "active",
        "data-generation-3-runtime-motion": "active",
        "data-axis-tilt-degrees": String(MOTION.axisTiltDegrees),
        "data-render-context": context
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
            "aria-label":
              context === "standalone"
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
          text: caption
        }),

        createTelemetryNode(context),

        create("a", {
          className: "showroom-generation-3-link",
          href: context === "standalone" ? ASSETS.parentRoute : ASSETS.globeRoute,
          text: context === "standalone" ? "Return to Showroom" : "Open Demo Universe Earth"
        })
      ]
    );
  }

  function notifyRuntime(status) {
    if (
      window.DGBShowroomRuntime &&
      typeof window.DGBShowroomRuntime.setGeneration3MotionStatus === "function"
    ) {
      window.DGBShowroomRuntime.setGeneration3MotionStatus(
        status || "generation-3-object-purified-mounted"
      );
    }

    if (
      window.DGBShowroomRuntime &&
      typeof window.DGBShowroomRuntime.setActiveGlobeStatus === "function"
    ) {
      window.DGBShowroomRuntime.setActiveGlobeStatus(
        status || "generation-3-object-purified-mounted"
      );
    }
  }

  function monitorAssetLoad(mount) {
    if (!mount) return;

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
        mount.dataset.generation1NoGraphicBaseline = "preserved";
        mount.dataset.generation2BaselineGraphics = "preserved";
        mount.dataset.generation2ActiveGlobe = "preserved";
        mount.dataset.generation2VisualClassEmission = "removed";
        mount.dataset.generation3 = GENERATIONS.generation3;
        mount.dataset.generation3FullExpression = "axis-rotation-depth-refinement-active";
        mount.dataset.generation3ObjectPurification = "active";
        mount.dataset.generation3RuntimeMotion = "active";
        mount.dataset.renderStatus = "generation-3-object-purified-visible";
        notifyRuntime("generation-3-object-purified-visible");
      }
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
    const context = config.context || "parent";

    mount.replaceChildren(createGlobeNode(config));

    mount.dataset.renderStatus = "generation-3-object-purified-mounted";
    mount.dataset.generation1NoGraphicBaseline = "preserved";
    mount.dataset.generation2BaselineGraphics = "preserved";
    mount.dataset.generation2ActiveGlobe = "preserved";
    mount.dataset.generation2VisualClassEmission = "removed";
    mount.dataset.generation3 = GENERATIONS.generation3;
    mount.dataset.generation3FullExpression = "axis-rotation-depth-refinement-active";
    mount.dataset.generation3ObjectPurification = "active";
    mount.dataset.generation3RuntimeMotion = "active";
    mount.dataset.showroomGlobePlacement = "generation-3-object-purified";

    setDataset(mount, getReceipts(context));
    monitorAssetLoad(mount);
    notifyRuntime("generation-3-object-purified-mounted");

    return mount;
  }

  function writeReceipts(node, context, extra) {
    setDataset(node, Object.assign({}, getReceipts(context), extra || {}));
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
      generation2VisualClassEmission: "removed",
      generation3: GENERATIONS.generation3,
      generation3RuntimeMotion: GEN3.runtimeMotion,
      generation3Axis: GEN3.axis,
      generation3Rotation: GEN3.rotation,
      generation3ObjectPurification: GEN3.objectPurification,
      generation3VisualTruth: GEN3.visualTruth
    };
  }

  window.DGBShowroomGlobeInstrument = Object.freeze({
    version: VERSION,
    assets: ASSETS,
    generations: GENERATIONS,
    generation3: GEN3,
    motion: MOTION,
    create: create,
    setDataset: setDataset,
    createGlobeNode: createGlobeNode,
    renderGlobe: renderGlobe,
    writeReceipts: writeReceipts,
    verifyAssets: verifyAssets
  });
})();
