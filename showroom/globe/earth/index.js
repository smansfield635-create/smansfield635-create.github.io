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
function setWitnessState(next){state.witnessState=next;document.documentElement.dataset.witnessState=next;if(document.body)document.body.dataset.witnessState=next;const close=document.querySelector("[data-close-witness]");if(close)close.setAttribute("aria-hidden",String(next!==WITNESS.CLOSE));const returnButton=document.querySelector("[data-return-orbit]");if(returnButton)returnButton.tabIndex=next===WITNESS.CLOSE?0:-1;const action=document.querySelector("[data-witness-action]");if(action)action.disabled=next!==WITNESS.ORBIT;exposeStatus()}
function fail(reason){state.failureReason=String(reason||"RENDERER_FAILURE");state.initialized=false;document.documentElement.dataset.ziontsRenderer="failed";exposeStatus()}
const PLANET_MESH=Object.freeze({lat:160,lon:240});
const PIXEL_BUDGET=Object.freeze({mobileOrbit:1500000,mobileClose:2300000,wideOrbit:2800000,wideClose:4300000});
function norm3(x,y,z){const n=Math.hypot(x,y,z)||1;return[x/n,y/n,z/n]}
function dot3(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
const CRATERS=[[-.50,.25,.82,.22,.050,0],[.31,.62,.72,.18,.044,0],[.58,-.48,.65,.16,.039,0],[-.72,-.35,.59,.145,.036,0],[.14,-.77,.62,.12,.030,1],[.82,.12,.55,.105,.028,1],[-.22,.84,.49,.095,.025,1],[.44,.14,-.89,.14,.036,1],[-.62,.51,-.59,.11,.029,1],[.71,-.16,-.69,.09,.024,1],[-.19,-.61,-.77,.115,.028,1],[.18,.92,-.34,.085,.022,1],[-.83,.04,-.55,.072,.019,2],[.54,.74,-.39,.065,.018,2],[-.34,.11,.94,.058,.016,2],[.69,.45,.57,.052,.015,2],[-.11,-.93,.35,.049,.014,2],[-.56,-.72,.41,.046,.013,2],[.91,-.34,.23,.043,.012,2],[-.91,.31,.27,.041,.012,2],[.27,.48,-.83,.038,.011,2],[-.48,-.18,-.86,.036,.010,2],[.08,.66,-.75,.034,.010,2],[.73,.65,-.22,.032,.009,2]].map(([x,y,z,r,d,f])=>({c:norm3(x,y,z),r,d,f}));
const BASINS=[{c:norm3(-.18,.28,.94),r:.38,d:.026},{c:norm3(.63,-.31,.71),r:.31,d:.021},{c:norm3(-.69,-.18,.70),r:.27,d:.019}];
// Gen3095: authored, fixed, body-local signature wound; no image or screen pass.
const SIGNATURE_SCAR=Object.freeze({center:norm3(-.17,.20,.965),radius:.43,depth:.110,rim:.043,closeSpin:.34});
function smooth01(a,b,x){const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)}
function terrainSample(nx,ny,nz){
 const n=[nx,ny,nz];
 // Level 1: low-pass broad shape before adding surface-only high frequencies.
 const macro=Math.sin(nx*5.1+ny*1.7-nz*.8)*.0091+
   Math.sin(ny*8.7+nz*3.4)*.0065+Math.sin((nx+nz)*13.3-ny*2.2)*.0033;
 const meso=Math.sin(nx*18.5+ny*7.2-nz*4.1)*.0019+
   Math.sin(ny*27.0-nz*11.8+nx*3.2)*.0012+
   Math.sin((nx-ny+nz)*38.0)*.00065;
 let h=macro+meso,basinSignal=0,craterSignal=0,rimSignal=0;
  const bearing=Math.atan2(ny-SIGNATURE_SCAR.center[1],nx-SIGNATURE_SCAR.center[0]);
  const edge=1+.13*Math.sin(3*bearing+.6)+.065*Math.sin(7*bearing-1.2)+.035*Math.sin(11*bearing+.9);
  const t=Math.acos(clamp(dot3(n,SIGNATURE_SCAR.center),-1,1))/(SIGNATURE_SCAR.radius*edge);
  const floor=1-smooth01(.38,1.02,t),wall=smooth01(.51,.77,t)*(1-smooth01(.99,1.19,t));
  const rim=Math.exp(-Math.pow((t-1.045)/.145,2));
  const fractures=Math.abs(Math.sin(bearing*17+t*9)+.44*Math.sin(bearing*31-t*16));
  h-=SIGNATURE_SCAR.depth*floor;
  h+=SIGNATURE_SCAR.rim*rim*(.73+.27*fractures);
  h+=wall*.012*Math.sin(t*44+bearing*8.4);
  basinSignal=Math.max(basinSignal,floor);rimSignal=Math.max(rimSignal,rim);
 for(const b of BASINS){const d=Math.acos(clamp(dot3(n,b.c),-1,1));if(d<b.r){
   const t=d/b.r,edge=(1-t*t),bowl=edge*edge*(1-.20*t);
   h-=bowl*b.d*.72;basinSignal=Math.max(basinSignal,bowl);
 }}
 for(const q of CRATERS){const d=Math.acos(clamp(dot3(n,q.c),-1,1));
  // Multi-band angular variation prevents perfect bullseye ring and sharp rims.
  const edgeWarp=1+.045*Math.sin((nx+q.c[0])*23+(ny-q.c[1])*29)+
   .025*Math.sin((ny+q.c[1])*47-(nz-q.c[2])*34);
  const t=d/(q.r*edgeWarp);
  if(t<1.28){
    const floor=t<1?Math.pow(Math.max(0,1-t*t),1.6):0;
    const ring=Math.exp(-Math.pow((t-.94)/.19,2));
    const erode=.8+.13*Math.sin(nx*51+ny*37+nz*26)+.07*Math.sin(nx*82-ny*49+nz*37);
    const softRim=ring*q.d*.355*erode;
    h-=floor*q.d*.755;h+=softRim;
    craterSignal=Math.max(craterSignal,floor);
    rimSignal=Math.max(rimSignal,ring*.7);
  }
 }
 const fractureField=Math.abs(Math.sin((nx*3.0+ny*4.5-nz*2.15)*7.5)+.32*Math.sin((nx-ny)*23.0));
 h-=Math.max(0,.028-fractureField)*.065*(ny>-.72?1:0);
 const ridge=.5+.5*Math.sin(nx*11.5-ny*16.2+nz*9.1+h*165);
 const highland=clamp(.49+h*5.5+(ridge-.5)*.13+rimSignal*.16-basinSignal*.19,0,1);
 const material=clamp(.43+highland*.28+rimSignal*.24-basinSignal*.18-craterSignal*.095,0,1);
 const strata=.5+.5*Math.sin(nx*20.0+ny*9.0-nz*14.0+h*210);
 const tone=clamp(.47+h*5.5+(strata-.5)*.09+(ridge-.5)*.052+rimSignal*.03-basinSignal*.075,0,1);
 return {h:clamp(h,-.155,.095),tone,material};
}
function buildSphere(latSegments=PLANET_MESH.lat,lonSegments=PLANET_MESH.lon){const positions=[],tones=[],materials=[],indices=[];for(let y=0;y<=latSegments;y++){const v=y/latSegments,theta=v*Math.PI,sy=Math.cos(theta),ring=Math.sin(theta);for(let x=0;x<=lonSegments;x++){const u=x/lonSegments,phi=u*Math.PI*2,nx=ring*Math.cos(phi),ny=sy,nz=ring*Math.sin(phi),sample=terrainSample(nx,ny,nz),r=1+sample.h;positions.push(nx*r,ny*r,nz*r);tones.push(sample.tone);materials.push(sample.material)}}const row=lonSegments+1;for(let y=0;y<latSegments;y++)for(let x=0;x<lonSegments;x++){const a=y*row+x,b=a+row;indices.push(a,b,a+1,b,b+1,a+1)}const normals=new Float32Array(positions.length);for(let i=0;i<indices.length;i+=3){const ia=indices[i]*3,ib=indices[i+1]*3,ic=indices[i+2]*3,ax=positions[ia],ay=positions[ia+1],az=positions[ia+2],bx=positions[ib],by=positions[ib+1],bz=positions[ib+2],cx=positions[ic],cy=positions[ic+1],cz=positions[ic+2],abx=bx-ax,aby=by-ay,abz=bz-az,acx=cx-ax,acy=cy-ay,acz=cz-az,nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx;normals[ia]+=nx;normals[ia+1]+=ny;normals[ia+2]+=nz;normals[ib]+=nx;normals[ib+1]+=ny;normals[ib+2]+=nz;normals[ic]+=nx;normals[ic+1]+=ny;normals[ic+2]+=nz}for(let i=0;i<normals.length;i+=3){const n=norm3(normals[i],normals[i+1],normals[i+2]);normals[i]=n[0];normals[i+1]=n[1];normals[i+2]=n[2]}return{positions:new Float32Array(positions),normals,tones:new Float32Array(tones),materials:new Float32Array(materials),indices:new Uint16Array(indices)}}
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
  const vs=`precision highp float;attribute vec3 a_position;attribute vec3 a_normal;attribute float a_tone;attribute float a_material;uniform mat4 u_mvp;uniform mat4 u_model;varying vec3 v_normal;varying float v_tone;varying float v_material;varying vec3 v_position;void main(){vec4 world=u_model*vec4(a_position,1.0);v_position=a_position;v_normal=normalize((u_model*vec4(a_normal,0.0)).xyz);v_tone=a_tone;v_material=a_material;gl_Position=u_mvp*vec4(a_position,1.0);}`;const fs=(derivativeExtension?"#extension GL_OES_standard_derivatives : enable\n#define DGB_DERIVATIVES 1\n":"#define DGB_DERIVATIVES 0\n")+`precision highp float;
varying vec3 v_normal;
varying float v_tone;
varying float v_material;
varying vec3 v_position;
uniform vec3 u_light;
uniform float u_closeDetail;
uniform mat4 u_model;

float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float n3(vec3 p){
 vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),
                mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),
                mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);
}
// OES_standard_derivatives provides a conservative per-pixel footprint in planet-local units.
// WebGL1 without derivatives keeps broad detail but disables undersampled micro waves.
float detailBand(float phase){
#if DGB_DERIVATIVES
 return 1.0-smoothstep(.09,.68,fwidth(phase));
#else
 return 0.0;
#endif
}
float noiseBand(float scale,vec3 p){
#if DGB_DERIVATIVES
 vec3 footprint=fwidth(p);
 float wave=max(max(footprint.x,footprint.y),footprint.z)*scale;
 return 1.0-smoothstep(.62,1.42,wave);
#else
 return scale<20.0?1.0:0.0;
#endif
}
void main(){
 vec3 p=v_position;
 float sediment=mix(.5,n3(p*10.5+vec3(.7,4.1,-2.6)),noiseBand(10.5,p));
 float bedrock=mix(.5,n3(p*38.0+vec3(9.4,-1.7,4.2)),.50*noiseBand(38.0,p));
 float microPhaseA=dot(p,vec3(83.,127.,91.))+sediment*4.0;
 float microPhaseB=dot(p,vec3(157.,-73.,127.))-bedrock*5.0;
 float micro=.5+.20*sin(microPhaseA)*detailBand(microPhaseA)+.16*sin(microPhaseB)*detailBand(microPhaseB);
 float grainPhaseA=dot(p,vec3(146.0,112.0,-137.0))+bedrock*3.5;
 float grainPhaseB=dot(p,vec3(-132.0,171.0,91.0))-sediment*2.7;
 float grain=sin(grainPhaseA)*sin(grainPhaseB)*min(detailBand(grainPhaseA),detailBand(grainPhaseB));
 float fracture=(1.0-smoothstep(.08,.25,abs(bedrock-.53)))*noiseBand(38.0,p);
 float sedimentMix=smoothstep(.25,.69,v_material*.64+sediment*.36);
 float highland=smoothstep(.54,.82,v_material*.72+bedrock*.28);
 vec3 basin=vec3(.31,.146,.116);
 vec3 soil=vec3(.49,.238,.172);
 vec3 rock=vec3(.66,.36,.242);
 vec3 albedo=mix(basin,soil,sedimentMix);
 albedo=mix(albedo,rock,highland*.43);
  // Albedo follows local geometry and rotates as the surface rotates.
  vec3 scarAxis=normalize(vec3(-.17,.20,.965));
  float scarBearing=atan(p.y-.20,p.x+.17);
  float scarEdge=1.0+.13*sin(3.0*scarBearing+.6)+.065*sin(7.0*scarBearing-1.2)+.035*sin(11.0*scarBearing+.9);
  float scarArc=sqrt(max(0.0,2.0*(1.0-dot(normalize(p),scarAxis))))/(.43*scarEdge);
  float floorMix=1.0-smoothstep(.37,.89,scarArc);
  float wallMix=smoothstep(.72,.93,scarArc)*(1.0-smoothstep(1.02,1.21,scarArc));
  float rimMix=exp(-pow((scarArc-1.045)/.15,2.0));
  vec3 basalt=vec3(.11,.074,.077)*(.9+.2*bedrock);
  vec3 shelf=vec3(.65,.53,.42)*(.87+.19*sediment);
  albedo=mix(albedo,basalt,floorMix*.91);
  albedo=mix(albedo,shelf,clamp(wallMix*.67+rimMix*.76,0.0,.88));
 // Gentle, continuous transitions, rather than saturated dark splotches.
 float variation=1.0+.13*(sediment-.5)+.12*(bedrock-.5)+.075*(v_tone-.5);
 albedo*=variation;
 float fineScale=(.015+.055*u_closeDetail);
 albedo*=1.0+fineScale*(micro-.5)*1.5+.018*u_closeDetail*grain;
 albedo*=1.0-.055*u_closeDetail*fracture;
 albedo=mix(albedo,albedo*vec3(1.04,1.02,.95),.1*u_closeDetail*(grain+.8));
 vec3 n=normalize(v_normal);
 float normalPhaseX=p.y*101.0+p.z*53.0;
 float normalPhaseY=p.z*89.0-p.x*111.0;
 float normalPhaseZ=p.x*91.0+p.y*77.0;
 vec3 microN=mat3(u_model)*vec3(sin(normalPhaseX)*detailBand(normalPhaseX),
   sin(normalPhaseY)*detailBand(normalPhaseY),sin(normalPhaseZ)*detailBand(normalPhaseZ));
 n=normalize(n+microN*(.003+.012*u_closeDetail));
 vec3 l=normalize(u_light);
 float raw=dot(n,l),diffuse=max(raw,0.0);
 float terminator=smoothstep(-.10,.15,raw);
 float lit=.42+diffuse*.94+pow(max(n.z,0.),1.3)*.11+.025*u_closeDetail;
 float visibility=.74+.26*terminator;
 vec3 color=albedo*lit*visibility;
 float silhouette=pow(1.-max(n.z,0.),3.5);
 color+=vec3(.12,.035,.028)*silhouette*.07;
 // Two-scale close witness receives geological information rather than larger stains.
 color*=1.+u_closeDetail*(micro-.5)*.045;
 gl_FragColor=vec4(color,1.0);
}
`;
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
function finishCamera(done){setWitnessState(done);document.querySelector(done===WITNESS.CLOSE?"[data-return-orbit]":"[data-witness-action]")?.focus({preventScroll:true})}
function updateCamera(now){if(!cameraTween)return false;const tw=cameraTween,t=clamp((now-tw.start)/tw.duration,0,1),e=ease(t),p={};for(const key of ["z","x","y","blend","spin"])p[key]=tw.from[key]+(tw.to[key]-tw.from[key])*e;applyPose(p);if(t>=1){cameraTween=null;applyPose(tw.to);finishCamera(tw.done)}return true}
function tick(now){raf=0;if(!visible)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;const cameraActive=updateCamera(now);if(gl&&resources){if(!state.reducedMotion&&state.witnessState===WITNESS.ORBIT)angle=(angle+dt*.042)%(Math.PI*2);draw()}if((!state.reducedMotion&&gl&&resources)||cameraActive||cameraTween)raf=requestAnimationFrame(tick)}
function start(){if(!visible)return;if(raf)cancelAnimationFrame(raf);last=performance.now();if(gl&&resources)draw();if((!state.reducedMotion&&gl&&resources)||cameraTween)raf=requestAnimationFrame(tick)}
function transitionCamera(to,duration,terminal){if(state.reducedMotion){cameraTween=null;applyPose(to);finishCamera(terminal);if(gl&&resources)draw();return}cameraTween={from:pose(),to,start:performance.now(),duration,done:terminal};start()}
function beginApproach(){if(state.witnessState!==WITNESS.ORBIT)return;orbitReturnAngle=angle;setWitnessState(WITNESS.APPROACH);const turn=Math.atan2(Math.sin(SIGNATURE_SCAR.closeSpin-angle),Math.cos(SIGNATURE_SCAR.closeSpin-angle));transitionCamera({z:-1.78,x:-.20,y:-.10,blend:1,spin:angle+turn},1350,WITNESS.CLOSE)}
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
function init(){markDocument();setWitnessState(WITNESS.ORBIT);initStory();initTraversal();initRenderer();REDUCED.addEventListener?.("change",onReducedMotion);document.addEventListener("visibilitychange",onVisibility);addEventListener("resize",()=>{if(gl&&resources)draw()},{passive:true});exposeStatus()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
