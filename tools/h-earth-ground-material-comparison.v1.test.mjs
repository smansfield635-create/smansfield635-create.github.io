import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
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
 // Preserve the historical Gen2928 source identity, never test today's unrelated renderer.
 const historical='39ed43d987d5f62c1368e7c309faa1a1b3d731b6';
 const historicalPath='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
 const shader=execFileSync('git',['show',historical+':'+historicalPath],{encoding:'utf8'});
 const blob=execFileSync('git',['hash-object','--stdin'],{input:shader,encoding:'utf8'}).trim();
 assert.equal(blob,'2ae6c42f6febaada2cb2a240844b9fddc5b9ed8e');
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

/* Gen3042 exact-head comparison: only the historical positive inland band plus
   two healthy controls; source-matched independent candidates, no stacked shader. */
test('Gen3042 frozen sources and three prior poses are independently pinned',async()=>{
 const t=await import('./h-earth-ground-material-comparison.v1.mjs');
 assert.deepEqual(t.GEN3042_HEADS,{
  baseline:'28da29ce01f26bf5eb73db2d75b09741b22ab40b',
  candidate:'724efeb1db3d3e8e5309a9aa779acefb7c53fed9',
  habitat:'cb15de477f9b8e39b9dc688ecc452ba44e42e6c1'
 });
 assert.deepEqual(t.GEN3042_BLOBS,{
  baseline:'85ee835060d5106a670077a5f4352b7ad202b49b',
  candidate:'40034a16c36a43cb02682564784328ddb7ac48a7',
  habitat:'03bc45e034e9894494d9120782c714ae78890ab8'
 });
 assert.deepEqual(t.GEN3042_POSES.map(p=>p.name),['inland-seam-near','coast-oblique','foothill-west']);
 assert.deepEqual(t.GEN3042_MODES,['reference-lit','before-groundcover-unlit','after-groundcover-unlit','groundcover-weight-raw']);
 assert.equal(t.GEN3042_POSES.length*t.GEN3042_MODES.length*Object.keys(t.GEN3042_HEADS).length,36);
 assert.equal(t.GEN3042_POSES[0].diagnosticObserver,true);
});
test('Gen3042 full 36-frame source/camera/unchanged-stage custody rejects corruption',async()=>{
 const t=await import('./h-earth-ground-material-comparison.v1.mjs');
 const ids={'reference-lit':0,'before-groundcover-unlit':2,'after-groundcover-unlit':3,'groundcover-weight-raw':11};
 const views=t.GEN3042_POSES.flatMap(pose=>t.GEN3042_MODES.flatMap(mode=>
  Object.keys(t.GEN3042_HEADS).map(label=>({
   label,pose,mode,modeId:ids[mode],diagnosticApplied:ids[mode],
   grassHidden:mode!=='reference-lit',imageWidth:529,imageHeight:980,
   imageSha256:(['before-groundcover-unlit','groundcover-weight-raw'].includes(mode)?'d':label==='baseline'?'a':label==='candidate'?'b':'c').repeat(64),
   rendererHash:'a'.repeat(64),sourceHead:t.GEN3042_HEADS[label],
   assetSignature:'same-assets',state:{position:{x:pose.x,y:pose.y??2,z:pose.z}},
   lastFrame:{cameraPosition:{x:1,y:2,z:3}}
  }))));
 assert.equal(t.validateGen3042(views).images,36);
 assert.throws(()=>t.validateGen3042(views.slice(1)),/FRAME_CENSUS/);
 const drift=structuredClone(views);drift[4].imageSha256='e'.repeat(64);
 assert.throws(()=>t.validateGen3042(drift),/UNCHANGED_STAGE_DIFF|STAGE_INVALID/);
 const moved=structuredClone(views);moved[2].lastFrame.cameraPosition.x=4;
 assert.throws(()=>t.validateGen3042(moved),/CAMERA_ASSET_MISMATCH/);
 const missing=structuredClone(views);missing[0].sourceHead='wrong';
 assert.throws(()=>t.validateGen3042(missing),/SOURCE_STAGE_INVALID/);
});

test('Gen3059 source-only triad preserves CLI and disables consumed GPU event',async()=>{
 const {spawnSync}=await import('node:child_process');
 const code="import {parseArgs,HEADS,GEN3042_PROFILE} from './tools/h-earth-ground-material-comparison.v1.mjs';"+
 "if(!GEN3042_PROFILE||Object.keys(HEADS).length!==3)process.exit(12);"+
 "const a=parseArgs(['--baseline-dir','/tmp/base','--candidate-dir','/tmp/green','--habitat-dir','/tmp/hab','--output','/tmp/out']);"+
 "if(Object.keys(a).length!==4)process.exit(13);";
 const run=spawnSync(process.execPath,['--input-type=module','-e',code],{
  cwd:new URL('../',import.meta.url).pathname,encoding:'utf8',
  env:{...process.env,H_EARTH_COMPARISON_PROFILE:'GEN3042_SOIL_TRIAD_AB_V1'}
 });
 assert.equal(run.status,0,run.stderr||run.stdout);
 const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 const b=y.slice(y.indexOf('  gen3042-soil-triad-gpu-once:'));
 assert.equal(b.split('if: ${{ false }}').length,2);
 assert.equal(b.includes("github.event.action == 'reopened'"),false);
});

