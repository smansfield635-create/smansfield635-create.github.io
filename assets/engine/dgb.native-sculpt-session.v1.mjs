/** Diamond Gate Graphics Engine: off-product reusable interactive mesh-sculpt state.
 * No GPU ownership, world-specific anatomy, generation, material or rig semantics.
 * Positions are a shared indexed Float32 XYZ mesh; +Y up. */
const finite = Number.isFinite;
const v3 = (v,label) => {
  if (!Array.isArray(v) || v.length!==3 || !v.every(finite)) throw new TypeError(label+'_VEC3_REQUIRED');
  return v;
};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const d=Math.hypot(...a);if(d<1e-12)throw new RangeError('ZERO_NORMAL');return mul(a,1/d);};
const pos=(v,i)=>[v[3*i],v[3*i+1],v[3*i+2]];
const floatPositions=x=>{
  if (!(x instanceof Float32Array)||x.length<9||x.length%3||x.length>300000||!Array.from(x).every(finite))throw new TypeError('POSITIONS_INVALID');
  return new Float32Array(x);
};
const intTriangles=x=>{
  if (!(x instanceof Uint16Array||x instanceof Uint32Array)||x.length<3||x.length%3||x.length>900000)throw new TypeError('TRIANGLES_INVALID');
  return new Uint32Array(x);
};
function segmentTriangle(a,b,p,q,r){
  const dir=sub(b,a),u=sub(q,p),v=sub(r,p),h=cross(dir,v),det=dot(u,h);
  if(Math.abs(det)<1e-11)return false;
  const f=1/det,s=sub(a,p),w=f*dot(s,h);if(w<=1e-8||w>=1-1e-8)return false;
  const k=cross(s,u),t=f*dot(dir,k);if(t<=1e-8||w+t>=1-1e-8)return false;
  const along=f*dot(v,k);return along>1e-8&&along<1-1e-8;
}
// Coplanar triangles can overlap without an edge crossing a triangle plane.
// Require positive projected interior area: touching at an edge/vertex is lawful,
// including true adjacent faces, but overlapping adjacent faces are not.
function coplanarTrianglesOverlap(a,b,c,d,e,f){
  const n0=cross(sub(b,a),sub(c,a)),n1=cross(sub(e,d),sub(f,d));
  const l0=Math.hypot(...n0),l1=Math.hypot(...n1);
  if(l0<1e-12||l1<1e-12)return false;
  if(Math.hypot(...cross(n0,n1))>1e-8*l0*l1)return false;
  if([d,e,f].some(p=>Math.abs(dot(n0,sub(p,a)))>1e-8*l0))return false;
  const dominant=n0.map(Math.abs).indexOf(Math.max(...n0.map(Math.abs)));
  const project=p=>dominant===0?[p[1],p[2]]:dominant===1?[p[0],p[2]]:[p[0],p[1]];
  const aa=[a,b,c].map(project),bb=[d,e,f].map(project);
  for(const triangle of [aa,bb])for(let i=0;i<3;i++){
    const p=triangle[i],q=triangle[(i+1)%3],axis=[p[1]-q[1],q[0]-p[0]];
    const axisLength=Math.hypot(...axis);
    if(axisLength<1e-12)return false;
    const projected=t=>t.map(v=>v[0]*axis[0]+v[1]*axis[1]);
    const ap=projected(aa),bp=projected(bb);
    if(Math.min(Math.max(...ap),Math.max(...bp))<=
       Math.max(Math.min(...ap),Math.min(...bp))+1e-10*axisLength)return false;
  }
  return true;
}
function trianglesIntersect(a,b,c,d,e,f){
  const mn=u=>[Math.min(...u.map(v=>v[0])),Math.min(...u.map(v=>v[1])),Math.min(...u.map(v=>v[2]))];
  const mx=u=>[Math.max(...u.map(v=>v[0])),Math.max(...u.map(v=>v[1])),Math.max(...u.map(v=>v[2]))];
  const aa=[a,b,c],bb=[d,e,f],am=mn(aa),ax=mx(aa),bm=mn(bb),bx=mx(bb);
  if([0,1,2].some(k=>ax[k]<bm[k]+1e-10||bx[k]<am[k]+1e-10))return false;
  if(coplanarTrianglesOverlap(a,b,c,d,e,f))return true;
  return [[a,b],[b,c],[c,a]].some(([p,q])=>segmentTriangle(p,q,d,e,f))||
    [[d,e],[e,f],[f,d]].some(([p,q])=>segmentTriangle(p,q,a,b,c));
}
/** Independent callers can verify each edited geometry before GPU display/export. */
export function verifySculptGeometry(positions,triangles,{checkSelfIntersection=true}={}){
  const v=floatPositions(positions),idx=intTriangles(triangles),n=v.length/3;
  const edges=new Map(),seenFaces=new Set();let minDoubleArea=Infinity;
  for(let t=0;t<idx.length;t+=3){
    const ids=[idx[t],idx[t+1],idx[t+2]];
    if(ids.some(i=>i>=n)||new Set(ids).size!==3)throw new RangeError('TRIANGLE_INDEX_INVALID');
    const key=[...ids].sort((a,b)=>a-b).join(':');
    if(seenFaces.has(key))throw new Error('DUPLICATE_TRIANGLE');seenFaces.add(key);
    const [a,b,c]=ids.map(i=>pos(v,i));
    const area=Math.hypot(...cross(sub(b,a),sub(c,a)));
    if(!finite(area)||area<1e-8)throw new Error('DEGENERATE_TRIANGLE');
    minDoubleArea=Math.min(minDoubleArea,area);
    for(let i=0;i<3;i++){
      const p=ids[i],q=ids[(i+1)%3],e=p<q?p+':'+q:q+':'+p;
      edges.set(e,(edges.get(e)||0)+1);
      if(edges.get(e)>2)throw new Error('NONMANIFOLD_EDGE');
    }
  }
  // Conservative positive intersection test for non-adjacent pairs. Shared-vertex
  // surfaces are checked separately for degeneracy/nonmanifold topology.
  if(checkSelfIntersection){
    const faces=idx.length/3;
    if(faces>3500)throw new RangeError('SELF_INTERSECTION_BUDGET_EXCEEDED');
    for(let i=0;i<faces;i++){
      const a=[idx[3*i],idx[3*i+1],idx[3*i+2]];
      for(let j=i+1;j<faces;j++){
        const b=[idx[3*j],idx[3*j+1],idx[3*j+2]];
        // Index adjacency alone does not excuse two coplanar face interiors
        // occupying the same area. Ordinary edge/vertex contact remains legal.
        if(a.some(k=>b.includes(k))){
          if(coplanarTrianglesOverlap(...a.map(k=>pos(v,k)),...b.map(k=>pos(v,k))))throw new Error('SELF_INTERSECTION');
          continue;
        }
        if(trianglesIntersect(...a.map(k=>pos(v,k)),...b.map(k=>pos(v,k))))throw new Error('SELF_INTERSECTION');
      }
    }
  }
  return Object.freeze({vertexCount:n,triangleCount:idx.length/3,openBoundaryEdges:[...edges.values()].filter(x=>x===1).length,minDoubleArea});
}
/** Fixed-topology source-relative quality. This is stricter than manifoldness:
 * M1.6 showed that valid indexed triangles may rotate or inflate excessively. */
