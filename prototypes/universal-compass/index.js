/* Universal Compass three-dimensional browser renderer and mount adapter. */

import { createPlanetAuthority } from "./index.planet.js";
import {
  buildUvSphereShape,
  buildFacetedCrystalShape,
  buildRadialStarShape,
  createCrystalAuthority
} from "./index.crystals.js";
import { createCompassController } from "./index.controller.js";
import { createCompositor } from "./index.compositor.js";
import { createInteractionAuthority } from "./index.interactions.js";

const root = document.documentElement;
const requireElement = selector => {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`COMPASS_MOUNT_MISSING:${selector}`);
  return element;
};

const ui = Object.freeze({
  status: requireElement("[data-reference-status]"),
  field: requireElement("[data-reference-field]"),
  visual: requireElement("[data-reference-visual]"),
  semantic: requireElement("[data-reference-semantic]"),
  selection: requireElement("[data-reference-selection]"),
  presentation: requireElement("[data-reference-presentation]"),
  primary: requireElement("[data-reference-primary]"),
  worldRevision: requireElement("[data-reference-world-revision]"),
  projectionRevision: requireElement("[data-reference-projection-revision]"),
  controllerRevision: requireElement("[data-reference-controller-revision]"),
  receipt: requireElement("[data-reference-receipt]"),
  constellation: requireElement("[data-reference-constellation]"),
  cluster: requireElement("[data-reference-cluster]"),
  hold: requireElement("[data-reference-hold]"),
  reducedMotion: requireElement("[data-reference-reduced-motion]")
});

const CENTER = Object.freeze([0, 0, 10]);
const CAMERA_OFFSET = Object.freeze([0, 0, -10]);
const CAMERA_UP = Object.freeze([0, 1, 0]);
const AXIS_LENGTH = 3.35;
const CARDINAL_HUES = Object.freeze({ NORTH: 30, EAST: 282, SOUTH: 204, WEST: 145 });

let planet;
let crystals;
let controller;
let compositor;
let interactions;
let worldSnapshot;
let crystalInput;
let worldById;
let crystalById;
let canvas;
let context;
let lastProjection;
let lastFrameTime = 0;
let framePending = false;
let activePointerId = "";
let receipt = "No local receipt yet.";

function activeOrientation(state = controller.getState()) {
  const orientation = state.presentation === "CONSTELLATION"
    ? state.constellation
    : state.clusters[state.activeCardinalId];
  if (!orientation) throw new Error("COMPASS_ACTIVE_ORIENTATION_MISSING");
  return orientation;
}

function normalizedQuaternion(value) {
  if (!Array.isArray(value) || value.length !== 4 || value.some(component => !Number.isFinite(component))) {
    throw new Error("COMPASS_BOOTSTRAP_QUATERNION_INVALID");
  }
  const length = Math.hypot(...value);
  if (!(length > 1e-8)) throw new Error("COMPASS_BOOTSTRAP_QUATERNION_INVALID");
  return value.map(component => component / length);
}

function rotateVector(vector, quaternion) {
  const [x, y, z, w] = normalizedQuaternion(quaternion);
  const [vx, vy, vz] = vector;
  const tx = 2 * (y * vz - z * vy);
  const ty = 2 * (z * vx - x * vz);
  const tz = 2 * (x * vy - y * vx);
  return [
    vx + w * tx + y * tz - z * ty,
    vy + w * ty + z * tx - x * tz,
    vz + w * tz + x * ty - y * tx
  ];
}

function cameraForState(state = controller.getState()) {
  const [x, y, z, w] = normalizedQuaternion(activeOrientation(state).quaternion);
  const inverse = [-x, -y, -z, w];
  const offset = rotateVector(CAMERA_OFFSET, inverse);
  return Object.freeze({
    position: Object.freeze(CENTER.map((component, index) => component + offset[index])),
    target: CENTER,
    up: Object.freeze(rotateVector(CAMERA_UP, inverse)),
    fieldOfViewYDegrees: window.innerWidth < 700 ? 50 : 44,
    near: 0.1,
    far: 100
  });
}

