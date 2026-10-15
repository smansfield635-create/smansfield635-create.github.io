#!/usr/bin/env node
/** H-EARTH geological survey v1 — read-only exact Gen2666 canonical package triangle and hydrology analysis.
 * Operates on the ORIGINAL pinned canonical package. It does not claim to reproduce the
 * runtime camera refinement patch, WebGL GPU pixels or freshwater flow volume.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CONTRACT = 'H_EARTH_REAR_GEOLOGICAL_EXACT_PACKAGE_SURVEY_v1';
const CANDIDATES = Object.freeze([
  {id:'B_REAR_RAVINE',x:40,z:-268},
  {id:'A_EASTERN_REAR_ESCARPMENT',x:80,z:-270},
  {id:'C_WESTERN_REAR_RIDGE',x:-12,z:-252}
]);
const STUDY = Object.freeze({xMin:-160,xMax:160,zMin:-384,zMax:-120,step:2});
const OASIS = Object.freeze({xMin:-18,xMax:34,zMin:-204,zMax:-131});
const NEIGHBORS = Object.freeze([[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]);
const round = (v,p=6)=>v===null||!Number.isFinite(v)?null:Number(v.toFixed(p));
const sha = bytes=>createHash('sha256').update(bytes).digest('hex');
function invariant(p,detail){if(!p)throw Error('EXACT_SURVEY_INVALID:'+detail)}
function inside(x,z,b){return x>=b.xMin&&x<=b.xMax&&z>=b.zMin&&z<=b.zMax}

/** Binned contact sampler over actual canonical package triangles, not a smooth source field. */
export function makeContactField(canonical,{domain=STUDY,cellSize=16}={}){
  const indices=canonical?.buffers?.indices,positions=canonical?.buffers?.positions,spans=canonical?.primitiveSpans;
  invariant(Array.isArray(indices)&&Array.isArray(positions)&&Array.isArray(spans),'PACKAGE_BUFFERS');
  const bins=new Map(),tris=[],stats={terrainSpanCount:0,triangleCount:0,degenerateCount:0,domainTriangles:0};
  const add=(key,i)=>{let list=bins.get(key);if(!list){list=[];bins.set(key,list)}list.push(i)};
  for(const span of spans){if(span.role!=='TERRAIN')continue;stats.terrainSpanCount++;
    invariant(Number.isInteger(span.indexStart)&&Number.isInteger(span.indexCount)&&span.indexStart>=0&&span.indexCount>=0&&span.indexCount%3===0&&span.indexStart+span.indexCount<=indices.length,'TERRAIN_SPAN_BOUNDS');
    for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){stats.triangleCount++;
      const points=[];
      for(let k=0;k<3;k++){const id=indices[j+k];invariant(Number.isSafeInteger(id)&&id>=0&&id*3+2<positions.length,'TERRAIN_TRIANGLE_INDEX');const o=id*3;points.push([Math.fround(positions[o]),Math.fround(positions[o+1]),Math.fround(positions[o+2])]);}
      const [a,b,c]=points;const xMin=Math.min(a[0],b[0],c[0]),xMax=Math.max(a[0],b[0],c[0]),zMin=Math.min(a[2],b[2],c[2]),zMax=Math.max(a[2],b[2],c[2]);
      if(xMax<domain.xMin||xMin>domain.xMax||zMax<domain.zMin||zMin>domain.zMax)continue;
      const d=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);if(Math.abs(d)<1e-10){stats.degenerateCount++;continue;}
      const gx=((b[1]-a[1])*(c[2]-a[2])-(c[1]-a[1])*(b[2]-a[2]))/((b[0]-a[0])*(c[2]-a[2])-(c[0]-a[0])*(b[2]-a[2]));
      const gz=((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]))/((b[0]-a[0])*(c[2]-a[2])-(c[0]-a[0])*(b[2]-a[2]));
      const t={a,b,c,d,gx,gz,offset:j,spanId:span.primitiveId??null,xMin,xMax,zMin,zMax};const id=tris.length;tris.push(t);stats.domainTriangles++;
      for(let bx=Math.floor(xMin/cellSize);bx<=Math.floor(xMax/cellSize);bx++)for(let bz=Math.floor(zMin/cellSize);bz<=Math.floor(zMax/cellSize);bz++)add(bx+':'+bz,id);
    }
  }
  invariant(stats.terrainSpanCount>0&&stats.domainTriangles>0,'TERRAIN_SPANS_EMPTY');
  function sample(x,z){const list=bins.get(Math.floor(x/cellSize)+':'+Math.floor(z/cellSize))||[];
    for(const i of list){const t=tris[i];if(x<t.xMin-1e-7||x>t.xMax+1e-7||z<t.zMin-1e-7||z>t.zMax+1e-7)continue;
      const {a,b,c,d}=t,u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/d,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/d,w=1-u-v;
      if(Math.min(u,v,w)>=-1e-7)return {x,z,y:u*a[1]+v*b[1]+w*c[1],slope:Math.hypot(t.gx,t.gz),gradient:{x:t.gx,z:t.gz},triangleIndexOffset:t.offset,primitiveId:t.spanId};
    }return null;
  }
  return {sample,stats,bucketCount:bins.size,binSize:cellSize};
}

