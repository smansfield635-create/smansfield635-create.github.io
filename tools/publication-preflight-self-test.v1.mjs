#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {buildPayload,sha256,validateSha,validateSurfaceId,waitForLocalHttpServer} from './publication-preflight.v1.mjs';

const checks=[];
const check=(name,ok,detail=null)=>{checks.push({name,ok:Boolean(ok),detail});if(!ok)throw new Error(`SELF_TEST_FAILED:${name}${detail?':'+detail:''}`);};
const listen=server=>new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const close=server=>new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));

check('surface-id-positive',validateSurfaceId('audralia'));
check('surface-id-negative-uppercase',!validateSurfaceId('Audralia'));
check('surface-id-negative-slash',!validateSurfaceId('../audralia'));
check('sha-positive',validateSha('a'.repeat(40)));
check('sha-negative',!validateSha('abc'));
check('sha256-deterministic',sha256(Buffer.from('diamond-gate'))===sha256(Buffer.from('diamond-gate')));

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'publication-preflight-self-test-'));
try{
  const repo=path.join(tmp,'repo');const stage=path.join(tmp,'stage');const audraliaStage=path.join(tmp,'audralia-stage');
  fs.mkdirSync(path.join(repo,'.github/ai-router/publication-surfaces'),{recursive:true});
  fs.mkdirSync(path.join(repo,'demo'),{recursive:true});
  fs.mkdirSync(path.join(repo,'preview/should-not-ship'),{recursive:true});
  fs.mkdirSync(path.join(repo,'.github/private'),{recursive:true});
  fs.mkdirSync(path.join(repo,'node_modules/puppeteer-core'),{recursive:true});
  fs.mkdirSync(path.join(repo,'h-earth-live-6d18e158/legacy'),{recursive:true});
  fs.mkdirSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/shared'),{recursive:true});
  fs.mkdirSync(path.join(repo,'inspection/compass/live'),{recursive:true});
  fs.mkdirSync(path.join(repo,'showroom/globe/audralia'),{recursive:true});
  fs.writeFileSync(path.join(repo,'demo/index.html'),'<title>Demo</title>\nTOKEN_OK\n');
  fs.writeFileSync(path.join(repo,'preview/should-not-ship/secret.txt'),'nope');
  fs.writeFileSync(path.join(repo,'.github/private/secret.txt'),'nope');
  fs.writeFileSync(path.join(repo,'node_modules/puppeteer-core/runtime-only.txt'),'must-not-ship');
  fs.writeFileSync(path.join(repo,'h-earth-live-6d18e158/legacy/clone.txt'),'must-not-ship');
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/clone.txt'),'must-not-ship');
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/entry.mjs'),"import './child.mjs';\nexport const READY=true;\n");
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/child.mjs'),"export const CHILD=()=>import('../runtime/shared/grandchild.mjs');\n");
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/shared/grandchild.mjs'),'export const VALUE=1;\n');
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/style.css'),".fixture{background-image:url('./texture.svg')}\n");
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/texture.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>\n');
  fs.writeFileSync(path.join(repo,'inspection/compass/live/index.html'),'must-ship');
  fs.writeFileSync(path.join(repo,'showroom/globe/audralia/index.html'),'<!doctype html><div class="audralia-loading-version">LIVE BUILD</div><link rel="stylesheet" href="/inspection/audralia-24057-exact/snapshot/runtime/style.css?cb=1"><script type="module" src="/inspection/audralia-24057-exact/snapshot/runtime/entry.mjs?cb=1"></script>\n');
  const manifest={schema:'PUBLICATION_SURFACE_VERIFICATION_v1',surfaceId:'demo',checks:[{path:'/demo/',includes:['TOKEN_OK'],excludes:[]}],runtime:{enabled:false}};
  const audraliaManifest={schema:'PUBLICATION_SURFACE_VERIFICATION_v1',surfaceId:'audralia',checks:[{path:'/showroom/globe/audralia/',includes:['LIVE BUILD'],excludes:[]}],runtime:{enabled:false}};
  fs.writeFileSync(path.join(repo,'.github/ai-router/publication-surfaces/demo.json'),JSON.stringify(manifest,null,2));
  fs.writeFileSync(path.join(repo,'.github/ai-router/publication-surfaces/audralia.json'),JSON.stringify(audraliaManifest,null,2));

  const demoSha='b'.repeat(40);
  const built=await buildPayload({repoRoot:repo,targetSha:demoSha,surfaceId:'demo',stage});
  const promotedDemoRoot=path.join(stage,'inspection/audralia-24057-exact/snapshot/runtime');
  const stagedAudralia=fs.readFileSync(path.join(stage,'showroom/globe/audralia/index.html'),'utf8');
  check('positive-fixture-payload-built',fs.existsSync(path.join(stage,'demo/index.html')));
  check('positive-fixture-release-marker',fs.existsSync(path.join(stage,'.well-known/dgb-release.json')));
  check('negative-fixture-preview-excluded',!fs.existsSync(path.join(stage,'preview')));
  check('negative-fixture-control-plane-excluded',!fs.existsSync(path.join(stage,'.github')));
  check('negative-fixture-node-modules-excluded',!fs.existsSync(path.join(stage,'node_modules')));
  check('negative-fixture-old-h-earth-clone-excluded',!fs.existsSync(path.join(stage,'h-earth-live-6d18e158')));
  check('positive-fixture-live-inspection-preserved',fs.existsSync(path.join(stage,'inspection/compass/live/index.html')));
  check('positive-fixture-digest',/^[0-9a-f]{64}$/.test(built.payloadDigest));
  check('positive-fixture-payload-bytes',Number.isInteger(built.payloadBytes)&&built.payloadBytes>0);
  check('positive-fixture-top-level-breakdown',Array.isArray(built.topLevelBytes)&&built.topLevelBytes.some(row=>row.path==='demo'&&row.bytes>0));
  check('protected-closure-preserved-on-non-protected-surface',built.authorizedExcludedRuntimeDependencies?.status==='PROMOTED'&&built.authorizedExcludedRuntimeDependencies?.protectedSurfaceId==='audralia'&&built.authorizedExcludedRuntimeDependencies?.requestedSurfaceId==='demo');
  check('protected-closure-entry-on-non-protected-surface',fs.existsSync(path.join(promotedDemoRoot,'entry.mjs')));
  check('protected-closure-unreferenced-snapshot-excluded-on-non-protected-surface',!fs.existsSync(path.join(stage,'inspection/audralia-24057-exact/snapshot/clone.txt')));
  check('protected-audralia-exact-head-stamped-on-non-protected-surface',stagedAudralia.includes(`data-audralia-build-sha="${demoSha}"`)&&stagedAudralia.includes('BUILD BBBBBBBB'));

  const audraliaSha='c'.repeat(40);
  const audraliaBuilt=await buildPayload({repoRoot:repo,targetSha:audraliaSha,surfaceId:'audralia',stage:audraliaStage});
  const promotedRoot=path.join(audraliaStage,'inspection/audralia-24057-exact/snapshot/runtime');
  const stagedAudraliaDirect=fs.readFileSync(path.join(audraliaStage,'showroom/globe/audralia/index.html'),'utf8');
  check('authorized-closure-entry-promoted',fs.existsSync(path.join(promotedRoot,'entry.mjs')));
  check('authorized-closure-static-import-promoted',fs.existsSync(path.join(promotedRoot,'child.mjs')));
  check('authorized-closure-dynamic-import-promoted',fs.existsSync(path.join(promotedRoot,'shared/grandchild.mjs')));
  check('authorized-closure-stylesheet-promoted',fs.existsSync(path.join(promotedRoot,'style.css')));
  check('authorized-closure-css-url-promoted',fs.existsSync(path.join(promotedRoot,'texture.svg')));
  check('authorized-closure-unreferenced-snapshot-excluded',!fs.existsSync(path.join(audraliaStage,'inspection/audralia-24057-exact/snapshot/clone.txt')));
  check('authorized-closure-receipt-pass',audraliaBuilt.authorizedExcludedRuntimeDependencies?.status==='PROMOTED'&&audraliaBuilt.authorizedExcludedRuntimeDependencies?.mode==='EXACT_REFERENCED_CLOSURE_ONLY');
  check('authorized-closure-receipt-count',audraliaBuilt.authorizedExcludedRuntimeDependencies?.fileCount===5);
  check('authorized-closure-receipt-digest',/^[0-9a-f]{64}$/.test(audraliaBuilt.authorizedExcludedRuntimeDependencies?.digest||''));
  check('authorized-direct-audralia-exact-head-stamped',stagedAudraliaDirect.includes(`data-audralia-build-sha="${audraliaSha}"`)&&stagedAudraliaDirect.includes('BUILD CCCCCCCC'));

  let missingDependencyRejected=false;
  fs.writeFileSync(path.join(repo,'showroom/globe/audralia/index.html'),'<!doctype html><div class="audralia-loading-version">LIVE BUILD</div><script type="module" src="/inspection/audralia-24057-exact/snapshot/runtime/missing.mjs"></script>\n');
  try{await buildPayload({repoRoot:repo,targetSha:'d'.repeat(40),surfaceId:'demo',stage:path.join(tmp,'missing-stage')});}
  catch(error){missingDependencyRejected=String(error).includes('AUTHORIZED_RUNTIME_DEPENDENCY_MISSING');}
  check('protected-closure-missing-dependency-rejected-on-non-protected-surface',missingDependencyRejected);

  let rejected=false;
  try{await buildPayload({repoRoot:repo,targetSha:'bad',surfaceId:'demo',stage:path.join(tmp,'bad')});}catch{rejected=true;}
  check('negative-fixture-invalid-sha-rejected',rejected);

  const reservation=createServer();
  await listen(reservation);
  const address=reservation.address();
  const delayedPort=typeof address==='object'&&address?address.port:null;
  await close(reservation);
  check('local-server-ephemeral-port-resolved',Number.isInteger(delayedPort)&&delayedPort>0);
  const delayedScript=`const http=require('node:http');setTimeout(()=>http.createServer((request,response)=>{response.statusCode=200;response.end('ready');}).listen(${delayedPort},'127.0.0.1'),900);`;
  const delayedServer=spawn(process.execPath,['-e',delayedScript],{stdio:'ignore'});
  const readinessStarted=Date.now();
  try{
    await waitForLocalHttpServer({url:`http://127.0.0.1:${delayedPort}/`,server:delayedServer,timeoutMs:5000,pollMs:50});
    check('local-server-readiness-waits-for-listener',Date.now()-readinessStarted>=800);
  }finally{if(delayedServer.exitCode===null)delayedServer.kill('SIGTERM');}

  const earlyExit=spawn(process.execPath,['-e','process.exit(7)'],{stdio:'ignore'});
  let earlyExitRejected=false;
  try{await waitForLocalHttpServer({url:'http://127.0.0.1:1/',server:earlyExit,timeoutMs:2000,pollMs:25});}
  catch(error){earlyExitRejected=String(error).includes('LOCAL_PREFLIGHT_SERVER_EXITED:7');}
  check('local-server-early-exit-rejected',earlyExitRejected);
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

const receipt={schema:'PUBLICATION_FAST_PREFLIGHT_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',checkCount:checks.length,checks,deploymentPerformed:false};
console.log(JSON.stringify(receipt,null,2));
