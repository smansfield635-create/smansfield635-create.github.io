/** H-Earth T4 post-terrain draw v1. Additive only; no framebuffer or presentation ownership. */
import { createHEarthT4StaticGpuBatches, drawHEarthT4StaticGpuBatches } from './t4-static-gpu-batches-v1.js';

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=8) in float iX;
layout(location=9) in float iY;
layout(location=10) in float iZ;
layout(location=11) in float iRotation;
layout(location=12) in float iScale;
uniform mat4 uViewProjection;
void main(){float c=cos(iRotation),s=sin(iRotation);vec3 p=aPosition*iScale;vec3 r=vec3(p.x*c-p.z*s,p.y,p.x*s+p.z*c);gl_Position=uViewProjection*vec4(r+vec3(iX,iY,iZ),1.0);}`;
const FS=`#version 300 es
precision highp float;
uniform vec3 uClassColor;
out vec4 outColor;
void main(){outColor=vec4(uClassColor,1.0);}`;

function shader(gl,type,source){const s=gl.createShader(type);if(!s)throw Error('T4_SHADER_CREATE');gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('T4_SHADER_COMPILE:'+gl.getShaderInfoLog(s));return s;}

export function createHEarthT4PostTerrainDraw(gl){
  if(!gl)throw new Error('T4_WEBGL2_CONTEXT_REQUIRED');
  const vs=shader(gl,gl.VERTEX_SHADER,VS),fs=shader(gl,gl.FRAGMENT_SHADER,FS);
  const program=gl.createProgram();if(!program)throw Error('T4_PROGRAM_CREATE');
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('T4_PROGRAM_LINK:'+gl.getProgramInfoLog(program));
  const viewProjection=gl.getUniformLocation(program,'uViewProjection'),classColor=gl.getUniformLocation(program,'uClassColor');
  if(viewProjection===null||classColor===null)throw Error('T4_UNIFORM_MISSING');
  const vao=gl.createVertexArray();if(!vao)throw Error('T4_VAO_CREATE');
  const batches=createHEarthT4StaticGpuBatches(gl);
  const DISTANCE_BANDS=Object.freeze({nearMaximum:95,midMaximum:190,farMode:'OFF'});
  let frames=0,maximumAddedDrawCalls=0,nearFrames=0,midFrames=0,farFrames=0;
  const classifyDistanceBand=(packet)=>{
    const p=packet.camera.position;
    const distance=Math.hypot(p.x,p.z);
    if(distance<=DISTANCE_BANDS.nearMaximum)return 'NEAR_FULL';
    if(distance<=DISTANCE_BANDS.midMaximum)return 'MID_REDUCED';
    return 'FAR_OFF';
  };
  const drawAfterTerrain=({packet})=>{
    const band=classifyDistanceBand(packet);
    frames++;
    if(band==='FAR_OFF'){farFrames++;return Object.freeze({band,drawCalls:0,tufts:0,rocks:0,total:0});}
    gl.useProgram(program);gl.bindVertexArray(vao);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    const bindClass=(kind,batch)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniform3fv(classColor,kind==='TUFT'?new Float32Array([0.22,0.36,0.12]):new Float32Array([0.31,0.29,0.27]));
    };
    if(band==='MID_REDUCED'){
      midFrames++;
      const receipt=drawHEarthT4StaticGpuBatches(gl,batches,bindClass,{instanceStride:2});
      maximumAddedDrawCalls=Math.max(maximumAddedDrawCalls,receipt.drawCalls);
      return Object.freeze({...receipt,band});
    }
    nearFrames++;
    const receipt=drawHEarthT4StaticGpuBatches(gl,batches,bindClass);
    maximumAddedDrawCalls=Math.max(maximumAddedDrawCalls,receipt.drawCalls);
    if(receipt.drawCalls!==2||receipt.total!==647)throw Error('T4_DRAW_CORRESPONDENCE_FAILURE');
    return Object.freeze({...receipt,band});
  };
  return Object.freeze({drawAfterTerrain,getReceipt:()=>Object.freeze({placementSha:batches.placementSha,frames,maximumAddedDrawCalls,tufts:617,rocks:30,total:647,distanceBands:DISTANCE_BANDS,nearFrames,midFrames,farFrames})});
}
