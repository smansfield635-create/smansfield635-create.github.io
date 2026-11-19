/*
 * C3/A5 Gen3422 — Native Generosity Harvest scene candidate.
 * Exact admitted consumer file; HELD, not published. No private S4/S5/S6/S7
 * master, atlas, eye, morph, binary, source-derived public derivative or surrogate.
 * The native rabbit's verified source and artistic C1 integration are separate.
 * Living Constellation and first-party E1 remain untouched.
 */
import { createNativeWebGLDevice } from "../../assets/engine/dgb.native-webgl-device.v1.mjs";

export const HARVEST_BOUNDARY = Object.freeze({
  project: "NINE_SUMMITS_GENEROSITY_HARVEST",
  registration: "HELD",
  architecture: "ONE_NATIVE_WEBGL_CONTEXT",
  rabbit: "PRIVATE_S4_S6_S7_NOT_INCLUDED",
  artwork: "ORIGINAL_HARVEST_COMPOSITION_PROTECTED",
  deepForage: "S11_S12_S13_REJECTED",
  artisticC1: "HOLD",
  worldUp: "Y",
  rabbitSourceToWorld: "[x,z,-y]",
  protectedSoles: Object.freeze([2659, 2747, 5581, 5821]),
  proposedRabbitAnchor: Object.freeze([2.25, 0.42, 4.0])
});

