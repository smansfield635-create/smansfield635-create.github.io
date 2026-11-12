// Gen3237. R63 source-owned, single-disk articulated construction; outputs remain unfrozen until independent gate.
import * as independent from './v6-articulated-independent-verifier.v1.mjs';
function articulatedKernel(){
 const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),scale=(a,s)=>a.map(x=>x*s);
 const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const norm=x=>Math.sqrt(dot(x,x)),dist=(a,b)=>norm(sub(a,b)),unit=v=>{const n=norm(v);if(n<1e-12)throw Error("DEGENERATE_JOINT_FRAME");return scale(v,1/n)};
 const clamp=x=>Math.max(0,Math.min(1,x)),jointRoles=["scapula","axilla","upperArm","elbow","forearm","paw"];
 const requiredSourceFaces={scapula:2245,axilla:2227,upperArm:2444,elbow:2451,forearm:2425,paw:2412};
 const isPoint=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
 function sourceAnchors(source,spec){
  if(!spec.anchors||!Array.isArray(source.faces))throw Error("R63_SOURCE_ANCHORS_REQUIRED");
  const faces=new Map(source.faces.map(f=>[String(f.id),f])),retired=new Set(spec.manifest.retiredFaceIds.map(String));const out={};
  for(const role of jointRoles){
   const a=spec.anchors[role];if(!a||!Array.isArray(a.barycentric)||a.barycentric.length!==3||a.barycentric.some(x=>!Number.isFinite(x)||x<0||x>1)||Math.abs(a.barycentric.reduce((x,y)=>x+y,0)-1)>1e-8)throw Error("SOURCE_BARYCENTRIC_ANCHOR_REQUIRED:"+role);
   const id=String(a.faceId);if(!retired.has(id)||!faces.has(id))throw Error("ANCHOR_NOT_SOURCE_RETIRED_FACE:"+role);
   if(spec.requireR63!==false&&id!==String(requiredSourceFaces[role]))throw Error("R63_SOURCE_FACE_OWNERSHIP_MISMATCH:"+role);
   const f=faces.get(id);out[role]=[0,1,2].reduce((v,k)=>add(v,scale(source.vertices[f.indices[k]],a.barycentric[k])),[0,0,0]);
  }
  return out;
 }
 function kinematicFrame(anchors,target){
  const from=[anchors.scapula,anchors.elbow,anchors.forearm,anchors.paw],to=["shoulder","elbow","wrist","paw"].map(k=>target[k]);
  if(to.some(p=>!isPoint(p)))throw Error("EXPLICIT_3D_ANATOMICAL_TRAJECTORY_REQUIRED");
  for(let i=0;i<3;i++)if(dist(from[i],from[i+1])<=1e-10||dist(to[i],to[i+1])<=1e-10)throw Error("DEGENERATE_SOURCE_OR_TARGET_LIMB_SEGMENT:"+i);
  const nearFar=cross(sub(anchors.axilla,anchors.scapula),sub(anchors.upperArm,anchors.scapula));
  if(norm(nearFar)<=1e-12)throw Error("R63_NEAR_FAR_FRAME_DEGENERATE");
  return {from,to,nearFar:unit(nearFar),segments:to.slice(0,3).map((a,i)=>[a,to[i+1]])};
 }
 function closestSegment(p,a,b){
  const ab=sub(b,a),t=clamp(dot(sub(p,a),ab)/dot(ab,ab));return {t,foot:add(a,scale(ab,t)),distance:dist(p,add(a,scale(ab,t)))};
 }
 function rotateRadial(v,sourceAxis,targetAxis,nearFar){
  const a=unit(sourceAxis),b=unit(targetAxis),c=dot(a,b),axis=cross(a,b),s=norm(axis);
  if(s<1e-10){
   if(c>0)return v;
   const orth=unit(cross(a,nearFar));return sub(scale(orth,2*dot(orth,v)),v);
  }
  const n=scale(axis,1/s);
  return add(add(scale(v,c),scale(cross(n,v),s)),scale(n,dot(n,v)*(1-c)));
 }
 function proposedSkin(source,manifest,frame){
  const retired=new Set(manifest.retiredFaceIds.map(String)),patch=source.faces.filter(f=>retired.has(String(f.id)));
  const patchVertices=new Set(patch.flatMap(f=>f.indices));
  const protectedVertices=new Set(source.faces.filter(f=>!retired.has(String(f.id))).flatMap(f=>f.indices));
  const desired=source.vertices.map(v=>v.slice()),movable=[];
  for(const ix of patchVertices){
   if(protectedVertices.has(ix))continue;
   const p=source.vertices[ix],nearest=frame.from.slice(0,3).map((a,i)=>({...closestSegment(p,a,frame.from[i+1]),i})).sort((a,b)=>a.distance-b.distance||a.i-b.i)[0],i=nearest.i;
   const center=add(frame.to[i],scale(sub(frame.to[i+1],frame.to[i]),nearest.t));
   desired[ix]=add(center,rotateRadial(sub(p,nearest.foot),sub(frame.from[i+1],frame.from[i]),sub(frame.to[i+1],frame.to[i]),frame.nearFar));
   movable.push(ix);
  }
  if(!movable.length)throw Error("NO_INTERIOR_SOURCE_PATCH_VERTICES");
  return {desired,movable};
 }
 function measuredRadii(source,spec,frame){
  // Actual accepted-source triangle extent, not a user-guessed free-space tube radius.
  // The three reference spans are upper-arm / elbow-return / compact-paw stations.
  const owned=spec.anchors;
  if(!owned)throw Error("SOURCE_FACE_ANCHORS_REQUIRED_FOR_RADIUS_MEASUREMENT");
  const windows=[["upperArm"],["elbow","forearm"],["paw"]];
  const faces=new Map(source.faces.map(f=>[String(f.id),f]));
  const radii=windows.map((roles,i)=>{
   const a=frame.from[i],b=frame.from[i+1],v=sub(b,a),sq=dot(v,v);
   if(sq<=1e-20)throw Error("DEGENERATE_SOURCE_RADIUS_AXIS:"+i);
   const samples=roles.flatMap(role=>{
    const id=owned[role]?.faceId,f=faces.get(String(id));
    if(!f)throw Error("RADIUS_SOURCE_FACE_MISSING:"+role);
    return f.indices.map(ix=>{
     const p=source.vertices[ix],t=clamp(dot(sub(p,a),v)/sq);
     return dist(p,add(a,scale(v,t)));
    });
   });
   const radius=Math.max(...samples);
   if(!Number.isFinite(radius)||radius<=0)throw Error("SOURCE_DERIVED_RADIUS_INVALID:"+i);
   return radius;
  });
  if(spec.radii&&(!Array.isArray(spec.radii)||spec.radii.length!==3||spec.radii.some((x,i)=>!Number.isFinite(x)||Math.abs(x-radii[i])>1e-10)))
   throw Error("RADIUS_NOT_SOURCE_MEASURED");
  return radii;
 }
 function clearancePreflight(source,spec,frame,radii,deps){
  const delta=spec.clearance;if(!Number.isFinite(delta)||delta<=0)throw Error("POSITIVE_SOURCE_SCALE_CLEARANCE_REQUIRED");
  const witnesses=[];
  if(deps.segmentDistance(...frame.segments[0],...frame.segments[2])<=radii[0]+radii[2]+delta){
   witnesses.push({kind:"NONINCIDENT_LIMB_ENVELOPES",segments:[0,2],distance:deps.segmentDistance(...frame.segments[0],...frame.segments[2]),required:radii[0]+radii[2]+delta});
  }
  if(witnesses.length)return {result:"FAIL_PREFLIGHT",witness:witnesses[0]};
  const retired=new Set(spec.manifest.retiredFaceIds.map(String)),protectedFaces=source.faces.filter(f=>!retired.has(String(f.id)));
  const collarVertices=new Set(deps.patchBoundary(source,spec.manifest.retiredFaceIds).collarVertices);
  for(let i=0;i<3;i++){
   for(const f of protectedFaces){
    // Only the actual source collar weld is incident to the shoulder station.
    if(i===0&&f.indices.some(v=>collarVertices.has(v)))continue;
    const pts=f.indices.map(ix=>source.vertices[ix]);
    const d=deps.segmentTriangleDistance(...frame.segments[i],...pts);
    if(d<=radii[i]+delta)return {result:"FAIL_PREFLIGHT",witness:{kind:"LIMB_ENVELOPE_PROTECTED_BODY",segment:i,protectedFaceId:f.id,distance:d,required:radii[i]+delta}};
   }
  }
  return {result:"PASS_ANATOMICAL_ENVELOPES",delta,radii};
 }
 function solveArticulatedForequarter(source,spec,deps){
  if(!deps||!deps.verifyCandidate||!deps.patchBoundary||!deps.segmentTriangleDistance||!deps.segmentDistance)throw Error("INDEPENDENT_VERIFIER_DEPENDENCY_REQUIRED");
  if(!spec||!spec.manifest||!source||!Array.isArray(source.vertices)||!Array.isArray(source.faces))throw Error("R63_CANONICAL_SOURCE_AND_MANIFEST_REQUIRED");
  if(source.vertices.some(p=>!isPoint(p)))throw Error("INVALID_SOURCE_GEOMETRY");
  const anchors=sourceAnchors(source,spec),frame=kinematicFrame(anchors,spec.trajectory||{}),radii=measuredRadii(source,spec,frame);
  const preflight=clearancePreflight(source,spec,frame,radii,deps);
  if(preflight.result!=="PASS_ANATOMICAL_ENVELOPES")return {status:"PREFLIGHT_HARD_STOP",preflight,frozenSpecimens:0};
  const original=deps.verifyCandidate(source,source,spec.manifest,{clearance:0});
  if(original.result!=="PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2")return {status:"SOURCE_GEOMETRY_HARD_STOP",verification:original,frozenSpecimens:0};
  const {desired,movable}=proposedSkin(source,spec.manifest,frame),stepTolerance=Number.isFinite(spec.positionTolerance)&&spec.positionTolerance>0?spec.positionTolerance:1e-8;
  if(Math.max(...movable.map(i=>dist(source.vertices[i],desired[i])))<=stepTolerance)return {status:"NO_ARTICULATED_DISPLACEMENT",frozenSpecimens:0};
  let vertices=source.vertices.map(p=>p.slice()),acceptedIterations=0,lastWitness=null;
  const maxIterations=Number.isInteger(spec.maxIterations)&&spec.maxIterations>0&&spec.maxIterations<=128?spec.maxIterations:32;
  // One continuous constraint-coupled construction. Line-search iterates are not independent specimens or post-verifier repair.
  for(let it=0;it<maxIterations;it++){
   let accepted=false;
   for(const fraction of [0.5,0.25,0.125,0.0625,0.03125,0.015625]){
    const proposed=vertices.map(p=>p.slice());
    for(const ix of movable)proposed[ix]=add(vertices[ix],scale(sub(desired[ix],vertices[ix]),fraction));
    const candidate={...source,vertices:proposed};
    const verified=deps.verifyCandidate(source,candidate,spec.manifest,{clearance:spec.clearance});
    if(verified.result==="PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2"){
     const oldLoss=movable.reduce((s,i)=>s+dot(sub(vertices[i],desired[i]),sub(vertices[i],desired[i])),0);
     const newLoss=movable.reduce((s,i)=>s+dot(sub(proposed[i],desired[i]),sub(proposed[i],desired[i])),0);
     if(newLoss<oldLoss-stepTolerance*stepTolerance){vertices=proposed;accepted=true;acceptedIterations++;break}
    }else lastWitness=verified.witness;
   }
   if(!accepted)break;
  }
  if(acceptedIterations===0)return {status:"CONSTRAINED_EMBEDDING_HARD_STOP",witness:lastWitness||{kind:"NO_FEASIBLE_DESCENT"},frozenSpecimens:0};
  const candidate={...source,vertices};
  const verification=deps.verifyCandidate(source,candidate,spec.manifest,{clearance:spec.clearance});
  if(verification.result!=="PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2")return {status:"CONSTRAINED_EMBEDDING_HARD_STOP",witness:verification.witness,frozenSpecimens:0};
  const maxResidual=Math.max(...movable.map(i=>dist(vertices[i],desired[i])));
  if(maxResidual>stepTolerance*10)return {status:"CONSTRAINED_TRAJECTORY_NOT_REACHED",residual:maxResidual,acceptedIterations,witness:lastWitness,frozenSpecimens:0};
  return {status:"MECHANICAL_CANDIDATE_UNFROZEN",candidate,verification,preflight,acceptedIterations,maxResidual,frozenSpecimens:0,sourceFaceAnchors:anchors,nearFar:frame.nearFar};
 }
 return {sourceAnchors,kinematicFrame,proposedSkin,measuredRadii,clearancePreflight,solveArticulatedForequarter};
}
export const {sourceAnchors,kinematicFrame,proposedSkin,measuredRadii,clearancePreflight,solveArticulatedForequarter}=articulatedKernel();
export function construct(source,spec){return solveArticulatedForequarter(source,spec,independent)}
