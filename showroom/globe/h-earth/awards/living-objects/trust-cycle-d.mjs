const LIFECYCLE=Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']);
const SIGNATURE_SECONDS=6.5;
const TERMINAL_COUNT=9;
const CONTRACT=Object.freeze({
  id:'AWARDS_TRUST_LIVING_OBJECT_ANCIENT_ENERGY_TREE_3D_V1',
  cycle:'D_TRUST',
  claim:'Software should have to earn the right to say it worked.',
  recognizableObject:'ANCIENT_ENERGY_TREE_3D',
  renderer:'WEBGL_STATIC_SKELETAL_TREE_SHADER_ENERGY',
  signatureEvent:'ROOT_TO_CROWN_EARNED_ENERGY_REVEAL',
  eventCount:1,
  terminalNodeCount:TERMINAL_COUNT,
  signatureSeconds:SIGNATURE_SECONDS,
  compositionProfile:Object.freeze({
    reference:'ANCIENT_ASYMMETRIC_ROOTED_TREE',
    cameraMode:'FRONTAL_OBLIQUE_TREE_PORTRAIT_IN_PANORAMIC_HOST',
    hostShape:'PANORAMIC_TREE_FIELD',
    responsiveRootCrownSeparation:true
  }),
  sourceBinding:Object.freeze({
    conceptualLineage:'CONSIDER_THE_ENERGY',
    donorPathAsserted:false,
    lineageExpression:Object.freeze(['EXPOSED_ROOTS','BRANCHING_TOPOLOGY','RESTRAINED_TEAL_ENERGY_FLOW','NINE_TERMINAL_ENERGY_POINTS'])
  }),
  construction:Object.freeze({
    geometry:'FIXED_3D_SKELETAL_GRAPH_TAPERED_TUBES_SPARSE_CANOPY',
    animation:'STATIC_GEOMETRY_SINGLE_ENERGY_PROGRESS_UNIFORM',
    geometryRebuiltPerFrame:false
  }),
  lifecycle:LIFECYCLE
});

const VS=`attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute float a_progress;
attribute float a_kind;
uniform float u_yaw,u_pitch,u_scale,u_aspect,u_cam,u_energy,u_rest,u_pulse,u_sway,u_time,u_settle;
varying vec3 v_n;
varying vec4 v_c;
varying float v_progress;
varying float v_kind;
varying vec3 v_world;
void main(){
  float cy=cos(u_yaw),sy=sin(u_yaw),cx=cos(u_pitch),sx=sin(u_pitch);
  vec3 p=a_position;
  float crown=smoothstep(.15,2.25,p.y);
  p.x+=sin(u_time*.00024+p.y*2.3+p.z*1.7)*u_sway*crown*.026;
  p.z+=cos(u_time*.00019+p.x*1.8+p.y*1.4)*u_sway*crown*.018;
  p.y-=.56;
  vec3 n=a_normal;
  p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);
  n=vec3(cy*n.x+sy*n.z,n.y,-sy*n.x+cy*n.z);
  p=vec3(p.x,cx*p.y-sx*p.z,sx*p.y+cx*p.z);
  n=vec3(n.x,cx*n.y-sx*n.z,sx*n.y+cx*n.z);
  float settleScale=mix(.91,1.0,u_settle);
  p*=u_scale*settleScale;
  float z=max(.8,p.z+u_cam);
  gl_Position=vec4(p.x*1.82/u_aspect,p.y*1.82,z-1.05,z);
  v_n=normalize(n);
  v_c=a_color;
  v_progress=a_progress;
  v_kind=a_kind;
  v_world=p;
}`;
const FS=`precision mediump float;
varying vec3 v_n;
varying vec4 v_c;
varying float v_progress;
varying float v_kind;
varying vec3 v_world;
uniform float u_energy,u_rest,u_pulse,u_time;
void main(){
  vec3 N=normalize(v_n);
  vec3 L=normalize(vec3(-.42,.78,-.48));
  vec3 R=normalize(vec3(.55,.20,.74));
  float diffuse=.25+.62*max(0.0,dot(N,L));
  float rim=.16*pow(1.0-max(0.0,dot(N,R)),2.0);
  vec3 base=v_c.rgb*(diffuse+rim);
  float reached=smoothstep(v_progress-.025,v_progress+.018,u_energy);
  float front=1.0-smoothstep(.00,.060,abs(u_energy-v_progress));
  float rootRest=u_rest*(1.0-smoothstep(.12,.22,v_progress));
  float terminal=step(1.5,v_kind)*reached;
  float circulation=step(.985,u_energy)*(.5+.5*sin(u_time*.00075-v_progress*19.0))*reached;
  float glow=clamp(reached*.17+front*.72+rootRest*.34+terminal*.48+circulation*.06+u_pulse*(1.0-smoothstep(.34,.62,v_progress))*.46,0.0,1.0);
  vec3 teal=vec3(.20,.92,.76);
  vec3 warm=vec3(.68,.52,.26);
  vec3 lit=mix(base,teal,glow);
  lit+=warm*u_pulse*terminal*.10;
  gl_FragColor=vec4(lit,v_c.a);
}`;

