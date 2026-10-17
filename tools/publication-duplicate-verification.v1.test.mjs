import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

// Execute the workflow's real scripts. Fixtures replace only network and the
// existing browser verifier; they cannot confer a successful workflow result.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/pages-exact-head-deploy-v3.yml'),'utf8');
const steps=workflow.split(/^      - /m).slice(1).map(block=>'      - '+block);
const step=name=>{const found=steps.find(s=>s.startsWith('      - name: '+name+'\n'));assert.ok(found,`workflow step missing: ${name}`);return found;};
const script=name=>{const block=step(name);const match=block.match(/^        run: \|\n([\s\S]*)/m);assert.ok(match,`${name} must contain executable run script`);return match[1].split('\n').map(line=>line.startsWith('          ')?line.slice(10):line).join('\n').trimEnd()+'\n';};
const sha='a'.repeat(40);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const temporary=()=>fs.mkdtempSync(path.join(os.tmpdir(),'publication-duplicate-regression-'));
function executeShell(source,env={},cwd=temporary()){
  const output=path.join(cwd,'github-output');
  fs.writeFileSync(output,'');
  const result=spawnSync('bash',['-c',source],{cwd,encoding:'utf8',env:{...process.env,GITHUB_OUTPUT:output,RUNNER_TEMP:cwd,...env}});
  return {...result,output:fs.readFileSync(output,'utf8'),cwd};
}

test('exact dispatched-head contract runs on both release paths',()=>{
  const source=script('Require exact dispatched head');
  for(const [requested,dispatched,passes] of [[sha,sha,true],[sha,'b'.repeat(40),false],['','',false]]){
    const result=executeShell(source,{REQUESTED_SHA:requested,DISPATCHED_HEAD_SHA:dispatched});
    try{assert.equal(result.status===0,passes,result.stderr);if(passes)assert.match(result.output,new RegExp(`target_sha=${sha}`));else assert.doesNotMatch(result.output,/target_sha=/);}finally{fs.rmSync(result.cwd,{recursive:true,force:true});}
  }
  assert.doesNotMatch(step('Require exact dispatched head'),/^        if:/m);
});

test('all Pages mutation actions are excluded from the duplicate verification route',()=>{
  const mutationSteps=steps.filter(s=>/uses: actions\/(configure-pages|upload-pages-artifact|deploy-pages)@/.test(s));
  assert.ok(mutationSteps.length>=3);
  for(const block of mutationSteps)assert.match(block,/if:.*steps\.dedupe\.outputs\.duplicate != 'true'/,block.split('\n').slice(0,4).join('\n'));
});

function runDedupe(runs){
  const cwd=temporary();
  const bin=path.join(cwd,'bin');fs.mkdirSync(bin);
  const fixture=path.join(cwd,'runs.json');fs.writeFileSync(fixture,JSON.stringify({workflow_runs:runs}));
  fs.writeFileSync(path.join(bin,'curl'),'#!/bin/sh\ncat "$RUNS_FIXTURE"\n',{mode:0o755});
  return executeShell(script('Suppress duplicate exact-head production mutation'),{
    GH_TOKEN:'fixture-token',REQUESTED_SHA:sha,CURRENT_RUN_ID:'100',GITHUB_REPOSITORY:'fixture/repository',RUNS_FIXTURE:fixture,PATH:bin+path.delimiter+process.env.PATH,
  },cwd);
}
const priorRun=overrides=>({id:90,name:'Exact Head Pages Deploy v3',head_sha:sha,status:'completed',conclusion:'success',...overrides});

test('dedupe accepts a successful earlier exact-head publication',()=>{
  const result=runDedupe([priorRun({id:80}),priorRun({id:90}),priorRun({id:101})]);
  try{assert.equal(result.status,0,result.stderr);assert.match(result.output,/duplicate=true/);assert.match(result.output,/prior_run_id=80/);}finally{fs.rmSync(result.cwd,{recursive:true,force:true});}
});

test('dedupe never reuses another workflow, head, or a later run',()=>{
  for(const overrides of [{name:'Other workflow'},{head_sha:'b'.repeat(40)},{id:101}]){
    const result=runDedupe([priorRun(overrides)]);
    try{assert.equal(result.status,0,result.stderr);assert.match(result.output,/duplicate=false/);assert.doesNotMatch(result.output,/prior_run_id=/);}finally{fs.rmSync(result.cwd,{recursive:true,force:true});}
  }
});

test('active predecessors suppress mutation but fail the completed-publication gate',()=>{
  const gate=script('Stop duplicate before expensive work').replace(/\$\{\{[^}]+\}\}/g,'90');
  for(const status of ['queued','pending','in_progress']){
    const result=runDedupe([priorRun({status,conclusion:null})]);
    try{
      assert.equal(result.status,0,result.stderr);assert.match(result.output,/duplicate=true/);
      const stopped=executeShell(gate,{},result.cwd);assert.notEqual(stopped.status,0);assert.match(stopped.stderr,/PRIOR_PUBLICATION_NOT_COMPLETED/);
    }finally{fs.rmSync(result.cwd,{recursive:true,force:true});}
  }
});

