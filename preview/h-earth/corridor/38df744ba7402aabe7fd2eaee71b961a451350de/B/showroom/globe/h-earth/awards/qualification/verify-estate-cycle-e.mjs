#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd();
const objectPath='showroom/globe/h-earth/awards/living-objects/estate-cycle-e.mjs';
const ledgerPath='showroom/globe/h-earth/awards/qualification/awards-living-object-cycle-ledger.v1.json';
const sources=Object.freeze({
  'index.html':'3a684cf4f4aedcfa2c76fa2686fb4c733d5903bb',
  'showroom/globe/h-earth/index.html':'f4fa5df980c639184352d978909532dc8f1bcbd8',
  'characters/index.html':'6bebd977905ec9c9d7b717a4ea4305688e82aa03',
  'products/coherence-diagnostic/index.html':'b0785f36d913c286dc19e042f33ea91afcd166bc',
  'laws/index.html':'d6de5558a6ba38e66ad6284a80c03de67682628b',
  'governance/index.html':'9b216d8f86e5dbc76794ab01ce967d3e9357ef21'
});
const fail=(code,detail='')=>{throw new Error(`${code}${detail?':'+detail:''}`)};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const gitBlobSha=text=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');
const requireLiteral=(text,literal,code)=>{if(!text.includes(literal))fail(code,literal)};

for(const [p,sha] of Object.entries(sources)){
  const actual=gitBlobSha(read(p));
  if(actual!==sha)fail('ESTATE_SOURCE_BINDING_FAILURE',`${p}:${actual}`);
}

const object=read(objectPath);
const ledger=JSON.parse(read(ledgerPath));
for(const literal of [
  "cycle:'E_ESTATE'",
  "claim:'The surprise is not one feature. It is that the pieces belong together.'",
  "relationIsClaim:true",
  "identicalMaturityImplied:false",
  "identicalAuthorityImplied:false",
  "completionEquivalenceImplied:false",
  "sourceMutationAuthorized:false",
  "webglContexts:0",
  "'REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'",
  "root.dataset.relationship='BELONGING_VISIBLE'",
  "root.dataset.configuration='CONSTELLATION_CONVERGED'",
  "root.dataset.motionEquivalent='RELATIONSHIP_REVEALED_WITHOUT_TRANSIT'"
])requireLiteral(object,literal,'ESTATE_OBJECT_CONTRACT_FAILURE');

for(const id of ['COMPASS','H_EARTH','CHARACTERS','COHERENCE','LAWS','GOVERNANCE']) requireLiteral(object,`id:'${id}'`,'ESTATE_NODE_MISSING');
for(const role of ['ORIENTATION','WORLD','ENCOUNTER','INSPECTION','CONSTRAINT','AUTHORIZATION']) requireLiteral(object,`role:'${role}'`,'ESTATE_ROLE_MISSING');
for(const relation of ['ORIENTS_TO','INSPECTS_WITHIN','CONSTRAINS_WITHIN','BOUNDS_CLAIMS_FOR','SHARES_ESTATE_WITH']) requireLiteral(object,`kind:'${relation}'`,'ESTATE_RELATION_MISSING');

