// /assets/audralia/clean/surface/audralia.g2.surface-material.child.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_SURFACE_MATERIAL_CHILD_TNT_v1
//
// Scope:
// G2 surface/material child only.
//
// Source authority:
// AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD
//
// Source terrain contract:
// AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_TNT_v1
//
// Purpose:
// - Consume the G2 physical terrain child receive packet.
// - Convert 256 G2 terrain seats into 256 dry surface/material seats.
// - Preserve terrain identity and datum lineage on every surface seat.
// - Build dry crust, mineral tone, relief readability, ridge highlight, basin shadow,
//   shelf transition, escarpment edge, former seabed tone, and future-fill suppression fields.
// - Publish carrier-safe surface/material packet.
// - Render nothing.
// - Create no canvas.
// - Activate no hydration.
// - Claim no final surface or visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_SURFACE_MATERIAL_CHILD_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_SURFACE_MATERIAL_CHILD_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_G2_SURFACE_MATERIAL_CHILD_NEWS_ALIGNMENT_v1";
  var SOURCE_TERRAIN_CONTRACT = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD_TNT_v1";

  var SOURCE_GLOBAL = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD";
  var CHILD_NAME = "audralia-g2-surface-material-child";

  var FAMILY = "/assets/audralia/clean/surface/";
  var FILE = "/assets/audralia/clean/surface/audralia.g2.surface-material.child.js";

  var SURFACE_SEAT_COUNT = 256;
  var FORMER_SEA_LEVEL_DATUM = 0.48;

  var SURFACE_MATERIAL_CLASSES = Object.freeze([
    "dry_highland_crust",
    "summit_bright_crust",
    "mountain_shadow_crust",
    "ridge_lit_crust",
    "upland_mineral_plateau",
    "stable_craton_skin",
    "valley_dry_green_brown",
    "basin_dark_dry_floor",
    "trench_shadow_floor",
    "shelf_dust_terrace",
    "escarpment_edge_crust",
    "lowland_muted_gap",
    "former_seabed_matte",
    "future_fill_suppressed_floor"
  ]);

  var MATERIAL_ROLE_GROUPS = Object.freeze({
    dryCrust: Object.freeze([
      "dry_highland_crust",
      "summit_bright_crust",
      "mountain_shadow_crust",
      "ridge_lit_crust",
      "upland_mineral_plateau",
      "stable_craton_skin"
    ]),
    shadow: Object.freeze([
      "mountain_shadow_crust",
      "basin_dark_dry_floor",
      "trench_shadow_floor",
      "former_seabed_matte"
    ]),
    transition: Object.freeze([
      "shelf_dust_terrace",
      "escarpment_edge_crust",
      "lowland_muted_gap",
      "future_fill_suppressed_floor"
    ]),
    formerHydrosphere: Object.freeze([
      "former_seabed_matte",
      "future_fill_suppressed_floor",
      "basin_dark_dry_floor",
      "shelf_dust_terrace"
    ])
  });

  var state = {
    initialized: false,

    terrainDetected: false,
    terrainApiComplete: false,
    terrainValidated: false,
    terrainFailureReason: "terrain not checked",
    terrainStatus: null,
    terrainReceivePacket: null,

    surfaceSeatRegistry: [],
    surfaceSeatByKey: {},
    surfaceSeatByTerrainKey: {},

    surfacePacket: null,
    carrierSurfacePacket: null,
    acceptanceReceipt: null,

    surfacePacketReady: false,
    carrierSurfacePacketReady: false,
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

  function surfaceSeatKey(index) {
    return "AUDRALIA-G2-SURFACE-SEAT-" + String(index).padStart(3, "0");
  }

  function normalizeTerrainSeats(packet) {
    if (!packet) return [];

    if (Array.isArray(packet.seats)) return packet.seats;
    if (Array.isArray(packet.terrainSeats)) return packet.terrainSeats;
    if (packet.terrainPacket && Array.isArray(packet.terrainPacket.seats)) return packet.terrainPacket.seats;
    if (packet.terrainPacket && Array.isArray(packet.terrainPacket.terrainSeats)) return packet.terrainPacket.terrainSeats;
    if (packet.carrierTerrainPacket && Array.isArray(packet.carrierTerrainPacket.seats)) return packet.carrierTerrainPacket.seats;

    return [];
  }

  function detectTerrainSource() {
    var api = typeof window !== "undefined" ? window[SOURCE_GLOBAL] : null;
    var sourceStatus = null;
    var receivePacket = null;
    var seats = [];

    state.terrainDetected = Boolean(api);
    state.terrainApiComplete = Boolean(
      api &&
      typeof api.getChildReceivePacket === "function" &&
      typeof api.status === "function"
    );

    state.terrainStatus = null;
    state.terrainReceivePacket = null;
    state.terrainValidated = false;

    if (!state.terrainDetected) {
      state.terrainFailureReason = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD missing";
      return false;
    }

    if (!state.terrainApiComplete) {
      state.terrainFailureReason = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD API incomplete";
      return false;
    }

    sourceStatus = safeCall("terrain", api, "status");
    receivePacket = safeCall("terrain", api, "getChildReceivePacket", CHILD_NAME, { compact: false });

    if (!receivePacket && typeof api.receive === "function") {
      receivePacket = safeCall("terrain", api, "receive", { compact: false });
    }

    seats = normalizeTerrainSeats(receivePacket);

    state.terrainStatus = sourceStatus;
    state.terrainReceivePacket = receivePacket;

    state.terrainValidated = Boolean(
      receivePacket &&
      seats.length === SURFACE_SEAT_COUNT &&
      (
        receivePacket.childReceivePacketReady === true ||
        receivePacket.terrainPacketReady === true ||
        (sourceStatus && sourceStatus.acceptancePassed === true)
      ) &&
      (
        receivePacket.acceptanceReceipt && receivePacket.acceptanceReceipt.acceptancePassed === true ||
        sourceStatus && sourceStatus.acceptancePassed === true
      ) &&
      seats.every(function (seat) {
        return Boolean(
          seat &&
          seat.terrainSeatKey &&
          seat.datumChronologicalSeatKey &&
          seat.datumSequenceCompassKey &&
          seat.datumSequenceVersion !== undefined &&
          seat.datumNodeIndex !== undefined &&
          seat.datumCompassKey &&
          seat.datumLaneColorKey &&
          seat.datumVersionColorKey &&
          seat.datumCombinedColorIdentity &&
          seat.terrainClass &&
          seat.primaryTerrainRole &&
          seat.dryElevation !== undefined &&
          seat.relativeRelief !== undefined &&
          seat.ridgePressure !== undefined &&
          seat.basinPressure !== undefined &&
          (seat.ackStack || seat.ackStackComplete === true) &&
          (seat.newsReference || seat.datumNewsReference || seat.newsReferenceComplete === true) &&
          seat.hydrationHeld === true &&
          seat.activeHydration === false &&
          seat.activeWater === false &&
          seat.finalVisualPassClaim !== true
        );
      })
    );

    state.terrainFailureReason = state.terrainValidated ? "" : "terrain receive packet failed G2 surface-material validation";
    return state.terrainValidated;
  }

  function materialClassForTerrain(terrainSeat, material) {
    var terrainClass = String(terrainSeat.terrainClass || "");
    var role = String(terrainSeat.primaryTerrainRole || "");
    var dryElevation = finite(terrainSeat.dryElevation, 0.5);
    var futureFill = finite(terrainSeat.futureFillPressure, 0);
    var basin = finite(terrainSeat.basinPressure, 0);
    var trench = finite(terrainSeat.trenchPressure, 0);
    var ridge = finite(terrainSeat.ridgePressure, 0);
    var mountain = finite(terrainSeat.mountainPressure, 0);
    var summit = finite(terrainSeat.summitPressure, 0);
    var shelf = finite(terrainSeat.shelfPressure, 0);
    var escarpment = finite(terrainSeat.escarpmentPressure, 0);

    if (futureFill > 0.68 || terrainClass === "future_fill_candidate") return "future_fill_suppressed_floor";
    if (terrainSeat.formerSeabed === true || terrainClass === "former_seabed") return "former_seabed_matte";
    if (trench > 0.62 || terrainClass === "trench_corridor") return "trench_shadow_floor";
    if (basin > 0.58 || terrainClass === "dry_basin_floor") return "basin_dark_dry_floor";
    if (summit > 0.62 || terrainClass === "summit_pressure_zone") return "summit_bright_crust";
    if (mountain > 0.58 || terrainClass === "mountain_belt") return "mountain_shadow_crust";
    if (ridge > 0.58 || terrainClass === "ridge_chain") return "ridge_lit_crust";
    if (escarpment > 0.56 || terrainClass === "escarpment_rim") return "escarpment_edge_crust";
    if (shelf > 0.56 || terrainClass === "shelf_terrace") return "shelf_dust_terrace";
    if (role === "valley" || terrainClass === "valley_corridor") return "valley_dry_green_brown";
    if (terrainClass === "lowland_gap" || dryElevation < FORMER_SEA_LEVEL_DATUM) return "lowland_muted_gap";
    if (terrainClass === "upland_plateau") return "upland_mineral_plateau";
    if (dryElevation > 0.66) return "dry_highland_crust";

    return "stable_craton_skin";
  }

  function materialRole(materialClass) {
    if (materialClass === "summit_bright_crust") return "summit_highlight";
    if (materialClass === "mountain_shadow_crust") return "mountain_shadow";
    if (materialClass === "ridge_lit_crust") return "ridge_readability";
    if (materialClass === "dry_highland_crust") return "highland_dry_crust";
    if (materialClass === "upland_mineral_plateau") return "mineral_plateau";
    if (materialClass === "stable_craton_skin") return "stable_surface_skin";
    if (materialClass === "valley_dry_green_brown") return "dry_valley_trace";
    if (materialClass === "basin_dark_dry_floor") return "basin_shadow_floor";
    if (materialClass === "trench_shadow_floor") return "deep_trench_shadow";
    if (materialClass === "shelf_dust_terrace") return "dry_shelf_transition";
    if (materialClass === "escarpment_edge_crust") return "edge_definition";
    if (materialClass === "lowland_muted_gap") return "muted_lowland_gap";
    if (materialClass === "former_seabed_matte") return "former_seabed_matte_tone";
    if (materialClass === "future_fill_suppressed_floor") return "future_fill_suppression";
    return "dry_surface_material";
  }

  function dryCrustClass(materialClass, terrainSeat) {
    if (materialClass === "summit_bright_crust") return "bright_summit_crust";
    if (materialClass === "mountain_shadow_crust") return "shadowed_mountain_crust";
    if (materialClass === "ridge_lit_crust") return "lit_ridge_crust";
    if (materialClass === "upland_mineral_plateau") return "mineralized_upland_crust";
    if (materialClass === "former_seabed_matte") return "matte_receded_seabed_crust";
    if (materialClass === "future_fill_suppressed_floor") return "suppressed_future_fill_floor";
    if (finite(terrainSeat.dryElevation, 0.5) > 0.58) return "raised_dry_crust";
    return "low_dry_crust";
  }

  function mineralToneClass(materialClass, terrainSeat) {
    var ridge = finite(terrainSeat.ridgePressure, 0);
    var basin = finite(terrainSeat.basinPressure, 0);
    var shelf = finite(terrainSeat.shelfPressure, 0);
    var carving = finite(terrainSeat.formerHydrosphereCarvingValue, 0);

    if (materialClass === "summit_bright_crust") return "bright_silica_gold_tone";
    if (materialClass === "mountain_shadow_crust") return "iron_umber_shadow_tone";
    if (materialClass === "ridge_lit_crust") return "dry_ochre_ridge_tone";
    if (materialClass === "basin_dark_dry_floor") return "dark_alluvial_basin_tone";
    if (materialClass === "trench_shadow_floor") return "deep_manganese_shadow_tone";
    if (materialClass === "former_seabed_matte") return "matte_silt_clay_tone";
    if (materialClass === "future_fill_suppressed_floor") return "muted_future_fill_silt_tone";
    if (shelf > 0.48) return "dusty_limestone_shelf_tone";
    if (ridge > basin) return "weathered_mineral_ridge_tone";
    if (carving > 0.46) return "receded_hydrosphere_stain_tone";
    return "stable_craton_olive_brown_tone";
  }

  function reliefReadabilityClass(material) {
    if (material.reliefReadability > 0.74) return "strong_relief_read";
    if (material.reliefReadability > 0.52) return "medium_relief_read";
    if (material.reliefReadability > 0.30) return "soft_relief_read";
    return "low_relief_read";
  }

  function shadowBehaviorClass(material) {
    if (material.trenchDeepShadow > 0.58) return "deep_shadow_behavior";
    if (material.basinShadow > 0.52) return "basin_shadow_behavior";
    if (material.mountainShadow > 0.50) return "mountain_shadow_behavior";
    if (material.escarpmentEdgeTone > 0.48) return "edge_shadow_behavior";
    return "ambient_dry_shadow_behavior";
  }

  function computeMaterialFields(terrainSeat) {
    var elevation = clamp01(finite(terrainSeat.dryElevation, 0.5));
    var relativeRelief = finite(terrainSeat.relativeRelief, elevation - FORMER_SEA_LEVEL_DATUM);
    var ridge = clamp01(finite(terrainSeat.ridgePressure, 0));
    var mountain = clamp01(finite(terrainSeat.mountainPressure, 0));
    var summit = clamp01(finite(terrainSeat.summitPressure, 0));
    var basin = clamp01(finite(terrainSeat.basinPressure, 0));
    var valley = clamp01(finite(terrainSeat.valleyPressure, 0));
    var trench = clamp01(finite(terrainSeat.trenchPressure, 0));
    var shelf = clamp01(finite(terrainSeat.shelfPressure, 0));
    var escarpment = clamp01(finite(terrainSeat.escarpmentPressure, 0));
    var carving = clamp01(finite(terrainSeat.formerHydrosphereCarvingValue, 0));
    var futureFill = clamp01(finite(terrainSeat.futureFillPressure, 0));

    var surfaceRoughness = clamp01(
      ridge * 0.26 +
      mountain * 0.24 +
      escarpment * 0.20 +
      trench * 0.14 +
      Math.max(0, relativeRelief) * 0.24
    );

    var materialDryness = clamp01(
      0.74 +
      Math.max(0, relativeRelief) * 0.20 -
      futureFill * 0.16 -
      carving * 0.06
    );

    var materialBrightness = clamp01(
      0.38 +
      elevation * 0.24 +
      summit * 0.22 +
      ridge * 0.12 +
      shelf * 0.06 -
      basin * 0.12 -
      trench * 0.16 -
      futureFill * 0.08
    );

    var materialContrast = clamp01(
      surfaceRoughness * 0.32 +
      Math.abs(relativeRelief) * 0.28 +
      escarpment * 0.18 +
      trench * 0.16 +
      ridge * 0.12
    );

    var reliefReadability = clamp01(
      ridge * 0.28 +
      mountain * 0.20 +
      summit * 0.14 +
      escarpment * 0.18 +
      trench * 0.10 +
      materialContrast * 0.24
    );

    var ridgeHighlight = clamp01(ridge * 0.54 + summit * 0.16 + materialBrightness * 0.18);
    var mountainShadow = clamp01(mountain * 0.36 + trench * 0.10 + (1 - materialBrightness) * 0.24);
    var summitHighlight = clamp01(summit * 0.62 + materialBrightness * 0.18);
    var basinShadow = clamp01(basin * 0.46 + carving * 0.16 + (1 - elevation) * 0.20);
    var valleyMutedTone = clamp01(valley * 0.44 + basin * 0.12 + futureFill * 0.10);
    var trenchDeepShadow = clamp01(trench * 0.62 + (1 - materialBrightness) * 0.16);
    var shelfTransitionTone = clamp01(shelf * 0.50 + carving * 0.14 + valley * 0.08);
    var escarpmentEdgeTone = clamp01(escarpment * 0.58 + ridge * 0.12 + trench * 0.10);
    var formerSeabedTone = clamp01((terrainSeat.formerSeabed ? 0.38 : 0) + carving * 0.36 + basin * 0.12);
    var futureFillSuppression = clamp01((terrainSeat.futureFillEligible ? 0.32 : 0) + futureFill * 0.50 + carving * 0.08);

    return {
      surfaceRoughness: round(surfaceRoughness, 4),
      materialDryness: round(materialDryness, 4),
      materialBrightness: round(materialBrightness, 4),
      materialContrast: round(materialContrast, 4),
      reliefReadability: round(reliefReadability, 4),
      ridgeHighlight: round(ridgeHighlight, 4),
      mountainShadow: round(mountainShadow, 4),
      summitHighlight: round(summitHighlight, 4),
      basinShadow: round(basinShadow, 4),
      valleyMutedTone: round(valleyMutedTone, 4),
      trenchDeepShadow: round(trenchDeepShadow, 4),
      shelfTransitionTone: round(shelfTransitionTone, 4),
      escarpmentEdgeTone: round(escarpmentEdgeTone, 4),
      formerSeabedTone: round(formerSeabedTone, 4),
      futureFillSuppression: round(futureFillSuppression, 4)
    };
  }

  function makeSurfaceAckStack(surfaceSeat, terrainSeat) {
    var ack = {
      contract: CONTRACT,
      surfaceSeatIndex: surfaceSeat.surfaceSeatIndex,
      surfaceSeatKey: surfaceSeat.surfaceSeatKey,
      terrainSeatKey: surfaceSeat.terrainSeatKey,
      datumChronologicalSeatKey: surfaceSeat.datumChronologicalSeatKey,
      ackStackComplete: true,
      duties: {
        "Ph-ACK": {
          key: "Ph-ACK",
          type: "phase-based ACK",
          duty: "Confirms G2 surface/material child phase.",
          phase: "G2 surface/material child",
          complete: true
        },
        "L-ACK": {
          key: "L-ACK",
          type: "layer-based ACK",
          duty: "Confirms surface/material layer only; no datum, terrain truth, hydration truth, runtime rendering, HTML, route JS, clouds, ecology, settlement, or final visual pass ownership.",
          layer: "surface/material",
          owns: [
            "dry material interpretation",
            "dry crust class",
            "mineral tone class",
            "relief readability",
            "surface hints",
            "carrier-safe material packets"
          ],
          doesNotOwn: [
            "datum chronology",
            "terrain truth",
            "hydration truth",
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
          duty: "Confirms terrain consumed, surface seat generated, hydration held, active water false, and visual pass false.",
          terrainConsumed: Boolean(terrainSeat),
          surfaceSeatGenerated: true,
          hydrationHeld: true,
          activeWater: false,
          visualPassClaimed: false,
          complete: true
        },
        "Tr-ACK": {
          key: "Tr-ACK",
          type: "transition-based ACK",
          duty: "Confirms G2 physical terrain packet to G2 dry surface/material interpretation to carrier-safe surface packet.",
          from: "G2 physical terrain packet",
          through: "G2 dry surface/material interpretation",
          to: "carrier-safe surface packet",
          complete: true
        },
        "R-ACK": {
          key: "R-ACK",
          type: "route/resource ACK",
          duty: "Confirms surface/material child file/resource identity.",
          file: FILE,
          family: FAMILY,
          complete: true
        },
        "P-ACK": {
          key: "P-ACK",
          type: "packet-based ACK",
          duty: "Confirms G2 surface/material packet, carrier surface packet, child receive packet, API shape, and terrain compatibility.",
          packetContract: CONTRACT,
          terrainContract: SOURCE_TERRAIN_CONTRACT,
          apiShapeReady: true,
          carrierSurfacePacketCompatible: true,
          childReceivePacketReady: true,
          terrainCompatible: true,
          complete: true
        }
      }
    };

    ack.dutyKeys = Object.keys(ack.duties);
    ack.dutyCount = ack.dutyKeys.length;

    return Object.freeze(ack);
  }

  function carrierSurfaceHint(surfaceSeat) {
    return Object.freeze({
      materialClass: surfaceSeat.surfaceMaterialClass,
      materialRole: surfaceSeat.surfaceMaterialRole,
      dryCrustClass: surfaceSeat.dryCrustClass,
      mineralToneClass: surfaceSeat.mineralToneClass,
      reliefReadabilityClass: surfaceSeat.reliefReadabilityClass,
      shadowBehaviorClass: surfaceSeat.shadowBehaviorClass,
      surfaceRoughness: surfaceSeat.surfaceRoughness,
      materialDryness: surfaceSeat.materialDryness,
      materialBrightness: surfaceSeat.materialBrightness,
      materialContrast: surfaceSeat.materialContrast,
      ridgeHighlight: surfaceSeat.ridgeHighlight,
      basinShadow: surfaceSeat.basinShadow,
      formerSeabedTone: surfaceSeat.formerSeabedTone,
      futureFillSuppression: surfaceSeat.futureFillSuppression,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
  }

  function makeSurfaceSeat(terrainSeat, index) {
    var materialFields = computeMaterialFields(terrainSeat);
    var materialClass = materialClassForTerrain(terrainSeat, materialFields);
    var key = surfaceSeatKey(index);

    var seat = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      sourceTerrainContract: SOURCE_TERRAIN_CONTRACT,
      sourceGlobal: SOURCE_GLOBAL,

      surfaceSeatIndex: index,
      surfaceSeatKey: key,
      surfaceSeatId: key,

      terrainSeatIndex: terrainSeat.terrainSeatIndex,
      terrainSeatKey: terrainSeat.terrainSeatKey,
      terrainClass: terrainSeat.terrainClass,
      primaryTerrainRole: terrainSeat.primaryTerrainRole,
      dryMassRole: terrainSeat.dryMassRole,
      elevationIntent: terrainSeat.elevationIntent,
      dryElevation: terrainSeat.dryElevation,
      relativeRelief: terrainSeat.relativeRelief,
      ridgePressure: terrainSeat.ridgePressure,
      mountainPressure: terrainSeat.mountainPressure,
      summitPressure: terrainSeat.summitPressure,
      basinPressure: terrainSeat.basinPressure,
      valleyPressure: terrainSeat.valleyPressure,
      trenchPressure: terrainSeat.trenchPressure,
      shelfPressure: terrainSeat.shelfPressure,
      escarpmentPressure: terrainSeat.escarpmentPressure,
      formerHydrosphereCarvingValue: terrainSeat.formerHydrosphereCarvingValue,
      futureFillPressure: terrainSeat.futureFillPressure,
      formerSeabed: terrainSeat.formerSeabed,
      futureFillEligible: terrainSeat.futureFillEligible,

      datumChronologicalSeatKey: terrainSeat.datumChronologicalSeatKey,
      datumSequenceCompassKey: terrainSeat.datumSequenceCompassKey,
      datumSequenceVersion: terrainSeat.datumSequenceVersion,
      datumNodeIndex: terrainSeat.datumNodeIndex,
      datumCompassKey: terrainSeat.datumCompassKey,
      datumLaneColorKey: terrainSeat.datumLaneColorKey,
      datumVersionColorKey: terrainSeat.datumVersionColorKey,
      datumCombinedColorIdentity: terrainSeat.datumCombinedColorIdentity,

      surfaceMaterialClass: materialClass,
      surfaceMaterialRole: materialRole(materialClass),
      dryCrustClass: dryCrustClass(materialClass, terrainSeat),
      mineralToneClass: mineralToneClass(materialClass, terrainSeat),
      reliefReadabilityClass: reliefReadabilityClass(materialFields),
      shadowBehaviorClass: shadowBehaviorClass(materialFields),

      surfaceRoughness: materialFields.surfaceRoughness,
      materialDryness: materialFields.materialDryness,
      materialBrightness: materialFields.materialBrightness,
      materialContrast: materialFields.materialContrast,
      reliefReadability: materialFields.reliefReadability,
      ridgeHighlight: materialFields.ridgeHighlight,
      mountainShadow: materialFields.mountainShadow,
      summitHighlight: materialFields.summitHighlight,
      basinShadow: materialFields.basinShadow,
      valleyMutedTone: materialFields.valleyMutedTone,
      trenchDeepShadow: materialFields.trenchDeepShadow,
      shelfTransitionTone: materialFields.shelfTransitionTone,
      escarpmentEdgeTone: materialFields.escarpmentEdgeTone,
      formerSeabedTone: materialFields.formerSeabedTone,
      futureFillSuppression: materialFields.futureFillSuppression,

      terrainReference: terrainSeat,
      terrainReferenceComplete: true,
      terrainIdentityPreserved: true,
      datumLineagePreserved: true,

      surfaceDerivedFromTerrain: true,
      surfaceMutatesTerrain: false,
      surfaceMutatesDatum: false,

      colorIdentityIsMetadataOnly: true,
      laneColorIsMaterialTruth: false,
      versionColorIsMaterialTruth: false,

      formerHydrosphereMemoryAsDryMaterialOnly: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      rendersNothing: true,
      noCanvasCreation: true,
      childDrawsVisuals: false,
      finalSurfacePassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    seat.carrierSurfaceHint = carrierSurfaceHint(seat);
    seat.ackStack = makeSurfaceAckStack(seat, terrainSeat);
    seat.ackStackComplete = true;

    return Object.freeze(seat);
  }

  function compactSurfaceSeat(seat) {
    return {
      surfaceSeatIndex: seat.surfaceSeatIndex,
      surfaceSeatKey: seat.surfaceSeatKey,

      terrainSeatIndex: seat.terrainSeatIndex,
      terrainSeatKey: seat.terrainSeatKey,
      terrainClass: seat.terrainClass,
      primaryTerrainRole: seat.primaryTerrainRole,
      dryMassRole: seat.dryMassRole,
      elevationIntent: seat.elevationIntent,
      dryElevation: seat.dryElevation,
      relativeRelief: seat.relativeRelief,

      datumChronologicalSeatKey: seat.datumChronologicalSeatKey,
      datumSequenceCompassKey: seat.datumSequenceCompassKey,
      datumSequenceVersion: seat.datumSequenceVersion,
      datumNodeIndex: seat.datumNodeIndex,
      datumCompassKey: seat.datumCompassKey,
      datumLaneColorKey: seat.datumLaneColorKey,
      datumVersionColorKey: seat.datumVersionColorKey,
      datumCombinedColorIdentity: seat.datumCombinedColorIdentity,

      surfaceMaterialClass: seat.surfaceMaterialClass,
      surfaceMaterialRole: seat.surfaceMaterialRole,
      dryCrustClass: seat.dryCrustClass,
      mineralToneClass: seat.mineralToneClass,
      reliefReadabilityClass: seat.reliefReadabilityClass,
      shadowBehaviorClass: seat.shadowBehaviorClass,

      surfaceRoughness: seat.surfaceRoughness,
      materialDryness: seat.materialDryness,
      materialBrightness: seat.materialBrightness,
      materialContrast: seat.materialContrast,
      reliefReadability: seat.reliefReadability,
      ridgeHighlight: seat.ridgeHighlight,
      mountainShadow: seat.mountainShadow,
      summitHighlight: seat.summitHighlight,
      basinShadow: seat.basinShadow,
      valleyMutedTone: seat.valleyMutedTone,
      trenchDeepShadow: seat.trenchDeepShadow,
      shelfTransitionTone: seat.shelfTransitionTone,
      escarpmentEdgeTone: seat.escarpmentEdgeTone,
      formerSeabedTone: seat.formerSeabedTone,
      futureFillSuppression: seat.futureFillSuppression,

      carrierSurfaceHint: seat.carrierSurfaceHint,

      terrainIdentityPreserved: true,
      datumLineagePreserved: true,
      surfaceDerivedFromTerrain: true,
      surfaceMutatesTerrain: false,
      surfaceMutatesDatum: false,
      ackStackComplete: seat.ackStackComplete,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalSurfacePassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function buildSurfaceSeatRegistry() {
    var terrainSeats = normalizeTerrainSeats(state.terrainReceivePacket);

    var surfaceSeats = terrainSeats.map(function (terrainSeat, index) {
      return makeSurfaceSeat(terrainSeat, index);
    });

    var byKey = {};
    var byTerrainKey = {};

    surfaceSeats.forEach(function (seat) {
      byKey[seat.surfaceSeatKey] = seat;
      byTerrainKey[seat.terrainSeatKey] = seat;
    });

    state.surfaceSeatRegistry = Object.freeze(surfaceSeats);
    state.surfaceSeatByKey = byKey;
    state.surfaceSeatByTerrainKey = byTerrainKey;

    return state.surfaceSeatRegistry;
  }

  function field(name, seats, extra, options) {
    var compact = options && options.compact === true;

    return Object.freeze(Object.assign({
      contract: CONTRACT,
      fieldType: name,
      surfaceSeatCount: seats.length,
      seats: compact ? seats.map(compactSurfaceSeat) : seats.map(safeClone),
      sourceTerrain: SOURCE_GLOBAL,
      surfaceDerivedFromTerrain: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      rendersNothing: true,
      noCanvasCreation: true,
      finalSurfacePassClaim: false,
      finalVisualPassClaim: false
    }, extra || {}));
  }

  function filterByPredicate(predicate) {
    return state.surfaceSeatRegistry.filter(predicate);
  }

  function getDryCrustField(options) {
    ensureBuilt();
    return field("dry_crust_field", state.surfaceSeatRegistry, {
      dryCrustFieldReady: state.surfaceSeatRegistry.length === SURFACE_SEAT_COUNT
    }, options || {});
  }

  function getMineralToneField(options) {
    ensureBuilt();
    return field("mineral_tone_field", state.surfaceSeatRegistry, {
      mineralToneFieldReady: state.surfaceSeatRegistry.length === SURFACE_SEAT_COUNT
    }, options || {});
  }

  function getReliefReadabilityField(options) {
    ensureBuilt();
    var seats = filterByPredicate(function (seat) { return seat.reliefReadability > 0.18; });
    return field("relief_readability_field", seats, {
      reliefReadabilityFieldReady: seats.length > 0
    }, options || {});
  }

  function getRidgeHighlightField(options) {
    ensureBuilt();
    var seats = filterByPredicate(function (seat) { return seat.ridgeHighlight > 0.22 || seat.summitHighlight > 0.24; });
    return field("ridge_highlight_field", seats, {
      ridgeHighlightFieldReady: seats.length > 0
    }, options || {});
  }

  function getBasinShadowField(options) {
    ensureBuilt();
    var seats = filterByPredicate(function (seat) { return seat.basinShadow > 0.22 || seat.trenchDeepShadow > 0.24; });
    return field("basin_shadow_field", seats, {
      basinShadowFieldReady: seats.length > 0
    }, options || {});
  }

  function getShelfTransitionField(options) {
    ensureBuilt();
    var seats = filterByPredicate(function (seat) { return seat.shelfTransitionTone > 0.22; });
    return field("shelf_transition_field", seats, {
      shelfTransitionFieldReady: seats.length > 0,
      activeCoastline: false,
      wetEdgeBehaviorActive: false
    }, options || {});
  }

  function getEscarpmentEdgeField(options) {
    ensureBuilt();
    var seats = filterByPredicate(function (seat) { return seat.escarpmentEdgeTone > 0.22; });
    return field("escarpment_edge_field", seats, {
      escarpmentEdgeFieldReady: seats.length > 0
    }, options || {});
  }

  function getFormerSeabedToneField(options) {
    ensureBuilt();
    var seats = filterByPredicate(function (seat) { return seat.formerSeabedTone > 0.22; });
    return field("former_seabed_tone_field", seats, {
      formerSeabedToneFieldReady: seats.length > 0,
      formerHydrosphereMemoryAsDryMaterialOnly: true,
      activeWater: false
    }, options || {});
  }

  function getFutureFillSuppressionField(options) {
    ensureBuilt();
    var seats = filterByPredicate(function (seat) { return seat.futureFillSuppression > 0.22; });
    return field("future_fill_suppression_field", seats, {
      futureFillSuppressionFieldReady: seats.length > 0,
      futureFillVisualSuppressed: true,
      fillTheGapsLater: true,
      activeHydration: false,
      activeWater: false
    }, options || {});
  }

  function directFieldReadiness() {
    var seats = state.surfaceSeatRegistry;

    return {
      dryCrustFieldReady: seats.length === SURFACE_SEAT_COUNT,
      mineralToneFieldReady: seats.length === SURFACE_SEAT_COUNT,
      reliefReadabilityFieldReady: seats.some(function (seat) { return seat.reliefReadability > 0.18; }),
      ridgeHighlightFieldReady: seats.some(function (seat) { return seat.ridgeHighlight > 0.22 || seat.summitHighlight > 0.24; }),
      basinShadowFieldReady: seats.some(function (seat) { return seat.basinShadow > 0.22 || seat.trenchDeepShadow > 0.24; }),
      shelfTransitionFieldReady: seats.some(function (seat) { return seat.shelfTransitionTone > 0.22; }),
      escarpmentEdgeFieldReady: seats.some(function (seat) { return seat.escarpmentEdgeTone > 0.22; }),
      formerSeabedToneFieldReady: seats.some(function (seat) { return seat.formerSeabedTone > 0.22; }),
      futureFillSuppressionFieldReady: seats.some(function (seat) { return seat.futureFillSuppression > 0.22; })
    };
  }

  function buildAcceptanceReceipt() {
    var seats = state.surfaceSeatRegistry;
    var terrainSeats = normalizeTerrainSeats(state.terrainReceivePacket);
    var materialClasses = {};
    var surfaceKeySet = new Set();
    var terrainKeySet = new Set();
    var datumChronoSet = new Set();
    var readiness = directFieldReadiness();

    seats.forEach(function (seat) {
      materialClasses[seat.surfaceMaterialClass] = (materialClasses[seat.surfaceMaterialClass] || 0) + 1;
      surfaceKeySet.add(seat.surfaceSeatKey);
      terrainKeySet.add(seat.terrainSeatKey);
      datumChronoSet.add(seat.datumChronologicalSeatKey);
    });

    var receipt = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      file: FILE,
      sourceGlobal: SOURCE_GLOBAL,
      sourceTerrainContract: SOURCE_TERRAIN_CONTRACT,

      terrainDetected: state.terrainDetected,
      terrainValidated: state.terrainValidated,
      terrainFailureReason: state.terrainFailureReason,

      sourceTerrainSeatCount: terrainSeats.length,
      surfaceSeatCount: seats.length,
      uniqueSurfaceSeatKeyCount: surfaceKeySet.size,
      uniqueTerrainSeatKeyCount: terrainKeySet.size,
      uniqueDatumChronologicalSeatKeyCount: datumChronoSet.size,

      surfaceMaterialClassCounts: materialClasses,
      surfaceMaterialClassCount: Object.keys(materialClasses).length,

      allSurfaceSeatsLinkedToTerrain: seats.every(function (seat) { return Boolean(seat.terrainSeatKey); }),
      allSurfaceSeatsLinkedToDatum: seats.every(function (seat) { return Boolean(seat.datumChronologicalSeatKey && seat.datumSequenceCompassKey); }),
      allSurfaceSeatsHaveMaterialClass: seats.every(function (seat) { return Boolean(seat.surfaceMaterialClass); }),
      allSurfaceSeatsHaveMaterialRole: seats.every(function (seat) { return Boolean(seat.surfaceMaterialRole); }),
      allSurfaceSeatsHaveSurfaceRoughness: seats.every(function (seat) { return Number.isFinite(Number(seat.surfaceRoughness)); }),
      allSurfaceSeatsHaveMaterialDryness: seats.every(function (seat) { return Number.isFinite(Number(seat.materialDryness)); }),
      allSurfaceSeatsHaveMaterialBrightness: seats.every(function (seat) { return Number.isFinite(Number(seat.materialBrightness)); }),
      allSurfaceSeatsHaveMaterialContrast: seats.every(function (seat) { return Number.isFinite(Number(seat.materialContrast)); }),
      allSurfaceSeatsHaveAckStack: seats.every(function (seat) { return seat.ackStackComplete === true; }),
      allSurfaceSeatsHaveTerrainReference: seats.every(function (seat) { return seat.terrainReferenceComplete === true; }),

      dryCrustFieldReady: readiness.dryCrustFieldReady,
      mineralToneFieldReady: readiness.mineralToneFieldReady,
      reliefReadabilityFieldReady: readiness.reliefReadabilityFieldReady,
      ridgeHighlightFieldReady: readiness.ridgeHighlightFieldReady,
      basinShadowFieldReady: readiness.basinShadowFieldReady,
      shelfTransitionFieldReady: readiness.shelfTransitionFieldReady,
      escarpmentEdgeFieldReady: readiness.escarpmentEdgeFieldReady,
      formerSeabedToneFieldReady: readiness.formerSeabedToneFieldReady,
      futureFillSuppressionFieldReady: readiness.futureFillSuppressionFieldReady,

      carrierSurfacePacketReady: true,
      childReceivePacketReady: true,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      rendersNothing: true,
      noCanvasCreation: true,
      finalSurfacePassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    receipt.acceptancePassed = Boolean(
      receipt.terrainDetected === true &&
      receipt.terrainValidated === true &&
      receipt.sourceTerrainSeatCount === SURFACE_SEAT_COUNT &&
      receipt.surfaceSeatCount === SURFACE_SEAT_COUNT &&
      receipt.uniqueSurfaceSeatKeyCount === SURFACE_SEAT_COUNT &&
      receipt.uniqueTerrainSeatKeyCount === SURFACE_SEAT_COUNT &&
      receipt.uniqueDatumChronologicalSeatKeyCount === SURFACE_SEAT_COUNT &&
      receipt.allSurfaceSeatsLinkedToTerrain &&
      receipt.allSurfaceSeatsLinkedToDatum &&
      receipt.allSurfaceSeatsHaveMaterialClass &&
      receipt.allSurfaceSeatsHaveMaterialRole &&
      receipt.allSurfaceSeatsHaveSurfaceRoughness &&
      receipt.allSurfaceSeatsHaveMaterialDryness &&
      receipt.allSurfaceSeatsHaveMaterialBrightness &&
      receipt.allSurfaceSeatsHaveMaterialContrast &&
      receipt.allSurfaceSeatsHaveAckStack &&
      receipt.allSurfaceSeatsHaveTerrainReference &&
      receipt.surfaceMaterialClassCount >= 8 &&
      receipt.dryCrustFieldReady &&
      receipt.mineralToneFieldReady &&
      receipt.reliefReadabilityFieldReady &&
      receipt.ridgeHighlightFieldReady &&
      receipt.basinShadowFieldReady &&
      receipt.shelfTransitionFieldReady &&
      receipt.escarpmentEdgeFieldReady &&
      receipt.formerSeabedToneFieldReady &&
      receipt.futureFillSuppressionFieldReady &&
      receipt.carrierSurfacePacketReady &&
      receipt.childReceivePacketReady &&
      receipt.hydrationHeld &&
      receipt.activeHydration === false &&
      receipt.activeWater === false &&
      receipt.rendersNothing &&
      receipt.noCanvasCreation &&
      receipt.finalSurfacePassClaim === false &&
      receipt.finalHydrationPassClaim === false &&
      receipt.finalVisualPassClaim === false
    );

    return Object.freeze(receipt);
  }

  function buildSurfacePacket(target, options) {
    options = options || {};

    var seats = state.surfaceSeatRegistry;

    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      target: target || "unassigned-g2-surface-consumer",
      packetType: "audralia_g2_surface_material_packet",
      sourceGlobal: SOURCE_GLOBAL,
      sourceTerrainContract: SOURCE_TERRAIN_CONTRACT,

      terrainDetected: state.terrainDetected,
      terrainValidated: state.terrainValidated,
      sourceTerrainSeatCount: normalizeTerrainSeats(state.terrainReceivePacket).length,

      surfacePacketReady: state.terrainValidated,
      surfaceSeatCount: seats.length,
      surfaceMaterialClasses: SURFACE_MATERIAL_CLASSES.slice(),
      surfaceSeats: options.compact === true ? seats.map(compactSurfaceSeat) : seats.map(safeClone),
      seats: options.compact === true ? seats.map(compactSurfaceSeat) : seats.map(safeClone),

      dryCrustField: getDryCrustField({ compact: true }),
      mineralToneField: getMineralToneField({ compact: true }),
      reliefReadabilityField: getReliefReadabilityField({ compact: true }),
      ridgeHighlightField: getRidgeHighlightField({ compact: true }),
      basinShadowField: getBasinShadowField({ compact: true }),
      shelfTransitionField: getShelfTransitionField({ compact: true }),
      escarpmentEdgeField: getEscarpmentEdgeField({ compact: true }),
      formerSeabedToneField: getFormerSeabedToneField({ compact: true }),
      futureFillSuppressionField: getFutureFillSuppressionField({ compact: true }),

      terrainIdentityPreserved: true,
      datumLineagePreserved: true,
      surfaceDerivedFromTerrain: true,
      surfaceMutatesTerrain: false,
      surfaceMutatesDatum: false,

      colorIdentityIsMetadataOnly: true,
      laneColorIsMaterialTruth: false,
      versionColorIsMaterialTruth: false,

      formerHydrosphereMemoryAsDryMaterialOnly: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      rendersNothing: true,
      noCanvasCreation: true,
      childDrawsVisuals: false,
      finalSurfacePassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function buildCarrierSurfacePacket(target, options) {
    options = options || {};

    return Object.freeze({
      contract: CONTRACT,
      target: target || "audralia-g2-carrier-runtime",
      packetType: "audralia_g2_carrier_safe_surface_material_packet",
      sourceTerrainContract: SOURCE_TERRAIN_CONTRACT,

      carrierSurfacePacketReady: state.terrainValidated,
      carrierMayConsume: state.terrainValidated,
      carrierMayDisplayPacket: state.terrainValidated,
      carrierDisplaysOnly: true,
      carrierInventsSurface: false,
      carrierOwnsSurfaceTruth: false,
      carrierOwnsTerrainTruth: false,
      carrierOwnsHydrationTruth: false,

      surfaceSeatCount: state.surfaceSeatRegistry.length,
      seats: state.surfaceSeatRegistry.map(compactSurfaceSeat),
      carrierSurfaceHints: state.surfaceSeatRegistry.map(function (seat) {
        return seat.carrierSurfaceHint;
      }),

      surfaceMaterialClasses: SURFACE_MATERIAL_CLASSES.slice(),

      dryCrustField: getDryCrustField({ compact: true }),
      mineralToneField: getMineralToneField({ compact: true }),
      reliefReadabilityField: getReliefReadabilityField({ compact: true }),
      ridgeHighlightField: getRidgeHighlightField({ compact: true }),
      basinShadowField: getBasinShadowField({ compact: true }),
      shelfTransitionField: getShelfTransitionField({ compact: true }),
      escarpmentEdgeField: getEscarpmentEdgeField({ compact: true }),
      formerSeabedToneField: getFormerSeabedToneField({ compact: true }),
      futureFillSuppressionField: getFutureFillSuppressionField({ compact: true }),

      sourceSurfaceChildOwnsTruth: true,
      carrierShouldNotMutateSurface: true,
      carrierShouldNotMutateTerrain: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      finalSurfacePassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function rebuild() {
    detectTerrainSource();

    if (!state.terrainValidated) {
      state.surfaceSeatRegistry = Object.freeze([]);
      state.surfaceSeatByKey = {};
      state.surfaceSeatByTerrainKey = {};
      state.surfacePacket = null;
      state.carrierSurfacePacket = null;
      state.acceptanceReceipt = Object.freeze({
        contract: CONTRACT,
        file: FILE,
        terrainDetected: state.terrainDetected,
        terrainValidated: false,
        terrainFailureReason: state.terrainFailureReason,
        sourceTerrainSeatCount: 0,
        surfaceSeatCount: 0,
        acceptancePassed: false,
        surfacePacketReady: false,
        carrierSurfacePacketReady: false,
        childReceivePacketReady: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        rendersNothing: true,
        noCanvasCreation: true,
        finalSurfacePassClaim: false,
        finalHydrationPassClaim: false,
        finalVisualPassClaim: false
      });

      state.surfacePacketReady = false;
      state.carrierSurfacePacketReady = false;
      state.childReceivePacketReady = false;

      return false;
    }

    buildSurfaceSeatRegistry();

    state.surfacePacket = buildSurfacePacket("published-g2-surface-material", { compact: false });
    state.carrierSurfacePacket = buildCarrierSurfacePacket("published-g2-carrier-surface", { compact: true });
    state.acceptanceReceipt = buildAcceptanceReceipt();

    state.surfacePacketReady = state.acceptanceReceipt.acceptancePassed;
    state.carrierSurfacePacketReady = state.acceptanceReceipt.acceptancePassed;
    state.childReceivePacketReady = state.acceptanceReceipt.acceptancePassed;
    state.buildCount += 1;

    return state.acceptanceReceipt.acceptancePassed;
  }

  function ensureBuilt() {
    if (!state.acceptanceReceipt) rebuild();
    return state.acceptanceReceipt && state.acceptanceReceipt.acceptancePassed === true;
  }

  function getSurfacePacket(target, options) {
    ensureBuilt();
    return buildSurfacePacket(target, options || {});
  }

  function receive(options) {
    return getSurfacePacket("receive", options || {});
  }

  function getCarrierSurfacePacket(target, options) {
    ensureBuilt();
    return buildCarrierSurfacePacket(target, options || {});
  }

  function getSurfaceSeat(seatIndex, options) {
    ensureBuilt();

    var index = Math.floor(clamp(seatIndex, 0, Math.max(0, state.surfaceSeatRegistry.length - 1)));
    var seat = state.surfaceSeatRegistry[index];

    if (!seat) return null;
    return options && options.reference === true ? seat : safeClone(seat);
  }

  function getSurfaceSeatByTerrainSeatKey(terrainSeatKey, options) {
    ensureBuilt();

    var seat = state.surfaceSeatByTerrainKey[String(terrainSeatKey || "")];

    if (!seat) return null;
    return options && options.reference === true ? seat : safeClone(seat);
  }

  function getSurfaceSeatsByMaterialClass(materialClass, options) {
    ensureBuilt();

    var seats = state.surfaceSeatRegistry.filter(function (seat) {
      return seat.surfaceMaterialClass === String(materialClass || "");
    });

    return options && options.reference === true ? seats : safeClone(seats);
  }

  function getSurfaceSeatsByRole(role, options) {
    ensureBuilt();

    var text = String(role || "").toLowerCase();

    var seats = state.surfaceSeatRegistry.filter(function (seat) {
      return seat.surfaceMaterialRole === text ||
        seat.dryCrustClass === text ||
        seat.mineralToneClass === text ||
        seat.reliefReadabilityClass === text ||
        seat.shadowBehaviorClass === text;
    });

    return options && options.reference === true ? seats : safeClone(seats);
  }

  function getChildReceivePacket(target, options) {
    ensureBuilt();
    options = options || {};

    var packet = {
      contract: CONTRACT,
      target: target || "unassigned-g2-surface-child-consumer",
      packetType: "audralia_g2_surface_material_child_receive_packet",
      sourceTerrainContract: SOURCE_TERRAIN_CONTRACT,
      sourceGlobal: SOURCE_GLOBAL,

      terrainDetected: state.terrainDetected,
      terrainValidated: state.terrainValidated,
      terrainFailureReason: state.terrainFailureReason,

      childReceivePacketReady: state.childReceivePacketReady,
      surfacePacketReady: state.surfacePacketReady,
      carrierSurfacePacketReady: state.carrierSurfacePacketReady,

      status: status(),
      acceptanceReceipt: state.acceptanceReceipt,
      surfacePacket: getSurfacePacket(target || "child-receive-surface", { compact: options.compact === true }),
      carrierSurfacePacket: getCarrierSurfacePacket(target || "child-receive-carrier", { compact: true }),

      surfaceSeatCount: state.surfaceSeatRegistry.length,
      seats: options.compact === true ? state.surfaceSeatRegistry.map(compactSurfaceSeat) : state.surfaceSeatRegistry.map(safeClone),

      surfaceMaterialClasses: SURFACE_MATERIAL_CLASSES.slice(),

      surfaceLayerOwnsMaterialTruth: true,
      consumerMayRead: state.childReceivePacketReady,
      consumerMayMutateSurfaceTruth: false,
      consumerMayMutateTerrainTruth: false,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      rendersNothing: true,
      noCanvasCreation: true,
      finalSurfacePassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      issuedAt: new Date().toISOString()
    };

    state.childPacketCount += 1;
    state.lastChildPacket = {
      target: packet.target,
      issuedAt: packet.issuedAt,
      surfaceSeatCount: packet.surfaceSeatCount,
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
      family: FAMILY,
      file: FILE,
      sourceGlobal: SOURCE_GLOBAL,
      sourceTerrainContract: SOURCE_TERRAIN_CONTRACT,

      initialized: state.initialized,
      buildCount: state.buildCount,

      terrainDetected: state.terrainDetected,
      terrainApiComplete: state.terrainApiComplete,
      terrainValidated: state.terrainValidated,
      terrainFailureReason: state.terrainFailureReason,

      surfacePacketReady: state.surfacePacketReady,
      carrierSurfacePacketReady: state.carrierSurfacePacketReady,
      childReceivePacketReady: state.childReceivePacketReady,

      sourceTerrainSeatCount: normalizeTerrainSeats(state.terrainReceivePacket).length,
      surfaceSeatCount: state.surfaceSeatRegistry.length,
      surfaceMaterialClasses: SURFACE_MATERIAL_CLASSES.slice(),

      acceptanceReceipt: state.acceptanceReceipt,
      acceptancePassed: state.acceptanceReceipt ? state.acceptanceReceipt.acceptancePassed : false,

      dryCrustFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.dryCrustFieldReady : false,
      mineralToneFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.mineralToneFieldReady : false,
      reliefReadabilityFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.reliefReadabilityFieldReady : false,
      ridgeHighlightFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.ridgeHighlightFieldReady : false,
      basinShadowFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.basinShadowFieldReady : false,
      shelfTransitionFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.shelfTransitionFieldReady : false,
      escarpmentEdgeFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.escarpmentEdgeFieldReady : false,
      formerSeabedToneFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.formerSeabedToneFieldReady : false,
      futureFillSuppressionFieldReady: state.acceptanceReceipt ? state.acceptanceReceipt.futureFillSuppressionFieldReady : false,

      terrainIdentityPreserved: true,
      datumLineagePreserved: true,
      surfaceDerivedFromTerrain: state.terrainValidated,
      surfaceMutatesTerrain: false,
      surfaceMutatesDatum: false,

      colorIdentityIsMetadataOnly: true,
      laneColorIsMaterialTruth: false,
      versionColorIsMaterialTruth: false,

      formerHydrosphereMemoryAsDryMaterialOnly: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      rendersNothing: true,
      noCanvasCreation: true,
      ownsDatumTruth: false,
      ownsTerrainTruth: false,
      ownsSurfaceMaterialTruth: true,
      ownsHydrationTruth: false,
      ownsRuntimeRendering: false,
      ownsHtml: false,
      ownsRouteJs: false,
      childDrawsVisuals: false,

      finalSurfacePassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      childPacketCount: state.childPacketCount,
      lastChildPacket: state.lastChildPacket,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_G2_SURFACE_MATERIAL_CHILD_DEPLOY_MARKER_v1"
    };
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      family: FAMILY,
      file: FILE,
      sourceGlobal: SOURCE_GLOBAL,
      sourceTerrainContract: SOURCE_TERRAIN_CONTRACT,

      status: status,
      receive: receive,
      refresh: rebuild,

      getSurfacePacket: getSurfacePacket,
      getCarrierSurfacePacket: getCarrierSurfacePacket,
      getSurfaceSeat: getSurfaceSeat,
      getSurfaceSeatByTerrainSeatKey: getSurfaceSeatByTerrainSeatKey,
      getSurfaceSeatsByMaterialClass: getSurfaceSeatsByMaterialClass,
      getSurfaceSeatsByRole: getSurfaceSeatsByRole,

      getDryCrustField: getDryCrustField,
      getMineralToneField: getMineralToneField,
      getReliefReadabilityField: getReliefReadabilityField,
      getRidgeHighlightField: getRidgeHighlightField,
      getBasinShadowField: getBasinShadowField,
      getShelfTransitionField: getShelfTransitionField,
      getEscarpmentEdgeField: getEscarpmentEdgeField,
      getFormerSeabedToneField: getFormerSeabedToneField,
      getFutureFillSuppressionField: getFutureFillSuppressionField,
      getChildReceivePacket: getChildReceivePacket
    };

    if (typeof window !== "undefined") {
      window.AUDRALIA_G2_SURFACE_MATERIAL_CHILD = api;
      window.AUDRALIA_SURFACE_MATERIAL_CHILD_G2 = api;
      window.AUDRALIA_G2_DRY_SURFACE_CHILD = api;
      window.AUDRALIA_G2_SURFACE_PACKET_CHILD = api;

      window.AUDRALIA_G2_SURFACE_MATERIAL_STATUS = status();
      window.AUDRALIA_G2_SURFACE_MATERIAL_PACKET = getSurfacePacket("published-g2-surface-material", { compact: true });
      window.AUDRALIA_G2_CARRIER_SURFACE_PACKET = getCarrierSurfacePacket("published-g2-carrier-surface", { compact: true });
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
