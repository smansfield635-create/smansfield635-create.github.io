/** Deterministic three-dimensional precipitation field.
 * Physical positions and velocity are independent of the display; camera perspective
 * and E1/E2 GPU rasterization are owned by render.v1.mjs. No CSS rain patterns.
 */
export const RAIN_LAB_SCHEMA = 'DGB_SPATIAL_RAIN_LAB_v1';
export const RAIN_BANDS = Object.freeze([
  Object.freeze({id:'FAR',minDepth:17.5,maxDepth:46,count:310,opacity:.11,width:.008,exposure:.025}),
  Object.freeze({id:'MID',minDepth:7.0,maxDepth:17.5,count:220,opacity:.22,width:.010,exposure:.031}),
  Object.freeze({id:'NEAR',minDepth:2.3,maxDepth:7.0,count:105,opacity:.34,width:.013,exposure:.041})
]);
const finite=n=>Number.isFinite(n);
function rng(seed){let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
const smooth=(lo,hi,x)=>{const t=Math.max(0,Math.min(1,(x-lo)/(hi-lo)));return t*t*(3-2*t);};
export function createRainField({seed=7341,aspect=1.2,tanHalfFov=.49,counts=null}={}){
  if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295||!finite(aspect)||aspect<=.25||aspect>4||!finite(tanHalfFov)||tanHalfFov<=.1||tanHalfFov>=1.5)throw new TypeError('RAIN_INPUT_INVALID');
  if(counts!==null&&(!Array.isArray(counts)||counts.length!==3||counts.some(n=>!Number.isInteger(n)||n<1||n>900)))throw new TypeError('RAIN_POPULATION_INVALID');
  const next=rng(seed),bands=RAIN_BANDS.map((b,bi)=>{
    const n=counts?.[bi]??b.count,drops=[];
    for(let i=0;i<n;i++){
      // Depth is nonuniform to avoid visually equidistant, wallpaper-like streaks.
      const z=b.minDepth+(b.maxDepth-b.minDepth)*Math.pow(next(),1.42);
      const halfX=z*tanHalfFov*aspect*1.35,halfY=z*tanHalfFov*1.30;
      const speed=7.5+next()*4.7,wind=.24+next()*.72;
      const width=b.width*(.7+.65*next()),length=speed*b.exposure*(.72+.62*next());
      const optical=b.opacity*(.62+.52*next())*(1-.26*smooth(b.minDepth,b.maxDepth,z));
      drops.push(Object.freeze({id:`${b.id}-${i}`,layer:b.id,x:(next()*2-1)*halfX,y:(next()*2-1)*halfY,z:-z,speed,wind,phase:next(),length,width,optical}));
    }
    return Object.freeze({id:b.id,minDepth:b.minDepth,maxDepth:b.maxDepth,opacity:b.opacity,drops:Object.freeze(drops)});
  });
  return Object.freeze({schema:RAIN_LAB_SCHEMA,seed,aspect,tanHalfFov,bands:Object.freeze(bands),dropCount:bands.reduce((n,b)=>n+b.drops.length,0)});
}
export function sampleDrop(drop,time,{aspect=1.2,tanHalfFov=.49,cameraX=0,cameraY=0}={}){
  if(!drop||!finite(time)||time<0||!finite(cameraX)||!finite(cameraY))throw new TypeError('RAIN_SAMPLE_INVALID');
  const depth=-drop.z,spanX=2.7*depth*tanHalfFov*aspect,spanY=2.6*depth*tanHalfFov;
  const wrap=(value,span)=>((value+span/2)%span+span)%span-span/2;
  const worldX=wrap(drop.x+drop.wind*time,spanX),worldY=spanY/2-(((drop.y+drop.phase*spanY+time*drop.speed)%spanY)+spanY)%spanY;
  const project=(x,y)=>Object.freeze({x:(x-cameraX)/(depth*tanHalfFov*aspect),y:(y-cameraY)/(depth*tanHalfFov)});
  return Object.freeze({depth,worldX,worldY,screen:project(worldX,worldY),lengthScreen:drop.length/(depth*tanHalfFov),widthScreen:drop.width/(depth*tanHalfFov*aspect)});
}
export function buildRainMesh(band){
  if(!band||!Array.isArray(band.drops)||!band.drops.length)throw new TypeError('RAIN_BAND_REQUIRED');
  const n=band.drops.length*6;
  const aBase=new Float32Array(n*3),aCorner=new Float32Array(n*2),aFall=new Float32Array(n*4),aShape=new Float32Array(n*2);
  const corners=[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]];
  for(let i=0;i<band.drops.length;i++){
    const d=band.drops[i];
    for(let v=0;v<6;v++){
      const j=i*6+v; aBase.set([d.x,d.y,d.z],j*3);aCorner.set(corners[v],j*2);
      aFall.set([d.speed,d.wind,d.phase,d.length],j*4);aShape.set([d.width,d.optical],j*2);
    }
  }
  return Object.freeze({vertexCount:n,attributes:Object.freeze([
    Object.freeze({name:'aBase',size:3,data:aBase}),Object.freeze({name:'aCorner',size:2,data:aCorner}),
    Object.freeze({name:'aFall',size:4,data:aFall}),Object.freeze({name:'aShape',size:2,data:aShape})
  ])});
}
export function inspectRainField(field){
  if(field?.schema!==RAIN_LAB_SCHEMA)throw new TypeError('RAIN_FIELD_INVALID');
  const counts=field.bands.map(b=>b.drops.length);
  const ids=new Set(field.bands.flatMap(b=>b.drops.map(d=>d.id)));
  const bounded=field.bands.every(b=>b.drops.every(d=>-d.z>=b.minDepth&&-d.z<=b.maxDepth&&d.speed>0&&d.length>0&&d.width>0&&d.optical>0));
  return Object.freeze({schema:'DGB_RAIN_FIELD_AUDIT_v1',uniqueIds:ids.size===field.dropCount,bounded,counts:Object.freeze(counts),total:field.dropCount,physicalWorldCoordinates:true,usesDisplayTiling:false,staticStripePattern:false});
}
