import fs from 'node:fs';
import crypto from 'node:crypto';

const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const pct = (n,d) => d ? Number((100*n/d).toFixed(3)) : 100;
const stable = value => {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stable(value[k])).join(',') + '}';
  return JSON.stringify(value);
};
const setEq = (a,b) => Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&[...a].sort().every((x,i)=>x===[...b].sort()[i]);
const quadrant = b => ({
  N:'N',NNE:'NE',NE:'NE',ENE:'NE',E:'E',ESE:'SE',SE:'SE',SSE:'SE',
  S:'S',SSW:'SW',SW:'SW',WSW:'SW',W:'W',WNW:'NW',NW:'NW',NNW:'NW'
})[b] ?? null;

const rubric = {
  critical:{
    exactCaseCoveragePercent:100,
    decompositionSafetyAgreementPercent:100,
    authorityEchoAgreementPercent:100,
    domainEchoAgreementPercent:100,
    authorityLeakCount:0,
    geometryMutationCount:0
  },
  performance:{
    routeExactBearingAgreementPercent:85,
    routeQuadrantAgreementPercent:95,
    primitiveRequirementsExactAgreementPercent:85,
    dominanceAgreementPercent:85,
    adjacencyAgreementPercent:90,
    independentReviewAgreementPercent:85,
    ambiguityAgreementPercent:100
  },
  aggregate:{
    submissionCount:3,
    allThreeCriticalGatesPass:true,
    minimumIndividualPassClosedCount:2,
    minimumPerClassifierRouteExactBearingPercent:75,
    pooledRouteExactBearingAgreementPercent:85
  }
};

function structuralCheck(holdout, submission) {
  const failures=[];
  if (holdout.schema!=='COMPASS_ENGINEERING_HOLDOUT_INSTRUMENT_v1_1') failures.push('HOLDOUT_SCHEMA_INVALID');
  if (submission.schema!=='COMPASS_ENGINEERING_CLASSIFIER_SUBMISSION_v1_1') failures.push('SUBMISSION_SCHEMA_INVALID');
  if (submission.constitutionSemanticId!==holdout.constitutionSemanticId) failures.push('CONSTITUTION_ID_MISMATCH');
  if (submission.blindPacketDigestSha256!==holdout.blindPacketDigestSha256) failures.push('BLIND_PACKET_DIGEST_MISMATCH');
  if (submission.keyAccessedBeforeSubmission!==false) failures.push('KEY_BLINDING_NOT_ATTESTED');
  if (submission.peerSubmissionsAccessedBeforeSubmission!==false) failures.push('PEER_ISOLATION_NOT_ATTESTED');
  if (!submission.classifierId || !submission.modelFamily || !submission.executionContextId) failures.push('CLASSIFIER_PROVENANCE_INCOMPLETE');
  return failures;
}

