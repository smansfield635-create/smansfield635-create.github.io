import test from 'node:test';
import assert from 'node:assert/strict';
import {createGaitCoordinator} from './dgb.native-character-gait-coordinator.v1.mjs';
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
import {createSkinnedMesh} from './dgb.native-character-skinning.v1.mjs';
import {createHingeClip} from './dgb.native-character-clips.v1.mjs';
import {createTwoBoneIK} from './dgb.native-character-ik-contact.v1.mjs';

const near=(a,b,eps=3e-6)=>assert.ok(Math.abs(a-b)<=eps,String(a)+' != '+String(b));
const near3=(a,b,eps=3e-6)=>a.forEach((x,i)=>near(x,b[i],eps));
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
function fixture(n=4,loop=true){
 const joints=[{id:'root'},{id:'trunk',parent:'root',
   constraint:{kind:'HINGE',axis:[0,1,0],min:-.6,max:.6}}],legs=[];
 for(let i=0;i<n;i++){
  const x=(i%2?1:-1)*.52,z=Math.floor(i/2)*.55;
  joints.push({id:'hip'+i,parent:'trunk',bindPosition:[x,0,z],constraint:{kind:'FREE'}},
   {id:'knee'+i,parent:'hip'+i,bindPosition:[0,-.85,0],constraint:{kind:'FREE'}},
   {id:'foot'+i,parent:'knee'+i,bindPosition:[0,-.8,0]});
  const A=[x-.07,0,z],B=[x+.07,0,z];
  const contacts=i%2?
    [{start:0,end:.18,target:B},{start:.35,end:.64,target:A},{start:.81,end:1,target:B}]:
    [{start:.1,end:.35,target:A},{start:.6,end:.85,target:B}];
  const item={id:'leg'+i,hipJoint:'hip'+i,kneeJoint:'knee'+i,footJoint:'foot'+i,
    ik:createTwoBoneIK({upperLength:.85,lowerLength:.8,pole:[0,0,1]}),contacts};
  if(!loop&&i%2===0){item.startTarget=[x-.16,0,z];item.endTarget=[x+.16,0,z];}
  legs.push(item);
 }
 const skeleton=createSkeleton(joints);
 const clip=createHingeClip(skeleton,{duration:1,loop,frames:[
  {time:0,controls:{trunk:0},rootTranslation:[0,1.2,0]},
  {time:.5,controls:{trunk:.2},rootTranslation:[.04,1.23,-.01]},
  {time:1,controls:{trunk:0},rootTranslation:[0,1.2,0]}]});
 return {skeleton,clip,legs};
}
const make=f=>createGaitCoordinator(f.skeleton,{clip:f.clip,legs:f.legs});

