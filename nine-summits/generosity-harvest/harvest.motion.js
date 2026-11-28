import {createArticulated284} from './articulated284-adapter.refined.private.mjs';
/**
 * Generosity Harvest / Gen3442: HELD V2 composition-first geometry reconciliation.
 * E1 owns the only WebGL context; E2 submits; E3 owns scene/camera; E4 owns materials.
 * No original illustration, rabbit atlas, rabbit geometry or private evidence is embedded.
 * This scene is a procedural spatial construction for evaluation, NOT an accepted
 * replacement for the 1672x941 original pastoral artwork. Artistic C1 remains HOLD.
 */
import {createNativeWebGLDevice} from '../../assets/engine/dgb.native-webgl-device.v1.mjs';
import {createNativeFramePipeline} from '../../assets/engine/dgb.native-frame-pipeline.v1.mjs';
import {createNativeSpatialScene} from '../../assets/engine/dgb.native-scene-spatial.v1.mjs';
import {createNativeMaterialLibrary} from '../../assets/engine/dgb.native-material-light.v1.mjs';

const ID = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
const PALETTE = Object.freeze({
  grass:[.27,.46,.24,1], grassLight:[.37,.56,.32,1], grassDeep:[.17,.34,.24,1],
  bank:[.54,.60,.31,1], path:[.64,.49,.33,1], pathLight:[.80,.65,.43,1],
  water:[.22,.54,.57,1], waterLight:[.44,.73,.70,1],
  bridge:[.49,.31,.20,1], bridgeLight:[.76,.53,.31,1],
  bark:[.35,.23,.16,1], leaves:[.21,.42,.26,1], leavesLight:[.40,.56,.28,1],
  blossom:[.91,.63,.72,1], blossomLight:[.99,.85,.81,1],
  flowerWhite:[.96,.92,.76,1], flowerGold:[.98,.72,.31,1],
  fruit:[.77,.26,.19,1], fruitGold:[.94,.61,.22,1],
  stone:[.48,.52,.44,1], hill:[.26,.41,.36,1],
  wings:[.88,.80,.63,1]
});
const finite = n=>typeof n==='number'&&Number.isFinite(n);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function seeded(seed=7163){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function vector(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function unit(v){const l=Math.hypot(...v)||1;return v.map(x=>x/l);}
function geometryBuilder(){
  const batches=new Map();
  function batch(name){if(!PALETTE[name])throw Error('UNKNOWN_HARVEST_MATERIAL');if(!batches.has(name))batches.set(name,{p:[],n:[],uv:[],i:[]});return batches.get(name);}
  function tri(name,a,b,c){
    const data=batch(name),normal=unit(cross(vector(b,a),vector(c,a))),start=data.p.length/3;
    for(const v of [a,b,c]){data.p.push(...v);data.n.push(...normal);data.uv.push(0,0);}
    data.i.push(start,start+1,start+2);
  }
  function quad(name,a,b,c,d){
    const n=cross(vector(b,a),vector(c,a));
    if(['grass','grassLight','water','waterLight','path','pathLight','bank'].includes(name)&&n[1]<0){tri(name,a,d,c);tri(name,a,c,b);}
    else {tri(name,a,b,c);tri(name,a,c,d);}
  }
  function box(name,c,s){
    const [x,y,z]=c,[w,h,d]=s,lo=[x-w/2,y-h/2,z-d/2],hi=[x+w/2,y+h/2,z+d/2];
    const p=(X,Y,Z)=>[X?hi[0]:lo[0],Y?hi[1]:lo[1],Z?hi[2]:lo[2]];
    quad(name,p(0,0,1),p(1,0,1),p(1,1,1),p(0,1,1));
    quad(name,p(1,0,0),p(0,0,0),p(0,1,0),p(1,1,0));
    quad(name,p(0,0,0),p(0,0,1),p(0,1,1),p(0,1,0));
    quad(name,p(1,0,1),p(1,0,0),p(1,1,0),p(1,1,1));
    quad(name,p(0,1,1),p(1,1,1),p(1,1,0),p(0,1,0));
    quad(name,p(0,0,0),p(1,0,0),p(1,0,1),p(0,0,1));
  }
  function ellipsoid(name,c,r,lat=6,lon=9){
    for(let j=0;j<lat;j++){
      const t0=-Math.PI/2+j*Math.PI/lat,t1=-Math.PI/2+(j+1)*Math.PI/lat;
      for(let k=0;k<lon;k++){
        const p0=k*2*Math.PI/lon,p1=(k+1)*2*Math.PI/lon;
        const at=(t,p)=>[c[0]+r[0]*Math.cos(t)*Math.cos(p),c[1]+r[1]*Math.sin(t),c[2]+r[2]*Math.cos(t)*Math.sin(p)];
        quad(name,at(t0,p0),at(t1,p0),at(t1,p1),at(t0,p1));
      }
    }
  }
  function rod(name,a,b,r0,r1=r0,sides=7){
    const dir=unit(vector(b,a));let across=unit(cross(dir,[0,0,1]));
    if(Math.hypot(...across)<.01)across=[1,0,0];
    const other=unit(cross(dir,across));
    const ring=(c,r,t)=>[c[0]+r*(Math.cos(t)*across[0]+Math.sin(t)*other[0]),c[1]+r*(Math.cos(t)*across[1]+Math.sin(t)*other[1]),c[2]+r*(Math.cos(t)*across[2]+Math.sin(t)*other[2])];
    for(let i=0;i<sides;i++){const t=i*2*Math.PI/sides,u=(i+1)*2*Math.PI/sides;
      quad(name,ring(a,r0,t),ring(a,r0,u),ring(b,r1,u),ring(b,r1,t));
    }
  }
  return {batches,tri,quad,box,ellipsoid,rod};
}
const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const length3 = (v) => Math.hypot(v[0], v[1], v[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
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
    // Low-frequency terrain color continuity: avoid per-cell randomized checkerboards.
    // Keep the exact sculpted mesh, positions, normals and E1-E4 material ownership.
    const meadowWave=.60*Math.sin(x*.31+z*.13)+.40*Math.sin(x*.47-z*.16);
    const col=[.34+.07*meadowWave,.46+.06*meadowWave,.25+.04*meadowWave];
    quad([x,ground(x,z),z],[x,ground(x,z+dz),z+dz],[x+dx,ground(x+dx,z+dz),z+dz],[x+dx,ground(x+dx,z),z],col,1);
  }
  // The valley continues behind the near-field terrace, with no transparent
  // void between terrain and mountains. These are real undulating hill cells.
  for(let j=0;j<40;j++)for(let i=0;i<65;i++){
    const z=-83+j*62/40,x=-71+i*142/65,dx=142/65,dz=62/40;
    const h=(xx,zz)=>{const t=clamp((-zz-21)/62,0,1);return (1-t)*ground(xx,-21)+t*(2.1+.65*Math.sin(xx*.16+zz*.13)*Math.cos(zz*.09));};
    // The far valley is continuous rather than recurring one-row color stripes.
    const valleyWave=.60*Math.sin(x*.09+z*.10)+.40*Math.cos(x*.13-z*.07);
    const c=[.35+.04*valleyWave,.47+.035*valleyWave,.29+.025*valleyWave];
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
  ellipsoid([0,-18,-12],145,115,145,[.64,.74,.84],15,30,4);
  ellipsoid([-53,33,-94],3.6,3.6,3.6,[1.0,.86,.57],9,14,5);
  return {positions:new Float32Array(positions),normals:new Float32Array(normals),colors:new Float32Array(colors),roles:new Float32Array(roles),triangleCount:positions.length/9};
}
/**
 * Gen3426 V2 public world geometry -> Gen3442 first-party material batches.
 * Reuse already-authored scene topology; retain separate private A4 injection.
 * Only per-triangle RGB is discretized to 0.1 material levels. No image planes.
 */
function buildPastoral(){
  const world=buildWorld(), batches=new Map();
  for(let i=0;i<world.positions.length;i+=9){
    const role=world.roles[i/3],rgb=[world.colors[i],world.colors[i+1],world.colors[i+2]];
    const bins=rgb.map(v=>Math.round(clamp(v,0,1)*10));
    const key='v2_'+role+'_'+bins.join('_');
    let b=batches.get(key);
    if(!b){b={p:[],n:[],i:[],color:bins.map(x=>x/10).concat(1),role};batches.set(key,b);}
    const start=b.p.length/3;
    for(let j=0;j<9;j++){b.p.push(world.positions[i+j]);b.n.push(world.normals[i+j]);}
    b.i.push(start,start+1,start+2);
  }
  return batches;
}

function typed(v,Type,label,max=4000000){
  if(!(v instanceof Type)||v.length===0||v.length>max)throw new TypeError(label+'_INVALID');
  if(Type===Float32Array)for(const n of v)if(!finite(n))throw new TypeError(label+'_NONFINITE');
  return v;
}
function bounds(positions){
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<positions.length;i+=3)for(let k=0;k<3;k++){
    lo[k]=Math.min(lo[k],positions[i+k]);hi[k]=Math.max(hi[k],positions[i+k]);
  }
  const center=lo.map((v,i)=>(v+hi[i])/2);
  let radius=0;
  for(let i=0;i<positions.length;i+=3)radius=Math.max(radius,Math.hypot(positions[i]-center[0],positions[i+1]-center[1],positions[i+2]-center[2]));
  return {center,radius:radius+.01,lo,hi};
}
function createPrivateRabbit(device,library,scene,data){
  if(!data||data.schema!=='PRIVATE_A4_M13_17_FRAME_BINDING_V1')throw Error('PRIVATE_RABBIT_CONTRACT_REQUIRED');
  if(!Array.isArray(data.frames)||data.frames.length!==17||!Array.isArray(data.normalFrames)||data.normalFrames.length!==17)
    throw Error('PRIVATE_A4_EXACT_17_FRAMES_REQUIRED');
  const p=typed(data.frames[0],Float32Array,'A4_POSITIONS'),n=typed(data.normalFrames[0],Float32Array,'A4_NORMALS');
  const vertexCount=p.length/3;
  if(!Number.isInteger(vertexCount)||vertexCount<3||n.length!==p.length)throw Error('PRIVATE_A4_TOPOLOGY_INVALID');
  const uv=typed(data.uvs,Float32Array,'A4_UV'),indices=typed(data.indices,Uint16Array,'A4_INDICES');
  if(uv.length!==vertexCount*2||indices.length%3)throw Error('PRIVATE_A4_ATTRIBUTE_COUNTS_INVALID');
  if([...indices].some(v=>v>=vertexCount))throw Error('PRIVATE_A4_INDEX_OUT_OF_RANGE');
  for(let i=0;i<17;i++){
    if(typed(data.frames[i],Float32Array,'A4_FRAME').length!==p.length||
      typed(data.normalFrames[i],Float32Array,'A4_NORMAL_FRAME').length!==n.length)throw Error('PRIVATE_A4_FRAME_TOPOLOGY_DRIFT');
  }
  const atlas=data.coatAtlas;
  if(!atlas||!Number.isSafeInteger(atlas.width)||!Number.isSafeInteger(atlas.height)||atlas.width<1||atlas.height<1)
    throw Error('PRIVATE_A4_COAT_REQUIRED');
  typed(atlas.pixels,Uint8Array,'A4_COAT_RGBA8',16000000);
  if(atlas.pixels.length!==atlas.width*atlas.height*4)throw Error('PRIVATE_A4_COAT_BYTES_INVALID');
  // Memory-only injection: no private URL, fetch, file upload, logging or persistence.
  const texture=library.createTexture2D({width:atlas.width,height:atlas.height,pixels:atlas.pixels,filter:'LINEAR'});
  const material=library.createMaterial({kind:'TEXTURED',texture,baseColor:[1,1,1,1]});
  const mesh=device.createMesh({vertexCount,indices,attributes:[
    {name:'aPosition',size:3,data:p,dynamic:true},
    {name:'aNormal',size:3,data:n,dynamic:true},
    {name:'aUV',size:2,data:uv}
  ]});
  const range=bounds(p),height=range.hi[1]-range.lo[1];
  if(height<.01||height>1000)throw Error('PRIVATE_A4_HEIGHT_INVALID');
  const s=2.15/height,footX=pathAt(7.6)+2.9,footZ=7.6,footY=ground(footX,footZ);
  const node=scene.createNode({position:[footX-range.center[0]*s,footY-range.lo[1]*s,footZ-range.center[2]*s],scale:[s,s,s]});
  const initial=library.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID});
  scene.setRenderable(node,{mesh,program:initial.program,bounds:{center:range.center,radius:range.radius},cull:'NONE'});
  function frame(i){const k=clamp(Math.round(i),0,16);device.updateMeshAttribute(mesh,'aPosition',data.frames[k]);device.updateMeshAttribute(mesh,'aNormal',data.normalFrames[k]);}
  return {material,mesh,node,frame,descriptor:'PRIVATE_IN_MEMORY_A4_ONLY_UNVERIFIED_ART'};
}
// OWNER-PRIVATE V4b POST-SOURCE EXPERIMENT ONLY. Original 17-frame adapter is unchanged.
// Exact 49-frame M1.3 body, coat and historical v2-eye-derived bilateral review
// data are supplied in RAM and never inserted into the public repository.
function privateV4EyeShaders(backend){
  const two=backend==='WEBGL2',head=two?'#version 300 es\n':'',a=two?'in':'attribute',vary=two?'out':'varying',inside=two?'in':'varying',out=two?'out vec4 outColor;':'',write=two?'outColor':'gl_FragColor';
  return {vertexSource:head+a+' vec3 aPosition;'+a+' vec3 aNormal;'+a+' vec3 aColor;'+a+' float aFade;uniform mat4 uMVP;'+vary+' vec3 vNormal;'+vary+' vec3 vColor;'+vary+' float vFade;void main(){vNormal=aNormal;vColor=aColor;vFade=aFade;gl_Position=uMVP*vec4(aPosition,1.0);}',
    fragmentSource:head+'precision mediump float;'+inside+' vec3 vNormal;'+inside+' vec3 vColor;'+inside+' float vFade;'+out+'void main(){vec3 N=normalize(vNormal);vec3 L=normalize(vec3(-.35,.9,.65));float diff=.65+.35*max(dot(N,L),0.0);float spec=pow(max(dot(reflect(-L,N),vec3(0,0,1)),0.0),22.0);'+write+'=vec4(vColor*diff+vec3(spec*vFade),1.0);}'};
}
function createPrivateM1349(device,library,scene,data,directEyes){
  const schema='PRIVATE_A4_M13_V9_180_FRAME_C1_SINGLE_REPAIR';
  if(!data||data.schema!==schema)throw Error('PRIVATE_M13_V5_SCHEMA_REQUIRED');
  const N=180,V=1409,E=7584,each=V*3,eacheye=E*3;
  const assertTyped=(x,T,count,tag)=>{
    if(!(x instanceof T)||x.length!==count)throw Error('PRIVATE_M13_V5_'+tag+'_INVALID');
    if(T===Float32Array && Array.from(x).some(v=>!Number.isFinite(v)))throw Error('PRIVATE_M13_V5_'+tag+'_NONFINITE');
  };
  for(const [name,count] of [['bodyPositions',N*each],['bodyNormals',N*each],['eyePositions',N*eacheye],['eyeNormals',N*eacheye],['eyeColors',eacheye],['eyeFade',E],['uvs',V*2]])
    assertTyped(data[name],Float32Array,count,name);
  assertTyped(data.indices,Uint16Array,2264*3,'indices');
  if(Array.from(data.indices).some(x=>x>=V))throw Error('PRIVATE_M13_V5_INDEX_RANGE');
  assertTyped(data.atlas,Uint8Array,256*256*4,'atlas');
  const coat=library.createTexture2D({width:256,height:256,pixels:data.atlas,filter:'LINEAR'});
  const material=library.createMaterial({kind:'TEXTURED',texture:coat,baseColor:[1,1,1,1]});
  assertTyped(data.stanceTransforms,Float32Array,N*7,'stanceTransforms');

  const SHADOW_V=243, SHADOW_IDX=420*3;
  assertTyped(data.shadowPositions,Float32Array,N*SHADOW_V*3,'shadowPositions');
  assertTyped(data.shadowOpacity,Float32Array,N*SHADOW_V,'shadowOpacity');
  assertTyped(data.shadowIndices,Uint16Array,SHADOW_IDX,'shadowIndices');
  if(Array.from(data.shadowIndices).some(v=>v>=SHADOW_V))throw Error('PRIVATE_M13_V6_SHADOW_INDEX_OUT_OF_RANGE');
  if(Array.from(data.shadowOpacity).some(v=>v<0||v>.220001))throw Error('PRIVATE_M13_V6_SHADOW_OPACITY_RANGE');
  const p=data.bodyPositions.subarray(0,each),n=data.bodyNormals.subarray(0,each);
  const bodyMesh=device.createMesh({vertexCount:V,indices:data.indices,attributes:[
    {name:'aPosition',size:3,data:p,dynamic:true},
    {name:'aNormal',size:3,data:n,dynamic:true},
    {name:'aUV',size:2,data:data.uvs}
  ]});
  const range=bounds(p),height=range.hi[1]-range.lo[1];
  if(height<.05||height>3)throw Error('PRIVATE_M13_V5_BODY_EXTENT_INVALID');
  const scale=2.15/height,footX=pathAt(7.6)+5.2,footZ=7.6,footY=ground(footX,footZ);
  // Camera-aligned *fixed* world orientation: local return -X projects
  // screen-left at unchanged Gen3442 camera yaw .54. The rabbit's authored
  // dynamic body yaw and source-to-source forward-to-left trajectory are retained.
  const yaw=.54,rotation=[0,Math.sin(yaw/2),0,Math.cos(yaw/2)];
  const node=scene.createNode({position:[footX-range.center[0]*scale,footY-range.lo[1]*scale,footZ-range.center[2]*scale],rotation,scale:[scale,scale,scale]});
  const initial=library.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID,cameraPosition:[16.1,7.5,22.3]});
  scene.setRenderable(node,{mesh:bodyMesh,program:initial.program,pass:'OPAQUE',cull:'NONE',bounds:{center:range.center,radius:range.radius+3}});
  const eyeP=data.eyePositions.subarray(0,eacheye),eyeN=data.eyeNormals.subarray(0,eacheye),eyeProgram=device.createProgram(privateV4EyeShaders(device.backend));
  const eyeMesh=device.createMesh({vertexCount:E,attributes:[
    {name:'aPosition',size:3,data:eyeP,dynamic:true},
    {name:'aNormal',size:3,data:eyeN,dynamic:true},
    {name:'aColor',size:3,data:data.eyeColors},
    {name:'aFade',size:1,data:data.eyeFade}
  ]});
  const eyeNode=scene.createNode({parent:node});
  scene.setRenderable(eyeNode,{mesh:eyeMesh,program:eyeProgram,pass:'OPAQUE',cull:'NONE',bounds:{center:range.center,radius:range.radius+3}});
  directEyes.set(eyeMesh,eyeProgram);

  const shadowProgram=device.createProgram(privateV6PawShadowShaders(device.backend));
  const shadowMesh=device.createMesh({vertexCount:SHADOW_V,indices:data.shadowIndices,attributes:[
    {name:'aPosition',size:3,data:data.shadowPositions.subarray(0,SHADOW_V*3),dynamic:true},
    {name:'aOpacity',size:1,data:data.shadowOpacity.subarray(0,SHADOW_V),dynamic:true}
  ]});
  const shadowNode=scene.createNode();
  // This node is NOT parented to the rabbit: each world-space contact contour
  // explicitly follows the exact same triangulated terrain as the held scene.
  scene.setRenderable(shadowNode,{mesh:shadowMesh,program:shadowProgram,pass:'TRANSPARENT',cull:'NONE',bounds:{center:[7.8,0,7.4],radius:7}});
  directEyes.set(shadowMesh,shadowProgram);

  function frame(i){
    if(!Number.isInteger(i)||i<0||i>=N)throw Error('PRIVATE_M13_V5_FRAME_RANGE');
    const bp=data.bodyPositions.subarray(i*each,(i+1)*each),bn=data.bodyNormals.subarray(i*each,(i+1)*each),
      ep=data.eyePositions.subarray(i*eacheye,(i+1)*eacheye),en=data.eyeNormals.subarray(i*eacheye,(i+1)*eacheye);
    device.updateMeshAttribute(bodyMesh,'aPosition',bp);
    device.updateMeshAttribute(bodyMesh,'aNormal',bn);
    device.updateMeshAttribute(eyeMesh,'aPosition',ep);
    device.updateMeshAttribute(eyeMesh,'aNormal',en);

    device.updateMeshAttribute(shadowMesh,'aPosition',data.shadowPositions.subarray(i*SHADOW_V*3,(i+1)*SHADOW_V*3));
    device.updateMeshAttribute(shadowMesh,'aOpacity',data.shadowOpacity.subarray(i*SHADOW_V,(i+1)*SHADOW_V));

    // Original E3 native scene and all authored source/body/eye vertices are
    // unchanged. A separately computed terrain support-plane transform moves
    // the entire articulated assembly rigidly, including the parented eyes.
    const st=data.stanceTransforms.subarray(i*7,i*7+7);
    scene.setTransform(node,{position:[st[0],st[1],st[2]],rotation:[st[3],st[4],st[5],st[6]]});
  }
  frame(0);
  return {mesh:bodyMesh,material,node,eyeNode,eyeMesh,shadowNode,shadowMesh,frame,frameCount:N,
    scale,worldAnchor:[footX,footY,footZ],orientationYaw:yaw,
    eyeSource:'exact historical eye-only V2 + mirror-derived second candidate',artisticStatus:'HOLD'};
}


