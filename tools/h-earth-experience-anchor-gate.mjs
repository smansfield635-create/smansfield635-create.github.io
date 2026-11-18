#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';

const ROOT=process.cwd();
const CURRENT='h-earth-3d/experience-anchor/H_EARTH_CURRENT_WORLD_ACCEPTANCE_v2.json';
const HISTORICAL='h-earth-3d/experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json';
const fail=code=>{console.error('H_EARTH_CURRENT_WORLD_GATE_FAIL:'+code);process.exit(1)};
const read=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,p))).digest('hex');
const exists=p=>fs.existsSync(path.join(ROOT,p));
const sha40=s=>typeof s==='string'&&/^[0-9a-f]{40}$/.test(s);
const sha64=s=>typeof s==='string'&&/^[0-9a-f]{64}$/.test(s);
const same=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
const current=read(CURRENT),legacy=read(HISTORICAL);
if(current.schema!=='H_EARTH_CURRENT_WORLD_ACCEPTANCE_POLICY_v2'||
 current.policyId!=='H_EARTH_CURRENT_ACCEPTED_PRODUCT_WORLD_V2'||
 current.status!=='ACTIVE_FAIL_CLOSED'||current.historicalAnchor?.currentVisualAuthority!==false||
 current.independentSourceReviewRequired!==true||current.currentRequiredChecks?.length!==6||
 current.protectedSameWorldSources?.length<5)fail('CURRENT_POLICY_INVALID');
if(legacy.status!=='HISTORICAL_SUPERSEDED'||
 legacy.authority?.controlsAcceptanceOfExperienceChangingUpgrades!==false||
 legacy.upgradeAcceptance?.receiptRequired!==false||
 legacy.supersededBy?.path!==CURRENT||
 legacy.supersededBy?.originalVideoIsCurrentProductBaseline!==false)
 fail('HISTORICAL_ANCHOR_STILL_ACTIVE');
const isExperience=p=>current.protectedPrefixes.some(a=>p.startsWith(a))&&
 !current.excludePrefixes.some(a=>p.startsWith(a))&&!current.instructionsOnly.includes(p);
