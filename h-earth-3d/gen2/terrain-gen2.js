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
 vec2 q=p.xz;
 float warpX=(noise2(q*.006+vec2(3.1,8.7))*2.0-1.0)*34.0;
 float warpZ=(noise2(q*.007+vec2(9.4,1.8))*2.0-1.0)*26.0;
 vec2 wq=q+vec2(warpX,warpZ);
 float macro=noise2(wq*.010)*2.0-1.0;
 float fold=noise2(vec2(wq.x*.018+wq.y*.006,wq.y*.012))*2.0-1.0;
 float detail=noise2(wq*.055)*2.0-1.0;
 float ridge=pow(1.0-abs(macro),2.7);
 float drainage=pow(1.0-abs(fold),5.0);
 float escarpment=smoothstep(.18,.62,ridge)*smoothstep(-.12,.48,fold);
 float terrace=floor((p.y+ridge*18.0)/5.5)*5.5-(p.y+ridge*18.0);
 float erosion=(ridge*1.08+fold*.20+detail*.07-drainage*.46-.20)*mountain;
 p.y+=erosion*14.0;
 p.y+=escarpment*mountain*4.8;
 p.y+=terrace*mountain*escarpment*.12;
 float shore=1.0-smoothstep(0.0,9.0,abs(p.y));
 float beachShelf=smoothstep(-4.0,1.2,p.y)*(1.0-smoothstep(1.2,9.0,p.y));
 float coastWarp=(noise2(vec2(p.x*.012,p.z*.009)+vec2(4.7,1.3))*2.0-1.0);
 p.y=mix(p.y,mix(-1.1,2.5,smoothstep(-4.0,9.0,p.y))+coastWarp*.8,beachShelf*.72);
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
 vec3 grass=vec3(.16,.22,.105),soil=vec3(.30,.245,.17),rock=vec3(.34,.335,.315),cliff=vec3(.285,.29,.285),sand=vec3(.58,.50,.34);
 vec3 base=mix(grass,soil,smoothstep(.16,.46,slope));
 float beach=1.0-smoothstep(1.2,7.5,abs(vP.y));
 base=mix(base,sand,beach*(1.0-smoothstep(.42,.72,slope)));
 base=mix(base,rock,clamp(smoothstep(.36,.68,slope)+h*.38,0.0,1.0));
 base=mix(base,cliff,smoothstep(.62,.90,slope));
 base*=.92+.10*clamp(vMacro,-1.0,1.0);
 float hemi=.11+.19*max(n.y,0.0);
 float horizonShadow=smoothstep(-.10,.28,dot(normalize(vec3(dFdx(vP.y),1.0,dFdy(vP.y))),sun));
 float concavity=clamp((abs(dFdx(n.y))+abs(dFdy(n.y)))*3.2,0.0,1.0);
 float crevice=1.0-.34*smoothstep(.22,.88,slope)*(1.0-smoothstep(.08,.72,ndl))-.12*concavity;
 float ridgeLight=.10*pow(max(dot(n,normalize(vec3(-.72,.48,.18))),0.0),3.0);
 vec3 lit=base*(hemi+ndl*1.22)*max(.48,crevice)*(.84+.16*horizonShadow)+base*ridgeLight;
 float d=length(uEye-vP),fog=1.0-exp(-max(0.0,d-190.0)*.0027);
 vec3 haze=vec3(.58,.67,.71);
 outColor=vec4(mix(lit,haze,clamp(fog,0.0,.78)),1.0);
}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));

const xmin=-480,xmax=480,zmin=-620,zmax=260,step=2;
const cols=Math.round((xmax-xmin)/step)+1,rows=Math.round((zmax-zmin)/step)+1;
const positions=[],normals=[],indices=[];
for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
 const x=xmin+c*step,z=zmin+r*step,s=sampleHEarthTerrainField(x,z);
 positions.push(x,s.elevation,z);normals.push(s.normal.x,s.normal.y,s.normal.z);
}
for(let r=0;r<rows-1;r++)for(let c=0;c<cols-1;c++){const a=r*cols+c,b=a+1,e=(r+1)*cols+c,d=e+1;indices.push(a,e,b,b,e,d)}


const terrainIndexCount=indices.length;
const vao=gl.createVertexArray();gl.bindVertexArray(vao);
function attr(loc,data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0)}
attr(0,positions);attr(1,normals);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),gl.STATIC_DRAW);

const RVS=`#version 300 es
precision highp float;layout(location=0)in vec3 aPosition;layout(location=1)in vec3 aNormal;uniform mat4 uVP;out vec3 vP;out vec3 vN;void main(){vP=aPosition;vN=aNormal;gl_Position=uVP*vec4(aPosition,1.0);}`;
const RFS=`#version 300 es
precision highp float;in vec3 vP;in vec3 vN;out vec4 outColor;uniform vec3 uEye;void main(){vec3 n=normalize(vN),sun=normalize(vec3(-.62,.70,.35));float l=max(dot(n,sun),0.0);float mott=.5+.5*sin(vP.x*.17+vP.y*.11+vP.z*.13);vec3 base=mix(vec3(.20,.19,.17),vec3(.34,.32,.28),mott*.35);outColor=vec4(base*(.18+l*.98),1.0);}`;
const rockProgram=gl.createProgram();gl.attachShader(rockProgram,shader(gl.VERTEX_SHADER,RVS));gl.attachShader(rockProgram,shader(gl.FRAGMENT_SHADER,RFS));gl.linkProgram(rockProgram);
function addRock(P,N,I,cx,cy,cz,rx,ry,rz,seg=12,rings=7){
 const base=P.length/3;
 for(let j=0;j<=rings;j++){const v=j/rings,ph=v*Math.PI;for(let i=0;i<seg;i++){const u=i/seg,th=u*Math.PI*2;const rough=1+.14*Math.sin(th*3+ph*5)+.07*Math.sin(th*7-ph*2);const x=Math.sin(ph)*Math.cos(th),y=Math.cos(ph),z=Math.sin(ph)*Math.sin(th);P.push(cx+x*rx*rough,cy+y*ry*rough,cz+z*rz*rough);N.push(x,y,z)}}
 for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){const a=base+j*seg+i,b=base+j*seg+(i+1)%seg,c=base+(j+1)*seg+i,d=base+(j+1)*seg+(i+1)%seg;I.push(a,c,b,b,c,d)}
}
const rockP=[],rockN=[],rockI=[];
[[-205,4,-80,11,8,9],[-174,3,-91,7,5,6],[-132,3,-69,8,6,7],[92,4,-73,10,7,8],[148,5,-91,13,9,10],[205,3,-62,8,5,7],[-286,17,-142,17,30,15],[286,13,-128,14,24,13]].forEach(r=>addRock(rockP,rockN,rockI,...r));
const rockVao=gl.createVertexArray();gl.bindVertexArray(rockVao);attr(0,rockP);attr(1,rockN);const rib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,rib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(rockI),gl.STATIC_DRAW);

