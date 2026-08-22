#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {loadAcceptedLocalReference,IDENTITIES} from './accepted-local-reference-loader.v1.mjs';
import {buildRealTerrainPartition} from './real-terrain-partition.v1.mjs';
import {searchConnectedMultiZoneEstate} from './estate-multizone-search.v1.mjs';
import {evaluateCumulativeBudgets} from './cumulative-budget-evaluator.v1.mjs';

export const REPOSITORY_IDENTITY='smansfield635-create/smansfield635-create.github.io';
export const INPUT_INSTANCE_SCHEMA='H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_INPUT_INSTANCE_v1';
export const OUTPUT_INSTANCE_SCHEMA='H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_OUTPUT_INSTANCE_v1';
export const REQUIRED_SUBZONES=Object.freeze([
  'PRINCIPAL_MANOR_ZONE',
  'INTER_HILL_COMPOSITIONAL_AXIS',
  'FIRST_HILL_ESTATE_ZONE',
  'SECOND_HILL_ESTATE_ZONE',
  'HILL_SHOULDER_AND_TERRACE_ZONES',
  'FORMAL_GROUNDS',
  'GARDENS',
  'COURTYARDS',
  'OUTBUILDING_AND_SERVICE_ZONE',
  'PRIMARY_ARRIVAL_ROUTE',
  'SERVICE_ROUTE',
  'FUTURE_EXPANSION_ZONE',
  'MOUNTAINWARD_VIEW_CORRIDOR',
  'OCEANWARD_VIEW_CORRIDOR',
  'TERRAIN_GRADING_AND_TRANSITION_BUFFERS'
]);
export const REQUIRED_PROHIBITED_ACTIONS=Object.freeze([
  'TERRAIN_CONSTRUCTION',
  'MANOR_CONSTRUCTION',
  'PRODUCT_FILE_MUTATION',
  'TERRAIN_FILE_MUTATION',
  'RUNTIME_IMPORT_OF_ANALYSIS_COMPOSITE',
  'PREVIEW_PUBLICATION',
  'MERGE',
  'DEPLOYMENT',
  'CLAIM_R06_C10_MERGED_MAIN'
]);

export const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
export const canonical=v=>JSON.stringify(stable(v));
export const digest=v=>createHash('sha256').update(canonical(v)).digest('hex');
export const deepClone=v=>JSON.parse(JSON.stringify(v));
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));

export function codedError(code,detail=null){
  const e=new Error(detail?`${code}:${detail}`:code);
  e.code=code;
  e.detail=detail;
  return e;
}

const equal=(a,b)=>canonical(a)===canonical(b);
const typeName=v=>v===null?'null':Array.isArray(v)?'array':Number.isInteger(v)?'integer':typeof v;
const matchesType=(v,t)=>{
  if(t==='object')return !!v&&typeof v==='object'&&!Array.isArray(v);
  if(t==='array')return Array.isArray(v);
  if(t==='integer')return Number.isInteger(v);
  if(t==='number')return typeof v==='number'&&Number.isFinite(v);
  if(t==='null')return v===null;
  return typeof v===t;
};

function schemaFailure(errorCode,phase,pointer,reason){
  throw codedError(errorCode,`${phase}:${pointer}:${reason}`);
}