const sorted=a=>[...a].sort();
function decide(r,{base,head,paths,coreUnchanged}){
 const deny=code=>({result:'FAIL_CLOSED',code});
 if(!r||r.schema!==current.receiptSchema||r.policyId!==current.policyId||
    r.disposition!=='PASS_CURRENT_WORLD'||r.reviewedAgainstCurrentWorld!==true||
    r.historicalVideoUsedAsAcceptanceBaseline!==false)return deny('CURRENT_RECEIPT_INVALID');
 if(!sha40(base)||!sha40(head)||!sha40(r.productSourceHead)||
    r.baseHead!==base||r.candidateHead!==head)return deny('EXACT_HEAD_IDENTITY_MISMATCH');
 if(!same(r.changedExperiencePaths||[],paths)||!Array.isArray(r.experienceFiles)||
    !same(r.experienceFiles.map(x=>x.path),paths))return deny('EXPERIENCE_PATH_SET_MISMATCH');
 if(r.experienceFiles.some(x=>!sha40(x.gitBlob)||!sha64(x.sha256)))
    return deny('EXPERIENCE_SOURCE_DIGEST_INVALID');
 for(const c of current.currentRequiredChecks)
    if(r.checks?.[c]!==true)return deny('CURRENT_WORLD_CHECK_NOT_PROVEN:'+c);
 for(const kind of ['visualEvidence','interactionEvidence','continuityEvidence'])
    if(!Array.isArray(r[kind])||r[kind].length===0||
      r[kind].some(x=>typeof x?.path!=='string'||!sha64(x.sha256)))
      return deny('CURRENT_WORLD_EVIDENCE_MISSING:'+kind);
 if(!Array.isArray(r.runtimeProofs)||r.runtimeProofs.length===0||
    r.runtimeProofs.some(x=>!Number.isInteger(x.runId)||x.runId<=0||
      !Number.isInteger(x.artifactId)||x.artifactId<=0||
      !sha64(x.archiveSha256)||x.exactSourceHead!==r.productSourceHead||
      x.result!=='PASS_EXACT_SOURCE_RUNTIME'))
      return deny('CURRENT_BROWSER_GPU_PROOF_MISSING');
 if(!current.acceptanceModes.includes(r.crossScale?.mode))
      return deny('CROSS_SCALE_ACCEPTANCE_MODE_INVALID');
 if(r.crossScale.mode===current.acceptanceModes[0]&&
    (!coreUnchanged||!same(r.crossScale.unchangedPaths||[],current.protectedSameWorldSources)))
      return deny('INHERITED_CROSS_SCALE_SOURCE_DRIFT');
 if(r.crossScale.mode===current.acceptanceModes[1]&&
    (r.crossScale.directModernWorldProof!==true||!r.crossScale.reviewReference))
      return deny('DIRECT_CURRENT_WORLD_PROOF_MISSING');
 if(r.independentReview?.result!=='PASS_SOURCE_BOUND'||r.independentReview.sourceHead!==r.productSourceHead||
    !/^https:\/\/github\.com\//.test(r.independentReview.url||''))
      return deny('INDEPENDENT_REVIEW_MISSING');
 if(r.ownerReview?.required===true){
   // A repair request or rejection cannot ever authorize a PASS receipt.
   if(r.ownerReview.disposition!=='KEEP'||
      !/^https:\/\/github\.com\//.test(r.ownerReview.url||''))
      return deny('OWNER_KEEP_DISPOSITION_NOT_PROVEN');
 }else if(current.declaredOwnerReviewRequired===true){
      return deny('OWNER_REVIEW_REQUIRED_BY_POLICY');
 }else if(r.ownerReview?.required!==false||
    typeof r.ownerReview.reason!=='string'||!r.ownerReview.reason.trim())
      return deny('OWNER_REVIEW_APPLICABILITY_MISSING');
 if(r.productMergeAuthorized!==false||r.deploymentAuthorized!==false)
    return deny('RECEIPT_MUST_NOT_CREATE_RELEASE_AUTHORITY');
 return {result:'PASS',reason:'CONTEMPORARY_WORLD_EXACT_SOURCE_AND_RUNTIME_PROVEN'};
}

const GH_REPO='smansfield635-create/smansfield635-create.github.io';
const GH_API='https://api.github.com/repos/'+GH_REPO;
const C2C_REGISTERED_RUNNER='.github/workflows/h-earth-neutral-exact-head-runner.yml';
function remoteRuntimeMatches(proof,run,artifact,sourceHead){
 return run?.status==='completed'&&run?.conclusion==='success'&&
   run?.path===C2C_REGISTERED_RUNNER&&run?.id===proof.runId&&
   artifact?.id===proof.artifactId&&artifact?.expired===false&&
   artifact?.workflow_run?.id===proof.runId&&
   artifact?.digest==='sha256:'+proof.archiveSha256&&
   artifact?.name==='h-earth-neutral-exact-head-'+sourceHead;
}
function parseReviewLocator(url){
 const match=typeof url==='string'?/^https:\/\/github\.com\/smansfield635-create\/smansfield635-create\.github\.io\/pull\/([1-9]\d*)#pullrequestreview-([1-9]\d*)$/.exec(url):null;
 return match?{pr:Number(match[1]),id:Number(match[2])}:null;
}
function remoteReviewMatches(receipt,pr,review,locator){
 return Boolean(locator&&pr?.number===locator.pr&&
   pr?.head?.sha===receipt.productSourceHead&&
   pr?.user?.login&&review?.id===locator.id&&
   review?.commit_id===receipt.productSourceHead&&
   review?.user?.login&&review.user.login!==pr.user.login&&
   review.state==='APPROVED');
}
async function requireAuthenticGithubEvidence(receipt){
 const get=async suffix=>{
   let response;
   try{
     const headers={Accept:'application/vnd.github+json','User-Agent':'H-Earth-current-world-evidence-gate'};
     if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
     response=await fetch(GH_API+suffix,{headers,signal:AbortSignal.timeout(20000)});
   }catch{fail('GITHUB_EVIDENCE_TRANSPORT_UNAVAILABLE');}
   if(!response.ok)fail('GITHUB_EVIDENCE_API_REJECTED:'+response.status);
   try{return await response.json();}
   catch{fail('GITHUB_EVIDENCE_API_RESPONSE_INVALID');}
 };
 for(const proof of receipt.runtimeProofs){
   const run=await get('/actions/runs/'+proof.runId);
   const listing=await get('/actions/runs/'+proof.runId+'/artifacts?per_page=100');
   const artifact=Array.isArray(listing?.artifacts)?
     listing.artifacts.find(a=>a.id===proof.artifactId):null;
   if(!remoteRuntimeMatches(proof,run,artifact,receipt.productSourceHead))
     fail('GITHUB_RUNTIME_ARTIFACT_PROVENANCE_MISMATCH');
 }
 const locator=parseReviewLocator(receipt.independentReview?.url);
 if(!locator)fail('GITHUB_REVIEW_LOCATOR_INVALID');
 const pr=await get('/pulls/'+locator.pr);
 const review=await get('/pulls/'+locator.pr+'/reviews/'+locator.id);
 if(!remoteReviewMatches(receipt,pr,review,locator))
   fail('GITHUB_INDEPENDENT_SOURCE_REVIEW_NOT_AUTHENTICATED');
}

function selfTest(){
 const base='a'.repeat(40),head='b'.repeat(40),src='c'.repeat(40),path='showroom/globe/h-earth/vegetation-prototype/route.js';
 const ok={schema:current.receiptSchema,policyId:current.policyId,disposition:'PASS_CURRENT_WORLD',
  reviewedAgainstCurrentWorld:true,historicalVideoUsedAsAcceptanceBaseline:false,
  baseHead:base,candidateHead:head,productSourceHead:src,
  changedExperiencePaths:[path],experienceFiles:[{path,gitBlob:'d'.repeat(40),sha256:'e'.repeat(64)}],
  checks:Object.fromEntries(current.currentRequiredChecks.map(k=>[k,true])),
  visualEvidence:[{path:'example.png',sha256:'f'.repeat(64)}],
  interactionEvidence:[{path:'example.json',sha256:'f'.repeat(64)}],
  continuityEvidence:[{path:'continuity.json',sha256:'f'.repeat(64)}],
  runtimeProofs:[{runId:1,artifactId:2,archiveSha256:'f'.repeat(64),
   exactSourceHead:src,result:'PASS_EXACT_SOURCE_RUNTIME'}],
  crossScale:{mode:current.acceptanceModes[0],unchangedPaths:current.protectedSameWorldSources},
  independentReview:{result:'PASS_SOURCE_BOUND',sourceHead:src,url:'https://github.com/example/repo/issues/1'},
  ownerReview:{required:true,disposition:'KEEP',url:'https://github.com/example/repo/issues/1'},
  productMergeAuthorized:false,deploymentAuthorized:false};
 const env={base,head,paths:[path],coreUnchanged:true};
 const cases=[
 ['accepted',()=>{},true],
 ['historic receipt',r=>r.schema='H_EARTH_EXPERIENCE_ANCHOR_ACCEPTANCE_RECEIPT_v1',false],
 ['old video enforced',r=>r.historicalVideoUsedAsAcceptanceBaseline=true,false],
 ['wrong source',r=>r.productSourceHead='',false],
 ['wrong candidate head',r=>r.candidateHead='',false],
 ['missing changed path',r=>r.changedExperiencePaths=[],false],
 ['wrong file hash',r=>r.experienceFiles[0].sha256='',false],
 ['missing GPU proof',r=>r.runtimeProofs=[],false],
 ['wrong native source',r=>r.runtimeProofs[0].exactSourceHead='f'.repeat(40),false],
 ['unproven frame',r=>r.checks.NATIVE_GPU_FRAME_PRESENTATION=false,false],
 ['no navigation evidence',r=>r.interactionEvidence=[],false],
 ['missing reviewer',r=>r.independentReview.result='PENDING',false],
 ['unresolved owner review',r=>r.ownerReview={required:true},false],
 ['fake release authority',r=>r.productMergeAuthorized=true,false],
 ['unproven cross-scale',r=>r.crossScale={mode:current.acceptanceModes[1]},false]
 ];
 for(const [label,mutate,expected] of cases){
  const fixture=structuredClone(ok);mutate(fixture);
  if((decide(fixture,env).result==='PASS')!==expected)
    throw Error('CURRENT_WORLD_SELF_TEST_FAILED:'+label);
 }
 if(decide(ok,{...env,coreUnchanged:false}).result==='PASS')
   throw Error('CURRENT_WORLD_SELF_TEST_FAILED:SOURCE_DRIFT');
 // Fail closed even if a receipt falsely asserts PASS while the owner
 // explicitly rejected, requested repair, or supposedly waived mandatory review.
 for(const disposition of ['REJECT','ONE_REPAIR']){
   const fixture=structuredClone(ok);fixture.ownerReview.disposition=disposition;
   if(decide(fixture,env).result==='PASS')
     throw Error('CURRENT_WORLD_SELF_TEST_FAILED:OWNER_'+disposition+'_MUST_NOT_PASS');
 }
 const skippedOwner=structuredClone(ok);
 skippedOwner.ownerReview={required:false,reason:'self-declared nonapplicability'};
 if(decide(skippedOwner,env).result==='PASS')
   throw Error('CURRENT_WORLD_SELF_TEST_FAILED:OWNER_REVIEW_SELF_WAIVER');


 const mockProof={runId:13,artifactId:17,archiveSha256:'f'.repeat(64)};
 const mockRun={id:13,status:'completed',conclusion:'success',path:C2C_REGISTERED_RUNNER};
 const mockArtifact={id:17,expired:false,workflow_run:{id:13},
  digest:'sha256:'+'f'.repeat(64),name:'h-earth-neutral-exact-head-'+src};
 if(!remoteRuntimeMatches(mockProof,mockRun,mockArtifact,src)||
    remoteRuntimeMatches(mockProof,{...mockRun,conclusion:'failure'},mockArtifact,src)||
    remoteRuntimeMatches(mockProof,mockRun,{...mockArtifact,digest:'sha256:'+'0'.repeat(64)},src)||
    remoteRuntimeMatches(mockProof,mockRun,{...mockArtifact,workflow_run:{id:14}},src)||
    remoteRuntimeMatches(mockProof,mockRun,{...mockArtifact,name:'other'},src))
    throw Error('CURRENT_WORLD_SELF_TEST_FAILED:AUTHENTIC_RUNTIME_PROVENANCE');
 const locator=parseReviewLocator('https://github.com/'+GH_REPO+'/pull/7462#pullrequestreview-123');
 const mockPr={number:7462,head:{sha:src},user:{login:'builder'}};
 const mockReview={id:123,commit_id:src,state:'APPROVED',user:{login:'verifier'}};
 if(!remoteReviewMatches(ok,mockPr,mockReview,locator)||
    remoteReviewMatches(ok,mockPr,{...mockReview,user:{login:'builder'}},locator)||
    remoteReviewMatches(ok,mockPr,{...mockReview,commit_id:head},locator)||
    remoteReviewMatches(ok,mockPr,{...mockReview,state:'COMMENTED',body:'No independent pass'},locator)||
     remoteReviewMatches(ok,mockPr,{...mockReview,state:'COMMENTED',body:'PASS_SOURCE_BOUND'},locator)||
    parseReviewLocator('https://example.com/other')!==null)
    throw Error('CURRENT_WORLD_SELF_TEST_FAILED:AUTHENTIC_SOURCE_REVIEW');

 return {schema:'H_EARTH_CURRENT_WORLD_GATE_SELF_TEST_v2',result:'PASS',
  cases:cases.length+1,oldVideoNotAuthority:true,missingEvidenceFailClosed:true,githubEvidenceMockChecks:10};
}
if(process.argv.includes('--self-test')){console.log(JSON.stringify(selfTest(),null,2));process.exit(0);}
const base=(process.env.BASE_SHA||'').trim(),head=(process.env.HEAD_SHA||'HEAD').trim();
if(base&&!sha40(base))fail('INVALID_BASE_SHA');
let changed=[];
if(base){
 try{changed=execFileSync('git',['diff','--name-only',base,head],{encoding:'utf8'})
  .split(/\r?\n/).filter(Boolean);}
 catch{fail('DIFF_RESOLUTION_FAILED');}
}
const paths=sorted(changed.filter(isExperience));
if(paths.length===0){
 console.log(JSON.stringify({schema:'H_EARTH_CURRENT_WORLD_GATE_RECEIPT_v2',
   result:'PASS',reason:'NO_EXPERIENCE_SURFACE_CHANGE',
   oldVideoNotControlling:true,changedPathCount:changed.length},null,2));
 process.exit(0);
}
if(!base)fail('MISSING_BASE_FOR_EXPERIENCE_CHANGE');
const receipts=changed.filter(p=>p.startsWith(current.receiptDirectory)&&
 p.endsWith('.json')&&p.includes('current-world-'));
if(receipts.length!==1||!exists(receipts[0]))fail('EXPERIENCE_CHANGE_WITHOUT_CURRENT_WORLD_RECEIPT');
const receipt=read(receipts[0]);
const blob=(commit,p)=>{
 try{return execFileSync('git',['rev-parse',commit+':'+p],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}
 catch{return null;}
};
const coreUnchanged=current.protectedSameWorldSources.every(p=>{
 const a=blob(base,p),b=blob(head,p);return a&&b&&a===b;
});
const decision=decide(receipt,{base,head,paths,coreUnchanged});
if(decision.result!=='PASS')fail(decision.code);
if(spawnSync('git',['merge-base','--is-ancestor',receipt.productSourceHead,head]).status!==0)
 fail('PRODUCT_SOURCE_HEAD_NOT_ANCESTOR');
for(const f of receipt.experienceFiles){
 if(!exists(f.path)||hash(f.path)!==f.sha256||blob(head,f.path)!==f.gitBlob||
    blob(receipt.productSourceHead,f.path)!==f.gitBlob)
   fail('EXPERIENCE_FILE_DIGEST_OR_SOURCE_DRIFT:'+f.path);
}
for(const kind of ['visualEvidence','interactionEvidence','continuityEvidence'])
 for(const f of receipt[kind]){
  if(!f.path.startsWith('h-earth-3d/')&&!f.path.startsWith('showroom/globe/'))
    fail('EVIDENCE_OUTSIDE_CURRENT_PRODUCT:'+f.path);
  if(!exists(f.path)||hash(f.path)!==f.sha256)
    fail('EVIDENCE_DIGEST_MISMATCH:'+f.path);
 }
await requireAuthenticGithubEvidence(receipt);
console.log(JSON.stringify({schema:'H_EARTH_CURRENT_WORLD_GATE_RECEIPT_v2',result:'PASS',
 reason:decision.reason,policyId:current.policyId,candidateHead:head,sourceHead:receipt.productSourceHead,
 oldVideoNotControlling:true,releaseAuthorized:false},null,2));
