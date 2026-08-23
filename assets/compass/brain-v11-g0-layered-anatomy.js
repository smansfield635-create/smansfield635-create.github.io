(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V11_G0_LAYERED_ANATOMY_v1';
const M=Math,PI=M.PI,TAU=PI*2;
const palette={left:[.83,.42,.49],right:[.88,.47,.53],cerebellum:[.63,.30,.37],stem:[.69,.32,.38],cord:[.55,.23,.29],iface:[.73,.35,.41]};
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const push=(x,y,z,c)=>{const i=pos.length/3;pos.push(x,y,z);nor.push(0,0,0);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 function ellipsoid(rows,cols,center,radii,color,deform){
  const ids=[];
  for(let r=0;r<=rows;r++){
   const row=[],th=r/rows*PI,st=M.sin(th),ct=M.cos(th);
   for(let s=0;s<=cols;s++){
    const ph=s/cols*TAU,cp=M.cos(ph),sp=M.sin(ph),nx=st*cp,ny=ct,nz=st*sp;
    let x=center[0]+radii[0]*nx,y=center[1]+radii[1]*ny,z=center[2]+radii[2]*nz;
    if(deform){[x,y,z]=deform({x,y,z,nx,ny,nz,ph,th})}
    row.push(push(x,y,z,color));
   } ids.push(row);
  }
  for(let r=0;r<rows;r++)for(let s=0;s<cols;s++){const a=ids[r][s],b=ids[r][s+1],c=ids[r+1][s+1],d=ids[r+1][s];tri(a,d,c);tri(a,c,b)}
 }
 function hemisphere(side){
  const cx=side*.255;
  ellipsoid(34,48,[cx,.12,.03],[.37,.50,.72],side<0?palette.left:palette.right,({x,y,z,nx,ny,nz})=>{
   const anterior=M.max(0,nz),posterior=M.max(0,-nz),inferior=M.max(0,-ny);
   x+=side*(.025*anterior+.018*inferior);
   z+=.035*anterior-.025*posterior;
   y-=.045*inferior*M.max(0,nz+.25);
   // Flatten medial face to make the fissure a true inter-layer gap.
   const medial=M.exp(-M.pow((x-side*.09)/.11,2));
   x+=side*.025*medial;
   return[x,y,z]
  });
 }
 function cerebellum(){
  ellipsoid(26,42,[0,-.39,-.54],[.35,.18,.28],palette.cerebellum,({x,y,z,nx,ny,nz,ph})=>{
   const vermis=.035*M.exp(-M.pow(x/.10,2));
   const folia=.010*M.sin(18*(ny*.85+nz*.3)+2*M.sin(ph));
   return[x,y+ny*folia+vermis,z+nz*folia]
  });
 }
 function tube(points,sides,color){
  const ids=[];
  for(let r=0;r<points.length;r++){
   const p=points[r],row=[];
   for(let s=0;s<sides;s++){const a=s/sides*TAU;row.push(push(p.x+p.rx*M.cos(a),p.y,p.z+p.rz*M.sin(a),color))}ids.push(row)
  }
  for(let r=0;r<ids.length-1;r++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=ids[r][s],b=ids[r][n],c=ids[r+1][n],d=ids[r+1][s];tri(a,d,c);tri(a,c,b)}
 }
 function brainstem(){
  const pts=[];
  for(let i=0;i<=18;i++){const t=i/18;const pons=M.exp(-M.pow((t-.24)/.16,2));pts.push({x:0,y:-.30-.42*t,z:-.28-.025*t,rx:.075+.085*pons-.025*t,rz:.065+.075*pons-.022*t})}
  tube(pts,24,palette.stem);
 }
 function cord(){
  const pts=[];for(let i=0;i<=10;i++){const t=i/10;pts.push({x:0,y:-.72-.30*t,z:-.305-.012*t,rx:.048-.010*t,rz:.041-.008*t})}tube(pts,20,palette.cord);
 }
 function interfaces(){
  // Small hidden/overlapped registration volumes prevent visual disconnection without fusing layers.
  ellipsoid(12,20,[0,-.30,-.24],[.12,.09,.12],palette.iface);
  ellipsoid(10,18,[0,-.42,-.42],[.13,.08,.12],palette.iface);
 }
 hemisphere(-1);hemisphere(1);cerebellum();interfaces();brainstem();cord();
 for(let k=0;k<idx.length;k+=3){const ia=idx[k]*3,ib=idx[k+1]*3,ic=idx[k+2]*3;const ax=pos[ib]-pos[ia],ay=pos[ib+1]-pos[ia+1],az=pos[ib+2]-pos[ia+2],bx=pos[ic]-pos[ia],by=pos[ic+1]-pos[ia+1],bz=pos[ic+2]-pos[ia+2];const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;for(const q of[ia,ib,ic]){nor[q]+=nx;nor[q+1]+=ny;nor[q+2]+=nz}}
 for(let i=0;i<nor.length;i+=3){const d=M.hypot(nor[i],nor[i+1],nor[i+2])||1;nor[i]/=d;nor[i+1]/=d;nor[i+2]/=d}
 if(pos.length/3>65535)throw Error('Brain V11 G0 vertex budget exceeded');
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3}
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v11-g0]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.64,initialPitch:-.05,spin:.00006,scale:.94,dataset:{brainRenderer:VERSION,brainGeneration:'V11_G0',brainConstruction:'LAYERED_ANATOMICAL_ASSEMBLY',brainLayers:'left-cerebrum,right-cerebrum,cerebellum,brainstem,cord,interfaces',brainArchitectureLaw:'ANATOMICAL_LAYERS_REMAIN_INDEPENDENT;INTERFACES_REGISTER_CONTINUITY;NO_CORTICAL_DETAIL_AT_G0'}});if(api)canvas._brainV11G0=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV11G0=Object.freeze({version:VERSION,build,boot});
})();