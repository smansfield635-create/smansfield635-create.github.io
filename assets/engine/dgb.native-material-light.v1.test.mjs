import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeMaterialLibrary} from './dgb.native-material-light.v1.mjs';
import {createNativeFramePipeline} from './dgb.native-frame-pipeline.v1.mjs';

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

test('E6 opt-in surface shader generates view-position-dependent highlight and hemisphere fill on both WebGL dialects',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=makeDevice(backend),lib=createNativeMaterialLibrary(f.device);
    const material=lib.createMaterial({kind:'LIT_SPECULAR',baseColor:[0.45,0.32,0.19,0.8],light:{direction:[0.4,0.2,1],ambient:0.08,intensity:0.9,shininess:48,specularStrength:0.5,fillIntensity:0.42}});
    const b=lib.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID,cameraPosition:[0,0,4]});
    const {vertexSource,fragmentSource}=b.program.definition;
    assert.match(vertexSource,/uModel/);assert.match(vertexSource,/vWorldPosition/);
    assert.match(fragmentSource,/uCameraPosition/);assert.match(fragmentSource,/uShininess/);
    assert.match(fragmentSource,/uSkyColor/);assert.match(fragmentSource,/highlight/);
    if(backend==='WEBGL2') assert.match(fragmentSource,/#version 300 es/);
    else assert.doesNotMatch(fragmentSource,/#version 300 es/);
    b.beforeDraw(f.gl,b.program.gpu);
    assert.equal(f.calls.filter(x=>x[0]==='m4').length,2);
    assert.equal(f.calls.filter(x=>x[0]==='m3').length,1);
    const bound=f.calls.filter(x=>x[0]==='v3').find(x=>x[1].name==='uCameraPosition');
    assert.deepEqual(bound[2],[0,0,4]);
    assert.equal(lib.status().compiledPrograms,1);
  }
});

test('E6 surface material requires correct camera, optional bounded highlights and linear fill colors',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const cases=[
    [{shininess:0},/SHININESS_INVALID/], [{shininess:257},/SHININESS_INVALID/],
    [{specularStrength:-0.1},/SPECULAR_STRENGTH_INVALID/],
    [{specularStrength:1.1},/SPECULAR_STRENGTH_INVALID/],
    [{fillIntensity:2},/FILL_INTENSITY_INVALID/],
    [{skyColor:[2,0,0]},/SKY_COLOR_INVALID/],
    [{groundColor:[1,1]},/GROUND_COLOR_INVALID/]
  ];
  for(const [light,re] of cases)assert.throws(()=>lib.createMaterial({kind:'LIT_SPECULAR',light}),re);
  const m=lib.createMaterial({kind:'LIT_SPECULAR'});
  assert.throws(()=>bind(lib,m),/CAMERA_POSITION_INVALID/);
  assert.throws(()=>bind(lib,m,{cameraPosition:[0,NaN,4]}),/CAMERA_POSITION_INVALID/);
  assert.throws(()=>bind(lib,m,{cameraPosition:[0,0,4],modelMatrix:[1]}),/MODEL_MATRIX_INVALID/);
  const b=bind(lib,m,{cameraPosition:[0,0,4]});
  assert.ok(lib.status().materialKinds.includes('LIT_SPECULAR'));
  assert.equal(m.light.shininess,48);
  assert.ok(Object.isFrozen(m.light.skyColor));
  const count=f.calls.length;
  f.gl.getUniformLocation=(_p,name)=>name==='uCameraPosition'?null:{name};
  assert.throws(()=>b.beforeDraw(f.gl,b.program.gpu),/MATERIAL_UNIFORM_MISSING:uCameraPosition/);
  assert.equal(f.calls.length,count,'no GL mutation before all uniforms validated');
});

