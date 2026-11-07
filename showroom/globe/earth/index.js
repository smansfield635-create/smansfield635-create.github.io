// /showroom/globe/earth/index.js
// ZIONTS_PASSIVE_ROTATING_PLANET_NARRATIVE_v1
// ZIONTS_BOUNDED_CINEMATIC_WITNESS_TRAVERSAL_v1
// One passive planet, one authored approach, one authored return. No planetary navigation authority.

const CONTRACT="ZIONTS_PASSIVE_ROTATING_PLANET_NARRATIVE_v1";
const TRAVERSAL_CONTRACT="ZIONTS_BOUNDED_CINEMATIC_WITNESS_TRAVERSAL_v1";
const ROUTE="/showroom/globe/earth/";
const PARENT="/showroom/globe/";
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)");
const WITNESS=Object.freeze({ORBIT:"orbit-witness",APPROACH:"cinematic-approach",CLOSE:"close-witness",RETURN:"return-to-orbit"});
const state={initialized:false,renderer:"none",webglVersion:0,reducedMotion:REDUCED.matches,frameCount:0,contextLossCount:0,contextRestoreCount:0,failureReason:null,passiveRotation:true,inputAuthority:"NONE",generatedImage:false,audraliaRuntimeImport:false,storyIndex:0,storyCount:3,witnessState:WITNESS.ORBIT,cameraZ:-2.78};
let canvas=null,gl=null,resources=null,raf=0,last=0,angle=.35,visible=!document.hidden,cameraTween=null;