export function verifySculptSourceRelative(reference, candidate, triangles,
  {minNormalCosine=0.2,minAreaRatio=0.5,maxAreaRatio=2,protectedVertices=[]}={}){
  const src=floatPositions(reference),out=floatPositions(candidate),idx=intTriangles(triangles);
  if(src.length!==out.length)throw new Error('SCULPT_SOURCE_VERTEX_COUNT_CHANGED_REQUIRES_SEPARATE_BAKE');
  if(![minNormalCosine,minAreaRatio,maxAreaRatio].every(finite)||minNormalCosine<0||minNormalCosine>1||
     minAreaRatio<=0||minAreaRatio>1||maxAreaRatio<1)throw new TypeError('SCULPT_SOURCE_GUARDS_INVALID');
  if(!Array.isArray(protectedVertices)||protectedVertices.some(x=>!Number.isInteger(x)||x<0||3*x+2>=src.length))throw new TypeError('SCULPT_PROTECTED_IDS_INVALID');
  for(const id of protectedVertices)for(let k=0;k<3;k++)if(src[3*id+k]!==out[3*id+k])throw new Error('SCULPT_PROTECTED_SOURCE_CHANGED');
  let minimumCosine=1,minimumAreaRatio=Infinity,maximumAreaRatio=0;
  for(let i=0;i<idx.length;i+=3){
    const [a,b,c]=[idx[i],idx[i+1],idx[i+2]];
    if([a,b,c].some(v=>v*3+2>=src.length)||new Set([a,b,c]).size!==3)throw new Error('SCULPT_SOURCE_TOPOLOGY_INVALID');
    const normal=p=>cross(sub(pos(p,b),pos(p,a)),sub(pos(p,c),pos(p,a)));
    const n0=normal(src),n1=normal(out),l0=Math.hypot(...n0),l1=Math.hypot(...n1);
    if(l0<=1e-12||l1<=1e-12)throw new Error('SCULPT_SOURCE_TRIANGLE_DEGENERATE');
    const cosine=dot(n0,n1)/(l0*l1),ratio=l1/l0;
    minimumCosine=Math.min(minimumCosine,cosine);
    minimumAreaRatio=Math.min(minimumAreaRatio,ratio);
    maximumAreaRatio=Math.max(maximumAreaRatio,ratio);
    if(cosine<minNormalCosine)throw new Error('SCULPT_SOURCE_NORMAL_GUARD_REJECTED');
    if(ratio<minAreaRatio||ratio>maxAreaRatio)throw new Error('SCULPT_SOURCE_AREA_GUARD_REJECTED');
  }
  return Object.freeze({minimumCosine,minimumAreaRatio,maximumAreaRatio,sourceRelativePass:true,
    triangleCount:idx.length/3,fixedTopology:true,animation64Qualified:false});
}
/** Source-space handoff: preserve source-master IDs and UV splits, never remesh on load.
 * A right-handed -90° X rotation converts M1.3 +Z-up to Sculpt Lab +Y-up. */
