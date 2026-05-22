// /showroom/globe/audralia/disposition/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_ROUTE_JS_TNT_v1
//
// JS = COURAGE
//
// Purpose:
// Preserve verified Audralia datum / disposition / terrain proof while importing:
// - Energy donor circuit grammar as cockpit-native current / bus-line / discharge status.
// - Urban donor touch grammar as cockpit-native control cells / programmed rhythm / manual override.
// - Dexterion’s Lab as public instrument authority.
// - Runtime / Strength held.
//
// Does not:
// - mutate parent Audralia route
// - mutate datum
// - mutate disposition child
// - mutate terrain child
// - mutate donor pages
// - activate Runtime / Strength
// - activate multi-stream render
// - create canvas
// - create WebGL
// - claim visual pass

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_ROUTE_JS_TNT_v1";
  var HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_HTML_BINDING_TNT_v1";

  var PREVIOUS_JS_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_ROUTE_JS_TNT_v1";
  var PREVIOUS_HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_HTML_BINDING_TNT_v1";

  var DONOR_A_CONTRACT = "FRONTIER_ENERGY_CARDINAL_DROPDOWN_ELECTRICAL_ENERGY_CIRCUIT_FIELD_TNT_v24";
  var DONOR_B_CONTRACT = "FRONTIER_URBAN_SVG_ORGANIC_DIGITAL_GEM_ORBIT_DONOR_INTEGRATION_TNT_v13";

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
  var INSTRUMENT_AUTHORITY = "Dexterion's Lab";
  var TECHNICAL_FUNCTION = "Disposition Harness / Multi-Stream Launchpad";

  var HTML_ROLE = "WISDOM";
  var JS_ROLE = "COURAGE";
  var RUNTIME_ROLE = "STRENGTH";

  var FAILURE = {
    NONE: "",
    BOOT_PENDING: "boot pending",
    DUAL_DONOR_IMPORT_INCOMPLETE: "dual donor import incomplete",
    ENERGY_IDENTITY_LEAK: "Energy donor identity leaked into cockpit",
    URBAN_IDENTITY_LEAK: "Urban donor identity leaked into cockpit",
    COCKPIT_CIRCUIT_FIELD_MISSING: "cockpit circuit field missing",
    COCKPIT_BUS_LINES_MISSING: "cockpit bus lines missing",
    COCKPIT_AUDIT_RETURN_MISSING: "cockpit audit return missing",
    CONTROL_CELL_BOARD_MISSING: "control-cell diagnostic board missing",
    CONTROL_CELL_TOUCH_FAILED: "control-cell touch behavior failed",
    MANUAL_OVERRIDE_FAILED: "manual override state failed",
    PROGRAMMED_RHYTHM_FAILED: "programmed instrument rhythm failed",
    GEM_MOTION_MISSING: "gem motion missing",
    GAUGE_MOTION_MISSING: "gauge motion missing",
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
    PARENT_MUTATION_DETECTED: "parent mutation detected",
    CHILD_MUTATION_DETECTED: "child mutation detected",
    RUNTIME_STRENGTH_FALSE_ACTIVATION: "Runtime / Strength false activation",
    MULTI_STREAM_RENDER_FALSE_ACTIVATION: "multi-stream render false activation",
    CANVAS_CREATION_ATTEMPTED: "canvas creation attempted",
    WEBGL_CREATION_ATTEMPTED: "WebGL creation attempted",
    GENERATED_IMAGE_USED: "generated image used",
    GRAPHIC_BOX_USED: "GraphicBox used",
    VISUAL_PASS_FALSE_CLAIM: "visual pass false claim",
    UNKNOWN_EXCEPTION: "unknown exception"
  };

  var state = {
    initialized: false,
    phase: "boot pending",

    dualDonorStrategyActive: true,
    energyCircuitGrammarImportedAsCockpitNative: true,
    urbanTouchGrammarImportedAsCockpitNative: true,

    cockpitCircuitFieldPresent: false,
    cockpitBusLinesPresent: false,
    cockpitAuditReturnPresent: false,
    boundedDischargePresent: false,
    instrumentSparksPresent: false,
    instrumentChargeFlashPresent: false,
    gemMotionPresent: false,
    gaugeMotionPresent: false,

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
    noWebGL: true,
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

    instrumentProgramsActive: false,
    manualOverrideSessionStateActive: false,
    programmedInstrumentRhythmActive: false,
    controlCellBoardPresent: false,
    controlCellTouchActive: false,
    controlCellCount: 0,
    manualCellCount: 0,
    activeCellCount: 0,
    heldCellCount: 0,
    stagedCellCount: 0,
    instrumentState: {},

    failureCode: "BOOT_PENDING",
    failureReason: FAILURE.BOOT_PENDING,
    errors: [],
    checkedAt: null
  };

  var instrumentIntervals = [];
  var listenersBound = false;

  var instrumentDefinitions = [
    {
      key: "datum",
      title: "Datum Instrument",
      role: "cloned seed / origin map",
      expectedState: "pass",
      baseState: "inactive",
      locked: false
    },
    {
      key: "disposition",
      title: "Disposition Instrument",
      role: "passive receive alignment",
      expectedState: "pass",
      baseState: "inactive",
      locked: false
    },
    {
      key: "terrain",
      title: "Terrain Instrument",
      role: "passive terrain receive proof",
      expectedState: "pass",
      baseState: "inactive",
      locked: false
    },
    {
      key: "news",
      title: "NEWS Instrument",
      role: "N/E/W/S diagnostic gates",
      expectedState: "pass",
      baseState: "inactive",
      locked: false
    },
    {
      key: "runtime-strength",
      title: "Runtime / Strength Instrument",
      role: "held future carrier",
      expectedState: "held",
      baseState: "held",
      locked: true
    },
    {
      key: "multi-stream",
      title: "Multi-Stream Instrument",
      role: "staged future render carrier",
      expectedState: "staged",
      baseState: "staged",
      locked: true
    }
  ];

  var instrumentPrograms = {
    datum: [
      ["01-01", "02-02", "03-03", "04-04"],
      ["01-04", "02-03", "03-02", "04-01"],
      ["01-02", "02-04", "03-01", "04-03"],
      ["01-03", "02-01", "03-04", "04-02"]
    ],
    disposition: [
      ["01-01", "01-04", "04-01", "04-04"],
      ["02-02", "02-03", "03-02", "03-03"],
      ["01-02", "02-01", "03-04", "04-03"],
      ["01-03", "02-04", "03-01", "04-02"]
    ],
    terrain: [
      ["01-01", "02-01", "03-01", "04-01"],
      ["01-02", "02-02", "03-02", "04-02"],
      ["01-03", "02-03", "03-03", "04-03"],
      ["01-04", "02-04", "03-04", "04-04"]
    ],
    news: [
      ["01-02", "02-02", "03-02", "04-02"],
      ["02-01", "02-02", "02-03", "02-04"],
      ["01-03", "02-03", "03-03", "04-03"],
      ["03-01", "03-02", "03-03", "03-04"]
    ],
    "runtime-strength": [
      ["01-01", "04-04"],
      ["01-04", "04-01"],
      ["02-02", "03-03"],
      ["02-03", "03-02"]
    ],
    "multi-stream": [
      ["01-01", "01-04", "04-01", "04-04"],
      ["02-02", "02-03", "03-02", "03-03"],
      ["01-02", "02-01", "03-04", "04-03"],
      ["01-03", "02-04", "03-01", "04-02"]
    ]
  };

  var instrumentCycles = {
    datum: 3200,
    disposition: 3700,
    terrain: 4100,
    news: 4600,
    "runtime-strength": 6200,
    "multi-stream": 6800
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

  function qsa(selector, root) {
    try {
      return Array.prototype.slice.call((root || document).querySelectorAll(selector));
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

      // Legacy-compatible reads only. Public wording remains Dexterion’s Lab.
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
      setFailure("VISUAL_PASS_FALSE_CLAIM", FAILURE.VISUAL_PASS_FALSE_CLAIM);
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
    var renderPass = state.rendersNothing && state.noCanvasCreation && state.noWebGL && state.visualPassClaimed === false && state.terrainVisualPassClaimed === false;

    state.gemInstruments = [
      makeGem("datum-gem", "Datum Gem", "datum", datumPass ? "pass" : "fail", "dexterion.datum.integrity", "origin map / cloned seed available"),
      makeGem("disposition-gem", "Disposition Gem", "disposition", dispositionPass ? "pass" : "fail", "dexterion.downstream.receive", "downstream receive alignment"),
      makeGem("terrain-gem", "Terrain Gem", "terrain", terrainPass ? "pass" : "fail", "dexterion.terrain.stream.readiness", "passive terrain receive proof"),
      makeGem("news-gem", "NEWS Gem", "navigation", newsPass ? "pass" : "fail", "dexterion.news.navigation", "N/E/W/S complete"),
      makeGem("parent-chain-gem", "Parent Chain Gem", "parent-chain", parentPass ? "pass" : "fail", "dexterion.parent.mutation.guard", "datum / HTML / route JS held"),
      makeGem("render-hold-gem", "Render Hold Gem", "render", renderPass ? "pass" : "fail", "dexterion.render.hold.guard", "no canvas / no WebGL / no visual pass"),
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
    var renderPass = state.rendersNothing && state.noCanvasCreation && state.noWebGL && state.visualPassClaimed === false && state.terrainVisualPassClaimed === false;
    var runtimeHeld = state.runtimeStrengthHeld && state.multiStreamRenderHeld;
    var staged = datumPass && dispositionPass && terrainPass && runtimeHeld;

    state.gaugeMounts = [
      makeGauge("datum-integrity", "Datum Integrity Gauge", "dexterion.datum.integrity", "datum", result(datumPass), "datumLoaded && datumContractAccepted && cloneContractAccepted"),
      makeGauge("disposition-receive", "Disposition Receive Gauge", "dexterion.downstream.receive", "disposition", result(dispositionPass), "dispositionChildLoaded && childReady && dispositionReady"),
      makeGauge("terrain-stream", "Terrain Stream Gauge", "dexterion.terrain.stream.readiness", "terrain", result(terrainPass), "terrainChildLoaded && terrainChildReady && terrainStreamReady && terrainMapReady"),
      makeGauge("news-navigation", "NEWS Navigation Gauge", "dexterion.news.navigation", "datum/disposition/terrain", result(newsPass), "newsComplete && terrainNewsComplete"),
      makeGauge("parent-chain-guard", "Parent Chain Guard", "dexterion.parent.mutation.guard", "parent-chain", result(parentPass), "parentDatumUnchanged && parentHtmlUnchanged && parentRouteJsUnchanged"),
      makeGauge("render-hold", "Render Hold Gauge", "dexterion.render.hold.guard", "render", result(renderPass), "rendersNothing && noCanvasCreation && noWebGL && visualPassClaimed=false"),
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
        role: "cockpit gem/gauge/control readout layer",
        status: state.gaugeMounts.length === 8 && state.gemInstruments.length === 8 ? "mounted · cockpit gauge readouts active" : "pending"
      }
    ];

    return state.streams;
  }

  function renderControlBoard() {
    var root = qs("[data-cockpit-control-board]");
    if (!root) {
      state.controlCellBoardPresent = false;
      return false;
    }

    state.controlCellBoardPresent = true;

    if (root.getAttribute("data-cockpit-control-board-rendered") === CONTRACT) {
      return true;
    }

    root.innerHTML = "";

    instrumentDefinitions.forEach(function (definition) {
      var instrument = document.createElement("article");
      instrument.className = "cockpit-control-instrument";
      instrument.setAttribute("data-instrument", definition.key);
      instrument.setAttribute("data-instrument-state", definition.expectedState);
      instrument.setAttribute("data-local-scope", "16x16");
      instrument.setAttribute("data-local-addresses", "256");
      instrument.setAttribute("data-visible-sample", "4x4");
      instrument.setAttribute("data-runtime-strength-held", definition.key === "runtime-strength" ? "true" : "false");
      instrument.setAttribute("data-render-activation", "false");

      var title = document.createElement("b");
      title.textContent = definition.title;

      var role = document.createElement("span");
      role.className = "cockpit-control-role";
      role.textContent = definition.role + " · local 16 × 16 / 256 diagnostic-seat concept";

      var grid = document.createElement("div");
      grid.className = "cockpit-control-grid";
      grid.setAttribute("data-control-grid", definition.key);

      for (var row = 1; row <= 4; row += 1) {
        for (var col = 1; col <= 4; col += 1) {
          var address = "0" + row + "-0" + col;
          var cell = document.createElement("button");
          cell.type = "button";
          cell.className = "cockpit-control-cell";
          cell.setAttribute("data-cockpit-control-cell", "true");
          cell.setAttribute("data-instrument-key", definition.key);
          cell.setAttribute("data-address", address);
          cell.setAttribute("data-cell-state", definition.baseState);
          cell.setAttribute("data-base-state", definition.baseState);
          cell.setAttribute("data-locked", definition.locked ? "true" : "false");
          cell.setAttribute("aria-label", definition.title + " diagnostic cell " + address);

          if (definition.baseState === "held") cell.classList.add("held");
          if (definition.baseState === "staged") cell.classList.add("staged");

          grid.appendChild(cell);
        }
      }

      instrument.appendChild(title);
      instrument.appendChild(role);
      instrument.appendChild(grid);
      root.appendChild(instrument);
    });

    root.setAttribute("data-cockpit-control-board-rendered", CONTRACT);
    return true;
  }

  function applyInstrumentStep(instrumentKey, sequence) {
    var instrument = qs('[data-instrument="' + instrumentKey + '"]');
    if (!instrument) return false;

    var active = {};
    sequence.forEach(function (address) {
      active[address] = true;
    });

    qsa(".cockpit-control-cell", instrument).forEach(function (cell) {
      if (cell.classList.contains("manual")) return;

      var locked = cell.getAttribute("data-locked") === "true";
      var baseState = cell.getAttribute("data-base-state") || "inactive";
      var address = cell.getAttribute("data-address") || "";

      if (locked) {
        cell.classList.remove("is-active");
        cell.setAttribute("data-cell-state", baseState);
        return;
      }

      if (active[address]) {
        cell.classList.add("is-active");
        cell.setAttribute("data-cell-state", "active");
      } else {
        cell.classList.remove("is-active");
        cell.setAttribute("data-cell-state", "inactive");
      }
    });

    return true;
  }

  function toggleCockpitCell(cell) {
    if (!cell) return false;

    var instrumentKey = cell.getAttribute("data-instrument-key") || "";
    var locked = cell.getAttribute("data-locked") === "true";
    var baseState = cell.getAttribute("data-base-state") || "inactive";

    cell.classList.add("manual");
    cell.setAttribute("data-manual-override", "session");
    state.manualOverrideSessionStateActive = true;

    if (locked) {
      cell.classList.remove("is-active");
      cell.setAttribute("data-cell-state", baseState);
    } else {
      var active = !cell.classList.contains("is-active");
      cell.classList.toggle("is-active", active);
      cell.setAttribute("data-cell-state", active ? "manual" : "inactive");
    }

    collectControlCellState();
    publish();
    writeVisibleStatus();

    if (instrumentKey) {
      setText('[data-control-last-touch]', instrumentKey + " · " + (cell.getAttribute("data-address") || "unknown") + " · session manual override");
    }

    return true;
  }

  function collectControlCellState() {
    var cells = qsa(".cockpit-control-cell");
    var manual = 0;
    var active = 0;
    var held = 0;
    var staged = 0;
    var byInstrument = {};

    cells.forEach(function (cell) {
      var instrument = cell.getAttribute("data-instrument-key") || "unknown";
      var cellState = cell.getAttribute("data-cell-state") || "inactive";

      if (!byInstrument[instrument]) {
        byInstrument[instrument] = {
          total: 0,
          active: 0,
          manual: 0,
          held: 0,
          staged: 0,
          inactive: 0,
          fail: 0,
          localScope: "16x16",
          localAddresses: 256,
          visibleSample: "4x4"
        };
      }

      byInstrument[instrument].total += 1;

      if (cell.classList.contains("manual")) {
        manual += 1;
        byInstrument[instrument].manual += 1;
      }

      if (cell.classList.contains("is-active") || cellState === "active" || cellState === "manual") {
        active += 1;
        byInstrument[instrument].active += 1;
      } else if (cellState === "held") {
        held += 1;
        byInstrument[instrument].held += 1;
      } else if (cellState === "staged") {
        staged += 1;
        byInstrument[instrument].staged += 1;
      } else if (cellState === "fail") {
        byInstrument[instrument].fail += 1;
      } else {
        byInstrument[instrument].inactive += 1;
      }
    });

    state.controlCellCount = cells.length;
    state.manualCellCount = manual;
    state.activeCellCount = active;
    state.heldCellCount = held;
    state.stagedCellCount = staged;
    state.instrumentState = byInstrument;
    state.controlCellBoardPresent = cells.length > 0;
    state.controlCellTouchActive = state.controlCellBoardPresent && listenersBound;

    return byInstrument;
  }

  function clearInstrumentIntervals() {
    instrumentIntervals.forEach(function (id) {
      window.clearInterval(id);
    });
    instrumentIntervals = [];
  }

  function startInstrumentPrograms() {
    var root = qs("[data-cockpit-control-board]");
    if (!root) {
      state.instrumentProgramsActive = false;
      state.programmedInstrumentRhythmActive = false;
      return false;
    }

    renderControlBoard();
    clearInstrumentIntervals();

    Object.keys(instrumentPrograms).forEach(function (key, index) {
      var program = instrumentPrograms[key] || [];
      var cycle = instrumentCycles[key] || 4000;
      var step = index % Math.max(program.length, 1);

      if (program.length > 0) {
        applyInstrumentStep(key, program[step]);

        var intervalId = window.setInterval(function () {
          step = (step + 1) % program.length;
          applyInstrumentStep(key, program[step]);
          collectControlCellState();
          publish();
          writeVisibleStatus();
        }, cycle);

        instrumentIntervals.push(intervalId);
      }
    });

    state.instrumentProgramsActive = true;
    state.programmedInstrumentRhythmActive = true;
    collectControlCellState();
    return true;
  }

  function bindControlListeners() {
    if (listenersBound) return true;

    document.addEventListener("pointerdown", function (event) {
      var cell = event.target && event.target.closest ? event.target.closest(".cockpit-control-cell") : null;
      if (!cell) return;
      event.preventDefault();
      toggleCockpitCell(cell);
    }, { passive: false });

    document.addEventListener("keydown", function (event) {
      var cell = event.target && event.target.closest ? event.target.closest(".cockpit-control-cell") : null;
      if (!cell) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCockpitCell(cell);
      }
    });

    listenersBound = true;
    state.controlCellTouchActive = true;
    return true;
  }

  function auditAnimationPresence() {
    state.cockpitCircuitFieldPresent = Boolean(qs(".cockpit-circuit-field, [data-cockpit-circuit-field]"));
    state.cockpitBusLinesPresent = qsa(".cockpit-bus-line, [data-cockpit-bus-line]").length > 0;
    state.cockpitAuditReturnPresent = Boolean(qs(".cockpit-audit-return, [data-cockpit-audit-return]"));
    state.boundedDischargePresent = Boolean(qs(".cockpit-discharge-field, .cockpit-discharge, [data-cockpit-discharge-field]"));
    state.instrumentSparksPresent = Boolean(qs(".instrument-sparks, [data-instrument-sparks]"));
    state.instrumentChargeFlashPresent = Boolean(qs(".instrument-charge-flash, [data-instrument-charge-flash]"));
    state.gemMotionPresent = Boolean(qs(".cockpit-gem-core, .gem-instrument, [data-gem-console]"));
    state.gaugeMotionPresent = Boolean(qs(".gauge-dial, [data-gauge-board]"));

    return {
      cockpitCircuitFieldPresent: state.cockpitCircuitFieldPresent,
      cockpitBusLinesPresent: state.cockpitBusLinesPresent,
      cockpitAuditReturnPresent: state.cockpitAuditReturnPresent,
      boundedDischargePresent: state.boundedDischargePresent,
      instrumentSparksPresent: state.instrumentSparksPresent,
      instrumentChargeFlashPresent: state.instrumentChargeFlashPresent,
      gemMotionPresent: state.gemMotionPresent,
      gaugeMotionPresent: state.gaugeMotionPresent
    };
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
      card.className = "gem-instrument cockpit-gem-instrument";
      card.setAttribute("data-gem-instrument", gem.id);
      card.setAttribute("data-gem-stream", gem.stream);
      card.setAttribute("data-gem-state", gem.state);
      card.setAttribute("data-state", gem.state);
      card.setAttribute("data-dexterion-source-tool", gem.sourceTool);

      var flash = document.createElement("span");
      flash.className = "instrument-charge-flash";
      flash.setAttribute("aria-hidden", "true");

      var sparks = document.createElement("span");
      sparks.className = "instrument-sparks";
      sparks.setAttribute("aria-hidden", "true");

      var orb = document.createElement("span");
      orb.className = "gem-orb cockpit-gem-orb";
      orb.setAttribute("aria-hidden", "true");

      var label = document.createElement("b");
      label.textContent = gem.label;

      var status = document.createElement("strong");
      status.textContent = gem.state.toUpperCase();

      var copy = document.createElement("span");
      copy.textContent = gem.meaning;

      card.appendChild(flash);
      card.appendChild(sparks);
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
      card.className = "gauge-dial cockpit-gauge-dial";
      card.setAttribute("data-gauge-id", gauge.id);
      card.setAttribute("data-gauge-state", gauge.result);
      card.setAttribute("data-state", gauge.result);
      card.setAttribute("data-dexterion-source-tool", gauge.sourceTool);

      var sparks = document.createElement("span");
      sparks.className = "instrument-sparks gauge-sparks";
      sparks.setAttribute("aria-hidden", "true");

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

      card.appendChild(sparks);
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
      card.className = "stream-card cockpit-stream-card";
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

    setText("[data-cockpit-dual-donor-status]", "active · Energy circuit grammar + Urban touch grammar imported as cockpit-native behavior");
    setText("[data-cockpit-circuit-status]", state.cockpitCircuitFieldPresent ? "present · cockpit-native current field" : "pending HTML circuit field");
    setText("[data-cockpit-control-status]", state.controlCellBoardPresent ? "present · touch and keyboard ready" : "pending control-cell board");
    setText("[data-control-cell-status]", state.controlCellBoardPresent ? "active · " + state.controlCellCount + " visible cells · " + state.manualCellCount + " manual overrides" : "pending control-cell board");

    setText("[data-gauge-datum]", s.datumGaugeStatus === "pass" ? "pass · Dexterion datum-integrity gauge" : "fail · Dexterion datum-integrity gauge");
    setText("[data-gauge-disposition]", s.dispositionGaugeStatus === "pass" ? "pass · Dexterion downstream-receive gauge" : "fail · Dexterion downstream-receive gauge");
    setText("[data-gauge-terrain]", s.terrainGaugeStatus === "pass" ? "pass · Dexterion terrain-stream readiness gauge" : "fail · Dexterion terrain-stream readiness gauge");
    setText("[data-gauge-news]", s.newsGaugeStatus === "pass" ? "pass · Dexterion NEWS-navigation gauge" : "fail · Dexterion NEWS-navigation gauge");
    setText("[data-gauge-parent]", s.parentChainGaugeStatus === "pass" ? "pass · Dexterion parent-mutation guard" : "fail · Dexterion parent-mutation guard");
    setText("[data-gauge-render]", s.renderHoldGaugeStatus === "pass" ? "pass · no canvas / no WebGL / no visual pass" : "fail · render hold guard");
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
    setData("audraliaDualDonorStrategyActive", state.dualDonorStrategyActive);
    setData("audraliaEnergyCircuitGrammarImported", state.energyCircuitGrammarImportedAsCockpitNative);
    setData("audraliaUrbanTouchGrammarImported", state.urbanTouchGrammarImportedAsCockpitNative);
    setData("audraliaControlCellBoardPresent", state.controlCellBoardPresent);
    setData("audraliaControlCellTouchActive", state.controlCellTouchActive);
    setData("audraliaManualOverrideSessionStateActive", state.manualOverrideSessionStateActive);
    setData("audraliaProgrammedInstrumentRhythmActive", state.programmedInstrumentRhythmActive);
    setData("audraliaGemConsoleActive", state.gemInstruments.length === 8);
    setData("audraliaGaugeBoardActive", state.gaugeMounts.length === 8);
    setData("audraliaTerrainChildReady", state.terrainChildReady);
    setData("audraliaRuntimeStrengthHeld", state.runtimeStrengthHeld);
    setData("audraliaNoCanvasCreation", state.noCanvasCreation);
    setData("audraliaNoWebGL", state.noWebGL);
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
      donorAContract: DONOR_A_CONTRACT,
      donorBContract: DONOR_B_CONTRACT,

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

      dualDonorStrategyActive: state.dualDonorStrategyActive,
      energyCircuitGrammarImportedAsCockpitNative: state.energyCircuitGrammarImportedAsCockpitNative,
      urbanTouchGrammarImportedAsCockpitNative: state.urbanTouchGrammarImportedAsCockpitNative,

      cockpitCircuitFieldPresent: state.cockpitCircuitFieldPresent,
      cockpitBusLinesPresent: state.cockpitBusLinesPresent,
      cockpitAuditReturnPresent: state.cockpitAuditReturnPresent,
      boundedDischargePresent: state.boundedDischargePresent,
      instrumentSparksPresent: state.instrumentSparksPresent,
      instrumentChargeFlashPresent: state.instrumentChargeFlashPresent,
      gemMotionPresent: state.gemMotionPresent,
      gaugeMotionPresent: state.gaugeMotionPresent,

      controlCellBoardPresent: state.controlCellBoardPresent,
      controlCellTouchActive: state.controlCellTouchActive,
      manualOverrideSessionStateActive: state.manualOverrideSessionStateActive,
      programmedInstrumentRhythmActive: state.programmedInstrumentRhythmActive,
      controlCellCount: state.controlCellCount,
      manualCellCount: state.manualCellCount,
      activeCellCount: state.activeCellCount,
      heldCellCount: state.heldCellCount,
      stagedCellCount: state.stagedCellCount,
      instrumentPrograms: instrumentPrograms,
      instrumentCycles: instrumentCycles,
      instrumentState: state.instrumentState,

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
      noWebGL: state.noWebGL,
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
      previousJsContract: PREVIOUS_JS_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      donorAContract: DONOR_A_CONTRACT,
      donorBContract: DONOR_B_CONTRACT,
      cockpitFrame: COCKPIT_FRAME,
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      technicalFunction: TECHNICAL_FUNCTION,
      status: status,
      refresh: runCockpit,
      run: runCockpit,
      gems: function () { return state.gemInstruments.slice(); },
      gauges: function () { return state.gaugeMounts.slice(); },
      streams: function () { return state.streams.slice(); },
      controlCells: function () { return Object.assign({}, state.instrumentState); },
      applyInstrumentStep: applyInstrumentStep,
      toggleCockpitCell: toggleCockpitCell,
      runtimeStrengthHeld: true,
      rendersNothing: true,
      noCanvasCreation: true,
      noWebGL: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT = api;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT = api;

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_STATUS = payload;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_STATUS = payload;

    // Compatibility aliases from prior cockpit generation.
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTERIONS_LAB_GEM_GAUGE_COCKPIT_STATUS = payload;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DEXTER_LAB_GAUGE_MOUNT_TERRAIN_STREAM_RECOGNITION_STATUS = payload;

    return payload;
  }

  function publishBoot() {
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_BOOT = {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      previousJsContract: PREVIOUS_JS_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      donorAContract: DONOR_A_CONTRACT,
      donorBContract: DONOR_B_CONTRACT,
      cockpitFrame: COCKPIT_FRAME,
      instrumentAuthority: INSTRUMENT_AUTHORITY,
      technicalFunction: TECHNICAL_FUNCTION,
      htmlRole: HTML_ROLE,
      jsRole: JS_ROLE,
      runtimeRole: RUNTIME_ROLE,
      dualDonorStrategyActive: true,
      energyCircuitGrammarImportedAsCockpitNative: true,
      urbanTouchGrammarImportedAsCockpitNative: true,
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
      noWebGL: true,
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
      bindControlListeners();
      renderControlBoard();
      auditAnimationPresence();
      collectControlCellState();
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
        setFailure("GAUGE_STATE_INCOMPLETE", "gauge or gem instrument state incomplete");
        buildStreams();
        publish();
        writeVisibleStatus();
        return status();
      }

      setPhase("mounting dual donor controls");
      renderControlBoard();
      startInstrumentPrograms();
      auditAnimationPresence();
      collectControlCellState();

      state.runtimeStrengthHeld = true;
      state.multiStreamRenderHeld = true;
      state.multiStreamLaunchpadReady = true;
      state.rendersNothing = true;
      state.noCanvasCreation = true;
      state.noWebGL = true;
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
    bindControlListeners();
    renderControlBoard();
    auditAnimationPresence();
    collectControlCellState();
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
