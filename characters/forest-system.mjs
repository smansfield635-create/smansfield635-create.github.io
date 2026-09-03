import {step9Frame,step9ShorelineZ,step9TerrainHeight,resolveStep9Site,STEP9_DESTINATION_BINDINGS} from './step9-regional-geography.mjs';

export const FOREST_REPRESENTATION_SOURCE_SHA='35e8e2fb3e4a093fb3bc8ecc4239e8564bd7938a';
export const FOREST_ARCHETYPES=Object.freeze([
  'BROAD_DECIDUOUS','COLUMNAR','WIND_SHAPED_COASTAL','ANCIENT_SPREADING','YOUNG_UNDERSTORY','DEAD_SPARSE'
]);
export const FOREST_BUDGETS=Object.freeze({desktop:Object.freeze({target:420,max:520}),mobile:Object.freeze({target:190,max:240})});
export const FOREST_LOD_POLICY=Object.freeze({near:'BRANCHED_MULTI_CANOPY',mid:'REDUCED_BRANCH_TWO_CANOPY',far:'TRUNK_ASYMMETRIC_CANOPY',mobileReduction:true});

const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const hash32=n=>{n=(n^61)^(n>>>16);n=Math.imul(n,9);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);return (n^(n>>>15))>>>0;};
const rand=(seed,k=0)=>hash32(seed+Math.imul(k+1,0x9e3779b1))/4294967295;
const normalize=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return [x/l,y/l,z/l];};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

const REGION_SPECS=Object.freeze([
  {u:.16,v:.25,rx:.13,rz:.18,density:1.00,seed:101},
  {u:.34,v:.19,rx:.15,rz:.15,density:.88,seed:211},
  {u:.55,v:.28,rx:.14,rz:.19,density:1.00,seed:307},
  {u:.76,v:.22,rx:.14,rz:.16,density:.84,seed:419},
  {u:.24,v:.55,rx:.15,rz:.16,density:.72,seed:503},
  {u:.53,v:.58,rx:.18,rz:.15,density:.78,seed:607},
  {u:.78,v:.54,rx:.13,rz:.18,density:.66,seed:719}
]);

function landmarkExclusions(){
  const seen=new Set(),out=[];
  for(const [id,binding] of Object.entries(STEP9_DESTINATION_BINDINGS)){
    if(!binding?.siteId||seen.has(binding.siteId))continue;
    seen.add(binding.siteId);
    const site=resolveStep9Site(binding.siteId);
    const key=id==='manor'?'manor':id==='crossing'?'crossing':id==='clock'?'clock':'default';
    const radius=key==='manor'?155:key==='crossing'?120:key==='clock'?105:74;
    out.push(Object.freeze({id,siteId:binding.siteId,x:site.world.x,z:site.world.z,radius}));
  }
  return Object.freeze(out);
}
export const FOREST_SIGHTLINE_EXCLUSIONS=landmarkExclusions();

function archetypeProfile(type,seed){
  const r=i=>rand(seed,i);
  switch(type){
    case 'BROAD_DECIDUOUS': return {height:30+12*r(1),trunk:.9+1.0*r(2),spread:15+8*r(3),lean:(r(4)-.5)*.10,canopy:3,branches:3};
    case 'COLUMNAR': return {height:38+16*r(1),trunk:.75+.7*r(2),spread:7+4*r(3),lean:(r(4)-.5)*.05,canopy:3,branches:2};
    case 'WIND_SHAPED_COASTAL': return {height:23+10*r(1),trunk:.8+.8*r(2),spread:17+8*r(3),lean:.16+.15*r(4),canopy:2,branches:3,windBias:1};
    case 'ANCIENT_SPREADING': return {height:29+11*r(1),trunk:1.5+1.2*r(2),spread:23+10*r(3),lean:(r(4)-.5)*.12,canopy:4,branches:4};
    case 'YOUNG_UNDERSTORY': return {height:12+8*r(1),trunk:.42+.35*r(2),spread:7+5*r(3),lean:(r(4)-.5)*.18,canopy:2,branches:2,multiStem:true};
    default: return {height:25+12*r(1),trunk:.72+.7*r(2),spread:10+5*r(3),lean:(r(4)-.5)*.22,canopy:0,branches:5,dead:true};
  }
}

function insideSightline(x,z){return FOREST_SIGHTLINE_EXCLUSIONS.some(s=>Math.hypot(x-s.x,z-s.z)<s.radius);}
function landEligible(x,z,frame){
  const sx=step9ShorelineZ(x);
  return x>frame.xMinimum+(frame.xMaximum-frame.xMinimum)*.045&&x<frame.xMaximum-(frame.xMaximum-frame.xMinimum)*.045&&z>frame.zMinimum+(frame.zMaximum-frame.zMinimum)*.045&&z<frame.zMaximum-(frame.zMaximum-frame.zMinimum)*.045&&z<=sx-48;
}

