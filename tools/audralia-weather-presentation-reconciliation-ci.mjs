#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BASE='http://127.0.0.1:4173';
const SCHEMA='AUDRALIA_ADVANCED_ONLY_RUNTIME_CAUSAL_QUALIFICATION_v1';
const POLICY='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v7_GLOBAL_ADVANCED_ONLY';
const LIVE='AUDRALIA_LIVE_PLANETARY_INTEGRATION_v8_ADVANCED_CLOUD_GLOBALIZATION';
const FIXED_TIME=Date.parse('2026-08-24T22:00:00.000Z');
const INDEX='showroom/globe/audralia/index.html';
const FAP='showroom/globe/audralia/fap1-weather-presentation-v1.mjs';
const TABLET='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs';
const TABLET_RUNTIME='showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs';
const SNAPSHOT='inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/';
const FROZEN_BLOBS=Object.freeze({[INDEX]:'9f7eb0076f9ab8f7bbd3b3776c614009f70beaf7',[FAP]:'631959a9807242f4fd995ecc077ba2bec0e1bdb2',[TABLET]:'de19bbf6c8f4d42cfc5be0cbc0491bac9d0b7d2b',[TABLET_RUNTIME]:'8d574a20c081a1bde71393f5f783d0637efe8551'});
const PROFILES=Object.freeze({
  PHONE:{width:720,height:1280,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  TABLET:{width:1280,height:800,deviceScaleFactor:2,isMobile:true,hasTouch:true}
});
// Frozen before observations: all eleven source anchors, the former camera
// geometry/time, and conservative predecessor materiality floors on this NEW
// v7 subject. Neither V6-family qualification nor aesthetic acceptance is claimed.
const GUARDS=Object.freeze({positiveMinimum:2,materialMinimum:1,meanAlphaDelta:.0015,coverageDelta:.002,nonzeroAlpha:8,strongAlpha:32,clearFactor:.12,quantizationTolerance:1/255});
const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

export function staticCandidate(){
  const sources=Object.fromEntries(Object.keys(FROZEN_BLOBS).map(p=>[p,read(p)]));
  const identities=Object.fromEntries(Object.entries(sources).map(([p,s])=>{const b=Buffer.from(s);assert.equal(gitBlob(b),FROZEN_BLOBS[p],`FROZEN_PRODUCT_BLOB_CHANGED:${p}`);return [p,{gitBlob:gitBlob(b),sha256:sha256(b),bytes:b.length}];}));
  const index=sources[INDEX],phone=sources[FAP],tablet=sources[TABLET];
  assert.ok(index.includes(LIVE)&&phone.includes(POLICY),'ADVANCED_SUBJECT_IDENTITY_MISSING');
  for(const marker of ['advancedCloudGlobalization: true','cheapGlobalCloudVisualAuthority: false','directDenseCloudCoverage: false','cloudCoverageUpgradeDeferred: false'])assert.ok(index.includes(marker),`ADVANCED_AUTHORITY_MISSING:${marker}`);
  const acf=index.indexOf("await import('/"+SNAPSHOT+'acf1-cloud-presentation-v1.mjs');
  const xyz=index.indexOf("await import('/"+SNAPSHOT+'fap1-xyz-volumetric-depth-v1.mjs');
  const fap=index.indexOf("await import('./fap1-weather-presentation-v1.mjs");
  assert.ok(acf>=0&&xyz>acf&&fap>xyz,'ACTIVE_ACF_XYZ_FAP_STARTUP_ORDER_FAILURE');
  assert.ok(!index.includes('final-cloud-shader-composition-v1.mjs'),'RETIRED_COMPOSITOR_ACTIVE');
  const donor=(source,kind)=>[...source.matchAll(kind==='phone'?/weather\+=fap1(Front|Jet|Cyclone)System\(radial,h,lat,lon,([^;]+)\);/g:/weather\+=(front|jet|cyclone)System\((?:radial,)?h,lat,lon,([^;]+),broad,detail\);/g)].map(m=>({family:m[1].toLowerCase(),parameters:m[2].split(',').map(Number)}));
  const donors=donor(phone,'phone');assert.equal(donors.length,11,'DONOR_COUNT');assert.deepEqual(donors,donor(tablet,'tablet'),'PHONE_TABLET_DONOR_PARAMETER_DRIFT');
  for(const [family,count] of [['front',5],['jet',4],['cyclone',2]])assert.equal(donors.filter(p=>p.family===family).length,count,`FAMILY_COUNT:${family}`);
  const windows=source=>[...source.matchAll(/(?:fap1Disk|diskAt)\(lat,lon,([.\d,-]+)\)/g)].map(m=>m[1].split(',').map(Number));
  const clearWindows=windows(phone);assert.equal(clearWindows.length,3,'CLEAR_WINDOW_COUNT');assert.deepEqual(clearWindows,windows(tablet),'PHONE_TABLET_CLEAR_WINDOW_DRIFT');
  assert.match(tablet,/REST_STEPS\s*=\s*8/,'TABLET_REST_CEILING_DRIFT');assert.match(tablet,/INTERACTION_STEPS\s*=\s*6/,'TABLET_INTERACTION_CEILING_DRIFT');
  assert.match(index,/tabletPixelBudget\s*=\s*921600/,'TABLET_PIXEL_CEILING_DRIFT');
  const exterior=read(SNAPSHOT+'weather-presentation-reconciliation/exterior-weather.mjs');
  assert.match(exterior,/const REST_STEPS=32,INTERACTION_STEPS=15,REST_MAX_PIXELS=230000,INTERACTION_MAX_PIXELS=90000;/,'PHONE_EXISTING_CEILINGS_DRIFT');
  return {policy:POLICY,liveSchema:LIVE,identities,donors,clearWindows,guards:GUARDS,profiles:PROFILES,fixedTime:FIXED_TIME,phoneExistingCeilings:{restSteps:32,interactionSteps:15,restPixels:230000,interactionPixels:90000}};
}

function targetFromLatLon(lat,lon){
  const R=6200,north=[0,.5,-.8660254037844386],meridian=[0,.8660254037844386,.5],east=[1,0,0];
  const direction=[0,1,2].map(i=>east[i]*Math.cos(lat)*Math.sin(lon)+meridian[i]*Math.cos(lat)*Math.cos(lon)+north[i]*Math.sin(lat));
  const length=Math.hypot(...direction)||1;for(let i=0;i<3;i++)direction[i]/=length;
  const angle=Math.acos(Math.max(-1,Math.min(1,direction[1]))),sine=Math.sin(angle);
  return {targetU:Math.abs(sine)<1e-9?0:R*angle*direction[0]/sine,targetV:Math.abs(sine)<1e-9?0:R*angle*direction[2]/sine,distance:5000,pitch:1.08,yaw:0};
}

// This init script reaches the ORIGINAL native submission boundary: product
// shaderSource wrappers subsequently delegate to it. Diagnostic calls use the
// retained native methods and cannot masquerade as ordinary product draws.
function installNativeAudit({fixedTime,ablate,profile}){
  const NativeDate=Date;class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:[fixedTime]));}static now(){return fixedTime;}}Object.setPrototypeOf(FixedDate,NativeDate);globalThis.Date=FixedDate;
  const P=WebGL2RenderingContext.prototype;
  const uniformMethods=['uniform1f','uniform1i','uniform2f','uniform2fv','uniform3f','uniform3fv','uniform4f','uniform4fv','uniformMatrix4fv'];
  const native=Object.fromEntries(['shaderSource','compileShader','linkProgram','drawArrays',...uniformMethods].map(k=>[k,P[k]]));
  const shaderRecords=new Map(),programRecords=new Map(),contexts=[],failures=[],captures=[];
  let pending=null,diagnostic=false;
  const need=(condition,code)=>{if(!condition){failures.push(code);throw new Error(code);}};
  const b64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(s);};
  const plain=value=>ArrayBuffer.isView(value)?Array.from(value):value;
  const originalContext=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,attributes){const gl=originalContext.call(this,type,attributes);if(gl&&/^webgl/.test(type)&&!contexts.some(x=>x.gl===gl)){contexts.push({gl,type,requests:1});this.addEventListener('webglcontextlost',()=>failures.push('CONTEXT_LOST'));}else if(gl&&/^webgl/.test(type)){contexts.find(x=>x.gl===gl).requests++;}return gl;};
  function healthy(gl,label){need(!gl.isContextLost(),`${label}:CONTEXT_LOST`);const error=gl.getError();need(error===gl.NO_ERROR,`${label}:GL_ERROR:${error}`);}
  function uniforms(gl,program){const out={};for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);i++){const u=gl.getActiveUniform(program,i);out[u.name]={type:u.type,size:u.size,value:plain(gl.getUniform(program,gl.getUniformLocation(program,u.name)))};}return out;}
  function readPixels(gl,w,h){const pack={buffer:gl.getParameter(gl.PIXEL_PACK_BUFFER_BINDING),alignment:gl.getParameter(gl.PACK_ALIGNMENT),row:gl.getParameter(gl.PACK_ROW_LENGTH),pixels:gl.getParameter(gl.PACK_SKIP_PIXELS),rows:gl.getParameter(gl.PACK_SKIP_ROWS)};try{gl.bindBuffer(gl.PIXEL_PACK_BUFFER,null);gl.pixelStorei(gl.PACK_ALIGNMENT,4);gl.pixelStorei(gl.PACK_ROW_LENGTH,0);gl.pixelStorei(gl.PACK_SKIP_PIXELS,0);gl.pixelStorei(gl.PACK_SKIP_ROWS,0);const bytes=new Uint8Array(w*h*4);gl.finish();gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,bytes);healthy(gl,'READ_PIXELS');return bytes;}finally{gl.bindBuffer(gl.PIXEL_PACK_BUFFER,pack.buffer);gl.pixelStorei(gl.PACK_ALIGNMENT,pack.alignment);gl.pixelStorei(gl.PACK_ROW_LENGTH,pack.row);gl.pixelStorei(gl.PACK_SKIP_PIXELS,pack.pixels);gl.pixelStorei(gl.PACK_SKIP_ROWS,pack.rows);}}
  function framebufferDraw(gl,w,h,draw,{assay=false}={}){
    const state={draw:gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING),read:gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),readBuffer:gl.getParameter(gl.READ_BUFFER),texture:gl.getParameter(gl.TEXTURE_BINDING_2D),activeTexture:gl.getParameter(gl.ACTIVE_TEXTURE),clear:Array.from(gl.getParameter(gl.COLOR_CLEAR_VALUE)),blend:gl.isEnabled(gl.BLEND),viewport:Array.from(gl.getParameter(gl.VIEWPORT)),program:gl.getParameter(gl.CURRENT_PROGRAM),vao:gl.getParameter(gl.VERTEX_ARRAY_BINDING),depth:gl.isEnabled(gl.DEPTH_TEST),stencil:gl.isEnabled(gl.STENCIL_TEST),scissor:gl.isEnabled(gl.SCISSOR_TEST),colorMask:Array.from(gl.getParameter(gl.COLOR_WRITEMASK)),depthMask:gl.getParameter(gl.DEPTH_WRITEMASK)};
    let texture=null,framebuffer=null;
    try{
      texture=gl.createTexture();framebuffer=gl.createFramebuffer();need(texture&&framebuffer,'DIAGNOSTIC_RESOURCE_ALLOCATION_FAILED');gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);need(gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE,'DIAGNOSTIC_FRAMEBUFFER_INCOMPLETE');gl.bindTexture(gl.TEXTURE_2D,state.texture);gl.readBuffer(gl.COLOR_ATTACHMENT0);
      gl.disable(gl.BLEND);gl.clearColor(0,0,0,0);
      if(assay){gl.viewport(0,0,w,h);gl.disable(gl.DEPTH_TEST);gl.disable(gl.STENCIL_TEST);gl.disable(gl.SCISSOR_TEST);gl.colorMask(true,true,true,true);gl.depthMask(false);}
      gl.clear(gl.COLOR_BUFFER_BIT);draw();healthy(gl,'DIAGNOSTIC_DRAW');return readPixels(gl,w,h);
    }finally{
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,state.draw);gl.bindFramebuffer(gl.READ_FRAMEBUFFER,state.read);gl.readBuffer(state.readBuffer);gl.activeTexture(state.activeTexture);gl.bindTexture(gl.TEXTURE_2D,state.texture);gl.clearColor(...state.clear);(state.blend?gl.enable:gl.disable).call(gl,gl.BLEND);gl.viewport(...state.viewport);gl.useProgram(state.program);gl.bindVertexArray(state.vao);for(const [cap,enabled] of [[gl.DEPTH_TEST,state.depth],[gl.STENCIL_TEST,state.stencil],[gl.SCISSOR_TEST,state.scissor]])(enabled?gl.enable:gl.disable).call(gl,cap);gl.colorMask(...state.colorMask);gl.depthMask(state.depthMask);if(framebuffer)gl.deleteFramebuffer(framebuffer);if(texture)gl.deleteTexture(texture);healthy(gl,'DIAGNOSTIC_STATE_RESTORE');
    }
  }
  P.shaderSource=function(shader,source){
    if(diagnostic)return native.shaderSource.call(this,shader,source);
    const call=profile==='TABLET'?'advancedCloudField(p)':'fap1OrganizedWeather(radial,h,lat,lon)';
    const relevant=typeof source==='string'&&source.includes(profile==='TABLET'?'vec3 advancedCloudField(vec3 p)':'vec3 fap1OrganizedWeather(');
    let submitted=source;
    if(relevant){
      need(source.split(call).length-1===1,'ADVANCED_CALL_SITE_COUNT_FAILURE');
      need(/weather\s*\*=\s*1\.0-\.88\*clear\s*;/.test(source),'SUBMITTED_CLEAR_MULTIPLICATION_MISSING');
      if(profile==='PHONE'){need(source.includes('float background=0.0*(1.0-clearCorridor);'),'SUBMITTED_CHEAP_BACKGROUND_NOT_REMOVED');need(!source.includes('float background=globalCloudSupport('),'SUBMITTED_CHEAP_BACKGROUND_REMAINS');}
      else need(!source.includes('globalCloudSupport('),'TABLET_CHEAP_BACKGROUND_REMAINS');
      if(ablate)submitted=source.replace(call,'vec3(0.0)');
    }
    shaderRecords.set(shader,{gl:this,type:this.getShaderParameter(shader,this.SHADER_TYPE),original:source,submitted,relevant,call:relevant?call:null,ablationApplied:relevant&&ablate,compiled:false});
    return native.shaderSource.call(this,shader,submitted);
  };
  P.compileShader=function(shader){const result=native.compileShader.call(this,shader);const r=shaderRecords.get(shader);if(r){r.compiled=this.getShaderParameter(shader,this.COMPILE_STATUS);r.compileLog=this.getShaderInfoLog(shader)||'';if(r.relevant)need(r.compiled,`CLOUD_COMPILE_FAILURE:${r.compileLog}`);}return result;};
  P.linkProgram=function(program){const result=native.linkProgram.call(this,program);const attached=this.getAttachedShaders(program)||[],cloud=attached.map(s=>shaderRecords.get(s)).find(r=>r?.relevant);if(cloud){const linked=this.getProgramParameter(program,this.LINK_STATUS);need(linked,`CLOUD_LINK_FAILURE:${this.getProgramInfoLog(program)}`);programRecords.set(program,{gl:this,program,cloud,linked,draws:0,steps:[],lastUniforms:null,pendingUniformCalls:[]});}return result;};
  for(const method of uniformMethods)P[method]=function(...args){const r=programRecords.get(this.getParameter(this.CURRENT_PROGRAM));if(r&&!diagnostic)r.pendingUniformCalls.push({method,values:args.slice(1).map(plain),optimizedOutLocation:args[0]===null});return native[method].apply(this,args);};
  P.drawArrays=function(...args){
    const program=this.getParameter(this.CURRENT_PROGRAM),r=programRecords.get(program);
    if(!r||diagnostic)return native.drawArrays.apply(this,args);
    r.draws++;r.lastUniforms=uniforms(this,program);const uniformCalls=r.pendingUniformCalls.splice(0);const steps=uniformCalls.filter(c=>c.method==='uniform1i').at(-1)?.values[0];if(!r.steps.includes(steps))r.steps.push(steps);
    if(pending===null)return native.drawArrays.apply(this,args);
    const label=pending;pending=null;healthy(this,'BEFORE_NATIVE_DRAW');
    need(this.getParameter(this.DRAW_FRAMEBUFFER_BINDING)===null,'CLOUD_DRAW_NOT_ON_DISPLAY_FRAMEBUFFER');need(this.getParameter(this.READ_FRAMEBUFFER_BINDING)===null,'CLOUD_READ_NOT_ON_DISPLAY_FRAMEBUFFER');
    const width=this.drawingBufferWidth,height=this.drawingBufferHeight;need(width>0&&height>0,'EMPTY_CLOUD_BUFFER');
    const canvas=this.canvas,rect=canvas.getBoundingClientRect();let opacity=1;for(let node=canvas;node;node=node.parentElement){const style=getComputedStyle(node);need(style.display!=='none'&&style.visibility!=='hidden','CLOUD_CANVAS_HIDDEN');opacity*=Number(style.opacity);}
    need(canvas.isConnected&&opacity>0&&rect.width>0&&rect.height>0&&rect.right>0&&rect.bottom>0&&rect.left<innerWidth&&rect.top<innerHeight,'CLOUD_DRAW_NOT_VISIBLE');
    const before=readPixels(this,width,height);const result=native.drawArrays.apply(this,args);const after=readPixels(this,width,height);
    diagnostic=true;let isolated;try{isolated=framebufferDraw(this,width,height,()=>native.drawArrays.apply(this,args));}finally{diagnostic=false;}
    captures.push({label,width,height,contextId:contexts.findIndex(x=>x.gl===this),uniforms:r.lastUniforms,uniformCalls,args,viewport:Array.from(this.getParameter(this.VIEWPORT)),before:b64(before),after:b64(after),isolated:b64(isolated),nativeDraw:true,diagnosticUsesSameLinkedProgram:true,visible:true});return result;
  };
  const resources=()=>({canvases:Array.from(document.querySelectorAll('canvas')).map(c=>({attributes:Object.fromEntries(Array.from(c.attributes).filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value])),width:c.width,height:c.height})),contexts:contexts.map(x=>({type:x.type,requests:x.requests,width:x.gl.drawingBufferWidth,height:x.gl.drawingBufferHeight,primary:x.gl.canvas.matches('[data-h-earth-map-wide-canvas]'),lost:x.gl.isContextLost()}))});
  function maskAssay(windows){
    need(programRecords.size===1,'EXPECTED_ONE_ACTIVE_CLOUD_PROGRAM');const r=[...programRecords.values()][0],gl=r.gl,source=r.cloud.original;
    const main=source.indexOf('void main(');need(main>0,'CLEAR_ASSAY_MAIN_NOT_FOUND');
    const centers=[...windows.map(w=>w.slice(0,2)),[Math.PI/2,0]];
    const expressions=centers.map(([lat,lon])=>profile==='PHONE'?`fap1ClearCorridor(${lat.toFixed(9)},${lon.toFixed(9)})`:`max(diskAt(${lat.toFixed(9)},${lon.toFixed(9)},${windows[0].map(x=>x.toFixed(9)).join(',')}),max(diskAt(${lat.toFixed(9)},${lon.toFixed(9)},${windows[1].map(x=>x.toFixed(9)).join(',')}),diskAt(${lat.toFixed(9)},${lon.toFixed(9)},${windows[2].map(x=>x.toFixed(9)).join(',')})))`);
    // Exact submitted helpers are retained. The asserted submitted multiplier
    // is sampled directly; this is a FACTOR assay, never absolute cloud alpha.
    const fragment=source.slice(0,main)+`void main(){int index=int(gl_FragCoord.x);float clear=0.0;${expressions.map((e,i)=>`if(index==${i})clear=${e};`).join('')}float factor=1.0-.88*clear;outColor=vec4(factor,factor,factor,1.0);}`;
    const vertex='#version 300 es\nprecision highp float;out vec2 vNdc;void main(){vec2 p=gl_VertexID==0?vec2(-1.,-1.):(gl_VertexID==1?vec2(3.,-1.):vec2(-1.,3.));vNdc=p;gl_Position=vec4(p,0.,1.);}';
    let vs=null,fs=null,program=null,vao=null;diagnostic=true;
    try{
      const compile=(type,text)=>{const shader=gl.createShader(type);native.shaderSource.call(gl,shader,text);native.compileShader.call(gl,shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const log=gl.getShaderInfoLog(shader);gl.deleteShader(shader);need(false,`CLEAR_ASSAY_COMPILE:${log}`);}return shader;};
      vs=compile(gl.VERTEX_SHADER,vertex);fs=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);native.linkProgram.call(gl,program);need(gl.getProgramParameter(program,gl.LINK_STATUS),`CLEAR_ASSAY_LINK:${gl.getProgramInfoLog(program)}`);vao=gl.createVertexArray();
      const bytes=framebufferDraw(gl,4,1,()=>{gl.useProgram(program);gl.bindVertexArray(vao);native.drawArrays.call(gl,gl.TRIANGLES,0,3);},{assay:true});
      return {source,fragment,vertex,width:4,height:1,pixels:b64(bytes),factors:[0,1,2,3].map(i=>bytes[i*4]/255),centers,claim:'SOURCE_ATTENUATION_FACTOR_ONLY'};
    }finally{if(vao)gl.deleteVertexArray(vao);if(program)gl.deleteProgram(program);if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);diagnostic=false;healthy(gl,'CLEAR_ASSAY_CLEANUP');}
  }
  window.__AUDRALIA_NATIVE_QUALIFICATION__={arm:label=>{need(pending===null,'PREVIOUS_CAPTURE_NOT_EXECUTED');pending=label;},take:()=>captures.splice(0),resources,maskAssay,get:()=>({failures:[...failures],pending,programs:[...programRecords.values()].map(r=>({original:r.cloud.original,submitted:r.cloud.submitted,call:r.cloud.call,ablationApplied:r.cloud.ablationApplied,compiled:r.cloud.compiled,compileLog:r.cloud.compileLog,linked:r.linked,draws:r.draws,steps:r.steps,lastUniforms:r.lastUniforms,contextId:contexts.findIndex(x=>x.gl===r.gl)}))})};
}

