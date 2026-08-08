import fs from 'node:fs';
import crypto from 'node:crypto';

const CANDIDATE='bb22e805ca6a029d7caa95d16dc710ae280d40da';
const TREE='27825a0d38f043bd36975d9ba1aa1356e13b7663';
const BASE='control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1/';
const contract=JSON.parse(fs.readFileSync(BASE+'r8-review-occurrence-delivery.v1.json','utf8'));
const carrier=fs.readFileSync('review/methods-and-models/f12-r8-bb22e805/index.html','utf8');
const sha256=(v)=>crypto.createHash('sha256').update(v).digest('hex');
const fail=(code)=>{throw new Error(code)};

if(contract.schema!=='METHODS_MODELS_F12_R8_REVIEW_OCCURRENCE_DELIVERY_CONTRACT_v1') fail('SCHEMA_MISMATCH');
if(contract.operation!=='R8_REVIEW_OCCURRENCE_DELIVERY_v1') fail('OPERATION_MISMATCH');
if(contract.operationClass!=='R8_NONCHECKPOINT_DELIVERY_SUBOPERATION') fail('OPERATION_CLASS_MISMATCH');
if(contract.controllingR8Candidate.head!==CANDIDATE||contract.controllingR8Candidate.tree!==TREE) fail('CANDIDATE_IDENTITY_MISMATCH');
if(contract.controllingR8Candidate.passClosed!==false||contract.controllingR8Candidate.r9Unlock!==false) fail('R8_CLOSURE_OR_R9_UNLOCK_ATTEMPT');
for(const key of ['controllingR8Candidate','main','publicMethodsRoute','scientificState','relationGraph','projectionGraph']) if(contract.mutations[key]!==false) fail('UNAUTHORIZED_MUTATION_'+key);
if(contract.deliveryBoundary.isProductionMethodsDeployment!==false||contract.deliveryBoundary.isFullEstateMaterialization!==false||contract.deliveryBoundary.isR9Execution!==false||contract.deliveryBoundary.isR8Closure!==false) fail('DELIVERY_BOUNDARY_VIOLATION');
if(contract.deliveryModel.carrierClass!=='TEMPORARY_SOURCE_HEAD_PINNED_REVIEW_CARRIER'||contract.deliveryModel.exactCandidateHead!==CANDIDATE) fail('CARRIER_IDENTITY_MISMATCH');
if(contract.deliveryModel.carrierMayRewriteResourceURLsOnly!==true||contract.deliveryModel.carrierMayRewriteCandidateContent!==false) fail('CARRIER_REWRITE_BOUNDARY_MISMATCH');
for(const literal of [
  'TEMPORARY_SOURCE_HEAD_PINNED_REVIEW_CARRIER',
  'R8_REVIEW_OCCURRENCE_DELIVERY_v1',
  CANDIDATE,
  'cdn.jsdelivr.net/gh/smansfield635-create/smansfield635-create.github.io@',
  "publicMethodsMutation:false",
  "liveMethodsRouteMutation:false",
  "r9Execution:false",
  "controllingCandidateMutation:false"
]) if(!carrier.includes(literal)) fail('CARRIER_REQUIRED_LITERAL_MISSING::'+literal);
if(!carrier.includes('EXACT_CANDIDATE_HEAD')) fail('RUNTIME_SOURCE_PIN_MISSING');
if(/METHODS_F12_R8_REVIEW_OCCURRENCE[^\n]*passClosed\s*:\s*true/.test(carrier)) fail('CARRIER_FALSE_CLOSURE_CLAIM');
const result={
  schema:'METHODS_MODELS_F12_R8_REVIEW_OCCURRENCE_DELIVERY_VERIFICATION_RESULT_v1',
  status:'PASS_DELIVERY_CANDIDATE_READY_FOR_REACHABILITY_CHECK',
  operation:contract.operation,
  controllingR8CandidateHead:CANDIDATE,
  controllingR8CandidateTree:TREE,
  carrierClass:contract.deliveryModel.carrierClass,
  carrierSha256:sha256(carrier),
  publicMethodsMutation:false,
  liveMethodsRouteMutation:false,
  mainMutation:false,
  scientificMutation:false,
  r8PassClosed:false,
  r9Unlock:false,
  userDifferential:'NOT_AVAILABLE_UNTIL_OCCURRENCE_DELIVERED',
  checks:[
    'EXACT_R8_CANDIDATE_PIN_PASS',
    'TEMPORARY_REVIEW_CARRIER_CLASS_PASS',
    'RUNTIME_IMMUTABLE_CDN_SOURCE_PIN_PASS',
    'RESOURCE_URL_ONLY_REWRITE_BOUNDARY_PASS',
    'NO_CANDIDATE_CONTENT_REWRITE_AUTHORITY_PASS',
    'NO_MAIN_OR_PUBLIC_METHODS_MUTATION_PASS',
    'NO_SCIENTIFIC_MUTATION_PASS',
    'NO_R8_CLOSURE_PASS',
    'NO_R9_EXECUTION_OR_UNLOCK_PASS'
  ]
};
console.log(JSON.stringify(result,null,2));
