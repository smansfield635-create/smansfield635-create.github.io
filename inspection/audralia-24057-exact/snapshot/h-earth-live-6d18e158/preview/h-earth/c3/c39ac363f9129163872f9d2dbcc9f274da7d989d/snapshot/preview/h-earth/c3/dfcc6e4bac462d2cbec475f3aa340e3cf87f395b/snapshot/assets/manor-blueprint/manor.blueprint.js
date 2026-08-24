// /assets/manor-blueprint/manor.blueprint.js
// MANOR_BLUEPRINT_DIAMOND_ESTATE_NATIVE_WEBGL_RUNTIME_TNT_v1
// Full-file replacement.
//
// Purpose:
// - Replace the prior flat Manor Blueprint with one redesigned Map / Portal.
// - Present Mirrorland Doors as a deterministic native-WebGL 3D estate.
// - Preserve Main Menu and Instructions as separate non-WebGL modes.
// - Generate the complete runtime DOM from JavaScript.
// - Consume the Manor Blueprint registry for room identity and navigation.
// - Build the estate geometry, renderer, controls, labels, picking, fallback,
//   adapter manifest, audits, and public API inside one full runtime.
//
// Owns:
// - Map / Portal bubble
// - Map / Portal overlay
// - Mirrorland Doors, Main Menu, and Instructions modes
// - deterministic estate geometry
// - native WebGL renderer
// - orbit camera and focus transitions
// - room-volume picking
// - progressive room disclosure
// - projected HTML labels
// - selected-room interface
// - accessible HTML fallback
// - registry binding
// - geometry and route audit
// - optional 3D adapter registration
// - lifecycle, context loss, and disposal
//
// Does not own:
// - registry route truth
// - host-page navigation architecture
// - Showroom Diamond geometry
// - Showroom Diamond renderer
// - planet renderers
// - external 3D libraries
//
// Runtime law:
// - First tap selects.
// - Focus Room moves the camera.
// - Enter Room performs navigation.
// - Main Menu routes never enter the 3D estate.
// - Mirrorland routes never enter the Main Menu.
// - No generated image.
// - No GraphicBox.
// - No external 3D library.

