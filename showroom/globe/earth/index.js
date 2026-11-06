// /showroom/globe/earth/index.js
// ZIONTS_PASSIVE_ROTATING_PLANET_NARRATIVE_v1
// ZIONTS_BOUNDED_CINEMATIC_WITNESS_TRAVERSAL_v1
// One passive planet, one authored approach, one authored return. No planetary navigation authority.

import {createNativeWebGLDevice} from "../../../assets/engine/dgb.native-webgl-device.v1.mjs";
// Opt-in pilot. The default path and original authored shader remain unchanged.
// This flag is a candidate preview selector, not production adoption authority.
const E6_LIGHTING_PREVIEW=new URL(globalThis.location?.href??"https://invalid.local/").searchParams.get("dgbLighting")==="E6";
let createPreviewMaterialLibrary=null;

const CONTRACT="ZIONTS_PASSIVE_ROTATING_PLANET_NARRATIVE_v1";
const TRAVERSAL_CONTRACT="ZIONTS_BOUNDED_CINEMATIC_WITNESS_TRAVERSAL_v1";
const ROUTE="/showroom/globe/earth/";
const PARENT="/showroom/globe/";
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)");
const WITNESS=Object.freeze({ORBIT:"orbit-witness",APPROACH:"cinematic-approach",CLOSE:"close-witness",RETURN:"return-to-orbit"});
const state={initialized:false,renderer:"none",webglVersion:0,reducedMotion:REDUCED.matches,frameCount:0,contextLossCount:0,contextRestoreCount:0,failureReason:null,passiveRotation:true,inputAuthority:"NONE",generatedImage:false,audraliaRuntimeImport:false,storyIndex:0,storyCount:3,witnessState:WITNESS.ORBIT,cameraZ:-2.78,cameraX:0,cameraY:0,witnessBlend:0,lightingPreview:E6_LIGHTING_PREVIEW};
let canvas=null,gl=null,resources=null,raf=0,last=0,angle=.35,orbitReturnAngle=.35,visible=!document.hidden,cameraTween=null;

