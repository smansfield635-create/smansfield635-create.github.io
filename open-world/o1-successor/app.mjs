import{WORLD_RADIUS,MAP_WINDOW,GRATITUDE,mapToLatLon,latLonToMap,isLand,terrainHeight,scaleName,mix}from'./world.mjs';
let canvas=document.querySelector('#scene');
const fallback=document.querySelector('#fallback'),readout=document.querySelector('#scale-readout'),worldEl=document.querySelector('#world');
const setBoot=(stage,renderer='',error='')=>{worldEl.dataset.bootStage=stage;if(renderer)worldEl.dataset.renderer=renderer;if(error)worldEl.dataset.bootError=String(error).slice(0,240);window.__O1_BOOT__={stage,renderer:renderer||null,error:error?String(error):null};};
let firstFrameSeen=false;const markFirstFrame=renderer=>{if(firstFrameSeen)return;firstFrameSeen=true;worldEl.dataset.firstFrame='true';fallback.hidden=true;setBoot('FIRST_FRAME',renderer);};
setBoot('MODULE_EXECUTING');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rad=d=>d*Math.PI/180;
const g=mapToLatLon(GRATITUDE.u,GRATITUDE.v);
const state={lat:g.lat-2.4,lon:g.lon+1.7,alt:2.4,pointers:new Map(),lastPinch:null};
let renderFrame=()=>{};
function mark(){worldEl.classList.add('interacted');}
function travel(dx,dy){const k=.012+state.alt*.05;state.lon=clamp(state.lon-dx*k,MAP_WINDOW.lonMin-28,MAP_WINDOW.lonMax+28);state.lat=clamp(state.lat+dy*k,-72,72);mark();}
function zoom(delta){state.alt=clamp(state.alt*Math.exp(delta),.018,3.2);mark();}
function bindInput(target){
 target.style.touchAction='none';
 target.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY*.0012)},{passive:false});
 target.addEventListener('pointerdown',e=>{target.setPointerCapture?.(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});state.lastPinch=null;mark();});
 target.addEventListener('pointermove',e=>{if(!state.pointers.has(e.pointerId))return;const prev=state.pointers.get(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const pts=[...state.pointers.values()];if(pts.length===1)travel(e.clientX-prev.x,e.clientY-prev.y);else if(pts.length>=2){const d=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),mx=(pts[0].x+pts[1].x)/2,my=(pts[0].y+pts[1].y)/2;if(state.lastPinch){zoom((state.lastPinch.d-d)*.004);travel(mx-state.lastPinch.mx,my-state.lastPinch.my);}state.lastPinch={d,mx,my};}});
 const release=e=>{state.pointers.delete(e.pointerId);state.lastPinch=null;};target.addEventListener('pointerup',release);target.addEventListener('pointercancel',release);
}
function replaceCanvas(){const next=canvas.cloneNode(false);canvas.replaceWith(next);canvas=next;bindInput(canvas);return canvas;}
function sphere(lat,lon,r){const la=rad(lat),lo=rad(lon),cl=Math.cos(la);return[cl*Math.cos(lo)*r,Math.sin(la)*r,cl*Math.sin(lo)*r];}
function startWebGL(target){
 let gl=null,kind='';
 for(const name of ['webgl','webgl2','experimental-webgl']){try{gl=target.getContext(name,{antialias:true,alpha:true,preserveDrawingBuffer:false,powerPreference:'high-performance'});}catch{}if(gl){kind=name;break;}}
 if(!gl)throw new Error('WEBGL_UNAVAILABLE');
 setBoot('CONTEXT_ACQUIRED',kind);
 const webgl2=kind==='webgl2';
 const VERT=webgl2?`#version 300 es\nin vec3 p;in vec3 n;in vec4 c;uniform mat4 vp;out vec3 N;out vec3 W;out vec4 C;void main(){W=p;N=n;C=c;gl_Position=vp*vec4(p,1.);}`:`attribute vec3 p;attribute vec3 n;attribute vec4 c;uniform mat4 vp;varying vec3 N;varying vec3 W;varying vec4 C;void main(){W=p;N=n;C=c;gl_Position=vp*vec4(p,1.);}`;
 const FRAG=webgl2?`#version 300 es\nprecision highp float;in vec3 N;in vec3 W;in vec4 C;uniform vec3 eye;uniform vec3 sun;uniform float time;out vec4 outColor;void main(){vec3 nn=normalize(N),v=normalize(eye-W),l=normalize(sun);float d=max(dot(nn,l),0.0),rim=pow(1.0-max(dot(nn,v),0.0),2.3);vec3 col=C.rgb*(.38+.70*d);if(C.a<.45){float spec=pow(max(dot(reflect(-l,nn),v),0.0),48.0);col=mix(col,vec3(.25,.58,.72),rim*.48)+spec*.42;}else{col+=vec3(.08,.10,.055)*rim*.30;}float haze=pow(rim,1.7);col=mix(col,vec3(.48,.68,.76),haze*.18);outColor=vec4(col,1.);}`:`precision highp float;varying vec3 N;varying vec3 W;varying vec4 C;uniform vec3 eye;uniform vec3 sun;uniform float time;void main(){vec3 nn=normalize(N),v=normalize(eye-W),l=normalize(sun);float d=max(dot(nn,l),0.0),rim=pow(1.0-max(dot(nn,v),0.0),2.3);vec3 col=C.rgb*(.38+.70*d);if(C.a<.45){float spec=pow(max(dot(reflect(-l,nn),v),0.0),48.0);col=mix(col,vec3(.25,.58,.72),rim*.48)+spec*.42;}else{col+=vec3(.08,.10,.055)*rim*.30;}float haze=pow(rim,1.7);col=mix(col,vec3(.48,.68,.76),haze*.18);gl_FragColor=vec4(col,1.);}`;
 function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'SHADER');return s;}
 const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VERT));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'LINK');gl.useProgram(program);
 const loc={p:gl.getAttribLocation(program,'p'),n:gl.getAttribLocation(program,'n'),c:gl.getAttribLocation(program,'c'),vp:gl.getUniformLocation(program,'vp'),eye:gl.getUniformLocation(program,'eye'),sun:gl.getUniformLocation(program,'sun'),time:gl.getUniformLocation(program,'time')};
 const positions=[],normals=[],colors=[],indices=[],LAT=112,LON=176;
 for(let y=0;y<=LAT;y++)for(let x=0;x<=LON;x++){const lat=mix(-89.5,89.5,y/LAT),lon=mix(-180,180,x/LON),insideWindow=lat>=MAP_WINDOW.latMin&&lat<=MAP_WINDOW.latMax&&lon>=MAP_WINDOW.lonMin&&lon<=MAP_WINDOW.lonMax;let land=false,h=0;if(insideWindow){const m=latLonToMap(lat,lon);land=isLand(m.u,m.v);h=land?terrainHeight(m.u,m.v):0;}const p=sphere(lat,lon,WORLD_RADIUS+h),n=sphere(lat,lon,1);positions.push(...p);normals.push(...n);if(land){const t=clamp(h/.036,0,1);colors.push(.14+.19*t,.31+.24*t,.16+.13*t,1);}else{const deep=.5+.5*Math.sin(rad(lat));colors.push(.025,.16+.035*deep,.245+.055*deep,.25);}}
 for(let y=0;y<LAT;y++)for(let x=0;x<LON;x++){const a=y*(LON+1)+x,b=a+1,c=a+(LON+1),d=c+1;indices.push(a,c,b,b,c,d);}
 function buffer(target,data,index=false){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,index?new Uint16Array(data):new Float32Array(data),gl.STATIC_DRAW);return b;}
 const bp=buffer(gl.ARRAY_BUFFER,positions),bn=buffer(gl.ARRAY_BUFFER,normals),bc=buffer(gl.ARRAY_BUFFER,colors),bi=buffer(gl.ELEMENT_ARRAY_BUFFER,indices,true);
 function attrib(buf,l,size){gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0);}attrib(bp,loc.p,3);attrib(bn,loc.n,3);attrib(bc,loc.c,4);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,bi);
 function mul(a,b){const o=new Float32Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
 function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
 const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const l=Math.hypot(...a)||1;return a.map(v=>v/l);};
 function lookAt(e,t,up){const z=norm(sub(e,t)),x=norm(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,e),-dot(y,e),-dot(z,e),1]);}
 function targetFrame(){const lat=rad(state.lat),lon=rad(state.lon),n=norm([Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)]),east=norm([-Math.sin(lon),0,Math.cos(lon)]),north=norm(cross(n,east));const m=latLonToMap(state.lat,state.lon),h=(state.lat>=MAP_WINDOW.latMin&&state.lat<=MAP_WINDOW.latMax&&state.lon>=MAP_WINDOW.lonMin&&state.lon<=MAP_WINDOW.lonMax)?terrainHeight(m.u,m.v):0,p=n.map(v=>v*(WORLD_RADIUS+h));return{n,east,north,p};}
 function resize(){const d=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.floor(innerWidth*d)),h=Math.max(1,Math.floor(innerHeight*d));if(target.width!==w||target.height!==h){target.width=w;target.height=h;gl.viewport(0,0,w,h);}}
 renderFrame=now=>{resize();const f=targetFrame(),alt=state.alt,tilt=mix(.2,1.1,1-clamp((alt-.04)/2.8,0,1));const eye=[f.p[0]+f.n[0]*alt-f.north[0]*alt*.36*tilt,f.p[1]+f.n[1]*alt-f.north[1]*alt*.36*tilt,f.p[2]+f.n[2]*alt-f.north[2]*alt*.36*tilt],ahead=[f.p[0]+f.north[0]*alt*.25*tilt,f.p[1]+f.north[1]*alt*.25*tilt,f.p[2]+f.north[2]*alt*.25*tilt];const P=perspective(rad(mix(48,62,clamp((.5-alt)/.5,0,1))),target.width/target.height,.002,20),V=lookAt(eye,ahead,f.n),VP=mul(P,V);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.uniformMatrix4fv(loc.vp,false,VP);gl.uniform3fv(loc.eye,eye);gl.uniform3fv(loc.sun,new Float32Array([2.4,1.7,-1.2]));gl.uniform1f(loc.time,now*.001);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);readout.textContent=scaleName(state.alt);markFirstFrame(kind);};
 setBoot('RENDERER_INITIALIZED',kind);fallback.hidden=true;
}
function startCanvas2D(target){
 const ctx=target.getContext('2d',{alpha:false});if(!ctx)throw new Error('CANVAS2D_UNAVAILABLE');setBoot('CONTEXT_ACQUIRED','canvas2d-environmental');
 function resize(){const d=Math.min(devicePixelRatio||1,1.5),w=Math.max(1,Math.floor(innerWidth*d)),h=Math.max(1,Math.floor(innerHeight*d));if(target.width!==w||target.height!==h){target.width=w;target.height=h;}}
 const vec=(lat,lon)=>{const la=rad(lat),lo=rad(lon),cl=Math.cos(la);return[cl*Math.cos(lo),Math.sin(la),cl*Math.sin(lo)];};
 const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 function basis(){const view=vec(state.lat,state.lon),lo=rad(state.lon),east=[-Math.sin(lo),0,Math.cos(lo)],north=[-view[1]*Math.cos(lo),Math.cos(rad(state.lat)),-view[1]*Math.sin(lo)];return{view,east,north};}
 function drawGlobe(w,h){
  const ctx2=ctx,scale=clamp((3.2-state.alt)/3.0,0,1),R=Math.min(w,h)*mix(.33,1.05,scale),cx=w*.5,cy=h*mix(.56,.68,scale);
  let bg=ctx2.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#031019');bg.addColorStop(.48,'#163545');bg.addColorStop(.62,'#628594');bg.addColorStop(1,'#071922');ctx2.fillStyle=bg;ctx2.fillRect(0,0,w,h);
  const halo=ctx2.createRadialGradient(cx,cy,R*.72,cx,cy,R*1.18);halo.addColorStop(0,'rgba(0,0,0,0)');halo.addColorStop(.82,'rgba(90,155,181,.12)');halo.addColorStop(1,'rgba(110,185,210,0)');ctx2.fillStyle=halo;ctx2.fillRect(0,0,w,h);
  ctx2.save();ctx2.beginPath();ctx2.arc(cx,cy,R,0,Math.PI*2);ctx2.clip();const ocean=ctx2.createLinearGradient(0,cy-R,0,cy+R);ocean.addColorStop(0,'#1f6073');ocean.addColorStop(.48,'#0c3d55');ocean.addColorStop(1,'#061d2b');ctx2.fillStyle=ocean;ctx2.fillRect(cx-R,cy-R,R*2,R*2);
  const B=basis(),rows=38,cols=52,lat0=MAP_WINDOW.latMin,lat1=MAP_WINDOW.latMax,lon0=MAP_WINDOW.lonMin,lon1=MAP_WINDOW.lonMax;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const la0=mix(lat0,lat1,y/rows),la1=mix(lat0,lat1,(y+1)/rows),lo0=mix(lon0,lon1,x/cols),lo1=mix(lon0,lon1,(x+1)/cols),cm=latLonToMap((la0+la1)/2,(lo0+lo1)/2);if(!isLand(cm.u,cm.v))continue;const pts=[[la0,lo0],[la0,lo1],[la1,lo1],[la1,lo0]].map(([la,lo])=>{const p=vec(la,lo);return{x:cx+dot(p,B.east)*R,y:cy-dot(p,B.north)*R,z:dot(p,B.view)};});if(pts.some(p=>p.z<-.03))continue;const th=terrainHeight(cm.u,cm.v),shade=clamp(.18+th*10,0,1),light=clamp(.55+.45*dot(vec((la0+la1)/2,(lo0+lo1)/2),[.55,.5,-.25]),.15,1);ctx2.fillStyle=`rgb(${Math.round((48+62*shade)*light)},${Math.round((91+70*shade)*light)},${Math.round((55+48*shade)*light)})`;ctx2.beginPath();ctx2.moveTo(pts[0].x,pts[0].y);for(let i=1;i<4;i++)ctx2.lineTo(pts[i].x,pts[i].y);ctx2.closePath();ctx2.fill();}
  const shine=ctx2.createRadialGradient(cx-R*.35,cy-R*.35,0,cx-R*.15,cy-R*.18,R*1.2);shine.addColorStop(0,'rgba(255,255,255,.14)');shine.addColorStop(.45,'rgba(255,255,255,.02)');shine.addColorStop(1,'rgba(0,0,0,.34)');ctx2.fillStyle=shine;ctx2.fillRect(cx-R,cy-R,R*2,R*2);ctx2.restore();ctx2.strokeStyle='rgba(150,211,225,.42)';ctx2.lineWidth=Math.max(1,R*.006);ctx2.beginPath();ctx2.arc(cx,cy,R,0,Math.PI*2);ctx2.stroke();
 }
 function drawLocal(w,h){
  const horizon=h*.39;let sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#06131d');sky.addColorStop(.6,'#244958');sky.addColorStop(1,'#78919a');ctx.fillStyle=sky;ctx.fillRect(0,0,w,horizon+1);let sea=ctx.createLinearGradient(0,horizon,0,h);sea.addColorStop(0,'#315f6e');sea.addColorStop(.22,'#174355');sea.addColorStop(1,'#071e2b');ctx.fillStyle=sea;ctx.fillRect(0,horizon,w,h-horizon);
  const center=latLonToMap(state.lat,state.lon),range=mix(820,210,clamp((.2-state.alt)/.18,0,1)),rows=30,cols=34;
  for(let ry=0;ry<rows;ry++){const d0=mix(range,15,ry/rows),d1=mix(range,15,(ry+1)/rows),p0=ry/rows,p1=(ry+1)/rows,y0=horizon+(h-horizon)*Math.pow(p0,.72),y1=horizon+(h-horizon)*Math.pow(p1,.72),span0=w*(.12+.88*p0),span1=w*(.12+.88*p1);for(let rx=0;rx<cols;rx++){const q0=rx/cols-.5,q1=(rx+1)/cols-.5,u=center.u+((q0+q1)*.5)*range*1.25,v=center.v-d1,land=isLand(u,v);if(!land)continue;const th=terrainHeight(u,v),lift=th*1600*(.25+.75*p1),x00=w/2+q0*span0,x01=w/2+q1*span0,x10=w/2+q0*span1,x11=w/2+q1*span1,yy0=y0-lift*.45,yy1=y1-lift;const shade=clamp(.25+th*18,0,1);ctx.fillStyle=`rgb(${Math.round(42+55*shade)},${Math.round(83+80*shade)},${Math.round(50+55*shade)})`;ctx.beginPath();ctx.moveTo(x00,yy0);ctx.lineTo(x01,yy0);ctx.lineTo(x11,yy1);ctx.lineTo(x10,yy1);ctx.closePath();ctx.fill();}}
  const haze=ctx.createLinearGradient(0,horizon-10,0,horizon+120);haze.addColorStop(0,'rgba(210,225,224,.22)');haze.addColorStop(1,'rgba(210,225,224,0)');ctx.fillStyle=haze;ctx.fillRect(0,horizon-10,w,130);
 }
 renderFrame=()=>{resize();const w=target.width,h=target.height;if(state.alt>.19)drawGlobe(w,h);else drawLocal(w,h);readout.textContent=scaleName(state.alt);markFirstFrame('canvas2d-environmental');};setBoot('RENDERER_INITIALIZED','canvas2d-environmental');fallback.hidden=true;
}
bindInput(canvas);
try{startWebGL(canvas);}catch(webglError){console.warn('O1 successor WebGL unavailable; using environmental Canvas2D fallback.',webglError);try{startCanvas2D(replaceCanvas());}catch(cpuError){setBoot('RENDERER_STARTUP_FAILED','none',cpuError?.message||cpuError);fallback.hidden=false;fallback.textContent=`Startup stopped at RENDERER_STARTUP_FAILED · ${String(cpuError?.message||cpuError).slice(0,160)}`;console.error(cpuError);}}
function loop(now){renderFrame(now);requestAnimationFrame(loop);}requestAnimationFrame(loop);
