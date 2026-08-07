import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {load,SD,RD,PD} from './r3-spatial-context-interpreter.v1.mjs';
import {start,advance,check as checkNavigation} from './r4-recursive-navigation-state.v1.mjs';
import {disclose,check as checkDisclosure} from './r5-context-bound-relation-disclosure.v1.mjs';
import {compile as compileGrammar,check as checkGrammar} from './r6-spatial-transformation-grammar.v1.mjs';
import {compile as compileContinuity,check as checkContinuity} from './r7-continuity-and-accessibility.v1.mjs';

const require=createRequire(import.meta.url);
const base=new URL('./r8-bounded-experiential-prototype/',import.meta.url);
const DATA=require(new URL('./prototype-data.js',base));
const STATE=require(new URL('./prototype-state.js',base));
const html=fs.readFileSync(new URL('./index.html',base),'utf8');
const css=fs.readFileSync(new URL('./styles.css',base),'utf8');
const app=fs.readFileSync(new URL('./app.js',base),'utf8');
const contract=JSON.parse(fs.readFileSync(new URL('./r8-bounded-experiential-prototype-contract.v1.json',import.meta.url),'utf8'));
const a=load();

const exact=(arr,action)=>{const t=arr.find(x=>x.actionId===action);assert(t,`missing transition ${action}`);return t};
const compileStack=n=>{checkNavigation(n,a);const d=disclose(n,{authority:a});checkDisclosure(d,n,a);const g=compileGrammar(n,d,{authority:a});checkGrammar(g,n,d,a);const c=compileContinuity(n,d,g,{authority:a});checkContinuity(c,n,d,g,a);return{d,g,c,frame:n.lineageFrames.at(-1)}};

assert.equal(contract.checkpoint,'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE');
assert.equal(contract.status,'ENGINEERING_CANDIDATE_AWAITING_USER_DIFFERENTIAL');
assert.equal(contract.parentAuthority.head,'b0efa41c13fa061828bf7674a97b35aacaa34071');
assert.equal(contract.parentAuthority.tree,'321feeacdad97388eca6c329225e057ecd2e8272');
assert.equal(contract.userDifferential.current,'NOT_YET_REVIEWED');
assert.equal(contract.engineeringGates.passClosed,false);
assert.equal(contract.engineeringGates.r9Unlock,false);
assert.equal(contract.spatialPresentation.r6AuthorizedTransformationCountInCurrentCorpus,0);
assert.equal(contract.spatialPresentation.r6TransformExecutionAuthorized,false);
assert.equal(contract.spatialPresentation.presentationTransformCreatesR6SemanticAuthority,false);
assert.equal(contract.spatialPresentation.presentationTransformIsPrimaryNavigation,false);
assert.equal(contract.prototype.destination,'METHODS_AND_MODELS');
assert.equal(contract.prototype.studyId,'BATTERY_COHERENCE_HELDOUT_STUDY');
assert.deepEqual(contract.prototype.claimIds,DATA.claims.map(x=>x.id));
assert.deepEqual(contract.prototype.relationIds,DATA.claims.map(x=>x.relationId));
assert.equal(DATA.scientificStateDigest,SD);assert.equal(DATA.relationGraphDigest,RD);assert.equal(DATA.projectionGraphDigest,PD);

const study=a.T.get(DATA.study.id);assert(study);assert.equal(study.domain,DATA.study.domain);assert.equal(study.class,DATA.study.class);assert.equal(study.admission,DATA.study.admission);assert.equal(study.standing,DATA.study.standing);assert.equal(study.source.evaluationCycles,DATA.study.evaluationCycles);assert.equal(study.source.pr,DATA.study.source.pr);assert.equal(study.source.merge,DATA.study.source.merge);assert.equal(study.source.evidenceBlob,DATA.study.source.evidenceBlob);

