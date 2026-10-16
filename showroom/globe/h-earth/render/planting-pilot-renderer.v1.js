/** Bounded native WebGL2 planting presentation. Root buffers never follow the camera. */
const MAX_BYTES=4*1024*1024;
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aLeaf;
layout(location=1) in vec4 aRootAngle;
layout(location=2) in vec4 aShape;
uniform mat4 uViewProjection;
uniform vec3 uCamera;
uniform int uDetail;
out vec3 vNormal;
out float vHeight;
flat out float vPalette;
flat out float vSeed;
flat out float vDistance;
flat out int vDetail;
void main(){
 float t=aLeaf.y, angle=aRootAngle.w+aLeaf.z;
 vec2 forward=vec2(cos(angle),sin(angle)), side=vec2(-forward.y,forward.x);
 // Both passes retain these dimensions for every camera position.
 float height=aShape.x;
 float width=aShape.y*(uDetail==1?1.0:1.35);
 float bladeWidth=sin(t*3.14159265359)*width;
 vec2 displacement=forward*(height*0.24*t*t)+side*(aLeaf.x*bladeWidth);
 vec3 world=aRootAngle.xyz+vec3(displacement.x,height*t,displacement.y);
 vNormal=normalize(vec3(side.x,0.45,side.y));
 vHeight=t;vPalette=aShape.z;vSeed=aShape.w;
 vDistance=distance(aRootAngle.xz,uCamera.xz);vDetail=uDetail;
 gl_Position=uViewProjection*vec4(world,1.0);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;
in float vHeight;
flat in float vPalette;
flat in float vSeed;
flat in float vDistance;
flat in int vDetail;
uniform vec3 uSunDirection;
uniform float uSunIntensity;
uniform vec3 uSunColor;
uniform vec3 uGroundHazeColor;
uniform float uFogStartDistance;
uniform float uFogFalloff;
uniform float uMaximumFogFactor;
out vec4 outColor;
vec3 linearColor(vec3 c){return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),c));}
void main(){
 // Stable per-root choice: no screen noise and no geometry height growth.
 if(vDetail==1 && vSeed>=1.0-smoothstep(12.0,24.0,vDistance))discard;
 vec3 olive=mix(vec3(0.30,0.35,0.15),vec3(0.43,0.44,0.20),clamp(vPalette,0.0,1.0));
 float diffuse=0.67+0.33*abs(dot(normalize(vNormal),normalize(uSunDirection)));
 vec3 albedo=linearColor(olive*mix(0.64,1.06,vHeight));
 vec3 lit=albedo*(0.12+diffuse*max(uSunIntensity,0.0))*linearColor(uSunColor);
 float fog=clamp((vDistance-uFogStartDistance)*max(uFogFalloff,0.00001),0.0,uMaximumFogFactor)*0.68;
 lit=mix(lit,uGroundHazeColor,fog*0.48);
 // Match the scene RGBA8 output transfer rather than writing linear dark grass.
 outColor=vec4(pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2)),1.0);
}`;

export function createPlantingPilotRenderer(gl,layout,{createBuffer,createShader,createProgram,createVertexArray,onUpload}={}){
 if(!(layout?.records instanceof Float32Array)||layout.records.length%8)throw Error('PLANTING_PILOT_RECORDS_INVALID');
 const count=layout.records.length/8;
 if(!Number.isSafeInteger(count)||!count)throw Error('PLANTING_PILOT_ROOT_COUNT_INVALID');
 if(layout.receipt?.rootCount!==undefined&&layout.receipt.rootCount!==count)throw Error('PLANTING_PILOT_ROOT_COUNT_MISMATCH');
 for(let i=0;i<layout.records.length;i++)if(!Number.isFinite(layout.records[i]))throw Error('PLANTING_PILOT_NONFINITE_RECORD');
 for(let i=0;i<count;i++){const j=i*8;if(layout.records[j+4]<=0||layout.records[j+5]<=0||layout.records[j+7]<0||layout.records[j+7]>=1)throw Error('PLANTING_PILOT_SHAPE_INVALID');}
 // Six vertices and four submitted triangles per curved leaf. The bottom
 // pair meets at the exact sampled contact; the terminal pair meets at its tip.
 const template=new Float32Array(4*6*3),indices=new Uint16Array(4*12);
 for(let leaf=0;leaf<4;leaf++){
  const angle=leaf*Math.PI*0.5+0.22;
  for(let row=0;row<3;row++)for(let edge=0;edge<2;edge++)template.set([edge?1:-1,row*.5,angle],(leaf*6+row*2+edge)*3);
  const b=leaf*6;indices.set([b,b+1,b+2,b+1,b+3,b+2,b+2,b+3,b+4,b+3,b+5,b+4],leaf*12);
 }
 const bytes=layout.records.byteLength+template.byteLength+indices.byteLength;
 if(bytes>MAX_BYTES)throw Error('PLANTING_PILOT_GPU_BUDGET_EXCEEDED');
 const owned={buffers:[],shaders:[],program:null,vao:null};
 let disposed=false,uploads=0,uploadedBytes=0,frames=0,draws=0;
 function dispose(){if(disposed)return;disposed=true;for(const b of owned.buffers)gl.deleteBuffer(b);if(owned.vao)gl.deleteVertexArray(owned.vao);if(owned.program)gl.deleteProgram(owned.program);for(const s of owned.shaders)gl.deleteShader(s);}
 function shader(type,source,label){
  if(createShader){const s=createShader(type,source,label);if(!s)throw Error('PLANTING_PILOT_SHADER_CREATE_FAILED');owned.shaders.push(s);return s;}
  const s=gl.createShader(type);if(!s)throw Error('PLANTING_PILOT_SHADER_CREATE_FAILED');owned.shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('PLANTING_PILOT_SHADER_COMPILE_FAILED:'+gl.getShaderInfoLog(s));return s;
 }
 function upload(target,data){const b=createBuffer?createBuffer():gl.createBuffer();if(!b)throw Error('PLANTING_PILOT_BUFFER_CREATE_FAILED');owned.buffers.push(b);gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);uploads++;uploadedBytes+=data.byteLength;onUpload?.(data.byteLength);return b;}
 let uniforms;
 try{
  const vs=shader(gl.VERTEX_SHADER,VS,'PLANTING_PILOT_VS'),fs=shader(gl.FRAGMENT_SHADER,FS,'PLANTING_PILOT_FS');
  if(createProgram)owned.program=createProgram(vs,fs,'PLANTING_PILOT_PROGRAM');
  else {owned.program=gl.createProgram();if(!owned.program)throw Error('PLANTING_PILOT_PROGRAM_CREATE_FAILED');gl.attachShader(owned.program,vs);gl.attachShader(owned.program,fs);gl.linkProgram(owned.program);if(!gl.getProgramParameter(owned.program,gl.LINK_STATUS))throw Error('PLANTING_PILOT_PROGRAM_LINK_FAILED:'+gl.getProgramInfoLog(owned.program));}
  if(!owned.program)throw Error('PLANTING_PILOT_PROGRAM_CREATE_FAILED');
  owned.vao=createVertexArray?createVertexArray():gl.createVertexArray();if(!owned.vao)throw Error('PLANTING_PILOT_VAO_CREATE_FAILED');gl.bindVertexArray(owned.vao);
  upload(gl.ARRAY_BUFFER,template);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,12,0);
  upload(gl.ARRAY_BUFFER,layout.records);
  for(let loc=1;loc<=2;loc++){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,4,gl.FLOAT,false,32,(loc-1)*16);gl.vertexAttribDivisor(loc,1);}
  upload(gl.ELEMENT_ARRAY_BUFFER,indices);
  uniforms={matrix:gl.getUniformLocation(owned.program,'uViewProjection'),camera:gl.getUniformLocation(owned.program,'uCamera'),detail:gl.getUniformLocation(owned.program,'uDetail')};
  for(const name of ['uSunDirection','uSunIntensity','uSunColor','uGroundHazeColor','uFogStartDistance','uFogFalloff','uMaximumFogFactor'])uniforms[name]=gl.getUniformLocation(owned.program,name);
  const error=gl.getError();if(error!==gl.NO_ERROR)throw Error('PLANTING_PILOT_UPLOAD_GL_ERROR:'+error);
 }catch(error){dispose();throw error;}
 function draw(packet){
  if(disposed)throw Error('PLANTING_PILOT_DISPOSED');
  const camera=packet?.camera,matrix=camera?.viewProjectionMatrix,p=camera?.position;
  if(!matrix||matrix.length!==16||!p||![p.x,p.y,p.z,...matrix].every(Number.isFinite))throw Error('PLANTING_PILOT_CAMERA_INVALID');
  gl.useProgram(owned.program);gl.bindVertexArray(owned.vao);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);
  gl.uniformMatrix4fv(uniforms.matrix,false,matrix);gl.uniform3f(uniforms.camera,p.x,p.y,p.z);
  const e=packet.environmentUniforms??{},sun=e.sunDirection??{x:-.4,y:.8,z:.3};
  const component=(value,fallback)=>Number.isFinite(value)?value:fallback;
  const color=(value,fallback)=>{const a=Array.isArray(value)||ArrayBuffer.isView(value)?Array.from(value).slice(0,3):value&&typeof value==='object'?[value.r,value.g,value.b]:fallback;const scale=a.some(v=>v>1)?255:1;return a.map((v,i)=>Math.max(0,Math.min(1,component(v,fallback[i])/scale)));};
  let direction=[component(sun.x??sun[0],-.4),component(sun.y??sun[1],.8),component(sun.z??sun[2],.3)];
  if(Math.hypot(...direction)<1e-8)direction=[-.4,.8,.3];
  gl.uniform3f(uniforms.uSunDirection,...direction);gl.uniform1f(uniforms.uSunIntensity,Math.max(0,component(e.sunIntensity,.88)));
  gl.uniform3f(uniforms.uSunColor,...color(e.sunColor,[1,1,1]));gl.uniform3f(uniforms.uGroundHazeColor,...color(e.groundHazeColor,[.54,.59,.62]));
  gl.uniform1f(uniforms.uFogStartDistance,component(e.fogStartDistance,160));gl.uniform1f(uniforms.uFogFalloff,Math.max(0,component(e.fogFalloff,.001)));gl.uniform1f(uniforms.uMaximumFogFactor,Math.max(0,Math.min(1,component(e.maximumFogFactor,.65))));
  gl.uniform1i(uniforms.detail,0);gl.drawElementsInstanced(gl.TRIANGLES,24,gl.UNSIGNED_SHORT,0,count);
  gl.uniform1i(uniforms.detail,1);gl.drawElementsInstanced(gl.TRIANGLES,48,gl.UNSIGNED_SHORT,0,count);
  frames++;draws+=2;
 }
 function getReceipt(){return Object.freeze({schema:'H_EARTH_PLANTING_PILOT_GPU_v1',rootCount:count,layoutDigest:layout.receipt?.layoutDigest??layout.layoutDigest??null,gpuByteLength:bytes,maximumGpuBytes:MAX_BYTES,bufferUploadCount:uploads,uploadedByteLength:uploadedBytes,drawCallCount:draws,frameCount:frames,drawCallsPerFrame:2,perFrameUploadBytes:0,cameraDependentResourceCreation:false,coarsePermanent:true,detailFadeMeters:[12,24],heightCameraIndependent:true,rootEncoding:'ACTUAL_FLOAT32_VISIBLE_TRIANGLE_CONTACTS',disposed});}
 return Object.freeze({draw,getReceipt,dispose});
}
