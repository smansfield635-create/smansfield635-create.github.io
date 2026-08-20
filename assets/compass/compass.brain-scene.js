(()=>{
'use strict';

const CONTINUITY='COMPASS_OBJECT_RENDERER_CONTINUITY_v1';
const M=Math,P=M.PI,TAU=P*2;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const scenes=new WeakMap();
let primary=null;
const norm=v=>{const d=M.hypot(...v)||1;return v.map(x=>x/d)};

function setCanvasContract(canvas){
  canvas.hidden=false;
  canvas.style.display='block';
  canvas.style.width='100%';
  canvas.style.height='100%';
  canvas.style.touchAction='none';
  canvas.style.filter='brightness(1.08) saturate(1.08) contrast(1.12) drop-shadow(0 18px 20px rgba(31,7,13,.38))';
  canvas.dataset.objectContinuity=CONTINUITY;
}

function shader(gl,type,src){
  const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader');
  return s;
}

function program(gl){
  const vs=`attribute vec3 p,n,c;uniform mat4 m;uniform float aspect;varying vec3 N,P,C;void main(){P=(m*vec4(p,1.)).xyz;N=normalize(mat3(m)*n);C=c;float sx=.90/max(aspect,1.);gl_Position=vec4(P.x*sx,P.y*.72+.10,P.z*.22,1.);}`;
  const fs=`precision mediump float;varying vec3 N,P,C;void main(){vec3 n=normalize(N),key=normalize(vec3(-.42,.72,.55)),fill=normalize(vec3(.54,.08,.84)),view=normalize(vec3(0.,.10,1.9)-P);float kd=max(dot(n,key),0.),fd=max(dot(n,fill),0.),rim=pow(1.-max(dot(n,view),0.),2.4),spec=pow(max(dot(reflect(-key,n),view),0.),30.);float sulcus=.48+.38*max(n.y*.58+n.z*.42,0.);vec3 tissue=mix(vec3(.11,.045,.065),C,.28+.56*kd+.09*fd)*sulcus;vec3 cool=vec3(.32,.69,.76)*(fd*.045+rim*.11);vec3 warm=vec3(1.,.73,.65)*spec*.12;gl_FragColor=vec4(tissue+cool+warm,.985);}`;
  const p=gl.createProgram();
  gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'link');
  return p;
}

const palette={frontal:[.95,.67,.65],temporal:[.82,.47,.50],parietal:[.91,.61,.60],occipital:[.76,.39,.45],medial:[.14,.075,.095],cerebellum:[.43,.20,.24],pons:[.84,.49,.43],brainstem:[.43,.20,.24]};

function hemispherePoint(side,phi,theta){
  const vertical=M.sin(phi),ring=M.cos(phi),depth=M.sin(theta),outward=M.max(0,M.cos(theta));
  const frontal=M.exp(-M.pow((theta-.76)/.54,2))*M.exp(-M.pow((phi-.04)/.92,2));
  const parietal=M.exp(-M.pow((theta+.02)/.68,2))*M.exp(-M.pow((phi-.40)/.50,2));
  const occipital=M.exp(-M.pow((theta+.90)/.46,2))*M.exp(-M.pow((phi-.02)/.78,2));
  const temporal=M.exp(-M.pow((theta-.02)/.82,2))*M.exp(-M.pow((phi+.56)/.30,2));
  const fold=.72*M.sin(theta*7.4+phi*4.8)+.38*M.sin(theta*12.8-phi*7.1)+.18*M.sin(theta*18.4+phi*10.2)+.12*M.sin(theta*25.1-phi*15.4);
  const cross=.28*M.sin(theta*5.2-phi*9.4)+.15*M.sin(theta*14.4+phi*3.7);
  const lobe=1+.07*frontal+.045*parietal+.04*occipital+.09*temporal;
  const lr=.73*(.92+.11*temporal+.03*parietal);
  const position=[side*(.045+lr*ring*outward*lobe*(1+.11*fold+.025*cross)),.075+.70*vertical+.02*parietal-.048*temporal+.043*fold*ring+.014*cross,.015+.91*(1+.078*frontal+.042*occipital+.038*temporal)*ring*depth+.046*frontal*ring+.052*fold*ring+.016*cross];
  const base=[side*ring*outward,vertical*.76,ring*depth];
  const normal=norm([base[0]+side*(.15*fold+.05*cross)*ring,base[1]+.09*cross,base[2]+.14*fold-.045*cross]);
  const region=phi<-.27?'temporal':theta>.38?'frontal':theta<-.48?'occipital':'parietal';
  return{position,normal,region};
}

function buildMesh(gl){
  const pos=[],nor=[],col=[],idx=[],parts=[],bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
  const vertex=(p,n,c)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);p.forEach((v,a)=>{bounds.min[a]=M.min(bounds.min[a],v);bounds.max[a]=M.max(bounds.max[a],v)});return i};
  const tri=(a,b,c)=>idx.push(a,b,c);
  function hemi(side){
    const start=idx.length,rows=30,cols=48,stride=cols+1,g=[];
    for(let r=0;r<=rows;r++){const phi=-P/2+r/rows*P;for(let c=0;c<=cols;c++){const q=hemispherePoint(side,phi,-P/2+c/cols*P);g.push(vertex(q.position,q.normal,palette[q.region]))}}
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=g[r*stride+c],b=a+1,d=g[(r+1)*stride+c],e=d+1;side<0?(tri(a,e,d),tri(a,b,e)):(tri(a,d,e),tri(a,e,b))}
    parts.push({name:side<0?'left-hemisphere':'right-hemisphere',triangles:(idx.length-start)/3});
  }
  function ellipsoid(name,cx,cy,cz,rx,ry,rz,cols=30,rows=18,warp=.025,color=palette.cerebellum,folia=0){
    const start=idx.length,g=[];
    for(let r=0;r<=rows;r++){const phi=-P/2+r/rows*P;for(let c=0;c<cols;c++){const th=c/cols*TAU,relief=1+warp*(M.sin(th*6+phi*5)+.4*M.sin(th*11-phi*7))+folia*.018*M.sin(phi*24),cp=M.cos(phi);g.push(vertex([cx+rx*cp*M.cos(th)*relief,cy+ry*M.sin(phi)*relief,cz+rz*cp*M.sin(th)*relief],norm([cp*M.cos(th)/rx,M.sin(phi)/ry,cp*M.sin(th)/rz]),color))}}
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const n=(c+1)%cols,a=g[r*cols+c],b=a+1,e=g[(r+1)*cols+n],d=g[(r+1)*cols+c];tri(a,b,e);tri(a,e,d)}
    parts.push({name,triangles:(idx.length-start)/3});
  }
  function tube(name,rings,color){
    const start=idx.length,seg=24,g=[];
    rings.forEach(q=>{for(let i=0;i<seg;i++){const t=i/seg*TAU,rx=q.rx,rz=q.rz;g.push(vertex([(q.x||0)+rx*M.cos(t),q.y,q.z+rz*M.sin(t)],norm([M.cos(t),q.slope||.12,M.sin(t)]),color))}});
    for(let r=0;r<rings.length-1;r++)for(let i=0;i<seg;i++){const n=(i+1)%seg,a=g[r*seg+i],b=g[r*seg+n],e=g[(r+1)*seg+n],d=g[(r+1)*seg+i];tri(a,b,e);tri(a,e,d)}
    parts.push({name,triangles:(idx.length-start)/3});
  }
  hemi(-1);hemi(1);
  ellipsoid('cerebellum',0,-.54,-.61,.57,.27,.36,36,20,.05,palette.cerebellum,1);
  ellipsoid('pons',0,-.57,-.08,.235,.18,.22,26,16,.025,palette.pons);
  tube('brainstem',[{y:-.61,z:-.10,rx:.15,rz:.12},{y:-.78,z:-.11,rx:.12,rz:.095},{y:-.96,z:-.125,rx:.08,rz:.065},{y:-1.10,z:-.135,rx:.055,rz:.047}],palette.brainstem);
  const buffer=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
  return{positions:buffer(gl.ARRAY_BUFFER,new Float32Array(pos)),normals:buffer(gl.ARRAY_BUFFER,new Float32Array(nor)),colors:buffer(gl.ARRAY_BUFFER,new Float32Array(col)),indices:buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3,parts,bounds,depthRatio:Number(((bounds.max[2]-bounds.min[2])/(bounds.max[0]-bounds.min[0])).toFixed(3))};
}