(function installManorBlueprintDiamondEstate(root, doc) {
  "use strict";

  const CONTRACT =
    "MANOR_BLUEPRINT_DIAMOND_ESTATE_NATIVE_WEBGL_RUNTIME_TNT_v1";

  const GEOMETRY_CONTRACT =
    "MANOR_BLUEPRINT_3D_ESTATE_GEOMETRY_AUTHORITY_TNT_v1";

  const RENDERER_CONTRACT =
    "MANOR_BLUEPRINT_3D_ESTATE_NATIVE_WEBGL_RENDERER_TNT_v1";

  const UI_CONTRACT =
    "MANOR_BLUEPRINT_3D_ESTATE_UI_CONTROLLER_TNT_v1";

  const DOM_CONTRACT =
    "MANOR_BLUEPRINT_3D_ESTATE_GENERATED_DOM_CONTRACT_TNT_v1";

  const AUDIT_CONTRACT =
    "MANOR_BLUEPRINT_3D_ESTATE_GEOMETRY_REACHABILITY_AUDIT_CONTRACT_TNT_v1";

  const ADAPTER_CONTRACT =
    "LAB_PRODUCT_ENGINE_GENERIC_3D_MODEL_ADAPTER_F34_F55_F89_F144_TNT_v1";

  const FILE =
    "/assets/manor-blueprint/manor.blueprint.js";

  const CANONICAL_ROUTE =
    "/showroom/";

  const STORAGE_KEY =
    "DGB_MANOR_BLUEPRINT_BUBBLE_POSITION_v1";

  const MODEL_ID =
    "mirrorland-diamond-estate";

  const EVENT_READY =
    "manor-blueprint-estate-ready";

  const EVENT_STATE =
    "manor-blueprint-estate-state";

  const EVENT_SELECTION =
    "manor-blueprint-estate-selection";

  const EVENT_FOCUS =
    "manor-blueprint-estate-focus";

  const EVENT_CONTEXT_LOST =
    "manor-blueprint-estate-context-lost";

  const EVENT_FALLBACK =
    "manor-blueprint-estate-fallback";

  const EVENT_AUDIT =
    "manor-blueprint-estate-audit";

  const EXPECTED = Object.freeze({
    platformCount: 23,
    corridorCount: 23,
    surfaceTriangleCount: 680,
    surfaceVertexCount: 2040,
    structuralLineSegmentCount: 271,
    materialRegionCount: 12,
    revealGroupCount: 7,
    sceneNodeCount: 22,
    fixedNodeCount: 14,
    frontierSlotCount: 8
  });

  const INITIAL_CAMERA = Object.freeze({
    target: Object.freeze([0.0, 0.72, -0.10]),
    yaw: 0.0,
    pitch: 0.50,
    distance: 12.50,
    pitchMinimum: 0.22,
    pitchMaximum: 1.15,
    distanceMinimum: 3.20,
    distanceMaximum: 15.50,
    fieldOfViewDegrees: 34,
    near: 0.10,
    far: 60.0,
    dragYawScale: 0.0082,
    dragPitchScale: 0.0060,
    wheelScale: 0.0024,
    inertiaDamping: 0.90,
    clickMovementThreshold: 7,
    clickDurationThreshold: 460,
    doubleTapThreshold: 320,
    focusDurationMilliseconds: 450
  });

  const CAMERA_PRESETS = Object.freeze({
    overview: Object.freeze({
      target: Object.freeze([0.0, 0.72, -0.10]),
      yaw: 0.0,
      pitch: 0.50,
      distance: 12.50
    }),

    ENTRY_THRESHOLD: Object.freeze({
      target: Object.freeze([0.0, 0.28, 5.10]),
      yaw: 0.0,
      pitch: 0.42,
      distance: 4.80
    }),

    ATRIUM: Object.freeze({
      target: Object.freeze([0.0, 0.56, 3.65]),
      yaw: 0.0,
      pitch: 0.46,
      distance: 4.80
    }),

    ATLAS_CORE: Object.freeze({
      target: Object.freeze([0.0, 0.92, 0.85]),
      yaw: 0.0,
      pitch: 0.52,
      distance: 5.20
    }),

    WORLD_TERRACE: Object.freeze({
      target: Object.freeze([0.0, 1.40, -2.85]),
      yaw: 0.0,
      pitch: 0.58,
      distance: 6.20
    }),

    FRONTIER_WING: Object.freeze({
      target: Object.freeze([-3.25, 1.10, 0.20]),
      yaw: -0.48,
      pitch: 0.52,
      distance: 5.40
    }),

    STORY_WING: Object.freeze({
      target: Object.freeze([3.25, 1.10, 0.20]),
      yaw: 0.48,
      pitch: 0.52,
      distance: 5.40
    }),

    WORLD_AUDRALIA: Object.freeze({
      target: Object.freeze([-0.85, 1.68, -3.70]),
      yaw: -0.12,
      pitch: 0.58,
      distance: 4.40
    })
  });

  const MATERIALS = Object.freeze([
    Object.freeze({
      id: "FOUNDATION_GRAPHITE",
      color: Object.freeze([0.055, 0.075, 0.12])
    }),

    Object.freeze({
      id: "THRESHOLD_GOLD",
      color: Object.freeze([0.94, 0.62, 0.17])
    }),

    Object.freeze({
      id: "ATRIUM_AMBER",
      color: Object.freeze([0.94, 0.42, 0.11])
    }),

    Object.freeze({
      id: "ATLAS_WHITE_GOLD",
      color: Object.freeze([0.93, 0.86, 0.61])
    }),

    Object.freeze({
      id: "WORLD_SAPPHIRE",
      color: Object.freeze([0.05, 0.26, 0.74])
    }),

    Object.freeze({
      id: "WORLD_DEEP_BLUE",
      color: Object.freeze([0.025, 0.13, 0.46])
    }),

    Object.freeze({
      id: "STORY_VIOLET",
      color: Object.freeze([0.34, 0.13, 0.66])
    }),

    Object.freeze({
      id: "FRONTIER_STEEL_AMBER",
      color: Object.freeze([0.42, 0.35, 0.24])
    }),

    Object.freeze({
      id: "PRIMARY_CORRIDOR_GOLD",
      color: Object.freeze([0.74, 0.49, 0.13])
    }),

    Object.freeze({
      id: "SECONDARY_CORRIDOR_CYAN",
      color: Object.freeze([0.13, 0.62, 0.84])
    }),

    Object.freeze({
      id: "STRUCTURE_CYAN",
      color: Object.freeze([0.25, 0.82, 1.00])
    }),

    Object.freeze({
      id: "ACTIVE_WHITE_CYAN",
      color: Object.freeze([0.82, 0.96, 1.00])
    })
  ]);

  const MATERIAL_INDEX = Object.freeze(
    MATERIALS.reduce(
      (output, material, index) => {
        output[material.id] = index;
        return output;
      },
      Object.create(null)
    )
  );

  const PLATFORM_SPECS = Object.freeze([
    Object.freeze({
      id: "ESTATE_FOUNDATION",
      role: "foundation",
      shape: "diamond",
      center: Object.freeze([0.0, -0.42, 0.0]),
      topY: -0.42,
      bottomY: -0.72,
      halfWidth: 6.80,
      halfDepth: 6.80,
      rotation: 0,
      material: "FOUNDATION_GRAPHITE",
      revealGroup: 0,
      selectable: false,
      labelOffset: 0
    }),

    Object.freeze({
      id: "ENTRY_THRESHOLD",
      role: "entry",
      shape: "triangle",
      center: Object.freeze([0.0, 0.0, 5.55]),
      topY: 0.0,
      bottomY: -0.40,
      radius: 0.95,
      rotation: 0,
      material: "THRESHOLD_GOLD",
      revealGroup: 1,
      selectable: true,
      labelOffset: 0.48,
      pickPriority: 30
    }),

    Object.freeze({
      id: "ATRIUM",
      role: "arrival",
      shape: "hexagon",
      center: Object.freeze([0.0, 0.34, 3.65]),
      topY: 0.34,
      bottomY: -0.40,
      radius: 1.15,
      rotation: 0,
      material: "ATRIUM_AMBER",
      revealGroup: 1,
      selectable: true,
      labelOffset: 0.76,
      pickPriority: 40
    }),

    Object.freeze({
      id: "ATLAS_CORE",
      role: "core",
      shape: "hexagon",
      center: Object.freeze([0.0, 0.70, 0.85]),
      topY: 0.70,
      bottomY: -0.40,
      radius: 1.38,
      rotation: 0,
      material: "ATLAS_WHITE_GOLD",
      revealGroup: 1,
      selectable: true,
      labelOffset: 0.82,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_WING",
      role: "zone",
      zoneId: "frontier",
      shape: "hexagon",
      center: Object.freeze([-3.25, 0.90, 0.20]),
      topY: 0.90,
      bottomY: -0.40,
      radius: 1.25,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 1,
      revealOnSelect: 4,
      selectable: true,
      labelOffset: 0.82,
      pickPriority: 20
    }),

    Object.freeze({
      id: "STORY_WING",
      role: "zone",
      zoneId: "story",
      shape: "hexagon",
      center: Object.freeze([3.25, 0.90, 0.20]),
      topY: 0.90,
      bottomY: -0.40,
      radius: 1.25,
      rotation: 0,
      material: "STORY_VIOLET",
      revealGroup: 1,
      revealOnSelect: 3,
      selectable: true,
      labelOffset: 0.82,
      pickPriority: 20
    }),

    Object.freeze({
      id: "WORLD_TERRACE",
      role: "zone",
      zoneId: "worlds",
      shape: "diamond",
      center: Object.freeze([0.0, 1.20, -2.65]),
      topY: 1.20,
      bottomY: -0.40,
      halfWidth: 3.70,
      halfDepth: 1.75,
      rotation: 0,
      material: "WORLD_SAPPHIRE",
      revealGroup: 1,
      revealOnSelect: 2,
      selectable: true,
      labelOffset: 0.82,
      pickPriority: 20
    }),

    Object.freeze({
      id: "WORLD_ZIONTS",
      role: "room",
      zoneId: "worlds",
      shape: "diamond",
      center: Object.freeze([-2.55, 1.48, -3.05]),
      topY: 1.48,
      bottomY: -0.40,
      halfWidth: 0.72,
      halfDepth: 0.58,
      rotation: 0,
      material: "WORLD_DEEP_BLUE",
      revealGroup: 2,
      selectable: true,
      labelOffset: 0.58,
      pickPriority: 40
    }),

    Object.freeze({
      id: "WORLD_AUDRALIA",
      role: "zone",
      zoneId: "audralia",
      shape: "hexagon",
      center: Object.freeze([-0.85, 1.48, -3.35]),
      topY: 1.48,
      bottomY: -0.40,
      radius: 0.86,
      rotation: 0,
      material: "WORLD_DEEP_BLUE",
      revealGroup: 2,
      revealOnSelect: 5,
      selectable: true,
      labelOffset: 0.58,
      pickPriority: 20
    }),

    Object.freeze({
      id: "WORLD_HEARTH",
      role: "room",
      zoneId: "worlds",
      shape: "diamond",
      center: Object.freeze([0.95, 1.48, -3.20]),
      topY: 1.48,
      bottomY: -0.40,
      halfWidth: 0.72,
      halfDepth: 0.58,
      rotation: 0,
      material: "WORLD_DEEP_BLUE",
      revealGroup: 2,
      selectable: true,
      labelOffset: 0.58,
      pickPriority: 40
    }),

    Object.freeze({
      id: "WORLD_H_EARTH",
      role: "room",
      zoneId: "worlds",
      shape: "diamond",
      center: Object.freeze([2.55, 1.48, -2.95]),
      topY: 1.48,
      bottomY: -0.40,
      halfWidth: 0.72,
      halfDepth: 0.58,
      rotation: 0,
      material: "WORLD_DEEP_BLUE",
      revealGroup: 2,
      selectable: true,
      labelOffset: 0.58,
      pickPriority: 40
    }),

    Object.freeze({
      id: "AUDRALIA_WORLDROOM",
      role: "deep-room",
      zoneId: "audralia",
      shape: "diamond",
      center: Object.freeze([-1.45, 1.76, -4.80]),
      topY: 1.76,
      bottomY: -0.40,
      halfWidth: 0.62,
      halfDepth: 0.50,
      rotation: 0,
      material: "WORLD_DEEP_BLUE",
      revealGroup: 5,
      selectable: true,
      labelOffset: 0.52,
      pickPriority: 45
    }),

    Object.freeze({
      id: "AUDRALIA_COCKPIT",
      role: "deep-room",
      zoneId: "audralia",
      shape: "diamond",
      center: Object.freeze([-0.15, 1.76, -5.15]),
      topY: 1.76,
      bottomY: -0.40,
      halfWidth: 0.62,
      halfDepth: 0.50,
      rotation: 0,
      material: "WORLD_DEEP_BLUE",
      revealGroup: 5,
      selectable: true,
      labelOffset: 0.52,
      pickPriority: 45
    }),

    Object.freeze({
      id: "STORY_PORTRAIT_HALL",
      role: "room",
      zoneId: "story",
      shape: "diamond",
      center: Object.freeze([4.55, 1.20, -1.05]),
      topY: 1.20,
      bottomY: -0.40,
      halfWidth: 0.76,
      halfDepth: 0.58,
      rotation: 0,
      material: "STORY_VIOLET",
      revealGroup: 3,
      selectable: true,
      labelOffset: 0.58,
      pickPriority: 40
    }),

    Object.freeze({
      id: "STORY_UNIVERSE_GALLERY",
      role: "room",
      zoneId: "story",
      shape: "diamond",
      center: Object.freeze([4.45, 1.36, 1.35]),
      topY: 1.36,
      bottomY: -0.40,
      halfWidth: 0.76,
      halfDepth: 0.58,
      rotation: 0,
      material: "STORY_VIOLET",
      revealGroup: 3,
      selectable: true,
      labelOffset: 0.58,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_01",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-4.60, 1.14, -1.20]),
      topY: 1.14,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_02",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-5.15, 1.08, -0.25]),
      topY: 1.08,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_03",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-4.85, 1.04, 0.85]),
      topY: 1.04,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_04",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-4.15, 1.12, 1.70]),
      topY: 1.12,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_05",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-3.15, 1.18, 2.05]),
      topY: 1.18,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_06",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-2.35, 1.12, 1.55]),
      topY: 1.12,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_07",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-2.05, 1.10, -0.95]),
      topY: 1.10,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    }),

    Object.freeze({
      id: "FRONTIER_SLOT_08",
      role: "frontier-slot",
      zoneId: "frontier",
      shape: "diamond",
      center: Object.freeze([-3.05, 1.18, -1.75]),
      topY: 1.18,
      bottomY: -0.40,
      halfWidth: 0.46,
      halfDepth: 0.36,
      rotation: 0,
      material: "FRONTIER_STEEL_AMBER",
      revealGroup: 4,
      selectable: true,
      labelOffset: 0.46,
      pickPriority: 40
    })
  ]);

  const CORRIDOR_SPECS = Object.freeze([
    Object.freeze({
      id: "C01",
      source: "ENTRY_THRESHOLD",
      target: "ATRIUM",
      width: 0.78,
      thickness: 0.20,
      className: "primary-spine",
      material: "PRIMARY_CORRIDOR_GOLD",
      revealGroup: 1,
      weight: 1.00
    }),

    Object.freeze({
      id: "C02",
      source: "ATRIUM",
      target: "ATLAS_CORE",
      width: 0.86,
      thickness: 0.22,
      className: "primary-spine",
      material: "PRIMARY_CORRIDOR_GOLD",
      revealGroup: 1,
      weight: 1.00
    }),

    Object.freeze({
      id: "C03",
      source: "ATLAS_CORE",
      target: "WORLD_TERRACE",
      width: 0.78,
      thickness: 0.20,
      className: "primary-spine",
      material: "PRIMARY_CORRIDOR_GOLD",
      revealGroup: 1,
      weight: 1.00
    }),

    Object.freeze({
      id: "C04",
      source: "ATLAS_CORE",
      target: "FRONTIER_WING",
      width: 0.66,
      thickness: 0.18,
      className: "primary-branch",
      material: "PRIMARY_CORRIDOR_GOLD",
      revealGroup: 1,
      weight: 1.00
    }),

    Object.freeze({
      id: "C05",
      source: "ATLAS_CORE",
      target: "STORY_WING",
      width: 0.66,
      thickness: 0.18,
      className: "primary-branch",
      material: "PRIMARY_CORRIDOR_GOLD",
      revealGroup: 1,
      weight: 1.00
    }),

    Object.freeze({
      id: "C06",
      source: "FRONTIER_WING",
      target: "WORLD_TERRACE",
      width: 0.42,
      thickness: 0.16,
      className: "return-circulation",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 1,
      weight: 1.35
    }),

    Object.freeze({
      id: "C07",
      source: "STORY_WING",
      target: "WORLD_TERRACE",
      width: 0.42,
      thickness: 0.16,
      className: "return-circulation",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 1,
      weight: 1.35
    }),

    Object.freeze({
      id: "C08",
      source: "WORLD_TERRACE",
      target: "WORLD_ZIONTS",
      width: 0.40,
      thickness: 0.15,
      className: "world-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 2,
      weight: 1.00
    }),

    Object.freeze({
      id: "C09",
      source: "WORLD_TERRACE",
      target: "WORLD_AUDRALIA",
      width: 0.44,
      thickness: 0.16,
      className: "world-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 2,
      weight: 1.00
    }),

    Object.freeze({
      id: "C10",
      source: "WORLD_TERRACE",
      target: "WORLD_HEARTH",
      width: 0.40,
      thickness: 0.15,
      className: "world-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 2,
      weight: 1.00
    }),

    Object.freeze({
      id: "C11",
      source: "WORLD_TERRACE",
      target: "WORLD_H_EARTH",
      width: 0.40,
      thickness: 0.15,
      className: "world-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 2,
      weight: 1.00
    }),

    Object.freeze({
      id: "C12",
      source: "WORLD_AUDRALIA",
      target: "AUDRALIA_WORLDROOM",
      width: 0.34,
      thickness: 0.14,
      className: "inner-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 5,
      weight: 1.00
    }),

    Object.freeze({
      id: "C13",
      source: "WORLD_AUDRALIA",
      target: "AUDRALIA_COCKPIT",
      width: 0.34,
      thickness: 0.14,
      className: "inner-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 5,
      weight: 1.00
    }),

    Object.freeze({
      id: "C14",
      source: "STORY_WING",
      target: "STORY_PORTRAIT_HALL",
      width: 0.38,
      thickness: 0.15,
      className: "story-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 3,
      weight: 1.00
    }),

    Object.freeze({
      id: "C15",
      source: "STORY_WING",
      target: "STORY_UNIVERSE_GALLERY",
      width: 0.38,
      thickness: 0.15,
      className: "story-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 3,
      weight: 1.00
    }),

    Object.freeze({
      id: "C16",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_01",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    }),

    Object.freeze({
      id: "C17",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_02",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    }),

    Object.freeze({
      id: "C18",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_03",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    }),

    Object.freeze({
      id: "C19",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_04",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    }),

    Object.freeze({
      id: "C20",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_05",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    }),

    Object.freeze({
      id: "C21",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_06",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    }),

    Object.freeze({
      id: "C22",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_07",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    }),

    Object.freeze({
      id: "C23",
      source: "FRONTIER_WING",
      target: "FRONTIER_SLOT_08",
      width: 0.30,
      thickness: 0.13,
      className: "workshop-connector",
      material: "SECONDARY_CORRIDOR_CYAN",
      revealGroup: 4,
      weight: 1.00
    })
  ]);

  const FIXED_BINDINGS = Object.freeze([
    Object.freeze({
      nodeId: "ENTRY_THRESHOLD",
      candidateIds: Object.freeze([
        "showroom-door",
        "showroom",
        "mirrorland-door",
        "door-to-mirrorland"
      ]),
      candidatePaths: Object.freeze([
        "/showroom/"
      ]),
      aliases: Object.freeze([
        "the door to mirrorland",
        "door to mirrorland",
        "showroom door",
        "mirrorland entry",
        "the showroom"
      ])
    }),

    Object.freeze({
      nodeId: "ATRIUM",
      candidateIds: Object.freeze([
        "atrium",
        "mirrorland-atrium",
        "estate-atrium"
      ]),
      candidatePaths: Object.freeze([]),
      aliases: Object.freeze([
        "atrium",
        "mirrorland atrium",
        "estate atrium"
      ])
    }),

    Object.freeze({
      nodeId: "ATLAS_CORE",
      candidateIds: Object.freeze([
        "atlas-study",
        "atlas",
        "mirrorland-field",
        "atlas-core"
      ]),
      candidatePaths: Object.freeze([]),
      aliases: Object.freeze([
        "atlas study",
        "atlas",
        "atlas core",
        "mirrorland field"
      ])
    }),

    Object.freeze({
      nodeId: "WORLD_TERRACE",
      candidateIds: Object.freeze([
        "world-study",
        "globe",
        "world-terrace",
        "showroom-globe"
      ]),
      candidatePaths: Object.freeze([
        "/showroom/globe/"
      ]),
      aliases: Object.freeze([
        "world study",
        "world terrace",
        "globe room",
        "globe"
      ])
    }),

    Object.freeze({
      nodeId: "FRONTIER_WING",
      candidateIds: Object.freeze([
        "frontier",
        "frontier-workshop-yard",
        "explore-frontier"
      ]),
      candidatePaths: Object.freeze([
        "/explore/frontier/"
      ]),
      aliases: Object.freeze([
        "frontier",
        "frontier workshop yard",
        "workshop yard"
      ])
    }),

    Object.freeze({
      nodeId: "STORY_WING",
      candidateIds: Object.freeze([
        "characters",
        "story-wing",
        "portrait-wing"
      ]),
      candidatePaths: Object.freeze([
        "/characters/"
      ]),
      aliases: Object.freeze([
        "story wing",
        "characters",
        "character gallery"
      ])
    }),

    Object.freeze({
      nodeId: "WORLD_ZIONTS",
      candidateIds: Object.freeze([
        "zionts",
        "zionts-world"
      ]),
      candidatePaths: Object.freeze([]),
      aliases: Object.freeze([
        "zionts",
        "zionts world"
      ])
    }),

    Object.freeze({
      nodeId: "WORLD_AUDRALIA",
      candidateIds: Object.freeze([
        "audralia",
        "audralia-conservatory"
      ]),
      candidatePaths: Object.freeze([
        "/showroom/globe/audralia/"
      ]),
      aliases: Object.freeze([
        "audralia",
        "audralia conservatory"
      ])
    }),

    Object.freeze({
      nodeId: "WORLD_HEARTH",
      candidateIds: Object.freeze([
        "hearth",
        "hearth-room"
      ]),
      candidatePaths: Object.freeze([
        "/showroom/globe/hearth/"
      ]),
      aliases: Object.freeze([
        "hearth",
        "hearth room"
      ])
    }),

    Object.freeze({
      nodeId: "WORLD_H_EARTH",
      candidateIds: Object.freeze([
        "h-earth",
        "h_earth",
        "hybrid-earth"
      ]),
      candidatePaths: Object.freeze([
        "/showroom/globe/h-earth/"
      ]),
      aliases: Object.freeze([
        "h-earth",
        "h earth",
        "hybrid earth",
        "h-earth annex"
      ])
    }),

    Object.freeze({
      nodeId: "AUDRALIA_WORLDROOM",
      candidateIds: Object.freeze([
        "audralia-worldroom",
        "worldroom",
        "audralia-world-room"
      ]),
      candidatePaths: Object.freeze([
        "/showroom/globe/audralia/worldroom/"
      ]),
      aliases: Object.freeze([
        "audralia worldroom",
        "worldroom",
        "audralia world room"
      ])
    }),

    Object.freeze({
      nodeId: "AUDRALIA_COCKPIT",
      candidateIds: Object.freeze([
        "audralia-control-cockpit",
        "control-cockpit",
        "audralia-disposition"
      ]),
      candidatePaths: Object.freeze([
        "/showroom/globe/audralia/disposition/"
      ]),
      aliases: Object.freeze([
        "control cockpit",
        "audralia control cockpit",
        "audralia disposition"
      ])
    }),

    Object.freeze({
      nodeId: "STORY_PORTRAIT_HALL",
      candidateIds: Object.freeze([
        "portrait-hall",
        "character-portrait-hall"
      ]),
      candidatePaths: Object.freeze([]),
      aliases: Object.freeze([
        "portrait hall",
        "character portrait hall"
      ])
    }),

    Object.freeze({
      nodeId: "STORY_UNIVERSE_GALLERY",
      candidateIds: Object.freeze([
        "nine-summits-universe",
        "universe-gallery",
        "nine-summits"
      ]),
      candidatePaths: Object.freeze([
        "/nine-summits/universe/",
        "/nine-summits/"
      ]),
      aliases: Object.freeze([
        "universe gallery",
        "nine summits universe",
        "the nine summits of love"
      ])
    })
  ]);

  const PARENT_NODE = Object.freeze({
    ENTRY_THRESHOLD: null,
    ATRIUM: "ENTRY_THRESHOLD",
    ATLAS_CORE: "ATRIUM",
    WORLD_TERRACE: "ATLAS_CORE",
    FRONTIER_WING: "ATLAS_CORE",
    STORY_WING: "ATLAS_CORE",
    WORLD_ZIONTS: "WORLD_TERRACE",
    WORLD_AUDRALIA: "WORLD_TERRACE",
    WORLD_HEARTH: "WORLD_TERRACE",
    WORLD_H_EARTH: "WORLD_TERRACE",
    AUDRALIA_WORLDROOM: "WORLD_AUDRALIA",
    AUDRALIA_COCKPIT: "WORLD_AUDRALIA",
    STORY_PORTRAIT_HALL: "STORY_WING",
    STORY_UNIVERSE_GALLERY: "STORY_WING",
    FRONTIER_SLOT_01: "FRONTIER_WING",
    FRONTIER_SLOT_02: "FRONTIER_WING",
    FRONTIER_SLOT_03: "FRONTIER_WING",
    FRONTIER_SLOT_04: "FRONTIER_WING",
    FRONTIER_SLOT_05: "FRONTIER_WING",
    FRONTIER_SLOT_06: "FRONTIER_WING",
    FRONTIER_SLOT_07: "FRONTIER_WING",
    FRONTIER_SLOT_08: "FRONTIER_WING"
  });

  const LINE_CLASS = Object.freeze({
    platformPerimeter: 0,
    platformVertical: 1,
    corridorRail: 2,
    primaryRoute: 3,
    returnRoute: 4,
    currentPath: 5,
    selectedPath: 6,
    guide: 7,
    foundation: 8
  });

  const state = {
    mounted: false,
    disposed: false,
    overlayOpen: false,
    activeLens: "mirrorland",
    estateView: "overview",

    registrySource: null,
    registryContract: null,
    registryRoutes: [],
    mirrorlandRoutes: [],
    mainRoutes: [],
    routeById: new Map(),
    routeByPath: new Map(),
    registryAttempts: 0,
    registryReady: false,

    geometry: null,
    geometryReady: false,
    audit: null,
    auditReady: false,

    nodeBindings: new Map(),
    routeToNode: new Map(),
    frontierOverflow: [],
    unplacedMirrorlandRoutes: [],
    currentRoute: null,
    currentNodeId: null,

    selectedNodeId: null,
    focusedNodeId: null,
    focusedRevealGroup: null,
    currentPathCorridors: new Set(),
    selectedPathCorridors: new Set(),
    visibleGroups: new Set([0, 1]),

    bubble: null,
    overlay: null,
    shell: null,
    closeButton: null,
    lensButtons: new Map(),
    panels: new Map(),

    stage: null,
    canvas: null,
    labelLayer: null,
    fallback: null,
    liveStatus: null,
    estateStatus: null,
    overviewButton: null,
    structureButton: null,
    resetButton: null,
    roomPanelRefs: [],
    mobileRoomSheet: null,
    unplacedContainer: null,
    mainMenuGroups: null,

    gl: null,
    programs: null,
    buffers: null,
    locations: null,
    webglReady: false,
    contextLost: false,
    fallbackActive: false,
    fallbackReason: null,

    width: 0,
    height: 0,
    cssWidth: 0,
    cssHeight: 0,
    dpr: 1,

    projectionMatrix: new Float32Array(16),
    viewMatrix: new Float32Array(16),
    projectionViewMatrix: new Float32Array(16),
    inverseProjectionViewMatrix: new Float32Array(16),

    camera: {
      target: INITIAL_CAMERA.target.slice(),
      yaw: INITIAL_CAMERA.yaw,
      pitch: INITIAL_CAMERA.pitch,
      distance: INITIAL_CAMERA.distance,
      velocityYaw: 0,
      velocityPitch: 0,
      transition: null
    },

    pointers: new Map(),
    primaryPointerId: null,
    pointerDownTime: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    pointerMoved: false,
    lastPinchDistance: 0,
    lastTapTime: 0,
    lastInteractionTime: 0,
    cameraMovingUntil: 0,

    running: false,
    raf: 0,
    lastFrameTime: 0,
    renderCount: 0,
    selectionCount: 0,
    focusCount: 0,
    resizeCount: 0,
    contextLossCount: 0,

    resizeObserver: null,
    intersectionObserver: null,
    stageVisible: true,
    documentVisible: !doc.hidden,

    adapter: null,
    adapterStatus: "OPTIONAL_HELD",
    adapterAttempts: 0,
    adapterRegistered: false,

    statusText: "",
    errors: [],
    abortController:
      typeof AbortController !== "undefined"
        ? new AbortController()
        : null
  };

  const signal = state.abortController
    ? state.abortController.signal
    : undefined;

  const reducedMotion =
    typeof root.matchMedia === "function"
      ? root.matchMedia("(prefers-reduced-motion: reduce)")
      : {
          matches: false,
          addEventListener() {},
          removeEventListener() {}
        };

  const mobileQuery =
    typeof root.matchMedia === "function"
      ? root.matchMedia("(max-width: 760px), (pointer: coarse)")
      : {
          matches: false
        };

  if (
    root.__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__ &&
    typeof root.__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__.dispose ===
      "function"
  ) {
    try {
      root.__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__.dispose();
    } catch (_error) {}
  }

  function now() {
    return (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
        ? performance.now()
        : Date.now()
    );
  }

  function clamp(value, minimum, maximum) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        number
      )
    );
  }

  function lerp(a, b, amount) {
    return a + (b - a) * amount;
  }

  function easeOutCubic(value) {
    const inverse = 1 - value;
    return 1 - inverse * inverse * inverse;
  }

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[_–—-]+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ");
  }

  function normalizePath(value) {
    let path = String(value || "").trim();

    if (!path) {
      return "";
    }

    try {
      if (/^https?:\/\//i.test(path)) {
        path = new URL(path).pathname;
      }
    } catch (_error) {}

    path = path.split("?")[0].split("#")[0];

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    path = path.replace(/\/+/g, "/");

    if (!path.endsWith("/")) {
      path += "/";
    }

    return path;
  }

  function isFiniteVector(vector, minimumLength) {
    return (
      Array.isArray(vector) &&
      vector.length >= minimumLength &&
      vector
        .slice(0, minimumLength)
        .every(value => Number.isFinite(Number(value)))
    );
  }

  function query(selector, owner) {
    const scope = owner || doc;

    try {
      return scope.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function queryAll(selector, owner) {
    const scope = owner || doc;

    try {
      return Array.from(scope.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function setDataset(name, value) {
    const text = String(value);

    try {
      doc.documentElement.dataset[name] = text;

      if (doc.body) {
        doc.body.dataset[name] = text;
      }
    } catch (_error) {}
  }

  function dispatch(name, detail) {
    try {
      root.dispatchEvent(
        new CustomEvent(name, {
          detail
        })
      );
    } catch (_error) {}
  }

  function listen(target, type, listener, options) {
    if (!target || typeof target.addEventListener !== "function") {
      return;
    }

    const settings = options || {};

    if (signal) {
      target.addEventListener(type, listener, {
        ...settings,
        signal
      });
      return;
    }

    target.addEventListener(type, listener, settings);
  }

  function element(tagName, attributes, children) {
    const node = doc.createElement(tagName);

    if (attributes) {
      for (const [name, value] of Object.entries(attributes)) {
        if (value === null || typeof value === "undefined") {
          continue;
        }

        if (name === "className") {
          node.className = value;
          continue;
        }

        if (name === "text") {
          node.textContent = value;
          continue;
        }

        if (name === "hidden") {
          node.hidden = Boolean(value);
          continue;
        }

        if (name === "disabled") {
          node.disabled = Boolean(value);
          continue;
        }

        if (name === "tabIndex") {
          node.tabIndex = Number(value);
          continue;
        }

        if (name.startsWith("data-")) {
          node.setAttribute(name, String(value));
          continue;
        }

        node.setAttribute(name, String(value));
      }
    }

    if (Array.isArray(children)) {
      for (const child of children) {
        if (child === null || typeof child === "undefined") {
          continue;
        }

        if (typeof child === "string") {
          node.appendChild(doc.createTextNode(child));
        } else {
          node.appendChild(child);
        }
      }
    } else if (typeof children === "string") {
      node.textContent = children;
    } else if (children) {
      node.appendChild(children);
    }

    return node;
  }

  function recordError(scope, error) {
    const message =
      error && error.message
        ? error.message
        : String(error || scope);

    state.errors.push(
      Object.freeze({
        scope,
        message,
        time: new Date().toISOString()
      })
    );

    setDataset(
      "dgbManorBlueprintError",
      message
    );

    setStatus(
      `Map / Portal error · ${message}`,
      "error"
    );

    publishState(
      `error:${scope}`,
      true
    );
  }

  function setStatus(text, kind) {
    const value = String(text || "");

    state.statusText = value;

    if (state.estateStatus) {
      state.estateStatus.textContent = value;
      state.estateStatus.dataset.statusKind =
        kind || "normal";
    }

    if (state.liveStatus) {
      state.liveStatus.textContent = value;
      state.liveStatus.dataset.statusKind =
        kind || "normal";
    }

    setDataset(
      "dgbManorBlueprintStatusText",
      value
    );
  }

  function getMaterialColor(materialId) {
    const index = MATERIAL_INDEX[materialId];

    if (!Number.isInteger(index)) {
      return [0.30, 0.50, 0.70];
    }

    return MATERIALS[index].color.slice();
  }

  function routeField(route, names) {
    for (const name of names) {
      if (
        route &&
        Object.prototype.hasOwnProperty.call(route, name) &&
        route[name] !== null &&
        typeof route[name] !== "undefined" &&
        route[name] !== ""
      ) {
        return route[name];
      }
    }

    return null;
  }

  function inferMenu(route, path) {
    const explicit = normalizeText(
      routeField(route, [
        "menu",
        "menuCategory",
        "menuType",
        "navigationMenu",
        "navigationCategory"
      ])
    );

    if (
      explicit === "mirrorland" ||
      explicit === "mirrorland doors" ||
      explicit === "doors"
    ) {
      return "mirrorland";
    }

    if (
      explicit === "main" ||
      explicit === "main menu" ||
      explicit === "website"
    ) {
      return "main";
    }

    const mirrorlandFlag = routeField(route, [
      "mirrorland",
      "isMirrorland",
      "showInMirrorland",
      "mirrorlandDoor"
    ]);

    if (mirrorlandFlag === true || mirrorlandFlag === "true") {
      return "mirrorland";
    }

    const mainFlag = routeField(route, [
      "mainMenu",
      "isMainMenu",
      "showInMainMenu",
      "websiteOption"
    ]);

    if (mainFlag === true || mainFlag === "true") {
      return "main";
    }

    const normalizedPath = normalizePath(path);

    if (
      normalizedPath === "/showroom/" ||
      normalizedPath.startsWith("/showroom/globe/") ||
      normalizedPath.startsWith("/explore/frontier/") ||
      normalizedPath.startsWith("/characters/") ||
      normalizedPath.startsWith("/nine-summits/")
    ) {
      return "mirrorland";
    }

    if (normalizedPath) {
      return "main";
    }

    return "unknown";
  }

  function normalizeRoute(route, fallbackIndex) {
    const path = normalizePath(
      routeField(route, [
        "path",
        "href",
        "url",
        "route",
        "pathname",
        "routePath"
      ])
    );

    const publicRoomName = String(
      routeField(route, [
        "publicRoomName",
        "roomName",
        "name",
        "title",
        "label",
        "publicName"
      ]) ||
      path ||
      `Room ${fallbackIndex + 1}`
    ).trim();

    const routeId = String(
      routeField(route, [
        "routeId",
        "id",
        "roomId",
        "key",
        "slug"
      ]) ||
      normalizeText(publicRoomName).replace(/\s+/g, "-") ||
      `route-${fallbackIndex + 1}`
    ).trim();

    const menu = inferMenu(route, path);

    const priorityValue = Number(
      routeField(route, [
        "priority",
        "order",
        "rank",
        "weight"
      ])
    );

    const showInBlueprintValue = routeField(route, [
      "showInBlueprint",
      "blueprintVisible",
      "showOnMap",
      "visible"
    ]);

    const childrenValue = routeField(route, [
      "children",
      "childRoutes",
      "childIds"
    ]);

    const nearbyValue = routeField(route, [
      "nearby",
      "nearbyRoutes",
      "neighbors"
    ]);

    return Object.freeze({
      raw: route,
      routeId,
      path,
      publicRoomName,
      normalizedName: normalizeText(publicRoomName),
      estateLocation: String(
        routeField(route, [
          "estateLocation",
          "location",
          "roomLocation"
        ]) || ""
      ).trim(),
      purpose: String(
        routeField(route, [
          "purpose",
          "description",
          "summary"
        ]) || ""
      ).trim(),
      action: String(
        routeField(route, [
          "action",
          "visitorAction",
          "instruction"
        ]) || ""
      ).trim(),
      context: String(
        routeField(route, [
          "context",
          "narrative",
          "details"
        ]) || ""
      ).trim(),
      valueCategory: String(
        routeField(route, [
          "valueCategory",
          "category",
          "group",
          "section"
        ]) || "Estate"
      ).trim(),
      wing: String(
        routeField(route, [
          "wing",
          "estateWing",
          "zone"
        ]) || ""
      ).trim(),
      parentRouteId: String(
        routeField(route, [
          "parentRouteId",
          "parentId",
          "parent"
        ]) || ""
      ).trim(),
      parentPath: normalizePath(
        routeField(route, [
          "parentPath",
          "parentRoute",
          "parentHref"
        ])
      ),
      children: Array.isArray(childrenValue)
        ? childrenValue.slice()
        : [],
      nearby: Array.isArray(nearbyValue)
        ? nearbyValue.slice()
        : [],
      menu,
      priority: Number.isFinite(priorityValue)
        ? priorityValue
        : 0,
      showInBlueprint:
        showInBlueprintValue === false ||
        showInBlueprintValue === "false"
          ? false
          : true
    });
  }

  function collectRouteObjects(source) {
    const output = [];
    const seenObjects =
      typeof WeakSet !== "undefined"
        ? new WeakSet()
        : null;
    const seenRouteKeys = new Set();

    function isRouteLike(value) {
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
      ) {
        return false;
      }

      const hasPath = Boolean(
        routeField(value, [
          "path",
          "href",
          "url",
          "route",
          "pathname",
          "routePath"
        ])
      );

      const hasIdentity = Boolean(
        routeField(value, [
          "routeId",
          "id",
          "roomId",
          "publicRoomName",
          "roomName",
          "name",
          "title",
          "label"
        ])
      );

      return hasPath && hasIdentity;
    }

    function visit(value, depth) {
      if (
        value === null ||
        typeof value === "undefined" ||
        depth > 7
      ) {
        return;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          visit(item, depth + 1);
        }
        return;
      }

      if (typeof value !== "object") {
        return;
      }

      if (seenObjects) {
        if (seenObjects.has(value)) {
          return;
        }

        seenObjects.add(value);
      }

      if (isRouteLike(value)) {
        const route = normalizeRoute(
          value,
          output.length
        );

        const key =
          `${route.routeId}::${route.path}`;

        if (!seenRouteKeys.has(key)) {
          seenRouteKeys.add(key);
          output.push(route);
        }

        return;
      }

      const preferredKeys = [
        "routes",
        "rooms",
        "entries",
        "items",
        "registry",
        "routeRegistry",
        "mirrorlandRoutes",
        "mainRoutes",
        "categories",
        "groups",
        "children"
      ];

      for (const key of preferredKeys) {
        if (
          Object.prototype.hasOwnProperty.call(value, key)
        ) {
          visit(value[key], depth + 1);
        }
      }

      if (depth <= 3) {
        for (const [key, child] of Object.entries(value)) {
          if (preferredKeys.includes(key)) {
            continue;
          }

          if (
            child &&
            (
              Array.isArray(child) ||
              typeof child === "object"
            )
          ) {
            visit(child, depth + 1);
          }
        }
      }
    }

    if (source) {
      const methods = [
        "getRoutes",
        "listRoutes",
        "getAllRoutes",
        "getRegistry",
        "getRooms",
        "listRooms"
      ];

      for (const method of methods) {
        if (typeof source[method] === "function") {
          try {
            visit(source[method](), 0);
          } catch (_error) {}
        }
      }

      visit(source, 0);
    }

    return output;
  }

  function locateRegistrySource() {
    const candidates = [
      root.DGB_MANOR_BLUEPRINT_REGISTRY,
      root.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY,
      root.DGB_MANOR_BLUEPRINT_REGISTRY_API,
      root.MANOR_BLUEPRINT_REGISTRY,
      root.__DGB_MANOR_BLUEPRINT_REGISTRY__
    ];

    for (const candidate of candidates) {
      if (!candidate) {
        continue;
      }

      const routes = collectRouteObjects(candidate);

      if (routes.length) {
        return {
          source: candidate,
          routes
        };
      }
    }

    return null;
  }

  function installRegistry(routes, source) {
    state.registrySource = source;
    state.registryRoutes = routes.slice();
    state.registryReady = routes.length > 0;

    state.registryContract =
      source &&
      (
        source.contract ||
        source.CONTRACT ||
        source.registryContract
      )
        ? String(
            source.contract ||
            source.CONTRACT ||
            source.registryContract
          )
        : null;

    state.routeById.clear();
    state.routeByPath.clear();

    for (const route of state.registryRoutes) {
      state.routeById.set(
        route.routeId,
        route
      );

      if (route.path) {
        state.routeByPath.set(
          route.path,
          route
        );
      }
    }

    state.mirrorlandRoutes =
      state.registryRoutes.filter(
        route =>
          route.menu === "mirrorland" &&
          route.showInBlueprint !== false
      );

    state.mainRoutes =
      state.registryRoutes.filter(
        route =>
          route.menu === "main"
      );

    bindRegistryToGeometry();
    buildMainMenu();
    buildUnplacedRoutes();
    rebuildLabels();
    updateCurrentRoute();
    runAudit();
    updateFallback();
    registerAdapterWhenAvailable(0);

    setDataset(
      "dgbManorBlueprintRegistryReady",
      state.registryReady
    );
  }

  function routeScoreForBinding(route, binding) {
    let score = 0;

    const routeIdText =
      normalizeText(route.routeId);
    const routePath =
      normalizePath(route.path);
    const routeName =
      normalizeText(route.publicRoomName);
    const routeLocation =
      normalizeText(route.estateLocation);

    for (const candidateId of binding.candidateIds) {
      const normalized =
        normalizeText(candidateId);

      if (
        routeIdText === normalized ||
        routeIdText === normalized.replace(/\s+/g, "-")
      ) {
        score = Math.max(score, 120);
      }
    }

    for (const candidatePath of binding.candidatePaths) {
      if (
        routePath &&
        routePath === normalizePath(candidatePath)
      ) {
        score = Math.max(score, 110);
      }
    }

    for (const alias of binding.aliases) {
      const normalized =
        normalizeText(alias);

      if (routeName === normalized) {
        score = Math.max(score, 100);
      } else if (
        routeName.includes(normalized) ||
        normalized.includes(routeName)
      ) {
        score = Math.max(score, 72);
      }

      if (routeLocation === normalized) {
        score = Math.max(score, 68);
      }
    }

    return score;
  }

  function isFrontierChild(route, frontierRoute) {
    if (!route || !frontierRoute) {
      return false;
    }

    if (route.routeId === frontierRoute.routeId) {
      return false;
    }

    if (
      route.parentRouteId &&
      route.parentRouteId === frontierRoute.routeId
    ) {
      return true;
    }

    if (
      route.parentPath &&
      route.parentPath === frontierRoute.path
    ) {
      return true;
    }

    if (
      frontierRoute.path &&
      route.path &&
      route.path.startsWith(frontierRoute.path) &&
      route.path !== frontierRoute.path
    ) {
      return true;
    }

    return false;
  }

  function bindRegistryToGeometry() {
    state.nodeBindings.clear();
    state.routeToNode.clear();
    state.frontierOverflow = [];
    state.unplacedMirrorlandRoutes = [];

    const usedRoutes = new Set();

    for (const binding of FIXED_BINDINGS) {
      let bestRoute = null;
      let bestScore = 0;

      for (const route of state.mirrorlandRoutes) {
        if (usedRoutes.has(route.routeId)) {
          continue;
        }

        const score =
          routeScoreForBinding(
            route,
            binding
          );

        if (score > bestScore) {
          bestScore = score;
          bestRoute = route;
        }
      }

      if (bestRoute && bestScore >= 68) {
        state.nodeBindings.set(
          binding.nodeId,
          bestRoute
        );

        state.routeToNode.set(
          bestRoute.routeId,
          binding.nodeId
        );

        usedRoutes.add(
          bestRoute.routeId
        );
      }
    }

    const frontierRoute =
      state.nodeBindings.get("FRONTIER_WING") ||
      null;

    const frontierChildren =
      state.mirrorlandRoutes
        .filter(
          route =>
            !usedRoutes.has(route.routeId) &&
            isFrontierChild(route, frontierRoute)
        )
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }

          const nameCompare =
            a.publicRoomName.localeCompare(
              b.publicRoomName
            );

          if (nameCompare !== 0) {
            return nameCompare;
          }

          const pathCompare =
            a.path.localeCompare(b.path);

          if (pathCompare !== 0) {
            return pathCompare;
          }

          return a.routeId.localeCompare(
            b.routeId
          );
        });

    const slots =
      PLATFORM_SPECS.filter(
        spec => spec.role === "frontier-slot"
      );

    frontierChildren.forEach(
      (route, index) => {
        if (index < slots.length) {
          const slot = slots[index];

          state.nodeBindings.set(
            slot.id,
            route
          );

          state.routeToNode.set(
            route.routeId,
            slot.id
          );

          usedRoutes.add(
            route.routeId
          );
        } else {
          state.frontierOverflow.push(route);
          usedRoutes.add(route.routeId);
        }
      }
    );

    state.unplacedMirrorlandRoutes =
      state.mirrorlandRoutes.filter(
        route =>
          !usedRoutes.has(route.routeId)
      );

    updateNodeBindingsOnGeometry();
  }

  function updateNodeBindingsOnGeometry() {
    if (!state.geometry) {
      return;
    }

    for (const node of state.geometry.sceneNodes) {
      const route =
        state.nodeBindings.get(node.id) ||
        null;

      node.route = route;
      node.bound = Boolean(route);

      if (
        node.role === "frontier-slot" &&
        !route
      ) {
        node.pickable = false;
      } else {
        node.pickable =
          node.selectable &&
          Boolean(route);
      }
    }
  }

  function createMat4() {
    return new Float32Array(16);
  }

  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  function multiply(out, a, b) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];

    out[0] =
      b0 * a00 +
      b1 * a10 +
      b2 * a20 +
      b3 * a30;

    out[1] =
      b0 * a01 +
      b1 * a11 +
      b2 * a21 +
      b3 * a31;

    out[2] =
      b0 * a02 +
      b1 * a12 +
      b2 * a22 +
      b3 * a32;

    out[3] =
      b0 * a03 +
      b1 * a13 +
      b2 * a23 +
      b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];

    out[4] =
      b0 * a00 +
      b1 * a10 +
      b2 * a20 +
      b3 * a30;

    out[5] =
      b0 * a01 +
      b1 * a11 +
      b2 * a21 +
      b3 * a31;

    out[6] =
      b0 * a02 +
      b1 * a12 +
      b2 * a22 +
      b3 * a32;

    out[7] =
      b0 * a03 +
      b1 * a13 +
      b2 * a23 +
      b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];

    out[8] =
      b0 * a00 +
      b1 * a10 +
      b2 * a20 +
      b3 * a30;

    out[9] =
      b0 * a01 +
      b1 * a11 +
      b2 * a21 +
      b3 * a31;

    out[10] =
      b0 * a02 +
      b1 * a12 +
      b2 * a22 +
      b3 * a32;

    out[11] =
      b0 * a03 +
      b1 * a13 +
      b2 * a23 +
      b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];

    out[12] =
      b0 * a00 +
      b1 * a10 +
      b2 * a20 +
      b3 * a30;

    out[13] =
      b0 * a01 +
      b1 * a11 +
      b2 * a21 +
      b3 * a31;

    out[14] =
      b0 * a02 +
      b1 * a12 +
      b2 * a22 +
      b3 * a32;

    out[15] =
      b0 * a03 +
      b1 * a13 +
      b2 * a23 +
      b3 * a33;

    return out;
  }

  function perspective(
    out,
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const f =
      1 /
      Math.tan(
        fieldOfView / 2
      );

    const inverseRange =
      1 /
      (near - far);

    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] =
      (far + near) *
      inverseRange;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] =
      2 *
      far *
      near *
      inverseRange;
    out[15] = 0;

    return out;
  }

  function subtractVector(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function addVector(a, b) {
    return [
      a[0] + b[0],
      a[1] + b[1],
      a[2] + b[2]
    ];
  }

  function scaleVector(vector, scale) {
    return [
      vector[0] * scale,
      vector[1] * scale,
      vector[2] * scale
    ];
  }

  function crossVector(a, b) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function dotVector(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function normalizeVector(vector) {
    const length =
      Math.hypot(
        vector[0],
        vector[1],
        vector[2]
      ) || 1;

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function lookAt(
    out,
    eye,
    target,
    up
  ) {
    const z =
      normalizeVector(
        subtractVector(
          eye,
          target
        )
      );

    const x =
      normalizeVector(
        crossVector(
          up,
          z
        )
      );

    const y =
      crossVector(
        z,
        x
      );

    out[0] = x[0];
    out[1] = y[0];
    out[2] = z[0];
    out[3] = 0;
    out[4] = x[1];
    out[5] = y[1];
    out[6] = z[1];
    out[7] = 0;
    out[8] = x[2];
    out[9] = y[2];
    out[10] = z[2];
    out[11] = 0;
    out[12] =
      -dotVector(
        x,
        eye
      );
    out[13] =
      -dotVector(
        y,
        eye
      );
    out[14] =
      -dotVector(
        z,
        eye
      );
    out[15] = 1;

    return out;
  }

  function invert(out, a) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    const b00 =
      a00 * a11 -
      a01 * a10;

    const b01 =
      a00 * a12 -
      a02 * a10;

    const b02 =
      a00 * a13 -
      a03 * a10;

    const b03 =
      a01 * a12 -
      a02 * a11;

    const b04 =
      a01 * a13 -
      a03 * a11;

    const b05 =
      a02 * a13 -
      a03 * a12;

    const b06 =
      a20 * a31 -
      a21 * a30;

    const b07 =
      a20 * a32 -
      a22 * a30;

    const b08 =
      a20 * a33 -
      a23 * a30;

    const b09 =
      a21 * a32 -
      a22 * a31;

    const b10 =
      a21 * a33 -
      a23 * a31;

    const b11 =
      a22 * a33 -
      a23 * a32;

    let determinant =
      b00 * b11 -
      b01 * b10 +
      b02 * b09 +
      b03 * b08 -
      b04 * b07 +
      b05 * b06;

    if (!determinant) {
      return null;
    }

    determinant =
      1 /
      determinant;

    out[0] =
      (
        a11 * b11 -
        a12 * b10 +
        a13 * b09
      ) *
      determinant;

    out[1] =
      (
        a02 * b10 -
        a01 * b11 -
        a03 * b09
      ) *
      determinant;

    out[2] =
      (
        a31 * b05 -
        a32 * b04 +
        a33 * b03
      ) *
      determinant;

    out[3] =
      (
        a22 * b04 -
        a21 * b05 -
        a23 * b03
      ) *
      determinant;

    out[4] =
      (
        a12 * b08 -
        a10 * b11 -
        a13 * b07
      ) *
      determinant;

    out[5] =
      (
        a00 * b11 -
        a02 * b08 +
        a03 * b07
      ) *
      determinant;

    out[6] =
      (
        a32 * b02 -
        a30 * b05 -
        a33 * b01
      ) *
      determinant;

    out[7] =
      (
        a20 * b05 -
        a22 * b02 +
        a23 * b01
      ) *
      determinant;

    out[8] =
      (
        a10 * b10 -
        a11 * b08 +
        a13 * b06
      ) *
      determinant;

    out[9] =
      (
        a01 * b08 -
        a00 * b10 -
        a03 * b06
      ) *
      determinant;

    out[10] =
      (
        a30 * b04 -
        a31 * b02 +
        a33 * b00
      ) *
      determinant;

    out[11] =
      (
        a21 * b02 -
        a20 * b04 -
        a23 * b00
      ) *
      determinant;

    out[12] =
      (
        a11 * b07 -
        a10 * b09 -
        a12 * b06
      ) *
      determinant;

    out[13] =
      (
        a00 * b09 -
        a01 * b07 +
        a02 * b06
      ) *
      determinant;

    out[14] =
      (
        a31 * b01 -
        a30 * b03 -
        a32 * b00
      ) *
      determinant;

    out[15] =
      (
        a20 * b03 -
        a21 * b01 +
        a22 * b00
      ) *
      determinant;

    return out;
  }

  function transformPoint4(
    matrix,
    point
  ) {
    const x = point[0];
    const y = point[1];
    const z = point[2];
    const w = point[3];

    return [
      matrix[0] * x +
        matrix[4] * y +
        matrix[8] * z +
        matrix[12] * w,

      matrix[1] * x +
        matrix[5] * y +
        matrix[9] * z +
        matrix[13] * w,

      matrix[2] * x +
        matrix[6] * y +
        matrix[10] * z +
        matrix[14] * w,

      matrix[3] * x +
        matrix[7] * y +
        matrix[11] * z +
        matrix[15] * w
    ];
  }

  function unproject(
    ndcX,
    ndcY,
    ndcZ
  ) {
    const result =
      transformPoint4(
        state.inverseProjectionViewMatrix,
        [
          ndcX,
          ndcY,
          ndcZ,
          1
        ]
      );

    const inverseW =
      result[3]
        ? 1 / result[3]
        : 1;

    return [
      result[0] * inverseW,
      result[1] * inverseW,
      result[2] * inverseW
    ];
  }

  function triangleNormal(a, b, c) {
    return normalizeVector(
      crossVector(
        subtractVector(b, a),
        subtractVector(c, a)
      )
    );
  }

  function rotatePoint2D(
    x,
    z,
    rotation
  ) {
    const cosine =
      Math.cos(rotation);

    const sine =
      Math.sin(rotation);

    return [
      x * cosine -
        z * sine,

      x * sine +
        z * cosine
    ];
  }

  function createPlatformPolygon(spec, y) {
    const points = [];
    const rotation =
      Number(spec.rotation) || 0;

    if (spec.shape === "diamond") {
      const localPoints = [
        [0, -spec.halfDepth],
        [-spec.halfWidth, 0],
        [0, spec.halfDepth],
        [spec.halfWidth, 0]
      ];

      for (const local of localPoints) {
        const rotated =
          rotatePoint2D(
            local[0],
            local[1],
            rotation
          );

        points.push([
          spec.center[0] + rotated[0],
          y,
          spec.center[2] + rotated[1]
        ]);
      }

      return points;
    }

    if (spec.shape === "hexagon") {
      for (let index = 0; index < 6; index += 1) {
        const angle =
          -Math.PI / 2 -
          index *
          Math.PI *
          2 /
          6 +
          rotation;

        points.push([
          spec.center[0] +
            Math.cos(angle) *
            spec.radius,

          y,

          spec.center[2] +
            Math.sin(angle) *
            spec.radius
        ]);
      }

      return points;
    }

    if (spec.shape === "triangle") {
      const angles = [
        Math.PI / 2,
        Math.PI / 2 -
          Math.PI *
          2 /
          3,
        Math.PI / 2 -
          Math.PI *
          4 /
          3
      ];

      for (const baseAngle of angles) {
        const angle =
          baseAngle +
          rotation;

        points.push([
          spec.center[0] +
            Math.cos(angle) *
            spec.radius,

          y,

          spec.center[2] +
            Math.sin(angle) *
            spec.radius
        ]);
      }

      if (
        triangleNormal(
          [spec.center[0], y, spec.center[2]],
          points[0],
          points[1]
        )[1] < 0
      ) {
        points.reverse();
      }

      return points;
    }

    return points;
  }

  function lineSegmentIntersection2D(
    rayOrigin,
    rayDirection,
    a,
    b
  ) {
    const rx =
      rayDirection[0];

    const rz =
      rayDirection[1];

    const sx =
      b[0] -
      a[0];

    const sz =
      b[1] -
      a[1];

    const denominator =
      rx * sz -
      rz * sx;

    if (
      Math.abs(denominator) <
      1e-8
    ) {
      return null;
    }

    const qpx =
      a[0] -
      rayOrigin[0];

    const qpz =
      a[1] -
      rayOrigin[1];

    const t =
      (
        qpx * sz -
        qpz * sx
      ) /
      denominator;

    const u =
      (
        qpx * rz -
        qpz * rx
      ) /
      denominator;

    if (
      t >= 0 &&
      u >= 0 &&
      u <= 1
    ) {
      return t;
    }

    return null;
  }

  function boundaryAnchor(
    platform,
    targetCenter
  ) {
    const center = [
      platform.spec.center[0],
      platform.spec.center[2]
    ];

    const directionRaw = [
      targetCenter[0] -
        center[0],

      targetCenter[2] -
        center[1]
    ];

    const length =
      Math.hypot(
        directionRaw[0],
        directionRaw[1]
      ) || 1;

    const direction = [
      directionRaw[0] / length,
      directionRaw[1] / length
    ];

    let nearest = Infinity;

    for (
      let index = 0;
      index < platform.topPolygon.length;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        platform.topPolygon.length;

      const a = [
        platform.topPolygon[index][0],
        platform.topPolygon[index][2]
      ];

      const b = [
        platform.topPolygon[next][0],
        platform.topPolygon[next][2]
      ];

      const distance =
        lineSegmentIntersection2D(
          center,
          direction,
          a,
          b
        );

      if (
        Number.isFinite(distance) &&
        distance < nearest
      ) {
        nearest = distance;
      }
    }

    if (!Number.isFinite(nearest)) {
      nearest = 0;
    }

    const inset =
      Math.max(
        0,
        nearest - 0.08
      );

    return [
      center[0] +
        direction[0] *
        inset,

      platform.spec.topY +
        0.02,

      center[1] +
        direction[1] *
        inset
    ];
  }

  function buildEstateGeometry() {
    const positions = [];
    const normals = [];
    const colors = [];
    const materialRegionIndices = [];
    const objectIndices = [];
    const revealGroupIndices = [];
    const surfaceRoleIndices = [];
    const triangleIndices = [];

    const linePositions = [];
    const lineClassIndices = [];
    const lineRevealGroupIndices = [];
    const lineObjectIndices = [];

    const platforms = [];
    const corridors = [];
    const sceneNodes = [];
    const pickVolumes = [];
    const labelAnchors = [];
    const surfaceRanges = [];
    const lineRanges = [];
    const triangleRecords = [];
    const graph = new Map();

    const platformById = new Map();
    const corridorById = new Map();
    const nodeById = new Map();

    let triangleCounter = 0;
    let lineSegmentCounter = 0;

    function addGraphNode(id) {
      if (!graph.has(id)) {
        graph.set(id, []);
      }
    }

    function addTriangle(
      a,
      b,
      c,
      materialId,
      objectIndex,
      revealGroup,
      surfaceRole,
      objectId
    ) {
      const normal =
        triangleNormal(
          a,
          b,
          c
        );

      const materialIndex =
        MATERIAL_INDEX[materialId];

      const color =
        getMaterialColor(
          materialId
        );

      const start =
        positions.length /
        3;

      for (const point of [a, b, c]) {
        positions.push(
          point[0],
          point[1],
          point[2]
        );

        normals.push(
          normal[0],
          normal[1],
          normal[2]
        );

        colors.push(
          color[0],
          color[1],
          color[2]
        );

        materialRegionIndices.push(
          materialIndex
        );

        objectIndices.push(
          objectIndex
        );

        revealGroupIndices.push(
          revealGroup
        );

        surfaceRoleIndices.push(
          surfaceRole
        );

        triangleIndices.push(
          triangleCounter
        );
      }

      const center = [
        (
          a[0] +
          b[0] +
          c[0]
        ) / 3,

        (
          a[1] +
          b[1] +
          c[1]
        ) / 3,

        (
          a[2] +
          b[2] +
          c[2]
        ) / 3
      ];

      triangleRecords.push(
        Object.freeze({
          id:
            `ESTATE-TRI-${String(
              triangleCounter
            ).padStart(4, "0")}`,
          triangleIndex:
            triangleCounter,
          objectId,
          materialId,
          revealGroup,
          surfaceRole,
          start,
          center,
          normal
        })
      );

      triangleCounter += 1;
    }

    function addLine(
      a,
      b,
      classIndex,
      revealGroup,
      objectIndex,
      objectId,
      rangeRole
    ) {
      const start =
        linePositions.length /
        3;

      linePositions.push(
        a[0],
        a[1],
        a[2],
        b[0],
        b[1],
        b[2]
      );

      lineClassIndices.push(
        classIndex,
        classIndex
      );

      lineRevealGroupIndices.push(
        revealGroup,
        revealGroup
      );

      lineObjectIndices.push(
        objectIndex,
        objectIndex
      );

      lineRanges.push(
        Object.freeze({
          objectId,
          role: rangeRole,
          classIndex,
          revealGroup,
          start,
          count: 2
        })
      );

      lineSegmentCounter += 1;
    }

    PLATFORM_SPECS.forEach(
      (spec, objectIndex) => {
        const topPolygon =
          createPlatformPolygon(
            spec,
            spec.topY
          );

        const bottomPolygon =
          createPlatformPolygon(
            spec,
            spec.bottomY
          );

        const start =
          positions.length /
          3;

        const topCenter = [
          spec.center[0],
          spec.topY,
          spec.center[2]
        ];

        const bottomCenter = [
          spec.center[0],
          spec.bottomY,
          spec.center[2]
        ];

        for (
          let index = 0;
          index < topPolygon.length;
          index += 1
        ) {
          const next =
            (
              index + 1
            ) %
            topPolygon.length;

          addTriangle(
            topCenter,
            topPolygon[index],
            topPolygon[next],
            spec.material,
            objectIndex,
            spec.revealGroup,
            0,
            spec.id
          );
        }

        for (
          let index = 0;
          index < bottomPolygon.length;
          index += 1
        ) {
          const next =
            (
              index + 1
            ) %
            bottomPolygon.length;

          addTriangle(
            bottomCenter,
            bottomPolygon[next],
            bottomPolygon[index],
            spec.material,
            objectIndex,
            spec.revealGroup,
            1,
            spec.id
          );
        }

        for (
          let index = 0;
          index < topPolygon.length;
          index += 1
        ) {
          const next =
            (
              index + 1
            ) %
            topPolygon.length;

          addTriangle(
            topPolygon[index],
            bottomPolygon[index],
            bottomPolygon[next],
            spec.material,
            objectIndex,
            spec.revealGroup,
            2,
            spec.id
          );

          addTriangle(
            topPolygon[index],
            bottomPolygon[next],
            topPolygon[next],
            spec.material,
            objectIndex,
            spec.revealGroup,
            2,
            spec.id
          );
        }

        const count =
          positions.length /
          3 -
          start;

        const platform =
          {
            id: spec.id,
            spec,
            objectIndex,
            topPolygon,
            bottomPolygon,
            start,
            count
          };

        platforms.push(platform);
        platformById.set(
          spec.id,
          platform
        );

        surfaceRanges.push(
          Object.freeze({
            objectId: spec.id,
            role: "platform",
            revealGroup:
              spec.revealGroup,
            start,
            count,
            materialId:
              spec.material
          })
        );

        for (
          let index = 0;
          index < topPolygon.length;
          index += 1
        ) {
          const next =
            (
              index + 1
            ) %
            topPolygon.length;

          addLine(
            topPolygon[index],
            topPolygon[next],
            spec.id ===
            "ESTATE_FOUNDATION"
              ? LINE_CLASS.foundation
              : LINE_CLASS.platformPerimeter,
            spec.revealGroup,
            objectIndex,
            spec.id,
            "platform-perimeter"
          );

          addLine(
            topPolygon[index],
            bottomPolygon[index],
            LINE_CLASS.platformVertical,
            spec.revealGroup,
            objectIndex,
            spec.id,
            "platform-vertical"
          );
        }

        if (
          spec.id !==
          "ESTATE_FOUNDATION"
        ) {
          const node =
            {
              id: spec.id,
              role: spec.role,
              zoneId:
                spec.zoneId ||
                null,
              revealGroup:
                spec.revealGroup,
              revealOnSelect:
                Number.isInteger(
                  spec.revealOnSelect
                )
                  ? spec.revealOnSelect
                  : null,
              center:
                spec.center.slice(),
              topY:
                spec.topY,
              bottomY:
                spec.bottomY,
              shape:
                spec.shape,
              selectable:
                Boolean(
                  spec.selectable
                ),
              pickable:
                false,
              pickPriority:
                Number(
                  spec.pickPriority
                ) || 40,
              parentNodeId:
                PARENT_NODE[
                  spec.id
                ] ||
                null,
              route:
                null,
              bound:
                false,
              platform
            };

          sceneNodes.push(node);
          nodeById.set(
            node.id,
            node
          );

          const anchor = [
            spec.center[0],
            spec.topY +
              (
                Number(
                  spec.labelOffset
                ) || 0.52
              ),
            spec.center[2]
          ];

          labelAnchors.push(
            Object.freeze({
              nodeId:
                spec.id,
              position:
                anchor,
              revealGroup:
                spec.revealGroup
            })
          );

          let pickVolume;

          if (
            spec.shape ===
            "hexagon"
          ) {
            pickVolume =
              Object.freeze({
                nodeId:
                  spec.id,
                type:
                  "cylinder",
                center:
                  [
                    spec.center[0],
                    (
                      spec.topY +
                      spec.bottomY
                    ) / 2,
                    spec.center[2]
                  ],
                radius:
                  spec.radius *
                  0.86,
                minimumY:
                  spec.topY -
                  0.06,
                maximumY:
                  spec.topY +
                  0.62,
                rotation:
                  spec.rotation || 0,
                priority:
                  node.pickPriority
              });
          } else {
            const halfWidth =
              spec.halfWidth ||
              spec.radius ||
              0.60;

            const halfDepth =
              spec.halfDepth ||
              spec.radius ||
              0.60;

            pickVolume =
              Object.freeze({
                nodeId:
                  spec.id,
                type:
                  "obb",
                center:
                  [
                    spec.center[0],
                    (
                      spec.topY +
                      spec.bottomY
                    ) / 2,
                    spec.center[2]
                  ],
                halfWidth:
                  halfWidth *
                  0.88,
                halfDepth:
                  halfDepth *
                  0.88,
                minimumY:
                  spec.topY -
                  0.06,
                maximumY:
                  spec.topY +
                  0.62,
                rotation:
                  spec.rotation || 0,
                priority:
                  node.pickPriority
              });
          }

          pickVolumes.push(
            pickVolume
          );

          addGraphNode(
            spec.id
          );
        }
      }
    );

    CORRIDOR_SPECS.forEach(
      (spec, corridorIndex) => {
        const source =
          platformById.get(
            spec.source
          );

        const target =
          platformById.get(
            spec.target
          );

        if (!source || !target) {
          throw new Error(
            `Corridor ${spec.id} references a missing platform.`
          );
        }

        const startCenter =
          boundaryAnchor(
            source,
            target.spec.center
          );

        const endCenter =
          boundaryAnchor(
            target,
            source.spec.center
          );

        const directionRaw = [
          endCenter[0] -
            startCenter[0],
          endCenter[2] -
            startCenter[2]
        ];

        const length =
          Math.hypot(
            directionRaw[0],
            directionRaw[1]
          ) || 1;

        const direction = [
          directionRaw[0] /
            length,
          directionRaw[1] /
            length
        ];

        const perpendicular = [
          -direction[1],
          direction[0]
        ];

        const halfWidth =
          spec.width /
          2;

        const startLeft = [
          startCenter[0] +
            perpendicular[0] *
            halfWidth,
          startCenter[1],
          startCenter[2] +
            perpendicular[1] *
            halfWidth
        ];

        const startRight = [
          startCenter[0] -
            perpendicular[0] *
            halfWidth,
          startCenter[1],
          startCenter[2] -
            perpendicular[1] *
            halfWidth
        ];

        const endLeft = [
          endCenter[0] +
            perpendicular[0] *
            halfWidth,
          endCenter[1],
          endCenter[2] +
            perpendicular[1] *
            halfWidth
        ];

        const endRight = [
          endCenter[0] -
            perpendicular[0] *
            halfWidth,
          endCenter[1],
          endCenter[2] -
            perpendicular[1] *
            halfWidth
        ];

        const startLeftBottom = [
          startLeft[0],
          startLeft[1] -
            spec.thickness,
          startLeft[2]
        ];

        const startRightBottom = [
          startRight[0],
          startRight[1] -
            spec.thickness,
          startRight[2]
        ];

        const endLeftBottom = [
          endLeft[0],
          endLeft[1] -
            spec.thickness,
          endLeft[2]
        ];

        const endRightBottom = [
          endRight[0],
          endRight[1] -
            spec.thickness,
          endRight[2]
        ];

        const objectIndex =
          PLATFORM_SPECS.length +
          corridorIndex;

        const start =
          positions.length /
          3;

        addTriangle(
          startLeft,
          startRight,
          endRight,
          spec.material,
          objectIndex,
          spec.revealGroup,
          3,
          spec.id
        );

        addTriangle(
          startLeft,
          endRight,
          endLeft,
          spec.material,
          objectIndex,
          spec.revealGroup,
          3,
          spec.id
        );

        addTriangle(
          startLeftBottom,
          endRightBottom,
          startRightBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          4,
          spec.id
        );

        addTriangle(
          startLeftBottom,
          endLeftBottom,
          endRightBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          4,
          spec.id
        );

        addTriangle(
          startLeft,
          endLeft,
          endLeftBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          5,
          spec.id
        );

        addTriangle(
          startLeft,
          endLeftBottom,
          startLeftBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          5,
          spec.id
        );

        addTriangle(
          startRight,
          endRightBottom,
          endRight,
          spec.material,
          objectIndex,
          spec.revealGroup,
          5,
          spec.id
        );

        addTriangle(
          startRight,
          startRightBottom,
          endRightBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          5,
          spec.id
        );

        addTriangle(
          startLeft,
          startLeftBottom,
          startRightBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          6,
          spec.id
        );

        addTriangle(
          startLeft,
          startRightBottom,
          startRight,
          spec.material,
          objectIndex,
          spec.revealGroup,
          6,
          spec.id
        );

        addTriangle(
          endLeft,
          endRightBottom,
          endLeftBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          6,
          spec.id
        );

        addTriangle(
          endLeft,
          endRight,
          endRightBottom,
          spec.material,
          objectIndex,
          spec.revealGroup,
          6,
          spec.id
        );

        const count =
          positions.length /
          3 -
          start;

        const corridor =
          {
            id: spec.id,
            spec,
            source:
              spec.source,
            target:
              spec.target,
            startCenter,
            endCenter,
            start,
            count,
            objectIndex
          };

        corridors.push(corridor);
        corridorById.set(
          spec.id,
          corridor
        );

        surfaceRanges.push(
          Object.freeze({
            objectId:
              spec.id,
            role:
              "corridor",
            revealGroup:
              spec.revealGroup,
            start,
            count,
            materialId:
              spec.material,
            source:
              spec.source,
            target:
              spec.target
          })
        );

        addLine(
          startLeft,
          endLeft,
          LINE_CLASS.corridorRail,
          spec.revealGroup,
          objectIndex,
          spec.id,
          "corridor-rail"
        );

        addLine(
          startRight,
          endRight,
          LINE_CLASS.corridorRail,
          spec.revealGroup,
          objectIndex,
          spec.id,
          "corridor-rail"
        );

        const centerLineClass =
          spec.className ===
          "return-circulation"
            ? LINE_CLASS.returnRoute
            : LINE_CLASS.primaryRoute;

        addLine(
          startCenter,
          endCenter,
          centerLineClass,
          spec.revealGroup,
          objectIndex,
          spec.id,
          "corridor-centerline"
        );

        addGraphNode(
          spec.source
        );

        addGraphNode(
          spec.target
        );

        graph.get(
          spec.source
        ).push(
          Object.freeze({
            nodeId:
              spec.target,
            corridorId:
              spec.id,
            weight:
              spec.weight
          })
        );

        graph.get(
          spec.target
        ).push(
          Object.freeze({
            nodeId:
              spec.source,
            corridorId:
              spec.id,
            weight:
              spec.weight
          })
        );
      }
    );

    const geometry = {
      contract:
        GEOMETRY_CONTRACT,

      ready:
        true,

      coordinateSystem:
        "right-handed-y-up",

      bounds:
        Object.freeze({
          minimum:
            Object.freeze([
              -6.80,
              -0.72,
              -6.80
            ]),
          maximum:
            Object.freeze([
              6.80,
              1.76,
              6.80
            ]),
          center:
            Object.freeze([
              0.0,
              0.52,
              0.0
            ]),
          radius:
            9.75
        }),

      materials:
        MATERIALS,

      positions:
        new Float32Array(
          positions
        ),

      normals:
        new Float32Array(
          normals
        ),

      colors:
        new Float32Array(
          colors
        ),

      materialRegionIndices:
        new Uint8Array(
          materialRegionIndices
        ),

      objectIndices:
        new Uint16Array(
          objectIndices
        ),

      revealGroupIndices:
        new Uint8Array(
          revealGroupIndices
        ),

      surfaceRoleIndices:
        new Uint8Array(
          surfaceRoleIndices
        ),

      triangleIndices:
        new Uint16Array(
          triangleIndices
        ),

      linePositions:
        new Float32Array(
          linePositions
        ),

      lineClassIndices:
        new Uint8Array(
          lineClassIndices
        ),

      lineRevealGroupIndices:
        new Uint8Array(
          lineRevealGroupIndices
        ),

      lineObjectIndices:
        new Uint16Array(
          lineObjectIndices
        ),

      platforms,
      corridors,
      sceneNodes,
      pickVolumes,
      labelAnchors,
      surfaceRanges,
      lineRanges,
      triangleRecords,
      graph,
      platformById,
      corridorById,
      nodeById,

      platformCount:
        platforms.length,

      corridorCount:
        corridors.length,

      sceneNodeCount:
        sceneNodes.length,

      surfaceTriangleCount:
        triangleRecords.length,

      surfaceVertexCount:
        positions.length /
        3,

      structuralLineSegmentCount:
        lineSegmentCounter,

      validate() {
        return validateGeometry(
          geometry
        );
      },

      getReceipt() {
        const validation =
          validateGeometry(
            geometry
          );

        return Object.freeze({
          contract:
            GEOMETRY_CONTRACT,
          status:
            validation.passed
              ? "READY"
              : "BLOCKED",
          coordinateSystem:
            geometry.coordinateSystem,
          platformCount:
            geometry.platformCount,
          corridorCount:
            geometry.corridorCount,
          sceneNodeCount:
            geometry.sceneNodeCount,
          surfaceTriangleCount:
            geometry.surfaceTriangleCount,
          surfaceVertexCount:
            geometry.surfaceVertexCount,
          structuralLineSegmentCount:
            geometry.structuralLineSegmentCount,
          materialRegionCount:
            geometry.materials.length,
          bounds:
            geometry.bounds,
          passed:
            validation.passed,
          checks:
            validation.checks
        });
      }
    };

    return geometry;
  }

  function validateGeometry(geometry) {
    const checks = [];

    function check(
      id,
      passed,
      expected,
      actual
    ) {
      checks.push(
        Object.freeze({
          id,
          passed:
            Boolean(passed),
          expected,
          actual
        })
      );
    }

    check(
      "platform-count",
      geometry.platformCount ===
        EXPECTED.platformCount,
      EXPECTED.platformCount,
      geometry.platformCount
    );

    check(
      "corridor-count",
      geometry.corridorCount ===
        EXPECTED.corridorCount,
      EXPECTED.corridorCount,
      geometry.corridorCount
    );

    check(
      "surface-triangle-count",
      geometry.surfaceTriangleCount ===
        EXPECTED.surfaceTriangleCount,
      EXPECTED.surfaceTriangleCount,
      geometry.surfaceTriangleCount
    );

    check(
      "surface-vertex-count",
      geometry.surfaceVertexCount ===
        EXPECTED.surfaceVertexCount,
      EXPECTED.surfaceVertexCount,
      geometry.surfaceVertexCount
    );

    check(
      "structural-line-segment-count",
      geometry.structuralLineSegmentCount ===
        EXPECTED.structuralLineSegmentCount,
      EXPECTED.structuralLineSegmentCount,
      geometry.structuralLineSegmentCount
    );

    check(
      "scene-node-count",
      geometry.sceneNodeCount ===
        EXPECTED.sceneNodeCount,
      EXPECTED.sceneNodeCount,
      geometry.sceneNodeCount
    );

    check(
      "material-region-count",
      geometry.materials.length ===
        EXPECTED.materialRegionCount,
      EXPECTED.materialRegionCount,
      geometry.materials.length
    );

    const finitePositions =
      Array.from(
        geometry.positions
      ).every(Number.isFinite);

    check(
      "finite-surface-positions",
      finitePositions,
      true,
      finitePositions
    );

    const finiteNormals =
      Array.from(
        geometry.normals
      ).every(Number.isFinite);

    check(
      "finite-surface-normals",
      finiteNormals,
      true,
      finiteNormals
    );

    let unitNormals = true;

    for (
      let index = 0;
      index < geometry.normals.length;
      index += 3
    ) {
      const length =
        Math.hypot(
          geometry.normals[index],
          geometry.normals[index + 1],
          geometry.normals[index + 2]
        );

      if (
        Math.abs(
          length - 1
        ) >
        0.002
      ) {
        unitNormals = false;
        break;
      }
    }

    check(
      "unit-surface-normals",
      unitNormals,
      true,
      unitNormals
    );

    let nondegenerate = true;

    for (
      let index = 0;
      index < geometry.positions.length;
      index += 9
    ) {
      const a = [
        geometry.positions[index],
        geometry.positions[index + 1],
        geometry.positions[index + 2]
      ];

      const b = [
        geometry.positions[index + 3],
        geometry.positions[index + 4],
        geometry.positions[index + 5]
      ];

      const c = [
        geometry.positions[index + 6],
        geometry.positions[index + 7],
        geometry.positions[index + 8]
      ];

      const areaVector =
        crossVector(
          subtractVector(b, a),
          subtractVector(c, a)
        );

      if (
        Math.hypot(
          areaVector[0],
          areaVector[1],
          areaVector[2]
        ) <
        1e-7
      ) {
        nondegenerate = false;
        break;
      }
    }

    check(
      "nondegenerate-triangles",
      nondegenerate,
      true,
      nondegenerate
    );

    const platformIds =
      geometry.platforms.map(
        item => item.id
      );

    check(
      "unique-platform-ids",
      new Set(
        platformIds
      ).size ===
        platformIds.length,
      platformIds.length,
      new Set(
        platformIds
      ).size
    );

    const corridorIds =
      geometry.corridors.map(
        item => item.id
      );

    check(
      "unique-corridor-ids",
      new Set(
        corridorIds
      ).size ===
        corridorIds.length,
      corridorIds.length,
      new Set(
        corridorIds
      ).size
    );

    const nodeIds =
      geometry.sceneNodes.map(
        item => item.id
      );

    check(
      "unique-scene-node-ids",
      new Set(
        nodeIds
      ).size ===
        nodeIds.length,
      nodeIds.length,
      new Set(
        nodeIds
      ).size
    );

    let boundsValid = true;

    for (
      let index = 0;
      index < geometry.positions.length;
      index += 3
    ) {
      const x =
        geometry.positions[index];

      const y =
        geometry.positions[index + 1];

      const z =
        geometry.positions[index + 2];

      if (
        Math.abs(x) +
          Math.abs(z) >
          6.82 ||
        y < -0.72 ||
        y > 1.78
      ) {
        boundsValid = false;
        break;
      }
    }

    check(
      "bounds-valid",
      boundsValid,
      true,
      boundsValid
    );

    const passed =
      checks.every(
        item => item.passed
      );

    return Object.freeze({
      contract:
        GEOMETRY_CONTRACT,
      passed,
      checks,
      passCount:
        checks.filter(
          item => item.passed
        ).length,
      failCount:
        checks.filter(
          item => !item.passed
        ).length
    });
  }

  function createProgramsAndBuffers() {
    const gl = state.gl;
    const geometry = state.geometry;

    const surfaceVertexShader = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec3 aColor;

      uniform mat4 uView;
      uniform mat4 uProjection;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec3 vColor;

      void main(void) {
        vWorldPosition = aPosition;
        vNormal = normalize(aNormal);
        vColor = aColor;

        gl_Position =
          uProjection *
          uView *
          vec4(aPosition, 1.0);
      }
    `;

    const surfaceFragmentShader = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec3 vColor;

      uniform vec3 uCameraPosition;
      uniform float uState;
      uniform float uAlpha;
      uniform float uStructureMix;

      void main(void) {
        vec3 normal = normalize(vNormal);

        if (!gl_FrontFacing) {
          normal = -normal;
        }

        vec3 viewDirection =
          normalize(
            uCameraPosition -
            vWorldPosition
          );

        vec3 warmDirection =
          normalize(
            vec3(-3.6, 5.8, 5.2) -
            vWorldPosition
          );

        vec3 coolDirection =
          normalize(
            vec3(4.4, 3.0, -3.8) -
            vWorldPosition
          );

        float warm =
          max(
            dot(
              normal,
              warmDirection
            ),
            0.0
          );

        float cool =
          max(
            dot(
              normal,
              coolDirection
            ),
            0.0
          );

        float facing =
          clamp(
            dot(
              normal,
              viewDirection
            ),
            0.0,
            1.0
          );

        float fresnel =
          pow(
            1.0 -
            facing,
            2.0
          );

        vec3 color =
          vColor *
          (
            0.30 +
            warm *
            0.62 +
            cool *
            0.30
          );

        color +=
          vec3(
            0.11,
            0.25,
            0.38
          ) *
          fresnel *
          (
            0.18 +
            uStructureMix *
            0.26
          );

        if (uState > 2.5) {
          color =
            mix(
              color,
              vec3(
                1.0,
                0.91,
                0.53
              ),
              0.74
            );
        } else if (uState > 1.5) {
          color =
            mix(
              color,
              vec3(
                0.82,
                0.97,
                1.0
              ),
              0.66
            );
        } else if (uState > 0.5) {
          color =
            mix(
              color,
              vec3(
                0.32,
                1.0,
                0.78
              ),
              0.48
            );
        }

        color =
          color /
          (
            vec3(1.0) +
            color *
            0.34
          );

        color =
          pow(
            max(
              color,
              vec3(0.0)
            ),
            vec3(
              1.0 / 2.2
            )
          );

        gl_FragColor =
          vec4(
            color,
            uAlpha
          );
      }
    `;

    const lineVertexShader = `
      attribute vec3 aPosition;

      uniform mat4 uView;
      uniform mat4 uProjection;

      void main(void) {
        gl_Position =
          uProjection *
          uView *
          vec4(aPosition, 1.0);
      }
    `;

    const lineFragmentShader = `
      precision mediump float;

      uniform vec3 uColor;
      uniform float uAlpha;

      void main(void) {
        gl_FragColor =
          vec4(
            uColor,
            uAlpha
          );
      }
    `;

    const shadowVertexShader = `
      attribute vec3 aPosition;

      uniform mat4 uView;
      uniform mat4 uProjection;

      void main(void) {
        gl_Position =
          uProjection *
          uView *
          vec4(aPosition, 1.0);
      }
    `;

    const shadowFragmentShader = `
      precision mediump float;

      uniform float uAlpha;

      void main(void) {
        gl_FragColor =
          vec4(
            0.005,
            0.008,
            0.018,
            uAlpha
          );
      }
    `;

    const surfaceProgram =
      createProgram(
        surfaceVertexShader,
        surfaceFragmentShader
      );

    const lineProgram =
      createProgram(
        lineVertexShader,
        lineFragmentShader
      );

    const shadowProgram =
      createProgram(
        shadowVertexShader,
        shadowFragmentShader
      );

    state.programs = {
      surface:
        surfaceProgram,
      line:
        lineProgram,
      shadow:
        shadowProgram
    };

    const shadowPositions =
      new Float32Array([
        0.0, -0.735, 6.45,
        -6.45, -0.735, 0.0,
        0.0, -0.735, -6.45,

        0.0, -0.735, 6.45,
        0.0, -0.735, -6.45,
        6.45, -0.735, 0.0
      ]);

    const guidePositions =
      new Float32Array([
        0.0, 0.76, 0.85,
        0.0, 1.62, 0.85,

        -0.12, 1.50, 0.85,
        0.0, 1.62, 0.85,

        0.12, 1.50, 0.85,
        0.0, 1.62, 0.85,

        0.0, 1.62, 0.85,
        0.0, 1.52, 0.73
      ]);

    state.buffers = {
      surfacePosition:
        createBuffer(
          gl.ARRAY_BUFFER,
          geometry.positions
        ),

      surfaceNormal:
        createBuffer(
          gl.ARRAY_BUFFER,
          geometry.normals
        ),

      surfaceColor:
        createBuffer(
          gl.ARRAY_BUFFER,
          geometry.colors
        ),

      linePosition:
        createBuffer(
          gl.ARRAY_BUFFER,
          geometry.linePositions
        ),

      shadowPosition:
        createBuffer(
          gl.ARRAY_BUFFER,
          shadowPositions
        ),

      guidePosition:
        createBuffer(
          gl.ARRAY_BUFFER,
          guidePositions
        ),

      shadowVertexCount:
        shadowPositions.length /
        3,

      guideVertexCount:
        guidePositions.length /
        3
    };

    state.locations = {
      surface: {
        position:
          gl.getAttribLocation(
            surfaceProgram,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            surfaceProgram,
            "aNormal"
          ),

        color:
          gl.getAttribLocation(
            surfaceProgram,
            "aColor"
          ),

        view:
          gl.getUniformLocation(
            surfaceProgram,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            surfaceProgram,
            "uProjection"
          ),

        camera:
          gl.getUniformLocation(
            surfaceProgram,
            "uCameraPosition"
          ),

        state:
          gl.getUniformLocation(
            surfaceProgram,
            "uState"
          ),

        alpha:
          gl.getUniformLocation(
            surfaceProgram,
            "uAlpha"
          ),

        structureMix:
          gl.getUniformLocation(
            surfaceProgram,
            "uStructureMix"
          )
      },

      line: {
        position:
          gl.getAttribLocation(
            lineProgram,
            "aPosition"
          ),

        view:
          gl.getUniformLocation(
            lineProgram,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            lineProgram,
            "uProjection"
          ),

        color:
          gl.getUniformLocation(
            lineProgram,
            "uColor"
          ),

        alpha:
          gl.getUniformLocation(
            lineProgram,
            "uAlpha"
          )
      },

      shadow: {
        position:
          gl.getAttribLocation(
            shadowProgram,
            "aPosition"
          ),

        view:
          gl.getUniformLocation(
            shadowProgram,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            shadowProgram,
            "uProjection"
          ),

        alpha:
          gl.getUniformLocation(
            shadowProgram,
            "uAlpha"
          )
      }
    };
  }

  function compileShader(
    type,
    source
  ) {
    const gl = state.gl;
    const shader =
      gl.createShader(type);

    if (!shader) {
      throw new Error(
        "Unable to create WebGL shader."
      );
    }

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(
      shader
    );

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const message =
        gl.getShaderInfoLog(
          shader
        ) ||
        "Shader compilation failed.";

      gl.deleteShader(
        shader
      );

      throw new Error(
        message
      );
    }

    return shader;
  }

  function createProgram(
    vertexSource,
    fragmentSource
  ) {
    const gl = state.gl;

    const vertexShader =
      compileShader(
        gl.VERTEX_SHADER,
        vertexSource
      );

    const fragmentShader =
      compileShader(
        gl.FRAGMENT_SHADER,
        fragmentSource
      );

    const program =
      gl.createProgram();

    if (!program) {
      throw new Error(
        "Unable to create WebGL program."
      );
    }

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertexShader
    );

    gl.deleteShader(
      fragmentShader
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const message =
        gl.getProgramInfoLog(
          program
        ) ||
        "Program linking failed.";

      gl.deleteProgram(
        program
      );

      throw new Error(
        message
      );
    }

    return program;
  }

  function createBuffer(
    target,
    data,
    usage
  ) {
    const gl = state.gl;
    const buffer =
      gl.createBuffer();

    if (!buffer) {
      throw new Error(
        "Unable to create WebGL buffer."
      );
    }

    gl.bindBuffer(
      target,
      buffer
    );

    gl.bufferData(
      target,
      data,
      usage ||
        gl.STATIC_DRAW
    );

    return buffer;
  }

  function bindFloatAttribute(
    buffer,
    location,
    size
  ) {
    const gl = state.gl;

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.enableVertexAttribArray(
      location
    );

    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function createContext() {
    const options = {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference:
        "high-performance"
    };

    state.gl =
      state.canvas.getContext(
        "webgl",
        options
      ) ||
      state.canvas.getContext(
        "experimental-webgl",
        options
      );

    if (!state.gl) {
      throw new Error(
        "Native WebGL is unavailable."
      );
    }

    state.gl.clearColor(
      0,
      0,
      0,
      0
    );

    state.gl.enable(
      state.gl.DEPTH_TEST
    );

    state.gl.depthFunc(
      state.gl.LEQUAL
    );

    state.gl.enable(
      state.gl.BLEND
    );

    state.gl.blendFunc(
      state.gl.SRC_ALPHA,
      state.gl.ONE_MINUS_SRC_ALPHA
    );
  }

  function ensureRenderer() {
    if (
      state.webglReady &&
      state.gl &&
      !state.contextLost
    ) {
      return true;
    }

    if (
      !state.geometryReady ||
      !state.canvas
    ) {
      return false;
    }

    try {
      createContext();
      createProgramsAndBuffers();
      setupRendererObservers();
      setupContextEvents();

      state.webglReady = true;
      state.contextLost = false;

      setFallbackActive(
        false,
        "none"
      );

      resizeCanvas();
      updateMatrices();
      renderScene();

      publishState(
        "renderer-ready",
        true
      );

      return true;
    } catch (error) {
      recordError(
        "renderer-initialize",
        error
      );

      setFallbackActive(
        true,
        "webgl-unavailable"
      );

      return false;
    }
  }

  function disposeProgramsAndBuffers() {
    if (!state.gl) {
      state.programs = null;
      state.buffers = null;
      state.locations = null;
      return;
    }

    const gl = state.gl;

    if (state.programs) {
      for (
        const program of
        Object.values(
          state.programs
        )
      ) {
        if (program) {
          try {
            gl.deleteProgram(
              program
            );
          } catch (_error) {}
        }
      }
    }

    if (state.buffers) {
      for (
        const [key, buffer] of
        Object.entries(
          state.buffers
        )
      ) {
        if (
          key.endsWith(
            "Count"
          ) ||
          typeof buffer ===
            "number"
        ) {
          continue;
        }

        if (buffer) {
          try {
            gl.deleteBuffer(
              buffer
            );
          } catch (_error) {}
        }
      }
    }

    state.programs = null;
    state.buffers = null;
    state.locations = null;
  }

  function updateMatrices() {
    const aspect =
      state.width /
      Math.max(
        state.height,
        1
      );

    perspective(
      state.projectionMatrix,
      INITIAL_CAMERA.fieldOfViewDegrees *
        Math.PI /
        180,
      aspect,
      INITIAL_CAMERA.near,
      INITIAL_CAMERA.far
    );

    const pitch =
      state.camera.pitch;

    const yaw =
      state.camera.yaw;

    const distance =
      state.camera.distance;

    const horizontal =
      Math.cos(
        pitch
      ) *
      distance;

    const eye = [
      state.camera.target[0] +
        Math.sin(yaw) *
        horizontal,

      state.camera.target[1] +
        Math.sin(pitch) *
        distance,

      state.camera.target[2] +
        Math.cos(yaw) *
        horizontal
    ];

    lookAt(
      state.viewMatrix,
      eye,
      state.camera.target,
      [0, 1, 0]
    );

    multiply(
      state.projectionViewMatrix,
      state.projectionMatrix,
      state.viewMatrix
    );

    invert(
      state.inverseProjectionViewMatrix,
      state.projectionViewMatrix
    );

    state.camera.eye = eye;
  }

  function resizeCanvas() {
    if (
      !state.canvas ||
      !state.gl
    ) {
      return;
    }

    const rectangle =
      state.stage.getBoundingClientRect();

    const ratioCap =
      mobileQuery.matches
        ? 1.65
        : 2.0;

    const ratio =
      Math.max(
        1,
        Math.min(
          ratioCap,
          root.devicePixelRatio ||
            1
        )
      );

    const cssWidth =
      Math.max(
        1,
        rectangle.width ||
          state.stage.clientWidth ||
          640
      );

    const cssHeight =
      Math.max(
        1,
        rectangle.height ||
          state.stage.clientHeight ||
          520
      );

    const width =
      Math.max(
        1,
        Math.round(
          cssWidth *
            ratio
        )
      );

    const height =
      Math.max(
        1,
        Math.round(
          cssHeight *
            ratio
        )
      );

    if (
      state.canvas.width !==
        width ||
      state.canvas.height !==
        height
    ) {
      state.canvas.width =
        width;

      state.canvas.height =
        height;

      state.resizeCount += 1;
    }

    state.width = width;
    state.height = height;
    state.cssWidth = cssWidth;
    state.cssHeight = cssHeight;
    state.dpr = ratio;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );

    updateMatrices();
  }

  function isNodeVisible(nodeId) {
    if (!state.geometry) {
      return false;
    }

    const node =
      state.geometry.nodeById.get(
        nodeId
      );

    if (!node) {
      return false;
    }

    if (
      state.visibleGroups.has(
        node.revealGroup
      )
    ) {
      return true;
    }

    if (
      nodeId ===
        state.currentNodeId ||
      nodeId ===
        state.selectedNodeId
    ) {
      return true;
    }

    let cursor =
      state.currentNodeId;

    while (cursor) {
      if (cursor === nodeId) {
        return true;
      }

      cursor =
        PARENT_NODE[cursor] ||
        null;
    }

    return false;
  }

  function isRangeVisible(range) {
    if (
      range.objectId ===
      "ESTATE_FOUNDATION"
    ) {
      return true;
    }

    if (
      range.role ===
      "platform"
    ) {
      return isNodeVisible(
        range.objectId
      );
    }

    if (
      range.role ===
      "corridor"
    ) {
      return (
        state.visibleGroups.has(
          range.revealGroup
        ) ||
        (
          isNodeVisible(
            range.source
          ) &&
          isNodeVisible(
            range.target
          )
        )
      );
    }

    return state.visibleGroups.has(
      range.revealGroup
    );
  }

  function surfaceStateForObject(
    objectId
  ) {
    if (
      objectId ===
      state.selectedNodeId
    ) {
      return 3;
    }

    if (
      objectId ===
      state.currentNodeId
    ) {
      return 2;
    }

    if (
      objectId ===
      state.focusedNodeId
    ) {
      return 1;
    }

    return 0;
  }

  function lineStyleForRange(range) {
    let color =
      [0.22, 0.70, 0.92];

    let alpha =
      state.estateView ===
      "structure"
        ? 0.74
        : 0.30;

    if (
      range.role ===
      "platform-perimeter"
    ) {
      color =
        [0.28, 0.82, 1.00];

      alpha =
        state.estateView ===
        "structure"
          ? 0.76
          : 0.30;
    }

    if (
      range.role ===
      "platform-vertical"
    ) {
      color =
        [0.18, 0.45, 0.82];

      alpha =
        state.estateView ===
        "structure"
          ? 0.55
          : 0.16;
    }

    if (
      range.role ===
      "corridor-rail"
    ) {
      color =
        [0.92, 0.67, 0.22];

      alpha =
        state.estateView ===
        "structure"
          ? 0.72
          : 0.28;
    }

    if (
      range.role ===
      "corridor-centerline"
    ) {
      color =
        range.classIndex ===
        LINE_CLASS.returnRoute
          ? [0.20, 0.74, 1.00]
          : [0.88, 0.60, 0.18];

      alpha =
        state.estateView ===
        "structure"
          ? 0.64
          : 0.20;

      if (
        state.currentPathCorridors.has(
          range.objectId
        )
      ) {
        color =
          [0.20, 1.00, 0.76];

        alpha = 0.92;
      }

      if (
        state.selectedPathCorridors.has(
          range.objectId
        )
      ) {
        color =
          [1.00, 0.90, 0.42];

        alpha = 1.00;
      }

      if (
        state.currentPathCorridors.has(
          range.objectId
        ) &&
        state.selectedPathCorridors.has(
          range.objectId
        )
      ) {
        color =
          [0.86, 1.00, 0.82];

        alpha = 1.00;
      }
    }

    if (
      range.objectId ===
      "ESTATE_FOUNDATION"
    ) {
      color =
        [0.18, 0.34, 0.58];

      alpha =
        state.estateView ===
        "structure"
          ? 0.58
          : 0.18;
    }

    return {
      color,
      alpha
    };
  }

  function drawShadow() {
    const gl = state.gl;
    const locations =
      state.locations.shadow;

    gl.useProgram(
      state.programs.shadow
    );

    bindFloatAttribute(
      state.buffers.shadowPosition,
      locations.position,
      3
    );

    gl.uniformMatrix4fv(
      locations.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      locations.projection,
      false,
      state.projectionMatrix
    );

    gl.uniform1f(
      locations.alpha,
      0.16
    );

    gl.disable(
      gl.DEPTH_TEST
    );

    gl.depthMask(
      false
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      state.buffers.shadowVertexCount
    );

    gl.depthMask(
      true
    );

    gl.enable(
      gl.DEPTH_TEST
    );
  }

  function drawSurfaces() {
    const gl = state.gl;
    const locations =
      state.locations.surface;

    gl.useProgram(
      state.programs.surface
    );

    bindFloatAttribute(
      state.buffers.surfacePosition,
      locations.position,
      3
    );

    bindFloatAttribute(
      state.buffers.surfaceNormal,
      locations.normal,
      3
    );

    bindFloatAttribute(
      state.buffers.surfaceColor,
      locations.color,
      3
    );

    gl.uniformMatrix4fv(
      locations.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      locations.projection,
      false,
      state.projectionMatrix
    );

    gl.uniform3fv(
      locations.camera,
      state.camera.eye
    );

    gl.uniform1f(
      locations.structureMix,
      state.estateView ===
        "structure"
        ? 1
        : 0
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    for (
      const range of
      state.geometry.surfaceRanges
    ) {
      if (
        !isRangeVisible(
          range
        )
      ) {
        continue;
      }

      const objectState =
        range.role ===
        "platform"
          ? surfaceStateForObject(
              range.objectId
            )
          : 0;

      let alpha =
        state.estateView ===
        "structure"
          ? 0.44
          : 0.94;

      if (
        range.objectId ===
        "ESTATE_FOUNDATION"
      ) {
        alpha =
          state.estateView ===
          "structure"
            ? 0.32
            : 0.74;
      }

      if (
        objectState >=
        2
      ) {
        alpha = 1.0;
      }

      gl.uniform1f(
        locations.state,
        objectState
      );

      gl.uniform1f(
        locations.alpha,
        alpha
      );

      gl.depthMask(
        alpha >= 0.80
      );

      gl.drawArrays(
        gl.TRIANGLES,
        range.start,
        range.count
      );
    }

    gl.depthMask(
      true
    );
  }

  function drawLines() {
    const gl = state.gl;
    const locations =
      state.locations.line;

    gl.useProgram(
      state.programs.line
    );

    bindFloatAttribute(
      state.buffers.linePosition,
      locations.position,
      3
    );

    gl.uniformMatrix4fv(
      locations.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      locations.projection,
      false,
      state.projectionMatrix
    );

    gl.depthMask(
      false
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE
    );

    for (
      const range of
      state.geometry.lineRanges
    ) {
      if (
        !isRangeVisible(
          range
        )
      ) {
        continue;
      }

      const style =
        lineStyleForRange(
          range
        );

      gl.uniform3fv(
        locations.color,
        style.color
      );

      gl.uniform1f(
        locations.alpha,
        style.alpha
      );

      gl.drawArrays(
        gl.LINES,
        range.start,
        range.count
      );
    }

    gl.depthMask(
      true
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );
  }

  function drawGuideBeacon() {
    const gl = state.gl;
    const locations =
      state.locations.line;

    gl.useProgram(
      state.programs.line
    );

    bindFloatAttribute(
      state.buffers.guidePosition,
      locations.position,
      3
    );

    gl.uniformMatrix4fv(
      locations.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      locations.projection,
      false,
      state.projectionMatrix
    );

    gl.uniform3fv(
      locations.color,
      [0.78, 0.95, 1.00]
    );

    gl.uniform1f(
      locations.alpha,
      0.88
    );

    gl.depthMask(
      false
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE
    );

    gl.drawArrays(
      gl.LINES,
      0,
      state.buffers.guideVertexCount
    );

    gl.depthMask(
      true
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );
  }

  function renderScene() {
    if (
      !state.webglReady ||
      state.contextLost ||
      !state.gl ||
      !state.overlayOpen ||
      state.activeLens !==
        "mirrorland"
    ) {
      return false;
    }

    resizeCanvas();
    updateMatrices();

    const gl = state.gl;

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    drawShadow();
    drawSurfaces();
    drawLines();
    drawGuideBeacon();
    updateProjectedLabels();

    state.renderCount += 1;

    return true;
  }

  function updateCameraTransition(time) {
    const transition =
      state.camera.transition;

    if (!transition) {
      return false;
    }

    const elapsed =
      time -
      transition.startedAt;

    const normalized =
      clamp(
        elapsed /
          transition.duration,
        0,
        1
      );

    const amount =
      easeOutCubic(
        normalized
      );

    state.camera.target = [
      lerp(
        transition.from.target[0],
        transition.to.target[0],
        amount
      ),
      lerp(
        transition.from.target[1],
        transition.to.target[1],
        amount
      ),
      lerp(
        transition.from.target[2],
        transition.to.target[2],
        amount
      )
    ];

    state.camera.yaw =
      lerp(
        transition.from.yaw,
        transition.to.yaw,
        amount
      );

    state.camera.pitch =
      lerp(
        transition.from.pitch,
        transition.to.pitch,
        amount
      );

    state.camera.distance =
      lerp(
        transition.from.distance,
        transition.to.distance,
        amount
      );

    if (normalized >= 1) {
      state.camera.transition = null;
      return false;
    }

    return true;
  }

  function frame(time) {
    if (
      !state.running ||
      state.disposed
    ) {
      state.raf = 0;
      return;
    }

    state.raf =
      root.requestAnimationFrame(
        frame
      );

    if (
      !state.overlayOpen ||
      state.activeLens !==
        "mirrorland" ||
      !state.stageVisible ||
      !state.documentVisible ||
      state.contextLost
    ) {
      state.lastFrameTime =
        time;
      return;
    }

    const previous =
      state.lastFrameTime ||
      time;

    const deltaSeconds =
      Math.min(
        0.05,
        Math.max(
          0,
          (
            time -
            previous
          ) /
            1000
        )
      );

    state.lastFrameTime =
      time;

    const transitioning =
      updateCameraTransition(
        time
      );

    const interacting =
      state.pointers.size >
      0;

    if (
      !interacting &&
      !transitioning
    ) {
      state.camera.yaw +=
        state.camera.velocityYaw *
        deltaSeconds *
        60;

      state.camera.pitch +=
        state.camera.velocityPitch *
        deltaSeconds *
        60;

      const damping =
        Math.pow(
          INITIAL_CAMERA.inertiaDamping,
          deltaSeconds *
            60
        );

      state.camera.velocityYaw *=
        damping;

      state.camera.velocityPitch *=
        damping;

      if (
        Math.abs(
          state.camera.velocityYaw
        ) <
        0.00002
      ) {
        state.camera.velocityYaw = 0;
      }

      if (
        Math.abs(
          state.camera.velocityPitch
        ) <
        0.00002
      ) {
        state.camera.velocityPitch = 0;
      }
    }

    state.camera.pitch =
      clamp(
        state.camera.pitch,
        INITIAL_CAMERA.pitchMinimum,
        INITIAL_CAMERA.pitchMaximum
      );

    state.camera.distance =
      clamp(
        state.camera.distance,
        INITIAL_CAMERA.distanceMinimum,
        INITIAL_CAMERA.distanceMaximum
      );

    renderScene();
  }

  function startRenderer() {
    if (
      !ensureRenderer() ||
      state.disposed ||
      state.contextLost
    ) {
      return false;
    }

    if (!state.running) {
      state.running = true;
      state.lastFrameTime = 0;
      state.raf =
        root.requestAnimationFrame(
          frame
        );
    }

    return true;
  }

  function stopRenderer() {
    state.running = false;

    if (state.raf) {
      root.cancelAnimationFrame(
        state.raf
      );

      state.raf = 0;
    }

    state.lastFrameTime = 0;
  }

  function setFallbackActive(
    active,
    reason
  ) {
    state.fallbackActive =
      Boolean(active);

    state.fallbackReason =
      reason || null;

    if (state.canvas) {
      state.canvas.hidden =
        Boolean(active);
    }

    if (state.fallback) {
      state.fallback.hidden =
        !active;
    }

    if (state.stage) {
      state.stage.dataset.webglState =
        active
          ? "fallback"
          : state.webglReady
            ? "ready"
            : "held";
    }

    if (active) {
      updateFallback();

      dispatch(
        EVENT_FALLBACK,
        Object.freeze({
          contract:
            CONTRACT,
          reason:
            reason ||
            "renderer-unavailable",
          status:
            publicStatus()
        })
      );
    }
  }

  function setupContextEvents() {
    if (
      !state.canvas ||
      state.canvas.dataset.contextEventsBound ===
        "true"
    ) {
      return;
    }

    state.canvas.dataset.contextEventsBound =
      "true";

    listen(
      state.canvas,
      "webglcontextlost",
      event => {
        event.preventDefault();

        state.contextLost = true;
        state.contextLossCount += 1;

        stopRenderer();

        setFallbackActive(
          true,
          "webgl-context-lost"
        );

        dispatch(
          EVENT_CONTEXT_LOST,
          Object.freeze({
            contract:
              CONTRACT,
            contextLossCount:
              state.contextLossCount,
            status:
              publicStatus()
          })
        );

        publishState(
          "context-lost",
          true
        );
      },
      {
        passive: false
      }
    );

    listen(
      state.canvas,
      "webglcontextrestored",
      () => {
        try {
          state.contextLost = false;
          state.webglReady = false;

          disposeProgramsAndBuffers();

          createContext();
          createProgramsAndBuffers();

          state.webglReady = true;

          resizeCanvas();

          setFallbackActive(
            false,
            "context-restored"
          );

          if (
            state.overlayOpen &&
            state.activeLens ===
              "mirrorland"
          ) {
            startRenderer();
          }

          publishState(
            "context-restored",
            true
          );
        } catch (error) {
          recordError(
            "context-restored",
            error
          );

          setFallbackActive(
            true,
            "context-restore-failed"
          );
        }
      }
    );
  }

  function setupRendererObservers() {
    if (
      state.resizeObserver ||
      !state.stage
    ) {
      return;
    }

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      state.resizeObserver =
        new ResizeObserver(
          () => {
            resizeCanvas();

            if (
              state.overlayOpen &&
              state.activeLens ===
                "mirrorland"
            ) {
              renderScene();
            }
          }
        );

      state.resizeObserver.observe(
        state.stage
      );
    }

    if (
      typeof IntersectionObserver !==
      "undefined"
    ) {
      state.intersectionObserver =
        new IntersectionObserver(
          entries => {
            state.stageVisible =
              entries.some(
                entry =>
                  entry.isIntersecting
              );
          },
          {
            rootMargin:
              "160px 0px"
          }
        );

      state.intersectionObserver.observe(
        state.stage
      );
    }
  }

  function rayCylinderIntersection(
    origin,
    direction,
    volume
  ) {
    const dx =
      origin[0] -
      volume.center[0];

    const dz =
      origin[2] -
      volume.center[2];

    const a =
      direction[0] *
        direction[0] +
      direction[2] *
        direction[2];

    if (
      Math.abs(a) <
      1e-9
    ) {
      return null;
    }

    const b =
      2 *
      (
        dx *
          direction[0] +
        dz *
          direction[2]
      );

    const c =
      dx *
        dx +
      dz *
        dz -
      volume.radius *
        volume.radius;

    const discriminant =
      b *
        b -
      4 *
        a *
        c;

    if (discriminant < 0) {
      return null;
    }

    const squareRoot =
      Math.sqrt(
        discriminant
      );

    const candidates = [
      (
        -b -
        squareRoot
      ) /
        (
          2 *
          a
        ),

      (
        -b +
        squareRoot
      ) /
        (
          2 *
          a
        )
    ].filter(
      value => value > 1e-7
    );

    for (
      const distance of
      candidates.sort(
        (left, right) =>
          left - right
      )
    ) {
      const y =
        origin[1] +
        direction[1] *
          distance;

      if (
        y >=
          volume.minimumY &&
        y <=
          volume.maximumY
      ) {
        return distance;
      }
    }

    return null;
  }

  function rayObbIntersection(
    origin,
    direction,
    volume
  ) {
    const rotation =
      -volume.rotation;

    const cosine =
      Math.cos(
        rotation
      );

    const sine =
      Math.sin(
        rotation
      );

    const originX =
      origin[0] -
      volume.center[0];

    const originZ =
      origin[2] -
      volume.center[2];

    const localOrigin = [
      originX *
        cosine -
        originZ *
          sine,

      origin[1],

      originX *
        sine +
        originZ *
          cosine
    ];

    const localDirection = [
      direction[0] *
        cosine -
        direction[2] *
          sine,

      direction[1],

      direction[0] *
        sine +
        direction[2] *
          cosine
    ];

    const minimum = [
      -volume.halfWidth,
      volume.minimumY,
      -volume.halfDepth
    ];

    const maximum = [
      volume.halfWidth,
      volume.maximumY,
      volume.halfDepth
    ];

    let near = -Infinity;
    let far = Infinity;

    for (
      let axis = 0;
      axis < 3;
      axis += 1
    ) {
      if (
        Math.abs(
          localDirection[axis]
        ) <
        1e-9
      ) {
        if (
          localOrigin[axis] <
            minimum[axis] ||
          localOrigin[axis] >
            maximum[axis]
        ) {
          return null;
        }

        continue;
      }

      const inverse =
        1 /
        localDirection[axis];

      let first =
        (
          minimum[axis] -
          localOrigin[axis]
        ) *
        inverse;

      let second =
        (
          maximum[axis] -
          localOrigin[axis]
        ) *
        inverse;

      if (first > second) {
        const temporary =
          first;
        first = second;
        second = temporary;
      }

      near =
        Math.max(
          near,
          first
        );

      far =
        Math.min(
          far,
          second
        );

      if (near > far) {
        return null;
      }
    }

    if (far < 1e-7) {
      return null;
    }

    return near > 1e-7
      ? near
      : far;
  }

  function inspectAt(
    clientX,
    clientY
  ) {
    if (
      !state.geometry ||
      !state.stage
    ) {
      return null;
    }

    updateMatrices();

    const rectangle =
      state.stage.getBoundingClientRect();

    const x =
      Number.isFinite(clientX)
        ? clientX
        : rectangle.left +
          rectangle.width /
            2;

    const y =
      Number.isFinite(clientY)
        ? clientY
        : rectangle.top +
          rectangle.height /
            2;

    const ndcX =
      (
        (
          x -
          rectangle.left
        ) /
        Math.max(
          rectangle.width,
          1
        )
      ) *
        2 -
      1;

    const ndcY =
      1 -
      (
        (
          y -
          rectangle.top
        ) /
        Math.max(
          rectangle.height,
          1
        )
      ) *
        2;

    const nearPoint =
      unproject(
        ndcX,
        ndcY,
        -1
      );

    const farPoint =
      unproject(
        ndcX,
        ndcY,
        1
      );

    const direction =
      normalizeVector(
        subtractVector(
          farPoint,
          nearPoint
        )
      );

    let nearest = null;

    for (
      const volume of
      state.geometry.pickVolumes
    ) {
      const node =
        state.geometry.nodeById.get(
          volume.nodeId
        );

      if (
        !node ||
        !node.pickable ||
        !isNodeVisible(
          node.id
        )
      ) {
        continue;
      }

      const distance =
        volume.type ===
        "cylinder"
          ? rayCylinderIntersection(
              nearPoint,
              direction,
              volume
            )
          : rayObbIntersection(
              nearPoint,
              direction,
              volume
            );

      if (
        !Number.isFinite(
          distance
        )
      ) {
        continue;
      }

      if (
        !nearest ||
        distance <
          nearest.distance -
            0.12 ||
        (
          Math.abs(
            distance -
            nearest.distance
          ) <=
            0.12 &&
          volume.priority >
            nearest.priority
        )
      ) {
        nearest = {
          nodeId:
            node.id,
          distance,
          priority:
            volume.priority
        };
      }
    }

    if (!nearest) {
      clearSelection();
      return null;
    }

    return selectNode(
      nearest.nodeId
    );
  }

  function pointerDistance(a, b) {
    return Math.hypot(
      a.x -
        b.x,
      a.y -
        b.y
    );
  }

  function pointerArray() {
    return Array.from(
      state.pointers.values()
    );
  }

  function markCameraMoving() {
    state.cameraMovingUntil =
      now() +
      140;

    if (state.stage) {
      state.stage.dataset.cameraMoving =
        "true";
    }
  }

  function bindStageInteraction() {
    if (
      !state.stage ||
      state.stage.dataset.interactionBound ===
        "true"
    ) {
      return;
    }

    state.stage.dataset.interactionBound =
      "true";

    listen(
      state.stage,
      "pointerdown",
      event => {
        state.lastInteractionTime =
          now();

        const point = {
          id:
            event.pointerId,
          x:
            event.clientX,
          y:
            event.clientY,
          previousX:
            event.clientX,
          previousY:
            event.clientY
        };

        state.pointers.set(
          event.pointerId,
          point
        );

        if (
          state.primaryPointerId ===
          null
        ) {
          state.primaryPointerId =
            event.pointerId;

          state.pointerDownTime =
            now();

          state.pointerStartX =
            event.clientX;

          state.pointerStartY =
            event.clientY;

          state.pointerMoved =
            false;
        }

        if (
          state.pointers.size >=
          2
        ) {
          const points =
            pointerArray();

          state.lastPinchDistance =
            pointerDistance(
              points[0],
              points[1]
            );
        }

        state.camera.transition =
          null;

        state.camera.velocityYaw =
          0;

        state.camera.velocityPitch =
          0;

        try {
          state.stage.setPointerCapture(
            event.pointerId
          );
        } catch (_error) {}

        event.preventDefault();
      },
      {
        passive: false
      }
    );

    listen(
      state.stage,
      "pointermove",
      event => {
        const point =
          state.pointers.get(
            event.pointerId
          );

        if (!point) {
          return;
        }

        point.previousX =
          point.x;

        point.previousY =
          point.y;

        point.x =
          event.clientX;

        point.y =
          event.clientY;

        state.lastInteractionTime =
          now();

        markCameraMoving();

        if (
          state.pointers.size >=
          2
        ) {
          const points =
            pointerArray();

          const distance =
            pointerDistance(
              points[0],
              points[1]
            );

          if (
            state.lastPinchDistance >
            0
          ) {
            const ratio =
              distance /
              state.lastPinchDistance;

            state.camera.distance =
              clamp(
                state.camera.distance /
                  Math.max(
                    ratio,
                    0.01
                  ),
                INITIAL_CAMERA.distanceMinimum,
                INITIAL_CAMERA.distanceMaximum
              );
          }

          state.lastPinchDistance =
            distance;

          state.pointerMoved =
            true;

          renderScene();

          event.preventDefault();
          return;
        }

        if (
          event.pointerId !==
          state.primaryPointerId
        ) {
          return;
        }

        const dx =
          point.x -
          point.previousX;

        const dy =
          point.y -
          point.previousY;

        if (
          Math.hypot(
            point.x -
              state.pointerStartX,
            point.y -
              state.pointerStartY
          ) >=
          INITIAL_CAMERA.clickMovementThreshold
        ) {
          state.pointerMoved =
            true;
        }

        state.camera.yaw +=
          dx *
          INITIAL_CAMERA.dragYawScale;

        state.camera.pitch =
          clamp(
            state.camera.pitch +
              dy *
                INITIAL_CAMERA.dragPitchScale,
            INITIAL_CAMERA.pitchMinimum,
            INITIAL_CAMERA.pitchMaximum
          );

        state.camera.velocityYaw =
          clamp(
            dx *
              0.0015,
            -0.045,
            0.045
          );

        state.camera.velocityPitch =
          clamp(
            dy *
              0.0011,
            -0.032,
            0.032
          );

        renderScene();

        event.preventDefault();
      },
      {
        passive: false
      }
    );

    function releasePointer(event) {
      const wasPrimary =
        event.pointerId ===
        state.primaryPointerId;

      const point =
        state.pointers.get(
          event.pointerId
        );

      state.pointers.delete(
        event.pointerId
      );

      try {
        state.stage.releasePointerCapture(
          event.pointerId
        );
      } catch (_error) {}

      if (
        state.pointers.size <
        2
      ) {
        state.lastPinchDistance =
          0;
      }

      if (wasPrimary) {
        const duration =
          now() -
          state.pointerDownTime;

        const moved =
          state.pointerMoved;

        if (
          point &&
          !moved &&
          duration <=
            INITIAL_CAMERA.clickDurationThreshold
        ) {
          const tapTime =
            now();

          if (
            tapTime -
              state.lastTapTime <=
            INITIAL_CAMERA.doubleTapThreshold
          ) {
            resetEstate();
            state.lastTapTime =
              0;
          } else {
            state.lastTapTime =
              tapTime;

            inspectAt(
              point.x,
              point.y
            );
          }
        }

        const remaining =
          pointerArray();

        state.primaryPointerId =
          remaining.length
            ? remaining[0].id
            : null;

        if (remaining.length) {
          state.pointerStartX =
            remaining[0].x;

          state.pointerStartY =
            remaining[0].y;

          state.pointerDownTime =
            now();

          state.pointerMoved =
            false;
        }
      }

      state.lastInteractionTime =
        now();

      event.preventDefault();
    }

    listen(
      state.stage,
      "pointerup",
      releasePointer,
      {
        passive: false
      }
    );

    listen(
      state.stage,
      "pointercancel",
      releasePointer,
      {
        passive: false
      }
    );

    listen(
      state.stage,
      "wheel",
      event => {
        state.camera.transition =
          null;

        state.camera.distance =
          clamp(
            state.camera.distance +
              event.deltaY *
                INITIAL_CAMERA.wheelScale,
            INITIAL_CAMERA.distanceMinimum,
            INITIAL_CAMERA.distanceMaximum
          );

        markCameraMoving();
        renderScene();

        event.preventDefault();
      },
      {
        passive: false
      }
    );

    listen(
      state.stage,
      "keydown",
      event => {
        const key =
          String(
            event.key ||
            ""
          ).toLowerCase();

        if (
          key ===
          "arrowleft"
        ) {
          event.preventDefault();
          state.camera.yaw -=
            0.12;
          markCameraMoving();
          renderScene();
          return;
        }

        if (
          key ===
          "arrowright"
        ) {
          event.preventDefault();
          state.camera.yaw +=
            0.12;
          markCameraMoving();
          renderScene();
          return;
        }

        if (
          key ===
          "arrowup"
        ) {
          event.preventDefault();

          state.camera.pitch =
            clamp(
              state.camera.pitch +
                0.08,
              INITIAL_CAMERA.pitchMinimum,
              INITIAL_CAMERA.pitchMaximum
            );

          markCameraMoving();
          renderScene();
          return;
        }

        if (
          key ===
          "arrowdown"
        ) {
          event.preventDefault();

          state.camera.pitch =
            clamp(
              state.camera.pitch -
                0.08,
              INITIAL_CAMERA.pitchMinimum,
              INITIAL_CAMERA.pitchMaximum
            );

          markCameraMoving();
          renderScene();
          return;
        }

        if (
          key ===
            "+" ||
          key ===
            "="
        ) {
          event.preventDefault();

          state.camera.distance =
            clamp(
              state.camera.distance -
                0.60,
              INITIAL_CAMERA.distanceMinimum,
              INITIAL_CAMERA.distanceMaximum
            );

          markCameraMoving();
          renderScene();
          return;
        }

        if (
          key ===
          "-"
        ) {
          event.preventDefault();

          state.camera.distance =
            clamp(
              state.camera.distance +
                0.60,
              INITIAL_CAMERA.distanceMinimum,
              INITIAL_CAMERA.distanceMaximum
            );

          markCameraMoving();
          renderScene();
          return;
        }

        if (
          key ===
            "o" ||
          key ===
            "1"
        ) {
          event.preventDefault();
          setEstateView(
            "overview"
          );
          return;
        }

        if (
          key ===
            "s" ||
          key ===
            "2"
        ) {
          event.preventDefault();
          setEstateView(
            "structure"
          );
          return;
        }

        if (key === "f") {
          event.preventDefault();
          focusSelectedRoom();
          return;
        }

        if (
          key ===
            "r" ||
          key ===
            "0"
        ) {
          event.preventDefault();
          resetEstate();
        }
      }
    );
  }

  function projectWorldPoint(
    point
  ) {
    const clip =
      transformPoint4(
        state.projectionViewMatrix,
        [
          point[0],
          point[1],
          point[2],
          1
        ]
      );

    if (
      clip[3] <=
      0.00001
    ) {
      return null;
    }

    const inverseW =
      1 /
      clip[3];

    const ndcX =
      clip[0] *
      inverseW;

    const ndcY =
      clip[1] *
      inverseW;

    const ndcZ =
      clip[2] *
      inverseW;

    if (
      ndcZ < -1.1 ||
      ndcZ > 1.1
    ) {
      return null;
    }

    return {
      x:
        (
          ndcX *
            0.5 +
          0.5
        ) *
        state.cssWidth,

      y:
        (
          1 -
          (
            ndcY *
              0.5 +
            0.5
          )
        ) *
        state.cssHeight,

      depth:
        ndcZ
    };
  }

  function labelPriorityForNode(
    node
  ) {
    if (
      node.id ===
      state.selectedNodeId
    ) {
      return 1000;
    }

    if (
      node.id ===
      state.currentNodeId
    ) {
      return 900;
    }

    if (
      node.id ===
      state.focusedNodeId
    ) {
      return 800;
    }

    if (
      node.role ===
      "zone" ||
      node.id ===
      "ATLAS_CORE" ||
      node.id ===
      "ATRIUM" ||
      node.id ===
      "ENTRY_THRESHOLD"
    ) {
      return 500;
    }

    return 200;
  }

  function boxesOverlap(
    first,
    second,
    margin
  ) {
    return !(
      first.right +
        margin <
        second.left ||
      first.left -
        margin >
        second.right ||
      first.bottom +
        margin <
        second.top ||
      first.top -
        margin >
        second.bottom
    );
  }

  function updateProjectedLabels() {
    if (
      !state.labelLayer ||
      !state.geometry ||
      !state.cssWidth ||
      !state.cssHeight
    ) {
      return;
    }

    const moving =
      now() <
      state.cameraMovingUntil;

    if (
      state.stage
    ) {
      state.stage.dataset.cameraMoving =
        moving
          ? "true"
          : "false";
    }

    const candidates = [];

    for (
      const labelNode of
      queryAll(
        "[data-dgb-estate-label]",
        state.labelLayer
      )
    ) {
      const nodeId =
        labelNode.dataset.nodeId;

      const node =
        state.geometry.nodeById.get(
          nodeId
        );

      if (
        !node ||
        !node.bound ||
        !isNodeVisible(
          nodeId
        )
      ) {
        labelNode.hidden =
          true;
        continue;
      }

      const anchorRecord =
        state.geometry.labelAnchors.find(
          item =>
            item.nodeId ===
            nodeId
        );

      if (!anchorRecord) {
        labelNode.hidden =
          true;
        continue;
      }

      const projected =
        projectWorldPoint(
          anchorRecord.position
        );

      if (
        !projected ||
        projected.x < -80 ||
        projected.x >
          state.cssWidth +
            80 ||
        projected.y < -50 ||
        projected.y >
          state.cssHeight +
            50
      ) {
        labelNode.hidden =
          true;
        continue;
      }

      const text =
        labelNode.textContent ||
        "";

      const width =
        Math.min(
          180,
          Math.max(
            74,
            text.length *
              7 +
              24
          )
        );

      const height = 30;

      const box = {
        left:
          projected.x -
          width /
            2,
        right:
          projected.x +
          width /
            2,
        top:
          projected.y -
          height /
            2,
        bottom:
          projected.y +
          height /
            2
      };

      candidates.push({
        node,
        labelNode,
        projected,
        box,
        priority:
          labelPriorityForNode(
            node
          )
      });
    }

    candidates.sort(
      (a, b) => {
        if (
          a.priority !==
          b.priority
        ) {
          return (
            b.priority -
            a.priority
          );
        }

        return (
          a.projected.depth -
          b.projected.depth
        );
      }
    );

    const accepted = [];

    for (
      const candidate of
      candidates
    ) {
      const protectedLabel =
        candidate.node.id ===
          state.selectedNodeId ||
        candidate.node.id ===
          state.currentNodeId;

      const collision =
        accepted.some(
          item =>
            boxesOverlap(
              candidate.box,
              item.box,
              8
            )
        );

      if (
        collision &&
        !protectedLabel
      ) {
        candidate.labelNode.hidden =
          true;
        continue;
      }

      candidate.labelNode.hidden =
        false;

      candidate.labelNode.style.transform =
        `translate3d(${candidate.projected.x}px, ${candidate.projected.y}px, 0) translate(-50%, -50%)`;

      candidate.labelNode.style.opacity =
        moving &&
        !protectedLabel
          ? "0.28"
          : "1";

      candidate.labelNode.dataset.selected =
        candidate.node.id ===
        state.selectedNodeId
          ? "true"
          : "false";

      candidate.labelNode.dataset.current =
        candidate.node.id ===
        state.currentNodeId
          ? "true"
          : "false";

      accepted.push(
        candidate
      );
    }
  }

  function rebuildLabels() {
    if (
      !state.labelLayer ||
      !state.geometry
    ) {
      return;
    }

    state.labelLayer.textContent =
      "";

    for (
      const node of
      state.geometry.sceneNodes
    ) {
      const route =
        state.nodeBindings.get(
          node.id
        );

      if (!route) {
        continue;
      }

      const label =
        element(
          "button",
          {
            type:
              "button",
            "data-dgb-estate-label":
              "",
            "data-node-id":
              node.id,
            "data-route-id":
              route.routeId,
            "data-label-priority":
              labelPriorityForNode(
                node
              ),
            tabIndex:
              -1,
            text:
              route.publicRoomName
          }
        );

      label.style.position =
        "absolute";

      label.style.left =
        "0";

      label.style.top =
        "0";

      label.style.pointerEvents =
        "auto";

      label.hidden = true;

      listen(
        label,
        "click",
        event => {
          event.preventDefault();
          event.stopPropagation();

          selectNode(
            node.id
          );
        }
      );

      state.labelLayer.appendChild(
        label
      );
    }

    updateProjectedLabels();
  }

  function shortestPathTo(
    targetNodeId
  ) {
    if (
      !state.geometry ||
      !state.geometry.graph.has(
        "ENTRY_THRESHOLD"
      ) ||
      !state.geometry.graph.has(
        targetNodeId
      )
    ) {
      return {
        nodes: [],
        corridors: []
      };
    }

    const distances =
      new Map();

    const previous =
      new Map();

    const previousCorridor =
      new Map();

    const unvisited =
      new Set(
        state.geometry.graph.keys()
      );

    for (
      const nodeId of
      unvisited
    ) {
      distances.set(
        nodeId,
        Infinity
      );
    }

    distances.set(
      "ENTRY_THRESHOLD",
      0
    );

    while (
      unvisited.size
    ) {
      let current = null;
      let currentDistance =
        Infinity;

      for (
        const nodeId of
        unvisited
      ) {
        const distance =
          distances.get(
            nodeId
          );

        if (
          distance <
          currentDistance
        ) {
          current =
            nodeId;
          currentDistance =
            distance;
        }
      }

      if (
        current ===
          null ||
        currentDistance ===
          Infinity
      ) {
        break;
      }

      unvisited.delete(
        current
      );

      if (
        current ===
        targetNodeId
      ) {
        break;
      }

      const edges =
        state.geometry.graph.get(
          current
        ) ||
        [];

      for (
        const edge of
        edges
      ) {
        if (
          !unvisited.has(
            edge.nodeId
          )
        ) {
          continue;
        }

        const alternative =
          currentDistance +
          edge.weight;

        if (
          alternative <
          distances.get(
            edge.nodeId
          )
        ) {
          distances.set(
            edge.nodeId,
            alternative
          );

          previous.set(
            edge.nodeId,
            current
          );

          previousCorridor.set(
            edge.nodeId,
            edge.corridorId
          );
        }
      }
    }

    if (
      targetNodeId !==
        "ENTRY_THRESHOLD" &&
      !previous.has(
        targetNodeId
      )
    ) {
      return {
        nodes: [],
        corridors: []
      };
    }

    const nodes = [];
    const corridors = [];

    let cursor =
      targetNodeId;

    nodes.push(
      cursor
    );

    while (
      cursor !==
      "ENTRY_THRESHOLD"
    ) {
      const corridorId =
        previousCorridor.get(
          cursor
        );

      const parent =
        previous.get(
          cursor
        );

      if (
        !corridorId ||
        !parent
      ) {
        break;
      }

      corridors.push(
        corridorId
      );

      cursor =
        parent;

      nodes.push(
        cursor
      );
    }

    nodes.reverse();
    corridors.reverse();

    return {
      nodes,
      corridors
    };
  }

  function updateCurrentRoute() {
    const path =
      normalizePath(
        root.location &&
        root.location.pathname
          ? root.location.pathname
          : "/"
      );

    state.currentRoute =
      state.routeByPath.get(
        path
      ) ||
      null;

    state.currentNodeId =
      state.currentRoute
        ? state.routeToNode.get(
            state.currentRoute.routeId
          ) ||
          null
        : null;

    const currentPath =
      state.currentNodeId
        ? shortestPathTo(
            state.currentNodeId
          )
        : {
            corridors: []
          };

    state.currentPathCorridors =
      new Set(
        currentPath.corridors
      );

    updateRevealState();
    renderRoomPanel();
  }

  function updateRevealState() {
    const groups =
      new Set([
        0,
        1
      ]);

    if (
      Number.isInteger(
        state.focusedRevealGroup
      )
    ) {
      groups.add(
        state.focusedRevealGroup
      );
    }

    function addAncestors(
      nodeId
    ) {
      let cursor =
        nodeId;

      while (cursor) {
        const node =
          state.geometry &&
          state.geometry.nodeById.get(
            cursor
          );

        if (node) {
          groups.add(
            node.revealGroup
          );
        }

        cursor =
          PARENT_NODE[cursor] ||
          null;
      }
    }

    addAncestors(
      state.currentNodeId
    );

    addAncestors(
      state.selectedNodeId
    );

    state.visibleGroups =
      groups;

    updateFallback();
    updateProjectedLabels();
  }

  function resolveNode(
    nodeIdOrRouteId
  ) {
    if (
      !state.geometry ||
      !nodeIdOrRouteId
    ) {
      return null;
    }

    const direct =
      state.geometry.nodeById.get(
        nodeIdOrRouteId
      );

    if (direct) {
      return direct;
    }

    const mappedNodeId =
      state.routeToNode.get(
        nodeIdOrRouteId
      );

    if (mappedNodeId) {
      return state.geometry.nodeById.get(
        mappedNodeId
      ) || null;
    }

    const normalizedPath =
      normalizePath(
        nodeIdOrRouteId
      );

    const route =
      state.routeByPath.get(
        normalizedPath
      );

    if (route) {
      const nodeId =
        state.routeToNode.get(
          route.routeId
        );

      if (nodeId) {
        return state.geometry.nodeById.get(
          nodeId
        ) || null;
      }
    }

    return null;
  }

  function selectNode(
    nodeIdOrRouteId
  ) {
    const node =
      resolveNode(
        nodeIdOrRouteId
      );

    if (
      !node ||
      !node.bound ||
      !node.pickable
    ) {
      return null;
    }

    state.selectedNodeId =
      node.id;

    state.selectionCount += 1;

    if (
      Number.isInteger(
        node.revealOnSelect
      )
    ) {
      state.focusedRevealGroup =
        node.revealOnSelect;
    }

    const selectedPath =
      shortestPathTo(
        node.id
      );

    state.selectedPathCorridors =
      new Set(
        selectedPath.corridors
      );

    updateRevealState();
    renderRoomPanel();
    renderScene();

    const route =
      state.nodeBindings.get(
        node.id
      );

    const selection =
      Object.freeze({
        nodeId:
          node.id,
        routeId:
          route.routeId,
        path:
          route.path,
        publicRoomName:
          route.publicRoomName,
        estateLocation:
          route.estateLocation,
        valueCategory:
          route.valueCategory,
        parentNodeId:
          node.parentNodeId,
        zoneId:
          node.zoneId,
        position:
          node.center.slice(),
        revealGroup:
          node.revealGroup
      });

    dispatch(
      EVENT_SELECTION,
      selection
    );

    setStatus(
      `${route.publicRoomName} selected`,
      "selection"
    );

    publishState(
      "selection",
      true
    );

    return selection;
  }

  function clearSelection() {
    state.selectedNodeId =
      null;

    state.selectedPathCorridors =
      new Set();

    renderRoomPanel();
    updateRevealState();
    renderScene();

    setStatus(
      "Select a room in the estate.",
      "normal"
    );

    publishState(
      "selection-clear",
      true
    );
  }

  function focusSelectedRoom() {
    if (!state.selectedNodeId) {
      setStatus(
        "Select a room before focusing.",
        "waiting"
      );

      return false;
    }

    return focusNode(
      state.selectedNodeId
    );
  }

  function focusNode(
    nodeIdOrRouteId
  ) {
    const node =
      resolveNode(
        nodeIdOrRouteId
      );

    if (
      !node ||
      !node.bound
    ) {
      return false;
    }

    const preset =
      CAMERA_PRESETS[
        node.id
      ] ||
      {
        target: [
          node.center[0],
          node.topY +
            0.20,
          node.center[2]
        ],

        yaw:
          state.camera.yaw,

        pitch:
          clamp(
            state.camera.pitch,
            0.42,
            0.72
          ),

        distance:
          clamp(
            (
              node.platform.spec.radius ||
              Math.max(
                node.platform.spec.halfWidth ||
                  0.70,
                node.platform.spec.halfDepth ||
                  0.70
              )
            ) *
              4.2,
            3.40,
            4.60
          )
      };

    const to = {
      target:
        preset.target.slice(),
      yaw:
        preset.yaw,
      pitch:
        preset.pitch,
      distance:
        preset.distance
    };

    if (
      reducedMotion.matches
    ) {
      state.camera.target =
        to.target;

      state.camera.yaw =
        to.yaw;

      state.camera.pitch =
        to.pitch;

      state.camera.distance =
        to.distance;

      state.camera.transition =
        null;
    } else {
      state.camera.transition = {
        startedAt:
          now(),
        duration:
          INITIAL_CAMERA.focusDurationMilliseconds,
        from: {
          target:
            state.camera.target.slice(),
          yaw:
            state.camera.yaw,
          pitch:
            state.camera.pitch,
          distance:
            state.camera.distance
        },
        to
      };
    }

    state.focusedNodeId =
      node.id;

    state.focusCount += 1;

    markCameraMoving();

    if (
      state.overlayOpen &&
      state.activeLens ===
        "mirrorland"
    ) {
      startRenderer();
    }

    const route =
      state.nodeBindings.get(
        node.id
      );

    dispatch(
      EVENT_FOCUS,
      Object.freeze({
        nodeId:
          node.id,
        routeId:
          route
            ? route.routeId
            : null,
        target:
          to.target.slice(),
        yaw:
          to.yaw,
        pitch:
          to.pitch,
        distance:
          to.distance
      })
    );

    setStatus(
      route
        ? `${route.publicRoomName} focused`
        : `${node.id} focused`,
      "focus"
    );

    publishState(
      "focus",
      true
    );

    return true;
  }

  function enterSelectedRoom() {
    if (!state.selectedNodeId) {
      return false;
    }

    const route =
      state.nodeBindings.get(
        state.selectedNodeId
      );

    if (
      !route ||
      !route.path
    ) {
      setStatus(
        "This room does not have an active route.",
        "waiting"
      );

      return false;
    }

    root.location.assign(
      route.path
    );

    return true;
  }

  function resetEstate() {
    const preset =
      CAMERA_PRESETS.overview;

    state.camera.target =
      preset.target.slice();

    state.camera.yaw =
      preset.yaw;

    state.camera.pitch =
      preset.pitch;

    state.camera.distance =
      preset.distance;

    state.camera.velocityYaw =
      0;

    state.camera.velocityPitch =
      0;

    state.camera.transition =
      null;

    state.selectedNodeId =
      null;

    state.focusedNodeId =
      null;

    state.focusedRevealGroup =
      null;

    state.selectedPathCorridors =
      new Set();

    state.estateView =
      "overview";

    synchronizeEstateViewButtons();
    updateRevealState();
    renderRoomPanel();
    renderScene();

    setStatus(
      "Estate Overview active",
      "normal"
    );

    publishState(
      "reset",
      true
    );

    return publicStatus();
  }

  function setEstateView(
    nextView
  ) {
    state.estateView =
      nextView ===
      "structure"
        ? "structure"
        : "overview";

    synchronizeEstateViewButtons();

    if (state.stage) {
      state.stage.dataset.estateView =
        state.estateView;
    }

    setStatus(
      state.estateView ===
        "structure"
        ? "Structure View active"
        : "Estate Overview active",
      "normal"
    );

    renderScene();

    publishState(
      "set-estate-view",
      true
    );

    return publicStatus();
  }

  function synchronizeEstateViewButtons() {
    if (state.overviewButton) {
      const active =
        state.estateView ===
        "overview";

      state.overviewButton.setAttribute(
        "aria-pressed",
        String(active)
      );

      state.overviewButton.dataset.active =
        String(active);
    }

    if (state.structureButton) {
      const active =
        state.estateView ===
        "structure";

      state.structureButton.setAttribute(
        "aria-pressed",
        String(active)
      );

      state.structureButton.dataset.active =
        String(active);
    }
  }

  function relationshipText(
    node,
    route
  ) {
    if (
      node.id ===
      state.currentNodeId
    ) {
      return "You are here.";
    }

    const parentNodeId =
      node.parentNodeId;

    const parentRoute =
      parentNodeId
        ? state.nodeBindings.get(
            parentNodeId
          )
        : null;

    if (
      state.currentNodeId &&
      parentNodeId ===
        state.currentNodeId
    ) {
      return "This room opens directly from your current room.";
    }

    if (
      state.currentNodeId &&
      PARENT_NODE[
        state.currentNodeId
      ] ===
        node.id
    ) {
      return "This room is the parent chamber of your current room.";
    }

    if (parentRoute) {
      return `${route.publicRoomName} is reached through ${parentRoute.publicRoomName}.`;
    }

    return "This room belongs to the Mirrorland estate.";
  }

  function renderRoomPanel() {
    const node =
      state.selectedNodeId &&
      state.geometry
        ? state.geometry.nodeById.get(
            state.selectedNodeId
          )
        : null;

    const route =
      node
        ? state.nodeBindings.get(
            node.id
          )
        : null;

    for (
      const refs of
      state.roomPanelRefs
    ) {
      if (!node || !route) {
        refs.empty.hidden =
          false;

        refs.article.hidden =
          true;

        refs.location.textContent =
          "";

        refs.name.textContent =
          "";

        refs.purpose.textContent =
          "";

        refs.relationship.textContent =
          "";

        refs.enter.removeAttribute(
          "href"
        );

        refs.enter.setAttribute(
          "aria-disabled",
          "true"
        );

        refs.detailsBody.textContent =
          "";

        continue;
      }

      refs.empty.hidden =
        true;

      refs.article.hidden =
        false;

      refs.location.textContent =
        route.estateLocation ||
        route.valueCategory ||
        "Mirrorland Estate";

      refs.name.textContent =
        route.publicRoomName;

      refs.purpose.textContent =
        route.purpose ||
        "A room within the Mirrorland estate.";

      refs.relationship.textContent =
        relationshipText(
          node,
          route
        );

      if (route.path) {
        refs.enter.setAttribute(
          "href",
          route.path
        );

        refs.enter.removeAttribute(
          "aria-disabled"
        );
      } else {
        refs.enter.removeAttribute(
          "href"
        );

        refs.enter.setAttribute(
          "aria-disabled",
          "true"
        );
      }

      refs.detailsBody.textContent =
        "";

      const detailLines = [
        [
          "Action",
          route.action
        ],
        [
          "Context",
          route.context
        ],
        [
          "Value category",
          route.valueCategory
        ],
        [
          "Wing",
          route.wing
        ]
      ].filter(
        item =>
          item[1]
      );

      for (
        const [label, value] of
        detailLines
      ) {
        const paragraph =
          element(
            "p"
          );

        const strong =
          element(
            "strong",
            {
              text:
                `${label}: `
            }
          );

        paragraph.appendChild(
          strong
        );

        paragraph.appendChild(
          doc.createTextNode(
            value
          )
        );

        refs.detailsBody.appendChild(
          paragraph
        );
      }
    }

    if (
      state.mobileRoomSheet
    ) {
      state.mobileRoomSheet.hidden =
        !node ||
        !route;
    }
  }

  function createRoomPanelContents() {
    const empty =
      element(
        "div",
        {
          "data-dgb-estate-room-empty":
            "",
          text:
            "Select a room in the estate."
        }
      );

    const location =
      element(
        "span",
        {
          "data-dgb-estate-room-location":
            ""
        }
      );

    const name =
      element(
        "h3",
        {
          "data-dgb-estate-room-name":
            ""
        }
      );

    const purpose =
      element(
        "p",
        {
          "data-dgb-estate-room-purpose":
            ""
        }
      );

    const relationship =
      element(
        "p",
        {
          "data-dgb-estate-room-relationship":
            ""
        }
      );

    const focusButton =
      element(
        "button",
        {
          type:
            "button",
          "data-dgb-estate-focus":
            "",
          text:
            "Focus Room"
        }
      );

    const enterLink =
      element(
        "a",
        {
          "data-dgb-estate-enter":
            "",
          "aria-disabled":
            "true",
          text:
            "Enter Room"
        }
      );

    const actions =
      element(
        "div",
        {
          "data-dgb-estate-room-actions":
            ""
        },
        [
          focusButton,
          enterLink
        ]
      );

    const detailsBody =
      element(
        "div"
      );

    const details =
      element(
        "details",
        {
          "data-dgb-estate-room-details":
            ""
        },
        [
          element(
            "summary",
            {
              text:
                "Room details"
            }
          ),
          detailsBody
        ]
      );

    const article =
      element(
        "article",
        {
          "data-dgb-estate-room-selected":
            "",
          hidden:
            true
        },
        [
          location,
          name,
          purpose,
          relationship,
          actions,
          details
        ]
      );

    listen(
      focusButton,
      "click",
      event => {
        event.preventDefault();
        focusSelectedRoom();
      }
    );

    listen(
      enterLink,
      "click",
      event => {
        if (
          enterLink.getAttribute(
            "aria-disabled"
          ) ===
          "true"
        ) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        enterSelectedRoom();
      }
    );

    const container =
      element(
        "div",
        null,
        [
          empty,
          article
        ]
      );

    state.roomPanelRefs.push({
      empty,
      article,
      location,
      name,
      purpose,
      relationship,
      focusButton,
      enter:
        enterLink,
      detailsBody
    });

    return container;
  }

  function updateFallback() {
    if (
      !state.fallback ||
      !state.geometry
    ) {
      return;
    }

    state.fallback.textContent =
      "";

    const heading =
      element(
        "div",
        {
          "data-dgb-estate-fallback-heading":
            ""
        },
        [
          element(
            "strong",
            {
              text:
                "Mirrorland Estate fallback"
            }
          ),

          element(
            "p",
            {
              text:
                "The live three-dimensional renderer is unavailable. Select a room, then use Enter Room."
            }
          )
        ]
      );

    const list =
      element(
        "div",
        {
          "data-dgb-estate-fallback-rooms":
            ""
        }
      );

    for (
      const node of
      state.geometry.sceneNodes
    ) {
      const route =
        state.nodeBindings.get(
          node.id
        );

      if (
        !route ||
        !isNodeVisible(
          node.id
        )
      ) {
        continue;
      }

      const button =
        element(
          "button",
          {
            type:
              "button",
            "data-dgb-estate-fallback-room":
              "",
            "data-node-id":
              node.id,
            text:
              route.publicRoomName
          }
        );

      listen(
        button,
        "click",
        event => {
          event.preventDefault();
          selectNode(
            node.id
          );
        }
      );

      list.appendChild(
        button
      );
    }

    state.fallback.append(
      heading,
      list
    );
  }

  function buildMainMenu() {
    if (!state.mainMenuGroups) {
      return;
    }

    state.mainMenuGroups.textContent =
      "";

    const grouped =
      new Map();

    for (
      const route of
      state.mainRoutes
    ) {
      const groupName =
        route.valueCategory ||
        route.wing ||
        "Website";

      if (
        !grouped.has(
          groupName
        )
      ) {
        grouped.set(
          groupName,
          []
        );
      }

      grouped.get(
        groupName
      ).push(
        route
      );
    }

    const entries =
      Array.from(
        grouped.entries()
      ).sort(
        (a, b) =>
          a[0].localeCompare(
            b[0]
          )
      );

    if (!entries.length) {
      state.mainMenuGroups.appendChild(
        element(
          "p",
          {
            text:
              state.registryReady
                ? "No regular website exits are registered."
                : "The route registry is still loading."
          }
        )
      );

      return;
    }

    for (
      const [groupName, routes] of
      entries
    ) {
      routes.sort(
        (a, b) => {
          if (
            a.priority !==
            b.priority
          ) {
            return (
              b.priority -
              a.priority
            );
          }

          return a.publicRoomName.localeCompare(
            b.publicRoomName
          );
        }
      );

      const links =
        element(
          "div",
          {
            "data-dgb-main-menu-links":
              ""
          }
        );

      for (
        const route of
        routes
      ) {
        if (!route.path) {
          continue;
        }

        links.appendChild(
          element(
            "a",
            {
              href:
                route.path,
              "data-dgb-main-menu-route":
                "",
              "data-route-id":
                route.routeId,
              text:
                route.publicRoomName
            }
          )
        );
      }

      state.mainMenuGroups.appendChild(
        element(
          "section",
          {
            "data-dgb-main-menu-group":
              ""
          },
          [
            element(
              "h3",
              {
                text:
                  groupName
              }
            ),
            links
          ]
        )
      );
    }
  }

  function buildUnplacedRoutes() {
    if (!state.unplacedContainer) {
      return;
    }

    state.unplacedContainer.textContent =
      "";

    const routes = [
      ...state.frontierOverflow,
      ...state.unplacedMirrorlandRoutes
    ];

    const unique = [];
    const seen = new Set();

    for (const route of routes) {
      if (
        seen.has(
          route.routeId
        )
      ) {
        continue;
      }

      seen.add(
        route.routeId
      );

      unique.push(
        route
      );
    }

    if (!unique.length) {
      state.unplacedContainer.hidden =
        true;
      return;
    }

    state.unplacedContainer.hidden =
      false;

    const summary =
      element(
        "summary",
        {
          text:
            "Additional Mirrorland doors"
        }
      );

    const list =
      element(
        "div",
        {
          "data-dgb-estate-unplaced-list":
            ""
        }
      );

    for (
      const route of
      unique
    ) {
      if (!route.path) {
        continue;
      }

      list.appendChild(
        element(
          "a",
          {
            href:
              route.path,
            "data-dgb-estate-unplaced-route":
              "",
            "data-route-id":
              route.routeId,
            text:
              route.publicRoomName
          }
        )
      );
    }

    state.unplacedContainer.append(
      summary,
      list
    );
  }

  function buildInstructionsPanel() {
    const items = [
      [
        "Rotate",
        "Drag or swipe across the estate."
      ],
      [
        "Zoom",
        "Pinch or use the mouse wheel."
      ],
      [
        "Select",
        "Tap a room or its label."
      ],
      [
        "Focus",
        "Use Focus Room to center the camera."
      ],
      [
        "Enter",
        "Use Enter Room to navigate."
      ],
      [
        "Structure",
        "Reveal the active architectural structure."
      ],
      [
        "Reset",
        "Restore the estate overview."
      ],
      [
        "Exit",
        "Use Main Menu for the regular website."
      ]
    ];

    const grid =
      element(
        "div",
        {
          "data-dgb-instructions-grid":
            ""
        }
      );

    for (
      const [title, text] of
      items
    ) {
      grid.appendChild(
        element(
          "article",
          {
            "data-dgb-instruction":
              ""
          },
          [
            element(
              "strong",
              {
                text:
                  title
              }
            ),
            element(
              "p",
              {
                text
              }
            )
          ]
        )
      );
    }

    return element(
      "section",
      {
        "data-dgb-blueprint-panel":
          "instructions",
        hidden:
          true
      },
      [
        element(
          "header",
          {
            "data-dgb-instructions-heading":
              ""
          },
          [
            element(
              "h3",
              {
                text:
                  "How to use the estate"
              }
            )
          ]
        ),
        grid
      ]
    );
  }

  function buildGeneratedDom() {
    for (
      const existing of
      queryAll(
        "[data-dgb-blueprint-bubble], [data-dgb-blueprint-overlay]"
      )
    ) {
      try {
        existing.remove();
      } catch (_error) {}
    }

    const overlayId =
      "dgb-manor-blueprint-overlay";

    const bubbleMark =
      element(
        "span",
        {
          "data-dgb-blueprint-bubble-mark":
            "",
          "aria-hidden":
            "true",
          text:
            "◇"
        }
      );

    const bubbleLabel =
      element(
        "span",
        {
          "data-dgb-blueprint-bubble-label":
            "",
          text:
            "Map / Portal"
        }
      );

    state.bubble =
      element(
        "button",
        {
          type:
            "button",
          "data-dgb-blueprint-bubble":
            "",
          "aria-label":
            "Open the Map / Portal",
          "aria-expanded":
            "false",
          "aria-controls":
            overlayId
        },
        [
          bubbleMark,
          bubbleLabel
        ]
      );

    state.bubble.style.position =
      "fixed";

    state.bubble.style.right =
      "18px";

    state.bubble.style.bottom =
      "18px";

    state.bubble.style.zIndex =
      "2147483000";

    state.bubble.style.touchAction =
      "none";

    const kicker =
      element(
        "span",
        {
          "data-dgb-blueprint-kicker":
            "",
          text:
            "Diamond Gate Bridge"
        }
      );

    const title =
      element(
        "h2",
        {
          "data-dgb-blueprint-title":
            "",
          text:
            "Map / Portal"
        }
      );

    const heading =
      element(
        "div",
        {
          "data-dgb-blueprint-heading":
            ""
        },
        [
          kicker,
          title
        ]
      );

    const currentLocation =
      element(
        "div",
        {
          "data-dgb-blueprint-current-location":
            "",
          text:
            "Mirrorland Estate"
        }
      );

    state.closeButton =
      element(
        "button",
        {
          type:
            "button",
          "data-dgb-blueprint-close":
            "",
          "aria-label":
            "Close the Map / Portal",
          text:
            "×"
        }
      );

    const topbar =
      element(
        "header",
        {
          "data-dgb-blueprint-topbar":
            ""
        },
        [
          heading,
          currentLocation,
          state.closeButton
        ]
      );

    const tabs =
      element(
        "nav",
        {
          "data-dgb-blueprint-tabs":
            "",
          "aria-label":
            "Map and Portal views"
        }
      );

    const lensDefinitions = [
      [
        "mirrorland",
        "Mirrorland Doors"
      ],
      [
        "main",
        "Main Menu"
      ],
      [
        "instructions",
        "Instructions"
      ]
    ];

    for (
      const [lensId, label] of
      lensDefinitions
    ) {
      const button =
        element(
          "button",
          {
            type:
              "button",
            "data-dgb-blueprint-lens":
              lensId,
            "aria-pressed":
              lensId ===
              "mirrorland"
                ? "true"
                : "false",
            text:
              label
          }
        );

      state.lensButtons.set(
        lensId,
        button
      );

      tabs.appendChild(
        button
      );
    }

    state.overviewButton =
      element(
        "button",
        {
          type:
            "button",
          "data-dgb-estate-view":
            "overview",
          "aria-pressed":
            "true",
          text:
            "Estate Overview"
        }
      );

    state.structureButton =
      element(
        "button",
        {
          type:
            "button",
          "data-dgb-estate-view":
            "structure",
          "aria-pressed":
            "false",
          text:
            "Structure"
        }
      );

    state.resetButton =
      element(
        "button",
        {
          type:
            "button",
          "data-dgb-estate-reset":
            "",
          text:
            "Reset"
        }
      );

    const viewControls =
      element(
        "div",
        {
          "data-dgb-estate-view-controls":
            ""
        },
        [
          state.overviewButton,
          state.structureButton,
          state.resetButton
        ]
      );

    state.estateStatus =
      element(
        "span",
        {
          "data-dgb-estate-status":
            "",
          text:
            "Preparing the Mirrorland estate…"
        }
      );

    const toolbar =
      element(
        "div",
        {
          "data-dgb-estate-toolbar":
            ""
        },
        [
          viewControls,
          state.estateStatus
        ]
      );

    state.canvas =
      element(
        "canvas",
        {
          "data-dgb-estate-canvas":
            "",
          "aria-hidden":
            "true"
        }
      );

    state.canvas.style.position =
      "absolute";

    state.canvas.style.inset =
      "0";

    state.canvas.style.width =
      "100%";

    state.canvas.style.height =
      "100%";

    state.canvas.style.display =
      "block";

    state.canvas.style.touchAction =
      "none";

    state.labelLayer =
      element(
        "div",
        {
          "data-dgb-estate-label-layer":
            "",
          "aria-hidden":
            "true"
        }
      );

    state.labelLayer.style.position =
      "absolute";

    state.labelLayer.style.inset =
      "0";

    state.labelLayer.style.pointerEvents =
      "none";

    state.fallback =
      element(
        "div",
        {
          "data-dgb-estate-fallback":
            "",
          hidden:
            true
        }
      );

    state.liveStatus =
      element(
        "div",
        {
          "data-dgb-estate-live-status":
            "",
          role:
            "status",
          "aria-live":
            "polite",
          "aria-atomic":
            "true"
        }
      );

    state.stage =
      element(
        "div",
        {
          "data-dgb-estate-stage":
            "",
          tabIndex:
            0,
          role:
            "application",
          "aria-label":
            "Interactive three-dimensional Mirrorland estate. Drag or swipe to rotate, pinch or use the mouse wheel to zoom, and tap a room to select it.",
          "data-renderer":
            "native-webgl",
          "data-webgl-state":
            "held",
          "data-estate-view":
            "overview",
          "data-camera-moving":
            "false"
        },
        [
          state.canvas,
          state.labelLayer,
          state.fallback,
          state.liveStatus
        ]
      );

    state.stage.style.position =
      "relative";

    state.stage.style.minHeight =
      "420px";

    state.stage.style.overflow =
      "hidden";

    state.stage.style.touchAction =
      "none";

    const stageHelp =
      element(
        "div",
        {
          "data-dgb-estate-stage-help":
            "",
          text:
            "Drag or swipe to rotate · Pinch or wheel to zoom · Tap a room to select"
        }
      );

    const stageColumn =
      element(
        "div",
        {
          "data-dgb-estate-stage-column":
            ""
        },
        [
          state.stage,
          stageHelp
        ]
      );

    const roomPanelContents =
      createRoomPanelContents();

    const roomPanel =
      element(
        "aside",
        {
          "data-dgb-estate-room-panel":
            ""
        },
        roomPanelContents
      );

    const layout =
      element(
        "div",
        {
          "data-dgb-estate-layout":
            ""
        },
        [
          stageColumn,
          roomPanel
        ]
      );

    const mobileRoomContents =
      createRoomPanelContents();

    state.mobileRoomSheet =
      element(
        "div",
        {
          "data-dgb-estate-mobile-room-sheet":
            "",
          hidden:
            true
        },
        mobileRoomContents
      );

    state.unplacedContainer =
      element(
        "details",
        {
          "data-dgb-estate-unplaced":
            "",
          hidden:
            true
        }
      );

    const mirrorlandPanel =
      element(
        "section",
        {
          "data-dgb-blueprint-panel":
            "mirrorland"
        },
        [
          toolbar,
          layout,
          state.mobileRoomSheet,
          state.unplacedContainer
        ]
      );

    const mainMenuHeading =
      element(
        "header",
        {
          "data-dgb-main-menu-heading":
            ""
        },
        [
          element(
            "h3",
            {
              text:
                "Main Menu"
            }
          )
        ]
      );

    const mainMenuExitNote =
      element(
        "p",
        {
          "data-dgb-main-menu-exit-note":
            "",
          text:
            "These options leave Mirrorland and return to the regular website."
        }
      );

    state.mainMenuGroups =
      element(
        "div",
        {
          "data-dgb-main-menu-groups":
            ""
        }
      );

    const mainMenuPanel =
      element(
        "section",
        {
          "data-dgb-blueprint-panel":
            "main",
          hidden:
            true
        },
        [
          mainMenuHeading,
          mainMenuExitNote,
          state.mainMenuGroups
        ]
      );

    const instructionsPanel =
      buildInstructionsPanel();

    state.panels.set(
      "mirrorland",
      mirrorlandPanel
    );

    state.panels.set(
      "main",
      mainMenuPanel
    );

    state.panels.set(
      "instructions",
      instructionsPanel
    );

    const content =
      element(
        "main",
        {
          "data-dgb-blueprint-content":
            ""
        },
        [
          mirrorlandPanel,
          mainMenuPanel,
          instructionsPanel
        ]
      );

    state.shell =
      element(
        "div",
        {
          "data-dgb-blueprint-shell":
            ""
        },
        [
          topbar,
          tabs,
          content
        ]
      );

    state.overlay =
      element(
        "section",
        {
          id:
            overlayId,
          "data-dgb-blueprint-overlay":
            "",
          "data-active-lens":
            "mirrorland",
          "data-overlay-state":
            "closed",
          "data-estate-renderer-state":
            "held",
          role:
            "dialog",
          "aria-modal":
            "true",
          "aria-label":
            "Diamond Gate Bridge Map and Portal",
          hidden:
            true
        },
        state.shell
      );

    state.overlay.style.position =
      "fixed";

    state.overlay.style.inset =
      "0";

    state.overlay.style.zIndex =
      "2147482999";

    state.overlay.style.overflow =
      "auto";

    state.overlay.style.background =
      "rgba(2, 5, 14, 0.98)";

    state.shell.style.minHeight =
      "100%";

    state.shell.style.display =
      "flex";

    state.shell.style.flexDirection =
      "column";

    if (!doc.body) {
      throw new Error(
        "Document body is unavailable."
      );
    }

    doc.body.append(
      state.bubble,
      state.overlay
    );

    restoreBubblePosition();
    bindGeneratedDomEvents();
    bindStageInteraction();
    buildMainMenu();
    updateFallback();
    renderRoomPanel();
  }

  function restoreBubblePosition() {
    if (!state.bubble) {
      return;
    }

    let stored = null;

    try {
      stored =
        JSON.parse(
          root.localStorage.getItem(
            STORAGE_KEY
          ) ||
          "null"
        );
    } catch (_error) {
      stored = null;
    }

    if (
      !stored ||
      !Number.isFinite(
        Number(
          stored.left
        )
      ) ||
      !Number.isFinite(
        Number(
          stored.top
        )
      )
    ) {
      return;
    }

    state.bubble.style.right =
      "auto";

    state.bubble.style.bottom =
      "auto";

    state.bubble.style.left =
      `${stored.left}px`;

    state.bubble.style.top =
      `${stored.top}px`;

    clampBubbleToViewport();
  }

  function saveBubblePosition() {
    if (!state.bubble) {
      return;
    }

    const rectangle =
      state.bubble.getBoundingClientRect();

    try {
      root.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          left:
            rectangle.left,
          top:
            rectangle.top
        })
      );
    } catch (_error) {}
  }

  function clampBubbleToViewport() {
    if (!state.bubble) {
      return;
    }

    const rectangle =
      state.bubble.getBoundingClientRect();

    const margin = 10;

    const left =
      clamp(
        rectangle.left,
        margin,
        Math.max(
          margin,
          root.innerWidth -
            rectangle.width -
            margin
        )
      );

    const top =
      clamp(
        rectangle.top,
        margin,
        Math.max(
          margin,
          root.innerHeight -
            rectangle.height -
            margin
        )
      );

    state.bubble.style.right =
      "auto";

    state.bubble.style.bottom =
      "auto";

    state.bubble.style.left =
      `${left}px`;

    state.bubble.style.top =
      `${top}px`;
  }

  function bindBubbleDrag() {
    if (
      !state.bubble ||
      state.bubble.dataset.dragBound ===
        "true"
    ) {
      return;
    }

    state.bubble.dataset.dragBound =
      "true";

    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let moved = false;
    let suppressClickUntil = 0;

    listen(
      state.bubble,
      "pointerdown",
      event => {
        pointerId =
          event.pointerId;

        startX =
          event.clientX;

        startY =
          event.clientY;

        const rectangle =
          state.bubble.getBoundingClientRect();

        startLeft =
          rectangle.left;

        startTop =
          rectangle.top;

        moved = false;

        try {
          state.bubble.setPointerCapture(
            pointerId
          );
        } catch (_error) {}

        event.preventDefault();
      },
      {
        passive: false
      }
    );

    listen(
      state.bubble,
      "pointermove",
      event => {
        if (
          pointerId ===
            null ||
          event.pointerId !==
            pointerId
        ) {
          return;
        }

        const dx =
          event.clientX -
          startX;

        const dy =
          event.clientY -
          startY;

        if (
          Math.hypot(
            dx,
            dy
          ) >=
          6
        ) {
          moved = true;
        }

        if (!moved) {
          return;
        }

        const width =
          state.bubble.offsetWidth ||
          72;

        const height =
          state.bubble.offsetHeight ||
          44;

        const left =
          clamp(
            startLeft +
              dx,
            10,
            root.innerWidth -
              width -
              10
          );

        const top =
          clamp(
            startTop +
              dy,
            10,
            root.innerHeight -
              height -
              10
          );

        state.bubble.style.right =
          "auto";

        state.bubble.style.bottom =
          "auto";

        state.bubble.style.left =
          `${left}px`;

        state.bubble.style.top =
          `${top}px`;

        event.preventDefault();
      },
      {
        passive: false
      }
    );

    function release(event) {
      if (
        pointerId ===
          null ||
        event.pointerId !==
          pointerId
      ) {
        return;
      }

      try {
        state.bubble.releasePointerCapture(
          pointerId
        );
      } catch (_error) {}

      if (moved) {
        saveBubblePosition();

        suppressClickUntil =
          now() +
          400;
      } else {
        toggleOverlay();

        suppressClickUntil =
          now() +
          400;
      }

      pointerId = null;

      event.preventDefault();
    }

    listen(
      state.bubble,
      "pointerup",
      release,
      {
        passive: false
      }
    );

    listen(
      state.bubble,
      "pointercancel",
      release,
      {
        passive: false
      }
    );

    listen(
      state.bubble,
      "click",
      event => {
        if (
          now() <
          suppressClickUntil
        ) {
          event.preventDefault();
          return;
        }

        if (
          event.detail ===
          0
        ) {
          event.preventDefault();
          toggleOverlay();
        }
      }
    );
  }

  function bindGeneratedDomEvents() {
    bindBubbleDrag();

    listen(
      state.closeButton,
      "click",
      event => {
        event.preventDefault();
        closeOverlay();
      }
    );

    for (
      const [lensId, button] of
      state.lensButtons
    ) {
      listen(
        button,
        "click",
        event => {
          event.preventDefault();
          setLens(
            lensId
          );
        }
      );
    }

    listen(
      state.overviewButton,
      "click",
      event => {
        event.preventDefault();
        setEstateView(
          "overview"
        );
      }
    );

    listen(
      state.structureButton,
      "click",
      event => {
        event.preventDefault();
        setEstateView(
          "structure"
        );
      }
    );

    listen(
      state.resetButton,
      "click",
      event => {
        event.preventDefault();
        resetEstate();
      }
    );

    listen(
      root,
      "resize",
      () => {
        clampBubbleToViewport();

        if (
          state.webglReady
        ) {
          resizeCanvas();
          renderScene();
        }
      },
      {
        passive: true
      }
    );

    listen(
      root,
      "orientationchange",
      () => {
        root.setTimeout(
          () => {
            clampBubbleToViewport();

            if (
              state.webglReady
            ) {
              resizeCanvas();
              renderScene();
            }
          },
          120
        );
      },
      {
        passive: true
      }
    );

    listen(
      doc,
      "visibilitychange",
      () => {
        state.documentVisible =
          !doc.hidden;

        state.lastFrameTime =
          0;
      }
    );

    listen(
      doc,
      "keydown",
      event => {
        if (!state.overlayOpen) {
          return;
        }

        const target =
          event.target;

        const tag =
          target &&
          target.tagName
            ? target.tagName.toLowerCase()
            : "";

        const editable =
          target &&
          target.isContentEditable;

        if (
          event.key ===
          "Escape"
        ) {
          event.preventDefault();

          if (
            state.selectedNodeId
          ) {
            clearSelection();
            return;
          }

          closeOverlay();
          return;
        }

        if (
          event.key ===
            "Tab" &&
          state.overlay
        ) {
          const focusable =
            queryAll(
              'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
              state.overlay
            ).filter(
              node =>
                !node.hidden &&
                node.offsetParent !==
                  null
            );

          if (!focusable.length) {
            return;
          }

          const first =
            focusable[0];

          const last =
            focusable[
              focusable.length -
              1
            ];

          if (
            event.shiftKey &&
            doc.activeElement ===
              first
          ) {
            event.preventDefault();
            last.focus();
          } else if (
            !event.shiftKey &&
            doc.activeElement ===
              last
          ) {
            event.preventDefault();
            first.focus();
          }

          return;
        }

        if (
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          tag ===
            "input" ||
          tag ===
            "textarea" ||
          tag ===
            "select" ||
          editable
        ) {
          return;
        }
      }
    );

    reducedMotion.addEventListener?.(
      "change",
      () => {
        state.camera.transition =
          null;
        renderScene();
      }
    );
  }

  function setLens(nextLens) {
    const normalized =
      nextLens ===
        "main" ||
      nextLens ===
        "instructions"
        ? nextLens
        : "mirrorland";

    state.activeLens =
      normalized;

    if (state.overlay) {
      state.overlay.dataset.activeLens =
        normalized;
    }

    for (
      const [lensId, button] of
      state.lensButtons
    ) {
      const active =
        lensId ===
        normalized;

      button.setAttribute(
        "aria-pressed",
        String(active)
      );

      button.dataset.active =
        String(active);
    }

    for (
      const [panelId, panel] of
      state.panels
    ) {
      panel.hidden =
        panelId !==
        normalized;
    }

    if (
      normalized ===
      "mirrorland"
    ) {
      ensureRenderer();
      startRenderer();
      resizeCanvas();
      renderScene();
    } else {
      stopRenderer();
    }

    if (
      normalized ===
      "main"
    ) {
      setStatus(
        "Main Menu active · these options leave Mirrorland",
        "normal"
      );
    } else if (
      normalized ===
      "instructions"
    ) {
      setStatus(
        "Instructions active",
        "normal"
      );
    } else {
      setStatus(
        state.selectedNodeId
          ? `${state.nodeBindings.get(state.selectedNodeId)?.publicRoomName || "Room"} selected`
          : "Mirrorland Doors active",
        "normal"
      );
    }

    publishState(
      "set-lens",
      true
    );

    return publicStatus();
  }

  function openOverlay(
    lens
  ) {
    if (
      !state.overlay ||
      !state.bubble
    ) {
      return false;
    }

    state.overlayOpen =
      true;

    state.overlay.hidden =
      false;

    state.overlay.dataset.overlayState =
      "open";

    state.bubble.setAttribute(
      "aria-expanded",
      "true"
    );

    doc.documentElement.dataset.dgbMapPortalOpen =
      "true";

    setLens(
      lens ||
      state.activeLens ||
      "mirrorland"
    );

    root.setTimeout(
      () => {
        const button =
          state.lensButtons.get(
            state.activeLens
          );

        if (button) {
          button.focus();
        } else if (
          state.closeButton
        ) {
          state.closeButton.focus();
        }
      },
      0
    );

    publishState(
      "open",
      true
    );

    return true;
  }

  function closeOverlay() {
    if (
      !state.overlay ||
      !state.bubble
    ) {
      return false;
    }

    stopRenderer();

    state.pointers.clear();
    state.primaryPointerId =
      null;
    state.camera.transition =
      null;

    state.overlayOpen =
      false;

    state.overlay.hidden =
      true;

    state.overlay.dataset.overlayState =
      "closed";

    state.bubble.setAttribute(
      "aria-expanded",
      "false"
    );

    doc.documentElement.dataset.dgbMapPortalOpen =
      "false";

    state.bubble.focus();

    publishState(
      "close",
      true
    );

    return true;
  }

  function toggleOverlay() {
    return state.overlayOpen
      ? closeOverlay()
      : openOverlay();
  }

  function findCurrentPathToNode(
    nodeId
  ) {
    return shortestPathTo(
      nodeId
    );
  }

  function runAudit() {
    if (!state.geometry) {
      return null;
    }

    const geometryValidation =
      state.geometry.validate();

    const checks = [
      ...geometryValidation.checks
    ];

    function addCheck(
      id,
      passed,
      expected,
      actual,
      severity
    ) {
      checks.push(
        Object.freeze({
          id,
          passed:
            Boolean(passed),
          expected,
          actual,
          severity:
            severity ||
            "required"
        })
      );
    }

    const boundRouteIds =
      Array.from(
        state.nodeBindings.values()
      ).map(
        route =>
          route.routeId
      );

    addCheck(
      "unique-fixed-route-bindings",
      new Set(
        boundRouteIds
      ).size ===
        boundRouteIds.length,
      boundRouteIds.length,
      new Set(
        boundRouteIds
      ).size,
      "required"
    );

    const mainRoutesBoundToEstate =
      state.mainRoutes.filter(
        route =>
          state.routeToNode.has(
            route.routeId
          )
      );

    addCheck(
      "main-routes-not-bound-to-estate",
      mainRoutesBoundToEstate.length ===
        0,
      0,
      mainRoutesBoundToEstate.length,
      "required"
    );

    const requiredCore = [
      "ENTRY_THRESHOLD",
      "ATRIUM",
      "ATLAS_CORE"
    ];

    const unboundRequiredCore =
      requiredCore.filter(
        nodeId =>
          !state.nodeBindings.has(
            nodeId
          )
      );

    addCheck(
      "required-core-bindings",
      unboundRequiredCore.length ===
        0,
      0,
      unboundRequiredCore.length,
      "held"
    );

    const reachableNodes = [];

    for (
      const node of
      state.geometry.sceneNodes
    ) {
      const path =
        findCurrentPathToNode(
          node.id
        );

      if (
        node.id ===
          "ENTRY_THRESHOLD" ||
        path.nodes.length
      ) {
        reachableNodes.push(
          node.id
        );
      }
    }

    addCheck(
      "all-scene-nodes-reachable",
      reachableNodes.length ===
        state.geometry.sceneNodes.length,
      state.geometry.sceneNodes.length,
      reachableNodes.length,
      "required"
    );

    const boundMirrorlandIds =
      new Set(
        Array.from(
          state.nodeBindings.values()
        ).map(
          route =>
            route.routeId
        )
      );

    const overflowIds =
      new Set(
        state.frontierOverflow.map(
          route =>
            route.routeId
        )
      );

    const panelOnlyIds =
      new Set(
        state.unplacedMirrorlandRoutes.map(
          route =>
            route.routeId
        )
      );

    const dispositionCount =
      state.mirrorlandRoutes.filter(
        route =>
          boundMirrorlandIds.has(
            route.routeId
          ) ||
          overflowIds.has(
            route.routeId
          ) ||
          panelOnlyIds.has(
            route.routeId
          )
      ).length;

    addCheck(
      "mirrorland-route-dispositions",
      dispositionCount ===
        state.mirrorlandRoutes.length,
      state.mirrorlandRoutes.length,
      dispositionCount,
      "required"
    );

    const failChecks =
      checks.filter(
        item =>
          !item.passed &&
          item.severity ===
            "required"
      );

    const heldChecks =
      checks.filter(
        item =>
          !item.passed &&
          item.severity ===
            "held"
      );

    let auditStatus =
      "READY";

    if (!state.registryReady) {
      auditStatus =
        "HELD";
    } else if (
      failChecks.length
    ) {
      auditStatus =
        "BLOCKED";
    } else if (
      heldChecks.length ||
      state.frontierOverflow.length ||
      state.unplacedMirrorlandRoutes.length ||
      state.adapterStatus !==
        "READY"
    ) {
      auditStatus =
        "DEGRADED";
    }

    state.audit =
      Object.freeze({
        contract:
          AUDIT_CONTRACT,
        status:
          auditStatus,
        registryContract:
          state.registryContract,
        registryAvailable:
          state.registryReady,
        registryRouteCount:
          state.registryRoutes.length,
        mirrorlandRouteCount:
          state.mirrorlandRoutes.length,
        mainRouteCount:
          state.mainRoutes.length,
        geometryPlatformCount:
          state.geometry.platformCount,
        geometryCorridorCount:
          state.geometry.corridorCount,
        surfaceTriangleCount:
          state.geometry.surfaceTriangleCount,
        surfaceVertexCount:
          state.geometry.surfaceVertexCount,
        structuralLineSegmentCount:
          state.geometry.structuralLineSegmentCount,
        fixedNodeCount:
          FIXED_BINDINGS.length,
        boundFixedNodeCount:
          FIXED_BINDINGS.filter(
            binding =>
              state.nodeBindings.has(
                binding.nodeId
              )
          ).length,
        unboundFixedNodeCount:
          FIXED_BINDINGS.filter(
            binding =>
              !state.nodeBindings.has(
                binding.nodeId
              )
          ).length,
        frontierChildCount:
          state.nodeBindings.size -
          FIXED_BINDINGS.filter(
            binding =>
              state.nodeBindings.has(
                binding.nodeId
              )
          ).length +
          state.frontierOverflow.length,
        frontierBoundCount:
          PLATFORM_SPECS.filter(
            spec =>
              spec.role ===
                "frontier-slot" &&
              state.nodeBindings.has(
                spec.id
              )
          ).length,
        frontierOverflowCount:
          state.frontierOverflow.length,
        eligibleMirrorlandDispositionCount:
          dispositionCount,
        reachableNodeCount:
          reachableNodes.length,
        unreachableRequiredNodes:
          unboundRequiredCore.slice(),
        duplicateRouteBindings:
          boundRouteIds.length -
          new Set(
            boundRouteIds
          ).size,
        mainRoutesBoundToEstate:
          mainRoutesBoundToEstate.map(
            route =>
              route.routeId
          ),
        parentageDifferences:
          [],
        checkCount:
          checks.length,
        passCount:
          checks.filter(
            item =>
              item.passed
          ).length,
        heldCount:
          heldChecks.length,
        failCount:
          failChecks.length,
        checks,
        completedAt:
          new Date().toISOString()
      });

    state.auditReady =
      true;

    root.DGB_MANOR_BLUEPRINT_3D_AUDIT_RECEIPT =
      state.audit;

    setDataset(
      "dgbManorBlueprintAuditStatus",
      state.audit.status
    );

    dispatch(
      EVENT_AUDIT,
      state.audit
    );

    if (
      state.audit.status ===
      "BLOCKED"
    ) {
      setStatus(
        "Estate geometry audit blocked.",
        "error"
      );
    } else if (
      state.audit.status ===
      "HELD"
    ) {
      setStatus(
        "Estate route registry is still loading.",
        "waiting"
      );
    }

    publishState(
      "audit",
      true
    );

    return state.audit;
  }

  function resolveAdapter() {
    const candidates = [
      root.DGB_3D_MODEL_ADAPTER,
      root.LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER,
      root.LAB_PRODUCT_ENGINE_GENERIC_3D_MODEL_ADAPTER,
      root.PRODUCT_ENGINE_3D_MODEL_ADAPTER,
      root.GENERIC_3D_MODEL_ADAPTER,
      root.DEXTER_LAB &&
        root.DEXTER_LAB.productEngine3DModelAdapter,
      root.DEXTER_LAB &&
        root.DEXTER_LAB.generic3DModelAdapter,
      root.HEARTH &&
        root.HEARTH.productEngine3DModelAdapter,
      root.HEARTH &&
        root.HEARTH.generic3DModelAdapter
    ];

    for (const candidate of candidates) {
      if (
        candidate &&
        typeof candidate.registerModel ===
          "function"
      ) {
        return candidate;
      }
    }

    return null;
  }

  function estateManifest() {
    return {
      manifestVersion:
        "1.0.0",
      manifestContract:
        "GENERIC_3D_MODEL_MANIFEST_v1",
      modelId:
        MODEL_ID,
      projectId:
        "diamond-gate-bridge",
      name:
        "Mirrorland Diamond Estate",
      label:
        "Mirrorland Estate",
      description:
        "A deterministic native-WebGL three-dimensional estate used by the Map / Portal to present Mirrorland rooms through levels, wings, terraces, corridors, room nodes, and progressive disclosure.",
      purpose:
        "Provide the single interactive Mirrorland estate map while preserving the regular website as a separate Main Menu lens.",
      route:
        CANONICAL_ROUTE,
      generation:
        "G1-3D-ESTATE",
      modelClass:
        "building",
      coordinateSystem:
        "right-handed-y-up",
      units:
        "normalized-estate-units",
      tags: [
        "manor-blueprint",
        "mirrorland",
        "estate",
        "diamond-plan",
        "native-webgl",
        "deterministic-geometry",
        "room-picking",
        "progressive-disclosure",
        "map-portal",
        "no-external-3d-library"
      ],
      metrics: {
        vertexCount:
          EXPECTED.surfaceVertexCount,
        triangleCount:
          EXPECTED.surfaceTriangleCount,
        nodeCount:
          EXPECTED.sceneNodeCount,
        edgeCount:
          EXPECTED.structuralLineSegmentCount,
        materialCount:
          EXPECTED.materialRegionCount,
        animationCount:
          0,
        radialCount:
          0,
        bandCount:
          0,
        seatCount:
          0,
        textureCount:
          0,
        bounds:
          state.geometry
            ? state.geometry.bounds
            : null
      },
      capabilities: {
        nativeWebGL:
          true,
        webGL2Optional:
          true,
        canvasFallback:
          false,
        staticFallback:
          true,
        objectView:
          true,
        latticeView:
          true,
        dragRotation:
          true,
        touchRotation:
          true,
        pinchZoom:
          true,
        wheelZoom:
          true,
        facetPicking:
          false,
        nodePicking:
          true,
        keyboardControls:
          true,
        reducedMotion:
          true,
        contextLossRecovery:
          true,
        responsive:
          true,
        deterministicGeometry:
          true,
        external3DLibrary:
          false,
        generatedImage:
          false,
        graphicBox:
          false
      },
      components: [
        {
          id:
            "mirrorland-diamond-estate-geometry-authority",
          name:
            "Mirrorland Diamond Estate Geometry Authority",
          file:
            FILE,
          contract:
            GEOMETRY_CONTRACT,
          productType:
            "product-framework",
          priority:
            100,
          required:
            true,
          dependencies:
            []
        },
        {
          id:
            "mirrorland-diamond-estate-native-webgl-renderer",
          name:
            "Mirrorland Diamond Estate Native WebGL Renderer",
          file:
            FILE,
          contract:
            RENDERER_CONTRACT,
          productType:
            "canvas-expression",
          priority:
            98,
          required:
            true,
          dependencies: [
            "geometry"
          ]
        },
        {
          id:
            "mirrorland-diamond-estate-ui-controller",
          name:
            "Mirrorland Diamond Estate UI Controller",
          file:
            FILE,
          contract:
            UI_CONTRACT,
          productType:
            "support-engine",
          priority:
            96,
          required:
            false,
          dependencies: [
            "renderer"
          ]
        }
      ],
      interactions: [
        "drag-rotate",
        "touch-rotate",
        "pinch-zoom",
        "wheel-zoom",
        "node-selection",
        "room-focus",
        "zone-focus",
        "reset",
        "structure-view",
        "explicit-room-entry",
        "keyboard-orbit",
        "keyboard-zoom"
      ],
      readiness: {
        receiptReady:
          true,
        platformReady:
          true,
        engineeringReady:
          true,
        productReady:
          true,
        expressionReady:
          true,
        registryReady:
          state.registryReady,
        marketReady:
          false,
        documentationReady:
          true,
        evidenceReady:
          false,
        riskBoundaryReady:
          true,
        publicReady:
          false,
        finalVisualPassClaimed:
          false,
        benchmarkComplete:
          false
      },
      riskBoundaries: [
        "no-public-superiority-claim-without-benchmark",
        "no-final-visual-pass-claim-before-live-review",
        "no-runtime-ready-claim-before-registry-and-geometry-audit",
        "no-main-menu-route-in-mirrorland-scene",
        "no-first-tap-navigation",
        "adapter-does-not-own-rendering",
        "adapter-absence-does-not-block-map",
        "no-external-3d-library",
        "no-generated-image",
        "no-graphic-box"
      ]
    };
  }

  function adapterHasModel(
    adapter
  ) {
    try {
      if (
        typeof adapter.getModel ===
        "function"
      ) {
        return Boolean(
          adapter.getModel(
            MODEL_ID
          )
        );
      }

      if (
        typeof adapter.listModels ===
        "function"
      ) {
        const models =
          adapter.listModels();

        return Array.isArray(
          models
        )
          ? models.some(
              model =>
                model &&
                (
                  model.modelId ===
                    MODEL_ID ||
                  model.id ===
                    MODEL_ID
                )
            )
          : false;
      }
    } catch (_error) {}

    return false;
  }

  function registerAdapterWhenAvailable(
    attempt
  ) {
    if (
      state.disposed ||
      state.adapterRegistered
    ) {
      return;
    }

    state.adapterAttempts =
      attempt;

    const adapter =
      resolveAdapter();

    if (adapter) {
      state.adapter =
        adapter;

      try {
        if (
          !adapterHasModel(
            adapter
          )
        ) {
          adapter.registerModel(
            estateManifest()
          );
        }

        state.adapterRegistered =
          true;

        state.adapterStatus =
          "READY";

        if (
          typeof adapter.collectRuntimeEvidence ===
            "function" &&
          state.webglReady
        ) {
          try {
            adapter.collectRuntimeEvidence(
              MODEL_ID
            );
          } catch (_error) {}
        }

        runAudit();
        publishState(
          "adapter-ready",
          true
        );

        return;
      } catch (error) {
        state.adapterStatus =
          "OPTIONAL_HELD";

        recordError(
          "adapter-register",
          error
        );

        return;
      }
    }

    state.adapterStatus =
      "OPTIONAL_HELD";

    if (attempt >= 60) {
      runAudit();
      publishState(
        "adapter-held",
        true
      );

      return;
    }

    root.setTimeout(
      () => {
        registerAdapterWhenAvailable(
          attempt + 1
        );
      },
      100
    );
  }

  function publicStatus() {
    return Object.freeze({
      contract:
        CONTRACT,
      geometryContract:
        GEOMETRY_CONTRACT,
      rendererContract:
        RENDERER_CONTRACT,
      uiContract:
        UI_CONTRACT,
      domContract:
        DOM_CONTRACT,
      auditContract:
        AUDIT_CONTRACT,
      adapterContract:
        ADAPTER_CONTRACT,
      file:
        FILE,
      route:
        CANONICAL_ROUTE,

      mounted:
        state.mounted,
      disposed:
        state.disposed,
      overlayOpen:
        state.overlayOpen,
      activeLens:
        state.activeLens,
      estateView:
        state.estateView,

      registryReady:
        state.registryReady,
      registryContract:
        state.registryContract,
      registryRouteCount:
        state.registryRoutes.length,
      mirrorlandRouteCount:
        state.mirrorlandRoutes.length,
      mainRouteCount:
        state.mainRoutes.length,

      geometryReady:
        state.geometryReady,
      webglReady:
        state.webglReady,
      contextLost:
        state.contextLost,
      fallbackActive:
        state.fallbackActive,
      fallbackReason:
        state.fallbackReason,

      selectedNodeId:
        state.selectedNodeId,
      focusedNodeId:
        state.focusedNodeId,
      currentNodeId:
        state.currentNodeId,

      camera: Object.freeze({
        target:
          state.camera.target.slice(),
        yaw:
          state.camera.yaw,
        pitch:
          state.camera.pitch,
        distance:
          state.camera.distance
      }),

      renderCount:
        state.renderCount,
      selectionCount:
        state.selectionCount,
      focusCount:
        state.focusCount,
      resizeCount:
        state.resizeCount,
      contextLossCount:
        state.contextLossCount,

      adapterStatus:
        state.adapterStatus,
      adapterRegistered:
        state.adapterRegistered,

      auditStatus:
        state.audit
          ? state.audit.status
          : "HELD",

      nativeWebGL:
        true,
      external3DLibrary:
        false,
      generatedImage:
        false,
      graphicBox:
        false,

      errors:
        state.errors.slice()
    });
  }

  function publishState(
    scope,
    force
  ) {
    const status =
      publicStatus();

    const payload =
      Object.freeze({
        ...status,
        scope:
          scope ||
          "state",
        force:
          Boolean(force),
        time:
          new Date().toISOString()
      });

    root.DGB_MANOR_BLUEPRINT_STATUS =
      payload;

    root.DGB_MANOR_BLUEPRINT_RECEIPT =
      Object.freeze({
        contract:
          CONTRACT,
        file:
          FILE,
        status:
          state.disposed
            ? "DISPOSED"
            : state.audit
              ? state.audit.status
              : state.registryReady
                ? "HELD"
                : "HELD",
        mounted:
          state.mounted,
        overlayOpen:
          state.overlayOpen,
        activeLens:
          state.activeLens,
        estateView:
          state.estateView,
        registryReady:
          state.registryReady,
        geometryReady:
          state.geometryReady,
        webglReady:
          state.webglReady,
        fallbackActive:
          state.fallbackActive,
        auditStatus:
          state.audit
            ? state.audit.status
            : "HELD",
        nativeWebGL:
          true,
        external3DLibrary:
          false,
        generatedImage:
          false,
        graphicBox:
          false
      });

    setDataset(
      "dgbManorBlueprintContract",
      CONTRACT
    );

    setDataset(
      "dgbManorBlueprintMounted",
      state.mounted
    );

    setDataset(
      "dgbManorBlueprintOverlayOpen",
      state.overlayOpen
    );

    setDataset(
      "dgbManorBlueprintLens",
      state.activeLens
    );

    setDataset(
      "dgbManorBlueprintEstateView",
      state.estateView
    );

    setDataset(
      "dgbManorBlueprintNativeWebgl",
      "true"
    );

    setDataset(
      "dgbManorBlueprintGeneratedImage",
      "false"
    );

    setDataset(
      "dgbManorBlueprintGraphicBox",
      "false"
    );

    dispatch(
      EVENT_STATE,
      payload
    );

    return payload;
  }

  function exposeApis() {
    const geometryApi =
      Object.freeze({
        contract:
          GEOMETRY_CONTRACT,

        get geometry() {
          return state.geometry;
        },

        validate() {
          return state.geometry
            ? state.geometry.validate()
            : null;
        },

        getReceipt() {
          return state.geometry
            ? state.geometry.getReceipt()
            : null;
        },

        getNode(nodeId) {
          return state.geometry
            ? state.geometry.nodeById.get(
                nodeId
              ) ||
                null
            : null;
        },

        listNodes() {
          return state.geometry
            ? state.geometry.sceneNodes.slice()
            : [];
        },

        listPlatforms() {
          return state.geometry
            ? state.geometry.platforms.slice()
            : [];
        },

        listCorridors() {
          return state.geometry
            ? state.geometry.corridors.slice()
            : [];
        }
      });

    const rendererApi =
      Object.freeze({
        contract:
          RENDERER_CONTRACT,

        start:
          startRenderer,

        stop:
          stopRenderer,

        render:
          renderScene,

        renderOnce:
          renderScene,

        reset:
          resetEstate,

        inspectAt,

        focusNode,

        selectNode,

        clearSelection,

        setView:
          setEstateView,

        status:
          publicStatus,

        getReceipt() {
          return Object.freeze({
            contract:
              RENDERER_CONTRACT,
            status:
              state.webglReady &&
              !state.contextLost
                ? "READY"
                : state.fallbackActive
                  ? "FALLBACK"
                  : "HELD",
            geometryReady:
              state.geometryReady,
            webglReady:
              state.webglReady,
            contextLost:
              state.contextLost,
            renderCount:
              state.renderCount,
            nativeWebGL:
              true,
            external3DLibrary:
              false
          });
        }
      });

    const uiApi =
      Object.freeze({
        contract:
          UI_CONTRACT,

        setLens,

        setEstateView,

        selectNode,

        focusNode,

        clearSelection,

        enterSelectedRoom,

        reset:
          resetEstate,

        status:
          publicStatus
      });

    const publicApi =
      Object.freeze({
        contract:
          CONTRACT,

        geometryContract:
          GEOMETRY_CONTRACT,

        rendererContract:
          RENDERER_CONTRACT,

        uiContract:
          UI_CONTRACT,

        open:
          openOverlay,

        openOverlay,

        close:
          closeOverlay,

        closeOverlay,

        toggle:
          toggleOverlay,

        toggleOverlay,

        setLens,

        lens:
          setLens,

        openMirrorland() {
          return openOverlay(
            "mirrorland"
          );
        },

        openMainMenu() {
          return openOverlay(
            "main"
          );
        },

        openInstructions() {
          return openOverlay(
            "instructions"
          );
        },

        setEstateView,

        resetEstate,

        reset:
          resetEstate,

        selectNode,

        focusNode,

        clearSelection,

        enterSelectedRoom,

        inspectAt,

        getGeometryReceipt() {
          return state.geometry
            ? state.geometry.getReceipt()
            : null;
        },

        getRendererReceipt() {
          return rendererApi.getReceipt();
        },

        getAuditReceipt() {
          return state.audit;
        },

        status:
          publicStatus,

        getReceipt() {
          return root.DGB_MANOR_BLUEPRINT_RECEIPT ||
            null;
        },

        mount:
          mount,

        stop:
          stopRenderer,

        dispose,

        destroy:
          dispose
      });

    root.DGBManorBlueprintEstateGeometry3D =
      geometryApi;

    root.DGBManorBlueprintEstateRenderer3D =
      rendererApi;

    root.DGBManorBlueprintEstateUI3D =
      uiApi;

    root.DGB_MANOR_BLUEPRINT_API =
      publicApi;

    root.__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__ =
      {
        contract:
          CONTRACT,
        state,
        open:
          openOverlay,
        close:
          closeOverlay,
        toggle:
          toggleOverlay,
        setLens,
        stop:
          stopRenderer,
        dispose
      };
  }

  function waitForRegistry(
    attempt
  ) {
    if (
      state.disposed ||
      state.registryReady
    ) {
      return;
    }

    state.registryAttempts =
      attempt;

    const located =
      locateRegistrySource();

    if (located) {
      installRegistry(
        located.routes,
        located.source
      );

      return;
    }

    if (attempt >= 160) {
      state.registryReady =
        false;

      setStatus(
        "The room registry is unavailable. The estate remains in architectural mode.",
        "waiting"
      );

      runAudit();
      publishState(
        "registry-missing",
        true
      );

      return;
    }

    root.setTimeout(
      () => {
        waitForRegistry(
          attempt + 1
        );
      },
      50
    );
  }

  function mount() {
    if (
      state.mounted ||
      state.disposed
    ) {
      return publicStatus();
    }

    try {
      state.geometry =
        buildEstateGeometry();

      const geometryValidation =
        state.geometry.validate();

      if (
        !geometryValidation.passed
      ) {
        throw new Error(
          "Estate geometry validation failed."
        );
      }

      state.geometryReady =
        true;

      root.DGB_MANOR_BLUEPRINT_3D_GEOMETRY_RECEIPT =
        state.geometry.getReceipt();

      buildGeneratedDom();
      exposeApis();

      state.mounted =
        true;

      updateNodeBindingsOnGeometry();
      updateRevealState();
      runAudit();
      waitForRegistry(0);
      registerAdapterWhenAvailable(0);

      setStatus(
        "Preparing the Mirrorland estate…",
        "waiting"
      );

      publishState(
        "mount",
        true
      );

      dispatch(
        EVENT_READY,
        Object.freeze({
          contract:
            CONTRACT,
          geometryContract:
            GEOMETRY_CONTRACT,
          rendererContract:
            RENDERER_CONTRACT,
          uiContract:
            UI_CONTRACT,
          status:
            publicStatus()
        })
      );

      return publicStatus();
    } catch (error) {
      exposeApis();
      recordError(
        "mount",
        error
      );

      return publicStatus();
    }
  }

  function dispose() {
    if (state.disposed) {
      return publicStatus();
    }

    stopRenderer();

    state.disposed =
      true;

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }

    if (
      state.intersectionObserver
    ) {
      state.intersectionObserver.disconnect();
      state.intersectionObserver =
        null;
    }

    if (
      state.abortController
    ) {
      try {
        state.abortController.abort();
      } catch (_error) {}
    }

    disposeProgramsAndBuffers();

    state.gl = null;
    state.webglReady = false;

    for (
      const node of
      [
        state.overlay,
        state.bubble
      ]
    ) {
      if (node) {
        try {
          node.remove();
        } catch (_error) {}
      }
    }

    state.overlay = null;
    state.bubble = null;
    state.mounted = false;

    publishState(
      "dispose",
      true
    );

    if (
      root.__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__ &&
      root.__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__.state ===
        state
    ) {
      root.__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__ =
        null;
    }

    return publicStatus();
  }

  function initialize() {
    exposeApis();
    mount();
  }

  if (
    doc.readyState ===
    "loading"
  ) {
    doc.addEventListener(
      "DOMContentLoaded",
      initialize,
      signal
        ? {
            signal,
            once: true
          }
        : {
            once: true
          }
    );
  } else {
    initialize();
  }
})(window, document);
