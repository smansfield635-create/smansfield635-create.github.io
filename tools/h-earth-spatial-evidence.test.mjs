import test from 'node:test';
import assert from 'node:assert/strict';
import {recordSubmittedFrame,viewportPoint,selectBoundedPixels,scanSubmittedFrame,createHEarthCopyReportFrameBridge} from '../showroom/globe/h-earth/vegetation-prototype/spatial-evidence.v1.js';
const M=Array.from({length:16},(_,i)=>i===0||i===5||i===10||i===15?1:0);
const make=()=>recordSubmittedFrame({frameSequence:7,navigationState:{sequence:9,position:{x:140.1713950863,y:12,z:-365.4065123596},yawDegrees:21,pitchDegrees:-8,verticalFovDegrees:56},packet:{camera:{position:{x:140.1713950863,y:12,z:-365.4065123596},viewProjectionMatrix:M}},viewport:{cssWidth:529,cssHeight:980,bufferWidth:529,bufferHeight:980},sourceIdentity:{source:'exact-test-blob'},rendererReceipt:{rendererId:'R3C',context:{version:'WebGL 2.0'},package:{runtimeContentDigest:'digest'}}});
const pt=(x,y)=>({clientX:x,clientY:y});
test('immutable exact submitted pose carries all 3D dimensions, yaw pitch FOV projection and identity',()=>{const f=make();assert.equal(f.camera.position.x,140.1713950863);assert.equal(f.camera.position.z,-365.4065123596);assert.equal(f.camera.yawDegrees,21);assert.equal(f.camera.pitchDegrees,-8);assert.equal(f.camera.verticalFovDegrees,56);assert.equal(f.camera.viewProjectionMatrix.length,16);assert.equal(f.renderer.id,'R3C');assert.ok(Object.isFrozen(f.camera));});
test('frame evidence does not claim displayed/physical pixel proof',()=>{const f=make();assert.match(f.evidenceGrade,/UNVERIFIED/);assert.match(f.imageEvidenceStatus,/NOT_ATTACHED/)});
test('portrait top-left becomes GL bottom-left at actual buffer',()=>{const f=make();assert.deepEqual(viewportPoint(f,pt(330,838)),{clientX:330,clientY:838,topLeftX:330,topLeftY:838,glX:330,glY:141});});
test('CSS scaling, viewport offsets and DPR use actual draw buffer not DPR estimate',()=>{const f=recordSubmittedFrame({frameSequence:1,navigationState:{sequence:1,position:{x:0,y:0,z:0},yawDegrees:0,pitchDegrees:0,verticalFovDegrees:60},packet:{camera:{position:{x:0,y:0,z:0},viewProjectionMatrix:M}},viewport:{cssWidth:100,cssHeight:50,bufferWidth:250,bufferHeight:125,devicePixelRatio:3,offsetLeft:20,offsetTop:50}});assert.equal(viewportPoint(f,pt(70,75)).topLeftX,125);assert.equal(viewportPoint(f,pt(70,75)).topLeftY,62);assert.equal(viewportPoint(f,pt(70,75)).glY,62);});
test('invalid orientation fails rather than silently recording unknown camera pose',()=>{assert.throws(()=>recordSubmittedFrame({frameSequence:1,navigationState:{sequence:1,position:{x:0,y:0,z:0},yawDegrees:0,pitchDegrees:0},packet:{camera:{position:{x:0,y:0,z:0},viewProjectionMatrix:M}},viewport:{cssWidth:100,cssHeight:50,bufferWidth:100,bufferHeight:50}}),/ORIENTATION_MISSING/);});
test('selection outside visible viewport fails closed',()=>assert.throws(()=>viewportPoint(make(),pt(-1,1)),/SELECTION_OUTSIDE/));
test('one point and contour are bounded and preserve source vertices',()=>{const f=make();assert.equal(selectBoundedPixels(f,{kind:'point',points:[pt(1,2)]}).sampleCount,1);assert.equal(selectBoundedPixels(f,{kind:'contour',points:[pt(10,20),pt(10,21),pt(11,22)]}).sampleCount,3);});
test('rectangle grid at most 64 pixels, no unbounded full-frame scans',()=>{const s=selectBoundedPixels(make(),{kind:'rectangle',points:[pt(1,1),pt(500,900)],gridSize:8});assert.equal(s.sampleCount,64);assert.throws(()=>selectBoundedPixels(make(),{kind:'rectangle',points:[pt(1,1),pt(500,900)],gridSize:9}),/GRID_LIMIT/);});
test('scan without GPU adapter reports unknown rather than invented primitive or material',async()=>{const f=make(),selection=selectBoundedPixels(f,{kind:'point',points:[pt(200,400)]});const out=await scanSubmittedFrame({frame:f,selection});assert.equal(out.samples[0].firstHit.status,'UNKNOWN');assert.equal(out.samples[0].materials.status,'UNKNOWN');assert.equal(out.budget.actualGpuPasses,0);});
test('camera movement between frame and scan fails closed',async()=>{const f=make(),s=selectBoundedPixels(f,{kind:'point',points:[pt(0,0)]});await assert.rejects(scanSubmittedFrame({frame:f,selection:s,latestFrameId:'cpu-submit:8:nav:10'}),/FRAME_CHANGED/);});
test('wrong inspector frame cannot attribute selected pixel',async()=>{const f=make(),s=selectBoundedPixels(f,{kind:'point',points:[pt(0,0)]});await assert.rejects(scanSubmittedFrame({frame:f,selection:s,inspector:async()=>({frameId:'wrong',samples:[{}],actualGpuPasses:1}),budget:{maxGpuPasses:1}}),/INSPECTOR_FRAME/);});
test('partial measurement retains unknown materials unless qualified',async()=>{const f=make(),s=selectBoundedPixels(f,{kind:'point',points:[pt(0,0)]});const out=await scanSubmittedFrame({frame:f,selection:s,inspector:async()=>({frameId:f.frameId,actualGpuPasses:0,samples:[{frameId:f.frameId,topLeftX:0,topLeftY:0,firstHit:{status:'MEASURED',depthValid:true,primitiveId:8,geometrySource:'package'},materials:{status:'MEASURED',shaderSource:'worldSoil',contributors:[]}}]})});assert.equal(out.samples[0].firstHit.status,'MEASURED');assert.equal(out.samples[0].materials.status,'UNKNOWN');});
test('qualified measured material demands source and bounded numeric contributors',async()=>{const f=make(),s=selectBoundedPixels(f,{kind:'point',points:[pt(0,0)]});const out=await scanSubmittedFrame({frame:f,selection:s,inspector:async()=>({frameId:f.frameId,actualGpuPasses:1,samples:[{frameId:f.frameId,topLeftX:0,topLeftY:0,firstHit:{status:'MEASURED',depthValid:true,primitiveId:8,geometrySource:'package'},materials:{status:'MEASURED',shaderSource:'worldSoil',contributors:[{name:'W',value:0.5}]}}]}),budget:{maxGpuPasses:1}});assert.equal(out.samples[0].materials.status,'MEASURED');assert.equal(out.budget.actualGpuPasses,1);});
test('inspector cannot exceed declared GPU pass ceiling',async()=>{const f=make(),s=selectBoundedPixels(f,{kind:'point',points:[pt(0,0)]});await assert.rejects(scanSubmittedFrame({frame:f,selection:s,inspector:async()=>({frameId:f.frameId,actualGpuPasses:2,samples:[{}]}),budget:{maxGpuPasses:1}}),/BUDGET_EXCEEDED/);});
test('source identity is cloned so caller changes cannot rewrite preserved frame',()=>{const source={sha:'original'};const f=recordSubmittedFrame({frameSequence:1,navigationState:{sequence:1,position:{x:0,y:0,z:0},yawDegrees:0,pitchDegrees:0,verticalFovDegrees:60},packet:{camera:{position:{x:0,y:0,z:0},viewProjectionMatrix:M}},viewport:{cssWidth:1,cssHeight:1,bufferWidth:1,bufferHeight:1},sourceIdentity:source});source.sha='modified';assert.equal(f.sourceIdentity.sha,'original');});