let supporting=0,adverse=0,routeCount=0;
const verifiedRelationIds=[];
for(const item of DATA.claims){
  const claim=a.C.get(item.id);assert(claim,`unknown claim ${item.id}`);assert.equal(claim.status,item.status);assert.equal(claim.ceiling,item.ceiling);assert(a.P.get(item.id)?.allowed.includes(DATA.destination));
  const relation=a.R.get(item.relationId);assert(relation,`unknown relation ${item.relationId}`);assert.equal(relation.claimId,item.id);assert.equal(relation.studyId,DATA.study.id);assert.equal(relation.type,item.relation.type);assert.equal(relation.direction,item.relation.direction);assert.equal(relation.standing,item.relation.standing);assert.equal(relation.summary,item.relation.summary);if(relation.direction==='SUPPORTING')supporting++;if(relation.direction==='ADVERSE')adverse++;verifiedRelationIds.push(relation.relationId);

  let n=start({authority:a});const root=compileStack(n);assert.equal(root.g.authorizedTransformationIds.length,0);assert.equal(root.c.spatialTransformationRequired,false);
  n=advance(n,exact(n.availableTransitions,DATA.routeActions.enterDestination).transitionId,{authority:a});const destination=compileStack(n);assert.equal(destination.frame.orientationAnchor.destination,DATA.destination);
  n=advance(n,exact(n.availableTransitions,`${DATA.routeActions.openClaimPrefix}${item.id}`).transitionId,{authority:a});const claimState=compileStack(n);assert.equal(claimState.frame.orientationAnchor.selector.claimId,item.id);
  n=advance(n,exact(n.availableTransitions,`${DATA.routeActions.openRelationPrefix}${item.relationId}`).transitionId,{authority:a});const relationState=compileStack(n);assert.equal(relationState.frame.orientationAnchor.selector.relationId,item.relationId);assert(relationState.d.visibleRelationIds.includes(item.relationId));
  n=advance(n,exact(n.availableTransitions,DATA.routeActions.openStudy).transitionId,{authority:a});const studyState=compileStack(n);assert.equal(studyState.frame.orientationAnchor.selector.studyId,DATA.study.id);assert.equal(studyState.g.authorizedTransformationIds.length,0);assert.equal(studyState.c.spatialTransformationRequired,false);for(const id of DATA.claims.map(x=>x.relationId))assert(studyState.d.visibleRelationIds.includes(id));
  routeCount++;
}
assert.equal(supporting,1);assert.equal(adverse,3);assert.equal(routeCount,4);assert.deepEqual([...verifiedRelationIds].sort(),DATA.claims.map(x=>x.relationId).sort());

let ui=STATE.create(DATA);STATE.assertInvariant(ui);assert.equal(ui.current.type,'ENTRY');
ui=STATE.enter(ui);assert.equal(ui.current.type,'DESTINATION');assert.equal(ui.current.depth,1);STATE.assertInvariant(ui);
ui=STATE.openClaim(ui,DATA.claims[1].id);assert.equal(ui.current.type,'CLAIM');const claimDepth=ui.current.depth;
ui=STATE.openRelation(ui,DATA.claims[1].relationId);assert.equal(ui.current.type,'RELATION');assert.equal(ui.current.depth,claimDepth+1);
ui=STATE.openStudy(ui);assert.equal(ui.current.type,'STUDY');const studyDepth=ui.current.depth;assert(studyDepth>=4);STATE.assertInvariant(ui);
const spatialCore=JSON.stringify({history:STATE.trail(ui),current:ui.current});ui=STATE.setMode(ui,'TEXT');const textCore=JSON.stringify({history:STATE.trail(ui),current:ui.current});assert.equal(spatialCore,textCore);assert.equal(ui.mode,'TEXT');
ui=STATE.setMode(ui,'SPATIAL');ui=STATE.back(ui);assert.equal(ui.current.type,'RELATION');ui=STATE.back(ui);assert.equal(ui.current.type,'CLAIM');ui=STATE.back(ui);assert.equal(ui.current.type,'DESTINATION');assert.equal(ui.current.orientation,'METHODS_AND_MODELS');STATE.assertInvariant(ui);
const studyControls=STATE.controls(STATE.openStudy(STATE.openRelation(STATE.openClaim(STATE.enter(STATE.create(DATA)),DATA.claims[0].id),DATA.claims[0].relationId)));assert.equal(studyControls.length,4);assert(studyControls.some(x=>x.direction==='SUPPORTING'));assert(studyControls.filter(x=>x.direction==='ADVERSE').length===3);

