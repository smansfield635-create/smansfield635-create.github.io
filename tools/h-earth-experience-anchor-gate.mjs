#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const ROOT=process.cwd();
const MANIFEST_PATH='h-earth-3d/experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json';
const RECEIPT_PREFIX='h-earth-3d/experience-anchor/receipts/';
const NON_EXPERIENCE_H_EARTH_PREFIXES=[
  'h-earth-3d/registry/',
  'h-earth-3d/control-plane/',
  'h-earth-3d/experience-anchor/',
  'h-earth-3d/evaluation/',
  'h-earth-3d/evidence/'
];
const NON_EXPERIENCE_H_EARTH_SHOWROOM_PREFIXES=[
  'showroom/globe/h-earth/diagnostic/',
  'showroom/globe/h-earth/awards/'
];
const NON_EXPERIENCE_AUDRALIA_PREFIXES=[
  'showroom/globe/audralia/disposition/',
  'showroom/globe/audralia/diagnostic/'
];
const INSTRUCTION_ONLY_PATHS=new Set([
  'h-earth-3d/AGENTS.md',
  'showroom/globe/h-earth/AGENTS.md',
  'showroom/globe/audralia/AGENTS.md'
]);
const fail=code=>{console.error(`H_EARTH_EXPERIENCE_ANCHOR_GATE_FAIL:${code}`);process.exit(1)};
const sha256=data=>crypto.createHash('sha256').update(data).digest('hex');
const readJson=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const exists=p=>fs.existsSync(path.join(ROOT,p));

if(!exists(MANIFEST_PATH))fail('ANCHOR_MANIFEST_MISSING');
const anchor=readJson(MANIFEST_PATH);
if(anchor.schema!=='H_EARTH_EXPERIENCE_ANCHOR_v1'||anchor.status!=='HARD_ACCEPTANCE_CRITERION')fail('ANCHOR_IDENTITY_INVALID');
if(anchor.sourceVideo?.sha256!=='7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573')fail('SOURCE_VIDEO_IDENTITY_DRIFT');
if(anchor.controllingLaw!=='AN_H_EARTH_UPGRADE_FAILS_IF_ENTERING_H_EARTH_FEELS_LIKE_ENTERING_A_DIFFERENT_PRODUCT')fail('CONTROLLING_LAW_DRIFT');
if(anchor.sameWorldLaw!=='PLANETARY_GLOBE_REGIONAL_AND_LOCAL_GROUND_VIEWS_MUST_READ_AS_SCALE_CHANGES_WITHIN_ONE_CANONICAL_NAVIGABLE_WORLD')fail('SAME_WORLD_LAW_DRIFT');
if(anchor.upgradeAcceptance?.failureDisposition!=='BLOCK_H_EARTH_EXPERIENCE_UPGRADE'||anchor.upgradeAcceptance?.mayWaiveWithoutExplicitUserReplacementOfAnchor!==false)fail('FAIL_CLOSED_POLICY_DRIFT');
if(!Array.isArray(anchor.requiredInvariants)||anchor.requiredInvariants.length<10)fail('ANCHOR_INVARIANTS_INCOMPLETE');
const visualProxy=anchor.repositoryVisualProxy?.path;
if(!visualProxy||!exists(visualProxy))fail('VISUAL_PROXY_MISSING');
if(sha256(fs.readFileSync(path.join(ROOT,visualProxy)))!==anchor.repositoryVisualProxy.sha256)fail('VISUAL_PROXY_DIGEST_MISMATCH');

const base=process.env.BASE_SHA?.trim();
const head=(process.env.HEAD_SHA||'HEAD').trim();
let changed=[];
if(base&&base!=='0000000000000000000000000000000000000000'){
  try{changed=execFileSync('git',['diff','--name-only',base,head],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean);}catch{fail('DIFF_RESOLUTION_FAILED');}
}

const isExperiencePath=p=>{
  if(INSTRUCTION_ONLY_PATHS.has(p))return false;
  if(p.startsWith('showroom/globe/h-earth/'))return !NON_EXPERIENCE_H_EARTH_SHOWROOM_PREFIXES.some(prefix=>p.startsWith(prefix));
  if(p.startsWith('showroom/globe/audralia/'))return !NON_EXPERIENCE_AUDRALIA_PREFIXES.some(prefix=>p.startsWith(prefix));
  return p.startsWith('h-earth-3d/')&&!NON_EXPERIENCE_H_EARTH_PREFIXES.some(prefix=>p.startsWith(prefix));
};