export function createSculptSourceHandoff({positions,triangles,renderToMaster,uvs}={}){
  const src=floatPositions(positions),idx=intTriangles(triangles),n=src.length/3;
  if(!(renderToMaster instanceof Int32Array||renderToMaster instanceof Uint32Array)||
     !renderToMaster.length||renderToMaster.some(x=>x<0||x>=n))throw new TypeError('SCULPT_RENDER_MASTER_MAPPING_INVALID');
  if(!(uvs instanceof Float32Array)||uvs.length!==renderToMaster.length*2||uvs.some(v=>!finite(v)))throw new TypeError('SCULPT_SOURCE_UV_INVALID');
  // A typed triangle buffer is not proof of valid source-master topology.
  // Validate every master index and the indexed face/edge incidence before
  // handing off render/UV identity; do not silently repair or remesh.
  const seenFaces=new Set(),edgeCounts=new Map();
  for(let t=0;t<idx.length;t+=3){
    const ids=[idx[t],idx[t+1],idx[t+2]];
    if(ids.some(i=>i>=n)||new Set(ids).size!==3)throw new RangeError('SCULPT_SOURCE_HANDOFF_TRIANGLE_INDEX_INVALID');
    const faceKey=[...ids].sort((a,b)=>a-b).join(':');
    if(seenFaces.has(faceKey))throw new Error('SCULPT_SOURCE_HANDOFF_DUPLICATE_FACE');
    seenFaces.add(faceKey);
    for(let k=0;k<3;k++){
      const a=ids[k],b=ids[(k+1)%3],edgeKey=a<b?a+':'+b:b+':'+a;
      const count=(edgeCounts.get(edgeKey)||0)+1;
      if(count>2)throw new Error('SCULPT_SOURCE_HANDOFF_NONMANIFOLD_EDGE');
      edgeCounts.set(edgeKey,count);
    }
  }
  const sourceToSculpt=p=>{const out=new Float32Array(p.length);
    for(let i=0;i<p.length;i+=3){out[i]=p[i];out[i+1]=p[i+2];out[i+2]=-p[i+1];}return out;};
  const sculptToSource=p=>{const q=floatPositions(p);if(q.length!==src.length)throw new Error('SCULPT_SOURCE_MAPPING_VERTEX_COUNT_CHANGED');
    const out=new Float32Array(q.length);
    for(let i=0;i<q.length;i+=3){out[i]=q[i];out[i+1]=-q[i+2];out[i+2]=q[i+1];}return out;};
  // The handoff is intentionally fixed-topology; a future bake needs its own
  // source-face and UV transfer proof, not just a render-vertex array resize.
  return Object.freeze({schema:'DGB_SCULPT_FIXED_TOPOLOGY_SOURCE_HANDOFF_v1',
    positionsYUp:sourceToSculpt(src),triangles:new Uint32Array(idx),
    renderToMaster:new Uint32Array(renderToMaster),uvs:new Float32Array(uvs),
    originalMasterCount:n,originalRenderVertexCount:renderToMaster.length,
    fromSculptYUp:sculptToSource,retopologyBakeAllowed:false});
}
/** Read-only prospective bake preflight, never a topology-changing session edit.
 * Exact ordered child-face lineage is required; this catches the archived M1.6
 * 21 reversed child faces even though its output was manifold. */
