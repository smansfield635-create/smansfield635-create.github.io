/** H_EARTH_C2_R1_COMPLETE_WORLD_RENDER_PACKAGE_v4 */

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const now = () => globalThis.performance?.now?.() ?? Date.now();
const yieldDefault = () => new Promise(resolve => setTimeout(resolve, 0));
const clone = value => typeof structuredClone === 'function'
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value));
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach(nested => freeze(nested, seen));
  return Object.freeze(value);
};
const keyOf = (x, z) => `${Object.is(x, -0) ? '-0' : x}|${Object.is(z, -0) ? '-0' : z}`;
const get3 = (buffer, index) => buffer.slice(index * 3, index * 3 + 3);
const get4 = (buffer, index) => buffer.slice(index * 4, index * 4 + 4);
const set4 = (buffer, index, values) => {
  const offset = index * 4;
  for (let channel = 0; channel < 4; channel += 1) buffer[offset + channel] = Number(values[channel]);
};
const arraysEqual = (left, right) => Array.isArray(left) && Array.isArray(right) &&
  left.length === right.length && left.every((value, index) => Object.is(value, right[index]));

export const H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID =
  'H_EARTH_C2_R1_COMPLETE_WORLD_RENDER_PACKAGE_v4';
export const H_EARTH_C2_R1_EXACT_BINDING_CACHE_SCHEMA =
  'H_EARTH_C2_R1_COMPLETE_WORLD_EXACT_BINDING_CACHE_v2';

export const H_EARTH_C2_R1_COMPLETE_WORLD_BINDING = freeze({
  contractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
  cacheSchema: H_EARTH_C2_R1_EXACT_BINDING_CACHE_SCHEMA,
  operationId: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_RECOVERY_001',
  startingHead: '4f0491f00fae794ecdefbae36f4ee86c8a1bd21a',
  objectId: 'H_EARTH:C2_R1:COASTAL_SUCCESSOR',
  executionHistoryId: 'H_EARTH:C2_R1:PR_418:HISTORY_001',
  activeEdgeId: 'H_EARTH:C2_R1:COASTAL_COMPONENT_TO_COMPLETE_WORLD_CANDIDATE',
  priorCompleteWorldPackageIdentity: 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_218F37AE',
  priorCompleteWorldPackageContentDigest: 'fnv1a32:218f37ae',
  shorelineAdmissionLaw: 'SIGNED_INLAND_DISTANCE_LESS_THAN_OR_EQUAL_TO_ZERO_ONLY',
  corridor: { alongshoreAnchorMinimum: -184, alongshoreAnchorMaximum: 184 },
  roleCodes: { TERRAIN: 1, SHORELINE: 2, VEGETATION: 3 },
  startup: { browserBudgetMilliseconds: 105000, browserYieldEveryVertices: 128 },
  ownership: {
    ownsDerivedMaterialBinding: true,
    ownsCanonicalWorldGeometry: false,
    ownsClosedCoastalSources: false,
    ownsCameraNavigationTraversalOrTouch: false,
    ownsPublicRendererLifecycle: false,
    ownsPublicRouteOrMain: false
  }
});

