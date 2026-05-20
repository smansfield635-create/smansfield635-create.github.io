// /showroom/globe/index.js
// SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_VISUAL_RESTORATION_JS_TNT_v3
// Full-file replacement.
// Showroom Globe great-grandparent Mirrorland orbit gem gateway verifier.
// Verifies only. Does not create layout, import engines, mount runtime, or own planet science.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_VISUAL_RESTORATION_JS_TNT_v3";
  const RECEIPT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_VISUAL_RESTORATION_JS_RECEIPT_v3";
  const HTML_CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_VISUAL_RESTORATION_HTML_TNT_v3";
  const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_JS_TNT_v2";
  const VERSION = "2026-05-20.showroom-globe-mirrorland-orbit-gem-gateway-visual-restoration-js-v3";
  const ROUTE = "/showroom/globe/";
  const SEASON_TITLE = "Shadows Never Shatter in Mirrorland";

  const PRIMARY_GEMS = Object.freeze([
    { key: "zionts", href: "/showroom/globe/earth/", selector: '[data-primary-gem="zionts"]' },
    { key: "audralia", href: "/showroom/globe/audralia/", selector: '[data-primary-gem="audralia"]' },
    { key: "h-earth", href: "/showroom/globe/h-earth/", selector: '[data-primary-gem="h-earth"]' }
  ]);

  const SECONDARY_GEMS = Object.freeze([
    { key: "portal-premise", href: "#portal-premise", selector: '[data-secondary-gem="portal-premise"]' },
    { key: "mirror-law", href: "#mirror-law", selector: '[data-secondary-gem="mirror-law"]' },
    { key: "no-return-rule", href: "#no-return-rule", selector: '[data-secondary-gem="no-return-rule"]' },
    { key: "window-rule", href: "#window-rule", selector: '[data-secondary-gem="window-rule"]' },
    { key: "characters", href: "/characters/", selector: '[data-secondary-gem="characters"]' },
    { key: "showroom", href: "/showroom/", selector: '[data-secondary-gem="showroom"]' },
    { key: "gauges", href: "/gauges/", selector: '[data-secondary-gem="gauges"]' }
  ]);

  const REQUIRED_ANCHORS = Object.freeze([
    "mirrorland-orbit",
    "portal-premise",
    "mirror-law",
    "no-return-rule",
    "window-rule"
  ]);

  const FORBIDDEN_SCRIPT_PATTERNS = Object.freeze([
    "/assets/audralia/clean/",
    "audralia.engine.js",
    "audralia.canvas.js",
    "audralia.runtime.js",
    "audralia.controls.js",
    "audralia.surface.js",
    "audralia.atmosphere.js",
    "three.min.js",
    "webgl"
  ]);

  const FORBIDDEN_GLOBALS = Object.freeze([
    "AUDRALIA_CLEAN_CANVAS_ENGINE",
    "AUDRALIA_ENGINE",
    "AUDRALIA_CLEAN_CANVAS_RUNTIME",
    "AUDRALIA_RUNTIME",
    "AUDRALIA_CLEAN_CANVAS_COMPOSITOR",
    "AUDRALIA_CANVAS"
  ]);

  const state = {
    booted: false,
    checkedAt: null,
    receipt: null
  };

  function doc() {
    return typeof document !== "undefined" ? document : null;
  }

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function qs(selector) {
    return doc()?.querySelector(selector) || null;
  }

  function qsa(selector) {
    return Array.from(doc()?.querySelectorAll(selector) || []);
  }

  function byId(id) {
    return doc()?.getElementById(id) || null;
  }

  function setDataset(key, value) {
    if (!doc()?.documentElement?.dataset) return;
    doc().documentElement.dataset[key] = String(value);
  }

  function normalizeHref(href) {
    const raw = String(href || "").trim();
    if (raw.startsWith("#")) return raw;
    try {
      const url = new URL(raw, win().location?.origin || "https://diamondgatebridge.com");
      return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    } catch {
      return raw.endsWith("/") ? raw : `${raw}/`;
    }
  }

  function expectedHrefMatches(actual, expected) {
    return normalizeHref(actual) === normalizeHref(expected);
  }

  function statusNode() {
    return byId("mirrorland-orbit-status") || qs("[data-mirrorland-orbit-status]");
  }

  function receiptList() {
    return byId("mirrorland-orbit-receipts") || qs("[data-mirrorland-orbit-receipts]");
  }

  function writeStatus(message) {
    const node = statusNode();
    if (node) node.textContent = message;
  }

  function appendReceipt(message) {
    const list = receiptList();
    if (!list || !doc()) return;
    const item = doc().createElement("li");
    item.textContent = message;
    list.appendChild(item);
  }

  function closeNativeMenuOnClick() {
    const menu = qs("[data-site-menu]");
    if (!menu) return Object.freeze({ available: false, bound: false });

    qsa("[data-site-menu] a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.removeAttribute("open");
      });
    });

    doc().addEventListener("keydown", (event) => {
      if (event.key === "Escape") menu.removeAttribute("open");
    });

    return Object.freeze({ available: true, bound: true, nativeDetails: true });
  }

  function inspectHtmlShell() {
    const html = doc()?.documentElement;

    return Object.freeze({
      routeValid: html?.dataset?.route === ROUTE,
      contractValid: html?.dataset?.contract === HTML_CONTRACT,
      pageValid: html?.dataset?.page === "showroom-globe",
      seasonValid: html?.dataset?.season === SEASON_TITLE,
      roleValid: html?.dataset?.role === "mirrorland-narrative-orbit-gateway",
      authorityValid: html?.dataset?.authority === "great-grandparent-mirrorland-orbit-gem-gateway-expression-only",
      legacyAnchor: html?.dataset?.grandparentStatus === "legacy-anchor",
      audraliaCleanCanvasChild: html?.dataset?.audraliaCleanCanvasChild === "false",
      audraliaEngineMount: html?.dataset?.audraliaEngineMount === "false",
      generatedImage: html?.dataset?.generatedImage === "false",
      graphicBox: html?.dataset?.graphicBox === "false",
      visualPassClaimed: html?.dataset?.visualPassClaimed === "false"
    });
  }

  function inspectNarrativeContent() {
    const text = String(doc()?.body?.innerText || "");

    const checks = Object.freeze({
      titlePresent: text.includes(SEASON_TITLE),
      windowLinePresent: text.includes("The website is not the portal. It is the window."),
      bermudaPresent: text.includes("Bermuda Triangle"),
      noReturnPresent: text.includes("cannot come back"),
      portalPremisePresent: text.includes("Portal Premise"),
      mirrorLawPresent: text.includes("Mirror Law"),
      noReturnRulePresent: text.includes("No Return Rule"),
      windowRulePresent: text.includes("Window Rule")
    });

    return Object.freeze({
      valid: Object.values(checks).every(Boolean),
      checks
    });
  }

  function inspectGemSet(items) {
    const inspected = items.map((item) => {
      const node = qs(item.selector);
      const actualHref = node?.getAttribute?.("href") || "";
      const hasSvg = Boolean(node?.querySelector?.("svg"));
      const valid = Boolean(node) && expectedHrefMatches(actualHref, item.href) && hasSvg;

      return Object.freeze({
        key: item.key,
        selector: item.selector,
        expectedHref: item.href,
        actualHref,
        nodePresent: Boolean(node),
        hrefValid: expectedHrefMatches(actualHref, item.href),
        svgGemPresent: hasSvg,
        valid
      });
    });

    return Object.freeze({
      required: items.length,
      validCount: inspected.filter((item) => item.valid).length,
      complete: inspected.every((item) => item.valid),
      items: Object.freeze(inspected)
    });
  }

  function inspectAnchors() {
    const anchors = REQUIRED_ANCHORS.map((id) => Object.freeze({
      id,
      present: Boolean(byId(id))
    }));

    const returnLinks = qsa("[data-return-to-orbit]");

    return Object.freeze({
      required: REQUIRED_ANCHORS.length,
      present: anchors.filter((item) => item.present).length,
      complete: anchors.every((item) => item.present),
      returnToOrbitCount: returnLinks.length,
      returnToOrbitValid: returnLinks.length >= 4
    });
  }

  function inspectForbiddenImports() {
    const scripts = qsa("script[src]");
    const srcs = scripts.map((script) => String(script.getAttribute("src") || ""));
    const forbiddenScripts = srcs.filter((src) => {
      const lower = src.toLowerCase();
      return FORBIDDEN_SCRIPT_PATTERNS.some((pattern) => lower.includes(String(pattern).toLowerCase()));
    });
    const forbiddenGlobals = FORBIDDEN_GLOBALS.filter((name) => Boolean(win()[name]));

    return Object.freeze({
      scriptCount: scripts.length,
      forbiddenScripts: Object.freeze(forbiddenScripts),
      forbiddenGlobals: Object.freeze(forbiddenGlobals),
      valid: forbiddenScripts.length === 0 && forbiddenGlobals.length === 0
    });
  }

  function inspectStructure() {
    const primaryOrbit = qs("[data-primary-orbit]");
    const rotor = qs(".orbit-rotor");
    const centerGem = qs(".center-gem");
    const primaryGems = qsa("[data-primary-gem]");
    const secondaryGems = qsa("[data-secondary-gem]");
    const menu = qs("[data-site-menu]");

    return Object.freeze({
      primaryOrbitPresent: Boolean(primaryOrbit),
      rotorPresent: Boolean(rotor),
      centerGemPresent: Boolean(centerGem),
      primaryGemCount: primaryGems.length,
      secondaryGemCount: secondaryGems.length,
      nativeMenuPresent: Boolean(menu),
      valid:
        Boolean(primaryOrbit) &&
        Boolean(rotor) &&
        Boolean(centerGem) &&
        primaryGems.length === 3 &&
        secondaryGems.length >= 7 &&
        Boolean(menu)
    });
  }

  function buildReceipt(menuReceipt) {
    const htmlShell = inspectHtmlShell();
    const narrative = inspectNarrativeContent();
    const primaryGems = inspectGemSet(PRIMARY_GEMS);
    const secondaryGems = inspectGemSet(SECONDARY_GEMS);
    const anchors = inspectAnchors();
    const forbiddenImports = inspectForbiddenImports();
    const structure = inspectStructure();

    const valid =
      Object.values(htmlShell).every(Boolean) &&
      narrative.valid &&
      primaryGems.complete &&
      secondaryGems.complete &&
      anchors.complete &&
      anchors.returnToOrbitValid &&
      forbiddenImports.valid &&
      structure.valid &&
      menuReceipt.bound;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      seasonTitle: SEASON_TITLE,
      checkedAt: new Date().toISOString(),
      valid,
      htmlShell,
      narrative,
      primaryGems,
      secondaryGems,
      anchors,
      forbiddenImports,
      structure,
      menu: menuReceipt,
      ownsGreatGrandparentNarrativeOrbitGateway: true,
      ownsPublicNarrativeExpression: false,
      ownsVisualIdentity: false,
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

    win().SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY = API;
    win().SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_RECEIPT = receipt;
    win().MIRRORLAND_ORBIT_GEM_GATEWAY = API;
    win().MIRRORLAND_ORBIT_GEM_GATEWAY_RECEIPT = receipt;

    setDataset("mirrorlandOrbitGemGatewayBridgeLoaded", "true");
    setDataset("mirrorlandOrbitGemGatewayBridgeContract", CONTRACT);
    setDataset("mirrorlandOrbitGemGatewayBridgeReceipt", RECEIPT);
    setDataset("mirrorlandOrbitGemGatewayBridgeVersion", VERSION);
    setDataset("mirrorlandOrbitGemGatewayValid", receipt.valid ? "true" : "false");
    setDataset("mirrorlandOrbitGemGatewayPrimaryGemsComplete", receipt.primaryGems.complete ? "true" : "false");
    setDataset("mirrorlandOrbitGemGatewaySecondaryGemsComplete", receipt.secondaryGems.complete ? "true" : "false");
    setDataset("mirrorlandOrbitGemGatewayForbiddenImportsPresent", receipt.forbiddenImports.valid ? "false" : "true");
    setDataset("mirrorlandOrbitGemGatewayOwnsAudraliaEngineMount", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("visualPassClaimed", "false");

    writeStatus(receipt.valid ? "Mirrorland orbit gateway verified." : "Mirrorland orbit gateway loaded with held checks.");

    appendReceipt(`${CONTRACT} · valid=${receipt.valid}`);
    appendReceipt(`primary SVG gems valid ${receipt.primaryGems.validCount}/${receipt.primaryGems.required}`);
    appendReceipt(`secondary SVG gems valid ${receipt.secondaryGems.validCount}/${receipt.secondaryGems.required}`);
    appendReceipt(`return-to-orbit controls=${receipt.anchors.returnToOrbitCount}`);
    appendReceipt(`forbidden child-engine imports=${receipt.forbiddenImports.forbiddenScripts.length}`);
    appendReceipt(`forbidden child-engine globals=${receipt.forbiddenImports.forbiddenGlobals.length}`);

    return receipt;
  }

  function boot() {
    if (state.booted) return state.receipt;
    state.booted = true;

    writeStatus("Checking Mirrorland orbit gateway.");
    setDataset("mirrorlandOrbitGemGatewayBridgeBooting", "true");

    const menuReceipt = closeNativeMenuOnClick();
    const receipt = publishReceipt(buildReceipt(menuReceipt));

    setDataset("mirrorlandOrbitGemGatewayBridgeBooting", "false");
    return receipt;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      seasonTitle: SEASON_TITLE,
      booted: state.booted,
      checkedAt: state.checkedAt,
      lastReceipt: state.receipt,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    htmlContract: HTML_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    boot,
    inspectHtmlShell,
    inspectNarrativeContent,
    inspectGemSet,
    inspectAnchors,
    inspectForbiddenImports,
    inspectStructure,
    getStatus
  });

  win().SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY = API;
  win().MIRRORLAND_ORBIT_GEM_GATEWAY = API;

  if (doc()?.readyState === "loading") {
    doc().addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
