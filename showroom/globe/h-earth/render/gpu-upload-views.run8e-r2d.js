/** H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1 */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews
} from './live-render-package.run8e-r2.js';
import { getHEarthCanonicalShorelineZ } from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';
import { H_EARTH_FUNCTIONAL_SHORELINE_SAND_RENDER_MATERIALS } from './geometry-shoreline.js';
import { createHEarthRun8ER2CanonicalVegetationPresentationBatch } from './live-render-package.run8e-r2.canonical.js';

// Authored X/Z units are meters. The coast itself is the immutable zero contour.
// Sample its canonical curve once; each query finds the closest point on that
// polyline. A 1 m chord limits curvature approximation without per-frame work.
const COAST_MIN_X=-7200,COAST_MAX_X=7200,COAST_STEP_METERS=1;
const coastSamples=Array.from({length:COAST_MAX_X-COAST_MIN_X+1},(_,i)=>getHEarthCanonicalShorelineZ(COAST_MIN_X+i));
export function getHEarthSignedCoastDistanceMeters(worldX,worldZ){
  if(!Number.isFinite(worldX)||!Number.isFinite(worldZ))return Number.NaN;
  const localCoast=getHEarthCanonicalShorelineZ(worldX);
  const delta=worldZ-localCoast;
  // Beyond this distance every coastal color/material transition is saturated.
  // The canonical coast varies by far less than 260 m across this domain.
  if(Math.abs(delta)>620)return delta>0?-620:620;
  const reach=Math.abs(delta)+COAST_STEP_METERS;
  const first=Math.max(0,Math.floor(worldX-reach-COAST_MIN_X));
  const last=Math.min(coastSamples.length-2,Math.ceil(worldX+reach-COAST_MIN_X));
  let best=delta*delta;
  for(let i=first;i<=last;i++){
    const ax=COAST_MIN_X+i,az=coastSamples[i],vx=COAST_STEP_METERS,vz=coastSamples[i+1]-az;
    const t=Math.min(1,Math.max(0,((worldX-ax)*vx+(worldZ-az)*vz)/(vx*vx+vz*vz)));
    const dx=worldX-ax-t*vx,dz=worldZ-az-t*vz;
    best=Math.min(best,dx*dx+dz*dz);
  }
  return delta>0?-Math.sqrt(best):Math.sqrt(best);
}
const freezeRecord = (value) => Object.freeze(value);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (a, b, value) => {
  const t = clamp01((value - a) / Math.max(Number.EPSILON, b - a));
  return t * t * (3 - 2 * t);
};
const srgb8ToLinear = (value) => {
  const srgb = clamp01(value / 255);
  return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
};
const mix3 = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t
];

export const H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1';

export const H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION = freezeRecord({
  contractId: H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
  encodingClass: 'DECIMAL_CANONICALIZATION_BEFORE_FLOAT32_TRANSPORT',
  decimalPlaces: 6,
  scale: 1000000,
  appliedBuffers: Object.freeze(['normals', 'materialParameters']),
  unchangedBuffers: Object.freeze([
    'positions',
    'materialModelCodes',
    'surfaceClassCodes',
    'primitiveIndices',
    'indices'
  ]),
  presentationRoleProjection: freezeRecord({
    sourceShorelineRoleCode: 2,
    gpuDepthColorPreservingRoleCode: 4,
    purpose: 'BYPASS_CP2_HARDCODED_TEAL_WATER_OVERRIDE',
    semanticPackageRoleMutation: false,
    materialBufferMutation: false,
    geometryMutation: false
  }),
  waterOpticalProjection: freezeRecord({
    purpose: 'RESTORE_23923_COAST_DISTANCE_OPTICS_ON_ACTIVE_WEBGL_PATH',
    coordinateLaw: 'DISTANCE_FROM_CANONICAL_COAST',
    shallowRgb: Object.freeze([58, 168, 181]),
    shelfRgb: Object.freeze([31, 116, 154]),
    deepRgb: Object.freeze([15, 57, 96]),
    projectedPrimitiveIds: Object.freeze([
      'H_EARTH_FUNCTIONAL_SHORELINE:SHALLOW_WATER',
      'H_EARTH_FUNCTIONAL_SHORELINE:NEARSHORE_WATER',
      'H_EARTH_FUNCTIONAL_SHORELINE:OPEN_WATER',
      'H_EARTH_WORLD_MANIFOLD:FAR_OCEAN_CONTINUATION'
    ]),
    sourcePackageMutated: false,
    geometryMutation: false
  }),
  maximumPermittedAbsoluteAdjustment: 9.5367431640625e-7,
  sourceAuthorityMutation: false,
  packageSourceMutation: false,
  materialRetuning: false,
  normalRetuning: false,
  transportEncodingOnly: true
});

