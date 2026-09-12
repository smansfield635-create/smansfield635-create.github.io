import {getHEarth3DSharedShorelineBoundary} from '/showroom/globe/h-earth/environment.js';

const CONTRACT=Object.freeze({
  id:'AWARDS_WORLD_LIVING_OBJECT_TRUE_3D_V4_PLANETARY_RECOGNITION',
  cycle:'B_WORLD',
  claim:'The browser can hold a world.',
  recognizableObject:'H_EARTH_AUDRALIA_WORLD',
  renderer:'WEBGL_3D_PLANET_WITH_AUDRALIA_COAST',
  signatureEvent:'AUDRALIA_ORBIT_REVEAL',
  eventCount:1,
  compositionProfile:Object.freeze({
    reference:'PLANET_FIRST_RECOGNITION',
    cameraMode:'PERSPECTIVE_PLANETARY_ORBIT',
    fovDegrees:34,
    targetFrameOccupancy:.86,
    sphericalWorld:true,
    audraliaCoastVisible:true,
    atmosphereRim:true,
    naturalFootprint:'PLANETARY_DISC'
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
uniform float u_spin;
uniform float u_tilt;
varying vec3 v_n;
varying vec4 v_c;
varying float v_rim;
void main(){
  float cy=cos(u_spin),sy=sin(u_spin),cx=cos(u_tilt),sx=sin(u_tilt);
  vec3 p=vec3(cy*a_position.x+sy*a_position.z,a_position.y,-sy*a_position.x+cy*a_position.z);
  vec3 n=vec3(cy*a_normal.x+sy*a_normal.z,a_normal.y,-sy*a_normal.x+cy*a_normal.z);
  p=vec3(p.x,cx*p.y-sx*p.z,sx*p.y+cx*p.z);
  n=vec3(n.x,cx*n.y-sx*n.z,sx*n.y+cx*n.z);
  vec4 vp=u_view*vec4(p,1.0);
  gl_Position=u_proj*vp;
  v_n=normalize(mat3(u_view)*n);
  v_c=a_color;
  v_rim=pow(1.0-max(0.0,abs(v_n.z)),2.1);
}`;
const FS=`precision mediump float;
varying vec3 v_n;
varying vec4 v_c;
varying float v_rim;
void main(){
  vec3 L=normalize(vec3(-.48,.70,.52));
  float d=.24+.76*max(0.0,dot(normalize(v_n),L));
  vec3 lit=v_c.rgb*d;
  vec3 atmosphere=vec3(.12,.52,.72)*v_rim*.42;
  gl_FragColor=vec4(lit+atmosphere,v_c.a);
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
function normalizeBoundary(boundary){
  const raw=discoverSamples(boundary)||Array.from({length:33},(_,i)=>[-120+i*7.5,-10+18*Math.sin(i*.34)]);
  let xmin=Infinity,xmax=-Infinity,zmin=Infinity,zmax=-Infinity;
  for(const[x,z]of raw){xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);zmin=Math.min(zmin,z);zmax=Math.max(zmax,z)}
  const sx=Math.max(1,xmax-xmin),sz=Math.max(1,zmax-zmin);
  const pts=raw.map(([x,z])=>[
    ((x-(xmin+xmax)/2)/sx)*1.14,
    ((z-(zmin+zmax)/2)/Math.max(sz,sx))*.56-.12
  ]).sort((a,b)=>a[0]-b[0]);
  return {raw,pts};
}
function spherePoint(lon,lat,r=1){
  const c=Math.cos(lat);return [r*c*Math.sin(lon),r*Math.sin(lat),r*c*Math.cos(lon)];
}
function normal3(v){const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l]}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function addVertex(g,p,n,c){g.p.push(...p);g.n.push(...n);g.c.push(...c);return g.p.length/3-1}
function buildOcean(g){
  const LAT=36,LON=58,r=1;
  for(let j=0;j<=LAT;j++){
    const lat=-Math.PI/2+Math.PI*j/LAT;
    for(let i=0;i<=LON;i++){
      const lon=-Math.PI+2*Math.PI*i/LON,p=spherePoint(lon,lat,r),n=normal3(p);
      const tropical=1-Math.min(1,Math.abs(lat)/(Math.PI/2));
      addVertex(g,p,n,[.025+.018*tropical,.20+.08*tropical,.34+.12*tropical,1]);
    }
  }
  for(let j=0;j<LAT;j++)for(let i=0;i<LON;i++){
    const a=j*(LON+1)+i,b=a+1,d=(j+1)*(LON+1)+i,e=d+1;
    g.idx.push(a,d,b,b,d,e);
  }
}
function addLandStamp(g,lon,lat,rad=.15,segments=12,seed=0){
  const center=spherePoint(lon,lat,1.018),cn=normal3(center),axis=Math.abs(cn[1])<.88?[0,1,0]:[1,0,0],u=normal3(cross(axis,cn)),v=normal3(cross(cn,u));
  const high=.5+.18*Math.sin(seed*1.7),base=addVertex(g,center,cn,[.26+.06*high,.40+.07*high,.20,.98]);
  const ring=[];
  for(let i=0;i<segments;i++){
    const a=2*Math.PI*i/segments,rr=rad*(.82+.18*Math.sin(seed*2.1+i*2.7));
    const raw=[center[0]+(u[0]*Math.cos(a)+v[0]*Math.sin(a))*rr,center[1]+(u[1]*Math.cos(a)+v[1]*Math.sin(a))*rr,center[2]+(u[2]*Math.cos(a)+v[2]*Math.sin(a))*rr];
    const p=normal3(raw).map(x=>x*1.019),n=normal3(p);
    ring.push(addVertex(g,p,n,[.22+.05*high,.36+.08*high,.16,.98]));
  }
  for(let i=0;i<segments;i++)g.idx.push(base,ring[i],ring[(i+1)%segments]);
}
function addCoastRibbon(g,pts){
  const left=[],right=[];
  for(let i=0;i<pts.length;i++){
    const [lon,lat]=pts[i],p=spherePoint(lon,lat,1.032),n=normal3(p);
    const prev=spherePoint(...pts[Math.max(0,i-1)],1.032),next=spherePoint(...pts[Math.min(pts.length-1,i+1)],1.032),t=normal3([next[0]-prev[0],next[1]-prev[1],next[2]-prev[2]]),side=normal3(cross(n,t)),w=.018;
    left.push(addVertex(g,[p[0]+side[0]*w,p[1]+side[1]*w,p[2]+side[2]*w],n,[.78,.66,.34,1]));
    right.push(addVertex(g,[p[0]-side[0]*w,p[1]-side[1]*w,p[2]-side[2]*w],n,[.78,.66,.34,1]));
  }
  for(let i=0;i<pts.length-1;i++)g.idx.push(left[i],right[i],left[i+1],left[i+1],right[i],right[i+1]);
}
function buildScene(boundary){
  const {raw,pts}=normalizeBoundary(boundary),g={p:[],n:[],c:[],idx:[]};
  buildOcean(g);
  const stride=Math.max(1,Math.floor(pts.length/13));
  let stamp=0;
  for(let i=0;i<pts.length;i+=stride){const[lon,lat]=pts[i];addLandStamp(g,lon,lat,.15+(stamp%3)*.018,12,stamp++);}
  addCoastRibbon(g,pts);
  return {...g,shorelineSampleCount:raw.length,landStampCount:stamp,coastRibbonSegments:Math.max(0,pts.length-1)};
}
function upload(gl,g){
  const o={count:g.idx.length};
  for(const[k,d]of[['p',g.p],['n',g.n],['c',g.c]]){o[k]=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o[k]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(d),gl.STATIC_DRAW)}
  o.i=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.idx),gl.STATIC_DRAW);return o;
}
function bind(gl,p,o){
  for(const[name,key,size]of[['a_position','p',3],['a_normal','n',3],['a_color','c',4]]){const loc=gl.getAttribLocation(p,name);gl.bindBuffer(gl.ARRAY_BUFFER,o[key]);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0)}
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i);
}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0])}
function lookAt(eye,target,up=[0,1,0]){
  const z=normal3([eye[0]-target[0],eye[1]-target[1],eye[2]-target[2]]),x=normal3(cross(up,z)),y=cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]);
}
export function mountWorldLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('WORLD_ROOT_REQUIRED');
  const boundary=getHEarth3DSharedShorelineBoundary(),built=buildScene(boundary),doc=root.ownerDocument||document,canvas=doc.createElement('canvas');
  canvas.className='awards-true3d-canvas awards-world-true3d';
  canvas.style.cssText='display:block;width:100%;height:100%;min-height:220px;pointer-events:none';canvas.setAttribute('aria-hidden','true');root.replaceChildren(canvas);
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true})||canvas.getContext('webgl',{alpha:true,antialias:true});if(!gl)throw new Error('WORLD_WEBGL_REQUIRED');
  const p=program(gl),gpu=upload(gl,built);gl.useProgram(p);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);bind(gl,p,gpu);
  const uv=gl.getUniformLocation(p,'u_view'),up=gl.getUniformLocation(p,'u_proj'),us=gl.getUniformLocation(p,'u_spin'),ut=gl.getUniformLocation(p,'u_tilt');
  let state='FOREGROUND_REST',phase='rest',destroyed=false,raf=0,start=performance.now(),sig=-1;
  const reduced=options.reducedMotion??matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  function resize(){const d=Math.min(2,devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);return w/h}
  function draw(t){
    if(destroyed)return;const aspect=resize(),elapsed=(t-start)/1000,st=sig<0?99:(t-sig)/1000,resolve=reduced?(sig>=0?1:0):(sig>=0?Math.min(1,st/1.15)*Math.max(0,Math.min(1,(3.45-st)/.8)):0);
    if(sig>=0&&st>3.7){sig=-1;phase='rest';state='FOREGROUND_IDLE'}
    const restDrift=.035*Math.sin(elapsed*.16),spin=-.04+restDrift-resolve*.28,tilt=-.13+resolve*.055;
    gl.clearColor(.006,.014,.024,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uv,false,lookAt([0,.02,3.15],[0,0,0]));gl.uniformMatrix4fv(up,false,perspective(CONTRACT.compositionProfile.fovDegrees*Math.PI/180,aspect,.08,20));gl.uniform1f(us,spin);gl.uniform1f(ut,tilt);
    gl.drawElements(gl.TRIANGLES,gpu.count,gl.UNSIGNED_SHORT,0);raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  function S(x){if(!CONTRACT.lifecycle.includes(x))throw new Error('WORLD_INVALID_STATE');state=x;return x}
  function playSignature(){S('SIGNATURE_PLAY');phase='audralia-orbit-reveal';sig=performance.now();return sig}
  function selectResponse(){S('SELECT_RESPONSE')}
  function readerOpen(){S('READER_OPEN')}
  function restore(){S('RETURN_RESTORING');sig=-1;phase='rest';setTimeout(()=>{if(!destroyed)S('FOREGROUND_REST')},reduced?0:250)}
  function setLifecycle(x){S(x)}
  function inspect(){return Object.freeze({contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:1,renderer:CONTRACT.renderer,recognizableObject:CONTRACT.recognizableObject,signatureEvent:CONTRACT.signatureEvent,eventCount:1,planetarySphere:true,audraliaCoastVisible:true,atmosphereRim:true,shorelineSampleCount:built.shorelineSampleCount,landStampCount:built.landStampCount,coastRibbonSegments:built.coastRibbonSegments,compositionProfile:CONTRACT.compositionProfile,sourceBinding:CONTRACT.sourceBinding})}
  function destroy(){destroyed=true;cancelAnimationFrame(raf);for(const k of['p','n','c','i'])gl.deleteBuffer(gpu[k]);gl.deleteProgram(p);gl.getExtension('WEBGL_lose_context')?.loseContext();root.replaceChildren()}
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:canvas});
}
export{CONTRACT as AWARDS_WORLD_CYCLE_B_CONTRACT};
