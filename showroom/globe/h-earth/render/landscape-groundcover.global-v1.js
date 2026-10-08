/** Global presentation density; no canonical placement or terrain mutation. */
import {buildHEarthWoodlandGrassTuft,H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis} from './grass-lowland-trial.js';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
import {H_EARTH_PLANETARY_WORLD_FRAME} from './planetary-world-frame.js';

export const H_EARTH_GLOBAL_GROUND_COVER=Object.freeze({id:'H_EARTH_GLOBAL_GROUND_COVER_v1',seed:'GLOBAL_COASTAL_COVER_20261008',bounds:Object.freeze({minX:-384,maxX:384,minZ:-736,maxZ:128}),spacing:2.5,tileMeters:32,maximumInstances:65536,recordFloats:20,maximumGpuBytes:8*1024*1024,planetRadius:H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius});
const P=H_EARTH_GLOBAL_GROUND_COVER,clamp=v=>Math.max(0,Math.min(1,v)),f=Math.fround;
const smooth=v=>{const t=clamp(v);return t*t*(3-2*t);};
const now=()=>globalThis.performance?.now?.()??Date.now();
const yieldControl=()=>new Promise(resolve=>setTimeout(resolve,0));
function hash(id,channel){let h=2166136261;for(const c of `${P.seed}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;}
function field(x,z,step,channel){const xx=x/step,zz=z/step,ix=Math.floor(xx),iz=Math.floor(zz),u=smooth(xx-ix),v=smooth(zz-iz),a=(x,z)=>hash(`${x}:${z}`,channel);return a(ix,iz)*(1-u)*(1-v)+a(ix+1,iz)*u*(1-v)+a(ix,iz+1)*(1-u)*v+a(ix+1,iz+1)*u*v;}
export function inverseHEarthGroundCoverPoint(x,y,z){const h=Math.hypot(x,z),r=Math.atan2(h,y+P.planetRadius)*P.planetRadius,k=h? r/h:0;return{x:x*k,z:z*k,elevation:Math.hypot(h,y+P.planetRadius)-P.planetRadius};}
function segmentDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,d=dx*dx+dz*dz,t=d?clamp(((x-a.x)*dx+(z-a.z)*dz)/d):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
function clear(x,z,r=0){
  for(const b of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope])if(Math.hypot(x-Math.max(b.minX,Math.min(b.maxX,x)),z-Math.max(b.minZ,Math.min(b.maxZ,z)))<=r)return false;
  if(estate.footRoute.slice(1).some((b,i)=>segmentDistance(x,z,estate.footRoute[i],b)<=estate.footRouteRadius+r))return false;
  if(segmentDistance(x,z,{x:-145,z:-194},{x:-145,z:-230})<=1.5+r)return false;
  if(Math.hypot((x+141)/33,(z+226)/32)<=1.25+r/32)return false;
  return !(x>=oasis.minX-r&&x<=oasis.maxX+r&&z>=oasis.minZ-r&&z<=oasis.maxZ+r);
}
function triangleIndex(positions,indices,spans=null,bounded=false){
  const bins=new Map(),size=16,triangles=[];
  const ranges=spans??[{indexStart:0,indexCount:indices.length}];
  for(const span of ranges)for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
    const a=[0,1,2].map(k=>{const i=indices[j+k]*3;return{x:f(positions[i]),y:f(positions[i+1]),z:f(positions[i+2])};});
    if(a.some(v=>![v.x,v.y,v.z].every(Number.isFinite)))throw Error('GLOBAL_COVER_NONFINITE_TERRAIN');
    const loX=Math.min(...a.map(p=>p.x)),hiX=Math.max(...a.map(p=>p.x)),loZ=Math.min(...a.map(p=>p.z)),hiZ=Math.max(...a.map(p=>p.z));
    if(bounded&&(hiX<P.bounds.minX||loX>P.bounds.maxX||hiZ<P.bounds.minZ||loZ>P.bounds.maxZ))continue;
    const [p,q,r]=a,det=(q.z-r.z)*(p.x-r.x)+(r.x-q.x)*(p.z-r.z);if(Math.abs(det)<1e-12)continue;
    const ux=q.x-p.x,uy=q.y-p.y,uz=q.z-p.z,vx=r.x-p.x,vy=r.y-p.y,vz=r.z-p.z,ny=uz*vx-ux*vz;
    const t={a,det,slope:Math.hypot(uy*vz-uz*vy,ux*vy-uy*vx)/Math.abs(ny),triangleId:j/3};triangles.push(t);
    const xmin=bounded?Math.max(loX,P.bounds.minX):loX,xmax=bounded?Math.min(hiX,P.bounds.maxX):hiX,zmin=bounded?Math.max(loZ,P.bounds.minZ):loZ,zmax=bounded?Math.min(hiZ,P.bounds.maxZ):hiZ;
    for(let iz=Math.floor(zmin/size);iz<=Math.floor(zmax/size);iz++)for(let ix=Math.floor(xmin/size);ix<=Math.floor(xmax/size);ix++){const key=`${ix}:${iz}`;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(t);}
  }
  return {triangleCount:triangles.length,sample(x,z){for(const t of bins.get(`${Math.floor(x/size)}:${Math.floor(z/size)}`)??[]){const[a,b,c]=t.a,u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/t.det,v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/t.det,w=1-u-v;if(Math.min(u,v,w)<-1e-8)continue;return{y:f(u*a.y+v*b.y+w*c.y),slope:t.slope,triangleId:t.triangleId};}return null;}};
}
function templateFor(){
  const tuft=buildHEarthWoodlandGrassTuft({id:`${P.id}:ACCEPTED_FAN_TEMPLATE`,x:0,z:0,bladeCount:4,pocket:'OLIVE',sample:(x,z)=>({x,y:0,z,triangleId:0,terrainPrimitiveId:'FLAT_TEMPLATE'}),eligible:()=>true,inside:()=>true});
  const g=tuft.geometry;if(g.vertices.length!==28||g.indices.length!==72)throw Error('GLOBAL_COVER_TEMPLATE_RECIPE_DRIFT');
  const positions=new Float32Array(84),normals=new Float32Array(84),colors=new Float32Array(112),rootInfo=new Float32Array(112),rootVertices=new Uint8Array(12);
  for(let i=0;i<28;i++){const v=g.vertices[i],n=g.normals[i],blade=Math.floor(i/7),local=i%7,root=blade*3+(local<3?local:local<6?local-3:1);positions.set([v.x,v.y,v.z],i*3);normals.set([n.x,n.y,n.z],i*3);rootInfo[i*4]=root;
    const srgb=tuft.metadata.oasisFoliage.vertexColorsSrgb[i];colors.set([...srgb.map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)),1],i*4);
    if(local<3)rootVertices[blade*3+local]=i;
  }
  return{positions,normals,colors,indices:new Uint32Array(g.indices),rootInfo,rootVertices,rootMapping:'PER_VERTEX_ROOT_INDEX_AT_ROOTINFO_X_HEIGHT_ABOVE_FLAT_ROOT',recipe:'ACCEPTED_FOUR_BLADE_28_VERTEX_24_TRIANGLE_FAN'};
}
/** Match the shader float operations; no fused multiply/add is assumed. */
export function transformHEarthGroundCoverRoot(template,root,x,z,angle,width){const i=template.rootVertices[root]*3,dx=f(template.positions[i]*width),dz=f(template.positions[i+2]*width),c=f(Math.cos(angle)),s=f(Math.sin(angle));return{x:f(x+f(f(dx*c)-f(dz*s))),z:f(z+f(f(dx*s)+f(dz*c)))};}
function eligibleMaterial(m,slope){if(m?.valid!==true||slope>.35)return false;if(m.surfaceClass==='STONE_AND_SPARSE_SOIL')return m.soilDepth>=.035;return ['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20;}

export async function buildHEarthGlobalGroundCover(pkg,{refinement=null,onProgress=()=>{},order='FORWARD'}={}){
  if(!['FORWARD','REVERSE','CHUNKED'].includes(order))throw Error('GLOBAL_COVER_ORDER_INVALID');
  const started=now(),template=templateFor(),base=triangleIndex(pkg.buffers.positions,pkg.buffers.indices,(pkg.primitiveSpans??[]).filter(p=>p.role==='TERRAIN'));
  if(!base.triangleCount)throw Error('GLOBAL_COVER_TERRAIN_EMPTY');
  const water=triangleIndex(pkg.buffers.positions,pkg.buffers.indices,(pkg.primitiveSpans??[]).filter(p=>String(p.primitiveId).includes('FAR_OCEAN_CONTINUATION')),true);
  const refined=refinement?triangleIndex(refinement.positions,refinement.indices):null,clip=refinement?.clip;
  if(refined&&(!Array.isArray(clip)||clip.length!==4||!clip.every(Number.isFinite)))throw Error('GLOBAL_COVER_REFINEMENT_CLIP_INVALID');
  const sample=(x,z)=>refined&&x>clip[0]&&x<clip[1]&&z>clip[2]&&z<clip[3]?refined.sample(x,z):base.sample(x,z);
  const obstacles=pkg.landscapeCoverFootprints??[];
  const output=[],rejected={},patches=[],bounds=P.bounds;let candidates=0,rootSamples=0,mountainInstances=0,materialSamples=0,yields=0,budgetStart=now(),secondaryFanCount=0;
  const reject=reason=>{rejected[reason]=(rejected[reason]??0)+1;};
  const tiles=[];for(let iz=0;iz<27;iz++)for(let ix=0;ix<24;ix++)tiles.push({ix,iz,minX:bounds.minX+ix*32,minZ:bounds.minZ+iz*32});
  if(order==='REVERSE')tiles.reverse();if(order==='CHUNKED')tiles.sort((a,b)=>(a.ix%3)-(b.ix%3)||b.iz-a.iz);
  for(const tile of tiles){const entries=[],maxX=tile.minX+32,maxZ=tile.minZ+32;
    for(let iz=Math.ceil((tile.minZ+736)/P.spacing);-736+iz*P.spacing<maxZ;iz++)for(let ix=Math.ceil((tile.minX+384)/P.spacing);-384+ix*P.spacing<maxX;ix++){
      candidates++;if(now()-budgetStart>=8){onProgress({phase:'GLOBAL_COVER_PLANNING',candidateCount:candidates,instanceCount:output.length+patches.reduce((n,t)=>n+t.entries.length,0)+entries.length,rootSampleCount:rootSamples});await yieldControl();yields++;budgetStart=now();}
      const id=`${ix}:${iz}`,x=f(-384+ix*P.spacing+(hash(id,'x')-.5)*.65),z=f(-736+iz*P.spacing+(hash(id,'z')-.5)*.65);
      if(x<bounds.minX+2||x>bounds.maxX-2||z<bounds.minZ+2||z>bounds.maxZ-2){reject('BOUNDARY_COLLAR');continue;}
      const support=sample(x,z);if(!support){reject('SURFACE_MISSING');continue;}const centerWater=water.sample(x,z);if(centerWater&&support.y<=centerWater.y+.01){reject('RENDERED_WATER');continue;}
      const authored=inverseHEarthGroundCoverPoint(x,support.y,z);if(!clear(authored.x,authored.z,1.4)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<t.radius+1.4)){reject('PRESERVED_OR_RESERVED');continue;}
      const m=materialAt(authored.x,authored.z);materialSamples++;if(!eligibleMaterial(m,support.slope)){reject('HABITAT');continue;}
      const mountain=m.surfaceClass==='STONE_AND_SPARSE_SOIL',broad=field(authored.x,authored.z,36,'broad'),local=field(authored.x,authored.z,9,'local'),density=clamp((mountain?.57:.76)+.20*(broad-.5)+.16*(local-.5)-.13*(m.rockExposure??0));
      if(hash(id,'density')>density){reject('DENSITY');continue;}
      const angle=f(hash(id,'angle')*Math.PI*2),width=f(1.35+hash(id,'width')*.65),height=f(.92+hash(id,'height')*.42),record=new Float32Array(20),seen=new Map();let valid=true;
      for(let root=0;root<12;root++){
        const p=transformHEarthGroundCoverRoot(template,root,x,z,angle,width),key=`${p.x}:${p.z}`;let result=seen.get(key);
        if(!result){const s=sample(p.x,p.z);rootSamples++;if(!s){valid=false;break;}const w=water.sample(p.x,p.z);if(w&&s.y<=w.y+.01){valid=false;break;}const a=inverseHEarthGroundCoverPoint(p.x,s.y,p.z),mm=materialAt(a.x,a.z);materialSamples++;result={s,a,m:mm};seen.set(key,result);}
        if(!eligibleMaterial(result.m,result.s.slope)||!clear(result.a.x,result.a.z)||obstacles.some(t=>Math.hypot(p.x-t.x,p.z-t.z)<t.radius)){valid=false;break;}
        record[root]=result.s.y;
      }
      if(!valid){reject('ROOT_COLLAR');continue;}
      const palette=field(authored.x,authored.z,12,'palette');record.set([x,z,angle,width,height,palette,hash(id,'variation'),0],12);entries.push({id,record,mountain});
      // Overlapping accepted fans make selected continuous pockets bushier.
      // The existing primary fan and its random channels remain unchanged.
      if(broad>.54&&local>.40&&hash(id,'bushy')<.70){
        const secondId=`${id}:BUSH`,heading=hash(secondId,'offset-heading')*Math.PI*2,radius=.15+hash(secondId,'offset-radius')*.15,sx=f(x+Math.cos(heading)*radius),sz=f(z+Math.sin(heading)*radius);
        const secondSupport=sample(sx,sz),secondWater=water.sample(sx,sz);
        if(sx<bounds.minX+2||sx>bounds.maxX-2||sz<bounds.minZ+2||sz>bounds.maxZ-2||!secondSupport||(secondWater&&secondSupport.y<=secondWater.y+.01)){reject('BUSH_SURFACE_OR_WATER');continue;}
        const sa=inverseHEarthGroundCoverPoint(sx,secondSupport.y,sz);
        if(!clear(sa.x,sa.z,1.4)||obstacles.some(t=>Math.hypot(sx-t.x,sz-t.z)<t.radius+1.4)){reject('BUSH_PRESERVED_OR_RESERVED');continue;}
        const sm=materialAt(sa.x,sa.z);materialSamples++;
        if(!eligibleMaterial(sm,secondSupport.slope)){reject('BUSH_HABITAT');continue;}
        const secondAngle=f((angle+2.399963229728653+(hash(secondId,'angle')-.5)*.35)%(Math.PI*2)),secondWidth=f(1.25+hash(secondId,'width')*.55),secondHeight=f(1.08+hash(secondId,'height')*.37),secondRecord=new Float32Array(20),secondSeen=new Map();let secondValid=true;
        for(let root=0;root<12;root++){
          const p=transformHEarthGroundCoverRoot(template,root,sx,sz,secondAngle,secondWidth),key=`${p.x}:${p.z}`;let result=secondSeen.get(key);
          if(!result){const s=sample(p.x,p.z);rootSamples++;if(!s){secondValid=false;break;}const w=water.sample(p.x,p.z);if(w&&s.y<=w.y+.01){secondValid=false;break;}const a=inverseHEarthGroundCoverPoint(p.x,s.y,p.z),mm=materialAt(a.x,a.z);materialSamples++;result={s,a,m:mm};secondSeen.set(key,result);}
          if(!eligibleMaterial(result.m,result.s.slope)||!clear(result.a.x,result.a.z)||obstacles.some(t=>Math.hypot(p.x-t.x,p.z-t.z)<t.radius)){secondValid=false;break;}
          secondRecord[root]=result.s.y;
        }
        if(!secondValid){reject('BUSH_ROOT_COLLAR');continue;}
        secondRecord.set([sx,sz,secondAngle,secondWidth,secondHeight,field(sa.x,sa.z,12,'palette'),hash(secondId,'variation'),1],12);
        entries.push({id:secondId,record:secondRecord,mountain:sm.surfaceClass==='STONE_AND_SPARSE_SOIL'});secondaryFanCount++;
      }
    }
    entries.sort((a,b)=>a.id.localeCompare(b.id));patches.push({...tile,maxX,maxZ,entries});
    if(now()-budgetStart>=8){await yieldControl();yields++;budgetStart=now();}
  }
  patches.sort((a,b)=>a.iz-b.iz||a.ix-b.ix);
  const packedTiles=[];for(const tile of patches){const start=output.length;for(const p of tile.entries){output.push(p.record);if(p.mountain)mountainInstances++;}if(tile.entries.length)packedTiles.push({start,count:tile.entries.length,minX:tile.minX-1.8,maxX:tile.maxX+1.8,minZ:tile.minZ-1.8,maxZ:tile.maxZ+1.8});}
  if(output.length>P.maximumInstances)throw Error(`GLOBAL_COVER_POPULATION_BUDGET_EXCEEDED:${output.length}`);
  const records=new Float32Array(output.length*20);output.forEach((r,i)=>records.set(r,i*20));
  const templateGpuBytes=template.positions.byteLength+template.normals.byteLength+template.colors.byteLength+template.indices.byteLength+template.rootInfo.byteLength,totalGpuBytes=records.byteLength+templateGpuBytes;
  if(totalGpuBytes>P.maximumGpuBytes)throw Error('GLOBAL_COVER_GPU_BUDGET_EXCEEDED');
  const receipt=Object.freeze({schema:P.id,instanceCount:output.length,primaryFanCount:output.length-secondaryFanCount,secondaryFanCount,bushyClumpCount:secondaryFanCount,mountainInstanceCount:mountainInstances,candidateCount:candidates,rootSampleCount:rootSamples,materialSampleCount:materialSamples,recordBytes:records.byteLength,templateGpuBytes,totalGpuBytes,maximumInstances:P.maximumInstances,baseTerrainTriangleCount:base.triangleCount,refinementTriangleCount:refined?.triangleCount??0,elapsedMilliseconds:now()-started,yieldCount:yields,rejections:Object.freeze(Object.fromEntries(Object.entries(rejected).sort())),canonicalPopulationChanged:false,cameraIndependent:true,rootEncoding:'TWELVE_ACTUAL_FLOAT32_RENDERED_TRIANGLE_ROOT_HEIGHTS',sparseSoilPresentationRule:'SOURCE_CLASS_UNCHANGED_SOIL_GTE_0.035_ACTUAL_SLOPE_LTE_0.35',bushyPocketRule:'BROAD_GT_0.54_LOCAL_GT_0.40_HASH_LT_0.70_SECOND_ACCEPTED_FAN_SEPARATELY_QUALIFIED'});
  onProgress({phase:'GLOBAL_COVER_COMPLETE',instanceCount:output.length,totalGpuBytes});
  return{records,tiles:packedTiles,template,receipt};
}

export function selectHEarthGlobalGroundCoverDraws(cover,camera,{maximumInstances=4096,maximumDraws=64}={}){
  if(!Number.isInteger(maximumInstances)||maximumInstances<1||!Number.isInteger(maximumDraws)||maximumDraws<1)throw Error('GLOBAL_COVER_VISIBILITY_BUDGET_INVALID');
  const p=camera?.position??camera;if(!p||![p.x,p.z].every(Number.isFinite))throw Error('GLOBAL_COVER_CAMERA_INVALID');
  const ranked=cover.tiles.map(t=>{const dx=p.x-Math.max(t.minX,Math.min(t.maxX,p.x)),dz=p.z-Math.max(t.minZ,Math.min(t.maxZ,p.z));return{tile:t,distance:Math.hypot(dx,dz)};}).filter(t=>t.distance<=128).sort((a,b)=>a.distance-b.distance||a.tile.start-b.tile.start);
  const draws=[];let visibleInstanceCount=0;
  for(const {tile,distance} of ranked){if(draws.length>=maximumDraws||visibleInstanceCount>=maximumInstances)break;let stride=distance<32?1:distance<64?2:distance<96?4:8;const available=maximumInstances-visibleInstanceCount;stride=Math.max(stride,Math.ceil(tile.count/available));const count=Math.min(available,Math.ceil(tile.count/stride));if(count){draws.push({start:tile.start,count,stride});visibleInstanceCount+=count;}}
  return{draws,visibleInstanceCount,storedInstanceCount:cover.receipt.instanceCount,populationChanged:false};
}
