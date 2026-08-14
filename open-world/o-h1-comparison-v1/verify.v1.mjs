#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const fail=m=>{console.error(m);process.exit(1)};
const s=read('./source-bindings.v1.json'),f=read('./findings.v1.json'),p=read('./construction-procedure.v1.json');
const allowed=new Set(['CANONICAL_TRUTH','REPRESENTATION_ADVANTAGE','VALID_LOD_DIFFERENCE','DEFECT']);
if(s.schema!=='OPEN_WORLD_O_H1_SOURCE_BINDINGS_v1')fail('SOURCE_BINDINGS_SCHEMA');
if(f.schema!=='OPEN_WORLD_O_H1_COMPARISON_FINDINGS_v1')fail('FINDINGS_SCHEMA');
if(p.schema!=='OPEN_WORLD_O_H1_COMPARISON_CONSTRUCTION_PROCEDURE_v1')fail('PROCEDURE_SCHEMA');
if(s.operationId!==f.operationId||s.operationId!==p.operationId)fail('OPERATION_IDENTITY_MISMATCH');
if(s.classificationVocabulary.length!==4||s.classificationVocabulary.some(x=>!allowed.has(x)))fail('CLASSIFICATION_VOCABULARY_MISMATCH');
if(!Array.isArray(f.findings)||!f.findings.length)fail('FINDINGS_EMPTY');
for(const x of f.findings){if(!allowed.has(x.classification))fail(`CLASS_OUTSIDE_VOCABULARY:${x.id}`);if(!Array.isArray(x.evidence)||!x.evidence.length)fail(`UNATTRIBUTED_FINDING:${x.id}`);for(const e of x.evidence)if(!/@[0-9a-f]{40}$/.test(e))fail(`EVIDENCE_IDENTITY_INVALID:${x.id}`)}
if(f.defectDisposition.establishedDefectCount!==0)fail('UNSUPPORTED_DEFECT_COUNT');
if(Object.values(s.authorityEffects).some(Boolean)||Object.values(p.authority).some(Boolean))fail('AUTHORITY_LEAK');
const expected=['open-world/o-h1-comparison-v1/source-bindings.v1.json','open-world/o-h1-comparison-v1/findings.v1.json','open-world/o-h1-comparison-v1/construction-procedure.v1.json','open-world/o-h1-comparison-v1/verify.v1.mjs'];
if(JSON.stringify(p.allowedPaths)!==JSON.stringify(expected))fail('PATH_BOUNDARY_MISMATCH');
console.log(JSON.stringify({schema:'OPEN_WORLD_O_H1_COMPARISON_RECEIPT_v1',result:'PASS_CLOSED',operationId:s.operationId,findingCount:f.findings.length,establishedDefectCount:f.defectDisposition.establishedDefectCount,classificationVocabulary:s.classificationVocabulary,productAuthorityCreated:false,canonicalAuthorityCreated:false,implementationAuthorityTransferred:false,fingerprint:crypto.createHash('sha256').update(JSON.stringify({s,f,p})).digest('hex')},null,2));
