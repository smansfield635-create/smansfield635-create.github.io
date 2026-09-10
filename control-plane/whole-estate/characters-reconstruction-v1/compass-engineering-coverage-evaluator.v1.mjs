import fs from 'node:fs';
import crypto from 'node:crypto';

const [corpusPath,keyPath,submissionPath] = process.argv.slice(2);
if (!corpusPath || !keyPath || !submissionPath) {
  throw new Error('USAGE: node compass-engineering-coverage-evaluator.v1.mjs <corpus.json> <key.json> <submission.json>');
}
const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
const digest = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const corpus=read(corpusPath), key=read(keyPath), submission=read(submissionPath);
if (corpus.schema!=='COMPASS_ENGINEERING_COVERAGE_CORPUS_v1') throw new Error('CORPUS_SCHEMA_INVALID');
if (key.schema!=='COMPASS_ENGINEERING_COVERAGE_KEY_v1') throw new Error('KEY_SCHEMA_INVALID');
if (submission.schema!=='COMPASS_ENGINEERING_CLASSIFIER_SUBMISSION_v1') throw new Error('SUBMISSION_SCHEMA_INVALID');
if (submission.keyAccessedBeforeSubmission!==false) throw new Error('BLINDING_NOT_ATTESTED');
const ids=corpus.cases.map(x=>x.id);
if (new Set(ids).size!==20) throw new Error('CORPUS_CARDINALITY_OR_DUPLICATE_INVALID');
const gold=new Map(key.cases.map(x=>[x.id,x]));
const predictions=new Map(submission.classifications.map(x=>[x.id,x]));
const duplicateCount=submission.classifications.length-predictions.size;
const stationQuadrant=b=>({N:'N',NNE:'NE',NE:'NE',ENE:'NE',E:'E',ESE:'SE',SE:'SE',SSE:'SE',S:'S',SSW:'SW',SW:'SW',WSW:'SW',W:'W',WNW:'NW',NW:'NW',NNW:'NW'})[b]||null;
const rows=ids.map(id=>{
  const g=gold.get(id),p=predictions.get(id);
  if(!g) throw new Error(`MISSING_GOLD:${id}`);
  const supplied=Boolean(p);
  const exactBearing=supplied&&p.bearing===g.bearing;
  const quadrant=supplied&&(g.bearing===null?p.decomposition===true:stationQuadrant(p.bearing)===stationQuadrant(g.bearing));
  const decomposition=supplied&&p.decomposition===g.decomposition;
  const opposition=supplied&&p.opposition===g.opposition;
  const authorityLeak=supplied&&p.authorityInferredFromBearing===true;
  const geometryMutation=supplied&&p.geometryMutationRequired===true;
  const oppositionCollapse=supplied&&g.opposition===true&&p.decomposition!==true;
  return {id,supplied,exactBearing,quadrant,decomposition,opposition,authorityLeak,geometryMutation,oppositionCollapse};
});
const count=k=>rows.filter(x=>x[k]).length;
const pct=n=>Number((100*n/rows.length).toFixed(1));
const metrics={
  coveragePercent:pct(count('supplied')),
  exactBearingAgreementPercent:pct(count('exactBearing')),
  quadrantAgreementPercent:pct(count('quadrant')),
  decompositionAgreementPercent:pct(count('decomposition')),
  oppositionAgreementPercent:pct(count('opposition')),
  authorityLeakCount:count('authorityLeak'),
  geometryMutationCount:count('geometryMutation'),
  oppositionCollapseCount:count('oppositionCollapse'),
  duplicateSubmissionCount:duplicateCount
};
const thresholds={coveragePercent:90,exactBearingAgreementPercent:80,quadrantAgreementPercent:95,decompositionAgreementPercent:100,authorityLeakCount:0,geometryMutationCount:0,oppositionCollapseCount:0,duplicateSubmissionCount:0};
const failures=Object.entries(thresholds).filter(([k,v])=>k.endsWith('Count')?metrics[k]!==v:metrics[k]<v).map(([k,v])=>({metric:k,required:v,actual:metrics[k]}));
const receipt={
  schema:'COMPASS_ENGINEERING_COVERAGE_RECEIPT_v1',
  result:failures.length?'FAIL':'PASS_CLOSED',
  classifierId:submission.classifierId,
  corpusDigest:digest(corpusPath),
  keyDigest:digest(keyPath),
  submissionDigest:digest(submissionPath),
  caseCount:rows.length,
  metrics,thresholds,failures,
  disagreements:rows.filter(x=>!x.supplied||!x.exactBearing||!x.decomposition||!x.opposition||x.authorityLeak||x.geometryMutation||x.oppositionCollapse)
};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failures.length) process.exitCode=1;