const WVS=`#version 300 es
precision highp float;
layout(location=0)in vec3 aPosition;uniform mat4 uVP;out vec3 vP;
void main(){vP=aPosition;gl_Position=uVP*vec4(aPosition,1.0);}`;
const WFS=`#version 300 es
precision highp float;
in vec3 vP;out vec4 outColor;uniform vec3 uEye;
void main(){float d=length(uEye-vP);float ripple=.5+.5*sin(vP.x*.055+vP.z*.041);vec3 deep=vec3(.025,.16,.19),shallow=vec3(.035,.30,.31);float fres=pow(1.0-clamp(normalize(uEye-vP).y,0.0,1.0),3.0);vec3 c=mix(shallow,deep,smoothstep(80.0,520.0,d));c+=ripple*.012;c=mix(c,vec3(.55,.68,.72),fres*.28);outColor=vec4(c,.90);}`;
const waterProgram=gl.createProgram();gl.attachShader(waterProgram,shader(gl.VERTEX_SHADER,WVS));gl.attachShader(waterProgram,shader(gl.FRAGMENT_SHADER,WFS));gl.linkProgram(waterProgram);if(!gl.getProgramParameter(waterProgram,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(waterProgram));
const waterVerts=[xmin,0,zmin,xmax,0,zmin,xmin,0,zmax,xmax,0,zmax],waterIdx=[0,2,1,1,2,3];
const waterVao=gl.createVertexArray();gl.bindVertexArray(waterVao);attr(0,waterVerts);const wib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,wib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(waterIdx),gl.STATIC_DRAW);

const m4={
 perspective(fovy,aspect,n,f){const t=1/Math.tan(fovy/2),nf=1/(n-f);return[t/aspect,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0]},
 look(eye,target){let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2],zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;let xx=zz,xz=-zx,xl=Math.hypot(xx,xz);xx/=xl;xz/=xl;let yx=zy*xz,yy=zz*xx-zx*xz,yz=-zy*xx;return[xx,yx,zx,0,0,yy,zy,0,xz,yz,zz,0,-xx*eye[0]-xz*eye[2],-yx*eye[0]-yy*eye[1]-yz*eye[2],-zx*eye[0]-zy*eye[1]-zz*eye[2],1]},
 mul(a,b){let o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
};
let yaw=.12,pitch=.24,dist=360,target=[0,18,-215],drag=null;
canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag[0])*.005;pitch=Math.max(-.05,Math.min(1.15,pitch+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]});
canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(90,Math.min(900,dist*Math.exp(e.deltaY*.001)))},{passive:false});
canvas.addEventListener('dblclick',()=>{yaw=.12;pitch=.24;dist=360;target=[0,18,-215]});
function frame(){
 const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,innerWidth*dpr|0),h=Math.max(1,innerHeight*dpr|0);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
 gl.viewport(0,0,w,h);gl.enable(gl.DEPTH_TEST);gl.clearColor(.61,.70,.75,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const cp=Math.cos(pitch),eye=[target[0]+Math.sin(yaw)*cp*dist,target[1]+Math.sin(pitch)*dist,target[2]+Math.cos(yaw)*cp*dist];
 const vp=m4.mul(m4.perspective(Math.PI/3,w/h,.5,1800),m4.look(eye,target));
 gl.useProgram(program);gl.uniformMatrix4fv(gl.getUniformLocation(program,'uVP'),false,new Float32Array(vp));gl.uniform3fv(gl.getUniformLocation(program,'uEye'),new Float32Array(eye));gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,terrainIndexCount,gl.UNSIGNED_INT,0);
 gl.useProgram(rockProgram);gl.uniformMatrix4fv(gl.getUniformLocation(rockProgram,'uVP'),false,new Float32Array(vp));gl.uniform3fv(gl.getUniformLocation(rockProgram,'uEye'),new Float32Array(eye));gl.bindVertexArray(rockVao);gl.drawElements(gl.TRIANGLES,rockI.length,gl.UNSIGNED_INT,0);
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(waterProgram);gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram,'uVP'),false,new Float32Array(vp));gl.uniform3fv(gl.getUniformLocation(waterProgram,'uEye'),new Float32Array(eye));gl.bindVertexArray(waterVao);gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_INT,0);gl.disable(gl.BLEND);requestAnimationFrame(frame)
}
document.getElementById('hud').textContent+=` · ${H_EARTH_TERRAIN_FIELD_CONTRACT_ID}`;frame();
