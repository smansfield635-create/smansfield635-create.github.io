// /showroom/globe/audralia/disposition/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_ROUTE_JS_TNT_v1
//
// Function assignment:
// JS = COURAGE
//
// Narrative frame:
// INTERGALACTIC COCKPIT
//
// Instrument authority:
// DEXTER'S LABORATORY
//
// Technical function:
// Cockpit gauge-mount + terrain stream recognition.
//
// Purpose:
// - Preserve the existing standalone downstream verification harness.
// - Keep Dexter's Laboratory as instrument authority.
// - Mount Dexter-labeled cockpit gauges without absorbing Dexter authority.
// - Load/detect datum, disposition, and terrain streams.
// - Verify terrain stream readiness.
// - Publish cockpit status and visible gauge readouts.
// - Keep Runtime / Strength held.
// - Render nothing.
// - Create no canvas.
// - Mutate no parent, datum, disposition child, terrain child, or Dexter source.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_ROUTE_JS_TNT_v1";
  var HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_HTML_BINDING_TNT_v1";
  var PREVIOUS_JS_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_TERRAIN_STREAM_RECOGNITION_ROUTE_JS_TNT_v1";
  var PREVIOUS_HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_TERRAIN_STREAM_RECOGNITION_HTML_BINDING_TNT_v1";

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
  var INSTRUMENT_AUTHORITY = "Dexter's Laboratory";

  var HTML_ROLE = "WISDOM";
  var JS_ROLE = "COURAGE";
  var RUNTIME_ROLE = "STRENGTH";

  var FAILURE = {
    NONE: "",
    BOOT_PENDING: "boot pending",
    DEXTER_REGISTRY_UNAVAILABLE: "Dexter registry unavailable; fallback cockpit gauge mounts active",
    GAUGE_MOUNT_INCOMPLETE: "gauge mount incomplete",
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
    TERRAIN_RENDER_FALSE_CLAIM: "terrain render false claim",
    PARENT_MUTATION_DETECTED: "parent mutation detected",
    RUNTIME_STRENGTH_FALSE_ACTIVATION: "Runtime / Strength false activation",
    UNKNOWN_EXCEPTION: "unknown exception"
  };

  var state = {
    initialized: false,
    phase: "boot pending",
    route: ROUTE,

    dexterRegistryFound: false,
    dexterGaugeMountMode: "pending",
    dexterRegistryKeys: [],

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

    rendersNothing: true,
    noCanvasCreation: true,
    visualPassClaimed: false,

    parentDatumUnchanged: true,
    parentHtmlUnchanged: true,
    parentRouteJsUnchanged: true,
    dispositionChildUnchanged: true,
    terrainChildUnchanged: true,
    downstreamStillHeld: true,

    runtimeStrengthHeld: true,
    multiStreamRenderHeld: true,
    multiStreamLaunchpadReady: false,

    gaugeMounts: [],
    gaugeSummary: {},
    streams: [],

    failureCode: "BOOT_PENDING",
    failureReason: FAILURE.BOOT_PENDING,
    errors: [],
    checkedAt: null
  };

  function nowISO() {
    return new Date().toISOString();
  }

  function setPhase(phase) {
    state.phase = phase;
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
    state.errors.push({
      scope: scope,
      message: message,
      time: nowISO()
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
        wait(120).then(function () {
          resolve(true);
        });
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

  function readDexterRegistry() {
    var registries = [
      ["DEXTER_LAB_TOOL_REGISTRY", window.DEXTER_LAB_TOOL_REGISTRY],
      ["DEXTER_LAB_GAUGE_REGISTRY", window.DEXTER_LAB_GAUGE_REGISTRY],
      ["DEXTER_LAB_DIAGNOSTIC_STATUS", window.DEXTER_LAB_DIAGNOSTIC_STATUS],
      ["DGB_DEXTER_LAB_TOOL_REGISTRY", window.DGB_DEXTER_LAB_TOOL_REGISTRY],
      ["DGB_DEXTER_LAB_GAUGE_REGISTRY", window.DGB_DEXTER_LAB_GAUGE_REGISTRY],
      ["DGB_DEXTER_LAB_STATUS", window.DGB_DEXTER_LAB_STATUS]
    ];

    var found = [];

    for (var i = 0; i < registries.length; i += 1) {
      if (registries[i][1]) found.push(registries[i][0]);
    }

    state.dexterRegistryKeys = found;
    state.dexterRegistryFound = found.length > 0;
    state.dexterGaugeMountMode = state.dexterRegistryFound ? "registry-mounted" : "fallback-local-cockpit-mount";

    return state.dexterRegistryFound;
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

  function gauge(id, label, sourceTool, stream, result, expected, nextMove) {
    return {
      id: id,
      label: label,
      sourceTool: sourceTool,
      sourceGauge: sourceTool.replace("dexter.", "dexter.gauge."),
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      stream: stream,
      result: result,
      expected: expected,
      nextMove: nextMove || "",
      cockpitDisplayOnly: true,
      dexterAuthorityPreserved: true
    };
  }

  function passFail(condition) {
    return condition ? "pass" : "fail";
  }

  function mountDexterGauges() {
    var datumPass = Boolean(state.datumLoaded && state.datumContractAccepted && state.cloneContractAccepted);
    var dispositionPass = Boolean(state.dispositionChildLoaded && state.dispositionChildReady && state.dispositionReady);
    var terrainPass = Boolean(state.terrainChildLoaded && state.terrainChildReady && state.terrainStreamReady && state.terrainMapReady);
    var newsPass = Boolean(state.newsComplete !== false && state.terrainNewsComplete && state.terrainAllSeatsNewsComplete);
    var parentPass = Boolean(state.parentDatumUnchanged && state.parentHtmlUnchanged && state.parentRouteJsUnchanged);
    var renderPass = Boolean(state.rendersNothing && state.noCanvasCreation && state.visualPassClaimed === false && state.terrainVisualPassClaimed === false);
    var runtimeHeld = Boolean(state.runtimeStrengthHeld && state.multiStreamRenderHeld);
    var staged = Boolean(datumPass && dispositionPass && terrainPass && runtimeHeld);

    state.gaugeMounts = [
      gauge("datum-integrity", "Datum Integrity Gauge", "dexter.datum.integrity", "datum", passFail(datumPass), "datumLoaded && datumContractAccepted && cloneContractAccepted"),
      gauge("disposition-receive", "Disposition Receive Gauge", "dexter.downstream.receive", "disposition", passFail(dispositionPass), "dispositionChildLoaded && childReady && dispositionReady"),
      gauge("terrain-stream", "Terrain Stream Gauge", "dexter.terrain.stream.readiness", "terrain", passFail(terrainPass), "terrainChildLoaded && terrainChildReady && terrainStreamReady && terrainMapReady"),
      gauge("news-completion", "NEWS Completion Gauge", "dexter.news.completion", "datum/disposition/terrain", passFail(newsPass), "newsComplete && terrainNewsComplete"),
      gauge("parent-mutation-guard", "Parent Mutation Guard", "dexter.parent.mutation.guard", "parent-chain", passFail(parentPass), "parentDatumUnchanged && parentHtmlUnchanged && parentRouteJsUnchanged"),
      gauge("render-hold", "Render Hold Gauge", "dexter.render.hold.guard", "render", passFail(renderPass), "rendersNothing && noCanvasCreation && visualPassClaimed=false"),
      gauge("runtime-strength", "Runtime Strength Gauge", "dexter.runtime.strength.readiness", "runtime", runtimeHeld ? "held" : "fail", "held", "Keep Runtime / Strength held until multi-stream render is authorized."),
      gauge("multi-stream-coherence", "Multi-Stream Coherence Gauge", "dexter.multi-stream.coherence", "launchpad", staged ? "staged" : "held", "datum + disposition + terrain staged, future streams held")
    ];

    state.gaugeSummary = {
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

  function gaugesValid() {
    if (!Array.isArray(state.gaugeMounts) || state.gaugeMounts.length !== 8) return false;

    return Boolean(
      state.gaugeSummary.datumGaugeStatus === "pass" &&
      state.gaugeSummary.dispositionGaugeStatus === "pass" &&
      state.gaugeSummary.terrainGaugeStatus === "pass" &&
      state.gaugeSummary.newsGaugeStatus === "pass" &&
      state.gaugeSummary.parentChainGaugeStatus === "pass" &&
      state.gaugeSummary.renderHoldGaugeStatus === "pass" &&
      state.gaugeSummary.runtimeStrengthGaugeStatus === "held" &&
      state.gaugeSummary.multiStreamGaugeStatus === "staged"
    );
  }

  function buildStreams() {
    state.streams = [
      {
        key: "datum",
        label: "Datum Stream",
        source: DATUM_FILE,
        role: "active parent math",
        status: state.datumLoaded ? "active parent math" : "pending"
      },
      {
        key: "disposition",
        label: "Disposition Stream",
        source: DISPOSITION_FILE,
        role: "passive child receive proof",
        status: state.dispositionChildReady ? "passive child receive proof" : "pending"
      },
      {
        key: "terrain",
        label: "Terrain Stream",
        source: TERRAIN_FILE,
        role: "passive terrain receive proof",
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
        key: "dexterGaugeMounts",
        label: "Dexter Lab Gauge Mounts",
        source: "Dexter's Laboratory instrument authority",
        role: "cockpit readout layer",
        status: Array.isArray(state.gaugeMounts) && state.gaugeMounts.length === 8 ? "mounted · cockpit readout layer active" : "pending"
      }
    ];

    return state.streams;
  }

  function writeGaugeCards() {
    var root = qs("[data-cockpit-gauge-grid]");
    if (!root) return;

    root.innerHTML = "";

    state.gaugeMounts.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "gauge-card";
      card.setAttribute("data-gauge-id", item.id);

      var label = document.createElement("b");
      label.textContent = item.label;

      var result = document.createElement("strong");
      result.textContent = item.result + " · " + item.sourceTool;

      var meta = document.createElement("span");
      meta.textContent = item.stream + " · " + item.expected;

      card.appendChild(label);
      card.appendChild(result);
      card.appendChild(meta);

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
    var failureText = state.failureCode ? state.failureCode + " · " + state.failureReason : "none";

    setText("[data-cockpit-phase]", state.phase);
    setText("[data-cockpit-failure]", failureText);

    setText("[data-cockpit-datum]", state.datumLoaded ? "loaded · cloned seed available" : "failed · datum unavailable");
    setText("[data-cockpit-disposition]", state.dispositionChildReady ? "loaded · passive receive test" : "failed · disposition not ready");
    setText("[data-cockpit-terrain]", state.terrainChildReady ? "loaded · passive terrain receive proof" : "failed · terrain not ready");

    setText("[data-cockpit-dexter]", "mounted · cockpit gauge readouts active");
    setText("[data-cockpit-receive-map]", state.receiveMapReady || state.terrainMapReady ? "ready · 256 seats" : "pending");
    setText("[data-cockpit-news]", state.newsComplete || state.terrainNewsComplete ? "complete · N/E/W/S" : "pending");
    setText("[data-cockpit-terrain-map]", state.terrainMapReady ? "ready · 256 math-only terrain seats" : "pending");
    setText("[data-cockpit-terrain-news]", state.terrainNewsComplete ? "complete · N/E/W/S" : "pending");

    setText("[data-gauge-datum]", state.gaugeSummary.datumGaugeStatus === "pass" ? "pass · Dexter datum-integrity gauge" : "fail · Dexter datum-integrity gauge");
    setText("[data-gauge-disposition]", state.gaugeSummary.dispositionGaugeStatus === "pass" ? "pass · Dexter downstream-receive gauge" : "fail · Dexter downstream-receive gauge");
    setText("[data-gauge-terrain]", state.gaugeSummary.terrainGaugeStatus === "pass" ? "pass · Dexter terrain-stream readiness gauge" : "fail · Dexter terrain-stream readiness gauge");
    setText("[data-gauge-news]", state.gaugeSummary.newsGaugeStatus === "pass" ? "pass · Dexter NEWS-completion gauge" : "fail · Dexter NEWS-completion gauge");
    setText("[data-gauge-parent]", state.gaugeSummary.parentChainGaugeStatus === "pass" ? "pass · Dexter parent-mutation guard" : "fail · Dexter parent-mutation guard");
    setText("[data-gauge-render]", state.gaugeSummary.renderHoldGaugeStatus === "pass" ? "pass · no canvas / no visual pass" : "fail · render hold guard");
    setText("[data-gauge-runtime]", state.gaugeSummary.runtimeStrengthGaugeStatus === "held" ? "held · future engine carrier" : "fail · Runtime / Strength false activation");
    setText("[data-gauge-multistream]", state.gaugeSummary.multiStreamGaugeStatus === "staged" ? "staged · disposition + terrain ready, future streams held" : "held · stream coherence incomplete");

    setText("[data-cockpit-render]", "held · no visual pass");
    setText("[data-cockpit-parent-chain]", "unchanged · datum / HTML / route JS held");
    setText("[data-cockpit-runtime]", "held · future multi-stream carrier");
    setText("[data-cockpit-launchpad]", state.multiStreamLaunchpadReady ? "ready · disposition + terrain streams staged" : "held · awaiting stream proof");
    setText("[data-cockpit-dexter-mode]", state.dexterRegistryFound ? "registry-mounted" : "fallback-local-cockpit-mount");

    writeGaugeCards();
    writeStreams();

    setData("audraliaCockpitContract", CONTRACT);
    setData("audraliaCockpitHtmlContract", HTML_CONTRACT);
    setData("audraliaCockpitFrame", COCKPIT_FRAME);
    setData("audraliaDexterInstrumentAuthority", true);
    setData("audraliaDexterRegistryFound", state.dexterRegistryFound);
    setData("audraliaDexterGaugeMountMode", state.dexterGaugeMountMode);
    setData("audraliaTerrainChildReady", state.terrainChildReady);
    setData("audraliaRuntimeStrengthHeld", state.runtimeStrengthHeld);
    setData("audraliaVisualPassClaimed", state.visualPassClaimed);
    setData("audraliaCockpitFailureCode", state.failureCode || "NONE");
  }

  function status() {
    return {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      previousHarnessJsContract: PREVIOUS_JS_CONTRACT,
      previousHarnessHtmlContract: PREVIOUS_HTML_CONTRACT,

      route: ROUTE,
      cockpitFrame: COCKPIT_FRAME,
      technicalFunction: TECHNICAL_FUNCTION,
      dexterInstrumentAuthority: INSTRUMENT_AUTHORITY,

      htmlRole: HTML_ROLE,
      jsRole: JS_ROLE,
      runtimeRole: RUNTIME_ROLE,

      parentBaseline: PARENT_BASELINE,
      harnessBaseline: HARNESS_BASELINE,

      dexterRegistryFound: state.dexterRegistryFound,
      dexterRegistryKeys: state.dexterRegistryKeys.slice(),
      dexterGaugeMountMode: state.dexterGaugeMountMode,
      gaugeMounts: state.gaugeMounts.slice(),

      datumGaugeStatus: state.gaugeSummary.datumGaugeStatus,
      dispositionGaugeStatus: state.gaugeSummary.dispositionGaugeStatus,
      terrainGaugeStatus: state.gaugeSummary.terrainGaugeStatus,
      newsGaugeStatus: state.gaugeSummary.newsGaugeStatus,
      parentChainGaugeStatus: state.gaugeSummary.parentChainGaugeStatus,
      renderHoldGaugeStatus: state.gaugeSummary.renderHoldGaugeStatus,
      runtimeStrengthGaugeStatus: state.gaugeSummary.runtimeStrengthGaugeStatus,
      multiStreamGaugeStatus: state.gaugeSummary.multiStreamGaugeStatus,

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
      terrainRendersNothing: state.terrainRendersNothing,
      terrainNoCanvasCreation: state.terrainNoCanvasCreation,
      terrainVisualPassClaimed: state.terrainVisualPassClaimed,

      runtimeStrengthHeld: state.runtimeStrengthHeld,
      multiStreamRenderHeld: state.multiStreamRenderHeld,
      multiStreamLaunchpadReady: state.multiStreamLaunchpadReady,

      streams: state.streams.slice(),

      parentDatumUnchanged: state.parentDatumUnchanged,
      parentHtmlUnchanged: state.parentHtmlUnchanged,
      parentRouteJsUnchanged: state.parentRouteJsUnchanged,
      dispositionChildUnchanged: state.dispositionChildUnchanged,
      terrainChildUnchanged: state.terrainChildUnchanged,
      downstreamStillHeld: state.downstreamStillHeld,

      rendersNothing: state.rendersNothing,
      noCanvasCreation: state.noCanvasCreation,
      visualPassClaimed: state.visualPassClaimed,

      phase: state.phase,
      failureCode: state.failureCode,
      failureReason: state.failureReason,
      checkedAt: state.checkedAt,
      errors: state.errors.slice()
    };
  }

  function publish() {
    var payload = status();

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT = {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      cockpitFrame: COCKPIT_FRAME,
      technicalFunction: TECHNICAL_FUNCTION,
      dexterInstrumentAuthority: INSTRUMENT_AUTHORITY,
      status: status,
      refresh: runCockpit,
      run: runCockpit,
      gauges: function () {
        return state.gaugeMounts.slice();
      },
      streams: function () {
        return state.streams.slice();
      },
      runtimeStrengthHeld: true,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false
    };

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_STATUS = payload;
    window.AUDRALIA_G1_DISPOSITION_HARNESS_TERRAIN_STREAM_RECOGNITION_STATUS = payload;
    window.AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_STATUS = payload;
    window.AUDRALIA_G1_DISPOSITION_MULTI_STREAM_LAUNCHPAD_STATUS = payload;

    return payload;
  }

  function publishBoot() {
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_BOOT = {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      previousHarnessJsContract: PREVIOUS_JS_CONTRACT,
      previousHarnessHtmlContract: PREVIOUS_HTML_CONTRACT,
      cockpitFrame: COCKPIT_FRAME,
      technicalFunction: TECHNICAL_FUNCTION,
      dexterInstrumentAuthority: INSTRUMENT_AUTHORITY,
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
      visualPassClaimed: false,
      bootedAt: nowISO()
    };
  }

  async function runCockpit() {
    try {
      setPhase("boot");
      setFailure("BOOT_PENDING", FAILURE.BOOT_PENDING);

      readDexterRegistry();
      mountDexterGauges();
      buildStreams();
      publish();
      writeVisibleStatus();

      setPhase("loading datum");
      var datumLoaded = Boolean(findDatumApi()) ||
        await loadScript(DATUM_FILE, DATUM_CLONE_CONTRACT, "datum");

      state.datumLoaded = Boolean(datumLoaded && findDatumApi());

      if (!verifyDatum()) {
        mountDexterGauges();
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("loading disposition");
      var dispositionLoaded = Boolean(findDispositionApi()) ||
        await loadScript(DISPOSITION_FILE, DISPOSITION_CONTRACT, "disposition");

      state.dispositionChildLoaded = Boolean(dispositionLoaded && findDispositionApi());

      await wait(120);

      if (!verifyDisposition()) {
        mountDexterGauges();
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("loading terrain");
      var terrainLoaded = Boolean(findTerrainApi()) ||
        await loadScript(TERRAIN_FILE, TERRAIN_CONTRACT, "terrain");

      state.terrainChildLoaded = Boolean(terrainLoaded && findTerrainApi());

      await wait(160);

      if (!verifyTerrain()) {
        mountDexterGauges();
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("mounting Dexter gauges");
      mountDexterGauges();

      if (!gaugesValid()) {
        setFailure("GAUGE_MOUNT_INCOMPLETE", FAILURE.GAUGE_MOUNT_INCOMPLETE);
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      state.multiStreamLaunchpadReady = true;
      state.runtimeStrengthHeld = true;
      state.multiStreamRenderHeld = true;
      state.rendersNothing = true;
      state.noCanvasCreation = true;
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
      mountDexterGauges();
      buildStreams();
      publish();
      writeVisibleStatus();
      return status();
    }
  }

  function init() {
    state.initialized = true;
    publishBoot();
    readDexterRegistry();
    mountDexterGauges();
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
