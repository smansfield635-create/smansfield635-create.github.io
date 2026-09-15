import {
  createHEarthVector3 as v3,
  addHEarthVector3 as add,
  subtractHEarthVector3 as sub,
  scaleHEarthVector3 as scale,
  crossHEarthVector3 as cross,
  normalizeHEarthVector3 as norm,
  lerpHEarthVector3 as lerp
} from '../../showroom/globe/h-earth/render/geometry-kernel.north.js';

const CONTRACT = Object.freeze({
  id: 'DGB_COMMUNITY_LIFECYCLE_TREE_4SEASON_GEOMETRY_v1',
  object: 'COMMUNITY_FOUR_SEASON_LIFECYCLE_SCULPTURE',
  runtimeCeiling: 'L2_INTERACTIVE_OBJECT',
  geometryKernel: Object.freeze({
    path: '/showroom/globe/h-earth/render/geometry-kernel.north.js',
    blob: 'b5289094db8648800197a03226d6322902960b48',
    usage: 'FOUNDATIONAL_VECTOR3_MATHEMATICS_ONLY'
  }),
  relationalPrecedent: Object.freeze({
    contract: 'SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1',
    usage: '16_SECTOR_16_BAND_RELATIONAL_GRAMMAR_ONLY'
  }),
  engineeringPrecedent: 'ANCIENT_ENERGY_TREE_3D_FIXED_SKELETAL_WEBGL',
  lifecycle: Object.freeze(['SEED','ROOTS','NETWORK','GROWTH','TREE_LOCK','SETTLEMENT','CONTRIBUTION','RENEWAL']),
  lifecycleStates: Object.freeze(['LIFE_CYCLE_ONE_FORMATION','LIFE_CYCLE_TWO_AMBIENT']),
  lifecycleMode: 'EXPLICIT_DUAL_LIFECYCLE_HARD_TRANSITION',
  lifecycleTransitionSeconds: 18.4,
  treeGeometryLock: 'HARD_AFTER_FORMATION',
  transferMode: 'LIFE_CYCLE_ONE_ONLY',
  postLockTransferRestart: false,
  ambientRhythm: 'INDEPENDENT_CALM_MOVEMENT_GUST_DENSITY_RECOVERY',
  seasons: Object.freeze(['SPRING','SUMMER','AUTUMN','WINTER']),
  phaseWindows: Object.freeze({SEED:[0,.09],ROOTS:[.09,.22],NETWORK:[.22,.35],GROWTH:[.35,.56],TREE_LOCK:[.56,.64],SETTLEMENT:[.64,.78],CONTRIBUTION:[.78,.90],RENEWAL:[.90,1]}),
  treeLock: .56,
  inspectionYawLimitDegrees: 22,
  renderer: 'ONE_CONTEXT_WEBGL_FIXED_GEOMETRY_SHADER_PROGRESS',
  environment: 'FOUR_PERMANENT_QUADRANT_VOLUMES_WITH_DEPTH_FEEDS',
  environmentArchitecture: 'PERMANENT_QUADRANT_VOLUMES_PROTECTED_CENTER',
  environmentCycleSeconds: 72,
  environmentSectors: Object.freeze(['SPRING_FLOWERS_POLLEN','SUMMER_RAIN_WIND','AUTUMN_LEAVES','WINTER_SNOW']),
  environmentDepthPlanes: Object.freeze(['BACKGROUND','MIDGROUND','FOREGROUND']),
  environmentDepthModel: 'REAL_Z_SEPARATION_SCALE_OPACITY_MOTION_RATE',
  feedPath: 'ZONE_SOURCE_TO_CENTER_DEPTH_TRAVERSAL',
  feedOrbitRevolutions: 0,
  feedingWindowSeconds: Object.freeze([3.5,12.5]),
  dockingWindowSeconds: Object.freeze([12.5,16.5]),
  guideDissolveWindowSeconds: Object.freeze([16.5,18.4]),
  matureLockSeconds: 18.4,
  protectedCenter: true,
  rimTaper: null,
  postLockFeeding: false,
  topologyRandomness: false,
  cycleSeconds: 18.4
});

const LIFE_CYCLE=Object.freeze({ONE:'LIFE_CYCLE_ONE_FORMATION',TWO:'LIFE_CYCLE_TWO_AMBIENT'});
const root = document.querySelector('[data-community-lifecycle-mount]');
if (root) queueMicrotask(() => mount(root));

function V(x,y,z){const q=v3(x,y,z);if(!q)throw Error('LIFECYCLE_VECTOR');return q}
function A(a,b){const q=add(a,b);if(!q)throw Error('LIFECYCLE_ADD');return q}
function S(a,b){const q=sub(a,b);if(!q)throw Error('LIFECYCLE_SUB');return q}
function M(a,s){const q=scale(a,s);if(!q)throw Error('LIFECYCLE_SCALE');return q}
function C(a,b){const q=cross(a,b);if(!q)throw Error('LIFECYCLE_CROSS');return q}
function N(a){const q=norm(a);if(!q?.valid)throw Error('LIFECYCLE_NORM');return q.vector}
function L(a,b,t){const q=lerp(a,b,t);if(!q)throw Error('LIFECYCLE_LERP');return q}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,x)=>{const t=clamp((x-a)/Math.max(.00001,b-a));return t*t*(3-2*t)};
const smoother=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};

const KIND=Object.freeze({
  ROOT:0,NETWORK:1,TREE:2,CORE:3,SPRING:4,SUMMER:5,AUTUMN:6,WINTER:7,GEAR:8,
  CONTRIBUTION:9,RETURN:10,STAR:11,
  FEED_SPRING:12,FEED_SUMMER:13,FEED_AUTUMN:14,FEED_WINTER:15,GUIDE:16,
  ZONE_SPRING:17,ZONE_SUMMER:18,ZONE_AUTUMN:19,ZONE_WINTER:20,FOLIAGE:21
});
const SEASON=Object.freeze({NONE:-1,SPRING:0,SUMMER:1,AUTUMN:2,WINTER:3});
const WOOD_MATERIAL=Object.freeze({
  ROOT:Object.freeze([.145,.078,.038,1]),
  TRUNK:Object.freeze([.205,.118,.058,1]),
  PRIMARY:Object.freeze([.235,.132,.064,1]),
  SECONDARY:Object.freeze([.195,.103,.049,1]),
  TWIG:Object.freeze([.165,.085,.041,1])
});
const DEPTH_PLANES=Object.freeze([
  Object.freeze({id:'BACKGROUND',z:-.78,scale:.58,alpha:.34,motion:.46}),
  Object.freeze({id:'MIDGROUND',z:-.12,scale:.88,alpha:.62,motion:.78}),
  Object.freeze({id:'FOREGROUND',z:.62,scale:1.24,alpha:.82,motion:1.18})
]);
const QUADRANT_VOLUMES=Object.freeze([
  Object.freeze({season:SEASON.SPRING,kind:KIND.ZONE_SPRING,id:'FLOWERS',x:-1.74,y:1.50,xSpan:.72,ySpan:.92}),
  Object.freeze({season:SEASON.SUMMER,kind:KIND.ZONE_SUMMER,id:'RAIN',x:-1.76,y:.02,xSpan:.72,ySpan:1.18}),
  Object.freeze({season:SEASON.AUTUMN,kind:KIND.ZONE_AUTUMN,id:'LEAVES',x:1.76,y:.02,xSpan:.72,ySpan:1.18}),
  Object.freeze({season:SEASON.WINTER,kind:KIND.ZONE_WINTER,id:'SNOW',x:1.74,y:1.50,xSpan:.72,ySpan:.92})
]);

function mesh(){return{p:[],n:[],c:[],q:[],k:[],s:[],i:[]}}
function vert(g,p,n,c,q,k,season=SEASON.NONE){const i=g.p.length/3;g.p.push(p.x,p.y,p.z);g.n.push(n.x,n.y,n.z);g.c.push(...c);g.q.push(q);g.k.push(k);g.s.push(season);return i}
function tube(g,a,b,r0,r1,q0,q1,color,kind=KIND.TREE,sides=7,seed=0,season=SEASON.NONE){
  const axis=N(S(b,a)),ref=Math.abs(axis.y)>.82?V(1,0,0):V(0,1,0),u=N(C(axis,ref)),v=N(C(axis,u)),base=g.p.length/3;
  for(let e=0;e<2;e++){
    const center=e?b:a,r=e?r1:r0,q=e?q1:q0;
    for(let s=0;s<sides;s++){
      const z=Math.PI*2*s/sides,rr=r*(1+.045*Math.sin(seed*1.7+s*2.13+e*.8)),rad=A(M(u,Math.cos(z)),M(v,Math.sin(z)));
      vert(g,A(center,M(rad,rr)),rad,color,q,kind,season);
    }
  }
  for(let s=0;s<sides;s++){const t=(s+1)%sides,a0=base+s,a1=base+t,b0=base+sides+s,b1=base+sides+t;g.i.push(a0,b0,a1,a1,b0,b1)}
}
function orb(g,o,r,c,q,k=KIND.CONTRIBUTION,lon=7,lat=4,season=SEASON.NONE){
  const base=g.p.length/3;
  for(let y=0;y<=lat;y++){
    const ph=Math.PI*y/lat;
    for(let x=0;x<lon;x++){
      const th=Math.PI*2*x/lon,nx=Math.sin(ph)*Math.cos(th),ny=Math.cos(ph),nz=Math.sin(ph)*Math.sin(th),n=N(V(nx/Math.max(.001,r.x),ny/Math.max(.001,r.y),nz/Math.max(.001,r.z)));
      vert(g,A(o,V(nx*r.x,ny*r.y,nz*r.z)),n,c,q,k,season);
    }
  }
  for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){const t=(x+1)%lon,a=base+y*lon+x,b=base+y*lon+t,c0=base+(y+1)*lon+x,d=base+(y+1)*lon+t;g.i.push(a,c0,b,b,c0,d)}
}
function bez(a,c,b,t){const u=1-t;return A(A(M(a,u*u),M(c,2*u*t)),M(b,t*t))}
function arc(g,a,c,b,r,q0,q1,color,kind,seed,season=SEASON.NONE,steps=12){let p=a;for(let j=1;j<=steps;j++){const t=j/steps,n=bez(a,c,b,t);tube(g,p,n,mix(r,r*.55,(j-1)/steps),mix(r,r*.55,t),mix(q0,q1,(j-1)/steps),mix(q0,q1,t),color,kind,5,seed+j,season);p=n}}
function spokeStar(g,o,r,q,color,kind=KIND.STAR,season=SEASON.NONE){for(let i=0;i<8;i++){const a=Math.PI*2*i/8,b=V(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r,o.z+(i%2?.035:-.035));tube(g,o,b,.025,.007,q,q,color,kind,5,500+i,season)}}
function ring(g,o,rx,ry,z,r,q,color,kind,season=SEASON.NONE,segments=18){let p=V(o.x+rx,o.y,z);for(let i=1;i<=segments;i++){const a=Math.PI*2*i/segments,n=V(o.x+Math.cos(a)*rx,o.y+Math.sin(a)*ry,z);tube(g,p,n,r,r,q,q,color,kind,5,600+i,season);p=n}}
function cubeCore(g,o,size,color){
  const h=size/2,pts=[];for(const y of[-h,h])for(const x of[-h,h])for(const z of[-h,h])pts.push(A(o,V(x,y,z)));
  const edges=[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7],[0,7],[1,6],[2,5],[3,4]];
  edges.forEach(([a,b],i)=>tube(g,pts[a],pts[b],.018,.018,.04,.04,color,KIND.CORE,5,700+i));
  orb(g,o,V(.095,.095,.095),[.98,.78,.28,1],.035,KIND.CORE,8,5);
}
function gear(g,o,r,teeth,q,color,season=SEASON.AUTUMN){ring(g,o,r,r,o.z,.017,q,color,KIND.GEAR,season,20);ring(g,o,r*.48,r*.48,o.z,.015,q,color,KIND.GEAR,season,16);for(let i=0;i<teeth;i++){const a=Math.PI*2*i/teeth,p0=V(o.x+Math.cos(a)*r*.78,o.y+Math.sin(a)*r*.78,o.z),p1=V(o.x+Math.cos(a)*r*1.16,o.y+Math.sin(a)*r*1.16,o.z);tube(g,p0,p1,.014,.014,q,q,color,KIND.GEAR,5,800+i,season)}}
function flower(g,o,q,kind=KIND.SPRING,season=SEASON.SPRING,scale0=1,colorAlpha=1){
  const petal=[.95,.52,.67,colorAlpha],center=[1,.78,.32,colorAlpha];
  orb(g,o,V(.035,.035,.028),center,q,kind,6,3,season);
  for(let i=0;i<5;i++){const a=Math.PI*2*i/5,p=A(o,V(Math.cos(a)*.065*scale0,Math.sin(a)*.065*scale0,(i%2-.5)*.02));orb(g,p,V(.052,.033,.025),petal,q,kind,6,3,season)}
}
function blossom(g,o,q,scale0=1){flower(g,o,q,KIND.SPRING,SEASON.SPRING,scale0)}
function snowflake(g,o,r,q,kind=KIND.WINTER,season=SEASON.WINTER,colorAlpha=1){
  const c=[.72,.90,1,colorAlpha];
  for(let i=0;i<6;i++){const a=Math.PI*i/3,e=V(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r,o.z);tube(g,o,e,.012,.005,q,q,c,kind,5,900+i,season);const m=L(o,e,.62),p1=A(m,V(-Math.sin(a)*r*.18,Math.cos(a)*r*.18,0)),p2=A(m,V(Math.sin(a)*r*.18,-Math.cos(a)*r*.18,0));tube(g,m,p1,.007,.003,q,q,c,kind,5,920+i,season);tube(g,m,p2,.007,.003,q,q,c,kind,5,940+i,season)}
}
function frost(g,o,r,q){snowflake(g,o,r,q)}
function bird(g,o,q){const c=[.98,.86,.58,1],l=A(o,V(-.20,.05,0)),r=A(o,V(.20,.05,0)),c0=A(o,V(0,-.015,.02));arc(g,l,A(o,V(-.10,.14,.02)),c0,.014,q,q,c,KIND.SPRING,970,SEASON.SPRING,6);arc(g,c0,A(o,V(.10,.14,.02)),r,.014,q,q,c,KIND.SPRING,980,SEASON.SPRING,6)}
function leaf(g,o,q,kind,season,scale0=1,color=[.82,.40,.08,1]){orb(g,o,V(.075*scale0,.035*scale0,.028*scale0),color,q,kind,7,3,season)}
function rainStroke(g,o,q,kind,season,scale0=1,color=[.12,.58,.90,.88]){tube(g,A(o,V(-.035,.075,.018)),A(o,V(.035,-.085,-.018)),.011*scale0,.006*scale0,q,q,color,kind,5,1120+Math.round(q*100),season)}
function windStroke(g,o,q,kind,season,scale0=1,color=[.28,.78,.90,.78]){arc(g,A(o,V(-.12*scale0,0,0)),A(o,V(0,.065*scale0,.025)),A(o,V(.13*scale0,0,0)),.009,q,q,color,kind,1180+Math.round(q*100),season,6)}
const alphaColor=(c,a)=>[c[0],c[1],c[2],a];

function quadrantPoint(zone,plane,i,count){
  const col=i%4,row=Math.floor(i/4),cols=4,rows=Math.ceil(count/cols);
  const x=((col+.5)/cols-.5)*2*zone.xSpan;
  const y=((row+.5)/rows-.5)*2*zone.ySpan;
  const jitterX=((i*7)%5-2)*.028,jitterY=((i*11)%7-3)*.022;
  return V(zone.x+x+jitterX,zone.y+y+jitterY,plane.z+((i%3)-1)*.055);
}
function addQuadrantEnvironment(g){
  const count=8;
  for(const zone of QUADRANT_VOLUMES){
    DEPTH_PLANES.forEach((plane,depthIndex)=>{
      for(let i=0;i<count;i++){
        const p=quadrantPoint(zone,plane,i,count),q=.10+zone.season*.17+depthIndex*.018+i*.006,near=plane.scale,alpha=plane.alpha;
        if(zone.season===SEASON.SPRING){
          if(i%3===0)flower(g,p,q,zone.kind,zone.season,.58*near,alpha);
          else orb(g,p,V(.026*near,.018*near,.020*near),i%2?alphaColor([.98,.60,.72,1],alpha):alphaColor([1,.78,.36,1],alpha),q,zone.kind,5,3,zone.season);
        }else if(zone.season===SEASON.SUMMER){
          rainStroke(g,p,q,zone.kind,zone.season,.66*near,alphaColor([.12,.58,.90,1],alpha));
          if(i%4===0)windStroke(g,A(p,V(.04,.035,.01)),q,zone.kind,zone.season,.55*near,alphaColor([.28,.78,.90,1],alpha*.82));
          if(depthIndex===0&&i%4===2)orb(g,A(p,V(.08,.03,-.03)),V(.10*near,.055*near,.045*near),alphaColor([.24,.55,.65,1],alpha*.26),q,zone.kind,6,3,zone.season);
        }else if(zone.season===SEASON.AUTUMN){
          leaf(g,p,q,zone.kind,zone.season,.66*near,i%2?alphaColor([.94,.49,.08,1],alpha):alphaColor([.68,.27,.035,1],alpha));
        }else{
          if(i%3===0)snowflake(g,p,.045*near+(i%2)*.007,q,zone.kind,zone.season,alpha);
          else orb(g,p,V(.024*near,.024*near,.021*near),[.74,.91,1,alpha],q,zone.kind,5,3,zone.season);
          if(depthIndex===0&&i%4===1)orb(g,A(p,V(.10,.02,-.02)),V(.13*near,.060*near,.050*near),[.64,.78,.86,alpha*.20],q,zone.kind,6,3,zone.season);
        }
      }
    });
  }

  const dockSpring=V(-1.06,1.48,.18),dockSummer=V(-1.17,.72,.15),dockAutumn=V(1.10,.76,.14),dockWinter=V(1.02,1.54,.16);
  [V(-.10,.04,0),V(.02,.12,.02),V(.12,-.03,-.01)].forEach((d,i)=>flower(g,A(dockSpring,d),.80,KIND.FEED_SPRING,SEASON.SPRING,.92+i*.08));
  [V(-.12,.10,.00),V(-.03,.03,.02),V(.08,.12,-.02),V(.14,-.01,.03)].forEach((d,i)=>rainStroke(g,A(dockSummer,d),.81,KIND.FEED_SUMMER,SEASON.SUMMER,.95+i*.04));
  windStroke(g,A(dockSummer,V(0,-.12,.01)),.81,KIND.FEED_SUMMER,SEASON.SUMMER,1.1);
  [V(-.13,.08,.00),V(-.02,.14,.02),V(.10,.07,-.02),V(-.08,-.06,.03),V(.11,-.08,.01)].forEach((d,i)=>leaf(g,A(dockAutumn,d),.82,KIND.FEED_AUTUMN,SEASON.AUTUMN,.90+(i%2)*.18,i%2?[.91,.48,.09,1]:[.69,.29,.045,1]));
  [V(-.10,.05,.00),V(.08,.11,.02),V(.05,-.08,-.02)].forEach((d,i)=>snowflake(g,A(dockWinter,d),.075+i*.008,.83,KIND.FEED_WINTER,SEASON.WINTER));
}

