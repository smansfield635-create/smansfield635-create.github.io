/** H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_v1 */
import {constructHEarthTriangleMesh,createHEarthVector3,isHEarthNeutralPrimitiveRecord,H_EARTH_3D_GEOMETRY_SOUTH_ENUMS} from './geometry-kernel.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

export const H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID='H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_v1';
export const H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET=freeze({maximumPrimitiveCount:18,maximumVertexCount:160,animatedPrimitiveCount:0});
export const H_EARTH_ADR1_PROXY_LAYOUT=freeze({
  contractId:H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID,
  manorMass:freeze({centerX:-42,centerZ:-184,width:26,depth:16,height:9.5}),
  foundation:freeze({centerX:-42,centerZ:-184,width:29,depth:19,height:1.15}),
  terrace:freeze({centerX:-42,centerZ:-169,width:34,depth:6,height:.45}),
  courtyard:freeze({centerX:-42,centerZ:-207,width:24,depth:17,height:.32}),
  architecturalStandOff:1.65,
  diagnosticOnly:true,
  mirrorManorIdentity:false,
  playerPerspectivePrimary:true,
  representationSwitchBoundary:false
});

export const H_EARTH_ADR1_PROXY_EXCLUSION_VOLUMES=freeze([
  freeze({volumeId:'ADR1_MANOR_MASS_STANDOFF',xMin:-55-1.65,xMax:-29+1.65,zMin:-192-1.65,zMax:-176+1.65,reason:'ARCHITECTURAL_MASS'}),
  freeze({volumeId:'ADR1_RETAINING_EDGE_STANDOFF',xMin:-59.5,xMax:-24.5,zMin:-172.4,zMax:-165.6,reason:'RETAINING_EDGE'})
]);

function locate(values,value){if(!Array.isArray(values)||values.length<2||!finite(value))return null;const min=values[0],max=values[values.length-1];if(value<min||value>max)return null;if(value===max)return{index:values.length-2,t:1};let lo=0,hi=values.length-1;while(lo+1<hi){const m=(lo+hi)>>1;if(values[m]<=value)lo=m;else hi=m}const span=values[lo+1]-values[lo];return span>0?{index:lo,t:clamp((value-values[lo])/span,0,1)}:null}
function sampleTerrain(terrainPrimitive,x,z){const g=terrainPrimitive?.geometry,v=g?.vertices??[],a=g?.attributes??{},xs=a.xValues??[],zs=a.zValues??[],cx=locate(xs,x),cz=locate(zs,z);if(!cx||!cz)return null;const cols=xs.length,A=v[cz.index*cols+cx.index],B=v[cz.index*cols+cx.index+1],C=v[(cz.index+1)*cols+cx.index],D=v[(cz.index+1)*cols+cx.index+1];if(![A,B,C,D].every(p=>p&&finite(p.y)))return null;const u=cx.t,w=cz.t;return u+w<=1?A.y*(1-u-w)+B.y*u+C.y*w:D.y*(u+w-1)+B.y*(1-w)+C.y*(1-u)}
function boxVertices(cx,cz,w,d,y0,y1){const x0=cx-w/2,x1=cx+w/2,z0=cz-d/2,z1=cz+d/2;return[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]].map(([x,y,z])=>createHEarthVector3(x,y,z))}
// Consistent outward winding for a closed rectangular prism.
const BOX_INDICES=freeze([0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0]);
function makeBox({terrainPrimitive,id,cx,cz,width,depth,bottomOffset,topOffset,materialClass,rgba,semanticRole}){const ground=sampleTerrain(terrainPrimitive,cx,cz);if(!finite(ground))return null;const c=constructHEarthTriangleMesh({primitiveId:`H_EARTH_ADR1:${id}`,geometryId:`H_EARTH_ADR1:${id}:GEOMETRY`,primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,vertices:boxVertices(cx,cz,width,depth,ground+bottomOffset,ground+topOffset),indices:[...BOX_INDICES],normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.CLOSED_REQUIRED,semanticRole,materialHint:freeze({materialReference:`H_EARTH_ADR1_${materialClass}`,materialIntent:`ADR1_LOCAL_${materialClass}`}),source:freeze({sourceType:'ADR1_DIAGNOSTIC_ARCHITECTURAL_PROXY',contractId:H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID}),metadata:freeze({adr1ArchitecturalDepthReadiness:true,adr1DiagnosticOnly:true,adr1MaterialResponseClass:materialClass,groundedFromPresentedTerrain:true,groundSample:freeze({x:cx,z:cz,elevation:ground}),fidelityDomain:'LOCAL',playerPerspectivePrimary:true,representationSwitchBoundary:false,mirrorManorIdentity:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false,navigationAuthorityCreated:false,collisionAuthority:false,accessibleRegionExpansion:false,animated:false})});const p=c?.valid===true&&isHEarthNeutralPrimitiveRecord(c.primitiveRecord)?c.primitiveRecord:null;return p?freeze({...p,renderMaterial:freeze({rgba:[...rgba],transparencyClass:'OPAQUE'})}):null}