function pixelRecord(encoded,width,height,file){const bytes=Buffer.from(encoded,'base64');assert.equal(bytes.length,width*height*4,'PIXEL_BYTE_COUNT');fs.writeFileSync(file,bytes);let nonzero=0,strong=0,alpha=0,rgb=0;for(let i=0;i<bytes.length;i+=4){const a=bytes[i+3];if(a>GUARDS.nonzeroAlpha)nonzero++;if(a>GUARDS.strongAlpha)strong++;alpha+=a/255;rgb+=(bytes[i]+bytes[i+1]+bytes[i+2])/(3*255);}const total=width*height;return {file:path.basename(file),bytes:bytes.length,sha256:sha256(bytes),meanAlpha:alpha/total,meanRgb:rgb/total,nonzeroFraction:nonzero/total,strongFraction:strong/total};}
function saveText(dir,name,text){const file=path.join(dir,name);fs.writeFileSync(file,text);return {file:name,sha256:sha256(text),bytes:Buffer.byteLength(text)};}
function stripFrame(frame,dir){const result={...frame};for(const part of ['before','after','isolated'])result[part]=pixelRecord(frame[part],frame.width,frame.height,path.join(dir,`${frame.label}-${part}.rgba`));const before=Buffer.from(frame.before,'base64'),after=Buffer.from(frame.after,'base64');let changed=0;for(let i=0;i<before.length;i+=4)if(before[i]!==after[i]||before[i+1]!==after[i+1]||before[i+2]!==after[i+2]||before[i+3]!==after[i+3])changed++;result.nativeChangedPixels=changed;return result;}