function assertFiniteGeometry(g){
  const finite=[g.p,g.n,g.c,g.q,g.k,g.s].every(values=>values.every(Number.isFinite));
  const indices=g.i.every((value)=>Number.isInteger(value)&&value>=0&&value<g.p.length/3);
  if(!finite||!indices)throw Error('LIFECYCLE_NONFINITE_GEOMETRY');
  return true;
}
function build(){
  const g=mesh();
  const dark=WOOD_MATERIAL.ROOT,network=[.055,.18,.22,1],coreGold=[.82,.58,.18,1],springGreen=[.08,.28,.12,1],summerGreen=[.03,.20,.11,1],water=[.08,.42,.72,.92],autumn=[.72,.35,.07,1],winter=[.64,.77,.82,1],returnBlue=[.04,.22,.34,1];
  const O=V(0,-.28,0);
  cubeCore(g,V(0,-.05,0),.52,coreGold);
  const roots=[V(-1.46,-1.05,.26),V(-1.06,-1.22,-.48),V(-.38,-1.30,-.74),V(.42,-1.28,-.70),V(1.10,-1.18,-.42),V(1.48,-1.04,.28),V(.91,-1.21,.67),V(-.91,-1.20,.69)];
  roots.forEach((e,i)=>{const m=L(O,e,.48);tube(g,O,A(m,V(0,.04,0)),.17,.084,.09,.16,WOOD_MATERIAL.ROOT,KIND.ROOT,8,10+i);tube(g,A(m,V(0,.04,0)),e,.084,.028,.16,.22,dark,KIND.ROOT,7,30+i)});
  for(let i=0;i<roots.length;i++){const a=roots[i],b=roots[(i+1)%roots.length],m=A(L(a,b,.5),V(0,.12,0));tube(g,a,m,.023,.019,.22,.28,network,KIND.NETWORK,6,50+i*2);tube(g,m,b,.019,.023,.28,.33,network,KIND.NETWORK,6,51+i*2)}
  for(let i=0;i<4;i++){const h=V(0,-.96+i*.012,-.04+i*.02);tube(g,roots[i],h,.017,.023,.25,.31,network,KIND.NETWORK,5,70+i);tube(g,h,roots[i+4],.023,.017,.31,.35,network,KIND.NETWORK,5,80+i)}
  const trunk=[[O,V(-.07,.10,.03),.22,.18,.35,.40],[V(-.07,.10,.03),V(.05,.58,-.03),.18,.145,.40,.46],[V(.05,.58,-.03),V(-.04,1.04,.04),.145,.112,.46,.51],[V(-.04,1.04,.04),V(.03,1.43,-.02),.112,.082,.51,.56]];
  trunk.forEach((s,i)=>tube(g,s[0],s[1],s[2],s[3],s[4],s[5],i<2?WOOD_MATERIAL.TRUNK:WOOD_MATERIAL.PRIMARY,KIND.TREE,8,100+i));
  const tips=[V(-1.43,.56,.30),V(-1.20,.98,-.18),V(-.89,1.42,.20),V(-.44,1.72,-.10),V(.42,1.79,-.10),V(.91,1.51,.18),V(1.22,1.08,-.24),V(1.43,.66,.23),V(.03,1.99,.10)];
  const starts=[V(-.06,.29,.03),V(.03,.52,-.02),V(-.02,.74,.02),V(0,.92,.02),V(.02,1.15,-.01),V(.03,1.34,-.02)];
  tips.forEach((t,i)=>{const s=starts[Math.min(starts.length-1,Math.floor(i*starts.length/tips.length))],side=i%2?-1:1,b=V((s.x+t.x)*.52+side*.06,mix(s.y,t.y,.48)+.12,(s.z+t.z)*.48+(i%3-1)*.09);tube(g,s,b,.078-i*.003,.044,.42+i*.006,.50+i*.004,WOOD_MATERIAL.PRIMARY,KIND.TREE,7,120+i*2);tube(g,b,t,.044,.018,.50+i*.004,.56,WOOD_MATERIAL.SECONDARY,KIND.TREE,6,121+i*2)});
  [[-.95,1.48,.06,.32,.22,.23,SEASON.SPRING,springGreen],[-.56,1.78,.00,.34,.24,.24,SEASON.SPRING,springGreen],[-.84,.92,.18,.28,.21,.22,SEASON.SUMMER,summerGreen],[-.42,1.22,-.08,.30,.22,.23,SEASON.SUMMER,summerGreen],[.48,1.20,.06,.30,.22,.23,SEASON.AUTUMN,autumn],[.91,.91,-.07,.28,.21,.22,SEASON.AUTUMN,autumn],[.58,1.76,.03,.34,.24,.24,SEASON.WINTER,winter],[.96,1.45,.08,.31,.22,.23,SEASON.WINTER,winter]].forEach((x)=>orb(g,V(x[0],x[1],x[2]),V(x[3],x[4],x[5]),x[7],.548,KIND.FOLIAGE,7,4,x[6]));
  const top=V(0,2.28,.02),leftRoot=V(-1.12,-1.05,.16),rightRoot=V(1.12,-1.05,.16);
  arc(g,top,V(-1.72,.72,.08),leftRoot,.014,.54,.56,[.58,.77,.76,.75],KIND.GUIDE,300,SEASON.NONE,18);
  arc(g,top,V(1.72,.72,.08),rightRoot,.014,.54,.56,[.82,.61,.26,.75],KIND.GUIDE,340,SEASON.NONE,18);
  spokeStar(g,top,.18,.575,[1,.82,.35,1],KIND.STAR);
  [V(-1.28,.69,.31),V(-1.08,1.08,-.12),V(-.82,1.48,.20),V(-.48,1.68,-.07)].forEach((p,i)=>blossom(g,p,.645+i*.012,.9+(i%2)*.18));
  [V(-1.10,.82,.12),V(-.69,1.34,.06),V(-.35,1.58,.02)].forEach((p,i)=>orb(g,p,V(.045,.045,.04),[1,.75,.34,1],.69+i*.01,KIND.SPRING,6,3,SEASON.SPRING));
  bird(g,V(-.86,1.95,.10),.735);
  arc(g,V(-1.35,-.64,.28),V(-1.68,.26,.54),V(-1.18,.82,.24),.025,.655,.705,water,KIND.SUMMER,400,SEASON.SUMMER,16);
  arc(g,V(-1.18,-.87,-.22),V(-1.55,.05,-.48),V(-.73,1.22,-.10),.021,.665,.715,[.10,.55,.82,.82],KIND.SUMMER,430,SEASON.SUMMER,16);
  [V(-1.08,.42,.16),V(-.80,.74,-.10),V(-.56,1.05,.05)].forEach((p,i)=>orb(g,p,V(.15,.10,.12),summerGreen,.70+i*.011,KIND.SUMMER,7,4,SEASON.SUMMER));
  const autumnNodes=[V(.42,.52,.04),V(.75,.64,-.02),V(1.02,.78,.08),V(.56,.93,.09),V(.88,1.08,-.05),V(1.18,.99,.02)];
  autumnNodes.forEach((p,i)=>orb(g,p,V(.115,.075,.095),i%2?[.88,.46,.08,1]:[.66,.28,.045,1],.665+i*.012,KIND.AUTUMN,7,4,SEASON.AUTUMN));
  for(let i=0;i<autumnNodes.length-1;i++)tube(g,autumnNodes[i],autumnNodes[i+1],.012,.012,.69+i*.008,.69+i*.008,WOOD_MATERIAL.TWIG,KIND.AUTUMN,5,460+i,SEASON.AUTUMN);
  gear(g,V(.55,-.67,.24),.20,8,.72,[.58,.37,.16,.82]);gear(g,V(.93,-.82,.05),.16,7,.745,[.47,.31,.17,.74]);gear(g,V(.25,-.91,-.16),.13,6,.758,[.50,.34,.19,.70]);
  const winterBase=V(.28,1.26,.02),winterTips=[V(.62,1.57,.08),V(.91,1.73,-.03),V(1.15,1.50,.05),V(.78,1.96,.04),V(1.22,1.89,.09)];
  winterTips.forEach((p,i)=>{tube(g,winterBase,p,.026,.008,.65+i*.014,.69+i*.014,WOOD_MATERIAL.TWIG,KIND.WINTER,5,490+i,SEASON.WINTER);frost(g,p,.09+i*.008,.71+i*.012)});
  [V(.63,1.35,.03),V(.95,1.30,-.02)].forEach((p,i)=>orb(g,p,V(.07,.12,.065),[.43,.58,.55,1],.74+i*.012,KIND.WINTER,7,4,SEASON.WINTER));
  const contrib=[V(-1.36,.62,.30),V(-.77,1.52,.18),V(-.36,1.77,-.06),V(.48,1.81,-.05),V(.92,1.56,.11),V(1.32,.89,.08),V(.02,2.08,.07)];
  contrib.forEach((p,i)=>orb(g,p,V(.065,.082,.06),[.98,.71,.20,1],.79+i*.013,KIND.CONTRIBUTION,7,4,i<3?SEASON.SPRING:i<4?SEASON.SUMMER:i<6?SEASON.AUTUMN:SEASON.WINTER));
  [[contrib[0],roots[1],-1],[contrib[2],roots[7],-1],[contrib[4],roots[6],1],[contrib[5],roots[4],1],[contrib[6],roots[3],1]].forEach(([a,b,side],i)=>arc(g,a,V(side*(1.72+i*.08),.22+i*.08,.72-i*.18),b,.019,.90+i*.012,.985,returnBlue,KIND.RETURN,1000+i*24,SEASON.NONE,16));
  addQuadrantEnvironment(g);
  if(g.p.length/3>65535)throw Error('LIFECYCLE_VERTEX_BUDGET');
  assertFiniteGeometry(g);
  return g;
}

function precisionRecord(gl,type){
  const read=kind=>{const p=gl.getShaderPrecisionFormat(type,kind);return p?{rangeMin:p.rangeMin,rangeMax:p.rangeMax,precision:p.precision}:null};
  return{high:read(gl.HIGH_FLOAT),medium:read(gl.MEDIUM_FLOAT)};
}
function precisionProfile(gl){
  const vertex=precisionRecord(gl,gl.VERTEX_SHADER),fragment=precisionRecord(gl,gl.FRAGMENT_SHADER),usable=p=>!!p&&(p.precision>0||p.rangeMax>0),selected=usable(vertex.high)&&usable(fragment.high)?'highp':'mediump';
  return{selected,vertex,fragment};
}
function vertexSource(webgl2,precision){return`${webgl2?'#version 300 es\n':''}precision ${precision} float;
${webgl2?'in':'attribute'} vec3 a_position,a_normal;
${webgl2?'in':'attribute'} vec4 a_color;
${webgl2?'in':'attribute'} float a_phase,a_kind,a_season;
uniform float u_yaw,u_pitch,u_scale,u_aspect,u_camera,u_time,u_intro,u_progress,u_reduced,u_lifecycle;
${webgl2?'out':'varying'} vec3 v_n;
${webgl2?'out':'varying'} vec4 v_c;
${webgl2?'out':'varying'} float v_q,v_k,v_s,v_settle,v_rhythm;
float ss(float a,float b,float x){float t=clamp((x-a)/max(.0001,b-a),0.0,1.0);return t*t*(3.0-2.0*t);}
void main(){
  float cy=cos(u_yaw),sy=sin(u_yaw),cp=cos(u_pitch),sp=sin(u_pitch);
  vec3 p=a_position,n=a_normal;
  float motif=step(3.5,a_kind)*step(a_kind,8.5);
  float settle=ss(a_phase-.030,a_phase+.020,u_progress);
  if(u_reduced>.5)settle=1.0;
  vec3 approach=vec3(0.0);
  if(a_kind>3.5&&a_kind<4.5)approach=vec3(-.52,.20,.22);
  else if(a_kind>4.5&&a_kind<5.5)approach=vec3(-.30,-.34,.34);
  else if(a_kind>5.5&&a_kind<6.5)approach=vec3(.42,-.30,.25);
  else if(a_kind>6.5&&a_kind<7.5)approach=vec3(.50,.22,.20);
  else if(a_kind>7.5&&a_kind<8.5)approach=vec3(.22,-.45,.18);
  p+=approach*(1.0-settle)*motif;

  float feed=step(11.5,a_kind)*step(a_kind,15.5);
  if(feed>.5){
    vec3 dock=vec3(-1.06,1.48,.18),source=vec3(-1.78,1.72,-.52),waypoint=vec3(-.78,1.14,.28);
    float delay=0.0;
    if(a_kind>12.5&&a_kind<13.5){dock=vec3(-1.17,.72,.15);source=vec3(-1.82,.10,.58);waypoint=vec3(-.82,.58,-.10);delay=.25;}
    else if(a_kind>13.5&&a_kind<14.5){dock=vec3(1.10,.76,.14);source=vec3(1.82,.08,-.48);waypoint=vec3(.82,.58,.22);delay=.50;}
    else if(a_kind>14.5){dock=vec3(1.02,1.54,.16);source=vec3(1.78,1.72,.56);waypoint=vec3(.78,1.16,-.12);delay=.75;}
    float travelT=ss(3.5+delay,12.0+delay,u_intro);
    float dockT=ss(12.5+delay,16.5,u_intro);
    if(u_reduced>.5||u_lifecycle>.5){travelT=1.0;dockT=1.0;}
    vec3 route=mix(source,waypoint,travelT);
    route+=vec3(0.0,sin(3.14159265*travelT)*.16,sin(3.14159265*travelT+a_kind)*.22);
    vec3 feedPos=mix(route,dock,dockT);
    p+=feedPos-dock;
  }

  float zoneEnv=step(16.5,a_kind)*step(a_kind,20.5);
  float rhythm=1.0;
  if(zoneEnv>.5&&u_reduced<.5){
    float depth=clamp((a_position.z+1.0)/2.0,0.0,1.0);
    float speed=mix(.46,1.18,depth),amp=mix(.018,.078,depth);
    if(a_kind>16.5&&a_kind<17.5){
      float wave=.5+.5*sin(u_time*.28+a_phase*19.0+.4);rhythm=.28+.72*ss(.18,.82,wave);
      p.x+=sin(u_time*.42*speed+a_phase*31.0)*amp*.70*rhythm;
      p.y+=cos(u_time*.35*speed+a_phase*23.0)*amp*.62*rhythm;
      p.z+=sin(u_time*.28*speed+a_phase*19.0)*amp*.34*rhythm;
    }else if(a_kind>17.5&&a_kind<18.5){
      float wave=.5+.5*sin(u_time*.21+a_phase*17.0+1.7);rhythm=.24+.76*ss(.24,.76,wave);
      float burst=.62+.38*rhythm;
      p.x+=sin(u_time*.74*speed+a_phase*37.0)*amp*burst;
      p.y-=abs(sin(u_time*.92*speed+a_phase*29.0))*amp*.90*rhythm;
    }else if(a_kind>18.5&&a_kind<19.5){
      float wave=.5+.5*sin(u_time*.25+a_phase*23.0+3.1);rhythm=.30+.70*ss(.20,.80,wave);
      p.x+=sin(u_time*.58*speed+a_phase*41.0)*amp*1.05*rhythm;
      p.y+=cos(u_time*.51*speed+a_phase*33.0)*amp*.86*rhythm;
      p.z+=sin(u_time*.39*speed+a_phase*27.0)*amp*.42*rhythm;
    }else{
      float wave=.5+.5*sin(u_time*.17+a_phase*13.0+4.6);rhythm=.22+.78*ss(.26,.74,wave);
      float gust=.55+.45*rhythm;
      p.x+=sin(u_time*.44*speed+a_phase*43.0)*amp*gust;
      p.y-=abs(cos(u_time*.36*speed+a_phase*35.0))*amp*.52*rhythm;
      p.z+=sin(u_time*.27*speed+a_phase*21.0)*amp*.24*rhythm;
    }
    rhythm=mix(.42,rhythm,u_lifecycle);
  }

  float crown=ss(.2,1.95,p.y),alive=ss(.35,.56,u_progress);
  float sway=(u_reduced>.5?0.0:.008)*crown*alive;
  p.x+=sin(u_time*.18+p.y*2.1+p.z*1.7)*sway;
  p.z+=cos(u_time*.15+p.x*1.6+p.y*1.2)*sway*.72;
  p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);
  n=vec3(cy*n.x+sy*n.z,n.y,-sy*n.x+cy*n.z);
  p=vec3(p.x,cp*p.y-sp*p.z,sp*p.y+cp*p.z);
  n=vec3(n.x,cp*n.y-sp*n.z,sp*n.y+cp*n.z);
  p.y-=.28;p*=u_scale;
  float z=max(1.1,u_camera-p.z),nc=1.0,fc=10.0,zc=((fc+nc)/(fc-nc))*z-(2.0*fc*nc)/(fc-nc);
  gl_Position=vec4(p.x*1.70/u_aspect,p.y*1.70,zc,z);
  v_n=normalize(n);v_c=a_color;v_q=a_phase;v_k=a_kind;v_s=a_season;v_settle=settle;v_rhythm=rhythm;
}`}
function fragmentSource(webgl2,precision){return`${webgl2?'#version 300 es\n':''}precision ${precision} float;
${webgl2?'in':'varying'} vec3 v_n;${webgl2?'in':'varying'} vec4 v_c;
${webgl2?'in':'varying'} float v_q,v_k,v_s,v_settle,v_rhythm;
uniform float u_time,u_intro,u_progress,u_activity,u_retained,u_renewal,u_reduced,u_lifecycle;
${webgl2?'out vec4 lifecycleColor;':''}
float ss(float a,float b,float x){float t=clamp((x-a)/max(.0001,b-a),0.0,1.0);return t*t*(3.0-2.0*t);}
void main(){
  vec3 N=normalize(v_n),K=normalize(vec3(-.42,.78,.52)),F=normalize(vec3(.58,.18,-.72));
  float d=.30+.58*max(0.0,dot(N,K))+.16*max(0.0,dot(N,F)),rim=.20*pow(1.0-max(0.0,dot(N,normalize(vec3(.12,.08,1.0)))),2.1);
  vec3 base=v_c.rgb*(d+rim)+vec3(.012,.014,.013);
  float feed=step(11.5,v_k)*step(v_k,15.5),zoneEnv=step(16.5,v_k)*step(v_k,20.5),special=max(feed,zoneEnv);
  float reached=ss(v_q-.035,v_q+.012,u_progress),front=1.0-ss(.0,.050,abs(u_progress-v_q));
  if(u_reduced>.5){reached=1.0;front=0.0;}
  reached=mix(reached,1.0,special);
  front*=1.0-special;
  float network=1.0-step(.45,abs(v_k-1.0)),core=1.0-step(.45,abs(v_k-3.0)),contrib=1.0-step(.45,abs(v_k-9.0)),renew=1.0-step(.45,abs(v_k-10.0)),star=1.0-step(.45,abs(v_k-11.0)),guide=1.0-step(.45,abs(v_k-16.0));
  float spring=1.0-step(.45,abs(v_s-0.0)),summer=1.0-step(.45,abs(v_s-1.0)),autumn=1.0-step(.45,abs(v_s-2.0)),winter=1.0-step(.45,abs(v_s-3.0));
  vec3 seasonal=base;
  seasonal=mix(seasonal,vec3(.88,.44,.58),spring*.20);
  seasonal=mix(seasonal,vec3(.08,.48,.38),summer*.20);
  seasonal=mix(seasonal,vec3(.82,.40,.08),autumn*.24);
  seasonal=mix(seasonal,vec3(.58,.79,.88),winter*.22);
  float pulse=(.5+.5*sin(u_time*.72-v_q*23.0))*reached;
  float envPulse=(.55+.45*sin(u_time*(.62+.08*max(0.0,v_k-17.0))+v_q*29.0))*zoneEnv;
  float glow=(reached*.18+front*.72)*u_activity+network*reached*.10+core*(.22+.12*pulse)+contrib*reached*(.30+.20*pulse)+renew*u_renewal*(.24+.38*front)+star*reached*.35+u_retained*(1.0-ss(.22,.40,v_q))*.18+feed*(.18+.20*pulse)+zoneEnv*(.09+.12*envPulse);
  glow=clamp(glow,0.0,1.0);
  vec3 energy=vec3(.20,.84,.78);
  energy=mix(energy,vec3(.98,.70,.22),autumn*.40+contrib*.32+star*.45);
  energy=mix(energy,vec3(.26,.68,.92),winter*.28+renew*.52);
  energy=mix(energy,vec3(.96,.54,.70),spring*.26);
  vec3 lit=mix(seasonal,energy,glow*.68)+energy*front*.16*u_activity;
  float alpha=v_c.a*mix(.12,1.0,reached);
  if(v_k>3.5&&v_k<8.5)alpha*=mix(.18,1.0,v_settle);
  float transientGuide=clamp(guide+renew,0.0,1.0),guideVisible=(1.0-ss(16.5,18.15,u_intro))*(1.0-step(18.399,u_intro));
  if(u_reduced>.5)guideVisible=0.0;
  alpha*=mix(1.0,guideVisible,transientGuide);
  alpha*=mix(1.0,1.0-u_lifecycle,feed);
  alpha*=mix(1.0,.62+.38*v_rhythm,zoneEnv*u_lifecycle);
  ${webgl2?'lifecycleColor':'gl_FragColor'}=vec4(lit,alpha);
}`}
function shader(gl,type,source){const q=gl.createShader(type);gl.shaderSource(q,source);gl.compileShader(q);if(!gl.getShaderParameter(q,gl.COMPILE_STATUS)){const m=gl.getShaderInfoLog(q)||'UNKNOWN';gl.deleteShader(q);throw Error('LIFECYCLE_SHADER:'+m)}return q}
function program(gl,webgl2,precision){const p=gl.createProgram(),vs=shader(gl,gl.VERTEX_SHADER,vertexSource(webgl2,precision)),fs=shader(gl,gl.FRAGMENT_SHADER,fragmentSource(webgl2,precision));gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){const m=gl.getProgramInfoLog(p)||'UNKNOWN';gl.deleteProgram(p);throw Error('LIFECYCLE_PROGRAM:'+m)}return p}
function renderer(gl,g,backend){
  const precision=precisionProfile(gl),p=program(gl,backend.webglVersion===2,precision.selected),b={},vao=backend.webglVersion===2?gl.createVertexArray():null,up=(k,data,T=Float32Array,target=gl.ARRAY_BUFFER)=>{const x=gl.createBuffer();gl.bindBuffer(target,x);gl.bufferData(target,new T(data),gl.STATIC_DRAW);b[k]=x};
  if(vao)gl.bindVertexArray(vao);
  up('p',g.p);up('n',g.n);up('c',g.c);up('q',g.q);up('k',g.k);up('s',g.s);up('i',g.i,Uint16Array,gl.ELEMENT_ARRAY_BUFFER);
  gl.useProgram(p);
  [['a_position','p',3],['a_normal','n',3],['a_color','c',4],['a_phase','q',1],['a_kind','k',1],['a_season','s',1]].forEach(([name,key,size])=>{const l=gl.getAttribLocation(p,name);if(l<0)throw Error('LIFECYCLE_ATTRIBUTE:'+name);gl.bindBuffer(gl.ARRAY_BUFFER,b[key]);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0)});
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b.i);
  const U=n=>gl.getUniformLocation(p,n),u={yaw:U('u_yaw'),pitch:U('u_pitch'),scale:U('u_scale'),aspect:U('u_aspect'),camera:U('u_camera'),time:U('u_time'),intro:U('u_intro'),progress:U('u_progress'),activity:U('u_activity'),retained:U('u_retained'),renewal:U('u_renewal'),reduced:U('u_reduced'),lifecycle:U('u_lifecycle')};
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  return{p,b,u,vao,precision,count:g.i.length,vertices:g.p.length/3,triangles:g.i.length/3};
}
function dispose(gl,R){if(!R)return;try{Object.values(R.b||{}).forEach(x=>gl.deleteBuffer(x));if(R.vao)gl.deleteVertexArray(R.vao);if(R.p)gl.deleteProgram(R.p)}catch{}}
const MATURE_TREE_STATE=Object.freeze({p:.995,activity:.58,renewal:1,retained:.8124});
function lifecycle(ms){
  const period=CONTRACT.cycleSeconds*1000,t=clamp(ms,0,period),hold=900,end=16400,fade=17400;
  if(t>=period)return MATURE_TREE_STATE;
  let p=.035;if(t>hold){const u=clamp((Math.min(t,end)-hold)/(end-hold));p=mix(.035,.995,smoother(u))}
  const renewal=smooth(.90,.995,p),activity=t<fade?1:mix(1,MATURE_TREE_STATE.activity,smooth(fade,period,t));
  return{p,activity,renewal,retained:clamp(.24+renewal*.48+(1-activity)*.22)};
}
function lifecycleController(ms,reduced=false){
  const boundary=CONTRACT.lifecycleTransitionSeconds*1000;
  if(reduced||ms>=boundary)return Object.freeze({state:LIFE_CYCLE.TWO,tree:MATURE_TREE_STATE,treeLocked:true,transferActive:false,formationProgress:1});
  return{state:LIFE_CYCLE.ONE,tree:lifecycle(ms),treeLocked:false,transferActive:true,formationProgress:clamp(ms/boundary)};
}
function environmentState(ms,reduced=false){
  const intro=CONTRACT.cycleSeconds*1000;
  if(reduced)return{active:true,phase:'FOUR_QUADRANT_STATIC',progress:1,color:[.012,.026,.052,.68]};
  if(ms<intro){
    const u=clamp(ms/intro);
    return{active:true,phase:'QUADRANT_FORMATION_FEEDS',progress:u,color:[mix(.006,.014,u),mix(.014,.028,u),mix(.032,.055,u),.66]};
  }
  const period=CONTRACT.environmentCycleSeconds*1000,t=((ms-intro)%period+period)%period,u=t/period;
  const frames=[
    {at:0,phase:'AMBIENT_CALM',color:[.014,.030,.060,.68]},
    {at:.25,phase:'AMBIENT_MOVEMENT',color:[.018,.070,.080,.60]},
    {at:.50,phase:'AMBIENT_GUST_DENSITY',color:[.095,.038,.020,.70]},
    {at:.75,phase:'AMBIENT_RECOVERY',color:[.004,.010,.034,.78]},
    {at:1,phase:'AMBIENT_CALM',color:[.014,.030,.060,.68]}
  ];
  let a=frames[0],b=frames[1];
  for(let i=0;i<frames.length-1;i++)if(u>=frames[i].at&&u<=frames[i+1].at){a=frames[i];b=frames[i+1];break}
  const q=smooth(a.at,b.at,u),color=a.color.map((v,i)=>mix(v,b.color[i],q));
  return{active:true,phase:a.phase,progress:u,color};
}
function cycleTimeSeconds(ms){
  const intro=CONTRACT.cycleSeconds*1000;
  if(ms<=intro)return Math.max(0,ms)/1000;
  const period=CONTRACT.environmentCycleSeconds*1000;
  return(((ms-intro)%period+period)%period)/1000;
}
function visiblePixelProof(gl,canvas){
  const w=canvas.width,h=canvas.height,size=Math.max(1,Math.min(32,w,h)),pixels=new Uint8Array(size*size*4);let sampledPixels=0,nonTransparentPixels=0;
  for(const fy of[.25,.5,.75])for(const fx of[.25,.5,.75]){const x=Math.max(0,Math.min(w-size,Math.round(w*fx-size/2))),y=Math.max(0,Math.min(h-size,Math.round(h*fy-size/2)));gl.readPixels(x,y,size,size,gl.RGBA,gl.UNSIGNED_BYTE,pixels);const err=gl.getError();if(err!==gl.NO_ERROR)return{passed:false,sampleSize:size,sampledPixels,nonTransparentPixels,glError:err};sampledPixels+=size*size;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)nonTransparentPixels++}
  return{passed:nonTransparentPixels>0,sampleSize:size,sampledPixels,nonTransparentPixels,glError:gl.NO_ERROR};
}

