#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd();
const objectPath='showroom/globe/h-earth/awards/living-objects/coherence-cycle-c.mjs';
const ledgerPath='showroom/globe/h-earth/awards/qualification/awards-living-object-cycle-ledger.v1.json';
const sourcePath='products/coherence-diagnostic/index.html';
const expectedSourceBlob='b0785f36d913c286dc19e042f33ea91afcd166bc';

const fail=(code,detail='')=>{throw new Error(`${code}${detail?':'+detail:''}`)};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const gitBlobSha=text=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');
const requireLiteral=(text,literal,code)=>{if(!text.includes(literal))fail(code,literal)};

const object=read(objectPath);
const ledger=JSON.parse(read(ledgerPath));
const source=read(sourcePath);

if(gitBlobSha(source)!==expectedSourceBlob)fail('COHERENCE_SOURCE_BINDING_FAILURE',gitBlobSha(source));

for(const literal of [
  'Calibrate self → align teams → stabilize scale.',
  'No receipts means no upgrade.',
  'same receipts → same result',
  'proceed, hold, or contain',
  'Scale amplifies error.'
]) requireLiteral(source,literal,'COHERENCE_SOURCE_SEMANTIC_MISSING');

for(const literal of [
  "cycle: 'C_COHERENCE'",
  "blob: 'b0785f36d913c286dc19e042f33ea91afcd166bc'",
  "actionClasses: Object.freeze(['PROCEED','HOLD','CONTAIN'])",
  "dimensions: Object.freeze(['SCOPE','RECEIPTS','RULES','SCALE'])",
  'numericScoreAuthorized: false',
  "coherenceIndexMeaning: 'QUALITATIVE_SOURCE_BOUND_ALIGNMENT_INDEX'",
  "scoreMeaning: 'BOUNDED_ACTION_CLASSIFICATION_NOT_A_NUMERIC_EFFICACY_SCORE'",
  "'REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'",
  "if(reduced){phase('equivalent');return stable()}",
  'webglContexts:0',
  'numericScore:false'
]) requireLiteral(object,literal,'COHERENCE_OBJECT_CONTRACT_FAILURE');

for(const forbidden of [
  'percent',
  'accuracy',
  'probability',
  'confidence score',
  'scientifically proven',
  'efficacy score'
]){
  if(object.toLowerCase().includes(forbidden))fail('CLAIM_INFLATION',forbidden);
}

if(ledger.schema!=='AWARDS_LIVING_OBJECT_CYCLE_LEDGER_v1')fail('LEDGER_SCHEMA_FAILURE');
if(ledger.operationId!=='AWARDS_LIVING_OBJECT_COHERENCE_CYCLE_C_RECONSTRUCT_20260911_006')fail('LEDGER_OPERATION_ID_FAILURE');
if(ledger.lockGeneration!==2106)fail('LEDGER_GENERATION_FAILURE');
if(ledger.governingHead!=='0c00c49f678c1ea6f597e864ca08d538dc05b274')fail('LEDGER_GOVERNING_HEAD_FAILURE');
if(ledger.predecessorHead!=='18b0449b366adb5dd00a2fb9ee6682621e1af695')fail('LEDGER_PREDECESSOR_FAILURE');

const A=ledger.cycles?.A_EXPERIENCE;
const B=ledger.cycles?.B_WORLD;
const C=ledger.cycles?.C_COHERENCE;
const D=ledger.cycles?.D_TRUST;
const E=ledger.cycles?.E_ESTATE;
const F=ledger.cycles?.F_SHARED_COMPOSITION;

if(A?.status!=='PASS_CLOSED' || A?.candidateCommit!=='55eef607570f576bff89fa84401140b678ca2568')fail('A_OR_B_STATE_DRIFT','A');
if(A?.sourceBinding?.compassController!=='568a6b2cd608a4cbcd62cf70ed59b241c39c90d2')fail('A_OR_B_STATE_DRIFT','A_SOURCE');
if(B?.status!=='PASS_CLOSED' || B?.candidateCommit!=='8ecf1492c03c92ea13bff7cc63e6fef4d9775f03')fail('A_OR_B_STATE_DRIFT','B');
if(B?.objectBlob!=='d0e6238befcfd06dc7abc0fce91605b85a8846d2')fail('A_OR_B_STATE_DRIFT','B_OBJECT');
if(C?.status!=='PASS_CLOSED')fail('CYCLE_C_EXACT_QUALIFICATION_HELD');
if(C?.sourceBinding?.coherenceDiagnosticBlob!==expectedSourceBlob)fail('COHERENCE_SOURCE_BINDING_FAILURE','LEDGER');
if(C?.semanticBinding?.numericScoreAuthorized!==false)fail('COHERENCE_INDEX_OR_SCORE_SEMANTIC_DRIFT','NUMERIC_SCORE');
if(JSON.stringify(C?.semanticBinding?.actionClasses)!==JSON.stringify(['PROCEED','HOLD','CONTAIN']))fail('COHERENCE_INDEX_OR_SCORE_SEMANTIC_DRIFT','ACTION_CLASSES');
if(JSON.stringify(C?.semanticBinding?.dimensions)!==JSON.stringify(['SCOPE','RECEIPTS','RULES','SCALE']))fail('COHERENCE_INDEX_OR_SCORE_SEMANTIC_DRIFT','DIMENSIONS');
if(D?.status!=='NOT_STARTED' || E?.status!=='NOT_STARTED' || F?.status!=='NOT_STARTED')fail('PREMATURE_LATER_CYCLE_ACTIVATION');
if(ledger.invariants?.coherenceDiagnosticProductMutationAuthorized!==false)fail('MUTATION_BOUNDARY_FAILURE','SOURCE_PRODUCT');
if(ledger.invariants?.numericCoherenceScoreClaimAuthorized!==false)fail('CLAIM_INFLATION','NUMERIC_SCORE_AUTHORITY');
if(ledger.invariants?.deploymentPublicationAuthorized!==false)fail('AUTHORITY_WIDENING','PUBLICATION');

const receipt={
  schema:'CYCLE_C_QUALIFICATION_RECEIPT_v1',
  result:'PASS_CLOSED',
  operationId:ledger.operationId,
  lockGeneration:ledger.lockGeneration,
  sourceBlob:expectedSourceBlob,
  checks:{
    sourceBinding:'PASS',
    coherenceIndexSemantics:'PASS',
    scoreSemantics:'PASS_BOUNDED_NON_NUMERIC',
    lifecycleEquivalence:'PASS',
    reducedMotionEquivalence:'PASS',
    claimInflation:'NONE',
    priorCyclesUnchanged:'PASS',
    laterCyclesNotStarted:'PASS'
  }
};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
