import test from 'node:test';
import assert from 'node:assert/strict';
import {BASELINE_HEAD,POSES,VIEWPORT,CAPTURE_STEPS,WARMUP_POSE,parseArgs,surveyReadiness,expectedNavigationYaw,matchesCanonicalHeading,validateView,decodeCapture,validateSet,validatePair,validateMaterial,validateHttp,validateHeads,CANDIDATE_HEAD,PRESENTATION,MARGIN} from './qualify.mjs';
const clone=structuredClone;
const binding=()=>({baseline:{head:BASELINE_HEAD,rendererSha256:'a2ab977a3ea620f7bf87b3bdfb4e6a720cf7801f2ecbb670b4ac2dfccacf917d',routeSha256:'e776883f16ac36f00b51356fe8e78ac6ae2d0f6ce28016f776068b3d76831cb5'},candidate:{rendererSha256:'1'.repeat(64),routeSha256:'2'.repeat(64)}});
const head='3'.repeat(40);
function resources(){
 const rootCount=2914527,bytes=rootCount*16;
 return {jacaranda:{focusId:'jacaranda',state:'READY',ready:true,targetAnchor:{x:0,z:0}},treeCollection:{queue:{loading:0,failures:{}},entries:Array.from({length:8},(_,i)=>({id:'tree-'+i,state:'READY',ready:true,x:i,z:0}))},
 singleOwnerVegetation:{schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',installedRootCount:rootCount,originalRootCount:rootCount,rootOwnerCount:1,gpuAllocationVerified:true,gpuUploadCount:1,gpuUploadedBytes:bytes,gpuAllocatedBytes:bytes,gpuRequestedBytes:bytes,gpuObservedBufferBytes:bytes,entranceGrass:{slopeRepair:{generationMs:12}},allocationGlError:0,uploadGlError:0,disposed:false,tileCount:4,controlRoots:[]}};
}
function view(pose,i=0){
 const camera={x:pose.x,y:pose.y??7,z:pose.z},r=resources(),sequence=10001+i;
 return {pose:clone(pose),state:{position:clone(camera),yawDegrees:expectedNavigationYaw(pose.yaw),pitchDegrees:pose.pitch,verticalFovDegrees:56,sequence,...(pose.diagnosticObserver?{diagnosticObserver:true}:{})},lastFrame:{navigationSequence:sequence,frameSequence:500+i,cameraPosition:clone(camera)},expectedCameraPosition:clone(camera),canvas:{width:384,height:688,cssWidth:384,cssHeight:688},resources:r,assetSignature:surveyReadiness(r,camera).signature,grassHidden:false,rendererResponseTransformed:false,imageSha256:'a'.repeat(64)};
}
function scene(){return {views:POSES.map(view)};}
function capture(width=384,height=688){
 // Header-only fixture exercises the capture header/dimension guard, not a PNG decoder.
 const b=Buffer.alloc(1024);Buffer.from([137,80,78,71,13,10,26,10]).copy(b);b.write('IHDR',12);b.writeUInt32BE(width,16);b.writeUInt32BE(height,20);
 const frame={navigationSequence:7,frameSequence:9};
 return {frame,value:{before:{...frame},after:{...frame},dataUrl:'data:image/png;base64,'+b.toString('base64')}};
}
test('canonical signed headings retain all full rotations',()=>{
 for(const [input,expected] of [[0,0],[210,-150],[330,-30],[360,0],[-210,150],[720,0],[180,180],[-180,-180]]){assert.equal(expectedNavigationYaw(input),expected);assert.equal(matchesCanonicalHeading(expected,input),true);}
 assert.equal(matchesCanonicalHeading(210,210),false);assert.equal(matchesCanonicalHeading(-149,210),false);assert.throws(()=>expectedNavigationYaw(NaN),/NONFINITE/);
});
test('four source-targeted poses plus two protected controls and diagnostic versus supported-camera roles are retained',()=>{
 assert.equal(POSES.length,6);assert.equal(new Set(POSES.map(p=>p.name )).size,6);assert.equal(POSES.filter(p=>p.diagnosticObserver).length,3);assert.deepEqual(VIEWPORT,{width:384,height:688});
 assert.equal(validateSet(scene().views),true);
 const bad=scene();bad.views[2].state.diagnosticObserver=true;assert.throws(()=>validateSet(bad.views),/SURVEY_POSE/);
 const wrongHeight=scene();wrongHeight.views[0].state.position.x+=1;assert.throws(()=>validateSet(wrongHeight.views),/SURVEY_POSE/);
});
test('missing, extra, duplicate and altered pose frames fail closed',()=>{
 const s=scene();assert.throws(()=>validateSet(s.views.slice(1)),/FRAME_CAP/);assert.throws(()=>validateSet([...s.views,s.views[0]]),/FRAME_CAP/);
 const duplicate=scene();duplicate.views[3]=duplicate.views[2];assert.throws(()=>validateSet(duplicate.views),/POSE_SET/);
 const changed=scene();changed.views[2].pose.yaw+=1;assert.throws(()=>validateSet(changed.views),/POSE_SET/);
});
test('viewport is exactly 384 by 688 in drawing and CSS dimensions',()=>{
 for(const key of ['width','height','cssWidth','cssHeight']){const v=view(POSES[0]);v.canvas[key]+=1;assert.throws(()=>validateView(v,POSES[0],v.state.sequence),/SURVEY_VIEWPORT/);}
 const f=capture();assert.equal(decodeCapture(f.value,f.frame).length,1024);
 for(const [w,h] of [[529,980],[384,687],[383,688]]){const bad=capture(w,h);assert.throws(()=>decodeCapture(bad.value,bad.frame),/PNG_DIMENSIONS/);}
});
test('capture must represent the same completed frame before and after PNG read',()=>{
 const f=capture();f.value.after.frameSequence+=1;assert.throws(()=>decodeCapture(f.value,f.frame),/CAPTURE_FRAME_CHANGED/);
 const g=capture();g.value.before.navigationSequence+=1;assert.throws(()=>decodeCapture(g.value,g.frame),/CAPTURE_FRAME_CHANGED/);
});
test('resident roots and all nine imported plants are required',()=>{
 const v=view(POSES[2]);assert.equal(surveyReadiness(v.resources,v.expectedCameraPosition).ready,true);
 const roots=clone(v.resources);roots.singleOwnerVegetation.installedRootCount--;assert.equal(surveyReadiness(roots,v.expectedCameraPosition).ready,false);
 const trees=clone(v.resources);trees.treeCollection.entries.pop();assert.equal(surveyReadiness(trees,v.expectedCameraPosition).ready,false);
 const hidden=clone(v);hidden.grassHidden=true;assert.throws(()=>validateView(hidden,POSES[2],hidden.state.sequence),/PRESENTATION_CHANGED/);
});
test('only known generation timing is normalized out of vegetation identity',()=>{
 const a=resources(),b=clone(a);b.singleOwnerVegetation.entranceGrass.slopeRepair.generationMs=900;
 const p={x:0,z:0};assert.equal(surveyReadiness(a,p).signature,surveyReadiness(b,p).signature);
 b.singleOwnerVegetation.controlRoots=[{x:1,z:2}];assert.notEqual(surveyReadiness(a,p).signature,surveyReadiness(b,p).signature);
});
test('output cannot alter the scene and unknown CLI inputs reject',()=>{
 assert.ok(parseArgs(['--baseline-dir','/tmp/a','--candidate-dir','/tmp/c','--output','/tmp/b']));
 assert.throws(()=>parseArgs(['--baseline-dir','/tmp/a','--candidate-dir','/tmp/c','--output','/tmp/a/evidence']),/DIRECTORIES/);
 assert.throws(()=>parseArgs(['--baseline-dir','/tmp/a','--candidate-dir','/tmp/c','--output','/tmp/a']),/DIRECTORIES/);
 assert.throws(()=>parseArgs(['--command','unsafe']),/CLI_CLOSED/);
});

test('one noncapture warmup precedes exactly six fixed views',()=>{
 assert.equal(CAPTURE_STEPS.length,7);assert.equal(CAPTURE_STEPS[0].capture,false);assert.deepEqual(WARMUP_POSE,{name:'protected-meadow',x:-52,z:-208,yaw:136,pitch:-15});
 assert.deepEqual(CAPTURE_STEPS.filter(s=>s.capture).map(s=>s.pose),POSES);
 assert.deepEqual(CAPTURE_STEPS.map(s=>s.sequence),[9999,10001,10002,10003,10004,10005,10006]);
});

test('paired cameras, roots and warmup are mandatory',()=>{
 const a={views:POSES.map(view),warmup:{result:'ALL_NINE_READY_NO_IMAGE_CAPTURED'}},b=clone(a);
 assert.equal(validatePair(a,b),true);
 b.views[2].state.position.y+=1;assert.throws(()=>validatePair(a,b),/PAIR_CAMERA/);
 const c=clone(a);c.warmup.result='PENDING';assert.throws(()=>validatePair(a,c),/PAIR_WARMUP/);
 const e=clone(a);e.views.forEach(v=>{v.resources.singleOwnerVegetation.controlRoots=[{x:1}];v.assetSignature=surveyReadiness(v.resources,v.expectedCameraPosition).signature});assert.throws(()=>validatePair(a,e),/PAIR_VEGETATION/);
});

test('both source heads are fixed',()=>{assert.equal(validateHeads(BASELINE_HEAD,CANDIDATE_HEAD),true);assert.throws(()=>validateHeads(BASELINE_HEAD,'a'.repeat(40)),/FROZEN_SCENE_HEAD/);assert.throws(()=>validateHeads('b'.repeat(40),CANDIDATE_HEAD),/FROZEN_SCENE_HEAD/);});
test('inactive correction cannot pass as repaired image',()=>{
 const expected={marginReceipt:{status:'SOURCE_MATCHED_COMPARISON_CANDIDATE',encoding:'RGBA16F_DELTA_A_B_LINEAR_NO_MIPMAPS',uploadedBytes:75272,textureUploadCount:1,perFrameUploadBytes:0}};
 assert.equal(validateMaterial({},'baseline',{}),true);const good={materialMarginCorrection:{...expected.marginReceipt}};assert.equal(validateMaterial(good,'candidate',expected),true);
 for(const [key,value]of [['status','INACTIVE_SOURCE_MISMATCH'],['uploadedBytes',2],['perFrameUploadBytes',1],['encoding','WRONG']]){const bad=clone(good);bad.materialMarginCorrection[key]=value;assert.throws(()=>validateMaterial(bad,'candidate',expected));}
 assert.throws(()=>validateMaterial(good,'baseline',{}),/BASELINE_MARGIN_PRESENT/);
});
test('helper HTTP identity is checked for both scenes',()=>{
 const expected={presentationSha256:'p',marginSha256:'m'},p={path:PRESENTATION,status:200,sha256:'p'},m={path:MARGIN,status:200,sha256:'m'};
 assert.equal(validateHttp([p],'baseline',expected),true);assert.equal(validateHttp([p,m],'candidate',expected),true);
 assert.throws(()=>validateHttp([],'baseline',expected));assert.throws(()=>validateHttp([p],'candidate',expected));assert.throws(()=>validateHttp([p,m],'baseline',expected));assert.throws(()=>validateHttp([p,p,m],'candidate',expected));
});