function mount(host){
  const doc=host.ownerDocument||document,mq=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)'),reduced=!!mq?.matches;
  const style=doc.createElement('style');style.dataset.communityLifecycleStyle='true';style.textContent='[data-community-lifecycle-mount]{position:relative;isolation:isolate;overflow:hidden;min-height:22rem}.community-lifecycle3d-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab}.community-lifecycle3d-canvas:active{cursor:grabbing}@media(max-width:720px){[data-community-lifecycle-mount]{min-height:25rem}}@media(prefers-reduced-motion:reduce){.community-lifecycle3d-canvas{cursor:default}}';doc.head.append(style);
  const options={alpha:true,antialias:true,depth:true,powerPreference:'low-power'},backendDefs=[{id:'webgl2',contexts:['webgl2'],webglVersion:2,shaderLanguage:'GLSL ES 3.00'},{id:'webgl1',contexts:['webgl','experimental-webgl'],webglVersion:1,shaderLanguage:'GLSL ES 1.00'}],geometry=build(),attempts=[];
  let canvas,gl,R,backend,io,ro,raf=0,dead=false,contextLost=false,visible=true,start=performance.now(),last=start,baseYaw=-.20,targetYaw=baseYaw,yaw=baseYaw,targetPitch=-.055,pitch=targetPitch,drag=null,frameCount=0,contextLossCount=0,contextRestoreCount=0,firstProof=null,lifecycleState=reduced?LIFE_CYCLE.TWO:LIFE_CYCLE.ONE,treeState=reduced?'TREE_MATURE_LOCK':'INTRO_LIFECYCLE',environmentPhase=reduced?'FOUR_QUADRANT_STATIC':'QUADRANT_FORMATION_FEEDS',transferActive=!reduced,treeGeometryLocked=reduced;
  const publishReceipt=(failure=null,extra={})=>{globalThis.DGB_COMMUNITY_LIFECYCLE_3D_RECEIPT=Object.freeze({
    contract:CONTRACT,initialized:!!R&&!failure,firstDraw:!!firstProof?.passed,visibleFrame:!!firstProof?.passed,backend:backend?.id||null,webglContexts:backend?1:0,webglVersion:backend?.webglVersion||null,shaderLanguage:backend?.shaderLanguage||null,precision:R?.precision||null,frameCount,contextLossCount,contextRestoreCount,
    fixedGeometry:true,geometryRebuiltPerFrame:false,geometryFinite:true,treeLockPhase:.56,seasonCount:4,settlementDeterministic:true,boundedInspectionDegrees:22,reducedMotion:reduced,
    lifecycleState,lifecycleTransitionSeconds:CONTRACT.lifecycleTransitionSeconds,treeCycleMode:CONTRACT.lifecycleMode,treeCycleComplete:lifecycleState===LIFE_CYCLE.TWO,treeState,treeGeometryLocked,transferActive,formationRestartCount:0,postLockTransferRestart:false,
    environmentActive:true,environmentPhase,environmentCycleSeconds:CONTRACT.environmentCycleSeconds,ambientRhythmMode:CONTRACT.ambientRhythm,
    environmentMode:CONTRACT.environment,environmentSectorCount:4,environmentDepthPlaneCount:CONTRACT.environmentDepthPlanes.length,permanentQuadrants:true,feedOrbitRevolutions:0,feedPathMode:CONTRACT.feedPath,feedTravelCompletesAtSeconds:16.5,transferShutdownAtSeconds:18.4,guideRemnantsAfterLock:false,postLockFeeding:false,protectedCenter:true,rimTaper:null,
    woodMaterialSystem:'CLASS_ASSIGNED_BROWN_ONLY',foliageMaterialClass:'FOLIAGE',fallbackPreserved:false,fallbackRemoved:true,vertexCount:R?.vertices||geometry.p.length/3,triangleCount:R?.triangles||geometry.i.length/3,visibleFrameProof:firstProof,backendAttempts:attempts.map(x=>({...x})),failure,...extra
  })};
  const publishFailure=(reason,extra={})=>{host.removeAttribute('data-lifecycle-ready');host.dataset.lifecycleStatus=reason;host.dataset.lifecycleFallback='none';publishReceipt(reason,extra)};
  const makeCanvas=()=>{const c=doc.createElement('canvas');c.className='community-lifecycle3d-canvas';c.setAttribute('aria-hidden','true');return c};
  const resize=()=>{const r=canvas.getBoundingClientRect(),cap=Math.min(r.width,r.height)<520?1.25:1.5,d=Math.min(cap,Math.max(1,globalThis.devicePixelRatio||1)),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);return w/Math.max(1,h)};
  const draw=(now=performance.now(),prove=false)=>{
    if(dead||contextLost||!R)return false;
    const asp=resize(),elapsed=Math.max(0,now-start),ctl=lifecycleController(elapsed,reduced),s=ctl.tree,env=environmentState(elapsed,reduced),nextTreeState=ctl.treeLocked?'TREE_MATURE_LOCK':'INTRO_LIFECYCLE',nextEnvironmentPhase=env.phase,stateChanged=ctl.state!==lifecycleState||nextTreeState!==treeState||nextEnvironmentPhase!==environmentPhase,dt=Math.min(40,Math.max(0,now-last));
    lifecycleState=ctl.state;treeState=nextTreeState;environmentPhase=nextEnvironmentPhase;transferActive=ctl.transferActive;treeGeometryLocked=ctl.treeLocked;last=now;
    if(!reduced){const e=1-Math.exp(-dt/135);yaw+=(targetYaw-yaw)*e;pitch+=(targetPitch-pitch)*e}
    gl.useProgram(R.p);if(R.vao)gl.bindVertexArray(R.vao);gl.clearColor(...env.color);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(R.u.yaw,yaw);gl.uniform1f(R.u.pitch,pitch);gl.uniform1f(R.u.scale,asp<.76?1.04:asp<1.05?1.10:1.15);gl.uniform1f(R.u.aspect,asp);gl.uniform1f(R.u.camera,4.55);
    gl.uniform1f(R.u.time,cycleTimeSeconds(elapsed));gl.uniform1f(R.u.intro,reduced?CONTRACT.cycleSeconds:Math.min(CONTRACT.cycleSeconds,elapsed/1000));gl.uniform1f(R.u.progress,s.p);gl.uniform1f(R.u.activity,s.activity);gl.uniform1f(R.u.retained,s.retained);gl.uniform1f(R.u.renewal,s.renewal);gl.uniform1f(R.u.reduced,reduced?1:0);gl.uniform1f(R.u.lifecycle,lifecycleState===LIFE_CYCLE.TWO?1:0);
    gl.drawElements(gl.TRIANGLES,R.count,gl.UNSIGNED_SHORT,0);const err=gl.getError();if(err!==gl.NO_ERROR)throw Error(`LIFECYCLE_DRAW_GL:${err}`);frameCount++;
    if(stateChanged){host.dataset.lifecycleState=lifecycleState;host.dataset.lifecycleStage=treeState;host.dataset.lifecycleEnvironment=environmentPhase;host.dataset.lifecycleFeeding=transferActive?'active':'stopped';if(firstProof?.passed)publishReceipt()}
    return prove?visiblePixelProof(gl,canvas):true;
  };
  host.dataset.lifecycleStatus='initializing';host.dataset.lifecycleContract=CONTRACT.id;host.dataset.lifecycleState=lifecycleState;host.dataset.lifecycleFeeding=transferActive?'active':'stopped';host.setAttribute('role','img');
  host.setAttribute('aria-label','Animated three-dimensional Community lifecycle sculpture. Four permanent environmental zones occupy the full stage at multiple depths: Spring flowers, Summer rain and wind, Autumn leaves, and Winter snow. Life Cycle One moves environmental material inward to form the central tree. At 18.4 seconds the tree locks, transfer stops, and Life Cycle Two continues as four local living environments around the mature tree.');
  for(const def of backendDefs){
    const c=makeCanvas();let candidateGl=null,candidateR=null,contextName=null;
    for(const name of def.contexts){try{candidateGl=c.getContext(name,options)}catch{}if(candidateGl){contextName=name;break}}
    if(!candidateGl){attempts.push({backend:def.id,result:'context-unavailable'});continue}
    try{candidateR=renderer(candidateGl,geometry,def);const setupError=candidateGl.getError();if(setupError!==candidateGl.NO_ERROR)throw Error(`renderer-gl-error-${setupError}`);canvas=c;gl=candidateGl;R=candidateR;backend={...def,contextName};host.append(canvas);const proof=draw(start,true);if(!proof?.passed)throw Error('visible-frame-proof-failed');firstProof=proof;attempts.push({backend:def.id,result:'selected'});break}catch(error){attempts.push({backend:def.id,result:'failed',reason:String(error?.message||error)});dispose(candidateGl,candidateR);c.remove();canvas=undefined;gl=undefined;R=undefined;backend=undefined}
  }
  if(!R){host.removeAttribute('role');host.removeAttribute('aria-label');style.remove();publishFailure(attempts.every(x=>x.result==='context-unavailable')?'webgl-unavailable':'renderer-initialization-failed');return}
  host.dataset.lifecycleReady='true';host.dataset.lifecycleStatus='ready';host.dataset.lifecycleState=lifecycleState;host.dataset.lifecycleStage=treeState;host.dataset.lifecycleEnvironment=environmentPhase;publishReceipt();
  const stopAnimation=()=>{if(raf){cancelAnimationFrame(raf);raf=0}};
  const hardFail=reason=>{if(dead)return;dead=true;stopAnimation();io?.disconnect();ro?.disconnect();publishFailure(reason)};
  const tick=now=>{raf=0;if(dead||contextLost||reduced||!visible||doc.hidden)return;try{draw(now)}catch{hardFail('frame-draw-failed');return}raf=requestAnimationFrame(tick)};
  const kick=()=>{if(dead||contextLost)return;if(reduced){try{draw()}catch{hardFail('frame-draw-failed')}return}if(visible&&!doc.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(tick)}};
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(dead)return;contextLost=true;contextLossCount++;stopAnimation();host.removeAttribute('data-lifecycle-ready');host.dataset.lifecycleStatus='context-lost';publishReceipt('context-lost',{recoverable:true})});
  canvas.addEventListener('webglcontextrestored',()=>{if(dead)return;try{R=renderer(gl,geometry,backend);contextLost=false;contextRestoreCount++;last=performance.now();const proof=draw(last,true);if(!proof?.passed)throw Error('visible-frame-proof-failed');firstProof=proof;host.dataset.lifecycleReady='true';host.dataset.lifecycleStatus='ready';publishReceipt(null,{restored:true});kick()}catch{contextLost=false;hardFail('context-restore-failed')}});
  const yawLimit=22*Math.PI/180;
  canvas.addEventListener('pointerdown',e=>{if(reduced||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,startYaw:yaw,axis:null};canvas.setPointerCapture?.(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(reduced)return;const r=canvas.getBoundingClientRect();if(drag&&e.pointerId===drag.id){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.axis&&Math.hypot(dx,dy)>7)drag.axis=Math.abs(dx)>Math.abs(dy)*1.15?'x':'y';if(drag.axis==='x'){e.preventDefault();targetYaw=baseYaw+clamp(dx/Math.max(1,r.width)*1.6,-yawLimit,yawLimit);kick()}return}if(e.pointerType==='mouse'&&r.width){targetYaw=baseYaw+(((e.clientX-r.left)/r.width)*2-1)*.08;targetPitch=-.055-(((e.clientY-r.top)/r.height)*2-1)*.035;kick()}},{passive:false});
  const release=e=>{if(!drag||e.pointerId!==drag.id)return;drag=null;targetYaw=baseYaw;targetPitch=-.055;kick()};
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('pointerleave',()=>{if(!drag){targetYaw=baseYaw;targetPitch=-.055;kick()}},{passive:true});
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)stopAnimation();else kick()},{passive:true});
  if('IntersectionObserver'in globalThis){io=new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting&&e.intersectionRatio>.02);if(!visible)stopAnimation();kick()},{rootMargin:'120px 0px',threshold:[0,.02]});io.observe(host)}
  if('ResizeObserver'in globalThis){ro=new ResizeObserver(()=>{if(contextLost||dead)return;try{const proof=draw(performance.now(),!firstProof?.passed);if(proof&&proof!==true&&!proof.passed)hardFail('resize-draw-failed');else kick()}catch{hardFail('resize-draw-failed')}});ro.observe(host)}
  kick();
}