function setReceipt(value) {
  receipt = String(value);
  ui.receipt.textContent = receipt;
}

function cardinalFor(record) {
  return record.kind === "CARDINAL" ? record.id : record.parentId || "CENTER";
}

function hueFor(record) {
  return CARDINAL_HUES[cardinalFor(record)] ?? 190;
}

function worldPoint(localPoint, worldRecord) {
  const scaled = localPoint.map((component, index) => component * worldRecord.worldScale[index]);
  const rotated = rotateVector(scaled, worldRecord.worldOrientation);
  return rotated.map((component, index) => component + worldRecord.worldPosition[index]);
}

function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function subtract3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}
function normalize3(value) {
  const length = Math.hypot(...value) || 1;
  return value.map(component => component / length);
}

function projectPoint(point, projection) {
  const relative = subtract3(point, projection.camera.position);
  const viewX = dot3(relative, projection.cameraBasis.right);
  const viewY = dot3(relative, projection.cameraBasis.up);
  const viewZ = dot3(relative, projection.cameraBasis.forward);
  const safeDepth = Math.max(Math.abs(viewZ), projection.camera.near * 1e-6);
  const aspect = projection.viewport.width / projection.viewport.height;
  const focal = 1 / Math.tan(projection.camera.fieldOfViewYRadians * 0.5);
  const ndcX = (viewX * focal / aspect) / safeDepth;
  const ndcY = (viewY * focal) / safeDepth;
  return {
    x: (ndcX * 0.5 + 0.5) * projection.viewport.width,
    y: (0.5 - ndcY * 0.5) * projection.viewport.height,
    depth: viewZ,
    visible: viewZ > projection.camera.near && viewZ < projection.camera.far
  };
}

