import assert from 'node:assert/strict';
import {E,load,SD,RD,PD} from './r3-spatial-context-interpreter.v1.mjs';
import {start,advance,check as checkNavigation} from './r4-recursive-navigation-state.v1.mjs';
import {disclose,check as checkDisclosure} from './r5-context-bound-relation-disclosure.v1.mjs';
import {ID,V,validateBindingSet,compile,check,admit,replay,trace,digest,invariant} from './r6-spatial-transformation-grammar.v1.mjs';

const code=(c,fn)=>{let e;try{fn()}catch(x){e=x}assert(e instanceof E);assert.equal(e.code,c)};
const clone=v=>JSON.parse(JSON.stringify(v));
const a=load();
let grammarStates=0,framesWithAuthorizedTransformations=0,authorizedTransformationInstances=0;
function inspect(n){
  checkNavigation(n,a);const d=disclose(n,{authority:a});checkDisclosure(d,n,a);const g1=compile(n,d,{authority:a}),g2=compile(n,d,{authority:a});check(g1,n,d,a);
  const f=n.lineageFrames.at(-1);assert.deepEqual(g1.authorizedTransformationIds,f.allowedSpatialTransformations);assert.deepEqual(g1.semanticBindings,f.transformationSemantics);assert.equal(g1.grammarStateId,g2.grammarStateId);assert.equal(g1.grammarDigest,g2.grammarDigest);assert.equal(digest(g1),g1.grammarDigest);assert.equal(g1.navigationDoesNotAuthorizeTransformation,true);assert.equal(g1.relationDisclosureDoesNotAuthorizeTransformation,true);assert.equal(g1.runtimeExecutionAuthorized,false);assert.equal(g1.visibleMutationAuthorized,false);assert.equal(g1.scientificMutationAuthorized,false);
  const tr=trace(g1,n,d,a);assert.equal(tr.forward.length,7);assert.deepEqual(tr.reverse,[...tr.forward].reverse());assert.equal(tr.visibleReconstruction,false);assert.equal(tr.presentationRuntimeConstructed,false);assert.equal(tr.spatialTransformationRuntimeConstructed,false);
  if(g1.authorizedTransformationIds.length){framesWithAuthorizedTransformations++;authorizedTransformationInstances+=g1.authorizedTransformationIds.length}else assert.equal(g1.admissionMode,'NO_SPATIAL_TRANSFORMATION_AUTHORIZED');
  grammarStates++;return{d,g:g1};
}

validateBindingSet([],[]);
const syntheticBinding={spatialTransformationId:'T1',informationalSemanticId:'S1',fromSelector:{kind:'A'},toSelector:{kind:'B'},authorityBasis:'SYNTHETIC_GRAMMAR_TEST_ONLY',decorativeOnlyPrimaryNavigationPermitted:false};validateBindingSet(['T1'],[syntheticBinding]);
code('DUPLICATE_TRANSFORMATION_ID',()=>validateBindingSet(['T1','T1'],[syntheticBinding,syntheticBinding]));
code('MISSING_TRANSFORMATION_SEMANTIC_BINDING',()=>validateBindingSet(['T1'],[]));
code('UNDECLARED_TRANSFORMATION_SEMANTIC_BINDING',()=>validateBindingSet([], [syntheticBinding]));
const badDecorative={...syntheticBinding,decorativeOnlyPrimaryNavigationPermitted:true};code('TRANSFORMATION_SEMANTIC_MISMATCH',()=>validateBindingSet(['T1'],[badDecorative]));

const root=start({authority:a}),rootX=inspect(root);assert.equal(rootX.g.authorizedTransformationIds.length,0);assert.equal(rootX.g.semanticBindings.length,0);assert(root.availableTransitions.length>0);code('SPATIAL_TRANSFORMATION_NOT_AUTHORIZED',()=>admit(rootX.g,'UNAUTHORIZED_ZOOM',{navigation:root,disclosure:rootX.d,authority:a}));
const mdT=root.availableTransitions.find(t=>t.actionId==='ENTER_DESTINATION::METHODS_AND_MODELS'),md=advance(root,mdT.transitionId,{authority:a}),mdX=inspect(md);assert(md.availableTransitions.length>0);assert.equal(mdX.g.authorizedTransformationIds.length,0);
const claimT=md.availableTransitions.find(t=>t.actionId==='OPEN_CLAIM::UCIC_CLAIM_ROUTE_SPECIFICITY'),claim=advance(md,claimT.transitionId,{authority:a}),claimX=inspect(claim);assert(claimX.d.visibleRelationIds.length>1);assert.equal(claimX.g.authorizedTransformationIds.length,0);
const relationT=claim.availableTransitions.find(t=>t.actionId==='OPEN_RELATION::PROT_REAL'),relation=advance(claim,relationT.transitionId,{authority:a}),relationX=inspect(relation);assert.equal(relationX.g.authorizedTransformationIds.length,0);
const studyT=relation.availableTransitions.find(t=>t.actionId==='OPEN_STUDY::REAL_INTERVENTION_GAUNTLET_PROTOCOL'),study=advance(relation,studyT.transitionId,{authority:a}),studyX=inspect(study);assert.equal(studyX.g.authorizedTransformationIds.length,0);
const replayed=replay(study.transitionTrail.map(t=>t.transitionId),{authority:a});assert.equal(replayed.grammarStateId,studyX.g.grammarStateId);assert.equal(replayed.grammarDigest,studyX.g.grammarDigest);

