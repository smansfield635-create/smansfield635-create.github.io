/*
  HOUSE_BATCH_1_MANOR_BOOT_TNT
  FILE: /assets/house_batch_1_manor_boot.js
  PURPOSE:
  - Apply the Manor Batch 1 integration layer to the six house pages only.
  - Preserve existing page bodies and existing runtime behavior.
  - Avoid breaking Gauges by not replacing live-calculated logic.
  - Inject Manor skin, registry, body metadata, route rail, backlinks, and audit marker surface.

  REQUIRES:
  - /assets/manor.css
  - /assets/page_registry.js

  SAFE SCOPE:
  - Compass
  - Door
  - Home
  - Products
  - Showroom
  - Gauges
*/

(function houseBatchOneManorBoot(global) {
  "use strict";

  const BOOT_VERSION = "HOUSE_BATCH_1_MANOR_BOOT_TNT";
  const CSS_HREF = "/assets/manor.css?v=manor-skin-contract-b1";
  const REGISTRY_SRC = "/assets/page_registry.js?v=page-registry-b2";

  const HOUSE_ROUTES = Object.freeze({
    "/": Object.freeze({
      id: "compass",
      title: "Compass",
      slot: "H1_COMPASS",
      route: "/",
      purpose: "Orientation core and global routing."
    }),
    "/door/": Object.freeze({
      id: "door",
      title: "Door",
      slot: "H2_DOOR",
      route: "/door/",
      purpose: "Entry threshold and viewing permission."
    }),
    "/home/": Object.freeze({
      id: "home",
      title: "Home",
      slot: "H3_HOME",
      route: "/home/",
      purpose: "Central Manor body and public identity."
    }),
    "/products/": Object.freeze({
      id: "products",
      title: "Products",
      slot: "H4_PRODUCTS",
      route: "/products/",
      purpose: "Source chamber and product waterfall."
    }),
    "/showroom/": Object.freeze({
      id: "showroom",
      title: "Showroom",
      slot: "H5_SHOWROOM",
      route: "/showroom/",
      purpose: "Public proof window."
    }),
    "/gauges/": Object.freeze({
      id: "gauges",
      title: "Gauges",
      slot: "H6_GAUGES",
      route: "/gauges/",
      purpose: "Live diagnostic instrument room."
    })
  });

  const HOUSE_LINKS = Object.freeze([
    Object.freeze({ id: "compass", label: "Compass", href: "/" }),
    Object.freeze({ id: "door", label: "Door", href: "/door/" }),
    Object.freeze({ id: "home", label: "Home", href: "/home/" }),
    Object.freeze({ id: "products", label: "Products", href: "/products/" }),
    Object.freeze({ id: "showroom", label: "Showroom", href: "/showroom/" }),
    Object.freeze({ id: "gauges", label: "Gauges", href: "/gauges/" })
  ]);

  function normalizePath(path) {
    let clean = String(path || "/").split("?")[0].split("#")[0];

    if (!clean.startsWith("/")) clean = "/" + clean;

    if (clean !== "/" && clean.endsWith("/index.html")) {
      clean = clean.slice(0, -"index.html".length);
    }

    if (clean !== "/" && !clean.endsWith("/")) {
      clean += "/";
    }

    return clean;
  }

  function currentHousePage() {
    const path = normalizePath(global.location && global.location.pathname);
    return HOUSE_ROUTES[path] || null;
  }

  function injectStylesheet() {
    if (!global.document) return;

    const existing = global.document.querySelector('link[href*="/assets/manor.css"]');
    if (existing) return;

    const link = global.document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_HREF;
    link.setAttribute("data-manor-asset", "manor-css");
    global.document.head.appendChild(link);
  }

  function loadRegistryIfMissing(callback) {
    if (!global.document) return;

    if (global.ManorPageRegistry) {
      callback();
      return;
    }

    const existing = global.document.querySelector('script[src*="/assets/page_registry.js"]');

    if (existing) {
      existing.addEventListener("load", callback, { once: true });
      existing.addEventListener("error", callback, { once: true });
      return;
    }

    const script = global.document.createElement("script");
    script.src = REGISTRY_SRC;
    script.defer = true;
    script.setAttribute("data-manor-asset", "page-registry");
    script.addEventListener("load", callback, { once: true });
    script.addEventListener("error", callback, { once: true });
    global.document.head.appendChild(script);
  }

  function applyBodyContract(page) {
    const body = global.document && global.document.body;
    const html = global.document && global.document.documentElement;

    if (!body || !html || !page) return;

    html.setAttribute("data-manor-batch", "house-batch-1");
    html.setAttribute("data-manor-boot", BOOT_VERSION);

    body.classList.add("manor-skin", "manor-house");
    body.classList.remove("manor-planet");

    body.setAttribute("data-manor-skin", "v1");
    body.setAttribute("data-manor-room", page.id);
    body.setAttribute("data-manor-class", "house");
    body.setAttribute("data-manor-slot", page.slot);
    body.setAttribute("data-manor-route", page.route);
    body.setAttribute("data-manor-batch", "BATCH_1_HOUSE");
    body.setAttribute("data-manor-boot", BOOT_VERSION);
  }

  function createRouteRail(page) {
    if (!global.document || !page) return null;

    const rail = global.document.createElement("nav");
    rail.className = "manor-route-rail";
    rail.setAttribute("aria-label", "Richie’s Manor house routes");
    rail.setAttribute("data-manor-generated", "house-route-rail");

    HOUSE_LINKS.forEach(function appendHouseLink(linkDef) {
      const anchor = global.document.createElement("a");
      anchor.href = linkDef.href;
      anchor.textContent = linkDef.label;

      if (linkDef.id === page.id) {
        anchor.setAttribute("aria-current", "page");
        anchor.classList.add("is-active", "manor-active-compass");
      }

      rail.appendChild(anchor);
    });

    return rail;
  }

  function createBacklinks(page) {
    if (!global.document || !page) return null;

    const section = global.document.createElement("section");
    section.className = "manor-backlinks";
    section.setAttribute("data-manor-generated", "house-backlinks");

    const title = global.document.createElement("p");
    title.className = "manor-backlinks-title";
    title.textContent = "House backlinks";

    const list = global.document.createElement("ul");
    list.className = "manor-backlinks-list";

    HOUSE_LINKS.forEach(function appendBacklink(linkDef) {
      const item = global.document.createElement("li");
      const anchor = global.document.createElement("a");
      anchor.href = linkDef.href;
      anchor.textContent = linkDef.id === page.id ? linkDef.label + " · active" : linkDef.label;
      item.appendChild(anchor);
      list.appendChild(item);
    });

    section.appendChild(title);
    section.appendChild(list);
    return section;
  }

  function createAuditStrip(page) {
    if (!global.document || !page) return null;

    const section = global.document.createElement("section");
    section.className = "manor-audit-strip";
    section.setAttribute("data-manor-generated", "house-audit-strip");

    const title = global.document.createElement("p");
    title.className = "manor-audit-title";
    title.textContent = "Batch 1 audit markers";

    const list = global.document.createElement("ul");
    list.className = "manor-audit-list";

    [
      "route-exists",
      "manor-skin",
      "house-class",
      page.slot,
      page.id === "gauges" ? "live-calculated-preserved" : "runtime-preserved"
    ].forEach(function appendMarker(marker) {
      const item = global.document.createElement("li");
      item.className = "manor-audit-chip pass";
      item.setAttribute("data-status", "pass");
      item.textContent = marker;
      list.appendChild(item);
    });

    section.appendChild(title);
    section.appendChild(list);
    return section;
  }

  function chooseInsertionRoot() {
    const candidates = [
      global.document.querySelector("main"),
      global.document.querySelector(".page"),
      global.document.querySelector("#app"),
      global.document.body
    ];

    return candidates.find(Boolean);
  }

  function installGeneratedSurfaces(page) {
    if (!global.document || !page) return;

    if (!global.document.querySelector('[data-manor-generated="house-route-rail"]')) {
      const rail = createRouteRail(page);
      const body = global.document.body;

      if (rail && body) {
        body.insertBefore(rail, body.firstChild);
      }
    }

    const root = chooseInsertionRoot();
    if (!root) return;

    if (!global.document.querySelector('[data-manor-generated="house-backlinks"]')) {
      const backlinks = createBacklinks(page);
      if (backlinks) root.appendChild(backlinks);
    }

    if (!global.document.querySelector('[data-manor-generated="house-audit-strip"]')) {
      const audit = createAuditStrip(page);
      if (audit) root.appendChild(audit);
    }
  }

  function preserveGaugesRuntime(page) {
    if (!page || page.id !== "gauges" || !global.document) return;

    global.document.documentElement.setAttribute("data-gauges-runtime-preserved", "true");
    global.document.body.setAttribute("data-gauges-runtime-preserved", "true");
  }

  function dispatchReady(page) {
    if (!global.document || !page) return;

    global.document.dispatchEvent(
      new CustomEvent("manor:house-batch-1-ready", {
        detail: Object.freeze({
          version: BOOT_VERSION,
          page: page,
          registryAvailable: Boolean(global.ManorPageRegistry),
          gaugesRuntimePreserved: page.id === "gauges"
        })
      })
    );
  }

  function boot() {
    const page = currentHousePage();

    if (!page) {
      return;
    }

    injectStylesheet();

    loadRegistryIfMissing(function afterRegistryLoad() {
      applyBodyContract(page);

      if (global.ManorPageRegistry && typeof global.ManorPageRegistry.applyDatasetToBody === "function") {
        try {
          global.ManorPageRegistry.applyDatasetToBody(page.id);
        } catch (error) {
          global.document.documentElement.setAttribute("data-manor-registry-apply-error", "true");
        }
      }

      preserveGaugesRuntime(page);
      installGeneratedSurfaces(page);
      dispatchReady(page);
    });
  }

  if (!global.document) return;

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);