test('two and four legs: deterministic alternating phases and actual pose-composer foot targets',()=>{
 for(const n of [2,4]){
  const f=fixture(n),c=make(f);
  assert.equal(c.legCount,n);
  assert.equal(c.plan(.04).legs[0].phase,'SWING');
  assert.equal(c.plan(.04).legs[1].phase,'STANCE');
  for(const t of [.01,.04,.2,.3,.45,.55,.7,.9,.99]){
   const a=c.sample(t),b=c.sample(t);
   assert.deepEqual(a.legs,b.legs);assert.deepEqual(a.plan,b.plan);
   for(let i=0;i<n;i++){
    assert.equal(a.legs[i].phase,a.plan.legs[i].phase);
    near3(a.pose.joint('foot'+i).world.position,a.plan.legs[i].target);
   }
  }
 }
});
test('stance anchors stay world-locked while clip root translates and trunk rotates',()=>{
 const f=fixture(),c=make(f),before=c.sample(.11),after=c.sample(.33);
 for(const t of [.11,.22,.33]){
  const s=c.sample(t);near3(s.pose.joint('foot0').world.position,[-.59,0,0]);
  assert.equal(s.legs[0].reachable,true);
 }
 assert.ok(distance(before.pose.rootTranslation,after.pose.rootTranslation)>0);
 const original=f.clip.sample(.33).joint('trunk').world.rotation;
 const preserved=after.pose.joint('trunk').world.rotation;
 original.forEach((x,i)=>near(x,preserved[i],1e-8));
});
test('takeoff/touchdown continuity, positive swing apex, and explicit phase diagnostics',()=>{
 const c=make(fixture());
 near3(c.plan(.35).legs[0].target,[-.59,0,0]);
 near3(c.plan(.6).legs[0].target,[-.45,0,0]);
 near(c.plan(.475).legs[0].target[1],.12);
 for(const t of [.35,.6]){
  assert.ok(distance(c.plan(t-1e-8).legs[0].target,c.plan(t+1e-8).legs[0].target)<1e-6);
 }
 assert.throws(()=>c.sample(.35),/CONTACT_PHASE_BOUNDARY_DISCONTINUITY/);
 const declared=c.sample(.35,{boundaryPolicy:'DECLARE'});
 assert.ok(declared.legs.some(x=>x.boundaryDiscontinuity));
 near3(declared.pose.joint('foot0').world.position,[-.59,0,0]);
});
test('loop C0 is exact at 0, period, negative period and across the seam',()=>{
 const c=make(fixture());
 for(const t of [1,2,-1])assert.deepEqual(c.plan(t),c.plan(0));
 assert.equal(c.plan(0).legs[0].phase,'SWING');
 assert.equal(c.plan(0).legs[1].phase,'STANCE');
 for(let i=0;i<4;i++)
  assert.ok(distance(c.plan(1-1e-8).legs[i].target,c.plan(1e-8).legs[i].target)<1e-6);
 assert.deepEqual(c.sample(0).legs,c.sample(1).legs);
});
test('adopted CPU skinning receives genuinely composed four-foot pose',()=>{
 const f=fixture(),bind=f.skeleton.samplePose();
 const mesh=createSkinnedMesh(f.skeleton,{vertices:f.legs.map((_,i)=>bind.joint('foot'+i).world.position),
  influences:f.legs.map((_,i)=>[{joint:'foot'+i,weight:1}])});
 const s=make(f).sample(.45),vertices=mesh.deform(s.pose);
 for(let i=0;i<4;i++)near3(vertices[i],s.plan.legs[i].target);
 assert.ok(Object.isFrozen(vertices));
});
test('nonloop endpoints declared explicitly, no out-of-duration extrapolation',()=>{
 const f=fixture(2,false),c=make(f);
 for(const t of [0,.04,.22,.45,.75,.9,1]){
  const s=c.sample(t,{boundaryPolicy:'DECLARE'});
  for(let i=0;i<2;i++)near3(s.pose.joint('foot'+i).world.position,s.plan.legs[i].target);
 }
 near3(c.plan(1).legs[0].target,[-.36,0,0]);
 assert.throws(()=>c.plan(1.001),/GAIT_TIME_INVALID/);
});
test('immutability and deterministic replay survive caller anchor modification',()=>{
 const f=fixture(2),c=make(f),a=c.plan(.22),original=a.legs[0].target[0];
 f.legs[0].contacts[0].target[0]=100;
 near(c.plan(.22).legs[0].target[0],original);
 assert.deepEqual(c.plan(.22),a);
 assert.ok(Object.isFrozen(a));assert.ok(Object.isFrozen(a.legs[0].target));
 assert.throws(()=>{a.legs[0].target[0]=42;},TypeError);
});
test('invalid schedule, ground, seam, step, identifiers, clearance and times fail closed',()=>{
 const f=fixture(2);
 const build=(a,b=f.legs[1])=>createGaitCoordinator(f.skeleton,{clip:f.clip,legs:[a,b]});
 assert.throws(()=>build(f.legs[0],{...f.legs[1],id:f.legs[0].id}),/LEG_ID_INVALID/);
 assert.throws(()=>build({...f.legs[0],contacts:[{start:.1,end:.6,target:[-.59,0,0]},
   {start:.3,end:.85,target:[-.45,0,0]}]}),/CONTACT_OVERLAP/);
 assert.throws(()=>build({...f.legs[0],contacts:[{start:.1,end:.35,target:[-.59,.1,0]},
   ...f.legs[0].contacts.slice(1)]}),/CONTACT_OFF_GROUND/);
 assert.throws(()=>build({...f.legs[0],contacts:[{start:0,end:.35,target:[-.59,0,0]},
   ...f.legs[0].contacts.slice(1)]}),/CONTACT_LOOP_PHASE_SEAM/);
 const first=f.legs[0].contacts[0].target;
 assert.throws(()=>build({...f.legs[0],contacts:f.legs[0].contacts.map((x,i)=>({...x,
   target:i===1?first:x.target}))}),/ZERO_LENGTH_SWING_STEP/);
 assert.throws(()=>createGaitCoordinator(f.skeleton,{clip:f.clip,legs:f.legs,clearance:0}),/GROUND_OR_CLEARANCE_INVALID/);
 assert.throws(()=>make(f).plan(NaN),/GAIT_TIME_INVALID/);
 assert.throws(()=>make(f).sample(.2,{modes:{missing:'CLAMP'}}),/UNKNOWN_LEG/);
});
test('default STRICT reach rejects, opt-in CLAMP visibly reports miss',()=>{
 const f=fixture(2),far={...f.legs[0],contacts:f.legs[0].contacts.map((x,i)=>({...x,
   target:[100+i*.14,0,0]}))};
 const c=createGaitCoordinator(f.skeleton,{clip:f.clip,legs:[far,f.legs[1]]});
 assert.throws(()=>c.sample(.2),/IK_TARGET_UNREACHABLE/);
 const s=c.sample(.2,{modes:{leg0:'CLAMP'}});
 assert.equal(s.legs[0].reachable,false);
 assert.ok(s.legs[0].clampDistance>98);
 assert.equal(s.legs[1].reachable,true);
});

