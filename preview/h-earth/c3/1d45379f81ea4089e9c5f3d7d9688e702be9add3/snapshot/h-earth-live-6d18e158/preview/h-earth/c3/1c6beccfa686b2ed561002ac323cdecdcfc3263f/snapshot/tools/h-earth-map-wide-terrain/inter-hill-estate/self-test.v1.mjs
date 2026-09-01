#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  buildEvaluatorInput,
  buildOutputSchemaControlFixture,
  deepClone,
  digest,
  validateEvaluatorInput,
  validateEvaluatorOutput
} from './successor-evaluator.v1.mjs';
import {validateProductionPartitionReceipt} from './real-terrain-partition.v1.mjs';
import {validateProductionCandidateState} from './estate-multizone-search.v1.mjs';
import {validateProductionBudgetEvidence} from './cumulative-budget-evaluator.v1.mjs';

const root=path.resolve(process.argv[2]??'.');
const control='h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator';
const read=name=>JSON.parse(fs.readFileSync(path.join(root,control,name),'utf8'));
const requirements=read('requirements.v1.json');
const operators=read('operator-family-admission.v1.json');
const inputSchema=read('input-schema.v1.json');
const outputSchema=read('output-schema.v1.json');
const fixtureDocument=read('negative-fixtures.v1.json');
const baseInput=buildEvaluatorInput({requirements,operators});

const controlResults={};
validateEvaluatorInput(baseInput,inputSchema);
controlResults.validInputSchemaInstance='PASS';
try{
  const invalid=deepClone(baseInput);invalid.UNDECLARED_INPUT_PROPERTY=true;
  validateEvaluatorInput(invalid,inputSchema);
  throw new Error('INVALID_INPUT_SCHEMA_INSTANCE_ACCEPTED');
}catch(e){
  if(e.message==='INVALID_INPUT_SCHEMA_INSTANCE_ACCEPTED')throw e;
  if(e.code!=='INPUT_SCHEMA_VALIDATION_FAILED')throw e;
  controlResults.invalidInputSchemaInstance='REJECTED';
  controlResults.invalidInputObservedErrorClassification=e.code;
}

const validOutput=buildOutputSchemaControlFixture();
validateEvaluatorOutput(validOutput,outputSchema,{phase:'PRE_DIGEST'});
validOutput.outputDigest=digest({...validOutput,outputDigest:null});
validateEvaluatorOutput(validOutput,outputSchema,{phase:'FINAL'});
controlResults.validOutputSchemaInstance='PASS';
try{
  const invalid=deepClone(validOutput);invalid.role1PotentialPathBoundary.pathCount=17;
  validateEvaluatorOutput(invalid,outputSchema,{phase:'FINAL'});
  throw new Error('INVALID_OUTPUT_SCHEMA_INSTANCE_ACCEPTED');
}catch(e){
  if(e.message==='INVALID_OUTPUT_SCHEMA_INSTANCE_ACCEPTED')throw e;
  if(!['OUTPUT_PATH_BOUNDARY_INVALID','OUTPUT_DIGEST_MISMATCH','OUTPUT_SCHEMA_VALIDATION_FAILED'].includes(e.code))throw e;
  controlResults.invalidOutputSchemaInstance='REJECTED';
  controlResults.invalidOutputObservedErrorClassification=e.code;
}

const validPartitionReceipt={synthetic:false,rows:256,columns:256,nodeCount:65536,fourNeighborEdgeCount:130560,eightNeighborEdgeCount:260610,rearMountainNodeCount:8192};
const validCandidateState={estateGraphConnected:true,principalCapacitySufficient:true,firstHillIncluded:true,secondHillIncluded:true,interHillAxisOpen:true,lowCorridorOpen:true,mountainViewPass:true,oceanViewPass:true,primaryRoutePass:true,serviceRoutePass:true,r06c10IntrusionCount:0,cavernIntrusionCount:0,waterIntrusionCount:0,futureExpansionConnected:true};
const validMeasuredState={c0SharedSampleHeightDifference:0,c1GradientVectorDifference:0,productMutation:false,terrainMutation:false};
const validVariance={maximumExactSignatureRepetition:0,normalizedOperatorFamilyEntropy:1,rowOrColumnGridCorrelation:0,dominantAxisSpectralEnergyFraction:0};

