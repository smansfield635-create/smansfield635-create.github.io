#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {buildPayload} from './publication-preflight.v1.mjs';

const root=process.cwd();
const checks=[];
const check=(name,ok,detail=null)=>{checks.push({name,ok:Boolean(ok),detail});if(!ok)throw new Error(`CHECKOUT_LOCALITY_SELF_TEST_FAILED:${name}${detail?':'+detail:''}`);};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const readJson=p=>JSON.parse(read(p));

const policy=readJson('.github/ai-router/execution-efficiency-policy.v1.json');
const bridge=read('.github/workflows/ai-entry-workflow-dispatch-bridge.yml');
const canonicalIntake=read('.github/workflows/canonical-operation-intake-transport-v1.yml');
const successorGateway=read('.github/workflows/remote-operation-successor-v1.yml');
const automaticRelease=read('.github/workflows/ai-entry-auto-release.yml');
const preflight=read('.github/workflows/publication-preflight-v1.yml');
const deploy=read('.github/workflows/pages-exact-head-deploy-v3.yml');
const audraliaWeatherQualification=read('.github/workflows/audralia-weather-presentation-reconciliation.yml');
const builder=read('tools/publication-preflight.v1.mjs');

check('policy-bounded-working-set-default',policy.checkoutLocality?.defaultMode==='BOUNDED_WORKING_SET_REQUIRED');
check('policy-unrestricted-checkout-denied',policy.checkoutLocality?.unrestrictedCheckoutAllowedByDefault===false);
check('policy-excluded-root-materialization-denied',policy.checkoutLocality?.materializeExcludedRootsThenDiscardAllowed===false);
check('policy-exact-object-readback-allowed',policy.checkoutLocality?.exactCommitObjectReadbackForExcludedProtectedClosuresAllowed===true);
check('policy-automatic-release-enrolled',policy.checkoutLocality?.centralWorkflows?.automaticRelease==='.github/workflows/ai-entry-auto-release.yml');
check('policy-automatic-release-protected-closure-excluded',policy.checkoutLocality?.automaticReleaseWorkingSet?.excludedProtectedClosure==='inspection/audralia-24057-exact');
check('policy-automatic-release-entry-bound',policy.checkoutLocality?.automaticReleaseWorkingSet?.sparseIndexEntryLimitExclusive===20000);
check('policy-automatic-release-file-bound',policy.checkoutLocality?.automaticReleaseWorkingSet?.materializedFileLimitExclusive===20000);

for(const [name,text] of [['bridge',bridge],['canonical-intake',canonicalIntake],['successor-gateway',successorGateway]]){
  const checkoutCount=(text.match(/uses:\s*actions\/checkout@v4/g)||[]).length;
  const sparseCount=(text.match(/sparse-checkout:\s*\|/g)||[]).length;
  const nonConeCount=(text.match(/sparse-checkout-cone-mode:\s*false/g)||[]).length;
  check(`${name}-checkout-present`,checkoutCount>0);
  check(`${name}-every-checkout-sparse`,sparseCount===checkoutCount,JSON.stringify({checkoutCount,sparseCount}));
  check(`${name}-every-checkout-non-cone`,nonConeCount===checkoutCount,JSON.stringify({checkoutCount,nonConeCount}));
}
for(const required of ['/.github/ai-router/workflow-dispatch-capability.v1.json','/tools/ai-entry-workflow-dispatch-bridge.mjs'])check(`bridge-path-${required}`,bridge.includes(required));
check('bridge-not-root-wide',!bridge.includes('\n            /*\n'));
for(const required of ['/.github/operation-intake/locator.v1.json','/tools/operation-intake/'])check(`canonical-intake-path-${required}`,canonicalIntake.includes(required));
check('canonical-intake-not-root-wide',!canonicalIntake.includes('\n            /*\n'));
for(const required of ['/AI_ENTRYPOINT.json','/.github/workflows/remote-operation-successor-v1.yml','/.github/ai-router/router.v1.json','/.github/ai-router/system-continuity/gap-registry.v1.json','/.github/ai-router/operation-lifecycle/','/tools/operation-intake/'])check(`successor-gateway-path-${required}`,successorGateway.includes(required));
check('successor-gateway-not-root-wide',!successorGateway.includes('\n            /*\n'));
check('successor-frozen-gate-identity-preserved',successorGateway.includes('8b254c43abc53d769e82524c6eded1c07eaffc61'));
check('successor-frozen-self-test-identity-preserved',successorGateway.includes('edba8f3b024e832fd3da6207ba786ce292aad54c'));

