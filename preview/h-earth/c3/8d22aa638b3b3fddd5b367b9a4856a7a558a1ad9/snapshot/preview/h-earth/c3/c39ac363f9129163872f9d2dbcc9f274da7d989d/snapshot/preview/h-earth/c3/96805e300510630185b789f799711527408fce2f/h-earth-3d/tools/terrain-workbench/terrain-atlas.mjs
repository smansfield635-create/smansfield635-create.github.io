import { buildHEarthB1MorphologyDescriptorBaseline } from '../../analysis/morphology/h-earth.b1-morphology-descriptor-baseline.v1.mjs';
import { buildHEarthB2ProtectionModel } from '../../analysis/morphology/h-earth.b2-protection-model.v1.mjs';
import b2Authority from '../../control-plane/post-cp2-round2/morphology/h-earth.b2-protection-model.v1.mjs';

export const B1_BASELINE_DIGEST = 'fnv1a32:513f79fa';
export const B2_PROTECTION_DIGEST = 'fnv1a32:f228a5b5';

export const LANDFORM_LABELS = Object.freeze([
  'LEVEL_OR_NEUTRAL',
  'HIGH_RIDGE',
  'RIDGE_SHOULDER',
  'UPPER_SLOPE',
  'CONVEX_MIDSLOPE',
  'OPEN_SLOPE',
  'CONCAVE_MIDSLOPE',
  'LOWER_SLOPE',
  'VALLEY_SHOULDER',
  'DEEP_VALLEY'
]);

export const TERRAIN_LAYERS = Object.freeze([
  { key: 'heights', label: 'Elevation', kind: 'continuous' },
  { key: 'residual', label: 'Residual elevation', kind: 'diverging' },
  { key: 'directionalSlope', label: 'Directional slope', kind: 'diverging' },
  { key: 'slopeMagnitude', label: 'Slope magnitude', kind: 'continuous' },
  { key: 'aspect', label: 'Aspect', kind: 'cyclic' },
  { key: 'profileCurvature', label: 'Profile curvature', kind: 'diverging' },
  { key: 'planCurvature', label: 'Plan curvature', kind: 'diverging' },
  { key: 'localReliefSmall', label: 'Local relief — small', kind: 'continuous' },
  { key: 'localReliefMedium', label: 'Local relief — medium', kind: 'continuous' },
  { key: 'localReliefLarge', label: 'Local relief — large', kind: 'continuous' },
  { key: 'tpiSmall', label: 'TPI — small', kind: 'diverging' },
  { key: 'tpiMedium', label: 'TPI — medium', kind: 'diverging' },
  { key: 'tpiLarge', label: 'TPI — large', kind: 'diverging' },
  { key: 'landformClass', label: 'Landform class', kind: 'categorical' },
  { key: 'ridgeDistance', label: 'Ridge distance', kind: 'continuous' },
  { key: 'valleyDistance', label: 'Valley distance', kind: 'continuous' },
  { key: 'flowAccumulation', label: 'Flow accumulation', kind: 'log' },
  { key: 'positiveOpenness', label: 'Positive openness', kind: 'continuous' },
  { key: 'negativeOpenness', label: 'Negative openness', kind: 'continuous' },
  { key: 'hotspotWeights', label: 'Repetition hotspots', kind: 'continuous' },
  { key: 'protectionClass', label: 'Protected world authority', kind: 'protection' },
  { key: 'hardness', label: 'Protection hardness', kind: 'continuous' },
  { key: 'editableWeight', label: 'Editable weight', kind: 'continuous' }
]);

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

function valuesForLayer(baseline, protection, key) {
  if (key in baseline) return baseline[key];
  if (key === 'localReliefSmall') return baseline.localRelief.small;
  if (key === 'localReliefMedium') return baseline.localRelief.medium;
  if (key === 'localReliefLarge') return baseline.localRelief.large;
  if (key === 'tpiSmall') return baseline.tpi.small;
  if (key === 'tpiMedium') return baseline.tpi.medium;
  if (key === 'tpiLarge') return baseline.tpi.large;
  if (key === 'hardness') return protection.hardness;
  if (key === 'editableWeight') return protection.editableWeight;
  return null;
}

