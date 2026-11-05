import test from 'node:test';
import assert from 'node:assert/strict';
import {createTwoBoneIK,createContactTrack,solveGroundedLeg,IKMath} from './dgb.native-character-ik-contact.v1.mjs';
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const eq3=(a,b,tol=1e-7)=>a.forEach((x,i)=>near(x,b[i],tol));
function rig(){return createTwoBoneIK({upperLength:0.85,lowerLength:0.8,pole:[0,0,1]})}
test('3D two-bone solve preserves exact bone lengths, foot target and positive bend hemisphere',()=>{
  const ik=rig(),r=ik.solve({hip:[0,1.35,0],target:[0.4,0,0]});
  near(dist(r.hip,r.knee),0.85);near(dist(r.knee,r.foot),0.8);eq3(r.foot,r.target);
  assert.equal(r.reachable,true);assert.ok(r.knee[2]>0);
});
test('E3-compatible quaternions carry bind -Y axis onto both physical bone vectors',()=>{
  const r=rig().solve({hip:[0,1.3,0],target:[0.5,0,0]});
  const [R,Q]=[r.upperRotation,r.kneeRotation];
  const d1=IKMath.qRotate(R,[0,-0.85,0]);
  const d2=IKMath.qRotate(IKMath.qMul(R,Q),[0,-0.8,0]);
  eq3(d1,r.knee.map((x,i)=>x-r.hip[i]));eq3(d2,r.foot.map((x,i)=>x-r.knee[i]));
});
test('input and reach invalidities fail closed with no mutation',()=>{
  const ik=rig();
  assert.throws(()=>ik.solve({hip:[0,0,0],target:[0,3,0]}),/IK_TARGET_UNREACHABLE/);
  assert.throws(()=>ik.solve({hip:[0,0,0],target:[0,0,0]}),/IK_ZERO_DIRECTION/);
  assert.throws(()=>ik.solve({hip:[0,0,0],target:[0,1,0],mode:'AUTO'}),/IK_MODE_INVALID/);
  assert.throws(()=>createTwoBoneIK({upperLength:0,lowerLength:1}),/BONE_LENGTH_INVALID/);
  assert.throws(()=>createTwoBoneIK({upperLength:1,lowerLength:1,pole:[0,0,0]}),/POLE_DEGENERATE/);
});
test('unreachable target clamp is explicitly marked and honors maximum reach',()=>{
  const ik=rig(),r=ik.solve({hip:[0,1.2,0],target:[10,0,0],mode:'CLAMP'});
  assert.equal(r.reachable,false);assert.ok(r.clampDistance>0);
  near(dist(r.hip,r.foot),ik.maxReach);near(dist(r.knee,r.foot),0.8);
});
test('collinear pole is rejected, opposite bend pole selects other side',()=>{
  assert.throws(()=>createTwoBoneIK({upperLength:1,lowerLength:1,pole:[0,-1,0]}).solve({hip:[0,0,0],target:[0,-1,0]}),/POLE_PROJECTED_DEGENERATE/);
  const a=rig().solve({hip:[0,1.2,0],target:[0.35,0,0]});
  const b=createTwoBoneIK({upperLength:.85,lowerLength:.8,pole:[0,0,-1]}).solve({hip:[0,1.2,0],target:[0.35,0,0]});
  near(a.knee[2],-b.knee[2]);
});
test('STANCE fixes paw position against independent hip movement',()=>{
  const ik=rig(), track=createContactTrack({duration:2,groundY:0,intervals:[{start:0,end:0.55,target:[0.4,0,0]}]});
  const xs=[[0.0,1.3,0],[0.1,1.35,0],[0.2,1.3,0],[0.3,1.27,0]];
  for(const [i,hip] of xs.entries()) {
    const c=track.sample(i*0.1), r=solveGroundedLeg(ik,c,hip);eq3(r.foot,[0.4,0,0]);
    near(dist(r.knee,r.hip),.85);near(dist(r.foot,r.knee),.8);
  }
});
test('stance/swing temporal boundaries and normalized looping are deterministic',()=>{
  const c=createContactTrack({duration:2,loop:true,intervals:[
    {start:0,end:0.6,target:[0,0,0]},{start:1.2,end:2,target:[1,0,0]}
  ]});
  assert.equal(c.sample(0.4).phase,'STANCE');assert.equal(c.sample(0.6).phase,'SWING');
  assert.equal(c.sample(1.5).phase,'STANCE');assert.equal(c.sample(2.6).phase,'SWING');
  assert.deepEqual(c.sample(-0.5),c.sample(1.5));
});
test('contact track rejects overlapping intervals, non-ground foot, nonfinite times',()=>{
  const base={duration:2};
  assert.throws(()=>createContactTrack({...base,intervals:[{start:0,end:1,target:[0,0,0]},{start:0.8,end:1.2,target:[1,0,0]}]}),/CONTACT_OVERLAP/);
  assert.throws(()=>createContactTrack({...base,intervals:[{start:0,end:1,target:[0,1,0]}]}),/CONTACT_OFF_GROUND/);
  assert.throws(()=>createContactTrack({...base,intervals:[{start:-1,end:1,target:[0,0,0]}]}),/CONTACT_INTERVAL_INVALID/);
  const c=createContactTrack({...base,intervals:[]});assert.throws(()=>c.sample(NaN),/CONTACT_TIME_INVALID/);
});
test('IK outputs directly animate species-neutral FREE skeleton with no foot slip',()=>{
  const ik=rig();const s=createSkeleton([
    {id:'hip',constraint:{kind:'FREE'}},
    {id:'knee',parent:'hip',bindPosition:[0,-.85,0],constraint:{kind:'FREE'}},
    {id:'foot',parent:'knee',bindPosition:[0,-.8,0]}
  ]);
  const c=createContactTrack({duration:1,intervals:[{start:0,end:1,target:[.4,0,0]}]});
  for(let k=0;k<11;k++){
    const t=k/11,hip=[.04*k,1.32+0.02*Math.sin(k/11*Math.PI),0];
    const r=solveGroundedLeg(ik,c.sample(t),hip);
    const p=s.samplePose({rootTranslation:hip,controls:{hip:r.upperRotation,knee:r.kneeRotation}});
    eq3(p.joint('foot').world.position,c.sample(t).target,2e-7);
  }
});
test('same inputs produce identical frozen IK structures and bounds',()=>{
  const ik=rig();const q={hip:[0,1.2,0],target:[0.2,0,0]};
  const a=ik.solve(q),b=ik.solve(q);assert.deepEqual(a,b);assert.ok(Object.isFrozen(a.knee));
  assert.equal(Object.isFrozen(a),true);assert.throws(()=>ik.solve({hip:[0,Infinity,0],target:[0,0,0]}),/HIP_INVALID/);
});

