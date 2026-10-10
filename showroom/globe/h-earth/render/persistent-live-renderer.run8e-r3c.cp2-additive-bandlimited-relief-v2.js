import { FOUR_TREE_COMPACT_CONTRACT, createFourTreeCompactGpuBuffers, createFourTreeCompactResidency, bindFourTreeCompactReconstructionUniforms, bindFourTreeCompactMatrix } from './compact-four-tree-foliage.v1.js';
import { H_EARTH_WOODLAND_CLEARING_BOUNDS, H_EARTH_WOODLAND_CLEARING_ASSETS } from './woodland-clearing-trial.js';
import { buildHEarthGlobalGroundCover, selectHEarthGlobalGroundCoverDraws } from './landscape-groundcover.global-v1.js';
// Observation-only synchronous spans; the operation and its exceptions are unchanged.
const startupMeasure=(name,operation)=>globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.measure?globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS.measure(name,operation):operation();
import { sampleHEarthRun8BSuccessorTerrainField } from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
import { regionToHEarthPlanetPoint, H_EARTH_PLANETARY_WORLD_FRAME } from './planetary-world-frame.js';
/** H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1 */
import { getHEarthRun8ER2CanonicalLiveRenderPackage, prepareHEarthRun8ER2CanonicalLiveRenderPackage, getHEarthRun8ER2CanonicalPreparationTiming } from './live-render-package.run8e-r2.canonical.js?cb=meadow-distribution-20261006';
import { H_EARTH_RUN_8E_R2_CURRENT_OCCURRENCE_ID, getHEarthRun8ER2VegetationWorldTruthPlan, createHEarthRun8ER2VegetationPresentationBatch, createHEarthRun8ER2VegetationPresentationBatchAsync, prepareHEarthRun8ER2VegetationWorldTruthPlan, getHEarthRun8ER2ImmutableLiveRenderPackage, H_EARTH_GEN2521_QUALIFIED_VEGETATION_MANIFEST_IDENTITY } from './live-render-package.run8e-r2.js?cb=meadow-distribution-20261006';
import { createHEarthRun8ER2DCanonicalGPUUploadViews, getHEarthSignedCoastDistanceMeters } from './gpu-upload-views.run8e-r2d.js?cb=meadow-distribution-20261006';
import { getHEarthRun8ER3ALiveRendererInterface } from './live-renderer-contract.run8e-r3a.js?cb=meadow-distribution-20261006';
// SHORELINE_SOIL_BEGIN import
import { buildHEarthOasisGrassSoilCoverage, prepareHEarthOasisFoliagePresentation } from './grass-lowland-trial.js?cb=meadow-distribution-20261006';
// SHORELINE_SOIL_END import

