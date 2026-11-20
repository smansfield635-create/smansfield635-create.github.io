/**
 * Diamond Gate Graphics Engine — Device 2 M1.3 engine-owned off-product integration candidate.
 * Consumes the existing M1.2 morph evaluator and M1.1 device updateMeshAttribute.
 * Reconstructs normals for a stable indexed UV render topology; no second renderer,
 * no GL allocation, no new character model, no on-product entry or release authority.
 */
const finite = Number.isFinite;
function ownedFloat32(value,name) {
  if (!(value instanceof Float32Array) || !value.length || value.some(v => !finite(v)))
    throw new TypeError(name+'_FLOAT32_FINITE_REQUIRED');
  return new Float32Array(value);
}
export function createMorphGpuBridge({evaluator, device, mesh, renderToMaster,
  triangles, positionAttribute='a_position', normalAttribute='a_normal',
  baselineNormals=null}={}) {
  if (!evaluator || typeof evaluator.evaluate!=='function' || !Number.isInteger(evaluator.vertexCount))
    throw new TypeError('MORPH_EVALUATOR_REQUIRED');
  if (!device || typeof device.updateMeshAttribute!=='function')
    throw new TypeError('M1_1_DEVICE_UPDATE_REQUIRED');
  if (!mesh) throw new TypeError('OWNED_DEVICE_MESH_REQUIRED');
  if (typeof positionAttribute!=='string' || !positionAttribute ||
      typeof normalAttribute!=='string' || !normalAttribute || normalAttribute===positionAttribute)
    throw new TypeError('ATTRIBUTE_NAMES_INVALID');
  if (!(renderToMaster instanceof Int32Array || renderToMaster instanceof Uint32Array) ||
      renderToMaster.length < 3 || renderToMaster.length > 100000) throw new TypeError('RENDER_MASTER_MAPPING_INVALID');
  if (!(triangles instanceof Uint16Array || triangles instanceof Uint32Array || triangles instanceof Uint8Array)
      || !triangles.length || triangles.length%3!==0) throw new TypeError('TRIANGLE_INDICES_INVALID');
  const n=renderToMaster.length, m=evaluator.vertexCount;
  const remap=Int32Array.from(renderToMaster);
  for(const idx of remap) if(idx<0 || idx>=m) throw new RangeError('RENDER_MAPPING_OUT_OF_BOUNDS');
  const indices=Uint32Array.from(triangles);
  for(const idx of indices) if(idx>=n) throw new RangeError('TRIANGLE_INDEX_OUT_OF_BOUNDS');
  let previousNormals=null;
  if(baselineNormals!==null) {
    previousNormals=ownedFloat32(baselineNormals,'BASELINE_NORMALS');
    if(previousNormals.length!==n*3) throw new RangeError('BASELINE_NORMALS_DIMENSION_MISMATCH');
  }
  const sourceBase=ownedFloat32(evaluator.evaluate(),'MORPH_BASE');
  if(sourceBase.length!==m*3) throw new RangeError('MORPH_EVALUATOR_DIMENSION_MISMATCH');
  function mapPoints(masterPositions) {
    const positions=new Float32Array(n*3);
    for(let i=0;i<n;i++) {
      const a=3*i,b=3*remap[i];
      positions[a]=masterPositions[b];positions[a+1]=masterPositions[b+1];positions[a+2]=masterPositions[b+2];
    }
    return positions;
  }
  function recomputeNormals(positions,fallback=null) {
    const acc=new Float64Array(m*3);
    for(let t=0;t<indices.length;t+=3) {
      const a=indices[t],b=indices[t+1],c=indices[t+2];
      const a3=3*a,b3=3*b,c3=3*c;
      const u0=positions[b3]-positions[a3],u1=positions[b3+1]-positions[a3+1],u2=positions[b3+2]-positions[a3+2];
      const v0=positions[c3]-positions[a3],v1=positions[c3+1]-positions[a3+1],v2=positions[c3+2]-positions[a3+2];
      const x=u1*v2-u2*v1,y=u2*v0-u0*v2,z=u0*v1-u1*v0;
      if(!finite(x)||!finite(y)||!finite(z)) throw new RangeError('FACE_NORMAL_NONFINITE');
      const ia=3*remap[a],ib=3*remap[b],ic=3*remap[c];
      for(const j of [ia,ib,ic]){ acc[j]+=x;acc[j+1]+=y;acc[j+2]+=z; }
    }
    const normals=new Float32Array(n*3);
    let degenerates=0;
    for(let i=0;i<n;i++) {
      const k=i*3,l=3*remap[i];
      let x=acc[l],y=acc[l+1],z=acc[l+2];let length=Math.hypot(x,y,z);
      if(!(length>1e-15)) {
        degenerates++;
        if(fallback){x=fallback[k];y=fallback[k+1];z=fallback[k+2];length=Math.hypot(x,y,z);}
        if(!(length>1e-15)){x=0;y=0;z=1;length=1;}
      }
      normals[k]=x/length;normals[k+1]=y/length;normals[k+2]=z/length;
    }
    if(normals.some(x=>!finite(x))) throw new RangeError('RENDER_NORMAL_NONFINITE');
    return {normals,degenerates};
  }
  let lastPosition=mapPoints(sourceBase);
  let lastNormal=previousNormals??recomputeNormals(lastPosition).normals;
  let unhealthy=false,frames=0;
  function update(weights) {
    if(unhealthy) throw new Error('MORPH_GPU_BRIDGE_UNHEALTHY');
    const master=ownedFloat32(evaluator.evaluate(weights),'MORPH_FRAME');
    if(master.length!==m*3) throw new RangeError('MORPH_FRAME_DIMENSION_MISMATCH');
    const positions=mapPoints(master);
    const {normals,degenerates}=recomputeNormals(positions,lastNormal);
    let normalUpdated=false,positionUpdated=false;
    try {
      // Sequential updates are synchronous; client must draw only after update returns.
      device.updateMeshAttribute(mesh,normalAttribute,normals);normalUpdated=true;
      device.updateMeshAttribute(mesh,positionAttribute,positions);positionUpdated=true;
    } catch(primary) {
      // M1.1 is individually transactional, but the pair needs cross-attribute rollback.
      try {
        if(normalUpdated) device.updateMeshAttribute(mesh,normalAttribute,lastNormal);
        if(positionUpdated) device.updateMeshAttribute(mesh,positionAttribute,lastPosition);
      } catch(rollback) {
        unhealthy=true;
        const err=new Error('MORPH_GPU_BRIDGE_ROLLBACK_FAILED');
        err.cause={primary,rollback};throw err;
      }
      throw primary;
    }
    lastPosition=positions;lastNormal=normals;frames++;
    return Object.freeze({frames,renderVertices:n,masterVertices:m,degenerateNormals:degenerates});
  }
  function snapshot() {
    return Object.freeze({positions:new Float32Array(lastPosition),normals:new Float32Array(lastNormal),
      frames,unhealthy});
  }
  return Object.freeze({masterVertices:m,renderVertices:n,triangleCount:indices.length/3,
    update,snapshot,preview:(weights)=>{
      const master=ownedFloat32(evaluator.evaluate(weights),'MORPH_PREVIEW');
      if(master.length!==m*3) throw new RangeError('MORPH_FRAME_DIMENSION_MISMATCH');
      const positions=mapPoints(master),res=recomputeNormals(positions,lastNormal);
      return {positions,normals:res.normals,degenerateNormals:res.degenerates};
    }});
}
