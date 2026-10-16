/** Targeted actual GPU buffer smoke; no site, device or aesthetic acceptance. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dependencyRoot=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const {chromium}=await import(dependencyRoot
  ? pathToFileURL(path.join(dependencyRoot,'playwright/index.mjs')).href : 'playwright');
const names=['geometry-kernel.north.js','geometry-kernel.east.js','geometry-kernel.south.js','geometry-kernel.west.js','geometry-kernel.sweep.v1.js','geometry-kernel.passage-consumer.v1.js'];
const modules=Object.fromEntries(names.map(name=>[name,fs.readFileSync(path.join(root,'showroom/globe/h-earth/render',name),'utf8')]));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:320,height:240}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<!doctype html><canvas width="320" height="240"></canvas>');
 const receipt=await page.evaluate(async modules=>{
  const mappings={},urls=[];
  for(const [name,source] of Object.entries(modules)){
   const rewritten=source.replace(/from\s+(['"])\.\/(geometry-kernel[^'"/]+\.js)\1/g,(_,q,n)=>`from ${q}kernel-${n}${q}`);
   const url=URL.createObjectURL(new Blob([rewritten],{type:'text/javascript'}));urls.push(url);mappings['kernel-'+name]=url;
  }
  const map=document.createElement('script');map.type='importmap';map.textContent=JSON.stringify({imports:mappings});document.head.append(map);
  const api=await import(mappings['kernel-geometry-kernel.passage-consumer.v1.js']);
  const consumer=api.buildHEarthPassageConsumer({primitiveId:'webgl-inside-passage',centerline:[{x:0,y:0,z:0},{x:0,y:0,z:10}],profile:[{x:-2,y:-1},{x:2,y:-1},{x:2,y:3},{x:-2,y:3}]});
  if(!consumer.valid)throw Error(JSON.stringify(consumer));
  const gl=document.querySelector('canvas').getContext('webgl2',{antialias:false,preserveDrawingBuffer:true});
  if(!gl)throw Error('WEBGL2_UNAVAILABLE');
  const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const vertex=compile(gl.VERTEX_SHADER,`#version 300 es
   in vec3 aPosition;in vec3 aNormal;out float vLight;
   void main(){vec3 q=vec3(-aPosition.x,aPosition.y-1.0,-(aPosition.z-5.0));
   float f=1.428148;float n=0.1;float z=20.0;
   gl_Position=vec4(q.x*f/(320.0/240.0),q.y*f,-(z+n)/(z-n)*q.z-2.0*z*n/(z-n),-q.z);
   vLight=0.4+0.6*abs(dot(normalize(aNormal),normalize(vec3(0.2,0.5,-0.8))));}`);
  const fragment=compile(gl.FRAGMENT_SHADER,`#version 300 es
   precision highp float;in float vLight;out vec4 color;
   void main(){color=vec4(vec3(0.65,0.32,0.16)*vLight,1.0);}`);
  const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const resources=[];
  for(const [name,data] of [['aPosition',consumer.renderBuffers.positions],['aNormal',consumer.renderBuffers.normals]]){
   const buffer=gl.createBuffer();resources.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
   const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);
  }
  const element=gl.createBuffer();resources.push(element);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,element);
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);gl.viewport(0,0,320,240);
  const draw=indices=>{gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);gl.clearColor(.01,.015,.02,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);gl.finish();const pixels=new Uint8Array(320*240*4);gl.readPixels(0,0,320,240,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let lit=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]>30)lit++;return lit;};
  const inwardPixels=draw(consumer.renderBuffers.indices);
  const outwardNegativeControlPixels=draw(new Uint16Array(consumer.geometry.indices));
  const glError=gl.getError(),debug=gl.getExtension('WEBGL_debug_renderer_info');
  const renderer=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
  const query=api.evaluateHEarthPassageSphereMove(consumer,{from:{x:0,y:1,z:1},to:{x:0,y:1,z:9},radius:.5});
  for(const b of resources)gl.deleteBuffer(b);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);for(const u of urls)URL.revokeObjectURL(u);
  return {schema:'GEOMETRY_KERNEL_PASSAGE_WEBGL_BUFFER_SMOKE_v1',actualBrowserExecution:true,webgl2:true,renderer,width:320,height:240,inwardPixels,outwardNegativeControlPixels,glError,westAdmitted:consumer.primitive.admitted,linearSphereMoveCertified:query.clearanceCertified,vertexCount:consumer.renderBuffers.positions.length/3,triangleCount:consumer.renderBuffers.indices.length/3,physicalDeviceAcceptance:false,visualQualityAcceptance:false,productIntegrated:false};
 },modules);
 assert.equal(receipt.glError,0);assert.equal(receipt.westAdmitted,true);assert.equal(receipt.linearSphereMoveCertified,true);
 assert.ok(receipt.inwardPixels>1000,JSON.stringify(receipt));assert.equal(receipt.outwardNegativeControlPixels,0);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({...receipt,result:'PASS',pageErrors:errors},null,2));
} finally {await browser.close();}