async function runVariant(browser,{profile,ablate,staticEvidence,directory}){
  const dir=path.join(directory,`${profile.toLowerCase()}-${ablate?'ablated':'enabled'}`);fs.mkdirSync(dir);
  const page=await browser.newPage();const record={profile,ablate,errors:[],failedResources:[],sources:[],probes:[],clearProbes:[],complete:false};
  const pendingSources=[];page.on('pageerror',e=>record.errors.push(String(e?.stack||e)));page.on('requestfailed',r=>record.failedResources.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',response=>{const url=response.url();if(!/\.(?:mjs|js|html)(?:[?#]|$)|\/audralia\/$/.test(url))return;pendingSources.push((async()=>{const u=new URL(url);if(response.status()>=400)throw new Error(`MODULE_HTTP_FAILURE:${response.status()}:${url}`);if(response.status()!==200)return;const bytes=await response.buffer();const item={url,status:response.status(),sha256:sha256(bytes),bytes:bytes.length};if(u.origin===BASE){let local=decodeURIComponent(u.pathname).replace(/^\/+/, '');if(local.endsWith('/'))local+='index.html';const file=path.resolve(ROOT,local);assert.ok(file.startsWith(ROOT+path.sep),'LOCAL_SOURCE_PATH_ESCAPE');assert.equal(sha256(fs.readFileSync(file)),item.sha256,`SERVED_SOURCE_MISMATCH:${local}`);item.exactLocalBytesVerified=true;}record.sources.push(item);})().catch(error=>record.errors.push(String(error?.stack||error))));});
  try{
    await page.setViewport(PROFILES[profile]);await page.evaluateOnNewDocument(installNativeAudit,{fixedTime:FIXED_TIME,ablate,profile});
    await page.goto(BASE+'/showroom/globe/audralia/',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>{const s=window.__AUDRALIA_TABLET_STARTUP_STABILITY__;if(s?.status==='FAILED')throw new Error(`STARTUP_FAILED:${s.error}`);const audit=window.__AUDRALIA_NATIVE_QUALIFICATION__?.get();if(audit?.failures?.length)throw new Error(audit.failures.join('|'));const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;return s?.status==='COMPLETE'&&proof?.getRuntime?.()?.invariants?.pass===true&&document.querySelector('[data-audralia-loader]')?.classList.contains('is-ready');},{timeout:120000});
    record.live=await page.evaluate(()=>({integration:window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__,budget:window.__AUDRALIA_RENDER_PIXEL_BUDGET__,startup:window.__AUDRALIA_TABLET_STARTUP_STABILITY__,worldCanvasCount:document.querySelectorAll('[data-h-earth-map-wide-canvas]').length,status:document.querySelector('[data-h-earth-status]')?.dataset.status,loaderReady:document.querySelector('[data-audralia-loader]')?.classList.contains('is-ready'),resources:window.__AUDRALIA_NATIVE_QUALIFICATION__.resources(),world:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__.renderer.getSnapshot().worldContract}));
    assert.equal(record.live.integration.schema,LIVE,'LIVE_SCHEMA');assert.equal(record.live.integration.startupArchitecture,'APPROVED_PRESENTATION_PRE_RENDER_v1','STARTUP_ARCHITECTURE');assert.equal(record.live.integration.cameraSemanticsFrozen,true,'CAMERA_AUTHORITY');assert.equal(record.live.worldCanvasCount,1,'WORLD_CANVAS_COUNT');assert.equal(record.live.loaderReady,true,'LOADER_NOT_READY');assert.equal(record.live.budget.active,profile==='TABLET','WRONG_DEVICE_STARTUP_BRANCH');
    if(profile==='TABLET'){assert.equal(record.live.resources.canvases.length,1,'TABLET_ADDED_CANVAS');assert.equal(record.live.resources.contexts.length,1,'TABLET_EXTRA_CONTEXT');assert.equal(record.live.resources.contexts[0].primary,true,'TABLET_CONTEXT_NOT_PRIMARY');assert.equal(record.live.resources.contexts[0].requests,1,'TABLET_CONTEXT_REQUEST_COUNT');assert.ok(record.live.resources.contexts[0].width*record.live.resources.contexts[0].height<=921600,'TABLET_PIXEL_BUDGET');}
    const capture=async(label,lat,lon,{interaction=false}={})=>{
      const camera=targetFromLatLon(lat,lon);
      const data=await page.evaluate(({label,camera,interaction,profile})=>{
        const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__,audit=window.__AUDRALIA_NATIVE_QUALIFICATION__;
        if(profile==='TABLET'){
          Object.assign(proof.renderer.state,camera);proof.renderer.render();interaction?proof.clouds.beginInteraction():proof.clouds.endInteraction();audit.arm(label);proof.clouds.render(proof.getCameraFrame());
        }else{
          interaction?proof.exterior.beginInteraction():proof.exterior.endInteraction();audit.arm(label);proof.setCameraStateForTest(camera);
        }
        const frames=audit.take(),state=proof.renderer.getSnapshot();return {frames,camera:Object.fromEntries(['targetU','targetV','distance','pitch','yaw','worldContract'].map(k=>[k,state[k]])),audit:audit.get()};
      },{label,camera,interaction,profile});
      assert.deepEqual(data.audit.failures,[],'NATIVE_AUDIT_FAILURE');assert.equal(data.frames.length,1,'EXPECTED_EXACTLY_ONE_CLOUD_DRAW_PER_PROBE');const frame=stripFrame(data.frames[0],dir);const expectedSteps=profile==='TABLET'?(interaction?6:8):(interaction?15:32);assert.equal(frame.uniformCalls.filter(c=>c.method==='uniform1i').at(-1)?.values[0],expectedSteps,'ACTUAL_SUBMITTED_STEP_CEILING');if(!ablate)assert.equal(frame.uniforms.uStepCount?.value,expectedSteps,'ENABLED_LINKED_STEP_UNIFORM');if(profile==='TABLET')assert.ok(frame.width*frame.height<=921600,'TABLET_PROBE_PIXEL_BUDGET');
      const png=await page.screenshot({path:path.join(dir,`${label}.png`),type:'png'});return {label,lat,lon,camera:data.camera,frame,screenshot:{file:`${label}.png`,bytes:png.length,sha256:sha256(png)}};
    };
    for(let i=0;i<staticEvidence.donors.length;i++){const donor=staticEvidence.donors[i];record.probes.push(await capture(`donor-${String(i+1).padStart(2,'0')}-${donor.family}`,donor.parameters[0],donor.parameters[1]));}
    for(let i=0;i<staticEvidence.clearWindows.length;i++){const w=staticEvidence.clearWindows[i];record.clearProbes.push(await capture(`clear-${i+1}`,w[0],w[1]));}
    record.interaction=await capture('interaction-ceiling',...staticEvidence.donors[0].parameters.slice(0,2),{interaction:true});
    const mask=await page.evaluate(windows=>window.__AUDRALIA_NATIVE_QUALIFICATION__.maskAssay(windows),staticEvidence.clearWindows);
    record.clearMask={factors:mask.factors,centers:mask.centers,claim:mask.claim,submitted:saveText(dir,'mask-original-submitted.glsl',mask.source),fragment:saveText(dir,'mask-assay.frag.glsl',mask.fragment),vertex:saveText(dir,'mask-assay.vert.glsl',mask.vertex),pixels:pixelRecord(mask.pixels,4,1,path.join(dir,'mask-assay.rgba'))};
    for(let i=0;i<3;i++)assert.ok(Math.abs(mask.factors[i]-.12)<=1/255,`CLEAR_FACTOR_CENTER_FAILURE:${i}`);assert.ok(Math.abs(mask.factors[3]-1)<=1/255,'CLEAR_FACTOR_OUTSIDE_FAILURE');
    const audit=await page.evaluate(()=>window.__AUDRALIA_NATIVE_QUALIFICATION__.get());assert.deepEqual(audit.failures,[],'FINAL_NATIVE_AUDIT_FAILURE');assert.equal(audit.programs.length,1,'CLOUD_PROGRAM_COUNT');
    record.programs=audit.programs.map((p,i)=>{assert.ok(p.compiled&&p.linked&&p.draws>0,'ACTUAL_GPU_COMPILE_LINK_DRAW_MISSING');assert.equal(p.ablationApplied,ablate,'ABLATION_STATE');assert.equal(p.submitted,ablate?p.original.replace(p.call,'vec3(0.0)'):p.original,'UNRELATED_SHADER_SUBSTITUTION');return {...p,original:saveText(dir,`cloud-${i}-enabled-source.glsl`,p.original),submitted:saveText(dir,`cloud-${i}-submitted-source.glsl`,p.submitted)};});
    record.resourcesAfter=await page.evaluate(()=>window.__AUDRALIA_NATIVE_QUALIFICATION__.resources());assert.equal(record.resourcesAfter.contexts.length,record.live.resources.contexts.length,'INSTRUMENTATION_ADDED_CONTEXT');assert.equal(record.resourcesAfter.canvases.length,record.live.resources.canvases.length,'INSTRUMENTATION_ADDED_CANVAS');assert.ok(record.resourcesAfter.contexts.every(c=>!c.lost),'FINAL_CONTEXT_LOST');
    await Promise.all(pendingSources);assert.deepEqual(record.errors,[],'BROWSER_OR_SOURCE_ERRORS');record.complete=true;return record;
  }catch(error){record.failure=String(error?.stack||error);try{const audit=await page.evaluate(()=>window.__AUDRALIA_NATIVE_QUALIFICATION__?.get());if(audit){record.partialAudit={...audit,programs:audit.programs.map((p,i)=>({...p,original:saveText(dir,`partial-${i}-original.glsl`,p.original),submitted:saveText(dir,`partial-${i}-submitted.glsl`,p.submitted)}))};}}catch(e){record.readbackFailure=String(e);}throw error;
  }finally{await Promise.allSettled(pendingSources);fs.writeFileSync(path.join(dir,'variant.json'),JSON.stringify(record,null,2)+'\n');await page.close();}
}

export function compareCausality(enabled,ablated){
  assert.equal(enabled.probes.length,11,'ENABLED_PROBE_COUNT');assert.equal(ablated.probes.length,11,'ABLATED_PROBE_COUNT');assert.deepEqual(enabled.live.integration,ablated.live.integration,'PAIR_WORLD_AUTHORITY_DRIFT');assert.deepEqual(enabled.live.world,ablated.live.world,'PAIR_WORLD_IDENTITY');assert.deepEqual(enabled.live.resources,ablated.live.resources,'PAIR_RESOURCE_DRIFT');assert.deepEqual(enabled.live.budget,ablated.live.budget,'PAIR_BUDGET_DRIFT');
  assert.equal(enabled.programs[0].original.sha256,ablated.programs[0].original.sha256,'PAIR_PREABLATION_SOURCE_DRIFT');assert.notEqual(enabled.programs[0].submitted.sha256,ablated.programs[0].submitted.sha256,'ABLATION_SUBMITTED_HASH_IDENTICAL');
  const probes=enabled.probes.map((on,i)=>{const off=ablated.probes[i];assert.equal(on.label,off.label,'PAIR_PROBE_ID');assert.deepEqual(on.camera,off.camera,'PAIR_CAMERA_DRIFT');assert.equal(on.frame.width,off.frame.width,'PAIR_WIDTH');assert.equal(on.frame.height,off.frame.height,'PAIR_HEIGHT');assert.deepEqual(on.frame.uniformCalls.map(({method,values})=>({method,values})),off.frame.uniformCalls.map(({method,values})=>({method,values})),'PAIR_NATIVE_UNIFORM_INPUT_DRIFT');assert.equal(on.frame.before.sha256,off.frame.before.sha256,'PAIR_NATIVE_BACKGROUND_DRIFT');const a=on.frame.isolated,b=off.frame.isolated;return {label:on.label,meanAlphaDelta:a.meanAlpha-b.meanAlpha,nonzeroFractionDelta:a.nonzeroFraction-b.nonzeroFraction,strongFractionDelta:a.strongFraction-b.strongFraction,pixelHashDifferent:a.sha256!==b.sha256,ordinaryDisplayDifferent:on.frame.after.sha256!==off.frame.after.sha256&&on.frame.nativeChangedPixels>0,enabled:a,ablated:b};});
  const positive=probes.filter(p=>p.meanAlphaDelta>0&&p.pixelHashDifferent),material=probes.filter(p=>p.meanAlphaDelta>=.0015&&(p.nonzeroFractionDelta>=.002||p.strongFractionDelta>=.002)),display=probes.filter(p=>p.ordinaryDisplayDifferent);
  return {profile:enabled.profile,probes,positiveProbeCount:positive.length,materialProbeCount:material.length,ordinaryDisplayProbeCount:display.length,pass:positive.length>=2&&material.length>=1&&display.length>=1,claim:'MECHANICAL_V7_CAUSAL_PARTICIPATION_WITH_RETAINED_CONSERVATIVE_FLOORS_NOT_AESTHETIC_ACCEPTANCE'};
}

function emitEvidenceBundle(directory){
  const files=[];const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()){const bytes=fs.readFileSync(full);files.push({path:path.relative(directory,full),bytes:bytes.length,sha256:sha256(bytes),base64:bytes.toString('base64')});}}};walk(directory);
  const payload=Buffer.from(JSON.stringify({schema:'AUDRALIA_CAUSAL_EVIDENCE_FILES_v1',files}));const compressed=zlib.gzipSync(payload,{level:9}),encoded=compressed.toString('base64'),chunkSize=48000,count=Math.ceil(encoded.length/chunkSize);
  console.log(JSON.stringify({schema:'AUDRALIA_CAUSAL_EVIDENCE_BUNDLE_v1',event:'BEGIN',encoding:'gzip+base64',compressedBytes:compressed.length,compressedSha256:sha256(compressed),payloadSha256:sha256(payload),chunkCount:count,files:files.map(({base64,...m})=>m)}));
  for(let i=0;i<count;i++)console.log(JSON.stringify({schema:'AUDRALIA_CAUSAL_EVIDENCE_BUNDLE_v1',event:'CHUNK',index:i,count,data:encoded.slice(i*chunkSize,(i+1)*chunkSize)}));
  console.log(JSON.stringify({schema:'AUDRALIA_CAUSAL_EVIDENCE_BUNDLE_v1',event:'END',chunkCount:count,compressedSha256:sha256(compressed)}));
}

