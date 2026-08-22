#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';

const OPERATION_ID='COMPASS_EXPERIENCE_INTERACTION_RESTORATION_SUCCESSOR_20260819_v2';
const LOCK_GENERATION=1553;
const GOVERNING_HEAD='cfd1924c485893dedeeb2fd1fefcb91c521d7c2a';
const amendmentPath='.github/ai-router/projects/compass/experience-consolidation-amendment.v1.json';
const capturePath=process.env.COMPASS_EXPERIENCE_CAPTURE_INPUT||'/tmp/compass-experience-capture-receipt.json';
const output=process.env.COMPASS_EXPERIENCE_OUTPUT||'/tmp/compass-experience-consolidation-receipt.json';
const candidateHead=process.env.COMPASS_CANDIDATE_HEAD||cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).trim();
const product=new Set(['index.html','assets/compass/compass.css','assets/compass/compass.statement-carousel.css','assets/compass/compass.capability-carousel.css','assets/compass/compass.identity-3d.css','assets/compass/compass.controller.js','assets/compass/compass.mirrorland-window.js']);
const qualification=new Set([amendmentPath,'.github/ai-router/projects/compass/verify-experience-consolidation.v1.mjs','.github/workflows/compass-display-continuity-validation.yml','.github/ai-router/projects/compass/entrypoint.v1.json','.github/ai-router/router.v1.json']);
const protectedRuntime=['assets/compass/compass.crystals.js','assets/compass/compass.cosmos.js','assets/compass/compass.laws-spacecraft.js','assets/compass/compass.identity-3d.js','assets/compass/compass.statement-carousel.js','assets/compass/compass.capability-carousel.js','assets/compass/compass.brain.js','assets/compass/compass.brain-scene.js'];
const hardZeroNames=['visualSystemCoherence','narrativeContinuity','interactionLegibility','responsiveRecomposition','evidenceHierarchy','categoryPreservation','visibleGeometryIntegrity','traversalContinuity','stateLayerExclusivity'];
const failures=[];const checks={};
const check=(id,pass,evidence=null)=>{checks[id]={pass:Boolean(pass),evidence};if(!pass)failures.push(id)};
let amendment=null;try{amendment=JSON.parse(fs.readFileSync(amendmentPath,'utf8'));}catch{}
check('AMENDMENT_BOUND',amendment?.operationId===OPERATION_ID&&amendment?.lockGeneration===LOCK_GENERATION&&amendment?.governingHead===GOVERNING_HEAD,amendment&&{operationId:amendment.operationId,lockGeneration:amendment.lockGeneration,governingHead:amendment.governingHead});
check('ACCEPTANCE_CONJUNCTIVE',amendment?.acceptance==='ENGINEERING_PASS_AND_EXPERIENCE_PASS_AND_RENDERED_AWARD_READINESS_REVIEW',amendment?.acceptance);
let changed=[];try{changed=cp.execFileSync('git',['diff','--name-only',`${GOVERNING_HEAD}...HEAD`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);}catch{}
const allowed=new Set([...product,...qualification]);
check('EXACT_MUTATION_ENVELOPE',changed.every(p=>allowed.has(p)),changed);
check('PROTECTED_RUNTIME_UNCHANGED',protectedRuntime.every(p=>!changed.includes(p)),changed.filter(p=>protectedRuntime.includes(p)));
check('PRODUCT_MUTATION_PRESENT',changed.some(p=>product.has(p)),changed.filter(p=>product.has(p)));
const controller=fs.readFileSync('assets/compass/compass.controller.js','utf8');
check('TRAVERSAL_SOURCE_RESTORED',controller.includes('setPanelDescended(\n      true\n    );')&&controller.includes('schedulePanelDescent(\n      id\n    );')&&controller.includes('scheduleSceneAscent(\n      wing\n    );'),null);
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
const receipt={schema:'COMPASS_EXPERIENCE_INTERACTION_RESTORATION_RECEIPT_v2',operationId:OPERATION_ID,lockGeneration:LOCK_GENERATION,candidateHead,governingHead:GOVERNING_HEAD,changedPaths:changed,hardZero:Object.fromEntries(hardZeroNames.map(k=>[k,capture?.hardZero?.[k]===true])),checks,failures,result:failures.length?'EXPERIENCE_FAIL_CLOSED':'EXPERIENCE_PASS_CLOSED'};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