export function verifySculptProspectiveBake({sourcePositions,sourceTriangles,
  outputPositions,outputTriangles,sourceToOutputFaceCounts,
  minNormalCosine=0.2,minAreaRatio=0.5,maxAreaRatio=2,diagnosticOnly=false}={}){
  const src=floatPositions(sourcePositions),out=floatPositions(outputPositions);
  const a=intTriangles(sourceTriangles),b=intTriangles(outputTriangles);
  const counts=sourceToOutputFaceCounts;
  if(!Array.isArray(counts)||counts.length!==a.length/3||counts.some(x=>!Number.isInteger(x)||x<1)||
     counts.reduce((s,x)=>s+x,0)!==b.length/3)throw new Error('SCULPT_BAKE_SOURCE_LINEAGE_INVALID');
  if(![minNormalCosine,minAreaRatio,maxAreaRatio].every(finite)||minNormalCosine<0||minNormalCosine>1||
     minAreaRatio<=0||minAreaRatio>1||maxAreaRatio<1)throw new TypeError('SCULPT_BAKE_GUARDS_INVALID');
  const normal=(p,t)=>{
    const [i,j,k]=t;if([i,j,k].some(x=>x*3+2>=p.length)||new Set(t).size!==3)throw new Error('SCULPT_BAKE_TRIANGLE_INVALID');
    return cross(sub(pos(p,j),pos(p,i)),sub(pos(p,k),pos(p,i)));
  };
  let at=0,reverse=0,weak=0,area=0,minCos=1,minRatio=Infinity,maxRatio=0;
  for(let i=0;i<counts.length;i++){
    const old=normal(src,[a[3*i],a[3*i+1],a[3*i+2]]),l0=Math.hypot(...old);
    if(l0<=1e-12)throw new Error('SCULPT_BAKE_SOURCE_DEGENERATE');
    let total=0;
    for(let c=0;c<counts[i];c++,at++){
      const child=normal(out,[b[3*at],b[3*at+1],b[3*at+2]]),l1=Math.hypot(...child);
      const cos=l1>1e-12?dot(old,child)/(l0*l1):-1;
      minCos=Math.min(minCos,cos);total+=l1;
      if(cos<0)reverse++;
      if(cos<minNormalCosine)weak++;
    }
    const ratio=total/l0;minRatio=Math.min(minRatio,ratio);maxRatio=Math.max(maxRatio,ratio);
    if(ratio<minAreaRatio||ratio>maxAreaRatio)area++;
  }
  // Face-count alignment is not authenticated child-to-parent correspondence.
  // A numerically clean preflight therefore remains diagnostic only. Never
  // promote it to an accepted bake or proof of source-face lineage.
  const poseScreenPass=weak===0&&area===0;
  const receipt=Object.freeze({schema:'DGB_SCULPT_BAKE_PREFLIGHT_v1',sourceFaceCount:counts.length,
    outputFaceCount:b.length/3,reversedChildFaces:reverse,weakChildFaces:weak,
    areaOutlierSourceFaces:area,minimumNormalCosine:minCos,
    minimumSourceFaceAreaRatio:minRatio,maximumSourceFaceAreaRatio:maxRatio,
    poseScreenPass,lineageAuthenticated:false,lineageBasis:'FACE_COUNTS_ONLY_UNVERIFIED_CORRESPONDENCE',
    diagnosticOnly:true,result:poseScreenPass?'DIAGNOSTIC_ONLY_UNVERIFIED_LINEAGE':'REJECT_SOURCE_POSE',
    surfaceAccepted:false,animationQualified:false,bakePerformed:false});
  if(!poseScreenPass&&!diagnosticOnly){
    const error=new Error('SCULPT_BAKE_LINEAGE_REJECTED');error.receipt=receipt;throw error;
  }
  return receipt;
}
export function computeSculptNormals(positions,triangles){
  const n=positions.length/3,normal=new Float32Array(positions.length);
  for(let k=0;k<triangles.length;k+=3){
    const a=triangles[k],b=triangles[k+1],c=triangles[k+2],v=cross(sub(pos(positions,b),pos(positions,a)),sub(pos(positions,c),pos(positions,a)));
    for(const i of [a,b,c])for(let j=0;j<3;j++)normal[3*i+j]+=v[j];
  }
  for(let i=0;i<n;i++){
    const p=pos(normal,i),d=Math.hypot(...p)||1;
    for(let j=0;j<3;j++)normal[3*i+j]=p[j]/d;
  }
  return normal;
}
function hitTriangle(origin,direction,a,b,c){
  const e1=sub(b,a),e2=sub(c,a),p=cross(direction,e2),det=dot(e1,p);
  if(Math.abs(det)<1e-10)return null;
  const inv=1/det,t=sub(origin,a),u=dot(t,p)*inv;if(u<0||u>1)return null;
  const q=cross(t,e1),w=dot(direction,q)*inv;if(w<0||u+w>1)return null;
  const distance=dot(e2,q)*inv;if(distance<1e-8)return null;
  return {distance,barycentric:[1-u-w,u,w],position:add(origin,mul(direction,distance)),normal:norm(cross(e1,e2))};
}
export function invertSculptMatrix(matrix){
  if(!Array.isArray(matrix)&&!(matrix instanceof Float32Array)&&!(matrix instanceof Float64Array))throw new TypeError('MATRIX_REQUIRED');
  if(matrix.length!==16||!Array.from(matrix).every(finite))throw new TypeError('MATRIX_INVALID');
  const a=Array.from({length:4},(_,r)=>Array.from({length:8},(_,c)=>c<4?matrix[4*c+r]:Number(c-4===r)));
  for(let k=0;k<4;k++){
    let pivot=k;for(let i=k+1;i<4;i++)if(Math.abs(a[i][k])>Math.abs(a[pivot][k]))pivot=i;
    if(Math.abs(a[pivot][k])<1e-12)throw new Error('MATRIX_SINGULAR');
    [a[k],a[pivot]]=[a[pivot],a[k]];
    const f=a[k][k];for(let c=0;c<8;c++)a[k][c]/=f;
    for(let r=0;r<4;r++)if(r!==k){const d=a[r][k];for(let c=0;c<8;c++)a[r][c]-=d*a[k][c];}
  }
  const out=new Float64Array(16);
  for(let r=0;r<4;r++)for(let c=0;c<4;c++)out[4*c+r]=a[r][4+c];return out;
}
export function sculptScreenRay({x,y,width,height,viewProjection}){
  if(![x,y,width,height].every(finite)||width<=0||height<=0)throw new TypeError('SCREEN_COORDINATE_INVALID');
  const m=invertSculptMatrix(viewProjection),ndc=[2*x/width-1,1-2*y/height];
  function unproject(z){const p=[ndc[0],ndc[1],z,1],r=Array.from({length:4},(_,i)=>m[i]*p[0]+m[i+4]*p[1]+m[i+8]*p[2]+m[i+12]*p[3]);if(Math.abs(r[3])<1e-12)throw new Error('SCREEN_RAY_INVALID');return r.slice(0,3).map(x=>x/r[3]);}
  const a=unproject(-1),b=unproject(1);return {origin:a,direction:norm(sub(b,a))};
}
export function createSculptSession({positions,triangles,regions,protectedVertices=[],maxHistory=40,sourceGuards={}}={}){
  let current=floatPositions(positions);const faces=intTriangles(triangles),count=current.length/3;
  if(!Array.isArray(regions)||regions.length!==count||regions.some(x=>typeof x!=='string'||!x))throw new TypeError('REGION_IDS_REQUIRED');
  if(!Array.isArray(protectedVertices)||protectedVertices.some(i=>!Number.isInteger(i)||i<0||i>=count))throw new TypeError('PROTECTED_IDS_INVALID');
  if(!Number.isInteger(maxHistory)||maxHistory<1||maxHistory>100)throw new TypeError('HISTORY_LIMIT_INVALID');
  const originalRegions=[...regions],frozen=new Set(protectedVertices),undo=[],redo=[];
  const reference=new Float32Array(current),guardOptions={...sourceGuards,protectedVertices:[...frozen]};
  verifySculptGeometry(current,faces);
  verifySculptSourceRelative(reference,current,faces,guardOptions);let active=null,revision=0;
  function pick(origin,direction){
    v3(origin,'PICK_ORIGIN');v3(direction,'PICK_DIRECTION');const ray=norm(direction);let best=null;
    for(let k=0;k<faces.length;k+=3){const ids=[faces[k],faces[k+1],faces[k+2]],h=hitTriangle(origin,ray,...ids.map(i=>pos(current,i)));
      if(h&&(!best||h.distance<best.distance))best={...h,triangle:k/3,vertexIds:ids};
    }
    return best?Object.freeze(best):null;
  }
  function beginStroke(hit,{radius=0.35,strength=1,falloff=1,region='ALL',fieldRadii=null}={}){
    if(active)throw new Error('STROKE_ALREADY_ACTIVE');
    if(!hit||!Array.isArray(hit.position)||!Array.isArray(hit.normal)||!Array.isArray(hit.vertexIds))throw new TypeError('SURFACE_PICK_REQUIRED');
    v3(hit.position,'HIT_POSITION');v3(hit.normal,'HIT_NORMAL');
    if(!finite(radius)||radius<0.02||radius>2.5||!finite(strength)||strength<=0||strength>2||!finite(falloff)||falloff<0.1||falloff>5)throw new RangeError('BRUSH_CONTROLS_INVALID');
    if(region!=='ALL'&&!originalRegions.includes(region))throw new Error('REGION_UNKNOWN');
    if(fieldRadii!==null){v3(fieldRadii,'SCULPT_FIELD_RADII');if(fieldRadii.some(x=>x<0.02||x>2.5))throw new RangeError('SCULPT_FIELD_RADII_OUT_OF_BOUNDS');}
    const affected=[];for(let i=0;i<count;i++){
      if(frozen.has(i)||region!=='ALL'&&originalRegions[i]!==region)continue;
      const offset=sub(pos(current,i),hit.position);
      const d=fieldRadii?Math.hypot(...offset.map((x,k)=>x/fieldRadii[k])):Math.hypot(...offset)/radius;
      if(d>=1)continue;
      const t=1-d,weight=Math.pow(t*t*(3-2*t),falloff);
      if(weight>0)affected.push([i,weight]);
    }
    if(!affected.length)throw new Error('NO_EDITABLE_VERTICES_IN_RADIUS');
    active={before:new Float32Array(current),hit,affected,strength,changed:false};return Object.freeze({selectedTriangle:hit.triangle,affectedVertexIds:affected.map(v=>v[0])});
  }
  function applyStroke({mode='PULL',amount=0,delta=[0,0,0],planeNormal=null,planeOffset=null}={}){
    if(!active)throw new Error('NO_ACTIVE_STROKE');
    if(!['PULL','PUSH','MOVE','ORGANIC_INFLATE','ORGANIC_GRAB','ORGANIC_FLATTEN'].includes(mode)||
       !finite(amount)||Math.abs(amount)>0.4)throw new TypeError('STROKE_MODE_OR_AMOUNT_INVALID');
    v3(delta,'STROKE_DELTA');if(delta.some(x=>Math.abs(x)>0.4))throw new RangeError('STROKE_DELTA_EXCESSIVE');
    if(planeNormal!==null)v3(planeNormal,'SCULPT_PLANE_NORMAL');
    if(planeOffset!==null&&!finite(planeOffset))throw new TypeError('SCULPT_PLANE_OFFSET_INVALID');
    const direction=mode==='MOVE'||mode==='ORGANIC_GRAB'?delta:mul(active.hit.normal,(mode==='PULL'?1:-1)*Math.abs(amount));
    if((mode==='ORGANIC_INFLATE'||mode==='ORGANIC_FLATTEN')&&amount===0)return false;
    if(mode!=='ORGANIC_INFLATE'&&mode!=='ORGANIC_FLATTEN'&&direction.every(x=>x===0))return false;
    const candidate=new Float32Array(current);
    const unitPlane=mode==='ORGANIC_FLATTEN'?norm(planeNormal??active.hit.normal):null;
    const planeD=planeOffset??(unitPlane?dot(unitPlane,active.hit.position):0);
    const normals=mode==='ORGANIC_INFLATE'?computeSculptNormals(current,faces):null;
    for(const [i,w]of active.affected){
      let shift=direction;
      if(mode==='ORGANIC_INFLATE')shift=mul(pos(normals,i),amount);
      if(mode==='ORGANIC_FLATTEN')shift=mul(unitPlane,-(dot(unitPlane,pos(current,i))-planeD)*Math.abs(amount));
      for(let j=0;j<3;j++)candidate[3*i+j]+=shift[j]*active.strength*w;
    }
    try{
      verifySculptGeometry(candidate,faces);
      verifySculptSourceRelative(reference,candidate,faces,guardOptions);
    }catch(e){current=new Float32Array(active.before);active=null;throw e;}
    current=candidate;active.changed=true;revision++;return true;
  }
  function endStroke(){if(!active)throw new Error('NO_ACTIVE_STROKE');const state=active;active=null;
    if(state.changed){undo.push(state.before);if(undo.length>maxHistory)undo.shift();redo.length=0;}
    return Object.freeze({changed:state.changed,revision});}
  function cancelStroke(){if(!active)return false;current=active.before;active=null;revision++;return true;}
  function undoStroke(){if(active)throw new Error('STROKE_ACTIVE');if(!undo.length)return false;redo.push(current);current=undo.pop();revision++;return true;}
  function redoStroke(){if(active)throw new Error('STROKE_ACTIVE');if(!redo.length)return false;undo.push(current);current=redo.pop();revision++;return true;}
  function serialize(){if(active)throw new Error('STROKE_ACTIVE');return JSON.stringify({schema:'DGB_NATIVE_SCULPT_MESH_V1',positions:[...current],triangles:[...faces],regions:originalRegions,protectedVertices:[...frozen].sort((a,b)=>a-b)});}
  function restore(text){if(active)throw new Error('STROKE_ACTIVE');let obj;try{obj=JSON.parse(text);}catch{throw new TypeError('SCULPT_SAVE_JSON_INVALID');}
    if(obj?.schema!=='DGB_NATIVE_SCULPT_MESH_V1'||!Array.isArray(obj.positions)||!Array.isArray(obj.triangles)||JSON.stringify(obj.triangles)!==JSON.stringify([...faces])||JSON.stringify(obj.regions)!==JSON.stringify(originalRegions)||JSON.stringify(obj.protectedVertices)!==JSON.stringify([...frozen].sort((a,b)=>a-b)))throw new Error('SCULPT_SAVE_IDENTITY_MISMATCH');
    const restored=new Float32Array(obj.positions);verifySculptGeometry(restored,faces);verifySculptSourceRelative(reference,restored,faces,guardOptions);current=restored;undo.length=0;redo.length=0;revision++;return true;}
  return Object.freeze({pick,beginStroke,applyStroke,endStroke,cancelStroke,undo:undoStroke,redo:redoStroke,serialize,restore,
    getPositions:()=>new Float32Array(current),getTriangles:()=>new Uint32Array(faces),getRegions:()=>[...originalRegions],
    getNormals:()=>computeSculptNormals(current,faces),verify:()=>Object.freeze({...verifySculptGeometry(current,faces),sourceRelative:verifySculptSourceRelative(reference,current,faces,guardOptions)}),
    state:()=>Object.freeze({revision,active:Boolean(active),undoDepth:undo.length,redoDepth:redo.length,vertices:count,triangles:faces.length/3})});
}
