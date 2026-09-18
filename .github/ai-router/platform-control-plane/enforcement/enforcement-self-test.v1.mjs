#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateEnforcementShadow, REQUEST_SCHEMA } from './enforcement-shadow-gate.v1.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));const policy=JSON.parse(fs.readFileSync(path.join(here,'enforcement-policy.v1.json'),'utf8'));
const compliant={schema:REQUEST_SCHEMA,repository:'smansfield635-create/smansfield635-create.github.io',branch:'main',proposedAction:'MERGE',observedPerimeter:{branchProtected:true,pullRequestRequired:true,directPushAllowed:false,requiredChecks:['L2 Platform Control Plane / verify']},exactHeadEvidenceValid:true,explicitMergeAuthority:true,bypassRequested:false,liveActivationRequested:false};
const allow=evaluateEnforcementShadow(compliant,policy);assert.equal(allow.result,'SHADOW_ALLOW');assert.equal(allow.enforcementApplied,false);assert.equal(allow.authorityCreated,false);
const currentGap=evaluateEnforcementShadow({...compliant,proposedAction:'EVALUATE_ONLY',explicitMergeAuthority:false,observedPerimeter:{branchProtected:false,pullRequestRequired:false,directPushAllowed:true,requiredChecks:[]}},policy);assert.equal(currentGap.result,'SHADOW_DENY');assert.ok(currentGap.violations.includes('BRANCH_PROTECTION_MISSING'));assert.ok(currentGap.violations.some(v=>v.startsWith('REQUIRED_CHECK_MISSING:')));
const noMergeAuth=evaluateEnforcementShadow({...compliant,explicitMergeAuthority:false},policy);assert.equal(noMergeAuth.result,'SHADOW_DENY');assert.ok(noMergeAuth.violations.includes('EXPLICIT_MERGE_AUTHORITY_MISSING'));
const bypass=evaluateEnforcementShadow({...compliant,bypassRequested:true},policy);assert.equal(bypass.result,'SHADOW_DENY');
const activation=evaluateEnforcementShadow({...compliant,liveActivationRequested:true},policy);assert.equal(activation.result,'FAIL_CLOSED');assert.equal(activation.errorCode,'LIVE_ACTIVATION_FORBIDDEN');
const badPolicy=evaluateEnforcementShadow(compliant,{...policy,mode:'ENFORCE'});assert.equal(badPolicy.result,'FAIL_CLOSED');assert.equal(badPolicy.errorCode,'ENFORCEMENT_POLICY_INVALID');
const result={schema:'L2_ENFORCEMENT_SHADOW_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',tests:['COMPLIANT_SHADOW_ALLOW','CURRENT_UNPROTECTED_STYLE_GAP_SHADOW_DENY','MISSING_MERGE_AUTHORITY_DENY','BYPASS_DENY','LIVE_ACTIVATION_FAIL_CLOSED','NON_SHADOW_POLICY_FAIL_CLOSED'],liveActivationPerformed:false,repositorySettingsMutated:false,authorityCreated:false};const i=process.argv.indexOf('--output');if(i>=0&&process.argv[i+1])fs.writeFileSync(process.argv[i+1],JSON.stringify(result,null,2)+'\n');process.stdout.write(JSON.stringify(result)+'\n');
