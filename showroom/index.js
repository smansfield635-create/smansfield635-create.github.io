// /showroom/index.js
import { createShowroomRuntime } from "./runtime.js";
import { renderShowroom } from "./showroom.render.js";

const BOOT_RECEIPT = "SHOWROOM_BOOT_CHAIN=INDEX_JS_ACTIVE";

const EARTH_CANVAS_SPINE = "/assets/earth/earth_canvas.js";
const EARTH_MATERIAL = "/assets/earth/earth_material.css";
const SHOWROOM_GLOBE_CONTROLLER = "/showroom/globe/index.js";
const SHOWROOM_GLOBE_MOUNT_ID = "showroom-globe-mount";

function setBootStatus(message, status = "ok") {
  const root = document.querySelector("#showroom-root");

  if (!root) {
    return;
  }

  root.dataset.bootStatus = status;
  root.dataset.bootMessage = message;
  root.dataset.bootReceipt = BOOT_RECEIPT;
}

function appendSafeFailure(error) {
  const main = document.querySelector("#showroom-main");

  if (!main) {
    return;
  }

  const existingFailure = main.querySelector(".safe-failure");
  if (existingFailure) {
    existingFailure.remove();
  }

  const failure = document.createElement("section");
  failure.className = "safe-failure";
  failure.setAttribute("role", "status");
  failure.setAttribute("aria-live", "polite");

  const title = document.createElement("h2");
  title.textContent = "Showroom safe fallback";

  const body = document.createElement("p");
  body.textContent =
    "The Showroom content remains available. The visual runtime failed safely instead of producing a white screen.";

  const detail = document.createElement("pre");
  detail.textContent = String(error?.message || error || "Unknown boot error");

  failure.append(title, body, detail);
  main.appendChild(failure);
}

function appendGlobeFailure(error) {
  const globeMount = document.getElementById(SHOWROOM_GLOBE_MOUNT_ID);

  if (!globeMount) {
    return;
  }

  globeMount.dataset.renderStatus = "safe-failure";

  globeMount.replaceChildren(
    createNode("article", {
      className: "fallback-card",
      "data-earth-canvas-spine-failure": "true"
    }, [
      createNode("p", {
        className: "kicker",
        text: "Earth canvas spine failure"
      }),
      createNode("h2", {
        text: "Showroom Earth controller did not mount."
      }),
      createNode("p", {
        text: String(error?.message || error || "Unknown globe boot error")
      })
    ])
  );
}

function createNode(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) {
      return;
    }

    if (key === "className") {
      node.className = value;
    } else if (key === "text") {
      node.textContent = value;
    } else {
      node.setAttribute(key, String(value));
    }
  });

  children.forEach((child) => {
    if (typeof child === "string") {
      node.appendChild(document.createTextNode(child));
    } else if (child) {
      node.appendChild(child);
    }
  });

  return node;
}

function assertElement(value, message) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

function ensureStylesheet(href, id) {
  const existing = document.querySelector(`link[href="${href}"]`);

  if (existing) {
    return existing;
  }

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;

  document.head.appendChild(link);
  return link;
}

function loadClassicScript(src, id) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing?.dataset.loaded === "true") {
      resolve(existing);
      return;
    }

    if (existing) {
      existing.addEventListener("load", () => resolve(existing), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = false;

    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve(script);
      },
      { once: true }
    );

    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load script: ${src}`)),
      { once: true }
    );

    document.body.appendChild(script);
  });
}

function ensureGlobeMount() {
  const existing = document.getElementById(SHOWROOM_GLOBE_MOUNT_ID);

  if (existing) {
    return existing;
  }

  const visualPanel = document.querySelector(".visual-panel");
  const showroomMain = document.querySelector("#showroom-main");

  const mount = createNode("section", {
    id: SHOWROOM_GLOBE_MOUNT_ID,
    className: "showroom-globe-mount",
    "data-showroom-globe-mount": "true",
    "data-showroom-globe-placement": "bottom-empty-space",
    "aria-label": "Showroom Earth canvas mount"
  });

  if (visualPanel) {
    visualPanel.appendChild(mount);
    return mount;
  }

  if (showroomMain) {
    showroomMain.appendChild(mount);
    return mount;
  }

  throw new Error("Cannot create Showroom globe mount; missing visual panel and #showroom-main.");
}

async function bootExistingShowroomGlobe() {
  const mount = ensureGlobeMount();

  mount.dataset.renderStatus = "loading";
  mount.dataset.earthCanvasSpine = EARTH_CANVAS_SPINE;
  mount.dataset.earthMaterial = EARTH_MATERIAL;
  mount.dataset.showroomGlobeController = SHOWROOM_GLOBE_CONTROLLER;
  mount.dataset.showroomGlobeIntegration = "index-js-preserved-globe-subsystem";

  ensureStylesheet(EARTH_MATERIAL, "showroom-earth-material-css");

  await loadClassicScript(EARTH_CANVAS_SPINE, "showroom-earth-canvas-spine-js");
  await loadClassicScript(SHOWROOM_GLOBE_CONTROLLER, "showroom-globe-controller-js");

  if (window.DGBShowroomGlobe && typeof window.DGBShowroomGlobe.init === "function") {
    window.DGBShowroomGlobe.init();
  }

  mount.dataset.renderStatus = mount.dataset.renderStatus || "mounted";
}

async function bootShowroom() {
  try {
    const root = assertElement(
      document.querySelector("#showroom-root"),
      "Missing #showroom-root mount node."
    );

    const canvas = assertElement(
      document.querySelector("#showroom-canvas"),
      "Missing #showroom-canvas visual surface."
    );

    const runtime = createShowroomRuntime({
      chamber: "05_SHOWROOM",
      route: "/showroom/",
      mode: "controlled-baseline",
      generation: "showroom-five-file-controlled-baseline-v3-globe-preserved"
    });

    runtime.start();

    renderShowroom({
      root,
      canvas,
      runtime
    });

    try {
      await bootExistingShowroomGlobe();
    } catch (globeError) {
      console.warn("[Showroom globe boot failure]", globeError);
      appendGlobeFailure(globeError);
    }

    setBootStatus("Showroom boot chain completed.", "ok");
  } catch (error) {
    console.error("[Showroom boot failure]", error);
    setBootStatus("Showroom boot chain failed safely.", "safe-failure");
    appendSafeFailure(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootShowroom, { once: true });
} else {
  bootShowroom();
}