const invented=clone(claimX.g);invented.authorizedTransformationIds.push('UNAUTHORIZED_ZOOM');invented.semanticBindings.push({spatialTransformationId:'UNAUTHORIZED_ZOOM',informationalSemanticId:'NAVIGATION_IS_NOT_TRANSFORMATION_AUTHORITY',fromSelector:{kind:'CLAIM'},toSelector:{kind:'RELATION'},authorityBasis:'UNAUTHORIZED_TEST_SENTINEL',decorativeOnlyPrimaryNavigationPermitted:false});code('TRANSFORMATION_SCOPE_VIOLATION',()=>check(invented,claim,claimX.d,a));
const bindingOnly=clone(claimX.g);bindingOnly.semanticBindings.push(syntheticBinding);code('UNDECLARED_TRANSFORMATION_SEMANTIC_BINDING',()=>check(bindingOnly,claim,claimX.d,a));
const authorityExpansion=clone(claimX.g);authorityExpansion.runtimeExecutionAuthorized=true;code('TRANSFORMATION_SCOPE_VIOLATION',()=>check(authorityExpansion,claim,claimX.d,a));
const scienceMut=clone(claimX.g);scienceMut.sourceScientificStateDigest='0'.repeat(64);code('SCIENTIFIC_STATE_MUTATION_ATTEMPT',()=>check(scienceMut,claim,claimX.d,a));
const idMut=clone(claimX.g);idMut.grammarStateId='GRAMMAR_UNLAWFUL';code('NONDETERMINISTIC_GRAMMAR_STATE',()=>check(idMut,claim,claimX.d,a));
const digestMut=clone(claimX.g);digestMut.grammarDigest='0'.repeat(64);code('GRAMMAR_DIGEST_MISMATCH',()=>check(digestMut,claim,claimX.d,a));

let destinations=0,claimTransitions=0,relationTransitions=0,studyTransitions=0;const all=[];for(const dt of root.availableTransitions){const dn=advance(root,dt.transitionId,{authority:a});destinations++;all.push(inspect(dn).g);for(const ct of dn.availableTransitions){const cn=advance(dn,ct.transitionId,{authority:a});claimTransitions++;all.push(inspect(cn).g);for(const rt of cn.availableTransitions){const rn=advance(cn,rt.transitionId,{authority:a});relationTransitions++;all.push(inspect(rn).g);const st=rn.availableTransitions.find(t=>t.actionId.startsWith('OPEN_STUDY::'));if(st){const sn=advance(rn,st.transitionId,{authority:a});studyTransitions++;all.push(inspect(sn).g);}}}}
assert.equal(destinations,11);assert.equal(claimTransitions,127);assert.equal(relationTransitions,266);assert.equal(studyTransitions,266);assert.equal(framesWithAuthorizedTransformations,0);assert.equal(authorizedTransformationInstances,0);invariant([rootX.g,mdX.g,claimX.g,relationX.g,studyX.g,...all]);

console.log(JSON.stringify({schema:'METHODS_MODELS_F12_R6_SPATIAL_TRANSFORMATION_GRAMMAR_VERIFICATION_RESULT_v1',status:'PASS',grammarRuntimeId:ID,grammarVersion:V,sourceScientificStateDigest:SD,sourceRelationGraphDigest:RD,sourceProjectionGraphDigest:PD,exercised:{destinations,claimTransitions,relationTransitions,studyTransitions,grammarStates,framesWithAuthorizedTransformations,authorizedTransformationInstances},currentCorpusDisposition:'NO_SPATIAL_TRANSFORMATION_AUTHORIZED',checks:['R5_FROZEN_INPUT_PASS','R6_NAMING_PROVENANCE_PATTERN_PASS','FRAME_TRANSFORMATION_AUTHORITY_EXACT_EQUALITY_PASS','ONE_TO_ONE_TRANSFORMATION_SEMANTIC_GRAMMAR_PASS','ZERO_TRANSFORMATION_CORPUS_PASS','UNAUTHORIZED_TRANSFORMATION_FAIL_CLOSED_PASS','NAVIGATION_DOES_NOT_CREATE_TRANSFORMATION_AUTHORITY_PASS','RELATION_DISCLOSURE_DOES_NOT_CREATE_TRANSFORMATION_AUTHORITY_PASS','SYNTHETIC_GRAMMAR_DUPLICATE_ID_FAIL_CLOSED_PASS','SYNTHETIC_GRAMMAR_MISSING_BINDING_FAIL_CLOSED_PASS','SYNTHETIC_GRAMMAR_UNDECLARED_BINDING_FAIL_CLOSED_PASS','SYNTHETIC_GRAMMAR_SEMANTIC_SHAPE_FAIL_CLOSED_PASS','REPLAY_DETERMINISM_PASS','SCIENTIFIC_STATE_INVARIANCE_PASS','NO_RUNTIME_EXECUTION_AUTHORITY_PASS','NO_PRESENTATION_RUNTIME_PASS','NO_VISIBLE_RECONSTRUCTION_PASS']},null,2));
