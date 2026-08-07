import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  assembleIntegratedEnvironment,
  openIntegratedEntry,
  performIntegratedInteraction,
  adaptIntegratedViewport,
  createIntegratedDeepLink,
  restoreIntegratedDeepLink,
  inspectSpatialNode,
  attemptSpatialActivation,
  checkScientificRelation,
  checkEstateProjection
} from './integrated-environment-runtime.v1.mjs';
import {validateCameraRequest} from '../f8-spatial-xyz-semantic-layer/scene-projector.v1.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(here,name),'utf8'));
const manifest=read('integrated-environment-manifest.v1.json');
const fixtures=read('conformance-fixtures.v1.json');
const contract=read('assembly-contract.v1.json');
const receipt=read('f9-terminal-receipt.v1.json');
const sourceBindings=read('source-bindings.v1.json');
const normalize=value=>{
  if(Array.isArray(value)) return value.map(normalize);
  if(value!==null&&typeof value==='object') return Object.fromEntries(Object.keys(value).sort().map(key=>[key,normalize(value[key])]));
  return value;
};
const stable=value=>JSON.stringify(normalize(value));
const same=(a,b)=>stable(a)===stable(b);
const sorted=a=>[...a].sort((x,y)=>String(x).localeCompare(String(y)));
const assert=(condition,message)=>{if(!condition) throw new Error(message);};
const action=(controlId,modality='KEYBOARD',payload={})=>({schema:'METHODS_MODELS_INTERACTION_ACTION_v1',kind:'ACTIVATE',modality,controlId,payload});
const axisValue=(session,axis)=>session.interactionSession.state.axes[axis];

assert(sourceBindings.inputHead==='fc44591931d0b62d039bfaf9517d99ba56ad1c76','F9_INPUT_HEAD_MISMATCH');
assert(sourceBindings.inputTree==='4083597b2481696c282545feb51ab7918224d2f5','F9_INPUT_TREE_MISMATCH');
assert(contract.laws.includes('FINAL_F9_PASS_REQUIRES_EXECUTION_OF_THE_ASSEMBLED_OBJECT_NOT_THE_SUM_OF_COMPONENT_PASSES'),'INTEGRATED_PASS_LAW_MISSING');
assert(receipt.operation==='F9_INTEGRATED_ENVIRONMENT_ASSEMBLY_v1','F9_RECEIPT_OPERATION_MISMATCH');
assert(receipt.f10ExecutionAfterEffectivePass==='NOT_STARTED_REQUIRES_SEPARATE_AUTHORIZATION','F10_BOUNDARY_MISMATCH');
assert(receipt.f11ThroughF12Authority===false,'F11_F12_AUTHORITY_LEAK');

const environment=assembleIntegratedEnvironment();
assert(environment.schema==='METHODS_MODELS_F9_INTEGRATED_ENVIRONMENT_v1','ENVIRONMENT_SCHEMA_MISMATCH');
assert(environment.textFirstComplete===true,'TEXT_FIRST_NOT_COMPLETE');
assert(environment.spatialLayerRequiredForScientificInterpretation===false,'SPATIAL_LAYER_BECAME_SCIENCE_REQUIRED');
assert(environment.portfolioStudyCount===manifest.expectedCounts.portfolioStudies,'PORTFOLIO_COUNT_MISMATCH');
assert(environment.statefulEntryCount===manifest.expectedCounts.statefulEntries,'STATEFUL_COUNT_MISMATCH');
assert(environment.registries.nonStatefulPortfolioIds.length===manifest.expectedCounts.nonStatefulPortfolioStudies,'NON_STATEFUL_COUNT_MISMATCH');
assert(environment.scene.counts.claims===manifest.expectedCounts.canonicalClaims,'CLAIM_COUNT_MISMATCH');
assert(environment.scene.counts.typedRelations===manifest.expectedCounts.typedResultRelations,'RELATION_COUNT_MISMATCH');
assert(same(sorted(environment.registries.statefulEntryIds),sorted(manifest.statefulEntryIds)),'STATEFUL_ENTRY_SET_MISMATCH');
assert(environment.scene.nodes.every(n=>n.visualWeight===1),'SPATIAL_NODE_WEIGHT_NOT_CONSTANT');
assert(environment.scene.edges.every(e=>e.visualWeight===1),'SPATIAL_EDGE_WEIGHT_NOT_CONSTANT');
assert(environment.scene.nodes.every(n=>n.activation==='NONACTIVATING_UNLESS_UPSTREAM_CONTROL_BINDING_EXISTS'),'SPATIAL_NODE_ACTIVATION_DRIFT');
assert(validateCameraRequest(environment.scene.camera),'CAMERA_CONTRACT_INVALID');
assert(!validateCameraRequest(fixtures.negative.find(v=>v.id==='USER_CAMERA').request),'USER_CONTROLLED_CAMERA_ACCEPTED');

