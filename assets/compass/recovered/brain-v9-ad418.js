(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_TUBULAR_COMPOSITE_v1';
const M=Math,PI=M.PI,TAU=PI*2;
const norm=(x,y,z)=>{const d=M.hypot(x,y,z)||1;return[x/d,y/d,z/d]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const palette={frontal:[.92,.53,.56],parietal:[.86,.45,.50],temporal:[.78,.34,.42],occipital:[.71,.29,.38],cerebellum:[.62,.28,.36],stem:[.65,.30,.34],pons:[.72,.35,.39]};
 const pushV=(p,n,c)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 function tube(points,radius,color,sides=9){
  if(points.length<2)return;const rings=[];let prevN=[0,1,0];
  for(let i=0;i<points.length;i++){
   const p=points[i],pa=points[M.max(0,i-1)],pb=points[M.min(points.length-1,i+1)],t=norm(...sub(pb,pa)),ref=M.abs(t[1])>.88?[1,0,0]:[0,1,0];
   let n=norm(...cross(t,ref));if(i&&n[0]*prevN[0]+n[1]*prevN[1]+n[2]*prevN[2]<0)n=mul(n,-1);const b=norm(...cross(t,n));prevN=n;
   const r=typeof radius==='function'?radius(i/(points.length-1),i):radius,ring=[];
   for(let s=0;s<sides;s++){const a=s/sides*TAU,radial=add(mul(n,M.cos(a)),mul(b,M.sin(a)));ring.push(pushV(add(p,mul(radial,r)),radial,color))}rings.push(ring)
  }
  for(let i=0;i<rings.length-1;i++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=rings[i][s],b=rings[i][n],c=rings[i+1][n],d=rings[i+1][s];tri(a,b,c);tri(a,c,d)}
 }
 function corticalColor(z,y){if(y<-.23)return palette.temporal;if(z>.34)return palette.frontal;if(z<-.47)return palette.occipital;return palette.parietal}
 function corticalHemisphere(side){
  const bands=25,samples=34;
  for(let band=0;band<bands;band++){
   const q=band/(bands-1),a=-1.18+q*2.36,pts=[];
   for(let i=0;i<samples;i++){
    const u=i/(samples-1),z=-.78+1.56*u,crown=M.sqrt(M.max(0,1-M.pow(z/.93,2))),phase=band*1.73,localA=a+.105*M.sin(u*TAU*2.15+phase)+.045*M.sin(u*TAU*5.1-phase*.4),rx=.58*crown*(1-.08*M.max(0,-z)),ry=.62*crown*(1-.10*M.max(0,-z)),x=side*(.075+rx*M.cos(localA)),y=.055+ry*M.sin(localA)+.028*M.sin(u*TAU*7.0+phase)+.012*M.sin(u*TAU*13.0-phase),zz=z+.035*M.sin(u*TAU*4.0+phase*.55)+.018*M.sin(u*TAU*9.0-phase*.3);pts.push([x,y,zz])
   }
   const mid=pts[M.floor(samples*.58)];tube(pts,.046+(band%4)*.003,corticalColor(mid[2],mid[1]),10)
  }
  const crossRows=11;
  for(let r=0;r<crossRows;r++){
   const z=-.61+r/(crossRows-1)*1.22,pts=[];
   for(let i=0;i<18;i++){
    const u=i/17,a=-.92+u*1.84,crown=M.sqrt(M.max(0,1-M.pow(z/.94,2))),phase=r*2.21,aa=a+.095*M.sin(u*TAU*2.6+phase),x=side*(.078+.555*crown*M.cos(aa)),y=.055+.595*crown*M.sin(aa)+.024*M.sin(u*TAU*5.0+phase),zz=z+.045*M.sin(u*TAU*3.0+phase*.6);pts.push([x,y,zz])
   }
   tube(pts,.041+(r%3)*.003,corticalColor(z,0),9)
  }
 }
 function cerebellum(side){
  for(let r=0;r<17;r++){
   const q=r/16,y=-.50+q*.31,width=.255*(.78+.22*M.sin(q*PI)),pts=[];
   for(let i=0;i<22;i++){
    const u=i/21,sweep=-1+2*u,x=side*(.085+width*(.45+.55*(1-sweep*sweep)))+side*.055*sweep,yy=y+.018*M.sin(u*TAU*3.0+r*.8),z=-.57+.23*sweep-.055*sweep*sweep+.018*M.sin(u*TAU*4.0+r*.55);pts.push([x,yy,z])
   }
   tube(pts,.025+(r%2)*.0025,palette.cerebellum,8)
  }
  for(let c=0;c<6;c++){
   const pts=[];
   for(let i=0;i<15;i++){
    const u=i/14,y=-.48+u*.27,x=side*(.12+.17*(c/5))+.014*M.sin(u*TAU*2+c),z=-.60+.12*(c/5)+.025*M.sin(u*TAU*3+c*.7);pts.push([x,y,z])
   }
   tube(pts,.021,palette.cerebellum,8)
  }
 }
 function brainstem(){const pts=[[0,-.26,-.18],[0,-.32,-.145],[0,-.39,-.115],[0,-.47,-.105],[0,-.56,-.115],[0,-.66,-.13],[0,-.78,-.145],[0,-.91,-.155]];tube(pts,u=>.095*(1-u)+.046*u,palette.stem,12)}
 function pons(){const pts=[];for(let i=0;i<10;i++){const u=i/9;pts.push([0,-.405+u*.12,-.13+.025*M.sin(u*PI)])}tube(pts,u=>.083+.028*M.sin(u*PI),palette.pons,12)}
 corticalHemisphere(-1);corticalHemisphere(1);cerebellum(-1);cerebellum(1);brainstem();pons();
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V9 tubular vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3}
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.48,initialPitch:-.075,spin:.000085,scale:1.00,dataset:{brainRenderer:VERSION,brainContract:'COMPASS_COHERISCOPE_TUBULAR_COMPOSITE_v1',brainMaterial:'NATIVE_ROSE_FLESH_V7',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainComponents:'tubular-cortical-gyri,longitudinal-fissure,natural-sulcal-gaps,paired-cerebellar-folia,pons,medulla,brainstem',brainConstruction:'EMERGENT_TUBULAR_COMPOSITE',brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'}});if(api)canvas._brainV9=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();