test('E6 opt-in shader does not mutate default LIT GLSL or E4 legacy material bindings',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const legacy=lib.createMaterial({kind:'LIT',light:{ambient:.2,intensity:.7}});
  const b=bind(lib,legacy);b.beforeDraw(f.gl,b.program.gpu);
  const fragment=b.program.definition.fragmentSource;
  assert.match(fragment,/float lambert=max\(dot\(normalize\(vNormal\),uLightDirection\),0\.0\)/);
  assert.doesNotMatch(fragment,/uCameraPosition|uSkyColor|uShininess/);
  assert.equal(f.calls.filter(x=>x[0]==='m4').length,1);
  assert.equal(f.calls.filter(x=>x[0]==='m3').length,1);
});

test('E7 PBR metallic-roughness creates world-space GGX shaders and uniforms on both WebGL tiers',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=makeDevice(backend),lib=createNativeMaterialLibrary(f.device);
    const material=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS',baseColor:[0.6,0.4,0.2,0.7],
      metallic:0.8,roughness:0.24,light:{direction:[0,0,2],ambient:0.12,intensity:0.85}});
    assert.equal(material.metallic,0.8);assert.equal(material.roughness,0.24);
    assert.ok(Object.isFrozen(material));
    const b=bind(lib,material,{cameraPosition:[0,0,5]});
    const {vertexSource,fragmentSource}=b.program.definition;
    assert.match(vertexSource,/vWorldPosition/);
    assert.match(fragmentSource,/uMetallic/);
    assert.match(fragmentSource,/uRoughness/);
    assert.match(fragmentSource,/vec3 specularTerm/);
    assert.match(fragmentSource,/float D=/);
    assert.match(fragmentSource,/vec3 kd=/);
    assert.doesNotMatch(fragmentSource,/uSkyColor|uShininess/);
    if(backend==='WEBGL2'){
      assert.match(vertexSource,/^#version 300 es/);
      assert.match(fragmentSource,/out vec4 outColor/);
      assert.doesNotMatch(fragmentSource,/gl_FragColor/);
    }else{
      assert.match(vertexSource,/attribute vec3 aPosition/);
      assert.match(fragmentSource,/gl_FragColor/);
      assert.doesNotMatch(fragmentSource,/#version 300 es/);
    }
    b.beforeDraw(f.gl,b.program.gpu);
    const scalar=new Map(f.calls.filter(x=>x[0]==='f').map(x=>[x[1].name,x[2]]));
    assert.equal(scalar.get('uMetallic'),0.8);
    assert.equal(scalar.get('uRoughness'),0.24);
    assert.deepEqual(f.calls.filter(x=>x[0]==='v3').find(x=>x[1].name==='uCameraPosition')[2],[0,0,5]);
    assert.equal(f.calls.filter(x=>x[0]==='m4').length,2);
    assert.equal(f.calls.filter(x=>x[0]==='m3').length,1);
    assert.equal(lib.status().compiledPrograms,1);
  }
});

