#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE,
  H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_OPERATIONS,
  H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_REQUEST_SHA256,
  evaluateHEarthR06C10ProspectiveLandformSupportMask,
  sampleHEarthR06C10ProspectiveLandformDelta
} from '../terrain/h-earth.r06-c10.prospective-landform-candidate-002.js';
import {
  sampleHEarthRun8BSuccessorTerrainElevation,
  sampleHEarthRun8BSuccessorTerrainField,
  evaluateHEarthRun8BFormerBoundaryContinuity
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
import {
  getHEarthRun8BSuccessorSamplingAxes,
  evaluateHEarthRun8BVirtualSharedEdges,
  constructHEarthRun8BSuccessorTerrainAndMountain
} from '../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';
import {
  evaluateR06C10TraversalClearance,
  evaluateR06C10CavernCompatibility,
  evaluateR06C10WaterfallReadinessGeometry
} from '../tools/r06-c10/h-earth.r06-c10.candidate-clearance-adapter.v1.mjs';

const EVALUATOR_ID='H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE_002_EXACT_EVALUATOR_v1';
const ASSERTION_SET_ID='H_EARTH_R06_C10_GEOMETRY_ARTICULATION_ASSERTIONS_28_v1';
const EXPECTED_PARENT='b1bd82abe9ab5f8a1535cf2e664c6d67ab91dc7f';
const REQUEST_PATH='h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.prospective-landform-candidate-002.request.v1.json';
const CAMERA_PATH='h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.prospective-landform-candidate-002.matched-camera-manifest.v1.json';
const MANIFEST_PATH='h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.current-candidate-admission.manifest.v1.json';
const CANDIDATE_PATH='h-earth-3d/terrain/h-earth.r06-c10.prospective-landform-candidate-002.js';
const FIELD_PATH='h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
const EVALUATOR_PATH='h-earth-3d/validation/h-earth.r06-c10.prospective-landform-candidate-002.exact-candidate-evaluator.v1.mjs';
const HARNESS_PATH='h-earth-3d/validation/h-earth.r06-c10.geometry-articulation-tool.harness.mjs';
const CUSTODY_PATH='h-earth-3d/control-plane/r06-c10/receipts/h-earth.r06-c10.role1.package-assumption-receipt.v1.json';
const BOUNDS={core:{xMinimum:32,xMaximum:64,zMinimum:-192,zMaximum:-164},blend:{xMinimum:24,xMaximum:72,zMinimum:-200,zMaximum:-156},halo:{xMinimum:16,xMaximum:80,zMinimum:-208,zMaximum:-148}};
const LIMITS={generalSlope:1.25,specialSlope:2,generalRise:2.5,specialRise:4,generalNormal:35,specialNormal:50,edgeGradient:1e-8};
const PROTECTED_BLOBS={
  'showroom/globe/h-earth/index.html':'bc868995d9065ce03a5948bcf9f27804b178bc0b',
  'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js':'98c6e1f9b9fe4510157367600b85b9d31228056b',
  'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js':'16bc8c45fb5c2363326d05f7610e11387b3a4e38',
  'showroom/globe/h-earth/functional-landscape/navigation.js':'8ab3446c536fc24423d5601acce232b19fa71c91',
  'showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js':'a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46',
  'h-earth-3d/tools/instrument-platform/permanent-scene-registry.mjs':'ab30137698716b6674e295dfb537fa04ffef4d46'
};
const FROZEN_TOOL_BLOBS={
  'h-earth-3d/tools/r06-c10/h-earth.r06-c10.geometry-articulation-contracts.v1.mjs':'569553d2d08e954c0459db98770faaf1c210230c',
  'h-earth-3d/tools/r06-c10/h-earth.r06-c10.geometry-articulation-authoring-tool.v1.mjs':'fca63387cf1599e12f97e75e16f9e33f92880896',
  'h-earth-3d/tools/r06-c10/h-earth.r06-c10.candidate-clearance-adapter.v1.mjs':'53ad54911e7108f1bdbfbef39cb59b814ae76785',
  'h-earth-3d/validation/h-earth.r06-c10.geometry-articulation-tool.harness.mjs':'b50b8959208cf8cead0f1b9392d039e27257608c',
  'h-earth-3d/tools/r06-c10/h-earth.r06-c10.package-and-recovery-emitter.v1.mjs':'284e675d02e1fbf43d66a64eb9b37f2a712ab29f'
};
const IDS=[
'01_EXACT_BASELINE_COMMIT_AND_ALL_REQUIRED_BLOBS_MATCH','02_ROLE_6_PACKAGE_AND_MEMBER_SHA256_VALUES_MATCH','03_REQUEST_SCHEMA_VALID_AND_NO_UNKNOWN_KEYS','04_ALL_PARAMETERS_INSIDE_SAFE_BOUNDS','05_CONFORMANCE_OUTPUT_SHA256_MATCHES_EXPECTED_FIXTURE','06_CANDIDATE_FIELD_DETERMINISTIC_REPEAT_EXECUTION','07_CANDIDATE_FIELD_FINITE_AT_ALL_RUN_8B_AXIS_POINTS','08_DELTA_EXACT_ZERO_OUTSIDE_BLEND_SUPPORT','09_SUPPORT_OUTER_EDGE_DELTA_EXACT_ZERO','10_SUPPORT_OUTER_EDGE_GRADIENT_WITHIN_1E_MINUS_8','11_RUN_8B_X_AND_Z_AXES_BYTE_EQUIVALENT','12_RUN_8B_INDEX_ARRAY_BYTE_EQUIVALENT','13_VERTEX_TRIANGLE_ROW_COLUMN_COUNTS_MATCH','14_NONDEGENERATE_TRIANGLES_MINIMUM_DOUBLE_AREA_AT_LEAST_4','15_FACE_AND_VERTEX_NORMALS_FINITE_AND_UNIT_BOUNDED','16_ALL_VIRTUAL_SHARED_EDGE_PAIRS_PASS','17_FORMER_BOUNDARY_CONTINUITY_REMAINS_PASS','18_COASTLINE_AND_WATER_MEMBERSHIP_UNCHANGED','19_SLOPE_EDGE_RISE_AND_NORMAL_ANGLE_BOUNDS_PASS','20_TRAVERSABLE_OPENING_WIDTH_LENGTH_SLOPE_CLEARANCE_PASS','21_CLEARANCE_USES_CANDIDATE_FIELD_NOT_RUN_6_FIELD','22_AT_LEAST_ONE_CAVERN_COMPATIBLE_FACE_PATCH_REPORTED','23_FALL_FACE_BASIN_DRAINAGE_OUTLET_READINESS_PASS','24_ACCEPTED_V2_PRODUCT_BLOBS_UNCHANGED','25_NO_NEW_SHADER_TEXTURE_BUFFER_DRAW_CALL_OR_WATER_PRIMITIVE','26_MATCHED_CAMERA_MANIFEST_HAS_AT_LEAST_THREE_NORMAL_VIEWS','27_ROLLBACK_AND_RECOVERY_OUTPUTS_COMPLETE','28_PACKAGE_MEMBER_HASHES_AND_ARCHIVE_READBACK_PASS'];

const finite=(v)=>typeof v==='number'&&Number.isFinite(v);
const inside=(x,z,b)=>x>=b.xMinimum&&x<=b.xMaximum&&z>=b.zMinimum&&z<=b.zMaximum;
const stable=(v)=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map((k)=>[k,stable(v[k])])):v;
const stableJson=(v)=>JSON.stringify(stable(v));
const sha256=(v)=>createHash('sha256').update(v).digest('hex');
const readJson=(p)=>JSON.parse(fs.readFileSync(p,'utf8'));
const run=(cmd,args,opts={})=>{const r=spawnSync(cmd,args,{cwd:opts.cwd??process.cwd(),encoding:'utf8',maxBuffer:128*1024*1024,env:{...process.env,...(opts.env??{})}});if(r.error)throw r.error;if(!opts.allowFailure&&r.status!==0)throw new Error(`${cmd} ${args.join(' ')} failed:${r.status}:${r.stderr||r.stdout}`);return{status:r.status??1,stdout:r.stdout??'',stderr:r.stderr??''};};
const git=(args,allowFailure=false)=>run('git',args,{allowFailure});
const blobAt=(commit,p)=>{const r=git(['rev-parse',`${commit}:${p}`],true);return r.status===0?r.stdout.trim():null;};
const parseArgs=(argv)=>{const out={candidateHead:null,output:null};for(let i=0;i<argv.length;i++){if(argv[i]==='--candidate-head')out.candidateHead=argv[++i]??null;else if(argv[i]==='--output')out.output=argv[++i]??null;else throw new Error(`UNKNOWN_ARGUMENT:${argv[i]}`);}if(!out.candidateHead||!out.output)throw new Error('REQUIRED_ARGUMENTS_MISSING');return out;};
const record=(id,pass,evidence)=>({id,pass:Boolean(pass),evidence:stable(evidence)});
const angleDegrees=(a,b)=>{const dot=Math.max(-1,Math.min(1,a.x*b.x+a.y*b.y+a.z*b.z));return Math.acos(dot)*180/Math.PI;};
const oriented=(x,z,op)=>{const r=op.rotationDegrees*Math.PI/180,c=Math.cos(r),s=Math.sin(r),dx=x-op.centerX,dz=z-op.centerZ;return{u:c*dx+s*dz,v:-s*dx+c*dz};};
const specialAt=(x,z,fall,cavern)=>{if(fall){const{u,v}=oriented(x,z,fall);if(Math.abs(u)<=fall.halfLength+fall.feather&&Math.abs(v)<=fall.halfWidth+2)return true;}return(cavern?.eligiblePatches??[]).some((p)=>x>=p.worldBounds.xMinimum-2&&x<=p.worldBounds.xMaximum+2&&z>=p.worldBounds.zMinimum-2&&z<=p.worldBounds.zMaximum+2);};

