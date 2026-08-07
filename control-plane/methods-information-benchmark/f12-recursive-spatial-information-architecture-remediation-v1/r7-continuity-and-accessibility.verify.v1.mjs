import assert from 'node:assert/strict';
import {E,load,SD,RD,PD} from './r3-spatial-context-interpreter.v1.mjs';
import {start,advance,check as checkNavigation} from './r4-recursive-navigation-state.v1.mjs';
import {disclose,check as checkDisclosure} from './r5-context-bound-relation-disclosure.v1.mjs';
import {compile as compileGrammar,check as checkGrammar} from './r6-spatial-transformation-grammar.v1.mjs';
import {ID,V,compile,check,replay,trace,digest,invariant} from './r7-continuity-and-accessibility.v1.mjs';

const code=(c,fn)=>{let e;try{fn()}catch(x){e=x}assert(e instanceof E);assert.equal(e.code,c)};
const clone=v=>JSON.parse(JSON.stringify(v));
const a=load();
let continuityStates=0,accessibilityEquivalentStates=0,textFirstEquivalentStates=0,spatialTransformationDependentStates=0;

function inspect(n){
  checkNavigation(n,a);const d=disclose(n,{authority:a});checkDisclosure(d,n,a);const g=compileGrammar(n,d,{authority:a});checkGrammar(g,n,d,a);
  const c1=compile(n,d,g,{authority:a}),c2=compile(n,d,g,{authority:a});check(c1,n,d,g,a);const f=n.lineageFrames.at(-1);
  assert.equal(c1.contextFrameId,f.contextFrameId);assert.deepEqual(c1.continuityCore.returnPath,f.returnPath);assert.deepEqual(c1.continuityCore.returnPath,n.ancestorContextFrameIds);assert.deepEqual(c1.continuityCore.navigationOperationEquivalents,n.operationEquivalents);assert.deepEqual(c1.continuityCore.visibleRelationIds,d.visibleRelationIds);assert.deepEqual(c1.continuityCore.sourceRecordDigests,d.disclosedRelations.map(x=>x.sourceRecordDigest));assert.deepEqual(c1.continuityCore.transformationAuthorityIds,g.authorizedTransformationIds);
  assert.deepEqual(c1.accessibilityEquivalent.continuityCore,c1.textFirstEquivalent.continuityCore);assert.deepEqual(c1.accessibilityEquivalent.frameEquivalent,f.accessibilityEquivalent);assert.deepEqual(c1.textFirstEquivalent.frameEquivalent,f.textFirstEquivalent);assert.deepEqual(c1.accessibilityEquivalent.relationDisclosureEquivalent,d.accessibilityEquivalent);assert.deepEqual(c1.textFirstEquivalent.relationDisclosureEquivalent,d.textFirstEquivalent);
  assert.equal(c1.accessibilityEquivalent.requiresSpatialTransformation,false);assert.equal(c1.textFirstEquivalent.requiresSpatialTransformation,false);assert.equal(c1.spatialTransformationRequired,false);assert.equal(c1.spatialTransformationExecuted,false);assert.equal(c1.visibleMutationAuthorized,false);assert.equal(c1.scientificMutationAuthorized,false);assert.equal(c1.continuityStateId,c2.continuityStateId);assert.equal(c1.continuityDigest,c2.continuityDigest);assert.equal(digest(c1),c1.continuityDigest);
  const tr=trace(c1,n,d,g,a);assert.equal(tr.forward.length,8);assert.deepEqual(tr.reverse,[...tr.forward].reverse());assert.equal(tr.accessibilityContinuity,true);assert.equal(tr.textFirstContinuity,true);assert.equal(tr.spatialTransformationRequired,false);assert.equal(tr.visibleReconstruction,false);assert.equal(tr.presentationRuntimeConstructed,false);
  continuityStates++;accessibilityEquivalentStates++;textFirstEquivalentStates++;if(c1.spatialTransformationRequired||c1.accessibilityEquivalent.requiresSpatialTransformation||c1.textFirstEquivalent.requiresSpatialTransformation)spatialTransformationDependentStates++;
  return{d,g,c:c1};
}

const root=start({authority:a}),rootX=inspect(root);assert(root.availableTransitions.length>0);assert.equal(rootX.g.authorizedTransformationIds.length,0);
const mdT=root.availableTransitions.find(t=>t.actionId==='ENTER_DESTINATION::METHODS_AND_MODELS'),md=advance(root,mdT.transitionId,{authority:a}),mdX=inspect(md);assert(md.availableTransitions.length>0);
const claimT=md.availableTransitions.find(t=>t.actionId==='OPEN_CLAIM::UCIC_CLAIM_ROUTE_SPECIFICITY'),claim=advance(md,claimT.transitionId,{authority:a}),claimX=inspect(claim);assert(claimX.d.visibleRelationIds.length>1);
const relationT=claim.availableTransitions.find(t=>t.actionId==='OPEN_RELATION::PROT_REAL'),relation=advance(claim,relationT.transitionId,{authority:a}),relationX=inspect(relation);
const studyT=relation.availableTransitions.find(t=>t.actionId==='OPEN_STUDY::REAL_INTERVENTION_GAUNTLET_PROTOCOL'),study=advance(relation,studyT.transitionId,{authority:a}),studyX=inspect(study);
const replayed=replay(study.transitionTrail.map(t=>t.transitionId),{authority:a});assert.equal(replayed.continuityStateId,studyX.c.continuityStateId);assert.equal(replayed.continuityDigest,studyX.c.continuityDigest);