export function sampleSite(field,candidate){const {x,z}=candidate;
  const portal=field.sample(x,z),front=field.sample(x,z-16),interior=field.sample(x,z+16);
  const approach=[],crossSection=[];
  for(let d=0;d<=40;d+=2)approach.push(field.sample(x,z-d));
  for(let dx=-12;dx<=12;dx+=2)crossSection.push(field.sample(x+dx,z));
  const voidSamples=[{x,z:z+4},{x,z:z+12},{x,z:z+20},{x:x-4,z:z+12},{x:x+4,z:z+12}].map(p=>field.sample(p.x,p.z));
  const intact=approach.every(Boolean)&&crossSection.every(Boolean)&&voidSamples.every(Boolean)&&Boolean(interior);
  const ascents=approach.slice(1).map((p,i)=>p&&approach[i]?p.y-approach[i].y:null);
  const safeBasin=(front&&portal)?front.y<=portal.y:null;
  return {id:candidate.id,portal:{x,z},exactTerrainSamplePresent:Boolean(portal),portalSample:siteCell(portal),rearApron16m:siteCell(front),inwardSurface16m:siteCell(interior),fullProfileAvailable:intact,rearwardDescending40m:ascents.every(d=>d!==null&&d<=1e-8),maximumUphillStep:round(Math.max(...ascents.filter(d=>d!==null),0)),recessEvidence: voidSamples.map(siteCell),approach:approach.map(siteCell),crossSection:crossSection.map(siteCell),slopeToApron:portal&&front?round((portal.y-front.y)/16):null,apronDownhill:safeBasin,
  preliminaryPhysicalInterpretation:'BASE_TERRAIN_SURFACE_AND_BENEATH_ROOF_UNPROVEN; NO_CAVERN_OCCUPANCY_OR_NAVIGATION_CLAIM'};
}
function siteCell(s){return s?{x:s.x,z:s.z,height:round(s.y),slope:round(s.slope),triangleOffset:s.triangleIndexOffset,primitiveId:s.primitiveId}:null}