const modalities=['POINTER','KEYBOARD','TOUCH','ASSISTIVE_TECHNOLOGY'];
for(const entryPointId of environment.registries.statefulEntryIds){
  const opened=openIntegratedEntry(entryPointId,'D0',environment);
  assert(opened.valid,`ENTRY_OPEN_FAILED:${entryPointId}:${opened.errors}`);
  assert(opened.session.entryPointId===entryPointId,`ENTRY_IDENTITY_MISMATCH:${entryPointId}`);
  assert(axisValue(opened.session,'SCIENTIFIC_OBJECT').value.objectId===entryPointId,`SCIENTIFIC_OBJECT_MISMATCH:${entryPointId}`);
  const originalClaim=stable(axisValue(opened.session,'CLAIM_CEILING'));
  const originalBinding=opened.session.interactionSession.scientificBindingSha256;
  const originalScene=opened.session.sceneScienceDigest;

  let current=opened.session;
  for(const depth of ['D1','D2','D3','D4']){
    const moved=performIntegratedInteraction(current,action(`DEPTH_${depth}`),environment);
    assert(moved.valid,`DEPTH_FAILED:${entryPointId}:${depth}:${moved.errors}`);
    assert(moved.session.interactionSession.scientificBindingSha256===originalBinding,`DEPTH_BINDING_DRIFT:${entryPointId}:${depth}`);
    assert(moved.session.sceneScienceDigest===originalScene,`DEPTH_SCENE_DRIFT:${entryPointId}:${depth}`);
    assert(stable(axisValue(moved.session,'CLAIM_CEILING'))===originalClaim,`DEPTH_CLAIM_DRIFT:${entryPointId}:${depth}`);
    current=moved.session;
  }

  const modalityResults=modalities.map(modality=>performIntegratedInteraction(opened.session,action('DEPTH_D2',modality),environment));
  assert(modalityResults.every(r=>r.valid),`MODALITY_ACTION_FAILED:${entryPointId}`);
  const signature=r=>({entryPointId:r.session.entryPointId,state:r.session.interactionSession.scientificStateSha256,binding:r.session.interactionSession.scientificBindingSha256,depth:r.session.interactionSession.activeDepth,output:r.output});
  assert(modalityResults.slice(1).every(r=>same(signature(r),signature(modalityResults[0]))),`MODALITY_EQUIVALENCE_FAILED:${entryPointId}`);

  const motion=performIntegratedInteraction(opened.session,action('MOTION_PREFERENCE','KEYBOARD',{preference:'REDUCED'}),environment);
  assert(motion.valid,`MOTION_FAILED:${entryPointId}`);
  assert(motion.session.interactionSession.scientificStateSha256===opened.session.interactionSession.scientificStateSha256,`MOTION_STATE_DRIFT:${entryPointId}`);
  assert(motion.session.interactionSession.scientificBindingSha256===originalBinding,`MOTION_BINDING_DRIFT:${entryPointId}`);

  const mobile=adaptIntegratedViewport(opened.session,'MOBILE',environment);
  assert(mobile.valid,`VIEWPORT_FAILED:${entryPointId}`);
  assert(mobile.session.interactionSession.scientificStateSha256===opened.session.interactionSession.scientificStateSha256,`VIEWPORT_STATE_DRIFT:${entryPointId}`);
  assert(mobile.session.interactionSession.scientificBindingSha256===originalBinding,`VIEWPORT_BINDING_DRIFT:${entryPointId}`);

  const routed=performIntegratedInteraction(opened.session,action('NAVIGATE_ROUTE','KEYBOARD',{routeId:`F9_ROUTE_${entryPointId}`}),environment);
  assert(routed.valid,`ROUTE_FAILED:${entryPointId}:${routed.errors}`);
  assert(same(routed.output.changedAxes,['ROUTE_HISTORY']),`ROUTE_CHANGED_WRONG_AXES:${entryPointId}`);
  assert(axisValue(routed.session,'SCIENTIFIC_OBJECT').value.objectId===entryPointId,`ROUTE_OBJECT_DRIFT:${entryPointId}`);
  assert(stable(axisValue(routed.session,'CLAIM_CEILING'))===originalClaim,`ROUTE_CLAIM_DRIFT:${entryPointId}`);
  assert(routed.session.interactionSession.scientificBindingSha256===originalBinding,`ROUTE_BINDING_DRIFT:${entryPointId}`);
  const deepLink=createIntegratedDeepLink(routed.session,environment);
  const restored=restoreIntegratedDeepLink(deepLink,environment);
  assert(restored.valid,`DEEPLINK_RESTORE_FAILED:${entryPointId}:${restored.errors}`);
  assert(restored.session.interactionSession.scientificStateSha256===routed.session.interactionSession.scientificStateSha256,`DEEPLINK_STATE_MISMATCH:${entryPointId}`);
  assert(stable(axisValue(restored.session,'CLAIM_CEILING'))===originalClaim,`DEEPLINK_CLAIM_DRIFT:${entryPointId}`);
}

