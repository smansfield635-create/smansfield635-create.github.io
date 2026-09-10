import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const key=JSON.parse(fs.readFileSync('compass-engineering-coverage-key.v1.json','utf8'));
const base={schema:'COMPASS_ENGINEERING_CLASSIFIER_SUBMISSION_v1',classifierId:'SELF_TEST_ORACLE_NOT_SCIENTIFIC_EVIDENCE',constitutionDigest:'e2e37227c4c04ffab10562161f78a76e0378864fee63ee80b9043ce414d2eeea',keyAccessedBeforeSubmission:false,classifications:key.cases.map(x=>({...x,authorityInferredFromBearing:false,geometryMutationRequired:false}))};
const run=(name,obj)=>{
  const path=`/tmp/${name}.json`;fs.writeFileSync(path,JSON.stringify(obj));
  return spawnSync(process.execPath,['compass-engineering-coverage-evaluator.v1.mjs','compass-engineering-coverage-corpus.v1.json','compass-engineering-coverage-key.v1.json',path],{encoding:'utf8'});
};
const good=run('compass-q2-good',base);
if(good.status!==0) throw new Error(`ORACLE_SHOULD_PASS:${good.stdout}:${good.stderr}`);
const bad=structuredClone(base);bad.classifierId='SELF_TEST_INVALID';bad.classifications[0].bearing='S';bad.classifications[19].decomposition=false;bad.classifications[1].authorityInferredFromBearing=true;bad.classifications[2].geometryMutationRequired=true;
const failed=run('compass-q2-bad',bad);
if(failed.status===0) throw new Error('INVALID_SUBMISSION_SHOULD_FAIL');
process.stdout.write(JSON.stringify({schema:'COMPASS_ENGINEERING_COVERAGE_EVALUATOR_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',scenarios:2,passed:2,scientificEvidence:false,note:'Oracle validation proves evaluator behavior only; it is not an independent routing result.'},null,2)+'\n');