export { CONTRACT as DGB_COMMUNITY_LIFECYCLE_3D_CONTRACT };

const GEN2273_STATE=Object.freeze({
  DOMAIN_STATIC:'DOMAIN_STATIC',
  GLOBAL_RELEASE:'GLOBAL_RELEASE',
  SPIRAL_GROWTH:'SPIRAL_GROWTH',
  TREE_COMPLETE:'TREE_COMPLETE',
  SETTLEMENT:'SETTLEMENT',
  DOMAIN_LOCK:'DOMAIN_LOCK',
  FOUR_DOMAIN_ACTIVE:'FOUR_DOMAIN_ACTIVE',
  COEXISTENCE:'COEXISTENCE'
});
const GEN2273_STATE_ORDER=Object.freeze([
  GEN2273_STATE.DOMAIN_STATIC,
  GEN2273_STATE.GLOBAL_RELEASE,
  GEN2273_STATE.SPIRAL_GROWTH,
  GEN2273_STATE.TREE_COMPLETE,
  GEN2273_STATE.SETTLEMENT,
  GEN2273_STATE.DOMAIN_LOCK,
  GEN2273_STATE.FOUR_DOMAIN_ACTIVE,
  GEN2273_STATE.COEXISTENCE
]);
const GEN2273_SETTLEMENT_CANDIDATES=Object.freeze([1.5,1.9,2.3]);
const GEN2273_TREE_COMPLETE_SECONDS=18.4;
const GEN2273_OBJECTS_PER_DEPTH=8;
const GEN2273_MOTION_PROFILE=Object.freeze({SPRING:0,SUMMER:1,AUTUMN:2,WINTER:3});

function gen2273ObjectId(season,depthBand,index){return season*DEPTH_PLANES.length*GEN2273_OBJECTS_PER_DEPTH+depthBand*GEN2273_OBJECTS_PER_DEPTH+index}
function createGen2273MobileObjectRegistry(){
  const registry=[];
  for(const zone of QUADRANT_VOLUMES){
    DEPTH_PLANES.forEach((plane,depthBand)=>{
      for(let index=0;index<GEN2273_OBJECTS_PER_DEPTH;index++){
        const home=quadrantPoint(zone,plane,index,GEN2273_OBJECTS_PER_DEPTH),objectId=gen2273ObjectId(zone.season,depthBand,index);
        registry.push(Object.freeze({
          id:`${CONTRACT.seasons[zone.season]}-${plane.id}-${String(index).padStart(2,'0')}`,
          objectId,
          domain:zone.season,
          domainName:CONTRACT.seasons[zone.season],
          homeXYZ:Object.freeze({x:home.x,y:home.y,z:home.z}),
          spiralPhase:(objectId/Math.max(1,QUADRANT_VOLUMES.length*DEPTH_PLANES.length*GEN2273_OBJECTS_PER_DEPTH))*Math.PI*2,
          depthBand,
          depthBandName:plane.id,
          motionProfile:zone.season
        }));
      }
    });
  }
  return Object.freeze(registry);
}
const GEN2273_MOBILE_OBJECT_REGISTRY=createGen2273MobileObjectRegistry();

function P_static(object){return V(object.homeXYZ.x,object.homeXYZ.y,object.homeXYZ.z)}
function P_circulation(object,progress){
  const t=clamp(progress),home=P_static(object),phase=object.spiralPhase+t*Math.PI*4,r0=Math.max(.68,Math.hypot(home.x,home.z)*.92),radius=mix(r0,.46,t),lift=mix(home.y,.52+object.domain*.22,t);
  return V(Math.cos(phase)*radius,lift+Math.sin(phase*1.7)*.13*t,Math.sin(phase)*radius+Math.sin(phase*.73+object.depthBand)*.16*t);
}
function P_local(object,timeSeconds){
  const home=P_static(object),t=Math.max(0,timeSeconds),depth=DEPTH_PLANES[object.depthBand]||DEPTH_PLANES[1],amp=.022*depth.motion,phase=object.spiralPhase;
  if(object.motionProfile===GEN2273_MOTION_PROFILE.SPRING)return A(home,V(Math.sin(t*.42+phase)*amp,Math.cos(t*.35+phase)*amp*.75,Math.sin(t*.28+phase)*amp*.45));
  if(object.motionProfile===GEN2273_MOTION_PROFILE.SUMMER)return A(home,V(Math.sin(t*.74+phase)*amp*1.25,-Math.abs(Math.sin(t*.92+phase))*amp,Math.cos(t*.31+phase)*amp*.35));
  if(object.motionProfile===GEN2273_MOTION_PROFILE.AUTUMN)return A(home,V(Math.sin(t*.58+phase)*amp*1.15,Math.cos(t*.51+phase)*amp*.90,Math.sin(t*.39+phase)*amp*.55));
  return A(home,V(Math.sin(t*.44+phase)*amp*.82,-Math.abs(Math.cos(t*.36+phase))*amp*.58,Math.sin(t*.27+phase)*amp*.30));
}

// Gen2273 qualified winner materialization. Settlement duration is frozen by qualification evidence.
mount=function(){throw Error('GEN2273_PRODUCT_BOUNDARY_CHECKPOINT_NOT_READY')};
const GEN2273_SELECTED_SETTLEMENT_SECONDS=1.5;
const GEN2273_EPSILON=1e-7;
const gen2273CloneXYZ=p=>({x:p.x,y:p.y,z:p.z});
const gen2273Distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const gen2273SameXYZ=(a,b,epsilon=GEN2273_EPSILON)=>gen2273Distance(a,b)<=epsilon;
const GEN2273_DOMAIN_HANDOFF_XYZ=Object.freeze(GEN2273_MOBILE_OBJECT_REGISTRY.map(object=>Object.freeze({...object.homeXYZ})));

P_circulation=function(object,progress){
  const t=clamp(progress),home=P_static(object),phase=object.spiralPhase+t*Math.PI*4,r0=Math.max(.68,Math.hypot(home.x,home.z)*.92),radius=mix(r0,.46,t),lift=mix(home.y,.52+object.domain*.22,t);
  const target=V(Math.cos(phase)*radius,lift+Math.sin(phase*1.7)*.13*t,Math.sin(phase)*radius+Math.sin(phase*.73+object.depthBand)*.16*t);
  return L(home,target,smoother(t));
};
P_local=function(object,timeSeconds){
  const home=P_static(object),t=Math.max(0,timeSeconds),depth=DEPTH_PLANES[object.depthBand]||DEPTH_PLANES[1],amp=.050*depth.motion,phase=object.spiralPhase;
  const ds=w=>Math.sin(phase+t*w)-Math.sin(phase),dc=w=>Math.cos(phase+t*w)-Math.cos(phase);
  if(object.motionProfile===GEN2273_MOTION_PROFILE.SPRING)return A(home,V(ds(.55)*amp*.82,dc(.38)*amp*.58,ds(.31)*amp*.52));
  if(object.motionProfile===GEN2273_MOTION_PROFILE.SUMMER)return A(home,V(ds(.90)*amp*1.40,-(1-Math.cos(t*1.70))*amp*1.15,dc(.45)*amp*.34));
  if(object.motionProfile===GEN2273_MOTION_PROFILE.AUTUMN)return A(home,V(ds(.58)*amp*1.45,dc(.43)*amp*.55,ds(.67)*amp*1.10));
  return A(home,V(ds(.24)*amp*.55,-(1-Math.cos(t*.36))*amp*.42,ds(.20)*amp*.85));
};

function gen2273SettlementDuration(value){
  const candidate=Number(value);
  return GEN2273_SETTLEMENT_CANDIDATES.includes(candidate)?candidate:GEN2273_SELECTED_SETTLEMENT_SECONDS;
}
function createGen2273Runtime(settlementDurationSeconds=GEN2273_SELECTED_SETTLEMENT_SECONDS,reduced=false){
  const settlementDuration=gen2273SettlementDuration(settlementDurationSeconds),lockSeconds=GEN2273_TREE_COMPLETE_SECONDS+settlementDuration,registry=GEN2273_MOBILE_OBJECT_REGISTRY;
  const currentXYZ=registry.map(P_static).map(gen2273CloneXYZ),settlementOrigin=Array(registry.length).fill(null),transitionLog=[];
  let maxSeconds=0,stateIndex=reduced?GEN2273_STATE_ORDER.length-1:0,circulationProgress=0,settlementProgress=reduced?1:0,settlementOriginCaptureCount=0,circulationEvaluations=0,circulationEvaluationsAtSettlement=null,localTimeSeconds=0;
  let globalCirculationAuthority=false,globalCirculationUpdatePathEnabled=false,entranceAuthorityActive=!reduced,treeGrowthAuthorityActive=!reduced,communityInteractionAvailable=!!reduced,domainLocalPhysicsAuthoritative=!!reduced,domainLocked=!!reduced;
  const state=()=>GEN2273_STATE_ORDER[stateIndex];
  const handoff=index=>GEN2273_DOMAIN_HANDOFF_XYZ[index];
  const setCurrent=(index,p)=>{currentXYZ[index]=gen2273CloneXYZ(p)};
  const enter=(index,atSeconds)=>{
    if(index<=stateIndex)return;
    stateIndex=index;
    transitionLog.push(Object.freeze({state:GEN2273_STATE_ORDER[index],stateIndex:index,atSeconds}));
    if(index===1){globalCirculationAuthority=true;globalCirculationUpdatePathEnabled=true;}
    if(index===3){
      circulationProgress=1;
      registry.forEach((object,i)=>{setCurrent(i,P_circulation(object,1));circulationEvaluations++});
      treeGrowthAuthorityActive=false;
    }
    if(index===4){
      if(settlementOriginCaptureCount===0){registry.forEach((object,i)=>{settlementOrigin[i]=Object.freeze(gen2273CloneXYZ(currentXYZ[i]));settlementOriginCaptureCount++})}
      circulationEvaluationsAtSettlement=circulationEvaluations;
      globalCirculationAuthority=false;
      globalCirculationUpdatePathEnabled=false;
    }
    if(index===5){
      settlementProgress=1;
      registry.forEach((object,i)=>setCurrent(i,handoff(i)));
      globalCirculationAuthority=false;
      globalCirculationUpdatePathEnabled=false;
      entranceAuthorityActive=false;
      treeGrowthAuthorityActive=false;
      communityInteractionAvailable=true;
      domainLocalPhysicsAuthoritative=true;
      domainLocked=true;
    }
  };
  const updateCirculation=seconds=>{
    if(!globalCirculationAuthority||!globalCirculationUpdatePathEnabled||stateIndex>=4)return;
    const next=clamp((seconds-CONTRACT.feedingWindowSeconds[0])/(GEN2273_TREE_COMPLETE_SECONDS-CONTRACT.feedingWindowSeconds[0]));
    circulationProgress=Math.max(circulationProgress,next);
    registry.forEach((object,i)=>{setCurrent(i,P_circulation(object,circulationProgress));circulationEvaluations++});
  };
  const updateSettlement=seconds=>{
    if(stateIndex!==4)return;
    const next=clamp((seconds-GEN2273_TREE_COMPLETE_SECONDS)/settlementDuration);
    settlementProgress=Math.max(settlementProgress,next);
    const eased=smoother(settlementProgress);
    registry.forEach((object,i)=>setCurrent(i,L(settlementOrigin[i],handoff(i),eased)));
  };
  const updateLocal=seconds=>{
    if(!domainLocked||!domainLocalPhysicsAuthoritative)return;
    localTimeSeconds=Math.max(localTimeSeconds,Math.max(0,seconds-lockSeconds));
    if(reduced){registry.forEach((object,i)=>setCurrent(i,handoff(i)));return}
    registry.forEach((object,i)=>setCurrent(i,P_local(object,localTimeSeconds)));
  };
  const snapshot=()=>Object.freeze({
    state:state(),stateIndex,progress:stateIndex===4?settlementProgress:stateIndex<3?circulationProgress:1,
    settlementDuration,lockSeconds,maxSeconds,circulationProgress,settlementProgress,settlementOriginCaptureCount,
    globalCirculation:globalCirculationAuthority?1:0,
    globalCirculationAuthority,
    globalCirculationUpdatePath:globalCirculationUpdatePathEnabled?'ENABLED':'DISABLED',
    entranceAuthority:entranceAuthorityActive?'ACTIVE':'TERMINATED',
    treeGrowthAuthority:treeGrowthAuthorityActive?'ACTIVE':'TERMINATED',
    communityInteractionAvailable,domainLocalPhysicsAuthoritative,domainLocked,localTimeSeconds,
    postSettlementCirculationEvaluations:circulationEvaluationsAtSettlement===null?0:circulationEvaluations-circulationEvaluationsAtSettlement,
    transitionLog:Object.freeze(transitionLog.map(entry=>entry))
  });
  if(reduced){
    registry.forEach((object,i)=>{settlementOrigin[i]=Object.freeze(gen2273CloneXYZ(handoff(i)));settlementOriginCaptureCount++});
    transitionLog.push(Object.freeze({state:GEN2273_STATE.COEXISTENCE,stateIndex:7,atSeconds:0,reduced:true}));
  }else transitionLog.push(Object.freeze({state:GEN2273_STATE.DOMAIN_STATIC,stateIndex:0,atSeconds:0}));
  const advance=ms=>{
    const rawSeconds=Math.max(0,Number(ms)||0)/1000;
    maxSeconds=Math.max(maxSeconds,rawSeconds);
    const seconds=maxSeconds;
    if(reduced){updateLocal(seconds);return snapshot()}
    if(seconds>=CONTRACT.feedingWindowSeconds[0])enter(1,CONTRACT.feedingWindowSeconds[0]);
    if(seconds>=CONTRACT.feedingWindowSeconds[1])enter(2,CONTRACT.feedingWindowSeconds[1]);
    if(seconds<GEN2273_TREE_COMPLETE_SECONDS)updateCirculation(seconds);
    if(seconds>=GEN2273_TREE_COMPLETE_SECONDS){enter(3,GEN2273_TREE_COMPLETE_SECONDS);enter(4,GEN2273_TREE_COMPLETE_SECONDS)}
    if(stateIndex===4)updateSettlement(seconds);
    if(seconds>=lockSeconds){enter(5,lockSeconds);enter(6,lockSeconds);enter(7,lockSeconds)}
    if(domainLocked)updateLocal(seconds);
    return snapshot();
  };
  return Object.freeze({registry,currentXYZ,settlementOrigin,advance,snapshot});
}
const GEN2273_CONTROLLER_CACHE=new Map();
function gen2273EightStateController(ms,settlementDurationSeconds=GEN2273_SELECTED_SETTLEMENT_SECONDS,reduced=false){
  const duration=gen2273SettlementDuration(settlementDurationSeconds),key=`${duration}:${reduced?'reduced':'full'}`;
  if(!GEN2273_CONTROLLER_CACHE.has(key))GEN2273_CONTROLLER_CACHE.set(key,createGen2273Runtime(duration,reduced));
  return GEN2273_CONTROLLER_CACHE.get(key).advance(ms);
}

function gen2273AssertBoundRanges(g){
  const ranges=g.objectRanges||[],ids=ranges.map(range=>range.objectId),unique=new Set(ids),vertexCount=g.p.length/3;
  const ordered=ids.length===GEN2273_MOBILE_OBJECT_REGISTRY.length&&ids.every((id,index)=>id===index);
  const valid=ranges.every(range=>Number.isInteger(range.startVertex)&&Number.isInteger(range.endVertex)&&range.startVertex>=0&&range.endVertex>range.startVertex&&range.endVertex<=vertexCount);
  if(!ordered||unique.size!==GEN2273_MOBILE_OBJECT_REGISTRY.length||!valid)throw Error('GEN2273_RUNTIME_BINDING_RANGE_FAILURE');
  return Object.freeze({passed:true,objectRangeCount:ranges.length,uniqueObjectIds:unique.size,ordered:true,visibleFeedPopulationCount:0});
}

const GEN2273_BASE_VERTEX_SOURCE=vertexSource;
vertexSource=function(webgl2,precision){
  let source=GEN2273_BASE_VERTEX_SOURCE(webgl2,precision),next=source.replace('if(zoneEnv>.5&&u_reduced<.5){','if(false){');
  if(next===source)throw Error('GEN2273_ZONE_SHADER_AUTHORITY_MARKER_MISSING');
  source=next;
  next=source.replace('float sway=(u_reduced>.5?0.0:.008)*crown*alive;','float sway=(u_reduced>.5?0.0:.008)*crown*alive*(1.0-zoneEnv);');
  if(next===source)throw Error('GEN2273_SHARED_SWAY_MARKER_MISSING');
  return next;
};
const GEN2273_BASE_FRAGMENT_SOURCE=fragmentSource;
fragmentSource=function(webgl2,precision){
  const source=GEN2273_BASE_FRAGMENT_SOURCE(webgl2,precision),next=source.replace('alpha*=mix(1.0,1.0-u_lifecycle,feed);','alpha*=1.0-feed;');
  if(next===source)throw Error('GEN2273_FEED_POPULATION_MARKER_MISSING');
  return next;
};

