// /assets/audralia/clean/runtime/audralia.true-globe.datum.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_DATUM_CHILD_TRUE_POLE_AXIS_CYCLE_AUTHORITY_TNT_v1
//
// Public compatibility contract preserved:
// AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1
//
// Purpose:
// - Give Audralia definitive datum authority.
// - Define true north, true south, equator, prime meridian, axis tilt, hemisphere law, and circulation signs.
// - Provide datum math to terrain, moisture, surface, clouds, runtime, and route consumers.
// - Bind every downstream child to world-space longitude / latitude / pole authority.
// - Do not draw.
// - Do not create canvas.
// - Do not own clouds.
// - Do not own surface.
// - Do not own terrain.
// - Do not own runtime motion.
// - No generated image. No GraphicBox. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1";
  var EXECUTION_CONTRACT = "AUDRALIA_G2_DATUM_CHILD_TRUE_POLE_AXIS_CYCLE_AUTHORITY_TNT_v1";
  var STANDARD = "AUDRALIA_G2_DATUM_TRUE_POLE_AXIS_HEMISPHERE_CIRCULATION_STANDARD_v1";
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

  var state = {
    initialized: false,
    datumReady: false,
    buildCount: 0,
    sampleCount: 0,
    lastSample: null,
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

  function wrapLongitude(lon) {
    var value = finite(lon, 0);

    while (value < -Math.PI) value += TAU;
    while (value > Math.PI) value -= TAU;

    return value;
  }

  function clampLatitude(lat) {
    return clamp(lat, -HALF_PI, HALF_PI);
  }

  function degrees(radians) {
    return radians * 180 / Math.PI;
  }

  function radians(deg) {
    return deg * Math.PI / 180;
  }

  function hash3(a, b, c) {
    return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
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

  function getAxis() {
    var localNorthPole = { x: 0, y: 1, z: 0 };
    var localSouthPole = { x: 0, y: -1, z: 0 };

    var tiltedNorthAxis = unit({
      x: 0,
      y: Math.cos(AXIAL_TILT_RADIANS),
      z: Math.sin(AXIAL_TILT_RADIANS)
    });

    var tiltedSouthAxis = unit({
      x: 0,
      y: -Math.cos(AXIAL_TILT_RADIANS),
      z: -Math.sin(AXIAL_TILT_RADIANS)
    });

    return {
      datumReady: true,
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,

      axisTiltRadians: AXIAL_TILT_RADIANS,
      axisTiltDegrees: degrees(AXIAL_TILT_RADIANS),

      localNorthPole: localNorthPole,
      localSouthPole: localSouthPole,
      northPole: localNorthPole,
      southPole: localSouthPole,

      tiltedNorthAxis: tiltedNorthAxis,
      tiltedSouthAxis: tiltedSouthAxis,

      equatorLatitude: EQUATOR_LATITUDE,
      equatorPlane: {
        normal: localNorthPole,
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
      circulationAuthority: true
    };
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

  function latitudeBandFor(lat) {
    lat = clampLatitude(lat);

    var absLat = Math.abs(lat);
    var hemi = hemisphereFor(lat);

    if (absLat >= radians(72)) {
      return hemi.sign >= 0 ? "northPolarCap" : "southPolarCap";
    }

    if (absLat >= radians(58)) {
      return hemi.sign >= 0 ? "northPolarReturnBand" : "southPolarReturnBand";
    }

    if (absLat >= radians(34)) {
      return hemi.sign >= 0 ? "northJetBand" : "southJetBand";
    }

    if (absLat >= radians(14)) {
      return hemi.sign >= 0 ? "northTemperateBand" : "southTemperateBand";
    }

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

  function radialIndexFor(lon) {
    var normalized = (wrapLongitude(lon) + Math.PI) / TAU;
    return Math.floor(clamp(normalized * RADIAL_NODES, 0, RADIAL_NODES - 0.000001));
  }

  function bandIndexFor(lat) {
    var y = Math.sin(clampLatitude(lat));
    var equalArea = (1 - y) / 2;
    return Math.floor(clamp(equalArea * FIBONACCI_BANDS, 0, FIBONACCI_BANDS - 0.000001));
  }

  function addressFor(lon, lat) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);

    var radialIndex = radialIndexFor(lon);
    var bandIndex = bandIndexFor(lat);
    var stateIndex = bandIndex * RADIAL_NODES + radialIndex;
    var fibonacciPhase = fract((bandIndex / GOLDEN_RATIO) + radialIndex / RADIAL_NODES);
    var hexPhase = fract(stateIndex * GOLDEN_RATIO);

    return {
      radialIndex: radialIndex,
      bandIndex: bandIndex,
      stateIndex: stateIndex,
      latticeStates: LATTICE_STATES,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      fibonacciPhase: fibonacciPhase,
      hexPhase: hexPhase,
      cellId: "audralia:datum:" + bandIndex + ":" + radialIndex,
      hexAddress: "AU-HX-" + String(bandIndex).padStart(2, "0") + "-" + String(radialIndex).padStart(2, "0")
    };
  }

  function polarInfluenceFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    return smoothstep(radians(42), radians(82), absLat);
  }

  function polarCurlFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    return smoothstep(radians(56), radians(86), absLat);
  }

  function equatorInfluenceFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    return 1 - smoothstep(radians(5), radians(31), absLat);
  }

  function temperateInfluenceFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    var rise = smoothstep(radians(10), radians(31), absLat);
    var fall = 1 - smoothstep(radians(44), radians(68), absLat);
    return clamp(rise * fall, 0, 1);
  }

  function jetInfluenceFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    var center = radians(43);
    var spread = radians(17);
    var value = Math.exp(-Math.pow((absLat - center) / spread, 2));
    return clamp(value, 0, 1);
  }

  function polarReturnFor(lat) {
    var absLat = Math.abs(clampLatitude(lat));
    var rise = smoothstep(radians(50), radians(68), absLat);
    var fall = 1 - smoothstep(radians(84), radians(90), absLat);
    return clamp(rise * fall, 0, 1);
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

  function circulationFor(lon, lat, time) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);
    time = finite(time, 0);

    var hemi = hemisphereFor(lat);
    var cor = coriolisFor(lat);
    var equatorInfluence = equatorInfluenceFor(lat);
    var temperateInfluence = temperateInfluenceFor(lat);
    var jetInfluence = jetInfluenceFor(lat);
    var polarInfluence = polarInfluenceFor(lat);
    var polarCurl = polarCurlFor(lat);
    var polarReturn = polarReturnFor(lat);

    var wave = Math.sin(lon * 3 + time * 0.035 + hemi.sign * 0.7);
    var longitudinalPulse = Math.sin(lon * 5 - time * 0.018);

    var equatorialFlow = equatorInfluence * (0.82 + wave * 0.08);
    var jetFlow = jetInfluence * (hemi.sign >= 0 ? -0.62 : 0.62);
    var temperateCounterflow = temperateInfluence * (hemi.sign >= 0 ? -0.28 : 0.28);
    var polarCurlFlow = polarCurl * (hemi.sign >= 0 ? 0.36 : -0.36);
    var polarReturnFlow = polarReturn * (hemi.sign >= 0 ? -0.24 : 0.24);

    var eastWestFlow = equatorialFlow + jetFlow + temperateCounterflow + polarCurlFlow + polarReturnFlow;
    var northSouthFlow =
      equatorInfluence * 0.04 * wave +
      temperateInfluence * -hemi.sign * 0.12 +
      jetInfluence * hemi.sign * 0.08 +
      polarReturn * -hemi.sign * 0.34 +
      polarCurl * hemi.sign * 0.10 * longitudinalPulse;

    var vorticity =
      cor.force * 0.28 +
      jetInfluence * cor.sign * 0.22 +
      polarCurl * cor.sign * 0.62 +
      equatorInfluence * longitudinalPulse * 0.06;

    return {
      circulationReady: true,
      hemisphere: hemi.name,
      hemisphereSign: hemi.sign,

      equatorialFlow: equatorialFlow,
      jetFlow: jetFlow,
      temperateCounterflow: temperateCounterflow,
      polarCurlFlow: polarCurlFlow,
      polarReturnFlow: polarReturnFlow,

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

      longitudinalPulse: longitudinalPulse,
      circulationWave: wave
    };
  }

  function seasonalPressureFor(lon, lat, time) {
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);
    time = finite(time, 0);

    var seasonalPhase = Math.sin(time * 0.003 + lon * 0.25);
    var tiltBias = Math.sin(lat) * Math.sin(AXIAL_TILT_RADIANS);
    var sunwardPressure = clamp(0.50 + seasonalPhase * 0.18 + tiltBias * 0.32, 0, 1);
    var shadowPressure = 1 - sunwardPressure;

    return {
      seasonalPressureReady: true,
      seasonalPhase: seasonalPhase,
      tiltBias: tiltBias,
      sunwardPressure: sunwardPressure,
      shadowPressure: shadowPressure,
      axialSeasonalityPresent: true
    };
  }

  function sample(lon, lat, time, options) {
    options = options || {};
    lon = wrapLongitude(lon);
    lat = clampLatitude(lat);
    time = finite(time, 0);

    var axis = getAxis();
    var hemi = hemisphereFor(lat);
    var zone = latitudeZoneFor(lat);
    var address = addressFor(lon, lat);
    var cor = coriolisFor(lat);
    var circulation = circulationFor(lon, lat, time);
    var season = seasonalPressureFor(lon, lat, time);
    var sphere = sphereFromLonLat(lon, lat);

    var polarInfluence = polarInfluenceFor(lat);
    var polarCurl = polarCurlFor(lat);
    var equatorInfluence = equatorInfluenceFor(lat);
    var temperateInfluence = temperateInfluenceFor(lat);
    var jetInfluence = jetInfluenceFor(lat);
    var polarReturn = polarReturnFor(lat);

    var altitudeBias =
      equatorInfluence * 0.16 +
      jetInfluence * 0.22 +
      polarReturn * 0.18 +
      polarCurl * 0.10;

    var moistureDatumBias =
      equatorInfluence * 0.42 +
      temperateInfluence * 0.24 +
      polarReturn * 0.16 -
      polarInfluence * 0.08;

    var surfaceDatumBias =
      temperateInfluence * 0.24 +
      equatorInfluence * 0.10 +
      season.sunwardPressure * 0.12 -
      polarInfluence * 0.10;

    var cloudDatumBias =
      equatorInfluence * 0.34 +
      jetInfluence * 0.32 +
      polarCurl * 0.24 +
      polarReturn * 0.18;

    var resolved = {
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      datumReady: true,
      axisReady: true,
      poleAuthorityReady: true,
      hemisphereAuthorityReady: true,
      equatorAuthorityReady: true,
      circulationAuthorityReady: true,

      longitude: lon,
      latitude: lat,
      longitudeDegrees: degrees(lon),
      latitudeDegrees: degrees(lat),

      sphere: sphere,

      axis: axis,
      northPole: axis.northPole,
      southPole: axis.southPole,
      tiltedNorthAxis: axis.tiltedNorthAxis,
      tiltedSouthAxis: axis.tiltedSouthAxis,
      axisTiltRadians: AXIAL_TILT_RADIANS,
      axisTiltDegrees: degrees(AXIAL_TILT_RADIANS),
      primeMeridianLongitude: PRIME_MERIDIAN_LONGITUDE,
      equatorLatitude: EQUATOR_LATITUDE,

      hemisphere: hemi.name,
      hemisphereDisplay: hemi.display,
      hemisphereSign: hemi.sign,
      poleAnchor: circulation.poleAnchor,

      latitudeBand: zone.latitudeBand,
      longitudeBand: address.radialIndex,
      radialIndex: address.radialIndex,
      bandIndex: address.bandIndex,
      stateIndex: address.stateIndex,
      latticeStates: LATTICE_STATES,
      hexAddress: address.hexAddress,
      cellId: address.cellId,
      fibonacciPhase: address.fibonacciPhase,
      hexPhase: address.hexPhase,

      equatorInfluence: equatorInfluence,
      temperateInfluence: temperateInfluence,
      jetInfluence: jetInfluence,
      polarInfluence: polarInfluence,
      polarCurlInfluence: polarCurl,
      polarReturnStrength: polarReturn,

      northPolarInfluence: lat > 0 ? polarInfluence : 0,
      southPolarInfluence: lat < 0 ? polarInfluence : 0,
      northPolarCurlInfluence: lat > 0 ? polarCurl : 0,
      southPolarCurlInfluence: lat < 0 ? polarCurl : 0,

      coriolisSign: cor.sign,
      coriolisMagnitude: cor.magnitude,
      coriolisForce: cor.force,

      circulation: circulation,
      eastWestFlow: circulation.eastWestFlow,
      northSouthFlow: circulation.northSouthFlow,
      flowAngle: circulation.flowAngle,
      flowMagnitude: circulation.flowMagnitude,
      vorticity: circulation.vorticity,
      vorticitySign: circulation.vorticitySign,

      equatorialBandActive: circulation.equatorialBandActive,
      hemisphereCounterflowActive: circulation.hemisphereCounterflowActive,
      polarReturnActive: circulation.polarReturnActive,
      polarCurlActive: circulation.polarCurlActive,
      northPoleAnchorActive: circulation.northPoleAnchorActive,
      southPoleAnchorActive: circulation.southPoleAnchorActive,

      seasonalPressure: season,
      sunwardPressure: season.sunwardPressure,
      shadowPressure: season.shadowPressure,

      altitudeBias: clamp(altitudeBias, 0, 1),
      moistureDatumBias: clamp(moistureDatumBias, 0, 1),
      surfaceDatumBias: clamp(surfaceDatumBias, 0, 1),
      cloudDatumBias: clamp(cloudDatumBias, 0, 1),

      cloudGuidance: {
        cloudDatumReady: true,
        latitudeBand: zone.latitudeBand,
        hemisphere: hemi.name,
        bandRole: zone.latitudeBand,
        altitudeBias: clamp(altitudeBias, 0, 1),
        polarInfluence: polarInfluence,
        polarCurlInfluence: polarCurl,
        equatorInfluence: equatorInfluence,
        jetInfluence: jetInfluence,
        polarReturnStrength: polarReturn,
        vorticity: circulation.vorticity,
        flowAngle: circulation.flowAngle,
        flowMagnitude: circulation.flowMagnitude,
        northPoleAnchorActive: circulation.northPoleAnchorActive,
        southPoleAnchorActive: circulation.southPoleAnchorActive
      },

      moistureGuidance: {
        moistureDatumReady: true,
        equatorialUplift: equatorInfluence,
        hemisphereCounterflow: circulation.hemisphereCounterflowActive ? Math.abs(circulation.eastWestFlow) : 0,
        polarReturnStrength: polarReturn,
        jetStreamEligibility: jetInfluence,
        wetDryLatitudePressure: clamp(moistureDatumBias, 0, 1),
        coriolisForce: cor.force
      },

      surfaceGuidance: {
        surfaceDatumReady: true,
        latitudeBand: zone.latitudeBand,
        hemisphere: hemi.name,
        surfaceDatumBias: clamp(surfaceDatumBias, 0, 1),
        polarMaterialSuppression: polarInfluence,
        equatorialMaterialBoost: equatorInfluence * 0.18,
        temperateMaterialBoost: temperateInfluence * 0.26,
        hexAddress: address.hexAddress,
        stateIndex: address.stateIndex
      },

      noCanvasCreation: true,
      ownsRuntimeMotion: false,
      ownsCloudDrawing: false,
      ownsSurfaceDrawing: false,
      ownsTerrainTruth: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };

    state.sampleCount += 1;
    state.lastSample = resolved;
    window.AUDRALIA_TRUE_GLOBE_DATUM_LAST_SAMPLE = resolved;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM_LAST_SAMPLE = resolved;

    return resolved;
  }

  function buildDatumField(time) {
    time = finite(time, 0);

    var seats = [];
    var bands = [];
    var radial = [];
    var index = 0;

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      var bandSeats = [];
      var v = (band + 0.5) / FIBONACCI_BANDS;
      var lat = Math.asin(clamp(1 - 2 * v, -1, 1));
      var stagger = fract(band / GOLDEN_RATIO) * TAU / RADIAL_NODES;

      for (var r = 0; r < RADIAL_NODES; r += 1) {
        var lon = wrapLongitude((r / RADIAL_NODES) * TAU - Math.PI + stagger);
        var datum = sample(lon, lat, time, { source: "buildDatumField" });

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

    state.buildCount += 1;
    state.lastField = field;

    window.AUDRALIA_TRUE_GLOBE_DATUM_FIELD = field;
    window.AUDRALIA_G2_TRUE_GLOBE_DATUM_FIELD = field;

    return field;
  }

  function status() {
    return {
      contract: CONTRACT,
      executionContract: EXECUTION_CONTRACT,
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

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      axisTiltRadians: AXIAL_TILT_RADIANS,
      axisTiltDegrees: degrees(AXIAL_TILT_RADIANS),
      primeMeridianLongitude: PRIME_MERIDIAN_LONGITUDE,
      equatorLatitude: EQUATOR_LATITUDE,

      northPole: getAxis().northPole,
      southPole: getAxis().southPole,
      tiltedNorthAxis: getAxis().tiltedNorthAxis,
      tiltedSouthAxis: getAxis().tiltedSouthAxis,

      supportsLongitudeLatitude: true,
      supportsHemisphereResolver: true,
      supportsCoriolisResolver: true,
      supportsPolarInfluence: true,
      supportsEquatorInfluence: true,
      supportsLatitudeBands: true,
      supportsLongitudeBands: true,
      supportsHexAddressing: true,
      supportsDatumFieldBuild: true,

      northPoleAnchorActive: true,
      southPoleAnchorActive: true,
      equatorialBandActive: true,
      hemisphereCounterflowActive: true,
      polarCurlAuthority: true,

      buildCount: state.buildCount,
      sampleCount: state.sampleCount,
      lastSample: state.lastSample,

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
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      status: status,

      axis: getAxis,
      getAxis: getAxis,
      getPoles: function () {
        var axis = getAxis();
        return {
          northPole: axis.northPole,
          southPole: axis.southPole,
          tiltedNorthAxis: axis.tiltedNorthAxis,
          tiltedSouthAxis: axis.tiltedSouthAxis,
          axisTiltRadians: axis.axisTiltRadians,
          axisTiltDegrees: axis.axisTiltDegrees
        };
      },

      sphereFromLonLat: sphereFromLonLat,
      lonLatFromSphere: lonLatFromSphere,
      wrapLongitude: wrapLongitude,
      clampLatitude: clampLatitude,

      hemisphereFor: hemisphereFor,
      latitudeBandFor: latitudeBandFor,
      latitudeZoneFor: latitudeZoneFor,
      radialIndexFor: radialIndexFor,
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
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      datumReady: true,
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
      meaning: "Audralia datum child evaluated. True pole, axis, hemisphere, equator, Coriolis, and circulation authority are available to downstream children."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
      state.datumReady = true;

      publish();
      sample(0, 0, 0, { source: "init" });

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
