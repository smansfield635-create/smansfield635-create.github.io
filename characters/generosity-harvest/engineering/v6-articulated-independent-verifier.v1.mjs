// Gen3237: independent, source-identity-preserving mechanical verifier. No specimen mutation.
function verificationKernel(){
 const sub=(a,b)=>a.map((v,i)=>v-b[i]), add=(a,b)=>a.map((v,i)=>v+b[i]), mul=(a,s)=>a.map(v=>v*s);
 const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const len=a=>Math.sqrt(Math.max(0,dot(a,a))), distance=(a,b)=>len(sub(a,b)), clamp=x=>Math.max(0,Math.min(1,x));
 const edgeKey=(a,b)=>[a,b].sort((x,y)=>x-y).join(":");
 const triangle=(mesh,face)=>face.indices.map(i=>mesh.vertices[i]);
 function pointTriangleDistance(p,a,b,c){
  const ab=sub(b,a),ac=sub(c,a),ap=sub(p,a),d1=dot(ab,ap),d2=dot(ac,ap);
  if(d1<=0&&d2<=0)return distance(p,a);
  const bp=sub(p,b),d3=dot(ab,bp),d4=dot(ac,bp);
  if(d3>=0&&d4<=d3)return distance(p,b);
  const vc=d1*d4-d3*d2;if(vc<=0&&d1>=0&&d3<=0)return distance(p,add(a,mul(ab,d1/(d1-d3))));
  const cp=sub(p,c),d5=dot(ab,cp),d6=dot(ac,cp);
  if(d6>=0&&d5<=d6)return distance(p,c);
  const vb=d5*d2-d1*d6;if(vb<=0&&d2>=0&&d6<=0)return distance(p,add(a,mul(ac,d2/(d2-d6))));
  const va=d3*d6-d5*d4;if(va<=0&&(d4-d3)>=0&&(d5-d6)>=0)return distance(p,add(b,mul(sub(c,b),(d4-d3)/((d4-d3)+(d5-d6)))));
  const denom=va+vb+vc;if(Math.abs(denom)<1e-20)return Math.min(distance(p,a),distance(p,b),distance(p,c));
  const v=vb/denom,w=vc/denom;return distance(p,add(a,add(mul(ab,v),mul(ac,w))));
 }
 function segmentDistance(p1,q1,p2,q2){
  const d1=sub(q1,p1),d2=sub(q2,p2),r=sub(p1,p2);
  const a=dot(d1,d1),e=dot(d2,d2),f=dot(d2,r);let s=0,t=0;
  if(a<=1e-24&&e<=1e-24)return distance(p1,p2);
  if(a<=1e-24)t=clamp(f/e);
  else{const c=dot(d1,r);
   if(e<=1e-24)s=clamp(-c/a);
   else{const b=dot(d1,d2),den=a*e-b*b;s=Math.abs(den)>1e-24?clamp((b*f-c*e)/den):0;
    t=(b*s+f)/e;if(t<0){t=0;s=clamp(-c/a)}else if(t>1){t=1;s=clamp((b-c)/a);}
   }
  }
  return distance(add(p1,mul(d1,s)),add(p2,mul(d2,t)));
 }
 function segmentTriangleDistance(p,q,a,b,c){
  const n=cross(sub(b,a),sub(c,a)),dir=sub(q,p),det=dot(n,dir);
  if(Math.abs(det)>1e-15){
   const t=dot(n,sub(a,p))/det;
   if(t>=0&&t<=1){
    const x=add(p,mul(dir,t)),u=sub(b,a),v=sub(c,a),w=sub(x,a);
    const uu=dot(u,u),uv=dot(u,v),vv=dot(v,v),wu=dot(w,u),wv=dot(w,v);
    const den=uu*vv-uv*uv;if(den>1e-24){
     const s=(wu*vv-wv*uv)/den,r=(wv*uu-wu*uv)/den;
     if(s>=-1e-10&&r>=-1e-10&&s+r<=1+1e-10)return 0;
    }
   }
  }
  return Math.min(pointTriangleDistance(p,a,b,c),pointTriangleDistance(q,a,b,c),
   segmentDistance(p,q,a,b),segmentDistance(p,q,b,c),segmentDistance(p,q,c,a));
 }
 function triangleDistance(A,B){
  let d=Infinity;
  for(const p of A)d=Math.min(d,pointTriangleDistance(p,...B));
  for(const p of B)d=Math.min(d,pointTriangleDistance(p,...A));
  for(let i=0;i<3;i++){
   const p=A[i],q=A[(i+1)%3];d=Math.min(d,segmentTriangleDistance(p,q,...B));
   for(let j=0;j<3;j++)d=Math.min(d,segmentDistance(p,q,B[j],B[(j+1)%3]));
  }
  for(let j=0;j<3;j++)d=Math.min(d,segmentTriangleDistance(B[j],B[(j+1)%3],...A));
  return d;
 }
 function coplanarOverlapArea(A,B,eps=1e-10){
  const na=cross(sub(A[1],A[0]),sub(A[2],A[0])),nb=cross(sub(B[1],B[0]),sub(B[2],B[0]));
  const la=len(na),lb=len(nb);if(la<eps||lb<eps||len(cross(na,nb))>eps*la*lb)return 0;
  if(B.some(p=>Math.abs(dot(na,sub(p,A[0])))/la>eps))return 0;
  const axis=[0,1,2].sort((a,b)=>Math.abs(na[b])-Math.abs(na[a]))[0],axes=[0,1,2].filter(i=>i!==axis);
  const p2=p=>axes.map(i=>p[i]), cross2=(p,q)=>p[0]*q[1]-p[1]*q[0],orient=(p,q,r)=>cross2(sub(q,p),sub(r,p));
  let poly=A.map(p2),clip=B.map(p2),sgn=Math.sign(orient(...clip));
  if(!sgn)return 0;
  for(let k=0;k<3;k++){
   const p=clip[k],q=clip[(k+1)%3],input=poly;poly=[];
   for(let i=0;i<input.length;i++){
    const cur=input[i],prev=input[(i+input.length-1)%input.length];
    const dc=sgn*orient(p,q,cur),dp=sgn*orient(p,q,prev);
    if((dc>=-eps)!==(dp>=-eps)){
     const t=dp/(dp-dc);poly.push(add(prev,mul(sub(cur,prev),t)));
    }
    if(dc>=-eps)poly.push(cur);
   }
   if(poly.length===0)return 0;
  }
  let area=0;for(let i=0;i<poly.length;i++)area+=cross2(poly[i],poly[(i+1)%poly.length]);
  return Math.abs(area)/2 * la/Math.abs(na[axis]);
 }
 function geometryWitness(meshA,faceA,meshB,faceB,clearance=0,eps=1e-10){
  const A=triangle(meshA,faceA),B=triangle(meshB,faceB);
  for(let k=0;k<3;k++){const a=A.map(p=>p[k]),b=B.map(p=>p[k]);
   if(Math.max(...a)+clearance<Math.min(...b)-eps||Math.max(...b)+clearance<Math.min(...a)-eps)return null;
  }
  const overlapArea=coplanarOverlapArea(A,B,eps),d=triangleDistance(A,B);
  if(overlapArea>eps*eps||d<=eps||(clearance>0&&d<clearance-eps)){
   return {faceA:faceA.id,faceB:faceB.id,kind:overlapArea>eps*eps?"COPLANAR_AREA":d<=eps?"PROPER_3D_CONTACT":"CLEARANCE",distance:d,coplanarArea:overlapArea};
  }
  return null;
 }
 function patchBoundary(mesh,retiredIds){
  const ids=new Set(retiredIds.map(String)),faces=mesh.faces.filter(f=>ids.has(String(f.id)));
  if(faces.length!==ids.size)throw Error("RETIREMENT_FACE_SET_INCOMPLETE");
  const edges=new Map(),adj=new Map(faces.map(f=>[String(f.id),new Set()]));
  for(const f of faces)for(let i=0;i<3;i++){
   const a=f.indices[i],b=f.indices[(i+1)%3],key=edgeKey(a,b),entry={face:String(f.id),a,b};
   const ar=edges.get(key)||[];ar.push(entry);edges.set(key,ar);
   if(ar.length>2)throw Error("PATCH_NONMANIFOLD_EDGE");
  }
  for(const es of edges.values())if(es.length===2){
   if(es[0].a!==es[1].b||es[0].b!==es[1].a)throw Error("PATCH_WINDING_MISMATCH");
   adj.get(es[0].face).add(es[1].face);adj.get(es[1].face).add(es[0].face);
  }
  let seen=new Set(),stack=[String(faces[0]?.id)];while(stack.length){const q=stack.pop();if(seen.has(q)||!adj.has(q))continue;seen.add(q);stack.push(...adj.get(q))}
  const boundary=[...edges.values()].filter(es=>es.length===1).map(es=>[es[0].a,es[0].b]);
  const verts=new Set(faces.flatMap(f=>f.indices)),euler=verts.size-edges.size+faces.length;
  const ba=new Map();for(const [a,b] of boundary){ba.set(a,(ba.get(a)||0)+1);ba.set(b,(ba.get(b)||0)+1)}
  const singleLoop=boundary.length>0&&[...ba.values()].every(n=>n===2);
  if(seen.size!==faces.length||euler!==1||!singleLoop)throw Error("PATCH_NOT_SINGLE_ORIENTED_DISK");
  return {faceCount:faces.length,collarEdges:boundary,collarVertices:[...ba.keys()],euler};
 }
 function verifyCandidate(source,candidate,manifest,{clearance=0,eps=1e-10}={}){
  if(!source||!candidate||!manifest||!Array.isArray(source.faces)||!Array.isArray(source.vertices))throw Error("INPUT_MISSING");
  if(source.faces.length!==candidate.faces?.length||source.vertices.length!==candidate.vertices?.length)throw Error("SOURCE_MESH_CARDINALITY_CHANGED");
  const kept=new Set(manifest.keptFaceIds.map(String)),retired=new Set(manifest.retiredFaceIds.map(String));
  const expected=manifest.expected||{sourceFaces:2508,keptFaces:2089,retiredFaces:419,collarEdges:21};
  if(source.faces.length!==expected.sourceFaces||kept.size!==expected.keptFaces||retired.size!==expected.retiredFaces)throw Error("R63_SOURCE_FACE_COUNT_MISMATCH");
  const src=new Map(source.faces.map(f=>[String(f.id),f])),dst=new Map(candidate.faces.map(f=>[String(f.id),f]));
  if(src.size!==source.faces.length||dst.size!==candidate.faces.length||src.size!==kept.size+retired.size)throw Error("FACE_ID_PARTITION_MISMATCH");
  for(const id of src.keys())if(kept.has(id)===retired.has(id))throw Error("FACE_ID_PARTITION_MISMATCH");
  for(const id of kept){const a=src.get(id),b=dst.get(id);if(!a||!b||JSON.stringify(a)!==JSON.stringify(b))throw Error("PROTECTED_FACE_CHANGED:"+id);
   for(const ix of a.indices)if(JSON.stringify(source.vertices[ix])!==JSON.stringify(candidate.vertices[ix]))throw Error("PROTECTED_VERTEX_CHANGED:"+id+":"+ix);
  }
  for(const id of retired){const a=src.get(id),b=dst.get(id);if(!a||!b||a.indices.join(",")!==b.indices.join(","))throw Error("RETIREMENT_TOPOLOGY_CHANGED:"+id);
   const A=triangle(source,a),B=triangle(candidate,b),n0=cross(sub(A[1],A[0]),sub(A[2],A[0])),n1=cross(sub(B[1],B[0]),sub(B[2],B[0]));
   if(len(n1)<=eps||dot(n0,n1)<=eps*len(n0))throw Error("DEGENERATE_OR_REVERSED_PATCH_FACE:"+id);
  }
  const boundary=patchBoundary(source,manifest.retiredFaceIds);
  if(boundary.collarEdges.length!==expected.collarEdges)throw Error("SOURCE_COLLAR_EDGE_COUNT_MISMATCH");
  const keys=boundary.collarEdges.map(([a,b])=>edgeKey(a,b)).sort();
  if(manifest.collarEdges&&JSON.stringify(keys)!==JSON.stringify(manifest.collarEdges.map(e=>edgeKey(...e)).sort()))throw Error("SOURCE_COLLAR_EDGE_IDENTITY_CHANGED");
  for(const ix of boundary.collarVertices)if(JSON.stringify(source.vertices[ix])!==JSON.stringify(candidate.vertices[ix]))throw Error("COLLAR_VERTEX_CHANGED:"+ix);
  const renewed=candidate.faces.filter(f=>retired.has(String(f.id))),protectedFaces=candidate.faces.filter(f=>kept.has(String(f.id)));
  let checked=0;
  for(let i=0;i<renewed.length;i++){
   const a=renewed[i];
   for(const b of [...renewed.slice(i+1),...protectedFaces]){
    if(a.indices.some(x=>b.indices.includes(x)))continue;
    checked++;const w=geometryWitness(candidate,a,candidate,b,clearance,eps);
    if(w)return {result:"FAIL_MECHANICAL",witness:w,pairsChecked:checked,collarEdges:boundary.collarEdges.length};
   }
  }
  return {result:"PASS_MECHANICAL_READY_FOR_NATIVE_WEBGL2",pairsChecked:checked,protectedFaces:kept.size,retiredFaces:retired.size,collarEdges:boundary.collarEdges.length};
 }

 // Gen3243 independent, exhaustive nonincident collision census. The solver's active set
 // is never used to decide which pairs the final verifier inspects.
 function exhaustiveCollisionCensus(source,candidate,manifest,{clearance=0,eps=1e-10}={}){
  const retired=new Set(manifest.retiredFaceIds.map(String));
  const kept=new Set(manifest.keptFaceIds.map(String));
  const changed=candidate.faces.filter(f=>retired.has(String(f.id)));
  const protectedFaces=candidate.faces.filter(f=>kept.has(String(f.id)));
  if(changed.length!==retired.size||protectedFaces.length!==kept.size)throw Error("COLLISION_CENSUS_PARTITION_MISMATCH");
  let pairsChecked=0,protectedMinimum=Infinity;
  const collisions=[];
  for(let i=0;i<changed.length;i++){
   const a=changed[i];
   for(const b of [...changed.slice(i+1),...protectedFaces]){
    if(a.indices.some(v=>b.indices.includes(v)))continue;
    pairsChecked++;
    const protectedPair=kept.has(String(b.id));
    const A=triangle(candidate,a),B=triangle(candidate,b);
    const d=triangleDistance(A,B);
    if(protectedPair)protectedMinimum=Math.min(protectedMinimum,d);
    const w=geometryWitness(candidate,a,candidate,b,protectedPair?clearance:0,eps);
    if(w)collisions.push({...w,pairClass:protectedPair?"NEW_PROTECTED":"NEW_NEW"});
   }
  }
  return {result:collisions.length?"FAIL_COLLISIONS":"PASS_COLLISIONS",pairsChecked,
   collisionCount:collisions.length,collisions,protectedMinimum};
 }
 // Independent signed fidelity calculation against frozen source-to-target displacement.
 function articulationFidelity(source,candidate,desired,movable,roleByVertex,
  {progressMin=.8,errorMax=.3,segmentProgressMin=.7}={}){
  if(!Array.isArray(movable)||!movable.length||!Array.isArray(desired))throw Error("FIDELITY_INPUT_MISSING");
  const roleNames=[0,1,2],groups=roleNames.map(()=>({numerator:0,denominator:0,count:0}));
  let numerator=0,denominator=0,error2=0;
  for(const ix of movable){
   const role=roleByVertex instanceof Map?roleByVertex.get(ix):roleByVertex[ix];
   if(!Number.isInteger(role)||role<0||role>2)throw Error("FIDELITY_ROLE_MISSING:"+ix);
   const d=sub(desired[ix],source.vertices[ix]),u=sub(candidate.vertices[ix],source.vertices[ix]);
   const dd=dot(d,d),ud=dot(u,d);
   denominator+=dd;numerator+=ud;error2+=dot(sub(u,d),sub(u,d));
   groups[role].denominator+=dd;groups[role].numerator+=ud;groups[role].count++;
  }
  if(!(denominator>0)||groups.some(g=>!(g.denominator>0)))throw Error("FIDELITY_ZERO_TARGET_DENOMINATOR");
  const progress=numerator/denominator,error=Math.sqrt(error2/denominator);
  const segmentProgress=groups.map(g=>g.numerator/g.denominator);
  return {result:progress>=progressMin&&error<=errorMax&&segmentProgress.every(p=>p>=segmentProgressMin)?"PASS_FIDELITY":"FAIL_FIDELITY",
   progress,relativeError:error,segmentProgress,targetNorm:Math.sqrt(denominator),
   movedNorm:Math.sqrt(movable.reduce((v,ix)=>v+dot(sub(candidate.vertices[ix],source.vertices[ix]),sub(candidate.vertices[ix],source.vertices[ix])),0)),
   segmentCounts:groups.map(g=>g.count)};
 }
 return {pointTriangleDistance,segmentDistance,segmentTriangleDistance,triangleDistance,coplanarOverlapArea,geometryWitness,patchBoundary,verifyCandidate,exhaustiveCollisionCensus,articulationFidelity};
}
export const {pointTriangleDistance,segmentDistance,segmentTriangleDistance,triangleDistance,coplanarOverlapArea,geometryWitness,patchBoundary,verifyCandidate,exhaustiveCollisionCensus,articulationFidelity}=verificationKernel();
