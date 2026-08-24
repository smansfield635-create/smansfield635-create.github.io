#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildPayload,sha256,validateSha,validateSurfaceId} from './publication-preflight.v1.mjs';

const checks=[];
const check=(name,ok,detail=null)=>{checks.push({name,ok:Boolean(ok),detail});if(!ok)throw new Error(`SELF_TEST_FAILED:${name}${detail?':'+detail:''}`);};

check('surface-id-positive',validateSurfaceId('audralia'));
check('surface-id-negative-uppercase',!validateSurfaceId('Audralia'));
check('surface-id-negative-slash',!validateSurfaceId('../audralia'));
check('sha-positive',validateSha('a'.repeat(40)));
check('sha-negative',!validateSha('abc'));
check('sha256-deterministic',sha256(Buffer.from('diamond-gate'))===sha256(Buffer.from('diamond-gate')));

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'publication-preflight-self-test-'));
try{
  const repo=path.join(tmp,'repo');const stage=path.join(tmp,'stage');
  fs.mkdirSync(path.join(repo,'.github/ai-router/publication-surfaces'),{recursive:true});
  fs.mkdirSync(path.join(repo,'demo'),{recursive:true});
  fs.mkdirSync(path.join(repo,'preview/should-not-ship'),{recursive:true});
  fs.mkdirSync(path.join(repo,'.github/private'),{recursive:true});
  fs.writeFileSync(path.join(repo,'demo/index.html'),'<title>Demo</title>\nTOKEN_OK\n');
  fs.writeFileSync(path.join(repo,'preview/should-not-ship/secret.txt'),'nope');
  fs.writeFileSync(path.join(repo,'.github/private/secret.txt'),'nope');
  const manifest={schema:'PUBLICATION_SURFACE_VERIFICATION_v1',surfaceId:'demo',checks:[{path:'/demo/',includes:['TOKEN_OK'],excludes:[]}],runtime:{enabled:false}};
  fs.writeFileSync(path.join(repo,'.github/ai-router/publication-surfaces/demo.json'),JSON.stringify(manifest,null,2));
  const built=await buildPayload({repoRoot:repo,targetSha:'b'.repeat(40),surfaceId:'demo',stage});
  check('positive-fixture-payload-built',fs.existsSync(path.join(stage,'demo/index.html')));
  check('positive-fixture-release-marker',fs.existsSync(path.join(stage,'.well-known/dgb-release.json')));
  check('negative-fixture-preview-excluded',!fs.existsSync(path.join(stage,'preview')));
  check('negative-fixture-control-plane-excluded',!fs.existsSync(path.join(stage,'.github')));
  check('positive-fixture-digest',/^[0-9a-f]{64}$/.test(built.payloadDigest));
  let rejected=false;
  try{await buildPayload({repoRoot:repo,targetSha:'bad',surfaceId:'demo',stage:path.join(tmp,'bad')});}catch{rejected=true;}
  check('negative-fixture-invalid-sha-rejected',rejected);
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

const receipt={schema:'PUBLICATION_FAST_PREFLIGHT_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',checkCount:checks.length,checks,deploymentPerformed:false};
console.log(JSON.stringify(receipt,null,2));
