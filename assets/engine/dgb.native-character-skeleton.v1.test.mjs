import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
const close=(a,b,eps=1e-10)=>assert.ok(Math.abs(a-b)<=eps,`${a} != ${b}`);
const rabbit=()=>createSkeleton([
  {id:'hip',bindPosition:[0,0,0],constraint:{kind:'FREE'}},
  {id:'thigh',parent:'hip',bindPosition:[1,0,0],constraint:{kind:'HINGE',axis:[0,0,1],min:-Math.PI/2,max:Math.PI/2}},
  {id:'paw',parent:'thigh',bindPosition:[1,0,0],constraint:{kind:'HINGE',axis:[0,0,1],min:-Math.PI,max:Math.PI}},
]);
test('rabbit leg: articulated rotation affects downstream paw position',()=>{
  const s=rabbit();const r=s.samplePose({controls:{thigh:Math.PI/2}});
  close(r.joint('paw').world.position[0],1);
  close(r.joint('paw').world.position[1],1);
});
test('root translation keeps local pose while shifting all world positions',()=>{
  const s=rabbit();const a=s.samplePose(),b=s.samplePose({rootTranslation:[0,3,-6]});
  for(let i=0;i<3;i++)for(let k=0;k<3;k++)close(b.joints[i].world.position[k]-a.joints[i].world.position[k],[0,3,-6][k]);
});
test('bird wing: same library supports alternate topology and free rotation',()=>{
  const s=createSkeleton([
    {id:'body'},
    {id:'shoulder',parent:'body',bindPosition:[0.2,0,0],constraint:{kind:'HINGE',axis:[0,0,1],min:-1,max:1}},
    {id:'wingtip',parent:'shoulder',bindPosition:[1,0,0],constraint:{kind:'FREE'}},
  ]);
  const up=s.samplePose({controls:{shoulder:0.8,wingtip:[0,Math.sin(0.2),0,Math.cos(0.2)]}});
  assert.ok(up.joint('wingtip').world.position[1]>0.7);
  assert.equal(up.joints.length,3);
});
test('repeated samples deterministic and previous returned pose immutable',()=>{
  const s=rabbit(),spec={rootTranslation:[1,2,3],controls:{thigh:0.33,paw:-0.7}};
  const a=s.samplePose(spec),b=s.samplePose(spec);
  assert.deepEqual(a.joints,b.joints);
  assert.ok(Object.isFrozen(a.joints[1].world.position));
  assert.throws(()=>a.joints[1].world.position[0]=100,TypeError);
  close(a.joint('paw').world.position[0],b.joint('paw').world.position[0]);
});
test('reject out of range hinge and nonfinite input',()=>{
  const s=rabbit();
  assert.throws(()=>s.samplePose({controls:{thigh:Math.PI}}),/HINGE_ANGLE_REJECTED/);
  assert.throws(()=>s.samplePose({controls:{thigh:Infinity}}),/HINGE_ANGLE_REJECTED/);
  assert.throws(()=>s.samplePose({rootTranslation:[NaN,0,0]}),/ROOT_TRANSLATION_INVALID/);
});
test('reject malformed skeletons, duplicates, unordered parenting and cycles',()=>{
  assert.throws(()=>createSkeleton([{id:'a'},{id:'a'}]),/DUPLICATE/);
  assert.throws(()=>createSkeleton([{id:'child',parent:'root'},{id:'root'}]),/PARENT_MUST_PRECEDE/);
  assert.throws(()=>createSkeleton([{id:'a',parent:'a'}]),/PARENT_MUST_PRECEDE/);
  assert.throws(()=>createSkeleton([{id:'a'},{id:'b'}]),/SINGLE_ROOT/);
});
test('reject bad free rotation or fixed joint control',()=>{
  const s=rabbit();
  assert.throws(()=>s.samplePose({controls:{hip:[0,0,0,0]}}),/ZERO/);
  assert.throws(()=>s.samplePose({controls:{foo:1}}),/UNKNOWN_JOINT/);
  const fixed=createSkeleton([{id:'root'}]);
  assert.throws(()=>fixed.samplePose({controls:{root:0}}),/FIXED_JOINT_CONTROL/);
});
test('bind rotation propagated through hierarchy',()=>{
  const r=createSkeleton([
    {id:'root',bindRotation:[0,0,Math.SQRT1_2,Math.SQRT1_2]},
    {id:'child',parent:'root',bindPosition:[2,0,0]},
  ]).samplePose();
  close(r.joint('child').world.position[0],0);
  close(r.joint('child').world.position[1],2);
});