async function main(){
  if(process.argv.includes('--static-only')){console.log(JSON.stringify({schema:SCHEMA,result:'STATIC_SOURCE_PASS_RUNTIME_NOT_EXECUTED',staticEvidence:staticCandidate()},null,2));return;}
  const parent=path.resolve(process.env.AUDRALIA_EVIDENCE_DIR||path.join(ROOT,'audralia-weather-evidence'));fs.mkdirSync(parent,{recursive:true});const directory=fs.mkdtempSync(path.join(parent,'run-'));
  const receipt={schema:SCHEMA,result:'FAIL_CLOSED',mechanicalOnly:true,physicalDeviceStabilityProven:false,ownerVisualAcceptanceProven:false,productionDeploymentPerformed:false,variants:[],causality:[]};let browser=null;
  try{
    receipt.executionCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(process.env.EXECUTION_COMMIT)assert.equal(receipt.executionCommit,process.env.EXECUTION_COMMIT,'EXACT_EXECUTION_COMMIT_MISMATCH');
    receipt.staticEvidence=staticCandidate();fs.writeFileSync(path.join(directory,'frozen-measurement-input.json'),JSON.stringify(receipt.staticEvidence,null,2)+'\n');
    const chrome=process.env.CHROME_PATH;assert.ok(chrome,'CHROME_PATH_MISSING');const {default:puppeteer}=await import('puppeteer-core');browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});receipt.browserVersion=await browser.version();
    for(const profile of Object.keys(PROFILES)){const enabled=await runVariant(browser,{profile,ablate:false,staticEvidence:receipt.staticEvidence,directory});receipt.variants.push(enabled);const ablated=await runVariant(browser,{profile,ablate:true,staticEvidence:receipt.staticEvidence,directory});receipt.variants.push(ablated);const causality=compareCausality(enabled,ablated);receipt.causality.push(causality);console.log(JSON.stringify({schema:SCHEMA,event:'PROFILE_RESULT',profile,positiveProbeCount:causality.positiveProbeCount,materialProbeCount:causality.materialProbeCount,ordinaryDisplayProbeCount:causality.ordinaryDisplayProbeCount,pass:causality.pass}));assert.ok(causality.pass,`${profile}_FRAMEBUFFER_CAUSALITY_FAILURE`);}
    receipt.result='PASS';
  }catch(error){receipt.failure=String(error?.stack||error);process.exitCode=1;
  }finally{
    if(browser)try{await browser.close();}catch(error){receipt.closeFailure=String(error);receipt.result='FAIL_CLOSED';process.exitCode=1;}
    fs.writeFileSync(path.join(directory,'qualification.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
    try{emitEvidenceBundle(directory);}catch(error){console.error(JSON.stringify({schema:SCHEMA,result:'FAIL_CLOSED',failure:'EVIDENCE_BUNDLE_CUSTODY_FAILURE',detail:String(error)}));process.exitCode=1;}
  }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
