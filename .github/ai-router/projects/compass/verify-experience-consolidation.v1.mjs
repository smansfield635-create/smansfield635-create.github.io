#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';

const OPERATION_ID='COMPASS_INSTRUCTIONAL_HIERARCHY_AND_DIMENSIONAL_SCALE_SUCCESSOR_20260819_v2';
const LOCK_GENERATION=1556;
const GOVERNING_HEAD='fe39febded099960ad7b43f631014c062ef8beff';
const amendmentPath='.github/ai-router/projects/compass/experience-consolidation-amendment.v1.json';
const capturePath=process.env.COMPASS_EXPERIENCE_CAPTURE_INPUT||'/tmp/compass-experience-capture-receipt.json';
const output=process.env.COMPASS_EXPERIENCE_OUTPUT||'/tmp/compass-experience-consolidation-receipt.json';
const candidateHead=process.env.COMPASS_CANDIDATE_HEAD||cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).trim();
const product=new Set(['index.html','assets/compass/compass.css','assets/compass/compass.capability-carousel.css']);
const qualification=new Set([amendmentPath,'.github/ai-router/projects/compass/verify-experience-consolidation.v1.mjs','.github/workflows/compass-display-continuity-validation.yml']);
const protectedRuntime=['assets/compass/compass.controller.js','assets/compass/compass.mirrorland-window.js','assets/compass/compass.crystals.js','assets/compass/compass.cosmos.js','assets/compass/compass.laws-spacecraft.js','assets/compass/compass.identity-3d.js','assets/compass/compass.statement-carousel.js','assets/compass/compass.capability-carousel.js','assets/compass/compass.brain.js','assets/compass/compass.brain-scene.js'];
const hardZeroNames=['visualSystemCoherence','narrativeContinuity','interactionLegibility','responsiveRecomposition','evidenceHierarchy','categoryPreservation','visibleGeometryIntegrity','traversalContinuity','stateLayerExclusivity','purposeVisibleBeforePrimaryInteraction','compassObjectiveVisibleAtCompass','semanticDisclosureLabels','dimensionalStageProportionality'];
const failures=[];const checks={};
const check=(id,pass,evidence=null)=>{checks[id]={pass:Boolean(pass),evidence};if(!pass)failures.push(id)};
let amendment=null;try{amendment=JSON.parse(fs.readFileSync(amendmentPath,'utf8'));}catch{}
check('AMENDMENT_BOUND',amendment?.operationId===OPERATION_ID&&amendment?.lockGeneration===LOCK_GENERATION&&amendment?.governingHead===GOVERNING_HEAD,amendment&&{operationId:amendment.operationId,lockGeneration:amendment.lockGeneration,governingHead:amendment.governingHead});
check('ACCEPTANCE_CONJUNCTIVE',amendment?.acceptance==='ENGINEERING_PASS_AND_EXPERIENCE_PASS_AND_INFORMATION_HIERARCHY_PASS_AND_RENDERED_OWNER_REVIEW_READY',amendment?.acceptance);
check('THIRTEEN_HARD_ZERO_BOUND',Array.isArray(amendment?.hardZero)&&hardZeroNames.every(name=>amendment.hardZero.includes(name)),amendment?.hardZero);
let changed=[];try{changed=cp.execFileSync('git',['diff','--name-only',`${GOVERNING_HEAD}...HEAD`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);}catch{}
const allowed=new Set([...product,...qualification]);
check('EXACT_MUTATION_ENVELOPE',changed.every(p=>allowed.has(p)),changed);
check('PROTECTED_RUNTIME_UNCHANGED',protectedRuntime.every(p=>!changed.includes(p)),changed.filter(p=>protectedRuntime.includes(p)));
check('PRODUCT_MUTATION_PRESENT',changed.some(p=>product.has(p)),changed.filter(p=>product.has(p)));
const index=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('assets/compass/compass.capability-carousel.css','utf8');
const controller=fs.readFileSync('assets/compass/compass.controller.js','utf8');
check('PURPOSE_SOURCE_PRESERVED',index.includes('Why Diamond Gate exists')&&index.includes('Diamond Gate exists because'),null);
check('COMPASS_OBJECTIVE_SOURCE_PRESERVED',index.includes('find the door to Mirrorland')&&index.includes('Rotate the Compass. Bring a star forward to learn what it contains. Follow the rooms until the door becomes clear.'),null);
check('PURPOSE_REORDER_PRESENTATION_BOUND',css.includes('.compass-purpose-stage{order:1!important')&&css.includes('.compass-instrument{order:2!important'),null);
check('SEMANTIC_DISCLOSURE_REPLACEMENT_BOUND',css.includes('Read the full rationale')&&css.includes('.compass-purpose-context>summary{font-size:0!important'),null);
check('COMPASS_INSTRUCTION_PRESENTATION_BOUND',css.includes('.compass-orbit-intro{display:block!important')&&css.includes('.compass-orbit-intro h2{display:block!important')&&css.includes('.compass-orbit-intro>p:last-child{display:block!important'),null);
check('DIMENSIONAL_SCALE_SOURCE_BOUND',css.includes('min-height:31rem')&&css.includes('height:clamp(285px,34vw,345px)')&&css.includes('min-height:29rem')&&css.includes('min-height:27rem'),null);
check('TRAVERSAL_SOURCE_PRESERVED',controller.includes('setPanelDescended(\n      true\n    );')&&controller.includes('schedulePanelDescent(\n      id\n    );')&&controller.includes('scheduleSceneAscent(\n      wing\n    );'),null);
check('CONTROLLER_ARCHITECTURE_PRESERVED',controller.includes('ROOM_SELECTED')&&controller.includes('MIRRORLAND_FOCUSED')&&controller.includes('RIGHT_HANDED_EUCLIDEAN_XYZ')&&controller.includes('requestReturnToConstellation')&&controller.includes('requestReturnToOrbit'),null);
let capture=null;try{capture=JSON.parse(fs.readFileSync(capturePath,'utf8'));}catch{}
check('CAPTURE_RECEIPT_PRESENT',Boolean(capture),capturePath);
if(capture){
 check('CAPTURE_EXACT_HEAD',capture.candidateHead===candidateHead,{expected:candidateHead,actual:capture.candidateHead});
 check('CAPTURE_GOVERNING_HEAD',capture.governingHead===GOVERNING_HEAD,{expected:GOVERNING_HEAD,actual:capture.governingHead});
 for(const name of hardZeroNames)check(`HARD_ZERO_${name}`,capture.hardZero?.[name]===true,capture.hardZero?.[name]);
 check('STATE_MATRIX_COMPLETE',capture.stateMatrixComplete===true,capture.stateCoverage);
 check('NO_BROWSER_ERRORS',Array.isArray(capture.errors)&&capture.errors.length===0,capture.errors);
}
const receipt={schema:'COMPASS_INFORMATION_HIERARCHY_DIMENSIONAL_SCALE_RECEIPT_v1',operationId:OPERATION_ID,lockGeneration:LOCK_GENERATION,candidateHead,governingHead:GOVERNING_HEAD,changedPaths:changed,hardZero:Object.fromEntries(hardZeroNames.map(k=>[k,capture?.hardZero?.[k]===true])),checks,failures,result:failures.length?'EXPERIENCE_FAIL_CLOSED':'EXPERIENCE_PASS_CLOSED'};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);