// /showroom/globe/index.js
// SHOWROOM_GLOBE_LEGACY_ANCHOR_ROUTE_BRIDGE_JS_TNT_v1
// Full-file replacement.
// Showroom Globe great-grandparent legacy route bridge.
// Purpose:
// - Keeps /showroom/globe/ as the public planet-family gateway.
// - Verifies route cards and page-level legacy-anchor posture.
// - Reports receipts to the HTML shell.
// - Does not import Audralia clean-canvas files.
// - Does not mount Audralia engine.
// - Does not own planet science, runtime motion, controls, canvas composition, or child route authority.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_GLOBE_LEGACY_ANCHOR_ROUTE_BRIDGE_JS_TNT_v1";
  const RECEIPT = "SHOWROOM_GLOBE_LEGACY_ANCHOR_ROUTE_BRIDGE_JS_RECEIPT_v1";
  const HTML_CONTRACT = "SHOWROOM_GLOBE_LEGACY_ANCHOR_RENEWAL_HTML_TNT_v1";
  const VERSION = "2026-05-20.showroom-globe-legacy-anchor-route-bridge-v1";
  const ROUTE = "/showroom/globe/";

  const REQUIRED_ROUTES = Object.freeze([
    {
      key: "compass",
      label: "Compass",
      href: "/",
      role: "site-root"
    },
    {
      key: "showroom",
      label: "Showroom",
      href: "/showroom/",
      role: "parent-showroom"
    },
    {
      key: "zionts",
      label: "ZIONTS / Earth",
      href: "/showroom/globe/earth/",
      role: "consequence-route"
    },
    {
      key: "audralia",
      label: "Audralia",
      href: "/showroom/globe/audralia/",
      role: "possibility-route"
    },
    {
      key: "h-earth",
      label: "H-Earth",
      href: "/showroom/globe/h-earth/",
      role: "audralia-ground-view-route"
    },
    {
      key: "hearth",
      label: "Hearth",
      href: "/showroom/globe/hearth/",
      role: "formation-route"
    },
    {
      key: "gauges",
      label: "Gauges",
      href: "/gauges/",
      role: "measurement-route"
    }
  ]);

  const state = {
    booted: false,
    receipt: null,
    checkedAt: null
  };

  function doc() {
    return typeof document !== "undefined" ? document : null;
  }

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function setDataset(key, value) {
    const d = doc();
    if (!d?.documentElement?.dataset) return;

    try {
      d.documentElement.dataset[key] = String(value);
    } catch {
      // Dataset writes are legacy proof metadata only.
    }
  }

  function byId(id) {
    const d = doc();
    return d ? d.getElementById(id) : null;
  }

  function qs(selector) {
    const d = doc();
    return d ? d.querySelector(selector) : null;
  }

  function qsa(selector) {
    const d = doc();
    return d ? Array.from(d.querySelectorAll(selector)) : [];
  }

  function statusNode() {
    return byId("showroom-globe-status") || qs("[data-showroom-globe-status]");
  }

  function receiptList() {
    return byId("showroom-globe-receipts") || qs("[data-showroom-globe-receipts]");
  }

  function writeStatus(message, tone = "ready") {
    const node = statusNode();
    if (!node) return;

    node.textContent = message;
    node.dataset.statusTone = tone;
  }

  function appendReceipt(message) {
    const list = receiptList();
    const d = doc();

    if (!list || !d) return;

    const item = d.createElement("li");
    item.textContent = message;
    list.appendChild(item);
  }

  function normalizeHref(href) {
    try {
      const url = new URL(href, win().location?.origin || "https://diamondgatebridge.com");
      return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    } catch {
      const raw = String(href || "").trim();
      return raw.endsWith("/") ? raw : `${raw}/`;
    }
  }

  function inspectHtmlShell() {
    const html = doc()?.documentElement;

    return Object.freeze({
      shellAvailable: Boolean(html),
      expectedRoute: ROUTE,
      actualRoute: html?.dataset?.route || null,
      routeValid: html?.dataset?.route === ROUTE,
      expectedContract: HTML_CONTRACT,
      actualContract: html?.dataset?.contract || null,
      contractValid: html?.dataset?.contract === HTML_CONTRACT,
      page: html?.dataset?.page || null,
      pageValid: html?.dataset?.page === "showroom-globe",
      legacyAnchor: html?.dataset?.grandparentStatus === "legacy-anchor",
      audraliaCleanCanvasChild: html?.dataset?.audraliaCleanCanvasChild === "false",
      audraliaEngineMount: html?.dataset?.audraliaEngineMount === "false",
      generatedImage: html?.dataset?.generatedImage === "false",
      graphicBox: html?.dataset?.graphicBox === "false",
      visualPassClaimed: html?.dataset?.visualPassClaimed === "false"
    });
  }

  function inspectRoutes() {
    const anchors = qsa("a[href]");
    const hrefs = new Set(anchors.map((anchor) => normalizeHref(anchor.getAttribute("href"))));

    const items = REQUIRED_ROUTES.map((route) => {
      const normalized = normalizeHref(route.href);

      return Object.freeze({
        key: route.key,
        label: route.label,
        role: route.role,
        href: route.href,
        normalized,
        present: hrefs.has(normalized)
      });
    });

    return Object.freeze({
      required: REQUIRED_ROUTES.length,
      present: items.filter((item) => item.present).length,
      missing: Object.freeze(items.filter((item) => !item.present)),
      items: Object.freeze(items),
      complete: items.every((item) => item.present)
    });
  }

  function inspectForbiddenImports() {
    const scripts = qsa("script[src]");
    const srcs = scripts.map((script) => script.getAttribute("src") || "");

    const forbidden = srcs.filter((src) =>
      src.includes("/assets/audralia/clean/") ||
      src.includes("audralia.engine.js") ||
      src.includes("audralia.canvas.js") ||
      src.includes("audralia.runtime.js")
    );

    return Object.freeze({
      scriptCount: scripts.length,
      forbidden,
      valid: forbidden.length === 0,
      audraliaEngineMounted: Boolean(win().AUDRALIA_CLEAN_CANVAS_ENGINE || win().AUDRALIA_ENGINE) === false
    });
  }

  function inspectNodes() {
    const gateway = qs("[data-showroom-globe-gateway]");
    const root = qs("[data-showroom-globe-root]");
    const planetNodes = qsa(".planet-node");

    return Object.freeze({
      rootPresent: Boolean(root),
      gatewayPresent: Boolean(gateway),
      planetNodeCount: planetNodes.length,
      minimumPlanetNodesPresent: planetNodes.length >= 4,
      nodeKeys: Object.freeze(planetNodes.map((node) => node.getAttribute("data-node") || "unknown"))
    });
  }

  function buildReceipt() {
    const htmlShell = inspectHtmlShell();
    const routes = inspectRoutes();
    const forbiddenImports = inspectForbiddenImports();
    const nodes = inspectNodes();

    const valid =
      htmlShell.routeValid &&
      htmlShell.contractValid &&
      htmlShell.pageValid &&
      htmlShell.legacyAnchor &&
      htmlShell.audraliaCleanCanvasChild &&
      htmlShell.audraliaEngineMount &&
      routes.complete &&
      forbiddenImports.valid &&
      nodes.rootPresent &&
      nodes.gatewayPresent &&
      nodes.minimumPlanetNodesPresent;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      version: VERSION,
      route: ROUTE,
      authority: "showroom-globe-great-grandparent-legacy-route-bridge",
      checkedAt: new Date().toISOString(),
      valid,
      htmlShell,
      routes,
      forbiddenImports,
      nodes,
      ownsGreatGrandparentRouteSelector: true,
      ownsPublicGatewayLanguage: true,
      ownsPlanetScience: false,
      ownsAudraliaCleanCanvas: false,
      ownsAudraliaEngineMount: false,
      ownsRuntimeMotion: false,
      ownsControls: false,
      ownsCanvasComposition: false,
      ownsChildRouteAuthority: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function publishReceipt(receipt) {
    state.receipt = receipt;
    state.checkedAt = receipt.checkedAt;

    win().SHOWROOM_GLOBE_LEGACY_ANCHOR = API;
    win().SHOWROOM_GLOBE_LEGACY_ANCHOR_RECEIPT = receipt;
    win().SHOWROOM_GLOBE_LEGACY_ROUTE_BRIDGE = API;
    win().SHOWROOM_GLOBE_LEGACY_ROUTE_BRIDGE_RECEIPT = receipt;

    setDataset("showroomGlobeLegacyBridgeLoaded", "true");
    setDataset("showroomGlobeLegacyBridgeContract", CONTRACT);
    setDataset("showroomGlobeLegacyBridgeReceipt", RECEIPT);
    setDataset("showroomGlobeLegacyBridgeVersion", VERSION);
    setDataset("showroomGlobeLegacyAnchorValid", receipt.valid ? "true" : "false");
    setDataset("showroomGlobeLegacyRoutesComplete", receipt.routes.complete ? "true" : "false");
    setDataset("showroomGlobeForbiddenAudraliaImports", receipt.forbiddenImports.valid ? "false" : "true");
    setDataset("showroomGlobeOwnsGreatGrandparentRouteSelector", "true");
    setDataset("showroomGlobeOwnsPlanetScience", "false");
    setDataset("showroomGlobeOwnsAudraliaCleanCanvas", "false");
    setDataset("showroomGlobeOwnsAudraliaEngineMount", "false");
    setDataset("showroomGlobeOwnsRuntimeMotion", "false");
    setDataset("showroomGlobeOwnsControls", "false");
    setDataset("showroomGlobeOwnsCanvasComposition", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("visualPassClaimed", "false");

    writeStatus(
      receipt.valid
        ? "Legacy gateway restored."
        : "Legacy gateway loaded with held checks.",
      receipt.valid ? "ready" : "held"
    );

    appendReceipt(`${CONTRACT} · valid=${receipt.valid}`);
    appendReceipt(`routes present ${receipt.routes.present}/${receipt.routes.required}`);
    appendReceipt(`forbidden Audralia clean-canvas imports=${receipt.forbiddenImports.forbidden.length}`);

    return receipt;
  }

  function boot() {
    if (state.booted) return state.receipt;

    state.booted = true;
    writeStatus("Checking legacy gateway.", "loading");
    setDataset("showroomGlobeLegacyBridgeBooting", "true");

    const receipt = publishReceipt(buildReceipt());

    setDataset("showroomGlobeLegacyBridgeBooting", "false");
    return receipt;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      version: VERSION,
      route: ROUTE,
      requiredRoutes: REQUIRED_ROUTES,
      booted: state.booted,
      checkedAt: state.checkedAt,
      lastReceipt: state.receipt,
      ownsGreatGrandparentRouteSelector: true,
      ownsPublicGatewayLanguage: true,
      ownsPlanetScience: false,
      ownsAudraliaCleanCanvas: false,
      ownsAudraliaEngineMount: false,
      ownsRuntimeMotion: false,
      ownsControls: false,
      ownsCanvasComposition: false,
      ownsChildRouteAuthority: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    htmlContract: HTML_CONTRACT,
    version: VERSION,
    route: ROUTE,
    requiredRoutes: REQUIRED_ROUTES,
    boot,
    inspectHtmlShell,
    inspectRoutes,
    inspectForbiddenImports,
    inspectNodes,
    getStatus
  });

  win().SHOWROOM_GLOBE_LEGACY_ANCHOR = API;
  win().SHOWROOM_GLOBE_LEGACY_ROUTE_BRIDGE = API;

  if (doc()?.readyState === "loading") {
    doc().addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