check('automatic-release-no-actions-checkout',!automaticRelease.includes('actions/checkout@v4'));
check('automatic-release-partial-fetch',automaticRelease.includes('fetch --no-tags --depth=1 --filter=blob:none origin "$TARGET_SHA"'));
check('automatic-release-sparse-index-init',automaticRelease.includes('git sparse-checkout init --cone --sparse-index'));
check('automatic-release-sparse-index-asserted',automaticRelease.includes('git config --bool index.sparse'));
check('automatic-release-root-tree-enumeration',automaticRelease.includes('git ls-tree -d --name-only FETCH_HEAD'));
check('automatic-release-inspection-child-enumeration',automaticRelease.includes('git ls-tree -d --name-only "FETCH_HEAD:inspection"'));
check('automatic-release-bounded-index-threshold',automaticRelease.includes('test "$sparse_entries" -lt 20000'));
check('automatic-release-bounded-materialized-threshold',automaticRelease.includes('test "$materialized_files" -lt 20000'));
check('automatic-release-bulk-roots-excluded',automaticRelease.includes('.github|preview|node_modules|h-earth-live-6d18e158'));
check('automatic-release-protected-snapshot-excluded-from-worktree',automaticRelease.includes('test "$child" = "audralia-24057-exact" && continue'));
check('automatic-release-protected-snapshot-absence-asserted',automaticRelease.includes('test ! -e inspection/audralia-24057-exact'));
check('automatic-release-no-noncone-index-walk',!automaticRelease.includes('sparse-checkout-cone-mode: false'));
check('automatic-release-no-root-wide-negative-sparse-pattern',!automaticRelease.includes('\n            /*\n'));
for(const required of [
  'preview/bt4/entitlement-v1',
  'preview/bt4/operational-release-v1',
  'h-earth-live-6d18e158/showroom/globe/h-earth'
])check(`automatic-release-required-subtree-${required}`,automaticRelease.includes(required));
for(const preserved of [
  'node preview/bt4/entitlement-v1/verify-entitlement-preview.v1.mjs',
  'BT4_BOUNDED_PREVIEWS_STAGED=PASS',
  'BT4_REAL_OBJECT_EVIDENCE_IDENTITY=PASS',
  'rsync -a --delete h-earth-live-6d18e158/showroom/globe/h-earth/'
])check(`automatic-release-publication-semantics-${preserved}`,automaticRelease.includes(preserved));

for(const [name,text] of [['publication-preflight',preflight],['pages-deploy',deploy]]){
  check(`${name}-no-actions-checkout`,!text.includes('actions/checkout@v4'));
  check(`${name}-partial-fetch`,text.includes('fetch --no-tags --depth=1 --filter=blob:none origin "$TARGET_SHA"'));
  check(`${name}-sparse-index-init`,text.includes('git sparse-checkout init --cone --sparse-index'));
  check(`${name}-sparse-index-asserted`,text.includes('git config --bool index.sparse'));
  check(`${name}-root-tree-enumeration`,text.includes('git ls-tree -d --name-only FETCH_HEAD'));
  check(`${name}-inspection-child-enumeration`,text.includes('git ls-tree -d --name-only "FETCH_HEAD:inspection"'));
  check(`${name}-bounded-index-threshold`,text.includes('test "$sparse_entries" -lt 20000'));
  check(`${name}-bounded-materialized-threshold`,text.includes('test "$materialized_files" -lt 20000'));
  check(`${name}-manifest-control-plane-included`,text.includes('.github/ai-router/publication-surfaces'));
  check(`${name}-preview-excluded`,text.includes('.github|preview|node_modules|h-earth-live-6d18e158'));
  check(`${name}-protected-snapshot-excluded-from-worktree`,text.includes('test "$child" = "audralia-24057-exact" && continue'));
  check(`${name}-no-noncone-index-walk`,!text.includes('sparse-checkout-cone-mode: false'));
  check(`${name}-no-root-wide-negative-sparse-pattern`,!text.includes('\n            /*\n'));
}