test('Gen3059 preserves four independent SHA-filtered sparse product trees and receipts',()=>{
 const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 const b=y.slice(y.indexOf('  gen3042-soil-triad-gpu-once:'));
 const roots=[['Gen3042 tooling','tooling','tools .github/workflows'],['baseline','baseline','showroom/globe/h-earth h-earth-3d'],['Gen3037 groundcover candidate','candidate','showroom/globe/h-earth h-earth-3d'],['Gen3030 habitat candidate','habitat','showroom/globe/h-earth h-earth-3d']];
 for(const [name,dir,paths] of roots){
  const i=b.indexOf('      - name: Checkout exact '+name+'\n');assert.ok(i>=0);
  const n=b.indexOf('\n      - name:',i+8);
  const step=b.slice(i,n<0?undefined:n);
  assert.ok(step.includes('git -C '+dir+' sparse-checkout init --cone --sparse-index'));
  assert.ok(step.includes('git -C '+dir+' sparse-checkout set '+paths));
  assert.ok(step.includes('git -C '+dir+' -c protocol.version=2 fetch --no-tags --depth=1 --filter=blob:none origin'));
  assert.ok(step.includes('git -C '+dir+' checkout --detach FETCH_HEAD'));
  assert.ok(step.includes('git -C '+dir+' rev-parse HEAD'));
  assert.ok(step.includes('status --porcelain --untracked-files=no'));
  assert.ok(!step.includes('uses: actions/checkout@v4'));
 }
 assert.equal((b.match(/sparse-checkout set/g)||[]).length,4);
 assert.ok(b.includes('INSUFFICIENT_FREE_BYTES_BEFORE_HABITAT'));
 assert.ok(b.includes('INSUFFICIENT_GPU_HEADROOM_BYTES'));
 assert.ok(b.includes('SPARSE_WORKTREE_OVER_BUDGET'));
 const receipt=b.indexOf('      - name: Gen3042 pre-habitat resource evidence');
 const upload=b.indexOf('      - name: Preserve Gen3042 pre-habitat resource evidence before fourth checkout');
 const fourth=b.indexOf('      - name: Checkout exact Gen3030 habitat candidate');
 assert.ok(receipt>=0&&upload>receipt&&fourth>upload);
 assert.ok(b.includes('      - name: Preserve Gen3042 pre-habitat resource evidence before fourth checkout\n        if: always()'));
 assert.ok(b.includes('post-habitat.txt'));
});

test('Gen3059 retains exact renderer blobs and native Node before Chromium',()=>{
 const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 const b=y.slice(y.indexOf('  gen3042-soil-triad-gpu-once:'));
 for(const sha of ['28da29ce01f26bf5eb73db2d75b09741b22ab40b','724efeb1db3d3e8e5309a9aa779acefb7c53fed9','cb15de477f9b8e39b9dc688ecc452ba44e42e6c1'])assert.ok(b.includes('FROZEN_SHA: '+sha));
 for(const sha of ['85ee835060d5106a670077a5f4352b7ad202b49b','40034a16c36a43cb02682564784328ddb7ac48a7','03bc45e034e9894494d9120782c714ae78890ab8'])assert.ok(b.includes(sha));
 const native=b.indexOf('Node22 exact-head comparator and product-source regression');
 const chromium=b.indexOf('Install first-party Chromium driver');
 const gpu=b.indexOf('Capture 36 real stage-aligned WebGL images');
 assert.ok(native>=0&&chromium>native&&gpu>chromium);
 assert.ok(b.includes('if: always()'));
 assert.ok(b.includes('h-earth-gen3042-checkout-evidence/'));
 assert.ok(b.includes('GEN3042_SOIL_TRIAD_AB_V1'));
 assert.ok(b.includes('39ed43d987d5f62c1368e7c309faa1a1b3d731b6'));
});

test('Gen3074 ravine source binding and stage boundary',async()=>{
 const m=await import('./h-earth-ground-material-comparison.v1.mjs');
 const overlay=await import('./h-earth-groundcover-factor-overlay.mjs');
 assert.deepEqual([m.RAVINE_HABITAT_TARGET.ravineWestEdge,m.RAVINE_HABITAT_TARGET.z],[-298,-546]);
 assert.equal(m.RAVINE_HABITAT_TARGET.cameraPoseQualified,false);
 assert.equal(m.RAVINE_HABITAT_MODES.length,10);
 assert.throws(()=>m.validateRavineHabitatCapture([],[]),/RAVINE_CAPTURE_CENSUS_INCOMPLETE/);
 const pathname=new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
 const original=fs.readFileSync(pathname,'utf8');
 const transformed=overlay.transformRavineHabitatRenderer(original);
 assert.equal(transformed.originalSha256,overlay.RAVINE_HABITAT_SOURCE_SHA256);
 assert.equal(transformed.productDiskMutation,false);
 assert.equal(transformed.modeCount,10);
 assert.ok(transformed.source.includes('uRavineHabitatProbeMode'));
 assert.ok(transformed.source.includes('ravineNativeHabitat=habitatCoverage;'));
 assert.ok(transformed.source.includes('ravineFilteredMaterial=habitatMaterialCoverage;'));
 assert.ok(transformed.source.includes('ravineBeforeHabitat=base;'));
 assert.ok(transformed.source.includes('if(uRavineHabitatProbeMode!=9)base=ravineAfterHabitat;'));
 assert.match(m.instrumentRavineHabitatRenderer(original),/groundComparisonHideGrass/);
 assert.throws(()=>overlay.transformRavineHabitatRenderer(original+'\n'),/SOURCE_HASH_MISMATCH/);
});