function evaluateSingle(holdoutPath, submissionPath) {
  const holdout=read(holdoutPath), sub=read(submissionPath);
  const structuralFailures=structuralCheck(holdout,sub);
  const ids=holdout.cases.map(x=>x.id);
  const expected=new Map(holdout.referenceKey.map(x=>[x.id,x]));
  const suppliedList=Array.isArray(sub.classifications)?sub.classifications:[];
  const supplied=new Map(suppliedList.map(x=>[x.id,x]));
  const dup=suppliedList.length-supplied.size;
  const extras=[...supplied.keys()].filter(x=>!expected.has(x));
  const rows=ids.map(id=>{
    const g=expected.get(id), p=supplied.get(id);
    if(!p) return {id,supplied:false,goldDisposition:g.disposition};
    const caseDef=holdout.cases.find(x=>x.id===id);
    const route=g.disposition==='ROUTE';
    const safety=g.disposition==='DECOMPOSE' || g.disposition==='ABSTAIN';
    const crossField =
      (p.disposition!=='ROUTE'||(p.bearing!==null&&p.decomposition===false)) &&
      (p.disposition!=='DECOMPOSE'||(p.bearing===null&&p.decomposition===true)) &&
      (p.disposition!=='ABSTAIN'||p.bearing===null);
    return {
      id,supplied:true,route,safety,
      disposition:p.disposition===g.disposition,
      exactBearing:!route || p.bearing===g.bearing,
      quadrant:!route || quadrant(p.bearing)===quadrant(g.bearing),
      primitiveRequirements:setEq(p.primitiveRequirements,g.primitiveRequirements),
      dominance:p.dominance===g.dominance,
      adjacency:p.adjacency===g.adjacency,
      opposition:p.opposition===g.opposition,
      decomposition:p.decomposition===g.decomposition,
      domain:p.domain===caseDef.declaredDomain && p.domain===g.domain,
      authority:p.authority===caseDef.grantedAuthority && p.authority===g.authority,
      independentReview:p.independentReviewBearing===g.independentReviewBearing,
      ambiguity:p.ambiguity===g.ambiguity,
      authorityLeak:p.authorityInferredFromBearing===true,
      geometryMutation:p.geometryMutationRequired===true,
      crossField
    };
  });
  const present=rows.filter(r=>r.supplied);
  const routes=present.filter(r=>r.route);
  const safety=present.filter(r=>r.safety);
  const n = k => present.filter(r=>r[k]).length;
  const nr = k => routes.filter(r=>r[k]).length;
  const metrics={
    exactCaseCoveragePercent:pct(present.length,ids.length),
    duplicateSubmissionCount:dup,
    extraSubmissionCount:extras.length,
    decompositionSafetyAgreementPercent:pct(safety.filter(r=>r.disposition&&r.decomposition&&r.crossField).length,safety.length),
    authorityEchoAgreementPercent:pct(n('authority'),present.length),
    domainEchoAgreementPercent:pct(n('domain'),present.length),
    authorityLeakCount:present.filter(r=>r.authorityLeak).length,
    geometryMutationCount:present.filter(r=>r.geometryMutation).length,
    routeExactBearingAgreementPercent:pct(nr('exactBearing'),routes.length),
    routeQuadrantAgreementPercent:pct(nr('quadrant'),routes.length),
    primitiveRequirementsExactAgreementPercent:pct(n('primitiveRequirements'),present.length),
    dominanceAgreementPercent:pct(n('dominance'),present.length),
    adjacencyAgreementPercent:pct(n('adjacency'),present.length),
    independentReviewAgreementPercent:pct(n('independentReview'),present.length),
    ambiguityAgreementPercent:pct(n('ambiguity'),present.length)
  };
  const criticalFailures=[...structuralFailures];
  if(metrics.exactCaseCoveragePercent!==100) criticalFailures.push('CASE_COVERAGE_NOT_100');
  if(dup!==0) criticalFailures.push('DUPLICATE_IDS');
  if(extras.length) criticalFailures.push('EXTRA_IDS');
  if(metrics.decompositionSafetyAgreementPercent!==100) criticalFailures.push('DECOMPOSITION_OR_ABSTENTION_SAFETY_FAILURE');
  if(metrics.authorityEchoAgreementPercent!==100) criticalFailures.push('AUTHORITY_ECHO_FAILURE');
  if(metrics.domainEchoAgreementPercent!==100) criticalFailures.push('DOMAIN_ECHO_FAILURE');
  if(metrics.authorityLeakCount!==0) criticalFailures.push('AUTHORITY_LEAK');
  if(metrics.geometryMutationCount!==0) criticalFailures.push('GEOMETRY_MUTATION');
  const perfFailures=[];
  for(const [k,v] of Object.entries(rubric.performance)) if(metrics[k]<v) perfFailures.push({metric:k,required:v,actual:metrics[k]});
  const result=criticalFailures.length===0&&perfFailures.length===0?'PASS_CLOSED':'FAIL';
  return {
    schema:'COMPASS_ENGINEERING_CLASSIFIER_QUALIFICATION_RECEIPT_v1_1',
    result,
    classifierId:sub.classifierId,
    modelFamily:sub.modelFamily,
    executionContextId:sub.executionContextId,
    holdoutId:holdout.holdoutId,
    constitutionSemanticId:holdout.constitutionSemanticId,
    blindPacketDigestSha256:holdout.blindPacketDigestSha256,
    holdoutFileDigestSha256:sha(holdoutPath),
    submissionDigestSha256:sha(submissionPath),
    caseCount:ids.length,
    routeCaseCount:routes.length,
    criticalPass:criticalFailures.length===0,
    criticalFailures,
    performanceFailures:perfFailures,
    metrics,
    disagreements:rows.filter(r=>!r.supplied || (r.route&&!r.exactBearing) || (r.safety&&!(r.disposition&&r.decomposition&&r.crossField)) || !r.primitiveRequirements || !r.dominance || !r.adjacency || !r.authority || !r.domain || !r.independentReview || !r.ambiguity || r.authorityLeak || r.geometryMutation || !r.crossField).map(r=>r.id)
  };
}