check('audralia-weather-qualification-no-actions-checkout',!audraliaWeatherQualification.includes('actions/checkout@v4'));
check('audralia-weather-qualification-two-partial-fetches',(audraliaWeatherQualification.match(/fetch --no-tags --depth=1 --filter=blob:none/g)||[]).length===2);
check('audralia-weather-qualification-exact-workflow-ref',(audraliaWeatherQualification.match(/\$\{GITHUB_REF\}/g)||[]).length===2);
check('audralia-weather-qualification-two-sparse-index-inits',(audraliaWeatherQualification.match(/git sparse-checkout init --cone --sparse-index/g)||[]).length===2);
check('audralia-weather-qualification-sparse-index-asserted',(audraliaWeatherQualification.match(/git config --bool index\.sparse/g)||[]).length===2);
check('audralia-weather-qualification-bounded-index-thresholds',audraliaWeatherQualification.includes('test "$sparse_entries" -lt 2000')&&audraliaWeatherQualification.includes('test "$sparse_entries" -lt 5000'));
check('audralia-weather-qualification-no-noncone-index-walk',!audraliaWeatherQualification.includes('sparse-checkout-cone-mode: false'));
check('audralia-weather-qualification-exact-tool-readback',(audraliaWeatherQualification.match(/git show HEAD:tools\/audralia-weather-presentation-reconciliation-ci\.mjs/g)||[]).length===2);
for(const required of [
  'showroom/globe/audralia/weather-presentation-reconciliation',
  'showroom/globe/audralia',
  'showroom/globe/h-earth/terrain-estate-construction-v1',
  'showroom/globe/h-earth/render',
  'h-earth-3d/integration',
  'h-earth-3d/terrain',
  'h-earth-3d/control-plane/run-8',
  'h-earth-3d/objects',
  'h-earth-3d/zones',
  'h-earth-3d/cells',
  'h-earth-3d/environment',
  'inspection/audralia-24057-exact/snapshot/showroom/globe/audralia',
  'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1',
  'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/render',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/control-plane/run-8',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/objects',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/zones',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/cells',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/environment'
])check(`audralia-weather-qualification-path-${required}`,audraliaWeatherQualification.includes(required));
check('audralia-weather-qualification-module-closure-guard',audraliaWeatherQualification.includes('Verify browser module dependency closure'));
check('audralia-weather-qualification-no-root-wide-sparse-set',!audraliaWeatherQualification.includes('git sparse-checkout set /'));

check('builder-exact-object-reader',builder.includes("source:'EXACT_COMMIT_OBJECT'"));
check('builder-git-object-show',builder.includes("spawnSync('git',['-C',repoRoot,'show',objectPath]"));
check('builder-target-sha-bound-promotion',builder.includes('promoteAuthorizedExcludedRuntimeDependencies({repoRoot,stage,targetSha,surfaceId})'));
check('builder-recurses-staged-public-modules',builder.includes("source='STAGED_PUBLIC_PAYLOAD'")&&builder.includes('traversedResourceCount'));
check('builder-import-wrapper-literal-discovery',builder.includes('importWrapper\\s*\\('));

