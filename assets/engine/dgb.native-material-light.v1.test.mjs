import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeMaterialLibrary} from './dgb.native-material-light.v1.mjs';

const ID=[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
const makeDevice=(backend='WEBGL1')=>{
  const calls=[];let lost=false,disposed=false,active=33984;const bindings=new Map();
  const gl={TEXTURE0:33984,TEXTURE_2D:3553,ACTIVE_TEXTURE:34016,TEXTURE_BINDING_2D:32873,isContextLost:()=>lost,
    getParameter(key){if(key===this.ACTIVE_TEXTURE)return active;if(key===this.TEXTURE_BINDING_2D)return bindings.get(active)??null;return null;},
    getUniformLocation:(program,name)=>({program,name}),
    uniformMatrix4fv:(...args)=>calls.push(['m4',...args]),
    uniformMatrix3fv:(...args)=>calls.push(['m3',...args]),
    uniform4fv:(...args)=>calls.push(['v4',...args]),
    uniform3fv:(...args)=>calls.push(['v3',...args]),
    uniform1f:(...args)=>calls.push(['f',...args]),
    uniform1i:(...args)=>calls.push(['i',...args]),
    activeTexture:(...args)=>{active=args[0];calls.push(['active',...args]);},
    bindTexture:(...args)=>{bindings.set(active,args[1]);calls.push(['texture',...args]);}};
  let programs=0;
  const device={backend,gl,status:()=>({lost,disposed}),
    createProgram:({vertexSource,fragmentSource})=>{
      const p={gpu:{id:++programs},definition:{vertexSource,fragmentSource}};
      calls.push(['program',p]);return p;
    },createTexture2D:spec=>{const t={gpu:{tex:true},definition:spec};calls.push(['makeTexture',t]);return t;}
  };
  return {device,gl,calls,setLost(v){lost=v;},setDisposed(v){disposed=v;},programCount:()=>programs};
};
const bind=(lib,m,x={})=>lib.makeDrawBinding(m,{modelMatrix:ID,modelViewProjection:ID,...x});

test('reject absent/invalid E1 device and unsupported backend',()=>{
  for(const bad of [undefined,{}, {backend:'WEBGL3'}, {backend:'WEBGL1',createProgram(){}}])
    assert.throws(()=>createNativeMaterialLibrary(bad),/E1_DEVICE_REQUIRED/);
});

test('unlit material produces actual WebGL1 GLSL100 and required uniform binding',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const m=lib.createMaterial({kind:'UNLIT',baseColor:[0.2,0.4,0.6,0.5]});
  const b=bind(lib,m);assert.equal(f.programCount(),1);
  const src=b.program.definition;assert.match(src.vertexSource,/attribute vec3 aPosition/);
  assert.match(src.fragmentSource,/gl_FragColor/);
  assert.doesNotMatch(src.vertexSource,/#version 300/);
  b.beforeDraw(f.gl,b.program.gpu);
  assert.deepEqual(f.calls.filter(x=>x[0]==='v4')[0][2],[0.2,0.4,0.6,0.5]);
  assert.equal(f.calls.filter(x=>x[0]==='m4').length,1);
});

test('WebGL2 variant uses GLSL ES300 not WebGL1 attribute or gl_FragColor',()=>{
  const f=makeDevice('WEBGL2'),lib=createNativeMaterialLibrary(f.device),m=lib.createMaterial();
  const b=bind(lib,m),s=b.program.definition;
  assert.match(s.vertexSource,/^#version 300 es/);assert.match(s.fragmentSource,/out vec4 outColor/);
  assert.doesNotMatch(s.vertexSource,/attribute/);assert.doesNotMatch(s.fragmentSource,/gl_FragColor/);
});

test('programs compile once per kind; E1 owns program and textures',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const a=lib.createMaterial(),b=lib.createMaterial({baseColor:[0,0,0,1]});
  assert.equal(bind(lib,a).program,bind(lib,b).program);
  assert.equal(f.programCount(),1);
  assert.equal(lib.status().compiledPrograms,1);
  lib.dispose();assert.equal(lib.status().disposed,true);
  assert.throws(()=>bind(lib,a),/MATERIAL_LIBRARY_DISPOSED/);
});

test('texture must originate from SAME E4 library, and declared numeric encoding',()=>{
  const f=makeDevice(),g=createNativeMaterialLibrary(f.device),h=createNativeMaterialLibrary(f.device);
  const t=g.createTexture2D({width:3,height:5,pixels:new Uint8Array(60),filter:'NEAREST'});
  assert.throws(()=>h.createMaterial({kind:'TEXTURED',texture:t}),/LIBRARY_OWNED_TEXTURE_REQUIRED/);
  assert.throws(()=>g.createMaterial({kind:'TEXTURED',texture:{gpu:{}}}),/LIBRARY_OWNED_TEXTURE_REQUIRED/);
  assert.throws(()=>g.createMaterial({kind:'TEXTURED',texture:t,textureEncoding:'SRGB_RGBA8'}),/TEXTURE_ENCODING_UNSUPPORTED/);
  const mat=g.createMaterial({kind:'TEXTURED',texture:t});const binding=bind(g,mat);
  assert.match(binding.program.definition.fragmentSource,/texture2D\(uTexture,vUV\)/);
  binding.beforeDraw(f.gl,binding.program.gpu);
  assert.equal(f.calls.filter(x=>x[0]==='texture')[0][2],t.gpu);
  assert.equal(f.calls.filter(x=>x[0]==='i')[0][2],0);
});

test('directional-lit material normalizes direction and binds Lambert uniforms',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const m=lib.createMaterial({kind:'LIT',baseColor:[1,0.5,0.25,1],light:{direction:[0,0,3],color:[1,1,1],intensity:0.8,ambient:0.2}});
  assert.deepEqual(m.light.direction,[0,0,1]);const b=bind(lib,m);
  assert.match(b.program.definition.fragmentSource,/lambert/);
  b.beforeDraw(f.gl,b.program.gpu);
  assert.deepEqual(f.calls.filter(x=>x[0]==='v3')[0][2],[0,0,1]);
  assert.equal(f.calls.filter(x=>x[0]==='m3').length,1);
});

