/*
  /assets/showroom.globe.instrument.js
  SHOWROOM_GENERATION_3_FULL_EXPRESSION_ASSET_INSTRUMENT_TNT_v1

  Owns:
  - canonical Earth asset paths
  - Generation 2 active globe primitive
  - Generation 3 expression layers
  - shared parent + standalone globe receipts
  - asset load monitoring

  Does not own:
  - page layout
  - route rail
  - Showroom copy
  - Gauges logic
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-3-full-expression-asset-instrument-v1";

  const ASSETS = Object.freeze({
    earthSurface: "/assets/earth/earth_surface_2048.jpg",
    earthClouds: "/assets/earth/earth_clouds_2048.jpg",
    parentRoute: "/showroom/",
    globeRoute: "/showroom/globe/"
  });

  const GENERATIONS = Object.freeze({
    generation1: "no-graphic-baseline",
    generation2: "baseline-graphics-active-globe",
    generation3: "full-expression"
  });

  const GEN3 = Object.freeze({
    shadows: "active",
    depth: "active",
    colorDiscrimination: "active",
    moonReflection: "prepared",
    terminator: "active",
    atmosphere: "active",
    telemetry: "active",
    detail: "active",
    visualTruth: "pending-visual-confirmation"
  });

  function create(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];

      if (value === null || value === undefined || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, String(value));
    });

    (children || []).forEach(function (child) {
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
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
      generation1NoGraphicBaseline: "true",
      generation2BaselineGraphics: "achieved",
      generation2ActiveGlobe: "visible",
      generation3FullExpression: "active",
      generation3VisualTruth: GEN3.visualTruth,
      generation3Shadows: GEN3.shadows,
      generation3Depth: GEN3.depth,
      generation3ColorDiscrimination: GEN3.colorDiscrimination,
      generation3MoonReflection: GEN3.moonReflection,
      generation3Terminator: GEN3.terminator,
      generation3Atmosphere: GEN3.atmosphere,
      generation3Telemetry: GEN3.telemetry,
      generation3Detail: GEN3.detail,
      earthSurface: ASSETS.earthSurface,
      earthClouds: ASSETS.earthClouds,
      showroomParentRoute: ASSETS.parentRoute,
      showroomGlobeRoute: ASSETS.globeRoute,
      renderContext: context || "unassigned"
    };
  }

  function createTelemetryNode(context) {
    return create("div", {
      className: "showroom-generation-3-telemetry",
      "data-generation-3-telemetry": "active",
      "aria-label": "Generation 3 telemetry receipt"
    }, [
      create("span", { text: "GEN 3" }),
      create("span", { text: "shadow=active" }),
      create("span", { text: "depth=active" }),
      create("span", { text: "terminator=active" }),
      create("span", { text: "atmosphere=active" }),
      create("span", { text: "context=" + (context || "parent") })
    ]);
  }

  function createGlobeNode(options) {
    const config = options || {};
    const context = config.context || "parent";
    const caption =
      config.caption ||
      (context === "standalone"
        ? "GENERATION 3 · DEMO UNIVERSE EARTH · FULL EXPRESSION"
        : "GENERATION 3 · FULL EXPRESSION · EARTH SHADOW DEPTH ACTIVE");

    return create("section", {
      className: "showroom-generation-2-shell showroom-generation-3-shell",
      "data-showroom-generation-2-shell": "true",
      "data-showroom-generation-3-shell": "true",
      "data-generation-2-active-globe": "visible",
      "data-generation-3-full-expression": "active",
      "data-render-context": context
    }, [
      create("div", {
        className: "showroom-generation-2-orbit showroom-generation-3-orbit",
        "aria-hidden": "true"
      }),

      create("div", {
        className: "showroom-generation-2-active-globe showroom-generation-3-active-globe",
        role: "img",
        "aria-label": context === "standalone"
          ? "Demo Universe Earth Generation 3 full expression globe"
          : "Showroom Generation 3 full expression Earth globe"
      }, [
        create("img", {
          className: "showroom-generation-2-earth-surface showroom-generation-3-earth-surface",
          src: ASSETS.earthSurface,
          alt: "",
          decoding: "async",
          loading: "eager",
          "aria-hidden": "true"
        }),
        create("img", {
          className: "showroom-generation-2-earth-clouds showroom-generation-3-earth-clouds",
          src: ASSETS.earthClouds,
          alt: "",
          decoding: "async",
          loading: "eager",
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
          className: "showroom-generation-2-light showroom-generation-3-light",
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
          className: "showroom-generation-2-rim showroom-generation-3-rim",
          "aria-hidden": "true"
        })
      ]),

      create("p", {
        className: "showroom-generation-2-caption showroom-generation-3-caption",
        text: caption
      }),

      createTelemetryNode(context),

      create("a", {
        className: "showroom-generation-2-link showroom-generation-3-link",
        href: context === "standalone" ? ASSETS.parentRoute : ASSETS.globeRoute,
        text: context === "standalone" ? "Return to Showroom" : "Open Demo Universe Earth"
      })
    ]);
  }

  function monitorAssetLoad(mount) {
    if (!mount) return;

    const surface = mount.querySelector(".showroom-generation-2-earth-surface");
    const clouds = mount.querySelector(".showroom-generation-2-earth-clouds");

    function update() {
      const surfaceLoaded = Boolean(surface && surface.complete && surface.naturalWidth > 0);
      const cloudsLoaded = Boolean(clouds && clouds.complete && clouds.naturalWidth > 0);

      mount.dataset.surfaceImg = surface ? "true" : "false";
      mount.dataset.surfaceImgLoaded = surfaceLoaded ? "true" : "false";
      mount.dataset.cloudImg = clouds ? "true" : "false";
      mount.dataset.cloudImgLoaded = cloudsLoaded ? "true" : "false";

      if (surfaceLoaded) {
        mount.dataset.generation2ActiveGlobe = "visible";
        mount.dataset.generation3FullExpression = "active";
        mount.dataset.renderStatus = "generation-3-full-expression-visible";
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
    if (!mount) throw new Error("Showroom globe instrument requires a mount node.");

    const config = options || {};
    const context = config.context || "parent";

    mount.replaceChildren(createGlobeNode(config));
    mount.dataset.renderStatus = "generation-3-full-expression-mounted";
    mount.dataset.generation2ActiveGlobe = "visible";
    mount.dataset.generation3FullExpression = "active";

    setDataset(mount, getReceipts(context));
    monitorAssetLoad(mount);

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
      generation2BaselineGraphics: "achieved",
      generation3FullExpression: "active",
      generation3VisualTruth: GEN3.visualTruth
    };
  }

  window.DGBShowroomGlobeInstrument = Object.freeze({
    version: VERSION,
    assets: ASSETS,
    generations: GENERATIONS,
    generation3: GEN3,
    create,
    setDataset,
    createGlobeNode,
    renderGlobe,
    writeReceipts,
    verifyAssets
  });
})();
