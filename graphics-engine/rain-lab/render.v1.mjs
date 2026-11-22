import {createNativeWebGLDevice} from '../../assets/engine/dgb.native-webgl-device.v1.mjs';
import {createNativeFramePipeline} from '../../assets/engine/dgb.native-frame-pipeline.v1.mjs';
import {createRainField,buildRainMesh,inspectRainField} from './spatial-rain.v1.mjs';
/* Off-product precipitation: canonical E1/E2 ownership and three depth bands. */
const BG_VERTEX_1="attribute vec2 aPosition;varying vec2 vUV;void main(){vUV=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}";
const BG_VERTEX_2="#version 300 es\nin vec2 aPosition;out vec2 vUV;void main(){vUV=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}";
const BG_BODY="\nprecision highp float;\nuniform float uTime; uniform float uAspect; uniform vec2 uCamera;\nfloat noise3(vec3 p) {p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}\nfloat valueNoise(vec3 x){\n  vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);\n  float a=mix(noise3(i),noise3(i+vec3(1.,0.,0.)),f.x);\n  float b=mix(noise3(i+vec3(0.,1.,0.)),noise3(i+vec3(1.,1.,0.)),f.x);\n  float c=mix(noise3(i+vec3(0.,0.,1.)),noise3(i+vec3(1.,0.,1.)),f.x);\n  float d=mix(noise3(i+vec3(0.,1.,1.)),noise3(i+vec3(1.,1.,1.)),f.x);\n  return mix(mix(a,b,f.y),mix(c,d,f.y),f.z);\n}\nfloat density(vec3 p){\n  float layer=smoothstep(1.,5.5,p.y)*(1.-smoothstep(20.,29.,p.y));\n  vec3 drift=vec3(uTime*.035,0.,uTime*.018);\n  float broad=valueNoise(p*.065+drift)*.64+valueNoise(p*.17+drift*2.1)*.29+valueNoise(p*.42)*.07;\n  return layer*smoothstep(.36,.72,broad)*.23;\n}\nvoid main(){\n  vec2 q=vUV*2.-1.; vec3 rd=normalize(vec3(q.x*uAspect*.59,q.y*.59,-1.));\n  vec3 ro=vec3(uCamera.x*.05,-2.4+uCamera.y*.05,0.);\n  float tau=0.,scatter=0.;\n  for(int i=0;i<10;i++){\n    float t=10.+(float(i)+.5)*6.8;\n    float d=density(ro+rd*t);\n    tau+=d*1.25;scatter+=d*max(.15,dot(rd,normalize(vec3(.29,.7,-.64))));\n  }\n  float transmission=exp(-tau);\n  vec3 farColor=mix(vec3(.035,.048,.068),vec3(.084,.093,.117),smoothstep(-.9,1.,q.y));\n  vec3 cloudLit=vec3(.22,.245,.277)*(.18+scatter*.85);\n  OUTCOLOR=vec4(mix(farColor,cloudLit,1.-transmission),1.);\n}";
const RAIN_VERTEX="\nprecision highp float;\nuniform float uTime,uAspect,uTanHalfFov;uniform vec2 uCamera;\nATTR vec3 aBase; ATTR vec2 aCorner; ATTR vec4 aFall; ATTR vec2 aShape;\nVARY_OUT vec2 vCorner; VARY_OUT float vAlpha; VARY_OUT float vDepth;\nvoid main(){\n  float depth=-aBase.z;\n  float spanX=2.7*depth*uTanHalfFov*uAspect,spanY=2.6*depth*uTanHalfFov;\n  float x=mod(aBase.x+aFall.y*uTime+spanX*.5,spanX)-spanX*.5;\n  float y=spanY*.5-mod(aBase.y+aFall.z*spanY+uTime*aFall.x,spanY);\n  vec2 p=vec2(x,y)+vec2(aCorner.x*aShape.x+aCorner.y*aFall.y*.012,aCorner.y*aFall.w*.5);\n  vec2 clip=(p-uCamera)/vec2(depth*uTanHalfFov*uAspect,depth*uTanHalfFov);\n  gl_Position=vec4(clip,clamp(1.-depth/54.,-.95,.95),1.);\n  vCorner=aCorner;vAlpha=aShape.y;vDepth=depth;\n}";
const RAIN_FRAGMENT="\nprecision highp float;\nVARY_IN vec2 vCorner; VARY_IN float vAlpha; VARY_IN float vDepth;\nvoid main(){\n  float axial=1.-smoothstep(.66,1.,abs(vCorner.y));\n  float core=exp(-7.2*vCorner.x*vCorner.x),halo=exp(-1.9*vCorner.x*vCorner.x);\n  float alpha=vAlpha*axial*(core*.82+halo*.18);\n  float scatter=1.-smoothstep(8.,46.,vDepth);\n  vec3 tint=mix(vec3(.49,.62,.71),vec3(.82,.87,.91),scatter);\n  OUTCOLOR=vec4(tint,alpha);\n}";