test('cannot reuse selection from another frame even at the same location',async()=>{
 const f=make(),other=recordSubmittedFrame({frameSequence:8,navigationState:{sequence:10,position:{x:0,y:0,z:0},yawDegrees:0,pitchDegrees:0,verticalFovDegrees:60},packet:{camera:{position:{x:0,y:0,z:0},viewProjectionMatrix:M}},viewport:{cssWidth:529,cssHeight:980,bufferWidth:529,bufferHeight:980}});
 const selected=selectBoundedPixels(other,{kind:'point',points:[pt(0,0)]});
 await assert.rejects(scanSubmittedFrame({frame:f,selection:selected}),/SELECTION_FRAME_MISMATCH/);
});
test('inspector result for a different pixel cannot be attributed to selected pixel',async()=>{
 const f=make(),s=selectBoundedPixels(f,{kind:'point',points:[pt(0,0)]});
 const out=await scanSubmittedFrame({frame:f,selection:s,inspector:async()=>({frameId:f.frameId,actualGpuPasses:0,samples:[{frameId:f.frameId,topLeftX:1,topLeftY:0,firstHit:{status:'MEASURED',depthValid:true,primitiveId:8,geometrySource:'package'},materials:{status:'MEASURED',shaderSource:'worldSoil',contributors:[{name:'W',value:0.8}]}}]})});
 assert.equal(out.samples[0].firstHit.status,'UNKNOWN');assert.equal(out.samples[0].materials.status,'UNKNOWN');
});