test('failed predecessors cannot be reused as completed publications',()=>{
  for(const conclusion of ['failure','cancelled','timed_out','neutral']){
    const result=runDedupe([priorRun({conclusion})]);
    try{assert.equal(result.status,0,result.stderr);assert.match(result.output,/duplicate=false/);}finally{fs.rmSync(result.cwd,{recursive:true,force:true});}
  }
});

const inline=()=>{
  const extracted=script('Verify already-published requested surface').match(/node --input-type=module <<'NODE'\n([\s\S]*?)\nNODE(?:\n|$)/);
  assert.ok(extracted,'duplicate verifier must execute the actual inline Node program');return extracted[1];
};
function verifierFixture(change=()=>{}){
  const cwd=temporary();
  const write=(relative,bytes)=>{const absolute=path.join(cwd,relative);fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,bytes);return absolute;};
  const json=(relative,value)=>write(relative,JSON.stringify(value));
  const manifest={schema:'PUBLICATION_SURFACE_VERIFICATION_v1',surfaceId:'h-earth',checks:[{path:'/showroom/globe/h-earth/index.html',includes:['world']},{path:'/showroom/globe/h-earth/renderer.js',includes:['renderer']}],runtime:{enabled:true,path:'/showroom/globe/h-earth/?arrival=approved-four-trees'}};
  for(const id of ['analytics','audralia'])json(`.github/ai-router/publication-surfaces/${id}.json`,{...manifest,surfaceId:id});
  const manifestPath=path.join(cwd,'.github/ai-router/publication-surfaces/h-earth.json');
  const publishedManifest='.github/ai-router/publication-surfaces/analytics.json';
  const marker={schema:'DGB_PUBLIC_RELEASE_MARKER_v3',commit:sha,surface:'analytics',verificationManifest:publishedManifest,verificationManifestSha256:digest(fs.readFileSync(path.join(cwd,publishedManifest)))};
  const html='<html>world</html>',renderer='// renderer\n';
  write('stage/showroom/globe/h-earth/index.html',html);write('stage/showroom/globe/h-earth/renderer.js',renderer);
  const protectedHtml=`<main data-audralia-build-sha="${sha}">BUILD ${sha.slice(0,8).toUpperCase()}</main>`;
  const fixture={manifest,protectedHtml,extraStage:{},marker,prior:priorRun({id:90}),deployment:{schema:'PUBLICATION_SURFACE_DISPATCH_RECEIPT_v1',targetSha:sha,runId:'90',surfaceId:'analytics'},responses:{'/showroom/globe/audralia/':protectedHtml,'/showroom/globe/h-earth/index.html':html,'/showroom/globe/h-earth/renderer.js':renderer,'/showroom/globe/h-earth/?arrival=approved-four-trees':html},failMode:null,invalidMode:null,status:200,origin:null,changeMarker:false};
  change(fixture);
  json('.github/ai-router/publication-surfaces/h-earth.json',fixture.manifest);
  write('stage/showroom/globe/audralia/index.html',fixture.protectedHtml);
  for(const [file,body] of Object.entries(fixture.extraStage))write('stage/'+file,body);
  const priorPath=json('prior.json',fixture.prior),deployedPath=json('deployed.json',fixture.deployment);
  json('network.json',fixture);
  const preload=write('fetch-preload.mjs',`import fs from 'node:fs';
const fixture=JSON.parse(fs.readFileSync(process.env.NETWORK_FIXTURE,'utf8'));let markerReads=0;
globalThis.fetch=async (url,options)=>{
 if(options?.method && options.method!=='GET')throw new Error('MUTATING_FETCH_FORBIDDEN');
 const parsed=new URL(url);if(parsed.origin!=='https://diamondgatebridge.com')throw new Error('UNEXPECTED_FETCH_ORIGIN');
 fs.appendFileSync(process.env.FETCH_LOG,JSON.stringify({url:String(url),headers:options?.headers})+'\\n');
 let body;if(parsed.pathname==='/.well-known/dgb-release.json'){const marker={...fixture.marker};if(fixture.changeMarker&&markerReads++)marker.changed=true;body=JSON.stringify(marker);}else{body=fixture.responses[parsed.pathname+parsed.search];if(body===undefined)throw new Error('UNEXPECTED_FIXTURE_REQUEST:'+url);}
 const response=new Response(body,{status:fixture.status});Object.defineProperty(response,'url',{value:fixture.origin||String(url)});return response;
};`);
  write('tools/publication-live-verify.mjs',`import fs from 'node:fs';
const [mode,url,file]=process.argv.slice(2),spec=JSON.parse(fs.readFileSync(file,'utf8'));
fs.appendFileSync(process.env.CLI_LOG,JSON.stringify({mode,url,surfaceId:spec.surfaceId,tokenPresent:Boolean(process.env.GH_TOKEN||process.env.GITHUB_TOKEN)})+'\\n');
if(process.env.FAIL_MODE===mode&&(!process.env.FAIL_SURFACE||process.env.FAIL_SURFACE===spec.surfaceId)){console.error('fixture verifier failed');process.exit(7);}
console.log(JSON.stringify({schema:'PUBLICATION_SURFACE_'+mode.toUpperCase()+'_RECEIPT_v1',surfaceId:spec.surfaceId,result:process.env.INVALID_MODE===mode?'FAIL':'PASS'}));`);
  write('inline-verifier.mjs',inline());
  const output=write('github-output',''),receipt=path.join(cwd,'receipt.json'),fetchLog=write('fetch.log',''),cliLog=write('cli.log','');
  const inputs=[manifestPath,path.join(cwd,publishedManifest),path.join(cwd,'.github/ai-router/publication-surfaces/audralia.json'),priorPath,deployedPath,path.join(cwd,'stage/showroom/globe/h-earth/index.html'),path.join(cwd,'stage/showroom/globe/h-earth/renderer.js'),path.join(cwd,'stage/showroom/globe/audralia/index.html'),...Object.keys(fixture.extraStage).map(file=>path.join(cwd,'stage',file))];
  const before=inputs.map(file=>digest(fs.readFileSync(file)));
  const result=spawnSync(process.execPath,['--import',preload,'inline-verifier.mjs'],{cwd,encoding:'utf8',env:{...process.env,TARGET_SHA:sha,SURFACE_ID:'h-earth',STAGE:path.join(cwd,'stage'),MANIFEST:manifestPath,PRIOR_RUN:priorPath,PRIOR_DEPLOYMENT_RECEIPT:deployedPath,RECEIPT:receipt,GITHUB_OUTPUT:output,NETWORK_FIXTURE:path.join(cwd,'network.json'),FETCH_LOG:fetchLog,CLI_LOG:cliLog,FAIL_MODE:fixture.failMode||'',FAIL_SURFACE:fixture.failSurface||'',INVALID_MODE:fixture.invalidMode||'',GH_TOKEN:'fixture-secret',GITHUB_TOKEN:'fixture-secret'}});
  const value=fs.existsSync(receipt)?JSON.parse(fs.readFileSync(receipt,'utf8')):null;
  const lines=file=>fs.readFileSync(file,'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));
  assert.deepEqual(inputs.map(file=>digest(fs.readFileSync(file))),before,'verification must preserve product and source proof bytes');
  return {...result,value,output:fs.readFileSync(output,'utf8'),fetches:lines(fetchLog),calls:lines(cliLog),cleanup:()=>fs.rmSync(cwd,{recursive:true,force:true})};
}

