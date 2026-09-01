(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_HORIZONTAL_BANKS_G1';
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
 function bank(points,radius,color,sides=12){
  if(points.length<2)return;const rings=[];let prevN=[0,1,0];
  for(let i=0;i<points.length;i++){
   const p=points[i],pa=points[M.max(0,i-1)],pb=points[M.min(points.length-1,i+1)],t=norm(...sub(pb,pa)),ref=M.abs(t[1])>.88?[1,0,0]:[0,1,0];
   let n=norm(...cross(t,ref));if(i&&n[0]*prevN[0]+n[1]*prevN[1]+n[2]*prevN[2]<0)n=mul(n,-1);const b=norm(...cross(t,n));prevN=n;
   const u=i/(points.length-1),edge=.62+.38*M.pow(M.sin(PI*u),.38),r=(typeof radius==='function'?radius(u,i):radius)*edge,ring=[];
   for(let s=0;s<sides;s++){
    const a=s/sides*TAU;
    const radial=add(mul(n,M.cos(a)*1.22),mul(b,M.sin(a)*.78));
    ring.push(pushV(add(p,mul(radial,r)),norm(...radial),color));
   }
   rings.push(ring);
  }
  for(let i=0;i<rings.length-1;i++)for(let s=0;s<sides;s++){
   const n=(s+1)%sides,a=rings[i][s],b=rings[i][n],c=rings[i+1][n],d=rings[i+1][s];tri(a,b,c);tri(a,c,d)
  }
 }
 function corticalColor(z,y){if(y<-.25)return palette.temporal;if(z>.36)return palette.frontal;if(z<-.46)return palette.occipital;return palette.parietal}
 function corticalHemisphere(side){
  const levels=14,samples=48;
  for(let band=0;band<levels;band++){
   const q=band/(levels-1),baseY=-.54+q*1.10,phase=band*.83,pts=[];
   for(let i=0;i<samples;i++){
    const u=i/(samples-1),z=-.84+1.68*u;
    const yn=baseY/.73,zn=z/.98,available=M.max(0,1-yn*yn-zn*zn*.70),outer=M.sqrt(available);
    const lobe=.035*M.sin(u*PI)+.028*M.exp(-M.pow((z-.56)/.34,2))+.022*M.exp(-M.pow((z+.55)/.31,2));
    const x=side*(.085+.585*outer+lobe);
    const y=baseY+.032*M.sin(u*TAU*2.0+phase)+.014*M.sin(u*TAU*5.0-phase*.5);
    const zz=z+.018*M.sin(u*TAU*3.0+phase*.45)+.010*M.sin(u*TAU*7.0-phase);
    pts.push([x,y,zz]);
   }
   const mid=pts[M.floor(samples*.54)];
   bank(pts,.060+(band%3)*.003,corticalColor(mid[2],mid[1]),12);
  }
  const lowerLevels=4;
  for(let band=0;band<lowerLevels;band++){
   const baseY=-.42-band*.055,phase=1.2+band*.9,pts=[];
   for(let i=0;i<40;i++){
    const u=i/39,z=-.58+1.12*u,outer=M.sqrt(M.max(0,1-M.pow(baseY/.76,2)-M.pow(z/.98,2)*.72));
    const x=side*(.10+.56*outer),y=baseY+.026*M.sin(u*TAU*1.7+phase),zz=z+.016*M.sin(u*TAU*4.0+phase);
    pts.push([x,y,zz]);
   }
   bank(pts,.054,palette.temporal,11);
  }
 }
 function cerebellum(side){
  for(let r=0;r<17;r++){
   const q=r/16,y=-.50+q*.31,width=.255*(.78+.22*M.sin(q*PI)),pts=[];
   for(let i=0;i<22;i++){
    const u=i/21,sweep=-1+2*u,x=side*(.085+width*(.45+.55*(1-sweep*sweep)))+side*.055*sweep,yy=y+.018*M.sin(u*TAU*3.0+r*.8),z=-.57+.23*sweep-.055*sweep*sweep+.018*M.sin(u*TAU*4.0+r*.55);pts.push([x,yy,z]);
   }
   bank(pts,.025+(r%2)*.0025,palette.cerebellum,8);
  }
  for(let c=0;c<6;c++){
   const pts=[];
   for(let i=0;i<15;i++){
    const u=i/14,y=-.48+u*.27,x=side*(.12+.17*(c/5))+.014*M.sin(u*TAU*2+c),z=-.60+.12*(c/5)+.025*M.sin(u*TAU*3+c*.7);pts.push([x,y,z]);
   }
   bank(pts,.021,palette.cerebellum,8);
  }
 }
 function brainstem(){const pts=[[0,-.26,-.18],[0,-.32,-.145],[0,-.39,-.115],[0,-.47,-.105],[0,-.56,-.115],[0,-.66,-.13],[0,-.78,-.145],[0,-.91,-.155]];bank(pts,u=>.095*(1-u)+.046*u,palette.stem,12)}
 function pons(){const pts=[];for(let i=0;i<10;i++){const u=i/9;pts.push([0,-.405+u*.12,-.13+.025*M.sin(u*PI)])}bank(pts,u=>.083+.028*M.sin(u*PI),palette.pons,12)}
 corticalHemisphere(-1);corticalHemisphere(1);cerebellum(-1);cerebellum(1);brainstem();pons();
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V9 horizontal-bank vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3}
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v9-banks]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.48,initialPitch:-.075,spin:.000085,scale:1.00,dataset:{brainRenderer:VERSION,brainContract:'COMPASS_COHERISCOPE_HORIZONTAL_BANKS_G1',brainMaterial:'NATIVE_ROSE_FLESH_V7',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainComponents:'broad-horizontal-cortical-banks,longitudinal-fissure,recessed-sulcal-corridors,paired-cerebellar-folia,pons,medulla,brainstem',brainConstruction:'BROAD_HORIZONTAL_CORTICAL_BANKS',brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'}});if(api)canvas._brainV9=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.CompassBrainV9HorizontalBanks=Object.freeze({version:VERSION,build,boot});
})();
