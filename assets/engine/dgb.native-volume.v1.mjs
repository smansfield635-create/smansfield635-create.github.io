/** Diamond Gate cycle-one experimental geometry: original analytic SDF and tetrahedral isosurface.
 * Pure CPU, +Y up, meters. No renderer, world mutation, anatomical or generation claim.
 */
const xyz=(p,label)=>{if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))throw new TypeError(label+'_INVALID');return p;};
const len=p=>Math.hypot(...p),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const sphere=(center,r)=>{xyz(center,'CENTER');if(!(r>0&&Number.isFinite(r)))throw new TypeError('RADIUS_INVALID');return p=>len(sub(p,center))-r;};
export const capsule=(a,b,r)=>{xyz(a,'A');xyz(b,'B');if(!(r>0&&Number.isFinite(r)))throw new TypeError('RADIUS_INVALID');const ba=sub(b,a),d=dot(ba,ba);if(d<1e-12)throw new TypeError('SEGMENT_ZERO');return p=>{const pa=sub(p,a),t=Math.max(0,Math.min(1,dot(pa,ba)/d));return len(sub(pa,ba.map(x=>x*t)))-r;};};
export const union=(...fields)=>{if(fields.length<2||!fields.every(f=>typeof f==='function'))throw new TypeError('FIELDS_REQUIRED');return p=>Math.min(...fields.map(f=>f(p)));};
export const subtract=(a,b)=>{if(typeof a!=='function'||typeof b!=='function')throw new TypeError('FIELDS_REQUIRED');return p=>Math.max(a(p),-b(p));};
export const smoothUnion=(a,b,k)=>{if(typeof a!=='function'||typeof b!=='function'||!Number.isFinite(k)||k<=0)throw new TypeError('SMOOTH_FIELDS_INVALID');return p=>{const d=a(p),e=b(p),h=Math.max(k-Math.abs(d-e),0)/k;return Math.min(d,e)-h*h*k*.25;};};
function gradient(field,p){const h=1e-4,v=[0,1,2].map(i=>{const a=[...p],b=[...p];a[i]+=h;b[i]-=h;return field(a)-field(b);});const l=len(v);return l>1e-9?v.map(x=>x/l):[0,1,0];}
// Gradient of the tetra's LINEAR interpolant, not the nonlinear source field.
// It is the orientation authority for the extracted plane on either side of a shared tetra face.
function tetraGradient(tet,c,values){const [a,b,d,e]=tet.map(i=>c[i]),v=sub(b[1],a[1]),w=sub(d[1],a[1]),u=sub(e[1],a[1]),f=[values[b[0]]-values[a[0]],values[d[0]]-values[a[0]],values[e[0]]-values[a[0]]];
const x=cross(w,u),y=cross(u,v),z=cross(v,w),den=dot(v,x);if(Math.abs(den)<1e-14)throw new Error('TETRA_DEGENERATE');const g=[0,1,2].map(i=>(f[0]*x[i]+f[1]*y[i]+f[2]*z[i])/den),m=len(g);if(m<1e-12)throw new Error('TETRA_GRADIENT_ZERO');return g.map(a=>a/m);}