// V9 owner-private C1 one-repair trial only. Artistic/heuristic contact cue; NOT a real shadow map or pressure measurement.
function privateV6PawShadowShaders(backend){
 const two=backend==='WEBGL2',head=two?'#version 300 es\n':'',a=two?'in':'attribute',vary=two?'out':'varying',inside=two?'in':'varying',out=two?'out vec4 outColor;':'',write=two?'outColor':'gl_FragColor';
 return {vertexSource:head+a+' vec3 aPosition;'+a+' float aOpacity;uniform mat4 uMVP;'+vary+' float vOpacity;void main(){vOpacity=aOpacity;gl_Position=uMVP*vec4(aPosition,1.0);}',
 fragmentSource:head+'precision mediump float;'+inside+' float vOpacity;'+out+'void main(){'+write+'=vec4(.13,.115,.085,clamp(vOpacity,0.0,.22));}'};
}
export function createHarvestScene(canvas,{backend='AUTO',reducedMotion=false,onStatus=()=>{},illustrationMode=false}={}){
  if(!canvas||typeof canvas.getContext!=='function'||!['AUTO','WEBGL1','WEBGL2'].includes(backend)||typeof onStatus!=='function')
    throw new TypeError('HARVEST_OPTIONS_INVALID');
  let device;
  if(backend==='AUTO'){try{device=createNativeWebGLDevice(canvas,{backend:'WEBGL2'});}catch{device=createNativeWebGLDevice(canvas,{backend:'WEBGL1'});}}
  else device=createNativeWebGLDevice(canvas,{backend});
  const pipeline=createNativeFramePipeline(device),scene=createNativeSpatialScene(),library=createNativeMaterialLibrary(device);
  const cameraPosition=[14.8,5.9,19.1];
  const yaw=.54,pitch=-.12;
  const cameraRotation=[Math.sin(pitch/2)*Math.cos(yaw/2),Math.cos(pitch/2)*Math.sin(yaw/2),-Math.sin(pitch/2)*Math.sin(yaw/2),Math.cos(pitch/2)*Math.cos(yaw/2)];
  const camera=scene.createCamera({position:cameraPosition,rotation:cameraRotation,fovY:.73,near:.1,far:260,aspect:16/9});
  const materials=new Map(),renderMaterials=new Map(),privateV4DirectEyes=new Map();
  const batches=illustrationMode?new Map():buildPastoral();
  for(const [key,b] of batches){
    if(!b.i.length)continue;
    if(b.p.length/3>65535)throw Error('HARVEST_BATCH_WEBGL1_VERTEX_BUDGET_EXCEEDED_'+key);
    const mesh=device.createMesh({vertexCount:b.p.length/3,indices:new Uint16Array(b.i),attributes:[
      {name:'aPosition',size:3,data:new Float32Array(b.p)},
      {name:'aNormal',size:3,data:new Float32Array(b.n)}
    ]});
    const isWater=b.role===2,isSky=b.role>=4;
    const material=library.createMaterial({kind:isSky?'UNLIT':isWater?'LIT_SPECULAR':'LIT',
      baseColor:b.color,light:isSky?null:{
      direction:[-.45,.88,.45],ambient:isWater?.42:.60,intensity:.60,color:[1,.94,.82],
      ...(isWater?{skyColor:[.67,.79,.83],groundColor:[.23,.34,.22],fillIntensity:.45,specularStrength:.58,shininess:64}:{})
    }});
    const initial=library.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID,cameraPosition});
    const node=scene.createNode(),range=bounds(b.p);
    scene.setRenderable(node,{mesh,program:initial.program,bounds:{center:range.center,radius:range.radius},cull:'NONE'});
    materials.set(node,material);
    renderMaterials.set(mesh,material);
  }
  // Separate first-party native bird meshes; reversible motion never writes world source.
  const birds=[];
  for(let k=0;k<(illustrationMode?0:3);k++){
    const g=geometryBuilder(),size=.25+k*.06;
    g.tri('wings',[0,0,0],[-size,.09,-.11],[-size*1.75,.02,.14]);
    g.tri('wings',[0,0,0],[size,.09,-.11],[size*1.75,.02,.14]);
    const b=g.batches.get('wings');
    const mesh=device.createMesh({vertexCount:b.p.length/3,indices:new Uint16Array(b.i),attributes:[
      {name:'aPosition',size:3,data:new Float32Array(b.p)},
      {name:'aNormal',size:3,data:new Float32Array(b.n)}
    ]});
    const material=library.createMaterial({kind:'UNLIT',baseColor:PALETTE.wings});
    const initial=library.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID,cameraPosition});
    const node=scene.createNode({position:[-4.5+k*1.05,4.0+k*.32,-14.0-k*.5]});
    scene.setRenderable(node,{mesh,program:initial.program,bounds:{center:[0,0,0],radius:1},cull:'NONE'});
    materials.set(node,material);renderMaterials.set(mesh,material);birds.push(node);
  }
  let rabbit=null,disposed=false,playing=!reducedMotion,raf=0,last=0,time=0,frameNo=0,renderCount=0;
  function report(){onStatus({backend:device.backend,frames:renderCount,playing,privateRabbitAttached:Boolean(rabbit),artisticAcceptance:'HOLD'});}
  function resize(width,height,scale=1){
    if(disposed)throw Error('HARVEST_DISPOSED');
    if(!finite(width)||!finite(height)||width<1||height<1)throw Error('HARVEST_SIZE_INVALID');
    const w=Math.min(1920,Math.max(1,Math.round(width*clamp(scale,1,2))));
    const h=Math.min(1080,Math.max(1,Math.round(height*clamp(scale,1,2))));
    if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
    device.viewport(w,h);scene.setCamera(camera,{aspect:w/h});
    render();
  }
  function render(){
    if(disposed)return;
    const view=scene.collect(camera);
    pipeline.beginFrame({clear:{color:illustrationMode?[0,0,0,0]:[.65,.75,.84,1],depth:1},depthMode:'TEST_WRITE',cull:'NONE'});
    for(const cmd of view.commands){
      const direct=privateV4DirectEyes.get(cmd.mesh);
      if(direct){
        pipeline.submit({mesh:cmd.mesh,program:direct.program??direct,first:cmd.first,count:cmd.count,pass:cmd.pass,cull:cmd.cull,depthKey:cmd.depthKey,
          beforeDraw:(context,handle)=>{const loc=context.getUniformLocation(handle,'uMVP');if(loc===null)throw Error('PRIVATE_V4_EYE_MVP_UNIFORM_MISSING');context.uniformMatrix4fv(loc,false,cmd.modelViewProjection);direct.beforeDraw?.(context,handle);},afterDraw:direct.afterDraw});
        continue;
      }
      const material=renderMaterials.get(cmd.mesh);
      if(!material)throw Error('HARVEST_MATERIAL_BINDING_MISSING');
      const draw=library.makeDrawBinding(material,{modelMatrix:cmd.modelMatrix,modelViewProjection:cmd.modelViewProjection,cameraPosition});
      pipeline.submit({mesh:cmd.mesh,program:draw.program,first:cmd.first,count:cmd.count,pass:cmd.pass,cull:cmd.cull,
        beforeDraw:draw.beforeDraw,afterDraw:draw.afterDraw});
    }
    pipeline.endFrame();renderCount++;
  }
  function tick(now){
    if(disposed||!playing)return;
    const dt=last?Math.min(80,now-last):0;last=now;time+=dt;
    const loopPhase=(time%7500)*TAU/7500;
    for(let k=0;k<birds.length;k++){
      const v=Math.sin(loopPhase+k*1.2);
      const drift=.12*Math.sin(loopPhase+k*.54)-.12*Math.sin(k*.54);
      scene.setTransform(birds[k],{position:[-4.5+k*1.05+drift,4+k*.32+v*.11,-14-k*.5],
        rotation:[0,0,Math.sin(v*.18),Math.cos(v*.18)]});
    }
    if(rabbit?.articulated284){
      frameNo=Math.min(168,time*.12);rabbit.frame(frameNo);render();if(frameNo>=168){playing=false;raf=0;report();return;}raf=requestAnimationFrame(tick);return;
    }
    if(rabbit){
      const next=rabbit.frameCount===180?Math.floor(time/(1000/24))%180:Math.floor(time/135)%17;
      if(next!==frameNo){rabbit.frame(next);frameNo=next;}
    }
    render();raf=requestAnimationFrame(tick);
  }
  function pause(){playing=false;cancelAnimationFrame(raf);last=0;report();}
  function play(){if(disposed)throw Error('HARVEST_DISPOSED');if(playing&&raf)return;if(rabbit?.articulated284&&time>=1400){time=0;frameNo=0;rabbit.frame(0);}playing=true;last=0;raf=requestAnimationFrame(tick);report();}
  function attachPrivateArticulated284(source,placement){
    if(disposed||rabbit||!illustrationMode)throw Error('PRIVATE_ARTICULATED_BINDING_NOT_AVAILABLE');
    const attachment=createArticulated284({device,library,scene,source,ground,shadowShaders:privateV6PawShadowShaders,directPrograms:privateV4DirectEyes,ID,placement});
    rabbit=attachment;materials.set(attachment.node,attachment.material);renderMaterials.set(attachment.mesh,attachment.material);time=0;frameNo=0;render();report();return {scale:rabbit.scale,initialBounds:rabbit.initialBounds,sourceEvidence:source.sourceEvidence};
  }
  function drawArticulated284(t){
    if(!rabbit?.articulated284||!Number.isFinite(t))throw Error('PRIVATE_ARTICULATED_NOT_ATTACHED');
    time=clamp(t,0,1.4)*1000;frameNo=time*.12;const sample=rabbit.frame(frameNo);
    const loopPhase=time*TAU/7500;
    for(let k=0;k<birds.length;k++){const v=Math.sin(loopPhase+k*1.2),drift=.12*Math.sin(loopPhase+k*.54)-.12*Math.sin(k*.54);scene.setTransform(birds[k],{position:[-4.5+k*1.05+drift,4+k*.32+v*.11,-14-k*.5],rotation:[0,0,Math.sin(v*.18),Math.cos(v*.18)]});}
    render();return sample;
  }
  function attachPrivateA4(data){
    if(disposed||rabbit)throw Error('HARVEST_PRIVATE_BINDING_NOT_AVAILABLE');
    const attachment=createPrivateRabbit(device,library,scene,data);
    rabbit=attachment;materials.set(attachment.node,attachment.material);renderMaterials.set(attachment.mesh,attachment.material);
    frameNo=0;render();report();
    return 'PRIVATE_A4_IN_MEMORY_BOUND_ARTISTIC_C1_HOLD';
  }
  function attachPrivateM13V4(data){
    if(disposed||rabbit)throw Error('HARVEST_PRIVATE_BINDING_NOT_AVAILABLE');
    const attachment=createPrivateM1349(device,library,scene,data,privateV4DirectEyes);
    rabbit=attachment;materials.set(attachment.node,attachment.material);renderMaterials.set(attachment.mesh,attachment.material);
    frameNo=0;render();report();
    return Object.freeze({status:'PRIVATE_V9_DERIVED_C1_SINGLE_REPAIR_UNACCEPTED',scale:attachment.scale,
      anchor:attachment.worldAnchor,orientationYaw:attachment.orientationYaw,eyes:2,frames:180});
  }
  function drawPrivateM13V4Frame(i){
    if(disposed||!rabbit||rabbit.frameCount!==180)throw Error('PRIVATE_M13_V5_NOT_ATTACHED');
    rabbit.frame(i);frameNo=i;
    // Private deterministic manual review: apply existing native bird motion at
    // the frame's 24 fps timestamp, equivalent to the original tick law.
    // Distinct environmental instants do not imply 180 distinct rabbit rig poses.
    const loopPhase=(i%180)*TAU/180;
    for(let k=0;k<birds.length;k++){
      const v=Math.sin(loopPhase+k*1.2);
      const drift=.12*Math.sin(loopPhase+k*.54)-.12*Math.sin(k*.54);
      scene.setTransform(birds[k],{position:[-4.5+k*1.05+drift,4+k*.32+v*.11,-14-k*.5],
        rotation:[0,0,Math.sin(v*.18),Math.cos(v*.18)]});
    }
    render();
    return Object.freeze({frame:i,renderCount,backend:device.backend,eyes:2,orientationYaw:rabbit.orientationYaw});
  }

  function setPrivateContactShadowVisible(enabled){
    if(disposed||!rabbit||!rabbit.shadowNode||typeof enabled!=='boolean')throw Error('PRIVATE_M13_V6_SHADOW_VISIBILITY_INVALID');
    scene.setVisibility(rabbit.shadowNode,enabled);if(rabbit.castNode)scene.setVisibility(rabbit.castNode,enabled);render();return {visible:enabled,backend:device.backend,renderCount};
  }
  function dispose(){if(disposed)return;pause();disposed=true;scene.dispose();library.dispose();device.dispose();}
  report();
  return Object.freeze({backend:device.backend,resize,render,pause,play,attachPrivateArticulated284,drawArticulated284,attachPrivateA4,attachPrivateM13V4,drawPrivateM13V4Frame,setPrivateContactShadowVisible,dispose,
    status:()=>Object.freeze({backend:device.backend,playing,frames:renderCount,privateRabbitAttached:Boolean(rabbit),
      artisticAcceptance:'HOLD',sceneType:illustrationMode?'SOURCE_ART_HYBRID_NATIVE_CHARACTER_V10':'NATIVE_PASTORAL_V9_C1_DERIVED_TRIAL',publicationAuthorized:false})});
}


