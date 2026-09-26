/** H-Earth T4 static GPU batches v1. No renderer/framebuffer/presentation ownership. */
import { H_EARTH_T4_FROZEN_PLACEMENT } from './t4-frozen-placement-v1.js';
import { regionToHEarthPlanetPoint, getHEarthRegionTangentBasis } from './planetary-world-frame.js';
import { sampleHEarthRun8BSuccessorTerrainElevation, sampleHEarthRun8BSuccessorTerrainField } from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';

// T4.3 primitive-quality geometry. Placement and draw-class budgets remain frozen.
const TUFT_VERTICES = new Float32Array([
  -.13,0,0, .13,0,0, 0,.78,0,
  0,0,-.13, 0,0,.13, 0,.78,0,
  -.09,0,-.09, .09,0,.09, 0,.70,0,
  -.09,0,.09, .09,0,-.09, 0,.70,0
]);
const ROCK_VERTICES = new Float32Array([
  -.34,0,-.24, .30,0,-.22, .25,.22,.24,
  -.34,0,-.24, .25,.22,.24, -.24,.08,.30,
  -.34,0,-.24, .08,.34,-.03, .30,0,-.22,
  .30,0,-.22, .08,.34,-.03, .25,.22,.24,
  .25,.22,.24, .08,.34,-.03, -.24,.08,.30,
  -.24,.08,.30, .08,.34,-.03, -.34,0,-.24
]);

export function getHEarthT4TerrainElevationCorrespondence(){
  const records=H_EARTH_T4_FROZEN_PLACEMENT.instances.map(v=>{
    const currentElevation=sampleHEarthRun8BSuccessorTerrainElevation(v.x,v.z);
    return Object.freeze({kind:v.kind,family:v.family,x:v.x,z:v.z,frozenElevation:v.elevation,currentElevation,delta:currentElevation-v.elevation});
  });
  const values=records.map(v=>v.delta).sort((a,b)=>a-b);
  const quantile=q=>values[Math.min(values.length-1,Math.max(0,Math.round((values.length-1)*q)))];
  const summarize=kind=>{
    const subset=records.filter(v=>!kind||v.kind===kind),d=subset.map(v=>v.delta);
    return Object.freeze({count:d.length,minimum:Math.min(...d),maximum:Math.max(...d),mean:d.reduce((a,b)=>a+b,0)/d.length,belowCurrentSurface:d.filter(v=>v>0).length,aboveCurrentSurface:d.filter(v=>v<0).length,nearSurface:d.filter(v=>Math.abs(v)<=0.25).length});
  };
  return Object.freeze({total:records.length,overall:summarize(null),tuft:summarize('TUFT'),rock:summarize('ROCK'),quantiles:Object.freeze({p00:quantile(0),p10:quantile(.1),p25:quantile(.25),p50:quantile(.5),p75:quantile(.75),p90:quantile(.9),p100:quantile(1)}),records:Object.freeze(records)});
}

const T4_SURFACE_CLEARANCE = Object.freeze({ TUFT: 0.08, ROCK: 0.12 });
const pack = instances => new Float32Array(instances.flatMap(v => {
  const terrain = sampleHEarthRun8BSuccessorTerrainField(v.x,v.z);
  if(terrain?.valid!==true)throw new Error('T4_CURRENT_TERRAIN_SAMPLE_INVALID');
  const clearance=T4_SURFACE_CLEARANCE[v.kind];
  const local = { x: v.x, y: terrain.elevation + clearance, z: v.z };
  const planetary = regionToHEarthPlanetPoint(local);
  const basis = getHEarthRegionTangentBasis(local);
  return [
    planetary.x, planetary.y, planetary.z, v.rotation, v.scale,
    basis.east.x, basis.east.y, basis.east.z,
    basis.up.x, basis.up.y, basis.up.z,
    basis.north.x, basis.north.y, basis.north.z
  ];
}));

export function createHEarthT4StaticGpuBatches(gl) {
  const tufts=H_EARTH_T4_FROZEN_PLACEMENT.instances.filter(v=>v.kind==='TUFT');
  const rocks=H_EARTH_T4_FROZEN_PLACEMENT.instances.filter(v=>v.kind==='ROCK');
  if(tufts.length!==617||rocks.length!==30) throw new Error('T4_COUNT_CORRESPONDENCE');
  const make=(vertices,instances)=>{
    const vertexBuffer=gl.createBuffer(), instanceBuffer=gl.createBuffer();
    if(!vertexBuffer||!instanceBuffer) throw new Error('T4_BUFFER_CREATE_FAILED');
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,instanceBuffer); gl.bufferData(gl.ARRAY_BUFFER,pack(instances),gl.STATIC_DRAW);
    return Object.freeze({vertexBuffer,instanceBuffer,vertexCount:vertices.length/3,instanceCount:instances.length,instances:Object.freeze(instances.map(v=>Object.freeze({...v})))});
  };
  return Object.freeze({tuft:make(TUFT_VERTICES,tufts),rock:make(ROCK_VERTICES,rocks),placementSha:H_EARTH_T4_FROZEN_PLACEMENT.placementSha});
}

export function drawHEarthT4StaticGpuBatches(gl,batches,bindClass) {
  if(typeof bindClass!=='function') throw new Error('T4_BIND_CLASS_REQUIRED');
  let drawCalls=0;
  for(const [kind,batch] of [['TUFT',batches.tuft],['ROCK',batches.rock]]) {
    bindClass(kind,batch);
    gl.bindBuffer(gl.ARRAY_BUFFER,batch.instanceBuffer);
    const stride=56;
    for(let i=0;i<5;i++){gl.enableVertexAttribArray(8+i);gl.vertexAttribPointer(8+i,1,gl.FLOAT,false,stride,i*4);gl.vertexAttribDivisor(8+i,1);}
    for(let i=0;i<3;i++){gl.enableVertexAttribArray(13+i);gl.vertexAttribPointer(13+i,3,gl.FLOAT,false,stride,20+i*12);gl.vertexAttribDivisor(13+i,1);}
    gl.drawArraysInstanced(gl.TRIANGLES,0,batch.vertexCount,batch.instanceCount);
    drawCalls++;
  }
  if(drawCalls>2) throw new Error('T4_DRAW_BUDGET_EXCEEDED');
  return Object.freeze({drawCalls,tufts:batches.tuft.instanceCount,rocks:batches.rock.instanceCount,total:batches.tuft.instanceCount+batches.rock.instanceCount});
}
