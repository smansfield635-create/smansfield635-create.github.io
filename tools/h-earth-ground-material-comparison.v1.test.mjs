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

const residentShader=fs.readFileSync(new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
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
 const workflow=fs.readFileSync(new URL('../.github/workflows/h-earth-neutral-exact-head-runner.yml',import.meta.url),'utf8').split('  groundcover-contribution-ledger-comparison:')[1];
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
