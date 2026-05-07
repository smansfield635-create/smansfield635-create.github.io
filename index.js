/* /index.js
   COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v5
   Full-file replacement.
   Purpose:
   - Keep Compass route-only.
   - Front page presents three lenses.
   - Flat stays on the homepage and activates in-page 2D-only Compass map.
   - Round activates the original rotating Compass orbit and interplanetary background.
   - Globe routes directly to /nine-summits/universe/.
   - Products remains a node inside Round, not the Round authority.
   - Do not render planets, canvases, or GraphicBox.
   - Do not claim visual pass.
*/

(function () {
  "use strict";

  var CONTRACT = "COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v5";
  var PREVIOUS_CONTRACT = "COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v4";
  var PAGE_CONTRACT = "COMPASS_THREE_LENS_FLAT_HOME_ROUND_ORBIT_GLOBE_UNIVERSE_TNT_v9";
  var RUNTIME_CONTRACT = "COMPASS_THREE_LENS_RUNTIME_TNT_v4";
  var STORAGE_LENS_KEY = "dgb:worldLens";
  var ROUND_BACKGROUND_SRC = "/assets/dgb-interplanetary-background.js?v=DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";

  var VALID_LENS = { gate: true, flat: true, round: true, globe: true };

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

  function readIncomingLens() {
    var params = readParams();
    var lens = params.get("lens");

    if (VALID_LENS[lens]) return lens;
    return "";
  }

  function getInitialLens() {
    var incoming = readIncomingLens();

    if (incoming === "round") {
      safeSetStorage(STORAGE_LENS_KEY, "round");
      return "round";
    }

    return "gate";
  }

  function setInterplanetaryEnabled(enabled) {
    var field = document.querySelector("[data-dgb-interplanetary-background-field='true']");

    document.documentElement.dataset.dgbInterplanetaryBackground = enabled ? "true" : "false";

    if (document.body) {
      document.body.dataset.dgbInterplanetaryBackground = enabled ? "true" : "false";
    }

    if (field) {
      field.style.display = enabled ? "" : "none";
    }
  }

  function ensureRoundBackground() {
    var existing = document.querySelector("script[data-compass-round-background='true']");

    setInterplanetaryEnabled(true);

    if (existing) return;

    var script = document.createElement("script");
    script.src = ROUND_BACKGROUND_SRC;
    script.defer = true;
    script.dataset.compassRoundBackground = "true";
    script.dataset.contract = "DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";
    document.head.appendChild(script);
  }

  function normalizeLensLinks() {
    var flat = document.querySelector("[data-lens-link='flat']");
    var round = document.querySelector("[data-lens-link='round']");
    var globe = document.querySelector("[data-lens-link='globe']");

    if (flat) {
      flat.setAttribute("href", "/");
      flat.dataset.noViewCarry = "true";
    }

    if (round) {
      round.setAttribute("href", "/?lens=round");
    }

    if (globe) {
      globe.setAttribute("href", "/nine-summits/universe/");
      globe.dataset.noViewCarry = "true";
    }
  }

  function carryRoundViewThroughEligibleLinks() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a[href]"));

    links.forEach(function (link) {
      var rawHref = link.getAttribute("href") || "";
      var url;

      if (link.dataset.noViewCarry === "true") return;
      if (!rawHref || rawHref.indexOf("#") === 0) return;
      if (rawHref.indexOf("mailto:") === 0) return;
      if (rawHref.indexOf("tel:") === 0) return;
      if (rawHref.indexOf("javascript:") === 0) return;
      if (link.hasAttribute("download")) return;

      try {
        url = new URL(rawHref, window.location.origin);
      } catch (error) {
        return;
      }

      if (url.origin !== window.location.origin) return;

      if (
        url.pathname === "/" ||
        url.pathname.indexOf("/nine-summits/universe/") === 0 ||
        url.pathname.indexOf("/showroom/globe/") === 0 ||
        url.pathname.indexOf("/gauges/") === 0
      ) {
        return;
      }

      url.searchParams.set("view", "round");
      link.setAttribute("href", url.pathname + url.search + url.hash);
    });

    normalizeLensLinks();
  }

  function clearRoundCarryOnGateOrFlat() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a[href]"));

    links.forEach(function (link) {
      var rawHref = link.getAttribute("href") || "";
      var url;

      try {
        url = new URL(rawHref, window.location.origin);
      } catch (error) {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.searchParams.get("view") !== "round") return;

      url.searchParams.delete("view");
      link.setAttribute("href", url.pathname + url.search + url.hash);
    });

    normalizeLensLinks();
  }

  function setActiveLens(lens, updateHistory) {
    var nextLens = VALID_LENS[lens] ? lens : "gate";

    if (nextLens === "globe") {
      window.location.href = "/nine-summits/universe/";
      return;
    }

    if (document.body) {
      document.body.dataset.activeLens = nextLens;
      document.body.dataset.selectedWorldLens = nextLens;
    }

    document.documentElement.dataset.activeLens = nextLens;
    document.documentElement.dataset.selectedWorldLens = nextLens;

    if (nextLens === "round") {
      safeSetStorage(STORAGE_LENS_KEY, "round");
      document.documentElement.dataset.activeViewCarried = "round";
      if (document.body) document.body.dataset.activeViewCarried = "round";
      ensureRoundBackground();
      carryRoundViewThroughEligibleLinks();
    } else {
      if (nextLens === "flat") safeSetStorage(STORAGE_LENS_KEY, "flat");
      document.documentElement.dataset.activeViewCarried = "none";
      if (document.body) document.body.dataset.activeViewCarried = "none";
      setInterplanetaryEnabled(false);
      clearRoundCarryOnGateOrFlat();
    }

    tagLensCards(nextLens);

    if (updateHistory && window.history && window.history.pushState) {
      if (nextLens === "round") {
        window.history.pushState({ lens: "round" }, "", "/?lens=round");
      } else {
        window.history.pushState({ lens: nextLens }, "", "/");
      }
    }

    publishReady(nextLens);
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
      link.addEventListener("click", function (event) {
        var lens = link.dataset.lensLink;

        if (lens === "globe") return;
        if (!VALID_LENS[lens]) return;

        event.preventDefault();
        setActiveLens(lens, true);
      });
    });
  }

  function bindResetLinks() {
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-lens-reset='true']"));

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        setActiveLens("gate", true);
      });
    });
  }

  function tagRoot() {
    document.documentElement.dataset.pageContract = PAGE_CONTRACT;
    document.documentElement.dataset.rootIndexJs = CONTRACT;
    document.documentElement.dataset.rootIndexPreviousJs = PREVIOUS_CONTRACT;
    document.documentElement.dataset.compassRuntimeExpected = RUNTIME_CONTRACT;
    document.documentElement.dataset.compassPosture = "route-only";
    document.documentElement.dataset.worldLensGate = "active";
    document.documentElement.dataset.flatLensBehavior = "in-page-2d-homepage-only";
    document.documentElement.dataset.roundLensBehavior = "original-compass-orbit-and-background";
    document.documentElement.dataset.globeLensBehavior = "route-to-nine-summits-universe";
    document.documentElement.dataset.flatAuthority = "/";
    document.documentElement.dataset.roundAuthority = "/?lens=round";
    document.documentElement.dataset.globeAuthority = "/nine-summits/universe/";
    document.documentElement.dataset.productsIsRoundNode = "true";
    document.documentElement.dataset.productsIsRoundAuthority = "false";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaim = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.pageContract = PAGE_CONTRACT;
      document.body.dataset.rootIndexJs = CONTRACT;
      document.body.dataset.compassPosture = "route-only";
      document.body.dataset.worldLensGate = "active";
      document.body.dataset.flatAuthority = "/";
      document.body.dataset.roundAuthority = "/?lens=round";
      document.body.dataset.globeAuthority = "/nine-summits/universe/";
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function publishReady(lens) {
    var detail = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      pageContract: PAGE_CONTRACT,
      runtimeExpected: RUNTIME_CONTRACT,
      route: "/",
      posture: "route-only",
      activeLens: lens,
      lensBehavior: {
        gate: "front_page_three_lens_choice",
        flat: "in_page_2d_homepage_only",
        round: "original_compass_orbit_with_interplanetary_background",
        globe: "route_to_nine_summits_universe"
      },
      lensRoutes: {
        flat: "/",
        round: "/?lens=round",
        globe: "/nine-summits/universe/"
      },
      authority: {
        compass: ["lens_presentation", "flat_homepage_2d_map", "round_original_orbit"],
        products: ["round_node_only"],
        universe: ["globe_scale"]
      },
      owns: [
        "lens_switching",
        "flat_2d_visibility",
        "round_animation_visibility",
        "round_background_activation",
        "globe_route_normalization"
      ],
      doesNotOwn: [
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
    var initialLens = getInitialLens();

    tagRoot();
    normalizeLensLinks();
    bindLensEvents();
    bindResetLinks();
    setActiveLens(initialLens, false);

    window.addEventListener("popstate", function (event) {
      if (event.state && VALID_LENS[event.state.lens]) {
        setActiveLens(event.state.lens, false);
        return;
      }

      setActiveLens(getInitialLens(), false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
