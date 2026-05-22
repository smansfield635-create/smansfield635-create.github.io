// /assets/audralia/clean/runtime/audralia.true-globe.terrain.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_CHILD_TERRAIN_STREAM_DATUM_RECEIVE_TEST_TNT_v1
//
// Parent baseline:
// AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE_v1
//
// Harness baseline:
// AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_MULTI_STREAM_LAUNCHPAD_BASELINE_v1
//
// Parent datum public contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1
//
// Parent datum clone contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1
//
// Purpose:
// - Create the first domain-specific downstream child stream.
// - Receive completed cloned datum math without renewing datum, parent HTML, parent route JS, disposition child, or harness.
// - Build 256 passive terrain-readiness classifications.
// - Render nothing.
// - Create no canvas.
// - Claim no visual pass.
// - Keep downstream held.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_CHILD_TERRAIN_STREAM_DATUM_RECEIVE_TEST_TNT_v1";
  var PARENT_BASELINE = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE_v1";
  var HARNESS_BASELINE = "AUDRALIA_G1_DISPOSITION_VERIFICATION_HARNESS_MULTI_STREAM_LAUNCHPAD_BASELINE_v1";
  var PARENT_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var PARENT_CLONE_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var CHILD_NAME = "terrain-child";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.terrain.js";
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
    TERRAIN_MAP_INCOMPLETE: "terrain map incomplete",
    TERRAIN_CLASSIFICATION_INVALID: "terrain classification invalid",
    PARENT_MUTATION_ATTEMPTED: "parent mutation attempted",
    HARNESS_MUTATION_ATTEMPTED: "harness mutation attempted",
    CANVAS_CREATION_ATTEMPTED: "canvas creation attempted",
    VISUAL_PASS_FALSE_CLAIM: "visual pass false claim",
    UNKNOWN_EXCEPTION: "unknown exception"
  };

  var state = {
    initialized: false,
    terrainChildReady: false,
    terrainStreamReady: false,
    terrainMapReady: false,

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
    parentHtmlUnchanged: true,
    parentRouteJsUnchanged: true,
    harnessUnchanged: true,
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
    terrainMap: null,
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

  function readReferenceSeats(api) {
    var out = [];

    try { out.push(api.getSeat(0)); } catch (error0) { recordError("parent.getSeat.0", error0); }
    try { out.push(api.getSeat(64)); } catch (error64) { recordError("parent.getSeat.64", error64); }
    try { out.push(api.getSeat(128)); } catch (error128) { recordError("parent.getSeat.128", error128); }
    try { out.push(api.getSeat(192)); } catch (error192) { recordError("parent.getSeat.192", error192); }
    try { out.push(api.getSeat(255)); } catch (error255) { recordError("parent.getSeat.255", error255); }

    try { api.getNews(0); } catch (errorNews) { recordError("parent.getNews.0", errorNews); }

    return out;
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

  function includesText(value, needle) {
    return String(value || "").toLowerCase().indexOf(String(needle || "").toLowerCase()) >= 0;
  }

  function terrainClassesForSeat(seat) {
    var classes = [];
    var cycle = String(seat.cycleRole || "");
    var latitudeBand = String(seat.latitudeBand || "");
    var compassKey = String(seat.compassKey || "");
    var radialRole = String(seat.radialRole || "");
    var poleRelation = String(seat.poleRelation || "");
    var equatorRelation = String(seat.equatorRelation || "");
    var band = finite(seat.band, 0);
    var radial = finite(seat.radial, 0);
    var major = seat.major === true || band % 4 === 0 || radial % 4 === 0;

    if (
      includesText(cycle, "compression") ||
      includesText(cycle, "pressure") ||
      includesText(latitudeBand, "Jet") ||
      includesText(latitudeBand, "PolarReturn") ||
      compassKey === "N" ||
      compassKey === "NW" ||
      compassKey === "NNW" ||
      major
    ) {
      classes.push("ridge-eligible");
    }

    if (
      includesText(cycle, "stability") ||
      includesText(cycle, "hydration") ||
      includesText(latitudeBand, "equatorial") ||
      includesText(equatorRelation, "equator") ||
      compassKey === "S" ||
      compassKey === "SE" ||
      compassKey === "SSE"
    ) {
      classes.push("basin-eligible");
    }

    if (
      includesText(latitudeBand, "temperate") ||
      includesText(latitudeBand, "equatorial") ||
      radialRole === "ordinal" ||
      radial % 2 === 0
    ) {
      classes.push("coastal-shelf-eligible");
    }

    if (
      includesText(latitudeBand, "Jet") ||
      includesText(cycle, "pressure") ||
      includesText(cycle, "fracture") ||
      compassKey === "W" ||
      compassKey === "SW" ||
      compassKey === "WSW"
    ) {
      classes.push("orographic-pressure-eligible");
    }

    if (
      includesText(cycle, "fracture") ||
      includesText(cycle, "pressure") ||
      compassKey === "W" ||
      compassKey === "SW" ||
      compassKey === "WSW" ||
      radialRole === "intercardinal"
    ) {
      classes.push("fracture-pressure-eligible");
    }

    if (
      includesText(cycle, "compression") ||
      includesText(poleRelation, "pole") ||
      compassKey === "N" ||
      compassKey === "NW" ||
      compassKey === "NNW" ||
      compassKey === "S"
    ) {
      classes.push("compression-pressure-eligible");
    }

    if (
      seat.south &&
      seat.south.grounding === true &&
      seat.newsComplete === true &&
      seat.childReceiveEligible === true
    ) {
      classes.push("grounding-terrain-eligible");
    }

    classes.push("terrain-stream-ready");
    classes.push("render-eligible-math-only");
    classes.push("downstream-held");
    classes.push("no-visual-pass");

    return classes;
  }

  function terrainSeatFor(seat) {
    var classes = terrainClassesForSeat(seat);

    return {
      contract: CONTRACT,
      parentBaseline: PARENT_BASELINE,
      harnessBaseline: HARNESS_BASELINE,

      seatIndex: seat.seatIndex,
      band: seat.band,
      radial: seat.radial,
      compassKey: seat.compassKey || null,
      compassName: seat.compassName || null,
      chronologyIndex: seat.chronologyIndex,
      cycleRole: seat.cycleRole || null,
      circulationRole: seat.circulationRole || null,
      hemisphere: seat.hemisphere || null,
      latitudeBand: seat.latitudeBand || null,
      poleRelation: seat.poleRelation || null,
      equatorRelation: seat.equatorRelation || null,
      radialRole: seat.radialRole || null,
      hexAddress: seat.hexAddress || null,

      newsComplete: seat.newsComplete === true,
      chronologyComplete: seat.chronologyComplete === true,
      relationshipComplete: seat.relationshipComplete === true,
      carrierBound: seat.carrierBound === true,
      childReceiveEligible: seat.childReceiveEligible === true,
      renderEligibleMathOnly: seat.renderEligible === true,

      ridgeEligible: classes.indexOf("ridge-eligible") >= 0,
      basinEligible: classes.indexOf("basin-eligible") >= 0,
      coastalShelfEligible: classes.indexOf("coastal-shelf-eligible") >= 0,
      orographicPressureEligible: classes.indexOf("orographic-pressure-eligible") >= 0,
      fracturePressureEligible: classes.indexOf("fracture-pressure-eligible") >= 0,
      compressionPressureEligible: classes.indexOf("compression-pressure-eligible") >= 0,
      groundingTerrainEligible: classes.indexOf("grounding-terrain-eligible") >= 0,

      terrainClasses: classes,

      terrainStreamReady: true,
      terrainMapOnly: true,
      terrainVisualReady: false,
      terrainGeometryCreated: false,
      actualMountainsCreated: false,
      actualValleysCreated: false,
      actualBeachesCreated: false,
      actualLandmassBordersCreated: false,
      actualContinentsCreated: false,

      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      downstreamHeld: true,
      visualPassClaimed: false,

      north: seat.north,
      east: seat.east,
      west: seat.west,
      south: seat.south,
      news: seat.news
    };
  }

  function buildTerrainMap(map) {
    var seats = Array.isArray(map && map.seats) ? map.seats : [];
    var terrainSeats = [];
    var bands = [];
    var radialLanes = [];

    for (var r = 0; r < RADIAL_NODES; r += 1) radialLanes[r] = [];

    for (var i = 0; i < seats.length; i += 1) {
      var seat = seats[i];
      var terrainSeat = terrainSeatFor(seat);

      terrainSeats.push(terrainSeat);

      if (!bands[seat.band]) bands[seat.band] = [];
      bands[seat.band][seat.radial] = terrainSeat;

      if (radialLanes[seat.radial]) radialLanes[seat.radial].push(terrainSeat);
    }

    return {
      contract: CONTRACT,
      parentBaseline: PARENT_BASELINE,
      harnessBaseline: HARNESS_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,

      terrainMapReady: terrainSeats.length === LATTICE_STATES,
      terrainStreamReady: terrainSeats.length === LATTICE_STATES,
      datumReceived: true,
      receiveMapReady: true,

      terrainSeatCount: terrainSeats.length,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      seats: terrainSeats,
      bands: bands,
      radialLanes: radialLanes,

      allowedClasses: [
        "ridge-eligible",
        "basin-eligible",
        "coastal-shelf-eligible",
        "orographic-pressure-eligible",
        "fracture-pressure-eligible",
        "compression-pressure-eligible",
        "grounding-terrain-eligible",
        "terrain-stream-ready",
        "render-eligible-math-only",
        "downstream-held",
        "no-visual-pass"
      ],

      terrainVisualReady: false,
      terrainGeometryCreated: false,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      downstreamStillHeld: true,
      builtAt: new Date().toISOString()
    };
  }

  function makeSummary(terrainMap) {
    var seats = terrainMap && Array.isArray(terrainMap.seats) ? terrainMap.seats : [];
    var counts = {
      ridgeEligible: 0,
      basinEligible: 0,
      coastalShelfEligible: 0,
      orographicPressureEligible: 0,
      fracturePressureEligible: 0,
      compressionPressureEligible: 0,
      groundingTerrainEligible: 0,
      terrainStreamReady: 0,
      renderEligibleMathOnly: 0,
      downstreamHeld: 0,
      noVisualPass: 0
    };

    for (var i = 0; i < seats.length; i += 1) {
      if (seats[i].ridgeEligible) counts.ridgeEligible += 1;
      if (seats[i].basinEligible) counts.basinEligible += 1;
      if (seats[i].coastalShelfEligible) counts.coastalShelfEligible += 1;
      if (seats[i].orographicPressureEligible) counts.orographicPressureEligible += 1;
      if (seats[i].fracturePressureEligible) counts.fracturePressureEligible += 1;
      if (seats[i].compressionPressureEligible) counts.compressionPressureEligible += 1;
      if (seats[i].groundingTerrainEligible) counts.groundingTerrainEligible += 1;
      if (seats[i].terrainStreamReady) counts.terrainStreamReady += 1;
      if (seats[i].renderEligibleMathOnly) counts.renderEligibleMathOnly += 1;
      if (seats[i].downstreamHeld) counts.downstreamHeld += 1;
      if (seats[i].visualPassClaimed === false) counts.noVisualPass += 1;
    }

    return {
      contract: CONTRACT,
      parentBaseline: PARENT_BASELINE,
      harnessBaseline: HARNESS_BASELINE,
      childName: CHILD_NAME,
      terrainStreamReady: terrainMap.terrainStreamReady === true,
      terrainMapReady: terrainMap.terrainMapReady === true,
      terrainSeatCount: seats.length,
      counts: counts,
      allSeatsTerrainStreamReady: counts.terrainStreamReady === seats.length,
      allSeatsMathOnly: counts.renderEligibleMathOnly === seats.length,
      allSeatsDownstreamHeld: counts.downstreamHeld === seats.length,
      allSeatsNoVisualPass: counts.noVisualPass === seats.length,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false
    };
  }

  function terrainClassificationValid(terrainMap) {
    if (!terrainMap || !Array.isArray(terrainMap.seats)) return false;
    if (terrainMap.seats.length !== LATTICE_STATES) return false;

    for (var i = 0; i < terrainMap.seats.length; i += 1) {
      var seat = terrainMap.seats[i];

      if (!seat.terrainClasses || !Array.isArray(seat.terrainClasses)) return false;
      if (seat.terrainClasses.indexOf("terrain-stream-ready") < 0) return false;
      if (seat.terrainClasses.indexOf("render-eligible-math-only") < 0) return false;
      if (seat.terrainClasses.indexOf("downstream-held") < 0) return false;
      if (seat.terrainClasses.indexOf("no-visual-pass") < 0) return false;
      if (seat.visualPassClaimed !== false) return false;
      if (seat.terrainGeometryCreated !== false) return false;
    }

    return true;
  }

  function resetForRun() {
    state.attemptCount += 1;
    state.lastCheckedAt = new Date().toISOString();

    state.terrainChildReady = false;
    state.terrainStreamReady = false;
    state.terrainMapReady = false;
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
    state.parentHtmlUnchanged = true;
    state.parentRouteJsUnchanged = true;
    state.harnessUnchanged = true;
    state.downstreamStillHeld = true;
    state.rendersNothing = true;
    state.noCanvasCreation = true;
    state.visualPassClaimed = false;
    state.parentStatus = null;
    state.receiveMap = null;
    state.childPacket = null;
    state.sample = null;
    state.terrainMap = null;
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

      readReferenceSeats(api);

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

      var terrainMap = buildTerrainMap(map);
      state.terrainMap = terrainMap;
      state.summary = makeSummary(terrainMap);
      state.terrainMapReady = terrainMap.terrainMapReady === true;
      state.terrainStreamReady = terrainMap.terrainStreamReady === true;

      if (!state.terrainMapReady || !state.terrainStreamReady || terrainMap.seats.length !== LATTICE_STATES) {
        setFailure("TERRAIN_MAP_INCOMPLETE", FAILURE.TERRAIN_MAP_INCOMPLETE);
        publish();
        return status();
      }

      if (!terrainClassificationValid(terrainMap)) {
        setFailure("TERRAIN_CLASSIFICATION_INVALID", FAILURE.TERRAIN_CLASSIFICATION_INVALID);
        publish();
        return status();
      }

      state.terrainChildReady = Boolean(
        state.datumReceived &&
        state.receiveMapReady &&
        state.seatCountValid &&
        state.newsComplete &&
        state.allSeatsNewsComplete &&
        state.childPacketReceived &&
        state.sampleReceived &&
        state.terrainMapReady &&
        state.terrainStreamReady
      );

      if (!state.terrainChildReady) {
        setFailure("UNKNOWN_EXCEPTION", "terrain readiness incomplete");
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
      harnessBaseline: HARNESS_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,

      initialized: state.initialized,
      terrainChildReady: state.terrainChildReady,
      terrainStreamReady: state.terrainStreamReady,
      terrainMapReady: state.terrainMapReady,

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

      terrainSeatCount: state.terrainMap && state.terrainMap.seats ? state.terrainMap.seats.length : 0,
      terrainSeatCountValid: Boolean(state.terrainMap && state.terrainMap.seats && state.terrainMap.seats.length === LATTICE_STATES),

      parentDatumContractAccepted: state.parentDatumContractAccepted,
      parentCloneContractAccepted: state.parentCloneContractAccepted,
      parentApiSource: state.parentApiSource,

      parentDatumUnchanged: true,
      parentHtmlUnchanged: true,
      parentRouteJsUnchanged: true,
      harnessUnchanged: true,
      downstreamStillHeld: true,

      terrainVisualReady: false,
      terrainGeometryCreated: false,
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
      terrainMap: state.terrainMap,
      summary: state.summary
    });
  }

  function getTerrainMap(options) {
    options = options || {};
    if (!state.terrainMap) runReceiveTest();

    if (options.reference === true) return state.terrainMap;
    return state.terrainMap ? safeClone(state.terrainMap) : null;
  }

  function getTerrainSeat(seatIndex, options) {
    options = options || {};

    var map = getTerrainMap({ reference: true });
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
      harnessBaseline: HARNESS_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,

      status: status,
      runReceiveTest: runReceiveTest,
      refresh: runReceiveTest,

      getTerrainMap: getTerrainMap,
      terrainMap: getTerrainMap,
      getTerrainSeat: getTerrainSeat,
      getSeatTerrain: getTerrainSeat,
      getSummary: getSummary,
      summary: getSummary,

      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      parentDatumUnchanged: true,
      parentHtmlUnchanged: true,
      parentRouteJsUnchanged: true,
      harnessUnchanged: true,
      downstreamStillHeld: true
    };

    window.AUDRALIA_G1_CHILD_TERRAIN_STREAM = api;
    window.AUDRALIA_TRUE_GLOBE_TERRAIN = api;
    window.AUDRALIA_G1_TRUE_GLOBE_TERRAIN = api;

    window.AUDRALIA_G1_CHILD_TERRAIN_STREAM_STATUS = status();
    window.AUDRALIA_TRUE_GLOBE_TERRAIN_STATUS = window.AUDRALIA_G1_CHILD_TERRAIN_STREAM_STATUS;

    window.AUDRALIA_G1_CHILD_TERRAIN_STREAM_BOOT = {
      contract: CONTRACT,
      file: FILE,
      family: FAMILY,
      parentBaseline: PARENT_BASELINE,
      harnessBaseline: HARNESS_BASELINE,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      parentCloneContract: PARENT_CLONE_CONTRACT,
      childName: CHILD_NAME,
      initialized: state.initialized,
      bootedAt: new Date().toISOString(),
      terrainChildReady: state.terrainChildReady,
      terrainStreamReady: state.terrainStreamReady,
      terrainMapReady: state.terrainMapReady,
      datumReceived: state.datumReceived,
      receiveMapReady: state.receiveMapReady,
      seatCountValid: state.seatCountValid,
      newsComplete: state.newsComplete,
      childPacketReceived: state.childPacketReceived,
      sampleReceived: state.sampleReceived,
      parentDatumUnchanged: true,
      parentHtmlUnchanged: true,
      parentRouteJsUnchanged: true,
      harnessUnchanged: true,
      downstreamStillHeld: true,
      rendersNothing: true,
      noCanvasCreation: true,
      visualPassClaimed: false,
      meaning: "First passive terrain downstream child. It proves a domain-specific stream can receive the completed datum cloning-method baseline and produce 256 math-only terrain readiness classifications without renewing parent files."
    };

    return api;
  }

  function init() {
    state.initialized = true;
    publish();

    var result = runReceiveTest();

    if (!result.terrainChildReady) {
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