const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const length3 = (v) => Math.hypot(v[0], v[1], v[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const unit = (v) => { const l = length3(v) || 1; return [v[0]/l, v[1]/l, v[2]/l]; };
const hash = (n) => { const v = Math.sin(n * 127.1 + 78.233) * 43758.5453; return v - Math.floor(v); };
const riverAt = (x) => -1.15 + .78 * Math.sin(x * .29 + .4);
const pathAt = (z) => 3.65 + .46 * Math.sin(z * .19);
function ground(x, z) {
  const b = -.12 + .15*Math.sin(x*.37)*Math.cos(z*.3) + .055*Math.sin(x*.95 + z*.7);
  const d = Math.abs(z - riverAt(x));
  return b - .48 * clamp((2.35 - d)/1.85, 0, 1);
}
function pathHeight(z) {
  const x = pathAt(z);
  const base = ground(x, z) + .09;
  const nearBridge = clamp((3.35 - Math.abs(z + 1.16))/2.2, 0, 1);
  return mix(base, .54, nearBridge);
}

function buildWorld() {
  const positions = [], normals = [], colors = [], roles = [];
  function triangle(a, b, c, rgb, role = 0) {
    const n = unit(cross(sub(b, a), sub(c, a)));
    if (length3(cross(sub(b, a), sub(c, a))) < 1e-8) return;
    for (const p of [a, b, c]) {
      positions.push(p[0], p[1], p[2]);
      normals.push(n[0], n[1], n[2]);
      colors.push(rgb[0], rgb[1], rgb[2]);
      roles.push(role);
    }
  }
  function quad(a, b, c, d, rgb, role=0) {
    triangle(a,b,c,rgb,role); triangle(a,c,d,rgb,role);
  }
  function box(x,y,z, sx,sy,sz, col,role=0) {
    const x0=x-sx/2,x1=x+sx/2,y0=y-sy/2,y1=y+sy/2,z0=z-sz/2,z1=z+sz/2;
    const a=[x0,y0,z0],b=[x1,y0,z0],c=[x1,y0,z1],d=[x0,y0,z1];
    const e=[x0,y1,z0],f=[x1,y1,z0],g=[x1,y1,z1],h=[x0,y1,z1];
    // Exterior-facing normals. The prior six surfaces had reversed winding.
    quad(e,f,b,a,col,role);quad(f,g,c,b,col,role);
    quad(g,h,d,c,col,role);quad(h,e,a,d,col,role);
    quad(h,g,f,e,col,role);quad(a,b,c,d,col,role);
  }
  function beam(a,b,r,col,sides=7,role=0) {
    const axis=unit(sub(b,a)), right=unit(cross(axis,Math.abs(axis[1])>.92?[1,0,0]:[0,1,0])), up=unit(cross(axis,right));
    const ring=(pt,ang)=>[pt[0]+r*(right[0]*Math.cos(ang)+up[0]*Math.sin(ang)),pt[1]+r*(right[1]*Math.cos(ang)+up[1]*Math.sin(ang)),pt[2]+r*(right[2]*Math.cos(ang)+up[2]*Math.sin(ang))];
    for(let i=0;i<sides;i++){const t=i*TAU/sides,q=(i+1)*TAU/sides;quad(ring(a,t),ring(a,q),ring(b,q),ring(b,t),col,role);}
  }
  function ellipsoid(center,rx,ry,rz,col,lat=6,lon=9,role=0) {
    const point=(theta,phi)=>[center[0]+rx*Math.cos(theta)*Math.cos(phi),center[1]+ry*Math.sin(theta),center[2]+rz*Math.cos(theta)*Math.sin(phi)];
    for(let j=0;j<lat;j++){
      const t0=-Math.PI/2+j*Math.PI/lat,t1=-Math.PI/2+(j+1)*Math.PI/lat;
      for(let i=0;i<lon;i++){const p=i*TAU/lon,q=(i+1)*TAU/lon;
        quad(point(t1,p),point(t1,q),point(t0,q),point(t0,p),col,role);
      }
    }
  }
  // Undulating dimensional ground, with genuine lowered river valley.
  const nx=46,nz=36;
  for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){
    const x=-12+i*24/nx,z=-10+j*20/nz,dx=24/nx,dz=20/nz;
    const col=hash(i*13+j*17)>.53?[.33,.49,.27]:[.38,.53,.31];
    quad([x,ground(x,z),z],[x,ground(x,z+dz),z+dz],[x+dx,ground(x+dx,z+dz),z+dz],[x+dx,ground(x+dx,z),z],col);
  }
  // Flowing water crosses the landscape and passes under the timber bridge.
  const water=(x,side)=>[x,-.13,riverAt(x)+side*1.05];
  for(let i=0;i<95;i++){
    const x=-12+i*24/95,n=-12+(i+1)*24/95;
    quad(water(x,-1),water(x,1),water(n,1),water(n,-1),[.27,.60,.63],2);
    if(i%5===0){const z=riverAt(x)-.25;beam([x,-.115,z],[x+.35,-.11,z+.04],.012,[.75,.87,.79],4,2);}
  }
  // Raised winding walkway, legible from near and distant camera positions.
  for(let j=0;j<94;j++){
    const z=-10+j*20/94,z1=-10+(j+1)*20/94;
    const p=(zz,side)=>[pathAt(zz)+side*.68,pathHeight(zz),zz];
    quad(p(z,-1),p(z1,-1),p(z1,1),p(z,1),[.69,.55,.37]);
  }
  // Genuine planked bridge deck, two lateral railings, four end supports.
  for(let z=-3.55;z<1.35;z+=.32){
    box(pathAt(z),.55,z,1.63,.15,.28,[.48+.04*hash(z),.32,.18]);
  }
  for(const side of [-1,1]){
    for(let z=-3.6;z<=1.36;z+=1.12){
      const x=pathAt(z)+side*.84;
      beam([x,-.30,z],[x,1.32,z],.075,[.42,.27,.17],8);
    }
    for(const y of [.83,1.26]){
      let previous=null;
      for(let z=-3.6;z<=1.4;z+=.3){
        const p=[pathAt(z)+side*.84,y,z];
        if(previous)beam(previous,p,.055,[.48,.32,.20],6);
        previous=p;
      }
    }
  }
  // Two long sections of path fencing, without overwriting the bridge.
  for(const side of [1]){
    for(let z=-9;z<9;z+=1.75) {
      if(z>-4.2&&z<2.1)continue;
      const x=pathAt(z)+side*2.05,y=ground(x,z);
      beam([x,y,z],[x,y+1.12,z],.085,[.51,.32,.19],7);
      const next=z+1.75;
      if(next>-4.2&&z<2.1)continue;
      const nx=pathAt(next)+side*2.05,ny=ground(nx,next);
      for(const offset of [.42,.87])beam([x,y+offset,z],[nx,ny+offset,next],.052,[.57,.37,.22],6);
    }
  }
  // Old fruit trees with dimensional trunks, limbs, crowns and fruit.
  const trees=[[-8,-6,1.12],[-4,-7,1.00],[8,-6,1.1],[-9,5,.92],[8,6,.88],[-5,7,.9]];
  for(const [x,z,s] of trees){
    const y=ground(x,z), top=y+2.95*s;
    beam([x,y,z],[x+.12*s,top,z],.23*s,[.41,.28,.19],10);
    for(let k=0;k<5;k++){
      const a=k*TAU/5+.1,dir=[Math.cos(a),0,Math.sin(a)];
      beam([x,top-.65*s,z],[x+dir[0]*1.25*s,top+.12*s,z+dir[2]*1.25*s],.085*s,[.44,.32,.19],7);
    }
    for(let k=0;k<7;k++){
      const a=k*TAU/7,px=x+Math.cos(a)*.94*s,pz=z+Math.sin(a)*.79*s;
      ellipsoid([px,top+.35*s+.26*Math.sin(k*2.6),pz],1.06*s,.9*s,.91*s,k%3?[.37,.53,.29]:[.46,.60,.32],6,10,1);
    }
    for(let k=0;k<12;k++){
      const a=TAU*hash(k*3+x*17),spread=.58+hash(k*8+z)*1.02;
      ellipsoid([x+Math.cos(a)*spread*s,top+.10*s+.59*hash(k+z),z+Math.sin(a)*spread*s],.115*s,.12*s,.115*s,k%2?[.83,.42,.18]:[.91,.64,.22],4,6,1);
    }
  }
  // Low cereal grasses, flowering understory and orchard plants.
  for(let i=0;i<245;i++){
    const x=-11+hash(i*1.73)*22,z=-9+hash(i*2.91+4)*18;
    if(Math.abs(z-riverAt(x))<1.65||Math.abs(x-pathAt(z))<1.14)continue;
    const y=ground(x,z),h=.25+.48*hash(i*5.71);
    triangle([x-.045,y,z],[x+.045,y,z],[x+.08*h,y+h,z+.07*h],i%3?[.49,.62,.31]:[.69,.68,.37],1);
    triangle([x,y,z-.04],[x,y,z+.04],[x+.05*h,y+h*.85,z-.03*h],[.37,.56,.29],1);
  }
  for(let i=0;i<110;i++){
    const x=-10.5+hash(i*9.12)*21,z=-8.8+hash(i*4.87+9)*17.6;
    if(Math.abs(z-riverAt(x))<1.5||Math.abs(x-pathAt(z))<.95)continue;
    const y=ground(x,z),h=.30+hash(i*2.2)*.42;
    beam([x,y,z],[x+.06,y+h,z],.018,[.32,.48,.25],5,1);
    const floral=i%4===0?[.87,.49,.35]:i%4===1?[.96,.80,.48]:i%4===2?[.89,.68,.76]:[.92,.85,.62];
    for(let k=0;k<5;k++){
      const a=k*TAU/5;
      ellipsoid([x+.06+Math.cos(a)*.12,y+h,z+Math.sin(a)*.12],.095,.045,.075,floral,3,5,1);
    }
    ellipsoid([x+.06,y+h+.015,z],.055,.05,.055,[.71,.45,.18],4,6,1);
  }
  // Perched blue bird on the orchard fence.
  const bx=pathAt(5.05)+2.05,bz=5.05,by=ground(bx,bz)+1.19;
  ellipsoid([bx,by+.13,bz],.26,.18,.17,[.24,.49,.67],6,10);
  ellipsoid([bx-.17,by+.24,bz],.14,.13,.13,[.24,.55,.73],5,8);
  ellipsoid([bx+.07,by+.15,bz+.13],.14,.07,.06,[.17,.37,.55],4,7);
  triangle([bx-.3,by+.27,bz],[bx-.46,by+.22,bz-.055],[bx-.3,by+.20,bz-.11],[.90,.68,.32]);
  ellipsoid([bx-.23,by+.26,bz+.105],.018,.018,.018,[.07,.10,.12],3,5);
  // Distant birds: true 3D geometry, gently translated in the vertex shader.
  for(let i=0;i<6;i++){
    const x=-8+i*2.9,y=5.5+hash(i*8)*1.6,z=-7.5+hash(i*3.11)*2;
    beam([x,y,z],[x-.4,y+.16,z-.08],.028,[.34,.42,.39],4,3);
    beam([x,y,z],[x+.4,y+.16,z+.08],.028,[.34,.42,.39],4,3);
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    roles: new Float32Array(roles),
    triangleCount: positions.length/9
  };
}

function perspective(fov, aspect, near, far) {
  const f=1/Math.tan(fov/2),d=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*d,-1,0,0,2*far*near*d,0]);
}
function lookAt(eye,target){
  const z=unit(sub(eye,target)),x=unit(cross([0,1,0],z)),y=cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
}
function mul(a,b){
  const o=new Float32Array(16);
  for(let col=0;col<4;col++)for(let row=0;row<4;row++){
    let v=0;for(let k=0;k<4;k++)v+=a[k*4+row]*b[col*4+k];o[col*4+row]=v;
  }
  return o;
}
const vertexSource=[
"attribute vec3 a_position;",
"attribute vec3 a_normal;",
"attribute vec3 a_color;",
"attribute float a_role;",
"uniform mat4 u_viewProjection;",
"uniform vec3 u_eye;",
"uniform float u_time;",
"varying vec3 v_color;",
"varying vec3 v_normal;",
"varying float v_fog;",
"void main(){",
"  vec3 p=a_position;",
"  if(a_role>0.5 && a_role<1.5){p.x+=0.052*sin(u_time*1.2+p.z*1.4+p.y*2.0)*max(0.0,p.y+0.2);}",
"  if(a_role>1.5 && a_role<2.5){p.y+=0.028*sin(u_time*2.0+p.x*1.9+p.z*2.1);}",
"  if(a_role>2.5){p.x+=0.30*sin(u_time*0.5+p.z*0.7);p.y+=0.10*sin(u_time*1.1+p.x);}",
"  gl_Position=u_viewProjection*vec4(p,1.0);",
"  v_normal=a_normal; v_color=a_color;",
"  v_fog=clamp((distance(p,u_eye)-13.0)/31.0,0.0,0.52);",
"}"
].join("\n");
const fragmentSource=[
"precision mediump float;",
"varying vec3 v_color;",
"varying vec3 v_normal;",
"varying float v_fog;",
"void main(){",
"  vec3 sun=normalize(vec3(-0.42,0.88,0.33));",
"  float light=0.63+0.37*max(0.0,dot(normalize(v_normal),sun));",
"  vec3 surface=v_color*light;",
"  surface=mix(surface,vec3(0.67,0.75,0.68),v_fog);",
"  gl_FragColor=vec4(surface,1.0);",
"}"
].join("\n");

