import{WORLD_RADIUS,MAP_WINDOW,GRATITUDE,mapToLatLon,latLonToMap,isLand,terrainHeight,scaleName,mix}from'./world.mjs';
const canvas=document.querySelector('#scene'),fallback=document.querySelector('#fallback'),readout=document.querySelector('#scale-readout'),worldEl=document.querySelector('#world');
const gl=canvas.getContext('webgl',{antialias:true,alpha:true,preserveDrawingBuffer:false});
if(!gl){fallback.hidden=false;throw new Error('WEBGL_UNAVAILABLE');}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rad=d=>d*Math.PI/180;
const VERT=`attribute vec3 p;attribute vec3 n;attribute vec4 c;uniform mat4 vp;uniform vec3 eye;varying vec3 N;varying vec3 W;varying vec4 C;void main(){W=p;N=n;C=c;gl_Position=vp*vec4(p,1.);}`;
const FRAG=`precision highp float;varying vec3 N;varying vec3 W;varying vec4 C;uniform vec3 eye;uniform vec3 sun;uniform float time;void main(){vec3 nn=normalize(N),v=normalize(eye-W),l=normalize(sun);float d=max(dot(nn,l),0.0),rim=pow(1.0-max(dot(nn,v),0.0),2.3);vec3 col=C.rgb*(.38+.70*d);if(C.a<.45){float spec=pow(max(dot(reflect(-l,nn),v),0.0),48.0);col=mix(col,vec3(.25,.58,.72),rim*.48)+spec*.42;}else{col+=vec3(.08,.10,.055)*rim*.30;}float haze=pow(rim,1.7);col=mix(col,vec3(.48,.68,.76),haze*.18);gl_FragColor=vec4(col,1.);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'SHADER');return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VERT));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'LINK');gl.useProgram(program);
const loc={p:gl.getAttribLocation(program,'p'),n:gl.getAttribLocation(program,'n'),c:gl.getAttribLocation(program,'c'),vp:gl.getUniformLocation(program,'vp'),eye:gl.getUniformLocation(program,'eye'),sun:gl.getUniformLocation(program,'sun'),time:gl.getUniformLocation(program,'time')};
const positions=[],normals=[],colors=[],indices=[];
const LAT=112,LON=176;
function sphere(lat,lon,r){const la=rad(lat),lo=rad(lon),cl=Math.cos(la);return[cl*Math.cos(lo)*r,Math.sin(la)*r,cl*Math.sin(lo)*r];}
for(let y=0;y<=LAT;y++)for(let x=0;x<=LON;x++){
  const lat=mix(-89.5,89.5,y/LAT),lon=mix(-180,180,x/LON),insideWindow=lat>=MAP_WINDOW.latMin&&lat<=MAP_WINDOW.latMax&&lon>=MAP_WINDOW.lonMin&&lon<=MAP_WINDOW.lonMax;
  let land=false,h=0;
  if(insideWindow){const m=latLonToMap(lat,lon);land=isLand(m.u,m.v);h=land?terrainHeight(m.u,m.v):0;}
  const p=sphere(lat,lon,WORLD_RADIUS+h),n=sphere(lat,lon,1);positions.push(...p);normals.push(...n);
  if(land){const t=clamp(h/.036,0,1);colors.push(.14+.19*t,.31+.24*t,.16+.13*t,1);}else{const deep=.5+.5*Math.sin(rad(lat));colors.push(.025,.16+.035*deep,.245+.055*deep,.25);}
}
for(let y=0;y<LAT;y++)for(let x=0;x<LON;x++){const a=y*(LON+1)+x,b=a+1,c=a+(LON+1),d=c+1;indices.push(a,c,b,b,c,d);}
function buffer(target,data,type=gl.FLOAT){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,type===gl.FLOAT?new Float32Array(data):new Uint16Array(data),gl.STATIC_DRAW);return b;}
const bp=buffer(gl.ARRAY_BUFFER,positions),bn=buffer(gl.ARRAY_BUFFER,normals),bc=buffer(gl.ARRAY_BUFFER,colors),bi=buffer(gl.ELEMENT_ARRAY_BUFFER,indices,gl.UNSIGNED_SHORT);
function attrib(buf,loc,size){gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);}attrib(bp,loc.p,3);attrib(bn,loc.n,3);attrib(bc,loc.c,4);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,bi);
function mul(a,b){const o=new Float32Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)o[r*4+c]+=a[r*4+k]*b[k*4+c];return o;}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const l=Math.hypot(...a)||1;return a.map(v=>v/l);};
function lookAt(e,t,up){const z=norm(sub(e,t)),x=norm(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,e),-dot(y,e),-dot(z,e),1]);}
const g=mapToLatLon(GRATITUDE.u,GRATITUDE.v);
const state={lat:g.lat-2.4,lon:g.lon+1.7,alt:2.4,pointers:new Map(),lastPinch:null};
function targetFrame(){const lat=rad(state.lat),lon=rad(state.lon),n=norm([Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)]),east=norm([-Math.sin(lon),0,Math.cos(lon)]),north=norm(cross(n,east));const m=latLonToMap(state.lat,state.lon),h=(state.lat>=MAP_WINDOW.latMin&&state.lat<=MAP_WINDOW.latMax&&state.lon>=MAP_WINDOW.lonMin&&state.lon<=MAP_WINDOW.lonMax)?terrainHeight(m.u,m.v):0,p=n.map(v=>v*(WORLD_RADIUS+h));return{n,east,north,p};}
function resize(){const d=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.floor(innerWidth*d)),h=Math.max(1,Math.floor(innerHeight*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}}
function render(now){resize();const f=targetFrame(),alt=state.alt,tilt=mix(.2,1.1,1-clamp((alt-.04)/2.8,0,1));const eye=[f.p[0]+f.n[0]*alt-f.north[0]*alt*.36*tilt,f.p[1]+f.n[1]*alt-f.north[1]*alt*.36*tilt,f.p[2]+f.n[2]*alt-f.north[2]*alt*.36*tilt],ahead=[f.p[0]+f.north[0]*alt*.25*tilt,f.p[1]+f.north[1]*alt*.25*tilt,f.p[2]+f.north[2]*alt*.25*tilt];const P=perspective(rad(mix(48,62,clamp((.5-alt)/.5,0,1))),canvas.width/canvas.height,.002,20),V=lookAt(eye,ahead,f.n),VP=mul(P,V);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.uniformMatrix4fv(loc.vp,false,VP);gl.uniform3fv(loc.eye,eye);gl.uniform3fv(loc.sun,new Float32Array([2.4,1.7,-1.2]));gl.uniform1f(loc.time,now*.001);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);readout.textContent=scaleName(alt);requestAnimationFrame(render);}requestAnimationFrame(render);
function mark(){worldEl.classList.add('interacted');}
function travel(dx,dy){const k=(.012+state.alt*.05);state.lon=clamp(state.lon-dx*k,MAP_WINDOW.lonMin-28,MAP_WINDOW.lonMax+28);state.lat=clamp(state.lat+dy*k,-72,72);mark();}
function zoom(delta){state.alt=clamp(state.alt*Math.exp(delta),.018,3.2);mark();}
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY*.0012)},{passive:false});
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});state.lastPinch=null;mark();});
canvas.addEventListener('pointermove',e=>{if(!state.pointers.has(e.pointerId))return;const prev=state.pointers.get(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const pts=[...state.pointers.values()];if(pts.length===1){travel(e.clientX-prev.x,e.clientY-prev.y);}else if(pts.length>=2){const d=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),mx=(pts[0].x+pts[1].x)/2,my=(pts[0].y+pts[1].y)/2;if(state.lastPinch){zoom((state.lastPinch.d-d)*.004);travel(mx-state.lastPinch.mx,my-state.lastPinch.my);}state.lastPinch={d,mx,my};}});
function release(e){state.pointers.delete(e.pointerId);state.lastPinch=null;}canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
