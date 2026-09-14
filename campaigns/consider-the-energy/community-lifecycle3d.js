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
  seasons: Object.freeze(['SPRING','SUMMER','AUTUMN','WINTER']),
  phaseWindows: Object.freeze({SEED:[0,.09],ROOTS:[.09,.22],NETWORK:[.22,.35],GROWTH:[.35,.56],TREE_LOCK:[.56,.64],SETTLEMENT:[.64,.78],CONTRIBUTION:[.78,.90],RENEWAL:[.90,1]}),
  treeLock: .56,
  inspectionYawLimitDegrees: 22,
  renderer: 'ONE_CONTEXT_WEBGL_FIXED_GEOMETRY_SHADER_PROGRESS',
  lifecycleMode: 'ONE_SHOT_INTRO_THEN_MATURE_LOCK',
  environment: 'FOUR_PERMANENT_SPATIAL_QUADRANT_VOLUMES',
  environmentCycleSeconds: 72,
  environmentSectors: Object.freeze(['SPRING_FLOWERS_POLLEN','SUMMER_RAIN_WIND','AUTUMN_LEAVES','WINTER_SNOW']),
  environmentDepthPlanes: Object.freeze(['BACKGROUND','MIDGROUND','FOREGROUND']),
  formationFeedMode: 'ZONE_ORIGIN_TO_CENTER_DEPTH_CURVE',
  futureLifecycleHandoff: 'FORMATION_FEEDS_THEN_TREE_HOLD_THEN_QUADRANT_AMBIENCE',
  feedOrbitRevolutions: 0,
  feedingWindowSeconds: Object.freeze([3.5,14.5]),
  dockingWindowSeconds: Object.freeze([14.5,16.5]),
  guideDissolveWindowSeconds: Object.freeze([16.5,18.4]),
  matureLockSeconds: 18.4,
  protectedCenter: true,
  rimTaper: 'SUPERSEDED_BY_PERMANENT_QUADRANT_VOLUMES',
  postLockFeeding: false,
  topologyRandomness: false,
  cycleSeconds: 18.4
});

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
  ZONE_SPRING:17,ZONE_SUMMER:18,ZONE_AUTUMN:19,ZONE_WINTER:20
});
const SEASON=Object.freeze({NONE:-1,SPRING:0,SUMMER:1,AUTUMN:2,WINTER:3});
const DEPTH=Object.freeze({BACKGROUND:0,MIDGROUND:1,FOREGROUND:2});

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
function flower(g,o,q,kind=KIND.SPRING,season=SEASON.SPRING,scale0=1,alpha=1){
  const petal=[.95,.52,.67,alpha],center=[1,.78,.32,alpha];
  orb(g,o,V(.035,.035,.028),center,q,kind,6,3,season);
  for(let i=0;i<5;i++){const a=Math.PI*2*i/5,p=A(o,V(Math.cos(a)*.065*scale0,Math.sin(a)*.065*scale0,(i%2-.5)*.02));orb(g,p,V(.052,.033,.025),petal,q,kind,6,3,season)}
}
function blossom(g,o,q,scale0=1){flower(g,o,q,KIND.SPRING,SEASON.SPRING,scale0)}
function snowflake(g,o,r,q,kind=KIND.WINTER,season=SEASON.WINTER,alpha=1){
  const c=[.72,.90,1,alpha];
  for(let i=0;i<6;i++){const a=Math.PI*i/3,e=V(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r,o.z);tube(g,o,e,.012,.005,q,q,c,kind,5,900+i,season);const m=L(o,e,.62),p1=A(m,V(-Math.sin(a)*r*.18,Math.cos(a)*r*.18,0)),p2=A(m,V(Math.sin(a)*r*.18,-Math.cos(a)*r*.18,0));tube(g,m,p1,.007,.003,q,q,c,kind,5,920+i,season);tube(g,m,p2,.007,.003,q,q,c,kind,5,940+i,season)}
}
function frost(g,o,r,q){snowflake(g,o,r,q)}
function bird(g,o,q){const c=[.98,.86,.58,1],l=A(o,V(-.20,.05,0)),r=A(o,V(.20,.05,0)),c0=A(o,V(0,-.015,.02));arc(g,l,A(o,V(-.10,.14,.02)),c0,.014,q,q,c,KIND.SPRING,970,SEASON.SPRING,6);arc(g,c0,A(o,V(.10,.14,.02)),r,.014,q,q,c,KIND.SPRING,980,SEASON.SPRING,6)}
function leaf(g,o,q,kind,season,scale0=1,color=[.82,.40,.08,1]){orb(g,o,V(.075*scale0,.035*scale0,.028*scale0),color,q,kind,7,3,season)}
function rainStroke(g,o,q,kind,season,scale0=1,color=[.12,.58,.90,.88]){tube(g,A(o,V(-.035,.075,.018)),A(o,V(.035,-.085,-.018)),.011*scale0,.006*scale0,q,q,color,kind,5,1120+Math.round(q*100),season)}
function windStroke(g,o,q,kind,season,scale0=1,color=[.28,.78,.90,.78]){arc(g,A(o,V(-.12*scale0,0,0)),A(o,V(0,.065*scale0,.025)),A(o,V(.13*scale0,0,0)),.009,q,q,color,kind,1180+Math.round(q*100),season,6)}