function validateSchemaNode(value,schema,{errorCode,phase,pointer='$'}){
  if(!schema||typeof schema!=='object'||Array.isArray(schema))schemaFailure(errorCode,phase,pointer,'SCHEMA_NODE_INVALID');
  if(Array.isArray(schema.anyOf)){
    const errors=[];
    for(const branch of schema.anyOf){
      try{validateSchemaNode(value,branch,{errorCode,phase,pointer});return}
      catch(e){errors.push(e.message)}
    }
    schemaFailure(errorCode,phase,pointer,'ANY_OF_NO_MATCH');
  }
  if(Object.prototype.hasOwnProperty.call(schema,'const')&&!equal(value,schema.const))schemaFailure(errorCode,phase,pointer,'CONST_MISMATCH');
  if(Array.isArray(schema.enum)&&!schema.enum.some(v=>equal(v,value)))schemaFailure(errorCode,phase,pointer,'ENUM_MISMATCH');
  if(schema.type&&!matchesType(value,schema.type))schemaFailure(errorCode,phase,pointer,`TYPE_${typeName(value)}_NOT_${schema.type}`);

  if(matchesType(value,'object')){
    const properties=schema.properties??{};
    for(const key of schema.required??[])if(!Object.prototype.hasOwnProperty.call(value,key))schemaFailure(errorCode,phase,`${pointer}/${key}`,'REQUIRED_PROPERTY_MISSING');
    for(const [key,child] of Object.entries(properties))if(Object.prototype.hasOwnProperty.call(value,key))validateSchemaNode(value[key],child,{errorCode,phase,pointer:`${pointer}/${key}`});
    if(schema.additionalProperties===false){
      const extra=Object.keys(value).filter(k=>!Object.prototype.hasOwnProperty.call(properties,k));
      if(extra.length)schemaFailure(errorCode,phase,`${pointer}/${extra[0]}`,'ADDITIONAL_PROPERTY_PROHIBITED');
    }
  }
  if(Array.isArray(value)){
    if(Number.isInteger(schema.minItems)&&value.length<schema.minItems)schemaFailure(errorCode,phase,pointer,'MIN_ITEMS');
    if(Number.isInteger(schema.maxItems)&&value.length>schema.maxItems)schemaFailure(errorCode,phase,pointer,'MAX_ITEMS');
    if(schema.uniqueItems===true){
      const values=value.map(canonical);
      if(new Set(values).size!==values.length)schemaFailure(errorCode,phase,pointer,'UNIQUE_ITEMS');
    }
    if(schema.items)for(let i=0;i<value.length;i++)validateSchemaNode(value[i],schema.items,{errorCode,phase,pointer:`${pointer}/${i}`});
  }
  if(typeof value==='string'){
    if(Number.isInteger(schema.minLength)&&value.length<schema.minLength)schemaFailure(errorCode,phase,pointer,'MIN_LENGTH');
    if(Number.isInteger(schema.maxLength)&&value.length>schema.maxLength)schemaFailure(errorCode,phase,pointer,'MAX_LENGTH');
    if(schema.pattern&&!new RegExp(schema.pattern).test(value))schemaFailure(errorCode,phase,pointer,'PATTERN_MISMATCH');
  }
  if(typeof value==='number'&&Number.isFinite(value)){
    if(typeof schema.minimum==='number'&&value<schema.minimum)schemaFailure(errorCode,phase,pointer,'MINIMUM');
    if(typeof schema.maximum==='number'&&value>schema.maximum)schemaFailure(errorCode,phase,pointer,'MAXIMUM');
  }
}

export function validateJsonSchemaInstance(instance,schema,{errorCode='SCHEMA_VALIDATION_FAILED',phase='UNSPECIFIED'}={}){
  if(!schema||typeof schema!=='object'||typeof schema.$id!=='string')throw codedError(errorCode,`${phase}:SCHEMA_ID_MISSING`);
  validateSchemaNode(instance,schema,{errorCode,phase});
  return Object.freeze({schemaId:schema.$id,phase,result:'PASS'});
}

export function buildEvaluatorInput({requirements,operators,governingMain=IDENTITIES.governingMain}){
  return {
    schema:INPUT_INSTANCE_SCHEMA,
    repositoryIdentity:REPOSITORY_IDENTITY,
    governingMainIdentity:governingMain,
    sourceIdentities:deepClone(requirements.sourceIdentities),
    estateIdentityCorrection:deepClone(requirements.estateIdentityCorrection),
    terrainDomain:deepClone(requirements.terrainDomain),
    witnesses:deepClone(requirements.witnesses),
    requiredEstateSubzones:[...requirements.requiredEstateSubzones],
    prohibitedActions:[...requirements.prohibitedActions],
    estateModel:{
      modelClass:'CONNECTED_MULTI_ZONE_IRREGULAR',
      rectangularPadModel:false,
      fixedDimensions:null
    },
    operatorFamilyRegistry:deepClone(operators)
  };
}

const samePoint=(a,b)=>a&&b&&Number(a.x)===Number(b.x)&&Number(a.z)===Number(b.z);
const assertExact=(condition,code,detail=null)=>{if(!condition)throw codedError(code,detail)};

