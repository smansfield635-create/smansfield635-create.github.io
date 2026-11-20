/*
 * C3/A5 Gen3426 — Native Generosity Harvest V2 art-floor reconstruction.
 * Original stone-arch, cascades, orchard, wheat, hills, fence and birds are
 * real navigable first-party world geometry; no image backdrop or sprite.
 * Exact admitted consumer file; HELD, not published. No private S4/S5/S6/S7
 * master, atlas, eye, morph, binary, source-derived public derivative or surrogate.
 * The native rabbit's verified source and artistic C1 integration are separate.
 * Living Constellation and first-party E1 remain untouched.
 */
import { createNativeWebGLDevice } from "../../assets/engine/dgb.native-webgl-device.v1.mjs";

export const HARVEST_BOUNDARY = Object.freeze({
  project: "NINE_SUMMITS_GENEROSITY_HARVEST",
  registration: "HELD",
  architecture: "ONE_NATIVE_WEBGL_CONTEXT",
  rabbit: "PRIVATE_S4_S6_S7_NOT_INCLUDED",
  artwork: "ORIGINAL_HARVEST_COMPOSITION_PROTECTED",
  deepForage: "S11_S12_S13_REJECTED",
  artisticC1: "HOLD",
  worldUp: "Y",
  rabbitSourceToWorld: "[x,z,-y]",
  protectedSoles: Object.freeze([2659, 2747, 5581, 5821]),
  proposedRabbitAnchor: Object.freeze([2.25, 0.42, 4.0])
});

