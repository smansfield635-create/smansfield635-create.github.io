#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';

const OPERATION_ID='COMPASS_EXPERIENCE_CONSOLIDATION_SUCCESSOR_20260818_v1';
const LOCK_GENERATION=1552;
const GOVERNING_HEAD='cfd1924c485893dedeeb2fd1fefcb91c521d7c2a';
const output=process.env.COMPASS_EXPERIENCE_OUTPUT||'/tmp/compass-experience-consolidation-receipt.json';
const captureInput=process.env.COMPASS_EXPERIENCE_CAPTURE_INPUT||'/tmp/compass-experience-capture-receipt.json';
const amendmentPath='.github/ai-router/projects/compass/experience-consolidation-amendment.v1.json';
const candidateHead=process.env.COMPASS_CANDIDATE_HEAD||cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).trim();

const productEnvelope=new Set([
  'index.html',
  'assets/compass/compass.css',
  'assets/compass/compass.statement-carousel.css',
  'assets/compass/compass.capability-carousel.css',
  'assets/compass/compass.identity-3d.css'
]);
const qualificationEnvelope=new Set([
  amendmentPath,
  '.github/ai-router/projects/compass/verify-experience-consolidation.v1.mjs',
  '.github/workflows/compass-display-continuity-validation.yml',
  '.github/ai-router/projects/compass/entrypoint.v1.json',
  '.github/ai-router/router.v1.json'
]);
const protectedRuntime=[
  'assets/compass/compass.controller.js',
  'assets/compass/compass.crystals.js',
  'assets/compass/compass.cosmos.js',
  'assets/compass/compass.mirrorland-window.js',
  'assets/compass/compass.laws-spacecraft.js',
  'assets/compass/compass.identity-3d.js',
  'assets/compass/compass.statement-carousel.js',
  'assets/compass/compass.capability-carousel.js',
  'assets/compass/compass.brain.js',
  'assets/compass/compass.brain-scene.js'
];
const hardZeroNames=[
  'visualSystemCoherence',
  'narrativeContinuity',
  'interactionLegibility',
  'responsiveRecomposition',
  'evidenceHierarchy',
  'categoryPreservation'
];
const requiredViewports={desktop:[1440,1000],tablet:[1024,1366],phone:[390,844]};
const requiredDesktopBeats=['opening','compass-constellation','mirrorland-threshold','selected-room','brain','trophy','house','purpose-engagement','readiness-evidence','conclusion'];
const requiredPhoneBeats=['compass-constellation','dimensional-capability','readiness-evidence','conclusion'];
const requiredReduced={desktop:['opening','compass','dimensional-capability','conclusion'],phone:['opening','compass','conclusion']};

const failures=[];
const checks={};
const check=(id,pass,evidence=null)=>{checks[id]={pass:Boolean(pass),evidence};if(!pass)failures.push(id)};
const read=p=>fs.readFileSync(p,'utf8');

let amendment=null;
try{amendment=JSON.parse(read(amendmentPath));}catch(e){failures.push('AMENDMENT_READ_FAILURE')}
check('AMENDMENT_BOUND',Boolean(amendment)&&amendment.operationId===OPERATION_ID&&amendment.lockGeneration===LOCK_GENERATION&&amendment.governingHead===GOVERNING_HEAD,amendment&&{operationId:amendment.operationId,lockGeneration:amendment.lockGeneration,governingHead:amendment.governingHead});
check('ACCEPTANCE_IS_CONJUNCTIVE',amendment?.acceptance==='ENGINEERING_PASS_AND_EXPERIENCE_PASS',amendment?.acceptance);
check('CONSTRUCTION_ORDER_SUBTRACTION_FIRST',Array.isArray(amendment?.constructionOrder)&&amendment.constructionOrder.join('>')==='INVENTORY>PRESERVE>REMOVE>DEMOTE>MERGE>DISSOLVE>RECOMPOSE>ADD_ONLY_IF_NECESSARY',amendment?.constructionOrder);

