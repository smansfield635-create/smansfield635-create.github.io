(()=>{
'use strict';
const VERSION='COMPASS_BRAIN_V9_GEOMETRY_G123_v7';
const M=Math,PI=M.PI,TAU=PI*2;
const norm=v=>{const d=M.hypot(v[0],v[1],v[2])||1;return[v[0]/d,v[1]/d,v[2]/d]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const lerp=(a,b,t)=>a+(b-a)*t;
function build(gl){
 const pos=[],nor=[],col=[],idx=[];
 const neutral=[.59,.60,.61],dark=[.46,.47,.48],light=[.68,.69,.70];
 const V=(p,n,c=neutral)=>{const i=pos.length/3;pos.push(...p);nor.push(...n);col.push(...c);return i};
 const tri=(a,b,c)=>idx.push(a,b,c);
 function cat(a,b,c,d,t){const t2=t*t,t3=t2*t;return[0,1,2].map(k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3))}
 function spline(c,steps=2){const o=[];for(let i=0;i<c.length-1;i++){const a=c[M.max(0,i-1)],b=c[i],d=c[i+1],e=c[M.min(c.length-1,i+2)];for(let s=0;s<steps;s++)o.push(cat(a,b,d,e,s/steps))}o.push(c[c.length-1]);return o}
 function tube(points,radius,sides=6,color=neutral){if(points.length<2)return;const rings=[];let prev=[0,1,0];for(let i=0;i<points.length;i++){const p=points[i],a=points[M.max(0,i-1)],b=points[M.min(points.length-1,i+1)],t=norm(sub(b,a)),ref=M.abs(t[1])>.87?[1,0,0]:[0,1,0];let n=norm(cross(t,ref));if(i&&dot(n,prev)<0)n=mul(n,-1);const q=norm(cross(t,n));prev=n;const u=i/M.max(1,points.length-1),r=typeof radius==='function'?radius(u):radius,ring=[];for(let s=0;s<sides;s++){const ang=s/sides*TAU,rad=add(mul(n,M.cos(ang)),mul(q,M.sin(ang)));ring.push(V(add(p,mul(rad,r)),rad,color))}rings.push(ring)}for(let i=0;i<rings.length-1;i++)for(let s=0;s<sides;s++){const n=(s+1)%sides,a=rings[i][s],b=rings[i][n],c=rings[i+1][n],d=rings[i+1][s];tri(a,b,c);tri(a,c,d)}}
 function frame(t){const T=norm(t),ref=M.abs(T[1])>.80?[0,0,1]:[0,1,0],N=norm(cross(T,ref)),B=norm(cross(T,N));return[T,N,B]}
 function wig(seed,k){return .62*M.sin(seed*1.771+k*2.413)+.25*M.sin(seed*.719+k*4.103)}
 function morphCenter(side,center,seed){
  let [x,y,z]=center;
  const lateral=M.min(1,x/.56),front=M.max(0,(z-.18)/.42),rear=M.max(0,(-z-.38)/.48),frontBack=M.min(1,M.abs(z+.10)/.82),inferior=M.max(0,(-y-.06)/.48),superior=M.max(0,(y-.18)/.32);
  const corner=M.min(1,lateral*(.58*superior+.46*front+.52*rear));
  const endTaper=1-.20*frontBack*frontBack-.11*inferior*inferior-.10*corner;
  x*=M.max(.70,endTaper);
  y-=.112*lateral*lateral*(.68+.32*superior);
  y+=.012*M.sin(seed*.83)+(side>0?.006:-.004)*(1-.45*frontBack);
  z+=.040*lateral*lateral*M.sin(seed*.57+.6)+side*.010*(.35+.65*lateral);
  z+=.044*front*(1-.55*lateral)-.040*rear*(1-.50*lateral);
  x-=.044*(front*front+rear*rear)*(.40+.60*lateral);
  x-=.026*superior*lateral*lateral;
  if(inferior>.20)x*=1-.055*inferior*lateral;
  x+=.008*M.sin(seed*1.19)+.004*M.sin(seed*.31+2.1);
  return[x,y,z];
 }
 function morphTangent(side,center,tangent,seed){
  const lateral=M.min(1,center[0]/.56),front=M.max(0,(center[2]-.18)/.42),rear=M.max(0,(-center[2]-.38)/.48),inferior=M.max(0,(-center[1]-.08)/.50),superior=M.max(0,(center[1]-.18)/.32),phase=M.sin(seed*.677);
  return norm([
   tangent[0]*(1-.12*lateral-.15*(front+rear)-.06*superior*lateral),
   tangent[1]-.17*lateral+.055*inferior-.045*superior*lateral+.050*phase*lateral,
   tangent[2]+side*.065*lateral*M.sin(seed*.41)+.19*front-.17*rear+.075*phase*lateral
  ]);
 }
 function serpent(side,center,tangent,length=.22,r=.026,seed=0,color=neutral,amp=.052){
  const mc=morphCenter(side,center,seed),mt=morphTangent(side,center,tangent,seed);
  const c=[side*mc[0],mc[1],mc[2]],t=[side*mt[0],mt[1],mt[2]],F=frame(t),T=F[0],N=F[1],B=F[2],ctrl=[];
  for(let i=0;i<7;i++){
   const u=i/6-.5,a=TAU*(u+.5),a2=TAU*2*(u+.5),taper=.76+.24*M.sin(PI*(u+.5));
   let p=add(c,mul(T,length*u));
   p=add(p,mul(N,amp*(.70*M.sin(a)+.30*M.sin(a2+seed*.37))*taper));
   p=add(p,mul(B,amp*(.48*M.cos(a+seed*.23)+.22*M.sin(a2))*taper));
   p=add(p,[side*wig(seed,i)*.003,wig(seed+3,i)*.003,wig(seed+7,i)*.003]);
   ctrl.push(p);
  }
  tube(spline(ctrl,2),u=>{const end=M.sin(PI*M.max(.035,M.min(.965,u))),cap=.36+.64*M.pow(M.max(0,end),.42);return r*cap*(.91+.16*M.sin(PI*u))},6,color);
 }
 function addSeeds(side,seeds,base,color=neutral){seeds.forEach((s,i)=>serpent(side,[s[0],s[1],s[2]],[s[3],s[4],s[5]],s[6]||.22,s[7]||.026,base+i,color,s[8]||.050))}
 const superior=[];
 const supZ=[.48,.28,.08,-.14,-.34,-.52],supX=[.08,.22,.37,.50];
 supZ.forEach((z,zi)=>supX.forEach((x,xi)=>{const y=.49-.018*xi-.018*M.max(0,zi-3);const tang=xi%2?[.72,-.28,zi%2?-.34:.34]:[.55,-.38,zi%2?.52:-.52];superior.push([x,y,z,...tang,.20+(xi%2)*.025,.026+(xi===2?.001:0),.048])}));
 const frontal=[];
 const fY=[.38,.25,.12,-.01],fZ=[.49,.35];
 fY.forEach((y,yi)=>fZ.forEach((z,zi)=>[.10,.24,.39,.52].forEach((x,xi)=>{const tang=yi%2?[.58,-.62,zi?.28:-.28]:[.48,-.55,zi?-.48:.48];frontal.push([x,y,z-.05*xi,...tang,.21,.027,.052])})));
 const precentral=[],postcentral=[];
 [.10,.22,.35,.47,.55].forEach((x,xi)=>{const y=.40-.035*xi;precentral.push([x,y,.14,.28,-.92,-.12,.24,.027,.040]);postcentral.push([x,y,-.075,.30,-.91,-.18,.24,.027,.040])});
 const parietal=[];
 const pY=[.36,.23,.10,-.01],pZ=[-.20,-.36,-.50];
 pY.forEach((y,yi)=>pZ.forEach((z,zi)=>[.10,.25,.40,.52].forEach((x,xi)=>{if(zi===2&&yi>2)return;const tang=yi%2?[.60,-.28,-.58]:[.54,-.38,.62];parietal.push([x,y,z-.025*xi,...tang,.21,.0265,.050])})));
 const temporal=[];
 const tY=[-.12,-.22,-.32,-.40],tZ=[.28,.10,-.10,-.28];
 tY.forEach((y,yi)=>tZ.forEach((z,zi)=>[.11,.28,.45,.54].forEach((x,xi)=>{if((yi===3&&zi===0)||(xi===3&&zi===3))return;const tang=zi%2?[.45,.06,-.89]:[.40,-.05,.91];temporal.push([x,y,z-.02*xi,...tang,.23,.026,.046])})));
 const occipital=[];
 const oY=[.30,.18,.06,-.07,-.18],oZ=[-.57,-.70,-.81];
 oY.forEach((y,yi)=>oZ.forEach((z,zi)=>[.09,.23,.37,.47].forEach((x,xi)=>{if(yi===4&&zi===0&&xi>1)return;const tang=yi%2?[.55,-.38,-.74]:[.48,-.48,.73];occipital.push([x,y,z+.018*xi,...tang,.18,.025,.044])})));
 const medial=[];
 const mY=[.38,.25,.12,-.02,-.14],mZ=[.35,.18,.00,-.18,-.36,-.52];
 mY.forEach((y,yi)=>mZ.forEach((z,zi)=>{if(yi>3&&zi<2)return;medial.push([.040+.006*(zi%2),y,z,.20,-.58,zi%2?.79:-.79,.18,.022,.038])}));
 const deep=[];
 const dX=[.16,.30,.43],dY=[.30,.15,.00,-.16,-.30],dZ=[.30,.08,-.18,-.42];
 dX.forEach((x,xi)=>dY.forEach((y,yi)=>dZ.forEach((z,zi)=>{if((yi===4&&zi===0)||(yi===0&&zi===3))return;const tang=(xi+yi+zi)%3===0?[.52,-.45,.72]:(xi+yi+zi)%3===1?[.42,.68,-.60]:[.68,-.18,-.71];deep.push([x,y,z,...tang,.18,.0235,.043])})));
 for(const side of[-1,1]){addSeeds(side,superior,10);addSeeds(side,frontal,70);addSeeds(side,precentral,130,light);addSeeds(side,postcentral,150,light);addSeeds(side,parietal,180);addSeeds(side,temporal,260);addSeeds(side,occipital,360);addSeeds(side,medial,470,dark);addSeeds(side,deep,540,dark)}
 function cerebellum(side){
  const folia=[],cx=[.055,.125,.195,.255],cy=[-.285,-.335,-.385,-.435,-.485],cz=[-.45,-.55,-.63];
  cy.forEach((y,yi)=>cz.forEach((z,zi)=>cx.forEach((x,xi)=>{if(zi===2&&xi===3)return;const tang=(yi+xi)%2?[.78,-.08,-.62]:[.80,.05,.59];folia.push([x,y,z-.015*xi,...tang,.11,.0135,.027])})));
  addSeeds(side,folia,700,dark);
  [[.040,-.285,-.16,.46,-.20,-.86,.24,.014,.030],[.055,-.335,-.18,.50,-.18,-.85,.24,.013,.029],[.070,-.385,-.21,.54,-.15,-.83,.23,.0125,.028]].forEach((s,i)=>serpent(side,[s[0],s[1],s[2]],[s[3],s[4],s[5]],s[6],s[7],800+i,light,s[8]));
 }
 cerebellum(-1);cerebellum(1);
 const pons=[
  [[-.16,-.275,-.095],[-.10,-.245,-.062],[-.045,-.230,-.042],[0,-.227,-.036],[.045,-.230,-.042],[.10,-.245,-.062],[.16,-.275,-.095]],
  [[-.17,-.315,-.105],[-.105,-.285,-.072],[-.045,-.270,-.052],[0,-.267,-.046],[.045,-.270,-.052],[.105,-.285,-.072],[.17,-.315,-.105]],
  [[-.155,-.355,-.115],[-.095,-.325,-.082],[-.040,-.310,-.062],[0,-.307,-.056],[.040,-.310,-.062],[.095,-.325,-.082],[.155,-.355,-.115]]
 ];
 pons.forEach((c,i)=>tube(spline(c,3),.020+i*.001,7,light));
 const stem=[[0,-.17,-.15],[0,-.235,-.125],[.004,-.300,-.105],[.008,-.370,-.103],[.006,-.440,-.114],[.002,-.515,-.136],[-.003,-.590,-.160],[-.006,-.665,-.184],[0,-.740,-.202]];
 for(let k=-4;k<=4;k++){const c=stem.map((p,i)=>[p[0]+k*.008,p[1]+.003*M.sin(i*.8+k),p[2]+.004*M.sin(i*1.15+k*.45)]);tube(spline(c,2),u=>lerp(.017,.010,u),6,k%2?dark:neutral)}
 const vertexCount=pos.length/3;if(vertexCount>65535)throw Error('Brain V9 G123 v7 vertex budget exceeded: '+vertexCount);
 const buf=(t,d)=>{const b=gl.createBuffer();gl.bindBuffer(t,b);gl.bufferData(t,d,gl.STATIC_DRAW);return b};
 return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),c:buf(gl.ARRAY_BUFFER,new Float32Array(col)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3};
}
function boot(){const stage=window.CapabilityObjectStage;if(!stage)return;document.querySelectorAll('[data-capability-brain-v9]').forEach(canvas=>{const api=stage.mount(canvas,{meshFactory:build,initialYaw:.42,initialPitch:-.04,spin:0,scale:1.00,inspectionMode:'geometry',dataset:{brainRenderer:VERSION,brainContract:'COMPASS_BRAIN_GEOMETRY_SYSTEMATIC_G123_v7',brainMaterial:'NEUTRAL_GEOMETRY_MATTE',brainDepthModel:'TRUE_WEBGL_GEOMETRY',brainConstruction:'NO_ENVELOPE_INDEPENDENT_3D_SPLINES',brainGeometryPass:'G1_CEREBRAL_SILHOUETTE_FINISH__G2_DIVERSIFIED_PERIMETER_FLOW__G3_INFERIOR_CONTINUITY',brainComponents:'multibank-serpentine-cortex,narrow-longitudinal-fissure,central-sulcus-corridor,lateral-sulcus-corridor,precentral-gyri,postcentral-gyri,deep-intermediate-gyri,compact-cerebellar-folia,pons-fibers,medulla-tracts,brainstem,peduncles'}});if(api)canvas._brainV9=api})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.CompassBrainV9=Object.freeze({version:VERSION,build,boot});
})();