export function validateEvaluatorInputSemantics(input){
  assertExact(input.repositoryIdentity===REPOSITORY_IDENTITY,'REPOSITORY_IDENTITY_MISMATCH');
  assertExact(input.governingMainIdentity===IDENTITIES.governingMain,'CURRENT_MAIN_HEAD_MISMATCH',input.governingMainIdentity);
  const current=input.sourceIdentities?.currentTerrain;
  const accepted=input.sourceIdentities?.acceptedLocalReference;
  assertExact(current?.head===IDENTITIES.currentTerrain.head,'CURRENT_TERRAIN_HEAD_MISMATCH');
  assertExact(current?.path===IDENTITIES.currentTerrain.path,'CURRENT_TERRAIN_PATH_MISMATCH');
  assertExact(current?.blob===IDENTITIES.currentTerrain.blob,'CURRENT_TERRAIN_BLOB_MISMATCH',current?.blob??'MISSING');
  assertExact(accepted?.head===IDENTITIES.accepted.head,'ACCEPTED_R06_C10_HEAD_MISMATCH');
  assertExact(accepted?.deltaPath===IDENTITIES.accepted.deltaPath,'ACCEPTED_R06_C10_PATH_MISMATCH');
  assertExact(accepted?.deltaBlob===IDENTITIES.accepted.deltaBlob,'ACCEPTED_R06_C10_BLOB_MISMATCH',accepted?.deltaBlob??'MISSING');
  assertExact(accepted?.successorFieldPath===IDENTITIES.accepted.successorFieldPath,'ACCEPTED_SUCCESSOR_FIELD_PATH_MISMATCH');
  assertExact(accepted?.successorFieldBlob===IDENTITIES.accepted.successorFieldBlob,'ACCEPTED_SUCCESSOR_FIELD_BLOB_MISMATCH',accepted?.successorFieldBlob??'MISSING');
  assertExact(accepted?.mergedMain===false,'ACCEPTED_REFERENCE_CLAIMED_MERGED_MAIN');

  const correction=input.estateIdentityCorrection;
  assertExact(!!correction?.lineageCenter&&!!correction?.rejectedReservation,'IDENTITY_CORRECTION_MISSING');
  assertExact(correction.rejectedReservation.silentSubstitution===false,'IDENTITY_CORRECTION_MISSING','SILENT_SUBSTITUTION_NOT_FALSE');
  assertExact(correction.rejectedReservation.rejectionClass==='ERRONEOUS_ESTATE_SPATIAL_IDENTITY','IDENTITY_CORRECTION_MISSING','REJECTION_CLASS');
  assertExact(!samePoint(correction.lineageCenter,correction.rejectedReservation),'ERRONEOUS_ESTATE_SPATIAL_IDENTITY_ACCEPTED');
  assertExact(samePoint(correction.lineageCenter,{x:80,z:-172}),'ESTATE_LINEAGE_CENTER_MISMATCH');
  assertExact(samePoint(correction.rejectedReservation,{x:67.25,z:-16.85}),'ERRONEOUS_ESTATE_RESERVATION_IDENTITY_MISMATCH');

  const d=input.terrainDomain;
  assertExact(d.rows===256&&d.columns===256&&d.nodeCount===65536,'SYNTHETIC_DOMAIN_PRODUCTION_USE');
  assertExact(d.fourNeighborEdgeCount===130560&&d.eightNeighborEdgeCount===260610,'TERRAIN_DOMAIN_ADJACENCY_COUNT_MISMATCH');
  assertExact(input.estateModel?.rectangularPadModel===false,'ONE_RECTANGULAR_PAD_MODEL_USED');
  const fixed=input.estateModel?.fixedDimensions;
  if(fixed&&Number(fixed.width)===30&&Number(fixed.depth)===22)throw codedError('FIXED_30_BY_22_REQUIREMENT_REINTRODUCED');
  if(fixed&&Number(fixed.width)===32&&Number(fixed.depth)===24)throw codedError('FIXED_32_BY_24_REQUIREMENT_REINTRODUCED');
  assertExact(input.estateModel?.modelClass==='CONNECTED_MULTI_ZONE_IRREGULAR','ESTATE_MODEL_CLASS_MISMATCH');

  const subzones=new Set(input.requiredEstateSubzones);
  for(const id of REQUIRED_SUBZONES)assertExact(subzones.has(id),'REQUIRED_ESTATE_SUBZONE_MISSING',id);
  const prohibited=new Set(input.prohibitedActions);
  for(const id of REQUIRED_PROHIBITED_ACTIONS)assertExact(prohibited.has(id),'PROHIBITED_ACTION_BOUNDARY_MISSING',id);
  assertExact(input.operatorFamilyRegistry?.productionAuthority===false,'OPERATOR_FAMILY_PRODUCTION_AUTHORITY_FORBIDDEN');
  assertExact(Array.isArray(input.operatorFamilyRegistry?.families)&&input.operatorFamilyRegistry.families.length>=6,'OPERATOR_FAMILY_REGISTRY_INCOMPLETE');
  return Object.freeze({result:'PASS',phase:'INPUT_PREFLIGHT',governingMain:input.governingMainIdentity});
}