function finiteRange(values, transform = (value) => value) {
  let minimum = Infinity;
  let maximum = -Infinity;
  for (const value of values) {
    const transformed = transform(value);
    if (!Number.isFinite(transformed)) continue;
    minimum = Math.min(minimum, transformed);
    maximum = Math.max(maximum, transformed);
  }
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) return { minimum: 0, maximum: 1 };
  if (Math.abs(maximum - minimum) < 1e-12) return { minimum: minimum - 0.5, maximum: maximum + 0.5 };
  return { minimum, maximum };
}

function hsvToRgb(hue, saturation, value) {
  const h = ((hue % 360) + 360) % 360 / 60;
  const c = value * saturation;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = value - c;
  let rgb = [0, 0, 0];
  if (h < 1) rgb = [c, x, 0];
  else if (h < 2) rgb = [x, c, 0];
  else if (h < 3) rgb = [0, c, x];
  else if (h < 4) rgb = [0, x, c];
  else if (h < 5) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((component) => Math.round((component + m) * 255));
}

function continuousColor(t) {
  const x = clamp(t);
  return [
    Math.round(22 + 218 * x),
    Math.round(35 + 184 * Math.sqrt(x)),
    Math.round(48 + 125 * (1 - Math.abs(2 * x - 1)))
  ];
}

function divergingColor(t) {
  const x = clamp(t);
  if (x < 0.5) {
    const a = x * 2;
    return [Math.round(32 + 205 * a), Math.round(74 + 166 * a), Math.round(155 + 80 * a)];
  }
  const a = (x - 0.5) * 2;
  return [Math.round(237 + 18 * a), Math.round(240 - 175 * a), Math.round(235 - 190 * a)];
}

const LANDFORM_COLORS = Object.freeze([
  [120, 132, 126], [242, 229, 174], [209, 188, 118], [177, 154, 94], [143, 124, 82],
  [112, 111, 91], [86, 112, 103], [62, 115, 122], [45, 94, 131], [31, 66, 119]
]);

const PROTECTION_COLORS = Object.freeze({
  P0: [247, 74, 74],
  P1: [250, 184, 61],
  P2: [81, 150, 248],
  FREE: [52, 65, 72]
});

function protectionClassAt(protection, index) {
  if (protection.p0[index]) return 'P0';
  if (protection.p1[index]) return 'P1';
  if (protection.p2[index]) return 'P2';
  return 'FREE';
}

function colorForLayer(layer, value, range, protectionClass) {
  if (layer.kind === 'protection') return PROTECTION_COLORS[protectionClass];
  if (layer.kind === 'categorical') return LANDFORM_COLORS[value] ?? [255, 0, 255];
  if (layer.kind === 'cyclic') return hsvToRgb((value / (Math.PI * 2)) * 360, 0.72, 0.92);
  const transformed = layer.kind === 'log' ? Math.log1p(Math.max(0, value)) : value;
  const normalized = clamp((transformed - range.minimum) / (range.maximum - range.minimum));
  return layer.kind === 'diverging' ? divergingColor(normalized) : continuousColor(normalized);
}

function applyProtectionOverlay(rgb, protectionClass, opacity, enabled) {
  if (!enabled[protectionClass]) return rgb;
  const overlay = PROTECTION_COLORS[protectionClass];
  const alpha = protectionClass === 'FREE' ? opacity * 0.18 : opacity;
  return rgb.map((channel, index) => Math.round(channel * (1 - alpha) + overlay[index] * alpha));
}

