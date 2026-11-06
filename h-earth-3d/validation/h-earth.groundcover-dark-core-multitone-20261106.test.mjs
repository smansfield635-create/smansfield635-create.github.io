import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rendererPath = fileURLToPath(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js', import.meta.url));
const renderer = readFileSync(rendererPath, 'utf8');
const begin = renderer.indexOf('// H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN');
const end = renderer.indexOf('// H_EARTH_BROAD_GROUNDCOVER_V1_END', begin);
const block = begin >= 0 && end > begin ? renderer.slice(begin, end) : '';

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function mix3(a, b, t) { return a.map((v, i) => v * (1 - t) + b[i] * t); }
function luminance(rgb) { return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722; }
function oldTone(moisture, dryness) {
  return mix3(mix3([0.110, 0.118, 0.075], [0.075, 0.090, 0.055], moisture),
    [0.175, 0.150, 0.095], dryness);
}
function composition(soil, tone, signal, moisture, suitability = 1, protection = 1) {
  const patch = smoothstep(0.20, 0.66, signal);
  const continuity = smoothstep(0.30, 0.85, patch);
  const originalWeight = 0.88 * patch * (1 - 0.25 * continuity) * suitability * protection;
  const t = smoothstep(0.03, 0.66, signal);
  const outside = 1 - t;
  const shoulder = 0.55 * t * (1 - patch) ** 2 * suitability * protection;
  const combinedWeight = originalWeight + (1 - originalWeight) * shoulder;
  const earth = mix3(soil, tone, 0.22);
  const moss = mix3(soil, tone, 0.68).map((c, i) =>
    c + [-0.004, 0.005, -0.004][i] * moisture);
  const curve = soil.map((c, i) =>
    outside ** 3 * c + 3 * outside ** 2 * t * earth[i] +
    3 * outside * t ** 2 * moss[i] + t ** 3 * tone[i]);
  return {
    original: mix3(soil, tone, originalWeight),
    candidate: mix3(soil, curve, combinedWeight),
    combinedWeight
  };
}
const soils = [
  [0.390, 0.248, 0.148], [0.520, 0.440, 0.270],
  [0.300, 0.235, 0.155], [0.235, 0.188, 0.130],
  [0.480, 0.315, 0.140], [0.355, 0.333, 0.305]
];
const moistures = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
const drynesses = [0, 0.15, 0.35, 0.65];
function approxVec(a, b, label) {
  for (let i = 0; i < 3; i++) assert.ok(
    Math.abs(a[i] - b[i]) <= 1e-12,
    label + ' component ' + i + ': ' + a[i] + ' vs ' + b[i]
  );
}

test('bounded source: same organic field and original core, one continuous tonal curve', () => {
  assert.ok(block, 'original groundcover block found');
  for (const x of [
    'float groundcoverPatch=smoothstep(',
    'float groundcoverWeight=0.88*groundcoverPatch*',
    'groundcoverSuitability*groundcoverProtection;',
    'groundcoverTone*=0.88+0.24*materialVariation;',
    'vec3 groundcoverNativeSoil=palette;',
    '0.03,0.66,groundcoverOrganic*0.78+mesoField*0.22',
    'float groundcoverShoulder=0.55*groundcoverTransition*',
    'vec3 groundcoverEarthOlive=mix(',
    'vec3 groundcoverMossOlive=mix(',
    'vec3 groundcoverTonalCurve=',
    'groundcoverCompositeWeight'
  ]) assert.ok(block.includes(x), 'missing expected source: ' + x);
  assert.equal(block.includes('palette=mix(palette,groundcoverTone,groundcoverWeight);'), false);
  assert.equal((block.match(/vec3 groundcoverNativeSoil=palette;/g) || []).length, 1);
  assert.equal((block.match(/palette=mix\(/g) || []).length, 1);
});

test('outer native soil and inner original dark-core composite are exact', () => {
  for (const soil of soils) for (const moisture of moistures) for (const dryness of drynesses) {
    const tone = oldTone(moisture, dryness);
    approxVec(composition(soil, tone, 0, moisture).candidate, soil, 'outside');
    approxVec(composition(soil, tone, 0.03, moisture).candidate, soil, 'outer threshold');
    for (const s of [0.66, 0.78, 1]) {
      const x = composition(soil, tone, s, moisture);
      approxVec(x.candidate, x.original, 'dark core at ' + s);
    }
  }
});

test('144 sampled soil/moisture/dryness profiles have no luminance reversals', () => {
  let combinations = 0;
  let maxStep = 0;
  for (const soil of soils) for (const moisture of moistures) for (const dryness of drynesses) {
    const tone = oldTone(moisture, dryness);
    let previous = null;
    for (let i = 0; i <= 500; i++) {
      const rgb = composition(soil, tone, i / 500, moisture).candidate;
      const l = luminance(rgb);
      assert.ok(Number.isFinite(l), 'nonfinite luminance');
      if (previous !== null) {
        assert.ok(l - previous <= 1e-12, 'luminance reversal at signal=' + i / 500);
        maxStep = Math.max(maxStep, Math.abs(l - previous));
      }
      previous = l;
    }
    combinations++;
  }
  assert.equal(combinations, 144);
  assert.ok(maxStep < 0.002, 'step too large: ' + maxStep);
});

test('zero suitability and zero protection leave native soil unchanged', () => {
  for (const soil of soils) for (const signal of [0, 0.05, 0.2, 0.4, 0.66, 1]) {
    const tone = oldTone(0.5, 0.2);
    approxVec(composition(soil, tone, signal, 0.5, 0, 1).candidate, soil, 'zero suitability');
    approxVec(composition(soil, tone, signal, 0.5, 1, 0).candidate, soil, 'zero protection');
  }
});
