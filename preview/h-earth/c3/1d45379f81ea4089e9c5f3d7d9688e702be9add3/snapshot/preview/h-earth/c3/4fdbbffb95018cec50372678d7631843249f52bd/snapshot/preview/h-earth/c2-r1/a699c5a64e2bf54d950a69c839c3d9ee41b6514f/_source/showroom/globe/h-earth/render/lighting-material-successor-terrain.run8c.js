/**
 * H_EARTH_SUCCESSOR_TERRAIN_NORMAL_LIGHT_MATERIAL_REALIZATION_RUN_8C_v1
 * Immutable presentation projection only; no renderer, geometry, admission,
 * camera, route, or deployment authority is created.
 */
import {
  H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT
} from '../../../../h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState,
  evaluateHEarthAtmosphereStateSample
} from '../../../../h-earth-3d/environment/h-earth.atmosphere-state.js';
import {
  H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  sampleHEarthRun8CSuccessorSurfaceMaterial,
  evaluateHEarthRun8CSuccessorSurfaceMaterial
} from '../../../../h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
import {
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  constructHEarthRun8BSuccessorTerrainAndMountain
} from './geometry-successor-terrain.run8b.js';
import {
  H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
  buildHEarthAtmospherePresentation,
  evaluateHEarthAtmospherePresentation,
  applyHEarthAtmosphericDistanceToColor
} from './environment-atmosphere.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const distance3 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const luminance8 = (rgba) => rgba[0] * 0.2126 + rgba[1] * 0.7152 + rgba[2] * 0.0722;
const linearToSrgb8 = (value) => {
  const linear = clamp01(value);
  const srgb = linear <= 0.0031308 ? linear * 12.92 : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
  return Math.round(clamp01(srgb) * 255);
};
const srgb8ToLinear = (value) => {
  const srgb = clamp(value / 255, 0, 1);
  return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
};

export const H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID =
  'H_EARTH_SUCCESSOR_TERRAIN_NORMAL_LIGHT_MATERIAL_REALIZATION_RUN_8C_v1';
export const H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_SOURCE_FILE =
  '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/lighting-material-successor-terrain.run8c.js';
export const H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_PROFILE = freeze({
  contractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
  controllingInterfaceContractId: H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,
  sourceNeutralGeometryContractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  sourceSurfaceMaterialContractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  sourceAtmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sourceAtmospherePresentationContractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
  realizationModel: 'WORLD_NORMAL_DIFFUSE_AMBIENT_SLOPE_CURVATURE_WETNESS_ROUGHNESS_REFLECTANCE_AND_DISTANCE_HAZE',
  owns: {
    normalDrivenLightProjection: true,
    materialResponseProjection: true,
    immutablePresentationRecord: true,
    geometry: false,
    atmosphereTruth: false,
    intrinsicSurfaceTruth: false,
    rendererLoop: false,
    cameraAuthority: false,
    WestAdmission: false,
    Packet002Transfer: false,
    route: false,
    deployment: false
  }
});

