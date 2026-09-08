#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import crypto from 'node:crypto';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const CONTRACT=JSON.parse(fs.readFileSync(path.join(HERE,'gen1983-camera-space-environment-diagnostics-v2-contract.v1.json'),'utf8'));
const args={};
for(let i=2;i<process.argv.length;i++){
  const token=process.argv[i];
  if(!token.startsWith('--'))throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  args[token.slice(2)]=process.argv[++i]??null;
}
if(!args['product-root']||!args.output)throw new Error('PRODUCT_ROOT_AND_OUTPUT_REQUIRED');
const ROOT=path.resolve(args['product-root']);
const OUTPUT=path.resolve(args.output);
const q=(n,d=6)=>Number(Number(n).toFixed(d));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const importProduct=rel=>import(pathToFileURL(path.join(ROOT,rel)).href);
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const distance3=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

const EXPECTED={
  schema:'MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_V2_CONTRACT_v1',
  operationId:'MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_CALIBRATION_REPAIR_20260907_002',
  lockGeneration:1992,
  governingHead:'5ec0a127d55982e1cf985b0ff415a086149a25dc',
  frozenProductSha:'b193e6758f776b5ff6006c96037ee1a7632ddb64',
  frozenV5BlobSha:'f3b64eb1ffc1c1bc8e908ff96eb6c833b6bc928d',
  frustumContainmentV2:{
    horizontalSamples:25,verticalSamples:25,rayMaxDistance:3200,rayStep:12,
    riskMaxAdjacentHorizonDiscontinuityAboveBins:2,
    riskInternalSurfaceHoleCountAbove:0,
    riskVisibleOuterBoundarySamplesAbove:0,
    outerBoundaryPerimeterStep:32
  },
  groundVisualAreaOccupancyV2:{
    footprintRadius:280,ecologyGridStep:14,zeroDepthMinimumRasterThickness:.18,
    eligibleZones:['INTERIOR','EDGE','TRANSITION'],riskUpperBoundRatioBelow:.12
  },
  canopyContinuity:{
    footprintRadius:320,cellSize:32,canopyInfluenceRadius:30,
    riskOccupiedCellRatioBelow:.42,riskLargestComponentRatioBelow:.78,
    riskMaxEmptyCorridorCellsAbove:4
  },
  hydrologyResponse:{
    gridStep:36,shorelineScale:180,wetnessBins:{lowMax:.24,midMax:.52},
    responseRadius:30,riskHighMinusLowBelow:.18,requiredHighWetnessSamples:6
  }
};

const appPath=path.join(ROOT,'characters/app.mjs');
const appSource=fs.readFileSync(appPath,'utf8');
const orbitMatch=appSource.match(/const ORBIT=\{eye:\[([^\]]+)\],look:\[([^\]]+)\]\}/);
if(!orbitMatch)throw new Error('APP_ORBIT_CAMERA_LAW_NOT_FOUND');
const parseTriple=text=>text.split(',').map(v=>Number(v.trim()));
const orbit={eye:parseTriple(orbitMatch[1]),look:parseTriple(orbitMatch[2])};
if(orbit.eye.length!==3||orbit.look.length!==3||[...orbit.eye,...orbit.look].some(v=>!Number.isFinite(v)))throw new Error('APP_ORBIT_CAMERA_LAW_INVALID');

const surfaceMatch=appSource.match(/const SURFACE_CONTAINMENT=Object\.freeze\(\{padX:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?),padNearZ:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?),drop:(\d+(?:\.\d+)?),waterMarginX:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?),waterFarZ:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)\}\)/);
if(!surfaceMatch)throw new Error('APP_SURFACE_CONTAINMENT_LAW_NOT_FOUND');
const surfaceByProfile={
  desktop:{padX:+surfaceMatch[2],padNearZ:+surfaceMatch[4],drop:+surfaceMatch[5],waterMarginX:+surfaceMatch[7],waterFarZ:+surfaceMatch[9]},
  compactMobile:{padX:+surfaceMatch[1],padNearZ:+surfaceMatch[3],drop:+surfaceMatch[5],waterMarginX:+surfaceMatch[6],waterFarZ:+surfaceMatch[8]}
};