const sparseTmp=fs.mkdtempSync(path.join(os.tmpdir(),'sparse-index-self-test-'));
try{
  const source=path.join(sparseTmp,'source');
  const work=path.join(sparseTmp,'work');
  fs.mkdirSync(path.join(source,'keep/deep'),{recursive:true});
  fs.mkdirSync(path.join(source,'exclude/deep'),{recursive:true});
  fs.writeFileSync(path.join(source,'keep/deep/kept.txt'),'kept\n');
  fs.writeFileSync(path.join(source,'exclude/deep/excluded.txt'),'excluded\n');
  execFileSync('git',['init'],{cwd:source,stdio:'ignore'});
  execFileSync('git',['config','user.email','checkout-locality@example.invalid'],{cwd:source});
  execFileSync('git',['config','user.name','Checkout Locality Self Test'],{cwd:source});
  execFileSync('git',['add','.'],{cwd:source});
  execFileSync('git',['commit','-m','fixture'],{cwd:source,stdio:'ignore'});
  const targetSha=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
  fs.mkdirSync(work,{recursive:true});
  execFileSync('git',['init'],{cwd:work,stdio:'ignore'});
  execFileSync('git',['remote','add','origin',source],{cwd:work});
  execFileSync('git',['fetch','--no-tags','--depth=1','origin',targetSha],{cwd:work,stdio:'ignore'});
  execFileSync('git',['sparse-checkout','init','--cone','--sparse-index'],{cwd:work});
  execFileSync('git',['sparse-checkout','set','keep/deep'],{cwd:work});
  execFileSync('git',['checkout','--detach','FETCH_HEAD'],{cwd:work,stdio:'ignore'});
  check('sparse-index-functional-config',execFileSync('git',['config','--bool','index.sparse'],{cwd:work,encoding:'utf8'}).trim()==='true');
  check('sparse-index-functional-kept',fs.existsSync(path.join(work,'keep/deep/kept.txt')));
  check('sparse-index-functional-excluded',!fs.existsSync(path.join(work,'exclude/deep/excluded.txt')));
  const sparseIndexEntries=execFileSync('git',['ls-files','--sparse'],{cwd:work,encoding:'utf8'}).trim().split('\n').filter(Boolean);
  check('sparse-index-functional-compressed',sparseIndexEntries.includes('exclude/'),JSON.stringify(sparseIndexEntries));
}finally{
  fs.rmSync(sparseTmp,{recursive:true,force:true});
}

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'checkout-locality-self-test-'));
try{
  const repo=path.join(tmp,'repo');
  const stage=path.join(tmp,'stage');
  fs.mkdirSync(path.join(repo,'.github/ai-router/publication-surfaces'),{recursive:true});
  fs.mkdirSync(path.join(repo,'showroom/globe/audralia'),{recursive:true});
  fs.mkdirSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime'),{recursive:true});
  fs.mkdirSync(path.join(repo,'public'),{recursive:true});
  fs.writeFileSync(path.join(repo,'showroom/globe/audralia/local-compositor.mjs'),"async function importWrapper(label,url){return import(url);}\nawait importWrapper('WRAPPED','/inspection/audralia-24057-exact/snapshot/runtime/entry.mjs');\n");
  fs.writeFileSync(path.join(repo,'showroom/globe/audralia/index.html'),'<!doctype html><div class="audralia-loading-version">LIVE BUILD</div><script type="module" src="./local-compositor.mjs"></script>\n');
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/entry.mjs'),"import './child.mjs';\nexport const READY=true;\n");
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/runtime/child.mjs'),'export const CHILD=true;\n');
  fs.writeFileSync(path.join(repo,'inspection/audralia-24057-exact/snapshot/unreferenced.txt'),'must-not-stage');
  fs.writeFileSync(path.join(repo,'public/index.html'),'public-root\n');
  const manifest={schema:'PUBLICATION_SURFACE_VERIFICATION_v1',surfaceId:'audralia',checks:[{path:'/showroom/globe/audralia/',includes:['LIVE BUILD'],excludes:[]}],runtime:{enabled:false}};
  fs.writeFileSync(path.join(repo,'.github/ai-router/publication-surfaces/audralia.json'),JSON.stringify(manifest,null,2));
  execFileSync('git',['init'],{cwd:repo,stdio:'ignore'});
  execFileSync('git',['config','user.email','checkout-locality@example.invalid'],{cwd:repo});
  execFileSync('git',['config','user.name','Checkout Locality Self Test'],{cwd:repo});
  execFileSync('git',['add','.'],{cwd:repo});
  execFileSync('git',['commit','-m','fixture'],{cwd:repo,stdio:'ignore'});
  const targetSha=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
  fs.rmSync(path.join(repo,'inspection/audralia-24057-exact'),{recursive:true,force:true});
  check('fixture-protected-tree-not-materialized',!fs.existsSync(path.join(repo,'inspection/audralia-24057-exact')));
  const built=await buildPayload({repoRoot:repo,targetSha,surfaceId:'audralia',stage});
  const closure=built.authorizedExcludedRuntimeDependencies;
  check('exact-object-closure-promoted',closure?.status==='PROMOTED');
  check('exact-object-readback-count',closure?.exactCommitObjectReadbackCount===2,JSON.stringify({count:closure?.exactCommitObjectReadbackCount,files:closure?.files}));
  check('exact-object-entry-staged',fs.existsSync(path.join(stage,'inspection/audralia-24057-exact/snapshot/runtime/entry.mjs')));
  check('exact-object-child-staged',fs.existsSync(path.join(stage,'inspection/audralia-24057-exact/snapshot/runtime/child.mjs')));
  check('exact-object-local-compositor-traversed',closure?.traversedResourceCount>=4,JSON.stringify({traversed:closure?.traversedResourceCount}));
  check('unreferenced-excluded-object-not-staged',!fs.existsSync(path.join(stage,'inspection/audralia-24057-exact/snapshot/unreferenced.txt')));
  check('closure-sources-exact-commit',closure.files.every(file=>file.source==='EXACT_COMMIT_OBJECT'));
}finally{
  fs.rmSync(tmp,{recursive:true,force:true});
}

const receipt={
  schema:'CHECKOUT_LOCALITY_CONTROL_PLANE_RECEIPT_v1',
  result:'PASS_CLOSED',
  defaultMode:'BOUNDED_WORKING_SET_REQUIRED',
  unrestrictedCheckoutAllowedByDefault:false,
  exactCommitObjectReadbackVerified:true,
  governedLaneGatewaysSparse:true,
  automaticReleaseSparseIndex:true,
  automaticReleaseActionsCheckout:false,
  automaticReleaseNoFullIndexTraversalContract:true,
  automaticReleaseProtectedSnapshotMaterialized:false,
  publicationPreflightSparseIndex:true,
  publicationDeploySparseIndex:true,
  publicationActionsCheckout:false,
  publicationNoFullIndexTraversalContract:true,
  audraliaWeatherQualificationSparseIndex:true,
  audraliaWeatherQualificationActionsCheckout:false,
  audraliaWeatherQualificationNoFullIndexTraversalContract:true,
  audraliaWeatherQualificationModuleClosureGuard:true,
  checkCount:checks.length,
  checks
};
if(process.env.CHECKOUT_LOCALITY_RECEIPT)fs.writeFileSync(process.env.CHECKOUT_LOCALITY_RECEIPT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
