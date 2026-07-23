/* /products/archcoin/index.crystals.js
   ARCHCOIN visual interpretation authority.

   PLANET OWNS WORLD TRUTH.
   CRYSTALS CONSUMES WORLD TRUTH.
   CRYSTALS DOES NOT OWN OR RECONSTRUCT WORLD GEOMETRY.
*/
(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_CRYSTALS",
    version: "3.0.0-planet-consumer-visual-authority",
    file: "/products/archcoin/index.crystals.js",
    worldSchema: "ARCHCOIN_CANONICAL_WORLD_SNAPSHOT_v1",
    visualSchema: "ARCHCOIN_CRYSTAL_VISUAL_RECORDS_v2"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const MODES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });

  const DEFAULT_PALETTE = Object.freeze({
    north: Object.freeze({ core: "#f4fbff", edge: "#6db7e8", glow: "rgba(109,183,232,0.58)" }),
    east: Object.freeze({ core: "#fff8e7", edge: "#f1b65d", glow: "rgba(241,182,93,0.58)" }),
    south: Object.freeze({ core: "#fff0f5", edge: "#d56c93", glow: "rgba(213,108,147,0.58)" }),
    west: Object.freeze({ core: "#f3efff", edge: "#8e78df", glow: "rgba(142,120,223,0.58)" }),
    planet: Object.freeze({ core: "#e9f7ff", edge: "#5ba6cc", glow: "rgba(91,166,204,0.44)" }),
    neutral: Object.freeze({ core: "#f7f8fb", edge: "#98a4b3", glow: "rgba(152,164,179,0.42)" })
  });

  const DEFAULT_MATERIAL = Object.freeze({
    opacity: 1,
    roughness: 0.24,
    metalness: 0.14,
    refraction: 0.16,
    emissiveStrength: 0.42,
    edgeStrength: 0.72,
    scale: 1
  });

  const state = {
    initialized: false,
    disposed: false,
    palette: DEFAULT_PALETTE,
    materialOverrides: Object.freeze({}),
    drawAdapters: new Set(),
    lastWorldRevision: -1,
    lastFrameRevision: -1,
    lastVisualSnapshot: null,
    lastFailure: "",
    lastAction: "pending"
  };

  function invariant(condition, code, details = null) {
    if (condition) return;
    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function cloneVector(value, fallback = [0, 0, 0]) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value)
      ? Array.from(value)
      : fallback;
    return Object.freeze([
      finiteNumber(source[0], fallback[0]),
      finiteNumber(source[1], fallback[1]),
      finiteNumber(source[2], fallback[2])
    ]);
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function paletteFor(wing, kind) {
    if (kind === "planet") return state.palette.planet || DEFAULT_PALETTE.planet;
    const normalized = normalizeWing(wing);
    return state.palette[normalized] || state.palette.neutral || DEFAULT_PALETTE.neutral;
  }

  function mergeMaterial(kind, wing, material = null) {
    const globalOverride = state.materialOverrides.default || {};
    const kindOverride = state.materialOverrides[kind] || {};
    const wingOverride = state.materialOverrides[normalizeWing(wing)] || {};
    const source = Object.assign({}, DEFAULT_MATERIAL, globalOverride, kindOverride, wingOverride, material || {});
    return Object.freeze({
      opacity: clamp(finiteNumber(source.opacity, 1), 0, 1),
      roughness: clamp(finiteNumber(source.roughness, 0.24), 0, 1),
      metalness: clamp(finiteNumber(source.metalness, 0.14), 0, 1),
      refraction: clamp(finiteNumber(source.refraction, 0.16), 0, 1),
      emissiveStrength: Math.max(0, finiteNumber(source.emissiveStrength, 0.42)),
      edgeStrength: Math.max(0, finiteNumber(source.edgeStrength, 0.72)),
      scale: Math.max(0, finiteNumber(source.scale, 1))
    });
  }

  function validateWorldSnapshot(snapshot) {
    invariant(snapshot && typeof snapshot === "object", "CRYSTALS_WORLD_SNAPSHOT_REQUIRED");
    invariant(snapshot.schema === MODULE.worldSchema, "CRYSTALS_WORLD_SCHEMA_MISMATCH", {
      expected: MODULE.worldSchema,
      received: snapshot && snapshot.schema
    });
    invariant(Number.isInteger(snapshot.worldRevision) && snapshot.worldRevision >= 0,
      "CRYSTALS_WORLD_REVISION_INVALID");
    invariant(Number.isInteger(snapshot.frameRevision) && snapshot.frameRevision >= 0,
      "CRYSTALS_FRAME_REVISION_INVALID");
    invariant(snapshot.planet && typeof snapshot.planet === "object", "CRYSTALS_PLANET_RECORD_REQUIRED");
    invariant(snapshot.constellation && Array.isArray(snapshot.constellation.nodes),
      "CRYSTALS_CONSTELLATION_NODES_REQUIRED");
    invariant(snapshot.cluster && Array.isArray(snapshot.cluster.nodes),
      "CRYSTALS_CLUSTER_NODES_REQUIRED");
    return snapshot;
  }

  function deriveFacing(node) {
    const vector = cloneVector(node && node.rotatedUnitVector, [0, 0, 1]);
    return Object.freeze({
      score: clamp(finiteNumber(vector[2]), -1, 1),
      frontFacing: finiteNumber(vector[2]) >= 0,
      rearFacing: finiteNumber(vector[2]) < 0
    });
  }

  function buildVisualRecord(node, context) {
    const kind = String(node && node.kind || "").trim().toLowerCase();
    const id = String(node && node.id || "").trim();
    const wing = normalizeWing(node && node.wing);
    invariant(kind && id, "CRYSTALS_NODE_IDENTITY_INVALID", { node });

    const facing = deriveFacing(node);
    const selected = Boolean(
      (kind === "cardinal" && id === context.primaryWing) ||
      (kind === "room" && id === context.primaryRoom)
    );
    const activeMode = context.presentationMode;
    const visible = kind === "cardinal"
      ? activeMode === MODES.CONSTELLATION
      : kind === "room"
        ? activeMode === MODES.CLUSTER
        : true;
    const colors = paletteFor(wing, kind);
    const material = mergeMaterial(kind, wing, {
      opacity: visible ? (facing.frontFacing ? 1 : 0.68) : 0,
      scale: selected ? 1.12 : facing.frontFacing ? 1 : 0.92,
      emissiveStrength: selected ? 0.72 : 0.42,
      edgeStrength: selected ? 1 : 0.72
    });

    return Object.freeze({
      schema: MODULE.visualSchema,
      recordType: "crystal",
      nodeKey: String(node.nodeKey || `${kind}:${id}`),
      kind,
      id,
      wing,
      worldPosition: cloneVector(node.worldPosition),
      canonicalUnitVector: cloneVector(node.canonicalUnitVector),
      rotatedUnitVector: cloneVector(node.rotatedUnitVector),
      depthScore: finiteNumber(node.depthScore),
      alignmentScore: finiteNumber(node.alignmentScore),
      worldRevision: context.worldRevision,
      frameRevision: context.frameRevision,
      primary: selected,
      visible,
      frontFacing: facing.frontFacing,
      rearFacing: facing.rearFacing,
      colors: Object.freeze({
        core: String(colors.core || ""),
        edge: String(colors.edge || ""),
        glow: String(colors.glow || "")
      }),
      material,
      geometry: Object.freeze({
        primitive: kind === "room" ? "faceted-room-crystal" : "faceted-cardinal-crystal",
        radius: Math.max(0.001, finiteNumber(node.worldRadius, kind === "room" ? 0.13 : 0.2)),
        source: "WORLD_RECORD_REFERENCE_ONLY"
      })
    });
  }

  function buildPlanetRecord(planet, context) {
    const colors = paletteFor("", "planet");
    const material = mergeMaterial("planet", "", {
      opacity: 1,
      scale: 1,
      emissiveStrength: 0.3,
      edgeStrength: 0.48
    });
    return Object.freeze({
      schema: MODULE.visualSchema,
      recordType: "planet",
      nodeKey: String(planet.nodeKey || planet.nodeId || "main-compass-planet"),
      kind: "planet",
      id: String(planet.id || planet.nodeId || "main-compass-planet"),
      wing: "",
      worldPosition: cloneVector(planet.worldPosition),
      worldRevision: context.worldRevision,
      frameRevision: context.frameRevision,
      primary: false,
      selectable: false,
      visible: planet.visible !== false,
      colors: Object.freeze({
        core: String(colors.core || ""),
        edge: String(colors.edge || ""),
        glow: String(colors.glow || "")
      }),
      material,
      geometry: Object.freeze({
        primitive: "audralia-planet",
        radius: Math.max(0.001, finiteNumber(planet.worldRadius, 0.64)),
        source: String(planet.geometrySource || "DGBAudraliaPlanetGeometry")
      })
    });
  }

  function consumeWorldSnapshot(input) {
    invariant(state.initialized, "CRYSTALS_NOT_INITIALIZED");
    invariant(!state.disposed, "CRYSTALS_DISPOSED");
    const snapshot = validateWorldSnapshot(input);

    invariant(snapshot.worldRevision >= state.lastWorldRevision,
      "CRYSTALS_STALE_WORLD_REVISION", {
        accepted: state.lastWorldRevision,
        received: snapshot.worldRevision
      });
    invariant(snapshot.frameRevision >= state.lastFrameRevision,
      "CRYSTALS_STALE_FRAME_REVISION", {
        accepted: state.lastFrameRevision,
        received: snapshot.frameRevision
      });

    const context = Object.freeze({
      worldRevision: snapshot.worldRevision,
      frameRevision: snapshot.frameRevision,
      presentationMode: String(snapshot.presentationMode || MODES.HELD).toUpperCase(),
      primaryWing: normalizeWing(snapshot.constellation.primaryId),
      primaryRoom: String(snapshot.cluster.primaryId || "").trim()
    });

    const constellationRecords = snapshot.constellation.nodes.map(node => buildVisualRecord(node, context));
    const clusterRecords = snapshot.cluster.nodes.map(node => buildVisualRecord(node, context));
    const planetRecord = buildPlanetRecord(snapshot.planet, context);
    const records = Object.freeze([planetRecord, ...constellationRecords, ...clusterRecords]);

    const visualSnapshot = Object.freeze({
      schema: MODULE.visualSchema,
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      sourceWorldSchema: snapshot.schema,
      worldRevision: snapshot.worldRevision,
      frameRevision: snapshot.frameRevision,
      presentationMode: context.presentationMode,
      planetRecord,
      constellationRecords: Object.freeze(constellationRecords),
      clusterRecords: Object.freeze(clusterRecords),
      records,
      authority: Object.freeze({
        ownsWorldGeometry: false,
        reconstructsPlanetState: false,
        consumesPlanetWorldTruth: true,
        ownsVisualInterpretation: true
      })
    });

    state.lastWorldRevision = snapshot.worldRevision;
    state.lastFrameRevision = snapshot.frameRevision;
    state.lastVisualSnapshot = visualSnapshot;
    state.lastAction = "consume-world-snapshot";
    state.lastFailure = "";
    return visualSnapshot;
  }

  function invokeAdapters(method, record, context = null) {
    const results = [];
    for (const adapter of state.drawAdapters) {
      if (!adapter || typeof adapter[method] !== "function") continue;
      results.push(adapter[method](record, context));
    }
    return Object.freeze(results);
  }

  function drawCrystalRecord(record, context = null) {
    invariant(record && record.recordType === "crystal", "CRYSTALS_DRAW_CRYSTAL_RECORD_INVALID");
    return invokeAdapters("drawCrystalRecord", record, context);
  }

  function drawPlanetRecord(record, context = null) {
    invariant(record && record.recordType === "planet", "CRYSTALS_DRAW_PLANET_RECORD_INVALID");
    return invokeAdapters("drawPlanetRecord", record, context);
  }

  function drawVisualSnapshot(snapshot = state.lastVisualSnapshot, context = null) {
    invariant(snapshot && snapshot.schema === MODULE.visualSchema, "CRYSTALS_VISUAL_SNAPSHOT_INVALID");
    const results = [];
    for (const record of snapshot.records) {
      results.push(record.recordType === "planet"
        ? drawPlanetRecord(record, context)
        : drawCrystalRecord(record, context));
    }
    return Object.freeze(results);
  }

  function registerDrawAdapter(adapter) {
    invariant(adapter && typeof adapter === "object", "CRYSTALS_DRAW_ADAPTER_INVALID");
    invariant(typeof adapter.drawCrystalRecord === "function" || typeof adapter.drawPlanetRecord === "function",
      "CRYSTALS_DRAW_ADAPTER_METHOD_REQUIRED");
    state.drawAdapters.add(adapter);
    return () => state.drawAdapters.delete(adapter);
  }

  function getLastVisualSnapshot() {
    return state.lastVisualSnapshot;
  }

  function getVisualContract() {
    return Object.freeze({
      module: MODULE,
      consumesWorldSchema: MODULE.worldSchema,
      publishesVisualSchema: MODULE.visualSchema,
      owns: Object.freeze([
        "palette",
        "materials",
        "visual-record-derivation",
        "draw-adapter-dispatch",
        "front-rear-visual-emphasis"
      ]),
      doesNotOwn: Object.freeze([
        "world-origin",
        "world-position",
        "world-radius-authority",
        "canonical-vectors",
        "world-quaternion-transforms",
        "primary-identity",
        "settled-quaternions",
        "camera-projection",
        "navigation-state"
      ])
    });
  }

  function receipt() {
    return Object.freeze({
      module: MODULE,
      initialized: state.initialized,
      disposed: state.disposed,
      lastWorldRevision: state.lastWorldRevision,
      lastFrameRevision: state.lastFrameRevision,
      adapterCount: state.drawAdapters.size,
      lastAction: state.lastAction,
      lastFailure: state.lastFailure,
      authority: Object.freeze({
        planetIsWorldAuthority: true,
        crystalsConsumePlanet: true,
        crystalsOwnWorldGeometry: false,
        crystalsReconstructPlanetState: false
      })
    });
  }

  function initialize(options = {}) {
    invariant(!state.disposed, "CRYSTALS_DISPOSED");
    if (options.palette && typeof options.palette === "object") {
      state.palette = Object.freeze(Object.assign({}, DEFAULT_PALETTE, options.palette));
    }
    if (options.materialOverrides && typeof options.materialOverrides === "object") {
      state.materialOverrides = Object.freeze(Object.assign({}, options.materialOverrides));
    }
    if (Array.isArray(options.drawAdapters)) {
      for (const adapter of options.drawAdapters) registerDrawAdapter(adapter);
    }
    state.initialized = true;
    state.lastAction = "initialize";
    return receipt();
  }

  function dispose() {
    state.drawAdapters.clear();
    state.lastVisualSnapshot = null;
    state.initialized = false;
    state.disposed = true;
    state.lastAction = "dispose";
    return receipt();
  }

  const API = Object.freeze({
    MODULE,
    initialize,
    consumeWorldSnapshot,
    drawCrystalRecord,
    drawPlanetRecord,
    drawVisualSnapshot,
    registerDrawAdapter,
    getLastVisualSnapshot,
    getVisualContract,
    receipt,
    dispose
  });

  globalThis.DGB_ARCHCOIN_CRYSTALS = API;
})();
