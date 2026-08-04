/**
 * H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE_002
 * Prospectively authored bounded terrain delta for exact-candidate admission.
 * Owns elevation delta only. No water, cavern, renderer, navigation, material,
 * shader, buffer, texture, draw-call, route, deployment, or vertex-edit authority.
 */
const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||seen.has(value))return value;seen.add(value);Object.values(value).forEach((v)=>freeze(v,seen));return Object.isFrozen(value)?value:Object.freeze(value);};
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const q5=(value)=>{const t=clamp(value,0,1);return t*t*t*(t*(t*6-15)+10);};
const windowQ5=(value,o0,i0,i1,o1)=>q5((value-o0)/(i0-o0))*q5((o1-value)/(o1-i1));
const longitudinalWindow=(u,halfLength,feather)=>q5((halfLength+feather-Math.abs(u))/feather);

export const H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE_ID='H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE_002';
export const H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_OPERATION_ID='H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE_CONSTRUCTION_002';
export const H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_REQUEST_SHA256='cc2943655407da63c5eadecbf58be1bf43061ce0e8d4e2cd1f4fa3c21c27bd46';
export const H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_BOUNDS=freeze({
  core:{xMinimum:32,xMaximum:64,zMinimum:-192,zMaximum:-164},
  blendSupport:{xMinimum:24,xMaximum:72,zMinimum:-200,zMaximum:-156},
  verificationHalo:{xMinimum:16,xMaximum:80,zMinimum:-208,zMaximum:-148}
});
export const H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_OPERATIONS=freeze([
  {operator:'ORIENTED_SADDLE',amplitude:3.4,centerX:44,centerZ:-168,radiusU:14,radiusV:10,rotationDegrees:90},
  {operator:'RIDGE_FACE',centerX:36,centerZ:-178,feather:6,halfLength:18,halfWidth:7,height:3.4,rotationDegrees:90},
  {operator:'RIDGE_FACE',centerX:52,centerZ:-178,feather:6,halfLength:18,halfWidth:7,height:3.4,rotationDegrees:90},
  {operator:'VALLEY_CORRIDOR',depth:1,endFeatherWorldUnits:6,halfWidth:6,polyline:[[44,-164],[44,-176],[44,-188]]},
  {operator:'FALL_FACE',centerX:44,centerZ:-180,drop:4,feather:6,halfLength:12,halfWidth:10,rotationDegrees:-90},
  {operator:'LOWER_BASIN',centerX:44,centerZ:-192,depth:2,radiusU:14,radiusV:12,rotationDegrees:0},
  {operator:'DRAINAGE_CUT',depth:2.4,endFeatherWorldUnits:4,halfWidth:4,polyline:[[44,-192],[36,-196],[28,-200]]},
  {operator:'TERRACE_BAND',centerX:34,centerZ:-170,feather:4,halfLength:10,halfWidth:5,height:0.9,rotationDegrees:90},
  {operator:'TERRACE_BAND',centerX:54,centerZ:-170,feather:4,halfLength:10,halfWidth:5,height:0.9,rotationDegrees:90}
]);
export const H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE=freeze({
  candidateId:H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE_ID,
  operationId:H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_OPERATION_ID,
  requestCanonicalSha256:H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_REQUEST_SHA256,
  semanticAddress:'H_EARTH_GROUND_CELL_001:R06:C10',
  targetEnvironment:'COASTAL_TO_INLAND_TRANSITION_LANDFORM',
  geometrySequence:['UPPER_SADDLE','DROP_FACE_SUPPORT','LOWER_PLUNGE_POOL_BASIN_SUPPORT','RESERVOIR_OR_OUTFLOW_SUPPORT'],
  bounds:H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_BOUNDS,
  aggregateDeltaBoundsWorldUnits:{minimum:-12,maximum:18},
  derivativeStepWorldUnits:0.5,
  waterImplementation:false,
  cavernFinalization:false,
  directPostconstructionVertexEditing:false,
  diagnosticInputsOnly:['95504c9927922318225da1d61fa303cec70497f9','ROLE_3_MEASUREMENTS'],
  evidenceAuthorship:'PROSPECTIVE_ONLY',
  deterministic:true
});

