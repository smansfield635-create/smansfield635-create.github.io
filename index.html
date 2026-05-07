/* /index.js
   COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v3
   Full-file replacement.
   Purpose:
   - Keep Compass route-only.
   - Present and preserve the three-lens decision gate.
   - Flat routes to /door/?view=flat.
   - Round routes to /door/?view=round.
   - Globe routes to /nine-summits/universe/.
   - Preserve Door as Flat/Round view-selector authority.
   - Preserve Universe as Globe-scale authority.
   - Carry flat/round view through eligible internal links only.
   - Do not mount Flat/Round/Globe selector behavior on the root page.
   - Do not render planets, canvases, or GraphicBox.
   - Do not claim visual pass.
*/

(function () {
  "use strict";

  var CONTRACT = "COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v3";
  var PREVIOUS_CONTRACT = "COMPASS_ROUTE_ONLY_VIEW_CARRY_INTERPLANETARY_UNIFORMITY_TNT_v2";
  var PAGE_CONTRACT = "COMPASS_THREE_LENS_INTERPLANETARY_GATE_TNT_v7";
  var STORAGE_KEY = "dgb:viewMode";
  var LENS_KEY = "dgb:worldLens";
  var VALID_VIEW = { flat: true, round: true };
  var VALID_LENS = { flat: true, round: true, globe: true };

  function safeGetStorage(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (error) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (error) {
      /* Storage can fail in privacy modes. Compass remains route-only. */
    }
  }

  function readParams() {
    return new URLSearchParams(window.location.search);
  }

  function getIncomingLens() {
    var params = readParams();
    var incomingLens = params.get("lens");
    var incomingView = params.get("view");

    if (VALID_LENS[incomingLens]) return incomingLens;
    if (VALID_VIEW[incomingView]) return incomingView;

    return "";
  }

  function getCurrentLens() {
    var incoming = getIncomingLens();
    var saved = safeGetStorage(LENS_KEY);
    var savedView = safeGetStorage(STORAGE_KEY);

    if (VALID_LENS[incoming]) {
      safeSetStorage(LENS_KEY, incoming);
      if (VALID_VIEW[incoming]) safeSetStorage(STORAGE_KEY, incoming);
      return incoming;
    }

    if (VALID_LENS[saved]) return saved;
    if (VALID_VIEW[savedView]) return savedView;

    return "round";
  }

  function getCarryView(lens) {
    if (VALID_VIEW[lens]) return lens;

    var savedView = safeGetStorage(STORAGE_KEY);
    if (VALID_VIEW[savedView]) return savedView;

    return "";
  }

  function shouldCarryView(link) {
    var href = link.getAttribute("href") || "";
    var url;

    if (!href) return false;
    if (href.indexOf("#") === 0) return false;
    if (href.indexOf("mailto:") === 0) return false;
    if (href.indexOf("tel:") === 0) return false;
    if (href.indexOf("javascript:") === 0) return false;
    if (link.hasAttribute("download")) return false;
    if (link.dataset.noViewCarry === "true") return false;

    try {
      url = new URL(href, window.location.origin);
    } catch (error) {
      return false;
    }

    if (url.origin !== window.location.origin) return false;

    if (
      url.pathname.indexOf("/nine-summits/universe/") === 0 ||
      url.pathname.indexOf("/showroom/globe/") === 0 ||
      url.pathname.indexOf("/gauges/") === 0
    ) {
      return false;
    }

    return true;
  }

  function normalizeLensLinks() {
    var flat = document.querySelector("[data-lens-link='flat']");
    var round = document.querySelector("[data-lens-link='round']");
    var globe = document.querySelector("[data-lens-link='globe']");

    if (flat) flat.setAttribute("href", "/door/?view=flat");
    if (round) round.setAttribute("href", "/door/?view=round");
    if (globe) {
      globe.setAttribute("href", "/nine-summits/universe/");
      globe.dataset.noViewCarry = "true";
    }
  }

  function setRouteHref(link, mode) {
    var rawHref = link.getAttribute("href") || "/";
    var url;

    if (!mode || !VALID_VIEW[mode]) return;
    if (!shouldCarryView(link)) return;

    try {
      url = new URL(rawHref, window.location.origin);
    } catch (error) {
      return;
    }

    url.searchParams.set("view", mode);
    link.setAttribute("href", url.pathname + url.search + url.hash);
  }

  function carryViewThroughLinks(mode) {
    var links = Array.prototype.slice.call(document.querySelectorAll("a[href]"));

    links.forEach(function (link) {
      setRouteHref(link, mode);
    });

    normalizeLensLinks();
  }

  function tagLensCards(activeLens) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-lens]"));

    cards.forEach(function (card) {
      var isActive = card.dataset.lens === activeLens;
      card.dataset.activeLens = isActive ? "true" : "false";
      card.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function bindLensEvents() {
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-lens-link]"));

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        var lens = link.dataset.lensLink;

        if (!VALID_LENS[lens]) return;

        safeSetStorage(LENS_KEY, lens);

        if (VALID_VIEW[lens]) {
          safeSetStorage(STORAGE_KEY, lens);
        }

        document.documentElement.dataset.selectedWorldLens = lens;
        if (document.body) document.body.dataset.selectedWorldLens = lens;
      });
    });
  }

  function tagRoot(lens, carryView) {
    document.documentElement.dataset.pageContract = PAGE_CONTRACT;
    document.documentElement.dataset.rootIndexJs = CONTRACT;
    document.documentElement.dataset.rootIndexPreviousJs = PREVIOUS_CONTRACT;
    document.documentElement.dataset.compassPosture = "route-only";
    document.documentElement.dataset.worldLensGate = "active";
    document.documentElement.dataset.selectedWorldLens = lens;
    document.documentElement.dataset.activeViewCarried = carryView || "none";
    document.documentElement.dataset.viewSelectorAuthority = "/door/";
    document.documentElement.dataset.globeAuthority = "/nine-summits/universe/";
    document.documentElement.dataset.doorOwnsFlatRound = "true";
    document.documentElement.dataset.universeOwnsGlobe = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaim = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.pageContract = PAGE_CONTRACT;
      document.body.dataset.rootIndexJs = CONTRACT;
      document.body.dataset.compassPosture = "route-only";
      document.body.dataset.worldLensGate = "active";
      document.body.dataset.selectedWorldLens = lens;
      document.body.dataset.activeViewCarried = carryView || "none";
      document.body.dataset.viewSelectorAuthority = "/door/";
      document.body.dataset.globeAuthority = "/nine-summits/universe/";
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function publishReady(lens, carryView) {
    var detail = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      pageContract: PAGE_CONTRACT,
      route: "/",
      posture: "route-only",
      selectedLens: lens,
      carriedView: carryView || null,
      lensRoutes: {
        flat: "/door/?view=flat",
        round: "/door/?view=round",
        globe: "/nine-summits/universe/"
      },
      authority: {
        compass: ["lens_presentation", "public_orientation", "round_preview"],
        door: ["flat_admission", "round_admission"],
        universe: ["globe_scale"]
      },
      owns: [
        "lens_link_normalization",
        "flat_round_view_carry",
        "root_route_posture_receipt",
        "internal_link_view_continuity_for_eligible_routes"
      ],
      doesNotOwn: [
        "view_selector_ui",
        "planet_rendering",
        "canvas_creation",
        "Gauges_logic",
        "GraphicBox",
        "image_generation",
        "visual_pass_claim"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    };

    window.DGB_COMPASS_THREE_LENS_ROUTE_RECEIPT = detail;

    try {
      window.dispatchEvent(new CustomEvent("dgb:compass:lens-ready", { detail: detail }));
    } catch (error) {
      /* Event dispatch is optional. */
    }
  }

  function apply() {
    var lens = getCurrentLens();
    var carryView = getCarryView(lens);

    normalizeLensLinks();
    tagRoot(lens, carryView);
    tagLensCards(lens);
    carryViewThroughLinks(carryView);
    bindLensEvents();
    publishReady(lens, carryView);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