// The CPU contour is derived from uploaded Float32 triangle planes in world x/z.
// The GPU attribute is a sampled, linearly interpolated approximation, not an
// exact fragment contact test. Distances saturate at 64 m (sand ends at 38 m).
function* createExposedWaterContactFieldSteps(views, spans, patch = null) {
  const started = performance.now(), limit = 64, eps = 1e-8;
  const stats = { coordinateSpace: 'UPLOADED_WORLD_XZ_METERS', saturationMeters: limit,
    interpolation: 'PER_VERTEX_LINEAR_APPROXIMATION', terrainTriangles: 0,
    oceanTriangles: 0, overlapTests: 0, contactSegments: 0, maximumPlaneResidualMeters: 0 };
  const bounds = points => [Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];
  const overlap = (a,b) => a[0]<=b[2]+eps && a[2]>=b[0]-eps && a[1]<=b[3]+eps && a[3]>=b[1]-eps;
  const cross = (a,b,p) => (b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
  const mix = (a,b,t) => [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  function tree(items) {
    if (!items.length) return null;
    const box=[Math.min(...items.map(t=>t.box[0])),Math.min(...items.map(t=>t.box[1])),Math.max(...items.map(t=>t.box[2])),Math.max(...items.map(t=>t.box[3]))];
    if(items.length<=12)return {box,items};
    const axis=box[2]-box[0]>=box[3]-box[1]?0:1;
    items.sort((a,b)=>(a.box[axis]+a.box[axis+2])-(b.box[axis]+b.box[axis+2]));
    const mid=items.length>>1;return {box,left:tree(items.slice(0,mid)),right:tree(items.slice(mid))};
  }
  function query(node,box,out=[]) {
    if(!node||!overlap(node.box,box))return out;
    if(node.items){for(const t of node.items)if(overlap(t.box,box))out.push(t);}
    else {query(node.left,box,out);query(node.right,box,out);}return out;
  }
  function* triangles(positions,indices,start,count,owner) {
    const out=[];
    for(let i=start;i<start+count;i+=3){
      const ids=[indices[i],indices[i+1],indices[i+2]];
      const p=ids.map(id=>[positions[id*3],positions[id*3+2],positions[id*3+1]]);
      const den=cross(p[0],p[1],p[2]);
      if(Math.abs(den)<eps)throw new Error('R3C_CONTACT_DEGENERATE_PROJECTED_TRIANGLE');
      const dx=((p[1][2]-p[0][2])*(p[2][1]-p[0][1])-(p[2][2]-p[0][2])*(p[1][1]-p[0][1]))/den;
      const dz=((p[1][0]-p[0][0])*(p[2][2]-p[0][2])-(p[2][0]-p[0][0])*(p[1][2]-p[0][2]))/den;
      out.push({ids,p,box:bounds(p),owner,den,height:q=>p[0][2]+dx*(q[0]-p[0][0])+dz*(q[1]-p[0][1])});
      if((i-start+3)%3072===0||i+3>=start+count)yield {phase:'CONTACT_TRIANGLES',completed:Math.min(i+3-start,count),total:count,unit:'indices'};
    }return out;
  }
  function contains(t,p) {const s=Math.sign(t.den);return t.p.every((a,i)=>s*cross(a,t.p[(i+1)%3],p)>=-eps);}
  function clip(poly,t) {
    const s=Math.sign(t.den);
    for(let i=0;i<3&&poly.length;i++){
      const a=t.p[i],b=t.p[(i+1)%3],next=[];
      for(let j=0;j<poly.length;j++){
        const p=poly[j],q=poly[(j+1)%poly.length],dp=s*cross(a,b,p),dq=s*cross(a,b,q);
        if(dp>=-eps)next.push(p);
        if((dp>eps&&dq<-eps)||(dp<-eps&&dq>eps))next.push(mix(p,q,dp/(dp-dq)));
      }poly=next;
    }return poly;
  }
  const terrain=[],ocean=[];
  for(const span of spans){
    if(span.role==='TERRAIN')terrain.push(...(yield* triangles(views.positions,views.indices,span.indexStart,span.indexCount,'package')));
    if(span.materialIntent==='ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON')ocean.push(...(yield* triangles(views.positions,views.indices,span.indexStart,span.indexCount,'ocean')));
  }
  if(!terrain.length||!ocean.length)throw new Error('R3C_CONTACT_SOURCE_MISSING');
  const packageTree=tree(terrain.slice());
  const patchTriangles=patch?(yield* triangles(patch.positions,patch.indices,0,patch.indices.length,'patch')):[];
  const patchTree=tree(patchTriangles.slice()),waterTree=tree(ocean.slice());
  const rectangle=patch?[patch.x-64+.04,patch.z-64+.04,patch.x+64-.04,patch.z+64-.04]:null;
  const inRectangle=p=>rectangle&&p[0]>rectangle[0]&&p[0]<rectangle[2]&&p[1]>rectangle[1]&&p[1]<rectangle[3];
  function exposedPieces(a,b,t,w) {
    const cuts=[0,1],box=bounds([a,b]);
    const other=query(t.owner==='package'?patchTree:packageTree,box);
    const add=v=>{if(v>eps&&v<1-eps)cuts.push(v);};
    if(rectangle)for(let axis=0;axis<2;axis++)for(const edge of [rectangle[axis],rectangle[axis+2]]){
      if(Math.abs(b[axis]-a[axis])>eps)add((edge-a[axis])/(b[axis]-a[axis]));
    }
    for(const o of other){
      for(let i=0;i<3;i++){const d0=cross(o.p[i],o.p[(i+1)%3],a),d1=cross(o.p[i],o.p[(i+1)%3],b);if(Math.abs(d0-d1)>eps)add(d0/(d0-d1));}
      const d0=o.height(a)-w.height(a),d1=o.height(b)-w.height(b);if(Math.abs(d0-d1)>eps)add(d0/(d0-d1));
    }
    cuts.sort((a,b)=>a-b);const pieces=[];
    for(let i=1;i<cuts.length;i++){
      if(cuts[i]-cuts[i-1]<eps)continue;
      const mid=mix(a,b,(cuts[i-1]+cuts[i])/2);
      if(t.owner==='package'&&inRectangle(mid))continue;
      if(other.some(o=>!(o.owner==='package'&&inRectangle(mid))&&contains(o,mid)&&o.height(mid)>w.height(mid)+eps))continue;
      pieces.push([mix(a,b,cuts[i-1]),mix(a,b,cuts[i])]);
    }return pieces;
  }
  const segments=[],seen=new Set(),contactTriangles=[...terrain,...patchTriangles];
  for(let triangleIndex=0;triangleIndex<contactTriangles.length;triangleIndex++){
    const t=contactTriangles[triangleIndex];
    for(const w of query(waterTree,t.box)){
    stats.overlapTests++;
    const poly=clip(t.p.map(p=>p.slice(0,2)),w);if(poly.length<2)continue;
    const heights=poly.map(p=>t.height(p)-w.height(p));
    if(heights.every(h=>Math.abs(h)<eps))throw new Error('R3C_CONTACT_COPLANAR_OVERLAP');
    const hits=[];
    for(let i=0;i<poly.length;i++){
      const j=(i+1)%poly.length,da=heights[i],db=heights[j];
      if(Math.abs(da)<eps)hits.push(poly[i]);
      if(da*db<0)hits.push(mix(poly[i],poly[j],da/(da-db)));
    }
    let pair=null,length2=eps*eps;
    for(const a of hits)for(const b of hits){const d=(a[0]-b[0])**2+(a[1]-b[1])**2;if(d>length2){length2=d;pair=[a,b];}}
    if(!pair)continue;
    for(const [a,b] of exposedPieces(...pair,t,w)){
      const key=[a,b].map(p=>p.map(v=>v.toFixed(7)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);
      stats.maximumPlaneResidualMeters=Math.max(stats.maximumPlaneResidualMeters,Math.abs(t.height(a)-w.height(a)),Math.abs(t.height(b)-w.height(b)));
      segments.push({a,b,box:bounds([a,b]),triangle:t});
    }
    }
    if(triangleIndex%256===255||triangleIndex===contactTriangles.length-1)yield {phase:'CONTACT_INTERSECTIONS',completed:triangleIndex+1,total:contactTriangles.length,unit:'triangles'};
  }
  const segmentTree=tree(segments.slice());
  function* sample(positions,ids) {
    const distances=new Float32Array(positions.length/3);distances.fill(limit);
    let completed=0;for(const id of ids){
      const p=[positions[id*3],positions[id*3+2]],y=positions[id*3+1];let d2=limit*limit;
      for(const s of query(segmentTree,[p[0]-limit,p[1]-limit,p[0]+limit,p[1]+limit])){
        const dx=s.b[0]-s.a[0],dz=s.b[1]-s.a[1],den=dx*dx+dz*dz;
        const u=Math.max(0,Math.min(1,((p[0]-s.a[0])*dx+(p[1]-s.a[1])*dz)/den));
        d2=Math.min(d2,(p[0]-s.a[0]-u*dx)**2+(p[1]-s.a[1]-u*dz)**2);
      }
      const wet=query(waterTree,[p[0],p[1],p[0],p[1]]).some(w=>contains(w,p)&&y<w.height(p));
      distances[id]=(wet?-1:1)*Math.sqrt(d2);
      completed++;if(completed%4096===0||completed===ids.size)yield {phase:'CONTACT_VERTEX_SAMPLES',completed,total:ids.size,unit:'vertices'};
    }return distances;
  }
  const packageIds=new Set(terrain.flatMap(t=>t.ids));
  const packageDistances=yield* sample(views.positions,packageIds);
  const patchDistances=patch?yield* sample(patch.positions,new Set(patchTriangles.flatMap(t=>t.ids))):null;
  let interpolationResidual=0,missedTriangles=new Set();
  for(let residualIndex=0;residualIndex<segments.length;residualIndex++){
    const s=segments[residualIndex];
    const t=s.triangle,d=t.owner==='patch'?patchDistances:packageDistances,v=t.ids.map(i=>d[i]);
    if(v.every(x=>x>0)||v.every(x=>x<0))missedTriangles.add(t);
    for(const p of [s.a,s.b,mix(s.a,s.b,.5)]){
      const wa=cross(t.p[1],t.p[2],p)/t.den,wb=cross(t.p[2],t.p[0],p)/t.den;
      interpolationResidual=Math.max(interpolationResidual,Math.abs(wa*v[0]+wb*v[1]+(1-wa-wb)*v[2]));
    }
    if(residualIndex%256===255||residualIndex===segments.length-1)yield {phase:'CONTACT_RESIDUALS',completed:residualIndex+1,total:segments.length,unit:'segments'};
  }
  Object.assign(stats,{terrainTriangles:terrain.length,patchTriangles:patchTriangles.length,oceanTriangles:ocean.length,contactSegments:segments.length,
    packageVertices:packageIds.size,patchVertices:patchDistances?.length??0,
    maximumSampledZeroContourAttributeResidualMeters:interpolationResidual,contactTrianglesWithoutVertexSignChange:missedTriangles.size,
    initializationMilliseconds:performance.now()-started});
  return {packageDistances,patchDistances,stats};
}


async function yieldToBrowserPaint(){await new Promise(resolve=>{if(typeof globalThis.requestAnimationFrame==='function')globalThis.requestAnimationFrame(()=>resolve());else globalThis.setTimeout(resolve,0);});}
function createExposedWaterContactField(views,spans,patch=null){const iterator=createExposedWaterContactFieldSteps(views,spans,patch);let step;do{step=iterator.next();}while(!step.done);return step.value;}
async function createExposedWaterContactFieldAsync(views,spans,patch=null,options={}){
  if(patch&&!patch.positions&&(patch.onProgress||patch.yieldControl)){options=patch;patch=null;}
  const {onProgress=()=>{},yieldControl=yieldToBrowserPaint,startProgress=34}=options;
  const progressCallback=onProgress;
  const iterator=createExposedWaterContactFieldSteps(views,spans,patch);let step,lastStartupPercent=startProgress;
  do{step=iterator.next();if(!step.done){const {phase,completed,total,unit}=step.value;const fraction=total?completed/total:1;const low=phase==='CONTACT_TRIANGLES'?startProgress:phase==='CONTACT_INTERSECTIONS'?startProgress+1.5:phase==='CONTACT_VERTEX_SAMPLES'?startProgress+3:startProgress+4.2;const high=phase==='CONTACT_TRIANGLES'?startProgress+1.5:phase==='CONTACT_INTERSECTIONS'?startProgress+3:phase==='CONTACT_VERTEX_SAMPLES'?startProgress+4.2:startProgress+4.5;const progress=Math.max(lastStartupPercent,low+(high-low)*fraction);lastStartupPercent=progress;const label=phase==='CONTACT_TRIANGLES'?'Preparing terrain contact geometry':phase==='CONTACT_INTERSECTIONS'?'Finding exposed shoreline contacts':phase==='CONTACT_RESIDUALS'?'Checking contact field accuracy':'Sampling coast vertices';progressCallback(Object.freeze({phase,completed,total,unit,progress,status:label}));await yieldControl();}}while(!step.done);
  onProgress(Object.freeze({phase:'CONTACT_FIELD_COMPLETE',completed:1,total:1,unit:'fields',progress:39.5,status:'Terrain contact field ready'}));return step.value;
}

export const H_EARTH_RUN_8E_R3C_RENDERER_ID =
  'H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1';
export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2';

const LOGICAL_ID = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_OCCURRENCE_001';
const RUNTIME_OCCURRENCE_ID = H_EARTH_RUN_8E_R2_CURRENT_OCCURRENCE_ID;
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const color3 = (value) => {
  const array = Array.isArray(value) ? value : [0, 0, 0];
  const scale = array.some((entry) => entry > 1) ? 255 : 1;
  return array.slice(0, 3).map((entry) =>
    Math.min(1, Math.max(0, Number(entry) / scale)));
};
const hash = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) {
    value ^= byte;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};
const summarize = (bytes, clear) => {
  let nonClearPixelCount = 0;
  let luminanceSum = 0;
  let luminanceSquareSum = 0;
  const buckets = new Set();
  const pixelCount = bytes.length / 4;
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const red = bytes[offset];
    const green = bytes[offset + 1];
    const blue = bytes[offset + 2];
    if (
      Math.abs(red - clear[0]) +
      Math.abs(green - clear[1]) +
      Math.abs(blue - clear[2]) > 9
    ) nonClearPixelCount += 1;
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    luminanceSum += luminance;
    luminanceSquareSum += luminance * luminance;
    buckets.add(`${red >> 4}:${green >> 4}:${blue >> 4}`);
  }
  const meanLuminance = luminanceSum / Math.max(1, pixelCount);
  return {
    pixelCount,
    nonClearPixelCount,
    uniqueColorBucketCount: buckets.size,
    meanLuminance,
    luminanceStandardDeviation: Math.sqrt(Math.max(
      0,
      luminanceSquareSum / Math.max(1, pixelCount) - meanLuminance * meanLuminance
    )),
    byteHash: hash(bytes)
  };
};

const VS = `#version 300 es
precision highp float;
precision highp int;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aBaseColorLinear;
layout(location=3) in vec4 aMaterialParameters;
layout(location=4) in uint aMaterialModelCode;
layout(location=5) in uint aSurfaceClassCode;
layout(location=6) in uint aPrimitiveIndex;
layout(location=7) in uint aRoleCode;
layout(location=8) in float aCoastDistanceMeters;
layout(location=9) in float aContactDistanceMeters;
uniform mat4 uViewProjection;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec4 vBaseColor;
out vec4 vMaterialParameters;
flat out uint vMaterialModelCode;
flat out uint vSurfaceClassCode;
flat out uint vPrimitiveIndex;
flat out uint vRoleCode;
out float vCoastDistanceMeters;
out float vContactDistanceMeters;
void main(){
  vWorldPosition=aPosition;
  vNormal=aNormal;
  vBaseColor=aBaseColorLinear;
  vMaterialParameters=aMaterialParameters;
  vMaterialModelCode=aMaterialModelCode;
  vSurfaceClassCode=aSurfaceClassCode;
  vPrimitiveIndex=aPrimitiveIndex;
  vRoleCode=aRoleCode;
  vCoastDistanceMeters=aCoastDistanceMeters;
  vContactDistanceMeters=aContactDistanceMeters;
  gl_Position=uViewProjection*vec4(aPosition,1.0);
}`;

const GLOBAL_COVER_VS = `#version 300 es
precision highp float;
precision highp int;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aColor;
layout(location=3) in vec4 aRootInfo;
uniform highp sampler2D uInstanceRecords;
uniform int uInstanceStart;
uniform int uInstanceStride;
uniform int uInstanceTextureWidth;
vec4 recordPart(int instance,int part){int texel=instance*5+part;return texelFetch(uInstanceRecords,ivec2(texel%uInstanceTextureWidth,texel/uInstanceTextureWidth),0);}
uniform mat4 uViewProjection;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec4 vBaseColor;
out vec4 vMaterialParameters;
flat out uint vMaterialModelCode;
flat out uint vSurfaceClassCode;
flat out uint vPrimitiveIndex;
flat out uint vRoleCode;
out float vCoastDistanceMeters;
out float vContactDistanceMeters;
float rootY(int instance,int i){return recordPart(instance,i/4)[i%4];}
void main(){
  int instance=uInstanceStart+gl_InstanceID*uInstanceStride;
  vec4 aTransform=recordPart(instance,3),aParameters=recordPart(instance,4);
  float c=cos(aTransform.z),s=sin(aTransform.z);
  vec2 q=aPosition.xz*aTransform.w;
  vec2 xz=aTransform.xy+vec2(q.x*c-q.y*s,q.x*s+q.y*c);
  vWorldPosition=vec3(xz.x,rootY(instance,int(aRootInfo.x))+aPosition.y*aParameters.x,xz.y);
  vec3 n=vec3(aNormal.x/aTransform.w,aNormal.y/aParameters.x,aNormal.z/aTransform.w);
  vNormal=normalize(vec3(n.x*c-n.z*s,n.y,n.x*s+n.z*c));
  vec3 palette=aParameters.y<0.333333?vec3(0.18,0.115,0.045):aParameters.y<0.666667?vec3(0.31,0.245,0.065):vec3(0.095,0.145,0.04);
  vBaseColor=vec4(mix(aColor.rgb,palette,0.55)*(0.92+0.16*aParameters.z),1.0);
  vMaterialParameters=vec4(0.0,0.0,0.0,1.0);
  vMaterialModelCode=0u;vSurfaceClassCode=255u;vPrimitiveIndex=65535u;vRoleCode=3u;
  vCoastDistanceMeters=64.0;vContactDistanceMeters=64.0;
  gl_Position=uViewProjection*vec4(vWorldPosition,1.0);
}`;

const FS = `#version 300 es
precision highp float;
precision highp int;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec4 vBaseColor;
in vec4 vMaterialParameters;
flat in uint vMaterialModelCode;
flat in uint vSurfaceClassCode;
flat in uint vPrimitiveIndex;
flat in uint vRoleCode;
in float vCoastDistanceMeters;
in float vContactDistanceMeters;
uniform vec3 uCameraPosition;
uniform vec3 uSunDirection;
uniform float uSunIntensity;
uniform vec3 uSunColor;
uniform vec3 uSkyZenithColor;
uniform vec3 uSkyHorizonColor;
uniform vec3 uGroundHazeColor;
uniform float uFogStartDistance;
uniform float uFogFalloff;
uniform float uMaximumFogFactor;
uniform float uDistanceDesaturationStrength;
uniform vec4 uTerrainPatchClip;
uniform int uClipBaseTerrain;
uniform int uGlobalCoverFarPrimitiveIndex;
uniform float uPlanetRadius;
// SHORELINE_SOIL_BEGIN uniform
uniform sampler2D uClearingLeaf;
uniform sampler2D uClearingBark;
uniform sampler2D uClearingSoil;
uniform highp sampler2DShadow uClearingShadow;
uniform mat4 uClearingLightMatrix;
uniform vec4 uClearingBounds;
uniform int uClearingEnabled;
uniform sampler2D uShorelineSoilCoverage;
uniform vec4 uLandscapeFloorFootprints[15];
uniform int uLandscapeFloorCount;
// SHORELINE_SOIL_END uniform
out vec4 outColor;

float hash21(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}
float noise2(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
             mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
}
float stableWave(float phase){
  float footprint=max(fwidth(phase),0.00001);
  float retained=1.0-smoothstep(0.72,1.65,footprint);
  return mix(0.5,0.5+0.5*sin(phase),retained);
}
float transitionBand(float signal,float halfWidth){
  float distanceToCenter=abs(signal-0.5);
  float antialiasWidth=max(fwidth(signal)*1.5,0.012);
  return 1.0-smoothstep(halfWidth-antialiasWidth,halfWidth+antialiasWidth,distanceToCenter);
}
float contour(float elevation){
  float interval=2.5;
  float centered=abs(fract(elevation/interval)-0.5);
  float width=max(fwidth(elevation/interval)*1.65,0.026);
  return smoothstep(0.47-width,0.49,centered);
}
float radial(vec2 point,vec2 center,float innerRadius,float outerRadius){
  return 1.0-smoothstep(innerRadius,outerRadius,distance(point,center));
}
float ring(vec2 point,vec2 center,float innerRadius,float outerRadius,float feather){
  float radius=distance(point,center);
  float inner=smoothstep(innerRadius-feather,innerRadius+feather,radius);
  float outer=1.0-smoothstep(outerRadius-feather,outerRadius+feather,radius);
  return clamp(inner*outer,0.0,1.0);
}
vec3 perturbTerrainNormal(
  vec3 geometricNormal,
  vec3 worldPosition,
  float reliefHeight
){
  vec3 positionDx = dFdx(worldPosition);
  vec3 positionDy = dFdy(worldPosition);
  float reliefDx = dFdx(reliefHeight);
  float reliefDy = dFdy(reliefHeight);
  vec3 surfaceGradient =
    reliefDx * cross(positionDy, geometricNormal) +
    reliefDy * cross(geometricNormal, positionDx);
  float determinant =
    dot(positionDx, cross(positionDy, geometricNormal));
  float orientation =
    determinant < 0.0 ? -1.0 : 1.0;
  return normalize(
    abs(determinant) * geometricNormal -
    orientation * surfaceGradient
  );
}
vec3 limitTerrainNormalDeviation(
  vec3 geometricNormal,
  vec3 candidateNormal
){
  const float COSINE_22_DEGREES = 0.9271838545667874;
  const float SINE_22_DEGREES = 0.3746065934159120;
  float correspondence = clamp(
    dot(geometricNormal, candidateNormal),
    -1.0,
    1.0
  );
  if(correspondence >= COSINE_22_DEGREES){
    return candidateNormal;
  }
  vec3 tangent =
    candidateNormal -
    geometricNormal * correspondence;
  float tangentLength = length(tangent);
  if(tangentLength < 0.00001){
    return geometricNormal;
  }
  return normalize(
    geometricNormal * COSINE_22_DEGREES +
    tangent / tangentLength * SINE_22_DEGREES
  );
}
vec2 clearingLocalXZ(vec3 p){
  float horizontal=length(p.xz);
  float radial=uPlanetRadius*atan(horizontal,p.y+uPlanetRadius);
  return horizontal>0.0001?p.xz*(radial/horizontal):vec2(0.0);
}
float clearingVisibility(vec3 p){
  vec4 q=uClearingLightMatrix*vec4(p,1.0);
  vec3 c=q.xyz/q.w*0.5+0.5;
  if(any(lessThan(c,vec3(0.0)))||any(greaterThan(c,vec3(1.0))))return 1.0;
  // Hardware depth comparison filters four neighboring texels in one lookup.
  float visibility=texture(uClearingShadow,vec3(c.xy,c.z-0.0005));
  return mix(0.22,1.0,visibility);
}
void main(){
  vec2 localXZ=vec2(0.0);
  float clearingEdge=0.0;
  // At this clearing radius tan(a)/a expands projected XZ by under 0.000033m.
  // The 0.01m coarse margin includes that expansion; the exact inverse and
  // strict original bounds still determine every affected fragment.
  float clearingScale=(vWorldPosition.y+uPlanetRadius)/uPlanetRadius;
  if(uClearingEnabled==1&&clearingScale>0.0&&all(greaterThan(vWorldPosition.xz,(uClearingBounds.xy-vec2(0.01))*clearingScale))&&all(lessThan(vWorldPosition.xz,(uClearingBounds.zw+vec2(0.01))*clearingScale))){
    localXZ=clearingLocalXZ(vWorldPosition);
    if(localXZ.x>uClearingBounds.x&&localXZ.y>uClearingBounds.y&&localXZ.x<uClearingBounds.z&&localXZ.y<uClearingBounds.w){
      vec2 edge=min(localXZ-uClearingBounds.xy,uClearingBounds.zw-localXZ);
      clearingEdge=smoothstep(0.0,1.5,min(edge.x,edge.y));
    }
  }
  float clearingType=vMaterialModelCode==0u&&vMaterialParameters.w>1.5?vMaterialParameters.z:0.0;
  if(clearingType>0.5&&clearingEdge<=0.0)clearingType=0.0;
  vec4 clearingTexel=vec4(1.0);
  if(clearingType>1.5&&clearingType<2.5){clearingTexel=texture(uClearingLeaf,vMaterialParameters.xy);if(clearingTexel.a<0.45)discard;}
  else if(clearingType>0.5&&clearingType<1.5){
    // Sweep-authored circumference UV avoids three triplanar texture fetches.
    clearingTexel=texture(uClearingBark,vec2(vMaterialParameters.x*3.0,vWorldPosition.y*0.70));
  }
  vec3 geometricNormal=normalize(vNormal);
  vec3 shadingNormal=geometricNormal;
  vec3 viewDirection=normalize(uCameraPosition-vWorldPosition);
  float slope=1.0-clamp(geometricNormal.y,0.0,1.0);
  float specularScale=1.0;
  float terrainReliefEnvelope=0.0;
  float materialSignal=clearingType>0.5?0.0:clamp(vMaterialParameters.x+vMaterialParameters.y*0.5,0.0,1.0);
  float identitySignal=float((vMaterialModelCode+vSurfaceClassCode+vPrimitiveIndex)%7u)/7.0;
  float distanceToCamera=length(vWorldPosition-uCameraPosition);
  float presentationContact=0.0;
  float presentationHighlight=0.0;
  float terrainRoughnessForLighting=0.72;
  float terrainReflectanceForLighting=0.18;
  float terrainWetnessForLighting=0.0;
  vec3 base=max(vBaseColor.rgb,vec3(0.004));
  float outputAlpha=clamp(vBaseColor.a,0.18,1.0);

  // FAR continuation is visual context only; invert the spherical projection
  // before sampling its broad landscape palette. No new roots or access rights.
  if(int(vPrimitiveIndex)==uGlobalCoverFarPrimitiveIndex){
    float horizontal=length(vWorldPosition.xz);
    vec2 source=vWorldPosition.xz*(horizontal>0.00001?atan(horizontal,vWorldPosition.y+uPlanetRadius)*uPlanetRadius/horizontal:0.0);
    float cover=noise2(source/38.0)*0.65+noise2(source/9.0)*0.35;
    float gentle=1.0-smoothstep(0.10,0.35,slope);
    vec3 grass=mix(vec3(0.23,0.185,0.105),vec3(0.13,0.145,0.075),smoothstep(0.38,0.70,cover));
    base=mix(base,grass,gentle*(0.22+0.30*cover));
  }
  if(vRoleCode==1u && uClipBaseTerrain==1 &&
     vWorldPosition.x>uTerrainPatchClip.x && vWorldPosition.x<uTerrainPatchClip.z &&
     vWorldPosition.z>uTerrainPatchClip.y && vWorldPosition.z<uTerrainPatchClip.w) discard;
  bool clearingSoilInterior=vRoleCode==1u&&clearingEdge>=0.99999;
  if(clearingSoilInterior){
    // The explicit clearing soil replaces unrelated regional palette work.
    // The transition band still evaluates the original terrain treatment.
    vec3 soilTexel=texture(uClearingSoil,localXZ*0.28).rgb;
    base=pow(soilTexel,vec3(2.2))*0.75;
    terrainRoughnessForLighting=0.94;
    terrainReflectanceForLighting=0.02;
    terrainReliefEnvelope=1.0;
    shadingNormal=limitTerrainNormalDeviation(geometricNormal,
      perturbTerrainNormal(geometricNormal,vWorldPosition,dot(soilTexel,vec3(0.3333))*0.035));
    for(int i=0;i<15;i++){
      if(i>=uLandscapeFloorCount)break;
      vec4 tree=uLandscapeFloorFootprints[i];
      float contact=1.0-smoothstep(tree.w,tree.w+0.80,distance(localXZ,tree.xy));
      presentationContact=max(presentationContact,contact*0.28);
    }
  }else if(vRoleCode==1u){
    vec2 world=vWorldPosition.xz;
    float broad=noise2(world*0.035);
    float medium=noise2(world*0.13+vec2(17.0,-9.0));
    float grain=noise2(world*0.55+vec2(-31.0,23.0));
    float macroField=noise2(world*0.018+vec2(5.0,-11.0));
    float mesoField=noise2(world*0.082+vec2(-13.0,7.0));
    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);
    float slopeResponse=smoothstep(0.025,0.58,slope);
    float curvatureResponse=clamp(length(fwidth(geometricNormal))*3.25,0.0,1.0);
    float nearDetail=1.0-smoothstep(72.0,250.0,distanceToCamera);

    // Phase 1 realism: nonperiodic multiscale shading relief. Geometry remains frozen.
    float microCoarse=noise2(world*0.19+vec2(11.7,-7.3));
    float microMedium=noise2(world*0.47+vec2(-23.1,31.9));
    float microFine=noise2(world*1.13+vec2(47.2,-19.6));
    float microReliefHeight=
      (microCoarse-0.5)*0.42+
      (microMedium-0.5)*0.21+
      (microFine-0.5)*0.085+
      (noise2(world*2.35+vec2(91.7,-64.2))-0.5)*0.032*nearDetail;
    float microFootprint=max(
      max(length(fwidth(world*0.19)),length(fwidth(world*0.47))),
      length(fwidth(world*1.13))
    );
    float microAntialiasEnvelope=1.0-smoothstep(0.72,1.45,microFootprint);
    float microDistanceEnvelope=1.0-smoothstep(105.0,285.0,distanceToCamera);
    float microSlopeEnvelope=mix(0.72,1.0,smoothstep(0.04,0.58,slope));
    terrainReliefEnvelope=clamp(
      microDistanceEnvelope*microSlopeEnvelope*microAntialiasEnvelope,
      0.0,1.0
    );

    vec3 rawMicroreliefNormal=
      perturbTerrainNormal(
        geometricNormal,
        vWorldPosition,
        microReliefHeight
      );

    vec3 boundedMicroreliefNormal=
      limitTerrainNormalDeviation(
        geometricNormal,
        rawMicroreliefNormal
      );

    shadingNormal=normalize(
      mix(
        geometricNormal,
        boundedMicroreliefNormal,
        terrainReliefEnvelope
      )
    );

    // Continuous landform regimes. Existing elevation/slope/curvature signals
    // select the regime; procedural noise only varies material within it.
    float lowlandWeight=(1.0-smoothstep(5.0,24.0,vWorldPosition.y))*(1.0-smoothstep(0.10,0.42,slope));
    float risingWeight=smoothstep(3.0,30.0,vWorldPosition.y)*(1.0-smoothstep(0.34,0.66,slope));
    float exposedWeight=clamp(smoothstep(0.18,0.62,slope)*0.82+curvatureResponse*0.18,0.0,1.0);
    float regimeTotal=max(lowlandWeight+risingWeight+exposedWeight,0.00001);
    lowlandWeight/=regimeTotal;
    risingWeight/=regimeTotal;
    exposedWeight/=regimeTotal;
    vec3 lowland=vec3(0.27,0.30,0.18);
    vec3 rising=vec3(0.34,0.32,0.20);
    vec3 exposed=vec3(0.29,0.28,0.25);
    vec3 palette=lowland*lowlandWeight+rising*risingWeight+exposed*exposedWeight;

    // Preserve broad material identity; retire painted contour/stripe dominance.
    // Phase 2: procedural triplanar material-space projection using the
    // existing world position and shading normal. No geometry or asset layer.
    vec3 triWeight=pow(abs(shadingNormal),vec3(4.0));
    triWeight/=max(triWeight.x+triWeight.y+triWeight.z,0.00001);
    vec2 triX=vWorldPosition.zy*0.115;
    vec2 triY=vWorldPosition.xz*0.115;
    vec2 triZ=vWorldPosition.xy*0.115;
    float triCoarse=
      noise2(triX+vec2(13.1,-7.7))*triWeight.x+
      noise2(triY+vec2(-19.3,11.9))*triWeight.y+
      noise2(triZ+vec2(31.7,23.5))*triWeight.z;
    float triFine=
      noise2(triX*3.35+vec2(-41.2,17.4))*triWeight.x+
      noise2(triY*3.35+vec2(29.6,-37.1))*triWeight.y+
      noise2(triZ*3.35+vec2(7.8,43.6))*triWeight.z;
    float triMicro=
      noise2(triX*9.7+vec2(73.4,-51.2))*triWeight.x+
      noise2(triY*9.7+vec2(-67.8,89.1))*triWeight.y+
      noise2(triZ*9.7+vec2(101.3,37.6))*triWeight.z;
    float nearMaterial=1.0-smoothstep(55.0,220.0,distanceToCamera);
    float triMaterial=clamp(triCoarse*0.56+triFine*0.31+triMicro*0.13*nearMaterial,0.0,1.0);
    float materialVariation=clamp(
      broad*0.24+medium*0.16+grain*0.04+macroField*0.08+triMaterial*0.48,
      0.0,1.0
    );
    float rockExposure=clamp(
      smoothstep(0.16,0.68,slope)*0.72+
      curvatureResponse*0.18+
      elevationMix*0.10,
      0.0,1.0
    );
    float shelteredSoil=clamp(
      (1.0-rockExposure)*(0.58+0.42*(1.0-slopeResponse))*
      (0.78+0.22*materialVariation),
      0.0,1.0
    );
    vec3 soilTone=mix(lowland,rising,elevationMix);
    float weathering=clamp(
      noise2(world*0.061+vec2(57.0,-83.0))*0.52+
      triCoarse*0.30+triFine*0.18,
      0.0,1.0
    );
    float fracture=clamp(abs(triFine-triCoarse)*1.75+abs(triMicro-0.5)*0.38*nearMaterial,0.0,1.0);
    vec3 exposedRock=mix(vec3(0.175,0.185,0.178),vec3(0.355,0.335,0.285),weathering);
    exposedRock*=mix(0.82,1.13,fracture);
    vec3 groundedSoil=mix(soilTone,vec3(0.285,0.255,0.165),triCoarse*0.30);
    groundedSoil=mix(groundedSoil,vec3(0.205,0.235,0.135),shelteredSoil*(1.0-weathering)*0.22);
    palette=mix(palette,groundedSoil,shelteredSoil*0.46);
    palette=mix(palette,exposedRock,rockExposure*(0.62+0.20*fracture));
    palette*=mix(0.89,1.11,materialVariation);
    palette*=mix(0.94,1.06,triMicro*nearMaterial);
    palette=mix(palette,base,0.34);

    float terrainRoughness=clamp(vMaterialParameters.x,0.04,1.0);
    terrainRoughnessForLighting=terrainRoughness;
    float terrainReflectance=clamp(vMaterialParameters.y,0.0,1.0);
    terrainReflectanceForLighting=terrainReflectance;
    float terrainWetness=clamp(vMaterialParameters.z,0.0,1.0);
    terrainWetnessForLighting=terrainWetness;
    float terrainCurvature=clamp(vMaterialParameters.w,0.0,1.0);
    specularScale=mix(0.28,1.24,terrainReflectance);
    specularScale*=mix(0.78,1.38,terrainWetness);
    specularScale*=mix(0.92,1.10,rockExposure);
    presentationContact=max(
      presentationContact,
      clamp(terrainCurvature*0.10+rockExposure*0.035,0.0,0.16)
    );
    presentationHighlight=max(
      presentationHighlight,
      (1.0-terrainRoughness)*0.12+terrainWetness*0.06
    );
    base=palette;

    vec2 manorCenter=vec2(80.0,-172.0);
    float manorRadius=distance(world,manorCenter);
    float manorEnvelope=radial(world,manorCenter,7.0,30.0);
    float manorEdge=ring(world,manorCenter,10.5,21.0,2.2);
    float manorOuterContact=ring(world,manorCenter,21.5,31.5,2.4);
    float manorInnerContact=ring(world,manorCenter,4.5,13.5,1.8);
    float manorPattern=stableWave(manorRadius*0.83+vWorldPosition.y*0.46+noise2(world*0.19)*4.0);
    float manorGranularity=noise2(world*0.34+vec2(41.0,-23.0));
    float manorTerraceSignal=stableWave(manorRadius*0.44+vWorldPosition.y*0.72+manorGranularity*2.2);
    float manorTerraceContact=transitionBand(manorTerraceSignal,0.080)*manorEnvelope;
    float manorChromatic=stableWave(manorRadius*0.29+world.x*0.12-world.y*0.09+vWorldPosition.y*0.37+manorGranularity*1.4);
    float manorContact=max(
      manorEdge,
      max(manorOuterContact*0.90,max(manorInnerContact*0.75,manorTerraceContact*0.70))
    );
    vec3 manorStone=mix(vec3(0.35,0.21,0.055),vec3(0.72,0.51,0.17),manorPattern*0.72+manorGranularity*0.28);
    palette=mix(palette,manorStone,manorEnvelope*(0.42+0.22*manorPattern));
    palette*=mix(1.0,0.54,manorContact*(0.36+0.42*manorPattern));
    palette*=mix(0.88,1.12,manorTerraceSignal*manorEnvelope*0.34);
    palette+=vec3(0.205,0.125,0.020)*manorContact*(0.42+0.58*manorGranularity);
    palette+=vec3(0.062,0.016,-0.022)*(manorChromatic-0.5)*manorEnvelope;
    presentationContact=max(presentationContact,manorContact*0.72);
    presentationHighlight=max(presentationHighlight,manorOuterContact*0.44+manorTerraceContact*0.24);

    vec2 cavernCenter=vec2(40.0,-284.0);
    float cavernRadius=distance(world,cavernCenter);
    float cavernRelation=radial(world,cavernCenter,5.0,28.0);
    float cavernApproach=radial(world,vec2(48.0,-284.0),10.0,44.0);
    float cavernContact=ring(world,cavernCenter,8.0,24.0,2.8);
    float cavernOuterContact=ring(world,cavernCenter,23.0,39.0,3.6);
    float cavernStrata=stableWave(cavernRadius*0.71+vWorldPosition.y*0.92+noise2(world*0.15)*4.6);
    float cavernFracture=stableWave(world.x*0.93-world.y*0.67+vWorldPosition.y*0.44);
    float cavernRelationSignal=stableWave(cavernRadius*0.43+(world.y+284.0)*0.31+vWorldPosition.y*0.83+noise2(world*0.12)*2.0);
    float cavernRelationContact=transitionBand(cavernRelationSignal,0.082)*cavernApproach;
    float cavernGroundContact=max(
      cavernContact,
      max(cavernOuterContact*0.82,cavernRelationContact*0.72)
    );
    vec3 cavernStone=mix(vec3(0.028,0.052,0.060),vec3(0.27,0.39,0.42),cavernStrata*0.70+cavernFracture*0.30);
    palette=mix(palette,cavernStone,cavernRelation*(0.68+0.20*cavernStrata));
    palette*=mix(1.0,0.50,cavernGroundContact*(0.36+0.48*cavernFracture));
    palette*=mix(0.90,1.10,cavernRelationSignal*cavernApproach*0.30);
    palette=mix(palette,palette*vec3(0.60,0.84,0.96),cavernApproach*0.32);
    palette+=vec3(0.032,0.060,0.070)*cavernGroundContact*(0.35+0.65*cavernStrata);
    presentationContact=max(presentationContact,cavernGroundContact*0.82);
    presentationHighlight=max(presentationHighlight,cavernOuterContact*0.34+cavernRelationContact*0.26);

    float ravineAxis=exp(-pow((vWorldPosition.x-40.0)/18.0,2.0));
    float ravineShoulder=ring(world,vec2(40.0,-252.0),18.0,46.0,5.0);
    float ravineDepth=1.0-smoothstep(-292.0,-210.0,vWorldPosition.z);
    float routePulse=stableWave(vWorldPosition.z*0.56+vWorldPosition.y*0.31+mesoField*3.0);
    float ravineWallSignal=stableWave(abs(vWorldPosition.x-40.0)*0.32+(-vWorldPosition.z-210.0)*0.09+vWorldPosition.y*0.51);
    float ravineWallContact=transitionBand(ravineWallSignal,0.080)*ravineDepth*ravineAxis;
    float routeSignal=ravineAxis*ravineDepth*(0.36+0.64*slopeResponse);
    palette=mix(palette,vec3(0.060,0.125,0.14),routeSignal*(0.42+0.40*routePulse));
    palette*=mix(1.0,0.70,max(ravineShoulder*ravineDepth*(0.18+0.32*slopeResponse),ravineWallContact*0.62));
    palette+=vec3(0.026,0.050,0.058)*(routeSignal*routePulse+ravineWallContact*0.45);
    presentationContact=max(presentationContact,ravineWallContact*0.52+routeSignal*0.20);
    // Actual exposed mesh contacts drive proximity; canonical coast distance
    // retains the existing transition to slope/elevation suitability inland.
    float inlandMeters=vContactDistanceMeters;
    float beachSlopeSuitability=1.0-smoothstep(0.035,0.16,slope);
    float beachElevationSuitability=1.0-smoothstep(2.0,10.0,vWorldPosition.y);
    float coastalSuitability=clamp(beachSlopeSuitability*0.72+beachElevationSuitability*0.28,0.0,1.0);
    float inlandReturn=smoothstep(4.0,28.0,vCoastDistanceMeters);
    float sandCoverage=smoothstep(-1.0,0.0,inlandMeters)*(1.0-smoothstep(10.0,38.0,inlandMeters))*mix(1.0,coastalSuitability,inlandReturn);
    vec3 wetSand=vec3(0.42326766,0.32777810,0.19120169);
    vec3 dampSand=vec3(0.49693298,0.39675522,0.23455058);
    vec3 drySand=vec3(0.57758045,0.47353148,0.28314874);
    vec3 sand=mix(mix(wetSand,dampSand,smoothstep(2.0,14.0,inlandMeters)),drySand,smoothstep(10.0,24.0,inlandMeters));
    sand*=0.965+0.07*grain;
    palette=mix(palette,sand,sandCoverage);
    presentationContact*=1.0-0.85*sandCoverage;
    presentationHighlight*=1.0-0.70*sandCoverage;
// SHORELINE_SOIL_BEGIN shade
    // The mask is derived once from the accepted grass roots on this bank.
    vec2 soilUv=(world-vec2(-18.0,-204.0))/vec2(52.0,73.0);
    if(all(greaterThanEqual(soilUv,vec2(0.0)))&&all(lessThanEqual(soilUv,vec2(1.0)))){
      float coverage=texture(uShorelineSoilCoverage,soilUv).r;
      float moist=1.0-smoothstep(0.5,6.0,max(0.0,inlandMeters));
      float broadSoil=noise2(world*0.37+vec2(7.3,13.8));
      float brokenSoil=noise2(world*1.1+vec2(19.7,3.2));
      vec3 drySoil=vec3(0.245,0.174,0.092);
      vec3 dampSoil=vec3(0.125,0.082,0.043);
      vec3 soil=mix(drySoil,dampSoil,moist*0.82);
      soil*=0.88+0.19*broadSoil+0.07*brokenSoil;
      float soilBlend=coverage*(0.70+0.23*broadSoil);
      palette=mix(palette,soil,soilBlend);
    }
// SHORELINE_SOIL_END shade
    // A floor follows accepted tree footprints, not a filled cluster ellipse.
    // B/C retain their existing treatment. This is static material/contact
    // reinforcement on the actual terrain, never a cast shadow or new surface.
    if(world.x>-180.0 && world.x<-24.0 && world.y>-380.0 && world.y<-190.0){
      float b=length((world-vec2(-125.0,-285.0))/vec2(29.0,25.0));
      float c=length((world-vec2(-65.0,-315.0))/vec2(24.0,22.0));
      float edge=min(b,c)+(noise2(world*0.23)-0.5)*0.22;
      float existingLitter=1.0-smoothstep(0.67,1.10,edge);
      float canopyLitter=0.0;
      float trunkContact=0.0;
      float brokenEdge=(noise2(world*0.71+vec2(17.3,-9.7))-0.5)*0.18;
      for(int i=0;i<15;i++){
        if(i>=uLandscapeFloorCount)break;
        vec4 tree=uLandscapeFloorFootprints[i];
        float rootDistance=distance(world,tree.xy);
        float crownDistance=rootDistance/tree.z+brokenEdge;
        float underCrown=1.0-smoothstep(0.48,1.08,crownDistance);
        canopyLitter=max(canopyLitter,underCrown);
        trunkContact=max(trunkContact,1.0-smoothstep(tree.w,tree.w+0.80,rootDistance));
      }
      vec3 woodlandSoil=vec3(0.16,0.119,0.066)*(0.88+0.21*noise2(world*0.71));
      float litterStrength=max(existingLitter*0.70,canopyLitter*0.50+trunkContact*0.15);
      palette=mix(palette,woodlandSoil,litterStrength);
      presentationContact=max(presentationContact,max(existingLitter*0.65,canopyLitter*0.10+trunkContact*0.28));
    }
    base=palette;
  }else if(vRoleCode==4u){
    // Visible water arrives as GPU role 4. Keep the uploaded coast colors.
    // A world-space normal is continuous across the coarse ocean triangles.
    vec2 waterWorld=vWorldPosition.xz;
    float broad=dot(waterWorld,vec2(0.055,0.028));
    float cross=dot(waterWorld,vec2(-0.083,0.061))+1.4;
    float slopeX=0.020*cos(broad)-0.012*cos(cross);
    float slopeZ=0.010*cos(broad)+0.009*cos(cross);
    geometricNormal=vec3(0.0,1.0,0.0);
    shadingNormal=normalize(vec3(-slopeX,1.0,-slopeZ));
  }else{
    // Explicit oasis colors already encode live, straw and dead foliage.
    if(vRoleCode==3u && vMaterialParameters.w<0.5){
      float vegetationVariation=noise2(vWorldPosition.xz*0.42+identitySignal*19.0);
      base=mix(base*vec3(0.56,0.83,0.58),base*vec3(0.92,1.28,0.82),vegetationVariation);
    }
    base*=0.78+0.34*clamp(geometricNormal.y,0.0,1.0);
  }

  if(clearingType>0.5&&clearingType<1.5){
    // Texture-derived shallow bark relief changes shading, never the frozen wood.
    shadingNormal=limitTerrainNormalDeviation(geometricNormal,
      perturbTerrainNormal(geometricNormal,vWorldPosition,dot(clearingTexel.rgb,vec3(0.3333))*0.055));
  }
  float geometricRim=pow(
    1.0-max(dot(geometricNormal,viewDirection),0.0),
    2.2
  );
  float reliefRim=pow(
    1.0-max(dot(shadingNormal,viewDirection),0.0),
    2.2
  );
  float rim=vRoleCode==1u
    ?mix(
      geometricRim,
      reliefRim,
      0.85*terrainReliefEnvelope
    )
    :(vRoleCode==4u?reliefRim:geometricRim);

  float specularExponent=vRoleCode==1u?mix(52.0,9.0,terrainRoughnessForLighting):24.0;
  float specular=0.0;
  float directional=0.0;
  // Full-interior clearing lighting replaces these two values with weight 1.
  // Keep every original expression for the transition band and outside world.
  if(clearingEdge!=1.0){
    vec3 lightDirection=normalize(-uSunDirection);
    vec3 halfDirection=normalize(lightDirection+viewDirection);
    float geometricDiffuse=max(dot(geometricNormal,lightDirection),0.0);
    float reliefDiffuse=max(dot(shadingNormal,lightDirection),0.0);
    float diffuse=vRoleCode==4u?reliefDiffuse:geometricDiffuse;
    if(vRoleCode==1u){
      diffuse=mix(
        geometricDiffuse,
        reliefDiffuse,
        0.95*terrainReliefEnvelope
      );
      diffuse=clamp(
        diffuse,
        max(0.0,geometricDiffuse-0.34),
        min(1.0,geometricDiffuse+0.34)
      );
    }
    specular=pow(
      max(dot(shadingNormal,halfDirection),0.0),
      specularExponent
    )*specularScale;
    directional=
      diffuse*
      uSunIntensity*
      (vRoleCode==1u?0.96:(vRoleCode==4u?0.74:0.82));
  }

  float specularLightingGain=vRoleCode==1u
    ?mix(0.035,0.22,clamp(terrainReflectanceForLighting*0.72+terrainWetnessForLighting*0.28,0.0,1.0))
    :(vRoleCode==4u?0.22:(vMaterialParameters.w>1.5?0.004:0.07));

  float ambient=
    0.26+
    0.16*clamp(geometricNormal.y,0.0,1.0)+
    0.05*materialSignal;
  if(clearingType>0.5&&clearingType<2.5){
    vec3 reference=clearingType>1.5?vec3(94.0,135.0,61.0)/255.0:vec3(100.0,83.0,62.0)/255.0;
    vec3 detail=clamp(pow(clearingTexel.rgb/max(reference,vec3(0.01)),vec3(2.2)),vec3(0.45),vec3(1.55));
    base*=mix(vec3(1.0),detail,clearingEdge*0.78);
  }
  if(vRoleCode==1u&&clearingEdge>0.0&&!clearingSoilInterior){
    vec3 soil=pow(texture(uClearingSoil,localXZ*0.28).rgb,vec3(2.2));
    base=mix(base,soil*0.75,clearingEdge*0.55);
  }
  float clearingShadowFactor=1.0;
  if(clearingEdge>0.0){
    // atmosphere-state supplies a direction TOWARD the sun. Preserve the old
    // lighting outside this trial, and blend the corrected illumination at its edge.
    vec3 clearingLight=normalize(uSunDirection);
    float clearingDiffuse=clearingType>1.5&&clearingType<2.5
      ?abs(dot(shadingNormal,clearingLight)):max(dot(shadingNormal,clearingLight),0.0);
    directional=mix(directional,clearingDiffuse*uSunIntensity*(vRoleCode==1u?0.96:0.82),clearingEdge);
    vec3 clearingHalf=normalize(clearingLight+viewDirection);
    specular=mix(specular,pow(max(dot(shadingNormal,clearingHalf),0.0),specularExponent)*specularScale,clearingEdge);
    clearingShadowFactor=mix(1.0,clearingVisibility(vWorldPosition),clearingEdge);
  }
  directional*=clearingShadowFactor;
  specular*=clearingShadowFactor;
  vec3 lit=base*(ambient+directional)*uSunColor;
  lit+=base*rim*(vRoleCode==1u?0.14:0.10);
  lit+=uSunColor*specular*specularLightingGain;

  float rawFog=clamp((distanceToCamera-uFogStartDistance)*max(uFogFalloff,0.00001),0.0,uMaximumFogFactor);
  float fog=rawFog*(vRoleCode==1u?0.54:0.68);
  fog=min(uMaximumFogFactor,fog+clearingEdge*clamp(distanceToCamera/2400.0,0.0,0.035));
  float luminance=dot(lit,vec3(0.2126,0.7152,0.0722));
  lit=mix(lit,vec3(luminance),clamp(fog*uDistanceDesaturationStrength*0.48,0.0,0.58));
  vec3 atmosphere=mix(uSkyHorizonColor,uSkyZenithColor,clamp(geometricNormal.y*0.5+0.5,0.0,1.0));
  vec3 haze=mix(uGroundHazeColor,atmosphere,0.44);
  lit=mix(lit,haze,fog*0.48);
  if(vRoleCode==1u){
    lit*=mix(1.0,0.76,clamp(presentationContact,0.0,1.0));
    lit+=base*clamp(presentationHighlight,0.0,1.0)*0.038;
  }
  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));
  outColor=vec4(lit,outputAlpha);
}`;

const CLEARING_SHADOW_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=3) in vec4 aMaterialParameters;
uniform mat4 uLightMatrix;
out vec3 vClearing;
void main(){vClearing=aMaterialParameters.xyz;gl_Position=uLightMatrix*vec4(aPosition,1.0);}`;
const CLEARING_SHADOW_FS=`#version 300 es
precision highp float;
in vec3 vClearing;
uniform sampler2D uLeaf;
void main(){if(vClearing.z>1.5&&vClearing.z<2.5&&texture(uLeaf,vClearing.xy).a<0.45)discard;}`;

const DVS = `#version 300 es
precision highp float;
const vec2 p[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
out vec2 vUv;
void main(){vec2 q=p[gl_VertexID];vUv=q*.5+.5;gl_Position=vec4(q,0.,1.);}`;
const DFS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDepth;
out vec4 outColor;
void main(){float d=texture(uDepth,vUv).r,v=clamp((1.-d)*28.,0.,1.);outColor=vec4(vec3(v),1.);}`;

export async function createHEarthRun8ER3CPersistentRenderer({ canvas, width = 640, height = 360, deferVegetation = false, onStartupProgress = null } = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('R3C_CANVAS_REQUIRED');
  canvas.width = width;
  canvas.height = height;
  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: false, depth: true, stencil: false,
    preserveDrawingBuffer: true, powerPreference: 'high-performance'
  });
  if (!gl) throw new Error('R3C_WEBGL2_CONTEXT_UNAVAILABLE');
  onStartupProgress?.(Object.freeze({phase:'RENDERER_CONSTRUCTOR',completed:0,total:1,unit:'renderer',progress:34,status:'Constructing world renderer'}));
  await yieldToBrowserPaint();
  let initialized = false;
  const counters = {
    contextCreationCount: 1, shaderCreateCount: 0, shaderCompileCount: 0,
    programCreateCount: 0, programLinkCount: 0, vertexArrayCreateCount: 0,
    bufferCreateCount: 0, bufferUploadCount: 0, packageBufferUploadCount: 0, clearingIndexBufferUploadCount: 0, uploadedByteLength: 0,
    textureCreateCount: 0, framebufferCreateCount: 0,
// SHORELINE_SOIL_BEGIN counters
    shorelineSoilTextureUploadCount: 0, shorelineSoilUploadedByteLength: 0,
// SHORELINE_SOIL_END counters
    postInitializationResourceCreationCount: 0, postInitializationBufferUploadCount: 0,
    frameCount: 0, visiblePresentationCount: 0, colorReadbackCount: 0,
    depthReadbackCount: 0, pngEncodingCount: 0, gpuFinishCount: 0,
    cameraUniformUpdateCount: 0, staticUniformUpdateCount: 0,
    geometryDrawCallCount: 0, totalDrawnIndexCount: 0,
    depthVisualizationDrawCallCount: 0,
    refinementResourceCreateCount: 0, refinementBufferUploadCount: 0, refinementDrawCallCount: 0,
    vegetationBatchMaterializationCount: 0, vegetationResidentInstanceCount: 0, vegetationResidentPrimitiveCount: 0,
    vegetationBufferUploadCount: 0, vegetationDrawCallCount: 0, worldRebuildCount: 0
  };
  const resources = {};
  const markPostInitializationCreation = () => {
    if (initialized) counters.postInitializationResourceCreationCount += 1;
  };
  const createShader = (type, source, label) => {
    markPostInitializationCreation(); counters.shaderCreateCount += 1;
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`R3C_SHADER_CREATE_FAILED:${label}`);
    gl.shaderSource(shader, source); gl.compileShader(shader); counters.shaderCompileCount += 1;
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`R3C_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  };
  const createProgram = (vertexShader, fragmentShader, label) => {
    markPostInitializationCreation(); counters.programCreateCount += 1;
    const program = gl.createProgram();
    if (!program) throw new Error(`R3C_PROGRAM_CREATE_FAILED:${label}`);
    gl.attachShader(program, vertexShader); gl.attachShader(program, fragmentShader);
    gl.linkProgram(program); counters.programLinkCount += 1;
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`R3C_PROGRAM_LINK_FAILED:${label}:${gl.getProgramInfoLog(program)}`);
    }
    return program;
  };
  const createBuffer = () => {
    markPostInitializationCreation(); counters.bufferCreateCount += 1;
    const buffer = gl.createBuffer(); if (!buffer) throw new Error('R3C_BUFFER_CREATE_FAILED');
    return buffer;
  };
  const upload = (target, data) => {
    if (initialized) counters.postInitializationBufferUploadCount += 1;
    counters.bufferUploadCount += 1; counters.uploadedByteLength += data.byteLength;
    gl.bufferData(target, data, gl.STATIC_DRAW);
  };
  const createTexture = () => {
    markPostInitializationCreation(); counters.textureCreateCount += 1;
    const texture = gl.createTexture(); if (!texture) throw new Error('R3C_TEXTURE_CREATE_FAILED');
    return texture;
  };
  const createFramebuffer = () => {
    markPostInitializationCreation(); counters.framebufferCreateCount += 1;
    const framebuffer = gl.createFramebuffer(); if (!framebuffer) throw new Error('R3C_FRAMEBUFFER_CREATE_FAILED');
    return framebuffer;
  };
  const uniform = (program, name) => {
    const location = gl.getUniformLocation(program, name);
    if (location === null) throw new Error(`R3C_UNIFORM_MISSING:${name}`);
    return location;
  };
  const requireCompleteFramebuffer = (label) => {
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) throw new Error(`R3C_FRAMEBUFFER_INCOMPLETE:${label}:${status}`);
  };
  let canonicalStartupPercent=34;
  const renderPackage = await (globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.measureAsync??((name,operation)=>operation()))('CANONICAL_PACKAGE',()=>prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation,onProgress:update=>{
    const milestone=update.phase==='RAW_PACKAGE_COMPLETE'?34.4:update.phase==='CANONICAL_PACKAGE_COMPLETE'?34.7:update.phase==='CANONICAL_PACKAGE_READY'?35:34;
    const progress=Math.max(canonicalStartupPercent,milestone);canonicalStartupPercent=progress;
    const status=update.phase==='RAW_PACKAGE_COMPLETE'?'Base world geometry ready':update.phase==='CANONICAL_PACKAGE_COMPLETE'?'Canonical world buffers ready':update.phase==='CANONICAL_PACKAGE_READY'?'World package validated':update.phase==='VALIDATING_PACKAGE_BUFFERS'?'Validating world buffers':update.phase==='SYNCHRONOUS_BASELINE_FALLBACK'?'Preparing world on this device':'Preparing canonical world geometry';
    onStartupProgress?.(Object.freeze({...update,progress,status}));
  }}));
  const landscapeFloorFootprints=renderPackage.landscapeFloorFootprints;
  if(!Array.isArray(landscapeFloorFootprints)||landscapeFloorFootprints.length<1||landscapeFloorFootprints.length>15||
    landscapeFloorFootprints.some(p=>![p.x,p.z,p.crownRadius,p.trunkRadius].every(Number.isFinite)||p.crownRadius<=0||p.trunkRadius<=0||p.trunkRadius>=p.crownRadius)||
    typeof renderPackage.landscapeFloorContentDigest!=='string'||!renderPackage.landscapeFloorContentDigest.length)
    throw new Error('R3C_LANDSCAPE_FLOOR_MANIFEST_INVALID');
  const landscapeFloorUniforms=new Float32Array(15*4);
  landscapeFloorFootprints.forEach((p,i)=>landscapeFloorUniforms.set([p.x,p.z,p.crownRadius,p.trunkRadius],i*4));
  const uploadViews = startupMeasure('GPU_UPLOAD_VIEWS',()=>createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage,{enableWoodlandClearing:true}));
  const rendererInterface = getHEarthRun8ER3ALiveRendererInterface({deferVegetation});
  if (renderPackage.packageOccurrenceId !== RUNTIME_OCCURRENCE_ID) throw new Error(`R3C_RUNTIME_PACKAGE_OCCURRENCE_MISMATCH:${renderPackage.packageOccurrenceId}`);
  if (uploadViews.deterministicTransportEncoding !== true) throw new Error('R3C_CANONICAL_GPU_TRANSPORT_MISSING');
  const sandIds = new Set(['H_EARTH_FUNCTIONAL_SHORELINE:DRY_SAND_EDGE', 'H_EARTH_FUNCTIONAL_SHORELINE:DAMP_TRANSITION', 'H_EARTH_FUNCTIONAL_SHORELINE:WET_SAND']);
  const sandRanges = renderPackage.drawRanges.filter((range) => range.primitiveIds?.some((id) => sandIds.has(id)));
  if (sandRanges.length !== 1 || sandRanges[0].primitiveIds.length !== 3 || !sandRanges[0].primitiveIds.every((id) => sandIds.has(id))) throw new Error('R3C_SAND_DRAW_RANGE_NOT_ISOLATED');
  const sandRange = sandRanges[0];
  const coastDistances = new Float32Array(uploadViews.positions.length / 3);
  const planetRadius = H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius;
  const totalCoastVertices=renderPackage.primitiveSpans.filter(span=>span.role==='TERRAIN').reduce((total,span)=>total+span.vertexCount,0);
  let coastVertexCompleted=0,lastCoastProgress=34;
  for (const span of renderPackage.primitiveSpans) {
    if (span.role !== 'TERRAIN') continue;
    for (let vertex = span.vertexStart; vertex < span.vertexStart + span.vertexCount; vertex++) {
      const p = vertex * 3, px = uploadViews.positions[p], py = uploadViews.positions[p + 1], pz = uploadViews.positions[p + 2];
      const horizontal = Math.hypot(px, pz);
      const scale = horizontal > Number.EPSILON ? Math.atan2(horizontal, py + planetRadius) * planetRadius / horizontal : 0;
      coastDistances[vertex] = getHEarthSignedCoastDistanceMeters(px * scale, pz * scale);
      coastVertexCompleted++;
      if(coastVertexCompleted%4096===0||coastVertexCompleted===totalCoastVertices){
        const progress=Math.max(lastCoastProgress,34+coastVertexCompleted/Math.max(1,totalCoastVertices));
        lastCoastProgress=progress;
        onStartupProgress?.(Object.freeze({phase:'COAST_VERTEX_SAMPLES',completed:coastVertexCompleted,total:totalCoastVertices,unit:'vertices',progress,status:'Sampling coast vertices'}));
        await yieldToBrowserPaint();
      }
    }
  }

  let vegetationTruth=deferVegetation?null:startupMeasure('VEGETATION_TRUTH_LOOKUP',()=>getHEarthRun8ER2VegetationWorldTruthPlan());
  if(!deferVegetation&&vegetationTruth.qualifiedManifestIdentity?.manifestSha256!=='9055c817cac9db1de48f1b7ee814bfda954255429564e44e7a664dab66616b4e')throw new Error('R3C_QUALIFIED_VEGETATION_MANIFEST_MISMATCH');
  resources.vegetation={truth:vegetationTruth,nextBatchIndex:0,residentBatches:[],residentPlacementIds:new Set(),complete:false};
  let contactField=await createExposedWaterContactFieldAsync(uploadViews,renderPackage.primitiveSpans,null,{onProgress:onStartupProgress??(()=>{}),startProgress:35});
  let contactFieldBuildCount=1,contactFieldTotalMilliseconds=contactField.stats.initializationMilliseconds;

  let vegetationPreparation=null;
  let vegetationPreparationComplete=!deferVegetation;
  let vegetationPreparationProgress=Object.freeze({phase:'NOT_STARTED',worldTruthValidated:!deferVegetation,oasisComplete:!deferVegetation,grassTuftCount:0,cattailCount:0,primitiveCount:0});
  function prepareVegetationResidency({onProgress=()=>{}}={}){
    if(typeof onProgress!=='function')throw new TypeError('R3C_VEGETATION_PROGRESS_CALLBACK_INVALID');
    if(vegetationPreparation)return vegetationPreparation;
    const progress=update=>{vegetationPreparationProgress=Object.freeze({...vegetationPreparationProgress,...update});onProgress(vegetationPreparationProgress);};
    vegetationPreparation=(async()=>{
      globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('VEGETATION_PREPARATION_START');
      progress({phase:'PREPARING'});
      const truthPreparation=prepareHEarthRun8ER2VegetationWorldTruthPlan().then(truth=>{
        if(truth.qualifiedManifestIdentity?.manifestSha256!=='9055c817cac9db1de48f1b7ee814bfda954255429564e44e7a664dab66616b4e')throw new Error('R3C_QUALIFIED_VEGETATION_MANIFEST_MISMATCH');
        vegetationTruth=truth;resources.vegetation.truth=truth;
        globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('VEGETATION_PLAN_VALIDATED');
        progress({phase:'WORLD_TRUTH_VALIDATED',worldTruthValidated:true});
      });
      globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('OASIS_PREPARATION_START');
      const oasisPreparation=prepareHEarthOasisFoliagePresentation(getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation}),{onProgress:update=>progress({...update,phase:`OASIS_${update.phase}`})}).then(()=>{
        globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('OASIS_PREPARATION_COMPLETE');
        progress({phase:'OASIS_READY',oasisComplete:true});
      });
      if(!initialized)throw new Error('GLOBAL_COVER_REQUIRES_INITIALIZED_POST_READY_RENDERER');
      const globalCoverPreparation=buildHEarthGlobalGroundCover(getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation}),{
        refinement:resources.refinement?.surface??null,
        onProgress:update=>progress({...update,phase:`GLOBAL_COVER_${update.phase}`})
      }).then(async cover=>{await uploadGlobalCover(cover);progress({phase:'GLOBAL_COVER_RESIDENT',globalCoverComplete:true});});
      await Promise.all([truthPreparation,oasisPreparation,globalCoverPreparation]);
      vegetationPreparationComplete=true;
      globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('VEGETATION_PREPARATION_COMPLETE');
      progress({phase:'PREPARED'});
      return getResourceReceipt().vegetationResidency;
    })();
    return vegetationPreparation;
  }

  async function uploadGlobalCover(cover){
    const state={cover,buffers:[],gpuByteLength:0,uploadCount:0,maximumUploadChunkBytes:0,resourceCount:0,lastDraw:{visibleInstanceCount:0,drawCallCount:0}};
    const before=counters.postInitializationResourceCreationCount;
    counters.globalCoverAuthorizedResourceCreateCount=(counters.globalCoverAuthorizedResourceCreateCount??0)+2;
    state.vertexShader=createShader(gl.VERTEX_SHADER,GLOBAL_COVER_VS,'GLOBAL_COVER_VS');
    state.program=createProgram(state.vertexShader,resources.geometryFragmentShader,'GLOBAL_COVER_PROGRAM');
    counters.globalCoverAuthorizedResourceCreateCount++;markPostInitializationCreation();counters.vertexArrayCreateCount++;state.vao=gl.createVertexArray();
    if(!state.vao)throw Error('GLOBAL_COVER_VAO_CREATE_FAILED');
    gl.bindVertexArray(state.vao);
    const put=async(target,data)=>{
      counters.globalCoverAuthorizedResourceCreateCount++;markPostInitializationCreation();counters.bufferCreateCount++;const b=gl.createBuffer();if(!b)throw Error('GLOBAL_COVER_BUFFER_CREATE_FAILED');state.buffers.push(b);
      gl.bindVertexArray(state.vao);gl.bindBuffer(target,b);gl.bufferData(target,data.byteLength,gl.STATIC_DRAW);
      const chunk=Math.max(1,Math.floor(262144/data.BYTES_PER_ELEMENT));
      for(let i=0;i<data.length;i+=chunk){const part=data.subarray(i,Math.min(data.length,i+chunk));gl.bindVertexArray(state.vao);gl.bindBuffer(target,b);gl.bufferSubData(target,i*data.BYTES_PER_ELEMENT,part);state.maximumUploadChunkBytes=Math.max(state.maximumUploadChunkBytes,part.byteLength);gl.bindVertexArray(resources.vertexArray);await yieldToBrowserPaint();}
      state.gpuByteLength+=data.byteLength;state.uploadCount++;return b;
    };
    for(const [location,data,size] of [[0,cover.template.positions,3],[1,cover.template.normals,3],[2,cover.template.colors,4],[3,cover.template.rootInfo,4]]){
      const b=await put(gl.ARRAY_BUFFER,data);gl.bindVertexArray(state.vao);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,0,0);
    }
    state.indexBuffer=await put(gl.ELEMENT_ARRAY_BUFFER,cover.template.indices);
    // Float texture records permit arbitrarily spaced LOD without exceeding
    // WebGL's 255-byte vertexAttribPointer stride ceiling.
    counters.globalCoverAuthorizedResourceCreateCount++;state.instanceTexture=createTexture();state.textureWidth=Math.min(1024,gl.getParameter(gl.MAX_TEXTURE_SIZE));
    state.textureHeight=Math.max(1,Math.ceil(cover.records.length/4/state.textureWidth));
    const pixels=new Float32Array(state.textureWidth*state.textureHeight*4);pixels.set(cover.records);
    gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,state.instanceTexture);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,state.textureWidth,state.textureHeight);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    const rowsPerChunk=Math.max(1,Math.floor(262144/(state.textureWidth*16)));
    for(let row=0;row<state.textureHeight;row+=rowsPerChunk){const rows=Math.min(rowsPerChunk,state.textureHeight-row),part=pixels.subarray(row*state.textureWidth*4,(row+rows)*state.textureWidth*4);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,state.instanceTexture);gl.texSubImage2D(gl.TEXTURE_2D,0,0,row,state.textureWidth,rows,gl.RGBA,gl.FLOAT,part);state.maximumUploadChunkBytes=Math.max(state.maximumUploadChunkBytes,part.byteLength);gl.activeTexture(gl.TEXTURE0);gl.bindVertexArray(resources.vertexArray);await yieldToBrowserPaint();}
    state.gpuByteLength+=pixels.byteLength;state.uploadCount++;gl.activeTexture(gl.TEXTURE0);
    if(state.gpuByteLength>8*1024*1024)throw Error('GLOBAL_COVER_GPU_BUDGET_EXCEEDED');
    state.uniforms={};for(const name of ['uInstanceRecords','uInstanceStart','uInstanceStride','uInstanceTextureWidth','uViewProjection','uCameraPosition','uSunDirection','uSunIntensity','uSunColor','uSkyZenithColor','uSkyHorizonColor','uGroundHazeColor','uFogStartDistance','uFogFalloff','uMaximumFogFactor','uDistanceDesaturationStrength','uTerrainPatchClip','uClipBaseTerrain','uGlobalCoverFarPrimitiveIndex','uPlanetRadius','uShorelineSoilCoverage','uLandscapeFloorFootprints[0]','uLandscapeFloorCount'])state.uniforms[name]=gl.getUniformLocation(state.program,name);
    gl.useProgram(state.program);const u=state.uniforms,e=resources.environment;
    gl.uniform3f(u.uSunDirection,e.sunDirection.x,e.sunDirection.y,e.sunDirection.z);gl.uniform1f(u.uSunIntensity,e.sunIntensity);gl.uniform3fv(u.uSunColor,color3(e.sunColor));gl.uniform3fv(u.uSkyZenithColor,color3(e.skyZenithColor));gl.uniform3fv(u.uSkyHorizonColor,resources.skyColor);gl.uniform3fv(u.uGroundHazeColor,color3(e.groundHazeColor));
    for(const [name,key] of [['uFogStartDistance','fogStartDistance'],['uFogFalloff','fogFalloff'],['uMaximumFogFactor','maximumFogFactor'],['uDistanceDesaturationStrength','distanceDesaturationStrength']])gl.uniform1f(u[name],e[key]);
    gl.uniform1i(u.uInstanceRecords,2);gl.uniform1i(u.uInstanceTextureWidth,state.textureWidth);
    gl.uniform1i(u.uClipBaseTerrain,0);gl.uniform1i(u.uGlobalCoverFarPrimitiveIndex,-1);gl.uniform1f(u.uPlanetRadius,planetRadius);gl.uniform1i(u.uShorelineSoilCoverage,1);gl.uniform1i(u.uLandscapeFloorCount,landscapeFloorFootprints.length);gl.uniform4fv(u['uLandscapeFloorFootprints[0]'],landscapeFloorUniforms);
    state.resourceCount=counters.postInitializationResourceCreationCount-before;
    configureClearingProgram(state.program);
    resources.globalCover=state;gl.useProgram(resources.geometryProgram);gl.bindVertexArray(resources.vertexArray);
    const error=gl.getError();if(error!==gl.NO_ERROR)throw Error(`GLOBAL_COVER_UPLOAD_ERROR:${error}`);
  }
  function drawGlobalCover(packet){
    const state=resources.globalCover;if(!state)return;
    const selected=selectHEarthGlobalGroundCoverDraws(state.cover,packet.camera.position,{maximumInstances:4096,maximumDraws:64});
    gl.useProgram(state.program);gl.bindVertexArray(state.vao);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,state.instanceTexture);gl.activeTexture(gl.TEXTURE0);gl.disable(gl.BLEND);gl.depthMask(true);
    gl.uniformMatrix4fv(state.uniforms.uViewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));gl.uniform3f(state.uniforms.uCameraPosition,packet.camera.position.x,packet.camera.position.y,packet.camera.position.z);
    let visible=0;
    for(const draw of selected.draws){
      if(draw.count<=0)continue;
      gl.uniform1i(state.uniforms.uInstanceStart,draw.start);gl.uniform1i(state.uniforms.uInstanceStride,draw.stride);
      gl.drawElementsInstanced(gl.TRIANGLES,state.cover.template.indices.length,gl.UNSIGNED_INT,0,draw.count);visible+=draw.count;
    }
    state.lastDraw={visibleInstanceCount:visible,drawCallCount:selected.draws.filter(d=>d.count>0).length,storedPopulationChanged:false,perFrameUploadBytes:0};
    if(visible>4096||state.lastDraw.drawCallCount>64)throw Error('GLOBAL_COVER_DRAW_BUDGET_EXCEEDED');
    counters.totalDrawnIndexCount+=visible*state.cover.template.indices.length;
    gl.useProgram(resources.geometryProgram);gl.bindVertexArray(resources.vertexArray);
  }

  async function initialize(packet,{onStartupProgress:progressCallback=onStartupProgress}={}) {return await startupMeasure('INITIALIZATION',()=>initializeObserved(packet,progressCallback));}
  async function initializeObserved(packet,progressCallback) {
    if (initialized) throw new Error('R3C_RENDERER_ALREADY_INITIALIZED');
    if (packet.packageIdentity !== rendererInterface.packageIdentity || packet.packageContentDigest !== rendererInterface.packageContentDigest) {
      throw new Error('R3C_INITIAL_PACKET_PACKAGE_MISMATCH');
    }
    resources.geometryVertexShader = createShader(gl.VERTEX_SHADER, VS, 'GV');
    resources.geometryFragmentShader = createShader(gl.FRAGMENT_SHADER, FS, 'GF');
    resources.geometryProgram = createProgram(resources.geometryVertexShader, resources.geometryFragmentShader, 'GP');
    resources.depthVertexShader = createShader(gl.VERTEX_SHADER, DVS, 'DV');
    resources.depthFragmentShader = createShader(gl.FRAGMENT_SHADER, DFS, 'DF');
    resources.depthProgram = createProgram(resources.depthVertexShader, resources.depthFragmentShader, 'DP');
    markPostInitializationCreation(); counters.vertexArrayCreateCount += 1;
    resources.vertexArray = gl.createVertexArray();
    if (!resources.vertexArray) throw new Error('R3C_VERTEX_ARRAY_CREATE_FAILED');
    gl.bindVertexArray(resources.vertexArray);
    const specifications = [
      ['positions', uploadViews.positions, 0, 3, gl.FLOAT, false],
      ['normals', uploadViews.normals, 1, 3, gl.FLOAT, false],
      ['baseColorsLinear', uploadViews.baseColorsLinear, 2, 4, gl.FLOAT, false],
      ['materialParameters', uploadViews.materialParameters, 3, 4, gl.FLOAT, false],
      ['materialModelCodes', uploadViews.materialModelCodes, 4, 1, gl.UNSIGNED_BYTE, true],
      ['surfaceClassCodes', uploadViews.surfaceClassCodes, 5, 1, gl.UNSIGNED_BYTE, true],
      ['primitiveIndices', uploadViews.primitiveIndices, 6, 1, gl.UNSIGNED_SHORT, true],
      ['roleCodes', uploadViews.roleCodes, 7, 1, gl.UNSIGNED_BYTE, true],
      ['coastDistances', coastDistances, 8, 1, gl.FLOAT, false],
      ['contactDistances', contactField.packageDistances, 9, 1, gl.FLOAT, false]
    ];
    let lastStartupPercent=40;
    const totalStartupUploadBytes=specifications.reduce((total,item)=>total+item[1].byteLength,uploadViews.indices.byteLength);
    let uploadedStartupBytes=0;
    const reportUploadProgress=(phase,completed,total,unit,label)=>{const progress=Math.max(lastStartupPercent,40+44*(uploadedStartupBytes/Math.max(1,totalStartupUploadBytes)));lastStartupPercent=progress;progressCallback?.(Object.freeze({phase,completed,total,unit,progress,status:label}));};
    const uploadChunked=async(target,data)=>{
      gl.bufferData(target,data.byteLength,gl.STATIC_DRAW);
      const chunkElements=Math.max(1,Math.floor(262144/data.BYTES_PER_ELEMENT));
      for(let start=0;start<data.length;start+=chunkElements){
        const chunk=data.subarray(start,Math.min(data.length,start+chunkElements));
        gl.bufferSubData(target,start*data.BYTES_PER_ELEMENT,chunk);
        uploadedStartupBytes+=chunk.byteLength;
        reportUploadProgress('GPU_STARTUP_UPLOAD',uploadedStartupBytes,totalStartupUploadBytes,'bytes','Loading world resources');
        await yieldToBrowserPaint();
      }
      counters.bufferUploadCount++;counters.packageBufferUploadCount++;counters.uploadedByteLength+=data.byteLength;
    };
    resources.buffers = [];
    for (const [name, data, location, size, type, integer] of specifications) {
      const buffer = createBuffer(); resources.buffers.push({ name, buffer, byteLength: data.byteLength });
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer); await uploadChunked(gl.ARRAY_BUFFER, data); gl.enableVertexAttribArray(location);
      if (integer) gl.vertexAttribIPointer(location, size, type, 0, 0);
      else gl.vertexAttribPointer(location, size, type, false, 0, 0);
    }
    resources.indexBuffer = createBuffer();
    resources.buffers.push({ name: 'indices', buffer: resources.indexBuffer, byteLength: uploadViews.indices.byteLength });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.indexBuffer); await uploadChunked(gl.ELEMENT_ARRAY_BUFFER, uploadViews.indices);
    resources.colorTexture = createTexture(); resources.depthTexture = createTexture(); resources.geometryFramebuffer = createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, resources.colorTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, resources.depthTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, resources.colorTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, resources.depthTexture, 0);
    requireCompleteFramebuffer('GEOMETRY');
    resources.depthColorTexture = createTexture(); resources.depthFramebuffer = createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, resources.depthColorTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.depthFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, resources.depthColorTexture, 0);
    requireCompleteFramebuffer('DEPTH');
// SHORELINE_SOIL_BEGIN allocation
    // Allocate at initialization; foliage residency supplies the pixels once.
    resources.shorelineSoilTexture=createTexture();
    resources.shorelineSoilCoverage={ready:false,width:104,height:146,grassTuftCount:0};
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,resources.shorelineSoilTexture);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.R8,104,146);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.activeTexture(gl.TEXTURE0);
// SHORELINE_SOIL_END allocation
    resources.uniforms = {
      viewProjection: uniform(resources.geometryProgram, 'uViewProjection'), cameraPosition: uniform(resources.geometryProgram, 'uCameraPosition'),
      sunDirection: uniform(resources.geometryProgram, 'uSunDirection'), sunIntensity: uniform(resources.geometryProgram, 'uSunIntensity'),
      sunColor: uniform(resources.geometryProgram, 'uSunColor'), skyZenithColor: uniform(resources.geometryProgram, 'uSkyZenithColor'),
      skyHorizonColor: uniform(resources.geometryProgram, 'uSkyHorizonColor'), groundHazeColor: uniform(resources.geometryProgram, 'uGroundHazeColor'),
      fogStartDistance: uniform(resources.geometryProgram, 'uFogStartDistance'), fogFalloff: uniform(resources.geometryProgram, 'uFogFalloff'),
      maximumFogFactor: uniform(resources.geometryProgram, 'uMaximumFogFactor'),
      landscapeFloorFootprints:uniform(resources.geometryProgram,'uLandscapeFloorFootprints[0]'),
      landscapeFloorCount:uniform(resources.geometryProgram,'uLandscapeFloorCount'),
      distanceDesaturationStrength: uniform(resources.geometryProgram, 'uDistanceDesaturationStrength'), patchClip: uniform(resources.geometryProgram, 'uTerrainPatchClip'), clipBaseTerrain: uniform(resources.geometryProgram, 'uClipBaseTerrain'), depth: uniform(resources.depthProgram, 'uDepth')
    };
    const environment = packet.environmentUniforms;
    resources.environment=environment;
    resources.uniforms.globalCoverFarPrimitiveIndex=uniform(resources.geometryProgram,'uGlobalCoverFarPrimitiveIndex');
    resources.uniforms.planetRadius=uniform(resources.geometryProgram,'uPlanetRadius');
// SHORELINE_SOIL_BEGIN location
    resources.uniforms.shorelineSoilCoverage=uniform(resources.geometryProgram,'uShorelineSoilCoverage');
// SHORELINE_SOIL_END location
    resources.skyColor = color3(environment.skyHorizonColor).map((value, index) => Math.min(1, value * (index === 2 ? 0.92 : 0.88)));
    resources.clearColorBytes = resources.skyColor.map((entry) => Math.round(entry * 255));
    gl.useProgram(resources.geometryProgram);
    const farSpan=renderPackage.primitiveSpans.find(span=>span.primitiveId==='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION');
    resources.globalCoverFarPrimitiveIndex=farSpan?.primitiveIndex??renderPackage.primitiveSpans.indexOf(farSpan);
    gl.uniform1i(resources.uniforms.globalCoverFarPrimitiveIndex,resources.globalCoverFarPrimitiveIndex);
    gl.uniform1f(resources.uniforms.planetRadius,planetRadius);
    gl.uniform3f(resources.uniforms.sunDirection, environment.sunDirection.x, environment.sunDirection.y, environment.sunDirection.z);
    gl.uniform1f(resources.uniforms.sunIntensity, environment.sunIntensity); gl.uniform3fv(resources.uniforms.sunColor, color3(environment.sunColor));
    gl.uniform3fv(resources.uniforms.skyZenithColor, color3(environment.skyZenithColor)); gl.uniform3fv(resources.uniforms.skyHorizonColor, resources.skyColor);
    gl.uniform3fv(resources.uniforms.groundHazeColor, color3(environment.groundHazeColor)); gl.uniform1f(resources.uniforms.fogStartDistance, environment.fogStartDistance);
    gl.uniform1f(resources.uniforms.fogFalloff, environment.fogFalloff); gl.uniform1f(resources.uniforms.maximumFogFactor, environment.maximumFogFactor);
    gl.uniform1f(resources.uniforms.distanceDesaturationStrength, environment.distanceDesaturationStrength);
// SHORELINE_SOIL_BEGIN sampler
    gl.uniform1i(resources.uniforms.shorelineSoilCoverage,1);
    gl.uniform1i(resources.uniforms.landscapeFloorCount,landscapeFloorFootprints.length);
    gl.uniform4fv(resources.uniforms.landscapeFloorFootprints,landscapeFloorUniforms);
// SHORELINE_SOIL_END sampler
    await initializeClearing(packet);
    counters.staticUniformUpdateCount = 13; initialized = true;
    progressCallback?.(Object.freeze({phase:'GPU_STARTUP_RESOURCES_READY',completed:1,total:1,unit:'initialization',progress:87,status:'Graphics resources initialized'}));
    return getResourceReceipt();
  }

  function bindClearingTextures(){
    if(!resources.clearing)return;
    resources.clearing.textures.forEach((texture,i)=>{gl.activeTexture(gl.TEXTURE0+3+i);gl.bindTexture(gl.TEXTURE_2D,texture);});
    gl.activeTexture(gl.TEXTURE0);
  }
  function configureClearingProgram(program){
    const c=resources.clearing;if(!c)return;
    gl.useProgram(program);
    for(const [i,name] of ['uClearingLeaf','uClearingBark','uClearingSoil','uClearingShadow'].entries())gl.uniform1i(gl.getUniformLocation(program,name),3+i);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,'uClearingLightMatrix'),false,c.matrix);
    gl.uniform4fv(gl.getUniformLocation(program,'uClearingBounds'),c.bounds);
    gl.uniform1i(gl.getUniformLocation(program,'uClearingEnabled'),1);
    bindClearingTextures();
  }
  async function initializeClearing(packet){
    const b=H_EARTH_WOODLAND_CLEARING_BOUNDS;
    if(!b||![b.minX,b.minZ,b.maxX,b.maxZ].every(Number.isFinite)||H_EARTH_WOODLAND_CLEARING_ASSETS.length!==3)throw new Error('CLEARING_STATIC_DESCRIPTOR_INVALID');
    const localPoint=i=>{
      const x=uploadViews.positions[i*3],y=uploadViews.positions[i*3+1],z=uploadViews.positions[i*3+2],h=Math.hypot(x,z),r=planetRadius*Math.atan2(h,y+planetRadius),k=h?r/h:1;
      return {x:x*k,z:z*k};
    };
    const caster=[];
    for(let i=0;i<uploadViews.indices.length;i+=3){
      const ids=[uploadViews.indices[i],uploadViews.indices[i+1],uploadViews.indices[i+2]];
      if(ids.every(id=>{const q=localPoint(id);return uploadViews.materialParameters[id*4+3]===2&&uploadViews.materialParameters[id*4+2]>0&&q.x>=b.minX&&q.x<=b.maxX&&q.z>=b.minZ&&q.z<=b.maxZ;}))caster.push(...ids);
    }
    if(!caster.length)throw new Error('CLEARING_STATIC_CASTERS_EMPTY');
    const images=await Promise.all(H_EARTH_WOODLAND_CLEARING_ASSETS.map(asset=>new Promise((resolve,reject)=>{
      const img=new Image();img.onload=()=>{if(img.naturalWidth!==256||img.naturalHeight!==256)reject(new Error('CLEARING_TEXTURE_DIMENSIONS_INVALID'));else resolve(img);};img.onerror=()=>reject(new Error('CLEARING_TEXTURE_LOAD_FAILED:'+asset.url));img.src=new URL(asset.url,import.meta.url).href;
    })));
    const textures=[];let textureStorageBytes=0;
    for(let i=0;i<images.length;i++){
      const texture=createTexture();textures.push(texture);gl.activeTexture(gl.TEXTURE0+3+i);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texStorage2D(gl.TEXTURE_2D,9,gl.RGBA8,256,256);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gl.RGBA,gl.UNSIGNED_BYTE,images[i]);
      gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,i===0?gl.CLAMP_TO_EDGE:gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,i===0?gl.CLAMP_TO_EDGE:gl.REPEAT);
      for(let d=256;d>=1;d/=2)textureStorageBytes+=d*d*4;
    }
    const center=regionToHEarthPlanetPoint({x:(b.minX+b.maxX)/2,z:(b.minZ+b.maxZ)/2,y:sampleHEarthRun8BSuccessorTerrainField((b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2).elevation+10});
    const sun=packet.environmentUniforms.sunDirection,normalize=a=>{const n=Math.hypot(...a);return a.map(v=>v/n);},cross=(a,c)=>[a[1]*c[2]-a[2]*c[1],a[2]*c[0]-a[0]*c[2],a[0]*c[1]-a[1]*c[0]],dot=(a,c)=>a.reduce((n,v,i)=>n+v*c[i],0);
    const light=normalize([sun.x,sun.y,sun.z]),right=normalize(cross([0,1,0],light)),up=normalize(cross(light,right)),c=[center.x,center.y,center.z];
    const matrix=new Float32Array([right[0]/28,up[0]/28,-light[0]/60,0,right[1]/28,up[1]/28,-light[1]/60,0,right[2]/28,up[2]/28,-light[2]/60,0,-dot(right,c)/28,-dot(up,c)/28,dot(light,c)/60,1]);
    const shadow=createTexture();textures.push(shadow);gl.activeTexture(gl.TEXTURE6);gl.bindTexture(gl.TEXTURE_2D,shadow);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,512,512);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    // D24 consumes at most four bytes per texel on the GPU; report conservative storage.
    textureStorageBytes+=512*512*4;
    const framebuffer=createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,shadow,0);gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);requireCompleteFramebuffer('CLEARING_SHADOW');
    const vs=createShader(gl.VERTEX_SHADER,CLEARING_SHADOW_VS,'CLEARING_SV'),fs=createShader(gl.FRAGMENT_SHADER,CLEARING_SHADOW_FS,'CLEARING_SF'),program=createProgram(vs,fs,'CLEARING_SHADOW_PROGRAM');
    const indexBuffer=createBuffer(),indices=new Uint32Array(caster);gl.bindVertexArray(resources.vertexArray);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);counters.bufferUploadCount++;counters.clearingIndexBufferUploadCount++;counters.uploadedByteLength+=indices.byteLength;
    resources.clearing={textures,framebuffer,program,indexBuffer,matrix,bounds:new Float32Array([b.minX,b.minZ,b.maxX,b.maxZ]),casterIndexCount:indices.length,shadowDrawCount:0,textureStorageBytes,indexStorageBytes:indices.byteLength,gpuByteLength:textureStorageBytes+indices.byteLength,staticShadowRefresh:'ONCE_AFTER_ASSETS_READY',mainDrawCallsAdded:0,perCameraResourceCreation:0};
    gl.useProgram(program);gl.uniformMatrix4fv(gl.getUniformLocation(program,'uLightMatrix'),false,matrix);gl.uniform1i(gl.getUniformLocation(program,'uLeaf'),3);bindClearingTextures();
    // Avoid sampling the depth attachment while writing it.
    gl.activeTexture(gl.TEXTURE6);gl.bindTexture(gl.TEXTURE_2D,null);gl.activeTexture(gl.TEXTURE0);
    gl.viewport(0,0,512,512);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.clearDepth(1);gl.clear(gl.DEPTH_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_INT,0);resources.clearing.shadowDrawCount++;
    // The clearing is initialized before external compact residency is installed.
    // A late compact install must refresh the static depth map separately.
    // Never mistake the original clearing-only map for compact shadow coverage.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,resources.indexBuffer);gl.bindFramebuffer(gl.FRAMEBUFFER,resources.geometryFramebuffer);gl.viewport(0,0,width,height);configureClearingProgram(resources.geometryProgram);
    const error=gl.getError();if(error!==gl.NO_ERROR)throw new Error('CLEARING_GPU_INITIALIZATION_FAILED:'+error);
  }

  function buildInitialRefinementPatch(packet) {
    if (resources.refinement?.created) return resources.refinement;
    const local=packet?.camera?.localAuthoringPosition;if(!local)return null;
    const spacing=4,radius=64,x0=Math.round(local.x/spacing)*spacing,z0=Math.round(local.z/spacing)*spacing,xs=[],zs=[];
    for(let x=x0-radius;x<=x0+radius;x+=spacing)xs.push(x);for(let z=z0-radius;z<=z0+radius;z+=spacing)zs.push(z);
    const vertexCount=xs.length*zs.length,triangleCount=(xs.length-1)*(zs.length-1)*2;if(vertexCount>4096||triangleCount>8192)throw new Error('R3C_REFINEMENT_CEILING_EXCEEDED');
    // Match the immutable package terrain at the patch boundary. Inside it,
    // retain only the additional 4 m field detail over the package surface.
    const terrainSpan=renderPackage.primitiveSpans.find(span=>span.role==='TERRAIN');
    if(!terrainSpan)throw new Error('R3C_REFINEMENT_PACKAGE_TERRAIN_MISSING');
    const terrainPoints=new Array(terrainSpan.vertexCount),baseFieldByVertex=new Map();
    for(let i=0;i<terrainPoints.length;i++){
      const j=(terrainSpan.vertexStart+i)*3,px=uploadViews.positions[j],py=uploadViews.positions[j+1],pz=uploadViews.positions[j+2];
      const h=Math.hypot(px,pz),radial=Math.atan2(h,py+planetRadius)*planetRadius,scale=h>Number.EPSILON?radial/h:0;
      terrainPoints[i]=[px*scale,pz*scale,Math.hypot(h,py+planetRadius)-planetRadius];
    }
    const triangles=[];
    for(let j=terrainSpan.indexStart;j<terrainSpan.indexStart+terrainSpan.indexCount;j+=3){
      const ids=[uploadViews.indices[j],uploadViews.indices[j+1],uploadViews.indices[j+2]].map(i=>i-terrainSpan.vertexStart);
      const [a,b,c]=ids.map(i=>terrainPoints[i]);
      const minX=Math.min(a[0],b[0],c[0]),maxX=Math.max(a[0],b[0],c[0]),minZ=Math.min(a[1],b[1],c[1]),maxZ=Math.max(a[1],b[1],c[1]);
      if(maxX<x0-radius-1||minX>x0+radius+1||maxZ<z0-radius-1||minZ>z0+radius+1)continue;
      triangles.push({ids,a,b,c,minX,maxX,minZ,maxZ});
    }
    const packageSurface=(x,z)=>{
      for(const t of triangles){
        if(x<t.minX-0.0001||x>t.maxX+0.0001||z<t.minZ-0.0001||z>t.maxZ+0.0001)continue;
        const {a,b,c}=t,den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
        if(Math.abs(den)<1e-9)continue;
        const wa=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(z-c[1]))/den;
        const wb=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(z-c[1]))/den,wc=1-wa-wb;
        if(wa<-.0001||wb<-.0001||wc<-.0001)continue;
        const field=t.ids.map((id)=>{
          if(!baseFieldByVertex.has(id)){
            const p=terrainPoints[id],sample=sampleHEarthRun8BSuccessorTerrainField(p[0],p[1]);
            if(sample?.valid!==true)throw new Error('R3C_REFINEMENT_BASE_FIELD_SAMPLE_INVALID');
            baseFieldByVertex.set(id,sample.elevation);
          }
          return baseFieldByVertex.get(id);
        });
        return {height:wa*a[2]+wb*b[2]+wc*c[2],field:wa*field[0]+wb*field[1]+wc*field[2]};
      }
      throw new Error(`R3C_REFINEMENT_PACKAGE_SURFACE_MISSING:${x}:${z}`);
    };
    const positions=new Float32Array(vertexCount*3),normals=new Float32Array(vertexCount*3),patchCoastDistances=new Float32Array(vertexCount);let vi=0;
    for(const z of zs)for(const x of xs){
      const t=sampleHEarthRun8BSuccessorTerrainField(x,z);if(t?.valid!==true)throw new Error('R3C_REFINEMENT_TERRAIN_SAMPLE_INVALID');
      const surface=packageSurface(x,z),edge=Math.min(x-(x0-radius),(x0+radius)-x,z-(z0-radius),(z0+radius)-z);
      const fade=Math.min(1,Math.max(0,edge/12));const smoothFade=fade*fade*(3-2*fade);
      const elevation=surface.height+(t.elevation-surface.field)*smoothFade;
      const q=regionToHEarthPlanetPoint({x,y:elevation,z});positions.set([q.x,q.y+0.012,q.z],vi*3);
      normals.set([t.normal.x,t.normal.y,t.normal.z],vi*3);patchCoastDistances[vi]=getHEarthSignedCoastDistanceMeters(x,z);vi++;
    }
    const indices=new Uint32Array(triangleCount*3);let ii=0,cols=xs.length;for(let r=0;r<zs.length-1;r++)for(let c=0;c<cols-1;c++){const a=r*cols+c,b=a+1,d=(r+1)*cols+c+1,e=(r+1)*cols+c;indices.set([a,e,b,b,e,d],ii);ii+=6;}
    contactField=createExposedWaterContactField(uploadViews,renderPackage.primitiveSpans,{positions,indices,x:x0,z:z0});
    contactFieldBuildCount++;contactFieldTotalMilliseconds+=contactField.stats.initializationMilliseconds;
    const contactBuffer=resources.buffers.find(entry=>entry.name==='contactDistances').buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER,contactBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER,0,contactField.packageDistances);
    counters.contactOwnershipBufferUpdateCount=(counters.contactOwnershipBufferUpdateCount??0)+1;
    const vao=gl.createVertexArray();gl.bindVertexArray(vao);const bufs=[];
    const bind=(loc,data,size,integer=false,type=gl.FLOAT)=>{const b=gl.createBuffer();bufs.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);integer?gl.vertexAttribIPointer(loc,size,type,0,0):gl.vertexAttribPointer(loc,size,type,false,0,0);counters.refinementBufferUploadCount++;};
    bind(0,positions,3);bind(1,normals,3);const colors=new Float32Array(vertexCount*4),mats=new Float32Array(vertexCount*4);for(let i=0;i<vertexCount;i++){colors.set([.22,.24,.16,1],i*4);mats.set([.72,.18,.05,.12],i*4)}bind(2,colors,4);bind(3,mats,4);
    const mm=new Uint8Array(vertexCount);mm.fill(1);bind(4,mm,1,true,gl.UNSIGNED_BYTE);const sc=new Uint8Array(vertexCount);sc.fill(4);bind(5,sc,1,true,gl.UNSIGNED_BYTE);bind(6,new Uint16Array(vertexCount),1,true,gl.UNSIGNED_SHORT);const rc=new Uint8Array(vertexCount);rc.fill(1);bind(7,rc,1,true,gl.UNSIGNED_BYTE);bind(8,patchCoastDistances,1);bind(9,contactField.patchDistances,1);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);counters.refinementBufferUploadCount++;
    resources.refinement={surface:{positions,indices,clip:[x0-64+.04,z0-64+.04,x0+64-.04,z0+64-.04]},created:true,vao,buffers:bufs,indexBuffer:ib,indexCount:indices.length,vertexCount,triangleCount,anchor:{x:x0,z:z0},fallbackAvailable:true};counters.refinementResourceCreateCount++;gl.bindVertexArray(resources.vertexArray);return resources.refinement;
  }
  function activateInitialRefinement(packet){if(vegetationPreparation)throw new Error('GLOBAL_COVER_REFINEMENT_MUST_PRECEDE_RESIDENCY');if(!initialized)throw new Error('R3C_RENDERER_NOT_INITIALIZED');return buildInitialRefinementPatch(packet);}

  let preparedVegetationBatch=null,vegetationBatchPreparation=null;
  function prepareNextVegetationBatch(){
    if(!vegetationPreparationComplete)return Promise.reject(new Error('R3C_VEGETATION_PREPARATION_PENDING'));
    const state=resources.vegetation,descriptor=state.truth?.batches[state.nextBatchIndex];
    if(state.complete||!descriptor)return Promise.resolve();
    if(preparedVegetationBatch)return Promise.resolve();
    if(vegetationBatchPreparation)return vegetationBatchPreparation;
    if(state.nextBatchIndex===0)globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('VEGETATION_START');
    const operation=()=>createHEarthRun8ER2VegetationPresentationBatchAsync(descriptor.batchId,{deferVegetation});
    const diagnostics=globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS;
    vegetationBatchPreparation=(diagnostics?.measureAsync?diagnostics.measureAsync('VEGETATION_BATCH_GEOMETRY',operation):operation()).then(batch=>{
      if(batch.batchId!==descriptor.batchId)throw new Error('R3C_VEGETATION_PREPARED_BATCH_MISMATCH');
      preparedVegetationBatch=batch;
    }).finally(()=>{vegetationBatchPreparation=null;});
    return vegetationBatchPreparation;
  }
  function materializeNextVegetationBatch(){return startupMeasure('VEGETATION_BATCH_RESIDENCY',()=>materializeNextVegetationBatchObserved());}
  function materializeNextVegetationBatchObserved(){
    if(!vegetationPreparationComplete)throw new Error('R3C_VEGETATION_PREPARATION_PENDING');
    if(!initialized)throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    const state=resources.vegetation;if(!state.truth)throw new Error('R3C_VEGETATION_WORLD_TRUTH_PENDING');if(state.complete)return Object.freeze({complete:true,residentInstanceCount:counters.vegetationResidentInstanceCount});
    const descriptor=state.truth.batches[state.nextBatchIndex];if(!descriptor){state.complete=true;return Object.freeze({complete:true,residentInstanceCount:counters.vegetationResidentInstanceCount});}
    if(state.nextBatchIndex===0)globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('VEGETATION_START');
    if(deferVegetation&&!preparedVegetationBatch)throw new Error('R3C_VEGETATION_BATCH_PREPARATION_PENDING');
    const batch=preparedVegetationBatch??startupMeasure('VEGETATION_BATCH_GEOMETRY',()=>createHEarthRun8ER2VegetationPresentationBatch(descriptor.batchId,{deferVegetation}));
    preparedVegetationBatch=null;
// SHORELINE_SOIL_BEGIN upload
    if(!resources.shorelineSoilCoverage.ready&&batch.primitives.some(p=>p.metadata?.oasisFoliage&&p.primitiveId.includes(':GRASS:'))){
      const mask=buildHEarthOasisGrassSoilCoverage(batch.primitives);
      if(mask.width!==104||mask.height!==146||mask.grassTuftCount!==350)throw new Error('OASIS_SOIL_COVERAGE_IDENTITY_MISMATCH');
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,resources.shorelineSoilTexture);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
      gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,mask.width,mask.height,gl.RED,gl.UNSIGNED_BYTE,mask.pixels);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);gl.activeTexture(gl.TEXTURE0);
      counters.shorelineSoilTextureUploadCount++;counters.shorelineSoilUploadedByteLength+=mask.pixels.byteLength;
      const {pixels,...summary}=mask;
      resources.shorelineSoilCoverage={...summary,ready:true,derivedFrom:'EXISTING_OASIS_GRASS_ROOTS',terrainGeometryMutated:false};
    }
// SHORELINE_SOIL_END upload
    if(batch.instanceCount!==descriptor.count||batch.placementIds.length!==descriptor.count)throw new Error('R3C_VEGETATION_BATCH_IDENTITY_MISMATCH');
    for(const id of batch.placementIds){if(state.residentPlacementIds.has(id))throw new Error('R3C_VEGETATION_DUPLICATE_PLACEMENT');state.residentPlacementIds.add(id);}
    const positions=[],normals=[],colors=[],mats=[],models=[],surfaces=[],primitiveIds=[],roles=[],indices=[];let vertexOffset=0;
    const normalize=(x,y,z)=>{const n=Math.hypot(x,y,z)||1;return [x/n,y/n,z/n];};
    for(let pi=0;pi<batch.primitives.length;pi++){const primitive=batch.primitives[pi],g=primitive.geometry,verts=g?.vertices??[],local=g?.indices??[];if(!verts.length||!local.length)throw new Error('R3C_VEGETATION_PRIMITIVE_GEOMETRY_INVALID');
      const sums=Array.from({length:verts.length},()=>[0,0,0]);for(let k=0;k<local.length;k+=3){const ia=local[k],ib=local[k+1],ic=local[k+2],a=verts[ia],b=verts[ib],d=verts[ic],ab=[b.x-a.x,b.y-a.y,b.z-a.z],ad=[d.x-a.x,d.y-a.y,d.z-a.z],n=[ab[1]*ad[2]-ab[2]*ad[1],ab[2]*ad[0]-ab[0]*ad[2],ab[0]*ad[1]-ab[1]*ad[0]];for(const id of [ia,ib,ic])for(let q=0;q<3;q++)sums[id][q]+=n[q];}
      const intent=String(primitive?.materialHint?.materialIntent??''),rgba=intent.includes('TRUNK')||intent.includes('WOODY')?[89,63,39,255]:intent.includes('CONIFER')?[38,73,48,255]:intent.includes('SHRUB')?[52,94,52,255]:[78,126,65,255];
      // Bounded oasis assets carry explicit per-vertex sRGB colors; other vegetation keeps its existing palette.
      const vertexColors=primitive?.metadata?.oasisFoliage?.vertexColorsSrgb;
      if(vertexColors!==undefined&&(!Array.isArray(vertexColors)||vertexColors.length!==verts.length||vertexColors.some(c=>!Array.isArray(c)||c.length!==3||c.some(v=>!Number.isFinite(v)||v<0||v>1))))throw new Error('OASIS_VERTEX_COLOR_STREAM_INVALID');
      for(let vi=0;vi<verts.length;vi++){const v=verts[vi],n=g?.normals?.[vi],nn=n&&[n.x,n.y,n.z].every(Number.isFinite)?[n.x,n.y,n.z]:normalize(...sums[vi]);positions.push(v.x,v.y,v.z);normals.push(...nn);const srgb=vertexColors?vertexColors[vi]:rgba.slice(0,3).map(x=>x/255);colors.push(...srgb.map(s=>s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4)),1);mats.push(0,0,0,vertexColors?1:0);models.push(0);surfaces.push(255);primitiveIds.push(pi);roles.push(3);}
      for(const id of local)indices.push(vertexOffset+id);vertexOffset+=verts.length;
    }
    const vao=gl.createVertexArray();if(!vao)throw new Error('R3C_VEGETATION_VAO_CREATE_FAILED');gl.bindVertexArray(vao);const bufs=[];
    const bind=(loc,data,size,integer=false,type=gl.FLOAT)=>{const b=gl.createBuffer();if(!b)throw new Error('R3C_VEGETATION_BUFFER_CREATE_FAILED');bufs.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);integer?gl.vertexAttribIPointer(loc,size,type,0,0):gl.vertexAttribPointer(loc,size,type,false,0,0);counters.vegetationBufferUploadCount++;};
    bind(0,new Float32Array(positions),3);bind(1,new Float32Array(normals),3);bind(2,new Float32Array(colors),4);bind(3,new Float32Array(mats),4);bind(4,new Uint8Array(models),1,true,gl.UNSIGNED_BYTE);bind(5,new Uint8Array(surfaces),1,true,gl.UNSIGNED_BYTE);bind(6,new Uint16Array(primitiveIds),1,true,gl.UNSIGNED_SHORT);bind(7,new Uint8Array(roles),1,true,gl.UNSIGNED_BYTE);bind(8,new Float32Array(vertexOffset),1);bind(9,new Float32Array(vertexOffset),1);
    const ib=gl.createBuffer();if(!ib)throw new Error('R3C_VEGETATION_INDEX_BUFFER_CREATE_FAILED');gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),gl.STATIC_DRAW);counters.vegetationBufferUploadCount++;
    state.residentBatches.push({batch,vao,buffers:bufs,indexBuffer:ib,indexCount:indices.length});gl.bindVertexArray(resources.vertexArray);state.nextBatchIndex+=1;counters.vegetationBatchMaterializationCount+=1;counters.vegetationResidentInstanceCount+=batch.instanceCount;counters.vegetationResidentPrimitiveCount+=batch.primitives.length;
    if(state.nextBatchIndex===state.truth.batches.length){state.complete=true;if(counters.vegetationResidentInstanceCount!==state.truth.instanceCount||state.residentPlacementIds.size!==state.truth.instanceCount)throw new Error('R3C_VEGETATION_EVENTUAL_RESIDENCY_INCOMPLETE');}
    if(state.complete)globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.timingMark?.('VEGETATION_COMPLETE');
    return Object.freeze({complete:state.complete,batchId:descriptor.batchId,residentInstanceCount:counters.vegetationResidentInstanceCount,residentBatchCount:state.nextBatchIndex});
  }

  function renderFrame(packet) {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    if (packet.packageIdentity !== rendererInterface.packageIdentity || packet.packageContentDigest !== rendererInterface.packageContentDigest) throw new Error('R3C_FRAME_PACKET_PACKAGE_MISMATCH');
    if (!Array.isArray(packet.camera.viewProjectionMatrix) || packet.camera.viewProjectionMatrix.length !== 16 || packet.camera.viewProjectionMatrix.some((value) => !finite(value))) throw new Error('R3C_VIEW_PROJECTION_INVALID');
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer); gl.viewport(0, 0, width, height);
    gl.clearColor(...resources.skyColor, 1); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);
// SHORELINE_SOIL_BEGIN binding
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,resources.shorelineSoilTexture);gl.activeTexture(gl.TEXTURE0);
// SHORELINE_SOIL_END binding
    bindClearingTextures();
    gl.uniformMatrix4fv(resources.uniforms.viewProjection, false, new Float32Array(packet.camera.viewProjectionMatrix));
    gl.uniform3f(resources.uniforms.cameraPosition, packet.camera.position.x, packet.camera.position.y, packet.camera.position.z);
    const patch=resources.refinement;
    if(patch?.created){
      const {x,z}=patch.anchor;
      gl.uniform4f(resources.uniforms.patchClip,x-64+0.04,z-64+0.04,x+64-0.04,z+64-0.04);
      gl.uniform1i(resources.uniforms.clipBaseTerrain,1);
    }else gl.uniform1i(resources.uniforms.clipBaseTerrain,0);
    counters.cameraUniformUpdateCount += patch?.created?4:3;
    for (const range of packet.drawRanges) {
      if (range.indexStart === sandRange.indexStart && range.indexCount === sandRange.indexCount) continue;
      if (range.transparencyClass === 'TRANSLUCENT') {
        gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
      } else { gl.disable(gl.BLEND); gl.depthMask(true); }
      gl.drawElements(gl.TRIANGLES, range.indexCount, gl.UNSIGNED_INT, range.indexStart * 4);
      counters.geometryDrawCallCount += 1; counters.totalDrawnIndexCount += range.indexCount;
    }
    if(resources.refinement?.created){gl.uniform1i(resources.uniforms.clipBaseTerrain,0);gl.disable(gl.BLEND);gl.depthMask(true);gl.bindVertexArray(resources.refinement.vao);gl.drawElements(gl.TRIANGLES,resources.refinement.indexCount,gl.UNSIGNED_INT,0);counters.refinementDrawCallCount++;gl.bindVertexArray(resources.vertexArray);}
    gl.uniform1i(resources.uniforms.clipBaseTerrain,0);gl.disable(gl.BLEND);gl.depthMask(true);for(const resident of resources.vegetation.residentBatches){gl.bindVertexArray(resident.vao);gl.drawElements(gl.TRIANGLES,resident.indexCount,gl.UNSIGNED_INT,0);counters.vegetationDrawCallCount++;counters.totalDrawnIndexCount+=resident.indexCount;}gl.bindVertexArray(resources.vertexArray);
    drawGlobalCover(packet);
    // Draw only explicitly installed, qualified compact color residency.
    // No replacement of existing woodland geometry is inferred by this hook.
    if (resources.fourTreeCompactPassReady === true) {
      bindFourTreeCompactMatrix(gl, resources.fourTreeCompactPrograms.color, 'uCompactViewProjection', packet.camera.viewProjectionMatrix);
      drawFourTreeCompactPayload(undefined, 'color');
      gl.bindVertexArray(resources.vertexArray);
    }
    gl.depthMask(true); gl.disable(gl.BLEND);
    const error = gl.getError(); if (error !== gl.NO_ERROR) throw new Error(`R3C_DRAW_ERROR:${error}`);
    counters.frameCount += 1;
  }
  function presentColorFrame() {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, resources.geometryFramebuffer); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0,0,width,height,0,0,width,height,gl.COLOR_BUFFER_BIT,gl.NEAREST); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    counters.visiblePresentationCount += 1; return Object.freeze({ frameNumber: counters.frameCount, width, height });
  }
  function captureColorFrame(label, { includePng = true } = {}) {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer); gl.finish(); counters.gpuFinishCount += 1;
    const pixels = new Uint8Array(width * height * 4); gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels); counters.colorReadbackCount += 1;
    const summary = summarize(pixels, resources.clearColorBytes);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, resources.geometryFramebuffer); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0,0,width,height,0,0,width,height,gl.COLOR_BUFFER_BIT,gl.NEAREST); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const pngDataUrl = includePng ? canvas.toDataURL('image/png') : null; if (includePng) counters.pngEncodingCount += 1;
    return Object.freeze({ label, frameNumber: counters.frameCount, width, height, summary, pngDataUrl });
  }
  function captureDepthSummary() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.depthFramebuffer); gl.viewport(0,0,width,height); gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.useProgram(resources.depthProgram); gl.bindVertexArray(null); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, resources.depthTexture);
    gl.uniform1i(resources.uniforms.depth,0); gl.drawArrays(gl.TRIANGLES,0,3); counters.depthVisualizationDrawCallCount += 1; gl.finish(); counters.gpuFinishCount += 1;
    const pixels = new Uint8Array(width*height*4); gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels); counters.depthReadbackCount += 1;
    return summarize(pixels,[0,0,0]);
  }
  // Gen2633: explicitly managed compact leaf residency. Never silently replace
  // the approved woodland geometry before the color/shadow path is qualified.
  function refreshFourTreeCompactShadow(duringInstallation = false) {
    if (!initialized || !resources.clearing || (!duringInstallation && resources.fourTreeCompactPassReady !== true) || !resources.fourTreeCompact) {
      throw new Error('FOUR_TREE_COMPACT_SHADOW_REFRESH_NOT_READY');
    }
    const clearing = resources.clearing;
    gl.bindFramebuffer(gl.FRAMEBUFFER, clearing.framebuffer);
    gl.viewport(0, 0, 512, 512);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    try {
      // Preserve the original clearing casters: rebuild the depth map before
      // adding the compact instances. This is not a color or visual acceptance.
      gl.clearDepth(1);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.useProgram(clearing.program);
      gl.uniformMatrix4fv(gl.getUniformLocation(clearing.program,'uLightMatrix'),false,clearing.matrix);
      gl.uniform1i(gl.getUniformLocation(clearing.program,'uLeaf'),3);
      bindClearingTextures();
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D,null);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindVertexArray(resources.vertexArray);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,clearing.indexBuffer);
      gl.drawElements(gl.TRIANGLES,clearing.casterIndexCount,gl.UNSIGNED_INT,0);
      bindFourTreeCompactMatrix(gl, resources.fourTreeCompactPrograms.shadow, 'uCompactLightMatrix', clearing.matrix);
      drawFourTreeCompactPayload(undefined,'shadow');
      const error=gl.getError();
      if(error!==gl.NO_ERROR)throw new Error('FOUR_TREE_COMPACT_SHADOW_REFRESH_GPU_ERROR:'+error);
      clearing.shadowDrawCount += 2;
    } finally {
      gl.bindVertexArray(resources.vertexArray);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,resources.indexBuffer);
      gl.bindFramebuffer(gl.FRAMEBUFFER,resources.geometryFramebuffer);
      gl.viewport(0,0,width,height);
      configureClearingProgram(resources.geometryProgram);
    }
  }
  function installFourTreeCompactPayload(payload) {
    if (!initialized) throw new Error('FOUR_TREE_COMPACT_RENDERER_NOT_INITIALIZED');
    if (resources.fourTreeCompact) throw new Error('FOUR_TREE_COMPACT_ALREADY_INSTALLED');
    // A qualified draw program and quad indices opt into transactional residency.
    // Without them, preserve the previous buffer-only staging contract.
    const hasDrawInputs = payload?.program != null || payload?.indexData != null || payload?.shadowProgram != null;
    if (hasDrawInputs && (!payload?.program || !payload?.indexData || !payload?.shadowProgram)) {
      throw new TypeError('FOUR_TREE_COMPACT_BOTH_PASSES_REQUIRED');
    }
    // Never accept a caller-supplied program as evidence that both passes are
    // integrated. Keep the staged representation separate from world drawing.
    const allocated = hasDrawInputs
      ? createFourTreeCompactResidency(gl, payload)
      : createFourTreeCompactGpuBuffers(gl, payload);
    if (hasDrawInputs) {
      try {
        bindFourTreeCompactReconstructionUniforms(gl, payload.program, payload.reconstruction);
        bindFourTreeCompactReconstructionUniforms(gl, payload.shadowProgram, payload.reconstruction);
      } catch (error) {
        allocated.dispose();
        throw error;
      }
    }
    resources.fourTreeCompact = allocated;
    resources.fourTreeCompactPrograms = hasDrawInputs ? {color:payload.program,shadow:payload.shadowProgram} : null;
    // Transactional activation: visibility is withheld until the static
    // clearing shadow map has been regenerated successfully.
    resources.fourTreeCompactPassReady = false;
    if (hasDrawInputs) {
      try {
        refreshFourTreeCompactShadow(true);
        resources.fourTreeCompactPassReady = true;
      } catch (error) {
        resources.fourTreeCompactPassReady = false;
        allocated.dispose();
        resources.fourTreeCompact = null;
        resources.fourTreeCompactPrograms = null;
        throw error;
      }
    }
    return allocated.accounting;
  }
  function drawFourTreeCompactPayload(instanceCount, pass = 'color') {
    const residency = resources.fourTreeCompact;
    if (!residency || typeof residency.draw !== 'function') {
      throw new Error('FOUR_TREE_COMPACT_DRAW_RESIDENCY_NOT_INSTALLED');
    }
    // The renderer controls pass selection. Staging alone does not authorize
    // drawing over the approved existing vegetation.
    return residency.draw(instanceCount === undefined ? FOUR_TREE_COMPACT_CONTRACT.leafCount : instanceCount, pass);
  }
  function releaseFourTreeCompactPayload() {
    if (!resources.fourTreeCompact) return false;
    resources.fourTreeCompact.dispose();
    resources.fourTreeCompact = null;
    resources.fourTreeCompactPrograms = null;
    resources.fourTreeCompactPassReady = false;
    return true;
  }
  function getResourceReceipt() {
    const debugRenderer = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
      presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID,
      presentationProfile: {
        terrainScaleCues: true, slopeReadability: true, routeContainment: true,
        manorSiteDifferentiation: true, cavernExteriorRelationDifferentiation: true,
        sharedMacroFrequencyCorrection: true,
        lawfulSlopeCurvatureModulation: true,
        boundedContactDepthReinforcement: true,
        temporallyStableWorldSpaceVariation: true,
        regressionColorDiversityRestoration: true,
        cavernNearThresholdReinforcement: true,
        geometryMutation: false, terrainMutation: false, placementMutation: false,
        cameraMutation: false, touchMutation: false
      },
      initialized, fourTreeCompact: resources.fourTreeCompact ? { ...resources.fourTreeCompact.accounting, installed:true, colorShadowIntegrationQualified:resources.fourTreeCompactPassReady === true } : { installed:false, actualUploadedBytes:0 }, dimensions: { width, height },
      context: {
        created: true, lost: gl.isContextLost(), vendor: gl.getParameter(gl.VENDOR), renderer: gl.getParameter(gl.RENDERER),
        unmaskedVendor: debugRenderer ? gl.getParameter(debugRenderer.UNMASKED_VENDOR_WEBGL) : null,
        unmaskedRenderer: debugRenderer ? gl.getParameter(debugRenderer.UNMASKED_RENDERER_WEBGL) : null,
        version: gl.getParameter(gl.VERSION), shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      },
      package: {
        logicalPromotedIdentity: LOGICAL_ID, runtimeIdentity: renderPackage.packageIdentity, runtimeContentDigest: renderPackage.contentDigest,
        primitiveCount: renderPackage.primitiveCount, vertexCount: renderPackage.vertexCount, triangleCount: renderPackage.triangleCount,
        indexCount: renderPackage.indexCount, drawRangeCount: renderPackage.drawRanges.length,
        canonicalGpuTransport: uploadViews.deterministicTransportEncoding === true
      },
      rendererInterface: {
        contractId: rendererInterface.contractId, attributeCount: rendererInterface.attributeLayout.length,
        uniformCount: rendererInterface.frameUniformNames.length, drawRangeCount: rendererInterface.drawRanges.length
      },
      counters: { ...counters },
// SHORELINE_SOIL_BEGIN receipt
      shorelineSoilCoverage:{...resources.shorelineSoilCoverage},
      landscapeFloor:{treeCount:landscapeFloorFootprints.length,floorContentDigest:renderPackage.landscapeFloorContentDigest,source:'ACCEPTED_CLUSTER_A_MANIFEST',worldSpace:'PROJECTED_WORLD_XZ',terrainGeometryChanged:false,castShadowClaim:false},
// SHORELINE_SOIL_END receipt
      persistentObjectCounts: { contexts: 1, programs: counters.programCreateCount, shaders: counters.shaderCreateCount, vertexArrays: counters.vertexArrayCreateCount+(resources.refinement?.created?1:0)+resources.vegetation.residentBatches.length, gpuBuffers: counters.bufferCreateCount+(resources.refinement?.buffers.length??0)+(resources.refinement?.indexBuffer?1:0)+resources.vegetation.residentBatches.reduce((n,b)=>n+(b.buffers?.length??0)+(b.indexBuffer?1:0),0), textures: counters.textureCreateCount, framebuffers: counters.framebufferCreateCount },
      globalGroundCover: resources.globalCover?{...resources.globalCover.cover.receipt,prepared:true,storedInstanceCount:resources.globalCover.cover.receipt.instanceCount,gpuByteLength:resources.globalCover.gpuByteLength,uploadCount:resources.globalCover.uploadCount,maximumUploadChunkBytes:resources.globalCover.maximumUploadChunkBytes,authorizedPostReadyResourceCount:resources.globalCover.resourceCount,...resources.globalCover.lastDraw}: {prepared:false,storedInstanceCount:0},
      woodlandClearing:resources.clearing?{ready:true,textureCount:4,colorTextureDimensions:[256,256],shadowDimensions:[512,512],shadowFormat:'DEPTH_COMPONENT24',programsAdded:1,shadersAdded:2,framebuffersAdded:1,indexBuffersAdded:1,indexUploadCount:counters.clearingIndexBufferUploadCount,vertexArraysAdded:0,vertexAttributesAdded:0,colorTextureMipLevels:9,textureStorageBytes:resources.clearing.textureStorageBytes,indexStorageBytes:resources.clearing.indexStorageBytes,gpuByteLength:resources.clearing.gpuByteLength,casterIndexCount:resources.clearing.casterIndexCount,shadowDrawCount:resources.clearing.shadowDrawCount,staticShadowRefresh:resources.clearing.staticShadowRefresh,mainDrawCallsAdded:0,perCameraResourceCreation:0,attributeProjection:uploadViews.canonicalizationReceipt.woodlandClearingProjection}: {ready:false},
      resourceIdentityStable: initialized && Boolean(resources.clearing?.program&&resources.clearing?.framebuffer&&resources.clearing?.indexBuffer&&resources.clearing?.textures.length===4) && resources.buffers?.length === 11 && Boolean(resources.geometryProgram && resources.depthProgram && resources.vertexArray && resources.geometryFramebuffer && resources.depthFramebuffer),
      packageUploadedOnce: counters.packageBufferUploadCount === 11 && counters.clearingIndexBufferUploadCount === (resources.clearing?1:0) && counters.bufferUploadCount === counters.packageBufferUploadCount+counters.clearingIndexBufferUploadCount && counters.postInitializationBufferUploadCount === 0,
      noUnauthorizedPostInitializationResourceCreation: counters.postInitializationResourceCreationCount === (counters.globalCoverAuthorizedResourceCreateCount??0),
      noUnauthorizedPostInitializationBufferUpload: counters.postInitializationBufferUploadCount === 0 && (counters.contactOwnershipBufferUpdateCount??0) === 0,
      authorizedVegetationPostReadyResidency: true,
      refinementResourceAuthorized:true, refinementResourceCreated:resources.refinement?.created===true,
      refinementResourceBufferUploadCount:counters.refinementBufferUploadCount,
      refinementPatchVertexCount:resources.refinement?.vertexCount??0, refinementPatchTriangleCount:resources.refinement?.triangleCount??0,
      refinementAnchor:resources.refinement?.anchor??null, refinementFallbackAvailable:resources.refinement?.fallbackAvailable===true,
      contactField:{...contactField.stats,buildCount:contactFieldBuildCount,totalBuildMilliseconds:contactFieldTotalMilliseconds},
      vegetationResidency:{canonicalPreparationTiming:getHEarthRun8ER2CanonicalPreparationTiming(),...(globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getMilestoneTiming?{timing:globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS.getMilestoneTiming()}:{}),preparationComplete:vegetationPreparationComplete,preparationProgress:vegetationPreparationProgress,validationStatus:vegetationTruth?'VALIDATED':'PENDING_POST_READY_VALIDATION',manifestSha256:vegetationTruth?.qualifiedManifestIdentity.manifestSha256??H_EARTH_GEN2521_QUALIFIED_VEGETATION_MANIFEST_IDENTITY.manifestSha256,totalInstanceCount:vegetationTruth?.instanceCount??H_EARTH_GEN2521_QUALIFIED_VEGETATION_MANIFEST_IDENTITY.instanceCount,totalBatchCount:vegetationTruth?.batches.length??H_EARTH_GEN2521_QUALIFIED_VEGETATION_MANIFEST_IDENTITY.batchCount,maxInstancesPerBatch:vegetationTruth?.maxInstancesPerMaterializationBatch??H_EARTH_GEN2521_QUALIFIED_VEGETATION_MANIFEST_IDENTITY.maxInstancesPerBatch,residentInstanceCount:counters.vegetationResidentInstanceCount,residentBatchCount:counters.vegetationBatchMaterializationCount,residentPrimitiveCount:counters.vegetationResidentPrimitiveCount,complete:resources.vegetation.complete,droppedPlacementCount:vegetationTruth?.droppedPlacementCount??null,worldRebuildCount:counters.worldRebuildCount,cameraIndependent:vegetationTruth?.cameraIndependent??null},
      canonicalPackageMutated:false
    };
  }
  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID,
    initialize, installFourTreeCompactPayload, drawFourTreeCompactPayload, releaseFourTreeCompactPayload, activateInitialRefinement, prepareVegetationResidency, prepareNextVegetationBatch, materializeNextVegetationBatch, renderFrame, presentColorFrame, captureColorFrame, captureDepthSummary, getResourceReceipt
  });
}
export default createHEarthRun8ER3CPersistentRenderer;