const experienceChanges=changed.filter(isExperiencePath).sort();

//
// Owner-authorized, exact-source Gen3187 early-navigation application only.
// Does not loosen the controlling 11-invariant gate for any other upgrade.
// The owner-directed scoped receipt is a separate category, never a full Anchor PASS.
const scoped=anchor.scopedPerformanceRelease;

// Exact Chromium artifact member identities independently read and SHA-256
// verified against archive 1f58b866c6f60d10bf558d57a073ec82f78788e5bb71fba585295e66d53e4794.
// These content-addressed references reject arbitrary nonempty evidence strings.
// A verified reference is not itself human/independent visual acceptance.
const REQUIRED_SCOPED_CHECKS=Object.freeze(["FIRST_TERRAIN_FRAME","USER_DRIVEN_CHANGED_CAMERA_BEFORE_ENTER","BACKGROUND_VEGETATION_WHILE_NAVIGATION_AVAILABLE","NAVIGATION_SURVIVES_BACKGROUND_PREPARATION_FAILURE","NO_DEMONSTRATED_MATERIAL_GEOGRAPHIC_OR_VISUAL_DISCONTINUITY"]);
const REQUIRED_SCOPED_LIMITATIONS=Object.freeze(["ORIGINAL_ANCHOR_VIDEO_NOT_REPLAYED","NO_CONTINUOUS_VEGETATION_TRANSITION_RECORDING","PHYSICAL_ANDROID_PERFORMANCE_UNMEASURED"]);
const PINNED_CHROMIUM_MEMBERS=Object.freeze({"receipt.json":"bc820c41fffbf2a58b9f5689c5cafa207e88a25c142091bf4f349e58ea58c2c3","terrain-first.png":"36da52c23cd349d8c18ccf273dc48e9f9af71e1daeea1ef90ed986731ca4b9ff","changed-camera.png":"502d00a0badcd98e140edd3409483fdf1a6a229468f3257f593ad059ab246113","vegetation-finished.png":"308293303503afb9f2293d665b5a44ed6d977e096db0930c5f1bc3ed3b21cb7a","vegetation-fault-injected.png":"a9e8cf308d4bb62b22fa90b7e4feec76f0f7cbcf344f215127df865b6eb61e15","strict-diagnostic-replay.png":"472c5e2f4bf3a4acce4542a03df45da85d836090e2100ed810b731c91fe191dc"});
const REQUIRED_SCOPED_EVIDENCE=Object.freeze({"visualEvidence":["terrain-first.png","changed-camera.png","vegetation-finished.png"],"interactionEvidence":["changed-camera.png","vegetation-fault-injected.png"],"continuityEvidence":["vegetation-finished.png","strict-diagnostic-replay.png"]});
const scopedArtifactReference=name=>'github-actions-artifact://42570259969/13652229709/'+name+'#sha256='+PINNED_CHROMIUM_MEMBERS[name];
const exactList=(found,required)=>Array.isArray(found)&&found.length===required.length&&required.every((x,i)=>found[i]===x);
if(scoped){
  if(scoped.schema!=='H_EARTH_EXACT_GEN3187_SCOPED_PERFORMANCE_RELEASE_v1'||
    scoped.status!=='OWNER_AUTHORIZED_EXACT_CANDIDATE_ONLY'||
    scoped.ownerAuthorization?.issue!==6426||
    scoped.ownerAuthorization?.commentId!==6744667321||
    scoped.originalProductCommit!=='7a2595ce83c68a865bc40460c343e01f918e7da0'||
    scoped.routePath!=='showroom/globe/h-earth/vegetation-prototype/route.js'||
    scoped.routeGitBlob!=='c83cacfde1c01f59c0c1b2abf225ecadc4b4b5e1'||
    scoped.receiptSchema!=='H_EARTH_EXPERIENCE_ANCHOR_SCOPED_PERFORMANCE_RECEIPT_v1'||
    scoped.disposition!=='SCOPED_ACCEPTED_WITH_LIMITATIONS'||
    scoped.evidence?.chromiumRunId!==42570259969||
    scoped.evidence?.artifactId!==13652229709||
    scoped.evidence?.archiveSha256!=='1f58b866c6f60d10bf558d57a073ec82f78788e5bb71fba585295e66d53e4794'||
    scoped.fullAnchorRequiredForAllOtherExperienceChanges!==true||
    scoped.cannotDeclareAllInvariantsIndependentlyReproven!==true||
    scoped.noMergeDeploymentOrPublicationAuthorityCreated!==true||
    !exactList(scoped.mandatoryChecks,REQUIRED_SCOPED_CHECKS)||
    !exactList(scoped.requiredExplicitLimitations,REQUIRED_SCOPED_LIMITATIONS))fail('SCOPED_POLICY_DRIFT');
}
if(scoped&&experienceChanges.length===1&&experienceChanges[0]===scoped.routePath){
  const candidateReceipts=changed.filter(p=>p.startsWith(RECEIPT_PREFIX)&&p.endsWith('.json'));
  if(candidateReceipts.length===1){
    const scopedReceipt=readJson(candidateReceipts[0]);
    if(scopedReceipt.schema===scoped.receiptSchema){
      const approvedPaths=new Set([scoped.routePath,candidateReceipts[0]]);
      if(changed.some(p=>!approvedPaths.has(p)))fail('SCOPED_UNRELATED_PATH_CHANGED');
      let blob;
      try{blob=execFileSync('git',['hash-object',scoped.routePath],{encoding:'utf8'}).trim();}
      catch{fail('SCOPED_ROUTE_BLOB_UNAVAILABLE');}
      if(blob!==scoped.routeGitBlob)fail('SCOPED_ROUTE_BLOB_DRIFT');
      try{execFileSync('git',['merge-base','--is-ancestor',scoped.originalProductCommit,head]);}
      catch{fail('SCOPED_ORIGINAL_CANDIDATE_ANCESTRY_MISSING');}
      if(scopedReceipt.anchorId!==anchor.anchorId||
         scopedReceipt.anchorSha256!==anchor.sourceVideo.sha256||
         scopedReceipt.ownerAuthorizationCommentId!==scoped.ownerAuthorization.commentId||
         scopedReceipt.disposition!==scoped.disposition||
         scopedReceipt.reviewedAgainstAnchor!==true||
         scopedReceipt.fullElevenInvariantPassClaimed!==false||
         scopedReceipt.originalVideoPlaybackClaimed!==false||
         scopedReceipt.androidPerformanceMeasured!==false||
         scopedReceipt.evidence?.chromiumRunId!==scoped.evidence.chromiumRunId||
         scopedReceipt.evidence?.artifactId!==scoped.evidence.artifactId||
         scopedReceipt.evidence?.archiveSha256!==scoped.evidence.archiveSha256)fail('SCOPED_RECEIPT_IDENTITY_OR_CLAIM_INVALID');
      const f=scopedReceipt.experienceFile;
      if(f?.path!==scoped.routePath||
         f?.gitBlob!==blob||
         f?.sha256!==sha256(fs.readFileSync(path.join(ROOT,scoped.routePath))))fail('SCOPED_EXPERIENCE_SOURCE_MISMATCH');
      for(const key of scoped.mandatoryChecks||[]){
        if(scopedReceipt.checks?.[key]!==true)fail('SCOPED_CHECK_NOT_SUPPORTED:'+key);
      }
      for(const limitation of scoped.requiredExplicitLimitations||[]){
        if(!Array.isArray(scopedReceipt.limitations)||!scopedReceipt.limitations.includes(limitation))fail('SCOPED_LIMITATION_NOT_DISCLOSED:'+limitation);
      }
      for(const [type,members] of Object.entries(REQUIRED_SCOPED_EVIDENCE)){
        if(!exactList(scopedReceipt[type],members.map(scopedArtifactReference)))fail('SCOPED_EVIDENCE_IDENTITY_INVALID:'+type);
      }
      console.log(JSON.stringify({
        schema:'H_EARTH_EXPERIENCE_ANCHOR_GATE_RECEIPT_v1',
        result:'PASS',reason:'EXACT_GEN3187_SCOPED_PERFORMANCE_ACCEPTANCE_ONLY',
        fullAnchorElevenInvariantPassClaimed:false,
        anchorId:anchor.anchorId,anchorSha256:anchor.sourceVideo.sha256,
        scopedProductCommit:scoped.originalProductCommit,routeGitBlob:blob,
        receipt:candidateReceipts[0],originalVideoPlaybackClaimed:false,
        physicalAndroidPerformanceMeasured:false,
        sameWorldHardLawRetained:true
      },null,2));
      process.exit(0);
    }
  }
}

