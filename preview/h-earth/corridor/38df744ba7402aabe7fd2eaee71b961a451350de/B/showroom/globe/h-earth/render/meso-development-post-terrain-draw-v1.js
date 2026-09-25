/** H-Earth development-chamber meso v1.
 * Additive, post-ready terrain presentation only.
 * No renderer construction, framebuffer, navigation, water, foliage, or live-route ownership.
 */
import { sampleHEarthTerrainField } from '../../../../../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const X_MIN = -184;
const X_MAX = 184;
const Z_MIN = -304;
const Z_MAX = -112;
const COLS = 37;
const ROWS = 25;
const MESO_AMPLITUDE = 1.55;
const SURFACE_EPSILON = 0.045;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
const finite=v=>typeof v==='number'&&Number.isFinite(v);

function feather(x,z){
  const edge=Math.min(x-X_MIN,X_MAX-x,z-Z_MIN,Z_MAX-z);
  const domain=smooth(0,24,edge);
  const coast=smooth(-150,-112,z);
  return domain*coast;
}

function mesoSignal(x,z){
  const a=Math.sin(x*0.071+z*0.041+0.37);
  const b=Math.sin(x*0.113-z*0.067+2.17);
  const c=Math.sin(x*0.167+z*0.091+4.11);
  const d=Math.sin((x+z)*0.031-0.82);
  return (a*0.39+b*0.34+c*0.27)*0.78+d*0.12;
}

function sample(x,z){
  const field=sampleHEarthTerrainField(x,z);
  if(field?.valid!==true||!finite(field.elevation))throw new Error('MESO_TERRAIN_SAMPLE_INVALID');
  const w=feather(x,z);
  const raw=mesoSignal(x,z)*MESO_AMPLITUDE*w;
  const positive=Math.max(0,raw);
  const negative=Math.min(0,raw);
  const displayY=field.elevation+SURFACE_EPSILON+positive;
  return {field,raw,positive,negative,displayY};
}

function normalAt(x,z){
  const e=0.8;
  const l=sample(x-e,z).displayY,r=sample(x+e,z).displayY;
  const b=sample(x,z-e).displayY,f=sample(x,z+e).displayY;
  const dx=(r-l)/(2*e),dz=(f-b)/(2*e);
  const nx=-dx,ny=1,nz=-dz,len=Math.hypot(nx,ny,nz)||1;
  return [nx/len,ny/len,nz/len];
}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aColor;
uniform mat4 uViewProjection;
out vec3 vNormal;
out vec4 vColor;
void main(){
  vNormal=aNormal;
  vColor=aColor;
  gl_Position=uViewProjection*vec4(aPosition,1.0);
}`;

const FS=`#version 300 es
precision highp float;
in vec3 vNormal;
in vec4 vColor;
out vec4 outColor;
void main(){
  vec3 light=normalize(vec3(0.42,0.78,0.46));
  float diffuse=0.54+0.46*max(dot(normalize(vNormal),light),0.0);
  outColor=vec4(vColor.rgb*diffuse,vColor.a);
}`;

function shader(gl,type,source){
  const s=gl.createShader(type); if(!s) throw Error('MESO_SHADER_CREATE');
  gl.shaderSource(s,source); gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw Error('MESO_SHADER_COMPILE:'+gl.getShaderInfoLog(s));
  return s;
}

function program(gl){
  const p=gl.createProgram(); if(!p) throw Error('MESO_PROGRAM_CREATE');
  gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,VS));
  gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw Error('MESO_PROGRAM_LINK:'+gl.getProgramInfoLog(p));
  return p;
}

function buildMesh(){
  const vertices=[],indices=[];
  const idx=(r,c)=>r*COLS+c;
  for(let r=0;r<ROWS;r++){
    const z=Z_MIN+(Z_MAX-Z_MIN)*r/(ROWS-1);
    for(let c=0;c<COLS;c++){
      const x=X_MIN+(X_MAX-X_MIN)*c/(COLS-1);
      const s=sample(x,z);
      const n=normalAt(x,z);
      const strength=clamp(Math.abs(s.raw)/MESO_AMPLITUDE,0,1);
      const positive=s.raw>=0;
      const base=positive?[0.31,0.27,0.20]:[0.20,0.22,0.19];
      const color=[base[0]+strength*0.07,base[1]+strength*0.06,base[2]+strength*0.04,0.34+strength*0.28];
      vertices.push(x,s.displayY,z,n[0],n[1],n[2],...color);
    }
  }
  for(let r=0;r<ROWS-1;r++)for(let c=0;c<COLS-1;c++){
    const a=idx(r,c),b=idx(r,c+1),d=idx(r+1,c),e=idx(r+1,c+1);
    indices.push(a,d,b,b,d,e);
  }
  return Object.freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices)});
}

export function createHEarthMesoDevelopmentPostTerrainDraw(gl){
  if(!gl) throw new Error('MESO_WEBGL2_CONTEXT_REQUIRED');
  const mesh=buildMesh();
  const vao=gl.createVertexArray(),vb=gl.createBuffer(),ib=gl.createBuffer();
  if(!vao||!vb||!ib) throw new Error('MESO_BUFFER_CREATE');
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER,vb); gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);
  const stride=10*4;
  for(const [loc,size,off] of [[0,3,0],[1,3,12],[2,4,24]]){
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,off);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
  const p=program(gl),uVP=gl.getUniformLocation(p,'uViewProjection');
  if(!uVP) throw new Error('MESO_UNIFORM_MISSING');
  let frames=0;
  const drawAfterTerrain=({packet})=>{
    gl.useProgram(p);
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(uVP,false,new Float32Array(packet.camera.viewProjectionMatrix));
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    frames++;
    return Object.freeze({drawCalls:1,vertices:mesh.vertices.length/10,triangles:mesh.indices.length/3,frames,amplitude:MESO_AMPLITUDE});
  };
  return Object.freeze({
    drawAfterTerrain,
    getReceipt:()=>Object.freeze({
      id:'H_EARTH_DEVELOPMENT_CHAMBER_MESO_V1',
      region:{xMinimum:X_MIN,xMaximum:X_MAX,zMinimum:Z_MIN,zMaximum:Z_MAX},
      grid:{columns:COLS,rows:ROWS},
      amplitude:MESO_AMPLITUDE,
      postReadyOnly:true,
      liveMutation:false,
      rendererConstructionParticipation:false,
      firstFrameParticipation:false,
      navigationMutation:false,
      waterMutation:false,
      foliageMutation:false,
      frames
    })
  });
}

export default createHEarthMesoDevelopmentPostTerrainDraw;