const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const length3 = (v) => Math.hypot(v[0], v[1], v[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const unit = (v) => { const l = length3(v) || 1; return [v[0]/l, v[1]/l, v[2]/l]; };
const hash = (n) => { const v = Math.sin(n * 127.1 + 78.233) * 43758.5453; return v - Math.floor(v); };
/* Gen3426 V2 - art-directed first-party native landscape. True world geometry. */
const riverAt = (x) => -1.45 + .61 * Math.sin(x * .24 + .63);
const pathAt = (z) => .32 + 3.00 / (1 + Math.exp(-.62 * (z - 1.3))) + .16 * Math.sin(z * .47);
const waterLevel = (x) => -.24 + .15 * Math.tanh((x + 3.1)*1.8) + .15 * Math.tanh((x + 8.7)*2.1);
function ground(x,z) {
  const rolling=.03+.16*Math.sin(x*.22+z*.1)*Math.cos(z*.24)+.07*Math.sin(x*.71-z*.46);
  const waterCut=.70*clamp((2.65-Math.abs(z-riverAt(x)))/1.85,0,1);
  const midSlope=.06*clamp((-z-4)/14,0,1);
  return rolling+midSlope-waterCut;
}
function pathHeight(z) {
  const base=ground(pathAt(z),z)+.115;
  const dist=Math.abs(z+.87);
  const rise=clamp((4.9-dist)/3.25,0,1);
  return mix(base,1.61+.10*Math.cos(dist*.68),rise*rise*(3-2*rise));
}
function buildWorld(){
  const positions=[], normals=[], colors=[], roles=[];
  const tint=(base,seed,degree=.1)=>{let t=(hash(seed)*2-1)*degree;return base.map(v=>clamp(v+t,0,1));};
  const pal={grass:[.30,.43,.20],moss:[.32,.43,.22],stone:[.53,.49,.43],ivory:[.79,.74,.62],wood:[.45,.30,.20],leaf:[.26,.39,.19],wheat:[.76,.57,.20],water:[.22,.44,.47],pink:[.77,.37,.39],floral:[.88,.50,.54]};
  function triangle(a,b,c,rgb,role=0){
    const v=cross(sub(b,a),sub(c,a));const l=length3(v);
    if(l<1e-9) return;
    const n=[v[0]/l,v[1]/l,v[2]/l];
    for(const p of [a,b,c]){positions.push(p[0],p[1],p[2]);normals.push(...n);colors.push(...rgb);roles.push(role);}
  }
  function quad(a,b,c,d,rgb,role=0){triangle(a,b,c,rgb,role);triangle(a,c,d,rgb,role);}
  function box(x,y,z,sx,sy,sz,col,role=0){
    const x0=x-sx/2,x1=x+sx/2,y0=y-sy/2,y1=y+sy/2,z0=z-sz/2,z1=z+sz/2;
    const a=[x0,y0,z0],b=[x1,y0,z0],c=[x1,y0,z1],d=[x0,y0,z1];
    const e=[x0,y1,z0],f=[x1,y1,z0],g=[x1,y1,z1],h=[x0,y1,z1];
    quad(e,f,b,a,col,role);quad(f,g,c,b,col,role);quad(g,h,d,c,col,role);
    quad(h,e,a,d,col,role);quad(h,g,f,e,col,role);quad(a,b,c,d,col,role);
  }
  function beam(a,b,r,col,sides=6,role=0){
    const axis=unit(sub(b,a)),right=unit(cross(axis,Math.abs(axis[1])>.93?[1,0,0]:[0,1,0])),up=unit(cross(axis,right));
    const ring=(p,t)=>[p[0]+r*(right[0]*Math.cos(t)+up[0]*Math.sin(t)),p[1]+r*(right[1]*Math.cos(t)+up[1]*Math.sin(t)),p[2]+r*(right[2]*Math.cos(t)+up[2]*Math.sin(t))];
    for(let k=0;k<sides;k++){const a0=k*TAU/sides,a1=(k+1)*TAU/sides;quad(ring(a,a0),ring(a,a1),ring(b,a1),ring(b,a0),col,role);}
  }
  function ellipsoid(c,rx,ry,rz,col,lat=6,lon=9,role=0){
    const p=(v,u)=>[c[0]+rx*Math.cos(v)*Math.cos(u),c[1]+ry*Math.sin(v),c[2]+rz*Math.cos(v)*Math.sin(u)];
    for(let j=0;j<lat;j++)for(let k=0;k<lon;k++){
      const v0=-Math.PI/2+j*Math.PI/lat,v1=v0+Math.PI/lat,u0=k*TAU/lon,u1=(k+1)*TAU/lon;
      quad(p(v1,u0),p(v1,u1),p(v0,u1),p(v0,u0),col,role);
    }
  }
  function rock(x,y,z,r,seed){
    const shade=tint([.49,.46,.40],seed,.13);
    ellipsoid([x,y+r*.36,z],r*(.76+.5*hash(seed+1)),r*(.47+.25*hash(seed+2)),r*(.75+.40*hash(seed+3)),shade,5,8);
    if(hash(seed*2)>.74)ellipsoid([x-r*.28,y+r*.58,z+.11*r],r*.49,r*.26,r*.55,[.39,.47,.31],4,7,1);
  }
  function conifer(x,z,h,seed){
    const y=ground(x,z);beam([x,y,z],[x,y+h*.98,z],h*.065,[.37,.27,.19],6);
    for(let j=0;j<5;j++){const r=h*(.18-j*.028),cy=y+h*(.33+j*.14);
      for(let k=0;k<7;k++){const a=k*TAU/7,rp=[x+Math.cos(a)*r,cy,z+Math.sin(a)*r],rn=[x+Math.cos(a+TAU/7)*r,cy,z+Math.sin(a+TAU/7)*r];triangle(rp,rn,[x,cy+h*.25,z],tint([.19,.33,.25],seed+j+k,.07),1);}
    }
  }
  // Landscape is genuine sculpted depth, not a screen-aligned photograph or skybox.
  const NX=86,NZ=63,minX=-25,maxX=26,minZ=-21,maxZ=16;
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){
    const x=minX+(maxX-minX)*i/NX,z=minZ+(maxZ-minZ)*j/NZ;
    const dx=(maxX-minX)/NX,dz=(maxZ-minZ)/NZ;
    const col=tint([.34,.46,.25],i*331+j*79,.05);
    quad([x,ground(x,z),z],[x,ground(x,z+dz),z+dz],[x+dx,ground(x+dx,z+dz),z+dz],[x+dx,ground(x+dx,z),z],col,1);
  }
  // The valley continues behind the near-field terrace, with no transparent
  // void between terrain and mountains. These are real undulating hill cells.
  for(let j=0;j<40;j++)for(let i=0;i<65;i++){
    const z=-83+j*62/40,x=-71+i*142/65,dx=142/65,dz=62/40;
    const h=(xx,zz)=>{const t=clamp((-zz-21)/62,0,1);return (1-t)*ground(xx,-21)+t*(2.1+.65*Math.sin(xx*.16+zz*.13)*Math.cos(zz*.09));};
    const c=tint(j%5===0?[.36,.46,.29]:[.34,.48,.29],i*9+j*42,.04);
    quad([x,h(x,z),z],[x,h(x,z+dz),z+dz],[x+dx,h(x+dx,z+dz),z+dz],[x+dx,h(x+dx,z),z],c);
  }
  // Atmospheric, physically separated mountain strata and luminous snow ridges.
  function ridge(z,peaks,base,width,col,snow){
    const count=peaks.length-1;
    for(let i=0;i<count;i++){
      const x0=-66+i*132/count,x1=-66+(i+1)*132/count;
      const a=[x0,base,z],b=[x1,base,z],u=[x0,peaks[i],z],v=[x1,peaks[i+1],z];
      quad(a,b,v,u,tint(col,i+z*.2,.025));
      const h0=Math.max(base,peaks[i]-width),h1=Math.max(base,peaks[i+1]-width);
      quad([x0,h0,z+.06],[x1,h1,z+.06],v,u,tint(snow,i+17,.035));
      // Add a real facet offset toward the viewer for dimensional rock shading.
      if(i%2===0)triangle([x0,base,z+1.1],[x1,base,z+.6],[x1,peaks[i+1],z],tint(col,i*17,.09));
    }
  }
  ridge(-133,[6,7,6,8,11,9,11,15,12,18,15,12,13,10,12,8,7],2,2,[.40,.47,.54],[.83,.84,.81]);
  ridge(-108,[4,5,5,7,9,8,9,11,10,12,10,11,8,7,9,6,5],1.8,2,[.35,.45,.46],[.65,.73,.72]);
  ridge(-85,[3,4,4,5,6,7,6,8,7,8,7,6,7,6,5,4,3],2.0,1.8,[.32,.43,.33],[.49,.56,.46]);
  // Real hill terraces, alternating lines of vines and orchard beyond the water.
  for(let row=0;row<11;row++){
    const z=-18+row*.9;
    for(let k=0;k<39;k++){
      const x=-23+k*.52+(row%2)*.28;if(x>2&&x<7)continue;
      const y=ground(x,z);const h=.14+.06*hash(row*12+k);
      beam([x,y,z],[x,y+h,z],.025,hash(k)> .4?[.36,.51,.25]:[.45,.58,.29],4,1);
    }
  }
  for(let i=0;i<27;i++){const x=-20+i*1.5;conifer(x,-24-(i%3)*1.1,.75+hash(i)*2,i*31);}
  // Tiny hilltop architecture is actual 3D tower geometry and curved viaduct spans.
  const castleX=22,castleZ=-77,castleY=6.0;
  box(castleX,castleY,castleZ,10,1.4,3,[.70,.66,.54]);
  for(let i=0;i<5;i++){
    const x=castleX-4+i*2;
    box(x,castleY+2.6,castleZ,1.3,4.4,1.25,tint([.81,.73,.61],i,.055));
    box(x,castleY+5.1,castleZ,1.6,.3,1.6,[.65,.59,.50]);
    ellipsoid([x,castleY+5.7,castleZ],.70,.95,.70,[.52,.58,.54],4,7);
  }
  box(castleX,castleY+1.6,castleZ-1.65,7,2.7,.9,[.77,.72,.62]);
  for(let i=0;i<4;i++){
    const x=castleX-6+i*4;
    for(const p of [0,1])beam([x,-.5,castleZ+3+p*.9],[x,castleY,castleZ+3+p*.9],.17,[.62,.60,.50],6);
    beam([x,castleY,castleZ+3],[x+3.5,castleY,castleZ+3],.16,[.75,.69,.60],6);
  }
  // Cloud strata occupy distant spatial depth, with pink crests at golden hour.
  for(let j=0;j<8;j++){
    const cx=-28+j*9.5,cz=-71+hash(j+55)*5,cy=23+hash(j*11)*7;
    for(let k=0;k<3;k++)ellipsoid([cx+k*2.4,cy+.3*k,cz],3.5, .47+.15*k,1.15,
      k%2?[.85,.73,.68]:[.84,.78,.72],4,8);
  }
  // Layered stream: genuinely descending surfaces, cut banks and rock-backed falls.
  for(let i=0;i<132;i++){
    const x=-24+i*50/132,n=-24+(i+1)*50/132;
    const p=(xx,side,yOffset=0)=>[xx,waterLevel(xx)+yOffset,riverAt(xx)+side*(1.02+.24*Math.sin(xx*.41))];
    quad(p(x,-1),p(x,1),p(n,1),p(n,-1),tint(pal.water,i*.19,.018),2);
    if(i%2===0){const zz=riverAt(x)+.34*Math.sin(i*1.35),y=waterLevel(x)+.013;
      beam([x,y,zz],[x+.12,y+.005,zz+.11],.011,[.76,.81,.72],4,2);}
    if(i%9===0){for(const side of [-1,1])rock(x,ground(x,riverAt(x)+side*1.55),riverAt(x)+side*1.55,.28+hash(i*5)*.42,i*19);}
  }
  for(const [cx,fall] of [[-3.1,.25],[-8.7,.26]]){
    const zc=riverAt(cx),width=1.18;
    for(let i=0;i<25;i++){
      const z=zc-width+i*2*width/25,z1=zc-width+(i+1)*2*width/25;
      const hi=waterLevel(cx+.19),lo=waterLevel(cx-.21),col=i%3===0?[.83,.88,.81]:[.68,.81,.79];
      quad([cx,lo-.07,z],[cx,hi+.08,z],[cx,hi+.08,z1],[cx,lo-.07,z1],col,2);
      if(i%3===0)ellipsoid([cx-.20,lo,z],.26,.034,.14,[.87,.91,.84],3,6,2);
    }
  }
  // Flowering masonry bridge, built stone by stone around a genuine open arch.
  const BRIDGE_Z=-.88,bridgeX=pathAt(BRIDGE_Z);
  const bridgeStart=-4.30,bridgeEnd=2.65;
  for(let j=0;j<63;j++){
    const z=bridgeStart+(bridgeEnd-bridgeStart)*j/63,z1=bridgeStart+(bridgeEnd-bridgeStart)*(j+1)/63;
    const cy=pathHeight(z)-.16;
    const p=(zz,side,yoff=0)=>[pathAt(zz)+side*1.30,pathHeight(zz)+yoff,zz];
    quad(p(z,-1),p(z1,-1),p(z1,1),p(z,1),tint([.65,.59,.49],j*1.7,.07));
    for(const side of [-1,1]){
      const zmid=(z+z1)/2,x=pathAt(zmid)+side*1.35;
      if(j%3===0)box(x,cy-.38,zmid,.42,.72,.43,tint(pal.stone,j*1.1,.1));
    }
  }
  function archSegment(x0,zc,ybase,Rz,Ry,angle0,angle1,thick,col){
    const inner=a=>[zc+Rz*Math.cos(a),ybase+Ry*Math.sin(a)];
    const outer=a=>[zc+(Rz+thick)*Math.cos(a),ybase+(Ry+thick)*Math.sin(a)];
    const a=inner(angle0),b=inner(angle1),c=outer(angle1),d=outer(angle0),x1=x0+.44;
    const A=[x0,a[1],a[0]],B=[x0,b[1],b[0]],C=[x0,c[1],c[0]],D=[x0,d[1],d[0]];
    const E=[x1,a[1],a[0]],F=[x1,b[1],b[0]],G=[x1,c[1],c[0]],H=[x1,d[1],d[0]];
    quad(A,B,C,D,col);quad(H,G,F,E,col);
    quad(B,F,G,C,col);quad(D,C,G,H,col);quad(A,D,H,E,col);quad(E,F,B,A,col);
  }
  for(const side of [-1,1]){
    const x=bridgeX+side*1.25,ringX=x-.22;
    for(let j=0;j<19;j++){
      const a=j*Math.PI/19,b=(j+1)*Math.PI/19;
      archSegment(ringX,BRIDGE_Z,-.42,1.64,1.54,a,b,.42,tint([.59,.54,.46],j*2+side*31,.11));
    }
    for(const z of [BRIDGE_Z-2.12,BRIDGE_Z+2.12]){
      const cy=pathHeight(z);
      box(x,(cy-.40)/2,z,.58,Math.max(.80,cy+.35),.79,tint([.55,.52,.44],z*4+side,.07));
      for(let k=0;k<4;k++)box(x,cy+.24+k*.28,z,.65,.24,.76,tint(pal.stone,z*19+k,.07));
    }
    // Ornate stone parapet, pier caps and a planted vine rail.
    for(let k=0;k<24;k++){
      const z=bridgeStart+(bridgeEnd-bridgeStart)*(k+.5)/24;
      const x0=pathAt(z)+side*1.42, top=pathHeight(z);
      box(x0,top+.19,z,.33,.40,(bridgeEnd-bridgeStart)/25,tint([.68,.63,.54],k+side*9,.055));
      if(k%4===0){box(x0,top+.53,z,.52,.24,.36,[.79,.72,.59]);
        ellipsoid([x0,top+.69,z],.19,.15,.19,[.54,.61,.32],4,7,1);}
    }
  }
  // Actual irregular individually bedded flagstones, not a smooth tan ribbon.
  for(let j=0;j<160;j++){
    const z=-19+j*35/160,z1=-19+(j+1)*35/160;
    const xm=pathAt((z+z1)/2), onBridge=(z>bridgeStart&&z<bridgeEnd);
    const left=xm-(onBridge?1.20:1.09),right=xm+(onBridge?1.20:1.09);
    const y=(onBridge?pathHeight((z+z1)/2):pathHeight((z+z1)/2))+.035;
    if(!onBridge){quad([left,y-.05,z],[left,y-.05,z1],[right,y-.05,z1],[right,y-.05,z],[.33,.36,.25]);}
    const segments=3;
    for(let k=0;k<segments;k++){
      const x0=mix(left,right,k/segments),x1=mix(left,right,(k+1)/segments);
      const jitter=(hash(j*41+k*5)-.5)*.12;
      const h=y+.012*hash(j+k);
      const zlo=z+.021+hash(k+j*13)*.018,zhi=z1-.024-hash(k+j*19)*.012;
      quad([x0+.035,h,zlo+jitter*.17],[x0+.025,h,zhi+jitter*.16],
           [x1-.037,h,zhi+jitter*.17],[x1-.033,h,zlo+jitter*.13],tint(pal.stone,j*7+k*13,.105));
    }
  }
  // Crooked wooden fence follows both garden edges, rooted in actual terrain.
  for(const side of [-1,1]){
    for(let j=0;j<29;j++){
      const z=-17+j*1.08;
      if(z>=bridgeStart-1.7&&z<=bridgeEnd+1.0)continue;
      const xx=pathAt(z)+side*2.15,yy=ground(xx,z),height=1.45+(j%4)*.06;
      beam([xx,yy,z],[xx+.05,yy+height,z],.105,tint(pal.wood,j+side*8,.07),7);
      if(j%2===0)ellipsoid([xx+.04,yy+height,z],.115,.075,.115,[.57,.42,.26],4,6);
      const next=z+1.08;
      if(next>=bridgeStart-1.7&&z<=bridgeEnd+1.0)continue;
      const xn=pathAt(next)+side*2.15,yn=ground(xn,next);
      for(const offset of [.52,1.10])beam([xx,yy+offset,z],[xn,yn+offset,next],.072,tint([.55,.39,.25],j*7,.06),6);
    }
  }
  // Orchard canopies with real radial branches, separate leaves, fruit and trunks.
  function tree(x,z,s,seed,blossom=false){
    const y=ground(x,z),trunkTop=y+2.8*s;
    beam([x,y,z],[x-.12*s,trunkTop,z+.13*s],.19*s,tint([.36,.25,.17],seed,.055),9);
    for(let k=0;k<7;k++){
      const a=k*TAU/7+.12,rad=(.9+.35*hash(seed+k))*s;
      beam([x-.10*s,trunkTop-.8*s,z],[x+Math.cos(a)*rad,trunkTop+.35*s,z+Math.sin(a)*rad],.064*s,[.37,.27,.18],5);
    }
    for(let k=0;k<12;k++){
      const ang=k*TAU/12+.15*hash(k+seed),reach=(.42+.8*hash(seed+k*9))*s;
      const cx=x+Math.cos(ang)*reach,cy=trunkTop+(.14+.54*hash(k*11+seed))*s,cz=z+Math.sin(ang)*reach;
      const leaf=blossom?(k%3?[.65,.39,.44]:[.77,.57,.62]):tint([.30,.43,.21],k*7+seed,.07);
      ellipsoid([cx,cy,cz],.76*s,.66*s,.77*s,leaf,5,8,1);
    }
    if(!blossom)for(let k=0;k<22;k++){
      const a=k*TAU/22,r=(.55+hash(k*27+seed)*1.15)*s;
      ellipsoid([x+Math.cos(a)*r,trunkTop-.05*s+hash(k*3+seed)*.70*s,z+Math.sin(a)*r],.11*s,.12*s,.105*s,
        k%3===0?[.83,.28,.18]:[.81,.49,.14],4,5,1);
    }
  }
  const orchards=[[-10,9,1.7,13,false],[-16,7,1.20,20,false],[-9,0,1.08,25,true],[-12,-7,.88,42,false],[-17,-13,.85,76,false],[-2,-15,1.1,45,true],[9,-10,1.10,31,false],[12,-4,1.22,87,false],[15,-12,.9,88,true],[17,6,1.05,78,false],[-20,-3,1.2,64,true]];
  for(const args of orchards)tree(...args);
  // Top-left frame is a real arching tree branch suspended above the garden.
  beam([-11,ground(-11,12),12],[-10,7.7,12],.46,[.34,.22,.14],10);
  beam([-10,7.5,12],[-6,9.0,7],.27,[.32,.23,.16],9);
  beam([-8,8.3,9.6],[-3,9.5,5.7],.11,[.34,.24,.14],7);
  for(let i=0;i<32;i++){
    const t=hash(i*4.1),x=-11+hash(i*18.6)*9,z=6+hash(i*7.1)*7;
    ellipsoid([x,7.0+hash(i*9.3)*2,z],.55+.5*t,.31+.23*t,.65+.4*t,tint(pal.leaf,i*13,.085),4,7,1);
    if(i%4===0)ellipsoid([x,6.5+hash(i*3)*2,z],.16,.19,.16,[.75,.33,.16],4,6,1);
  }
  // Broad wheat hills behind the right fence, with thousands of stalks and heads.
  for(let i=0;i<2150;i++){
    const x=6+hash(i*3.17)*19,z=-15.8+hash(i*7.13+8)*20;
    if(Math.abs(z-riverAt(x))<1.5||Math.abs(x-pathAt(z))<2.6)continue;
    const y=ground(x,z),h=.42+hash(i*5.7)*.53;
    const tip=[x+.045,y+h,z+.035];
    triangle([x-.026,y,z],[x+.032,y,z],[...tip],tint(pal.wheat,i*13,.085),1);
    if(i%3===0){beam(tip,[x+.07,y+h+.18,z+.05],.024,[.84,.66,.26],4,1);}
  }
  // Dense near flowers, lavender and sunflower patches preserve warm foreground richness.
  for(let i=0;i<480;i++){
    const x=-21+hash(i*11.73)*44,z=-6+hash(i*23.91+6)*22;
    if(Math.abs(z-riverAt(x))<2.0 || Math.abs(x-pathAt(z))<1.55)continue;
    const y=ground(x,z),h=.20+hash(i*2.3)*.55;
    beam([x,y,z],[x+.027,y+h,z],.012,[.29,.46,.23],4,1);
    const floral=i%5===0?[.82,.38,.43]:i%5===1?[.84,.62,.35]:i%5===2?[.75,.58,.72]:i%5===3?[.90,.71,.48]:[.91,.47,.61];
    for(let k=0;k<5;k++){const a=k*TAU/5;
      ellipsoid([x+.027+Math.cos(a)*.10,y+h,z+Math.sin(a)*.10],.077,.035,.064,floral,3,5,1);}
    ellipsoid([x+.027,y+h+.017,z],.052,.045,.052,[.71,.46,.20],3,5,1);
  }
  // Riverbank flowers, moss-covered stones and berrying shrubs.
  for(let i=0;i<95;i++){
    const x=-23+hash(i*3.7)*48,side=i%2?1:-1;
    const z=riverAt(x)+side*(1.45+hash(i*11)*.65),y=ground(x,z);
    if(i%3===0)rock(x,y,z,.28+hash(i*7)*.70,i*73);
    else ellipsoid([x,y+.25,z],.35,.34,.32,tint([.30,.44,.23],i*8,.06),5,7,1);
  }
  // Harvest baskets, independent 3D apples and grapes near stone path foreground.
  for(const [x,z] of [[-4.5,12],[-6.2,13.8]]){
    const y=ground(x,z);
    for(let j=0;j<10;j++){const a=j*TAU/10;
      beam([x+Math.cos(a)*.69,y,z+Math.sin(a)*.69],[x+Math.cos(a)*.82,y+.75,z+Math.sin(a)*.82],.055,[.48,.34,.20],5);}
    for(const hh of [.15,.72])for(let k=0;k<24;k++){
      const a=k*TAU/24,b=(k+1)*TAU/24;
      beam([x+Math.cos(a)*(.70+hh*.15),y+hh,z+Math.sin(a)*(.70+hh*.15)],
           [x+Math.cos(b)*(.70+hh*.15),y+hh,z+Math.sin(b)*(.70+hh*.15)],.045,[.55,.38,.22],5);
    }
    for(let k=0;k<13;k++){
      const a=k*TAU/13,rad=.2+.39*hash(k*5),cy=y+.8+.15*hash(k*17);
      ellipsoid([x+Math.cos(a)*rad,cy,z+Math.sin(a)*rad],.20,.18,.19,k%2?[.80,.26,.15]:[.82,.57,.20],5,7);
    }
  }
  // Perched blue songbird on right fence and far aerial flock.
  const bz=5.1,bx=pathAt(bz)+2.15,by=ground(bx,bz)+1.61;
  ellipsoid([bx,by,bz],.28,.17,.17,[.22,.45,.71],6,9);
  ellipsoid([bx-.19,by+.13,bz+.01],.14,.13,.13,[.28,.54,.77],5,8);
  ellipsoid([bx+.07,by+.02,bz+.14],.17,.085,.045,[.14,.33,.55],4,7);
  triangle([bx-.29,by+.13,bz],[bx-.46,by+.08,bz-.04],[bx-.28,by+.075,bz-.12],[.94,.66,.30]);
  ellipsoid([bx-.24,by+.15,bz+.105],.018,.019,.019,[.06,.09,.12],3,5);
  for(let i=0;i<7;i++){
    const x=-13+i*2.45,y=11+hash(i*13)*3,z=-21+hash(i*9)*4;
    beam([x,y,z],[x-.46,y+.17,z-.04],.035,[.27,.32,.32],5,3);
    beam([x,y,z],[x+.46,y+.17,z+.04],.035,[.27,.32,.32],5,3);
  }
  // Real distant sky-dome triangles, not an image, sprite, backdrop texture or
  // screenshot plane. Depth means these never obscure nearer scene geometry.
  ellipsoid([0,-18,-12],145,115,145,[.77,.64,.65],15,30,4);
  ellipsoid([-53,33,-94],3.6,3.6,3.6,[1.0,.86,.57],9,14,5);
  return {positions:new Float32Array(positions),normals:new Float32Array(normals),colors:new Float32Array(colors),roles:new Float32Array(roles),triangleCount:positions.length/9};
}

function perspective(fov, aspect, near, far) {
  const f=1/Math.tan(fov/2),d=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*d,-1,0,0,2*far*near*d,0]);
}
function lookAt(eye,target){
  const z=unit(sub(eye,target)),x=unit(cross([0,1,0],z)),y=cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
}
function mul(a,b){
  const o=new Float32Array(16);
  for(let col=0;col<4;col++)for(let row=0;row<4;row++){
    let v=0;for(let k=0;k<4;k++)v+=a[k*4+row]*b[col*4+k];o[col*4+row]=v;
  }
  return o;
}
const vertexSource=[
"attribute vec3 a_position;",
"attribute vec3 a_normal;",
"attribute vec3 a_color;",
"attribute float a_role;",
"uniform mat4 u_viewProjection;",
"uniform vec3 u_eye;",
"uniform float u_time;",
"varying vec3 v_color;",
"varying vec3 v_normal;",
"varying vec3 v_world;",
"varying float v_fog;",
"varying float v_role;",
"void main(){",
"  vec3 p=a_position;",
"  if(a_role>.5 && a_role<1.5){p.x+=.048*sin(u_time*1.2+p.z*.8+p.y*2.)*max(0.,p.y+.2);}",
"  if(a_role>1.5 && a_role<2.5){p.y+=.024*sin(u_time*1.9+p.x*1.9+p.z*1.6);}",
"  if(a_role>2.5 && a_role<3.5){p.x+=.30*sin(u_time*.5+p.z*.7);p.y+=.10*sin(u_time*1.1+p.x);}",
"  gl_Position=u_viewProjection*vec4(p,1.0);",
"  v_world=p;v_normal=a_normal;v_color=a_color;v_role=a_role;",
"  v_fog=clamp((distance(p,u_eye)-19.)/110.,0.,.60);",
"}"
].join("\n");
const fragmentSource=[
"precision mediump float;",
"varying vec3 v_color;",
"varying vec3 v_normal;",
"varying vec3 v_world;",
"varying float v_fog;",
"varying float v_role;",
"void main(){",
"  if(v_role>4.5){gl_FragColor=vec4(1.,.87,.55,1.);return;}",
"  if(v_role>3.5){",
"    float t=clamp((v_world.y+18.)/120.,0.,1.);",
"    vec3 low=vec3(.96,.68,.52);vec3 high=vec3(.55,.59,.77);",
"    gl_FragColor=vec4(mix(low,high,smoothstep(0.,1.,t)),1.);return;",
"  }",
"  vec3 n=normalize(v_normal);vec3 sun=normalize(vec3(-.52,.75,.34));",
"  float diffuse=max(0.,dot(n,sun));",
"  float warmth=clamp(.52+.48*diffuse,0.,1.);",
"  vec3 base=v_color*(vec3(.64,.69,.73)+vec3(.62,.45,.24)*diffuse);",
"  float speckle=.955+.047*sin(v_world.x*7.1+v_world.z*13.7)*sin(v_world.y*6.8+v_world.x*11.3);",
"  base*=speckle;",
"  if(v_role>1.5 && v_role<2.5){base=mix(base,vec3(.53,.76,.75),.12+.09*diffuse);}",
"  vec3 mist=vec3(.69,.67,.65);",
"  vec3 surface=mix(base,mist,v_fog);",
"  gl_FragColor=vec4(clamp(surface,0.,1.),1.);",
"}"
].join("\n");