const returnMut=clone(claimX.c);returnMut.continuityCore.returnPath.push('UNLAWFUL_RETURN');code('RETURN_CONTINUITY_MISMATCH',()=>check(returnMut,claim,claimX.d,claimX.g,a));
const operationMut=clone(claimX.c);operationMut.continuityCore.navigationOperationEquivalents.forward.push({operationId:'UNLAWFUL_OPERATION'});code('NAVIGATION_OPERATION_EQUIVALENCE_MISMATCH',()=>check(operationMut,claim,claimX.d,claimX.g,a));
const relationMut=clone(claimX.c);relationMut.continuityCore.visibleRelationIds=[];code('RELATION_DISCLOSURE_EQUIVALENCE_MISMATCH',()=>check(relationMut,claim,claimX.d,claimX.g,a));
const sourceMut=clone(claimX.c);sourceMut.continuityCore.sourceRecordDigests[0]='0'.repeat(64);code('SOURCE_RECORD_CONTINUITY_MISMATCH',()=>check(sourceMut,claim,claimX.d,claimX.g,a));
const accessMut=clone(claimX.c);accessMut.accessibilityEquivalent.frameEquivalent.mode='__UNLAWFUL_ACCESS_MODE__';code('ACCESSIBILITY_CONTINUITY_MISMATCH',()=>check(accessMut,claim,claimX.d,claimX.g,a));
const textMut=clone(claimX.c);textMut.textFirstEquivalent.frameEquivalent.mode='__UNLAWFUL_TEXT_MODE__';code('TEXT_FIRST_CONTINUITY_MISMATCH',()=>check(textMut,claim,claimX.d,claimX.g,a));
const transformMut=clone(claimX.c);transformMut.spatialTransformationRequired=true;code('SPATIAL_TRANSFORMATION_DEPENDENCY',()=>check(transformMut,claim,claimX.d,claimX.g,a));
const authorityMut=clone(claimX.c);authorityMut.visibleMutationAuthorized=true;code('CONTINUITY_SCOPE_VIOLATION',()=>check(authorityMut,claim,claimX.d,claimX.g,a));
const scienceMut=clone(claimX.c);scienceMut.sourceScientificStateDigest='0'.repeat(64);code('SCIENTIFIC_STATE_MUTATION_ATTEMPT',()=>check(scienceMut,claim,claimX.d,claimX.g,a));
const idMut=clone(claimX.c);idMut.continuityStateId='CONTINUITY_UNLAWFUL';code('NONDETERMINISTIC_CONTINUITY_STATE',()=>check(idMut,claim,claimX.d,claimX.g,a));
const digestMut=clone(claimX.c);digestMut.continuityDigest='0'.repeat(64);code('CONTINUITY_DIGEST_MISMATCH',()=>check(digestMut,claim,claimX.d,claimX.g,a));

let destinations=0,claimTransitions=0,relationTransitions=0,studyTransitions=0;const all=[];for(const dt of root.availableTransitions){const dn=advance(root,dt.transitionId,{authority:a});destinations++;all.push(inspect(dn).c);for(const ct of dn.availableTransitions){const cn=advance(dn,ct.transitionId,{authority:a});claimTransitions++;all.push(inspect(cn).c);for(const rt of cn.availableTransitions){const rn=advance(cn,rt.transitionId,{authority:a});relationTransitions++;all.push(inspect(rn).c);const st=rn.availableTransitions.find(t=>t.actionId.startsWith('OPEN_STUDY::'));if(st){const sn=advance(rn,st.transitionId,{authority:a});studyTransitions++;all.push(inspect(sn).c);}}}}
assert.equal(destinations,11);assert.equal(claimTransitions,127);assert.equal(relationTransitions,266);assert.equal(studyTransitions,266);assert.equal(continuityStates,675);assert.equal(accessibilityEquivalentStates,675);assert.equal(textFirstEquivalentStates,675);assert.equal(spatialTransformationDependentStates,0);invariant([rootX.c,mdX.c,claimX.c,relationX.c,studyX.c,...all]);

console.log(JSON.stringify({schema:'METHODS_MODELS_F12_R7_CONTINUITY_AND_ACCESSIBILITY_VERIFICATION_RESULT_v1',status:'PASS',continuityRuntimeId:ID,continuityVersion:V,sourceScientificStateDigest:SD,sourceRelationGraphDigest:RD,sourceProjectionGraphDigest:PD,exercised:{destinations,claimTransitions,relationTransitions,studyTransitions,continuityStates,accessibilityEquivalentStates,textFirstEquivalentStates,spatialTransformationDependentStates},currentCorpusDisposition:'SCIENTIFIC_CONTEXT_RECOVERABLE_WITHOUT_SPATIAL_INTERACTION',checks:['R6_FROZEN_INPUT_PASS','R7_SELF_CANONIZED_EXACT_NAME_PASS','EXACT_CONTEXT_CONTINUITY_CORE_PASS','ACCESSIBILITY_EQUIVALENCE_PASS','TEXT_FIRST_EQUIVALENCE_PASS','MODALITY_CORE_IDENTITY_PASS','RETURN_PATH_CONTINUITY_PASS','NAVIGATION_OPERATION_EQUIVALENCE_PASS','RELATION_DISCLOSURE_CONTINUITY_PASS','SOURCE_RECORD_DIGEST_CONTINUITY_PASS','SPATIAL_TRANSFORMATION_NONDEPENDENCY_PASS','REPLAY_DETERMINISM_PASS','SCIENTIFIC_STATE_INVARIANCE_PASS','NO_VISIBLE_MUTATION_AUTHORITY_PASS','NO_PRESENTATION_RUNTIME_PASS','NO_VISIBLE_RECONSTRUCTION_PASS']},null,2));
