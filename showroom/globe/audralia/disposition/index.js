// /showroom/globe/audralia/disposition/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_ROUTE_JS_TNT_v1
//
// Function assignment:
// JS = COURAGE
//
// Purpose:
// - Standalone downstream verification harness.
// - Load/detect the completed datum child.
// - Load/detect the passive disposition child.
// - Verify that disposition receives the cloned datum receive-map without renewing parent files.
// - Stage future multi-stream render launchpad lanes.
// - Render nothing.
// - Create no canvas.
// - Mutate no parent route, datum, or disposition child.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_ROUTE_JS_TNT_v1";
  var HTML_CONTRACT = "AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_HTML_BINDING_TNT_v1";
  var PARENT_BASELINE = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE_v1";

  var DATUM_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";
  var DISPOSITION_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.disposition.js";

  var DATUM_PUBLIC_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var DATUM_CLONE_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var DISPOSITION_CONTRACT = "AUDRALIA_G1_CHILD_DISPOSITION_DATUM_RECEIVE_TEST_TNT_v1";

  var MULTI_STREAM_RENDER_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.multi-stream.render.js";

  var ROUTE = "/showroom/globe/audralia/disposition/";
  var JS_ROLE = "COURAGE";
  var HTML_ROLE = "WISDOM";
  var RUNTIME_ROLE = "STRENGTH";

  var FAILURE = {
    NONE: "",
    BOOT_PENDING: "boot pending",
    DATUM_LOAD_FAILED: "datum failed to load",
    DATUM_CONTRACT_MISMATCH: "datum public contract mismatch",
    CLONE_CONTRACT_MISMATCH: "datum clone contract mismatch",
    DISPOSITION_LOAD_FAILED: "disposition child failed to load",
    DISPOSITION_CONTRACT_MISMATCH: "disposition contract mismatch",
    CHILD_READY_FALSE: "disposition childReady is false",
    RECEIVE_MAP_UNAVAILABLE: "receive map unavailable",
    SEAT_COUNT_MISMATCH: "seat count mismatch",
    NEWS_INCOMPLETE: "NEWS incomplete",
    CHILD_PACKET_MISSING: "child packet missing",
    DISPOSITION_NOT_READY: "disposition not ready",
    VISUAL_PASS_FALSE_CLAIM: "visual pass false claim",
    PARENT_MUTATION_DETECTED: "parent mutation detected",
    UNKNOWN_EXCEPTION: "unknown exception"
  };

  var STREAMS = [
    {
      key: "datum",
      label: "Datum Stream",
      source: DATUM_FILE,
      role: "active parent math",
      status: "held-pending-harness"
    },
    {
      key: "disposition",
      label: "Disposition Stream",
      source: DISPOSITION_FILE,
      role: "passive child receive proof",
      status: "held-pending-harness"
    },
    {
      key: "terrain",
      label: "Terrain Stream",
      source: "/assets/audralia/clean/runtime/audralia.true-globe.terrain.js",
      role: "future landform pressure",
      status: "held"
    },
    {
      key: "moisture",
      label: "Moisture Stream",
      source: "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js",
      role: "future hydration pressure",
      status: "held"
    },
    {
      key: "surface",
      label: "Surface Stream",
      source: "/assets/audralia/clean/runtime/audralia.true-globe.surface.js",
      role: "future material expression",
      status: "held"
    },
    {
      key: "cloud",
      label: "Cloud Stream",
      source: "/assets/audralia/clean/runtime/audralia.true-globe.cloud.js",
      role: "future atmospheric expression",
      status: "held"
    },
    {
      key: "continent",
      label: "Continent Stream",
      source: "/assets/audralia/clean/runtime/audralia.true-globe.continent.js",
      role: "future landmass expression",
      status: "held"
    },
    {
      key: "multiStreamRender",
      label: "Multi-Stream Render",
      source: MULTI_STREAM_RENDER_FILE,
      role: "future Strength/runtime carrier",
      status: "held"
    }
  ];

  var state = {
    initialized: false,
    phase: "boot pending",
    route: ROUTE,

    datumLoaded: false,
    datumApiFound: false,
    datumApiSource: null,
    datumContractAccepted: false,
    cloneContractAccepted: false,

    dispositionChildLoaded: false,
    dispositionApiFound: false,
    dispositionContractAccepted: false,

    childReady: false,
    datumReceived: false,
    receiveMapReady: false,
    seatCount: 0,
    seatCountValid: false,
    newsComplete: false,
    allSeatsNewsComplete: false,
    childPacketReceived: false,
    dispositionReady: false,

    rendersNothing: true,
    noCanvasCreation: true,
    visualPassClaimed: false,

    parentDatumUnchanged: true,
    parentHtmlUnchanged: true,
    parentRouteJsUnchanged: true,
    downstreamStillHeld: true,

    multiStreamLaunchpadReady: false,
    streams: STREAMS.slice(),

    failureCode: "BOOT_PENDING",
    failureReason: FAILURE.BOOT_PENDING,
    errors: [],
    checkedAt: null
  };

  function setPhase(phase) {
    state.phase = phase;
    state.checkedAt = new Date().toISOString();
  }

  function setFailure(code, reason) {
    state.failureCode = code || "UNKNOWN_EXCEPTION";
    state.failureReason = reason || FAILURE[state.failureCode] || FAILURE.UNKNOWN_EXCEPTION;
  }

  function clearFailure() {
    state.failureCode = "";
    state.failureReason = "";
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");
    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });
    setFailure("UNKNOWN_EXCEPTION", scope + ": " + message);
  }

  function qs(selector) {
    try {
      return document.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qsa(selector) {
    try {
      return Array.prototype.slice.call(document.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function setText(selector, text) {
    var node = qs(selector);
    if (!node) return false;
    var value = String(text);
    if (node.textContent !== value) node.textContent = value;
    return true;
  }

  function setData(name, value) {
    var text = String(value);
    try {
      document.documentElement.dataset[name] = text;
      if (document.body) document.body.dataset[name] = text;
    } catch (_error) {}
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function scriptAlreadyPresent(file) {
    return Boolean(document.querySelector("script[src*='" + file + "']"));
  }

  function loadScript(file, cacheKey, marker) {
    return new Promise(function (resolve) {
      if (scriptAlreadyPresent(file)) {
        wait(120).then(function () {
          resolve(true);
        });
        return;
      }

      var script = document.createElement("script");
      script.src = file + "?v=" + encodeURIComponent(cacheKey);
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-harness-loader", CONTRACT);
      script.setAttribute("data-loader-marker", marker);
      script.setAttribute("data-html-role", HTML_ROLE);
      script.setAttribute("data-js-role", JS_ROLE);
      script.setAttribute("data-runtime-role", RUNTIME_ROLE);
      script.setAttribute("data-downstream-held", "true");

      script.onload = function () {
        wait(120).then(function () {
          resolve(true);
        });
      };

      script.onerror = function () {
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  function findDatumApi() {
    var sources = [
      ["AUDRALIA_TRUE_GLOBE_DATUM", window.AUDRALIA_TRUE_GLOBE_DATUM],
      ["AUDRALIA_G1_TRUE_GLOBE_DATUM", window.AUDRALIA_G1_TRUE_GLOBE_DATUM],
      ["AUDRALIA_TRUE_PLANETARY_DATUM", window.AUDRALIA_TRUE_PLANETARY_DATUM],
      ["AUDRALIA_G1_TRUE_PLANETARY_DATUM", window.AUDRALIA_G1_TRUE_PLANETARY_DATUM]
    ];

    for (var i = 0; i < sources.length; i += 1) {
      if (sources[i][1]) {
        state.datumApiSource = sources[i][0];
        return sources[i][1];
      }
    }

    state.datumApiSource = null;
    return null;
  }

  function readDatumStatus(api) {
    try {
      if (api && typeof api.status === "function") return api.status();
    } catch (error) {
      recordError("datum.status", error);
    }

    return window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS ||
      window.AUDRALIA_G1_TRUE_GLOBE_DATUM_STATUS ||
      window.AUDRALIA_G2_TRUE_GLOBE_DATUM_STATUS ||
      null;
  }

  function findDispositionApi() {
    var sources = [
      ["AUDRALIA_G1_CHILD_DISPOSITION", window.AUDRALIA_G1_CHILD_DISPOSITION],
      ["AUDRALIA_TRUE_GLOBE_DISPOSITION", window.AUDRALIA_TRUE_GLOBE_DISPOSITION],
      ["AUDRALIA_G1_TRUE_GLOBE_DISPOSITION", window.AUDRALIA_G1_TRUE_GLOBE_DISPOSITION]
    ];

    for (var i = 0; i < sources.length; i += 1) {
      if (sources[i][1]) return sources[i][1];
    }

    return null;
  }

  function readDispositionStatus(api) {
    try {
      if (api && typeof api.refresh === "function") api.refresh();
    } catch (error) {
      recordError("disposition.refresh", error);
    }

    try {
      if (api && typeof api.status === "function") return api.status();
    } catch (error2) {
      recordError("disposition.status", error2);
    }

    return window.AUDRALIA_G1_CHILD_DISPOSITION_STATUS ||
      window.AUDRALIA_TRUE_GLOBE_DISPOSITION_STATUS ||
      null;
  }

  function contractFromStatus(status, fallbackApi, key) {
    return status && status[key] ? status[key] : fallbackApi && fallbackApi[key] ? fallbackApi[key] : null;
  }

  function updateStreamStatus(key, status) {
    for (var i = 0; i < state.streams.length; i += 1) {
      if (state.streams[i].key === key) {
        state.streams[i] = Object.assign({}, state.streams[i], { status: status });
      }
    }
  }

  function verifyDatum() {
    var api = findDatumApi();
    state.datumApiFound = Boolean(api);

    if (!api) {
      setFailure("DATUM_LOAD_FAILED", FAILURE.DATUM_LOAD_FAILED);
      return false;
    }

    var status = readDatumStatus(api) || {};
    var publicContract = contractFromStatus(status, api, "contract");
    var cloneContract =
      contractFromStatus(status, api, "cloneContract") ||
      contractFromStatus(status, api, "cloneDatumContract");

    state.datumContractAccepted = publicContract === DATUM_PUBLIC_CONTRACT;
    state.cloneContractAccepted = cloneContract === DATUM_CLONE_CONTRACT;

    if (!state.datumContractAccepted) {
      setFailure("DATUM_CONTRACT_MISMATCH", FAILURE.DATUM_CONTRACT_MISMATCH);
      return false;
    }

    if (!state.cloneContractAccepted) {
      setFailure("CLONE_CONTRACT_MISMATCH", FAILURE.CLONE_CONTRACT_MISMATCH);
      return false;
    }

    state.datumLoaded = true;
    updateStreamStatus("datum", "active parent math");
    return true;
  }

  function verifyDisposition() {
    var api = findDispositionApi();
    state.dispositionApiFound = Boolean(api);

    if (!api) {
      setFailure("DISPOSITION_LOAD_FAILED", FAILURE.DISPOSITION_LOAD_FAILED);
      return false;
    }

    var status = readDispositionStatus(api) || {};
    var contract = status.contract || api.contract || null;

    state.dispositionContractAccepted = contract === DISPOSITION_CONTRACT;

    if (!state.dispositionContractAccepted) {
      setFailure("DISPOSITION_CONTRACT_MISMATCH", FAILURE.DISPOSITION_CONTRACT_MISMATCH);
      return false;
    }

    state.dispositionChildLoaded = true;
    state.childReady = status.childReady === true;
    state.datumReceived = status.datumReceived === true;
    state.receiveMapReady = status.receiveMapReady === true;
    state.seatCount = Number(status.seatCount || 0);
    state.seatCountValid = status.seatCountValid === true && state.seatCount === 256;
    state.newsComplete = status.newsComplete === true;
    state.allSeatsNewsComplete = status.allSeatsNewsComplete === true;
    state.childPacketReceived = status.childPacketReceived === true;
    state.dispositionReady = status.dispositionReady === true;
    state.rendersNothing = status.rendersNothing !== false;
    state.noCanvasCreation = status.noCanvasCreation !== false;
    state.visualPassClaimed = status.visualPassClaimed === true;
    state.parentDatumUnchanged = status.parentDatumUnchanged !== false;
    state.parentHtmlUnchanged = status.htmlUnchanged !== false;
    state.parentRouteJsUnchanged = status.routeJsUnchanged !== false;
    state.downstreamStillHeld = status.downstreamStillHeld !== false;

    if (!state.childReady) {
      setFailure("CHILD_READY_FALSE", FAILURE.CHILD_READY_FALSE);
      return false;
    }

    if (!state.receiveMapReady) {
      setFailure("RECEIVE_MAP_UNAVAILABLE", FAILURE.RECEIVE_MAP_UNAVAILABLE);
      return false;
    }

    if (!state.seatCountValid) {
      setFailure("SEAT_COUNT_MISMATCH", FAILURE.SEAT_COUNT_MISMATCH);
      return false;
    }

    if (!state.newsComplete || !state.allSeatsNewsComplete) {
      setFailure("NEWS_INCOMPLETE", FAILURE.NEWS_INCOMPLETE);
      return false;
    }

    if (!state.childPacketReceived) {
      setFailure("CHILD_PACKET_MISSING", FAILURE.CHILD_PACKET_MISSING);
      return false;
    }

    if (!state.dispositionReady) {
      setFailure("DISPOSITION_NOT_READY", FAILURE.DISPOSITION_NOT_READY);
      return false;
    }

    if (state.visualPassClaimed) {
      setFailure("VISUAL_PASS_FALSE_CLAIM", FAILURE.VISUAL_PASS_FALSE_CLAIM);
      return false;
    }

    if (!state.parentDatumUnchanged || !state.parentHtmlUnchanged || !state.parentRouteJsUnchanged) {
      setFailure("PARENT_MUTATION_DETECTED", FAILURE.PARENT_MUTATION_DETECTED);
      return false;
    }

    updateStreamStatus("disposition", "passive child receive proof");
    state.multiStreamLaunchpadReady = true;
    updateStreamStatus("multiStreamRender", "held · Strength runtime future carrier staged");
    clearFailure();
    return true;
  }

  function applyVisiblePass() {
    setText("[data-harness-datum]", "loaded · cloned seed available");
    setText("[data-harness-disposition]", "loaded · passive receive test");
    setText("[data-harness-receive-map]", "ready · 256 seats");
    setText("[data-harness-news]", "complete · N/E/W/S");
    setText("[data-harness-child-packet]", "received · disposition-child");
    setText("[data-harness-disposition-ready]", "ready · downstream child receive proven");
    setText("[data-harness-render]", "held · no visual pass");
    setText("[data-harness-parent-chain]", "unchanged · datum / HTML / route JS held");
    setText("[data-harness-launchpad]", "ready · future render streams staged");
    setText("[data-harness-runtime]", "Strength held · future multi-stream carrier");
  }

  function applyVisibleFailure() {
    var reason = state.failureCode ? state.failureCode + " · " + state.failureReason : "UNKNOWN_FAILURE";

    setText("[data-harness-datum]", state.datumLoaded ? "loaded · cloned seed available" : "failed · " + reason);
    setText("[data-harness-disposition]", state.dispositionChildLoaded ? "loaded · passive receive test" : "failed · " + reason);
    setText("[data-harness-receive-map]", state.receiveMapReady ? "ready · 256 seats" : "failed · " + reason);
    setText("[data-harness-news]", state.newsComplete && state.allSeatsNewsComplete ? "complete · N/E/W/S" : "failed · " + reason);
    setText("[data-harness-child-packet]", state.childPacketReceived ? "received · disposition-child" : "failed · " + reason);
    setText("[data-harness-disposition-ready]", state.dispositionReady ? "ready · downstream child receive proven" : "failed · " + reason);
    setText("[data-harness-render]", "held · no visual pass");
    setText("[data-harness-parent-chain]", "unchanged · datum / HTML / route JS held");
    setText("[data-harness-launchpad]", "held · awaiting receive proof");
    setText("[data-harness-runtime]", "Strength held · no render activation");
  }

  function writeStreams() {
    var root = qs("[data-harness-streams]");
    if (!root) return;

    root.innerHTML = "";

    state.streams.forEach(function (stream) {
      var card = document.createElement("article");
      card.className = "stream-card";
      card.setAttribute("data-stream-key", stream.key);

      var title = document.createElement("b");
      title.textContent = stream.label;

      var source = document.createElement("span");
      source.textContent = stream.source;

      var role = document.createElement("em");
      role.textContent = stream.role;

      var status = document.createElement("strong");
      status.textContent = stream.status;

      card.appendChild(title);
      card.appendChild(source);
      card.appendChild(role);
      card.appendChild(status);
      root.appendChild(card);
    });
  }

  function writeVisibleStatus() {
    setText("[data-harness-phase]", state.phase);
    setText("[data-harness-failure]", state.failureCode ? state.failureCode + " · " + state.failureReason : "none");

    if (!state.failureCode) applyVisiblePass();
    else applyVisibleFailure();

    writeStreams();

    setData("audraliaHarnessContract", CONTRACT);
    setData("audraliaHarnessHtmlContract", HTML_CONTRACT);
    setData("audraliaHarnessDatumLoaded", state.datumLoaded);
    setData("audraliaHarnessDispositionLoaded", state.dispositionChildLoaded);
    setData("audraliaHarnessChildReady", state.childReady);
    setData("audraliaHarnessLaunchpadReady", state.multiStreamLaunchpadReady);
    setData("audraliaHarnessVisualPassClaimed", state.visualPassClaimed);
    setData("audraliaHarnessFailureCode", state.failureCode || "NONE");
  }

  function status() {
    return {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      route: ROUTE,
      jsRole: JS_ROLE,
      htmlRole: HTML_ROLE,
      runtimeRole: RUNTIME_ROLE,

      parentBaseline: PARENT_BASELINE,
      datumFile: DATUM_FILE,
      dispositionFile: DISPOSITION_FILE,
      multiStreamRenderFile: MULTI_STREAM_RENDER_FILE,

      datumLoaded: state.datumLoaded,
      datumApiFound: state.datumApiFound,
      datumApiSource: state.datumApiSource,
      datumContractAccepted: state.datumContractAccepted,
      cloneContractAccepted: state.cloneContractAccepted,

      dispositionChildLoaded: state.dispositionChildLoaded,
      dispositionApiFound: state.dispositionApiFound,
      dispositionContractAccepted: state.dispositionContractAccepted,

      childReady: state.childReady,
      datumReceived: state.datumReceived,
      receiveMapReady: state.receiveMapReady,
      seatCount: state.seatCount,
      seatCountValid: state.seatCountValid,
      newsComplete: state.newsComplete,
      allSeatsNewsComplete: state.allSeatsNewsComplete,
      childPacketReceived: state.childPacketReceived,
      dispositionReady: state.dispositionReady,

      rendersNothing: state.rendersNothing,
      noCanvasCreation: state.noCanvasCreation,
      visualPassClaimed: state.visualPassClaimed,

      parentDatumUnchanged: state.parentDatumUnchanged,
      parentHtmlUnchanged: state.parentHtmlUnchanged,
      parentRouteJsUnchanged: state.parentRouteJsUnchanged,
      downstreamStillHeld: state.downstreamStillHeld,

      multiStreamLaunchpadReady: state.multiStreamLaunchpadReady,
      streams: state.streams.slice(),

      phase: state.phase,
      failureCode: state.failureCode,
      failureReason: state.failureReason,
      checkedAt: state.checkedAt,
      errors: state.errors.slice()
    };
  }

  function publish() {
    var payload = status();

    window.AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS = {
      contract: CONTRACT,
      status: status,
      refresh: runHarness,
      run: runHarness,
      streams: function () {
        return state.streams.slice();
      },
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false
    };

    window.AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_STATUS = payload;
    window.AUDRALIA_G1_DISPOSITION_MULTI_STREAM_LAUNCHPAD_STATUS = payload;

    return payload;
  }

  function publishBoot() {
    window.AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_BOOT = {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      parentBaseline: PARENT_BASELINE,
      datumFile: DATUM_FILE,
      dispositionFile: DISPOSITION_FILE,
      multiStreamRenderFile: MULTI_STREAM_RENDER_FILE,
      jsRole: JS_ROLE,
      htmlRole: HTML_ROLE,
      runtimeRole: RUNTIME_ROLE,
      parentDatumUnchanged: true,
      parentHtmlUnchanged: true,
      parentRouteJsUnchanged: true,
      downstreamStillHeld: true,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      bootedAt: new Date().toISOString()
    };
  }

  async function runHarness() {
    try {
      setPhase("boot");
      setFailure("BOOT_PENDING", FAILURE.BOOT_PENDING);
      publish();
      writeVisibleStatus();

      setPhase("loading datum");
      var datumLoaded = Boolean(findDatumApi()) ||
        await loadScript(DATUM_FILE, DATUM_CLONE_CONTRACT, "datum");
      state.datumLoaded = Boolean(datumLoaded && findDatumApi());

      if (!verifyDatum()) {
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("loading disposition child");
      var dispositionLoaded = Boolean(findDispositionApi()) ||
        await loadScript(DISPOSITION_FILE, DISPOSITION_CONTRACT, "disposition");
      state.dispositionChildLoaded = Boolean(dispositionLoaded && findDispositionApi());

      await wait(160);

      setPhase("verifying disposition child");
      if (!verifyDisposition()) {
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("pass");
      publish();
      writeVisibleStatus();
      return status();
    } catch (error) {
      recordError("runHarness", error);
      publish();
      writeVisibleStatus();
      return status();
    }
  }

  function init() {
    state.initialized = true;
    publishBoot();
    publish();
    writeStreams();
    runHarness();

    qsa("[data-harness-refresh]").forEach(function (button) {
      button.addEventListener("click", function () {
        runHarness();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