export function createTerrainAtlasModel() {
  const baseline = buildHEarthB1MorphologyDescriptorBaseline();
  if (baseline.baselineDigest !== B1_BASELINE_DIGEST) {
    throw new Error(`TERRAIN_WORKBENCH_B1_DIGEST_MISMATCH:${baseline.baselineDigest}`);
  }
  const protection = buildHEarthB2ProtectionModel(b2Authority);
  if (protection.protectionDigest !== B2_PROTECTION_DIGEST) {
    throw new Error(`TERRAIN_WORKBENCH_B2_DIGEST_MISMATCH:${protection.protectionDigest}`);
  }

  const layerByKey = new Map(TERRAIN_LAYERS.map((layer) => [layer.key, layer]));

  function draw(canvas, layerKey, overlay = {}) {
    const layer = layerByKey.get(layerKey);
    if (!layer) throw new Error(`TERRAIN_WORKBENCH_UNKNOWN_LAYER:${layerKey}`);
    const width = baseline.grid.width;
    const height = baseline.grid.height;
    const values = valuesForLayer(baseline, protection, layerKey);
    const transform = layer.kind === 'log' ? (value) => Math.log1p(Math.max(0, value)) : (value) => value;
    const range = values ? finiteRange(values, transform) : { minimum: 0, maximum: 1 };
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const context = offscreen.getContext('2d', { alpha: false });
    const image = context.createImageData(width, height);
    const enabled = {
      P0: overlay.P0 !== false,
      P1: overlay.P1 !== false,
      P2: overlay.P2 !== false,
      FREE: overlay.FREE === true
    };
    const overlayOpacity = Number.isFinite(overlay.opacity) ? clamp(overlay.opacity) : 0.52;

    for (let index = 0; index < width * height; index += 1) {
      const protectionClass = protectionClassAt(protection, index);
      const value = layer.kind === 'protection' ? 0 : values[index];
      let rgb = colorForLayer(layer, value, range, protectionClass);
      if (layer.kind !== 'protection') rgb = applyProtectionOverlay(rgb, protectionClass, overlayOpacity, enabled);
      const target = index * 4;
      image.data[target] = rgb[0];
      image.data[target + 1] = rgb[1];
      image.data[target + 2] = rgb[2];
      image.data[target + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    const target = canvas.getContext('2d', { alpha: false });
    target.imageSmoothingEnabled = false;
    target.clearRect(0, 0, canvas.width, canvas.height);
    target.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    return { layer, range };
  }

  function inspectCanvasPoint(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const normalizedX = clamp((clientX - rect.left) / Math.max(1, rect.width));
    const normalizedY = clamp((clientY - rect.top) / Math.max(1, rect.height));
    const column = Math.min(baseline.grid.width - 1, Math.floor(normalizedX * baseline.grid.width));
    const row = Math.min(baseline.grid.height - 1, Math.floor(normalizedY * baseline.grid.height));
    const index = row * baseline.grid.width + column;
    return inspectCell(column, row, index);
  }

  function inspectCell(column, row, index = row * baseline.grid.width + column) {
    const worldX = baseline.domain.xMinimum + column * baseline.grid.xSpacing;
    const worldZ = baseline.domain.zMinimum + row * baseline.grid.zSpacing;
    const code = baseline.landformClass[index];
    return Object.freeze({
      column,
      row,
      index,
      worldX,
      worldZ,
      elevation: baseline.heights[index],
      residualElevation: baseline.residual[index],
      directionalSlope: baseline.directionalSlope[index],
      slope: baseline.slopeMagnitude[index],
      aspectRadians: baseline.aspect[index],
      aspectDegrees: baseline.aspect[index] * 180 / Math.PI,
      profileCurvature: baseline.profileCurvature[index],
      planCurvature: baseline.planCurvature[index],
      landformClass: code,
      landformLabel: LANDFORM_LABELS[code],
      ridgeDistance: baseline.ridgeDistance[index],
      valleyDistance: baseline.valleyDistance[index],
      flowAccumulation: baseline.flowAccumulation[index],
      tpi: {
        small: baseline.tpi.small[index],
        medium: baseline.tpi.medium[index],
        large: baseline.tpi.large[index]
      },
      openness: {
        positive: baseline.positiveOpenness[index],
        negative: baseline.negativeOpenness[index]
      },
      repetitionHotspotWeight: baseline.hotspotWeights[index],
      protectionClass: protectionClassAt(protection, index),
      hardness: protection.hardness[index],
      editableWeight: protection.editableWeight[index]
    });
  }

  return Object.freeze({
    baseline,
    protection,
    layers: TERRAIN_LAYERS,
    draw,
    inspectCanvasPoint,
    inspectCell
  });
}

export default createTerrainAtlasModel;
