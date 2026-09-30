(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V10_G1_PROPORTION_INFERIOR_ANATOMY_v1';
const M=Math,PI=M.PI,TAU=PI*2;
const palette={cortex:[.88,.48,.53],cerebellum:[.67,.32,.39],pons:[.73,.36,.41],stem:[.62,.27,.33]};
const clamp=(v,a,b)=>M.max(a,M.min(b,v));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const bell=(x,c,w)=>M.exp(-M.pow((x-c)/w,2));
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const push=(x,y,z,c)=>{const i=pos.length/3;pos.push(x,y,z);nor.push(0,0,0);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 function grid(rows,cols,point,color){
  const ids=[];
  for(let r=0;r<=rows;r++){
   const row=[];
   for(let c=0;c<=cols;c++){const p=point(r/rows,c/cols);row.push(push(p[0],p[1],p[2],color))}
   ids.push(row);
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=ids[r][c],b=ids[r][c+1],d=ids[r+1][c],e=ids[r+1][c+1];tri(a,d,e);tri(a,e,b)}
 }
 function ellipsoid(rows,cols,center,radii,color,deform){
  grid(rows,cols,(v,u)=>{
   const th=v*PI,ph=u*TAU,st=M.sin(th),ct=M.cos(th),cp=M.cos(ph),sp=M.sin(ph);
   let nx=st*cp,ny=ct,nz=st*sp;
   let x=center[0]+radii[0]*nx,y=center[1]+radii[1]*ny,z=center[2]+radii[2]*nz;
   if(deform){const p=deform({u,v,th,ph,nx,ny,nz,x,y,z});x=p[0];y=p[1];z=p[2]}
   return[x,y,z]
  },color)
 }
 function cortex(){
  ellipsoid(44,72,[0,.11,.01],[.62,.54,.79],palette.cortex,({nx,ny,nz,x,y,z,ph})=>{
   // Human gross silhouette first: fuller frontal pole, tapered occipital pole,
   // lower temporal projection, and a less spherical superior dome.
   const anterior=smooth(.03,.75,nz);
   const posterior=smooth(.02,.82,-nz);
   const lateral=smooth(.10,.82,M.abs(nx));
   const inferior=smooth(.08,.88,-ny);
   const superior=smooth(.10,.90,ny);
   const temporal=bell(nz,.22,.42)*lateral*inferior;
   const occipitalTaper=.055*posterior*(.35+.65*lateral);
   const frontalFull=.050*anterior*(.55+.45*(1-inferior));
   x*=1+.020*anterior+.030*temporal;
   z+=frontalFull-occipitalTaper;
   y-=.070*temporal;
   y-=.030*superior*(1-lateral*.35);
   // Keep only broad anatomical undulation at G1; fine cortical flow is deferred to G2.
   const broad=.012*M.sin(4.8*ph+2.2*y)+.008*M.sin(7.0*z+2.4*x);
   x+=nx*broad;y+=ny*broad;z+=nz*broad;
   return[x,y,z]
  });
  // Deepen the longitudinal fissure without splitting the continuous surface.
  for(let i=0;i<pos.length;i+=3){
   const x=pos[i],y=pos[i+1],z=pos[i+2];
   const top=smooth(.08,.58,y);
   if(top<=0)continue;
   const mid=M.exp(-M.pow(x/.060,2));
   const ap=.82+.18*M.cos(clamp(z/.82,-1,1)*PI*.65);
   pos[i+1]-=.105*mid*top*ap;
   pos[i]+=M.sign(x||1)*.014*mid*top;
  }
 }
 function cerebellum(){
  // Posterior and inferior to the cerebrum, tucked under the occipital pole.
  for(const side of[-1,1])ellipsoid(24,40,[side*.18,-.38,-.55],[.29,.18,.28],palette.cerebellum,({ny,nz,x,y,z,ph})=>{
   const folia=.014*M.sin(24*(ny*.78+nz*.24)+1.0*M.sin(ph*3));
   return[x*(1+.02*folia),y+ny*folia,z+nz*folia]
  });
 }
 function pons(){
  // Bulbous pons bridges the cerebrum and descending stem, anterior to cerebellum.
  ellipsoid(20,32,[0,-.39,-.30],[.17,.135,.18],palette.pons,({x,y,z,ny,nz})=>{
   const bulge=.010*M.sin(5.5*ny+3.5*nz);
   return[x,y+ny*bulge,z+nz*bulge]
  });
 }
 function stem(){
  const rings=13,sides=22,ids=[];
  for(let r=0;r<=rings;r++){
   const t=r/rings;
   const y=-.43-.46*t;
   const z=-.30-.035*t;
   const rx=.080*(1-t)+.050*t;
   const rz=.070*(1-t)+.043*t;
   const row=[];
   for(let s=0;s<sides;s++){const a=s/sides*TAU;row.push(push(rx*M.cos(a),y,z+rz*M.sin(a),palette.stem))}
   ids.push(row)
  }
  for(let r=0;r<rings;r++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=ids[r][s],b=ids[r][n],c=ids[r+1][n],d=ids[r+1][s];tri(a,d,c);tri(a,c,b)}
 }
 cortex();cerebellum();pons();stem();
 for(let k=0;k<idx.length;k+=3){
  const ia=idx[k]*3,ib=idx[k+1]*3,ic=idx[k+2]*3;
  const ax=pos[ib]-pos[ia],ay=pos[ib+1]-pos[ia+1],az=pos[ib+2]-pos[ia+2];
  const bx=pos[ic]-pos[ia],by=pos[ic+1]-pos[ia+1],bz=pos[ic+2]-pos[ia+2];
  const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;
  for(const q of[ia,ib,ic]){nor[q]+=nx;nor[q+1]+=ny;nor[q+2]+=nz}
 }
 for(let i=0;i<nor.length;i+=3){const d=M.hypot(nor[i],nor[i+1],nor[i+2])||1;nor[i]/=d;nor[i+1]/=d;nor[i+2]/=d}
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V10 G1 vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3}
}
function boot(){
 const stage=window.CapabilityObjectStage;if(!stage)return;
 document.querySelectorAll('[data-capability-brain-v10-g1]').forEach(canvas=>{
  const api=stage.mount(canvas,{meshFactory:build,initialYaw:.64,initialPitch:-.06,spin:.000065,scale:.98,dataset:{brainRenderer:VERSION,brainGeneration:'V10_G1',brainConstruction:'CONTINUOUS_CEREBRAL_SURFACE_GROSS_ANATOMY',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainComponents:'continuous-cerebrum,longitudinal-fissure,posterior-cerebellum,pons,medulla-brainstem',brainArchitectureLaw:'G0_FROZEN_CONTINUOUS_SURFACE;G1_PROPORTION_AND_INFERIOR_ANATOMY_ONLY',brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'}});
  if(api)canvas._brainV10G1=api
 })
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV10G1=Object.freeze({version:VERSION,build,boot});
})();