function cloneBuffers(source) {
  return Object.fromEntries(Object.entries(source).map(([name, values]) => [name, Array.from(values)]));
}
function freezeBuffers(buffers) {
  Object.values(buffers).forEach(Object.freeze);
  return Object.freeze(buffers);
}
function validateCanonical(packageRecord) {
  const issues = [];
  if (packageRecord?.eligible !== true) issues.push('CANONICAL_PACKAGE_NOT_ELIGIBLE');
  const buffers = packageRecord?.buffers;
  const vertexCount = buffers?.roleCodes?.length ?? 0;
  const lengths = {
    positions: vertexCount * 3, normals: vertexCount * 3,
    baseColorsLinear: vertexCount * 4, materialParameters: vertexCount * 4,
    materialModelCodes: vertexCount, surfaceClassCodes: vertexCount,
    primitiveIndices: vertexCount, roleCodes: vertexCount
  };
  for (const [name, length] of Object.entries(lengths)) {
    if (!Array.isArray(buffers?.[name]) || buffers[name].length !== length) issues.push(`CANONICAL_BUFFER_LENGTH_INVALID:${name}`);
  }
  if (!Array.isArray(buffers?.indices) || buffers.indices.some(index =>
    !Number.isSafeInteger(index) || index < 0 || index >= vertexCount)) issues.push('CANONICAL_INDEX_BUFFER_INVALID');
  return { eligible: issues.length === 0, issues, vertexCount };
}
function reject(code, issues, counters = {}) {
  return freeze({
    eligible: false,
    status: 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_REJECTED',
    contractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
    rootRejectionCode: code,
    issues: [...issues],
    counters: { ...counters },
    failureDiagnostics: []
  });
}
async function canonicalFrom(options) {
  if (options.canonicalPackage) return options.canonicalPackage;
  const module = await import('/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js');
  return module.getHEarthRun8ER2CanonicalLiveRenderPackage();
}

async function hashBuffers(buffers, { yieldEveryValues = 0, yieldControl = yieldDefault, onYield = null } = {}) {
  let hash = 0x811c9dc5;
  let visited = 0;
  const storage = new ArrayBuffer(8);
  const view = new DataView(storage);
  const byte = value => {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  };
  for (const name of ['positions','normals','baseColorsLinear','materialParameters','materialModelCodes','surfaceClassCodes','primitiveIndices','roleCodes','indices']) {
    for (const value of buffers[name]) {
      view.setFloat64(0, Number(value), true);
      for (let index = 0; index < 8; index += 1) byte(view.getUint8(index));
      visited += 1;
      if (yieldEveryValues > 0 && visited % yieldEveryValues === 0) {
        await yieldControl();
        onYield?.();
      }
    }
    byte(0xff);
  }
  return hash.toString(16).padStart(8, '0');
}

function decodeBytes(base64) {
  if (typeof Buffer !== 'undefined') return Uint8Array.from(Buffer.from(base64, 'base64'));
  const binary = atob(base64);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}
function decodeFloat64(base64) {
  const bytes = decodeBytes(base64);
  if (bytes.byteLength % 8 !== 0) throw new Error('EXACT_BINDING_CACHE_FLOAT64_BYTE_LENGTH_INVALID');
  return new Float64Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}