for(const id of environment.registries.nonStatefulPortfolioIds){
  const opened=openIntegratedEntry(id,'D0',environment);
  assert(!opened.valid&&opened.errors.includes('ENTRYPOINT_NOT_STATEFUL_OR_NOT_REGISTERED'),`NON_STATEFUL_PROMOTED_TO_ENTRY:${id}`);
  const inspected=inspectSpatialNode(`STUDY:${id}`,environment);
  assert(inspected.valid,`NON_STATEFUL_SCENE_NODE_MISSING:${id}`);
  assert(inspected.record.statefulEntryAvailable===false,`NON_STATEFUL_ENTRY_FLAG_TRUE:${id}`);
  assert(inspected.record.activated===false,`NON_STATEFUL_NODE_ACTIVATED:${id}`);
  const activation=attemptSpatialActivation(`STUDY:${id}`,environment);
  assert(!activation.valid,`NON_STATEFUL_SPATIAL_ACTIVATION_SUCCEEDED:${id}`);
}

for(const edge of environment.scene.edges.filter(e=>e.edgeKind==='SCIENTIFIC_RELATION_EDGE')){
  assert(checkScientificRelation({relationId:edge.relationId,studyId:edge.source.slice('STUDY:'.length),claimId:edge.target.slice('CLAIM:'.length),type:edge.relationType,direction:edge.direction,standing:edge.standing}),`SCIENTIFIC_EDGE_NOT_AUTHORIZED:${edge.id}`);
}
for(const edge of environment.scene.edges.filter(e=>e.edgeKind==='GOVERNED_PROJECTION_EDGE')){
  assert(checkEstateProjection(edge.claimId,edge.destination),`PROJECTION_EDGE_NOT_AUTHORIZED:${edge.id}`);
}
assert(checkScientificRelation({relationId:'F9_INFERRED_RELATION',studyId:'BIO_LAB',claimId:'UCIC_CLAIM_EMPIRICAL_UNIVERSALITY',type:'INFERRED',direction:'SUPPORTING',standing:'F9'})===false,'INFERRED_RELATION_ACCEPTED');
assert(checkEstateProjection('UCIC_CLAIM_GENERAL_BANK_COLLAPSE_EARLY_WARNING','APPLICATIONS')===false,'UNAUTHORIZED_PROJECTION_ACCEPTED');
assert(attemptSpatialActivation('STUDY:BIO_LAB',environment).valid===false,'SPATIAL_NODE_BYPASSED_CONTROLS');
assert(openIntegratedEntry('INDEPENDENT_ROUTE_IDENTIFICATION_PROTOCOL','D0',environment).valid===false,'PROTOCOL_PROMOTED_TO_ENTRY');
assert(openIntegratedEntry('F9_INVENTED_STUDY','D0',environment).valid===false,'INVENTED_ENTRY_ACCEPTED');

const tampered=openIntegratedEntry('BIO_LAB','D0',environment);
assert(tampered.valid,'TAMPER_FIXTURE_OPEN_FAILED');
tampered.session.interactionSession.state.axes.CLAIM_CEILING.value.ceilingId='F9_PROMOTED_CLAIM';
const tamperResult=performIntegratedInteraction(tampered.session,{schema:'METHODS_MODELS_INTERACTION_ACTION_v1',kind:'FOCUS',modality:'KEYBOARD',controlId:'FOCUS_TARGET',payload:{}},environment);
assert(!tamperResult.valid,'TAMPERED_SESSION_LEGITIMIZED');

assert(receipt.integrationCreatesScientificMeaning===false,'F9_SCIENTIFIC_MEANING_CREATION');
assert(receipt.integrationCreatesCrossObjectRelation===false,'F9_RELATION_CREATION');
assert(receipt.portfolioVisibilityCreatesEntryAuthority===false,'F9_PORTFOLIO_ENTRY_PROMOTION');
assert(receipt.f1ThroughF8Rewrite===false,'F1_F8_REWRITE_RECORDED');
assert(receipt.scientificClaimUpgrade===false,'CLAIM_UPGRADE_RECORDED');
assert(receipt.publicMethodsMutation===false&&receipt.publicLawsMutation===false&&receipt.pr541Mutation===false,'PUBLIC_OR_PR541_MUTATION_RECORDED');

process.stdout.write(JSON.stringify({
  disposition:'PASS_F9_INTEGRATED_ENVIRONMENT_ASSEMBLY_v1',
  environmentScienceDigest:environment.environmentScienceDigest,
  sceneScienceDigest:environment.scene.scienceDigest,
  statefulEntries:environment.statefulEntryCount,
  nonStatefulPortfolioStudies:environment.registries.nonStatefulPortfolioIds.length,
  portfolioStudies:environment.portfolioStudyCount,
  canonicalClaims:environment.scene.counts.claims,
  typedRelations:environment.scene.counts.typedRelations,
  integratedEntryExecutionsVerified:environment.registries.statefulEntryIds.length,
  modalityEquivalenceVerifiedForAllEntries:true,
  deepLinkContinuityVerifiedForAllEntries:true,
  f10Execution:'NOT_STARTED'
},null,2)+'\n');
