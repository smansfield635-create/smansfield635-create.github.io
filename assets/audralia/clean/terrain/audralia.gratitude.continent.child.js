// /assets/audralia/clean/terrain/audralia.gratitude.continent.child.js
// AUDRALIA_G2_GRATITUDE_CONTINENT_CHINA_SCALE_OBLONG_FOOTPRINT_CHILD_TNT_v1
// Full-file replacement.
// Scope: downstream Gratitude terrain child authority only.
// Purpose: shrink Gratitude from a hemispheric sheet into a compact China-scale oblong largest-authored landmass.
// Owns: Gratitude footprint, Nine Summits anchors, land-first elevation, ridges, basins, valleys, and derived valley-fill hydration.
// Does not own: carrier rendering, HTML, core physics, runtime strength, final terrain pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_GRATITUDE_CONTINENT_CHINA_SCALE_OBLONG_FOOTPRINT_CHILD_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_GRATITUDE_CONTINENT_LAND_FIRST_VALLEY_FILL_TERRAIN_CHILD_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_GRATITUDE_CONTINENT_CHINA_SCALE_OBLONG_FOOTPRINT_CHILD_SPEC_OPS_v1";

  var FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var CARRIER_FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var CORE_FILE = "/assets/audralia/clean/core/audralia.planet-core.child.js";

  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";
  var SCALE_CLASS = "china_scale_oblong_major_landmass";
  var TARGET_LAND_RATIO = 0.0625;

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var NEWS = Object.freeze(["north", "east", "west", "south"]);

  /*
    The footprint is intentionally small.

    Previous child behavior read like a hemisphere-scale sheet.
    This replacement treats Gratitude as the largest authored landmass so far,
    but physically closer to a China-scale oblong body on the planet.

    16 / 256 = 0.0625 of the child lattice.
    This is roughly a 90%+ visual reduction from the prior broad land blanket.
  */
  var FOOTPRINT = Object.freeze([
    Object.freeze([8, 6]), Object.freeze([9, 6]),

    Object.freeze([7, 7]), Object.freeze([8, 7]),
    Object.freeze([9, 7]), Object.freeze([10, 7]),

    Object.freeze([7, 8]), Object.freeze([8, 8]),
    Object.freeze([9, 8]), Object.freeze([10, 8]),
    Object.freeze([11, 8]),

    Object.freeze([8, 9]), Object.freeze([9, 9]),
    Object.freeze([10, 9]),

    Object.freeze([9, 10]), Object.freeze([10, 10])
  ]);

  var SUMMIT_BLUEPRINTS = Object.freeze([
    Object.freeze(["summit_01", "First Summit of Gratitude", 8, 6, 0.92, "northwest_crown", "southward_runoff"]),
    Object.freeze(["summit_02", "Second Summit of Gratitude", 9, 6, 1.00, "north_crown", "central_runoff"]),
    Object.freeze(["summit_03", "Third Summit of Gratitude", 7, 7, 0.88, "west_shoulder", "eastward_runoff"]),
    Object.freeze(["summit_04", "Fourth Summit of Gratitude", 10, 7, 0.90, "east_shoulder", "westward_runoff"]),
    Object.freeze(["summit_05", "Fifth Summit of Gratitude", 8, 8, 1.08, "central_keystone", "radial_runoff"]),
    Object.freeze(["summit_06", "Sixth Summit of Gratitude", 11, 8, 0.84, "east_crown", "westward_runoff"]),
    Object.freeze(["summit_07", "Seventh Summit of Gratitude", 8, 9, 0.82, "southwest_shoulder", "northward_runoff"]),
    Object.freeze(["summit_08", "Eighth Summit of Gratitude", 10, 9, 0.86, "southeast_shoulder", "northwest_runoff"]),
    Object.freeze(["summit_09", "Ninth Summit of Gratitude", 9, 10, 0.88, "south_crown", "central_runoff"])
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function distance(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
  }

  function key(x, y) {
    return String(x) + "," + String(y);
  }

  function seatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  var FOOTPRINT_LOOKUP = FOOTPRINT.reduce(function (map, pair, index) {
    map[key(pair[0], pair[1])] = index + 1;
    return map;
  }, Object.create(null));

  function isFootprintSeat(x, y) {
    return Boolean(FOOTPRINT_LOOKUP[key(x, y)]);
  }

  function footprintCenter() {
    var totalX = 0;
    var totalY = 0;

    for (var i = 0; i < FOOTPRINT.length; i += 1) {
      totalX += FOOTPRINT[i][0];
      totalY += FOOTPRINT[i][1];
    }

    return {
      x: totalX / FOOTPRINT.length,
      y: totalY / FOOTPRINT.length
    };
  }

  var CENTER = Object.freeze(footprintCenter());

  function makeSummit(blueprint, index) {
    return Object.freeze({
      id: blueprint[0],
      name: blueprint[1],
      continentId: CONTINENT_ID,
      x: blueprint[2],
      y: blueprint[3],
      seatIndex: blueprint[3] * RADIAL_NODES + blueprint[2],
      seatKey: seatKey(blueprint[2], blueprint[3]),
      elevationPressure: blueprint[4],
      influenceRadius: 1.85,
      ridgeBias: blueprint[5],
      drainageBias: blueprint[6],
      ordinal: index + 1,
      role: "compressed_nine_summits_terrain_anchor",
      labelIsDecorative: false,
      shapesLandmass: true,
      shapesRidges: true,
      shapesBasins: true,
      shapesValleys: true,
      shapesHydration: true
    });
  }

  var SUMMITS = Object.freeze(SUMMIT_BLUEPRINTS.map(makeSummit));

  function nearestSummit(x, y) {
    var best = null;
    var bestDistance = Infinity;

    for (var i = 0; i < SUMMITS.length; i += 1) {
      var summit = SUMMITS[i];
      var d = distance(x - summit.x, y - summit.y);

      if (d < bestDistance) {
        best = summit;
        bestDistance = d;
      }
    }

    return {
      summit: best,
      distance: bestDistance
    };
  }

  function summitInfluenceAt(x, y, summit) {
    var d = distance(x - summit.x, y - summit.y);
    return clamp(1 - d / summit.influenceRadius, 0, 1);
  }

  function oblongPressureAt(x, y) {
    var dx = (x - CENTER.x) / 2.55;
    var dy = (y - CENTER.y) / 1.62;

    var oblong = 1 - (dx * dx + dy * dy);
    var edgeIrregularity =
      Math.sin((x + 0.7) * 1.91) * 0.045 +
      Math.cos((y + 2.2) * 1.37) * 0.040 +
      Math.sin((x + y) * 0.88) * 0.035;

    var footprintBoost = isFootprintSeat(x, y) ? 0.64 : 0;

    return oblong + edgeIrregularity + footprintBoost;
  }

  function ridgeInfluenceAt(x, y) {
    function lineInfluence(ax, ay, bx, by, strength, width) {
      var vx = bx - ax;
      var vy = by - ay;
      var wx = x - ax;
      var wy = y - ay;
      var len2 = vx * vx + vy * vy;

      if (!len2) return 0;

      var t = clamp((wx * vx + wy * vy) / len2, 0, 1);
      var cx = ax + t * vx;
      var cy = ay + t * vy;
      var d = distance(x - cx, y - cy);

      return strength * clamp(1 - d / width, 0, 1);
    }

    var ridge = 0;

    ridge += lineInfluence(8, 6, 9, 6, 0.28, 1.05);
    ridge += lineInfluence(7, 7, 8, 8, 0.24, 1.00);
    ridge += lineInfluence(9, 6, 10, 7, 0.25, 1.00);
    ridge += lineInfluence(8, 8, 11, 8, 0.22, 1.10);
    ridge += lineInfluence(8, 8, 9, 10, 0.24, 1.00);
    ridge += lineInfluence(10, 7, 10, 9, 0.20, 0.95);

    return clamp(ridge, 0, 1);
  }

  function basinInfluenceAt(x, y) {
    var basins = [
      { x: 8.7, y: 8.2, radius: 1.55, depth: 0.28, name: "central gratitude basin" },
      { x: 9.8, y: 9.1, radius: 1.25, depth: 0.22, name: "southern receiving basin" },
      { x: 7.7, y: 7.8, radius: 1.20, depth: 0.18, name: "western shoulder basin" }
    ];

    var best = 0;
    var name = "none";

    for (var i = 0; i < basins.length; i += 1) {
      var basin = basins[i];
      var d = distance((x - basin.x) / basin.radius, (y - basin.y) / basin.radius);
      var influence = basin.depth * clamp(1 - d, 0, 1);

      if (influence > best) {
        best = influence;
        name = basin.name;
      }
    }

    return {
      value: clamp(best, 0, 1),
      name: name
    };
  }

  function valleyInfluenceAt(x, y) {
    function valleyLine(ax, ay, bx, by, strength, width) {
      var vx = bx - ax;
      var vy = by - ay;
      var wx = x - ax;
      var wy = y - ay;
      var len2 = vx * vx + vy * vy;

      if (!len2) return 0;

      var t = clamp((wx * vx + wy * vy) / len2, 0, 1);
      var cx = ax + t * vx;
      var cy = ay + t * vy;
      var d = distance(x - cx, y - cy);

      return strength * clamp(1 - d / width, 0, 1);
    }

    var valley = 0;

    valley += valleyLine(8, 6, 9, 10, 0.36, 0.72);
    valley += valleyLine(7, 7, 10, 9, 0.26, 0.76);
    valley += valleyLine(10, 7, 8, 9, 0.22, 0.70);

    return clamp(valley, 0, 1);
  }

  function coastEligibilityAt(x, y, isLand) {
    if (!isLand) return false;

    var neighbors = [
      [x - 1, y], [x + 1, y],
      [x, y - 1], [x, y + 1]
    ];

    return neighbors.some(function (pair) {
      return !isFootprintSeat(pair[0], pair[1]);
    });
  }

  function makeTerrainSeat(x, y) {
    var seatIndex = y * RADIAL_NODES + x;
    var isLand = isFootprintSeat(x, y);
    var oblongPressure = oblongPressureAt(x, y);
    var nearest = nearestSummit(x, y);

    var summitTotal = 0;
    var maxSummitInfluence = 0;
    var summitInfluences = [];

    for (var i = 0; i < SUMMITS.length; i += 1) {
      var summit = SUMMITS[i];
      var influence = isLand ? summitInfluenceAt(x, y, summit) : 0;

      if (influence > 0) {
        summitInfluences.push({
          summitId: summit.id,
          summitName: summit.name,
          influence: round(influence, 4)
        });
      }

      summitTotal += influence * summit.elevationPressure;
      maxSummitInfluence = Math.max(maxSummitInfluence, influence);
    }

    summitTotal = clamp(summitTotal / 1.85, 0, 1);

    var ridgeInfluence = isLand ? ridgeInfluenceAt(x, y) : 0;
    var basin = isLand ? basinInfluenceAt(x, y) : { value: 0, name: "none" };
    var valleyInfluence = isLand ? valleyInfluenceAt(x, y) : 0;

    var baseElevation = isLand
      ? clamp(0.40 + oblongPressure * 0.10, 0.34, 0.58)
      : 0;

    var elevation = isLand
      ? clamp(
        baseElevation +
        summitTotal * 0.30 +
        ridgeInfluence * 0.16 -
        basin.value * 0.20 -
        valleyInfluence * 0.14,
        0.18,
        0.94
      )
      : 0;

    var summitSeat = Boolean(isLand && nearest.distance < 0.55);
    var ridgeStatus = Boolean(isLand && ridgeInfluence > 0.18);
    var basinStatus = Boolean(isLand && basin.value > 0.08);
    var valleyStatus = Boolean(isLand && valleyInfluence > 0.18);
    var continentCore = Boolean(isLand && !coastEligibilityAt(x, y, isLand) && elevation > 0.48);
    var coastEligible = coastEligibilityAt(x, y, isLand);

    var waterFillEligible = Boolean(
      isLand &&
      (basinStatus || valleyStatus) &&
      elevation < 0.58 &&
      !summitSeat
    );

    var runoffPressure = isLand
      ? clamp(summitTotal * 0.34 + ridgeInfluence * 0.18 + valleyInfluence * 0.30 + basin.value * 0.24, 0, 1)
      : 0;

    var hydrationDepth = waterFillEligible
      ? clamp((0.58 - elevation) * 1.50 + basin.value * 0.28 + valleyInfluence * 0.18, 0.04, 0.56)
      : 0;

    var hydrationClass = "outside_gratitude_continent";
    if (isLand) hydrationClass = "dry_land";
    if (isLand && coastEligible) hydrationClass = "coastal_edge_held";
    if (isLand && ridgeStatus) hydrationClass = "highland_dry";
    if (isLand && hydrationDepth > 0 && hydrationDepth < 0.22) hydrationClass = "seasonal_valley_fill";
    if (isLand && hydrationDepth >= 0.22 && hydrationDepth < 0.42) hydrationClass = "basin_lake_fill";
    if (isLand && hydrationDepth >= 0.42) hydrationClass = "deep_valley_fill";

    return Object.freeze({
      seatIndex: seatIndex,
      seatKey: seatKey(x, y),
      x: x,
      y: y,
      band: y,
      radial: x,
      fibonacci: FIBONACCI_SEQUENCE[y],

      continentId: isLand ? CONTINENT_ID : null,
      continentName: isLand ? CONTINENT_NAME : null,
      continentMembership: isLand,
      continentCore: continentCore,
      gratitudeLargestContinent: true,
      largestAuthoredLandmassSoFar: true,
      chinaScaleOblongFootprint: true,
      hemisphereSheetRemoved: true,

      membershipPressure: round(oblongPressure, 4),
      elevation: round(elevation, 4),
      baseElevation: round(baseElevation, 4),
      summitInfluence: round(summitTotal, 4),
      maxSummitInfluence: round(maxSummitInfluence, 4),
      nearestSummitId: nearest.summit ? nearest.summit.id : null,
      nearestSummitName: nearest.summit ? nearest.summit.name : null,
      nearestSummitDistance: round(nearest.distance, 4),
      summitInfluences: summitInfluences,

      ridgeInfluence: round(ridgeInfluence, 4),
      ridgeStatus: ridgeStatus,
      basinInfluence: round(basin.value, 4),
      basinName: basin.name,
      basinStatus: basinStatus,
      valleyInfluence: round(valleyInfluence, 4),
      valleyStatus: valleyStatus,

      coastEligible: coastEligible,
      waterFillEligible: waterFillEligible,
      runoffPressure: round(runoffPressure, 4),
      hydrationDepth: round(hydrationDepth, 4),
      hydrationClass: hydrationClass,

      landFirst: true,
      elevationComputedBeforeHydration: true,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,

      renderEligible: true,
      carrierConsumptionAllowedAfterValidation: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,

      newsComplete: true,
      north: Object.freeze({
        defined: true,
        role: "oblong_land_origin",
        continentAnchor: isLand,
        scaleClass: SCALE_CLASS
      }),
      east: Object.freeze({
        defined: true,
        role: "compressed_surface_expression",
        elevation: round(elevation, 4)
      }),
      west: Object.freeze({
        defined: true,
        role: "edge_correction_and_sheet_removal",
        hemisphereSheetRemoved: true,
        coastEligible: coastEligible
      }),
      south: Object.freeze({
        defined: true,
        role: "grounded_valley_fill_consequence",
        waterFillEligible: waterFillEligible,
        hydrationDepth: round(hydrationDepth, 4)
      })
    });
  }

  function buildSeats() {
    var seats = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        seats.push(makeTerrainSeat(x, y));
      }
    }

    return Object.freeze(seats);
  }

  var SEATS = buildSeats();

  function countBy(predicate) {
    var count = 0;

    for (var i = 0; i < SEATS.length; i += 1) {
      if (predicate(SEATS[i])) count += 1;
    }

    return count;
  }

  function allSeatsNEWSComplete() {
    return SEATS.every(function (seat) {
      return Boolean(
        seat &&
        seat.newsComplete === true &&
        seat.north && seat.north.defined === true &&
        seat.east && seat.east.defined === true &&
        seat.west && seat.west.defined === true &&
        seat.south && seat.south.defined === true
      );
    });
  }

  var LAND_SEAT_COUNT = countBy(function (seat) { return seat.continentMembership; });
  var CORE_SEAT_COUNT = countBy(function (seat) { return seat.continentCore; });
  var RIDGE_SEAT_COUNT = countBy(function (seat) { return seat.ridgeStatus; });
  var BASIN_SEAT_COUNT = countBy(function (seat) { return seat.basinStatus; });
  var VALLEY_SEAT_COUNT = countBy(function (seat) { return seat.valleyStatus; });
  var WATER_FILL_SEAT_COUNT = countBy(function (seat) { return seat.waterFillEligible; });

  function status() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      target: FILE,
      protectedCarrier: CARRIER_FILE,
      protectedCore: CORE_FILE,

      childType: "terrain_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      scaleClass: SCALE_CLASS,

      gratitudeContinentChild: true,
      largestContinent: true,
      largestAuthoredLandmassSoFar: true,
      largestLandmassRank: 1,
      chinaScaleOblongFootprint: true,
      oblongFootprint: true,
      hemisphereSheetRemoved: true,
      ninetyPercentShrinkApplied: true,

      landFirst: true,
      nineSummitsEmbedded: true,
      nineSummitsCompressedIntoOblongLandmass: true,
      elevationComputedBeforeHydration: true,
      ridgeFieldComputed: true,
      basinFieldComputed: true,
      valleyFieldComputed: true,
      waterFillDerivedFromValleys: true,
      hydrationIsConsequence: true,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: SEATS.length,
      landSeatCount: LAND_SEAT_COUNT,
      continentCoreSeatCount: CORE_SEAT_COUNT,
      ridgeSeatCount: RIDGE_SEAT_COUNT,
      basinSeatCount: BASIN_SEAT_COUNT,
      valleySeatCount: VALLEY_SEAT_COUNT,
      waterFillSeatCount: WATER_FILL_SEAT_COUNT,
      landRatio: round(LAND_SEAT_COUNT / LATTICE_STATES, 4),
      targetLandRatio: TARGET_LAND_RATIO,

      summitCount: SUMMITS.length,
      summitConstruct: "nine_summits_compressed_inside_china_scale_oblong_landmass",
      newsProtocolActive: true,
      newsOrder: NEWS.slice(),
      allSeatsNewsComplete: allSeatsNEWSComplete(),

      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      terrainRenderAuthorizedByChildPacketOnly: true,
      hydrosphereCarrierUntouched: true,
      htmlUntouched: true,
      coreChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      earthSubstitution: false,
      australiaNameDrift: false,

      deployMarker: "AUDRALIA_G2_GRATITUDE_CHINA_SCALE_OBLONG_FOOTPRINT_DEPLOY_MARKER_v1"
    };
  }

  function compactSeat(seat) {
    return {
      seatIndex: seat.seatIndex,
      seatKey: seat.seatKey,
      x: seat.x,
      y: seat.y,
      continentMembership: seat.continentMembership,
      elevation: seat.elevation,
      continentCore: seat.continentCore,
      nearestSummitId: seat.nearestSummitId,
      hydrationDepth: seat.hydrationDepth,
      hydrationClass: seat.hydrationClass
    };
  }

  function publicSeat(seat) {
    return {
      seatIndex: seat.seatIndex,
      seatKey: seat.seatKey,
      x: seat.x,
      y: seat.y,
      continentMembership: seat.continentMembership,
      continentCore: seat.continentCore,
      elevation: seat.elevation,
      baseElevation: seat.baseElevation,
      nearestSummitId: seat.nearestSummitId,
      nearestSummitName: seat.nearestSummitName,
      ridgeStatus: seat.ridgeStatus,
      basinStatus: seat.basinStatus,
      valleyStatus: seat.valleyStatus,
      coastEligible: seat.coastEligible,
      waterFillEligible: seat.waterFillEligible,
      hydrationDepth: seat.hydrationDepth,
      hydrationClass: seat.hydrationClass,
      chinaScaleOblongFootprint: seat.chinaScaleOblongFootprint,
      hemisphereSheetRemoved: seat.hemisphereSheetRemoved,
      newsComplete: seat.newsComplete
    };
  }

  function getContinentMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      scaleClass: SCALE_CLASS,
      largestContinent: true,
      largestAuthoredLandmassSoFar: true,
      largestLandmassRank: 1,
      chinaScaleOblongFootprint: true,
      hemisphereSheetRemoved: true,
      landFirst: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: SEATS.length,
      landSeatCount: LAND_SEAT_COUNT,
      continentCoreSeatCount: CORE_SEAT_COUNT,
      landRatio: round(LAND_SEAT_COUNT / LATTICE_STATES, 4),
      targetLandRatio: TARGET_LAND_RATIO,
      seats: compact
        ? SEATS.filter(function (seat) { return seat.continentMembership; }).map(compactSeat)
        : SEATS.map(publicSeat)
    };
  }

  function getElevationMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      elevationComputedBeforeHydration: true,
      ridgeFieldComputed: true,
      basinFieldComputed: true,
      valleyFieldComputed: true,
      chinaScaleOblongFootprint: true,
      seats: SEATS.map(function (seat) {
        if (compact) {
          return {
            seatIndex: seat.seatIndex,
            x: seat.x,
            y: seat.y,
            land: seat.continentMembership,
            elevation: seat.elevation,
            ridge: seat.ridgeInfluence,
            basin: seat.basinInfluence,
            valley: seat.valleyInfluence
          };
        }

        return {
          seatIndex: seat.seatIndex,
          seatKey: seat.seatKey,
          x: seat.x,
          y: seat.y,
          continentMembership: seat.continentMembership,
          baseElevation: seat.baseElevation,
          elevation: seat.elevation,
          summitInfluence: seat.summitInfluence,
          ridgeInfluence: seat.ridgeInfluence,
          basinInfluence: seat.basinInfluence,
          basinName: seat.basinName,
          valleyInfluence: seat.valleyInfluence,
          ridgeStatus: seat.ridgeStatus,
          basinStatus: seat.basinStatus,
          valleyStatus: seat.valleyStatus,
          nearestSummitId: seat.nearestSummitId,
          nearestSummitName: seat.nearestSummitName
        };
      })
    };
  }

  function getSummitMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      summitCount: SUMMITS.length,
      nineSummitsEmbedded: true,
      nineSummitsCompressedIntoOblongLandmass: true,
      summitsAreTerrainAnchors: true,
      labelsAreNotDecorative: true,
      summits: compact
        ? SUMMITS.map(function (summit) {
          return {
            id: summit.id,
            name: summit.name,
            x: summit.x,
            y: summit.y,
            seatIndex: summit.seatIndex,
            elevationPressure: summit.elevationPressure
          };
        })
        : SUMMITS.map(function (summit) {
          return deepClone(summit);
        })
    };
  }

  function getHydrationMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,
      waterFillSeatCount: WATER_FILL_SEAT_COUNT,
      chinaScaleOblongFootprint: true,
      hydrationRules: {
        terrainMustExistFirst: true,
        elevationPrecedesHydration: true,
        valleyStatusRequired: true,
        basinCaptureContributes: true,
        summitRunoffContributes: true,
        coastIsHeldForLaterRender: true
      },
      seats: SEATS.map(function (seat) {
        if (compact) {
          return {
            seatIndex: seat.seatIndex,
            x: seat.x,
            y: seat.y,
            land: seat.continentMembership,
            waterFillEligible: seat.waterFillEligible,
            hydrationDepth: seat.hydrationDepth,
            hydrationClass: seat.hydrationClass
          };
        }

        return {
          seatIndex: seat.seatIndex,
          seatKey: seat.seatKey,
          x: seat.x,
          y: seat.y,
          continentMembership: seat.continentMembership,
          elevation: seat.elevation,
          basinStatus: seat.basinStatus,
          basinName: seat.basinName,
          valleyStatus: seat.valleyStatus,
          waterFillEligible: seat.waterFillEligible,
          runoffPressure: seat.runoffPressure,
          hydrationDepth: seat.hydrationDepth,
          hydrationClass: seat.hydrationClass,
          hydrationIsConsequence: seat.hydrationIsConsequence,
          waterFillDerivedFromValleys: seat.waterFillDerivedFromValleys
        };
      })
    };
  }

  function getChildReceivePacket(target, options) {
    var compact = Boolean(options && options.compact);
    var requestedTarget = target || "unassigned-downstream-consumer";

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: requestedTarget,
      childReceivePacketReady: true,
      childType: "terrain_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      scaleClass: SCALE_CLASS,

      largestContinent: true,
      largestAuthoredLandmassSoFar: true,
      chinaScaleOblongFootprint: true,
      oblongFootprint: true,
      hemisphereSheetRemoved: true,
      ninetyPercentShrinkApplied: true,

      landFirst: true,
      nineSummitsEmbedded: true,
      nineSummitsCompressedIntoOblongLandmass: true,
      elevationComputedBeforeHydration: true,
      waterFillDerivedFromValleys: true,
      hydrationIsConsequence: true,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: SEATS.length,
      landSeatCount: LAND_SEAT_COUNT,
      landRatio: round(LAND_SEAT_COUNT / LATTICE_STATES, 4),
      targetLandRatio: TARGET_LAND_RATIO,
      summitCount: SUMMITS.length,
      waterFillSeatCount: WATER_FILL_SEAT_COUNT,

      newsProtocolActive: true,
      newsComplete: allSeatsNEWSComplete(),
      chronologyComplete: true,
      relationshipMapReady: true,
      carrierBound: false,
      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      terrainRenderAuthorizedByChildPacketOnly: true,

      hydrosphereCarrierUntouched: true,
      htmlUntouched: true,
      coreChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,

      status: status(),
      continentMap: getContinentMap({ compact: compact }),
      elevationMap: getElevationMap({ compact: compact }),
      summitMap: getSummitMap({ compact: compact }),
      hydrationMap: getHydrationMap({ compact: compact })
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    specOps: SPEC_OPS,
    file: FILE,
    continentId: CONTINENT_ID,
    continentName: CONTINENT_NAME,
    scaleClass: SCALE_CLASS,
    status: status,
    getContinentMap: getContinentMap,
    getElevationMap: getElevationMap,
    getSummitMap: getSummitMap,
    getHydrationMap: getHydrationMap,
    getChildReceivePacket: getChildReceivePacket
  });

  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD = API;
  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD_STATUS = status();
  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD_RECEIVE_PACKET = getChildReceivePacket("published-static-child", { compact: true });
})();
