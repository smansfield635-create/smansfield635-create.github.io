// /showroom/globe/audralia/disposition/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_ROUTE_JS_TNT_v1
//
// JS = COURAGE
//
// Narrative frame:
// INTERGALACTIC COCKPIT
//
// Instrument authority:
// DEXTERION'S LAB
//
// Technical function:
// Preserve verified datum / disposition / terrain proof while publishing Dexterion-facing
// gem instruments, gauge instruments, cockpit status, and held Runtime / Strength state.
//
// Does not:
// - mutate parent Audralia route
// - mutate datum
// - mutate disposition child
// - mutate terrain child
// - activate Runtime / Strength
// - activate multi-stream render
// - create canvas
// - claim visual pass

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_ROUTE_JS_TNT_v1";
  var HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_HTML_BINDING_TNT_v1";

  var PREVIOUS_JS_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_ROUTE_JS_TNT_v1";
  var PREVIOUS_HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_HTML_BINDING_TNT_v1";

  var PARENT_BASELINE = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE_v1";
  var HARNESS_BASELINE = "AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_MULTI_STREAM_LAUNCHPAD_BASELINE_v1";

  var DATUM_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";
  var DISPOSITION_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.disposition.js";
  var TERRAIN_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.terrain.js";
  var MULTI_STREAM_RENDER_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.multi-stream.render.js";

  var DATUM_PUBLIC_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var DATUM_CLONE_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var DISPOSITION_CONTRACT = "AUDRALIA_G1_CHILD_DISPOSITION_DATUM_RECEIVE_TEST_TNT_v1";
  var TERRAIN_CONTRACT = "AUDRALIA_G1_CHILD_TERRAIN_STREAM_DATUM_RECEIVE_TEST_TNT_v1";

  var ROUTE = "/showroom/globe/audralia/disposition/";
  var COCKPIT_FRAME = "Intergalactic Cockpit";
  var TECHNICAL_FUNCTION = "Disposition Harness / Multi-Stream Launchpad";
  var INSTRUMENT_AUTHORITY = "Dexterion's Lab";

  var HTML_ROLE = "WISDOM";
  var JS_ROLE = "COURAGE";
  var RUNTIME_ROLE = "STRENGTH";

  var FAILURE = {
    NONE: "",
    BOOT_PENDING: "boot pending",
    DEXTERION_RENAME_INCOMPLETE: "Dexterion narrative rename incomplete",
    GEM_CONSOLE_MISSING: "gem instrument console missing",
    GAUGE_BOARD_MISSING: "gauge arc board missing",
    COCKPIT_LAYOUT_NOT_RENEWED: "cockpit layout not renewed",
    DATUM_LOAD_FAILED: "datum failed to load",
    DATUM_CONTRACT_MISMATCH: "datum public contract mismatch",
    CLONE_CONTRACT_MISMATCH: "datum clone contract mismatch",
    DISPOSITION_LOAD_FAILED: "disposition child failed to load",
    DISPOSITION_CONTRACT_MISMATCH: "disposition contract mismatch",
    DISPOSITION_READY_FALSE: "disposition child readiness false",
    TERRAIN_LOAD_FAILED: "terrain child failed to load",
    TERRAIN_CONTRACT_MISMATCH: "terrain contract mismatch",
    TERRAIN_CHILD_READY_FALSE: "terrain child readiness false",
    TERRAIN_MAP_UNAVAILABLE: "terrain map unavailable",
    TERRAIN_SEAT_COUNT_MISMATCH: "terrain seat count mismatch",
    TERRAIN_NEWS_INCOMPLETE: "terrain NEWS incomplete",
    TERRAIN_CHILD_PACKET_MISSING: "terrain child packet missing",
    TERRAIN_SAMPLE_MISSING: "terrain sample missing",
    GEM_STATE_INCOMPLETE: "gem state incomplete",
    GAUGE_STATE_INCOMPLETE: "gauge state incomplete",
    PARENT_MUTATION_DETECTED: "parent mutation detected",
    CHILD_MUTATION_DETECTED: "child mutation detected",
    RUNTIME_STRENGTH_FALSE_ACTIVATION: "Runtime / Strength false activation",
    CANVAS_CREATION_ATTEMPTED: "canvas creation attempted",
    GENERATED_IMAGE_USED: "generated image used",
    GRAPHIC_BOX_USED: "GraphicBox used",
    VISUAL_PASS_FALSE_CLAIM: "visual pass false claim",
    UNKNOWN_EXCEPTION: "unknown exception"
  };

  var state = {
    initialized: false,
    phase: "boot pending",

    datumLoaded: false,
    datumApiFound: false,
    datumApiSource: "",
    datumContractAccepted: false,
    cloneContractAccepted: false,

    dispositionChildLoaded: false,
    dispositionApiFound: false,
    dispositionContractAccepted: false,
    dispositionChildReady: false,
    dispositionReady: false,

    terrainChildLoaded: false,
    terrainApiFound: false,
    terrainContractAccepted: false,
    terrainChildReady: false,
    terrainStreamReady: false,
    terrainMapReady: false,
    terrainSeatCount: 0,
    terrainSeatCountValid: false,
    terrainNewsComplete: false,
    terrainAllSeatsNewsComplete: false,
    terrainChildPacketReceived: false,
    terrainSampleReceived: false,
    terrainRendersNothing: true,
    terrainNoCanvasCreation: true,
    terrainVisualPassClaimed: false,

    receiveMapReady: false,
    seatCount: 0,
    newsComplete: false,
    childPacketReceived: false,

    parentDatumUnchanged: true,
    parentHtmlUnchanged: true,
    parentRouteJsUnchanged: true,
    dispositionChildUnchanged: true,
    terrainChildUnchanged: true,
    downstreamStillHeld: true,

    runtimeStrengthHeld: true,
    multiStreamRenderHeld: true,
    multiStreamLaunchpadReady: false,

    rendersNothing: true,
    noCanvasCreation: true,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,

    dexterionRegistryFound: false,
    dexterionGaugeMountMode: "fallback-local-cockpit-mount",
    dexterionRegistryKeys: [],

    gemInstruments: [],
    gaugeMounts: [],
    cockpitInstrumentSummary: {},
    streams: [],

    failureCode: "BOOT_PENDING",
    failureReason: FAILURE.BOOT_PENDING,
    errors: [],
    checkedAt: null
  };

  function nowISO() {
    return new Date().toISOString();
  }

  function setPhase(value) {
    state.phase = value;
    state.checkedAt = nowISO();
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
    state.errors.push({ scope: scope, message: message, time: nowISO() });
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
    node.textContent = String(text);
    return true;
  }

  function setAllText(selector, text) {
    qsa(selector).forEach(function (node) {
      node.textContent = String(text);
    });
  }

  function setData(name, value) {
    try {
      var text = String(value);
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
        wait(120).then(function () { resolve(true); });
        return;
      }

      var script = document.createElement("script");
      script.src = file + "?v=" + encodeURIComponent(cacheKey);
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-cockpit-loader", CONTRACT);
      script.setAttribute("data-loader-marker", marker);
      script.setAttribute("data-cockpit-frame", COCKPIT_FRAME);
      script.setAttribute("data-instrument-authority", INSTRUMENT_AUTHORITY);
      script.setAttribute("data-html-role", HTML_ROLE);
      script.setAttribute("data-js-role", JS_ROLE);
      script.setAttribute("data-runtime-role", RUNTIME_ROLE);
      script.setAttribute("data-runtime-strength-held", "true");
      script.setAttribute("data-no-visual-pass-claim", "true");

      script.onload = function () {
        wait(120).then(function () { resolve(true); });
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

    state.datumApiSource = "";
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

  function findTerrainApi() {
    var sources = [
      ["AUDRALIA_G1_CHILD_TERRAIN_STREAM", window.AUDRALIA_G1_CHILD_TERRAIN_STREAM],
      ["AUDRALIA_TRUE_GLOBE_TERRAIN", window.AUDRALIA_TRUE_GLOBE_TERRAIN],
      ["AUDRALIA_G1_TRUE_GLOBE_TERRAIN", window.AUDRALIA_G1_TRUE_GLOBE_TERRAIN]
    ];

    for (var i = 0; i < sources.length; i += 1) {
      if (sources[i][1]) return sources[i][1];
    }

    return null;
  }

  function readTerrainStatus(api) {
    try {
      if (api && typeof api.refresh === "function") api.refresh();
    } catch (error) {
      recordError("terrain.refresh", error);
    }

    try {
      if (api && typeof api.status === "function") return api.status();
    } catch (error2) {
      recordError("terrain.status", error2);
    }

    return window.AUDRALIA_G1_CHILD_TERRAIN_STREAM_STATUS ||
      window.AUDRALIA_TRUE_GLOBE_TERRAIN_STATUS ||
      null;
  }

  function readDexterionRegistry() {
    var sources = [
      ["DEXTERION_LAB_TOOL_REGISTRY", window.DEXTERION_LAB_TOOL_REGISTRY],
      ["DEXTERION_LAB_GAUGE_REGISTRY", window.DEXTERION_LAB_GAUGE_REGISTRY],
      ["DEXTERION_LAB_DIAGNOSTIC_STATUS", window.DEXTERION_LAB_DIAGNOSTIC_STATUS],
      ["DGB_DEXTERION_LAB_TOOL_REGISTRY", window.DGB_DEXTERION_LAB_TOOL_REGISTRY],
      ["DGB_DEXTERION_LAB_GAUGE_REGISTRY", window.DGB_DEXTERION_LAB_GAUGE_REGISTRY],
      ["DGB_DEXTERION_LAB_STATUS", window.DGB_DEXTERION_LAB_STATUS],

      // Legacy-compatible reads. Public copy remains Dexterion-facing.
      ["DEXTER_LAB_TOOL_REGISTRY", window.DEXTER_LAB_TOOL_REGISTRY],
      ["DEXTER_LAB_GAUGE_REGISTRY", window.DEXTER_LAB_GAUGE_REGISTRY],
      ["DEXTER_LAB_DIAGNOSTIC_STATUS", window.DEXTER_LAB_DIAGNOSTIC_STATUS],
      ["DGB_DEXTER_LAB_TOOL_REGISTRY", window.DGB_DEXTER_LAB_TOOL_REGISTRY],
      ["DGB_DEXTER_LAB_GAUGE_REGISTRY", window.DGB_DEXTER_LAB_GAUGE_REGISTRY],
      ["DGB_DEXTER_LAB_STATUS", window.DGB_DEXTER_LAB_STATUS]
    ];

    var found = [];

    for (var i = 0; i < sources.length; i += 1) {
      if (sources[i][1]) found.push(sources[i][0]);
    }

    state.dexterionRegistryKeys = found;
    state.dexterionRegistryFound = found.length > 0;
    state.dexterionGaugeMountMode = state.dexterionRegistryFound ? "registry-mounted" : "fallback-local-cockpit-mount";

    return state.dexterionRegistryFound;
  }

  function verifyDatum() {
    var api = findDatumApi();
    state.datumApiFound = Boolean(api);

    if (!api) {
      setFailure("DATUM_LOAD_FAILED", FAILURE.DATUM_LOAD_FAILED);
      return false;
    }

    var status = readDatumStatus(api) || {};
    var publicContract = status.contract || api.contract || "";
    var cloneContract = status.cloneContract || api.cloneContract || status.cloneDatumContract || api.cloneDatumContract || "";

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
    state.newsComplete = Boolean(status.newsComplete === true);
    state.seatCount = Number(status.seatCount || 256);
    state.receiveMapReady = status.childReceiveMapReady === true || state.receiveMapReady;

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
    var contract = status.contract || api.contract || "";

    state.dispositionContractAccepted = contract === DISPOSITION_CONTRACT;
    state.dispositionChildLoaded = state.dispositionContractAccepted;
    state.dispositionChildReady = status.childReady === true;
    state.dispositionReady = status.dispositionReady === true;
    state.receiveMapReady = state.receiveMapReady || status.receiveMapReady === true;
    state.childPacketReceived = state.childPacketReceived || status.childPacketReceived === true;

    if (!state.dispositionContractAccepted) {
      setFailure("DISPOSITION_CONTRACT_MISMATCH", FAILURE.DISPOSITION_CONTRACT_MISMATCH);
      return false;
    }

    if (!state.dispositionChildReady || !state.dispositionReady) {
      setFailure("DISPOSITION_READY_FALSE", FAILURE.DISPOSITION_READY_FALSE);
      return false;
    }

    return true;
  }

  function verifyTerrain() {
    var api = findTerrainApi();
    state.terrainApiFound = Boolean(api);

    if (!api) {
      setFailure("TERRAIN_LOAD_FAILED", FAILURE.TERRAIN_LOAD_FAILED);
      return false;
    }

    var status = readTerrainStatus(api) || {};
    var contract = status.contract || api.contract || "";

    state.terrainContractAccepted = contract === TERRAIN_CONTRACT;
    state.terrainChildLoaded = state.terrainContractAccepted;

    state.terrainChildReady = status.terrainChildReady === true;
    state.terrainStreamReady = status.terrainStreamReady === true;
    state.terrainMapReady = status.terrainMapReady === true;
    state.terrainSeatCount = Number(status.terrainSeatCount || status.seatCount || 0);
    state.terrainSeatCountValid = Boolean(status.terrainSeatCountValid === true || state.terrainSeatCount === 256);
    state.terrainNewsComplete = Boolean(status.newsComplete === true);
    state.terrainAllSeatsNewsComplete = Boolean(status.allSeatsNewsComplete === true);
    state.terrainChildPacketReceived = status.childPacketReceived === true;
    state.terrainSampleReceived = status.sampleReceived === true;
    state.terrainRendersNothing = status.rendersNothing !== false;
    state.terrainNoCanvasCreation = status.noCanvasCreation !== false;
    state.terrainVisualPassClaimed = status.visualPassClaimed === true;

    state.receiveMapReady = state.receiveMapReady || status.receiveMapReady === true;
    state.childPacketReceived = state.childPacketReceived || state.terrainChildPacketReceived;

    state.parentDatumUnchanged = status.parentDatumUnchanged !== false;
    state.parentHtmlUnchanged = status.parentHtmlUnchanged !== false;
    state.parentRouteJsUnchanged = status.parentRouteJsUnchanged !== false;
    state.terrainChildUnchanged = true;
    state.dispositionChildUnchanged = true;
    state.downstreamStillHeld = status.downstreamStillHeld !== false;

    if (!state.terrainContractAccepted) {
      setFailure("TERRAIN_CONTRACT_MISMATCH", FAILURE.TERRAIN_CONTRACT_MISMATCH);
      return false;
    }

    if (!state.terrainChildReady || !state.terrainStreamReady || !state.terrainMapReady) {
      setFailure("TERRAIN_CHILD_READY_FALSE", FAILURE.TERRAIN_CHILD_READY_FALSE);
      return false;
    }

    if (!state.terrainSeatCountValid || state.terrainSeatCount !== 256) {
      setFailure("TERRAIN_SEAT_COUNT_MISMATCH", FAILURE.TERRAIN_SEAT_COUNT_MISMATCH);
      return false;
    }

    if (!state.terrainNewsComplete || !state.terrainAllSeatsNewsComplete) {
      setFailure("TERRAIN_NEWS_INCOMPLETE", FAILURE.TERRAIN_NEWS_INCOMPLETE);
      return false;
    }

    if (!state.terrainChildPacketReceived) {
      setFailure("TERRAIN_CHILD_PACKET_MISSING", FAILURE.TERRAIN_CHILD_PACKET_MISSING);
      return false;
    }

    if (!state.terrainSampleReceived) {
      setFailure("TERRAIN_SAMPLE_MISSING", FAILURE.TERRAIN_SAMPLE_MISSING);
      return false;
    }

    if (!state.terrainRendersNothing || !state.terrainNoCanvasCreation || state.terrainVisualPassClaimed) {
      setFailure("TERRAIN_RENDER_FALSE_CLAIM", FAILURE.TERRAIN_RENDER_FALSE_CLAIM);
      return false;
    }

    if (!state.parentDatumUnchanged || !state.parentHtmlUnchanged || !state.parentRouteJsUnchanged) {
      setFailure("PARENT_MUTATION_DETECTED", FAILURE.PARENT_MUTATION_DETECTED);
      return false;
    }

    return true;
  }

  function result(condition) {
    return condition ? "pass" : "fail";
  }

  function makeGem(id, label, stream, stateValue, sourceTool, meaning) {
    return {
      id: id,
      label: label,
      stream: stream,
      state: stateValue,
      sourceTool: sourceTool,
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      meaning: meaning,
      cockpitControl: true,
      visualActivation: false
    };
  }

  function makeGauge(id, label, sourceTool, stream, resultValue, expected, nextMove) {
    return {
      id: id,
      label: label,
      sourceTool: sourceTool,
      sourceGauge: sourceTool.replace("dexterion.", "dexterion.gauge."),
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      stream: stream,
      result: resultValue,
      expected: expected,
      nextMove: nextMove || "",
      cockpitDisplayOnly: true,
      dexterionAuthorityPreserved: true,
      visualActivation: false
    };
  }

  function buildGemInstruments() {
    var datumPass = state.datumLoaded && state.datumContractAccepted && state.cloneContractAccepted;
    var dispositionPass = state.dispositionChildLoaded && state.dispositionChildReady && state.dispositionReady;
    var terrainPass = state.terrainChildLoaded && state.terrainChildReady && state.terrainStreamReady && state.terrainMapReady;
    var newsPass = (state.newsComplete || state.terrainNewsComplete) && state.terrainAllSeatsNewsComplete;
    var parentPass = state.parentDatumUnchanged && state.parentHtmlUnchanged && state.parentRouteJsUnchanged;
    var renderPass = state.rendersNothing && state.noCanvasCreation && state.visualPassClaimed === false && state.terrainVisualPassClaimed === false;

    state.gemInstruments = [
      makeGem("datum-gem", "Datum Gem", "datum", datumPass ? "pass" : "fail", "dexterion.datum.integrity", "origin map / cloned seed available"),
      makeGem("disposition-gem", "Disposition Gem", "disposition", dispositionPass ? "pass" : "fail", "dexterion.downstream.receive", "downstream receive alignment"),
      makeGem("terrain-gem", "Terrain Gem", "terrain", terrainPass ? "pass" : "fail", "dexterion.terrain.stream.readiness", "passive terrain receive proof"),
      makeGem("news-gem", "NEWS Gem", "navigation", newsPass ? "pass" : "fail", "dexterion.news.navigation", "N/E/W/S complete"),
      makeGem("parent-chain-gem", "Parent Chain Gem", "parent-chain", parentPass ? "pass" : "fail", "dexterion.parent.mutation.guard", "datum / HTML / route JS held"),
      makeGem("render-hold-gem", "Render Hold Gem", "render", renderPass ? "pass" : "fail", "dexterion.render.hold.guard", "no canvas / no visual pass"),
      makeGem("runtime-strength-gem", "Runtime Strength Gem", "runtime", state.runtimeStrengthHeld ? "held" : "fail", "dexterion.runtime.strength.readiness", "future engine carrier held"),
      makeGem("multi-stream-gem", "Multi-Stream Gem", "launchpad", terrainPass && dispositionPass && state.multiStreamRenderHeld ? "staged" : "held", "dexterion.multi-stream.coherence", "disposition + terrain ready, future streams held")
    ];

    return state.gemInstruments;
  }

  function buildGaugeMounts() {
    var datumPass = state.datumLoaded && state.datumContractAccepted && state.cloneContractAccepted;
    var dispositionPass = state.dispositionChildLoaded && state.dispositionChildReady && state.dispositionReady;
    var terrainPass = state.terrainChildLoaded && state.terrainChildReady && state.terrainStreamReady && state.terrainMapReady;
    var newsPass = (state.newsComplete || state.terrainNewsComplete) && state.terrainAllSeatsNewsComplete;
    var parentPass = state.parentDatumUnchanged && state.parentHtmlUnchanged && state.parentRouteJsUnchanged;
    var renderPass = state.rendersNothing && state.noCanvasCreation && state.visualPassClaimed === false && state.terrainVisualPassClaimed === false;
    var runtimeHeld = state.runtimeStrengthHeld && state.multiStreamRenderHeld;
    var staged = datumPass && dispositionPass && terrainPass && runtimeHeld;

    state.gaugeMounts = [
      makeGauge("datum-integrity", "Datum Integrity Gauge", "dexterion.datum.integrity", "datum", result(datumPass), "datumLoaded && datumContractAccepted && cloneContractAccepted"),
      makeGauge("disposition-receive", "Disposition Receive Gauge", "dexterion.downstream.receive", "disposition", result(dispositionPass), "dispositionChildLoaded && childReady && dispositionReady"),
      makeGauge("terrain-stream", "Terrain Stream Gauge", "dexterion.terrain.stream.readiness", "terrain", result(terrainPass), "terrainChildLoaded && terrainChildReady && terrainStreamReady && terrainMapReady"),
      makeGauge("news-navigation", "NEWS Navigation Gauge", "dexterion.news.navigation", "datum/disposition/terrain", result(newsPass), "newsComplete && terrainNewsComplete"),
      makeGauge("parent-chain-guard", "Parent Chain Guard", "dexterion.parent.mutation.guard", "parent-chain", result(parentPass), "parentDatumUnchanged && parentHtmlUnchanged && parentRouteJsUnchanged"),
      makeGauge("render-hold", "Render Hold Gauge", "dexterion.render.hold.guard", "render", result(renderPass), "rendersNothing && noCanvasCreation && visualPassClaimed=false"),
      makeGauge("runtime-strength", "Runtime Strength Gauge", "dexterion.runtime.strength.readiness", "runtime", runtimeHeld ? "held" : "fail", "held", "Keep Runtime / Strength held until explicitly authorized."),
      makeGauge("multi-stream-coherence", "Multi-Stream Coherence Gauge", "dexterion.multi-stream.coherence", "launchpad", staged ? "staged" : "held", "datum + disposition + terrain staged, future streams held")
    ];

    state.cockpitInstrumentSummary = {
      datumGemStatus: state.gemInstruments[0] ? state.gemInstruments[0].state : "fail",
      dispositionGemStatus: state.gemInstruments[1] ? state.gemInstruments[1].state : "fail",
      terrainGemStatus: state.gemInstruments[2] ? state.gemInstruments[2].state : "fail",
      newsGemStatus: state.gemInstruments[3] ? state.gemInstruments[3].state : "fail",
      parentChainGemStatus: state.gemInstruments[4] ? state.gemInstruments[4].state : "fail",
      renderHoldGemStatus: state.gemInstruments[5] ? state.gemInstruments[5].state : "fail",
      runtimeStrengthGemStatus: state.gemInstruments[6] ? state.gemInstruments[6].state : "fail",
      multiStreamGemStatus: state.gemInstruments[7] ? state.gemInstruments[7].state : "fail",

      datumGaugeStatus: datumPass ? "pass" : "fail",
      dispositionGaugeStatus: dispositionPass ? "pass" : "fail",
      terrainGaugeStatus: terrainPass ? "pass" : "fail",
      newsGaugeStatus: newsPass ? "pass" : "fail",
      parentChainGaugeStatus: parentPass ? "pass" : "fail",
      renderHoldGaugeStatus: renderPass ? "pass" : "fail",
      runtimeStrengthGaugeStatus: runtimeHeld ? "held" : "fail",
      multiStreamGaugeStatus: staged ? "staged" : "held"
    };

    return state.gaugeMounts;
  }

  function instrumentsValid() {
    var s = state.cockpitInstrumentSummary;

    return Boolean(
      state.gemInstruments.length === 8 &&
      state.gaugeMounts.length === 8 &&
      s.datumGemStatus === "pass" &&
      s.dispositionGemStatus === "pass" &&
      s.terrainGemStatus === "pass" &&
      s.newsGemStatus === "pass" &&
      s.parentChainGemStatus === "pass" &&
      s.renderHoldGemStatus === "pass" &&
      s.runtimeStrengthGemStatus === "held" &&
      s.multiStreamGemStatus === "staged" &&
      s.datumGaugeStatus === "pass" &&
      s.dispositionGaugeStatus === "pass" &&
      s.terrainGaugeStatus === "pass" &&
      s.newsGaugeStatus === "pass" &&
      s.parentChainGaugeStatus === "pass" &&
      s.renderHoldGaugeStatus === "pass" &&
      s.runtimeStrengthGaugeStatus === "held" &&
      s.multiStreamGaugeStatus === "staged"
    );
  }

  function buildStreams() {
    state.streams = [
      {
        key: "datum",
        label: "Datum Stream",
        source: DATUM_FILE,
        role: "origin map / cloned seed",
        status: state.datumLoaded ? "active parent math" : "pending"
      },
      {
        key: "disposition",
        label: "Disposition Stream",
        source: DISPOSITION_FILE,
        role: "navigation readiness / receive proof",
        status: state.dispositionChildReady ? "passive child receive proof" : "pending"
      },
      {
        key: "terrain",
        label: "Terrain Stream",
        source: TERRAIN_FILE,
        role: "planetary surface-readiness instrument",
        status: state.terrainChildReady ? "loaded · passive terrain receive proof" : "held"
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
        status: "held · Strength runtime future carrier staged"
      },
      {
        key: "dexterionInstruments",
        label: "Dexterion's Lab Instruments",
        source: "Dexterion laboratory authority",
        role: "cockpit gem/gauge readout layer",
        status: state.gaugeMounts.length === 8 && state.gemInstruments.length === 8 ? "mounted · cockpit gauge readouts active" : "pending"
      }
    ];

    return state.streams;
  }

  function setInstrumentData(selector, stateValue) {
    qsa(selector).forEach(function (node) {
      node.setAttribute("data-state", stateValue);
      node.setAttribute("data-gem-state", stateValue);
      node.setAttribute("data-gauge-state", stateValue);
    });
  }

  function writeGemInstruments() {
    var root = qs("[data-gem-console]");
    if (!root) return;

    root.innerHTML = "";

    state.gemInstruments.forEach(function (gem) {
      var card = document.createElement("article");
      card.className = "gem-instrument";
      card.setAttribute("data-gem-instrument", gem.id);
      card.setAttribute("data-gem-stream", gem.stream);
      card.setAttribute("data-gem-state", gem.state);
      card.setAttribute("data-state", gem.state);
      card.setAttribute("data-dexterion-source-tool", gem.sourceTool);

      var orb = document.createElement("span");
      orb.className = "gem-orb";
      orb.setAttribute("aria-hidden", "true");

      var label = document.createElement("b");
      label.textContent = gem.label;

      var status = document.createElement("strong");
      status.textContent = gem.state.toUpperCase();

      var copy = document.createElement("span");
      copy.textContent = gem.meaning;

      card.appendChild(orb);
      card.appendChild(label);
      card.appendChild(status);
      card.appendChild(copy);
      root.appendChild(card);
    });
  }

  function writeGaugeBoard() {
    var root = qs("[data-gauge-board]");
    if (!root) return;

    root.innerHTML = "";

    state.gaugeMounts.forEach(function (gauge) {
      var card = document.createElement("article");
      card.className = "gauge-dial";
      card.setAttribute("data-gauge-id", gauge.id);
      card.setAttribute("data-gauge-state", gauge.result);
      card.setAttribute("data-state", gauge.result);
      card.setAttribute("data-dexterion-source-tool", gauge.sourceTool);

      var face = document.createElement("span");
      face.className = "gauge-face";
      face.setAttribute("aria-hidden", "true");

      var arc = document.createElement("span");
      arc.className = "gauge-arc";
      face.appendChild(arc);

      var needle = document.createElement("span");
      needle.className = "gauge-needle";
      face.appendChild(needle);

      var label = document.createElement("b");
      label.textContent = gauge.label;

      var status = document.createElement("strong");
      status.textContent = gauge.result + " · " + gauge.sourceTool;

      var copy = document.createElement("span");
      copy.textContent = gauge.stream + " · " + gauge.expected;

      card.appendChild(face);
      card.appendChild(label);
      card.appendChild(status);
      card.appendChild(copy);
      root.appendChild(card);
    });
  }

  function writeStreams() {
    var root = qs("[data-cockpit-streams]");
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
    var s = state.cockpitInstrumentSummary;
    var failureText = state.failureCode ? state.failureCode + " · " + state.failureReason : "none";

    setText("[data-cockpit-phase]", state.phase);
    setText("[data-cockpit-failure]", failureText);

    setText("[data-cockpit-datum]", state.datumLoaded ? "loaded · cloned seed available" : "failed · datum unavailable");
    setText("[data-cockpit-disposition]", state.dispositionChildReady ? "loaded · passive receive test" : "failed · disposition not ready");
    setText("[data-cockpit-terrain]", state.terrainChildReady ? "loaded · passive terrain receive proof" : "failed · terrain not ready");

    setText("[data-cockpit-dexter]", "mounted · cockpit gauge readouts active");
    setText("[data-cockpit-dexterion]", "mounted · cockpit gauge readouts active");
    setText("[data-cockpit-dexter-mode]", state.dexterionGaugeMountMode);
    setText("[data-cockpit-dexterion-mode]", state.dexterionGaugeMountMode);

    setText("[data-cockpit-receive-map]", state.receiveMapReady || state.terrainMapReady ? "ready · 256 seats" : "pending");
    setText("[data-cockpit-news]", state.newsComplete || state.terrainNewsComplete ? "complete · N/E/W/S" : "pending");
    setText("[data-cockpit-terrain-map]", state.terrainMapReady ? "ready · 256 math-only terrain seats" : "pending");
    setText("[data-cockpit-terrain-news]", state.terrainNewsComplete ? "complete · N/E/W/S" : "pending");

    setText("[data-cockpit-gem-console-status]", "active · datum / disposition / terrain / NEWS gauges online");
    setText("[data-cockpit-gauge-board-status]", "mounted · Dexterion instrument authority");

    setText("[data-gauge-datum]", s.datumGaugeStatus === "pass" ? "pass · Dexterion datum-integrity gauge" : "fail · Dexterion datum-integrity gauge");
    setText("[data-gauge-disposition]", s.dispositionGaugeStatus === "pass" ? "pass · Dexterion downstream-receive gauge" : "fail · Dexterion downstream-receive gauge");
    setText("[data-gauge-terrain]", s.terrainGaugeStatus === "pass" ? "pass · Dexterion terrain-stream readiness gauge" : "fail · Dexterion terrain-stream readiness gauge");
    setText("[data-gauge-news]", s.newsGaugeStatus === "pass" ? "pass · Dexterion NEWS-navigation gauge" : "fail · Dexterion NEWS-navigation gauge");
    setText("[data-gauge-parent]", s.parentChainGaugeStatus === "pass" ? "pass · Dexterion parent-mutation guard" : "fail · Dexterion parent-mutation guard");
    setText("[data-gauge-render]", s.renderHoldGaugeStatus === "pass" ? "pass · no canvas / no visual pass" : "fail · render hold guard");
    setText("[data-gauge-runtime]", s.runtimeStrengthGaugeStatus === "held" ? "held · future engine carrier" : "fail · Runtime / Strength false activation");
    setText("[data-gauge-multistream]", s.multiStreamGaugeStatus === "staged" ? "staged · disposition + terrain ready, future streams held" : "held · stream coherence incomplete");

    setText("[data-cockpit-render]", "held · no visual pass");
    setText("[data-cockpit-parent-chain]", "unchanged · datum / HTML / route JS held");
    setText("[data-cockpit-runtime]", "held · future multi-stream carrier");
    setText("[data-cockpit-launchpad]", state.multiStreamLaunchpadReady ? "staged · disposition + terrain ready, future streams held" : "held · awaiting stream proof");

    setInstrumentData('[data-gem-instrument="datum-gem"], [data-gem-stream="datum"]', s.datumGemStatus || "fail");
    setInstrumentData('[data-gem-instrument="disposition-gem"], [data-gem-stream="disposition"]', s.dispositionGemStatus || "fail");
    setInstrumentData('[data-gem-instrument="terrain-gem"], [data-gem-stream="terrain"]', s.terrainGemStatus || "fail");
    setInstrumentData('[data-gem-instrument="news-gem"], [data-gem-stream="navigation"]', s.newsGemStatus || "fail");
    setInstrumentData('[data-gem-instrument="parent-chain-gem"], [data-gem-stream="parent-chain"]', s.parentChainGemStatus || "fail");
    setInstrumentData('[data-gem-instrument="render-hold-gem"], [data-gem-stream="render"]', s.renderHoldGemStatus || "fail");
    setInstrumentData('[data-gem-instrument="runtime-strength-gem"], [data-gem-stream="runtime"]', s.runtimeStrengthGemStatus || "held");
    setInstrumentData('[data-gem-instrument="multi-stream-gem"], [data-gem-stream="launchpad"]', s.multiStreamGemStatus || "held");

    writeGemInstruments();
    writeGaugeBoard();
    writeStreams();

    setAllText("[data-public-instrument-authority]", INSTRUMENT_AUTHORITY);
    setAllText("[data-public-cockpit-frame]", COCKPIT_FRAME);

    setData("audraliaCockpitContract", CONTRACT);
    setData("audraliaCockpitHtmlContract", HTML_CONTRACT);
    setData("audraliaCockpitFrame", COCKPIT_FRAME);
    setData("audraliaDexterionInstrumentAuthority", true);
    setData("audraliaDexterionGaugeMountMode", state.dexterionGaugeMountMode);
    setData("audraliaGemConsoleActive", state.gemInstruments.length === 8);
    setData("audraliaGaugeBoardActive", state.gaugeMounts.length === 8);
    setData("audraliaTerrainChildReady", state.terrainChildReady);
    setData("audraliaRuntimeStrengthHeld", state.runtimeStrengthHeld);
    setData("audraliaVisualPassClaimed", state.visualPassClaimed);
    setData("audraliaGeneratedImage", false);
    setData("audraliaGraphicBox", false);
    setData("audraliaCockpitFailureCode", state.failureCode || "NONE");
  }

  function status() {
    return {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      previousJsContract: PREVIOUS_JS_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,

      route: ROUTE,
      cockpitFrame: COCKPIT_FRAME,
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      technicalFunction: TECHNICAL_FUNCTION,

      htmlRole: HTML_ROLE,
      jsRole: JS_ROLE,
      runtimeRole: RUNTIME_ROLE,
      runtimeStrengthHeld: state.runtimeStrengthHeld,

      parentBaseline: PARENT_BASELINE,
      harnessBaseline: HARNESS_BASELINE,

      datumFile: DATUM_FILE,
      dispositionFile: DISPOSITION_FILE,
      terrainFile: TERRAIN_FILE,
      multiStreamRenderFile: MULTI_STREAM_RENDER_FILE,

      datumLoaded: state.datumLoaded,
      datumApiFound: state.datumApiFound,
      datumApiSource: state.datumApiSource,
      datumContractAccepted: state.datumContractAccepted,
      cloneContractAccepted: state.cloneContractAccepted,

      dispositionChildLoaded: state.dispositionChildLoaded,
      dispositionContractAccepted: state.dispositionContractAccepted,
      dispositionChildReady: state.dispositionChildReady,
      dispositionReady: state.dispositionReady,

      terrainChildLoaded: state.terrainChildLoaded,
      terrainContractAccepted: state.terrainContractAccepted,
      terrainChildReady: state.terrainChildReady,
      terrainStreamReady: state.terrainStreamReady,
      terrainMapReady: state.terrainMapReady,
      terrainSeatCount: state.terrainSeatCount,
      terrainSeatCountValid: state.terrainSeatCountValid,
      terrainNewsComplete: state.terrainNewsComplete,
      terrainAllSeatsNewsComplete: state.terrainAllSeatsNewsComplete,
      terrainChildPacketReceived: state.terrainChildPacketReceived,
      terrainSampleReceived: state.terrainSampleReceived,

      receiveMapReady: state.receiveMapReady,
      seatCount: state.seatCount,
      newsComplete: state.newsComplete,
      childPacketReceived: state.childPacketReceived,

      dexterionRegistryFound: state.dexterionRegistryFound,
      dexterionRegistryKeys: state.dexterionRegistryKeys.slice(),
      dexterionGaugeMountMode: state.dexterionGaugeMountMode,

      gemInstruments: state.gemInstruments.slice(),
      gaugeMounts: state.gaugeMounts.slice(),
      cockpitInstrumentSummary: Object.assign({}, state.cockpitInstrumentSummary),
      streams: state.streams.slice(),

      datumGemStatus: state.cockpitInstrumentSummary.datumGemStatus,
      dispositionGemStatus: state.cockpitInstrumentSummary.dispositionGemStatus,
      terrainGemStatus: state.cockpitInstrumentSummary.terrainGemStatus,
      newsGemStatus: state.cockpitInstrumentSummary.newsGemStatus,
      parentChainGemStatus: state.cockpitInstrumentSummary.parentChainGemStatus,
      renderHoldGemStatus: state.cockpitInstrumentSummary.renderHoldGemStatus,
      runtimeStrengthGemStatus: state.cockpitInstrumentSummary.runtimeStrengthGemStatus,
      multiStreamGemStatus: state.cockpitInstrumentSummary.multiStreamGemStatus,

      datumGaugeStatus: state.cockpitInstrumentSummary.datumGaugeStatus,
      dispositionGaugeStatus: state.cockpitInstrumentSummary.dispositionGaugeStatus,
      terrainGaugeStatus: state.cockpitInstrumentSummary.terrainGaugeStatus,
      newsGaugeStatus: state.cockpitInstrumentSummary.newsGaugeStatus,
      parentChainGaugeStatus: state.cockpitInstrumentSummary.parentChainGaugeStatus,
      renderHoldGaugeStatus: state.cockpitInstrumentSummary.renderHoldGaugeStatus,
      runtimeStrengthGaugeStatus: state.cockpitInstrumentSummary.runtimeStrengthGaugeStatus,
      multiStreamGaugeStatus: state.cockpitInstrumentSummary.multiStreamGaugeStatus,

      multiStreamRenderHeld: state.multiStreamRenderHeld,
      multiStreamLaunchpadReady: state.multiStreamLaunchpadReady,

      parentDatumUnchanged: state.parentDatumUnchanged,
      parentHtmlUnchanged: state.parentHtmlUnchanged,
      parentRouteJsUnchanged: state.parentRouteJsUnchanged,
      dispositionChildUnchanged: state.dispositionChildUnchanged,
      terrainChildUnchanged: state.terrainChildUnchanged,
      downstreamStillHeld: state.downstreamStillHeld,

      rendersNothing: state.rendersNothing,
      noCanvasCreation: state.noCanvasCreation,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,

      phase: state.phase,
      failureCode: state.failureCode,
      failureReason: state.failureReason,
      checkedAt: state.checkedAt,
      errors: state.errors.slice()
    };
  }

  function publish() {
    var payload = status();

    var api = {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      cockpitFrame: COCKPIT_FRAME,
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      technicalFunction: TECHNICAL_FUNCTION,
      status: status,
      refresh: runCockpit,
      run: runCockpit,
      gems: function () { return state.gemInstruments.slice(); },
      gauges: function () { return state.gaugeMounts.slice(); },
      streams: function () { return state.streams.slice(); },
      runtimeStrengthHeld: true,
      rendersNothing: true,
      noCanvasCreation: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT = api;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT = api;

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_STATUS = payload;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_STATUS = payload;

    // Compatibility alias. Public page copy should use Dexterion’s Lab.
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_STATUS = payload;

    return payload;
  }

  function publishBoot() {
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_BOOT = {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      previousJsContract: PREVIOUS_JS_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      cockpitFrame: COCKPIT_FRAME,
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      technicalFunction: TECHNICAL_FUNCTION,
      htmlRole: HTML_ROLE,
      jsRole: JS_ROLE,
      runtimeRole: RUNTIME_ROLE,
      datumFile: DATUM_FILE,
      dispositionFile: DISPOSITION_FILE,
      terrainFile: TERRAIN_FILE,
      multiStreamRenderFile: MULTI_STREAM_RENDER_FILE,
      parentDatumUnchanged: true,
      parentHtmlUnchanged: true,
      parentRouteJsUnchanged: true,
      dispositionChildUnchanged: true,
      terrainChildUnchanged: true,
      runtimeStrengthHeld: true,
      multiStreamRenderHeld: true,
      rendersNothing: true,
      noCanvasCreation: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      bootedAt: nowISO()
    };
  }

  async function runCockpit() {
    try {
      setPhase("boot");
      setFailure("BOOT_PENDING", FAILURE.BOOT_PENDING);

      readDexterionRegistry();
      buildGemInstruments();
      buildGaugeMounts();
      buildStreams();
      publish();
      writeVisibleStatus();

      setPhase("loading datum");
      state.datumLoaded = Boolean(findDatumApi()) ||
        await loadScript(DATUM_FILE, DATUM_CLONE_CONTRACT, "datum");

      state.datumLoaded = Boolean(state.datumLoaded && findDatumApi());

      if (!verifyDatum()) {
        buildGemInstruments();
        buildGaugeMounts();
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("loading disposition");
      state.dispositionChildLoaded = Boolean(findDispositionApi()) ||
        await loadScript(DISPOSITION_FILE, DISPOSITION_CONTRACT, "disposition");

      state.dispositionChildLoaded = Boolean(state.dispositionChildLoaded && findDispositionApi());

      await wait(140);

      if (!verifyDisposition()) {
        buildGemInstruments();
        buildGaugeMounts();
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("loading terrain");
      state.terrainChildLoaded = Boolean(findTerrainApi()) ||
        await loadScript(TERRAIN_FILE, TERRAIN_CONTRACT, "terrain");

      state.terrainChildLoaded = Boolean(state.terrainChildLoaded && findTerrainApi());

      await wait(180);

      if (!verifyTerrain()) {
        buildGemInstruments();
        buildGaugeMounts();
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("mounting gem instruments");
      buildGemInstruments();

      setPhase("mounting Dexterion gauges");
      buildGaugeMounts();

      if (!instrumentsValid()) {
        setFailure("GAUGE_STATE_INCOMPLETE", FAILURE.GAUGE_STATE_INCOMPLETE);
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      state.runtimeStrengthHeld = true;
      state.multiStreamRenderHeld = true;
      state.multiStreamLaunchpadReady = true;
      state.rendersNothing = true;
      state.noCanvasCreation = true;
      state.generatedImage = false;
      state.graphicBox = false;
      state.visualPassClaimed = false;
      state.downstreamStillHeld = true;

      buildStreams();

      setPhase("pass");
      clearFailure();
      publish();
      writeVisibleStatus();
      return status();
    } catch (error) {
      recordError("runCockpit", error);
      buildGemInstruments();
      buildGaugeMounts();
      buildStreams();
      publish();
      writeVisibleStatus();
      return status();
    }
  }

  function init() {
    state.initialized = true;

    publishBoot();
    readDexterionRegistry();
    buildGemInstruments();
    buildGaugeMounts();
    buildStreams();
    publish();
    writeVisibleStatus();

    runCockpit();

    qsa("[data-cockpit-refresh]").forEach(function (button) {
      button.addEventListener("click", function () {
        runCockpit();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
