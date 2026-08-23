(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_VOLUMETRIC_SUCCESSOR';
const M=Math,PI=M.PI,TAU=PI*2;
const norm=(x,y,z)=>{const d=M.hypot(x,y,z)||1;return[x/d,y/d,z/d]};
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const palette={frontal:[.98,.67,.65],parietal:[.90,.53,.58],temporal:[.82,.39,.47],occipital:[.70,.28,.39],cerebellum:[.50,.20,.27],stem:[.72,.34,.37],fissure:[.28,.085,.12]};
 const v=(p,n,c)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i},tri=(a,b,c)=>idx.push(a,b,c);
 function hemi(side){
  const rows=40,cols=64,str=cols+1,g=[];
  for(let r=0;r<=rows;r++){
   const phi=-PI/2+r/rows*PI,cp=M.cos(phi),sp=M.sin(phi);
   for(let c=0;c<=cols;c++){
    const th=-PI/2+c/cols*PI,ct=M.cos(th),st=M.sin(th);
    const frontal=M.exp(-M.pow((th-.70)/.50,2))*M.exp(-M.pow((phi-.02)/.88,2));
    const temporal=M.exp(-M.pow((th+.02)/.78,2))*M.exp(-M.pow((phi+.58)/.28,2));
    const parietal=M.exp(-M.pow((th-.02)/.66,2))*M.exp(-M.pow((phi-.35)/.48,2));
    const occ=M.exp(-M.pow((th+.92)/.42,2))*M.exp(-M.pow(phi/.76,2));
    const central=M.exp(-M.pow((th-.05)/.075,2))*M.exp(-M.pow((phi-.08)/.72,2));
    const lateral=M.exp(-M.pow((phi+.34)/.075,2))*M.exp(-M.pow((th-.12)/.72,2));
    const fissure=M.exp(-M.pow(ct/.17,2))*.11;
    const fold=.68*M.sin(th*7.0+phi*5.3)+.43*M.sin(th*13.2-phi*7.4)+.27*M.sin(th*20.4+phi*10.6)+.13*M.sin(th*28.7-phi*15.8);
    const micro=.20*M.sin(th*34.0+phi*21.0)+.11*M.sin(th*43.0-phi*17.0);
    const groove=.070*central+.058*lateral+.018*M.max(0,-fold);
    const lr=.70*(.94+.11*temporal+.04*parietal-.03*occ);
    const relief=1+.108*fold+.024*micro-groove;
    const midgap=.075+.035*(1-M.abs(sp))+.035*fissure;
    const x=side*(midgap+lr*cp*ct*relief);
    const y=.075+.70*sp-.052*temporal+.026*parietal+.031*fold*cp-.018*lateral;
    const z=.015+.92*cp*st*(1+.082*frontal+.052*occ+.038*temporal)+.044*fold*cp+.012*micro;
    const nn=norm(side*(cp*ct+.16*fold*cp-.11*central),sp*.79+.065*micro-.06*lateral,cp*st+.14*fold-.08*central);
    const color=phi<-.29?palette.temporal:th>.36?palette.frontal:th<-.52?palette.occipital:palette.parietal;
    g.push(v([x,y,z],nn,color));
   }
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=g[r*str+c],b=a+1,d=g[(r+1)*str+c],e=d+1;if(side<0){tri(a,e,d);tri(a,b,e)}else{tri(a,d,e);tri(a,e,b)}}
 }
 function ell(cx,cy,cz,rx,ry,rz,color,rows=22,cols=42,warp=.04){
  const g=[];for(let r=0;r<=rows;r++){const ph=-PI/2+r/rows*PI,cp=M.cos(ph),sp=M.sin(ph);for(let c=0;c<cols;c++){const th=c/cols*TAU,rel=1+warp*(M.sin(th*9+ph*6)+.45*M.sin(th*16-ph*10));g.push(v([cx+rx*cp*M.cos(th)*rel,cy+ry*sp*rel,cz+rz*cp*M.sin(th)*rel],norm(cp*M.cos(th)/rx,sp/ry,cp*M.sin(th)/rz),color))}}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const n=(c+1)%cols,a=g[r*cols+c],b=g[r*cols+n],d=g[(r+1)*cols+c],e=g[(r+1)*cols+n];tri(a,b,e);tri(a,e,d)}
 }
 function tube(){const rings=[[-.55,-.08,.15,.125],[-.72,-.10,.12,.095],[-.90,-.12,.086,.067],[-1.08,-.13,.056,.044]],seg=28,g=[];for(const [y,z,rx,rz] of rings)for(let i=0;i<seg;i++){const t=i/seg*TAU;g.push(v([rx*M.cos(t),y,z+rz*M.sin(t)],norm(M.cos(t),.10,M.sin(t)),palette.stem))}for(let r=0;r<rings.length-1;r++)for(let i=0;i<seg;i++){const n=(i+1)%seg,a=g[r*seg+i],b=g[r*seg+n],d=g[(r+1)*seg+i],e=g[(r+1)*seg+n];tri(a,b,e);tri(a,e,d)}}
 function fissureFloor(){const rows=16,cols=30,g=[];for(let r=0;r<=rows;r++){const y=-.58+r/rows*1.20;for(let c=0;c<=cols;c++){const z=-.48+c/cols*1.02;const width=.030+.020*(1-M.abs(y));g.push(v([width*M.sin((c/cols)*PI*2),y,z],norm(0,0,1),palette.fissure))}}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=g[r*(cols+1)+c],b=a+1,d=g[(r+1)*(cols+1)+c],e=d+1;tri(a,b,e);tri(a,e,d)}}
 hemi(-1);hemi(1);fissureFloor();ell(0,-.56,-.62,.58,.28,.37,palette.cerebellum,24,46,.065);ell(0,-.57,-.08,.24,.19,.22,palette.stem,18,34,.025);tube();
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3}
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.30,initialPitch:-.045,spin:.00010,scale:.98,dataset:{brainRenderer:VERSION,brainContract:'COMPASS_COHERISCOPE_ANATOMICAL_WEBGL_v9',brainMaterial:'NATIVE_ROSE_FLESH_V5',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainComponents:'bilateral-hemispheres,longitudinal-fissure,central-sulcus,lateral-sulcus,cerebellum,pons,brainstem'}});if(api)canvas._brainV9=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();