// Gen3127 corrective regressions for the exact Gen3122 negative evidence.
test('prototype-reserved leg IDs have own swing targets and compose without inherited modes',()=>{
  for(const reserved of ['__proto__','constructor','toString']){
    const f=fixture(2),legs=f.legs.map((item,i)=>({...item,id:i===0?reserved:'other_leg'}));
    const c=createGaitCoordinator(f.skeleton,{clip:f.clip,legs});
    const p=c.plan(.04);
    assert.ok(Object.hasOwn(p.swingTargets,reserved));
    assert.equal(p.legs[0].phase,'SWING');
    assert.equal(Object.getPrototypeOf(p.swingTargets),null);
    const s=c.sample(.04);
    near3(s.pose.joint('foot0').world.position,p.swingTargets[reserved]);
    assert.equal(s.legs[0].id,reserved);
    const explicit=Object.create(null);explicit[reserved]='STRICT';
    assert.deepEqual(c.sample(.04,{modes:explicit}).legs,s.legs);
  }
});
test('inherited caller modes are not silently treated as leg settings',()=>{
  const f=fixture(2),legs=f.legs.map((item,i)=>({...item,id:i===0?'constructor':'other_leg'}));
  const c=createGaitCoordinator(f.skeleton,{clip:f.clip,legs});
  const inherited=Object.create({constructor:'CLAMP'});
  assert.deepEqual(c.sample(.04,{modes:inherited}).legs,c.sample(.04).legs);
  assert.throws(()=>c.sample(.04,{modes:{other_leg:'INVALID'}}),/IK_MODE_INVALID/);
  assert.throws(()=>c.sample(.04,{modes:{not_a_leg:'CLAMP'}}),/UNKNOWN_LEG/);
  assert.throws(()=>c.sample(.04,{modes:[]}),/GAIT_MODES_INVALID/);
});
test('finite but huge opposing contact anchors reject overflowing swing step',()=>{
  const f=fixture(2),contacts=f.legs[0].contacts.map((entry,i)=>({...entry,
    target:[i===0?-1e308:1e308,0,0]}));
  assert.throws(()=>createGaitCoordinator(f.skeleton,{clip:f.clip,
    legs:[{...f.legs[0],contacts},f.legs[1]]}),/SWING_STEP_NONFINITE/);
});
test('finite ground and clearance that overflow at swing apex reject',()=>{
  const f=fixture(2),y=1e308;
  const legs=f.legs.map(item=>({...item,contacts:item.contacts.map(x=>({...x,
    target:[x.target[0],y,x.target[2]]}))}));
  assert.throws(()=>createGaitCoordinator(f.skeleton,{clip:f.clip,legs,groundY:y,
    clearance:1e308}),/SWING_CLEARANCE_NONFINITE/);
});
test('unsupported extreme duration is rejected before unsafe loop normalization',()=>{
  const f=fixture(2),clip={...f.clip,duration:Number.MAX_VALUE};
  assert.throws(()=>createGaitCoordinator(f.skeleton,{clip,legs:f.legs}),/GAIT_DURATION_RANGE_INVALID/);
});
