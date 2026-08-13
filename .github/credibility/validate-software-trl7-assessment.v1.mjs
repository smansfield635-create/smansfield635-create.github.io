import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
const root=process.cwd();
const assessmentPath=path.join(root,'assets/credibility/software-trl7-assessment.v1.json');
const readinessPath=path.join(root,'evidence/readiness/index.html');
const presentationPath=path.join(root,'assets/credibility/trl7-presentation.v1.js');
const claimsPath=path.join(root,'assets/credibility/claims.v1.json');
const failures=[],passes=[];
const check=(ok,id,msg)=>(ok?passes:failures).push({id,msg});
for(const p of [assessmentPath,readinessPath,presentationPath,claimsPath])check(fs.existsSync(p),'FILE_EXISTS',path.relative(root,p));
if(failures.length)finish();
const raw=fs.readFileSync(assessmentPath,'utf8');let doc;
try{doc=JSON.parse(raw);passes.push({id:'JSON_PARSE',msg:'Assessment JSON parses'});}catch(e){failures.push({id:'JSON_PARSE',msg:e.message});finish();}
check(doc.schema==='DIAMOND_GATE_SOFTWARE_TRL7_SELF_ASSESSMENT_v1','SCHEMA_ID','Schema identity is frozen');
check(doc.status==='PUBLIC_INSPECTABLE_AND_MECHANICALLY_VALIDATED_SELF_ASSESSMENT','STATUS','Assessment is explicitly inspectable and mechanically validated');
check(doc.assessmentResult==='SELF_ASSESSED_TRL_7_PASS','RESULT','Result is explicitly self-assessed');
check(doc.assessedTechnology==='Diamond Gate governed software-construction platform','BOUNDARY_NAME','Assessed technology name is exact');
check(doc.framework?.name==='NASA Technology Readiness Levels','FRAMEWORK_NAME','Framework identity is exact');
check(doc.framework?.level===7,'FRAMEWORK_LEVEL','Framework level is exactly 7');
check(/^https:\/\/nodis3\.gsfc\.nasa\.gov\//.test(doc.framework?.primarySource||''),'PRIMARY_SOURCE','Primary source is NASA NODIS');
check(/^https:\/\/swehb\.nasa\.gov\//.test(doc.framework?.softwareGuidance||''),'SOFTWARE_GUIDANCE','Software guidance is NASA SWEHB');
for(const x of ['authority and intake control','exact-state bounded execution','governed software construction','continuity and recovery','qualification and regression behavior','integration with the actual repository and automation environment'])check(doc.boundary?.included?.includes(x),'BOUNDARY_INCLUDE',x);
for(const x of ['enterprise-scale traffic or market adoption','NASA certification, evaluation, affiliation or endorsement','TRL 8 or TRL 9 readiness'])check(doc.boundary?.excluded?.includes(x),'BOUNDARY_EXCLUDE',x);
const expected=new Set(['key-functionality','operational-integration','defect-maturity','documented-test-performance']);
check(Array.isArray(doc.criteria)&&doc.criteria.length===4,'CRITERIA_COUNT','Exactly four closure criteria');const seen=new Set();
for(const c of doc.criteria||[]){check(expected.has(c.id),'CRITERION_ID',c.id);check(!seen.has(c.id),'CRITERION_UNIQUE',c.id);seen.add(c.id);check(['PASS','PASS_BOUNDED'].includes(c.disposition),'DISPOSITION',`${c.id}: ${c.disposition}`);check(typeof c.reason==='string'&&c.reason.length>=80,'RATIONALE',`${c.id} rationale`);check(Array.isArray(c.publicEvidence)&&c.publicEvidence.length>=2,'EVIDENCE_COUNT',`${c.id} evidence count`);for(const e of c.publicEvidence||[]){check(typeof e.label==='string'&&e.label.length>3,'EVIDENCE_LABEL',`${c.id}: ${e.label||'(missing)'}`);check(typeof e.url==='string'&&(/^https:\/\//.test(e.url)||e.url.startsWith('/')),'EVIDENCE_URL',`${c.id}: ${e.url||'(missing)'}`);if(e.url?.startsWith('/assets/'))check(fs.existsSync(path.join(root,e.url.slice(1))),'LOCAL_EVIDENCE_EXISTS',e.url);if(/github\.com\/smansfield635-create\/smansfield635-create\.github\.io\/blob\//.test(e.url||''))check(/\/blob\/[0-9a-f]{40}\//.test(e.url),'PINNED_HISTORICAL_EVIDENCE',e.url);}}
check([...expected].every(x=>seen.has(x)),'CRITERIA_COMPLETE','All required criteria present');
check(doc.mechanicalValidation?.status==='MANDATORY_FAIL_CLOSED','MECHANICAL_STATUS','Mechanical validation is fail-closed');
check(doc.mechanicalValidation?.validator==='/.github/credibility/validate-software-trl7-assessment.v1.mjs','VALIDATOR_IDENTITY','Validator path exact');
check(doc.mechanicalValidation?.workflow==='/.github/workflows/software-trl7-readiness-validation-v1.yml','WORKFLOW_IDENTITY','Workflow path exact');
check(Array.isArray(doc.mechanicalValidation?.validatedInvariants)&&doc.mechanicalValidation.validatedInvariants.length>=10,'INVARIANT_SET','Validation contract is substantive');
const q=doc.closure?.qualification||'';check(q.includes('self-assessment'),'SELF_ASSESSMENT_BOUNDARY','Closure states self-assessment');check(q.includes('not a NASA certification'),'NASA_NONENDORSEMENT','Closure denies NASA certification');check((doc.closure?.nextThreshold||'').includes('TRL 8'),'TRL8_CEILING','TRL 8 remains next threshold');
for(const [name,text] of [['readiness page',fs.readFileSync(readinessPath,'utf8')],['shared presentation',fs.readFileSync(presentationPath,'utf8')]]){check(text.includes('Self-assessed')||text.includes('self-assess'),'PRESENTATION_SELF_ASSESSED',`${name} preserves self-assessment`);check(text.includes('not a NASA certification')||text.includes('Not NASA certified'),'PRESENTATION_BOUNDARY',`${name} preserves boundary`);check(!/NASA[- ](?:approved|certified|endorsed) Diamond Gate/i.test(text),'NO_FALSE_NASA_AUTHORITY',`${name} has no positive NASA authority claim`);}
const receipt={schema:'DIAMOND_GATE_SOFTWARE_TRL7_MECHANICAL_VALIDATION_RECEIPT_v1',assessmentSha256:crypto.createHash('sha256').update(raw).digest('hex'),checksPassed:passes.length,checksFailed:failures.length,result:failures.length?'FAIL':'PASS'};
fs.writeFileSync('trl7-mechanical-validation-receipt.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));finish();
function finish(){if(failures.length){console.error('\nTRL 7 mechanical validation failures:');for(const x of failures)console.error(`- ${x.id}: ${x.msg}`);process.exit(1);}console.log(`TRL 7 mechanical validation PASS (${passes.length} checks).`);}