/* PRIVATE_URL_BACKED_INTEGRATION_ONLY: bounded SHA256 asset loader; NOT a release. */
/**
 * Harvest A4 V10: PRIVATE preintegration loader.
 * Does not grant artist acceptance, public hosting, upload, merge or publication.
 * Decodes exactly the author-preserved V9 buffers, after verifying every byte digest.
 * The caller must supply an authorized private readBytes(fileName) function.
 */
const VECTOR_REQUIREMENTS=Object.freeze([
  ['bodyPositions','body_positions.f32','Float32Array',760860],
  ['bodyNormals','body_normals.f32','Float32Array',760860],
  ['eyePositions','eye_positions.f32','Float32Array',4095360],
  ['eyeNormals','eye_normals.f32','Float32Array',4095360],
  ['eyeColors','eye_colors.f32','Float32Array',22752],
  ['eyeFade','eye_fade.f32','Float32Array',7584],
  ['uvs','body_uv.f32','Float32Array',2818],
  ['indices','body_indices.u16','Uint16Array',6792],
  ['atlas','coat_rgba8.bin','Uint8Array',262144],
  ['stanceTransforms','stance_node_180x7.f32','Float32Array',1260],
  ['shadowPositions','shadow_positions_180.f32','Float32Array',131220],
  ['shadowOpacity','shadow_alpha_180.f32','Float32Array',43740],
  ['shadowIndices','shadow_indices.u16','Uint16Array',1260],
]);

