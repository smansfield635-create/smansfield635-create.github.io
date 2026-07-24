/* /laws/index.selection.js · Laws-only universal spatial primary standard. */
(() => {
  "use strict";
  const CONTRACT = "DGB_LAWS_UNIVERSAL_SPATIAL_PRIMARY_SELECTION_GLOW_SETTLEMENT_v1";
  const DIRECTIONS = Object.freeze(["flow", "integrity", "reality", "structure"]);
  const DIRECTION_VECTORS = Object.freeze({
    flow: Object.freeze([0, 1, 0]),
    integrity: Object.freeze([1, 0, 0]),
    reality: Object.freeze([0, -1, 0]),
    structure: Object.freeze([-1, 0, 0])
  });
  const ANCHORS = Object.freeze({
    constellation: Object.freeze([0, 0.78, 0.625]),
    cluster: Object.freeze([0, 0.70, 0.714])
  });
  const COLORS = Object.freeze({
    flow: Object.freeze([151, 181, 255]),
    integrity: Object.freeze([91, 225, 244]),
    reality: Object.freeze([255, 188, 86]),
    structure: Object.freeze([255, 128, 78])
  });
  const state = {
    root: null, field: null, controller: null, frame: null,
    projections: Object.freeze([]), lawRecords: Object.freeze([]),
    pointer: null, glow: null, bound: false, previewWrite: false,
    settleScheduled: false, previewCount: 0, settlementCount: 0,
    lastPrimaryKind: "", lastPrimaryId: ""
  };
  const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const normalizeId = value => String(value == null ? "" : value).trim();
  const normalizeDirection = value => {
    const direction = normalizeId(value).toLowerCase();
    return DIRECTIONS.includes(direction) ? direction : "";
  };
  const normalizeVector = (vector, fallback = [0, 0, 1]) => {
    const source = [finite(vector && vector[0]), finite(vector && vector[1]), finite(vector && vector[2])];
    const length = Math.hypot(...source);
    return Number.isFinite(length) && length > 1e-12
      ? source.map(component => component / length)
      : fallback.slice();
  };
  const dot = (first, second) => first[0] * second[0] + first[1] * second[1] + first[2] * second[2];
  const cross = (first, second) => [
    first[1] * second[2] - first[2] * second[1],
    first[2] * second[0] - first[0] * second[2],
    first[0] * second[1] - first[1] * second[0]
  ];
  const quaternionNormalize = (value, fallback = [0, 0, 0, 1]) => {
    const source = Array.isArray(value) || ArrayBuffer.isView(value) ? Array.from(value) : [];
    if (source.length !== 4) return fallback.slice();
    const quaternion = source.map((component, index) => finite(component, index === 3 ? 1 : 0));
    const length = Math.hypot(...quaternion);
    return Number.isFinite(length) && length > 1e-12
      ? quaternion.map(component => component / length)
      : fallback.slice();
  };
  const quaternionMultiplyRaw = (a, b) => [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
  ];
  const quaternionMultiply = (a, b) => quaternionNormalize(
    quaternionMultiplyRaw(quaternionNormalize(a), quaternionNormalize(b))
  );
  const quaternionConjugate = value => {
    const q = quaternionNormalize(value);
    return [-q[0], -q[1], -q[2], q[3]];
  };
  const quaternionRotateVector = (quaternion, vector) => {
    const q = quaternionNormalize(quaternion);
    const rotated = quaternionMultiplyRaw(
      quaternionMultiplyRaw(q, [vector[0], vector[1], vector[2], 0]),
      quaternionConjugate(q)
    );
    return [rotated[0], rotated[1], rotated[2]];
  };
  const quaternionFromAxisAngle = (axis, angle) => {
    const normalized = normalizeVector(axis);
    const half = angle * 0.5;
    const sine = Math.sin(half);
    return quaternionNormalize([
      normalized[0] * sine, normalized[1] * sine, normalized[2] * sine, Math.cos(half)
    ]);
  };
  const quaternionFromUnitVectors = (fromValue, toValue) => {
    const from = normalizeVector(fromValue);
    const to = normalizeVector(toValue);
    const cosine = clamp(dot(from, to), -1, 1);
    if (cosine > 0.999999) return [0, 0, 0, 1];
    if (cosine < -0.999999) {
      let axis = cross([1, 0, 0], from);
      if (Math.hypot(...axis) < 1e-6) axis = cross([0, 1, 0], from);
      return quaternionFromAxisAngle(axis, Math.PI);
    }
    const axis = cross(from, to);
    return quaternionNormalize([axis[0], axis[1], axis[2], 1 + cosine]);
  };
  const clusterBaseVector = (index, count) => {
    const safeCount = Math.max(1, count);
    const longitude = Math.PI * 2 * index / safeCount - Math.PI / 2;
    const latitude = Math.sin((index + 0.5) * 1.73) * 0.48;
    const cosineLatitude = Math.cos(latitude);
    return normalizeVector([
      Math.cos(longitude) * cosineLatitude,
      Math.sin(latitude),
      Math.sin(longitude) * cosineLatitude
    ]);
  };
  const primaryForRecords = (records, anchor, quaternion) => {
    const q = quaternionNormalize(quaternion);
    const target = normalizeVector(anchor);
    let bestId = "";
    let bestScore = -Infinity;
    for (const record of records) {
      if (!record || !record.id || !record.vector) continue;
      const score = dot(normalizeVector(quaternionRotateVector(q, record.vector)), target);
      if (score > bestScore) {
        bestScore = score;
        bestId = record.id;
      }
    }
    return bestId;
  };
  const primaryDirectionForQuaternion = quaternion => primaryForRecords(
    DIRECTIONS.map(direction => ({ id: direction, vector: DIRECTION_VECTORS[direction] })),
    ANCHORS.constellation,
    quaternion
  ) || "flow";
  const primaryLawForQuaternion = (lawIds, quaternion) => {
    const ids = Array.isArray(lawIds) ? lawIds.map(normalizeId).filter(Boolean) : [];
    return primaryForRecords(
      ids.map((id, index) => ({ id, vector: clusterBaseVector(index, ids.length) })),
      ANCHORS.cluster,
      quaternion
    );
  };
  const settledQuaternion = (baseVector, anchor, currentQuaternion) => {
    const current = quaternionNormalize(currentQuaternion);
    const alignment = quaternionFromUnitVectors(
      normalizeVector(quaternionRotateVector(current, baseVector)),
      anchor
    );
    return quaternionNormalize(quaternionMultiply(alignment, current));
  };
  const controllerApi = () => {
    const controller = globalThis.DGB_LAWS_CONTROLLER;
    return controller && typeof controller.getFrameState === "function" ? controller : null;
  };
  const readFrame = () => {
    try { return state.controller ? state.controller.getFrameState() : null; }
    catch (_) { return null; }
  };
  const presentationMode = frame => String(
    frame && (frame.presentationMode || (frame.presentation && frame.presentation.mode) || "")
  ).toUpperCase();
  const activePrimary = (frame = state.frame) => {
    if (!frame) return { kind: "", id: "", direction: "" };
    if (presentationMode(frame) === "CONSTELLATION") {
      const id = primaryDirectionForQuaternion(
        frame.orbitOrientation && frame.orbitOrientation.quaternion
      );
      return { kind: "category", id, direction: id };
    }
    if (presentationMode(frame) === "CLUSTER" && frame.cluster) {
      const direction = normalizeDirection(frame.cluster.direction);
      const id = primaryLawForQuaternion(
        frame.cluster.lawIds,
        frame.cluster.orientation && frame.cluster.orientation.quaternion
      );
      return { kind: "law", id, direction };
    }
    return { kind: "", id: "", direction: "" };
  };
  function writeSpatialPreview(frame) {
    if (!state.controller || !frame || state.previewWrite) return false;
    try {
      if (presentationMode(frame) === "CONSTELLATION" && frame.orbitGestureActive === true) {
        const quaternion = quaternionNormalize(frame.orbitOrientation && frame.orbitOrientation.quaternion);
        const primaryId = primaryDirectionForQuaternion(quaternion);
        if (primaryId === normalizeDirection(frame.orbitPreviewFocus)) return false;
        state.previewWrite = true;
        const accepted = state.controller.requestOrbitPreview({ quaternion, primaryId }) !== false;
        state.previewWrite = false;
        if (accepted) state.previewCount += 1;
        return accepted;
      }
      if (presentationMode(frame) === "CLUSTER" && frame.cluster && frame.cluster.gestureActive === true) {
        const direction = normalizeDirection(frame.cluster.direction);
        const quaternion = quaternionNormalize(frame.cluster.orientation && frame.cluster.orientation.quaternion);
        const primaryId = primaryLawForQuaternion(frame.cluster.lawIds, quaternion);
        if (!direction || !primaryId || primaryId === normalizeId(frame.cluster.previewPrimaryLaw)) return false;
        state.previewWrite = true;
        const accepted = state.controller.requestClusterPreview(direction, { quaternion, primaryId }) !== false;
        state.previewWrite = false;
        if (accepted) state.previewCount += 1;
        return accepted;
      }
    } catch (_) { state.previewWrite = false; }
    return false;
  }
  const lawDirection = lawId => {
    const id = normalizeId(lawId);
    const record = state.lawRecords.find(candidate =>
      normalizeId(candidate && (candidate.lawId || candidate.id)) === id
    );
    return normalizeDirection(record && record.direction);
  };
  const projectionForPrimary = primary => state.projections.find(record => {
    if (!record || record.visible === false) return false;
    const kind = normalizeId(record.kind).toLowerCase();
    const id = normalizeId(record.id || record.lawId || record.direction);
    return primary.kind === "law"
      ? kind === "law" && id === primary.id
      : (kind === "category" || kind === "direction") && id === primary.id;
  }) || null;
  const escapeSelector = value => {
    const source = normalizeId(value);
    return globalThis.CSS && typeof globalThis.CSS.escape === "function"
      ? globalThis.CSS.escape(source)
      : source.replace(/["\\]/g, "\\$&");
  };
  function markPrimary(primary) {
    if (!state.root) return;
    state.root.querySelectorAll("[data-laws-spatial-primary='true']")
      .forEach(element => element.removeAttribute("data-laws-spatial-primary"));
    if (!primary.id) return;
    const selector = primary.kind === "law"
      ? `[data-laws-law][data-law-id="${escapeSelector(primary.id)}"]`
      : `[data-laws-category][data-direction="${escapeSelector(primary.id)}"]`;
    const control = state.root.querySelector(selector);
    if (control) control.dataset.lawsSpatialPrimary = "true";
  }
  function ensureGlow() {
    if (state.glow) return true;
    if (!state.field) return false;
    const style = document.createElement("style");
    style.dataset.lawsSpatialSelectionStyle = CONTRACT;
    style.textContent = `
      [data-laws-primary-glow-layer]{position:absolute;inset:0;z-index:18;pointer-events:none;overflow:hidden;contain:layout paint}
      [data-laws-primary-glow]{position:absolute;left:50%;top:50%;width:0;height:0;border-radius:999px;opacity:0;transform:translate(-50%,-50%) scale(.72);background:radial-gradient(circle,rgba(var(--laws-primary-rgb),.62) 0%,rgba(var(--laws-primary-rgb),.34) 28%,rgba(var(--laws-primary-rgb),.12) 52%,rgba(var(--laws-primary-rgb),0) 76%);box-shadow:0 0 18px rgba(var(--laws-primary-rgb),.88),0 0 42px rgba(var(--laws-primary-rgb),.56),0 0 82px rgba(var(--laws-primary-rgb),.28);filter:blur(2.5px) saturate(1.22);mix-blend-mode:screen;transition:left 80ms linear,top 80ms linear,width 120ms ease,height 120ms ease,opacity 120ms ease,transform 140ms ease;will-change:left,top,width,height,opacity,transform}
      [data-laws-primary-glow][data-visible="true"]{opacity:.96;transform:translate(-50%,-50%) scale(1)}
      [data-laws-spatial-primary="true"]{filter:drop-shadow(0 0 8px rgba(var(--laws-primary-label-rgb,180,220,255),.95)) drop-shadow(0 0 18px rgba(var(--laws-primary-label-rgb,180,220,255),.54))}
      @media(prefers-reduced-motion:reduce){[data-laws-primary-glow]{transition:none}}
    `;
    document.head.append(style);
    const layer = document.createElement("div");
    layer.dataset.lawsPrimaryGlowLayer = CONTRACT;
    layer.setAttribute("aria-hidden", "true");
    const glow = document.createElement("div");
    glow.dataset.lawsPrimaryGlow = CONTRACT;
    glow.dataset.visible = "false";
    layer.append(glow);
    state.field.append(layer);
    state.glow = glow;
    return true;
  }
  function updateGlow() {
    if (!ensureGlow()) return;
    const primary = activePrimary();
    const projection = projectionForPrimary(primary);
    state.lastPrimaryKind = primary.kind;
    state.lastPrimaryId = primary.id;
    state.root.dataset.lawsSpatialPrimaryKind = primary.kind;
    state.root.dataset.lawsSpatialPrimaryId = primary.id;
    state.root.dataset.lawsSpatialPrimarySelection = primary.id ? "active" : "inactive";
    markPrimary(primary);
    if (!projection || !primary.id) {
      state.glow.dataset.visible = "false";
      return;
    }
    const direction = primary.direction || (primary.kind === "law" ? lawDirection(primary.id) : primary.id) || "flow";
    const color = COLORS[direction] || COLORS.flow;
    const fallbackRadius = primary.kind === "category" ? 78 : 58;
    const radius = clamp(
      finite(projection.radiusPx || projection.radius || projection.hitRadius || projection.screenRadius, fallbackRadius),
      primary.kind === "category" ? 54 : 42,
      primary.kind === "category" ? 130 : 104
    );
    const size = radius * (primary.kind === "category" ? 2.35 : 2.55);
    state.glow.style.setProperty("--laws-primary-rgb", color.join(", "));
    state.glow.style.left = `${finite(projection.x)}px`;
    state.glow.style.top = `${finite(projection.y)}px`;
    state.glow.style.width = `${size}px`;
    state.glow.style.height = `${size}px`;
    state.glow.dataset.visible = "true";
    state.root.style.setProperty("--laws-primary-label-rgb", color.join(", "));
  }
  function settleConstellation(frame) {
    const current = quaternionNormalize(frame.orbitOrientation && frame.orbitOrientation.quaternion);
    const primaryId = primaryDirectionForQuaternion(current);
    const settled = settledQuaternion(DIRECTION_VECTORS[primaryId], ANCHORS.constellation, current);
    if (state.controller.beginOrbitGesture() === false) return false;
    if (state.controller.requestOrbitPreview({ quaternion: settled, primaryId }) === false) {
      state.controller.requestOrbitCancel("laws-spatial-settlement-preview-rejected");
      return false;
    }
    const committed = state.controller.requestOrbitCommit() !== false;
    if (!committed) state.controller.requestOrbitCancel("laws-spatial-settlement-commit-rejected");
    return committed;
  }
  function settleCluster(frame, pointer) {
    if (!frame.cluster) return false;
    const direction = normalizeDirection(frame.cluster.direction);
    if (!direction || (pointer.direction && pointer.direction !== direction)) return false;
    const lawIds = Array.isArray(frame.cluster.lawIds)
      ? frame.cluster.lawIds.map(normalizeId).filter(Boolean)
      : pointer.lawIds;
    const current = quaternionNormalize(frame.cluster.orientation && frame.cluster.orientation.quaternion);
    const primaryId = primaryLawForQuaternion(lawIds, current);
    const index = lawIds.indexOf(primaryId);
    if (!primaryId || index < 0) return false;
    const settled = settledQuaternion(clusterBaseVector(index, lawIds.length), ANCHORS.cluster, current);
    if (state.controller.beginClusterGesture(direction) === false) return false;
    if (state.controller.requestClusterPreview(direction, { quaternion: settled, primaryId }) === false) {
      state.controller.requestClusterCancel(direction, "laws-spatial-settlement-preview-rejected");
      return false;
    }
    const committed = state.controller.requestClusterCommit(direction) !== false;
    if (!committed) state.controller.requestClusterCancel(direction, "laws-spatial-settlement-commit-rejected");
    return committed;
  }
  function scheduleSettlement(pointer) {
    if (state.settleScheduled || !pointer || pointer.maximumDistance < 8) return;
    state.settleScheduled = true;
    requestAnimationFrame(() => {
      state.settleScheduled = false;
      const frame = readFrame();
      if (!frame) return;
      let settled = false;
      try {
        if (pointer.scope === "constellation" && presentationMode(frame) === "CONSTELLATION") {
          settled = settleConstellation(frame);
        } else if (pointer.scope === "cluster" && presentationMode(frame) === "CLUSTER") {
          settled = settleCluster(frame, pointer);
        }
      } catch (_) { settled = false; }
      if (settled) {
        state.settlementCount += 1;
        state.root.dataset.lawsSpatialSettlement = pointer.scope;
      }
    });
  }
  function bindPointerObservation() {
    state.field.addEventListener("pointerdown", event => {
      const frame = readFrame();
      const mode = presentationMode(frame);
      const scope = mode === "CONSTELLATION" ? "constellation" : mode === "CLUSTER" ? "cluster" : "";
      if (!scope || (event.target && event.target.closest && event.target.closest("[data-upstream-compass-control]"))) return;
      state.pointer = {
        id: event.pointerId, startX: event.clientX, startY: event.clientY,
        maximumDistance: 0, scope,
        direction: frame.cluster ? normalizeDirection(frame.cluster.direction) : "",
        lawIds: frame.cluster && Array.isArray(frame.cluster.lawIds) ? frame.cluster.lawIds.slice() : []
      };
    }, { passive: true });
    state.field.addEventListener("pointermove", event => {
      const pointer = state.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      pointer.maximumDistance = Math.max(
        pointer.maximumDistance,
        Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY)
      );
    }, { passive: true });
    state.field.addEventListener("pointerup", event => {
      const pointer = state.pointer;
      state.pointer = null;
      if (pointer && pointer.id === event.pointerId) scheduleSettlement(pointer);
    }, { passive: true });
    const clear = () => { state.pointer = null; };
    state.field.addEventListener("pointercancel", clear, { passive: true });
    state.field.addEventListener("lostpointercapture", clear, { passive: true });
    globalThis.addEventListener("blur", clear, { passive: true });
    return true;
  }
  function subscribeController() {
    try {
      state.frame = state.controller.getFrameState();
      state.projections = Object.freeze(Array.from(state.controller.getSemanticProjection() || []));
      state.lawRecords = Object.freeze(Array.from(state.controller.getCanonicalLawRecords() || []));
      state.controller.subscribeFrameState(frame => {
        state.frame = frame;
        writeSpatialPreview(frame);
        updateGlow();
      });
      state.controller.subscribeSemanticProjection(records => {
        state.projections = Object.freeze(Array.from(records || []));
        updateGlow();
      });
      return true;
    } catch (_) { return false; }
  }
  function initialize() {
    if (state.bound) return true;
    state.root = document.querySelector("[data-laws-root]");
    state.field = state.root && state.root.querySelector("[data-laws-scene-field]");
    state.controller = controllerApi();
    if (!state.root || !state.field || !state.controller) return false;
    if (!subscribeController() || !bindPointerObservation() || !ensureGlow()) return false;
    state.bound = true;
    state.root.dataset.lawsSpatialSelectionContract = CONTRACT;
    state.root.dataset.lawsSpatialSelectionStatus = "active";
    updateGlow();
    globalThis.dispatchEvent(new CustomEvent("DGB_LAWS_SPATIAL_SELECTION_READY", {
      detail: Object.freeze({
        contract: CONTRACT,
        constellationSpatialPrimary: true,
        clusterSpatialPrimary: true,
        selectionDrivenGlow: true,
        releaseSettlement: true
      })
    }));
    return true;
  }
  function activate() {
    if (!initialize()) globalThis.setTimeout(activate, 80);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activate, { once: true });
  } else {
    activate();
  }
  globalThis.DGB_LAWS_SPATIAL_SELECTION = Object.freeze({
    contract: CONTRACT,
    primaryDirectionForQuaternion,
    primaryLawForQuaternion,
    getState: () => Object.freeze({
      bound: state.bound,
      previewCount: state.previewCount,
      settlementCount: state.settlementCount,
      primaryKind: state.lastPrimaryKind,
      primaryId: state.lastPrimaryId
    })
  });
})();
