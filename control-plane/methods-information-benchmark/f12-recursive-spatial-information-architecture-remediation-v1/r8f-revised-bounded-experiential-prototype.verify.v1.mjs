import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  ENGINE_ID,
  canonicalInvariantDigest,
  embedCoordinateState,
  compileChart
} from './r8d-deterministic-coordinate-embedding-engine.v1.mjs';

const require=createRequire(import.meta.url);
const ROOT='control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1';
const PROTO=`${ROOT}/r8f-revised-bounded-experiential-prototype`;
const CONTRACT_PATH=`${ROOT}/r8f-revised-bounded-experiential-prototype-contract.v1.json`;
const contract=JSON.parse(readFileSync(CONTRACT_PATH,'utf8'));
const DATA=require('./r8f-revised-bounded-experiential-prototype/prototype-data.js');
const COORD=require('./r8f-revised-bounded-experiential-prototype/prototype-coordinate-state.js');
const PROJECTION=require('./r8f-revised-bounded-experiential-prototype/prototype-projection-state.js');
const html=readFileSync(`${PROTO}/index.html`,'utf8');
const css=readFileSync(`${PROTO}/styles.css`,'utf8');
const app=readFileSync(`${PROTO}/app.js`,'utf8');

const eq=(a,b,label)=>assert.deepEqual(a,b,label);
const yes=(v,label)=>assert.equal(v,true,label);
const no=(v,label)=>assert.equal(v,false,label);
const has=(a,v,label)=>assert.ok(Array.isArray(a)&&a.includes(v),label);
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();

const R8E='5c570a7f5c0e77b91130fbad3df16abf059a53ee';
eq(git('rev-parse','HEAD^'),R8E,'exact R8E parent');
eq(git('rev-parse',`${R8E}^{tree}`),'b1882a64df1790fe217f6664d1eb49c6391b09b5','R8E tree');
eq(git('rev-parse',`HEAD:${ROOT}/r8e-cross-frame-invariance-roundtrip-verification-contract.v1.json`),'d41ae88ac3911efbd92a646e121e3cf2942d4871','R8E contract');
eq(git('rev-parse',`HEAD:${ROOT}/r8e-cross-frame-invariance-roundtrip-verification.v1.mjs`),'ddc7d5fb7198f5a22847e3c59075ef0a6886d3cc','R8E harness');
eq(git('rev-parse',`HEAD:${ROOT}/r8e-cross-frame-invariance-roundtrip-verification.verify.v1.mjs`),'0c34d9525a12116c4e927ed235d9389aa1cea3c3','R8E verifier');
eq(git('rev-parse',`HEAD:${ROOT}/r8d-deterministic-coordinate-embedding-engine.v1.mjs`),'0605d450116b0583592fa2906bca71eb4c2598fa','R8D engine');

const expectedBlobs={
  [`${ROOT}/r8f-revised-bounded-experiential-prototype-contract.v1.json`]:'9962da7416c865bc3fd454498e1ed9792f5fc0b2',
  [`${PROTO}/prototype-data.js`]:'981e3c64223bfd2dda2bc00b543e14886711afad',
  [`${PROTO}/prototype-coordinate-state.js`]:'c2ed3f6ddc0c28434e77a7c50c3200a5a6bda005',
  [`${PROTO}/prototype-projection-state.js`]:'d1c1a49641f1f8c9b91fecceccf72fff33c65da9',
  [`${PROTO}/app.js`]:'2156df300bede4a15aabd12e4017802bb2c8ca81',
  [`${PROTO}/index.html`]:'41facc3a7bba2895b7dc477b49a3a7952b90bbb1',
  [`${PROTO}/styles.css`]:'c5c5e2a8cfb5ab07c50a56e5190afe7a35361e4c'
};
for(const [path,sha] of Object.entries(expectedBlobs)) eq(git('rev-parse',`HEAD:${path}`),sha,`blob ${path}`);

eq(contract.status,'PASS_CLOSED','R8F terminal status');
eq(contract.subcheckpoint,'R8F_REVISED_BOUNDED_EXPERIENTIAL_PROTOTYPE','subcheckpoint');
eq(contract.parentAuthority.head,R8E,'parent');
yes(contract.parentAuthority.r8ePassClosed,'R8E carried');
yes(contract.authorityBoundary.visiblePrototypeAuthority,'visible authority');
no(contract.authorityBoundary.scientificAuthority,'no scientific authority');
no(contract.authorityBoundary.productionCoordinateTransitionRuntimeAuthority,'no production transition');
no(contract.authorityBoundary.mayMutateMain,'no main authority');
no(contract.authorityBoundary.mayExecuteR9,'no R9 authority');
yes(contract.nativeSpatialArchitecture.spatialArchitectureIsNative,'native spatiality');
no(contract.nativeSpatialArchitecture.spatialModeSelectable,'no spatial mode');
no(contract.nativeSpatialArchitecture.textModeSelectable,'no text mode');
no(contract.nativeSpatialArchitecture.spatialityMayBeDisabledByPresentationControl,'cannot disable spatiality');
yes(contract.nativeSpatialArchitecture.accessibilityIsEquivalentPresentationOfSameProjectionState,'accessibility equivalence');
eq(contract.nativeSpatialArchitecture.pipeline,[
  'CANONICAL_DELIVERY_STATE','DECLARED_SYSTEM_COORDINATE_STATE','CONTEXT_LOCAL_PROJECTION_STATE','PRESENTATION_STATE'
],'pipeline');

