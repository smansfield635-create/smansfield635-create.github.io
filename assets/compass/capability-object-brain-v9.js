(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_FREE_SPLINE_ANATOMY_v1';
const M=Math,PI=M.PI,TAU=PI*2;
const norm=(x,y,z)=>{const d=M.hypot(x,y,z)||1;return[x/d,y/d,z/d]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const lerp=(a,b,t)=>a+(b-a)*t;

function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const palette={
  frontal:[.93,.55,.58],parietal:[.87,.47,.52],temporal:[.79,.35,.43],occipital:[.70,.29,.38],
  cerebellum:[.60,.27,.35],stem:[.65,.30,.34],pons:[.73,.36,.40]
 };
 const pushV=(p,n,c)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);

 function catmull(p0,p1,p2,p3,t){
  const t2=t*t,t3=t2*t;
  return [0,1,2].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3));
 }
 function spline(ctrl,steps=6){
  const out=[];
  for(let i=0;i<ctrl.length-1;i++){
   const p0=ctrl[M.max(0,i-1)],p1=ctrl[i],p2=ctrl[i+1],p3=ctrl[M.min(ctrl.length-1,i+2)];
   for(let s=0;s<steps;s++)out.push(catmull(p0,p1,p2,p3,s/steps));
  }
  out.push(ctrl[ctrl.length-1]);
  return out;
 }
 function tube(points,radius,color,sides=9){
  if(points.length<2)return;
  const rings=[];let prevN=[0,1,0];
  for(let i=0;i<points.length;i++){
   const p=points[i],pa=points[M.max(0,i-1)],pb=points[M.min(points.length-1,i+1)];
   const t=norm(...sub(pb,pa));
   const ref=M.abs(t[1])>.88?[1,0,0]:[0,1,0];
   let n=norm(...cross(t,ref));
   if(i&&n[0]*prevN[0]+n[1]*prevN[1]+n[2]*prevN[2]<0)n=mul(n,-1);
   const b=norm(...cross(t,n));prevN=n;
   const r=typeof radius==='function'?radius(i/(points.length-1),i):radius;
   const ring=[];
   for(let s=0;s<sides;s++){
    const a=s/sides*TAU,radial=add(mul(n,M.cos(a)),mul(b,M.sin(a)));
    ring.push(pushV(add(p,mul(radial,r)),radial,color));
   }
   rings.push(ring);
  }
  for(let i=0;i<rings.length-1;i++)for(let s=0;s<sides;s++){
   const n=(s+1)%sides,a=rings[i][s],b=rings[i][n],c=rings[i+1][n],d=rings[i+1][s];
   tri(a,b,c);tri(a,c,d);
  }
 }
 function mirror(ctrl,side){return ctrl.map(p=>[side*p[0],p[1],p[2]])}
 function perturb(ctrl,k,j){
  return ctrl.map((p,i)=>{
   const q=i/(ctrl.length-1),phase=k*1.73+j*.91;
   return [p[0]+.018*M.sin(q*TAU*2.3+phase),p[1]+.022*M.sin(q*TAU*3.1+phase*.7),p[2]+.020*M.sin(q*TAU*2.7-phase*.5)];
  });
 }
 function family(side,base,count,color,r0=.045,spread=[.045,.035,.040]){
  for(let k=0;k<count;k++){
   const centered=k-(count-1)/2;
   let ctrl=base.map(p=>[p[0]+centered*spread[0],p[1]+centered*spread[1],p[2]+centered*spread[2]]);
   ctrl=perturb(ctrl,k,count);
   tube(spline(mirror(ctrl,side),6),u=>r0*(.92+.16*M.sin(PI*u)),color,9);
  }
 }
 function branch(side,ctrl,color,r=.038){tube(spline(mirror(ctrl,side),7),u=>r*(1-.18*u),color,8)}

 const frontal=[
  [[.18,.18,.18],[.32,.34,.28],[.48,.46,.43],[.58,.40,.61],[.49,.18,.74]],
  [[.17,.02,.24],[.30,.15,.40],[.50,.20,.54],[.61,.10,.68],[.50,-.05,.76]],
  [[.20,.40,.08],[.34,.56,.18],[.50,.60,.36],[.58,.50,.54],[.46,.30,.66]],
  [[.15,.52,-.02],[.27,.66,.08],[.43,.69,.24],[.55,.62,.42],[.44,.43,.58]]
 ];
 const parietal=[
  [[.16,.46,-.18],[.30,.62,-.12],[.47,.67,.03],[.58,.59,.22],[.48,.42,.38]],
  [[.18,.28,-.30],[.34,.46,-.24],[.52,.53,-.06],[.60,.44,.14],[.50,.26,.30]],
  [[.19,.08,-.38],[.35,.28,-.34],[.53,.35,-.16],[.61,.27,.03],[.51,.10,.20]],
  [[.16,.58,-.34],[.29,.69,-.28],[.44,.71,-.13],[.54,.65,.06],[.43,.51,.22]]
 ];
 const temporal=[
  [[.20,-.12,.42],[.36,-.20,.30],[.53,-.24,.14],[.59,-.18,-.05],[.48,-.10,-.23]],
  [[.18,-.28,.30],[.34,-.35,.17],[.50,-.36,-.01],[.57,-.29,-.18],[.46,-.20,-.34]],
  [[.19,-.39,.14],[.33,-.45,.02],[.47,-.44,-.14],[.52,-.36,-.30],[.41,-.26,-.43]]
 ];
 const occipital=[
  [[.18,.35,-.38],[.31,.48,-.50],[.43,.47,-.63],[.45,.31,-.75],[.34,.13,-.80]],
  [[.18,.12,-.46],[.32,.25,-.58],[.45,.23,-.71],[.46,.06,-.81],[.34,-.10,-.83]],
  [[.18,-.08,-.43],[.31,.02,-.58],[.43,-.01,-.72],[.42,-.18,-.80],[.31,-.30,-.76]]
 ];

 for(const side of [-1,1]){
  frontal.forEach((p,i)=>family(side,p,i===0?4:3,palette.frontal,.045,[.038,.028,.025]));
  parietal.forEach((p,i)=>family(side,p,i===0?4:3,palette.parietal,.044,[.040,.028,.024]));
  temporal.forEach(p=>family(side,p,4,palette.temporal,.043,[.040,.026,.025]));
  occipital.forEach(p=>family(side,p,4,palette.occipital,.042,[.036,.026,.024]));

  branch(side,[[.18,.38,.08],[.25,.28,.18],[.31,.15,.28],[.34,.02,.40]],palette.frontal,.036);
  branch(side,[[.20,.48,-.12],[.28,.36,-.02],[.34,.23,.10],[.36,.10,.22]],palette.parietal,.035);
  branch(side,[[.22,-.12,.08],[.31,-.20,-.03],[.37,-.25,-.16],[.38,-.21,-.30]],palette.temporal,.034);
  branch(side,[[.22,.20,-.43],[.30,.14,-.55],[.34,.04,-.68],[.31,-.08,-.76]],palette.occipital,.033);

  // Medial gyri remain independent and stop short of the midline, creating the fissure through empty space.
  family(side,[[.10,.12,.46],[.13,.29,.31],[.14,.42,.12],[.13,.45,-.10],[.11,.32,-.31]],3,palette.parietal,.035,[.014,.018,.018]);
 }

 function cerebellarFolia(side){
  const bases=[
   [[.08,-.30,-.38],[.18,-.34,-.47],[.29,-.36,-.55],[.36,-.33,-.63],[.31,-.27,-.70]],
   [[.09,-.38,-.35],[.18,-.42,-.45],[.28,-.44,-.54],[.34,-.41,-.63],[.29,-.35,-.71]],
   [[.08,-.46,-.32],[.17,-.49,-.43],[.26,-.50,-.53],[.31,-.47,-.62],[.27,-.42,-.69]],
   [[.07,-.54,-.30],[.15,-.57,-.40],[.24,-.58,-.50],[.28,-.55,-.59],[.24,-.50,-.66]]
  ];
  bases.forEach((b,bi)=>{
   for(let k=0;k<4;k++){
    const off=(k-1.5)*.027;
    const ctrl=b.map((p,i)=>[p[0]+off,p[1]+off*.55+.012*M.sin(i*1.9+k),p[2]+off*.35]);
    tube(spline(mirror(ctrl,side),6),.023+(bi%2)*.002,palette.cerebellum,8);
   }
  });
  branch(side,[[.09,-.31,-.47],[.14,-.39,-.49],[.16,-.48,-.51],[.13,-.56,-.54]],palette.cerebellum,.020);
  branch(side,[[.18,-.30,-.58],[.22,-.39,-.57],[.23,-.48,-.58],[.20,-.56,-.60]],palette.cerebellum,.020);
 }
 cerebellarFolia(-1);cerebellarFolia(1);

 // Brainstem is a bundle, not a single cylinder: descending central tracts plus transverse pons fibers.
 const stemCore=[[0,-.18,-.18],[.00,-.27,-.14],[.00,-.38,-.11],[.00,-.50,-.12],[.00,-.64,-.14],[.00,-.79,-.16],[.00,-.93,-.17]];
 for(let k=-2;k<=2;k++){
  const ctrl=stemCore.map((p,i)=>[p[0]+k*.018,p[1],p[2]+.010*M.sin(i*.9+k)]);
  tube(spline(ctrl,5),u=>lerp(.031,.021,u),palette.stem,8);
 }
 const ponsArcs=[
  [[-.12,-.32,-.10],[-.07,-.28,-.07],[0,-.27,-.05],[.07,-.28,-.07],[.12,-.32,-.10]],
  [[-.14,-.37,-.11],[-.08,-.33,-.08],[0,-.32,-.06],[.08,-.33,-.08],[.14,-.37,-.11]],
  [[-.12,-.42,-.12],[-.07,-.38,-.09],[0,-.37,-.07],[.07,-.38,-.09],[.12,-.42,-.12]]
 ];
 ponsArcs.forEach((p,i)=>tube(spline(p,6),.026+i*.002,palette.pons,8));

 const vertexCount=pos.length/3;
 if(vertexCount>65535)throw Error('Brain V9 free-spline vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3};
}

function boot(){
 const stage=window.CapabilityObjectStage;if(!stage)return;
 document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{
  const api=stage.mount(canvas,{
   meshFactory:build,initialYaw:.48,initialPitch:-.075,spin:.000085,scale:1.00,
   dataset:{
    brainRenderer:VERSION,
    brainContract:'COMPASS_COHERISCOPE_FREE_SPLINE_ANATOMY_v1',
    brainMaterial:'NATIVE_ROSE_FLESH_V8',
    brainDepthModel:'TRUE_WEBGL_GEOMETRY',
    brainComponents:'independent-xyz-gyrus-splines,emergent-sulci,medial-fissure-space,cerebellar-folia-splines,transverse-pons-fibers,medulla-tract-bundle,brainstem',
    brainConstruction:'NO_ENVELOPE_INDEPENDENT_3D_SPLINES',
    brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'
   }
  });
  if(api)canvas._brainV9=api;
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();
