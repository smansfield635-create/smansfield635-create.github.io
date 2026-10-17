import {H_EARTH_WATER_PRESENTATION_ENABLED,H_EARTH_REAR_WATER_PRESENTATION_ENABLED} from '../functional-landscape/geological-runtime-bridge.v1.js?rev=gen2780-stable-planting-v1';
/** Presentation roots belong to the indexed surfaces actually submitted to WebGL. */
const f=Math.fround,EPS=1e-8;
const invalid=reason=>{throw Error('VEGETATION_VISIBLE_SURFACE_INVALID:'+reason);};
const isWater=span=>/WATER|FAR_OCEAN_CONTINUATION/.test(String(span.role)+' '+String(span.primitiveId));

function triangleSurface(parts){
  const triangles=[];
  for(const {positions,indices,spans,owner,partId,surfaceRevision=1,skip=new Set()} of parts){
    if(!positions||!indices||positions.length%3||indices.length%3)invalid('INDEXED_GEOMETRY');
    for(const span of spans){
      const start=span.indexStart,count=span.indexCount;
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(count)||start<0||count<0||start%3||count%3||start+count>indices.length)invalid('SPAN');
      for(let offset=start;offset<start+count;offset+=3){
        if(skip.has(offset))continue;
        const p=[0,1,2].map(k=>{
          const id=indices[offset+k];
          if(!Number.isSafeInteger(id)||id<0||id*3+2>=positions.length)invalid('VERTEX_INDEX');
          const point=[f(positions[id*3]),f(positions[id*3+1]),f(positions[id*3+2])];
          if(!point.every(Number.isFinite))invalid('NONFINITE_VERTEX');
          return point;
        });
        const [a,b,c]=p,det=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);
        // Retirement and refinement intentionally encode absent triangles as degeneracies.
        if(Math.abs(det)<1e-12)continue;
        const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
        const ny=uz*vx-ux*vz;
        triangles.push({p,det,owner,partId,surfaceRevision,triangleOffset:offset,vertexIndices:Object.freeze([indices[offset],indices[offset+1],indices[offset+2]]),triangleId:offset/3,terrainPrimitiveId:span.primitiveId??owner,
          slope:Math.hypot(uy*vz-uz*vy,ux*vy-uy*vx)/Math.abs(ny),
          box:[Math.min(a[0],b[0],c[0]),Math.min(a[2],b[2],c[2]),Math.max(a[0],b[0],c[0]),Math.max(a[2],b[2],c[2])]});
      }
    }
  }
  // A bounded tree also handles large ocean triangles without allocating a world-sized bin grid.
  const tree=items=>{
    if(!items.length)return null;
    const box=[Infinity,Infinity,-Infinity,-Infinity];
    for(const t of items){box[0]=Math.min(box[0],t.box[0]);box[1]=Math.min(box[1],t.box[1]);box[2]=Math.max(box[2],t.box[2]);box[3]=Math.max(box[3],t.box[3]);}
    if(items.length<=12)return {box,items};
    const axis=box[2]-box[0]>=box[3]-box[1]?0:1;
    items.sort((a,b)=>(a.box[axis]+a.box[axis+2])-(b.box[axis]+b.box[axis+2]));
    const mid=items.length>>1;
    return {box,left:tree(items.slice(0,mid)),right:tree(items.slice(mid))};
  };
  const root=tree(triangles);
  const inside=(box,x,z)=>x>=box[0]-EPS&&x<=box[2]+EPS&&z>=box[1]-EPS&&z<=box[3]+EPS;
  function sample(x,z){
    if(!Number.isFinite(x)||!Number.isFinite(z))invalid('SAMPLE_POINT');
    let best=null;
    const visit=node=>{
      if(!node||!inside(node.box,x,z))return;
      if(!node.items){visit(node.left);visit(node.right);return;}
      for(const t of node.items){
        if(!inside(t.box,x,z))continue;
        const [a,b,c]=t.p,u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/t.det,
          v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/t.det,w=1-u-v;
        if(Math.min(u,v,w)<-EPS)continue;
        const y=f(u*a[1]+v*b[1]+w*c[1]);
        if(!best||y>best.y)best={x,y,z,slope:t.slope,triangleId:t.triangleId,terrainPrimitiveId:t.terrainPrimitiveId,owner:t.owner,partId:t.partId,surfaceRevision:t.surfaceRevision,triangleOffset:t.triangleOffset,vertexIndices:t.vertexIndices,barycentricWeights:[u,v,w]};
      }
    };
    visit(root);return best;
  }
  return Object.freeze({sample,triangleCount:triangles.length});
}