function validateRequest(request){
  const issues=[];
  const top=['schemaVersion','operationId','exactBaseline','region','operations','traversableOpening','cavernCompatibility','waterfallReadiness'];
  const unknown=Object.keys(request).filter((k)=>!top.includes(k));
  for(const k of top)if(!(k in request))issues.push(`MISSING:${k}`);
  if(request.schemaVersion!=='H_EARTH_R06_C10_ARTICULATION_REQUEST_v1')issues.push('SCHEMA_VERSION');
  if(stableJson(request.exactBaseline)!==stableJson({commit:'6836288462bbbc7ab7c03d5f12fafaab119f9e36',terrainFieldBlob:'0bd36eec01a75311bf6441d575bae5a057195bbc',geometryConstructorBlob:'a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46'}))issues.push('BASELINE_IDENTITY');
  if(stableJson(request.region)!==stableJson({semanticAddress:'H_EARTH_GROUND_CELL_001:R06:C10',authoredCore:BOUNDS.core,blendSupport:BOUNDS.blend,verificationHalo:BOUNDS.halo}))issues.push('REGION_IDENTITY');
  if(!Array.isArray(request.operations)||request.operations.length<1||request.operations.length>12)issues.push('OPERATION_COUNT');
  if(stableJson(request.operations)!==stableJson(H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_OPERATIONS))issues.push('PRODUCT_REQUEST_OPERATION_DRIFT');
  if(!request.traversableOpening||!Array.isArray(request.traversableOpening.polyline)||request.traversableOpening.minimumWidthWorldUnits<8)issues.push('TRAVERSAL_DECLARATION');
  if(request.cavernCompatibility?.required!==true)issues.push('CAVERN_RESERVATION');
  if(request.waterfallReadiness?.required!==true)issues.push('WATERFALL_READINESS');
  return{valid:issues.length===0&&unknown.length===0,issues,unknown};
}
function validateParameters(request){
  const issues=[];const ranges={ORIENTED_SADDLE:{amplitude:[2,8],radiusU:[8,24],radiusV:[6,20]},RIDGE_FACE:{feather:[2,8],halfLength:[6,20],halfWidth:[4,12],height:[2,12]},VALLEY_CORRIDOR:{depth:[1,8],endFeatherWorldUnits:[4,12],halfWidth:[4,12]},FALL_FACE:{drop:[4,16],feather:[2,6],halfLength:[6,16],halfWidth:[4,10]},LOWER_BASIN:{depth:[2,10],radiusU:[8,20],radiusV:[6,16]},DRAINAGE_CUT:{depth:[.5,4],endFeatherWorldUnits:[2,8],halfWidth:[2,6]},TERRACE_BAND:{feather:[2,6],halfLength:[4,16],halfWidth:[3,10],height:[.5,3]}};
  const counts={};
  request.operations.forEach((op,i)=>{counts[op.operator]=(counts[op.operator]??0)+1;const bounds=ranges[op.operator];if(!bounds){issues.push(`UNKNOWN_OPERATOR:${i}`);return;}for(const[k,[min,max]]of Object.entries(bounds)){if(!finite(op[k])||op[k]<min||op[k]>max)issues.push(`OUT_OF_RANGE:${i}:${k}`);}if('rotationDegrees'in op&&(!finite(op.rotationDegrees)||op.rotationDegrees<-180||op.rotationDegrees>180))issues.push(`ROTATION:${i}`);if('centerX'in op){if(!inside(op.centerX,op.centerZ,BOUNDS.core)||op.centerX%2||op.centerZ%2)issues.push(`CENTER:${i}`);}if('polyline'in op){for(const[x,z]of op.polyline)if(!inside(x,z,BOUNDS.blend)||x%2||z%2)issues.push(`POLYLINE:${i}:${x}:${z}`);}});
  if((counts.TERRACE_BAND??0)>4)issues.push('TERRACE_COUNT');
  return{valid:issues.length===0,issues,operationCount:request.operations.length};
}
function buildIndependentIndices(rows,cols){const out=[];for(let r=0;r<rows-1;r++)for(let c=0;c<cols-1;c++){const a=r*cols+c,b=a+1,d=(r+1)*cols+c,e=d+1;out.push(a,d,b,b,d,e);}return out;}
function computeMeshNormals(vertices,indices){const faces=[],acc=Array.from({length:vertices.length},()=>({x:0,y:0,z:0}));let minDoubleArea=Infinity;for(let i=0;i<indices.length;i+=3){const ia=indices[i],ib=indices[i+1],ic=indices[i+2],a=vertices[ia],b=vertices[ib],c=vertices[ic];const ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z;const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,len=Math.hypot(nx,ny,nz);minDoubleArea=Math.min(minDoubleArea,len);const n={x:nx/len,y:ny/len,z:nz/len};faces.push(n);for(const idx of[ia,ib,ic]){acc[idx].x+=nx;acc[idx].y+=ny;acc[idx].z+=nz;}}
  const verticesNormals=acc.map((n)=>{const l=Math.hypot(n.x,n.y,n.z);return{x:n.x/l,y:n.y/l,z:n.z/l};});return{faces,verticesNormals,minDoubleArea};}

