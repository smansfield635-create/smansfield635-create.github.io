import {sampleHEarthTerrainField,H_EARTH_TERRAIN_FIELD_CONTRACT_ID} from '../terrain/h-earth.terrain-field.js';

const canvas=document.getElementById('gen2');
const gl=canvas.getContext('webgl2',{antialias:true,alpha:false});
if(!gl)throw new Error('GEN2_WEBGL2_REQUIRED');

const VS=`#version 300 es
precision highp float;
layout(location=0)in vec3 aPosition;
layout(location=1)in vec3 aNormal;
uniform mat4 uVP;
out vec3 vP;out vec3 vN;out float vMacro;
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec3 p=aPosition;
 float mountain=smoothstep(5.0,34.0,p.y);
 float n1=noise2(p.xz*.030)*2.0-1.0;
 float n2=noise2(p.xz*.072)*2.0-1.0;
 float ridge=1.0-abs(n1);
 float erosion=(ridge*.68+n2*.32-.34)*mountain;
 p.y+=erosion*7.5;
 vMacro=erosion;vP=p;vN=aNormal;gl_Position=uVP*vec4(p,1.0);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vP;in vec3 vN;in float vMacro;out vec4 outColor;
uniform vec3 uEye;
void main(){
 vec3 dx=dFdx(vP),dy=dFdy(vP),gn=normalize(cross(dx,dy));if(gn.y<0.0)gn=-gn;
 vec3 n=normalize(mix(normalize(vN),gn,.78));
 vec3 sun=normalize(vec3(-.62,.70,.35));
 float ndl=max(dot(n,sun),0.0),slope=1.0-clamp(n.y,0.0,1.0),h=smoothstep(8.0,68.0,vP.y);
 vec3 grass=vec3(.18,.24,.12),soil=vec3(.31,.25,.17),rock=vec3(.36,.35,.32);
 vec3 base=mix(grass,soil,smoothstep(.18,.52,slope));
 base=mix(base,rock,clamp(smoothstep(.42,.82,slope)+h*.42,0.0,1.0));
 base*=.92+.10*clamp(vMacro,-1.0,1.0);
 float hemi=.16+.20*max(n.y,0.0);
 float crevice=1.0-.24*smoothstep(.32,.88,slope)*(1.0-smoothstep(.1,.7,ndl));
 vec3 lit=base*(hemi+ndl*1.12)*crevice;
 float d=length(uEye-vP),fog=1.0-exp(-max(0.0,d-190.0)*.0027);
 vec3 haze=vec3(.58,.67,.71);
 outColor=vec4(mix(lit,haze,clamp(fog,0.0,.78)),1.0);
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