function ensureCanvas(projection) {
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.className = "compass-renderer";
    canvas.setAttribute("aria-hidden", "true");
    ui.visual.replaceChildren(canvas);
    context = canvas.getContext("2d", { alpha: true });
  }
  const dpr = Math.min(2, Math.max(1, projection.viewport.pixelRatio));
  const width = Math.max(1, Math.round(projection.viewport.width * dpr));
  const height = Math.max(1, Math.round(projection.viewport.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${projection.viewport.width}px`;
    canvas.style.height = `${projection.viewport.height}px`;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, projection.viewport.width, projection.viewport.height);
}

function drawPolyline(points, projection, stroke, width = 1, dash = []) {
  const projected = points.map(point => projectPoint(point, projection));
  context.save();
  context.beginPath();
  projected.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.strokeStyle = stroke;
  context.lineWidth = width;
  context.setLineDash(dash);
  context.stroke();
  context.restore();
}

function drawOrbitRings(projection) {
  const planes = [
    { color: "rgba(116, 164, 255, .22)", point: angle => [Math.cos(angle) * 2.85, Math.sin(angle) * 2.85, 0] },
    { color: "rgba(205, 130, 255, .14)", point: angle => [Math.cos(angle) * 2.85, 0, Math.sin(angle) * 2.85] },
    { color: "rgba(105, 232, 168, .12)", point: angle => [0, Math.cos(angle) * 2.85, Math.sin(angle) * 2.85] }
  ];
  for (const plane of planes) {
    const points = [];
    for (let index = 0; index <= 96; index += 1) {
      const angle = Math.PI * 2 * index / 96;
      const offset = plane.point(angle);
      points.push(CENTER.map((value, axis) => value + offset[axis]));
    }
    drawPolyline(points, projection, plane.color, 1);
  }
}

function drawAxes(projection) {
  const axes = [
    { id: "X", vector: [AXIS_LENGTH, 0, 0], color: "#ff596b" },
    { id: "Y", vector: [0, AXIS_LENGTH, 0], color: "#5ee58d" },
    { id: "Z", vector: [0, 0, AXIS_LENGTH], color: "#5ea7ff" }
  ];
  const origin = projectPoint(CENTER, projection);
  for (const axis of axes) {
    const positive = CENTER.map((value, index) => value + axis.vector[index]);
    const negative = CENTER.map((value, index) => value - axis.vector[index]);
    const positivePoint = projectPoint(positive, projection);
    const negativePoint = projectPoint(negative, projection);
    context.save();
    context.beginPath();
    context.moveTo(negativePoint.x, negativePoint.y);
    context.lineTo(origin.x, origin.y);
    context.strokeStyle = `${axis.color}55`;
    context.lineWidth = 1;
    context.setLineDash([5, 6]);
    context.stroke();
    context.beginPath();
    context.moveTo(origin.x, origin.y);
    context.lineTo(positivePoint.x, positivePoint.y);
    context.strokeStyle = axis.color;
    context.lineWidth = 1.8;
    context.setLineDash([]);
    context.shadowColor = axis.color;
    context.shadowBlur = 8;
    context.stroke();
    context.fillStyle = axis.color;
    context.font = "700 12px ui-monospace, monospace";
    context.fillText(axis.id, positivePoint.x + 7, positivePoint.y - 7);
    context.restore();
  }
}

function trianglesForShape(shape) {
  const indices = shape.indices.length
    ? shape.indices
    : Array.from({ length: shape.positions.length }, (_, index) => index);
  const triangles = [];
  for (let index = 0; index < indices.length; index += 3) {
    triangles.push({
      local: [shape.positions[indices[index]], shape.positions[indices[index + 1]], shape.positions[indices[index + 2]]],
      material: shape.triangleMaterialRegionIds[index / 3] || ""
    });
  }
  return triangles;
}

function triangleColor(record, triangleIndex, material, light) {
  if (record.kind === "CENTER") {
    const land = ((triangleIndex * 17 + Math.floor(light * 10)) % 7) < 2;
    return land
      ? `hsl(147 58% ${28 + light * 25}%)`
      : `hsl(207 78% ${22 + light * 30}%)`;
  }
  const hue = hueFor(record);
  const edge = material.includes("EDGE") || material.includes("FACET");
  const saturation = edge ? 78 : 92;
  const lightness = (edge ? 32 : 42) + light * (edge ? 25 : 32);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function drawMeshRecords(projection) {
  const visibleById = new Map(projection.records.filter(record => record.visible).map(record => [record.id, record]));
  const batches = [];
  for (const [id, projectedRecord] of visibleById) {
    const crystalRecord = crystalById.get(id);
    const worldRecord = worldById.get(id);
    const shape = crystals.getShape(crystalRecord.shapeId);
    const triangles = trianglesForShape(shape);
    triangles.forEach((triangle, triangleIndex) => {
      const worldVertices = triangle.local.map(point => worldPoint(point, worldRecord));
      const projectedVertices = worldVertices.map(point => projectPoint(point, projection));
      if (projectedVertices.some(point => !point.visible)) return;
      const edgeA = subtract3(worldVertices[1], worldVertices[0]);
      const edgeB = subtract3(worldVertices[2], worldVertices[0]);
      const normal = normalize3(cross3(edgeA, edgeB));
      const light = Math.max(0.08, Math.min(1, Math.abs(dot3(normal, normalize3([-0.35, 0.65, -0.68])))));
      batches.push({
        record: projectedRecord,
        points: projectedVertices,
        depth: projectedVertices.reduce((sum, point) => sum + point.depth, 0) / 3,
        color: triangleColor(projectedRecord, triangleIndex, triangle.material, light),
        glow: `hsla(${hueFor(projectedRecord)} 95% 65% / .35)`,
        rear: projectedRecord.depthLayer === "REAR"
      });
    });
  }
  batches.sort((a, b) => b.depth - a.depth);
  for (const batch of batches) {
    context.save();
    context.beginPath();
    context.moveTo(batch.points[0].x, batch.points[0].y);
    context.lineTo(batch.points[1].x, batch.points[1].y);
    context.lineTo(batch.points[2].x, batch.points[2].y);
    context.closePath();
    context.globalAlpha = batch.rear ? 0.55 : 0.95;
    context.fillStyle = batch.color;
    context.strokeStyle = batch.rear ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.28)";
    context.lineWidth = 0.65;
    context.shadowColor = batch.glow;
    context.shadowBlur = batch.record.kind === "CARDINAL" ? 14 : 5;
    context.fill();
    context.shadowBlur = 0;
    context.stroke();
    context.restore();
  }
}

function selectableRecords(projection, state) {
  return projection.interactionProjectionRecords.filter(record =>
    state.presentation === "CONSTELLATION"
      ? record.kind === "CARDINAL"
      : record.kind === "CHILD" && record.parentId === state.activeCardinalId
  );
}

function labelFor(record) {
  if (record.kind === "CARDINAL") return record.id;
  const match = record.id.match(/_CHILD_(\d+)$/);
  return match ? match[1] : record.id;
}

function semanticPosition(record, projection, state) {
  const source = record.projectedLabelAnchor;
  const fieldCenter = { x: projection.viewport.width * 0.5, y: projection.viewport.height * 0.5 };
  const dx = source.screenX - fieldCenter.x;
  const dy = source.screenY - fieldCenter.y;
  const length = Math.hypot(dx, dy) || 1;
  const offset = state.presentation === "CLUSTER" ? 46 : 34;
  return {
    x: Math.max(34, Math.min(projection.viewport.width - 34, source.screenX + dx / length * offset)),
    y: Math.max(30, Math.min(projection.viewport.height - 30, source.screenY + dy / length * offset))
  };
}

function mountSemanticControls(projection) {
  const state = controller.getState();
  const selectable = selectableRecords(projection, state);
  ui.semantic.replaceChildren(...selectable.map(record => {
    const position = semanticPosition(record, projection, state);
    const button = document.createElement("button");
    const label = document.createElement("span");
    button.type = "button";
    button.className = `reference-node-control reference-node-control--${record.kind.toLowerCase()}`;
    button.dataset.nodeId = record.id;
    button.dataset.nodeKind = record.kind;
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
    button.style.setProperty("--accent-h", String(hueFor(record)));
    button.style.setProperty("--hit-size", `${Math.max(record.kind === "CARDINAL" ? 74 : 50, Math.min(118, record.projectedSphere.radiusPx * 2.15))}px`);
    label.textContent = labelFor(record);
    button.append(label);
    button.disabled = state.held;
    button.setAttribute("aria-label", record.id.replaceAll("_", " "));
    button.setAttribute("aria-pressed", String(record.id === state.activeCardinalId || record.id === state.selectedChildId));
    return button;
  }));
}

function mountProjection(projection) {
  lastProjection = projection;
  const state = controller.getState();
  const visible = projection.records.filter(record => record.visible);
  ensureCanvas(projection);
  drawOrbitRings(projection);
  drawAxes(projection);
  drawMeshRecords(projection);
  mountSemanticControls(projection);
  const orientation = activeOrientation(state);
  ui.selection.textContent = state.selectedChildId || state.activeCardinalId || "No node selected";
  ui.presentation.textContent = state.presentation;
  ui.primary.textContent = orientation.previewPrimaryId || orientation.primaryId || "Pending";
  ui.worldRevision.textContent = String(worldSnapshot.worldRevision);
  ui.projectionRevision.textContent = String(projection.projectionRevision);
  ui.controllerRevision.textContent = String(state.revision);
  ui.receipt.textContent = receipt;
  ui.status.textContent = `Ready · ${visible.length} objects · XYZ active`;
  const constellation = state.presentation === "CONSTELLATION";
  ui.constellation.disabled = state.held || constellation;
  ui.cluster.disabled = state.held || !constellation;
  ui.constellation.setAttribute("aria-pressed", String(constellation));
  ui.cluster.setAttribute("aria-pressed", String(!constellation));
  ui.hold.setAttribute("aria-pressed", String(state.held));
  ui.hold.textContent = state.held ? "Leave held state" : "Enter held state";
  ui.reducedMotion.setAttribute("aria-pressed", String(state.reducedMotion));
  ui.reducedMotion.textContent = `Reduced motion: ${state.reducedMotion ? "on" : "off"}`;
}

function projectFrame(timestamp) {
  framePending = false;
  compositor.setCamera(cameraForState());
  const bounds = ui.field.getBoundingClientRect();
  const deltaSeconds = lastFrameTime ? Math.min(0.1, Math.max(0, (timestamp - lastFrameTime) / 1000)) : 1 / 60;
  lastFrameTime = timestamp;
  mountProjection(compositor.project({
    worldSnapshot,
    crystalInput,
    presentationContext: controller.getPresentationContext(),
    viewport: Object.freeze({
      width: Math.max(1, bounds.width),
      height: Math.max(1, bounds.height),
      pixelRatio: Math.max(1, window.devicePixelRatio || 1)
    }),
    timestampMs: Math.max(0, timestamp),
    deltaSeconds
  }));
}

function scheduleProjection() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(projectFrame);
}

function forwardTargetProposal({ targetId, kind }) {
  if (kind === "CARDINAL") controller.openCluster(targetId);
  else if (kind === "CHILD") controller.selectChild(targetId);
}

function processInteraction(result) {
  if (!result) return;
  setReceipt(result.mode || result.reason || result.phase || "INTERACTION");
  if (result.mode === "TAP_PROPOSAL" && result.targetProposal) forwardTargetProposal(result.targetProposal);
  scheduleProjection();
}

function interrupt(reason) {
  if (!interactions.getActive()) return;
  processInteraction(interactions.interrupt(reason));
  activePointerId = "";
}

function localPoint(event) {
  const bounds = ui.field.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function pointerKind(value) {
  const kind = String(value || "mouse").toUpperCase();
  return ["MOUSE", "TOUCH", "PEN"].includes(kind) ? kind : "MOUSE";
}

function bindUi() {
  ui.constellation.addEventListener("click", () => {
    interrupt("constellation-control");
    if (controller.getState().presentation === "CLUSTER") controller.closeCluster();
  });
  ui.cluster.addEventListener("click", () => {
    interrupt("cluster-control");
    controller.openCluster(activeOrientation().primaryId || "NORTH");
  });
  ui.hold.addEventListener("click", () => {
    if (controller.getState().held) controller.leaveHeld();
    else {
      interrupt("held-control");
      controller.enterHeld("prototype-control");
    }
  });
  ui.reducedMotion.addEventListener("click", () => controller.setReducedMotion(!controller.getState().reducedMotion));
  ui.semantic.addEventListener("click", event => {
    if (event.detail !== 0) return;
    const button = event.target.closest(".reference-node-control");
    if (button) forwardTargetProposal({ targetId: button.dataset.nodeId, kind: button.dataset.nodeKind });
  });
  ui.field.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const point = localPoint(event);
    const target = event.target.closest(".reference-node-control");
    const result = interactions.begin({
      id: String(event.pointerId),
      kind: pointerKind(event.pointerType),
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp),
      targetId: target?.dataset.nodeId || ""
    });
    processInteraction(result);
    if (!result.accepted) return;
    activePointerId = String(event.pointerId);
    ui.field.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  ui.field.addEventListener("pointermove", event => {
    if (activePointerId !== String(event.pointerId)) return;
    const point = localPoint(event);
    processInteraction(interactions.move({ id: activePointerId, x: point.x, y: point.y, timestamp: Math.max(0, event.timeStamp) }));
    event.preventDefault();
  });
  const endPointer = (event, cancel) => {
    if (activePointerId !== String(event.pointerId)) return;
    const point = localPoint(event);
    processInteraction(interactions.end({
      id: activePointerId,
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp),
      cancel
    }));
    activePointerId = "";
    event.preventDefault();
  };
  ui.field.addEventListener("pointerup", event => endPointer(event, false));
  ui.field.addEventListener("pointercancel", event => endPointer(event, true));
  ui.field.addEventListener("lostpointercapture", () => interrupt("pointer-capture-lost"));
}

function initialize() {
  planet = createPlanetAuthority();
  worldSnapshot = planet.getWorldSnapshot();
  worldById = new Map(worldSnapshot.records.map(record => [record.id, record]));
  const materialRegionDefinitions = Object.freeze([
    Object.freeze({ id: "GLOBE_SURFACE", semanticRole: "CENTER_WORLD" }),
    Object.freeze({ id: "STAR_FACE", semanticRole: "CARDINAL_FACE" }),
    Object.freeze({ id: "STAR_EDGE", semanticRole: "CARDINAL_EDGE" }),
    Object.freeze({ id: "CRYSTAL_CAP", semanticRole: "CHILD_CAP" }),
    Object.freeze({ id: "CRYSTAL_FACET", semanticRole: "CHILD_FACET" })
  ]);
  const shapeDefinitions = Object.freeze([
    buildUvSphereShape({ id: "CENTER_GLOBE", radius: 1.1, longitudeSegments: 22, latitudeSegments: 14, materialRegionId: "GLOBE_SURFACE" }),
    buildRadialStarShape({ id: "CARDINAL_STAR", points: 8, outerRadius: 1, innerRadius: 0.38, depth: 0.34, faceMaterialRegionId: "STAR_FACE", edgeMaterialRegionId: "STAR_EDGE" }),
    buildFacetedCrystalShape({ id: "CHILD_CRYSTAL", radialSegments: 8, halfHeight: 1, shoulderRadius: 0.5, shoulderY: 0.3, waistRadius: 0.28, waistY: -0.34, capMaterialRegionId: "CRYSTAL_CAP", sideMaterialRegionId: "CRYSTAL_FACET" })
  ]);
  const visualProfile = Object.freeze({
    id: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_VISUAL_PROFILE_v1",
    byKind: Object.freeze({
      CENTER: Object.freeze({ shapeId: "CENTER_GLOBE", visualScale: Object.freeze([1.1, 1.1, 1.1]), materialRegionIds: Object.freeze(["GLOBE_SURFACE"]) }),
      CARDINAL: Object.freeze({ shapeId: "CARDINAL_STAR", visualScale: Object.freeze([1.18, 1.18, 0.92]), materialRegionIds: Object.freeze(["STAR_FACE", "STAR_EDGE"]) }),
      CHILD: Object.freeze({ shapeId: "CHILD_CRYSTAL", visualScale: Object.freeze([1.18, 1.18, 1.18]), materialRegionIds: Object.freeze(["CRYSTAL_CAP", "CRYSTAL_FACET"]) })
    })
  });
  crystals = createCrystalAuthority({ visualProfile, shapeDefinitions, materialRegionDefinitions, crystalRevision: 2 });
  crystals.consumeWorldSnapshot(worldSnapshot);
  crystalInput = crystals.getCompositorInput();
  crystalById = new Map(crystals.getCrystalRecords().map(record => [record.id, record]));
  controller = createCompassController({
    planet,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  });
  compositor = createCompositor({
    cameraConfig: cameraForState(controller.getState()),
    projectionConfig: {
      centerDepth: 10,
      depthHysteresis: 0.28,
      interpolationRate: 8,
      maxDeltaSeconds: 0.1,
      expectedRecordCount: 21,
      expectedKindCounts: { CENTER: 1, CARDINAL: 4, CHILD: 16 }
    }
  });
  interactions = createInteractionAuthority({ controller, planet, compositor });
  bindUi();
  controller.subscribe(scheduleProjection);
  new ResizeObserver(scheduleProjection).observe(ui.field);
  Object.defineProperty(window, "__UNIVERSAL_COMPASS_REFERENCE__", {
    value: Object.freeze({
      getLastProjection: () => lastProjection,
      getStatus: () => Object.freeze({
        runtime: root.dataset.compassRuntime,
        worldRevision: worldSnapshot.worldRevision,
        projectionRevision: lastProjection?.projectionRevision || 0,
        controllerRevision: controller.getRevision(),
        inputRevision: interactions.getInputRevision(),
        presentation: controller.getState().presentation,
        held: controller.getState().held,
        selectedChildId: controller.getState().selectedChildId,
        renderer: "CANVAS_3D_MESH",
        axes: "XYZ"
      })
    })
  });
  projectFrame(performance.now());
  root.dataset.compassRuntime = "ready";
  setReceipt("THREE_DIMENSIONAL_RENDERER_READY");
}

try {
  initialize();
} catch (error) {
  root.dataset.compassRuntime = "error";
  ui.status.textContent = "Initialization failed";
  ui.receipt.textContent = error.message;
  console.error(error);
}
