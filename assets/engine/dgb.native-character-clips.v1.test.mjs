import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
import {createHingeClip} from './dgb.native-character-clips.v1.mjs';
const near = (a, b, tolerance = 1e-10) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`);
const rig = () => createSkeleton([
  {id:'root', constraint:{kind:'FIXED'}},
  {id:'hinge', parent:'root', bindPosition:[1,0,0], constraint:{kind:'HINGE', axis:[0,0,1], min:-2, max:2}},
  {id:'paw', parent:'hinge', bindPosition:[1,0,0], constraint:{kind:'HINGE', axis:[0,0,1], min:-2, max:2}}
]);
const frames = () => [
  {time:0,controls:{hinge:0},rootTranslation:[0,0,0]},
  {time:0.5,controls:{hinge:1},rootTranslation:[1,2,3]},
  {time:1,controls:{hinge:0},rootTranslation:[0,0,0]}
];
test('exact endpoint bind and key controls', () => {
  const s=rig(), c=createHingeClip(s,{duration:1,frames:frames()});
  assert.deepEqual(c.sample(0).joints,s.samplePose().joints);
  near(c.sample(.5).joint('hinge').local.rotation[2],Math.sin(.5));
  assert.deepEqual(c.sample(1).rootTranslation,[0,0,0]);
});
test('smoothstep interpolation for hinge angle and root position',()=>{
  const c=createHingeClip(rig(),{duration:1,frames:frames()}),p=c.sample(.25);
  near(p.joint('hinge').local.rotation[2],Math.sin(.25));
  near(p.rootTranslation[0],.5);near(p.rootTranslation[1],1);near(p.rootTranslation[2],1.5);
});
test('non-looping time clamps both ends',()=>{
  const c=createHingeClip(rig(),{duration:1,frames:frames()});
  assert.deepEqual(c.sample(-7).joints,c.sample(0).joints);
  assert.deepEqual(c.sample(200).joints,c.sample(1).joints);
});
test('loop endpoint parity and period-equivalent samples',()=>{
  const c=createHingeClip(rig(),{duration:1,frames:frames(),loop:true});
  assert.deepEqual(c.sample(0).joints,c.sample(1).joints);
  assert.deepEqual(c.sample(.25).joints,c.sample(1.25).joints);
  assert.deepEqual(c.sample(-.75).joints,c.sample(.25).joints);
});
test('cyclic terminal hinge mismatch rejects rather than teleporting',()=>{
  const f=frames();f[2].controls.hinge=0.01;
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f,loop:true}),/LOOP_SEAM_MISMATCH/);
});
test('cyclic terminal root mismatch rejects rather than teleporting',()=>{
  const f=frames();f[2].rootTranslation[0]=.01;
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f,loop:true}),/LOOP_SEAM_MISMATCH/);
});
test('cyclic endpoint tolerance is bounded and explicit',()=>{
  const f=frames();f[2].controls.hinge=1e-10;f[2].rootTranslation[1]=1e-10;
  createHingeClip(rig(),{duration:1,frames:f,loop:true});
  f[2].controls.hinge=1e-6;
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f,loop:true}),/LOOP_SEAM_MISMATCH/);
});
test('invalid durations, insufficient frames and nonboolean loop reject',()=>{
  for(const duration of [0,-1,NaN,Infinity,'1'])
    assert.throws(()=>createHingeClip(rig(),{duration,frames:frames()}),/CLIP_SCHEMA_INVALID/);
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:[frames()[0]]}),/CLIP_SCHEMA_INVALID/);
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:frames(),loop:'true'}),/CLIP_SCHEMA_INVALID/);
});
test('invalid key ordering, duplicates and missing endpoints reject',()=>{
  const r=rig();
  for(const f of [[{time:.2,controls:{}},{time:1,controls:{}}],
    [{time:0,controls:{}},{time:0,controls:{}},{time:1,controls:{}}],
    [{time:0,controls:{}},{time:.8,controls:{}}]])
    assert.throws(()=>createHingeClip(r,{duration:1,frames:f}),/KEY_TIMES_NOT_STRICTLY_ORDERED/);
});
test('invalid or nonfinite key times and sample times reject',()=>{
  const f=frames();f[1].time=NaN;
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f}),/KEY_TIME_INVALID/);
  const c=createHingeClip(rig(),{duration:1,frames:frames()});
  for(const t of [NaN,Infinity,-Infinity,'0'])assert.throws(()=>c.sample(t),/SAMPLE_TIME_INVALID/);
});
test('unknown, fixed and free joint control tracks reject',()=>{
  const s=createSkeleton([{id:'root',constraint:{kind:'FREE'}},{id:'joint',parent:'root',constraint:{kind:'HINGE',axis:[0,0,1],min:-1,max:1}}]);
  for(const id of ['unknown','root'])
    assert.throws(()=>createHingeClip(s,{duration:1,frames:[{time:0,controls:{[id]:0}},{time:1,controls:{[id]:0}}]}),/HINGE_TRACK_INVALID/);
});
test('nonfinite and out-of-range hinge controls reject',()=>{
  const f=frames();f[1].controls.hinge=NaN;
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f}),/HINGE_TRACK_INVALID/);
  f[1].controls.hinge=4;
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f}),/HINGE_ANGLE_REJECTED/);
});
test('invalid root translation and malformed controls reject',()=>{
  const f=frames();f[1].rootTranslation=[1,NaN,0];
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f}),/ROOT_TRANSLATION_INVALID/);
  f[1].rootTranslation=[0,0,0];f[1].controls=[];
  assert.throws(()=>createHingeClip(rig(),{duration:1,frames:f}),/KEY_CONTROLS_INVALID/);
});
test('omitted hinge controls imply validated zero while other tracks interpolate',()=>{
  const c=createHingeClip(rig(),{duration:1,frames:[
    {time:0,controls:{hinge:0,paw:1}},
    {time:1,controls:{hinge:1}}
  ]});
  near(c.sample(.5).joint('paw').local.rotation[2],Math.sin(.25));
});
test('clip is immutable and defensively copies user keyframes',()=>{
  const f=frames(),c=createHingeClip(rig(),{duration:1,frames:f,loop:true});
  const before=c.sample(.25).joints;
  f[1].controls.hinge=-2;f[1].rootTranslation[0]=999;f[1].time=.3;
  assert.deepEqual(c.sample(.25).joints,before);
  assert.ok(Object.isFrozen(c));
  assert.throws(()=>{c.duration=100},TypeError);
});
test('different articulated wing topology uses same clip API',()=>{
  const s=createSkeleton([{id:'body'},{id:'wing',parent:'body',constraint:{kind:'HINGE',axis:[0,1,0],min:-1,max:1}}]);
  const c=createHingeClip(s,{duration:2,frames:[{time:0,controls:{wing:0}},{time:2,controls:{wing:1}}]});
  near(c.sample(1).joint('wing').local.rotation[1],Math.sin(.25));
});