test('E7 PBR bounded inputs reject before GPU allocation; legacy modes reject stray PBR parameters',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  for(const value of [-0.01,1.01,NaN,Infinity,'1'])
    assert.throws(()=>lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS',metallic:value}),/METALLIC_INVALID/);
  for(const value of [0,0.044,1.01,NaN,Infinity,'0.5'])
    assert.throws(()=>lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS',roughness:value}),/ROUGHNESS_INVALID/);
  assert.throws(()=>lib.createMaterial({kind:'LIT',metallic:0}),/PBR_PARAMETERS_NOT_ALLOWED/);
  assert.throws(()=>lib.createMaterial({kind:'UNLIT',roughness:0.5}),/PBR_PARAMETERS_NOT_ALLOWED/);
  assert.equal(f.programCount(),0);
  const m=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS'});
  assert.equal(m.metallic,0);assert.equal(m.roughness,0.5);
  assert.throws(()=>bind(lib,m),/CAMERA_POSITION_INVALID/);
  assert.throws(()=>bind(lib,m,{cameraPosition:[NaN,0,2]}),/CAMERA_POSITION_INVALID/);
  assert.throws(()=>bind(lib,m,{cameraPosition:[0,0,2],modelMatrix:Array(16).fill(0)}),/NORMAL_MATRIX_SINGULAR/);
  assert.equal(f.programCount(),0);
});

test('E7 PBR pre-resolves late uniforms without GL mutation and preserves program cache per material kind',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const a=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS',metallic:0.2,roughness:0.8});
  const b=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS',metallic:1,roughness:0.15});
  const ba=bind(lib,a,{cameraPosition:[0,0,4]}),bb=bind(lib,b,{cameraPosition:[0,0,4]});
  assert.equal(ba.program,bb.program);
  assert.equal(f.programCount(),1);
  const count=f.calls.length;
  f.gl.getUniformLocation=(_p,name)=>name==='uRoughness'?null:{name};
  assert.throws(()=>ba.beforeDraw(f.gl,ba.program.gpu),/MATERIAL_UNIFORM_MISSING:uRoughness/);
  assert.equal(f.calls.length,count,'late uniform failure must make no GL calls');
  f.gl.getUniformLocation=(_p,name)=>({name});
  bb.beforeDraw(f.gl,bb.program.gpu);
  assert.equal(f.calls.filter(x=>x[0]==='f').find(x=>x[1].name==='uRoughness')[2],0.15);
  f.setLost(true);
  assert.throws(()=>bb.beforeDraw(f.gl,bb.program.gpu),/GRAPHICS_CONTEXT_NOT_READY/);
  f.setLost(false);
  bb.program.gpu={restored:true};
  bb.beforeDraw(f.gl,bb.program.gpu);
});

test('E7 opt-in PBR never adds PBR uniforms to existing four material shader kinds',()=>{
  const f=makeDevice(),lib=createNativeMaterialLibrary(f.device);
  const texture=lib.createTexture2D({width:1,height:1,pixels:new Uint8Array([255,255,255,255])});
  for(const [kind,extra] of [
    ['UNLIT',{}],['TEXTURED',{texture}],['LIT',{}],['LIT_SPECULAR',{}]
  ]){
    const m=lib.createMaterial({kind,...extra});
    const options=kind==='LIT_SPECULAR'?{cameraPosition:[0,0,4]}:{};
    const s=bind(lib,m,options).program.definition;
    assert.doesNotMatch(s.vertexSource,/uMetallic|uRoughness/);
    assert.doesNotMatch(s.fragmentSource,/uMetallic|uRoughness|specularTerm/);
  }
  assert.deepEqual(lib.status().materialKinds,['UNLIT','TEXTURED','LIT','LIT_SPECULAR','PBR_METALLIC_ROUGHNESS']);
});

function e9Fixture(backend='WEBGL1'){
  const f=makeDevice(backend),gl=f.gl;
  Object.assign(gl,{
    CCW:1,CULL_FACE:2,BACK:3,FRONT:4,DEPTH_TEST:5,BLEND:6,LEQUAL:7,
    FUNC_ADD:8,SRC_ALPHA:9,ONE_MINUS_SRC_ALPHA:10,ONE:11,
    COLOR_BUFFER_BIT:16,DEPTH_BUFFER_BIT:32,
    getContextAttributes(){return {depth:true};}
  });
  for(const name of ['frontFace','disable','enable','cullFace','depthMask','depthFunc',
    'blendEquation','blendFuncSeparate','colorMask','clearColor','clearDepth','clear']){
    gl[name]=(...args)=>f.calls.push([name,...args]);
  }
  f.device.bindRenderTarget=t=>{
    if(t!==null && t.owned!==true)throw new Error('RENDER_TARGET_NOT_OWNED_BY_DEVICE');
    f.calls.push(['target',t?.name??'canvas']);
  };
  f.device.createMesh=spec=>({gpu:{},definition:spec});
  f.device.draw=cmd=>{
    try{cmd.beforeDraw?.(gl,cmd.program.gpu);}
    finally{cmd.afterDraw?.(gl,cmd.program.gpu);}
  };
  const depthGpu={ownedDepth:true};
  const target={name:'e9-depth',owned:true,gpu:{},colorTexture:{gpu:{}},
    depthGpu,depthTexture:{gpu:depthGpu},definition:{depth:true,depthTexture:true},
    width:16,height:16};
  const mesh={gpu:{},definition:{vertexCount:3}};
  const pipe=createNativeFramePipeline(f.device);
  const cast=(modelMatrix=ID)=>pipe.renderShadowDepth({target,lightViewProjection:ID,
    casters:[{mesh,modelMatrix}],cull:'NONE'});
  return {...f,target,pipe,cast};
}

