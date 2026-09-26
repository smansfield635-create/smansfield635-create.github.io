/** H-Earth T4 post-terrain draw v1. Additive only; no framebuffer or presentation ownership. */
import { createHEarthT4StaticGpuBatches, drawHEarthT4StaticGpuBatches } from './t4-static-gpu-batches-v1.js';
import { regionToHEarthPlanetPoint } from './planetary-world-frame.js';

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=8) in float iX;
layout(location=9) in float iY;
layout(location=10) in float iZ;
layout(location=11) in float iRotation;
layout(location=12) in float iScale;
layout(location=13) in vec3 iEast;
layout(location=14) in vec3 iUp;
layout(location=15) in vec3 iNorth;
uniform mat4 uViewProjection;
void main(){
  float c=cos(iRotation),s=sin(iRotation);
  vec3 p=aPosition*iScale;
  float localEast=p.x*c-p.z*s;
  float localNorth=p.x*s+p.z*c;
  vec3 tangentOffset=iEast*localEast+iUp*p.y+iNorth*localNorth;
  gl_Position=uViewProjection*vec4(vec3(iX,iY,iZ)+tangentOffset,1.0);
}`;
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
  let frames=0,maximumAddedDrawCalls=0;
  let latestClipDiagnostic=null,latestFragmentDiagnostic=null;
  const multiplyPoint=(m,p)=>{
    const x=p.x,y=p.y,z=p.z,w=1;
    return {
      x:m[0]*x+m[4]*y+m[8]*z+m[12]*w,
      y:m[1]*x+m[5]*y+m[9]*z+m[13]*w,
      z:m[2]*x+m[6]*y+m[10]*z+m[14]*w,
      w:m[3]*x+m[7]*y+m[11]*z+m[15]*w
    };
  };
  const clipDiagnostic=(packet)=>{
    let inside=0,positiveW=0;
    const byKind={TUFT:{total:0,inside:0},ROCK:{total:0,inside:0}};
    for(const [kind,batch] of [['TUFT',batches.tuft],['ROCK',batches.rock]]){
      for(const instance of batch.instances){
        byKind[kind].total++;
        const point=regionToHEarthPlanetPoint({x:instance.x,y:instance.elevation,z:instance.z});
        const clip=multiplyPoint(packet.camera.viewProjectionMatrix,point);
        if(clip.w>0) positiveW++;
        const admitted=clip.w>0&&Math.abs(clip.x)<=clip.w&&Math.abs(clip.y)<=clip.w&&clip.z>=-clip.w&&clip.z<=clip.w;
        if(admitted){inside++;byKind[kind].inside++;}
      }
    }
    return Object.freeze({total:647,inside,positiveW,byKind});
  };
  const drawAfterTerrain=({packet})=>{
    gl.useProgram(program);gl.bindVertexArray(vao);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    const bindClass=(kind,batch)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniform3fv(classColor,kind==='TUFT'?new Float32Array([0.22,0.36,0.12]):new Float32Array([0.31,0.29,0.27]));
    };
    latestClipDiagnostic=clipDiagnostic(packet);
    const receipt=drawHEarthT4StaticGpuBatches(gl,batches,bindClass);
    const probeWidth=Math.min(160,width),probeHeight=Math.min(90,height);
    const probeX=Math.max(0,Math.floor((width-probeWidth)/2)),probeY=Math.max(0,Math.floor((height-probeHeight)/2));
    const normalPixels=new Uint8Array(probeWidth*probeHeight*4);
    gl.readPixels(probeX,probeY,probeWidth,probeHeight,gl.RGBA,gl.UNSIGNED_BYTE,normalPixels);
    const normalHash=(()=>{let h=0x811c9dc5;for(const byte of normalPixels){h^=byte;h=Math.imul(h,0x01000193)>>>0;}return 'fnv1a32:'+h.toString(16).padStart(8,'0');})();
    const depthWasEnabled=gl.isEnabled(gl.DEPTH_TEST);
    const depthMask=gl.getParameter(gl.DEPTH_WRITEMASK);
    gl.disable(gl.DEPTH_TEST);gl.depthMask(false);
    const diagnosticBindClass=(kind,batch)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniform3fv(classColor,new Float32Array(kind==='TUFT'?[1,0,1]:[0,1,1]));
    };
    drawHEarthT4StaticGpuBatches(gl,batches,diagnosticBindClass);
    const noDepthPixels=new Uint8Array(probeWidth*probeHeight*4);
    gl.readPixels(probeX,probeY,probeWidth,probeHeight,gl.RGBA,gl.UNSIGNED_BYTE,noDepthPixels);
    const noDepthHash=(()=>{let h=0x811c9dc5;for(const byte of noDepthPixels){h^=byte;h=Math.imul(h,0x01000193)>>>0;}return 'fnv1a32:'+h.toString(16).padStart(8,'0');})();
    let changedPixels=0;
    for(let i=0;i<normalPixels.length;i+=4){
      if(normalPixels[i]!==noDepthPixels[i]||normalPixels[i+1]!==noDepthPixels[i+1]||normalPixels[i+2]!==noDepthPixels[i+2]||normalPixels[i+3]!==noDepthPixels[i+3]) changedPixels++;
    }
    latestFragmentDiagnostic=Object.freeze({probeWidth,probeHeight,normalHash,noDepthHash,changedPixels,noDepthRasterContribution:changedPixels>0});
    if(depthWasEnabled)gl.enable(gl.DEPTH_TEST);else gl.disable(gl.DEPTH_TEST);gl.depthMask(depthMask);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);gl.bindVertexArray(vao);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    drawHEarthT4StaticGpuBatches(gl,batches,bindClass);
    frames++;maximumAddedDrawCalls=Math.max(maximumAddedDrawCalls,receipt.drawCalls);
    if(receipt.drawCalls!==2||receipt.total!==647)throw Error('T4_DRAW_CORRESPONDENCE_FAILURE');
    return receipt;
  };
  return Object.freeze({drawAfterTerrain,getReceipt:()=>Object.freeze({placementSha:batches.placementSha,frames,maximumAddedDrawCalls,tufts:617,rocks:30,total:647,latestClipDiagnostic,latestFragmentDiagnostic})});
}
