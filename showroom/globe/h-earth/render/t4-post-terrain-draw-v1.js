/** H-Earth T4 post-terrain draw v1. Additive only; no framebuffer or presentation ownership. */
import { createHEarthT4StaticGpuBatches, drawHEarthT4StaticGpuBatches } from './t4-static-gpu-batches-v1.js';
import { regionToHEarthPlanetPoint, getHEarthRegionTangentBasis } from './planetary-world-frame.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';

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
  let frames=0,maximumAddedDrawCalls=0,latestProjectedSizeDiagnostic=null;
  const project=(m,p,width,height)=>{
    const x=m[0]*p.x+m[4]*p.y+m[8]*p.z+m[12],y=m[1]*p.x+m[5]*p.y+m[9]*p.z+m[13],z=m[2]*p.x+m[6]*p.y+m[10]*p.z+m[14],w=m[3]*p.x+m[7]*p.y+m[11]*p.z+m[15];
    if(!(w>0))return null;return {x:(x/w*.5+.5)*width,y:(y/w*.5+.5)*height,z:z/w,w};
  };
  const projectedSizeDiagnostic=(packet,width,height)=>{
    const byKind={TUFT:[],ROCK:[]};
    for(const [kind,batch] of [['TUFT',batches.tuft],['ROCK',batches.rock]]){
      for(const v of batch.instances){
        const terrain=sampleHEarthRun8BSuccessorTerrainField(v.x,v.z);if(terrain?.valid!==true)continue;
        const clearance=kind==='TUFT'?0.08:0.12,local={x:v.x,y:terrain.elevation+clearance,z:v.z};
        const origin=regionToHEarthPlanetPoint(local),basis=getHEarthRegionTangentBasis(local),c=Math.cos(v.rotation),sn=Math.sin(v.rotation);
        const points=[];
        for(let i=0;i<batch.vertices.length;i+=3){
          const px=batch.vertices[i]*v.scale,py=batch.vertices[i+1]*v.scale,pz=batch.vertices[i+2]*v.scale;
          const e=px*c-pz*sn,n=px*sn+pz*c;
          points.push({x:origin.x+basis.east.x*e+basis.up.x*py+basis.north.x*n,y:origin.y+basis.east.y*e+basis.up.y*py+basis.north.y*n,z:origin.z+basis.east.z*e+basis.up.z*py+basis.north.z*n});
        }
        const projected=points.map(p=>project(packet.camera.viewProjectionMatrix,p,width,height)).filter(Boolean);if(!projected.length)continue;
        const xs=projected.map(p=>p.x),ys=projected.map(p=>p.y);byKind[kind].push({width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)});
      }
    }
    const summarize=items=>{const ws=items.map(v=>v.width).sort((a,b)=>a-b),hs=items.map(v=>v.height).sort((a,b)=>a-b),q=(a,p)=>a[Math.min(a.length-1,Math.max(0,Math.round((a.length-1)*p)))];return Object.freeze({count:items.length,width:Object.freeze({p10:q(ws,.1),p50:q(ws,.5),p90:q(ws,.9),maximum:q(ws,1)}),height:Object.freeze({p10:q(hs,.1),p50:q(hs,.5),p90:q(hs,.9),maximum:q(hs,1)}),subPixelBoth:items.filter(v=>v.width<1&&v.height<1).length,underTwoPixelsBoth:items.filter(v=>v.width<2&&v.height<2).length});};
    return Object.freeze({TUFT:summarize(byKind.TUFT),ROCK:summarize(byKind.ROCK)});
  };
  const drawAfterTerrain=({packet,width,height})=>{
    gl.useProgram(program);gl.bindVertexArray(vao);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.uniformMatrix4fv(viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));
    const bindClass=(kind,batch)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.vertexBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniform3fv(classColor,kind==='TUFT'?new Float32Array([0.22,0.36,0.12]):new Float32Array([0.31,0.29,0.27]));
    };
    latestProjectedSizeDiagnostic=projectedSizeDiagnostic(packet,width,height);
    const receipt=drawHEarthT4StaticGpuBatches(gl,batches,bindClass);
    frames++;maximumAddedDrawCalls=Math.max(maximumAddedDrawCalls,receipt.drawCalls);
    if(receipt.drawCalls!==2||receipt.total!==647)throw Error('T4_DRAW_CORRESPONDENCE_FAILURE');
    return receipt;
  };
  return Object.freeze({drawAfterTerrain,getReceipt:()=>Object.freeze({placementSha:batches.placementSha,frames,maximumAddedDrawCalls,tufts:617,rocks:30,total:647,latestProjectedSizeDiagnostic})});
}
