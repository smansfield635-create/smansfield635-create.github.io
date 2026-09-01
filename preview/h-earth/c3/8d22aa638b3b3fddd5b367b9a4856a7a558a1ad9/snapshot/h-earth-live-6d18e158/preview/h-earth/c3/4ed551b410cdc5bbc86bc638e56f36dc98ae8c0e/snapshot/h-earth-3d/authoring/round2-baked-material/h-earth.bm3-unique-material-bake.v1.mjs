import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateHEarthBM2LandformSegmentation } from './h-earth.bm2-landform-segmentation.v1.mjs';

export const H_EARTH_BM3_BAKED_WIDTH = 1024;
export const H_EARTH_BM3_BAKED_HEIGHT = 1024;
export const H_EARTH_BM3_BAKED_BYTE_LENGTH = H_EARTH_BM3_BAKED_WIDTH * H_EARTH_BM3_BAKED_HEIGHT * 4;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const RAW_PATH = path.join(ROOT, 'showroom/globe/h-earth/render/terrain-material-field.round2-baked.v1.rgba');
const METADATA_PATH = path.join(ROOT, 'showroom/globe/h-earth/render/terrain-material-field.round2-baked.v1.js');
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const quantize = (value) => Math.round(clamp01(value) * 255);
const hash32 = (value) => {
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};
const hash01 = (x, y, seed = 0) => hash32(Math.imul(x + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(y + 0xc2b2ae35, 0x27d4eb2d) ^ seed) / 0xffffffff;
const smooth = (value) => value * value * (3 - 2 * value);
const valueNoise = (x, y, scale, seed) => {
  const px = x / scale;
  const py = y / scale;
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const fx = smooth(px - x0);
  const fy = smooth(py - y0);
  const a = hash01(x0, y0, seed);
  const b = hash01(x0 + 1, y0, seed);
  const c = hash01(x0, y0 + 1, seed);
  const d = hash01(x0 + 1, y0 + 1, seed);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
};

const CLASS_PALETTES = Object.freeze([
  [0.30, 0.28, 0.20],
  [0.39, 0.40, 0.35],
  [0.35, 0.36, 0.32],
  [0.33, 0.32, 0.25],
  [0.32, 0.31, 0.23],
  [0.30, 0.30, 0.245],
  [0.245, 0.275, 0.225],
  [0.285, 0.295, 0.235],
  [0.205, 0.265, 0.225],
  [0.185, 0.235, 0.215]
]);
const VARIANT_TONES = Object.freeze([
  [-0.050, 0.012, 0.020], [0.026, -0.018, -0.010], [0.012, 0.026, -0.018], [-0.018, 0.010, 0.035],
  [0.040, 0.018, -0.022], [-0.025, -0.010, 0.018], [0.018, -0.030, 0.026], [-0.035, 0.030, 0.010],
  [0.030, 0.005, 0.030], [-0.010, 0.035, -0.025], [0.045, -0.020, 0.005], [-0.030, 0.000, 0.040],
  [0.005, 0.020, 0.035], [0.025, 0.030, -0.030], [-0.040, 0.020, -0.005], [0.015, -0.005, 0.015]
]);

const bilinear = (array, x, y, width, height) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;
  const a = array[y0 * width + x0];
  const b = array[y0 * width + x1];
  const c = array[y1 * width + x0];
  const d = array[y1 * width + x1];
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
};