// Preserved Copy-report bridge regressions (same admitted test path).
const matrix=Array.from({length:16},(_,i)=>i%5===0?1:0);
const makeBridge=()=>({packet:{frameSequence:5,viewport:{width:529,height:980},camera:{position:{x:129.8,y:20,z:-389},viewProjectionMatrix:matrix}},navigationState:{sequence:11,position:{x:129.8,y:7,z:-389},yawDegrees:113,pitchDegrees:-8,verticalFovDegrees:56}});
const bridgeCanvas=()=>({width:529,height:980,ownerDocument:{defaultView:{devicePixelRatio:2}},getBoundingClientRect(){return {width:529,height:980,left:16,top:32}}});
test('cannot claim a report frame before CPU present',()=>{
 const b=createHEarthCopyReportFrameBridge();assert.equal(b.getCopyReportFrameEvidence({canvas:bridgeCanvas()}).status,'UNAVAILABLE');
});
test('report carries latest real submitted pose, exact matrix and viewport',()=>{
 const b=createHEarthCopyReportFrameBridge({sourceIdentity:{sourceBaseline:'f64ce197'}}),f=makeBridge();
 assert.equal(b.rememberSubmittedFrame(f).status,'RECORDED_CPU_SUBMITTED_FRAME');
 const r=b.getCopyReportFrameEvidence({canvas:bridgeCanvas()});assert.equal(r.status,'CAPTURED_CPU_SUBMITTED_FRAME');
 assert.equal(r.evidence.camera.yawDegrees,113);assert.equal(r.evidence.camera.navigationPosition.z,-389);
 assert.equal(r.evidence.camera.viewProjectionMatrix.length,16);assert.equal(r.evidence.frameId,'cpu-submit:5:nav:11');
 assert.equal(r.evidence.viewport.offsetLeft,16);assert.equal(r.evidence.sourceIdentity.sourceBaseline,'f64ce197');
 assert.match(r.evidence.evidenceGrade,/UNVERIFIED/);
});
test('recorded packet and state cannot be rewritten by caller mutation',()=>{
 const b=createHEarthCopyReportFrameBridge(),f=makeBridge();b.rememberSubmittedFrame(f);
 f.navigationState.yawDegrees=0;f.packet.camera.position.x=0;f.packet.camera.viewProjectionMatrix[0]=6;
 const r=b.getCopyReportFrameEvidence({canvas:bridgeCanvas()});assert.equal(r.evidence.camera.yawDegrees,113);
 assert.equal(r.evidence.camera.position.x,129.8);assert.equal(r.evidence.camera.viewProjectionMatrix[0],1);
});
test('changed framebuffer does not claim same-frame correspondence',()=>{
 const b=createHEarthCopyReportFrameBridge();b.rememberSubmittedFrame(makeBridge());const c=bridgeCanvas();c.width=500;
 assert.equal(b.getCopyReportFrameEvidence({canvas:c}).reason,'FRAMEBUFFER_CHANGED_SINCE_SUBMITTED_FRAME');
});
test('invalid frame or absent canvas cannot prevent copying other report fields',()=>{
 const b=createHEarthCopyReportFrameBridge();b.rememberSubmittedFrame({packet:null,navigationState:null});
 assert.equal(b.getCopyReportFrameEvidence({canvas:bridgeCanvas()}).status,'UNAVAILABLE');
 b.rememberSubmittedFrame(makeBridge());assert.equal(b.getCopyReportFrameEvidence({canvas:null}).status,'UNAVAILABLE');
});
test('later submitted frame replaces prior identity without entering shader analysis',()=>{
 const b=createHEarthCopyReportFrameBridge();b.rememberSubmittedFrame(makeBridge());const f=makeBridge();f.packet.frameSequence=6;f.navigationState.sequence=12;f.navigationState.yawDegrees=22;
 b.rememberSubmittedFrame(f);const r=b.getCopyReportFrameEvidence({canvas:bridgeCanvas()});
 assert.equal(r.evidence.frameId,'cpu-submit:6:nav:12');assert.equal(r.evidence.camera.yawDegrees,22);
 assert.equal(r.evidence.renderer.context,null);assert.equal('shader' in r,false);
});
