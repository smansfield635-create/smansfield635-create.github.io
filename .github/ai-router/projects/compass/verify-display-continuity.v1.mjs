#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const GOVERNING_HEAD = 'f3088fc54096c08c4f2709b4b8449c542cc470a1';
const OPERATION_ID = 'COMPASS_RENEWAL_CONSTRUCTION_v2_20260814_001';
const OUTPUT = process.env.COMPASS_VERIFICATION_OUTPUT || '/tmp/compass-display-continuity-verification-receipt.json';
const allowedPaths = new Set([
  'index.html','assets/compass/compass-core.css','assets/compass/compass.css','assets/compass/compass.controller.js','assets/compass/compass.cosmos.js','assets/compass/compass.crystals.js','assets/compass/compass.mirrorland-window.js','assets/compass/upstream-compass.css','assets/compass/upstream-compass.geometry.js','assets/compass/upstream-compass.renderer.js','.github/ai-router/projects/compass/construction-execution-plan.v2.display-fidelity-amendment.json','.github/ai-router/projects/compass/construction-execution-plan.v2.information-delivery-amendment.json','.github/ai-router/projects/compass/construction-execution-plan.v2.narrative-transition-coherence-amendment.json','.github/ai-router/projects/compass/entrypoint.v1.json','.github/ai-router/projects/compass/verify-display-continuity.v1.mjs','.github/workflows/compass-display-continuity-validation.yml'
]);
const prohibitedPrefixes = ['door/','home/','showroom/','h-earth-3d/','laws/','evidence/','governance/','products/','build/'];
const read = p => fs.readFileSync(path.join(ROOT,p),'utf8');
const json = p => JSON.parse(read(p));
const git = args => spawnSync('git',args,{cwd:ROOT,encoding:'utf8'});
const checks=[];
const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});

const router=json('.github/ai-router/router.v1.json');
const entrypoint=json('.github/ai-router/projects/compass/entrypoint.v1.json');
const contract=json('.github/ai-router/projects/compass/route-display-contract.v1.json');
const plan=json('.github/ai-router/projects/compass/construction-execution-plan.v2.json');
const html=read('index.html');
const css=read('assets/compass/compass.css');
const coreCss=read('assets/compass/compass-core.css');
const controller=read('assets/compass/compass.controller.js');
const cosmos=read('assets/compass/compass.cosmos.js');

check('COMPASS_PLAN_V2_BOUND',entrypoint.procedures?.constructionPlan==='.github/ai-router/projects/compass/construction-execution-plan.v2.json'&&plan.schema==='COMPASS_PAGE_RECONSTRUCTION_EXECUTION_PLAN_v2'&&plan.status==='LOCKED_DIRECT_REFERENCE_REQUIRED',{entrypointPlan:entrypoint.procedures?.constructionPlan,planSchema:plan.schema,planStatus:plan.status});
check('COMPASS_PROJECT_ROUTE_REGISTERED',Boolean(router.projects?.find(project=>project.projectId==='COMPASS')),'COMPASS route');
check('COMPASS_ENTRYPOINT_ACTIVE',entrypoint.projectId==='COMPASS'&&entrypoint.status==='ACTIVE_REGISTERED_PROJECT',entrypoint.status);
check('ROUTING_CREATES_NO_AUTHORITY',String(entrypoint.authorityBoundary||'').includes('DOES_NOT_CREATE_MUTATION_AUTHORITY'),entrypoint.authorityBoundary);
check('ROUTE_DISPLAY_CONTRACT_PRESENT',contract.schema==='COMPASS_ROUTE_DISPLAY_CONTRACT_v1',contract.schema);

const cardinals=[['north','Orientation'],['east','Worlds'],['south','Instruments'],['west','Frontier']];
for(const [id,label] of cardinals) check(`CARDINAL_${id.toUpperCase()}_PRESENT`,html.includes(`data-cardinal-id="${id}"`)&&html.includes(`data-coordinate-label="${label}"`),`${id}:${label}`);
check('EXACTLY_FOUR_PUBLIC_CARDINAL_IDS',(html.match(/data-cardinal-id="(north|east|south|west)"/g)||[]).length===4,'north,east,south,west');
check('ROOM_DECLARATION_COUNT_19',(html.match(/data-compass-room data-compass-destination/g)||[]).length===19,19);
check('MIRRORLAND_NOT_CARDINAL',html.includes('data-destination-type="mirrorland"')&&!/data-compass-cardinal[^>]*data-destination-type="mirrorland"/.test(html),'threshold only');