export function traceD8(field,start,{study=STUDY,step=2,maxSteps=1500,entry=OASIS}={}){
  const snap=v=>Math.round(v/step)*step;
  let x=snap(start.x),z=snap(start.z),begin=field.sample(x,z);if(!begin)return {result:'NO_SURFACE_CONTACT',steps:0,source:null};
  const visited=new Set(),headHeight=begin.y,trail=[],status=[];
  for(let i=0;i<maxSteps;i++){
    let current=field.sample(x,z);if(!current){status.push('MISSING_MESH');break}
    trail.push({x,z,height:round(current.y)});
    if(inside(x,z,entry)){status.push('ENTERS_OASIS_STUDY_FOOTPRINT');break}
    const key=x+','+z;if(visited.has(key)){status.push('CYCLE');break}visited.add(key);
    let best=null,bestSlope=0;
    for(let k=0;k<NEIGHBORS.length;k++){const [dx,dz]=NEIGHBORS[k],nx=x+dx*step,nz=z+dz*step;
      if(!inside(nx,nz,study))continue;const neighbor=field.sample(nx,nz);if(!neighbor)continue;
      const slope=(current.y-neighbor.y)/(step*Math.hypot(dx,dz));if(slope>bestSlope+1e-12){best={x:nx,z:nz,neighbor,slope};bestSlope=slope}
    }
    if(!best){status.push(x<=study.xMin||x>=study.xMax||z<=study.zMin||z>=study.zMax?'STUDY_EDGE_UNRESOLVED':'NO_STRICT_LOWER_NEIGHBOR_IN_STUDY');break}
    x=best.x;z=best.z;
    if(!inside(x,z,study)){status.push('STUDY_BOUNDARY');break}
  }
  if(status.length===0)status.push('MAX_STEPS');
  const last=trail.at(-1);
  return {result:status[0],start:{x:snap(start.x),z:snap(start.z),height:round(headHeight)},steps:trail.length,final:last,netElevationFall:round(headHeight-last.height),pathLengthMeters:round(trail.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-trail[i].x,p.z-trail[i].z),0)),path:trail,firstSamples:trail.slice(0,12),lastSamples:trail.slice(-12),entersOasis:status[0]==='ENTERS_OASIS_STUDY_FOOTPRINT'};
}
export function analyzeCanonicalWorld(value,manifest,{surveyHead=null}={}){
  invariant(value?.canonical?.packageIdentity===manifest.packageIdentity,'PACKAGE_IDENTITY');
  const canonical=value.canonical,raw=value.raw;
  invariant(raw?.packageIdentity===manifest.rawPackageIdentity,'RAW_PACKAGE_IDENTITY');
  for(const [key,len] of Object.entries(manifest.bufferLengths)){invariant(canonical.buffers?.[key]?.length===len,'CANONICAL_BUFFER_LENGTH:'+key);invariant(raw.buffers?.[key]?.length===len,'RAW_BUFFER_LENGTH:'+key)}
  invariant(Array.isArray(canonical.primitiveSpans)&&canonical.primitiveSpans.length,'CANONICAL_SPANS_MISSING');
  const field=makeContactField(canonical);const candidates=CANDIDATES.map(x=>sampleSite(field,x));
  const routes=CANDIDATES.map(x=>({id:x.id,...traceD8(field,x)}));
  const probes=[{id:'UPPER_FOOTHILL_20_NEG220',x:20,z:-220},{id:'UPPER_FOOTHILL_0_NEG220',x:0,z:-220}].map(x=>({id:x.id,...traceD8(field,x)}));
  const compared=routes.filter(x=>x.entersOasis).length;
  const surfaceRoles=canonical.primitiveSpans.map(x=>({role:x.role,primitiveId:x.primitiveId,indexCount:x.indexCount}));
  const visibleWaterCandidates=surfaceRoles.filter(x=>/WATER|OCEAN/i.test((x.role??'')+' '+(x.primitiveId??'')));
  return {schema:CONTRACT,result:'EXACT_PACKAGE_TRIANGLE_SURVEY_COMPLETED_NOT_RENDERED_PIXEL_ACCEPTANCE',source:{surveyHead,canonicalPackageIdentity:canonical.packageIdentity,rawPackageIdentity:raw.packageIdentity,manifestId:manifest.operationId,compressedSourceSha256:manifest.binary.sha256,terrainRole:'TERRAIN',bufferNames:manifest.bufferNames},studyDomain:STUDY,terrainTriangleIndex:{...field.stats,spatialBucketCount:field.bucketCount,binSize:field.binSize},waterRoleSurvey:{visibleWaterCandidates,freshwaterNotDemonstrated:true,waterToRiverConnectivityNotDemonstrated:true},candidates,drainage:{algorithm:'STRICT_LOWER_MAXIMUM_SLOPE_D8_ON_ACTUAL_CANONICAL_INDEXED_TERRAIN',gridStepMeters:STUDY.step,study:STUDY,oasisStudy:OASIS,cavernRoutes:routes,controlRoutes:probes,observedCavernRoutesIntoOasis:compared},limitations:{actualPackageBytesVerified:true,canonicalWorldMutated:false,rendererRefinementPatchExecuted:false,planetaryTransformGpuCompareExecuted:false,androidVisualInspectionExecuted:false,cavernExcavationConstructed:false,waterSourceProven:false,permanentFlowEstablished:false,vegetationContactRecomputed:false,terrainGradeToBeAuthored:true},decision:'SITE_CHOICE_UNRESOLVED_UNTIL_FULL_SURVEY_AND_ROOF_HEADROOM_AND_NAVIGATION'};
}
export function loadVerifiedWorld(worldPath,manifestPath){const manifest=JSON.parse(readFileSync(manifestPath,'utf8')),packed=readFileSync(worldPath);
  invariant(manifest.binary.bytes===packed.length,'GZIP_LENGTH');invariant(manifest.binary.sha256===sha(packed),'GZIP_SHA256');
  const decompressed=gunzipSync(packed);invariant(manifest.binary.uncompressedBytes===decompressed.length,'UNCOMPRESSED_LENGTH');
  return {manifest,value:JSON.parse(decompressed.toString('utf8'))};
}
function cli(argv){let params={};for(let i=0;i<argv.length;i+=2){invariant(['--world','--manifest','--output','--head'].includes(argv[i])&&argv[i+1],'CLI_ARGS');params[argv[i].slice(2)]=argv[i+1]}for(let k of ['world','manifest','output'])invariant(params[k],'CLI_REQUIRED_'+k);const {manifest,value}=loadVerifiedWorld(resolve(params.world),resolve(params.manifest));const record=analyzeCanonicalWorld(value,manifest,{surveyHead:params.head||null});writeFileSync(resolve(params.output),JSON.stringify(record,null,2)+'\n');return record;}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{const record=cli(process.argv.slice(2));console.log(JSON.stringify({schema:record.schema,result:record.result,domainTriangles:record.terrainTriangleIndex.domainTriangles,output:process.argv[process.argv.indexOf('--output')+1]}))}catch(error){console.error(JSON.stringify({schema:CONTRACT,result:'FAIL_CLOSED',error:error.message}));process.exitCode=1}}
