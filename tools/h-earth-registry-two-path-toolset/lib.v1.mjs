#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {spawnSync,execFileSync} from 'node:child_process';

export const SUBJECT_HEAD='7c0b8871928b21cd9b2806f058bce34eed11f2ba';
export const SUBJECT_BASE='3ac9279dc82e56f7b0d67972ce56048d07e5ecfa';
export const OVERLAY_PATH='h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js';
export const LOADER_PATH='h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';
export const PREDECESSOR_PATH='h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.c2-r1-candidate-path-disposition.js';
export const DESCRIPTOR_PATH='.github/ai-toolset-transport/h-earth-registry-two-path-toolset-registration.v1.json';
export const REGISTRY_PATH='.github/ai-toolset-transport/authorized-toolset-registry.v1.json';
export const ROUTER_CLI='tools/repository-ai-entry-router.mjs';
export const EXPECTED_REPAIR_PATHS=Object.freeze([OVERLAY_PATH,LOADER_PATH].sort());
export const TOOLING_PATHS=Object.freeze([
  'tools/h-earth-registry-two-path-toolset/lib.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/reproduction-harness.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/receipt-validator.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/fixtures.v1.json',
  'tools/h-earth-registry-two-path-toolset/self-test.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/fresh-verifier.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/termination.v1.mjs',
  '.github/workflows/h-earth-registry-two-path-toolset-registration-validation.yml'
]);
export const ROUTED_PATHS=Object.freeze([
  '.github/ai-toolset-transport/AGENTS.md',
  '.github/ai-toolset-transport/authorized-toolset-registry.v1.json',
  '.github/ai-toolset-transport/changed-path-manifest.v1.json',
  '.github/ai-toolset-transport/negative-fixtures.v1.json',
  '.github/ai-toolset-transport/progress-ledger.v1.json',
  '.github/ai-toolset-transport/schemas.v1.json',
  '.github/ai-toolset-transport/h-earth-registry-two-path-toolset-registration.v1.json',
  'tools/h-earth-registry-two-path-toolset/lib.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/registry-loader.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/two-path-resolver.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/exact-tooling-head-loader.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/evidence-loader.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/reproduction-harness.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/receipt-validator.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/fresh-verifier.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/termination.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/fixtures.v1.json',
  'tools/h-earth-registry-two-path-toolset/self-test.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/continuation-gate.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/register-descriptor.v1.mjs',
  'tools/h-earth-registry-two-path-toolset/route-verifier.v1.mjs',
  '.github/workflows/h-earth-registry-two-path-toolset-registration-validation.yml'
]);
export const NEGATIVE_ROUTES=Object.freeze([
  '.github/ai-toolset-transport/h-earth-registry-two-path-unlisted.v1.json',
  'tools/h-earth-registry-two-path-toolset/unlisted-future-tool.mjs',
  '.github/workflows/h-earth-registry-two-path-toolset-registration-validation-extra.yml'
]);
export const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
export const canonical=v=>JSON.stringify(stable(v));
export const text=v=>JSON.stringify(stable(v),null,2)+'\n';
export const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
export const assert=(v,c)=>{if(!v)throw new Error(c);};
export const isCommit=v=>typeof v==='string'&&/^[0-9a-f]{40}$/.test(v);
export const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const writeJson=(p,v)=>{fs.mkdirSync(path.dirname(path.resolve(p)),{recursive:true});fs.writeFileSync(path.resolve(p),text(v));};
export const git=a=>execFileSync('git',a,{encoding:'utf8'}).trim();
export const requireCommit=h=>{assert(isCommit(h),'COMMIT_IDENTITY_INVALID');git(['cat-file','-e',`${h}^{commit}`]);return h;};
export const showText=(h,p)=>{requireCommit(h);return execFileSync('git',['show',`${h}:${p}`],{encoding:'utf8'});};
export const showJson=(h,p)=>JSON.parse(showText(h,p));
export const blobAt=(h,p)=>git(['rev-parse',`${h}:${p}`]);
export const diffNames=(b,h)=>{requireCommit(b);requireCommit(h);const x=git(['diff','--name-only',b,h]);return x?x.split(/\r?\n/).filter(Boolean).sort():[];};
export function parseArgs(argv,allowed){const r={};for(let i=0;i<argv.length;i++){const t=argv[i];assert(t.startsWith('--'),`UNKNOWN_ARGUMENT:${t}`);const k=t.slice(2);assert(allowed.includes(k),`UNKNOWN_ARGUMENT:${t}`);r[k]=argv[++i]??null;}return r;}
export function verifySynthetic({changedPaths,overlaySource,loaderSource}){
  const checks={
    exactTwoPathSet:JSON.stringify([...changedPaths].sort())===JSON.stringify(EXPECTED_REPAIR_PATHS),
    overlayImportsPredecessor:overlaySource.includes('h-earth.repository-registry.c2-r1-candidate-path-disposition.js'),
    overlayHasBaseGuard:overlaySource.includes('requireC2R1BaseRegistryNode'),
    loaderImportsOverlay:loaderSource.includes('h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js'),
    loaderHasDependencyEntry:loaderSource.includes('loadHEarthRepositoryRegistryValidatorDependencies')
  };
  return {pass:Object.values(checks).every(Boolean),checks};
}
export function route(file,expected){
  const out=path.join(os.tmpdir(),`cp9route-${process.pid}-${Math.random().toString(16).slice(2)}.json`);
  const run=spawnSync(process.execPath,[ROUTER_CLI,'--mutation-intent','--path',file,'--task','CP9 A002 route verification','--output',out],{encoding:'utf8'});
  assert(run.status===expected,`ROUTER_EXIT_MISMATCH:${file}:${run.status}:${run.stderr}`);
  const receipt=readJson(out);fs.rmSync(out,{force:true});return receipt;
}
