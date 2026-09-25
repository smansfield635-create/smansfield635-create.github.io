import { createRMA1SingleFamilyAblationSuite } from '../../validation/metric-attribution/h-earth.rma1-single-family-ablations-browser.mjs';
import rma1Control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.rma1-single-family-ablations.v1.mjs';
import ma2Control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma2-diagnostic-pass-authority.v1.mjs';

export const DIAGNOSTIC_PASS_KEYS = Object.freeze(Object.keys(ma2Control.passes));
export const MATERIAL_FAMILIES = Object.freeze(rma1Control.materialFamilies.map((family) => Object.freeze({ ...family })));
export const SCENES = Object.freeze(rma1Control.scenes.map((scene) => Object.freeze(JSON.parse(JSON.stringify(scene)))));

if (DIAGNOSTIC_PASS_KEYS.join('') !== 'ABCDEFGH') throw new Error(`TERRAIN_WORKBENCH_DIAGNOSTIC_PASS_REGISTRY_INVALID:${DIAGNOSTIC_PASS_KEYS.join(',')}`);
if (MATERIAL_FAMILIES.length !== 7) throw new Error(`TERRAIN_WORKBENCH_MATERIAL_FAMILY_COUNT_INVALID:${MATERIAL_FAMILIES.length}`);
if (SCENES.length !== 8) throw new Error(`TERRAIN_WORKBENCH_SCENE_COUNT_INVALID:${SCENES.length}`);

const OVERLAY_BANDS = Object.freeze([
  { key: 'macro', label: 'MACRO', lineWidth: 4, alpha: 0.72 },
  { key: 'meso', label: 'MESO', lineWidth: 3, alpha: 0.58 },
  { key: 'micro', label: 'MICRO', lineWidth: 2, alpha: 0.48 }
]);

function drawDirectionalBand(context, width, height, band, style) {
  const orientation = Number(band?.dominantOrientationDegrees);
  const lag = Math.max(2, Number(band?.dominantLagPixels) || 2);
  if (!Number.isFinite(orientation)) return;
  const radians = orientation * Math.PI / 180;
  const normalX = -Math.sin(radians);
  const normalY = Math.cos(radians);
  const span = Math.hypot(width, height) * 1.5;
  const centerX = width / 2;
  const centerY = height / 2;
  context.save();
  context.globalAlpha = style.alpha;
  context.lineWidth = style.lineWidth;
  context.strokeStyle = '#ffef78';
  context.setLineDash(style.key === 'micro' ? [5, 5] : style.key === 'meso' ? [12, 7] : []);
  for (let offset = -span; offset <= span; offset += lag) {
    const x = centerX + normalX * offset;
    const y = centerY + normalY * offset;
    context.beginPath();
    context.moveTo(x - Math.cos(radians) * span, y - Math.sin(radians) * span);
    context.lineTo(x + Math.cos(radians) * span, y + Math.sin(radians) * span);
    context.stroke();
  }
  context.restore();
}

export function drawMetricOrientationLagOverlay(sourceCanvas, targetCanvas, metric) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  targetCanvas.width = width;
  targetCanvas.height = height;
  const context = targetCanvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.fillStyle = 'rgba(0,0,0,0.24)';
  context.fillRect(0, 0, width, height);
  for (const style of OVERLAY_BANDS) drawDirectionalBand(context, width, height, metric?.bands?.[style.key], style);
  const lines = OVERLAY_BANDS.map((style) => {
    const band = metric?.bands?.[style.key] ?? {};
    return `${style.label}  θ=${Number(band.dominantOrientationDegrees).toFixed(1)}°  lag=${Number(band.dominantLagPixels).toFixed(1)}px  peak=${Number(band.peakStrength).toFixed(4)}`;
  });
  context.save();
  context.font = '600 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  const boxWidth = Math.min(width - 24, Math.max(...lines.map((line) => context.measureText(line).width)) + 24);
  context.fillStyle = 'rgba(5,9,12,0.84)';
  context.fillRect(12, 12, boxWidth, 24 + lines.length * 22);
  context.fillStyle = '#f3f6f8';
  lines.forEach((line, index) => context.fillText(line, 24, 38 + index * 22));
  context.restore();
}

function requireCanvas(canvas, label) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error(`TERRAIN_WORKBENCH_CANVAS_REQUIRED:${label}`);
  return canvas;
}

