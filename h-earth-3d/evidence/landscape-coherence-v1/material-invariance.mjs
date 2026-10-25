import fs from 'node:fs';import {execFileSync} from 'node:child_process';import puppeteer from 'puppeteer-core';
const root=process.cwd(),path='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const modules={RENDERED_BEACH_GLSL:'rendered-beach-signal.v1.js',HILLSIDE_SHORELINE_GLSL:'hillside-shoreline-field.v1.js',LANDSCAPE_COHERENCE_GLSL:'landscape-coherence-field.v1.js',FOOTHILL_MEADOW_GLSL:'foothill-meadow-field.v1.js'};const values={};for(const [key,file]of Object.entries(modules))values[key]=(await import('file://'+root+'/showroom/globe/h-earth/render/'+file))[key];
function shader(s){return s.match(/const FS = `([\s\S]*?)`;/)[1].replace(/\$\{(\w+)\}/g,(_,k)=>values[k]);}
const sources={rejected:shader(execFileSync('git',['show',(process.env.REJECTED_CANDIDATE_REF||'574a8a0127b7a0c77d70156ea22e057ad0417bb0')+':'+path],{cwd:root,encoding:'utf8'})),repair:shader(fs.readFileSync(root+'/'+path,'utf8'))};
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'],defaultViewport:{width:16,height:16}});
try{const page=await browser.newPage();const result=await page.evaluate(sources=>{
const gl=document.createElement('canvas').getContext('webgl2');if(!gl)throw Error('WEBGL2_UNAVAILABLE');
const vs=`#version 300 es
precision highp float;precision highp int;
uniform vec4 colour;uniform vec4 material;
out vec3 vWorldPosition;out vec3 vNormal;out vec4 vBaseColor;out vec4 vMaterialParameters;flat out uint vMaterialModelCode;flat out uint vSurfaceClassCode;flat out uint vPrimitiveIndex;flat out uint vRoleCode;out float vCoastDistanceMeters;out float vContactDistanceMeters;
void main(){vec2 p=gl_VertexID==0?vec2(-1,-1):gl_VertexID==1?vec2(3,-1):vec2(-1,3);gl_Position=vec4(p,0,1);vWorldPosition=vec3(200.+p.x,20.,-350.+p.y);vNormal=vec3(0,1,0);vBaseColor=colour;vMaterialParameters=material;vMaterialModelCode=1u;vSurfaceClassCode=1u;vPrimitiveIndex=1u;vRoleCode=1u;vCoastDistanceMeters=100.;vContactDistanceMeters=100.;}`;
function compile(type,s){const o=gl.createShader(type);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(o));return o;}
const results={};for(const [name,fs]of Object.entries(sources)){const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));gl.useProgram(p);const u=n=>gl.getUniformLocation(p,n);
for(const n of ['uSunDirection','uSunColor'])gl.uniform3f(u(n),...(n==='uSunDirection'?[0,1,0]:[1,1,1]));gl.uniform1f(u('uSunIntensity'),1);gl.uniform1f(u('uPlanetRadius'),420000);gl.uniform3f(u('uCameraPosition'),200,22,-340);
for(const n of ['uClearingShadow','uCavernShadow'])gl.uniform1i(u(n),1);
const colors=[];for(const [c,m]of [[[.1,.1,.1,1],[0,0,0,0]],[[.8,.4,.2,1],[1,1,1,1]]]){gl.uniform4fv(u('colour'),c);gl.uniform4fv(u('material'),m);gl.viewport(0,0,16,16);gl.drawArrays(gl.TRIANGLES,0,3);const pixel=new Uint8Array(4);gl.readPixels(8,8,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);const err=gl.getError();if(err)throw Error('GL_ERROR_'+err);colors.push([...pixel]);}results[name]={colors,equal:JSON.stringify(colors[0])===JSON.stringify(colors[1])};}return results;},sources);
console.log(JSON.stringify(result));fs.writeFileSync(new URL('material-invariance.json',import.meta.url),JSON.stringify(result,null,2));if(result.rejected.equal||!result.repair.equal)throw Error('MATERIAL_INVARIANCE_FAILED');}finally{await browser.close();}
