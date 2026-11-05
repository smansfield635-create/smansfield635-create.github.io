/** Diamond Gate Graphics Engine E10: deterministic CPU-only character pose composer (Gen3119).
 * Composes adopted hinge clips, explicit stance/swing targets, analytic two-bone IK and
 * an adopted skeleton pose compatible with CPU skinning. No gait generation or GPU output.
 */
import {IKMath} from './dgb.native-character-ik-contact.v1.mjs';
const finite=Number.isFinite;
const vec=(v,name)=>{if(!Array.isArray(v)||v.length!==3||!v.every(finite))throw new TypeError(`${name}_INVALID`);return [...v];};
const mul=(a,b)=>IKMath.qMul(a,b);
const conjugate=q=>[-q[0],-q[1],-q[2],q[3]];
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const closeVec=(a,b,e=2e-6)=>a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<=e);
const sameQuat=(a,b,e=2e-6)=>closeVec(a,b,e)||closeVec(a,b.map(x=>-x),e);
const freeze=o=>Object.freeze(o);
function hingeControl(joint,poseJoint){
 const q=mul(conjugate(joint.bindRotation),poseJoint.local.rotation),axis=joint.constraint.axis;
 const principal=2*Math.atan2(dot(q.slice(0,3),axis),q[3]);
 for(const offset of [0,-2*Math.PI,2*Math.PI,-4*Math.PI,4*Math.PI]){
  const v=principal+offset;
  if(v<joint.constraint.min-1e-9||v>joint.constraint.max+1e-9)continue;
  const s=Math.sin(v/2),t=[axis[0]*s,axis[1]*s,axis[2]*s,Math.cos(v/2)];
  if(sameQuat(q,t,1e-8))return Math.max(joint.constraint.min,Math.min(joint.constraint.max,v));
 }
 throw new RangeError(`CLIP_HINGE_RECONSTRUCTION_FAILED_${joint.id}`);
}
export function createPoseComposer(skeleton,{clip,legs,loopPolicy='REJECT'}={}){
 if(!skeleton||typeof skeleton.samplePose!=='function'||!Array.isArray(skeleton.joints))throw new TypeError('SKELETON_REQUIRED');
 if(!clip||typeof clip.sample!=='function'||!finite(clip.duration)||clip.duration<=0)throw new TypeError('CLIP_REQUIRED');
 if(!Array.isArray(legs)||!legs.length||legs.length>16)throw new TypeError('LEGS_REQUIRED');
 if(!['REJECT','DECLARE'].includes(loopPolicy))throw new TypeError('LOOP_POLICY_INVALID');
 const names=new Map(skeleton.joints.map(j=>[j.id,j]));
 const base=clip.sample(0);
 if(!base||!Array.isArray(base.joints)||base.joints.length!==skeleton.joints.length||base.joints.some((j,i)=>j.id!==skeleton.joints[i].id))throw new TypeError('CLIP_SKELETON_MISMATCH');
 const claimed=new Set(),identifiers=new Set();
 const defs=legs.map((leg,i)=>{
  if(!leg||typeof leg.id!=='string'||!leg.id||identifiers.has(leg.id))throw new TypeError(`LEG_ID_INVALID_${i}`);
  identifiers.add(leg.id);
  const {hipJoint,kneeJoint,footJoint,ik,contactTrack}=leg;
  const hip=names.get(hipJoint),knee=names.get(kneeJoint),foot=names.get(footJoint);
  if(!hip||!knee||!foot||hip.constraint.kind!=='FREE'||knee.constraint.kind!=='FREE'||foot.constraint.kind!=='FIXED'||knee.parent!==hip.id||foot.parent!==knee.id)
   throw new TypeError(`LEG_CHAIN_INVALID_${leg.id}`);
  if([hip.id,knee.id,foot.id].some(x=>claimed.has(x)))throw new TypeError(`LEG_JOINT_CONFLICT_${leg.id}`);
  for(const x of [hip.id,knee.id,foot.id])claimed.add(x);
  if(!ik||typeof ik.solve!=='function'||!finite(ik.upperLength)||!finite(ik.lowerLength))throw new TypeError(`IK_REQUIRED_${leg.id}`);
  if(!contactTrack||typeof contactTrack.sample!=='function'||!finite(contactTrack.duration))throw new TypeError(`CONTACT_TRACK_REQUIRED_${leg.id}`);
  if(Math.abs(contactTrack.duration-clip.duration)>1e-9||!!contactTrack.loop!==!!clip.loop)throw new RangeError(`CONTACT_CLIP_DURATION_OR_LOOP_MISMATCH_${leg.id}`);
  if(!closeVec(knee.bindPosition,[0,-ik.upperLength,0],1e-7)||!closeVec(foot.bindPosition,[0,-ik.lowerLength,0],1e-7))throw new TypeError(`LEG_BIND_AXIS_OR_LENGTH_MISMATCH_${leg.id}`);
  let ancestor=hip.parent;
  while(ancestor!==null){if(claimed.has(ancestor))throw new TypeError(`LEG_ANCESTRY_CONFLICT_${leg.id}`);ancestor=names.get(ancestor)?.parent??null;}
  return freeze({id:leg.id,hipJoint,kneeJoint,footJoint,ik,contactTrack});
 });
 // Also reject earlier leg chains that contain a subsequent leg's ancestry.
 for(const item of defs){let ancestor=names.get(item.hipJoint).parent;while(ancestor!==null){if(claimed.has(ancestor))throw new TypeError('LEG_ANCESTRY_CONFLICT');ancestor=names.get(ancestor)?.parent??null;}}
 const loopDiscontinuities=[];
 if(clip.loop){
  for(const d of defs){
   const left=d.contactTrack.sample(0),right=d.contactTrack.sample(clip.duration-1e-9);
   if(left.phase!==right.phase||left.phase==='STANCE'&&!closeVec(left.target,right.target,1e-8))loopDiscontinuities.push(d.id);
  }
  if(loopDiscontinuities.length&&loopPolicy==='REJECT')throw new RangeError('CONTACT_LOOP_SEAM_DISCONTINUITY');
 }
 function sample(time,{swingTargets={},modes={},boundaryPolicy='REJECT'}={}){
  if(!finite(time))throw new TypeError('POSE_TIME_INVALID');
  if(!swingTargets||typeof swingTargets!=='object'||Array.isArray(swingTargets)||!modes||typeof modes!=='object'||Array.isArray(modes))throw new TypeError('POSE_OPTIONS_INVALID');
  if(!['REJECT','DECLARE'].includes(boundaryPolicy))throw new TypeError('BOUNDARY_POLICY_INVALID');
  for(const k of [...Object.keys(swingTargets),...Object.keys(modes)])if(!identifiers.has(k))throw new TypeError(`UNKNOWN_LEG_${k}`);
  const original=clip.sample(time);
  if(original.joints.length!==skeleton.joints.length||original.joints.some((j,i)=>j.id!==skeleton.joints[i].id))throw new TypeError('CLIP_SKELETON_MISMATCH');
  const controls={};
  for(const j of skeleton.joints)if(j.constraint.kind==='HINGE')controls[j.id]=hingeControl(j,original.joint(j.id));
  const report=[];
  for(const d of defs){
   const current=d.contactTrack.sample(time),before=d.contactTrack.sample(time-1e-9),after=d.contactTrack.sample(time+1e-9);
   const boundary=before.phase!==after.phase||before.phase==='STANCE'&&after.phase==='STANCE'&&!closeVec(before.target,after.target,1e-8);
   if(boundary&&boundaryPolicy==='REJECT')throw new RangeError(`CONTACT_PHASE_BOUNDARY_DISCONTINUITY_${d.id}`);
   const hasSwing=Object.hasOwn(swingTargets,d.id);
   if(current.phase==='STANCE'&&hasSwing)throw new TypeError(`STANCE_SWING_OVERRIDE_CONFLICT_${d.id}`);
   if(current.phase==='SWING'&&!hasSwing)throw new TypeError(`SWING_TARGET_REQUIRED_${d.id}`);
   const target=current.phase==='STANCE'?current.target:vec(swingTargets[d.id],`SWING_TARGET_${d.id}`);
   const mode=modes[d.id]??'STRICT';if(!['STRICT','CLAMP'].includes(mode))throw new TypeError(`IK_MODE_INVALID_${d.id}`);
   const hipBase=original.joint(d.hipJoint).world,hipDef=names.get(d.hipJoint),kneeDef=names.get(d.kneeJoint);
   const solution=d.ik.solve({hip:hipBase.position,target,mode});
   const parentWorld=hipDef.parent===null?[0,0,0,1]:original.joint(hipDef.parent).world.rotation;
   const hipLocal=mul(conjugate(parentWorld),solution.upperRotation);
   controls[d.hipJoint]=mul(conjugate(hipDef.bindRotation),hipLocal);
   controls[d.kneeJoint]=mul(conjugate(kneeDef.bindRotation),solution.kneeRotation);
   report.push(freeze({id:d.id,phase:current.phase,reachable:solution.reachable,clampDistance:solution.clampDistance,boundaryDiscontinuity:boundary,target:freeze([...target]),foot:freeze([...solution.foot])}));
  }
  const pose=skeleton.samplePose({rootTranslation:original.rootTranslation,controls});
  for(const leg of report){const d=defs.find(x=>x.id===leg.id),foot=pose.joint(d.footJoint).world.position;if(!closeVec(foot,leg.foot))throw new RangeError(`POSE_FOOT_FK_MISMATCH_${d.id}`);}
  for(const j of skeleton.joints)if(!claimed.has(j.id)&&!closeVec(pose.joint(j.id).world.position,original.joint(j.id).world.position))throw new RangeError(`UNRELATED_JOINT_POSITION_DRIFT_${j.id}`);
  return freeze({pose,legs:freeze(report),loopDiscontinuities:freeze([...loopDiscontinuities])});
 }
 return freeze({legCount:defs.length,duration:clip.duration,loop:clip.loop,loopDiscontinuities:freeze([...loopDiscontinuities]),sample});
}