if(ledger.schema!=='AWARDS_LIVING_OBJECT_CYCLE_LEDGER_v1')fail('LEDGER_SCHEMA_FAILURE');
if(ledger.operationId!=='AWARDS_LIVING_OBJECT_ESTATE_CYCLE_E_20260911_001')fail('LEDGER_OPERATION_ID_FAILURE');
if(ledger.lockGeneration!==2119)fail('LEDGER_GENERATION_FAILURE');
if(ledger.governingHead!=='e764b8ea37a7ed6c3f0a2c5be5d4be520db489f4')fail('LEDGER_GOVERNING_HEAD_FAILURE');
const A=ledger.cycles?.A_EXPERIENCE,B=ledger.cycles?.B_WORLD,C=ledger.cycles?.C_COHERENCE,D=ledger.cycles?.D_TRUST,E=ledger.cycles?.E_ESTATE,F=ledger.cycles?.F_SHARED_COMPOSITION;
if(A?.status!=='PASS_CLOSED'||A?.candidateCommit!=='55eef607570f576bff89fa84401140b678ca2568')fail('PRIOR_CYCLE_DRIFT','A');
if(B?.status!=='PASS_CLOSED'||B?.candidateCommit!=='8ecf1492c03c92ea13bff7cc63e6fef4d9775f03'||B?.objectBlob!=='d0e6238befcfd06dc7abc0fce91605b85a8846d2')fail('PRIOR_CYCLE_DRIFT','B');
if(C?.status!=='PASS_CLOSED'||C?.sourceBinding?.coherenceDiagnosticBlob!=='b0785f36d913c286dc19e042f33ea91afcd166bc'||C?.semanticBinding?.numericScoreAuthorized!==false)fail('PRIOR_CYCLE_DRIFT','C');
if(D?.status!=='PASS_CLOSED'||D?.semanticBinding?.executionImpliesSuccess!==false||D?.semanticBinding?.executionImpliesClaimAuthority!==false)fail('PRIOR_CYCLE_DRIFT','D');
if(E?.status!=='PASS_CLOSED')fail('CYCLE_E_EXACT_QUALIFICATION_HELD');
if(E?.claim!=='The surprise is not one feature. It is that the pieces belong together.')fail('ESTATE_CLAIM_DRIFT');
if(E?.semanticBinding?.relationIsClaim!==true)fail('ESTATE_RELATION_SEMANTIC_FAILURE');
if(E?.semanticBinding?.identicalMaturityImplied!==false||E?.semanticBinding?.identicalAuthorityImplied!==false||E?.semanticBinding?.completionEquivalenceImplied!==false)fail('ESTATE_AUTHORITY_FLATTENING');
if(!Array.isArray(E?.semanticBinding?.estateElements)||E.semanticBinding.estateElements.length<5)fail('ESTATE_ELEMENT_COUNT_FAILURE');
if(!Array.isArray(E?.semanticBinding?.relationKinds)||E.semanticBinding.relationKinds.length<4)fail('ESTATE_RELATION_GRAPH_FAILURE');
for(const [key,sha] of Object.entries({compassBlob:sources['index.html'],hEarthBlob:sources['showroom/globe/h-earth/index.html'],charactersBlob:sources['characters/index.html'],coherenceBlob:sources['products/coherence-diagnostic/index.html'],lawsBlob:sources['laws/index.html'],governanceBlob:sources['governance/index.html']})){
  if(E?.sourceBinding?.[key]!==sha)fail('ESTATE_SOURCE_BINDING_FAILURE',key);
}
if(F?.status!=='NOT_STARTED')fail('PREMATURE_CYCLE_F_ACTIVATION');
if(ledger.invariants?.priorClosedCyclesReadOnly!==true)fail('PRIOR_CYCLE_AUTHORITY_DRIFT');
if(ledger.invariants?.estateSourceMutationAuthorized!==false||ledger.invariants?.estateEqualMaturityClaimAuthorized!==false||ledger.invariants?.estateEqualAuthorityClaimAuthorized!==false)fail('ESTATE_AUTHORITY_WIDENING');
if(ledger.invariants?.deploymentPublicationAuthorized!==false)fail('AUTHORITY_WIDENING','PUBLICATION');

const receipt={schema:'CYCLE_E_QUALIFICATION_RECEIPT_v1',result:'PASS_CLOSED',operationId:ledger.operationId,lockGeneration:ledger.lockGeneration,checks:{sourceBindings:'PASS',estateElementCount:'PASS',relationGraph:'PASS',distinctRoles:'PASS',distinctAuthorityAndMaturity:'PASS',noCompletionEquivalence:'PASS',lifecycleEquivalence:'PASS',reducedMotionEquivalence:'PASS',lightweightZeroWebgl:'PASS',priorCyclesUnchanged:'PASS',cycleFNotStarted:'PASS',authorityWidening:'NONE'}};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