function shaderSources(backend){
 const is2=backend==='WEBGL2';
 const bgVertex=is2?BG_VERTEX_2:BG_VERTEX_1;
 const bgFragment=(is2?'#version 300 es\nin vec2 vUV;out vec4 fragmentColor;\n#define OUTCOLOR fragmentColor\n':'varying vec2 vUV;\n#define OUTCOLOR gl_FragColor\n')+BG_BODY;
 const rainVertex=(is2?'#version 300 es\n#define ATTR in\n#define VARY_OUT out\n':'#define ATTR attribute\n#define VARY_OUT varying\n')+RAIN_VERTEX;
 const rainFragment=(is2?'#version 300 es\n#define VARY_IN in\nout vec4 fragmentColor;\n#define OUTCOLOR fragmentColor\n':'#define VARY_IN varying\n#define OUTCOLOR gl_FragColor\n')+RAIN_FRAGMENT;
 return {bgVertex,bgFragment,rainVertex,rainFragment};
}

const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
/** An isolated native E1/E2 WebGL renderer. No DOM interactivity or page mutation. */
export function createSpatialRainRenderer({canvas,seed=7341,counts=null,maxPixels=360000}={}){
 if(!(canvas instanceof HTMLCanvasElement))throw new TypeError('RAIN_CANVAS_REQUIRED');
 let device=null,backend=null;
 for(const kind of ['WEBGL2','WEBGL1']){
  try{device=createNativeWebGLDevice(canvas,{backend:kind,contextAttributes:{alpha:false,antialias:false,depth:false,preserveDrawingBuffer:true}});backend=kind;break;}
  catch(_){/* Unsupported backend; try once more before dark fallback. */}
 }
 if(!device)throw new Error('NATIVE_WEBGL_UNAVAILABLE_DARK_FALLBACK');
 try{
  const pipeline=createNativeFramePipeline(device),ratio=(canvas.clientWidth||390)/(canvas.clientHeight||760),tanHalfFov=.49;
  const field=createRainField({seed,aspect:ratio,tanHalfFov,counts});
  const src=shaderSources(backend);
  const bgProgram=device.createProgram({vertexSource:src.bgVertex,fragmentSource:src.bgFragment});
  const rainProgram=device.createProgram({vertexSource:src.rainVertex,fragmentSource:src.rainFragment});
  const bgMesh=device.createMesh({vertexCount:6,attributes:[{name:'aPosition',size:2,data:new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1])}]});
  const bandMeshes=field.bands.map(b=>device.createMesh(buildRainMesh(b)));
  const gl=device.gl;let alive=true,frames=0,lastFrame=null;
  function resize(){
   const w=canvas.clientWidth||390,h=canvas.clientHeight||760;
   const scale=Math.min(1,Math.sqrt(maxPixels/(w*h)),1.2/Math.max(1,window.devicePixelRatio||1));
   const width=Math.max(2,Math.floor(w*scale)),height=Math.max(2,Math.floor(h*scale));
   if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
   return {width,height};
  }
  function bindCommon(context,program,time,aspect,camera){
   context.uniform1f(context.getUniformLocation(program,'uTime'),time);
   context.uniform1f(context.getUniformLocation(program,'uAspect'),aspect);
   context.uniform2fv(context.getUniformLocation(program,'uCamera'),camera);
  }
  function render(time=0,camera=[0,0]){
   if(!alive)throw Error('RAIN_RENDERER_DISPOSED');
   if(!Number.isFinite(time)||time<0||!Array.isArray(camera)||camera.length!==2||!camera.every(Number.isFinite))throw TypeError('RAIN_FRAME_INPUT_INVALID');
   const size=resize(),aspect=size.width/size.height;
   pipeline.beginFrame({target:null,depthMode:'OFF',cull:'NONE',clear:{color:[.018,.024,.034,1],depth:null}});
   pipeline.submit({pass:'OPAQUE',program:bgProgram,mesh:bgMesh,beforeDraw:(context,program)=>bindCommon(context,program,time,aspect,camera)});
   field.bands.forEach((band,i)=>pipeline.submit({
    pass:'TRANSPARENT',program:rainProgram,mesh:bandMeshes[i],depthKey:(band.minDepth+band.maxDepth)*.5,
    beforeDraw:(context,program)=>{bindCommon(context,program,time,aspect,camera);
     context.uniform1f(context.getUniformLocation(program,'uTanHalfFov'),tanHalfFov);}
   }));
   lastFrame=pipeline.endFrame({presentToCanvas:true,presentationEncoding:'LINEAR'});
   frames++;return lastFrame;
  }
  function readback(){
   const rgba=new Uint8Array(canvas.width*canvas.height*4);
   gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,rgba);
   let brightest=0,brightPixels=0;
   for(let i=0;i<rgba.length;i+=4){const v=Math.max(rgba[i],rgba[i+1],rgba[i+2]);brightest=Math.max(brightest,v);if(v>45)brightPixels++;}
   return Object.freeze({backend,pixels:canvas.width*canvas.height,brightest,brightPixels,glError:gl.getError(),frameCount:frames});
  }
  function stop(){if(alive){alive=false;device.dispose();}}
  return Object.freeze({backend,field,device,pipeline,render,readback,stop,
   inspect:()=>Object.freeze({backend,field:inspectRainField(field),device:device.status(),frames,lastFrame})});
 }catch(error){device.dispose();throw error;}
}
