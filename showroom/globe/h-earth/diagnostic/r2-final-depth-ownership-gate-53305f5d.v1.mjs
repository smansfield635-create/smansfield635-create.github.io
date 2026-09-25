import { constructHEarthRun8ESuccessorEnvironmentFrame, prepareHEarthRun8ERenderPlan } from '../render/run8e-successor-environment.js';

const IMMUTABLE_SOURCE='53305f5dfcdce51406363cba21c665d4e44701ad';
const TARGETS=new Set([5937,6160,5936,5935,5713]);
const WIDTH=1920, HEIGHT=1080;
const camera={
  position:{x:28,y:10.5,z:-82},
  target:{x:-34,y:5.5,z:-214},
  up:{x:0,y:1,z:0},
  verticalFovDegrees:56,
  nearPlane:0.25,
  farPlane:512
};
const frame=constructHEarthRun8ESuccessorEnvironmentFrame({camera,viewport:{width:WIDTH,height:HEIGHT,pixelRatio:1},frameOccurrenceId:'R2_FINAL_DEPTH_OWNERSHIP_GATE_53305F5D'});
if(frame?.ok!==true) throw new Error('FRAME_REJECTED:'+JSON.stringify(frame?.issues??[]));
const plan=prepareHEarthRun8ERenderPlan(frame,{width:WIDTH,height:HEIGHT});
if(plan?.eligible!==true) throw new Error('PLAN_REJECTED:'+JSON.stringify(plan?.issues??[]));

const terrainId=frame.run8CPresentation?.sourcePrimitiveId;
const ocean=frame.primitives.find(p=>p?.metadata?.run8ERenderClass==='FAR_OCEAN');
if(!terrainId||!ocean) throw new Error('REQUIRED_PRIMITIVE_MISSING');
const oceanId=ocean.primitiveId;
const terrainTriangles=plan.triangles.filter(t=>t.primitiveId===terrainId);
const targetFragments=plan.triangles.filter(t=>t.primitiveId===oceanId&&TARGETS.has(t.sourceTriangleIndex));

function edge(a,b,x,y){return(x-a.x)*(b.y-a.y)-(y-a.y)*(b.x-a.x)}
function coverage(t){
  const [a,b,c]=t.points, area=edge(a,b,c.x,c.y);
  const minX=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),maxX=Math.min(WIDTH-1,Math.ceil(Math.max(a.x,b.x,c.x)));
  const minY=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),maxY=Math.min(HEIGHT-1,Math.ceil(Math.max(a.y,b.y,c.y)));
  const out=[];
  for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
    const px=x+.5,py=y+.5,w0=edge(b,c,px,py)/area,w1=edge(c,a,px,py)/area,w2=edge(a,b,px,py)/area;
    if(w0>=-1e-8&&w1>=-1e-8&&w2>=-1e-8)out.push([y*WIDTH+x,w0*a.z+w1*b.z+w2*c.z]);
  }
  return out;
}
const terrainDepth=new Float64Array(WIDTH*HEIGHT); terrainDepth.fill(Infinity);
for(const t of terrainTriangles) for(const [p,z] of coverage(t)) if(z<terrainDepth[p]) terrainDepth[p]=z;

const bySource=new Map();
for(const t of targetFragments){
  let r=bySource.get(t.sourceTriangleIndex);
  if(!r){r={sourceTriangleIndex:t.sourceTriangleIndex,fragmentCount:0,oceanPixels:new Map()};bySource.set(t.sourceTriangleIndex,r)}
  r.fragmentCount++;
  for(const [p,z] of coverage(t)){const old=r.oceanPixels.get(p);if(old===undefined||z<old)r.oceanPixels.set(p,z)}
}
const results=[];
for(const sourceTriangleIndex of [...TARGETS]){
  const r=bySource.get(sourceTriangleIndex)??{fragmentCount:0,oceanPixels:new Map()};
  let terrainOverlapPixels=0,oceanWins=0,terrainWins=0,depthTies=0,noTerrain=0,minDelta=Infinity,maxDelta=-Infinity,sumDelta=0;
  for(const [p,oz] of r.oceanPixels){
    const tz=terrainDepth[p];
    if(!Number.isFinite(tz)){noTerrain++;continue}
    terrainOverlapPixels++;
    const delta=oz-tz; minDelta=Math.min(minDelta,delta);maxDelta=Math.max(maxDelta,delta);sumDelta+=delta;
    if(delta<-1e-9)oceanWins++;else if(delta>1e-9)terrainWins++;else depthTies++;
  }
  results.push({
    sourceTriangleIndex,fragmentCount:r.fragmentCount,oceanCoveredPixels:r.oceanPixels.size,terrainOverlapPixels,
    oceanWins,terrainWins,depthTies,noTerrain,
    oceanWinFractionOfTerrainOverlap:terrainOverlapPixels?oceanWins/terrainOverlapPixels:null,
    depthDeltaOceanMinusTerrain:{min:Number.isFinite(minDelta)?minDelta:null,max:Number.isFinite(maxDelta)?maxDelta:null,mean:terrainOverlapPixels?sumDelta/terrainOverlapPixels:null},
    visibleOwnershipAgainstRun8B:oceanWins>0?'OCEAN_WINS_SOME_SHARED_PIXELS':terrainOverlapPixels>0?'RUN8B_WINS_ALL_SHARED_PIXELS':'NO_RUN8B_PIXEL_OVERLAP'
  });
}
const receipt={
  contractId:'H_EARTH_R2_FINAL_DEPTH_OWNERSHIP_GATE_53305F5D_v1',
  immutableSourceCommit:IMMUTABLE_SOURCE,
  geometryMutation:false,
  camera,viewport:{width:WIDTH,height:HEIGHT},
  terrainPrimitiveId:terrainId,farOceanPrimitiveId:oceanId,
  targetOceanSourceTriangles:[5937,6160,5936,5935,5713],
  method:'EXACT_EXISTING_SIX_PLANE_CLIP_AND_PROJECT_PLAN; PIXEL-CENTER BARYCENTRIC DEPTH USING EXISTING CPU RASTERIZER DEPTH LAW; FAR_OCEAN COMPARED ONLY AGAINST RUN8B TERRAIN AT SHARED PIXELS',
  results,
  aggregate:{
    targetCount:results.length,
    targetsWithOceanWinningSharedPixels:results.filter(x=>x.oceanWins>0).length,
    targetsWithRun8BOverlap:results.filter(x=>x.terrainOverlapPixels>0).length,
    farOceanVisibleOwnershipProven:results.some(x=>x.oceanWins>0)
  }
};
console.log(JSON.stringify(receipt,null,2));