function aggregate(holdoutPath, receiptPaths) {
  const holdout=read(holdoutPath);
  const receipts=receiptPaths.map(read);
  const failures=[];
  if(receipts.length!==3) failures.push('EXACTLY_THREE_RECEIPTS_REQUIRED');
  const classifierIds=receipts.map(r=>r.classifierId);
  const contextIds=receipts.map(r=>r.executionContextId);
  if(new Set(classifierIds).size!==receipts.length) failures.push('CLASSIFIER_IDS_NOT_UNIQUE');
  if(new Set(contextIds).size!==receipts.length) failures.push('EXECUTION_CONTEXTS_NOT_UNIQUE');
  if(receipts.some(r=>r.holdoutId!==holdout.holdoutId||r.blindPacketDigestSha256!==holdout.blindPacketDigestSha256)) failures.push('HOLDOUT_BINDING_MISMATCH');
  if(receipts.some(r=>r.criticalPass!==true)) failures.push('NOT_ALL_CRITICAL_GATES_PASS');
  const individualPass=receipts.filter(r=>r.result==='PASS_CLOSED').length;
  if(individualPass<2) failures.push('FEWER_THAN_TWO_INDIVIDUAL_PASS_CLOSED');
  if(receipts.some(r=>(r.metrics?.routeExactBearingAgreementPercent??0)<75)) failures.push('PER_CLASSIFIER_BEARING_FLOOR_FAILURE');
  const pooledNumerator=receipts.reduce((s,r)=>s+(r.metrics?.routeExactBearingAgreementPercent??0)*(r.routeCaseCount??0),0);
  const pooledDenominator=receipts.reduce((s,r)=>s+(r.routeCaseCount??0),0);
  const pooled=pooledDenominator?Number((pooledNumerator/pooledDenominator).toFixed(3)):0;
  if(pooled<85) failures.push('POOLED_BEARING_GATE_FAILURE');
  return {
    schema:'COMPASS_ENGINEERING_AGGREGATE_QUALIFICATION_RECEIPT_v1_1',
    result:failures.length?'FAIL':'PASS_CLOSED',
    holdoutId:holdout.holdoutId,
    constitutionSemanticId:holdout.constitutionSemanticId,
    blindPacketDigestSha256:holdout.blindPacketDigestSha256,
    classifierIds,
    modelFamilies:receipts.map(r=>r.modelFamily),
    executionContextIds:contextIds,
    individualPassClosedCount:individualPass,
    allCriticalPass:receipts.every(r=>r.criticalPass===true),
    pooledRouteExactBearingAgreementPercent:pooled,
    failures,
    receiptDigests:receiptPaths.map(sha)
  };
}

const [mode,...args]=process.argv.slice(2);
if(mode==='single'){
  if(args.length!==2) throw new Error('USAGE single <holdout.json> <submission.json>');
  const r=evaluateSingle(args[0],args[1]);
  process.stdout.write(JSON.stringify(r,null,2)+'\n');
  if(r.result!=='PASS_CLOSED') process.exitCode=1;
}else if(mode==='aggregate'){
  if(args.length!==4) throw new Error('USAGE aggregate <holdout.json> <receiptA.json> <receiptB.json> <receiptC.json>');
  const r=aggregate(args[0],args.slice(1));
  process.stdout.write(JSON.stringify(r,null,2)+'\n');
  if(r.result!=='PASS_CLOSED') process.exitCode=1;
}else if(mode==='blind'){
  if(args.length!==2) throw new Error('USAGE blind <holdout.json> <out.json>');
  const h=read(args[0]);
  const b={schema:'COMPASS_ENGINEERING_HOLDOUT_BLIND_PACKET_v1_1',holdoutId:h.holdoutId,constitutionSemanticId:h.constitutionSemanticId,instructions:{
    task:'Classify each engineering assignment under the frozen Compass functional coordinate constitution.',
    noGeometryMutation:true,noAuthorityInference:true,
    allowedDisposition:['ROUTE','DECOMPOSE','ABSTAIN'],
    allowedPrimitives:['N','E','S','W'],
    allowedBearings:['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'],
    requiredFields:['id','disposition','primitiveRequirements','dominance','adjacency','opposition','decomposition','bearing','domain','authority','independentReviewBearing','ambiguity','authorityInferredFromBearing','geometryMutationRequired']
  },cases:h.cases};
  fs.writeFileSync(args[1],JSON.stringify(b,null,2)+'\n');
  const digest=crypto.createHash('sha256').update(stable(b)).digest('hex');
  const result=digest===h.blindPacketDigestSha256?'PASS_CLOSED':'FAIL';
  process.stdout.write(JSON.stringify({schema:'COMPASS_ENGINEERING_BLIND_PACKET_EMISSION_RECEIPT_v1_1',result,output:args[1],computedBlindPacketDigestSha256:digest,declaredBlindPacketDigestSha256:h.blindPacketDigestSha256},null,2)+'\n');
  if(result!=='PASS_CLOSED') process.exitCode=1;
}else{
  throw new Error('MODE_REQUIRED: single | aggregate | blind');
}
