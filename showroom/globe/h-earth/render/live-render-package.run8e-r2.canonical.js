/** H_EARTH_RUN_8E_R2_CANONICAL_LIVE_RENDER_PACKAGE_v1 */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage as getRawPackage,
  getHEarthOW01LiveRenderPackageOccurrence as getOW01RawPackage,
  evaluateHEarthRun8ER2ImmutableLiveRenderPackage,
  getHEarthRun8ER2VegetationWorldTruthPlan,
  isHEarthRun8ER2VegetationWorldTruthPrepared,
  createHEarthRun8ER2VegetationPresentationBatch
} from './live-render-package.run8e-r2.js?cb=b42bdb4ab1b0af92';

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
    sourceAuthorities: freezeRecord({
      ...raw.sourceAuthorities,
      numericIdentityBoundary: 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY',
      numericCanonicalizationLaw: 'ROUND_TO_BINARY_GRID_2^-24_AND_NORMALIZE_NEGATIVE_ZERO',
      canonicalizedFloatBuffers: FLOAT_BUFFER_NAMES
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

let cachedPackage = null;
let cachedDeferredPackage = null;
let cachedOW01Package = null;

export function getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation=false}={}) {
  if(deferVegetation)return cachedDeferredPackage??=buildCanonicalPackage(getRawPackage({deferVegetation:true}));
  if (!cachedPackage) cachedPackage = buildCanonicalPackage();
  return cachedPackage;
}

export function getHEarthOW01CanonicalLiveRenderPackageOccurrence() {
  if (!cachedOW01Package) cachedOW01Package = buildCanonicalPackage(getOW01RawPackage());
  return cachedOW01Package;
}

export function getHEarthRun8ER2CanonicalVegetationPresentationPlan({deferVegetation=false}={}){if(deferVegetation&&!isHEarthRun8ER2VegetationWorldTruthPrepared())return freezeRecord({eligible:false,status:'PENDING_POST_READY_VALIDATION',instanceCount:null,batches:[],populationLimit:null,droppedPlacementCount:null});const truth=getHEarthRun8ER2VegetationWorldTruthPlan();return freezeRecord({...truth,batches:Object.freeze(truth.batches.map(batch=>freezeRecord({...batch}))),numericIdentityBoundary:'CANONICAL_PLACEMENT_TRUTH_WITH_BOUNDED_PRESENTATION_BATCHES'});}
export function createHEarthRun8ER2CanonicalVegetationPresentationBatch(batchId){const batch=createHEarthRun8ER2VegetationPresentationBatch(batchId);return freezeRecord({...batch,placementIds:Object.freeze(Array.from(batch.placementIds??[])),primitives:Object.freeze(Array.from(batch.primitives??[]))});}
export default getHEarthRun8ER2CanonicalLiveRenderPackage;
