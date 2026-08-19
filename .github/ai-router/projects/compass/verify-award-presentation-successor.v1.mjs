#!/usr/bin/env node
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const BASE=process.env.COMPASS_AWARD_BASE_SHA||'4e2ab91a18ab6a36fd47b83f794267a896d86fde';
const OUT=process.env.COMPASS_AWARD_STATIC_OUTPUT||'/tmp/compass-award-presentation-static-receipt.json';
const allowed=new Set([
  'index.html','assets/compass/compass.css','assets/compass/compass.statement-carousel.js','assets/compass/compass.statement-carousel.css','assets/compass/compass.capability-carousel.js','assets/compass/compass.capability-carousel.css','assets/compass/compass.crystals.js','assets/compass/compass.laws-spacecraft.js','assets/compass/compass.cosmos.js','.github/ai-router/projects/compass/verify-award-presentation-successor.v1.mjs','.github/workflows/compass-display-continuity-validation.yml'
]);
const read=p=>fs.readFileSync(p,'utf8');
const head=execFileSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).trim();
const changed=execFileSync('git',['diff','--name-only',`${BASE}...HEAD`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const statement=read('assets/compass/compass.statement-carousel.js');
const capability=read('assets/compass/compass.capability-carousel.js');
const lawsSpacecraft=read('assets/compass/compass.laws-spacecraft.js');
const index=read('index.html');
const checks=[];
const check=(id,pass,evidence='')=>checks.push({id,pass:Boolean(pass),evidence});

check('EXACT_SCOPE',changed.every(p=>allowed.has(p)),changed);
check('REDUNDANT_SPACECRAFT_PRESENTATION_REMOVED',!statement.includes('function mountWorldInteraction')&&!statement.includes('SCENE_BOUND_TRUE_3D_BOUNDED_INTERACTION_NO_NAVIGATION_AUTHORITY'),'statement owner no longer installs scene interaction');
check('ONE_SPACECRAFT_PRESENTATION_AUTHORITY',statement.includes("spacecraftSurface:'LAWS_SPACECRAFT_ONLY'")&&lawsSpacecraft.includes('DIRECT_LAWS_PRESENTATION_OWNER')&&lawsSpacecraft.includes('DGB_COMPASS_DISABLE_LOCAL_SPACECRAFT=true'),'Laws adapter is sole adopted presentation owner');
check('PURPOSE_FIRST_READ_ESTABLISHED',statement.includes('compass-purpose-first-read')&&statement.includes('Useful ideas become easier to navigate')&&statement.includes('Explore the fuller context')&&statement.includes('position:relative!important'),'purpose is normal-flow, concise first read with preserved deeper context');
const narrativeToken=statement.includes("root.dataset.awardNarrative='identity-experience-purpose-system-readiness-evidence'");
check('NARRATIVE_SEQUENCE',narrativeToken&&statement.includes('instrument.after(purpose)')&&statement.includes('purpose.after(capabilities)')&&statement.includes('capabilities.after(readiness)'),'identity → experience → purpose → system → readiness → evidence');
check('TRL_TRA_SHARED_STAGE',statement.includes("readiness.dataset.readinessStage='trl-tra'")&&statement.includes('data-readiness-mode-button="trl"')&&statement.includes('data-readiness-mode-button="tra"')&&statement.includes('Executed Capability')&&statement.includes('Authority Isolation')&&statement.includes('Fail-Closed Evidence')&&index.includes('Software TRL 7'),'one three-card stage alternates TRL and TRA contexts');
check('TRL_TRA_BOUNDARY_LANGUAGE',statement.includes('not a second maturity score')&&statement.includes('does not raise Software TRL 7')&&statement.includes('not external certification or endorsement'),'TRA is assessment, not a new level or endorsement');
check('EVIDENCE_EXIT',statement.includes("evidence.href='/evidence/'")&&statement.includes('Open the Evidence Registry'),'direct read-only Evidence Registry exit');
check('V_DEPTH_GEOMETRY',capability.includes('perspective:1400px')&&capability.includes('rear-next')&&capability.includes('rear-prev')&&capability.includes('translate3d'),'existing V-depth geometry retained');
check('DIMENSIONAL_FLOOR',capability.includes('compass-brain-portal')&&capability.includes('compass-award-trophy')&&capability.includes('compass-house-field'),'brain/trophy/House floor retained');
check('REDUCED_MOTION_CONTRACT',capability.includes('@media(prefers-reduced-motion:reduce)')&&statement.includes('@media(prefers-reduced-motion:reduce)'),'reduced-motion path retained');
check('KEYBOARD_SEMANTIC_ORDER',capability.includes("e.key==='ArrowRight'||e.key==='ArrowLeft'")&&statement.includes("event.key==='ArrowRight'||event.key==='ArrowLeft'")&&statement.includes("event.key!=='ArrowLeft'&&event.key!=='ArrowRight'"),'keyboard controls retained for carousels and readiness modes');
check('CLAIM_BOUNDARY',index.includes('TRL 8 is not claimed')&&index.includes('not a claim of universal product, scientific validation, external certification, or NASA endorsement')&&statement.includes('does not raise Software TRL 7'),'existing bounded TRL claim preserved');
check('GEN1538_ROOM_SELECTED_CONTINUITY_BINDING',fs.existsSync('.github/ai-router/projects/compass/verify-display-continuity.v1.mjs'),'existing Gen1538 verifier remains present');

const failures=checks.filter(x=>!x.pass);
const receipt={schema:'COMPASS_AWARD_PRESENTATION_STATIC_RECEIPT_v1',operationId:'COMPASS_AWARD_PRESENTATION_SUCCESSOR_20260818_v3',lockGeneration:1549,governingHead:'4e2ab91a18ab6a36fd47b83f794267a896d86fde',candidateHead:head,baseHead:BASE,changedPaths:changed,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',checks,failures:failures.map(x=>x.id)};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exit(1);
