import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {comparisonState} from '../../../tools/h-earth-ground-material-comparison.v1.mjs';
import {POSES,VIEWPORT,CAPTURE_STEPS,WARMUP_POSE,parseArgs,surveyReadiness,expectedNavigationYaw,matchesCanonicalHeading,validateView,validateCoverageCamera,decodeCapture,validateSet,validateMaterial,validateHttp,validateHead,validateNavigationDomain,CANDIDATE_HEAD,PRESENTATION,MARGIN} from './qualify.mjs';
const copy=structuredClone;
const sourcePlan=JSON.parse(readFileSync(new URL('./coverage-plan.json',import.meta.url)));
const admit=JSON.parse(readFileSync(new URL('./admission.json',import.meta.url)));
function resources(){
 const n=2914527,b=n*16;
 return {jacaranda:{focusId:'jac',state:'READY',ready:true,targetAnchor:{x:0,z:0}},treeCollection:{queue:{loading:0,failures:{}},entries:Array.from({length:8},(_,i)=>({id:'tree'+i,state:'READY',ready:true,x:i,z:0}))},
  singleOwnerVegetation:{schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',installedRootCount:n,originalRootCount:n,rootOwnerCount:1,gpuAllocationVerified:true,gpuUploadCount:1,gpuUploadedBytes:b,gpuAllocatedBytes:b,gpuRequestedBytes:b,gpuObservedBufferBytes:b,entranceGrass:{},allocationGlError:0,uploadGlError:0,disposed:false,tileCount:648,controlRoots:[]}};
}
function frame(pose,i=0){
 const pos={x:pose.x,y:pose.y,z:pose.z},r=resources(),seq=10001+i;
 return {worldPacket:{camera:{localAuthoringPosition:{...pos},viewProjectionMatrix:[1.8,0,0,0,0,1.8,0,0,0,0,1,0,0,0,-3,1]}},pose:copy(pose),state:{position:{...pos},yawDegrees:expectedNavigationYaw(pose.yaw),pitchDegrees:pose.pitch,verticalFovDegrees:56,sequence:seq,diagnosticObserver:true},lastFrame:{navigationSequence:seq,frameSequence:500+i,cameraPosition:{...pos}},expectedCameraPosition:{...pos},canvas:{width:529,height:980,cssWidth:529,cssHeight:980},resources:r,assetSignature:surveyReadiness(r,pos).signature,grassHidden:false,rendererResponseTransformed:false};
}
function header(w=529,h=980){
 const b=Buffer.alloc(1024);Buffer.from([137,80,78,71,13,10,26,10]).copy(b);b.write('IHDR',12);b.writeUInt32BE(w,16);b.writeUInt32BE(h,20);
 const f={navigationSequence:2,frameSequence:4};return {frame:f,value:{before:{...f},after:{...f},dataUrl:'data:image/png;base64,'+b.toString('base64')}};
}
test('authentic admitted generation and fixed product head',()=>{
 assert.equal(admit.result,'ADMITTED_AND_LOCKED');assert.equal(admit.lockGeneration,3005);
 assert.equal(admit.operationId,'H_EARTH_STEEP_SIDE_CURRENT_SCOUT_HASH_REPAIR_20261030_001');
 assert.equal(validateHead(CANDIDATE_HEAD),true);assert.throws(()=>validateHead('0'.repeat(40)),/FROZEN_CURRENT_HEAD/);
});
test('exact three source cameras and independent areas',()=>{
 assert.equal(POSES.length,3);assert.equal(new Set(POSES.map(p=>p.name)).size,3);assert.deepEqual(VIEWPORT,{width:529,height:980});
 assert.deepEqual(POSES.map(p=>[p.x,p.z]),[[110,-310],[150,-318],[210,-310]]);
 assert.deepEqual(POSES.map(p=>p.sourceTargetXZ),[[145,-240],[145,-240],[185,-240]]);
 assert.ok(POSES.every(p=>p.diagnosticObserver&&p.x>96&&p.sourceTargetXZ[0]>96&&p.sourceRayMinimumClearance>1.9));
 assert.equal(sourcePlan.ownerPhotoMatch,false);assert.equal(sourcePlan.sourceBasedOnly,true);
});
test('single warmup, only three captured frames',()=>{
 assert.equal(CAPTURE_STEPS.length,4);assert.equal(CAPTURE_STEPS[0].capture,false);
 assert.deepEqual(WARMUP_POSE,{name:'protected-meadow',x:-52,z:-208,yaw:136,pitch:-15});
 assert.deepEqual(CAPTURE_STEPS.filter(x=>x.capture).map(x=>x.pose),POSES);
 assert.deepEqual(CAPTURE_STEPS.map(x=>x.sequence),[9999,10001,10002,10003]);
});
test('camera measurement cannot silently pass missing or nonfinite matrix',()=>{
 const pose=POSES[0],v=frame(pose);assert.equal(validateCoverageCamera(v,pose),true);
 for(const bad of [null,[],Array(16).fill(0),Array(16).fill(NaN)]){
  const x=copy(v);x.worldPacket.camera.viewProjectionMatrix=bad;
  assert.throws(()=>validateCoverageCamera(x,pose),/PROJECTION_MATRIX/);
 }
 const wrong=copy(v);wrong.worldPacket.camera.localAuthoringPosition.y+=2.1;
 assert.throws(()=>validateCoverageCamera(wrong,pose),/RECONCILED_EYE/);
});
test('runtime frame, heading and viewport are bound',()=>{
 for(let i=0;i<3;i++){assert.equal(validateView(frame(POSES[i],i),POSES[i],10001+i),true);}
 const v=frame(POSES[1],1);v.state.yawDegrees=0;assert.throws(()=>validateView(v,POSES[1],10002),/SURVEY_POSE/);
 const w=frame(POSES[1],1);w.canvas.height=979;assert.throws(()=>validateView(w,POSES[1],10002),/SURVEY_VIEWPORT/);
 const b=frame(POSES[2],2);b.lastFrame.navigationSequence=1;assert.throws(()=>validateView(b,POSES[2],10003),/SURVEY_FRAME/);
});
test('candidate pose-set rejects omitted duplicated and altered views',()=>{
 const views=POSES.map(frame);assert.equal(validateSet(views),true);
 assert.throws(()=>validateSet(views.slice(1)),/SURVEY_FRAME_CAP/);
 assert.throws(()=>validateSet([...views,views[0]]),/SURVEY_FRAME_CAP/);
 const dupe=views.map(view=>copy(view));dupe[1]=dupe[2];assert.throws(()=>validateSet(dupe),/SURVEY_POSE_SET/);
});
test('image bytes are genuine required dimension and one unchanged GPU frame',()=>{
 const c=header();assert.equal(decodeCapture(c.value,c.frame).length,1024);
 const wrong=header(384,688);assert.throws(()=>decodeCapture(wrong.value,wrong.frame),/SURVEY_PNG_DIMENSIONS/);
 const stale=header();stale.value.after.frameSequence+=1;assert.throws(()=>decodeCapture(stale.value,stale.frame),/SURVEY_CAPTURE_FRAME_CHANGED/);
});
test('source and HTTP material helpers cannot silently drop',()=>{
 const expected={presentationSha256:'p',marginSha256:'m',marginReceipt:{status:'SOURCE_MATCHED_COMPARISON_CANDIDATE',uploadedBytes:75272,perFrameUploadBytes:0}};
 const p={path:PRESENTATION,status:200,sha256:'p'},m={path:MARGIN,status:200,sha256:'m'};
 assert.equal(validateHttp([p,m],'candidate',expected),true);assert.throws(()=>validateHttp([p],'candidate',expected),/HELPER_HTTP_CUSTODY/);
 assert.equal(validateMaterial({materialMarginCorrection:{...expected.marginReceipt}},'candidate',expected),true);
 assert.throws(()=>validateMaterial({materialMarginCorrection:{status:'MISSING'}},'candidate',expected),/MARGIN/);
});
test('all nine imported assets and 2914527 roots stay required',()=>{
 let p=POSES[0],v=frame(p),r=copy(v.resources);
 assert.equal(surveyReadiness(r,v.expectedCameraPosition).ready,true);
 r.singleOwnerVegetation.installedRootCount--;assert.equal(surveyReadiness(r,v.expectedCameraPosition).ready,false);
 const hidden=frame(p);hidden.grassHidden=true;assert.throws(()=>validateView(hidden,p,10001),/PRESENTATION_CHANGED/);
});
test('no unknown CLI modes or output written inside candidate checkout',()=>{
 assert.deepEqual(Object.keys(parseArgs(['--candidate-dir','/tmp/candidate','--output','/tmp/report'])).sort(),['--candidate-dir','--output']);
 assert.throws(()=>parseArgs(['--baseline-dir','/tmp/b','--output','/tmp/a']),/CLI_CLOSED/);
 assert.throws(()=>parseArgs(['--candidate-dir','/tmp/c','--output','/tmp/c/a']),/SCOUT_DIRECTORIES/);
});
test('source navigation diagnostic observer does not assert walking legitimacy',async()=>{
 const nav=await import('../../../showroom/globe/h-earth/functional-landscape/navigation.js');
 assert.equal(validateNavigationDomain(nav),true);
 for(const p of POSES){let n=comparisonState(nav,p,44,'TEST');assert.equal(n.diagnosticObserver,true);assert.equal(n.terrainSupported,false);assert.equal(n.accepted,false);}
 assert.throws(()=>validateNavigationDomain(nav,[{...POSES[0],y:undefined}]),/DIAGNOSTIC_POSE_INVALID/);
});
test('source poses never claim photographed material-border reproduction',()=>{
 assert.deepEqual(sourcePlan.poses.map(p=>p.ownerPhotoMatch),[false,false,false]);
 assert.equal(sourcePlan.ownerPhotoMatch,false);
 assert.ok(sourcePlan.poses.every(p=>p.candidateCurrentSceneRecheckRequired));
 assert.equal(POSES.filter(p=>p.name.includes('ridge')).length,0);
});

test('Gen3003 regression: immutable source Git blobs and inherited helper SHA-256 are distinct custody domains',()=>{
 const workflow=readFileSync(new URL('../../../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 const section=workflow.split('  # Gen3005: recovery of verified pre-GPU SHA-domain failure, exactly three lit current-product images.')[1];
 assert.ok(section,'GEN3003_JOB_MISSING');
 assert.ok(section.includes("const gitBlob=p=>execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();"));
 assert.ok(section.includes("const sha256=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');"));
 assert.ok(section.includes("assert.equal(gitBlob('tooling/'+p),h)"));
 assert.ok(section.includes("assert.equal(sha256('support/tools/'+p),h)"));
 assert.equal(section.includes("assert.equal(gitBlob('support/tools/'+p),h)"),false);
 assert.equal(section.includes("assert.equal(sha256('tooling/'+p),h)"),false);
 const expected=['b7d61c3359e21b793d24bed01b73493549a427cb390cec779d0adf9265b50509','070ad7daf51bbf41c2f4223ad9ba3a0143bde6aa3f7439df603c4a2718f50558','d61880ba98d81eae5d7cc6503f10f34d5aaa37819f4ba4a22218d87e711ca797','e9a872402371087e49031bca2ca27d0f37c9ab1012df50a5ebbf63617a3bf9e1'];
 for(const h of expected) assert.ok(section.includes(h),'PINNED_HELPER_SHA256_MISSING');
});
