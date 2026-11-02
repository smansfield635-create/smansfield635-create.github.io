import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url);
const load=async profile=>{
 const before=process.env.H_EARTH_COMPARISON_PROFILE;
 process.env.H_EARTH_COMPARISON_PROFILE=profile;
 try{return await import(src.href+'?profile='+encodeURIComponent(profile));}
 finally{if(before===undefined)delete process.env.H_EARTH_COMPARISON_PROFILE;else process.env.H_EARTH_COMPARISON_PROFILE=before;}
};
const original={
 baseline:'7a21f465fc58cc1dbdda02a3807a4bf344440589',
 candidate:'7d55ca9707bfef75a9ddf9fb078747ba79eef19a'
};
const modes=['reference-lit','before-groundcover-unlit','after-groundcover-unlit','groundcover-weight-raw'];
test('frozen inland observer reuses already positive Gen2917/Gen2925 view',async()=>{
 const m=await load('INLAND_BAND_BASELINE_ONLY_V1');
 assert.equal(m.G1_PROFILE,true);assert.equal(m.INLAND_BAND_PROFILE,true);
 assert.equal(m.G1_ACTIVE_LABEL,'baseline');
 assert.deepEqual(m.HEADS,{baseline:original.baseline});
 assert.deepEqual(m.G1_POSES,[{name:'inland-seam-near',x:-200,y:18.361431,z:-728,yaw:0,pitch:-14,diagnosticObserver:true}]);
 assert.deepEqual(m.G1_MODES,modes);
 assert.deepEqual(Object.keys(m.parseArgs(['--baseline-dir','/tmp/base','--output','/tmp/out'])),['--baseline-dir','--output']);
});
test('candidate uses same previously proven pose and pinned A03 material renderer',async()=>{
 const m=await load('INLAND_BAND_A03_CANDIDATE_ONLY_V1');
 assert.equal(m.G1_PROFILE,true);assert.equal(m.G1_ACTIVE_LABEL,'candidate');
 assert.deepEqual(m.HEADS,{candidate:original.candidate});
 assert.equal(m.G1_POSES.length,1);assert.equal(m.G1_POSES[0].x,-200);
 assert.equal(m.G1_BLOBS.candidate,'62dc1e62f417f2b8eb7b4b08240f231d52d0c54e');
 assert.deepEqual(m.G1_MODES,modes);
 assert.throws(()=>m.parseArgs(['--baseline-dir','/tmp/base','--output','/tmp/out']),/CLI_NOT_CLOSED/);
});
test('legacy qualified G1 still selects original scene and profiles without any changes',async()=>{
 for(const [profile,label] of [['G1_SOIL_BASELINE_ONLY_V1','baseline'],['G1_SOIL_A03_CANDIDATE_ONLY_V1','candidate']]){
  const m=await load(profile);
  assert.equal(m.INLAND_BAND_PROFILE,false);
  assert.equal(m.G1_POSES[0].name,'G1-straight-mask-source-probe');
  assert.deepEqual([m.G1_POSES[0].x,m.G1_POSES[0].y,m.G1_POSES[0].z],[132,12.988637259823408,-165]);
  assert.deepEqual(m.HEADS,{[label]:original[label]});
  assert.deepEqual(m.G1_MODES,modes);
 }
});
test('original shader interception remains unchanged; no invented photo correspondence',()=>{
 const s=readFileSync(src,'utf8');
 for(const marker of ["variant:'A03_A04'","G1_RENDERER_BLOB_MISMATCH","CHECKOUT_TRACKED_BYTES_CHANGED","ownerClassCorrespondence:false","sourceRun:40411050366","INLAND_BAND_A03_CANDIDATE_ONLY_V1"])
  assert.ok(s.includes(marker),'source marker missing: '+marker);
 assert.equal(s.split("name:'inland-seam-near',x:-200,y:18.361431,z:-728").length,2);
 assert.equal(s.split("name:'G1-straight-mask-source-probe',x:132").length,2);
});