export function evaluateHEarthR06C10ProspectiveLandformSupportMask(worldX,worldZ){
  return windowQ5(worldX,24,32,64,72)*windowQ5(worldZ,-200,-192,-164,-156);
}
function orientedCoordinates(worldX,worldZ,operation){const r=operation.rotationDegrees*Math.PI/180;const c=Math.cos(r),s=Math.sin(r);const x=worldX-operation.centerX,z=worldZ-operation.centerZ;return{u:c*x+s*z,v:-s*x+c*z};}
function nearestPolylinePoint(worldX,worldZ,polyline){const lengths=[];let totalLength=0;for(let i=0;i<polyline.length-1;i++){const[ax,az]=polyline[i],[bx,bz]=polyline[i+1];const length=Math.hypot(bx-ax,bz-az);lengths.push(length);totalLength+=length;}let cumulative=0,nearest=null;for(let i=0;i<polyline.length-1;i++){const[ax,az]=polyline[i],[bx,bz]=polyline[i+1];const vx=bx-ax,vz=bz-az,length=lengths[i],ls=vx*vx+vz*vz;const t=ls===0?0:clamp(((worldX-ax)*vx+(worldZ-az)*vz)/ls,0,1);const px=ax+t*vx,pz=az+t*vz,distance=Math.hypot(worldX-px,worldZ-pz),progress=totalLength===0?0:(cumulative+t*length)/totalLength;if(nearest===null||distance<nearest.distance)nearest={distance,progress,totalLength};cumulative+=length;}return nearest;}
function endWindow(progress,totalLength,featherWorldUnits){const f=featherWorldUnits/totalLength;return q5(progress/f)*q5((1-progress)/f);}
export function evaluateHEarthR06C10ProspectiveLandformOperationDelta(worldX,worldZ,operation){
  if(operation.operator==='VALLEY_CORRIDOR'||operation.operator==='DRAINAGE_CUT'){const n=nearestPolylinePoint(worldX,worldZ,operation.polyline);return-operation.depth*Math.exp(-1.6*(n.distance/operation.halfWidth)**2)*endWindow(n.progress,n.totalLength,operation.endFeatherWorldUnits);}
  const{u,v}=orientedCoordinates(worldX,worldZ,operation);
  switch(operation.operator){
    case'ORIENTED_SADDLE':return operation.amplitude*Math.exp(-1.6*((u/operation.radiusU)**2+(v/operation.radiusV)**2))*((v/operation.radiusV)**2-(u/operation.radiusU)**2);
    case'RIDGE_FACE':return operation.height*Math.exp(-1.6*(v/operation.halfWidth)**2)*longitudinalWindow(u,operation.halfLength,operation.feather);
    case'LOWER_BASIN':{const radial=Math.max(0,1-((u/operation.radiusU)**2+(v/operation.radiusV)**2));return-operation.depth*radial**2;}
    case'TERRACE_BAND':return operation.height*longitudinalWindow(u,operation.halfLength,operation.feather)*Math.exp(-1.6*(v/operation.halfWidth)**4);
    case'RIDGE_BREAK':return-operation.depth*Math.exp(-1.6*((u/operation.radiusU)**2+(v/operation.radiusV)**2));
    case'FALL_FACE':return-operation.drop*q5((u+operation.halfLength)/(2*operation.halfLength))*longitudinalWindow(u,operation.halfLength,operation.feather)*Math.exp(-1.6*(v/operation.halfWidth)**2);
    default:throw new Error(`UNKNOWN_FROZEN_OPERATOR:${operation.operator}`);
  }
}
export function sampleHEarthR06C10ProspectiveLandformDelta(worldX,worldZ){let raw=0;for(const operation of H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_OPERATIONS)raw+=evaluateHEarthR06C10ProspectiveLandformOperationDelta(worldX,worldZ,operation);return evaluateHEarthR06C10ProspectiveLandformSupportMask(worldX,worldZ)*clamp(raw,-12,18);}
export default H_EARTH_R06_C10_PROSPECTIVE_LANDFORM_CANDIDATE;