export function buildForestPopulation({compact=false}={}){
  const frame=step9Frame().envelope,target=compact?FOREST_BUDGETS.mobile.target:FOREST_BUDGETS.desktop.target;
  const width=frame.xMaximum-frame.xMinimum,depth=frame.zMaximum-frame.zMinimum,instances=[];
  for(let ri=0;ri<REGION_SPECS.length;ri++){
    const reg=REGION_SPECS[ri],quota=Math.ceil(target*reg.density/REGION_SPECS.reduce((s,r)=>s+r.density,0)),cx=mix(frame.xMinimum,frame.xMaximum,reg.u),cz=mix(frame.zMinimum,frame.zMaximum,reg.v);
    for(let k=0;k<quota*5&&instances.filter(t=>t.region===ri).length<quota;k++){
      const seed=reg.seed*10007+k*7919,rad=Math.sqrt(rand(seed,1)),angle=TAU*rand(seed,2),edgeNoise=.72+.36*rand(seed,3);
      const x=cx+Math.cos(angle)*rad*reg.rx*width*edgeNoise,z=cz+Math.sin(angle)*rad*reg.rz*depth*edgeNoise;
      if(!landEligible(x,z,frame)||insideSightline(x,z))continue;
      const core=rad<.58,edge=rad>.76;
      if(edge&&rand(seed,4)>.48)continue;
      const archetype=FOREST_ARCHETYPES[(ri+k+Math.floor(rand(seed,5)*FOREST_ARCHETYPES.length))%FOREST_ARCHETYPES.length];
      const y=step9TerrainHeight(x,z),profile=archetypeProfile(archetype,seed),lodRoll=rand(seed,6);
      const lod=compact?(lodRoll<.16?'near':lodRoll<.55?'mid':'far'):(lodRoll<.24?'near':lodRoll<.70?'mid':'far');
      instances.push(Object.freeze({id:`r${ri}-t${k}`,region:ri,seed,archetype,x,y,z,yaw:TAU*rand(seed,7),scale:.82+.38*rand(seed,8),core,edge,lod,profile}));
      if(instances.length>=target)break;
    }
    if(instances.length>=target)break;
  }
  return Object.freeze({schema:'MIRRORLAND_FOREST_POPULATION_v1',compact,target,instances:Object.freeze(instances),regions:REGION_SPECS,exclusions:FOREST_SIGHTLINE_EXCLUSIONS,frame});
}