eq(DATA.prototypeId,'METHODS_F12_R8F_BATTERY_NATIVE_SPATIAL_PROTOTYPE_v1','prototype id');
eq(DATA.scientificAuthority, {
  head:'d39d9f110ed7fe16109ddcb5b8043b3752c1a36e',
  scientificStateDigest:'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5',
  relationGraphDigest:'4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b',
  projectionGraphDigest:'9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8'
},'scientific authority');
eq(DATA.canonicalDeliveryStates.length,14,'canonical delivery state count');
eq(DATA.systemCoordinateCharts.length,2,'chart count');
eq(DATA.claims.length,4,'claim count');
eq(DATA.claims.filter(c=>c.relation.direction==='SUPPORTING').length,1,'supporting count');
eq(DATA.claims.filter(c=>c.relation.direction==='ADVERSE').length,3,'adverse count');
eq(DATA.study.evaluationCycles,1653,'cycles');
eq(DATA.userDifferential,'NOT_YET_REVIEWED','user differential pending');

const forbiddenCanonical=['systemCoordinateVector','x','y','z','cameraPosition','renderStyle','visualProminence','euclideanScientificDistance','systemSpecificStateSigma'];
for(const delivery of DATA.canonicalDeliveryStates){
  for(const key of forbiddenCanonical) no(Object.prototype.hasOwnProperty.call(delivery,key),`canonical excludes ${key}`);
  eq(delivery.canonicalPresenceState,'PRESENT_IN_CANONICAL_STATE','canonical presence');
}
eq(DATA.canonicalDeliveryStates.filter(s=>s.contextFrameId==='STUDY').length,4,'context-dependent study occurrences');
eq(new Set(DATA.canonicalDeliveryStates.filter(s=>s.contextFrameId==='STUDY').map(s=>s.sourceObjectIdentityRef)).size,1,'same study identity preserved');

const charts=Object.fromEntries(DATA.systemCoordinateCharts.map(c=>[c.chartId,c]));
const structure=charts.METHODS_BATTERY_STRUCTURE_FRAME_v1;
const lineage=charts.METHODS_BATTERY_LINEAGE_FRAME_v1;
assert.ok(structure&&lineage,'both charts exist');
eq(structure.recoverabilityClass,'EXACT_COORDINATE_CHART','structure exact');
eq(lineage.recoverabilityClass,'EXACT_COORDINATE_CHART','lineage exact');
eq(structure.metricPolicy.distanceMeaning,'NONE','structure metric none');
eq(lineage.metricPolicy.distanceMeaning,'NONE','lineage metric none');
compileChart(structure);
compileChart(lineage);
const aOverlap=structure.overlapDeclarations[0];
const bOverlap=lineage.overlapDeclarations[0];
eq(aOverlap.overlapId,bOverlap.overlapId,'reciprocal overlap id');
eq(aOverlap.peerChartId,lineage.chartId,'A peer');
eq(bOverlap.peerChartId,structure.chartId,'B peer');
yes(aOverlap.reciprocityRequired,'A reciprocity');
yes(bOverlap.reciprocityRequired,'B reciprocity');

let coordinateDifferenceObserved=false;
for(const delivery of DATA.canonicalDeliveryStates){
  const expectedA=embedCoordinateState(delivery,structure);
  const expectedB=embedCoordinateState(delivery,lineage);
  const browserA=COORD.getCoordinateState(structure.chartId,delivery.deliveryStateId);
  const browserB=COORD.getCoordinateState(lineage.chartId,delivery.deliveryStateId);
  eq(browserA.coordinateVector,expectedA.coordinateVector,`R8D vector A ${delivery.deliveryStateId}`);
  eq(browserB.coordinateVector,expectedB.coordinateVector,`R8D vector B ${delivery.deliveryStateId}`);
  eq(browserA.sourceDeliveryStateId,delivery.deliveryStateId,'source state A');
  eq(browserB.sourceDeliveryStateId,delivery.deliveryStateId,'source state B');
  eq(expectedA.canonicalInvariantDigest,canonicalInvariantDigest(delivery),'invariant A');
  eq(expectedB.canonicalInvariantDigest,canonicalInvariantDigest(delivery),'invariant B');
  eq(expectedA.canonicalInvariantDigest,expectedB.canonicalInvariantDigest,'cross-frame invariant');
  if(JSON.stringify(browserA.coordinateVector)!==JSON.stringify(browserB.coordinateVector)) coordinateDifferenceObserved=true;
}
yes(coordinateDifferenceObserved,'different coordinate expressions observed');
eq(ENGINE_ID,'DETERMINISTIC_COORDINATE_EMBEDDING_ENGINE_v1','R8D engine id');
eq(COORD.id,'R8F_DECLARED_COORDINATE_STATE_REGISTRY_v1','coordinate registry');
no(COORD.coordinateTransitionRuntimeConstructed,'no production transition in registry');