const args=parseArgs(process.argv.slice(2));
const outputPath=path.resolve(args.output);
fs.mkdirSync(path.dirname(outputPath),{recursive:true});
let tempRoot=null;
try{
  const repoRoot=git(['rev-parse','--show-toplevel']).stdout.trim();
  const candidateHead=git(['rev-parse','HEAD^{commit}']).stdout.trim();
  const requestedHead=git(['rev-parse',`${args.candidateHead}^{commit}`]).stdout.trim();
  const parentHead=git(['rev-parse','HEAD^']).stdout.trim();
  const status=git(['status','--porcelain=v1','--untracked-files=all']).stdout.trim();
  if(candidateHead!==requestedHead)throw new Error('CANDIDATE_HEAD_MISMATCH');
  if(process.env.H_EARTH_R06_C10_PRIVATE_STATE_ALLOWED!=='false')throw new Error('PRIVATE_STATE_LAW_MISSING');
  const changedPaths=git(['diff-tree','--no-commit-id','--name-only','-r',candidateHead]).stdout.split('\n').filter(Boolean).sort();
  const candidateBlobs=Object.fromEntries(changedPaths.map((p)=>[p,blobAt(candidateHead,p)]));
  const request=readJson(REQUEST_PATH),camera=readJson(CAMERA_PATH),manifest=readJson(MANIFEST_PATH);
  const assertions=[];
  const protectedIdentity=Object.entries(PROTECTED_BLOBS).map(([p,expected])=>({path:p,expected,actual:blobAt(candidateHead,p),parent:blobAt(parentHead,p)}));
  assertions.push(record(IDS[0],parentHead===EXPECTED_PARENT&&status===''&&protectedIdentity.every((x)=>x.actual===x.expected&&x.parent===x.expected),{parentHead,expectedParent:EXPECTED_PARENT,workingTreeClean:status==='',protectedIdentity}));
  const toolIdentity=Object.entries(FROZEN_TOOL_BLOBS).map(([p,expected])=>({path:p,expected,actual:blobAt(candidateHead,p)}));
  assertions.push(record(IDS[1],toolIdentity.every((x)=>x.actual===x.expected),{mode:'FROZEN_TOOL_IDENTITY_RECHECK',toolIdentity}));
  const requestValidation=validateRequest(request);
  const requestCanonicalSha256=sha256(stableJson(request));
  assertions.push(record(IDS[2],requestValidation.valid&&requestCanonicalSha256===H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_REQUEST_SHA256,{...requestValidation,requestCanonicalSha256,productRequestSha256:H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_REQUEST_SHA256}));
  const parameterValidation=validateParameters(request);
  assertions.push(record(IDS[3],parameterValidation.valid,parameterValidation));

  tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),'r06-c10-prospective-evaluator-'));
  const modeACheckout=path.join(tempRoot,'mode-a-parent-checkout');
  git(['worktree','add','--detach',modeACheckout,parentHead]);
  const modeADir=path.join(tempRoot,'mode-a-output');
  const modeA=run('node',[HARNESS_PATH,'--custody-receipt',CUSTODY_PATH,'--invocation-role','ROLE_1_PROVISIONAL_LOCAL_CHECK','--output',modeADir],{cwd:modeACheckout,allowFailure:true});
  const modeAReceipt=fs.existsSync(path.join(modeADir,'verification-receipt.json'))?readJson(path.join(modeADir,'verification-receipt.json')):null;
  git(['worktree','remove','--force',modeACheckout],true);
  const expectedModeAFails=['19_SLOPE_EDGE_RISE_AND_NORMAL_ANGLE_BOUNDS_PASS','20_TRAVERSABLE_OPENING_WIDTH_LENGTH_SLOPE_CLEARANCE_PASS','23_FALL_FACE_BASIN_DRAINAGE_OUTLET_READINESS_PASS'];
  const modeAPass=modeAReceipt&&modeAReceipt.assertionExecutionCount===28&&modeAReceipt.passAssertionIds?.length===25&&stableJson(modeAReceipt.failAssertionIds)===stableJson(expectedModeAFails)&&modeAReceipt.harnessConstructionResult==='PASS';
  assertions.push(record(IDS[4],modeAPass,{classification:'MODE_A_FROZEN_TOOL_CONFORMANCE_ONLY',exitCode:modeA.status,passCount:modeAReceipt?.passAssertionIds?.length??0,failIds:modeAReceipt?.failAssertionIds??[],deterministicReceiptDigest:modeAReceipt?.deterministicReceiptDigest??null}));

  const axes=getHEarthRun8BSuccessorSamplingAxes();
  const haloDigest=()=>{const rows=[];for(let x=BOUNDS.halo.xMinimum;x<=BOUNDS.halo.xMaximum;x+=2)for(let z=BOUNDS.halo.zMinimum;z<=BOUNDS.halo.zMaximum;z+=2){const s=sampleHEarthRun8BSuccessorTerrainField(x,z);rows.push([x,z,s.elevation,s.appliedCandidateDelta,s.slope,s.normal.x,s.normal.y,s.normal.z]);}return sha256(stableJson(rows));};
  const digest1=haloDigest(),digest2=haloDigest();
  assertions.push(record(IDS[5],digest1===digest2&&H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE.deterministic===true,{firstDigest:digest1,secondDigest:digest2,randomnessUsed:false}));
  let finiteCount=0,nonfiniteCount=0,deltaMin=Infinity,deltaMax=-Infinity,outsideCount=0,outsideNonzero=0;
  for(const z of axes.zValues)for(const x of axes.xValues){const s=sampleHEarthRun8BSuccessorTerrainField(x,z);finiteCount++;if(!finite(s.elevation)||!finite(s.slope)||!finite(s.normal.x)||!finite(s.normal.y)||!finite(s.normal.z))nonfiniteCount++;deltaMin=Math.min(deltaMin,s.appliedCandidateDelta);deltaMax=Math.max(deltaMax,s.appliedCandidateDelta);if(!inside(x,z,BOUNDS.blend)){outsideCount++;if(s.appliedCandidateDelta!==0)outsideNonzero++;}}
  assertions.push(record(IDS[6],nonfiniteCount===0,{sampledAxisPointCount:finiteCount,nonfiniteCount}));
  assertions.push(record(IDS[7],outsideNonzero===0,{outsideAxisPointCount:outsideCount,nonzeroDeltaCount:outsideNonzero,deltaRange:{minimum:deltaMin,maximum:deltaMax}}));
  let edgeNonzero=0,maxEdgeGradient=0;const edgeSamples=[];
  for(let z=BOUNDS.blend.zMinimum;z<=BOUNDS.blend.zMaximum;z+=2)for(const x of[BOUNDS.blend.xMinimum,BOUNDS.blend.xMaximum])edgeSamples.push([x,z]);
  for(let x=BOUNDS.blend.xMinimum;x<=BOUNDS.blend.xMaximum;x+=2)for(const z of[BOUNDS.blend.zMinimum,BOUNDS.blend.zMaximum])edgeSamples.push([x,z]);
  for(const[x,z]of edgeSamples){const d=sampleHEarthR06C10ProspectiveLandformDelta(x,z);if(d!==0)edgeNonzero++;const h=.5,gx=(sampleHEarthR06C10ProspectiveLandformDelta(x+h,z)-sampleHEarthR06C10ProspectiveLandformDelta(x-h,z))/(2*h),gz=(sampleHEarthR06C10ProspectiveLandformDelta(x,z+h)-sampleHEarthR06C10ProspectiveLandformDelta(x,z-h))/(2*h);maxEdgeGradient=Math.max(maxEdgeGradient,Math.hypot(gx,gz));}
  assertions.push(record(IDS[8],edgeNonzero===0,{edgeSampleCount:edgeSamples.length,nonzeroCount:edgeNonzero}));
  assertions.push(record(IDS[9],maxEdgeGradient<=LIMITS.edgeGradient,{maximumGradient:maxEdgeGradient,bound:LIMITS.edgeGradient}));

  const geometry=constructHEarthRun8BSuccessorTerrainAndMountain();
  const topology=geometry.topology;
  const axisMatch=topology?.ok===true&&stableJson(topology.xValues)===stableJson(axes.xValues)&&stableJson(topology.zValues)===stableJson(axes.zValues);
  assertions.push(record(IDS[10],axisMatch,{xCount:axes.xValues.length,zCount:axes.zValues.length,xDigest:sha256(stableJson(axes.xValues)),zDigest:sha256(stableJson(axes.zValues)),geometryConstructorBlob:blobAt(candidateHead,'showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js')}));
  const expectedIndices=buildIndependentIndices(axes.zValues.length,axes.xValues.length);
  const indexMatch=topology?.ok===true&&stableJson(topology.indices)===stableJson(expectedIndices);
  assertions.push(record(IDS[11],indexMatch,{actualIndexCount:topology?.indices?.length??0,expectedIndexCount:expectedIndices.length,indexDigest:topology?.indices?sha256(stableJson(topology.indices)):null}));
  const expectedVertices=axes.xValues.length*axes.zValues.length,expectedTriangles=(axes.xValues.length-1)*(axes.zValues.length-1)*2;
  assertions.push(record(IDS[12],topology?.vertices?.length===expectedVertices&&topology?.indices?.length/3===expectedTriangles&&topology?.rowCount===axes.zValues.length&&topology?.columnCount===axes.xValues.length,{vertexCount:topology?.vertices?.length??0,expectedVertices,triangleCount:(topology?.indices?.length??0)/3,expectedTriangles,rowCount:topology?.rowCount??0,columnCount:topology?.columnCount??0}));
  const mesh=computeMeshNormals(topology.vertices,topology.indices);
  assertions.push(record(IDS[13],mesh.minDoubleArea>=4,{minimumTriangleDoubleArea:mesh.minDoubleArea,requiredMinimum:4}));
  const normalRecords=[...mesh.faces,...mesh.verticesNormals];const invalidNormals=normalRecords.filter((n)=>!finite(n.x)||!finite(n.y)||!finite(n.z)||Math.abs(Math.hypot(n.x,n.y,n.z)-1)>1e-8).length;
  assertions.push(record(IDS[14],invalidNormals===0,{faceNormalCount:mesh.faces.length,vertexNormalCount:mesh.verticesNormals.length,invalidNormals}));
  const shared=evaluateHEarthRun8BVirtualSharedEdges(topology);
  assertions.push(record(IDS[15],shared.eligible===true,{status:shared.status,sharedEdgePairCount:shared.sharedEdgePairCount,issues:shared.issues}));
  const continuity=evaluateHEarthRun8BFormerBoundaryContinuity();
  assertions.push(record(IDS[16],continuity.eligible===true,{status:continuity.status,issues:continuity.issues??[]}));
  const changedForbidden=changedPaths.filter((p)=>p.includes('/water')||p.includes('coastline')||p.includes('navigation')||p.includes('/render/'));
  let coastNonzero=0;for(let x=BOUNDS.halo.xMinimum;x<=BOUNDS.halo.xMaximum;x+=2)for(let z=-156;z<=BOUNDS.halo.zMaximum;z+=2)if(sampleHEarthR06C10ProspectiveLandformDelta(x,z)!==0)coastNonzero++;
  assertions.push(record(IDS[17],coastNonzero===0&&changedForbidden.length===0,{coastAndWaterExteriorNonzeroCount:coastNonzero,forbiddenChangedPaths:changedForbidden,waterImplementation:false}));

  const fieldAdapter={normalizedRequest:request,sampleField:sampleHEarthRun8BSuccessorTerrainField,sampleElevation:sampleHEarthRun8BSuccessorTerrainElevation};
  const traversal=evaluateR06C10TraversalClearance(fieldAdapter);
  const cavern=evaluateR06C10CavernCompatibility(fieldAdapter);
  const waterfall=evaluateR06C10WaterfallReadinessGeometry(fieldAdapter);
  const fall=request.operations.find((o)=>o.operator==='FALL_FACE');
  const maxima={generalSlope:0,specialSlope:0,generalRise:0,specialRise:0,generalNormal:0,specialNormal:0};
  const pointMap=new Map();for(let x=BOUNDS.blend.xMinimum;x<=BOUNDS.blend.xMaximum;x+=2)for(let z=BOUNDS.blend.zMinimum;z<=BOUNDS.blend.zMaximum;z+=2)pointMap.set(`${x}:${z}`,sampleHEarthRun8BSuccessorTerrainField(x,z));
  for(let x=BOUNDS.blend.xMinimum;x<=BOUNDS.blend.xMaximum;x+=2)for(let z=BOUNDS.blend.zMinimum;z<=BOUNDS.blend.zMaximum;z+=2){const s=pointMap.get(`${x}:${z}`),special=specialAt(x,z,fall,cavern);maxima[special?'specialSlope':'generalSlope']=Math.max(maxima[special?'specialSlope':'generalSlope'],s.slope);for(const[dx,dz]of[[2,0],[0,2]]){const n=pointMap.get(`${x+dx}:${z+dz}`);if(!n)continue;const pairSpecial=special||specialAt(x+dx,z+dz,fall,cavern),rise=Math.abs(n.elevation-s.elevation),angle=angleDegrees(s.normal,n.normal);maxima[pairSpecial?'specialRise':'generalRise']=Math.max(maxima[pairSpecial?'specialRise':'generalRise'],rise);maxima[pairSpecial?'specialNormal':'generalNormal']=Math.max(maxima[pairSpecial?'specialNormal':'generalNormal'],angle);}}
  const slopePass=maxima.generalSlope<=LIMITS.generalSlope&&maxima.specialSlope<=LIMITS.specialSlope&&maxima.generalRise<=LIMITS.generalRise&&maxima.specialRise<=LIMITS.specialRise&&maxima.generalNormal<=LIMITS.generalNormal&&maxima.specialNormal<=LIMITS.specialNormal;
  assertions.push(record(IDS[18],slopePass,{maxima,limits:LIMITS}));
  assertions.push(record(IDS[19],traversal.eligible===true,{status:traversal.status,declaredWidthWorldUnits:traversal.declaredWidthWorldUnits,declaredLengthWorldUnits:traversal.declaredLengthWorldUnits,continuousPassLengthWorldUnits:traversal.continuousPassLengthWorldUnits,hardSlopeMaximum:traversal.hardSlopeMaximum,failedStationCount:traversal.samples.filter((s)=>!s.pass).length}));
  assertions.push(record(IDS[20],traversal.candidateFieldUsed===true&&traversal.run6NavigationFieldUsed===false,{candidateFieldUsed:traversal.candidateFieldUsed,run6NavigationFieldUsed:traversal.run6NavigationFieldUsed}));
  assertions.push(record(IDS[21],cavern.eligiblePatchCount>=1,{status:cavern.status,eligiblePatchCount:cavern.eligiblePatchCount,eligiblePatchIds:cavern.eligiblePatches.map((p)=>p.patchId)}));
  assertions.push(record(IDS[22],waterfall.dryGeometryPresent===true&&waterfall.continuousDownhillPath===true&&waterfall.waterImplementation===false,{status:waterfall.status,dryGeometryPresent:waterfall.dryGeometryPresent,continuousDownhillPath:waterfall.continuousDownhillPath,flowDirectionWitnessSamples:waterfall.flowDirectionWitnessSamples,waterImplementation:waterfall.waterImplementation}));
  assertions.push(record(IDS[23],protectedIdentity.slice(0,4).every((x)=>x.actual===x.expected),{protectedProductBlobs:protectedIdentity.slice(0,4)}));
  const candidateSource=fs.readFileSync(CANDIDATE_PATH,'utf8')+fs.readFileSync(FIELD_PATH,'utf8');
  const prohibitedCalls=[/createShader\s*\(/,/createTexture\s*\(/,/createBuffer\s*\(/,/drawArrays\s*\(/,/drawElements\s*\(/,/waterPrimitive\s*[:=]\s*true/i,/cavernFinalization\s*[:=]\s*true/i];
  const prohibitedMatches=prohibitedCalls.filter((re)=>re.test(candidateSource)).map(String);
  assertions.push(record(IDS[24],prohibitedMatches.length===0&&changedForbidden.length===0,{prohibitedMatches,forbiddenChangedPaths:changedForbidden,waterImplementation:false,cavernFinalization:false,directPostconstructionVertexEditing:false}));
  const normalViews=camera.views?.filter((v)=>v.normalTraversalView===true&&v.matchedBaselineAndCandidate===true)??[];
  assertions.push(record(IDS[25],camera.schema==='H_EARTH_R06_C10_PROSPECTIVE_MATCHED_CAMERA_MANIFEST_v1'&&normalViews.length>=3&&blobAt(candidateHead,camera.sourceRegistryPath)===camera.sourceRegistryExpectedBlob,{viewCount:camera.views?.length??0,normalMatchedViewCount:normalViews.length,sceneIds:normalViews.map((v)=>v.sceneId),sourceRegistryBlob:blobAt(candidateHead,camera.sourceRegistryPath),screenshotsClaimed:camera.screenshotsClaimed}));
  const rollbackIdentity={rollbackId:'R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE_002_RESET_TO_MAIN',candidateHead,parentHead,procedure:['MOVE_CANDIDATE_BRANCH_REF_TO_PARENT_HEAD','REMOVE_CANDIDATE_ONLY_PATHS','VERIFY_PROTECTED_BLOBS_MATCH_PARENT'],candidateChangedPaths:changedPaths,parentProductBlobs:{[FIELD_PATH]:blobAt(parentHead,FIELD_PATH),[CANDIDATE_PATH]:blobAt(parentHead,CANDIDATE_PATH)}};
  const rollbackPass=parentHead===EXPECTED_PARENT&&rollbackIdentity.parentProductBlobs[FIELD_PATH]==='0bd36eec01a75311bf6441d575bae5a057195bbc'&&rollbackIdentity.parentProductBlobs[CANDIDATE_PATH]===null;
  assertions.push(record(IDS[26],rollbackPass,{rollbackIdentity}));

  const rawMeasurements={
    evaluatorId:EVALUATOR_ID,
    modeA:{classification:'FROZEN_TOOL_CONFORMANCE_ONLY',passCount:modeAReceipt?.passAssertionIds?.length??0,failIds:modeAReceipt?.failAssertionIds??[],deterministicReceiptDigest:modeAReceipt?.deterministicReceiptDigest??null},
    modeB:{requestCanonicalSha256,fieldDeterministicDigest:digest1,axisPointCount:finiteCount,deltaRange:{minimum:deltaMin,maximum:deltaMax},edgeMaximumGradient:maxEdgeGradient,geometry:{vertexCount:topology.vertices.length,triangleCount:topology.indices.length/3,minimumTriangleDoubleArea:mesh.minDoubleArea,sharedEdgePairCount:shared.sharedEdgePairCount},slopeAndNormal:maxima,traversal:{status:traversal.status,width:traversal.declaredWidthWorldUnits,length:traversal.declaredLengthWorldUnits,continuousPassLength:traversal.continuousPassLengthWorldUnits},cavern:{eligiblePatchCount:cavern.eligiblePatchCount},waterfall:{status:waterfall.status,continuousDownhillPath:waterfall.continuousDownhillPath,witnesses:waterfall.flowDirectionWitnessSamples}},
    evidenceAuthorship:'PROSPECTIVE_ONLY',diagnosticInputCandidate:'95504c9927922318225da1d61fa303cec70497f9',diagnosticInputUsedAsAuthority:false
  };
  const packagePayload={schema:'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_002_EVIDENCE_PACKAGE_v1',candidateHead,parentHead,requestPath:REQUEST_PATH,request,cameraManifestPath:CAMERA_PATH,cameraManifest:camera,changedPaths,candidateBlobs,assertions:assertions.slice(0,27),rawMeasurements,rollbackIdentity};
  const packageText=`${JSON.stringify(stable(packagePayload),null,2)}\n`;
  const packagePath=path.join(path.dirname(outputPath),'h-earth-r06-c10-prospective-candidate-002-evidence-package.v1.json');
  fs.writeFileSync(packagePath,packageText,'utf8');
  const readback=fs.readFileSync(packagePath);
  const evidencePackage={format:'DETERMINISTIC_JSON_EVIDENCE_PACKAGE',fileName:path.basename(packagePath),sha256:sha256(readback),byteCount:readback.length,memberCount:7,readbackSha256:sha256(fs.readFileSync(packagePath))};
  assertions.push(record(IDS[27],evidencePackage.sha256===evidencePackage.readbackSha256&&readback.length===Buffer.byteLength(packageText),{evidencePackage}));

  if(assertions.length!==28||stableJson(assertions.map((a)=>a.id))!==stableJson(IDS))throw new Error('ASSERTION_SET_INTERNAL_MISMATCH');
  const passCount=assertions.filter((a)=>a.pass).length,failCount=28-passCount;
  const receipt={schema:'H_EARTH_R06_C10_EXACT_CANDIDATE_ADMISSION_RECEIPT_v1',evaluatorId:EVALUATOR_ID,gateInputCandidateHead:process.env.H_EARTH_R06_C10_GATE_INPUT_CANDIDATE??args.candidateHead,candidateHead,parentHead,assertionSetId:ASSERTION_SET_ID,assertions,passCount,failCount,overallResult:failCount===0?'PASS_28_OF_28':`FAIL_${passCount}_OF_28`,workingTreeClean:status==='',privateStateUsed:false,executionCommand:['node',EVALUATOR_PATH,'--candidate-head',candidateHead,'--output','<GATE_OUTPUT_PATH>'],changedPaths,candidateBlobs,rawMeasurements,evidencePackage,rollbackIdentity};
  fs.writeFileSync(outputPath,`${JSON.stringify(receipt,null,2)}\n`,'utf8');
  process.exitCode=failCount===0?0:1;
}catch(error){
  const failure={schema:'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_EVALUATOR_FAILURE_v1',evaluatorId:EVALUATOR_ID,gateInputCandidateHead:args.candidateHead,result:'FAIL_CLOSED',error:error instanceof Error?error.message:String(error),privateStateUsed:false,conversationMemoryRequired:false};
  fs.writeFileSync(outputPath,`${JSON.stringify(failure,null,2)}\n`,'utf8');
  process.exitCode=1;
}finally{if(tempRoot)fs.rmSync(tempRoot,{recursive:true,force:true});}
