(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_REFERENCE_REBUILD_v2';
const M=Math,PI=M.PI,TAU=PI*2;
const clamp=(x,a,b)=>M.max(a,M.min(b,x));
const norm=(x,y,z)=>{const d=M.hypot(x,y,z)||1;return[x/d,y/d,z/d]};
const gauss=(x,s)=>M.exp(-(x*x)/(s*s));
const mix=(a,b,t)=>a+(b-a)*t;

function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const palette={
  frontal:[.93,.52,.54],parietal:[.83,.40,.46],temporal:[.76,.31,.39],occipital:[.66,.24,.34],
  cerebellum:[.52,.20,.27],stem:[.63,.27,.31],pons:[.69,.31,.34],fissure:[.18,.035,.055]
 };
 const v=(p,n,c)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 const ridge=x=>M.tanh(x*1.8);

 function hemi(side){
  const rows=64,cols=96,str=cols+1,g=[];
  for(let r=0;r<=rows;r++){
   const phi=-PI/2+r/rows*PI,cp=M.cos(phi),sp=M.sin(phi);
   for(let c=0;c<=cols;c++){
    const th=-PI/2+c/cols*PI,ct=M.cos(th),st=M.sin(th);

    const frontal=gauss(th-.66,.62)*gauss(phi-.02,.95);
    const temporal=gauss(phi+.47,.34)*gauss(th-.05,.95);
    const parietal=gauss(phi-.26,.50)*gauss(th+.02,.72);
    const occipital=gauss(th+.98,.48)*gauss(phi,.88);
    const central=gauss(th-.06,.055)*gauss(phi-.02,.78);
    const lateral=gauss(phi+.34,.052)*gauss(th-.05,.80);
    const precentral=gauss(th-.18,.055)*gauss(phi-.01,.74);
    const postcentral=gauss(th+.07,.060)*gauss(phi-.01,.74);

    const f1=M.sin(th*8.1+phi*5.2+.35);
    const f2=M.sin(th*13.7-phi*8.6-.80);
    const f3=M.sin(th*19.4+phi*11.2+1.30);
    const f4=M.sin(th*27.8-phi*16.5+.20);
    const f5=M.sin(th*36.2+phi*22.0-.45);
    const macro=.39*ridge(f1)+.27*ridge(f2)+.19*ridge(f3)+.10*ridge(f4)+.05*ridge(f5);
    const temporalBands=.30*M.sin(th*15.0+phi*3.2)+.12*M.sin(th*25.0-phi*4.2);
    const frontalBands=.18*M.sin(th*10.0-phi*12.0)+.08*M.sin(th*21.0+phi*15.0);
    const fold=mix(macro,temporalBands,clamp(temporal*.58,0,.58))+frontal*frontalBands;

    const sulcus=.090*central+.058*lateral+.028*precentral+.025*postcentral;
    const valley=.030*M.max(0,-fold);
    const crown=.040*M.max(0,fold);
    const relief=1+crown-valley-sulcus;

    const gap=.034+.012*(1-M.abs(sp))+.015*gauss(ct,.18);
    const rx=.665*(1+.040*parietal+.055*temporal-.025*occipital);
    const ry=.660*(1-.055*temporal+.025*parietal);
    const rz=.915*(1+.075*frontal+.035*occipital+.025*temporal);

    let x=side*(gap+rx*cp*ct*relief);
    let y=.070+ry*sp+.017*fold*cp-.025*lateral-.022*temporal;
    let z=.012+rz*cp*st*(1+.020*fold)+.020*fold*cp;

    const inferior=clamp((-sp-.18)/.82,0,1);
    x*=1-.045*inferior*(1-temporal);
    z+=.045*temporal-.018*inferior;

    const nx=side*(cp*ct+.095*fold*cp-.13*central-.07*lateral);
    const ny=sp*.88+.050*fold-.08*lateral-.04*central;
    const nz=cp*st+.105*fold-.07*central;
    const nn=norm(nx,ny,nz);
    const color=phi<-.27?palette.temporal:th>.38?palette.frontal:th<-.58?palette.occipital:palette.parietal;
    g.push(v([x,y,z],nn,color));
   }
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
   const a=g[r*str+c],b=a+1,d=g[(r+1)*str+c],e=d+1;
   if(side<0){tri(a,e,d);tri(a,b,e)}else{tri(a,d,e);tri(a,e,b)}
  }
 }

 function ellipsoid(cx,cy,cz,rx,ry,rz,color,rows=28,cols=56,warp=()=>1){
  const g=[];
  for(let r=0;r<=rows;r++){
   const ph=-PI/2+r/rows*PI,cp=M.cos(ph),sp=M.sin(ph);
   for(let c=0;c<cols;c++){
    const th=c/cols*TAU,w=warp(th,ph);
    const px=cx+rx*cp*M.cos(th)*w,py=cy+ry*sp*w,pz=cz+rz*cp*M.sin(th)*w;
    const nn=norm(cp*M.cos(th)/rx,sp/ry,cp*M.sin(th)/rz);
    g.push(v([px,py,pz],nn,color));
   }
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
   const n=(c+1)%cols,a=g[r*cols+c],b=g[r*cols+n],d=g[(r+1)*cols+c],e=g[(r+1)*cols+n];
   tri(a,b,e);tri(a,e,d);
  }
 }

 function cerebellarLobe(side){
  ellipsoid(side*.235,-.505,-.575,.335,.235,.345,palette.cerebellum,34,68,(th,ph)=>{
   const folia=.045*M.sin(ph*28.0)+.020*M.sin(ph*49.0+th*2.0)+.012*M.sin(th*10.0-ph*6.0);
   return 1+folia;
  });
 }

 function brainstem(){
  const rings=[
   [-.420,-.105,.118,.105],
   [-.500,-.105,.135,.118],
   [-.575,-.112,.112,.096],
   [-.675,-.120,.086,.074],
   [-.790,-.125,.066,.058],
   [-.910,-.128,.052,.046]
  ],seg=48,g=[];
  for(let r=0;r<rings.length;r++){
   const [y,z,rx,rz]=rings[r];
   for(let i=0;i<seg;i++){
    const t=i/seg*TAU;
    const frontBulge=r===1?1+.10*M.max(0,M.sin(t)):1;
    const px=rx*M.cos(t),py=y,pz=z+rz*M.sin(t)*frontBulge;
    g.push(v([px,py,pz],norm(M.cos(t),.08,M.sin(t)),r<2?palette.pons:palette.stem));
   }
  }
  for(let r=0;r<rings.length-1;r++)for(let i=0;i<seg;i++){
   const n=(i+1)%seg,a=g[r*seg+i],b=g[r*seg+n],d=g[(r+1)*seg+i],e=g[(r+1)*seg+n];
   tri(a,b,e);tri(a,e,d);
  }
 }

 function fissureFloor(){
  const rows=24,cols=44,g=[];
  for(let r=0;r<=rows;r++){
   const y=-.53+r/rows*1.13;
   for(let c=0;c<=cols;c++){
    const z=-.58+c/cols*1.23;
    const x=.006*M.sin(c/cols*TAU*2.0)*(1-.35*M.abs(y));
    g.push(v([x,y,z],norm(0,0,1),palette.fissure));
   }
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
   const a=g[r*(cols+1)+c],b=a+1,d=g[(r+1)*(cols+1)+c],e=d+1;tri(a,b,e);tri(a,e,d);
  }
 }

 hemi(-1);hemi(1);
 fissureFloor();
 cerebellarLobe(-1);cerebellarLobe(1);
 brainstem();

 const vertexCount=pos.length/3;
 if(vertexCount>65535)throw Error('Brain V9 vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{
  p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),
  n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),
  c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),
  i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),
  count:idx.length,triangles:idx.length/3
 };
}

function boot(){
 const stage=window.CapabilityObjectStage;if(!stage)return;
 document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{
  const api=stage.mount(canvas,{
   meshFactory:build,initialYaw:.48,initialPitch:-.075,spin:.000085,scale:1.00,
   dataset:{
    brainRenderer:VERSION,
    brainContract:'COMPASS_COHERISCOPE_ANATOMICAL_WEBGL_v9_REFERENCE_REBUILD',
    brainMaterial:'NATIVE_ROSE_FLESH_V6',
    brainDepthModel:'TRUE_WEBGL_GEOMETRY',
    brainComponents:'bilateral-hemispheres,longitudinal-fissure,central-sulcus,lateral-sulcus,paired-cerebellar-lobes,pons,medulla,brainstem',
    brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'
   }
  });
  if(api)canvas._brainV9=api;
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();
