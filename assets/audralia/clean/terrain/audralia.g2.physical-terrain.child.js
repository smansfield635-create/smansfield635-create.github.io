// /assets/audralia/clean/terrain/audralia.g2.physical-terrain.child.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_TNT_v1
//
// Scope:
// G2 physical terrain child only.
//
// Source authority:
// AUDRALIA_TRUE_GLOBE_DATUM
//
// Parent datum contract:
// AUDRALIA_G2_DATUM_256_UNIQUE_CHRONOLOGICAL_COMPASS_SEATS_TNT_v1
//
// Purpose:
// - Consume the G2 datum child receive packet.
// - Convert 256 unique chronological compass seats into 256 dry physical terrain seats.
// - Preserve datum identity on every terrain seat.
// - Build dry elevation, ridge, basin, valley, shelf, former hydrosphere carving, and future-fill fields.
// - Publish carrier-safe terrain packet.
// - Render nothing.
// - Create no canvas.
// - Activate no hydration.
// - Claim no visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_NEWS_ALIGNMENT_v1";
  var CCR = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_CCR_v1";

  var PARENT_DATUM_CONTRACT = "AUDRALIA_G2_DATUM_256_UNIQUE_CHRONOLOGICAL_COMPASS_SEATS_TNT_v1";
  var SOURCE_GLOBAL = "AUDRALIA_TRUE_GLOBE_DATUM";
  var CHILD_NAME = "audralia-g2-physical-terrain-child";

  var FAMILY = "/assets/audralia/clean/terrain/";
  var FILE = "/assets/audralia/clean/terrain/audralia.g2.physical-terrain.child.js";

  var TERRAIN_SEAT_COUNT = 256;
  var SEQUENCE_COUNT = 16;
  var NODE_COUNT = 16;
  var FORMER_SEA_LEVEL_DATUM = 0.48;
  var TAU = Math.PI * 2;

  var TERRAIN_CLASSES = Object.freeze([
    "summit_pressure_zone",
    "mountain_belt",
    "ridge_chain",
    "highland_mass",
    "upland_plateau",
    "stable_craton",
    "valley_corridor",
    "dry_basin_floor",
    "trench_corridor",
    "shelf_terrace",
    "escarpment_rim",
    "lowland_gap",
    "former_seabed",
    "future_fill_candidate"
  ]);

  var ROLE_GROUPS = Object.freeze({
    ridge: Object.freeze(["summit_pressure_zone", "mountain_belt", "ridge_chain", "highland_mass"]),
    basin: Object.freeze(["dry_basin_floor", "former_seabed", "future_fill_candidate"]),
    valley: Object.freeze(["valley_corridor", "lowland_gap"]),
    shelf: Object.freeze(["shelf_terrace", "escarpment_rim"]),
    stable: Object.freeze(["upland_plateau", "stable_craton"])
  });

  var state = {
    initialized: false,

    datumDetected: false,
    datumValidated: false,
    datumApiComplete: false,
    datumFailureReason: "datum not checked",
    datumStatus: null,
    datumReceivePacket: null,

    terrainSeatRegistry: [],
    terrainSeatByKey: {},
    terrainSeatByDatumKey: {},

    terrainPacket: null,
    carrierTerrainPacket: null,
    acceptanceReceipt: null,

    terrainPacketReady: false,
    carrierTerrainPacketReady: false,
    childReceivePacketReady: false,

    buildCount: 0,
    childPacketCount: 0,
    lastChildPacket: null,
    errors: []
  };

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round(finite(value, 0) * scale) / scale;
  }

  function modulo(value, count) {
    return ((Math.round(finite(value, 0)) % count) + count) % count;
  }

  function fract(value) {
    return finite(value, 0) - Math.floor(finite(value, 0));
  }

  function safeClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    return message;
  }

  function safeCall(scope, api, method) {
    if (!api || typeof api[method] !== "function") return null;

    try {
      return api[method].apply(api, Array.prototype.slice.call(arguments, 3));
    } catch (error) {
      recordError(scope + "." + method, error);
      return null;
    }
  }

  function terrainSeatKey(index) {
    return "AUDRALIA-G2-TERRAIN-SEAT-" + String(index).padStart(3, "0");
  }

  function valueFromSeat(seat, key, fallback) {
    return finite(seat && seat[key], fallback);
  }

  function normalizeDatumSeats(packet) {
    if (!packet) return [];

    if (Array.isArray(packet.seats)) return packet.seats;
    if (packet.receiveMap && Array.isArray(packet.receiveMap.seats)) return packet.receiveMap.seats;
    if (Array.isArray(packet.chronologicalSeatRegistry)) return packet.chronologicalSeatRegistry;

    return [];
  }

  function detectDatum() {
    var api = typeof window !== "undefined" ? window[SOURCE_GLOBAL] : null;
    var status = null;
    var packet = null;
    var seats = [];

    state.datumDetected = Boolean(api);
    state.datumApiComplete = Boolean(
      api &&
      typeof api.getChildReceivePacket === "function" &&
      typeof api.status === "function"
    );

    state.datumStatus = null;
    state.datumReceivePacket = null;
    state.datumValidated = false;

    if (!state.datumDetected) {
      state.datumFailureReason = "AUDRALIA_TRUE_GLOBE_DATUM missing";
      return false;
    }

    if (!state.datumApiComplete) {
      state.datumFailureReason = "AUDRALIA_TRUE_GLOBE_DATUM API incomplete";
      return false;
    }

    status = safeCall("datum", api, "status", { verbose: false });
    packet = safeCall("datum", api, "getChildReceivePacket", CHILD_NAME, { compact: false });

    if (!packet && typeof api.receive === "function") {
      packet = safeCall("datum", api, "receive", { compact: false });
    }

    seats = normalizeDatumSeats(packet);

    state.datumStatus = status;
    state.datumReceivePacket = packet;

    state.datumValidated = Boolean(
      packet &&
      seats.length === TERRAIN_SEAT_COUNT &&
      (
        packet.acceptancePassed === true ||
        (packet.acceptanceReceipt && packet.acceptanceReceipt.acceptancePassed === true) ||
        (status && status.acceptancePassed === true)
      ) &&
      (
        packet.chronologicalSeatRegistryReady === true ||
        (status && status.chronologicalSeatRegistryReady === true)
      ) &&
      (
        packet.compassLaneRegistryReady === true ||
        (status && status.compassLaneRegistryReady === true)
      ) &&
      (
        packet.sequenceVersionRegistryReady === true ||
        (status && status.sequenceVersionRegistryReady === true)
      ) &&
      (
        packet.colorRegistryReady === true ||
        (status && status.colorRegistryReady === true)
      ) &&
      (
        packet.ackStackComplete === true ||
        (status && status.ackStackComplete === true)
      ) &&
      (
        packet.newsComplete === true ||
        (status && status.newsComplete === true)
      ) &&
      seats.every(function (seat) {
        return Boolean(
          seat &&
          seat.chronologicalSeatKey &&
          seat.sequenceCompassKey &&
          seat.sequenceVersion !== undefined &&
          seat.nodeIndex !== undefined &&
          seat.chronologicalSeatIndex !== undefined &&
          seat.compassKey &&
          seat.laneColorKey &&
          seat.versionColorKey &&
          seat.combinedColorIdentity &&
          seat.news &&
          seat.ackStack &&
          seat.childReceiveEligible === true &&
          seat.renderEligible === true &&
          seat.renderEligibilityMode === "math-only" &&
          seat.visualPassClaimed !== true
        );
      })
    );

    state.datumFailureReason = state.datumValidated ? "" : "datum receive packet failed G2 terrain-child validation";
    return state.datumValidated;
  }

  function sequencePressure(seat) {
    var sequenceVersion = valueFromSeat(seat, "sequenceVersion", 0);
    var normalized = sequenceVersion / Math.max(1, SEQUENCE_COUNT - 1);
    var polarDistance = Math.abs(normalized - 0.5) * 2;
    var fibonacci = clamp01(valueFromSeat(seat, "fibonacciPhase", 0.35));

    return clamp01(polarDistance * 0.34 + fibonacci * 0.38 + (1 - Math.abs(0.5 - normalized)) * 0.18);
  }

  function compassPressure(seat) {
    var lane = valueFromSeat(seat, "compassLaneIndex", valueFromSeat(seat, "nodeIndex", 0));
    var angle = (lane / NODE_COUNT) * TAU;
    var cardinal = lane % 4 === 0 ? 0.22 : lane % 2 === 0 ? 0.12 : 0.06;

    return {
      northSouth: round((Math.cos(angle) + 1) / 2, 4),
      eastWest: round((Math.sin(angle) + 1) / 2, 4),
      diagonal: round(lane % 2 === 0 ? 0.42 : 0.68, 4),
      cardinalBoost: cardinal,
      angle: angle
    };
  }

  function newsPressure(seat) {
    var news = seat && seat.news ? seat.news : {};
    var northBoundary = news.north && news.north.boundary ? 0.18 : 0;
    var southBoundary = news.south && news.south.boundary ? 0.18 : 0;
    var westOpposite = news.west && Number.isInteger(news.west.oppositeSeatIndex) ? 0.12 : 0;
    var eastForward = news.east && Number.isInteger(news.east.successorSeatIndex) ? 0.10 : 0;

    return clamp01(northBoundary + southBoundary + westOpposite + eastForward);
  }

  function buildPressureProfile(seat) {
    var sequenceVersion = valueFromSeat(seat, "sequenceVersion", 0);
    var nodeIndex = valueFromSeat(seat, "nodeIndex", 0);
    var compassLaneIndex = valueFromSeat(seat, "compassLaneIndex", nodeIndex);
    var chrono = valueFromSeat(seat, "chronologicalSeatIndex", sequenceVersion * 16 + nodeIndex);
    var fibonacci = clamp01(valueFromSeat(seat, "fibonacciPhase", fract((chrono + 1) * 0.61803398875)));
    var golden = clamp01(valueFromSeat(seat, "goldenAnglePhase", fract((chrono + 1) * 0.38196601125)));
    var seq = sequencePressure(seat);
    var compass = compassPressure(seat);
    var news = newsPressure(seat);

    var axial = Math.abs((sequenceVersion / Math.max(1, SEQUENCE_COUNT - 1)) - 0.5) * 2;
    var equatorial = 1 - axial;
    var laneWave = (Math.sin((compassLaneIndex / NODE_COUNT) * TAU * 2.0) + 1) / 2;
    var diagonalWave = (Math.cos(((nodeIndex + sequenceVersion) / NODE_COUNT) * TAU * 1.618) + 1) / 2;
    var fractureWave = (Math.sin((chrono + 3) * 1.61803398875) + 1) / 2;

    var chronologyPressure = clamp01(fibonacci * 0.44 + golden * 0.28 + seq * 0.28);
    var combinedCompassPressure = clamp01(compass.northSouth * 0.22 + compass.eastWest * 0.22 + compass.diagonal * 0.20 + compass.cardinalBoost + laneWave * 0.18);

    var ridgePressure = clamp01(
      laneWave * 0.28 +
      compass.diagonal * 0.22 +
      chronologyPressure * 0.20 +
      news * 0.16 +
      fractureWave * 0.18
    );

    var mountainPressure = clamp01(
      axial * 0.22 +
      ridgePressure * 0.38 +
      fibonacci * 0.18 +
      compass.cardinalBoost * 0.32
    );

    var summitPressure = clamp01(
      mountainPressure * 0.48 +
      (fibonacci > 0.60 ? 0.22 : 0) +
      (news > 0.20 ? 0.14 : 0) +
      (sequenceVersion === 0 || sequenceVersion === 15 ? 0.16 : 0)
    );

    var basinPressure = clamp01(
      equatorial * 0.28 +
      (1 - ridgePressure) * 0.24 +
      diagonalWave * 0.24 +
      (1 - fibonacci) * 0.18
    );

    var valleyPressure = clamp01(
      basinPressure * 0.32 +
      ridgePressure * 0.20 +
      (1 - Math.abs(0.5 - golden) * 2) * 0.24 +
      compass.eastWest * 0.16
    );

    var trenchPressure = clamp01(
      fractureWave * 0.32 +
      valleyPressure * 0.22 +
      (1 - equatorial) * 0.12 +
      (nodeIndex % 5 === 0 ? 0.18 : 0)
    );

    var shelfPressure = clamp01(
      equatorial * 0.22 +
      (sequenceVersion <= 1 || sequenceVersion >= 14 ? 0.18 : 0) +
      (nodeIndex <= 1 || nodeIndex >= 14 ? 0.18 : 0) +
      basinPressure * 0.22 +
      compass.diagonal * 0.12
    );

    var escarpmentPressure = clamp01(
      ridgePressure * 0.24 +
      trenchPressure * 0.24 +
      shelfPressure * 0.18 +
      fractureWave * 0.22
    );

    var dryElevation = clamp(
      0.46 +
      mountainPressure * 0.22 +
      summitPressure * 0.16 +
      ridgePressure * 0.13 +
      chronologyPressure * 0.08 -
      basinPressure * 0.18 -
      trenchPressure * 0.12 -
      shelfPressure * 0.07,
      0.12,
      0.94
    );

    var formerHydrosphereCarvingValue = clamp01(
      basinPressure * 0.30 +
      valleyPressure * 0.24 +
      trenchPressure * 0.24 +
      shelfPressure * 0.18 +
      Math.max(0, FORMER_SEA_LEVEL_DATUM - dryElevation) * 0.55
    );

    var futureFillPressure = clamp01(
      Math.max(0, FORMER_SEA_LEVEL_DATUM - dryElevation) * 0.78 +
      basinPressure * 0.26 +
      valleyPressure * 0.22 +
      trenchPressure * 0.20 +
      shelfPressure * 0.12
    );

    return {
      chronologyPressure: round(chronologyPressure, 4),
      sequencePressure: round(seq, 4),
      compassPressure: round(combinedCompassPressure, 4),
      ridgePressure: round(ridgePressure, 4),
      mountainPressure: round(mountainPressure, 4),
      summitPressure: round(summitPressure, 4),
      basinPressure: round(basinPressure, 4),
      valleyPressure: round(valleyPressure, 4),
      trenchPressure: round(trenchPressure, 4),
      shelfPressure: round(shelfPressure, 4),
      escarpmentPressure: round(escarpmentPressure, 4),
      formerHydrosphereCarvingValue: round(formerHydrosphereCarvingValue, 4),
      futureFillPressure: round(futureFillPressure, 4),
      dryElevation: round(dryElevation, 4),
      relativeRelief: round(dryElevation - FORMER_SEA_LEVEL_DATUM, 4)
    };
  }

  function classifyTerrain(pressure) {
    if (pressure.summitPressure > 0.62 && pressure.dryElevation > 0.64) return "summit_pressure_zone";
    if (pressure.mountainPressure > 0.58 && pressure.dryElevation > 0.58) return "mountain_belt";
    if (pressure.ridgePressure > 0.62) return "ridge_chain";
    if (pressure.trenchPressure > 0.66) return "trench_corridor";
    if (pressure.futureFillPressure > 0.68 && pressure.dryElevation < FORMER_SEA_LEVEL_DATUM) return "future_fill_candidate";
    if (pressure.basinPressure > 0.58 && pressure.dryElevation < 0.48) return "dry_basin_floor";
    if (pressure.valleyPressure > 0.56) return "valley_corridor";
    if (pressure.shelfPressure > 0.60) return "shelf_terrace";
    if (pressure.escarpmentPressure > 0.60) return "escarpment_rim";
    if (pressure.dryElevation > 0.68) return "highland_mass";
    if (pressure.dryElevation > 0.56) return "upland_plateau";
    if (pressure.dryElevation < 0.34) return "former_seabed";
    if (pressure.dryElevation < FORMER_SEA_LEVEL_DATUM) return "lowland_gap";
    return "stable_craton";
  }

  function primaryRole(terrainClass) {
    if (terrainClass === "summit_pressure_zone") return "summit_anchor";
    if (terrainClass === "mountain_belt") return "mountain";
    if (terrainClass === "ridge_chain") return "ridge";
    if (terrainClass === "highland_mass") return "highland";
    if (terrainClass === "upland_plateau") return "plateau";
    if (terrainClass === "stable_craton") return "stable_core";
    if (terrainClass === "valley_corridor") return "valley";
    if (terrainClass === "dry_basin_floor") return "basin";
    if (terrainClass === "trench_corridor") return "trench";
    if (terrainClass === "shelf_terrace") return "shelf";
    if (terrainClass === "escarpment_rim") return "escarpment";
    if (terrainClass === "lowland_gap") return "future_fill_gap";
    if (terrainClass === "former_seabed") return "former_seabed";
    if (terrainClass === "future_fill_candidate") return "future_fill_candidate";
    return "stable_core";
  }

  function secondaryRoles(pressure) {
    var roles = [];

    if (pressure.summitPressure > 0.40) roles.push("summit_pressure");
    if (pressure.mountainPressure > 0.40) roles.push("mountain_pressure");
    if (pressure.ridgePressure > 0.40) roles.push("ridge_pressure");
    if (pressure.basinPressure > 0.40) roles.push("basin_pressure");
    if (pressure.valleyPressure > 0.40) roles.push("valley_pressure");
    if (pressure.trenchPressure > 0.40) roles.push("trench_pressure");
    if (pressure.shelfPressure > 0.40) roles.push("shelf_pressure");
    if (pressure.escarpmentPressure > 0.40) roles.push("escarpment_pressure");
    if (pressure.futureFillPressure > 0.42) roles.push("future_fill_pressure");
    if (pressure.formerHydrosphereCarvingValue > 0.36) roles.push("former_hydrosphere_carving");

    return Object.freeze(roles);
  }

  function pressureRole(pressure) {
    var entries = [
      ["summit", pressure.summitPressure],
      ["mountain", pressure.mountainPressure],
      ["ridge", pressure.ridgePressure],
      ["basin", pressure.basinPressure],
      ["valley", pressure.valleyPressure],
      ["trench", pressure.trenchPressure],
      ["shelf", pressure.shelfPressure],
      ["escarpment", pressure.escarpmentPressure],
      ["future_fill", pressure.futureFillPressure]
    ].sort(function (a, b) {
      return b[1] - a[1];
    });

    return entries[0][0];
  }

  function elevationIntent(pressure) {
    if (pressure.dryElevation > 0.72) return "high_emergent_mass";
    if (pressure.dryElevation > 0.58) return "raised_dry_mass";
    if (pressure.dryElevation > FORMER_SEA_LEVEL_DATUM) return "stable_dry_mass";
    if (pressure.dryElevation > 0.34) return "low_revealed_mass";
    return "former_seabed_floor";
  }

  function dryMassRole(terrainClass, pressure) {
    if (terrainClass === "future_fill_candidate") return "future_fill_gap";
    if (terrainClass === "former_seabed") return "former_hydrosphere_floor";
    if (pressure.dryElevation >= FORMER_SEA_LEVEL_DATUM) return "exposed_dry_mass";
    return "receded_hydrosphere_reveal";
  }

  function makeTerrainAckStack(terrainSeat, datumSeat) {
    var ack = {
      contract: CONTRACT,
      terrainSeatIndex: terrainSeat.terrainSeatIndex,
      terrainSeatKey: terrainSeat.terrainSeatKey,
      datumChronologicalSeatKey: terrainSeat.datumChronologicalSeatKey,
      ackStackComplete: true,
      duties: {
        "Ph-ACK": {
          key: "Ph-ACK",
          type: "phase-based ACK",
          duty: "Confirms G2 physical terrain child phase.",
          phase: "G2 physical terrain child",
          complete: true
        },
        "L-ACK": {
          key: "L-ACK",
          type: "layer-based ACK",
          duty: "Confirms terrain layer only; no datum, hydration, surface material, runtime rendering, HTML, route JS, clouds, ecology, settlement, or final visual pass ownership.",
          layer: "physical terrain",
          owns: [
            "terrain interpretation",
            "dry elevation",
            "terrain class",
            "dry mass logic",
            "former hydrosphere carving memory",
            "future-fill eligibility",
            "terrain packets"
          ],
          doesNotOwn: [
            "datum chronology",
            "hydration truth",
            "surface material",
            "runtime rendering",
            "HTML",
            "route JS",
            "clouds",
            "ecology",
            "settlement",
            "final visual pass"
          ],
          complete: true
        },
        "St-ACK": {
          key: "St-ACK",
          type: "state-based ACK",
          duty: "Confirms datum consumed, terrain seat generated, hydration held, active water false, and visual pass false.",
          datumConsumed: Boolean(datumSeat),
          terrainSeatGenerated: true,
          hydrationHeld: true,
          activeWater: false,
          visualPassClaimed: false,
          complete: true
        },
        "Tr-ACK": {
          key: "Tr-ACK",
          type: "transition-based ACK",
          duty: "Confirms G2 datum chronological seat to G2 terrain pressure interpretation to carrier-safe dry terrain packet.",
          from: "G2 datum chronological seat",
          through: "G2 terrain pressure interpretation",
          to: "carrier-safe dry terrain packet",
          complete: true
        },
        "R-ACK": {
          key: "R-ACK",
          type: "route/resource ACK",
          duty: "Confirms terrain child file/resource identity.",
          file: FILE,
          family: FAMILY,
          complete: true
        },
        "P-ACK": {
          key: "P-ACK",
          type: "packet-based ACK",
          duty: "Confirms G2 physical terrain packet, carrier terrain packet, child receive packet, API shape, and datum compatibility.",
          packetContract: CONTRACT,
          datumContract: PARENT_DATUM_CONTRACT,
          apiShapeReady: true,
          carrierTerrainPacketCompatible: true,
          childReceivePacketReady: true,
          datumCompatible: true,
          complete: true
        }
      }
    };

    ack.dutyKeys = Object.keys(ack.duties);
    ack.dutyCount = ack.dutyKeys.length;

    return Object.freeze(ack);
  }

  function makeTerrainSeat(datumSeat, index) {
    var pressure = buildPressureProfile(datumSeat);
    var terrainClass = classifyTerrain(pressure);
    var key = terrainSeatKey(index);

    var seat = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      ccr: CCR,
      parentDatumContract: PARENT_DATUM_CONTRACT,
      sourceGlobal: SOURCE_GLOBAL,

      terrainSeatIndex: index,
      terrainSeatKey: key,
      terrainSeatId: key,

      datumChronologicalSeatKey: datumSeat.chronologicalSeatKey,
      datumSequenceCompassKey: datumSeat.sequenceCompassKey,
      datumSequenceVersion: datumSeat.sequenceVersion,
      datumNodeIndex: datumSeat.nodeIndex,
      datumChronologicalSeatIndex: datumSeat.chronologicalSeatIndex,
      datumCompassKey: datumSeat.compassKey,
      datumCompassLaneIndex: datumSeat.compassLaneIndex,
      datumLaneColorKey: datumSeat.laneColorKey,
      datumVersionColorKey: datumSeat.versionColorKey,
      datumCombinedColorIdentity: datumSeat.combinedColorIdentity,
      datumLaneColor: datumSeat.laneColor || null,
      datumVersionColor: datumSeat.versionColor || null,
      datumNewsReference: datumSeat.news || null,
      datumAckStackReference: datumSeat.ackStack || null,

      sequenceVersion: datumSeat.sequenceVersion,
      nodeIndex: datumSeat.nodeIndex,
      chronologicalSeatIndex: datumSeat.chronologicalSeatIndex,
      compassKey: datumSeat.compassKey,
      compassLaneIndex: datumSeat.compassLaneIndex,
      sequenceCompassKey: datumSeat.sequenceCompassKey,
      chronologicalSeatKey: datumSeat.chronologicalSeatKey,

      terrainClass: terrainClass,
      primaryTerrainRole: primaryRole(terrainClass),
      secondaryTerrainRoles: secondaryRoles(pressure),
      elevationIntent: elevationIntent(pressure),
      dryMassRole: dryMassRole(terrainClass, pressure),
      pressureRole: pressureRole(pressure),

      dryElevation: pressure.dryElevation,
      elevationIntentValue: pressure.dryElevation,
      relativeRelief: pressure.relativeRelief,
      formerSeaLevelDatum: FORMER_SEA_LEVEL_DATUM,

      chronologyPressure: pressure.chronologyPressure,
      sequencePressure: pressure.sequencePressure,
      compassPressure: pressure.compassPressure,
      ridgePressure: pressure.ridgePressure,
      mountainPressure: pressure.mountainPressure,
      summitPressure: pressure.summitPressure,
      basinPressure: pressure.basinPressure,
      valleyPressure: pressure.valleyPressure,
      trenchPressure: pressure.trenchPressure,
      shelfPressure: pressure.shelfPressure,
      escarpmentPressure: pressure.escarpmentPressure,
      formerHydrosphereCarvingValue: pressure.formerHydrosphereCarvingValue,
      futureFillPressure: pressure.futureFillPressure,

      formerHydrosphereOrigin: true,
      dryRevealedMass: true,
      formerWaterCarvingActive: pressure.formerHydrosphereCarvingValue > 0.16,
      formerSeabed: terrainClass === "former_seabed" || pressure.dryElevation < 0.34,
      futureFillEligible: pressure.futureFillPressure > 0.46 || terrainClass === "future_fill_candidate",

      datumIdentityPreserved: true,
      terrainDerivedFromDatum: true,
      terrainMutatesDatum: false,
      colorIdentityIsMetadataOnly: true,
      laneColorIsTerrainMaterial: false,
      versionColorIsTerrainMaterial: false,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      rendersNothing: true,
      noCanvasCreation: true,
      childDrawsVisuals: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    seat.ackStack = makeTerrainAckStack(seat, datumSeat);
    seat.ackStackComplete = true;
    seat.newsReference = datumSeat.news || null;
    seat.newsReferenceComplete = Boolean(datumSeat.news && datumSeat.news.newsComplete === true);

    return Object.freeze(seat);
  }

  function field(name, seats, extra, options) {
    var compact = options && options.compact === true;

    return Object.freeze(Object.assign({
      contract: CONTRACT,
      fieldType: name,
      terrainSeatCount: seats.length,
      seats: compact ? seats.map(compactTerrainSeat) : seats.map(safeClone),
      sourceDatum: SOURCE_GLOBAL,
      datumDerived: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      rendersNothing: true,
      noCanvasCreation: true,
      finalVisualPassClaim: false
    }, extra || {}));
  }

  function compactTerrainSeat(seat) {
    return {
      terrainSeatIndex: seat.terrainSeatIndex,
      terrainSeatKey: seat.terrainSeatKey,
      datumChronologicalSeatKey: seat.datumChronologicalSeatKey,
      datumSequenceCompassKey: seat.datumSequenceCompassKey,
      datumSequenceVersion: seat.datumSequenceVersion,
      datumNodeIndex: seat.datumNodeIndex,
      datumCompassKey: seat.datumCompassKey,
      datumLaneColorKey: seat.datumLaneColorKey,
      datumVersionColorKey: seat.datumVersionColorKey,
      datumCombinedColorIdentity: seat.datumCombinedColorIdentity,

      terrainClass: seat.terrainClass,
      primaryTerrainRole: seat.primaryTerrainRole,
      elevationIntent: seat.elevationIntent,
      dryMassRole: seat.dryMassRole,
      pressureRole: seat.pressureRole,

      dryElevation: seat.dryElevation,
      relativeRelief: seat.relativeRelief,
      ridgePressure: seat.ridgePressure,
      mountainPressure: seat.mountainPressure,
      summitPressure: seat.summitPressure,
      basinPressure: seat.basinPressure,
      valleyPressure: seat.valleyPressure,
      trenchPressure: seat.trenchPressure,
      shelfPressure: seat.shelfPressure,
      escarpmentPressure: seat.escarpmentPressure,
      formerHydrosphereCarvingValue: seat.formerHydrosphereCarvingValue,
      futureFillPressure: seat.futureFillPressure,

      formerHydrosphereOrigin: true,
      dryRevealedMass: true,
      formerWaterCarvingActive: seat.formerWaterCarvingActive,
      formerSeabed: seat.formerSeabed,
      futureFillEligible: seat.futureFillEligible,

      datumIdentityPreserved: true,
      terrainDerivedFromDatum: true,
      terrainMutatesDatum: false,
      ackStackComplete: seat.ackStackComplete,
      newsReferenceComplete: seat.newsReferenceComplete,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
  }

  function buildTerrainSeatRegistry() {
    var seats = normalizeDatumSeats(state.datumReceivePacket);

    var terrainSeats = seats.map(function (datumSeat, index) {
      return makeTerrainSeat(datumSeat, index);
    });

    var byKey = {};
    var byDatumKey = {};

    terrainSeats.forEach(function (seat) {
      byKey[seat.terrainSeatKey] = seat;
      byDatumKey[seat.datumChronologicalSeatKey] = seat;
    });

    state.terrainSeatRegistry = Object.freeze(terrainSeats);
    state.terrainSeatByKey = byKey;
    state.terrainSeatByDatumKey = byDatumKey;

    return state.terrainSeatRegistry;
  }

  function getSeatsByClassInternal(terrainClass) {
    return state.terrainSeatRegistry.filter(function (seat) {
      return seat.terrainClass === terrainClass;
    });
  }

  function getSeatsByRoleInternal(role) {
    var text = String(role || "").toLowerCase();

    return state.terrainSeatRegistry.filter(function (seat) {
      return seat.primaryTerrainRole === text ||
        seat.pressureRole === text ||
        seat.dryMassRole === text ||
        seat.secondaryTerrainRoles.indexOf(text) >= 0;
    });
  }

  function buildAcceptanceReceipt() {
    var seats = state.terrainSeatRegistry;
    var classes = {};
    var terrainSeatKeySet = new Set();
    var datumChronoSet = new Set();
    var datumSequenceCompassSet = new Set();

    seats.forEach(function (seat) {
      classes[seat.terrainClass] = (classes[seat.terrainClass] || 0) + 1;
      terrainSeatKeySet.add(seat.terrainSeatKey);
      datumChronoSet.add(seat.datumChronologicalSeatKey);
      datumSequenceCompassSet.add(seat.datumSequenceCompassKey);
    });

    var receipt = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      ccr: CCR,
      file: FILE,
      sourceGlobal: SOURCE_GLOBAL,
      parentDatumContract: PARENT_DATUM_CONTRACT,

      datumDetected: state.datumDetected,
      datumValidated: state.datumValidated,
      datumFailureReason: state.datumFailureReason,

      sourceSeatCount: normalizeDatumSeats(state.datumReceivePacket).length,
      terrainSeatCount: seats.length,
      uniqueTerrainSeatKeyCount: terrainSeatKeySet.size,
      uniqueDatumChronologicalSeatKeyCount: datumChronoSet.size,
      uniqueDatumSequenceCompassKeyCount: datumSequenceCompassSet.size,

      terrainClassCounts: classes,
      terrainClassCount: Object.keys(classes).length,

      allTerrainSeatsLinkedToDatum: seats.every(function (seat) { return Boolean(seat.datumChronologicalSeatKey && seat.datumSequenceCompassKey); }),
      allTerrainSeatsHaveTerrainClass: seats.every(function (seat) { return Boolean(seat.terrainClass); }),
      allTerrainSeatsHaveElevationIntent: seats.every(function (seat) { return Boolean(seat.elevationIntent); }),
      allTerrainSeatsHaveDryElevation: seats.every(function (seat) { return Number.isFinite(Number(seat.dryElevation)); }),
      allTerrainSeatsHaveAckStack: seats.every(function (seat) { return seat.ackStackComplete === true; }),
      allTerrainSeatsHaveNewsReference: seats.every(function (seat) { return Boolean(seat.newsReference); }),

      ridgeFieldReady: getRidgeField({ reference: true }).terrainSeatCount > 0,
      basinFieldReady: getBasinField({ reference: true }).terrainSeatCount > 0,
      valleyFieldReady: getValleyField({ reference: true }).terrainSeatCount > 0,
      shelfFieldReady: getShelfField({ reference: true }).terrainSeatCount > 0,
      formerHydrosphereCarvingFieldReady: getFormerHydrosphereCarvingField({ reference: true }).terrainSeatCount > 0,
      futureFillFieldReady: getFutureFillField({ reference: true }).terrainSeatCount > 0,

      carrierTerrainPacketReady: true,
      childReceivePacketReady: true,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      rendersNothing: true,
      noCanvasCreation: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    receipt.acceptancePassed = Boolean(
      receipt.datumDetected === true &&
      receipt.datumValidated === true &&
      receipt.sourceSeatCount === TERRAIN_SEAT_COUNT &&
      receipt.terrainSeatCount === TERRAIN_SEAT_COUNT &&
      receipt.uniqueTerrainSeatKeyCount === TERRAIN_SEAT_COUNT &&
      receipt.uniqueDatumChronologicalSeatKeyCount === TERRAIN_SEAT_COUNT &&
      receipt.uniqueDatumSequenceCompassKeyCount === TERRAIN_SEAT_COUNT &&
      receipt.allTerrainSeatsLinkedToDatum &&
      receipt.allTerrainSeatsHaveTerrainClass &&
      receipt.allTerrainSeatsHaveElevationIntent &&
      receipt.allTerrainSeatsHaveDryElevation &&
      receipt.allTerrainSeatsHaveAckStack &&
      receipt.allTerrainSeatsHaveNewsReference &&
      receipt.terrainClassCount >= 8 &&
      receipt.ridgeFieldReady &&
      receipt.basinFieldReady &&
      receipt.valleyFieldReady &&
      receipt.shelfFieldReady &&
      receipt.formerHydrosphereCarvingFieldReady &&
      receipt.futureFillFieldReady &&
      receipt.carrierTerrainPacketReady &&
      receipt.childReceivePacketReady &&
      receipt.hydrationHeld &&
      receipt.activeHydration === false &&
      receipt.activeWater === false &&
      receipt.rendersNothing &&
      receipt.noCanvasCreation &&
      receipt.finalTerrainPassClaim === false &&
      receipt.finalHydrationPassClaim === false &&
      receipt.finalVisualPassClaim === false
    );

    return Object.freeze(receipt);
  }

  function buildTerrainPacket(target, options) {
    options = options || {};

    var seats = state.terrainSeatRegistry;
    var packet = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      ccr: CCR,
      target: target || "unassigned-g2-terrain-consumer",
      packetType: "audralia_g2_physical_terrain_packet",
      sourceGlobal: SOURCE_GLOBAL,
      parentDatumContract: PARENT_DATUM_CONTRACT,

      datumDetected: state.datumDetected,
      datumValidated: state.datumValidated,
      sourceSeatCount: normalizeDatumSeats(state.datumReceivePacket).length,

      terrainPacketReady: state.datumValidated,
      terrainSeatCount: seats.length,
      terrainClasses: TERRAIN_CLASSES.slice(),
      terrainSeats: options.compact === true ? seats.map(compactTerrainSeat) : seats.map(safeClone),
      seats: options.compact === true ? seats.map(compactTerrainSeat) : seats.map(safeClone),

      elevationField: getElevationField({ compact: true }),
      dryMassField: getDryMassField({ compact: true }),
      ridgeField: getRidgeField({ compact: true }),
      basinField: getBasinField({ compact: true }),
      valleyField: getValleyField({ compact: true }),
      shelfField: getShelfField({ compact: true }),
      formerHydrosphereCarvingField: getFormerHydrosphereCarvingField({ compact: true }),
      futureFillField: getFutureFillField({ compact: true }),

      datumIdentityPreserved: true,
      allTerrainSeatsLinkedToDatum: true,
      colorIdentityIsMetadataOnly: true,
      laneColorIsTerrainMaterial: false,
      versionColorIsTerrainMaterial: false,

      formerHydrosphereOrigin: true,
      dryRevealedMass: true,
      formerWaterCarvingActive: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      rendersNothing: true,
      noCanvasCreation: true,
      childDrawsVisuals: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    return Object.freeze(packet);
  }

  function buildCarrierTerrainPacket(target, options) {
    options = options || {};

    return Object.freeze({
      contract: CONTRACT,
      target: target || "audralia-g2-carrier-runtime",
      packetType: "audralia_g2_carrier_safe_physical_terrain_packet",
      parentDatumContract: PARENT_DATUM_CONTRACT,

      carrierTerrainPacketReady: state.datumValidated,
      carrierMayConsume: state.datumValidated,
      carrierMayDisplayPacket: state.datumValidated,
      carrierDisplaysOnly: true,
      carrierInventsTerrain: false,
      carrierOwnsTerrainTruth: false,
      carrierOwnsElevationTruth: false,
      carrierOwnsHydrationTruth: false,

      terrainSeatCount: state.terrainSeatRegistry.length,
      seats: state.terrainSeatRegistry.map(compactTerrainSeat),

      terrainClasses: TERRAIN_CLASSES.slice(),
      elevationField: getElevationField({ compact: true }),
      ridgeField: getRidgeField({ compact: true }),
      basinField: getBasinField({ compact: true }),
      valleyField: getValleyField({ compact: true }),
      shelfField: getShelfField({ compact: true }),
      formerHydrosphereCarvingField: getFormerHydrosphereCarvingField({ compact: true }),
      futureFillField: getFutureFillField({ compact: true }),

      sourceTerrainChildOwnsTruth: true,
      carrierShouldNotMutateTerrain: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function rebuild() {
    detectDatum();

    if (!state.datumValidated) {
      state.terrainSeatRegistry = Object.freeze([]);
      state.terrainSeatByKey = {};
      state.terrainSeatByDatumKey = {};
      state.terrainPacket = null;
      state.carrierTerrainPacket = null;
      state.acceptanceReceipt = Object.freeze({
        contract: CONTRACT,
        file: FILE,
        datumDetected: state.datumDetected,
        datumValidated: false,
        datumFailureReason: state.datumFailureReason,
        sourceSeatCount: 0,
        terrainSeatCount: 0,
        acceptancePassed: false,
        terrainPacketReady: false,
        carrierTerrainPacketReady: false,
        childReceivePacketReady: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        rendersNothing: true,
        noCanvasCreation: true,
        finalTerrainPassClaim: false,
        finalHydrationPassClaim: false,
        finalVisualPassClaim: false
      });
      state.terrainPacketReady = false;
      state.carrierTerrainPacketReady = false;
      state.childReceivePacketReady = false;
      return false;
    }

    buildTerrainSeatRegistry();

    state.terrainPacket = buildTerrainPacket("published-g2-physical-terrain", { compact: false });
    state.carrierTerrainPacket = buildCarrierTerrainPacket("published-g2-carrier-terrain", { compact: true });
    state.acceptanceReceipt = buildAcceptanceReceipt();

    state.terrainPacketReady = state.acceptanceReceipt.acceptancePassed;
    state.carrierTerrainPacketReady = state.acceptanceReceipt.acceptancePassed;
    state.childReceivePacketReady = state.acceptanceReceipt.acceptancePassed;
    state.buildCount += 1;

    return state.acceptanceReceipt.acceptancePassed;
  }

  function ensureBuilt() {
    if (!state.acceptanceReceipt) rebuild();
    return state.acceptanceReceipt && state.acceptanceReceipt.acceptancePassed === true;
  }

  function getTerrainPacket(target, options) {
    ensureBuilt();
    if (!state.terrainPacketReady) return buildTerrainPacket(target || "invalid-terrain-consumer", options || {});
    return buildTerrainPacket(target, options || {});
  }

  function receive(options) {
    return getTerrainPacket("receive", options || {});
  }

  function getCarrierTerrainPacket(target, options) {
    ensureBuilt();
    return buildCarrierTerrainPacket(target, options || {});
  }

  function getTerrainSeat(seatIndex, options) {
    ensureBuilt();

    var seat = state.terrainSeatRegistry[Math.floor(clamp(seatIndex, 0, Math.max(0, state.terrainSeatRegistry.length - 1)))];

    if (!seat) return null;
    return options && options.reference === true ? seat : safeClone(seat);
  }

  function getTerrainSeatByDatumSeatKey(chronologicalSeatKey, options) {
    ensureBuilt();

    var seat = state.terrainSeatByDatumKey[String(chronologicalSeatKey || "")];

    if (!seat) return null;
    return options && options.reference === true ? seat : safeClone(seat);
  }

  function getTerrainSeatsByClass(terrainClass, options) {
    ensureBuilt();

    var seats = getSeatsByClassInternal(String(terrainClass || ""));

    return options && options.reference === true ? seats : safeClone(seats);
  }

  function getTerrainSeatsByRole(role, options) {
    ensureBuilt();

    var seats = getSeatsByRoleInternal(role);

    return options && options.reference === true ? seats : safeClone(seats);
  }

  function getElevationField(options) {
    ensureBuilt();
    return field("dry_elevation_field", state.terrainSeatRegistry, {
      dryElevationFieldReady: state.terrainSeatRegistry.length === TERRAIN_SEAT_COUNT,
      formerSeaLevelDatum: FORMER_SEA_LEVEL_DATUM
    }, options || {});
  }

  function getDryMassField(options) {
    ensureBuilt();

    var seats = state.terrainSeatRegistry.filter(function (seat) {
      return seat.dryRevealedMass === true;
    });

    return field("dry_mass_field", seats, {
      dryMassFieldReady: seats.length > 0,
      dryRevealedMass: true
    }, options || {});
  }

  function getRidgeField(options) {
    ensureBuilt();

    var seats = state.terrainSeatRegistry.filter(function (seat) {
      return ROLE_GROUPS.ridge.indexOf(seat.terrainClass) >= 0 || seat.ridgePressure > 0.48;
    });

    return field("ridge_mountain_summit_field", seats, {
      ridgeFieldReady: seats.length > 0,
      mountainFieldReady: seats.some(function (seat) { return seat.mountainPressure > 0.48; }),
      summitFieldReady: seats.some(function (seat) { return seat.summitPressure > 0.48; })
    }, options || {});
  }

  function getBasinField(options) {
    ensureBuilt();

    var seats = state.terrainSeatRegistry.filter(function (seat) {
      return ROLE_GROUPS.basin.indexOf(seat.terrainClass) >= 0 || seat.basinPressure > 0.48;
    });

    return field("basin_former_seabed_field", seats, {
      basinFieldReady: seats.length > 0,
      formerSeabedIncluded: seats.some(function (seat) { return seat.formerSeabed === true; })
    }, options || {});
  }

  function getValleyField(options) {
    ensureBuilt();

    var seats = state.terrainSeatRegistry.filter(function (seat) {
      return ROLE_GROUPS.valley.indexOf(seat.terrainClass) >= 0 || seat.valleyPressure > 0.46 || seat.trenchPressure > 0.50;
    });

    return field("valley_trench_lowland_field", seats, {
      valleyFieldReady: seats.length > 0,
      trenchIncluded: seats.some(function (seat) { return seat.trenchPressure > 0.50; })
    }, options || {});
  }

  function getShelfField(options) {
    ensureBuilt();

    var seats = state.terrainSeatRegistry.filter(function (seat) {
      return ROLE_GROUPS.shelf.indexOf(seat.terrainClass) >= 0 || seat.shelfPressure > 0.46 || seat.escarpmentPressure > 0.50;
    });

    return field("shelf_escarpment_field", seats, {
      shelfFieldReady: seats.length > 0,
      wetEdgeBehaviorActive: false
    }, options || {});
  }

  function getFormerHydrosphereCarvingField(options) {
    ensureBuilt();

    var seats = state.terrainSeatRegistry.filter(function (seat) {
      return seat.formerWaterCarvingActive === true || seat.formerHydrosphereCarvingValue > 0.28;
    });

    return field("former_hydrosphere_carving_field", seats, {
      formerHydrosphereCarvingFieldReady: seats.length > 0,
      formerHydrosphereOrigin: true,
      waterHistoryAllowed: true,
      activeWaterForbidden: true
    }, options || {});
  }

  function getFutureFillField(options) {
    ensureBuilt();

    var seats = state.terrainSeatRegistry.filter(function (seat) {
      return seat.futureFillEligible === true || seat.futureFillPressure > 0.42;
    });

    return field("future_fill_field", seats, {
      futureFillFieldReady: seats.length > 0,
      mapTheGapsFirst: true,
      fillTheGapsLater: true,
      activeHydration: false,
      activeWater: false
    }, options || {});
  }

  function getChildReceivePacket(target, options) {
    ensureBuilt();
    options = options || {};

    var packet = {
      contract: CONTRACT,
      target: target || "unassigned-g2-terrain-child-consumer",
      packetType: "audralia_g2_physical_terrain_child_receive_packet",
      parentDatumContract: PARENT_DATUM_CONTRACT,
      sourceGlobal: SOURCE_GLOBAL,

      datumDetected: state.datumDetected,
      datumValidated: state.datumValidated,
      datumFailureReason: state.datumFailureReason,

      childReceivePacketReady: state.childReceivePacketReady,
      terrainPacketReady: state.terrainPacketReady,
      carrierTerrainPacketReady: state.carrierTerrainPacketReady,

      status: status(),
      acceptanceReceipt: state.acceptanceReceipt,
      terrainPacket: getTerrainPacket(target || "child-receive-terrain", { compact: options.compact === true }),
      carrierTerrainPacket: getCarrierTerrainPacket(target || "child-receive-carrier", { compact: true }),

      terrainSeatCount: state.terrainSeatRegistry.length,
      seats: options.compact === true ? state.terrainSeatRegistry.map(compactTerrainSeat) : state.terrainSeatRegistry.map(safeClone),

      terrainClasses: TERRAIN_CLASSES.slice(),

      terrainLayerOwnsTruth: true,
      consumerMayRead: state.childReceivePacketReady,
      consumerMayMutateTerrainTruth: false,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      rendersNothing: true,
      noCanvasCreation: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      issuedAt: new Date().toISOString()
    };

    state.childPacketCount += 1;
    state.lastChildPacket = {
      target: packet.target,
      issuedAt: packet.issuedAt,
      terrainSeatCount: packet.terrainSeatCount,
      childReceivePacketReady: packet.childReceivePacketReady
    };

    return options.reference === true ? packet : safeClone(packet);
  }

  function status() {
    ensureBuilt();

    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      ccr: CCR,
      family: FAMILY,
      file: FILE,
      sourceGlobal: SOURCE_GLOBAL,
      parentDatumContract: PARENT_DATUM_CONTRACT,

      initialized: state.initialized,
      buildCount: state.buildCount,

      datumDetected: state.datumDetected,
      datumApiComplete: state.datumApiComplete,
      datumValidated: state.datumValidated,
      datumFailureReason: state.datumFailureReason,

      terrainPacketReady: state.terrainPacketReady,
      carrierTerrainPacketReady: state.carrierTerrainPacketReady,
      childReceivePacketReady: state.childReceivePacketReady,

      sourceSeatCount: normalizeDatumSeats(state.datumReceivePacket).length,
      terrainSeatCount: state.terrainSeatRegistry.length,
      terrainClasses: TERRAIN_CLASSES.slice(),

      acceptanceReceipt: state.acceptanceReceipt,
      acceptancePassed: state.acceptanceReceipt ? state.acceptanceReceipt.acceptancePassed : false,

      ridgeFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.ridgeFieldReady : false,
      basinFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.basinFieldReady : false,
      valleyFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.valleyFieldReady : false,
      shelfFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.shelfFieldReady : false,
      formerHydrosphereCarvingFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.formerHydrosphereCarvingFieldReady : false,
      futureFillFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.futureFillFieldReady : false,

      datumIdentityPreserved: true,
      terrainDerivedFromDatum: state.datumValidated,
      terrainMutatesDatum: false,
      colorIdentityIsMetadataOnly: true,
      laneColorIsTerrainMaterial: false,
      versionColorIsTerrainMaterial: false,

      formerHydrosphereOrigin: true,
      dryRevealedMass: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      rendersNothing: true,
      noCanvasCreation: true,
      ownsDatumTruth: false,
      ownsTerrainTruth: true,
      ownsHydrationTruth: false,
      ownsSurfaceMaterialTruth: false,
      ownsRuntimeRendering: false,
      ownsHtml: false,
      ownsRouteJs: false,
      childDrawsVisuals: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      childPacketCount: state.childPacketCount,
      lastChildPacket: state.lastChildPacket,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_DEPLOY_MARKER_v1"
    };
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      ccr: CCR,
      family: FAMILY,
      file: FILE,
      sourceGlobal: SOURCE_GLOBAL,
      parentDatumContract: PARENT_DATUM_CONTRACT,

      status: status,
      receive: receive,
      refresh: rebuild,

      getTerrainPacket: getTerrainPacket,
      getCarrierTerrainPacket: getCarrierTerrainPacket,
      getTerrainSeat: getTerrainSeat,
      getTerrainSeatByDatumSeatKey: getTerrainSeatByDatumSeatKey,
      getTerrainSeatsByClass: getTerrainSeatsByClass,
      getTerrainSeatsByRole: getTerrainSeatsByRole,

      getElevationField: getElevationField,
      getDryMassField: getDryMassField,
      getRidgeField: getRidgeField,
      getBasinField: getBasinField,
      getValleyField: getValleyField,
      getShelfField: getShelfField,
      getFormerHydrosphereCarvingField: getFormerHydrosphereCarvingField,
      getFutureFillField: getFutureFillField,
      getChildReceivePacket: getChildReceivePacket
    };

    if (typeof window !== "undefined") {
      window.AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD = api;
      window.AUDRALIA_PHYSICAL_TERRAIN_CHILD_G2 = api;
      window.AUDRALIA_G2_DRY_TERRAIN_CHILD = api;
      window.AUDRALIA_G2_TERRAIN_PACKET_CHILD = api;

      window.AUDRALIA_G2_PHYSICAL_TERRAIN_STATUS = status();
      window.AUDRALIA_G2_PHYSICAL_TERRAIN_PACKET = getTerrainPacket("published-g2-physical-terrain", { compact: true });
      window.AUDRALIA_G2_CARRIER_TERRAIN_PACKET = getCarrierTerrainPacket("published-g2-carrier-terrain", { compact: true });
    }

    return api;
  }

  function init() {
    state.initialized = true;
    rebuild();
    publish();

    if (typeof window !== "undefined") {
      window.setTimeout(function () {
        rebuild();
        publish();
      }, 120);

      window.setTimeout(function () {
        rebuild();
        publish();
      }, 480);

      window.setTimeout(function () {
        rebuild();
        publish();
      }, 1200);
    }

    return status();
  }

  init();
})();
