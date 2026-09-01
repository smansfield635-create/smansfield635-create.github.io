(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V10_CONTINUOUS_SURFACE_G0_v1';
const M=Math,PI=M.PI,TAU=PI*2;
const palette={cortex:[.88,.48,.53],cerebellum:[.67,.32,.39],pons:[.73,.36,.41],stem:[.62,.27,.33]};
const clamp=(v,a,b)=>M.max(a,M.min(b,v));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
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
 function ellipsoid(rows,cols,center,radii,color,fold){
  grid(rows,cols,(v,u)=>{
   const th=v*PI,ph=u*TAU,st=M.sin(th),ct=M.cos(th),cp=M.cos(ph),sp=M.sin(ph);
   let nx=st*cp,ny=ct,nz=st*sp;
   let x=center[0]+radii[0]*nx,y=center[1]+radii[1]*ny,z=center[2]+radii[2]*nz;
   if(fold){const f=fold({u,v,th,ph,nx,ny,nz,x,y,z});x+=nx*f;y+=ny*f;z+=nz*f}
   return[x,y,z]
  },color)
 }
 function cortex(){
  ellipsoid(38,64,[0,.10,.02],[.58,.58,.76],palette.cortex,({ph,nx,ny,nz,x,y,z})=>{
   const lateral=1-M.exp(-M.pow(M.abs(nx)/.18,2));
   const crown=smooth(-.55,.45,ny);
   const inferior=1-smooth(-.82,-.35,ny);
   const bandPhase=20.5*y+1.9*M.sin(5.3*z)+1.15*M.sin(3.7*x+1.1*z);
   const longPhase=10.0*z+2.2*M.sin(4.0*y)+1.4*M.sin(3.2*x);
   const broad=.034*M.sin(bandPhase)*(.55+.45*lateral);
   const secondary=.016*M.sin(longPhase)*(.35+.65*lateral);
   const regional=.012*M.sin(6.0*ph+3.1*y)*(1-inferior*.65);
   return(broad+secondary+regional)*( .45+.55*crown );
  });
  // Carve a longitudinal fissure into the already continuous cortical surface.
  for(let i=0;i<pos.length;i+=3){
   const x=pos[i],y=pos[i+1],z=pos[i+2];
   if(y<.18)continue;
   const mid=M.exp(-M.pow(x/.075,2));
   const top=smooth(.18,.62,y);
   const anteriorPosterior=.78+.22*M.cos(clamp(z/.8,-1,1)*PI*.7);
   pos[i+1]-=.115*mid*top*anteriorPosterior;
   pos[i]+=M.sign(x||1)*.012*mid*top;
  }
 }
 function cerebellum(){
  for(const side of[-1,1])ellipsoid(22,36,[side*.18,-.34,-.47],[.27,.19,.29],palette.cerebellum,({ph,ny,nz})=>{
   const folia=.018*M.sin(25*(ny*.7+nz*.35)+1.2*M.sin(ph*3));
   return folia;
  });
 }
 function pons(){ellipsoid(18,28,[0,-.36,-.22],[.16,.14,.15],palette.pons,({ny,nz})=>.006*M.sin(9*ny+5*nz))}
 function stem(){
  const rings=11,sides=20,ids=[];
  for(let r=0;r<=rings;r++){
   const t=r/rings,y=-.39-.48*t,z=-.18-.015*t,rx=.085*(1-t)+.052*t,rz=.075*(1-t)+.045*t,row=[];
   for(let s=0;s<sides;s++){const a=s/sides*TAU;row.push(push(rx*M.cos(a),y,z+rz*M.sin(a),palette.stem))}ids.push(row)
  }
  for(let r=0;r<rings;r++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=ids[r][s],b=ids[r][n],c=ids[r+1][n],d=ids[r+1][s];tri(a,d,c);tri(a,c,b)}
 }
 cortex();cerebellum();pons();stem();
 // Recompute normals from the displaced continuous surfaces.
 for(let k=0;k<idx.length;k+=3){const ia=idx[k]*3,ib=idx[k+1]*3,ic=idx[k+2]*3;const ax=pos[ib]-pos[ia],ay=pos[ib+1]-pos[ia+1],az=pos[ib+2]-pos[ia+2],bx=pos[ic]-pos[ia],by=pos[ic+1]-pos[ia+1],bz=pos[ic+2]-pos[ia+2],nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;for(const q of[ia,ib,ic]){nor[q]+=nx;nor[q+1]+=ny;nor[q+2]+=nz}}
 for(let i=0;i<nor.length;i+=3){const d=M.hypot(nor[i],nor[i+1],nor[i+2])||1;nor[i]/=d;nor[i+1]/=d;nor[i+2]/=d}
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V10 vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3}
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v10]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.52,initialPitch:-.08,spin:.000075,scale:.98,dataset:{brainRenderer:VERSION,brainGeneration:'V10_G0',brainConstruction:'CONTINUOUS_DISPLACED_SURFACE',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainComponents:'continuous-cerebrum,longitudinal-fissure,paired-cerebellum,pons,medulla-brainstem',brainArchitectureLaw:'NO_EXPOSED_CORTICAL_TUBES_NO_FLOATING_CORTICAL_PARTS',brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'}});if(api)canvas._brainV10=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.CompassBrainV10=Object.freeze({version:VERSION,build,boot});
})();