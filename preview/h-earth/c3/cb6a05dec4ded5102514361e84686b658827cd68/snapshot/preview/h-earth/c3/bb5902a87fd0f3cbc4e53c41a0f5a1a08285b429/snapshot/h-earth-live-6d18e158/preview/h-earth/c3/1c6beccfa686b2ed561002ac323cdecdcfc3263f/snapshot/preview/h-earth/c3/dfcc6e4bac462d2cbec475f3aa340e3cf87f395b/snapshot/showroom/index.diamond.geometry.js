// /showroom/index.diamond.geometry.js
// SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1
// Full-file replacement / new geometry authority.
//
// Purpose:
// - Define the deterministic G3 Diamond Gate Bridge showroom object.
// - Establish 16 radial sectors, 16 structural bands, and 256 canonical seats.
// - Generate 512 exterior facet triangles with flat facet normals.
// - Generate the internal 256-seat lattice and its four edge families.
// - Publish material regions, anchors, bounds, validation, and a receipt.
//
// Owns:
// - geometry formulas
// - canonical seats
// - surface topology
// - flat facet normals
// - material-region assignments
// - internal lattice topology
// - anchors, bounds, validation, and geometry receipt
//
// Does not own:
// - DOM
// - Canvas
// - WebGL
// - shaders
// - animation
// - pointer or touch controls
// - UI state
// - Map Portal
// - product-engine execution