const step9=await importProduct('characters/step9-regional-geography.mjs');
const geo=await importProduct('characters/gratitude-geography.adapter.mjs');
const edge=await importProduct('characters/vegetation-edge-ecology.mjs');
const popmod=await importProduct('characters/vegetation-population.mjs');
const undermod=await importProduct('characters/vegetation-understory.mjs');
const population=popmod.getCanonicalVegetationPopulation();
const understory=undermod.getCanonicalUnderstoryPopulation();
const frame=geo.GRATITUDE_DEVELOPMENT_FRAME.envelope;
if(population.instanceCount!==818)throw new Error(`CANOPY_IDENTITY_NOT_818:${population.instanceCount}`);

const v5Bytes=fs.readFileSync(path.join(ROOT,'characters/vegetation-representation.mjs'));
const v5Observed=crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${v5Bytes.length}\0`),v5Bytes])).digest('hex');

function parseUnderstoryGeometry(){
  const source=fs.readFileSync(path.join(ROOT,'characters/vegetation-understory.mjs'),'utf8');
  const block=source.match(/const GEOMETRY=freeze\(\{([\s\S]*?)\}\);/);
  if(!block)throw new Error('UNDERSTORY_GEOMETRY_SOURCE_NOT_FOUND');
  const result={};
  const regex=/([A-Z_]+):new Float32Array\(\[([^\]]+)\]\)/g;
  for(const match of block[1].matchAll(regex)){
    const values=match[2].split(',').map(v=>Number(v.trim()));
    if(values.length<9||values.length%3!==0||values.some(v=>!Number.isFinite(v)))throw new Error(`UNDERSTORY_GEOMETRY_INVALID:${match[1]}`);
    const xs=[],zs=[];
    for(let i=0;i<values.length;i+=3){xs.push(values[i]);zs.push(values[i+2]);}
    const extentX=Math.max(...xs)-Math.min(...xs);
    const extentZ=Math.max(...zs)-Math.min(...zs);
    const thickness=CONTRACT.groundVisualAreaOccupancyV2.zeroDepthMinimumRasterThickness;
    const rasterX=Math.max(extentX,thickness),rasterZ=Math.max(extentZ,thickness);
    result[match[1]]={
      vertexCount:values.length/3,
      sourceExtentX:q(extentX,6),
      sourceExtentZ:q(extentZ,6),
      rasterExtentX:q(rasterX,6),
      rasterExtentZ:q(rasterZ,6),
      nominalFootprintArea:q(rasterX*rasterZ,9)
    };
  }
  const expectedClasses=[...new Set(understory.instances.map(x=>x.type))].sort();
  const parsedClasses=Object.keys(result).sort();
  if(!deepEqual(parsedClasses,expectedClasses))throw new Error(`UNDERSTORY_GEOMETRY_CLASS_MISMATCH:${JSON.stringify({parsedClasses,expectedClasses})}`);
  return result;
}
const geometryFootprints=parseUnderstoryGeometry();

function stateCamera(spec){
  if(spec.camera==='ORBIT')return {source:'APP_ORBIT',eye:[...orbit.eye],look:[...orbit.look]};
  const binding=step9.STEP9_DESTINATION_BINDINGS[spec.destination];
  if(!binding)throw new Error(`DESTINATION_BINDING_MISSING:${spec.destination}`);
  const c=step9.resolveStep9Camera(binding.siteId);
  const look=c.look||c.worldReference;
  return {source:`STEP9:${binding.siteId}`,eye:[c.eye.x,c.eye.y,c.eye.z],look:[look.x,look.y,look.z]};
}

function surfaceBounds(profile){
  const surface=surfaceByProfile[profile];
  return {
    surface,
    terrain:{xMin:frame.xMinimum-surface.padX,xMax:frame.xMaximum+surface.padX,zMin:frame.zMinimum-surface.padNearZ,zMax:frame.zMaximum},
    water:{xMin:frame.xMinimum-surface.waterMarginX,xMax:frame.xMaximum+surface.waterMarginX,zMax:frame.zMaximum+surface.waterFarZ}
  };
}
function containedTerrainHeight(x,z,surface){
  const cx=clamp(x,frame.xMinimum,frame.xMaximum),cz=clamp(z,frame.zMinimum,frame.zMaximum);
  const base=step9.step9TerrainHeight(cx,cz);
  const outsideX=x<frame.xMinimum?(frame.xMinimum-x)/surface.padX:x>frame.xMaximum?(x-frame.xMaximum)/surface.padX:0;
  const outsideNear=z<frame.zMinimum?(frame.zMinimum-z)/surface.padNearZ:0;
  const fade=clamp(Math.max(outsideX,outsideNear),0,1);
  return base-surface.drop*fade*fade;
}
function finiteSurfaceAt(x,z,profile){
  const {surface,terrain,water}=surfaceBounds(profile);
  let y=-Infinity,terrainHit=false,waterHit=false;
  if(x>=terrain.xMin&&x<=terrain.xMax&&z>=terrain.zMin&&z<=terrain.zMax){
    y=Math.max(y,containedTerrainHeight(x,z,surface));terrainHit=true;
  }
  const shoreline=step9.step9ShorelineZ(clamp(x,frame.xMinimum,frame.xMaximum))+1.5;
  if(x>=water.xMin&&x<=water.xMax&&z>=shoreline&&z<=water.zMax){
    y=Math.max(y,frame.seaLevelY-1.4);waterHit=true;
  }
  return y===-Infinity?null:{y,terrainHit,waterHit,shoreline};
}
function cameraBasis(camera,profile){
  const pcfg=CONTRACT.profiles[profile];
  const aspect=pcfg.viewport[0]/pcfg.viewport[1],tanV=Math.tan(pcfg.verticalFovDegrees*Math.PI/360),tanH=tanV*aspect;
  const forward=norm(sub(camera.look,camera.eye)),right=norm(cross(forward,[0,1,0])),up=norm(cross(right,forward));
  return {forward,right,up,tanV,tanH};
}
function traceRay(camera,profile,dir,maxDistance=CONTRACT.frustumContainmentV2.rayMaxDistance){
  const step=CONTRACT.frustumContainmentV2.rayStep;
  let previousDelta=null;
  for(let t=step;t<=maxDistance;t+=step){
    const p={x:camera.eye[0]+dir[0]*t,y:camera.eye[1]+dir[1]*t,z:camera.eye[2]+dir[2]*t};
    const surface=finiteSurfaceAt(p.x,p.z,profile);
    if(!surface){previousDelta=null;continue;}
    const delta=p.y-surface.y;
    if(delta<=0&&(previousDelta===null||previousDelta>0))return {distance:t,point:p,surface};
    previousDelta=delta;
  }
  return null;
}
function projectPoint(camera,profile,point){
  const basis=cameraBasis(camera,profile),rel=sub(point,camera.eye),depth=dot(rel,basis.forward);
  if(depth<=0)return null;
  return {x:dot(rel,basis.right)/(depth*basis.tanH),y:dot(rel,basis.up)/(depth*basis.tanV),depth};
}
function rangeInclusive(a,b,step){
  const values=[];if(b<a)return values;
  for(let v=a;v<=b;v+=step)values.push(v);
  if(!values.length||Math.abs(values.at(-1)-b)>1e-9)values.push(b);
  return values;
}
function finiteOuterBoundarySamples(profile){
  const cfg=CONTRACT.frustumContainmentV2,{surface,terrain,water}=surfaceBounds(profile),step=cfg.outerBoundaryPerimeterStep;
  const points=[],seen=new Set();
  const push=(kind,x,z,y)=>{
    const key=`${kind}:${q(x,4)}:${q(z,4)}`;if(seen.has(key))return;seen.add(key);
    points.push({kind,x,z,y});
  };
  for(const x of rangeInclusive(terrain.xMin,terrain.xMax,step)){
    push('TERRAIN_NEAR',x,terrain.zMin,containedTerrainHeight(x,terrain.zMin,surface));
    push('TERRAIN_FAR',x,terrain.zMax,containedTerrainHeight(x,terrain.zMax,surface));
  }
  for(const z of rangeInclusive(terrain.zMin,terrain.zMax,step)){
    push('TERRAIN_LEFT',terrain.xMin,z,containedTerrainHeight(terrain.xMin,z,surface));
    push('TERRAIN_RIGHT',terrain.xMax,z,containedTerrainHeight(terrain.xMax,z,surface));
  }
  for(const x of rangeInclusive(water.xMin,water.xMax,step))push('WATER_FAR',x,water.zMax,frame.seaLevelY-1.4);
  for(const [kind,x] of [['WATER_LEFT',water.xMin],['WATER_RIGHT',water.xMax]]){
    const shore=step9.step9ShorelineZ(clamp(x,frame.xMinimum,frame.xMaximum))+1.5;
    for(const z of rangeInclusive(shore,water.zMax,step))push(kind,x,z,frame.seaLevelY-1.4);
  }
  return points;
}
function boundaryLineVisible(camera,profile,point){
  const world=[point.x,point.y,point.z],projection=projectPoint(camera,profile,world);
  if(!projection||Math.abs(projection.x)>1||Math.abs(projection.y)>1)return null;
  const distance=distance3(camera.eye,world);
  if(distance>CONTRACT.frustumContainmentV2.rayMaxDistance)return null;
  const dir=norm(sub(world,camera.eye)),step=CONTRACT.frustumContainmentV2.rayStep;
  const first=traceRay(camera,profile,dir,Math.max(step,distance-step*1.5));
  if(first&&first.distance<distance-step*1.5)return null;
  return {kind:point.kind,ndcX:q(projection.x,4),ndcY:q(projection.y,4),distance:q(distance,2)};
}
function frustumSurfaceContainmentV2(camera,profile){
  const cfg=CONTRACT.frustumContainmentV2,basis=cameraBasis(camera,profile);
  const columns=[],maskRows=Array.from({length:cfg.verticalSamples},()=>Array(cfg.horizontalSamples).fill('0'));
  let hitCount=0;
  for(let xi=0;xi<cfg.horizontalSamples;xi++){
    const hits=[];
    const ndcX=-1+2*(xi/(cfg.horizontalSamples-1));
    for(let yi=0;yi<cfg.verticalSamples;yi++){
      const ndcY=-1+2*(yi/(cfg.verticalSamples-1));
      const dir=norm(add(add(basis.forward,scale(basis.right,ndcX*basis.tanH)),scale(basis.up,ndcY*basis.tanV)));
      const hit=traceRay(camera,profile,dir);
      const yes=Boolean(hit);hits.push(yes);
      if(yes){maskRows[yi][xi]='1';hitCount++;}
    }
    const hitIndices=hits.map((v,i)=>v?i:null).filter(v=>v!==null);
    const min=hitIndices.length?Math.min(...hitIndices):null,max=hitIndices.length?Math.max(...hitIndices):null;
    let internalHoles=0;
    if(min!==null&&max!==null)for(let yi=min;yi<=max;yi++)if(!hits[yi])internalHoles++;
    columns.push({index:xi,horizonIndex:max,lowestSurfaceIndex:min,internalHoleCount:internalHoles});
  }
  let internalSurfaceHoleCount=columns.reduce((sum,c)=>sum+c.internalHoleCount,0),maxAdjacentHorizonDiscontinuity=0;
  for(let i=1;i<columns.length;i++){
    const a=columns[i-1].horizonIndex,b=columns[i].horizonIndex;
    const delta=a===null&&b===null?0:(a===null||b===null?cfg.verticalSamples:Math.abs(a-b));
    maxAdjacentHorizonDiscontinuity=Math.max(maxAdjacentHorizonDiscontinuity,delta);
  }
  const perimeter=finiteOuterBoundarySamples(profile),visible=[];
  for(const point of perimeter){const v=boundaryLineVisible(camera,profile,point);if(v)visible.push(v);}
  const risk=internalSurfaceHoleCount>cfg.riskInternalSurfaceHoleCountAbove||
    maxAdjacentHorizonDiscontinuity>cfg.riskMaxAdjacentHorizonDiscontinuityAboveBins||
    visible.length>cfg.riskVisibleOuterBoundarySamplesAbove;
  return {
    profile,cameraSource:camera.source,
    grid:[cfg.horizontalSamples,cfg.verticalSamples],
    surfaceHitCount:hitCount,
    surfaceHitMask:maskRows.slice().reverse().map(row=>row.join('')),
    perColumnHorizon:columns.map(c=>c.horizonIndex),
    internalSurfaceHoleCount,
    maxAdjacentHorizonDiscontinuity,
    outerBoundarySampleCount:perimeter.length,
    visibleOuterBoundarySampleCount:visible.length,
    visibleOuterBoundarySamples:visible.slice(0,24),
    intendedShorelineCountedAsOuterBoundary:false,
    risk
  };
}

function makeSpatialHash(instances,cellSize){
  const map=new Map();
  for(const item of instances){const cx=Math.floor(item.world.x/cellSize),cz=Math.floor(item.world.z/cellSize),key=`${cx},${cz}`;if(!map.has(key))map.set(key,[]);map.get(key).push(item);}
  return {cellSize,map};
}
function nearby(hash,x,z,radius,predicate=()=>true){
  const cs=hash.cellSize,r=Math.ceil(radius/cs),cx=Math.floor(x/cs),cz=Math.floor(z/cs),r2=radius*radius,out=[];
  for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)for(const item of hash.map.get(`${cx+dx},${cz+dz}`)||[]){
    const ddx=item.world.x-x,ddz=item.world.z-z;if(ddx*ddx+ddz*ddz<=r2&&predicate(item))out.push(item);
  }
  return out;
}
const canopyHash=makeSpatialHash(population.instances,40);
const understoryHash=makeSpatialHash(understory.instances,36);
function footprintCenter(camera){return {x:camera.look[0],z:camera.look[2]};}

function canopyContinuity(camera,state){
  const cfg=CONTRACT.canopyContinuity,center=footprintCenter(camera),n=Math.ceil(cfg.footprintRadius/cfg.cellSize),cells=new Map(),occupied=[];
  for(let iz=-n;iz<=n;iz++)for(let ix=-n;ix<=n;ix++){
    const x=center.x+ix*cfg.cellSize,z=center.z+iz*cfg.cellSize;
    if((x-center.x)**2+(z-center.z)**2>cfg.footprintRadius**2)continue;
    const env=edge.resolveVegetationEnvironment(x,z);
    if(env.spatialZone==='OPENING')continue;
    const occ=nearby(canopyHash,x,z,cfg.canopyInfluenceRadius).length>0,key=`${ix},${iz}`;
    cells.set(key,{ix,iz,occ});if(occ)occupied.push(key);
  }
  const seen=new Set();let largest=0;
  for(const key of occupied){
    if(seen.has(key))continue;let count=0,queue=[key];seen.add(key);
    while(queue.length){
      const k=queue.pop(),c=cells.get(k);count++;
      for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nk=`${c.ix+dx},${c.iz+dz}`,nc=cells.get(nk);
        if(nc?.occ&&!seen.has(nk)){seen.add(nk);queue.push(nk);}
      }
    }
    largest=Math.max(largest,count);
  }
  let maxGap=0;
  for(let iz=-n;iz<=n;iz++){let run=0;for(let ix=-n;ix<=n;ix++){const c=cells.get(`${ix},${iz}`);if(!c){run=0;continue;}if(c.occ)run=0;else{run++;maxGap=Math.max(maxGap,run);}}}
  for(let ix=-n;ix<=n;ix++){let run=0;for(let iz=-n;iz<=n;iz++){const c=cells.get(`${ix},${iz}`);if(!c){run=0;continue;}if(c.occ)run=0;else{run++;maxGap=Math.max(maxGap,run);}}}
  const total=cells.size,occ=occupied.length,occupiedCellRatio=total?occ/total:0,largestComponentRatio=occ?largest/occ:0;
  const risk=occupiedCellRatio<cfg.riskOccupiedCellRatioBelow||largestComponentRatio<cfg.riskLargestComponentRatioBelow||maxGap>cfg.riskMaxEmptyCorridorCellsAbove;
  return {state,eligibleCellCount:total,occupiedCellCount:occ,occupiedCellRatio:q(occupiedCellRatio),largestConnectedOccupiedCells:largest,largestComponentRatio:q(largestComponentRatio),maxEmptyCorridorCells:maxGap,risk};
}

function groundVisualAreaOccupancyV2(camera,state){
  const cfg=CONTRACT.groundVisualAreaOccupancyV2,center=footprintCenter(camera),r2=cfg.footprintRadius**2;
  let eligibleCells=0;
  const eligibleZoneCells=Object.fromEntries(cfg.eligibleZones.map(z=>[z,0]));
  for(let z=center.z-cfg.footprintRadius;z<=center.z+cfg.footprintRadius;z+=cfg.ecologyGridStep)for(let x=center.x-cfg.footprintRadius;x<=center.x+cfg.footprintRadius;x+=cfg.ecologyGridStep){
    if((x-center.x)**2+(z-center.z)**2>r2)continue;
    const env=edge.resolveVegetationEnvironment(x,z);
    if(!cfg.eligibleZones.includes(env.spatialZone)||env.hardOpen)continue;
    eligibleCells++;eligibleZoneCells[env.spatialZone]=(eligibleZoneCells[env.spatialZone]||0)+1;
  }
  const eligibleGroundArea=eligibleCells*cfg.ecologyGridStep*cfg.ecologyGridStep;
  let nominalVisualArea=0,eligibleInstanceCount=0;
  const areaByClass={};
  for(const item of understory.instances){
    const dx=item.world.x-center.x,dz=item.world.z-center.z;if(dx*dx+dz*dz>r2)continue;
    const env=edge.resolveVegetationEnvironment(item.world.x,item.world.z);
    if(!cfg.eligibleZones.includes(env.spatialZone)||env.hardOpen)continue;
    const source=geometryFootprints[item.type];if(!source)throw new Error(`UNDERSTORY_GEOMETRY_MISSING:${item.type}`);
    const area=source.nominalFootprintArea*item.scale*item.scale;
    nominalVisualArea+=area;eligibleInstanceCount++;
    areaByClass[item.type]=(areaByClass[item.type]||0)+area;
  }
  const upperBoundRatio=eligibleGroundArea?nominalVisualArea/eligibleGroundArea:0;
  const risk=upperBoundRatio<cfg.riskUpperBoundRatioBelow;
  return {
    state,eligibleGroundCellCount:eligibleCells,eligibleZoneCells,
    ecologyGridStep:cfg.ecologyGridStep,eligibleGroundArea:q(eligibleGroundArea,3),
    eligibleUnderstoryInstanceCount:eligibleInstanceCount,
    nominalVisualAreaUpperBound:q(nominalVisualArea,6),
    nominalVisualAreaByClass:Object.fromEntries(Object.entries(areaByClass).sort().map(([k,v])=>[k,q(v,6)])),
    upperBoundRatio:q(upperBoundRatio,9),
    overlapSubtracted:false,
    interpretation:'CONSERVATIVE_UPPER_BOUND',
    risk
  };
}

function wetnessAt(x,z){
  const s=geo.sampleGratitudeWorld(x,z).source,wet=Math.max(Number(s.hydrology?.riverWeight)||0,Number(s.hydrology?.lakeWeight)||0),shore=Math.max(0,Number(s.shorelineDistance)||0),shoreSignal=clamp(1-shore/CONTRACT.hydrologyResponse.shorelineScale,0,1);
  return {sample:s,wetness:clamp(Math.max(wet,shoreSignal*.62),0,1)};
}
function hydrologyResponse(){
  const cfg=CONTRACT.hydrologyResponse,bins={low:{n:0,sum:0},mid:{n:0,sum:0},high:{n:0,sum:0}};
  for(let z=frame.zMinimum+cfg.gridStep/2;z<=frame.zMaximum-cfg.gridStep/2;z+=cfg.gridStep)for(let x=frame.xMinimum+cfg.gridStep/2;x<=frame.xMaximum-cfg.gridStep/2;x+=cfg.gridStep){
    const {sample,wetness}=wetnessAt(x,z);if(sample.hydrology?.drainageClass!=='LAND')continue;
    const local=nearby(understoryHash,x,z,cfg.responseRadius);let weighted=0;
    for(const item of local){if(item.type==='REED_WET_MARGIN')weighted+=1;else if(item.type==='GRASS_SEDGE')weighted+=.28;else if(item.type==='LOW_SHRUB')weighted+=.12;else if(item.type==='FOREST_FLOOR_CLUSTER')weighted+=.08;}
    const response=1-Math.exp(-weighted/2.2),key=wetness<=cfg.wetnessBins.lowMax?'low':wetness<=cfg.wetnessBins.midMax?'mid':'high';bins[key].n++;bins[key].sum+=response;
  }
  const means=Object.fromEntries(Object.entries(bins).map(([k,b])=>[k,b.n?q(b.sum/b.n):0])),delta=q(means.high-means.low),risk=bins.high.n<cfg.requiredHighWetnessSamples||delta<cfg.riskHighMinusLowBelow;
  return {bins:Object.fromEntries(Object.entries(bins).map(([k,b])=>[k,{sampleCount:b.n,meanResponse:means[k]}])),highMinusLow:delta,risk};
}

const stateMetrics=[];
for(const spec of CONTRACT.representativeStates){
  const camera=stateCamera(spec),perProfile={};
  for(const profile of Object.keys(CONTRACT.profiles))perProfile[profile]=frustumSurfaceContainmentV2(camera,profile);
  stateMetrics.push({
    state:spec.state,cameraSource:camera.source,
    camera:{eye:camera.eye.map(v=>q(v,6)),look:camera.look.map(v=>q(v,6))},
    frustumSurfaceContainmentV2:perProfile,
    canopyFieldContinuity:canopyContinuity(camera,spec.state),
    eligibleGroundVisualAreaOccupancyV2:groundVisualAreaOccupancyV2(camera,spec.state)
  });
}
const hydrology=hydrologyResponse();
const familyRisk={
  FRUSTUM_SURFACE_CONTAINMENT_RISK_V2:stateMetrics.some(s=>Object.values(s.frustumSurfaceContainmentV2).some(x=>x.risk)),
  CANOPY_FIELD_CONTINUITY:stateMetrics.some(s=>s.canopyFieldContinuity.risk),
  ELIGIBLE_GROUND_VISUAL_AREA_OCCUPANCY_V2:stateMetrics.some(s=>s.eligibleGroundVisualAreaOccupancyV2.risk),
  HYDROLOGY_RESPONSE_STRENGTH:hydrology.risk
};

const checks=[];const check=(id,pass,detail={})=>checks.push({id,pass:Boolean(pass),detail});
check('CONTRACT_SCHEMA',CONTRACT.schema===EXPECTED.schema,{observed:CONTRACT.schema});
check('OPERATION_ID',CONTRACT.operationId===EXPECTED.operationId,{observed:CONTRACT.operationId});
check('LOCK_GENERATION',CONTRACT.lockGeneration===EXPECTED.lockGeneration,{observed:CONTRACT.lockGeneration});
check('GOVERNING_HEAD',CONTRACT.governingHead===EXPECTED.governingHead,{observed:CONTRACT.governingHead});
check('FROZEN_PRODUCT_SHA',CONTRACT.frozenProductSha===EXPECTED.frozenProductSha,{observed:CONTRACT.frozenProductSha});
check('V5_BLOB_BYTE_IDENTITY',v5Observed===EXPECTED.frozenV5BlobSha,{observed:v5Observed});
check('FROZEN_FRUSTUM_V2_CONSTANTS',deepEqual(CONTRACT.frustumContainmentV2,EXPECTED.frustumContainmentV2),{observed:CONTRACT.frustumContainmentV2});
check('FROZEN_GROUND_VISUAL_AREA_V2_CONSTANTS',
  CONTRACT.groundVisualAreaOccupancyV2.footprintRadius===EXPECTED.groundVisualAreaOccupancyV2.footprintRadius&&
  CONTRACT.groundVisualAreaOccupancyV2.ecologyGridStep===EXPECTED.groundVisualAreaOccupancyV2.ecologyGridStep&&
  CONTRACT.groundVisualAreaOccupancyV2.zeroDepthMinimumRasterThickness===EXPECTED.groundVisualAreaOccupancyV2.zeroDepthMinimumRasterThickness&&
  deepEqual(CONTRACT.groundVisualAreaOccupancyV2.eligibleZones,EXPECTED.groundVisualAreaOccupancyV2.eligibleZones)&&
  CONTRACT.groundVisualAreaOccupancyV2.riskUpperBoundRatioBelow===EXPECTED.groundVisualAreaOccupancyV2.riskUpperBoundRatioBelow,
  {observed:CONTRACT.groundVisualAreaOccupancyV2});
check('GEN1985_CANOPY_CONSTANTS_UNCHANGED',deepEqual(CONTRACT.canopyContinuity,EXPECTED.canopyContinuity),{observed:CONTRACT.canopyContinuity});
check('GEN1985_HYDROLOGY_CONSTANTS_UNCHANGED',deepEqual(CONTRACT.hydrologyResponse,EXPECTED.hydrologyResponse),{observed:CONTRACT.hydrologyResponse});
check('EXACT_CANOPY_COUNT_818',population.instanceCount===818,{observed:population.instanceCount});
check('UNDERSTORY_PRESENT',understory.instanceCount>0,{observed:understory.instanceCount});
check('UNDERSTORY_SOURCE_GEOMETRY_PARSED',Object.keys(geometryFootprints).length>0,{geometryFootprints});
check('APP_ORBIT_AUTHORITY_PARSED',orbitMatch!==null,{orbit});
check('APP_SURFACE_CONTAINMENT_AUTHORITY_PARSED',surfaceMatch!==null,{surfaceByProfile});
check('REPRESENTATIVE_STATE_SET',stateMetrics.length===CONTRACT.representativeStates.length,{observed:stateMetrics.length});
check('FOUR_METRIC_FAMILIES_PRESENT',Object.keys(familyRisk).length===4,{familyRisk});
check('CALIBRATION_SURFACE_CONTAINMENT_RISK_DETECTED',familyRisk.FRUSTUM_SURFACE_CONTAINMENT_RISK_V2,{familyRisk});
check('CALIBRATION_CANOPY_CONTINUITY_RISK_DETECTED',familyRisk.CANOPY_FIELD_CONTINUITY,{familyRisk});
check('CALIBRATION_GROUND_VISUAL_AREA_RISK_DETECTED',familyRisk.ELIGIBLE_GROUND_VISUAL_AREA_OCCUPANCY_V2,{familyRisk});
check('CALIBRATION_HYDROLOGY_RESPONSE_RISK_DETECTED',familyRisk.HYDROLOGY_RESPONSE_STRENGTH,{familyRisk});
check('ALL_FOUR_KNOWN_FAILURE_FAMILIES_DETECTED',Object.values(familyRisk).every(Boolean),{familyRisk});
check('NO_ENVIRONMENT_DISPOSITION_AUTHORITY',CONTRACT.environmentDispositionAuthority===false);
check('NO_MATERIAL_DISPOSITION_AUTHORITY',CONTRACT.materialDispositionAuthority===false);

const failed=checks.filter(x=>!x.pass);
const metricPayload={
  surfaceAuthority:{source:'characters/app.mjs#SURFACE_CONTAINMENT',surfaceByProfile},
  cameraAuthority:{orbitSource:'characters/app.mjs#ORBIT',destinationSource:'characters/step9-regional-geography.mjs#resolveStep9Camera'},
  understoryGeometryAuthority:{source:'characters/vegetation-understory.mjs#GEOMETRY',geometryFootprints},
  population:{instanceCount:population.instanceCount,understoryInstanceCount:understory.instanceCount,v5BlobObserved:v5Observed},
  stateMetrics,hydrologyResponse:hydrology,familyRisk
};
const receipt={
  schema:'MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_V2_RECEIPT_v1',
  operationId:CONTRACT.operationId,lockGeneration:CONTRACT.lockGeneration,governingHead:CONTRACT.governingHead,
  frozenProductSha:CONTRACT.frozenProductSha,frozenV5BlobSha:CONTRACT.frozenV5BlobSha,
  result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',
  instrumentValid:failed.length===0,
  calibrationRequirement:'ALL_FOUR_GEN1984_FAILED_DIMENSIONS_RISK_TRUE',
  environmentDispositionAuthority:false,materialDispositionAuthority:false,
  environmentDisposition:'UNASSIGNED_BY_DIAGNOSTIC',materialDisposition:'UNASSIGNED_BY_DIAGNOSTIC',
  productMutationAuthorized:false,productMutationDetected:false,
  metricDigest:sha256(JSON.stringify(metricPayload)),metrics:metricPayload,
  checkCount:checks.length,passCount:checks.length-failed.length,failCount:failed.length,checks
};
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});
fs.writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failed.length)process.exitCode=1;