function exposeStatus(){window.DGBZiontsRoute=Object.freeze({status(){return Object.freeze({contract:CONTRACT,traversalContract:TRAVERSAL_CONTRACT,route:ROUTE,parent:PARENT,publicBody:"ZIONTS",renderer:state.renderer,webglVersion:state.webglVersion,initialized:state.initialized,reducedMotion:state.reducedMotion,frameCount:state.frameCount,contextLossCount:state.contextLossCount,contextRestoreCount:state.contextRestoreCount,failureReason:state.failureReason,passiveRotation:state.passiveRotation,inputAuthority:state.inputAuthority,generatedImage:state.generatedImage,audraliaRuntimeImport:state.audraliaRuntimeImport,storyIndex:state.storyIndex,storyCount:state.storyCount,witnessState:state.witnessState,cameraZ:state.cameraZ,groundEngine:false,inspectableWorld:false,planetaryNavigation:false})}})}
function markDocument(){const markers={page:"zionts-public-child-route",route:ROUTE,contract:CONTRACT,witnessTraversalContract:TRAVERSAL_CONTRACT,publicBody:"ZIONTS",parent:PARENT,groundEngine:"false",inspectableWorld:"false",planetInputAuthority:"none",generatedImage:"false",audraliaIdentity:"false",witnessState:state.witnessState};for(const [key,value] of Object.entries(markers)){document.documentElement.dataset[key]=String(value);if(document.body)document.body.dataset[key]=String(value)}}
function setWitnessState(next){state.witnessState=next;document.documentElement.dataset.witnessState=next;if(document.body)document.body.dataset.witnessState=next;const close=document.querySelector("[data-close-witness]");if(close)close.setAttribute("aria-hidden",String(next!==WITNESS.CLOSE));exposeStatus()}
function fail(reason){state.failureReason=String(reason||"RENDERER_FAILURE");state.initialized=false;document.documentElement.dataset.ziontsRenderer="failed";exposeStatus()}
function shader(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){const info=gl.getShaderInfoLog(sh)||"SHADER_COMPILE_FAILED";gl.deleteShader(sh);throw new Error(info)}return sh}
function program(vsSource,fsSource){const vs=shader(gl.VERTEX_SHADER,vsSource),fs=shader(gl.FRAGMENT_SHADER,fsSource),p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){const info=gl.getProgramInfoLog(p)||"PROGRAM_LINK_FAILED";gl.deleteProgram(p);throw new Error(info)}return p}
function fract(v){return v-Math.floor(v)}
function hash3(x,y,z){return fract(Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453123)}
function norm3(x,y,z){const n=Math.hypot(x,y,z)||1;return[x/n,y/n,z/n]}
function dot3(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
const CRATERS=[[-.50,.25,.82,.16,.040],[.31,.62,.72,.10,.033],[.58,-.48,.65,.12,.030],[-.72,-.35,.59,.09,.024],[.14,-.77,.62,.075,.020],[.82,.12,.55,.07,.018],[-.22,.84,.49,.055,.016],[.44,.14,-.89,.11,.031],[-.62,.51,-.59,.08,.022],[.71,-.16,-.69,.06,.018],[-.19,-.61,-.77,.09,.023],[.18,.92,-.34,.07,.019],[-.83,.04,-.55,.055,.016],[.54,.74,-.39,.05,.014]].map(([x,y,z,r,d])=>({c:norm3(x,y,z),r,d}));
function relief(nx,ny,nz){const broad=Math.sin(nx*7.3+ny*2.1)*.011+Math.sin(ny*11.9-nz*4.7)*.008+Math.sin((nx+nz)*19.1)*.0045;const fine=(hash3(nx*23,ny*29,nz*31)-.5)*.007;let h=broad+fine;const n=[nx,ny,nz];for(const q of CRATERS){const d=Math.acos(Math.max(-1,Math.min(1,dot3(n,q.c))));if(d<q.r){const t=d/q.r;h+=-(1-t*t)*q.d+Math.exp(-Math.pow((t-.88)/.085,2))*q.d*.58}}const scar=Math.abs(Math.sin((nx*2.7+ny*4.1-nz*1.8)*8));if(scar<.028&&ny>-.65)h-=.010*(1-scar/.028);return Math.max(-.062,Math.min(.043,h))}
function buildSphere(latSegments=72,lonSegments=112){const positions=[],tones=[],indices=[];for(let y=0;y<=latSegments;y++){const v=y/latSegments,theta=v*Math.PI,sy=Math.cos(theta),ring=Math.sin(theta);for(let x=0;x<=lonSegments;x++){const u=x/lonSegments,phi=u*Math.PI*2,nx=ring*Math.cos(phi),ny=sy,nz=ring*Math.sin(phi),h=relief(nx,ny,nz),r=1+h;positions.push(nx*r,ny*r,nz*r);const strata=.5+.5*Math.sin(phi*3.3+theta*8.6+h*205),ridge=.5+.5*Math.sin(phi*10.7-theta*5.1);tones.push(Math.max(0,Math.min(1,.50+h*9.2+(strata-.5)*.24+(ridge-.5)*.07)))}}const row=lonSegments+1;for(let y=0;y<latSegments;y++)for(let x=0;x<lonSegments;x++){const a=y*row+x,b=a+row;indices.push(a,b,a+1,b,b+1,a+1)}const normals=new Float32Array(positions.length);for(let i=0;i<indices.length;i+=3){const ia=indices[i]*3,ib=indices[i+1]*3,ic=indices[i+2]*3,ax=positions[ia],ay=positions[ia+1],az=positions[ia+2],bx=positions[ib],by=positions[ib+1],bz=positions[ib+2],cx=positions[ic],cy=positions[ic+1],cz=positions[ic+2],abx=bx-ax,aby=by-ay,abz=bz-az,acx=cx-ax,acy=cy-ay,acz=cz-az,nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx;normals[ia]+=nx;normals[ia+1]+=ny;normals[ia+2]+=nz;normals[ib]+=nx;normals[ib+1]+=ny;normals[ib+2]+=nz;normals[ic]+=nx;normals[ic+1]+=ny;normals[ic+2]+=nz}for(let i=0;i<normals.length;i+=3){const n=norm3(normals[i],normals[i+1],normals[i+2]);normals[i]=n[0];normals[i+1]=n[1];normals[i+2]=n[2]}return{positions:new Float32Array(positions),normals,tones:new Float32Array(tones),indices:new Uint16Array(indices)}}
function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2);out.fill(0);out[0]=f/aspect;out[5]=f;out[10]=(far+near)/(near-far);out[11]=-1;out[14]=2*far*near/(near-far);return out}
function multiply(out,a,b){const r=new Float32Array(16);for(let c=0;c<4;c++)for(let row=0;row<4;row++)r[c*4+row]=a[row]*b[c*4]+a[4+row]*b[c*4+1]+a[8+row]*b[c*4+2]+a[12+row]*b[c*4+3];out.set(r);return out}
function rotationTiltY(out,tilt,spin){const cx=Math.cos(tilt),sx=Math.sin(tilt),cy=Math.cos(spin),sy=Math.sin(spin);out.set([cy,sx*sy,-cx*sy,0,0,cx,sx,0,sy,-sx*cy,cx*cy,0,0,0,0,1]);return out}
function translationZ(out,z){out.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,z,1]);return out}
function createResources(){gl=canvas.getContext("webgl",{alpha:true,antialias:true,depth:true,powerPreference:"high-performance",premultipliedAlpha:true,preserveDrawingBuffer:false})||canvas.getContext("experimental-webgl",{alpha:true,antialias:true,depth:true,powerPreference:"high-performance",premultipliedAlpha:true,preserveDrawingBuffer:false});if(!gl)throw new Error("WEBGL_UNAVAILABLE");state.webglVersion=1;state.renderer="webgl1";const derivativeSupport=!!gl.getExtension("OES_standard_derivatives");const vs=`precision highp float;attribute vec3 a_position;attribute vec3 a_normal;attribute float a_tone;uniform mat4 u_mvp;uniform mat4 u_model;varying vec3 v_normal;varying float v_tone;varying vec3 v_position;varying vec3 v_body;void main(){vec4 world=u_model*vec4(a_position,1.0);v_position=world.xyz;v_body=a_position;v_normal=-normalize((u_model*vec4(a_normal,0.0)).xyz);v_tone=a_tone;gl_Position=u_mvp*vec4(a_position,1.0);}`;const fs=`precision highp float;
varying vec3 v_normal;varying float v_tone;varying vec3 v_position;varying vec3 v_body;
uniform vec3 u_light;uniform mat4 u_model;
float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);}
void crater(vec3 q,vec3 center,float radius,float depth,inout vec3 g,inout float pit,inout float lip){
float dc=clamp(dot(q,center),-1.0,1.0);
if(dc>cos(radius)){
float t=acos(dc)/radius;
float z=(t-.88)/.085;
float e=exp(-z*z);
float slope=2.0*t*depth-2.0*z*e*depth*.58/.085;
g-=center*(slope/(radius*sqrt(max(.0001,1.0-dc*dc))));
pit=max(pit,1.0-smoothstep(.25,.78,t));lip=max(lip,e);
}
}
void main(){
vec3 q=normalize(v_body);
vec3 g=.011*cos(q.x*7.3+q.y*2.1)*vec3(7.3,2.1,0.0)+.008*cos(q.y*11.9-q.z*4.7)*vec3(0.0,11.9,-4.7)+.0045*cos((q.x+q.z)*19.1)*vec3(19.1,0.0,19.1);
float pit=0.0,lip=0.0;
crater(q,vec3(-0.50381830,0.25190915,0.82626201),0.160000,0.040000,g,pit,lip);
crater(q,vec3(0.31017064,0.62034128,0.72039633),0.100000,0.033000,g,pit,lip);
crater(q,vec3(0.58312813,-0.48258879,0.65350566),0.120000,0.030000,g,pit,lip);
crater(q,vec3(-0.72399297,-0.35194103,0.59327202),0.090000,0.024000,g,pit,lip);
crater(q,vec3(0.14021751,-0.77119628,0.62096324),0.075000,0.020000,g,pit,lip);
crater(q,vec3(0.82442252,0.12064720,0.55296633),0.070000,0.018000,g,pit,lip);
crater(q,vec3(-0.22065189,0.84248902,0.49145193),0.055000,0.016000,g,pit,lip);
crater(q,vec3(0.43883861,0.13963047,-0.88765083),0.110000,0.031000,g,pit,lip);
crater(q,vec3(-0.62230681,0.51189754,-0.59219519),0.080000,0.022000,g,pit,lip);
crater(q,vec3(0.70794991,-0.15953801,-0.68800766),0.060000,0.018000,g,pit,lip);
crater(q,vec3(-0.18989559,-0.60966478,-0.76957685),0.090000,0.023000,g,pit,lip);
crater(q,vec3(0.18050613,0.92258687,-0.34095602),0.070000,0.019000,g,pit,lip);
crater(q,vec3(-0.83292034,0.04014074,-0.55193517),0.055000,0.016000,g,pit,lip);
crater(q,vec3(0.54236444,0.74324016,-0.39170765),0.050000,0.014000,g,pit,lip);
g-=q*dot(q,g);
vec3 localNormal=normalize(q-.34*g);
vec3 surfaceNormal=normalize((u_model*vec4(localNormal,0.0)).xyz);
vec3 n=normalize(mix(normalize(v_normal),surfaceNormal,.62));
vec3 l=normalize(u_light);
float ndl=max(dot(n,l),0.0);float sculpt=mix(ndl,smoothstep(.08,.88,ndl),.34);
float facing=max(n.z,0.0);float rim=pow(1.0-facing,3.0);
float rock=noise3(q*37.0);
vec3 warp=q+.0035*vec3(sin(q.y*17.0+q.z*11.0),sin(q.z*13.0-q.x*9.0),sin(q.x*19.0+q.y*7.0));
float grainMeso=noise3(warp*94.0+vec3(11.1,4.7,2.3))-.5;
float grainFine=noise3(warp*167.0+vec3(5.4,13.2,1.7))-.5;
#ifdef ZIONTS_DERIVATIVES
float pixelFootprint=max(length(dFdx(q)),length(dFdy(q)));
float mesoFade=1.0-smoothstep(.30,.90,pixelFootprint*94.0);
float fineFade=1.0-smoothstep(.22,.72,pixelFootprint*167.0);
float sedimentFade=1.0-smoothstep(.40,1.15,pixelFootprint*74.0);
#else
float mesoFade=.55, fineFade=.20, sedimentFade=.85;
#endif
float grainVisibility=smoothstep(.10,.55,facing)*(1.0-.25*pit);
float sediment=.5+.5*sin(warp.y*74.0+warp.x*21.0+2.0*sin(warp.z*17.0));
vec3 low=vec3(.090,.047,.042);vec3 mid=vec3(.335,.130,.088);vec3 high=vec3(.660,.315,.195);
float definedTone=clamp((v_tone-.5)*1.26+.5,0.0,1.0);
vec3 albedo=mix(low,mid,clamp(definedTone*.96+.10,0.0,1.0));
albedo=mix(albedo,high,pow(definedTone,2.0)*.54);
albedo*=.91+.19*(rock-.5)+.049*sedimentFade*(sediment-.5)+grainVisibility*(.24*mesoFade*grainMeso+.095*fineFade*grainFine)-.085*pit+.040*lip;
float terminator=smoothstep(-.07,.10,dot(n,l));
vec3 color=albedo*(.32+sculpt*1.08);color*=.65+terminator*.35;
color+=vec3(.36,.10,.06)*rim*.15;
color+=vec3(.18,.06,.038)*pow(max(dot(n,normalize(l+vec3(0.0,0.0,1.0))),0.0),20.0)*.20;
gl_FragColor=vec4(pow(clamp(color,vec3(0.0),vec3(1.0)),vec3(.95)),1.0);
}`;const fsSource=derivativeSupport?"#extension GL_OES_standard_derivatives : enable\n#define ZIONTS_DERIVATIVES 1\n"+fs:fs;const p=program(vs,fsSource),mesh=buildSphere();function buffer(target,data){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b}const position=buffer(gl.ARRAY_BUFFER,mesh.positions),normal=buffer(gl.ARRAY_BUFFER,mesh.normals),tone=buffer(gl.ARRAY_BUFFER,mesh.tones),index=buffer(gl.ELEMENT_ARRAY_BUFFER,mesh.indices);return{program:p,position,normal,tone,index,count:mesh.indices.length,aPosition:gl.getAttribLocation(p,"a_position"),aNormal:gl.getAttribLocation(p,"a_normal"),aTone:gl.getAttribLocation(p,"a_tone"),uMvp:gl.getUniformLocation(p,"u_mvp"),uModel:gl.getUniformLocation(p,"u_model"),uLight:gl.getUniformLocation(p,"u_light")}}
function resize(){if(!canvas||!gl)return;const rect=canvas.getBoundingClientRect(),mobile=matchMedia("(max-width: 640px)").matches,budget=mobile?2000000:2500000,area=Math.max(1,rect.width*rect.height),dpr=Math.min((devicePixelRatio||1)*1.10,2.25,Math.sqrt(budget/area)),w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
function draw(){if(!gl||!resources)return;resize();gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.BLEND);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(resources.program);const aspect=canvas.width/Math.max(1,canvas.height),projection=perspective(new Float32Array(16),Math.PI/3.45,aspect,.1,20),view=translationZ(new Float32Array(16),state.cameraZ),model=rotationTiltY(new Float32Array(16),-.18,angle),pv=multiply(new Float32Array(16),projection,view),mvp=multiply(new Float32Array(16),pv,model);gl.bindBuffer(gl.ARRAY_BUFFER,resources.position);gl.enableVertexAttribArray(resources.aPosition);gl.vertexAttribPointer(resources.aPosition,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,resources.normal);gl.enableVertexAttribArray(resources.aNormal);gl.vertexAttribPointer(resources.aNormal,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,resources.tone);gl.enableVertexAttribArray(resources.aTone);gl.vertexAttribPointer(resources.aTone,1,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,resources.index);gl.uniformMatrix4fv(resources.uMvp,false,mvp);gl.uniformMatrix4fv(resources.uModel,false,model);gl.uniform3f(resources.uLight,.78,.48,.66);gl.drawElements(gl.TRIANGLES,resources.count,gl.UNSIGNED_SHORT,0);state.frameCount++}
function ease(t){return 1-Math.pow(1-t,3)}
function updateCamera(now){if(!cameraTween)return false;const t=Math.min(1,Math.max(0,(now-cameraTween.start)/cameraTween.duration)),e=ease(t);state.cameraZ=cameraTween.from+(cameraTween.to-cameraTween.from)*e;if(t>=1){const done=cameraTween.done;cameraTween=null;state.cameraZ=done===WITNESS.CLOSE?-2.02:-2.78;setWitnessState(done);if(done===WITNESS.CLOSE){document.querySelector("[data-return-orbit]")?.focus({preventScroll:true})}else{document.querySelector("[data-planet-approach]")?.focus({preventScroll:true})}}return true}
function tick(now){raf=0;if(!visible)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;const cameraActive=updateCamera(now);if(gl&&resources){if(!state.reducedMotion)angle=(angle+dt*.042)%(Math.PI*2);draw()}if((!state.reducedMotion&&gl&&resources)||cameraActive||cameraTween)raf=requestAnimationFrame(tick)}
function start(){if(!visible)return;if(raf)cancelAnimationFrame(raf);last=performance.now();if(gl&&resources)draw();if((!state.reducedMotion&&gl&&resources)||cameraTween)raf=requestAnimationFrame(tick)}
function transitionCamera(to,duration,terminal){if(state.reducedMotion){state.cameraZ=to;cameraTween=null;setWitnessState(terminal);if(gl&&resources)draw();return}cameraTween={from:state.cameraZ,to,start:performance.now(),duration,done:terminal};start()}
function beginApproach(){if(state.witnessState!==WITNESS.ORBIT)return;setWitnessState(WITNESS.APPROACH);transitionCamera(-2.02,1250,WITNESS.CLOSE)}
function beginReturn(){if(state.witnessState!==WITNESS.CLOSE)return;setWitnessState(WITNESS.RETURN);transitionCamera(-2.78,1050,WITNESS.ORBIT)}
function onContextLost(event){event.preventDefault();state.contextLossCount++;if(raf)cancelAnimationFrame(raf);raf=0;state.initialized=false;document.documentElement.dataset.ziontsRenderer="failed";exposeStatus()}
function onContextRestored(){state.contextRestoreCount++;try{resources=createResources();state.initialized=true;state.failureReason=null;document.documentElement.dataset.ziontsRenderer="ready";exposeStatus();start()}catch(error){fail(error?.message||"CONTEXT_RESTORE_FAILED")}}
function initRenderer(){canvas=document.getElementById("ziontsPlanet");if(!canvas)return fail("PLANET_CANVAS_MISSING");canvas.setAttribute("aria-hidden","true");canvas.style.pointerEvents="none";canvas.addEventListener("webglcontextlost",onContextLost,false);canvas.addEventListener("webglcontextrestored",onContextRestored,false);try{resources=createResources();state.initialized=true;state.failureReason=null;document.documentElement.dataset.ziontsRenderer="ready";exposeStatus();start()}catch(error){fail(error?.message||"PLANET_INIT_FAILED")}}
function initStory(){const root=document.querySelector("[data-story-carousel]");if(!root)return;const panels=[...root.querySelectorAll("[data-story-panel]")],steps=[...root.querySelectorAll("[data-story-index]")],controls=root.querySelector("[data-story-controls]"),count=root.querySelector("[data-story-count]"),stage=root.querySelector("[data-story-stage]"),prev=root.querySelector("[data-story-prev]"),next=root.querySelector("[data-story-next]");if(!panels.length||panels.length!==steps.length||!controls||!stage||!prev||!next)return;state.storyCount=panels.length;let index=0,touchX=null;function select(nextIndex,focus=false){index=(nextIndex+panels.length)%panels.length;state.storyIndex=index;panels.forEach((panel,i)=>{const active=i===index;panel.dataset.active=String(active);panel.setAttribute("aria-hidden",String(!active))});steps.forEach((step,i)=>{const active=i===index;step.setAttribute("aria-selected",String(active));step.tabIndex=active?0:-1});count.textContent=`${index+1} of ${panels.length}`;if(focus)steps[index].focus();exposeStatus()}steps.forEach((step,i)=>step.addEventListener("click",()=>select(i)));prev.addEventListener("click",()=>select(index-1,true));next.addEventListener("click",()=>select(index+1,true));stage.addEventListener("touchstart",event=>{touchX=event.changedTouches?.[0]?.clientX??null},{passive:true});stage.addEventListener("touchend",event=>{if(touchX===null)return;const end=event.changedTouches?.[0]?.clientX??touchX,delta=end-touchX;touchX=null;if(Math.abs(delta)>54)select(index+(delta<0?1:-1))},{passive:true});controls.hidden=false;document.documentElement.dataset.ziontsStory="ready";select(0)}
function initTraversal(){document.querySelector("[data-planet-approach]")?.addEventListener("click",beginApproach);document.querySelector("[data-return-orbit]")?.addEventListener("click",beginReturn)}
function onReducedMotion(){state.reducedMotion=REDUCED.matches;if(state.reducedMotion&&cameraTween){const terminal=cameraTween.done;state.cameraZ=terminal===WITNESS.CLOSE?-2.02:-2.78;cameraTween=null;setWitnessState(terminal)}exposeStatus();start()}
function onVisibility(){visible=!document.hidden;if(visible)start();else if(raf){cancelAnimationFrame(raf);raf=0}}
function init(){markDocument();initStory();initTraversal();initRenderer();REDUCED.addEventListener?.("change",onReducedMotion);document.addEventListener("visibilitychange",onVisibility);addEventListener("resize",()=>{if(gl&&resources)draw()},{passive:true});exposeStatus()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
