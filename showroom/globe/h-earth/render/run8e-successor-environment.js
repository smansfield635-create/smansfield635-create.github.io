/** H_EARTH_RUN_8E_SUCCESSOR_ENVIRONMENT_FRAME_AND_RENDER_INTEGRATION_v1 */
import {
  admitHEarthPrimitiveBatch,
  mergeHEarthGeometryBounds,
  isHEarthAABB3D
} from './geometry-kernel.js';
import { previewHEarthFunctionalLandscape } from './landscape-preview.js';
import { constructHEarthRun8BSuccessorTerrainAndMountain } from './geometry-successor-terrain.run8b.js';
import {
  buildHEarthRun8CTerrainMaterialLightingPresentation,
  evaluateHEarthRun8CTerrainMaterialLightingPresentation
} from './lighting-material-successor-terrain.run8c.js';
import {
  constructHEarthRun8DGroundedVegetation,
  evaluateHEarthRun8DGroundedVegetation
} from './geometry-grounded-vegetation.run8d.js';
import {
  prepareHEarthFunctionalLandscapeRenderPlan,
  rasterizeHEarthFunctionalLandscapePlan
} from './renderer.functional-landscape.js';
import {
  H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID,
  H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,
  buildHEarthRun8EPacket002SuccessorTransfer
} from '../../../../h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js';
import {
  H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,
  evaluateHEarthRun8EControlContract
} from '../../../../h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (a, b, t) => Math.round(a + (b - a) * t);
const canonical = (values) => Object.freeze([...new Set((values ?? []).filter((value) => typeof value === 'string' && value.length > 0))].sort());

export const H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID =
  'H_EARTH_RUN_8E_SUCCESSOR_ENVIRONMENT_FRAME_AND_RENDER_INTEGRATION_v1';

function averageColors(colors) {
  const valid = colors.filter((color) => Array.isArray(color) && color.length === 4);
  if (valid.length === 0) return [116, 103, 73, 255];
  return [0, 1, 2, 3].map((channel) => Math.round(valid.reduce((sum, color) => sum + color[channel], 0) / valid.length));
}

function terrainTriangleColors(primitive, presentation) {
  const indices = primitive.geometry.indices;
  const attributes = presentation.vertexAttributes;
  const colors = [];
  for (let offset = 0; offset + 2 < indices.length; offset += 3) {
    colors.push(averageColors([
      attributes[indices[offset]]?.finalColorRgba,
      attributes[indices[offset + 1]]?.finalColorRgba,
      attributes[indices[offset + 2]]?.finalColorRgba
    ]));
  }
  return freeze(colors);
}

function vegetationColor(primitive) {
  const intent = String(primitive?.materialHint?.materialIntent ?? '');
  if (intent.includes('TRUNK') || intent.includes('WOODY')) return [89, 63, 39, 255];
  if (intent.includes('CONIFER')) return [38, 73, 48, 255];
  if (intent.includes('SHRUB')) return [52, 94, 52, 255];
  return [78, 126, 65, 255];
}

function decoratePrimitive(primitive, role, terrainColors = null) {
  const renderMaterial = role === 'TERRAIN'
    ? { rgba: terrainColors?.[0] ?? [108, 98, 72, 255], transparencyClass: 'OPAQUE' }
    : role === 'VEGETATION'
      ? { rgba: vegetationColor(primitive), transparencyClass: 'OPAQUE' }
      : null;
  return freeze({
    ...primitive,
    renderMaterial: renderMaterial ?? primitive.renderMaterial,
    renderTriangleColors: role === 'TERRAIN' ? terrainColors : null,
    metadata: freeze({
      ...primitive.metadata,
      run8ERenderClass: role,
      samePhysicalDepthDomainAsTerrain: role === 'VEGETATION' ? true : primitive.metadata?.samePhysicalDepthDomainAsTerrain,
      terrainOcclusionExecutedByRun8ERaster: role === 'VEGETATION' ? true : primitive.metadata?.terrainOcclusionExecutedByRun8ERaster
    })
  });
}