let cacheMemo = null;
let cacheMemoSource = null;
async function decodeCache(base64) {
  if (cacheMemo && cacheMemoSource === base64) return cacheMemo;
  if (typeof DecompressionStream !== 'function') throw new Error('EXACT_BINDING_CACHE_DECOMPRESSION_UNAVAILABLE');
  const stream = new Blob([decodeBytes(base64)]).stream().pipeThrough(new DecompressionStream('gzip'));
  cacheMemo = JSON.parse(await new Response(stream).text());
  cacheMemoSource = base64;
  return cacheMemo;
}
function decodeRecords(section, fields) {
  if (section?.recordWidth !== 8 || JSON.stringify(section.fields) !== JSON.stringify(fields)) {
    throw new Error('EXACT_BINDING_CACHE_SECTION_SCHEMA_MISMATCH');
  }
  const values = decodeFloat64(section.valuesBase64);
  if (values.length !== section.recordWidth * section.recordCount) throw new Error('EXACT_BINDING_CACHE_RECORD_COUNT_MISMATCH');
  const records = new Map();
  for (let offset = 0; offset < values.length; offset += 8) {
    const record = Array.from(values.subarray(offset, offset + 8));
    if (record.some(value => !finite(value))) throw new Error('EXACT_BINDING_CACHE_NONFINITE_VALUE');
    const key = keyOf(record[0], record[1]);
    if (records.has(key)) throw new Error(`EXACT_BINDING_CACHE_DUPLICATE_COORDINATE:${key}`);
    records.set(key, record);
  }
  return records;
}
function waterMaterial(material) {
  const response = material.preservedCandidateResponses;
  const foam = clamp(response.foamIntensity * response.foamOpacity, 0, 1);
  return {
    color: [0, 1, 2].map(index => clamp(
      response.waterSurfaceColorLinear[index] * (1 - foam) + response.foamColorLinear[index] * foam,
      0, 1
    )),
    alpha: clamp(response.waterSurfaceOpacity + foam * 0.18, 0.18, 0.92),
    wetness: clamp(response.temporaryWetness, 0, 1),
    foam
  };
}
function finish(canonicalPackage, buffers, digest, counters, changedVertexIndices, unchangedVertexIndices, binding) {
  freezeBuffers(buffers);
  const { buffers: ignored, ...metadata } = canonicalPackage;
  void ignored;
  return freeze({
    ...clone(metadata),
    eligible: true,
    status: 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_COMPLETE',
    contractId: canonicalPackage.contractId,
    completeWorldContractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
    parentPackageIdentity: canonicalPackage.packageIdentity,
    parentPackageContentDigest: canonicalPackage.contentDigest,
    packageIdentity: `H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_${digest.toUpperCase()}`,
    contentDigest: `fnv1a32:${digest}`,
    revision: Number(canonicalPackage.revision ?? 0) + 1,
    buffers,
    completeWorldBinding: {
      ...H_EARTH_C2_R1_COMPLETE_WORLD_BINDING,
      counters,
      changedVertexIndices: Object.freeze(changedVertexIndices),
      unchangedVertexIndices: Object.freeze(unchangedVertexIndices),
      canonicalPackageReadOnly: true,
      canonicalPositionsPreserved: true,
      canonicalNormalsPreserved: true,
      closedCoastalSourcesReadOnly: true,
      primitiveIdentitiesPreserved: true,
      primitiveSpansPreserved: true,
      indicesPreserved: true,
      drawRangesPreserved: true,
      acceptedPlacementsPreserved: true,
      noncoastalBytesPreserved: true,
      cameraNavigationTraversalTouchPreserved: true,
      publicRendererLifecyclePreserved: true,
      publicRoutePreserved: true,
      mainPreserved: true,
      materialOnlyBinding: true,
      ...binding
    }
  });
}

