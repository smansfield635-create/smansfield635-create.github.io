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
 const shader=fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-footprint-continuity-20261028/rejected-renderer.js',import.meta.url),'utf8');
 const baseline=diagnostic.reconstructFootprintBaseline(shader);
 const digest=diagnostic.verifyExactMaterialCandidate(baseline);
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
 assert.throws(()=>diagnostic.verifyExactMaterialCandidate(baseline+'//unexpected'),/NOT_EXACT_ONE_FORMULA_DIFF/);
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

// Execute the production scalar GLSL expressions with double precision for a
// numerical quadrature check. This does not certify GPU precision or pixels.
const footprintShader=fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-footprint-continuity-20261028/rejected-renderer.js',import.meta.url),'utf8');
const footprintBlock=name=>{
 const matches=[...footprintShader.matchAll(new RegExp('^[ \\t]*// H_EARTH_GROUNDCOVER_FOOTPRINT_'+name+'_BEGIN\\n([\\s\\S]*?)^[ \\t]*// H_EARTH_GROUNDCOVER_FOOTPRINT_'+name+'_END\\n','gm'))];
 assert.equal(matches.length,1);return matches[0][1];
};
const fract=x=>x-Math.floor(x);
const mix=(a,b,t)=>a*(1-t)+b*t;
const smoothstep=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
const hash21=p=>{let x=fract(p[0]*123.34),y=fract(p[1]*456.21);const dot=x*(x+45.32)+y*(y+45.32);x+=dot;y+=dot;return fract(x*y);};
const noise2=p=>{const x=Math.floor(p[0]),y=Math.floor(p[1]),u=smoothstep(0,1,fract(p[0])),v=smoothstep(0,1,fract(p[1]));return mix(mix(hash21([x,y]),hash21([x+1,y]),u),mix(hash21([x,y+1]),hash21([x+1,y+1]),u),v);};
const vec2=(x,y)=>[x,y];
const helperBody=footprintBlock('HELPER').match(/float groundcoverPatchFactorAt\(vec2 p\)\{([\s\S]*?)\n\}/)[1].replace(/\bfloat\b/g,'let').replace(/p\.x/g,'p[0]').replace(/p\.y/g,'p[1]');
const patchFactor=new Function('noise2','vec2','smoothstep','p',helperBody).bind(null,noise2,vec2,smoothstep);
const scale=(v,s)=>v.map(x=>x*s);
const offset=(p,dx,sx,dy,sy)=>p.map((v,i)=>v+sx*dx[i]+sy*dy[i]);
let blendBody=footprintBlock('BLEND')
 .replace(/\b(?:float|vec2)\s+(\w+)=/g,'let $1=')
 .replace(/length\((groundcoverWorldD[xy])\*([\d.]+)\)/g,'Math.hypot(...scale($1,$2))')
 .replace(/(groundcoverWorldD[xy])\*([\d.]+)/g,'scale($1,$2)')
 .replace(/\bmax\(/g,'Math.max(');
for(const sx of ['-','+'])for(const sy of ['-','+'])blendBody=blendBody.replace('world'+sx+'groundcoverTapX'+sy+'groundcoverTapY',`offset(world,groundcoverTapX,${sx}1,groundcoverTapY,${sy}1)`);
const evaluateBlend=new Function('groundcoverPatchFactorAt','smoothstep','mix','scale','offset','world','groundcoverWorldDx','groundcoverWorldDy','groundcoverWeight','groundcoverSuitability','groundcoverProtection',blendBody+';return {weight:groundcoverWeight,activation:groundcoverFilterActivation};').bind(null,patchFactor,smoothstep,mix,scale,offset);
const filtered=(p,dx,dy,s=1,protection=1)=>evaluateBlend(p,dx,dy,patchFactor(p)*s*protection,s,protection);

test('footprint candidate reverses to the immutable approved shader and derivatives precede branches',()=>{
 const baseline=diagnostic.reconstructFootprintBaseline(footprintShader);
 assert.equal(diagnostic.verifyExactMaterialCandidate(baseline),diagnostic.FOOTPRINT_BASELINE_SHA256);
 assert.equal(diagnostic.FOOTPRINT_BASELINE_HEAD,'cb57c275b95d0d48883bc4da4dcfcf17cbec5060');
 const fsMain=footprintShader.indexOf('void main(){',footprintShader.indexOf('const FS ='));
 const derivatives=footprintShader.indexOf('// H_EARTH_GROUNDCOVER_FOOTPRINT_DERIVATIVES_BEGIN');
 assert.ok(derivatives>fsMain);
 assert.equal(footprintShader.slice(fsMain,derivatives).trim(),'void main(){');
 // Removing just the declared blocks restores every untouched role, normal,
 // palette, moisture, protection, geometry and vegetation byte via SHA custody.
 assert.ok(!baseline.includes('H_EARTH_GROUNDCOVER_FOOTPRINT_'));
});

test('original near-field result and protected zero influence remain exact',()=>{
 for(const p of [[0,0],[-200,-728],[88,-236],[376,-96],[-73.24,81.66]]){
  for(const [dx,dy] of [[[0,0],[0,0]],[[0.2,0.1],[-0.1,0.2]],[[3,0],[0,3]]]){
   const result=filtered(p,dx,dy,0.73,0.41);
   assert.equal(result.activation,0);assert.equal(result.weight,patchFactor(p)*0.73*0.41);
  }
  for(const [s,protection] of [[0,1],[1,0],[0,0]])assert.equal(filtered(p,[100,0],[0,100],s,protection).weight,0);
 }
});

test('finite bounded factor and smooth onset for anisotropic world footprints',()=>{
 for(let n=0;n<300;n++){
  const p=[n*7.137-1000,n*3.381-800],size=n/5;
  for(const [dx,dy] of [[[size,0],[0,size]],[[size,size*.4],[size*.02,-size*.03]]]){
   const r=filtered(p,dx,dy);assert.ok(Number.isFinite(r.weight));assert.ok(r.weight>=0&&r.weight<=0.660000000001);assert.ok(r.activation>=0&&r.activation<=1);
  }
 }
 for(const cells of [.25,.75]){
  const a=filtered([-200,-728],[(cells-1e-6)/.082,0],[0,.1]);
  const b=filtered([-200,-728],[(cells+1e-6)/.082,0],[0,.1]);
  assert.ok(Math.abs(a.weight-b.weight)<1e-5);
 }
});

test('sampled helper reproduces the original approved nonlinear patch factor',()=>{
 const baseline=diagnostic.reconstructFootprintBaseline(footprintShader);
 const names=['broad','macroField','mesoField','groundcoverDomainX','groundcoverDomainZ','groundcoverOrganic','groundcoverPatch','groundcoverPatchContinuity','groundcoverWeight'];
 let body=names.map(name=>{
  const expression=baseline.match(new RegExp('float '+name+'=([^;]+);'));
  assert.ok(expression,name);return 'let '+name+'='+expression[1]+';';
 }).join('\n');
 body=body.replace(/world\*([\d.]+)\+vec2\(([-\d.]+),([-\d.]+)\)/g,'vec2(world[0]*$1+($2),world[1]*$1+($3))')
  .replace(/world\*([\d.]+)/g,'scale(world,$1)').replace(/world\.x/g,'world[0]').replace(/world\.y/g,'world[1]');
 const original=new Function('noise2','vec2','smoothstep','scale','world','groundcoverSuitability','groundcoverProtection',body+'return groundcoverWeight;').bind(null,noise2,vec2,smoothstep,scale);
 for(let n=0;n<500;n++){
  const p=[n*17.31-4500,n*13.73-2700];assert.ok(Math.abs(patchFactor(p)-original(p,1,1))<1e-14);
 }
});

test('footprint instrumentation binds approved baseline and reads actual candidate activation',()=>{
 const baseline=diagnostic.reconstructFootprintBaseline(footprintShader);
 const before=diagnostic.instrumentFootprintRenderer(baseline,{baseline:true});
 const after=diagnostic.instrumentFootprintRenderer(footprintShader);
 assert.ok(before.includes('probeGCOrganic=smoothstep(0.25,0.75,max(length(footprintProbeDx*0.082),length(footprintProbeDy*0.082)));'));
 assert.ok(after.includes('probeGCOrganic=groundcoverFilterActivation;'));
 assert.ok(!before.includes('groundcoverPatchFactorAt'));
 assert.ok(after.includes('groundcoverPatchFactorAt'));
 const baselineMain=before.indexOf('void main(){',before.indexOf('const FS ='));
 const baselineDerivatives=before.indexOf('vec2 footprintProbeDx=');
 assert.equal(before.slice(baselineMain,baselineDerivatives).trim(),'void main(){');
 for(const [source,options] of [[baseline+'//drift',{baseline:true}],[footprintShader+'//drift',{}]])assert.throws(()=>diagnostic.instrumentFootprintRenderer(source,options),/MISMATCH/);
 assert.throws(()=>diagnostic.reconstructFootprintBaseline(baseline),/BLOCK_NOT_UNIQUE/);
 assert.throws(()=>diagnostic.reconstructFootprintBaseline(footprintShader+footprintBlock('HELPER')+'\n// H_EARTH_GROUNDCOVER_FOOTPRINT_HELPER_BEGIN\n// H_EARTH_GROUNDCOVER_FOOTPRINT_HELPER_END\n'),/BLOCK_NOT_UNIQUE/);
});

test('footprint paired captures reject wrong identity, mode, visibility, assets and camera',()=>{
 const candidateHead='a'.repeat(40),candidateHash='b'.repeat(64);
 const ids={'reference-lit':0,'after-groundcover-unlit':3,'footprint-activation-raw':4};
 const views=diagnostic.FOOTPRINT_POSES.flatMap(pose=>diagnostic.FOOTPRINT_MODES.flatMap(mode=>['baseline','candidate'].map(label=>({
  label,pose,mode,modeId:ids[mode],diagnosticApplied:ids[mode],grassHidden:mode!=='reference-lit',
  sourceHead:label==='baseline'?diagnostic.FOOTPRINT_BASELINE_HEAD:candidateHead,
  rendererHash:label==='baseline'?diagnostic.FOOTPRINT_BASELINE_SHA256:candidateHash,
  assetSignature:'same',lastFrame:{cameraPosition:{x:pose.x,y:pose.y??2,z:pose.z}}
 }))));
 assert.equal(views.length,24);assert.equal(diagnostic.validateFootprintSet(views,candidateHead),true);
 assert.throws(()=>diagnostic.validateFootprintSet(views,'moving-main'),/CANDIDATE_IDENTITY_INVALID/);
 assert.throws(()=>diagnostic.validateFootprintSet(views,'c'.repeat(40)),/SOURCE_OR_MODE_MISMATCH/);
 assert.throws(()=>diagnostic.validateFootprintSet(views.slice(1),candidateHead),/INCOMPLETE/);
 for(const mutate of [
  v=>v[0].label='unexpected',v=>v[0].label='candidate',v=>v[1].label='baseline',
  v=>v[0].sourceHead=candidateHead,v=>v[1].sourceHead=diagnostic.FOOTPRINT_BASELINE_HEAD,
  v=>v[0].rendererHash=candidateHash,v=>v[1].rendererHash='c'.repeat(64),
  v=>v.filter(x=>x.label==='candidate').forEach(x=>{x.rendererHash=diagnostic.FOOTPRINT_BASELINE_SHA256;}),
  v=>v.filter(x=>x.label==='candidate').forEach(x=>{x.rendererHash='invalid';}),
  v=>v[0].modeId=4,v=>v[1].diagnosticApplied=4,v=>v[0].mode='unknown',
  v=>v[0].grassHidden=true,v=>v[1].grassHidden=true,v=>v[2].grassHidden=false,
  v=>v[0].assetSignature='different',v=>v[1].lastFrame.cameraPosition.x++,
  v=>v[0].pose={...v[0].pose,name:'unregistered'}
 ]){
  const copy=structuredClone(views);mutate(copy);assert.throws(()=>diagnostic.validateFootprintSet(copy,candidateHead));
 }
});

test('four-tap footprint integration improves dense-reference RMS over one center sample',t=>{
 // Stratified midpoint integration independently samples the whole footprint;
 // it does not use the candidate's Gauss offsets or activation transition.
 let centerSquared=0,filteredSquared=0,count=0;
 for(let n=0;n<80;n++){
  const p=[n*23.17-800,n*13.31-1100],size=10+(n%4)*2;
  const dx=[size,size*.15],dy=[-size*.2,size*.7];
  let dense=0;
  for(let x=0;x<32;x++)for(let y=0;y<32;y++)dense+=patchFactor(offset(p,dx,(x+.5)/32-.5,dy,(y+.5)/32-.5));
  dense/=1024;const r=filtered(p,dx,dy);assert.equal(r.activation,1);
  centerSquared+=(patchFactor(p)-dense)**2;filteredSquared+=(r.weight-dense)**2;count++;
 }
 const centerRms=Math.sqrt(centerSquared/count),filteredRms=Math.sqrt(filteredSquared/count);
 t.diagnostic(JSON.stringify({sampleCount:count,denseTapsPerFootprint:1024,centerRms,filteredRms,precision:'JS_DOUBLE_NOT_GPU'}));
 assert.ok(centerRms>0);assert.ok(filteredRms<centerRms*.8,JSON.stringify({centerRms,filteredRms}));
});

// The successful baseline from the first GPU run is inherited, never silently recaptured.
test('preserved baseline pins all twelve original frame hashes',async()=>{
 const {preservedFootprintBaseline}=await import('./h-earth-ground-material-comparison.v1.mjs');
 const {mkdtempSync,rmSync}=await import('node:fs');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const out=mkdtempSync(join(tmpdir(),'footprint-baseline-'));
 try{const m=preservedFootprintBaseline(new URL('../',import.meta.url).pathname,out);assert.equal(m.views.length,12);assert.equal(m.sourceRun,40716213632);assert.equal(m.baselineErrors.length,0);}finally{rmSync(out,{recursive:true,force:true});}
});

const composedShader=fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-resident-field-20261028/rejected-composed-renderer.js',import.meta.url),'utf8');
test('composed target changes only the marked endpoint and retains exact approved source elsewhere',()=>{
 const baseline=diagnostic.reconstructComposedBaseline(composedShader);
 assert.equal(diagnostic.verifyExactMaterialCandidate(baseline),diagnostic.FOOTPRINT_BASELINE_SHA256);
 assert.ok(!composedShader.includes('H_EARTH_GROUNDCOVER_FOOTPRINT_'));
 assert.equal(composedShader.split(diagnostic.CANDIDATE_BLEND_EXPRESSION).length,2);
 assert.throws(()=>diagnostic.reconstructComposedBaseline(composedShader+'//drift'),/RECONSTRUCTION_MISMATCH/);
 assert.throws(()=>diagnostic.reconstructComposedBaseline(baseline),/BLOCK_NOT_UNIQUE/);
 const instrumented=diagnostic.instrumentComposedRenderer(composedShader);
 assert.ok(instrumented.includes('probeGCBefore=palette;'));
 assert.ok(instrumented.includes('probeGCTone=groundcoverTone;'));
 assert.ok(instrumented.indexOf('groundcoverTone=groundcoverRelative*')<instrumented.indexOf('probeGCTone=groundcoverTone;'));
 assert.ok(instrumented.includes('probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);'));
});

test('source-derived composed endpoint retains luminance, soil variation and protected zero weight',t=>{
 // Extract constants from the GLSL under test, then check its output against
 // independent luminance and homogeneity invariants across sampled positive soil/tone inputs.
 const lumaMatch=composedShader.match(/vec3 groundcoverLuma=vec3\(([^)]+)\);/);
 const luma=lumaMatch[1].split(',').map(Number);
 const epsilon=Number(composedShader.match(/max\(dot\(groundcoverRelative,groundcoverLuma\),([\d.]+)\)/)[1]);
 assert.deepEqual(luma,[.2126,.7152,.0722]);assert.equal(epsilon,.000001);
 assert.ok(composedShader.includes('vec3 groundcoverRelative=palette*groundcoverTone;'));
 assert.ok(composedShader.includes('groundcoverTone=groundcoverRelative*(dot(palette,groundcoverLuma)/'));
 const Y=c=>c.reduce((sum,x,i)=>sum+x*luma[i],0);
 const endpoint=(soil,tone)=>{const relative=soil.map((x,i)=>x*tone[i]);return relative.map(x=>x*Y(soil)/Math.max(Y(relative),epsilon));};
 let maxError=0,maxChannel=0;
 for(let i=0;i<1000;i++){
  const soil=[.025+(i%31)*.007,.03+(i%23)*.008,.02+(i%19)*.006];
  const moisture=(i%101)/100,dry=(i%66)/100,variation=.88+.24*((i%97)/96);
  const tone=[.110,.118,.075].map((x,k)=>mix(mix(x,[.075,.090,.055][k],moisture),[.175,.150,.095][k],dry)*variation);
  const target=endpoint(soil,tone);
  for(const weight of [0,.05,.33,.66]){
   const output=soil.map((x,k)=>mix(x,target[k],weight));
   maxError=Math.max(maxError,Math.abs(Y(output)-Y(soil)));
   maxChannel=Math.max(maxChannel,...output);
   assert.ok(output.every(x=>Number.isFinite(x)&&x>=0&&x<=1));
   if(weight===0)assert.deepEqual(output,soil);
   // Soil-brightness texture is propagated pointwise, not attenuated toward a constant endpoint.
   const bright=soil.map(x=>x*1.07),brightTarget=endpoint(bright,tone);
   const brighter=bright.map((x,k)=>mix(x,brightTarget[k],weight));
   for(let k=0;k<3;k++)assert.ok(Math.abs(brighter[k]-output[k]*1.07)<1e-14);
  }
 }
 assert.ok(maxError<1e-14);assert.deepEqual(endpoint([0,0,0],[.1,.1,.1]),[0,0,0]);
 t.diagnostic(JSON.stringify({sampleCount:1000,maxLinearLuminanceError:maxError,maxChannel,domain:'SAMPLED_POSITIVE_SOIL_TONE_DOMAIN_JS_DOUBLE_NOT_GPU',chromaticBandRemovalProven:false}));
});

