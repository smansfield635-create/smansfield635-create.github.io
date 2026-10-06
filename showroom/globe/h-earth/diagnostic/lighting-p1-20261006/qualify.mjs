/** Isolated production-shader qualification; not a whole-world/device benchmark. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../../');
const baselinePath='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const candidatePath='showroom/globe/h-earth/render/persistent-live-renderer.p1-lighting-20261006.js';
const baseline=fs.readFileSync(path.join(root,baselinePath),'utf8');
const candidate=fs.readFileSync(path.join(root,candidatePath),'utf8');
const sha=s=>createHash('sha256').update(s).digest('hex');
const shader=(s,name)=>s.match(new RegExp('const '+name+' = `([\\s\\S]*?)`;'))[1];
const start=candidate.indexOf('\n  // P1 comparison:');
const end=candidate.indexOf('\n  lit+=base*rim',start);
assert(start>0&&end>start,'bounded P1 insertion must exist');
assert.equal(candidate.slice(0,start)+candidate.slice(end),baseline,'only the lighting insertion may differ');
assert.equal(shader(candidate,'VS'),shader(baseline,'VS'));
const signature=s=>[...s.matchAll(/^uniform .*;/gm)].map(x=>x[0]);
assert.deepEqual(signature(shader(candidate,'FS')),signature(shader(baseline,'FS')));
const NATIVE_GLES_HARNESS=String.raw`import ctypes as C, json, sys
E=C.CDLL('libEGL.so.1'); I=C.c_int; U=C.c_uint; F=C.c_float; P=C.c_void_p
E.eglGetProcAddress.argtypes=[C.c_char_p]; E.eglGetProcAddress.restype=P
def fun(name,ret,*args):
 ptr=E.eglGetProcAddress(name.encode()); assert ptr,name
 return C.CFUNCTYPE(ret,*args)(ptr)
getDisplay=fun('eglGetPlatformDisplayEXT',P,U,P,C.POINTER(I))
d=getDisplay(0x31DD,None,None)
initialize=fun('eglInitialize',U,P,C.POINTER(I),C.POINTER(I)); major=I();minor=I();assert initialize(d,C.byref(major),C.byref(minor))
assert fun('eglBindAPI',U,U)(0x30A0)
attrs=(I*13)(0x3033,1,0x3040,0x40,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3038)
config=P(); count=I(); assert fun('eglChooseConfig',U,P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I))(d,attrs,C.byref(config),1,C.byref(count)) and count.value
surf=fun('eglCreatePbufferSurface',P,P,P,C.POINTER(I))(d,config,(I*5)(0x3057,96,0x3056,96,0x3038))
ctx=fun('eglCreateContext',P,P,P,P,C.POINTER(I))(d,config,None,(I*3)(0x3098,3,0x3038));assert ctx
assert fun('eglMakeCurrent',U,P,P,P,P)(d,surf,surf,ctx)
gs=fun('glGetString',C.c_char_p,U)
if len(sys.argv)>1 and sys.argv[1]=='probe': print(gs(0x1F02).decode(),gs(0x1F01).decode());sys.exit()
data=json.load(sys.stdin)
create=fun('glCreateShader',U,U);source=fun('glShaderSource',None,U,I,C.POINTER(C.c_char_p),P);compile=fun('glCompileShader',None,U);shaderiv=fun('glGetShaderiv',None,U,U,C.POINTER(I));shaderlog=fun('glGetShaderInfoLog',None,U,I,P,C.c_char_p)
def shader(kind,text):
 s=create(kind);b=C.c_char_p(text.encode());source(s,1,C.byref(b),None);compile(s);ok=I();shaderiv(s,0x8B81,C.byref(ok));log=C.create_string_buffer(16384);shaderlog(s,16384,None,log);assert ok.value,log.value.decode();return s
programs=[]
for fs in [data['oldFS'],data['newFS']]:
 p=fun('glCreateProgram',U)();fun('glAttachShader',None,U,U)(p,shader(0x8B31,data['vs']));fun('glAttachShader',None,U,U)(p,shader(0x8B30,fs));fun('glLinkProgram',None,U)(p);ok=I();fun('glGetProgramiv',None,U,U,C.POINTER(I))(p,0x8B82,C.byref(ok));log=C.create_string_buffer(16384);fun('glGetProgramInfoLog',None,U,I,P,C.c_char_p)(p,16384,None,log);assert ok.value,log.value.decode();programs.append(p)
tex=U();fun('glGenTextures',None,I,C.POINTER(U))(1,C.byref(tex));fun('glBindTexture',None,U,U)(0x0DE1,tex);fun('glTexImage2D',None,U,I,I,I,I,I,U,U,P)(0x0DE1,0,0x8229,1,1,0,0x1903,0x1401,(C.c_ubyte*1)(0));param=fun('glTexParameteri',None,U,U,I);param(0x0DE1,0x2801,0x2600);param(0x0DE1,0x2800,0x2600)
scenes=[('terrain-upward',1,[0,1,0],24),('terrain-sunward-slope',1,[.75,.65,0],24),('terrain-away-slope',1,[-.85,.35,-.4],24),('foliage-upward',3,[0,1,0],3),('foliage-side',3,[-1,0,0],3),('foliage-downward',3,[0,-1,0],3),('shoreline-control',2,[0,1,0],0),('water-control',4,[0,1,0],0)]
envs=[('warm-sun',[1,.86,.7]),('neutral-sun',[1,1,1])]
def draw(p,s,env):
 name,role,normal,y=s
 fun('glUseProgram',None,U)(p);fun('glViewport',None,I,I,I,I)(0,0,96,96);fun('glClearColor',None,F,F,F,F)(0,0,0,0);fun('glClear',None,U)(0x4000)
 for cap in [0x0B44,0x0B71,0x0BE2]:fun('glDisable',None,U)(cap)
 loc=lambda n:fun('glGetUniformLocation',I,U,C.c_char_p)(p,n.encode())
 v3=lambda n,a:fun('glUniform3fv',None,I,I,C.POINTER(F))(loc(n),1,(F*3)(*a))
 f=lambda n,v:fun('glUniform1f',None,I,F)(loc(n),v)
 fun('glUniformMatrix4fv',None,I,I,U,C.POINTER(F))(loc('uViewProjection'),1,0,(F*16)(1/16,0,0,0,0,0,0,0,0,1/16,0,0,0,0,0,1))
 for n,a in [('uCameraPosition',[0,80,60]),('uSunDirection',[-.6,-.7,-.3]),('uSunColor',env[1]),('uSkyZenithColor',[.16,.3,.52]),('uSkyHorizonColor',[.55,.64,.7]),('uGroundHazeColor',[.34,.3,.23])]:v3(n,a)
 for n,v in [('uSunIntensity',1),('uFogStartDistance',1000),('uFogFalloff',.001),('uMaximumFogFactor',.8),('uDistanceDesaturationStrength',.2)]:f(n,v)
 for n in ['uClipBaseTerrain','uShorelineSoilCoverage']:fun('glUniform1i',None,I,I)(loc(n),0)
 positions=(F*18)(-16,y,-16,16,y,-16,-16,y,16,-16,y,16,16,y,-16,16,y,16);buf=U();fun('glGenBuffers',None,I,C.POINTER(U))(1,C.byref(buf));fun('glBindBuffer',None,U,U)(0x8892,buf);fun('glBufferData',None,U,C.c_ssize_t,P,U)(0x8892,C.sizeof(positions),positions,0x88E4);fun('glEnableVertexAttribArray',None,U)(0);fun('glVertexAttribPointer',None,U,I,U,U,I,P)(0,3,0x1406,0,0,None)
 for i in range(1,10):fun('glDisableVertexAttribArray',None,U)(i)
 fun('glVertexAttrib3fv',None,U,C.POINTER(F))(1,(F*3)(*normal));a4=fun('glVertexAttrib4f',None,U,F,F,F,F);a4(2,.25,.34,.12,1);a4(3,.4,.2,.2,1);ui=fun('glVertexAttribI4ui',None,U,U,U,U,U)
 for i,v in [(4,1),(5,1),(6,7),(7,role)]:ui(i,v,0,0,0)
 for i in [8,9]:fun('glVertexAttrib1f',None,U,F)(i,64)
 fun('glDrawArrays',None,U,I,I)(4,0,6);pixels=(C.c_ubyte*(96*96*4))();fun('glReadPixels',None,I,I,I,I,U,U,P)(0,0,96,96,0x1908,0x1401,pixels);err=fun('glGetError',U)();assert not err,hex(err);fun('glDeleteBuffers',None,I,C.POINTER(U))(1,C.byref(buf));return {'pixels':list(pixels)}
rows=[]
for env in envs:
 for s in scenes:rows.append({'name':s[0],'role':s[1],'environment':env[0],'normal':s[2],'before':draw(programs[0],s,env),'after':draw(programs[1],s,env),'repeat':draw(programs[1],s,env)['pixels']})
print(json.dumps({'rows':rows,'renderer':gs(0x1F01).decode(),'version':gs(0x1F02).decode()}))
`;
let results,browser,page;
const backend=process.env.P1_GRAPHICS_BACKEND||'webgl2';
assert(['webgl2','gles3'].includes(backend));
try{
if(backend==='gles3'){
 results=JSON.parse(execFileSync(process.env.PYTHON||'python3',['-c',NATIVE_GLES_HARNESS],{input:JSON.stringify({vs:shader(baseline,'VS'),oldFS:shader(baseline,'FS'),newFS:shader(candidate,'FS')}),maxBuffer:32*1024*1024,encoding:'utf8'}));
}else{
const require=createRequire(import.meta.url);
let playwright;
try{playwright=require('playwright');}catch{assert(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'Install playwright or provide CODEX_PRIMARY_RUNTIME_NODE_MODULES');playwright=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));}
browser=await playwright.chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'],...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
page=await browser.newPage({viewport:{width:900,height:1050}});
results=await page.evaluate(({vs,oldFS,newFS})=>{
 const c=document.createElement('canvas');c.width=96;c.height=96;const gl=c.getContext('webgl2',{antialias:false,preserveDrawingBuffer:true});if(!gl)throw Error('WEBGL2_UNAVAILABLE');
 const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
 const program=fs=>{const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;};
 const programs=[program(oldFS),program(newFS)];
 const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.R8,1,1,0,gl.RED,gl.UNSIGNED_BYTE,new Uint8Array([0]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
 const scenes=[
  {name:'terrain-upward',role:1,normal:[0,1,0],height:24},
  {name:'terrain-sunward-slope',role:1,normal:[0.75,0.65,0],height:24},
  {name:'terrain-away-slope',role:1,normal:[-0.85,0.35,-0.4],height:24},
  {name:'foliage-upward',role:3,normal:[0,1,0],height:3},
  {name:'foliage-side',role:3,normal:[-1,0,0],height:3},
  {name:'foliage-downward',role:3,normal:[0,-1,0],height:3},
  {name:'shoreline-control',role:2,normal:[0,1,0],height:0},
  {name:'water-control',role:4,normal:[0,1,0],height:0}
 ];
 const palettes=[{name:'warm-sun',sun:[1,0.86,0.7],sky:[0.16,0.3,0.52],horizon:[0.55,0.64,0.7],ground:[0.34,0.3,0.23]}, {name:'neutral-sun',sun:[1,1,1],sky:[0.16,0.3,0.52],horizon:[0.55,0.64,0.7],ground:[0.34,0.3,0.23]}];
 function draw(p,s,env){
 gl.useProgram(p);gl.viewport(0,0,96,96);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.disable(gl.CULL_FACE);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);
 const loc=n=>gl.getUniformLocation(p,n),v3=(n,a)=>gl.uniform3fv(loc(n),a),f=(n,v)=>gl.uniform1f(loc(n),v);
 gl.uniformMatrix4fv(loc('uViewProjection'),false,new Float32Array([1/16,0,0,0,0,0,0,0,0,1/16,0,0,0,0,0,1]));
 v3('uCameraPosition',[0,80,60]);v3('uSunDirection',[-0.6,-0.7,-0.3]);v3('uSunColor',env.sun);v3('uSkyZenithColor',env.sky);v3('uSkyHorizonColor',env.horizon);v3('uGroundHazeColor',env.ground);f('uSunIntensity',1);f('uFogStartDistance',1000);f('uFogFalloff',0.001);f('uMaximumFogFactor',0.8);f('uDistanceDesaturationStrength',0.2);gl.uniform1i(loc('uClipBaseTerrain'),0);gl.uniform1i(loc('uShorelineSoilCoverage'),0);
 const positions=new Float32Array([-16,s.height,-16,16,s.height,-16,-16,s.height,16,-16,s.height,16,16,s.height,-16,16,s.height,16]);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
 for(let i=1;i<=9;i++)gl.disableVertexAttribArray(i);
 gl.vertexAttrib3fv(1,s.normal);gl.vertexAttrib4f(2,0.25,0.34,0.12,1);gl.vertexAttrib4f(3,0.4,0.2,0.2,1);gl.vertexAttribI4ui(4,1,0,0,0);gl.vertexAttribI4ui(5,1,0,0,0);gl.vertexAttribI4ui(6,7,0,0,0);gl.vertexAttribI4ui(7,s.role,0,0,0);gl.vertexAttrib1f(8,64);gl.vertexAttrib1f(9,64);
 gl.drawArrays(gl.TRIANGLES,0,6);const pixels=new Uint8Array(96*96*4);gl.readPixels(0,0,96,96,gl.RGBA,gl.UNSIGNED_BYTE,pixels);const err=gl.getError();if(err)throw Error('GL_ERROR_'+err);gl.deleteBuffer(b);return {pixels:Array.from(pixels),image:c.toDataURL()};
 }
 const rows=[];for(const env of palettes)for(const scene of scenes){const before=draw(programs[0],scene,env),after=draw(programs[1],scene,env),repeat=draw(programs[1],scene,env);rows.push({name:scene.name,role:scene.role,environment:env.name,normal:scene.normal,before,after,repeat:repeat.pixels});}
 const ext=gl.getExtension('WEBGL_debug_renderer_info');return {rows,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),version:gl.getParameter(gl.VERSION)};
},{vs:shader(baseline,'VS'),oldFS:shader(baseline,'FS'),newFS:shader(candidate,'FS')});
}
const renderedRows=results.rows;
// Production negates uSunDirection; catch accidentally reversed fixture labels.
for(const row of renderedRows){
 const dot=row.normal.reduce((sum,n,i)=>sum+n*[0.6,0.7,0.3][i],0);
 if(row.name==='terrain-upward'||row.name==='terrain-sunward-slope')assert(dot>0,'sunward fixture must receive direct light');
 if(row.name==='terrain-away-slope')assert(dot<0,'away fixture must face away from direct light');
}
for(const row of renderedRows){assert.deepEqual(row.after.pixels,row.repeat,'repeat rendering must be deterministic');assert(row.after.pixels.some((v,i)=>i%4!==3&&v>0),'nonblack output');if(row.role===2||row.role===4)assert.deepEqual(row.before.pixels,row.after.pixels,'excluded role changed');else assert.notDeepEqual(row.before.pixels,row.after.pixels,'target role did not change');}
if(page&&process.env.P1_VISUAL_OUTPUT){await page.setContent('<style>body{font:14px sans-serif;background:#20252b;color:white}article{display:inline-block;width:210px;margin:5px}img{width:96px;height:96px}h1{font-size:20px}</style><h1>Isolated production shaders · baseline / P1 · synthetic patches</h1>'+renderedRows.map(r=>'<article><p>'+r.name+' / '+r.environment+'</p><img src="'+r.before.image+'"><img src="'+r.after.image+'"></article>').join(''));await page.screenshot({path:process.env.P1_VISUAL_OUTPUT,fullPage:true});}
results.rows=renderedRows.map(({before,after,repeat,...r})=>{let changed=0,sum=0,max=0;for(let i=0;i<before.pixels.length;i++){if(i%4===3)continue;const d=Math.abs(before.pixels[i]-after.pixels[i]);changed+=d>0?1:0;sum+=d;max=Math.max(max,d);}return {...r,baselineSHA256:sha(Buffer.from(before.pixels)),candidateSHA256:sha(Buffer.from(after.pixels)),repeatExact:true,changedChannels:changed,meanAbsoluteChannelDelta:sum/(96*96*3),maxChannelDelta:max};});
}finally{await browser?.close();}
const report={schema:'H_EARTH_P1_LIGHTING_SHADER_QUALIFICATION_v1',result:'PASS_ISOLATED_SHADER_CHECKS',backend,baselineHead:'d7b762bcca1c595b78fd1339c8d0fd38ede0ae98',baselinePath,candidatePath,baselineSHA256:sha(baseline),candidateSHA256:sha(candidate),sourceProof:{onlyBoundedLightingInsertion:true,productionVertexShaderUnchanged:true,uniformInterfaceUnchanged:true,allOtherSourceBytesUnchanged:true},...results,limits:['Synthetic matched patches using exact production shaders; not canonical whole-world views.','The reported graphics backend proves compile/link and bounded role behavior only; GLES is not browser WebGL acceptance. Physical phone/tablet cost and visual acceptance remain pending.','No added occlusion, cast shadows, geometry, foliage instances, or motion.','Candidate not bound to default renderer; integration and navigation unchanged by source identity, not exercised here.'],nextGate:'Canonical whole-world six-view comparison and physical phone/tablet acceptance before default adoption.'};
const out=process.env.P1_QUALIFICATION_OUTPUT||path.join(root,'h-earth-3d/evidence/lighting-p1-20261006/qualification.json');fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({result:report.result,scenes:results.rows.length,renderer:results.renderer,output:out}));