export function validateEvaluatorInput(input,inputSchema){
  let schemaReceipt;
  try{
    schemaReceipt=validateJsonSchemaInstance(input,inputSchema,{errorCode:'INPUT_SCHEMA_VALIDATION_FAILED',phase:'INPUT_PREFLIGHT'});
  }catch(e){
    if(e.code==='INPUT_SCHEMA_VALIDATION_FAILED'&&String(e.detail).includes('estateIdentityCorrection/rejectedReservation:REQUIRED_PROPERTY_MISSING'))throw codedError('IDENTITY_CORRECTION_MISSING',e.detail);
    throw e;
  }
  const semanticReceipt=validateEvaluatorInputSemantics(input);
  return Object.freeze({schemaReceipt,semanticReceipt,result:'PASS'});
}

function rowRunMask(graph,nodeIds){
  const rows=new Map();
  for(const id of [...new Set(nodeIds)].sort((a,b)=>a-b)){
    const n=graph.nodes[id];
    if(!rows.has(n.row))rows.set(n.row,[]);
    rows.get(n.row).push(n.column);
  }
  const runs=[];
  for(const[r,cols]of rows){
    cols.sort((a,b)=>a-b);
    let start=cols[0],prev=cols[0];
    for(let i=1;i<=cols.length;i++){
      const c=cols[i];
      if(c!==prev+1){
        const x0=graph.nodes[r*graph.columns+start].worldX-graph.xSampleInterval/2;
        const x1=graph.nodes[r*graph.columns+prev].worldX+graph.xSampleInterval/2;
        const z=graph.nodes[r*graph.columns+start].worldZ;
        runs.push({row:r,columnStart:start,columnEnd:prev,polygon:[[x0,z-graph.zSampleInterval/2],[x1,z-graph.zSampleInterval/2],[x1,z+graph.zSampleInterval/2],[x0,z+graph.zSampleInterval/2],[x0,z-graph.zSampleInterval/2]]});
        start=c;
      }
      prev=c;
    }
  }
  const reconstructed=[];
  for(const run of runs)for(let c=run.columnStart;c<=run.columnEnd;c++)reconstructed.push(run.row*graph.columns+c);
  const source=[...new Set(nodeIds)].sort((a,b)=>a-b);
  if(JSON.stringify(source)!==JSON.stringify(reconstructed))throw codedError('MICRO_NODE_WORLD_POLYGON_MASK_INEQUALITY');
  return {MICRO_NODE_ID_SET:source,WORLD_SPACE_POLYGON_OR_MULTIPOLYGON:{type:'MultiPolygon',rowRunRectangles:runs},equalityPass:true,digest:digest({source,runs})};
}

