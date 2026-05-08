// /showroom/globe/earth/index.js
// EARTH_NASA_JPG_SCROLL_UNLOCK_TNT_v1
// Full-file replacement.
// Purpose:
// - Restore demo Earth to NASA JPG mode.
// - Remove procedural blob placeholder.
// - Keep Earth separate from Hearth.
// - Explicitly restore vertical mobile page scroll.
// - No generated image. No GraphicBox. No canvas dependency.

(() => {
  "use strict";

  const CONTRACT = "EARTH_NASA_JPG_SCROLL_UNLOCK_TNT_v1";
  const VERSION = "2026-05-08.earth-nasa-jpg-scroll-unlock";
  const RECEIPT = "EARTH_NASA_JPG_SCROLL_UNLOCK_RECEIPT";

  const NASA_IMAGE_PRIMARY =
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/1/1-bluemarble_west-1.jpg";

  const NASA_IMAGE_FALLBACK =
    "https://svs.gsfc.nasa.gov/vis/a030000/a030600/a030614/blue_marble_modis_north_america_print.jpg";

  const state = {
    booted: false,
    mount: null,
    img: null
  };

  function stamp(status) {
    document.documentElement.dataset.earthRouteControllerLoaded = "true";
    document.documentElement.dataset.earthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.earthRouteControllerVersion = VERSION;
    document.documentElement.dataset.earthRouteControllerStatus = status;
    document.documentElement.dataset.earthExpectedRoute = "/showroom/globe/earth/";
    document.documentElement.dataset.earthHtmlOwner = "/showroom/globe/earth/index.html";
    document.documentElement.dataset.earthJsOwner = "/showroom/globe/earth/index.js";
    document.documentElement.dataset.earthImageMode = "nasa-jpg";
    document.documentElement.dataset.earthImagePrimary = NASA_IMAGE_PRIMARY;
    document.documentElement.dataset.earthImageFallback = NASA_IMAGE_FALLBACK;
    document.documentElement.dataset.earthGeneratedImage = "false";
    document.documentElement.dataset.earthGraphicBox = "false";
    document.documentElement.dataset.earthProceduralPlaceholder = "false";
    document.documentElement.dataset.earthScrollAuthority = "body-pan-y";
  }

  function unlockScroll() {
    const rootStyle = document.documentElement.style;
    const bodyStyle = document.body.style;

    rootStyle.overflowX = "hidden";
    rootStyle.overflowY = "auto";
    rootStyle.touchAction = "pan-y";

    bodyStyle.overflowX = "hidden";
    bodyStyle.overflowY = "auto";
    bodyStyle.touchAction = "pan-y";
    bodyStyle.overscrollBehaviorY = "auto";
    bodyStyle.webkitOverflowScrolling = "touch";

    document.body.dataset.scrollUnlocked = "true";
    document.body.dataset.touchPolicy = "pan-y";
  }

  function ensureMount() {
    let mount =
      document.getElementById("earthImageMount") ||
      document.querySelector("[data-earth-image-mount]") ||
      document.querySelector("[data-render='earth']");

    if (!mount) {
      const main = document.getElementById("earth-main") || document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = "earthImageMount";
      mount.dataset.earthImageMount = "";
      mount.dataset.render = "earth";
      mount.dataset.planet = "earth";
      mount.dataset.body = "earth";
      mount.dataset.contract = CONTRACT;
      mount.dataset.imageMode = "nasa-jpg";
      mount.dataset.touchPolicy = "pan-y";
      mount.setAttribute("aria-label", "NASA Blue Marble Earth image mount");
      main.appendChild(mount);
    }

    mount.dataset.earthImageMountReady = "true";
    mount.dataset.earthRouteController = CONTRACT;
    mount.dataset.earthRouteControllerReceipt = RECEIPT;
    mount.dataset.imageMode = "nasa-jpg";
    mount.dataset.touchPolicy = "pan-y";
    mount.dataset.nasaImagePrimary = NASA_IMAGE_PRIMARY;
    mount.dataset.nasaImageFallback = NASA_IMAGE_FALLBACK;

    return mount;
  }

  function removeProceduralPlaceholder() {
    document
      .querySelectorAll("canvas[data-earth-canvas], canvas[data-hearth-canvas], .earth-procedural-placeholder")
      .forEach((node) => {
        if (state.mount && state.mount.contains(node)) return;
        if (node.parentElement) node.remove();
      });
  }

  function installStyle() {
    const prior = document.getElementById("earth-nasa-jpg-controller-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "earth-nasa-jpg-controller-style";
    style.textContent = `
      html,
      body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
      }

      .page,
      .earth-card,
      #earthImageMount,
      [data-earth-image-mount] {
        touch-action: pan-y !important;
      }

      #earthImageMount,
      [data-earth-image-mount] {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        min-height: 280px;
        overflow: hidden;
        isolation: isolate;
      }

      .earth-nasa-stage,
      .earth-nasa-img,
      .earth-nasa-stage::before,
      .earth-nasa-stage::after {
        pointer-events: none !important;
        touch-action: pan-y !important;
      }

      .earth-nasa-stage {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
      }

      .earth-nasa-img {
        user-select: none;
        -webkit-user-drag: none;
      }

      .earth-nasa-status {
        position: absolute;
        left: 14px;
        bottom: 12px;
        z-index: 4;
        padding: 6px 8px;
        border-radius: 999px;
        border: 1px solid rgba(135, 187, 221, 0.18);
        background: rgba(4, 14, 25, 0.42);
        color: rgba(214, 232, 244, 0.72);
        font: 800 10px/1.1 ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        pointer-events: none;
      }

      @media (max-width: 520px) {
        .earth-nasa-status {
          display: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function exposeReceipt(status) {
    window.EARTH_ROUTE_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      expectedRoute: "/showroom/globe/earth/",
      htmlOwner: "/showroom/globe/earth/index.html",
      jsOwner: "/showroom/globe/earth/index.js",
      imageMode: "nasa-jpg",
      primaryImage: NASA_IMAGE_PRIMARY,
      fallbackImage: NASA_IMAGE_FALLBACK,
      scrollAuthority: "body-pan-y",
      generatedImage: false,
      graphicBox: false,
      proceduralPlaceholder: false,
      status
    });
  }

  function bootImage() {
    const mount = ensureMount();
    state.mount = mount;

    mount.replaceChildren();

    const stage = document.createElement("div");
    stage.className = "earth-nasa-stage";
    stage.dataset.contract = CONTRACT;
    stage.dataset.imageMode = "nasa-jpg";
    stage.dataset.touchPolicy = "pan-y";

    const img = document.createElement("img");
    img.className = "earth-nasa-img";
    img.alt = "NASA Blue Marble Earth reference image";
    img.decoding = "async";
    img.loading = "eager";
    img.fetchPriority = "high";
    img.draggable = false;
    img.dataset.contract = CONTRACT;
    img.dataset.imageSource = "NASA Blue Marble 2002";
    img.dataset.touchPolicy = "pan-y";
    img.src = NASA_IMAGE_PRIMARY;

    const status = document.createElement("div");
    status.className = "earth-nasa-status";
    status.textContent = "NASA JPG · Scroll Unlocked";

    img.addEventListener("load", () => {
      stamp("nasa-jpg-loaded");
      unlockScroll();
      mount.dataset.earthImageLoaded = "true";
      mount.dataset.earthImageSourceActive = img.src;
      document.body.dataset.earthRouteReady = "true";
      exposeReceipt("nasa-jpg-loaded");
    });

    img.addEventListener("error", () => {
      if (img.src !== NASA_IMAGE_FALLBACK) {
        stamp("primary-error-loading-fallback");
        img.src = NASA_IMAGE_FALLBACK;
        return;
      }

      stamp("nasa-jpg-error");
      unlockScroll();
      mount.dataset.earthImageLoaded = "false";
      document.body.dataset.earthRouteReady = "false";
      exposeReceipt("nasa-jpg-error");
    });

    stage.append(img, status);
    mount.appendChild(stage);
    state.img = img;

    stamp("nasa-jpg-booted");
    exposeReceipt("booted");
  }

  function boot() {
    if (state.booted) return;

    state.booted = true;
    stamp("booting");
    unlockScroll();
    installStyle();
    removeProceduralPlaceholder();
    bootImage();
    unlockScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