test('inverse-transpose normal matrix for nonuniform scale',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device),m=lib.createMaterial({kind:'LIT'});
  const model=[2,0,0,0, 0,3,0,0, 0,0,4,0, 0,0,0,1];
  const b=bind(lib,m,{modelMatrix:model});b.beforeDraw(f.gl,b.program.gpu);
  const normal=f.calls.find(x=>x[0]==='m3')[3];
  assert.ok(Math.abs(normal[0]-0.5)<1e-6);assert.ok(Math.abs(normal[4]-1/3)<1e-6);
  assert.ok(Math.abs(normal[8]-0.25)<1e-6);
});

test('strict invalid color, light, texture and matrix arguments fail closed',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  for(const c of [[1,1,1],[1,1,1,2],[NaN,1,1,1],'red'])assert.throws(()=>lib.createMaterial({baseColor:c}),/BASE_COLOR_INVALID/);
  assert.throws(()=>lib.createMaterial({kind:'GLOSSY'}),/MATERIAL_KIND_INVALID/);
  assert.throws(()=>lib.createMaterial({kind:'UNLIT',texture:{gpu:{}}}),/TEXTURE_NOT_ALLOWED/);
  assert.throws(()=>lib.createMaterial({kind:'UNLIT',light:{}}),/LIGHT_NOT_ALLOWED/);
  for(const light of [{direction:[0,0,0]},{intensity:2},{ambient:-1},{color:[-1,0,0]}])
    assert.throws(()=>lib.createMaterial({kind:'LIT',light}));
  const m=lib.createMaterial({kind:'LIT'});
  assert.throws(()=>bind(lib,m,{modelViewProjection:[1,2,3]}),/MVP_MATRIX_INVALID/);
  assert.throws(()=>bind(lib,m,{modelMatrix:Array(16).fill(0)}),/NORMAL_MATRIX_SINGULAR/);
  assert.throws(()=>bind(lib,m,{modelMatrix:null}),/MODEL_MATRIX_INVALID/);
});