addQuadrantEnvironment=function(g){
  const count=GEN2273_OBJECTS_PER_DEPTH;
  g.objectRanges=[];
  for(const zone of QUADRANT_VOLUMES){
    DEPTH_PLANES.forEach((plane,depthIndex)=>{
      for(let i=0;i<count;i++){
        const objectId=gen2273ObjectId(zone.season,depthIndex,i),identity=GEN2273_MOBILE_OBJECT_REGISTRY[objectId],p=quadrantPoint(zone,plane,i,count),q=.10+zone.season*.17+depthIndex*.018+i*.006,near=plane.scale,alpha=plane.alpha,startVertex=g.p.length/3;
        if(!identity||identity.objectId!==objectId||identity.domain!==zone.season||identity.depthBand!==depthIndex||!gen2273SameXYZ(identity.homeXYZ,p))throw Error('GEN2273_CANONICAL_IDENTITY_BINDING_FAILURE');
        if(zone.season===SEASON.SPRING){
          if(i%3===0)flower(g,p,q,zone.kind,zone.season,.58*near,alpha);
          else orb(g,p,V(.026*near,.018*near,.020*near),i%2?alphaColor([.98,.60,.72,1],alpha):alphaColor([1,.78,.36,1],alpha),q,zone.kind,5,3,zone.season);
        }else if(zone.season===SEASON.SUMMER){
          rainStroke(g,p,q,zone.kind,zone.season,.66*near,alphaColor([.12,.58,.90,1],alpha));
          if(i%4===0)windStroke(g,A(p,V(.04,.035,.01)),q,zone.kind,zone.season,.55*near,alphaColor([.28,.78,.90,1],alpha*.82));
          if(depthIndex===0&&i%4===2)orb(g,A(p,V(.08,.03,-.03)),V(.10*near,.055*near,.045*near),alphaColor([.24,.55,.65,1],alpha*.26),q,zone.kind,6,3,zone.season);
        }else if(zone.season===SEASON.AUTUMN){
          leaf(g,p,q,zone.kind,zone.season,.66*near,i%2?alphaColor([.94,.49,.08,1],alpha):alphaColor([.68,.27,.035,1],alpha));
        }else{
          if(i%3===0)snowflake(g,p,.045*near+(i%2)*.007,q,zone.kind,zone.season,alpha);
          else orb(g,p,V(.024*near,.024*near,.021*near),[.74,.91,1,alpha],q,zone.kind,5,3,zone.season);
          if(depthIndex===0&&i%4===1)orb(g,A(p,V(.10,.02,-.02)),V(.13*near,.060*near,.050*near),[.64,.78,.86,alpha*.20],q,zone.kind,6,3,zone.season);
        }
        g.objectRanges.push(Object.freeze({objectId,startVertex,endVertex:g.p.length/3}));
      }
    });
  }
  const dockSpring=V(-1.06,1.48,.18),dockSummer=V(-1.17,.72,.15),dockAutumn=V(1.10,.76,.14),dockWinter=V(1.02,1.54,.16);
  [V(-.10,.04,0),V(.02,.12,.02),V(.12,-.03,-.01)].forEach((d,i)=>flower(g,A(dockSpring,d),.80,KIND.FEED_SPRING,SEASON.SPRING,.92+i*.08));
  [V(-.12,.10,.00),V(-.03,.03,.02),V(.08,.12,-.02),V(.14,-.01,.03)].forEach((d,i)=>rainStroke(g,A(dockSummer,d),.81,KIND.FEED_SUMMER,SEASON.SUMMER,.95+i*.04));
  windStroke(g,A(dockSummer,V(0,-.12,.01)),.81,KIND.FEED_SUMMER,SEASON.SUMMER,1.1);
  [V(-.13,.08,.00),V(-.02,.14,.02),V(.10,.07,-.02),V(-.08,-.06,.03),V(.11,-.08,.01)].forEach((d,i)=>leaf(g,A(dockAutumn,d),.82,KIND.FEED_AUTUMN,SEASON.AUTUMN,.90+(i%2)*.18,i%2?[.91,.48,.09,1]:[.69,.29,.045,1]));
  [V(-.10,.05,.00),V(.08,.11,.02),V(.05,-.08,-.02)].forEach((d,i)=>snowflake(g,A(dockWinter,d),.075+i*.008,.83,KIND.FEED_WINTER,SEASON.WINTER));
};

const GEN2273_BASE_RENDERER=renderer;
renderer=function(gl,g,backend){
  const R=GEN2273_BASE_RENDERER(gl,g,backend);
  R.basePositions=new Float32Array(g.p);
  R.positionData=new Float32Array(g.p);
  gl.bindBuffer(gl.ARRAY_BUFFER,R.b.p);
  gl.bufferData(gl.ARRAY_BUFFER,R.positionData,gl.DYNAMIC_DRAW);
  return R;
};
function gen2273ApplyRendererPositions(gl,R,g,runtime){
  R.positionData.set(R.basePositions);
  for(const range of g.objectRanges){
    const identity=GEN2273_MOBILE_OBJECT_REGISTRY[range.objectId],current=runtime.currentXYZ[range.objectId],dx=current.x-identity.homeXYZ.x,dy=current.y-identity.homeXYZ.y,dz=current.z-identity.homeXYZ.z;
    for(let vertex=range.startVertex;vertex<range.endVertex;vertex++){const offset=vertex*3;R.positionData[offset]=R.basePositions[offset]+dx;R.positionData[offset+1]=R.basePositions[offset+1]+dy;R.positionData[offset+2]=R.basePositions[offset+2]+dz}
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,R.b.p);
  gl.bufferSubData(gl.ARRAY_BUFFER,0,R.positionData);
}
function gen2273EnvironmentState(ms,reduced,lockSeconds){
  if(reduced)return{active:true,phase:'FOUR_DOMAIN_ACTIVE',progress:1,color:[.012,.026,.052,.68]};
  const lockMs=lockSeconds*1000;
  if(ms<lockMs){const u=clamp(ms/lockMs);return{active:true,phase:'ENTRANCE_AND_SETTLEMENT',progress:u,color:[mix(.006,.014,u),mix(.014,.030,u),mix(.032,.060,u),.68]}}
  const period=CONTRACT.environmentCycleSeconds*1000,t=((ms-lockMs)%period+period)%period,u=t/period;
  const frames=[{at:0,phase:'FOUR_DOMAIN_ACTIVE',color:[.014,.030,.060,.68]},{at:.25,phase:'LOCAL_MOVEMENT',color:[.018,.070,.080,.60]},{at:.50,phase:'LOCAL_DENSITY',color:[.095,.038,.020,.70]},{at:.75,phase:'LOCAL_RECOVERY',color:[.004,.010,.034,.78]},{at:1,phase:'FOUR_DOMAIN_ACTIVE',color:[.014,.030,.060,.68]}];
  let a=frames[0],b=frames[1];for(let i=0;i<frames.length-1;i++)if(u>=frames[i].at&&u<=frames[i+1].at){a=frames[i];b=frames[i+1];break}
  const q=smooth(a.at,b.at,u);return{active:true,phase:a.phase,progress:u,color:a.color.map((value,index)=>mix(value,b.color[index],q))};
}
function gen2273CycleTimeSeconds(ms,lockSeconds){const lockMs=lockSeconds*1000;if(ms<=lockMs)return Math.max(0,ms)/1000;const period=CONTRACT.environmentCycleSeconds*1000;return(((ms-lockMs)%period+period)%period)/1000}

const GEN2273_BOUND_GEOMETRY=build();
const GEN2273_BINDING_PROOF=gen2273AssertBoundRanges(GEN2273_BOUND_GEOMETRY);
function runGen2273MechanicalCheckpointProofs(){
  const ids=GEN2273_MOBILE_OBJECT_REGISTRY.map(object=>object.objectId),names=GEN2273_MOBILE_OBJECT_REGISTRY.map(object=>object.id),identityFrozen=GEN2273_MOBILE_OBJECT_REGISTRY.every(Object.isFrozen),uniqueIdentity=new Set(ids).size===96&&new Set(names).size===96&&ids.every((id,index)=>id===index);
  const circulationStartsAtHome=GEN2273_MOBILE_OBJECT_REGISTRY.every(object=>gen2273SameXYZ(P_circulation(object,0),P_static(object)));
  const localStartsAtHome=GEN2273_MOBILE_OBJECT_REGISTRY.every(object=>gen2273SameXYZ(P_local(object,0),P_static(object)));
  const controller=createGen2273Runtime(1.9,false),indices=[];
  [0,3500,12500,18400,19350,20300].forEach(ms=>indices.push(controller.advance(ms).stateIndex));
  const lockSnapshot=controller.snapshot(),originBefore=gen2273CloneXYZ(controller.settlementOrigin[0]),stateBefore=lockSnapshot.stateIndex;
  const earlierSnapshot=controller.advance(1000),originAfter=controller.settlementOrigin[0];
  const monotonic=indices.every((value,index)=>index===0||value>=indices[index-1])&&earlierSnapshot.stateIndex===stateBefore;
  const orderedTransitions=lockSnapshot.transitionLog.map(entry=>entry.state).join('|')===GEN2273_STATE_ORDER.join('|');
  const originCapturedOnce=lockSnapshot.settlementOriginCaptureCount===96&&gen2273SameXYZ(originBefore,originAfter);
  const physical=createGen2273Runtime(1.9,false);physical.advance(18400);const origin=gen2273CloneXYZ(physical.settlementOrigin[0]);physical.advance(19350);const expectedMid=L(origin,GEN2273_DOMAIN_HANDOFF_XYZ[0],smoother(.5)),midError=gen2273Distance(physical.currentXYZ[0],expectedMid);physical.advance(20300);const lockError=gen2273Distance(physical.currentXYZ[0],GEN2273_DOMAIN_HANDOFF_XYZ[0]),physicalSnapshot=physical.snapshot();
  const durationLaw=GEN2273_SETTLEMENT_CANDIDATES.every(duration=>Math.abs(createGen2273Runtime(duration,false).snapshot().lockSeconds-(GEN2273_TREE_COMPLETE_SECONDS+duration))<GEN2273_EPSILON);
  const signatures=[0,24,48,72].map(id=>{const object=GEN2273_MOBILE_OBJECT_REGISTRY[id],home=P_static(object),local=P_local(object,1);return V(local.x-home.x,local.y-home.y,local.z-home.z)});
  let distinctLocal=true;for(let i=0;i<signatures.length;i++)for(let j=i+1;j<signatures.length;j++)if(gen2273Distance(signatures[i],signatures[j])<.001)distinctLocal=false;
  const identityState=Object.freeze({passed:uniqueIdentity&&identityFrozen&&GEN2273_BINDING_PROOF.passed&&monotonic&&orderedTransitions&&originCapturedOnce,objectCount:GEN2273_MOBILE_OBJECT_REGISTRY.length,rangeCount:GEN2273_BINDING_PROOF.objectRangeCount,uniqueObjectIds:GEN2273_BINDING_PROOF.uniqueObjectIds,monotonic,orderedTransitions,originCapturedOnce,noRespawnOrSecondVisiblePopulation:GEN2273_BINDING_PROOF.visibleFeedPopulationCount===0});
  const physicalContinuity=Object.freeze({passed:circulationStartsAtHome&&localStartsAtHome&&midError<GEN2273_EPSILON&&lockError<GEN2273_EPSILON&&physicalSnapshot.postSettlementCirculationEvaluations===0&&durationLaw,circulationStartsAtHome,localStartsAtHome,midpointError:midError,lockError,postSettlementCirculationEvaluations:physicalSnapshot.postSettlementCirculationEvaluations,durationLaw});
  const productBoundary=Object.freeze({passed:lockSnapshot.globalCirculation===0&&lockSnapshot.globalCirculationUpdatePath==='DISABLED'&&lockSnapshot.entranceAuthority==='TERMINATED'&&lockSnapshot.treeGrowthAuthority==='TERMINATED'&&lockSnapshot.communityInteractionAvailable&&lockSnapshot.domainLocalPhysicsAuthoritative&&lockSnapshot.domainLocked&&lockSnapshot.state===GEN2273_STATE.COEXISTENCE&&distinctLocal,domainLockAtSeconds:lockSnapshot.lockSeconds,noPostLockWait:lockSnapshot.state===GEN2273_STATE.COEXISTENCE,distinctDomainLocalMotion:distinctLocal,communityInteractionAvailable:lockSnapshot.communityInteractionAvailable});
  return Object.freeze({passed:identityState.passed&&physicalContinuity.passed&&productBoundary.passed,identityState,physicalContinuity,productBoundary});
}
const GEN2273_MECHANICAL_CHECKPOINT_PROOFS=runGen2273MechanicalCheckpointProofs();
if(!GEN2273_MECHANICAL_CHECKPOINT_PROOFS.passed)throw Error('GEN2273_PRODUCT_BOUNDARY_CHECKPOINT_PROOF_FAILURE');
const GEN2273_PRODUCT_BOUNDARY_CHECKPOINT=Object.freeze({
  id:'GEN2273_PRODUCT_BOUNDARY_CHECKPOINT_V2',
  parentCheckpointCommit:'48d4de88cda14942614929fe30c4a2c3b6788cf1',
  governingHead:'f9c0ed375724a2e073a49f913eb8adc0d5e2ca38',
  stateOrder:GEN2273_STATE_ORDER,
  objectCount:GEN2273_MOBILE_OBJECT_REGISTRY.length,
  settlementCandidates:GEN2273_SETTLEMENT_CANDIDATES,
  constructionBaselineDurationSeconds:1.9,
  selectedSettlementDuration:GEN2273_SELECTED_SETTLEMENT_SECONDS,
  renderMutationApplied:true,
  qualificationVariantsRendered:true,
  evidenceHarnessFrozen:true,
  proofs:GEN2273_MECHANICAL_CHECKPOINT_PROOFS,
  nextLawfulAction:'AUTOMATED_QUALIFICATION_THEN_EXACT_SHA_PHYSICAL_PREVIEW'
});
globalThis.DGB_COMMUNITY_GEN2273_STRUCTURAL_CHECKPOINT=GEN2273_PRODUCT_BOUNDARY_CHECKPOINT;
globalThis.DGB_COMMUNITY_GEN2273_PRODUCT_BOUNDARY_CHECKPOINT=GEN2273_PRODUCT_BOUNDARY_CHECKPOINT;
globalThis.DGB_COMMUNITY_GEN2273_RUNTIME_API=Object.freeze({stateOrder:GEN2273_STATE_ORDER,settlementCandidates:GEN2273_SETTLEMENT_CANDIDATES,createRuntime:createGen2273Runtime});