function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const message=gl.getShaderInfoLog(shader)||'UNKNOWN_SHADER_FAILURE';
    gl.deleteShader(shader);
    throw new Error(`TRUST_TREE_SHADER:${message}`);
  }
  return shader;
}
function program(gl){
  const vs=compile(gl,gl.VERTEX_SHADER,VS),fs=compile(gl,gl.FRAGMENT_SHADER,FS),p=gl.createProgram();
  gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);
  gl.deleteShader(vs);gl.deleteShader(fs);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS)){
    const message=gl.getProgramInfoLog(p)||'UNKNOWN_LINK_FAILURE';
    gl.deleteProgram(p);
    throw new Error(`TRUST_TREE_PROGRAM:${message}`);
  }
  return p;
}

function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]}
function add(a,b){return[a[0]+b[0],a[1]+b[1],a[2]+b[2]]}
function mul(a,s){return[a[0]*s,a[1]*s,a[2]*s]}
function len(a){return Math.hypot(a[0],a[1],a[2])||1}
function norm(a){const l=len(a);return[a[0]/l,a[1]/l,a[2]/l]}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}

function mesh(){
  return{positions:[],normals:[],colors:[],progress:[],kinds:[],indices:[]};
}
function vertex(g,p,n,c,progress,kind){
  const id=g.positions.length/3;
  g.positions.push(...p);g.normals.push(...n);g.colors.push(...c);g.progress.push(progress);g.kinds.push(kind);
  return id;
}
function tube(g,a,b,r0,r1,p0,p1,color,kind=0,sides=8,seed=0){
  const axis=norm(sub(b,a));
  const ref=Math.abs(axis[1])>.82?[1,0,0]:[0,1,0];
  const u=norm(cross(axis,ref)),v=norm(cross(axis,u));
  const base=g.positions.length/3;
  for(let end=0;end<2;end++){
    const center=end?b:a,r=end?r1:r0,prog=end?p1:p0;
    for(let s=0;s<sides;s++){
      const angle=Math.PI*2*s/sides;
      const irregular=1+.09*Math.sin(seed*1.73+s*2.11+end*.83)+.035*Math.cos(seed*.91+s*3.07);
      const radial=add(mul(u,Math.cos(angle)),mul(v,Math.sin(angle)));
      const pos=add(center,mul(radial,r*irregular));
      vertex(g,pos,radial,color,prog,kind);
    }
  }
  for(let s=0;s<sides;s++){
    const n=(s+1)%sides,a0=base+s,a1=base+n,b0=base+sides+s,b1=base+sides+n;
    g.indices.push(a0,b0,a1,a1,b0,b1);
  }
}
function ellipsoid(g,center,radii,color,progress,kind=1,lon=9,lat=5,seed=0){
  const base=g.positions.length/3;
  for(let y=0;y<=lat;y++){
    const phi=Math.PI*y/lat;
    for(let x=0;x<lon;x++){
      const theta=Math.PI*2*x/lon;
      const wobble=1+.06*Math.sin(seed*1.9+x*2.3+y*1.7);
      const nx=Math.sin(phi)*Math.cos(theta),ny=Math.cos(phi),nz=Math.sin(phi)*Math.sin(theta);
      const pos=[
        center[0]+nx*radii[0]*wobble,
        center[1]+ny*radii[1]*(1+.03*Math.cos(seed+y)),
        center[2]+nz*radii[2]*wobble
      ];
      const normal=norm([nx/Math.max(.001,radii[0]),ny/Math.max(.001,radii[1]),nz/Math.max(.001,radii[2])]);
      vertex(g,pos,normal,color,progress,kind);
    }
  }
  for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){
    const n=(x+1)%lon,a=base+y*lon+x,b=base+y*lon+n,c=base+(y+1)*lon+x,d=base+(y+1)*lon+n;
    g.indices.push(a,c,b,b,c,d);
  }
}
function buildTree(){
  const g=mesh();
  const bark=[.18,.115,.065,1],oldBark=[.125,.078,.045,1],rootBark=[.105,.073,.050,1];
  const leaf=[.035,.115,.082,1],leaf2=[.050,.145,.105,1],bud=[.075,.20,.145,1];
  const B=[0,-.82,0];
  const rootPaths=[
    [[-.48,-.90,.12],[-1.34,-1.06,.30],.23,.065],
    [[.43,-.91,.18],[1.30,-1.08,.38],.22,.060],
    [[-.24,-.91,-.20],[-.92,-1.09,-.55],.19,.052],
    [[.23,-.90,-.18],[.96,-1.06,-.50],.18,.050],
    [[-.05,-.91,.25],[-.20,-1.12,.78],.17,.045],
    [[.04,-.91,-.26],[.18,-1.12,-.82],.16,.043]
  ];
  rootPaths.forEach((r,i)=>{
    tube(g,B,r[0],r[2],r[2]*.55,.025,.075,rootBark,0,8,10+i);
    tube(g,r[0],r[1],r[2]*.55,r[3],.075,.152,rootBark,0,7,20+i);
  });

  const trunk=[
    [B,[-.13,-.27,.035],.36,.31,.154,.184],
    [[-.13,-.27,.035],[.045,.39,-.025],.31,.255,.184,.222],
    [[.045,.39,-.025],[-.09,1.00,.055],.255,.205,.222,.258],
    [[-.09,1.00,.055],[.035,1.53,-.035],.205,.16,.258,.287],
    [[.035,1.53,-.035],[-.045,1.89,.015],.16,.115,.287,.308]
  ];
  trunk.forEach((s,i)=>tube(g,s[0],s[1],s[2],s[3],s[4],s[5],i<2?oldBark:bark,0,9,30+i));

  const T2=[.045,.39,-.025],T3=[-.09,1.00,.055],T4=[.035,1.53,-.035],T5=[-.045,1.89,.015];
  const branches=[
    [T2,[-.72,.34,.10],[-1.34,.51,.18],[-1.83,.70,.28],.145,.078,.038],
    [T3,[-.64,.76,-.10],[-1.18,1.06,-.16],[-1.63,1.30,-.10],.13,.068,.034],
    [T4,[-.47,1.22,.12],[-.92,1.52,.18],[-1.32,1.78,.25],.115,.060,.032],
    [T5,[-.32,1.78,-.03],[-.57,2.02,.08],[-.75,2.25,.12],.10,.052,.030],
    [T5,[.03,2.04,.03],[.08,2.24,-.01],[.13,2.42,.02],.11,.056,.031],
    [T5,[.34,1.82,-.08],[.58,2.05,-.12],[.80,2.27,-.06],.10,.052,.030],
    [T4,[.52,1.31,.12],[1.00,1.59,.20],[1.40,1.85,.28],.12,.062,.033],
    [T3,[.68,.88,-.14],[1.23,1.13,-.21],[1.70,1.34,-.16],.135,.070,.035],
    [T2,[.79,.39,.08],[1.38,.59,.14],[1.90,.76,.20],.15,.080,.040]
  ];
  const terminals=[];
  branches.forEach((b,i)=>{
    const start=.318+i*.003,mid=.45+i*.003,end=.638;
    tube(g,b[0],b[1],b[4],b[5],start,mid,bark,0,8,50+i*3);
    tube(g,b[1],b[2],b[5],b[6],mid,.56,bark,0,7,51+i*3);
    tube(g,b[2],b[3],b[6],Math.max(.018,b[6]*.52),.56,end,bark,0,7,52+i*3);
    terminals.push(b[3]);
  });

  // Two dead/broken limbs give the crown visible age without texture dependence.
  tube(g,T3,[-.43,1.10,.43],.09,.052,.35,.50,oldBark,0,7,91);
  tube(g,[-.43,1.10,.43],[-.73,1.23,.64],.052,.031,.50,.61,oldBark,0,7,92);
  tube(g,T4,[.33,1.48,.48],.074,.043,.39,.55,oldBark,0,7,93);
  tube(g,[.33,1.48,.48],[.51,1.53,.63],.043,.027,.55,.62,oldBark,0,7,94);

  terminals.forEach((p,i)=>{
    const q=.66+i*(.202/(TERMINAL_COUNT-1));
    ellipsoid(g,p,[.072,.092,.068],bud,q,2,8,4,110+i);
  });

  const canopy=[
    [[-.98,1.63,.05],[.42,.34,.34],.872,0],
    [[-.55,1.93,.02],[.46,.36,.36],.888,1],
    [[-.08,2.12,.00],[.52,.38,.39],.904,2],
    [[.43,2.00,-.02],[.48,.36,.36],.920,3],
    [[.91,1.67,.04],[.45,.34,.34],.936,4],
    [[-1.33,1.24,-.02],[.34,.28,.30],.952,5],
    [[1.36,1.24,-.06],[.35,.28,.30],.968,6],
    [[.06,1.58,.12],[.58,.34,.41],.985,7]
  ];
  canopy.forEach((c,i)=>ellipsoid(g,c[0],c[1],i%2?leaf2:leaf,c[2],1,9,5,130+i));
  return g;
}