/** No analytic height fields, canonical placement mutation, or module-local bridge state. */
export function buildVegetationVisibleSurface(pkg,{refinement=null,geology=null,waterPresentationEnabled=H_EARTH_WATER_PRESENTATION_ENABLED,rearWaterPresentationEnabled=H_EARTH_REAR_WATER_PRESENTATION_ENABLED,renderedAttributes=null,beachProviderFactory=null,protectedReferenceAt=()=>false,surfaceRevision=1}={}){
  if(!pkg?.buffers?.positions||!pkg.buffers.indices||!Array.isArray(pkg.primitiveSpans))invalid('PACKAGE');
  const retired=new Set(geology?.retirement?.triangleOffsets??[]);
  for(const offset of retired)if(!Number.isSafeInteger(offset)||offset<0||offset%3||offset+2>=pkg.buffers.indices.length)invalid('RETIREMENT_OFFSET');
  const packagePart={positions:renderedAttributes?.base?.positions??pkg.buffers.positions,indices:pkg.buffers.indices};
  const basePart={...packagePart,...renderedAttributes?.base,spans:pkg.primitiveSpans.filter(s=>s.role==='TERRAIN'),owner:'CANONICAL_VISIBLE_TERRAIN',partId:'BASE',surfaceRevision,skip:retired};
  const groundParts=[basePart];
  const base=triangleSurface([basePart]);
  let refined=null,clip=null;
  if(refinement){
    clip=refinement.clip;
    if(!Array.isArray(clip)||clip.length!==4||!clip.every(Number.isFinite)||clip[0]>=clip[2]||clip[1]>=clip[3])invalid('REFINEMENT_CLIP');
    basePart.hiddenClip=clip;
    const part={visibleClip:clip,...refinement,...renderedAttributes?.refinement,spans:[{indexStart:0,indexCount:refinement.indices.length,primitiveId:'VISIBLE_REFINEMENT'}],owner:'VISIBLE_REFINEMENT',partId:'REFINEMENT',surfaceRevision};groundParts.push(part);refined=triangleSurface([part]);
  }
  const exteriorParts=[],waterParts=[{...packagePart,spans:waterPresentationEnabled?pkg.primitiveSpans.filter(isWater):[],owner:'CANONICAL_RENDERED_WATER'}];
  for(const [partIndex,part] of (geology?.meshes??[]).entries()){
    const entry={positions:part.mesh.positions,indices:part.mesh.indices,...renderedAttributes?.geology?.[partIndex],partId:'GEOLOGY:'+partIndex,surfaceRevision,spans:[{indexStart:0,indexCount:part.mesh.indices.length,primitiveId:part.role}],owner:part.role};
    if(['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(part.role)){exteriorParts.push(entry);groundParts.push(entry);}
    if(rearWaterPresentationEnabled&&['FRESHWATER_RIVER','OASIS_WATER'].includes(part.role))waterParts.push(entry);
    // A vertical cliff or underground shell is never outdoor plant support.
  }
  const exterior=triangleSurface(exteriorParts),water=triangleSurface(waterParts);
  const ground=Object.freeze({triangleCount:base.triangleCount+(refined?.triangleCount??0)+exterior.triangleCount,sample(x,z){
    // The renderer clips the old base inside this refinement rectangle. A missing
    // refinement hit therefore stays missing; it cannot resurrect hidden ground.
    const inClip=refined&&x>clip[0]&&x<clip[2]&&z>clip[1]&&z<clip[3];
    const ordinary=inClip?refined.sample(x,z):base.sample(x,z),replacement=exterior.sample(x,z);
    return !ordinary?replacement:!replacement?ordinary:replacement.y>=ordinary.y?replacement:ordinary;
  }});
  const beach=beachProviderFactory?beachProviderFactory({surfaceRevision,parts:groundParts,protectedReferenceAt}):null;
  return Object.freeze({ground,water,beach,sample:ground.sample,receipt:Object.freeze({
    schema:'H_EARTH_VEGETATION_VISIBLE_SURFACE_v1',coordinateSpace:'UPLOADED_FLOAT32_WORLD_XZ',
    baseTerrainTriangles:base.triangleCount,retiredBaseTriangles:retired.size,
    refinementTriangles:refined?.triangleCount??0,geologicalExteriorTriangles:exterior.triangleCount,
    renderedWaterTriangles:water.triangleCount,refinementClipOrder:'MIN_X_MIN_Z_MAX_X_MAX_Z',
    portalAndCavernShellSupport:false,canonicalWorldChanged:false
  })});
}
