/** H-Earth T4 static GPU batches v1. No renderer/framebuffer/presentation ownership. */
import { H_EARTH_T4_FROZEN_PLACEMENT } from './t4-frozen-placement-v1.js';

const TUFT_VERTICES = new Float32Array([-.10,0,0, .10,0,0, 0,.70,0, 0,0,-.10, 0,0,.10, 0,.70,0]);
const ROCK_VERTICES = new Float32Array([-.28,0,-.20, .30,0,-.18, .22,0,.25, -.20,0,.28, 0,.34,0]);

const pack = instances => new Float32Array(instances.flatMap(v => [v.x,v.elevation,v.z,v.rotation,v.scale]));

export function createHEarthT4StaticGpuBatches(gl) {
  const tufts=H_EARTH_T4_FROZEN_PLACEMENT.instances.filter(v=>v.kind==='TUFT');
  const rocks=H_EARTH_T4_FROZEN_PLACEMENT.instances.filter(v=>v.kind==='ROCK');
  if(tufts.length!==617||rocks.length!==30) throw new Error('T4_COUNT_CORRESPONDENCE');
  const make=(vertices,instances)=>{
    const vertexBuffer=gl.createBuffer(), instanceBuffer=gl.createBuffer();
    if(!vertexBuffer||!instanceBuffer) throw new Error('T4_BUFFER_CREATE_FAILED');
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,instanceBuffer); gl.bufferData(gl.ARRAY_BUFFER,pack(instances),gl.STATIC_DRAW);
    return Object.freeze({vertexBuffer,instanceBuffer,vertexCount:vertices.length/3,instanceCount:instances.length});
  };
  return Object.freeze({tuft:make(TUFT_VERTICES,tufts),rock:make(ROCK_VERTICES,rocks),placementSha:H_EARTH_T4_FROZEN_PLACEMENT.placementSha});
}

export function drawHEarthT4StaticGpuBatches(gl,batches,bindClass,{instanceStride=1}={}) {
  if(typeof bindClass!=='function') throw new Error('T4_BIND_CLASS_REQUIRED');
  if(!Number.isInteger(instanceStride)||instanceStride<1)throw new Error('T4_INSTANCE_STRIDE_INVALID');
  let drawCalls=0,tufts=0,rocks=0;
  for(const [kind,batch] of [['TUFT',batches.tuft],['ROCK',batches.rock]]) {
    bindClass(kind,batch);
    gl.bindBuffer(gl.ARRAY_BUFFER,batch.instanceBuffer);
    const strideBytes=20*instanceStride;
    for(let i=0;i<5;i++){gl.enableVertexAttribArray(8+i);gl.vertexAttribPointer(8+i,1,gl.FLOAT,false,strideBytes,i*4);gl.vertexAttribDivisor(8+i,1);}
    const instanceCount=Math.ceil(batch.instanceCount/instanceStride);
    gl.drawArraysInstanced(gl.TRIANGLES,0,batch.vertexCount,instanceCount);
    if(kind==='TUFT')tufts=instanceCount;else rocks=instanceCount;
    drawCalls++;
  }
  if(drawCalls>2) throw new Error('T4_DRAW_BUDGET_EXCEEDED');
  return Object.freeze({drawCalls,tufts,rocks,total:tufts+rocks,instanceStride});
}