test('E9 PBR receiver uses authentic E2 depth receipt and dialect-specific depth comparison',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=e9Fixture(backend),pass=f.cast();
    const lib=createNativeMaterialLibrary(f.device);
    const material=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS',metallic:0.2,roughness:0.65,
      light:{direction:[0,0,1],ambient:0.08,intensity:0.9}});
    const legacy=bind(lib,material,{cameraPosition:[0,0,4]});
    const receiver=bind(lib,material,{cameraPosition:[0,0,4],shadow:{pass,bias:0.002}});
    assert.notEqual(receiver.program,legacy.program);
    assert.doesNotMatch(legacy.program.definition.fragmentSource,/uShadowMap/);
    assert.match(receiver.program.definition.fragmentSource,/uShadowMap/);
    assert.match(receiver.program.definition.fragmentSource,/shadowVisibility/);
    assert.match(receiver.program.definition.fragmentSource,backend==='WEBGL2'
      ?/texture\(uShadowMap,s.xy\)/:/texture2D\(uShadowMap,s.xy\)/);
    assert.match(receiver.program.definition.vertexSource,/uShadowViewProjection\*uModel/);
    const original={previousUnitOne:true};
    f.gl.activeTexture(f.gl.TEXTURE0+1);
    f.gl.bindTexture(f.gl.TEXTURE_2D,original);
    f.gl.activeTexture(f.gl.TEXTURE0+3);
    receiver.beforeDraw(f.gl,receiver.program.gpu);
    assert.equal(f.gl.getParameter(f.gl.ACTIVE_TEXTURE),f.gl.TEXTURE0+3);
    f.gl.activeTexture(f.gl.TEXTURE0+1);
    assert.equal(f.gl.getParameter(f.gl.TEXTURE_BINDING_2D),f.target.depthGpu);
    f.gl.activeTexture(f.gl.TEXTURE0+3);
    receiver.afterDraw(f.gl,receiver.program.gpu);
    assert.equal(f.gl.getParameter(f.gl.ACTIVE_TEXTURE),f.gl.TEXTURE0+3);
    f.gl.activeTexture(f.gl.TEXTURE0+1);
    assert.equal(f.gl.getParameter(f.gl.TEXTURE_BINDING_2D),original);
    assert.ok(f.calls.some(x=>x[0]==='i' && x[2]===1));
    assert.equal(lib.status().compiledPrograms,2);
  }
});

test('E9 rejects forged, foreign and stale shadow frames before material GL writes',()=>{
  const f=e9Fixture(),lib=createNativeMaterialLibrary(f.device);
  const material=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS'});
  assert.throws(()=>bind(lib,material,{cameraPosition:[0,0,3],
    shadow:{pass:{}}}),/SHADOW_PASS_FOREIGN_OR_UNVERIFIED/);
  assert.throws(()=>bind(lib,material,{cameraPosition:[0,0,3],
    shadow:{pass:f.cast(),bias:-0.001}}),/SHADOW_BIAS_INVALID/);
  assert.throws(()=>bind(lib,lib.createMaterial(),{shadow:{pass:f.cast()}}),/SHADOW_PBR_ONLY/);
  const pass=f.cast();
  const receiver=bind(lib,material,{cameraPosition:[0,0,3],shadow:{pass}});
  const original=f.calls.length;
  f.target.depthTexture.gpu={resized:true};
  assert.throws(()=>receiver.beforeDraw(f.gl,receiver.program.gpu),/SHADOW_PASS_STALE_TARGET/);
  assert.equal(f.calls.length,original);
});