export function startHarvest(canvas, controls = {}) {
  if (!canvas || typeof canvas.getContext !== "function") throw new TypeError("HARVEST_CANVAS_REQUIRED");
  let device;
  try { device=createNativeWebGLDevice(canvas,{backend:"WEBGL2",contextAttributes:{alpha:true,depth:true,antialias:true}}); }
  catch(e) {
    if(!String(e.message).includes("WEBGL2_CONTEXT_UNAVAILABLE"))throw e;
    device=createNativeWebGLDevice(canvas,{backend:"WEBGL1",contextAttributes:{alpha:true,depth:true,antialias:true}});
  }
  const gl=device.gl;
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
  const geometry=buildWorld();
  const program=device.createProgram({vertexSource,fragmentSource});
  const mesh=device.createMesh({attributes:[
    {name:"a_position",size:3,data:geometry.positions},
    {name:"a_normal",size:3,data:geometry.normals},
    {name:"a_color",size:3,data:geometry.colors},
    {name:"a_role",size:1,data:geometry.roles}
  ],vertexCount:geometry.positions.length/3});
  // Uniform locations belong to a specific linked GPU program; E1 recreates
  // programs on context restoration, so never retain locations across handles.
  let uniformProgram=null,uniforms=null;
  function currentUniforms(handle){
    if(handle!==uniformProgram){
      uniformProgram=handle;
      uniforms={
        vp:gl.getUniformLocation(handle,"u_viewProjection"),
        eye:gl.getUniformLocation(handle,"u_eye"),
        time:gl.getUniformLocation(handle,"u_time")
      };
    }
    return uniforms;
  }
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state={yaw:.64,elevation:.27,distance:28.0,phase:0,paused:reduced,disposed:false,drag:null,pinch:null,raf:0,last:0};
  const activePointers=new Map();
  function draw(now=0) {
    state.raf=0;
    if(state.disposed||document.hidden||device.status().lost||gl.isContextLost?.())return;
    if(!state.paused&&!reduced&&state.last)state.phase+=Math.min(.06,Math.max(0,(now-state.last)/1000));
    state.last=now;
    const rect=canvas.getBoundingClientRect();
    const density=Math.min(window.devicePixelRatio||1,rect.width<700?1.45:1.8);
    const w=Math.max(1,Math.round(rect.width*density)),h=Math.max(1,Math.round(rect.height*density));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    device.viewport(w,h);
    gl.clearColor(.90,.66,.52,1); gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const eye=[Math.sin(state.yaw)*Math.cos(state.elevation)*state.distance,
      Math.sin(state.elevation)*state.distance,Math.cos(state.yaw)*Math.cos(state.elevation)*state.distance];
    const view=lookAt(eye,[0,1.65,-5.0]);
    const vp=mul(perspective(.76,w/h,.12,240),view);
    try {
      device.draw({program,mesh,beforeDraw(context,handle){
        const active=currentUniforms(handle);
        context.uniformMatrix4fv(active.vp,false,vp);
        context.uniform3fv(active.eye,new Float32Array(eye));
        context.uniform1f(active.time,state.phase);
      }});
    } catch(error) {
      // The GPU can become lost between the frame guard and the device draw.
      if(gl.isContextLost?.()||device.status().lost)return;
      throw error;
    }
    if(!state.paused&&!reduced)schedule();
  }
  function schedule(){if(!state.disposed&&!state.raf&&!document.hidden)state.raf=requestAnimationFrame(draw);}
  function reset(){state.yaw=.64;state.elevation=.27;state.distance=28.0;state.last=0;schedule();}
  function onDown(e){
    if(e.button!==0&&e.pointerType!=="touch")return;
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    canvas.setPointerCapture?.(e.pointerId);
    state.drag=null;
    if(activePointers.size===1)state.drag={id:e.pointerId,x:e.clientX,y:e.clientY};
    if(activePointers.size===2){
      const [a,b]=[...activePointers.values()];
      state.pinch={gap:Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)),distance:state.distance};
    }
  }
  function onMove(e){
    if(!activePointers.has(e.pointerId))return;
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activePointers.size===2){
      const [a,b]=[...activePointers.values()];
      const gap=Math.hypot(b.x-a.x,b.y-a.y);
      if(state.pinch&&gap>1){
        state.distance=clamp(state.pinch.distance*state.pinch.gap/gap,13,58);
        schedule();
      }
      return;
    }
    if(!state.drag||state.drag.id!==e.pointerId)return;
    const dx=e.clientX-state.drag.x,dy=e.clientY-state.drag.y;
    state.yaw+=dx*.006;state.elevation=clamp(state.elevation+dy*.004,.18,1.05);
    state.drag={id:e.pointerId,x:e.clientX,y:e.clientY};schedule();
  }
  function onUp(e){
    activePointers.delete(e.pointerId);
    state.drag=null;state.pinch=null;
    if(activePointers.size===1){
      const [id,point]=activePointers.entries().next().value;
      state.drag={id,x:point.x,y:point.y};
    }
  }
  function onWheel(e){e.preventDefault();state.distance=clamp(state.distance*Math.exp(e.deltaY*.0008),13,58);schedule();}
  function onKey(e){
    const key=e.key;
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-"].includes(key))e.preventDefault();
    if(key==="ArrowLeft")state.yaw-=.11;
    if(key==="ArrowRight")state.yaw+=.11;
    if(key==="ArrowUp")state.elevation=clamp(state.elevation-.08,.18,1.05);
    if(key==="ArrowDown")state.elevation=clamp(state.elevation+.08,.18,1.05);
    if(key==="+")state.distance=clamp(state.distance-1.2,13,58);
    if(key==="-")state.distance=clamp(state.distance+1.2,13,58);
    schedule();
  }
  const motion=controls.motion,resetButton=controls.reset,status=controls.status;
  function label(){
    if(motion){motion.textContent=reduced?"Reduced motion":state.paused?"Resume world motion":"Pause world motion";
      motion.disabled=reduced;motion.setAttribute("aria-pressed",String(state.paused));}
  }
  function onMotion(){state.paused=!state.paused;state.last=0;label();schedule();}
  function onVisibility(){state.last=0;schedule();}
  function onRestore(){
    // WebGL context restoration resets fixed-function GL state, even when E1
    // correctly rebuilds programs and buffers. Restore scene depth semantics.
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
    state.last=0;schedule();
  }
  function onResize(){schedule();}
  canvas.addEventListener("pointerdown",onDown);
  canvas.addEventListener("pointermove",onMove);
  canvas.addEventListener("pointerup",onUp);
  canvas.addEventListener("pointercancel",onUp);
  canvas.addEventListener("wheel",onWheel,{passive:false});
  canvas.addEventListener("keydown",onKey);
  canvas.addEventListener("webglcontextrestored",onRestore);
  document.addEventListener("visibilitychange",onVisibility);
  window.addEventListener("resize",onResize);
  motion?.addEventListener("click",onMotion);
  resetButton?.addEventListener("click",reset);
  if(status)status.textContent=device.backend+" native scene · "+geometry.triangleCount.toLocaleString()+" triangles · rabbit pending protected-source gate";
  label();schedule();
  return Object.freeze({
    backend:device.backend,triangleCount:geometry.triangleCount,reset,
    dispose(){
      if(state.disposed)return;
      state.disposed=true;if(state.raf)cancelAnimationFrame(state.raf);
      canvas.removeEventListener("pointerdown",onDown);canvas.removeEventListener("pointermove",onMove);
      canvas.removeEventListener("pointerup",onUp);canvas.removeEventListener("pointercancel",onUp);
      canvas.removeEventListener("wheel",onWheel);canvas.removeEventListener("keydown",onKey);
      canvas.removeEventListener("webglcontextrestored",onRestore);
      document.removeEventListener("visibilitychange",onVisibility);
      window.removeEventListener("resize",onResize);
      motion?.removeEventListener("click",onMotion);resetButton?.removeEventListener("click",reset);
      device.dispose();
    }
  });
}
if(typeof document!=="undefined") {
  const canvas=document.getElementById("harvest-scene");
  if(canvas) {
    try {
      startHarvest(canvas,{
        motion:document.getElementById("motion-toggle"),
        reset:document.getElementById("view-reset"),
        status:document.getElementById("scene-status")
      });
    } catch(e) {
      const status=document.getElementById("scene-status");
      if(status)status.textContent="Native scene unavailable: "+e.message;
      console.error("HARVEST_NATIVE_SCENE_BLOCKED",e);
    }
  }
}