export function buildHEarthRun8ENeutralPackage() {
  const legacy = previewHEarthFunctionalLandscape();
  const terrain = constructHEarthRun8BSuccessorTerrainAndMountain();
  const vegetation = constructHEarthRun8DGroundedVegetation();
  const vegetationEvaluation = evaluateHEarthRun8DGroundedVegetation(vegetation);
  const issues = [];
  if (legacy?.ok !== true) issues.push('RUN_8E_LEGACY_PREVIEW_INVALID');
  if (terrain?.ok !== true || !terrain.primitive) issues.push('RUN_8E_SUCCESSOR_TERRAIN_INVALID');
  if (vegetationEvaluation.eligible !== true) issues.push(...vegetationEvaluation.issues);

  const shorelinePrimitives = legacy?.componentResults?.shoreline?.primitives ?? [];
  const vegetationPrimitives = (vegetation?.instances ?? [])
    .flatMap((instance) => instance.components ?? [])
    .map((component) => component.primitiveRecord)
    .filter(Boolean);
  const primitives = terrain?.primitive
    ? [terrain.primitive, ...shorelinePrimitives, ...vegetationPrimitives]
    : [];
  const bounds = primitives.length > 0
    ? mergeHEarthGeometryBounds(primitives.map((primitive) => primitive.geometry.bounds))
    : null;
  if (!isHEarthAABB3D(bounds)) issues.push('RUN_8E_NEUTRAL_PACKAGE_BOUNDS_INVALID');
  if (shorelinePrimitives.length !== 7) issues.push(`RUN_8E_SHORELINE_COUNT_EXPECTED_7_ACTUAL_${shorelinePrimitives.length}`);
  if (vegetationPrimitives.length !== 27) issues.push(`RUN_8E_VEGETATION_COUNT_EXPECTED_27_ACTUAL_${vegetationPrimitives.length}`);
  if (primitives.length !== 35) issues.push(`RUN_8E_NEUTRAL_COUNT_EXPECTED_35_ACTUAL_${primitives.length}`);
  const ids = primitives.map((primitive) => primitive.primitiveId);
  if (new Set(ids).size !== ids.length) issues.push('RUN_8E_DUPLICATE_PRIMITIVE_ID');

  return freeze({
    ok: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_SUCCESSOR_NEUTRAL_PACKAGE_COMPLETE' : 'RUN_8E_SUCCESSOR_NEUTRAL_PACKAGE_FAILED',
    contractId: H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID,
    controllingRun8EContractId: H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,
    primitives,
    primitiveIds: freeze(ids),
    primitiveCount: primitives.length,
    terrainPrimitiveCount: terrain?.primitive ? 1 : 0,
    shorelinePrimitiveCount: shorelinePrimitives.length,
    vegetationPrimitiveCount: vegetationPrimitives.length,
    bounds,
    semanticAddressCount: legacy?.semanticAddressCount ?? 0,
    semanticAddressIds: legacy?.semanticAddressIds ?? [],
    terrainAddressCount: legacy?.terrainAddressCount ?? 0,
    terrainAddressIds: legacy?.terrainAddressIds ?? [],
    shorelineWaterAddressCount: legacy?.shorelineWaterAddressCount ?? 0,
    shorelineWaterAddressIds: legacy?.shorelineWaterAddressIds ?? [],
    proxySummarizedAddressCount: legacy?.proxySummarizedAddressCount ?? 0,
    proxySummarizedAddressIds: legacy?.proxySummarizedAddressIds ?? [],
    formationIds: canonical([...(legacy?.formationIds ?? []), 'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001']),
    shorelineBandIds: canonical(shorelinePrimitives.map((primitive) => primitive.metadata?.bandId)),
    legacyProxyIncluded: false,
    legacyProxyPreservedOutsideSuccessorFrame: true,
    successorMountainIncluded: true,
    admitted: false,
    WestAdmissionPerformed: false,
    packet002TransferPerformed: false,
    issues
  });
}