const introPhrases=[
  'For thousands of years, people have searched for better ways to understand themselves, each other, and the systems they inhabit.',
  'Philosophers questioned first principles.',
  'Each discipline illuminated part of the landscape.',
  'Perhaps the next step is not abandoning what came before',
  'The Earth did not become round when we discovered it.',
  'What if the next frontier is not outside the box, but outside the cube?',
  'Diamond Gate Bridge begins with that question.'
];
check('INTRO_COLLAPSED_BY_DEFAULT',html.includes('<details class="compass-introduction" data-compass-full-introduction>')&&!/<details class="compass-introduction"[^>]*\sopen(?:\s|>)/.test(html),'full introduction details closed by default');
check('FULL_INTRODUCTION_RECOVERABLE',introPhrases.every(p=>html.includes(p)),introPhrases);
check('MATHEMATICAL_FOUNDATION_REMOVED_FROM_COMPASS',!html.includes('Mathematical Foundation')&&!html.includes('The Collapse Predicate')&&!html.includes('Pressure–Capacity Ratio'),'removed from current Compass; preserved in git history');

check('GLOBAL_GUIDANCE_CORRECT',html.includes('Drag to rotate the constellation. Tap a primary star to open its cluster.'),'global guidance');
check('GLOBAL_GUIDANCE_NO_FALSE_SWIPE',!html.includes('Swipe to rotate the constellation'),'no global swipe instruction');
check('CLUSTER_GUIDANCE_CONTROLLER_BOUND',controller.includes('Drag to rotate the cluster. Tap a room star to select it. Swipe across open space to return to the constellation.'),'controller state guidance');
check('CARDINAL_PREVIEW_RUNTIME',html.includes('data-orbit-preview-focus')&&html.includes('CARDINAL PREVIEW · not selected')&&html.includes('applyCardinalPreview'),'live cardinal preview');
check('ROOM_PREVIEW_RUNTIME',html.includes('data-cluster-preview-primary-room')&&html.includes('ROOM PREVIEW · Enter remains locked')&&html.includes('applyRoomPreview'),'live room preview');
check('ROOM_PREVIEW_DISTINCT_FROM_SELECTED',html.includes('ROOM SELECTED · Enter unlocked')&&html.includes('enter.disabled=true'),'preview locks Enter; selected state distinct');
check('ENTER_ONLY_EXPLICIT_NAVIGATION',controller.includes('requestEnterSelection')&&html.includes('data-compass-enter'),'explicit enter authority retained');
check('RETURN_TO_ORBIT_PRESENT',html.includes('data-compass-return-to-orbit')&&html.includes('Return to Orbit'),'explicit return');
check('BACK_TO_COMPASS_PRESENT',html.includes('data-compass-mirrorland-back')&&html.includes('Back to Compass'),'Mirrorland return');

check('MIRRORLAND_INVITATIONAL_COPY',html.includes('Enter through the door to choose a world or experience.')&&!html.includes('See if you can find it'),'clear invitation and door affordance, not fake scavenger hunt');
check('MIRRORLAND_THREE_ROUTES',html.includes('>Enter the Narrative</a>')&&html.includes('>Enter the Demo</a>')&&html.includes('>See the World Map</a>'),'three threshold routes');
check('MIRRORLAND_ROUTE_TARGETS',html.includes('href="/showroom/">Enter the Narrative')&&html.includes('href="/showroom/globe/h-earth/">Enter the Demo')&&html.includes('href="/showroom/globe/audralia/">See the World Map'),'Showroom / H-Earth / Audralia map');
check('MIRRORLAND_GENERIC_ENTER_SUPPRESSED',html.includes("mode==='MIRRORLAND_FOCUSED'")&&html.includes('enter.hidden=true')&&html.includes('stopImmediatePropagation'),'generic direct redirect blocked in favor of three routes');

