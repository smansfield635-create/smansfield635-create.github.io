/** H-Earth T4 static GPU batches v1. No renderer/framebuffer/presentation ownership. */
import { H_EARTH_T4_FROZEN_PLACEMENT } from './t4-frozen-placement-v1.js';

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

export function drawHEarthT4StaticGpuBatches(gl,batches,bindClass) {
  if(typeof bindClass!=='function') throw new Error('T4_BIND_CLASS_REQUIRED');
  let drawCalls=0;
  for(const [kind,batch] of [['TUFT',batches.tuft],['ROCK',batches.rock]]) {
    bindClass(kind,batch);
    gl.bindBuffer(gl.ARRAY_BUFFER,batch.instanceBuffer);
    for(let i=0;i<5;i++){gl.enableVertexAttribArray(8+i);gl.vertexAttribPointer(8+i,1,gl.FLOAT,false,20,i*4);gl.vertexAttribDivisor(8+i,1);}
    // WebGL2 validates every enabled attribute in the bound VAO at draw time.
    // The terrain renderer may leave higher locations enabled; T4 owns only 0 and 8..12.
    // Disable all non-T4 locations so stale terrain attribute state cannot invalidate this draw.
    const maxAttribs=gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    for(let location=0;location<maxAttribs;location++){
      if(location!==0 && (location<8 || location>12)) gl.disableVertexAttribArray(location);
    }
    gl.drawArraysInstanced(gl.TRIANGLES,0,batch.vertexCount,batch.instanceCount);
    drawCalls++;
  }
  if(drawCalls>2) throw new Error('T4_DRAW_BUDGET_EXCEEDED');
  return Object.freeze({drawCalls,tufts:batches.tuft.instanceCount,rocks:batches.rock.instanceCount,total:batches.tuft.instanceCount+batches.rock.instanceCount});
}
