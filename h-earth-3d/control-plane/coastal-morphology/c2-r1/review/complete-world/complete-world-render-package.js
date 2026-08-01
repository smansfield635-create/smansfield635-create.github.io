/**
 * H_EARTH_C2_R1_COMPLETE_WORLD_RENDER_PACKAGE_v4
 *
 * Isolated complete-world adapter. Canonical package and closed coastal
 * sources are consumed read-only. Coordinate-stable sampler results are
 * memoized, construction yields in bounded browser chunks, and only the
 * diagnosed waterward blend-tail rejection is preserved unchanged.
 */

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const nowMilliseconds = () => globalThis.performance?.now?.() ?? Date.now();
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const nested of value) {
      if (nested !== null && typeof nested === 'object') freeze(nested, seen);
    }
  } else {
    Object.values(value).forEach(nested => freeze(nested, seen));
  }
  return Object.freeze(value);
};
const freezeNumericArray = values => Object.freeze(values);
const copy = values => Array.from(values ?? []);
const cleanIssues = sample => Array.isArray(sample?.issues) ? [...sample.issues] : [];
const coordinateKey = (worldX, worldZ) =>
  `${Object.is(worldX, -0) ? '-0' : worldX}|${Object.is(worldZ, -0) ? '-0' : worldZ}`;
const defaultYieldControl = () => new Promise(resolve => setTimeout(resolve, 0));

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
  adapterBoundaryClassification: freeze({
    code: 'WATERWARD_BLEND_TAIL_DIRECTIONAL_STENCIL_OUTSIDE_VALID_SOURCE_DOMAIN',
    requiresBlendWeight: true,
    requiresWaterwardTail: true,
    requiredMaterialIssue: 'R1_1_R1_3_OR_R1_6_CANDIDATE_INPUT_NOT_ELIGIBLE',
    requiredSwashIssue: 'R1_1_R1_3_R1_4_OR_R1_5_INPUT_NOT_ELIGIBLE',
    requiredBreakerIssue: 'DIRECTIONAL_DEPTH_SAMPLE_INVALID',
    mutationDisposition: 'PRESERVE_CANONICAL_VERTEX_BYTES'
  }),
  ownership: freeze({
    ownsIsolatedCompleteWorldPackageProjection: true,
    ownsCanonicalCompleteWorldSource: false,
    ownsClosedCoastalSources: false,
    ownsCameraNavigationTraversalOrTouch: false,
    ownsPublicRendererLifecycle: false,
    ownsPublicRouteOrMain: false
  })
});

async function fnv1a32(buffers, options = {}) {
  let hash = 0x811c9dc5;
  let visitedValueCount = 0;
  const numberBuffer = new ArrayBuffer(8);
  const numberView = new DataView(numberBuffer);
  const yieldEveryValues = Number.isSafeInteger(options.yieldEveryValues) && options.yieldEveryValues > 0
    ? options.yieldEveryValues
    : 0;
  const yieldControl = options.yieldControl ?? defaultYieldControl;
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
      visitedValueCount += 1;
      if (yieldEveryValues > 0 && visitedValueCount % yieldEveryValues === 0) {
        await yieldControl();
        options.onYield?.(visitedValueCount);
      }
    }
    byte(0xff);
  }
  return hash.toString(16).padStart(8, '0');
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

