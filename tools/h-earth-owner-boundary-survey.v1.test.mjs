import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ANCHOR,POSES,VIEWPORT,parseArgs,validateView,decodeCapture,validateSet} from './h-earth-owner-boundary-survey.v1.mjs';
import {assetReadiness,footprintVegetationReadiness} from './h-earth-ground-material-comparison.v1.mjs';
function view(pose=POSES[0]){
 const resources={jacaranda:{state:'READY',ready:true,targetAnchor:{x:55.5,z:-307.5}},treeCollection:{queue:{loading:false,failures:{}},entries:Array.from({length:8},(_,i)=>({id:'tree-'+i,state:'READY',ready:true,x:0,z:0}))},singleOwnerVegetation:{schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',rootOwnerCount:1,installedRootCount:2914527,originalRootCount:2858738,gpuAllocationVerified:true,gpuUploadCount:1,gpuRequestedBytes:46632432,gpuObservedBufferBytes:46632432,gpuAllocatedBytes:46632432,gpuUploadedBytes:46632432,allocationGlError:0,uploadGlError:0,disposed:false}};
 const camera={x:pose.x,y:12,z:pose.z};
 return {pose,state:{position:camera,yawDegrees:pose.yaw,pitchDegrees:pose.pitch,verticalFovDegrees:56,sequence:1},lastFrame:{cameraPosition:camera,navigationSequence:1,frameSequence:1},expectedCameraPosition:camera,canvas:{width:384,height:688,cssWidth:384,cssHeight:688},resources,assetSignature:assetReadiness(resources,camera).signature+'|'+footprintVegetationReadiness(resources).signature,grassHidden:false,rendererResponseTransformed:false};
}
test('one complete overlapping360-degree survey at owner report anchor',()=>{
 assert.equal(POSES.length,12);assert.equal(ANCHOR.exactScreenshotPoseProven,false);assert.equal(ANCHOR.x,140.1713950862869);assert.equal(ANCHOR.z,-365.406512359563);
 const hFov=2*Math.atan(Math.tan(56*Math.PI/360)*VIEWPORT.width/VIEWPORT.height)*180/Math.PI;
 assert.ok(hFov>30);for(let i=0;i<12;i++){assert.equal(POSES[i].yaw,i*30);assert.equal(POSES[i].x,ANCHOR.x);assert.equal(POSES[i].z,ANCHOR.z);assert.equal(POSES[i].pitch,-14);assert.equal(POSES[i].diagnosticObserver,undefined);}
});
test('closed CLI rejects unspecified inputs and output inside scene',()=>{
 assert.deepEqual(parseArgs(['--scene-dir','/scene','--output','/out']),{'--scene-dir':'/scene','--output':'/out'});
 assert.throws(()=>parseArgs(['--scene-dir','/scene','--output','/scene/out']),/DIRECTORIES/);assert.throws(()=>parseArgs(['--scene-dir','/scene','--output','/out','--yaw','100']),/CLI_CLOSED/);
});
test('actual frame must match accepted camera, dimensions, and sequence',()=>{
 assert.equal(validateView(view(),POSES[0],1),true);
 for(const change of [v=>v.state.pitchDegrees=-13,v=>v.lastFrame.navigationSequence=2,v=>v.canvas.width=529,v=>v.expectedCameraPosition={x:0,y:12,z:0}]){const v=view();change(v);assert.throws(()=>validateView(v,POSES[0],1));}
});
test('vegetation upload failures or suppression and renderer transforms invalidate frame',()=>{
 for(const change of [v=>v.resources.singleOwnerVegetation.uploadGlError=1282,v=>v.resources.singleOwnerVegetation.gpuObservedBufferBytes=0,v=>v.grassHidden=true,v=>v.rendererResponseTransformed=true]){const v=view();change(v);assert.throws(()=>validateView(v,POSES[0],1));}
});
test('missing imported assets or incorrect root population invalidate capture',()=>{
 for(const change of [v=>v.resources.treeCollection.entries.pop(),v=>v.resources.singleOwnerVegetation.installedRootCount--]){const v=view();change(v);assert.throws(()=>validateView(v,POSES[0],1));}
});
test('capture rejects stale frame and wrong image dimensions',()=>{
 const b=Buffer.alloc(1100);Buffer.from([137,80,78,71,13,10,26,10]).copy(b);b.write('IHDR',12);b.writeUInt32BE(384,16);b.writeUInt32BE(688,20);const frame={navigationSequence:1,frameSequence:3},cap={before:frame,after:frame,dataUrl:'data:image/png;base64,'+b.toString('base64')};assert.deepEqual(decodeCapture(cap,frame),b);
 assert.throws(()=>decodeCapture({...cap,after:{...frame,frameSequence:4}},frame),/FRAME_CHANGED/);b.writeUInt32BE(529,16);assert.throws(()=>decodeCapture({...cap,dataUrl:'data:image/png;base64,'+b.toString('base64')},frame),/DIMENSIONS/);
});
test('incomplete, duplicate, or foreign poses cannot be accepted',()=>{
 const views=POSES.map(view);assert.equal(validateSet(views),true);assert.throws(()=>validateSet(views.slice(1)),/FRAME_CAP/);assert.throws(()=>validateSet([...views.slice(1),views[1]]),/POSE_SET/);const drift=structuredClone(views);drift[1].assetSignature+='changed';assert.throws(()=>validateSet(drift),/ASSET_IDENTITY_DRIFT/);
});
test('survey intercepts route only; existing product renderer and physical draw remain untouched',()=>{
 const src=fs.readFileSync(new URL('./h-earth-owner-boundary-survey.v1.mjs',import.meta.url),'utf8');assert.equal((src.match(/await page\.route\(/g)||[]).length,1);assert.match(src,/url=>url\.pathname===ROUTE/);assert.doesNotMatch(src,/instrumentProductionRenderer\(|__groundComparisonHideGrass\s*=/);assert.match(src,/worldPacket:packet/);
});