const matrix=(yaw,pitch)=>{const cy=M.cos(yaw),sy=M.sin(yaw),cx=M.cos(pitch),sx=M.sin(pitch);return new Float32Array([cy,sy*sx,sy*cx,0,0,cx,-sx,0,-sy,cy*sx,cy*cx,0,0,0,0,1])};

function fallback2d(canvas,foreground){
  const ctx=canvas.getContext('2d');if(!ctx)return null;
  setCanvasContract(canvas);
  Object.assign(canvas.dataset,{brainRenderer:'canvas2d-anatomical-fallback-v1',brainMaterial:'NATIVE_ROSE_FLESH_V2',brainMotion:'static-fallback'});
  const grooves=(cx,cy,rx,ry,flip)=>{ctx.save();ctx.translate(cx,cy);ctx.scale(rx,ry);ctx.lineCap='round';for(let i=-7;i<=7;i++){const y=i*.075;ctx.beginPath();for(let k=0;k<=20;k++){const u=k/20,x=(u-.5)*1.35,yy=y+.055*M.sin(u*13+i*.7)+.035*M.sin(u*23-i*.4),xx=flip?-x:x;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.strokeStyle='rgba(61,17,30,.62)';ctx.lineWidth=.022;ctx.stroke()}ctx.restore()};
  function draw(){
    const r=canvas.getBoundingClientRect(),d=M.min(devicePixelRatio||1,2);canvas.width=M.max(2,M.round(r.width*d));canvas.height=M.max(2,M.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);const W=r.width,H=r.height;ctx.clearRect(0,0,W,H);
    const cx=W*.5,cy=H*.43,rx=M.min(W*.21,H*.29),ry=rx*.9;
    const halo=ctx.createRadialGradient(cx,cy,rx*.2,cx,cy,rx*2.2);halo.addColorStop(0,'rgba(225,116,132,.17)');halo.addColorStop(.6,'rgba(86,185,209,.06)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    for(const s of[-1,1]){const x=cx+s*rx*.78,g=ctx.createRadialGradient(x-rx*.25,cy-ry*.36,rx*.05,x,cy,rx);g.addColorStop(0,'#f5bbb7');g.addColorStop(.3,'#d77b83');g.addColorStop(.68,'#8f4050');g.addColorStop(1,'#32141f');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,cy,rx,ry,s<0?.08:-.08,0,TAU);ctx.fill();grooves(x,cy,rx,ry,s>0)}
    ctx.fillStyle='rgba(24,5,12,.96)';ctx.fillRect(cx-rx*.09,cy-ry*.82,rx*.18,ry*1.5);
    const cg=ctx.createRadialGradient(cx-rx*.15,cy+ry*.93,3,cx,cy+ry*.93,rx*.8);cg.addColorStop(0,'#c96670');cg.addColorStop(.58,'#7d3544');cg.addColorStop(1,'#2d111a');ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(cx,cy+ry*.88,rx*.78,ry*.34,0,0,TAU);ctx.fill();
    ctx.fillStyle='#9a4d58';ctx.beginPath();ctx.moveTo(cx-rx*.13,cy+ry*.62);ctx.quadraticCurveTo(cx-rx*.1,cy+ry*1.2,cx-rx*.06,cy+ry*1.55);ctx.lineTo(cx+rx*.06,cy+ry*1.55);ctx.quadraticCurveTo(cx+rx*.1,cy+ry*1.2,cx+rx*.13,cy+ry*.62);ctx.closePath();ctx.fill();
  }
  draw();new ResizeObserver(draw).observe(canvas);
  const api={canvas,fallback:true,draw,inspect:()=>({fallback:true,renderer:canvas.dataset.brainRenderer,foreground:foreground(),material:canvas.dataset.brainMaterial,continuity:CONTINUITY})};
  scenes.set(canvas,api);primary=api;return api;
}

function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);
  setCanvasContract(canvas);
  let gl=null;try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true})}catch{}
  if(!gl)return fallback2d(canvas,foreground);
  const pr=program(gl),mesh=buildMesh(gl),data=canvas.dataset;
  const L={p:gl.getAttribLocation(pr,'p'),n:gl.getAttribLocation(pr,'n'),c:gl.getAttribLocation(pr,'c'),m:gl.getUniformLocation(pr,'m'),aspect:gl.getUniformLocation(pr,'aspect')};
  Object.assign(data,{brainContract:'COMPASS_COHERISCOPE_ANATOMICAL_WEBGL_v6',brainRenderer:'anatomical-webgl-v6',brainMaterial:'NATIVE_ROSE_FLESH_V2',brainLighting:'directional-key,cool-environment-fill,sulcal-occlusion,soft-rim',brainDepthModel:'GEOMETRY_LIGHT_FALLOFF_FOLD_OCCLUSION_FORM_SHADOW',brainComponents:'left-hemisphere,right-hemisphere,longitudinal-fissure,cerebellum,pons,brainstem',brainMotion:reduce.matches?'static-reduced-motion':'slow-yaw',brainTriangleCount:String(mesh.triangles),brainDepthRatio:String(mesh.depthRatio),objectContinuity:CONTINUITY});
  let yaw=.34,pitch=-.04,raf=0,visible=true,pageOn=!document.hidden,last=0;
  const animate=()=>!reduce.matches&&visible&&pageOn&&foreground();
  const resize=()=>{const d=M.min(devicePixelRatio||1,innerWidth<700?1.35:1.8),r=canvas.getBoundingClientRect(),w=M.max(2,M.round(r.width*d)),h=M.max(2,M.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}};
  const bind=(b,l)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,3,gl.FLOAT,false,0,0)};
  function draw(time=performance.now()){raf=0;resize();if(animate()){const e=M.min(40,time-last||16);yaw+=e*.00010}last=time;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(pr);gl.uniformMatrix4fv(L.m,false,matrix(yaw,pitch));gl.uniform1f(L.aspect,canvas.width/M.max(1,canvas.height));bind(mesh.positions,L.p);bind(mesh.normals,L.n);bind(mesh.colors,L.c);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.indices);gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);data.brainFrames=String((Number(data.brainFrames)||0)+1);if(animate())raf=requestAnimationFrame(draw)}
  const schedule=(force=false)=>{if(!raf&&(force||animate()))raf=requestAnimationFrame(draw)};
  const io=new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);schedule(true)},{rootMargin:'120px'});io.observe(canvas);
  document.addEventListener('visibilitychange',()=>{pageOn=!document.hidden;schedule(true)});reduce.addEventListener?.('change',()=>schedule(true));
  const api={canvas,fallback:false,draw:()=>schedule(true),inspect:()=>({fallback:false,renderer:data.brainRenderer,foreground:foreground(),material:data.brainMaterial,depthRatio:mesh.depthRatio,triangles:mesh.triangles,parts:mesh.parts,motion:data.brainMotion,continuity:CONTINUITY}),capture:()=>null,restore:()=>false};
  scenes.set(canvas,api);primary=api;draw();schedule();return api;
}

const api=Object.freeze({version:'anatomical-webgl-v6-continuity',continuity:CONTINUITY,mount,inspect:()=>primary?.inspect?.()||null});
Object.defineProperty(globalThis,'CompassBrainScene',{configurable:false,enumerable:true,get:()=>api,set:()=>{}});
})();
