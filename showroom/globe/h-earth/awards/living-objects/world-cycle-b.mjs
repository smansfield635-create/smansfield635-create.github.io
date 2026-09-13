const CONTRACT=Object.freeze({
  id:'AWARDS_WORLD_LIVING_OBJECT_CELESTIAL_MIRRORLAND_V1',
  cycle:'B_WORLD',
  claim:'The browser can hold a world.',
  recognizableObject:'SUN_MOON_MIRRORLAND_WORLD',
  renderer:'WEBGL_SINGLE_CONTEXT_EXISTING_CONSTRUCT_ADOPTION',
  signatureEvent:'WORLD_CELESTIAL_THRESHOLD_RESOLVE',
  eventCount:1,
  implementationClass:'EXISTING_CONSTRUCT_ADOPTION',
  sourceBinding:Object.freeze({
    lawsCelestial:Object.freeze({
      path:'/laws/index.crystals.js',
      blob:'27577c49250f42b03d123f8105e1d55d59c3a4b4',
      contract:'DGB_LAWS_CRYSTALS_EXACT_TWO_OBJECT_RECONCILIATION_v2',
      solarMaterial:'AUTHORITY_SOLAR',
      lunarMaterial:'AUTHORITY_LUNAR',
      sharedSphereTopology:true
    }),
    mirrorland:Object.freeze({
      path:'/assets/compass/compass.mirrorland-window.js',
      blob:'f99d3ffedf7b7654d067d21d9363eb287877f852',
      contract:'DGB_COMPASS_MIRRORLAND_WINDOW_HARDENED_v2',
      paneCount:21
    }),
    crystals:Object.freeze({
      path:'/assets/compass/compass.crystals.js',
      blob:'cd2cbad0494852cc80c51959a6827407d037b8fb',
      contract:'DGB_COMPASS_CRYSTALS_SPHERICAL_CONSTELLATION_AND_CLUSTER_HARDENED_v4',
      geometryVocabulary:'RIGHT_HANDED_EUCLIDEAN_XYZ_CRYSTAL'
    })
  }),
  timeline:Object.freeze({
    durationMs:15000,
    reducedTransitionMs:120,
    phases:Object.freeze([
      Object.freeze({id:'SUN_LOCK',a:0,b:.2}),
      Object.freeze({id:'SUN_TO_MOON',a:.2,b:1/3}),
      Object.freeze({id:'MOON_LOCK',a:1/3,b:8/15}),
      Object.freeze({id:'MOON_TO_MIRRORLAND',a:8/15,b:2/3}),
      Object.freeze({id:'MIRRORLAND_LOCK',a:2/3,b:13/15}),
      Object.freeze({id:'MIRRORLAND_TO_SUN',a:13/15,b:1})
    ])
  }),
  lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const COLORS=Object.freeze({
  cyan:[87,210,231],blue:[67,112,204],violet:[133,83,201],amber:[226,164,79],rose:[198,85,132],
  paleCyan:[161,235,244],paleBlue:[143,181,234],paleViolet:[184,149,232],paleAmber:[239,202,132],paleRose:[229,151,185]
});

const PANES=Object.freeze([
  ['crown-left','paleCyan',[[240,46],[164,106],[204,168],[240,134]],.86],
  ['crown-right','paleViolet',[[240,46],[240,134],[278,168],[318,106]],.82],
  ['upper-left-edge','blue',[[164,106],[98,210],[154,246],[204,168]],.62],
  ['upper-right-edge','violet',[[318,106],[278,168],[326,246],[382,210]],.66],
  ['upper-center-left','cyan',[[204,168],[154,246],[216,268],[240,208],[240,134]],.78],
  ['upper-center-right','rose',[[240,134],[240,208],[264,268],[326,246],[278,168]],.76],
  ['mid-left-high','paleBlue',[[98,210],[66,332],[148,338],[154,246]],.56],
  ['mid-left-inner','violet',[[154,246],[148,338],[212,334],[216,268]],.72],
  ['mid-center','paleAmber',[[216,268],[212,334],[240,382],[268,334],[264,268],[240,208]],.90],
  ['mid-right-inner','cyan',[[264,268],[268,334],[332,338],[326,246]],.73],
  ['mid-right-high','blue',[[326,246],[332,338],[414,332],[382,210]],.57],
  ['lower-left-edge','rose',[[66,332],[82,470],[156,446],[148,338]],.58],
  ['lower-left-center','cyan',[[148,338],[156,446],[216,430],[240,382],[212,334]],.75],
  ['lower-right-center','violet',[[268,334],[240,382],[264,430],[324,446],[332,338]],.75],
  ['lower-right-edge','amber',[[332,338],[324,446],[398,470],[414,332]],.59],
  ['lower-left-deep','blue',[[82,470],[116,594],[192,530],[156,446]],.56],
  ['lower-center-left','paleViolet',[[156,446],[192,530],[240,624],[240,500],[216,430]],.82],
  ['lower-center-right','paleRose',[[264,430],[240,500],[240,624],[288,530],[324,446]],.82],
  ['lower-right-deep','cyan',[[324,446],[288,530],[364,594],[398,470]],.57],
  ['base-left','amber',[[116,594],[168,660],[240,676],[240,624],[192,530]],.72],
  ['base-right','blue',[[288,530],[240,624],[240,676],[312,660],[364,594]],.72]
]);

const FRAME=Object.freeze([
  [[240,34],[165,78],[104,144],[66,232],[48,350],[58,482],[96,590],[158,662],[240,694]],
  [[240,34],[315,78],[376,144],[414,232],[432,350],[422,482],[384,590],[322,662],[240,694]]
]);

const VS=`attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;
varying vec3 v_n;
varying vec3 v_c;
varying vec3 v_p;
void main(){
  vec4 world=u_model*vec4(a_position,1.0);
  vec4 view=u_view*world;
  v_n=mat3(u_model)*a_normal;
  v_c=a_color;
  v_p=world.xyz;
  gl_Position=u_proj*view;
}`;

const FS=`precision mediump float;
varying vec3 v_n;
varying vec3 v_c;
varying vec3 v_p;
uniform float u_alpha;
uniform float u_mode;
uniform float u_time;
uniform float u_solar;
float hash31(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
void main(){
  vec3 n=normalize(v_n);
  vec3 base=max(v_c,vec3(.015));
  float facing=max(0.0,n.z*.35+.65);
  float rim=pow(1.0-abs(n.z),2.0);
  vec3 color=base;
  if(u_mode<.5){
    if(u_solar>.5){
      float a=sin(dot(normalize(v_p),vec3(5.3,7.1,9.7))*3.1+u_time*.31);
      float b=sin(dot(normalize(v_p),vec3(-8.9,3.7,5.1))*4.7-u_time*.23);
      float gran=.5+.5*(a*.58+b*.42);
      color=mix(vec3(.78,.055,.006),vec3(1.0,.76,.16),clamp(.32+gran*.72,0.0,1.0));
      color*=1.15+.35*gran;
      color+=vec3(1.0,.29,.015)*rim*.42;
    }else{
      float crater=hash31(floor((normalize(v_p)+1.0)*17.0));
      float maria=smoothstep(.42,.88,.5+.5*sin(v_p.x*7.1+v_p.y*4.8-v_p.z*5.6));
      color=mix(vec3(.22,.23,.25),vec3(.68,.69,.72),.55*facing+.18);
      color*=.78+.20*crater-.16*maria;
      color+=vec3(.16,.17,.20)*rim*.18;
    }
  }else if(u_mode<1.5){
    float shimmer=.92+.10*sin(u_time*.62+v_p.x*2.7-v_p.y*1.9);
    color=base*shimmer+base*rim*.22;
  }else{
    float sparkle=.6+.4*sin(u_time*1.3+hash31(floor(v_p*12.0))*6.28318);
    color=base*(.86+.18*sparkle)+vec3(.12,.18,.24)*rim*.45;
  }
  gl_FragColor=vec4(color,clamp(u_alpha,0.0,1.0));
}`;

function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function smooth(t){t=clamp(t);return t*t*(3-2*t)}
function shader(gl,type,src){
  const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('WORLD_SHADER:'+gl.getShaderInfoLog(s));
  return s;
}
function program(gl){
  const p=gl.createProgram();
  const vs=shader(gl,gl.VERTEX_SHADER,VS),fs=shader(gl,gl.FRAGMENT_SHADER,FS);
  gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);
  gl.deleteShader(vs);gl.deleteShader(fs);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('WORLD_LINK:'+gl.getProgramInfoLog(p));
  return p;
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
    -(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]);
}
function model(tx,ty,tz,sx,sy,sz,ry=0){
  const c=Math.cos(ry),s=Math.sin(ry);
  return new Float32Array([c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,tx,ty,tz,1]);
}
function buildSphere(lat=24,lon=32){
  const p=[],n=[],c=[],idx=[];
  for(let y=0;y<=lat;y++){
    const v=y/lat,phi=v*Math.PI,sp=Math.sin(phi),cp=Math.cos(phi);
    for(let x=0;x<=lon;x++){
      const u=x/lon,th=u*Math.PI*2,st=Math.sin(th),ct=Math.cos(th);
      const nx=sp*ct,ny=cp,nz=sp*st;
      p.push(nx,ny,nz);n.push(nx,ny,nz);c.push(1,.92,.48);
    }
  }
  for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){
    const a=y*(lon+1)+x,b=a+1,d=(y+1)*(lon+1)+x,e=d+1;
    idx.push(a,d,b,b,d,e);
  }
  return {p,n,c,idx};
}
function panePoint([x,y],z){return [(x-240)/174,(360-y)/174,z]}
function buildMirrorland(){
  const p=[],n=[],c=[],idx=[];
  const edges=[];
  for(let pi=0;pi<PANES.length;pi++){
    const [,colorName,points,depth]=PANES[pi],rgb=COLORS[colorName].map(v=>v/255),base=p.length/3,z=(depth-.72)*.16;
    for(const point of points){p.push(...panePoint(point,z));n.push(0,0,1);c.push(...rgb)}
    for(let i=1;i<points.length-1;i++)idx.push(base,base+i,base+i+1);
    for(let i=0;i<points.length;i++)edges.push([points[i],points[(i+1)%points.length]]);
  }
  return {pane:{p,n,c,idx},edges};
}
function quadForSegment(a,b,width,z,color,p,n,c,idx){
  const A=panePoint(a,z),B=panePoint(b,z),dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy)||1;
  const ox=-dy/l*width,oy=dx/l*width,base=p.length/3;
  p.push(A[0]+ox,A[1]+oy,z,A[0]-ox,A[1]-oy,z,B[0]+ox,B[1]+oy,z,B[0]-ox,B[1]-oy,z);
  for(let i=0;i<4;i++){n.push(0,0,1);c.push(...color)}
  idx.push(base,base+1,base+2,base+2,base+1,base+3);
}
function buildLeads(edges){
  const p=[],n=[],c=[],idx=[],lead=[.10,.12,.16];
  for(const [a,b] of edges)quadForSegment(a,b,.010,.035,lead,p,n,c,idx);
  for(const side of FRAME)for(let i=0;i<side.length-1;i++)quadForSegment(side[i],side[i+1],.025,.055,[.035,.045,.07],p,n,c,idx);
  quadForSegment([240,34],[240,694],.014,.060,[.07,.08,.12],p,n,c,idx);
  return {p,n,c,idx};
}
function buildCrystals(){
  const p=[],n=[],c=[],idx=[],palette=[[.55,.90,.96],[.72,.88,1],[1,.76,.42],[.96,.68,.46]];
  const centers=[[-1.17,.72,.12],[1.18,.62,.08],[-1.02,-.78,.06],[1.04,-.82,.10]];
  for(let q=0;q<centers.length;q++){
    const [cx,cy,cz]=centers[q],col=palette[q],base=p.length/3;
    const verts=[[0,.28,0],[-.16,0,.11],[.16,0,.11],[0,0,-.18],[0,-.28,0]];
    for(const [x,y,z] of verts){
      const nx=x,ny=y,nz=z,l=Math.hypot(nx,ny,nz)||1;
      p.push(cx+x,cy+y,cz+z);n.push(nx/l,ny/l,nz/l);c.push(...col);
    }
    idx.push(base,base+1,base+2,base,base+2,base+3,base,base+3,base+1,
             base+4,base+2,base+1,base+4,base+3,base+2,base+4,base+1,base+3);
  }
  return {p,n,c,idx};
}
function upload(gl,g){
  const o={count:g.idx.length};
  for(const[k,d]of[['p',g.p],['n',g.n],['c',g.c]]){
    o[k]=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o[k]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(d),gl.STATIC_DRAW);
  }
  o.i=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.idx),gl.STATIC_DRAW);
  return o;
}
function bind(gl,p,o){
  for(const[name,key,size]of[['a_position','p',3],['a_normal','n',3],['a_color','c',3]]){
    const loc=gl.getAttribLocation(p,name);gl.bindBuffer(gl.ARRAY_BUFFER,o[key]);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i);
}
function phaseAt(u){
  for(const ph of CONTRACT.timeline.phases)if(u>=ph.a&&u<ph.b)return ph;
  return CONTRACT.timeline.phases[0];
}
function transitionAmount(u,ph,reduced){
  if(!ph.id.includes('_TO_'))return 0;
  const raw=(u-ph.a)/(ph.b-ph.a);
  if(!reduced)return smooth(raw);
  const phaseMs=(ph.b-ph.a)*CONTRACT.timeline.durationMs;
  return smooth(clamp(raw*phaseMs/CONTRACT.timeline.reducedTransitionMs));
}