export function generateHEarthBM3UniqueMaterialField() {
  const analysis = generateHEarthBM2LandformSegmentation();
  const bytes = new Uint8Array(H_EARTH_BM3_BAKED_BYTE_LENGTH);
  const aw = analysis.width;
  const ah = analysis.height;
  const scaleX = (aw - 1) / (H_EARTH_BM3_BAKED_WIDTH - 1);
  const scaleY = (ah - 1) / (H_EARTH_BM3_BAKED_HEIGHT - 1);
  const slopeStats = (() => {
    let sum = 0;
    let square = 0;
    for (const value of analysis.descriptors.slope) { sum += value; square += value * value; }
    const mean = sum / analysis.descriptors.slope.length;
    return { mean, deviation: Math.sqrt(Math.max(0, square / analysis.descriptors.slope.length - mean * mean)) };
  })();
  const slopeScale = Math.max(1e-6, slopeStats.mean + slopeStats.deviation * 1.5);

  for (let y = 0; y < H_EARTH_BM3_BAKED_HEIGHT; y += 1) {
    const ay = y * scaleY;
    const iy = Math.min(ah - 1, Math.round(ay));
    for (let x = 0; x < H_EARTH_BM3_BAKED_WIDTH; x += 1) {
      const ax = x * scaleX;
      const ix = Math.min(aw - 1, Math.round(ax));
      const ai = iy * aw + ix;
      const cls = analysis.descriptors.landformClass[ai];
      const variant = analysis.segmentation.materialVariantId[ai];
      const region = analysis.segmentation.regionId[ai];
      const palette = CLASS_PALETTES[cls];
      const tone = VARIANT_TONES[variant];
      const exposure = bilinear(analysis.descriptors.exposureWetness, ax, ay, aw, ah);
      const boundary = bilinear(analysis.segmentation.boundaryBlend, ax, ay, aw, ah);
      const slope = clamp01(bilinear(analysis.descriptors.slope, ax, ay, aw, ah) / slopeScale);
      const ridgeValley = bilinear(analysis.descriptors.signedRidgeValleyDistance, ax, ay, aw, ah);
      const tpiLarge = bilinear(analysis.descriptors.tpiLarge, ax, ay, aw, ah);
      const regionIdentity = hash01(region, variant, 0x51f15e) - 0.5;
      const broad = valueNoise(x, y, 113, 0x13a5c9) - 0.5;
      const meso = valueNoise(x, y, 37, 0x8f31b7 ^ region) - 0.5;
      const micro = valueNoise(x, y, 11, 0x47d2a1 ^ Math.imul(region + 1, 17)) - 0.5;
      const speckle = hash01(x, y, 0xa511e9 ^ region) - 0.5;
      const interior = 0.35 + boundary * 0.65;
      const materialVariation = broad * 0.13 + meso * 0.10 * interior + micro * 0.055 * interior + speckle * 0.018;
      const reliefResponse = ridgeValley * 0.025 + Math.tanh(tpiLarge * 0.08) * 0.018;
      const brightness = 0.94 + exposure * 0.12 - slope * 0.075 + materialVariation + regionIdentity * 0.055 + reliefResponse;
      const red = (palette[0] + tone[0] * 0.52 + regionIdentity * 0.014) * brightness;
      const green = (palette[1] + tone[1] * 0.52 + exposure * 0.012) * brightness;
      const blue = (palette[2] + tone[2] * 0.52 + (1 - exposure) * 0.010) * brightness;
      const alpha = clamp01(0.20 + boundary * 0.50 + exposure * 0.22 + (micro + 0.5) * 0.08);
      const offset = (y * H_EARTH_BM3_BAKED_WIDTH + x) * 4;
      bytes[offset] = quantize(red);
      bytes[offset + 1] = quantize(green);
      bytes[offset + 2] = quantize(blue);
      bytes[offset + 3] = quantize(alpha);
    }
  }

  const canonicalSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  return Object.freeze({
    schemaVersion: 'H_EARTH_BM3_UNIQUE_BAKED_MATERIAL_FIELD_OUTPUT_v1',
    width: H_EARTH_BM3_BAKED_WIDTH,
    height: H_EARTH_BM3_BAKED_HEIGHT,
    channelCount: 4,
    storage: 'RGBA8_UNORM_RAW_ROW_MAJOR_BOTTOM_TO_TOP_FALSE',
    byteLength: bytes.byteLength,
    canonicalSha256,
    domain: Object.freeze({ ...analysis.domain }),
    sourceDescriptorDigest: analysis.descriptorDigest,
    sourceSegmentationDigest: analysis.segmentationDigest,
    activeRegionCount: analysis.activeRegionCount,
    representedClassCount: analysis.representedClassCount,
    bytes
  });
}

