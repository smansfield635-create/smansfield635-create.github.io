#!/usr/bin/env node
import crypto from 'node:crypto';

export const INPUT_SCHEMA='H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_INPUT_INSTANCE_v2';
export const OUTPUT_SCHEMA='H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_OUTPUT_INSTANCE_v2';
export const RESULT_CLASSES=Object.freeze([
  'NO_CANDIDATE_ARRANGEMENTS_GENERATED',
  'CANDIDATE_ARRANGEMENTS_GENERATED_BUT_REJECTED',
  'REJECTION_CAUSED_BY_DECLARED_HARD_CONSTRAINTS',
  'REJECTION_CAUSED_BY_INPUT_OR_OBSERVABILITY_LIMITATION',
  'REJECTION_CAUSED_BY_EVALUATOR_OR_MEASUREMENT_INSUFFICIENCY',
  'EVIDENCE_SUPPORTING_TERRAIN_INFEASIBILITY',
  'EVIDENCE_SUPPORTING_ESTATE_INFEASIBILITY',
  'FEASIBLE_ARRANGEMENT_FOUND'
]);
export const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])])):value;
export const canonical=value=>JSON.stringify(stable(value));
export const digest=value=>crypto.createHash('sha256').update(canonical(value)).digest('hex');
const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
const fail=(code,detail=null)=>{const error=new Error(detail?`${code}:${detail}`:code);error.code=code;error.detail=detail;throw error};

function validateInput(input){
  if(!object(input)||input.schema!==INPUT_SCHEMA)fail('INVALID_INPUT','SCHEMA');
  for(const key of ['caseId','generation','observability','evaluator','candidates','passingArrangementCount','proofs'])if(!Object.hasOwn(input,key))fail('INVALID_INPUT',`MISSING_${key}`);
  if(typeof input.caseId!=='string'||!input.caseId)fail('INVALID_INPUT','CASE_ID');
  if(!object(input.generation)||!object(input.observability)||!object(input.evaluator)||!object(input.proofs)||!Array.isArray(input.candidates))fail('INVALID_INPUT','STRUCTURE');
  const g=input.generation,o=input.observability,e=input.evaluator;
  for(const k of ['attempted','complete'])if(typeof g[k]!=='boolean')fail('INVALID_INPUT',`GENERATION_${k}`);
  if(g.candidateCount!==null&&(!Number.isInteger(g.candidateCount)||g.candidateCount<0))fail('INVALID_INPUT','CANDIDATE_COUNT');
  if(g.searchDomainCoverage!==null&&(typeof g.searchDomainCoverage!=='number'||g.searchDomainCoverage<0||g.searchDomainCoverage>1))fail('INVALID_INPUT','SEARCH_COVERAGE');
  for(const k of ['inputsComplete','candidateTraceComplete','hardConstraintEvidenceComplete'])if(typeof o[k]!=='boolean')fail('INVALID_INPUT',`OBSERVABILITY_${k}`);
  for(const k of ['executed','measurementSufficient'])if(typeof e[k]!=='boolean')fail('INVALID_INPUT',`EVALUATOR_${k}`);
  if(e.failureCode!==null&&(typeof e.failureCode!=='string'||!e.failureCode))fail('INVALID_INPUT','FAILURE_CODE');
  if(input.passingArrangementCount!==null&&(!Number.isInteger(input.passingArrangementCount)||input.passingArrangementCount<0))fail('INVALID_INPUT','PASSING_COUNT');
  if(g.candidateCount!==null&&g.candidateCount!==input.candidates.length)fail('INVALID_INPUT','CANDIDATE_COUNT_TRACE_MISMATCH');
  if(input.passingArrangementCount!==null&&g.candidateCount!==null&&input.passingArrangementCount>g.candidateCount)fail('INVALID_INPUT','PASSING_COUNT_EXCEEDS_CANDIDATES');
  const ids=new Set();
  for(const c of input.candidates){
    if(!object(c)||typeof c.candidateId!=='string'||!c.candidateId||ids.has(c.candidateId)||c.generated!==true||!['PASS','REJECTED_HARD_CONSTRAINT','REJECTED_OTHER','UNEVALUABLE'].includes(c.finalDisposition)||!Array.isArray(c.constraintEvaluations)||!Array.isArray(c.evidenceRefs))fail('INVALID_INPUT','CANDIDATE_TRACE');
    ids.add(c.candidateId);
    for(const r of c.constraintEvaluations)if(!object(r)||typeof r.ruleId!=='string'||!r.ruleId||!['PASS','FAIL','UNKNOWN'].includes(r.status)||!Array.isArray(r.evidenceRefs))fail('INVALID_INPUT','CONSTRAINT_TRACE');
  }
  if(input.passingArrangementCount!==null){
    const observed=input.candidates.filter(c=>c.finalDisposition==='PASS').length;
    if(observed!==input.passingArrangementCount)fail('INVALID_INPUT','PASSING_COUNT_TRACE_MISMATCH');
  }
  return true;
}