test('Gen3074 emitted-triangle observer is derived, detached and fail-closed',async()=>{
 const m=await import('./h-earth-ground-material-comparison.v1.mjs');
 const plane=()=>({y:10,role:'ERODED_TERRAIN'});
 const p=m.deriveRavineEmittedSurfaceObserver(plane,{name:'ravine-west',x:-298,z:-546});
 assert.deepEqual([p.referenceTarget.x,p.referenceTarget.y,p.referenceTarget.z],[-298,10,-546]);
 assert.equal(p.pitch,-42);
 assert.equal(p.ray.raySamples.length,25);
 assert.equal(p.ray.raySamples.at(-1).clearance,0);
 assert.equal(p.diagnosticObserver,true);
 assert.equal(p.sourceDerived,true);
 assert.equal(p.navigationEligible,false);
 assert.equal(p.firstHitAttributionAvailable,false);
 assert.equal(p.requiresGpuFirstHitReadback,true);
 assert.equal(p.ownerPhotoCorrespondence,false);
 const q=m.deriveRavineEmittedSurfaceObserver(plane,{name:'outside-habitat-control',x:-302,z:-546});
 assert.equal(q.referenceTarget.x,-302);
 assert.throws(()=>m.deriveRavineEmittedSurfaceObserver(plane,{name:'ravine-west',x:-297,z:-546}),/TARGET_NOT_FROZEN/);
 assert.throws(()=>m.deriveRavineEmittedSurfaceObserver(()=>null,{name:'ravine-west',x:-298,z:-546}),/SURFACE_NOT_AVAILABLE/);
 assert.throws(()=>m.deriveRavineEmittedSurfaceObserver((x,z)=>({y:z>-546&&z< -540?30:10,role:'ERODED_TERRAIN'}),{name:'ravine-west',x:-298,z:-546}),/RAY_OCCLUDED/);
});

test('Gen3074 pixel stage contract keeps roles, IDs and source projection fail-closed',async()=>{
 const mod=await import('./h-earth-ground-material-comparison.v1.mjs');
 const overlay=await import('./h-earth-groundcover-factor-overlay.mjs');
 assert.equal(mod.RAVINE_PIXEL_PROFILE,'RAVINE_VERIFIED_OBSERVER_PIXEL_STAGES_V1');
 const source=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const transformed=mod.instrumentRavineHabitatRenderer(source);
 for(const marker of [
  'uniform vec3 uRavineExpectedTargetWorld;',
  'length(vWorldPosition-uRavineExpectedTargetWorld)',
  'globalThis.__ravineProjectTarget',
  'globalThis.__ravineReadGeometryPixel',
  'gl.bindFramebuffer(gl.FRAMEBUFFER,resources.geometryFramebuffer)',
  "if(mode>0&&(!target||![target.x,target.y,target.z].every(Number.isFinite)))",
  'globalThis.__ravinePublishedGeologicalSurfaceAt'
 ])assert.ok(transformed.includes(marker),marker);
 assert.equal(overlay.RAVINE_HABITAT_PROBE_MODES.length,10);
 assert.equal(mod.RAVINE_HABITAT_CAPTURE_CEILING.maximumFrames,20);
 assert.equal(mod.RAVINE_HABITAT_TARGET.ownerPhotoMatchEstablished,false);
 const yaml=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 assert.ok(yaml.includes('H_EARTH_COMPARISON_PROFILE: RAVINE_VERIFIED_OBSERVER_PIXEL_STAGES_V1'));
 assert.ok(yaml.includes('assert.equal(p.views.length,20);'));
 assert.ok(yaml.includes('assert(p.pixelAttribution.firstHit.every(x=>x.firstHitPass===true));'));
});