export function startHarvest(canvas, controls = {}) {
  if (!canvas || typeof canvas.getContext !== "function") throw new TypeError("HARVEST_CANVAS_REQUIRED");
  let device;
  try { device=createNativeWebGLDevice(canvas,{backend:"WEBGL2",contextAttributes:{alpha:true,depth:true,antialias:true}}); }
  catch(e) {
    if(!String(e.message).includes("WEBGL2_CONTEXT_UNAVAILABLE"))throw e;
    device=createNativeWebGLDevice(canvas,{backend:"WEBGL1",contextAttributes:{alpha:true,depth:true,antialias:true}});
  }
  const gl=device.gl;
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
  const geometry=buildWorld();
  const program=device.createProgram({vertexSource,fragmentSource});
  const mesh=device.createMesh({attributes:[
    {name:"a_position",size:3,data:geometry.positions},
    {name:"a_normal",size:3,data:geometry.normals},
    {name:"a_color",size:3,data:geometry.colors},
    {name:"a_role",size:1,data:geometry.roles}
  ],vertexCount:geometry.positions.length/3});
  // Uniform locations belong to a specific linked GPU program; E1 recreates
  // programs on context restoration, so never retain locations across handles.
  let uniformProgram=null,uniforms=null;
  function currentUniforms(handle){
    if(handle!==uniformProgram){
      uniformProgram=handle;
      uniforms={
        vp:gl.getUniformLocation(handle,"u_viewProjection"),
        eye:gl.getUniformLocation(handle,"u_eye"),
        time:gl.getUniformLocation(handle,"u_time")
      };
    }
    return uniforms;
  }
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state={yaw:.48,elevation:.49,distance:25.5,phase:0,paused:reduced,disposed:false,drag:null,pinch:null,raf:0,last:0};
  const activePointers=new Map();
  function draw(now=0) {
    state.raf=0;
    if(state.disposed||document.hidden||device.status().lost||gl.isContextLost?.())return;
    if(!state.paused&&!reduced&&state.last)state.phase+=Math.min(.06,Math.max(0,(now-state.last)/1000));
    state.last=now;
    const rect=canvas.getBoundingClientRect();
    const density=Math.min(window.devicePixelRatio||1,rect.width<700?1.45:1.8);
    const w=Math.max(1,Math.round(rect.width*density)),h=Math.max(1,Math.round(rect.height*density));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    device.viewport(w,h);
    gl.clearColor(.67,.77,.71,0); gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const eye=[Math.sin(state.yaw)*Math.cos(state.elevation)*state.distance,
      Math.sin(state.elevation)*state.distance,Math.cos(state.yaw)*Math.cos(state.elevation)*state.distance];
    const view=lookAt(eye,[0,.6,-.75]);
    const vp=mul(perspective(.80,w/h,.12,90),view);
    try {
      device.draw({program,mesh,beforeDraw(context,handle){
        const active=currentUniforms(handle);
        context.uniformMatrix4fv(active.vp,false,vp);
        context.uniform3fv(active.eye,new Float32Array(eye));
        context.uniform1f(active.time,state.phase);
      }});
    } catch(error) {
      // The GPU can become lost between the frame guard and the device draw.
      if(gl.isContextLost?.()||device.status().lost)return;
      throw error;
    }
    if(!state.paused&&!reduced)schedule();
  }
  function schedule(){if(!state.disposed&&!state.raf&&!document.hidden)state.raf=requestAnimationFrame(draw);}
  function reset(){state.yaw=.48;state.elevation=.49;state.distance=25.5;state.last=0;schedule();}
  function onDown(e){
    if(e.button!==0&&e.pointerType!=="touch")return;
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    canvas.setPointerCapture?.(e.pointerId);
    state.drag=null;
    if(activePointers.size===1)state.drag={id:e.pointerId,x:e.clientX,y:e.clientY};
    if(activePointers.size===2){
      const [a,b]=[...activePointers.values()];
      state.pinch={gap:Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)),distance:state.distance};
    }
  }
  function onMove(e){
    if(!activePointers.has(e.pointerId))return;
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activePointers.size===2){
      const [a,b]=[...activePointers.values()];
      const gap=Math.hypot(b.x-a.x,b.y-a.y);
      if(state.pinch&&gap>1){
        state.distance=clamp(state.pinch.distance*state.pinch.gap/gap,16,36);
        schedule();
      }
      return;
    }
    if(!state.drag||state.drag.id!==e.pointerId)return;
    const dx=e.clientX-state.drag.x,dy=e.clientY-state.drag.y;
    state.yaw+=dx*.006;state.elevation=clamp(state.elevation+dy*.004,.18,1.05);
    state.drag={id:e.pointerId,x:e.clientX,y:e.clientY};schedule();
  }
  function onUp(e){
    activePointers.delete(e.pointerId);
    state.drag=null;state.pinch=null;
    if(activePointers.size===1){
      const [id,point]=activePointers.entries().next().value;
      state.drag={id,x:point.x,y:point.y};
    }
  }
  function onWheel(e){e.preventDefault();state.distance=clamp(state.distance*Math.exp(e.deltaY*.0008),16,36);schedule();}
  function onKey(e){
    const key=e.key;
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-"].includes(key))e.preventDefault();
    if(key==="ArrowLeft")state.yaw-=.11;
    if(key==="ArrowRight")state.yaw+=.11;
    if(key==="ArrowUp")state.elevation=clamp(state.elevation-.08,.18,1.05);
    if(key==="ArrowDown")state.elevation=clamp(state.elevation+.08,.18,1.05);
    if(key==="+")state.distance=clamp(state.distance-1.2,16,36);
    if(key==="-")state.distance=clamp(state.distance+1.2,16,36);
    schedule();
  }
  const motion=controls.motion,resetButton=controls.reset,status=controls.status;
  function label(){
    if(motion){motion.textContent=reduced?"Reduced motion":state.paused?"Resume world motion":"Pause world motion";
      motion.disabled=reduced;motion.setAttribute("aria-pressed",String(state.paused));}
  }
  function onMotion(){state.paused=!state.paused;state.last=0;label();schedule();}
  function onVisibility(){state.last=0;schedule();}
  function onRestore(){
    // WebGL context restoration resets fixed-function GL state, even when E1
    // correctly rebuilds programs and buffers. Restore scene depth semantics.
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
    state.last=0;schedule();
  }
  function onResize(){schedule();}
  canvas.addEventListener("pointerdown",onDown);
  canvas.addEventListener("pointermove",onMove);
  canvas.addEventListener("pointerup",onUp);
  canvas.addEventListener("pointercancel",onUp);
  canvas.addEventListener("wheel",onWheel,{passive:false});
  canvas.addEventListener("keydown",onKey);
  canvas.addEventListener("webglcontextrestored",onRestore);
  document.addEventListener("visibilitychange",onVisibility);
  window.addEventListener("resize",onResize);
  motion?.addEventListener("click",onMotion);
  resetButton?.addEventListener("click",reset);
  if(status)status.textContent=device.backend+" native scene · "+geometry.triangleCount.toLocaleString()+" triangles · rabbit pending protected-source gate";
  label();schedule();
  return Object.freeze({
    backend:device.backend,triangleCount:geometry.triangleCount,reset,
    dispose(){
      if(state.disposed)return;
      state.disposed=true;if(state.raf)cancelAnimationFrame(state.raf);
      canvas.removeEventListener("pointerdown",onDown);canvas.removeEventListener("pointermove",onMove);
      canvas.removeEventListener("pointerup",onUp);canvas.removeEventListener("pointercancel",onUp);
      canvas.removeEventListener("wheel",onWheel);canvas.removeEventListener("keydown",onKey);
      canvas.removeEventListener("webglcontextrestored",onRestore);
      document.removeEventListener("visibilitychange",onVisibility);
      window.removeEventListener("resize",onResize);
      motion?.removeEventListener("click",onMotion);resetButton?.removeEventListener("click",reset);
      device.dispose();
    }
  });
}
if(typeof document!=="undefined") {
  const canvas=document.getElementById("harvest-scene");
  if(canvas) {
    try {
      startHarvest(canvas,{
        motion:document.getElementById("motion-toggle"),
        reset:document.getElementById("view-reset"),
        status:document.getElementById("scene-status")
      });
    } catch(e) {
      const status=document.getElementById("scene-status");
      if(status)status.textContent="Native scene unavailable: "+e.message;
      console.error("HARVEST_NATIVE_SCENE_BLOCKED",e);
    }
  }
}