function validProof(proof,kind){
  if(!object(proof))return false;
  const refs=Array.isArray(proof.evidenceRefs)&&proof.evidenceRefs.length>0&&proof.evidenceRefs.every(x=>typeof x==='string'&&x);
  if(kind==='terrain')return proof.complete===true&&proof.exhaustive===true&&proof.allTerrainStatesRejected===true&&proof.estateModelIndependent===true&&proof.ruleId==='TERRAIN_INFEASIBILITY_EXHAUSTIVE_PROOF'&&refs;
  return proof.complete===true&&proof.exhaustive===true&&proof.terrainFeasible===true&&proof.allEstateConfigurationsRejected===true&&proof.ruleId==='ESTATE_INFEASIBILITY_EXHAUSTIVE_PROOF'&&refs;
}

function traceCandidate(candidate){
  if(candidate.finalDisposition==='PASS')return null;
  const failed=candidate.constraintEvaluations.filter(x=>x.status==='FAIL').map(x=>x.ruleId);
  const unknown=candidate.constraintEvaluations.filter(x=>x.status==='UNKNOWN').map(x=>x.ruleId);
  const causalDisposition=unknown.length?'UNEVALUABLE_UNKNOWN_CONSTRAINT_EVIDENCE':candidate.finalDisposition==='REJECTED_HARD_CONSTRAINT'?'DECLARED_HARD_CONSTRAINT_REJECTION':candidate.finalDisposition==='REJECTED_OTHER'?'NON_HARD_REJECTION':'UNEVALUABLE';
  return stable({candidateId:candidate.candidateId,generated:true,finalDisposition:candidate.finalDisposition,constraintEvaluations:candidate.constraintEvaluations,causalDisposition,failedRuleIds:failed,unknownRuleIds:unknown,evidenceRefs:candidate.evidenceRefs});
}

function output(input,resultClass,inferenceState,{terrain=false,estate=false,terrainEvidence=[],estateEvidence=[]}={}){
  const traces=input.candidates.map(traceCandidate).filter(Boolean);
  const base={
    schema:OUTPUT_SCHEMA,
    caseId:input.caseId,
    resultClass,
    inferenceState,
    candidateArrangementCount:input.generation.candidateCount,
    passingArrangementCount:input.passingArrangementCount,
    causalTraces:traces,
    infeasibilityClaims:{
      terrain:{asserted:terrain,ruleId:terrain?'TERRAIN_INFEASIBILITY_EXHAUSTIVE_PROOF':null,evidenceRefs:terrainEvidence},
      estate:{asserted:estate,ruleId:estate?'ESTATE_INFEASIBILITY_EXHAUSTIVE_PROOF':null,evidenceRefs:estateEvidence}
    },
    zeroPassNonInference:{passingCountIsZero:input.passingArrangementCount===0,terrainInfeasibilityInferredFromZero:false,estateInfeasibilityInferredFromZero:false,pass:true},
    evaluatorEvidence:{generation:input.generation,observability:input.observability,evaluator:input.evaluator}
  };
  return stable({...base,outputDigest:digest(base)});
}

export function evaluateCausalCase(input){
  validateInput(input);
  const o=input.observability,e=input.evaluator,g=input.generation;
  if(!o.inputsComplete||!o.candidateTraceComplete||!o.hardConstraintEvidenceComplete||g.complete===false||g.candidateCount===null||input.passingArrangementCount===null){
    return output(input,'REJECTION_CAUSED_BY_INPUT_OR_OBSERVABILITY_LIMITATION','UNEVALUABLE');
  }
  if(!e.executed||!e.measurementSufficient){
    return output(input,'REJECTION_CAUSED_BY_EVALUATOR_OR_MEASUREMENT_INSUFFICIENCY','UNEVALUABLE');
  }
  const terrainProof=validProof(input.proofs.terrainInfeasibility,'terrain');
  const estateProof=validProof(input.proofs.estateInfeasibility,'estate');
  if(input.passingArrangementCount>0){
    if(terrainProof||estateProof)fail('INVALID_INPUT','PASS_CONTRADICTS_INFEASIBILITY_PROOF');
    return output(input,'FEASIBLE_ARRANGEMENT_FOUND','EVALUABLE');
  }
  if(terrainProof&&estateProof)fail('INVALID_INPUT','DUAL_INFEASIBILITY_PROOF_AMBIGUOUS');
  if(terrainProof)return output(input,'EVIDENCE_SUPPORTING_TERRAIN_INFEASIBILITY','EVALUABLE',{terrain:true,terrainEvidence:input.proofs.terrainInfeasibility.evidenceRefs});
  if(estateProof)return output(input,'EVIDENCE_SUPPORTING_ESTATE_INFEASIBILITY','EVALUABLE',{estate:true,estateEvidence:input.proofs.estateInfeasibility.evidenceRefs});
  if(g.candidateCount===0&&g.attempted&&g.complete)return output(input,'NO_CANDIDATE_ARRANGEMENTS_GENERATED','EVALUABLE');
  const hard=input.candidates.some(c=>c.finalDisposition==='REJECTED_HARD_CONSTRAINT'||c.constraintEvaluations.some(r=>r.status==='FAIL'));
  if(hard)return output(input,'REJECTION_CAUSED_BY_DECLARED_HARD_CONSTRAINTS','EVALUABLE');
  if(g.candidateCount>0)return output(input,'CANDIDATE_ARRANGEMENTS_GENERATED_BUT_REJECTED','EVALUABLE');
  return output(input,'REJECTION_CAUSED_BY_EVALUATOR_OR_MEASUREMENT_INSUFFICIENCY','UNEVALUABLE');
}
