import test from 'node:test';
import assert from 'node:assert/strict';
import {createPoseComposer} from './dgb.native-character-pose-composer.v1.mjs';
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
import {createHingeClip} from './dgb.native-character-clips.v1.mjs';
import {createTwoBoneIK,createContactTrack} from './dgb.native-character-ik-contact.v1.mjs';
import {createSkinnedMesh} from './dgb.native-character-skinning.v1.mjs';
const close=(a,b,eps=3e-6)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const near3=(a,b,eps)=>a.forEach((x,i)=>close(x,b[i],eps));
function fixture(n=2,{contacts=true,move=true}={}){
 const joints=[{id:'root'}, {id:'trunk',parent:'root',constraint:{kind:'HINGE',axis:[0,1,0],min:-.6,max:.6}}];
 const legs=[];
 for(let i=0;i<n;i++){
  const side=i%2===0?-1:1,row=Math.floor(i/2),x=side*.52,z=row*.55;
  const hip=`hip${i}`,knee=`knee${i}`,foot=`foot${i}`;
  joints.push({id:hip,parent:'trunk',bindPosition:[x,0,z],constraint:{kind:'FREE'}},
  {id:knee,parent:hip,bindPosition:[0,-.85,0],constraint:{kind:'FREE'}},
  {id:foot,parent:knee,bindPosition:[0,-.8,0]});
  legs.push({id:`leg${i}`,hipJoint:hip,kneeJoint:knee,footJoint:foot,
   ik:createTwoBoneIK({upperLength:.85,lowerLength:.8,pole:[0,0,1]}),
   contactTrack:createContactTrack({duration:1,loop:true,intervals:contacts?[{start:0,end:1,target:[x,0,z]}]:[]})});
 }
 const skeleton=createSkeleton(joints);
 const frames=[{time:0,controls:{trunk:0},rootTranslation:[0,1.2,0]},
 {time:.5,controls:{trunk:move?.2:0},rootTranslation:move?[.09,1.24,-.03]:[0,1.2,0]},
 {time:1,controls:{trunk:0},rootTranslation:[0,1.2,0]}];
 const clip=createHingeClip(skeleton,{duration:1,frames,loop:true});
 return {skeleton,clip,legs};
}
test('two legs: planted feet stay locked while trunk rotates and root translates',()=>{
 const f=fixture(),c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 for(const t of [0,.1,.25,.5,.75,.9]){
  const s=c.sample(t),p=s.pose;
  near3(p.joint('foot0').world.position,[-.52,0,0]);near3(p.joint('foot1').world.position,[.52,0,0]);
  assert.equal(s.legs.length,2);assert.equal(s.legs[0].phase,'STANCE');
  assert.equal(s.legs[0].reachable,true);
 }
});
test('four legs: species-neutral distinct chains solve without joint conflict',()=>{
 const f=fixture(4),c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 for(const t of [.15,.5,.85]){const s=c.sample(t);for(let i=0;i<4;i++){
  const x=i%2===0?-.52:.52,z=Math.floor(i/2)*.55;
  near3(s.pose.joint(`foot${i}`).world.position,[x,0,z]);
 }}
 assert.equal(c.legCount,4);
});
test('nonleg hinge clip local rotation and world positions remain exact',()=>{
 const f=fixture(),c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 const orig=f.clip.sample(.31),out=c.sample(.31).pose;
 near3(out.joint('trunk').world.position,orig.joint('trunk').world.position);
 out.joint('trunk').world.rotation.forEach((v,i)=>close(v,orig.joint('trunk').world.rotation[i]));
 assert.deepEqual(out.rootTranslation,orig.rootTranslation);
});
test('composed pose drives adopted CPU skinning exactly at foot vertices',()=>{
 const f=fixture(2),bind=f.skeleton.samplePose();
 const vertices=[bind.joint('foot0').world.position,bind.joint('foot1').world.position];
 const mesh=createSkinnedMesh(f.skeleton,{vertices,influences:[[{joint:'foot0',weight:1}],[{joint:'foot1',weight:1}]]});
 const sampled=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs}).sample(.5).pose;
 const verts=mesh.deform(sampled);near3(verts[0],[-.52,0,0]);near3(verts[1],[.52,0,0]);
 assert.ok(Object.isFrozen(verts));
});
test('swing without explicit target rejects; supplied swing target is honored',()=>{
 const f=fixture(2,{contacts:false});const c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 assert.throws(()=>c.sample(.25),/SWING_TARGET_REQUIRED/);
 const target={leg0:[-.45,.08,0],leg1:[.45,.1,0]};
 const s=c.sample(.25,{swingTargets:target});near3(s.pose.joint('foot0').world.position,target.leg0);
 near3(s.pose.joint('foot1').world.position,target.leg1);assert.equal(s.legs[0].phase,'SWING');
});
test('stance target replacement is rejected rather than overwriting foot contact',()=>{
 const f=fixture(),c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 assert.throws(()=>c.sample(.3,{swingTargets:{leg0:[-1,0,0]}}),/STANCE_SWING_OVERRIDE_CONFLICT/);
});
test('unreachable target fails strict, clamp is explicit and marked',()=>{
 const f=fixture(2,{contacts:false}),c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 const swingTargets={leg0:[100,0,0],leg1:[.52,0,0]};
 assert.throws(()=>c.sample(.2,{swingTargets}),/IK_TARGET_UNREACHABLE/);
 const out=c.sample(.2,{swingTargets,modes:{leg0:'CLAMP'}});
 assert.equal(out.legs[0].reachable,false);assert.ok(out.legs[0].clampDistance>98);
 assert.equal(out.legs[1].reachable,true);
});
test('wrong leg chain topology or bind-axis mismatch fails closed',()=>{
 const f=fixture(2);const bad={...f.legs[0],footJoint:'trunk'};
 assert.throws(()=>createPoseComposer(f.skeleton,{clip:f.clip,legs:[bad]}),/LEG_CHAIN_INVALID/);
 const sk=createSkeleton([{id:'root'},{id:'hip',parent:'root',constraint:{kind:'FREE'}},{id:'knee',parent:'hip',bindPosition:[1,0,0],constraint:{kind:'FREE'}},{id:'foot',parent:'knee',bindPosition:[0,-.8,0]}]);
 const cl=createHingeClip(sk,{duration:1,loop:true,frames:[{time:0,controls:{}},{time:1,controls:{}}]});
 assert.throws(()=>createPoseComposer(sk,{clip:cl,legs:[{...f.legs[0],hipJoint:'hip',kneeJoint:'knee',footJoint:'foot'}]}),/LEG_BIND_AXIS_OR_LENGTH_MISMATCH/);
});
test('overlapping joint ownership and duplicate leg identifiers reject',()=>{
 const f=fixture(),copy={...f.legs[0],id:'other'};
 assert.throws(()=>createPoseComposer(f.skeleton,{clip:f.clip,legs:[f.legs[0],copy]}),/LEG_JOINT_CONFLICT/);
 assert.throws(()=>createPoseComposer(f.skeleton,{clip:f.clip,legs:[f.legs[0],f.legs[0]]}),/LEG_ID_INVALID/);
});
test('mismatched phase duration and loop status reject',()=>{
 const f=fixture(2);const broken={...f.legs[0],contactTrack:createContactTrack({duration:2,intervals:[]})};
 assert.throws(()=>createPoseComposer(f.skeleton,{clip:f.clip,legs:[broken]}),/CONTACT_CLIP_DURATION_OR_LOOP_MISMATCH/);
});
test('loop seam mismatched contact phase rejects or must explicitly declare',()=>{
 const f=fixture(2);const broken={...f.legs[0],contactTrack:createContactTrack({duration:1,loop:true,intervals:[{start:0,end:.5,target:[-.52,0,0]}]})};
 assert.throws(()=>createPoseComposer(f.skeleton,{clip:f.clip,legs:[broken]}),/CONTACT_LOOP_SEAM_DISCONTINUITY/);
 const c=createPoseComposer(f.skeleton,{clip:f.clip,legs:[broken],loopPolicy:'DECLARE'});
 assert.deepEqual(c.loopDiscontinuities,['leg0']);
 assert.throws(()=>c.sample(.5,{swingTargets:{leg0:[-.52,.1,0]}}),/CONTACT_PHASE_BOUNDARY_DISCONTINUITY/);
 const out=c.sample(.5,{swingTargets:{leg0:[-.52,.1,0]},boundaryPolicy:'DECLARE'});
 assert.equal(out.legs[0].boundaryDiscontinuity,true);
});
test('same input produces frozen repeated composited pose without caller mutation',()=>{
 const f=fixture(4),c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 const a=c.sample(.37),b=c.sample(.37);assert.deepEqual(a.pose.joints,b.pose.joints);
 assert.deepEqual(a.legs,b.legs);assert.ok(Object.isFrozen(a.pose));assert.ok(Object.isFrozen(a.legs[0].foot));
 assert.throws(()=>{a.legs[0].foot[0]=23},TypeError);
});
test('invalid times, undeclared legs, invalid modes and malformed options reject',()=>{
 const f=fixture(),c=createPoseComposer(f.skeleton,{clip:f.clip,legs:f.legs});
 assert.throws(()=>c.sample(NaN),/POSE_TIME_INVALID/);
 assert.throws(()=>c.sample(.2,{modes:{foo:'CLAMP'}}),/UNKNOWN_LEG/);
 assert.throws(()=>c.sample(.2,{modes:{leg0:'AUTO'}}),/IK_MODE_INVALID/);
 assert.throws(()=>c.sample(.2,{swingTargets:[]}),/POSE_OPTIONS_INVALID/);
});