(function installShowroomDiamondGeometryG3(root) {
  "use strict";

  const CONTRACT =
    "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1";

  const VERSION = "G3.1.0";
  const ROUTE = "/showroom/";
  const FILE = "/showroom/index.diamond.geometry.js";

  const RADIAL_COUNT = 16;
  const BAND_COUNT = 16;
  const SEAT_COUNT = RADIAL_COUNT * BAND_COUNT;

  const EXPECTED_BODY_TRIANGLES = 15 * 16 * 2;
  const EXPECTED_TABLE_TRIANGLES = 16;
  const EXPECTED_CULET_TRIANGLES = 16;

  const EXPECTED_SURFACE_TRIANGLES =
    EXPECTED_BODY_TRIANGLES +
    EXPECTED_TABLE_TRIANGLES +
    EXPECTED_CULET_TRIANGLES;

  const TABLE_ANCHOR_ID = "DG3-TABLE-ANCHOR";
  const CULET_ANCHOR_ID = "DG3-CULET-ANCHOR";

  const TAU = Math.PI * 2;
  const EPSILON = 1e-9;

  const MATERIAL_REGION = Object.freeze({
    CHAMPAGNE_TABLE: 0,
    GOLD_CROWN_LIGHT: 1,
    GOLD_CROWN: 2,
    DEEP_GOLD_CROWN: 3,
    BRIDGE_GIRDLE: 4,
    BRIDGE_GIRDLE_EMISSIVE: 5,
    SAPPHIRE_LIGHT: 6,
    SAPPHIRE: 7,
    COBALT: 8,
    MIDNIGHT_SAPPHIRE: 9,
    CULET: 10,
    INTERNAL_LATTICE_GOLD: 11,
    INTERNAL_LATTICE_CYAN: 12,
    ACTIVE_FACET: 13
  });

  const LATTICE_EDGE_CLASS = Object.freeze({
    RING: 0,
    BAND: 1,
    DIAGONAL: 2,
    CORE_SPOKE: 3
  });

  const LATTICE_COLOR_CLASS = Object.freeze({
    GOLD: 0,
    CYAN: 1
  });

  const LATTICE_OPACITY_CLASS = Object.freeze({
    MAJOR: 0,
    SECONDARY: 1,
    MINOR: 2
  });

  const SURFACE_ROLE = Object.freeze({
    TABLE: 0,
    CROWN: 1,
    GIRDLE: 2,
    PAVILION: 3,
    CULET: 4
  });

  const BAND_DEFINITIONS = Object.freeze([
    Object.freeze({
      index: 0,
      id: "B0",
      role: "TABLE_INNER",
      family: "TABLE",
      y: 0.740,
      radius: 0.220,
      offsetDegrees: 0,
      fibonacciValue: 1,
      material: "CHAMPAGNE_TABLE"
    }),

    Object.freeze({
      index: 1,
      id: "B1",
      role: "TABLE_OUTER",
      family: "TABLE",
      y: 0.740,
      radius: 0.370,
      offsetDegrees: 0,
      fibonacciValue: 1,
      material: "CHAMPAGNE_TABLE"
    }),

    Object.freeze({
      index: 2,
      id: "B2",
      role: "STAR_CROWN",
      family: "CROWN",
      y: 0.660,
      radius: 0.520,
      offsetDegrees: 11.25,
      fibonacciValue: 2,
      material: "GOLD_CROWN_LIGHT"
    }),

    Object.freeze({
      index: 3,
      id: "B3",
      role: "UPPER_CROWN",
      family: "CROWN",
      y: 0.550,
      radius: 0.675,
      offsetDegrees: 0,
      fibonacciValue: 3,
      material: "GOLD_CROWN_LIGHT"
    }),

    Object.freeze({
      index: 4,
      id: "B4",
      role: "MID_CROWN",
      family: "CROWN",
      y: 0.405,
      radius: 0.830,
      offsetDegrees: 11.25,
      fibonacciValue: 5,
      material: "GOLD_CROWN"
    }),

    Object.freeze({
      index: 5,
      id: "B5",
      role: "CROWN_BREAK",
      family: "CROWN",
      y: 0.220,
      radius: 0.970,
      offsetDegrees: 0,
      fibonacciValue: 8,
      material: "DEEP_GOLD_CROWN"
    }),

    Object.freeze({
      index: 6,
      id: "B6",
      role: "UPPER_GIRDLE",
      family: "GIRDLE",
      y: 0.070,
      radius: 1.030,
      offsetDegrees: 0,
      fibonacciValue: 13,
      material: "BRIDGE_GIRDLE"
    }),

    Object.freeze({
      index: 7,
      id: "B7",
      role: "GIRDLE_CENTER",
      family: "GIRDLE",
      y: 0.000,
      radius: 1.055,
      offsetDegrees: 0,
      fibonacciValue: 21,
      material: "BRIDGE_GIRDLE_EMISSIVE"
    }),

    Object.freeze({
      index: 8,
      id: "B8",
      role: "LOWER_GIRDLE",
      family: "GIRDLE",
      y: -0.070,
      radius: 1.025,
      offsetDegrees: 0,
      fibonacciValue: 34,
      material: "BRIDGE_GIRDLE"
    }),

    Object.freeze({
      index: 9,
      id: "B9",
      role: "UPPER_PAVILION",
      family: "PAVILION",
      y: -0.220,
      radius: 0.930,
      offsetDegrees: 11.25,
      fibonacciValue: 55,
      material: "SAPPHIRE_LIGHT"
    }),

    Object.freeze({
      index: 10,
      id: "B10",
      role: "PAVILION_SHOULDER",
      family: "PAVILION",
      y: -0.405,
      radius: 0.790,
      offsetDegrees: 0,
      fibonacciValue: 89,
      material: "SAPPHIRE"
    }),

    Object.freeze({
      index: 11,
      id: "B11",
      role: "MID_PAVILION",
      family: "PAVILION",
      y: -0.590,
      radius: 0.640,
      offsetDegrees: 11.25,
      fibonacciValue: 144,
      material: "SAPPHIRE"
    }),

    Object.freeze({
      index: 12,
      id: "B12",
      role: "DEEP_PAVILION",
      family: "PAVILION",
      y: -0.755,
      radius: 0.490,
      offsetDegrees: 0,
      fibonacciValue: 233,
      material: "COBALT"
    }),

    Object.freeze({
      index: 13,
      id: "B13",
      role: "LOWER_PAVILION",
      family: "PAVILION",
      y: -0.900,
      radius: 0.345,
      offsetDegrees: 11.25,
      fibonacciValue: 377,
      material: "MIDNIGHT_SAPPHIRE"
    }),

    Object.freeze({
      index: 14,
      id: "B14",
      role: "POINT_COLLAR",
      family: "PAVILION",
      y: -1.025,
      radius: 0.180,
      offsetDegrees: 0,
      fibonacciValue: 610,
      material: "MIDNIGHT_SAPPHIRE"
    }),

    Object.freeze({
      index: 15,
      id: "B15",
      role: "CULET_RING",
      family: "CULET",
      y: -1.115,
      radius: 0.035,
      offsetDegrees: 0,
      fibonacciValue: 987,
      material: "CULET"
    })
  ]);

  const SECTOR_MULTIPLIERS = Object.freeze([
    1.000,
    0.972,
    0.988,
    0.972,
    1.000,
    0.972,
    0.988,
    0.972,
    1.000,
    0.972,
    0.988,
    0.972,
    1.000,
    0.972,
    0.988,
    0.972
  ]);

  const MATERIALS = Object.freeze([
    Object.freeze({
      index: MATERIAL_REGION.CHAMPAGNE_TABLE,
      id: "CHAMPAGNE_TABLE",
      family: "TABLE",
      baseColor: Object.freeze([0.94, 0.72, 0.30]),
      secondaryColor: Object.freeze([1.00, 0.91, 0.66]),
      emissiveColor: Object.freeze([0.20, 0.10, 0.02]),
      emissiveStrength: 0.06,
      metallic: 0.78,
      roughness: 0.18,
      objectOpacity: 0.98,
      latticeOpacity: 0.24
    }),

    Object.freeze({
      index: MATERIAL_REGION.GOLD_CROWN_LIGHT,
      id: "GOLD_CROWN_LIGHT",
      family: "CROWN",
      baseColor: Object.freeze([0.94, 0.60, 0.16]),
      secondaryColor: Object.freeze([1.00, 0.82, 0.42]),
      emissiveColor: Object.freeze([0.18, 0.07, 0.01]),
      emissiveStrength: 0.05,
      metallic: 0.82,
      roughness: 0.22,
      objectOpacity: 0.98,
      latticeOpacity: 0.24
    }),

    Object.freeze({
      index: MATERIAL_REGION.GOLD_CROWN,
      id: "GOLD_CROWN",
      family: "CROWN",
      baseColor: Object.freeze([0.78, 0.39, 0.07]),
      secondaryColor: Object.freeze([0.98, 0.67, 0.19]),
      emissiveColor: Object.freeze([0.14, 0.04, 0.00]),
      emissiveStrength: 0.04,
      metallic: 0.86,
      roughness: 0.25,
      objectOpacity: 0.98,
      latticeOpacity: 0.23
    }),

    Object.freeze({
      index: MATERIAL_REGION.DEEP_GOLD_CROWN,
      id: "DEEP_GOLD_CROWN",
      family: "CROWN",
      baseColor: Object.freeze([0.52, 0.23, 0.035]),
      secondaryColor: Object.freeze([0.83, 0.43, 0.10]),
      emissiveColor: Object.freeze([0.10, 0.025, 0.00]),
      emissiveStrength: 0.03,
      metallic: 0.88,
      roughness: 0.28,
      objectOpacity: 0.99,
      latticeOpacity: 0.22
    }),

    Object.freeze({
      index: MATERIAL_REGION.BRIDGE_GIRDLE,
      id: "BRIDGE_GIRDLE",
      family: "GIRDLE",
      baseColor: Object.freeze([0.45, 0.86, 1.00]),
      secondaryColor: Object.freeze([0.93, 0.98, 1.00]),
      emissiveColor: Object.freeze([0.18, 0.66, 0.95]),
      emissiveStrength: 0.34,
      metallic: 0.34,
      roughness: 0.14,
      objectOpacity: 0.90,
      latticeOpacity: 0.34
    }),

    Object.freeze({
      index: MATERIAL_REGION.BRIDGE_GIRDLE_EMISSIVE,
      id: "BRIDGE_GIRDLE_EMISSIVE",
      family: "GIRDLE",
      baseColor: Object.freeze([0.72, 0.94, 1.00]),
      secondaryColor: Object.freeze([1.00, 0.89, 0.55]),
      emissiveColor: Object.freeze([0.42, 0.88, 1.00]),
      emissiveStrength: 0.62,
      metallic: 0.26,
      roughness: 0.10,
      objectOpacity: 0.88,
      latticeOpacity: 0.42
    }),

    Object.freeze({
      index: MATERIAL_REGION.SAPPHIRE_LIGHT,
      id: "SAPPHIRE_LIGHT",
      family: "PAVILION",
      baseColor: Object.freeze([0.12, 0.43, 0.94]),
      secondaryColor: Object.freeze([0.32, 0.72, 1.00]),
      emissiveColor: Object.freeze([0.02, 0.12, 0.35]),
      emissiveStrength: 0.08,
      metallic: 0.44,
      roughness: 0.18,
      objectOpacity: 0.95,
      latticeOpacity: 0.26
    }),

    Object.freeze({
      index: MATERIAL_REGION.SAPPHIRE,
      id: "SAPPHIRE",
      family: "PAVILION",
      baseColor: Object.freeze([0.035, 0.18, 0.66]),
      secondaryColor: Object.freeze([0.10, 0.43, 0.96]),
      emissiveColor: Object.freeze([0.01, 0.06, 0.24]),
      emissiveStrength: 0.06,
      metallic: 0.48,
      roughness: 0.20,
      objectOpacity: 0.96,
      latticeOpacity: 0.24
    }),

    Object.freeze({
      index: MATERIAL_REGION.COBALT,
      id: "COBALT",
      family: "PAVILION",
      baseColor: Object.freeze([0.02, 0.075, 0.36]),
      secondaryColor: Object.freeze([0.06, 0.22, 0.70]),
      emissiveColor: Object.freeze([0.005, 0.025, 0.14]),
      emissiveStrength: 0.05,
      metallic: 0.52,
      roughness: 0.23,
      objectOpacity: 0.97,
      latticeOpacity: 0.22
    }),

    Object.freeze({
      index: MATERIAL_REGION.MIDNIGHT_SAPPHIRE,
      id: "MIDNIGHT_SAPPHIRE",
      family: "PAVILION",
      baseColor: Object.freeze([0.008, 0.025, 0.16]),
      secondaryColor: Object.freeze([0.035, 0.10, 0.43]),
      emissiveColor: Object.freeze([0.002, 0.01, 0.07]),
      emissiveStrength: 0.04,
      metallic: 0.56,
      roughness: 0.26,
      objectOpacity: 0.98,
      latticeOpacity: 0.20
    }),

    Object.freeze({
      index: MATERIAL_REGION.CULET,
      id: "CULET",
      family: "CULET",
      baseColor: Object.freeze([0.015, 0.03, 0.12]),
      secondaryColor: Object.freeze([0.08, 0.16, 0.44]),
      emissiveColor: Object.freeze([0.01, 0.025, 0.10]),
      emissiveStrength: 0.05,
      metallic: 0.58,
      roughness: 0.24,
      objectOpacity: 0.99,
      latticeOpacity: 0.18
    }),

    Object.freeze({
      index: MATERIAL_REGION.INTERNAL_LATTICE_GOLD,
      id: "INTERNAL_LATTICE_GOLD",
      family: "LATTICE",
      baseColor: Object.freeze([1.00, 0.70, 0.22]),
      secondaryColor: Object.freeze([1.00, 0.91, 0.58]),
      emissiveColor: Object.freeze([1.00, 0.55, 0.10]),
      emissiveStrength: 0.72,
      metallic: 0.20,
      roughness: 0.12,
      objectOpacity: 0.00,
      latticeOpacity: 0.88
    }),

    Object.freeze({
      index: MATERIAL_REGION.INTERNAL_LATTICE_CYAN,
      id: "INTERNAL_LATTICE_CYAN",
      family: "LATTICE",
      baseColor: Object.freeze([0.35, 0.86, 1.00]),
      secondaryColor: Object.freeze([0.82, 0.98, 1.00]),
      emissiveColor: Object.freeze([0.18, 0.78, 1.00]),
      emissiveStrength: 0.82,
      metallic: 0.12,
      roughness: 0.10,
      objectOpacity: 0.00,
      latticeOpacity: 0.92
    }),

    Object.freeze({
      index: MATERIAL_REGION.ACTIVE_FACET,
      id: "ACTIVE_FACET",
      family: "SELECTION",
      baseColor: Object.freeze([1.00, 0.94, 0.70]),
      secondaryColor: Object.freeze([0.48, 0.90, 1.00]),
      emissiveColor: Object.freeze([0.65, 0.88, 1.00]),
      emissiveStrength: 0.70,
      metallic: 0.22,
      roughness: 0.08,
      objectOpacity: 1.00,
      latticeOpacity: 1.00
    })
  ]);

  const PROFILE = Object.freeze({
    contract: CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    generation: "G3",
    objectId: "diamond-gate-bridge-g3-diamond-lattice",
    objectClass: "computational-gem",

    coordinateSystem: Object.freeze({
      x: "left-right",
      y: "vertical",
      z: "depth",
      origin: Object.freeze([0, 0, 0]),
      automaticRotationAxis: "local-y",
      groundPlaneY: -1.31
    }),

    counts: Object.freeze({
      radial: RADIAL_COUNT,
      bands: BAND_COUNT,
      seats: SEAT_COUNT,
      bodyTriangles: EXPECTED_BODY_TRIANGLES,
      tableTriangles: EXPECTED_TABLE_TRIANGLES,
      culetTriangles: EXPECTED_CULET_TRIANGLES,
      surfaceTriangles: EXPECTED_SURFACE_TRIANGLES,
      expectedFlatSurfaceVertices: EXPECTED_SURFACE_TRIANGLES * 3,
      latticeRingEdges: 256,
      latticeBandEdges: 240,
      latticeDiagonalEdges: 240,
      latticeCoreSpokeEdges: 64,
      latticeEdges: 800
    }),

    cameraPreparation: Object.freeze({
      initialTarget: Object.freeze([0, -0.12, 0]),
      initialPosition: Object.freeze([0.30, 0.18, 3.85]),
      fieldOfViewDegrees: 32,
      initialYawRadians: -0.58,
      initialPitchRadians: -0.18,
      pitchMinimumRadians: -0.78,
      pitchMaximumRadians: 0.52,
      distanceInitial: 3.85,
      distanceMinimum: 2.75,
      distanceMaximum: 5.40
    }),

    interactionPreparation: Object.freeze({
      drag: "yaw-and-pitch",
      oneFingerTouch: "yaw-and-pitch",
      twoFingerTouch: "pinch-zoom",
      mouseWheel: "zoom",
      doubleTap: "reset",
      idleRotationRadiansPerSecond: 0.075,
      idleDelayMilliseconds: 2500,
      reducedMotionIdleRotation: false
    }),

    lightingPreparation: Object.freeze({
      warmKey: Object.freeze({
        position: Object.freeze([-2.8, 3.6, 4.2]),
        color: Object.freeze([1.00, 0.78, 0.44])
      }),

      coolFill: Object.freeze({
        position: Object.freeze([3.0, 1.8, 2.6]),
        color: Object.freeze([0.33, 0.76, 1.00])
      }),

      rearRim: Object.freeze({
        position: Object.freeze([0, 2.2, -4.0]),
        color: Object.freeze([0.35, 0.30, 0.92])
      }),

      cameraFill: true,
      girdleEmission: true,
      blackoutForbidden: true
    }),

    modePreparation: Object.freeze({
      object: Object.freeze({
        lens: "crystal",
        dimension: "object",
        surfaceOpacityRange: Object.freeze([0.94, 1.00]),
        latticeVisible: false
      }),

      lattice: Object.freeze({
        lens: "lattice",
        dimension: "through",
        surfaceOpacityRange: Object.freeze([0.18, 0.30]),
        latticeVisible: true
      })
    })
  });

  const ANCHORS = Object.freeze({
    table: Object.freeze({
      id: TABLE_ANCHOR_ID,
      role: "TABLE_ANCHOR",
      position: Object.freeze([0, 0.740, 0])
    }),

    culet: Object.freeze({
      id: CULET_ANCHOR_ID,
      role: "CULET_ANCHOR",
      position: Object.freeze([0, -1.145, 0])
    }),

    origin: Object.freeze({
      id: "DG3-ORIGIN",
      role: "GIRDLE_ORIGIN",
      position: Object.freeze([0, 0, 0])
    }),

    ground: Object.freeze({
      id: "DG3-GROUND",
      role: "GROUND_PLANE",
      y: -1.31
    })
  });

  function degreesToRadians(value) {
    return value * Math.PI / 180;
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function isFiniteVector3(vector) {
    return (
      Array.isArray(vector) &&
      vector.length === 3 &&
      vector.every(isFiniteNumber)
    );
  }

  function subtract(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function magnitude(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalize(vector) {
    const length = magnitude(vector);

    if (length <= EPSILON) {
      return [0, 1, 0];
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function triangleNormal(a, b, c) {
    return normalize(
      cross(
        subtract(b, a),
        subtract(c, a)
      )
    );
  }

  function triangleArea2(a, b, c) {
    return magnitude(
      cross(
        subtract(b, a),
        subtract(c, a)
      )
    );
  }

  function average3(a, b, c) {
    return [
      (a[0] + b[0] + c[0]) / 3,
      (a[1] + b[1] + c[1]) / 3,
      (a[2] + b[2] + c[2]) / 3
    ];
  }

  function seatId(bandIndex, radialIndex) {
    return `DG3-B${bandIndex}-R${radialIndex}`;
  }

  function coreNodeId(bandIndex) {
    return `DG3-CORE-B${bandIndex}`;
  }

  function materialIndexById(materialId) {
    const index = MATERIAL_REGION[materialId];

    if (!Number.isInteger(index)) {
      throw new Error(
        `Unknown material region: ${materialId}`
      );
    }

    return index;
  }

  function familyToSurfaceRole(family) {
    switch (family) {
      case "TABLE":
        return SURFACE_ROLE.TABLE;

      case "CROWN":
        return SURFACE_ROLE.CROWN;

      case "GIRDLE":
        return SURFACE_ROLE.GIRDLE;

      case "PAVILION":
        return SURFACE_ROLE.PAVILION;

      case "CULET":
        return SURFACE_ROLE.CULET;

      default:
        throw new Error(
          `Unknown band family: ${family}`
        );
    }
  }

  function latticeScaleForFamily(family) {
    switch (family) {
      case "TABLE":
        return 0.58;

      case "CROWN":
        return 0.64;

      case "GIRDLE":
        return 0.72;

      case "PAVILION":
        return 0.60;

      case "CULET":
        return 0.52;

      default:
        throw new Error(
          `Unknown lattice family: ${family}`
        );
    }
  }

  function intervalMaterialId(upperBandIndex) {
    const intervalMaterials = [
      "CHAMPAGNE_TABLE",
      "GOLD_CROWN_LIGHT",
      "GOLD_CROWN_LIGHT",
      "GOLD_CROWN",
      "GOLD_CROWN",
      "DEEP_GOLD_CROWN",
      "BRIDGE_GIRDLE",
      "BRIDGE_GIRDLE_EMISSIVE",
      "BRIDGE_GIRDLE",
      "SAPPHIRE_LIGHT",
      "SAPPHIRE",
      "SAPPHIRE",
      "COBALT",
      "MIDNIGHT_SAPPHIRE",
      "MIDNIGHT_SAPPHIRE"
    ];

    return intervalMaterials[upperBandIndex];
  }

  function intervalSurfaceRole(upperBandIndex) {
    if (upperBandIndex <= 0) {
      return SURFACE_ROLE.TABLE;
    }

    if (upperBandIndex <= 5) {
      return SURFACE_ROLE.CROWN;
    }

    if (upperBandIndex <= 8) {
      return SURFACE_ROLE.GIRDLE;
    }

    if (upperBandIndex <= 14) {
      return SURFACE_ROLE.PAVILION;
    }

    return SURFACE_ROLE.CULET;
  }

  function buildSeats() {
    const seats = [];

    for (const band of BAND_DEFINITIONS) {
      const offsetRadians =
        degreesToRadians(
          band.offsetDegrees
        );

      for (
        let radial = 0;
        radial < RADIAL_COUNT;
        radial += 1
      ) {
        const theta =
          TAU *
          radial /
          RADIAL_COUNT +
          offsetRadians;

        const radius =
          band.radius *
          SECTOR_MULTIPLIERS[radial];

        const x =
          Math.cos(theta) *
          radius;

        const z =
          Math.sin(theta) *
          radius;

        const index =
          band.index *
          RADIAL_COUNT +
          radial;

        const family =
          band.family;

        const scale =
          latticeScaleForFamily(
            family
          );

        const surfacePosition =
          Object.freeze([
            x,
            band.y,
            z
          ]);

        const latticePosition =
          Object.freeze([
            x * scale,
            band.y * 0.92,
            z * scale
          ]);

        seats.push(
          Object.freeze({
            id:
              seatId(
                band.index,
                radial
              ),

            seatIndex:
              index,

            band:
              band.index,

            bandId:
              band.id,

            radial,

            role:
              band.role,

            family,

            surfaceRole:
              familyToSurfaceRole(
                family
              ),

            materialRegion:
              band.material,

            materialRegionIndex:
              materialIndexById(
                band.material
              ),

            theta,

            thetaDegrees:
              theta *
              180 /
              Math.PI,

            radius,

            baseRadius:
              band.radius,

            sectorMultiplier:
              SECTOR_MULTIPLIERS[
                radial
              ],

            position:
              surfacePosition,

            surfacePosition,

            latticePosition,

            cardinal:
              radial %
              4 ===
              0,

            intercardinal:
              radial %
              4 ===
              2,

            major:
              radial %
              2 ===
              0,

            fibonacciValue:
              band.fibonacciValue,

            addressable:
              true
          })
        );
      }
    }

    return Object.freeze(
      seats
    );
  }

  function buildCoreNodes() {
    return Object.freeze(
      BAND_DEFINITIONS.map(
        band =>
          Object.freeze({
            id:
              coreNodeId(
                band.index
              ),

            nodeIndex:
              SEAT_COUNT +
              band.index,

            band:
              band.index,

            role:
              "LATTICE_CORE",

            family:
              band.family,

            position:
              Object.freeze([
                0,
                band.y *
                0.92,
                0
              ]),

            addressable:
              false
          })
      )
    );
  }

  const SEATS =
    buildSeats();

  const CORE_NODES =
    buildCoreNodes();

  const SEAT_BY_ID =
    new Map(
      SEATS.map(
        seat => [
          seat.id,
          seat
        ]
      )
    );

  const CORE_BY_ID =
    new Map(
      CORE_NODES.map(
        node => [
          node.id,
          node
        ]
      )
    );

  function nodePositionById(nodeId) {
    const seat =
      SEAT_BY_ID.get(
        nodeId
      );

    if (seat) {
      return seat.latticePosition;
    }

    const core =
      CORE_BY_ID.get(
        nodeId
      );

    if (core) {
      return core.position;
    }

    throw new Error(
      `Unknown lattice node: ${nodeId}`
    );
  }

  function sourcePositionById(sourceId) {
    if (
      sourceId ===
      TABLE_ANCHOR_ID
    ) {
      return ANCHORS.table.position;
    }

    if (
      sourceId ===
      CULET_ANCHOR_ID
    ) {
      return ANCHORS.culet.position;
    }

    const seat =
      SEAT_BY_ID.get(
        sourceId
      );

    if (!seat) {
      throw new Error(
        `Unknown surface source: ${sourceId}`
      );
    }

    return seat.surfacePosition;
  }

  function sourceIndexById(sourceId) {
    if (
      sourceId ===
      TABLE_ANCHOR_ID
    ) {
      return -1;
    }

    if (
      sourceId ===
      CULET_ANCHOR_ID
    ) {
      return -2;
    }

    const seat =
      SEAT_BY_ID.get(
        sourceId
      );

    if (!seat) {
      throw new Error(
        `Unknown source index: ${sourceId}`
      );
    }

    return seat.seatIndex;
  }

  function buildFacetRecords() {
    const facets = [];

    function addFacet(
      sourceIds,
      materialId,
      surfaceRole,
      zone,
      metadata
    ) {
      const positions =
        sourceIds.map(
          sourcePositionById
        );

      const normal =
        triangleNormal(
          positions[0],
          positions[1],
          positions[2]
        );

      const center =
        average3(
          positions[0],
          positions[1],
          positions[2]
        );

      const facetIndex =
        facets.length;

      facets.push(
        Object.freeze({
          id:
            `DG3-F${
              String(
                facetIndex
              ).padStart(
                3,
                "0"
              )
            }`,

          facetIndex,

          sourceIds:
            Object.freeze(
              sourceIds.slice()
            ),

          sourceIndices:
            Object.freeze(
              sourceIds.map(
                sourceIndexById
              )
            ),

          materialRegion:
            materialId,

          materialRegionIndex:
            materialIndexById(
              materialId
            ),

          surfaceRole,

          zone,

          normal:
            Object.freeze(
              normal
            ),

          center:
            Object.freeze(
              center
            ),

          area2:
            triangleArea2(
              positions[0],
              positions[1],
              positions[2]
            ),

          bandUpper:
            metadata.bandUpper,

          bandLower:
            metadata.bandLower,

          radialStart:
            metadata.radialStart,

          radialEnd:
            metadata.radialEnd,

          diagonal:
            metadata.diagonal,

          cap:
            metadata.cap
        })
      );
    }

    for (
      let band = 0;
      band <
      BAND_COUNT - 1;
      band += 1
    ) {
      const materialId =
        intervalMaterialId(
          band
        );

      const role =
        intervalSurfaceRole(
          band
        );

      for (
        let radial = 0;
        radial <
        RADIAL_COUNT;
        radial += 1
      ) {
        const next =
          (
            radial +
            1
          ) %
          RADIAL_COUNT;

        const a =
          seatId(
            band,
            radial
          );

        const b =
          seatId(
            band,
            next
          );

        const c =
          seatId(
            band + 1,
            radial
          );

        const d =
          seatId(
            band + 1,
            next
          );

        const even =
          (
            band +
            radial
          ) %
          2 ===
          0;

        if (even) {
          addFacet(
            [
              a,
              b,
              d
            ],
            materialId,
            role,
            "BODY",
            {
              bandUpper:
                band,

              bandLower:
                band + 1,

              radialStart:
                radial,

              radialEnd:
                next,

              diagonal:
                "A-D",

              cap:
                false
            }
          );

          addFacet(
            [
              a,
              d,
              c
            ],
            materialId,
            role,
            "BODY",
            {
              bandUpper:
                band,

              bandLower:
                band + 1,

              radialStart:
                radial,

              radialEnd:
                next,

              diagonal:
                "A-D",

              cap:
                false
            }
          );
        } else {
          addFacet(
            [
              a,
              b,
              c
            ],
            materialId,
            role,
            "BODY",
            {
              bandUpper:
                band,

              bandLower:
                band + 1,

              radialStart:
                radial,

              radialEnd:
                next,

              diagonal:
                "B-C",

              cap:
                false
            }
          );

          addFacet(
            [
              b,
              d,
              c
            ],
            materialId,
            role,
            "BODY",
            {
              bandUpper:
                band,

              bandLower:
                band + 1,

              radialStart:
                radial,

              radialEnd:
                next,

              diagonal:
                "B-C",

              cap:
                false
            }
          );
        }
      }
    }

    for (
      let radial = 0;
      radial <
      RADIAL_COUNT;
      radial += 1
    ) {
      const next =
        (
          radial +
          1
        ) %
        RADIAL_COUNT;

      addFacet(
        [
          TABLE_ANCHOR_ID,
          seatId(
            0,
            next
          ),
          seatId(
            0,
            radial
          )
        ],
        "CHAMPAGNE_TABLE",
        SURFACE_ROLE.TABLE,
        "TABLE_CAP",
        {
          bandUpper:
            0,

          bandLower:
            0,

          radialStart:
            radial,

          radialEnd:
            next,

          diagonal:
            "CAP",

          cap:
            true
        }
      );
    }

    for (
      let radial = 0;
      radial <
      RADIAL_COUNT;
      radial += 1
    ) {
      const next =
        (
          radial +
          1
        ) %
        RADIAL_COUNT;

      addFacet(
        [
          seatId(
            15,
            radial
          ),
          seatId(
            15,
            next
          ),
          CULET_ANCHOR_ID
        ],
        "CULET",
        SURFACE_ROLE.CULET,
        "CULET_CAP",
        {
          bandUpper:
            15,

          bandLower:
            15,

          radialStart:
            radial,

          radialEnd:
            next,

          diagonal:
            "CAP",

          cap:
            true
        }
      );
    }

    return Object.freeze(
      facets
    );
  }

  const FACETS =
    buildFacetRecords();

  function buildSurfaceMesh() {
    const vertexCount =
      FACETS.length *
      3;

    const positions =
      new Float32Array(
        vertexCount *
        3
      );

    const normals =
      new Float32Array(
        vertexCount *
        3
      );

    const materialRegionIndices =
      new Uint8Array(
        vertexCount
      );

    const surfaceRoleIndices =
      new Uint8Array(
        vertexCount
      );

    const facetIndices =
      new Uint16Array(
        vertexCount
      );

    const sourceSeatIndices =
      new Int16Array(
        vertexCount
      );

    const triangleCenters =
      new Float32Array(
        FACETS.length *
        3
      );

    const triangleNormals =
      new Float32Array(
        FACETS.length *
        3
      );

    const triangleMaterialRegionIndices =
      new Uint8Array(
        FACETS.length
      );

    const triangleSurfaceRoleIndices =
      new Uint8Array(
        FACETS.length
      );

    let vertexCursor = 0;

    for (const facet of FACETS) {
      triangleCenters.set(
        facet.center,
        facet.facetIndex *
        3
      );

      triangleNormals.set(
        facet.normal,
        facet.facetIndex *
        3
      );

      triangleMaterialRegionIndices[
        facet.facetIndex
      ] =
        facet.materialRegionIndex;

      triangleSurfaceRoleIndices[
        facet.facetIndex
      ] =
        facet.surfaceRole;

      for (
        let corner = 0;
        corner < 3;
        corner += 1
      ) {
        const position =
          sourcePositionById(
            facet.sourceIds[
              corner
            ]
          );

        const offset =
          vertexCursor *
          3;

        positions[offset] =
          position[0];

        positions[
          offset +
          1
        ] =
          position[1];

        positions[
          offset +
          2
        ] =
          position[2];

        normals[offset] =
          facet.normal[0];

        normals[
          offset +
          1
        ] =
          facet.normal[1];

        normals[
          offset +
          2
        ] =
          facet.normal[2];

        materialRegionIndices[
          vertexCursor
        ] =
          facet.materialRegionIndex;

        surfaceRoleIndices[
          vertexCursor
        ] =
          facet.surfaceRole;

        facetIndices[
          vertexCursor
        ] =
          facet.facetIndex;

        sourceSeatIndices[
          vertexCursor
        ] =
          facet.sourceIndices[
            corner
          ];

        vertexCursor += 1;
      }
    }

    return Object.freeze({
      drawMode:
        "TRIANGLES",

      indexed:
        false,

      triangleCount:
        FACETS.length,

      vertexCount,

      positions,

      normals,

      materialRegionIndices,

      surfaceRoleIndices,

      facetIndices,

      sourceSeatIndices,

      triangleCenters,

      triangleNormals,

      triangleMaterialRegionIndices,

      triangleSurfaceRoleIndices,

      facets:
        FACETS
    });
  }

  const SURFACE_MESH =
    buildSurfaceMesh();

  function ringOpacityClass(
    bandIndex
  ) {
    if (
      [
        0,
        1,
        6,
        7,
        8,
        15
      ].includes(
        bandIndex
      )
    ) {
      return LATTICE_OPACITY_CLASS.MAJOR;
    }

    if (
      bandIndex %
      2 ===
      0
    ) {
      return LATTICE_OPACITY_CLASS.SECONDARY;
    }

    return LATTICE_OPACITY_CLASS.MINOR;
  }

  function radialOpacityClass(
    radialIndex
  ) {
    if (
      radialIndex %
      4 ===
      0
    ) {
      return LATTICE_OPACITY_CLASS.MAJOR;
    }

    if (
      radialIndex %
      2 ===
      0
    ) {
      return LATTICE_OPACITY_CLASS.SECONDARY;
    }

    return LATTICE_OPACITY_CLASS.MINOR;
  }

  function buildLattice() {
    const edges = [];

    function addEdge(
      fromId,
      toId,
      edgeClass,
      colorClass,
      opacityClass
    ) {
      const edgeIndex =
        edges.length;

      edges.push(
        Object.freeze({
          id:
            `DG3-L${
              String(
                edgeIndex
              ).padStart(
                3,
                "0"
              )
            }`,

          edgeIndex,

          fromId,

          toId,

          edgeClass,

          colorClass,

          opacityClass
        })
      );
    }

    for (
      let band = 0;
      band <
      BAND_COUNT;
      band += 1
    ) {
      for (
        let radial = 0;
        radial <
        RADIAL_COUNT;
        radial += 1
      ) {
        const next =
          (
            radial +
            1
          ) %
          RADIAL_COUNT;

        addEdge(
          seatId(
            band,
            radial
          ),

          seatId(
            band,
            next
          ),

          LATTICE_EDGE_CLASS.RING,

          band >= 6 &&
          band <= 8
            ? LATTICE_COLOR_CLASS.CYAN
            : LATTICE_COLOR_CLASS.GOLD,

          ringOpacityClass(
            band
          )
        );
      }
    }

    for (
      let band = 0;
      band <
      BAND_COUNT - 1;
      band += 1
    ) {
      for (
        let radial = 0;
        radial <
        RADIAL_COUNT;
        radial += 1
      ) {
        addEdge(
          seatId(
            band,
            radial
          ),

          seatId(
            band + 1,
            radial
          ),

          LATTICE_EDGE_CLASS.BAND,

          radial %
          4 ===
          0
            ? LATTICE_COLOR_CLASS.CYAN
            : LATTICE_COLOR_CLASS.GOLD,

          radialOpacityClass(
            radial
          )
        );
      }
    }

    for (
      let band = 0;
      band <
      BAND_COUNT - 1;
      band += 1
    ) {
      for (
        let radial = 0;
        radial <
        RADIAL_COUNT;
        radial += 1
      ) {
        const next =
          (
            radial +
            1
          ) %
          RADIAL_COUNT;

        const targetRadial =
          (
            band +
            radial
          ) %
          2 ===
          0
            ? next
            : radial;

        const sourceRadial =
          (
            band +
            radial
          ) %
          2 ===
          0
            ? radial
            : next;

        addEdge(
          seatId(
            band,
            sourceRadial
          ),

          seatId(
            band + 1,
            targetRadial
          ),

          LATTICE_EDGE_CLASS.DIAGONAL,

          band >= 5 &&
          band <= 9
            ? LATTICE_COLOR_CLASS.CYAN
            : LATTICE_COLOR_CLASS.GOLD,

          LATTICE_OPACITY_CLASS.MINOR
        );
      }
    }

    const cardinalRadials = [
      0,
      4,
      8,
      12
    ];

    for (
      let band = 0;
      band <
      BAND_COUNT;
      band += 1
    ) {
      for (
        const radial of
        cardinalRadials
      ) {
        addEdge(
          seatId(
            band,
            radial
          ),

          coreNodeId(
            band
          ),

          LATTICE_EDGE_CLASS.CORE_SPOKE,

          band >= 6 &&
          band <= 8
            ? LATTICE_COLOR_CLASS.CYAN
            : LATTICE_COLOR_CLASS.GOLD,

          LATTICE_OPACITY_CLASS.MAJOR
        );
      }
    }

    const lineVertexCount =
      edges.length *
      2;

    const linePositions =
      new Float32Array(
        lineVertexCount *
        3
      );

    const lineEdgeClasses =
      new Uint8Array(
        lineVertexCount
      );

    const lineColorClasses =
      new Uint8Array(
        lineVertexCount
      );

    const lineOpacityClasses =
      new Uint8Array(
        lineVertexCount
      );

    const lineEdgeIndices =
      new Uint16Array(
        lineVertexCount
      );

    let cursor = 0;

    for (const edge of edges) {
      const from =
        nodePositionById(
          edge.fromId
        );

      const to =
        nodePositionById(
          edge.toId
        );

      for (
        const position of
        [
          from,
          to
        ]
      ) {
        const offset =
          cursor *
          3;

        linePositions[
          offset
        ] =
          position[0];

        linePositions[
          offset +
          1
        ] =
          position[1];

        linePositions[
          offset +
          2
        ] =
          position[2];

        lineEdgeClasses[
          cursor
        ] =
          edge.edgeClass;

        lineColorClasses[
          cursor
        ] =
          edge.colorClass;

        lineOpacityClasses[
          cursor
        ] =
          edge.opacityClass;

        lineEdgeIndices[
          cursor
        ] =
          edge.edgeIndex;

        cursor += 1;
      }
    }

    const nodePositions =
      new Float32Array(
        SEAT_COUNT *
        3
      );

    const nodeSeatIndices =
      new Uint16Array(
        SEAT_COUNT
      );

    const nodeMajorFlags =
      new Uint8Array(
        SEAT_COUNT
      );

    const nodeMaterialRegionIndices =
      new Uint8Array(
        SEAT_COUNT
      );

    for (
      const seat of
      SEATS
    ) {
      nodePositions.set(
        seat.latticePosition,
        seat.seatIndex *
        3
      );

      nodeSeatIndices[
        seat.seatIndex
      ] =
        seat.seatIndex;

      nodeMajorFlags[
        seat.seatIndex
      ] =
        seat.major
          ? 1
          : 0;

      nodeMaterialRegionIndices[
        seat.seatIndex
      ] =
        seat.family ===
        "GIRDLE"
          ? MATERIAL_REGION.INTERNAL_LATTICE_CYAN
          : MATERIAL_REGION.INTERNAL_LATTICE_GOLD;
    }

    const corePositions =
      new Float32Array(
        CORE_NODES.length *
        3
      );

    for (
      const coreNode of
      CORE_NODES
    ) {
      corePositions.set(
        coreNode.position,
        coreNode.band *
        3
      );
    }

    const familyCounts =
      Object.freeze({
        ring:
          edges.filter(
            edge =>
              edge.edgeClass ===
              LATTICE_EDGE_CLASS.RING
          ).length,

        band:
          edges.filter(
            edge =>
              edge.edgeClass ===
              LATTICE_EDGE_CLASS.BAND
          ).length,

        diagonal:
          edges.filter(
            edge =>
              edge.edgeClass ===
              LATTICE_EDGE_CLASS.DIAGONAL
          ).length,

        coreSpoke:
          edges.filter(
            edge =>
              edge.edgeClass ===
              LATTICE_EDGE_CLASS.CORE_SPOKE
          ).length
      });

    return Object.freeze({
      nodeCount:
        SEATS.length,

      coreNodeCount:
        CORE_NODES.length,

      edgeCount:
        edges.length,

      lineVertexCount,

      nodes:
        SEATS,

      coreNodes:
        CORE_NODES,

      edges:
        Object.freeze(
          edges
        ),

      familyCounts,

      nodePositions,

      nodeSeatIndices,

      nodeMajorFlags,

      nodeMaterialRegionIndices,

      corePositions,

      linePositions,

      lineEdgeClasses,

      lineColorClasses,

      lineOpacityClasses,

      lineEdgeIndices,

      edgeClass:
        LATTICE_EDGE_CLASS,

      colorClass:
        LATTICE_COLOR_CLASS,

      opacityClass:
        LATTICE_OPACITY_CLASS
    });
  }

  const LATTICE =
    buildLattice();

  function buildBounds() {
    const points = [
      ...SEATS.map(
        seat =>
          seat.surfacePosition
      ),

      ANCHORS.table.position,

      ANCHORS.culet.position
    ];

    const minimum = [
      Infinity,
      Infinity,
      Infinity
    ];

    const maximum = [
      -Infinity,
      -Infinity,
      -Infinity
    ];

    for (
      const point of
      points
    ) {
      for (
        let axis = 0;
        axis < 3;
        axis += 1
      ) {
        minimum[axis] =
          Math.min(
            minimum[axis],
            point[axis]
          );

        maximum[axis] =
          Math.max(
            maximum[axis],
            point[axis]
          );
      }
    }

    const center = [
      (
        minimum[0] +
        maximum[0]
      ) /
      2,

      (
        minimum[1] +
        maximum[1]
      ) /
      2,

      (
        minimum[2] +
        maximum[2]
      ) /
      2
    ];

    const size = [
      maximum[0] -
      minimum[0],

      maximum[1] -
      minimum[1],

      maximum[2] -
      minimum[2]
    ];

    let radius = 0;

    for (
      const point of
      points
    ) {
      radius =
        Math.max(
          radius,
          magnitude(
            subtract(
              point,
              center
            )
          )
        );
    }

    return Object.freeze({
      minimum:
        Object.freeze(
          minimum
        ),

      maximum:
        Object.freeze(
          maximum
        ),

      center:
        Object.freeze(
          center
        ),

      size:
        Object.freeze(
          size
        ),

      radius,

      groundPlaneY:
        ANCHORS.ground.y,

      declaredWorldBounds:
        Object.freeze({
          x:
            Object.freeze([
              -1.06,
              1.06
            ]),

          y:
            Object.freeze([
              -1.18,
              0.76
            ]),

          z:
            Object.freeze([
              -1.06,
              1.06
            ])
        })
    });
  }

  const BOUNDS =
    buildBounds();

  function fnv1aUpdate(
    hash,
    text
  ) {
    let value =
      hash >>>
      0;

    for (
      let index = 0;
      index <
      text.length;
      index += 1
    ) {
      value ^=
        text.charCodeAt(
          index
        );

      value =
        Math.imul(
          value,
          0x01000193
        ) >>>
        0;
    }

    return value >>>
      0;
  }

  function createGeometryHash() {
    let hash =
      0x811c9dc5;

    hash =
      fnv1aUpdate(
        hash,
        CONTRACT
      );

    hash =
      fnv1aUpdate(
        hash,
        VERSION
      );

    for (
      const seat of
      SEATS
    ) {
      hash =
        fnv1aUpdate(
          hash,

          `${seat.id}|` +
          `${seat.position[0].toFixed(8)}|` +
          `${seat.position[1].toFixed(8)}|` +
          `${seat.position[2].toFixed(8)}|` +
          `${seat.latticePosition[0].toFixed(8)}|` +
          `${seat.latticePosition[1].toFixed(8)}|` +
          `${seat.latticePosition[2].toFixed(8)}|` +
          `${seat.materialRegion}`
        );
    }

    for (
      const facet of
      FACETS
    ) {
      hash =
        fnv1aUpdate(
          hash,

          `${facet.id}|` +
          `${facet.sourceIds.join(",")}|` +
          `${facet.materialRegion}|` +
          `${facet.normal[0].toFixed(8)}|` +
          `${facet.normal[1].toFixed(8)}|` +
          `${facet.normal[2].toFixed(8)}`
        );
    }

    for (
      const edge of
      LATTICE.edges
    ) {
      hash =
        fnv1aUpdate(
          hash,

          `${edge.id}|` +
          `${edge.fromId}|` +
          `${edge.toId}|` +
          `${edge.edgeClass}|` +
          `${edge.colorClass}|` +
          `${edge.opacityClass}`
        );
    }

    return (
      `fnv1a32-${
        hash
          .toString(16)
          .padStart(
            8,
            "0"
          )
      }`
    );
  }

  function createCheck(
    id,
    pass,
    expected,
    actual,
    detail
  ) {
    return Object.freeze({
      id,
      pass:
        Boolean(
          pass
        ),
      expected,
      actual,
      detail
    });
  }

  function runValidation() {
    const checks = [];

    checks.push(
      createCheck(
        "radial-count",
        RADIAL_COUNT === 16,
        16,
        RADIAL_COUNT,
        "Sixteen radial sectors are required."
      )
    );

    checks.push(
      createCheck(
        "band-count",
        BAND_COUNT === 16,
        16,
        BAND_COUNT,
        "Sixteen structural bands are required."
      )
    );

    checks.push(
      createCheck(
        "seat-count",
        SEATS.length === 256,
        256,
        SEATS.length,
        "The lattice must expose exactly 256 canonical seats."
      )
    );

    const uniqueSeatIds =
      new Set(
        SEATS.map(
          seat =>
            seat.id
        )
      );

    checks.push(
      createCheck(
        "unique-seat-ids",
        uniqueSeatIds.size ===
        SEATS.length,
        SEATS.length,
        uniqueSeatIds.size,
        "Every canonical seat ID must be unique."
      )
    );

    const seatIndexesValid =
      SEATS.every(
        seat =>
          seat.seatIndex ===
          seat.band *
          RADIAL_COUNT +
          seat.radial &&
          seat.seatIndex >=
          0 &&
          seat.seatIndex <
          SEAT_COUNT
      );

    checks.push(
      createCheck(
        "seat-index-formula",
        seatIndexesValid,
        "band*16+radial",
        seatIndexesValid
          ? "valid"
          : "invalid",
        "Seat indexes must follow the canonical address formula."
      )
    );

    const seatPositionsFinite =
      SEATS.every(
        seat =>
          isFiniteVector3(
            seat.surfacePosition
          ) &&
          isFiniteVector3(
            seat.latticePosition
          )
      );

    checks.push(
      createCheck(
        "finite-seat-positions",
        seatPositionsFinite,
        true,
        seatPositionsFinite,
        "Surface and lattice positions must contain finite coordinates."
      )
    );

    checks.push(
      createCheck(
        "surface-triangle-count",
        FACETS.length ===
        EXPECTED_SURFACE_TRIANGLES,
        EXPECTED_SURFACE_TRIANGLES,
        FACETS.length,
        "The exterior must contain exactly 512 triangles."
      )
    );

    checks.push(
      createCheck(
        "surface-vertex-count",
        SURFACE_MESH.vertexCount ===
        EXPECTED_SURFACE_TRIANGLES *
        3,
        EXPECTED_SURFACE_TRIANGLES *
        3,
        SURFACE_MESH.vertexCount,
        "Flat-facet rendering requires three duplicated vertices per triangle."
      )
    );

    const uniqueFacetIds =
      new Set(
        FACETS.map(
          facet =>
            facet.id
        )
      );

    checks.push(
      createCheck(
        "unique-facet-ids",
        uniqueFacetIds.size ===
        FACETS.length,
        FACETS.length,
        uniqueFacetIds.size,
        "Every exterior facet must have a unique stable ID."
      )
    );

    const facetSourcesValid =
      FACETS.every(
        facet =>
          facet.sourceIds.length ===
          3 &&
          facet.sourceIds.every(
            sourceId =>
              sourceId ===
              TABLE_ANCHOR_ID ||
              sourceId ===
              CULET_ANCHOR_ID ||
              SEAT_BY_ID.has(
                sourceId
              )
          )
      );

    checks.push(
      createCheck(
        "facet-source-validity",
        facetSourcesValid,
        true,
        facetSourcesValid,
        "Every triangle source must resolve to a seat or cap anchor."
      )
    );

    const nonDegenerateFacets =
      FACETS.every(
        facet =>
          isFiniteNumber(
            facet.area2
          ) &&
          facet.area2 >
          EPSILON
      );

    checks.push(
      createCheck(
        "non-degenerate-facets",
        nonDegenerateFacets,
        true,
        nonDegenerateFacets,
        "No exterior facet may collapse to zero area."
      )
    );

    const normalsFiniteAndUnit =
      FACETS.every(
        facet => {
          if (
            !isFiniteVector3(
              facet.normal
            )
          ) {
            return false;
          }

          const length =
            magnitude(
              facet.normal
            );

          return (
            Math.abs(
              length -
              1
            ) <=
            1e-6
          );
        }
      );

    checks.push(
      createCheck(
        "flat-normals-valid",
        normalsFiniteAndUnit,
        true,
        normalsFiniteAndUnit,
        "Every facet normal must be finite and unit length."
      )
    );

    const materialAssignmentsValid =
      FACETS.every(
        facet =>
          Number.isInteger(
            facet.materialRegionIndex
          ) &&
          facet.materialRegionIndex >=
          0 &&
          facet.materialRegionIndex <
          MATERIALS.length
      );

    checks.push(
      createCheck(
        "material-assignments-valid",
        materialAssignmentsValid,
        true,
        materialAssignmentsValid,
        "Every facet must reference a published material region."
      )
    );

    checks.push(
      createCheck(
        "lattice-node-count",
        LATTICE.nodeCount ===
        256,
        256,
        LATTICE.nodeCount,
        "The internal lattice must preserve all 256 canonical seats."
      )
    );

    checks.push(
      createCheck(
        "lattice-core-node-count",
        LATTICE.coreNodeCount ===
        16,
        16,
        LATTICE.coreNodeCount,
        "One non-seat core node is required for each structural band."
      )
    );

    checks.push(
      createCheck(
        "lattice-ring-edge-count",
        LATTICE.familyCounts.ring ===
        256,
        256,
        LATTICE.familyCounts.ring,
        "Ring edges must close every band."
      )
    );

    checks.push(
      createCheck(
        "lattice-band-edge-count",
        LATTICE.familyCounts.band ===
        240,
        240,
        LATTICE.familyCounts.band,
        "Band edges must connect adjacent structural rings."
      )
    );

    checks.push(
      createCheck(
        "lattice-diagonal-edge-count",
        LATTICE.familyCounts.diagonal ===
        240,
        240,
        LATTICE.familyCounts.diagonal,
        "Alternating diagonals must mirror the exterior facet law."
      )
    );

    checks.push(
      createCheck(
        "lattice-core-spoke-edge-count",
        LATTICE.familyCounts.coreSpoke ===
        64,
        64,
        LATTICE.familyCounts.coreSpoke,
        "Four cardinal spokes are required in each band."
      )
    );

    checks.push(
      createCheck(
        "lattice-edge-count",
        LATTICE.edgeCount ===
        800,
        800,
        LATTICE.edgeCount,
        "The complete internal lattice must contain 800 available edges."
      )
    );

    const latticeEndpointsValid =
      LATTICE.edges.every(
        edge =>
          (
            SEAT_BY_ID.has(
              edge.fromId
            ) ||
            CORE_BY_ID.has(
              edge.fromId
            )
          ) &&
          (
            SEAT_BY_ID.has(
              edge.toId
            ) ||
            CORE_BY_ID.has(
              edge.toId
            )
          )
      );

    checks.push(
      createCheck(
        "lattice-endpoints-valid",
        latticeEndpointsValid,
        true,
        latticeEndpointsValid,
        "Every lattice edge must resolve to valid node endpoints."
      )
    );

    const boundsFinite =
      isFiniteVector3(
        BOUNDS.minimum
      ) &&
      isFiniteVector3(
        BOUNDS.maximum
      ) &&
      isFiniteVector3(
        BOUNDS.center
      ) &&
      isFiniteVector3(
        BOUNDS.size
      ) &&
      isFiniteNumber(
        BOUNDS.radius
      );

    checks.push(
      createCheck(
        "bounds-finite",
        boundsFinite,
        true,
        boundsFinite,
        "Computed object bounds must remain finite."
      )
    );

    const anchorsValid =
      isFiniteVector3(
        ANCHORS.table.position
      ) &&
      isFiniteVector3(
        ANCHORS.culet.position
      ) &&
      ANCHORS.table.position[1] >
      ANCHORS.culet.position[1];

    checks.push(
      createCheck(
        "anchors-valid",
        anchorsValid,
        true,
        anchorsValid,
        "Table and culet anchors must exist in the correct vertical order."
      )
    );

    const failed =
      checks.filter(
        check =>
          !check.pass
      );

    return Object.freeze({
      contract:
        CONTRACT,

      passed:
        failed.length ===
        0,

      checkCount:
        checks.length,

      passCount:
        checks.length -
        failed.length,

      failCount:
        failed.length,

      checks:
        Object.freeze(
          checks
        ),

      failed:
        Object.freeze(
          failed
        )
    });
  }

  const VALIDATION =
    runValidation();

  const GEOMETRY_HASH =
    createGeometryHash();

  const RECEIPT =
    Object.freeze({
      contract:
        CONTRACT,

      version:
        VERSION,

      route:
        ROUTE,

      file:
        FILE,

      objectId:
        PROFILE.objectId,

      generation:
        PROFILE.generation,

      status:
        VALIDATION.passed
          ? "READY"
          : "INVALID",

      geometryHash:
        GEOMETRY_HASH,

      radialCount:
        RADIAL_COUNT,

      bandCount:
        BAND_COUNT,

      seatCount:
        SEATS.length,

      surfaceTriangleCount:
        FACETS.length,

      surfaceVertexCount:
        SURFACE_MESH.vertexCount,

      latticeNodeCount:
        LATTICE.nodeCount,

      latticeCoreNodeCount:
        LATTICE.coreNodeCount,

      latticeEdgeCount:
        LATTICE.edgeCount,

      materialCount:
        MATERIALS.length,

      validationPassCount:
        VALIDATION.passCount,

      validationFailCount:
        VALIDATION.failCount,

      ownsDOM:
        false,

      ownsCanvas:
        false,

      ownsWebGL:
        false,

      ownsShaders:
        false,

      ownsAnimation:
        false,

      ownsControls:
        false,

      ownsUI:
        false,

      ownsMapPortal:
        false,

      geometryAuthority:
        true,

      deterministic:
        true,

      old2DGeometryAuthority:
        false
    });

  function cloneValidation() {
    return {
      contract:
        VALIDATION.contract,

      passed:
        VALIDATION.passed,

      checkCount:
        VALIDATION.checkCount,

      passCount:
        VALIDATION.passCount,

      failCount:
        VALIDATION.failCount,

      checks:
        VALIDATION.checks.map(
          check => ({
            ...check
          })
        ),

      failed:
        VALIDATION.failed.map(
          check => ({
            ...check
          })
        )
    };
  }

  function cloneReceipt() {
    return {
      ...RECEIPT
    };
  }

  function getSeat(reference) {
    if (
      typeof reference ===
      "number" &&
      Number.isInteger(
        reference
      )
    ) {
      return (
        SEATS[
          reference
        ] ||
        null
      );
    }

    if (
      typeof reference ===
      "string"
    ) {
      return (
        SEAT_BY_ID.get(
          reference
        ) ||
        null
      );
    }

    return null;
  }

  function getFacet(reference) {
    if (
      typeof reference ===
      "number" &&
      Number.isInteger(
        reference
      )
    ) {
      return (
        FACETS[
          reference
        ] ||
        null
      );
    }

    if (
      typeof reference ===
      "string"
    ) {
      return (
        FACETS.find(
          facet =>
            facet.id ===
            reference
        ) ||
        null
      );
    }

    return null;
  }

  const API =
    Object.freeze({
      contract:
        CONTRACT,

      version:
        VERSION,

      route:
        ROUTE,

      file:
        FILE,

      receipt:
        RECEIPT,

      radialCount:
        RADIAL_COUNT,

      bandCount:
        BAND_COUNT,

      seatCount:
        SEAT_COUNT,

      triangleCount:
        EXPECTED_SURFACE_TRIANGLES,

      profile:
        PROFILE,

      materials:
        MATERIALS,

      materialRegion:
        MATERIAL_REGION,

      surfaceRole:
        SURFACE_ROLE,

      bands:
        BAND_DEFINITIONS,

      sectorMultipliers:
        SECTOR_MULTIPLIERS,

      seats:
        SEATS,

      surfaceMesh:
        SURFACE_MESH,

      lattice:
        LATTICE,

      anchors:
        ANCHORS,

      bounds:
        BOUNDS,

      validate:
        cloneValidation,

      getReceipt:
        cloneReceipt,

      getSeat,

      getFacet
    });

  if (
    !VALIDATION.passed
  ) {
    root
      .DGBShowroomDiamondGeometryG3 =
        API;

    throw new Error(
      `[${CONTRACT}] Geometry validation failed: ` +
      VALIDATION.failed
        .map(
          check =>
            check.id
        )
        .join(", ")
    );
  }

  root
    .DGBShowroomDiamondGeometryG3 =
      API;
})(
  typeof window !==
  "undefined"
    ? window
    : globalThis
);