export function buildOutputSchemaControlFixture(){
  const output={
    schema:OUTPUT_INSTANCE_SCHEMA,
    identityVerification:{
      governingMain:IDENTITIES.governingMain,
      currentBlob:IDENTITIES.currentTerrain.blob,
      acceptedDeltaBlob:IDENTITIES.accepted.deltaBlob,
      acceptedSuccessorBlob:IDENTITIES.accepted.successorFieldBlob,
      acceptedReferenceMergedMain:false,
      pass:true,
      materializedAcceptedDeltaSha256:'0'.repeat(64)
    },
    estateIdentityCorrection:{acceptedLineageCenter:{x:80,z:-172},rejectedReservation:{x:67.25,z:-16.85},correctionRecord:'DISTINCT_NOT_SILENT'},
    sourceModeComparison:{},
    realTerrainPartition:{mode:'CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE',rows:256,columns:256,landformCounts:{},macrozoneCount:1,rearMountainNodeCount:1},
    partitionCoverageReceipt:{nodeCount:65536,requiredNodeCount:65536,pass:true,partitionDigest:'0'.repeat(64)},
    realAdjacencyReceipt:{fourNeighborEdgeCount:130560,eightNeighborEdgeCount:260610,requiredFour:130560,requiredEight:260610,pass:true,adjacencyDigest:'0'.repeat(64)},
    hillAndGullyRelationship:{},
    estateSearchDomain:{},
    candidateArrangementCount:0,
    rejectedCandidateSummary:[],
    paretoFrontier:[],
    selectedArrangement:null,
    estateSubzoneMasks:{},
    requiredEstateSubzones:[...REQUIRED_SUBZONES],
    principalManorCapacity:null,
    formalGroundsCapacity:null,
    gardenCapacity:null,
    outbuildingCapacity:null,
    futureExpansionCapacity:null,
    primaryRoute:null,
    serviceRoute:null,
    mountainViewCorridor:null,
    oceanViewCorridor:null,
    gradingAndTransitionBuffers:null,
    r06c10PreservationOverlay:{bounds:{},deltaAuthorized:0,intrusionCount:0},
    cavernPreservationOverlay:{intrusionCount:0,status:'PRESERVED_ANALYSIS_ONLY'},
    operatorFamilyAdmissionMatrix:[],
    candidateConstructionBudgets:{},
    role1PotentialPathBoundary:{pathCount:16,additiveOnly:true,terrainConstructionAuthority:false,manorConstructionAuthority:false,mergeAuthority:false},
    verificationPlan:{freshRole3Required:true,twoIdenticalPositiveExecutions:true,negativeFixtureCount:24},
    validationEvidence:{
      inputSchemaId:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_INPUT_v1',
      outputSchemaId:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_OUTPUT_v1',
      inputSchemaValidatedBeforeTerrainLoad:true,
      outputSchemaValidatedBeforeDigestFinalization:true,
      finalOutputValidatedBeforeWrite:true
    },
    disposition:'EVALUATOR_COMPLETE_NO_HARD_GATE_PASSING_ARRANGEMENT',
    outputDigest:null
  };
  return output;
}

export function validateEvaluatorOutputSemantics(output,{phase='FINAL'}={}){
  const id=output.identityVerification;
  assertExact(id.governingMain===IDENTITIES.governingMain,'OUTPUT_GOVERNING_MAIN_IDENTITY_MISMATCH');
  assertExact(id.currentBlob===IDENTITIES.currentTerrain.blob,'OUTPUT_CURRENT_TERRAIN_BLOB_MISMATCH');
  assertExact(id.acceptedDeltaBlob===IDENTITIES.accepted.deltaBlob,'OUTPUT_ACCEPTED_R06_C10_BLOB_MISMATCH');
  assertExact(id.acceptedSuccessorBlob===IDENTITIES.accepted.successorFieldBlob,'OUTPUT_ACCEPTED_SUCCESSOR_FIELD_BLOB_MISMATCH');
  assertExact(id.acceptedReferenceMergedMain===false&&id.pass===true,'OUTPUT_SOURCE_IDENTITY_VERIFICATION_INVALID');
  assertExact(output.realTerrainPartition.rows===256&&output.realTerrainPartition.columns===256,'OUTPUT_TERRAIN_DOMAIN_MISMATCH');
  assertExact(output.partitionCoverageReceipt.nodeCount===65536&&output.partitionCoverageReceipt.requiredNodeCount===65536&&output.partitionCoverageReceipt.pass===true,'OUTPUT_NODE_COUNT_MISMATCH');
  assertExact(output.realAdjacencyReceipt.fourNeighborEdgeCount===130560&&output.realAdjacencyReceipt.eightNeighborEdgeCount===260610&&output.realAdjacencyReceipt.pass===true,'OUTPUT_ADJACENCY_COUNT_MISMATCH');
  const subzones=new Set(output.requiredEstateSubzones);
  for(const id of REQUIRED_SUBZONES)assertExact(subzones.has(id),'OUTPUT_REQUIRED_SUBZONE_MISSING',id);
  const b=output.role1PotentialPathBoundary;
  assertExact(b.pathCount===16&&b.additiveOnly===true,'OUTPUT_PATH_BOUNDARY_INVALID');
  assertExact(b.terrainConstructionAuthority===false&&b.manorConstructionAuthority===false&&b.mergeAuthority===false,'OUTPUT_AUTHORITY_BOUNDARY_BREACH');
  assertExact(['EVALUATOR_COMPLETE_FEASIBLE_ARRANGEMENT_IDENTIFIED','EVALUATOR_COMPLETE_NO_HARD_GATE_PASSING_ARRANGEMENT'].includes(output.disposition),'OUTPUT_DISPOSITION_INVALID');
  const v=output.validationEvidence;
  assertExact(v.inputSchemaValidatedBeforeTerrainLoad===true,'INPUT_SCHEMA_NOT_EXECUTED_BEFORE_TERRAIN');
  assertExact(v.outputSchemaValidatedBeforeDigestFinalization===true,'OUTPUT_SCHEMA_NOT_EXECUTED_BEFORE_DIGEST');
  assertExact(v.finalOutputValidatedBeforeWrite===true,'OUTPUT_SCHEMA_NOT_EXECUTED_BEFORE_WRITE');
  if(phase==='PRE_DIGEST')assertExact(output.outputDigest===null,'OUTPUT_DIGEST_PREMATURELY_FINALIZED');
  if(phase==='FINAL'){
    assertExact(typeof output.outputDigest==='string'&&/^[0-9a-f]{64}$/.test(output.outputDigest),'OUTPUT_DIGEST_SHAPE_INVALID');
    const expected=digest({...output,outputDigest:null});
    assertExact(output.outputDigest===expected,'OUTPUT_DIGEST_MISMATCH');
  }
  return Object.freeze({result:'PASS',phase});
}

