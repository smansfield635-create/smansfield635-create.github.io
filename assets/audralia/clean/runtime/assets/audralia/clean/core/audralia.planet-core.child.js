// /assets/audralia/clean/core/audralia.planet-core.child.js
// AUDRALIA_G2_HYBRID_CORE_FUSION_SPIN_LAYER_STACK_TECTONICS_CHILD_TNT_v1
// Full-file creation.
// Scope: Audralia hybrid planetary core child authority.
// Owns: dying natural core remnant, engineered fusion-spin core, interior reconstruction stack,
// mantle, asthenosphere, lithosphere, crust, managed plate tectonics, and future urban readiness.
// Does not own: HTML, carrier rendering, terrain rendering, Gratitude terrain child, ecology,
// weather, cities, runtime strength, final terrain pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_HYBRID_CORE_FUSION_SPIN_LAYER_STACK_TECTONICS_CHILD_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_HYBRID_CORE_FUSION_SPIN_LAYER_STACK_TECTONICS_CHILD_SPEC_OPS_v1";
  var FILE = "/assets/audralia/clean/core/audralia.planet-core.child.js";

  var HYDROSPHERE_CARRIER_FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var GRATITUDE_CHILD_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var CORE_ID = "audralia_hybrid_core";
  var CORE_NAME = "Audralia Hybrid Core";
  var PLANET_STATUS = "reconstructed_dying_planet";
  var CORE_MODEL = "natural_remnant_plus_engineered_fusion_spin";

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var NEWS = Object.freeze(["north", "east", "west", "south"]);

  var LAYER_STACK = Object.freeze([
    Object.freeze({
      id: "inner_core",
      name: "Inner Core Remnant",
      order: 1,
      role: "natural_pressure_anchor",
      naturalShare: 0.50,
      engineeredShare: 0.50,
      owns: ["residual_mass", "deep_pressure", "old_heat_memory"],
      doesNotOwn: ["terrain", "water", "cities"]
    }),
    Object.freeze({
      id: "outer_core",
      name: "Outer Core Fusion-Spin Chamber",
      order: 2,
      role: "hybrid_rotational_engine",
      naturalShare: 0.42,
      engineeredShare: 0.58,
      owns: ["conductive_flow", "fusion_spin_assist", "magnetic_reinforcement"],
      doesNotOwn: ["surface_render", "weather", "ecology"]
    }),
    Object.freeze({
      id: "lower_mantle",
      name: "Lower Mantle Reconstruction Field",
      order: 3,
      role: "thermal_storage_and_pressure_transfer",
      naturalShare: 0.56,
      engineeredShare: 0.44,
      owns: ["deep_convection", "thermal_memory", "reconstruction_pressure_lanes"],
      doesNotOwn: ["plate_render", "continent_shape"]
    }),
    Object.freeze({
      id: "upper_mantle",
      name: "Upper Mantle Uplift Field",
      order: 4,
      role: "uplift_feed_and_stress_distribution",
      naturalShare: 0.62,
      engineeredShare: 0.38,
      owns: ["uplift_pressure", "mantle_plume_eligibility", "stress_transfer"],
      doesNotOwn: ["terrain_child_shape"]
    }),
    Object.freeze({
      id: "asthenosphere",
      name: "Asthenosphere Glide Layer",
      order: 5,
      role: "ductile_plate_motion_base",
      naturalShare: 0.58,
      engineeredShare: 0.42,
      owns: ["glide_field", "viscosity", "plate_motion_base"],
      doesNotOwn: ["plate_boundary_render"]
    }),
    Object.freeze({
      id: "lithosphere",
      name: "Lithosphere Stress Shell",
      order: 6,
      role: "rigid_shell_and_fracture_control",
      naturalShare: 0.66,
      engineeredShare: 0.34,
      owns: ["rigid_shell", "stress_accumulation", "fracture_eligibility"],
      doesNotOwn: ["city_placement"]
    }),
    Object.freeze({
      id: "crust",
      name: "Managed Crust",
      order: 7,
      role: "surface_support_and_exposure_potential",
      naturalShare: 0.70,
      engineeredShare: 0.30,
      owns: ["crust_thickness", "crust_class", "surface_support"],
      doesNotOwn: ["actual_terrain_drawing"]
    }),
    Object.freeze({
      id: "plate_tectonics",
      name: "Managed Plate Tectonics",
      order: 8,
      role: "part_natural_part_engineered_plate_behavior",
      naturalShare: 0.64,
      engineeredShare: 0.36,
      owns: ["plate_membership", "boundary_behavior", "drift_vector", "urban_stability_gate"],
      doesNotOwn: ["urban_layers"]
    })
  ]);

  var PLATES = Object.freeze([
    Object.freeze({
      id: "plate_north_crown",
      name: "North Crown Plate",
      centerX: 8,
      centerY: 3,
      driftX: 0.018,
      driftY: -0.010,
      stabilityBias: 0.78
    }),
    Object.freeze({
      id: "plate_west_gratitude",
      name: "West Gratitude Plate",
      centerX: 3,
      centerY: 8,
      driftX: -0.015,
      driftY: 0.006,
      stabilityBias: 0.74
    }),
    Object.freeze({
      id: "plate_central_keystone",
      name: "Central Keystone Plate",
      centerX: 8,
      centerY: 8,
      driftX: 0.002,
      driftY: 0.001,
      stabilityBias: 0.91
    }),
    Object.freeze({
      id: "plate_east_gratitude",
      name: "East Gratitude Plate",
      centerX: 13,
      centerY: 8,
      driftX: 0.014,
      driftY: 0.005,
      stabilityBias: 0.73
    }),
    Object.freeze({
      id: "plate_south_cradle",
      name: "South Cradle Plate",
      centerX: 8,
      centerY: 13,
      driftX: -0.003,
      driftY: 0.014,
      stabilityBias: 0.76
    })
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

  function seatKey(x, y) {
    return "C-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function radialFromCenter(x, y) {
    return distance((x - 7.5) / 7.5, (y - 7.5) / 7.5);
  }

  function angularPhase(x, y) {
    return Math.atan2(y - 7.5, x - 7.5);
  }

  function wave(x, y, ax, ay, scale) {
    return Math.sin((x + ax) * scale) * 0.5 + Math.cos((y + ay) * scale * 0.87) * 0.5;
  }

  function naturalCoreRemnantAt(x, y) {
    var radial = radialFromCenter(x, y);
    var oldHeatMemory = clamp(1 - radial * 0.58 + wave(x, y, 2.1, 4.8, 0.62) * 0.08, 0, 1);
    var decaySignal = clamp(radial * 0.42 + (1 - oldHeatMemory) * 0.36 + wave(x, y, 6.1, 1.4, 0.53) * 0.06, 0, 1);
    var pressureAnchor = clamp(0.72 + oldHeatMemory * 0.22 - decaySignal * 0.16, 0, 1);

    return {
      pressureAnchor: round(pressureAnchor, 4),
      oldHeatMemory: round(oldHeatMemory, 4),
      decaySignal: round(decaySignal, 4),
      dyingPlanetTrace: round(decaySignal, 4),
      naturalShare: 0.5
    };
  }

  function fusionSpinSupportAt(x, y) {
    var radial = radialFromCenter(x, y);
    var phase = angularPhase(x, y);
    var stabilizerLane =
      Math.abs(Math.sin(phase * 4)) * 0.22 +
      Math.abs(Math.cos(phase * 2)) * 0.12;

    var centralFusion = clamp(1 - radial * 0.50, 0, 1);
    var engineeredSpin = clamp(0.58 + centralFusion * 0.28 + stabilizerLane - radial * 0.08, 0, 1);
    var fusionOutput = clamp(engineeredSpin * 0.86 + centralFusion * 0.14, 0, 1);
    var rotationAssist = clamp(0.50 + engineeredSpin * 0.38 - radial * 0.06, 0, 1);

    return {
      fusionOutput: round(fusionOutput, 4),
      engineeredSpin: round(engineeredSpin, 4),
      rotationAssist: round(rotationAssist, 4),
      stabilizerLane: round(stabilizerLane, 4),
      engineeredShare: 0.5
    };
  }

  function magneticFieldAt(natural, fusion, x, y) {
    var polarityBalance = clamp(
      0.50 +
      fusion.rotationAssist * 0.22 +
      natural.pressureAnchor * 0.16 -
      natural.decaySignal * 0.13 +
      wave(x, y, 3.7, 9.2, 0.44) * 0.04,
      0,
      1
    );

    var reinforcement = clamp(fusion.fusionOutput * 0.58 + natural.oldHeatMemory * 0.24 + fusion.stabilizerLane * 0.18, 0, 1);

    return {
      magneticBaseline: round(clamp((polarityBalance + reinforcement) / 2, 0, 1), 4),
      magneticReinforcement: round(reinforcement, 4),
      polarityBalance: round(polarityBalance, 4)
    };
  }

  function thermalGradientAt(natural, fusion, x, y) {
    var radial = radialFromCenter(x, y);
    var deepHeat = clamp(natural.oldHeatMemory * 0.48 + fusion.fusionOutput * 0.42 + (1 - radial) * 0.10, 0, 1);
    var reconstructionHeat = clamp(fusion.engineeredSpin * 0.52 + natural.pressureAnchor * 0.20 + wave(x, y, 5.8, 2.2, 0.37) * 0.05, 0, 1);
    var thermalStability = clamp(0.44 + deepHeat * 0.32 + reconstructionHeat * 0.22 - natural.decaySignal * 0.14, 0, 1);

    return {
      deepHeat: round(deepHeat, 4),
      reconstructionHeat: round(reconstructionHeat, 4),
      thermalStability: round(thermalStability, 4),
      thermalGradient: round(clamp((deepHeat + reconstructionHeat) / 2, 0, 1), 4)
    };
  }

  function mantleAt(thermal, fusion, x, y) {
    var phase = angularPhase(x, y);
    var convectionLane = clamp(
      Math.abs(Math.sin(phase * 3 + x * 0.18)) * 0.42 +
      thermal.thermalGradient * 0.38 +
      fusion.stabilizerLane * 0.20,
      0,
      1
    );

    var plumeEligibility = clamp(convectionLane * 0.44 + thermal.deepHeat * 0.36 - fusion.rotationAssist * 0.08, 0, 1);
    var reconstructionPressure = clamp(thermal.reconstructionHeat * 0.48 + fusion.engineeredSpin * 0.26 + convectionLane * 0.20, 0, 1);

    return {
      lowerMantlePressure: round(clamp(thermal.deepHeat * 0.56 + reconstructionPressure * 0.28, 0, 1), 4),
      upperMantleUplift: round(clamp(plumeEligibility * 0.46 + reconstructionPressure * 0.30, 0, 1), 4),
      convectionLane: round(convectionLane, 4),
      mantlePlumeEligibility: round(plumeEligibility, 4),
      reconstructionPressure: round(reconstructionPressure, 4)
    };
  }

  function asthenosphereAt(mantle, fusion, x, y) {
    var viscosity = clamp(0.62 - mantle.upperMantleUplift * 0.20 + fusion.rotationAssist * 0.08, 0.28, 0.88);
    var glide = clamp(mantle.convectionLane * 0.46 + fusion.rotationAssist * 0.30 + (1 - viscosity) * 0.18, 0, 1);
    var motionControl = clamp(fusion.engineeredSpin * 0.50 + viscosity * 0.22 + mantle.reconstructionPressure * 0.18, 0, 1);

    return {
      viscosity: round(viscosity, 4),
      glideField: round(glide, 4),
      plateMotionBase: round(clamp((glide + motionControl) / 2, 0, 1), 4),
      engineeredMotionControl: round(motionControl, 4)
    };
  }

  function lithosphereAt(asthenosphere, mantle, natural, x, y) {
    var stress = clamp(
      asthenosphere.glideField * 0.40 +
      mantle.upperMantleUplift * 0.28 +
      natural.decaySignal * 0.18 +
      wave(x, y, 1.5, 7.4, 0.71) * 0.07,
      0,
      1
    );

    var fractureEligibility = clamp(stress * 0.68 - asthenosphere.engineeredMotionControl * 0.18, 0, 1);
    var shellIntegrity = clamp(0.78 - fractureEligibility * 0.30 + asthenosphere.engineeredMotionControl * 0.22, 0, 1);

    return {
      lithosphereStress: round(stress, 4),
      fractureEligibility: round(fractureEligibility, 4),
      shellIntegrity: round(shellIntegrity, 4),
      rigidShellDefined: true
    };
  }

  function nearestPlate(x, y) {
    var best = null;
    var bestDistance = Infinity;

    for (var i = 0; i < PLATES.length; i += 1) {
      var plate = PLATES[i];
      var d = distance(x - plate.centerX, y - plate.centerY);

      if (d < bestDistance) {
        best = plate;
        bestDistance = d;
      }
    }

    return {
      plate: best,
      distance: bestDistance
    };
  }

  function secondNearestPlate(x, y, firstId) {
    var best = null;
    var bestDistance = Infinity;

    for (var i = 0; i < PLATES.length; i += 1) {
      var plate = PLATES[i];
      if (plate.id === firstId) continue;

      var d = distance(x - plate.centerX, y - plate.centerY);

      if (d < bestDistance) {
        best = plate;
        bestDistance = d;
      }
    }

    return {
      plate: best,
      distance: bestDistance
    };
  }

  function crustAt(lithosphere, mantle, plateInfo, x, y) {
    var radial = radialFromCenter(x, y);
    var uplift = mantle.upperMantleUplift;
    var thickness = clamp(
      0.40 +
      lithosphere.shellIntegrity * 0.22 +
      uplift * 0.22 -
      radial * 0.10 +
      wave(x, y, 8.1, 2.9, 0.49) * 0.04,
      0.18,
      0.92
    );

    var crustClass = "transitional_crust";
    if (thickness >= 0.68 && uplift >= 0.34) crustClass = "continental_crust_potential";
    else if (thickness <= 0.34) crustClass = "oceanic_crust_potential";
    else if (lithosphere.fractureEligibility > 0.54) crustClass = "fracture_managed_crust";

    var exposureEligibility = clamp(thickness * 0.44 + uplift * 0.30 + plateInfo.plate.stabilityBias * 0.18, 0, 1);

    return {
      crustThickness: round(thickness, 4),
      crustClass: crustClass,
      exposureEligibility: round(exposureEligibility, 4),
      terrainSupportPotential: round(clamp(exposureEligibility * 0.78 + lithosphere.shellIntegrity * 0.18, 0, 1), 4)
    };
  }

  function tectonicsAt(plateInfo, secondPlateInfo, lithosphere, asthenosphere, fusion, x, y) {
    var plate = plateInfo.plate;
    var secondary = secondPlateInfo.plate;
    var boundaryPressure = clamp(1 - Math.abs(secondPlateInfo.distance - plateInfo.distance) / 2.2, 0, 1);

    var relativeDriftX = plate.driftX - secondary.driftX;
    var relativeDriftY = plate.driftY - secondary.driftY;
    var relativeMotion = distance(relativeDriftX, relativeDriftY);

    var boundaryType = "plate_interior";
    if (boundaryPressure > 0.70 && lithosphere.fractureEligibility > 0.46) {
      if (relativeMotion > 0.030) boundaryType = "managed_transform_boundary";
      else if (asthenosphere.glideField > 0.55) boundaryType = "managed_spreading_boundary";
      else boundaryType = "managed_collision_boundary";
    } else if (boundaryPressure > 0.50) {
      boundaryType = "soft_plate_transition";
    }

    var subductionEligibility = clamp(boundaryPressure * 0.46 + lithosphere.fractureEligibility * 0.34 - fusion.rotationAssist * 0.16, 0, 1);
    var driftManaged = true;
    var tectonicVolatility = clamp(boundaryPressure * 0.36 + relativeMotion * 6.5 + lithosphere.fractureEligibility * 0.26 - fusion.engineeredSpin * 0.18, 0, 1);
    var tectonicStability = clamp(1 - tectonicVolatility + plate.stabilityBias * 0.28, 0, 1);

    return {
      plateId: plate.id,
      plateName: plate.name,
      secondaryPlateId: secondary.id,
      secondaryPlateName: secondary.name,
      boundaryPressure: round(boundaryPressure, 4),
      boundaryType: boundaryType,
      driftVector: {
        x: round(plate.driftX, 4),
        y: round(plate.driftY, 4)
      },
      relativeMotion: round(relativeMotion, 4),
      subductionEligibility: round(subductionEligibility, 4),
      driftManaged: driftManaged,
      tectonicVolatility: round(tectonicVolatility, 4),
      tectonicStability: round(tectonicStability, 4),
      tectonicsPartNaturalPartEngineered: true
    };
  }

  function urbanReadinessAt(crust, tectonics, magnetic, thermal, lithosphere) {
    var internalSafety = clamp(
      crust.terrainSupportPotential * 0.28 +
      tectonics.tectonicStability * 0.28 +
      magnetic.magneticBaseline * 0.18 +
      thermal.thermalStability * 0.16 +
      lithosphere.shellIntegrity * 0.10,
      0,
      1
    );

    var readinessClass = "held";
    if (internalSafety >= 0.76 && tectonics.boundaryType === "plate_interior") readinessClass = "future_urban_layer_eligible";
    else if (internalSafety >= 0.66) readinessClass = "future_infrastructure_conditionally_eligible";
    else if (internalSafety >= 0.52) readinessClass = "survey_only";

    return {
      internalSafety: round(internalSafety, 4),
      urbanLayerReadinessClass: readinessClass,
      futureUrbanLayerEligible: readinessClass === "future_urban_layer_eligible",
      requiresSurfaceTerrainChild: true,
      requiresHydrationChild: true,
      requiresEcologyChild: true,
      urbanLayersFutureEnabledByInternalRebuild: true
    };
  }

  function makeColumn(x, y) {
    var seatIndex = y * RADIAL_NODES + x;
    var natural = naturalCoreRemnantAt(x, y);
    var fusion = fusionSpinSupportAt(x, y);
    var magnetic = magneticFieldAt(natural, fusion, x, y);
    var thermal = thermalGradientAt(natural, fusion, x, y);
    var mantle = mantleAt(thermal, fusion, x, y);
    var asthenosphere = asthenosphereAt(mantle, fusion, x, y);
    var lithosphere = lithosphereAt(asthenosphere, mantle, natural, x, y);
    var plateInfo = nearestPlate(x, y);
    var secondPlateInfo = secondNearestPlate(x, y, plateInfo.plate.id);
    var crust = crustAt(lithosphere, mantle, plateInfo, x, y);
    var tectonics = tectonicsAt(plateInfo, secondPlateInfo, lithosphere, asthenosphere, fusion, x, y);
    var urban = urbanReadinessAt(crust, tectonics, magnetic, thermal, lithosphere);

    var reconstructionStability = clamp(
      natural.pressureAnchor * 0.18 +
      fusion.fusionOutput * 0.22 +
      magnetic.magneticBaseline * 0.16 +
      thermal.thermalStability * 0.14 +
      lithosphere.shellIntegrity * 0.14 +
      tectonics.tectonicStability * 0.16,
      0,
      1
    );

    return Object.freeze({
      seatIndex: seatIndex,
      seatKey: seatKey(x, y),
      x: x,
      y: y,
      band: y,
      radial: x,
      fibonacci: FIBONACCI_SEQUENCE[y],
      coreId: CORE_ID,
      coreName: CORE_NAME,

      hybridCoreColumn: true,
      dyingPlanetReconstructionBackstory: true,
      naturalCoreRemnant: natural,
      engineeredFusionSpinCore: fusion,
      magneticField: magnetic,
      thermalGradient: thermal,
      mantle: mantle,
      asthenosphere: asthenosphere,
      lithosphere: lithosphere,
      crust: crust,
      tectonics: tectonics,
      urbanReadiness: urban,

      reconstructionStability: round(reconstructionStability, 4),
      fusionPowerKeepsCoreSpinning: true,
      teamReconstructedFromInterior: true,
      mantleReconstructionSupported: true,
      crustDefined: true,
      plateTectonicsDefined: true,

      renderEligible: false,
      carrierConsumptionHeld: true,
      surfaceRenderHeld: true,
      terrainRenderHeld: true,
      urbanLayerHeld: true,
      runtimeStrengthHeld: true,
      finalVisualPassClaim: false,

      newsComplete: true,
      north: Object.freeze({
        defined: true,
        role: "origin_core_pressure",
        naturalPressureAnchor: natural.pressureAnchor,
        dyingPlanetTrace: natural.dyingPlanetTrace
      }),
      east: Object.freeze({
        defined: true,
        role: "engineered_fusion_spin_expression",
        fusionOutput: fusion.fusionOutput,
        rotationAssist: fusion.rotationAssist
      }),
      west: Object.freeze({
        defined: true,
        role: "correction_stability_and_tectonic_memory",
        magneticBaseline: magnetic.magneticBaseline,
        tectonicStability: tectonics.tectonicStability
      }),
      south: Object.freeze({
        defined: true,
        role: "grounded_crust_and_future_urban_readiness",
        crustClass: crust.crustClass,
        urbanLayerReadinessClass: urban.urbanLayerReadinessClass
      })
    });
  }

  function buildColumns() {
    var columns = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        columns.push(makeColumn(x, y));
      }
    }

    return Object.freeze(columns);
  }

  var COLUMNS = buildColumns();

  function average(pathGetter) {
    var total = 0;

    for (var i = 0; i < COLUMNS.length; i += 1) {
      total += Number(pathGetter(COLUMNS[i])) || 0;
    }

    return round(total / COLUMNS.length, 4);
  }

  function countBy(predicate) {
    var count = 0;

    for (var i = 0; i < COLUMNS.length; i += 1) {
      if (predicate(COLUMNS[i])) count += 1;
    }

    return count;
  }

  function allColumnsNEWSComplete() {
    return COLUMNS.every(function (column) {
      return Boolean(
        column &&
        column.newsComplete === true &&
        column.north && column.north.defined === true &&
        column.east && column.east.defined === true &&
        column.west && column.west.defined === true &&
        column.south && column.south.defined === true
      );
    });
  }

  var SUMMARY = Object.freeze({
    averageNaturalPressure: average(function (c) { return c.naturalCoreRemnant.pressureAnchor; }),
    averageFusionOutput: average(function (c) { return c.engineeredFusionSpinCore.fusionOutput; }),
    averageRotationAssist: average(function (c) { return c.engineeredFusionSpinCore.rotationAssist; }),
    averageMagneticBaseline: average(function (c) { return c.magneticField.magneticBaseline; }),
    averageThermalStability: average(function (c) { return c.thermalGradient.thermalStability; }),
    averageReconstructionStability: average(function (c) { return c.reconstructionStability; }),
    averageTectonicStability: average(function (c) { return c.tectonics.tectonicStability; }),
    futureUrbanEligibleSeatCount: countBy(function (c) { return c.urbanReadiness.futureUrbanLayerEligible; }),
    surveyOnlySeatCount: countBy(function (c) { return c.urbanReadiness.urbanLayerReadinessClass === "survey_only"; }),
    conditionalInfrastructureSeatCount: countBy(function (c) { return c.urbanReadiness.urbanLayerReadinessClass === "future_infrastructure_conditionally_eligible"; })
  });

  function compactColumn(column) {
    return {
      seatIndex: column.seatIndex,
      seatKey: column.seatKey,
      x: column.x,
      y: column.y,
      reconstructionStability: column.reconstructionStability,
      naturalPressure: column.naturalCoreRemnant.pressureAnchor,
      fusionOutput: column.engineeredFusionSpinCore.fusionOutput,
      rotationAssist: column.engineeredFusionSpinCore.rotationAssist,
      magneticBaseline: column.magneticField.magneticBaseline,
      thermalStability: column.thermalGradient.thermalStability,
      crustClass: column.crust.crustClass,
      crustThickness: column.crust.crustThickness,
      plateId: column.tectonics.plateId,
      boundaryType: column.tectonics.boundaryType,
      urbanLayerReadinessClass: column.urbanReadiness.urbanLayerReadinessClass
    };
  }

  function status() {
    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: FILE,
      childType: "planet_core_child",
      coreId: CORE_ID,
      coreName: CORE_NAME,
      planetStatus: PLANET_STATUS,
      coreModel: CORE_MODEL,

      hybridCoreChild: true,
      singleFileInternalStack: true,
      dyingPlanetReconstructionBackstory: true,
      naturalCoreRemnant: true,
      engineeredFusionSpinCore: true,
      fusionPowerKeepsCoreSpinning: true,
      teamReconstructedFromInterior: true,

      innerCoreDefined: true,
      outerCoreDefined: true,
      mantleLayersDefined: true,
      mantleReconstructionSupported: true,
      asthenosphereDefined: true,
      lithosphereDefined: true,
      crustDefined: true,
      plateTectonicsDefined: true,
      tectonicsPartNaturalPartEngineered: true,
      urbanLayersFutureEnabledByInternalRebuild: true,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      columnCount: COLUMNS.length,
      layerCount: LAYER_STACK.length,
      plateCount: PLATES.length,
      newsProtocolActive: true,
      newsOrder: NEWS.slice(),
      allColumnsNewsComplete: allColumnsNEWSComplete(),

      summary: deepClone(SUMMARY),

      carrierConsumptionHeld: true,
      surfaceRenderHeld: true,
      terrainRenderHeld: true,
      carrierRenderAuthorized: false,
      gratitudeConsumptionHeld: true,
      terrainChildUntouched: true,
      hydrosphereCarrierUntouched: true,
      htmlUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,

      deployMarker: "AUDRALIA_G2_HYBRID_CORE_FUSION_SPIN_LAYER_STACK_TECTONICS_CHILD_DEPLOY_MARKER_v1"
    };
  }

  function getCoreMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      coreId: CORE_ID,
      coreName: CORE_NAME,
      coreModel: CORE_MODEL,
      hybridCoreChild: true,
      naturalCoreRemnant: true,
      engineeredFusionSpinCore: true,
      fusionPowerKeepsCoreSpinning: true,
      teamReconstructedFromInterior: true,
      columnCount: COLUMNS.length,
      summary: deepClone(SUMMARY),
      columns: COLUMNS.map(function (column) {
        if (compact) return compactColumn(column);

        return {
          seatIndex: column.seatIndex,
          seatKey: column.seatKey,
          x: column.x,
          y: column.y,
          naturalCoreRemnant: column.naturalCoreRemnant,
          engineeredFusionSpinCore: column.engineeredFusionSpinCore,
          magneticField: column.magneticField,
          reconstructionStability: column.reconstructionStability,
          newsComplete: column.newsComplete
        };
      })
    };
  }

  function getLayerStack(options) {
    var includeColumns = Boolean(options && options.includeColumns);
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      singleFileInternalStack: true,
      layers: deepClone(LAYER_STACK),
      columns: includeColumns
        ? COLUMNS.map(function (column) {
          return compact ? compactColumn(column) : deepClone(column);
        })
        : []
    };
  }

  function getThermalMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      thermalGradientComputed: true,
      fusionHeatIntegrated: true,
      naturalHeatMemoryIntegrated: true,
      columns: COLUMNS.map(function (column) {
        if (compact) {
          return {
            seatIndex: column.seatIndex,
            x: column.x,
            y: column.y,
            deepHeat: column.thermalGradient.deepHeat,
            thermalStability: column.thermalGradient.thermalStability
          };
        }

        return {
          seatIndex: column.seatIndex,
          seatKey: column.seatKey,
          x: column.x,
          y: column.y,
          thermalGradient: column.thermalGradient,
          fusionOutput: column.engineeredFusionSpinCore.fusionOutput,
          oldHeatMemory: column.naturalCoreRemnant.oldHeatMemory
        };
      })
    };
  }

  function getMantleMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      mantleLayersDefined: true,
      lowerMantleDefined: true,
      upperMantleDefined: true,
      asthenosphereDefined: true,
      mantleReconstructionSupported: true,
      columns: COLUMNS.map(function (column) {
        if (compact) {
          return {
            seatIndex: column.seatIndex,
            x: column.x,
            y: column.y,
            lowerMantlePressure: column.mantle.lowerMantlePressure,
            upperMantleUplift: column.mantle.upperMantleUplift,
            glideField: column.asthenosphere.glideField
          };
        }

        return {
          seatIndex: column.seatIndex,
          seatKey: column.seatKey,
          x: column.x,
          y: column.y,
          mantle: column.mantle,
          asthenosphere: column.asthenosphere
        };
      })
    };
  }

  function getCrustMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      crustDefined: true,
      lithosphereDefined: true,
      crustSupportsFutureSurfaceSystems: true,
      columns: COLUMNS.map(function (column) {
        if (compact) {
          return {
            seatIndex: column.seatIndex,
            x: column.x,
            y: column.y,
            crustClass: column.crust.crustClass,
            crustThickness: column.crust.crustThickness,
            lithosphereStress: column.lithosphere.lithosphereStress,
            shellIntegrity: column.lithosphere.shellIntegrity
          };
        }

        return {
          seatIndex: column.seatIndex,
          seatKey: column.seatKey,
          x: column.x,
          y: column.y,
          lithosphere: column.lithosphere,
          crust: column.crust
        };
      })
    };
  }

  function getPlateMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      plateTectonicsDefined: true,
      plates: deepClone(PLATES),
      columns: COLUMNS.map(function (column) {
        if (compact) {
          return {
            seatIndex: column.seatIndex,
            x: column.x,
            y: column.y,
            plateId: column.tectonics.plateId,
            boundaryType: column.tectonics.boundaryType
          };
        }

        return {
          seatIndex: column.seatIndex,
          seatKey: column.seatKey,
          x: column.x,
          y: column.y,
          plateId: column.tectonics.plateId,
          plateName: column.tectonics.plateName,
          secondaryPlateId: column.tectonics.secondaryPlateId,
          boundaryPressure: column.tectonics.boundaryPressure,
          boundaryType: column.tectonics.boundaryType,
          driftVector: column.tectonics.driftVector
        };
      })
    };
  }

  function getTectonicMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      plateTectonicsDefined: true,
      tectonicsPartNaturalPartEngineered: true,
      managedTectonicBehavior: true,
      columns: COLUMNS.map(function (column) {
        if (compact) {
          return {
            seatIndex: column.seatIndex,
            x: column.x,
            y: column.y,
            plateId: column.tectonics.plateId,
            boundaryType: column.tectonics.boundaryType,
            tectonicStability: column.tectonics.tectonicStability
          };
        }

        return {
          seatIndex: column.seatIndex,
          seatKey: column.seatKey,
          x: column.x,
          y: column.y,
          tectonics: column.tectonics,
          asthenosphere: column.asthenosphere,
          lithosphere: column.lithosphere
        };
      })
    };
  }

  function getUrbanReadinessMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      urbanLayersFutureEnabledByInternalRebuild: true,
      citiesNotCreatedYet: true,
      requiresSurfaceTerrainChild: true,
      requiresHydrationChild: true,
      requiresEcologyChild: true,
      summary: {
        futureUrbanEligibleSeatCount: SUMMARY.futureUrbanEligibleSeatCount,
        conditionalInfrastructureSeatCount: SUMMARY.conditionalInfrastructureSeatCount,
        surveyOnlySeatCount: SUMMARY.surveyOnlySeatCount
      },
      columns: COLUMNS.map(function (column) {
        if (compact) {
          return {
            seatIndex: column.seatIndex,
            x: column.x,
            y: column.y,
            readiness: column.urbanReadiness.urbanLayerReadinessClass,
            internalSafety: column.urbanReadiness.internalSafety
          };
        }

        return {
          seatIndex: column.seatIndex,
          seatKey: column.seatKey,
          x: column.x,
          y: column.y,
          urbanReadiness: column.urbanReadiness,
          tectonicStability: column.tectonics.tectonicStability,
          crust: column.crust
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
      childType: "planet_core_child",
      coreId: CORE_ID,
      coreName: CORE_NAME,
      coreModel: CORE_MODEL,

      hybridCoreChild: true,
      singleFileInternalStack: true,
      dyingPlanetReconstructionBackstory: true,
      naturalCoreRemnant: true,
      engineeredFusionSpinCore: true,
      fusionPowerKeepsCoreSpinning: true,
      teamReconstructedFromInterior: true,

      innerCoreDefined: true,
      outerCoreDefined: true,
      mantleLayersDefined: true,
      mantleReconstructionSupported: true,
      asthenosphereDefined: true,
      lithosphereDefined: true,
      crustDefined: true,
      plateTectonicsDefined: true,
      tectonicsPartNaturalPartEngineered: true,
      urbanLayersFutureEnabledByInternalRebuild: true,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      columnCount: COLUMNS.length,
      layerCount: LAYER_STACK.length,
      plateCount: PLATES.length,

      newsProtocolActive: true,
      newsComplete: allColumnsNEWSComplete(),
      chronologyComplete: true,
      relationshipMapReady: true,

      carrierConsumptionHeld: true,
      carrierRenderAuthorized: false,
      surfaceRenderHeld: true,
      terrainRenderHeld: true,
      gratitudeConsumptionHeld: true,
      terrainChildUntouched: true,
      hydrosphereCarrierUntouched: true,
      htmlUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,

      status: status(),
      coreMap: getCoreMap({ compact: compact }),
      layerStack: getLayerStack({ compact: compact, includeColumns: false }),
      thermalMap: getThermalMap({ compact: compact }),
      mantleMap: getMantleMap({ compact: compact }),
      crustMap: getCrustMap({ compact: compact }),
      plateMap: getPlateMap({ compact: compact }),
      tectonicMap: getTectonicMap({ compact: compact }),
      urbanReadinessMap: getUrbanReadinessMap({ compact: compact })
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    specOps: SPEC_OPS,
    file: FILE,
    coreId: CORE_ID,
    coreName: CORE_NAME,
    status: status,
    getCoreMap: getCoreMap,
    getLayerStack: getLayerStack,
    getThermalMap: getThermalMap,
    getMantleMap: getMantleMap,
    getCrustMap: getCrustMap,
    getPlateMap: getPlateMap,
    getTectonicMap: getTectonicMap,
    getUrbanReadinessMap: getUrbanReadinessMap,
    getChildReceivePacket: getChildReceivePacket
  });

  window.AUDRALIA_G2_HYBRID_CORE_CHILD = API;
  window.AUDRALIA_G2_HYBRID_CORE_CHILD_STATUS = status();
  window.AUDRALIA_G2_HYBRID_CORE_CHILD_RECEIVE_PACKET = getChildReceivePacket("published-static-core-child", { compact: true });
})();
