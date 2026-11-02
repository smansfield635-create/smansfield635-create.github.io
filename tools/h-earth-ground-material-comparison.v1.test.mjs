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
test('Gen3042 triad CLI and Gen3055 replay guard are closed to extra source refs',async()=>{
 const {spawnSync}=await import('node:child_process');
 const moduleBody="import {parseArgs,HEADS,GEN3042_PROFILE} from './tools/h-earth-ground-material-comparison.v1.mjs';"+
 "if(!GEN3042_PROFILE||Object.keys(HEADS).length!==3)process.exit(12);"+
 "const a=parseArgs(['--baseline-dir','/tmp/base','--candidate-dir','/tmp/green','--habitat-dir','/tmp/hab','--output','/tmp/out']);"+
 "if(Object.keys(a).length!==4)process.exit(13);"+
 "try{parseArgs(['--baseline-dir','/tmp/base','--candidate-dir','/tmp/green','--output','/tmp/out']);process.exit(14);}catch(e){if(!String(e).includes('CLI_INCOMPLETE'))process.exit(15);}";
 const run=spawnSync(process.execPath,['--input-type=module','-e',moduleBody],{
  cwd:new URL('../',import.meta.url).pathname,encoding:'utf8',
  env:{...process.env,H_EARTH_COMPARISON_PROFILE:'GEN3042_SOIL_TRIAD_AB_V1'}
 });
 assert.equal(run.status,0,run.stderr||run.stdout);
 const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 const i=y.indexOf('  gen3042-soil-triad-gpu-once:');assert.ok(i>=0);
 const block=y.slice(i);
 for(const h of Object.values((await import('./h-earth-ground-material-comparison.v1.mjs')).GEN3042_HEADS))assert.ok(block.includes('ref: '+h));
 assert.ok(block.includes("github.event.action == 'reopened'"));
 assert.ok(block.includes('GEN3042_SOIL_TRIAD_AB_V1'));
 assert.ok(block.includes('if: always()'));
 assert.equal(block.includes("github.event.action == 'opened'"),false);
});

test('Gen3042 preserves resource evidence before fourth independent full-tree checkout',()=>{
 const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 const block=y.slice(y.indexOf('  gen3042-soil-triad-gpu-once:'));
 const names=['Gen3042 tooling','baseline','Gen3037 groundcover candidate','Gen3030 habitat candidate'];
 for(const name of names){
  const anchor='      - name: Checkout exact '+name+'\n';
  const a=block.indexOf(anchor);assert.ok(a>=0,'missing checkout '+name);
  const b=block.indexOf('\n      - name:',a+anchor.length);
  const chunk=block.slice(a,b<0?undefined:b);
  assert.ok(chunk.includes('filter: blob:none'),name+' has no bounded blob filter');
  assert.ok(!chunk.includes('sparse-checkout:'),name+' must retain complete source tree');
 }
 const capture=block.indexOf('      - name: Gen3042 pre-habitat resource evidence');
 const upload=block.indexOf('      - name: Preserve Gen3042 pre-habitat resource evidence before fourth checkout');
 const habitat=block.indexOf('      - name: Checkout exact Gen3030 habitat candidate');
 assert.ok(capture>=0&&upload>capture&&habitat>upload,'durable resource evidence must precede habitat checkout');
 assert.ok(block.includes('df -B1 "$GITHUB_WORKSPACE"'));
 assert.ok(block.includes('du -sh tooling baseline candidate'));
 assert.ok(block.includes('if-no-files-found: error'));
 assert.ok(block.includes("github.event.action == 'reopened'"),'separately admitted Gen3055 replay trigger must be exact');
 assert.ok(!block.includes("github.event.action == 'opened'"),'consumed Gen3042 initial PR opening must not re-trigger');
});

test('Gen3055 replay retains three source identities and pre-habitat evidence',()=>{
 const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 const b=y.slice(y.indexOf('  gen3042-soil-triad-gpu-once:'));
 assert.equal(b.split("github.event.action == 'reopened'").length,2);
 assert.ok(b.includes('Gen3042 pre-habitat resource evidence'));
 assert.ok(b.includes('git -C tooling fetch --no-tags --depth=1 origin 39ed43d987d5f62c1368e7c309faa1a1b3d731b6'));
 assert.ok(b.includes('Preserve Gen3042 pre-habitat resource evidence before fourth checkout'));
 for(const sha of ['28da29ce01f26bf5eb73db2d75b09741b22ab40b','724efeb1db3d3e8e5309a9aa779acefb7c53fed9','cb15de477f9b8e39b9dc688ecc452ba44e42e6c1'])assert.ok(b.includes('ref: '+sha));
 assert.ok(b.includes('Capture 36 real stage-aligned WebGL images from independent products'));
 assert.ok(b.includes('if: always()'));
});
