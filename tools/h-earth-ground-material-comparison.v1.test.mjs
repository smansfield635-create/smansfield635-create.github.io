import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HEADS,POSES,comparisonState,instrumentRoute,instrumentRenderer,validateFrame,parseArgs,sameHeading,assetReadiness,decodeCanvasCapture} from './h-earth-ground-material-comparison.v1.mjs';

const fixture=()=>({state:{position:{x:18,y:24,z:-226},yawDegrees:-150,pitchDegrees:-14,verticalFovDegrees:56,sequence:10001},lastFrame:{navigationSequence:10001,frameSequence:21,cameraPosition:{x:18,y:24,z:-226}},expectedCameraPosition:{x:18,y:24,z:-226},canvas:{width:529,height:980,cssWidth:540,cssHeight:1000}});
test('exact immutable pair and recovered four poses are frozen',()=>{assert.equal(HEADS.baseline,'60b3c07f0216645119a1b92b16dac82cae739145');assert.equal(HEADS.candidate,'60b3c07f0216645119a1b92b16dac82cae739145');assert.deepEqual(POSES.slice(0,4).map(p=>[p.name,p.x,p.z,p.yaw,p.pitch]),[['river-overlook',18,-226,210,-14],['bare-mountain',88,-260,95,-10],['coast-oblique',0,-110,170,-8],['foothill-west',-52,-208,180,-12]]);});
test('renderer normal mode executes identical draw while hidden mode suppresses only that draw',()=>{const source='before();resources.singleOwnerVegetation?.draw(packet);after();',patched=instrumentRenderer(source);for(const hidden of [false,true]){const calls=[];new Function('globalThis','resources','packet','before','after',patched)({__groundComparisonHideGrass:hidden},{singleOwnerVegetation:{draw:p=>calls.push(p)}},'draw',()=>calls.push('before'),()=>calls.push('after'));assert.deepEqual(calls,hidden?['before','after']:['before','draw','after']);}});
test('instrumentation refuses missing or duplicate anchors',()=>{for(const source of ['', 'resources.singleOwnerVegetation?.draw(packet);resources.singleOwnerVegetation?.draw(packet);'])assert.throws(()=>instrumentRenderer(source),/ANCHOR_NOT_UNIQUE/);assert.throws(()=>instrumentRoute('const cssWidth=1;const cssWidth=2'),/ANCHOR_NOT_UNIQUE/);assert.equal(instrumentRoute('const cssWidth=1;'),'globalThis.__HEarthAuditPresent=present;globalThis.__HEarthAuditPacket=createHEarthRun8ER3AFrameUniformPacket;\nconst cssWidth=1;');});
test('frame accepts matched source pose at saved resolution',()=>assert.equal(validateFrame(fixture(),POSES[0],10001),true));
test('frame rejects stale navigation, wrong camera, resolution and pose',()=>{for(const mutate of [x=>x.lastFrame.navigationSequence--,x=>x.lastFrame.cameraPosition.y++,x=>x.canvas.width++,x=>x.state.pitchDegrees++,x=>x.state.verticalFovDegrees=60,x=>x.lastFrame.frameSequence=NaN]){const v=fixture();mutate(v);assert.throws(()=>validateFrame(v,POSES[0],10001));}});
test('CLI rejects arbitrary inputs and overlapping output',()=>{assert.throws(()=>parseArgs(['--command','echo hello']),/CLI_NOT_CLOSED/);assert.throws(()=>parseArgs(['--baseline-dir','a']),/CLI_INCOMPLETE/);assert.throws(()=>parseArgs(['--baseline-dir','a','--candidate-dir','b','--output','a']),/DIRECTORIES_NOT_DISTINCT/);assert.equal(Object.keys(parseArgs(['--baseline-dir','a','--candidate-dir','b','--output','c'])).length,3);});
test('workflow isolates fixed mode and preserves fixed full checkout guards',()=>{const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');assert.match(y,/inputs\.route_query != 'qualification=gen2711-grass-beach-fast-v1' && inputs\.route_query != 'qualification=ground-material-gen2898-stage-c' && inputs\.route_query != 'qualification=groundcover-factor-v1'/);assert.match(y,/focused-grass-beach:\n    if: \$\{\{ inputs\.route_query == 'qualification=gen2711-grass-beach-fast-v1' \}\}/);assert.match(y,/ground-material-comparison:\n    if: \$\{\{ inputs\.route_query == 'qualification=groundcover-factor-v1' \}\}/);assert.ok(y.includes('ref: '+HEADS.baseline));assert.ok(y.includes('ref: '+HEADS.candidate));assert.match(y,/timeout 2400s node tools\/h-earth-ground-material-comparison.v1.mjs/);assert.match(y,/Preserve comparison evidence even on failure\n        if: always\(\)/);});

test('heading compares equivalent finite angles while rejecting real drift',()=>{for(const [a,b] of [[210,-150],[180,-180],[0,360],[-720,0]])assert.equal(sameHeading(a,b),true);for(const [a,b] of [[210,-149],[NaN,210],[Infinity,210],[210,undefined]])assert.equal(sameHeading(a,b),false);});
test('real archived projected camera differs from navigation and passes only with packet projection',()=>{const v=fixture();v.state.position={x:18,y:30.744426662719086,z:-226};v.lastFrame.cameraPosition={x:18.00131674407191,y:30.683231708826497,z:-226.0165324533473};v.expectedCameraPosition={...v.lastFrame.cameraPosition};assert.equal(validateFrame(v,POSES[0],10001),true);v.expectedCameraPosition={...v.state.position};assert.throws(()=>validateFrame(v,POSES[0],10001),/FRAME_CAMERA_MISMATCH/);});

test('asset readiness rejects asynchronous partial scenes and failed assets',()=>{
 const r={jacaranda:{focusId:'original',state:'READY',ready:true,targetAnchor:{x:0,z:0}},treeCollection:{queue:{loading:false,failures:{}},entries:[{id:'tree',state:'IDLE',ready:false,x:10,z:0}]}};
 assert.equal(assetReadiness(r,{x:0,z:0}).ready,false);r.treeCollection.entries[0].state='READY';assert.equal(assetReadiness(r,{x:0,z:0}).ready,true);
 r.treeCollection.queue.loading=true;assert.equal(assetReadiness(r,{x:0,z:0}).ready,false);r.treeCollection.queue.loading=false;
 r.treeCollection.entries[0].state='FALLBACK';assert.throws(()=>assetReadiness(r,{x:0,z:0}),/ASSET_FAILURE/);
 assert.throws(()=>assetReadiness({},{}),/ASSET_RECEIPT_MISSING/);
});

test('wrong checkout identity fails before browser loading and preserves failure receipt',async()=>{
 const {run}=await import('./h-earth-ground-material-comparison.v1.mjs');
 const {mkdtempSync,rmSync,mkdirSync,readFileSync}=await import('node:fs');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {execFileSync}=await import('node:child_process');
 const root=mkdtempSync(join(tmpdir(),'ground-runner-test-'));const baseline=join(root,'baseline'),candidate=join(root,'candidate'),output=join(root,'output');
 try{mkdirSync(baseline);mkdirSync(candidate);execFileSync('git',['init','-q',baseline]);execFileSync('git',['-C',baseline,'-c','user.name=Test','-c','user.email=test@local','commit','--allow-empty','-qm','test']);
 await assert.rejects(run(['--baseline-dir',baseline,'--candidate-dir',candidate,'--output',output]),/CHECKOUT_HEAD_MISMATCH/);
 const receipt=JSON.parse(readFileSync(join(output,'receipt.json')));assert.equal(receipt.result,'INCOMPLETE_OR_FAILED');assert.equal(receipt.views.length,0);assert.match(receipt.errors[0],/CHECKOUT_HEAD_MISMATCH/);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('collection instance proximity uses placement rather than inherited original anchor',()=>{
 const r={jacaranda:{focusId:'original',state:'READY',ready:true,targetAnchor:{x:1000,z:1000}},treeCollection:{queue:{loading:false,failures:{}},entries:[{focusId:'instance',state:'IDLE',ready:false,x:10,z:0,targetAnchor:{x:1000,z:1000}}]}};
 assert.equal(assetReadiness(r,{x:0,z:0}).ready,false);
});


test('raw PNG capture rejects changed frames, empty data and wrong dimensions',()=>{
 const png=Buffer.alloc(2048);Buffer.from([137,80,78,71,13,10,26,10]).copy(png);png.write('IHDR',12);png.writeUInt32BE(529,16);png.writeUInt32BE(980,20);
 const frame={navigationSequence:10003,frameSequence:78};const make=()=>({before:{...frame},after:{...frame},dataUrl:'data:image/png;base64,'+png.toString('base64')});
 assert.deepEqual(decodeCanvasCapture(make(),frame),png);
 for(const key of ['before','after'])for(const field of ['navigationSequence','frameSequence']){const c=make();c[key][field]++;assert.throws(()=>decodeCanvasCapture(c,frame),/CAPTURE_FRAME_CHANGED/);}
 const bad=make();bad.dataUrl='data:,';assert.throws(()=>decodeCanvasCapture(bad,frame),/CAPTURE_PNG_INVALID/);
 bad.dataUrl='data:image/png;base64,AAAA';assert.throws(()=>decodeCanvasCapture(bad,frame),/EMPTY_CAPTURE/);
 png.writeUInt32BE(540,16);assert.throws(()=>decodeCanvasCapture(make(),frame),/CAPTURE_PNG_DIMENSIONS_INVALID/);
});


test('five finite observer views never claim accepted traversal or inherit support',()=>{
 assert.equal(POSES.length,12);
 assert.deepEqual(POSES.slice(4,9).map(p=>[p.x,p.z,p.yaw,p.pitch]),[[-200,-728,0,-14],[-200,-704,0,-4],[-200,-656,0,-2],[376,-96,90,-14],[-376,-96,270,-14]]);
 const nav={H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID:'test',auditResolvePosition(){throw Error('OBSERVER_CALLED_NAVIGATION');}};
 for(const pose of POSES.slice(4,9)){
  const state=comparisonState(nav,pose,42,'DIAGNOSTIC');
  assert.equal(state.accepted,false);assert.equal(state.terrainSupported,false);assert.equal(state.geologicalPhysicalSupport,false);assert.equal(state.selectedSemanticAddressId,undefined);
  const v={...fixture(),state,lastFrame:{navigationSequence:42,frameSequence:1,cameraPosition:{...state.position}},expectedCameraPosition:{...state.position}};
  assert.equal(validateFrame(v,pose,42),true);
  for(const key of ['accepted','terrainSupported','geologicalPhysicalSupport']){const bad=structuredClone(v);bad.state[key]=true;assert.throws(()=>validateFrame(bad,pose,42),/DIAGNOSTIC_AUTHORITY_MISMATCH/);}
 }
 assert.throws(()=>comparisonState(nav,{...POSES[4],y:NaN},42,'DIAGNOSTIC'),/DIAGNOSTIC_POSE_INVALID/);
});
test('ordinary preservation poses still reject ineligible navigation',()=>assert.throws(()=>comparisonState({auditResolvePosition:()=>({eligible:false})},POSES[0],1,'TEST'),/POSE_INELIGIBLE/));

test('three local patch views are finite ordinary navigation inputs',()=>{assert.deepEqual(POSES.slice(9).map(p=>[p.x,p.z,p.yaw,p.pitch]),[[88,-236,180,-17.72],[92,-232,270,-6.69],[84,-232,90,-13.5]]);for(const p of POSES.slice(9)){assert.equal(p.diagnosticObserver,undefined);assert.ok(p.x>=-256&&p.x<=256&&p.z>=-400&&p.z<=-80);}});

const diagnostic=await import('./h-earth-ground-material-comparison.v1.mjs');
test('Gen2928 bounded provisional high-patch blend is exact source-reversible, monotonic and keeps protections',()=>{
 const shader=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const digest=diagnostic.verifyExactMaterialCandidate(shader);
 assert.match(digest,/^[0-9a-f]{64}$/);
 assert.equal(shader.split(diagnostic.CANDIDATE_BLEND_EXPRESSION).length,2);
 assert.ok(shader.includes('smoothstep(28.0,72.0,max(0.0,vCoastDistanceMeters))'));
 assert.ok(shader.includes('(1.0-protectedGrove)'));
 assert.ok(shader.includes('palette=mix(palette,groundcoverTone,groundcoverWeight);'));
 const smooth=t=>{const x=Math.max(0,Math.min(1,(t-0.30)/0.55));return x*x*(3-2*x);};
 const corrected=p=>0.88*p*(1-0.25*smooth(p));
 let last=-1;
 for(let i=0;i<=1000;i++){const p=i/1000, v=corrected(p);assert.ok(v>=last-1e-12);assert.ok(v<=0.88*p+1e-12);last=v;}
 assert.equal(corrected(0),0);assert.ok(corrected(1)<=0.661);assert.ok(corrected(1)>=0.659);
 assert.throws(()=>diagnostic.verifyExactMaterialCandidate(shader+'//unexpected'),/NOT_EXACT_ONE_FORMULA_DIFF/);
});
test('Gen2928 four-source survey preserves Gen2925 and stays under twenty frames',()=>{
 assert.deepEqual(diagnostic.SURVEY_POSES.map(p=>p.name),['inland-seam-near','inland-seam-far','coastal-seam-east','coast-oblique']);
 assert.deepEqual(diagnostic.SURVEY_MODES,['reference-lit','before-groundcover-unlit','after-groundcover-unlit','patch-weight-raw','groundcover-weight-raw']);
 assert.equal(diagnostic.SURVEY_POSES.length*diagnostic.SURVEY_MODES.length,20);
 assert.equal(diagnostic.DIAGNOSTIC_POSES.length*diagnostic.DIAGNOSTIC_MODES.length,18);
 const ids=new Map([['reference-lit',0],['before-groundcover-unlit',2],['after-groundcover-unlit',3],['patch-weight-raw',5],['groundcover-weight-raw',11]]);
 const views=diagnostic.SURVEY_POSES.flatMap(pose=>diagnostic.SURVEY_MODES.map(mode=>({pose,mode,modeId:ids.get(mode),grassHidden:true,diagnosticApplied:ids.get(mode),assetSignature:'same',sourceHead:diagnostic.HEADS.candidate,rendererHash:diagnostic.RENDERER_SHA256,state:{position:{x:pose.x,y:pose.y??2,z:pose.z}},lastFrame:{cameraPosition:{x:18,y:2,z:-226}}})));
 assert.equal(diagnostic.validateDiagnosticSet(views,diagnostic.SURVEY_POSES,diagnostic.SURVEY_MODES),true);
 assert.throws(()=>diagnostic.validateDiagnosticSet(views.slice(1),diagnostic.SURVEY_POSES,diagnostic.SURVEY_MODES),/INCOMPLETE/);
});
test('two distinct source-bound cameras and nine factor modes stay under twenty-frame cap',()=>{
 assert.deepEqual(diagnostic.DIAGNOSTIC_MODES,['reference-lit','final-unlit','before-groundcover-unlit','after-groundcover-unlit','patch-weight-raw','suitability-raw','protection-raw','groundcover-weight-raw','final-unlit-no-groundcover']);
 assert.equal(diagnostic.DIAGNOSTIC_POSES.length,2);
 assert.equal(diagnostic.DIAGNOSTIC_MODES.length*diagnostic.DIAGNOSTIC_POSES.length,18);
 assert.equal(diagnostic.DIAGNOSTIC_POSES[0].name,'inland-seam-near');
 assert.equal(diagnostic.DIAGNOSTIC_POSES[1].name,'coast-oblique');
 assert.equal(diagnostic.DIAGNOSTIC_POSES[0].diagnosticObserver,true);
 assert.equal(diagnostic.SEARCH_PROVENANCE.exactScreenshotMatchProven,false);
 assert.throws(()=>diagnostic.instrumentDiagnosticRenderer('changed'),/SOURCE_HASH_MISMATCH/);
});
test('eighteen frames require exact factor mode IDs, two cameras and matched assets',()=>{
 const ids=[0,1,2,3,5,6,7,11,13];
 const views=diagnostic.DIAGNOSTIC_POSES.flatMap(pose=>diagnostic.DIAGNOSTIC_MODES.map((mode,i)=>({pose,mode,modeId:ids[i],grassHidden:true,diagnosticApplied:ids[i],assetSignature:'same',sourceHead:diagnostic.HEADS.candidate,rendererHash:diagnostic.RENDERER_SHA256,state:{position:{x:pose.x,y:pose.y??2,z:pose.z}},lastFrame:{cameraPosition:{x:18,y:2,z:-226}}})));
 assert.equal(diagnostic.validateDiagnosticSet(views),true);
 assert.throws(()=>diagnostic.validateDiagnosticSet(views.slice(1)),/INCOMPLETE/);
 for(const mutate of [v=>v[1].mode='reference',v=>v[1].diagnosticApplied=2,v=>v[1].assetSignature='changed',v=>v[1].sourceHead='wrong',v=>v[1].state.position.x++,v=>v[1].lastFrame.cameraPosition.y++]){
  const copy=structuredClone(views);mutate(copy);assert.throws(()=>diagnostic.validateDiagnosticSet(copy));
 }
});
test('no product change: overlay only allowed with published SHA; all vegetation draw guards preserved',()=>{
 assert.ok(diagnostic.RENDERER_SHA256.match(/^[0-9a-f]{64}$/));
 assert.equal(diagnostic.HEADS.baseline,diagnostic.HEADS.candidate);
 assert.equal(diagnostic.DIAGNOSTIC_MODES.length,9);
 const source='resources.singleOwnerVegetation?.draw(packet);';
 assert.equal(instrumentRenderer(source),'if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);');
});


// Gen3147: contract-only checks; no product renderer or historical profile mutation.
const gen3142=await import('./h-earth-ground-material-comparison.v1.mjs');
function gen3142View(pose,label){
  const owner=pose.owner===true;
  const position=owner?{...gen3142.GEN3142_MATCHED.navigationPosition}:{x:pose.x,y:2.25,z:pose.z};
  const camera=owner?{...gen3142.GEN3142_MATCHED.camera}:{...position};
  return {label,pose,worldEntered:true,loaderMode:'entered',loaderDomMode:'ready',loaderHidden:true,routeReady:true,
    state:{sequence:22001,position,yawDegrees:pose.yaw,pitchDegrees:pose.pitch,verticalFovDegrees:56},
    lastFrame:{navigationSequence:22001,frameSequence:101,cameraPosition:camera},
    packetCamera:{position:camera,viewProjectionMatrix:owner?[...gen3142.GEN3142_MATCHED.matrix]:new Array(16).fill(1)},
    canvas:{width:384,height:688,cssWidth:384,cssHeight:688},
    glVersion:'WebGL 2.0 (OpenGL ES 3.0 Chromium)',glslVersion:'WebGL GLSL ES 3.00',
    glError:0,contextLost:false,framebufferPresentations:3,
    pixelPatch:{radius:12,rgba:new Array(25*25*4).fill(42)},assetSignature:'same-healthy-asset-state',
    image:label+'-'+pose.name+'.png',imageSha256:'sha256-placeholder'};
}
test('Gen3142 is immutable camera-locked new profile, old comparator head stays historical',()=>{
  assert.equal(gen3142.GEN3142_MATCHED.baseline,'bcfb0650077323851f01f51d712c7f8b8ac39220');
  assert.equal(gen3142.GEN3142_MATCHED.candidate,'7610827598eaadf4fbb92e7ec8b9371c8cd08581');
  assert.equal(gen3142.GEN3142_MATCHED.rendererBlobs.baseline,'85ee835060d5106a670077a5f4352b7ad202b49b');
  assert.equal(gen3142.GEN3142_MATCHED.rendererBlobs.candidate,'9fe90b5c0e58fb3a121c910cb0110a0846bf07bc');
  assert.deepEqual(gen3142.GEN3142_MATCHED.pixel,{x:201,y:337});
  assert.deepEqual(gen3142.GEN3142_MATCHED.viewport,{width:384,height:688});
  assert.deepEqual(gen3142.GEN3142_MATCHED_POSES.map(x=>x.name),['owner-frame2583','meadow-control','grove-control','slope-control','coast-control']);
  assert.equal(gen3142.HEADS.baseline,'60b3c07f0216645119a1b92b16dac82cae739145');
});
test('Gen3142 exact entered WebGL2 original frame and matching protection controls produce 5 pairs',()=>{
  const views=gen3142.GEN3142_MATCHED_POSES.flatMap(p=>['baseline','candidate'].map(l=>gen3142View(p,l)));
  for(const view of views)assert.equal(gen3142.gen3142ValidateView(view,view.pose),true);
  const comparisons=gen3142.gen3142CompareViews(views);
  assert.equal(comparisons.length,5);
  assert.equal(comparisons[0].ownerMarkedPixel,true);
  assert.equal(comparisons[0].meanAbsoluteRGBA8PatchDifference,0);
  assert.equal(comparisons[1].ownerMarkedPixel,false);
});
test('Gen3142 fails closed on loader, camera, viewport, projection, WebGL, frames, asset and pair drift',()=>{
  const p=gen3142.GEN3142_MATCHED_POSES[0],control=gen3142.GEN3142_MATCHED_POSES[1];
  for(const change of [
    v=>v.worldEntered=false,v=>v.loaderMode='ready',v=>v.loaderDomMode='test',v=>v.loaderHidden=false,v=>v.routeReady=false,
    v=>v.state.position.y++,v=>v.packetCamera.position.x++,v=>v.packetCamera.viewProjectionMatrix[12]++,
    v=>v.canvas.height++,v=>v.canvas.cssWidth++,v=>v.glError=1282,
    v=>v.glVersion='WebGL 1.0',v=>v.glslVersion='WebGL GLSL ES 1.00',
    v=>v.lastFrame.navigationSequence++,v=>v.lastFrame.frameSequence=0,
    v=>v.pixelPatch.rgba.pop(),v=>v.framebufferPresentations=0
  ]){const v=gen3142View(p,'baseline');change(v);assert.throws(()=>gen3142.gen3142ValidateView(v,p));}
  const views=gen3142.GEN3142_MATCHED_POSES.flatMap(q=>['baseline','candidate'].map(l=>gen3142View(q,l)));
  assert.throws(()=>gen3142.gen3142CompareViews(views.slice(1)),/INCOMPLETE/);
  views.find(v=>v.pose.name===control.name&&v.label==='candidate').assetSignature='changed';
  assert.throws(()=>gen3142.gen3142CompareViews(views),/ASSET_STATE_MISMATCH/);
  views.find(v=>v.pose.name===control.name&&v.label==='candidate').assetSignature='same-healthy-asset-state';
  views.find(v=>v.pose.name===control.name&&v.label==='candidate').packetCamera.viewProjectionMatrix[1] += .01;
  assert.throws(()=>gen3142.gen3142CompareViews(views),/AB_PROJECTION_MISMATCH/);
});
test('Gen3142 workflow profile cannot fall into generic exact-head or historical qualification modes',()=>{
  const workflow=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
  assert.match(workflow,/inputs\.route_query != 'qualification=gen3142-owner-frame-v1'/);
  assert.match(workflow,/gen3142-matched-gpu:/);
  assert.ok(workflow.includes("inputs.route_query == 'qualification=gen3142-owner-frame-v1'"));
  assert.ok(workflow.includes("H_EARTH_COMPARISON_PROFILE: GEN3142_OWNER_FRAME_V1"));
  assert.ok(workflow.includes('ref: bcfb0650077323851f01f51d712c7f8b8ac39220'));
  assert.ok(workflow.includes('ref: 7610827598eaadf4fbb92e7ec8b9371c8cd08581'));
  assert.match(workflow,/ground-material-comparison:\n    if: \$\{\{ inputs\.route_query == 'qualification=groundcover-factor-v1' \}\}/);
});

test('Gen3147 entry proof follows actual immutable loader internal mode rather than stale DOM data-mode',()=>{
  // The immutable product loader contract was source-verified against both frozen heads.
  // This native test runs in the workflow's tooling-only sparse checkout.
  const comparator=fs.readFileSync(new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url),'utf8');
  assert.ok(comparator.includes("H_EARTH_STARTUP_LOADER?.getReceipt?.().mode==='entered'"));
  assert.ok(comparator.includes("shell?.hidden===true&&shell?.dataset.mode==='ready'"));
  assert.ok(comparator.includes("loaderMode:globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.().mode"));
  assert.ok(comparator.includes("loaderHidden:loading?.hidden===true"));
  assert.ok(comparator.includes("loaderDomMode:loading?.dataset.mode"));
  assert.ok(!comparator.includes("dataset.mode==='entered'"));
});

test('Gen3287 exact material comparison binds restored Gen3259 against immutable Gen3286 only',async()=>{
  const x=await import('./h-earth-ground-material-comparison.v1.mjs');
  const p=x.GEN3286_MATCHED;
  assert.equal(p.heads.baseline,'f05d97d402f27b640e8776a0c9f0851524db0fa0');
  assert.equal(p.heads.candidate,'676cb926180219d62ff4fd4a356d8360ff66d99b');
  assert.equal(p.renderer.baseline,'3471d386d720382b1b55b146fef6fa0af61f0d36');
  assert.equal(p.renderer.candidate,'38def850ac126f2766aec7bab3b43efea8f04ccc');
  assert.equal(x.HEADS.baseline,'60b3c07f0216645119a1b92b16dac82cae739145');
  assert.equal(p.viewports.length,2);
  assert.deepEqual(p.viewports.map(v=>v.id),['mobile-sized','desktop']);
  assert.equal(p.poses.length,8);
  assert.ok(p.poses.some(v=>v.id==='defective-open-grassland'));
  assert.equal(Object.keys(p.protectedBlobs).length,4);
  for(const value of Object.values(p.protectedBlobs))assert.match(value,/^[a-f0-9]{40}$/);
});
test('Gen3287 rejects source label, pair camera, projection, asset or PNG identity mismatch',async()=>{
  const x=await import('./h-earth-ground-material-comparison.v1.mjs');
  assert.throws(()=>x.gen3286VerifySource('/absent','unknown'),/SOURCE_LABEL/);
  const view=label=>({
    label,pose:{id:'reference'},viewport:{id:'desktop'},
    assetSignature:'same-assets',
    camera:{position:{x:18,y:20,z:-226},matrix:Array.from({length:16},(_,i)=>i/16)},
    png:{width:1024,height:768},image:label+'.png',imageSha256:'test',frame:{responseMs:12}
  });
  const good=x.gen3286ValidatePair(view('baseline'),view('candidate'));
  assert.equal(good.cameraMatched,true);assert.equal(good.projectionMatched,true);
  for(const change of [
    v=>v.assetSignature='different',
    v=>v.camera.position.y+=0.1,
    v=>v.camera.matrix[5]+=0.02,
    v=>v.png.width--,
    v=>v.pose.id='wrong'
  ]){const candidate=view('candidate');change(candidate);assert.throws(()=>x.gen3286ValidatePair(view('baseline'),candidate));}
});
test('Gen3287 historical source-chain guards remain present and new job has immutable A/B bindings',()=>{
  const yaml=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
  assert.ok(yaml.includes('gen3287-matched-material-gpu:'));
  assert.ok(yaml.includes('H_EARTH_COMPARISON_PROFILE: GEN3286_MATERIAL_AB_V1')||yaml.includes('H_EARTH_COMPARISON_PROFILE: GEN3286_WITNESS_SCOUT_V1')||yaml.includes('H_EARTH_COMPARISON_PROFILE: GEN3288_CAUSAL_MATERIAL_V1')||yaml.includes('H_EARTH_COMPARISON_PROFILE: GEN3288_HANDOFF_EDGE_V1')||yaml.includes('H_EARTH_COMPARISON_PROFILE: GEN3288_EXACT_PRODUCT_AB_V1'));
  assert.ok(yaml.includes("ref: f05d97d402f27b640e8776a0c9f0851524db0fa0"));
  assert.ok(yaml.includes("ref: 676cb926180219d62ff4fd4a356d8360ff66d99b")||yaml.includes("ref: 5e34efff49822073a3335c9797c013fb8f499cd7"));
  assert.ok(yaml.includes("test \"$sector_blob\" = c26247dcb69cb52c968fcd3ef6c2626eaa577d03"));
  assert.ok(yaml.includes("test \"$sector_blob\" = edd3c2047d3d062eb8d60325410af8ae8f3a6fa5"));
  assert.ok(yaml.includes('node h-earth-3d/validation/h-earth.four-tree-fine-grass.v1.mjs --source-binding-only'));
  assert.ok(yaml.includes('H_EARTH_GEN3287_EXACT_GEN3259_GEN3286_SOURCE_BINDING_v1'));
  assert.ok(yaml.includes('h-earth/gen3286-matched-webgl-verifier-20261114'));
  assert.ok(yaml.includes('gen3142-matched-gpu:'));
  assert.ok(yaml.includes('ground-material-comparison:'));
});

test('Gen3287 audit packet follows the accepted live route deferVegetation true path; never requests the non-route BARK package',()=>{
  const comparator=fs.readFileSync(new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url),'utf8');
  const route=fs.readFileSync(new URL('../showroom/globe/h-earth/vegetation-prototype/route.js',import.meta.url),'utf8');
  assert.ok(route.includes('createHEarthRun8ER3AFrameUniformPacket({deferVegetation:true,navigationState:state'));
  assert.equal((comparator.match(/deferVegetation:false/g)||[]).length,0);
  assert.ok(comparator.includes("GEN3286_MATCHED_REAL_WEBGL"));
  assert.ok(comparator.includes('deferVegetation:true,navigationState:state'));
});

test('Gen3287 scout uses desktop canvas-relative genuine pointer interaction and refuses invented meadow/seam acceptance',async()=>{
  const tool=await import('./h-earth-ground-material-comparison.v1.mjs');
  const source=fs.readFileSync(new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url),'utf8');
  const workflow=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
  assert.equal(tool.GEN3286_WITNESS_SCOUT_POSES.length,16);
  assert.ok(tool.GEN3286_WITNESS_SCOUT_POSES.some(p=>p.x===145&&p.z===-225));
  assert.ok(tool.GEN3286_WITNESS_SCOUT_POSES.some(p=>p.x===-141&&p.z===-226));
  assert.ok(source.includes("page.locator('#h-earth-functional-landscape-canvas').boundingBox()"));
  assert.ok(source.includes("GEN3286_REAL_CANVAS_ENTRY_NOT_UNLOCKED"));
  assert.ok(source.includes("classification:'NOT_A_NAVIGABLE_CAMERA'"));
  assert.ok(source.includes('receipt.rejectedWitnesses'));
  assert.ok(!tool.GEN3286_WITNESS_SCOUT_POSES.some(p=>p.x===130.241846&&p.z===-250));
  assert.ok(source.includes("poseAuthority:'UNQUALIFIED_UNTIL_ACTUAL_SCREENSHOT_VISIBLE'"));
  const gen3286Section=source.slice(source.indexOf('export async function runGen3286('),source.indexOf('export async function run(argv){'));
  assert.ok(!gen3286Section.includes('page.mouse.move(160,240);await page.mouse.down()'));
  assert.ok(source.includes('page.mouse.move(160,240);await page.mouse.down()')); // immutable historical Gen3142 profile
  assert.ok(workflow.includes('H_EARTH_COMPARISON_PROFILE: GEN3288_EXACT_PRODUCT_AB_V1'));
  assert.ok(workflow.includes('ref: f05d97d402f27b640e8776a0c9f0851524db0fa0'));
  assert.ok(workflow.includes('ref: 5e34efff49822073a3335c9797c013fb8f499cd7'));
});


// Gen3288: four ephemeral browser-response GLSL variants; accepted checkout
// remains byte-identical and every candidate mode edits exactly one operand.
test('Gen3288 four exact-source material operands preserve product bytes',async()=>{
  const m=await import('./h-earth-ground-material-comparison.v1.mjs');
  const baseline=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
  assert.deepEqual(m.GEN3288_CAUSAL_MODES,['baseline','occupancy-off','habitat-off','groundcover-off']);
  assert.deepEqual(m.GEN3288_CAUSAL_POSES.map(p=>p.id),['woodland-grove-a-control','woodland-core-b-control','official-ridge-east','seam-overlap-edge']);
  assert.equal(m.gen3288CausalShaderSource(baseline,'baseline'),baseline);
  const matcher=fs.readFileSync(new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url),'utf8');
  assert.ok(matcher.includes("gen3286VerifySource(dir,browserVariation?'baseline':label)"));
  assert.ok(matcher.includes('passes:browserVariation?3:8'));
  assert.ok(matcher.includes("(scout||browserVariation)?[GEN3286_MATCHED.viewports.find(v=>v.id==='desktop')]") );
  assert.ok(matcher.includes('receipt.views.length!==16||receipt.comparisons.length!==12'));
  for(const mode of m.GEN3288_CAUSAL_MODES.slice(1)){
    const candidate=m.gen3288CausalShaderSource(baseline,mode);
    assert.notEqual(candidate,baseline);
    assert.equal(candidate.length>100000,true);
  }
});


test('Gen3288 same-camera primitive ID and combined treatments are browser-only',async()=>{
  const m=await import('./h-earth-ground-material-comparison.v1.mjs');
  const renderer=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
  assert.deepEqual(m.GEN3288_EDGE_HANDOFF_MODES,['baseline','primitive-id','combined-off','grass-off']);
  assert.equal(m.gen3288HandoffSource(renderer,'baseline'),renderer);
  for(const mode of m.GEN3288_EDGE_HANDOFF_MODES.slice(1)){
    const candidate=m.gen3288HandoffSource(renderer,mode);
    assert.notEqual(candidate,renderer);
    assert.ok(candidate.length>100000);
  }
  assert.ok(m.gen3288HandoffSource(renderer,'primitive-id').includes('vPrimitiveIndex>>16u'));
  assert.ok(m.gen3288HandoffSource(renderer,'grass-off').includes('if(false)resources.singleOwnerVegetation?.draw(packet);'));
});


test('Gen3288 exact immutable product A/B source and desktop/mobile witness binding',async()=>{
  const m=await import('./h-earth-ground-material-comparison.v1.mjs');
  const p=m.GEN3288_PRODUCT_AB;
  assert.equal(p.heads.baseline,m.GEN3286_MATCHED.heads.baseline);
  assert.equal(p.heads.candidate,'5e34efff49822073a3335c9797c013fb8f499cd7');
  assert.equal(p.renderer.candidate,'1ddf627292372e47feab8e9c9ef183e3aa1a3dc2');
  assert.equal(p.index.candidate,'77a60951dd2368902471d62b160de0ee19329ebf');
  assert.equal(p.candidateRootCount,3805291);
  assert.deepEqual(p.viewports.map(v=>v.id),['desktop','mobile-sized']);
  assert.deepEqual(p.poses.map(x=>x.id),['woodland-grove-a-control','woodland-core-b-control','official-ridge-east','seam-overlap-edge']);
  const comparator=fs.readFileSync(new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url),'utf8');
  assert.ok(comparator.includes('gen3288ProductVerifySource(dir,label)'));
  assert.ok(comparator.includes('receipt.views.length!==16||receipt.comparisons.length!==8'));
});
