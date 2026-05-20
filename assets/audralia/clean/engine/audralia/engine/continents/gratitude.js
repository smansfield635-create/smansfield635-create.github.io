// /assets/audralia/clean/engine/audralia/engine/continents/gratitude.js
// AUDRALIA_G2_9_GRATITUDE_SOURCE_TOPOLOGY_FIGURE_EIGHT_AUTHORITY_TNT_v1
// Full-file replacement.
// Purpose: define Gratitude as the source topology field for the figure-eight traversal.
// Classic script. No imports. No exports. No drawing. No parent mount. No FORM_VISIBLE claim.
// Owns: Gratitude source topology, category meaning, field anchors, and traversal receipts.
// Does not own: canvas, parent expression, runtime, route bridge, hydrology behavior, surface material, terrain, elevation, final pixels, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_9_GRATITUDE_SOURCE_TOPOLOGY_FIGURE_EIGHT_AUTHORITY_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1";
  const COMPATIBLE_CONTRACTS = Object.freeze([
    "AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1",
    "AUDRALIA_G2_6_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_CHILD_TNT_v1",
    "AUDRALIA_G2_6_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_CHILD_TNT_v1",
    "AUDRALIA_G2_6_TOPOLOGY_ONLY_GRATITUDE_CHILD_TNT_v1"
  ]);

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js";
  const ROUTE = "/showroom/globe/audralia/";
  const SUMMIT = "Gratitude";
  const SOURCE_ROLE = "source-foot";
  const FIGURE_EIGHT_MODEL = "source_to_broker_to_parent_expression_to_bridge_receipt_to_source_reconciliation_to_final_expression";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const PHI = 1.618033988749895;

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrapDegrees(value) {
    let out = finite(value, 0);
    while (out <= -180) out += 360;
    while (out > 180) out -= 360;
    return out;
  }

  function round3(value) {
    return Math.round(finite(value, 0) * 1000) / 1000;
  }

  function point(lon, lat, label = "") {
    return Object.freeze({
      lon: round3(lon),
      lat: round3(lat),
      label: String(label || "")
    });
  }

  function ring(cx, cy, rx, ry, count, seed, wobble = 0.08, label = "ring") {
    const points = [];

    for (let i = 0; i < count; i += 1) {
      const angle = (TAU * i) / count;
      const pulseA = Math.sin(angle * 3 + seed * 0.011) * wobble;
      const pulseB = Math.cos(angle * 5 + seed * 0.017) * wobble * 0.55;
      const pulseC = Math.sin(angle * 7 + seed * 0.023) * wobble * 0.28;
      const scale = 1 + pulseA + pulseB + pulseC;
      points.push(point(cx + Math.cos(angle) * rx * scale, cy + Math.sin(angle) * ry * scale, `${label}-${i + 1}`));
    }

    return Object.freeze(points);
  }

  function anchor(id, family, lon, lat, radiusLon, radiusLat, weight, meaning, options = {}) {
    return Object.freeze({
      id: String(id || "anchor"),
      summit: SUMMIT,
      family: String(family || "source"),
      lon: round3(lon),
      lat: round3(lat),
      radiusLon: Math.max(0.0001, round3(radiusLon)),
      radiusLat: Math.max(0.0001, round3(radiusLat)),
      weight: round3(weight === undefined ? 1 : weight),
      tiltDegrees: round3(options.tiltDegrees || 0),
      polarity: String(options.polarity || "positive"),
      category: String(options.category || family || "source"),
      district: String(options.district || "GRATITUDE_GENERAL"),
      phase: String(options.phase || "source"),
      meaning: String(meaning || ""),
      closedContainmentAuthority: false,
      polygonPrimary: false,
      directDrawing: false
    });
  }

  function scoreAnchor(lon, lat, item) {
    const dx = wrapDegrees(finite(lon, 0) - finite(item.lon, 0));
    const dy = finite(lat, 0) - finite(item.lat, 0);
    const angle = finite(item.tiltDegrees, 0) * DEG;
    const c = Math.cos(-angle);
    const s = Math.sin(-angle);
    const x = dx * c - dy * s;
    const y = dx * s + dy * c;
    const rx = Math.max(0.0001, finite(item.radiusLon, 1));
    const ry = Math.max(0.0001, finite(item.radiusLat, 1));
    const q = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    const core = smoothstep(1.18, -0.22, q);
    const fringe = smoothstep(1.86, 0.72, q) * 0.28;
    return clamp01(core + fringe) * finite(item.weight, 1);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((finite(value, 0) - finite(edge0, 0)) / Math.max(0.000001, finite(edge1, 1) - finite(edge0, 0)));
    return t * t * (3 - 2 * t);
  }

  function maxScore(lon, lat, anchors) {
    let best = 0;
    let bestAnchor = null;

    for (const item of anchors || []) {
      const score = scoreAnchor(lon, lat, item);
      if (score > best) {
        best = score;
        bestAnchor = item;
      }
    }

    return Object.freeze({
      value: clamp01(best),
      anchorId: bestAnchor ? bestAnchor.id : "",
      family: bestAnchor ? bestAnchor.family : "",
      district: bestAnchor ? bestAnchor.district : "",
      category: bestAnchor ? bestAnchor.category : ""
    });
  }

  function sumScore(lon, lat, anchors, cap = 2) {
    let total = 0;

    for (const item of anchors || []) {
      total += scoreAnchor(lon, lat, item);
    }

    return clamp(total, 0, cap);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  const SOURCE_BOUNDARY_ANCHORS = Object.freeze([
    point(-83.8, -8.8, "west-south-pressure-return"),
    point(-87.2, -3.1, "western-adversity-low-gate"),
    point(-84.4, 2.6, "western-shelter-first-opening"),
    point(-87.8, 8.7, "hard-west-recoil"),
    point(-84.6, 15.2, "northwest-continuance-rise"),
    point(-86.7, 22.4, "northwest-light-bearing-shoulder"),
    point(-79.8, 29.4, "north-continuance-lift"),
    point(-73.2, 35.8, "north-receiving-edge"),
    point(-65.4, 41.2, "north-high-continuance"),
    point(-55.2, 44.5, "upper-memory-crown"),
    point(-43.8, 44.1, "north-open-crown"),
    point(-32.6, 40.7, "northeast-outreach"),
    point(-23.1, 35.7, "reopening-shoulder"),
    point(-15.9, 28.4, "east-access-rise"),
    point(-8.8, 20.6, "east-reopening-point"),
    point(-13.8, 14.7, "east-return-bend"),
    point(-6.2, 8.2, "eastern-fracture-inlet"),
    point(-13.4, 2.2, "eastern-repaired-opening"),
    point(-8.4, -4.8, "southeast-broken-access"),
    point(-16.8, -10.6, "southeast-restoration-bend"),
    point(-21.6, -17.4, "south-repair-basin-edge"),
    point(-30.2, -22.2, "south-wetland-arrival"),
    point(-38.6, -27.8, "southern-restoration-lagoon-mouth"),
    point(-48.3, -30.8, "south-memory-return"),
    point(-57.4, -28.5, "southwest-survival-shelf"),
    point(-65.6, -33.2, "southwest-deep-repair"),
    point(-72.4, -27.6, "west-south-survival-edge"),
    point(-78.2, -22.2, "western-pressure-lower-wall"),
    point(-72.5, -17.6, "west-lower-shelter-return"),
    point(-80.5, -13.8, "west-adversity-final-bite")
  ]);

  const INTERIOR_MEMORY_LAKES = Object.freeze([
    ring(-47.8, 14.3, 8.8, 6.1, 24, 5101, 0.06, "northern-memory-lake"),
    ring(-60.1, -9.6, 6.9, 4.8, 20, 5102, 0.07, "western-memory-lake"),
    ring(-35.9, 31.2, 3.8, 2.7, 14, 5103, 0.08, "north-small-memory-lake"),
    ring(-40.4, -22.7, 4.4, 3.0, 14, 5104, 0.08, "south-small-memory-lake")
  ]);

  const RESTORATION_LAGOONS = Object.freeze([
    ring(-53.2, -27.1, 8.4, 3.2, 18, 5201, 0.09, "south-restoration-lagoon"),
    ring(-13.5, 3.2, 4.4, 2.7, 14, 5202, 0.09, "east-reopening-lagoon")
  ]);

  const FIELD_ANCHORS = Object.freeze([
    anchor("existence-core", "fieldAnchors", -49, 7, 44, 36, 1.10, "The central gratitude field that receives existence as a gift after pressure.", { district: "EXISTENCE_CORE", category: "EXISTENCE_CORE", tiltDegrees: -8 }),
    anchor("main-survival-mass", "fieldAnchors", -52, 4, 39, 31, 0.88, "The primary surviving body where adversity does not close the continent.", { district: "SURVIVAL_BODY", category: "LAND_PRESSURE", tiltDegrees: -9 }),
    anchor("west-adversity-wall", "fieldAnchors", -73, 7, 18, 34, 0.52, "The western pressure body that absorbed the oldest adversity.", { district: "ADVERSITY_EDGE", category: "HARD_SOURCE_PRESSURE", tiltDegrees: -14 }),
    anchor("north-continuance-shoulder", "fieldAnchors", -47, 34, 31, 14, 0.46, "The northern shoulder that remains open to light and movement.", { district: "CONTINUANCE_EDGE", category: "CONTINUANCE_SHOULDER", tiltDegrees: 2 }),
    anchor("east-reopening-reach", "fieldAnchors", -18, 15, 17, 19, 0.42, "The eastern reach where fracture becomes access.", { district: "REOPENING_EDGE", category: "REOPENING_REACH", tiltDegrees: 10 }),
    anchor("south-restoration-belt", "fieldAnchors", -47, -23, 30, 13, 0.44, "The southern belt where loss becomes survivable through repair.", { district: "RESTORATION_EDGE", category: "RESTORATION_BELT", tiltDegrees: 2 }),
    anchor("interior-memory-rise", "fieldAnchors", -38, -8, 21, 20, 0.30, "The interior field that keeps memory protected without turning memory into closure.", { district: "MEMORY_FIELD", category: "MEMORY_RISE", tiltDegrees: 18 })
  ]);

  const EDGE_ANCHORS = Object.freeze([
    anchor("west-hard-coast", "edgeAnchors", -78, 6, 12, 31, 0.74, "Hard western coast category; it remembers pressure without owning elevation.", { district: "ADVERSITY_EDGE", category: "HARD_COAST", tiltDegrees: -4 }),
    anchor("southwest-survival-edge", "edgeAnchors", -67, -22, 14, 18, 0.48, "Southwestern survival edge where pressure becomes boundary discipline.", { district: "ADVERSITY_EDGE", category: "SURVIVAL_EDGE", tiltDegrees: 8 }),
    anchor("north-continuance-beach", "edgeAnchors", -54, 40, 33, 8, 0.52, "Northern continuance beach arc; light remains reachable.", { district: "CONTINUANCE_EDGE", category: "BEACH_ARC", tiltDegrees: 1 }),
    anchor("east-reopening-coast", "edgeAnchors", -13, 9, 11, 21, 0.62, "Eastern coast that reopens after fracture.", { district: "REOPENING_EDGE", category: "REOPENING_COAST", tiltDegrees: 5 }),
    anchor("south-restoration-coast", "edgeAnchors", -48, -29, 31, 7, 0.58, "Southern restored coast where soft water boundaries receive loss.", { district: "RESTORATION_EDGE", category: "RESTORATION_COAST", tiltDegrees: 2 })
  ]);

  const WATER_MEMORY_ANCHORS = Object.freeze([
    anchor("north-memory-lake", "waterMemoryAnchors", -47.8, 14.3, 8.8, 6.1, 0.95, "Protected northern lake memory: memory held without becoming terrain authority.", { district: "MEMORY_FIELD", category: "LAKE_MEMORY" }),
    anchor("west-memory-lake", "waterMemoryAnchors", -60.1, -9.6, 6.9, 4.8, 0.92, "Western lake memory: survival remembered without sealing the source.", { district: "MEMORY_FIELD", category: "LAKE_MEMORY" }),
    anchor("north-small-memory-lake", "waterMemoryAnchors", -35.9, 31.2, 3.8, 2.7, 0.68, "Small northern protected memory water.", { district: "CONTINUANCE_EDGE", category: "SMALL_LAKE_MEMORY" }),
    anchor("south-small-memory-lake", "waterMemoryAnchors", -40.4, -22.7, 4.4, 3.0, 0.68, "Small southern repair-memory water.", { district: "RESTORATION_EDGE", category: "SMALL_LAKE_MEMORY" })
  ]);

  const SHELTER_ANCHORS = Object.freeze([
    anchor("western-shelter-mouth", "shelterAnchors", -78, 5, 5.8, 5.2, 0.74, "Western shelter opening where life withdrew under pressure.", { district: "ADVERSITY_EDGE", category: "CAVERN_MOUTH" }),
    anchor("southwest-repaired-shelter", "shelterAnchors", -68, -22, 5.4, 4.8, 0.62, "Southwestern shelter opening restored after pressure.", { district: "RESTORATION_EDGE", category: "CAVERN_MOUTH" }),
    anchor("eastern-reopened-shelter", "shelterAnchors", -16, 1, 5.2, 5.0, 0.60, "Eastern reopened shelter-mouth boundary.", { district: "REOPENING_EDGE", category: "CAVERN_MOUTH" })
  ]);

  const REPAIR_ANCHORS = Object.freeze([
    anchor("southern-soft-restoration", "repairAnchors", -50, -23, 28, 10, 0.62, "Southern wetland restoration belt where the edge softens without losing form.", { district: "RESTORATION_EDGE", category: "WETLAND_REPAIR", tiltDegrees: 2 }),
    anchor("south-restoration-lagoon", "repairAnchors", -53.2, -27.1, 9.0, 3.6, 0.92, "Protected lagoon of restoration at the southern edge.", { district: "RESTORATION_EDGE", category: "LAGOON_REPAIR", tiltDegrees: 2 }),
    anchor("southeast-repaired-wetland", "repairAnchors", -18, -5, 14, 11, 0.38, "Southeastern repaired wetland transition.", { district: "RESTORATION_EDGE", category: "WETLAND_REPAIR", tiltDegrees: -8 }),
    anchor("east-reopening-lagoon", "repairAnchors", -13.5, 3.2, 4.9, 2.9, 0.80, "Eastern protected lagoon where reopening becomes safe access.", { district: "REOPENING_EDGE", category: "LAGOON_REPAIR" })
  ]);

  const FRACTURE_ANCHORS = Object.freeze([
    anchor("east-inlet-cut", "fractureAnchors", -9, 6, 14, 24, 0.62, "Eastern inlet cut where fracture became access.", { district: "REOPENING_EDGE", category: "INLET_FRACTURE", tiltDegrees: 8, polarity: "cut" }),
    anchor("southeast-fracture-cut", "fractureAnchors", -14, -8, 18, 13, 0.38, "Southeastern fracture cut that must be reconciled by water-return.", { district: "REOPENING_EDGE", category: "FRACTURE_CUT", tiltDegrees: -18, polarity: "cut" }),
    anchor("south-lagoon-cut", "fractureAnchors", -55, -31, 20, 9, 0.48, "Southern lagoon cut where loss becomes access to repair.", { district: "RESTORATION_EDGE", category: "LAGOON_CUT", tiltDegrees: 3, polarity: "cut" }),
    anchor("west-pressure-bite", "fractureAnchors", -80, -17, 13, 13, 0.28, "Western pressure bite that marks adversity without closing the field.", { district: "ADVERSITY_EDGE", category: "PRESSURE_CUT", tiltDegrees: -12, polarity: "cut" }),
    anchor("west-shelter-cut", "fractureAnchors", -77, 4, 12, 11, 0.22, "Western shelter cut: opening rather than collapse.", { district: "ADVERSITY_EDGE", category: "SHELTER_CUT", tiltDegrees: 18, polarity: "cut" })
  ]);

  const RETURN_ANCHORS = Object.freeze([
    anchor("source-return-core", "returnAnchors", -49, 7, 16, 13, 1.00, "Return point for route-bridge receipt reconciliation.", { district: "EXISTENCE_CORE", category: "RECEIPT_RETURN" }),
    anchor("west-return-witness", "returnAnchors", -75, 8, 8, 20, 0.62, "Return witness that confirms adversity was expressed without letting adversity own the parent.", { district: "ADVERSITY_EDGE", category: "RECEIPT_RETURN" }),
    anchor("east-return-witness", "returnAnchors", -14, 5, 8, 17, 0.58, "Return witness that confirms reopening was expressed as access.", { district: "REOPENING_EDGE", category: "RECEIPT_RETURN" }),
    anchor("south-return-witness", "returnAnchors", -50, -25, 18, 8, 0.58, "Return witness that confirms restoration was expressed as soft survival.", { district: "RESTORATION_EDGE", category: "RECEIPT_RETURN" }),
    anchor("north-return-witness", "returnAnchors", -51, 39, 22, 7, 0.48, "Return witness that confirms continuance remained open to light.", { district: "CONTINUANCE_EDGE", category: "RECEIPT_RETURN" })
  ]);

  const DISTRICTS = Object.freeze({
    adversityEdge: Object.freeze({
      id: "ADVERSITY_EDGE",
      name: "Adversity Edge",
      location: "west",
      meaning: "The western pressure edge absorbed the oldest adversity without receiving authority over final expression.",
      sourceCategories: Object.freeze(["HARD_COAST", "SURVIVAL_EDGE", "CAVERN_MOUTH", "PRESSURE_CUT", "SHELTER_CUT"]),
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false
    }),
    continuanceEdge: Object.freeze({
      id: "CONTINUANCE_EDGE",
      name: "Continuance Edge",
      location: "north",
      meaning: "The northern shoulder remains open to light and movement after pressure.",
      sourceCategories: Object.freeze(["BEACH_ARC", "CONTINUANCE_SHOULDER", "SMALL_LAKE_MEMORY", "RECEIPT_RETURN"]),
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false
    }),
    reopeningEdge: Object.freeze({
      id: "REOPENING_EDGE",
      name: "Reopening Edge",
      location: "east",
      meaning: "The eastern broken-open side becomes access instead of closure.",
      sourceCategories: Object.freeze(["REOPENING_COAST", "REOPENING_REACH", "INLET_FRACTURE", "FRACTURE_CUT", "LAGOON_REPAIR", "CAVERN_MOUTH"]),
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false
    }),
    restorationEdge: Object.freeze({
      id: "RESTORATION_EDGE",
      name: "Restoration Edge",
      location: "south",
      meaning: "The southern boundary receives repair through wetlands, lagoons, and soft return.",
      sourceCategories: Object.freeze(["RESTORATION_COAST", "RESTORATION_BELT", "WETLAND_REPAIR", "LAGOON_REPAIR", "LAGOON_CUT", "CAVERN_MOUTH"]),
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false
    }),
    memoryField: Object.freeze({
      id: "MEMORY_FIELD",
      name: "Memory Field",
      location: "interior",
      meaning: "Protected interior water-memory regions preserve memory without becoming terrain basins.",
      sourceCategories: Object.freeze(["LAKE_MEMORY", "SMALL_LAKE_MEMORY", "MEMORY_RISE"]),
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false
    }),
    existenceCore: Object.freeze({
      id: "EXISTENCE_CORE",
      name: "Existence Core",
      location: "central",
      meaning: "The central gratitude field keeps the continent open after pressure because existence is still received as a gift.",
      sourceCategories: Object.freeze(["EXISTENCE_CORE", "RECEIPT_RETURN"]),
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false
    })
  });

  const SOURCE_FIELD = Object.freeze({
    id: "gratitude-source-topology-field",
    summit: SUMMIT,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    compatibleContracts: COMPATIBLE_CONTRACTS,
    route: ROUTE,
    target: TARGET,

    sourceFieldAuthority: true,
    topologyOnly: true,
    figureEightSource: true,
    quadrupedicTraversalRole: SOURCE_ROLE,
    figureEightModel: FIGURE_EIGHT_MODEL,

    closedContainmentAuthority: false,
    polygonPrimary: false,
    directDrawing: false,
    parentMayConsumeAsField: true,
    brokerMayReconcile: true,
    hydrologyMayInherit: true,
    surfaceMayInherit: true,
    routeBridgeMayVerifyReceipt: true,

    terrainOwned: false,
    elevationOwned: false,
    hydrologyOwned: false,
    surfaceOwned: false,
    parentExpressionOwned: false,
    runtimeOwned: false,
    routeOwned: false,
    htmlOwned: false,
    formVisibleClaim: false,
    visualPassClaim: false,

    story: "Gratitude is the first surviving source field: adversity enters, survival holds, water remembers, repair softens the edge, reopening becomes access, and receipt returns to the source without letting the child override the parent expression.",

    districts: DISTRICTS,
    sourceBoundaryAnchors: SOURCE_BOUNDARY_ANCHORS,
    interiorMemoryLakes: INTERIOR_MEMORY_LAKES,
    restorationLagoons: RESTORATION_LAGOONS,

    fieldAnchors: FIELD_ANCHORS,
    edgeAnchors: EDGE_ANCHORS,
    waterMemoryAnchors: WATER_MEMORY_ANCHORS,
    shelterAnchors: SHELTER_ANCHORS,
    repairAnchors: REPAIR_ANCHORS,
    fractureAnchors: FRACTURE_ANCHORS,
    returnAnchors: RETURN_ANCHORS,

    allAnchorFamilies: Object.freeze([
      "fieldAnchors",
      "edgeAnchors",
      "waterMemoryAnchors",
      "shelterAnchors",
      "repairAnchors",
      "fractureAnchors",
      "returnAnchors"
    ]),

    sourceTraversal: Object.freeze({
      incoming: "Gratitude source topology receives adversity, continuance, reopening, restoration, memory, and existence signals.",
      broker: "continents.js may reconcile these source signals without drawing final pixels.",
      parentExpression: "audralia.engine.js may consume this source field as atlas input and express it visually.",
      bridgeReceipt: "the route bridge may verify parent expression and return receipt state.",
      sourceReconciliation: "Gratitude remains the reference source for whether expression remained lawful.",
      finalExpression: "final visual expression belongs to parent/bridge closure, not this child file."
    })
  });

  const TOPOLOGY_COMPATIBILITY = Object.freeze({
    id: "gratitude-source-topology-compatibility-body",
    summit: SUMMIT,
    cells: 21,
    className: "primary-source-field",
    localLattice: "gratitude_21_source_topology_figure_eight_lattice",
    backstory: SOURCE_FIELD.story,
    topologyOnly: true,
    sourceFieldAuthority: true,
    figureEightSource: true,
    closedContainmentAuthority: false,
    polygonPrimary: false,
    directDrawing: false,
    terrainOwned: false,
    elevationOwned: false,
    hydrologyOwned: false,
    surfaceOwned: false,
    parentExpressionOwned: false,
    color: "rgba(78, 170, 106, 0.42)",

    landmasses: Object.freeze([
      Object.freeze({
        id: "gratitude-source-field-main-body",
        type: "primary-source-field",
        cells: 21,
        oceanAdjacency: true,
        closedContainmentAuthority: false,
        polygonPrimary: false,
        directDrawing: false,
        boundary: SOURCE_BOUNDARY_ANCHORS,
        topology: Object.freeze({
          oceanAdjacency: true,
          beaches: Object.freeze([
            Object.freeze({ start: 5, end: 11, label: "north continuance beach source arc", sourceCategory: "BEACH_ARC" }),
            Object.freeze({ start: 13, end: 18, label: "east reopening beach source arc", sourceCategory: "REOPENING_COAST" }),
            Object.freeze({ start: 21, end: 24, label: "south restoration beach source arc", sourceCategory: "RESTORATION_COAST" })
          ]),
          cliffEdges: Object.freeze([
            Object.freeze({ start: 27, end: 4, label: "west adversity hard shoreline source category", sourceCategory: "HARD_COAST" }),
            Object.freeze({ start: 24, end: 28, label: "southwest survival edge source category", sourceCategory: "SURVIVAL_EDGE" })
          ]),
          cavernMouths: Object.freeze([
            point(-78, 5, "western shelter mark where life withdrew during pressure"),
            point(-68, -22, "southwestern repaired shelter-mouth source boundary"),
            point(-16, 1, "eastern reopened shelter-mouth source boundary")
          ]),
          lakes: INTERIOR_MEMORY_LAKES,
          bays: Object.freeze([
            Object.freeze({ start: 15, end: 18, label: "eastern reopened bay from fractured source boundary", sourceCategory: "INLET_FRACTURE" }),
            Object.freeze({ start: 21, end: 24, label: "southern restored bay where loss became access", sourceCategory: "LAGOON_CUT" })
          ]),
          inlets: Object.freeze([
            Object.freeze({ start: 15, end: 17, label: "narrow eastern inlet of reopening", sourceCategory: "INLET_FRACTURE" }),
            Object.freeze({ start: 23, end: 25, label: "south-southwest restoration inlet", sourceCategory: "LAGOON_CUT" })
          ]),
          peninsulas: Object.freeze([
            Object.freeze({ start: 4, end: 8, label: "northwestern continuance shoulder", sourceCategory: "CONTINUANCE_SHOULDER" }),
            Object.freeze({ start: 10, end: 14, label: "northeastern outreach point", sourceCategory: "REOPENING_REACH" }),
            Object.freeze({ start: 15, end: 18, label: "eastern reach after survival", sourceCategory: "REOPENING_REACH" })
          ]),
          lagoons: RESTORATION_LAGOONS,
          wetlands: Object.freeze([
            Object.freeze({ start: 20, end: 25, label: "southern soft restoration source boundary", sourceCategory: "WETLAND_REPAIR" }),
            Object.freeze({ start: 18, end: 20, label: "southeastern repaired wetland transition", sourceCategory: "WETLAND_REPAIR" })
          ])
        })
      })
    ]),

    historyMap: Object.freeze({
      westCoast: DISTRICTS.adversityEdge,
      northCoast: DISTRICTS.continuanceEdge,
      eastCoast: DISTRICTS.reopeningEdge,
      southCoast: DISTRICTS.restorationEdge,
      interior: DISTRICTS.memoryField,
      core: DISTRICTS.existenceCore
    }),

    categoryMeanings: Object.freeze({
      LANDMASS: "above-seawater source field; not a closed-containment command",
      OCEAN_ADJACENCY: "where parent seawater may read Gratitude's source edge",
      BEACH: "soft source transition between land pressure and water return",
      CLIFF_EDGE: "hard shoreline category only; not vertical height",
      CAVERN_MOUTH: "shelter/opening category only; not a 3D cave",
      LAKE: "interior water-memory boundary only; not hydrology simulation",
      BAY: "recessed water-access source category",
      INLET: "narrow water-entry source category",
      PENINSULA: "outreach land-pressure source category",
      LAGOON: "protected water-memory source near restored coast",
      WETLAND: "soft repair transition source category",
      RECEIPT_RETURN: "figure-eight return marker for verification after expression"
    })
  });

  function classifyDominantDistrict(lon, lat) {
    const familyScores = Object.freeze({
      adversity: maxScore(lon, lat, [...EDGE_ANCHORS, ...SHELTER_ANCHORS, ...FRACTURE_ANCHORS].filter((item) => item.district === "ADVERSITY_EDGE")),
      continuance: maxScore(lon, lat, [...FIELD_ANCHORS, ...EDGE_ANCHORS, ...RETURN_ANCHORS].filter((item) => item.district === "CONTINUANCE_EDGE")),
      reopening: maxScore(lon, lat, [...FIELD_ANCHORS, ...EDGE_ANCHORS, ...REPAIR_ANCHORS, ...FRACTURE_ANCHORS, ...SHELTER_ANCHORS].filter((item) => item.district === "REOPENING_EDGE")),
      restoration: maxScore(lon, lat, [...FIELD_ANCHORS, ...EDGE_ANCHORS, ...REPAIR_ANCHORS, ...FRACTURE_ANCHORS, ...SHELTER_ANCHORS].filter((item) => item.district === "RESTORATION_EDGE")),
      memory: maxScore(lon, lat, [...FIELD_ANCHORS, ...WATER_MEMORY_ANCHORS].filter((item) => item.district === "MEMORY_FIELD")),
      existence: maxScore(lon, lat, [...FIELD_ANCHORS, ...RETURN_ANCHORS].filter((item) => item.district === "EXISTENCE_CORE"))
    });

    let bestName = "general";
    let bestScore = 0;
    let bestDetail = null;

    for (const [name, detail] of Object.entries(familyScores)) {
      if (detail.value > bestScore) {
        bestName = name;
        bestScore = detail.value;
        bestDetail = detail;
      }
    }

    return Object.freeze({
      districtName: bestName,
      districtId: bestDetail ? bestDetail.district : "GRATITUDE_GENERAL",
      category: bestDetail ? bestDetail.category : "SOURCE_FIELD",
      anchorId: bestDetail ? bestDetail.anchorId : "",
      score: clamp01(bestScore)
    });
  }

  function sampleTopologyField(lonInput, latInput, context = {}) {
    const lon = wrapDegrees(lonInput);
    const lat = clamp(finite(latInput, 0), -90, 90);

    const fieldPressure = sumScore(lon, lat, FIELD_ANCHORS, 2.4);
    const edgePressure = sumScore(lon, lat, EDGE_ANCHORS, 1.8);
    const waterMemory = maxScore(lon, lat, WATER_MEMORY_ANCHORS);
    const shelter = maxScore(lon, lat, SHELTER_ANCHORS);
    const repair = maxScore(lon, lat, REPAIR_ANCHORS);
    const fracture = maxScore(lon, lat, FRACTURE_ANCHORS);
    const receiptReturn = maxScore(lon, lat, RETURN_ANCHORS);
    const district = classifyDominantDistrict(lon, lat);

    const sourceStrength = clamp01(fieldPressure * 0.42 + edgePressure * 0.22 + repair.value * 0.18 + waterMemory.value * 0.14 + receiptReturn.value * 0.10 - fracture.value * 0.12);
    const openingSignal = clamp01(fracture.value * 0.46 + shelter.value * 0.34 + repair.value * 0.20);
    const restorationSignal = clamp01(repair.value * 0.58 + waterMemory.value * 0.22 + receiptReturn.value * 0.20);
    const adversitySignal = clamp01(edgePressure * 0.32 + shelter.value * 0.22 + fracture.value * 0.26);
    const continuanceSignal = clamp01(district.districtId === "CONTINUANCE_EDGE" ? district.score : maxScore(lon, lat, FIELD_ANCHORS.filter((item) => item.district === "CONTINUANCE_EDGE")).value);
    const memorySignal = clamp01(waterMemory.value * 0.76 + sourceStrength * 0.12);
    const returnSignal = clamp01(receiptReturn.value * 0.82 + sourceStrength * 0.18);

    let sourceClass = "outer-ocean-context";

    if (sourceStrength > 0.58) sourceClass = "gratitude-source-land-pressure";
    else if (sourceStrength > 0.34) sourceClass = "gratitude-source-coastal-transition";
    else if (openingSignal > 0.38) sourceClass = "gratitude-source-opening-cut";
    else if (memorySignal > 0.42) sourceClass = "gratitude-source-water-memory";
    else if (restorationSignal > 0.38) sourceClass = "gratitude-source-restoration-soft-edge";

    if (waterMemory.value > 0.54) sourceClass = "gratitude-source-interior-water-memory";
    if (repair.value > 0.60) sourceClass = "gratitude-source-restoration-field";
    if (fracture.value > 0.60) sourceClass = "gratitude-source-reopening-fracture";
    if (shelter.value > 0.58) sourceClass = "gratitude-source-shelter-opening";
    if (receiptReturn.value > 0.62) sourceClass = "gratitude-source-receipt-return";

    return Object.freeze({
      contract: CONTRACT,
      summit: SUMMIT,
      lon,
      lat,
      contextTag: String(context && context.tag ? context.tag : ""),

      allowed: true,
      sourceFieldAuthority: true,
      figureEightSource: true,
      quadrupedicTraversalRole: SOURCE_ROLE,
      closedContainmentAuthority: false,
      polygonPrimary: false,
      directDrawing: false,
      renderInstruction: false,
      canvasInstruction: false,
      formVisibleClaim: false,
      visualPassClaim: false,

      sourceClass,
      districtName: district.districtName,
      districtId: district.districtId,
      dominantCategory: district.category,
      dominantAnchorId: district.anchorId,

      signals: Object.freeze({
        sourceStrength,
        fieldPressure: clamp01(fieldPressure / 2.4),
        edgePressure: clamp01(edgePressure / 1.8),
        waterMemory: waterMemory.value,
        shelter: shelter.value,
        repair: repair.value,
        fracture: fracture.value,
        receiptReturn: receiptReturn.value,
        openingSignal,
        restorationSignal,
        adversitySignal,
        continuanceSignal,
        memorySignal,
        returnSignal
      }),

      inheritance: Object.freeze({
        hydrologyMayInherit: true,
        surfaceMayInherit: true,
        brokerMayReconcile: true,
        parentMayConsumeAsField: true,
        routeBridgeMayVerifyReceipt: true
      })
    });
  }

  function getSourceField() {
    return clone(SOURCE_FIELD);
  }

  function getTopology() {
    return clone(TOPOLOGY_COMPATIBILITY);
  }

  function getFigureEightSource() {
    return Object.freeze({
      contract: CONTRACT,
      summit: SUMMIT,
      model: FIGURE_EIGHT_MODEL,
      sourceFoot: TARGET,
      sourceFieldAuthority: true,
      figureEightSource: true,
      quadrupedicTraversalRole: SOURCE_ROLE,
      path: Object.freeze([
        "source",
        "broker",
        "parent-expression",
        "bridge-receipt",
        "source-reconciliation",
        "final-expression"
      ]),
      crossingPoint: "/assets/audralia/clean/engine/audralia.engine.js",
      returnVerifier: "/showroom/globe/audralia/index.js",
      childDoesNotCloseVisualContract: true,
      parentExpressionOwned: false,
      closedContainmentAuthority: false,
      directDrawing: false,
      visualPassClaim: false
    });
  }

  function getTraversalReceipt() {
    return Object.freeze({
      contract: CONTRACT,
      target: TARGET,
      route: ROUTE,
      summit: SUMMIT,
      sourceFieldAuthority: true,
      figureEightSource: true,
      quadrupedicTraversalRole: SOURCE_ROLE,
      sourceReady: true,
      brokerReconciliationReady: true,
      parentAtlasInputReady: true,
      hydrologyInheritanceReady: true,
      surfaceInheritanceReady: true,
      receiptReturnReady: true,
      closedContainmentAuthority: false,
      polygonPrimary: false,
      directDrawing: false,
      terrainOwned: false,
      elevationOwned: false,
      hydrologyOwned: false,
      surfaceOwned: false,
      parentExpressionOwned: false,
      runtimeOwned: false,
      routeOwned: false,
      htmlOwned: false,
      formVisibleClaim: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaim: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      compatibleContracts: COMPATIBLE_CONTRACTS,
      target: TARGET,
      route: ROUTE,
      summit: SUMMIT,

      sourceFieldAuthority: true,
      topologyOnly: true,
      figureEightSource: true,
      quadrupedicTraversalRole: SOURCE_ROLE,
      figureEightModel: FIGURE_EIGHT_MODEL,

      closedContainmentAuthority: false,
      polygonPrimary: false,
      directDrawing: false,
      parentMayConsumeAsField: true,
      brokerMayReconcile: true,
      hydrologyMayInherit: true,
      surfaceMayInherit: true,
      routeBridgeMayVerifyReceipt: true,

      fieldAnchorCount: FIELD_ANCHORS.length,
      edgeAnchorCount: EDGE_ANCHORS.length,
      waterMemoryAnchorCount: WATER_MEMORY_ANCHORS.length,
      shelterAnchorCount: SHELTER_ANCHORS.length,
      repairAnchorCount: REPAIR_ANCHORS.length,
      fractureAnchorCount: FRACTURE_ANCHORS.length,
      returnAnchorCount: RETURN_ANCHORS.length,
      sourceBoundaryAnchorCount: SOURCE_BOUNDARY_ANCHORS.length,
      interiorMemoryLakeCount: INTERIOR_MEMORY_LAKES.length,
      restorationLagoonCount: RESTORATION_LAGOONS.length,
      districtCount: Object.keys(DISTRICTS).length,

      owns: Object.freeze([
        "Gratitude source topology field",
        "adversity edge source categories",
        "continuance edge source categories",
        "reopening edge source categories",
        "restoration edge source categories",
        "interior memory source categories",
        "existence core source category",
        "figure-eight source receipt",
        "quadrupedic source-foot role"
      ]),

      doesNotOwn: Object.freeze([
        "canvas",
        "DOM drawing",
        "parent mount",
        "runtime mount",
        "route bridge",
        "ocean behavior",
        "hydrology simulation",
        "surface material rendering",
        "terrain",
        "elevation",
        "mountains",
        "plants",
        "animals",
        "climate",
        "final pixels",
        "FORM_VISIBLE",
        "visual pass"
      ]),

      terrainOwned: false,
      elevationOwned: false,
      hydrologyOwned: false,
      surfaceOwned: false,
      parentExpressionOwned: false,
      runtimeOwned: false,
      routeOwned: false,
      htmlOwned: false,
      formVisibleClaim: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaim: false,

      methods: Object.freeze([
        "getTopology",
        "getStatus",
        "status",
        "getSourceField",
        "getFigureEightSource",
        "getTraversalReceipt",
        "sampleTopologyField"
      ])
    });
  }

  const api = Object.freeze({
    CONTRACT,
    PREVIOUS_CONTRACT,
    COMPATIBLE_CONTRACTS,
    TARGET,
    ROUTE,
    SUMMIT,
    SOURCE_ROLE,
    FIGURE_EIGHT_MODEL,

    getTopology,
    getSourceField,
    getFigureEightSource,
    getTraversalReceipt,
    sampleTopologyField,
    getStatus,
    status: getStatus
  });

  if (typeof window !== "undefined") {
    window.AUDRALIA_TOPOLOGY_GRATITUDE = api;
    window.AUDRALIA_TOPOLOGY_GRATITUDE_RECEIPT = getStatus();
    window.AUDRALIA_GRATITUDE_SOURCE_FIELD = getSourceField();
    window.AUDRALIA_GRATITUDE_FIGURE_EIGHT_SOURCE = getFigureEightSource();
    window.AUDRALIA_GRATITUDE_TRAVERSAL_RECEIPT = getTraversalReceipt();
    window.AUDRALIA_GRATITUDE_SOURCE_TOPOLOGY_ACTIVE = true;
    window.AUDRALIA_GRATITUDE_FIGURE_EIGHT_SOURCE_ACTIVE = true;
    window.AUDRALIA_GRATITUDE_CLOSED_CONTAINMENT_AUTHORITY = false;
    window.AUDRALIA_GRATITUDE_POLYGON_PRIMARY = false;
    window.AUDRALIA_GRATITUDE_DIRECT_DRAWING = false;

    if (typeof document !== "undefined" && document.documentElement && document.documentElement.dataset) {
      document.documentElement.dataset.audraliaGratitudeTopologyLoaded = "true";
      document.documentElement.dataset.audraliaGratitudeTopologyContract = CONTRACT;
      document.documentElement.dataset.audraliaGratitudeSourceFieldAuthority = "true";
      document.documentElement.dataset.audraliaGratitudeFigureEightSource = "true";
      document.documentElement.dataset.audraliaGratitudeQuadrupedicTraversalRole = SOURCE_ROLE;
      document.documentElement.dataset.audraliaGratitudeClosedContainmentAuthority = "false";
      document.documentElement.dataset.audraliaGratitudePolygonPrimary = "false";
      document.documentElement.dataset.audraliaGratitudeDirectDrawing = "false";
      document.documentElement.dataset.audraliaGratitudeParentMayConsumeAsField = "true";
      document.documentElement.dataset.audraliaGratitudeBrokerMayReconcile = "true";
      document.documentElement.dataset.audraliaGratitudeReceiptReturnReady = "true";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.visualPassClaimed = "false";
    }
  }
})();
