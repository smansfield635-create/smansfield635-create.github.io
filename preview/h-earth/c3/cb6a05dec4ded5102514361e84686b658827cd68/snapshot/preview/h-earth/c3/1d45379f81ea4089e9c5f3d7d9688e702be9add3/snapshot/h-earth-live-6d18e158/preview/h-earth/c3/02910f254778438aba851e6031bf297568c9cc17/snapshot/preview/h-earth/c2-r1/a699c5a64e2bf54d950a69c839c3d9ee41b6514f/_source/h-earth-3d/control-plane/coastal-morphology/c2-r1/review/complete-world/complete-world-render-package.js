/**
 * H_EARTH_C2_R1_COMPLETE_WORLD_RENDER_PACKAGE_v4
 *
 * Isolated complete-world adapter. The canonical complete-world package and
 * closed C2-R1 coastal sources remain read-only. Browser construction consumes
 * an exact, digest-bound cache generated from the passing real-package sampler
 * execution; synthetic tests may supply explicit samplers directly.
 */

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const nowMilliseconds = () => globalThis.performance?.now?.() ?? Date.now();
const defaultYieldControl = () => new Promise(resolve => setTimeout(resolve, 0));
const copy = values => Array.from(values ?? []);
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const nested of value) if (nested !== null && typeof nested === 'object') freeze(nested, seen);
  } else {
    Object.values(value).forEach(nested => freeze(nested, seen));
  }
  return Object.freeze(value);
};
const freezeNumericArray = values => Object.freeze(values);
const coordinateKey = (worldX, worldZ) =>
  `${Object.is(worldX, -0) ? '-0' : worldX}|${Object.is(worldZ, -0) ? '-0' : worldZ}`;

export const H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID =
  'H_EARTH_C2_R1_COMPLETE_WORLD_RENDER_PACKAGE_v4';

export const H_EARTH_C2_R1_COMPLETE_WORLD_BINDING = freeze({
  contractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
  objectId: 'H_EARTH:C2_R1:COASTAL_SUCCESSOR',
  executionHistoryId: 'H_EARTH:C2_R1:PR_418:HISTORY_001',
  activeEdgeId: 'H_EARTH:C2_R1:COASTAL_COMPONENT_TO_COMPLETE_WORLD_CANDIDATE',
  operationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_INTEGRATION_001',
  correctiveOperationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_REAL_PACKAGE_ADAPTER_CORRECTION_001',
  performanceCorrectionId: 'H_EARTH_C2_R1_COMPLETE_WORLD_STARTUP_PERFORMANCE_CORRECTION_001',
  operationStartingHead: 'e03f211a472fd564b1ed4b8a00096c923a077528',
  acceptedBaselineHead: '4bc08c26548c36ab9fd96bdaead7434ca08cf8ac',
  acceptedCoastalComponentSourceHead: 'c53362c6f74b01c4e0b53be526b0e3a0b73edede',
  corridor: freeze({ alongshoreAnchorMinimum: -184, alongshoreAnchorMaximum: 184 }),
  roleCodes: freeze({ TERRAIN: 1, SHORELINE: 2, VEGETATION: 3 }),
  startup: freeze({ browserBudgetMilliseconds: 105000, browserYieldEveryVertices: 128 }),
  ownership: freeze({
    ownsIsolatedCompleteWorldPackageProjection: true,
    ownsCanonicalCompleteWorldSource: false,
    ownsClosedCoastalSources: false,
    ownsCameraNavigationTraversalOrTouch: false,
    ownsPublicRendererLifecycle: false,
    ownsPublicRouteOrMain: false
  })
});

