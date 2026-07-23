/* /products/archcoin/index.planet.js
   ARCHCOIN canonical immutable world authority.

   PLANET_IS_WORLD_AUTHORITY = TRUE
   CRYSTALS_CONSUME_PLANET = TRUE
   CRYSTALS_OWN_WORLD_GEOMETRY = FALSE
   CRYSTALS_RECONSTRUCT_PLANET_STATE = FALSE
*/
(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_PLANET",
    version: "1.0.0-canonical-world-authority",
    file: "/products/archcoin/index.planet.js",
    worldSchema: "ARCHCOIN_CANONICAL_WORLD_SNAPSHOT_v1",
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "UNIT_QUATERNION"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });
  const SCOPES = Object.freeze({ ORBIT: "ORBIT", CLUSTER: "CLUSTER" });
  const IDENTITY = Object.freeze([0, 0, 0, 1]);
  const WORLD_UP = Object.freeze([0, 1, 0]);

  const SPHERE = Object.freeze({
    constellation: Object.freeze({
      horizontalRadius: 1.46,
      verticalRadius: 1.28,
      depthRadius: 1.14,
      primaryAnchor: Object.freeze([0, 0.78, 0.625]),
      vectors: Object.freeze({
        north: Object.freeze([0, 1, 0]),
        east: Object.freeze([1, 0, 0]),
        south: Object.freeze([0, -1, 0]),
        west: Object.freeze([-1, 0, 0])
      })
    }),
    cluster: Object.freeze({
      horizontalRadius: 1.04,
      verticalRadius: 0.9,
      depthRadius: 0.84,
      centerRadius: 0.26,
      primaryAnchor: Object.freeze([0, 0.7, 0.714]),
      latitudeAmplitude: 0.48,
      latitudeFrequency: 1.73
    }),
    planet: Object.freeze({
      nodeId: "main-compass-planet",
      worldPosition: Object.freeze([0, 0, 0]),
      worldRadius: 0.64,
      geometrySource: "DGBAudraliaPlanetGeometry"
    })
  });

  const ROOM_LENSES = Object.freeze([
    "overview",
    "engineering",
    "platform",
    "governance"
  ]);

  const state = {
    controller: null,
    initialized: false,
    disposed: false,
    worldRevision: 0,
    lastFrameRevision: -1,
    lastFingerprint: "",
    lastSnapshot: null,
    lastFailure: "",
    lastAction: "pending"
  };

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
    return [
      finiteNumber(source[0], fallback[0]),
      finiteNumber(source[1], fallback[1]),
      finiteNumber(source[2], fallback[2])
    ];
  }

  function vectorLength(vector) {
    return Math.hypot(vector[0], vector[1], vector[2]);
  }

  function normalizeVector(value, fallback = [0, 0, 1]) {
    const vector = cloneVector(value, fallback);
    const length = vectorLength(vector);
    if (!Number.isFinite(length) || length <= 1e-12) return cloneVector(fallback);
    return vector.map(component => component / length);
  }

  function dot(first, second) {
    return first[0] * second[0] + first[1] * second[1] + first[2] * second[2];
  }

  function cross(first, second) {
    return [
      first[1] * second[2] - first[2] * second[1],
      first[2] * second[0] - first[0] * second[2],
      first[0] * second[1] - first[1] * second[0]
    ];
  }

  function quaternionNormalize(value, fallback = IDENTITY) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value)
      ? Array.from(value)
      : Array.from(fallback);
    if (source.length !== 4) return Array.from(fallback);
    const quaternion = source.map((component, index) =>
      finiteNumber(component, fallback[index])
    );
    const length = Math.hypot(...quaternion);
    if (!Number.isFinite(length) || length <= 1e-12) return Array.from(fallback);
    return quaternion.map(component => component / length);
  }

  function quaternionMultiplyRaw(first, second) {
    return [
      first[3] * second[0] + first[0] * second[3] + first[1] * second[2] - first[2] * second[1],
      first[3] * second[1] - first[0] * second[2] + first[1] * second[3] + first[2] * second[0],
      first[3] * second[2] + first[0] * second[1] - first[1] * second[0] + first[2] * second[3],
      first[3] * second[3] - first[0] * second[0] - first[1] * second[1] - first[2] * second[2]
    ];
  }

  function quaternionMultiply(first, second) {
    return quaternionNormalize(
      quaternionMultiplyRaw(quaternionNormalize(first), quaternionNormalize(second))
    );
  }

  function quaternionConjugate(quaternion) {
    const value = quaternionNormalize(quaternion);
    return [-value[0], -value[1], -value[2], value[3]];
  }

  function quaternionRotateVector(quaternion, vector) {
    const normalized = quaternionNormalize(quaternion);
    const pure = [vector[0], vector[1], vector[2], 0];
    const rotated = quaternionMultiplyRaw(
      quaternionMultiplyRaw(normalized, pure),
      quaternionConjugate(normalized)
    );
    return [rotated[0], rotated[1], rotated[2]];
  }

  function quaternionFromAxisAngle(axis, angle) {
    const normalizedAxis = normalizeVector(axis, WORLD_UP);
    const half = finiteNumber(angle) * 0.5;
    const sine = Math.sin(half);
    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function quaternionFromUnitVectors(fromValue, toValue) {
    const from = normalizeVector(fromValue);
    const to = normalizeVector(toValue);
    const cosine = clamp(dot(from, to), -1, 1);
    if (cosine > 1 - 1e-10) return Array.from(IDENTITY);
    if (cosine < -1 + 1e-10) {
      let axis = cross(from, [1, 0, 0]);
      if (vectorLength(axis) <= 1e-8) axis = cross(from, [0, 1, 0]);
      return quaternionFromAxisAngle(axis, Math.PI);
    }
    const axis = cross(from, to);
    return quaternionNormalize([axis[0], axis[1], axis[2], 1 + cosine]);
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function presentationMode(frame) {
    const value = String(frame && frame.presentationMode || "").trim().toUpperCase();
    return Object.values(PRESENTATION_MODES).includes(value)
      ? value
      : PRESENTATION_MODES.HELD;
  }

  function extractOrientation(frame, scope) {
    if (scope === SCOPES.CLUSTER) {
      return quaternionNormalize(
        frame && frame.cluster && frame.cluster.orientation && frame.cluster.orientation.quaternion
          ? frame.cluster.orientation.quaternion
          : frame && frame.clusterOrientation && frame.clusterOrientation.quaternion
      );
    }
    return quaternionNormalize(
      frame && frame.orbit && frame.orbit.previewQuaternion
        ? frame.orbit.previewQuaternion
        : frame && frame.orbitOrientation && frame.orbitOrientation.quaternion
          ? frame.orbitOrientation.quaternion
          : IDENTITY
    );
  }

  function extractCommittedOrientation(frame, scope) {
    if (scope === SCOPES.CLUSTER) {
      return quaternionNormalize(
        frame && frame.cluster && frame.cluster.committedQuaternion
          ? frame.cluster.committedQuaternion
          : frame && frame.cluster && frame.cluster.committedOrientation && frame.cluster.committedOrientation.quaternion
            ? frame.cluster.committedOrientation.quaternion
            : extractOrientation(frame, scope)
      );
    }
    return quaternionNormalize(
      frame && frame.orbit && frame.orbit.committedQuaternion
        ? frame.orbit.committedQuaternion
        : frame && frame.committedOrbitOrientation && frame.committedOrbitOrientation.quaternion
          ? frame.committedOrbitOrientation.quaternion
          : extractOrientation(frame, scope)
    );
  }

  function extractPrimaryId(frame, scope) {
    if (scope === SCOPES.CLUSTER) {
      return normalizeRoomId(
        frame && frame.cluster && (frame.cluster.previewPrimaryId || frame.cluster.primaryId || frame.cluster.previewPrimaryRoom || frame.cluster.primaryRoom)
      );
    }
    return normalizeWing(
      frame && frame.orbit && (frame.orbit.previewPrimaryId || frame.orbit.committedPrimaryId)
        ? frame.orbit.previewPrimaryId || frame.orbit.committedPrimaryId
        : frame && (frame.orbitPreviewFocus || frame.orbitFocus || frame.selectedCardinal)
    ) || "north";
  }

  function roomWing(roomId) {
    const id = normalizeRoomId(roomId);
    return WINGS.find(wing => id.startsWith(`${wing === "north" ? "contract" : wing === "east" ? "receivable" : wing === "south" ? "payable" : "allocation"}-`)) || "";
  }

  function roomIdsForWing(wing) {
    const prefix = wing === "north"
      ? "contract"
      : wing === "east"
        ? "receivable"
        : wing === "south"
          ? "payable"
          : wing === "west"
            ? "allocation"
            : "";
    if (!prefix) return Object.freeze([]);
    return Object.freeze(ROOM_LENSES.map(lens => `${prefix}-${lens}`));
  }

  function constellationWorldPosition(rotatedUnitVector) {
    return [
      rotatedUnitVector[0] * SPHERE.constellation.horizontalRadius,
      rotatedUnitVector[1] * SPHERE.constellation.verticalRadius,
      rotatedUnitVector[2] * SPHERE.constellation.depthRadius
    ];
  }

  function clusterCanonicalVector(index, count) {
    const angle = Math.PI * 2 * index / Math.max(1, count) - Math.PI * 0.5;
    const latitude = Math.sin(angle * SPHERE.cluster.latitudeFrequency) * SPHERE.cluster.latitudeAmplitude;
    const planar = Math.sqrt(Math.max(0, 1 - latitude * latitude));
    return normalizeVector([
      Math.cos(angle) * planar,
      latitude,
      Math.sin(angle) * planar
    ]);
  }

  function clusterWorldPosition(rotatedUnitVector) {
    return [
      rotatedUnitVector[0] * SPHERE.cluster.horizontalRadius,
      rotatedUnitVector[1] * SPHERE.cluster.verticalRadius,
      rotatedUnitVector[2] * SPHERE.cluster.depthRadius
    ];
  }

  function buildNode({ nodeKey, kind, id, wing, canonicalUnitVector, orientation, primaryAnchor, positionResolver, worldRevision }) {
    const rotatedUnitVector = normalizeVector(
      quaternionRotateVector(orientation, canonicalUnitVector),
      canonicalUnitVector
    );
    const worldPosition = positionResolver(rotatedUnitVector);
    return Object.freeze({
      nodeKey,
      kind,
      id,
      wing,
      canonicalUnitVector: Object.freeze(cloneVector(canonicalUnitVector)),
      rotatedUnitVector: Object.freeze(rotatedUnitVector),
      worldPosition: Object.freeze(worldPosition),
      depthScore: finiteNumber(rotatedUnitVector[2]),
      alignmentScore: finiteNumber(dot(rotatedUnitVector, normalizeVector(primaryAnchor))),
      worldRevision
    });
  }

  function buildConstellation(frame, worldRevision) {
    const orientation = extractOrientation(frame, SCOPES.ORBIT);
    const committedOrientation = extractCommittedOrientation(frame, SCOPES.ORBIT);
    const primaryId = extractPrimaryId(frame, SCOPES.ORBIT);
    const nodes = WINGS.map(wing => buildNode({
      nodeKey: `cardinal:${wing}`,
      kind: "cardinal",
      id: wing,
      wing,
      canonicalUnitVector: SPHERE.constellation.vectors[wing],
      orientation,
      primaryAnchor: SPHERE.constellation.primaryAnchor,
      positionResolver: constellationWorldPosition,
      worldRevision
    }));
    return Object.freeze({
      orientation: Object.freeze(orientation),
      committedOrientation: Object.freeze(committedOrientation),
      primaryId,
      primaryAnchor: SPHERE.constellation.primaryAnchor,
      horizontalRadius: SPHERE.constellation.horizontalRadius,
      verticalRadius: SPHERE.constellation.verticalRadius,
      depthRadius: SPHERE.constellation.depthRadius,
      nodes: Object.freeze(nodes)
    });
  }

  function buildCluster(frame, worldRevision) {
    const wing = normalizeWing(
      frame && frame.activeClusterWing
        ? frame.activeClusterWing
        : frame && frame.selectedCardinal
    );
    const orientation = extractOrientation(frame, SCOPES.CLUSTER);
    const committedOrientation = extractCommittedOrientation(frame, SCOPES.CLUSTER);
    const roomIds = roomIdsForWing(wing);
    const primaryId = extractPrimaryId(frame, SCOPES.CLUSTER) || roomIds[0] || "";
    const nodes = roomIds.map((roomId, index) => buildNode({
      nodeKey: `room:${roomId}`,
      kind: "room",
      id: roomId,
      wing,
      canonicalUnitVector: clusterCanonicalVector(index, roomIds.length),
      orientation,
      primaryAnchor: SPHERE.cluster.primaryAnchor,
      positionResolver: clusterWorldPosition,
      worldRevision
    }));
    return Object.freeze({
      wing,
      orientation: Object.freeze(orientation),
      committedOrientation: Object.freeze(committedOrientation),
      primaryId,
      primaryAnchor: SPHERE.cluster.primaryAnchor,
      horizontalRadius: SPHERE.cluster.horizontalRadius,
      verticalRadius: SPHERE.cluster.verticalRadius,
      depthRadius: SPHERE.cluster.depthRadius,
      centerRadius: SPHERE.cluster.centerRadius,
      nodes: Object.freeze(nodes)
    });
  }

  function frameRevision(frame) {
    return Math.max(0, Math.trunc(finiteNumber(frame && frame.frameRevision, 0)));
  }

  function frameFingerprint(frame) {
    return JSON.stringify({
      frameRevision: frameRevision(frame),
      presentationMode: presentationMode(frame),
      orbit: extractOrientation(frame, SCOPES.ORBIT),
      cluster: extractOrientation(frame, SCOPES.CLUSTER),
      orbitPrimary: extractPrimaryId(frame, SCOPES.ORBIT),
      clusterPrimary: extractPrimaryId(frame, SCOPES.CLUSTER),
      activeClusterWing: normalizeWing(frame && (frame.activeClusterWing || frame.selectedCardinal))
    });
  }

  function getWorldSnapshot(controllerFrame) {
    if (state.disposed) throw new Error("ARCHCOIN_PLANET_DISPOSED");
    const frame = controllerFrame || (state.controller && state.controller.getFrameState ? state.controller.getFrameState() : null) || {};
    const fingerprint = frameFingerprint(frame);
    if (!state.lastSnapshot || fingerprint !== state.lastFingerprint) {
      state.worldRevision += 1;
      const revision = state.worldRevision;
      const mode = presentationMode(frame);
      const constellation = buildConstellation(frame, revision);
      const cluster = buildCluster(frame, revision);
      const planetPosition = cloneVector(SPHERE.planet.worldPosition);
      const radius = SPHERE.planet.worldRadius;
      state.lastSnapshot = Object.freeze({
        worldSchema: MODULE.worldSchema,
        worldRevision: revision,
        frameRevision: frameRevision(frame),
        presentationMode: mode,
        coordinateSystem: MODULE.coordinateSystem,
        orientationRepresentation: MODULE.orientationRepresentation,
        worldOrigin: Object.freeze([0, 0, 0]),
        worldUp: WORLD_UP,
        planet: Object.freeze({
          nodeId: SPHERE.planet.nodeId,
          worldPosition: Object.freeze(planetPosition),
          worldRadius: radius,
          nearSurfaceOffset: radius,
          farSurfaceOffset: radius,
          orientation: Object.freeze(Array.from(IDENTITY)),
          geometrySource: SPHERE.planet.geometrySource,
          worldRevision: revision
        }),
        constellation,
        cluster
      });
      state.lastFingerprint = fingerprint;
      state.lastFrameRevision = frameRevision(frame);
      state.lastAction = `world-snapshot:${revision}`;
      state.lastFailure = "";
    }
    return state.lastSnapshot;
  }

  function canonicalVectorForTarget(scope, targetKey) {
    if (String(scope).toUpperCase() === SCOPES.ORBIT) {
      const wing = normalizeWing(String(targetKey || "").replace(/^cardinal:/, ""));
      return wing ? SPHERE.constellation.vectors[wing] : null;
    }
    const roomId = normalizeRoomId(String(targetKey || "").replace(/^room:/, ""));
    const wing = roomWing(roomId);
    const roomIds = roomIdsForWing(wing);
    const index = roomIds.indexOf(roomId);
    return index >= 0 ? clusterCanonicalVector(index, roomIds.length) : null;
  }

  function getSettledQuaternion({ scope, targetKey } = {}) {
    const normalizedScope = String(scope || "").trim().toUpperCase();
    const canonical = canonicalVectorForTarget(normalizedScope, targetKey);
    if (!canonical) return null;
    const anchor = normalizedScope === SCOPES.ORBIT
      ? SPHERE.constellation.primaryAnchor
      : SPHERE.cluster.primaryAnchor;
    return Object.freeze(quaternionFromUnitVectors(canonical, anchor));
  }

  function getInitialOrientation({ scope = SCOPES.ORBIT, primaryId = "north" } = {}) {
    const targetKey = String(scope).toUpperCase() === SCOPES.CLUSTER
      ? `room:${normalizeRoomId(primaryId)}`
      : `cardinal:${normalizeWing(primaryId) || "north"}`;
    return getSettledQuaternion({ scope, targetKey }) || Object.freeze(Array.from(IDENTITY));
  }

  function validatePrimaryIdentity({ scope, primaryId, worldRevision } = {}) {
    const snapshot = state.lastSnapshot;
    if (!snapshot || finiteNumber(worldRevision, -1) !== snapshot.worldRevision) return false;
    if (String(scope).toUpperCase() === SCOPES.ORBIT) {
      return snapshot.constellation.nodes.some(node => node.id === normalizeWing(primaryId));
    }
    return snapshot.cluster.nodes.some(node => node.id === normalizeRoomId(primaryId));
  }

  function initialize({ controller } = {}) {
    if (state.disposed) return false;
    if (controller && typeof controller.getFrameState === "function") state.controller = controller;
    state.initialized = true;
    state.lastAction = "initialized";
    return true;
  }

  function getWorldContract() {
    return Object.freeze({
      module: MODULE,
      sphere: SPHERE,
      wings: WINGS,
      scopes: SCOPES,
      flags: Object.freeze({
        PLANET_IS_WORLD_AUTHORITY: true,
        CRYSTALS_CONSUME_PLANET: true,
        CRYSTALS_OWN_WORLD_GEOMETRY: false,
        CRYSTALS_RECONSTRUCT_PLANET_STATE: false
      })
    });
  }

  function receipt() {
    return Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      initialized: state.initialized,
      disposed: state.disposed,
      worldRevision: state.worldRevision,
      lastFrameRevision: state.lastFrameRevision,
      lastAction: state.lastAction,
      lastFailure: state.lastFailure,
      visualPassClaimed: false,
      productionAuthorized: false
    });
  }

  function dispose() {
    if (state.disposed) return false;
    state.controller = null;
    state.lastSnapshot = null;
    state.lastFingerprint = "";
    state.initialized = false;
    state.disposed = true;
    state.lastAction = "disposed";
    return true;
  }

  const API = Object.freeze({
    MODULE,
    initialize,
    getWorldSnapshot,
    getInitialOrientation,
    getSettledQuaternion,
    validatePrimaryIdentity,
    getWorldContract,
    quaternionNormalize,
    quaternionMultiply,
    quaternionRotateVector,
    receipt,
    dispose
  });

  globalThis.DGB_ARCHCOIN_PLANET = API;
})();