function check(ok, reason) { if (!ok) throw new Error('HARVEST_V10_'+reason); }
function expectedBytes(type,n) { return n*({Float32Array:4,Uint16Array:2,Uint8Array:1}[type]); }
function byteView(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
  throw new Error('HARVEST_V10_READ_BYTES_TYPE');
}
async function sha256(bytes){
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
}
function validateManifest(m){
  check(m && m.schema==='HARVEST_A4_V10_SOURCE_ART_PRIVATE_ASSET_MANIFEST_V1','SCHEMA');
  check(m.scope==='PRIVATE_PREINTEGRATION_NO_PUBLIC_ASSET_RELEASE','SCOPE');
  check(m.sourceHead==='12e04206407aae29334b33bccd6c86a38679a9fa','SOURCE_HEAD');
  check(m.ownerArtisticDisposition==='PENDING_C1_HOLD','C1_NOT_HOLD');
  check(m.publicAssetReleaseAllowed===false && m.mergeAllowed===false && m.publicationAllowed===false,'UNAUTHORIZED_RELEASE');
  check(m.frameCount===180 && m.fps===24 && m.durationSeconds===7.5,'FRAME_CONTRACT');
  check(m.art?.file==='approved_harvest_backdrop_UNMODIFIED_PRIVATE.png' && m.art.width===1672 && m.art.height===941 && Number.isInteger(m.art.bytes) && m.art.bytes>0,'ART_IDENTITY');
  check(Array.isArray(m.buffers) && m.buffers.length===VECTOR_REQUIREMENTS.length,'BUFFER_COUNT');
  for(let i=0;i<VECTOR_REQUIREMENTS.length;i++){
    const r=m.buffers[i],e=VECTOR_REQUIREMENTS[i];
    check(r?.key===e[0]&&r?.file===e[1]&&r?.type===e[2]&&r?.length===e[3]&&r?.bytes===expectedBytes(e[2],e[3]),'BUFFER_LAYOUT_'+e[0]);
    check(/^[a-f0-9]{64}$/.test(r.sha256),'BUFFER_DIGEST_FORMAT_'+e[0]);
  }
  check(/^[a-f0-9]{64}$/.test(m.art.sha256),'ART_DIGEST_FORMAT');
}
export async function loadHarvestV10PrivateAssets(manifest,readBytes){
  validateManifest(manifest);
  check(typeof readBytes==='function','READER_REQUIRED');
  const assetData={schema:'PRIVATE_A4_M13_V9_180_FRAME_C1_SINGLE_REPAIR'};
  for(const item of manifest.buffers){
    const bytes=byteView(await readBytes(item.file));
    check(bytes.byteLength===item.bytes,'BYTE_LENGTH_'+item.key);
    check((await sha256(bytes))===item.sha256,'HASH_'+item.key);
    const clone=bytes.slice();
    const t=item.type==='Uint8Array'?new Uint8Array(clone.buffer)
      :item.type==='Uint16Array'?new Uint16Array(clone.buffer)
      :new Float32Array(clone.buffer);
    check(t.length===item.length,'ARRAY_LENGTH_'+item.key);
    if(item.type==='Float32Array'){
      for(let i=0;i<t.length;i++)check(Number.isFinite(t[i]),'NONFINITE_'+item.key+'_'+i);
    }
    assetData[item.key]=t;
  }
  const art=byteView(await readBytes(manifest.art.file));
  check(art.byteLength===manifest.art.bytes,'ART_BYTES');
  check((await sha256(art))===manifest.art.sha256,'ART_HASH');
  check(art.length>32 && art[0]===137 && art[1]===80 && art[2]===78 && art[3]===71,'ART_NOT_PNG');
  const dv=new DataView(art.buffer,art.byteOffset,art.byteLength);
  check(dv.getUint32(16)===manifest.art.width && dv.getUint32(20)===manifest.art.height,'ART_DIMENSIONS');
  return Object.freeze({assets:assetData,approvedIllustrationPNG:art.slice(),sourceHead:manifest.sourceHead,frameCount:180,ownerC1:'HOLD'});
}

/** A URL-backed reader only; no publication or hosting authority is implied. */
export function authorizedPrivateFetchReader(base,fetchImpl=fetch){
  check(typeof base==='string' && base.startsWith('/') && !base.includes('..') && base.endsWith('/'),'PRIVATE_BASE_REQUIRED');
  return async(file)=>{
    check(/^[a-zA-Z0-9._-]+$/.test(file),'UNSAFE_FILE_NAME');
    const r=await fetchImpl(base+file,{credentials:'same-origin',cache:'no-store',redirect:'error'});
    check(r.ok,'ASSET_UNAVAILABLE_'+file);
    return new Uint8Array(await r.arrayBuffer());
  };
}
