/*
  /showroom/index.js
  SHOWROOM_GENERATION_2_HTML_JS_ALIGNMENT_TNT_v1

  Scope:
  - Hydrates the already-present #showroom-globe-mount.
  - Does not create a competing Showroom layout.
  - Does not rewrite /showroom/globe/index.js.
  - Does not touch /assets/earth/*.
  - Does not touch /gauges/.
  - Does not claim Generation 3.
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-2-html-js-alignment-v1";

  const ROOT_ID = "showroom-root";
  const MAIN_ID = "showroom-main";
  const CANVAS_ID = "showroom-canvas";
  const GLOBE_MOUNT_ID = "showroom-globe-mount";

  const EARTH_SURFACE = "/assets/earth/earth_surface_2048.jpg";
  const EARTH_CLOUDS = "/assets/earth/earth_clouds_2048.jpg";
  const SHOWROOM_GLOBE_ROUTE = "/showroom/globe/";

  function qs(selector, root) {
    return (root || document).querySelector(selector);
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

    Object.entries(values).forEach(function (entry) {
      node.dataset[entry[0]] = String(entry[1]);
    });
  }

  function writeReceipts(status) {
    const root = document.getElementById(ROOT_ID);
    const main = document.getElementById(MAIN_ID);
    const mount = document.getElementById(GLOBE_MOUNT_ID);

    const receipts = {
      showroomIndexVersion: VERSION,
      generation1LayoutEstablished: "true",
      showroomGeneration: "generation-2-active-globe",
      generation2ActiveGlobe: status,
      generation3: "shadow-detail-blocked-until-generation-2-pass",
      generation3BlockedUntilG2Pass: "true",
      showroomCardEarthSync: "active",
      showroomCardEarthColor: "synced",
      showroomCardGlobeHandoff: "active",
      showroomCardVisualTruth: "pending",
      demoUniverseCardPreview: "active",
      showroomMobileLayoutHardened: "true"
    };

    setDataset(root, receipts);
    setDataset(main, receipts);
    setDataset(mount, {
      ...receipts,
      earthSurface: EARTH_SURFACE,
      earthClouds: EARTH_CLOUDS,
      showroomGlobeRoute: SHOWROOM_GLOBE_ROUTE
    });
  }

  function ensureGlobeMount() {
    const existing = document.getElementById(GLOBE_MOUNT_ID);
    if (existing) return existing;

    const visualPanel =
      qs(".visual-panel") ||
      qs(".showroom-globe") ||
      qs("[data-showroom-globe='active']");

    const main = document.getElementById(MAIN_ID);

    const mount = create("div", {
      id: GLOBE_MOUNT_ID,
      className:
        "showroom-globe-mount showroom-globe showroom-earth-color showroom-earth-clouds showroom-earth-atmosphere",
      "data-showroom-globe-mount": "true",
      "data-showroom-globe-placement": "generation-2-active-globe",
      "data-showroom-card-globe-handoff": "active",
      "data-showroom-card-earth-color": "synced",
      "data-demo-universe-card-preview": "active",
      "data-generation-2-active-globe": "created-by-index-js",
      "aria-label": "Showroom Generation 2 active Earth globe"
    });

    if (visualPanel) {
      visualPanel.appendChild(mount);
      return mount;
    }

    if (main) {
      main.prepend(mount);
      return mount;
    }

    document.body.appendChild(mount);
    return mount;
  }

  function mountHasGeneration2Shell(mount) {
    return Boolean(
      mount &&
      mount.querySelector(".showroom-generation-2-shell") &&
      mount.querySelector(".showroom-generation-2-active-globe") &&
      mount.querySelector(".showroom-generation-2-earth-surface")
    );
  }

  function buildGeneration2Shell() {
    return create("section", {
      className: "showroom-generation-2-shell",
      "data-showroom-generation-2-shell": "true",
      "data-generation-2-active-globe": "visible"
    }, [
      create("div", {
        className: "showroom-generation-2-orbit",
        "aria-hidden": "true"
      }),
      create("div", {
        className: "showroom-generation-2-active-globe",
        role: "img",
        "aria-label": "Active visible Earth globe restored for Showroom Generation 2"
      }, [
        create("img", {
          className: "showroom-generation-2-earth-surface",
          src: EARTH_SURFACE,
          alt: "",
          decoding: "async",
          loading: "eager",
          "aria-hidden": "true"
        }),
        create("img", {
          className: "showroom-generation-2-earth-clouds",
          src: EARTH_CLOUDS,
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
        text: "GENERATION 2 · ACTIVE GLOBE · EARTH SURFACE RESTORED"
      }),
      create("a", {
        className: "showroom-generation-2-link",
        href: SHOWROOM_GLOBE_ROUTE,
        text: "Open Demo Universe Earth"
      })
    ]);
  }

  function ensureGeneration2Shell() {
    const mount = ensureGlobeMount();

    if (!mountHasGeneration2Shell(mount)) {
      mount.replaceChildren(buildGeneration2Shell());
    }

    mount.dataset.renderStatus = "generation-2-active-globe-mounted";
    mount.dataset.generation2ActiveGlobe = "mounted";
    mount.dataset.earthSurface = EARTH_SURFACE;
    mount.dataset.earthClouds = EARTH_CLOUDS;
    mount.dataset.showroomGlobeRoute = SHOWROOM_GLOBE_ROUTE;

    writeReceipts("mounted");

    return mount;
  }

  function markImageStatus(mount) {
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
        writeReceipts("visible");
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
    window.setTimeout(update, 350);
    window.setTimeout(update, 1200);
  }

  function drawSupportCanvas() {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const width = Math.max(320, Math.floor(rect.width || canvas.clientWidth || 900));
    const height = Math.max(320, Math.floor(rect.height || canvas.clientHeight || 560));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const gradient = context.createRadialGradient(
      width * 0.5,
      height * 0.48,
      width * 0.1,
      width * 0.5,
      height * 0.48,
      width * 0.72
    );

    gradient.addColorStop(0, "rgba(116, 184, 255, 0.16)");
    gradient.addColorStop(0.5, "rgba(8, 20, 38, 0.34)");
    gradient.addColorStop(1, "rgba(2, 5, 12, 0.98)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function bindResize() {
    let resizeFrame = 0;

    window.addEventListener("resize", function () {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(drawSupportCanvas);
    });
  }

  function init() {
    const mount = ensureGeneration2Shell();
    markImageStatus(mount);
    drawSupportCanvas();
    bindResize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.DGBShowroomIndex = Object.freeze({
    version: VERSION,
    generation1: "layout-established",
    generation2: "active-globe",
    generation3: "shadow-detail-blocked",
    hydrateGeneration2Globe: ensureGeneration2Shell,
    earthSurface: EARTH_SURFACE,
    earthClouds: EARTH_CLOUDS,
    showroomGlobeRoute: SHOWROOM_GLOBE_ROUTE
  });
})();
