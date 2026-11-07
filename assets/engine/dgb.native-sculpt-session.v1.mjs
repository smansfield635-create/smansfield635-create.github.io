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
function trianglesIntersect(a,b,c,d,e,f){
  const mn=u=>[Math.min(...u.map(v=>v[0])),Math.min(...u.map(v=>v[1])),Math.min(...u.map(v=>v[2]))];
  const mx=u=>[Math.max(...u.map(v=>v[0])),Math.max(...u.map(v=>v[1])),Math.max(...u.map(v=>v[2]))];
  const aa=[a,b,c],bb=[d,e,f],am=mn(aa),ax=mx(aa),bm=mn(bb),bx=mx(bb);
  if([0,1,2].some(k=>ax[k]<bm[k]+1e-10||bx[k]<am[k]+1e-10))return false;
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
        if(a.some(k=>b.includes(k)))continue;
        if(trianglesIntersect(...a.map(k=>pos(v,k)),...b.map(k=>pos(v,k))))throw new Error('SELF_INTERSECTION');
      }
    }
  }
  return Object.freeze({vertexCount:n,triangleCount:idx.length/3,openBoundaryEdges:[...edges.values()].filter(x=>x===1).length,minDoubleArea});
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
export function createSculptSession({positions,triangles,regions,protectedVertices=[],maxHistory=40}={}){
  let current=floatPositions(positions);const faces=intTriangles(triangles),count=current.length/3;
  if(!Array.isArray(regions)||regions.length!==count||regions.some(x=>typeof x!=='string'||!x))throw new TypeError('REGION_IDS_REQUIRED');
  if(!Array.isArray(protectedVertices)||protectedVertices.some(i=>!Number.isInteger(i)||i<0||i>=count))throw new TypeError('PROTECTED_IDS_INVALID');
  if(!Number.isInteger(maxHistory)||maxHistory<1||maxHistory>100)throw new TypeError('HISTORY_LIMIT_INVALID');
  const originalRegions=[...regions],frozen=new Set(protectedVertices),undo=[],redo=[];
  verifySculptGeometry(current,faces);let active=null,revision=0;
  function pick(origin,direction){
    v3(origin,'PICK_ORIGIN');v3(direction,'PICK_DIRECTION');const ray=norm(direction);let best=null;
    for(let k=0;k<faces.length;k+=3){const ids=[faces[k],faces[k+1],faces[k+2]],h=hitTriangle(origin,ray,...ids.map(i=>pos(current,i)));
      if(h&&(!best||h.distance<best.distance))best={...h,triangle:k/3,vertexIds:ids};
    }
    return best?Object.freeze(best):null;
  }
  function beginStroke(hit,{radius=0.35,strength=1,falloff=1,region='ALL'}={}){
    if(active)throw new Error('STROKE_ALREADY_ACTIVE');
    if(!hit||!Array.isArray(hit.position)||!Array.isArray(hit.normal)||!Array.isArray(hit.vertexIds))throw new TypeError('SURFACE_PICK_REQUIRED');
    v3(hit.position,'HIT_POSITION');v3(hit.normal,'HIT_NORMAL');
    if(!finite(radius)||radius<0.02||radius>2.5||!finite(strength)||strength<=0||strength>2||!finite(falloff)||falloff<0.1||falloff>5)throw new RangeError('BRUSH_CONTROLS_INVALID');
    if(region!=='ALL'&&!originalRegions.includes(region))throw new Error('REGION_UNKNOWN');
    const affected=[];for(let i=0;i<count;i++){
      if(frozen.has(i)||region!=='ALL'&&originalRegions[i]!==region)continue;
      const d=Math.hypot(...sub(pos(current,i),hit.position));if(d>radius)continue;
      const t=1-d/radius,weight=Math.pow(t*t*(3-2*t),falloff);
      if(weight>0)affected.push([i,weight]);
    }
    if(!affected.length)throw new Error('NO_EDITABLE_VERTICES_IN_RADIUS');
    active={before:new Float32Array(current),hit,affected,strength,changed:false};return Object.freeze({selectedTriangle:hit.triangle,affectedVertexIds:affected.map(v=>v[0])});
  }
  function applyStroke({mode='PULL',amount=0,delta=[0,0,0]}={}){
    if(!active)throw new Error('NO_ACTIVE_STROKE');
    if(!['PULL','PUSH','MOVE'].includes(mode)||!finite(amount)||Math.abs(amount)>0.4)throw new TypeError('STROKE_MODE_OR_AMOUNT_INVALID');
    v3(delta,'STROKE_DELTA');if(delta.some(x=>Math.abs(x)>0.4))throw new RangeError('STROKE_DELTA_EXCESSIVE');
    const direction=mode==='MOVE'?delta:mul(active.hit.normal,(mode==='PULL'?1:-1)*Math.abs(amount));
    if(direction.every(x=>x===0))return false;
    const candidate=new Float32Array(current);
    for(const [i,w]of active.affected)for(let j=0;j<3;j++)candidate[3*i+j]+=direction[j]*active.strength*w;
    try{verifySculptGeometry(candidate,faces);}catch(e){current=new Float32Array(active.before);active=null;throw e;}
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
    const restored=new Float32Array(obj.positions);verifySculptGeometry(restored,faces);current=restored;undo.length=0;redo.length=0;revision++;return true;}
  return Object.freeze({pick,beginStroke,applyStroke,endStroke,cancelStroke,undo:undoStroke,redo:redoStroke,serialize,restore,
    getPositions:()=>new Float32Array(current),getTriangles:()=>new Uint32Array(faces),getRegions:()=>[...originalRegions],
    getNormals:()=>computeSculptNormals(current,faces),verify:()=>verifySculptGeometry(current,faces),
    state:()=>Object.freeze({revision,active:Boolean(active),undoDepth:undo.length,redoDepth:redo.length,vertices:count,triangles:faces.length/3})});
}