export function projectHEarthRun8CVertexMaterialLighting({ world, normal, surfaceMaterial, atmosphereState, cameraWorld }) {
  if (!world || !normal || !cameraWorld ||
      ![world.x, world.y, world.z, normal.x, normal.y, normal.z, cameraWorld.x, cameraWorld.y, cameraWorld.z].every(finite) ||
      evaluateHEarthRun8CSuccessorSurfaceMaterial(surfaceMaterial).eligible !== true ||
      evaluateHEarthAtmosphereStateSample(atmosphereState).eligible !== true) {
    return freeze({ eligible: false, status: 'RUN_8C_VERTEX_LIGHT_MATERIAL_REJECTED', issues: ['INVALID_VERTEX_LIGHT_MATERIAL_INPUT'] });
  }
  const normalDotSun = clamp(dot(normal, atmosphereState.sunDirection), -1, 1);
  const diffuseLightFactor = clamp01(Math.max(0, normalDotSun) * atmosphereState.sunIntensity);
  const ambientLightFactor = clamp(0.15 + atmosphereState.sunIntensity * 0.33 + Math.max(0, normal.y) * 0.12, 0.14, 0.62);
  const slopeShadeFactor = clamp(0.66 + Math.max(0, normal.y) * 0.34, 0.48, 1);
  const curvatureOcclusionFactor = clamp(1 - Math.max(0, -surfaceMaterial.curvature) * 0.72, 0.72, 1);
  const wetnessResponse = clamp(1 - surfaceMaterial.wetness * 0.17, 0.79, 1);
  const roughnessResponse = clamp(1 - surfaceMaterial.roughness * 0.1, 0.88, 1);
  const reflectanceResponse = clamp01(surfaceMaterial.reflectance * (1 - surfaceMaterial.roughness) * diffuseLightFactor * (0.08 + surfaceMaterial.wetness * 0.22));
  const lightFactor = clamp((ambientLightFactor + diffuseLightFactor * 0.86) * slopeShadeFactor * curvatureOcclusionFactor * wetnessResponse * roughnessResponse, 0, 1.35);
  const base = surfaceMaterial.baseColorProfile;
  const sunLinear = {
    r: srgb8ToLinear(atmosphereState.sunColor[0]),
    g: srgb8ToLinear(atmosphereState.sunColor[1]),
    b: srgb8ToLinear(atmosphereState.sunColor[2])
  };
  const litLinear = {
    r: clamp01(base.linearR * lightFactor + sunLinear.r * reflectanceResponse),
    g: clamp01(base.linearG * lightFactor + sunLinear.g * reflectanceResponse),
    b: clamp01(base.linearB * lightFactor + sunLinear.b * reflectanceResponse)
  };
  const litRgba = [linearToSrgb8(litLinear.r), linearToSrgb8(litLinear.g), linearToSrgb8(litLinear.b), 255];
  const cameraDistance = distance3(world, cameraWorld);
  const atmospheric = applyHEarthAtmosphericDistanceToColor({ baseColor: litRgba, distance: cameraDistance, atmosphereState });
  if (atmospheric.eligible !== true) {
    return freeze({ eligible: false, status: 'RUN_8C_VERTEX_ATMOSPHERIC_APPLICATION_REJECTED', issues: atmospheric.issues });
  }
  return freeze({
    eligible: true,
    status: 'RUN_8C_VERTEX_LIGHT_MATERIAL_COMPLETE',
    world: { ...world },
    worldNormal: { ...normal },
    surfaceClass: surfaceMaterial.surfaceClass,
    materialProfileId: surfaceMaterial.materialProfileId,
    baseColorProfileId: surfaceMaterial.baseColorProfile.profileId,
    baseColorLinear: { r: base.linearR, g: base.linearG, b: base.linearB, a: base.alpha },
    litColorLinear: litLinear,
    litColorRgba: litRgba,
    finalColorRgba: atmospheric.rgba,
    diffuseLightFactor,
    ambientLightFactor,
    slopeShadeFactor,
    curvatureOcclusionFactor,
    wetnessResponse,
    roughnessResponse,
    reflectanceResponse,
    distanceHazeFactor: atmospheric.fogFactor,
    distanceDesaturationFactor: atmospheric.desaturationFactor,
    cameraDistance,
    normalDotSun,
    luminance: luminance8(atmospheric.rgba),
    sourceIdentities: {
      surfaceMaterialContractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
      atmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
      interfaceContractId: H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId
    },
    issues: []
  });
}

function summarizeVertexAttributes(attributes) {
  const classCounts = {};
  let minimumDiffuse = Infinity, maximumDiffuse = -Infinity;
  let minimumLuminance = Infinity, maximumLuminance = -Infinity;
  let minimumHaze = Infinity, maximumHaze = -Infinity, luminanceSum = 0;
  for (const attribute of attributes) {
    classCounts[attribute.surfaceClass] = (classCounts[attribute.surfaceClass] ?? 0) + 1;
    minimumDiffuse = Math.min(minimumDiffuse, attribute.diffuseLightFactor);
    maximumDiffuse = Math.max(maximumDiffuse, attribute.diffuseLightFactor);
    minimumLuminance = Math.min(minimumLuminance, attribute.luminance);
    maximumLuminance = Math.max(maximumLuminance, attribute.luminance);
    minimumHaze = Math.min(minimumHaze, attribute.distanceHazeFactor);
    maximumHaze = Math.max(maximumHaze, attribute.distanceHazeFactor);
    luminanceSum += attribute.luminance;
  }
  return freeze({
    classCounts,
    surfaceClassCount: Object.keys(classCounts).length,
    minimumDiffuse,
    maximumDiffuse,
    diffuseRange: maximumDiffuse - minimumDiffuse,
    minimumLuminance,
    maximumLuminance,
    luminanceRange: maximumLuminance - minimumLuminance,
    meanLuminance: attributes.length > 0 ? luminanceSum / attributes.length : 0,
    minimumHaze,
    maximumHaze,
    hazeRange: maximumHaze - minimumHaze
  });
}