function metadataSource(field) {
  const domain = JSON.stringify(field.domain);
  return `/** H_EARTH_UNIQUE_BAKED_LANDFORM_MATERIAL_FIELD_v1 */\nexport const H_EARTH_BAKED_MATERIAL_FIELD_ID = 'H_EARTH_UNIQUE_BAKED_LANDFORM_MATERIAL_FIELD_v1';\nexport const H_EARTH_BAKED_MATERIAL_FIELD_WIDTH = ${field.width};\nexport const H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT = ${field.height};\nexport const H_EARTH_BAKED_MATERIAL_FIELD_BYTE_LENGTH = ${field.byteLength};\nexport const H_EARTH_BAKED_MATERIAL_FIELD_SHA256 = '${field.canonicalSha256}';\nexport const H_EARTH_BAKED_MATERIAL_FIELD_DOMAIN = Object.freeze(${domain});\nexport const H_EARTH_BAKED_MATERIAL_SOURCE_DESCRIPTOR_SHA256 = '${field.sourceDescriptorDigest}';\nexport const H_EARTH_BAKED_MATERIAL_SOURCE_SEGMENTATION_SHA256 = '${field.sourceSegmentationDigest}';\nconst assetUrl = new URL('./terrain-material-field.round2-baked.v1.rgba', import.meta.url);\nlet cachedPromise = null;\nconst digestHex = async (buffer) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))].map((value) => value.toString(16).padStart(2, '0')).join('');\nexport async function loadHEarthRound2BakedMaterialField() {\n  if (cachedPromise === null) cachedPromise = (async () => {\n    const response = await fetch(assetUrl);\n    if (!response.ok) throw new Error(\`H_EARTH_BAKED_MATERIAL_FETCH_FAILED:\${response.status}\`);\n    const buffer = await response.arrayBuffer();\n    if (buffer.byteLength !== H_EARTH_BAKED_MATERIAL_FIELD_BYTE_LENGTH) throw new Error(\`H_EARTH_BAKED_MATERIAL_BYTE_LENGTH_INVALID:\${buffer.byteLength}\`);\n    const digest = await digestHex(buffer);\n    if (digest !== H_EARTH_BAKED_MATERIAL_FIELD_SHA256) throw new Error(\`H_EARTH_BAKED_MATERIAL_DIGEST_INVALID:\${digest}\`);\n    return new Uint8Array(buffer);\n  })();\n  return new Uint8Array(await cachedPromise);\n}\nexport function getHEarthRound2BakedMaterialFieldReceipt() {\n  return Object.freeze({ fieldId: H_EARTH_BAKED_MATERIAL_FIELD_ID, width: H_EARTH_BAKED_MATERIAL_FIELD_WIDTH, height: H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT, byteLength: H_EARTH_BAKED_MATERIAL_FIELD_BYTE_LENGTH, canonicalSha256: H_EARTH_BAKED_MATERIAL_FIELD_SHA256, domain: H_EARTH_BAKED_MATERIAL_FIELD_DOMAIN, sourceDescriptorSha256: H_EARTH_BAKED_MATERIAL_SOURCE_DESCRIPTOR_SHA256, sourceSegmentationSha256: H_EARTH_BAKED_MATERIAL_SOURCE_SEGMENTATION_SHA256, mipmapsRequired: true, uniqueWorldCoverage: true, runtimeTextureSamplesPerTerrainFragment: 1 });\n}\nexport default loadHEarthRound2BakedMaterialField;\n`;
}

export function writeHEarthBM3UniqueMaterialField() {
  const field = generateHEarthBM3UniqueMaterialField();
  fs.mkdirSync(path.dirname(RAW_PATH), { recursive: true });
  fs.writeFileSync(RAW_PATH, field.bytes);
  fs.writeFileSync(METADATA_PATH, metadataSource(field));
  return field;
}

if (process.argv.includes('--write')) {
  const field = writeHEarthBM3UniqueMaterialField();
  console.log(JSON.stringify({
    result: 'BM3_BAKE_WRITTEN',
    width: field.width,
    height: field.height,
    byteLength: field.byteLength,
    canonicalSha256: field.canonicalSha256,
    sourceDescriptorDigest: field.sourceDescriptorDigest,
    sourceSegmentationDigest: field.sourceSegmentationDigest,
    rawPath: path.relative(ROOT, RAW_PATH),
    metadataPath: path.relative(ROOT, METADATA_PATH)
  }, null, 2));
}

export default generateHEarthBM3UniqueMaterialField;
