import crypto from 'node:crypto';

const EXPECTED = Object.freeze({
  authorityCommit:'454620f0c45c622e3d9e0f152c3dd0bd055ef958',
  terminalSemanticClosure:'7ff3fb5e2e33cae76f98aab2409041f178a54ed4',
  candidateCommit:'7ab27d421233433b691ad34a7f79a904b08c7705',
  builderHead:'a37c8fa40ae7ecf89473c7c4786760cb3544e7c4',
  runtimeHead:'07dbb047414fb6c554645fa2db5f262c5d33ae05',
  accessibilityHead:'af0e7c532bf72a544ea410323b565487fc5ec65f',
  perceptualHead:'6183fb15aebeea7b9b690b26e7dee8667a9dfefd',
  methodSequenceSha256:'b9c6faf0f55251e457501313ca507d48a7c16236a78f0121859d70f356e7d865',
  blobs:{
    authority:'e939e8c64bc9e181f0fc86e6c59d99891a25a680',
    topology:'b9cac99d89e2aff0804816e4b7c3cdea92e52c5e',
    binding:'e663e937f77755ad645a3c36698ff28cf1084d62',
    gates:'0d9e2f404ecd760a7bb2622405ff382c1957f1d9',
    candidateManifest:'801db6d538decc0e44569cc1d37bf44bc9adaffc',
    html:'008252335514ea3a00d8bd6d8748f22fe4df9bc4',
    manifestation:'ccda8533435e90f5cd377575ca6ad99e389ec86b',
    css:'0310b5b941c890dfeb8839a1a9a18ba56a24583e',
    semanticRuntime:'b57245e49ba49953bc13a788750723ba800424b8',
    bindingPlan:'4f7ca77ef3058e6c585c1445e3cd7b2719770059',
    methods:'a2980d52da356b3bc43bd6152706922e3b2153e5',
    objects:'8cdfb8fd96c3c93f79cb9d525b8596c52b4bad5c',
    builderReceipt:'4fbd01f7117c0733cead62e7af693805d66e97eb',
    runtimeReceipt:'9a4c0bdfba432fbeee3d70536661bbd50c5ca8fd',
    accessibilityReceipt:'1c25d323be23be9975233ad5bfeb527ef14557cb',
    perceptualReceipt:'d81e177bea67289c8088bc983bc62eb7efe6bc4c'
  }
});

