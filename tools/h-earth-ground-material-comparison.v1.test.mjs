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

test('Gen2944 ridge hard-winner derivative breaks at the source crossover',()=>{
 const g=(x,z,cx,cz,rx,rz,a)=>a*Math.exp(-1.6*(((x-cx)/rx)**2+((z-cz)/rz)**2));
 const east=x=>g(x,-250,148,-224,66,34,38),central=x=>g(x,-250,86,-235,68,37,34);
 let lo=120,hi=140;
 for(let i=0;i<65;i++){const m=(lo+hi)/2;if(east(m)>central(m))hi=m;else lo=m;}
 const x=(hi+lo)/2,h=1e-5,hard=p=>Math.max(east(p),central(p));
 const left=(hard(x)-hard(x-h))/h,right=(hard(x+h)-hard(x))/h;
 assert.ok(Math.abs(right-left)>0.5);
 const smooth=p=>{const a=east(p),b=central(p),d=Math.abs(a-b),w=2;
  return Math.max(a,b)-(d<w?0.5*d*(1-d/w)**2:0);};
 assert.ok(Math.abs(((smooth(x+h)-smooth(x))/h)-((smooth(x)-smooth(x-h))/h))<0.001);
 const source=fs.readFileSync(new URL('../h-earth-3d/terrain/h-earth.terrain-field.js',import.meta.url),'utf8');
 assert.ok(source.includes('const strongestPositiveRelief = Math.max(...positiveReliefComponents);'));
});