test('already-published analytics release verifies requested H-Earth bytes and runtime without redeployment',()=>{
  const run=verifierFixture();
  try{
    assert.equal(run.status,0,run.stderr+run.stdout);assert.equal(run.value.result,'PASS_CLOSED');assert.equal(run.value.publishedSurfaceId,'analytics');assert.equal(run.value.surfaceId,'h-earth');assert.equal(run.value.deploymentPerformed,false);assert.equal(run.value.productMutationPerformed,false);assert.equal(run.value.sourceBytes.length,4);
    assert.deepEqual(run.calls.map(({mode,surfaceId})=>({mode,surfaceId})),[{mode:'static',surfaceId:'h-earth'},{mode:'static',surfaceId:'audralia'},{mode:'runtime',surfaceId:'h-earth'}]);
    assert.ok(run.calls.every(call=>!call.tokenPresent));assert.match(run.output,/page_url=https:\/\/diamondgatebridge.com\//);assert.equal(run.fetches.length,6);
    assert.ok(run.fetches.every(call=>call.headers['Cache-Control']==='no-cache'));
  }finally{run.cleanup();}
});

const failures=[
 ['active predecessor',f=>{f.prior.status='in_progress';},'PRIOR_DEPLOYMENT_NOT_PROVEN'],
 ['failed predecessor',f=>{f.prior.conclusion='failure';},'PRIOR_DEPLOYMENT_NOT_PROVEN'],
 ['wrong prior head',f=>{f.prior.head_sha='b'.repeat(40);},'PRIOR_DEPLOYMENT_NOT_PROVEN'],
 ['unproven prior deployment',f=>{f.deployment={};},'PRIOR_DEPLOYMENT_RECEIPT_MISMATCH'],
 ['wrong deployment run',f=>{f.deployment.runId='89';},'PRIOR_DEPLOYMENT_RECEIPT_MISMATCH'],
 ['wrong deployment SHA',f=>{f.deployment.targetSha='b'.repeat(40);},'PRIOR_DEPLOYMENT_RECEIPT_MISMATCH'],
 ['wrong live SHA',f=>{f.marker.commit='b'.repeat(40);},'LIVE_MARKER_HEAD_MISMATCH'],
 ['wrong published surface',f=>{f.marker.surface='h-earth';},'LIVE_MARKER_SURFACE_MISMATCH'],
 ['wrong manifest digest',f=>{f.marker.verificationManifestSha256='0'.repeat(64);},'LIVE_MARKER_MANIFEST_MISMATCH'],
 ['wrong manifest path',f=>{f.marker.verificationManifest='../analytics.json';},'LIVE_MARKER_MANIFEST_MISMATCH'],
 ['wrong canonical HTML bytes',f=>{f.responses['/showroom/globe/h-earth/index.html']='stale';},'PUBLIC_SOURCE_BYTE_MISMATCH'],
 ['wrong renderer bytes',f=>{f.responses['/showroom/globe/h-earth/renderer.js']='stale';},'PUBLIC_SOURCE_BYTE_MISMATCH'],
 ['wrong arrival route bytes',f=>{f.responses['/showroom/globe/h-earth/?arrival=approved-four-trees']='stale';},'PUBLIC_SOURCE_BYTE_MISMATCH'],
 ['protected Audralia bytes',f=>{f.responses['/showroom/globe/audralia/']='stale';},'PUBLIC_SOURCE_BYTE_MISMATCH'],
 ['protected Audralia fingerprint',f=>{f.protectedHtml='<main>BUILD OLD</main>';f.responses['/showroom/globe/audralia/']=f.protectedHtml;},'PROTECTED_PUBLIC_BUILD_FINGERPRINT_MISMATCH'],
 ['HTTP error',f=>{f.status=403;},'PUBLIC_FETCH_FAILED'],
 ['foreign redirect',f=>{f.origin='https://other.example/';},'PUBLIC_ORIGIN_MISMATCH'],
 ['static verifier failure',f=>{f.failMode='static';},'PUBLIC_STATIC_VERIFICATION_FAILED'],
 ['protected static verifier failure',f=>{f.failMode='static';f.failSurface='audralia';},'PUBLIC_STATIC_VERIFICATION_FAILED:audralia'],
 ['runtime verifier failure',f=>{f.failMode='runtime';},'PUBLIC_RUNTIME_VERIFICATION_FAILED'],
 ['static failure receipt',f=>{f.invalidMode='static';},'PUBLIC_STATIC_RECEIPT_INVALID'],
 ['runtime failure receipt',f=>{f.invalidMode='runtime';},'PUBLIC_RUNTIME_RECEIPT_INVALID'],
 ['release changes during verification',f=>{f.changeMarker=true;},'LIVE_MARKER_CHANGED_DURING_VERIFICATION'],
];
for(const [name,change,code] of failures)test(name+' produces FAIL and never a success output',()=>{
  const run=verifierFixture(change);
  try{assert.notEqual(run.status,0,run.stdout);assert.equal(run.value?.result,'FAIL');assert.equal(run.value?.deploymentPerformed,false);assert.equal(run.value?.productMutationPerformed,false);assert.ok(run.value?.error.includes(code),run.value?.error);assert.doesNotMatch(run.stdout,/LIVE_EXACT_SURFACE_VERIFIED=/);assert.doesNotMatch(run.output,/page_url=/);}finally{run.cleanup();}
});


test('directory checks resolve to their own staged index document',()=>{
  const run=verifierFixture(f=>{f.manifest.checks[0].path='/showroom/globe/h-earth/';f.responses['/showroom/globe/h-earth/']='<html>world</html>';});
  try{assert.equal(run.status,0,run.stderr+run.stdout);assert.equal(run.value.result,'PASS_CLOSED');assert.equal(run.value.sourceBytes[0].path,'/showroom/globe/h-earth/');}finally{run.cleanup();}
});

test('runtime route may be a different document from the first static check',()=>{
  const run=verifierFixture(f=>{f.manifest.runtime.path='/showroom/globe/h-earth/arrival/?view=trees';f.extraStage['showroom/globe/h-earth/arrival/index.html']='<html>distinct arrival document</html>';f.responses[f.manifest.runtime.path]=f.extraStage['showroom/globe/h-earth/arrival/index.html'];});
  try{assert.equal(run.status,0,run.stderr+run.stdout);assert.equal(run.value.result,'PASS_CLOSED');assert.notEqual(run.value.sourceBytes[0].expectedSha256,run.value.sourceBytes[2].expectedSha256);}finally{run.cleanup();}
});