const tetEdges=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
const tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
/** Surface extraction of an implicit field, with shared-edge vertex identities. */
export function meshField(field,{resolution=24,min=[-1.5,-1.5,-1.5],max=[1.5,1.5,1.5],strict=true}={}){
  if(typeof field!=='function'||!Number.isInteger(resolution)||resolution<8||resolution>64)throw new TypeError('FIELD_OR_RESOLUTION_INVALID');
  xyz(min,'MIN');xyz(max,'MAX');if(min.some((x,i)=>x>=max[i]))throw new TypeError('BOUNDS_INVALID');
  const n=resolution,size=n+1,positions=[],normals=[],triangles=[],edgeVertices=new Map();
  const lattice=(x,y,z)=>x+size*(y+size*z);
  const count=size**3,values=new Float64Array(count);
  for(let z=0;z<=n;z++)for(let y=0;y<=n;y++)for(let x=0;x<=n;x++){
    const p=[x,y,z].map((v,i)=>min[i]+(max[i]-min[i])*v/n),d=field(p);
    if(!Number.isFinite(d))throw new TypeError('FIELD_NOT_FINITE');values[lattice(x,y,z)]=d+1e-3;
  }
  function vertex(a,b){const id1=a[0],id2=b[0],key=id1<id2?`${id1}:${id2}`:`${id2}:${id1}`;if(edgeVertices.has(key))return edgeVertices.get(key);
    const av=values[id1],bv=values[id2],t=Math.abs(av-bv)>1e-12?av/(av-bv):.5,p=a[1].map((v,i)=>v+(b[1][i]-v)*t),id=positions.length/3;
    positions.push(...p);normals.push(...gradient(field,p));edgeVertices.set(key,id);return id;
  }
  for(let z=0;z<n;z++)for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const c=corners.map(q=>{const ix=x+q[0],iy=y+q[1],iz=z+q[2];return [lattice(ix,iy,iz),[ix,iy,iz].map((v,i)=>min[i]+(max[i]-min[i])*v/n)];});
    for(const tet of tets){const hits=[];
      for(const [a,b] of tetEdges){const va=c[tet[a]],vb=c[tet[b]];if((values[va[0]]<0)!==(values[vb[0]]<0))hits.push(vertex(va,vb));}
      if(hits.length<3)continue;
      const coords=id=>positions.slice(id*3,id*3+3),center=[0,1,2].map(k=>hits.reduce((s,id)=>s+positions[id*3+k],0)/hits.length);
      const normal=tetraGradient(tet,c,values),pivot=Math.abs(normal[1])<.9?[0,1,0]:[1,0,0],u=cross(normal,pivot),ul=len(u),ux=u.map(v=>v/ul),vy=cross(normal,ux);
      hits.sort((a,b)=>{const angle=id=>{const p=sub(coords(id),center);return Math.atan2(dot(p,vy),dot(p,ux));};return angle(a)-angle(b);});
      for(let i=1;i<hits.length-1;i++){
        let [a,b,c]=[hits[0],hits[i],hits[i+1]];const pa=coords(a),pb=coords(b),pc=coords(c),area=cross(sub(pb,pa),sub(pc,pa));
        if(len(area)<1e-10)continue;
        if(dot(area,normal)<0)[b,c]=[c,b];triangles.push(a,b,c);
      }
    }
  }
  const pos=new Float32Array(positions),idx=new Uint32Array(triangles),nor=new Float32Array(normals);
  const uv=new Float32Array((pos.length/3)*2);
  for(let i=0;i<pos.length/3;i++){uv[2*i]=(pos[3*i]-min[0])/(max[0]-min[0]);uv[2*i+1]=(pos[3*i+1]-min[1])/(max[1]-min[1]);}
  const mesh=Object.freeze({positions:pos,triangles:idx,normals:nor,uvs:uv,vertexCount:pos.length/3,triangleCount:idx.length/3,source:'SDF_MARCHING_TETRA_V1'});
  if(strict&&!inspectMesh(mesh).watertight)throw new Error('EXTRACTED_SURFACE_TOPOLOGY_UNQUALIFIED');
  return mesh;
}
/** A bounded geometry census; does not claim anatomical, artist, or physical quality. */
export function inspectMesh(mesh){
  const {positions:p,triangles:t}=mesh||{};if(!p||!t||p.length%3||t.length%3||Array.from(p).some(x=>!Number.isFinite(x)))throw new TypeError('MESH_SOURCE_INVALID');const edges=new Map(),directed=new Map(),faceKeys=new Set();let degenerate=0,invalid=0,duplicate=0;
  for(let i=0;i<t.length;i+=3){const ids=[t[i],t[i+1],t[i+2]],key=[...ids].sort((a,b)=>a-b).join(':');if(faceKeys.has(key))duplicate++;faceKeys.add(key);
    if(ids.some(id=>!Number.isSafeInteger(id)||id<0||id>=p.length/3)||new Set(ids).size<3){invalid++;continue;}
    const a=ids.map(id=>Array.from(p.slice(id*3,id*3+3))),ar=len(cross(sub(a[1],a[0]),sub(a[2],a[0])));if(ar<1e-9)degenerate++;
    for(let j=0;j<3;j++){const x=ids[j],y=ids[(j+1)%3],k=x<y?`${x}:${y}`:`${y}:${x}`;edges.set(k,(edges.get(k)||0)+1);const sign=x<y?1:-1;directed.set(k,(directed.get(k)||0)+sign);}
  }
  let boundaries=0,nonManifold=0,inconsistentWinding=0;for(const [edge,count] of edges){if(count===1)boundaries++;if(count>2)nonManifold++;if(count===2&&directed.get(edge)!==0)inconsistentWinding++;}
  return Object.freeze({vertices:p.length/3,triangles:t.length/3,boundaryEdges:boundaries,nonManifoldEdges:nonManifold,inconsistentWindingEdges:inconsistentWinding,degenerateTriangles:degenerate,invalidTriangles:invalid,duplicateTriangles:duplicate,watertight:t.length>0&&!boundaries&&!nonManifold&&!inconsistentWinding&&!invalid&&!degenerate&&!duplicate});
}