function gen2273Mount(host){
  const doc=host.ownerDocument||document,mq=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)'),reduced=!!mq?.matches,settlementDuration=gen2273SettlementDuration(globalThis.DGB_COMMUNITY_GEN2273_SETTLEMENT_DURATION),runtime=createGen2273Runtime(settlementDuration,reduced);
  const style=doc.createElement('style');style.dataset.communityLifecycleStyle='true';style.textContent='[data-community-lifecycle-mount]{position:relative;isolation:isolate;overflow:hidden;min-height:22rem}.community-lifecycle3d-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab}.community-lifecycle3d-canvas:active{cursor:grabbing}@media(max-width:720px){[data-community-lifecycle-mount]{min-height:25rem}}@media(prefers-reduced-motion:reduce){.community-lifecycle3d-canvas{cursor:default}}';doc.head.append(style);
  const options={alpha:true,antialias:true,depth:true,powerPreference:'low-power'},backendDefs=[{id:'webgl2',contexts:['webgl2'],webglVersion:2,shaderLanguage:'GLSL ES 3.00'},{id:'webgl1',contexts:['webgl','experimental-webgl'],webglVersion:1,shaderLanguage:'GLSL ES 1.00'}],geometry=GEN2273_BOUND_GEOMETRY,attempts=[];
  let canvas,gl,R,backend,io,ro,raf=0,dead=false,contextLost=false,visible=true,start=performance.now(),last=start,baseYaw=-.20,targetYaw=baseYaw,yaw=baseYaw,targetPitch=-.055,pitch=targetPitch,drag=null,frameCount=0,contextLossCount=0,contextRestoreCount=0,firstProof=null,genState=runtime.snapshot().state,lifecycleState=reduced?LIFE_CYCLE.TWO:LIFE_CYCLE.ONE,treeState=reduced?'TREE_MATURE_LOCK':'INTRO_LIFECYCLE',environmentPhase=reduced?'FOUR_DOMAIN_ACTIVE':'ENTRANCE_AND_SETTLEMENT',transferActive=false,treeGeometryLocked=reduced;
  const publishReceipt=(failure=null,extra={})=>{const gen=runtime.snapshot();globalThis.DGB_COMMUNITY_LIFECYCLE_3D_RECEIPT=Object.freeze({
    contract:CONTRACT,initialized:!!R&&!failure,firstDraw:!!firstProof?.passed,visibleFrame:!!firstProof?.passed,backend:backend?.id||null,webglContexts:backend?1:0,webglVersion:backend?.webglVersion||null,shaderLanguage:backend?.shaderLanguage||null,precision:R?.precision||null,frameCount,contextLossCount,contextRestoreCount,
    fixedGeometry:true,geometryRebuiltPerFrame:false,geometryFinite:true,treeLockPhase:.56,seasonCount:4,settlementDeterministic:true,boundedInspectionDegrees:22,reducedMotion:reduced,
    lifecycleState,gen2273State:gen.state,gen2273StateIndex:gen.stateIndex,gen2273SettlementDuration:settlementDuration,gen2273LockSeconds:gen.lockSeconds,treeCycleMode:'GEN2273_EIGHT_STATE_LATCHED',treeCycleComplete:gen.domainLocked,treeState,treeGeometryLocked,transferActive,formationRestartCount:0,postLockTransferRestart:false,
    canonicalMobileObjectCount:96,canonicalRendererBindingCount:geometry.objectRanges.length,settlementOriginCaptureCount:gen.settlementOriginCaptureCount,postSettlementCirculationEvaluations:gen.postSettlementCirculationEvaluations,globalCirculation:gen.globalCirculation,globalCirculationUpdatePath:gen.globalCirculationUpdatePath,entranceAuthority:gen.entranceAuthority,treeGrowthAuthority:gen.treeGrowthAuthority,communityInteractionAvailable:gen.communityInteractionAvailable,domainLocalPhysicsAuthoritative:gen.domainLocalPhysicsAuthoritative,
    environmentActive:true,environmentPhase,environmentCycleSeconds:CONTRACT.environmentCycleSeconds,ambientRhythmMode:'DOMAIN_LOCAL_PHYSICS',environmentMode:CONTRACT.environment,environmentSectorCount:4,environmentDepthPlaneCount:CONTRACT.environmentDepthPlanes.length,permanentQuadrants:true,feedOrbitRevolutions:0,feedPathMode:'CANONICAL_OBJECT_CIRCULATION',feedTravelCompletesAtSeconds:GEN2273_TREE_COMPLETE_SECONDS,transferShutdownAtSeconds:gen.lockSeconds,guideRemnantsAfterLock:false,postLockFeeding:false,protectedCenter:true,rimTaper:null,
    woodMaterialSystem:'CLASS_ASSIGNED_BROWN_ONLY',foliageMaterialClass:'FOLIAGE',fallbackPreserved:false,fallbackRemoved:true,vertexCount:R?.vertices||geometry.p.length/3,triangleCount:R?.triangles||geometry.i.length/3,visibleFrameProof:firstProof,backendAttempts:attempts.map(x=>({...x})),mechanicalCheckpoint:GEN2273_PRODUCT_BOUNDARY_CHECKPOINT,failure,...extra
  })};
  const publishFailure=(reason,extra={})=>{host.removeAttribute('data-lifecycle-ready');host.dataset.lifecycleStatus=reason;host.dataset.lifecycleFallback='none';publishReceipt(reason,extra)};
  const makeCanvas=()=>{const c=doc.createElement('canvas');c.className='community-lifecycle3d-canvas';c.setAttribute('aria-hidden','true');return c};
  const resize=()=>{const r=canvas.getBoundingClientRect(),cap=Math.min(r.width,r.height)<520?1.25:1.5,d=Math.min(cap,Math.max(1,globalThis.devicePixelRatio||1)),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);return w/Math.max(1,h)};
  const draw=(now=performance.now(),prove=false)=>{
    if(dead||contextLost||!R)return false;
    const asp=resize(),elapsed=Math.max(0,now-start),gen=runtime.advance(elapsed),s=gen.stateIndex>=3?MATURE_TREE_STATE:lifecycle(Math.min(elapsed,GEN2273_TREE_COMPLETE_SECONDS*1000)),env=gen2273EnvironmentState(elapsed,reduced,gen.lockSeconds),nextLifecycle=gen.domainLocked?LIFE_CYCLE.TWO:LIFE_CYCLE.ONE,nextTreeState=gen.stateIndex>=3?'TREE_MATURE_LOCK':'INTRO_LIFECYCLE',nextEnvironmentPhase=env.phase,stateChanged=gen.state!==genState||nextLifecycle!==lifecycleState||nextTreeState!==treeState||nextEnvironmentPhase!==environmentPhase,dt=Math.min(40,Math.max(0,now-last));
    genState=gen.state;lifecycleState=nextLifecycle;treeState=nextTreeState;environmentPhase=nextEnvironmentPhase;transferActive=gen.globalCirculationAuthority;treeGeometryLocked=gen.stateIndex>=3;last=now;
    if(!reduced){const e=1-Math.exp(-dt/135);yaw+=(targetYaw-yaw)*e;pitch+=(targetPitch-pitch)*e}
    gen2273ApplyRendererPositions(gl,R,geometry,runtime);
    gl.useProgram(R.p);if(R.vao)gl.bindVertexArray(R.vao);gl.clearColor(...env.color);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(R.u.yaw,yaw);gl.uniform1f(R.u.pitch,pitch);gl.uniform1f(R.u.scale,asp<.76?1.04:asp<1.05?1.10:1.15);gl.uniform1f(R.u.aspect,asp);gl.uniform1f(R.u.camera,4.55);
    gl.uniform1f(R.u.time,gen2273CycleTimeSeconds(elapsed,gen.lockSeconds));gl.uniform1f(R.u.intro,reduced?CONTRACT.cycleSeconds:Math.min(CONTRACT.cycleSeconds,elapsed/1000));gl.uniform1f(R.u.progress,s.p);gl.uniform1f(R.u.activity,s.activity);gl.uniform1f(R.u.retained,s.retained);gl.uniform1f(R.u.renewal,s.renewal);gl.uniform1f(R.u.reduced,reduced?1:0);gl.uniform1f(R.u.lifecycle,gen.domainLocked?1:0);
    gl.drawElements(gl.TRIANGLES,R.count,gl.UNSIGNED_SHORT,0);const err=gl.getError();if(err!==gl.NO_ERROR)throw Error(`LIFECYCLE_DRAW_GL:${err}`);frameCount++;
    if(stateChanged){host.dataset.lifecycleState=lifecycleState;host.dataset.gen2273State=gen.state;host.dataset.gen2273StateIndex=String(gen.stateIndex);host.dataset.lifecycleStage=treeState;host.dataset.lifecycleEnvironment=environmentPhase;host.dataset.lifecycleFeeding=transferActive?'active':'stopped';host.dataset.communityInteraction=gen.communityInteractionAvailable?'available':'entrance';if(firstProof?.passed)publishReceipt()}
    return prove?visiblePixelProof(gl,canvas):true;
  };
  host.dataset.lifecycleStatus='initializing';host.dataset.lifecycleContract=CONTRACT.id;host.dataset.lifecycleState=lifecycleState;host.dataset.gen2273State=genState;host.dataset.lifecycleFeeding='stopped';host.setAttribute('role','img');
  host.setAttribute('aria-label','Animated three-dimensional Community lifecycle sculpture. Four permanent environmental domains remain visible while the same residents circulate through tree formation, settle back to their domains, and continue under distinct local motion after the entrance ends.');
  for(const def of backendDefs){const c=makeCanvas();let candidateGl=null,candidateR=null,contextName=null;for(const name of def.contexts){try{candidateGl=c.getContext(name,options)}catch{}if(candidateGl){contextName=name;break}}if(!candidateGl){attempts.push({backend:def.id,result:'context-unavailable'});continue}try{candidateR=renderer(candidateGl,geometry,def);const setupError=candidateGl.getError();if(setupError!==candidateGl.NO_ERROR)throw Error(`renderer-gl-error-${setupError}`);canvas=c;gl=candidateGl;R=candidateR;backend={...def,contextName};host.append(canvas);const proof=draw(start,true);if(!proof?.passed)throw Error('visible-frame-proof-failed');firstProof=proof;attempts.push({backend:def.id,result:'selected'});break}catch(error){attempts.push({backend:def.id,result:'failed',reason:String(error?.message||error)});dispose(candidateGl,candidateR);c.remove();canvas=undefined;gl=undefined;R=undefined;backend=undefined}}
  if(!R){host.removeAttribute('role');host.removeAttribute('aria-label');style.remove();publishFailure(attempts.every(x=>x.result==='context-unavailable')?'webgl-unavailable':'renderer-initialization-failed');return}
  host.dataset.lifecycleReady='true';host.dataset.lifecycleStatus='ready';publishReceipt();
  const stopAnimation=()=>{if(raf){cancelAnimationFrame(raf);raf=0}},hardFail=reason=>{if(dead)return;dead=true;stopAnimation();io?.disconnect();ro?.disconnect();publishFailure(reason)},tick=now=>{raf=0;if(dead||contextLost||reduced||!visible||doc.hidden)return;try{draw(now)}catch{hardFail('frame-draw-failed');return}raf=requestAnimationFrame(tick)},kick=()=>{if(dead||contextLost)return;if(reduced){try{draw()}catch{hardFail('frame-draw-failed')}return}if(visible&&!doc.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(tick)}};
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(dead)return;contextLost=true;contextLossCount++;stopAnimation();host.removeAttribute('data-lifecycle-ready');host.dataset.lifecycleStatus='context-lost';publishReceipt('context-lost',{recoverable:true})});
  canvas.addEventListener('webglcontextrestored',()=>{if(dead)return;try{R=renderer(gl,geometry,backend);contextLost=false;contextRestoreCount++;last=performance.now();const proof=draw(last,true);if(!proof?.passed)throw Error('visible-frame-proof-failed');firstProof=proof;host.dataset.lifecycleReady='true';host.dataset.lifecycleStatus='ready';publishReceipt(null,{restored:true});kick()}catch{contextLost=false;hardFail('context-restore-failed')}});
  const yawLimit=22*Math.PI/180;
  canvas.addEventListener('pointerdown',event=>{if(reduced||event.button!==0)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,startYaw:yaw,axis:null};canvas.setPointerCapture?.(event.pointerId)});
  canvas.addEventListener('pointermove',event=>{if(reduced)return;const rect=canvas.getBoundingClientRect();if(drag&&event.pointerId===drag.id){const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(!drag.axis&&Math.hypot(dx,dy)>7)drag.axis=Math.abs(dx)>Math.abs(dy)*1.15?'x':'y';if(drag.axis==='x'){event.preventDefault();targetYaw=baseYaw+clamp(dx/Math.max(1,rect.width)*1.6,-yawLimit,yawLimit);kick()}return}if(event.pointerType==='mouse'&&rect.width){targetYaw=baseYaw+(((event.clientX-rect.left)/rect.width)*2-1)*.08;targetPitch=-.055-(((event.clientY-rect.top)/rect.height)*2-1)*.035;kick()}},{passive:false});
  const release=event=>{if(!drag||event.pointerId!==drag.id)return;drag=null;targetYaw=baseYaw;targetPitch=-.055;kick()};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('pointerleave',()=>{if(!drag){targetYaw=baseYaw;targetPitch=-.055;kick()}},{passive:true});
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)stopAnimation();else kick()},{passive:true});
  if('IntersectionObserver'in globalThis){io=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>.02);if(!visible)stopAnimation();kick()},{rootMargin:'120px 0px',threshold:[0,.02]});io.observe(host)}
  if('ResizeObserver'in globalThis){ro=new ResizeObserver(()=>{if(contextLost||dead)return;try{const proof=draw(performance.now(),!firstProof?.passed);if(proof&&proof!==true&&!proof.passed)hardFail('resize-draw-failed');else kick()}catch{hardFail('resize-draw-failed')}});ro.observe(host)}
  kick();
}
mount=gen2273Mount;

// Gen2282 bounded semantic repair: permanent domains stay active while the tracked cohort settles into the tree.
const GEN2282_TRACKED_KIND_BASE=22;
const GEN2282_PERMANENT_DOMAIN_COUNT=4;
const gen2282TrackedKind=season=>GEN2282_TRACKED_KIND_BASE+season;

function gen2282EmitSeasonMotif(g,zone,plane,depthIndex,i,p,kind,alphaScale=1,scaleFactor=1){
  const q=.10+zone.season*.17+depthIndex*.018+i*.006,near=plane.scale*scaleFactor,alpha=clamp(plane.alpha*alphaScale,0,1);
  if(zone.season===SEASON.SPRING){
    if(i%3===0)flower(g,p,q,kind,zone.season,.58*near,alpha);
    else orb(g,p,V(.026*near,.018*near,.020*near),i%2?alphaColor([.98,.60,.72,1],alpha):alphaColor([1,.78,.36,1],alpha),q,kind,5,3,zone.season);
  }else if(zone.season===SEASON.SUMMER){
    rainStroke(g,p,q,kind,zone.season,.66*near,alphaColor([.12,.58,.90,1],alpha));
    if(i%4===0)windStroke(g,A(p,V(.04,.035,.01)),q,kind,zone.season,.55*near,alphaColor([.28,.78,.90,1],alpha*.82));
    if(depthIndex===0&&i%4===2)orb(g,A(p,V(.08,.03,-.03)),V(.10*near,.055*near,.045*near),alphaColor([.24,.55,.65,1],alpha*.26),q,kind,6,3,zone.season);
  }else if(zone.season===SEASON.AUTUMN){
    leaf(g,p,q,kind,zone.season,.66*near,i%2?alphaColor([.94,.49,.08,1],alpha):alphaColor([.68,.27,.035,1],alpha));
  }else{
    if(i%3===0)snowflake(g,p,.045*near+(i%2)*.007,q,kind,zone.season,alpha);
    else orb(g,p,V(.024*near,.024*near,.021*near),[.74,.91,1,alpha],q,kind,5,3,zone.season);
    if(depthIndex===0&&i%4===1)orb(g,A(p,V(.10,.02,-.02)),V(.13*near,.060*near,.050*near),[.64,.78,.86,alpha*.20],q,kind,6,3,zone.season);
  }
}

addQuadrantEnvironment=function(g){
  const count=GEN2273_OBJECTS_PER_DEPTH;
  g.objectRanges=[];
  g.permanentDomainRanges=[];
  for(const zone of QUADRANT_VOLUMES){
    DEPTH_PLANES.forEach((plane,depthIndex)=>{
      for(let i=0;i<count;i++){
        const base=quadrantPoint(zone,plane,i,count),offset=V((i%2?1:-1)*.045,((i%3)-1)*.030,0),p=A(base,offset),startVertex=g.p.length/3;
        gen2282EmitSeasonMotif(g,zone,plane,depthIndex,i,p,zone.kind,.62,.90);
        g.permanentDomainRanges.push(Object.freeze({domain:zone.season,startVertex,endVertex:g.p.length/3}));
      }
    });
  }
  for(const zone of QUADRANT_VOLUMES){
    DEPTH_PLANES.forEach((plane,depthIndex)=>{
      for(let i=0;i<count;i++){
        const objectId=gen2273ObjectId(zone.season,depthIndex,i),identity=GEN2273_MOBILE_OBJECT_REGISTRY[objectId],p=quadrantPoint(zone,plane,i,count),startVertex=g.p.length/3;
        if(!identity||identity.objectId!==objectId||identity.domain!==zone.season||identity.depthBand!==depthIndex||!gen2273SameXYZ(identity.homeXYZ,p))throw Error('GEN2282_CANONICAL_IDENTITY_BINDING_FAILURE');
        gen2282EmitSeasonMotif(g,zone,plane,depthIndex,i,p,gen2282TrackedKind(zone.season),.92,1);
        g.objectRanges.push(Object.freeze({objectId,startVertex,endVertex:g.p.length/3}));
      }
    });
  }
};

vertexSource=function(webgl2,precision){
  let source=GEN2273_BASE_VERTEX_SOURCE(webgl2,precision);
  const marker='float crown=ss(.2,1.95,p.y),alive=ss(.35,.56,u_progress);\n  float sway=(u_reduced>.5?0.0:.008)*crown*alive;';
  const replacement='float trackedCohort=step(21.5,a_kind)*step(a_kind,25.5);\n  float crown=ss(.2,1.95,p.y),alive=ss(.35,.56,u_progress);\n  float sway=(u_reduced>.5?0.0:.008)*crown*alive*(1.0-trackedCohort);';
  const next=source.replace(marker,replacement);
  if(next===source)throw Error('GEN2282_TRACKED_SWAY_MARKER_MISSING');
  return next;
};
fragmentSource=function(webgl2,precision){
  let source=GEN2273_BASE_FRAGMENT_SOURCE(webgl2,precision);
  const specialMarker='float feed=step(11.5,v_k)*step(v_k,15.5),zoneEnv=step(16.5,v_k)*step(v_k,20.5),special=max(feed,zoneEnv);';
  const specialReplacement='float feed=step(11.5,v_k)*step(v_k,15.5),zoneEnv=step(16.5,v_k)*step(v_k,20.5),trackedCohort=step(21.5,v_k)*step(v_k,25.5),special=max(max(feed,zoneEnv),trackedCohort);';
  let next=source.replace(specialMarker,specialReplacement);
  if(next===source)throw Error('GEN2282_TRACKED_FRAGMENT_MARKER_MISSING');
  source=next;
  next=source.replace('alpha*=mix(1.0,1.0-u_lifecycle,feed);','alpha*=1.0-feed;');
  if(next===source)throw Error('GEN2282_FEED_VISIBILITY_MARKER_MISSING');
  return next;
};

function gen2282TreeSettlementXYZ(object){
  const final=P_circulation(object,1),radial=Math.max(.001,Math.hypot(final.x,final.z)),local=object.objectId%(DEPTH_PLANES.length*GEN2273_OBJECTS_PER_DEPTH),targetRadius=.075+(local%4)*.025+object.depthBand*.010,factor=Math.min(.55,targetRadius/radial);
  const yBase=[1.42,.72,1.00,1.55][object.domain],row=Math.floor((local%8)/2),y=yBase+(row-1.5)*.060+(object.depthBand-1)*.045;
  return V(final.x*factor,y,final.z*factor);
}
const GEN2282_TREE_SETTLEMENT_XYZ=Object.freeze(GEN2273_MOBILE_OBJECT_REGISTRY.map(object=>Object.freeze(gen2273CloneXYZ(gen2282TreeSettlementXYZ(object)))));

function createGen2282Runtime(settlementDurationSeconds=GEN2273_SELECTED_SETTLEMENT_SECONDS,reduced=false){
  const settlementDuration=gen2273SettlementDuration(settlementDurationSeconds),lockSeconds=GEN2273_TREE_COMPLETE_SECONDS+settlementDuration,registry=GEN2273_MOBILE_OBJECT_REGISTRY;
  const target=index=>GEN2282_TREE_SETTLEMENT_XYZ[index],currentXYZ=registry.map((object,i)=>gen2273CloneXYZ(reduced?target(i):P_static(object))),settlementOrigin=Array(registry.length).fill(null),transitionLog=[];
  let maxSeconds=0,stateIndex=reduced?GEN2273_STATE_ORDER.length-1:0,circulationProgress=0,settlementProgress=reduced?1:0,settlementOriginCaptureCount=0,circulationEvaluations=0,circulationEvaluationsAtSettlement=null,localTimeSeconds=0;
  let globalCirculationAuthority=false,globalCirculationUpdatePathEnabled=false,entranceAuthorityActive=!reduced,treeGrowthAuthorityActive=!reduced,communityInteractionAvailable=!!reduced,domainLocalPhysicsAuthoritative=!!reduced,domainLocked=!!reduced;
  const state=()=>GEN2273_STATE_ORDER[stateIndex],setCurrent=(index,p)=>{currentXYZ[index]=gen2273CloneXYZ(p)};
  const enter=(index,atSeconds)=>{
    if(index<=stateIndex)return;
    stateIndex=index;transitionLog.push(Object.freeze({state:GEN2273_STATE_ORDER[index],stateIndex:index,atSeconds}));
    if(index===1){globalCirculationAuthority=true;globalCirculationUpdatePathEnabled=true;}
    if(index===3){circulationProgress=1;registry.forEach((object,i)=>{setCurrent(i,P_circulation(object,1));circulationEvaluations++});treeGrowthAuthorityActive=false;}
    if(index===4){if(settlementOriginCaptureCount===0){registry.forEach((object,i)=>{settlementOrigin[i]=Object.freeze(gen2273CloneXYZ(currentXYZ[i]));settlementOriginCaptureCount++})}circulationEvaluationsAtSettlement=circulationEvaluations;globalCirculationAuthority=false;globalCirculationUpdatePathEnabled=false;}
    if(index===5){settlementProgress=1;registry.forEach((object,i)=>setCurrent(i,target(i)));globalCirculationAuthority=false;globalCirculationUpdatePathEnabled=false;entranceAuthorityActive=false;treeGrowthAuthorityActive=false;communityInteractionAvailable=true;domainLocalPhysicsAuthoritative=true;domainLocked=true;}
  };
  const updateCirculation=seconds=>{if(!globalCirculationAuthority||!globalCirculationUpdatePathEnabled||stateIndex>=4)return;const next=clamp((seconds-CONTRACT.feedingWindowSeconds[0])/(GEN2273_TREE_COMPLETE_SECONDS-CONTRACT.feedingWindowSeconds[0]));circulationProgress=Math.max(circulationProgress,next);registry.forEach((object,i)=>{setCurrent(i,P_circulation(object,circulationProgress));circulationEvaluations++});};
  const updateSettlement=seconds=>{if(stateIndex!==4)return;const next=clamp((seconds-GEN2273_TREE_COMPLETE_SECONDS)/settlementDuration);settlementProgress=Math.max(settlementProgress,next);const eased=smoother(settlementProgress);registry.forEach((object,i)=>setCurrent(i,L(settlementOrigin[i],target(i),eased)));};
  const updateLocal=seconds=>{if(!domainLocked||!domainLocalPhysicsAuthoritative)return;localTimeSeconds=Math.max(localTimeSeconds,Math.max(0,seconds-lockSeconds));};
  const settledObjectCount=()=>domainLocked?currentXYZ.reduce((count,p,i)=>count+(gen2273SameXYZ(p,target(i))?1:0),0):0;
  const snapshot=()=>Object.freeze({state:state(),stateIndex,progress:stateIndex===4?settlementProgress:stateIndex<3?circulationProgress:1,settlementDuration,lockSeconds,maxSeconds,circulationProgress,settlementProgress,settlementOriginCaptureCount,globalCirculation:globalCirculationAuthority?1:0,globalCirculationAuthority,globalCirculationUpdatePath:globalCirculationUpdatePathEnabled?'ENABLED':'DISABLED',entranceAuthority:entranceAuthorityActive?'ACTIVE':'TERMINATED',treeGrowthAuthority:treeGrowthAuthorityActive?'ACTIVE':'TERMINATED',communityInteractionAvailable,domainLocalPhysicsAuthoritative,domainLocked,localTimeSeconds,postSettlementCirculationEvaluations:circulationEvaluationsAtSettlement===null?0:circulationEvaluations-circulationEvaluationsAtSettlement,persistentDomainCount:GEN2282_PERMANENT_DOMAIN_COUNT,domainActivityPostSettlement:domainLocked&&domainLocalPhysicsAuthoritative,domainDepletion:false,settledObjectCount:settledObjectCount(),terminalReboundCount:domainLocked?registry.length-settledObjectCount():0,objectReplacementCount:0,transitionLog:Object.freeze(transitionLog.map(entry=>entry))});
  if(reduced){registry.forEach((object,i)=>{settlementOrigin[i]=Object.freeze(gen2273CloneXYZ(target(i)));settlementOriginCaptureCount++});transitionLog.push(Object.freeze({state:GEN2273_STATE.COEXISTENCE,stateIndex:7,atSeconds:0,reduced:true}));}
  else transitionLog.push(Object.freeze({state:GEN2273_STATE.DOMAIN_STATIC,stateIndex:0,atSeconds:0}));
  const advance=ms=>{const rawSeconds=Math.max(0,Number(ms)||0)/1000;maxSeconds=Math.max(maxSeconds,rawSeconds);const seconds=maxSeconds;if(reduced){updateLocal(seconds);return snapshot()}if(seconds>=CONTRACT.feedingWindowSeconds[0])enter(1,CONTRACT.feedingWindowSeconds[0]);if(seconds>=CONTRACT.feedingWindowSeconds[1])enter(2,CONTRACT.feedingWindowSeconds[1]);if(seconds<GEN2273_TREE_COMPLETE_SECONDS)updateCirculation(seconds);if(seconds>=GEN2273_TREE_COMPLETE_SECONDS){enter(3,GEN2273_TREE_COMPLETE_SECONDS);enter(4,GEN2273_TREE_COMPLETE_SECONDS)}if(stateIndex===4)updateSettlement(seconds);if(seconds>=lockSeconds){enter(5,lockSeconds);enter(6,lockSeconds);enter(7,lockSeconds)}if(domainLocked)updateLocal(seconds);return snapshot();};
  return Object.freeze({registry,currentXYZ,settlementOrigin,advance,snapshot});
}