function specifications(){const p=[];p.push({id:'FOUNDATION',cx:-42,cz:-184,width:29,depth:19,bottomOffset:-1.15,topOffset:.35,materialClass:'FOUNDATION_STONE',rgba:[90,84,74,255],semanticRole:'ADR1_GROUNDED_FOUNDATION'});p.push({id:'MANOR_MASS',cx:-42,cz:-184,width:26,depth:16,bottomOffset:.2,topOffset:9.7,materialClass:'WARM_MASONRY',rgba:[139,130,111,255],semanticRole:'ADR1_GENERIC_MANOR_SIZED_MASS'});p.push({id:'TERRACE',cx:-42,cz:-169,width:34,depth:6,bottomOffset:-.65,topOffset:.28,materialClass:'RETAINING_STONE',rgba:[110,102,87,255],semanticRole:'ADR1_TERRACE_RETAINING_EDGE'});p.push({id:'COURTYARD',cx:-42,cz:-207,width:24,depth:17,bottomOffset:-.45,topOffset:.18,materialClass:'COURTYARD_PAVING',rgba:[129,116,92,255],semanticRole:'ADR1_COURTYARD_PLANE'});for(const [i,z] of [-154,-160,-166].entries())p.push({id:`PATH_${i+1}`,cx:-42,cz:z,width:4.2,depth:6.5,bottomOffset:-.28,topOffset:.12,materialClass:'PATH_AGGREGATE',rgba:[145,129,96,255],semanticRole:'ADR1_TERRAIN_FOLLOWING_PATH'});for(const [i,[x,z]] of [[-52,-200],[-32,-200],[-52,-214],[-32,-214]].entries())p.push({id:`SCALE_MARKER_${i+1}`,cx:x,cz:z,width:.7,depth:.7,bottomOffset:-.5,topOffset:3.1,materialClass:'VERTICAL_SCALE_MARKER',rgba:[102,100,90,255],semanticRole:'ADR1_HUMAN_SCALE_VERTICAL_MARKER'});return p}

export function constructHEarthADR1EstateProxy({terrainPrimitive}={}){const issues=[];if(!terrainPrimitive?.geometry?.vertices)issues.push('ADR1_PRESENTED_TERRAIN_REQUIRED');const specs=issues.length?[]:specifications(),primitives=specs.map(s=>makeBox({terrainPrimitive,...s})).filter(Boolean);if(primitives.length!==specs.length)issues.push('ADR1_PROXY_GROUNDING_OR_CONSTRUCTION_FAILED');const vertexCount=primitives.reduce((n,p)=>n+(p.geometry?.vertices?.length??0),0),materialResponseClasses=freeze([...new Set(primitives.map(p=>p.metadata?.adr1MaterialResponseClass).filter(Boolean))].sort());if(primitives.length>H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumPrimitiveCount)issues.push('ADR1_PRIMITIVE_BUDGET_EXCEEDED');if(vertexCount>H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumVertexCount)issues.push('ADR1_VERTEX_BUDGET_EXCEEDED');if(materialResponseClasses.length<5)issues.push('ADR1_MATERIAL_RESPONSE_DIVERSITY_INSUFFICIENT');if(primitives.some(p=>p.metadata?.geographyAuthorityCreated!==false||p.metadata?.topologyAuthorityCreated!==false||p.metadata?.mirrorManorIdentity!==false||p.metadata?.representationSwitchBoundary!==false))issues.push('ADR1_AUTHORITY_OR_IDENTITY_BOUNDARY_VIOLATION');return freeze({ok:issues.length===0,status:issues.length?'ADR1_ESTATE_PROXY_FAILED':'ADR1_ESTATE_PROXY_COMPLETE',contractId:H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID,layout:H_EARTH_ADR1_PROXY_LAYOUT,exclusionVolumes:H_EARTH_ADR1_PROXY_EXCLUSION_VOLUMES,primitives:freeze(primitives),primitiveCount:primitives.length,vertexCount,materialResponseClasses,diagnosticOnly:true,mirrorManorIdentityCreated:false,groundedFromPresentedTerrain:true,playerPerspectivePrimary:true,fidelityDomain:'LOCAL',representationSwitchBoundary:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false,navigationAuthorityCreated:false,animatedPrimitiveCount:0,issues:freeze(issues)})}

export default H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID;