const destProjection=PROJECTION.project('DS_DEST_METHODS',structure.chartId);
eq(destProjection.nodes.filter(n=>n.contextFrameId==='CLAIM').length,4,'destination exposes four claims');
eq(destProjection.nodes.filter(n=>n.contextFrameId==='RELATION').length,0,'destination no global relation dump');
for(let n=1;n<=4;n+=1){
  const claimProjection=PROJECTION.project(`DS_CLAIM_${n}`,structure.chartId);
  eq(claimProjection.nodes.filter(node=>node.contextFrameId==='RELATION').length,1,'claim local relation only');
}
const studyProjection=PROJECTION.project('DS_STUDY_1',structure.chartId);
const studyRelationIds=studyProjection.nodes.filter(n=>n.contextFrameId==='RELATION').map(n=>n.sourceObjectIdentityRef);
for(const relationId of ['BATTERY_DOMAIN','BATTERY_BURDEN','BATTERY_HSTAR','BATTERY_MQ']) has(studyRelationIds,relationId,`study relation ${relationId}`);
eq(studyProjection.nodes.filter(n=>n.contextFrameId==='RELATION'&&n.scientificMeta.direction==='ADVERSE').length,3,'three adverse relations retained');
no(studyProjection.canonicalAbsenceInferredFromHidden,'hidden is not absent');
no(PROJECTION.hiddenByProjectionIsCanonicalAbsence,'projection law');

assert.ok(html.includes('name="viewport"'),'phone viewport');
assert.ok(html.includes('id="spatial-stage"'),'spatial field present');
assert.ok(html.includes('id="coordinate-frame-controls"'),'coordinate frame controls');
assert.ok(html.includes('id="equivalent-list"'),'equivalent text region');
assert.ok(!html.toLowerCase().includes('spatial mode'),'no spatial mode label');
assert.ok(!html.toLowerCase().includes('text mode'),'no text mode label');
assert.ok(!html.includes('data-mode='),'no mode control');
assert.ok(css.includes('min-height:44px')&&css.includes('min-width:44px'),'44px touch targets');
assert.ok(css.includes('prefers-reduced-motion'),'reduced motion');
assert.ok(app.includes('renderSpatial(projection);'),'spatial renderer gets projection');
assert.ok(app.includes('renderEquivalentContext(projection);'),'text renderer gets same projection');
assert.ok(app.includes("event.key==='Escape'"),'Escape back');
assert.ok(app.includes("event.altKey&&event.key==='ArrowLeft'"),'Alt-left back');
assert.ok(app.includes('dx>72'),'right swipe');
assert.ok(app.includes('state.chartId=next;')&&app.includes('render();'),'coordinate frame selection');
assert.ok(!app.includes('transitionCoordinateState'),'no transition runtime');

eq(contract.r6Compatibility.r6AuthorizedTransformationCountRemains,0,'R6 zero');
eq(contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains,0,'R7 zero');
no(contract.closure.productionCoordinateTransitionRuntimeConstructed,'production transition absent');
yes(contract.closure.boundedProjectionRuntimeConstructed,'projection constructed');
yes(contract.closure.boundedPresentationRuntimeConstructed,'presentation constructed');
yes(contract.closure.visiblePrototypeConstructed,'visible prototype constructed');
yes(contract.closure.r8fPassClosed,'R8F closed');
yes(contract.closure.r8RemainsOpen,'R8 remains open');
no(contract.closure.r8PassClosed,'R8 not closed');
no(contract.closure.r9Unlock,'R9 locked');
eq(contract.closure.userDifferential,'NOT_YET_REVIEWED','user review pending');
eq(contract.closure.nextSubcheckpointOnPass,'R8G_USER_DIFFERENTIAL','next R8G');
eq(contract.closure.r8gEligibility,'ELIGIBLE_AWAITING_DIRECT_USER_DIFFERENTIAL','R8G eligibility');

console.log(JSON.stringify({
  status:'PASS_CLOSED',
  r8fPassClosed:true,
  r8PassClosed:false,
  r9Unlock:false,
  nativeSpatialArchitecture:true,
  spatialModeSelectable:false,
  canonicalDeliveryStateCount:DATA.canonicalDeliveryStates.length,
  coordinateChartCount:DATA.systemCoordinateCharts.length,
  coordinateEmbeddingConformance:true,
  crossFrameInvariantPreserved:true,
  boundedProjectionRuntimeConstructed:true,
  boundedPresentationRuntimeConstructed:true,
  visiblePrototypeConstructed:true,
  productionCoordinateTransitionRuntimeConstructed:false,
  supportingRelationCount:1,
  adverseRelationCount:3,
  userDifferential:'NOT_YET_REVIEWED',
  nextSubcheckpointOnPass:'R8G_USER_DIFFERENTIAL',
  r8gEligibility:'ELIGIBLE_AWAITING_DIRECT_USER_DIFFERENTIAL'
},null,2));