function pushTri(verts,a,b,c,material){const n=normalize(...cross([b[0]-a[0],b[1]-a[1],b[2]-a[2]],[c[0]-a[0],c[1]-a[1],c[2]-a[2]]));for(const p of [a,b,c])verts.push(...p,...n,material);}
function prism(verts,a,b,radius,sides,material){
  const axis=normalize(b[0]-a[0],b[1]-a[1],b[2]-a[2]),helper=Math.abs(axis[1])<.9?[0,1,0]:[1,0,0],u=normalize(...cross(axis,helper)),v=normalize(...cross(axis,u));
  const ring=(p,i)=>{const q=TAU*i/sides,c=Math.cos(q)*radius,s=Math.sin(q)*radius;return[p[0]+u[0]*c+v[0]*s,p[1]+u[1]*c+v[1]*s,p[2]+u[2]*c+v[2]*s];};
  for(let i=0;i<sides;i++){const j=(i+1)%sides,A=ring(a,i),B=ring(a,j),C=ring(b,i),D=ring(b,j);pushTri(verts,A,C,B,material);pushTri(verts,B,C,D,material);}
}
function canopyBlob(verts,cx,cy,cz,rx,ry,rz,seed,material=1){
  const sides=8,rings=3,pts=[];
  pts.push([[cx,cy-ry*.88,cz]]);
  for(let r=1;r<=rings;r++){const t=r/(rings+1),phi=-Math.PI/2+Math.PI*t,ring=[];for(let i=0;i<sides;i++){const a=TAU*i/sides,j=.86+.24*rand(seed,r*17+i);ring.push([cx+Math.cos(a)*Math.cos(phi)*rx*j,cy+Math.sin(phi)*ry*(.92+.12*rand(seed,80+r)),cz+Math.sin(a)*Math.cos(phi)*rz*j]);}pts.push(ring);}
  pts.push([[cx,cy+ry*.94,cz]]);
  const bottom=pts[0][0],top=pts.at(-1)[0];for(let i=0;i<sides;i++){const j=(i+1)%sides;pushTri(verts,bottom,pts[1][j],pts[1][i],material);for(let r=1;r<rings;r++){pushTri(verts,pts[r][i],pts[r][j],pts[r+1][i],material);pushTri(verts,pts[r][j],pts[r+1][j],pts[r+1][i],material);}pushTri(verts,pts[rings][i],pts[rings][j],top,material);}
}
function rotateXZ(x,z,yaw){return[x*Math.cos(yaw)-z*Math.sin(yaw),x*Math.sin(yaw)+z*Math.cos(yaw)];}
function treeGeometry(verts,t){
  const p=t.profile,s=t.scale,base=[t.x,t.y,t.z],h=p.height*s,leanX=Math.cos(t.yaw)*p.lean*h,leanZ=Math.sin(t.yaw)*p.lean*h,top=[t.x+leanX,t.y+h*.58,t.z+leanZ];
  prism(verts,base,top,p.trunk*s,t.lod==='far'?5:7,0);
  const branchCount=t.lod==='far'?0:t.lod==='mid'?Math.min(2,p.branches):p.branches;
  for(let i=0;i<branchCount;i++){const q=TAU*(i/Math.max(1,branchCount))+.7*rand(t.seed,30+i),length=p.spread*s*(.55+.35*rand(t.seed,40+i)),[dx,dz]=rotateXZ(length,0,q),start=[mix(base[0],top[0],.55+.08*i),t.y+h*(.34+.05*i),mix(base[2],top[2],.55+.08*i)],end=[start[0]+dx,start[1]+h*(.08+.08*rand(t.seed,50+i)),start[2]+dz];prism(verts,start,end,p.trunk*s*(.42-.04*Math.min(i,4)),5,0);}
  if(p.dead)return;
  const canopyCount=t.lod==='far'?1:t.lod==='mid'?Math.min(2,p.canopy):p.canopy;
  for(let i=0;i<canopyCount;i++){const a=TAU*(i/Math.max(1,canopyCount))+rand(t.seed,60+i),offset=p.spread*s*(i?(.22+.18*rand(t.seed,70+i)):.08),wind=(p.windBias||0)*p.spread*s*.24,[ox,oz]=rotateXZ(offset+wind,0,a),cy=t.y+h*(.58+.13*(i%2)),rx=p.spread*s*(t.archetype==='COLUMNAR'?.42:t.archetype==='ANCIENT_SPREADING'?.72:.56)*(1+.12*rand(t.seed,90+i)),ry=h*(t.archetype==='COLUMNAR'?.28:.19),rz=rx*(.78+.30*rand(t.seed,100+i));canopyBlob(verts,top[0]+ox,cy,top[2]+oz,rx,ry,rz,t.seed+i*113,1);}
}
function compile(gl,type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(`FOREST_SHADER:${gl.getShaderInfoLog(sh)}`);return sh;}
function program(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`FOREST_PROGRAM:${gl.getProgramInfoLog(p)}`);return p;}
const VS=`#version 300 es
precision highp float;layout(location=0)in vec3 aPos;layout(location=1)in vec3 aNormal;layout(location=2)in float aMaterial;uniform mat4 uVP;uniform float uTime;out vec3 vN;out float vM;out float vH;void main(){vec3 p=aPos;if(aMaterial>.5){float phase=aPos.x*.017+aPos.z*.013;float sway=sin(uTime*.72+phase)*(.45+clamp((aPos.y-4.0)/65.0,0.0,1.0)*1.4);p.x+=sway;p.z+=sway*.28;}vN=aNormal;vM=aMaterial;vH=aPos.y;gl_Position=uVP*vec4(p,1.0);}`;
const FS=`#version 300 es
precision highp float;in vec3 vN;in float vM;in float vH;out vec4 outColor;void main(){vec3 n=normalize(vN);float moon=.36+.48*max(0.0,dot(n,normalize(vec3(-.35,.72,.42))));float heightLift=clamp(vH/140.0,0.0,1.0);vec3 bark=mix(vec3(.075,.062,.052),vec3(.15,.13,.10),moon);vec3 leaf=mix(vec3(.025,.095,.063),vec3(.105,.245,.15),moon+.12*heightLift);vec3 c=mix(bark,leaf,step(.5,vM));c+=vec3(.025,.04,.055)*pow(max(0.0,n.y),2.0);outColor=vec4(c,1.0);}`;

export function createForestSystem(gl,{compact=false}={}){
  const population=buildForestPopulation({compact}),verts=[];for(const t of population.instances)treeGeometry(verts,t);
  const data=new Float32Array(verts),vao=gl.createVertexArray();gl.bindVertexArray(vao);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const stride=7*4;gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,stride,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,stride,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,stride,24);const shader=program(gl,VS,FS),uVP=gl.getUniformLocation(shader,'uVP'),uTime=gl.getUniformLocation(shader,'uTime');gl.bindVertexArray(null);
  return Object.freeze({population,triangleCount:data.length/7/3,draw(vp,time){gl.useProgram(shader);gl.uniformMatrix4fv(uVP,false,vp);gl.uniform1f(uTime,time);gl.bindVertexArray(vao);gl.drawArrays(gl.TRIANGLES,0,data.length/7);}});
}
