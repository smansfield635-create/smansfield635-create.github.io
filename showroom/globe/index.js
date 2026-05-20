// /showroom/globe/index.js
// SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY_JS_TNT_v1
// Full-file replacement.
// Showroom Globe great-grandparent Mirrorland narrative gateway verifier.
// Purpose:
// - Verifies /showroom/globe/ as the narrative gateway for Shadows Never Shatter in Mirrorland.
// - Confirms required gem-door links exist.
// - Confirms forbidden Audralia clean-canvas imports are absent.
// - Confirms no Audralia engine is mounted.
// - Updates a small status line and receipt list.
// - Does not create the visual identity.
// - Does not import child planet files.
// - Does not mount runtime, controls, canvas, or engine.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY_JS_TNT_v1";
  const RECEIPT = "SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY_JS_RECEIPT_v1";
  const HTML_CONTRACT = "SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY_HTML_TNT_v1";
  const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_LEGACY_ANCHOR_ROUTE_BRIDGE_JS_TNT_v1";
  const VERSION = "2026-05-20.showroom-globe-mirrorland-narrative-gateway-js-v1";
  const ROUTE = "/showroom/globe/";
  const SEASON_TITLE = "Shadows Never Shatter in Mirrorland";

  const REQUIRED_DOORS = Object.freeze([
    {
      key: "consequence",
      label: "ZIONTS / Consequence",
      href: "/showroom/globe/earth/",
      selector: '[data-door="consequence"]',
      role: "consequence-story-door"
    },
    {
      key: "possibility",
      label: "Audralia / Possibility",
      href: "/showroom/globe/audralia/",
      selector: '[data-door="possibility"]',
      role: "possibility-story-door"
    },
    {
      key: "survival",
      label: "H-Earth / Survival",
      href: "/showroom/globe/h-earth/",
      selector: '[data-door="survival"]',
      role: "survival-story-door"
    },
    {
      key: "characters",
      label: "Characters / People inside the story",
      href: "/characters/",
      selector: '[data-door="characters"]',
      role: "character-story-door"
    },
    {
      key: "proof",
      label: "Showroom / Proof surface",
      href: "/showroom/",
      selector: '[data-door="proof"]',
      role: "proof-surface-door"
    },
    {
      key: "measure",
      label: "Gauges / Measurement",
      href: "/gauges/",
      selector: '[data-door="measure"]',
      role: "measurement-door"
    }
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
    return byId("mirrorland-gateway-status") || qs("[data-mirrorland-gateway-status]");
  }

  function receiptList() {
    return byId("mirrorland-gateway-receipts") || qs("[data-mirrorland-gateway-receipts]");
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

      expectedPage: "showroom-globe",
      actualPage: html?.dataset?.page || null,
      pageValid: html?.dataset?.page === "showroom-globe",

      expectedSeason: SEASON_TITLE,
      actualSeason: html?.dataset?.season || null,
      seasonValid: html?.dataset?.season === SEASON_TITLE,

      authority: html?.dataset?.authority || null,
      authorityValid: html?.dataset?.authority === "great-grandparent-narrative-gateway-expression-only",

      role: html?.dataset?.role || null,
      roleValid: html?.dataset?.role === "mirrorland-narrative-gateway",

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
      oceanDoorPresent: text.includes("The ocean did not hide a mystery. It hid a door."),
      bermudaPresent: text.includes("Bermuda Triangle"),
      noReturnPresent: text.includes("cannot come back"),
      windowRulePresent: text.includes("window"),
      coverLawPresent: text.includes("cover") && text.includes("true") && text.includes("incomplete"),
      charactersSeparated: text.includes("character page") || text.includes("Characters page") || text.includes("The character page")
    });

    const valid = Object.values(checks).every(Boolean);

    return Object.freeze({
      valid,
      checks
    });
  }

  function inspectGemDoors() {
    const anchors = qsa("a[href]");
    const hrefs = new Set(anchors.map((anchor) => normalizeHref(anchor.getAttribute("href"))));

    const items = REQUIRED_DOORS.map((door) => {
      const node = qs(door.selector);
      const normalized = normalizeHref(door.href);
      const nodeHref = node?.getAttribute?.("href") || null;

      return Object.freeze({
        key: door.key,
        label: door.label,
        role: door.role,
        href: door.href,
        normalized,
        selector: door.selector,
        nodePresent: Boolean(node),
        hrefPresent: hrefs.has(normalized),
        nodeHrefValid: normalizeHref(nodeHref || "") === normalized,
        valid: Boolean(node) && hrefs.has(normalized) && normalizeHref(nodeHref || "") === normalized
      });
    });

    return Object.freeze({
      required: REQUIRED_DOORS.length,
      validCount: items.filter((item) => item.valid).length,
      presentCount: items.filter((item) => item.nodePresent).length,
      missing: Object.freeze(items.filter((item) => !item.valid)),
      items: Object.freeze(items),
      complete: items.every((item) => item.valid)
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
    const gateway = qs("[data-mirrorland-gem-gateway]");
    const gem = qs(".mirror-gem");
    const cards = qsa(".story-card");
    const panels = qsa(".wide-panel");

    return Object.freeze({
      rootPresent: Boolean(root),
      gatewayPresent: Boolean(gateway),
      gemPresent: Boolean(gem),
      storyCardCount: cards.length,
      widePanelCount: panels.length,
      enoughStoryCards: cards.length >= 6,
      enoughPanels: panels.length >= 2,
      valid: Boolean(root) && Boolean(gateway) && Boolean(gem) && cards.length >= 6 && panels.length >= 2
    });
  }

  function buildReceipt() {
    const htmlShell = inspectHtmlShell();
    const narrative = inspectNarrativeContent();
    const gemDoors = inspectGemDoors();
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
      gemDoors.complete &&
      forbiddenImports.valid &&
      structure.valid;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      seasonTitle: SEASON_TITLE,
      authority: "showroom-globe-great-grandparent-mirrorland-narrative-gateway-verifier",
      checkedAt: new Date().toISOString(),
      valid,

      htmlShell,
      narrative,
      gemDoors,
      forbiddenImports,
      structure,

      ownsGreatGrandparentNarrativeGateway: true,
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

    win().SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY = API;
    win().SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY_RECEIPT = receipt;
    win().MIRRORLAND_NARRATIVE_GATEWAY = API;
    win().MIRRORLAND_NARRATIVE_GATEWAY_RECEIPT = receipt;

    setDataset("mirrorlandNarrativeGatewayBridgeLoaded", "true");
    setDataset("mirrorlandNarrativeGatewayBridgeContract", CONTRACT);
    setDataset("mirrorlandNarrativeGatewayBridgeReceipt", RECEIPT);
    setDataset("mirrorlandNarrativeGatewayBridgeVersion", VERSION);
    setDataset("mirrorlandNarrativeGatewayValid", receipt.valid ? "true" : "false");
    setDataset("mirrorlandNarrativeGatewayDoorsComplete", receipt.gemDoors.complete ? "true" : "false");
    setDataset("mirrorlandNarrativeGatewayNarrativeValid", receipt.narrative.valid ? "true" : "false");
    setDataset("mirrorlandNarrativeGatewayForbiddenImportsPresent", receipt.forbiddenImports.valid ? "false" : "true");
    setDataset("mirrorlandNarrativeGatewayOwnsGreatGrandparentNarrativeGateway", "true");
    setDataset("mirrorlandNarrativeGatewayOwnsPlanetScience", "false");
    setDataset("mirrorlandNarrativeGatewayOwnsAudraliaCleanCanvas", "false");
    setDataset("mirrorlandNarrativeGatewayOwnsAudraliaEngineMount", "false");
    setDataset("mirrorlandNarrativeGatewayOwnsRuntimeMotion", "false");
    setDataset("mirrorlandNarrativeGatewayOwnsControls", "false");
    setDataset("mirrorlandNarrativeGatewayOwnsCanvasComposition", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("visualPassClaimed", "false");

    writeStatus(
      receipt.valid
        ? "Mirrorland narrative gateway verified."
        : "Mirrorland narrative gateway loaded with held checks.",
      receipt.valid ? "ready" : "held"
    );

    appendReceipt(`${CONTRACT} · valid=${receipt.valid}`);
    appendReceipt(`gem doors valid ${receipt.gemDoors.validCount}/${receipt.gemDoors.required}`);
    appendReceipt(`narrative checks valid=${receipt.narrative.valid}`);
    appendReceipt(`forbidden child-engine imports=${receipt.forbiddenImports.forbiddenScripts.length}`);
    appendReceipt(`forbidden child-engine globals=${receipt.forbiddenImports.forbiddenGlobals.length}`);

    return receipt;
  }

  function boot() {
    if (state.booted) return state.receipt;

    state.booted = true;
    writeStatus("Checking Mirrorland narrative gateway.", "loading");
    setDataset("mirrorlandNarrativeGatewayBridgeBooting", "true");

    const receipt = publishReceipt(buildReceipt());

    setDataset("mirrorlandNarrativeGatewayBridgeBooting", "false");
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
      requiredDoors: REQUIRED_DOORS,
      forbiddenScriptPatterns: FORBIDDEN_SCRIPT_PATTERNS,
      forbiddenGlobals: FORBIDDEN_GLOBALS,
      booted: state.booted,
      checkedAt: state.checkedAt,
      lastReceipt: state.receipt,

      ownsGreatGrandparentNarrativeGateway: true,
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
    requiredDoors: REQUIRED_DOORS,

    boot,
    inspectHtmlShell,
    inspectNarrativeContent,
    inspectGemDoors,
    inspectForbiddenImports,
    inspectStructure,
    getStatus
  });

  win().SHOWROOM_GLOBE_MIRRORLAND_NARRATIVE_GATEWAY = API;
  win().MIRRORLAND_NARRATIVE_GATEWAY = API;

  if (doc()?.readyState === "loading") {
    doc().addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