export function validateEvaluatorOutput(output,outputSchema,{phase='FINAL'}={}){
  const schemaReceipt=validateJsonSchemaInstance(output,outputSchema,{errorCode:'OUTPUT_SCHEMA_VALIDATION_FAILED',phase:`OUTPUT_${phase}`});
  const semanticReceipt=validateEvaluatorOutputSemantics(output,{phase});
  return Object.freeze({schemaReceipt,semanticReceipt,result:'PASS'});
}

export async function evaluateInterHillEstate({
  root='.',
  governingMain=IDENTITIES.governingMain,
  requirementsPath=null,
  operatorFamilyPath=null,
  inputSchemaPath=null,
  outputSchemaPath=null
}={}){
  const control='h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator';
  const reqPath=requirementsPath??path.join(root,control,'requirements.v1.json');
  const opPath=operatorFamilyPath??path.join(root,control,'operator-family-admission.v1.json');
  const inSchemaPath=inputSchemaPath??path.join(root,control,'input-schema.v1.json');
  const outSchemaPath=outputSchemaPath??path.join(root,control,'output-schema.v1.json');
  const requirements=readJson(reqPath);
  const operators=readJson(opPath);
  const inputSchema=readJson(inSchemaPath);
  const outputSchema=readJson(outSchemaPath);
  const inputInstance=buildEvaluatorInput({requirements,operators,governingMain});
  validateEvaluatorInput(inputInstance,inputSchema);

  const source=await loadAcceptedLocalReference({root,governingMain});
  try{
    const modeResults={};
    for(const [modeId,mode] of Object.entries(source.modes)){
      const partition=buildRealTerrainPartition({sampleElevation:mode.sampleElevation,requirements,mode:modeId});
      const search=searchConnectedMultiZoneEstate({graph:partition,requirements});
      const budget=evaluateCumulativeBudgets({graph:partition,selectedArrangement:search.selectedArrangement,requirements,operatorFamilies:operators});
      modeResults[modeId]={partition,search,budget};
    }
    const primary=modeResults.CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE;
    const selected=primary.search.selectedArrangement;
    const masks={};
    if(selected)for(const[k,ids]of Object.entries(selected.masks))masks[k]=rowRunMask(primary.partition,ids);
    const compactModes=Object.fromEntries(Object.entries(modeResults).map(([k,v])=>[k,{
      partitionDigest:v.partition.partitionDigest,
      adjacencyDigest:v.partition.adjacencyDigest,
      nodeCount:v.partition.nodeCount,
      fourNeighborEdgeCount:v.partition.fourNeighborEdgeCount,
      eightNeighborEdgeCount:v.partition.eightNeighborEdgeCount,
      rearMountainNodeCount:v.partition.rearMountainNodeCount,
      candidateSetDigest:v.search.candidateSetDigest,
      paretoFrontierDigest:v.search.paretoFrontierDigest,
      selectedArrangementDigest:v.search.selectedArrangementDigest,
      candidateArrangementCount:v.search.candidateArrangementCount
    }]));
    const output={
      schema:OUTPUT_INSTANCE_SCHEMA,
      identityVerification:source.identityVerification,
      estateIdentityCorrection:{acceptedLineageCenter:requirements.estateIdentityCorrection.lineageCenter,rejectedReservation:requirements.estateIdentityCorrection.rejectedReservation,correctionRecord:'DISTINCT_NOT_SILENT'},
      sourceModeComparison:compactModes,
      realTerrainPartition:{mode:primary.partition.mode,rows:primary.partition.rows,columns:primary.partition.columns,landformCounts:primary.partition.landformCounts,macrozoneCount:primary.partition.macrozones.length,rearMountainNodeCount:primary.partition.rearMountainNodeCount},
      partitionCoverageReceipt:{nodeCount:primary.partition.nodeCount,requiredNodeCount:65536,pass:primary.partition.nodeCount===65536,partitionDigest:primary.partition.partitionDigest},
      realAdjacencyReceipt:{fourNeighborEdgeCount:primary.partition.fourNeighborEdgeCount,eightNeighborEdgeCount:primary.partition.eightNeighborEdgeCount,requiredFour:130560,requiredEight:260610,pass:primary.partition.fourNeighborEdgeCount===130560&&primary.partition.eightNeighborEdgeCount===260610,adjacencyDigest:primary.partition.adjacencyDigest},
      hillAndGullyRelationship:requirements.witnesses,
      estateSearchDomain:primary.search.searchDomain,
      candidateArrangementCount:primary.search.candidateArrangementCount,
      rejectedCandidateSummary:primary.search.rejectedCandidateSummary,
      paretoFrontier:primary.search.paretoFrontier,
      selectedArrangement:selected?{candidateId:selected.candidateId,principalNodeId:selected.principalNodeId,score:selected.score,hardGatePass:selected.hardGatePass,metrics:selected.metrics}:null,
      estateSubzoneMasks:masks,
      requiredEstateSubzones:[...requirements.requiredEstateSubzones],
      principalManorCapacity:selected?.capacity??null,
      formalGroundsCapacity:selected?{nodeCount:selected.masks.FORMAL_GROUNDS.length}:null,
      gardenCapacity:selected?{nodeCount:selected.masks.GARDENS.length}:null,
      outbuildingCapacity:selected?{nodeCount:selected.masks.OUTBUILDING_AND_SERVICE_ZONE.length}:null,
      futureExpansionCapacity:selected?{nodeCount:selected.masks.FUTURE_EXPANSION_ZONE.length}:null,
      primaryRoute:selected?.views.primaryRoute??null,
      serviceRoute:selected?.views.serviceRoute??null,
      mountainViewCorridor:selected?.views.mountainView??null,
      oceanViewCorridor:selected?.views.oceanView??null,
      gradingAndTransitionBuffers:selected?masks.TERRAIN_GRADING_AND_TRANSITION_BUFFERS:null,
      r06c10PreservationOverlay:{bounds:requirements.r06c10PreservationBounds,deltaAuthorized:0,intrusionCount:0},
      cavernPreservationOverlay:{intrusionCount:0,status:'PRESERVED_ANALYSIS_ONLY'},
      operatorFamilyAdmissionMatrix:primary.budget.operatorFamilyAdmissionMatrix,
      candidateConstructionBudgets:primary.budget.candidateConstructionBudgets,
      role1PotentialPathBoundary:{pathCount:16,additiveOnly:true,terrainConstructionAuthority:false,manorConstructionAuthority:false,mergeAuthority:false},
      verificationPlan:{freshRole3Required:true,twoIdenticalPositiveExecutions:true,negativeFixtureCount:24},
      validationEvidence:{
        inputSchemaId:inputSchema.$id,
        outputSchemaId:outputSchema.$id,
        inputSchemaValidatedBeforeTerrainLoad:true,
        outputSchemaValidatedBeforeDigestFinalization:true,
        finalOutputValidatedBeforeWrite:true
      },
      disposition:selected?'EVALUATOR_COMPLETE_FEASIBLE_ARRANGEMENT_IDENTIFIED':'EVALUATOR_COMPLETE_NO_HARD_GATE_PASSING_ARRANGEMENT',
      outputDigest:null
    };
    validateEvaluatorOutput(output,outputSchema,{phase:'PRE_DIGEST'});
    output.outputDigest=digest({...output,outputDigest:null});
    validateEvaluatorOutput(output,outputSchema,{phase:'FINAL'});
    return output;
  }finally{
    source.cleanup();
  }
}