test('rejects foreign material and wrong context/program, before any WebGL uniform write',()=>{
  const f=makeDevice(),g=createNativeMaterialLibrary(f.device),h=createNativeMaterialLibrary(f.device);
  assert.throws(()=>bind(h,g.createMaterial()),/FOREIGN_MATERIAL/);
  const b=bind(g,g.createMaterial()),n=f.calls.length;
  assert.throws(()=>b.beforeDraw({},b.program.gpu),/MATERIAL_PROGRAM_CONTEXT_MISMATCH/);
  assert.throws(()=>b.beforeDraw(f.gl,{}),/MATERIAL_PROGRAM_CONTEXT_MISMATCH/);
  assert.equal(f.calls.length,n);
});

test('lost context blocks binding and recovery uses new E1 GPU program handle',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device),m=lib.createMaterial();
  const b=bind(lib,m),old=b.program.gpu;
  f.setLost(true);assert.throws(()=>b.beforeDraw(f.gl,old),/GRAPHICS_CONTEXT_NOT_READY/);
  f.setLost(false);b.program.gpu={newNative:true};b.beforeDraw(f.gl,b.program.gpu);
  assert.ok(f.calls.some(x=>x[0]==='m4'));
  f.setDisposed(true);assert.throws(()=>bind(lib,m),/DEVICE_DISPOSED/);
});


test('E4 afterDraw restores texture unit zero and previously active texture unit',()=>{
 const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
 const original={gpu:'original-native-texture'};
 f.gl.activeTexture(f.gl.TEXTURE0);f.gl.bindTexture(f.gl.TEXTURE_2D,original);
 f.gl.activeTexture(f.gl.TEXTURE0+3);
 const tex=lib.createTexture2D({width:1,height:1,pixels:new Uint8Array([255,255,255,255])});
 const binding=bind(lib,lib.createMaterial({kind:'TEXTURED',texture:tex}));
 binding.beforeDraw(f.gl,binding.program.gpu);
 assert.equal(f.gl.getParameter(f.gl.TEXTURE_BINDING_2D),tex.gpu);
 binding.afterDraw(f.gl,binding.program.gpu);
 assert.equal(f.gl.getParameter(f.gl.ACTIVE_TEXTURE),f.gl.TEXTURE0+3);
 f.gl.activeTexture(f.gl.TEXTURE0);
 assert.equal(f.gl.getParameter(f.gl.TEXTURE_BINDING_2D),original);
});

test('missing material uniforms produce explicit failures',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device),b=bind(lib,lib.createMaterial());
  f.gl.getUniformLocation=()=>null;
  assert.throws(()=>b.beforeDraw(f.gl,b.program.gpu),/MATERIAL_UNIFORM_MISSING:uMVP/);
});

test('missing late uniforms and lost texture handles cause zero GL state mutation',()=>{
  for(const [kind,missing] of [['UNLIT','uBaseColor'],['TEXTURED','uTexture'],['LIT','uAmbient']]){
    const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
    const texture=kind==='TEXTURED'?lib.createTexture2D({width:1,height:1,pixels:new Uint8Array([255,255,255,255])}):null;
    const mat=lib.createMaterial({kind,texture});
    const b=bind(lib,mat),baseline=f.calls.length;
    f.gl.getUniformLocation=(_handle,name)=>name===missing?null:{name};
    assert.throws(()=>b.beforeDraw(f.gl,b.program.gpu),new RegExp('MATERIAL_UNIFORM_MISSING:'+missing));
    assert.equal(f.calls.length,baseline,kind+' partially mutated GPU state');
  }
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const tex=lib.createTexture2D({width:1,height:1,pixels:new Uint8Array([1,2,3,255])});
  const material=lib.createMaterial({kind:'TEXTURED',texture:tex}),binding=bind(lib,material);
  const baseline=f.calls.length;
  tex.gpu=null;
  assert.throws(()=>binding.beforeDraw(f.gl,binding.program.gpu),/MATERIAL_TEXTURE_UNAVAILABLE/);
  assert.equal(f.calls.length,baseline,'missing texture handle partially mutated GPU state');
});
