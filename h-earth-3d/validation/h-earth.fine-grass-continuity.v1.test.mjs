import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

// Actual selector module; external ecology/terrain providers are explicit synthetic stubs.
// CPU behavior and source wiring assertions below are not GPU or Android qualification.
const source=await readFile(new URL('../../showroom/globe/h-earth/render/woodland-fine-grass.v1.js',import.meta.url),'utf8');
const dependencies=`const inverseHEarthGroundCoverPoint=(x,y,z)=>({x,z});
const materialAt=()=>({valid:true,surfaceClass:'COASTAL_SOIL',soilDepth:1,shorelineDistance:40});
const far={minX:10000,maxX:10001,minZ:10000,maxZ:10001};
const estate={manorCore:far,gardens:far,outbuildingProposal:far,acceptedEnvelope:far,footRoute:[],footRouteRadius:1};
const oasis=far;const sampleHEarthGen311PlacementStructureDisposition=()=>({hardExclusions:[],planningHolds:[]});`;
const m=await import('data:text/javascript;base64,'+Buffer.from(dependencies+source.replace(/^import[^\n]+\n/gm,'')).toString('base64'));
const {selectWoodlandFineGrass:select,fineGrassImportance:score,fineGrassVisibility:visibility,fineGrassPriority:priority,prepareWoodlandSelectionCache:prepare,sameWoodlandFineGrassPackedRoots:same,FINE_GRASS_CONTINUITY:C}=m;
const root=(id,x,z,angle=id*.037)=>Object.freeze({x:Math.fround(x),y:Math.fround(id*.001),z:Math.fround(z),angle:Math.fround(angle),seed:id});
function presentation(roots,{nearby=false}={}){
 const tiles=new Map();for(const r of roots){const tx=Math.floor(r.x/4)*4,tz=Math.floor(r.z/4)*4,key=`${tx}:${tz}`;if(!tiles.has(key))tiles.set(key,{id:(nearby?'NEARBY:':'WOODLAND:')+key,minX:tx,minZ:tz,roots:[]});tiles.get(key).roots.push(r);}return {tiles:[...tiles.values()]};
}
const ids=s=>s.chunks.flatMap(c=>c.roots.map(r=>r.seed));
const snapshot=s=>({pixels:Array.from(s.pixels),ids:ids(s),cutoff:s.cutoff,groups:s.groups});
function checkPacking(s,original,capacity){
 assert.ok(s.parentCount<=capacity);assert.equal(s.pixels.length,s.parentCount*256);
 assert.equal(new Set(ids(s)).size,s.contactCount);assert.equal(ids(s).length,s.contactCount);
 let populated=0;for(let i=0;i<s.pixels.length;i+=4){if(s.pixels[i+1]===-100000)continue;populated++;const r=original.find(r=>r.x===s.pixels[i]&&r.y===s.pixels[i+1]&&r.z===s.pixels[i+2]&&r.angle===s.pixels[i+3]);assert.ok(r,'packed root coordinates/angle must remain exact');}assert.equal(populated,s.contactCount);
 for(const c of s.chunks){assert.ok(c.parent<s.parentCount);assert.ok(c.roots.length<=64);}
}
test('tiny x/z camera-cell crossings preserve visible coverage continuously',()=>{
 const roots=Array.from({length:600},(_,i)=>root(i,((i%30)-15)*.4,((i/30|0)-10)*.4));const p=presentation(roots);
 for(const axis of ['x','z']){const a={x:4,z:4},b={...a};a[axis]-=.001;b[axis]+=.001;
 const sa=select(p,a,{maximumParents:4}),sb=select(p,b,{maximumParents:4});
 const selectedA=new Set(ids(sa)),selectedB=new Set(ids(sb));let maximumJump=0;
 for(const r of roots){const va=selectedA.has(r.seed)?visibility(r,a,sa.cutoff):0,vb=selectedB.has(r.seed)?visibility(r,b,sb.cutoff):0;maximumJump=Math.max(maximumJump,Math.abs(va-vb));}
 assert.ok(maximumJump<.02,`visible jump ${maximumJump}`);assert.ok(Math.abs(sa.cutoff-sb.cutoff)<.002);
 }
});
test('K-1/K/K+1 cutoff is independently sorted first excluded score',()=>{
 for(const n of [63,64,65,200]){const roots=Array.from({length:n},(_,i)=>root(i,(i%13)*.02,(i/13|0)*.02));const p=presentation(roots),camera={x:0,z:0},s=select(p,camera,{maximumParents:3});
 const ranked=roots.map(r=>({r,value:score(r,camera)})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);assert.equal(s.contactCount,Math.min(64,ranked.length));assert.equal(s.cutoff,ranked.length>64?Math.fround(ranked[64].value):0);
 const chosen=new Set(ids(s));for(const {r,value} of ranked){if(!chosen.has(r.seed))assert.ok(value<=s.cutoff+1e-7);}
 checkPacking(s,roots,3);}
});
test('capacity bounds 0/1/2/3/1024 and two-owner padding',()=>{
 const roots=Array.from({length:301},(_,i)=>root(i,(i%19)*.03,(i/19|0)*.03));const woodland=presentation(roots.slice(0,150)),nearby=presentation(roots.slice(150),{nearby:true}),p={tiles:[...woodland.tiles,...nearby.tiles]};
 for(const capacity of [0,1,2,3,1024]){const s=select(p,{x:0,z:0},{maximumParents:capacity});checkPacking(s,roots,capacity);assert.equal(s.contactCount,Math.min(roots.length,Math.max(0,capacity*64-128)));assert.ok(s.groups.length<=2);}
});
test('maximum capacity uses the65409th score and keeps texture bounds',()=>{
 const roots=Array.from({length:66000},(_,i)=>root(i,.2,.2,(i%62831)/10000)),camera={x:0,z:0};
 const s=select(presentation(roots),camera,{maximumParents:1024});
 const ordered=roots.map(r=>score(r,camera)).filter(x=>x>0).sort((a,b)=>b-a);
 assert.equal(s.contactCount,65408);assert.equal(s.cutoff,Math.fround(ordered[65408]));assert.ok(s.parentCount<=1024);assert.ok(s.pixels.byteLength<=1048576);assert.equal(new Set(ids(s)).size,65408);
});
test('equal-score ties may omit roots only at zero coverage',()=>{
 const roots=Array.from({length:70},(_,i)=>root(i,0,0,.75)),camera={x:0,z:0},s=select(presentation(roots),camera,{maximumParents:3});assert.equal(s.contactCount,64);assert.equal(s.cutoff,Math.fround(score(roots[0],camera)));for(const r of roots)assert.equal(visibility(r,camera,s.cutoff),0);
});
test('rank swaps fade both competing roots to zero at their tie',()=>{
 const roots=Array.from({length:63},(_,i)=>root(i,0,0,0));roots.push(root(100,-10,0,0),root(101,10,0,0));const p=presentation(roots),left={x:-.001,z:0},right={x:.001,z:0};
 const a=select(p,left,{maximumParents:3}),b=select(p,right,{maximumParents:3});assert.ok(ids(a).includes(100));assert.ok(ids(b).includes(101));assert.ok(!ids(a).includes(101));assert.ok(!ids(b).includes(100));for(const r of roots.slice(-2)){assert.ok(visibility(r,left,a.cutoff)<.001);assert.ok(visibility(r,right,b.cutoff)<.001);}
});
test('support endpoints and cache snap guard enclose all potentially visible nearby roots',()=>{
 for(const nearby of [false,true]){const outer=nearby?C.nearbyOuter:C.woodlandOuter;const r=root(1,outer,0,0);assert.equal(score(r,{x:0,z:0},{nearby}),0);assert.equal(visibility(r,{x:0,z:0},0,{nearby}),0);assert.ok(score(root(2,outer-.1,0,0),{x:0,z:0},{nearby})>0);}
 // Cache center snaps within half a 4m cell diagonal; its complete core is24m.
 assert.ok(C.nearbyOuter+Math.SQRT2*2<24);assert.match(source,/coreRadiusMeters\s*=\s*24/);
 for(const x of [-.001,.001,3.999,4.001])for(const z of [-.001,.001,3.999,4.001]){const cx=Math.floor(x/4)*4+2,cz=Math.floor(z/4)*4+2;assert.ok(Math.hypot(x-cx,z-cz)+C.nearbyOuter<24);}
});
test('A-B-A, prepared and lazy caches, and presentations remain independent',async()=>{
 const roots=Array.from({length:500},(_,i)=>root(i,(i%25)*.6,(i/25|0)*.6)),p=presentation(roots),a={x:4,z:4},b={x:35,z:12};const original=JSON.stringify(roots),first=snapshot(select(p,a,{maximumParents:4}));select(p,b,{maximumParents:4});const other=presentation([root(999,-2,-2)]);select(other,a,{maximumParents:3});assert.deepEqual(snapshot(select(p,a,{maximumParents:4})),first);
 await prepare(p);assert.deepEqual(snapshot(select(p,a,{maximumParents:4})),first);assert.equal(JSON.stringify(roots),original);
});
test('packed equality ignores moving cutoff but detects changed geometry',()=>{
 const p=presentation([root(1,0,0)]),a=select(p,{x:0,z:0}),b=select(p,{x:.001,z:0});assert.ok(same(a,b));const changed={...b,pixels:new Float32Array(b.pixels)};changed.pixels[0]+=.1;assert.ok(!same(a,changed));assert.ok(!same(null,b));
});
test('optional packed reuse updates cutoff, scopes identity, and default allocations stay independent',()=>{
 const roots=Array.from({length:100},(_,i)=>root(i,10,0,i*.001)),p=presentation(roots),a={x:0,z:0},b={x:.001,z:0};
 const first=select(p,a,{maximumParents:3}),original=snapshot(first);
 const next=select(p,b,{maximumParents:3,reusePackedSelection:first});
 assert.strictEqual(next.pixels,first.pixels);assert.strictEqual(next.chunks,first.chunks);assert.notEqual(next.cutoff,first.cutoff);assert.deepEqual(snapshot(first),original);
 assert.deepEqual(snapshot(next),snapshot(select(p,b,{maximumParents:3})));
 const independent=select(p,a,{maximumParents:3});assert.notStrictEqual(independent.pixels,first.pixels);independent.pixels[0]=12345;assert.deepEqual(snapshot(first),original);
 const other=presentation(roots),isolated=select(other,b,{maximumParents:3,reusePackedSelection:next});assert.notStrictEqual(isolated.pixels,next.pixels);
 const resized=select(p,b,{maximumParents:4,reusePackedSelection:next});assert.notStrictEqual(resized.pixels,next.pixels);assert.equal(resized.contactCount,roots.filter(r=>score(r,b)>0).length);
});
test('invalid camera fails explicitly and empty support is valid',()=>{
 for(const camera of [null,{x:NaN,z:0},{x:0,z:Infinity}])assert.throws(()=>select(presentation([]),camera),/CAMERA_INVALID/);const s=select(presentation([root(1,1000,1000)]),{x:0,z:0});assert.equal(s.contactCount,0);assert.equal(s.cutoff,0);
});
test('actual renderer wires continuous uniforms, dedicated coverage shader and conditional upload',async()=>{
 const renderer=await readFile(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const draw=renderer.slice(renderer.indexOf('const camera=packet.camera.position,key='),renderer.indexOf('state.uploadBytes+=uploadBytes'));
 assert.match(draw,/Math\.fround\(camera\.x\)/);assert.doesNotMatch(draw,/Math\.floor\(camera\.x\/4\)/);assert.match(draw,/sameWoodlandFineGrassPackedRoots\(state\.uploadedSelection,state\.selection\)/);assert.match(draw,/uniform3f\(state\.uniforms\.uWoodlandCameraPosition/);assert.match(draw,/uniform1f\(state\.uniforms\.uWoodlandSelectionCutoff,selection\.cutoff\)/);
 assert.match(renderer,/createShader\(gl\.FRAGMENT_SHADER,WOODLAND_FINE_GRASS_FS\)/);assert.match(renderer,/if\(vWoodlandCoverage<=\(float\(rank\)\+\.5\)\/64\.0\)discard/);assert.match(renderer,/flat out float vWoodlandCoverage/);assert.match(renderer,/flat in float vWoodlandCoverage/);assert.doesNotMatch(renderer,/h\s*\*=\s*vWoodlandCoverage/);
 // Complete 8x8 ordered threshold set, independently checking the implemented bit recipe.
 const ranks=new Set();for(let x=0;x<8;x++)for(let y=0;y<8;y++){let rank=0;for(let bit=0;bit<3;bit++)rank|=((((x>>bit)&1)^((y>>bit)&1))*2+((y>>bit)&1))<<(4-2*bit);ranks.add(rank);}assert.equal(ranks.size,64);assert.equal(Math.min(...ranks),0);assert.equal(Math.max(...ranks),63);
});

// Portable optional software GLES execution; uses actual shader declarations, not a reimplementation.
const SOFTWARE_GLES_PROBE=String.raw`import ctypes as C, os, pathlib, json
os.environ['EGL_PLATFORM']='surfaceless'
e=C.CDLL('libEGL.so.1'); I=C.c_int; U=C.c_uint; P=C.c_void_p
e.eglGetDisplay.argtypes=[P]; e.eglGetDisplay.restype=P
e.eglInitialize.argtypes=[P,C.POINTER(I),C.POINTER(I)]; e.eglInitialize.restype=I
d=e.eglGetDisplay(None); ma=I(); mi=I()
assert e.eglInitialize(d,C.byref(ma),C.byref(mi)), 'EGL_UNAVAILABLE_INIT'
e.eglBindAPI.argtypes=[U]; assert e.eglBindAPI(0x30A0), 'EGL_UNAVAILABLE_BIND'
e.eglChooseConfig.argtypes=[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)];e.eglChooseConfig.restype=I
attrs=(I*9)(0x3040,0x40,0x3033,1,0x3024,8,0x3025,8,0x3038);cfg=P();n=I()
assert e.eglChooseConfig(d,attrs,C.byref(cfg),1,C.byref(n)) and n.value, 'EGL_UNAVAILABLE_CONFIG'
e.eglCreateContext.argtypes=[P,P,P,C.POINTER(I)];e.eglCreateContext.restype=P
c=e.eglCreateContext(d,cfg,None,(I*3)(0x3098,3,0x3038)); assert c, 'EGL_UNAVAILABLE_CONTEXT'
e.eglCreatePbufferSurface.argtypes=[P,P,C.POINTER(I)];e.eglCreatePbufferSurface.restype=P
surf=e.eglCreatePbufferSurface(d,cfg,(I*5)(0x3057,8,0x3056,8,0x3038))
e.eglMakeCurrent.argtypes=[P,P,P,P]; assert e.eglMakeCurrent(d,surf,surf,c), 'EGL_UNAVAILABLE_CURRENT'
e.eglGetProcAddress.argtypes=[C.c_char_p];e.eglGetProcAddress.restype=P
F=lambda name,rest,args:C.CFUNCTYPE(rest,*args)(e.eglGetProcAddress(name.encode()))
create=F('glCreateShader',U,[U]);source=F('glShaderSource',None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)])
compile_=F('glCompileShader',None,[U]);get=F('glGetShaderiv',None,[U,U,C.POINTER(I)]);log=F('glGetShaderInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
root=pathlib.Path(__file__).parent;sh=[];results={}
for name,kind in [('vertex',0x8B31),('fragment',0x8B30)]:
 b=root.joinpath(name+'.glsl').read_bytes();s=create(kind);txt=C.c_char_p(b);source(s,1,C.byref(txt),None);compile_(s);ok=I();get(s,0x8B81,C.byref(ok));buf=C.create_string_buffer(16000);log(s,len(buf),None,buf)
 results[name]={'pass':bool(ok.value),'log':buf.value.decode()};assert ok.value,results;sh.append(s)
program=F('glCreateProgram',U,[])();attach=F('glAttachShader',None,[U,U]);link=F('glLinkProgram',None,[U]);gp=F('glGetProgramiv',None,[U,U,C.POINTER(I)]);lp=F('glGetProgramInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
for s in sh:attach(program,s)
names=(C.c_char_p*1)(b'vWoodlandCoverage'); F('glTransformFeedbackVaryings',None,[U,I,C.POINTER(C.c_char_p),U])(program,1,names,0x8C8C)
link(program);ok=I();gp(program,0x8B82,C.byref(ok));buf=C.create_string_buffer(16000);lp(program,len(buf),None,buf)
results['link']={'pass':bool(ok.value),'log':buf.value.decode()};assert ok.value,results
getstr=F('glGetString',C.c_char_p,[U]);results['driver']=getstr(0x1F02).decode();results['renderer']=getstr(0x1F01).decode()
F('glUseProgram',None,[U])(program)
loc=F('glGetUniformLocation',I,[U,C.c_char_p]);ui=F('glUniform1i',None,[I,I]);uf=F('glUniform1f',None,[I,C.c_float]);u3=F('glUniform3f',None,[I,C.c_float,C.c_float,C.c_float])
for name,val in [('uWoodlandRoots',0),('uWoodlandLeaves',4),('uWoodlandFirstParent',0),('uPilotFallback',0)]:ui(loc(program,name.encode()),val)
tex=U();F('glGenTextures',None,[I,C.POINTER(U)])(1,C.byref(tex));F('glActiveTexture',None,[U])(0x84C0);F('glBindTexture',None,[U,U])(0x0DE1,tex)
F('glTexStorage2D',None,[U,I,U,I,I])(0x0DE1,1,0x8814,1024,64)
for pname in [0x2800,0x2801]:F('glTexParameteri',None,[U,U,I])(0x0DE1,pname,0x2600)
vao=U();F('glGenVertexArrays',None,[I,C.POINTER(U)])(1,C.byref(vao));F('glBindVertexArray',None,[U])(vao)
bufid=U();F('glGenBuffers',None,[I,C.POINTER(U)])(1,C.byref(bufid));F('glBindBuffer',None,[U,U])(0x8C8E,bufid);F('glBufferData',None,[U,C.c_ssize_t,P,U])(0x8C8E,24,None,0x88E8);F('glBindBufferBase',None,[U,U,U])(0x8C8E,0,bufid)
F('glEnable',None,[U])(0x8C89)
cases=json.loads(root.joinpath('shader-cases.json').read_text());worst=0;invisible_mismatch=0
for case in cases:
 r=case['root'];pixel=(C.c_float*4)(r['x'],r['y'],r['z'],r['angle'])
 F('glTexSubImage2D',None,[U,I,I,I,I,I,U,U,P])(0x0DE1,0,0,0,1,1,0x1908,0x1406,pixel)
 u3(loc(program,b'uWoodlandCameraPosition'),case['camera']['x'],0,case['camera']['z']);uf(loc(program,b'uWoodlandSelectionCutoff'),case['cutoff']);ui(loc(program,b'uWoodlandNearby'),int(case['nearby']))
 F('glBeginTransformFeedback',None,[U])(0);F('glDrawArrays',None,[U,I,I])(0,0,6);F('glEndTransformFeedback',None,[])();F('glFinish',None,[])()
 mp=F('glMapBufferRange',P,[U,C.c_ssize_t,C.c_ssize_t,U])(0x8C8E,0,24,1);assert mp
 actual=C.cast(mp,C.POINTER(C.c_float))[0];F('glUnmapBuffer',C.c_ubyte,[U])(0x8C8E)
 worst=max(worst,abs(actual-case['expected']));invisible_mismatch+=int(case['expected']==0 and actual!=0)
 error=F('glGetError',U,[])();assert error==0,hex(error)
results['numeric']={'cases':len(cases),'maximumCoverageError':worst,'zeroVisibilityMismatches':invisible_mismatch,'pass':worst<.0001 and invisible_mismatch==0}
assert results['numeric']['pass'],results
root.joinpath('shader-compile.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps(results))
`;
test('optional software GLES compiles actual shader and executes coverage against CPU oracle',async t=>{
 const renderer=await readFile(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const beachSource=await readFile(new URL('../../showroom/globe/h-earth/render/rendered-beach-signal.v1.js',import.meta.url),'utf8');
 const beach=await import('data:text/javascript;base64,'+Buffer.from(beachSource).toString('base64'));
 const declaration=(name,next)=>renderer.slice(renderer.indexOf('const '+name),renderer.indexOf(next,renderer.indexOf('const '+name)));
 const declarations=declaration('GLOBAL_COVER_VS','// Same approved')+declaration('WOODLAND_FINE_GRASS_VS','const FS =')+declaration('FS =','// Ordered screen-door')+declaration('WOODLAND_FINE_GRASS_FS','// Original records');
 const shaders=new Function('FINE_GRASS_CONTINUITY','RENDERED_BEACH_GLSL',declarations+';return {vertex:WOODLAND_FINE_GRASS_VS,fragment:WOODLAND_FINE_GRASS_FS};')(C,beach.RENDERED_BEACH_GLSL);
 assert.doesNotMatch(shaders.vertex,/\bvec4 packed\b/);assert.match(shaders.vertex,/vec4 rootRecord=texelFetch/);
 const cases=[];for(let i=0;i<512;i++){
  const nearby=!!(i%2),distance=[0,8,13.99,14,19.99,20,55.99,56,61.99,62][i%10],r=root(i,distance,0,Math.fround((i*2.399963)%6.283185));
  const camera={x:Math.fround(((i%7)-3)*.001),z:Math.fround(((i%11)-5)*.001)};
  const importance=score(r,camera,{nearby}),cutoff=Math.fround(i%4===0?0:i%4===1?importance:i%4===2?Math.max(0,importance-.02):Math.max(0,importance-.05));
  cases.push({root:r,camera,nearby,cutoff,expected:visibility(r,camera,cutoff,{nearby})});
 }
 const directory=await mkdtemp(join(tmpdir(),'h-earth-software-gles-'));
 try{
  await Promise.all([writeFile(join(directory,'compile_shader.py'),SOFTWARE_GLES_PROBE),writeFile(join(directory,'vertex.glsl'),shaders.vertex),writeFile(join(directory,'fragment.glsl'),shaders.fragment),writeFile(join(directory,'shader-cases.json'),JSON.stringify(cases))]);
  const result=spawnSync(process.env.CODEX_PRIMARY_RUNTIME_PYTHON||'python3',[join(directory,'compile_shader.py')],{encoding:'utf8',timeout:30000,env:{...process.env,EGL_PLATFORM:'surfaceless',LIBGL_ALWAYS_SOFTWARE:'1'}});
  if(result.error?.code==='ENOENT'||/EGL_UNAVAILABLE_|libEGL.so.1: cannot open shared object file/.test(result.stderr)){t.skip('Optional software GLES unavailable: '+(result.error?.message||result.stderr.trim().split('\n').at(-1)));return;}
  assert.equal(result.status,0,'Software GLES probe failed: '+result.stderr+' '+result.stdout);
  const evidence=JSON.parse(result.stdout);assert.ok(evidence.vertex.pass&&evidence.fragment.pass&&evidence.link.pass);assert.equal(evidence.numeric.cases,512);assert.ok(evidence.numeric.maximumCoverageError<.0001);assert.equal(evidence.numeric.zeroVisibilityMismatches,0);
  t.diagnostic('Software GLES only; not browser/Android qualification: '+JSON.stringify(evidence));
 }finally{await rm(directory,{recursive:true,force:true});}
});
