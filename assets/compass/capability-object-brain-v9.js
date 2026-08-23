(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_ANATOMICAL_DENSITY_v2';
const M=Math,PI=M.PI,TAU=PI*2;
const norm=(x,y,z)=>{const d=M.hypot(x,y,z)||1;return[x/d,y/d,z/d]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const lerp=(a,b,t)=>a+(b-a)*t;
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const palette={frontal:[.94,.56,.59],parietal:[.88,.48,.53],temporal:[.80,.36,.44],occipital:[.72,.30,.39],cerebellum:[.61,.28,.36],stem:[.66,.31,.35],pons:[.74,.37,.41]};
 const v=(p,n,c)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i},tri=(a,b,c)=>idx.push(a,b,c);
 function cat(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return[0,1,2].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3))}
 function spline(c,steps=5){const o=[];for(let i=0;i<c.length-1;i++){const p0=c[M.max(0,i-1)],p1=c[i],p2=c[i+1],p3=c[M.min(c.length-1,i+2)];for(let s=0;s<steps;s++)o.push(cat(p0,p1,p2,p3,s/steps))}o.push(c[c.length-1]);return o}
 function tube(points,radius,color,sides=8){if(points.length<2)return;const rings=[];let prev=[0,1,0];for(let i=0;i<points.length;i++){const p=points[i],pa=points[M.max(0,i-1)],pb=points[M.min(points.length-1,i+1)],t=norm(...sub(pb,pa)),ref=M.abs(t[1])>.88?[1,0,0]:[0,1,0];let n=norm(...cross(t,ref));if(i&&n[0]*prev[0]+n[1]*prev[1]+n[2]*prev[2]<0)n=mul(n,-1);const b=norm(...cross(t,n));prev=n;const r=typeof radius==='function'?radius(i/(points.length-1),i):radius,ring=[];for(let s=0;s<sides;s++){const a=s/sides*TAU,rad=add(mul(n,M.cos(a)),mul(b,M.sin(a)));ring.push(v(add(p,mul(rad,r)),rad,color))}rings.push(ring)}for(let i=0;i<rings.length-1;i++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=rings[i][s],b=rings[i][n],c=rings[i+1][n],d=rings[i+1][s];tri(a,b,c);tri(a,c,d)}}
 const mirror=(c,side)=>c.map(p=>[side*p[0],p[1],p[2]]);
 function jitter(c,seed,amp=.014){return c.map((p,i)=>{const q=i/(c.length-1),ph=seed*1.91;return[p[0]+amp*M.sin(q*TAU*2.2+ph),p[1]+amp*1.15*M.sin(q*TAU*3.1+ph*.7),p[2]+amp*M.sin(q*TAU*2.7-ph*.45)]})}
 function family(side,base,count,color,r=.029,spread=[.024,.018,.018],seed=0){for(let k=0;k<count;k++){const d=k-(count-1)/2;let c=base.map(p=>[p[0]+d*spread[0],p[1]+d*spread[1],p[2]+d*spread[2]]);c=jitter(c,seed+k,.012);tube(spline(mirror(c,side),6),u=>r*(.90+.18*M.sin(PI*u)),color,8)}}
 function branch(side,c,color,r=.025,seed=0){tube(spline(mirror(jitter(c,seed,.010),side),7),u=>r*(1-.22*u),color,8)}
 const frontal=[[[.10,.13,.20],[.20,.28,.31],[.34,.39,.45],[.47,.38,.61],[.53,.22,.75]],[[.10,.02,.22],[.21,.12,.37],[.36,.18,.51],[.50,.12,.66],[.54,-.02,.77]],[[.11,.31,.09],[.23,.46,.20],[.38,.53,.37],[.51,.48,.54],[.50,.31,.68]],[[.10,.46,-.02],[.20,.58,.10],[.34,.62,.26],[.47,.56,.44],[.47,.41,.60]],[[.10,.57,-.12],[.20,.66,.00],[.33,.67,.17],[.45,.62,.35],[.43,.49,.52]]];
 const precentral=[[[.11,.54,.18],[.19,.45,.13],[.24,.34,.09],[.25,.21,.05],[.23,.08,.02]],[[.12,.49,.26],[.20,.41,.21],[.27,.31,.17],[.29,.18,.13],[.26,.06,.10]]];
 const postcentral=[[[.11,.55,.05],[.19,.47,.00],[.26,.37,-.04],[.28,.24,-.08],[.25,.10,-.11]],[[.12,.50,-.05],[.21,.42,-.10],[.28,.32,-.14],[.30,.20,-.18],[.27,.08,-.21]]];
 const parietal=[[[.11,.48,-.16],[.22,.59,-.12],[.36,.63,.00],[.49,.57,.17],[.51,.42,.34]],[[.11,.36,-.25],[.23,.50,-.22],[.38,.55,-.08],[.51,.48,.10],[.52,.32,.28]],[[.11,.22,-.34],[.24,.38,-.31],[.40,.43,-.17],[.52,.36,.01],[.51,.20,.20]],[[.11,.59,-.31],[.22,.66,-.27],[.35,.68,-.14],[.47,.63,.03],[.46,.51,.20]],[[.11,.41,-.40],[.23,.53,-.38],[.37,.56,-.25],[.48,.49,-.08],[.47,.35,.09]]];
 const temporal=[[[.12,-.06,.38],[.24,-.12,.28],[.39,-.16,.14],[.52,-.14,-.02],[.53,-.08,-.19]],[[.12,-.16,.32],[.25,-.22,.22],[.40,-.25,.07],[.53,-.23,-.09],[.52,-.16,-.25]],[[.12,-.27,.25],[.25,-.32,.14],[.40,-.34,-.01],[.52,-.31,-.17],[.49,-.23,-.33]],[[.12,-.38,.16],[.24,-.42,.05],[.38,-.44,-.10],[.48,-.40,-.25],[.44,-.31,-.39]]];
 const occipital=[[[.11,.34,-.37],[.21,.45,-.48],[.34,.46,-.61],[.43,.35,-.74],[.37,.19,-.82]],[[.11,.18,-.45],[.22,.30,-.56],[.35,.31,-.69],[.44,.20,-.80],[.37,.04,-.86]],[[.11,.02,-.48],[.22,.13,-.59],[.35,.13,-.72],[.42,.02,-.82],[.35,-.13,-.86]],[[.11,-.13,-.44],[.22,-.04,-.57],[.34,-.04,-.70],[.40,-.16,-.79],[.33,-.28,-.80]]];
 for(const side of[-1,1]){
  frontal.forEach((p,i)=>family(side,p,5,palette.frontal,.029,[.022,.017,.016],10+i*7));
  precentral.forEach((p,i)=>family(side,p,3,palette.frontal,.030,[.018,.014,.010],60+i*5));
  postcentral.forEach((p,i)=>family(side,p,3,palette.parietal,.030,[.018,.014,.010],80+i*5));
  parietal.forEach((p,i)=>family(side,p,5,palette.parietal,.028,[.022,.017,.016],100+i*7));
  temporal.forEach((p,i)=>family(side,p,6,palette.temporal,.027,[.021,.013,.015],150+i*7));
  occipital.forEach((p,i)=>family(side,p,5,palette.occipital,.027,[.020,.015,.015],200+i*7));
  const short=[[.13,.39,.29],[.22,.31,.34],[.30,.24,.40]],[[.14,.34,.18],[.23,.26,.24],[.31,.18,.31]],[[.14,.30,-.25],[.24,.22,-.18],[.33,.15,-.10]],[[.14,-.08,.15],[.24,-.13,.08],[.33,-.16,.00]],[[.14,-.22,-.10],[.24,-.25,-.18],[.33,-.25,-.27]],[[.14,.22,-.53],[.24,.16,-.60],[.32,.08,-.68]];
  short.forEach((c,i)=>branch(side,c,i<2?palette.frontal:i<3?palette.parietal:i<5?palette.temporal:palette.occipital,.024,250+i));
  family(side,[[.055,.15,.48],[.070,.30,.35],[.078,.42,.18],[.075,.46,-.02],[.068,.38,-.22],[.060,.25,-.39]],5,palette.parietal,.024,[.010,.013,.012],300);
  family(side,[[.060,-.02,.36],[.075,.07,.22],[.082,.12,.06],[.078,.10,-.12],[.066,.03,-.28]],4,palette.temporal,.023,[.009,.012,.011],330);
 }
 function folia(side){
  const rows=11;
  for(let r=0;r<rows;r++){
   const y=-.30-r*.026,baseZ=-.43-r*.017,ctrl=[[.055,y,baseZ],[.12,y-.008,baseZ-.055],[.21,y-.012,baseZ-.105],[.30,y-.006,baseZ-.165],[.34,y+.006,baseZ-.225],[.29,y+.012,baseZ-.285]];
   for(let k=0;k<3;k++){const off=(k-1)*.016,c=ctrl.map((p,i)=>[p[0]+off,p[1]+.008*M.sin(i*1.7+r*.6+k),p[2]+off*.45]);tube(spline(mirror(c,side),6),.015+(r%3)*.001,palette.cerebellum,7)}
  }
  for(let c=0;c<5;c++)branch(side,[[.075+c*.032,-.31,-.48+c*.012],[.09+c*.030,-.40,-.50+c*.010],[.10+c*.028,-.49,-.53+c*.008],[.09+c*.026,-.57,-.56+c*.006]],palette.cerebellum,.014,380+c);
 }
 folia(-1);folia(1);
 const stem=[[0,-.18,-.18],[.006,-.26,-.145],[-.004,-.35,-.115],[.005,-.45,-.105],[-.005,-.56,-.12],[.004,-.69,-.145],[0,-.84,-.17],[0,-.96,-.18]];
 for(let k=-3;k<=3;k++){const c=stem.map((p,i)=>[p[0]+k*.010,p[1]+.005*M.sin(i*.9+k),p[2]+.007*M.sin(i*1.2+k*.5)]);tube(spline(c,5),u=>lerp(.020,.013,u),palette.stem,7)}
 const pons=[[[-.12,-.31,-.10],[-.07,-.28,-.065],[0,-.27,-.05],[.07,-.28,-.065],[.12,-.31,-.10]],[[-.14,-.35,-.11],[-.08,-.32,-.075],[0,-.31,-.055],[.08,-.32,-.075],[.14,-.35,-.11]],[[-.14,-.39,-.12],[-.08,-.36,-.085],[0,-.35,-.065],[.08,-.36,-.085],[.14,-.39,-.12]],[[-.12,-.43,-.13],[-.07,-.40,-.095],[0,-.39,-.075],[.07,-.40,-.095],[.12,-.43,-.13]]];
 pons.forEach((c,i)=>tube(spline(c,6),.018+i*.001,palette.pons,7));
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V9 anatomical density vertex budget exceeded: '+vertexCount);
 const buf=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3};
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.48,initialPitch:-.075,spin:.000085,scale:1.00,dataset:{brainRenderer:VERSION,brainContract:'COMPASS_COHERISCOPE_ANATOMICAL_DENSITY_v2',brainMaterial:'NATIVE_ROSE_FLESH_V9',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainComponents:'dense-independent-xyz-gyri,precentral-gyrus,postcentral-gyrus,central-sulcus-gap,lateral-sulcus-gap,narrow-medial-fissure,dense-cerebellar-folia,transverse-pons-fibers,medulla-tract-bundle,brainstem',brainConstruction:'NO_ENVELOPE_ANATOMICAL_SPLINE_TOPOLOGY',brainReferenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'}});if(api)canvas._brainV9=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();
