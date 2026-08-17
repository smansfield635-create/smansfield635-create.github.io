(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const activeScenes=new WeakMap();
  function createMesh(gl,lat=28,lon=40){
    const vertices=[],normals=[],indices=[];
    for(let y=0;y<=lat;y++)for(let x=0;x<=lon;x++){
      const v=y/lat,u=x/lon,phi=v*Math.PI,theta=u*Math.PI*2;
      const ripple=.055*Math.sin(theta*5+phi*7)+.035*Math.sin(theta*9-phi*4);
      const sx=Math.sin(phi)*Math.cos(theta),sy=Math.cos(phi),sz=Math.sin(phi)*Math.sin(theta),r=1+ripple;
      vertices.push(sx*r,sy*r,sz*r);normals.push(sx,sy,sz);
    }
    for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){const a=y*(lon+1)+x,b=a+lon+1;indices.push(a,b,a+1,b,b+1,a+1)}
    const buffer=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
    return{positions:buffer(gl.ARRAY_BUFFER,new Float32Array(vertices)),normals:buffer(gl.ARRAY_BUFFER,new Float32Array(normals)),indices:buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices)),count:indices.length};
  }
  function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
  function program(gl){
    const vs=`attribute vec3 p,n;uniform mat4 m;uniform vec3 scale,offset;varying vec3 N,P;void main(){vec3 q=p*scale+offset;P=(m*vec4(q,1.)).xyz;N=normalize(mat3(m)*(n/scale));gl_Position=vec4(P.xy*.62,P.z*.16+0.15,1.);}`;
    const fs=`precision mediump float;varying vec3 N,P;uniform vec3 color;void main(){vec3 l=normalize(vec3(-.35,.65,.7));float d=max(dot(normalize(N),l),0.);float rim=pow(1.-max(N.z,0.),2.2);float sulci=.78+.22*sin((P.x*19.+P.y*15.)+sin(P.y*24.)*1.7);vec3 c=color*(.28+.72*d)*(.88+.12*sulci)+vec3(.22,.10,.30)*rim;gl_FragColor=vec4(c,1.);}`;
    const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;
  }
  const mat=(yaw,pitch)=>{const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);return new Float32Array([cy,sy*sx,sy*cx,0,0,cx,-sx,0,-sy,cy*sx,cy*cx,0,0,0,0,1])};
  function mount(canvas,{foreground=()=>true}={}){
    if(!canvas||activeScenes.has(canvas))return activeScenes.get(canvas);
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return null;
    const prog=program(gl),mesh=createMesh(gl),pLoc=gl.getAttribLocation(prog,'p'),nLoc=gl.getAttribLocation(prog,'n'),mLoc=gl.getUniformLocation(prog,'m'),scaleLoc=gl.getUniformLocation(prog,'scale'),offsetLoc=gl.getUniformLocation(prog,'offset'),colorLoc=gl.getUniformLocation(prog,'color');
    let yaw=.45,pitch=-.04,raf=0,visible=false,pageVisible=!document.hidden,last=0;
    const resize=()=>{const d=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect(),w=Math.max(2,Math.round(r.width*d)),h=Math.max(2,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}};
    const drawPart=(scale,offset,color)=>{gl.uniform3fv(scaleLoc,scale);gl.uniform3fv(offsetLoc,offset);gl.uniform3fv(colorLoc,color);gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0)};
    const draw=time=>{
      raf=0;resize();gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.useProgram(prog);gl.uniformMatrix4fv(mLoc,false,mat(yaw,pitch));
      gl.bindBuffer(gl.ARRAY_BUFFER,mesh.positions);gl.enableVertexAttribArray(pLoc);gl.vertexAttribPointer(pLoc,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,mesh.normals);gl.enableVertexAttribArray(nLoc);gl.vertexAttribPointer(nLoc,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.indices);
      drawPart([.72,.78,.62],[-.43,.12,0],[.72,.31,.47]);drawPart([.72,.78,.62],[.43,.12,0],[.76,.34,.50]);drawPart([.48,.30,.42],[.43,-.70,.02],[.56,.24,.39]);drawPart([.16,.45,.16],[.03,-.88,.03],[.60,.28,.42]);
      if(!reduce.matches&&visible&&pageVisible&&foreground()){const dt=Math.min(40,time-last||16);yaw+=dt*.00012;last=time;raf=requestAnimationFrame(draw)};
    };
    const schedule=()=>{if(!raf&&visible&&pageVisible&&foreground())raf=requestAnimationFrame(draw)};
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting&&entries[0].intersectionRatio>.08;if(!visible&&raf){cancelAnimationFrame(raf);raf=0}else schedule()},{threshold:[0,.08,.25]});observer.observe(canvas);
    const onVisibility=()=>{pageVisible=!document.hidden;if(!pageVisible&&raf){cancelAnimationFrame(raf);raf=0}else schedule()};document.addEventListener('visibilitychange',onVisibility);
    const wake=()=>schedule();document.addEventListener('compass:capability-change',wake);
    let dragging=false,lastX=0;canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!dragging)return;yaw+=(e.clientX-lastX)*.012;lastX=e.clientX;if(!raf)raf=requestAnimationFrame(draw)});const release=e=>{dragging=false;canvas.releasePointerCapture?.(e.pointerId);schedule()};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
    const api={draw:()=>{if(!raf)raf=requestAnimationFrame(draw)},destroy:()=>{observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);document.removeEventListener('compass:capability-change',wake);if(raf)cancelAnimationFrame(raf)}};activeScenes.set(canvas,api);api.draw();return api;
  }
  window.CompassBrainScene=Object.freeze({mount,version:'volumetric-v1'});
})();
