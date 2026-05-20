// /showroom/globe/index.js
// SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_DONOR_ADAPTATION_JS_TNT_v4
// Full-file replacement.
// Verification only.
// Does not create layout, animate orbit, import child assets, mount engines, run runtime, use canvas, use WebGL, or call requestAnimationFrame.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_DONOR_ADAPTATION_JS_TNT_v4";
  const RECEIPT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_DONOR_ADAPTATION_JS_RECEIPT_v4";
  const HTML_CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_DONOR_ADAPTATION_HTML_TNT_v4";
  const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_ORBIT_GEM_GATEWAY_VISUAL_RESTORATION_JS_TNT_v3";
  const VERSION = "2026-05-20.showroom-globe-mirrorland-donor-adaptation-js-v4";
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
    { key: "gauges", href: "/gauges/", selector: '[data-secondary-gem="gauges"]' },
    { key: "return-to-orbit", href: "#mirrorland-orbit", selector: '[data-secondary-gem="return-to-orbit"]' }
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
    "webgl",
    "requestanimationframe"
  ]);

  const FORBIDDEN_GLOBALS = Object.freeze([
    "AUDRALIA_CLEAN_CANVAS_ENGINE",
    "AUDRALIA_ENGINE",
    "AUDRALIA_CLEAN_CANVAS_RUNTIME",
    "AUDRALIA_RUNTIME",
    "AUDRALIA_CLEAN_CANVAS_COMPOSITOR",
    "AUDRALIA_CANVAS",
    "THREE"
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
    try {
      doc().documentElement.dataset[key] = String(value);
    } catch {
      // Proof metadata only.
    }
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

  function hrefMatches(actual, expected) {
    return normalizeHref(actual) === normalizeHref(expected);
  }

  function statusNode() {
    return byId("mirrorland-orbit-status") || qs("[data-mirrorland-orbit-status]");
  }

  function receiptTemplate() {
    return byId("route-receipt") || qs("[data-route-receipt]");
  }

  function writeStatus(message) {
    const node = statusNode();
    if (node) node.textContent = message;
  }

  function appendHiddenReceipt(message) {
    const template = receiptTemplate();
    if (!template) return;

    const current = template.textContent || "";
    template.textContent = `${current.trim()}\n${message}\n`;
  }

  function closeNativeMenuOnClick() {
    const menus = qsa("details[data-native-menu], details.route-menu");

    menus.forEach((menu) => {
      qsa("details[data-native-menu] a, details.route-menu a").forEach((link) => {
        link.addEventListener("click", () => {
          menu.removeAttribute("open");
        });
      });

      doc()?.addEventListener("keydown", (event) => {
        if (event.key === "Escape") menu.removeAttribute("open");
      });
    });

    return Object.freeze({
      available: menus.length > 0,
      bound: menus.length > 0,
      nativeDetails: true,
      count: menus.length
    });
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
      donorCompass: html?.dataset?.donorCompassOrganicGems === "true",
      donorExplore: html?.dataset?.donorExploreRotatingOrbits === "true",
      charactersNarrativeAuthority: html?.dataset?.charactersNarrativeAuthority === "true",
      staticUsableWithoutJs: html?.dataset?.staticPageUsableWithoutJs === "true",
      motionCssOnly: html?.dataset?.motionAuthority === "css-only",
      readableTextStable: html?.dataset?.readableTextStable === "true",
      independentReadableTextAnimationFalse: html?.dataset?.readableTextIndependentAnimation === "false",
      audraliaCleanCanvasChild: html?.dataset?.audraliaCleanCanvasChild === "false",
      audraliaEngineMount: html?.dataset?.audraliaEngineMount === "false",
      heavyRuntimeLoaded: html?.dataset?.heavyRuntimeLoaded === "false",
      canvasRuntime: html?.dataset?.canvasRuntime === "false",
      requestAnimationFrameFalse: html?.dataset?.requestAnimationFrame === "false",
      generatedImage: html?.dataset?.generatedImage === "false",
      graphicBox: html?.dataset?.graphicBox === "false",
      visualPassClaimed: html?.dataset?.visualPassClaimed === "false"
    });
  }

  function inspectNarrativeContent() {
    const text = String(doc()?.body?.innerText || "");

    const checks = Object.freeze({
      titlePresent: text.includes(SEASON_TITLE),
      enterGlobePresent: text.includes("Enter the Globe. Choose the future path."),
      windowLinePresent: text.includes("The website is not the portal. It is the window."),
      dextrionPresent: text.includes("Dextrion"),
      bermudaPresent: text.includes("Bermuda-area anomaly"),
      firstTeamCrossesPresent: text.includes("first team crosses"),
      returnFailsPresent: text.includes("return path fails"),
      clockPresent: text.includes("300-year clock"),
      preparationVariablePresent: text.includes("Preparation is the variable"),
      triadPresent:
        text.includes("ZIONTS") &&
        text.includes("H-Earth") &&
        text.includes("Audralia") &&
        text.includes("consequence") &&
        text.includes("survival") &&
        text.includes("possibility")
    });

    return Object.freeze({
      valid: Object.values(checks).every(Boolean),
      checks
    });
  }

  function inspectGemSet(items) {
    const inspected = items.map((item) => {
      const node = qs(item.selector);
      const href = node?.getAttribute?.("href") || "";
      const svgUse = Boolean(node?.querySelector?.("svg use"));
      const object = Boolean(node?.querySelector?.(".diamond-object"));
      const content = Boolean(node?.querySelector?.(".diamond-content"));

      return Object.freeze({
        key: item.key,
        selector: item.selector,
        expectedHref: item.href,
        actualHref: href,
        nodePresent: Boolean(node),
        hrefValid: hrefMatches(href, item.href),
        svgUsePresent: svgUse,
        diamondObjectPresent: object,
        diamondContentPresent: content,
        valid: Boolean(node) && hrefMatches(href, item.href) && svgUse && object && content
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

  function inspectStructure() {
    const defs = qs(".svg-defs defs");
    const organicGem = qs("#mirrorOrganicGem");
    const windowSeal = qs("#mirrorWindowSeal");
    const nativeMenu = qs("details[data-native-menu], details.route-menu");
    const stage = qs("[data-mirrorland-orbit]");
    const center = qs(".mirror-center-anchor");
    const inner = qs(".orbit-ring.inner[data-primary-ring]");
    const outer = qs(".orbit-ring.outer[data-secondary-ring]");
    const primaryGems = qsa("[data-primary-gem]");
    const secondaryGems = qsa("[data-secondary-gem]");
    const infoSections = qsa("[data-info-section]");

    return Object.freeze({
      defsPresent: Boolean(defs),
      organicGemSymbolPresent: Boolean(organicGem),
      windowSealSymbolPresent: Boolean(windowSeal),
      nativeMenuPresent: Boolean(nativeMenu),
      stagePresent: Boolean(stage),
      centerGemPresent: Boolean(center),
      innerRingPresent: Boolean(inner),
      outerRingPresent: Boolean(outer),
      primaryGemCount: primaryGems.length,
      secondaryGemCount: secondaryGems.length,
      infoSectionCount: infoSections.length,
      valid:
        Boolean(defs) &&
        Boolean(organicGem) &&
        Boolean(windowSeal) &&
        Boolean(nativeMenu) &&
        Boolean(stage) &&
        Boolean(center) &&
        Boolean(inner) &&
        Boolean(outer) &&
        primaryGems.length === 3 &&
        secondaryGems.length === 8 &&
        infoSections.length >= 4
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
    const canvasCount = qsa("canvas").length;
    const webglHints = String(doc()?.documentElement?.outerHTML || "").toLowerCase().includes("webgl");

    return Object.freeze({
      scriptCount: scripts.length,
      forbiddenScripts: Object.freeze(forbiddenScripts),
      forbiddenGlobals: Object.freeze(forbiddenGlobals),
      canvasCount,
      webglHints,
      valid: forbiddenScripts.length === 0 && forbiddenGlobals.length === 0 && canvasCount === 0 && webglHints === false
    });
  }

  function buildReceipt(menuReceipt) {
    const htmlShell = inspectHtmlShell();
    const narrative = inspectNarrativeContent();
    const primaryGems = inspectGemSet(PRIMARY_GEMS);
    const secondaryGems = inspectGemSet(SECONDARY_GEMS);
    const anchors = inspectAnchors();
    const structure = inspectStructure();
    const forbiddenImports = inspectForbiddenImports();

    const valid =
      Object.values(htmlShell).every(Boolean) &&
      narrative.valid &&
      primaryGems.complete &&
      secondaryGems.complete &&
      anchors.complete &&
      anchors.returnToOrbitValid &&
      structure.valid &&
      forbiddenImports.valid &&
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
      structure,
      forbiddenImports,
      menu: menuReceipt,

      ownsVerificationOnly: true,
      ownsPublicNarrativeExpression: false,
      ownsVisualIdentity: false,
      ownsAnimation: false,
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
    setDataset("mirrorlandOrbitGemGatewayAnchorsValid", receipt.anchors.complete ? "true" : "false");
    setDataset("mirrorlandOrbitGemGatewayStructureValid", receipt.structure.valid ? "true" : "false");
    setDataset("mirrorlandOrbitGemGatewayForbiddenImportsPresent", receipt.forbiddenImports.valid ? "false" : "true");
    setDataset("mirrorlandOrbitGemGatewayOwnsVerificationOnly", "true");
    setDataset("mirrorlandOrbitGemGatewayOwnsVisualIdentity", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsAnimation", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsAudraliaCleanCanvas", "false");
    setDataset("mirrorlandOrbitGemGatewayOwnsAudraliaEngineMount", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("visualPassClaimed", "false");

    writeStatus(receipt.valid ? "Mirrorland orbit verified · donor-adapted gem system" : "Mirrorland orbit loaded with held checks");

    appendHiddenReceipt(`${CONTRACT} valid=${receipt.valid}`);
    appendHiddenReceipt(`primary_gems=${receipt.primaryGems.validCount}/${receipt.primaryGems.required}`);
    appendHiddenReceipt(`secondary_gems=${receipt.secondaryGems.validCount}/${receipt.secondaryGems.required}`);
    appendHiddenReceipt(`return_to_orbit_controls=${receipt.anchors.returnToOrbitCount}`);
    appendHiddenReceipt(`forbidden_scripts=${receipt.forbiddenImports.forbiddenScripts.length}`);
    appendHiddenReceipt(`forbidden_globals=${receipt.forbiddenImports.forbiddenGlobals.length}`);
    appendHiddenReceipt(`canvas_count=${receipt.forbiddenImports.canvasCount}`);
    appendHiddenReceipt(`webgl_hints=${receipt.forbiddenImports.webglHints}`);

    return receipt;
  }

  function boot() {
    if (state.booted) return state.receipt;
    state.booted = true;

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
    seasonTitle: SEASON_TITLE,

    boot,
    inspectHtmlShell,
    inspectNarrativeContent,
    inspectGemSet,
    inspectAnchors,
    inspectStructure,
    inspectForbiddenImports,
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