async function buildFromCache(canonicalPackage, validation, options, startedAt) {
  let cache;
  try {
    cache = await decodeCache(options.exactBindingCacheBase64);
  } catch (error) {
    return reject('EXACT_BINDING_CACHE_DECODE_FAILED', [error?.message ?? String(error)], { vertexCount: validation.vertexCount });
  }
  const issues = [];
  if (cache?.cacheType !== H_EARTH_C2_R1_EXACT_BINDING_CACHE_SCHEMA) issues.push('EXACT_BINDING_CACHE_TYPE_MISMATCH');
  if (cache?.canonicalPackageIdentity !== canonicalPackage.packageIdentity) issues.push('EXACT_BINDING_CACHE_PARENT_IDENTITY_MISMATCH');
  if (cache?.canonicalPackageContentDigest !== canonicalPackage.contentDigest) issues.push('EXACT_BINDING_CACHE_PARENT_DIGEST_MISMATCH');
  if (cache?.completeWorldContractId !== H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID) issues.push('EXACT_BINDING_CACHE_CONTRACT_MISMATCH');
  if (cache?.priorCompleteWorldPackageIdentity !== H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.priorCompleteWorldPackageIdentity) issues.push('EXACT_BINDING_CACHE_PRIOR_IDENTITY_MISSING');
  if (cache?.completeWorldPackageIdentity === cache?.priorCompleteWorldPackageIdentity) issues.push('EXACT_BINDING_CACHE_OLD_PACKAGE_IDENTITY_REUSED');
  if (cache?.membership?.shorelineAdmissionLaw !== H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.shorelineAdmissionLaw) issues.push('EXACT_BINDING_CACHE_SHORELINE_ADMISSION_LAW_MISMATCH');
  if (cache?.membership?.inlandWaterMembershipViolationCount !== 0) issues.push('EXACT_BINDING_CACHE_INLAND_WATER_MEMBERSHIP_VIOLATION');
  if (issues.length) return reject('EXACT_BINDING_CACHE_IDENTITY_REJECTED', issues, { vertexCount: validation.vertexCount });

  let terrainRecords;
  let shorelineRecords;
  try {
    terrainRecords = decodeRecords(cache.terrain, ['worldX','worldZ','colorR','colorG','colorB','roughness','wetness','cavity']);
    shorelineRecords = decodeRecords(cache.shoreline, ['worldX','worldZ','colorR','colorG','colorB','alpha','wetness','foam']);
  } catch (error) {
    return reject('EXACT_BINDING_CACHE_RECORDS_REJECTED', [error?.message ?? String(error)], { vertexCount: validation.vertexCount });
  }

  const source = canonicalPackage.buffers;
  const buffers = cloneBuffers(source);
  const changed = [];
  const unchanged = [];
  const counters = {
    ...cache.counters,
    boundTerrainVertexCount: 0,
    boundShorelineVertexCount: 0,
    terrainPositionMutationCount: 0,
    terrainNormalMutationCount: 0,
    shorelinePositionMutationCount: 0,
    shorelineNormalMutationCount: 0,
    inlandWaterMembershipViolationCount: 0,
    constructionYieldCount: 0,
    constructionMilliseconds: 0,
    exactBindingCacheTerrainRecordCount: cache.terrain.recordCount,
    exactBindingCacheShorelineRecordCount: cache.shoreline.recordCount
  };
  const every = Number.isSafeInteger(options.yieldEveryVertices) && options.yieldEveryVertices > 0 ? options.yieldEveryVertices : 0;
  const yieldControl = options.yieldControl ?? yieldDefault;

  for (let index = 0; index < validation.vertexCount; index += 1) {
    const role = source.roleCodes[index];
    const [worldX, , worldZ] = get3(source.positions, index);
    const key = keyOf(worldX, worldZ);
    let mutated = false;
    if (role === 1 && terrainRecords.has(key)) {
      const record = terrainRecords.get(key);
      const priorColor = get4(source.baseColorsLinear, index);
      const priorParameters = get4(source.materialParameters, index);
      set4(buffers.baseColorsLinear, index, [record[2], record[3], record[4], priorColor[3]]);
      set4(buffers.materialParameters, index, [record[5], priorParameters[1], record[6], record[7]]);
      counters.boundTerrainVertexCount += 1;
      mutated = true;
    } else if (role === 2 && shorelineRecords.has(key)) {
      const record = shorelineRecords.get(key);
      const priorParameters = get4(source.materialParameters, index);
      set4(buffers.baseColorsLinear, index, record.slice(2, 6));
      set4(buffers.materialParameters, index, [priorParameters[0], priorParameters[1], record[6], record[7]]);
      counters.boundShorelineVertexCount += 1;
      mutated = true;
    }
    (mutated ? changed : unchanged).push(index);
    if (every > 0 && (index + 1) % every === 0) {
      counters.constructionYieldCount += 1;
      options.onProgress?.(freeze({ phase: 'EXACT_BINDING_CACHE_APPLICATION', processedVertexCount: index + 1, vertexCount: validation.vertexCount, progressRatio: (index + 1) / validation.vertexCount, counters: { ...counters } }));
      await yieldControl();
    }
  }

  if (counters.boundTerrainVertexCount !== cache.counters.boundTerrainVertexCount) return reject('EXACT_BINDING_CACHE_TERRAIN_COUNT_MISMATCH', [], counters);
  if (counters.boundShorelineVertexCount !== cache.counters.boundShorelineVertexCount) return reject('EXACT_BINDING_CACHE_SHORELINE_COUNT_MISMATCH', [], counters);
  if (!arraysEqual(buffers.positions, source.positions)) counters.terrainPositionMutationCount = 1;
  if (!arraysEqual(buffers.normals, source.normals)) counters.terrainNormalMutationCount = 1;
  if (counters.terrainPositionMutationCount || counters.terrainNormalMutationCount) return reject('MATERIAL_ONLY_CANONICAL_GEOMETRY_MUTATION', [], counters);

  options.onProgress?.(freeze({ phase: 'COMPLETE_WORLD_DIGEST', processedVertexCount: validation.vertexCount, vertexCount: validation.vertexCount, progressRatio: 1, counters: { ...counters } }));
  const digest = await hashBuffers(buffers, {
    yieldEveryValues: every > 0 ? 65536 : 0,
    yieldControl,
    onYield: () => { counters.constructionYieldCount += 1; }
  });
  const identity = `H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_${digest.toUpperCase()}`;
  const contentDigest = `fnv1a32:${digest}`;
  if (identity !== cache.completeWorldPackageIdentity || contentDigest !== cache.completeWorldPackageContentDigest) {
    return reject('EXACT_BINDING_CACHE_RESULT_DIGEST_MISMATCH', [`EXPECTED:${cache.completeWorldPackageContentDigest}`, `ACTUAL:${contentDigest}`], counters);
  }
  if (identity === H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.priorCompleteWorldPackageIdentity) return reject('OLD_COMPLETE_WORLD_PACKAGE_IDENTITY_REUSED', [identity], counters);

  counters.constructionMilliseconds = Number((now() - startedAt).toFixed(3));
  const budget = finite(options.startupBudgetMilliseconds) && options.startupBudgetMilliseconds > 0 ? options.startupBudgetMilliseconds : null;
  if (budget !== null && counters.constructionMilliseconds > budget) return reject('COMPLETE_WORLD_PACKAGE_CONSTRUCTION_BUDGET_EXCEEDED', [`STARTUP_BUDGET_MILLISECONDS:${budget}`], counters);

  return finish(canonicalPackage, buffers, digest, counters, changed, unchanged, {
    boundaryExclusionDiagnostics: cache.boundaryExclusionDiagnostics ?? [],
    failureDiagnostics: [],
    exactBindingCacheActive: true,
    exactBindingCacheSchema: cache.cacheType,
    exactBindingCacheSourceHead: cache.sourceHead,
    exactBindingCacheArtifactDigest: options.exactBindingCacheArtifactDigest ?? null,
    oldPackageIdentityReused: false,
    inlandWaterMembershipViolationCount: 0,
    boundedBrowserYieldingActive: every > 0,
    startupBudgetMilliseconds: budget
  });
}