check('COHERENCE_DIAGNOSTIC_MONUMENT',html.includes('class="compass-monument" href="/coherence-diagnostic/"')&&html.includes('<h2>Coherence Diagnostic</h2>'),'major feature');
check('TALK_TO_HOUSE_MONUMENT',html.includes('class="compass-monument" href="/showroom/globe/hearth/jeeves/"')&&html.includes('<h2>Talk to the House</h2>'),'major feature');
check('BUILT_DIFFERENT_MAJOR_FEATURE',html.includes('class="compass-built"')&&html.includes('Built Different')&&html.includes('Software TRL 7'),'major proof feature');
check('TRL7_BOUNDED',html.includes('bounded software disposition')&&html.includes('not a claim of universal product or scientific validation'),'bounded software TRL 7 claim');
const builtIndex=html.indexOf('class="compass-built"');
const buildCtaIndex=html.indexOf('class="compass-build-cta"');
check('BUILD_YOUR_OWN_ADJACENT_TO_BUILT_DIFFERENT',builtIndex>=0&&buildCtaIndex>builtIndex&&html.slice(builtIndex,buildCtaIndex+1200).includes('Build Your Own Custom Site'),'Built Different -> custom site');
check('BUILD_ROUTE_AUTHORITATIVE',html.includes('href="/build/">Explore custom construction'),'existing build route');

check('FIBONACCI_COSMOS_PRESERVED',cosmos.includes('Fibonacci')||cosmos.includes('golden')||cosmos.includes('GOLDEN'),'repository-owned cosmos source retained');
check('NO_GENERIC_CSS_STARFIELD',!css.includes('box-shadow:0 0 0 1000px')&&!css.includes('random('),'no generic CSS starfield construction');
check('MOBILE_DISTINCT_COMPOSITION',css.includes('@media (max-width: 820px)')&&css.includes('@media (max-width: 560px)')&&css.includes('.compass-instrument__grid{grid-template-columns:1fr}'),'tablet and phone reflow');
check('REDUCED_MOTION_EQUIVALENCE',css.includes('@media (prefers-reduced-motion: reduce)')&&coreCss.includes('prefers-reduced-motion'),'reduced motion');
check('KEYBOARD_FOCUS_VISIBLE',css.includes(':focus-visible')&&coreCss.includes(':focus-visible'),'visible keyboard focus');
check('REFERENCE_LAYER_DECLARED',css.includes('Compass reference implementation — renewal v2')&&css.includes('Mirrorland remains a threshold behind the map, never a fifth direction.'),'bounded Compass layer');

let scopeBase=GOVERNING_HEAD;
const originMain=git(['rev-parse','--verify','origin/main']);
if(process.env.COMPASS_SCOPE_BASE_SHA) scopeBase=process.env.COMPASS_SCOPE_BASE_SHA;
else if(originMain.status===0) scopeBase='origin/main';
const scopeGit=git(['diff','--name-only',`${scopeBase}...HEAD`]);
if(scopeGit.status===0){
  const changed=scopeGit.stdout.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
  check('EXACT_SCOPE_ONLY',changed.every(p=>allowedPaths.has(p)),{scopeBase,changed});
  check('NO_PROHIBITED_PATH_MUTATION',changed.every(p=>!prohibitedPrefixes.some(prefix=>p.startsWith(prefix))),{scopeBase,changed});
}else{
  check('EXACT_SCOPE_ONLY',false,scopeGit.stderr||'git diff failed');
  check('NO_PROHIBITED_PATH_MUTATION',false,scopeGit.stderr||'git diff failed');
}

const failed=checks.filter(item=>!item.pass);
const receipt={schema:'COMPASS_DISPLAY_CONTINUITY_VERIFICATION_RECEIPT_v1',operationId:OPERATION_ID,lockGeneration:1471,governingHead:GOVERNING_HEAD,scopeBase,candidateHead:process.env.GITHUB_SHA||git(['rev-parse','HEAD']).stdout.trim()||null,result:failed.length===0?'PASS':'FAIL_CLOSED',staticQualification:failed.length===0?'PASS':'FAIL_CLOSED',runtimeQualification:'REQUIRES_WORKFLOW_BROWSER_EVIDENCE',checks,failures:failed.map(item=>item.id)};
fs.writeFileSync(OUTPUT,`${JSON.stringify(receipt,null,2)}\n`);
console.log(JSON.stringify(receipt,null,2));
if(failed.length) process.exit(1);
