(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V10_G1_1_INFERIOR_INTEGRATION_v1';
const M=Math,PI=M.PI,TAU=PI*2;
const palette={cortex:[.88,.48,.53],cerebellum:[.67,.32,.39],pons:[.73,.36,.41],stem:[.62,.27,.33]};
const clamp=(v,a,b)=>M.max(a,M.min(b,v));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const bell=(x,c,w)=>M.exp(-M.pow((x-c)/w,2));
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const push=(x,y,z,c)=>{const i=pos.length/3;pos.push(x,y,z);nor.push(0,0,0);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 function addIcosphere(center,radii,color,subdiv,deform){
  const t=(1+M.sqrt(5))/2;
  let verts=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]];
  verts=verts.map(v=>{const d=M.hypot(v[0],v[1],v[2]);return[v[0]/d,v[1]/d,v[2]/d]});
  let faces=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
  for(let s=0;s<subdiv;s++){
   const cache=new Map();
   const mid=(a,b)=>{const k=a<b?a+','+b:b+','+a;if(cache.has(k))return cache.get(k);const A=verts[a],B=verts[b],x=(A[0]+B[0])*.5,y=(A[1]+B[1])*.5,z=(A[2]+B[2])*.5,d=M.hypot(x,y,z)||1;const n=verts.push([x/d,y/d,z/d])-1;cache.set(k,n);return n};
   const next=[];
   for(const f of faces){const a=mid(f[0],f[1]),b=mid(f[1],f[2]),c=mid(f[2],f[0]);next.push([f[0],a,c],[f[1],b,a],[f[2],c,b],[a,b,c])}
   faces=next;
  }
  const base=pos.length/3;
  for(const v of verts){
   let x=center[0]+radii[0]*v[0],y=center[1]+radii[1]*v[1],z=center[2]+radii[2]*v[2];
   if(deform){const p=deform({nx:v[0],ny:v[1],nz:v[2],x,y,z});x=p[0];y=p[1];z=p[2]}
   push(x,y,z,color)
  }
  for(const f of faces)tri(base+f[0],base+f[1],base+f[2]);
 }
 function cortex(){
  addIcosphere([0,.11,.01],[.62,.54,.79],palette.cortex,4,({nx,ny,nz,x,y,z})=>{
   const anterior=smooth(.03,.75,nz),posterior=smooth(.02,.82,-nz),lateral=smooth(.10,.82,M.abs(nx));
   const inferior=smooth(.08,.88,-ny),superior=smooth(.10,.90,ny),temporal=bell(nz,.22,.42)*lateral*inferior;
   x*=1+.020*anterior+.030*temporal;
   z+=.050*anterior*(.55+.45*(1-inferior))-.055*posterior*(.35+.65*lateral);
   y-=.070*temporal+.030*superior*(1-lateral*.35);
   const broad=.010*M.sin(5.0*M.atan2(nz,nx)+2.0*y)+.006*M.sin(6.4*z+2.1*x);
   x+=nx*broad;y+=ny*broad;z+=nz*broad;
   return[x,y,z]
  });
  for(let i=0;i<pos.length;i+=3){
   const x=pos[i],y=pos[i+1],z=pos[i+2],top=smooth(.08,.58,y);if(top<=0)continue;
   const mid=M.exp(-M.pow(x/.060,2)),ap=.82+.18*M.cos(clamp(z/.82,-1,1)*PI*.65);
   pos[i+1]-=.105*mid*top*ap;pos[i]+=M.sign(x||1)*.014*mid*top;
  }
 }
 function cerebellum(){
  addIcosphere([0,-.40,-.57],[.35,.18,.27],palette.cerebellum,3,({nx,ny,nz,x,y,z})=>{
   const phi=M.atan2(nz,nx);
   const folia=.012*M.sin(28*(y+.20*z)+1.5*M.sin(phi*2.0));
   x+=nx*folia*.55;y+=ny*folia*.35;z+=nz*folia;
   const notch=.020*M.exp(-M.pow(x/.085,2))*smooth(-.55,-.28,y);
   y-=notch;
   return[x,y,z]
  });
 }
 function ponsAndStem(){
  const rings=19,sides=28,ids=[];
  for(let r=0;r<=rings;r++){
   const t=r/rings;
   const y=-.31-.58*t;
   const z=-.31-.055*t;
   const pons=M.exp(-M.pow((t-.16)/.16,2));
   const medulla=M.exp(-M.pow((t-.48)/.22,2));
   const rx=.056+.100*pons+.028*medulla-.014*t;
   const rz=.050+.112*pons+.022*medulla-.012*t;
   const row=[];
   for(let s=0;s<sides;s++){
    const a=s/sides*TAU;
    const anterior=.018*pons*(.5+.5*M.cos(a));
    row.push(push(rx*M.cos(a),y,z+rz*M.sin(a)+anterior,t<.34?palette.pons:palette.stem))
   }
   ids.push(row)
  }
  for(let r=0;r<rings;r++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=ids[r][s],b=ids[r][n],c=ids[r+1][n],d=ids[r+1][s];tri(a,d,c);tri(a,c,b)}
 }
 cortex();cerebellum();ponsAndStem();
 for(let k=0;k<idx.length;k+=3){
  const ia=idx[k]*3,ib=idx[k+1]*3,ic=idx[k+2]*3;
  const ax=pos[ib]-pos[ia],ay=pos[ib+1]-pos[ia+1],az=pos[ib+2]-pos[ia+2];
  const bx=pos[ic]-pos[ia],by=pos[ic+1]-pos[ia+1],bz=pos[ic+2]-pos[ia+2];
  const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;
  for(const q of[ia,ib,ic]){nor[q]+=nx;nor[q+1]+=ny;nor[q+2]+=nz}
 }
 for(let i=0;i<nor.length;i+=3){const d=M.hypot(nor[i],nor[i+1],nor[i+2])||1;nor[i]/=d;nor[i+1]/=d;nor[i+2]/=d}
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V10 G1.1 vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3}
}
function boot(){
 const stage=window.CapabilityObjectStage;if(!stage)return;
 document.querySelectorAll('[data-capability-brain-v10-g1-1]').forEach(canvas=>{
  const api=stage.mount(canvas,{meshFactory:build,initialYaw:.64,initialPitch:-.06,spin:.000065,scale:.98,dataset:{brainRenderer:VERSION,brainGeneration:'V10_G1_1',brainConstruction:'CONTINUOUS_CEREBRAL_SURFACE_INFERIOR_INTEGRATION',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainComponents:'continuous-cerebrum,longitudinal-fissure,single-continuous-cerebellum,continuous-pons-medulla-brainstem',brainArchitectureLaw:'G1_FROZEN;NO_PAIRED_CEREBELLAR_BULBS;NO_SEPARATE_PONS_STEM_OBJECTS;NO_UV_POLE_PINCH',brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'}});
  if(api)canvas._brainV10G11=api
 })
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV10G11=Object.freeze({version:VERSION,build,boot});
})();
