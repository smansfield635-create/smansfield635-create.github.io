(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_GEOMETRY_G123_v2';
const M=Math,PI=M.PI,TAU=PI*2;
const norm=(x,y,z)=>{const d=M.hypot(x,y,z)||1;return[x/d,y/d,z/d]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const lerp=(a,b,t)=>a+(b-a)*t;
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const neutral=[.58,.59,.60],dark=[.46,.47,.48],light=[.67,.68,.69];
 const v=(p,n,c=neutral)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 function cat(a,b,c,d,t){const t2=t*t,t3=t2*t;return[0,1,2].map(k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3))}
 function spline(c,steps=4){const o=[];for(let i=0;i<c.length-1;i++){const a=c[M.max(0,i-1)],b=c[i],d=c[i+1],e=c[M.min(c.length-1,i+2)];for(let s=0;s<steps;s++)o.push(cat(a,b,d,e,s/steps))}o.push(c[c.length-1]);return o}
 function tube(points,radius,sides=7,color=neutral){if(points.length<2)return;const rings=[];let prev=[0,1,0];for(let i=0;i<points.length;i++){const p=points[i],a=points[M.max(0,i-1)],b=points[M.min(points.length-1,i+1)],t=norm(...sub(b,a)),ref=M.abs(t[1])>.88?[1,0,0]:[0,1,0];let n=norm(...cross(t,ref));if(i&&n[0]*prev[0]+n[1]*prev[1]+n[2]*prev[2]<0)n=mul(n,-1);const q=norm(...cross(t,n));prev=n;const u=i/M.max(1,points.length-1),r=typeof radius==='function'?radius(u):radius,ring=[];for(let s=0;s<sides;s++){const ang=s/sides*TAU,rad=add(mul(n,M.cos(ang)),mul(q,M.sin(ang)));ring.push(v(add(p,mul(rad,r)),rad,color))}rings.push(ring)}for(let i=0;i<rings.length-1;i++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=rings[i][s],b=rings[i][n],c=rings[i+1][n],d=rings[i+1][s];tri(a,b,c);tri(a,c,d)}}
 const mirror=(c,side)=>c.map(p=>[side*p[0],p[1],p[2]]);
 function path(side,ctrl,r=.027,color=neutral,sides=7){tube(spline(mirror(ctrl,side),4),u=>r*(.91+.16*M.sin(PI*u)),sides,color)}
 function wig(seed,k){return M.sin(seed*1.731+k*2.417)*.63+M.sin(seed*.713+k*4.073)*.27}
 function gyrus(side,s,seed=0,color=neutral){const [x,y,z,dx,dy,dz,bend=.045,twist=.035,r=.026]=s,c=[];for(let i=0;i<7;i++){const u=i/6-.5,w=M.sin((u+.5)*PI),wave=M.sin(u*TAU),wave2=M.sin((u+.5)*TAU*2);c.push([x+dx*u+bend*wave*.38+twist*wave2*.13+wig(seed,i)*.004,y+dy*u+bend*w*.30+twist*wave2*.18+wig(seed+3,i)*.004,z+dz*u-bend*wave*.27+twist*wave2*.35+wig(seed+7,i)*.004])}path(side,c,r,color,7)}
 function bank(side,seeds,seedBase,color=neutral){seeds.forEach((s,i)=>gyrus(side,s,seedBase+i,color))}

 // G1 + G2 are intentionally the same physical structures: short independent gyri create both silhouette and cortical topology.
 // No long scaffold paths, no hemisphere shell, no radius envelope.
 const superior=[
  [.075,.50,.48,.12,-.03,.10,.040,.030,.027],[.19,.53,.51,.15,-.02,.03,-.045,.032,.027],[.33,.52,.48,.14,-.04,-.06,.046,.034,.028],[.46,.47,.42,.13,-.06,-.09,-.044,.032,.027],
  [.070,.48,.30,.11,-.05,.10,-.040,.030,.027],[.19,.51,.31,.15,-.04,.02,.048,.034,.028],[.34,.49,.27,.14,-.06,-.07,-.046,.032,.027],[.48,.43,.20,.12,-.07,-.10,.042,.030,.027],
  [.065,.45,.10,.11,-.06,.08,.040,.028,.026],[.18,.48,.09,.14,-.05,.00,-.046,.032,.027],[.33,.45,.05,.14,-.07,-.07,.047,.033,.027],[.47,.38,-.02,.12,-.07,-.10,-.042,.030,.026],
  [.070,.41,-.13,.11,-.05,.07,-.042,.028,.026],[.19,.44,-.15,.14,-.05,-.01,.046,.031,.027],[.34,.40,-.19,.13,-.07,-.08,-.045,.031,.026],[.46,.33,-.27,.11,-.08,-.10,.040,.028,.026],
  [.080,.34,-.35,.11,-.04,.05,.040,.027,.025],[.20,.37,-.38,.14,-.05,-.02,-.044,.030,.026],[.34,.33,-.43,.13,-.07,-.08,.043,.030,.026],[.44,.25,-.50,.10,-.07,-.09,-.038,.027,.025]
 ];
 const frontal=[
  [.10,.36,.53,.12,-.13,.08,.050,.040,.028],[.22,.38,.57,.15,-.10,.01,-.052,.041,.028],[.36,.35,.57,.15,-.12,-.07,.052,.043,.028],[.49,.29,.51,.12,-.14,-.10,-.048,.039,.027],
  [.09,.22,.52,.11,-.13,.09,-.050,.038,.027],[.21,.23,.59,.15,-.11,.01,.055,.043,.028],[.36,.20,.60,.15,-.12,-.07,-.053,.043,.028],[.50,.14,.53,.12,-.12,-.10,.048,.038,.027],
  [.09,.08,.48,.11,-.12,.09,.048,.036,.027],[.22,.09,.57,.15,-.10,.01,-.054,.041,.028],[.37,.06,.58,.14,-.10,-.08,.052,.041,.027],[.50,.00,.50,.11,-.10,-.10,-.046,.036,.026]
 ];
 // Precentral and postcentral banks remain separated by a genuine central-sulcus corridor.
 const precentral=[
  [.10,.43,.18,.08,-.25,-.01,.030,.024,.027],[.20,.40,.19,.09,-.27,-.02,-.031,.026,.027],[.31,.37,.18,.09,-.28,-.03,.032,.027,.027],[.42,.32,.17,.08,-.26,-.04,-.030,.025,.026],[.51,.25,.15,.07,-.23,-.04,.028,.023,.025]
 ];
 const postcentral=[
  [.10,.43,-.04,.08,-.25,-.02,-.030,.024,.027],[.20,.40,-.06,.09,-.27,-.03,.031,.026,.027],[.31,.37,-.07,.09,-.28,-.04,-.032,.027,.027],[.42,.32,-.08,.08,-.26,-.05,.030,.025,.026],[.51,.25,-.10,.07,-.23,-.05,-.028,.023,.025]
 ];
 const parietal=[
  [.10,.36,-.19,.12,-.10,-.10,.048,.038,.027],[.22,.39,-.25,.15,-.08,-.11,-.052,.040,.028],[.36,.37,-.31,.15,-.10,-.11,.053,.042,.028],[.49,.31,-.37,.12,-.12,-.10,-.048,.038,.027],
  [.10,.23,-.25,.12,-.10,-.10,-.049,.038,.027],[.22,.26,-.32,.15,-.08,-.11,.053,.041,.028],[.36,.24,-.39,.15,-.10,-.10,-.052,.041,.028],[.49,.18,-.45,.12,-.11,-.09,.047,.037,.027],
  [.10,.10,-.31,.11,-.09,-.10,.046,.035,.026],[.22,.13,-.39,.15,-.07,-.11,-.051,.039,.027],[.36,.11,-.47,.14,-.08,-.10,.050,.039,.027],[.48,.05,-.53,.11,-.09,-.08,-.044,.034,.026]
 ];
 // Temporal rows are predominantly horizontal and remain below the lateral-sulcus corridor.
 const temporal=[
  [.11,-.10,.36,.23,-.02,-.10,.036,.029,.026],[.31,-.11,.27,.25,-.02,-.12,-.038,.032,.027],[.49,-.10,.14,.20,-.03,-.13,.036,.030,.026],
  [.11,-.20,.31,.23,-.02,-.11,-.037,.029,.026],[.31,-.21,.20,.25,-.01,-.13,.039,.032,.027],[.49,-.20,.06,.20,-.02,-.13,-.037,.030,.026],
  [.11,-.30,.24,.22,-.02,-.11,.035,.028,.025],[.31,-.31,.12,.24,-.01,-.13,-.037,.031,.026],[.48,-.30,-.02,.19,-.02,-.13,.035,.028,.025],
  [.12,-.39,.15,.21,-.01,-.10,-.033,.027,.024],[.31,-.40,.02,.23,-.01,-.12,.035,.030,.025],[.46,-.39,-.11,.18,-.01,-.12,-.033,.027,.024]
 ];
 const occipital=[
  [.08,.29,-.54,.11,-.09,-.12,.042,.032,.025],[.20,.32,-.62,.14,-.07,-.13,-.045,.035,.026],[.34,.30,-.70,.14,-.09,-.12,.045,.035,.026],[.46,.24,-.77,.11,-.10,-.10,-.041,.031,.025],
  [.08,.17,-.59,.11,-.08,-.12,-.042,.032,.025],[.20,.20,-.68,.14,-.07,-.13,.046,.035,.026],[.34,.18,-.76,.14,-.08,-.11,-.045,.035,.026],[.45,.12,-.82,.10,-.09,-.08,.040,.030,.024],
  [.09,.04,-.61,.11,-.07,-.11,.040,.030,.024],[.21,.07,-.71,.14,-.06,-.12,-.044,.034,.025],[.34,.05,-.79,.13,-.07,-.10,.043,.033,.025],[.44,-.01,-.84,.10,-.07,-.07,-.038,.029,.024],
  [.11,-.09,-.59,.11,-.05,-.10,-.038,.029,.024],[.23,-.07,-.69,.13,-.05,-.11,.042,.032,.025],[.35,-.09,-.77,.12,-.05,-.09,-.041,.031,.024]
 ];
 // Medial gyri create closure close to the midline while preserving a narrow real fissure.
 const medial=[
  [.032,.35,.36,.07,-.11,-.12,.026,.022,.022],[.037,.24,.26,.08,-.10,-.13,-.027,.023,.022],[.040,.13,.15,.08,-.09,-.14,.028,.024,.022],[.041,.02,.03,.08,-.08,-.14,-.027,.023,.022],
  [.040,-.08,-.10,.08,-.07,-.13,.026,.022,.021],[.038,-.17,-.23,.07,-.06,-.12,-.025,.021,.021],[.036,.28,-.34,.07,-.09,-.12,.025,.021,.021],[.034,.16,-.45,.07,-.08,-.11,-.024,.020,.021]
 ];
 // Intermediate-depth local gyri prevent a hollow/card reading at oblique angles without supplying any hidden backing surface.
 const depthBank=[
  [.20,.31,.39,.15,-.09,.08,.045,.055,.025],[.34,.29,.36,.15,-.10,-.06,-.046,.056,.025],[.22,.18,.36,.15,-.09,.07,-.044,.052,.025],[.37,.16,.32,.14,-.10,-.07,.046,.054,.025],
  [.20,.28,-.16,.15,-.08,-.10,.044,.052,.025],[.35,.26,-.22,.15,-.09,-.10,-.046,.054,.025],[.22,.14,-.28,.15,-.08,-.10,-.043,.050,.025],[.37,.12,-.34,.14,-.09,-.09,.045,.052,.025],
  [.22,-.16,.20,.20,-.01,-.11,.034,.045,.024],[.38,-.17,.10,.19,-.01,-.12,-.035,.046,.024],[.23,-.29,.08,.20,-.01,-.11,-.033,.043,.024],[.39,-.29,-.04,.18,-.01,-.11,.034,.044,.024]
 ];
 for(const side of[-1,1]){
  bank(side,superior,10);bank(side,frontal,50);bank(side,precentral,90,light);bank(side,postcentral,110,light);bank(side,parietal,130);bank(side,temporal,170);bank(side,occipital,210);bank(side,medial,260,dark);bank(side,depthBank,300,dark);
 }

 // G3 — compact cerebellar folia made from many short folds, not long comb bands.
 function cerebellum(side){
  const folia=[];
  const rows=[-.30,-.335,-.370,-.405,-.440,-.475,-.510];
  const xs=[.075,.155,.235];
  rows.forEach((y,ri)=>xs.forEach((x,xi)=>{
   const z=-.49-ri*.020-xi*.050;
   folia.push([x,y,z,.12,-.012,-.055,(ri+xi)%2?.030:-.030,.030,.014]);
   folia.push([x+.025,y-.016,z-.030,.105,.010,-.050,(ri+xi)%2?-.027:.027,.028,.013]);
  }));
  folia.forEach((s,i)=>gyrus(side,s,400+i,i%3===0?dark:neutral));
  // deeper folia layer provides real volume while remaining independent geometry
  [[.09,-.34,-.58,.13,-.10,-.05,.025,.035,.013],[.19,-.36,-.63,.14,-.08,-.05,-.026,.036,.013],[.27,-.39,-.68,.11,-.09,-.04,.024,.032,.013],
   [.10,-.45,-.60,.13,-.08,-.05,-.024,.033,.013],[.20,-.47,-.65,.13,-.07,-.05,.025,.034,.013],[.27,-.49,-.70,.10,-.07,-.04,-.023,.030,.013]].forEach((s,i)=>gyrus(side,s,470+i,dark));
 }
 cerebellum(-1);cerebellum(1);

 // Broad pons transitions into curved medulla/brainstem tracts.
 const pons=[
  [[-.155,-.285,-.105],[-.10,-.255,-.070],[-.045,-.240,-.047],[0,-.237,-.040],[.045,-.240,-.047],[.10,-.255,-.070],[.155,-.285,-.105]],
  [[-.165,-.330,-.115],[-.105,-.300,-.080],[-.045,-.285,-.057],[0,-.282,-.050],[.045,-.285,-.057],[.105,-.300,-.080],[.165,-.330,-.115]],
  [[-.150,-.375,-.125],[-.095,-.345,-.090],[-.040,-.330,-.067],[0,-.327,-.060],[.040,-.330,-.067],[.095,-.345,-.090],[.150,-.375,-.125]]
 ];
 pons.forEach((c,i)=>tube(spline(c,5),.020+i*.001,8,light));
 const stem=[[0,-.18,-.17],[0,-.245,-.14],[.004,-.315,-.118],[.008,-.385,-.113],[.006,-.455,-.122],[.002,-.530,-.142],[-.003,-.605,-.165],[-.006,-.680,-.188],[0,-.755,-.205]];
 for(let k=-4;k<=4;k++){const c=stem.map((p,i)=>[p[0]+k*.008,p[1]+.003*M.sin(i*.8+k),p[2]+.004*M.sin(i*1.15+k*.45)]);tube(spline(c,4),u=>lerp(.017,.010,u),7,k%2?dark:neutral)}
 // Peduncles connect the posterior-inferior systems without bulbs or hidden masses.
 for(const side of[-1,1]){
  path(side,[[.035,-.300,-.175],[.060,-.315,-.235],[.085,-.325,-.305],[.110,-.335,-.380],[.135,-.350,-.455]],.0145,light,7);
  path(side,[[.040,-.355,-.180],[.065,-.370,-.245],[.092,-.385,-.320],[.120,-.400,-.395],[.145,-.420,-.470]],.013,neutral,7);
 }
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V9 G123 v2 vertex budget exceeded: '+vertexCount);
 const buf=(t,d)=>{const b=gl.createBuffer();gl.bindBuffer(t,b);gl.bufferData(t,d,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3};
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.42,initialPitch:-.04,spin:0,scale:1.00,inspectionMode:'geometry',dataset:{brainRenderer:VERSION,brainContract:'COMPASS_BRAIN_GEOMETRY_SYSTEMATIC_G123_v2',brainMaterial:'NEUTRAL_GEOMETRY_MATTE',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainConstruction:'NO_ENVELOPE_INDEPENDENT_3D_SPLINES',brainGeometryPass:'G1_LOCAL_GYRUS_CLOSURE__G2_ANATOMICAL_TOPOLOGY__G3_INFERIOR_INTEGRATION',brainComponents:'packed-short-cortical-gyri,narrow-longitudinal-fissure,central-sulcus-corridor,lateral-sulcus-corridor,precentral-gyri,postcentral-gyri,compact-cerebellar-folia,pons-fibers,medulla-tracts,brainstem,peduncles'}});if(api)canvas._brainV9=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();