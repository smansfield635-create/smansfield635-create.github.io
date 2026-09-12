#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd();
const objectPath='showroom/globe/h-earth/awards/living-objects/trust-cycle-d.mjs';
const ledgerPath='showroom/globe/h-earth/awards/qualification/awards-living-object-cycle-ledger.v1.json';
const sources=Object.freeze({
  'governance/index.html':'9b216d8f86e5dbc76794ab01ce967d3e9357ef21',
  'governance/governance.js':'d4404826317739dca929f046c960fd5fd11f6995',
  'evidence/index.html':'69b15800b1d7ef044a1ab7e77b84861bdd81602f',
  'evidence/current-public-condition.mjs':'b2d4231a984da4579ad71528dd1276df023fd1aa'
});
const fail=(code,detail='')=>{throw new Error(`${code}${detail?':'+detail:''}`)};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const gitBlobSha=text=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');
const requireLiteral=(text,literal,code)=>{if(!text.includes(literal))fail(code,literal)};

for(const [p,sha] of Object.entries(sources)){const actual=gitBlobSha(read(p));if(actual!==sha)fail('TRUST_SOURCE_BINDING_FAILURE',`${p}:${actual}`)}
const object=read(objectPath);
const ledger=JSON.parse(read(ledgerPath));

for(const literal of [
  "cycle:'D_TRUST'",
  "claim:'Software should have to earn the right to say it worked.'",
  "authorityProgression:Object.freeze(['INTENT','EXECUTION','VERIFICATION','EVIDENCE','AUTHORIZED_CLAIM'])",
  "boundedDispositions:Object.freeze(['HOLD','DENY','FAIL_CLOSED','AUTHORIZED'])",
  'executionImpliesSuccess:false',
  'executionImpliesClaimAuthority:false',
  "authorizedClaimRequires:Object.freeze(['VERIFICATION','EVIDENCE'])",
  "rule:'NO_AUTHORIZED_CLAIM_WITHOUT_VERIFICATION_AND_EVIDENCE'",
  "'REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'",
  "if(next==='AUTHORIZED'&&step!=='AUTHORIZED_CLAIM')throw new Error('TRUST_AUTHORITY_WITHOUT_EVIDENCE')",
  "if(reduced){setStep('EXECUTION');setStep('VERIFICATION');setStep('EVIDENCE');setStep('AUTHORIZED_CLAIM');setDisposition('AUTHORIZED');stable();return t}",
  'webglContexts:0'
])requireLiteral(object,literal,'TRUST_OBJECT_CONTRACT_FAILURE');

if(ledger.schema!=='AWARDS_LIVING_OBJECT_CYCLE_LEDGER_v1')fail('LEDGER_SCHEMA_FAILURE');
if(ledger.operationId!=='AWARDS_LIVING_OBJECT_TRUST_CYCLE_D_20260911_002')fail('LEDGER_OPERATION_ID_FAILURE');
if(ledger.lockGeneration!==2112)fail('LEDGER_GENERATION_FAILURE');
if(ledger.governingHead!=='423f428f8d8a0a000de65ba792be8c6f002ce1e6')fail('LEDGER_GOVERNING_HEAD_FAILURE');
const A=ledger.cycles?.A_EXPERIENCE,B=ledger.cycles?.B_WORLD,C=ledger.cycles?.C_COHERENCE,D=ledger.cycles?.D_TRUST,E=ledger.cycles?.E_ESTATE,F=ledger.cycles?.F_SHARED_COMPOSITION;
if(A?.status!=='PASS_CLOSED'||A?.candidateCommit!=='55eef607570f576bff89fa84401140b678ca2568')fail('PRIOR_CYCLE_DRIFT','A');
if(B?.status!=='PASS_CLOSED'||B?.candidateCommit!=='8ecf1492c03c92ea13bff7cc63e6fef4d9775f03'||B?.objectBlob!=='d0e6238befcfd06dc7abc0fce91605b85a8846d2')fail('PRIOR_CYCLE_DRIFT','B');
if(C?.status!=='PASS_CLOSED'||C?.sourceBinding?.coherenceDiagnosticBlob!=='b0785f36d913c286dc19e042f33ea91afcd166bc'||C?.semanticBinding?.numericScoreAuthorized!==false)fail('PRIOR_CYCLE_DRIFT','C');
if(D?.status!=='PASS_CLOSED')fail('CYCLE_D_EXACT_QUALIFICATION_HELD');
if(D?.claim!=='Software should have to earn the right to say it worked.')fail('TRUST_CLAIM_DRIFT');
if(JSON.stringify(D?.semanticBinding?.authorityProgression)!==JSON.stringify(['INTENT','EXECUTION','VERIFICATION','EVIDENCE','AUTHORIZED_CLAIM']))fail('TRUST_PROGRESS_DRIFT');
if(JSON.stringify(D?.semanticBinding?.boundedDispositions)!==JSON.stringify(['HOLD','DENY','FAIL_CLOSED','AUTHORIZED']))fail('TRUST_DISPOSITION_DRIFT');
if(D?.semanticBinding?.executionImpliesSuccess!==false||D?.semanticBinding?.executionImpliesClaimAuthority!==false)fail('TRUST_AUTHORITY_INFLATION');
if(JSON.stringify(D?.semanticBinding?.authorizedClaimRequires)!==JSON.stringify(['VERIFICATION','EVIDENCE']))fail('TRUST_AUTHORITY_REQUIREMENT_DRIFT');
for(const [key,sha] of Object.entries({governanceIndexBlob:sources['governance/index.html'],governanceRuntimeBlob:sources['governance/governance.js'],evidenceIndexBlob:sources['evidence/index.html'],evidenceConditionBlob:sources['evidence/current-public-condition.mjs']})){if(D?.sourceBinding?.[key]!==sha)fail('TRUST_SOURCE_BINDING_FAILURE',key)}
if(E?.status!=='NOT_STARTED'||F?.status!=='NOT_STARTED')fail('PREMATURE_LATER_CYCLE_ACTIVATION');
if(ledger.invariants?.priorClosedCyclesReadOnly!==true)fail('PRIOR_CYCLE_AUTHORITY_DRIFT');
if(ledger.invariants?.trustSourceMutationAuthorized!==false||ledger.invariants?.executionAloneAuthorizesTrustClaim!==false)fail('TRUST_AUTHORITY_INFLATION');
if(ledger.invariants?.deploymentPublicationAuthorized!==false)fail('AUTHORITY_WIDENING','PUBLICATION');

const receipt={schema:'CYCLE_D_QUALIFICATION_RECEIPT_v1',result:'PASS_CLOSED',operationId:ledger.operationId,lockGeneration:ledger.lockGeneration,checks:{sourceBindings:'PASS',authorityProgression:'PASS',executionNotSuccess:'PASS',authorizedClaimRequiresVerificationAndEvidence:'PASS',boundedNegativeDispositions:'PASS',lifecycleEquivalence:'PASS',reducedMotionEquivalence:'PASS',zeroWebgl:'PASS',priorCyclesUnchanged:'PASS',laterCyclesNotStarted:'PASS',authorityWidening:'NONE'}};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