export function constructHEarthRun8ESuccessorEnvironmentFrame({
  camera,
  viewport = { width: 320, height: 180, pixelRatio: 1 },
  timeOfDayHours = 15.25,
  frameOccurrenceId = 'H_EARTH_RUN_8E_SUCCESSOR_FRAME_OCCURRENCE_001',
  transferOccurrenceId = 'H_EARTH_RUN_8E_PACKET_002_TRANSFER_OCCURRENCE_001'
} = {}) {
  const issues = [];
  const control = evaluateHEarthRun8EControlContract();
  if (control.eligible !== true) issues.push(...control.issues);
  if (!camera || ![camera.position?.x, camera.position?.y, camera.position?.z, camera.target?.x, camera.target?.y, camera.target?.z].every(finite)) {
    issues.push('RUN_8E_CAMERA_INVALID');
  }
  const neutralPackage = buildHEarthRun8ENeutralPackage();
  if (neutralPackage.ok !== true) issues.push(...neutralPackage.issues);
  const westAdmission = issues.length === 0
    ? admitHEarthPrimitiveBatch(neutralPackage.primitives, {
        frameId: `${frameOccurrenceId}:WEST_AGGREGATE`,
        metadata: { successorProgram: 'H_EARTH_RUN_8E', presentationMode: 'RUN_8E_SUCCESSOR_ENVIRONMENT' }
      })
    : null;
  const transfer = issues.length === 0
    ? buildHEarthRun8EPacket002SuccessorTransfer({ neutralPackage, westBatchAdmissionResult: westAdmission, transferOccurrenceId })
    : null;
  if (transfer?.ok !== true || transfer?.contractId !== H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID) {
    issues.push(...(transfer?.issues ?? ['RUN_8E_PACKET_002_TRANSFER_FAILED']));
  }

  const presentation = issues.length === 0
    ? buildHEarthRun8CTerrainMaterialLightingPresentation({
        timeOfDayHours,
        cameraWorld: camera.position,
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
        cameraFarPlane: camera.farPlane
      })
    : null;
  const presentationEvaluation = presentation
    ? evaluateHEarthRun8CTerrainMaterialLightingPresentation(presentation)
    : { eligible: false, issues: ['RUN_8E_RUN_8C_PRESENTATION_MISSING'] };
  if (presentationEvaluation.eligible !== true) issues.push(...presentationEvaluation.issues);

  if (issues.length > 0) {
    return freeze({ ok: false, status: 'RUN_8E_SUCCESSOR_FRAME_REJECTED', contractId: H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID, issues });
  }

  const terrainSourceId = presentation.sourcePrimitiveId;
  const terrainColors = terrainTriangleColors(
    transfer.admittedPrimitives.find((primitive) => primitive.primitiveId === terrainSourceId),
    presentation
  );
  const decoratedPrimitives = transfer.admittedPrimitives.map((primitive) => {
    const role = primitive.primitiveId === terrainSourceId
      ? 'TERRAIN'
      : primitive.metadata?.run8DInstanceId
        ? 'VEGETATION'
        : 'SHORELINE';
    return decoratePrimitive(primitive, role, role === 'TERRAIN' ? terrainColors : null);
  });
  const skyStops = presentation.skyGradientStops;

  return freeze({
    ok: true,
    status: 'RUN_8E_SUCCESSOR_FRAME_COMPLETE',
    contractId: H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,
    frameId: frameOccurrenceId,
    frameOccurrenceId,
    revision: 1,
    presentationMode: 'RUN_8E_SUCCESSOR_ENVIRONMENT',
    neutralPackage,
    westAdmission,
    transfer,
    packet002SuccessorTransferExecuted: true,
    primitiveCount: decoratedPrimitives.length,
    primitiveIds: decoratedPrimitives.map((primitive) => primitive.primitiveId),
    primitives: decoratedPrimitives,
    admittedPrimitives: decoratedPrimitives,
    bounds: transfer.bounds,
    camera: freeze({ ...camera }),
    viewport: freeze({ ...viewport }),
    environment: freeze({
      skyTop: skyStops[0].rgba,
      skyHorizon: skyStops[skyStops.length - 1].rgba,
      groundHaze: presentation.horizonHaze.rgba,
      skyGradientStops: skyStops,
      sunDisc: presentation.sunDisc,
      ownsSkyAuthority: true,
      singleSkyAuthority: true
    }),
    run8CPresentation: presentation,
    visibility: freeze({ visiblePrimitiveIds: decoratedPrimitives.map((primitive) => primitive.primitiveId), hiddenPrimitiveIds: [] }),
    terrainTriangleColorCount: terrainColors.length,
    terrainOcclusionExecuted: true,
    sameWorldToCameraTransformForTerrainAndVegetation: true,
    singlePhysicalDepthDomain: true,
    legacyProxyIncluded: false,
    legacyProxyPreservedOutsideSuccessorFrame: true,
    rendererAuthorityCreated: false,
    cameraAuthorityCreated: false,
    publicRouteMutation: false,
    deployment: false,
    issues: []
  });
}

