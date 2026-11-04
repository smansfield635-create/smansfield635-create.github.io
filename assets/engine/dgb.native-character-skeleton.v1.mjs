/** Diamond Gate Graphics Engine E10 — native character skeleton foundation (Gen3104).
 * Source candidate admitted under DGB_E10_CHARACTER_FOUNDATION_ATOMIC_SOURCE_BOOTSTRAP_20261104_001.
 * Pure CPU forward kinematics only; no GPU, skinning, IK, animation clips, glTF, consumer runtime integration, merge, or deployment authority.
 * Convention: right handed, +Y up, column-major downstream E3, unit quaternions [x,y,z,w].
 */
const finite = n => typeof n === 'number' && Number.isFinite(n);
function v3(a, name) {
  if (!Array.isArray(a) || a.length !== 3 || !a.every(finite)) throw new TypeError(`${name}_INVALID`);
  return a.slice();
}
function q4(a, name) {
  if (!Array.isArray(a) || a.length !== 4 || !a.every(finite)) throw new TypeError(`${name}_INVALID`);
  const size = Math.hypot(...a);
  if (!(size > 1e-12)) throw new RangeError(`${name}_ZERO`);
  return a.map(x=>x / size);
}
function qmul(a,b) {
  const [x,y,z,w] = a, [u,v,t,s] = b;
  return q4([w*u + x*s + y*t - z*v, w*v - x*t + y*s + z*u,
    w*t + x*v - y*u + z*s, w*s - x*u - y*v - z*t], 'PRODUCT');
}
function rotate(q,p) {
  const [x,y,z,w]=q;
  const tx=2*(y*p[2]-z*p[1]);const ty=2*(z*p[0]-x*p[2]);const tz=2*(x*p[1]-y*p[0]);
  return [p[0]+w*tx+(y*tz-z*ty),p[1]+w*ty+(z*tx-x*tz),p[2]+w*tz+(x*ty-y*tx)];
}
function hingeQuat(axis,angle) {const s=Math.sin(angle/2);return [axis[0]*s,axis[1]*s,axis[2]*s,Math.cos(angle/2)];}
const unit = a => {const n=Math.hypot(...a);if(n<1e-12)throw new RangeError('HINGE_AXIS_ZERO');return a.map(x=>x/n);};
const frozenVec = x=>Object.freeze(x.slice());
const frozenTransform = o=>Object.freeze({position:frozenVec(o.position),rotation:frozenVec(o.rotation)});
export function createSkeleton(joints) {
  if(!Array.isArray(joints)||joints.length<1||joints.length>256)throw new RangeError('JOINT_COUNT_INVALID');
  const byId = new Map();let roots=0;
  const normalized=joints.map((joint,i)=>{
    if(!joint||typeof joint.id!=='string'||!/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(joint.id)||byId.has(joint.id))throw new TypeError('JOINT_ID_INVALID_OR_DUPLICATE');
    const parent=joint.parent??null;
    if(parent===null)roots++;else if(!byId.has(parent))throw new Error('PARENT_MUST_PRECEDE_CHILD');
    const position=v3(joint.bindPosition??[0,0,0],'BIND_POSITION');
    const rotation=q4(joint.bindRotation??[0,0,0,1],'BIND_ROTATION');
    const kind=joint.constraint?.kind??'FIXED';let constraint;
    if(kind==='HINGE'){
      const axis=unit(v3(joint.constraint.axis,'HINGE_AXIS'));
      const min=joint.constraint.min, max=joint.constraint.max;
      if(!finite(min)||!finite(max)||min>max)throw new RangeError('HINGE_LIMITS_INVALID');
      constraint=Object.freeze({kind,axis:frozenVec(axis),min,max});
    }else if(kind==='FREE')constraint=Object.freeze({kind});
    else if(kind==='FIXED')constraint=Object.freeze({kind});
    else throw new TypeError('CONSTRAINT_KIND_INVALID');
    const rec=Object.freeze({id:joint.id,parent,bindPosition:frozenVec(position),bindRotation:frozenVec(rotation),constraint});
    byId.set(joint.id,i);return rec;
  });
  if(roots!==1)throw new Error('SINGLE_ROOT_REQUIRED');
  const definition=Object.freeze(normalized);
  function samplePose({rootTranslation=[0,0,0],controls={}}={}) {
    const offset=v3(rootTranslation,'ROOT_TRANSLATION');
    if(!controls||typeof controls!=='object'||Array.isArray(controls))throw new TypeError('POSE_CONTROLS_INVALID');
    for(const id of Object.keys(controls))if(!byId.has(id))throw new Error(`UNKNOWN_JOINT_${id}`);
    const states=new Map(), world=new Map();
    for(const joint of definition){
      const input=Object.hasOwn(controls,joint.id)?controls[joint.id]:undefined;
      let delta=[0,0,0,1];
      if(joint.constraint.kind==='HINGE'){
        const angle=input===undefined?0:input;
        if(!finite(angle)||angle<joint.constraint.min-1e-12||angle>joint.constraint.max+1e-12)throw new RangeError(`HINGE_ANGLE_REJECTED_${joint.id}`);
        delta=hingeQuat(joint.constraint.axis,angle);
      }else if(joint.constraint.kind==='FREE'){
        delta=input===undefined?delta:q4(input,`POSE_ROTATION_${joint.id}`);
      }else if(input!==undefined)throw new Error(`FIXED_JOINT_CONTROL_REJECTED_${joint.id}`);
      const localRotation=qmul(joint.bindRotation,delta);
      const local=frozenTransform({position:joint.bindPosition,rotation:localRotation});
      const parent=joint.parent===null?null:world.get(joint.parent);
      const rotated=parent?rotate(parent.rotation,local.position):local.position;
      const position=rotated.map((n,i)=>n+(parent?parent.position[i]:offset[i]));
      const rotation=parent?qmul(parent.rotation,local.rotation):local.rotation;
      const w=frozenTransform({position,rotation});states.set(joint.id,local);world.set(joint.id,w);
    }
    return Object.freeze({
      rootTranslation:frozenVec(offset),
      joints:Object.freeze(definition.map(j=>Object.freeze({id:j.id,parent:j.parent,local:states.get(j.id),world:world.get(j.id)}))),
      joint(id){if(!byId.has(id))throw new Error('UNKNOWN_JOINT');const index=byId.get(id);return this.joints[index];},
    });
  }
  return Object.freeze({joints:definition,samplePose, jointCount:definition.length});
}