function cloneStructured(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function cloneBuffers(source) {
  return {
    positions: copy(source.positions),
    normals: copy(source.normals),
    baseColorsLinear: copy(source.baseColorsLinear),
    materialParameters: copy(source.materialParameters),
    materialModelCodes: copy(source.materialModelCodes),
    surfaceClassCodes: copy(source.surfaceClassCodes),
    primitiveIndices: copy(source.primitiveIndices),
    roleCodes: copy(source.roleCodes),
    indices: copy(source.indices)
  };
}

function freezeBuffers(buffers) {
  for (const name of Object.keys(buffers)) freezeNumericArray(buffers[name]);
  return Object.freeze(buffers);
}

function get3(buffer, index) {
  const offset = index * 3;
  return [buffer[offset], buffer[offset + 1], buffer[offset + 2]];
}
function get4(buffer, index) {
  const offset = index * 4;
  return [buffer[offset], buffer[offset + 1], buffer[offset + 2], buffer[offset + 3]];
}
function set3(buffer, index, values) {
  const offset = index * 3;
  buffer[offset] = Number(values[0]);
  buffer[offset + 1] = Number(values[1]);
  buffer[offset + 2] = Number(values[2]);
}
function set4(buffer, index, values) {
  const offset = index * 4;
  buffer[offset] = Number(values[0]);
  buffer[offset + 1] = Number(values[1]);
  buffer[offset + 2] = Number(values[2]);
  buffer[offset + 3] = Number(values[3]);
}

function validatePackage(packageRecord) {
  const issues = [];
  if (packageRecord?.eligible !== true) issues.push('CANONICAL_PACKAGE_NOT_ELIGIBLE');
  const buffers = packageRecord?.buffers;
  if (!buffers) issues.push('CANONICAL_PACKAGE_BUFFERS_MISSING');
  const vertexCount = buffers?.roleCodes?.length ?? 0;
  const expected = {
    positions: vertexCount * 3,
    normals: vertexCount * 3,
    baseColorsLinear: vertexCount * 4,
    materialParameters: vertexCount * 4,
    materialModelCodes: vertexCount,
    surfaceClassCodes: vertexCount,
    primitiveIndices: vertexCount,
    roleCodes: vertexCount
  };
  for (const [name, length] of Object.entries(expected)) {
    if (!Array.isArray(buffers?.[name]) || buffers[name].length !== length) {
      issues.push(`CANONICAL_BUFFER_LENGTH_INVALID:${name}`);
    }
  }
  if (!Array.isArray(buffers?.indices) || buffers.indices.some(index =>
    !Number.isSafeInteger(index) || index < 0 || index >= vertexCount)) {
    issues.push('CANONICAL_INDEX_BUFFER_INVALID');
  }
  return { eligible: issues.length === 0, issues, vertexCount };
}

function rejected(rootRejectionCode, issues, counters = {}, failureDiagnostics = []) {
  return freeze({
    eligible: false,
    status: 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_REJECTED',
    contractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
    rootRejectionCode,
    issues: freeze([...issues]),
    counters: freeze({ ...counters }),
    failureDiagnostics: freeze([...failureDiagnostics])
  });
}

async function resolveCanonicalPackage(options) {
  if (options.canonicalPackage) return options.canonicalPackage;
  const module = await import('/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js');
  return module.getHEarthRun8ER2CanonicalLiveRenderPackage();
}

async function fnv1a32(buffers, { yieldEveryValues = 0, yieldControl = defaultYieldControl, onYield = null } = {}) {
  let hash = 0x811c9dc5;
  let visited = 0;
  const numberBuffer = new ArrayBuffer(8);
  const numberView = new DataView(numberBuffer);
  const byte = value => {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  };
  const writeNumber = value => {
    numberView.setFloat64(0, Number(value), true);
    for (let index = 0; index < 8; index += 1) byte(numberView.getUint8(index));
  };
  for (const name of [
    'positions', 'normals', 'baseColorsLinear', 'materialParameters',
    'materialModelCodes', 'surfaceClassCodes', 'primitiveIndices', 'roleCodes', 'indices'
  ]) {
    for (const value of buffers[name]) {
      writeNumber(value);
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

function decodeBase64Bytes(base64) {
  if (typeof Buffer !== 'undefined') return Uint8Array.from(Buffer.from(base64, 'base64'));
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function decodeFloat64Values(base64) {
  const bytes = decodeBase64Bytes(base64);
  if (bytes.byteLength % Float64Array.BYTES_PER_ELEMENT !== 0) {
    throw new Error('EXACT_BINDING_CACHE_FLOAT64_BYTE_LENGTH_INVALID');
  }
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return new Float64Array(buffer);
}

let exactBindingCacheMemo = null;
let exactBindingCacheSource = null;
async function decodeExactBindingCache(base64) {
  if (exactBindingCacheMemo && exactBindingCacheSource === base64) return exactBindingCacheMemo;
  if (typeof DecompressionStream !== 'function') {
    throw new Error('EXACT_BINDING_CACHE_DECOMPRESSION_UNAVAILABLE');
  }
  const compressed = decodeBase64Bytes(base64);
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  const cache = JSON.parse(await new Response(stream).text());
  exactBindingCacheSource = base64;
  exactBindingCacheMemo = cache;
  return cache;
}

function recordsFromCacheSection(section) {
  const values = decodeFloat64Values(section.valuesBase64);
  if (values.length !== section.recordWidth * section.recordCount) {
    throw new Error('EXACT_BINDING_CACHE_RECORD_COUNT_MISMATCH');
  }
  const records = new Map();
  for (let offset = 0; offset < values.length; offset += section.recordWidth) {
    const record = Array.from(values.subarray(offset, offset + section.recordWidth));
    const key = coordinateKey(record[0], record[1]);
    if (records.has(key)) throw new Error(`EXACT_BINDING_CACHE_DUPLICATE_COORDINATE:${key}`);
    records.set(key, record);
  }
  return records;
}

function arraysEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (!Object.is(left[index], right[index])) return false;
  }
  return true;
}

function completeResult({ canonicalPackage, buffers, digest, counters, changedVertexIndices, unchangedVertexIndices, binding }) {
  freezeBuffers(buffers);
  freezeNumericArray(changedVertexIndices);
  freezeNumericArray(unchangedVertexIndices);
  const { buffers: ignored, ...canonicalMetadata } = canonicalPackage;
  void ignored;
  return freeze({
    ...cloneStructured(canonicalMetadata),
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
      changedVertexIndices,
      unchangedVertexIndices,
      canonicalPackageReadOnly: true,
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
      ...binding
    }
  });
}

async function buildFromExactCache(canonicalPackage, validation, options, constructionStartedAt) {
  let cache;
  try {
    cache = await decodeExactBindingCache(options.exactBindingCacheBase64);
  } catch (error) {
    return rejected('EXACT_BINDING_CACHE_DECODE_FAILED', [error?.message ?? String(error)], {
      vertexCount: validation.vertexCount
    });
  }
  const issues = [];
  if (cache?.cacheType !== 'H_EARTH_C2_R1_COMPLETE_WORLD_EXACT_BINDING_CACHE_v1') issues.push('EXACT_BINDING_CACHE_TYPE_MISMATCH');
  if (cache?.canonicalPackageIdentity !== canonicalPackage.packageIdentity) issues.push('EXACT_BINDING_CACHE_PARENT_IDENTITY_MISMATCH');
  if (cache?.canonicalPackageContentDigest !== canonicalPackage.contentDigest) issues.push('EXACT_BINDING_CACHE_PARENT_DIGEST_MISMATCH');
  if (cache?.completeWorldContractId !== H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID) issues.push('EXACT_BINDING_CACHE_CONTRACT_MISMATCH');
  if (issues.length > 0) return rejected('EXACT_BINDING_CACHE_IDENTITY_REJECTED', issues, { vertexCount: validation.vertexCount });

  let terrainRecords;
  let shorelineRecords;
  try {
    terrainRecords = recordsFromCacheSection(cache.terrain);
    shorelineRecords = recordsFromCacheSection(cache.shoreline);
  } catch (error) {
    return rejected('EXACT_BINDING_CACHE_RECORDS_REJECTED', [error?.message ?? String(error)], {
      vertexCount: validation.vertexCount
    });
  }

  const source = canonicalPackage.buffers;
  const buffers = cloneBuffers(source);
  const changedVertexIndices = [];
  const unchangedVertexIndices = [];
  let boundTerrainVertexCount = 0;
  let boundShorelineVertexCount = 0;
  let terrainVertexCount = 0;
  let shorelineVertexCount = 0;
  let vegetationVertexCount = 0;
  let constructionYieldCount = 0;
  const yieldEveryVertices = Number.isSafeInteger(options.yieldEveryVertices) && options.yieldEveryVertices > 0
    ? options.yieldEveryVertices
    : 0;
  const yieldControl = options.yieldControl ?? defaultYieldControl;

  for (let vertexIndex = 0; vertexIndex < validation.vertexCount; vertexIndex += 1) {
    const role = source.roleCodes[vertexIndex];
    if (role === 1) terrainVertexCount += 1;
    else if (role === 2) shorelineVertexCount += 1;
    else if (role === 3) vegetationVertexCount += 1;
    const positionOffset = vertexIndex * 3;
    const worldX = source.positions[positionOffset];
    const worldZ = source.positions[positionOffset + 2];
    const key = coordinateKey(worldX, worldZ);
    if (role === 1 && terrainRecords.has(key)) {
      const record = terrainRecords.get(key);
      set3(buffers.positions, vertexIndex, [worldX, record[2], worldZ]);
      set3(buffers.normals, vertexIndex, record.slice(3, 6));
      const priorColor = get4(source.baseColorsLinear, vertexIndex);
      set4(buffers.baseColorsLinear, vertexIndex, [record[6], record[7], record[8], priorColor[3]]);
      const priorParameters = get4(source.materialParameters, vertexIndex);
      set4(buffers.materialParameters, vertexIndex, [record[9], priorParameters[1], record[10], record[11]]);
      boundTerrainVertexCount += 1;
      changedVertexIndices.push(vertexIndex);
    } else if (role === 2 && shorelineRecords.has(key)) {
      const record = shorelineRecords.get(key);
      set4(buffers.baseColorsLinear, vertexIndex, record.slice(2, 6));
      const priorParameters = get4(source.materialParameters, vertexIndex);
      set4(buffers.materialParameters, vertexIndex, [priorParameters[0], priorParameters[1], record[6], record[7]]);
      boundShorelineVertexCount += 1;
      changedVertexIndices.push(vertexIndex);
    } else {
      unchangedVertexIndices.push(vertexIndex);
    }
    if (yieldEveryVertices > 0 && (vertexIndex + 1) % yieldEveryVertices === 0) {
      constructionYieldCount += 1;
      options.onProgress?.(freeze({
        phase: 'EXACT_BINDING_CACHE_APPLICATION',
        processedVertexCount: vertexIndex + 1,
        vertexCount: validation.vertexCount,
        progressRatio: (vertexIndex + 1) / validation.vertexCount,
        counters: { boundTerrainVertexCount, boundShorelineVertexCount, candidateSampleFailureCount: 0, constructionYieldCount }
      }));
      await yieldControl();
    }
  }

  const countIssues = [];
  if (boundTerrainVertexCount !== cache.counters.boundTerrainVertexCount) countIssues.push('EXACT_BINDING_CACHE_TERRAIN_COUNT_MISMATCH');
  if (boundShorelineVertexCount !== cache.counters.boundShorelineVertexCount) countIssues.push('EXACT_BINDING_CACHE_SHORELINE_COUNT_MISMATCH');
  if (terrainVertexCount !== cache.counters.terrainVertexCount ||
      shorelineVertexCount !== cache.counters.shorelineVertexCount ||
      vegetationVertexCount !== cache.counters.vegetationVertexCount) countIssues.push('EXACT_BINDING_CACHE_ROLE_COUNT_MISMATCH');
  if (countIssues.length > 0) {
    return rejected('EXACT_BINDING_CACHE_APPLICATION_REJECTED', countIssues, {
      vertexCount: validation.vertexCount,
      boundTerrainVertexCount,
      boundShorelineVertexCount
    });
  }

  options.onProgress?.(freeze({
    phase: 'COMPLETE_WORLD_DIGEST',
    processedVertexCount: validation.vertexCount,
    vertexCount: validation.vertexCount,
    progressRatio: 1,
    counters: { boundTerrainVertexCount, boundShorelineVertexCount, candidateSampleFailureCount: 0 }
  }));
  const digest = await fnv1a32(buffers, {
    yieldEveryValues: yieldEveryVertices > 0 ? 65536 : 0,
    yieldControl,
    onYield: () => { constructionYieldCount += 1; }
  });
  const contentDigest = `fnv1a32:${digest}`;
  const packageIdentity = `H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_${digest.toUpperCase()}`;
  if (contentDigest !== cache.completeWorldPackageContentDigest || packageIdentity !== cache.completeWorldPackageIdentity) {
    return rejected('EXACT_BINDING_CACHE_RESULT_DIGEST_MISMATCH', [
      `EXPECTED_CONTENT_DIGEST:${cache.completeWorldPackageContentDigest}`,
      `ACTUAL_CONTENT_DIGEST:${contentDigest}`
    ], { vertexCount: validation.vertexCount, boundTerrainVertexCount, boundShorelineVertexCount });
  }

  const constructionMilliseconds = Number((nowMilliseconds() - constructionStartedAt).toFixed(3));
  const startupBudgetMilliseconds = finite(options.startupBudgetMilliseconds) && options.startupBudgetMilliseconds > 0
    ? options.startupBudgetMilliseconds
    : null;
  if (startupBudgetMilliseconds !== null && constructionMilliseconds > startupBudgetMilliseconds) {
    return rejected('COMPLETE_WORLD_PACKAGE_CONSTRUCTION_BUDGET_EXCEEDED', [
      `STARTUP_BUDGET_MILLISECONDS:${startupBudgetMilliseconds}`
    ], { ...cache.counters, constructionYieldCount, constructionMilliseconds });
  }

  const counters = {
    ...cache.counters,
    constructionYieldCount,
    constructionMilliseconds,
    exactBindingCacheTerrainRecordCount: cache.terrain.recordCount,
    exactBindingCacheShorelineRecordCount: cache.shoreline.recordCount
  };
  return completeResult({
    canonicalPackage,
    buffers,
    digest,
    counters,
    changedVertexIndices,
    unchangedVertexIndices,
    binding: {
      boundaryExclusionDiagnostics: cache.boundaryExclusionDiagnostics,
      failureDiagnostics: [],
      exactBindingCacheActive: true,
      exactBindingCacheSourceHead: cache.sourceHead,
      exactBindingCacheArtifactDigest: options.exactBindingCacheArtifactDigest ?? null,
      boundedBrowserYieldingActive: yieldEveryVertices > 0,
      startupBudgetMilliseconds
    }
  });
}

function isBoundCorridorSample(terrain) {
  const anchorX = terrain?.coastalFrame?.anchorX;
  return terrain?.valid === true && finite(terrain?.candidateWeight) && terrain.candidateWeight > 0 &&
    finite(anchorX) && anchorX >= -184 && anchorX <= 184;
}

function blendWaterColor(material) {
  const preserved = material.preservedCandidateResponses;
  const foam = clamp(preserved.foamIntensity * preserved.foamOpacity, 0, 1);
  return {
    color: [0, 1, 2].map(index => clamp(
      preserved.waterSurfaceColorLinear[index] * (1 - foam) + preserved.foamColorLinear[index] * foam,
      0,
      1
    )),
    alpha: clamp(preserved.waterSurfaceOpacity + foam * 0.18, 0.18, 0.92),
    foam,
    wetness: clamp(preserved.temporaryWetness, 0, 1)
  };
}

async function buildFromExplicitSamplers(canonicalPackage, validation, options, constructionStartedAt) {
  const required = ['sampleCoastalTerrain', 'sampleCoastalSurfaceFrame', 'sampleCandidateMaterial'];
  const missing = required.filter(name => typeof options[name] !== 'function');
  if (missing.length > 0) return rejected('EXPLICIT_SAMPLERS_MISSING', missing, { vertexCount: validation.vertexCount });
  const source = canonicalPackage.buffers;
  const buffers = cloneBuffers(source);
  const changedVertexIndices = [];
  const unchangedVertexIndices = [];
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
    constructionYieldCount: 0,
    constructionMilliseconds: 0
  };
  const terrainCache = new Map();
  const materialCache = new Map();
  const yieldEveryVertices = Number.isSafeInteger(options.yieldEveryVertices) && options.yieldEveryVertices > 0
    ? options.yieldEveryVertices
    : 0;
  const yieldControl = options.yieldControl ?? defaultYieldControl;
  for (let vertexIndex = 0; vertexIndex < validation.vertexCount; vertexIndex += 1) {
    const role = source.roleCodes[vertexIndex];
    if (role === 1) counters.terrainVertexCount += 1;
    else if (role === 2) counters.shorelineVertexCount += 1;
    else if (role === 3) counters.vegetationVertexCount += 1;
    if (role !== 1 && role !== 2) {
      counters.unchangedVertexCount += 1;
      unchangedVertexIndices.push(vertexIndex);
    } else {
      const [worldX, , worldZ] = get3(source.positions, vertexIndex);
      const key = coordinateKey(worldX, worldZ);
      let terrain = terrainCache.get(key);
      if (terrain) counters.terrainSampleCacheHitCount += 1;
      else {
        terrain = options.sampleCoastalTerrain(worldX, worldZ);
        terrainCache.set(key, terrain);
        counters.terrainSampleInvocationCount += 1;
      }
      if (!isBoundCorridorSample(terrain)) {
        counters.unchangedVertexCount += 1;
        unchangedVertexIndices.push(vertexIndex);
      } else {
        let material = materialCache.get(key);
        if (material) counters.candidateMaterialSampleCacheHitCount += 1;
        else {
          material = options.sampleCandidateMaterial(worldX, worldZ, { timeSeconds: Number(options.timeSeconds ?? 0) });
          materialCache.set(key, material);
          counters.candidateMaterialSampleInvocationCount += 1;
        }
        if (material?.valid !== true) {
          counters.candidateSampleFailureCount += 1;
          return rejected('EXPLICIT_CANDIDATE_SAMPLE_REJECTION', ['EXPLICIT_CANDIDATE_SAMPLE_REJECTION'], counters);
        }
        if (role === 1) {
          const surface = options.sampleCoastalSurfaceFrame(worldX, worldZ);
          if (surface?.valid !== true) return rejected('EXPLICIT_SURFACE_SAMPLE_REJECTION', ['EXPLICIT_SURFACE_SAMPLE_REJECTION'], counters);
          set3(buffers.positions, vertexIndex, [worldX, terrain.world.y, worldZ]);
          set3(buffers.normals, vertexIndex, [surface.normal.x, surface.normal.y, surface.normal.z]);
          const priorColor = get4(source.baseColorsLinear, vertexIndex);
          set4(buffers.baseColorsLinear, vertexIndex, [...material.material.colorLinear, priorColor[3]]);
          const priorParameters = get4(source.materialParameters, vertexIndex);
          set4(buffers.materialParameters, vertexIndex, [
            material.material.roughness,
            priorParameters[1],
            clamp(material.preservedCandidateResponses.temporaryWetness, 0, 1),
            material.material.cavityOrAmbientOcclusion
          ]);
          counters.boundTerrainVertexCount += 1;
        } else {
          const water = blendWaterColor(material);
          set4(buffers.baseColorsLinear, vertexIndex, [...water.color, water.alpha]);
          const priorParameters = get4(source.materialParameters, vertexIndex);
          set4(buffers.materialParameters, vertexIndex, [priorParameters[0], priorParameters[1], water.wetness, water.foam]);
          counters.boundShorelineVertexCount += 1;
        }
        changedVertexIndices.push(vertexIndex);
      }
    }
    if (yieldEveryVertices > 0 && (vertexIndex + 1) % yieldEveryVertices === 0) {
      counters.constructionYieldCount += 1;
      await yieldControl();
    }
  }
  if (counters.boundTerrainVertexCount === 0 || counters.boundShorelineVertexCount === 0) {
    return rejected('EXPLICIT_COMPLETE_WORLD_BINDING_ABSENT', ['EXPLICIT_COMPLETE_WORLD_BINDING_ABSENT'], counters);
  }
  const digest = await fnv1a32(buffers);
  counters.constructionMilliseconds = Number((nowMilliseconds() - constructionStartedAt).toFixed(3));
  return completeResult({
    canonicalPackage,
    buffers,
    digest,
    counters,
    changedVertexIndices,
    unchangedVertexIndices,
    binding: {
      boundaryExclusionDiagnostics: [],
      failureDiagnostics: [],
      exactBindingCacheActive: false,
      explicitSyntheticSamplerPath: true,
      boundedBrowserYieldingActive: yieldEveryVertices > 0,
      startupBudgetMilliseconds: options.startupBudgetMilliseconds ?? null
    }
  });
}

export async function buildHEarthC2R1CompleteWorldRenderPackage(options = {}) {
  const constructionStartedAt = nowMilliseconds();
  const canonicalPackage = await resolveCanonicalPackage(options);
  const validation = validatePackage(canonicalPackage);
  if (!validation.eligible) {
    return rejected('CANONICAL_PACKAGE_REJECTED', validation.issues, { vertexCount: validation.vertexCount });
  }
  if (typeof options.exactBindingCacheBase64 === 'string' && options.exactBindingCacheBase64.length > 0) {
    return buildFromExactCache(canonicalPackage, validation, options, constructionStartedAt);
  }
  return buildFromExplicitSamplers(canonicalPackage, validation, options, constructionStartedAt);
}

export function evaluateHEarthC2R1CompleteWorldRenderPackage(result, canonicalPackage) {
  if (result?.eligible !== true) {
    return freeze({
      eligible: false,
      status: 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_ROOT_REJECTION',
      rootRejected: true,
      rootRejectionCode: result?.rootRejectionCode ?? 'COMPLETE_WORLD_PACKAGE_NOT_ELIGIBLE',
      issues: freeze([...(result?.issues ?? ['COMPLETE_WORLD_PACKAGE_NOT_ELIGIBLE'])]),
      counters: result?.counters ?? null,
      failureDiagnostics: result?.failureDiagnostics ?? freeze([])
    });
  }
  const issues = [];
  if (result.completeWorldContractId !== H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID) issues.push('COMPLETE_WORLD_CONTRACT_ID_MISMATCH');
  const binding = result.completeWorldBinding;
  if (!(binding?.counters?.candidateSampleFailureCount === 0)) issues.push('CANDIDATE_SAMPLE_FAILURE_COUNT_NOT_ZERO');
  if (!(binding?.counters?.boundTerrainVertexCount > 0)) issues.push('COMPLETE_WORLD_TERRAIN_BINDING_ABSENT');
  if (!(binding?.counters?.boundShorelineVertexCount > 0)) issues.push('COMPLETE_WORLD_SHORELINE_BINDING_ABSENT');
  for (const key of ['primitiveIds', 'primitiveSpans', 'drawRanges']) {
    if (JSON.stringify(result[key]) !== JSON.stringify(canonicalPackage?.[key])) issues.push(`COMPLETE_WORLD_IDENTITY_CHANGED:${key}`);
  }
  if (!arraysEqual(result.buffers?.indices, canonicalPackage?.buffers?.indices)) issues.push('COMPLETE_WORLD_INDEX_BUFFER_CHANGED');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_PASS' : 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_FAIL',
    rootRejected: false,
    issues: freeze(issues)
  });
}

export default buildHEarthC2R1CompleteWorldRenderPackage;