// The adopted deterministic clips must retain continuity at every loop boundary.
import {createHingeClip} from './dgb.native-character-clips.v1.mjs';
const clipSkeleton=createSkeleton([
 {id:'root',constraint:{kind:'FIXED'}},
 {id:'hinge',parent:'root',bindPosition:[0,0,0],constraint:{kind:'HINGE',axis:[0,0,1],min:-2,max:2}}
]);
test('reject loop with different first and last hinge controls',()=>{
  assert.throws(()=>createHingeClip(clipSkeleton,{duration:1,loop:true,frames:[
  {time:0,controls:{hinge:0}},{time:1,controls:{hinge:1}}]}),/LOOP_SEAM_MISMATCH/);
});
test('reject loop that translates root across its wrap point',()=>{
  assert.throws(()=>createHingeClip(clipSkeleton,{duration:1,loop:true,frames:[
  {time:0,controls:{hinge:0},rootTranslation:[0,0,0]},
  {time:1,controls:{hinge:0},rootTranslation:[1,0,0]}]}),/LOOP_SEAM_MISMATCH/);
});
test('accept exact looping endpoint parity and sample it identically across periods',()=>{
  const clip=createHingeClip(clipSkeleton,{duration:1,loop:true,frames:[
    {time:0,controls:{hinge:0},rootTranslation:[0,0,0]},
    {time:.5,controls:{hinge:1},rootTranslation:[0.1,0,0]},
    {time:1,controls:{hinge:0},rootTranslation:[0,0,0]}]});
  assert.deepEqual(clip.sample(0).joints,clip.sample(1).joints);
  assert.deepEqual(clip.sample(0.25).joints,clip.sample(1.25).joints);
});

test('saved pole/stance coordinates are isolated from mutable caller arrays',()=>{
  const pole=[0,0,1], foot=[.25,0,0];
  const ik=createTwoBoneIK({upperLength:.85,lowerLength:.8,pole});
  const track=createContactTrack({duration:1,intervals:[{start:0,end:1,target:foot}]});
  pole[2]=-1;foot[0]=9;
  const out=solveGroundedLeg(ik,track.sample(.25),[0,1.2,0]);
  near(out.foot[0],.25);
  assert.ok(out.knee[2]>0);
  assert.ok(Object.isFrozen(track.sample(.25).target));
});

test('contact intervals preserve strict half-open semantics and reject unordered entries',()=>{
  const track=createContactTrack({duration:2,intervals:[{start:0,end:1,target:[0,0,0]},{start:1,end:2,target:[1,0,0]}]});
  eq3(track.sample(.999).target,[0,0,0]);
  eq3(track.sample(1).target,[1,0,0]);
  assert.equal(track.sample(2).phase,'SWING');
  assert.throws(()=>createContactTrack({duration:2,intervals:[{start:1,end:2,target:[1,0,0]},{start:0,end:1,target:[0,0,0]}]}),/CONTACT_OVERLAP/);
});

test('IK clamping rejects physically unreachable solve in strict mode',()=>{
  const ik=createTwoBoneIK({upperLength:1,lowerLength:.6,pole:[0,0,1]});
  assert.throws(()=>ik.solve({hip:[0,0,0],target:[.1,0,0]}),/IK_TARGET_UNREACHABLE/);
  const s=ik.solve({hip:[0,0,0],target:[.1,0,0],mode:'CLAMP'});
  assert.equal(s.reachable,false);
  near(dist(s.hip,s.foot),ik.minReach);
});
