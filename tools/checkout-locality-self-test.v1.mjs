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
const preflight=read('.github/workflows/publication-preflight-v1.yml');
const deploy=read('.github/workflows/pages-exact-head-deploy-v3.yml');
const audraliaWeatherQualification=read('.github/workflows/audralia-weather-presentation-reconciliation.yml');
const builder=read('tools/publication-preflight.v1.mjs');

check('policy-bounded-working-set-default',policy.checkoutLocality?.defaultMode==='BOUNDED_WORKING_SET_REQUIRED');
check('policy-unrestricted-checkout-denied',policy.checkoutLocality?.unrestrictedCheckoutAllowedByDefault===false);
check('policy-excluded-root-materialization-denied',policy.checkoutLocality?.materializeExcludedRootsThenDiscardAllowed===false);
check('policy-exact-object-readback-allowed',policy.checkoutLocality?.exactCommitObjectReadbackForExcludedProtectedClosuresAllowed===true);

for(const [name,text] of [['bridge',bridge],['canonical-intake',canonicalIntake],['successor-gateway',successorGateway],['preflight',preflight],['deploy',deploy]]){
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
for(const text of [preflight,deploy])for(const excluded of ['!/preview/','!/h-earth-live-6d18e158/','!/inspection/audralia-24057-exact/'])check(`publication-exclusion-${excluded}-${text===preflight?'preflight':'deploy'}`,text.includes(excluded));
check('builder-exact-object-reader',builder.includes("source:'EXACT_COMMIT_OBJECT'"));
check('builder-git-object-show',builder.includes("spawnSync('git',['-C',repoRoot,'show',objectPath]"));
check('builder-target-sha-bound-promotion',builder.includes('promoteAuthorizedExcludedRuntimeDependencies({repoRoot,stage,targetSha,surfaceId})'));

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
  fs.writeFileSync(path.join(repo,'showroom/globe/audralia/index.html'),'<!doctype html><div class="audralia-loading-version">LIVE BUILD</div><script type="module" src="/inspection/audralia-24057-exact/snapshot/runtime/entry.mjs"></script>\n');
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
  audraliaWeatherQualificationSparseIndex:true,
  audraliaWeatherQualificationActionsCheckout:false,
  audraliaWeatherQualificationNoFullIndexTraversalContract:true,
  audraliaWeatherQualificationModuleClosureGuard:true,
  checkCount:checks.length,
  checks
};
if(process.env.CHECKOUT_LOCALITY_RECEIPT)fs.writeFileSync(process.env.CHECKOUT_LOCALITY_RECEIPT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
