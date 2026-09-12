import {getHEarth3DSharedShorelineBoundary} from '/showroom/globe/h-earth/environment.js';

const CONTRACT=Object.freeze({
  id:'AWARDS_WORLD_LIVING_OBJECT_TRUE_3D_V3',
  cycle:'B_WORLD',
  claim:'The browser can hold a world.',
  recognizableObject:'H_EARTH_AUDRALIA_WORLD',
  renderer:'WEBGL_3D_CONNECTED_TERRAIN',
  signatureEvent:'ENVIRONMENT_DEPTH_RESOLVE',
  eventCount:1,
  compositionProfile:Object.freeze({
    reference:'MOBILE_FIRST_VOLUMETRIC',
    cameraMode:'PERSPECTIVE_TERRAIN_FLYBY',
    fovDegrees:46,
    targetFrameOccupancy:.86,
    connectedTerrain:true,
    shorelineRecession:true,
    depthLayers:'NEAR_MID_FAR'
  }),
  sourceBinding:Object.freeze({
    hEarthEnvironment:Object.freeze({
      path:'/showroom/globe/h-earth/environment.js',
      blob:'3f3bc750b0e1a87531e0ea425dc0ac343fb18381',
      provider:'getHEarth3DSharedShorelineBoundary'
    }),
    hEarthRenderer:Object.freeze({
      path:'/showroom/globe/h-earth/renderer.js',
      blob:'799d37cec5244e6aa19b7d94dffe37e182b85884'
    }),
    audralia:Object.freeze({
      path:'/showroom/globe/audralia/index.html',
      blob:'a10fff1420681abdc377e5c06d8620a7b4f019ac'
    })
  }),
  lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const VS=`attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
uniform mat4 u_view;
uniform mat4 u_proj;
varying vec3 v_n;
varying vec4 v_c;
varying float v_depth;
void main(){
  vec4 vp=u_view*vec4(a_position,1.0);
  gl_Position=u_proj*vp;
  v_n=mat3(u_view)*a_normal;
  v_c=a_color;
  v_depth=clamp((-vp.z-2.0)/6.0,0.0,1.0);
}`;
const FS=`precision mediump float;
varying vec3 v_n;
varying vec4 v_c;
varying float v_depth;
void main(){
  vec3 L=normalize(vec3(-.45,.78,.34));
  float d=.30+.70*max(0.0,dot(normalize(v_n),L));
  vec3 fog=vec3(.08,.14,.16);
  vec3 lit=v_c.rgb*d;
  gl_FragColor=vec4(mix(lit,fog,v_depth*.34),v_c.a);
}`;

function shader(gl,type,src){
  const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('WORLD_SHADER:'+gl.getShaderInfoLog(s));
  return s;
}
function program(gl){
  const p=gl.createProgram();
  gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,VS));
  gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('WORLD_LINK:'+gl.getProgramInfoLog(p));
  return p;
}
function discoverSamples(v,seen=new Set()){
  if(!v||typeof v!=='object'||seen.has(v))return null;seen.add(v);
  if(Array.isArray(v)&&v.length>=3){
    if(v.every(q=>Array.isArray(q)&&q.length>=2&&Number.isFinite(+q[0])&&Number.isFinite(+q[1])))return v.map(q=>[+q[0],+q[1]]);
    if(v.every(q=>q&&Number.isFinite(+q.x)&&Number.isFinite(+(q.z??q.y))))return v.map(q=>[+q.x,+(q.z??q.y)]);
  }
  for(const x of Object.values(v)){const f=discoverSamples(x,seen);if(f)return f}
  return null;
}
function findWater(v,seen=new Set()){
  if(!v||typeof v!=='object'||seen.has(v))return null;seen.add(v);
  for(const[k,x]of Object.entries(v))if(/water.*(elevation|height|level)|elevation.*water/i.test(k)&&Number.isFinite(+x))return +x;
  for(const x of Object.values(v)){const f=findWater(x,seen);if(f!=null)return f}
  return null;
}
function normalizeBoundary(boundary){
  const raw=discoverSamples(boundary)||Array.from({length:33},(_,i)=>[-120+i*7.5,-10+18*Math.sin(i*.34)]);
  let xmin=Infinity,xmax=-Infinity,zmin=Infinity,zmax=-Infinity;
  for(const[x,z]of raw){xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);zmin=Math.min(zmin,z);zmax=Math.max(zmax,z)}
  const sx=Math.max(1,xmax-xmin),sz=Math.max(1,zmax-zmin);
  const pts=raw.map(([x,z])=>[(x-(xmin+xmax)/2)/sx*4.5,(z-(zmin+zmax)/2)/Math.max(sz,sx)*.85]).sort((a,b)=>a[0]-b[0]);
  return {raw,pts,waterElevation:findWater(boundary)??.68};
}
function shoreAt(pts,x){
  if(x<=pts[0][0])return pts[0][1];
  if(x>=pts[pts.length-1][0])return pts[pts.length-1][1];
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i],b=pts[i+1];
    if(x>=a[0]&&x<=b[0]){
      const t=(x-a[0])/(b[0]-a[0]||1);
      return a[1]*(1-t)+b[1]*t;
    }
  }
  return 0;
}
const HILLS=Object.freeze([
  [-1.45,1.05,.74,.72,.85],[.10,1.45,1.08,.82,1.05],[1.48,1.12,.84,.70,.92],
  [-.72,2.28,.56,.90,.72],[.92,2.48,.66,.86,.78]
]);
function landHeight(x,z,shore){
  const inland=Math.max(0,z-shore);
  let h=.04+.10*Math.min(1,inland/2.8)+.04*Math.sin(x*2.3+z*.8)*Math.min(1,inland);
  for(const[cx,cz,a,sx,sz] of HILLS){
    const dx=x-cx,dz=z-cz;
    h+=a*Math.exp(-(dx*dx/(sx*sx)+dz*dz/(sz*sz)));
  }
  return h;
}
function terrainNormal(x,z,shoreFn){
  const e=.025;
  const hL=landHeight(x-e,z,shoreFn(x-e)),hR=landHeight(x+e,z,shoreFn(x+e));
  const hD=landHeight(x,z-e,shoreFn(x)),hU=landHeight(x,z+e,shoreFn(x));
  const nx=-(hR-hL)/(2*e),ny=1,nz=-(hU-hD)/(2*e),l=Math.hypot(nx,ny,nz)||1;
  return[nx/l,ny/l,nz/l];
}
function buildScene(boundary){
  const {raw,pts,waterElevation}=normalizeBoundary(boundary);
  const NX=45,NZ=31,x0=-2.25,x1=2.25,depth=4.05;
  const p=[],n=[],c=[],idx=[];
  const sf=x=>shoreAt(pts,x)*.62-.30;
  for(let j=0;j<NZ;j++){
    const v=j/(NZ-1);
    for(let i=0;i<NX;i++){
      const x=x0+(x1-x0)*i/(NX-1),shore=sf(x);
      const z=shore+v*depth;
      const y=landHeight(x,z,shore);
      const nn=terrainNormal(x,z,sf);
      const high=Math.max(0,Math.min(1,(y-.30)/.85));
      const deep=Math.max(0,Math.min(1,v));
      p.push(x,y-.62,z-.45);n.push(...nn);
      c.push(.16+.20*high+.05*deep,.30+.22*(1-high)+.04*deep,.20+.10*high,1);
    }
  }
  for(let j=0;j<NZ-1;j++)for(let i=0;i<NX-1;i++){
    const a=j*NX+i,b=a+1,d=(j+1)*NX+i,e=d+1;
    idx.push(a,d,b,b,d,e);
  }
  const landCount=idx.length;
  const waterBase=p.length/3;
  const WNX=28,WNZ=15;
  for(let j=0;j<WNZ;j++){
    const v=j/(WNZ-1);
    for(let i=0;i<WNX;i++){
      const x=x0+(x1-x0)*i/(WNX-1),shore=sf(x),z=-3.05*(1-v)+(shore-.035)*v;
      const ripple=.012*Math.sin(x*2.8+v*5.0);
      p.push(x,-.645+ripple,z-.45);n.push(0,1,0);c.push(.025,.30+.05*v,.43+.07*v,.96);
    }
  }
  for(let j=0;j<WNZ-1;j++)for(let i=0;i<WNX-1;i++){
    const a=waterBase+j*WNX+i,b=a+1,d=waterBase+(j+1)*WNX+i,e=d+1;
    idx.push(a,b,d,b,e,d);
  }
  return {p,n,c,idx,landCount,waterElevation,sampleCount:raw.length,terrainRows:NZ,terrainColumns:NX};
}
function upload(gl,g){
  const o={count:g.idx.length};
  for(const[k,d]of[['p',g.p],['n',g.n],['c',g.c]]){
    o[k]=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o[k]);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(d),gl.STATIC_DRAW);
  }
  o.i=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.idx),gl.STATIC_DRAW);
  return o;
}
function bind(gl,p,o){
  for(const[name,key,size]of[['a_position','p',3],['a_normal','n',3],['a_color','c',4]]){
    const loc=gl.getAttribLocation(p,name);
    gl.bindBuffer(gl.ARRAY_BUFFER,o[key]);gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i);
}
function perspective(fov,aspect,near,far){
  const f=1/Math.tan(fov/2),nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
function lookAt(eye,target,up=[0,1,0]){
  const zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2],zl=Math.hypot(zx,zy,zz)||1;
  const z=[zx/zl,zy/zl,zz/zl];
  let xx=up[1]*z[2]-up[2]*z[1],xy=up[2]*z[0]-up[0]*z[2],xz=up[0]*z[1]-up[1]*z[0],xl=Math.hypot(xx,xy,xz)||1;
  const x=[xx/xl,xy/xl,xz/xl],y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,
    -(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),
    -(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),
    -(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]);
}
export function mountWorldLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('WORLD_ROOT_REQUIRED');
  const boundary=getHEarth3DSharedShorelineBoundary(),built=buildScene(boundary),doc=root.ownerDocument||document;
  const canvas=doc.createElement('canvas');
  canvas.className='awards-true3d-canvas awards-world-true3d';
  canvas.style.cssText='display:block;width:100%;height:100%;min-height:220px;pointer-events:none';
  canvas.setAttribute('aria-hidden','true');root.replaceChildren(canvas);
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true})||canvas.getContext('webgl',{alpha:true,antialias:true});
  if(!gl)throw new Error('WORLD_WEBGL_REQUIRED');
  const p=program(gl),gpu=upload(gl,built);gl.useProgram(p);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);bind(gl,p,gpu);
  const uv=gl.getUniformLocation(p,'u_view'),up=gl.getUniformLocation(p,'u_proj');
  let state='FOREGROUND_REST',phase='rest',destroyed=false,raf=0,start=performance.now(),sig=-1;
  const reduced=options.reducedMotion??matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  function resize(){
    const d=Math.min(2,devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));
    if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h}
    gl.viewport(0,0,w,h);return w/h;
  }
  function draw(t){
    if(destroyed)return;
    const aspect=resize(),elapsed=(t-start)/1000,st=sig<0?99:(t-sig)/1000;
    const resolve=reduced?1:(sig>=0?Math.min(1,st/1.05)*Math.max(0,Math.min(1,(3.3-st)/.75)):0);
    if(sig>=0&&st>3.55){sig=-1;phase='rest';state='FOREGROUND_IDLE'}
    const drift=.12*Math.sin(elapsed*.22),fly=resolve*.34;
    const eye=[-.18+drift+fly,.98+resolve*.08,-3.35+resolve*.22];
    const target=[.16+fly*.28,.20,.78+resolve*.30];
    gl.clearColor(.008,.018,.026,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uv,false,lookAt(eye,target));
    gl.uniformMatrix4fv(up,false,perspective(CONTRACT.compositionProfile.fovDegrees*Math.PI/180,aspect,.08,30));
    gl.drawElements(gl.TRIANGLES,gpu.count,gl.UNSIGNED_SHORT,0);
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  function S(x){if(!CONTRACT.lifecycle.includes(x))throw new Error('WORLD_INVALID_STATE');state=x;return x}
  function playSignature(){S('SIGNATURE_PLAY');phase='depth-resolve';sig=performance.now();return sig}
  function selectResponse(){S('SELECT_RESPONSE')}
  function readerOpen(){S('READER_OPEN')}
  function restore(){S('RETURN_RESTORING');sig=-1;phase='rest';setTimeout(()=>{if(!destroyed)S('FOREGROUND_REST')},reduced?0:250)}
  function setLifecycle(x){S(x)}
  function inspect(){return Object.freeze({
    contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:1,renderer:CONTRACT.renderer,
    recognizableObject:CONTRACT.recognizableObject,signatureEvent:CONTRACT.signatureEvent,eventCount:1,
    shorelineSampleCount:built.sampleCount,waterElevation:built.waterElevation,terrainRows:built.terrainRows,
    terrainColumns:built.terrainColumns,connectedTerrain:true,perspectiveProjection:true,
    compositionProfile:CONTRACT.compositionProfile,sourceBinding:CONTRACT.sourceBinding
  })}
  function destroy(){
    destroyed=true;cancelAnimationFrame(raf);
    for(const k of['p','n','c','i'])gl.deleteBuffer(gpu[k]);
    gl.deleteProgram(p);gl.getExtension('WEBGL_lose_context')?.loseContext();root.replaceChildren();
  }
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:canvas});
}
export{CONTRACT as AWARDS_WORLD_CYCLE_B_CONTRACT};
