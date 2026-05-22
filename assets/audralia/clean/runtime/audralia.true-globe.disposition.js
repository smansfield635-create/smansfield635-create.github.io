// /assets/audralia/clean/runtime/audralia.true-globe.disposition.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_CHILD_DISPOSITION_DATUM_RECEIVE_TEST_TNT_v1
//
// Parent baseline:
// AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE_v1
//
// Parent datum public contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1
//
// Parent datum clone contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1
//
// Purpose:
// - Create the first passive downstream child file.
// - Prove a downstream child can receive cloned datum math without renewing datum, HTML, or route JS.
// - Read the parent datum receive-map.
// - Verify 256 seats, NEWS completion, child packet access, sample access, and passive disposition readiness.
// - Publish child status globals.
// - Render nothing.
// - Create no canvas.
// - Touch no parent file.
// - Claim no terrain, moisture, surface, cloud, continent, ground-level, or visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_CHILD_DISPOSITION_DATUM_RECEIVE_TEST_TNT_v1";
  var PARENT_BASELINE = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE_v1";
  var PARENT_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var PARENT_CLONE_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var CHILD_NAME = "disposition-child";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.disposition.js";
  var FAMILY = "/assets/audralia/clean/runtime/";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;

  var FAILURE = {
    NONE: "",
    DATUM_API_MISSING: "datum API missing",
    PUBLIC_DATUM_CONTRACT_MISMATCH: "public datum contract mismatch",
    CLONE_DATUM_CONTRACT_MISMATCH: "clone datum contract mismatch",
    RECEIVE_MAP_UNAVAILABLE: "receive map unavailable",
    SEAT_COUNT_MISMATCH: "expected 256 seats",
    NEWS_INCOMPLETE: "NEWS incomplete",
    CHILD_PACKET_UNAVAILABLE: "child packet unavailable",
    SAMPLE_UNAVAILABLE: "sample unavailable",
    PARENT_MUTATION_ATTEMPTED: "parent mutation attempted",
    CANVAS_CREATION_ATTEMPTED: "canvas creation attempted",
    VISUAL_PASS_FALSE_CLAIM: "visual pass false claim",
    UNKNOWN_EXCEPTION: "unknown exception"
  };

  var state = {
    initialized: false,
    childReady: false,
    dispositionReady: false,
    datumReceived: false,
    receiveMapReady: false,
    seatCountValid: false,
    newsComplete: false,
    allSeatsNewsComplete: false,
    childPacketReceived: false,
    sampleReceived: false,
    parentDatumContractAccepted: false,
    parentCloneContractAccepted: false,
    parentDatumUnchanged: true,
    htmlUnchanged: true,
    routeJsUnchanged: true,
    downstreamStillHeld: true,
    rendersNothing: true,
    noCanvasCreation: true,
    visualPassClaimed: false,
    failureCode: "DATUM_API_MISSING",
    failureReason: FAILURE.DATUM_API_MISSING,
    attemptCount: 0,
    lastCheckedAt: null,
    parentApiSource: null,
    parentStatus: null,
    receiveMap: null,
    childPacket: null,
    sample: null,
    dispositionMap: null,
    summary: null,
    errors: []
  };

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function safeClone(value) {
    return JSON.parse(JSON.stringify(value));
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

  function findDatumApi() {
    var sources = [
      ["AUDRALIA_TRUE_GLOBE_DATUM", window.AUDRALIA_TRUE_GLOBE_DATUM],
      ["AUDRALIA_G1_TRUE_GLOBE_DATUM", window.AUDRALIA_G1_TRUE_GLOBE_DATUM],
      ["AUDRALIA_TRUE_PLANETARY_DATUM", window.AUDRALIA_TRUE_PLANETARY_DATUM],
      ["AUDRALIA_G1_TRUE_PLANETARY_DATUM", window.AUDRALIA_G1_TRUE_PLANETARY_DATUM]
    ];

    for (var i = 0; i < sources.length; i += 1) {
      if (sources[i][1]) {
        state.parentApiSource = sources[i][0];
        return sources[i][1];
      }
    }

    state.parentApiSource = null;
    return null;
  }

  function hasRequiredParentApi(api) {
    return Boolean(
      api &&
      typeof api.status === "function" &&
      (
        typeof api.receive === "function" ||
        typeof api.getReceiveMap === "function" ||
        typeof api.childReceiveMap === "function"
      ) &&
      typeof api.getChildReceivePacket === "function" &&
      typeof api.getSeat === "function" &&
      typeof api.getNews === "function" &&
      typeof api.sample === "function"
    );
  }

  function readParentStatus(api) {
    try {
      if (api && typeof api.status === "function") return api.status();
    } catch (error) {
      recordError("parent.status", error);
    }

    return window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS ||
      window.AUDRALIA_G1_TRUE_GLOBE_DATUM_STATUS ||
      null;
  }

  function readReceiveMap(api) {
    try {
      if (api && typeof api.receive === "function") return api.receive({ reference: true });
    } catch (error) {
      recordError("parent.receive", error);
    }

    try {
      if (api && typeof api.getReceiveMap === "function") return api.getReceiveMap({ reference: true });
    } catch (error2) {
      recordError("parent.getReceiveMap", error2);
    }

    try {
      if (api && typeof api.childReceiveMap === "function") return api.childReceiveMap({ reference: true });
    } catch (error3) {
      recordError("parent.childReceiveMap", error3);
    }

    return window.AUDRALIA_TRUE_GLOBE_DATUM_RECEIVE_MAP ||
      window.AUDRALIA_G1_TRUE_GLOBE_DATUM_RECEIVE_MAP ||
      null;
  }

  function readChildPacket(api) {
    try {
      if (api && typeof api.getChildReceivePacket === "function") {
        return api.getChildReceivePacket(CHILD_NAME, { compact: true });
      }
    } catch (error) {
      recordError("parent.getChildReceivePacket", error);
    }

    return null;
  }

  function readSample(api) {
    try {
      if (api && typeof api.sample === "function") return api.sample(0, 0, 0);
    } catch (error) {
      recordError("parent.sample", error);
    }

    return null;
  }

  function validateSeat(seat) {
    return Boolean(
      seat &&
      seat.newsComplete === true &&
      seat.chronologyComplete === true &&
      seat.relationshipComplete === true &&
      seat.carrierBound === true &&
      seat.renderEligible === true &&
      seat.childReceiveEligible === true &&
      seat.news &&
      seat.north &&
      seat.east &&
      seat.west &&
      seat.south
    );
  }

  function validateAllSeats(seats) {
    if (!Array.isArray(seats) || seats.length !== LATTICE_STATES) return false;

    for (var i = 0; i < seats.length; i += 1) {
      if (!validateSeat(seats[i])) return false;
    }

    return true;
  }

  function dispositionForSeat(seat) {
    var classes = [];

    if (seat.north && seat.north.defined) classes.push("origin-ready");
    if (seat.east && seat.east.defined) classes.push("formation-ready");
    if (seat.west && seat.west.defined) classes.push("correction-ready");
    if (seat.south && seat.south.defined) classes.push("grounding-ready");
    if (seat.childReceiveEligible === true) classes.push("child-receive-ready");
    if (seat.renderEligible === true) classes.push("render-eligible-math-only");

    classes.push("downstream-held");
    classes.push("no-visual-pass");

    return {
      contract: CONTRACT,
      parentBaseline: PARENT_BASELINE,
      seatIndex: seat.seatIndex,
      band: seat.band,
      radial: seat.radial,
      compassKey: seat.compassKey || null,
      hemisphere: seat.hemisphere || null,
      latitudeBand: seat.latitudeBand || null,
      radialRole: seat.radialRole || null,
      poleRelation: seat.poleRelation || null,
      equatorRelation: seat.equatorRelation || null,
      newsComplete: seat.newsComplete === true,
      childReceiveEligible: seat.childReceiveEligible === true,
      renderEligibleMathOnly: seat.renderEligible === true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      dispositionClasses: classes
    };
  }

  function buildDispositionMap(map) {
    var seats = Array.isArray(map && map.seats) ? map.seats : [];
    var dispositionSeats = [];
    var byBand = [];
    var byRadial = [];

    for (var r = 0; r < RADIAL_NODES; r += 1) {
      byRadial[r] = [];
    }

    for (var i = 0; i < seats.length; i += 1) {
      var seat = seats[i];
      var disposition = dispositionForSeat(seat);

      dispositionSeats.push(disposition);

      if (!byBand[seat.band]) byBand[seat.band] = [];
      byBand[seat.band][seat.radial] = disposition;

      if (byRadial[seat.radial]) byRadial[seat.radial].push(disposition);
    }

    return {
      contract: CONTRACT,
      parentBaseline: PARENT_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,
      dispositionReady: dispositionSeats.length === LATTICE_STATES,
      datumReceived: true,
      receiveMapReady: true,
      seatCount: dispositionSeats.length,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seats: dispositionSeats,
      bands: byBand,
      radialLanes: byRadial,
      allowedClasses: [
        "origin-ready",
        "formation-ready",
        "correction-ready",
        "grounding-ready",
        "child-receive-ready",
        "downstream-held",
        "render-eligible-math-only",
        "no-visual-pass"
      ],
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      builtAt: new Date().toISOString()
    };
  }

  function makeSummary(dispositionMap) {
    var seats = dispositionMap && Array.isArray(dispositionMap.seats) ? dispositionMap.seats : [];
    var counts = {
      originReady: 0,
      formationReady: 0,
      correctionReady: 0,
      groundingReady: 0,
      childReceiveReady: 0,
      downstreamHeld: 0,
      renderEligibleMathOnly: 0,
      noVisualPass: 0
    };

    for (var i = 0; i < seats.length; i += 1) {
      var classes = seats[i].dispositionClasses || [];

      if (classes.indexOf("origin-ready") >= 0) counts.originReady += 1;
      if (classes.indexOf("formation-ready") >= 0) counts.formationReady += 1;
      if (classes.indexOf("correction-ready") >= 0) counts.correctionReady += 1;
      if (classes.indexOf("grounding-ready") >= 0) counts.groundingReady += 1;
      if (classes.indexOf("child-receive-ready") >= 0) counts.childReceiveReady += 1;
      if (classes.indexOf("downstream-held") >= 0) counts.downstreamHeld += 1;
      if (classes.indexOf("render-eligible-math-only") >= 0) counts.renderEligibleMathOnly += 1;
      if (classes.indexOf("no-visual-pass") >= 0) counts.noVisualPass += 1;
    }

    return {
      contract: CONTRACT,
      parentBaseline: PARENT_BASELINE,
      childName: CHILD_NAME,
      dispositionReady: dispositionMap.dispositionReady === true,
      seatCount: seats.length,
      counts: counts,
      allSeatsPassive: counts.downstreamHeld === seats.length && counts.noVisualPass === seats.length,
      childReceiveCoverage: counts.childReceiveReady,
      renderEligibleMathOnlyCoverage: counts.renderEligibleMathOnly,
      downstreamStillHeld: true,
      visualPassClaimed: false
    };
  }

  function resetForRun() {
    state.attemptCount += 1;
    state.lastCheckedAt = new Date().toISOString();

    state.childReady = false;
    state.dispositionReady = false;
    state.datumReceived = false;
    state.receiveMapReady = false;
    state.seatCountValid = false;
    state.newsComplete = false;
    state.allSeatsNewsComplete = false;
    state.childPacketReceived = false;
    state.sampleReceived = false;
    state.parentDatumContractAccepted = false;
    state.parentCloneContractAccepted = false;
    state.parentDatumUnchanged = true;
    state.htmlUnchanged = true;
    state.routeJsUnchanged = true;
    state.downstreamStillHeld = true;
    state.rendersNothing = true;
    state.noCanvasCreation = true;
    state.visualPassClaimed = false;
    state.parentStatus = null;
    state.receiveMap = null;
    state.childPacket = null;
    state.sample = null;
    state.dispositionMap = null;
    state.summary = null;

    setFailure("DATUM_API_MISSING", FAILURE.DATUM_API_MISSING);
  }

  function runReceiveTest() {
    resetForRun();

    try {
      var api = findDatumApi();

      if (!api || !hasRequiredParentApi(api)) {
        setFailure("DATUM_API_MISSING", FAILURE.DATUM_API_MISSING);
        publish();
        return status();
      }

      var parentStatus = readParentStatus(api) || {};
      state.parentStatus = parentStatus;

      state.parentDatumContractAccepted =
        parentStatus.contract === PARENT_DATUM_CONTRACT ||
        api.contract === PARENT_DATUM_CONTRACT;

      state.parentCloneContractAccepted =
        parentStatus.cloneContract === PARENT_CLONE_CONTRACT ||
        api.cloneContract === PARENT_CLONE_CONTRACT;

      if (!state.parentDatumContractAccepted) {
        setFailure("PUBLIC_DATUM_CONTRACT_MISMATCH", FAILURE.PUBLIC_DATUM_CONTRACT_MISMATCH);
        publish();
        return status();
      }

      if (!state.parentCloneContractAccepted) {
        setFailure("CLONE_DATUM_CONTRACT_MISMATCH", FAILURE.CLONE_DATUM_CONTRACT_MISMATCH);
        publish();
        return status();
      }

      var map = readReceiveMap(api);

      if (!map || !Array.isArray(map.seats)) {
        setFailure("RECEIVE_MAP_UNAVAILABLE", FAILURE.RECEIVE_MAP_UNAVAILABLE);
        publish();
        return status();
      }

      state.receiveMap = map;
      state.datumReceived = true;
      state.receiveMapReady = Boolean(
        map.childReceiveMapReady === true &&
        map.newsComplete === true &&
        map.chronologyComplete === true &&
        map.relationshipMapReady === true &&
        map.carrierBound === true
      );

      state.seatCountValid = Boolean(
        map.seats.length === LATTICE_STATES &&
        Number(map.radialNodes) === RADIAL_NODES &&
        Number(map.fibonacciBands) === FIBONACCI_BANDS &&
        Number(map.latticeStates) === LATTICE_STATES
      );

      if (!state.seatCountValid) {
        setFailure("SEAT_COUNT_MISMATCH", FAILURE.SEAT_COUNT_MISMATCH);
        publish();
        return status();
      }

      state.newsComplete = map.newsComplete === true;
      state.allSeatsNewsComplete = validateAllSeats(map.seats);

      if (!state.receiveMapReady || !state.newsComplete || !state.allSeatsNewsComplete) {
        setFailure("NEWS_INCOMPLETE", FAILURE.NEWS_INCOMPLETE);
        publish();
        return status();
      }

      var packet = readChildPacket(api);

      state.childPacket = packet;
      state.childPacketReceived = Boolean(
        packet &&
        packet.childReceivePacketReady === true &&
        Number(packet.seatCount) === LATTICE_STATES
      );

      if (!state.childPacketReceived) {
        setFailure("CHILD_PACKET_UNAVAILABLE", FAILURE.CHILD_PACKET_UNAVAILABLE);
        publish();
        return status();
      }

      var sample = readSample(api);
      state.sample = sample;
      state.sampleReceived = Boolean(sample && sample.datumReady === true);

      if (!state.sampleReceived) {
        setFailure("SAMPLE_UNAVAILABLE", FAILURE.SAMPLE_UNAVAILABLE);
        publish();
        return status();
      }

      var dispositionMap = buildDispositionMap(map);
      state.dispositionMap = dispositionMap;
      state.summary = makeSummary(dispositionMap);
      state.dispositionReady = dispositionMap.dispositionReady === true;
      state.childReady = Boolean(
        state.datumReceived &&
        state.receiveMapReady &&
        state.seatCountValid &&
        state.newsComplete &&
        state.allSeatsNewsComplete &&
        state.childPacketReceived &&
        state.sampleReceived &&
        state.dispositionReady
      );

      if (!state.childReady) {
        setFailure("UNKNOWN_EXCEPTION", "passive disposition readiness incomplete");
        publish();
        return status();
      }

      clearFailure();
      publish();
      return status();
    } catch (error) {
      recordError("runReceiveTest", error);
      publish();
      return status();
    }
  }

  function status(options) {
    options = options || {};
    var verbose = options.verbose === true;

    var compact = {
      contract: CONTRACT,
      file: FILE,
      family: FAMILY,
      parentBaseline: PARENT_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,
      initialized: state.initialized,
      childReady: state.childReady,
      datumReceived: state.datumReceived,
      receiveMapReady: state.receiveMapReady,
      seatCount: state.receiveMap && state.receiveMap.seats ? state.receiveMap.seats.length : 0,
      seatCountValid: state.seatCountValid,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      newsComplete: state.newsComplete,
      allSeatsNewsComplete: state.allSeatsNewsComplete,
      childPacketReceived: state.childPacketReceived,
      sampleReceived: state.sampleReceived,
      dispositionReady: state.dispositionReady,
      parentDatumContractAccepted: state.parentDatumContractAccepted,
      parentCloneContractAccepted: state.parentCloneContractAccepted,
      parentApiSource: state.parentApiSource,
      parentDatumUnchanged: true,
      htmlUnchanged: true,
      routeJsUnchanged: true,
      downstreamStillHeld: true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      attemptCount: state.attemptCount,
      lastCheckedAt: state.lastCheckedAt,
      failureCode: state.failureCode,
      failureReason: state.failureReason,
      errors: state.errors.slice()
    };

    if (!verbose) return compact;

    return Object.assign({}, compact, {
      parentStatus: state.parentStatus,
      childPacket: state.childPacket,
      sample: state.sample,
      dispositionMap: state.dispositionMap,
      summary: state.summary
    });
  }

  function getDispositionMap(options) {
    options = options || {};

    if (!state.dispositionMap) runReceiveTest();

    if (options.reference === true) return state.dispositionMap;
    return state.dispositionMap ? safeClone(state.dispositionMap) : null;
  }

  function getDispositionSeat(seatIndex, options) {
    options = options || {};

    var map = getDispositionMap({ reference: true });
    if (!map || !Array.isArray(map.seats)) return null;

    var index = Math.floor(clamp(seatIndex, 0, LATTICE_STATES - 1));
    var seat = map.seats[index];

    return options.reference === true ? seat : safeClone(seat);
  }

  function getSummary() {
    if (!state.summary) runReceiveTest();
    return state.summary ? safeClone(state.summary) : null;
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      file: FILE,
      family: FAMILY,
      parentBaseline: PARENT_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,

      status: status,
      runReceiveTest: runReceiveTest,
      refresh: runReceiveTest,

      getDispositionMap: getDispositionMap,
      dispositionMap: getDispositionMap,
      getDispositionSeat: getDispositionSeat,
      getSeatDisposition: getDispositionSeat,
      getSummary: getSummary,
      summary: getSummary,

      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      parentDatumUnchanged: true,
      htmlUnchanged: true,
      routeJsUnchanged: true,
      downstreamStillHeld: true
    };

    window.AUDRALIA_G1_CHILD_DISPOSITION = api;
    window.AUDRALIA_TRUE_GLOBE_DISPOSITION = api;
    window.AUDRALIA_G1_TRUE_GLOBE_DISPOSITION = api;

    window.AUDRALIA_G1_CHILD_DISPOSITION_STATUS = status();
    window.AUDRALIA_TRUE_GLOBE_DISPOSITION_STATUS = window.AUDRALIA_G1_CHILD_DISPOSITION_STATUS;

    window.AUDRALIA_G1_CHILD_DISPOSITION_BOOT = {
      contract: CONTRACT,
      file: FILE,
      family: FAMILY,
      parentBaseline: PARENT_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,
      initialized: state.initialized,
      bootedAt: new Date().toISOString(),
      childReady: state.childReady,
      datumReceived: state.datumReceived,
      receiveMapReady: state.receiveMapReady,
      seatCountValid: state.seatCountValid,
      newsComplete: state.newsComplete,
      childPacketReceived: state.childPacketReceived,
      dispositionReady: state.dispositionReady,
      parentDatumUnchanged: true,
      htmlUnchanged: true,
      routeJsUnchanged: true,
      downstreamStillHeld: true,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      meaning: "First passive downstream disposition child. It proves downstream receive eligibility from the completed datum cloning-method baseline without renewing datum, HTML, or route JS."
    };

    return api;
  }

  function init() {
    state.initialized = true;
    publish();

    var result = runReceiveTest();

    if (!result.childReady) {
      setTimeout(function () {
        runReceiveTest();
      }, 240);

      setTimeout(function () {
        runReceiveTest();
      }, 720);
    }

    return status();
  }

  publish();
  init();
})();