export function buildHEarthRun8CTerrainMaterialLightingPresentation({
  timeOfDayHours = 15.25,
  cameraWorld = { x: 0, y: 26, z: 48 },
  viewportWidth = 640,
  viewportHeight = 360,
  cameraFarPlane = 768
} = {}) {
  const geometryResult = constructHEarthRun8BSuccessorTerrainAndMountain();
  const atmosphereState = sampleHEarthAtmosphereState({ timeOfDayHours, observerElevation: cameraWorld.y, viewDistance: cameraFarPlane });
  const atmospherePresentation = buildHEarthAtmospherePresentation(atmosphereState, { viewportWidth, viewportHeight, cameraFarPlane });
  const issues = [];
  if (geometryResult?.ok !== true || !geometryResult.primitive) issues.push('RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_INVALID');
  if (evaluateHEarthAtmosphereStateSample(atmosphereState).eligible !== true) issues.push('RUN_7C_ATMOSPHERE_STATE_INVALID');
  if (evaluateHEarthAtmospherePresentation(atmospherePresentation).eligible !== true) issues.push('RUN_7C_ATMOSPHERE_PRESENTATION_INVALID');
  if (!cameraWorld || ![cameraWorld.x, cameraWorld.y, cameraWorld.z].every(finite)) issues.push('CAMERA_OBSERVATION_INPUT_INVALID');
  if (issues.length > 0) return freeze({ eligible: false, status: 'RUN_8C_TERRAIN_LIGHT_MATERIAL_PRESENTATION_REJECTED', contractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID, issues });

  const primitive = geometryResult.primitive;
  const vertices = primitive.geometry.vertices;
  const normals = primitive.geometry.normals;
  const vertexAttributes = [];
  for (let index = 0; index < vertices.length; index += 1) {
    const world = vertices[index];
    const surfaceMaterial = sampleHEarthRun8CSuccessorSurfaceMaterial(world.x, world.z);
    const projected = projectHEarthRun8CVertexMaterialLighting({ world, normal: normals[index], surfaceMaterial, atmosphereState, cameraWorld });
    if (projected.eligible !== true) { issues.push(`VERTEX_LIGHT_MATERIAL_FAILED:${index}`); break; }
    vertexAttributes.push(freeze({ index, ...projected }));
  }
  if (vertexAttributes.length !== vertices.length) issues.push('VERTEX_ATTRIBUTE_COUNT_MISMATCH');
  const summary = summarizeVertexAttributes(vertexAttributes);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8C_TERRAIN_LIGHT_MATERIAL_PRESENTATION_COMPLETE' : 'RUN_8C_TERRAIN_LIGHT_MATERIAL_PRESENTATION_FAILED',
    contractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
    controllingInterfaceContractId: H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,
    sourceNeutralGeometryContractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
    sourcePrimitiveId: primitive.primitiveId,
    sourceGeometryId: primitive.geometry.geometryId,
    sourceSurfaceMaterialContractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
    sourceAtmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    sourceAtmospherePresentationContractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    cameraObservationInput: { ...cameraWorld },
    timeOfDayHours: atmosphereState.timeOfDay.hours,
    timeOfDayPhase: atmosphereState.timeOfDay.phase,
    sunDirection: { ...atmosphereState.sunDirection },
    sunElevation: atmosphereState.sunElevation,
    sunIntensity: atmosphereState.sunIntensity,
    sunDisc: atmospherePresentation.sunDisc,
    skyGradientStops: atmospherePresentation.skyGradientStops,
    horizonHaze: atmospherePresentation.horizonHaze,
    distanceFog: atmospherePresentation.distanceFog,
    vertexAttributeCount: vertexAttributes.length,
    vertexAttributes: freeze(vertexAttributes),
    summary,
    immutableSourceNeutralPrimitive: true,
    sourceNeutralPrimitiveMutated: false,
    rendererMutation: false,
    geometryMutation: false,
    WestAdmissionExecuted: false,
    packet002TransferExecuted: false,
    vegetationInstanceConstruction: false,
    publicRouteMutation: false,
    deployment: false,
    visualImprovementClaim: false,
    issues: freeze(issues)
  });
}

export function evaluateHEarthRun8CTerrainMaterialLightingPresentation(record) {
  const issues = [];
  if (record?.eligible !== true) issues.push('RUN_8C_PRESENTATION_NOT_ELIGIBLE');
  if (record?.contractId !== H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID) issues.push('RUN_8C_PRESENTATION_CONTRACT_ID_MISMATCH');
  if (record?.sourceNeutralGeometryContractId !== H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID) issues.push('RUN_8B_NEUTRAL_GEOMETRY_SOURCE_MISMATCH');
  if (!Array.isArray(record?.vertexAttributes) || record.vertexAttributes.length !== record.vertexAttributeCount || record.vertexAttributeCount <= 0) issues.push('RUN_8C_VERTEX_ATTRIBUTES_INVALID');
  if (record?.summary?.surfaceClassCount < 5) issues.push('RUN_8C_MATERIAL_CLASS_VARIATION_INSUFFICIENT');
  if (!finite(record?.summary?.diffuseRange) || (record?.sunIntensity > 0.02 && record.summary.diffuseRange <= 0.05)) issues.push('RUN_8C_NORMAL_DRIVEN_LIGHT_VARIATION_INSUFFICIENT');
  if (!finite(record?.summary?.luminanceRange) || record.summary.luminanceRange <= 5) issues.push('RUN_8C_VISIBLE_MATERIAL_RESPONSE_VARIATION_INSUFFICIENT');
  if (!finite(record?.summary?.hazeRange) || record.summary.hazeRange <= 0) issues.push('RUN_8C_DISTANCE_HAZE_VARIATION_INSUFFICIENT');
  if (record?.sourceNeutralPrimitiveMutated !== false || record?.rendererMutation !== false || record?.geometryMutation !== false || record?.WestAdmissionExecuted !== false || record?.packet002TransferExecuted !== false || record?.publicRouteMutation !== false || record?.deployment !== false || record?.visualImprovementClaim !== false) issues.push('RUN_8C_BOUNDARY_VIOLATION');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8C_TERRAIN_LIGHT_MATERIAL_PRESENTATION_PASS' : 'RUN_8C_TERRAIN_LIGHT_MATERIAL_PRESENTATION_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_PROFILE;
