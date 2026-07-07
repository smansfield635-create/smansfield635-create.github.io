/**
 * ROOM 3 — CELL / OBJECTS / ZONES
 * File: h-earth-3d/objects/ground-cell-001.objects.js
 *
 * Status:
 * GitHub-ready raw JavaScript source body.
 * Manual installation only.
 * Object registry only.
 * Objects are not rendered assets.
 * No asset loading claim.
 * No renderer claim.
 * No runtime activation.
 * No validation claim.
 */

export const H_EARTH_PRIMARY_INSPECTION_TARGET = "OBJ_002_FOREGROUND_WET_SAND";

export const H_EARTH_SUPPORTING_INSPECTION_TARGETS = Object.freeze([
  "OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES",
  "OBJ_010_SMALL_BEACH_STONES",
  "OBJ_011_FOREGROUND_JAGGED_ROCKS",
  "OBJ_005_SHORELINE_FOAM_LINE",
]);

export const H_EARTH_CONTEXT_OBJECTS = Object.freeze([
  "OBJ_009_MANOR_EXTERIOR_CONTEXT",
  "OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS",
]);

export const H_EARTH_GROUND_CELL_001_OBJECTS = Object.freeze([
  Object.freeze({
    objectId: "OBJ_001_GROUND_SPAWN_ANCHOR",
    label: "Ground Spawn Anchor",
    layer: "H-Earth",
    role: "ground-level arrival reference",
    inspectionTarget: false,
    contextOnly: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_002_FOREGROUND_WET_SAND",
    label: "Foreground Wet Sand",
    layer: "H-Earth / Earth",
    role: "primary Inspect Ground focus target",
    inspectionTarget: true,
    primaryInspectionTarget: true,
    contextOnly: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_003_DRY_SAND_TRANSITION",
    label: "Dry Sand Transition",
    layer: "H-Earth / Earth",
    role: "local surface transition reference",
    inspectionTarget: false,
    contextOnly: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES",
    label: "Tide Pools and Reflective Puddles",
    layer: "H-Earth / Water",
    role: "supporting inspection target and moisture context",
    inspectionTarget: true,
    supportingInspectionTarget: true,
    contextOnly: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_005_SHORELINE_FOAM_LINE",
    label: "Shoreline Foam Line",
    layer: "H-Earth / Water",
    role: "supporting inspection target and shoreline contact marker",
    inspectionTarget: true,
    supportingInspectionTarget: true,
    contextOnly: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_006_NEARSHORE_WAVE_BAND",
    label: "Nearshore Wave Band",
    layer: "H-Earth / Water",
    role: "bounded water-context marker",
    inspectionTarget: false,
    contextOnly: true,
    fullFluidSimulationClaim: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_007_WATER_SURFACE_PLANE",
    label: "Water Surface Plane",
    layer: "H-Earth / Water",
    role: "water surface context only",
    inspectionTarget: false,
    contextOnly: true,
    swimmingAuthorized: false,
    waterTraversalAuthorized: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_008_AIR_HAZE_LIGHT_LAYER",
    label: "Air Haze Light Layer",
    layer: "H-Earth / Air",
    role: "air, haze, and light context",
    inspectionTarget: false,
    contextOnly: true,
    weatherEngineClaim: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_009_MANOR_EXTERIOR_CONTEXT",
    label: "Manor Exterior Context",
    layer: "Hearth Context",
    role: "visible Hearth support/control context only",
    inspectionTarget: false,
    contextOnly: true,
    hearthMergedIntoHEarth: false,
    manorInteriorAccessAuthorized: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_010_SMALL_BEACH_STONES",
    label: "Small Beach Stones",
    layer: "H-Earth / Earth",
    role: "supporting inspection target",
    inspectionTarget: true,
    supportingInspectionTarget: true,
    contextOnly: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_011_FOREGROUND_JAGGED_ROCKS",
    label: "Foreground Jagged Rocks",
    layer: "H-Earth / Earth",
    role: "supporting inspection target",
    inspectionTarget: true,
    supportingInspectionTarget: true,
    contextOnly: false,
    renderedAssetClaim: false,
  }),

  Object.freeze({
    objectId: "OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS",
    label: "Distance Rock Stacks and Islets",
    layer: "Audralia Context",
    role: "distant planetary-world context only",
    inspectionTarget: false,
    contextOnly: true,
    audraliaMergedIntoHEarth: false,
    distantTraversalAuthorized: false,
    openWorldMovementAuthorized: false,
    renderedAssetClaim: false,
  }),
]);