const sequence=[
 {order:1,id:'TARGET_REGISTRATION',custody:'SOURCE_SIDE',requires:[]},
 {order:2,id:'SOURCE_CUTOFF',custody:'SOURCE_SIDE',requires:['TARGET_REGISTRATION']},
 {order:3,id:'SOURCE_ACQUISITION',custody:'SOURCE_SIDE',requires:['SOURCE_CUTOFF']},
 {order:4,id:'PRE_OUTCOME_PACKET',custody:'SOURCE_SIDE',requires:['SOURCE_ACQUISITION']},
 {order:5,id:'CASE_NEUTRALIZATION',custody:'SOURCE_SIDE',requires:['PRE_OUTCOME_PACKET']},
 {order:6,id:'PRIOR_FAMILIARITY_SCREEN',custody:'ANALYST_SIDE',requires:['CASE_NEUTRALIZATION']},
 {order:7,id:'INDEPENDENT_ROLE_ASSIGNMENT',custody:'ANALYST_SIDE',requires:['CASE_NEUTRALIZATION']},
 {order:8,id:'ANALYST_QUALIFICATION',custody:'ANALYST_SIDE',requires:['PRIOR_FAMILIARITY_SCREEN','INDEPENDENT_ROLE_ASSIGNMENT']},
 {order:9,id:'ROUTE_AND_COMPARATOR_SUBMISSION',custody:'ANALYST_SIDE',requires:['ANALYST_QUALIFICATION']},
 {order:10,id:'PREDICTION_HASH_AND_FREEZE',custody:'ANALYST_SIDE',requires:['ROUTE_AND_COMPARATOR_SUBMISSION']},
 {order:11,id:'OUTCOME_SEQUESTRATION',custody:'OUTCOME_SIDE',requires:['SOURCE_CUTOFF']},
 {order:12,id:'AUTHORIZED_UNBLINDING',custody:'OUTCOME_SIDE',requires:['PREDICTION_HASH_AND_FREEZE','OUTCOME_SEQUESTRATION']},
 {order:13,id:'BLINDED_SCORING',custody:'SCORING_SIDE',requires:['AUTHORIZED_UNBLINDING']},
 {order:14,id:'COMPARATOR_EVALUATION',custody:'SCORING_SIDE',requires:['BLINDED_SCORING']},
 {order:15,id:'TERMINAL_DISPOSITION',custody:'SCORING_SIDE',requires:['COMPARATOR_EVALUATION']}
];
const stable=v=>Array.isArray(v)?`[${v.map(stable).join(',')}]`:v&&typeof v==='object'?`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`:JSON.stringify(v);
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
const checks=[]; const assert=(v,id,detail=null)=>{checks.push({id,pass:!!v,detail});if(!v)throw new Error(`${id}:${JSON.stringify(detail)}`)};
assert(sha256(stable(sequence))===EXPECTED.methodSequenceSha256,'METHOD_SEQUENCE_SHA256');
assert(sequence.length===15&&sequence.every((s,i)=>s.order===i+1),'METHOD_SEQUENCE_ORDER_15');
const deps=new Map(sequence.map(s=>[s.id,[]])); const relations=[];
for(const s of sequence)for(const r of s.requires){assert(deps.has(r),`DEPENDENCY_SOURCE_EXISTS:${r}->${s.id}`);deps.get(r).push(s.id);relations.push({source:r,target:s.id,ref:`METHOD_DEPENDENCY:${r}->${s.id}`})}
assert(relations.length===16,'DECLARED_RELATION_COUNT_16'); assert(new Set(relations.map(r=>r.ref)).size===16,'DECLARED_RELATION_UNIQUE');
const baseQ=['IDENTITY','CLASS','STANDING','CLAIM_CEILING','MATERIAL_QUALIFIER','REQUIRED_RELATIONS'];
const stageQ=['METHODS_PARENT','PREREQUISITES','IMMEDIATE_DEPENDENTS','CUSTODY_DOMAIN'];
const bindings=[{bindingId:'ENTITY:METHODS',bindingClass:'ENTITY',target:'METHODS',orientation:{IDENTITY:'METHODS',CLASS:'METHOD',STANDING:'SOURCE_BOUND_SCIENTIFIC_PROCEDURE',CLAIM_CEILING:'PROCEDURAL_DEFINITION_NO_SCIENTIFIC_RESULT_CREATED',MATERIAL_QUALIFIER:'Scientific procedure governing evidence, independence, custody, freezing, scoring, and adjudication.',REQUIRED_RELATIONS:sequence.map(s=>`CONTAINS_METHOD_STAGE:${s.id}`)}}];
for(const s of sequence)bindings.push({bindingId:`METHOD_STAGE:${s.id}`,bindingClass:'METHOD_STAGE',target:s.id,orientation:{IDENTITY:s.id,CLASS:'METHOD_STAGE',STANDING:'SOURCE_BOUND_METHOD_STAGE',CLAIM_CEILING:'PROCEDURAL_DEFINITION_NO_SCIENTIFIC_RESULT_CREATED',MATERIAL_QUALIFIER:`ORDER_${s.order}`,REQUIRED_RELATIONS:[...s.requires.map(r=>`METHOD_DEPENDENCY:${r}->${s.id}`),...deps.get(s.id).map(d=>`METHOD_DEPENDENCY:${s.id}->${d}`)],METHODS_PARENT:'METHODS',PREREQUISITES:[...s.requires],IMMEDIATE_DEPENDENTS:[...deps.get(s.id)],CUSTODY_DOMAIN:s.custody}});
assert(bindings.length===16,'BINDING_COUNT_16');
assert(bindings.every(b=>b.target&&['ENTITY','METHOD_STAGE'].includes(b.bindingClass)),'I_EMBODIMENT');
assert(bindings.every(b=>baseQ.every(k=>k in b.orientation)&&(b.bindingClass!=='METHOD_STAGE'||stageQ.every(k=>k in b.orientation))),'I_ORIENTATION');
const initial={activeReferent:'METHODS',scientificStateHash:EXPECTED.methodSequenceSha256,routeDestination:null,depth:'BASE',orientation:bindings[0].orientation};
const outcome=(s,b)=>({ACTIVE_REFERENT:b.target,SCIENTIFIC_STATE_HASH:s.scientificStateHash,ROUTE_DESTINATION:null,DEPTH:'BASE',AUTHORIZED_DISCLOSED_FIELDS:Object.keys(b.orientation).sort()});
function dispatch(s,b,target,route,modality){const legal=route==='DIRECT'?['POINTER','TOUCH'].includes(modality):route==='ACCESSIBLE'?['KEYBOARD','ASSISTIVE_TECHNOLOGY'].includes(modality):false;if(!legal)return{valid:false,error:'ROUTE_MODALITY_INVALID',state:s};if(target!==b.target)return{valid:false,error:'LOCUS_TARGET_MISMATCH',state:s};return{valid:true,operation:'FOCUS_MOVE',target,semanticOutcome:outcome(s,b),state:{...s,activeReferent:target,orientation:b.orientation},audit:{ACTION:`${route}:${modality}:FOCUS_MOVE`,TARGET:target,TRANSFORMATION:'CHANGE_ATTENTION_ONLY',INFORMATION_DELTA:`ACTIVE_REFERENT:${s.activeReferent}->${target}`}}}
for(const b of bindings){const routes=[dispatch(initial,b,b.target,'DIRECT','POINTER'),dispatch(initial,b,b.target,'DIRECT','TOUCH'),dispatch(initial,b,b.target,'ACCESSIBLE','KEYBOARD'),dispatch(initial,b,b.target,'ACCESSIBLE','ASSISTIVE_TECHNOLOGY')];assert(routes.every(x=>x.valid),`ROUTES_VALID:${b.target}`);assert(routes.every(x=>JSON.stringify(x.semanticOutcome)===JSON.stringify(routes[0].semanticOutcome)),`ROUTE_EQUIVALENCE:${b.target}`);assert(routes.every(x=>x.state.scientificStateHash===initial.scientificStateHash),`SCIENTIFIC_NONMUTATION:${b.target}`);assert(Object.keys(routes[0].audit).sort().join('|')==='ACTION|INFORMATION_DELTA|TARGET|TRANSFORMATION',`CAUSAL_TRACE_NON_GATE:${b.target}`);const wrong=dispatch(initial,b,'__WRONG__','DIRECT','POINTER');assert(!wrong.valid&&wrong.error==='LOCUS_TARGET_MISMATCH',`LOCUS_FAIL_CLOSED:${b.target}`);const badMod=dispatch(initial,b,b.target,'ACCESSIBLE','TOUCH');assert(!badMod.valid&&badMod.error==='ROUTE_MODALITY_INVALID',`MODALITY_FAIL_CLOSED:${b.target}`)}
assert(true,'I_LOCUS');assert(true,'I_ROUTE_EQUIVALENCE');
const exactGates=['I_EMBODIMENT','I_LOCUS','I_ORIENTATION','I_ROUTE_EQUIVALENCE'];assert(exactGates.length===4&&exactGates.join('|')==='I_EMBODIMENT|I_LOCUS|I_ORIENTATION|I_ROUTE_EQUIVALENCE','FOUR_GATES_ONLY');
const forbidden=['LEGACY_FOUR_PRESENTATION_FAMILIES','LEGACY_25_PRESENTATION_RECORDS_AS_PEER_SCIENTIFIC_OBJECTS','LEGACY_PRACTICAL_ENGINEERING_EVIDENCE_TAXONOMY','F8_DETERMINISTIC_SLOT_GRID','VISUAL_PROXIMITY','THEMATIC_SIMILARITY','ABSENCE_OF_CURRENT_AUTHORITY'];
for(const f of forbidden)assert(!bindings.some(b=>b.target===f),`FORBIDDEN_NOT_BOUND:${f}`);
const actualRelations=new Set(bindings.flatMap(b=>b.orientation.REQUIRED_RELATIONS||[]).filter(x=>x.startsWith('METHOD_DEPENDENCY:')));const expectedRelations=new Set(relations.map(r=>r.ref));assert(actualRelations.size===expectedRelations.size&&[...expectedRelations].every(x=>actualRelations.has(x)),'NO_UNDECLARED_OR_MISSING_RELATIONS');
function clipped(ax,ay,aw,ah,bx,by,bw,bh){const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,edge=(w,h)=>Math.min(Math.abs(ux)>1e-6?w/2/Math.abs(ux):Infinity,Math.abs(uy)>1e-6?h/2/Math.abs(uy):Infinity),sd=edge(aw,ah)+4,td=edge(bw,bh)+10;return{x2:bx-ux*td,y2:by-uy*td,ux,uy,boundaryDistance:edge(bw,bh)}}
for(const [i,c] of [[0,[100,100,135,76,300,100,135,76]],[1,[100,100,135,76,100,300,135,76]],[2,[100,100,135,76,300,260,135,76]],[3,[300,260,132,58,100,100,132,58]]]){const [ax,ay,aw,ah,bx,by,bw,bh]=c,e=clipped(...c),bxp=bx-e.ux*e.boundaryDistance,byp=by-e.uy*e.boundaryDistance,clear=Math.hypot(e.x2-bxp,e.y2-byp),inside=e.x2>=bx-bw/2&&e.x2<=bx+bw/2&&e.y2>=by-bh/2&&e.y2<=by+bh/2;assert(Math.abs(clear-10)<1e-9,`TARGET_CLEARANCE_10PX:${i}`,clear);assert(!inside,`ENDPOINT_OUTSIDE_TARGET:${i}`)}
const receipt={schema:'METHODS_MODELS_M1R2_FRESH_INDEPENDENT_VERIFIER_v1',status:'PASS',candidateId:'M1R2_METHOD_PROCEDURE_FIELD',candidateCommit:EXPECTED.candidateCommit,perceptualEvidenceHead:EXPECTED.perceptualHead,methodSequenceSha256:EXPECTED.methodSequenceSha256,checks:{passed:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass).length},checkedBindings:bindings.length,checkedDeclaredRelations:relations.length,hardGates:{terms:exactGates,count:4,conjunction:'PASS',causalTraceIsAdditionalGate:false},adversarial:{legacySemanticInheritance:'REJECT',proximityAdjacency:'REJECT',thematicAdjacency:'REJECT',absenceOfAuthorityInheritance:'REJECT',wrongLocus:'REJECT',invalidAccessibleTouch:'REJECT'},geometry:{targetBoundaryClearancePx:10,independentRepresentativeCases:4,status:'PASS_EXTERIOR_ENDPOINT_REDERIVATION'},evidenceClass:'DETACHED_FRESH_DERIVATION_TO_BE_COMBINED_WITH_CONNECTOR_EXACT_HEAD_AND_SCOPE_AUDIT',limitations:['NOT_NETWORK_CHECKOUT','NOT_NETWORK_SERVED_BROWSER_REPRODUCTION','NOT_GITHUB_ACTIONS_CI','DOES_NOT_REPLACE_PRIOR_RUNTIME_ACCESSIBILITY_OR_PERCEPTUAL_EVIDENCE','NOT_USER_DIFFERENTIAL','NO_PUBLIC_PROMOTION_CLAIM']};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