export function mountWorldLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('WORLD_ROOT_REQUIRED');
  const doc=root.ownerDocument||document,canvas=doc.createElement('canvas');
  canvas.className='awards-true3d-canvas awards-world-true3d';
  canvas.style.cssText='display:block;width:100%;height:100%;min-height:220px;pointer-events:none';
  canvas.setAttribute('aria-hidden','true');root.replaceChildren(canvas);
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:false})||canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl)throw new Error('WORLD_WEBGL_REQUIRED');

  const prog=program(gl),sphere=upload(gl,buildSphere()),mirror=buildMirrorland(),panes=upload(gl,mirror.pane),leads=upload(gl,buildLeads(mirror.edges)),crystals=upload(gl,buildCrystals());
  const resources=[sphere,panes,leads,crystals];
  gl.useProgram(prog);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);
  const um=gl.getUniformLocation(prog,'u_model'),uv=gl.getUniformLocation(prog,'u_view'),up=gl.getUniformLocation(prog,'u_proj');
  const ua=gl.getUniformLocation(prog,'u_alpha'),umode=gl.getUniformLocation(prog,'u_mode'),ut=gl.getUniformLocation(prog,'u_time'),us=gl.getUniformLocation(prog,'u_solar');

  const reduced=options.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  let state='FOREGROUND_REST',phase='SUN_LOCK',destroyed=false,raf=0,last=performance.now(),cycleMs=0,signatureUntil=0;
  const activeStates=new Set(['APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','RETURN_RESTORING']);

  function resize(){
    const d=Math.min(2,globalThis.devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));
    if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h}
    gl.viewport(0,0,w,h);return w/h;
  }
  function renderObject(gpu,m,a,mode,solar){
    if(a<=.001)return;
    bind(gl,prog,gpu);gl.uniformMatrix4fv(um,false,m);gl.uniform1f(ua,a);gl.uniform1f(umode,mode);gl.uniform1f(us,solar);
    gl.drawElements(gl.TRIANGLES,gpu.count,gl.UNSIGNED_SHORT,0);
  }
  function draw(t){
    if(destroyed)return;
    const dt=Math.min(50,Math.max(0,t-last));last=t;
    const active=activeStates.has(state);
    if(active)cycleMs=(cycleMs+dt)%CONTRACT.timeline.durationMs;
    const u=(cycleMs%CONTRACT.timeline.durationMs)/CONTRACT.timeline.durationMs,ph=phaseAt(u),x=transitionAmount(u,ph,reduced);
    phase=ph.id;
    const aspect=resize(),time=t/1000;
    gl.clearColor(.004,.007,.018,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uv,false,lookAt([0,.03,3.75],[0,0,0]));
    gl.uniformMatrix4fv(up,false,perspective(42*Math.PI/180,aspect,.08,30));
    gl.uniform1f(ut,time);

    let sun=0,moon=0,window=0;
    if(ph.id==='SUN_LOCK')sun=1;
    else if(ph.id==='SUN_TO_MOON'){sun=1-x;moon=x}
    else if(ph.id==='MOON_LOCK')moon=1;
    else if(ph.id==='MOON_TO_MIRRORLAND'){moon=1-x;window=x}
    else if(ph.id==='MIRRORLAND_LOCK')window=1;
    else if(ph.id==='MIRRORLAND_TO_SUN'){window=1-x;sun=x}

    const signature=t<signatureUntil?1:0;
    const rot=reduced?0:time*.055;
    const sphereScale=.86+.035*Math.sin(time*.42)*(reduced?0:1);
    if(sun>0){
      renderObject(sphere,model(0,0,0,sphereScale,sphereScale,sphereScale,rot),sun,0,1);
      renderObject(sphere,model(0,0,.015,sphereScale*1.085,sphereScale*1.085,sphereScale*1.085,rot),sun*(.13+.08*signature),0,1);
    }
    if(moon>0){
      renderObject(sphere,model(0,0,0,.84,.84,.84,-rot*.32),moon,0,0);
    }
    if(window>0){
      const reveal=smooth(window),scale=lerp(.30,1,reveal),z=lerp(-.42,.02,reveal);
      renderObject(panes,model(0,0,z,scale,scale,scale),reveal,1,0);
      renderObject(leads,model(0,0,z+.018,scale,scale,scale),reveal,2,0);
      renderObject(crystals,model(0,0,z+.04,lerp(.52,1,reveal),lerp(.52,1,reveal),lerp(.52,1,reveal),reduced?0:Math.sin(time*.18)*.06),reveal*.82,2,0);
    }
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);

  function setLifecycle(x){
    if(!CONTRACT.lifecycle.includes(x))throw new Error('WORLD_INVALID_STATE');
    state=x;return x;
  }
  function playSignature(){
    setLifecycle('SIGNATURE_PLAY');signatureUntil=performance.now()+(reduced?120:1650);return signatureUntil;
  }
  function selectResponse(){setLifecycle('SELECT_RESPONSE')}
  function readerOpen(){setLifecycle('READER_OPEN')}
  function restore(){
    setLifecycle('RETURN_RESTORING');
    const delay=reduced?0:250;
    setTimeout(()=>{if(!destroyed)setLifecycle('FOREGROUND_REST')},delay);
  }
  function inspect(){
    return Object.freeze({
      contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:1,renderLoopOwners:1,canvasCount:1,
      renderer:CONTRACT.renderer,recognizableObject:CONTRACT.recognizableObject,signatureEvent:CONTRACT.signatureEvent,eventCount:1,
      implementationClass:CONTRACT.implementationClass,timeline:CONTRACT.timeline,sourceBinding:CONTRACT.sourceBinding,
      sharedSphereTopology:true,mirrorlandPaneCount:PANES.length,persistentGpuAllocation:'MOUNT_ONLY',
      carouselTraversalAuthority:'EXTERNAL_PRESERVED',deterministicTeardown:true
    });
  }
  function destroy(){
    destroyed=true;cancelAnimationFrame(raf);
    for(const gpu of resources){for(const k of['p','n','c','i'])gl.deleteBuffer(gpu[k])}
    gl.deleteProgram(prog);gl.getExtension('WEBGL_lose_context')?.loseContext();root.replaceChildren();
  }
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:canvas});
}
export{CONTRACT as AWARDS_WORLD_CYCLE_B_CONTRACT};