const ZONE_CENTERS=Object.freeze([
  Object.freeze({x:-2.36,y:1.74}),
  Object.freeze({x:-2.48,y:-.18}),
  Object.freeze({x:2.48,y:-.18}),
  Object.freeze({x:2.36,y:1.74})
]);
const ZONE_LAYERS=Object.freeze([
  Object.freeze({z:-1.06,spreadX:1.02,spreadY:.72,scale:.62,alpha:.30,count:5}),
  Object.freeze({z:-.12,spreadX:1.10,spreadY:.80,scale:.88,alpha:.58,count:7}),
  Object.freeze({z:.88,spreadX:.92,spreadY:.68,scale:1.18,alpha:.82,count:4})
]);
function zonePoint(season,layer,i,count){
  const c=ZONE_CENTERS[season],d=ZONE_LAYERS[layer],a=Math.PI*2*(i+.31*season+.17*layer)/count,radial=.42+.50*((i*7+season*3+layer*5)%Math.max(2,count))/Math.max(1,count-1);
  return V(c.x+Math.cos(a)*d.spreadX*radial,c.y+Math.sin(a)*d.spreadY*radial,d.z+Math.sin(a*1.7+season*.8)*(.14+layer*.05));
}
function zoneKind(season){return[KIND.ZONE_SPRING,KIND.ZONE_SUMMER,KIND.ZONE_AUTUMN,KIND.ZONE_WINTER][season]}
function addZoneElement(g,season,layer,i,count){
  const d=ZONE_LAYERS[layer],p=zonePoint(season,layer,i,count),q=.08+season*.17+layer*.025+i*.009,kind=zoneKind(season),s=d.scale*(.88+(i%3)*.09),alpha=d.alpha;
  if(season===SEASON.SPRING){
    if(i%2===0)flower(g,p,q,kind,season,s,alpha);
    else orb(g,p,V(.034*s,.024*s,.026*s),i%3?[.98,.61,.74,alpha]:[1,.79,.38,alpha],q,kind,5,3,season);
    return;
  }
  if(season===SEASON.SUMMER){
    rainStroke(g,p,q,kind,season,s,[.12,.58,.90,alpha]);
    if(i%3===0)windStroke(g,A(p,V(.08*s,.03*s,.02)),q,kind,season,.76*s,[.28,.78,.90,alpha*.86]);
    return;
  }
  if(season===SEASON.AUTUMN){
    leaf(g,p,q,kind,season,s,i%2?[.94,.49,.08,alpha]:[.68,.27,.035,alpha]);
    return;
  }
  if(i%2===0)snowflake(g,p,.060*s,q,kind,season,alpha);
  else orb(g,p,V(.030*s,.030*s,.025*s),[.74,.91,1,alpha],q,kind,5,3,season);
}
function addEnvironment(g){
  const dockSpring=V(-1.06,1.48,.18),dockSummer=V(-1.17,.72,.15),dockAutumn=V(1.10,.76,.14),dockWinter=V(1.02,1.54,.16);
  [V(-.10,.04,0),V(.02,.12,.02),V(.12,-.03,-.01)].forEach((d,i)=>flower(g,A(dockSpring,d),.80,KIND.FEED_SPRING,SEASON.SPRING,.92+i*.08));
  [V(-.12,.10,.00),V(-.03,.03,.02),V(.08,.12,-.02),V(.14,-.01,.03)].forEach((d,i)=>rainStroke(g,A(dockSummer,d),.81,KIND.FEED_SUMMER,SEASON.SUMMER,.95+i*.04));
  windStroke(g,A(dockSummer,V(0,-.12,.01)),.81,KIND.FEED_SUMMER,SEASON.SUMMER,1.1);
  [V(-.13,.08,.00),V(-.02,.14,.02),V(.10,.07,-.02),V(-.08,-.06,.03),V(.11,-.08,.01)].forEach((d,i)=>leaf(g,A(dockAutumn,d),.82,KIND.FEED_AUTUMN,SEASON.AUTUMN,.90+(i%2)*.18,i%2?[.91,.48,.09,1]:[.69,.29,.045,1]));
  [V(-.10,.05,.00),V(.08,.11,.02),V(.05,-.08,-.02)].forEach((d,i)=>snowflake(g,A(dockWinter,d),.075+i*.008,.83,KIND.FEED_WINTER,SEASON.WINTER));
  for(let season=0;season<4;season++)for(let layer=0;layer<3;layer++){const count=ZONE_LAYERS[layer].count;for(let i=0;i<count;i++)addZoneElement(g,season,layer,i,count)}
}

