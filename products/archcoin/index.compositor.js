/* /products/archcoin/index.compositor.js
   ARCHCOIN camera, matrix, projection, frame-lifecycle, and depth-partition authority.

   PLANET OWNS WORLD TRUTH.
   CRYSTALS OWNS VISUAL INTERPRETATION.
   COMPOSITOR PROJECTS WORLD AND VISUAL RECORDS.
   CONTROLLER ADMITS THE PUBLISHED PROJECTION SNAPSHOT.
*/
(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_COMPOSITOR",
    version: "4.0.0-shared-projection-authority",
    file: "/products/archcoin/index.compositor.js",
    worldSchema: "ARCHCOIN_CANONICAL_WORLD_SNAPSHOT_v1",
    visualSchema: "ARCHCOIN_CRYSTAL_VISUAL_RECORDS_v2",
    projectionSchema: "ARCHCOIN_SHARED_PROJECTION_SNAPSHOT_v2",
    layerDataset: "REAR_AUDRALIA_FRONT_SEMANTIC"
  });

  const LAYERS = Object.freeze({
    REAR: "rear",
    CENTER: "center-world",
    FRONT: "front"
  });

  const DEFAULT_CAMERA = Object.freeze({
    position: Object.freeze([0, 0, 5.2]),
    target: Object.freeze([0, 0, 0]),
    up: Object.freeze([0, 1, 0]),
    fovYRadians: Math.PI / 3,
    near: 0.1,
    far: 100,
    viewportWidth: 1,
    viewportHeight: 1,
    depthEpsilon: 0.025
  });

  const state = {
    initialized: false,
    disposed: false,
    running: false,
    rafId: 0,
    root: null,
    mounts: Object.freeze({ world: null, audralia: null, semantic: null }),
    controller: null,
    planet: null,
    crystals: null,
    camera: null,
    frameNumber: 0,
    projectionRevision: 0,
    lastProjectionSnapshot: null,
    lastError: "",
    lastAction: "pending"
  };

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function vector(value, fallback = [0, 0, 0]) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value) ? Array.from(value) : fallback;
    return [
      finite(source[0], fallback[0]),
      finite(source[1], fallback[1]),
      finite(source[2], fallback[2])
    ];
  }

  function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function scale(a, scalar) {
    return [a[0] * scalar, a[1] * scalar, a[2] * scalar];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function normalize(value, fallback = [0, 0, 1]) {
    const item = vector(value, fallback);
    const length = Math.hypot(item[0], item[1], item[2]);
    if (!Number.isFinite(length) || length <= 1e-12) return vector(fallback);
    return scale(item, 1 / length);
  }

  function cloneCamera(camera) {
    const source = camera || DEFAULT_CAMERA;
    return {
      position: vector(source.position, DEFAULT_CAMERA.position),
      target: vector(source.target, DEFAULT_CAMERA.target),
      up: normalize(source.up, DEFAULT_CAMERA.up),
      fovYRadians: clamp(finite(source.fovYRadians, DEFAULT_CAMERA.fovYRadians), 0.1, Math.PI - 0.1),
      near: Math.max(1e-5, finite(source.near, DEFAULT_CAMERA.near)),
      far: Math.max(0.01, finite(source.far, DEFAULT_CAMERA.far)),
      viewportWidth: Math.max(1, finite(source.viewportWidth, DEFAULT_CAMERA.viewportWidth)),
      viewportHeight: Math.max(1, finite(source.viewportHeight, DEFAULT_CAMERA.viewportHeight)),
      depthEpsilon: Math.max(0, finite(source.depthEpsilon, DEFAULT_CAMERA.depthEpsilon))
    };
  }

  state.camera = cloneCamera(DEFAULT_CAMERA);

  function multiplyMatrixVector(matrix, value) {
    const v = [finite(value[0]), finite(value[1]), finite(value[2]), finite(value[3], 1)];
    return [
      matrix[0] * v[0] + matrix[1] * v[1] + matrix[2] * v[2] + matrix[3] * v[3],
      matrix[4] * v[0] + matrix[5] * v[1] + matrix[6] * v[2] + matrix[7] * v[3],
      matrix[8] * v[0] + matrix[9] * v[1] + matrix[10] * v[2] + matrix[11] * v[3],
      matrix[12] * v[0] + matrix[13] * v[1] + matrix[14] * v[2] + matrix[15] * v[3]
    ];
  }

  function getCameraBasis(camera = state.camera) {
    const forward = normalize(subtract(camera.target, camera.position), [0, 0, -1]);
    let right = normalize(cross(forward, camera.up), [1, 0, 0]);
    if (Math.hypot(...right) <= 1e-10) right = [1, 0, 0];
    const up = normalize(cross(right, forward), [0, 1, 0]);
    return Object.freeze({
      right: Object.freeze(right),
      up: Object.freeze(up),
      forward: Object.freeze(forward)
    });
  }

  function getViewMatrix(camera = state.camera) {
    const basis = getCameraBasis(camera);
    const right = basis.right;
    const up = basis.up;
    const forward = basis.forward;
    const position = camera.position;
    return Object.freeze([
      right[0], right[1], right[2], -dot(right, position),
      up[0], up[1], up[2], -dot(up, position),
      -forward[0], -forward[1], -forward[2], dot(forward, position),
      0, 0, 0, 1
    ]);
  }

  function getProjectionMatrix(camera = state.camera) {
    const aspect = camera.viewportWidth / camera.viewportHeight;
    const f = 1 / Math.tan(camera.fovYRadians / 2);
    const near = camera.near;
    const far = Math.max(camera.far, near + 1e-4);
    return Object.freeze([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), (2 * far * near) / (near - far),
      0, 0, -1, 0
    ]);
  }

  function projectWorldPoint(worldPosition, options = {}) {
    const camera = options.camera ? cloneCamera(options.camera) : state.camera;
    const view = options.viewMatrix || getViewMatrix(camera);
    const projection = options.projectionMatrix || getProjectionMatrix(camera);
    const viewPoint = multiplyMatrixVector(view, [...vector(worldPosition), 1]);
    const clip = multiplyMatrixVector(projection, viewPoint);
    const clipW = finite(clip[3]);
    const validW = Math.abs(clipW) > 1e-10;
    const ndc = validW ? [clip[0] / clipW, clip[1] / clipW, clip[2] / clipW] : [Infinity, Infinity, Infinity];
    const visible = validW && clipW > 0 && ndc[0] >= -1 && ndc[0] <= 1 && ndc[1] >= -1 && ndc[1] <= 1 && ndc[2] >= -1 && ndc[2] <= 1;
    return Object.freeze({
      worldPosition: Object.freeze(vector(worldPosition)),
      screenX: (ndc[0] * 0.5 + 0.5) * camera.viewportWidth,
      screenY: (1 - (ndc[1] * 0.5 + 0.5)) * camera.viewportHeight,
      ndcDepth: ndc[2],
      clipW,
      viewDepth: -viewPoint[2],
      visible
    });
  }

  function classifyDepth(projected, centerProjection = null, epsilon = state.camera.depthEpsilon) {
    const center = centerProjection || projectWorldPoint([0, 0, 0]);
    const difference = finite(projected.viewDepth) - finite(center.viewDepth);
    if (Math.abs(difference) <= epsilon) return LAYERS.CENTER;
    return difference > 0 ? LAYERS.REAR : LAYERS.FRONT;
  }

  function radiusPixels(worldRadius, viewDepth, camera = state.camera) {
    const depth = Math.max(camera.near, Math.abs(finite(viewDepth, 1)));
    const focalPixels = camera.viewportHeight / (2 * Math.tan(camera.fovYRadians / 2));
    return Math.max(0, finite(worldRadius) * focalPixels / depth);
  }

  function normalizeRecord(record, kind) {
    const source = record && typeof record === "object" ? record : {};
    return {
      nodeKey: String(source.nodeKey || source.visualKey || source.id || ""),
      kind: String(source.kind || kind || ""),
      id: String(source.id || source.nodeId || ""),
      wing: String(source.wing || ""),
      worldPosition: vector(source.worldPosition),
      worldRadius: Math.max(0, finite(source.worldRadius, source.radius || 0.08)),
      visible: source.visible !== false,
      selectable: source.selectable === true,
      material: source.material || null,
      mesh: source.mesh || null
    };
  }

  function projectRecord(record, kind, centerProjection, context) {
    const normalized = normalizeRecord(record, kind);
    const point = projectWorldPoint(normalized.worldPosition, context);
    const layer = normalized.kind === "planet" ? LAYERS.CENTER : classifyDepth(point, centerProjection, context.camera.depthEpsilon);
    return Object.freeze({
      nodeKey: normalized.nodeKey,
      semanticIdentity: normalized.id,
      kind: normalized.kind,
      wing: normalized.wing,
      worldPosition: Object.freeze(normalized.worldPosition),
      x: point.screenX,
      y: point.screenY,
      radiusPx: radiusPixels(normalized.worldRadius, point.viewDepth, context.camera),
      ndcDepth: point.ndcDepth,
      clipW: point.clipW,
      viewDepth: point.viewDepth,
      depthLayer: layer,
      visible: normalized.visible && point.visible,
      selectable: normalized.kind !== "planet" && normalized.selectable,
      worldRevision: context.worldRevision,
      frameRevision: context.frameRevision,
      projectionRevision: context.projectionRevision,
      material: normalized.material,
      mesh: normalized.mesh
    });
  }

  function partitionProjectionRecords(records) {
    const rear = [];
    const centerWorld = [];
    const front = [];
    for (const record of records || []) {
      if (record.depthLayer === LAYERS.REAR) rear.push(record);
      else if (record.depthLayer === LAYERS.FRONT) front.push(record);
      else centerWorld.push(record);
    }
    return Object.freeze({ rear: Object.freeze(rear), centerWorld: Object.freeze(centerWorld), front: Object.freeze(front) });
  }

  function validateInputs(worldSnapshot, crystalRecords) {
    if (!worldSnapshot || worldSnapshot.schema !== MODULE.worldSchema) throw new TypeError(`Expected ${MODULE.worldSchema}.`);
    if (!crystalRecords || crystalRecords.schema !== MODULE.visualSchema) throw new TypeError(`Expected ${MODULE.visualSchema}.`);
    if (finite(crystalRecords.worldRevision, -1) !== finite(worldSnapshot.worldRevision, -2)) {
      throw new RangeError("Visual records and world snapshot have different world revisions.");
    }
  }

  function project({ worldSnapshot, crystalRecords, camera } = {}) {
    validateInputs(worldSnapshot, crystalRecords);
    const activeCamera = camera ? cloneCamera(camera) : state.camera;
    const projectionRevision = state.projectionRevision + 1;
    const viewMatrix = getViewMatrix(activeCamera);
    const projectionMatrix = getProjectionMatrix(activeCamera);
    const centerProjection = projectWorldPoint([0, 0, 0], { camera: activeCamera, viewMatrix, projectionMatrix });
    const context = {
      camera: activeCamera,
      viewMatrix,
      projectionMatrix,
      worldRevision: finite(worldSnapshot.worldRevision),
      frameRevision: finite(worldSnapshot.frameRevision),
      projectionRevision
    };
    const projected = [];
    const planetRecord = crystalRecords.planetRecord || worldSnapshot.planet || null;
    if (planetRecord) projected.push(projectRecord(planetRecord, "planet", centerProjection, context));
    for (const record of Array.isArray(crystalRecords.records) ? crystalRecords.records : []) {
      projected.push(projectRecord(record, record.kind || "crystal", centerProjection, context));
    }
    const partitions = partitionProjectionRecords(projected);
    const snapshot = Object.freeze({
      schema: MODULE.projectionSchema,
      projectionRevision,
      worldRevision: context.worldRevision,
      frameRevision: context.frameRevision,
      generatedAt: Date.now(),
      layerDataset: MODULE.layerDataset,
      camera: Object.freeze(cloneCamera(activeCamera)),
      cameraBasis: getCameraBasis(activeCamera),
      viewMatrix,
      projectionMatrix,
      centerWorldProjection: centerProjection,
      records: Object.freeze(projected),
      rear: partitions.rear,
      centerWorld: partitions.centerWorld,
      front: partitions.front
    });
    state.camera = activeCamera;
    state.projectionRevision = projectionRevision;
    state.lastProjectionSnapshot = snapshot;
    state.lastAction = "project";
    return snapshot;
  }

  function getMount(selector, root = state.root) {
    return root && typeof root.querySelector === "function" ? root.querySelector(selector) : null;
  }

  function initialize(options = {}) {
    state.root = options.root || (typeof document !== "undefined" ? document : null);
    state.controller = options.controller || globalThis.DGB_ARCHCOIN_CONTROLLER || null;
    state.planet = options.planet || globalThis.DGB_ARCHCOIN_PLANET || null;
    state.crystals = options.crystals || globalThis.DGB_ARCHCOIN_CRYSTALS || null;
    state.camera = cloneCamera({ ...DEFAULT_CAMERA, ...(options.camera || {}) });
    state.mounts = Object.freeze({
      world: options.worldMount || getMount("[data-archcoin-world-mount]", state.root),
      audralia: options.audraliaWorld || getMount("[data-archcoin-audralia-world]", state.root),
      semantic: options.semanticMount || getMount("[data-upstream-compass-control]", state.root)
    });
    state.initialized = true;
    state.disposed = false;
    state.lastError = "";
    state.lastAction = "initialize";
    return receipt();
  }

  function renderProjectedFrame(snapshot = state.lastProjectionSnapshot) {
    if (!snapshot || snapshot.schema !== MODULE.projectionSchema) return false;
    if (state.crystals && typeof state.crystals.drawVisualSnapshot === "function") state.crystals.drawVisualSnapshot(snapshot);
    state.lastAction = "render-projected-frame";
    return true;
  }

  function publishProjectionSnapshot(snapshot = state.lastProjectionSnapshot) {
    if (!snapshot || snapshot.schema !== MODULE.projectionSchema) return false;
    if (state.controller && typeof state.controller.submitProjectionSnapshot === "function") {
      const accepted = state.controller.submitProjectionSnapshot(snapshot);
      state.lastAction = accepted ? "publish-accepted" : "publish-rejected";
      return Boolean(accepted);
    }
    state.lastAction = "publish-unbound";
    return false;
  }

  function renderFrame() {
    if (!state.initialized || state.disposed) return null;
    try {
      const frameState = state.controller && typeof state.controller.getFrameState === "function" ? state.controller.getFrameState() : {};
      const worldSnapshot = state.planet && typeof state.planet.getWorldSnapshot === "function" ? state.planet.getWorldSnapshot(frameState) : null;
      const crystalRecords = state.crystals && typeof state.crystals.consumeWorldSnapshot === "function" ? state.crystals.consumeWorldSnapshot(worldSnapshot) : null;
      const projectionSnapshot = project({ worldSnapshot, crystalRecords });
      renderProjectedFrame(projectionSnapshot);
      publishProjectionSnapshot(projectionSnapshot);
      state.frameNumber += 1;
      state.lastAction = "render-frame";
      return projectionSnapshot;
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      state.lastAction = "render-error";
      return null;
    }
  }

  function frameLoop() {
    if (!state.running) return;
    renderFrame();
    state.rafId = typeof requestAnimationFrame === "function" ? requestAnimationFrame(frameLoop) : 0;
  }

  function start() {
    if (state.running || state.disposed) return receipt();
    state.running = true;
    state.lastAction = "start";
    if (typeof requestAnimationFrame === "function") state.rafId = requestAnimationFrame(frameLoop);
    return receipt();
  }

  function stop() {
    state.running = false;
    if (state.rafId && typeof cancelAnimationFrame === "function") cancelAnimationFrame(state.rafId);
    state.rafId = 0;
    state.lastAction = "stop";
    return receipt();
  }

  function requestFrame() {
    if (state.disposed) return null;
    return typeof requestAnimationFrame === "function" ? requestAnimationFrame(() => renderFrame()) : renderFrame();
  }

  function setCamera(patch = {}) {
    state.camera = cloneCamera({ ...state.camera, ...patch });
    state.lastAction = "set-camera";
    return getCamera();
  }

  function resize(width, height) {
    state.camera = cloneCamera({
      ...state.camera,
      viewportWidth: Math.max(1, finite(width, state.camera.viewportWidth)),
      viewportHeight: Math.max(1, finite(height, state.camera.viewportHeight))
    });
    state.lastAction = "resize";
    return getCamera();
  }

  function getCamera() {
    return Object.freeze(cloneCamera(state.camera));
  }

  function getCenterWorldProjection() {
    return state.lastProjectionSnapshot ? state.lastProjectionSnapshot.centerWorldProjection : projectWorldPoint([0, 0, 0]);
  }

  function getRearLayer() {
    return state.lastProjectionSnapshot ? state.lastProjectionSnapshot.rear : Object.freeze([]);
  }

  function getCenterLayer() {
    return state.lastProjectionSnapshot ? state.lastProjectionSnapshot.centerWorld : Object.freeze([]);
  }

  function getFrontLayer() {
    return state.lastProjectionSnapshot ? state.lastProjectionSnapshot.front : Object.freeze([]);
  }

  function getLastProjectionSnapshot() {
    return state.lastProjectionSnapshot;
  }

  function getCompositorContract() {
    return Object.freeze({
      module: MODULE,
      mounts: Object.freeze({
        world: "[data-archcoin-world-mount]",
        audralia: "[data-archcoin-audralia-world]",
        semantic: "[data-upstream-compass-control]"
      }),
      ownsCamera: true,
      ownsMatrices: true,
      ownsProjection: true,
      ownsWorldGeometry: false,
      ownsVisualGeometry: false,
      publishesToController: true
    });
  }

  function receipt() {
    return Object.freeze({
      module: MODULE.id,
      version: MODULE.version,
      initialized: state.initialized,
      disposed: state.disposed,
      running: state.running,
      frameNumber: state.frameNumber,
      projectionRevision: state.projectionRevision,
      hasProjectionSnapshot: Boolean(state.lastProjectionSnapshot),
      lastError: state.lastError,
      lastAction: state.lastAction
    });
  }

  function dispose() {
    stop();
    state.root = null;
    state.mounts = Object.freeze({ world: null, audralia: null, semantic: null });
    state.controller = null;
    state.planet = null;
    state.crystals = null;
    state.lastProjectionSnapshot = null;
    state.initialized = false;
    state.disposed = true;
    state.lastAction = "dispose";
    return receipt();
  }

  const API = Object.freeze({
    MODULE,
    initialize,
    start,
    stop,
    requestFrame,
    renderFrame,
    project,
    renderProjectedFrame,
    publishProjectionSnapshot,
    setCamera,
    resize,
    getCamera,
    getCameraBasis,
    getViewMatrix,
    getProjectionMatrix,
    getCenterWorldProjection,
    projectWorldPoint,
    classifyDepth,
    partitionProjectionRecords,
    getRearLayer,
    getCenterLayer,
    getFrontLayer,
    getLastProjectionSnapshot,
    getCompositorContract,
    receipt,
    dispose
  });

  globalThis.DGB_ARCHCOIN_COMPOSITOR = API;
})();