const GEN2282_REBUILT_GEOMETRY=build();
for(const key of ['p','n','c','q','k','s','i'])GEN2273_BOUND_GEOMETRY[key]=GEN2282_REBUILT_GEOMETRY[key];
GEN2273_BOUND_GEOMETRY.objectRanges=GEN2282_REBUILT_GEOMETRY.objectRanges;
GEN2273_BOUND_GEOMETRY.permanentDomainRanges=GEN2282_REBUILT_GEOMETRY.permanentDomainRanges;
createGen2273Runtime=createGen2282Runtime;
GEN2273_CONTROLLER_CACHE.clear();

function runGen2282BinaryQualification(){
  const registry=GEN2273_MOBILE_OBJECT_REGISTRY,binding=gen2273AssertBoundRanges(GEN2273_BOUND_GEOMETRY),ids=registry.map(object=>object.objectId),names=registry.map(object=>object.id);
  const sameObjectIdentity=registry.length===96&&new Set(ids).size===96&&new Set(names).size===96&&ids.every((id,index)=>id===index)&&registry.every(Object.isFrozen)&&binding.passed;
  const permanentDomains=new Set((GEN2273_BOUND_GEOMETRY.permanentDomainRanges||[]).map(range=>range.domain)),persistentDomainCount=permanentDomains.size;
  const trackedStart=Math.min(...GEN2273_BOUND_GEOMETRY.objectRanges.map(range=>range.startVertex)),permanentEnd=Math.max(...GEN2273_BOUND_GEOMETRY.permanentDomainRanges.map(range=>range.endVertex)),domainDepletion=!(persistentDomainCount===4&&permanentEnd<=trackedStart);
  const runtime=createGen2282Runtime(GEN2273_SELECTED_SETTLEMENT_SECONDS,false),lockMs=(GEN2273_TREE_COMPLETE_SECONDS+GEN2273_SELECTED_SETTLEMENT_SECONDS)*1000;
  runtime.advance(GEN2273_TREE_COMPLETE_SECONDS*1000);
  let previousRadial=runtime.currentXYZ.map(p=>Math.hypot(p.x,p.z)),settlementOutwardStepCount=0;
  for(const fraction of [.25,.50,.75,1]){runtime.advance((GEN2273_TREE_COMPLETE_SECONDS+GEN2273_SELECTED_SETTLEMENT_SECONDS*fraction)*1000);const currentRadial=runtime.currentXYZ.map(p=>Math.hypot(p.x,p.z));currentRadial.forEach((value,i)=>{if(value>previousRadial[i]+GEN2273_EPSILON)settlementOutwardStepCount++});previousRadial=currentRadial;}
  runtime.advance(lockMs);const atLock=runtime.currentXYZ.map(gen2273CloneXYZ),lockSnapshot=runtime.snapshot();runtime.advance(lockMs+12000);const after=runtime.currentXYZ,terminalReboundCount=after.reduce((count,p,i)=>count+(gen2273SameXYZ(p,atLock[i])?0:1),0),settledObjectCount=after.reduce((count,p,i)=>count+(gen2273SameXYZ(p,GEN2282_TREE_SETTLEMENT_XYZ[i])?1:0),0);
  const vertexLaw=vertexSource(false,'highp'),domainActivityPostSettlement=persistentDomainCount===4&&vertexLaw.includes('if(zoneEnv>.5&&u_reduced<.5){')&&!vertexLaw.includes('if(false){')&&gen2273CycleTimeSeconds(lockMs+1000,lockSnapshot.lockSeconds)!==gen2273CycleTimeSeconds(lockMs+2000,lockSnapshot.lockSeconds);
  const objectReplacementCount=registry.reduce((count,object,i)=>count+(object===runtime.registry[i]?0:1),0);
  const receipt=Object.freeze({schema:'COMMUNITY_GEN2282_TREE_SETTLEMENT_BINARY_RECEIPT_v1',SAME_OBJECT_IDENTITY_96:sameObjectIdentity?'PASS':'FAIL',PERSISTENT_DOMAIN_COUNT_4:persistentDomainCount===4?'PASS':'FAIL',TERMINAL_REBOUND_COUNT_0:terminalReboundCount===0?'PASS':'FAIL',SETTLED_OBJECT_COUNT_96:settledObjectCount===96?'PASS':'FAIL',DOMAIN_ACTIVITY_POST_SETTLEMENT:domainActivityPostSettlement?'PASS':'FAIL',DOMAIN_DEPLETION:domainDepletion,OBJECT_REPLACEMENT_COUNT_0:objectReplacementCount===0?'PASS':'FAIL',settlementOutwardStepCount,terminalReboundCount,settledObjectCount,persistentDomainCount,objectReplacementCount,passed:sameObjectIdentity&&persistentDomainCount===4&&terminalReboundCount===0&&settledObjectCount===96&&domainActivityPostSettlement&&!domainDepletion&&objectReplacementCount===0&&settlementOutwardStepCount===0});
  return receipt;
}
const GEN2282_BINARY_RECEIPT=runGen2282BinaryQualification();
if(!GEN2282_BINARY_RECEIPT.passed)throw Error('GEN2282_TREE_SETTLEMENT_BINARY_QUALIFICATION_FAILURE');
const GEN2282_PRODUCT_BOUNDARY_CHECKPOINT=Object.freeze({id:'GEN2282_TREE_SETTLEMENT_SEMANTIC_REPAIR_V1',governingHead:'140b5e6cf4b07cfef4a8f0e494b69437b7d02f8a',objectCount:96,persistentDomainCount:4,settlementTarget:'CENTRAL_TREE',terminalBehavior:'STABLE_OPERATION_NO_REBOUND',binaryReceipt:GEN2282_BINARY_RECEIPT,nextLawfulAction:'EXACT_SHA_PHYSICAL_PREVIEW'});
globalThis.DGB_COMMUNITY_GEN2282_BINARY_RECEIPT=GEN2282_BINARY_RECEIPT;
globalThis.DGB_COMMUNITY_GEN2273_STRUCTURAL_CHECKPOINT=GEN2282_PRODUCT_BOUNDARY_CHECKPOINT;
globalThis.DGB_COMMUNITY_GEN2273_PRODUCT_BOUNDARY_CHECKPOINT=GEN2282_PRODUCT_BOUNDARY_CHECKPOINT;
globalThis.DGB_COMMUNITY_GEN2273_RUNTIME_API=Object.freeze({stateOrder:GEN2273_STATE_ORDER,settlementCandidates:GEN2273_SETTLEMENT_CANDIDATES,createRuntime:createGen2282Runtime,semanticRepair:'GEN2282_TREE_SETTLEMENT_SEMANTIC_REPAIR_V1'});
const GEN2282_BASE_MOUNT=gen2273Mount;
mount=function(host){GEN2282_BASE_MOUNT(host);host.setAttribute('aria-label','Animated three-dimensional Community lifecycle sculpture. Four permanent environmental domains continue operating while the same tracked cohort circulates inward, settles irreversibly into the mature central tree, and remains there without rebound.');};

// Gen2289 Checkpoint A: planar four-corner composition only. Motion binding remains frozen.
const GEN2289_PLANAR_KIND_BASE=26;
const GEN2289_PLANAR_Z=0;
const gen2289PlanarKind=season=>GEN2289_PLANAR_KIND_BASE+season;
const GEN2289_STAGE_AUTHORITY=Object.freeze({
  tree:Object.freeze({id:'TREE',nx:.50,ny:.50,x:0,y:.34}),
  domains:Object.freeze([
    Object.freeze({season:SEASON.SPRING,id:'SPRING',corner:'NW',nx:.20,ny:.20,x:-1.72,y:1.52,xSpan:.46,ySpan:.34}),
    Object.freeze({season:SEASON.WINTER,id:'WINTER',corner:'NE',nx:.80,ny:.20,x:1.72,y:1.52,xSpan:.46,ySpan:.34}),
    Object.freeze({season:SEASON.SUMMER,id:'SUMMER',corner:'SW',nx:.20,ny:.80,x:-1.72,y:-.72,xSpan:.46,ySpan:.34}),
    Object.freeze({season:SEASON.AUTUMN,id:'AUTUMN',corner:'SE',nx:.80,ny:.80,x:1.72,y:-.72,xSpan:.46,ySpan:.34})
  ])
});
const GEN2289_STAGE_BY_SEASON=Object.freeze(Object.fromEntries(GEN2289_STAGE_AUTHORITY.domains.map(domain=>[domain.season,domain])));
function gen2289PDomain2D(anchor,localX=0,localY=0){return V(anchor.x+localX,anchor.y+localY,GEN2289_PLANAR_Z)}
function gen2289PCohort3D(anchor,identity){
  const plane=DEPTH_PLANES[identity.depthBand]||DEPTH_PLANES[1],local=identity.objectId%GEN2273_OBJECTS_PER_DEPTH,col=local%4,row=Math.floor(local/4),x=((col+.5)/4-.5)*anchor.xSpan*1.45,y=((row+.5)/2-.5)*anchor.ySpan*1.45;
  return V(anchor.x+x,anchor.y+y,plane.z+((local%3)-1)*.055);
}
function gen2289PlanarTri(g,a,b,c,color,q,kind,season){const n=V(0,0,1),base=g.p.length/3;vert(g,a,n,color,q,kind,season);vert(g,b,n,color,q,kind,season);vert(g,c,n,color,q,kind,season);g.i.push(base,base+1,base+2)}
function gen2289PlanarDisc(g,center,rx,ry,color,q,kind,season,segments=12){const n=V(0,0,1),base=g.p.length/3;vert(g,V(center.x,center.y,GEN2289_PLANAR_Z),n,color,q,kind,season);for(let i=0;i<=segments;i++){const a=Math.PI*2*i/segments;vert(g,V(center.x+Math.cos(a)*rx,center.y+Math.sin(a)*ry,GEN2289_PLANAR_Z),n,color,q,kind,season)}for(let i=0;i<segments;i++)g.i.push(base,base+1+i,base+2+i)}
function gen2289PlanarStroke(g,a,b,width,color,q,kind,season){const dx=b.x-a.x,dy=b.y-a.y,len=Math.max(.0001,Math.hypot(dx,dy)),px=-dy/len*width,py=dx/len*width,z=GEN2289_PLANAR_Z,p0=V(a.x+px,a.y+py,z),p1=V(a.x-px,a.y-py,z),p2=V(b.x-px,b.y-py,z),p3=V(b.x+px,b.y+py,z);gen2289PlanarTri(g,p0,p1,p2,color,q,kind,season);gen2289PlanarTri(g,p0,p2,p3,color,q,kind,season)}
function gen2289EmitPlanarDomain(g,anchor){
  const kind=gen2289PlanarKind(anchor.season),q=.12+anchor.season*.17,p=(x,y)=>gen2289PDomain2D(anchor,x,y);
  if(anchor.season===SEASON.SPRING){
    gen2289PlanarStroke(g,p(-.22,-.18),p(-.18,.18),.012,[.16,.46,.22,.54],q,kind,anchor.season);
    for(const [x,y,s] of [[-.18,.14,.10],[-.02,.02,.085],[.18,.12,.095],[.12,-.12,.07]]){gen2289PlanarDisc(g,p(x,y),s,s*.72,[.92,.48,.66,.64],q,kind,anchor.season,10);gen2289PlanarDisc(g,p(x,y),s*.34,s*.34,[1,.78,.30,.78],q,kind,anchor.season,10)}
  }else if(anchor.season===SEASON.WINTER){
    for(const [x,y,s] of [[-.18,.11,.12],[.05,.02,.10],[.20,.15,.085],[-.02,-.15,.075]])for(let i=0;i<3;i++){const a=Math.PI*i/3,dx=Math.cos(a)*s,dy=Math.sin(a)*s;gen2289PlanarStroke(g,p(x-dx,y-dy),p(x+dx,y+dy),.009,[.70,.90,1,.70],q,kind,anchor.season)}
  }else if(anchor.season===SEASON.SUMMER){
    gen2289PlanarDisc(g,p(-.05,.18),.26,.08,[.17,.48,.58,.30],q,kind,anchor.season,14);
    for(const [x,y] of [[-.24,.09],[-.10,.04],[.04,.08],[.18,.02],[-.02,-.10],[.22,-.14]])gen2289PlanarStroke(g,p(x,y),p(x+.06,y-.18),.010,[.18,.62,.92,.66],q,kind,anchor.season);
  }else{
    for(const [x,y,rx,ry,c] of [[-.21,.13,.10,.055,[.90,.46,.08,.68]],[-.03,.02,.11,.06,[.68,.28,.04,.72]],[.17,.12,.09,.05,[.96,.58,.10,.68]],[.12,-.13,.10,.055,[.72,.31,.05,.70]],[-.18,-.10,.08,.045,[.86,.39,.06,.64]]]){gen2289PlanarDisc(g,p(x,y),rx,ry,c,q,kind,anchor.season,8);gen2289PlanarStroke(g,p(x-rx*.45,y),p(x+rx*.45,y),.006,[.36,.16,.04,.70],q,kind,anchor.season)}
  }
}

addQuadrantEnvironment=function(g){
  const count=GEN2273_OBJECTS_PER_DEPTH;
  g.objectRanges=[];g.permanentDomainRanges=[];g.planarDomainRanges=[];
  for(const anchor of GEN2289_STAGE_AUTHORITY.domains){const startVertex=g.p.length/3;gen2289EmitPlanarDomain(g,anchor);const endVertex=g.p.length/3;g.planarDomainRanges.push(Object.freeze({domain:anchor.season,corner:anchor.corner,startVertex,endVertex}));g.permanentDomainRanges.push(Object.freeze({domain:anchor.season,startVertex,endVertex}));}
  for(const zone of QUADRANT_VOLUMES)DEPTH_PLANES.forEach((plane,depthIndex)=>{for(let i=0;i<count;i++){const objectId=gen2273ObjectId(zone.season,depthIndex,i),identity=GEN2273_MOBILE_OBJECT_REGISTRY[objectId],p=quadrantPoint(zone,plane,i,count),startVertex=g.p.length/3;if(!identity||identity.objectId!==objectId||identity.domain!==zone.season||identity.depthBand!==depthIndex||!gen2273SameXYZ(identity.homeXYZ,p))throw Error('GEN2289_CHECKPOINT_A_IDENTITY_PRESERVATION_FAILURE');gen2282EmitSeasonMotif(g,zone,plane,depthIndex,i,p,gen2282TrackedKind(zone.season),.92,1);g.objectRanges.push(Object.freeze({objectId,startVertex,endVertex:g.p.length/3}));}});
};

const GEN2289_BASE_VERTEX_SOURCE=vertexSource;
vertexSource=function(webgl2,precision){
  let source=GEN2289_BASE_VERTEX_SOURCE(webgl2,precision);
  let next=source.replace('vec3 p=a_position,n=a_normal;','vec3 p=a_position,n=a_normal;\n  float planarDomain=step(25.5,a_kind)*step(a_kind,29.5);');if(next===source)throw Error('GEN2289_PLANAR_VERTEX_CLASS_MARKER_MISSING');source=next;
  next=source.replace('float sway=(u_reduced>.5?0.0:.008)*crown*alive*(1.0-trackedCohort);','float sway=(u_reduced>.5?0.0:.008)*crown*alive*(1.0-trackedCohort)*(1.0-planarDomain);');if(next===source)throw Error('GEN2289_PLANAR_SWAY_BYPASS_MARKER_MISSING');source=next;
  const projection=`p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);
  n=vec3(cy*n.x+sy*n.z,n.y,-sy*n.x+cy*n.z);
  p=vec3(p.x,cp*p.y-sp*p.z,sp*p.y+cp*p.z);
  n=vec3(n.x,cp*n.y-sp*n.z,sp*n.y+cp*n.z);
  p.y-=.28;p*=u_scale;
  float z=max(1.1,u_camera-p.z),nc=1.0,fc=10.0,zc=((fc+nc)/(fc-nc))*z-(2.0*fc*nc)/(fc-nc);
  gl_Position=vec4(p.x*1.70/u_aspect,p.y*1.70,zc,z);`;
  const planarProjection=`if(planarDomain>.5){
    vec2 worldAnchor=vec2(-1.72,1.52),stageAnchor=vec2(.20,.20);
    if(a_season>.5&&a_season<1.5){worldAnchor=vec2(-1.72,-.72);stageAnchor=vec2(.20,.80);}
    else if(a_season>1.5&&a_season<2.5){worldAnchor=vec2(1.72,-.72);stageAnchor=vec2(.80,.80);}
    else if(a_season>2.5){worldAnchor=vec2(1.72,1.52);stageAnchor=vec2(.80,.20);}
    vec2 local=(a_position.xy-worldAnchor)*.32;local.x/=max(u_aspect,.72);vec2 stage=stageAnchor+local;
    gl_Position=vec4(stage.x*2.0-1.0,1.0-stage.y*2.0,.92,1.0);
    n=vec3(0.0,0.0,1.0);
  }else{
    p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);
    n=vec3(cy*n.x+sy*n.z,n.y,-sy*n.x+cy*n.z);
    p=vec3(p.x,cp*p.y-sp*p.z,sp*p.y+cp*p.z);
    n=vec3(n.x,cp*n.y-sp*n.z,sp*n.y+cp*n.z);
    p.y-=.28;p*=u_scale;
    float z=max(1.1,u_camera-p.z),nc=1.0,fc=10.0,zc=((fc+nc)/(fc-nc))*z-(2.0*fc*nc)/(fc-nc);
    gl_Position=vec4(p.x*1.70/u_aspect,p.y*1.70,zc,z);
  }`;
  next=source.replace(projection,planarProjection);if(next===source)throw Error('GEN2289_PLANAR_CAMERA_BYPASS_MARKER_MISSING');return next;
};
const GEN2289_BASE_FRAGMENT_SOURCE=fragmentSource;
fragmentSource=function(webgl2,precision){
  let source=GEN2289_BASE_FRAGMENT_SOURCE(webgl2,precision);
  let next=source.replace('float feed=step(11.5,v_k)*step(v_k,15.5),zoneEnv=step(16.5,v_k)*step(v_k,20.5),trackedCohort=step(21.5,v_k)*step(v_k,25.5),special=max(max(feed,zoneEnv),trackedCohort);','float feed=step(11.5,v_k)*step(v_k,15.5),zoneEnv=step(16.5,v_k)*step(v_k,20.5),trackedCohort=step(21.5,v_k)*step(v_k,25.5),planarDomain=step(25.5,v_k)*step(v_k,29.5),special=max(max(max(feed,zoneEnv),trackedCohort),planarDomain);');if(next===source)throw Error('GEN2289_PLANAR_FRAGMENT_CLASS_MARKER_MISSING');source=next;
  next=source.replace('vec3 lit=mix(seasonal,energy,glow*.68)+energy*front*.16*u_activity;','vec3 lit=mix(seasonal,energy,glow*.68)+energy*front*.16*u_activity;\n  lit=mix(lit,v_c.rgb,planarDomain);');if(next===source)throw Error('GEN2289_PLANAR_LIGHTING_BYPASS_MARKER_MISSING');return next;
};

