// /assets/audralia/clean/terrain/audralia.gratitude.continent.child.js
// AUDRALIA_G2_GRATITUDE_CONTINENT_LAND_FIRST_VALLEY_FILL_TERRAIN_CHILD_TNT_v1
// Full-file creation.
// Scope: downstream terrain child authority only.
// Owns: Continent of Gratitude land-first terrain data, Nine Summits embedded anchors, elevation, ridges, basins, valleys, and derived valley-fill hydration.
// Does not own: hydrosphere carrier rendering, HTML, runtime strength, final visual pass, final terrain pass, carrier consumption, or global route mutation.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_GRATITUDE_CONTINENT_LAND_FIRST_VALLEY_FILL_TERRAIN_CHILD_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_GRATITUDE_CONTINENT_LAND_FIRST_VALLEY_FILL_TERRAIN_CHILD_SPEC_OPS_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var CARRIER_FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var NEWS = Object.freeze(["north", "east", "west", "south"]);

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

  function normalizeDistance(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
  }

  function makeSeatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function makeSummit(id, name, x, y, elevationPressure, radius, ridgeBias, drainageBias) {
    return Object.freeze({
      id: id,
      name: name,
      continentId: CONTINENT_ID,
      x: x,
      y: y,
      seatIndex: y * RADIAL_NODES + x,
      seatKey: makeSeatKey(x, y),
      elevationPressure: elevationPressure,
      influenceRadius: radius,
      ridgeBias: ridgeBias,
      drainageBias: drainageBias,
      role: "embedded_terrain_anchor",
      labelIsDecorative: false,
      shapesLandmass: true,
      shapesRidges: true,
      shapesBasins: true,
      shapesValleys: true,
      shapesHydration: true
    });
  }

  var SUMMITS = Object.freeze([
    makeSummit("summit_01", "First Summit of Gratitude", 4, 4, 0.96, 5.6, "northwest_spine", "southward_runoff"),
    makeSummit("summit_02", "Second Summit of Gratitude", 8, 3, 1.00, 6.2, "north_crown", "central_runoff"),
    makeSummit("summit_03", "Third Summit of Gratitude", 12, 4, 0.94, 5.5, "northeast_spine", "southwest_runoff"),

    makeSummit("summit_04", "Fourth Summit of Gratitude", 3, 8, 0.88, 5.2, "west_shoulder", "eastward_runoff"),
    makeSummit("summit_05", "Fifth Summit of Gratitude", 8, 8, 1.08, 7.2, "central_keystone", "radial_runoff"),
    makeSummit("summit_06", "Sixth Summit of Gratitude", 13, 8, 0.86, 5.0, "east_shoulder", "westward_runoff"),

    makeSummit("summit_07", "Seventh Summit of Gratitude", 4, 12, 0.82, 4.8, "southwest_spine", "northward_runoff"),
    makeSummit("summit_08", "Eighth Summit of Gratitude", 8, 13, 0.90, 5.4, "south_crown", "central_runoff"),
    makeSummit("summit_09", "Ninth Summit of Gratitude", 12, 12, 0.84, 4.9, "southeast_spine", "northwest_runoff")
  ]);

  function continentMembershipPressure(x, y) {
    var nx = (x - 7.5) / 7.5;
    var ny = (y - 8.1) / 7.4;

    var core = 1 - Math.pow(nx * 0.88, 2) - Math.pow(ny * 0.78, 2);
    var northCrown = 0.24 * Math.exp(-normalizeDistance((x - 8) / 4.8, (y - 3.2) / 2.8));
    var westShoulder = 0.19 * Math.exp(-normalizeDistance((x - 2.6) / 2.7, (y - 8.4) / 3.9));
    var eastShoulder = 0.18 * Math.exp(-normalizeDistance((x - 13.4) / 2.9, (y - 8.2) / 3.7));
    var southernBase = 0.20 * Math.exp(-normalizeDistance((x - 8) / 5.1, (y - 13.2) / 2.8));

    var coastCuts =
      0.18 * Math.exp(-normalizeDistance((x - 1.5) / 1.8, (y - 2.0) / 2.0)) +
      0.15 * Math.exp(-normalizeDistance((x - 14.6) / 1.8, (y - 2.4) / 2.2)) +
      0.16 * Math.exp(-normalizeDistance((x - 0.8) / 1.9, (y - 14.4) / 2.0)) +
      0.14 * Math.exp(-normalizeDistance((x - 15.1) / 1.9, (y - 14.0) / 2.0));

    var roughness =
      Math.sin((x + 1) * 1.73) * 0.035 +
      Math.cos((y + 3) * 1.41) * 0.030 +
      Math.sin((x + y) * 0.83) * 0.025;

    return core + northCrown + westShoulder + eastShoulder + southernBase + roughness - coastCuts;
  }

  function summitInfluenceAt(x, y, summit) {
    var dx = x - summit.x;
    var dy = y - summit.y;
    var d = normalizeDistance(dx, dy);
    var raw = 1 - d / summit.influenceRadius;
    return clamp(raw, 0, 1);
  }

  function nearestSummit(x, y) {
    var best = null;
    var bestDistance = Infinity;

    for (var i = 0; i < SUMMITS.length; i += 1) {
      var summit = SUMMITS[i];
      var d = normalizeDistance(x - summit.x, y - summit.y);

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

  function ridgeInfluenceAt(x, y) {
    var ridge = 0;

    function lineInfluence(ax, ay, bx, by, strength, width) {
      var px = x;
      var py = y;
      var vx = bx - ax;
      var vy = by - ay;
      var wx = px - ax;
      var wy = py - ay;
      var len2 = vx * vx + vy * vy;

      if (!len2) return 0;

      var t = clamp((wx * vx + wy * vy) / len2, 0, 1);
      var cx = ax + t * vx;
      var cy = ay + t * vy;
      var d = normalizeDistance(px - cx, py - cy);

      return strength * clamp(1 - d / width, 0, 1);
    }

    ridge += lineInfluence(4, 4, 8, 3, 0.26, 2.4);
    ridge += lineInfluence(8, 3, 12, 4, 0.26, 2.4);
    ridge += lineInfluence(3, 8, 8, 8, 0.24, 2.2);
    ridge += lineInfluence(8, 8, 13, 8, 0.24, 2.2);
    ridge += lineInfluence(4, 12, 8, 13, 0.22, 2.0);
    ridge += lineInfluence(8, 13, 12, 12, 0.22, 2.0);
    ridge += lineInfluence(4, 4, 3, 8, 0.19, 2.0);
    ridge += lineInfluence(3, 8, 4, 12, 0.18, 1.9);
    ridge += lineInfluence(12, 4, 13, 8, 0.19, 2.0);
    ridge += lineInfluence(13, 8, 12, 12, 0.18, 1.9);
    ridge += lineInfluence(8, 3, 8, 8, 0.28, 2.5);
    ridge += lineInfluence(8, 8, 8, 13, 0.25, 2.3);

    return clamp(ridge, 0, 1);
  }

  function basinInfluenceAt(x, y) {
    var basins = [
      { x: 6, y: 6, radius: 3.5, depth: 0.33, name: "northwest gratitude basin" },
      { x: 10, y: 6, radius: 3.7, depth: 0.32, name: "northeast gratitude basin" },
      { x: 5, y: 10, radius: 3.4, depth: 0.30, name: "west receiving basin" },
      { x: 11, y: 10, radius: 3.5, depth: 0.30, name: "east receiving basin" },
      { x: 8, y: 11, radius: 4.1, depth: 0.34, name: "central valley basin" }
    ];

    var value = 0;
    var name = "none";

    for (var i = 0; i < basins.length; i += 1) {
      var basin = basins[i];
      var d = normalizeDistance((x - basin.x) / basin.radius, (y - basin.y) / basin.radius);
      var influence = basin.depth * clamp(1 - d, 0, 1);

      if (influence > value) {
        value = influence;
        name = basin.name;
      }
    }

    return {
      value: clamp(value, 0, 1),
      name: name
    };
  }

  function valleyInfluenceAt(x, y) {
    var valley = 0;

    function valleyLine(ax, ay, bx, by, strength, width) {
      var px = x;
      var py = y;
      var vx = bx - ax;
      var vy = by - ay;
      var wx = px - ax;
      var wy = py - ay;
      var len2 = vx * vx + vy * vy;

      if (!len2) return 0;

      var t = clamp((wx * vx + wy * vy) / len2, 0, 1);
      var cx = ax + t * vx;
      var cy = ay + t * vy;
      var d = normalizeDistance(px - cx, py - cy);

      return strength * clamp(1 - d / width, 0, 1);
    }

    valley += valleyLine(8, 3, 8, 11, 0.44, 1.45);
    valley += valleyLine(4, 4, 6, 10, 0.30, 1.35);
    valley += valleyLine(12, 4, 10, 10, 0.30, 1.35);
    valley += valleyLine(3, 8, 8, 11, 0.34, 1.45);
    valley += valleyLine(13, 8, 8, 11, 0.34, 1.45);
    valley += valleyLine(4, 12, 8, 11, 0.26, 1.30);
    valley += valleyLine(12, 12, 8, 11, 0.26, 1.30);

    return clamp(valley, 0, 1);
  }

  function coastEligibilityAt(x, y, isLand) {
    if (!isLand) return false;

    var pressure = continentMembershipPressure(x, y);
    return pressure < 0.26 || x <= 1 || x >= 14 || y <= 1 || y >= 14;
  }

  function makeTerrainSeat(x, y) {
    var seatIndex = y * RADIAL_NODES + x;
    var membershipPressure = continentMembershipPressure(x, y);
    var isLand = membershipPressure > -0.08;
    var isCore = membershipPressure > 0.34;

    var summitTotal = 0;
    var maxSummitInfluence = 0;
    var summitInfluences = [];
    var nearest = nearestSummit(x, y);

    for (var i = 0; i < SUMMITS.length; i += 1) {
      var summit = SUMMITS[i];
      var influence = summitInfluenceAt(x, y, summit);

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

    summitTotal = clamp(summitTotal / 2.4, 0, 1);

    var ridgeInfluence = ridgeInfluenceAt(x, y);
    var basin = basinInfluenceAt(x, y);
    var valleyInfluence = valleyInfluenceAt(x, y);

    var baseElevation = isLand ? 0.34 + clamp(membershipPressure, -0.08, 1) * 0.28 : 0;
    var elevation = isLand
      ? clamp(baseElevation + summitTotal * 0.34 + ridgeInfluence * 0.22 - basin.value * 0.24 - valleyInfluence * 0.18, 0.08, 1)
      : 0;

    var valleyStatus = Boolean(isLand && valleyInfluence > 0.24 && elevation < 0.66);
    var basinStatus = Boolean(isLand && basin.value > 0.10 && elevation < 0.70);
    var ridgeStatus = Boolean(isLand && ridgeInfluence > 0.22);
    var summitSeat = Boolean(nearest.distance < 0.76);
    var coastEligible = coastEligibilityAt(x, y, isLand);

    var waterFillEligible = Boolean(
      isLand &&
      (valleyStatus || basinStatus) &&
      elevation < 0.58 &&
      maxSummitInfluence < 0.80
    );

    var runoffPressure = isLand
      ? clamp((summitTotal * 0.35) + (ridgeInfluence * 0.22) + (valleyInfluence * 0.34) + (basin.value * 0.28), 0, 1)
      : 0;

    var hydrationDepth = waterFillEligible
      ? clamp((0.58 - elevation) * 1.65 + basin.value * 0.34 + valleyInfluence * 0.20, 0.05, 0.82)
      : 0;

    var hydrationClass = "dry_land";
    if (!isLand) hydrationClass = "outside_gratitude_continent";
    else if (hydrationDepth >= 0.52) hydrationClass = "deep_valley_fill";
    else if (hydrationDepth >= 0.28) hydrationClass = "basin_lake_fill";
    else if (hydrationDepth > 0) hydrationClass = "seasonal_valley_fill";
    else if (coastEligible) hydrationClass = "coast_pending";
    else if (ridgeStatus || summitSeat) hydrationClass = "highland_dry";

    return Object.freeze({
      seatIndex: seatIndex,
      seatKey: makeSeatKey(x, y),
      x: x,
      y: y,
      band: y,
      radial: x,
      fibonacci: FIBONACCI_SEQUENCE[y],
      continentId: isLand ? CONTINENT_ID : null,
      continentName: isLand ? CONTINENT_NAME : null,
      continentMembership: isLand,
      continentCore: isCore,
      gratitudeLargestContinent: true,

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
      carrierConsumptionHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,

      newsComplete: true,
      north: Object.freeze({
        defined: true,
        role: "origin_land_authority",
        continentAnchor: isLand
      }),
      east: Object.freeze({
        defined: true,
        role: "formation_elevation_and_summit_expression",
        elevation: round(elevation, 4)
      }),
      west: Object.freeze({
        defined: true,
        role: "memory_basin_valley_correction",
        basinStatus: basinStatus,
        valleyStatus: valleyStatus
      }),
      south: Object.freeze({
        defined: true,
        role: "grounded_hydration_consequence",
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

  var LAND_SEAT_COUNT = countBy(function (seat) { return seat.continentMembership; });
  var CORE_SEAT_COUNT = countBy(function (seat) { return seat.continentCore; });
  var RIDGE_SEAT_COUNT = countBy(function (seat) { return seat.ridgeStatus; });
  var BASIN_SEAT_COUNT = countBy(function (seat) { return seat.basinStatus; });
  var VALLEY_SEAT_COUNT = countBy(function (seat) { return seat.valleyStatus; });
  var WATER_FILL_SEAT_COUNT = countBy(function (seat) { return seat.waterFillEligible; });

  function seatsBy(predicate) {
    return SEATS.filter(predicate);
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

  function status() {
    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: FILE,
      protectedCarrier: CARRIER_FILE,

      childType: "terrain_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      gratitudeContinentChild: true,
      largestContinent: true,
      largestLandmassRank: 1,

      landFirst: true,
      nineSummitsEmbedded: true,
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

      summitCount: SUMMITS.length,
      summitConstruct: "nine_summits_embedded_as_terrain_anchors",
      newsProtocolActive: true,
      newsOrder: NEWS.slice(),
      allSeatsNewsComplete: allSeatsNEWSComplete(),

      carrierConsumptionHeld: true,
      carrierRenderAuthorized: false,
      terrainRenderAuthorized: false,
      hydrosphereCarrierUntouched: true,
      htmlUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      earthSubstitution: false,
      australiaNameDrift: false,

      createdAt: "static_child_runtime",
      deployMarker: "AUDRALIA_G2_GRATITUDE_CONTINENT_LAND_FIRST_VALLEY_FILL_TERRAIN_CHILD_DEPLOY_MARKER_v1"
    };
  }

  function getContinentMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      largestContinent: true,
      largestLandmassRank: 1,
      landFirst: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: SEATS.length,
      landSeatCount: LAND_SEAT_COUNT,
      continentCoreSeatCount: CORE_SEAT_COUNT,
      landRatio: round(LAND_SEAT_COUNT / LATTICE_STATES, 4),
      seats: compact
        ? seatsBy(function (seat) { return seat.continentMembership; }).map(function (seat) {
          return {
            seatIndex: seat.seatIndex,
            seatKey: seat.seatKey,
            x: seat.x,
            y: seat.y,
            elevation: seat.elevation,
            continentCore: seat.continentCore,
            nearestSummitId: seat.nearestSummitId,
            hydrationDepth: seat.hydrationDepth
          };
        })
        : SEATS.map(function (seat) {
          return {
            seatIndex: seat.seatIndex,
            seatKey: seat.seatKey,
            x: seat.x,
            y: seat.y,
            continentMembership: seat.continentMembership,
            continentCore: seat.continentCore,
            elevation: seat.elevation,
            nearestSummitId: seat.nearestSummitId,
            ridgeStatus: seat.ridgeStatus,
            basinStatus: seat.basinStatus,
            valleyStatus: seat.valleyStatus,
            waterFillEligible: seat.waterFillEligible,
            hydrationDepth: seat.hydrationDepth,
            newsComplete: seat.newsComplete
          };
        })
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
          return {
            id: summit.id,
            name: summit.name,
            continentId: summit.continentId,
            x: summit.x,
            y: summit.y,
            seatIndex: summit.seatIndex,
            seatKey: summit.seatKey,
            elevationPressure: summit.elevationPressure,
            influenceRadius: summit.influenceRadius,
            ridgeBias: summit.ridgeBias,
            drainageBias: summit.drainageBias,
            role: summit.role,
            labelIsDecorative: summit.labelIsDecorative,
            shapesLandmass: summit.shapesLandmass,
            shapesRidges: summit.shapesRidges,
            shapesBasins: summit.shapesBasins,
            shapesValleys: summit.shapesValleys,
            shapesHydration: summit.shapesHydration
          };
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
      target: requestedTarget,
      childReceivePacketReady: true,
      childType: "terrain_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      largestContinent: true,
      landFirst: true,
      nineSummitsEmbedded: true,
      elevationComputedBeforeHydration: true,
      waterFillDerivedFromValleys: true,
      hydrationIsConsequence: true,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: SEATS.length,
      landSeatCount: LAND_SEAT_COUNT,
      summitCount: SUMMITS.length,
      waterFillSeatCount: WATER_FILL_SEAT_COUNT,

      newsProtocolActive: true,
      newsComplete: allSeatsNEWSComplete(),
      chronologyComplete: true,
      relationshipMapReady: true,
      carrierBound: false,
      carrierConsumptionHeld: true,
      carrierRenderAuthorized: false,
      terrainRenderAuthorized: false,

      hydrosphereCarrierUntouched: true,
      htmlUntouched: true,
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
    specOps: SPEC_OPS,
    file: FILE,
    continentId: CONTINENT_ID,
    continentName: CONTINENT_NAME,
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