function exposeStatus(){window.DGBZiontsRoute=Object.freeze({status(){return Object.freeze({contract:CONTRACT,traversalContract:TRAVERSAL_CONTRACT,route:ROUTE,parent:PARENT,publicBody:"ZIONTS",renderer:state.renderer,webglVersion:state.webglVersion,initialized:state.initialized,reducedMotion:state.reducedMotion,frameCount:state.frameCount,contextLossCount:state.contextLossCount,contextRestoreCount:state.contextRestoreCount,failureReason:state.failureReason,passiveRotation:state.passiveRotation,inputAuthority:state.inputAuthority,generatedImage:state.generatedImage,audraliaRuntimeImport:state.audraliaRuntimeImport,storyIndex:state.storyIndex,storyCount:state.storyCount,witnessState:state.witnessState,cameraZ:state.cameraZ,cameraX:state.cameraX,cameraY:state.cameraY,witnessBlend:state.witnessBlend,lightingPreview:state.lightingPreview,groundEngine:false,inspectableWorld:false,planetaryNavigation:false})}})}
function markDocument(){const markers={page:"zionts-public-child-route",route:ROUTE,contract:CONTRACT,witnessTraversalContract:TRAVERSAL_CONTRACT,publicBody:"ZIONTS",parent:PARENT,groundEngine:"false",inspectableWorld:"false",planetInputAuthority:"none",generatedImage:"false",audraliaIdentity:"false",witnessState:state.witnessState};for(const [key,value] of Object.entries(markers)){document.documentElement.dataset[key]=String(value);if(document.body)document.body.dataset[key]=String(value)}}
function setWitnessState(next){state.witnessState=next;document.documentElement.dataset.witnessState=next;if(document.body)document.body.dataset.witnessState=next;const close=document.querySelector("[data-close-witness]");if(close)close.setAttribute("aria-hidden",String(next!==WITNESS.CLOSE));const returnButton=document.querySelector("[data-return-orbit]");if(returnButton)returnButton.tabIndex=next===WITNESS.CLOSE?0:-1;for(const action of document.querySelectorAll("[data-planet-approach],[data-witness-action]"))action.disabled=next!==WITNESS.ORBIT;exposeStatus()}
function fail(reason){state.failureReason=String(reason||"RENDERER_FAILURE");state.initialized=false;document.documentElement.dataset.ziontsRenderer="failed";exposeStatus()}
const PLANET_MESH=Object.freeze({lat:160,lon:240});
const PIXEL_BUDGET=Object.freeze({mobileOrbit:1500000,mobileClose:2300000,wideOrbit:2800000,wideClose:4300000});
function norm3(x,y,z){const n=Math.hypot(x,y,z)||1;return[x/n,y/n,z/n]}
function dot3(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
const CRATERS=[[-.50,.25,.82,.22,.050,0],[.31,.62,.72,.18,.044,0],[.58,-.48,.65,.16,.039,0],[-.72,-.35,.59,.145,.036,0],[.14,-.77,.62,.12,.030,1],[.82,.12,.55,.105,.028,1],[-.22,.84,.49,.095,.025,1],[.44,.14,-.89,.14,.036,1],[-.62,.51,-.59,.11,.029,1],[.71,-.16,-.69,.09,.024,1],[-.19,-.61,-.77,.115,.028,1],[.18,.92,-.34,.085,.022,1],[-.83,.04,-.55,.072,.019,2],[.54,.74,-.39,.065,.018,2],[-.34,.11,.94,.058,.016,2],[.69,.45,.57,.052,.015,2],[-.11,-.93,.35,.049,.014,2],[-.56,-.72,.41,.046,.013,2],[.91,-.34,.23,.043,.012,2],[-.91,.31,.27,.041,.012,2],[.27,.48,-.83,.038,.011,2],[-.48,-.18,-.86,.036,.010,2],[.08,.66,-.75,.034,.010,2],[.73,.65,-.22,.032,.009,2]].map(([x,y,z,r,d,f])=>({c:norm3(x,y,z),r,d,f}));
const BASINS=[{c:norm3(-.18,.28,.94),r:.38,d:.026},{c:norm3(.63,-.31,.71),r:.31,d:.021},{c:norm3(-.69,-.18,.70),r:.27,d:.019}];
// Gen3140: neutral-material fractured geology. The negative-space scar is a fault
// network in a sphere-local tangent plane, NOT a circular crater or painted ring.
// This remains product-authored geometry; it adds no new shared engine capability.
const SIGNATURE_SCAR=Object.freeze({center:norm3(-.17,.20,.965),closeSpin:.34});
const FAULT_RIGHT=norm3(SIGNATURE_SCAR.center[2],0,-SIGNATURE_SCAR.center[0]);
const FAULT_UP=norm3(
  SIGNATURE_SCAR.center[1]*FAULT_RIGHT[2]-SIGNATURE_SCAR.center[2]*FAULT_RIGHT[1],
  SIGNATURE_SCAR.center[2]*FAULT_RIGHT[0]-SIGNATURE_SCAR.center[0]*FAULT_RIGHT[2],
  SIGNATURE_SCAR.center[0]*FAULT_RIGHT[1]-SIGNATURE_SCAR.center[1]*FAULT_RIGHT[0]
);
const SCAR_SPINE=Object.freeze([
  [-.61,-.16,-.40,.045],[-.40,.045,-.18,.02],[-.18,.02,.035,-.14],
  [.035,-.14,.30,-.065],[.30,-.065,.55,.175]
]);
const SCAR_BRANCHES=Object.freeze([
  [-.39,.033,-.56,.34],[-.16,-.004,-.34,-.31],
  [.075,-.12,.25,-.42],[.30,-.06,.58,-.29]
]);
function smooth01(a,b,x){const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)}
function nearestSegment(x,y,segment){
  const [x1,y1,x2,y2]=segment,dx=x2-x1,dy=y2-y1;
  const q=clamp(((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy),0,1);
  const px=x1+dx*q,py=y1+dy*q;
  return {distance:Math.hypot(x-px,y-py),side:(x-px)*(-dy)+(y-py)*dx,t:q};
}
function terrainSample(nx,ny,nz){
  const n=[nx,ny,nz];
  const u=dot3(n,FAULT_RIGHT),v=dot3(n,FAULT_UP);
  const macro=Math.sin(nx*5.1+ny*1.7-nz*.8)*.007+
    Math.sin(ny*8.7+nz*3.4)*.005+Math.sin((nx+nz)*13.3-ny*2.2)*.002;
  const meso=Math.sin(nx*18.5+ny*7.2-nz*4.1)*.0015+
    Math.sin(ny*27.0-nz*11.8+nx*3.2)*.0011;
  let h=macro+meso,basinSignal=0,craterSignal=0,rimSignal=0;
  // Projected spherical tangent coordinates keep the fault physically attached
  // to the rotating planet. Minimum segment distance makes it *nonradial*.
  let distance=2.0,side=0,edgeU=0;
  for(const segment of SCAR_SPINE){const q=nearestSegment(u,v,segment);
    if(q.distance<distance){distance=q.distance;side=q.side;edgeU=u;}}
  const warp=.010*Math.sin(u*19+v*11)+.007*Math.sin(u*43-v*17);
  const d=Math.max(0,distance+warp);
  const variableWidth=.125+.022*Math.sin(u*10.0+1.2)+.014*Math.cos(u*19.3-v*7.8);
  const core=1-smooth01(variableWidth*.25,variableWidth*1.10,d);
  const wall=smooth01(variableWidth*.32,variableWidth*.86,d)*
      (1-smooth01(variableWidth*1.03,variableWidth*1.58,d));
  // Fault floor is fractured and terraced, never one smooth circular bowl.
  const tectonicSteps=wall*(.0035*Math.sin(d*94+u*13)+.0025*Math.sin(d*143-v*22));
  h-=.092*core;
  h+=tectonicSteps;
  // Interrupted escarpments, preferably on one displaced bank, not a 360° rim.
  const bankSelection=side>0?1.0:.32;
  const breakup=smooth01(.12,.78,.5+.5*Math.sin(u*15.4+v*7.5)) *
    (.35+.65*smooth01(.20,.72,.5+.5*Math.cos(u*29-v*18)));
  const escarpment=Math.exp(-Math.pow((d-variableWidth*1.20)/(.042+.012*Math.cos(u*8)),2)) *
     breakup*bankSelection;
  h+=.021*escarpment;
  basinSignal=Math.max(basinSignal,core);
  rimSignal=Math.max(rimSignal,escarpment*.55);
  // Connected tributary faults create multiple direction changes and an actual
  // branching network. They are displaced geometry, not grayscale line paint.
  for(const branch of SCAR_BRANCHES){
    const f=nearestSegment(u,v,branch);
    const taper=Math.sin(Math.PI*f.t)**.7;
    const g=Math.exp(-Math.pow(f.distance/.027,2))*taper;
    h-=.028*g;
    h+=.006*Math.exp(-Math.pow((f.distance-.053)/.020,2))*taper;
    basinSignal=Math.max(basinSignal,.4*g);
  }
  // Smaller craters remain subordinate to the primary nonradial fault network.
  for(const q of CRATERS){const angular=Math.acos(clamp(dot3(n,q.c),-1,1));
    const t=angular/(q.r*(1+.055*Math.sin(nx*29+ny*13+nz*17)));
    if(t<1.26){
      const floor=t<1?Math.pow(Math.max(0,1-t*t),1.6):0;
      const ridge=Math.exp(-Math.pow((t-.94)/.19,2));
      h-=floor*q.d*.42;
      h+=ridge*q.d*.14;
      craterSignal=Math.max(craterSignal,floor);
    }
  }
  // The broad overlapping BASINS of Gen3095 are intentionally not applied:
  // their radial rings visually competed with the defining fault.
  const ridge=.5+.5*Math.sin(nx*11.5-ny*16.2+nz*9.1+h*121);
  const highland=clamp(.49+h*2.4+(ridge-.5)*.09+rimSignal*.06-basinSignal*.07,0,1);
  const material=clamp(.46+highland*.25-basinSignal*.15-craterSignal*.035,0,1);
  const tone=clamp(.50+h*1.8+(ridge-.5)*.06,0,1);
  return {h:clamp(h,-.15,.07),tone,material};
}
function buildSphere(latSegments=PLANET_MESH.lat,lonSegments=PLANET_MESH.lon){const positions=[],tones=[],materials=[],indices=[];for(let y=0;y<=latSegments;y++){const v=y/latSegments,theta=v*Math.PI,sy=Math.cos(theta),ring=Math.sin(theta);for(let x=0;x<=lonSegments;x++){const u=x/lonSegments,phi=u*Math.PI*2,nx=ring*Math.cos(phi),ny=sy,nz=ring*Math.sin(phi),sample=terrainSample(nx,ny,nz),r=1+sample.h;positions.push(nx*r,ny*r,nz*r);tones.push(sample.tone);materials.push(sample.material)}}const row=lonSegments+1;for(let y=0;y<latSegments;y++)for(let x=0;x<lonSegments;x++){const a=y*row+x,b=a+row;indices.push(a,b,a+1,b,b+1,a+1)}const normals=new Float32Array(positions.length);for(let i=0;i<indices.length;i+=3){const ia=indices[i]*3,ib=indices[i+1]*3,ic=indices[i+2]*3,ax=positions[ia],ay=positions[ia+1],az=positions[ia+2],bx=positions[ib],by=positions[ib+1],bz=positions[ib+2],cx=positions[ic],cy=positions[ic+1],cz=positions[ic+2],abx=bx-ax,aby=by-ay,abz=bz-az,acx=cx-ax,acy=cy-ay,acz=cz-az,nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx;normals[ia]+=nx;normals[ia+1]+=ny;normals[ia+2]+=nz;normals[ib]+=nx;normals[ib+1]+=ny;normals[ib+2]+=nz;normals[ic]+=nx;normals[ic+1]+=ny;normals[ic+2]+=nz}for(let i=0;i<normals.length;i+=3){let x=normals[i],y=normals[i+1],z=normals[i+2];if(Math.hypot(x,y,z)<1e-9){x=-positions[i];y=-positions[i+1];z=-positions[i+2]}const n=norm3(x,y,z);normals[i]=n[0];normals[i+1]=n[1];normals[i+2]=n[2]}return{positions:new Float32Array(positions),normals,tones:new Float32Array(tones),materials:new Float32Array(materials),indices:new Uint16Array(indices)}}
function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2);out.fill(0);out[0]=f/aspect;out[5]=f;out[10]=(far+near)/(near-far);out[11]=-1;out[14]=2*far*near/(near-far);return out}
function multiply(out,a,b){const r=new Float32Array(16);for(let c=0;c<4;c++)for(let row=0;row<4;row++)r[c*4+row]=a[row]*b[c*4]+a[4+row]*b[c*4+1]+a[8+row]*b[c*4+2]+a[12+row]*b[c*4+3];out.set(r);return out}
function rotationTiltY(out,tilt,spin){const cx=Math.cos(tilt),sx=Math.sin(tilt),cy=Math.cos(spin),sy=Math.sin(spin);out.set([cy,sx*sy,-cx*sy,0,0,cx,sx,0,sy,-sx*cy,cx*cy,0,0,0,0,1]);return out}
function translationXYZ(out,x,y,z){out.set([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]);return out}
function createResources(){
  const contextAttributes={alpha:true,antialias:true,depth:true,powerPreference:"high-performance",premultipliedAlpha:true,preserveDrawingBuffer:false};
  // One original source-owned WebGL context; preserve the legacy experimental-webgl fallback.
  const nativeGL=canvas.getContext("webgl",contextAttributes)||canvas.getContext("experimental-webgl",contextAttributes);
  if(!nativeGL)throw new Error("WEBGL_UNAVAILABLE");
  // The shared device re-compiles source after WebGL restoration. WebGL1
  // extensions are reset on loss; re-enable derivatives before E1's listener.
  // This listener is registered before the shared device owns recovery.
  canvas.addEventListener("webglcontextrestored",()=>{
    nativeGL.getExtension("OES_standard_derivatives");
  },false);
  const deviceCanvas={
    get width(){return canvas.width},
    get height(){return canvas.height},
    getContext(kind){return kind==="webgl"?nativeGL:null},
    addEventListener(...args){canvas.addEventListener(...args)},
    removeEventListener(...args){canvas.removeEventListener(...args)}
  };
  const device=createNativeWebGLDevice(deviceCanvas,{backend:"WEBGL1",contextAttributes});
  gl=device.gl;state.webglVersion=1;state.renderer="webgl1";
  const derivativeExtension=gl.getExtension("OES_standard_derivatives");
  const vs=`precision highp float;attribute vec3 a_position;attribute vec3 a_normal;attribute float a_tone;attribute float a_material;uniform mat4 u_mvp;uniform mat4 u_model;varying vec3 v_normal;varying float v_tone;varying float v_material;varying vec3 v_position;void main(){vec4 world=u_model*vec4(a_position,1.0);v_position=a_position;v_normal=normalize((u_model*vec4(a_normal,0.0)).xyz);v_tone=a_tone;v_material=a_material;gl_Position=u_mvp*vec4(a_position,1.0);}`;// For this checkpoint neutral lighting is intentionally the entire material.
  // A convincing scar must be legible in real displaced mesh normals alone.
  const fs=`precision highp float;
varying vec3 v_normal;
varying float v_tone;
varying float v_material;
varying vec3 v_position;
uniform vec3 u_light;
uniform float u_closeDetail;
uniform mat4 u_model;
void main(){
 vec3 n=normalize(v_normal);
 vec3 l=normalize(u_light);
 float diffuse=max(0.0,dot(n,l));
 float terminator=smoothstep(-0.06,0.16,dot(n,l));
 float value=clamp((.23+.73*diffuse)*(.70+.30*terminator),0.0,1.0);
 // Continuous low-contrast lithology only; no synthetic pale rim or dark paint.
 value*=.92+.065*(v_tone-.5);
 gl_FragColor=vec4(vec3(value),1.0);
}`;
  try{
    const program=device.createProgram({vertexSource:vs,fragmentSource:fs});
    const mesh=buildSphere();
    // The source winding produces inward normals; Gen3095 reverses shading
    // consistently in both default and opt-in material paths.
    const shadingNormals=Float32Array.from(mesh.normals,component=>-component);
    const gpuMesh=device.createMesh({
      attributes:[
        {name:"a_position",data:mesh.positions,size:3},
        {name:"a_normal",data:shadingNormals,size:3},
        {name:"a_tone",data:mesh.tones,size:1},
        {name:"a_material",data:mesh.materials,size:1}
      ],
      indices:mesh.indices,
      vertexCount:mesh.positions.length/3
    });
    let specular=null;
    if(E6_LIGHTING_PREVIEW){
      // The original authored color pass is retained in full. The shared E6
      // material adds only view-dependent highlight energy, never substitutes
      // its generic albedo for ZIONTS's mineral, grain and strata shader.
      const library=createPreviewMaterialLibrary(device);
      const material=library.createMaterial({kind:"LIT_SPECULAR",baseColor:[0,0,0,1],light:{
        direction:[.78,.48,.66],color:[.89,.55,.39],ambient:0,intensity:.65,
        skyColor:[0,0,0],groundColor:[0,0,0],fillIntensity:0,
        specularStrength:.14,shininess:54
      }});
      const overlayMesh=device.createMesh({
        attributes:[{name:"aPosition",data:mesh.positions,size:3},
                    {name:"aNormal",data:shadingNormals,size:3}],
        indices:mesh.indices,vertexCount:mesh.positions.length/3
      });
      specular={library,material,mesh:overlayMesh};
    }
    return{device,program,mesh:gpuMesh,count:mesh.indices.length,uniformProgram:null,uniformLocations:null,specular};
  }catch(error){device.dispose();throw error}
}
function resize(){if(!canvas||!gl)return;const rect=canvas.getBoundingClientRect(),mobile=matchMedia("(max-width: 640px)").matches,closeFactor=Math.max(0,Math.min(1,(state.cameraZ+2.78)/.45));const orbitBudget=mobile?PIXEL_BUDGET.mobileOrbit:PIXEL_BUDGET.wideOrbit,closeBudget=mobile?PIXEL_BUDGET.mobileClose:PIXEL_BUDGET.wideClose,budget=orbitBudget+(closeBudget-orbitBudget)*closeFactor,area=Math.max(1,rect.width*rect.height),dpr=Math.max(.78,Math.min(devicePixelRatio||1,Math.sqrt(budget/area))),w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;resources.device.viewport(w,h)}}
function draw(){
  if(!gl||!resources)return;
  const deviceState=resources.device.status();
  if(deviceState.lost||deviceState.disposed||deviceState.restorationError)return;
  resize();
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.BLEND);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const aspect=canvas.width/Math.max(1,canvas.height),projection=perspective(new Float32Array(16),Math.PI/3.45,aspect,.1,20),view=translationXYZ(new Float32Array(16),state.cameraX,state.cameraY,state.cameraZ),model=rotationTiltY(new Float32Array(16),-.18-state.witnessBlend*.19,angle),pv=multiply(new Float32Array(16),projection,view),mvp=multiply(new Float32Array(16),pv,model);
  resources.device.draw({
    program:resources.program,
    mesh:resources.mesh,
    beforeDraw(context,gpuProgram){
      // The native device re-links on context restore; uniform locations are program-specific.
      if(resources.uniformProgram!==gpuProgram){
        resources.uniformProgram=gpuProgram;
        resources.uniformLocations={
          mvp:context.getUniformLocation(gpuProgram,"u_mvp"),
          model:context.getUniformLocation(gpuProgram,"u_model"),
          light:context.getUniformLocation(gpuProgram,"u_light"),
          closeDetail:context.getUniformLocation(gpuProgram,"u_closeDetail")
        };
      }
      const uniforms=resources.uniformLocations;
      context.uniformMatrix4fv(uniforms.mvp,false,mvp);
      context.uniformMatrix4fv(uniforms.model,false,model);
      context.uniform3f(uniforms.light,.72,.48,.72);
      context.uniform1f(uniforms.closeDetail,state.witnessBlend);
    }
  });
  if(resources.specular){
    const {library,material,mesh}=resources.specular;
    const binding=library.makeDrawBinding(material,{
      modelMatrix:model,modelViewProjection:mvp,cameraPosition:[0,0,-state.cameraZ]
    });
    // Additive RGB-only second pass at the same exact depth. Because the
    // material baseColor is zero, only E6's specular term contributes.
    // Restore GL state even if shader binding or drawing throws.
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.ONE,gl.ONE,gl.ZERO,gl.ONE);
    gl.colorMask(true,true,true,false);
    gl.depthMask(false);
    try{
      resources.device.draw({program:binding.program,mesh,beforeDraw:binding.beforeDraw,afterDraw:binding.afterDraw});
    }finally{
      gl.depthMask(true);
      gl.colorMask(true,true,true,true);
      gl.disable(gl.BLEND);
    }
  }
  state.frameCount++;
}
function ease(t){return 1-Math.pow(1-t,3)}
function pose(){return{z:state.cameraZ,x:state.cameraX,y:state.cameraY,blend:state.witnessBlend,spin:angle}}
function applyPose(p){state.cameraZ=p.z;state.cameraX=p.x;state.cameraY=p.y;state.witnessBlend=p.blend;angle=p.spin}
function finishCamera(done){setWitnessState(done);document.querySelector(done===WITNESS.CLOSE?"[data-return-orbit]":"[data-planet-approach]")?.focus({preventScroll:true})}
function updateCamera(now){if(!cameraTween)return false;const tw=cameraTween,t=clamp((now-tw.start)/tw.duration,0,1),e=ease(t),p={};for(const key of ["z","x","y","blend","spin"])p[key]=tw.from[key]+(tw.to[key]-tw.from[key])*e;applyPose(p);if(t>=1){cameraTween=null;applyPose(tw.to);finishCamera(tw.done)}return true}
function tick(now){raf=0;if(!visible)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;const cameraActive=updateCamera(now);if(gl&&resources){if(!state.reducedMotion&&state.witnessState===WITNESS.ORBIT)angle=(angle+dt*.042)%(Math.PI*2);draw()}if((!state.reducedMotion&&gl&&resources)||cameraActive||cameraTween)raf=requestAnimationFrame(tick)}
function start(){if(!visible)return;if(raf)cancelAnimationFrame(raf);last=performance.now();if(gl&&resources)draw();if((!state.reducedMotion&&gl&&resources)||cameraTween)raf=requestAnimationFrame(tick)}
function transitionCamera(to,duration,terminal){if(state.reducedMotion){cameraTween=null;applyPose(to);finishCamera(terminal);if(gl&&resources)draw();return}cameraTween={from:pose(),to,start:performance.now(),duration,done:terminal};start()}
function beginApproach(){if(state.witnessState!==WITNESS.ORBIT)return;orbitReturnAngle=angle;setWitnessState(WITNESS.APPROACH);const turn=Math.atan2(Math.sin(SIGNATURE_SCAR.closeSpin-angle),Math.cos(SIGNATURE_SCAR.closeSpin-angle));transitionCamera({z:-2.12,x:-.12,y:-.06,blend:1,spin:angle+turn},1350,WITNESS.CLOSE)}
function beginReturn(){if(state.witnessState!==WITNESS.CLOSE)return;setWitnessState(WITNESS.RETURN);transitionCamera({z:-2.78,x:0,y:0,blend:0,spin:orbitReturnAngle},1120,WITNESS.ORBIT)}
function onContextLost(event){event.preventDefault();state.contextLossCount++;if(raf)cancelAnimationFrame(raf);raf=0;state.initialized=false;document.documentElement.dataset.ziontsRenderer="failed";exposeStatus()}
function onContextRestored(){
  state.contextRestoreCount++;
  try{
    // The device listener is registered first and has already rebuilt its GPU handles.
    if(!resources?.device)throw new Error("CONTEXT_RESTORE_DEVICE_MISSING");
    const status=resources.device.status();
    if(status.lost||status.restorationError)throw new Error(status.restorationError||"CONTEXT_RESTORE_NOT_READY");
    resources.device.viewport(canvas.width,canvas.height);
    state.initialized=true;state.failureReason=null;
    document.documentElement.dataset.ziontsRenderer="ready";exposeStatus();start();
  }catch(error){fail(error?.message||"CONTEXT_RESTORE_FAILED")}
}
async function initRenderer(){
  canvas=document.getElementById("ziontsPlanet");
  if(!canvas)return fail("PLANET_CANVAS_MISSING");
  canvas.setAttribute("aria-hidden","true");canvas.style.pointerEvents="none";
  try{
    // Load E4 only when requested: the default ZIONTS route depends solely on
    // the already accepted E1 device and keeps its original rendering intact.
    if(E6_LIGHTING_PREVIEW){
      const module=await import("../../../assets/engine/dgb.native-material-light.v1.mjs");
      createPreviewMaterialLibrary=module.createNativeMaterialLibrary;
    }
    resources=createResources();
    // Own listeners follow the device's listeners so native GPU recovery runs first.
    canvas.addEventListener("webglcontextlost",onContextLost,false);
    canvas.addEventListener("webglcontextrestored",onContextRestored,false);
    state.initialized=true;state.failureReason=null;
    document.documentElement.dataset.ziontsRenderer="ready";exposeStatus();start();
  }catch(error){fail(error?.message||"PLANET_INIT_FAILED")}
}
function initStory(){const root=document.querySelector("[data-story-carousel]");if(!root)return;const panels=[...root.querySelectorAll("[data-story-panel]")],steps=[...root.querySelectorAll("[data-story-index]")],controls=root.querySelector("[data-story-controls]"),count=root.querySelector("[data-story-count]"),stage=root.querySelector("[data-story-stage]"),prev=root.querySelector("[data-story-prev]"),next=root.querySelector("[data-story-next]");if(!panels.length||panels.length!==steps.length||!controls||!stage||!prev||!next)return;state.storyCount=panels.length;let index=0,touchX=null;function select(nextIndex,focus=false){index=(nextIndex+panels.length)%panels.length;state.storyIndex=index;panels.forEach((panel,i)=>{const active=i===index;panel.dataset.active=String(active);panel.setAttribute("aria-hidden",String(!active))});steps.forEach((step,i)=>{const active=i===index;step.setAttribute("aria-selected",String(active));step.tabIndex=active?0:-1});count.textContent=`${index+1} of ${panels.length}`;if(focus)steps[index].focus();exposeStatus()}steps.forEach((step,i)=>step.addEventListener("click",()=>select(i)));prev.addEventListener("click",()=>select(index-1,true));next.addEventListener("click",()=>select(index+1,true));stage.addEventListener("touchstart",event=>{touchX=event.changedTouches?.[0]?.clientX??null},{passive:true});stage.addEventListener("touchend",event=>{if(touchX===null)return;const end=event.changedTouches?.[0]?.clientX??touchX,delta=end-touchX;touchX=null;if(Math.abs(delta)>54)select(index+(delta<0?1:-1))},{passive:true});controls.hidden=false;document.documentElement.dataset.ziontsStory="ready";select(0)}
function initTraversal(){document.querySelector("[data-planet-approach]")?.addEventListener("click",beginApproach);document.querySelector("[data-witness-action]")?.addEventListener("click",beginApproach);document.querySelector("[data-return-orbit]")?.addEventListener("click",beginReturn)}
function onReducedMotion(){state.reducedMotion=REDUCED.matches;if(state.reducedMotion&&cameraTween){const tw=cameraTween;cameraTween=null;applyPose(tw.to);finishCamera(tw.done)}exposeStatus();start()}
function onVisibility(){visible=!document.hidden;if(visible)start();else if(raf){cancelAnimationFrame(raf);raf=0}}
function installNeutralCandidateLayout(){
  if(document.getElementById("ziontsGen3140NeutralLayout"))return;
  const style=document.createElement("style");style.id="ziontsGen3140NeutralLayout";
  style.textContent=`
   .planet-approach::after{content:none!important;display:none!important}
   @media(max-width:640px){
     .planet-field{top:10.8rem!important;right:2vw!important;width:96vw!important;height:min(45vh,395px)!important;min-height:0!important;transform:none!important}
     .planet-field::before{width:94%!important}
     .planet-caption{right:7%!important;bottom:1%!important;font-size:.52rem!important}
     .planet-caption strong{font-size:.66rem!important}
     .planet-approach{width:84%!important}
     .hero{padding-top:clamp(420px,54vh,495px)!important}
     .hero-copy{max-width:100%!important}
     h1{font-size:clamp(2.65rem,11.5vw,4.0rem)!important;line-height:1.03!important;letter-spacing:-.07em!important}
     html[data-witness-state="cinematic-approach"] .planet-field,
     html[data-witness-state="close-witness"] .planet-field{top:47%!important;right:50%!important;width:110vw!important;height:66vh!important;transform:translate(50%,-50%) scale(1.02)!important}
     html[data-witness-state="return-to-orbit"] .planet-field{top:47%!important;right:50%!important;width:114vw!important;height:70vh!important;transform:translate(50%,-50%)!important}
   }
  `;
  document.head.appendChild(style);
}
function init(){installNeutralCandidateLayout();markDocument();setWitnessState(WITNESS.ORBIT);initStory();initTraversal();initRenderer();REDUCED.addEventListener?.("change",onReducedMotion);document.addEventListener("visibilitychange",onVisibility);addEventListener("resize",()=>{if(gl&&resources)draw()},{passive:true});exposeStatus()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
