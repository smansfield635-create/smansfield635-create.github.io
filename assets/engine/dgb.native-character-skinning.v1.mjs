/** Diamond Gate Graphics Engine — native character skinning foundation.
 * Candidate source for DGB_E10_CHARACTER_SKINNING_ATOMIC_SOURCE_BOOTSTRAP_20261104_001.
 * CPU-only linear-blend deformation and opt-in bind-space morph targets using rigid inverse-bind joint transforms; no GPU, scale/shear, clips, IK, world-consumer integration, merge or deployment entitlement.
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
/**
 * Bounded dense morph target evaluator, independent of WebGL and character identity.
 * Inputs are flattened XYZ Float32Arrays; targets are signed XYZ deltas, not poses.
 * Positive/negative weights are intentional (e.g. a low-rank PCA reconstruction).
 * A fresh Float32Array is returned for each evaluation and can be uploaded to E1.
 */
export function createMorphTargetEvaluator({basePositions, targets} = {}) {
  if (!(basePositions instanceof Float32Array) ||
      basePositions.length < 3 || basePositions.length % 3 !== 0 ||
      basePositions.length / 3 > 100000 ||
      !basePositions.every(finite)) throw new TypeError('MORPH_BASE_POSITIONS_INVALID');
  if (!Array.isArray(targets) || targets.length < 1 || targets.length > 128 ||
      targets.length * basePositions.length > 8_000_000) throw new TypeError('MORPH_TARGET_COUNT_OR_CAPACITY_INVALID');
  const names = new Set();
  const source = new Float32Array(basePositions);
  const copies = targets.map((target, i) => {
    if (!target || typeof target.name !== 'string' || !/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(target.name) || names.has(target.name))
      throw new TypeError('MORPH_TARGET_NAME_INVALID_OR_DUPLICATE_' + i);
    names.add(target.name);
    if (!(target.deltas instanceof Float32Array) || target.deltas.length !== source.length || !target.deltas.every(finite))
      throw new TypeError('MORPH_TARGET_DELTAS_INVALID_' + i);
    return new Float32Array(target.deltas);
  });
  function evaluate(weights = null) {
    if (weights !== null && !(weights instanceof Float32Array) && !Array.isArray(weights))
      throw new TypeError('MORPH_WEIGHTS_TYPE_INVALID');
    if (weights !== null && weights.length !== copies.length)
      throw new RangeError('MORPH_WEIGHTS_LENGTH_MISMATCH');
    const result64 = Float64Array.from(source);
    for (let j = 0; j < copies.length; j++) {
      const weight = weights === null ? 0 : weights[j];
      if (typeof weight !== 'number' || !finite(weight)) throw new TypeError('MORPH_WEIGHT_NONFINITE_' + j);
      if (weight === 0) continue;
      const delta = copies[j];
      for (let k = 0; k < result64.length; k++) result64[k] += weight * delta[k];
    }
    const result = new Float32Array(result64);
    if (!result.every(finite)) throw new RangeError('MORPH_RESULT_NONFINITE');
    return result;
  }
  return Object.freeze({vertexCount: source.length / 3,
    targetCount: copies.length, targetNames: Object.freeze([...names]), evaluate});
}

export function createSkinnedMesh(skeleton, {vertices, influences, morphTargets = []}) {
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
  if (!Array.isArray(morphTargets)) throw new TypeError('MORPH_TARGETS_SCHEMA_INVALID');
  const morph = morphTargets.length === 0 ? null : createMorphTargetEvaluator({
    basePositions: Float32Array.from(vertexCopy.flat()), targets: morphTargets
  });
  function deform(pose, morphWeights = null) {
    if(!pose || !Array.isArray(pose.joints) || pose.joints.length!==bind.joints.length ||
       pose.joints.some((j,i)=>j.id!==bind.joints[i].id))throw new TypeError('POSE_SKELETON_MISMATCH');
    if (!morph && morphWeights !== null) throw new TypeError('MORPH_TARGETS_NOT_CONFIGURED');
    const positions = morph ? morph.evaluate(morphWeights) : null;
    return Object.freeze(vertexCopy.map((v,i)=>{
      const bindVertex = positions ? [positions[i*3], positions[i*3+1], positions[i*3+2]] : v;
      const out=[0,0,0];
      for(const {joint,weight} of inflCopy[i]){
        const b=bind.joint(joint).world, w=pose.joint(joint).world;
        const local=rotate(qConj(b.rotation),sub(bindVertex,b.position));
        const dest=add(rotate(w.rotation,local),w.position);
        for(let k=0;k<3;k++)out[k]+=dest[k]*weight;
      }
      return Object.freeze(out);
    }));
  }
  return Object.freeze({vertexCount:vertexCopy.length,deform,bindVertices:Object.freeze(vertexCopy),
    morphTargetNames: morph ? morph.targetNames : Object.freeze([])});
}
