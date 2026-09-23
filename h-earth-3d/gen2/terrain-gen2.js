import {sampleHEarthTerrainField,H_EARTH_TERRAIN_FIELD_CONTRACT_ID} from '../terrain/h-earth.terrain-field.js';

const canvas=document.getElementById('gen2');
const gl=canvas.getContext('webgl2',{antialias:true,alpha:false});
if(!gl)throw new Error('GEN2_WEBGL2_REQUIRED');

const VS=`#version 300 es
precision highp float;
layout(location=0)in vec3 aPosition;
layout(location=1)in vec3 aNormal;
uniform mat4 uVP;
out vec3 vP;out vec3 vN;
void main(){vP=aPosition;vN=aNormal;gl_Position=uVP*vec4(aPosition,1.0);}`;
const FS=`#version 300 es
precision highp float;
in vec3 vP;in vec3 vN;out vec4 outColor;
uniform vec3 uEye;
void main(){
 vec3 n=normalize(vN),sun=normalize(vec3(-.55,.72,.42));
 float ndl=max(dot(n,sun),0.0);
 float slope=1.0-clamp(n.y,0.0,1.0);
 float h=smoothstep(2.0,72.0,vP.y);
 vec3 soil=mix(vec3(.23,.29,.17),vec3(.34,.31,.24),slope);
 vec3 rock=mix(vec3(.31,.30,.28),vec3(.48,.46,.42),h);
 vec3 base=mix(soil,rock,clamp(slope*.72+h*.45,0.0,1.0));
 float sky=.20+.18*max(n.y,0.0);
 float contact=1.0-.18*smoothstep(.18,.82,slope);
 vec3 lit=base*(sky+ndl*.94)*contact;
 float d=length(uEye-vP);
 float fog=1.0-exp(-max(0.0,d-250.0)*.0021);
 vec3 haze=vec3(.62,.70,.73);
 outColor=vec4(mix(lit,haze,clamp(fog,0.0,.72)),1.0);
}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));

const xmin=-256,xmax=256,zmin=-430,zmax=40,step=4;
const cols=Math.round((xmax-xmin)/step)+1,rows=Math.round((zmax-zmin)/step)+1;
const positions=[],normals=[],indices=[];
for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
 const x=xmin+c*step,z=zmin+r*step,s=sampleHEarthTerrainField(x,z);
 positions.push(x,s.elevation,z);normals.push(s.normal.x,s.normal.y,s.normal.z);
}
for(let r=0;r<rows-1;r++)for(let c=0;c<cols-1;c++){const a=r*cols+c,b=a+1,e=(r+1)*cols+c,d=e+1;indices.push(a,e,b,b,e,d)}
const vao=gl.createVertexArray();gl.bindVertexArray(vao);
function attr(loc,data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0)}
attr(0,positions);attr(1,normals);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),gl.STATIC_DRAW);

const m4={
 perspective(fovy,aspect,n,f){const t=1/Math.tan(fovy/2),nf=1/(n-f);return[t/aspect,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0]},
 look(eye,target){let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2],zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;let xx=zz,xz=-zx,xl=Math.hypot(xx,xz);xx/=xl;xz/=xl;let yx=zy*xz,yy=zz*xx-zx*xz,yz=-zy*xx;return[xx,yx,zx,0,0,yy,zy,0,xz,yz,zz,0,-xx*eye[0]-xz*eye[2],-yx*eye[0]-yy*eye[1]-yz*eye[2],-zx*eye[0]-zy*eye[1]-zz*eye[2],1]},
 mul(a,b){let o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
};
let yaw=.12,pitch=.24,dist=360,target=[0,18,-215],drag=null;
canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag[0])*.005;pitch=Math.max(-.05,Math.min(1.15,pitch+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]});
canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(90,Math.min(720,dist*Math.exp(e.deltaY*.001)))},{passive:false});
function frame(){
 const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,innerWidth*dpr|0),h=Math.max(1,innerHeight*dpr|0);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
 gl.viewport(0,0,w,h);gl.enable(gl.DEPTH_TEST);gl.clearColor(.61,.70,.75,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const cp=Math.cos(pitch),eye=[target[0]+Math.sin(yaw)*cp*dist,target[1]+Math.sin(pitch)*dist,target[2]+Math.cos(yaw)*cp*dist];
 const vp=m4.mul(m4.perspective(Math.PI/3,w/h,.5,1800),m4.look(eye,target));
 gl.useProgram(program);gl.uniformMatrix4fv(gl.getUniformLocation(program,'uVP'),false,new Float32Array(vp));gl.uniform3fv(gl.getUniformLocation(program,'uEye'),new Float32Array(eye));gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_INT,0);requestAnimationFrame(frame)
}
document.getElementById('hud').textContent+=` · ${H_EARTH_TERRAIN_FIELD_CONTRACT_ID}`;frame();