test('duration normalization retains unknown fields, physical identity and malformed metadata',()=>{
 const identity={schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',installedRootCount:10,controlRoots:[{x:1,y:2,z:3}],entranceGrass:{generationMs:40,slopeRepair:{generationMs:12,rootCount:10,otherMs:3}}};
 const signature=x=>'[{"id":"tree","state":"READY","ready":true}]|'+JSON.stringify(x);
 const changed=structuredClone(identity);changed.entranceGrass.slopeRepair.generationMs=500;
 assert.equal(diagnostic.normalizeAssetSignature(signature(identity)),diagnostic.normalizeAssetSignature(signature(changed)));
 assert.equal(identity.entranceGrass.slopeRepair.generationMs,12);
 for(const mutate of [x=>x.installedRootCount++,x=>x.controlRoots[0].y++,x=>x.entranceGrass.generationMs++,x=>x.entranceGrass.slopeRepair.rootCount++,x=>x.entranceGrass.slopeRepair.otherMs++,x=>x.newPhysicalField=1,x=>delete x.entranceGrass.slopeRepair.generationMs,x=>x.entranceGrass.slopeRepair.generationMs='12',x=>x.entranceGrass.slopeRepair.generationMs=-1]){
  const copy=structuredClone(identity);mutate(copy);
  assert.notEqual(diagnostic.normalizeAssetSignature(signature(identity)),diagnostic.normalizeAssetSignature(signature(copy)));
 }
 assert.equal(diagnostic.normalizeAssetSignature('malformed|{'), 'malformed|{');
});

test('composed workflow binds the admitted branch, exact head and sixteen matched images',()=>{
 const workflow=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8').split('  groundcover-composed-target-comparison:')[1];
 assert.ok(workflow.includes("github.event.pull_request.head.ref == 'h-earth/groundcover-composed-target-20261028'"));
 assert.ok(workflow.includes('H_EARTH_COMPARISON_PROFILE: GROUNDCOVER_COMPOSED_TARGET_V1'));
 assert.equal(diagnostic.FOOTPRINT_POSES.length*diagnostic.COMPOSED_MODES.length*2,16);
 assert.deepEqual(diagnostic.COMPOSED_MODES,['reference-lit','after-groundcover-unlit']);
 assert.ok(workflow.includes('H_EARTH_COMPARISON_CANDIDATE_SHA: ${{ github.event.pull_request.head.sha }}'));
});

test('saved 24-image failed receipt has only the known timing mismatch and passes corrected identity',async()=>{
 const {gunzipSync}=await import('node:zlib');
 const receipt=JSON.parse(gunzipSync(fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-footprint-continuity-20261028/rejected-run40719150366/receipt.json.gz',import.meta.url))));
 const head='1e4eeaaec018b92e7eeade9ba17b773a4ea4ccef';
 assert.equal(receipt.result,'INCOMPLETE_OR_FAILED');
 assert.ok(receipt.errors.some(x=>x.includes('FOOTPRINT_PAIR_MISMATCH')));
 const paths=new Set();let rawMismatchCount=0;
 function differences(a,b,p=''){
  if(JSON.stringify(a)===JSON.stringify(b))return;
  if(a&&b&&typeof a==='object'&&typeof b==='object'){
   for(const key of new Set([...Object.keys(a),...Object.keys(b)]))differences(a[key],b[key],p?p+'.'+key:key);
  }else paths.add(p);
 }
 for(const pose of diagnostic.FOOTPRINT_POSES)for(const mode of diagnostic.FOOTPRINT_MODES){
  const pair=receipt.views.filter(v=>v.pose.name===pose.name&&v.mode===mode);
  assert.equal(pair.length,2);
  const [a,b]=pair.map(v=>v.assetSignature.split('|'));
  assert.equal(a[0],b[0]);
  if(a[1]!==b[1])rawMismatchCount++;
  differences(JSON.parse(a[1]),JSON.parse(b[1]));
 }
 assert.ok(rawMismatchCount>0);
 assert.deepEqual([...paths],['entranceGrass.slopeRepair.generationMs']);
 assert.equal(diagnostic.validateFootprintSet(receipt.views,head),true);
 // Every original PNG remains independently hash-bound in the durable artifact.
 const crypto=await import('node:crypto');
 for(const view of receipt.views){
  const bytes=fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-footprint-continuity-20261028/rejected-run40719150366/'+view.image,import.meta.url));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),view.imageSha256);
 }
 const subset=receipt.views.filter(v=>diagnostic.COMPOSED_MODES.includes(v.mode));
 assert.equal(diagnostic.validateComposedSet(subset,head),true);
 // Real-resource negatives: failure must survive the timing correction.
 for(const mutate of [
  v=>v.lastFrame.cameraPosition.x++,v=>v.state.pitchDegrees++,v=>v.canvas.width++,
  v=>v.resources.singleOwnerVegetation.installedRootCount++,
  v=>v.resources.singleOwnerVegetation.entranceGrass.slopeRepair.unexpectedRoot=1,
  v=>v.resources.singleOwnerVegetation.entranceGrass.slopeRepair.otherGenerationMs=1,
  v=>v.resources.treeCollection.entries[0].ready=!v.resources.treeCollection.entries[0].ready,
  v=>v.rendererHash='c'.repeat(64),v=>v.pose.yaw++,v=>v.grassHidden=!v.grassHidden
 ]){
  const copy=structuredClone(subset);mutate(copy.find(v=>v.label==='candidate'));
  assert.throws(()=>diagnostic.validateComposedSet(copy,head));
 }
});

// Frozen historical fixture from12513133; reconstruct against archived approved bytes
// so advancing the product renderer does not retarget resident/contribution tests.
const residentShader=diagnostic.reconstructFootprintBaseline(footprintShader).replace(diagnostic.ORIGINAL_GROUNDCOVER_FIELD,"      // H_EARTH_GROUNDCOVER_RESIDENT_FIELD_BEGIN\n      // Couple cover to the soil's existing meso/detail fields instead of\n      // imposing a separate rotated low-frequency color-region field.\n      float groundcoverOrganic=mesoField;\n      float groundcoverPatch=smoothstep(\n        0.20,0.66,groundcoverOrganic*0.78+detailField*0.22\n      );\n      // H_EARTH_GROUNDCOVER_RESIDENT_FIELD_END\n");
test('resident field replaces only independent domain support and restores exact approved source',()=>{
 const baseline=diagnostic.reconstructResidentBaseline(residentShader);
 assert.equal(diagnostic.verifyExactMaterialCandidate(baseline),diagnostic.FOOTPRINT_BASELINE_SHA256);
 assert.ok(!residentShader.includes('groundcoverDomainX'));
 assert.ok(!residentShader.includes('groundcoverDomainZ'));
 assert.ok(!residentShader.includes('H_EARTH_GROUNDCOVER_COMPOSED_TARGET_'));
 assert.ok(!residentShader.includes('H_EARTH_GROUNDCOVER_FOOTPRINT_'));
 assert.equal(residentShader.split(diagnostic.CANDIDATE_BLEND_EXPRESSION).length,2);
 assert.throws(()=>diagnostic.reconstructResidentBaseline(residentShader+'//drift'),/RECONSTRUCTION_MISMATCH/);
 assert.throws(()=>diagnostic.reconstructResidentBaseline(baseline),/BLOCK_NOT_UNIQUE/);
 const instrumented=diagnostic.instrumentResidentRenderer(residentShader);
 assert.ok(instrumented.includes('probeGCOrganic=groundcoverOrganic;'));
 assert.ok(instrumented.includes('probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);'));
});
test('source-derived resident support is bounded, monotone and retains original protected weight formula',()=>{
 const block=residentShader.match(/\/\/ H_EARTH_GROUNDCOVER_RESIDENT_FIELD_BEGIN\n([\s\S]*?)\/\/ H_EARTH_GROUNDCOVER_RESIDENT_FIELD_END/)[1];
 assert.ok(block.includes('float groundcoverOrganic=mesoField;'));
 assert.ok(!block.includes('noise2('));
 assert.ok(!block.includes('world.'));
 const body=block.replace(/\bfloat\b/g,'let');
 const patch=new Function('smoothstep','mesoField','detailField',body+'return groundcoverPatch;').bind(null,smoothstep);
 assert.equal(patch(0,0),0);assert.equal(patch(1,1),1);
 for(let meso=0;meso<=100;meso++){
  let prior=-1;
  for(let detail=0;detail<=100;detail++){
   const p=patch(meso/100,detail/100);
   assert.ok(Number.isFinite(p)&&p>=0&&p<=1&&p>=prior);prior=p;
   const expected=smoothstep(.20,.66,.78*meso/100+.22*detail/100);
   assert.ok(Math.abs(p-expected)<1e-14);
  }
 }
 const weightBody=diagnostic.CANDIDATE_BLEND_EXPRESSION.replace(/\bfloat\b/g,'let');
 const weight=new Function('smoothstep','groundcoverPatch','groundcoverSuitability','groundcoverProtection',weightBody+'return groundcoverWeight;').bind(null,smoothstep);
 for(let i=0;i<=100;i++)for(const [s,p] of [[0,1],[1,0],[0,0]])assert.equal(weight(i/100,s,p),0);
 for(let i=0;i<=100;i++){const v=weight(i/100,1,1);assert.ok(v>=0&&v<=.6600000000001);}
});
test('resident workflow captures same frozen poses and only the admitted branch',()=>{
 const workflow=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8').split('  groundcover-resident-field-comparison:')[1];
 assert.ok(workflow.includes("github.event.pull_request.head.ref == 'h-earth/groundcover-resident-field-20261028'"));
 assert.ok(workflow.includes('H_EARTH_COMPARISON_PROFILE: GROUNDCOVER_RESIDENT_FIELD_V1'));
 assert.ok(workflow.includes('H_EARTH_COMPARISON_CANDIDATE_SHA: ${{ github.event.pull_request.head.sha }}'));
 assert.equal(diagnostic.FOOTPRINT_POSES.length*diagnostic.COMPOSED_MODES.length*2,16);
});

test('contribution ledger freezes eight frames and exact rejected-source bytes without changing shader',()=>{
 assert.equal(diagnostic.CONTRIBUTION_SOURCE_HEAD,'1e39f93a07eb2cc5156483b899094937ba2149db');
 assert.equal(diagnostic.CONTRIBUTION_RENDERER_SHA256,'b4bda2b8953b5bcc3cd65e101a447a878c2d033ec683af53a93ff211c13cdf70');
 assert.deepEqual(diagnostic.CONTRIBUTION_POSES.map(p=>p.name),['inland-seam-near','inland-seam-far']);
 assert.deepEqual(diagnostic.CONTRIBUTION_MODES,['before-groundcover-unlit','groundcover-tone-color','groundcover-weight-raw','after-groundcover-unlit']);
 assert.equal(diagnostic.CONTRIBUTION_POSES.length*diagnostic.CONTRIBUTION_MODES.length,8);
 const instrumented=diagnostic.instrumentContributionRenderer(residentShader);
 for(const anchor of ['probeGCBefore=palette;','probeGCTone=groundcoverTone;','probeGCWeight=groundcoverWeight;','probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);'])assert.ok(instrumented.includes(anchor));
 assert.ok(instrumented.includes('if(m==12)albedo=probeGCSeen>0.5?probeGCTone:base;'));
 assert.throws(()=>diagnostic.instrumentContributionRenderer(residentShader+'//drift'),/FROZEN_RENDERER_MISMATCH/);
 assert.throws(()=>diagnostic.instrumentContributionRenderer(composedShader),/FROZEN_RENDERER_MISMATCH/);
});

test('contribution ledger enforces exact modes, source, resource identity, scene state and frame custody',async()=>{
 const {gunzipSync}=await import('node:zlib');
 const receipt=JSON.parse(gunzipSync(fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-resident-field-20261028/run40734434775/receipt.json.gz',import.meta.url))));
 // Synthetic validation fixtures reuse actual resource/state shapes. They are
 // never image evidence: the newly selected modes have not been captured here.
 const ids=[2,12,11,3];
 const views=diagnostic.CONTRIBUTION_POSES.flatMap(pose=>diagnostic.CONTRIBUTION_MODES.map((mode,i)=>{
  const captured=receipt.views.find(v=>v.label==='candidate'&&v.pose.name===pose.name&&v.mode==='after-groundcover-unlit');
  const view=structuredClone(captured);
  delete view.image;delete view.imageSha256;
  return {...view,mode,modeId:ids[i],diagnosticApplied:ids[i],sourceHead:diagnostic.CONTRIBUTION_SOURCE_HEAD};
 }));
 assert.equal(diagnostic.validateContributionSet(views),true);
 assert.throws(()=>diagnostic.validateContributionSet(views.slice(1)),/INCOMPLETE/);
 for(const mutate of [
  v=>v.label='baseline',v=>v.sourceHead='a'.repeat(40),v=>v.rendererHash='b'.repeat(64),
  v=>v.modeId=0,v=>v.diagnosticApplied=0,v=>v.grassHidden=false,
  v=>v.lastFrame.cameraPosition.y++,v=>v.state.yawDegrees++,v=>v.pose.pitch++,
  v=>v.canvas.height++,v=>v.lastFrame.navigationSequence++,
  v=>v.resources.singleOwnerVegetation.controlRoots=[{x:0,y:0,z:0}],
  v=>v.resources.singleOwnerVegetation.gpuObservedBufferBytes++,
  v=>v.resources.treeCollection.queue.loading=true
 ]){
  const copy=structuredClone(views);mutate(copy[0]);
  assert.throws(()=>diagnostic.validateContributionSet(copy));
 }
});

test('contribution profile permits only one shared frozen scene plus distinct output',async()=>{
 const {execFileSync}=await import('node:child_process');
 const moduleUrl=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url).href;
 const script=`import assert from 'node:assert/strict';import {HEADS,parseArgs} from ${JSON.stringify(moduleUrl)};
 assert.equal(HEADS.candidate,'1e39f93a07eb2cc5156483b899094937ba2149db');
 const args=parseArgs(['--baseline-dir','scene','--candidate-dir','scene','--output','output']);assert.equal(args['--baseline-dir'],args['--candidate-dir']);
 for(const paths of [['one','two','out'],['scene','scene','scene']])assert.throws(()=>parseArgs(['--baseline-dir',paths[0],'--candidate-dir',paths[1],'--output',paths[2]]),/ONE_FROZEN_SCENE/);`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'GROUNDCOVER_CONTRIBUTION_LEDGER_V1'},encoding:'utf8'});
 assert.throws(()=>parseArgs(['--baseline-dir','scene','--candidate-dir','scene','--output','out']),/DIRECTORIES_NOT_DISTINCT/);
});

test('contribution workflow uses exactly two checkouts and never renders a baseline',()=>{
 const workflow=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8').split('  groundcover-contribution-ledger-comparison:')[1].split('\n  identity-blend-diagnostic:')[0];
 assert.ok(workflow.includes("github.event.pull_request.head.ref == 'h-earth/groundcover-contribution-ledger-20261028'"));
 assert.equal(workflow.split('uses: actions/checkout@v4').length-1,2);
 assert.equal(workflow.split('ref: ${{ github.event.pull_request.head.sha }}').length-1,1);
 assert.equal(workflow.split('ref: '+diagnostic.CONTRIBUTION_SOURCE_HEAD).length-1,1);
 assert.ok(workflow.includes('H_EARTH_COMPARISON_PROFILE: GROUNDCOVER_CONTRIBUTION_LEDGER_V1'));
 assert.ok(workflow.includes('--baseline-dir ../scene --candidate-dir ../scene'));
 assert.ok(!workflow.includes('path: baseline'));
 assert.ok(!workflow.includes('H_EARTH_COMPARISON_CANDIDATE_SHA:'));
});

test('contribution failure receipt binds frozen source rather than historical diagnostic defaults',async()=>{
 const {execFileSync}=await import('node:child_process');
 const moduleUrl=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url).href;
 const script=`import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';import {run,CONTRIBUTION_SOURCE_HEAD,CONTRIBUTION_RENDERER_SHA256,CONTRIBUTION_MODES} from ${JSON.stringify(moduleUrl)};
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'contribution-receipt-'));const scene=path.join(dir,'scene'),output=path.join(dir,'out');
 try{fs.mkdirSync(scene);execFileSync('git',['init','-q',scene]);execFileSync('git',['-C',scene,'-c','user.name=Test','-c','user.email=test@local','commit','--allow-empty','-qm','test']);
 await assert.rejects(run(['--baseline-dir',scene,'--candidate-dir',scene,'--output',output]),/CHECKOUT_HEAD_MISMATCH/);
 const r=JSON.parse(fs.readFileSync(path.join(output,'receipt.json')));
 assert.deepEqual(r.heads,{candidate:CONTRIBUTION_SOURCE_HEAD});assert.equal(r.sourceProductSha256,CONTRIBUTION_RENDERER_SHA256);assert.equal(r.baselineProductSha256,null);assert.equal(r.noBaselineCapture,true);assert.equal(r.repairOperationId,'H_EARTH_GROUNDCOVER_CONTRIBUTION_LEDGER_20261028_001');assert.deepEqual(Object.keys(r.stageMeanings),CONTRIBUTION_MODES);assert.equal(r.productDiskMutation,false);assert.equal(r.views.length,0);assert.equal(r.sceneParity,undefined);assert.equal(r.result,'INCOMPLETE_OR_FAILED');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'GROUNDCOVER_CONTRIBUTION_LEDGER_V1'},encoding:'utf8'});
});

test('residual candidate is only the reviewed composition change against approved bytes',()=>{
 const source=diagnostic.reconstructFootprintBaseline(footprintShader).replace(diagnostic.ORIGINAL_RESIDUAL_COMPOSITION,diagnostic.RESIDUAL_COMPOSITION);
 const baseline=diagnostic.reconstructResidualBaseline(source);
 assert.equal(baseline,diagnostic.reconstructFootprintBaseline(footprintShader));
 assert.ok(!source.includes('groundcoverTone*=0.88+0.24*materialVariation;'));
 assert.ok(source.includes(diagnostic.CANDIDATE_BLEND_EXPRESSION));
 assert.throws(()=>diagnostic.reconstructResidualBaseline(source+diagnostic.RESIDUAL_COMPOSITION),/ANCHOR_NOT_UNIQUE/);
 assert.throws(()=>diagnostic.reconstructResidualBaseline(baseline),/ANCHOR_NOT_UNIQUE/);
 for(const [old,value] of [['smoothstep(28.0,72.0','smoothstep(27.0,72.0'],['(1.0-protectedGrove)','(1.0-0.5*protectedGrove)'],['0.24*groundcoverWeight','0.25*groundcoverWeight']])assert.throws(()=>diagnostic.reconstructResidualBaseline(source.replace(old,value)));
 const observed=diagnostic.instrumentResidualRenderer(source);
 assert.equal(diagnostic.verifyResidualInstrumentation(observed),true);
 for(const bad of [observed.replace(diagnostic.RESIDUAL_PROBE,'      probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);'),observed+diagnostic.RESIDUAL_PROBE,observed.replace(diagnostic.RESIDUAL_COMPOSITION,'      palette=mix(palette,groundcoverTone,groundcoverWeight);'),observed+'groundcoverTone*=0.88+0.24*materialVariation;'])assert.throws(()=>diagnostic.verifyResidualInstrumentation(bad),/PROBE_CONTAMINATION/);
 // Execute the scalar form of the exact source expressions: lit composition
 // and probe agree, retain incoming-soil differences, and vanish at v=.5/w=0.
 const expression=diagnostic.RESIDUAL_COMPOSITION.trim().replace('palette+=','palette=palette+');
 const compose=new Function('palette','groundcoverWeight','groundcoverTone','materialVariation',expression+'return palette;');
 const probe=new Function('palette','groundcoverWeight','groundcoverTone','materialVariation','let probeGCAfter;'+diagnostic.RESIDUAL_PROBE+'return probeGCAfter;');
 for(const p of [.02,.2,.8])for(const w of [0,.1,.66])for(const t of [.055,.11,.175])for(const v of [0,.5,1]){
  const actual=compose(p,w,t,v);assert.equal(actual,probe(p,w,t,v));assert.ok(Math.abs(actual-(p+.24*w*t*(v-.5)))<1e-15);
  assert.ok(Math.abs((compose(p+.01,w,t,v)-actual)-.01)<1e-15);
  if(w===0||v===.5)assert.equal(actual,p);
 }
});

test('residual coast gate compares every decoded RGBA channel and rejects any pixel drift',()=>{
 const image=()=>({width:529,height:980,data:Buffer.alloc(529*980*4,100)});
 assert.equal(diagnostic.compareDecodedCoastPair(image(),image()).differingPixels,0);
 for(const index of [0,3,529*980*4-1]){const bad=image();bad.data[index]++;assert.throws(()=>diagnostic.compareDecodedCoastPair(image(),bad),/PIXEL_MISMATCH:1/);}
 for(const mutate of [v=>v.width++,v=>v.height--,v=>v.data=v.data.subarray(1)]){const bad=image();mutate(bad);assert.throws(()=>diagnostic.compareDecodedCoastPair(image(),bad),/DECODE_INVALID/);}
});

test('residual profile freezes only eight candidate frames and keeps baseline inherited',async()=>{
 const {execFileSync}=await import('node:child_process');
 const url=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url).href;
 const script=`import assert from 'node:assert/strict';import {HEADS,RESIDUAL_POSES,RESIDUAL_MODES,parseArgs} from ${JSON.stringify(url)};
 assert.equal(HEADS.baseline,'cb57c275b95d0d48883bc4da4dcfcf17cbec5060');assert.equal(HEADS.candidate,'${'a'.repeat(40)}');
 assert.deepEqual(RESIDUAL_POSES.map(p=>p.name),['inland-seam-near','inland-seam-far','protected-meadow','protected-coast']);
 assert.deepEqual(RESIDUAL_MODES,['reference-lit','after-groundcover-unlit']);assert.equal(RESIDUAL_POSES.length*RESIDUAL_MODES.length,8);
 assert.throws(()=>parseArgs(['--baseline-dir','same','--candidate-dir','same','--output','out']),/DIRECTORIES_NOT_DISTINCT/);`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'GROUNDCOVER_RESIDUAL_TRANSFER_V1',H_EARTH_COMPARISON_CANDIDATE_SHA:'a'.repeat(40)},encoding:'utf8'});
 assert.throws(()=>execFileSync(process.execPath,['--input-type=module','-e',`await import(${JSON.stringify(url)})`],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'GROUNDCOVER_RESIDUAL_TRANSFER_V1',H_EARTH_COMPARISON_CANDIDATE_SHA:''},stdio:'pipe'}),/CANDIDATE_EXACT_SHA_REQUIRED/);
 const workflow=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8').split('  groundcover-residual-transfer-comparison:')[1].split('\n  groundcover-contribution-ledger-comparison:')[0];
 assert.ok(workflow.includes("github.event_name == 'workflow_dispatch'"));assert.ok(!workflow.includes("github.event_name == 'pull_request'"));
 assert.ok(workflow.includes("github.ref == 'refs/heads/h-earth/groundcover-residual-transfer-20261028'"));
 assert.ok(workflow.includes('H_EARTH_COMPARISON_PROFILE: GROUNDCOVER_RESIDUAL_TRANSFER_V1'));
 assert.ok(workflow.includes('pngjs@7.0.0'));assert.ok(workflow.includes('test "$RUN_ATTEMPT" = 1'));
});

test('residual scene parity excludes only declared new evidence and preserves world asset custody',async()=>{
 const {execFileSync}=await import('node:child_process');const {tmpdir}=await import('node:os');const path=await import('node:path');
 const root=fs.mkdtempSync(path.join(tmpdir(),'residual-parity-'));
 const git=(dir,args)=>execFileSync('git',['-C',dir,...args],{stdio:'pipe'});
 const put=(dir,name,body)=>{const p=path.join(dir,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,body);};
 const commit=dir=>{git(dir,['add','.']);git(dir,['-c','user.name=Test','-c','user.email=test@local','commit','-qm','fixture']);};
 try{
  const a=path.join(root,'baseline'),b=path.join(root,'candidate');fs.mkdirSync(a);git(a,['init','-q']);
  put(a,'h-earth-3d/protected-world.json','world');put(a,'showroom/globe/h-earth/render/protected-asset.js','asset');commit(a);execFileSync('git',['clone','-q',a,b]);
  put(b,diagnostic.RESIDUAL_EVIDENCE_PATHS[0],'declared evidence');put(b,diagnostic.PRESERVED_CONTRIBUTION_EVIDENCE_PATHS[0],'old preserved diagnostic');commit(b);
  assert.equal(diagnostic.assertSceneParity(a,b,{residual:true}).result,'EXACT_SCENE_TREE_PARITY_EXCEPT_DECLARED_RENDERER_AND_EVIDENCE');
  assert.throws(()=>diagnostic.assertSceneParity(a,b),/SCENE_SOURCE_DRIFT/);
  put(b,'h-earth-3d/evidence/groundcover-residual-transfer-20261028/unadmitted.json','not allowed');commit(b);assert.throws(()=>diagnostic.assertSceneParity(a,b,{residual:true}),/SCENE_SOURCE_DRIFT/);
  git(b,['reset','--hard','HEAD~1']);put(b,'showroom/globe/h-earth/render/protected-asset.js','changed asset');commit(b);assert.throws(()=>diagnostic.assertSceneParity(a,b,{residual:true}),/SCENE_SOURCE_DRIFT/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('residual paired custody rejects candidate hash, frame, camera, pose, modes and assets drift',async()=>{
 const {gunzipSync}=await import('node:zlib');
 const captured=JSON.parse(gunzipSync(fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-resident-field-20261028/run40734434775/receipt.json.gz',import.meta.url))));
 // Shape-only synthetic test fixtures, never presented as residual image evidence.
 const head='a'.repeat(40),hash='b'.repeat(64);
 const views=captured.views.filter(v=>diagnostic.RESIDUAL_MODES.includes(v.mode)).map(v=>({...structuredClone(v),...(v.label==='candidate'?{sourceHead:head,rendererHash:hash}:{})}));
 assert.equal(diagnostic.validateResidualSet(views,head,hash),true);
 assert.throws(()=>diagnostic.validateResidualSet(views.slice(1),head,hash));
 for(const mutate of [v=>v.sourceHead='c'.repeat(40),v=>v.rendererHash='d'.repeat(64),v=>v.lastFrame.navigationSequence++,v=>v.lastFrame.cameraPosition.y++,v=>v.pose.pitch++,v=>v.mode='before-groundcover-unlit',v=>v.diagnosticApplied=2,v=>v.grassHidden=!v.grassHidden,v=>v.resources.singleOwnerVegetation.gpuObservedBufferBytes++,v=>v.assetSignature+='drift']){
  const bad=structuredClone(views);mutate(bad.find(v=>v.label==='candidate'));assert.throws(()=>diagnostic.validateResidualSet(bad,head,hash));
 }
});


test('identity interception freezes approved source and preserves actual palette arithmetic',()=>{
 const approved=diagnostic.reconstructFootprintBaseline(footprintShader);
 const instrumented=diagnostic.instrumentIdentityRenderer(approved);
 assert.throws(()=>diagnostic.instrumentIdentityRenderer(approved+'\n'),/IDENTITY_FROZEN_RENDERER_MISMATCH/);
 assert.throws(()=>diagnostic.instrumentIdentityRenderer(footprintShader),/IDENTITY_FROZEN_RENDERER_MISMATCH/);
 assert.ok(instrumented.includes('identityP=palette;\n    identityC=palette;\n    identityT=palette;\n    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY'));
 const actual='      palette=mix(palette,identityBase,identityWeight);';
 assert.equal(instrumented.split(actual).length,2);
 assert.ok(instrumented.includes(actual+'\n      identityC=palette;'));
 const fsStart=instrumented.indexOf('const FS = '),main=instrumented.indexOf('void main(){',fsStart),derivative=instrumented.indexOf('identityDx=dFdx(vWorldPosition)',main),firstIf=instrumented.indexOf('if(',main),firstDiscard=instrumented.indexOf('discard;',main);
 assert.ok(derivative>main&&derivative<firstIf&&derivative<firstDiscard);
 assert.ok(instrumented.includes('else if(uIdentityDiagnosticMode==2)lit=identityT;\n  }\n  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));'));
 assert.ok(instrumented.includes('if(uIdentityDiagnosticMode>=3){\n    lit=vec3(0.0);\n    if(worldSoilTerrain&&identitySeen>0.5)'));
 assert.ok(instrumented.includes('identityPack1=vec3(upperDry,mineralExposure,identityWeight)'));
 assert.ok(instrumented.includes('identityPack5=vec3(inlandIdentity,protectedGrove,smoothstep(8.0,30.0,vWorldPosition.y))'));
 assert.ok(instrumented.includes('identityQWorld/(1.0+identityQWorld),identityQTri/(1.0+identityQTri),identitySeen'));
 // Reconstruct exact original FS arithmetic by removing only inserted probe lines/blocks.
 const originalIdentity=approved.slice(approved.indexOf('    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY'),approved.indexOf('      // H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN'));
 const observedIdentity=instrumented.slice(instrumented.indexOf('    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY'),instrumented.indexOf('      // H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN')).replace(/^      identity(?:T|Seen|Pack[0-5]|C)=.*;\n/gm,'');
 assert.equal(observedIdentity,originalIdentity);
});

test('identity profile fixes one source,20 modes and one submission without changing legacy profile',async()=>{
 const {execFileSync}=await import('node:child_process');const url=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url).href;
 const script=`import assert from 'node:assert/strict';import {HEADS,IDENTITY_SOURCE_HEAD,IDENTITY_MODES,IDENTITY_POSES,parseArgs} from ${JSON.stringify(url)};
 assert.equal(HEADS.baseline,IDENTITY_SOURCE_HEAD);assert.equal(HEADS.candidate,IDENTITY_SOURCE_HEAD);assert.equal(IDENTITY_MODES.length*IDENTITY_POSES.length,20);
 const a=parseArgs(['--baseline-dir','scene','--candidate-dir','scene','--output','output']);assert.equal(a['--baseline-dir'],a['--candidate-dir']);
 assert.throws(()=>parseArgs(['--baseline-dir','a','--candidate-dir','b','--output','out']),/ONE_FROZEN_SCENE/);`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'IDENTITY_BLEND_DIAGNOSTIC_V1'},encoding:'utf8'});
 const runner=fs.readFileSync(new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url),'utf8');
 const expression=runner.match(/submissionCount:\(([^)]+)\)\?1:12/);
 assert.ok(expression,'bounded submission-count expression is present');
 const flags=['productionCapture','correctedCapture','worldCapture','identityCapture'];
 assert.deepEqual(expression[1].split('||').sort(),[...flags].sort());
 const count=new Function(...flags,`return (${expression[1]})?1:12`);
 for(let mask=0;mask<16;mask++)assert.equal(count(...flags.map((_,i)=>Boolean(mask&(1<<i)))),mask===0?12:1);
 assert.ok(runner.includes('while(stable<2)'));
});

test('identity evidence validator rejects missing modes, drift,wrong source and timing expansion',async()=>{
 const {gunzipSync}=await import('node:zlib');
 const cap=JSON.parse(gunzipSync(fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/receipt.json.gz',import.meta.url))));
 const views=diagnostic.IDENTITY_POSES.flatMap(pose=>diagnostic.IDENTITY_MODES.map((mode,index)=>{
  const v=structuredClone(cap.views.find(v=>v.pose.name===pose.name));
  return {...v,pose:{...pose},mode,modeId:index,diagnosticApplied:index,sourceHead:diagnostic.IDENTITY_SOURCE_HEAD,rendererHash:diagnostic.IDENTITY_RENDERER_SHA256,cpuSubmitMilliseconds:[1],softwareGpuFinishMilliseconds:[1]};
 }));
 assert.equal(diagnostic.validateIdentitySet(views),true);
 assert.throws(()=>diagnostic.validateIdentitySet(views.slice(1)),/FRAME_CAP/);
 for(const mutate of [v=>v.mode='wrong',v=>v.sourceHead='a'.repeat(40),v=>v.rendererHash='b'.repeat(64),v=>v.pose.y++,v=>v.lastFrame.cameraPosition.y++,v=>v.assetSignature+='drift',v=>v.diagnosticApplied++,v=>v.grassHidden=false,v=>v.cpuSubmitMilliseconds.push(2)]){
  const bad=structuredClone(views);mutate(bad[1]);assert.throws(()=>diagnostic.validateIdentitySet(bad));
 }
});

test('identity workflow requires explicit reviewed immutable launch and cannot launch on pull request',()=>{
 const all=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');const y=all.split('\n  identity-blend-diagnostic:')[1].split('\n  identity-fertile-transition-comparison:')[0];
 assert.ok(y.includes("github.event_name == 'workflow_dispatch'"));assert.ok(!y.includes("github.event_name == 'pull_request'"));
 assert.ok(y.includes("github.ref == 'refs/heads/h-earth/identity-blend-diagnostic-20261028'"));
 assert.ok(all.includes("inputs.route_query != 'qualification=identity-blend-diagnostic-v1'"));
 assert.equal(y.split('uses: actions/checkout@v4').length-1,3);assert.ok(!y.includes('path: baseline'));assert.ok(!y.includes('path: candidate'));
 for(const required of ['test "$RUN_ATTEMPT" = 1',"assert.equal(intent.lockGeneration,2962)","assert.equal(intent.candidateFrames,20)","assert.equal(intent.toolingHead,process.env.TARGET_SHA)","assert.equal(review.builderSelfApproval,false)","assert.equal(admission.result,'ADMITTED_AND_LOCKED')","assert.equal(intent.sceneRendererSha256,sceneHash)",'--baseline-dir ../scene --candidate-dir ../scene'])assert.ok(y.includes(required),required);
 assert.ok(y.includes("assert.equal(intent.automaticRetry,false)"));assert.ok(y.includes('H_EARTH_COMPARISON_PROFILE: IDENTITY_BLEND_DIAGNOSTIC_V1'));
});

test('fertile transition is an exact approved-source endpoint change and its overlay preserves both actual modes',()=>{
 const source=diagnostic.reconstructFootprintBaseline(footprintShader).replace(diagnostic.FERTILE_ORIGINAL_EXPRESSION,diagnostic.FERTILE_CANDIDATE_EXPRESSION);
 const baseline=diagnostic.reconstructFertileBaseline(source);
 assert.equal(baseline,diagnostic.reconstructFootprintBaseline(footprintShader));
 assert.ok(source.includes(diagnostic.ORIGINAL_RESIDUAL_COMPOSITION));
 assert.ok(!source.includes(diagnostic.RESIDUAL_COMPOSITION));
 assert.throws(()=>diagnostic.reconstructFertileBaseline(source+'\n'),/RECONSTRUCTION_MISMATCH/);
 assert.throws(()=>diagnostic.reconstructFertileBaseline(source+diagnostic.FERTILE_CANDIDATE_EXPRESSION),/ANCHOR_NOT_UNIQUE/);
 const observed=diagnostic.instrumentFertileRenderer(source);
 assert.equal(diagnostic.verifyFertileInstrumentation(observed),true);
 assert.ok(observed.includes('if(m==3)albedo=probeGCSeen>0.5?probeGCAfter:base;'));
 for(const contaminated of [observed.replace(diagnostic.FERTILE_CANDIDATE_EXPRESSION,diagnostic.FERTILE_ORIGINAL_EXPRESSION),observed+diagnostic.RESIDUAL_COMPOSITION,observed.replace('probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);',diagnostic.RESIDUAL_PROBE)])assert.throws(()=>diagnostic.verifyFertileInstrumentation(contaminated),/CONTAMINATION/);
});
test('fertile profile is exactly eight candidate frames, frozen paired controls and an explicit isolated dispatch',async()=>{
 const {execFileSync}=await import('node:child_process');const url=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url).href;
 const script=`import assert from 'node:assert/strict';import {HEADS,FERTILE_POSES,FERTILE_MODES} from ${JSON.stringify(url)};assert.equal(HEADS.candidate,'${'a'.repeat(40)}');assert.equal(HEADS.baseline,'cb57c275b95d0d48883bc4da4dcfcf17cbec5060');assert.deepEqual(FERTILE_MODES,['reference-lit','after-groundcover-unlit']);assert.deepEqual(FERTILE_POSES.map(p=>p.name),['inland-seam-near','inland-seam-far','protected-meadow','protected-coast']);assert.equal(FERTILE_MODES.length*FERTILE_POSES.length,8);`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'IDENTITY_FERTILE_TRANSITION_V1',H_EARTH_COMPARISON_CANDIDATE_SHA:'a'.repeat(40)},encoding:'utf8'});
 assert.throws(()=>execFileSync(process.execPath,['--input-type=module','-e',`await import(${JSON.stringify(url)})`],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'IDENTITY_FERTILE_TRANSITION_V1',H_EARTH_COMPARISON_CANDIDATE_SHA:''},stdio:'pipe'}),/CANDIDATE_EXACT_SHA_REQUIRED/);
 const all=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8');
 assert.ok(all.split('    runs-on:')[0].includes("inputs.route_query != 'qualification=identity-fertile-transition-v1'"));
 const job=all.split('\n  identity-fertile-transition-comparison:')[1];
 assert.ok(job.includes("github.event_name == 'workflow_dispatch'"));assert.ok(job.includes("github.ref == 'refs/heads/h-earth/identity-fertile-transition-20261028'"));
 assert.ok(job.includes('H_EARTH_COMPARISON_PROFILE: IDENTITY_FERTILE_TRANSITION_V1'));assert.ok(job.includes('test "$RUN_ATTEMPT" = 1'));
 assert.ok(job.includes('assert.equal(intent.lockGeneration,2963)'));assert.ok(job.includes('assert.equal(intent.candidateFrames,8)'));assert.ok(job.includes('assert.equal(review.builderSelfApproval,false)'));
});
test('fertile scene parity excludes declared evidence but rejects world and undeclared historical evidence drift',async()=>{
 const {execFileSync}=await import('node:child_process');const {tmpdir}=await import('node:os');const path=await import('node:path');
 const root=fs.mkdtempSync(path.join(tmpdir(),'fertile-parity-')),a=path.join(root,'a'),b=path.join(root,'b');
 const git=(dir,args)=>execFileSync('git',['-C',dir,...args],{stdio:'pipe'});const put=(dir,p,v)=>{fs.mkdirSync(path.dirname(path.join(dir,p)),{recursive:true});fs.writeFileSync(path.join(dir,p),v);};const commit=dir=>{git(dir,['add','.']);git(dir,['-c','user.name=Test','-c','user.email=test@local','commit','-qm','fixture']);};
 try{fs.mkdirSync(a);git(a,['init','-q']);put(a,'h-earth-3d/protected-world.json','world');commit(a);execFileSync('git',['clone','-q',a,b]);
 put(b,diagnostic.PRESERVED_IDENTITY_EVIDENCE_PATHS[0],'preserved');put(b,'h-earth-3d/evidence/identity-fertile-transition-20261028/admission-receipt.json','new evidence');commit(b);assert.equal(diagnostic.assertSceneParity(a,b,{fertile:true}).result,'EXACT_SCENE_TREE_PARITY_EXCEPT_DECLARED_RENDERER_AND_EVIDENCE');
 put(b,'h-earth-3d/evidence/identity-blend-diagnostic-20261028/not-preserved.json','not admitted');commit(b);assert.throws(()=>diagnostic.assertSceneParity(a,b,{fertile:true}),/SCENE_SOURCE_DRIFT/);
 git(b,['reset','--hard','HEAD~1']);put(b,'h-earth-3d/protected-world.json','changed');commit(b);assert.throws(()=>diagnostic.assertSceneParity(a,b,{fertile:true}),/SCENE_SOURCE_DRIFT/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});


test('world diagnostic profile freezes baseline and exactly eight near/far modes',async()=>{
 const {execFileSync}=await import('node:child_process');const url=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url).href;
 const script=`import assert from 'node:assert/strict';import {HEADS,WORLD_POSES,parseArgs} from ${JSON.stringify(url)};assert.equal(HEADS.candidate,'cb57c275b95d0d48883bc4da4dcfcf17cbec5060');assert.equal(WORLD_POSES.length,2);parseArgs(['--baseline-dir','scene','--candidate-dir','scene','--output','out']);assert.throws(()=>parseArgs(['--baseline-dir','a','--candidate-dir','b','--output','out']),/ONE_FROZEN_SCENE/);`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'WORLD_POSITION_DIAGNOSTIC_V1'},encoding:'utf8'});
});
test('world pixels enforce exact calibration, opaque alpha, range and valid terrain',async()=>{
 const {encodeWorld,calibrationExpected}=await import('./h-earth-world-position-overlay.mjs');
 const png={width:529,height:980,data:Buffer.alloc(529*980*4)};for(let i=3;i<png.data.length;i+=4)png.data[i]=255;
 const strip=(980-1)*529*4;Buffer.from(calibrationExpected(0).flat()).copy(png.data,strip);Buffer.from(encodeWorld(-200,0)).copy(png.data,0);
 const v=diagnostic.validateWorldPixels(png,0);assert.equal(v.validPixels,1);assert.equal(v.min,-200);
 png.data[3]=254;assert.throws(()=>diagnostic.validateWorldPixels(png,0),/RGBA/);png.data[3]=255;
 png.data[strip+1]^=1;assert.throws(()=>diagnostic.validateWorldPixels(png,0),/CALIBRATION/);png.data[strip+1]^=1;
 Buffer.from([255,255,255,255]).copy(png.data,0);assert.throws(()=>diagnostic.validateWorldPixels(png,0),/OUT_OF_RANGE/);
 Buffer.from([0,0,0,255]).copy(png.data,0);assert.throws(()=>diagnostic.validateWorldPixels(png,0),/NO_TERRAIN/);
});
test('world evidence rejects source, calibration, masks and camera drift',async()=>{
 const {gunzipSync}=await import('node:zlib');const {WORLD_MODES,calibrationExpected}=await import('./h-earth-world-position-overlay.mjs');
 const cap=JSON.parse(gunzipSync(fs.readFileSync(new URL('../h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768/receipt.json.gz',import.meta.url))));
 const views=diagnostic.WORLD_POSES.flatMap(pose=>WORLD_MODES.map((mode,index)=>{
  const v=structuredClone(cap.views.find(v=>v.pose.name===pose.name));
  return {...v,pose:{...pose},mode,modeId:index,diagnosticApplied:index,sourceHead:diagnostic.IDENTITY_SOURCE_HEAD,rendererHash:diagnostic.IDENTITY_RENDERER_SHA256,cpuSubmitMilliseconds:[1],softwareGpuFinishMilliseconds:[1],worldActualPacket:{mode:index,camera:{position:{...v.lastFrame.cameraPosition}},viewport:{width:529,height:980}},worldPacket:{camera:{position:{...v.lastFrame.cameraPosition}},viewport:{width:529,height:980}},worldData:{calibration:calibrationExpected(index).flat(),calibrationVerified:true,validPixels:1,terrainMaskSha256:'a'.repeat(64)}};
 }));
 assert.equal(diagnostic.validateWorldSet(views),true);assert.throws(()=>diagnostic.validateWorldSet(views.slice(1)),/FRAME_CAP/);
 for(const mutate of [v=>v.mode='wrong',v=>v.sourceHead='a'.repeat(40),v=>v.worldData.calibration[0]^=1,v=>v.worldData.terrainMaskSha256='bad',v=>v.worldPacket.camera.position.x++,v=>v.worldData.validPixels=0,v=>v.cpuSubmitMilliseconds.push(1)]){const bad=structuredClone(views);mutate(bad[1]);assert.throws(()=>diagnostic.validateWorldSet(bad));}
});

import {validateCorrectedSet,FOOTPRINT_POSES,FOOTPRINT_BASELINE_HEAD,FOOTPRINT_BASELINE_SHA256} from './h-earth-ground-material-comparison.v1.mjs';
const correctedFixture=()=>FOOTPRINT_POSES.flatMap(pose=>['baseline','candidate'].map(label=>({label,pose,mode:'reference-lit',modeId:0,diagnosticApplied:0,grassHidden:false,sourceHead:FOOTPRINT_BASELINE_HEAD,rendererHash:FOOTPRINT_BASELINE_SHA256,instrumentation:[{path:'/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',sourceSha256:FOOTPRINT_BASELINE_SHA256,observedSha256:label==='baseline'?'a'.repeat(64):'b'.repeat(64)}],assetSignature:'[]',lastFrame:{cameraPosition:{x:pose.x,y:pose.y??0,z:pose.z}},canvas:{width:960,height:540},correctedReceipt:label==='candidate'?{applied:358,retired:0,attributeHashes:{positions:'342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83',indices:'483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c',normals:'7d31e73c97939ad978982aeb5191d3ae8b99582eb32300aff9d569cae7e24b1b',coastDistances:'7f99de4403127ddcc48affe5206003c93049e0d19d276981db794ea1fa8cf49b'}}:null})));
test('corrected profile requires eight paired frozen reference views',()=>{assert.equal(validateCorrectedSet(correctedFixture()),true);assert.throws(()=>validateCorrectedSet(correctedFixture().slice(1)),/FRAME_CAP/);});
test('corrected profile fails closed on custody, support and pairing drift',()=>{for(const change of [v=>v[0].grassHidden=true,v=>v[0].sourceHead='0'.repeat(40),v=>v[0].mode='after-groundcover-unlit',v=>v[1].correctedReceipt.applied=0,v=>v[1].lastFrame.cameraPosition.x++,v=>v[1].instrumentation[0].observedSha256='a'.repeat(64),v=>v[1].pose={...v[1].pose,pitch:2}]){const views=correctedFixture();change(views);assert.throws(()=>validateCorrectedSet(views));}});

test('corrected profile checks consumed attribute custody and baseline/canvas isolation',()=>{for(const mutate of [v=>v[1].correctedReceipt.attributeHashes.normals='0'.repeat(64),v=>delete v[1].correctedReceipt.attributeHashes,v=>v[0].correctedReceipt={applied:1},v=>v[1].canvas.height++]){const views=correctedFixture();mutate(views);assert.throws(()=>validateCorrectedSet(views));}});


test('production profile pins exact integrated scene with four candidate-only frozen views',async()=>{
 const {execFileSync}=await import('node:child_process');const url=new URL('./h-earth-ground-material-comparison.v1.mjs',import.meta.url).href;
 const script=`import assert from 'node:assert/strict';import {HEADS,PRODUCTION_HEAD,FOOTPRINT_POSES,parseArgs} from ${JSON.stringify(url)};assert.deepEqual(HEADS,{candidate:PRODUCTION_HEAD});assert.equal(PRODUCTION_HEAD,'4639908eab7bc5b8872a85231b3330678988c259');assert.equal(FOOTPRINT_POSES.length,4);parseArgs(['--baseline-dir','scene','--candidate-dir','scene','--output','out']);assert.throws(()=>parseArgs(['--baseline-dir','a','--candidate-dir','b','--output','out']),/ONE_FROZEN_SCENE/);`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,H_EARTH_COMPARISON_PROFILE:'CORRECTED_MATERIAL_PRODUCTION_V1'},encoding:'utf8'});
});
test('production instrumentation preserves shader and atlases, only exposes camera and mode receipt',()=>{
 const source=fs.readFileSync(process.env.PRODUCTION_RENDERER_SOURCE??new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const route=fs.readFileSync(process.env.PRODUCTION_ROUTE_SOURCE??new URL('../showroom/globe/h-earth/vegetation-prototype/route.js',import.meta.url),'utf8');
 const observed=diagnostic.instrumentProductionRenderer(source),marker="\n    if(globalThis.__groundcoverFactorMode!==0)throw Error('PRODUCTION_REFERENCE_MODE_ONLY');globalThis.__groundcoverFactorModeApplied=0;";
 assert.equal(observed.split(marker).length,2);assert.equal(observed.replace(marker,''),source);
 assert.equal(diagnostic.instrumentProductionRoute(route),instrumentRoute(route));
 assert.throws(()=>diagnostic.instrumentProductionRenderer(source+' '),/PRODUCTION_RENDERER_HASH/);assert.throws(()=>diagnostic.instrumentProductionRoute(route+' '),/PRODUCTION_ROUTE_HASH/);
 assert.ok(source.includes('new URL("./corrected-material-v1/",import.meta.url).href'));
});
test('production atlas network validator rejects missing duplicate HTTP and digest failures',()=>{
 const responses=Object.entries(diagnostic.PRODUCTION_ATLASES).map(([path,sha256])=>({path,sha256,status:200,bytes:100}));
 assert.equal(diagnostic.validateProductionAtlasResponses(responses),true);
 for(const change of [v=>v.pop(),v=>v.push({...v[0]}),v=>v[1].path=v[0].path,v=>v[0].status=404,v=>v[0].sha256='a'.repeat(64),v=>v[0].bytes=0]){const v=structuredClone(responses);change(v);assert.throws(()=>diagnostic.validateProductionAtlasResponses(v));}
});
const productionFixture=()=>FOOTPRINT_POSES.map(pose=>{
 const camera={x:pose.x,y:pose.y??2,z:pose.z},state={position:{...camera},yawDegrees:pose.yaw,pitchDegrees:pose.pitch,verticalFovDegrees:56,sequence:10001,...(pose.diagnosticObserver?{diagnosticObserver:true,accepted:false,terrainSupported:false,geologicalPhysicalSupport:false}:{})};
 const vegetation={schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',installedRootCount:1,rootOwnerCount:1,gpuAllocationVerified:true,gpuUploadCount:1,gpuRequestedBytes:16,gpuObservedBufferBytes:16,gpuAllocatedBytes:16,gpuUploadedBytes:16,allocationGlError:0,uploadGlError:0,disposed:false};
 const resources={singleOwnerVegetation:vegetation,treeCollection:{queue:{loading:false,failures:{}},entries:[]},jacaranda:{focusId:'tree',state:'READY',ready:true,targetAnchor:{x:0,z:0}}};
 const sig=assetReadiness(resources,camera).signature+'|'+diagnostic.footprintVegetationReadiness(resources).signature;
 return {label:'candidate',pose,state,lastFrame:{cameraPosition:{...camera},navigationSequence:10001,frameSequence:1},expectedCameraPosition:{...camera},canvas:{width:529,height:980,cssWidth:540,cssHeight:1000},resources,assetSignature:sig,mode:'reference-lit',modeId:0,diagnosticApplied:0,grassHidden:false,sourceHead:diagnostic.PRODUCTION_HEAD,rendererHash:diagnostic.PRODUCTION_RENDERER_SHA256,cpuSubmitMilliseconds:[1],softwareGpuFinishMilliseconds:[1],instrumentation:[{path:'/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',sourceSha256:diagnostic.PRODUCTION_RENDERER_SHA256,observedSha256:'b'.repeat(64)},{path:'/showroom/globe/h-earth/vegetation-prototype/route.js',sourceSha256:diagnostic.PRODUCTION_ROUTE_SHA256,observedSha256:'c'.repeat(64)}],correctedReceipt:correctedFixture()[1].correctedReceipt};
});
test('production view validator enforces exact support custody camera visibility and residency',()=>{
 assert.equal(diagnostic.validateProductionSet(productionFixture()),true);
 assert.throws(()=>diagnostic.validateProductionSet(productionFixture().slice(1)),/FRAME_CAP/);
 for(const mutate of [v=>v.label='baseline',v=>v.modeId=1,v=>v.sourceHead='a'.repeat(40),v=>v.rendererHash='a'.repeat(64),v=>v.grassHidden=true,v=>v.correctedReceipt.applied=357,v=>v.correctedReceipt.retired=1,v=>v.correctedReceipt.attributeHashes.normals='a'.repeat(64),v=>v.lastFrame.cameraPosition.y++,v=>v.instrumentation[1].sourceSha256='a'.repeat(64),v=>v.resources.singleOwnerVegetation.gpuObservedBufferBytes=0,v=>v.cpuSubmitMilliseconds.push(2)]){const views=productionFixture();mutate(views[0]);assert.throws(()=>diagnostic.validateProductionSet(views));}
});
