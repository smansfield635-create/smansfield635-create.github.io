/* /index.js
   COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v4
   Full-file replacement.
   Purpose:
   - Keep Compass route-only.
   - Front page presents three lenses.
   - Flat activates in-page 2D-only Compass map.
   - Round activates in-page rotating Compass orbit and interplanetary background.
   - Globe routes directly to /nine-summits/universe/.
   - Preserve Door as Flat/Round admission authority.
   - Preserve Universe as Globe-scale authority.
   - Do not render planets, canvases, or GraphicBox.
   - Do not claim visual pass.
*/

(function () {
  "use strict";

  var CONTRACT = "COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v4";
  var PREVIOUS_CONTRACT = "COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v3";
  var PAGE_CONTRACT = "COMPASS_THREE_LENS_FLAT_ROUND_GLOBE_GATE_TNT_v8";
  var RUNTIME_CONTRACT = "COMPASS_THREE_LENS_RUNTIME_TNT_v3";
  var STORAGE_VIEW_KEY = "dgb:viewMode";
  var STORAGE_LENS_KEY = "dgb:worldLens";
  var ROUND_BACKGROUND_SRC = "/assets/dgb-interplanetary-background.js?v=DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";

  var VALID_LENS = { gate: true, flat: true, round: true, globe: true };
  var VALID_VIEW = { flat: true, round: true };

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

  function readIncomingLens() {
    var params = readParams();
    var lens = params.get("lens");
    var view = params.get("view");

    if (VALID_LENS[lens]) return lens;
    if (VALID_VIEW[view]) return view;

    return "";
  }

  function getInitialLens() {
    var incoming = readIncomingLens();

    if (incoming === "flat" || incoming === "round") {
      safeSetStorage(STORAGE_LENS_KEY, incoming);
      safeSetStorage(STORAGE_VIEW_KEY, incoming);
      return incoming;
    }

    return "gate";
  }

  function setInterplanetaryEnabled(enabled) {
    var field = document.querySelector("[data-dgb-interplanetary-background-field='true']");

    document.documentElement.dataset.dgbInterplanetaryBackground = enabled ? "true" : "false";
    document.body.dataset.dgbInterplanetaryBackground = enabled ? "true" : "false";

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

    if (flat) flat.setAttribute("href", "/?lens=flat&view=flat");
    if (round) round.setAttribute("href", "/?lens=round&view=round");

    if (globe) {
      globe.setAttribute("href", "/nine-summits/universe/");
      globe.dataset.noViewCarry = "true";
    }
  }

  function setActiveLens(lens, updateHistory) {
    var nextLens = VALID_LENS[lens] ? lens : "gate";

    if (nextLens === "globe") {
      window.location.href = "/nine-summits/universe/";
      return;
    }

    document.body.dataset.activeLens = nextLens;
    document.documentElement.dataset.activeLens = nextLens;
    document.documentElement.dataset.selectedWorldLens = nextLens;
    document.body.dataset.selectedWorldLens = nextLens;

    if (nextLens === "flat" || nextLens === "round") {
      safeSetStorage(STORAGE_LENS_KEY, nextLens);
      safeSetStorage(STORAGE_VIEW_KEY, nextLens);
      document.documentElement.dataset.activeViewCarried = nextLens;
      document.body.dataset.activeViewCarried = nextLens;
    } else {
      document.documentElement.dataset.activeViewCarried = "none";
      document.body.dataset.activeViewCarried = "none";
    }

    if (nextLens === "round") {
      ensureRoundBackground();
    } else {
      setInterplanetaryEnabled(false);
    }

    tagLensCards(nextLens);

    if (updateHistory && window.history && window.history.pushState) {
      if (nextLens === "gate") {
        window.history.pushState({ lens: "gate" }, "", "/");
      } else {
        window.history.pushState({ lens: nextLens }, "", "/?lens=" + nextLens + "&view=" + nextLens);
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

  function bindChooseAgainLinks() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a[href='/']"));

    links.forEach(function (link) {
      if (link.closest(".nav")) return;

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
    document.documentElement.dataset.flatLensBehavior = "in-page-2d-only";
    document.documentElement.dataset.roundLensBehavior = "in-page-rotating-orbit-and-background";
    document.documentElement.dataset.globeLensBehavior = "route-to-nine-summits-universe";
    document.documentElement.dataset.viewSelectorAuthority = "/door/";
    document.documentElement.dataset.globeAuthority = "/nine-summits/universe/";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaim = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    document.body.dataset.pageContract = PAGE_CONTRACT;
    document.body.dataset.rootIndexJs = CONTRACT;
    document.body.dataset.compassPosture = "route-only";
    document.body.dataset.worldLensGate = "active";
    document.body.dataset.viewSelectorAuthority = "/door/";
    document.body.dataset.globeAuthority = "/nine-summits/universe/";
    document.body.dataset.generatedImage = "false";
    document.body.dataset.graphicBox = "false";
    document.body.dataset.visualPassClaimed = "false";
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
        flat: "in_page_2d_only",
        round: "in_page_rotating_items_and_interplanetary_background",
        globe: "route_to_nine_summits_universe"
      },
      lensRoutes: {
        flat: "/?lens=flat&view=flat",
        flatDoor: "/door/?view=flat",
        round: "/?lens=round&view=round",
        roundDoor: "/door/?view=round",
        globe: "/nine-summits/universe/"
      },
      authority: {
        compass: ["lens_presentation", "flat_2d_map", "round_orbit_preview"],
        door: ["flat_admission", "round_admission"],
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
    bindChooseAgainLinks();
    setActiveLens(initialLens, false);

    window.addEventListener("popstate", function () {
      setActiveLens(getInitialLens(), false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
