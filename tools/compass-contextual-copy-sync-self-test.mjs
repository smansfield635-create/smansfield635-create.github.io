#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const tool=path.resolve(process.argv[2]??new URL('./compass-contextual-copy-sync.mjs',import.meta.url).pathname);
const productionRegistry=path.resolve(process.argv[3]??new URL('./compass-contextual-copy-registry.v1.json',import.meta.url).pathname);
function run(cwd,args,expect=0){const r=spawnSync(process.execPath,[tool,...args],{cwd,encoding:'utf8'});if(r.status!==expect)throw new Error(`status ${r.status} != ${expect}\nstdout=${r.stdout}\nstderr=${r.stderr}`);return r;}
function git(cwd,args){const r=spawnSync('git',['-C',cwd,...args],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr||r.stdout);return r.stdout.trim();}
function blobSha(text){const b=Buffer.from(text,'utf8');return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex');}
function initRepo(files){const root=fs.mkdtempSync(path.join(os.tmpdir(),'compass-contextual-copy-'));for(const [rel,content] of Object.entries(files)){const p=path.join(root,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,content);}git(root,['init','-q']);git(root,['config','user.email','test@example.invalid']);git(root,['config','user.name','Contextual Copy Self Test']);git(root,['add','.']);git(root,['commit','-qm','fixture']);return root;}
function tempJson(value){const p=path.join(os.tmpdir(),`contextual-registry-${crypto.randomUUID()}.json`);fs.writeFileSync(p,`${JSON.stringify(value,null,2)}\n`);return p;}
function textFile(text){const p=path.join(os.tmpdir(),`contextual-copy-${crypto.randomUUID()}.txt`);fs.writeFileSync(p,`${text}\n`);return p;}

const prod=JSON.parse(fs.readFileSync(productionRegistry,'utf8'));
assert.equal(prod.schema,'COMPASS_CONTEXTUAL_COPY_REGISTRY_v1');
assert.deepEqual(Object.keys(prod.sections),['chapter-studio']);
const studio=prod.sections['chapter-studio'];
assert.equal(studio.status,'ACTIVE_PRODUCTION');
assert.equal(studio.staticOwner.path,'index.html');
assert.equal(studio.runtimeOwner.path,'assets/compass/compass.readiness-context-v1.js');
assert.equal(studio.assetIdentity.manifestReference.path,'.github/ai-router/publication-surfaces/compass-gen1862.json');
assert.deepEqual([...studio.expectedChangedPaths].sort(),[
  '.github/ai-router/publication-surfaces/compass-gen1862.json',
  'assets/compass/compass.readiness-context-v1.js',
  'index.html'
]);

const staticRegistry=tempJson({schema:'COMPASS_CONTEXTUAL_COPY_REGISTRY_v1',status:'ACTIVE_FAIL_CLOSED',scope:'TEST',sections:{'fixture-static':{status:'TEST_FIXTURE',ownershipClass:'STATIC_ONLY',staticOwner:{path:'static.html',sectionAnchor:'id="fixture-static"',startMarker:'<div class="copy"><p>',endMarker:'</p><p class="closing">'},runtimeOwner:null,assetIdentity:null,expectedChangedPaths:['static.html']}}});
const staticRoot=initRepo({'static.html':'<section id="fixture-static"><div class="copy"><p>Old static.</p><p class="closing">Done.</p></div></section>\n'});
const staticText=textFile('New static paragraph with & meaning.');
const unknown=run(staticRoot,['--section','not-registered','--verify','--registry',staticRegistry,'--root',staticRoot],1);assert.match(unknown.stderr,/UNREGISTERED_SECTION/);
const staticApply=JSON.parse(run(staticRoot,['--section','fixture-static','--apply','--text-file',staticText,'--registry',staticRegistry,'--root',staticRoot]).stdout);
assert.equal(staticApply.result,'PASS_CLOSED');assert.deepEqual(staticApply.changedPaths,['static.html']);assert.match(fs.readFileSync(path.join(staticRoot,'static.html'),'utf8'),/New static paragraph with &amp; meaning/);
run(staticRoot,['--section','fixture-static','--verify','--text-file',staticText,'--registry',staticRegistry,'--root',staticRoot]);

const dirtyRoot=initRepo({'static.html':'<section id="fixture-static"><div class="copy"><p>Old static.</p><p class="closing">Done.</p></div></section>\n'});fs.appendFileSync(path.join(dirtyRoot,'static.html'),'dirty\n');
const dirty=run(dirtyRoot,['--section','fixture-static','--apply','--text-file',staticText,'--registry',staticRegistry,'--root',dirtyRoot],1);assert.match(dirty.stderr,/DIRTY_WORKTREE/);

const old='Old runtime paragraph.';
const runtime=`(()=>{function install(){if(block){block.innerHTML=\`<div class=\\"copy\\"><p>${old}</p><p class=\\"closing\\">Done.</p></div>\`;}}})();\n`;
const token=blobSha(runtime).slice(0,16),assetPath='/assets/runtime.js',identity=`${assetPath}?v=context-v1&cb=${token}`;
const runtimeRegistry=tempJson({schema:'COMPASS_CONTEXTUAL_COPY_REGISTRY_v1',status:'ACTIVE_FAIL_CLOSED',scope:'TEST',sections:{'fixture-runtime':{status:'TEST_FIXTURE',ownershipClass:'STATIC_PLUS_RUNTIME_WITH_DERIVED_ASSET_IDENTITY',staticOwner:{path:'index.html',sectionAnchor:'id="fixture-runtime"',startMarker:'<div class="copy"><p>',endMarker:'</p><p class="closing">'},runtimeOwner:{path:'assets/runtime.js',sectionAnchor:'if(block){block.innerHTML=`',startMarker:'<div class=\\"copy\\"><p>',endMarker:'</p><p class=\\"closing\\">'},assetIdentity:{assetPath,contentOwner:'runtimeOwner',tokenStrategy:{type:'GIT_BLOB_SHA1_PREFIX',length:16},indexReference:{path:'index.html'},manifestReference:{path:'manifest.json',surfaceId:'fixture'}},expectedChangedPaths:['assets/runtime.js','index.html','manifest.json']}}});
const runtimeRoot=initRepo({
  'index.html':`<section id="fixture-runtime"><div class="copy"><p>${old}</p><p class="closing">Done.</p></div></section>\n<script src="${identity}"></script>\n`,
  'assets/runtime.js':runtime,
  'manifest.json':`${JSON.stringify({schema:'TEST',checks:[{path:'/',includes:[identity],excludes:[]}]},null,2)}\n`
});
const runtimeTextFile=textFile('New runtime paragraph — one atomic update.');
const base=git(runtimeRoot,['rev-parse','HEAD']);
const applied=JSON.parse(run(runtimeRoot,['--section','fixture-runtime','--apply','--text-file',runtimeTextFile,'--registry',runtimeRegistry,'--root',runtimeRoot]).stdout);
assert.equal(applied.result,'PASS_CLOSED');assert.deepEqual(applied.changedPaths,['assets/runtime.js','index.html','manifest.json']);assert.equal(applied.proofs.STATIC_RUNTIME_COPY_MATCH,true);assert.equal(applied.proofs.CONTENT_DERIVED_CACHE_IDENTITY,true);
assert.match(fs.readFileSync(path.join(runtimeRoot,'index.html'),'utf8'),/New runtime paragraph/);assert.match(fs.readFileSync(path.join(runtimeRoot,'assets/runtime.js'),'utf8'),/New runtime paragraph/);
git(runtimeRoot,['add','.']);git(runtimeRoot,['commit','-qm','candidate']);const candidate=git(runtimeRoot,['rev-parse','HEAD']);
const verified=JSON.parse(run(runtimeRoot,['--section','fixture-runtime','--verify','--text-file',runtimeTextFile,'--base',base,'--head',candidate,'--registry',runtimeRegistry,'--root',runtimeRoot]).stdout);assert.equal(verified.proofs.EXPECTED_DIFF_ONLY,true);
const manifestPath=path.join(runtimeRoot,'manifest.json');fs.writeFileSync(manifestPath,fs.readFileSync(manifestPath,'utf8').replace(applied.cacheToken,'0000000000000000'));
const tamper=run(runtimeRoot,['--section','fixture-runtime','--verify','--registry',runtimeRegistry,'--root',runtimeRoot],1);assert.match(tamper.stderr,/INDEX_MANIFEST_IDENTITY_MISMATCH/);
git(runtimeRoot,['reset','--hard','-q',candidate]);fs.writeFileSync(path.join(runtimeRoot,'unrelated.txt'),'unexpected\n');git(runtimeRoot,['add','unrelated.txt']);git(runtimeRoot,['commit','-qm','unrelated']);const badHead=git(runtimeRoot,['rev-parse','HEAD']);
const unrelated=run(runtimeRoot,['--section','fixture-runtime','--verify','--base',base,'--head',badHead,'--registry',runtimeRegistry,'--root',runtimeRoot],1);assert.match(unrelated.stderr,/CHANGED_PATH_SET_INVALID/);

console.log(JSON.stringify({schema:'COMPASS_CONTEXTUAL_COPY_SYNC_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',proofs:{PRODUCTION_STUDIO_REGISTRATION:true,UNREGISTERED_SECTION_FAIL_CLOSED:true,STATIC_ONLY_FIXTURE_PASS:true,RUNTIME_OWNED_FIXTURE_PASS:true,CONTENT_DERIVED_CACHE_IDENTITY_PASS:true,EXPECTED_DIFF_FAIL_CLOSED:true,DIRTY_WORKTREE_FAIL_CLOSED:true}},null,2));
