/*
  /assets/showroom.globe.instrument.js
  SHOWROOM_GLOBE_ASSET_INSTRUMENT_v1

  Canonical asset instrument.
  Origin path:
  WORLD_KERNEL -> WORLD_PLANET_ENGINE -> ASSET_INSTRUMENT -> SHOWROOM_PARENT / SHOWROOM_GLOBE_ROUTE
*/

(function () {
  "use strict";

  const VERSION = "showroom-globe-asset-instrument-v1";

  const ASSETS = Object.freeze({
    earthSurface: "/assets/earth/earth_surface_2048.jpg",
    earthClouds: "/assets/earth/earth_clouds_2048.jpg",
    parentRoute: "/showroom/",
    globeRoute: "/showroom/globe/"
  });

  const GENERATIONS = Object.freeze({
    generation1: "layout-established",
    generation2: "active-globe",
    generation3: "shadow-detail-blocked-until-generation-2-pass"
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

  function baseReceipts(context) {
    return {
      showroomGlobeInstrument: VERSION,
      worldKernelCompatible: "true",
      worldPlanetEngineCompatible: "true",
      assetInstrument: "showroom-globe",
      generation1LayoutEstablished: "true",
      generation2ActiveGlobe: "target",
      generation3: GENERATIONS.generation3,
      generation3BlockedUntilG2Pass: "true",
      earthSurface: ASSETS.earthSurface,
      earthClouds: ASSETS.earthClouds,
      showroomGlobeRoute: ASSETS.globeRoute,
      showroomParentRoute: ASSETS.parentRoute,
      renderContext: context || "unassigned"
    };
  }

  function createGlobeNode(options) {
    const config = options || {};
    const context = config.context || "parent";
    const caption =
      config.caption ||
      (context === "standalone"
        ? "GENERATION 2 · DEMO UNIVERSE EARTH · ACTIVE GLOBE"
        : "GENERATION 2 · ACTIVE GLOBE · EARTH SURFACE RESTORED");

    return create("section", {
      className: "showroom-generation-2-shell",
      "data-showroom-generation-2-shell": "true",
      "data-generation-2-active-globe": "visible",
      "data-render-context": context
    }, [
      create("div", {
        className: "showroom-generation-2-orbit",
        "aria-hidden": "true"
      }),
      create("div", {
        className: "showroom-generation-2-active-globe",
        role: "img",
        "aria-label": context === "standalone"
          ? "Demo Universe Earth active globe"
          : "Showroom Generation 2 active Earth globe"
      }, [
        create("img", {
          className: "showroom-generation-2-earth-surface",
          src: ASSETS.earthSurface,
          alt: "",
          decoding: "async",
          loading: "eager",
          "aria-hidden": "true"
        }),
        create("img", {
          className: "showroom-generation-2-earth-clouds",
          src: ASSETS.earthClouds,
          alt: "",
          decoding: "async",
          loading: "eager",
          "aria-hidden": "true"
        }),
        create("span", {
          className: "showroom-generation-2-light",
          "aria-hidden": "true"
        }),
        create("span", {
          className: "showroom-generation-2-rim",
          "aria-hidden": "true"
        })
      ]),
      create("p", {
        className: "showroom-generation-2-caption",
        text: caption
      }),
      create("a", {
        className: "showroom-generation-2-link",
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
        mount.dataset.renderStatus = "generation-2-active-globe-visible";
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
    mount.dataset.renderStatus = "generation-2-active-globe-mounted";
    mount.dataset.generation2ActiveGlobe = "mounted";

    setDataset(mount, baseReceipts(context));
    monitorAssetLoad(mount);

    return mount;
  }

  function writeReceipts(node, context, extra) {
    setDataset(node, Object.assign({}, baseReceipts(context), extra || {}));
  }

  async function verifyAssets() {
    const surface = await fetch(ASSETS.earthSurface, { cache: "no-store" });
    const clouds = await fetch(ASSETS.earthClouds, { cache: "no-store" });

    return {
      surfaceOk: surface.ok,
      surfaceStatus: surface.status,
      cloudsOk: clouds.ok,
      cloudsStatus: clouds.status
    };
  }

  window.DGBShowroomGlobeInstrument = Object.freeze({
    version: VERSION,
    assets: ASSETS,
    generations: GENERATIONS,
    create,
    setDataset,
    createGlobeNode,
    renderGlobe,
    writeReceipts,
    verifyAssets
  });
})();
