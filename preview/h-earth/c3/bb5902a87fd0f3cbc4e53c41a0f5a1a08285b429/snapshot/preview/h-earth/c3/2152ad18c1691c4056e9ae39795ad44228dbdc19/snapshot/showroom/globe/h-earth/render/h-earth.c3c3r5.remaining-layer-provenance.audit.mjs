import { getHEarthOW01CanonicalLiveRenderPackageOccurrence } from './live-render-package.run8e-r2.canonical.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from './gpu-upload-views.run8e-r2d.js';
import { getHEarthRun8ER3ALiveRendererInterface, buildHEarthRun8ER3AWaypointPacket } from './live-renderer-contract.run8e-r3a.js';
import { previewHEarthFunctionalLandscape } from './landscape-preview.js';
import { constructHEarthRun8BSuccessorTerrainAndMountain } from './geometry-successor-terrain.run8b.js';
import { H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE, sampleHEarthRun8CSuccessorSurfaceMaterial } from '../../../../h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
import { H_EARTH_ATMOSPHERE_STATE } from '../../../../h-earth-3d/environment/h-earth.atmosphere-state.js';
import { getHEarthPlanetRelativeUp, H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID } from './planetary-world-frame.js';

const fail = (code, detail = '') => { throw new Error(`${code}${detail ? `:${detail}` : ''}`); };
const range = (values) => Math.max(...values) - Math.min(...values);
const approx = (a, b, epsilon = 1e-6) => Math.abs(a - b) <= epsilon;

const packageRecord = getHEarthOW01CanonicalLiveRenderPackageOccurrence();
if (packageRecord?.eligible !== true) fail('D5_LIVE_PACKAGE_INVALID');
const terrainSpans = packageRecord.primitiveSpans.filter((span) => span.role === 'TERRAIN');
if (terrainSpans.length !== 1) fail('D5_TERRAIN_SPAN_COUNT', terrainSpans.length);
const terrainSpan = terrainSpans[0];
const terrainSource = constructHEarthRun8BSuccessorTerrainAndMountain();
if (terrainSource?.ok !== true || terrainSpan.primitiveId !== terrainSource.primitive.primitiveId) {
  fail('D5_LIVE_TERRAIN_SOURCE_MISMATCH');
}
const terrainColorValues = [];
const terrainAlphaValues = [];
for (let index = terrainSpan.vertexStart; index < terrainSpan.vertexStart + terrainSpan.vertexCount; index += 1) {
  const offset = index * 4;
  terrainColorValues.push(
    packageRecord.buffers.baseColorsLinear[offset],
    packageRecord.buffers.baseColorsLinear[offset + 1],
    packageRecord.buffers.baseColorsLinear[offset + 2]
  );
  terrainAlphaValues.push(packageRecord.buffers.baseColorsLinear[offset + 3]);
}
if (!(range(terrainColorValues) > 0.01)) fail('D5_TERRAIN_COLOR_VARIATION_COLLAPSED');
if (terrainAlphaValues.some((alpha) => !approx(alpha, 1, 1e-5))) fail('D5_STRUCTURAL_TERRAIN_NOT_OPAQUE');
const sampleA = sampleHEarthRun8CSuccessorSurfaceMaterial(-120, -120);
const sampleB = sampleHEarthRun8CSuccessorSurfaceMaterial(120, -200);
if (sampleA?.valid !== true || sampleB?.valid !== true) fail('D5_RUN8C_SAMPLE_INVALID');
if (sampleA.colorCompositionModel !== 'OPAQUE_STRUCTURAL_TERRAIN_PLUS_TRANSLUCENT_SPATIALLY_VARIANT_ENVIRONMENTAL_TINT') fail('D5_LAYERED_COLOR_MODEL_MISSING');
if (sampleA.environmentalTint?.alpha === sampleB.environmentalTint?.alpha && sampleA.environmentalTint?.rgba?.join(',') === sampleB.environmentalTint?.rgba?.join(',')) fail('D5_SPATIAL_TINT_VARIATION_MISSING');

const gpu = createHEarthRun8ER2DCanonicalGPUUploadViews(packageRecord);
for (const [name, source] of Object.entries(packageRecord.buffers)) {
  if (!(name in gpu)) continue;
  if (gpu[name].length !== source.length) fail('D6_GPU_LENGTH_MISMATCH', name);
}
if (gpu.deterministicTransportEncoding !== true) fail('D6_GPU_TRANSPORT_NOT_DETERMINISTIC');
if (!(range(Array.from(gpu.baseColorsLinear)) > 0.01)) fail('D6_GPU_COLOR_VARIATION_COLLAPSED');
if (!(range(Array.from(gpu.normals)) > 0.01)) fail('D6_GPU_NORMAL_VARIATION_COLLAPSED');