test('Gen2944 immutable hydrated world differs from newer canonical B2 source at documented location',async()=>{
 const {createHash}=await import('node:crypto'),{gunzipSync}=await import('node:zlib');
 const terrain=await import('../h-earth-3d/terrain/h-earth.terrain-field.js');
 const asset=fs.readFileSync(new URL('../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url));
 const digest=createHash('sha256').update(asset).digest('hex');
 assert.equal(digest,'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 const manifest=JSON.parse(fs.readFileSync(new URL('../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.manifest.json',import.meta.url)));
 assert.equal(manifest.binary.sha256,digest);
 const packed=JSON.parse(gunzipSync(asset).toString('utf8'));
 assert.equal(packed.raw.packageIdentity,'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_0C47F685');
 const v=packed.raw.buffers.positions;
 let best=Infinity,index=-1;for(let i=0;i<v.length;i+=3){
  const dist=Math.hypot(v[i]-208.00238513946533,v[i+2]+344.0039446949959);
  if(dist<best){best=dist;index=i;}
 }
 assert.ok(index>=0&&best<0.15,JSON.stringify({index,best}));
 const difference=terrain.sampleHEarthTerrainElevation(v[index],v[index+2])-v[index+1];
 assert.ok(Math.abs(difference)>4.5,JSON.stringify({difference,index,best}));
});

test('Gen2944 ridge normal GPU counterfactual is source-pinned and never changes disk source',async()=>{
 const diagnostic=await import('./h-earth-ground-material-comparison.v1.mjs');
 const sourcePath=new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
 const original=fs.readFileSync(sourcePath,'utf8');
 const result=diagnostic.instrumentRidgeNormalRenderer(original);
 assert.equal(diagnostic.GEN2944_SOURCE_HEAD,'cb57c275b95d0d48883bc4da4dcfcf17cbec5060');
 assert.equal(diagnostic.GEN2944_SHADER_SHA256,'fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec');
 for(const anchor of [
  'uniform int uRidgeNormalMode;',
  'if((uRidgeNormalMode==1||uRidgeNormalMode==2||uRidgeNormalMode==4)&&vRoleCode==1u)',
  'ridgeCorrectionRaw=clamp(length(correction)/0.3,0.0,1.0);',
  'gl.uniform1i(loc,m);globalThis.__ridgeNormalModeApplied=m;'
 ])assert.ok(result.includes(anchor),anchor);
 assert.notEqual(result,original);
 assert.equal(fs.readFileSync(sourcePath,'utf8'),original);
 assert.throws(()=>diagnostic.instrumentRidgeNormalRenderer(original+'\n'),/FROZEN_RENDERER_HASH_MISMATCH/);
 assert.deepEqual(diagnostic.NORMAL_POSES.map(p=>[p.name,p.x,p.z,p.yaw,p.pitch]),[
 ['ridge-diagonal',88,-260,118,-13],['healthy-coast',0,-110,170,-8]]);
 assert.deepEqual(diagnostic.NORMAL_MODES,['original-lit','normal-candidate-lit','normal-correction-raw','original-lit-with-grass','normal-candidate-lit-with-grass']);
 assert.equal(diagnostic.NORMAL_POSES.length*diagnostic.NORMAL_MODES.length,10);
});
test('Gen2944 normal image-set custody rejects missing frames and vegetation disappearance',async()=>{
 const diagnostic=await import('./h-earth-ground-material-comparison.v1.mjs');
 const views=diagnostic.NORMAL_POSES.flatMap(pose=>diagnostic.NORMAL_MODES.map((mode,diagnosticApplied)=>({
  pose,mode,diagnosticApplied,grassHidden:!mode.endsWith('with-grass'),
  assetSignature:'preserved',sourceHead:diagnostic.GEN2944_SOURCE_HEAD,
  rendererHash:diagnostic.GEN2944_SHADER_SHA256,
  lastFrame:{cameraPosition:{x:pose.x,y:12,z:pose.z}}
 })));
 assert.equal(diagnostic.validateRidgeNormalSet(views),true);
 for(const change of [a=>a.pop(),a=>a[1].assetSignature='drift',a=>a[2].sourceHead='wrong',a=>a[3].grassHidden=true,a=>a[4].diagnosticApplied=0]){
  const candidate=structuredClone(views);change(candidate);
  assert.throws(()=>diagnostic.validateRidgeNormalSet(candidate),/GEN2944_/);
 }
});

test('Gen2944 two-frame eligibility probe keeps original terrain and exact mode IDs',async()=>{
 const d=await import('./h-earth-ground-material-comparison.v1.mjs');
 assert.deepEqual(d.NORMAL_PROBE_MODES,['original-lit','normal-correction-raw']);
 assert.equal(d.NORMAL_PROBE_POSES.length,1);
 const source=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const candidate=d.instrumentRidgeNormalRenderer(source);
 assert.ok(candidate.includes('ridgeRegionRaw=region;ridgeGapRaw=1.0-smoothstep(0.0,2.0,gap);'));
 assert.ok(candidate.includes('lit=vec3(ridgeDebugWorld,ridgeSignedGapRaw)'));
 assert.ok(candidate.includes('ridgeDebugWorld=vec2(clamp((q.x+256.0)/512.0,0.0,1.0),clamp((q.y+400.0)/320.0,0.0,1.0));'));
 assert.ok(candidate.includes('ridgeSignedGapRaw=clamp(0.5+(a-b)/24.0,0.0,1.0);'));
 assert.equal(fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8'),source);
 const views=d.NORMAL_PROBE_MODES.map((mode,i)=>({
  pose:d.NORMAL_PROBE_POSES[0],mode,diagnosticApplied:i===0?0:2,grassHidden:true,
  assetSignature:'same',sourceHead:d.GEN2944_SOURCE_HEAD,rendererHash:d.GEN2944_SHADER_SHA256,
  lastFrame:{cameraPosition:{x:88,y:29,z:-260}}
 }));
 assert.equal(d.validateRidgeNormalSet(views,d.NORMAL_PROBE_POSES,d.NORMAL_PROBE_MODES),true);
});

test('Gen2944 owner-directed steep-side material blend is image-only and leaves protected biome and plants unchanged',async()=>{
 const d=await import('./h-earth-ground-material-comparison.v1.mjs');
 const sourcePath=new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
 const original=fs.readFileSync(sourcePath,'utf8');
 const transformed=d.instrumentSteepMaterialRenderer(original);
 for(const token of [
  'GEN2944_STEEP_OWNER_BLEND_DIAGNOSTIC',
  'smoothstep(48.0,116.0,s.x)',
  'smoothstep(-200.0,-143.0,s.y)',
  'zone*=1.0-preservedGrove;',
  'uRidgeNormalMode==1&&worldSoilTerrain&&!geologicalEarthRock',
  'base=mix(base,coherentSoilTint,strength);'
 ])assert.ok(transformed.includes(token),token);
 assert.ok(!/\bvec3 coherent\s*=/.test(transformed),'GLSL_RESERVATION_VIOLATION');
 assert.equal(fs.readFileSync(sourcePath,'utf8'),original);
 assert.throws(()=>d.instrumentSteepMaterialRenderer(original+' '),/GEN2944_STEEP_FROZEN_SHADER_DRIFT/);
 assert.deepEqual(d.STEEP_MATERIAL_MODES,['original-lit-with-grass','coherent-lit-with-grass']);
 assert.deepEqual(d.STEEP_MATERIAL_POSES.map(p=>p.name),['steep-diagonal','steep-across','protected-meadow','protected-coast']);
 const views=d.STEEP_MATERIAL_POSES.flatMap(pose=>d.STEEP_MATERIAL_MODES.map((mode,diagnosticApplied)=>({
  pose,mode,diagnosticApplied,grassHidden:false,assetSignature:'preserved',
  sourceHead:d.GEN2944_SOURCE_HEAD,rendererHash:d.GEN2944_SHADER_SHA256,
  lastFrame:{cameraPosition:{x:pose.x,y:24,z:pose.z}}
 })));
 assert.equal(d.validateSteepMaterialSet(views),true);
 const altered=structuredClone(views);altered[3].grassHidden=true;
 assert.throws(()=>d.validateSteepMaterialSet(altered),/GEN2944_STEEP_CAPTURE_MISMATCH/);
});