test('WEST_FLANK Gen3079 exact two-pixel and six-stage lineage is pinned',async()=>{
 const m=await import('./h-earth-ground-material-comparison.v1.mjs');
 const o=await import('./h-earth-groundcover-factor-overlay.mjs');
 assert.equal(m.WEST_FLANK_PROFILE,'WEST_FLANK_OWNER_CLASS_MATERIAL_STAGES_V1');
 assert.deepEqual([m.WEST_FLANK_FROZEN_POSE.x,m.WEST_FLANK_FROZEN_POSE.y,m.WEST_FLANK_FROZEN_POSE.z],[110,8.346905947403934,-310]);
 assert.deepEqual([m.WEST_FLANK_FROZEN_POSE.yaw,m.WEST_FLANK_FROZEN_POSE.pitch],[153.434948822922,20.264510304722066]);
 assert.deepEqual(m.WEST_FLANK_PIXELS.map(p=>[p.x,p.y]),[[300,625],[300,650]]);
 assert.equal(m.WEST_FLANK_STAGE_SOURCE_BINDING.ownerPhonePhotoMatch,false);
 assert.equal(m.WEST_FLANK_STAGE_SOURCE_BINDING.actualCurrentTriangleProven,false);
 assert.equal(o.WEST_FLANK_STAGE_MODES.length,16);
 assert.deepEqual(o.WEST_FLANK_STAGE_MODES.slice(10),[
  'before-world-soil','after-world-soil','before-environmental-identity',
  'after-environmental-identity','before-groundcover','after-groundcover']);
 const original=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const source=o.transformWestFlankMaterialRenderer(original);
 assert.equal(source.modeCount,16);
 assert.equal(source.productDiskMutation,false);
 assert.equal(source.ownerPhotoCorrespondence,false);
 for(const anchor of ['westBeforeSoil=palette;','westAfterSoil=palette;',
  'westBeforeIdentity=palette;','westAfterIdentity=palette;',
  'westBeforeGroundcover=palette;','westAfterGroundcover=palette;',
  'uRavineHabitatProbeMode>=10','mode<0||mode>=16',
  'uRavineExpectedTargetWorld'])
  assert.ok(source.source.includes(anchor),anchor);
 assert.ok(m.instrumentRenderer(source.source).includes('if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet)'));
 const yaml=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 assert.ok(yaml.includes('WEST_FLANK_OWNER_CLASS_MATERIAL_STAGES_V1'));
});