const renderer = getHEarthRun8ER3ALiveRendererInterface();
for (const required of ['aPosition','aNormal','aBaseColorLinear','aMaterialParameters','aRoleCode']) {
  if (!renderer.attributeLayout.some((entry) => entry.name === required)) fail('D7_RENDERER_ATTRIBUTE_MISSING', required);
}
if (!renderer.frameUniformNames.includes('uSunDirection') || !renderer.frameUniformNames.includes('uGroundHazeColor')) fail('D7_D8_RENDERER_UNIFORMS_MISSING');

if (!(H_EARTH_ATMOSPHERE_STATE.fogProfile.fogStartDistance >= 600)) fail('D8_NEAR_FIELD_FOG_TOO_AGGRESSIVE');
if (!(H_EARTH_ATMOSPHERE_STATE.fogProfile.maximumFogFactor < 1)) fail('D8_FOG_FULL_OCCLUSION_ALLOWED');

const packet = buildHEarthRun8ER3AWaypointPacket('COAST', { width: 640, height: 360, pixelRatio: 1 }, 1);
const expectedUp = getHEarthPlanetRelativeUp(packet.camera.position);
const cameraUpMatchesPlanet = approx(packet.camera.up.x, expectedUp.x, 1e-6) && approx(packet.camera.up.y, expectedUp.y, 1e-6) && approx(packet.camera.up.z, expectedUp.z, 1e-6);

const preview = previewHEarthFunctionalLandscape();
const distantIds = new Set(preview.componentResults.distantContext.primitives.map((primitive) => primitive.primitiveId));
const liveIds = new Set(packageRecord.primitiveIds);
const distantLiveIds = [...distantIds].filter((id) => liveIds.has(id));

const report = Object.freeze({
  contractId: 'H_EARTH_C3C3R5_REMAINING_LAYER_PROVENANCE_AUDIT_v1',
  result: cameraUpMatchesPlanet && distantLiveIds.length > 0 ? 'PASS_CLOSED' : 'REPAIR_REQUIRED',
  D5: {
    liveTerrainPrimitiveId: terrainSpan.primitiveId,
    expectedTerrainPrimitiveId: terrainSource.primitive.primitiveId,
    terrainColorVariation: range(terrainColorValues),
    structuralTerrainOpaque: terrainAlphaValues.every((alpha) => approx(alpha, 1, 1e-5)),
    layeredColorModel: sampleA.colorCompositionModel,
    run8CMaterialContractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE.contractId
  },
  D6: {
    deterministicGpuTransport: gpu.deterministicTransportEncoding,
    normalVariation: range(Array.from(gpu.normals)),
    colorVariation: range(Array.from(gpu.baseColorsLinear))
  },
  D7: {
    normalBufferConsumed: renderer.attributeLayout.some((entry) => entry.name === 'aNormal'),
    baseColorConsumed: renderer.attributeLayout.some((entry) => entry.name === 'aBaseColorLinear'),
    materialParametersConsumed: renderer.attributeLayout.some((entry) => entry.name === 'aMaterialParameters')
  },
  D8: {
    fogStartDistance: H_EARTH_ATMOSPHERE_STATE.fogProfile.fogStartDistance,
    maximumFogFactor: H_EARTH_ATMOSPHERE_STATE.fogProfile.maximumFogFactor,
    viewportFixedPlanetaryHorizonProhibited: true
  },
  D9: {
    cameraUp: packet.camera.up,
    expectedPlanetRelativeUp: expectedUp,
    cameraUpMatchesPlanet,
    planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID
  },
  D10: {
    previewDistantPrimitiveCount: distantIds.size,
    liveDistantPrimitiveCount: distantLiveIds.length,
    liveDistantPrimitiveIds: distantLiveIds,
    distantContextInCanonicalLiveDrawSet: distantLiveIds.length > 0
  },
  blockingFindings: [
    ...(!cameraUpMatchesPlanet ? ['D9_CANONICAL_LIVE_CAMERA_DOES_NOT_CONSUME_PLANET_RELATIVE_UP'] : []),
    ...(distantLiveIds.length === 0 ? ['D10_DISTANT_PLANETARY_CONTINUATION_EXCLUDED_FROM_CANONICAL_LIVE_PACKAGE'] : [])
  ]
});

console.log(JSON.stringify(report, null, 2));
if (report.result !== 'PASS_CLOSED') process.exitCode = 2;