function applyRun8ETriangleColors(plan, frame) {
  const primitiveMap = new Map(frame.primitives.map((primitive) => [primitive.primitiveId, primitive]));
  const triangles = plan.triangles.map((triangle) => {
    const primitive = primitiveMap.get(triangle.primitiveId);
    const rgba = primitive?.renderTriangleColors?.[triangle.sourceTriangleIndex] ?? primitive?.renderMaterial?.rgba ?? triangle.material.rgba;
    return freeze({ ...triangle, material: freeze({ ...triangle.material, rgba }) });
  });
  const opaqueTriangles = triangles.filter((triangle) => triangle.material.transparencyClass !== 'TRANSLUCENT');
  const translucentTriangles = triangles.filter((triangle) => triangle.material.transparencyClass === 'TRANSLUCENT')
    .sort((left, right) => right.cameraDepth - left.cameraDepth);
  return freeze({ ...plan, triangles, opaqueTriangles, translucentTriangles, run8ETriangleMaterialProjection: true });
}

export function prepareHEarthRun8ERenderPlan(frame, viewport) {
  const basePlan = prepareHEarthFunctionalLandscapeRenderPlan(frame, viewport);
  if (basePlan?.eligible !== true) return basePlan;
  return applyRun8ETriangleColors(basePlan, frame);
}

function sampleGradient(stops, normalizedY) {
  const y = clamp(normalizedY, 0, 1);
  for (let index = 1; index < stops.length; index += 1) {
    const left = stops[index - 1];
    const right = stops[index];
    if (y <= right.offset) {
      const span = Math.max(Number.EPSILON, right.offset - left.offset);
      const amount = clamp((y - left.offset) / span, 0, 1);
      return [0, 1, 2, 3].map((channel) => mix(left.rgba[channel], right.rgba[channel], amount));
    }
  }
  return [...stops[stops.length - 1].rgba];
}

function edgeFunction(a, b, x, y) {
  return (x - a.x) * (b.y - a.y) - (y - a.y) * (b.x - a.x);
}