test('NEAR_FAR_STRAIGHT Gen3087 retains inherited profiles and binds 30 spherical indexed first hits',async()=>{
  const m=await import('./h-earth-ground-material-comparison.v1.mjs');
  const o=await import('./h-earth-groundcover-factor-overlay.mjs');
  assert.equal(m.NEAR_FAR_STRAIGHT_PROFILE,'SOURCE_NEAR_FAR_STRAIGHT_BASELINE_V1');
  const b=m.NEAR_FAR_STRAIGHT_SOURCE_BINDING,p=m.NEAR_FAR_STRAIGHT_POSE;
  assert.equal(b.predecessorHead,'558ddc927296afb14574e3ee05a65b165f65467b');
  assert.equal(b.inheritedGen3079Head,'069f35028039f543fa39dfd255b70ac5fcac9c92');
  assert.equal(b.rendererBlob,'85ee835060d5106a670077a5f4352b49b');
  assert.equal(b.sourceArchiveSha256,'bb5c825f4323895802ad7fa0ccb1e204f69d4cdc07e25402ed8e2815d07e5569');
  assert.equal(b.preflightJsonSha256,'a8df23deded300604ae018044a8064ec67e12c99c4e911ea2ab0d2f2dac07cee');
  assert.equal(b.ownerPhotoCorrespondence,false);
  assert.equal(b.priorFailedGpuRun,41570553401);
  assert.deepEqual([p.x,p.y,p.z,p.yaw,p.pitch,p.sourceLookDistanceMetres],
    [-383.7,12,-460,180.26444018162007,-25,18]);
  assert.equal(p.diagnosticObserver,true);
  assert.equal(m.NEAR_FAR_STRAIGHT_STATIONS.length,15);
  assert.deepEqual(m.NEAR_FAR_STRAIGHT_STATIONS.map(q=>q.z),[-457,-456,-455,-454,-453,-450,-448,-445,-440,-435,-425,-415,-405,-395,-385]);
  assert.deepEqual([m.NEAR_FAR_STRAIGHT_STATIONS[0].far.pixel,m.NEAR_FAR_STRAIGHT_STATIONS[0].near.pixel,
    m.NEAR_FAR_STRAIGHT_STATIONS.at(-1).far.pixel,m.NEAR_FAR_STRAIGHT_STATIONS.at(-1).near.pixel],
    [[436,909],[217,909],[270,166],[257,166]]);
  for(const station of m.NEAR_FAR_STRAIGHT_STATIONS){
    for(const [side,role,primitive] of [['far',5,8],['near',1,0]]){
      const w=station[side];
      assert.equal(w.role,role);
      assert.equal(w.primitive,primitive);
      assert.ok(Number.isInteger(w.triangle)&&w.triangle>=0);
      assert.equal(w.world.length,3);
      assert.equal(w.pixel.length,2);
      assert.ok(w.world.every(Number.isFinite));
      assert.ok(w.pixel.every((v,i)=>Number.isInteger(v)&&v>=0&&v<[529,980][i]));
      assert.ok(Number.isFinite(w.depth)&&w.depth>0&&w.depth<1);
    }
  }
  assert.equal(b.sourceFirstHitCount,30);
  assert.equal(b.sourceFirstHitMaxErrorMetres< b.sourceFirstHitErrorCeilingMetres,true);
  const original=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
  const unchanged=o.transformWestFlankMaterialRenderer(original);
  const straight=o.transformNearFarStraightRenderer(original);
  assert.equal(o.WEST_FLANK_STAGE_MODES.length,16);
  assert.equal(o.WEST_FLANK_STAGE_MODES[8],'material-minus-native-signed-occupancy');
  assert.equal(o.NEAR_FAR_STRAIGHT_STAGE_MODES[8],'first-hit-depth-24bit');
  assert.equal(straight.modeCount,16);
  assert.equal(straight.productDiskMutation,false);
  assert.equal(straight.ownerPhotoCorrespondence,false);
  assert.match(straight.source,/gl_FragCoord\.z/);
  assert.match(straight.source,/__nearFarGpuUniformReadback/);
  assert.match(straight.source,/gl\.getUniform\(resources\.geometryProgram/);
  assert.ok(!unchanged.source.includes('packed=floor(d*16777215.0+0.5)'));
  assert.ok(!unchanged.source.includes('__nearFarGpuUniformReadback'));
  assert.ok(unchanged.source.includes('float difference=ravineFilteredMaterial-ravineNativeHabitat;'));
  assert.ok(m.instrumentRenderer(straight.source).includes('if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet)'));
  assert.throws(()=>o.transformNearFarStraightRenderer(original+'\n'),/SOURCE_HASH_MISMATCH/);
  const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
  assert.ok(y.includes('SOURCE_NEAR_FAR_STRAIGHT_BASELINE_V1'));
  assert.ok(y.includes('h-earth-gen3087-planetary-near-far-source-camera'));
  assert.ok(y.includes('11afdc5278564728ea9eef6ffb525601ce4362a7'));
  assert.ok(y.includes('85ee835060d5106a670077a5f4352b49b'));
});
test('GEN3087 R3A camera and actual GPU uniform gates reject a wrong source observer before stage inference',async()=>{
  const m=await import('./h-earth-ground-material-comparison.v1.mjs');
  const p=m.NEAR_FAR_STRAIGHT_POSE,b=m.NEAR_FAR_STRAIGHT_SOURCE_BINDING;
  const xyz=a=>({x:a[0],y:a[1],z:a[2]});
  const packet={
    status:'RUN_8E_R3A_FRAME_UNIFORM_PACKET_COMPLETE',
    frameSequence:308701,navigationSequence:308701,
    successorTerrainCameraReconciled:true,
    singleSphericalPresentationManifold:true,cameraAndWorldSharePlanetaryFrame:true,
    worldRecenteredForCamera:false,planetRelativeUp:true,
    navigationCameraY:12,presentationCameraY:12,r3aPresentationCameraYDelta:0,
    projectedCameraY:b.expectedPlanetaryPosition[1],
    viewport:{width:529,height:980,pixelRatio:1},
    navigationState:{position:{x:p.x,y:p.y,z:p.z},yawDegrees:p.yaw,pitchDegrees:p.pitch},
    camera:{
      position:xyz(b.expectedPlanetaryPosition),target:xyz(b.expectedPlanetaryTarget),
      up:xyz(b.expectedPlanetaryUp),localAuthoringPosition:{x:p.x,y:p.y,z:p.z},
      verticalFovDegrees:56,nearPlane:.25,farPlane:20000,
      viewProjectionMatrix:Array.from({length:16},(_,i)=>i/16)
    }
  };
  assert.equal(m.validateNearFarPlanetaryPacket(packet),true);
  const gpu={error:0,camera:[...b.expectedPlanetaryPosition],
    viewProjection:packet.camera.viewProjectionMatrix.slice()};
  assert.equal(m.validateNearFarGpuUniforms(gpu,packet,{cameraPosition:packet.camera.position}),true);
  assert.throws(()=>m.validateNearFarPlanetaryPacket({...packet,navigationState:{...packet.navigationState,yawDegrees:359.73555981837995}}),/NAVIGATION_POSE_MISMATCH/);
  assert.throws(()=>m.validateNearFarPlanetaryPacket({...packet,navigationCameraY:10.2049596}),/CAMERA_HEIGHT_RECONCILED_DRIFT/);
  assert.throws(()=>m.validateNearFarPlanetaryPacket({...packet,cameraAndWorldSharePlanetaryFrame:false}),/PLANETARY_FRAME_INVALID/);
  assert.throws(()=>m.validateNearFarPlanetaryPacket({...packet,camera:{...packet.camera,target:{x:0,y:0,z:0}}}),/CAMERA_PROJECTION_DRIFT/);
  assert.throws(()=>m.validateNearFarGpuUniforms({...gpu,camera:[0,0,0]},packet,{cameraPosition:packet.camera.position}),/GPU_CAMERA_UNIFORM_READBACK_MISMATCH/);
  assert.throws(()=>m.validateNearFarGpuUniforms(null,packet,{cameraPosition:packet.camera.position}),/GPU_CAMERA_UNIFORM_READBACK_MISMATCH/);
});

test('REV2 G1 static preflight requires exact product/G1/governing source and rejects all drift',async()=>{
 const m=await import('./h-earth-ground-material-comparison.v1.mjs'),c=m.REV2_G1_STATIC_PREFLIGHT;
 const sample=()=>({
  baseline:c.baseline,product:c.product,governing:c.governing,
  baselineToProduct:[...c.baselineToProduct],baselineToGoverning:[...c.baselineToGoverning],
  blobs:{baseline:{...c.blobs},product:{...c.blobs},governing:{...c.blobs}},
  atlasDigests:{...c.atlases},
  importMapCount:36,importMapTargetsLocal:true,importMapPathsExist:true,
  newEngineRuntimeImport:false,
  cameraContractBlob:c.blobs['showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js'],
  planetaryFrameBlob:c.blobs['showroom/globe/h-earth/render/planetary-world-frame.js'],
  navigationBlob:c.blobs['showroom/globe/h-earth/functional-landscape/navigation.js']
 });
 const receipt=m.validateRev2G1StaticEvidence(sample());
 assert.equal(receipt.result,'G1_SOURCE_DEPENDENCY_ASSET_CAMERA_PARITY_SOURCE_ONLY_PASS');
 assert.equal(receipt.verifiedBlobPaths,14);
 assert.equal(receipt.atlasCount,2);
 assert.equal(receipt.gpuExecuted,false);
 assert.equal(receipt.gpuAuthorizationCreated,false);
 assert.equal(receipt.actualG1CameraUniformReadback,false);
 assert.equal(receipt.g1TwelveFirstHitsMeasured,false);
 assert.equal(receipt.float32FramebufferCalibrated,false);
 assert.equal(receipt.ownerVisualAcceptanceCreated,false);
 for(const [mutate,error] of [
  [x=>{x.baseline='0'.repeat(40);},/EXACT_HEAD_DRIFT/],
  [x=>{x.product='0'.repeat(40);},/EXACT_HEAD_DRIFT/],
  [x=>{x.governing='0'.repeat(40);},/EXACT_HEAD_DRIFT/],
  [x=>{x.baselineToProduct.push('showroom/globe/h-earth/render/new-file.js');},/TRANSITIVE_DEPENDENCY_DELTA_UNCLOSED/],
  [x=>{x.baselineToGoverning.pop();},/TRANSITIVE_DEPENDENCY_DELTA_UNCLOSED/],
  [x=>{x.baselineToProduct[0]=x.baselineToProduct[1];},/TRANSITIVE_DEPENDENCY_DELTA_UNCLOSED/],
  [x=>{x.blobs.product['showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js']='0'.repeat(40);},/SOURCE_OR_ASSET_BLOB_DRIFT/],
  [x=>{delete x.blobs.baseline['showroom/globe/h-earth/render/planetary-world-frame.js'];},/SOURCE_OR_ASSET_BLOB_DRIFT/],
  [x=>{x.blobs.governing['showroom/globe/h-earth/functional-landscape/navigation.js']='0'.repeat(40);},/SOURCE_OR_ASSET_BLOB_DRIFT/],
  [x=>{x.atlasDigests['showroom/globe/h-earth/render/corrected-material-v1/near-atlas.png']='0'.repeat(64);},/ASSET_SHA256_DRIFT/],
  [x=>{x.importMapCount=35;},/IMPORT_GRAPH_UNCLOSED/],
  [x=>{x.importMapTargetsLocal=false;},/IMPORT_GRAPH_UNCLOSED/],
  [x=>{x.importMapPathsExist=false;},/IMPORT_GRAPH_UNCLOSED/],
  [x=>{x.newEngineRuntimeImport=true;},/IMPORT_GRAPH_UNCLOSED/],
  [x=>{x.cameraContractBlob='0'.repeat(40);},/CAMERA_SOURCE_CONTRACT_DRIFT/],
  [x=>{x.planetaryFrameBlob='0'.repeat(40);},/CAMERA_SOURCE_CONTRACT_DRIFT/],
  [x=>{x.navigationBlob='0'.repeat(40);},/CAMERA_SOURCE_CONTRACT_DRIFT/]
 ]){
  const v=sample();mutate(v);assert.throws(()=>m.validateRev2G1StaticEvidence(v),error);
 }
 assert.throws(()=>m.collectRev2G1StaticPreflight(''),/PRODUCT_DIRECTORY_REQUIRED/);
});

test('REV2 import-map guard accepts both frozen local roots and rejects unknown source roots',async()=>{
 const {isRev2G1LocalImportTarget:isLocal}=await import('./h-earth-ground-material-comparison.v1.mjs');
 for(const path of [
  '/showroom/globe/h-earth/render/landscape-coherence-field.v1.js?rev=sha-fixed',
  '/h-earth-3d/terrain/h-earth.gen2514-qualified-terrain-field.js?rev=sha-fixed'
 ])assert.equal(isLocal(path),true);
 for(const path of [
  'https://example.test/renderer.js','//example.test/renderer.js',
  '/showroom/globe/h-earth/../../analytics/data/latest.json',
  '/assets/engine/dgb.native-frame-pipeline.v1.mjs',
  '/analytics/data/latest.json','/showroom/globe/h-earth/render/far-atlas.png',
  '/h-earth-3d/source.js\nattack',''
 ])assert.equal(isLocal(path),false);
});

test('REV2 frozen mode order, station windows and frame ceilings reject drift',async()=>{
 const m=await import('./h-earth-ground-material-comparison.v1.mjs');
 assert.deepEqual(m.REV2_NUMERIC_MODES.slice(0,8),[
  'role_primitive_depth_valid','corrected_normal_slope','exposure_eligibility_weight_authority',
  'pre_soil_and_shelter','K_and_region','uv_ddx','ddy_lod_valid','implicit_T_coast']);
 assert.equal(m.REV2_NUMERIC_MODES.length,18);
 assert.deepEqual(m.REV2_NUMERIC_MODES.slice(8,17),Array.from({length:9},(_,i)=>'fixed_lod_'+i));
 assert.equal(m.REV2_NUMERIC_SEAMS.length,15);
 assert.deepEqual(m.REV2_NUMERIC_SEAMS.map(s=>s.z),[-457,-456,-455,-454,-453,-450,-448,-445,-440,-435,-425,-415,-405,-395,-385]);
 assert.equal(m.REV2_G1_FIXED_PIXELS.length,12);
 assert.deepEqual(m.REV2_G1_FIXED_PIXELS[0],{x:128,y:250});
 assert.deepEqual(m.REV2_G1_FIXED_PIXELS.at(-1),{x:400,y:790});
 assert.deepEqual([m.rev2GlY(0),m.rev2GlY(979)],[979,0]);
 assert.deepEqual(m.rev2StationPixelSpan(m.REV2_NUMERIC_SEAMS[0]),{
  x:314,y:141,width:32,height:1,topLeftCenter:330,crossingLeftIndex:15,crossingRightIndex:16});
 assert.throws(()=>m.rev2GlY(-1),/PIXEL_ORIGIN_INVALID/);
 assert.throws(()=>m.rev2StationPixelSpan({x:330,y:838,z:0}),/UNFROZEN_STATION/);
 const valid={poses:[{warmup:40,modes:18},{warmup:45,modes:18}],
  floatCalibrationDraws:2,referenceParityDraws:2,totalFrameSubmissions:125};
 assert.equal(m.validateRev2FrameBudget(valid).result,'REV2_GPU_ACCOUNTING_VALID');
 for(const invalid of [
  {...valid,totalFrameSubmissions:126},
  {...valid,poses:[{warmup:61,modes:18},{warmup:45,modes:18}],totalFrameSubmissions:146},
  {...valid,poses:[{warmup:60,modes:18},{warmup:61,modes:18}],totalFrameSubmissions:161},
  {...valid,poses:[{warmup:40,modes:17},{warmup:45,modes:18}]},
  {...valid,floatCalibrationDraws:3}
 ])assert.throws(()=>m.validateRev2FrameBudget(invalid),/REV2_GPU_/);
});
test('REV2 signed texture/nontexture decomposition reconstructs C, keeps sign and fails on zero/threshold',async()=>{
 const m=await import('./h-earth-ground-material-comparison.v1.mjs');
 const make=({role=1,primitive=0,p=[.25,.29,.31],w=.7,a=.8,k=[.8,.9,1],t=[.3,.4,.5],depth=.92,error=0.000001}={})=>{
  const rows=Array.from({length:18},()=>[0,0,0,0]);
  rows[0]=[role,primitive,depth,1];rows[1]=[0,1,0,.2];
  rows[2]=[.2,.9,w,a];rows[3]=[...p,.3];rows[4]=[...k,.55];
  rows[5]=[.3,.6,.0002,.001];rows[6]=[.001,.0002,1.3,w>0.001?1:0];
  rows[7]=w>0.001?[...t,12]:[0,0,0,0];
  for(let i=8;i<17;i++)rows[i]=w>0.001?[...t,1]:[0,0,0,0];
  const c=w>0.001?p.map((v,i)=>v+w*a*(Math.pow(t[i],2.2)*k[i]-v)):p;
  rows[17]=[...c,1];
  return m.decodeRev2FloatPixel(rows,{calibratedError:error});
 };
 const left=make(),texRight=make({t:[.65,.55,.2]});
 const tr=m.computeRev2SignedAttribution(left,texRight);
 assert(tr.texture.norm>0.01);assert(tr.nonTexture.norm<0.00001);
 assert.deepEqual(tr.texture.value.map(Math.sign),[1,1,-1]);
 assert.equal(tr.mipSelectionKnown,false);
 const nonRight=make({p:[.4,.32,.2],w:.55,a:.72,k:[.94,.8,.92]});
 const nr=m.computeRev2SignedAttribution(left,nonRight);
 assert(nr.nonTexture.norm>0.01);assert(nr.texture.norm<0.00001);
 const both=m.computeRev2SignedAttribution(left,make({p:[.4,.32,.2],t:[.65,.55,.2]}));
 assert(both.texture.norm>0.01&&both.nonTexture.norm>0.01);
 const control=Array.from({length:30},()=>({texture:{norm:.001},nonTexture:{norm:.001}}));
 assert.equal(m.classifyRev2Station(both,control).result,'BOTH_CONTRIBUTE');
 assert.equal(m.classifyRev2Station(tr,control).result,'TEXTURE_SAMPLING_SUPPORTED');
 assert.equal(m.classifyRev2Station(nr,control).result,'NON_TEXTURE_BLEND_FACTORS_SUPPORTED');
 assert.equal(m.classifyRev2Station({texture:{...tr.texture,norm:.001,numericErrorBound:.001},
  nonTexture:{...nr.nonTexture,norm:.001,numericErrorBound:0}},control).result,'UNRESOLVED');
 assert.throws(()=>m.classifyRev2Station(tr,control.slice(0,29)),/CONTROLS_INCOMPLETE/);
 assert.throws(()=>m.classifyRev2Station(tr,control.map((q,i)=>i===0?{texture:{norm:NaN},nonTexture:q.nonTexture}:q)),/CONTROL_NONFINITE/);
 const zero=make({w:0});
 assert.equal(zero.active,false);assert.equal(zero.t,null);
 assert.throws(()=>m.computeRev2SignedAttribution(left,zero),/TEXTURE_UNOBSERVED/);
 assert.equal(m.rev2ValidateSameRoleControl(left,texRight),true);
 assert.throws(()=>m.rev2ValidateSameRoleControl(left,make({role:5,primitive:8})),/CONTROL_FIRST_HIT_OR_DEPTH_MISMATCH/);
 assert.throws(()=>m.rev2ValidateSameRoleControl(left,make({depth:.934})),/CONTROL_FIRST_HIT_OR_DEPTH_MISMATCH/);
 const bogusRows=Array.from({length:18},()=>[0,0,0,0]);
 bogusRows[0]=[1,0,.9,1];bogusRows[2]=[.2,.9,.7,.8];
 bogusRows[3]=[.2,.2,.2,.2];bogusRows[4]=[.8,.8,.8,.8];bogusRows[6][3]=1;
 for(let i=8;i<17;i++)bogusRows[i][3]=1;
 bogusRows[7]=[.3,.3,.3,2];bogusRows[17]=[.9,.9,.9,1];
 const bad=m.decodeRev2FloatPixel(bogusRows,{calibratedError:0.000001});
 assert.throws(()=>m.computeRev2SignedAttribution(left,bad),/RECONSTRUCTION_FAIL/);
 assert.throws(()=>m.decodeRev2FloatPixel(bogusRows.slice(0,17),{calibratedError:.000001}),/ROWS_INCOMPLETE/);
 assert.throws(()=>m.decodeRev2FloatPixel(bogusRows,{calibratedError:.000003}),/CALIBRATION_UNPROVEN/);
});

test('REV2 source-pinned 18-channel shader probe retains original disabled output',async()=>{
 const o=await import('./h-earth-groundcover-factor-overlay.mjs');
 const m=await import('./h-earth-ground-material-comparison.v1.mjs');
 const original=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const t=o.transformRev2WorldSoilNumericRenderer(original),src=t.source;
 assert.deepEqual(o.REV2_WORLD_SOIL_NUMERIC_MODES,m.REV2_NUMERIC_MODES);
 assert.equal(t.numericModeCount,18);assert.equal(t.requiresRgba32f,true);
 assert.equal(t.gpuExecuted,false);assert.equal(t.productionMutation,false);
 assert.equal(t.driverSelectedMipObserved,false);
 const a=original.indexOf('const FS = '),b=original.indexOf('// Ordered screen-door coverage',a);
 const c=src.indexOf('const FS = '),d=src.indexOf('// Ordered screen-door coverage',c);
 assert.equal(src.slice(0,c),original.slice(0,a));
 assert.equal(src.slice(d),original.slice(b));
 assert(src.indexOf('vec2 rev2DDX=dFdx')<src.indexOf('if(worldSoilTerrain){'));
 assert(src.includes('palette=mix(palette,worldSoilFinal,worldSoilWeight);'));
 assert(src.includes('vec3 worldSoilTexel=texture('));
 assert(src.includes('if(!geologicalEarthRock){rev2T=worldSoilTexel;rev2SampledOriginalT=true;}'));
 assert(src.includes('bool validT=ordinary&&rev2SampledOriginalT&&rev2W>0.001&&rev2DerivativeFinite;'));
 assert(src.includes('textureLod(uClearingSoil,rev2UV,float(m-9)).rgb'));
 assert(src.includes('if(uRev2NumericMode>0){'));
 assert(src.includes('else outColor=vec4(lit,outputAlpha);'));
 assert(src.includes('rev2RockExposure=rockExposure;'));
 assert(src.includes('channels=vec4(rev2RockExposure,rev2E,rev2W,rev2A);'));
 assert(src.includes('uniform highp int uRev2NumericMode;'));
 assert.throws(()=>o.transformRev2WorldSoilNumericRenderer(original+'\n'),/SOURCE_HASH_MISMATCH/);
});