function snapshotCanvas(source) {
  const snapshot = document.createElement('canvas');
  snapshot.width = source.width;
  snapshot.height = source.height;
  snapshot.getContext('2d').drawImage(source, 0, 0);
  return snapshot;
}

function presentSnapshot(snapshot, target) {
  target.width = snapshot.width;
  target.height = snapshot.height;
  const context = target.getContext('2d');
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(snapshot, 0, 0);
}

export async function createSceneLab({ renderCanvases, viewCanvases }) {
  const officialCanvas = requireCanvas(renderCanvases?.official, 'RENDER_OFFICIAL');
  const passCanvases = {
    G: requireCanvas(renderCanvases?.G, 'RENDER_G'),
    H: requireCanvas(renderCanvases?.H, 'RENDER_H')
  };
  for (const family of MATERIAL_FAMILIES) passCanvases[family.key] = requireCanvas(renderCanvases?.[family.key], `RENDER_${family.key}`);
  const hView = requireCanvas(viewCanvases?.H, 'VIEW_H');
  const gView = requireCanvas(viewCanvases?.G, 'VIEW_G');
  const metricView = requireCanvas(viewCanvases?.metric, 'VIEW_METRIC');
  const familyView = requireCanvas(viewCanvases?.family, 'VIEW_FAMILY');

  const suite = await createRMA1SingleFamilyAblationSuite({ officialCanvas, passCanvases });
  const sceneIds = suite.listSceneIds();
  const passKeys = suite.listPassKeys();
  if (sceneIds.length !== 8 || passKeys.length !== 9) throw new Error(`TERRAIN_WORKBENCH_RMA1_REGISTRY_MISMATCH:${sceneIds.length}:${passKeys.length}`);

  const cache = new Map();
  let currentSceneId = null;
  let currentFamilyKey = MATERIAL_FAMILIES[0].key;

  function buildCacheEntry(sceneId) {
    const record = suite.renderScene(sceneId);
    const snapshots = Object.fromEntries(passKeys.map((key) => [key, snapshotCanvas(passCanvases[key])]));
    const metric = document.createElement('canvas');
    drawMetricOrientationLagOverlay(snapshots.G, metric, record.passes.G.metric);
    return Object.freeze({ record, snapshots: Object.freeze(snapshots), metric });
  }

  function present(entry) {
    presentSnapshot(entry.snapshots.H, hView);
    presentSnapshot(entry.snapshots.G, gView);
    presentSnapshot(entry.metric, metricView);
    presentSnapshot(entry.snapshots[currentFamilyKey], familyView);
  }

  function renderScene(sceneId) {
    if (!sceneIds.includes(sceneId)) throw new Error(`TERRAIN_WORKBENCH_UNKNOWN_SCENE:${sceneId}`);
    if (!cache.has(sceneId)) cache.set(sceneId, buildCacheEntry(sceneId));
    currentSceneId = sceneId;
    const entry = cache.get(sceneId);
    present(entry);
    return entry.record;
  }

  function setSelectedFamily(familyKey) {
    if (!MATERIAL_FAMILIES.some((family) => family.key === familyKey)) throw new Error(`TERRAIN_WORKBENCH_UNKNOWN_FAMILY:${familyKey}`);
    currentFamilyKey = familyKey;
    if (currentSceneId) presentSnapshot(cache.get(currentSceneId).snapshots[currentFamilyKey], familyView);
  }

  function finalizeDiagnostics() {
    if (cache.size !== sceneIds.length) throw new Error(`TERRAIN_WORKBENCH_ALL_SCENES_REQUIRED_BEFORE_FINALIZE:${cache.size}`);
    return suite.finalize();
  }

  return Object.freeze({
    sceneIds: Object.freeze([...sceneIds]),
    passKeys: Object.freeze([...passKeys]),
    diagnosticPassKeys: DIAGNOSTIC_PASS_KEYS,
    materialFamilies: MATERIAL_FAMILIES,
    renderScene,
    setSelectedFamily,
    getRecord: (sceneId) => cache.get(sceneId)?.record ?? null,
    getRecords: () => new Map([...cache.entries()].map(([sceneId, entry]) => [sceneId, entry.record])),
    getRenderedSceneCount: () => cache.size,
    finalizeDiagnostics
  });
}

export default createSceneLab;