function corridorSample(terrain) {
  const anchorX = terrain?.coastalFrame?.anchorX;
  return terrain?.valid === true && finite(terrain.candidateWeight) && terrain.candidateWeight > 0 &&
    finite(anchorX) && anchorX >= -184 && anchorX <= 184;
}

async function buildFromSamplers(canonicalPackage, validation, options, startedAt) {
  if (typeof options.sampleCoastalTerrain !== 'function' || typeof options.sampleCandidateMaterial !== 'function') {
    return reject('EXPLICIT_SAMPLERS_MISSING', ['sampleCoastalTerrain','sampleCandidateMaterial'], { vertexCount: validation.vertexCount });
  }
  const source = canonicalPackage.buffers;
  const buffers = cloneBuffers(source);
  const changed = [];
  const unchanged = [];
  const terrainCache = new Map();
  const materialCache = new Map();
  const counters = {
    vertexCount: validation.vertexCount,
    terrainVertexCount: 0,
    shorelineVertexCount: 0,
    vegetationVertexCount: 0,
    boundTerrainVertexCount: 0,
    boundShorelineVertexCount: 0,
    adapterBoundaryExcludedVertexCount: 0,
    unchangedVertexCount: 0,
    candidateSampleFailureCount: 0,
    terrainSampleInvocationCount: 0,
    terrainSampleCacheHitCount: 0,
    candidateMaterialSampleInvocationCount: 0,
    candidateMaterialSampleCacheHitCount: 0,
    positiveInlandDistanceShorelineVertexCount: 0,
    inlandWaterMembershipViolationCount: 0,
    terrainPositionMutationCount: 0,
    terrainNormalMutationCount: 0,
    constructionYieldCount: 0,
    constructionMilliseconds: 0
  };
  const every = Number.isSafeInteger(options.yieldEveryVertices) && options.yieldEveryVertices > 0 ? options.yieldEveryVertices : 0;
  const yieldControl = options.yieldControl ?? yieldDefault;

  for (let index = 0; index < validation.vertexCount; index += 1) {
    const role = source.roleCodes[index];
    if (role === 1) counters.terrainVertexCount += 1;
    else if (role === 2) counters.shorelineVertexCount += 1;
    else if (role === 3) counters.vegetationVertexCount += 1;
    if (role !== 1 && role !== 2) {
      counters.unchangedVertexCount += 1;
      unchanged.push(index);
    } else {
      const [worldX, , worldZ] = get3(source.positions, index);
      const key = keyOf(worldX, worldZ);
      let terrain = terrainCache.get(key);
      if (terrain) counters.terrainSampleCacheHitCount += 1;
      else {
        terrain = options.sampleCoastalTerrain(worldX, worldZ);
        terrainCache.set(key, terrain);
        counters.terrainSampleInvocationCount += 1;
      }
      const inland = terrain?.coastalFrame?.signedInlandDistance;
      if (!corridorSample(terrain) || (role === 2 && (!finite(inland) || inland > 0))) {
        if (role === 2 && finite(inland) && inland > 0) counters.positiveInlandDistanceShorelineVertexCount += 1;
        counters.unchangedVertexCount += 1;
        unchanged.push(index);
      } else {
        let material = materialCache.get(key);
        if (material) counters.candidateMaterialSampleCacheHitCount += 1;
        else {
          material = options.sampleCandidateMaterial(worldX, worldZ, { timeSeconds: Number(options.timeSeconds ?? 0) });
          materialCache.set(key, material);
          counters.candidateMaterialSampleInvocationCount += 1;
        }
        if (material?.valid !== true) return reject('EXPLICIT_CANDIDATE_SAMPLE_REJECTION', ['EXPLICIT_CANDIDATE_SAMPLE_REJECTION'], { ...counters, candidateSampleFailureCount: 1 });
        if (role === 1) {
          const color = get4(source.baseColorsLinear, index);
          const parameters = get4(source.materialParameters, index);
          set4(buffers.baseColorsLinear, index, [...material.material.colorLinear, color[3]]);
          set4(buffers.materialParameters, index, [material.material.roughness, parameters[1], clamp(material.preservedCandidateResponses.temporaryWetness, 0, 1), material.material.cavityOrAmbientOcclusion]);
          counters.boundTerrainVertexCount += 1;
        } else {
          const water = waterMaterial(material);
          const parameters = get4(source.materialParameters, index);
          set4(buffers.baseColorsLinear, index, [...water.color, water.alpha]);
          set4(buffers.materialParameters, index, [parameters[0], parameters[1], water.wetness, water.foam]);
          counters.boundShorelineVertexCount += 1;
        }
        changed.push(index);
      }
    }
    if (every > 0 && (index + 1) % every === 0) {
      counters.constructionYieldCount += 1;
      await yieldControl();
    }
  }

  if (!counters.boundTerrainVertexCount || !counters.boundShorelineVertexCount) return reject('EXPLICIT_COMPLETE_WORLD_BINDING_ABSENT', ['EXPLICIT_COMPLETE_WORLD_BINDING_ABSENT'], counters);
  if (!arraysEqual(buffers.positions, source.positions)) counters.terrainPositionMutationCount = 1;
  if (!arraysEqual(buffers.normals, source.normals)) counters.terrainNormalMutationCount = 1;
  if (counters.terrainPositionMutationCount || counters.terrainNormalMutationCount) return reject('MATERIAL_ONLY_CANONICAL_GEOMETRY_MUTATION', [], counters);
  const digest = await hashBuffers(buffers);
  counters.constructionMilliseconds = Number((now() - startedAt).toFixed(3));
  return finish(canonicalPackage, buffers, digest, counters, changed, unchanged, {
    boundaryExclusionDiagnostics: [], failureDiagnostics: [], exactBindingCacheActive: false,
    explicitSyntheticSamplerPath: true, oldPackageIdentityReused: false,
    inlandWaterMembershipViolationCount: 0, boundedBrowserYieldingActive: every > 0,
    startupBudgetMilliseconds: options.startupBudgetMilliseconds ?? null
  });
}