if(experienceChanges.length===0){
  console.log(JSON.stringify({schema:'H_EARTH_EXPERIENCE_ANCHOR_GATE_RECEIPT_v1',result:'PASS',reason:'NO_EXPERIENCE_SURFACE_CHANGE',anchorSha256:anchor.sourceVideo.sha256,changedPathCount:changed.length,nonExperienceHEarthShowroomPrefixes:NON_EXPERIENCE_H_EARTH_SHOWROOM_PREFIXES,nonExperienceAudraliaPrefixes:NON_EXPERIENCE_AUDRALIA_PREFIXES},null,2));
  process.exit(0);
}

const receiptChanges=changed.filter(p=>p.startsWith(RECEIPT_PREFIX)&&p.endsWith('.json')).sort();
if(receiptChanges.length===0)fail('EXPERIENCE_CHANGE_WITHOUT_ANCHOR_RECEIPT');
const receipt=readJson(receiptChanges.at(-1));
if(receipt.schema!=='H_EARTH_EXPERIENCE_ANCHOR_ACCEPTANCE_RECEIPT_v1')fail('RECEIPT_SCHEMA_INVALID');
if(receipt.anchorId!==anchor.anchorId||receipt.anchorSha256!==anchor.sourceVideo.sha256)fail('RECEIPT_ANCHOR_IDENTITY_MISMATCH');
if(receipt.reviewedAgainstAnchor!==true)fail('ANCHOR_REVIEW_NOT_CONFIRMED');
if(receipt.disposition!=='PASS')fail('ANCHOR_ACCEPTANCE_NOT_PASS');
for(const k of ['visualEvidence','interactionEvidence','continuityEvidence'])if(!Array.isArray(receipt[k])||receipt[k].length===0)fail(`${k.toUpperCase()}_MISSING`);
for(const evidencePath of [...receipt.visualEvidence,...receipt.interactionEvidence,...receipt.continuityEvidence])if(typeof evidencePath!=='string'||!exists(evidencePath))fail(`EVIDENCE_PATH_MISSING:${evidencePath}`);

