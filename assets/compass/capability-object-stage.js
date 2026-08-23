(()=>{
'use strict';
const VERSION='CAPABILITY_OBJECT_STAGE_v2';
const M=Math;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const scenes=new WeakMap();
function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'shader');return s}
function program(gl,mode='material'){
 const vs=`attribute vec3 aP,aN,aC;uniform mat4 uM;uniform float uAspect;varying vec3 vN,vP,vC;void main(){vec4 p=uM*vec4(aP,1.0);vP=p.xyz;vN=normalize(mat3(uM)*aN);vC=aC;float sx=.94/max(uAspect,1.0);gl_Position=vec4(p.x*sx,p.y*.78+.03,p.z*.24,1.0);}`;
 const geometry=mode==='geometry';
 const fs=geometry?`precision mediump float;varying vec3 vN,vP,vC;void main(){vec3 n=normalize(vN);vec3 view=normalize(vec3(0.,.05,2.4)-vP);vec3 key=normalize(vec3(-.58,.72,.42));vec3 fill=normalize(vec3(.62,.16,.62));float kd=max(dot(n,key),0.);float fd=max(dot(n,fill),0.);float rim=pow(1.-max(dot(n,view),0.),2.0);float depth=.54+.22*clamp(vP.z+.7,0.,1.4);vec3 base=vec3(.54,.56,.58)*(.32+.62*kd+.12*fd)*depth;vec3 edge=vec3(.86,.88,.90)*rim*.16;gl_FragColor=vec4(base+edge,1.0);}`:`precision mediump float;varying vec3 vN,vP,vC;void main(){vec3 n=normalize(vN);vec3 view=normalize(vec3(0.,.10,2.2)-vP);vec3 key=normalize(vec3(-.52,.74,.58));vec3 fill=normalize(vec3(.62,.08,.78));vec3 low=normalize(vec3(-.16,-.72,.42));float kd=max(dot(n,key),0.);float fd=max(dot(n,fill),0.);float ld=max(dot(n,low),0.);float rim=pow(1.-max(dot(n,view),0.),2.35);float spec=pow(max(dot(reflect(-key,n),view),0.),42.);float cavity=.46+.48*max(n.y*.42+n.z*.58,0.);vec3 base=mix(vec3(.052,.015,.027),vC,.31+.54*kd+.10*fd+.05*ld)*cavity;vec3 cool=vec3(.30,.64,.74)*(fd*.045+rim*.15);vec3 warm=vec3(1.0,.76,.70)*spec*.19;gl_FragColor=vec4(base+cool+warm,.996);}`;
 const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p)||'link');return p
}
function matrix(yaw,pitch,scale=1){const cy=M.cos(yaw),sy=M.sin(yaw),cx=M.cos(pitch),sx=M.sin(pitch);return new Float32Array([cy*scale,sy*sx*scale,sy*cx*scale,0,0,cx*scale,-sx*scale,0,-sy*scale,cy*sx*scale,cy*cx*scale,0,0,0,0,1])}
function mount(canvas,{meshFactory,foreground=()=>true,initialYaw=.32,initialPitch=-.05,spin=.000105,scale=1,dataset={},inspectionMode='material'}={}){
 if(!canvas||typeof meshFactory!=='function')return null;if(scenes.has(canvas))return scenes.get(canvas);
 canvas.hidden=false;Object.assign(canvas.style,{display:'block',width:'100%',height:'100%',touchAction:'none'});
 let gl=null;try{gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true})||canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true})}catch(e){}
 if(!gl){canvas.dataset.objectStage='WEBGL_REQUIRED';canvas.dataset.objectStageFailure='webgl-context-unavailable';return null}
 const pr=program(gl,inspectionMode),mesh=meshFactory(gl);const loc={p:gl.getAttribLocation(pr,'aP'),n:gl.getAttribLocation(pr,'aN'),c:gl.getAttribLocation(pr,'aC'),m:gl.getUniformLocation(pr,'uM'),aspect:gl.getUniformLocation(pr,'uAspect')};
 Object.assign(canvas.dataset,{objectStage:VERSION,objectDepthModel:'TRUE_WEBGL_GEOMETRY',objectInspectionMode:inspectionMode,objectTriangleCount:String(mesh.triangles||mesh.count/3),...dataset});
 let yaw=initialYaw,pitch=initialPitch,targetYaw=yaw,targetPitch=pitch,drag=false,lastX=0,lastY=0,raf=0,last=0,visible=true,pageOn=!document.hidden;
 const bind=(b,l)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,3,gl.FLOAT,false,0,0)};
 const resize=()=>{const r=canvas.getBoundingClientRect(),cap=innerWidth<640?1.35:innerWidth<1000?1.65:1.9,d=M.min(devicePixelRatio||1,cap),w=M.max(2,M.round(r.width*d)),h=M.max(2,M.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}};
 const anim=()=>!reduce.matches&&visible&&pageOn&&foreground();
 function draw(t=performance.now()){raf=0;resize();const dt=M.min(40,t-last||16);last=t;if(!drag&&anim())targetYaw+=dt*spin;yaw+=(targetYaw-yaw)*.11;pitch+=(targetPitch-pitch)*.11;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(pr);gl.uniformMatrix4fv(loc.m,false,matrix(yaw,pitch,scale));gl.uniform1f(loc.aspect,canvas.width/M.max(1,canvas.height));bind(mesh.p,loc.p);bind(mesh.n,loc.n);bind(mesh.c,loc.c);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.i);gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);canvas.dataset.objectFrames=String((+canvas.dataset.objectFrames||0)+1);if(anim()||drag)raf=requestAnimationFrame(draw)}
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(draw)};
 const down=e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);schedule()};
 const move=e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;targetYaw+=dx*.0085;targetPitch=M.max(-.72,M.min(.62,targetPitch+dy*.0065));schedule()};
 const up=e=>{drag=false;canvas.releasePointerCapture?.(e.pointerId);schedule()};
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 const ro=new ResizeObserver(schedule);ro.observe(canvas);const io=new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);schedule()},{rootMargin:'120px'});io.observe(canvas);document.addEventListener('visibilitychange',()=>{pageOn=!document.hidden;schedule()});schedule();
 const api=Object.freeze({canvas,renderer:VERSION,capture:()=>{draw();return{renderer:VERSION,yaw,pitch}},inspect:()=>({renderer:VERSION,inspectionMode,triangles:mesh.triangles||mesh.count/3,yaw,pitch,foreground:foreground()}),destroy:()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect()}});scenes.set(canvas,api);return api
}
window.CapabilityObjectStage=Object.freeze({version:VERSION,mount});
})();