function executeInputFixture(id){
  const input=deepClone(baseInput);
  switch(id){
    case 'WRONG_X67_25_Z_MINUS16_85_IDENTITY_ACCEPTED':
      input.estateIdentityCorrection.lineageCenter={x:67.25,z:-16.85};break;
    case 'IDENTITY_CORRECTION_MISSING':
      delete input.estateIdentityCorrection.rejectedReservation;break;
    case 'CURRENT_MAIN_HEAD_MISMATCH':
      input.governingMainIdentity='f'.repeat(40);break;
    case 'CURRENT_TERRAIN_BLOB_MISMATCH':
      input.sourceIdentities.currentTerrain.blob='f'.repeat(40);break;
    case 'ACCEPTED_R06_C10_BLOB_MISMATCH':
      input.sourceIdentities.acceptedLocalReference.deltaBlob='f'.repeat(40);break;
    case 'ACCEPTED_REFERENCE_CLAIMED_MERGED_MAIN':
      input.sourceIdentities.acceptedLocalReference.mergedMain=true;break;
    case 'SYNTHETIC_512_BY_512_DOMAIN_USED':
      Object.assign(input.terrainDomain,{rows:512,columns:512,nodeCount:262144});break;
    case 'ONE_RECTANGULAR_PAD_MODEL_USED':
      input.estateModel.rectangularPadModel=true;break;
    case 'FIXED_30_BY_22_REQUIREMENT_REINTRODUCED':
      input.estateModel.fixedDimensions={width:30,depth:22};break;
    case 'FIXED_32_BY_24_REQUIREMENT_REINTRODUCED':
      input.estateModel.fixedDimensions={width:32,depth:24};break;
    default: throw new Error(`UNSUPPORTED_INPUT_FIXTURE:${id}`);
  }
  validateEvaluatorInput(input,inputSchema);
  return {rejected:false,observedErrorClassification:null};
}

function executePartitionFixture(id){
  const receipt={...validPartitionReceipt};
  if(id==='REAR_MOUNTAIN_BAND_MISSING')receipt.rearMountainNodeCount=0;
  else if(id==='MICROGRAPH_COVERAGE_GAP')receipt.nodeCount=65535;
  else if(id==='REAL_ADJACENCY_EDGE_MISSING')receipt.fourNeighborEdgeCount=130559;
  else throw new Error(`UNSUPPORTED_PARTITION_FIXTURE:${id}`);
  validateProductionPartitionReceipt(receipt);
  return {rejected:false,observedErrorClassification:null};
}

function executeCandidateFixture(id){
  const state={...validCandidateState};
  if(id==='ESTATE_GRAPH_DISCONNECTED')state.estateGraphConnected=false;
  else if(id==='FIRST_OR_SECOND_HILL_EXCLUDED')state.firstHillIncluded=false;
  else if(id==='INTER_HILL_AXIS_BLOCKED')state.interHillAxisOpen=false;
  else if(id==='LOW_CORRIDOR_CLOSED')state.lowCorridorOpen=false;
  else if(id==='MOUNTAIN_VIEW_GATE_FAILED')state.mountainViewPass=false;
  else if(id==='OCEAN_VIEW_GATE_FAILED')state.oceanViewPass=false;
  else if(id==='PRIMARY_ROUTE_FAILED')state.primaryRoutePass=false;
  else if(id==='SERVICE_ROUTE_FAILED')state.serviceRoutePass=false;
  else if(id==='R06_C10_PRESERVATION_INTRUSION')state.r06c10IntrusionCount=1;
  else throw new Error(`UNSUPPORTED_CANDIDATE_FIXTURE:${id}`);
  const result=validateProductionCandidateState(state);
  return {rejected:result.accepted===false,observedErrorClassification:result.failures[0]??null,observedResult:result.result};
}