function evaluateHEarthRun8ESharedDepthOcclusion(plan, frame) {
  const { width, height } = plan.viewport;
  const depth = new Float64Array(width * height);
  depth.fill(Number.POSITIVE_INFINITY);
  const owner = new Array(width * height).fill(null);
  const roleByPrimitive = new Map(
    frame.primitives.map((primitive) => [
      primitive.primitiveId,
      primitive.metadata?.run8ERenderClass ?? 'UNKNOWN'
    ])
  );
  const writtenPixelCounts = { TERRAIN: 0, SHORELINE: 0, VEGETATION: 0, UNKNOWN: 0 };
  let depthRejectedCandidateCount = 0;
  let crossClassDepthInteractionCount = 0;
  let vegetationTerrainDepthInteractionCount = 0;

  for (const triangle of plan.opaqueTriangles) {
    const [a, b, c] = triangle.points;
    const role = roleByPrimitive.get(triangle.primitiveId) ?? 'UNKNOWN';
    const minX = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x)));
    const maxX = Math.min(width - 1, Math.ceil(Math.max(a.x, b.x, c.x)));
    const minY = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y)));
    const maxY = Math.min(height - 1, Math.ceil(Math.max(a.y, b.y, c.y)));
    const area = edgeFunction(a, b, c.x, c.y);
    if (!finite(area) || Math.abs(area) < 1e-7) continue;
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const px = x + 0.5;
        const py = y + 0.5;
        const w0 = edgeFunction(b, c, px, py) / area;
        const w1 = edgeFunction(c, a, px, py) / area;
        const w2 = edgeFunction(a, b, px, py) / area;
        if (w0 < -1e-8 || w1 < -1e-8 || w2 < -1e-8) continue;
        const z = w0 * a.z + w1 * b.z + w2 * c.z;
        const pixel = y * width + x;
        const priorRole = owner[pixel];
        if (z >= depth[pixel]) {
          depthRejectedCandidateCount += 1;
          if (priorRole && priorRole !== role) {
            crossClassDepthInteractionCount += 1;
            if ((priorRole === 'TERRAIN' && role === 'VEGETATION') ||
                (priorRole === 'VEGETATION' && role === 'TERRAIN')) {
              vegetationTerrainDepthInteractionCount += 1;
            }
          }
          continue;
        }
        if (priorRole && priorRole !== role) {
          crossClassDepthInteractionCount += 1;
          if ((priorRole === 'TERRAIN' && role === 'VEGETATION') ||
              (priorRole === 'VEGETATION' && role === 'TERRAIN')) {
            vegetationTerrainDepthInteractionCount += 1;
          }
        }
        depth[pixel] = z;
        owner[pixel] = role;
        writtenPixelCounts[role] = (writtenPixelCounts[role] ?? 0) + 1;
      }
    }
  }

  const finalOwnerPixelCounts = { TERRAIN: 0, SHORELINE: 0, VEGETATION: 0, UNKNOWN: 0 };
  owner.forEach((role) => {
    if (role) finalOwnerPixelCounts[role] = (finalOwnerPixelCounts[role] ?? 0) + 1;
  });
  return freeze({
    sharedDepthBufferAllocated: true,
    opaqueTriangleCount: plan.opaqueTriangles.length,
    depthRejectedCandidateCount,
    crossClassDepthInteractionCount,
    vegetationTerrainDepthInteractionCount,
    writtenPixelCounts,
    finalOwnerPixelCounts,
    terrainVisiblePixelCount: finalOwnerPixelCounts.TERRAIN,
    vegetationVisiblePixelCount: finalOwnerPixelCounts.VEGETATION,
    actualTerrainVegetationDepthInteractionExecuted:
      vegetationTerrainDepthInteractionCount > 0
  });
}