function build(){
  const g=mesh();
  const bark=[.20,.12,.065,1],dark=[.105,.064,.035,1],network=[.055,.18,.22,1],coreGold=[.82,.58,.18,1],springGreen=[.08,.28,.12,1],summerGreen=[.03,.20,.11,1],water=[.08,.42,.72,.92],autumn=[.72,.35,.07,1],winter=[.64,.77,.82,1],returnBlue=[.04,.22,.34,1];
  const O=V(0,-.28,0);
  cubeCore(g,V(0,-.05,0),.52,coreGold);
  const roots=[V(-1.46,-1.05,.26),V(-1.06,-1.22,-.48),V(-.38,-1.30,-.74),V(.42,-1.28,-.70),V(1.10,-1.18,-.42),V(1.48,-1.04,.28),V(.91,-1.21,.67),V(-.91,-1.20,.69)];
  roots.forEach((e,i)=>{const m=L(O,e,.48);tube(g,O,A(m,V(0,.04,0)),.17,.084,.09,.16,bark,KIND.ROOT,8,10+i);tube(g,A(m,V(0,.04,0)),e,.084,.028,.16,.22,dark,KIND.ROOT,7,30+i)});
  for(let i=0;i<roots.length;i++){const a=roots[i],b=roots[(i+1)%roots.length],m=A(L(a,b,.5),V(0,.12,0));tube(g,a,m,.023,.019,.22,.28,network,KIND.NETWORK,6,50+i*2);tube(g,m,b,.019,.023,.28,.33,network,KIND.NETWORK,6,51+i*2)}
  for(let i=0;i<4;i++){const h=V(0,-.96+i*.012,-.04+i*.02);tube(g,roots[i],h,.017,.023,.25,.31,network,KIND.NETWORK,5,70+i);tube(g,h,roots[i+4],.023,.017,.31,.35,network,KIND.NETWORK,5,80+i)}
  const trunk=[[O,V(-.07,.10,.03),.22,.18,.35,.40],[V(-.07,.10,.03),V(.05,.58,-.03),.18,.145,.40,.46],[V(.05,.58,-.03),V(-.04,1.04,.04),.145,.112,.46,.51],[V(-.04,1.04,.04),V(.03,1.43,-.02),.112,.082,.51,.56]];
  trunk.forEach((s,i)=>tube(g,s[0],s[1],s[2],s[3],s[4],s[5],i<2?bark:dark,KIND.TREE,8,100+i));
  const tips=[V(-1.43,.56,.30),V(-1.20,.98,-.18),V(-.89,1.42,.20),V(-.44,1.72,-.10),V(.42,1.79,-.10),V(.91,1.51,.18),V(1.22,1.08,-.24),V(1.43,.66,.23),V(.03,1.99,.10)];
  const starts=[V(-.06,.29,.03),V(.03,.52,-.02),V(-.02,.74,.02),V(0,.92,.02),V(.02,1.15,-.01),V(.03,1.34,-.02)];
  tips.forEach((t,i)=>{const s=starts[Math.min(starts.length-1,Math.floor(i*starts.length/tips.length))],side=i%2?-1:1,b=V((s.x+t.x)*.52+side*.06,mix(s.y,t.y,.48)+.12,(s.z+t.z)*.48+(i%3-1)*.09);tube(g,s,b,.078-i*.003,.044,.42+i*.006,.50+i*.004,bark,KIND.TREE,7,120+i*2);tube(g,b,t,.044,.018,.50+i*.004,.56,i%3===0?dark:bark,KIND.TREE,6,121+i*2)});
  [[-.95,1.48,.06,.32,.22,.23,SEASON.SPRING,springGreen],[-.56,1.78,.00,.34,.24,.24,SEASON.SPRING,springGreen],[-.84,.92,.18,.28,.21,.22,SEASON.SUMMER,summerGreen],[-.42,1.22,-.08,.30,.22,.23,SEASON.SUMMER,summerGreen],[.48,1.20,.06,.30,.22,.23,SEASON.AUTUMN,autumn],[.91,.91,-.07,.28,.21,.22,SEASON.AUTUMN,autumn],[.58,1.76,.03,.34,.24,.24,SEASON.WINTER,winter],[.96,1.45,.08,.31,.22,.23,SEASON.WINTER,winter]].forEach((x)=>orb(g,V(x[0],x[1],x[2]),V(x[3],x[4],x[5]),x[7],.548,KIND.TREE,7,4,x[6]));
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
  for(let i=0;i<autumnNodes.length-1;i++)tube(g,autumnNodes[i],autumnNodes[i+1],.012,.012,.69+i*.008,.69+i*.008,bark,KIND.AUTUMN,5,460+i,SEASON.AUTUMN);
  gear(g,V(.55,-.67,.24),.20,8,.72,[.58,.37,.16,.82]);gear(g,V(.93,-.82,.05),.16,7,.745,[.47,.31,.17,.74]);gear(g,V(.25,-.91,-.16),.13,6,.758,[.50,.34,.19,.70]);
  const winterBase=V(.28,1.26,.02),winterTips=[V(.62,1.57,.08),V(.91,1.73,-.03),V(1.15,1.50,.05),V(.78,1.96,.04),V(1.22,1.89,.09)];
  winterTips.forEach((p,i)=>{tube(g,winterBase,p,.026,.008,.65+i*.014,.69+i*.014,i%2?bark:dark,KIND.WINTER,5,490+i,SEASON.WINTER);frost(g,p,.09+i*.008,.71+i*.012)});
  [V(.63,1.35,.03),V(.95,1.30,-.02)].forEach((p,i)=>orb(g,p,V(.07,.12,.065),[.43,.58,.55,1],.74+i*.012,KIND.WINTER,7,4,SEASON.WINTER));
  const contrib=[V(-1.36,.62,.30),V(-.77,1.52,.18),V(-.36,1.77,-.06),V(.48,1.81,-.05),V(.92,1.56,.11),V(1.32,.89,.08),V(.02,2.08,.07)];
  contrib.forEach((p,i)=>orb(g,p,V(.065,.082,.06),[.98,.71,.20,1],.79+i*.013,KIND.CONTRIBUTION,7,4,i<3?SEASON.SPRING:i<4?SEASON.SUMMER:i<6?SEASON.AUTUMN:SEASON.WINTER));
  [[contrib[0],roots[1],-1],[contrib[2],roots[7],-1],[contrib[4],roots[6],1],[contrib[5],roots[4],1],[contrib[6],roots[3],1]].forEach(([a,b,side],i)=>arc(g,a,V(side*(1.72+i*.08),.22+i*.08,.72-i*.18),b,.019,.90+i*.012,.985,returnBlue,KIND.RETURN,1000+i*24,SEASON.NONE,16));
  addEnvironment(g);
  if(g.p.length/3>65535)throw Error('LIFECYCLE_VERTEX_BUDGET');
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
uniform float u_yaw,u_pitch,u_scale,u_aspect,u_camera,u_time,u_intro,u_progress,u_reduced;
${webgl2?'out':'varying'} vec3 v_n;
${webgl2?'out':'varying'} vec4 v_c;
${webgl2?'out':'varying'} float v_q,v_k,v_s,v_settle;
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
    vec3 dock=vec3(-1.06,1.48,.18),source=vec3(-2.36,1.74,.72);
    float delay=0.0;
    if(a_kind>12.5&&a_kind<13.5){dock=vec3(-1.17,.72,.15);source=vec3(-2.48,-.18,.58);delay=.22;}
    else if(a_kind>13.5&&a_kind<14.5){dock=vec3(1.10,.76,.14);source=vec3(2.48,-.18,.66);delay=.44;}
    else if(a_kind>14.5){dock=vec3(1.02,1.54,.16);source=vec3(2.36,1.74,.76);delay=.66;}
    float travel=ss(3.5+delay,14.5+delay,u_intro);
    if(u_reduced>.5)travel=1.0;
    vec3 control=(source+dock)*.5+vec3(source.x<0.0?.24:-.24,.34,1.05);
    float u=1.0-travel;
    vec3 feedPos=u*u*source+2.0*u*travel*control+travel*travel*dock;
    p+=feedPos-dock;
  }

  float zoneEnv=step(16.5,a_kind)*step(a_kind,20.5);
  if(zoneEnv>.5&&u_reduced<.5){
    float depth=clamp((p.z+1.25)/2.45,0.0,1.0);
    float ambient=mix(.34,1.0,ss(16.5,18.4,u_intro));
    float amp=mix(.018,.105,depth)*ambient;
    float speed=mix(.36,1.08,depth);
    float phase=a_phase*43.0+(a_kind-17.0)*2.3;
    if(a_kind<17.5){
      p.x+=sin(u_time*.52*speed+phase)*amp*.72;
      p.y+=cos(u_time*.44*speed+phase*.83)*amp*.58;
      p.z+=sin(u_time*.31*speed+phase*.41)*amp*.20;
    }else if(a_kind<18.5){
      p.x+=sin(u_time*.82*speed+phase)*amp*.48;
      p.y+=sin(u_time*1.42*speed+phase*.67)*amp*.92;
      p.z+=cos(u_time*.55*speed+phase*.37)*amp*.16;
    }else if(a_kind<19.5){
      p.x+=sin(u_time*.68*speed+phase)*amp*.88;
      p.y+=cos(u_time*.57*speed+phase*.71)*amp*.70;
      p.z+=sin(u_time*.46*speed+phase*.29)*amp*.22;
    }else{
      p.x+=sin(u_time*.76*speed+phase)*amp*.82;
      p.y+=cos(u_time*.93*speed+phase*.62)*amp*.78;
      p.z+=sin(u_time*.39*speed+phase*.33)*amp*.18;
    }
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
  v_n=normalize(n);v_c=a_color;v_q=a_phase;v_k=a_kind;v_s=a_season;v_settle=settle;
}`}
function fragmentSource(webgl2,precision){return`${webgl2?'#version 300 es\n':''}precision ${precision} float;
${webgl2?'in':'varying'} vec3 v_n;${webgl2?'in':'varying'} vec4 v_c;
${webgl2?'in':'varying'} float v_q,v_k,v_s,v_settle;
uniform float u_time,u_intro,u_progress,u_activity,u_retained,u_renewal,u_reduced;
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
  float circ=(.5+.5*sin(u_time*.72-v_q*23.0))*reached;
  float envPulse=(.55+.45*sin(u_time*(.62+.08*max(0.0,v_k-17.0))+v_q*29.0))*zoneEnv;
  float glow=(reached*.18+front*.72)*u_activity+network*reached*.10+core*(.22+.12*circ)+contrib*reached*(.30+.20*circ)+renew*u_renewal*(.24+.38*front)+star*reached*.35+u_retained*(1.0-ss(.22,.40,v_q))*.18+feed*(.18+.20*circ)+zoneEnv*(.10+.15*envPulse);
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
  const U=n=>gl.getUniformLocation(p,n),u={yaw:U('u_yaw'),pitch:U('u_pitch'),scale:U('u_scale'),aspect:U('u_aspect'),camera:U('u_camera'),time:U('u_time'),intro:U('u_intro'),progress:U('u_progress'),activity:U('u_activity'),retained:U('u_retained'),renewal:U('u_renewal'),reduced:U('u_reduced')};
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
function environmentState(ms,reduced=false){
  const intro=CONTRACT.cycleSeconds*1000;
  if(reduced)return{active:true,phase:'FOUR_QUADRANT_STATIC',progress:1,color:[.012,.026,.052,.68]};
  if(ms<intro){
    const u=clamp(ms/intro);
    return{active:true,phase:'FORMATION_FEEDS',progress:u,color:[mix(.006,.014,u),mix(.014,.028,u),mix(.032,.055,u),.66]};
  }
  const period=CONTRACT.environmentCycleSeconds*1000,t=((ms-intro)%period+period)%period,u=t/period;
  const frames=[
    {at:0,phase:'QUADRANT_AMBIENCE_DAWN',color:[.014,.030,.060,.68]},
    {at:.25,phase:'QUADRANT_AMBIENCE_DAY',color:[.018,.070,.080,.60]},
    {at:.50,phase:'QUADRANT_AMBIENCE_DUSK',color:[.095,.038,.020,.70]},
    {at:.75,phase:'QUADRANT_AMBIENCE_NIGHT',color:[.004,.010,.034,.78]},
    {at:1,phase:'QUADRANT_AMBIENCE_DAWN',color:[.014,.030,.060,.68]}
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
  let canvas,gl,R,backend,io,ro,raf=0,dead=false,contextLost=false,visible=true,start=performance.now(),last=start,baseYaw=-.20,targetYaw=baseYaw,yaw=baseYaw,targetPitch=-.055,pitch=targetPitch,drag=null,frameCount=0,contextLossCount=0,contextRestoreCount=0,firstProof=null,treeState=reduced?'TREE_MATURE_LOCK':'INTRO_LIFECYCLE',environmentPhase=reduced?'FOUR_QUADRANT_STATIC':'FORMATION_FEEDS';
  const publishReceipt=(failure=null,extra={})=>{globalThis.DGB_COMMUNITY_LIFECYCLE_3D_RECEIPT=Object.freeze({
    contract:CONTRACT,initialized:!!R&&!failure,firstDraw:!!firstProof?.passed,visibleFrame:!!firstProof?.passed,backend:backend?.id||null,webglContexts:backend?1:0,webglVersion:backend?.webglVersion||null,shaderLanguage:backend?.shaderLanguage||null,precision:R?.precision||null,frameCount,contextLossCount,contextRestoreCount,
    fixedGeometry:true,geometryRebuiltPerFrame:false,treeLockPhase:.56,seasonCount:4,settlementDeterministic:true,boundedInspectionDegrees:22,reducedMotion:reduced,
    treeCycleMode:CONTRACT.lifecycleMode,treeCycleComplete:treeState==='TREE_MATURE_LOCK',treeState,environmentActive:true,environmentPhase,environmentCycleSeconds:CONTRACT.environmentCycleSeconds,
    environmentMode:CONTRACT.environment,environmentSectorCount:4,environmentDepthPlaneCount:CONTRACT.environmentDepthPlanes.length,permanentQuadrantZones:true,feedPathMode:CONTRACT.formationFeedMode,feedOrbitRevolutions:0,feedingStopsAtSeconds:16.5,guideRemnantsAfterLock:false,postLockFeeding:false,protectedCenter:true,rimTaper:CONTRACT.rimTaper,
    fallbackPreserved:false,fallbackRemoved:true,vertexCount:R?.vertices||geometry.p.length/3,triangleCount:R?.triangles||geometry.i.length/3,visibleFrameProof:firstProof,backendAttempts:attempts.map(x=>({...x})),failure,...extra
  })};
  const publishFailure=(reason,extra={})=>{host.removeAttribute('data-lifecycle-ready');host.dataset.lifecycleStatus=reason;host.dataset.lifecycleFallback='none';publishReceipt(reason,extra)};
  const makeCanvas=()=>{const c=doc.createElement('canvas');c.className='community-lifecycle3d-canvas';c.setAttribute('aria-hidden','true');return c};
  const resize=()=>{const r=canvas.getBoundingClientRect(),cap=Math.min(r.width,r.height)<520?1.25:1.5,d=Math.min(cap,Math.max(1,globalThis.devicePixelRatio||1)),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);return w/Math.max(1,h)};
  const draw=(now=performance.now(),prove=false)=>{
    if(dead||contextLost||!R)return false;
    const asp=resize(),elapsed=Math.max(0,now-start),s=reduced?MATURE_TREE_STATE:lifecycle(elapsed),env=environmentState(elapsed,reduced),nextTreeState=(reduced||elapsed>=CONTRACT.cycleSeconds*1000)?'TREE_MATURE_LOCK':'INTRO_LIFECYCLE',nextEnvironmentPhase=env.phase,stateChanged=nextTreeState!==treeState||nextEnvironmentPhase!==environmentPhase,dt=Math.min(40,Math.max(0,now-last));
    treeState=nextTreeState;environmentPhase=nextEnvironmentPhase;last=now;
    if(!reduced){const e=1-Math.exp(-dt/135);yaw+=(targetYaw-yaw)*e;pitch+=(targetPitch-pitch)*e}
    gl.useProgram(R.p);if(R.vao)gl.bindVertexArray(R.vao);gl.clearColor(...env.color);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(R.u.yaw,yaw);gl.uniform1f(R.u.pitch,pitch);gl.uniform1f(R.u.scale,asp<.76?1.04:asp<1.05?1.10:1.15);gl.uniform1f(R.u.aspect,asp);gl.uniform1f(R.u.camera,4.55);
    gl.uniform1f(R.u.time,cycleTimeSeconds(elapsed));gl.uniform1f(R.u.intro,reduced?CONTRACT.cycleSeconds:Math.min(CONTRACT.cycleSeconds,elapsed/1000));gl.uniform1f(R.u.progress,s.p);gl.uniform1f(R.u.activity,s.activity);gl.uniform1f(R.u.retained,s.retained);gl.uniform1f(R.u.renewal,s.renewal);gl.uniform1f(R.u.reduced,reduced?1:0);
    gl.drawElements(gl.TRIANGLES,R.count,gl.UNSIGNED_SHORT,0);const err=gl.getError();if(err!==gl.NO_ERROR)throw Error(`LIFECYCLE_DRAW_GL:${err}`);frameCount++;
    if(stateChanged){host.dataset.lifecycleStage=treeState;host.dataset.lifecycleEnvironment=environmentPhase;host.dataset.lifecycleFeeding=treeState==='TREE_MATURE_LOCK'?'stopped':'active';if(firstProof?.passed)publishReceipt()}
    return prove?visiblePixelProof(gl,canvas):true;
  };
  host.dataset.lifecycleStatus='initializing';host.dataset.lifecycleContract=CONTRACT.id;host.dataset.lifecycleFeeding=reduced?'stopped':'active';host.setAttribute('role','img');
  host.setAttribute('aria-label','Animated three-dimensional Community lifecycle sculpture. Four permanent spatial environmental zones surround the center at background, midground, and foreground depths. Spring flowers, Summer rain and wind, Autumn leaves, and Winter snow feed inward through depth during formation while the protected center tree remains the focal object.');
  for(const def of backendDefs){
    const c=makeCanvas();let candidateGl=null,candidateR=null,contextName=null;
    for(const name of def.contexts){try{candidateGl=c.getContext(name,options)}catch{}if(candidateGl){contextName=name;break}}
    if(!candidateGl){attempts.push({backend:def.id,result:'context-unavailable'});continue}
    try{candidateR=renderer(candidateGl,geometry,def);const setupError=candidateGl.getError();if(setupError!==candidateGl.NO_ERROR)throw Error(`renderer-gl-error-${setupError}`);canvas=c;gl=candidateGl;R=candidateR;backend={...def,contextName};host.append(canvas);const proof=draw(start,true);if(!proof?.passed)throw Error('visible-frame-proof-failed');firstProof=proof;attempts.push({backend:def.id,result:'selected'});break}catch(error){attempts.push({backend:def.id,result:'failed',reason:String(error?.message||error)});dispose(candidateGl,candidateR);c.remove();canvas=undefined;gl=undefined;R=undefined;backend=undefined}
  }
  if(!R){host.removeAttribute('role');host.removeAttribute('aria-label');style.remove();publishFailure(attempts.every(x=>x.result==='context-unavailable')?'webgl-unavailable':'renderer-initialization-failed');return}
  host.dataset.lifecycleReady='true';host.dataset.lifecycleStatus='ready';host.dataset.lifecycleStage=treeState;host.dataset.lifecycleEnvironment=environmentPhase;publishReceipt();
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
