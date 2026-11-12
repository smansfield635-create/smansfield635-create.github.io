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

 // Gen3243: one frozen source-H1 / IPC barrier method. This builder never certifies
 // its own output: independent full-population verification is mandatory.
 function collisionAwareHalfStep(source,spec,deps){
  if(!deps?.triangleDistance||!deps?.exhaustiveCollisionCensus||!deps?.articulationFidelity||!deps?.verifyCandidate)
   throw Error("GEN3243_INDEPENDENT_GEOMETRY_DEPENDENCIES_REQUIRED");
  // Gen3247: observational-only callback. It cannot modify solver values or decisions.
  const emit=typeof spec?.onTrace==='function' ? (event,detail)=>{
   try{spec.onTrace({schema:'GH_GEN3247_IPC_TRACE_v1',event,...detail});}catch(_observerError){}
  } : null;
  if(spec?.trialFraction!==undefined&&spec.trialFraction!==0.5)throw Error("FROZEN_HALF_STEP_MISMATCH");
  if(spec?.barrierActivation!==undefined&&spec.barrierActivation!==0.002)throw Error("FROZEN_IPC_ACTIVATION_MISMATCH");
  if(spec?.barrierWeight!==undefined&&spec.barrierWeight!==1)throw Error("FROZEN_IPC_WEIGHT_MISMATCH");
  const frame=kinematicFrame(sourceAnchors(source,spec),spec.trajectory||{});
  const skin=proposedSkin(source,spec.manifest,frame),movable=skin.movable;
  if(spec.requireR63!==false&&movable.length!==200)throw Error("FROZEN_200_MOVABLE_VERTEX_MISMATCH");
  const target=source.vertices.map((p,i)=>add(p,scale(sub(skin.desired[i],p),0.5)));
  const free=new Set(movable),roleByVertex=new Map();
  for(const ix of movable){
   const p=source.vertices[ix];
   const role=frame.from.slice(0,3).map((a,i)=>({...closestSegment(p,a,frame.from[i+1]),i}))
    .sort((a,b)=>a.distance-b.distance||a.i-b.i)[0].i;
   roleByVertex.set(ix,role);
  }
  const retired=new Set(spec.manifest.retiredFaceIds.map(String));
  const patch=source.faces.filter(f=>retired.has(String(f.id)));
  const protectedFaces=source.faces.filter(f=>!retired.has(String(f.id)));
  const edges=new Map();
  for(const f of patch)for(let k=0;k<3;k++){
   const a=f.indices[k],b=f.indices[(k+1)%3],key=[Math.min(a,b),Math.max(a,b)].join(":");
   if(!edges.has(key)){
    const length=dist(source.vertices[a],source.vertices[b]);
    if(!(length>0))throw Error("DEGENERATE_SOURCE_EDGE");
    edges.set(key,{a,b,length});
   }
  }
  // Gen3242 frozen H1: (medianSourcePatchEdgeLength / sourceEdgeLength)^2.
  // The prior inverse-length implementation was NOT equivalent and must not
  // be used to consume the authorized R63 trial.
  const lengths=[...edges.values()].map(e=>e.length).sort((a,b)=>a-b);
  const mid=lengths.length>>1;
  const median=lengths.length%2?lengths[mid]:(lengths[mid-1]+lengths[mid])/2;
  for(const e of edges.values())e.weight=(median/e.length)**2;
  const adjacency=new Map(movable.map(i=>[i,[]]));
  for(const {a,b,weight} of edges.values()){
   if(free.has(a))adjacency.get(a).push({other:b,weight});
   if(free.has(b))adjacency.get(b).push({other:a,weight});
  }
  // The frozen source-edge-weighted H1 term is evaluated directly in
  // objective() and its exact analytic gradient below. Do not calculate an
  // unused smoothing candidate or change the frozen target.
  const sourceCandidate={...source,vertices:source.vertices};
  // Source identity must be independently validated before any solver step.
  const sourceGate=deps.verifyCandidate(source,sourceCandidate,spec.manifest,{clearance:0});
  if(sourceGate.result!=="PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2")
   return {status:"SOURCE_GEOMETRY_HARD_STOP",verification:sourceGate,frozenSpecimens:0};
  const initial=deps.exhaustiveCollisionCensus(source,sourceCandidate,spec.manifest,{clearance:0});
  if(initial.result!=="PASS_COLLISIONS")return {status:"SOURCE_GEOMETRY_HARD_STOP",witness:initial.collisions[0],frozenSpecimens:0};
  const dHat=0.002,clearance=0.001290;
  const pairs=[];
  for(let i=0;i<patch.length;i++)for(const b of [...patch.slice(i+1),...protectedFaces]){
   const a=patch[i];if(a.indices.some(v=>b.indices.includes(v)))continue;
   pairs.push({a,b,indices:[...new Set([...a.indices,...b.indices])].filter(v=>free.has(v))});
  }
  const triangles=(vertices,f)=>f.indices.map(ix=>vertices[ix]);
  const barrier=d=>{
   if(d>=dHat)return 0;
   if(d<=0)return Infinity;
   const x=d-dHat;return -x*x*Math.log(d/dHat);
  };
  let lastObjectiveTerms=null;
  const objective=vertices=>{
   let value=0;
   let targetEnergy=0,h1Energy=0,barrierEnergy=0;
   for(const ix of movable){
    const u=sub(vertices[ix],source.vertices[ix]),d=sub(target[ix],source.vertices[ix]);
    value+=dot(sub(u,d),sub(u,d));
    if(emit)targetEnergy+=dot(sub(u,d),sub(u,d));
   }
   for(const {a,b,weight} of edges.values()){
    const ua=sub(vertices[a],source.vertices[a]),ub=sub(vertices[b],source.vertices[b]);
    value+=weight*dot(sub(ua,ub),sub(ua,ub));
    if(emit)h1Energy+=weight*dot(sub(ua,ub),sub(ua,ub));
   }
   for(const pair of pairs){
    const A=triangles(vertices,pair.a),B=triangles(vertices,pair.b);
    if([0,1,2].some(k=>Math.max(...A.map(p=>p[k]))+dHat<=Math.min(...B.map(p=>p[k]))||
      Math.max(...B.map(p=>p[k]))+dHat<=Math.min(...A.map(p=>p[k]))))continue;
    const d=deps.triangleDistance(A,B);
    if(d<dHat){const v=barrier(d);if(!Number.isFinite(v))return Infinity;value+=v;if(emit)barrierEnergy+=v;}
   }
   if(emit)lastObjectiveTerms={targetEnergy,h1Energy,barrierEnergy,total:value};
   return value;
  };
  let vertices=source.vertices.map(p=>p.slice()),lastWitness=null,iterations=0;
  if(emit)emit('initial_state',{eligiblePairs:pairs.length,movableVertices:movable.length,patchFaces:patch.length,protectedFaces:protectedFaces.length,barrierActivation:dHat,protectedClearance:clearance});
  // Deterministic descent from the original nonintersecting R63 only.
  // The full-pair CCD safeguard checks intermediate positions, not just endpoints.
  for(let it=0;it<120;it++){
   const active=[];
   const activeData=emit?{count:0,newNew:0,newProtected:0,minNewNew:null,minNewProtected:null,pairs:[]}:null;
   for(const pair of pairs){
    const A=triangles(vertices,pair.a),B=triangles(vertices,pair.b);
    const separated=[0,1,2].some(k=>Math.max(...A.map(p=>p[k]))+dHat<=Math.min(...B.map(p=>p[k]))||
      Math.max(...B.map(p=>p[k]))+dHat<=Math.min(...A.map(p=>p[k])));
    if(separated)continue; // conservative AABB culling; no exact-contact pair is excluded
    const d=deps.triangleDistance(A,B);
    if(d<dHat){active.push(pair);
     if(emit){const isProtected=!retired.has(String(pair.b.id));activeData.count++;
      if(isProtected){activeData.newProtected++;activeData.minNewProtected=activeData.minNewProtected===null?d:Math.min(activeData.minNewProtected,d);}
      else{activeData.newNew++;activeData.minNewNew=activeData.minNewNew===null?d:Math.min(activeData.minNewNew,d);}
      activeData.pairs.push({faceA:pair.a.id,faceB:pair.b.id,distance:d,pairClass:isProtected?'NEW_PROTECTED':'NEW_NEW'});
     }
    }
   }
   const gradient=new Map(movable.map(ix=>{
    const u=sub(vertices[ix],source.vertices[ix]),d=sub(target[ix],source.vertices[ix]);
    const ns=adjacency.get(ix);
    return [ix,u.map((v,k)=>2*(v-d[k]+ns.reduce((sum,e)=>sum+e.weight*(v-(vertices[e.other][k]-source.vertices[e.other][k])),0)))];
   }));
   const baseGradient=emit?new Map([...gradient].map(([ix,g])=>[ix,g.slice()])):null;
   // Finite differences apply only to the barrier of geometrically active pairs.
   // This avoids approximating contact with triangle centroids or bounding boxes.
   const h=1e-6;
   for(const pair of active){
    const local=pair.indices;
    const contactEnergy=()=>barrier(deps.triangleDistance(triangles(vertices,pair.a),triangles(vertices,pair.b)));
    for(const ix of local)for(let k=0;k<3;k++){
     vertices[ix][k]+=h;const plus=contactEnergy();
     vertices[ix][k]-=2*h;const minus=contactEnergy();
     vertices[ix][k]+=h;
     if(!Number.isFinite(plus)||!Number.isFinite(minus))return {status:"INCONCLUSIVE_FAIL_CLOSED",reason:"BARRIER_NUMERICAL_INSTABILITY",iterations:it,frozenSpecimens:0};
     gradient.get(ix)[k]+=(plus-minus)/(2*h);
    }
   }
   const gradientNorm=Math.sqrt([...gradient.values()].reduce((sum,g)=>sum+dot(g,g),0));
   const baseGradientNorm=emit?Math.sqrt([...baseGradient.values()].reduce((sum,g)=>sum+dot(g,g),0)):null;
   const barrierGradientNorm=emit?Math.sqrt([...gradient].reduce((sum,[ix,g])=>sum+g.reduce((v,k,j)=>v+(k-baseGradient.get(ix)[j])**2,0),0)):null;
   if(!Number.isFinite(gradientNorm))return {status:"INCONCLUSIVE_FAIL_CLOSED",reason:"NONFINITE_GRADIENT",iterations:it,frozenSpecimens:0};
   if(gradientNorm<1e-8)break;
   const oldEnergy=objective(vertices),direction=new Map([...gradient].map(([ix,g])=>[ix,scale(g,-1/Math.max(1,gradientNorm))]));
   const oldTerms=emit?{...lastObjectiveTerms}:null;
   if(emit){
    const fidelity=deps.articulationFidelity(source,{...source,vertices},target,movable,roleByVertex);
    emit('iteration_begin',{it,acceptedIterations:iterations,gradientNorm,baseGradientNorm,barrierGradientNorm,active:activeData,objective:oldTerms,fidelity});
   }
   let accepted=false;
   for(let backtrack=0;backtrack<22;backtrack++){
    const alpha=Math.pow(0.5,backtrack)*0.025;
    const next=vertices.map(p=>p.slice());
    for(const ix of movable)next[ix]=add(vertices[ix],scale(direction.get(ix),alpha));
    // Conservative continuous check: triangle separation is Lipschitz under
    // linear vertex motion. A whole time interval is certified only if its
    // endpoint separation exceeds twice its maximum vertex travel.
    // Ambiguous intervals subdivide; unresolved intervals reject the step.
    let failedInterval=null;
    const certifiedPair=(pair,left,right,depth)=>{
     const travel=Math.max(...[...pair.a.indices,...pair.b.indices].map(ix=>
      dist(add(vertices[ix],scale(sub(next[ix],vertices[ix]),left)),
           add(vertices[ix],scale(sub(next[ix],vertices[ix]),right)))));
     const at=t=>{
      const tri=f=>f.indices.map(ix=>add(vertices[ix],scale(sub(next[ix],vertices[ix]),t)));
      return deps.triangleDistance(tri(pair.a),tri(pair.b));
     };
     const dl=at(left),dr=at(right);
     if(Math.min(dl,dr)>2*travel+1e-10)return true;
     if(dl<=1e-10||dr<=1e-10||depth>=24){
      if(emit)failedInterval={depth,left,right,dl,dr,travel,certificateMargin:Math.min(dl,dr)-2*travel-1e-10,reason:dl<=1e-10||dr<=1e-10?'ENDPOINT_CONTACT_OR_NUMERIC_ZERO':'SUBDIVISION_DEPTH_EXHAUSTED'};
      return false;
     }
     const mid=(left+right)/2;
     return certifiedPair(pair,left,mid,depth+1)&&certifiedPair(pair,mid,right,depth+1);
    };
    let feasible=true;
    for(const pair of pairs){
     // Swept AABB is a conservative continuous-time broad phase.
     // The exact interval-certified CCD remains mandatory for all survivors.
     const swept=f=>f.indices.flatMap(ix=>[vertices[ix],next[ix]]);
     const A=swept(pair.a),B=swept(pair.b);
     if([0,1,2].some(k=>Math.max(...A.map(p=>p[k]))<Math.min(...B.map(p=>p[k]))||
       Math.max(...B.map(p=>p[k]))<Math.min(...A.map(p=>p[k]))))continue;
     if(!certifiedPair(pair,0,1,0)){
      feasible=false;lastWitness={kind:"CONTINUOUS_COLLISION_UNCERTIFIED",faceA:pair.a.id,faceB:pair.b.id};
      if(emit)emit('line_search_rejected',{it,backtrack,alpha,reason:'CONTINUOUS_COLLISION_UNCERTIFIED',faceA:pair.a.id,faceB:pair.b.id,failedInterval});
      break;
     }
    }
    if(!feasible)continue;
    // Every accepted incremental state must also retain the protected collar,
    // topology and face orientation, not merely be intersection-free.
    // Collision freedom for the complete swept interval was certified above.
    // Recheck the complementary orientation invariant locally; the topology,
    // protected vertices and collar are unchanged by construction.
    let oriented=true;
    for(const face of patch){
     const [a,b,c]=face.indices;
     const oldN=cross(sub(source.vertices[b],source.vertices[a]),sub(source.vertices[c],source.vertices[a]));
     const newN=cross(sub(next[b],next[a]),sub(next[c],next[a]));
     if(norm(newN)<=1e-10||dot(oldN,newN)<=1e-10*norm(oldN)){
      oriented=false;lastWitness={kind:"INCREMENTAL_FACE_ORIENTATION_REJECTED",faceId:face.id};break;
     }
    }
    if(!oriented){if(emit)emit('line_search_rejected',{it,backtrack,alpha,reason:'INCREMENTAL_FACE_ORIENTATION_REJECTED',witness:lastWitness});continue;}
    const energy=objective(next);
    if(energy<oldEnergy-1e-12){vertices=next;iterations++;accepted=true;
     if(emit){const fidelity=deps.articulationFidelity(source,{...source,vertices},target,movable,roleByVertex);
      emit('accepted_step',{it,backtrack,alpha,oldEnergy,newEnergy:energy,oldObjective:oldTerms,newObjective:{...lastObjectiveTerms},fidelity});}
     break;}
    if(emit)emit('line_search_rejected',{it,backtrack,alpha,reason:'INSUFFICIENT_ENERGY_DECREASE',oldEnergy,newEnergy:energy});
   }
   if(!accepted){if(emit)emit('line_search_stalled',{it,acceptedIterations:iterations});break;}
  }
  const candidate={...source,vertices};
  let mechanical;
  try{mechanical=deps.verifyCandidate(source,candidate,spec.manifest,{clearance});}
  catch(e){return {status:"INCONCLUSIVE_FAIL_CLOSED",reason:String(e.message),iterations,frozenSpecimens:0};}
  const census=deps.exhaustiveCollisionCensus(source,candidate,spec.manifest,{clearance});
  const fidelity=deps.articulationFidelity(source,candidate,target,movable,roleByVertex);
  if(mechanical.result!=="PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2"||census.result!=="PASS_COLLISIONS"||fidelity.result!=="PASS_FIDELITY")
   {if(emit)emit('final',{status:'INCONCLUSIVE_FAIL_CLOSED',iterations,mechanical,census,fidelity,lastWitness});
   return {status:"INCONCLUSIVE_FAIL_CLOSED",mechanical,census,fidelity,iterations,lastWitness,frozenSpecimens:0};}
  if(emit)emit('final',{status:'PASS_METHOD_FEASIBILITY_ONLY',iterations,mechanical,census,fidelity});
  return {status:"PASS_METHOD_FEASIBILITY_ONLY",mechanical,census,fidelity,iterations,frozenSpecimens:0};
 }
 return {sourceAnchors,kinematicFrame,proposedSkin,measuredRadii,clearancePreflight,solveArticulatedForequarter,collisionAwareHalfStep};
}
export const {sourceAnchors,kinematicFrame,proposedSkin,measuredRadii,clearancePreflight,solveArticulatedForequarter,collisionAwareHalfStep}=articulatedKernel();
export function construct(source,spec){return solveArticulatedForequarter(source,spec,independent)}

export function constructGen3243(source,spec){return collisionAwareHalfStep(source,spec,independent)}
