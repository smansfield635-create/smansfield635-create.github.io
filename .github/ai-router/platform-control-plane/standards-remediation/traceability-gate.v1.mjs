const id = x => typeof x === 'string' && x.trim().length > 0;
export function evaluateTraceability(dossier={}) {
  const arrays=['requirements','testConditions','testCases','results','exitCriteria'];
  for (const k of arrays) if (!Array.isArray(dossier[k])) return stop('TRACEABILITY_SCHEMA_INVALID',k);
  const allNodes=arrays.flatMap(k=>dossier[k].map(x=>x.id));
  if (allNodes.some(x=>!id(x)) || new Set(allNodes).size!==allNodes.length) return stop('TRACEABILITY_ID_INVALID_OR_DUPLICATE');
  const by=(k)=>new Map(dossier[k].map(x=>[x.id,x]));
  const req=by('requirements'), cond=by('testConditions'), cases=by('testCases'), res=by('results'), exits=by('exitCriteria');
  for (const c of dossier.testConditions) if (!req.has(c.requirementId)) return stop('ORPHAN_TEST_CONDITION',c.id);
  for (const c of dossier.testCases) if (!cond.has(c.testConditionId)) return stop('ORPHAN_TEST_CASE',c.id);
  for (const r of dossier.results) {
    if (!cases.has(r.testCaseId)) return stop('ORPHAN_RESULT',r.id);
    if (!['PASS','FAIL'].includes(r.outcome) || !id(r.evidenceDigest)) return stop('RESULT_EVIDENCE_INVALID',r.id);
  }
  for (const e of dossier.exitCriteria) if (!req.has(e.requirementId) || !Array.isArray(e.requiredCaseIds) || e.requiredCaseIds.length===0) return stop('EXIT_CRITERION_INVALID',e.id);
  for (const r of dossier.requirements) {
    const cs=dossier.testConditions.filter(x=>x.requirementId===r.id);
    if (!cs.length) return stop('REQUIREMENT_WITHOUT_TEST_CONDITION',r.id);
    const caseIds=dossier.testCases.filter(x=>cs.some(c=>c.id===x.testConditionId)).map(x=>x.id);
    if (!caseIds.length) return stop('REQUIREMENT_WITHOUT_TEST_CASE',r.id);
    if (caseIds.some(cid=>!dossier.results.some(x=>x.testCaseId===cid))) return stop('TEST_CASE_WITHOUT_RESULT',r.id);
    const e=dossier.exitCriteria.find(x=>x.requirementId===r.id);
    if (!e) return stop('REQUIREMENT_WITHOUT_EXIT_CRITERION',r.id);
    if (e.requiredCaseIds.some(cid=>!caseIds.includes(cid))) return stop('EXIT_CASE_OUTSIDE_REQUIREMENT',e.id);
  }
  const requiredLinks=dossier.requirements.length+dossier.testConditions.length+dossier.testCases.length+dossier.results.length+dossier.exitCriteria.length;
  return {schema:'L2_TRACEABILITY_CLOSURE_RECEIPT_v1',result:'PASS_CLOSED',disposition:'EVIDENCED',requiredLinks,completeLinks:requiredLinks,coverage:1,authorityCreated:false};
}
function stop(errorCode,detail=null){return {schema:'L2_TRACEABILITY_CLOSURE_RECEIPT_v1',result:'STOP',disposition:'GAP',errorCode,detail,authorityCreated:false};}
