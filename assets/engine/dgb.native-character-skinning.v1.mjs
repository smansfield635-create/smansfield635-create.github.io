/** Diamond Gate Graphics Engine — native character skinning foundation.
 * Candidate source for DGB_E10_CHARACTER_SKINNING_ATOMIC_SOURCE_BOOTSTRAP_20261104_001.
 * CPU-only linear-blend deformation using rigid inverse-bind joint transforms; no GPU, morph targets, scale/shear, clips, IK, world-consumer integration, merge or deployment entitlement.
 */
const finite = Number.isFinite;
const qConj = q => [-q[0], -q[1], -q[2], q[3]];
function rotate(q, p) {
  const [x,y,z,w]=q;
  const tx=2*(y*p[2]-z*p[1]),ty=2*(z*p[0]-x*p[2]),tz=2*(x*p[1]-y*p[0]);
  return [p[0]+w*tx+(y*tz-z*ty),p[1]+w*ty+(z*tx-x*tz),p[2]+w*tz+(x*ty-y*tx)];
}
function add(a,b){return a.map((x,i)=>x+b[i]);}
function sub(a,b){return a.map((x,i)=>x-b[i]);}
export function createSkinnedMesh(skeleton, {vertices, influences}) {
  if(!skeleton || typeof skeleton.samplePose !== 'function') throw new TypeError('SKELETON_REQUIRED');
  if(!Array.isArray(vertices) || vertices.length===0 || vertices.length>100000 ||
      !Array.isArray(influences) || influences.length!==vertices.length) throw new TypeError('MESH_SCHEMA_INVALID');
  const bind=skeleton.samplePose();
  const known=new Set(skeleton.joints.map(j=>j.id));
  const vertexCopy = vertices.map((p,i)=>{
    if(!Array.isArray(p) || p.length!==3 || !p.every(finite))throw new TypeError(`VERTEX_INVALID_${i}`);
    return Object.freeze([...p]);
  });
  const inflCopy=influences.map((items,i)=>{
    if(!Array.isArray(items)||items.length<1||items.length>4)throw new TypeError(`INFLUENCE_COUNT_INVALID_${i}`);
    const seen=new Set();let sum=0;
    const copy=items.map(({joint,weight})=>{
      if(!known.has(joint)||seen.has(joint)||!finite(weight)||weight<=0||weight>1)throw new TypeError(`INFLUENCE_INVALID_${i}`);
      seen.add(joint);sum+=weight;return Object.freeze({joint,weight});
    });
    if(Math.abs(sum-1)>1e-6)throw new RangeError(`WEIGHTS_MUST_SUM_TO_ONE_${i}`);
    return Object.freeze(copy);
  });
  function deform(pose) {
    if(!pose || !Array.isArray(pose.joints) || pose.joints.length!==bind.joints.length ||
       pose.joints.some((j,i)=>j.id!==bind.joints[i].id))throw new TypeError('POSE_SKELETON_MISMATCH');
    return Object.freeze(vertexCopy.map((v,i)=>{
      const out=[0,0,0];
      for(const {joint,weight} of inflCopy[i]){
        const b=bind.joint(joint).world, w=pose.joint(joint).world;
        const local=rotate(qConj(b.rotation),sub(v,b.position));
        const dest=add(rotate(w.rotation,local),w.position);
        for(let k=0;k<3;k++)out[k]+=dest[k]*weight;
      }
      return Object.freeze(out);
    }));
  }
  return Object.freeze({vertexCount:vertexCopy.length,deform,bindVertices:Object.freeze(vertexCopy)});
}