function upload(gl,g){
  if(g.positions.length/3>65535)throw new Error('TRUST_TREE_VERTEX_LIMIT');
  const gpu={count:g.indices.length};
  const sources=[['p',g.positions],['n',g.normals],['c',g.colors],['q',g.progress],['k',g.kinds]];
  for(const [key,data] of sources){
    const b=gl.createBuffer();gpu[key]=b;gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
  }
  gpu.i=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gpu.i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.indices),gl.STATIC_DRAW);
  return gpu;
}
function bind(gl,p,gpu){
  const attrs=[['a_position','p',3],['a_normal','n',3],['a_color','c',4],['a_progress','q',1],['a_kind','k',1]];
  for(const [name,key,size] of attrs){
    const loc=gl.getAttribLocation(p,name);
    gl.bindBuffer(gl.ARRAY_BUFFER,gpu[key]);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gpu.i);
}

const ACTIVE_BY_ROOT=new WeakMap();

export function mountTrustLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('TRUST_ROOT_REQUIRED');
  ACTIVE_BY_ROOT.get(root)?.destroy?.();
  const doc=root.ownerDocument||document,canvas=doc.createElement('canvas');
  canvas.className='awards-true3d-canvas awards-ancient-energy-tree-true3d';
  canvas.style.cssText='display:block;width:100%;height:100%;min-height:0;pointer-events:none';
  canvas.setAttribute('aria-hidden','true');
  canvas.dataset.trustObject='ANCIENT_ENERGY_TREE_3D';
  root.replaceChildren(canvas);

  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'high-performance'})||canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance'});
  if(!gl)throw new Error('TRUST_WEBGL_REQUIRED');
  const p=program(gl),gpu=upload(gl,buildTree());
  gl.useProgram(p);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);bind(gl,p,gpu);
  const U=name=>gl.getUniformLocation(p,name);
  const uniforms={
    yaw:U('u_yaw'),pitch:U('u_pitch'),scale:U('u_scale'),aspect:U('u_aspect'),cam:U('u_cam'),
    energy:U('u_energy'),rest:U('u_rest'),pulse:U('u_pulse'),sway:U('u_sway'),time:U('u_time'),settle:U('u_settle')
  };

  const reduced=options.reducedMotion??(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  let state='FOREGROUND_REST',phase='rest',destroyed=false,raf=0,timer=0,signatureStart=-1,settleStart=-1,pulseStart=-1,idleStart=-1;
  let completed=false,currentEnergy=0,resolvedTerminals=0,drawCount=0,lastAspect=1,lastDrawAt=0;
  const now=()=>typeof performance!=='undefined'?performance.now():Date.now();

  function cancelLoop(){if(raf){cancelAnimationFrame(raf);raf=0}if(timer){clearTimeout(timer);timer=0}}
  function resize(){
    const d=Math.min(1.75,typeof devicePixelRatio==='number'?devicePixelRatio:1);
    const w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
    gl.viewport(0,0,w,h);lastAspect=w/h;return lastAspect;
  }
  function signatureEnergy(t){
    if(signatureStart<0)return completed?1:0;
    return Math.max(0,Math.min(1,(t-signatureStart)/(SIGNATURE_SECONDS*1000)));
  }
  function terminalResolved(energy){
    let count=0;
    for(let i=0;i<TERMINAL_COUNT;i++)if(energy>=.66+i*(.202/(TERMINAL_COUNT-1)))count++;
    return count;
  }
  function render(t=now()){
    if(destroyed)return;
    const aspect=resize();
    let energy=completed?1:0,rest=0,pulse=0,sway=0,settle=1;
    if(settleStart>=0&&!reduced){
      settle=Math.max(0,Math.min(1,(t-settleStart)/850));
      if(settle>=1)settleStart=-1;
    }
    if(state==='SIGNATURE_PLAY'){
      energy=reduced?1:signatureEnergy(t);
      sway=reduced?0:.32;
      if(reduced||energy>=1){
        energy=1;completed=true;resolvedTerminals=TERMINAL_COUNT;signatureStart=-1;phase='idle';state='FOREGROUND_IDLE';idleStart=t;
      }
    }else if(state==='FOREGROUND_IDLE'){
      energy=1;sway=reduced?0:.62;
    }else if(state==='SELECT_RESPONSE'){
      energy=completed?1:.34;
      if(pulseStart>=0&&!reduced){
        const q=Math.max(0,Math.min(1,(t-pulseStart)/430));pulse=Math.sin(q*Math.PI);
        if(q>=1)pulseStart=-1;
      }else pulse=reduced?.45:0;
    }else if(state==='READER_OPEN'){
      energy=completed?1:0;
    }else if(state==='RETURN_RESTORING'){
      energy=completed?1:0;sway=0;
    }else{
      energy=completed?1:0;rest=completed?0:.72;
    }
    currentEnergy=energy;resolvedTerminals=terminalResolved(energy);
    const wide=aspect>=1.55,portrait=aspect<.9;
    const scale=wide?1.06:portrait?.72:.90;
    const cam=wide?4.28:portrait?4.95:4.58;
    const idleT=idleStart<0?0:t-idleStart;
    const yaw=-.245+(1-settle)*.13+(state==='FOREGROUND_IDLE'&&!reduced?.018*Math.sin(idleT/5200):0);
    const pitch=-.075+(1-settle)*.028;
    gl.clearColor(.003,.009,.010,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(uniforms.yaw,yaw);gl.uniform1f(uniforms.pitch,pitch);gl.uniform1f(uniforms.scale,scale);gl.uniform1f(uniforms.aspect,aspect);gl.uniform1f(uniforms.cam,cam);
    gl.uniform1f(uniforms.energy,energy);gl.uniform1f(uniforms.rest,rest);gl.uniform1f(uniforms.pulse,pulse);gl.uniform1f(uniforms.sway,sway);gl.uniform1f(uniforms.time,t);gl.uniform1f(uniforms.settle,settle);
    gl.drawElements(gl.TRIANGLES,gpu.count,gl.UNSIGNED_SHORT,0);drawCount++;lastDrawAt=t;
  }
  function shouldAnimate(t=now()){
    if(destroyed||doc.hidden||reduced)return false;
    if(state==='SIGNATURE_PLAY'||state==='FOREGROUND_IDLE')return true;
    if(state==='SELECT_RESPONSE'&&pulseStart>=0)return true;
    if(settleStart>=0&&t-settleStart<900)return true;
    return false;
  }
  function queue(){
    if(destroyed||raf||timer||!shouldAnimate())return;
    const slow=state==='FOREGROUND_IDLE';
    if(slow){
      timer=setTimeout(()=>{timer=0;if(!destroyed&&!raf)raf=requestAnimationFrame(loop)},72);
    }else raf=requestAnimationFrame(loop);
  }
  function loop(t){
    raf=0;if(destroyed)return;render(t);if(shouldAnimate(t))queue();
  }
  function paintOnce(){cancelLoop();render(now());if(shouldAnimate())queue()}
  function S(next){
    if(!LIFECYCLE.includes(next))throw new Error('TRUST_INVALID_STATE');
    state=next;canvas.dataset.trustState=next;return next;
  }
  function setLifecycle(next){
    if(destroyed)return next;
    if(next==='REAR_INERT'){
      S(next);phase='inert';cancelLoop();return next;
    }
    if(next==='APPROACHING'){
      S(next);phase='approaching';settleStart=now();paintOnce();return next;
    }
    if(next==='FOREGROUND_REST'){
      S(next);phase=completed?'completed-rest':'rest';paintOnce();return next;
    }
    if(next==='FOREGROUND_IDLE'){
      S(next);phase='idle';completed=true;currentEnergy=1;resolvedTerminals=TERMINAL_COUNT;idleStart=now();paintOnce();return next;
    }
    if(next==='READER_OPEN'){
      S(next);phase='reader';cancelLoop();render(now());return next;
    }
    if(next==='RETURN_RESTORING'){
      S(next);phase='restoring';cancelLoop();render(now());return next;
    }
    if(next==='SELECT_RESPONSE'){
      selectResponse();return next;
    }
    if(next==='SIGNATURE_PLAY'){
      playSignature();return next;
    }
    return next;
  }
  function playSignature(){
    if(destroyed)return null;
    S('SIGNATURE_PLAY');phase='root-to-crown';signatureStart=now();completed=false;resolvedTerminals=0;
    if(reduced){
      completed=true;currentEnergy=1;resolvedTerminals=TERMINAL_COUNT;signatureStart=-1;S('FOREGROUND_IDLE');phase='idle';render(now());
      return now();
    }
    paintOnce();return signatureStart;
  }
  function selectResponse(){
    if(destroyed)return null;
    S('SELECT_RESPONSE');phase='reinforcement-pulse';pulseStart=now();paintOnce();return pulseStart;
  }
  function readerOpen(){
    if(destroyed)return null;
    S('READER_OPEN');phase='reader';cancelLoop();render(now());return state;
  }
  function restore(){
    if(destroyed)return null;
    S('RETURN_RESTORING');phase='restoring';cancelLoop();render(now());return state;
  }
  function onVisibility(){
    if(destroyed)return;
    if(doc.hidden)cancelLoop();
    else{render(now());queue()}
  }
  doc.addEventListener?.('visibilitychange',onVisibility);
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(()=>{if(!destroyed){render(now());queue()}}):null;
  observer?.observe(canvas);

  let api;
  function inspect(){
    return Object.freeze({
      contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:destroyed?0:1,
      renderer:CONTRACT.renderer,recognizableObject:CONTRACT.recognizableObject,terminalNodeCount:TERMINAL_COUNT,
      resolvedTerminalCount:resolvedTerminals,signatureSeconds:SIGNATURE_SECONDS,energyProgress:Number(currentEnergy.toFixed(4)),
      completedSignature:completed,renderLoopActive:!!(raf||timer),drawCount,lastDrawAt:Number(lastDrawAt.toFixed(2)),
      geometryRebuiltPerFrame:false,staticGeometry:true,responsiveAspect:Number(lastAspect.toFixed(3)),
      conceptualLineage:CONTRACT.sourceBinding.conceptualLineage,donorPathAsserted:false,lifecycle:CONTRACT.lifecycle
    });
  }
  function destroy(){
    if(destroyed)return;
    destroyed=true;cancelLoop();observer?.disconnect();doc.removeEventListener?.('visibilitychange',onVisibility);
    for(const key of['p','n','c','q','k','i'])if(gpu[key])gl.deleteBuffer(gpu[key]);
    gl.deleteProgram(p);gl.getExtension('WEBGL_lose_context')?.loseContext();
    if(canvas.parentNode===root)root.replaceChildren();
    if(ACTIVE_BY_ROOT.get(root)===api)ACTIVE_BY_ROOT.delete(root);
  }
  api=Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:canvas});
  ACTIVE_BY_ROOT.set(root,api);
  render(now());
  return api;
}
export{CONTRACT as AWARDS_TRUST_CYCLE_D_CONTRACT};
export default mountTrustLivingObject;
