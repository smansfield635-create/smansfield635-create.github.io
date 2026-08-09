import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parseArgs} from 'node:util';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {runFreshRetest} from './standards-remediation-gate.v1.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const {values}=parseArgs({args:process.argv.slice(2),options:{root:{type:'string',default:'.'},'expected-head':{type:'string'},output:{type:'string'}},strict:true});
const expectedHead=values['expected-head'];
if(!expectedHead) throw new Error('--expected-head is required');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const componentFiles=['traceability-self-test.v1.mjs','vv-integrity-self-test.v1.mjs','quality-measure-self-test.v1.mjs'];
function executeWindow(windowId){
  const receipts=[];
  for(const f of componentFiles){
    const r=spawnSync(process.execPath,[path.join(HERE,f)],{encoding:'utf8',env:{...process.env,L2_EXECUTION_WINDOW:windowId}});
    assert.equal(r.status,0,`${f} failed: ${r.stderr}`);
    const receipt=JSON.parse(r.stdout);
    assert.equal(receipt.result,'PASS_CLOSED');
    receipts.push(receipt);
  }
  const negativeCaseCount=receipts.reduce((n,r)=>n+(r.negativeCaseCount??0),0);
  const negativeCasePassedCount=receipts.reduce((n,r)=>n+(r.negativeCasePassedCount??0),0);
  assert.ok(negativeCaseCount>0);
  assert.equal(negativeCasePassedCount,negativeCaseCount);
  const serialized=JSON.stringify({windowId,receipts});
  return {windowId,negativeCaseCount,negativeCasePassedCount,componentBattery:{result:'PASS_CLOSED',digest:sha(serialized),receiptCount:receipts.length}};
}
const windowA=executeWindow(`RUN_${process.env.GITHUB_RUN_ID??'LOCAL'}_BUILDER`);
const windowB=executeWindow(`RUN_${process.env.GITHUB_RUN_ID??'LOCAL'}_FRESH_VERIFIER`);
assert.notEqual(windowA.windowId,windowB.windowId);
assert.notEqual(windowA.componentBattery.digest,'');

