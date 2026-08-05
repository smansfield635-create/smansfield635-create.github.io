#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function parseArgs(argv){const result={builder:null,verifier:null,output:null};for(let i=0;i<argv.length;i+=1){const token=argv[i],value=argv[i+1];if(token==='--builder'){result.builder=value;i+=1;}else if(token==='--verifier'){result.verifier=value;i+=1;}else if(token==='--output'){result.output=value;i+=1;}else throw new Error(`UNKNOWN_ARGUMENT:${token}`);}for(const key of Object.keys(result))if(!result[key])throw new Error(`MISSING_ARGUMENT:${key}`);return result;}
const args=parseArgs(process.argv.slice(2));
const builder=JSON.parse(fs.readFileSync(args.builder,'utf8'));
const verifier=JSON.parse(fs.readFileSync(args.verifier,'utf8'));
const sameSubject=builder.exactSubjectHead===verifier.exactSubjectHead;
const samePackaging=builder.packagingSuccessorHead===verifier.packagingSuccessorHead;
const sameFingerprint=builder.reproductionIdentity.normalizedFingerprint===verifier.reproductionIdentity.normalizedFingerprint;
const reproduced=sameSubject&&samePackaging&&sameFingerprint;
const hardGates={...builder.hardGateResults,INDEPENDENT_SCORE_REPRODUCTION:{result:reproduced?'PASS':'FAIL_REPAIR_REQUIRED'}};
const allHard=Object.values(hardGates).every(item=>item.result==='PASS');
const viewEligibility=allHard&&builder.viewEligibility==='USER_VISUAL_REVIEW_AUTHORIZED'&&verifier.viewEligibility==='USER_VISUAL_REVIEW_AUTHORIZED'?'USER_VISUAL_REVIEW_AUTHORIZED':'USER_VISUAL_REVIEW_WITHHELD';
const defects=[...builder.topDefects];
if(!reproduced)defects.unshift({severity:'CRITICAL',id:'INDEPENDENT_SCORE_REPRODUCTION_MISMATCH',detail:`builder=${builder.reproductionIdentity.normalizedFingerprint}; verifier=${verifier.reproductionIdentity.normalizedFingerprint}`});
const result={
 schema:'METHODS_PAGE_BLIND_BASELINE_INDEPENDENT_REPRODUCTION_RESULT_v1',
 operationId:'METHODS_PAGE_MANDATORY_EXCELLENCE_TOOLCHAIN_ACTIVATION_AND_BLIND_BASELINE_EVALUATION_v1',
 exactSubjectHead:builder.exactSubjectHead,
 instrumentVersions:builder.instrumentVersions,
 hardGateResults:hardGates,
 sevenDomainScores:builder.sevenDomainScores,
 totalScore:builder.totalScore,
 topDefects:defects.slice(0,10),
 reproductionIdentities:{builder:builder.reproductionIdentity,verifier:verifier.reproductionIdentity,exactNormalizedEquality:reproduced},
 viewEligibility,
 recommendedDisposition:viewEligibility==='USER_VISUAL_REVIEW_AUTHORIZED'?builder.recommendedDisposition:'FAIL_CLOSED_OR_REMEDIATION_HOLD',
 userVisualInspection:'WITHHELD_UNLESS_VIEW_ELIGIBLE',
 screenshotsIncluded:false,
 resultFingerprint:crypto.createHash('sha256').update(JSON.stringify({subject:builder.exactSubjectHead,hardGates,scores:builder.sevenDomainScores,total:builder.totalScore,viewEligibility})).digest('hex')
};
fs.mkdirSync(path.dirname(args.output),{recursive:true});fs.writeFileSync(args.output,`${JSON.stringify(result,null,2)}\n`);process.stdout.write(`${JSON.stringify(result,null,2)}\n`);if(!reproduced)process.exitCode=1;
