#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

const CONTRACT='.github/ai-router/accessibility-runtime-evidence/public-executor-contract.v1.json';
const EXECUTOR='tools/accessibility-runtime-evidence/public-accessibility-runtime-evidence.v1.mjs';
const cText=fs.readFileSync(CONTRACT,'utf8');
const c=JSON.parse(cText);
const e=fs.readFileSync(EXECUTOR,'utf8');
const hash=s=>crypto.createHash('sha256').update(Buffer.from(s,'utf8')).digest('hex');
const checks=[];const test=(id,pass)=>checks.push({id,pass:Boolean(pass)});

test('CONTRACT_SCHEMA',c.schema==='PUBLIC_ACCESSIBILITY_RUNTIME_EVIDENCE_EXECUTOR_CONTRACT_v1');
test('GEN1472_BOUND',c.operationId==='PUBLIC_ACCESSIBILITY_RUNTIME_EVIDENCE_EXECUTOR_20260814_001'&&c.lockGeneration===1472&&c.governingHead==='7917ecb7b07a32e8a653a6e1534397b232cccd6b');
test('EXACT_SHA_ONLY',c.input?.movingRefsAccepted===false&&c.input?.candidateShaPattern==='^[0-9a-f]{40}$');
test('REAL_BROWSER',c.execution?.browser==='PLAYWRIGHT_CHROMIUM');
test('AXE',c.execution?.accessibilityEngine==='AXE_CORE_PLAYWRIGHT');
test('AX_TREE',c.execution?.accessibilityTree==='CHROMIUM_CDP_ACCESSIBILITY_GET_FULL_AX_TREE');
test('FAILURE_CLASSES',['PRODUCT_FAILURE','INSTRUMENT_FAILURE','EVIDENCE_INCOMPLETE','GOVERNANCE_AUTHORITY_FAILURE'].every(x=>c.failureClasses?.includes(x)));
test('PRIVATE_AUTHORITY_PRESERVED',c.authorityBoundary?.privateQualificationAuthorityPreserved===true&&c.authorityBoundary?.evidenceProducerOnly===true);
test('NO_AUTHORITY_INFLATION',['productMutationAuthorized','repositoryMutationAuthorizedByReceipt','authorityCreationAuthorized','mergeAuthorized','deploymentAuthorized','promotionAuthorized','ownerAcceptanceCreated'].every(k=>c.authorityBoundary?.[k]===false));
test('NO_CROSS_SHA_TRANSFER',c.continuityLaw?.priorExactShaEvidenceTransfersToChangedCandidate===false&&c.continuityLaw?.changedCandidateRequiresNewSha===true);
test('FROZEN_COMPASS_CALIBRATION',c.firstCalibration?.candidateSha==='69f7be45f45933676fe4024ca95c926f5ebc6bfc'&&c.firstCalibration?.entryPath==='/index.html');
for(const token of ["from 'playwright'","from '@axe-core/playwright'",'Accessibility.getFullAXTree','PRODUCT_FAILURE','INSTRUMENT_FAILURE','EVIDENCE_INCOMPLETE','GOVERNANCE_AUTHORITY_FAILURE','privateQualificationAuthorityPreserved:true','productMutationAuthorized:false','mergeAuthorized:false','priorExactShaEvidenceTransfersToChangedCandidate:false'])test('EXECUTOR_TOKEN:'+token,e.includes(token));
for(const token of ['git push','git commit','merge_pull_request','productMutationAuthorized:true','mergeAuthorized:true','deploymentAuthorized:true'])test('PROHIBITED_TOKEN_ABSENT:'+token,!e.includes(token));
const result=checks.every(x=>x.pass)?'PASS_CLOSED':'FAIL_CLOSED';
const receipt={schema:'PUBLIC_ACCESSIBILITY_RUNTIME_EVIDENCE_EXECUTOR_SELF_TEST_RECEIPT_v1',result,operationId:c.operationId,lockGeneration:c.lockGeneration,contractDigest:hash(cText),executorDigest:hash(e),checkCount:checks.length,passCount:checks.filter(x=>x.pass).length,checks,productMutationAuthorized:false,mergeAuthorized:false,privateQualificationAuthorityPreserved:true};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(result!=='PASS_CLOSED')process.exit(2);
