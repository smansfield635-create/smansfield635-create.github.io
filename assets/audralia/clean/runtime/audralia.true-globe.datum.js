// /assets/audralia/clean/runtime/audralia.true-globe.datum.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1
//
// Public parent-compatible contract preserved:
// AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1
//
// Process:
// CLONING METHOD
//
// Classification:
// adoption-compatible technical birth
//
// Public frame:
// adopted packet
//
// Technical reality:
// new seed birth under same identity
//
// Purpose:
// - Birth a clean cloned datum seed under the same filename.
// - Preserve the parent-facing adoption-compatible interface.
// - Publish the same globals, same API shape, and same receive-map expectation.
// - Build and cache one 16 × 16 / 256-seat NEWS-complete receive map.
// - Provide child receive packets.
// - Render nothing.
// - Create no canvas.
// - Own no HTML, route JS, runtime motion, terrain, moisture, surface, clouds, continents, or visual pass.

(function () {
  "use strict";

  var PUBLIC_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var CLONE_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var TEMPLATE_SOURCE_CONTRACT = "AUDRALIA_G2_DATUM_CHRONOLOGY_PERFORMANCE_CONTAINMENT_TNT_v1";
  var PUBLIC_COMPATIBILITY_CONTRACT = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1";
  var PARENT_BASELINE = "AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1";
  var STANDARD = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";

  var PROCESS = "cloning_method";
  var PUBLIC_FRAME = "adopted_packet";
  var TECHNICAL_REALITY = "new_seed_birth";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;

  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;
  var GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
  var GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

  var AXIAL_TILT_RADIANS = 0.41015237421866746;
  var PRIME_MERIDIAN_LONGITUDE = 0;
  var EQUATOR_LATITUDE = 0;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3,
    5, 8, 13, 21,
    34, 55, 89, 144,
    233, 377, 610, 987
  ]);

  var FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

  var COMPASS_16_BASE = Object.freeze([
    ["N", "North", "origin-axis-lock", "polar compression", "seed / axis"],
    ["NNE", "North-Northeast", "north-to-east-transition", "upper return current", "first release"],
    ["NE", "Northeast", "diagonal-lift", "rising pressure", "lift"],
    ["ENE", "East-Northeast", "east-formation-approach", "formation wind", "pre-formation"],
    ["E", "East", "formation-gate", "equatorial expression", "formation"],
    ["ESE", "East-Southeast", "east-to-south-descent", "humid descent", "material descent"],
    ["SE", "Southeast", "diagonal-hydration", "warm moisture return", "hydration"],
    ["SSE", "South-Southeast", "south-stability-approach", "basin settling", "pre-stability"],
    ["S", "South", "south-stability-lock", "polar mirror compression", "stability"],
    ["SSW", "South-Southwest", "south-to-west-pressure", "lower return current", "retention"],
    ["SW", "Southwest", "diagonal-fracture-test", "terrain pressure", "pressure test"],
    ["WSW", "West-Southwest", "west-fracture-approach", "drying shear", "pre-fracture"],
    ["W", "West", "fracture-gate", "counterflow expression", "fracture"],
    ["WNW", "West-Northwest", "west-to-north-recovery", "cooling return", "recovery"],
    ["NW", "Northwest", "diagonal-compression", "upper compression", "compression"],
    ["NNW", "North-Northwest", "north-return-approach", "final return current", "return"]
  ]);

  var state = {
    initialized: false,
    datumReady: false,
    childReceiveMapReady: false,
    cloneMethodActive: true,
    publicAdoptionCompatible: true,
    technicalBirthComplete: false,
    parentInterfaceUnchanged: true,
    newsProtocolActive: true,
    newsComplete: false,
    chronologyComplete: false,
    relationshipMapReady: false,
    receiveBuildCount: 0,
    sampleCount: 0,
    verboseSampleCount: 0,
    childPacketCount: 0,
    lastSample: null,
    lastChildPacket: null,
    receiveMap: null,
    errors: []
  };

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function degrees(radians) {
    return radians * 180 / Math.PI;
  }

  function radians(deg) {
    return deg * Math.PI / 180;
  }

  function modulo(index, count) {
    return ((index % count) + count) % count;
  }

  function wrapLongitude(lon) {
    var value = finite(lon, 0);

    while (value < -Math.PI) value += TAU;
    while (value > Math.PI) value -= TAU;

    return value;
  }

  function clampLatitude(lat) {
    return clamp(lat, -HALF_PI, HALF_PI);
  }

  function smoothstep(edge0, edge1, value) {
    var denominator = edge1 - edge0 || 1;
    var t = clamp((value - edge0) / denominator, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function safeClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function sum(values) {
    var total = 0;

    for (var i = 0; i < values.length; i += 1) {
      total += values[i];
    }

    return total;
  }

  function unit(vector) {
    var x = finite(vector && vector.x, 0);
    var y = finite(vector && vector.y, 0);
    var z = finite(vector && vector.z, 0);
    var length = Math.sqrt(x * x + y * y + z * z) || 1;

    return {
      x: x / length,
      y: y / length,
      z: z / length
    };
  }

  function sphereFromLonLat(lon, lat) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);

    var clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function lonLatFromSphere(vector) {
    var point = unit(vector);

    return {
      longitude: wrapLongitude(Math.atan2(point.z, point.x)),
      latitude: clampLatitude(Math.asin(clamp(point.y, -1, 1)))
    };
  }

  var AXIS_CACHE = Object.freeze({
    contract: PUBLIC_CONTRACT,
    cloneContract: CLONE_CONTRACT,
    process: PROCESS,
    publicFrame: PUBLIC_FRAME,
    technicalReality: TECHNICAL_REALITY,
    parentBaseline: PARENT_BASELINE,
    datumReady: true,
    axisTiltRadians: AXIAL_TILT_RADIANS,
    axisTiltDegrees: degrees(AXIAL_TILT_RADIANS),
    localNorthPole: Object.freeze({ x: 0, y: 1, z: 0 }),
    localSouthPole: Object.freeze({ x: 0, y: -1, z: 0 }),
    northPole: Object.freeze({ x: 0, y: 1, z: 0 }),
    southPole: Object.freeze({ x: 0, y: -1, z: 0 }),
    tiltedNorthAxis: Object.freeze(unit({
      x: 0,
      y: Math.cos(AXIAL_TILT_RADIANS),
      z: Math.sin(AXIAL_TILT_RADIANS)
    })),
    tiltedSouthAxis: Object.freeze(unit({
      x: 0,
      y: -Math.cos(AXIAL_TILT_RADIANS),
      z: -Math.sin(AXIAL_TILT_RADIANS)
    })),
    equatorLatitude: EQUATOR_LATITUDE,
    equatorPlane: Object.freeze({
      normal: Object.freeze({ x: 0, y: 1, z: 0 }),
      latitude: EQUATOR_LATITUDE
    }),
    primeMeridianLongitude: PRIME_MERIDIAN_LONGITUDE,
    primeMeridianPlane: Object.freeze({
      longitude: PRIME_MERIDIAN_LONGITUDE,
      normal: Object.freeze({ x: 0, y: 0, z: 1 })
    }),
    northSouthAuthority: true,
    equatorAuthority: true,
    hemisphereAuthority: true,
    polarAuthority: true,
    circulationAuthority: true,
    fibonacciCompassChronologyAuthority: true
  });

  function getAxis() {
    return AXIS_CACHE;
  }

  function buildCompassChronology() {
    var totalWeight = sum(FIBONACCI_SEQUENCE);
    var cumulative = 0;
    var out = [];

    for (var index = 0; index < COMPASS_16_BASE.length; index += 1) {
      var row = COMPASS_16_BASE[index];
      var weight = FIBONACCI_SEQUENCE[index];
      var predecessorIndex = modulo(index - 1, RADIAL_NODES);
      var successorIndex = modulo(index + 1, RADIAL_NODES);
      var oppositeIndex = modulo(index + 8, RADIAL_NODES);
      var angularStep = TAU / RADIAL_NODES;
      var longitudeCenter = wrapLongitude(PRIME_MERIDIAN_LONGITUDE + index * angularStep);
      var fibonacciStart = cumulative / totalWeight;

      cumulative += weight;

      var fibonacciEnd = cumulative / totalWeight;

      out.push(Object.freeze({
        contract: PUBLIC_CONTRACT,
        cloneContract: CLONE_CONTRACT,
        compassIndex: index,
        chronologyIndex: index,
        sequenceIndex: index + 1,
        key: row[0],
        name: row[1],
        nodeRole: row[2],
        circulationRole: row[3],
        cycleRole: row[4],
        predecessorIndex: predecessorIndex,
        successorIndex: successorIndex,
        oppositeIndex: oppositeIndex,
        longitudeCenter: longitudeCenter,
        bearingRadians: index * angularStep,
        bearingDegrees: degrees(index * angularStep),
        fibonacciWeight: weight,
        fibonacciStart: fibonacciStart,
        fibonacciEnd: fibonacciEnd,
        fibonacciMidpoint: (fibonacciStart + fibonacciEnd) / 2,
        fibonacciPhase: fract(index / GOLDEN_RATIO),
        goldenAnglePhase: fract((index * GOLDEN_ANGLE) / TAU),
        cardinalGroup: index % 4 === 0 ? "cardinal" : index % 2 === 0 ? "ordinal" : "intercardinal",
        masterQuadrant:
          index <= 3 ? "North-to-East" :
          index <= 7 ? "East-to-South" :
          index <= 11 ? "South-to-West" :
          "West-to-North",
        chronologyReady: true,
        nodeDefinedBySequence: true,
        nodeDefinedByCompass: true
      }));
    }

    return Object.freeze(out);
  }

  var COMPASS_CHRONOLOGY = buildCompassChronology();

  function compassNodeByIndex(index) {
    return COMPASS_CHRONOLOGY[modulo(Math.round(finite(index, 0)), RADIAL_NODES)];
  }

  function compassIndexForLongitude(lon) {
    var step = TAU / RADIAL_NODES;
    var delta = wrapLongitude(lon - PRIME_MERIDIAN_LONGITUDE);
    return modulo(Math.round(delta / step), RADIAL_NODES);
  }

  function compassNodeForLongitude(lon) {
    return compassNodeByIndex(compassIndexForLongitude(lon));
  }

  function enrichNode(node) {
    var previous = compassNodeByIndex(node.predecessorIndex);
    var next = compassNodeByIndex(node.successorIndex);
    var opposite = compassNodeByIndex(node.oppositeIndex);

    return {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      process: PROCESS,
      compassIndex: node.compassIndex,
      chronologyIndex: node.chronologyIndex,
      sequenceIndex: node.sequenceIndex,
      key: node.key,
      name: node.name,
      nodeRole: node.nodeRole,
      circulationRole: node.circulationRole,
      cycleRole: node.cycleRole,
      predecessorIndex: node.predecessorIndex,
      successorIndex: node.successorIndex,
      oppositeIndex: node.oppositeIndex,
      predecessorKey: previous.key,
      predecessorName: previous.name,
      successorKey: next.key,
      successorName: next.name,
      oppositeKey: opposite.key,
      oppositeName: opposite.name,
      longitudeCenter: node.longitudeCenter,
      bearingRadians: node.bearingRadians,
      bearingDegrees: node.bearingDegrees,
      fibonacciWeight: node.fibonacciWeight,
      fibonacciStart: node.fibonacciStart,
      fibonacciEnd: node.fibonacciEnd,
      fibonacciMidpoint: node.fibonacciMidpoint,
      fibonacciPhase: node.fibonacciPhase,
      goldenAnglePhase: node.goldenAnglePhase,
      cardinalGroup: node.cardinalGroup,
      masterQuadrant: node.masterQuadrant,
      chronologicalContinuity: previous.key + " → " + node.key + " → " + next.key,
      fibonacciChronologyReady: true,
      nodeDefinedBySequence: true
    };
  }

  function chronologyForLongitude(lon, verbose) {
    var node = compassNodeForLongitude(lon);
    return verbose ? enrichNode(node) : node;
  }

  function hemisphereFor(lat) {
    lat = clampLatitude(lat);

    if (lat > radians(3.5)) {
      return {
        name: "north",
        sign: 1,
        display: "Northern Hemisphere",
        pole: "north"
      };
    }

    if (lat < radians(-3.5)) {
      return {
        name: "south",
        sign: -1,
        display: "Southern Hemisphere",
        pole: "south"
      };
    }

    return {
      name: "equatorial",
      sign: 0,
      display: "Equatorial Belt",
      pole: "balanced"
    };
  }

  function poleRelationForBand(band) {
    if (band <= 1) return "north-pole-field";
    if (band >= 14) return "south-pole-field";
    return "middle-field";
  }

  function equatorRelationForLatitude(lat) {
    var absLat = Math.abs(clampLatitude(lat));

    if (absLat < radians(3.5)) return "equator";
    if (absLat < radians(14)) return "near-equator";
    return "off-equator";
  }

  function latitudeBandFor(lat) {
    lat = clampLatitude(lat);

    var absLat = Math.abs(lat);
    var hemi = hemisphereFor(lat);

    if (absLat >= radians(72)) return hemi.sign >= 0 ? "northPolarCap" : "southPolarCap";
    if (absLat >= radians(58)) return hemi.sign >= 0 ? "northPolarReturnBand" : "southPolarReturnBand";
    if (absLat >= radians(34)) return hemi.sign >= 0 ? "northJetBand" : "southJetBand";
    if (absLat >= radians(14)) return hemi.sign >= 0 ? "northTemperateBand" : "southTemperateBand";

    return "equatorialMoistureBand";
  }

  function latitudeZoneFor(lat) {
    lat = clampLatitude(lat);

    var absLat = Math.abs(lat);

    return {
      latitudeBand: latitudeBandFor(lat),
      hemisphere: hemisphereFor(lat),
      equatorialZone: absLat < radians(14),
      temperateZone: absLat >= radians(14) && absLat < radians(34),
      jetZone: absLat >= radians(34) && absLat < radians(58),
      polarReturnZone: absLat >= radians(58) && absLat < radians(72),
      polarCapZone: absLat >= radians(72)
    };
  }

  function bandIndexFor(lat) {
    var y = Math.sin(clampLatitude(lat));
    var equalArea = (1 - y) / 2;
    return Math.floor(clamp(equalArea * FIBONACCI_BANDS, 0, FIBONACCI_BANDS - 0.000001));
  }

  function radialRoleFor(radial) {
    if (radial % 4 === 0) return "cardinal";
    if (radial % 2 === 0) return "ordinal";
    return "intercardinal";
  }

  function isMajorSeat(band, radial) {
    return band % 4 === 0 || radial % 4 === 0;
  }

  function isSecondarySeat(band, radial) {
    return band % 2 === 0 || radial % 2 === 0;
  }

  function seatIndexFor(band, radial) {
    return modulo(band, FIBONACCI_BANDS) * RADIAL_NODES + modulo(radial, RADIAL_NODES);
  }

  function hexAddressFor(band, radial) {
    return "AU-HX-" + String(band).padStart(2, "0") + "-" + String(radial).padStart(2, "0");
  }

  function makeNewsForSeat(band, radial, seatIndex, poleRelation) {
    var eastRadial = modulo(radial + 1, RADIAL_NODES);
    var westRadial = modulo(radial - 1, RADIAL_NODES);
    var oppositeRadial = modulo(radial + RADIAL_NODES / 2, RADIAL_NODES);

    var northPredecessorSeatIndex = band > 0 ? seatIndexFor(band - 1, radial) : null;
    var southSuccessorSeatIndex = band < FIBONACCI_BANDS - 1 ? seatIndexFor(band + 1, radial) : null;

    var north = {
      defined: true,
      protocol: "NORTH",
      role: "origin-pole-axis-predecessor-authority",
      originAuthority: true,
      poleRelation: poleRelation,
      axisRelation: true,
      predecessorBand: band > 0 ? band - 1 : null,
      predecessorSeatIndex: northPredecessorSeatIndex,
      boundary: band === 0 ? "north-pole-boundary" : null,
      upstreamLineage: band === 0 ? "north-pole-boundary" : "previous-fibonacci-band",
      admissibilitySource: PARENT_BASELINE,
      cloneSeedSource: CLONE_CONTRACT
    };

    var east = {
      defined: true,
      protocol: "EAST",
      role: "formation-successor-expression",
      successorRadial: eastRadial,
      successorSeatIndex: seatIndexFor(band, eastRadial),
      activePhase: true,
      forwardExpression: true,
      forwardContinuity: true,
      clockwiseDiagnosticMovement: true,
      wrapsAtBoundary: radial === RADIAL_NODES - 1
    };

    var west = {
      defined: true,
      protocol: "WEST",
      role: "correction-memory-opposite-relation",
      previousRadial: westRadial,
      previousSeatIndex: seatIndexFor(band, westRadial),
      oppositeRadial: oppositeRadial,
      oppositeSeatIndex: seatIndexFor(band, oppositeRadial),
      correctionRelation: true,
      memoryRelation: true,
      counterweight: true,
      rollbackEligible: true,
      reverseDiagnosticMovement: true,
      wrapsAtBoundary: radial === 0
    };

    var south = {
      defined: true,
      protocol: "SOUTH",
      role: "completion-grounding-render-eligibility",
      successorBand: band < FIBONACCI_BANDS - 1 ? band + 1 : null,
      successorSeatIndex: southSuccessorSeatIndex,
      boundary: band === FIBONACCI_BANDS - 1 ? "south-pole-boundary" : null,
      grounding: true,
      stabilization: true,
      renderEligible: true,
      childReceiveEligible: true,
      downstreamReadiness: "math-ready-only"
    };

    var newsComplete = Boolean(
      north.defined &&
      east.defined &&
      west.defined &&
      south.defined &&
      (north.predecessorSeatIndex !== null || north.boundary === "north-pole-boundary") &&
      Number.isInteger(east.successorSeatIndex) &&
      Number.isInteger(west.previousSeatIndex) &&
      Number.isInteger(west.oppositeSeatIndex) &&
      (south.successorSeatIndex !== null || south.boundary === "south-pole-boundary") &&
      south.renderEligible &&
      south.childReceiveEligible
    );

    return {
      protocol: "NEWS",
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      north: north,
      east: east,
      west: west,
      south: south,
      newsComplete: newsComplete,
      chronologyComplete: true,
      relationshipComplete: true,
      carrierBound: true,
      renderEligible: newsComplete,
      childReceiveEligible: newsComplete
    };
  }

  function makeSeat(band, radial) {
    var v = (band + 0.5) / FIBONACCI_BANDS;
    var latitude = Math.asin(clamp(1 - 2 * v, -1, 1));
    var node = compassNodeByIndex(radial);
    var longitude = node.longitudeCenter;
    var cartesian = sphereFromLonLat(longitude, latitude);
    var hemisphere = hemisphereFor(latitude);
    var poleRelation = poleRelationForBand(band);
    var equatorRelation = equatorRelationForLatitude(latitude);
    var seatIndex = seatIndexFor(band, radial);
    var fibonacci = FIBONACCI_SEQUENCE[band];
    var fibonacciPhase = fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];
    var news = makeNewsForSeat(band, radial, seatIndex, poleRelation);

    return {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      parentInterfaceUnchanged: true,
      parentBaseline: PARENT_BASELINE,
      seatIndex: seatIndex,
      band: band,
      radial: radial,
      radialLane: radial,
      fibonacciBand: band,
      fibonacci: fibonacci,
      fibonacciPhase: fibonacciPhase,
      fibonacciSequenceIndex: band,
      longitude: longitude,
      latitude: latitude,
      longitudeDegrees: degrees(longitude),
      latitudeDegrees: degrees(latitude),
      cartesian: cartesian,
      compassKey: node.key,
      compassName: node.name,
      compassIndex: node.compassIndex,
      chronologyIndex: node.chronologyIndex,
      sequenceIndex: node.sequenceIndex,
      nodeRole: node.nodeRole,
      circulationRole: node.circulationRole,
      cycleRole: node.cycleRole,
      radialRole: radialRoleFor(radial),
      cardinalGroup: node.cardinalGroup,
      masterQuadrant: node.masterQuadrant,
      hemisphere: hemisphere.name,
      hemisphereSign: hemisphere.sign,
      hemisphereDisplay: hemisphere.display,
      poleRelation: poleRelation,
      equatorRelation: equatorRelation,
      latitudeBand: latitudeBandFor(latitude),
      major: isMajorSeat(band, radial),
      secondary: isSecondarySeat(band, radial),
      cellId: "audralia:datum:" + band + ":" + radial,
      hexAddress: hexAddressFor(band, radial),
      northSeatIndex: news.north.predecessorSeatIndex,
      southSeatIndex: news.south.successorSeatIndex,
      eastSeatIndex: news.east.successorSeatIndex,
      westSeatIndex: news.west.previousSeatIndex,
      oppositeSeatIndex: news.west.oppositeSeatIndex,
      predecessorSeatIndex: news.north.predecessorSeatIndex,
      successorSeatIndex: news.south.successorSeatIndex,
      fibonacciForwardSeatIndex: null,
      fibonacciReturnSeatIndex: null,
      fibonacciForwardSeat: null,
      fibonacciReturnSeat: null,
      news: news,
      north: news.north,
      east: news.east,
      west: news.west,
      south: news.south,
      newsComplete: news.newsComplete,
      chronologyComplete: news.chronologyComplete,
      relationshipComplete: news.relationshipComplete,
      carrierBound: news.carrierBound,
      renderEligible: news.renderEligible,
      childReceiveEligible: news.childReceiveEligible,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      visualPassClaimed: false
    };
  }

  function buildReceiveMap() {
    var seats = [];
    var rings = [];
    var radialLanes = [];

    for (var radial = 0; radial < RADIAL_NODES; radial += 1) {
      radialLanes.push([]);
    }

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      var ring = [];

      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        var seat = makeSeat(band, radial);

        seats.push(seat);
        ring.push(seat);
        radialLanes[radial].push(seat);
      }

      rings.push(ring);
    }

    for (var i = 0; i < seats.length; i += 1) {
      var current = seats[i];
      var offset = FIBONACCI_OFFSETS[current.band % FIBONACCI_OFFSETS.length];

      current.fibonacciForwardSeatIndex = current.band < FIBONACCI_BANDS - 1
        ? seatIndexFor(current.band + 1, current.radial + offset)
        : null;

      current.fibonacciReturnSeatIndex = current.band > 0
        ? seatIndexFor(current.band - 1, current.radial - offset)
        : null;

      current.fibonacciForwardSeat = current.fibonacciForwardSeatIndex;
      current.fibonacciReturnSeat = current.fibonacciReturnSeatIndex;
    }

    var allNewsComplete = seats.every(function (seat) {
      return Boolean(
        seat.newsComplete === true &&
        seat.childReceiveEligible === true &&
        seat.renderEligible === true &&
        seat.north &&
        seat.north.defined === true &&
        seat.east &&
        seat.east.defined === true &&
        seat.west &&
        seat.west.defined === true &&
        seat.south &&
        seat.south.defined === true
      );
    });

    var map = {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      templateSourceContract: TEMPLATE_SOURCE_CONTRACT,
      publicCompatibilityContract: PUBLIC_COMPATIBILITY_CONTRACT,
      parentBaseline: PARENT_BASELINE,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      cloneMethodActive: true,
      publicAdoptionCompatible: true,
      technicalBirthComplete: true,
      parentInterfaceUnchanged: true,
      carrierRole: "observable-organic-carrier",
      latticeRole: "scientific-discovery-rule-layer",
      datumReady: true,
      childReceiveMapReady: true,
      newsProtocolActive: true,
      newsComplete: allNewsComplete,
      chronologyComplete: true,
      relationshipMapReady: true,
      carrierBound: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      fibonacciSequence: FIBONACCI_SEQUENCE.slice(),
      fibonacciOffsets: FIBONACCI_OFFSETS.slice(),
      compassChronology: COMPASS_CHRONOLOGY.map(enrichNode),
      seats: seats,
      rings: rings,
      radialLanes: radialLanes,
      seatCount: seats.length,
      ringCount: rings.length,
      radialLaneCount: radialLanes.length,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      rendersNothing: true,
      noCanvasCreation: true,
      ownsRuntimeMotion: false,
      ownsNoRuntimeMotion: true,
      ownsHtml: false,
      ownsNoHtml: true,
      ownsRouteJs: false,
      ownsNoRouteJs: true,
      ownsSurfaceTruth: false,
      ownsNoSurfaceTruth: true,
      ownsCloudTruth: false,
      ownsNoCloudTruth: true,
      ownsTerrainTruth: false,
      ownsNoTerrainTruth: true,
      ownsMoistureTruth: false,
      ownsNoMoistureTruth: true,
      ownsContinentTruth: false,
      ownsNoContinentTruth: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      builtAt: new Date().toISOString()
    };

    state.receiveBuildCount += 1;
    state.receiveMap = map;
    state.childReceiveMapReady = true;
    state.newsComplete = allNewsComplete;
    state.chronologyComplete = true;
    state.relationshipMapReady = true;
    state.technicalBirthComplete = true;

    return map;
  }

  function ensureReceiveMap() {
    if (!state.receiveMap) return buildReceiveMap();
    return state.receiveMap;
  }

  function compactReceiveMap() {
    var map = ensureReceiveMap();

    return {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      parentBaseline: PARENT_BASELINE,
      carrierRole: map.carrierRole,
      latticeRole: map.latticeRole,
      datumReady: true,
      childReceiveMapReady: true,
      cloneMethodActive: true,
      publicAdoptionCompatible: true,
      technicalBirthComplete: true,
      parentInterfaceUnchanged: true,
      newsProtocolActive: true,
      newsComplete: map.newsComplete,
      chronologyComplete: map.chronologyComplete,
      relationshipMapReady: map.relationshipMapReady,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: map.seats.length,
      ringCount: map.rings.length,
      radialLaneCount: map.radialLanes.length,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      rendersNothing: true,
      noCanvasCreation: true,
      ownsRuntimeMotion: false,
      ownsHtml: false,
      ownsRouteJs: false,
      visualPassClaimed: false
    };
  }

  function getSeat(seatIndex, options) {
    var map = ensureReceiveMap();
    var index = Math.floor(clamp(seatIndex, 0, LATTICE_STATES - 1));
    var seat = map.seats[index];

    return options && options.reference === true ? seat : safeClone(seat);
  }

  function getSeatByBandRadial(band, radial, options) {
    return getSeat(seatIndexFor(band, radial), options);
  }

  function getRing(band, options) {
    var map = ensureReceiveMap();
    var index = Math.floor(clamp(band, 0, FIBONACCI_BANDS - 1));
    var ring = map.rings[index];

    return options && options.reference === true ? ring : safeClone(ring);
  }

  function getRadialLane(radial, options) {
    var map = ensureReceiveMap();
    var index = modulo(Math.round(finite(radial, 0)), RADIAL_NODES);
    var lane = map.radialLanes[index];

    return options && options.reference === true ? lane : safeClone(lane);
  }

  function getOppositeSeat(seatIndex, options) {
    var seat = getSeat(seatIndex, { reference: true });
    return getSeat(seat.oppositeSeatIndex, options);
  }

  function getFibonacciForwardSeat(seatIndex, options) {
    var seat = getSeat(seatIndex, { reference: true });

    if (seat.fibonacciForwardSeatIndex === null) return null;

    return getSeat(seat.fibonacciForwardSeatIndex, options);
  }

  function getFibonacciReturnSeat(seatIndex, options) {
    var seat = getSeat(seatIndex, { reference: true });

    if (seat.fibonacciReturnSeatIndex === null) return null;

    return getSeat(seat.fibonacciReturnSeatIndex, options);
  }

  function getNews(seatIndex, options) {
    var seat = getSeat(seatIndex, { reference: true });

    return options && options.reference === true ? seat.news : safeClone(seat.news);
  }

  function receive(options) {
    options = options || {};

    var map = ensureReceiveMap();

    if (options.compact === true) return compactReceiveMap();
    if (options.reference === true) return map;

    return safeClone(map);
  }

  function normalizeChildName(childName) {
    var value = String(childName || "unspecified-child").trim();
    return value || "unspecified-child";
  }

  function getChildReceivePacket(childName, options) {
    options = options || {};

    var map = ensureReceiveMap();
    var name = normalizeChildName(childName);
    var eligibleSeats = map.seats.filter(function (seat) {
      return seat.childReceiveEligible === true &&
        seat.newsComplete === true &&
        seat.renderEligible === true;
    });

    var packet = {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      parentInterfaceUnchanged: true,
      parentBaseline: PARENT_BASELINE,
      templateSourceContract: TEMPLATE_SOURCE_CONTRACT,
      childName: name,
      carrierRole: map.carrierRole,
      latticeRole: map.latticeRole,
      datumReady: true,
      childReceivePacketReady: eligibleSeats.length === LATTICE_STATES,
      childReceiveMapReady: true,
      seatCount: eligibleSeats.length,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      fibonacciSequence: FIBONACCI_SEQUENCE.slice(),
      fibonacciOffsets: FIBONACCI_OFFSETS.slice(),
      seats: eligibleSeats,
      rings: map.rings,
      radialLanes: map.radialLanes,
      newsProtocolActive: true,
      newsComplete: map.newsComplete,
      chronologyComplete: map.chronologyComplete,
      relationshipMapReady: map.relationshipMapReady,
      carrierBound: true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      rendersNothing: true,
      noCanvasCreation: true,
      ownsRuntimeMotion: false,
      ownsHtml: false,
      ownsRouteJs: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      issuedAt: new Date().toISOString()
    };

    state.childPacketCount += 1;
    state.lastChildPacket = {
      childName: name,
      issuedAt: packet.issuedAt,
      seatCount: packet.seatCount,
      childReceivePacketReady: packet.childReceivePacketReady
    };

    if (options.compact === true) {
      return {
        contract: PUBLIC_CONTRACT,
        cloneContract: CLONE_CONTRACT,
        process: PROCESS,
        publicFrame: PUBLIC_FRAME,
        technicalReality: TECHNICAL_REALITY,
        parentInterfaceUnchanged: true,
        parentBaseline: PARENT_BASELINE,
        childName: name,
        datumReady: true,
        childReceivePacketReady: packet.childReceivePacketReady,
        childReceiveMapReady: true,
        seatCount: packet.seatCount,
        radialNodes: RADIAL_NODES,
        fibonacciBands: FIBONACCI_BANDS,
        latticeStates: LATTICE_STATES,
        newsProtocolActive: true,
        newsComplete: map.newsComplete,
        chronologyComplete: map.chronologyComplete,
        relationshipMapReady: map.relationshipMapReady,
        carrierBound: true,
        terrainReady: false,
        moistureReady: false,
        surfaceReady: false,
        cloudReady: false,
        continentReady: false,
        visualPassReady: false,
        groundLevelReady: false,
        visualPassClaimed: false
      };
    }

    return options.reference === true ? packet : safeClone(packet);
  }

  function addressFor(lon, lat, options) {
    options = options || {};

    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);

    var node = chronologyForLongitude(lon, Boolean(options.verbose));
    var radialIndex = node.compassIndex;
    var bandIndex = bandIndexFor(lat);
    var stateIndex = seatIndexFor(bandIndex, radialIndex);
    var seat = getSeat(stateIndex, { reference: true });

    var result = {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      process: PROCESS,
      radialIndex: radialIndex,
      bandIndex: bandIndex,
      stateIndex: stateIndex,
      latticeStates: LATTICE_STATES,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      compassKey: node.key,
      compassName: node.name,
      chronologyIndex: node.chronologyIndex,
      sequenceIndex: node.sequenceIndex,
      predecessorIndex: node.predecessorIndex,
      successorIndex: node.successorIndex,
      oppositeIndex: node.oppositeIndex,
      fibonacciWeight: node.fibonacciWeight,
      fibonacciPhase: node.fibonacciPhase,
      fibonacciChronologyPhase: node.fibonacciMidpoint,
      goldenAnglePhase: fract((stateIndex * GOLDEN_ANGLE) / TAU),
      hexPhase: fract(stateIndex * GOLDEN_RATIO),
      cellId: seat.cellId,
      hexAddress: seat.hexAddress,
      newsComplete: seat.newsComplete,
      childReceiveEligible: seat.childReceiveEligible,
      renderEligible: seat.renderEligible
    };

    if (options.verbose) {
      result.predecessorKey = node.predecessorKey;
      result.successorKey = node.successorKey;
      result.oppositeKey = node.oppositeKey;
      result.nodeRole = node.nodeRole;
      result.cycleRole = node.cycleRole;
      result.circulationRole = node.circulationRole;
      result.masterQuadrant = node.masterQuadrant;
      result.cardinalGroup = node.cardinalGroup;
      result.chronologicalContinuity = node.chronologicalContinuity;
      result.news = getNews(stateIndex);
    }

    return result;
  }

  function polarInfluenceFor(lat) {
    return smoothstep(radians(42), radians(82), Math.abs(clampLatitude(lat)));
  }

  function polarCurlFor(lat) {
    return smoothstep(radians(56), radians(86), Math.abs(clampLatitude(lat)));
  }

  function equatorInfluenceFor(lat) {
    return 1 - smoothstep(radians(5), radians(31), Math.abs(clampLatitude(lat)));
  }

  function temperateInfluenceFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    return clamp(smoothstep(radians(10), radians(31), absLat) * (1 - smoothstep(radians(44), radians(68), absLat)), 0, 1);
  }

  function jetInfluenceFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    var center = radians(43);
    var spread = radians(17);
    return clamp(Math.exp(-Math.pow((absLat - center) / spread, 2)), 0, 1);
  }

  function polarReturnFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    return clamp(smoothstep(radians(50), radians(68), absLat) * (1 - smoothstep(radians(84), radians(90), absLat)), 0, 1);
  }

  function coriolisFor(lat) {
    lat = clampLatitude(lat);

    var hemi = hemisphereFor(lat);
    var magnitude = smoothstep(0.02, 0.95, Math.abs(Math.sin(lat)));

    return {
      sign: hemi.sign,
      magnitude: magnitude,
      force: hemi.sign * magnitude,
      northernDeflection: hemi.sign > 0,
      southernDeflection: hemi.sign < 0,
      equatorialNeutral: hemi.sign === 0
    };
  }

  function nodeCycleBias(node) {
    var i = node.compassIndex;

    return {
      compressionBias: i === 0 || i === 14 || i === 15 ? 1 : i === 1 ? 0.55 : 0,
      formationBias: i >= 2 && i <= 5 ? 1 - Math.abs(4 - i) / 3 : 0,
      hydrationBias: i >= 5 && i <= 8 ? 1 - Math.abs(7 - i) / 3 : 0,
      stabilityBias: i >= 7 && i <= 9 ? 1 - Math.abs(8 - i) / 2 : 0,
      pressureBias: i >= 9 && i <= 12 ? 1 - Math.abs(11 - i) / 3 : 0,
      recoveryBias: i >= 12 || i <= 1 ? i >= 12 ? (i - 11) / 4 : (2 - i) / 4 : 0
    };
  }

  function circulationFor(lon, lat, time) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);
    time = finite(time, 0);

    var node = chronologyForLongitude(lon, false);
    var hemi = hemisphereFor(lat);
    var cor = coriolisFor(lat);
    var equatorInfluence = equatorInfluenceFor(lat);
    var temperateInfluence = temperateInfluenceFor(lat);
    var jetInfluence = jetInfluenceFor(lat);
    var polarCurl = polarCurlFor(lat);
    var polarReturn = polarReturnFor(lat);
    var cycle = nodeCycleBias(node);

    var wave = Math.sin(lon * 3 + time * 0.035 + hemi.sign * 0.7 + node.fibonacciPhase * TAU);
    var longitudinalPulse = Math.sin(lon * 5 - time * 0.018 + node.goldenAnglePhase * TAU);

    var equatorialFlow = equatorInfluence * (0.78 + cycle.formationBias * 0.12 + wave * 0.08);
    var jetFlow = jetInfluence * (hemi.sign >= 0 ? -0.62 : 0.62);
    var temperateCounterflow = temperateInfluence * (hemi.sign >= 0 ? -0.28 : 0.28);
    var polarCurlFlow = polarCurl * (hemi.sign >= 0 ? 0.38 : -0.38);
    var polarReturnFlow = polarReturn * (hemi.sign >= 0 ? -0.26 : 0.26);
    var chronologyFlow =
      cycle.compressionBias * 0.12 -
      cycle.pressureBias * 0.10 +
      cycle.recoveryBias * 0.08 +
      cycle.hydrationBias * 0.06;

    var eastWestFlow = equatorialFlow + jetFlow + temperateCounterflow + polarCurlFlow + polarReturnFlow + chronologyFlow;

    var northSouthFlow =
      equatorInfluence * 0.04 * wave +
      temperateInfluence * -hemi.sign * 0.12 +
      jetInfluence * hemi.sign * 0.08 +
      polarReturn * -hemi.sign * 0.34 +
      polarCurl * hemi.sign * 0.10 * longitudinalPulse +
      cycle.hydrationBias * 0.05 -
      cycle.compressionBias * 0.04;

    var vorticity =
      cor.force * 0.28 +
      jetInfluence * cor.sign * 0.22 +
      polarCurl * cor.sign * 0.62 +
      equatorInfluence * longitudinalPulse * 0.06 +
      node.fibonacciPhase * 0.04;

    return {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      circulationReady: true,
      hemisphere: hemi.name,
      hemisphereSign: hemi.sign,
      compassKey: node.key,
      chronologyIndex: node.chronologyIndex,
      cycleRole: node.cycleRole,
      eastWestFlow: eastWestFlow,
      northSouthFlow: northSouthFlow,
      flowAngle: Math.atan2(northSouthFlow, eastWestFlow || 0.000001),
      flowMagnitude: clamp(Math.sqrt(eastWestFlow * eastWestFlow + northSouthFlow * northSouthFlow), 0, 2),
      vorticity: vorticity,
      vorticitySign: vorticity > 0 ? 1 : vorticity < 0 ? -1 : 0,
      equatorialBandActive: equatorInfluence > 0.08,
      hemisphereCounterflowActive: temperateInfluence > 0.08 || jetInfluence > 0.08,
      polarReturnActive: polarReturn > 0.08,
      polarCurlActive: polarCurl > 0.08,
      northPoleAnchorActive: lat > 0,
      southPoleAnchorActive: lat < 0,
      poleAnchor: hemi.sign > 0 ? "north" : hemi.sign < 0 ? "south" : "equatorial-balance",
      fibonacciChronologyApplied: true,
      compassChronologyApplied: true
    };
  }

  function seasonalPressureFor(lon, lat, time) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);
    time = finite(time, 0);

    var node = chronologyForLongitude(lon, false);
    var seasonalPhase = Math.sin(time * 0.003 + lon * 0.25 + node.fibonacciPhase * TAU);
    var tiltBias = Math.sin(lat) * Math.sin(AXIAL_TILT_RADIANS);
    var sequenceBias = (node.fibonacciMidpoint - 0.5) * 0.14;
    var sunwardPressure = clamp(0.50 + seasonalPhase * 0.18 + tiltBias * 0.32 + sequenceBias, 0, 1);

    return {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      seasonalPressureReady: true,
      seasonalPhase: seasonalPhase,
      tiltBias: tiltBias,
      sequenceBias: sequenceBias,
      sunwardPressure: sunwardPressure,
      shadowPressure: 1 - sunwardPressure,
      axialSeasonalityPresent: true,
      fibonacciChronologyApplied: true
    };
  }

  function compactSample(lon, lat, time) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);
    time = finite(time, 0);

    var node = chronologyForLongitude(lon, false);
    var hemi = hemisphereFor(lat);
    var address = addressFor(lon, lat, { verbose: false });
    var cor = coriolisFor(lat);
    var circ = circulationFor(lon, lat, time);
    var season = seasonalPressureFor(lon, lat, time);
    var polarInfluence = polarInfluenceFor(lat);
    var polarCurl = polarCurlFor(lat);
    var equatorInfluence = equatorInfluenceFor(lat);
    var temperateInfluence = temperateInfluenceFor(lat);
    var jetInfluence = jetInfluenceFor(lat);
    var polarReturn = polarReturnFor(lat);
    var cycle = nodeCycleBias(node);

    var altitudeBias = clamp(
      equatorInfluence * 0.16 +
      jetInfluence * 0.22 +
      polarReturn * 0.18 +
      polarCurl * 0.10 +
      cycle.compressionBias * 0.06,
      0,
      1
    );

    var moistureDatumBias = clamp(
      equatorInfluence * 0.42 +
      temperateInfluence * 0.24 +
      polarReturn * 0.16 -
      polarInfluence * 0.08 +
      cycle.hydrationBias * 0.16,
      0,
      1
    );

    var surfaceDatumBias = clamp(
      temperateInfluence * 0.24 +
      equatorInfluence * 0.10 +
      season.sunwardPressure * 0.12 -
      polarInfluence * 0.10 +
      cycle.formationBias * 0.08 +
      cycle.stabilityBias * 0.06,
      0,
      1
    );

    var cloudDatumBias = clamp(
      equatorInfluence * 0.34 +
      jetInfluence * 0.32 +
      polarCurl * 0.24 +
      polarReturn * 0.18 +
      cycle.hydrationBias * 0.12,
      0,
      1
    );

    return {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      parentInterfaceUnchanged: true,
      templateSourceContract: TEMPLATE_SOURCE_CONTRACT,
      publicCompatibilityContract: PUBLIC_COMPATIBILITY_CONTRACT,
      parentBaseline: PARENT_BASELINE,
      datumReady: true,
      childReceiveMapReady: true,
      cloneMethodActive: true,
      publicAdoptionCompatible: true,
      technicalBirthComplete: true,
      compact: true,
      longitude: lon,
      latitude: lat,
      hemisphere: hemi.name,
      hemisphereSign: hemi.sign,
      latitudeBand: latitudeBandFor(lat),
      compassKey: node.key,
      compassIndex: node.compassIndex,
      chronologyIndex: node.chronologyIndex,
      sequenceIndex: node.sequenceIndex,
      predecessorIndex: node.predecessorIndex,
      successorIndex: node.successorIndex,
      oppositeIndex: node.oppositeIndex,
      cycleRole: node.cycleRole,
      circulationRole: node.circulationRole,
      fibonacciWeight: node.fibonacciWeight,
      fibonacciPhase: node.fibonacciPhase,
      fibonacciChronologyPhase: node.fibonacciMidpoint,
      goldenAnglePhase: node.goldenAnglePhase,
      radialIndex: address.radialIndex,
      bandIndex: address.bandIndex,
      stateIndex: address.stateIndex,
      hexAddress: address.hexAddress,
      newsComplete: address.newsComplete,
      childReceiveEligible: address.childReceiveEligible,
      renderEligible: address.renderEligible,
      equatorInfluence: equatorInfluence,
      temperateInfluence: temperateInfluence,
      jetInfluence: jetInfluence,
      polarInfluence: polarInfluence,
      polarCurlInfluence: polarCurl,
      polarReturnStrength: polarReturn,
      coriolisSign: cor.sign,
      coriolisForce: cor.force,
      eastWestFlow: circ.eastWestFlow,
      northSouthFlow: circ.northSouthFlow,
      flowAngle: circ.flowAngle,
      flowMagnitude: circ.flowMagnitude,
      vorticity: circ.vorticity,
      poleAnchor: circ.poleAnchor,
      equatorialBandActive: circ.equatorialBandActive,
      hemisphereCounterflowActive: circ.hemisphereCounterflowActive,
      polarReturnActive: circ.polarReturnActive,
      polarCurlActive: circ.polarCurlActive,
      northPoleAnchorActive: circ.northPoleAnchorActive,
      southPoleAnchorActive: circ.southPoleAnchorActive,
      sunwardPressure: season.sunwardPressure,
      shadowPressure: season.shadowPressure,
      altitudeBias: altitudeBias,
      moistureDatumBias: moistureDatumBias,
      surfaceDatumBias: surfaceDatumBias,
      cloudDatumBias: cloudDatumBias,
      fibonacciChronologyApplied: true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      noCanvasCreation: true,
      rendersNothing: true,
      visualPassClaimed: false
    };
  }

  function verboseSample(lon, lat, time) {
    var compact = compactSample(lon, lat, time);
    var node = chronologyForLongitude(lon, true);
    var zone = latitudeZoneFor(lat);
    var cycle = nodeCycleBias(node);

    return Object.assign({}, compact, {
      compact: false,
      verbose: true,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      longitudeDegrees: degrees(compact.longitude),
      latitudeDegrees: degrees(compact.latitude),
      sphere: sphereFromLonLat(compact.longitude, compact.latitude),
      axis: AXIS_CACHE,
      compassNode: node,
      compassName: node.name,
      predecessorKey: node.predecessorKey,
      successorKey: node.successorKey,
      oppositeKey: node.oppositeKey,
      chronologicalContinuity: node.chronologicalContinuity,
      nodeRole: node.nodeRole,
      masterQuadrant: node.masterQuadrant,
      cardinalGroup: node.cardinalGroup,
      hemisphereDisplay: hemisphereFor(lat).display,
      latitudeZone: zone,
      news: getNews(compact.stateIndex),
      childReceivePacketCompact: getChildReceivePacket("sample-consumer", { compact: true }),
      circulation: circulationFor(lon, lat, time),
      seasonalPressure: seasonalPressureFor(lon, lat, time),
      cycleBias: cycle,
      cloudGuidance: {
        cloudDatumReady: true,
        cloudReady: false,
        latitudeBand: compact.latitudeBand,
        hemisphere: compact.hemisphere,
        compassKey: compact.compassKey,
        chronologyIndex: compact.chronologyIndex,
        altitudeBias: compact.altitudeBias,
        polarInfluence: compact.polarInfluence,
        polarCurlInfluence: compact.polarCurlInfluence,
        equatorInfluence: compact.equatorInfluence,
        jetInfluence: compact.jetInfluence,
        polarReturnStrength: compact.polarReturnStrength,
        vorticity: compact.vorticity,
        flowAngle: compact.flowAngle,
        flowMagnitude: compact.flowMagnitude,
        fibonacciChronologyApplied: true
      },
      moistureGuidance: {
        moistureDatumReady: true,
        moistureReady: false,
        compassKey: compact.compassKey,
        chronologyIndex: compact.chronologyIndex,
        equatorialUplift: compact.equatorInfluence,
        hemisphereCounterflow: compact.hemisphereCounterflowActive ? Math.abs(compact.eastWestFlow) : 0,
        polarReturnStrength: compact.polarReturnStrength,
        jetStreamEligibility: compact.jetInfluence,
        wetDryLatitudePressure: compact.moistureDatumBias,
        coriolisForce: compact.coriolisForce,
        fibonacciChronologyApplied: true
      },
      surfaceGuidance: {
        surfaceDatumReady: true,
        surfaceReady: false,
        latitudeBand: compact.latitudeBand,
        hemisphere: compact.hemisphere,
        compassKey: compact.compassKey,
        chronologyIndex: compact.chronologyIndex,
        cycleRole: compact.cycleRole,
        surfaceDatumBias: compact.surfaceDatumBias,
        polarMaterialSuppression: compact.polarInfluence,
        equatorialMaterialBoost: compact.equatorInfluence * 0.18,
        temperateMaterialBoost: compact.temperateInfluence * 0.26,
        formationMaterialBoost: cycle.formationBias * 0.12,
        stabilityMaterialBoost: cycle.stabilityBias * 0.10,
        hexAddress: compact.hexAddress,
        stateIndex: compact.stateIndex,
        fibonacciChronologyApplied: true
      },
      terrainGuidance: {
        terrainDatumReady: true,
        terrainReady: false,
        compassKey: compact.compassKey,
        chronologyIndex: compact.chronologyIndex,
        cycleRole: compact.cycleRole,
        ridgeBias: cycle.compressionBias * 0.18 + cycle.pressureBias * 0.22,
        basinBias: cycle.stabilityBias * 0.24 + cycle.hydrationBias * 0.18,
        coastalShelfBias: compact.equatorInfluence * 0.08 + compact.temperateInfluence * 0.14,
        orographicBias: compact.jetInfluence * 0.12 + cycle.pressureBias * 0.16,
        hexAddress: compact.hexAddress,
        fibonacciChronologyApplied: true
      },
      ownsRuntimeMotion: false,
      ownsCloudDrawing: false,
      ownsSurfaceDrawing: false,
      ownsTerrainTruth: false,
      ownsHtml: false,
      ownsRouteJs: false,
      generatedImage: false,
      graphicBox: false
    });
  }

  function sample(lon, lat, time, options) {
    options = options || {};

    var output = options.verbose === true
      ? verboseSample(lon, lat, time)
      : compactSample(lon, lat, time);

    state.sampleCount += 1;
    if (options.verbose === true) state.verboseSampleCount += 1;

    state.lastSample = output;

    window.AUDRALIA_TRUE_GLOBE_DATUM_LAST_SAMPLE = output.compact
      ? output
      : compactSample(lon, lat, time);

    window.AUDRALIA_G1_TRUE_GLOBE_DATUM_LAST_SAMPLE = window.AUDRALIA_TRUE_GLOBE_DATUM_LAST_SAMPLE;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM_LAST_SAMPLE = window.AUDRALIA_TRUE_GLOBE_DATUM_LAST_SAMPLE;

    return output;
  }

  function status(options) {
    options = options || {};

    var map = ensureReceiveMap();
    var verbose = options.verbose === true;

    var compactStatus = {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      templateSourceContract: TEMPLATE_SOURCE_CONTRACT,
      publicCompatibilityContract: PUBLIC_COMPATIBILITY_CONTRACT,
      parentBaseline: PARENT_BASELINE,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      initialized: state.initialized,
      datumReady: state.datumReady,
      childReceiveMapReady: state.childReceiveMapReady,
      cloneMethodActive: true,
      publicAdoptionCompatible: true,
      technicalBirthComplete: state.technicalBirthComplete,
      parentInterfaceUnchanged: true,
      newsProtocolActive: true,
      newsComplete: map.newsComplete,
      chronologyComplete: map.chronologyComplete,
      relationshipMapReady: map.relationshipMapReady,
      carrierBound: true,
      carrierRole: map.carrierRole,
      latticeRole: map.latticeRole,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: map.seats.length,
      ringCount: map.rings.length,
      radialLaneCount: map.radialLanes.length,
      axisReady: true,
      poleAuthorityReady: true,
      hemisphereAuthorityReady: true,
      equatorAuthorityReady: true,
      circulationAuthorityReady: true,
      fibonacciCompassChronologyReady: true,
      supportsReceive: true,
      supportsChildReceivePacket: true,
      supportsSeatLookup: true,
      supportsRingLookup: true,
      supportsRadialLaneLookup: true,
      supportsNewsLookup: true,
      supportsLongitudeLatitude: true,
      supportsHemisphereResolver: true,
      supportsCoriolisResolver: true,
      supportsHexAddressing: true,
      receiveBuildCount: state.receiveBuildCount,
      sampleCount: state.sampleCount,
      verboseSampleCount: state.verboseSampleCount,
      childPacketCount: state.childPacketCount,
      statusCompactByDefault: !verbose,
      verboseOnRequest: true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      rendersNothing: true,
      noCanvasCreation: true,
      ownsRuntimeMotion: false,
      ownsCloudDrawing: false,
      ownsSurfaceDrawing: false,
      ownsTerrainTruth: false,
      ownsMoistureTruth: false,
      ownsCloudTruth: false,
      ownsContinentTruth: false,
      ownsHtml: false,
      ownsRouteJs: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      errors: state.errors.slice()
    };

    if (!verbose) return compactStatus;

    return Object.assign({}, compactStatus, {
      axis: AXIS_CACHE,
      fibonacciSequence: FIBONACCI_SEQUENCE.slice(),
      fibonacciOffsets: FIBONACCI_OFFSETS.slice(),
      compassChronology: COMPASS_CHRONOLOGY.map(enrichNode),
      receiveMap: receive({ reference: true }),
      lastSample: state.lastSample,
      lastChildPacket: state.lastChildPacket
    });
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    window.AUDRALIA_TRUE_GLOBE_DATUM_ERROR = {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      process: PROCESS,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };

    return status();
  }

  function publish() {
    var api = {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      templateSourceContract: TEMPLATE_SOURCE_CONTRACT,
      publicCompatibilityContract: PUBLIC_COMPATIBILITY_CONTRACT,
      parentBaseline: PARENT_BASELINE,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      cloneMethodActive: true,
      publicAdoptionCompatible: true,
      technicalBirthComplete: true,
      parentInterfaceUnchanged: true,

      status: status,

      receive: receive,
      getReceiveMap: receive,
      childReceiveMap: receive,

      getSeat: getSeat,
      getSeatByBandRadial: getSeatByBandRadial,
      getRing: getRing,
      getRadialLane: getRadialLane,
      getOppositeSeat: getOppositeSeat,
      getFibonacciForwardSeat: getFibonacciForwardSeat,
      getFibonacciReturnSeat: getFibonacciReturnSeat,
      getNews: getNews,
      getChildReceivePacket: getChildReceivePacket,

      axis: getAxis,
      getAxis: getAxis,
      getPoles: function () {
        return {
          northPole: AXIS_CACHE.northPole,
          southPole: AXIS_CACHE.southPole,
          tiltedNorthAxis: AXIS_CACHE.tiltedNorthAxis,
          tiltedSouthAxis: AXIS_CACHE.tiltedSouthAxis,
          axisTiltRadians: AXIS_CACHE.axisTiltRadians,
          axisTiltDegrees: AXIS_CACHE.axisTiltDegrees
        };
      },

      compassChronology: function () {
        return COMPASS_CHRONOLOGY.map(enrichNode);
      },
      getCompassChronology: function () {
        return COMPASS_CHRONOLOGY.map(enrichNode);
      },
      compassNodeByIndex: function (index) {
        return enrichNode(compassNodeByIndex(index));
      },
      compassNodeForLongitude: function (lon) {
        return chronologyForLongitude(lon, true);
      },
      chronologyForLongitude: function (lon) {
        return chronologyForLongitude(lon, true);
      },

      sphereFromLonLat: sphereFromLonLat,
      lonLatFromSphere: lonLatFromSphere,
      wrapLongitude: wrapLongitude,
      clampLatitude: clampLatitude,

      hemisphereFor: hemisphereFor,
      latitudeBandFor: latitudeBandFor,
      latitudeZoneFor: latitudeZoneFor,
      bandIndexFor: bandIndexFor,
      addressFor: addressFor,

      coriolisFor: coriolisFor,
      polarInfluenceFor: polarInfluenceFor,
      polarCurlFor: polarCurlFor,
      equatorInfluenceFor: equatorInfluenceFor,
      temperateInfluenceFor: temperateInfluenceFor,
      jetInfluenceFor: jetInfluenceFor,
      polarReturnFor: polarReturnFor,
      circulationFor: circulationFor,
      seasonalPressureFor: seasonalPressureFor,

      sample: sample,
      resolve: sample,
      datumAt: sample,
      coordinateAt: sample,
      sampleDatum: sample
    };

    window.AUDRALIA_TRUE_GLOBE_DATUM = api;
    window.AUDRALIA_G1_TRUE_GLOBE_DATUM = api;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM = api;
    window.AUDRALIA_TRUE_PLANETARY_DATUM = api;
    window.AUDRALIA_G1_TRUE_PLANETARY_DATUM = api;
    window.AUDRALIA_G2_TRUE_PLANETARY_DATUM = api;

    window.AUDRALIA_TRUE_GLOBE_DATUM_RECEIVE_MAP = receive({ reference: true });
    window.AUDRALIA_G1_TRUE_GLOBE_DATUM_RECEIVE_MAP = window.AUDRALIA_TRUE_GLOBE_DATUM_RECEIVE_MAP;

    window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS = status();
    window.AUDRALIA_G1_TRUE_GLOBE_DATUM_STATUS = window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM_STATUS = window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS;

    window.AUDRALIA_TRUE_GLOBE_DATUM_BOOT = {
      contract: PUBLIC_CONTRACT,
      cloneContract: CLONE_CONTRACT,
      templateSourceContract: TEMPLATE_SOURCE_CONTRACT,
      publicCompatibilityContract: PUBLIC_COMPATIBILITY_CONTRACT,
      parentBaseline: PARENT_BASELINE,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      process: PROCESS,
      publicFrame: PUBLIC_FRAME,
      technicalReality: TECHNICAL_REALITY,
      bootedAt: new Date().toISOString(),
      initialized: state.initialized,
      datumReady: true,
      childReceiveMapReady: true,
      cloneMethodActive: true,
      publicAdoptionCompatible: true,
      technicalBirthComplete: true,
      parentInterfaceUnchanged: true,
      newsProtocolActive: true,
      newsComplete: state.newsComplete,
      chronologyComplete: state.chronologyComplete,
      relationshipMapReady: state.relationshipMapReady,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: ensureReceiveMap().seats.length,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassReady: false,
      groundLevelReady: false,
      rendersNothing: true,
      noCanvasCreation: true,
      ownsRuntimeMotion: false,
      ownsSurfaceTruth: false,
      ownsCloudTruth: false,
      ownsTerrainTruth: false,
      ownsContinentTruth: false,
      ownsHtml: false,
      ownsRouteJs: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      meaning: "Audralia datum child evaluated as a cloning-method seed: a technical birth under the same file identity, preserving the parent-facing adoption-compatible receive-map contract and API shape."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
      state.datumReady = true;
      ensureReceiveMap();
      state.technicalBirthComplete = true;
      publish();
      return status();
    } catch (error) {
      recordError("init", error);
      publish();
      return status();
    }
  }

  publish();
  init();
})();
