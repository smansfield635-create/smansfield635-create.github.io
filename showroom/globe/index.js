// /showroom/globe/index.js
// SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_JS_TNT_v2
// Full-file replacement.
// Showroom Globe great-grandparent Mirrorland orbit gem gateway verifier.
// Purpose:
// - Verifies /showroom/globe/ as the narrative orbit gateway for Shadows Never Shatter in Mirrorland.
// - Confirms three primary planet gems exist and remain dominant.
// - Confirms secondary gem jumps exist.
// - Confirms Return to Orbit anchors exist.
// - Supports dropdown/menu behavior.
// - Confirms forbidden Audralia clean-canvas imports are absent.
// - Confirms no Audralia engine is mounted.
// - Updates a small status line and receipt list.
// - Does not create the visual identity.
// - Does not import child planet files.
// - Does not mount runtime, controls, canvas, or engine.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_JS_TNT_v2";
  const RECEIPT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_JS_RECEIPT_v2";
  const HTML_CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_HTML_TNT_v2";
  const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY_JS_TNT_v1";
  const VERSION = "2026-05-20.showroom-globe-mirrorland-orbit-gem-gateway-js-v2";
  const ROUTE = "/showroom/globe/";
  const SEASON_TITLE = "Shadows Never Shatter in Mirrorland";

  const PRIMARY_GEMS = Object.freeze([
    {
      key: "zionts",
      label: "ZIONTS / Consequence",
      href: "/showroom/globe/earth/",
      selector: '[data-primary-gem="zionts"]',
      role: "consequence-planetary-gem"
    },
    {
      key: "audralia",
      label: "Audralia / Possibility",
      href: "/showroom/globe/audralia/",
      selector: '[data-primary-gem="audralia"]',
      role: "possibility-planetary-gem"
    },
    {
      key: "h-earth",
      label: "H-Earth / Survival",
      href: "/showroom/globe/h-earth/",
      selector: '[data-primary-gem="h-earth"]',
      role: "survival-planetary-gem"
    }
  ]);

  const SECONDARY_GEMS = Object.freeze([
    {
      key: "portal-premise",
      label: "Portal Premise",
      href: "#portal-premise",
      selector: '[data-secondary-gem="portal-premise"]',
      role: "same-page-jump"
    },
    {
      key: "mirror-law",
      label: "Mirror Law",
      href: "#mirror-law",
      selector: '[data-secondary-gem="mirror-law"]',
      role: "same-page-jump"
    },
    {
      key: "no-return-rule",
      label: "No Return Rule",
      href: "#no-return-rule",
      selector: '[data-secondary-gem="no-return-rule"]',
      role: "same-page-jump"
    },
    {
      key: "window-rule",
      label: "Window Rule",
      href: "#window-rule",
      selector: '[data-secondary-gem="window-rule"]',
      role: "same-page-jump"
    },
    {
      key: "characters",
      label: "Characters",
      href: "/characters/",
      selector: '[data-secondary-gem="characters"]',
      role: "secondary-route-door"
    },
    {
      key: "showroom",
      label: "Showroom",
      href: "/showroom/",
      selector: '[data-secondary-gem="showroom"]',
      role: "secondary-route-door"
    },
    {
      key: "gauges",
      label: "Gauges",
      href: "/gauges/",
      selector: '[data-secondary-gem="gauges"]',
      role: "secondary-route-door"
    }
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
    receipt: null,
    checkedAt: null,
    dropdownOpen: false
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
      // Dataset writes are proof metadata only.
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
    return byId("mirrorland-orbit-status") || qs("[data-mirrorland-orbit-status]");
  }

  function receiptList() {
    return byId("mirrorland-orbit-receipts") || qs("[data-mirrorland-orbit-receipts]");
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

  function setupDropdown() {
    const button = qs("[data-dropdown-trigger]");
    const panel = qs("[data-dropdown-panel]");

    if (!button || !panel) {
      return Object.freeze({
        available: false,
        bound: false,
        reason: "dropdown_elements_missing"
      });
    }

    function setOpen(open) {
      state.dropdownOpen = Boolean(open);
      panel.dataset.open = state.dropdownOpen ? "true" : "false";
      button.setAttribute("aria-expanded", state.dropdownOpen ? "true" : "false");
    }

    button.addEventListener("click", () => {
      setOpen(!state.dropdownOpen);
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (target && target.closest && target.closest("a")) {
        setOpen(false);
      }
    });

    doc().addEventListener("click", (event) => {
      if (!state.dropdownOpen) return;
      if (button.contains(event.target) || panel.contains(event.target)) return;
      setOpen(false);
    });

    doc().addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    setOpen(false);

    return Object.freeze({
      available: true,
      bound: true,
      reason: "dropdown_bound"
    });
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

      expectedPage: "showroom-globe",
      actualPage: html?.dataset?.page || null,
      pageValid: html?.dataset?.page === "showroom-globe",

      expectedSeason: SEASON_TITLE,
      actualSeason: html?.dataset?.season || null,
      seasonValid: html?.dataset?.season === SEASON_TITLE,

      authority: html?.dataset?.authority || null,
      authorityValid: html?.dataset?.authority === "great-grandparent-mirrorland-orbit-gem-gateway-expression-only",

      role: html?.dataset?.role || null,
      roleValid: html?.dataset?.role === "mirrorland-narrative-orbit-gateway",

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
      orbitPresent: text.includes("orbit"),
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
      const actualHref = node?.getAttribute?.("href") || null;

      return Object.freeze({
        key: item.key,
        label: item.label,
        role: item.role,
        selector: item.selector,
        expectedHref: item.href,
        actualHref,
        nodePresent: Boolean(node),
        hrefValid: expectedHrefMatches(actualHref, item.href),
        valid: Boolean(node) && expectedHrefMatches(actualHref, item.href)
      });
    });

    return Object.freeze({
      required: items.length,
      validCount: inspected.filter((item) => item.valid).length,
      presentCount: inspected.filter((item) => item.nodePresent).length,
      missing: Object.freeze(inspected.filter((item) => !item.valid)),
      items: Object.freeze(inspected),
      complete: inspected.every((item) => item.valid)
    });
  }

  function inspectAnchors() {
    const items = REQUIRED_ANCHORS.map((id) => {
      const node = byId(id);

      return Object.freeze({
        id,
        present: Boolean(node)
      });
    });

    const returnLinks = qsa("[data-return-to-orbit]");

    return Object.freeze({
      required: REQUIRED_ANCHORS.length,
      present: items.filter((item) => item.present).length,
      items: Object.freeze(items),
      complete: items.every((item) => item.present),
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
      scripts: Object.freeze(srcs),
      forbiddenScripts: Object.freeze(forbiddenScripts),
      forbiddenGlobals: Object.freeze(forbiddenGlobals),
      valid: forbiddenScripts.length === 0 && forbiddenGlobals.length === 0,
      audraliaEngineMounted: forbiddenGlobals.includes("AUDRALIA_CLEAN_CANVAS_ENGINE") || forbiddenGlobals.includes("AUDRALIA_ENGINE")
    });
  }

  function inspectStructure() {
    const root = qs("[data-mirrorland-root]");
    const orbit = qs("[data-mirrorland-orbit]");
    const primaryOrbit = qs("[data-primary-orbit]");
    const centerGem = qs(".center-gem");
    const primaryGems = qsa("[data-primary-gem]");
    const secondaryGems = qsa("[data-secondary-gem]");
    const infoSections = qsa("[data-info-section]");
    const dropdownButton = qs("[data-dropdown-trigger]");
    const dropdownPanel = qs("[data-dropdown-panel]");

    return Object.freeze({
      rootPresent: Boolean(root),
      orbitPresent: Boolean(orbit),
      primaryOrbitPresent: Boolean(primaryOrbit),
      centerGemPresent: Boolean(centerGem),
      primaryGemCount: primaryGems.length,
      secondaryGemCount: secondaryGems.length,
      infoSectionCount: infoSections.length,
      dropdownPresent: Boolean(dropdownButton && dropdownPanel),
      valid:
        Boolean(root) &&
        Boolean(orbit) &&
        Boolean(primaryOrbit) &&
        Boolean(centerGem) &&
        primaryGems.length === 3 &&
        secondaryGems.length >= 7 &&
        infoSections.length >= 4 &&
        Boolean(dropdownButton && dropdownPanel)
    });
  }

  function buildReceipt(dropdownReceipt) {
    const htmlShell = inspectHtmlShell();
    const narrative = inspectNarrativeContent();
    const primaryGems = inspectGemSet(PRIMARY_GEMS);
    const secondaryGems = inspectGemSet(SECONDARY_GEMS);
    const anchors = inspectAnchors();
    const forbiddenImports = inspectForbiddenImports();
    const structure = inspectStructure();

    const valid =
      htmlShell.routeValid &&
      htmlShell.contractValid &&
      htmlShell.pageValid &&
      htmlShell.seasonValid &&
      htmlShell.authorityValid &&
      htmlShell.roleValid &&
      htmlShell.legacyAnchor &&
      htmlShell.audraliaCleanCanvasChild &&
      htmlShell.audraliaEngineMount &&
      htmlShell.generatedImage &&
      htmlShell.graphicBox &&
      htmlShell.visualPassClaimed &&
      narrative.valid &&
      primaryGems.complete &&
      secondaryGems.complete &&
      anchors.complete &&
      anchors.returnToOrbitValid &&
      forbiddenImports.valid &&
      structure.valid &&
      dropdownReceipt.bound;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      seasonTitle: SEASON_TITLE,
      authority: "showroom-globe-great-grandparent-mirrorland-orbit-gem-gateway-verifier",
      checkedAt: new Date().toISOString(),
      valid,

      htmlShell,
      narrative,
      primaryGems,
      secondaryGems,
      anchors,
      forbiddenImports,
      structure,
      dropdown: dropdownReceipt,

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
    setDataset("mirrorlandOrbitGemGatewayReturnAnchorsValid", receipt.anchors.returnToOrbitValid ? "true" : "false");
    setDataset("mirrorlandOrbitGemGatewayForbiddenImportsPresent", receipt.forbiddenImports.valid ? "false" : "true");
    setDataset("mirrorlandOrbitGemGatewayOwnsGreatGrandparentNarrativeOrbitGateway", "true");
    setDataset("mirrorlandOrbitGemGatewayOwnsPlanetScience", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsAudraliaCleanCanvas", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsAudraliaEngineMount", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsRuntimeMotion", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsControls", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsCanvasComposition", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("visualPassClaimed", "false");

    writeStatus(
      receipt.valid
        ? "Mirrorland orbit gateway verified."
        : "Mirrorland orbit gateway loaded with held checks.",
      receipt.valid ? "ready" : "held"
    );

    appendReceipt(`${CONTRACT} · valid=${receipt.valid}`);
    appendReceipt(`primary gems valid ${receipt.primaryGems.validCount}/${receipt.primaryGems.required}`);
    appendReceipt(`secondary gems valid ${receipt.secondaryGems.validCount}/${receipt.secondaryGems.required}`);
    appendReceipt(`return-to-orbit controls=${receipt.anchors.returnToOrbitCount}`);
    appendReceipt(`forbidden child-engine imports=${receipt.forbiddenImports.forbiddenScripts.length}`);
    appendReceipt(`forbidden child-engine globals=${receipt.forbiddenImports.forbiddenGlobals.length}`);

    return receipt;
  }

  function boot() {
    if (state.booted) return state.receipt;

    state.booted = true;
    writeStatus("Checking Mirrorland orbit gateway.", "loading");
    setDataset("mirrorlandOrbitGemGatewayBridgeBooting", "true");

    const dropdownReceipt = setupDropdown();
    const receipt = publishReceipt(buildReceipt(dropdownReceipt));

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
      primaryGems: PRIMARY_GEMS,
      secondaryGems: SECONDARY_GEMS,
      requiredAnchors: REQUIRED_ANCHORS,
      forbiddenScriptPatterns: FORBIDDEN_SCRIPT_PATTERNS,
      forbiddenGlobals: FORBIDDEN_GLOBALS,
      booted: state.booted,
      checkedAt: state.checkedAt,
      dropdownOpen: state.dropdownOpen,
      lastReceipt: state.receipt,

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

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    htmlContract: HTML_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    seasonTitle: SEASON_TITLE,
    primaryGems: PRIMARY_GEMS,
    secondaryGems: SECONDARY_GEMS,

    boot,
    setupDropdown,
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
