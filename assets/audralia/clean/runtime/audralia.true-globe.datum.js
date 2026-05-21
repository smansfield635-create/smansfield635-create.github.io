// /assets/audralia/clean/runtime/audralia.true-globe.datum.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_DATUM_CHRONOLOGY_PERFORMANCE_CONTAINMENT_TNT_v1
//
// Public compatibility contract preserved:
// AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1
//
// Purpose:
// - Preserve Fibonacci 16-compass chronology.
// - Preserve true pole / axis / equator / hemisphere / Coriolis / circulation authority.
// - Contain datum performance cost for mobile runtime and lattice drag.
// - Make datum passive, cached, compact by default, and verbose only on request.
// - Do not build the 256 datum field during boot.
// - Do not return huge nested objects from status() or sample() by default.
// - Do not draw.
// - Do not create canvas.
// - Do not own runtime motion, clouds, surface, terrain, HTML, or route JS.
// - No generated image. No GraphicBox. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1";
  var EXECUTION_CONTRACT = "AUDRALIA_G2_DATUM_CHRONOLOGY_PERFORMANCE_CONTAINMENT_TNT_v1";
  var PREVIOUS_EXECUTION_CONTRACT = "AUDRALIA_G2_DATUM_FIBONACCI_16_COMPASS_CHRONOLOGY_TNT_v1";
  var STANDARD = "AUDRALIA_G2_DATUM_CHRONOLOGY_PERFORMANCE_CONTAINMENT_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";

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

  var FIBONACCI_WEIGHTS_16 = [
    1, 1, 2, 3,
    5, 8, 13, 21,
    34, 55, 89, 144,
    233, 377, 610, 987
  ];

  var COMPASS_16_BASE = [
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
  ];

  var state = {
    initialized: false,
    datumReady: false,
    buildCount: 0,
    sampleCount: 0,
    verboseSampleCount: 0,
    lastSample: null,
    lastCompactSample: null,
    lastField: null,
    errors: []
  };

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
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

  function wrapLongitude(lon) {
    var value = finite(lon, 0);
    while (value < -Math.PI) value += TAU;
    while (value > Math.PI) value -= TAU;
    return value;
  }

  function clampLatitude(lat) {
    return clamp(lat, -HALF_PI, HALF_PI);
  }

  function modulo(index, count) {
    return ((index % count) + count) % count;
  }

  function sum(values) {
    var total = 0;
    for (var i = 0; i < values.length; i += 1) total += values[i];
    return total;
  }

  function unit(vector) {
    var x = finite(vector && vector.x, 0);
    var y = finite(vector && vector.y, 0);
    var z = finite(vector && vector.z, 0);
    var length = Math.sqrt(x * x + y * y + z * z) || 1;
    return { x: x / length, y: y / length, z: z / length };
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

  var AXIS_CACHE = {
    datumReady: true,
    contract: CONTRACT,
    executionContract: EXECUTION_CONTRACT,
    axisTiltRadians: AXIAL_TILT_RADIANS,
    axisTiltDegrees: degrees(AXIAL_TILT_RADIANS),
    localNorthPole: { x: 0, y: 1, z: 0 },
    localSouthPole: { x: 0, y: -1, z: 0 },
    northPole: { x: 0, y: 1, z: 0 },
    southPole: { x: 0, y: -1, z: 0 },
    tiltedNorthAxis: unit({
      x: 0,
      y: Math.cos(AXIAL_TILT_RADIANS),
      z: Math.sin(AXIAL_TILT_RADIANS)
    }),
    tiltedSouthAxis: unit({
      x: 0,
      y: -Math.cos(AXIAL_TILT_RADIANS),
      z: -Math.sin(AXIAL_TILT_RADIANS)
    }),
    equatorLatitude: EQUATOR_LATITUDE,
    equatorPlane: {
      normal: { x: 0, y: 1, z: 0 },
      latitude: EQUATOR_LATITUDE
    },
    primeMeridianLongitude: PRIME_MERIDIAN_LONGITUDE,
    primeMeridianPlane: {
      longitude: PRIME_MERIDIAN_LONGITUDE,
      normal: { x: 0, y: 0, z: 1 }
    },
    northSouthAuthority: true,
    equatorAuthority: true,
    hemisphereAuthority: true,
    polarAuthority: true,
    circulationAuthority: true,
    fibonacciCompassChronologyAuthority: true
  };

  function getAxis() {
    return AXIS_CACHE;
  }

  function buildCompassChronologyCompact() {
    var totalWeight = sum(FIBONACCI_WEIGHTS_16);
    var cumulative = 0;
    var out = [];

    for (var index = 0; index < COMPASS_16_BASE.length; index += 1) {
      var row = COMPASS_16_BASE[index];
      var weight = FIBONACCI_WEIGHTS_16[index];
      var previousIndex = modulo(index - 1, RADIAL_NODES);
      var nextIndex = modulo(index + 1, RADIAL_NODES);
      var oppositeIndex = modulo(index + 8, RADIAL_NODES);
      var angularStep = TAU / RADIAL_NODES;
      var longitudeCenter = wrapLongitude(PRIME_MERIDIAN_LONGITUDE + index * angularStep);
      var fibonacciStart = cumulative / totalWeight;
      cumulative += weight;
      var fibonacciEnd = cumulative / totalWeight;

      out.push({
        compassIndex: index,
        chronologyIndex: index,
        sequenceIndex: index + 1,
        key: row[0],
        name: row[1],
        nodeRole: row[2],
        circulationRole: row[3],
        cycleRole: row[4],
        predecessorIndex: previousIndex,
        successorIndex: nextIndex,
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
      });
    }

    return out;
  }

  var COMPASS_CHRONOLOGY = buildCompassChronologyCompact();

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
      return { name: "north", sign: 1, display: "Northern Hemisphere", pole: "north" };
    }

    if (lat < radians(-3.5)) {
      return { name: "south", sign: -1, display: "Southern Hemisphere", pole: "south" };
    }

    return { name: "equatorial", sign: 0, display: "Equatorial Belt", pole: "balanced" };
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

  function addressFor(lon, lat, verbose) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);

    var node = chronologyForLongitude(lon, verbose);
    var radialIndex = node.compassIndex;
    var bandIndex = bandIndexFor(lat);
    var stateIndex = bandIndex * RADIAL_NODES + radialIndex;

    var result = {
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
      cellId: "audralia:datum:" + bandIndex + ":" + radialIndex,
      hexAddress: "AU-HX-" + String(bandIndex).padStart(2, "0") + "-" + String(radialIndex).padStart(2, "0")
    };

    if (verbose) {
      result.predecessorKey = node.predecessorKey;
      result.successorKey = node.successorKey;
      result.oppositeKey = node.oppositeKey;
      result.nodeRole = node.nodeRole;
      result.cycleRole = node.cycleRole;
      result.circulationRole = node.circulationRole;
      result.masterQuadrant = node.masterQuadrant;
      result.cardinalGroup = node.cardinalGroup;
      result.chronologicalContinuity = node.chronologicalContinuity;
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
    var address = addressFor(lon, lat, false);
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
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
      datumReady: true,
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
      noCanvasCreation: true,
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
      previousExecutionContract: PREVIOUS_EXECUTION_CONTRACT,
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
      circulation: circulationFor(lon, lat, time),
      seasonalPressure: seasonalPressureFor(lon, lat, time),
      cycleBias: cycle,
      cloudGuidance: {
        cloudDatumReady: true,
        latitudeBand: compact.latitudeBand,
        hemisphere: compact.hemisphere,
        compassKey: compact.compassKey,
        chronologyIndex: compact.chronologyIndex,
        bandRole: compact.latitudeBand,
        cycleRole: compact.cycleRole,
        circulationRole: compact.circulationRole,
        altitudeBias: compact.altitudeBias,
        polarInfluence: compact.polarInfluence,
        polarCurlInfluence: compact.polarCurlInfluence,
        equatorInfluence: compact.equatorInfluence,
        jetInfluence: compact.jetInfluence,
        polarReturnStrength: compact.polarReturnStrength,
        vorticity: compact.vorticity,
        flowAngle: compact.flowAngle,
        flowMagnitude: compact.flowMagnitude,
        northPoleAnchorActive: compact.northPoleAnchorActive,
        southPoleAnchorActive: compact.southPoleAnchorActive,
        fibonacciChronologyApplied: true
      },
      moistureGuidance: {
        moistureDatumReady: true,
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
    state.lastCompactSample = output.compact ? output : compactSample(lon, lat, time);

    window.AUDRALIA_TRUE_GLOBE_DATUM_LAST_SAMPLE = state.lastCompactSample;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM_LAST_SAMPLE = state.lastCompactSample;

    return output;
  }

  function buildDatumField(time, options) {
    options = options || {};
    time = finite(time, 0);

    var seats = [];
    var bands = [];
    var radial = [];
    var index = 0;
    var verbose = options.verbose === true;

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      var bandSeats = [];
      var v = (band + 0.5) / FIBONACCI_BANDS;
      var lat = Math.asin(clamp(1 - 2 * v, -1, 1));

      for (var r = 0; r < RADIAL_NODES; r += 1) {
        var node = compassNodeByIndex(r);
        var lon = node.longitudeCenter;
        var datum = sample(lon, lat, time, { verbose: verbose });

        datum.stateIndex = index;
        datum.radialIndex = r;
        datum.bandIndex = band;
        datum.cellId = "audralia:datum:" + band + ":" + r;
        datum.hexAddress = "AU-HX-" + String(band).padStart(2, "0") + "-" + String(r).padStart(2, "0");

        seats.push(datum);
        bandSeats.push(datum);
        radial[r] = radial[r] || [];
        radial[r].push(datum);
        index += 1;
      }

      bands.push(bandSeats);
    }

    var field = {
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
      standard: STANDARD,
      datumFieldReady: true,
      lazyBuild: true,
      verbose: verbose,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seats: seats,
      bands: bands,
      radial: radial,
      time: time,
      builtAt: new Date().toISOString(),
      northPoleAnchorActive: true,
      southPoleAnchorActive: true,
      equatorAuthority: true,
      hemisphereCounterflowAuthority: true,
      polarCurlAuthority: true,
      hexDatumCompatible: true,
      visualPassClaimed: false
    };

    if (verbose) field.compassChronology = COMPASS_CHRONOLOGY.map(enrichNode);

    state.buildCount += 1;
    state.lastField = field;

    window.AUDRALIA_TRUE_GLOBE_DATUM_FIELD = field;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM_FIELD = field;

    return field;
  }

  function status(options) {
    options = options || {};
    var verbose = options.verbose === true;

    var compactStatus = {
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
      previousExecutionContract: PREVIOUS_EXECUTION_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      initialized: state.initialized,
      datumReady: state.datumReady,
      axisReady: true,
      poleAuthorityReady: true,
      hemisphereAuthorityReady: true,
      equatorAuthorityReady: true,
      circulationAuthorityReady: true,
      fibonacciCompassChronologyReady: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      axisTiltRadians: AXIAL_TILT_RADIANS,
      axisTiltDegrees: degrees(AXIAL_TILT_RADIANS),
      primeMeridianLongitude: PRIME_MERIDIAN_LONGITUDE,
      equatorLatitude: EQUATOR_LATITUDE,
      compassChronologyCount: COMPASS_CHRONOLOGY.length,
      fibonacciChronologyApplied: true,
      supportsLongitudeLatitude: true,
      supportsHemisphereResolver: true,
      supportsCoriolisResolver: true,
      supportsPolarInfluence: true,
      supportsEquatorInfluence: true,
      supportsLatitudeBands: true,
      supportsHexAddressing: true,
      supportsDatumFieldBuild: true,
      supportsCompassChronology: true,
      buildDatumFieldLazy: true,
      noBuildFieldOnInit: true,
      statusCompact: !verbose,
      sampleCompactByDefault: true,
      verboseSampleAvailable: true,
      northPoleAnchorActive: true,
      southPoleAnchorActive: true,
      equatorialBandActive: true,
      hemisphereCounterflowActive: true,
      polarCurlAuthority: true,
      buildCount: state.buildCount,
      sampleCount: state.sampleCount,
      verboseSampleCount: state.verboseSampleCount,
      noCanvasCreation: true,
      ownsRuntimeMotion: false,
      ownsCloudDrawing: false,
      ownsSurfaceDrawing: false,
      ownsTerrainTruth: false,
      ownsHtml: false,
      ownsRouteJs: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      errors: state.errors.slice()
    };

    if (!verbose) return compactStatus;

    return Object.assign({}, compactStatus, {
      northPole: AXIS_CACHE.northPole,
      southPole: AXIS_CACHE.southPole,
      tiltedNorthAxis: AXIS_CACHE.tiltedNorthAxis,
      tiltedSouthAxis: AXIS_CACHE.tiltedSouthAxis,
      fibonacciWeights: FIBONACCI_WEIGHTS_16.slice(),
      compassChronology: COMPASS_CHRONOLOGY.map(enrichNode),
      lastSample: state.lastSample,
      lastFieldAvailable: Boolean(state.lastField)
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
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };

    return status();
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
      previousExecutionContract: PREVIOUS_EXECUTION_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      status: status,

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
      addressFor: function (lon, lat, options) {
        return addressFor(lon, lat, Boolean(options && options.verbose));
      },

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
      sampleDatum: sample,

      buildDatumField: buildDatumField,
      buildField: buildDatumField
    };

    window.AUDRALIA_TRUE_GLOBE_DATUM = api;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM = api;
    window.AUDRALIA_TRUE_PLANETARY_DATUM = api;
    window.AUDRALIA_G2_TRUE_PLANETARY_DATUM = api;

    window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM_STATUS = status();

    window.AUDRALIA_TRUE_GLOBE_DATUM_BOOT = {
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
      previousExecutionContract: PREVIOUS_EXECUTION_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      datumReady: true,
      fibonacciCompassChronologyReady: true,
      compassChronologyCount: COMPASS_CHRONOLOGY.length,
      buildDatumFieldLazy: true,
      noBuildFieldOnInit: true,
      statusCompact: true,
      sampleCompactByDefault: true,
      verboseSampleAvailable: true,
      northPoleAnchorActive: true,
      southPoleAnchorActive: true,
      equatorAuthority: true,
      hemisphereCounterflowAuthority: true,
      polarCurlAuthority: true,
      hexDatumCompatible: true,
      noCanvasCreation: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      meaning: "Audralia datum child evaluated. Fibonacci chronology and 16-compass authority are preserved, but heavy 256-field construction is lazy/manual and sample/status are compact by default."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
      state.datumReady = true;
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
