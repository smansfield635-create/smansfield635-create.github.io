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
  if(p.startsWith('showroom/globe/h-earth/'))return true;
  if(p.startsWith('showroom/globe/audralia/'))return true;
  return p.startsWith('h-earth-3d/')&&!NON_EXPERIENCE_H_EARTH_PREFIXES.some(prefix=>p.startsWith(prefix));
};

const experienceChanges=changed.filter(isExperiencePath).sort();
if(experienceChanges.length===0){
  console.log(JSON.stringify({schema:'H_EARTH_EXPERIENCE_ANCHOR_GATE_RECEIPT_v1',result:'PASS',reason:'NO_EXPERIENCE_SURFACE_CHANGE',anchorSha256:anchor.sourceVideo.sha256,changedPathCount:changed.length},null,2));
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

// CONSTRUCTOR_TRIGGER_CHILD_ONLY: this branch exists solely to emit a pull_request event against the admitted operation branch.