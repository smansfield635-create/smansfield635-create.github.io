(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_GEOMETRY_G123_v1';
const M=Math,PI=M.PI,TAU=PI*2;
const norm=(x,y,z)=>{const d=M.hypot(x,y,z)||1;return[x/d,y/d,z/d]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const lerp=(a,b,t)=>a+(b-a)*t;
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const neutral=[.58,.58,.58],dark=[.46,.47,.48],light=[.66,.67,.68];
 const v=(p,n,c=neutral)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 function cat(a,b,c,d,t){const t2=t*t,t3=t2*t;return[0,1,2].map(k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3))}
 function spline(c,steps=5){const o=[];for(let i=0;i<c.length-1;i++){const a=c[M.max(0,i-1)],b=c[i],d=c[i+1],e=c[M.min(c.length-1,i+2)];for(let s=0;s<steps;s++)o.push(cat(a,b,d,e,s/steps))}o.push(c[c.length-1]);return o}
 function tube(points,radius,sides=8,color=neutral){if(points.length<2)return;const rings=[];let prev=[0,1,0];for(let i=0;i<points.length;i++){const p=points[i],a=points[M.max(0,i-1)],b=points[M.min(points.length-1,i+1)],t=norm(...sub(b,a)),ref=M.abs(t[1])>.88?[1,0,0]:[0,1,0];let n=norm(...cross(t,ref));if(i&&n[0]*prev[0]+n[1]*prev[1]+n[2]*prev[2]<0)n=mul(n,-1);const q=norm(...cross(t,n));prev=n;const u=i/M.max(1,points.length-1),r=typeof radius==='function'?radius(u):radius,ring=[];for(let s=0;s<sides;s++){const ang=s/sides*TAU,rad=add(mul(n,M.cos(ang)),mul(q,M.sin(ang)));ring.push(v(add(p,mul(rad,r)),rad,color))}rings.push(ring)}for(let i=0;i<rings.length-1;i++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=rings[i][s],b=rings[i][n],c=rings[i+1][n],d=rings[i+1][s];tri(a,b,c);tri(a,c,d)}}
 const mirror=(c,side)=>c.map(p=>[side*p[0],p[1],p[2]]);
 const jitter=(n,seed)=>M.sin(seed*1.713+n*2.417)*.5+M.sin(seed*.731+n*4.119)*.25;
 function path(side,ctrl,r=.026,color=neutral,sides=8){tube(spline(mirror(ctrl,side),5),u=>r*(.90+.18*M.sin(PI*u)),sides,color)}
 function family(side,base,count,r=.028,spread=[.018,.014,.014],seed=0,color=neutral){for(let k=0;k<count;k++){const d=k-(count-1)/2,c=base.map((p,i)=>[p[0]+d*spread[0]+.006*jitter(i,seed+k),p[1]+d*spread[1]+.008*jitter(i+3,seed+k),p[2]+d*spread[2]+.007*jitter(i+6,seed+k)]);path(side,c,r,color)}}
 function localGyrus(side,s,seed=0){const [x,y,z,dx,dy,dz,curve,depth,r]=s,c=[];for(let i=0;i<5;i++){const u=i/4-.5,w=M.sin((u+.5)*PI),bend=curve*M.sin(u*TAU),tw=depth*M.sin((u+.5)*PI*2);c.push([x+dx*u+bend*.36+tw*.18,y+dy*u+curve*w*.24+tw*.16,z+dz*u-bend*.22+tw*.34])}path(side,c,r||.023,seed%3===0?light:neutral,8)}

 // G1 — gross proportions and hemispheric closure, still entirely independent spline geometry.
 const superior=[
  [[.040,.16,.53],[.075,.31,.49],[.14,.45,.39],[.25,.56,.23],[.39,.59,.03],[.49,.50,-.18],[.47,.34,-.38]],
  [[.042,.02,.55],[.085,.18,.51],[.17,.33,.44],[.30,.45,.30],[.44,.46,.10],[.53,.35,-.13],[.50,.18,-.34]],
  [[.044,-.10,.48],[.095,.04,.46],[.19,.19,.39],[.34,.29,.25],[.48,.28,.04],[.55,.15,-.18],[.49,-.02,-.37]]
 ];
 const lateral=[
  [[.07,.34,.39],[.18,.45,.46],[.34,.51,.42],[.50,.47,.29],[.59,.34,.09],[.61,.16,-.13],[.55,-.01,-.34]],
  [[.075,.17,.34],[.20,.28,.38],[.38,.33,.32],[.54,.28,.17],[.62,.13,-.03],[.61,-.06,-.24],[.52,-.20,-.41]],
  [[.08,-.03,.29],[.21,.06,.30],[.39,.09,.22],[.55,.03,.07],[.62,-.12,-.13],[.58,-.27,-.31],[.47,-.35,-.45]]
 ];
 const posterior=[
  [[.06,.40,-.29],[.15,.50,-.42],[.29,.52,-.58],[.42,.42,-.72],[.47,.25,-.83],[.39,.06,-.88]],
  [[.06,.22,-.38],[.16,.33,-.51],[.30,.34,-.67],[.43,.22,-.80],[.45,.04,-.88],[.34,-.13,-.89]],
  [[.065,.03,-.41],[.17,.13,-.55],[.31,.12,-.70],[.42,-.01,-.82],[.40,-.17,-.87],[.29,-.31,-.82]]
 ];
 const temporal=[
  [[.075,-.11,.35],[.20,-.17,.29],[.36,-.20,.16],[.51,-.19,-.01],[.59,-.12,-.20],[.54,-.03,-.37]],
  [[.075,-.25,.29],[.21,-.31,.20],[.37,-.34,.06],[.51,-.32,-.11],[.56,-.23,-.29],[.49,-.14,-.44]],
  [[.08,-.38,.19],[.20,-.43,.10],[.35,-.45,-.05],[.48,-.42,-.21],[.50,-.32,-.37],[.42,-.22,-.49]]
 ];
 for(const side of[-1,1]){
  superior.forEach((p,i)=>family(side,p,4,.027,[.012,.014,.012],i));
  lateral.forEach((p,i)=>family(side,p,4,.027,[.017,.013,.012],10+i));
  posterior.forEach((p,i)=>family(side,p,4,.026,[.015,.013,.012],20+i));
  temporal.forEach((p,i)=>family(side,p,4,.026,[.016,.011,.012],30+i));
  family(side,[[.030,.16,.46],[.038,.31,.35],[.042,.43,.18],[.043,.46,-.02],[.040,.39,-.22],[.034,.27,-.40]],4,.023,[.006,.010,.009],40);
 }

 // G2 — cortical topology. Many short, interlocking 3-D gyri, regionally oriented. No global envelope.
 // Frontal: oblique/vertical interlocks anterior to central sulcus.
 const frontalSeeds=[
 [.12,.48,.36,.18,-.10,.08,.055,.045,.024],[.23,.51,.43,.20,-.07,.02,-.050,.040,.024],[.35,.47,.49,.19,-.12,-.04,.050,.050,.024],
 [.13,.36,.43,.16,-.13,.10,-.050,.040,.023],[.27,.37,.51,.20,-.09,.00,.060,.045,.024],[.43,.35,.55,.18,-.11,-.06,-.050,.050,.024],
 [.14,.23,.46,.18,-.10,.10,.055,.040,.023],[.30,.24,.55,.20,-.08,-.01,-.060,.045,.024],[.46,.22,.59,.17,-.11,-.07,.050,.045,.023],
 [.13,.10,.47,.17,-.08,.11,-.050,.035,.023],[.29,.11,.58,.19,-.05,-.02,.055,.045,.023],[.45,.08,.62,.16,-.08,-.08,-.050,.040,.023]
 ];
 // Pre/post-central gyri flank a protected gap around z≈0.02–0.08.
 const precentralSeeds=[
 [.10,.48,.16,.10,-.28,-.02,.030,.025,.025],[.20,.43,.18,.11,-.30,-.03,-.030,.030,.025],[.31,.39,.19,.10,-.31,-.04,.032,.026,.025],[.42,.34,.18,.09,-.29,-.04,-.030,.028,.024]
 ];
 const postcentralSeeds=[
 [.10,.48,-.05,.10,-.28,-.03,-.030,.025,.025],[.20,.43,-.07,.11,-.30,-.04,.030,.030,.025],[.31,.39,-.08,.10,-.31,-.04,-.032,.026,.025],[.42,.34,-.09,.09,-.29,-.05,.030,.028,.024]
 ];
 // Parietal: interlocking arcs posterior to central sulcus.
 const parietalSeeds=[
 [.13,.49,-.18,.18,-.07,-.10,.050,.045,.023],[.27,.52,-.23,.20,-.06,-.11,-.055,.040,.024],[.42,.48,-.28,.18,-.10,-.12,.050,.045,.023],
 [.14,.36,-.22,.18,-.08,-.11,-.055,.040,.023],[.29,.38,-.29,.20,-.07,-.12,.060,.045,.024],[.45,.34,-.35,.17,-.10,-.11,-.050,.045,.023],
 [.15,.23,-.27,.18,-.07,-.11,.050,.040,.023],[.30,.24,-.36,.20,-.05,-.12,-.055,.045,.023],[.45,.20,-.43,.16,-.08,-.11,.050,.040,.023]
 ];
 // Temporal: predominantly horizontal flow below protected lateral-sulcus corridor.
 const temporalSeeds=[
 [.14,-.12,.30,.26,-.025,-.12,.035,.030,.023],[.30,-.13,.22,.28,-.020,-.14,-.035,.035,.023],[.46,-.12,.11,.24,-.025,-.15,.040,.035,.023],
 [.14,-.23,.24,.26,-.020,-.13,-.035,.030,.023],[.30,-.25,.14,.28,-.015,-.15,.035,.035,.023],[.46,-.24,.02,.24,-.020,-.15,-.040,.035,.023],
 [.14,-.34,.16,.25,-.015,-.13,.035,.030,.022],[.30,-.36,.05,.27,-.010,-.15,-.035,.035,.022],[.45,-.34,-.08,.23,-.015,-.15,.040,.035,.022]
 ];
 // Occipital: tighter posterior closure with short folding arcs.
 const occipitalSeeds=[
 [.12,.37,-.54,.16,-.08,-.17,.045,.035,.022],[.26,.39,-.62,.18,-.07,-.18,-.045,.040,.023],[.39,.34,-.70,.16,-.09,-.17,.045,.035,.022],
 [.12,.23,-.59,.17,-.07,-.18,-.045,.035,.022],[.27,.24,-.69,.18,-.06,-.18,.050,.040,.023],[.40,.19,-.77,.15,-.08,-.15,-.045,.035,.022],
 [.13,.08,-.62,.17,-.06,-.17,.045,.035,.022],[.27,.08,-.73,.18,-.05,-.16,-.045,.040,.022],[.39,.03,-.81,.15,-.07,-.13,.045,.035,.022]
 ];
 for(const side of[-1,1]){
  frontalSeeds.forEach((s,i)=>localGyrus(side,s,100+i));
  precentralSeeds.forEach((s,i)=>localGyrus(side,s,130+i));
  postcentralSeeds.forEach((s,i)=>localGyrus(side,s,140+i));
  parietalSeeds.forEach((s,i)=>localGyrus(side,s,160+i));
  temporalSeeds.forEach((s,i)=>localGyrus(side,s,190+i));
  occipitalSeeds.forEach((s,i)=>localGyrus(side,s,220+i));
  // Medial cingulate-like arcs close the hemispheric banks while preserving a narrow real fissure.
  [[.025,.35,.30,.11,-.12,-.14,.025,.020,.020],[.028,.23,.18,.12,-.11,-.15,-.025,.022,.020],[.030,.10,.04,.12,-.09,-.16,.025,.022,.020],[.030,-.02,-.13,.11,-.07,-.16,-.025,.020,.019]].forEach((s,i)=>localGyrus(side,s,250+i));
 }

 // G3 — cerebellum, pons, medulla and brainstem integrated as their own 3-D spline systems.
 function cerebellum(side){
  // Two depth layers of tightly packed folia create volume without ellipsoids or cards.
  for(let layer=0;layer<2;layer++)for(let row=0;row<14;row++){
   const y=-.28-row*.020-layer*.012,z=-.46-row*.014-layer*.045;
   const ctrl=[[.035+layer*.018,y,z],[.095+layer*.018,y-.006,z-.045],[.17+layer*.020,y-.010,z-.090],[.245+layer*.020,y-.006,z-.145],[.30+layer*.018,y+.002,z-.200],[.27+layer*.016,y+.008,z-.250]];
   path(side,ctrl,.0125-(layer*.0008),row%2?dark:neutral,7);
  }
  // Short transverse folds stitch folia into an integrated cerebellar mass.
  for(let k=0;k<7;k++){
   const x=.065+k*.030,z=-.49-k*.027;
   path(side,[[x,-.30,z],[x+.020,-.38,z-.018],[x+.018,-.47,z-.032],[x,-.55,z-.045]],.011,dark,7);
  }
 }
 cerebellum(-1);cerebellum(1);

 // Pons: broad transverse fiber arcs wrapping a central tract bundle.
 const pons=[
  [[-.16,-.29,-.095],[-.10,-.255,-.060],[-.04,-.240,-.040],[0,-.238,-.035],[.04,-.240,-.040],[.10,-.255,-.060],[.16,-.29,-.095]],
  [[-.17,-.335,-.105],[-.11,-.300,-.070],[-.04,-.285,-.048],[0,-.283,-.042],[.04,-.285,-.048],[.11,-.300,-.070],[.17,-.335,-.105]],
  [[-.16,-.380,-.115],[-.10,-.345,-.080],[-.04,-.330,-.058],[0,-.328,-.050],[.04,-.330,-.058],[.10,-.345,-.080],[.16,-.380,-.115]]
 ];
 pons.forEach((c,i)=>tube(spline(c,6),.019+i*.001,8,light));
 // Longitudinal brainstem tracts curve posteriorly and taper into medulla/spinal continuation.
 const stem=[[0,-.18,-.165],[0,-.245,-.135],[.003,-.315,-.112],[.006,-.390,-.108],[.003,-.475,-.122],[-.002,-.565,-.145],[-.004,-.655,-.172],[0,-.745,-.195]];
 for(let k=-4;k<=4;k++){const c=stem.map((p,i)=>[p[0]+k*.0085,p[1]+.003*M.sin(i*.8+k),p[2]+.004*M.sin(i*1.2+k*.4)]);tube(spline(c,5),u=>lerp(.0175,.0105,u),7,k%2?dark:neutral)}
 // Cerebellar peduncle-like connectors integrate cerebellum with the pons without blob geometry.
 for(const side of[-1,1]){
  path(side,[[.035,-.31,-.16],[.07,-.33,-.22],[.10,-.34,-.30],[.13,-.35,-.39],[.15,-.36,-.47]],.015,light,7);
  path(side,[[.040,-.37,-.17],[.075,-.39,-.24],[.105,-.40,-.32],[.135,-.41,-.41],[.16,-.42,-.49]],.013,neutral,7);
 }

 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V9 G123 vertex budget exceeded: '+vertexCount);
 const buf=(t,d)=>{const b=gl.createBuffer();gl.bindBuffer(t,b);gl.bufferData(t,d,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3};
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.42,initialPitch:-.04,spin:0,scale:1.00,inspectionMode:'geometry',dataset:{brainRenderer:VERSION,brainContract:'COMPASS_BRAIN_GEOMETRY_SYSTEMATIC_G123_v1',brainMaterial:'NEUTRAL_GEOMETRY_MATTE',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainConstruction:'NO_ENVELOPE_INDEPENDENT_3D_SPLINES',brainGeometryPass:'G1_GROSS_CLOSURE__G2_CORTICAL_TOPOLOGY__G3_INFERIOR_ANATOMY',brainComponents:'independent-cortical-gyri,narrow-longitudinal-fissure,central-sulcus-corridor,lateral-sulcus-corridor,precentral-gyri,postcentral-gyri,dense-cerebellar-folia,pons-fibers,medulla-tracts,brainstem,peduncles'}});if(api)canvas._brainV9=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();