const WATER_PRIMITIVE_IDS = new Set(
  H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION.waterOpticalProjection.projectedPrimitiveIds
);
const PLANET_RADIUS = 420000;
const SHALLOW = Object.freeze([58, 168, 181]);
const SHELF = Object.freeze([31, 116, 154]);
const DEEP = Object.freeze([15, 57, 96]);

function canonicalDecimal(value) {
  if (!finite(value)) throw new TypeError('R2D_GPU_CANONICALIZATION_NONFINITE');
  const rounded = Number(value.toFixed(H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION.decimalPlaces));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function canonicalFloat32(source, bufferName) {
  const result = new Float32Array(source.length);
  let adjustedElementCount = 0;
  let maximumAbsoluteAdjustment = 0;
  for (let index = 0; index < source.length; index += 1) {
    const before = source[index];
    const canonical = canonicalDecimal(before);
    const after = Math.fround(canonical);
    result[index] = after;
    const adjustment = Math.abs(after - before);
    if (adjustment > 0) adjustedElementCount += 1;
    if (adjustment > maximumAbsoluteAdjustment) maximumAbsoluteAdjustment = adjustment;
  }
  if (maximumAbsoluteAdjustment >
      H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION.maximumPermittedAbsoluteAdjustment) {
    throw new RangeError(
      `R2D_GPU_CANONICALIZATION_ADJUSTMENT_EXCEEDED:${bufferName}:${maximumAbsoluteAdjustment}`
    );
  }
  return {
    view: result,
    receipt: freezeRecord({
      bufferName,
      elementCount: result.length,
      adjustedElementCount,
      maximumAbsoluteAdjustment,
      decimalPlaces: H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION.decimalPlaces
    })
  };
}

function projectGpuRoleCodes(source) {
  const result = new Uint8Array(source.length);
  let remappedElementCount = 0;
  for (let index = 0; index < source.length; index += 1) {
    const before = Number(source[index]);
    const after = before === 2 ? 4 : before;
    result[index] = after;
    if (after !== before) remappedElementCount += 1;
  }
  return {
    view: result,
    receipt: freezeRecord({
      sourceShorelineRoleCode: 2,
      gpuDepthColorPreservingRoleCode: 4,
      remappedElementCount,
      semanticPackageRoleMutation: false,
      materialBufferMutation: false
    })
  };
}

function invertSphericalPresentationPoint(x, y, z) {
  const horizontal = Math.hypot(x, z);
  if (horizontal <= Number.EPSILON) return { x: 0, z: 0 };
  const angularDistance = Math.atan2(horizontal, y + PLANET_RADIUS);
  const radialDistance = angularDistance * PLANET_RADIUS;
  const scale = radialDistance / horizontal;
  return { x: x * scale, z: z * scale };
}

function recoveredWaterRgb(worldX, worldZ) {
  const distance = Math.max(0, -getHEarthSignedCoastDistanceMeters(worldX, worldZ));
  const shallowToShelf = smoothstep(6, 86, distance);
  const shelfToDeep = smoothstep(54, 360, distance);
  return mix3(mix3(SHALLOW, SHELF, shallowToShelf), DEEP, shelfToDeep);
}

function projectRecoveredWaterBaseColors(rawViews, packageRecord) {
  const result = new Float32Array(rawViews.baseColorsLinear);
  let projectedVertexCount = 0;
  const projectedPrimitiveIds = [];
  for (const span of packageRecord?.primitiveSpans ?? []) {
    if (!WATER_PRIMITIVE_IDS.has(span?.primitiveId)) continue;
    projectedPrimitiveIds.push(span.primitiveId);
    const start = Number(span.vertexStart) || 0;
    const count = Number(span.vertexCount) || 0;
    for (let local = 0; local < count; local += 1) {
      const vertexIndex = start + local;
      const p = vertexIndex * 3;
      const c = vertexIndex * 4;
      const localWorld = invertSphericalPresentationPoint(
        rawViews.positions[p],
        rawViews.positions[p + 1],
        rawViews.positions[p + 2]
      );
      const rgb = recoveredWaterRgb(localWorld.x, localWorld.z);
      result[c] = srgb8ToLinear(rgb[0]);
      result[c + 1] = srgb8ToLinear(rgb[1]);
      result[c + 2] = srgb8ToLinear(rgb[2]);
      result[c + 3] = 1;
      projectedVertexCount += 1;
    }
  }
  return {
    view: result,
    receipt: freezeRecord({
      projectedVertexCount,
      projectedPrimitiveIds: Object.freeze(projectedPrimitiveIds),
      coordinateLaw: 'DISTANCE_FROM_CANONICAL_COAST',
      sourcePackageMutated: false,
      activeWebglBaseColorProjection: true
    })
  };
}

function projectShorelineSandColors(waterProjectedColors, packageRecord){
  const result=new Float32Array(waterProjectedColors);
  const projectedPrimitiveIds=[];
  let projectedVertexCount=0;
  for(const span of packageRecord?.primitiveSpans??[]){
    const bandId=String(span?.primitiveId??'').split(':').at(-1);
    const material=H_EARTH_FUNCTIONAL_SHORELINE_SAND_RENDER_MATERIALS[bandId];
    if(!material||span?.primitiveId!==`H_EARTH_FUNCTIONAL_SHORELINE:${bandId}`)continue;
    projectedPrimitiveIds.push(span.primitiveId);
    const start=Number(span.vertexStart)||0,count=Number(span.vertexCount)||0;
    for(let local=0;local<count;local++){
      const c=(start+local)*4;
      result[c]=srgb8ToLinear(material.rgba[0]);
      result[c+1]=srgb8ToLinear(material.rgba[1]);
      result[c+2]=srgb8ToLinear(material.rgba[2]);
      result[c+3]=1;
      projectedVertexCount++;
    }
  }
  if(projectedPrimitiveIds.length!==3)throw new Error('SHORELINE_SAND_GPU_SPAN_COUNT_INVALID');
  return {view:result,receipt:freezeRecord({projectedVertexCount,projectedPrimitiveIds:Object.freeze(projectedPrimitiveIds),sourcePackageMutated:false,activeWebglBaseColorProjection:true})};
}

export function createHEarthRun8ER2DCanonicalGPUUploadViews(
  packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage()
) {
  const rawViews = createHEarthRun8ER2GPUBufferViews(packageRecord);
  const canonicalNormals = canonicalFloat32(rawViews.normals, 'normals');
  const canonicalMaterialParameters = canonicalFloat32(
    rawViews.materialParameters,
    'materialParameters'
  );
  const projectedRoleCodes = projectGpuRoleCodes(rawViews.roleCodes);
  const projectedWaterColors = projectRecoveredWaterBaseColors(rawViews, packageRecord);
  const projectedSandColors = projectShorelineSandColors(projectedWaterColors.view, packageRecord);

  return freezeRecord({
    positions: new Float32Array(rawViews.positions),
    normals: canonicalNormals.view,
    baseColorsLinear: projectedSandColors.view,
    materialParameters: canonicalMaterialParameters.view,
    materialModelCodes: new Uint8Array(rawViews.materialModelCodes),
    surfaceClassCodes: new Uint8Array(rawViews.surfaceClassCodes),
    primitiveIndices: new Uint16Array(rawViews.primitiveIndices),
    roleCodes: projectedRoleCodes.view,
    indices: new Uint32Array(rawViews.indices),
    canonicalizationReceipt: freezeRecord({
      contractId: H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
      packageIdentityAtSource: packageRecord.packageIdentity,
      packageContentDigestAtSource: packageRecord.contentDigest,
      normalBuffer: canonicalNormals.receipt,
      materialParameterBuffer: canonicalMaterialParameters.receipt,
      gpuRoleProjection: projectedRoleCodes.receipt,
      gpuWaterOpticalProjection: projectedWaterColors.receipt,
      gpuShorelineSandProjection: projectedSandColors.receipt,
      sourcePackageMutated: false,
      transportEncodingOnly: true
    }),
    copyOnRequest: true,
    deterministicTransportEncoding: true,
    packageIdentity: packageRecord.packageIdentity
  });
}

export function evaluateHEarthRun8ER2DCanonicalGPUUploadViews(views) {
  const issues = [];
  const expected = {
    positions: Float32Array,
    normals: Float32Array,
    baseColorsLinear: Float32Array,
    materialParameters: Float32Array,
    materialModelCodes: Uint8Array,
    surfaceClassCodes: Uint8Array,
    primitiveIndices: Uint16Array,
    roleCodes: Uint8Array,
    indices: Uint32Array
  };
  for (const [key, Constructor] of Object.entries(expected)) {
    if (!(views?.[key] instanceof Constructor)) issues.push(`R2D_GPU_VIEW_TYPE_INVALID:${key}`);
  }
  if (views?.canonicalizationReceipt?.contractId !==
      H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID) {
    issues.push('R2D_GPU_CANONICALIZATION_RECEIPT_MISSING');
  }
  if ((views?.canonicalizationReceipt?.gpuWaterOpticalProjection?.projectedVertexCount ?? 0) <= 0) {
    issues.push('R2D_GPU_WATER_OPTICAL_PROJECTION_MISSING');
  }
  if (views?.deterministicTransportEncoding !== true) {
    issues.push('R2D_GPU_TRANSPORT_ENCODING_NOT_DETERMINISTIC');
  }
  return freezeRecord({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8E_R2D_CANONICAL_GPU_UPLOAD_VIEWS_PASS'
      : 'RUN_8E_R2D_CANONICAL_GPU_UPLOAD_VIEWS_FAIL',
    issues: Object.freeze(issues)
  });
}

export function createHEarthRun8ER2DVegetationBatchGPUViews(batchId){const batch=createHEarthRun8ER2CanonicalVegetationPresentationBatch(batchId);const positions=[],normals=[],baseColorsLinear=[],materialParameters=[],materialModelCodes=[],surfaceClassCodes=[],primitiveIndices=[],roleCodes=[],indices=[];let vertexOffset=0,primitiveIndex=0;for(const primitive of batch.primitives){const vertices=primitive.geometry?.vertices??[],localIndices=primitive.geometry?.indices??[],supplied=primitive.geometry?.normals??[];for(let i=0;i<vertices.length;i++){const v=vertices[i],n=supplied[i]??{x:0,y:1,z:0};positions.push(v.x,v.y,v.z);normals.push(n.x,n.y,n.z);const intent=String(primitive?.materialHint?.materialIntent??'');const rgb=intent.includes('TRUNK')||intent.includes('WOODY')?[89,63,39]:intent.includes('CONIFER')?[38,73,48]:intent.includes('SHRUB')?[52,94,52]:[78,126,65];baseColorsLinear.push(srgb8ToLinear(rgb[0]),srgb8ToLinear(rgb[1]),srgb8ToLinear(rgb[2]),1);materialParameters.push(0,0,0,0);materialModelCodes.push(0);surfaceClassCodes.push(255);primitiveIndices.push(primitiveIndex);roleCodes.push(3);}for(const index of localIndices)indices.push(vertexOffset+index);vertexOffset+=vertices.length;primitiveIndex++;}return freezeRecord({batchId,instanceCount:batch.instanceCount,placementIds:batch.placementIds,positions:new Float32Array(positions),normals:canonicalFloat32(new Float32Array(normals),'normals').view,baseColorsLinear:new Float32Array(baseColorsLinear),materialParameters:new Float32Array(materialParameters),materialModelCodes:new Uint8Array(materialModelCodes),surfaceClassCodes:new Uint8Array(surfaceClassCodes),primitiveIndices:new Uint16Array(primitiveIndices),roleCodes:new Uint8Array(roleCodes),indices:new Uint32Array(indices),deterministicTransportEncoding:true,sourceWorldTruthMutated:false});}
export default createHEarthRun8ER2DCanonicalGPUUploadViews;