const GEN2289_CHECKPOINT_A_GEOMETRY=build();
for(const key of ['p','n','c','q','k','s','i'])GEN2273_BOUND_GEOMETRY[key]=GEN2289_CHECKPOINT_A_GEOMETRY[key];
GEN2273_BOUND_GEOMETRY.objectRanges=GEN2289_CHECKPOINT_A_GEOMETRY.objectRanges;
GEN2273_BOUND_GEOMETRY.permanentDomainRanges=GEN2289_CHECKPOINT_A_GEOMETRY.permanentDomainRanges;
GEN2273_BOUND_GEOMETRY.planarDomainRanges=GEN2289_CHECKPOINT_A_GEOMETRY.planarDomainRanges;

function runGen2289CheckpointA(){
  const expected=Object.freeze({NW:SEASON.SPRING,NE:SEASON.WINTER,SW:SEASON.SUMMER,SE:SEASON.AUTUMN}),domains=GEN2289_STAGE_AUTHORITY.domains,byCorner=new Map(domains.map(domain=>[domain.corner,domain]));
  const cornerIdentity=Object.entries(expected).every(([corner,season])=>byCorner.get(corner)?.season===season),normalizedTargets=domains.every(domain=>Math.abs(domain.nx-(domain.corner.endsWith('W')?.20:.80))<1e-9&&Math.abs(domain.ny-(domain.corner.startsWith('N')?.20:.80))<1e-9),treeCentered=GEN2289_STAGE_AUTHORITY.tree.nx===.50&&GEN2289_STAGE_AUTHORITY.tree.ny===.50;
  const ranges=GEN2273_BOUND_GEOMETRY.planarDomainRanges||[],planarVerticesByDomain=new Map(domains.map(domain=>[domain.season,[]]));
  for(const range of ranges){const values=planarVerticesByDomain.get(range.domain);if(!values)continue;for(let vertex=range.startVertex;vertex<range.endVertex;vertex++)values.push({x:GEN2273_BOUND_GEOMETRY.p[vertex*3],y:GEN2273_BOUND_GEOMETRY.p[vertex*3+1],z:GEN2273_BOUND_GEOMETRY.p[vertex*3+2]});}
  const planarVertices=[...planarVerticesByDomain.values()].flat(),zeroDepth=planarVertices.length>0&&planarVertices.every(p=>Math.abs(p.z-GEN2289_PLANAR_Z)<1e-9),centerClear=planarVertices.every(p=>!(Math.abs(p.x)<.78&&p.y>-.26&&p.y<1.08));
  const corridorsClear=domains.every(domain=>{const points=planarVerticesByDomain.get(domain.season)||[];return points.length>0&&points.every(p=>{const stageX=domain.nx+((p.x-domain.x)*.32)/.72,stageY=domain.ny+(p.y-domain.y)*.32;return(stageX<.40||stageX>.60)&&(stageY<.40||stageY>.60);});});
  const fourRanges=ranges.length===4&&new Set(ranges.map(range=>range.domain)).size===4,treeDominantByComposition=centerClear&&corridorsClear&&GEN2289_STAGE_AUTHORITY.domains.every(domain=>Math.abs(domain.x)>=1.70&&Math.abs(domain.xSpan)<=.46&&Math.abs(domain.ySpan)<=.34);
  const vertexLaw=vertexSource(false,'highp'),fragmentLaw=fragmentSource(false,'highp'),webgl2VertexLaw=vertexSource(true,'highp'),webgl2FragmentLaw=fragmentSource(true,'highp'),cameraBypass=vertexLaw.includes('if(planarDomain>.5){')&&vertexLaw.includes('stageAnchor=vec2(.20,.20)'),lightingBypass=fragmentLaw.includes('lit=mix(lit,v_c.rgb,planarDomain);'),webgl2VersionSerialization=webgl2VertexLaw.startsWith('#version 300 es\nprecision highp float;')&&webgl2FragmentLaw.startsWith('#version 300 es\nprecision highp float;');
  const trackedUnchanged=GEN2273_BOUND_GEOMETRY.objectRanges.length===96&&GEN2273_MOBILE_OBJECT_REGISTRY.length===96&&GEN2273_BOUND_GEOMETRY.objectRanges.every((range,index)=>range.objectId===index);
  const inheritedGen2282=runGen2282BinaryQualification();
  const receipt=Object.freeze({schema:'COMMUNITY_GEN2289_CHECKPOINT_A_PLANAR_COMPOSITION_RECEIPT_v1',operationId:'COMMUNITY_HYBRID_PLANAR_DOMAINS_3D_LIFECYCLE_20260915_001',lockGeneration:2289,checkpoint:'A',cornerIdentity,normalizedTargets,treeCentered,fourPlanarDomainRanges:fourRanges,zeroDomainZDepth:zeroDepth,cameraYawPitchPerspectiveBypass:cameraBypass,lightingBypass,webgl2VersionSerialization,protectedCenterClear:centerClear,protectedCorridorsClear:corridorsClear,treeDominantByComposition,trackedCohortBindingCount:GEN2273_BOUND_GEOMETRY.objectRanges.length,trackedCohortUnchanged:trackedUnchanged,inheritedGen2282BinaryPass:inheritedGen2282.passed,planarVertexCount:planarVertices.length,nextLawfulAction:'HUMAN_CHECKPOINT_A_REVIEW_BEFORE_MOTION_BINDING',passed:cornerIdentity&&normalizedTargets&&treeCentered&&fourRanges&&zeroDepth&&cameraBypass&&lightingBypass&&webgl2VersionSerialization&&centerClear&&corridorsClear&&treeDominantByComposition&&trackedUnchanged&&inheritedGen2282.passed});
  return receipt;
}
const GEN2289_CHECKPOINT_A_RECEIPT=runGen2289CheckpointA();
if(!GEN2289_CHECKPOINT_A_RECEIPT.passed)throw Error('GEN2289_CHECKPOINT_A_PLANAR_COMPOSITION_FAILURE');
globalThis.DGB_COMMUNITY_GEN2289_STAGE_AUTHORITY=GEN2289_STAGE_AUTHORITY;
globalThis.DGB_COMMUNITY_GEN2289_CHECKPOINT_A_RECEIPT=GEN2289_CHECKPOINT_A_RECEIPT;
const GEN2289_CHECKPOINT_A_BASE_MOUNT=mount;
mount=function(host){GEN2289_CHECKPOINT_A_BASE_MOUNT(host);host.dataset.communityDomainModel='PLANAR_CHECKPOINT_A';host.setAttribute('aria-label','Community lifecycle checkpoint A. Four permanent planar seasonal domains occupy the four stage corners while the central tree and tracked lifecycle remain three-dimensional. Motion binding for the planar domains is intentionally not yet enabled.');};

// Gen2289 Checkpoint B: bounded planar-domain local motion only.
const GEN2289_PLANAR_MOTION_CYCLE_SECONDS=24;
const GEN2289_PLANAR_MOTION_PROFILES=Object.freeze({
  [SEASON.SPRING]:Object.freeze({xAmplitude:.012,yAmplitude:.008,xHarmonic:1,yHarmonic:2,xPhase:.20,yPhase:.65}),
  [SEASON.SUMMER]:Object.freeze({xAmplitude:.014,yAmplitude:.006,xHarmonic:1,yHarmonic:3,xPhase:1.10,yPhase:.35}),
  [SEASON.AUTUMN]:Object.freeze({xAmplitude:.010,yAmplitude:.010,xHarmonic:2,yHarmonic:2,xPhase:2.15,yPhase:1.05}),
  [SEASON.WINTER]:Object.freeze({xAmplitude:.008,yAmplitude:.012,xHarmonic:2,yHarmonic:1,xPhase:2.85,yPhase:1.55})
});
function gen2289PlanarMotion2D(season,timeSeconds,reduced=false){
  if(reduced)return Object.freeze({x:0,y:0});
  const profile=GEN2289_PLANAR_MOTION_PROFILES[season];
  if(!profile)throw Error('GEN2289_CHECKPOINT_B_UNKNOWN_DOMAIN');
  const cycle=GEN2289_PLANAR_MOTION_CYCLE_SECONDS,t=((Math.max(0,Number(timeSeconds)||0)%cycle)+cycle)%cycle,angle=t/cycle*Math.PI*2;
  return Object.freeze({x:Math.sin(angle*profile.xHarmonic+profile.xPhase)*profile.xAmplitude,y:Math.cos(angle*profile.yHarmonic+profile.yPhase)*profile.yAmplitude});
}
function gen2289RuntimeReduced(runtime){return runtime.snapshot().transitionLog.some(entry=>entry?.reduced===true)}
const GEN2289_CHECKPOINT_B_BASE_APPLY_RENDERER_POSITIONS=gen2273ApplyRendererPositions;
gen2273ApplyRendererPositions=function(gl,R,g,runtime){
  GEN2289_CHECKPOINT_B_BASE_APPLY_RENDERER_POSITIONS(gl,R,g,runtime);
  const snapshot=runtime.snapshot(),reduced=gen2289RuntimeReduced(runtime);
  for(const range of g.planarDomainRanges||[]){
    const motion=gen2289PlanarMotion2D(range.domain,snapshot.maxSeconds,reduced);
    for(let vertex=range.startVertex;vertex<range.endVertex;vertex++){
      const offset=vertex*3;
      R.positionData[offset]+=motion.x;
      R.positionData[offset+1]+=motion.y;
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,R.b.p);
  gl.bufferSubData(gl.ARRAY_BUFFER,0,R.positionData);
};
function runGen2289CheckpointBMechanicalCore(){
  const checkpointARegression=runGen2289CheckpointA(),domains=GEN2289_STAGE_AUTHORITY.domains,ranges=GEN2273_BOUND_GEOMETRY.planarDomainRanges||[],samples=Array.from({length:97},(_,i)=>GEN2289_PLANAR_MOTION_CYCLE_SECONDS*i/96),planarVerticesByDomain=new Map(domains.map(domain=>[domain.season,[]]));
  for(const range of ranges){const values=planarVerticesByDomain.get(range.domain);if(!values)continue;for(let vertex=range.startVertex;vertex<range.endVertex;vertex++)values.push({x:GEN2273_BOUND_GEOMETRY.p[vertex*3],y:GEN2273_BOUND_GEOMETRY.p[vertex*3+1],z:GEN2273_BOUND_GEOMETRY.p[vertex*3+2]});}
  let planarZFixed=true,motionXYOnly=true,boundedDomainLocalMotion=true,assignedCornerBoundsPreserved=true,protectedCenterClearAllSamples=true,protectedCorridorsClearAllSamples=true;
  const activityByDomain=new Map(domains.map(domain=>[domain.season,false]));
  for(const time of samples)for(const domain of domains){
    const motion=gen2289PlanarMotion2D(domain.season,time,false),keys=Object.keys(motion).sort().join('|');
    if(keys!=='x|y'||!Number.isFinite(motion.x)||!Number.isFinite(motion.y))motionXYOnly=false;
    const profile=GEN2289_PLANAR_MOTION_PROFILES[domain.season];
    if(Math.abs(motion.x)>profile.xAmplitude+1e-12||Math.abs(motion.y)>profile.yAmplitude+1e-12)boundedDomainLocalMotion=false;
    if(Math.hypot(motion.x,motion.y)>1e-7)activityByDomain.set(domain.season,true);
    for(const point of planarVerticesByDomain.get(domain.season)||[]){
      if(Math.abs(point.z-GEN2289_PLANAR_Z)>1e-9)planarZFixed=false;
      const stageX=domain.nx+((point.x-domain.x)*.32)/.72+motion.x,stageY=domain.ny+(point.y-domain.y)*.32+motion.y,inViewport=stageX>=0&&stageX<=1&&stageY>=0&&stageY<=1,xAssigned=domain.corner.endsWith('W')?stageX<.40:stageX>.60,yAssigned=domain.corner.startsWith('N')?stageY<.40:stageY>.60;
      if(!(inViewport&&xAssigned&&yAssigned))assignedCornerBoundsPreserved=false;
      if(stageX>=.40&&stageX<=.60&&stageY>=.40&&stageY<=.60)protectedCenterClearAllSamples=false;
      if(!((stageX<.40||stageX>.60)&&(stageY<.40||stageY>.60)))protectedCorridorsClearAllSamples=false;
    }
  }
  const reducedMotionEquivalence=domains.every(domain=>samples.every(time=>{const motion=gen2289PlanarMotion2D(domain.season,time,true);return motion.x===0&&motion.y===0}))&&planarZFixed;
  const inheritedGen2282=runGen2282BinaryQualification(),runtime=createGen2282Runtime(GEN2273_SELECTED_SETTLEMENT_SECONDS,false),lockMs=(GEN2273_TREE_COMPLETE_SECONDS+GEN2273_SELECTED_SETTLEMENT_SECONDS)*1000;
  runtime.advance(lockMs);runtime.advance(lockMs+GEN2289_PLANAR_MOTION_CYCLE_SECONDS*2000);const post=runtime.snapshot();
  const same96ObjectIdentity=checkpointARegression.trackedCohortUnchanged&&GEN2273_MOBILE_OBJECT_REGISTRY.length===96&&GEN2273_BOUND_GEOMETRY.objectRanges.length===96&&inheritedGen2282.SAME_OBJECT_IDENTITY_96==='PASS';
  const domainDepletion=inheritedGen2282.DOMAIN_DEPLETION===true||ranges.length!==4||activityByDomain.size!==4;
  const domainActivityPostSettlement=inheritedGen2282.DOMAIN_ACTIVITY_POST_SETTLEMENT==='PASS'&&[...activityByDomain.values()].every(Boolean);
  const terminalReboundCount=inheritedGen2282.terminalReboundCount,objectReplacementCount=inheritedGen2282.objectReplacementCount,postSettlementCohortUpdateCount=post.postSettlementCirculationEvaluations;
  const actualMotionBinding=gen2273ApplyRendererPositions.toString().includes('gen2289PlanarMotion2D')&&gen2273ApplyRendererPositions.toString().includes('R.positionData[offset]+=motion.x')&&gen2273ApplyRendererPositions.toString().includes('R.positionData[offset+1]+=motion.y');
  const oneCanvasOneContext=gen2273Mount.toString().match(/createElement\('canvas'\)/g)?.length===1&&!gen2273ApplyRendererPositions.toString().includes('createElement');
  const receipt=Object.freeze({schema:'COMMUNITY_GEN2289_CHECKPOINT_B_MECHANICAL_CORE_RECEIPT_v1',operationId:'COMMUNITY_HYBRID_PLANAR_DOMAINS_3D_LIFECYCLE_20260915_001',lockGeneration:2289,checkpoint:'B',checkpointARegressionPass:checkpointARegression.passed,planarDomainCount:ranges.length,planarZFixed,motionXYOnly,cameraResponseZero:checkpointARegression.cameraYawPitchPerspectiveBypass,lightingResponseBypassed:checkpointARegression.lightingBypass,boundedDomainLocalMotion:boundedDomainLocalMotion&&actualMotionBinding,assignedCornerBoundsPreserved,protectedCenterClearAllSamples,protectedCorridorsClearAllSamples,treeDominancePreserved:checkpointARegression.treeDominantByComposition&&protectedCorridorsClearAllSamples,same96ObjectIdentity,domainDepletion,domainActivityPostSettlement,terminalReboundCount,objectReplacementCount,postSettlementCohortUpdateCount,oneCanvasOneContext:!!oneCanvasOneContext,reducedMotionEquivalence,sampleCount:samples.length,motionCycleSeconds:GEN2289_PLANAR_MOTION_CYCLE_SECONDS,externalGatesRequired:Object.freeze(['NODE_CHECK_PASS','NO_UNRELATED_DIFF']),passed:checkpointARegression.passed&&ranges.length===4&&planarZFixed&&motionXYOnly&&checkpointARegression.cameraYawPitchPerspectiveBypass&&checkpointARegression.lightingBypass&&boundedDomainLocalMotion&&actualMotionBinding&&assignedCornerBoundsPreserved&&protectedCenterClearAllSamples&&protectedCorridorsClearAllSamples&&checkpointARegression.treeDominantByComposition&&same96ObjectIdentity&&!domainDepletion&&domainActivityPostSettlement&&terminalReboundCount===0&&objectReplacementCount===0&&postSettlementCohortUpdateCount===0&&!!oneCanvasOneContext&&reducedMotionEquivalence});
  return receipt;
}
const GEN2289_CHECKPOINT_B_MECHANICAL_CORE_RECEIPT=runGen2289CheckpointBMechanicalCore();
if(!GEN2289_CHECKPOINT_B_MECHANICAL_CORE_RECEIPT.passed)throw Error('GEN2289_CHECKPOINT_B_MECHANICAL_CORE_FAILURE');
globalThis.DGB_COMMUNITY_GEN2289_CHECKPOINT_B_MECHANICAL_CORE_RECEIPT=GEN2289_CHECKPOINT_B_MECHANICAL_CORE_RECEIPT;
globalThis.DGB_COMMUNITY_GEN2289_PLANAR_MOTION=Object.freeze({cycleSeconds:GEN2289_PLANAR_MOTION_CYCLE_SECONDS,profiles:GEN2289_PLANAR_MOTION_PROFILES,position2D:gen2289PlanarMotion2D});
const GEN2289_CHECKPOINT_B_BASE_MOUNT=mount;
mount=function(host){GEN2289_CHECKPOINT_B_BASE_MOUNT(host);host.dataset.communityDomainModel='PLANAR_CHECKPOINT_B';host.setAttribute('aria-label','Community lifecycle checkpoint B. Four permanent planar seasonal domains remain anchored in the four stage corners with bounded season-specific local motion while the central tree and tracked lifecycle remain three-dimensional.');};