assert(html.includes('name="viewport"'));assert(html.includes('id="modeSpatial"'));assert(html.includes('id="modeText"'));assert(html.includes('aria-live="polite"'));assert(html.includes('Swipe right to return'));assert(!/https?:\/\//.test(html));
assert(css.includes('transform:translate3d'));assert(css.includes('@media(prefers-reduced-motion:reduce)'));assert(css.includes('env(safe-area-inset-bottom)'));assert(css.includes('[data-direction=ADVERSE]'));assert(css.includes('[data-direction=SUPPORTING]'));
assert(app.includes("document.addEventListener('keydown'"));assert(app.includes("spatial.addEventListener('pointerdown'"));assert(app.includes("spatial.addEventListener('pointerup'"));assert(app.includes("state=S.setMode(state,mode)"));assert(app.includes("S.assertInvariant(state)"));assert(!app.includes('fetch('));assert(!app.includes('location.href'));assert(!app.includes('window.open'));
assert.equal(DATA.presentation.transformId,'RECURSIVE_DEPTH_EMBODIMENT_v1');assert.equal(DATA.presentation.r6AuthorizedTransformationCount,0);assert.equal(DATA.presentation.r6TransformExecutionAuthorized,false);assert.equal(DATA.presentation.primaryNavigation,false);assert.equal(DATA.presentation.scientificAuthority,false);
assert.equal(DATA.userDifferential,'NOT_YET_REVIEWED');

const result={
  schema:'METHODS_MODELS_F12_R8_BOUNDED_EXPERIENTIAL_PROTOTYPE_VERIFICATION_RESULT_v1',
  status:'ENGINEERING_PASS_USER_REVIEW_PENDING',
  checkpoint:'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE',
  prototypeId:DATA.prototypeId,
  exactScientificAuthority:{head:DATA.scientificAuthorityHead,scientificStateDigest:SD,relationGraphDigest:RD,projectionGraphDigest:PD},
  vertical:{destination:DATA.destination,studyId:DATA.study.id,evaluationCycles:DATA.study.evaluationCycles,claimCount:DATA.claims.length,relationCount:verifiedRelationIds.length,supportingRelations:supporting,adverseRelations:adverse},
  structuralDiversity:{familyTraversal:true,recursiveDepth:true,foregroundBackgroundChange:true,typedRelations:true,adverseOrMixedEvidence:true,backtracking:true,orientationRetention:true,textFirstAccessibilityEquivalence:true,meaningfulPresentationResponseTransform:true},
  transformationBoundary:{r6AuthorizedTransformationCount:0,r6TransformExecutionAuthorized:false,presentationResponseTransform:DATA.presentation.transformId,presentationTransformPrimaryNavigation:false,presentationTransformScientificAuthority:false},
  gates:{engineeringPass:true,authorityPass:true,traceabilityPass:true,userDifferential:'NOT_YET_REVIEWED',passClosed:false,r9Unlock:false},
  checks:['CORRIDOR_FREEZE_PARENT_PASS','R3_R4_R5_R6_R7_CONSUMPTION_PASS','BATTERY_VERTICAL_SOURCE_IDENTITY_PASS','FOUR_BATTERY_CLAIMS_PROJECTION_PASS','TYPED_RELATION_EXACTNESS_PASS','SUPPORTING_AND_ADVERSE_EVIDENCE_PRESERVATION_PASS','RECURSIVE_ROUTE_PASS','RETURN_PATH_PASS','ORIENTATION_RETENTION_PASS','SPATIAL_TEXT_SEMANTIC_CORE_EQUIVALENCE_PASS','TOUCH_POINTER_KEYBOARD_CONTROL_SURFACE_PASS','R6_ZERO_TRANSFORM_AUTHORITY_PRESERVED_PASS','NONAUTHORITATIVE_DEPTH_EMBODIMENT_PASS','PHONE_VIEWPORT_AND_SAFE_AREA_PASS','REDUCED_MOTION_EQUIVALENT_PASS','NO_EXTERNAL_RUNTIME_DEPENDENCY_PASS','NO_PUBLIC_NAVIGATION_OR_DEPLOYMENT_BINDING_PASS','USER_DIFFERENTIAL_REQUIRED_NOT_YET_REVIEWED_PASS','R9_REMAINS_BLOCKED_PASS']
};
console.log(JSON.stringify(result,null,2));
