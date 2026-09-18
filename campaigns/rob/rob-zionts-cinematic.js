// /campaigns/rob/rob-zionts-cinematic.js
// Bounded, non-interactive ZIONTS presentation for the R.O.B. hero.
// Canonical source identity: showroom/globe/earth/index.js @ a7cbd539b582130a2f8d0340cb967f28c0bc4ecf
// This module reuses ZIONTS geometry/material language only. It creates no navigation,
// witness traversal, application state, input authority, analytics, or shared controller authority.

const field=document.querySelector("[data-rob-zionts-field]");
const canvas=document.getElementById("robZiontsPlanet");
if(field&&canvas){
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let gl=null,resources=null,raf=0,last=0,angle=.35,visible=!document.hidden;

  const fract=v=>v-Math.floor(v);
  const hash3=(x,y,z)=>fract(Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453123);
  const norm3=(x,y,z)=>{const n=Math.hypot(x,y,z)||1;return[x/n,y/n,z/n]};
  const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];

  const CRATERS=[[-.50,.25,.82,.16,.040],[.31,.62,.72,.10,.033],[.58,-.48,.65,.12,.030],[-.72,-.35,.59,.09,.024],[.14,-.77,.62,.075,.020],[.82,.12,.55,.07,.018],[-.22,.84,.49,.055,.016],[.44,.14,-.89,.11,.031],[-.62,.51,-.59,.08,.022],[.71,-.16,-.69,.06,.018],[-.19,-.61,-.77,.09,.023],[.18,.92,-.34,.07,.019],[-.83,.04,-.55,.055,.016],[.54,.74,-.39,.05,.014]].map(([x,y,z,r,d])=>({c:norm3(x,y,z),r,d}));

  function relief(nx,ny,nz){
    const broad=Math.sin(nx*7.3+ny*2.1)*.011+Math.sin(ny*11.9-nz*4.7)*.008+Math.sin((nx+nz)*19.1)*.0045;
    const fine=(hash3(nx*23,ny*29,nz*31)-.5)*.007;
    let h=broad+fine;
    const n=[nx,ny,nz];
    for(const q of CRATERS){
      const d=Math.acos(Math.max(-1,Math.min(1,dot3(n,q.c))));
      if(d<q.r){
        const t=d/q.r;
        h+=-(1-t*t)*q.d+Math.exp(-Math.pow((t-.88)/.085,2))*q.d*.58;
      }
    }
    const scar=Math.abs(Math.sin((nx*2.7+ny*4.1-nz*1.8)*8));
    if(scar<.028&&ny>-.65)h-=.010*(1-scar/.028);
    return Math.max(-.062,Math.min(.043,h));
  }

  function buildSphere(latSegments=72,lonSegments=112){
    const positions=[],tones=[],indices=[];
    for(let y=0;y<=latSegments;y++){
      const v=y/latSegments,theta=v*Math.PI,sy=Math.cos(theta),ring=Math.sin(theta);
      for(let x=0;x<=lonSegments;x++){
        const u=x/lonSegments,phi=u*Math.PI*2,nx=ring*Math.cos(phi),ny=sy,nz=ring*Math.sin(phi),h=relief(nx,ny,nz),r=1+h;
        positions.push(nx*r,ny*r,nz*r);
        const strata=.5+.5*Math.sin(phi*3.3+theta*8.6+h*205),ridge=.5+.5*Math.sin(phi*10.7-theta*5.1);
        tones.push(Math.max(0,Math.min(1,.50+h*9.2+(strata-.5)*.24+(ridge-.5)*.07)));
      }
    }
    const row=lonSegments+1;
    for(let y=0;y<latSegments;y++)for(let x=0;x<lonSegments;x++){const a=y*row+x,b=a+row;indices.push(a,b,a+1,b,b+1,a+1)}
    const normals=new Float32Array(positions.length);
    for(let i=0;i<indices.length;i+=3){
      const ia=indices[i]*3,ib=indices[i+1]*3,ic=indices[i+2]*3;
      const ax=positions[ia],ay=positions[ia+1],az=positions[ia+2],bx=positions[ib],by=positions[ib+1],bz=positions[ib+2],cx=positions[ic],cy=positions[ic+1],cz=positions[ic+2];
      const abx=bx-ax,aby=by-ay,abz=bz-az,acx=cx-ax,acy=cy-ay,acz=cz-az,nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx;
      normals[ia]+=nx;normals[ia+1]+=ny;normals[ia+2]+=nz;normals[ib]+=nx;normals[ib+1]+=ny;normals[ib+2]+=nz;normals[ic]+=nx;normals[ic+1]+=ny;normals[ic+2]+=nz;
    }
    for(let i=0;i<normals.length;i+=3){const n=norm3(normals[i],normals[i+1],normals[i+2]);normals[i]=n[0];normals[i+1]=n[1];normals[i+2]=n[2]}
    return{positions:new Float32Array(positions),normals,tones:new Float32Array(tones),indices:new Uint16Array(indices)};
  }

  function shader(type,source){
    const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){const info=gl.getShaderInfoLog(sh)||"SHADER_COMPILE_FAILED";gl.deleteShader(sh);throw new Error(info)}
    return sh;
  }
  function program(vsSource,fsSource){
    const vs=shader(gl.VERTEX_SHADER,vsSource),fs=shader(gl.FRAGMENT_SHADER,fsSource),p=gl.createProgram();
    gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)){const info=gl.getProgramInfoLog(p)||"PROGRAM_LINK_FAILED";gl.deleteProgram(p);throw new Error(info)}
    return p;
  }
  function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2);out.fill(0);out[0]=f/aspect;out[5]=f;out[10]=(far+near)/(near-far);out[11]=-1;out[14]=2*far*near/(near-far);return out}
  function multiply(out,a,b){const r=new Float32Array(16);for(let c=0;c<4;c++)for(let row=0;row<4;row++)r[c*4+row]=a[row]*b[c*4]+a[4+row]*b[c*4+1]+a[8+row]*b[c*4+2]+a[12+row]*b[c*4+3];out.set(r);return out}
  function rotationTiltY(out,tilt,spin){const cx=Math.cos(tilt),sx=Math.sin(tilt),cy=Math.cos(spin),sy=Math.sin(spin);out.set([cy,sx*sy,-cx*sy,0,0,cx,sx,0,sy,-sx*cy,cx*cy,0,0,0,0,1]);return out}
  function translationZ(out,z){out.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,z,1]);return out}

  function createResources(){
    gl=canvas.getContext("webgl",{alpha:true,antialias:true,depth:true,powerPreference:"high-performance",premultipliedAlpha:true,preserveDrawingBuffer:false})||
       canvas.getContext("experimental-webgl",{alpha:true,antialias:true,depth:true,powerPreference:"high-performance",premultipliedAlpha:true,preserveDrawingBuffer:false});
    if(!gl)throw new Error("WEBGL_UNAVAILABLE");
    const vs=`precision highp float;attribute vec3 a_position;attribute vec3 a_normal;attribute float a_tone;uniform mat4 u_mvp;uniform mat4 u_model;varying vec3 v_normal;varying float v_tone;varying vec3 v_position;void main(){vec4 world=u_model*vec4(a_position,1.0);v_position=world.xyz;v_normal=normalize((u_model*vec4(a_normal,0.0)).xyz);v_tone=a_tone;gl_Position=u_mvp*vec4(a_position,1.0);}`;
    const fs=`precision highp float;varying vec3 v_normal;varying float v_tone;varying vec3 v_position;uniform vec3 u_light;void main(){vec3 n=normalize(v_normal);vec3 l=normalize(u_light);float ndl=max(dot(n,l),0.0);float facing=max(n.z,0.0);float rim=pow(1.0-facing,3.0);float mineral=0.5+0.5*sin((v_position.x*14.0+v_position.y*18.0-v_position.z*12.0)+v_tone*8.0);float grain=0.5+0.5*sin((v_position.x-v_position.y)*37.0+v_position.z*19.0);vec3 low=vec3(0.090,0.047,0.042);vec3 mid=vec3(0.335,0.130,0.088);vec3 high=vec3(0.660,0.315,0.195);vec3 albedo=mix(low,mid,clamp(v_tone*.96+.10,0.0,1.0));albedo=mix(albedo,high,pow(clamp(v_tone,0.0,1.0),2.0)*.54);albedo*=.91+mineral*.13+grain*.038;float terminator=smoothstep(-.13,.17,dot(n,l));vec3 color=albedo*(.27+ndl*.98);color*=.65+terminator*.35;color+=vec3(.36,.10,.06)*rim*.15;color+=vec3(.18,.06,.038)*pow(max(dot(n,normalize(l+vec3(0.0,0.0,1.0))),0.0),20.0)*.20;gl_FragColor=vec4(color,1.0);}`;
    const p=program(vs,fs),mesh=buildSphere();
    const buffer=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
    const position=buffer(gl.ARRAY_BUFFER,mesh.positions),normal=buffer(gl.ARRAY_BUFFER,mesh.normals),tone=buffer(gl.ARRAY_BUFFER,mesh.tones),index=buffer(gl.ELEMENT_ARRAY_BUFFER,mesh.indices);
    return{program:p,position,normal,tone,index,count:mesh.indices.length,aPosition:gl.getAttribLocation(p,"a_position"),aNormal:gl.getAttribLocation(p,"a_normal"),aTone:gl.getAttribLocation(p,"a_tone"),uMvp:gl.getUniformLocation(p,"u_mvp"),uModel:gl.getUniformLocation(p,"u_model"),uLight:gl.getUniformLocation(p,"u_light")};
  }

  function resize(){
    if(!gl)return;
    const rect=canvas.getBoundingClientRect(),mobile=matchMedia("(max-width: 640px)").matches,cap=mobile?2:2.25,dpr=Math.min(devicePixelRatio||1,cap),w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
  }

  function draw(){
    if(!gl||!resources)return;
    resize();
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.BLEND);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(resources.program);
    const aspect=canvas.width/Math.max(1,canvas.height),projection=perspective(new Float32Array(16),Math.PI/3.45,aspect,.1,20),view=translationZ(new Float32Array(16),-2.78),model=rotationTiltY(new Float32Array(16),-.18,angle),pv=multiply(new Float32Array(16),projection,view),mvp=multiply(new Float32Array(16),pv,model);
    gl.bindBuffer(gl.ARRAY_BUFFER,resources.position);gl.enableVertexAttribArray(resources.aPosition);gl.vertexAttribPointer(resources.aPosition,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,resources.normal);gl.enableVertexAttribArray(resources.aNormal);gl.vertexAttribPointer(resources.aNormal,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,resources.tone);gl.enableVertexAttribArray(resources.aTone);gl.vertexAttribPointer(resources.aTone,1,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,resources.index);
    gl.uniformMatrix4fv(resources.uMvp,false,mvp);gl.uniformMatrix4fv(resources.uModel,false,model);gl.uniform3f(resources.uLight,.78,.48,.66);
    gl.drawElements(gl.TRIANGLES,resources.count,gl.UNSIGNED_SHORT,0);
  }

  function tick(now){
    raf=0;
    if(!visible||reduced.matches)return;
    const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;
    angle=(angle+dt*.042)%(Math.PI*2);
    draw();
    raf=requestAnimationFrame(tick);
  }

  function start(){
    if(raf){cancelAnimationFrame(raf);raf=0}
    if(!visible||!resources)return;
    draw();
    if(!reduced.matches){last=performance.now();raf=requestAnimationFrame(tick)}
  }

  function fail(){
    field.dataset.renderer="fallback";
    if(raf){cancelAnimationFrame(raf);raf=0}
  }

  try{
    resources=createResources();
    field.dataset.renderer="ready";
    start();

    canvas.addEventListener("webglcontextlost",event=>{event.preventDefault();fail()},{passive:false});
    canvas.addEventListener("webglcontextrestored",()=>{try{resources=createResources();field.dataset.renderer="ready";start()}catch{fail()}},false);
    document.addEventListener("visibilitychange",()=>{visible=!document.hidden;visible?start():(raf&&(cancelAnimationFrame(raf),raf=0))},{passive:true});
    addEventListener("resize",()=>draw(),{passive:true});
    reduced.addEventListener?.("change",start);
  }catch{
    fail();
  }
}
