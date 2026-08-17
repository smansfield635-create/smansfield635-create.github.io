#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const GOVERNING_HEAD = 'ad395e724cbfea1c19c9ce43393c1148fa557816';
const OPERATION_ID = 'COMPASS_INTERACTION_AND_DIAGNOSTIC_SUCCESSOR_20260816_v5';
const LOCK_GENERATION = 1507;
const OUTPUT = process.env.COMPASS_VERIFICATION_OUTPUT || '/tmp/compass-display-continuity-verification-receipt.json';
const allowedPaths = new Set([
  '.github/ai-router/router.v1.json',
  '.github/ai-router/projects/compass/entrypoint.v1.json',
  '.github/ai-router/projects/compass/construction-execution-plan.v2.interaction-diagnostic-amendment.json',
  '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs',
  '.github/workflows/compass-display-continuity-validation.yml',
  'assets/compass/compass.carousel.js',
  'assets/compass/compass.carousel.css'
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
const interactionAmendmentPath='.github/ai-router/projects/compass/construction-execution-plan.v2.interaction-diagnostic-amendment.json';
const interactionAmendment=json(interactionAmendmentPath);
const html=read('index.html');
const css=read('assets/compass/compass.css');
const coreCss=read('assets/compass/compass-core.css');
const controller=read('assets/compass/compass.controller.js');
const cosmos=read('assets/compass/compass.cosmos.js');
const carouselJs=read('assets/compass/compass.carousel.js');
const carouselCss=read('assets/compass/compass.carousel.css');
const workflow=read('.github/workflows/compass-display-continuity-validation.yml');

check('COMPASS_PLAN_V2_BOUND',entrypoint.procedures?.constructionPlan==='.github/ai-router/projects/compass/construction-execution-plan.v2.json'&&plan.schema==='COMPASS_PAGE_RECONSTRUCTION_EXECUTION_PLAN_v2'&&plan.status==='LOCKED_DIRECT_REFERENCE_REQUIRED',{entrypointPlan:entrypoint.procedures?.constructionPlan,planSchema:plan.schema,planStatus:plan.status});
check('INTERACTION_DIAGNOSTIC_AMENDMENT_BOUND',entrypoint.procedures?.constructionPlanInteractionDiagnosticAmendment===interactionAmendmentPath&&entrypoint.requiredInstructions?.includes(interactionAmendmentPath)&&interactionAmendment.schema==='COMPASS_PAGE_RECONSTRUCTION_EXECUTION_PLAN_v2_INTERACTION_DIAGNOSTIC_AMENDMENT'&&interactionAmendment.status==='LOCKED_DIRECT_REFERENCE_REQUIRED',{entrypointAmendment:entrypoint.procedures?.constructionPlanInteractionDiagnosticAmendment,requiredInstruction:entrypoint.requiredInstructions?.includes(interactionAmendmentPath),schema:interactionAmendment.schema,status:interactionAmendment.status});
check('INTERACTION_DIAGNOSTIC_LAW_BOUND',entrypoint.procedures?.interactionDiagnosticLaw==='LOCAL_ACCURATE_SWIPE_GUIDANCE + STATE_CORRECT_FUNCTION_AND_RETURN_CONTROLS + ANATOMICALLY_RECOGNIZABLE_BRAIN',entrypoint.procedures?.interactionDiagnosticLaw);
const operationBinding=interactionAmendment.operationBinding||{};
const admittedScope=Array.isArray(operationBinding.exactAdmittedMutationScope)?[...operationBinding.exactAdmittedMutationScope].sort():[];
const expectedScope=[...allowedPaths].sort();
check('INTERACTION_DIAGNOSTIC_OPERATION_BINDING_EXACT',operationBinding.operationId===OPERATION_ID&&operationBinding.operationVersion==='v5'&&operationBinding.lockGeneration===LOCK_GENERATION&&operationBinding.governingHead===GOVERNING_HEAD&&JSON.stringify(admittedScope)===JSON.stringify(expectedScope),{operationId:operationBinding.operationId,operationVersion:operationBinding.operationVersion,lockGeneration:operationBinding.lockGeneration,governingHead:operationBinding.governingHead,admittedScope,expectedScope});
const requiredRuntimeArtifacts=['/tmp/compass-interaction-diagnostic-runtime-receipt.json','/tmp/compass-interaction-diagnostic-desktop.png','/tmp/compass-interaction-diagnostic-tablet.png','/tmp/compass-interaction-diagnostic-phone.png','/tmp/compass-interaction-diagnostic-dpr3.png'];
check('WORKFLOW_EXACT_SUCCESSOR_BINDING',(workflow.match(/ref: \$\{\{ github\.event\.pull_request\.head\.sha \|\| github\.sha \}\}/g)||[]).length===2&&workflow.includes('COMPASS_CANDIDATE_HEAD: ${{ github.event.pull_request.head.sha || github.sha }}')&&workflow.includes(OPERATION_ID)&&workflow.includes(`lockGeneration:${LOCK_GENERATION}`)&&workflow.includes(GOVERNING_HEAD)&&workflow.includes("schema:'COMPASS_INTERACTION_DIAGNOSTIC_RUNTIME_RECEIPT_v1'")&&requiredRuntimeArtifacts.every(artifact=>workflow.includes(artifact)),{exactCheckoutCount:(workflow.match(/ref: \$\{\{ github\.event\.pull_request\.head\.sha \|\| github\.sha \}\}/g)||[]).length,candidateHeadBinding:workflow.includes('COMPASS_CANDIDATE_HEAD: ${{ github.event.pull_request.head.sha || github.sha }}'),operationId:workflow.includes(OPERATION_ID),lockGeneration:workflow.includes(`lockGeneration:${LOCK_GENERATION}`),governingHead:workflow.includes(GOVERNING_HEAD),runtimeSchema:workflow.includes("schema:'COMPASS_INTERACTION_DIAGNOSTIC_RUNTIME_RECEIPT_v1'"),runtimeArtifacts:requiredRuntimeArtifacts.map(artifact=>({artifact,present:workflow.includes(artifact)}))});
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

const statementGuidance='Not everything is as it first appears. Swipe the thought above.';
const capabilityGuidance='Swipe to rotate the orbit. Tap the clear card to enter.';
const houseGuidance='Swipe to choose a House guide. Tap the clear card to talk. Return to Orbit restores the capability orbit.';
check('EDITORIAL_SUCCESSOR_V5_BOUND',carouselJs.includes("version:'successor-v5'")||carouselJs.includes('version:"successor-v5"'),'CompassEditorialCarousel successor-v5');
check('STATEMENT_SWIPE_GUIDANCE_BOUND',carouselJs.includes('dataset.statementGuidance')&&carouselJs.includes('compass-statement-guidance')&&carouselJs.includes(statementGuidance),statementGuidance);
check('CAPABILITY_SWIPE_GUIDANCE_BOUND',carouselJs.includes('dataset.capabilityGuidance')&&carouselJs.includes('compass-capability-guidance')&&carouselJs.includes(capabilityGuidance)&&carouselJs.includes(houseGuidance),{capabilityGuidance,houseGuidance});
check('GUIDANCE_DESCRIBES_INTERACTION_REGIONS',carouselJs.includes("aria-describedby")&&carouselJs.includes('compass-statement-guidance')&&carouselJs.includes('compass-capability-guidance'),'statement and capability regions are programmatically described');
check('PARENT_ORBIT_HAS_NO_RETURN_CONTROL',!carouselJs.includes('data-return-parent'),'return is not rendered while browsing the capability orbit');
check('HOUSE_RETURN_ONLY_AFTER_EXPANSION',carouselJs.includes('data-return-house')&&carouselJs.includes("capabilityMode='house-members'")&&carouselJs.includes("capabilityMode='orbit'"),'expanded House family owns the return control');
const houseFunctions=[
  ['jeeves','/showroom/globe/hearth/jeeves/'],
  ['elara','/elara/'],
  ['auren','/products/auren/']
];
for(const [id,route] of houseFunctions) check(`HOUSE_${id.toUpperCase()}_FUNCTION_BOUND`,carouselJs.includes('data-house-function="${definition.id}"')&&carouselJs.includes(`id:'${id}'`)&&carouselJs.includes(route),{id,route});
check('HOUSE_RETURN_FOCUS_RESTORATION_BOUND',carouselJs.includes('.focus({preventScroll:true})')&&carouselJs.includes('data-enter-house'),'return restores focus to the House entry control');
check('ATOMIC_SWIPE_RESOLVES_ON_RELEASE',carouselJs.includes("addEventListener('pointerup'")&&carouselJs.includes('onResolve(dx<0?1:-1)')&&!/addEventListener\('pointermove'[\s\S]{0,240}onResolve\(/.test(carouselJs),'one release resolves one canonical neighbor');
const pointerDownIndex=carouselJs.indexOf("addEventListener('pointerdown'");
const pointerMoveIndex=carouselJs.indexOf("addEventListener('pointermove'",pointerDownIndex);
const delayedCaptureIndex=carouselJs.indexOf('stage.setPointerCapture?.(pointerId)',pointerMoveIndex);
const pointerUpIndex=carouselJs.indexOf("addEventListener('pointerup'",pointerMoveIndex);
check('TAP_PRESERVED_UNTIL_HORIZONTAL_DRAG_INTENT',pointerDownIndex>=0&&pointerMoveIndex>pointerDownIndex&&!carouselJs.slice(pointerDownIndex,pointerMoveIndex).includes('setPointerCapture')&&delayedCaptureIndex>pointerMoveIndex&&pointerUpIndex>delayedCaptureIndex&&carouselJs.includes("if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.25)return;"),{pointerDownIndex,pointerMoveIndex,delayedCaptureIndex,pointerUpIndex,captureBeforeMove:carouselJs.slice(pointerDownIndex,pointerMoveIndex).includes('setPointerCapture')});
check('ACTIVE_CARD_DIRECT_ACTIVATION_BOUND',carouselJs.includes("event.target!==card||(event.key!=='Enter'&&event.key!==' ')")&&carouselJs.includes("event.target!==member||(event.key!=='Enter'&&event.key!==' ')")&&carouselJs.includes("event.target.closest('a,button,input,select,textarea,[data-human-brain]')"),'tap, Enter, and Space invoke only the active clear card while brain gestures remain isolated');
check('BRAIN_GESTURE_ISOLATION_BOUND',carouselJs.includes('[role="button"],[data-human-brain]')&&workflow.includes("check('BRAIN_GESTURE_ISOLATED_FROM_CAPABILITY_ORBIT'")&&workflow.includes('value.capabilityAfter===value.capabilityBefore'),'each brain pointer gesture is proven unable to rotate the parent capability orbit');
check('CANDIDATE_BROWSER_GESTURE_GEOMETRY_BOUND',workflow.includes('await stage.scrollIntoViewIfNeeded();')&&workflow.includes('STAGE_IN_VIEW_FOR_POINTER_INJECTION')&&workflow.includes("'[data-capability=\"house\"] [data-house-parent] h2'")&&workflow.includes("check('PHONE_HOUSE_FRONT_BEFORE_ENTRY'"),'browser gestures scroll their stage into view, prove an in-viewport injection point, and enter only the visible House card');
check('ACTIVE_POSITION_ANNOUNCEMENT_BOUND',carouselJs.includes("status.setAttribute('aria-live','polite')")&&carouselJs.includes('Capability ${activeIndex+1} of ${cards.length}')&&carouselJs.includes('House guide ${memberIndex+1} of ${members.length}'),'active capability and House guide positions are announced without a visible counter');
check('ACTIVE_AND_REAR_DEPTH_STATES_BOUND',carouselCss.includes('.compass-orbit-plaque[data-slot="front"]')&&carouselCss.includes('.compass-orbit-plaque[data-slot="rear"]')&&carouselCss.includes('.house-orbit-member[data-slot="front"]')&&carouselCss.includes('.house-orbit-member[data-slot="rear-left"]')&&carouselCss.includes('.house-orbit-member[data-slot="rear-right"]')&&carouselCss.includes('blur('),'clear foreground, obscured rear depth');
check('EDITORIAL_KEYBOARD_FOCUS_VISIBLE',carouselCss.includes(':focus-visible')&&(carouselJs.includes("event.key==='ArrowRight'")||carouselJs.includes("e.key==='ArrowRight'"))&&(carouselJs.includes("event.key==='ArrowLeft'")||carouselJs.includes("e.key==='ArrowLeft'")),'keyboard parity and visible focus');
check('EDITORIAL_REDUCED_MOTION_EQUIVALENCE',carouselCss.includes('@media(prefers-reduced-motion:reduce)')||carouselCss.includes('@media (prefers-reduced-motion:reduce)')||carouselCss.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion branch');
const brainComponents=['left-hemisphere','right-hemisphere','longitudinal-fissure','cerebellum','pons','brainstem'];
const brainRegions=['frontal','temporal','parietal','occipital'];
check('ANATOMICAL_BRAIN_CONTRACT_BOUND',carouselJs.includes('COMPASS_ANATOMICAL_BRAIN_XYZ_v1')&&carouselJs.includes('anatomical-parametric-v2')&&brainComponents.every(label=>carouselJs.includes(label)),brainComponents);
check('ANATOMICAL_BRAIN_REGIONS_BOUND',brainRegions.every(label=>carouselJs.includes(label)),brainRegions);
check('ANATOMICAL_BRAIN_EYE_LEVEL_XYZ_BOUND',carouselJs.includes('eye-level-parallel')&&carouselJs.includes('dataset.brainAxes')&&carouselJs.includes('dataset.brainAxisLabels')&&carouselJs.includes('X,Y,Z'),{view:'eye-level-parallel',axes:['X','Y','Z']});
check('ANATOMICAL_BRAIN_AXES_ARE_ORIENTATION_ONLY',carouselJs.includes("dataset.brainAxisPurpose='spatial-orientation-only'")&&carouselJs.includes('X, Y and Z are spatial orientation axes only.'),'axes are disclosed as orientation references rather than diagnostic evidence');
check('ANATOMICAL_BRAIN_REDUCED_MOTION_BOUND',carouselJs.includes('static-reduced-motion')&&carouselJs.includes('slow-yaw'),'motion preference changes movement, not meaning');
check('ANATOMICAL_BRAIN_FOLDS_AND_FOLIA_BOUND',carouselJs.includes('makeSulci()')&&carouselJs.includes('makeCerebellarFolia()')&&carouselJs.includes('drawCerebellarFolia(width,height,scale)')&&carouselJs.includes('BRAIN_FOLIA'),'branching cortical sulci and cerebellar folia are part of the rendered anatomy');
check('ANATOMICAL_BRAIN_DETERMINISTIC_VIEWS_BOUND',carouselJs.includes('BRAIN_SNAPSHOT_POSES')&&carouselJs.includes("front:Object.freeze({yaw:0,pitch:0})")&&carouselJs.includes("side:Object.freeze({yaw:Math.PI/2,pitch:0})")&&carouselJs.includes("rear:Object.freeze({yaw:Math.PI,pitch:0})")&&carouselJs.includes('underside:Object.freeze')&&carouselJs.includes('brainSnapshots:Object.freeze'),'front, side, rear, and underside snapshot API');
check('ANATOMICAL_BRAIN_RENDERED_PIXEL_GATE_BOUND',workflow.includes("check('BRAIN_RENDERED_TISSUE_PIXEL_OCCUPANCY'")&&workflow.includes("check('BRAIN_NAMED_VIEW_FRAMES_DIFFER'")&&workflow.includes("check('BRAIN_FRONT_SIDE_REAR_UNDERSIDE_POSES'")&&['front','side','rear','underside'].every(view=>workflow.includes(`/tmp/compass-brain-${view}.png`)),'rendered tissue, differing frames, exact poses, and named screenshot evidence');

const requestedScopeBase=process.env.COMPASS_SCOPE_BASE_SHA||GOVERNING_HEAD;
check('EXACT_GOVERNING_BASE_BOUND',requestedScopeBase===GOVERNING_HEAD,{requestedScopeBase,governingHead:GOVERNING_HEAD});
const governingCommit=git(['rev-parse','--verify',`${GOVERNING_HEAD}^{commit}`]);
check('GOVERNING_BASE_RESOLVES',governingCommit.status===0&&governingCommit.stdout.trim()===GOVERNING_HEAD,{status:governingCommit.status,resolved:governingCommit.stdout.trim(),error:governingCommit.stderr.trim()});
const scopeBase=GOVERNING_HEAD;
const scopeGit=git(['diff','--name-only',`${scopeBase}...HEAD`]);
if(scopeGit.status===0){
  const changed=scopeGit.stdout.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
  check('EXACT_SCOPE_ONLY',changed.length>0&&changed.every(p=>allowedPaths.has(p)),{scopeBase,allowedPaths:[...allowedPaths],changed});
  check('NO_PROHIBITED_PATH_MUTATION',changed.every(p=>!prohibitedPrefixes.some(prefix=>p.startsWith(prefix))),{scopeBase,changed});
}else{
  check('EXACT_SCOPE_ONLY',false,scopeGit.stderr||'git diff failed');
  check('NO_PROHIBITED_PATH_MUTATION',false,scopeGit.stderr||'git diff failed');
}

const worktreeStatus=git(['status','--porcelain','--untracked-files=no']);
check('CANDIDATE_WORKTREE_CLEAN',worktreeStatus.status===0&&worktreeStatus.stdout.trim()==='',{status:worktreeStatus.status,changes:worktreeStatus.stdout.trim().split(/\r?\n/).filter(Boolean),error:worktreeStatus.stderr.trim()});
const checkedCandidate=git(['rev-parse','HEAD^{commit}']);
const candidateHead=(process.env.COMPASS_CANDIDATE_HEAD||checkedCandidate.stdout||'').trim();
check('EXACT_CANDIDATE_HEAD_BOUND',checkedCandidate.status===0&&/^[0-9a-f]{40}$/.test(candidateHead)&&checkedCandidate.stdout.trim()===candidateHead,{requestedCandidateHead:process.env.COMPASS_CANDIDATE_HEAD||null,checkedOutHead:checkedCandidate.stdout.trim(),status:checkedCandidate.status,error:checkedCandidate.stderr.trim()});

const failed=checks.filter(item=>!item.pass);
const receipt={schema:'COMPASS_DISPLAY_CONTINUITY_VERIFICATION_RECEIPT_v1',operationId:OPERATION_ID,lockGeneration:LOCK_GENERATION,governingHead:GOVERNING_HEAD,scopeBase,candidateHead,result:failed.length===0?'PASS':'FAIL_CLOSED',staticQualification:failed.length===0?'PASS':'FAIL_CLOSED',runtimeQualification:'REQUIRES_WORKFLOW_BROWSER_EVIDENCE',checks,failures:failed.map(item=>item.id)};
fs.writeFileSync(OUTPUT,`${JSON.stringify(receipt,null,2)}\n`);
console.log(JSON.stringify(receipt,null,2));
if(failed.length) process.exit(1);
