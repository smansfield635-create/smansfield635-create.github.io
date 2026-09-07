#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import crypto from 'node:crypto';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const CONTRACT=JSON.parse(fs.readFileSync(path.join(HERE,'gen1983-camera-space-environment-diagnostics-contract.v1.json'),'utf8'));
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
const dist2=(a,b)=>{const dx=a.x-b.x,dz=a.z-b.z;return dx*dx+dz*dz;};
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const importProduct=rel=>import(pathToFileURL(path.join(ROOT,rel)).href);

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

const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

function stateCamera(spec){
  if(spec.camera==='ORBIT')return {source:'APP_ORBIT',eye:[...orbit.eye],look:[...orbit.look]};
  const binding=step9.STEP9_DESTINATION_BINDINGS[spec.destination];
  if(!binding)throw new Error(`DESTINATION_BINDING_MISSING:${spec.destination}`);
  const c=step9.resolveStep9Camera(binding.siteId);
  const look=c.look||c.worldReference;
  return {source:`STEP9:${binding.siteId}`,eye:[c.eye.x,c.eye.y,c.eye.z],look:[look.x,look.y,look.z]};
}
function containedTerrainHeight(x,z,surface){
  const cx=clamp(x,frame.xMinimum,frame.xMaximum),cz=clamp(z,frame.zMinimum,frame.zMaximum);
  const base=step9.step9TerrainHeight(cx,cz);
  const outsideX=x<frame.xMinimum?(frame.xMinimum-x)/surface.padX:x>frame.xMaximum?(x-frame.xMaximum)/surface.padX:0;
  const outsideNear=z<frame.zMinimum?(frame.zMinimum-z)/surface.padNearZ:0;
  const fade=clamp(Math.max(outsideX,outsideNear),0,1);
  return base-surface.drop*fade*fade;
}
function raycastGround(camera,profile){
  const cfg=CONTRACT.frustumContainment,pcfg=CONTRACT.profiles[profile],surface=surfaceByProfile[profile];
  const aspect=pcfg.viewport[0]/pcfg.viewport[1],tanV=Math.tan(pcfg.verticalFovDegrees*Math.PI/360),tanH=tanV*aspect;
  const forward=norm(sub(camera.look,camera.eye)),right=norm(cross(forward,[0,1,0])),up=norm(cross(right,forward));
  const terrainBounds={xMin:frame.xMinimum-surface.padX,xMax:frame.xMaximum+surface.padX,zMin:frame.zMinimum-surface.padNearZ,zMax:frame.zMaximum};
  const waterBounds={xMin:frame.xMinimum-surface.waterMarginX,xMax:frame.xMaximum+surface.waterMarginX,zMax:frame.zMaximum+surface.waterFarZ};
  let downward=0,hits=0,outside=0,minMargin=Infinity;
  const outsideSamples=[];
  for(let yi=0;yi<cfg.verticalSamples;yi++){
    const ndcY=-1+1.1*(yi/(cfg.verticalSamples-1));
    for(let xi=0;xi<cfg.horizontalSamples;xi++){
      const ndcX=-1+2*(xi/(cfg.horizontalSamples-1));
      const dir=norm(add(add(forward,scale(right,ndcX*tanH)),scale(up,ndcY*tanV)));
      if(dir[1]>=-.015)continue;
      downward++;
      let previousAbove=true,hit=null;
      for(let t=cfg.rayStep;t<=cfg.groundRayMaxDistance;t+=cfg.rayStep){
        const p={x:camera.eye[0]+dir[0]*t,y:camera.eye[1]+dir[1]*t,z:camera.eye[2]+dir[2]*t};
        const inTerrain=p.x>=terrainBounds.xMin&&p.x<=terrainBounds.xMax&&p.z>=terrainBounds.zMin&&p.z<=terrainBounds.zMax;
        const shore=step9.step9ShorelineZ(clamp(p.x,frame.xMinimum,frame.xMaximum))+1.5;
        const inWater=p.x>=waterBounds.xMin&&p.x<=waterBounds.xMax&&p.z>=shore&&p.z<=waterBounds.zMax;
        let surfaceY=-Infinity;
        if(inTerrain)surfaceY=Math.max(surfaceY,containedTerrainHeight(p.x,p.z,surface));
        if(inWater)surfaceY=Math.max(surfaceY,frame.seaLevelY-1.4);
        const above=p.y>surfaceY;
        if(previousAbove&&!above&&surfaceY>-Infinity){hit={p,inTerrain,inWater};break;}
        previousAbove=above;
        if(p.y<frame.seaLevelY-180&&surfaceY===-Infinity)break;
      }
      if(hit){
        hits++;
        const mTerrain=hit.inTerrain?Math.min(hit.p.x-terrainBounds.xMin,terrainBounds.xMax-hit.p.x,hit.p.z-terrainBounds.zMin,terrainBounds.zMax-hit.p.z):Infinity;
        const mWater=hit.inWater?Math.min(hit.p.x-waterBounds.xMin,waterBounds.xMax-hit.p.x,waterBounds.zMax-hit.p.z):Infinity;
        minMargin=Math.min(minMargin,Math.max(mTerrain===Infinity?-Infinity:mTerrain,mWater===Infinity?-Infinity:mWater));
      }else{
        outside++;
        if(outsideSamples.length<8)outsideSamples.push({ndcX:q(ndcX,3),ndcY:q(ndcY,3)});
      }
    }
  }
  const risk=outside>cfg.riskWhenOutsideIntersectionsGreaterThan||minMargin<cfg.surfaceSafetyMargin;
  return {profile,cameraSource:camera.source,downwardRayCount:downward,surfaceHitCount:hits,outsideSurfaceRayCount:outside,outsideSurfaceRate:q(downward?outside/downward:0,6),minimumSurfaceMargin:Number.isFinite(minMargin)?q(minMargin,3):null,safetyMargin:cfg.surfaceSafetyMargin,risk,outsideSamples};
}

