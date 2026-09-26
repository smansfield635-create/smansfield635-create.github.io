/** H-Earth T4 post-terrain draw v1. Additive only; no framebuffer or presentation ownership. */
import { createHEarthT4StaticGpuBatches, drawHEarthT4StaticGpuBatches, getHEarthT4TerrainElevationCorrespondence } from './t4-static-gpu-batches-v1.js';
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
const DEPTH_VS=`#version 300 es
precision highp float;
const vec2 p[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
out vec2 vUv;
void main(){vec2 q=p[gl_VertexID];vUv=q*.5+.5;gl_Position=vec4(q,0.,1.);}`;
const DEPTH_FS=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDepth;
out vec4 outColor;
void main(){float d=texture(uDepth,vUv).r;outColor=vec4(d,d,d,1.0);}`;

function shader(gl,type,source){const s=gl.createShader(type);if(!s)throw Error('T4_SHADER_CREATE');gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('T4_SHADER_COMPILE:'+gl.getShaderInfoLog(s));return s;}

export function createHEarthT4PostTerrainDraw(gl){
  if(!gl)throw new Error('T4_WEBGL2_CONTEXT_REQUIRED');
  const vs=shader(gl,gl.VERTEX_SHADER,VS),fs=shader(gl,gl.FRAGMENT_SHADER,FS);
  const program=gl.createProgram();if(!program)throw Error('T4_PROGRAM_CREATE');
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('T4_PROGRAM_LINK:'+gl.getProgramInfoLog(program));
  const depthVs=shader(gl,gl.VERTEX_SHADER,DEPTH_VS),depthFs=shader(gl,gl.FRAGMENT_SHADER,DEPTH_FS);
  const depthProgram=gl.createProgram();if(!depthProgram)throw Error('T4_DEPTH_PROGRAM_CREATE');
  gl.attachShader(depthProgram,depthVs);gl.attachShader(depthProgram,depthFs);gl.linkProgram(depthProgram);
  if(!gl.getProgramParameter(depthProgram,gl.LINK_STATUS))throw Error('T4_DEPTH_PROGRAM_LINK:'+gl.getProgramInfoLog(depthProgram));
  const depthSampler=gl.getUniformLocation(depthProgram,'uDepth');if(depthSampler===null)throw Error('T4_DEPTH_UNIFORM_MISSING');
  const depthVao=gl.createVertexArray();if(!depthVao)throw Error('T4_DEPTH_VAO_CREATE');
  const viewProjection=gl.getUniformLocation(program,'uViewProjection'),classColor=gl.getUniformLocation(program,'uClassColor');
  if(viewProjection===null||classColor===null)throw Error('T4_UNIFORM_MISSING');
  const vao=gl.createVertexArray();if(!vao)throw Error('T4_VAO_CREATE');
  const batches=createHEarthT4StaticGpuBatches(gl);
  const terrainElevationCorrespondence=getHEarthT4TerrainElevationCorrespondence();
  const probeWidth=160,probeHeight=90;
  const probeTexture=gl.createTexture(),probeFramebuffer=gl.createFramebuffer();
  if(!probeTexture||!probeFramebuffer)throw Error('T4_DIAGNOSTIC_TARGET_CREATE');
  gl.bindTexture(gl.TEXTURE_2D,probeTexture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,probeWidth,probeHeight,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.bindFramebuffer(gl.FRAMEBUFFER,probeFramebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,probeTexture,0);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('T4_DIAGNOSTIC_TARGET_INCOMPLETE');
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  const depthColorTexture=gl.createTexture(),depthSampleFramebuffer=gl.createFramebuffer();if(!depthColorTexture||!depthSampleFramebuffer)throw Error('T4_DEPTH_SAMPLE_TARGET_CREATE');
  gl.bindTexture(gl.TEXTURE_2D,depthColorTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,640,360,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.bindFramebuffer(gl.FRAMEBUFFER,depthSampleFramebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,depthColorTexture,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  let frames=0,maximumAddedDrawCalls=0;
  let latestClipDiagnostic=null,latestFragmentDiagnostic=null,latestDepthDiagnostic=null;
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
  const drawAfterTerrain=({packet,depthTexture,width,height})=>{
    gl.useProgram(program);gl.bindVertexArray(vao);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    const bindClass=(kind,batch)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniform3fv(classColor,kind==='TUFT'?new Float32Array([0.22,0.36,0.12]):new Float32Array([0.31,0.29,0.27]));
    };
    latestClipDiagnostic=clipDiagnostic(packet);
    if(depthTexture){
      const admitted=[];
      for(const [kind,batch] of [['TUFT',batches.tuft],['ROCK',batches.rock]]){
        for(const instance of batch.instances){
          const point=regionToHEarthPlanetPoint({x:instance.x,y:instance.elevation,z:instance.z});
          const clip=multiplyPoint(packet.camera.viewProjectionMatrix,point);
          if(!(clip.w>0&&Math.abs(clip.x)<=clip.w&&Math.abs(clip.y)<=clip.w&&clip.z>=-clip.w&&clip.z<=clip.w))continue;
          const ndcX=clip.x/clip.w,ndcY=clip.y/clip.w,ndcZ=clip.z/clip.w;
          admitted.push({kind,projectedDepth:ndcZ*.5+.5,px:Math.min(width-1,Math.max(0,Math.floor((ndcX*.5+.5)*width))),py:Math.min(height-1,Math.max(0,Math.floor((ndcY*.5+.5)*height)))});
        }
      }
      const priorFramebuffer=gl.getParameter(gl.FRAMEBUFFER_BINDING),priorViewport=gl.getParameter(gl.VIEWPORT);
      gl.bindFramebuffer(gl.FRAMEBUFFER,depthSampleFramebuffer);gl.viewport(0,0,width,height);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);
      gl.useProgram(depthProgram);gl.bindVertexArray(depthVao);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,depthTexture);gl.uniform1i(depthSampler,0);gl.drawArrays(gl.TRIANGLES,0,3);
      const pixels=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      const deltas=[];
      for(const item of admitted){const terrainDepth=pixels[(item.py*width+item.px)*4]/255;if(Number.isFinite(terrainDepth))deltas.push(item.projectedDepth-terrainDepth);}
      gl.bindFramebuffer(gl.FRAMEBUFFER,priorFramebuffer);gl.viewport(priorViewport[0],priorViewport[1],priorViewport[2],priorViewport[3]);
      deltas.sort((a,b)=>a-b);const q=p=>deltas[Math.min(deltas.length-1,Math.max(0,Math.round((deltas.length-1)*p)))];
      latestDepthDiagnostic=Object.freeze({sampleCount:deltas.length,encoding:'DEPTH_TEXTURE_TO_RGBA8_LINEAR',quantization:1/255,minimum:Math.min(...deltas),maximum:Math.max(...deltas),mean:deltas.reduce((a,b)=>a+b,0)/deltas.length,p10:q(.1),p25:q(.25),p50:q(.5),p75:q(.75),p90:q(.9),behindTerrain:deltas.filter(v=>v>1/255).length,inFrontOfOrWithinQuantization:deltas.filter(v=>v<=1/255).length});
    }
    const receipt=drawHEarthT4StaticGpuBatches(gl,batches,bindClass);
    gl.bindFramebuffer(gl.FRAMEBUFFER,probeFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,probeTexture,0);
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('T4_DIAGNOSTIC_TARGET_INCOMPLETE');
    gl.viewport(0,0,probeWidth,probeHeight);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);gl.bindVertexArray(vao);gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    const diagnosticBindClass=(kind,batch)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniform3fv(classColor,new Float32Array(kind==='TUFT'?[1,0,1]:[0,1,1]));
    };
    drawHEarthT4StaticGpuBatches(gl,batches,diagnosticBindClass);
    const probePixels=new Uint8Array(probeWidth*probeHeight*4);
    gl.readPixels(0,0,probeWidth,probeHeight,gl.RGBA,gl.UNSIGNED_BYTE,probePixels);
    let changedPixels=0;
    for(let i=0;i<probePixels.length;i+=4)if(probePixels[i]||probePixels[i+1]||probePixels[i+2])changedPixels++;
    latestFragmentDiagnostic=Object.freeze({probeWidth,probeHeight,changedPixels,noDepthRasterContribution:changedPixels>0});
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    frames++;maximumAddedDrawCalls=Math.max(maximumAddedDrawCalls,receipt.drawCalls);
    if(receipt.drawCalls!==2||receipt.total!==647)throw Error('T4_DRAW_CORRESPONDENCE_FAILURE');
    return receipt;
  };
  return Object.freeze({drawAfterTerrain,getReceipt:()=>Object.freeze({placementSha:batches.placementSha,frames,maximumAddedDrawCalls,tufts:617,rocks:30,total:647,latestClipDiagnostic,latestFragmentDiagnostic,latestDepthDiagnostic,terrainElevationCorrespondence})});
}