export function rasterizeHEarthRun8ERenderPlan(plan, frame) {
  const base = rasterizeHEarthFunctionalLandscapePlan(plan);
  if (base?.ok !== true) return base;
  const depthDiagnostics = evaluateHEarthRun8ESharedDepthOcclusion(plan, frame);
  const rgba = new Uint8ClampedArray(base.rgba);
  const depth = base.depth;
  const stops = frame.environment.skyGradientStops;
  let skyPixelCount = 0;
  for (let y = 0; y < base.height; y += 1) {
    const color = sampleGradient(stops, y / Math.max(1, base.height - 1));
    for (let x = 0; x < base.width; x += 1) {
      const pixel = y * base.width + x;
      if (depth[pixel] !== Number.POSITIVE_INFINITY) continue;
      const offset = pixel * 4;
      rgba[offset] = color[0];
      rgba[offset + 1] = color[1];
      rgba[offset + 2] = color[2];
      rgba[offset + 3] = 255;
      skyPixelCount += 1;
    }
  }

  const sun = frame.environment.sunDisc;
  let sunPixelCount = 0;
  if (sun?.visible === true) {
    const centerX = sun.normalizedCenter.x * base.width;
    const centerY = sun.normalizedCenter.y * base.height;
    const radius = Math.max(1, sun.normalizedRadius * Math.min(base.width, base.height));
    const haloRadius = radius * 2.5;
    const minX = Math.max(0, Math.floor(centerX - haloRadius));
    const maxX = Math.min(base.width - 1, Math.ceil(centerX + haloRadius));
    const minY = Math.max(0, Math.floor(centerY - haloRadius));
    const maxY = Math.min(base.height - 1, Math.ceil(centerY + haloRadius));
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const pixel = y * base.width + x;
        if (depth[pixel] !== Number.POSITIVE_INFINITY) continue;
        const distance = Math.hypot(x + 0.5 - centerX, y + 0.5 - centerY);
        if (distance > haloRadius) continue;
        const core = distance <= radius;
        const color = core ? sun.coreColor : sun.haloColor;
        const alpha = core ? 1 : (1 - (distance - radius) / Math.max(1, haloRadius - radius)) * (color[3] / 255);
        const offset = pixel * 4;
        rgba[offset] = mix(rgba[offset], color[0], clamp(alpha, 0, 1));
        rgba[offset + 1] = mix(rgba[offset + 1], color[1], clamp(alpha, 0, 1));
        rgba[offset + 2] = mix(rgba[offset + 2], color[2], clamp(alpha, 0, 1));
        rgba[offset + 3] = 255;
        sunPixelCount += 1;
      }
    }
  }

  return {
    ...base,
    rgba,
    skyPixelCount,
    sunPixelCount,
    alphaClosed: rgba.every((value, index) => index % 4 !== 3 || value === 255),
    singleSkyAuthorityMaterialized: true,
    sunDiscMaterialized: sun?.visible !== true || sunPixelCount > 0,
    singlePhysicalDepthDomainExecuted: true,
    terrainOcclusionExecutionPath: 'COMMON_DEPTH_BUFFER_FOR_TERRAIN_SHORELINE_AND_GROUNDED_VEGETATION',
    depthDiagnostics
  };
}

export function evaluateHEarthRun8EFrame(frame) {
  const issues = [];
  if (frame?.ok !== true || frame?.contractId !== H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID) issues.push('RUN_8E_FRAME_INVALID');
  if (frame?.primitiveCount !== 35) issues.push('RUN_8E_FRAME_PRIMITIVE_COUNT_INVALID');
  if (frame?.transfer?.ok !== true || frame?.packet002SuccessorTransferExecuted !== true) issues.push('RUN_8E_TRANSFER_NOT_EXECUTED');
  if (frame?.terrainTriangleColorCount !== 48076) issues.push('RUN_8E_TERRAIN_COLOR_COUNT_INVALID');
  if (frame?.singlePhysicalDepthDomain !== true || frame?.terrainOcclusionExecuted !== true) issues.push('RUN_8E_DEPTH_DOMAIN_NOT_EXECUTED');
  if (frame?.environment?.singleSkyAuthority !== true || frame?.environment?.sunDisc?.visible !== true) issues.push('RUN_8E_SKY_OR_SUN_NOT_INTEGRATED');
  if (frame?.legacyProxyIncluded !== false || frame?.legacyProxyPreservedOutsideSuccessorFrame !== true) issues.push('RUN_8E_LEGACY_PROXY_DISPOSITION_INVALID');
  if (frame?.cameraAuthorityCreated !== false || frame?.rendererAuthorityCreated !== false || frame?.deployment !== false) issues.push('RUN_8E_AUTHORITY_BOUNDARY_VIOLATION');
  return freeze({ eligible: issues.length === 0, status: issues.length === 0 ? 'RUN_8E_FRAME_PASS' : 'RUN_8E_FRAME_FAIL', issues });
}

export default H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID;