function cloneStructured(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function validatePackage(packageRecord) {
  const issues = [];
  if (packageRecord?.eligible !== true) issues.push('CANONICAL_PACKAGE_NOT_ELIGIBLE');
  const buffers = packageRecord?.buffers;
  if (!buffers) issues.push('CANONICAL_PACKAGE_BUFFERS_MISSING');
  const vertexCount = buffers ? buffers.roleCodes?.length ?? 0 : 0;
  const lengths = {
    positions: vertexCount * 3,
    normals: vertexCount * 3,
    baseColorsLinear: vertexCount * 4,
    materialParameters: vertexCount * 4,
    materialModelCodes: vertexCount,
    surfaceClassCodes: vertexCount,
    primitiveIndices: vertexCount,
    roleCodes: vertexCount
  };
  for (const [name, length] of Object.entries(lengths)) {
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

async function resolveDependencies(options) {
  let canonicalPackage = options.canonicalPackage ?? null;
  let sampleCoastalTerrain = options.sampleCoastalTerrain ?? null;
  let sampleCoastalSurfaceFrame = options.sampleCoastalSurfaceFrame ?? null;
  let sampleCandidateMaterial = options.sampleCandidateMaterial ?? null;
  let sampleSediment = options.sampleSediment ?? null;
  let sampleSwash = options.sampleSwash ?? null;
  let sampleWaterOptics = options.sampleWaterOptics ?? null;
  let sampleBreaker = options.sampleBreaker ?? null;

  if (!canonicalPackage) {
    const module = await import('/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js');
    canonicalPackage = module.getHEarthRun8ER2CanonicalLiveRenderPackage();
  }
  if (!sampleCoastalTerrain) {
    const module = await import('/h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js');
    sampleCoastalTerrain = module.sampleHEarthC2R1CoastalTerrainField;
  }
  if (!sampleCoastalSurfaceFrame) {
    const module = await import('/h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js');
    sampleCoastalSurfaceFrame = module.sampleHEarthC2R1CoastalSurfaceFrame;
  }
  if (!sampleCandidateMaterial) {
    const module = await import('/h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.candidate-renderer-sampling.js');
    sampleCandidateMaterial = module.sampleHEarthC2R1CandidateRendererMaterial;
  }
  if (!sampleSediment) {
    const module = await import('/h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js');
    sampleSediment = module.sampleHEarthC2R1ContinuousCoastalSedimentMembership;
  }
  if (!sampleSwash) {
    const module = await import('/h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js');
    sampleSwash = module.sampleHEarthC2R1CoastalSwashFoamWetness;
  }
  if (!sampleWaterOptics) {
    const module = await import('/h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js');
    sampleWaterOptics = module.sampleHEarthC2R1CoastalWaterOptics;
  }
  if (!sampleBreaker) {
    const module = await import('/h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js');
    sampleBreaker = module.sampleHEarthC2R1CoastalBreakerField;
  }
  return {
    canonicalPackage,
    sampleCoastalTerrain,
    sampleCoastalSurfaceFrame,
    sampleCandidateMaterial,
    sampleSediment,
    sampleSwash,
    sampleWaterOptics,
    sampleBreaker
  };
}

function isBoundCorridorSample(terrain) {
  const anchorX = terrain?.coastalFrame?.anchorX;
  return terrain?.valid === true &&
    finite(terrain?.candidateWeight) && terrain.candidateWeight > 0 &&
    finite(anchorX) &&
    anchorX >= H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.corridor.alongshoreAnchorMinimum &&
    anchorX <= H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.corridor.alongshoreAnchorMaximum;
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
function get3(buffer, index) {
  const offset = index * 3;
  return [buffer[offset], buffer[offset + 1], buffer[offset + 2]];
}
function get4(buffer, index) {
  const offset = index * 4;
  return [buffer[offset], buffer[offset + 1], buffer[offset + 2], buffer[offset + 3]];
}

function blendWaterColor(material) {
  const preserved = material.preservedCandidateResponses;
  const water = preserved.waterSurfaceColorLinear;
  const foam = clamp(preserved.foamIntensity * preserved.foamOpacity, 0, 1);
  return {
    color: [0, 1, 2].map(index => clamp(
      water[index] * (1 - foam) + preserved.foamColorLinear[index] * foam,
      0,
      1
    )),
    alpha: clamp(preserved.waterSurfaceOpacity + foam * 0.18, 0.18, 0.92),
    foam,
    wetness: clamp(preserved.temporaryWetness, 0, 1)
  };
}

function roleName(roleCode) {
  return Object.entries(H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.roleCodes)
    .find(([, code]) => code === roleCode)?.[0] ?? 'UNKNOWN';
}

function sampleDiagnostic(dependencies, vertexIndex, roleCode, worldX, worldZ, terrain, material, timeSeconds, caches, counters) {
  const key = coordinateKey(worldX, worldZ);
  const cached = (cache, counterName, sampler) => {
    if (cache.has(key)) {
      counters[`${counterName}CacheHitCount`] += 1;
      return cache.get(key);
    }
    const value = sampler();
    cache.set(key, value);
    counters[`${counterName}InvocationCount`] += 1;
    return value;
  };
  const sediment = cached(caches.sediment, 'sedimentSample', () => dependencies.sampleSediment?.(worldX, worldZ));
  const swash = cached(caches.swash, 'swashSample', () => dependencies.sampleSwash?.(worldX, worldZ, { timeSeconds }));
  const waterOptics = cached(caches.waterOptics, 'waterOpticsSample', () => dependencies.sampleWaterOptics?.(worldX, worldZ));
  const breaker = cached(caches.breaker, 'breakerSample', () => dependencies.sampleBreaker?.(worldX, worldZ));
  return freeze({
    vertexIndex,
    roleCode,
    role: roleName(roleCode),
    worldX,
    worldZ,
    coastalFrame: terrain?.coastalFrame ? cloneStructured(terrain.coastalFrame) : null,
    candidateWeight: terrain?.candidateWeight ?? null,
    terrain: { valid: terrain?.valid === true, issues: cleanIssues(terrain) },
    material: { valid: material?.valid === true, status: material?.status ?? null, issues: cleanIssues(material) },
    sediment: { valid: sediment?.valid === true, status: sediment?.status ?? null, issues: cleanIssues(sediment) },
    swash: { valid: swash?.valid === true, status: swash?.status ?? null, issues: cleanIssues(swash) },
    waterOptics: { valid: waterOptics?.valid === true, status: waterOptics?.status ?? null, issues: cleanIssues(waterOptics) },
    breaker: { valid: breaker?.valid === true, status: breaker?.status ?? null, issues: cleanIssues(breaker) }
  });
}

function includesIssue(sample, issue) {
  return Array.isArray(sample?.issues) && sample.issues.includes(issue);
}

function isDiagnosedAdapterBoundaryExclusion(terrain, diagnostic) {
  const classification = H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.adapterBoundaryClassification;
  return terrain?.valid === true &&
    finite(terrain?.candidateWeight) && terrain.candidateWeight > 0 && terrain.candidateWeight < 1 &&
    finite(terrain?.coastalFrame?.signedInlandDistance) && terrain.coastalFrame.signedInlandDistance < 0 &&
    diagnostic?.material?.valid === false &&
    diagnostic?.swash?.valid === false &&
    diagnostic?.breaker?.valid === false &&
    includesIssue(diagnostic.material, classification.requiredMaterialIssue) &&
    includesIssue(diagnostic.swash, classification.requiredSwashIssue) &&
    includesIssue(diagnostic.breaker, classification.requiredBreakerIssue);
}

function rejected(rootCode, issues, counters, failureDiagnostics = []) {
  return freeze({
    eligible: false,
    status: 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_REJECTED',
    contractId: H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID,
    rootRejectionCode: rootCode,
    issues: freeze(issues),
    counters: freeze(counters ?? {}),
    failureDiagnostics: freeze(failureDiagnostics)
  });
}

function arraysEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (!Object.is(left[index], right[index])) return false;
  }
  return true;
}

export async function buildHEarthC2R1CompleteWorldRenderPackage(options = {}) {
  const constructionStartedAt = nowMilliseconds();
  const dependencies = await resolveDependencies(options);
  const canonicalPackage = dependencies.canonicalPackage;
  const validation = validatePackage(canonicalPackage);
  if (!validation.eligible) {
    return rejected('CANONICAL_PACKAGE_REJECTED', validation.issues, { vertexCount: validation.vertexCount });
  }

  const sourceBuffers = canonicalPackage.buffers;
  const buffers = cloneBuffers(sourceBuffers);
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
    uniqueCoordinateCount: 0,
    terrainSampleInvocationCount: 0,
    terrainSampleCacheHitCount: 0,
    candidateMaterialSampleInvocationCount: 0,
    candidateMaterialSampleCacheHitCount: 0,
    surfaceFrameSampleInvocationCount: 0,
    surfaceFrameSampleCacheHitCount: 0,
    sedimentSampleInvocationCount: 0,
    sedimentSampleCacheHitCount: 0,
    swashSampleInvocationCount: 0,
    swashSampleCacheHitCount: 0,
    waterOpticsSampleInvocationCount: 0,
    waterOpticsSampleCacheHitCount: 0,
    breakerSampleInvocationCount: 0,
    breakerSampleCacheHitCount: 0,
    constructionYieldCount: 0,
    constructionMilliseconds: 0
  };
  const changedVertexIndices = [];
  const unchangedVertexIndices = [];
  const boundaryExclusionDiagnostics = [];
  const failureDiagnostics = [];
  const timeSeconds = Number(options.timeSeconds ?? 0);
  const startupBudgetMilliseconds = finite(options.startupBudgetMilliseconds) && options.startupBudgetMilliseconds > 0
    ? options.startupBudgetMilliseconds
    : null;
  const yieldEveryVertices = Number.isSafeInteger(options.yieldEveryVertices) && options.yieldEveryVertices > 0
    ? options.yieldEveryVertices
    : 0;
  const yieldControl = options.yieldControl ?? defaultYieldControl;
  const caches = {
    terrain: new Map(),
    material: new Map(),
    surface: new Map(),
    sediment: new Map(),
    swash: new Map(),
    waterOptics: new Map(),
    breaker: new Map()
  };

  const progress = async vertexIndex => {
    counters.constructionMilliseconds = Number((nowMilliseconds() - constructionStartedAt).toFixed(3));
    options.onProgress?.(freeze({
      phase: 'COASTAL_PACKAGE_BINDING',
      processedVertexCount: vertexIndex + 1,
      vertexCount: validation.vertexCount,
      progressRatio: (vertexIndex + 1) / validation.vertexCount,
      counters: { ...counters }
    }));
    if (startupBudgetMilliseconds !== null && counters.constructionMilliseconds > startupBudgetMilliseconds) {
      return rejected(
        'COMPLETE_WORLD_PACKAGE_CONSTRUCTION_BUDGET_EXCEEDED',
        [`STARTUP_BUDGET_MILLISECONDS:${startupBudgetMilliseconds}`],
        counters,
        failureDiagnostics
      );
    }
    if (yieldEveryVertices > 0 && (vertexIndex + 1) % yieldEveryVertices === 0) {
      counters.constructionYieldCount += 1;
      await yieldControl();
    }
    return null;
  };

  const cached = (cache, hitCounter, invocationCounter, key, sampler) => {
    if (cache.has(key)) {
      counters[hitCounter] += 1;
      return cache.get(key);
    }
    const value = sampler();
    cache.set(key, value);
    counters[invocationCounter] += 1;
    return value;
  };

  for (let vertexIndex = 0; vertexIndex < validation.vertexCount; vertexIndex += 1) {
    const role = sourceBuffers.roleCodes[vertexIndex];
    if (role === H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.roleCodes.TERRAIN) counters.terrainVertexCount += 1;
    else if (role === H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.roleCodes.SHORELINE) counters.shorelineVertexCount += 1;
    else if (role === H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.roleCodes.VEGETATION) counters.vegetationVertexCount += 1;

    if (role !== H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.roleCodes.TERRAIN &&
        role !== H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.roleCodes.SHORELINE) {
      counters.unchangedVertexCount += 1;
      unchangedVertexIndices.push(vertexIndex);
      const budgetRejection = await progress(vertexIndex);
      if (budgetRejection) return budgetRejection;
      continue;
    }

    const [worldX, , worldZ] = get3(sourceBuffers.positions, vertexIndex);
    const key = coordinateKey(worldX, worldZ);
    if (!caches.terrain.has(key)) counters.uniqueCoordinateCount += 1;
    const terrain = cached(
      caches.terrain,
      'terrainSampleCacheHitCount',
      'terrainSampleInvocationCount',
      key,
      () => dependencies.sampleCoastalTerrain(worldX, worldZ)
    );
    if (!isBoundCorridorSample(terrain)) {
      counters.unchangedVertexCount += 1;
      unchangedVertexIndices.push(vertexIndex);
      const budgetRejection = await progress(vertexIndex);
      if (budgetRejection) return budgetRejection;
      continue;
    }

    const material = cached(
      caches.material,
      'candidateMaterialSampleCacheHitCount',
      'candidateMaterialSampleInvocationCount',
      key,
      () => dependencies.sampleCandidateMaterial(worldX, worldZ, { timeSeconds })
    );
    if (material?.valid !== true) {
      const diagnostic = sampleDiagnostic(
        dependencies, vertexIndex, role, worldX, worldZ, terrain, material, timeSeconds, caches, counters
      );
      if (isDiagnosedAdapterBoundaryExclusion(terrain, diagnostic)) {
        counters.adapterBoundaryExcludedVertexCount += 1;
        counters.unchangedVertexCount += 1;
        unchangedVertexIndices.push(vertexIndex);
        boundaryExclusionDiagnostics.push(diagnostic);
        const budgetRejection = await progress(vertexIndex);
        if (budgetRejection) return budgetRejection;
        continue;
      }
      counters.candidateSampleFailureCount += 1;
      counters.unchangedVertexCount += 1;
      unchangedVertexIndices.push(vertexIndex);
      failureDiagnostics.push(diagnostic);
      if (options.stopAfterFirstFailure === true) {
        return rejected(
          'REAL_PACKAGE_CANDIDATE_SAMPLE_REJECTION',
          [`CANDIDATE_SAMPLE_FAILURES:${counters.candidateSampleFailureCount}`],
          counters,
          failureDiagnostics
        );
      }
      const budgetRejection = await progress(vertexIndex);
      if (budgetRejection) return budgetRejection;
      continue;
    }

    if (role === H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.roleCodes.TERRAIN) {
      const surface = cached(
        caches.surface,
        'surfaceFrameSampleCacheHitCount',
        'surfaceFrameSampleInvocationCount',
        key,
        () => dependencies.sampleCoastalSurfaceFrame(worldX, worldZ)
      );
      if (surface?.valid !== true) {
        counters.candidateSampleFailureCount += 1;
        counters.unchangedVertexCount += 1;
        unchangedVertexIndices.push(vertexIndex);
        failureDiagnostics.push(freeze({
          ...sampleDiagnostic(dependencies, vertexIndex, role, worldX, worldZ, terrain, material, timeSeconds, caches, counters),
          surface: { valid: false, status: surface?.status ?? null, issues: cleanIssues(surface) }
        }));
        if (options.stopAfterFirstFailure === true) {
          return rejected(
            'REAL_PACKAGE_SURFACE_SAMPLE_REJECTION',
            [`CANDIDATE_SAMPLE_FAILURES:${counters.candidateSampleFailureCount}`],
            counters,
            failureDiagnostics
          );
        }
        const budgetRejection = await progress(vertexIndex);
        if (budgetRejection) return budgetRejection;
        continue;
      }
      set3(buffers.positions, vertexIndex, [worldX, terrain.world.y, worldZ]);
      set3(buffers.normals, vertexIndex, [surface.normal.x, surface.normal.y, surface.normal.z]);
      const priorColor = get4(sourceBuffers.baseColorsLinear, vertexIndex);
      set4(buffers.baseColorsLinear, vertexIndex, [
        material.material.colorLinear[0], material.material.colorLinear[1],
        material.material.colorLinear[2], priorColor[3]
      ]);
      const priorParameters = get4(sourceBuffers.materialParameters, vertexIndex);
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
      const priorParameters = get4(sourceBuffers.materialParameters, vertexIndex);
      set4(buffers.materialParameters, vertexIndex, [
        priorParameters[0], priorParameters[1], water.wetness, water.foam
      ]);
      counters.boundShorelineVertexCount += 1;
    }
    changedVertexIndices.push(vertexIndex);
    const budgetRejection = await progress(vertexIndex);
    if (budgetRejection) return budgetRejection;
  }

  if (counters.candidateSampleFailureCount !== 0) {
    return rejected(
      'REAL_PACKAGE_CANDIDATE_SAMPLE_REJECTION',
      [`CANDIDATE_SAMPLE_FAILURES:${counters.candidateSampleFailureCount}`],
      counters,
      failureDiagnostics
    );
  }
  if (counters.boundTerrainVertexCount === 0) {
    return rejected(
      'NO_TERRAIN_VERTEX_BOUND_TO_ACCEPTED_COASTAL_COMPONENT',
      ['NO_TERRAIN_VERTEX_BOUND_TO_ACCEPTED_COASTAL_COMPONENT'], counters
    );
  }
  if (counters.boundShorelineVertexCount === 0) {
    return rejected(
      'NO_SHORELINE_VERTEX_BOUND_TO_ACCEPTED_COASTAL_COMPONENT',
      ['NO_SHORELINE_VERTEX_BOUND_TO_ACCEPTED_COASTAL_COMPONENT'], counters
    );
  }

  options.onProgress?.(freeze({
    phase: 'COMPLETE_WORLD_DIGEST',
    processedVertexCount: validation.vertexCount,
    vertexCount: validation.vertexCount,
    progressRatio: 1,
    counters: { ...counters }
  }));
  const digest = await fnv1a32(buffers, {
    yieldEveryValues: yieldEveryVertices > 0 ? 65536 : 0,
    yieldControl,
    onYield: () => { counters.constructionYieldCount += 1; }
  });
  counters.constructionMilliseconds = Number((nowMilliseconds() - constructionStartedAt).toFixed(3));
  if (startupBudgetMilliseconds !== null && counters.constructionMilliseconds > startupBudgetMilliseconds) {
    return rejected(
      'COMPLETE_WORLD_PACKAGE_CONSTRUCTION_BUDGET_EXCEEDED',
      [`STARTUP_BUDGET_MILLISECONDS:${startupBudgetMilliseconds}`],
      counters,
      failureDiagnostics
    );
  }

  freezeBuffers(buffers);
  freezeNumericArray(changedVertexIndices);
  freezeNumericArray(unchangedVertexIndices);
  const { buffers: ignoredCanonicalBuffers, ...canonicalMetadata } = canonicalPackage;
  void ignoredCanonicalBuffers;
  const result = {
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
      boundaryExclusionDiagnostics,
      failureDiagnostics,
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
      coordinateMemoizationActive: true,
      boundedBrowserYieldingActive: yieldEveryVertices > 0,
      startupBudgetMilliseconds
    }
  };
  return freeze(result);
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
  if (result.completeWorldContractId !== H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_CONTRACT_ID) {
    issues.push('COMPLETE_WORLD_CONTRACT_ID_MISMATCH');
  }
  const binding = result.completeWorldBinding;
  if (!(binding?.counters?.candidateSampleFailureCount === 0)) issues.push('CANDIDATE_SAMPLE_FAILURE_COUNT_NOT_ZERO');
  if (!(binding?.counters?.boundTerrainVertexCount > 0)) issues.push('COMPLETE_WORLD_TERRAIN_BINDING_ABSENT');
  if (!(binding?.counters?.boundShorelineVertexCount > 0)) issues.push('COMPLETE_WORLD_SHORELINE_BINDING_ABSENT');
  for (const key of ['primitiveIds', 'primitiveSpans', 'drawRanges']) {
    if (JSON.stringify(result[key]) !== JSON.stringify(canonicalPackage?.[key])) {
      issues.push(`COMPLETE_WORLD_IDENTITY_CHANGED:${key}`);
    }
  }
  if (!arraysEqual(result.buffers?.indices, canonicalPackage?.buffers?.indices)) {
    issues.push('COMPLETE_WORLD_INDEX_BUFFER_CHANGED');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_PASS'
      : 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_FAIL',
    rootRejected: false,
    issues: freeze(issues)
  });
}

export default buildHEarthC2R1CompleteWorldRenderPackage;