test('E9 missing shadow uniform fails atomically and caster movement produces new frame receipts',()=>{
  const f=e9Fixture(),lib=createNativeMaterialLibrary(f.device);
  const material=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS'});
  const first=f.cast(),shifted=[...ID];shifted[12]=0.3;
  const second=f.cast(shifted);
  assert.notEqual(first,second);
  const receiver=bind(lib,material,{cameraPosition:[0,0,4],shadow:{pass:second}});
  const before=f.calls.length;
  const old=f.gl.getUniformLocation;
  f.gl.getUniformLocation=(_p,name)=>name==='uShadowBias'?null:{name};
  assert.throws(()=>receiver.beforeDraw(f.gl,receiver.program.gpu),/MATERIAL_UNIFORM_MISSING:uShadowBias/);
  assert.equal(f.calls.length,before,'shadow uniform failure partially mutated state');
  f.gl.getUniformLocation=old;
  receiver.beforeDraw(f.gl,receiver.program.gpu);
  receiver.afterDraw(f.gl,receiver.program.gpu);
  assert.ok(f.calls.some(x=>x[0]==='m4' && x[1]?.name==='uShadowViewProjection'));
});

test('E9 restores shadow texture after a sampler uniform exception',()=>{
  const f=e9Fixture(),lib=createNativeMaterialLibrary(f.device);
  const material=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS'});
  const receiver=bind(lib,material,{cameraPosition:[0,0,4],shadow:{pass:f.cast()}});
  const original={saved:true};
  f.gl.activeTexture(f.gl.TEXTURE0+1);
  f.gl.bindTexture(f.gl.TEXTURE_2D,original);
  f.gl.activeTexture(f.gl.TEXTURE0+2);
  const originalUniform1i=f.gl.uniform1i;
  f.gl.uniform1i=()=>{throw new Error('SAMPLER_UPLOAD_FAILED');};
  assert.throws(()=>receiver.beforeDraw(f.gl,receiver.program.gpu),/SAMPLER_UPLOAD_FAILED/);
  receiver.afterDraw(f.gl,receiver.program.gpu);
  f.gl.uniform1i=originalUniform1i;
  assert.equal(f.gl.getParameter(f.gl.ACTIVE_TEXTURE),f.gl.TEXTURE0+2);
  f.gl.activeTexture(f.gl.TEXTURE0+1);
  assert.equal(f.gl.getParameter(f.gl.TEXTURE_BINDING_2D),original);
});


test('E9 E4 receiver rejects superseded same-target caster receipts before GL state writes',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=e9Fixture(backend),lib=createNativeMaterialLibrary(f.device);
    const material=lib.createMaterial({kind:'PBR_METALLIC_ROUGHNESS'});
    const first=f.cast();
    const binding=bind(lib,material,{cameraPosition:[0,0,4],shadow:{pass:first}});
    const second=f.cast();
    const before=f.calls.length;
    assert.throws(()=>bind(lib,material,{cameraPosition:[0,0,4],shadow:{pass:first}}),
      /SHADOW_PASS_STALE_TARGET/);
    assert.throws(()=>binding.beforeDraw(f.gl,binding.program.gpu),
      /SHADOW_PASS_STALE_TARGET/);
    assert.equal(f.calls.length,before);
    const replacement=bind(lib,material,{cameraPosition:[0,0,4],shadow:{pass:second}});
    replacement.beforeDraw(f.gl,replacement.program.gpu);
    replacement.afterDraw(f.gl,replacement.program.gpu);
  }
});