const invariantMap=receipt.invariants||{};
for(const invariant of anchor.requiredInvariants)if(invariantMap[invariant]!==true)fail(`INVARIANT_NOT_PASS:${invariant}`);

if(!Array.isArray(receipt.experienceFiles)||receipt.experienceFiles.length!==experienceChanges.length)fail('EXPERIENCE_FILE_SET_MISMATCH');
const receiptPaths=receipt.experienceFiles.map(x=>x.path).sort();
if(JSON.stringify(receiptPaths)!==JSON.stringify(experienceChanges))fail('EXPERIENCE_FILE_PATHS_MISMATCH');
for(const item of receipt.experienceFiles){
  if(!exists(item.path))fail(`EXPERIENCE_FILE_MISSING:${item.path}`);
  const observed=sha256(fs.readFileSync(path.join(ROOT,item.path)));
  if(item.sha256!==observed)fail(`EXPERIENCE_FILE_DIGEST_MISMATCH:${item.path}`);
}

console.log(JSON.stringify({
  schema:'H_EARTH_EXPERIENCE_ANCHOR_GATE_RECEIPT_v1',
  result:'PASS',
  reason:'HARD_ANCHOR_ACCEPTANCE_SATISFIED',
  anchorId:anchor.anchorId,
  anchorSha256:anchor.sourceVideo.sha256,
  experienceChangeCount:experienceChanges.length,
  receipt:receiptChanges.at(-1),
  sameWorldContinuityRequired:true,
  differentProductExperienceForbidden:true
},null,2));