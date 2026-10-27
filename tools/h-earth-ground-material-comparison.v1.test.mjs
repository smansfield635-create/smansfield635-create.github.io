import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HEADS,POSES,comparisonState,instrumentRoute,instrumentRenderer,validateFrame,parseArgs,sameHeading,assetReadiness,decodeCanvasCapture} from './h-earth-ground-material-comparison.v1.mjs';

const fixture=()=>({state:{position:{x:18,y:24,z:-226},yawDegrees:-150,pitchDegrees:-14,verticalFovDegrees:56,sequence:10001},lastFrame:{navigationSequence:10001,frameSequence:21,cameraPosition:{x:18,y:24,z:-226}},expectedCameraPosition:{x:18,y:24,z:-226},canvas:{width:529,height:980,cssWidth:540,cssHeight:1000}});
test('exact immutable pair and recovered four poses are frozen',()=>{assert.equal(HEADS.baseline,'85372f3dc896d73457f6a7d008ac08a51d0ba85b');assert.equal(HEADS.candidate,'9127904e725a3f4ca13c1221451023102ad09435');assert.deepEqual(POSES.slice(0,4).map(p=>[p.name,p.x,p.z,p.yaw,p.pitch]),[['river-overlook',18,-226,210,-14],['bare-mountain',88,-260,95,-10],['coast-oblique',0,-110,170,-8],['foothill-west',-52,-208,180,-12]]);});
test('renderer normal mode executes identical draw while hidden mode suppresses only that draw',()=>{const source='before();resources.singleOwnerVegetation?.draw(packet);after();',patched=instrumentRenderer(source);for(const hidden of [false,true]){const calls=[];new Function('globalThis','resources','packet','before','after',patched)({__groundComparisonHideGrass:hidden},{singleOwnerVegetation:{draw:p=>calls.push(p)}},'draw',()=>calls.push('before'),()=>calls.push('after'));assert.deepEqual(calls,hidden?['before','after']:['before','draw','after']);}});
test('instrumentation refuses missing or duplicate anchors',()=>{for(const source of ['', 'resources.singleOwnerVegetation?.draw(packet);resources.singleOwnerVegetation?.draw(packet);'])assert.throws(()=>instrumentRenderer(source),/ANCHOR_NOT_UNIQUE/);assert.throws(()=>instrumentRoute('const cssWidth=1;const cssWidth=2'),/ANCHOR_NOT_UNIQUE/);assert.equal(instrumentRoute('const cssWidth=1;'),'globalThis.__HEarthAuditPresent=present;globalThis.__HEarthAuditPacket=createHEarthRun8ER3AFrameUniformPacket;\nconst cssWidth=1;');});
test('frame accepts matched source pose at saved resolution',()=>assert.equal(validateFrame(fixture(),POSES[0],10001),true));
test('frame rejects stale navigation, wrong camera, resolution and pose',()=>{for(const mutate of [x=>x.lastFrame.navigationSequence--,x=>x.lastFrame.cameraPosition.y++,x=>x.canvas.width++,x=>x.state.pitchDegrees++,x=>x.state.verticalFovDegrees=60,x=>x.lastFrame.frameSequence=NaN]){const v=fixture();mutate(v);assert.throws(()=>validateFrame(v,POSES[0],10001));}});
test('CLI rejects arbitrary inputs and overlapping output',()=>{assert.throws(()=>parseArgs(['--command','echo hello']),/CLI_NOT_CLOSED/);assert.throws(()=>parseArgs(['--baseline-dir','a']),/CLI_INCOMPLETE/);assert.throws(()=>parseArgs(['--baseline-dir','a','--candidate-dir','b','--output','a']),/DIRECTORIES_NOT_DISTINCT/);assert.equal(Object.keys(parseArgs(['--baseline-dir','a','--candidate-dir','b','--output','c'])).length,3);});
test('workflow isolates fixed mode and preserves fixed full checkout guards',()=>{const y=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');assert.match(y,/inputs\.route_query != 'qualification=gen2711-grass-beach-fast-v1' && inputs\.route_query != 'qualification=ground-material-gen2898-stage-c'/);assert.match(y,/focused-grass-beach:\n    if: \$\{\{ inputs\.route_query == 'qualification=gen2711-grass-beach-fast-v1' \}\}/);assert.match(y,/ground-material-comparison:\n    if: \$\{\{ inputs\.route_query == 'qualification=ground-material-gen2898-stage-c' \}\}/);assert.ok(y.includes('ref: '+HEADS.baseline));assert.ok(y.includes('ref: '+HEADS.candidate));assert.match(y,/timeout 2400s node tools\/h-earth-ground-material-comparison.v1.mjs/);assert.match(y,/Preserve comparison evidence even on failure\n        if: always\(\)/);});

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
test('source-bound observer rays aim at measured targets within the admitted twenty-frame budget',()=>{
 assert.deepEqual(diagnostic.DIAGNOSTIC_MODES,['reference','unlit-albedo','unlit-no-habitat','habitat-coverage','reference-no-habitat']);
 assert.equal(diagnostic.DIAGNOSTIC_POSES.length*diagnostic.DIAGNOSTIC_MODES.length,20);
 for(const p of diagnostic.DIAGNOSTIC_POSES){assert.equal(p.diagnosticObserver,true);assert.equal(p.yaw,0);assert.ok(p.y>p.target.y);assert.ok(Math.abs(p.y+(p.z-p.target.z)*Math.tan(p.pitch*Math.PI/180)-p.target.y)<1e-9);assert.equal(p.x,p.target.x);}
 assert.equal(diagnostic.SEARCH_PROVENANCE.exactScreenshotMatchProven,false);
 assert.throws(()=>diagnostic.instrumentDiagnosticRenderer('changed'),/SOURCE_HASH_MISMATCH/);
});
test('twenty captures require every source-bound pose and mode and matched inputs',()=>{
 const views=diagnostic.DIAGNOSTIC_POSES.flatMap(pose=>diagnostic.DIAGNOSTIC_MODES.map((mode,i)=>({pose,mode,grassHidden:true,diagnosticApplied:i,assetSignature:'same',state:{position:{x:18,y:2,z:-226}},lastFrame:{cameraPosition:{x:18,y:2,z:-226}}})));
 assert.equal(diagnostic.validateDiagnosticSet(views),true);
 assert.throws(()=>diagnostic.validateDiagnosticSet(views.slice(1)),/INCOMPLETE/);
 for(const mutate of [v=>v[1].mode='reference',v=>v[1].mode='substrate',v=>v[1].pose={name:'other'},v=>v[1].diagnosticApplied=0,v=>v[1].grassHidden=false,v=>v[1].assetSignature='changed',v=>v[1].state.position.x++,v=>v[1].lastFrame.cameraPosition.y++]){const copy=structuredClone(views);mutate(copy);assert.throws(()=>diagnostic.validateDiagnosticSet(copy));}
});
const shaderFixture=()=>`before();
const FS = \`out vec4 outColor;
void main(){
 float terrainRoughnessForLighting=0.72;
 base=mix(base,habitatSoil,habitatCoverage*.68);
 terrainRoughnessForLighting=mix(terrainRoughnessForLighting,.94,habitatCoverage*.3);
 vec3 lit=base*(ambient+directional)*uSunColor;
 lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));
 outColor=vec4(lit,outputAlpha);
}\`;
// Ordered screen-door coverage
otherShader();
gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);
resources.singleOwnerVegetation?.draw(packet);after();`;
test('reference retains exact original shader computations and unlit only overrides final lit',()=>{
 const original=shaderFixture(),result=diagnostic.transformDiagnosticSource(original);
 const fsPart=s=>s.slice(s.indexOf('const FS ='),s.indexOf('// Ordered screen-door coverage'));
 const stripped=fsPart(result).replace('\nuniform int uGroundDiagnosticMode;','').replace('\n  float diagnosticHabitatCoverage=0.0;','').replace('diagnosticHabitatCoverage=habitatCoverage;\n    if(uGroundDiagnosticMode==2||uGroundDiagnosticMode==4)habitatCoverage=0.0;\n    ','').replace('if(worldSoilTerrain&&(uGroundDiagnosticMode==1||uGroundDiagnosticMode==2))lit=base;\n  ','').replace('\n  if(worldSoilTerrain&&uGroundDiagnosticMode==3)lit=vec3(diagnosticHabitatCoverage);','');
 assert.equal(stripped,fsPart(original));
 assert.doesNotMatch(result,/diagnosticSubstrate|diagnosticAfter|return;|uGroundDiagnosticMode==0/);
 for(const needle of ['out vec4 outColor;','float terrainRoughnessForLighting=0.72;','base=mix(base,habitatSoil,habitatCoverage*.68);','lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));']){
 assert.throws(()=>diagnostic.transformDiagnosticSource(original.replace(needle,'')),/ANCHOR_NOT_UNIQUE/);
 assert.throws(()=>diagnostic.transformDiagnosticSource(original.replace(needle,needle+needle)),/ANCHOR_NOT_UNIQUE/);}
});
test('uniform binding admits only the five declared stages',()=>{
 const source=diagnostic.transformDiagnosticSource(shaderFixture());
 const begin=source.indexOf('{const mode=globalThis.__groundDiagnosticMode;'),end=source.indexOf('globalThis.__groundDiagnosticApplied=mode;}',begin)+'globalThis.__groundDiagnosticApplied=mode;}'.length;
 const bind=new Function('globalThis','gl','resources',source.slice(begin,end));
 for(const mode of [0,1,2,3,4]){const state={__groundDiagnosticMode:mode},calls=[];bind(state,{getUniformLocation:()=>({}),uniform1i:(loc,value)=>calls.push(value)},{geometryProgram:{}});assert.deepEqual(calls,[mode]);assert.equal(state.__groundDiagnosticApplied,mode);}
 for(const mode of [-1,5,1.5,NaN,undefined,'1'])assert.throws(()=>bind({__groundDiagnosticMode:mode},{},{geometryProgram:{}}),/MODE_INVALID/);
 assert.throws(()=>bind({__groundDiagnosticMode:0},{getUniformLocation:()=>null},{geometryProgram:{}}),/UNIFORM_MISSING/);
});
