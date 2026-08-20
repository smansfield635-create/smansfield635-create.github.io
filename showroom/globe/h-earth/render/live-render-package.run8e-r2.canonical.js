/** H_EARTH_RUN_8E_R2_CANONICAL_LIVE_RENDER_PACKAGE_v2_RUNTIME_SKY */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage as getRawPackage,
  buildHEarthRun8ER2ImmutableLiveRenderPackage as buildRawPackage,
  H_EARTH_OW01_LIVE_RENDER_PACKAGE_OCCURRENCE_ID,
  evaluateHEarthRun8ER2ImmutableLiveRenderPackage
} from './live-render-package.run8e-r2.js';

const GRID_SCALE = 16777216;
const FLOAT_BUFFER_NAMES = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters'
]);
const HASH_BUFFER_ORDER = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters',
  'materialModelCodes',
  'surfaceClassCodes',
  'primitiveIndices',
  'roleCodes',
  'indices'
]);

const freezeArray = values => Object.freeze(Array.from(values));
const freezeRecord = value => Object.freeze(value);
const clamp01 = value => Math.min(1, Math.max(0, Number(value) || 0));
const mix = (a, b, t) => Number(a) + (Number(b) - Number(a)) * clamp01(t);

function canonicalNumber(value) {
  if (!Number.isFinite(value)) throw new TypeError('R2_CANONICAL_NONFINITE_NUMBER');
  const rounded = Math.round(value * GRID_SCALE) / GRID_SCALE;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function canonicalizeBuffers(buffers) {
  const output = {};
  for (const name of HASH_BUFFER_ORDER) {
    const values = buffers[name];
    output[name] = FLOAT_BUFFER_NAMES.includes(name)
      ? freezeArray(values.map(canonicalNumber))
      : freezeArray(values);
  }
  return freezeRecord(output);
}

function createHashWriter() {
  let hash = 0x811c9dc5;
  const numberBuffer = new ArrayBuffer(8);
  const numberView = new DataView(numberBuffer);
  const encoder = new TextEncoder();
  const byte = value => {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  };
  return {
    string(value) {
      for (const item of encoder.encode(String(value))) byte(item);
      byte(0xff);
    },
    number(value) {
      numberView.setFloat64(0, value, true);
      for (let index = 0; index < 8; index += 1) byte(numberView.getUint8(index));
    },
    numbers(values) {
      for (const value of values) this.number(value);
      byte(0xfe);
    },
    digest() {
      return hash.toString(16).padStart(8, '0');
    }
  };
}

function coherentEnvironmentDefaults(environment = {}) {
  const sourceHorizon = Array.isArray(environment.skyHorizonColor)
    ? environment.skyHorizonColor.slice(0, 3).map(Number)
    : [18, 42, 72];
  const sourceZenith = Array.isArray(environment.skyZenithColor)
    ? environment.skyZenithColor.slice(0, 3).map(Number)
    : [8, 24, 48];
  const sun = Array.isArray(environment.sunColor)
    ? environment.sunColor.slice(0, 3).map(Number)
    : [255, 220, 180];
  const scale = sourceHorizon.concat(sourceZenith, sun).some(value => value > 1) ? 255 : 1;
  const daylight = clamp01(Number(environment.sunIntensity ?? 0));
  const sunY = Math.abs(Number(environment?.sunDirection?.y ?? 1));
  const lowSun = clamp01(1 - sunY * 1.55) * Math.sqrt(daylight);
  const dayHorizon = [0.42, 0.66, 0.86];
  const dayZenith = [0.08, 0.30, 0.62];
  const nightHorizon = [0.035, 0.075, 0.14];
  const nightZenith = [0.012, 0.028, 0.075];
  const correlatedHorizon = [0, 1, 2].map(index => {
    const source = sourceHorizon[index] / scale;
    const solarBase = mix(nightHorizon[index], dayHorizon[index], daylight);
    const sourceBlend = mix(solarBase, source, 0.18);
    const warmed = mix(sourceBlend, sun[index] / scale, lowSun * 0.46);
    return canonicalNumber(clamp01(warmed) * scale);
  });
  const correlatedZenith = [0, 1, 2].map(index => {
    const source = sourceZenith[index] / scale;
    const solarBase = mix(nightZenith[index], dayZenith[index], daylight);
    const sourceBlend = mix(solarBase, source, 0.16);
    const warmed = mix(sourceBlend, sun[index] / scale, lowSun * 0.10);
    return canonicalNumber(clamp01(warmed) * scale);
  });
  return freezeRecord({
    ...environment,
    skyHorizonColor: freezeArray(correlatedHorizon),
    skyZenithColor: freezeArray(correlatedZenith),
    skyLightingCorrelation: freezeRecord({
      model: 'SAME_SOLAR_STATE_DAYLIGHT_AND_LOW_SUN_SKY_CORRELATION',
      daylight,
      lowSun,
      sourceSunIntensity: Number(environment.sunIntensity ?? 0),
      sourceSunDirectionY: Number(environment?.sunDirection?.y ?? 0),
      sourceAuthorityMutation: false
    })
  });
}

function buildCanonicalPackage(raw = getRawPackage()) {
  if (raw?.eligible !== true) return raw;

  const buffers = canonicalizeBuffers(raw.buffers);
  const hash = createHashWriter();
  hash.string(raw.sourceAuthorities.run8ER2ContractId);
  hash.string(raw.sourceAuthorities.packet002TransferContractId);
  hash.string(raw.sourceAuthorities.run8CMaterialContractId);
  hash.string(raw.sourceAuthorities.atmosphereContractId);
  for (const primitiveId of raw.primitiveIds) hash.string(primitiveId);
  for (const name of HASH_BUFFER_ORDER) hash.numbers(buffers[name]);

  const digest = hash.digest();
  const packageRecord = freezeRecord({
    ...raw,
    packageIdentity: `H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_${digest.toUpperCase()}`,
    contentDigest: `fnv1a32:${digest}`,
    revision: 2,
    buffers,
    environmentDefaults: coherentEnvironmentDefaults(raw.environmentDefaults),
    sourceAuthorities: freezeRecord({
      ...raw.sourceAuthorities,
      numericIdentityBoundary: 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY',
      numericCanonicalizationLaw: 'ROUND_TO_BINARY_GRID_2^-24_AND_NORMALIZE_NEGATIVE_ZERO',
      canonicalizedFloatBuffers: FLOAT_BUFFER_NAMES,
      atmosphereTimeBinding: raw.packageOccurrenceId === H_EARTH_OW01_LIVE_RENDER_PACKAGE_OCCURRENCE_ID
        ? 'BROWSER_LOCAL_CLOCK_AT_PACKAGE_CONSTRUCTION'
        : 'PACKAGE_DECLARED_TIME',
      skyLightingCorrelation: 'SAME_SOLAR_STATE_DAYLIGHT_AND_LOW_SUN_SKY_CORRELATION'
    })
  });

  const evaluation = evaluateHEarthRun8ER2ImmutableLiveRenderPackage(packageRecord);
  if (evaluation.eligible !== true) {
    return freezeRecord({
      eligible: false,
      status: 'RUN_8E_R2_CANONICAL_LIVE_RENDER_PACKAGE_REJECTED',
      contractId: raw.contractId,
      issues: evaluation.issues
    });
  }
  return packageRecord;
}

function browserLocalClockHours() {
  const value = new Date();
  return value.getHours() + value.getMinutes() / 60 + value.getSeconds() / 3600;
}

let cachedPackage = null;
let cachedOW01Package = null;

export function getHEarthRun8ER2CanonicalLiveRenderPackage() {
  if (!cachedPackage) cachedPackage = buildCanonicalPackage();
  return cachedPackage;
}

export function getHEarthOW01CanonicalLiveRenderPackageOccurrence() {
  if (!cachedOW01Package) {
    cachedOW01Package = buildCanonicalPackage(buildRawPackage({
      packageOccurrenceId: H_EARTH_OW01_LIVE_RENDER_PACKAGE_OCCURRENCE_ID,
      timeOfDayHours: browserLocalClockHours()
    }));
  }
  return cachedOW01Package;
}

export default getHEarthRun8ER2CanonicalLiveRenderPackage;