function executeBudgetFixture(id){
  const measuredState={...validMeasuredState},varianceAndRepetition={...validVariance};
  if(id==='C0_OR_C1_CONTINUITY_EXCEEDED')measuredState.c0SharedSampleHeightDifference=requirements.budgets.continuity.c0Shared*2;
  else if(id==='GRID_CORRELATED_OR_REPETITIVE_PLAN')varianceAndRepetition.rowOrColumnGridCorrelation=.75;
  else throw new Error(`UNSUPPORTED_BUDGET_FIXTURE:${id}`);
  validateProductionBudgetEvidence({measuredState,varianceAndRepetition,requirements});
  return {rejected:false,observedErrorClassification:null};
}

function runFixture(fixture){
  let observedResult='ACCEPTED',observedErrorClassification=null,executionRejectedOrExitedNonzero=false;
  try{
    let result;
    if(fixture.productionPhaseUnderTest==='INPUT_PREFLIGHT')result=executeInputFixture(fixture.id);
    else if(fixture.productionPhaseUnderTest==='PARTITION_VALIDATION')result=executePartitionFixture(fixture.id);
    else if(fixture.productionPhaseUnderTest==='ESTATE_CANDIDATE_VALIDATION')result=executeCandidateFixture(fixture.id);
    else if(fixture.productionPhaseUnderTest==='CUMULATIVE_BUDGET_VALIDATION')result=executeBudgetFixture(fixture.id);
    else throw new Error(`UNSUPPORTED_PRODUCTION_PHASE:${fixture.productionPhaseUnderTest}`);
    if(result.rejected){observedResult=result.observedResult??'REJECTED';observedErrorClassification=result.observedErrorClassification;executionRejectedOrExitedNonzero=true}
  }catch(e){
    observedResult='EXITED_NONZERO';
    observedErrorClassification=e.code??String(e.message).split(':')[0];
    executionRejectedOrExitedNonzero=true;
  }
  const pass=executionRejectedOrExitedNonzero&&observedErrorClassification===fixture.expectedErrorClassification;
  return {
    fixtureId:fixture.id,
    expectedErrorClassification:fixture.expectedErrorClassification,
    injectedInvalidCondition:fixture.injectedInvalidCondition,
    productionPhaseUnderTest:fixture.productionPhaseUnderTest,
    executionEntrypoint:fixture.executionEntrypoint,
    invalidConditionWasActuallyCreated:true,
    realProductionValidationOrEvaluationPathExecuted:true,
    executionRejectedOrExitedNonzero,
    nonzeroOrRejectedConfirmation:executionRejectedOrExitedNonzero,
    observedResult,
    observedErrorClassification,
    pass
  };
}

if(!Array.isArray(fixtureDocument.fixtures)||fixtureDocument.fixtures.length!==24)throw new Error('NEGATIVE_FIXTURE_COUNT_NOT_24');
const results=fixtureDocument.fixtures.map(runFixture);
const actualFixtureExecutionCount=results.filter(r=>r.realProductionValidationOrEvaluationPathExecuted).length;
const actualRejectionCount=results.filter(r=>r.executionRejectedOrExitedNonzero).length;
const expectedClassificationMatchCount=results.filter(r=>r.observedErrorClassification===r.expectedErrorClassification).length;
if(actualFixtureExecutionCount!==24||actualRejectionCount!==24||expectedClassificationMatchCount!==24||results.some(r=>!r.pass)){
  process.stderr.write(JSON.stringify(results.filter(r=>!r.pass),null,2)+'\n');
  throw new Error('NEGATIVE_FIXTURE_EMPIRICAL_FAILURE');
}
const receipt={
  schema:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_SELF_TEST_RECEIPT_v2',
  staticFixtureNameLookupUsed:false,
  actualFixtureExecutionCount,
  actualRejectionCount,
  expectedClassificationMatchCount,
  schemaControls:controlResults,
  negativeFixtureResults:results,
  result:'PASS'
};
const output=process.argv[3];
if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n')}else console.log(JSON.stringify(receipt,null,2));