let changed=[];
try{changed=cp.execFileSync('git',['diff','--name-only',`${GOVERNING_HEAD}...HEAD`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);}catch(e){failures.push('DIFF_READ_FAILURE')}
const allowed=new Set([...productEnvelope,...qualificationEnvelope]);
check('EXACT_MUTATION_ENVELOPE',changed.every(p=>allowed.has(p)),changed);
check('PROTECTED_RUNTIME_PATHS_UNCHANGED',protectedRuntime.every(p=>!changed.includes(p)),changed.filter(p=>protectedRuntime.includes(p)));
check('PRODUCT_MUTATION_PRESENT',changed.some(p=>productEnvelope.has(p)),changed.filter(p=>productEnvelope.has(p)));

const consolidationCss=fs.existsSync('assets/compass/compass.statement-carousel.css')?read('assets/compass/compass.statement-carousel.css'):'';
const cssSignals={
  glassIntroductionDissolved:/\.compass-introduction__body[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
  compassPanelDissolved:/\.compass-panel\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
  capabilityCardsDissolved:/\.compass-monument\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
  dimensionalPlaqueDissolved:/\.compass-orbit-plaque\{[^}]*border-color:transparent!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
  proofStageDissolved:/\.compass-built\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
  ctaDissolved:/\.compass-build-cta a\{[^}]*border:0!important[^}]*background:none!important/s.test(consolidationCss),
  tabletRecomposition:/@media\(max-width:900px\)/.test(consolidationCss)&&/\.compass-panel\{grid-template-columns:1fr!important/.test(consolidationCss),
  phoneRecomposition:/@media\(max-width:560px\)/.test(consolidationCss)&&/\.compass-capability-choices\{grid-template-columns:1fr!important/.test(consolidationCss),
  reducedMotion:/@media\(prefers-reduced-motion:reduce\)/.test(consolidationCss)
};
check('VISIBLE_MECHANISM_REDUCTION_STATIC',Object.entries(cssSignals).filter(([k])=>!['tabletRecomposition','phoneRecomposition','reducedMotion'].includes(k)).every(([,v])=>v),cssSignals);
check('RESPONSIVE_RECOMPOSITION_STATIC',cssSignals.tabletRecomposition&&cssSignals.phoneRecomposition,cssSignals);
check('REDUCED_MOTION_RULE_PRESERVED',cssSignals.reducedMotion,cssSignals.reducedMotion);

let capture=null;
if(fs.existsSync(captureInput)){
  try{capture=JSON.parse(read(captureInput));}catch(e){failures.push('CAPTURE_RECEIPT_PARSE_FAILURE')}
}
check('CAPTURE_RECEIPT_PRESENT',Boolean(capture),captureInput);
if(capture){
  check('CAPTURE_CANDIDATE_BOUND',capture.candidateHead===candidateHead,{expected:candidateHead,actual:capture.candidateHead});
  check('CAPTURE_BASELINE_BOUND',capture.governingHead===GOVERNING_HEAD,{expected:GOVERNING_HEAD,actual:capture.governingHead});
  const viewportMap=Object.fromEntries((capture.viewports||[]).map(v=>[v.id,[v.width,v.height]]));
  check('VIEWPORT_MATRIX_EXACT',Object.entries(requiredViewports).every(([id,dims])=>JSON.stringify(viewportMap[id])===JSON.stringify(dims)),viewportMap);
  const desktopBeats=new Set(capture.beats?.desktop||[]),phoneBeats=new Set(capture.beats?.phone||[]);
  check('DESKTOP_BEAT_MATRIX',requiredDesktopBeats.every(x=>desktopBeats.has(x)),[...desktopBeats]);
  check('PHONE_BEAT_MATRIX',requiredPhoneBeats.every(x=>phoneBeats.has(x)),[...phoneBeats]);
  const rd=new Set(capture.reducedMotionBeats?.desktop||[]),rp=new Set(capture.reducedMotionBeats?.phone||[]);
  check('REDUCED_MOTION_BEAT_MATRIX',requiredReduced.desktop.every(x=>rd.has(x))&&requiredReduced.phone.every(x=>rp.has(x)),{desktop:[...rd],phone:[...rp]});
  check('NO_HORIZONTAL_OVERFLOW',(capture.overflow||[]).every(x=>Number(x.delta)<=1),capture.overflow);
  check('PROTECTED_CAPABILITY_NONREGRESSION',capture.protectedCapabilityNonregression===true,capture.protectedCapabilityNonregression);
  check('PUBLIC_CLAIM_EVIDENCE_SEPARATION',capture.publicClaimEvidenceSeparation===true,capture.publicClaimEvidenceSeparation);
  check('CATEGORY_TEXT_PRESERVED',capture.categoryPreservationText==='Independent Studio for Interactive Worlds, Creative Technology & Original Systems',capture.categoryPreservationText);
  for(const name of hardZeroNames)check(`HARD_ZERO_${name}`,capture.hardZero?.[name]===true,capture.hardZero?.[name]);
}

const experiencePass=failures.length===0;
const receipt={
  schema:'COMPASS_EXPERIENCE_CONSOLIDATION_RECEIPT_v1',
  operationId:OPERATION_ID,
  lockGeneration:LOCK_GENERATION,
  candidateHead,
  governingHead:GOVERNING_HEAD,
  changedPaths:changed,
  hardZero:hardZeroNames.reduce((o,k)=>(o[k]=capture?.hardZero?.[k]===true,o),{}),
  checks,
  failures,
  result:experiencePass?'EXPERIENCE_PASS_CLOSED':'EXPERIENCE_FAIL_CLOSED'
};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(!experiencePass)process.exit(1);
