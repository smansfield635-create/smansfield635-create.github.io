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
  const diagnosticColor=gl.createTexture(),diagnosticDepth=gl.createRenderbuffer(),diagnosticFramebuffer=gl.createFramebuffer();
  if(!diagnosticColor||!diagnosticDepth||!diagnosticFramebuffer)throw Error('T4_AB_TARGET_CREATE');
  gl.bindTexture(gl.TEXTURE_2D,diagnosticColor);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,640,360,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.bindRenderbuffer(gl.RENDERBUFFER,diagnosticDepth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT24,640,360);
  gl.bindFramebuffer(gl.FRAMEBUFFER,diagnosticFramebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,diagnosticColor,0);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,diagnosticDepth);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('T4_AB_TARGET_INCOMPLETE');gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  let frames=0,maximumAddedDrawCalls=0,latestDepthAB=null,preT4SnapshotReady=false,productionChangedPixelIndices=[];
  const capturePreT4Diagnostic=({width,height,sourceFramebuffer})=>{
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER,sourceFramebuffer);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,diagnosticFramebuffer);
    gl.blitFramebuffer(0,0,width,height,0,0,width,height,gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT,gl.NEAREST);
    preT4SnapshotReady=true;
    gl.bindFramebuffer(gl.FRAMEBUFFER,sourceFramebuffer);
  };
  const drawAfterTerrain=({packet})=>{
    gl.useProgram(program);gl.bindVertexArray(vao);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    const bindClass=(kind,batch)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniform3fv(classColor,kind==='TUFT'?new Float32Array([0.22,0.36,0.12]):new Float32Array([0.31,0.29,0.27]));
    };
    const receipt=drawHEarthT4StaticGpuBatches(gl,batches,bindClass);
    frames++;maximumAddedDrawCalls=Math.max(maximumAddedDrawCalls,receipt.drawCalls);
    if(receipt.drawCalls!==2||receipt.total!==647)throw Error('T4_DRAW_CORRESPONDENCE_FAILURE');
    return receipt;
  };
  const runPostRenderDiagnostic=({packet,width,height,sourceFramebuffer})=>{
    if(!preT4SnapshotReady)throw Error('T4_PRE_SNAPSHOT_MISSING');
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,diagnosticFramebuffer);gl.bindFramebuffer(gl.READ_FRAMEBUFFER,sourceFramebuffer);
    gl.blitFramebuffer(0,0,width,height,0,0,width,height,gl.DEPTH_BUFFER_BIT,gl.NEAREST);
    const run=depthEnabled=>{
      gl.bindFramebuffer(gl.FRAMEBUFFER,diagnosticFramebuffer);gl.viewport(0,0,width,height);gl.colorMask(true,true,true,true);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);
      if(depthEnabled){gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);}else gl.disable(gl.DEPTH_TEST);
      gl.depthMask(false);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindVertexArray(vao);gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
      const bindClass=(kind,batch)=>{gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.uniform3fv(classColor,new Float32Array([1,0,1]));};
      drawHEarthT4StaticGpuBatches(gl,batches,bindClass);
      const pixels=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let count=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]||pixels[i+1]||pixels[i+2])count++;return count;
    };
    const depthOnPixels=run(true),depthOffPixels=run(false);
    gl.bindFramebuffer(gl.FRAMEBUFFER,diagnosticFramebuffer);
    const terrainPixels=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,terrainPixels);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(false);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindVertexArray(vao);gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    const productionBindClass=(kind,batch)=>{gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.uniform3fv(classColor,kind==='TUFT'?new Float32Array([0.22,0.36,0.12]):new Float32Array([0.31,0.29,0.27]));};
    drawHEarthT4StaticGpuBatches(gl,batches,productionBindClass);
    const composedPixels=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,composedPixels);
    const deltas=[];let changedProductionPixels=0;productionChangedPixelIndices=[];
    for(let i=0;i<terrainPixels.length;i+=4){
      const dr=Math.abs(composedPixels[i]-terrainPixels[i]),dg=Math.abs(composedPixels[i+1]-terrainPixels[i+1]),db=Math.abs(composedPixels[i+2]-terrainPixels[i+2]);
      if(dr||dg||db){changedProductionPixels++;productionChangedPixelIndices.push(i>>2);deltas.push(Math.sqrt(dr*dr+dg*dg+db*db));}
    }
    deltas.sort((a,b)=>a-b);const q=p=>deltas.length?deltas[Math.min(deltas.length-1,Math.max(0,Math.round((deltas.length-1)*p)))]:0;
    latestDepthAB=Object.freeze({depthOnPixels,depthOffPixels,ratio:depthOffPixels?depthOnPixels/depthOffPixels:null,productionColorDelta:Object.freeze({changedPixels:changedProductionPixels,minimum:q(0),p10:q(.1),p25:q(.25),p50:q(.5),p75:q(.75),p90:q(.9),maximum:q(1),mean:deltas.length?deltas.reduce((a,b)=>a+b,0)/deltas.length:0})});
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  };
  const runPostPresentationDiagnostic=({width,height,sourceFramebuffer})=>{
    const sourcePixels=new Uint8Array(width*height*4),presentedPixels=new Uint8Array(width*height*4);
    gl.bindFramebuffer(gl.FRAMEBUFFER,sourceFramebuffer);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,sourcePixels);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,presentedPixels);
    let exactMatches=0,mismatches=0,maximumChannelDelta=0;
    for(const pixelIndex of productionChangedPixelIndices){const i=pixelIndex*4;let same=true;for(let c=0;c<4;c++){const d=Math.abs(sourcePixels[i+c]-presentedPixels[i+c]);if(d){same=false;maximumChannelDelta=Math.max(maximumChannelDelta,d);}}if(same)exactMatches++;else mismatches++;}
    if(latestDepthAB)latestDepthAB=Object.freeze({...latestDepthAB,presentationParity:Object.freeze({testedPixels:productionChangedPixelIndices.length,exactMatches,mismatches,maximumChannelDelta})});
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  };
  return Object.freeze({capturePreT4Diagnostic,drawAfterTerrain,runPostRenderDiagnostic,runPostPresentationDiagnostic,getReceipt:()=>Object.freeze({placementSha:batches.placementSha,frames,maximumAddedDrawCalls,tufts:617,rocks:30,total:647,latestDepthAB})});
}