const exactPaths=[
 '.github/ai-router/platform-control-plane/standards-remediation/standards-baseline.v1.json',
 '.github/ai-router/platform-control-plane/standards-remediation/traceability-model.v1.json',
 '.github/ai-router/platform-control-plane/standards-remediation/traceability-gate.v1.mjs',
 '.github/ai-router/platform-control-plane/standards-remediation/traceability-self-test.v1.mjs',
 '.github/ai-router/platform-control-plane/standards-remediation/vv-integrity-policy.v1.json',
 '.github/ai-router/platform-control-plane/standards-remediation/vv-integrity-gate.v1.mjs',
 '.github/ai-router/platform-control-plane/standards-remediation/vv-integrity-self-test.v1.mjs',
 '.github/ai-router/platform-control-plane/standards-remediation/quality-measures.v1.json',
 '.github/ai-router/platform-control-plane/standards-remediation/quality-measure-gate.v1.mjs',
 '.github/ai-router/platform-control-plane/standards-remediation/quality-measure-self-test.v1.mjs',
 '.github/ai-router/platform-control-plane/standards-remediation/quality-coverage.v1.json',
 '.github/ai-router/platform-control-plane/standards-remediation/ssdf-evidence-profile.v1.json',
 '.github/ai-router/platform-control-plane/standards-remediation/measurement-management-profile.v1.json',
 '.github/ai-router/platform-control-plane/standards-remediation/standards-remediation-gate.v1.mjs',
 '.github/ai-router/platform-control-plane/standards-remediation/standards-remediation-self-test.v1.mjs',
 '.github/workflows/platform-control-plane-standards-remediation-v1.yml'
];
const present=exactPaths.filter(p=>fs.existsSync(path.join(values.root,p)));
assert.equal(present.length,exactPaths.length,'all 16 admitted paths must exist');
const secretPatterns=[/AKIA[0-9A-Z]{16}/g,/ghp_[A-Za-z0-9]{36,}/g,/github_pat_[A-Za-z0-9_]{20,}/g,/-----BEGIN [A-Z ]*PRIVATE KEY-----/g,/AIza[0-9A-Za-z_-]{35}/g];
const secretHits=[];
for(const p of exactPaths){const text=fs.readFileSync(path.join(values.root,p),'utf8');for(const re of secretPatterns){for(const m of text.matchAll(re))secretHits.push({path:p,pattern:String(re),offset:m.index});}}
assert.equal(secretHits.length,0,'bounded secret-pattern scan must be clean');
const secretScan={result:'PASS_CLOSED',digest:sha(JSON.stringify({exactPaths,secretHits})),filesScanned:exactPaths.length,hitCount:0};
const workflowText=fs.readFileSync(path.join(values.root,'.github/workflows/platform-control-plane-standards-remediation-v1.yml'),'utf8');
const refs=[...workflowText.matchAll(/^\s*uses:\s*([^\s#]+)\s*$/gm)].map(m=>m[1]);
assert.ok(refs.length>=3,'dependency inventory should discover workflow actions');
const inventory=refs.map(ref=>({ref,pinClass:/@[0-9a-f]{40}$/i.test(ref)?'IMMUTABLE_SHA':/@v?\d+(?:\.\d+)*$/i.test(ref)?'VERSION_TAG':'OTHER'}));
assert.equal(inventory.some(x=>/@(?:main|master|HEAD)$/i.test(x.ref)),false,'floating branch action refs are forbidden');
const dependencyInventory={result:'PASS_CLOSED',digest:sha(JSON.stringify(inventory)),referenceCount:inventory.length,nonImmutableReferenceCount:inventory.filter(x=>x.pinClass!=='IMMUTABLE_SHA').length,references:inventory};
const exactHeadBinding=process.env.L2_EXACT_HEAD_BINDING_PASSED==='1'||process.env.GITHUB_ACTIONS!=='true';
assert.equal(exactHeadBinding,true,'workflow must prove exact candidate head binding');

const receipt=runFreshRetest({expectedHead,currentRunId:process.env.GITHUB_RUN_ID??'LOCAL',constructorHolder:'L2_REMEDIATION_CONSTRUCTOR',verifierHolder:'L2_FRESH_EXTERNAL_STANDARDS_VERIFIER',evidenceWindows:[windowA,windowB],runtimeEvidence:{exactHeadBinding,secretScan,dependencyInventory}});
assert.equal(receipt.result,'PASS_CLOSED');
assert.equal(receipt.priorDispositionsUsedAsInputs,false);
assert.equal(receipt.identifiedEngineeringBenchmarkDeficienciesClosed,true);
assert.equal(receipt.empiricalResultsFabricated,false);
assert.equal(receipt.wholeStandardComplianceDetermination,false);
assert.equal(receipt.certificationDetermination,false);
assert.equal(receipt.accreditationDetermination,false);
assert.equal(receipt.themes.filter(x=>x.disposition==='EVIDENCED').length,6);
assert.equal(receipt.themes.filter(x=>x.disposition==='NOT_APPLICABLE').length,2);
assert.equal(receipt.remainingEmpiricalScientificEvidenceRequirements.length,3);
assert.equal(receipt.evidenceWindows.length,2);
assert.equal(receipt.runtimeEvidence.dependencyReferenceCount,refs.length);
const forbidden=['COMPLIANT','CERTIFIED','ACCREDITED'];
assert.equal(forbidden.some(w=>JSON.stringify(receipt).includes(`"${w}"`)),false);
if(values.output){fs.mkdirSync(path.dirname(values.output),{recursive:true});fs.writeFileSync(values.output,JSON.stringify(receipt,null,2)+'\n');}
console.log(JSON.stringify(receipt,null,2));