function makeSpatialHash(instances,cellSize){
  const map=new Map();
  for(const item of instances){const cx=Math.floor(item.world.x/cellSize),cz=Math.floor(item.world.z/cellSize),key=`${cx},${cz}`;if(!map.has(key))map.set(key,[]);map.get(key).push(item);}
  return {cellSize,map};
}
function nearby(hash,x,z,radius,predicate=()=>true){
  const cs=hash.cellSize,r=Math.ceil(radius/cs),cx=Math.floor(x/cs),cz=Math.floor(z/cs),r2=radius*radius,out=[];
  for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)for(const item of hash.map.get(`${cx+dx},${cz+dz}`)||[]){const ddx=item.world.x-x,ddz=item.world.z-z;if(ddx*ddx+ddz*ddz<=r2&&predicate(item))out.push(item);}
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
  for(const key of occupied){if(seen.has(key))continue;let count=0,queue=[key];seen.add(key);while(queue.length){const k=queue.pop(),c=cells.get(k);count++;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nk=`${c.ix+dx},${c.iz+dz}`,nc=cells.get(nk);if(nc?.occ&&!seen.has(nk)){seen.add(nk);queue.push(nk);}}}largest=Math.max(largest,count);}
  let maxGap=0;
  for(let iz=-n;iz<=n;iz++){let run=0;for(let ix=-n;ix<=n;ix++){const c=cells.get(`${ix},${iz}`);if(!c){run=0;continue;}if(c.occ)run=0;else{run++;maxGap=Math.max(maxGap,run);}}}
  for(let ix=-n;ix<=n;ix++){let run=0;for(let iz=-n;iz<=n;iz++){const c=cells.get(`${ix},${iz}`);if(!c){run=0;continue;}if(c.occ)run=0;else{run++;maxGap=Math.max(maxGap,run);}}}
  const total=cells.size,occ=occupied.length,occupiedCellRatio=total?occ/total:0,largestComponentRatio=occ?largest/occ:0;
  const risk=occupiedCellRatio<cfg.riskOccupiedCellRatioBelow||largestComponentRatio<cfg.riskLargestComponentRatioBelow||maxGap>cfg.riskMaxEmptyCorridorCellsAbove;
  return {state,eligibleCellCount:total,occupiedCellCount:occ,occupiedCellRatio:q(occupiedCellRatio),largestConnectedOccupiedCells:largest,largestComponentRatio:q(largestComponentRatio),maxEmptyCorridorCells:maxGap,risk};
}
function groundOccupancy(camera,state){
  const cfg=CONTRACT.groundOccupancy,center=footprintCenter(camera);let eligible=0,covered=0;const uncoveredByZone={};
  for(let z=center.z-cfg.footprintRadius;z<=center.z+cfg.footprintRadius;z+=cfg.gridStep)for(let x=center.x-cfg.footprintRadius;x<=center.x+cfg.footprintRadius;x+=cfg.gridStep){
    if((x-center.x)**2+(z-center.z)**2>cfg.footprintRadius**2)continue;
    const env=edge.resolveVegetationEnvironment(x,z);if(!cfg.eligibleZones.includes(env.spatialZone)||env.hardOpen)continue;eligible++;
    const has=nearby(understoryHash,x,z,cfg.understoryInfluenceRadius,item=>!['DEAD_SPARSE_GROUND'].includes(item.type)).length>0;
    if(has)covered++;else uncoveredByZone[env.spatialZone]=(uncoveredByZone[env.spatialZone]||0)+1;
  }
  const coverageRatio=eligible?covered/eligible:0,risk=coverageRatio<cfg.riskCoverageRatioBelow;
  return {state,eligibleGroundCells:eligible,coveredGroundCells:covered,coverageRatio:q(coverageRatio),uncoveredByZone,risk};
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
for(const spec of CONTRACT.representativeStates){const camera=stateCamera(spec);const perProfile={};for(const profile of Object.keys(CONTRACT.profiles))perProfile[profile]=raycastGround(camera,profile);stateMetrics.push({state:spec.state,cameraSource:camera.source,camera:{eye:camera.eye.map(v=>q(v,6)),look:camera.look.map(v=>q(v,6))},frustumSurfaceContainment:perProfile,canopyFieldContinuity:canopyContinuity(camera,spec.state),eligibleGroundOccupancy:groundOccupancy(camera,spec.state)});}
const hydrology=hydrologyResponse();
const familyRisk={
  FRUSTUM_SURFACE_CONTAINMENT_RISK:stateMetrics.some(s=>Object.values(s.frustumSurfaceContainment).some(x=>x.risk)),
  CANOPY_FIELD_CONTINUITY:stateMetrics.some(s=>s.canopyFieldContinuity.risk),
  ELIGIBLE_GROUND_OCCUPANCY:stateMetrics.some(s=>s.eligibleGroundOccupancy.risk),
  HYDROLOGY_RESPONSE_STRENGTH:hydrology.risk
};
const riskFamilyCount=Object.values(familyRisk).filter(Boolean).length;
const checks=[];const check=(id,pass,detail={})=>checks.push({id,pass:Boolean(pass),detail});
check('CONTRACT_SCHEMA',CONTRACT.schema==='MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_CONTRACT_v1');
check('EXACT_CANOPY_COUNT_818',population.instanceCount===818,{observed:population.instanceCount});
check('UNDERSTORY_PRESENT',understory.instanceCount>0,{observed:understory.instanceCount});
check('APP_ORBIT_AUTHORITY_PARSED',orbitMatch!==null,{orbit});
check('APP_SURFACE_CONTAINMENT_AUTHORITY_PARSED',surfaceMatch!==null,{surfaceByProfile});
check('REPRESENTATIVE_STATE_SET',stateMetrics.length===CONTRACT.representativeStates.length,{observed:stateMetrics.length});
check('FOUR_METRIC_FAMILIES_PRESENT',Object.keys(familyRisk).length===4,{familyRisk});
check('KNOWN_FAILURE_RISK_CALIBRATION_NONZERO',riskFamilyCount>=CONTRACT.calibration.minimumRiskFamiliesDetected,{riskFamilyCount,familyRisk});
check('ALL_CLEAR_BASELINE_REJECTED',!(CONTRACT.calibration.allClearBaselineProhibited&&riskFamilyCount===0),{riskFamilyCount});
check('NO_ENVIRONMENT_DISPOSITION_AUTHORITY',CONTRACT.environmentDispositionAuthority===false);
check('NO_MATERIAL_DISPOSITION_AUTHORITY',CONTRACT.materialDispositionAuthority===false);
const failed=checks.filter(x=>!x.pass);
const metricPayload={surfaceAuthority:{source:'characters/app.mjs#SURFACE_CONTAINMENT',surfaceByProfile},cameraAuthority:{orbitSource:'characters/app.mjs#ORBIT',destinationSource:'characters/step9-regional-geography.mjs#resolveStep9Camera'},population:{instanceCount:population.instanceCount,understoryInstanceCount:understory.instanceCount},stateMetrics,hydrologyResponse:hydrology,familyRisk,riskFamilyCount};
const receipt={schema:'MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_RECEIPT_v1',operationId:CONTRACT.operationId,lockGeneration:CONTRACT.lockGeneration,governingHead:CONTRACT.governingHead,frozenProductSha:CONTRACT.frozenProductSha,frozenV5BlobSha:CONTRACT.frozenV5BlobSha,result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',instrumentValid:failed.length===0,environmentDispositionAuthority:false,materialDispositionAuthority:false,environmentDisposition:'UNASSIGNED_BY_DIAGNOSTIC',materialDisposition:'UNASSIGNED_BY_DIAGNOSTIC',metricDigest:sha256(JSON.stringify(metricPayload)),metrics:metricPayload,checkCount:checks.length,passCount:checks.length-failed.length,failCount:failed.length,checks};
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});fs.writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');process.stdout.write(JSON.stringify(receipt,null,2)+'\n');if(failed.length)process.exitCode=1;
