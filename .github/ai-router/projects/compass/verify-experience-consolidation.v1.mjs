#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';

const OPERATION_ID='COMPASS_SHARED_ORBIT_STAGE_AND_LUMINOUS_IDENTITY_SUCCESSOR_20260819_v1';
const LOCK_GENERATION=1560;
const GOVERNING_HEAD='e68740655c05bafef86b18457873cabdab3e8a67';
const amendmentPath='.github/ai-router/projects/compass/experience-consolidation-amendment.v1.json';
const capturePath=process.env.COMPASS_EXPERIENCE_CAPTURE_INPUT||'/tmp/compass-experience-capture-receipt.json';
const output=process.env.COMPASS_EXPERIENCE_OUTPUT||'/tmp/compass-experience-consolidation-receipt.json';
const candidateHead=process.env.COMPASS_CANDIDATE_HEAD||cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).trim();
const product=new Set(['index.html','assets/compass/compass.css','assets/compass/compass.capability-carousel.css','assets/compass/compass.capability-carousel.js']);
const qualification=new Set([amendmentPath,'.github/ai-router/projects/compass/verify-experience-consolidation.v1.mjs','.github/workflows/compass-display-continuity-validation.yml']);
const protectedRuntime=['assets/compass/compass.controller.js','assets/compass/compass.mirrorland-window.js','assets/compass/compass.crystals.js','assets/compass/compass.cosmos.js','assets/compass/compass.laws-spacecraft.js','assets/compass/compass.identity-3d.js','assets/compass/compass.statement-carousel.js','assets/compass/compass.statement-carousel.css','assets/compass/compass.brain.js','assets/compass/compass.brain-scene.js','assets/compass/compass.trophy-scene.js','assets/compass/compass.house-scene.js'];
const hardZeroNames=['visualSystemCoherence','narrativeContinuity','interactionLegibility','responsiveRecomposition','evidenceHierarchy','categoryPreservation','visibleGeometryIntegrity','traversalContinuity','stateLayerExclusivity','purposeVisibleBeforePrimaryInteraction','compassObjectiveVisibleAtCompass','semanticDisclosureLabels','dimensionalStageProportionality'];
const failures=[];const checks={};const check=(id,pass,evidence=null)=>{checks[id]={pass:Boolean(pass),evidence};if(!pass)failures.push(id)};
let amendment=null;try{amendment=JSON.parse(fs.readFileSync(amendmentPath,'utf8'));}catch{}
check('AMENDMENT_BOUND',amendment?.operationId===OPERATION_ID&&amendment?.lockGeneration===LOCK_GENERATION&&amendment?.governingHead===GOVERNING_HEAD,amendment&&{operationId:amendment.operationId,lockGeneration:amendment.lockGeneration,governingHead:amendment.governingHead});
check('ACCEPTANCE_CONJUNCTIVE',amendment?.acceptance==='ENGINEERING_PASS_AND_STATE_TRANSITION_PASS_AND_SPATIAL_ECONOMY_PASS_AND_RENDERED_DESKTOP_TABLET_PHONE_REVIEW_PASS',amendment?.acceptance);
check('THIRTEEN_HARD_ZERO_BOUND',Array.isArray(amendment?.hardZero)&&hardZeroNames.every(name=>amendment.hardZero.includes(name)),amendment?.hardZero);
let changed=[];try{changed=cp.execFileSync('git',['diff','--name-only',`${GOVERNING_HEAD}...HEAD`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);}catch{}
const allowed=new Set([...product,...qualification]);
check('EXACT_MUTATION_ENVELOPE',changed.every(p=>allowed.has(p)),changed);
check('PROTECTED_RUNTIME_UNCHANGED',protectedRuntime.every(p=>!changed.includes(p)),changed.filter(p=>protectedRuntime.includes(p)));
check('PRODUCT_MUTATION_PRESENT',changed.some(p=>product.has(p)),changed.filter(p=>product.has(p)));
const index=fs.readFileSync('index.html','utf8');
const runtime=fs.readFileSync('assets/compass/compass.capability-carousel.js','utf8');
const controller=fs.readFileSync('assets/compass/compass.controller.js','utf8');
check('PURPOSE_SOURCE_PRESERVED',index.includes('Why Diamond Gate exists')&&index.includes('Diamond Gate exists because'),null);
check('PURPOSE_COLLAPSED_DEFAULT_DEPTH_PRESERVED',runtime.includes("document.querySelector('[data-compass-purpose-stage]')")&&runtime.includes("purpose.open=false")&&runtime.includes("purpose.dataset.gen1560CollapsedDefault='true'")&&runtime.includes('.compass-purpose-stage:not([open])'),null);
check('SINGLE_TOP_IDENTITY_EVENT',runtime.includes("kicker.textContent='Find Your Way'")&&runtime.includes("dataset.identityEvent='single'")&&runtime.includes('dgbIdentityArrival'),null);
check('FOREGROUND_NOT_ENTER',runtime.includes('Enter only after the object settles in front.')&&runtime.includes('actionAuthority:settled'),null);
check('ONE_FOREGROUND_OBJECT',runtime.includes("c.dataset.active=String(active)")&&runtime.includes('setInteractive(c,active)'),null);
check('ACTION_DOCK_MATCHES_FOREGROUND',runtime.includes('spec.action.forEach')&&runtime.includes("dock.replaceChildren()"),null);
check('ACTION_DISABLED_DURING_DRAG_OR_SETTLE',runtime.includes("dock.setAttribute('aria-busy'")&&runtime.includes('state.dragging||state.settling'),null);
check('CONTINUOUS_DRAG_VELOCITY_SNAP',runtime.includes('state.velocity')&&runtime.includes('projected=state.angle')&&runtime.includes('drag-snap'),null);
check('OBJECT_STAGE_AND_PROOF_STAGE_DISTINCT',runtime.includes("dataset.stageKind='object'")&&runtime.includes("dataset.stageKind='proof'"),null);
check('SPATIAL_ECONOMY',runtime.includes('.compass-capability-orbit{min-height:25rem}')&&runtime.includes('.compass-capability-orbit{min-height:22.5rem}'),null);
check('BOUNDED_OBJECT_ARRIVAL_RESPONSE',runtime.includes('objectArrival')&&runtime.includes('data-arriving'),null);
check('COMPASS_LUMINOUS_EFFECT_NON_BLOCKING',runtime.includes('compassBreathe')&&runtime.includes('pointer-events:none'),null);
check('HOUSE_ACTIONS_PRESERVED',runtime.includes('Speak with Jeeves')&&runtime.includes('/elara/')&&runtime.includes('/products/auren/'),null);
check('GEN1538_STATIC_COMPATIBILITY_NON_AUTHORITATIVE',runtime.includes('gen1538SettleCompatibility')&&runtime.includes('setTimeout(settle,320)')&&runtime.includes('busy=false'),null);
check('TRAVERSAL_SOURCE_PRESERVED',controller.includes('ROOM_SELECTED')&&controller.includes('MIRRORLAND_FOCUSED')&&controller.includes('requestReturnToConstellation')&&controller.includes('requestReturnToOrbit'),null);
let capture=null;try{capture=JSON.parse(fs.readFileSync(capturePath,'utf8'));}catch{}
check('CAPTURE_RECEIPT_PRESENT',Boolean(capture),capturePath);
if(capture){check('CAPTURE_EXACT_HEAD',capture.candidateHead===candidateHead,{expected:candidateHead,actual:capture.candidateHead});check('CAPTURE_GOVERNING_HEAD',capture.governingHead===GOVERNING_HEAD,{expected:GOVERNING_HEAD,actual:capture.governingHead});for(const name of hardZeroNames)check(`HARD_ZERO_${name}`,capture.hardZero?.[name]===true,capture.hardZero?.[name]);check('STATE_MATRIX_COMPLETE',capture.stateMatrixComplete===true,capture.stateCoverage);check('NO_BROWSER_ERRORS',Array.isArray(capture.errors)&&capture.errors.length===0,capture.errors)}
const receipt={schema:'COMPASS_SHARED_ORBIT_STATE_RECEIPT_v1',operationId:OPERATION_ID,lockGeneration:LOCK_GENERATION,candidateHead,governingHead:GOVERNING_HEAD,changedPaths:changed,hardZero:Object.fromEntries(hardZeroNames.map(k=>[k,capture?.hardZero?.[k]===true])),checks,failures,result:failures.length?'EXPERIENCE_FAIL_CLOSED':'EXPERIENCE_PASS_CLOSED'};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
