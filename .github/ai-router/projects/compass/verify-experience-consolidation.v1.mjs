#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';

const OPERATION_ID='COMPASS_RECOVERED_BASELINE_RECONCILIATION_20260819_v1';
const LOCK_GENERATION=1561;
const GOVERNING_HEAD='b3b0d52f28c09e75389552a8d4b3de26b080db1b';
const capturePath=process.env.COMPASS_EXPERIENCE_CAPTURE_INPUT||'/tmp/compass-experience-capture-receipt.json';
const output=process.env.COMPASS_EXPERIENCE_OUTPUT||'/tmp/compass-experience-consolidation-receipt.json';
const candidateHead=process.env.COMPASS_CANDIDATE_HEAD||cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).trim();
const allowed=new Set([
  'index.html',
  'assets/compass/compass.capability-carousel.js',
  'assets/compass/compass.capability-carousel.css',
  'assets/compass/compass.identity-3d.js',
  'assets/compass/compass.identity-3d.css',
  'assets/compass/compass.trophy-scene.js',
  '.github/ai-router/projects/compass/verify-experience-consolidation.v1.mjs',
  '.github/workflows/compass-display-continuity-validation.yml'
]);
const protectedPaths=[
  'assets/compass/compass.controller.js',
  'assets/compass/compass.crystals.js',
  'assets/compass/compass.mirrorland-window.js',
  'assets/compass/compass.cosmos.js',
  'assets/compass/compass.statement-carousel.js',
  'assets/compass/compass.statement-carousel.css',
  'assets/compass/compass.brain-scene.js',
  'assets/compass/compass.house-scene.js',
  'assets/compass/compass.gen1537.recovery.js'
];
const hardZeroNames=[
  'lowerProofOrbitPreserved','noCenterCompass','mirrorlandObjectivePresent','clusterGuidanceComplete',
  'trophyStressStable','upperForegroundExclusive','localActionMatchesSelection','noNavigationDuringDrag',
  'spatialEconomy','responsiveIntegrity','protectedConstellationTraversal','protectedStatementPresence',
  'noBrowserErrors','noHorizontalOverflow'
];
const failures=[];const checks={};
const check=(id,pass,evidence=null)=>{checks[id]={pass:Boolean(pass),evidence};if(!pass)failures.push(id)};
const read=p=>fs.readFileSync(p,'utf8');
let changed=[];try{changed=cp.execFileSync('git',['diff','--name-only',`${GOVERNING_HEAD}...HEAD`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean)}catch{}
const index=read('index.html');
const capability=read('assets/compass/compass.capability-carousel.js');
const controller=read('assets/compass/compass.controller.js');
const recovery=read('assets/compass/compass.gen1537.recovery.js');
check('OPERATION_BOUND',OPERATION_ID==='COMPASS_RECOVERED_BASELINE_RECONCILIATION_20260819_v1'&&LOCK_GENERATION===1561&&GOVERNING_HEAD==='b3b0d52f28c09e75389552a8d4b3de26b080db1b',{operationId:OPERATION_ID,lockGeneration:LOCK_GENERATION,governingHead:GOVERNING_HEAD});
check('EXACT_MUTATION_ENVELOPE',changed.every(p=>allowed.has(p)),changed);
check('PROTECTED_PATHS_UNCHANGED',protectedPaths.every(p=>!changed.includes(p)),changed.filter(p=>protectedPaths.includes(p)));
check('PRODUCT_MUTATION_PRESENT',changed.includes('assets/compass/compass.capability-carousel.js'),changed);
check('LOWER_PROOF_REFERENCE_SOURCE',capability.includes("function mountProof(){const stage=document.querySelector('[data-proof-orbit]')")&&capability.includes("rail('proof',['TRL 7','Bounded','Checked'])")&&capability.includes('Swipe or use the controls to inspect one proof point at a time.')&&capability.includes('timer=setTimeout(settle,320)')&&capability.includes('window.CompassOrbitInput?.claimSwipe(stage,rotate)'),null);
check('NO_PROOF_TAB_REPLACEMENT',!capability.includes('compass-proof-choice')&&!capability.includes('data-built-proof-choice'),null);
check('UPPER_RECONCILIATION_STAGE_BOUND',capability.includes("stage.dataset.reconciliationStage='gen1561'")&&capability.includes('compass-object-stage')&&capability.includes('compass-action-dock')&&capability.includes('velocity')&&capability.includes("publish('dragging')")&&capability.includes("publish('settling')"),null);
check('FOREGROUND_NOT_ENTER_SOURCE',capability.includes("<div class=\"compass-object-portal compass-brain-portal\"")&&capability.includes("<div class=\"compass-object-portal compass-trophy-portal\"")&&capability.includes("dock.setAttribute('aria-busy'"),null);
check('LOCAL_ACTIONS_BOUND',capability.includes('Enter Coheriscope')&&capability.includes('Enter Awards')&&capability.includes("['Jeeves','/showroom/globe/hearth/jeeves/']")&&capability.includes("['Elara','/elara/']")&&capability.includes("['Auren','/products/auren/']"),null);
check('TROPHY_ANIMATION_NOT_REINTRODUCED',!capability.includes('CompassTrophyScene?.activate')&&capability.includes('gen1561-static-safe'),null);
check('CLUSTER_GUIDANCE_BOUND',capability.includes('Choose a room · <span class="compass-guidance__swipe">Swipe to rotate the cluster</span> · Return to Orbit.'),null);
check('PURPOSE_AND_IDENTITY_REPAIR_BOUND',capability.includes("intro.removeAttribute('open')")&&capability.includes("kicker.textContent='Find Your Way'")&&capability.includes("identity.dataset.gen1561Arrival='true'"),null);
check('MIRRORLAND_OBJECTIVE_SOURCE',index.includes('find the door to Mirrorland')&&index.includes('Rotate the Compass. Bring a star forward to learn what it contains. Follow the rooms until the door becomes clear.'),null);
check('LOWER_PROOF_MARKUP_SOURCE',index.includes('Software TRL 7')&&index.includes('Bounded Changes')&&index.includes('Experience Checked')&&index.includes('data-proof-orbit')&&index.includes('data-proof-card="trl7"'),null);
check('NO_CENTER_COMPASS_RUNTIME_SOURCE',!recovery.includes('mountInstrument()')&&!recovery.includes("data.gen1537CompassInstrument='true'")&&!recovery.includes('FIXED_CENTER_TRUE_3D_PRIMARY_INSTRUMENT'),null);
check('CONTROLLER_TRAVERSAL_SOURCE_PRESERVED',controller.includes('ROOM_SELECTED')&&controller.includes('MIRRORLAND_FOCUSED')&&controller.includes('requestReturnToConstellation')&&controller.includes('requestReturnToOrbit'),null);
let capture=null;try{capture=JSON.parse(fs.readFileSync(capturePath,'utf8'))}catch{}
check('CAPTURE_RECEIPT_PRESENT',Boolean(capture),capturePath);
if(capture){
  check('CAPTURE_EXACT_HEAD',capture.candidateHead===candidateHead,{expected:candidateHead,actual:capture.candidateHead});
  check('CAPTURE_GOVERNING_HEAD',capture.governingHead===GOVERNING_HEAD,{expected:GOVERNING_HEAD,actual:capture.governingHead});
  for(const name of hardZeroNames)check(`HARD_ZERO_${name}`,capture.hardZero?.[name]===true,capture.hardZero?.[name]);
  check('VIEWPORT_MATRIX_COMPLETE',Array.isArray(capture.viewports)&&['desktop','tablet','phone'].every(v=>capture.viewports.includes(v)),capture.viewports);
  check('TROPHY_STRESS_COUNT',Object.values(capture.metrics||{}).every(v=>(v?.trophyArrivals||0)>=10),capture.metrics);
}
const receipt={schema:'COMPASS_RECOVERED_RECONCILIATION_RECEIPT_v1',operationId:OPERATION_ID,lockGeneration:LOCK_GENERATION,candidateHead,governingHead:GOVERNING_HEAD,changedPaths:changed,hardZero:Object.fromEntries(hardZeroNames.map(k=>[k,capture?.hardZero?.[k]===true])),checks,failures,result:failures.length?'EXPERIENCE_FAIL_CLOSED':'EXPERIENCE_PASS_CLOSED'};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exit(1);
