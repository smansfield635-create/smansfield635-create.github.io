import { pathToFileURL } from 'node:url';
import { freeze, digest, clone } from './h-earth-capacity-camera-renderer-correspondence-h2-common.mjs';
import {
  H2_CONTRACT, DEFAULT_REPOSITORY_ROOT, validateH2Contract,
  validateCustody, executeH2Observation
} from './h-earth-capacity-camera-renderer-correspondence-h2-observer.mjs';
import {
  extractProductionFacts, validateProductionFacts
} from './h-earth-capacity-camera-renderer-correspondence-h2-facts.mjs';

export async function executeH2Controls({repositoryRoot = DEFAULT_REPOSITORY_ROOT} = {}) {
  const controls=[]; let actual;
  const pass=async(id,fn,test=value=>Boolean(value))=>{try{const result=await fn();controls.push({id,status:test(result)?'PASS':'FAIL',expected:'PASS',result});}
    catch(error){controls.push({id,status:'FAIL',expected:'PASS',actual:error.code||error.name});}};
  const reject=async(id,code,fn)=>{try{await fn();controls.push({id,status:'FAIL',expected:code,actual:'NO_ERROR'});}
    catch(error){controls.push({id,status:error.code===code?'PASS':'FAIL',expected:code,actual:error.code||error.name});}};

  await pass('ACTUAL_PRODUCTION_OBSERVATION',async()=>actual=await executeH2Observation({repositoryRoot}),r=>r.terminalClassification==='PRODUCTION_CAPACITY_OBSERVED_SOURCE_CUSTODY_PASS');
  await reject('MISSING_CAPACITY_EXPORT','H2_REQUIRED_CAPACITY_EXPORT_MISSING',()=>extractProductionFacts({}));
  await reject('SOURCE_BLOB_MISMATCH','H2_SOURCE_BLOB_MISMATCH',()=>{const r=clone(actual.sourceCustody);r[0].gitBlob='0'.repeat(40);validateCustody(r);});
  await reject('DUPLICATE_CAPACITY_AUTHORITY','H2_DUPLICATE_CAPACITY_AUTHORITY_PROHIBITED',()=>{const f=clone(actual.productionFacts);f.auxiliaryCapacityModulePermitted=true;validateProductionFacts(f,H2_CONTRACT.expectedFacts);});
  await reject('NONFINITE_CAMERA_VALUE','H2_DECLARED_CAMERA_POSITION_NONFINITE',()=>{const f=clone(actual.productionFacts);f.camera.position.y=NaN;validateProductionFacts(f,H2_CONTRACT.expectedFacts);});
  await reject('UNRESOLVED_REQUIRED_BOUND','H2_DECLARED_TARGET_BOUND_UNRESOLVED',()=>{const f=clone(actual.productionFacts);delete f.camera.targetBounds.zMax;validateProductionFacts(f,H2_CONTRACT.expectedFacts);});
  await reject('SOURCE_COMMIT_MISMATCH','H2_SOURCE_COMMIT_MISMATCH',()=>{const c=clone(H2_CONTRACT);c.sourceCommit='0'.repeat(40);validateH2Contract(c);});
  await reject('PRODUCTION_MUTATION_BOUNDARY','H2_STOP_BOUNDARY_VIOLATION',()=>{const c=clone(H2_CONTRACT);c.claims.productionFilesChanged=1;validateH2Contract(c);});
  await pass('DETERMINISTIC_REPEAT_OBSERVATION',async()=>{const repeated=await executeH2Observation({repositoryRoot});return{first:actual.deterministicReceiptSha256,second:repeated.deterministicReceiptSha256,identical:actual.deterministicReceiptSha256===repeated.deterministicReceiptSha256};},r=>r.identical);

  const failed=controls.filter(control=>control.status!=='PASS');
  const body={contractId:'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H2_CONTROL_RECEIPT_v1',toolId:H2_CONTRACT.toolId,checkpoint:'H2',status:failed.length?'FAIL':'PASS',
    controlCount:controls.length,passedControlCount:controls.length-failed.length,failedControlCount:failed.length,controls,actualObservation:actual,
    claims:{productionCapacityObserved:failed.length===0,sourceIdentityEstablished:failed.length===0,observationMutationPerformed:false,rendererExecutionPerformed:false,
      productionFilesChanged:0,productionCorrectionStarted:false,h3Started:false,mergePerformed:false}};
  return freeze({...body,deterministicReceiptSha256:digest(body)});
}

if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const receipt=await executeH2Controls(); console.log(JSON.stringify(receipt,null,2)); if(receipt.status!=='PASS') process.exitCode=1;
}