export async function buildHEarthC2R1CompleteWorldRenderPackage(options = {}) {
  const startedAt = now();
  const canonicalPackage = await canonicalFrom(options);
  const validation = validateCanonical(canonicalPackage);
  if (!validation.eligible) return reject('CANONICAL_PACKAGE_REJECTED', validation.issues, { vertexCount: validation.vertexCount });
  if (typeof options.exactBindingCacheBase64 === 'string' && options.exactBindingCacheBase64.length > 0) {
    return buildFromCache(canonicalPackage, validation, options, startedAt);
  }
  return buildFromSamplers(canonicalPackage, validation, options, startedAt);
}

export function evaluateHEarthC2R1CompleteWorldRenderPackage(result, canonicalPackage) {
  if (result?.eligible !== true) return freeze({
    eligible: false,
    status: 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_ROOT_REJECTION',
    rootRejected: true,
    rootRejectionCode: result?.rootRejectionCode ?? 'COMPLETE_WORLD_PACKAGE_NOT_ELIGIBLE',
    issues: [...(result?.issues ?? ['COMPLETE_WORLD_PACKAGE_NOT_ELIGIBLE'])],
    counters: result?.counters ?? null,
    failureDiagnostics: result?.failureDiagnostics ?? []
  });
  const issues = [];
  const binding = result.completeWorldBinding;
  if (result.completeWorldContractId !== H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID) issues.push('COMPLETE_WORLD_CONTRACT_ID_MISMATCH');
  if (binding?.counters?.candidateSampleFailureCount !== 0) issues.push('CANDIDATE_SAMPLE_FAILURE_COUNT_NOT_ZERO');
  if (!(binding?.counters?.boundTerrainVertexCount > 0)) issues.push('COMPLETE_WORLD_TERRAIN_BINDING_ABSENT');
  if (!(binding?.counters?.boundShorelineVertexCount > 0)) issues.push('COMPLETE_WORLD_SHORELINE_BINDING_ABSENT');
  if (binding?.counters?.terrainPositionMutationCount !== 0) issues.push('TERRAIN_POSITION_MUTATION_COUNT_NOT_ZERO');
  if (binding?.counters?.terrainNormalMutationCount !== 0) issues.push('TERRAIN_NORMAL_MUTATION_COUNT_NOT_ZERO');
  if (binding?.counters?.inlandWaterMembershipViolationCount !== 0) issues.push('INLAND_WATER_MEMBERSHIP_VIOLATION_COUNT_NOT_ZERO');
  if (!arraysEqual(result.buffers?.positions, canonicalPackage?.buffers?.positions)) issues.push('COMPLETE_WORLD_POSITION_BUFFER_CHANGED');
  if (!arraysEqual(result.buffers?.normals, canonicalPackage?.buffers?.normals)) issues.push('COMPLETE_WORLD_NORMAL_BUFFER_CHANGED');
  if (!arraysEqual(result.buffers?.indices, canonicalPackage?.buffers?.indices)) issues.push('COMPLETE_WORLD_INDEX_BUFFER_CHANGED');
  for (const name of ['primitiveIds','primitiveSpans','drawRanges']) {
    if (JSON.stringify(result[name]) !== JSON.stringify(canonicalPackage?.[name])) issues.push(`COMPLETE_WORLD_IDENTITY_CHANGED:${name}`);
  }
  if (result.packageIdentity === H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.priorCompleteWorldPackageIdentity) issues.push('OLD_COMPLETE_WORLD_PACKAGE_IDENTITY_REUSED');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_PASS' : 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_FAIL',
    rootRejected: false,
    issues
  });
}

export default buildHEarthC2R1CompleteWorldRenderPackage;
